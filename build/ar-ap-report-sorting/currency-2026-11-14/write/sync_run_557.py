#!/usr/bin/env python3
"""14 Nov 2026 (Rules 34, 123). Adds the 6 new cases to run 557, UNION ONLY: the run's current case list plus the new C-ids (a partial case_ids
list would delete tests and their results). The 89 tests from cases someone else added (folder "Regression Tests" 134654) and every existing
test and result stay exactly as they are; nothing is removed. Refuses if the run is completed. The new tests are assigned to Mudassir (user 6)
with add_results_for_cases carrying assignedto_id only (no status), then read back. Rewritten cases are already in the run (their 11-12 Nov
results stay; the PASS-REPORT lists the ones whose expected result changed). Run after create_new.py. Dry run unless --apply.
  python3 sync_run_557.py [--apply]"""
from _common import *
import cases_v13 as V13C
RUN, ASSIGN = 557, 6
ID = ids(); new = list(V13C.NEW13)
missing = [k for k in new if k not in ID]
print("new cases", len(new), "| to add to run 557", len(new) - len(missing), "| not created yet:", missing)
from trlib import api, LAST
run = api(f"get_run/{RUN}")
if run.get("is_completed"): sys.exit(f"REFUSED: run {RUN} is completed; ask the QA lead")
if not APPLY:
    t0 = []; off = 0
    while True:
        t = api(f"get_tests/{RUN}&limit=250&offset={off}"); t = t["tests"] if isinstance(t, dict) else t; t0 += t
        if len(t) < 250: break
        off += 250
    print(f"live read: run {RUN} open, {len(t0)} tests; after the union it would hold {len(t0) + len(new)} (the {len(new)} new cases, once created, "
          f"assigned to user {ASSIGN}); no test removed")
    print("DRY RUN: nothing written."); sys.exit(0)
if missing: sys.exit("REFUSED: run create_new.py first")
readiness()
def tests():
    out, off = [], 0
    while True:
        t = api(f"get_tests/{RUN}&limit=250&offset={off}"); t = t["tests"] if isinstance(t, dict) else t; out += t
        if len(t) < 250: break
        off += 250
    return out
before = tests(); cur = sorted({t["case_id"] for t in before})
json.dump(before, open(f"{OUT}/run557-tests-before-2026-11-14.json", "w"), indent=1)
add = [ID[k] for k in new]
union = sorted(set(cur) | set(add))
L = log("run557-sync-2026-11-14-log.jsonl"); bad = 0
api(f"update_run/{RUN}", {"include_all": False, "case_ids": union}); http = LAST["status"]
after = sorted({t["case_id"] for t in tests()})
ok = after == union and set(cur) <= set(after); bad += not ok
L.write(json.dumps({"op": "update_run", "run": RUN, "http": http, "before": len(cur), "added": len(union) - len(cur), "after": len(after),
                    "union_match": ok}) + "\n")
new_ids = [c for c in add if c not in cur]
if new_ids:
    api(f"add_results_for_cases/{RUN}", {"results": [{"case_id": c, "assignedto_id": ASSIGN} for c in new_ids]}); http = LAST["status"]
    who = {t["case_id"]: t.get("assignedto_id") for t in tests()}
    wrong = [c for c in new_ids if who.get(c) != ASSIGN]; bad += bool(wrong)
    L.write(json.dumps({"op": "add_results_for_cases (assign only)", "run": RUN, "http": http, "cases": [f"C{c}" for c in new_ids],
                        "assigned_to": ASSIGN, "readback_ok": not wrong, "wrong": [f"C{c}" for c in wrong]}) + "\n")
rec = {"run": RUN, "before": len(cur), "after": len(after), "union_match": ok, "link": f"https://shopview.testrail.io/index.php?/runs/view/{RUN}",
       "problems": bad}
json.dump(rec, open(f"{OUT}/run557-sync-2026-11-14.json", "w"), indent=1); print(rec)
