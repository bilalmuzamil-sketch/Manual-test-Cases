#!/usr/bin/env python3
"""PRE-write snapshot: every case under group 4281, the section tree, and run 359."""
import json, os, sys, datetime
sys.path.insert(0, "/tmp/testrail")
import tr
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "snapshots")
os.makedirs(OUT, exist_ok=True)
tag = sys.argv[1] if sys.argv[1:] else "PRE"

st, secs = tr.api("get_sections/1&suite_id=1&limit=250&offset=0")
allsecs = []
off = 0
while True:
    st, b = tr.api(f"get_sections/1&suite_id=1&limit=250&offset={off}")
    assert st == 200, b
    ch = b["sections"] if isinstance(b, dict) else b
    allsecs.extend(ch)
    if len(ch) < 250: break
    off += 250
json.dump(allsecs, open(f"{OUT}/sections-{tag}.json","w"), indent=1)

# descendants of group 4281
bypar = {}
for s in allsecs: bypar.setdefault(s.get("parent_id"), []).append(s)
want, stack = set(), [4281]
while stack:
    n = stack.pop()
    want.add(n)
    for c in bypar.get(n, []): stack.append(c["id"])

cases = tr.get_cases(1,1)
mine = [c for c in cases if c["section_id"] in want]
json.dump(mine, open(f"{OUT}/cases-{tag}.json","w"), indent=1)

st, run = tr.api("get_run/359")
json.dump(run, open(f"{OUT}/run359-{tag}.json","w"), indent=1)
tests, off = [], 0
while True:
    st,b = tr.api(f"get_tests/359&limit=250&offset={off}")
    ch = b["tests"] if isinstance(b,dict) else b
    tests.extend(ch)
    if len(ch) < 250: break
    off += 250
json.dump(tests, open(f"{OUT}/run359-tests-{tag}.json","w"), indent=1)
res, off = [], 0
while True:
    st,b = tr.api(f"get_results_for_run/359&limit=250&offset={off}")
    ch = b["results"] if isinstance(b,dict) else b
    res.extend(ch)
    if len(ch) < 250: break
    off += 250
json.dump(res, open(f"{OUT}/run359-results-{tag}.json","w"), indent=1)

byc = {}
for c in mine: byc[c["created_by"]] = byc.get(c["created_by"],0)+1
print(f"[{tag}] {datetime.datetime.utcnow().isoformat()}Z sections_under_4281={len(want)} cases={len(mine)}")
print("  created_by:", byc)
print(f"  run359 include_all={run.get('include_all')} tests={len(tests)} results={len(res)}")
