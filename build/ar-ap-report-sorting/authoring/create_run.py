#!/usr/bin/env python3
"""22 Oct 2026, QA lead: "Create the teat run ... and add this to the new milestone" (milestone 5, "Next Release - More Test Runs To
Be Added (Oct 2026)"). Every case of the suite except the 6 held on Chris Ward's answers (they join when the answers are acted on,
as the Splitting Sales Representatives run did). Assigned to Bilal (user 3). python3 create_run.py [--apply]"""
import sys, os, json, csv
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
HELD = ["S1-07", "S2-35", "DATA-13", "DATA-14", "DATA-15", "REL-08"]
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
assert len(ids) == 257, len(ids)
case_ids = sorted(v for k, v in ids.items() if k not in HELD); held = {k: ids[k] for k in HELD}
desc = ("Created 22 Oct 2026 on the QA lead's order. All cases of the A/R and A/P Report Sorting, Export and Location Filter suite "
        "(group 90418) except six held on the product owner's answers: " + ", ".join(f"C{v}" for v in held.values()) +
        "; they join when the answers are acted on. No build of this feature yet; the design and the tech plan are still to come.")
print(len(case_ids), held)
if "--apply" not in sys.argv: sys.exit(0)
r = api("add_run/1", {"suite_id": 1, "name": "A/R and A/P Report Sorting, Export and Location Filter - Execution", "description": desc,
                       "milestone_id": 5, "assignedto_id": 3, "include_all": False, "case_ids": case_ids})
st = LAST["status"]; rid = r["id"]
got, off = [], 0
while True:
    t = api(f"get_tests/{rid}&limit=250&offset={off}"); t = t["tests"] if isinstance(t, dict) else t; got += t
    if len(t) < 250: break
    off += 250
ok = sorted(x["case_id"] for x in got) == case_ids
rec = {"run": rid, "http": st, "milestone": 5, "tests": len(got), "expected": len(case_ids), "match": ok, "held_out": held,
       "link": f"https://shopview.testrail.io/index.php?/runs/view/{rid}"}
json.dump(rec, open(f"{P}/applied/run.json", "w"), indent=1); print(rec)
