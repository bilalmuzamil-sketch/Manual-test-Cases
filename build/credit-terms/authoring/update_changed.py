#!/usr/bin/env python3
"""23 Oct 2026: after the question sheet was shared with Chris Ward, the held markers and notes no longer say "not sent yet". Updates
every created case whose proposal differs from our last read-back, with an edit lock (the live case must still equal our read-back,
updated_by us), and reads each back. python3 update_changed.py [--apply]"""
import sys, os, json, csv
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
PROP = json.load(open(f"{D}/proposals.json"))
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
def diff(prev, f):
    return [x for x, y in f.items() if (((prev.get(x) or "").replace(" ", "") != y.replace(" ", "")) if x == "refs" else prev.get(x) != y)]
upd = [(k, cid) for k, cid in ids.items() if diff(json.load(open(f"{P}/applied/C{cid}-after.json")), PROP[k]["fields"])]
print("to update", [f"{k} C{c}" for k, c in upd])
if "--apply" not in sys.argv: sys.exit(0)
os.makedirs(f"{P}/applied/before-sheet-shared", exist_ok=True)
log = open(f"{P}/applied/create-log.jsonl", "a"); bad = 0
for k, cid in upd:
    prev = json.load(open(f"{P}/applied/C{cid}-after.json")); live = api(f"get_case/{cid}")
    if live["updated_on"] != prev["updated_on"]: raise SystemExit(f"C{cid} changed by someone since our read-back: stop")
    json.dump(live, open(f"{P}/applied/before-sheet-shared/C{cid}.json", "w"), indent=1, ensure_ascii=False)
    f = PROP[k]["fields"]; api(f"update_case/{cid}", f); st = LAST["status"]
    a = api(f"get_case/{cid}"); d = diff(a, f); bad += bool(d)
    json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    log.write(json.dumps({"op": "update_case", "key": k, "case": f"C{cid}", "http": st, "readback_ok": not d, "bad": d, "why": "question sheet shared 23 Oct: marker and note no longer say not sent yet"}) + "\n")
print("problems:", bad)
