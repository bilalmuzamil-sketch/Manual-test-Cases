#!/usr/bin/env python3
"""22 Oct 2026, QA lead: "Please create the test cases for now" (A/R and A/P Report Sorting, Export and Location Filter, group 90418).
Adds every case in proposals.json that has no C-id yet (resumable), reads each back, keeps applied/C<id>-after.json and appends
testrail-id-map.csv. python3 create.py [--apply]"""
import sys, os, json, csv
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
PROP = json.load(open(f"{D}/proposals.json")); MAP = f"{P}/testrail-id-map.csv"
if not os.path.exists(MAP):
    with open(MAP, "w", newline="") as f: csv.writer(f).writerow(["key", "case_id", "section", "title", "link"])
done = {r["key"] for r in csv.DictReader(open(MAP))}
todo = [k for k in PROP if k not in done]
print("to add", len(todo), "already", len(done))
if "--apply" not in sys.argv: sys.exit(0)
# the sections must hold no case that is not ours from this pass
for sec in sorted({v["section_id"] for v in PROP.values()}):
    r = api(f"get_cases/1&section_id={sec}"); cs = r["cases"] if isinstance(r, dict) else r
    extra = [c["id"] for c in cs if str(c["id"]) not in {row["case_id"] for row in csv.DictReader(open(MAP))}]
    if extra: raise SystemExit(f"section {sec} already has cases {extra}: stop")
log = open(f"{P}/applied/create-log.jsonl", "a"); bad = 0
for k in todo:
    v = PROP[k]; f = v["fields"]
    n = api(f"add_case/{v['section_id']}", f); st = LAST["status"]; cid = n["id"]
    a = api(f"get_case/{cid}")
    diff = [x for x, y in f.items() if x != "refs" and a.get(x) != y] + (["refs"] if (a.get("refs") or "").replace(" ", "") != f["refs"].replace(" ", "") else [])
    if a["section_id"] != v["section_id"]: diff.append("section")
    bad += bool(diff)
    json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    log.write(json.dumps({"op": "add_case", "key": k, "case": f"C{cid}", "http": st, "readback_ok": not diff, "bad": diff}) + "\n"); log.flush()
    with open(MAP, "a", newline="") as mf:
        csv.writer(mf).writerow([k, cid, v["sec"], f["title"], f"https://shopview.testrail.io/index.php?/cases/view/{cid}"])
print("problems:", bad)
