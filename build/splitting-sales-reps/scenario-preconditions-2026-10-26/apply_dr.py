#!/usr/bin/env python3
"""26 Oct 2026, Rule 117 thirteenth amendment: write the scenario preconditions of the 6 design-recheck cases (DR-PROPOSALS.json),
custom_preconds only, with an edit lock against before/C<id>-after.json and a read-back. python3 apply_dr.py [--apply]"""
import sys, os, json
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H)
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
DR = json.load(open(f"{H}/DR-PROPOSALS.json"))
print("to update", [f"{v['key']} C{c}" for c, v in DR.items()])
if "--apply" not in sys.argv: sys.exit(0)
log = open(f"{H}/apply-dr-log.jsonl", "a"); bad = 0
for cid, v in DR.items():
    prev = json.load(open(f"{H}/before/C{cid}-after.json")); live = api(f"get_case/{cid}")
    if live["updated_on"] != prev["updated_on"]: raise SystemExit(f"C{cid} changed since the snapshot: stop")
    if live.get("custom_atmstatus") not in (None, 1): raise SystemExit(f"C{cid} is not 'Not Automated': stop (Rule 71)")
    api(f"update_case/{cid}", {"custom_preconds": v["custom_preconds"]}); st = LAST["status"]
    a = api(f"get_case/{cid}"); ok = a["custom_preconds"] == v["custom_preconds"] and all(a.get(x) == live.get(x) for x in ("title", "custom_steps", "custom_expected"))
    bad += not ok; json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    log.write(json.dumps({"op": "update_case", "key": v["key"], "case": f"C{cid}", "http": st, "readback_ok": ok}) + "\n")
print("problems:", bad)
