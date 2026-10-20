#!/usr/bin/env python3
"""Re-used 19 Oct 2026 for Rule 117 eleventh amendment (Source paragraph merged into "From:" lines above the quotes).
First used 19 Oct 2026: QA lead asked why a design-vs-PRD note sat above "References from Design" when the block below already holds the
design's words. Six design cases carried such a note; it now sits inside the block (Rule 117, tenth amendment). Updates only cases
whose rendered fields differ from our last read-back (edit lock on updated_on), reads each back.  python3 apply3.py [--apply]"""
import sys, os, json, csv
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
sys.path.insert(0, D)
import ssr_lib, importlib
for m in ["cases_s1_s2", "cases_s3_s4", "cases_s5_s8", "cases_tp", "cases_rs", "cases_rel", "cases_design"]: importlib.import_module(m)
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
todo = []
new = [c["key"] for c in ssr_lib.CASES if c["key"] not in ids]   # 20 Oct 2026: new cases have no C-id yet; this script only updates
print("new, no C-id yet (not created by this script):", new)
for c in ssr_lib.CASES:
    if c["key"] in new: continue
    prev = json.load(open(f"{P}/applied/C{ids[c['key']]}-after.json")); f = ssr_lib.render(c)
    if any(prev.get(k) != v for k, v in f.items()): todo.append((c, f, prev))
print("to update:", [f"{c['key']} C{ids[c['key']]}" for c, _, _ in todo])
if "--apply" not in sys.argv: sys.exit(0)
log = open(f"{P}/applied/apply3-log.jsonl", "a"); bad = 0
for c, f, prev in todo:
    cid = ids[c["key"]]; live = api(f"get_case/{cid}")
    if live["updated_on"] != prev["updated_on"]: log.write(json.dumps({"op": "refused_edit_lock", "case": f"C{cid}"}) + "\n"); bad += 1; continue
    json.dump(live, open(f"{P}/applied/C{cid}-before-apply3.json", "w"), indent=1, ensure_ascii=False)
    api(f"update_case/{cid}", f); st = LAST["status"]; a = api(f"get_case/{cid}")
    ok = all(a.get(k) == v for k, v in f.items()); bad += not ok
    json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    log.write(json.dumps({"op": "update_case", "key": c["key"], "case": f"C{cid}", "http": st, "readback_ok": ok}) + "\n"); log.flush()
print("problems:", bad)
