#!/usr/bin/env python3
"""Bill To: create the execution run (QA lead go-ahead 10 Nov 2026) with every case in testrail-id-map.csv that is not held, assigned to
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
    r = api("add_run/1", {"suite_id": 1, "name": "Bill To - Execution", "assignedto_id": 6, "include_all": False, "case_ids": want,
        "description": "<p>Owner: Mudassir. Created 10 Nov 2026 on the QA lead's order: every Bill To case in Founder Mode &rarr; Bill To "
                       "(section 132467 and its 24 subsections) that is not held, assigned to Mudassir.</p>"})
    rid = r["id"]; json.dump({"run_id": rid, "url": f"https://shopview.testrail.io/index.php?/runs/view/{rid}"}, open(RJ, "w")); op = "add_run"
st = LAST["status"]; tests = all_tests(rid)
got = {x["case_id"] for x in tests}; ok = set(want) <= got and all(x["assignedto_id"] == 6 for x in tests)
log.write(json.dumps({"op": op, "run": rid, "http": st, "tests": len(got), "wanted": len(want), "readback_ok": ok}) + "\n")
print(op, rid, st, "tests", len(got), "wanted", len(want), "ok", ok)
