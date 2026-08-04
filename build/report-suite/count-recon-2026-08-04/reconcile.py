"""STEP 1 part 2 — diff live vs every committed snapshot; verify results BY ID."""
import json, os
B = "build/report-suite"
R = f"{B}/rulings-2026-08-04"
D = f"{B}/count-recon-2026-08-04/data"

live = json.load(open(f"{D}/live-cases-4281.json"))
live_ids = {c["id"] for c in live}
ours_ids = {c["id"] for c in live if c.get("created_by") == 3}

snaps = {
 "START (pre-rulings baseline)": f"{R}/baseline/live-cases-4281-START.json",
 "NOW (recovery re-pull)":       f"{R}/recovery/live-cases-4281-NOW.json",
 "AFTER (post reference-pins)":  f"{R}/recovery/live-cases-4281-AFTER.json",
 "POSTMERGE (after 9 deletes)":  f"{R}/recovery/live-cases-4281-POSTMERGE.json",
}
print("### CASE-ID SET DIFF, live vs every committed snapshot\n")
for label, path in snaps.items():
    s = json.load(open(path))
    sids = {c["id"] for c in s}
    sours = {c["id"] for c in s if c.get("created_by") == 3}
    missing = sorted(sids - live_ids)   # in snapshot, gone from live
    added   = sorted(live_ids - sids)   # in live, not in snapshot
    print(f"{label}: total {len(sids)} (ours {len(sours)})")
    print(f"  in snapshot but NOT live ({len(missing)}): {['C%d'%i for i in missing]}")
    print(f"  in live but NOT snapshot ({len(added)}): {['C%d'%i for i in added]}")

# --- results BY ID against the 539-record checkpoint ---
print("\n### RESULT RECORDS — every prior record verified BY ID")
pre = json.load(open(f"{R}/recovery/merge-backup/run359-PRE-DELETION.json"))
def norm(x):
    if isinstance(x, dict):
        for k in ("results","tests"):
            if k in x: return x[k]
    return x
pre_res = None; pre_tests = None
if isinstance(pre, dict):
    pre_res = pre.get("results"); pre_tests = pre.get("tests")
print("PRE-DELETION snapshot keys:", list(pre.keys()) if isinstance(pre,dict) else type(pre).__name__)
if pre_res is None:
    # try the merges dir
    pre_res = norm(json.load(open(f"{B}/merges-2026-08-04/run359-results-BEFORE.json")))
    pre_tests = norm(json.load(open(f"{B}/merges-2026-08-04/run359-tests-BEFORE.json")))
    print("  (using merges-2026-08-04 BEFORE snapshots)")
now_res = json.load(open(f"{D}/run359-results.json"))
now_ids = {r["id"] for r in now_res}
pre_ids = {r["id"] for r in pre_res}
lost = sorted(pre_ids - now_ids)
gained = sorted(now_ids - pre_ids)
print(f"prior results = {len(pre_ids)}; live results = {len(now_ids)}")
print(f"  present BY ID = {len(pre_ids & now_ids)}")
print(f"  DROPPED BY ID = {len(lost)} -> {lost}")
print(f"  NEW result ids = {len(gained)} -> {gained}")

# which case did each dropped result belong to?
pre_t = {t["id"]: t for t in pre_tests}
byres = {r["id"]: r for r in pre_res}
deleted = [30608,30586,30350,30182,30445,30529,30532,30453,30544]
print("\n  dropped results traced to their case:")
for rid in lost:
    tid = byres[rid]["test_id"]
    cid = pre_t[tid]["case_id"]
    print(f"    result {rid} -> test {tid} -> C{cid}  {'= AUTHORISED DELETE' if cid in deleted else '*** NOT A DELETED CASE ***'}")

# every surviving case's results intact
surv_pre = {r["id"] for r in pre_res if pre_t[byres[r["id"]]["test_id"]]["case_id"] not in deleted}
print(f"\n  results belonging to SURVIVING cases before = {len(surv_pre)}; still present = {len(surv_pre & now_ids)}; missing = {len(surv_pre - now_ids)}")

# --- run tests set-equality both ways vs live ours ---
tests = json.load(open(f"{D}/run359-tests.json"))
tcase = {t["case_id"] for t in tests}
print(f"\n### RUN 359 vs LIVE OURS — set equality both ways")
print(f"  run tests {len(tests)}, distinct case_ids {len(tcase)}; live ours {len(ours_ids)}")
print(f"  in run not in ours: {sorted(tcase - ours_ids)}")
print(f"  in ours not in run: {sorted(ours_ids - ours_ids & tcase)}")
print(f"  SET-EQUAL BOTH WAYS: {tcase == ours_ids}")
