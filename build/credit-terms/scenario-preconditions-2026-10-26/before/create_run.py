#!/usr/bin/env python3
"""23 Oct 2026, QA lead: "Get Done with all the test cases creation". Creates the run "Credit terms - Execution" in milestone 5 (as the
A/R and A/P and Splitting Sales Representatives runs), assigned to Bilal (user 3), with every case of the suite except the 9 held on
Chris Ward's answers (PO questions 3-7 and design questions 8-11); they join when the answers are acted on (union only).
python3 create_run.py [--apply]"""
import sys, os, json, csv
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
PROP = json.load(open(f"{D}/proposals.json"))
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
assert len(ids) == len(PROP) == 344, (len(ids), len(PROP))
HELD = [k for k, v in PROP.items() if v["held"] and "waiting on the PO" in v["automation"]]
case_ids = sorted(v for k, v in ids.items() if k not in HELD); held = {k: ids[k] for k in HELD}
desc = ("Created 23 Oct 2026 on the QA lead's order. All cases of the Credit terms suite (group 91454, epic SV-11638, PRD v3 and the "
        "design canvas \"Default Credit Terms\") except nine held on the product owner's answers: " + ", ".join(f"C{v}" for v in held.values()) +
        "; they join when the answers are acted on. No build of this feature yet; the tech plan is still to come.")
print(len(case_ids), held)
if "--apply" not in sys.argv: sys.exit(0)
r = api("add_run/1", {"suite_id": 1, "name": "Credit terms - Execution", "description": desc, "milestone_id": 5, "assignedto_id": 3,
                       "include_all": False, "case_ids": case_ids})
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
