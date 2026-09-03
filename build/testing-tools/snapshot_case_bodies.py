#!/usr/bin/env python3
"""Rule 87 — snapshot every case body in a TestRail group so a FOREIGN edit is always diffable.

WHY THIS EXISTS
---------------
Rule 87 requires that we can always answer "what exactly did somebody else change in this case?".
Without a prior snapshot the answer is "we cannot tell" — which is exactly what happened with
Vladimir's 2026-08-27 edits to C27792 and C27805: real, visible, and permanently undiffable because
nothing had been captured beforehand. This tool closes that gap going forward.

WHAT IT DOES
------------
Reads (GET only — this tool NEVER writes to TestRail) every case under a top-level TestRail group
(a depth-0 section) and writes ONE JSON FILE PER CASE into

    build/<project-slug>/case-snapshots/<YYYY-MM-DD>/C<id>.json

with a FIXED key order and stable formatting, so `git diff` between two dated snapshots reads as a
per-case, per-field change list rather than as noise.

THE PAGING TRAP (this is not optional)
--------------------------------------
`get_cases` and `get_sections` are BOTH paged at 250 and an unpaged call SILENTLY UNDER-RETURNS —
it returns the first page and no error. The estate has 627 sections / 4,170 cases, so an unpaged
`get_sections` returns 250 sections and then "finds" zero cases in every section it never saw.
Everything here pages to exhaustion and asserts it did.

USAGE
-----
    python3 build/testing-tools/snapshot_case_bodies.py --project custom-roles --group 3527
    python3 build/testing-tools/snapshot_case_bodies.py --project report-suite --group 4281
    python3 build/testing-tools/snapshot_case_bodies.py --selftest
    python3 build/testing-tools/snapshot_case_bodies.py --help

Credentials are resolved by load_creds.testrail_creds() — TESTRAIL_* environment variables, then
/tmp/shopview-creds.env, then /tmp/testrail/creds.json (--creds selects that last one) — and are
NEVER written to the repo, logged, or echoed. This repo is public.
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request
from datetime import date

# The exact fields a snapshot records, IN THIS ORDER. Do not reorder: the order is what keeps a
# `git diff` between two snapshot dates readable.
SNAPSHOT_FIELDS = (
    "id",
    "title",
    "refs",
    "preconds",
    "steps",
    "expected",
    "custom_atmstatus",
    "updated_on",
    "created_by",
)

# snapshot key -> TestRail API field
API_FIELD = {
    "id": "id",
    "title": "title",
    "refs": "refs",
    "preconds": "custom_preconds",
    "steps": "custom_steps",
    "expected": "custom_expected",
    "custom_atmstatus": "custom_atmstatus",
    "updated_on": "updated_on",
    "created_by": "created_by",
}

PAGE = 250
DEFAULT_CREDS = "/tmp/testrail/creds.json"
REPO_ROOT_DEFAULT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))


# --------------------------------------------------------------------------- credentials


def load_creds(path: str = DEFAULT_CREDS):
    """(base_url, basic_auth_header_value) -- delegated to load_creds.py. Never logged.

    2026-09-03: this function used to run its OWN search and it had a specific failure
    mode: it required HOST **and** user **and** password from the environment before it
    would look at anything else, then went straight to `open(path)` -- so with no
    TESTRAIL_HOST set and no JSON file it raised FileNotFoundError, never once looking at
    /tmp/shopview-creds.env, where credentials do live. A reader that checks fewer places
    is what made a session declare a false blocker on 2026-09-02. Never re-implement the
    lookup here - a second copy is a second thing to be wrong (Rule 97).

    Contract unchanged: same 2-tuple, same SystemExit (not a traceback) when nothing is
    found anywhere, and `path` (the --creds flag) still selects the JSON source.
    """
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from load_creds import testrail_creds, testrail_host
    try:
        user, pwd = testrail_creds(path)
    except RuntimeError as exc:
        raise SystemExit(
            f"{exc}\nset TESTRAIL_EMAIL/TESTRAIL_API_KEY (optionally TESTRAIL_HOST) or "
            f"provide {path} (chmod 600, /tmp only, never committed)"
        ) from None
    auth = "Basic " + base64.b64encode(f"{user}:{pwd}".encode()).decode()
    return f"{testrail_host(path)}/index.php?/api/v2/", auth


# --------------------------------------------------------------------------- transport (GET only)


def make_getter(base_url: str, auth: str):
    """Return get(path) -> parsed JSON. GET ONLY — this tool never writes to TestRail."""

    def get(path: str):
        req = urllib.request.Request(base_url + path, method="GET")
        req.add_header("Authorization", auth)
        req.add_header("Content-Type", "application/json")
        last = None
        for attempt in range(4):
            try:
                with urllib.request.urlopen(req, timeout=90) as resp:
                    raw = resp.read().decode()
                    return json.loads(raw) if raw else None
            except urllib.error.HTTPError as exc:
                body = exc.read().decode()
                if exc.code in (429, 502, 503) and attempt < 3:
                    time.sleep(3 * (attempt + 1))
                    continue
                raise SystemExit(f"TestRail GET {path} -> HTTP {exc.code}: {body[:300]}")
            except Exception as exc:  # transient network
                last = exc
                if attempt < 3:
                    time.sleep(3 * (attempt + 1))
                    continue
        raise SystemExit(f"TestRail GET {path} failed: {last}")

    return get


def page_all(get, path_builder, collection_key):
    """Exhaustively page a TestRail v2 list endpoint.

    An UNPAGED call silently under-returns, so every list read goes through here. Stops only when a
    page comes back short AND `_links.next` is absent — never on the first short-looking page alone.
    """
    out, offset, guard = [], 0, 0
    while True:
        guard += 1
        if guard > 1000:
            raise SystemExit(f"paging {collection_key} exceeded 1000 pages — refusing to loop")
        data = get(path_builder(offset))
        if isinstance(data, dict) and collection_key in data:
            chunk = data[collection_key]
            has_next = bool((data.get("_links") or {}).get("next"))
        else:  # very old response shape: a bare list
            chunk = data or []
            has_next = False
        out.extend(chunk)
        if has_next or len(chunk) == PAGE:
            offset += PAGE
            continue
        return out


# --------------------------------------------------------------------------- pure helpers


def descendant_section_ids(sections, group_id: int):
    """Every section id at or beneath `group_id`, by walking parent_id links.

    `get_cases&section_id=` returns only that section's DIRECT cases, so a group snapshot has to
    resolve the whole subtree first.
    """
    group_id = int(group_id)
    children = {}
    known = set()
    for s in sections:
        sid = int(s["id"])
        known.add(sid)
        parent = s.get("parent_id")
        children.setdefault(None if parent is None else int(parent), []).append(sid)
    if group_id not in known:
        raise SystemExit(f"section {group_id} is not in this project/suite — refusing to snapshot")
    out, stack = set(), [group_id]
    while stack:
        sid = stack.pop()
        if sid in out:
            continue
        out.add(sid)
        stack.extend(children.get(sid, []))
    return out


def snapshot_record(case):
    """One case -> the snapshot dict, exactly SNAPSHOT_FIELDS, in order."""
    return {key: case.get(API_FIELD[key]) for key in SNAPSHOT_FIELDS}


def serialise(record):
    """Deterministic bytes for one record.

    sort_keys is deliberately OFF — SNAPSHOT_FIELDS order is the readable order. ensure_ascii is OFF
    so an em dash diffs as an em dash. A trailing newline keeps the file POSIX-clean.
    """
    return json.dumps(record, indent=1, ensure_ascii=False, sort_keys=False) + "\n"


def snapshot_dir(repo_root: str, project_slug: str, when: str) -> str:
    return os.path.join(repo_root, "build", project_slug, "case-snapshots", when)


def case_filename(case_id) -> str:
    return f"C{int(case_id)}.json"


# --------------------------------------------------------------------------- the pass


def run_snapshot(project_slug, group_id, project_id, suite_id, when, repo_root, creds_path, mine_only, dry_run):
    base_url, auth = load_creds(creds_path)
    get = make_getter(base_url, auth)

    sections = page_all(
        get,
        lambda off: f"get_sections/{project_id}&suite_id={suite_id}&limit={PAGE}&offset={off}",
        "sections",
    )
    wanted = descendant_section_ids(sections, group_id)

    cases = page_all(
        get,
        lambda off: f"get_cases/{project_id}&suite_id={suite_id}&limit={PAGE}&offset={off}",
        "cases",
    )
    in_group = [c for c in cases if int(c.get("section_id", -1)) in wanted]
    ours = [c for c in in_group if c.get("created_by") == 3]
    selected = ours if mine_only else in_group

    out_dir = snapshot_dir(repo_root, project_slug, when)
    if not dry_run:
        os.makedirs(out_dir, exist_ok=True)
        for case in selected:
            with open(os.path.join(out_dir, case_filename(case["id"])), "w") as fh:
                fh.write(serialise(snapshot_record(case)))
        manifest = {
            "project": project_slug,
            "group_section_id": int(group_id),
            "testrail_project_id": int(project_id),
            "testrail_suite_id": int(suite_id),
            "snapshot_date": when,
            "captured_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "sections_in_project": len(sections),
            "sections_in_group": len(wanted),
            "cases_in_project": len(cases),
            "cases_in_group": len(in_group),
            "cases_ours_created_by_3": len(ours),
            "cases_foreign": len(in_group) - len(ours),
            "cases_written": len(selected),
            "mine_only": bool(mine_only),
            "fields": list(SNAPSHOT_FIELDS),
            "case_ids": sorted(int(c["id"]) for c in selected),
        }
        with open(os.path.join(out_dir, "MANIFEST.json"), "w") as fh:
            fh.write(json.dumps(manifest, indent=1, ensure_ascii=False) + "\n")

    # SUMMARY ONLY (Rule 88 — never read the bulk into a session's context)
    print(f"project           : {project_slug}")
    print(f"group section     : {group_id}")
    print(f"sections (project): {len(sections)}  paged")
    print(f"sections (group)  : {len(wanted)}")
    print(f"cases (project)   : {len(cases)}  paged")
    print(f"cases (group)     : {len(in_group)}   ours={len(ours)}  foreign={len(in_group) - len(ours)}")
    print(f"files written     : {0 if dry_run else len(selected)}{'  (DRY RUN)' if dry_run else ''}")
    print(f"output            : {out_dir}")
    return 0


# --------------------------------------------------------------------------- selftest


def selftest():
    """Offline checks of every pure part. No network, no credentials, no writes to the repo."""
    import tempfile

    failures = []

    def check(name, cond, detail=""):
        print(f"  {'PASS' if cond else 'FAIL'}  {name}{'' if cond else '  -> ' + detail}")
        if not cond:
            failures.append(name)

    print("selftest: snapshot_case_bodies.py")

    # 1 · paging must not stop on a full first page
    pages = {0: [{"id": i} for i in range(PAGE)], PAGE: [{"id": 9001}]}
    calls = []

    def fake_get(path):
        off = int(path.split("offset=")[1])
        calls.append(off)
        chunk = pages.get(off, [])
        return {"cases": chunk, "_links": {"next": "more" if off + PAGE in pages else None}}

    got = page_all(fake_get, lambda off: f"get_cases/1&offset={off}", "cases")
    check("paging follows _links.next past a full page", len(got) == PAGE + 1, f"got {len(got)}")
    check("paging issued two requests", calls == [0, PAGE], str(calls))

    # 2 · paging must also work when _links is absent and the page is exactly full
    pages2 = {0: [{"id": i} for i in range(PAGE)], PAGE: [{"id": 1}, {"id": 2}]}
    got2 = page_all(fake_get if False else (lambda p: {"cases": pages2.get(int(p.split("offset=")[1]), [])}),
                    lambda off: f"get_cases/1&offset={off}", "cases")
    check("paging continues on an exactly-full page with no _links", len(got2) == PAGE + 2, f"got {len(got2)}")

    # 3 · descendant walk over a synthetic tree
    tree = [
        {"id": 10, "parent_id": None},
        {"id": 11, "parent_id": 10},
        {"id": 12, "parent_id": 11},
        {"id": 20, "parent_id": None},
        {"id": 21, "parent_id": 20},
    ]
    check("descendants include the group and every level below", descendant_section_ids(tree, 10) == {10, 11, 12},
          str(descendant_section_ids(tree, 10)))
    check("descendants exclude a sibling subtree", 21 not in descendant_section_ids(tree, 10))
    try:
        descendant_section_ids(tree, 999)
        check("unknown group id is refused", False, "no SystemExit raised")
    except SystemExit:
        check("unknown group id is refused", True)

    # 4 · record shape: exactly the nine fields, in order, mapped from the API names
    case = {
        "id": 5, "title": "t", "refs": "SV-1", "custom_preconds": "p", "custom_steps": "s",
        "custom_expected": "e", "custom_atmstatus": 3, "updated_on": 123, "created_by": 3,
        "estimate": "ignored", "section_id": 10,
    }
    rec = snapshot_record(case)
    check("record has exactly the nine snapshot fields, in order", tuple(rec.keys()) == SNAPSHOT_FIELDS, str(tuple(rec.keys())))
    check("record maps custom_preconds -> preconds", rec["preconds"] == "p")
    check("record maps custom_expected -> expected", rec["expected"] == "e")
    check("record drops fields outside the snapshot set", "estimate" not in rec and "section_id" not in rec)
    check("a missing field becomes null rather than an error", snapshot_record({"id": 1})["title"] is None)

    # 5 · serialisation is deterministic, non-ASCII-preserving, newline-terminated
    a, b = serialise(rec), serialise(dict(rec))
    check("serialisation is byte-stable across runs", a == b)
    check("serialisation ends with a newline", a.endswith("\n"))
    em = serialise(snapshot_record({"id": 1, "title": "a — b"}))
    check("serialisation keeps non-ASCII literal (diffable)", "—" in em and "\\u2014" not in em)
    check("serialisation round-trips", json.loads(a)["expected"] == "e")

    # 6 · paths
    check("snapshot dir is build/<project>/case-snapshots/<date>",
          snapshot_dir("/r", "custom-roles", "2026-08-28").endswith("/r/build/custom-roles/case-snapshots/2026-08-28"),
          snapshot_dir("/r", "custom-roles", "2026-08-28"))
    check("case filename is C<id>.json", case_filename(30518) == "C30518.json")

    # 7 · writing the same record twice is byte-identical (a clean re-run makes no diff)
    with tempfile.TemporaryDirectory() as tmp:
        p = os.path.join(tmp, case_filename(rec["id"]))
        open(p, "w").write(serialise(rec))
        first = open(p, "rb").read()
        open(p, "w").write(serialise(snapshot_record(case)))
        check("re-snapshotting unchanged data produces no diff", open(p, "rb").read() == first)

    print(f"selftest: {'ALL PASS' if not failures else str(len(failures)) + ' FAILURE(S): ' + ', '.join(failures)}")
    return 0 if not failures else 1


# --------------------------------------------------------------------------- cli


def main(argv=None):
    ap = argparse.ArgumentParser(
        prog="snapshot_case_bodies.py",
        description="Rule 87 — snapshot every case body in a TestRail group so a foreign edit is diffable. READ-ONLY.",
        epilog=(
            "examples:\n"
            "  %(prog)s --project custom-roles --group 3527\n"
            "  %(prog)s --project report-suite --group 4281\n"
            "  %(prog)s --project report-suite --group 4281 --dry-run\n"
            "  %(prog)s --selftest\n"
            "\n"
            "diffing a foreign edit:\n"
            "  git diff <older-date>..<newer-date> -- build/<project>/case-snapshots/\n"
            "  diff -ru build/<project>/case-snapshots/<A> build/<project>/case-snapshots/<B>\n"
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    ap.add_argument("--project", help="project slug — the build/<slug>/ directory the snapshot lands in")
    ap.add_argument("--group", type=int, help="TestRail top-level group (depth-0 section id), e.g. 3527 or 4281")
    ap.add_argument("--project-id", type=int, default=1, help="TestRail project id (default: 1)")
    ap.add_argument("--suite-id", type=int, default=1, help="TestRail suite id (default: 1)")
    ap.add_argument("--date", default=date.today().isoformat(), help="snapshot date folder (default: today)")
    ap.add_argument("--repo-root", default=REPO_ROOT_DEFAULT, help="repository root (default: this file's repo)")
    ap.add_argument("--creds", default=DEFAULT_CREDS, help=f"credentials file (default: {DEFAULT_CREDS})")
    ap.add_argument("--mine-only", action="store_true",
                    help="snapshot only our cases (created_by == 3). Default captures FOREIGN cases too — "
                         "which is the point of Rule 87, since foreign edits are what we need to diff.")
    ap.add_argument("--dry-run", action="store_true", help="count and report, write nothing")
    ap.add_argument("--selftest", action="store_true", help="run offline self-checks and exit")
    args = ap.parse_args(argv)

    if args.selftest:
        return selftest()
    if not args.project or not args.group:
        ap.error("--project and --group are required (or use --selftest)")
    return run_snapshot(args.project, args.group, args.project_id, args.suite_id, args.date,
                        args.repo_root, args.creds, args.mine_only, args.dry_run)


if __name__ == "__main__":
    sys.exit(main())
