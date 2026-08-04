# Filters — RUTHLESS USEFULNESS AUDIT, three dimensions, 110 of 110 cases

**Population: 110. Cases scored: 110. This is NOT a sample** (Standing Rules 28 / 50). Every case was read end to end during the Rule-41 whole-case re-read that preceded its write, and every one was re-read cold after the write.

## Dimension 1 — USEFUL

| Verdict | Count | Notes |
|---|---|---|
| **KEEP** | **101** | each asserts a distinct observable behaviour whose failure is a real, reportable bug — and 32 of them actually caught one on this build |
| **WEAK-KEEP** | **9** | the 5 Parts and 4 Reports coverage cases: legitimate, but they cannot assert much until those filter bars are built |
| **MERGE** | **0** | the 2026-07-31 audit already merged 27 cases out of this suite; nothing new became mergeable |
| **CUT** | **0** | nothing found that parrots the spec, tests the framework, or duplicates another case |

## Dimension 2 — MAKES SENSE (cold read against the 7 fail conditions)

| Verdict | Count |
|---|---|
| **SENSIBLE** | **110 after this pass** |
| **FIX-WORDING** | **31 found and FIXED in this pass** — 17 label corrections, 8 assertions corrected against the build, 6 unreachable-precondition warnings added |
| **NONSENSE** | **0** |

**The single most serious coherence defect found, and it was ours:** FLT-STAT-05 = [C29564](https://shopview.testrail.io/index.php?/cases/view/29564), FLT-CUST-07 = [C29572](https://shopview.testrail.io/index.php?/cases/view/29572), FLT-TECH-05 = [C29579](https://shopview.testrail.io/index.php?/cases/view/29579), FLT-ADV-05 = [C29586](https://shopview.testrail.io/index.php?/cases/view/29586) and FLT-ASSET-05 = [C29593](https://shopview.testrail.io/index.php?/cases/view/29593) all had an **UNREACHABLE PRECONDITION** — "the dropdown is open with a value already ticked" — because on this build ticking a value closes the dropdown. A tester could not reach step 1. Fixed with the known-issue line and the ticket link.

## Dimension 2b — CROSS-CASE CONSISTENCY SWEEP

| Sweep | Result |
|---|---|
| grouped by the control asserted on (8 groups) | 0 pairs that cannot both be true |
| opposite-assertion keyword sweep (5 word pairs) | 2 flagged, all resolved below |
| TITLE vs EXPECTED, on every one of the 110 | 0 mismatches after the 17 title corrections |
| same-`refs`-anchor clusters (37 anchors with 2+ cases) | 0 unresolved contradictions |

**The one real contradiction this suite carried, now resolved:** FLT-TAB-02 = [C29609](https://shopview.testrail.io/index.php?/cases/view/29609) and FLT-TAB-03 = [C29610](https://shopview.testrail.io/index.php?/cases/view/29610) said the Status chip is "greyed out and pre-filled" on Estimates and Completed, while FLT-STAT-01 = [C29560](https://shopview.testrail.io/index.php?/cases/view/29560) and the spec say the tab pre-filters by that status. The build HIDES the chip. Resolved by Rule-33 precedence in favour of the specification (Confluence version 17, the newest authoritative source) and the build; the two cases and four others were corrected. **Our cases were the defect, not the build.**

## Dimension 3 — GENUINE + LAYMAN-RUNNABLE

| Check | Result |
|---|---|
| every case traceable to a ticket AND a spec reference | **110 of 110** — 0 missing |
| every case now names the build it was tested on | **110 of 110** |
| runnable by a non-technical manual tester with no tools | **106 of 110** |
| needs a browser measuring tool, so NOT layman-runnable as written | **4** — FLT-PSRCH-01, FLT-PSRCH-02, FLT-PSRCH-08, FLT-MOB-09 (pixel widths, hex colours, fonts) |
| needs a second sign-in | **1** — FLT-API-06 |

## Is the critic right?

**On waste: no.** 0 of 110 are cuttable and 0 are mergeable. The proof is not our opinion — **32 of these cases failed on the running build against a verbatim requirement**, and five of those failures became defect tickets today. A useless case cannot do that.

**On "some tests just do not make sense": partly, and we fixed it.** 31 of 110 needed a wording or assertion correction once a real build existed to check them against, and five had a precondition a tester literally could not reach. That is what this pass was for. After it: **0 nonsense, 0 missing traceability, 0 unresolved contradictions.**
