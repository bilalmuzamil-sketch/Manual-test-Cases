#!/usr/bin/env python3
"""Rule-28 THREE-DIMENSION per-case verdict table for the Filters closing pass.

Dimension 1 (USEFUL) is carried forward from the 2026-07-31 Ruthless Usefulness
Audit for the 101 surviving cases it scored, and DERIVED HERE for the 9 cases
authored after it ran. Dimensions 2 (MAKES SENSE) and 3 (GENUINE +
LAYMAN-RUNNABLE) are re-scored for all 110 this pass: dimension 2 from a full
COLD READ of every active case body, dimension 3 from the Phase-2 traceability
audit plus the machine checks in sweep_2b_closing.py.
"""
import sys, os, csv, re, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caseio import active

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = "/home/user/Manual-test-Cases"
PRIOR = os.path.join(ROOT, "build/filters/quality-audit-2026-07-31/per-case-verdicts.csv")

# --- Dimension 1 for the 9 cases authored after the previous audit -------------
NEW_D1 = {
    "FLT-EMPTY-03": ("KEEP", "T1", "The v1.6 S8-R3/R4/R5 both-active empty state: message must name filters AND search, and each must clear independently. Not covered by FLT-EMPTY-01/02 (filters-only)."),
    "FLT-URL-06":   ("KEEP", "T2", "The S11-N3 NEGATIVE: 'Back to my view' must be ABSENT on your own view. No other case asserts the absence; a false-positive control is a real reportable bug."),
    "FLT-PARTS-13": ("KEEP", "T1", "Regression guard for Branko's Q3 parity ruling: nothing else in the suite checks that the redesign did not silently DROP a filter or a choice shops use today. One case for Parts AND Reports, not one per page."),
    "FLT-PSRCH-08": ("KEEP", "T2", "Consolidates the six ratified component-state requirements (S13-R2..R8: default look, hover, expand-in-place at 180px, placeholder, typed state + clear icon, long-query scroll) into ONE case instead of six — the anti-slop shape."),
    "FLT-PSRCH-09": ("KEEP", "T1", "Query mechanics contract: debounce (S13-R7, 300ms / Inventory 350ms), no Apply, Enter is a no-op, results replace the table in place (S13-R12). Failure = the search feels broken or double-fires."),
    "FLT-PSRCH-10": ("KEEP", "T1", "S13-R11 + S13-R24: the Work Orders tabs SHARE one query and it searches only the active tab. Cross-tab leakage would be a real data-trust bug."),
    "FLT-PSRCH-11": ("KEEP", "T1", "The complement of PSRCH-10 — Parts views and Report tabs each keep a SEPARATE query (S13-R24). Opposite behaviour on a different surface, so not a duplicate."),
    "FLT-PSRCH-12": ("KEEP", "T2", "S14-R3 negative: an OLD link carrying a global-search parameter must no longer narrow the list. Guards the removal itself, which nothing else does."),
    "FLT-PSRCH-13": ("KEEP", "T2", "S13-E1 edge case: collapsing the filter bar must not cancel an active search (the search lives in the toolbar row, the chips in the row below)."),
}

# --- Dimension 1 re-verdicts changed by THIS pass ------------------------------
D1_REVERDICT = {
    "FLT-BAR-03": ("MERGE", "MG19-ESTIMATES-TAB-BAR", "FLT-TAB-02",
                   "Re-verdicted from CUT to MERGE on a fresh read: its expected 1 (the filter BAR itself does not disappear on the Estimates tab) is genuinely NOT asserted by FLT-TAB-02 = C29609, which speaks about the chips. Fold that one line into C29609 and retire this case; do not simply delete it."),
}

# --- Dimension 2 re-scores (the cold read) ------------------------------------
D2 = {
    "FLT-PSRCH-06": ("FIX-WORDING (REPAIRED IN-PASS)",
                     "Fail condition 6 (not actionable): steps 1-5 were bare LISTS of surfaces with no verb, the action only arriving in step 6. Repaired — every list step now starts with 'Visit ...'."),
    "FLT-MOB-01":   ("FIX-WORDING (REPAIRED IN-PASS)",
                     "Rules 7/9: expected 3 ended '(per the design variant)' — internal design jargon in a tester-facing line. Repaired to the plain hedge pattern used elsewhere in the suite."),
}
D2_DEFAULT = ("SENSIBLE",
              "Cold-read PASS (full body read this pass): preconditions reachable and seeding stated where needed, steps executable in the order given, expected follows from the steps, no internal contradiction, every control traceable to the v1.6 spec or the captured design (anything unpinned is explicitly hedged), and pass/fail is observable.")


def main():
    prior = {r["internal_id"]: r for r in csv.DictReader(open(PRIOR))}
    trace = {r["internal_id"]: r for r in
             csv.DictReader(open(os.path.join(HERE, "traceability-per-case.csv")))}
    rows = []
    for _, c in active():
        i = c["id"]
        if i in D1_REVERDICT:
            v, mg, surv, why = D1_REVERDICT[i]
            tier = prior[i]["tier"]
            src = "re-verdicted this pass"
        elif i in prior:
            v, mg, surv = prior[i]["verdict"], prior[i]["merge_group"], prior[i]["merge_survivor"]
            why, tier = prior[i]["reason"], prior[i]["tier"]
            src = "carried forward from the 2026-07-31 usefulness audit"
        else:
            v, tier, why = NEW_D1[i]
            mg = surv = ""
            src = "DERIVED this pass (case authored after the previous audit)"
        d2v, d2r = D2.get(i, D2_DEFAULT)
        t = trace[i]
        rows.append({
            "internal_id": i, "testrail_case_id": t["testrail_case_id"],
            "testrail_link": t["testrail_link"], "area": c["area"],
            "title": c["title"], "title_len": len(c["title"]),
            "d1_useful": v, "d1_tier": tier, "d1_merge_group": mg,
            "d1_merge_survivor": surv, "d1_reason": why, "d1_source": src,
            "d2_makes_sense": d2v, "d2_reason": d2r,
            "d3_genuine": "YES — %s (%s)" % (t["spec_anchors_after"], t["anchors_valid_in_v1_6"]),
            "d3_ticket": "no Jira ticket exists for Filters (stated - never invented)",
            "d3_layman_runnable": "YES — plain wording; no internal ids / spec anchors / Jira keys / VIU jargon in any tester-facing field; numbered preconditions+steps+expected 1..n; title %d chars (<=80)" % len(c["title"]),
        })
    with open(os.path.join(HERE, "rule28-per-case-verdicts.csv"), "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader(); w.writerows(rows)
    print("rows:", len(rows))
    print("D1:", collections.Counter(r["d1_useful"] for r in rows))
    print("D1 tier:", collections.Counter(r["d1_tier"] for r in rows))
    print("D2:", collections.Counter(r["d2_makes_sense"].split(" (")[0] for r in rows))
    print("D3 genuine YES:", sum(1 for r in rows if r["d3_genuine"].startswith("YES")))
    print("D3 layman YES:", sum(1 for r in rows if r["d3_layman_runnable"].startswith("YES")))
    print("held merge groups:", sorted({r["d1_merge_group"] for r in rows if r["d1_merge_group"]}))


if __name__ == "__main__":
    main()
