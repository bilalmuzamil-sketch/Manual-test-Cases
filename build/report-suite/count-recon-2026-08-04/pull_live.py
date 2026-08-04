"""STEP 1 — settle the count. READ-ONLY: get_sections/get_cases/get_tests/get_results only."""
import json, sys, os
sys.path.insert(0, "/tmp/testrail")
import tr

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
os.makedirs(D, exist_ok=True)
GROUP = 4281
RUN = 359

# --- sections: group 4281 + every descendant (paginated) ---
secs, offset = [], 0
while True:
    st, b = tr.api(f"get_sections/1&suite_id=1&limit=250&offset={offset}")
    assert st == 200, (st, b)
    chunk = b["sections"] if isinstance(b, dict) else b
    secs.extend(chunk)
    if len(chunk) == 250:
        offset += 250; continue
    break
byid = {s["id"]: s for s in secs}
def under(sid):
    out = {sid}
    changed = True
    while changed:
        changed = False
        for s in secs:
            if s.get("parent_id") in out and s["id"] not in out:
                out.add(s["id"]); changed = True
    return out
sub = under(GROUP)
json.dump(sorted(sub), open(f"{D}/sections-under-4281.json", "w"), indent=1)
print(f"sections total in suite = {len(secs)}; under group {GROUP} (incl. itself) = {len(sub)}")

# --- every case in suite 1, paginated to exhaustion; filter to group ---
allcases = tr.get_cases(1, 1)
print(f"get_cases suite-wide, paginated to exhaustion = {len(allcases)}")
grp = [c for c in allcases if c["section_id"] in sub]
json.dump(sorted(grp, key=lambda c: c["id"]), open(f"{D}/live-cases-4281.json", "w"), indent=1, sort_keys=True)
ours = [c for c in grp if c.get("created_by") == 3]
foreign = [c for c in grp if c.get("created_by") != 3]
print(f"LIVE under 4281 total = {len(grp)}")
print(f"  OURS (created_by==3)  = {len(ours)}")
print(f"  FOREIGN               = {len(foreign)} -> {sorted(c['id'] for c in foreign)}")
from collections import Counter
print("  foreign authors:", Counter(c['created_by'] for c in foreign))

# --- run 359 ---
st, run = tr.api(f"get_run/{RUN}")
assert st == 200, (st, run)
json.dump(run, open(f"{D}/run359.json", "w"), indent=1, sort_keys=True)
print(f"run {RUN}: include_all={run['include_all']} untested={run['untested_count']} "
      f"passed={run['passed_count']} blocked={run['blocked_count']} failed={run['failed_count']} retest={run['retest_count']}")
tests = tr.get_tests(RUN)
json.dump(sorted(tests, key=lambda t: t["id"]), open(f"{D}/run359-tests.json", "w"), indent=1, sort_keys=True)
print(f"get_tests paginated to exhaustion = {len(tests)}")
res = tr.get_results_for_run(RUN)
json.dump(sorted(res, key=lambda r: r["id"]), open(f"{D}/run359-results.json", "w"), indent=1, sort_keys=True)
print(f"get_results_for_run paginated to exhaustion = {len(res)}")

json.dump({"live_total": len(grp), "ours": len(ours), "foreign": len(foreign),
           "run_tests": len(tests), "run_results": len(res),
           "include_all": run["include_all"]},
          open(f"{D}/counts.json", "w"), indent=1)
