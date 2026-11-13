#!/usr/bin/env python3
"""Round 4 (13 Nov 2026; was delete_three.py): delete the five cases the QA lead approved: D-87 (C1112404), D-89 (C1112406) and D-91
(C1112408) ("Yes, delete the 3", 12 Nov 2026) and S2-90 (C1112004) and S8-26 (C1112153) ("Delete both (Recommended)", 13 Nov 2026).
LOCKED: each case is re-read first and deleted only if its title and section are the ones we wrote and its body equals our last body;
a before-copy is saved to write/before/C<id>.json first. After the delete the case must answer "not found" (read-back). Deleting a case
removes its test from run 559. Nothing else is deleted: S3-48 (retired by PRD v1.3) is only proposed and waits for the QA lead.
   python3 delete_approved.py         dry run (with --check-live: re-reads and checks the lock)     python3 delete_approved.py --apply"""
import sys, csv
from _wlib import *
L = logger("delete"); M = mapping()
want = {"D-87": "1112404", "D-89": "1112406", "D-91": "1112408", "S2-90": "1112004", "S8-26": "1112153"}
plan = {d["key"]: d["case_id"] for d in PLAN["delete"]}
if plan != want: sys.exit(f"refuse: plan.json delete list {plan} is not the QA lead's five {want}")
for k, cid in want.items(): print(f"{k} C{cid} {BEFORE[k]['title']!r} in {SECS[BEFORE[k]['sec']]['name']!r}")
if not LIVE: print("dry run: nothing read or deleted"); sys.exit(0)
api, LAST = tr(); os.makedirs(f"{W}/before", exist_ok=True); gone = []
for k, cid in want.items():
    live = api(f"get_case/{cid}")
    diff = same(live, BEFORE[k]["fields"]) + ([] if live["section_id"] == SECS[BEFORE[k]["sec"]]["id"] else ["section"])
    if diff: L({"op": "lock", "key": k, "case": f"C{cid}", "result": "LOCKED", "fields": diff}); print(k, "LOCKED", diff); continue
    json.dump(live, open(f"{W}/before/C{cid}.json", "w"), indent=1, ensure_ascii=False)
    if not APPLY: L({"op": "lock", "key": k, "case": f"C{cid}", "result": "ok (dry run, not deleted)"}); continue
    _, err = safe(api, f"delete_case/{cid}", {}); st = LAST["status"]
    back, err2 = safe(api, f"get_case/{cid}")
    L({"op": "delete_case", "key": k, "case": f"C{cid}", "http": st, "error": err, "readback_ok": back is None, "readback": err2})
    if back is None: gone.append(k)
if APPLY and gone:
    rows = [r for r in M.values() if r["key"] not in gone]
    with open(f"{P}/testrail-id-map.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["key", "case_id", "section", "title", "link", "prd_version"]); w.writeheader(); w.writerows(rows)
print("deleted" if APPLY else "dry run, lock checked", gone if APPLY else "")
