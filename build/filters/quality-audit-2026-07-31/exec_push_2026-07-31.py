#!/usr/bin/env python3
"""Execute the 2 authorized TestRail update_case ops of the 2026-07-31 Filters
partial-audit execution, flushing a per-op log immediately after each call.

Reads the AFTER bodies straight from the local case JSON (single source of truth,
already committed in Phase 1), sends ONLY the changed field(s), then re-GETs and
diffs to prove the write landed.

  op1  update_case/29558  FLT-BAR-02    custom_preconds
  op2  update_case/29590  FLT-ASSET-02  custom_expected

Guardrails: no add_case, no delete_case, no section ops, no run/result writes,
titles + refs + section_id untouched. Creds from /tmp/tr-creds.env (never logged).
"""
import json, os, glob, sys, time, urllib.request, base64

HERE = os.path.dirname(os.path.abspath(__file__))
FILTERS = os.path.dirname(HERE)
CASES_DIR = os.path.join(FILTERS, "cases")
LOG = os.path.join(HERE, "testrail-execution-log-2026-07-31.md")
POST = os.path.join(HERE, "post-push-verify")
BASE = "https://shopview.testrail.io/index.php?/api/v2/"

USER = os.environ["TESTRAIL_USER"]
KEY = os.environ["TESTRAIL_KEY"]
AUTH = "Basic " + base64.b64encode(("%s:%s" % (USER, KEY)).encode()).decode()

OPS = [
    ("FLT-BAR-02", 29558, "custom_preconds", "preconditions", "FIX-WORDING #1 — pin the tab: add the 'You are on the All tab' precondition"),
    ("FLT-ASSET-02", 29590, "custom_expected", "expected", "FIX-WORDING #2 — drop the over-broad expected 3 (the 'No' direction = FLT-ASSET-07 / C38878)"),
]


def api(path, payload=None):
    req = urllib.request.Request(BASE + path)
    req.add_header("Authorization", AUTH)
    req.add_header("Content-Type", "application/json")
    data = None
    if payload is not None:
        data = json.dumps(payload).encode()
    try:
        with urllib.request.urlopen(req, data, timeout=60) as r:
            return r.status, json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, {"error": e.read().decode()[:400]}


def local_body(iid):
    for f in sorted(glob.glob(os.path.join(CASES_DIR, "cases-*.json"))):
        for c in json.load(open(f)):
            if c["id"] == iid:
                return c
    raise KeyError(iid)


def flush(lines):
    with open(LOG, "a") as f:
        f.write("\n".join(lines) + "\n")
        f.flush()
        os.fsync(f.fileno())


def main():
    os.makedirs(POST, exist_ok=True)
    flush([
        "# Filters — TestRail per-op execution log — 2026-07-31",
        "",
        "Authorized PARTIAL execution of `USEFULNESS-AUDIT-2026-07-31.md` (manifest:",
        "`testrail-execution-manifest-2026-07-31.md`). Project 1 / suite 1 / group 4110 only.",
        "**2 `update_case` ops, 0 add, 0 delete, 0 section ops, 0 run writes.**",
        "Executor: `exec_push_2026-07-31.py`. Each entry was flushed to disk immediately after the call.",
        "",
        "| # | Op | Internal ID | C-id | Section | Field | HTTP | re-GET verify |",
        "|---|---|---|---|---|---|---|---|",
    ])
    rows, details, ok = [], [], 0
    for n, (iid, cid, field, local_key, why) in enumerate(OPS, start=1):
        want = "\n".join(local_body(iid)[local_key])
        st, resp = api("update_case/%d" % cid, {field: want})
        got = (resp or {}).get(field)
        verified = "MATCH" if st == 200 and got == want else "FAIL"
        # independent re-GET (not just the update response body)
        st2, fresh = api("get_case/%d" % cid)
        reget = "MATCH" if st2 == 200 and fresh.get(field) == want else "MISMATCH(HTTP %s)" % st2
        if st == 200 and verified == "MATCH" and reget == "MATCH":
            ok += 1
        json.dump(fresh, open(os.path.join(POST, "%s_C%d.json" % (iid, cid)), "w"),
                  indent=1, ensure_ascii=False)
        rows.append("| %d | update_case/%d | %s | C%d | %s | `%s` | **%s** | %s |"
                    % (n, cid, iid, cid, fresh.get("section_id"), field, st, reget))
        details.append("### op %d — %s (C%d)\n\n- Reason: %s\n- HTTP **%s**, response-body field %s, "
                       "independent re-GET %s\n- Title after: `%s`\n- refs after: `%s`\n- section_id after: "
                       "`%s`\n\n**Field value now live:**\n\n```\n%s\n```\n"
                       % (n, iid, cid, why, st, verified, reget, fresh.get("title"),
                          fresh.get("refs"), fresh.get("section_id"), want))
        flush([rows[-1]])
        time.sleep(0.4)

    flush([""] + details + [
        "## Result",
        "",
        "- **%d / %d ops HTTP 200 + re-GET MATCH.**" % (ok, len(OPS)),
        "- 0 `add_case`, 0 `add_section`, 0 `delete_case`, 0 `delete_section`.",
        "- **0 run/result writes** — no execution run was touched.",
        "- Titles, `refs`, `section_id`, priority and type unchanged on both cases "
        "(the ≤80-char title trims are HELD).",
        "- Pre-write snapshots: `pre-push-snapshot/`; post-write re-GETs: `post-push-verify/`.",
        "",
    ])
    print("%d/%d ops verified" % (ok, len(OPS)))
    sys.exit(0 if ok == len(OPS) else 1)


if __name__ == "__main__":
    main()
