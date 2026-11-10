#!/usr/bin/env python3
"""10 Nov 2026 (QA lead: "Yes, both"; Rules 34, 123). Adds the new cases that are not held on a PO question to run 557, UNION ONLY: the
run's current case list plus the new C-ids (a partial case_ids list would delete tests and their results). Left out: S3-32 (held on
question 18; joins when Chris Ward answers). REL-14 goes in, as the 12 other release-day cases are in run 557 (run on release day).
REL-08 C715478 leaves the run only by its deletion (deleting a case removes its test); this script never removes a case.
Run it after create_v11.py. Dry run unless --apply.  python3 run557_sync.py [--apply]"""
from _common import *
RUN = 557; HELD = {"S3-32": "question 18"}
ID = ids(); new = [k for k, st in STAMP.items() if st["status"] == "NEW"]
add_keys = [k for k in new if k not in HELD]
missing = [k for k in add_keys if k not in ID]
print("new cases", len(new), "| to add to run 557", len(add_keys), "| held out", HELD)
if missing: print("not created yet (run create_v11.py first):", missing)
if not APPLY: print("DRY RUN: nothing written."); sys.exit(0)
if missing: sys.exit("REFUSED: create the new cases first")
readiness()
from trlib import api, LAST
def tests():
    got, off = [], 0
    while True:
        t = api(f"get_tests/{RUN}&limit=250&offset={off}"); t = t["tests"] if isinstance(t, dict) else t; got += t
        if len(t) < 250: break
        off += 250
    return got
before = tests(); cur = sorted({t["case_id"] for t in before})
json.dump(before, open(f"{OUT}/run557-tests-before-2026-11-10.json", "w"), indent=1)
union = sorted(set(cur) | {ID[k] for k in add_keys})
api(f"update_run/{RUN}", {"include_all": False, "case_ids": union}); http = LAST["status"]
after = sorted({t["case_id"] for t in tests()})
ok = after == union and set(cur) <= set(after)
rec = {"op": "update_run", "run": RUN, "http": http, "before": len(cur), "added": len(union) - len(cur), "after": len(after), "match": ok,
       "held_out": {k: f"{v}, C{ID.get(k, '?')}" for k, v in HELD.items()}, "rel08_still_in_run": 715478 in after,
       "link": f"https://shopview.testrail.io/index.php?/runs/view/{RUN}"}
json.dump(rec, open(f"{OUT}/run557-sync-2026-11-10.json", "w"), indent=1); print(rec)
