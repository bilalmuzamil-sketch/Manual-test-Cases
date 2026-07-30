#!/usr/bin/env python3
"""EXECUTOR — Filters closing-authenticity pass TestRail sync (2026-07-31).

Reads the op list from push-ops.json (built by diffing the local case bodies against
a fresh live pull), sends ONLY the changed fields, then re-GETs and diffs to prove
each write landed. Per-op log flushed + fsync'd immediately so a killed run is
resumable against live state (Rule 29).

Guardrails: 110 update_case only — no add_case, no delete_case, no section ops, no
run/result writes, and section_id / type / priority / custom_atmstatus /
custom_automation_type are never sent.
"""
import json, os, sys, base64, urllib.request, urllib.error, time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from tr_api import api

OPS = json.load(open(os.path.join(HERE, "push-ops.json")))
LOG = os.path.join(HERE, "testrail-execution-log-2026-07-31.md")
SNAP = os.path.join(HERE, "pre-write-snapshot", "per-case")
POST = os.path.join(HERE, "post-push-verify")


def flush(lines):
    with open(LOG, "a") as f:
        f.write("\n".join(lines) + "\n")
        f.flush()
        os.fsync(f.fileno())


def main():
    os.makedirs(SNAP, exist_ok=True)
    os.makedirs(POST, exist_ok=True)
    # ---- pre-flight invariants on every payload -------------------------------
    for o in OPS:
        r = o["payload"].get("refs")
        if r is not None:
            assert len(r) <= 250, (o["internal_id"], len(r))
            assert "," not in r, o["internal_id"]
            assert "FLT-" not in r, o["internal_id"]
            assert "no Jira epic" in r, o["internal_id"]
        t = o["payload"].get("title")
        if t is not None:
            assert len(t) <= 80, (o["internal_id"], len(t))
        for k in o["payload"]:
            assert k in ("refs", "title", "custom_preconds", "custom_steps",
                         "custom_expected"), (o["internal_id"], k)
    flush([
        "# Filters — TestRail per-op execution log — closing-authenticity pass 2026-07-31",
        "",
        "Manifest: `testrail-sync-manifest-2026-07-31.md`. Project 1 / suite 1 / group 4110.",
        "**%d `update_case`, 0 add, 0 delete, 0 section ops, 0 run writes, 0 result writes.**"
        % len(OPS),
        "Executor `exec_push_2026-07-31.py`; each row was flushed to disk immediately after its call.",
        "",
        "| # | Internal ID | C-id | Fields sent | HTTP | re-GET verify |",
        "|---|---|---|---|---|---|",
    ])
    ok = fail = 0
    for n, o in enumerate(OPS, start=1):
        cid, iid = o["case_id"], o["internal_id"]
        st0, before = api("get_case/%d" % cid)
        if st0 != 200:
            flush(["| %d | %s | C%d | %s | **PRE-GET %s** | NOT ATTEMPTED |"
                   % (n, iid, cid, ";".join(o["payload"]), st0)])
            fail += 1
            continue
        json.dump(before, open(os.path.join(SNAP, "C%d.json" % cid), "w"), indent=1)
        st, resp = api("update_case/%d" % cid, o["payload"])
        verify = "n/a"
        if st == 200:
            st2, after = api("get_case/%d" % cid)
            json.dump(after, open(os.path.join(POST, "C%d.json" % cid), "w"), indent=1)
            diffs = [k for k, v in o["payload"].items() if (after.get(k) or "") != v]
            untouched = [k for k in ("section_id", "type_id", "priority_id",
                                     "custom_atmstatus", "custom_automation_type")
                         if before.get(k) != after.get(k)]
            if not diffs and not untouched:
                verify = "MATCH"
                ok += 1
            else:
                verify = "**MISMATCH** fields=%s moved=%s" % (diffs, untouched)
                fail += 1
        else:
            verify = "not verified — write failed: %s" % str(resp)[:160]
            fail += 1
        flush(["| %d | %s | [C%d](https://shopview.testrail.io/index.php?/cases/view/%d) | %s | %s | %s |"
               % (n, iid, cid, cid, ";".join(sorted(o["payload"])), st, verify)])
        time.sleep(0.15)
    flush(["", "**RESULT: %d/%d verified MATCH, %d failed.**" % (ok, len(OPS), fail)])
    print("verified %d/%d, failed %d" % (ok, len(OPS), fail))
    return 1 if fail else 0


if __name__ == "__main__":
    sys.exit(main())
