#!/usr/bin/env python3
"""Round 4 (13 Nov 2026, carries round 3): add to run 559 ("Internal Work Orders - Execution") the released cases and the new cases a tester can run (plan.json
"run_add", held cases never). UNION ONLY (Rules 34, 123): the live run's cases are read first and kept; nothing is removed (the 3 deleted
cases leave the run with their deletion). Run after create_new.py --apply, so the new cases have C-ids. Read back: every wanted case is in
the run and no case that was there is gone.
   python3 sync_run_559.py            dry run (with --check-live: reads the run)       python3 sync_run_559.py --apply"""
import sys
from _wlib import *
L = logger("run559"); M = mapping()
want_keys = PLAN["run_add"]; have_ids = {k: M[k]["case_id"] for k in want_keys if k in M}
print(f"to add: {len(want_keys)} ({len(have_ids)} have C-ids now; the rest get theirs from create_new.py --apply)")
held = [k for k in want_keys if NOW[k]["held"]]
if held: sys.exit(f"refuse: held cases in the run list {held}")
if not LIVE: print("dry run: nothing read or written"); sys.exit(0)
api, LAST = tr()
run = api(f"get_run/{RUN}")
if run.get("include_all"): sys.exit("refuse: run 559 includes all cases; ask the coordinator")
tests, off = [], 0
while True:
    t = api(f"get_tests/{RUN}&offset={off}&limit=250"); t = t["tests"] if isinstance(t, dict) else t; tests += t
    if len(t) < 250: break
    off += 250
have = {int(x["case_id"]) for x in tests}
missing = [k for k in want_keys if k not in M]
if APPLY and missing: sys.exit(f"refuse: no C-id yet for {missing}: run create_new.py --apply first")
add = {int(v) for v in have_ids.values()} - have
print(f"run {RUN}: {len(have)} cases now; adding {len(add)} -> {len(have | add)}")
if not APPLY: L({"op": "plan", "run": RUN, "have": len(have), "add": sorted(add)}); sys.exit(0)
api(f"update_run/{RUN}", {"include_all": False, "case_ids": sorted(have | add)}); st = LAST["status"]
tests, off = [], 0
while True:
    t = api(f"get_tests/{RUN}&offset={off}&limit=250"); t = t["tests"] if isinstance(t, dict) else t; tests += t
    if len(t) < 250: break
    off += 250
now = {int(x["case_id"]) for x in tests}
L({"op": "update_run", "run": RUN, "http": st, "tests": len(now), "wanted": len(have | add), "readback_ok": now == (have | add)})
print("run now", len(now), "ok" if now == (have | add) else "MISMATCH")
