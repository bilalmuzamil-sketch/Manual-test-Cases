#!/usr/bin/env python3
"""22 Oct 2026: before the question sheet went to Chris Ward, 7 of the 18 drafted questions were dropped as answerable by our own sources
or by self-service (po_questions.DROPPED; QA lead: no request that wastes anyone's time), the export-limit cases were reworked
(DATA-20 runnable on the QA organization, DATA-19/DATA-21 checked by the developers) and the questions renumbered 1-11.
Updates every case whose rendered fields differ from our last read-back (edit lock on updated_on). python3 apply_update.py [--apply]"""
import sys, os, json, csv
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
PROP = json.load(open(f"{D}/proposals.json")); ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
upd = []
for k, v in PROP.items():
    prev = json.load(open(f"{P}/applied/C{ids[k]}-after.json")); f = v["fields"]
    diff = [x for x, y in f.items() if (prev.get(x) or "").replace(" ", "") != str(y).replace(" ", "")] if False else \
           [x for x, y in f.items() if (x == "refs" and (prev.get(x) or "").replace(" ", "") != y.replace(" ", "")) or (x != "refs" and prev.get(x) != y)]
    if diff: upd.append((k, ids[k], f, prev, diff))
print(len(upd), [(k, d) for k, _, _, _, d in upd])
if "--apply" not in sys.argv: sys.exit(0)
log = open(f"{P}/applied/update-2026-10-22-log.jsonl", "a"); bad = 0
os.makedirs(f"{P}/applied/before-2026-10-22-questions", exist_ok=True)
for k, cid, f, prev, diff in upd:
    live = api(f"get_case/{cid}")
    if live["updated_on"] != prev["updated_on"]: log.write(json.dumps({"op": "refused_edit_lock", "case": f"C{cid}"}) + "\n"); bad += 1; continue
    json.dump(live, open(f"{P}/applied/before-2026-10-22-questions/C{cid}-before.json", "w"), indent=1, ensure_ascii=False)
    body = {x: f[x] for x in diff}
    api(f"update_case/{cid}", body); st = LAST["status"]; a = api(f"get_case/{cid}")
    b = [x for x in diff if (a.get(x) or "").replace(" ", "") != str(f[x]).replace(" ", "")] if "refs" in diff else [x for x in diff if a.get(x) != f[x]]
    bad += bool(b)
    json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    log.write(json.dumps({"op": "update_case", "key": k, "case": f"C{cid}", "http": st, "fields": diff, "readback_ok": not b}) + "\n"); log.flush()
print("problems:", bad)
