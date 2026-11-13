#!/usr/bin/env python3
"""Round 4 finish (13 Nov 2026): update_cases.py wrote and read back all 636 updates, then stopped at the first move_cases_to_section call
(TestRail answers a move with an empty body; known trap, APP-ACTIONS-PLAYBOOK). This does the 9 moves with that handled, reads each case's
section back, and writes testrail-id-map.csv (prd_version 1.3, title, section) as update_cases.py would have."""
import sys, os, json, csv
W = os.path.dirname(os.path.abspath(__file__)); P = os.path.abspath(f"{W}/../..")
sys.path.insert(0, f"{P}/../../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
PLAN = json.load(open(f"{W}/plan.json")); SECS = json.load(open(f"{P}/sections.json"))
SECS = SECS.get("sections", SECS)
NOW = json.load(open(f"{P}/authoring/proposals.json"))
rows = list(csv.DictReader(open(f"{P}/testrail-id-map.csv"))); M = {r["key"]: r for r in rows}
log = open(f"{W}/log-update.jsonl", "a")
moves = PLAN["move"]
for sec in sorted({m["to"] for m in moves}):
    ids = [int(m["case_id"]) for m in moves if m["to"] == sec]
    sid = SECS[sec]["id"] if isinstance(SECS[sec], dict) else SECS[sec]
    todo = [c for c in ids if api(f"get_case/{c}")["section_id"] != sid]
    if todo:
        try: api(f"move_cases_to_section/{sid}", {"suite_id": 1, "case_ids": todo})   # corrected 13 Nov 2026: the path takes the destination section id
        except json.JSONDecodeError: pass
    for c in ids:
        ok = api(f"get_case/{c}")["section_id"] == sid; k = next(m["key"] for m in moves if int(m["case_id"]) == c)
        log.write(json.dumps({"op": "move_case", "key": k, "case": f"C{c}", "to": sec, "http": LAST["status"], "readback_ok": ok, "already_there": c not in todo}) + "\n")
        print(k, c, sec, ok)
        if ok: M[k]["section"] = sec
for u in PLAN["update"]:
    k = u["key"]; M[k]["prd_version"] = "1.3"; M[k]["title"] = NOW[k]["title"]
with open(f"{P}/testrail-id-map.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["key", "case_id", "section", "title", "link", "prd_version"]); w.writeheader(); w.writerows(M.values())
print("map rows", len(M))
