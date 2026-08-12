"""finish5 - the closing proofs, all derived LIVE.

  1. the five walked cases: one stamp, one marker, no barred phrase, refs and the
     Automated flag unchanged
  2. run 357 proven untouched BY CONTENT against the pre-write snapshot - never by updated_on
  3. the live marker census and the Rule-67 completion figures
"""
import json, re, sys, datetime
sys.path.insert(0, "/tmp/testrail"); import tr

OUT = "/home/user/Manual-test-Cases/build/schedule/finish5-2026-08-12/evidence"
BUILD = "v3.5-65d6500"
GROUP = 4254
WALKED5 = [38875, 38863, 38865, 29986, 30615]
# refs as read at the START of this pass, before any write
REFS_BEFORE = {
 38875: "SV-8685 [epic - cross-cutting,no single-story owner] (tech-plan NFR-001 location scoping)",
 38863: "SV-8691 (§4.5 + tech-plan D8 series caps)",
 38865: "SV-8691 (§4.5 + tech-plan D2 NFR-005 DST)",
 29986: "SV-8691 (§4.5 (independent per-tech spread),§12)",
 30615: "SV-8696 (§4.10 (Events),§4.11 (events not conflict-checked),§4.12 "
        "(event time included in the utilization total))"}

read_at = datetime.datetime.utcnow().isoformat() + "Z"
out = {"read_at_utc": read_at, "build": BUILD}

# ---------- 1 · the five walked cases -----------------------------------------
five = []
for cid in WALKED5:
    st, c = tr.get_case(cid); assert st == 200
    exp = c.get("custom_expected") or ""
    five.append({"cid": cid, "title": c["title"],
                 "stamps": len(re.findall(r"Last checked against build", exp)),
                 "names_running_build": f"build {BUILD} on" in exp,
                 "markers": len(re.findall(r"^AUTOMATION: ", exp, re.M)),
                 "barred_phrase": "as per the build" in exp,
                 "custom_atmstatus": c.get("custom_atmstatus"),
                 "refs_unchanged": (c.get("refs") or "") == REFS_BEFORE[cid],
                 "raw_markup": bool(re.search(r"</?(p|ol|li|ul|br)\b", exp))})
out["five_walked"] = five
print("the five walked cases:")
for f in five:
    print(f"  C{f['cid']}  stamps={f['stamps']} running={f['names_running_build']} "
          f"markers={f['markers']} barred={f['barred_phrase']} atm={f['custom_atmstatus']} "
          f"refs_unchanged={f['refs_unchanged']} raw={f['raw_markup']}")

# ---------- 2 · run 357, proven by CONTENT ------------------------------------
pre = json.load(open(f"{OUT}/run357-PRE.json"))


def page(ep, key):
    acc, off = [], 0
    while True:
        s, r = tr.api(f"{ep}&limit=250&offset={off}"); c = r[key]; acc += c
        if len(c) < 250: break
        off += 250
    return acc


st, run = tr.api("get_run/357")
tests, res = page("get_tests/357", "tests"), page("get_results_for_run/357", "results")
pre_r = {r["id"]: r for r in pre["results"]}
now_r = {r["id"]: r for r in res}
missing = sorted(set(pre_r) - set(now_r))
GRADED = ("status_id", "test_id", "comment", "defects", "created_by", "created_on",
          "elapsed", "version", "assignedto_id")
moved = []
for rid, before in pre_r.items():
    after = now_r.get(rid)
    if not after: continue
    d = [k for k in GRADED if before.get(k) != after.get(k)]
    if d: moved.append({"result_id": rid, "fields": d})
pre_cases = {t["case_id"] for t in pre["tests"]}
now_cases = {t["case_id"] for t in tests}
out["run357"] = {"include_all": run.get("include_all"),
                 "tests_before": len(pre["tests"]), "tests_after": len(tests),
                 "results_before": len(pre["results"]), "results_after": len(res),
                 "prior_results_missing_by_id": missing,
                 "results_with_a_graded_field_moved": moved,
                 "new_results_during_the_window": len(set(now_r) - set(pre_r)),
                 "case_id_sets_equal_both_ways":
                     (not (pre_cases - now_cases)) and (not (now_cases - pre_cases))}
