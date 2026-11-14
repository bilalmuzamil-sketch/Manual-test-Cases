#!/usr/bin/env python3
"""(b) Add every Tiered Pricing case of ../authoring/proposals.json that has no C-id yet to its subfolder of 138770 (held cases to their held
folders: "Waiting on Matt Barge's answers" for non-design cases waiting on a question; design-version cases stay in "Design — how it looks";
cases held for staging data or AccountingHub stay in their story folder). Each case: add_case with the full body (custom_atmstatus 1), then
get_case and a field-by-field read-back (title, template, type, priority, automation type, custom_atmstatus, preconditions, steps, expected,
refs without spaces, section). Resumable: testrail-id-map.csv is appended per case. Refuses if a subfolder id is missing (run 1_ first) or if
any target folder holds a case that is not ours (Rules 38, 123). Log: log-cases.jsonl; read-backs in applied/C<id>-after.json.
   python3 2_create_cases.py [--apply]"""
import json, sys, os
from collections import Counter
from _tp import *
L = logger("cases"); PR = prop(); S = secs()["sections"]; M = mapping()
todo = [k for k in PR if k not in M]
print(f"PLAN: add {len(todo)} cases (already mapped {len(M)}); held {sum(PR[k]['held'] for k in todo)}; for the run {sum(not PR[k]['held'] for k in todo)}")
for sec, n in sorted(Counter(PR[k]["sec"] for k in todo).items(), key=lambda x: list(S).index(x[0])):
    h = sum(PR[k]["held"] for k in todo if PR[k]["sec"] == sec)
    print(f"  {sec:6} {S[sec]['name'][:62]:62} {n:4} (held {h})  section id {S[sec].get('id')}")
for k in todo:
    f = PR[k]["fields"]
    assert f["custom_atmstatus"] == 1 and len(f["title"]) <= 80 and len(f["refs"]) < 250, k
    assert PR[k]["held"] == (f["custom_expected"].count("AUTOMATION: HOLD") > 0), k
nosec = sorted({PR[k]["sec"] for k in todo if not S[PR[k]["sec"]].get("id")})
print("subfolders without an id yet (run 1_create_sections.py --apply first):", nosec)
readiness()
api, LAST = tr()
kids, cases = tree(api); fs, fc = foreign(kids, cases)
print(f"live under {TOP}: {len(kids)} subsections, {len(cases)} cases; not ours: {len(fs)} sections, {len(fc)} cases")
L({"op": "guard", "foreign_sections": [s["id"] for s in fs], "foreign_cases": [c["id"] for c in fc], "planned": len(todo)})
if fs or fc: sys.exit("REFUSED: section 138770 holds folders or cases that are not ours; ask the QA lead (Rules 38, 123)")
if not APPLY: print("dry run: nothing written (add --apply, with the QA lead's go-ahead)"); sys.exit(0)
if nosec: sys.exit(f"REFUSED: create the subfolders first: {nosec}")
os.makedirs(f"{W}/applied", exist_ok=True); bad = 0
for k in todo:
    v = PR[k]; f = v["fields"]; sid = S[v["sec"]]["id"]
    r, err = safe(api, f"add_case/{sid}", f); st = LAST["status"]
    if err: L({"op": "add_case", "key": k, "http": st, "error": err}); bad += 1; break
    cid = r["id"]; a = api(f"get_case/{cid}")
    diff = [x for x in FIELDS if a.get(x) != f[x]] + (["refs"] if (a.get("refs") or "").replace(" ", "") != f["refs"].replace(" ", "") else [])
    if a["section_id"] != sid: diff.append("section")
    bad += bool(diff)
    json.dump(a, open(f"{W}/applied/C{cid}-after.json", "w"), indent=1, ensure_ascii=False)
    map_add(k, cid, v["sec"], f["title"])
    L({"op": "add_case", "key": k, "case": f"C{cid}", "section": sid, "http": st, "readback_ok": not diff, "bad": diff})
print("added:", len(mapping()) - len(M), "problems:", bad); sys.exit(1 if bad else 0)
