"""PROBE — an unmapped TestRail status id must now FAIL LOUDLY, not count as Untested.

Entirely offline: `api` is stubbed, so no TestRail call is made. Run from the repo root.
"""
import sys, os
sys.path.insert(0, os.path.abspath("build/testing-tools"))

import testrail_statuses as TS
import gen_dashboard as G

FAILS = []
def check(name, ok, detail=""):
    print(("  PASS  " if ok else "  FAIL  ") + name + (("  -> " + detail) if detail else ""))
    if not ok:
        FAILS.append(name)

LIVE5 = [{"id": 1, "name": "passed",   "label": "Passed",   "is_system": True, "is_untested": False},
         {"id": 2, "name": "blocked",  "label": "Blocked",  "is_system": True, "is_untested": False},
         {"id": 3, "name": "untested", "label": "Untested", "is_system": True, "is_untested": True},
         {"id": 4, "name": "retest",   "label": "Retest",   "is_system": True, "is_untested": False},
         {"id": 5, "name": "failed",   "label": "Failed",   "is_system": True, "is_untested": False}]
CUSTOM = dict(id=6, name="in_review", label="In Review", is_system=False, is_untested=False)

print("\n1. THE OLD BEHAVIOUR, reproduced — this is the bug")
OLD_SID = {1: "passed", 2: "blocked", 3: "untested", 4: "retest", 5: "failed"}
got = OLD_SID.get(6, "untested")
check("old `SID.get(6, 'untested')` silently returned 'untested'", got == "untested",
      "a result In Review was counted as Untested, with no error")

print("\n2. THE NEW BEHAVIOUR — TS.bucket() on an unmapped id")
try:
    TS.bucket(6)
    check("TS.bucket(6) raises", False, "IT RETURNED A VALUE — the bug is not fixed")
except TS.UnknownStatusId as e:
    m = str(e)
    check("TS.bucket(6) raises UnknownStatusId", True)
    check("  message names the id", "6" in m)
    check("  message identifies it as a CUSTOM status", "custom_status1" in m)
    check("  message refuses the untested default explicitly", "Refusing to count it" in m)
    check("  message says how to refresh", "testrail_statuses.py" in m)
for bad in (0, 13, 99, None, "3"):
    try:
        TS.bucket(bad)
        check("TS.bucket(%r) raises" % bad, False, "IT RETURNED A VALUE")
    except TS.UnknownStatusId:
        check("TS.bucket(%r) raises UnknownStatusId" % bad, True)

print("\n3. NO REGRESSION — the five real ids still bucket exactly as before")
check("ids 1-5 map identically to the old SID literal",
      {i: TS.bucket(i) for i in range(1, 6)} == OLD_SID,
      str({i: TS.bucket(i) for i in range(1, 6)}))

print("\n4. THE MAP AUDIT — a custom status added in TestRail stops the run")
check("assert_current(live 5) passes", TS.assert_current(LIVE5) == 5)
try:
    TS.assert_current(LIVE5 + [CUSTOM])
    check("assert_current with a custom status raises", False, "IT PASSED")
except TS.StaleStatusMap as e:
    m = str(e)
    check("assert_current with a custom status raises StaleStatusMap", True)
    check("  names the unknown id and its name", "6" in m and "in_review" in m)
try:
    TS.assert_current([s for s in LIVE5 if s["id"] != 4])
    check("assert_current with a REMOVED status raises", False, "IT PASSED")
except TS.StaleStatusMap as e:
    check("assert_current with a REMOVED status raises", "no longer served" in str(e))
try:
    renamed = [dict(s, name="skipped") if s["id"] == 2 else s for s in LIVE5]
    TS.assert_current(renamed)
    check("assert_current with a RENAMED status raises", False, "IT PASSED")
except TS.StaleStatusMap as e:
    check("assert_current with a RENAMED status raises", "drifted" in str(e))
try:
    TS.assert_current([])
    check("assert_current([]) raises", False, "IT PASSED on an empty read")
