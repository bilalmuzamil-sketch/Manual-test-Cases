#!/usr/bin/env python3
"""14 Nov 2026, PRD version 13. Adds the 8 new cases (authoring/cases_v13.py: S3-33, S3-34, S3-35, S3-36 for S3-R7b; S5-43 for S5-R10b; S5-41b
for the changed S5-E3; S2-51, S2-52 for SV-12723 / S2-R6, QA lead 14 Nov 2026) to the folder their kind uses now: "Setup needed before testing" (133629), where the cases that need records made for
them and the 14 Demo Day cases are (proposals.json section_id, set by build.py). custom_atmstatus 1 ("Not Automated", APP-ACTIONS-PLAYBOOK §J).
Resumable: a key already in testrail-id-map.csv is skipped. The folder must hold only cases in our map (Rule 38/123). Read back field by field
and section; the map is appended. No design pictures: none of the six lists one. Dry run unless --apply.   python3 create_new.py [--apply]"""
from _common import *
import cases_v13 as V13C
ID = ids()
new = list(V13C.NEW13)
todo = [k for k in new if k not in ID]
for k in new:
    v = PROP[k]; f = v["fields"]
    assert v["section_id"] == 133629 and f["custom_atmstatus"] == 1 and len(f["title"]) <= 80 and len(f["refs"]) < 250, k
    assert "Design pictures attached to this case" not in f["custom_expected"], k
print("new cases", len(new), "| to add", len(todo), "| already added", len(new) - len(todo))
for k in todo: print(f"  {k} -> section {PROP[k]['section_id']} (Setup needed before testing): {PROP[k]['fields']['title']}")
from trlib import api, LAST
known = set(ID.values())
got, off = [], 0
while True:
    r = api(f"get_cases/1&suite_id=1&section_id=133629&limit=250&offset={off}"); cs = r["cases"] if isinstance(r, dict) else r
    got += [c for c in cs if c["section_id"] == 133629]
    if not (isinstance(r, dict) and r.get("_links", {}).get("next")): break
    off += 250
extra = [c["id"] for c in got if c["id"] not in known]
if extra: sys.exit(f"REFUSED: folder 133629 holds cases not in our map {extra}; ask the QA lead (Rule 123)")
print(f"live read: folder 133629 holds {len(got)} cases, all in our map")
if not APPLY: print("DRY RUN: nothing written."); sys.exit(0)
readiness()
L = log("create-2026-11-14-log.jsonl"); bad = 0
for k in todo:
    v = PROP[k]; f = v["fields"]
    n = api(f"add_case/{v['section_id']}", f); http = LAST["status"]; cid = n["id"]
    a = api(f"get_case/{cid}")
    wrong = [x for x in f if not same(x, a.get(x), f[x])] + (["section"] if a["section_id"] != v["section_id"] else [])
    bad += bool(wrong)
    json.dump(a, open(f"{OUT}/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    L.write(json.dumps({"op": "add_case", "key": k, "case": f"C{cid}", "http": http, "section": a["section_id"], "readback_ok": not wrong,
                        "wrong": wrong}) + "\n"); L.flush()
    with open(f"{B}/testrail-id-map.csv", "a", newline="") as mf:
        csv.writer(mf).writerow([k, cid, v["sec"], f["title"], link(cid)])
print("added", len(todo), "| read-back problems", bad)
