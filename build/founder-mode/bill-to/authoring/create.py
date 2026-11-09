#!/usr/bin/env python3
"""Bill To: add every case in proposals.json that has no C-id yet to its subsection of TestRail section 132467 (suite 1, Founder Mode).
DRY RUN by default: it prints the plan and writes nothing. --apply is run only by the coordinator, with the QA lead's go-ahead (Rule 6),
after the subsections exist and their ids are in sections.json. Before any write it calls the tester-readiness check (Rule 138) and
refuses on failure. Held cases are created like the others (unless the QA lead says to leave them out, NO_MANUAL) but are not added to a
run; the run list it prints is the union-only candidate set (Rules 34 and 123). Resumable: appends testrail-id-map.csv (with the PRD
version each case was written for, so a mapped case keeps it) and keeps applied/C<id>-after.json read-backs.   python3 create.py [--apply]"""
import sys, os, json, csv
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
PROP = json.load(open(f"{D}/proposals.json")); SECS = json.load(open(f"{P}/sections.json"))["sections"]
MAP = f"{P}/testrail-id-map.csv"
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(MAP))} if os.path.exists(MAP) else {}
NO_MANUAL = set()   # filled only on the QA lead's answer about NO-MANUAL-PROPOSAL.md
todo = [k for k in PROP if k not in ids and k not in NO_MANUAL]
print("PLAN (dry run unless --apply)")
print(f"{'key':7} {'subsection of 132467':58} {'cases':>5} {'held':>5} {'to run':>6}")
for s, v in SECS.items():
    ks = [k for k in todo if PROP[k]["sec"] == s]
    print(f"{s:7} {v['name'][:58]:58} {len(ks):5} {sum(PROP[k]['held'] for k in ks):5} {sum(not PROP[k]['held'] for k in ks):6}   id {v.get('id')}")
print(f"total to add {len(todo)} | already {len(ids)} | held (not for a run) {sum(PROP[k]['held'] for k in todo)} | for the run {sum(not PROP[k]['held'] for k in todo)}")
print("held by reason:", dict(Counter(PROP[k]["automation"] for k in todo if PROP[k]["held"])))
no_section = sorted({PROP[k]["sec"] for k in todo if not SECS[PROP[k]["sec"]].get("id")})
print("subsections still to create (no id in sections.json):", no_section)
sys.path.insert(0, f"{P}/../../testing-tools"); import tester_readiness_check as TRC
TRC.require(P)          # Rule 138: no write unless the check passes (runs on the dry run too, so its result is always seen)
if "--apply" not in sys.argv:
    print("dry run: nothing written (add --apply, with the QA lead's go-ahead)"); sys.exit(0)
if no_section: sys.exit(f"create the subsections first and put their ids in sections.json: {no_section}")
sys.path.insert(0, f"{P}/../../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
os.makedirs(f"{P}/applied", exist_ok=True)
if not os.path.exists(MAP):
    with open(MAP, "w", newline="") as f: csv.writer(f).writerow(["key", "case_id", "section", "title", "link", "prd_version"])
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
        csv.writer(mf).writerow([k, cid, v["sec"], f["title"], f"https://shopview.testrail.io/index.php?/cases/view/{cid}", v["prd_version"]])
    ids[k] = cid
print("cases", len(ids), "problems:", bad)
print("run candidates (union only, not held):", ",".join(f"C{ids[k]}" for k in todo if k in ids and not PROP[k]["held"]))