except TS.StaleStatusMap:
    check("assert_current([]) raises rather than vacuously passing", True)

print("\n5. RUN-LEVEL COUNTS — a custom status is no longer missing from the total")
check("run_count_field(1) == 'passed_count'", TS.run_count_field(1) == "passed_count")
check("run_count_field(6) == 'custom_status1_count'",
      TS.run_count_field(6) == "custom_status1_count")
check("run_count_field(12) == 'custom_status7_count'",
      TS.run_count_field(12) == "custom_status7_count")

print("\n6. END-TO-END in gen_dashboard.collect() — the real call path, api() stubbed")
RUN = {"passed_count": 10, "failed_count": 2, "blocked_count": 1,
       "retest_count": 0, "untested_count": 7, "assignedto_id": 3}

def make_api(statuses, tests):
    def api(path):
        if path == "get_statuses":
            return statuses
        if path.startswith("get_milestone"):
            return {"name": "M3"}
        if path.startswith("get_run/"):
            return dict(RUN)
        if path.startswith("get_tests/"):
            return {"tests": tests} if "offset=0" in path else {"tests": []}
        if path.startswith("get_results_for_run/"):
            return {"results": []}
        raise AssertionError("probe made an unexpected API call: %r" % path)
    return api

G.CFG = {"base_url": "https://shopview.testrail.io",
         "runs": {"demo": {"run_id": 999, "name": "Demo run"}}}

clean = [{"assignedto_id": 3, "status_id": i} for i in (1, 1, 5, 3, 3)]
G.api = make_api(LIVE5, clean)
_ms, runs, eng, _act = G.collect()
check("clean run collects", runs[0]["total"] == 20, str(runs[0]["counts"]))
check("per-engineer buckets are right", eng[3] == {"passed": 2, "failed": 1, "blocked": 0,
                                                   "retest": 0, "untested": 2}, str(eng[3]))

dirty = clean + [{"assignedto_id": 3, "status_id": 6}]
G.api = make_api(LIVE5, dirty)
try:
    G.collect()
    check("collect() with a status-6 test raises", False,
          "IT RENDERED — a result was silently counted as Untested")
except TS.UnknownStatusId:
    check("collect() with a status-6 test raises UnknownStatusId "
          "(status map still 5, so bucket() catches it)", True)

G.api = make_api(LIVE5 + [CUSTOM], clean)
try:
    G.collect()
    check("collect() stops when TestRail gains a custom status", False, "IT RENDERED")
except TS.StaleStatusMap:
    check("collect() stops at assert_current when TestRail gains a custom status, "
          "BEFORE counting anything", True)

print("\n7. THE ACTIVITY FEED no longer swallows the loud failure")
import inspect
src = inspect.getsource(G.collect)
check("no bare `except Exception:\\n            pass` remains", "except Exception:\n            pass" not in src)
check("UnknownStatusId is re-raised in the feed loop", "except TS.UnknownStatusId:" in src)

def api_bad_result(path):
    if path == "get_statuses": return LIVE5
    if path.startswith("get_milestone"): return {"name": "M3"}
    if path.startswith("get_run/"): return dict(RUN)
    if path.startswith("get_tests/"): return {"tests": clean if "offset=0" in path else []}
    if path.startswith("get_results_for_run/"): return {"results": [{"status_id": 7, "created_by": 3}]}
    raise AssertionError(path)
G.api = api_bad_result
try:
    G.collect()
    check("a status-7 RESULT in the feed raises", False, "IT WAS SWALLOWED — the old bug")
except TS.UnknownStatusId:
    check("a status-7 RESULT in the feed raises instead of being swallowed", True)

print("\n" + ("PROBE: ALL CHECKS PASSED" if not FAILS
             else "PROBE FAILED: %d\n  %s" % (len(FAILS), "\n  ".join(FAILS))))
sys.exit(1 if FAILS else 0)
