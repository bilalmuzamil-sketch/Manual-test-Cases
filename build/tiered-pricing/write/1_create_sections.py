#!/usr/bin/env python3
"""(a) Create the Tiered Pricing subfolders of section 138770 "Tiered Pricing (11/14/2026)" (suite 1), from ../sections.json, in its order.
Only folders that will hold cases are made (sections.json PROD "Run on Production After Release" holds none today and is skipped).
Before anything: read the live section and everything under it (paged); REFUSE if it holds any section or case that is not ours (our section
ids in sections.json, our cases in testrail-id-map.csv) - Rules 38, 123. Resumable: a folder whose id is already in sections.json and exists
live is kept; a live folder of the same name under 138770 that is not in sections.json counts as foreign (refused, ask the QA lead).
On --apply: add_section, read back (name, parent, suite), the id written into sections.json. Log: log-sections.jsonl.
   python3 1_create_sections.py            dry run (reads TestRail, writes nothing)
   python3 1_create_sections.py --apply    the write (coordinator, with the QA lead's go-ahead, Rule 6)"""
import json, sys
from _tp import *
L = logger("sections"); S = secs(); PR = prop()
DESC = {"DESIGN": "How the Tiered Pricing screens look, compared with the design pictures attached to each case. Cases whose design differs from "
                  "the PRD stay here, held, until Matt Barge answers.",
        "INV": "Today's pricing behaviour that Tiered Pricing must not change. Each case says where to run it: staging first, the Tiered Pricing QA "
               "site too once the release is there; production only where neither can show it.",
        "WAIT": "Cases waiting on Matt Barge's answers to the Tiered Pricing questions. They are not in the test run until he answers."}
used = {}
for k, v in PR.items(): used[v["sec"]] = used.get(v["sec"], 0) + 1
plan = [(key, s) for key, s in S["sections"].items() if used.get(key)]
skipped = [key for key in S["sections"] if not used.get(key)]
print(f"PLAN: {len(plan)} subfolders under {TOP} (skipped, no case: {skipped})")
for key, s in plan: print(f"  {key:6} {s['name'][:70]:70} cases {used[key]:4}  id {s.get('id')}")
readiness()
api, LAST = tr()
top, err = safe(api, f"get_section/{TOP}")
if err: sys.exit(f"cannot read section {TOP}: {err}")
json.dump(top, open(f"{W}/section-{TOP}-before.json", "w"), indent=1, ensure_ascii=False)
kids, cases = tree(api)
fs, fc = foreign(kids, cases)
print(f"live: section {TOP} {top['name']!r} (suite {top['suite_id']}) | subsections {len(kids)} | cases {len(cases)} | not ours: {len(fs)} sections, {len(fc)} cases")
L({"op": "guard", "section": TOP, "name": top["name"], "subsections": len(kids), "cases": len(cases), "foreign_sections": [s["id"] for s in fs],
   "foreign_cases": [c["id"] for c in fc]})
if top["suite_id"] != SUITE: sys.exit(f"REFUSED: section {TOP} is not in suite {SUITE}")
if fs or fc:
    print("REFUSED: section 138770 holds folders or cases that are not ours:", [(s["id"], s["name"]) for s in fs], [c["id"] for c in fc])
    sys.exit("ask the QA lead before anything is added (Rules 38, 123)")
if not APPLY:
    print("dry run: nothing written (add --apply, with the QA lead's go-ahead)"); sys.exit(0)
pid = project_id(api); live = {s["id"] for s in kids}; bad = 0
for key, s in plan:
    if s.get("id") and s["id"] in live: L({"op": "kept", "key": key, "section": s["id"]}); continue
    body = {"suite_id": SUITE, "parent_id": TOP, "name": s["name"]}
    if key in DESC: body["description"] = DESC[key]
    r, err = safe(api, f"add_section/{pid}", body); st = LAST["status"]
    if err: L({"op": "add_section", "key": key, "http": st, "error": err}); bad += 1; break
    back = api(f"get_section/{r['id']}")
    ok = back["name"] == s["name"] and back["parent_id"] == TOP and back["suite_id"] == SUITE; bad += not ok
    S["sections"][key]["id"] = r["id"]; json.dump(S, open(SECJ, "w"), indent=1, ensure_ascii=False)
    L({"op": "add_section", "key": key, "section": r["id"], "name": s["name"], "http": st, "readback_ok": ok})
print("problems:", bad); sys.exit(1 if bad else 0)
