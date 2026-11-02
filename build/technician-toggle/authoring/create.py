#!/usr/bin/env python3
"""Technician Toggle: add every case in proposals.json that has no C-id yet to its subsection of 113017. DRY RUN by default; nothing is
written without --apply, which only the coordinator runs, with the QA lead's go-ahead (Rule 6). Before any write it calls the
tester-readiness check (Rule 138) and refuses on failure. Held cases are created like the others but are not added to a run.
Resumable: appends testrail-id-map.csv and keeps applied/C<id>-after.json read-backs.   python3 create.py [--apply]"""
import sys, os, json, csv
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
PROP = json.load(open(f"{D}/proposals.json")); SECS = json.load(open(f"{P}/sections.json"))["sections"]
MAP = f"{P}/testrail-id-map.csv"
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(MAP))} if os.path.exists(MAP) else {}
todo = [k for k in PROP if k not in ids]
no_section = sorted({v["sec"] for k, v in PROP.items() if k in todo and not SECS[v["sec"]].get("id")})
print(f"to add {len(todo)} | already {len(ids)} | held {sum(1 for k in todo if PROP[k]['held'])} | subsections without an id: {no_section}")
sys.path.insert(0, f"{P}/../testing-tools"); import tester_readiness_check as TRC
TRC.require(P)          # Rule 138: no write unless the check passes (runs on the dry run too, so its result is always seen)
if "--apply" not in sys.argv:
    print("dry run: nothing written (add --apply, with the QA lead's go-ahead)"); sys.exit(0)
if no_section: sys.exit(f"create the subsections first and put their ids in sections.json: {no_section}")
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
os.makedirs(f"{P}/applied", exist_ok=True)
if not os.path.exists(MAP):
    with open(MAP, "w", newline="") as f: csv.writer(f).writerow(["key", "case_id", "section", "title", "link"])
log = open(f"{P}/applied/create-log.jsonl", "a"); bad = 0
for k in todo:
    v = PROP[k]; f = v["fields"]; sid = SECS[v["sec"]]["id"]
    n = api(f"add_case/{sid}", f); st = LAST["status"]; cid = n["id"]
    a = api(f"get_case/{cid}")
    diff = [x for x, y in f.items() if x != "refs" and a.get(x) != y] + (["refs"] if (a.get("refs") or "").replace(" ", "") != f["refs"].replace(" ", "") else [])
    if a["section_id"] != sid: diff.append("section")
    bad += bool(diff)
    json.dump(a, open(f"{P}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    log.write(json.dumps({"op": "add_case", "key": k, "case": f"C{cid}", "http": st, "readback_ok": not diff, "bad": diff}) + "\n"); log.flush()
    with open(MAP, "a", newline="") as mf:
        csv.writer(mf).writerow([k, cid, v["sec"], f["title"], f"https://shopview.testrail.io/index.php?/cases/view/{cid}"])
print("problems:", bad)