print(f"\nrun 357: include_all={run.get('include_all')} tests {len(pre['tests'])}->{len(tests)} "
      f"results {len(pre['results'])}->{len(res)}")
print(f"  prior results missing by id: {len(missing)}   graded fields moved: {len(moved)}   "
      f"new results: {len(set(now_r)-set(pre_r))}")
print(f"  case_id sets equal both ways: {out['run357']['case_id_sets_equal_both_ways']}")

# ---------- 3 · the live census over the whole suite --------------------------
cases, off = [], 0
while True:
    s, r = tr.api(f"get_cases/1&suite_id=1&section_id={GROUP}&limit=250&offset={off}")
    c = r["cases"]; cases += c
    if len(c) < 250: break
    off += 250
if not cases:                                  # group 4254 is a parent; walk its subtree
    s, r = tr.api("get_sections/1&suite_id=1&limit=250")
    secs = r["sections"]; off = 250
    while len(r["sections"]) == 250:
        s, r = tr.api(f"get_sections/1&suite_id=1&limit=250&offset={off}"); secs += r["sections"]; off += 250
    keep, changed = {GROUP}, True
    while changed:
        changed = False
        for sec in secs:
            if sec.get("parent_id") in keep and sec["id"] not in keep:
                keep.add(sec["id"]); changed = True
    cases, off = [], 0
    while True:
        s, r = tr.api(f"get_cases/1&suite_id=1&limit=250&offset={off}")
        c = r["cases"]; cases += c
        if len(c) < 250: break
        off += 250
    cases = [c for c in cases if c.get("section_id") in keep]

READY = sum(1 for c in cases if re.search(r"^AUTOMATION: READY\s*$", c.get("custom_expected") or "", re.M))
EF = sum(1 for c in cases if re.search(r"^AUTOMATION: READY - EXPECT FAIL", c.get("custom_expected") or "", re.M))
HOLD = sum(1 for c in cases if re.search(r"^AUTOMATION: HOLD", c.get("custom_expected") or "", re.M))
runbuild = sum(1 for c in cases if f"build {BUILD} on" in (c.get("custom_expected") or ""))
anybuild = sum(1 for c in cases if "Last checked against build" in (c.get("custom_expected") or ""))
readdate = sum(1 for c in cases if "read on " in (c.get("custom_expected") or ""))
foreign = [c["id"] for c in cases if c.get("created_by") != 3]
auto = [c["id"] for c in cases if c.get("custom_atmstatus") == 3]
out["census"] = {"total_cases": len(cases), "ours": len(cases) - len(foreign),
                 "foreign_case_ids": foreign, "READY": READY, "READY_EXPECT_FAIL": EF,
                 "HOLD": HOLD, "gate_ready_plus_ef": READY + EF, "gate_total_minus_hold": len(cases) - HOLD,
                 "gate_closes_both_ways": READY + EF == len(cases) - HOLD,
                 "naming_the_running_build": runbuild, "naming_any_build": anybuild,
                 "naming_an_earlier_build": anybuild - runbuild,
                 "carrying_a_source_read_date": readdate,
                 "flagged_Automated_by_TestRail": auto}
print(f"\ncensus: {len(cases)} cases (ours {len(cases)-len(foreign)}, foreign {len(foreign)})")
print(f"  READY {READY} · EXPECT-FAIL {EF} · HOLD {HOLD}   gate {READY+EF} == {len(cases)-HOLD} "
      f"-> {out['census']['gate_closes_both_ways']}")
print(f"  naming the running build {runbuild} · an earlier build {anybuild-runbuild} · "
      f"no build line {len(cases)-anybuild}")
print(f"  carrying a source read-date: {readdate}")
print(f"  TestRail-Automated: {len(auto)}")

json.dump(out, open(f"{OUT}/final-state.json", "w"), indent=1)
print("\nwritten: evidence/final-state.json")
