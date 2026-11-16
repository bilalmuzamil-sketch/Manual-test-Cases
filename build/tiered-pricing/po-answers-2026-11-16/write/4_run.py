#!/usr/bin/env python3
"""(4) Run 560 "Tiered Pricing - Execution": add the 16 released held cases and the 9 new cases; take S3-40 (C1211562, now held on question 33)
out (QA lead 16 Nov 2026: cases held on 32/33 stay out of run 560). UNION ONLY otherwise (Rules 34, 123): the run's tests are read PAGED, saved,
and update_run gets sorted((current - {S3-40}) | wanted). S3-40 is taken out only when its test has no result with a status (a recorded
tester verdict would be lost): otherwise it is left in and reported. Deleted cases leave the run by themselves (checked: none of the 25 was in
it). Afterwards every prior test except S3-40 must still be there, every released case of the library must be in the run and no held case;
tests not assigned to user 6 are assigned with add_results_for_cases carrying assignedto_id only (no status).
Log: log-run.jsonl.   python3 4_run.py [--apply]"""
import json, sys
from _w import *
L = logger("run"); PR = prop(); M = idmap()
released = {int(M[k]["case_id"]) for k in PR if not PR[k]["held"]}
held = {int(M[k]["case_id"]) for k in PR if PR[k]["held"]}
OUT = int(M["S3-40"]["case_id"])
readiness()
run = api(f"get_run/{RUN}"); cur = paged(f"get_tests/{RUN}", "tests"); have = {t["case_id"] for t in cur}
print(f"live run {RUN}: {run['name']!r}, completed {run['is_completed']}, include_all {run['include_all']}, tests {len(cur)}")
if run["is_completed"] or run["include_all"]: sys.exit("REFUSED: the run is completed or includes all cases")
add = sorted(released - have); stale = sorted(have - released - held)
t40 = [t for t in cur if t["case_id"] == OUT]
res40 = paged(f"get_results/{t40[0]['id']}", "results") if t40 else []
verdicts40 = [r for r in res40 if r.get("status_id")]
take_out = bool(t40) and not verdicts40
print(f"PLAN: add {len(add)} cases {add}\n  take out S3-40 C{OUT}: {'yes' if take_out else 'no'} (in run {bool(t40)}, results {len(res40)}, with a status {len(verdicts40)})"
      f"\n  tests in the run whose case is no longer in the library (deleted cases leave by themselves): {stale}"
      f"\n  expected tests after: {len((have - ({OUT} if take_out else set())) | released)} (library released cases {len(released)})")
if not APPLY: print("dry run: nothing written"); sys.exit(0)
json.dump(cur, open(f"{W}/run560-tests-before-2026-11-16.json", "w"), indent=1)
union = sorted((have - ({OUT} if take_out else set())) | released)
api(f"update_run/{RUN}", {"include_all": False, "case_ids": union}); st = LAST["status"]
after = paged(f"get_tests/{RUN}", "tests"); got = {t["case_id"] for t in after}
ok = released <= got and (have - {OUT}) <= got and not ((held - ({0} if take_out else {OUT})) & got)
L({"op": "update_run", "run": RUN, "http": st, "before": len(have), "after": len(got), "added": [f"C{c}" for c in add],
   "taken_out": [f"C{OUT}"] if take_out else [], "readback_ok": ok, "held_in_run": [f"C{c}" for c in held & got]})
un = sorted({t["case_id"] for t in after if t.get("assignedto_id") != ASSIGN})
for i in range(0, len(un), 100):
    part = un[i:i + 100]
    api(f"add_results_for_cases/{RUN}", {"results": [{"case_id": c, "assignedto_id": ASSIGN} for c in part]})
    L({"op": "add_results_for_cases (assign only)", "run": RUN, "http": LAST["status"], "cases": [f"C{c}" for c in part]})
final = paged(f"get_tests/{RUN}", "tests")
wrong = [t["case_id"] for t in final if t.get("assignedto_id") != ASSIGN]
json.dump(final, open(f"{W}/run560-tests-after-2026-11-16.json", "w"), indent=1)
L({"op": "readback_assignment", "run": RUN, "assigned_to": ASSIGN, "tests": len(final), "readback_ok": not wrong, "wrong": wrong})
print("run", RUN, "before", len(have), "after", len(final), "ok", ok and not wrong); sys.exit(0 if ok and not wrong else 1)
