# RE-CHECK QUEUE — the 8 phone cases · STATUS: **OPEN**

**Read this at every session start, and before and after any Filters work.**
There is **no background timer** — this file plus that habit *is* the mechanism.

**Why it is open.** These eight cases now say what the specification and the product owner say. **None
of it was checked against the running app**, because no working sign-in exists (see
`BUILD-MARKER.md`). Under Standing Rule 49 that makes every row here **document-sourced and
provisional**, and under Standing Rule 12 no verdict of pass or fail may be written until someone
looks.

**Run this queue the moment fresh QA cookies for `sv8785.qa.shopview.com` arrive.** What to observe,
with named test data, is set out in `PENDING-LIVE-CHECK.md`. Each row then flips to **CONFIRMED** or
**CHANGED** with fresh evidence, and its marker converts from HOLD to READY or READY - EXPECT FAIL.

**Build these rows were written against:** `v3.4.2-d00239b`, `index.html` last-modified
Tue, 04 Aug 2026 22:51:02 GMT, etag `b9ab1d41718b5e871432064ed914e2e7` — read by us at 11:59:30Z and
again at 12:20:02Z, **identical**. If the marker has moved by the time this queue is run, say so and
re-check against the new one.

**Sources these rows rest on:** Confluence page 572030978 **version 18** (§4 Key Decisions, S12-R6,
S12-R2) and Branko Cicovic's comment on
[SV-8825](https://shopview.atlassian.net/browse/SV-8825) at **2026-08-05T05:18:22-0500** —
*"This is updated in the filters prd, I'm closing it."*

| # | Case | C-id | Link | What the case now asserts | What must be confirmed live | Marker now | Status |
|---|---|---|---|---|---|---|---|
| 1 | FLT-MOB-01 | C29621 | https://shopview.testrail.io/index.php?/cases/view/29621 | the chip row sits below the tabs, scrolls sideways, starts with "All Filters" (S12-R1) | the row and its scroll arrow at a phone size | HOLD | **PENDING** |
| 2 | FLT-MOB-02 | C29622 | https://shopview.testrail.io/index.php?/cases/view/29622 | the All Filters sheet lists the five filters as accordion rows with a sticky "Apply filters" button (S12-R3, S12-R6) | the sheet, the button, **and the button's exact label** | HOLD | **PENDING** |
| 3 | FLT-MOB-03 | C29623 | https://shopview.testrail.io/index.php?/cases/view/29623 | tapping "Apply filters" applies the ticked statuses and the reopened sheet shows the count (S12-R2/R3/R6, S2-R1) | that nothing is applied before the button, and the count in the title | HOLD | **PENDING** |
| 4 | **FLT-MOB-04** | **C29624** | https://shopview.testrail.io/index.php?/cases/view/29624 | **a single chip's own sheet stages the choices and applies only on "Apply filters"** (S12-R2, S12-R6, S2-R2) — **reversed this pass** | **whether a single filter's sheet has the button at all, and whether it allows more than one value** — this is the one [SV-8875](https://shopview.atlassian.net/browse/SV-8875) reports | HOLD | **PENDING — the sharp one** |
| 5 | FLT-MOB-05 | C29625 | https://shopview.testrail.io/index.php?/cases/view/29625 | Customer inside the All Filters sheet: search, multi-select, removable tags, then Apply (S12-R2/R6, S3-R2/R3) | the search, the tags, and that Apply is what applies it | HOLD | **PENDING** |
| 6 | FLT-MOB-06 | C29626 | https://shopview.testrail.io/index.php?/cases/view/29626 | Lead Technician and Service Advisor accordion rows each offer a Search field and a list (S12-R2/R6, S4-R1, S5-R1) | both rows' contents | HOLD | **PENDING** |
| 7 | FLT-MOB-07 | C29627 | https://shopview.testrail.io/index.php?/cases/view/29627 | Asset on Site offers Yes / No plus Clear Selection, one at a time (S12-R2/R6, S6-R1) | the two options and the single-choice behaviour | HOLD | **PENDING** |
| 8 | FLT-MOB-10 | C29630 | https://shopview.testrail.io/index.php?/cases/view/29630 | filters matching nothing show the same empty state as desktop (S12-N1, S8-R3) | the empty state on a phone. **Note:** its known-issue line names [SV-8845](https://shopview.atlassian.net/browse/SV-8845), which Ahtasham closed **OBSOLETE** at 2026-08-05T04:41:58-0500 — so that line needs a decision as well as a look | HOLD | **PENDING** |

## Two things to settle in the same visit

1. **The label's capital letter.** The specification writes **"Apply filters"** and all eight cases
   follow it. This morning's capture on this same build shows the on-screen text as **"Apply Filters"**
   (`data-test-id="apply_filters"`). **The label in our cases is specification-sourced and was NOT
   live-confirmed this pass.** If the build really shows a capital F, correct all eight (Standing
   Rule 9).
2. **Row 8's stale ticket reference**, above.

## This queue does not replace the other one

The suite-wide Rule-49 queue at `../recheck-2026-08-05/RECHECK-QUEUE.md` is **also still OPEN**, because
engineering has not declared the `sv8785` branch final. **Both must be closed** before the Filters suite
can be called settled.
