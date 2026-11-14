#!/usr/bin/env python3
"""(c) Run 559 "Internal Work Orders - Execution": UNION ONLY (Rules 34, 123). The run's current cases are read in pages of 250 (a partial
case_ids list DELETES tests and their results) and kept; the 48 released new cases (plan-v14.json "run_add_new"; the 6 held never) are
added, and any released touched case missing from the run is added back. The new tests are then assigned to user 6 with
add_results_for_cases carrying assignedto_id only (no status). Read back: every wanted case is in the run, no case that was there is gone,
no held case is in it, and every new test is assigned to user 6.
   python3 sync_run_v14.py               dry run (plan only)
   python3 sync_run_v14.py --check-live  dry run that also reads the run and its tests (GET only)
   python3 sync_run_v14.py --apply       the writes (QA lead's go-ahead, Rule 6). Run after create_v14.py --apply."""
import sys, json
from _v14 import *
L = logger("run"); M = mapping(); ASSIGN = PLAN["assign_to"]
new_keys, keep_keys = PLAN["run_add_new"], PLAN["run_keep_touched"]
held = [k for k in new_keys + keep_keys if NOW[k]["held"]]
if held: sys.exit(f"refuse: held cases in the run list {held}")
held_new = [c["key"] for c in PLAN["create"] if c["held"]]
print(f"run {RUN}: add {len(new_keys)} released new cases ({sum(k in M for k in new_keys)} have C-ids now; the rest get theirs from create_v14.py --apply);"
      f" check {len(keep_keys)} released touched cases are in it; held out: {held_new}; assign new tests to user {ASSIGN}")
if not LIVE: print("dry run: nothing read or written"); sys.exit(0)
api, LAST = tr()
run = api(f"get_run/{RUN}")
if run.get("is_completed"): sys.exit(f"refuse: run {RUN} is completed; ask the QA lead")
if run.get("include_all"): sys.exit(f"refuse: run {RUN} includes all cases; ask the coordinator")
before = tests(api, RUN); have = {int(t["case_id"]) for t in before}
missing_ids = [k for k in new_keys if k not in M]
if APPLY and missing_ids: sys.exit(f"refuse: no C-id yet for {missing_ids}: run create_v14.py --apply first")
want_new = {int(M[k]["case_id"]) for k in new_keys if k in M}
want_keep = {int(M[k]["case_id"]) for k in keep_keys}
add = (want_new | want_keep) - have
held_ids = {int(M[k]["case_id"]) for k in held_new if k in M}
unassigned_other = sum(1 for t in before if t.get("assignedto_id") != ASSIGN)
print(f"run {RUN} '{run.get('name')}': {len(have)} tests now | touched released already in it {len(want_keep & have)} of {len(want_keep)} | "
      f"adding {len(add)} -> {len(have | add)} (+{len(missing_ids)} new cases once created) | tests not assigned to user {ASSIGN} now: {unassigned_other}")
if not APPLY:
    L({"op": "plan", "run": RUN, "tests_now": len(have), "add_now": sorted(add), "add_after_create": len(missing_ids), "touched_missing": sorted(want_keep - have)}); sys.exit(0)
json.dump(before, open(f"{W}/run{RUN}-tests-before.json", "w"), indent=1)
union = sorted(have | add)
api(f"update_run/{RUN}", {"include_all": False, "case_ids": union}); st = LAST["status"]
after = tests(api, RUN); now = {int(t["case_id"]) for t in after}
okr = now == set(union) and have <= now and not (held_ids & now)
L({"op": "update_run", "run": RUN, "http": st, "before": len(have), "added": len(add), "after": len(now), "readback_ok": okr})
todo = sorted(c for c in add if any(int(t["case_id"]) == c and t.get("assignedto_id") != ASSIGN for t in after))
for i in range(0, len(todo), 100):
    part = todo[i:i + 100]
    api(f"add_results_for_cases/{RUN}", {"results": [{"case_id": c, "assignedto_id": ASSIGN} for c in part]}); st = LAST["status"]
    L({"op": "add_results_for_cases (assign only)", "run": RUN, "http": st, "cases": [f"C{c}" for c in part], "assigned_to": ASSIGN})
who = {int(t["case_id"]): t.get("assignedto_id") for t in tests(api, RUN)}
wrong = sorted(c for c in add if who.get(c) != ASSIGN)
L({"op": "readback_assignment", "run": RUN, "added": len(add), "readback_ok": not wrong, "wrong": [f"C{c}" for c in wrong]})
print("run now", len(now), "union ok" if okr else "MISMATCH", "| assignment", "ok" if not wrong else f"WRONG {wrong}")
