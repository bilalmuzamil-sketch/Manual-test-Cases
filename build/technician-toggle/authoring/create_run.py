#!/usr/bin/env python3
"""QA lead, 2 Nov 2026: "Yes, write it all". Creates the run "Technician Toggle - Execution" in milestone 5 (as the Credit terms run),
assigned to Bilal (user 3), with every Technician Toggle case written to TestRail that is not held (held cases join when released;
union only, Rules 34 and 123). python3 create_run.py [--apply]"""
import sys, os, json, csv
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
PROP = json.load(open(f"{D}/proposals.json"))
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
assert len(ids) == 228, len(ids)
case_ids = sorted(v for k, v in ids.items() if not PROP[k]["held"]); held = sorted(v for k, v in ids.items() if PROP[k]["held"])
desc = ("Created 2 Nov 2026 on the QA lead's order. Technician Toggle suite (section 113017, epic SV-11788, PRD v17 and the design canvas "
        f"\"Technician Toggle\"): every case except the {len(held)} held ones (29 release-day cases run on production around the release, "
        "17 waiting on Chris Ward's answers, 5 waiting on the release or a Public API request); they join when released. No build of this "
        "feature has been checked yet.")
print(len(case_ids), "to run,", len(held), "held out")
if "--apply" not in sys.argv: sys.exit(0)
r = api("add_run/1", {"suite_id": 1, "name": "Technician Toggle - Execution", "description": desc, "milestone_id": 5, "assignedto_id": 3,
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
