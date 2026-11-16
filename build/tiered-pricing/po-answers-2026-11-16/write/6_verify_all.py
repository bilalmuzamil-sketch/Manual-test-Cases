#!/usr/bin/env python3
"""(6) Read-only end check: every case under section 138770 (paged, every subfolder) against proposals.json and testrail-id-map.csv: same set of
cases, every field and folder equal; run 560 = every released case, no held case, all assigned to user 6. Output: verify-all-2026-11-16.json."""
import json, sys
from _w import *
PR = prop(); M = idmap(); S = secs()
pid = api(f"get_suite/{SUITE}")["project_id"]
allsec = paged(f"get_sections/{pid}&suite_id={SUITE}", "sections")
kids, fr = [], {TOP}
while fr:
    nxt = [s for s in allsec if s.get("parent_id") in fr]; kids += nxt; fr = {s["id"] for s in nxt}
cases = []
for sid in [TOP] + [s["id"] for s in kids]: cases += paged(f"get_cases/{SUITE}&section_id={sid}", "cases")
byid = {c["id"]: c for c in cases}; want = {int(M[k]["case_id"]): k for k in PR}
missing = sorted(want.keys() - byid.keys()); extra = sorted(byid.keys() - want.keys())
bad = {}
for cid, k in want.items():
    c = byid.get(cid)
    if not c: continue
    d = [f for f in FIELDS if c.get(f) != PR[k]["fields"][f]] + (["refs"] if norm_refs(c.get("refs")) != norm_refs(PR[k]["fields"]["refs"]) else []) \
        + (["section"] if c["section_id"] != S[PR[k]["sec"]]["id"] else [])
    if d: bad[k] = d
tests = paged(f"get_tests/{RUN}", "tests"); intest = {t["case_id"] for t in tests}
rel = {int(M[k]["case_id"]) for k in PR if not PR[k]["held"]}; held = {int(M[k]["case_id"]) for k in PR if PR[k]["held"]}
out = {"cases_live": len(cases), "library": len(PR), "missing_live": missing, "extra_live": extra, "field_mismatch": bad,
       "run560_tests": len(tests), "released_not_in_run": sorted(rel - intest), "held_in_run": sorted(held & intest),
       "not_assigned_6": [t["case_id"] for t in tests if t.get("assignedto_id") != ASSIGN],
       "markers_1116": sum("Last checked 11/16/2026" in PR[k]["fields"]["custom_expected"] for k in PR)}
json.dump(out, open(f"{W}/verify-all-2026-11-16.json", "w"), indent=1)
print(json.dumps({k: (v if not isinstance(v, (list, dict)) or len(v) < 20 else len(v)) for k, v in out.items()}))
sys.exit(0 if not (missing or extra or bad or out["released_not_in_run"] or out["held_in_run"] or out["not_assigned_6"]) else 1)
