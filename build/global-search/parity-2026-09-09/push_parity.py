#!/usr/bin/env python3
"""Push the Global Search V1-parity case(s) to TestRail section 6769 and add them to run R415.

SAFE TO RE-RUN. Dedupes by exact title, so a second run adds nothing.
NOTHING IS EVER DELETED, and no existing case is modified.

Requires credentials. Resolves them via build/testing-tools/load_creds.py, which tries all
three sources (env vars, /tmp/shopview-creds.env, /tmp/testrail/creds.json) and names them if
all three miss - see build/skills/14-ACCESS-RESILIENCE.md, the documented Rule-97 false blocker.

    python3 build/global-search/parity-2026-09-09/push_parity.py            # dry run, prints payload
    python3 build/global-search/parity-2026-09-09/push_parity.py --apply    # writes

Formatting: BLOCK TAGS ONLY (<p>, <ul><li>, <hr />). Never <br> and never inline styling tags -
they render LITERALLY when submitted via the API (CLAUDE.md section 5; APP-ACTIONS-PLAYBOOK J).
Automation status: 1 "Not Automated" via the canonical builder, which raises on 3 (Rules 38/65).
"""
import base64
import csv
import json
import os
import sys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "build", "testing-tools"))

from load_creds import testrail_creds            # noqa: E402
from testrail_add_case import add_case_payload    # noqa: E402

HOST = "https://shopview.testrail.io"
SECTION_ID = 6769   # "Global Search V2 - V1 Regression Suite" (under group 6720)
RUN_ID = 415        # R415 - the live Global Search V2 run
APPLY = "--apply" in sys.argv

CASES = json.load(open(os.path.join(HERE, "cases", "parity-cases.json")))
AUDIT = os.path.join(HERE, "AUDIT-LOG.csv")
IDMAP = os.path.join(HERE, "testrail-id-map.csv")


def esc(s):
    """Escape for HTML text nodes. Angle brackets in case text would otherwise be swallowed."""
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def block_list(items):
    return "<ul>" + "".join(f"<li>{esc(i)}</li>" for i in items) + "</ul>"


def block_ol(items):
    return "<ol>" + "".join(f"<li>{esc(i)}</li>" for i in items) + "</ol>"


def build_expected(c):
    """Expected + <hr /> + provenance (<p> label, <ul> bullets, <p> date) + AUTOMATION marker."""
    return (
        block_ol(c["expected"])
        + "<hr />"
        + f"<p>{esc(c['provenance_intro'])}</p>"
        + block_list(c["provenance_bullets"])
        + f"<p>{esc(c['provenance_date'])}</p>"
        + f"<p>{esc(c['automation_marker'])}</p>"
    )


def req(path, payload=None):
    url = f"{HOST}/index.php?/api/v2/{path}"
    data = json.dumps(payload).encode() if payload is not None else None
    r = urllib.request.Request(url, data=data)
    r.add_header("Content-Type", "application/json")
    r.add_header("Authorization", "Basic " + base64.b64encode(f"{EMAIL}:{KEY}".encode()).decode())
    try:
        with urllib.request.urlopen(r, timeout=120) as x:
            return x.status, json.loads(x.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        return e.code, {"error": e.read().decode()[:400]}


def existing_titles():
    """Page get_cases and return {title: id} for SECTION_ID. Project 1 is single-suite mode:
    never send suite_id, it is rejected with HTTP 400 (skill 14)."""
    out, offset = {}, 0
    while True:
        st, body = req(f"get_cases/1&section_id={SECTION_ID}&limit=250&offset={offset}")
        if st != 200:
            raise SystemExit(f"get_cases failed HTTP {st}: {body}")
        chunk = body.get("cases", body if isinstance(body, list) else [])
        for c in chunk:
            out[c["title"]] = c["id"]
        if len(chunk) < 250:
            return out
        offset += 250


if __name__ == "__main__":
    for c in CASES:
        payload = add_case_payload(
            title=c["title"],
            refs=c["refs"],
            preconds=block_list(c["preconditions"]),
            steps=block_ol(c["steps"]),
            expected=build_expected(c),
            priority_id=3,   # Medium-High; matches the sibling regression cases
        )
        if not APPLY:
            print(f"--- DRY RUN {c['id']} -> section {SECTION_ID} ---")
            print(json.dumps(payload, indent=1)[:1800])
            continue

        EMAIL, KEY = testrail_creds()
        if not EMAIL or not KEY:
            raise SystemExit("no TestRail credentials in any of the three sources - see skill 14")

        have = existing_titles()
        rows, audit = [], []
        if c["title"] in have:
            cid = have[c["title"]]
            audit.append(["skip-exists", c["id"], f"C{cid}", "-", "already present, not modified"])
        else:
            st, body = req(f"add_case/{SECTION_ID}", payload)
            cid = body.get("id")
            ok = "created" if st == 200 and cid else f"FAILED {body}"
            audit.append(["add_case", c["id"], f"C{cid}" if cid else "-", st, ok])
            if st != 200 or not cid:
                raise SystemExit(f"add_case failed HTTP {st}: {body}")
            # Rule 50 verification: read the case back and confirm it is really there.
            vst, vbody = req(f"get_case/{cid}")
            audit.append(["get_case-verify", c["id"], f"C{cid}", vst,
                          "verified" if vbody.get("title") == c["title"] else "TITLE MISMATCH"])
        rows.append([c["id"], f"C{cid}", c["title"], c["area"], c["refs"]])

        # Rule 34: UNION-ONLY run sync. A partial case_ids list DELETES tests and their results.
        st, body = req(f"get_tests/{RUN_ID}&limit=250")
        current = {t["case_id"] for t in body.get("tests", [])} if st == 200 else set()
        if st != 200:
            audit.append(["get_tests", c["id"], f"C{cid}", st, f"FAILED - run NOT synced: {body}"])
        elif cid in current:
            audit.append(["run-sync", c["id"], f"C{cid}", "-", f"already in R{RUN_ID}"])
        else:
            union = sorted(current | {cid})
            st2, body2 = req(f"update_run/{RUN_ID}", {"case_ids": union})
            audit.append(["update_run", c["id"], f"C{cid}", st2,
                          f"union {len(current)}->{len(union)}" if st2 == 200 else f"FAILED {body2}"])

        with open(AUDIT, "a", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            if f.tell() == 0:
                w.writerow(["operation", "internal_id", "case_id", "http_status", "verification"])
            w.writerows(audit)
        with open(IDMAP, "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(["internal_id", "testrail_case_id", "title", "section", "refs"])
            w.writerows(rows)
        print(f"done. audit -> {AUDIT}")
        print(f"NOW RUN THE RENDER SELF-CHECK (mandatory, CLAUDE.md section 5):")
        print(f"  python3 build/testing-tools/check_case_render.py C{cid}")
