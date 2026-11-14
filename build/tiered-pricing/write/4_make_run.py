#!/usr/bin/env python3
"""(d) ONE test run "Tiered Pricing - Execution" in suite 1 with every released (not held) Tiered Pricing case, assigned to user 6 (Mudassir).
First run: add_run with include_all false and the released C-ids. Re-runs: UNION ONLY (Rules 34, 123) - the run's current tests are read
paged (an unpaged read stops at 250 and a partial case_ids list deletes tests and their results), snapshot saved, update_run with
sorted(current | wanted); refuses if the run is completed or includes all cases; afterwards every prior test must still be there and no held
case may be in it. Every test not assigned to user 6 is assigned with add_results_for_cases carrying assignedto_id only (no status).
Log: log-run.jsonl; run id in run.json.   python3 4_make_run.py [--apply]"""
import json, sys, os
from _tp import *
L = logger("run"); PR = prop(); M = mapping()
released = sorted(int(M[k]["case_id"]) for k in PR if k in M and not PR[k]["held"])
held_ids = {int(M[k]["case_id"]) for k in PR if k in M and PR[k]["held"]}
n_rel = sum(not v["held"] for v in PR.values())
print(f"PLAN: run {RUN_NAME!r}, assigned to user {ASSIGN}: {n_rel} released cases ({len(released)} have C-ids), {len(PR) - n_rel} held cases left out")
readiness()
api, LAST = tr()
rid = json.load(open(RUNJ))["run_id"] if os.path.exists(RUNJ) else None
if rid:
    run = api(f"get_run/{rid}"); cur = tests(api, rid)
    print(f"live run {rid}: {run['name']!r}, completed {run['is_completed']}, include_all {run['include_all']}, tests {len(cur)}")
    if run["is_completed"] or run["include_all"]: sys.exit("REFUSED: the run is completed or includes all cases; ask the QA lead")
else:
    u, err = safe(api, f"get_user/{ASSIGN}")
    print(f"no run yet; user {ASSIGN}:", (u or {}).get("name", err))
if not APPLY: print("dry run: nothing written (add --apply, with the QA lead's go-ahead)"); sys.exit(0)
if not released: sys.exit("REFUSED: no released case has a C-id yet (run 2_create_cases.py --apply first)")
if rid:
    have = {t["case_id"] for t in cur}
    json.dump(cur, open(f"{W}/run{rid}-tests-before.json", "w"), indent=1)
    union = sorted(have | set(released))
    api(f"update_run/{rid}", {"include_all": False, "case_ids": union}); op = "update_run"
else:
    r = api(f"add_run/{api(f'get_suite/{SUITE}')['project_id']}", {"suite_id": SUITE, "name": RUN_NAME, "assignedto_id": ASSIGN, "include_all": False,
        "case_ids": released, "description": "Tiered Pricing (section 138770 and its subfolders): every case that is not held, assigned to Mudassir. "
        "Held cases (waiting on Matt Barge's answers, staging data from before the release, AccountingHub) join when they are released."})
    rid = r["id"]; have = set(); op = "add_run"
    json.dump({"run_id": rid, "url": f"https://shopview.testrail.io/index.php?/runs/view/{rid}"}, open(RUNJ, "w"))
st = LAST["status"]; after = tests(api, rid); got = {t["case_id"] for t in after}
ok = set(released) <= got and have <= got and not (held_ids & got)
L({"op": op, "run": rid, "http": st, "before": len(have), "after": len(got), "wanted": len(released), "readback_ok": ok})
un = sorted({t["case_id"] for t in after if t.get("assignedto_id") != ASSIGN})
for i in range(0, len(un), 100):
    part = un[i:i + 100]
    api(f"add_results_for_cases/{rid}", {"results": [{"case_id": c, "assignedto_id": ASSIGN} for c in part]})
    L({"op": "add_results_for_cases (assign only)", "run": rid, "http": LAST["status"], "cases": [f"C{c}" for c in part]})
wrong = [t["case_id"] for t in tests(api, rid) if t.get("assignedto_id") != ASSIGN]
L({"op": "readback_assignment", "run": rid, "assigned_to": ASSIGN, "readback_ok": not wrong, "wrong": wrong})
print(op, rid, "tests", len(got), "ok", ok and not wrong); sys.exit(0 if ok and not wrong else 1)
