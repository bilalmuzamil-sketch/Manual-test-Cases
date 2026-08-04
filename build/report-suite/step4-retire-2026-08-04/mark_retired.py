"""STEP 4 — mark the 9 merge/cut-deleted bodies Retired in the local case source.
LOCAL ONLY - no TestRail call of any kind. Mirrors the Fees & Discounts / Simple Flow
convention exactly: viu_status = "Retired - <date> (<reason>; C<id> deleted from TestRail;
prev status <X>)" and the same sentence appended to notes.
"""
import json, glob, csv, os, shutil

# absorbed internal id -> (C-id deleted, survivor internal id, survivor C-id, group)
DEL = {
 "IV-API-04":    (30608, "IV-API-03",    30607, "MG-IV-SNAPSHOT-RERUN"),
 "IV-SORT-04":   (30586, "IV-TOT-01",    30556, "MG-IV-TOTALS-POSITION"),
 "PV-ROW-10":    (30350, "PV-CALC-06",   30364, "MG-PV-REVERSAL"),
 "SBC-EMPTY-02": (30182, "SBC-EMPTY-01", 30181, "MG-SBC-EMPTY-LOADING"),
 "TU-LOC-04":    (30445, "TU-LOC-03",    30444, "MG-TU-LOC-FALLBACK"),
 "WIP-API-02":   (30529, "WIP-API-01",   30528, "MG-WIP-SNAPSHOT-SHAPE"),
 "WIP-API-05":   (30532, "WIP-API-03",   30530, "MG-WIP-SNAPSHOT-PRECISION"),
 "WIP-TAB-03":   (30453, "WIP-TAB-02",   30452, "MG-WIP-TAB-COUNTS"),
 "IV-SCOPE-05":  (30544, "IV-SCOPE-01",  30540, "CUT (duplicate of IV-SCOPE-01)"),
}
BK = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backup")
os.makedirs(BK, exist_ok=True)

changed = []
for p in sorted(glob.glob("build/report-suite/cases/*.json")):
    cases = json.load(open(p))
    hit = False
    for it in cases:
        iid = it["id"]
        if iid not in DEL:
            continue
        cid, surv, survc, grp = DEL[iid]
        prev = it.get("viu_status")
        if "Retired" in str(prev):
            continue
        if grp.startswith("CUT"):
            reason = (f"CUT per the usefulness audit; its one assertion was folded into {surv} "
                      f"(C{survc}) first; C{cid} deleted from TestRail")
        else:
            reason = (f"merged into {surv} (C{survc}) under {grp}; its unique assertions were "
                      f"folded into the survivor BEFORE deletion; C{cid} deleted from TestRail")
        it["viu_status"] = f"Retired - 2026-08-04 ({reason}; prev status {prev})"
        note = (f"RETIRED 2026-08-04 (QA-lead-authorised merge/cut): {reason}. delete_case C{cid} "
                f"returned HTTP 200 and the re-GET returned HTTP 400 = gone. Body kept locally for "
                f"the record; row removed from testrail-id-map.csv (the mapping is preserved here "
                f"and in the Step-1 count reconciliation). Prior viu_status was: {prev}")
        it["notes"] = (it.get("notes") + " | " + note) if it.get("notes") else note
        changed.append((p, iid, cid, surv))
        hit = True
    if hit:
        shutil.copy(p, os.path.join(BK, os.path.basename(p)))
        json.dump(cases, open(p, "w"), indent=1, ensure_ascii=False)
        open(p, "a").write("\n")

print(f"marked Retired: {len(changed)}")
for p, iid, cid, surv in changed:
    print(f"  {iid:14s} C{cid} -> survivor {surv:14s} in {os.path.basename(p)}")
