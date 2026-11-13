#!/usr/bin/env python3
"""Round 4 (13 Nov 2026, carries round 3): add the new cases (plan.json "create": what PRD v1.1 adds with no case) to their subsections of section 136701, with their
design pictures, by running authoring/create.py (which calls the tester-readiness check first and refuses on failure, Rule 138, adds only
cases with no C-id that a tester can set up, reads every case and picture back, and appends testrail-id-map.csv).
   python3 create_new.py            dry run        python3 create_new.py --apply   the writes (QA lead's go-ahead, Rule 6)"""
import runpy, sys, os
from _wlib import *
def upload_one(cid, name):
    """Used by update_cases.py for a picture a rewritten body newly names (none in this pass)."""
    from _upload import upload
    return upload(cid, name)


if __name__ == "__main__":
    want = set(PLAN["create"]); M = mapping()
    todo = [k for k in NOW if k not in M and not NOW[k]["automation"].startswith("AUTOMATION: HOLD - a tester cannot set this up")]
    if set(todo) != want: sys.exit(f"refuse: create.py would add {sorted(todo)}, the plan says {sorted(want)}")
    sys.argv = [f"{AU}/create.py"] + (["--apply"] if APPLY else [])
    runpy.run_path(f"{AU}/create.py", run_name="__main__")
