#!/usr/bin/env python3
"""verify_run357.py — prove run 357 is untouched BY CONTENT, never by updated_on.

Compares the post-write run against the pre-write snapshot: include_all, the test
id and case id sets in BOTH directions, and every prior result present BY ID with
every graded field byte-identical.  `case_title` and `case_refs` on a result are
the two DECLARED read-time echoes and are reported separately rather than counted
as damage.
"""
import json, sys
sys.path.insert(0, "/tmp/testrail")
import tr

RUN = 357
pre = json.load(open("/tmp/sched/run357-PRE.json"))

tests, off = [], 0
while True:
    st, b = tr.api("get_tests/%d&limit=250&offset=%d" % (RUN, off))
    ch = b["tests"] if isinstance(b, dict) else b
    tests += ch
    if len(ch) < 250: break
    off += 250
results, off = [], 0
while True:
    st, b = tr.api("get_results_for_run/%d&limit=250&offset=%d" % (RUN, off))
    ch = b["results"] if isinstance(b, dict) else b
    results += ch
    if len(ch) < 250: break
    off += 250
st, run = tr.api("get_run/%d" % RUN)

fail = []
if run.get("include_all") != pre["include_all"]:
    fail.append("include_all moved %s -> %s" % (pre["include_all"], run.get("include_all")))

tid, cid = sorted(t["id"] for t in tests), sorted(t["case_id"] for t in tests)
for name, a, b_ in (("test_ids", pre["test_ids"], tid), ("case_ids", pre["case_ids"], cid)):
    if set(a) - set(b_): fail.append("%s LOST: %s" % (name, sorted(set(a) - set(b_))[:10]))
    if set(b_) - set(a): fail.append("%s GAINED: %s" % (name, sorted(set(b_) - set(a))[:10]))

post_by_id = {r["id"]: r for r in results}
ECHO = {"case_title", "case_refs"}
missing, changed, echoed = [], [], []
for r in pre["results_full"]:
    p = post_by_id.get(r["id"])
    if p is None:
        missing.append(r["id"]); continue
    for k in set(r) | set(p):
        if r.get(k) != p.get(k):
            (echoed if k in ECHO else changed).append((r["id"], k, r.get(k), p.get(k)))
if missing: fail.append("results MISSING BY ID: %d -> %s" % (len(missing), missing[:10]))
if changed: fail.append("results with a NON-ECHO field changed: %d -> %s" % (len(changed), changed[:5]))

new = [r["id"] for r in results if r["id"] not in set(pre["result_ids"])]

print("run 357 POST : include_all=%s  tests=%d  results=%d" % (run.get("include_all"), len(tests), len(results)))
print("             pre: tests=%d results=%d" % (pre["tests"], pre["results"]))
print("test_id sets equal both ways :", set(tid) == set(pre["test_ids"]))
print("case_id sets equal both ways :", set(cid) == set(pre["case_ids"]))
print("prior results present BY ID  : %d of %d  (missing %d)" % (len(pre["results_full"]) - len(missing), len(pre["results_full"]), len(missing)))
print("non-echo field changes       :", len(changed))
print("declared echo changes        : %d  (case_title / case_refs)" % len(echoed))
print("NEW results during the window: %d %s" % (len(new), new[:10]))
json.dump({"pass": not fail, "failures": fail, "echoed": echoed[:60], "new_results": new},
          open("/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-12/evidence/run357-verify.json", "w"), indent=1)
print("\nVERDICT:", "RUN 357 PROVEN UNTOUCHED" if not fail else "FAILURES:\n  " + "\n  ".join(fail))
sys.exit(0 if not fail else 1)
