#!/usr/bin/env python3
"""20 Oct 2026, QA lead: bring the suite to PRD v10 ("2. Yes") and create cases for the 6 v10 rules with none ("3. Yes").
Updates every existing case whose rendered fields differ from our last read-back (edit lock on updated_on), adds the cases that have
no C-id, reads everything back, and appends the new rows to testrail-id-map.csv (keeps every existing row, incl. DR-01..DR-08).
python3 apply4.py [--apply]"""
import sys, os, json, csv
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
sys.path.insert(0, D)
import ssr_lib, importlib
for m in ["cases_s1_s2", "cases_s3_s4", "cases_s5_s8", "cases_tp", "cases_rs", "cases_rel", "cases_design"]: importlib.import_module(m)
SEC = json.load(open(f"{P}/applied/sections.json")); MAP = f"{P}/testrail-id-map.csv"
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(MAP))}
upd = []
for c in ssr_lib.CASES:
    if c["key"] not in ids: continue
    prev = json.load(open(f"{P}/applied/C{ids[c['key']]}-after.json")); f = ssr_lib.render(c)
    if any(prev.get(k) != v for k, v in f.items()): upd.append((c, f, prev))
add = [c for c in ssr_lib.CASES if c["key"] not in ids]
print("update", len(upd), "add", [c["key"] for c in add])
if "--apply" not in sys.argv: sys.exit(0)
log = open(f"{P}/applied/apply4-log.jsonl", "a"); bad = 0
def L(r): log.write(json.dumps(r, ensure_ascii=False) + "\n"); log.flush()
for c, f, prev in upd:
    cid = ids[c["key"]]; live = api(f"get_case/{cid}")
    if live["updated_on"] != prev["updated_on"]: L({"op": "refused_edit_lock", "case": f"C{cid}"}); bad += 1; continue
    if live["section_id"] != SEC[c["sec"]]: L({"op": "refused_section_mismatch", "case": f"C{cid}"}); bad += 1; continue
    json.dump(live, open(f"{P}/applied/C{cid}-before-techplan.json", "w"), indent=1, ensure_ascii=False)
    api(f"update_case/{cid}", f); st = LAST["status"]; a = api(f"get_case/{cid}")
    diff = [x for x, v in f.items() if a.get(x) != v]; bad += bool(diff)
    json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L({"op": "update_case", "key": c["key"], "case": f"C{cid}", "http": st, "readback_ok": not diff, "bad": diff})
rows = []
for c in add:
    f = ssr_lib.render(c); n = api(f"add_case/{SEC[c['sec']]}", f); st = LAST["status"]; cid = n["id"]
    a = api(f"get_case/{cid}"); ok = all(a.get(x) == v for x, v in f.items()) and a["section_id"] == SEC[c["sec"]]; bad += not ok
    json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L({"op": "add_case", "key": c["key"], "case": f"C{cid}", "http": st, "readback_ok": ok})
    rows.append([c["key"], cid, c["sec"], c["title"], f"https://shopview.testrail.io/index.php?/cases/view/{cid}"])
    with open(MAP, "a", newline="") as mf: csv.writer(mf).writerow(rows[-1])
# titles of updated cases may have changed: refresh those rows in place
allrows = list(csv.reader(open(MAP))); T = {c["key"]: c["title"] for c in ssr_lib.CASES}
for r in allrows[1:]:
    if r[0] in T: r[3] = T[r[0]]
with open(MAP, "w", newline="") as mf: csv.writer(mf).writerows(allrows)
print("added", rows); print("problems:", bad)
