#!/usr/bin/env python3
"""26 Oct 2026, Rule 117 fourteenth amendment + Rule 137: write the 6 design-recheck cases from DR-PATTERN.json (title, preconditions,
steps, expected), with an edit lock against applied/C<id>-after.json and a read-back. python3 apply_dr_pattern.py [--apply]"""
import sys, os, json
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H)
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
DR = json.load(open(f"{H}/DR-PATTERN.json")); KEYS = ("title", "custom_preconds", "custom_steps", "custom_expected")
todo = []
for key, v in DR.items():
    cid = int(v["case_id"]); prev = json.load(open(f"{P}/applied/C{cid}-after.json"))
    d = [x for x in KEYS if x in v["fields"] and prev.get(x) != v["fields"][x]]
    if d: todo.append((key, cid, d))
print("to update", [(k, f"C{c}", d) for k, c, d in todo])
if "--apply" not in sys.argv: sys.exit(0)
sys.path.insert(0, "/home/user/Manual-test-Cases/build/testing-tools"); import tester_readiness_check as _TRC; _TRC.require("/home/user/Manual-test-Cases/build/splitting-sales-reps", ["pattern-format-2026-10-26/DR-PATTERN.json"])  # Rule 138: no write unless the check passes
log = open(f"{H}/apply-dr-pattern-log.jsonl", "a"); bad = 0
for key, cid, d in todo:
    prev = json.load(open(f"{P}/applied/C{cid}-after.json")); live = api(f"get_case/{cid}")
    if live["updated_on"] != prev["updated_on"]: raise SystemExit(f"C{cid} changed since our read-back: stop")
    if live.get("custom_atmstatus") not in (None, 1): raise SystemExit(f"C{cid} is not 'Not Automated': stop (Rule 71)")
    f = {x: DR[key]["fields"][x] for x in d}; api(f"update_case/{cid}", f); st = LAST["status"]
    a = api(f"get_case/{cid}"); ok = all(a.get(x) == y for x, y in f.items()); bad += not ok
    json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    log.write(json.dumps({"op": "update_case", "key": key, "case": f"C{cid}", "http": st, "fields": d, "readback_ok": ok}) + "\n")
print("problems:", bad)
