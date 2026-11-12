#!/usr/bin/env python3
"""Internal Work Orders: create the execution run (12 Nov 2026, QA lead travelling: standing choice, run assigned to Mudassir as runs 555-558) with every case in testrail-id-map.csv that is not held, assigned to
Mudassir (user 6, as runs 555-557). Union only on a re-run (Rule 34): an existing run id in ../applied/run.json gets its list widened, never cut."""
import sys, os, json, csv
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
sys.path.insert(0, f"{P}/../../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
PROP = json.load(open(f"{D}/proposals.json"))
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
want = sorted(ids[k] for k in ids if not PROP[k]["held"])
def all_tests(rid):
    out, off = [], 0
    while True:
        t = api(f"get_tests/{rid}&offset={off}&limit=250"); out += t["tests"]
        if not t["_links"]["next"]: return out
        off += 250
RJ = f"{P}/applied/run.json"; log = open(f"{P}/applied/create-log.jsonl", "a")
if os.path.exists(RJ):
    rid = json.load(open(RJ))["run_id"]; have = {t["case_id"] for t in all_tests(rid)}   # paged: an unpaged read stops at 250 and would cut the run
    api(f"update_run/{rid}", {"include_all": False, "case_ids": sorted(have | set(want))}); op = "update_run"
else:
    r = api("add_run/1", {"suite_id": 1, "name": "Internal Work Orders - Execution", "assignedto_id": 6, "include_all": False, "case_ids": want,
        "description": "<p>Owner: Mudassir. Created 12 Nov 2026: every Internal Work Orders case in Founder Mode &rarr; Internal Work order (11/12/2026) "
                       "(section 136701 and its 22 subsections) that is not held, assigned to Mudassir.</p>"})
    rid = r["id"]; json.dump({"run_id": rid, "url": f"https://shopview.testrail.io/index.php?/runs/view/{rid}"}, open(RJ, "w")); op = "add_run"
st = LAST["status"]; tests = all_tests(rid)
got = {x["case_id"] for x in tests}; ok = set(want) <= got and all(x["assignedto_id"] == 6 for x in tests)
log.write(json.dumps({"op": op, "run": rid, "http": st, "tests": len(got), "wanted": len(want), "readback_ok": ok}) + "\n")
print(op, rid, st, "tests", len(got), "wanted", len(want), "ok", ok)
