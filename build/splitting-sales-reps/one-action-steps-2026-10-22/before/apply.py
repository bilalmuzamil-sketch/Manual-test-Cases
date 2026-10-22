#!/usr/bin/env python3
"""Create the Splitting Sales Representatives sub folders under TestRail group 84266 and add every case (QA lead, 19 Oct 2026:
"create the test cases for … group_id=84266. Create sub folders related to the test cases as needed and then the test cases inside
those sub folders"). No test run (QA lead). Idempotent: an existing sub folder is reused; a case whose key is already in the id map is
skipped. Every write is logged and read back field by field.  python3 apply.py [--apply]"""
import sys, os, json, csv, time
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
sys.path.insert(0, f"{P}/../dashboards/currency-2026-10-14/apply"); from trlib import api, LAST
PARENT = 84266
SECTIONS = [("S1", "Story 1 — One Sales Representative field on the work order"),
            ("S2", "Story 2 — Separate Labor and Parts representatives"),
            ("S3", "Story 3 — Representatives on a phone"),
            ("S4", "Story 4 — A customer's default representatives"),
            ("S5", "Story 5 — Credit on the invoice and in Sales By Representative"),
            ("DATA", "Credit and totals — exact amounts"),
            ("S6", "Story 6 — Printed work order"),
            ("S7", "Story 7 — Work order log"),
            ("S8", "Story 8 — Sales Type filters on both sales reports"),
            ("REL", "Release day and what must not change"),
            ("DESIGN", "Design — how it looks")]
props = json.load(open(f"{D}/proposals.json"))
order = list(props)  # build order = story order
os.makedirs(f"{P}/applied", exist_ok=True)
MAP = f"{P}/testrail-id-map.csv"
done = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(MAP))} if os.path.exists(MAP) else {}
def paged(ep, key):
    out, off = [], 0
    while True:
        d = api(f"{ep}&limit=250&offset={off}"); out += d[key]
        if not d.get("_links", {}).get("next"): return out
        off += 250
secs = paged("get_sections/1&suite_id=1", "sections")
kids = {s["name"]: s["id"] for s in secs if s.get("parent_id") == PARENT}
print("existing sub folders:", kids)
print("cases to add:", sum(1 for k in order if k not in done), "of", len(order))
if "--apply" not in sys.argv: sys.exit(0)
log = open(f"{P}/applied/apply-log.jsonl", "a")
def L(r): log.write(json.dumps(r, ensure_ascii=False) + "\n"); log.flush()
sid = {}
for key, name in SECTIONS:
    if name in kids: sid[key] = kids[name]; continue
    s = api("add_section/1", {"suite_id": 1, "parent_id": PARENT, "name": name}); sid[key] = s["id"]
    L({"op": "add_section", "name": name, "id": s["id"], "http": LAST["status"]})
json.dump(sid, open(f"{P}/applied/sections.json", "w"), indent=1)
new_map = not os.path.exists(MAP)
mf = open(MAP, "a", newline=""); w = csv.writer(mf)
if new_map: w.writerow(["key", "case_id", "section", "title", "link"])
ok = bad = 0
for k in order:
    if k in done: continue
    f = props[k]["fields"]; sec = props[k]["sec"]
    c = api(f"add_case/{sid[sec]}", f); st = LAST["status"]
    a = api(f"get_case/{c['id']}")
    good = all(a.get(x) == v for x, v in f.items()) and a["section_id"] == sid[sec]
    ok += good; bad += (not good)
    L({"op": "add_case", "key": k, "case": f"C{c['id']}", "http": st, "readback_ok": good,
       "bad_fields": [x for x, v in f.items() if a.get(x) != v]})
    w.writerow([k, c["id"], sec, f["title"], f"https://shopview.testrail.io/index.php?/cases/view/{c['id']}"]); mf.flush()
    json.dump(a, open(f"{P}/applied/C{c['id']}-after.json", "w"), indent=1, ensure_ascii=False)
print("added", ok + bad, "read back OK", ok, "mismatch", bad)
