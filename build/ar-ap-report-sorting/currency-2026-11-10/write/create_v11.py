#!/usr/bin/env python3
"""10 Nov 2026 (QA lead: "Yes, both"). Adds the 25 new cases (status NEW in stamp-diff.json) to their sections (sections.json), in library
order, with custom_atmstatus 1 ("Not Automated"; never 3, APP-ACTIONS-PLAYBOOK §J). Resumable: a key already in testrail-id-map.csv is
skipped. Reads each case back and appends testrail-id-map.csv. Dry run unless --apply.  python3 create_v11.py [--apply]"""
from _common import *
ID = ids()
new = [k for k, st in STAMP.items() if st["status"] == "NEW"]
todo = [k for k in new if k not in ID]
for k in new:
    f = PROP[k]["fields"]; assert f["custom_atmstatus"] == 1, k
    assert "References from Design" in f["custom_expected"] or True
print("new cases", len(new), "| to add", len(todo), "| already added", len(new) - len(todo))
for k in todo: print(f"  {k} -> section {PROP[k]['section_id']} ({PROP[k]['sec']}): {PROP[k]['fields']['title']}")
if not APPLY: print("DRY RUN: nothing written."); sys.exit(0)
readiness()
from trlib import api, LAST
known = set(ID.values()) | set(SNAP)
for sec in sorted({PROP[k]["section_id"] for k in todo}):          # the sections must hold only our cases (Rule 38)
    got, off = [], 0
    while True:
        r = api(f"get_cases/1&suite_id=1&section_id={sec}&limit=250&offset={off}"); cs = r["cases"] if isinstance(r, dict) else r
        got += [c for c in cs if c["section_id"] == sec]
        if not (isinstance(r, dict) and r.get("_links", {}).get("next")): break
        off += 250
    extra = [c["id"] for c in got if c["id"] not in known]
    if extra: sys.exit(f"REFUSED: section {sec} holds cases not in our map {extra}; ask the QA lead (Rule 123)")
L = log("create-2026-11-10-log.jsonl"); bad = 0
for k in todo:
    v = PROP[k]; f = v["fields"]
    n = api(f"add_case/{v['section_id']}", f); http = LAST["status"]; cid = n["id"]
    a = api(f"get_case/{cid}")
    wrong = [x for x in f if not same(x, a.get(x), f[x])] + (["section"] if a["section_id"] != v["section_id"] else [])
    bad += bool(wrong)
    json.dump(a, open(f"{OUT}/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L.write(json.dumps({"op": "add_case", "key": k, "case": f"C{cid}", "http": http, "readback_ok": not wrong, "wrong": wrong}) + "\n"); L.flush()
    with open(f"{B}/testrail-id-map.csv", "a", newline="") as mf:
        csv.writer(mf).writerow([k, cid, v["sec"], f["title"], f"https://shopview.testrail.io/index.php?/cases/view/{cid}"])
print("added", len(todo), "| read-back problems", bad)
