#!/usr/bin/env python3
"""The three build-label corrections, each proven against a visible string on v3.5-65d6500.

Rule 57 line: these are LABELS, not expectations.  Every assertion is left exactly as it was;
only the name of the control the tester must find is corrected to the one on screen.  A case
that sends a tester hunting for wording that does not exist is not runnable, which is the whole
point of this pass.

All THREE text fields go on every payload -- TestRail re-renders any text field it is not sent.
Every write is re-GET and byte-compared field by field (tr.update_case_verified, Rule 50).
The oplog is written after EVERY operation.
"""
import json, sys, datetime
sys.path.insert(0, "/tmp/testrail"); import tr

OPLOG = "/home/user/Manual-test-Cases/build/schedule/finish-2026-08-12/evidence/testrail-oplog.json"

EDITS = [
    dict(cid=30008, field="custom_preconds",
         old="'Filter and Display'", new="'Filter & display'",
         why="the toolbar dropdown reads 'Filter & display'; read live from its open panel on v3.5-65d6500"),
    dict(cid=29946, field="custom_steps",
         old="the 'Filter' button", new="the 'Filters' button",
         why="the sidebar control reads 'Filters'; read live on v3.5-65d6500"),
    dict(cid=29946, field="custom_expected",
         old="the 'Filter' button", new="the 'Filters' button",
         why="same control named in the expected result; the assertion itself is untouched"),
    dict(cid=30058, field="custom_steps",
         old="the 'this shift only' scope", new="the 'This shift only' scope",
         why="the delete-scope dialog offers 'This shift only'; read on this same build"),
]

def log(e):
    e["at"] = datetime.datetime.utcnow().isoformat() + "Z"
    rows = json.load(open(OPLOG)) if __import__("os").path.exists(OPLOG) else []
    rows.append(e); json.dump(rows, open(OPLOG, "w"), indent=1)
    print(f"  [{e['op']}] {e['result']}")

def main():
    by_case = {}
    for e in EDITS: by_case.setdefault(e["cid"], []).append(e)
    for cid, edits in by_case.items():
        st, c = tr.get_case(cid)
        if st != 200: raise RuntimeError(f"read C{cid} HTTP {st}")
        payload = {k: c.get(k) for k in ("custom_preconds", "custom_steps", "custom_expected")}
        applied = []
        for e in edits:
            cur = payload[e["field"]] or ""
            if e["old"] not in cur:
                log({"op": f"C{cid} {e['field']}", "result": "SKIPPED - old text not present", "old": e["old"]})
                continue
            payload[e["field"]] = cur.replace(e["old"], e["new"])
            applied.append(e)
        if not applied:
            continue
        print(f"--- C{cid}: payload built, {len(applied)} replacement(s); fields sent: {sorted(payload)}")
        for e in applied:
            print(f"      {e['field']}: {e['old']!r} -> {e['new']!r}")
        st, report, before, after = tr.update_case_verified(cid, payload, "label-fix")
        log({"op": f"update_case C{cid}", "result": f"HTTP {st} :: {report}",
             "replacements": [{"field": e["field"], "old": e["old"], "new": e["new"], "why": e["why"]} for e in applied]})

if __name__ == "__main__":
    main()
