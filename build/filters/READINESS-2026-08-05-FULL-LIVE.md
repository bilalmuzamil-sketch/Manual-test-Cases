# READINESS — Filters, 2026-08-05 (rebuilt after the full live pass)

**This supersedes `build/filters/READINESS-2026-08-05.md`, which was written before all 110 cases had been driven live. That file is kept, not deleted.**

Build every figure below belongs to: **`v3.4.2-d00239b`**, `index.html` last-modified Tue 04 Aug 2026 22:51:02 GMT, etag `b9ab1d41718b5e871432064ed914e2e7`, byte-identical at 19:53Z, 21:00Z and 21:34Z.
Specification: **Confluence version 18**. Epic **SV-8785**, 23 children.

## The headline

| | Count |
|---|---|
| Cases in the suite | **110** |
| **Observed live in this pass** | **110 — all of them** |
| Carried forward from an earlier pass | **0** |
| PASS | 81 |
| DEVIATION (every one ticketed) | 14 |
| HOLD | 15 |
| `AUTOMATION: READY` | 81 |
| `AUTOMATION: READY - EXPECT FAIL` | 14 |
| `AUTOMATION: HOLD` | 15 |
| **READY TO AUTOMATE** | **95** |

**The arithmetic gate passes.** 81 READY + 14 EXPECT-FAIL = **95**, and 110 total − 15 HOLD = **95**. The two agree.

The previous figure was 100 (82 READY + 18 EXPECT-FAIL). It is now **95**, five lower, and every one of the five is explained: HOLD rose from 10 to 15 because C29615 needs a second login, C38880 and C38881 assert behaviour no source documents or need an account that no longer exists, and C38891 and C38901 have preconditions the part-finished page-search rollout cannot meet. **A lower honest figure is the point of the exercise.**

## Per area — every row sums

| Area | Cases | PASS | DEVIATION | HOLD | READY | EXPECT-FAIL | Ready to automate |
|---|---|---|---|---|---|---|---|
| API — Work Orders List Filtering | 6 | 4 | 1 | 1 | 4 | 1 | 5 |
| Active Filter Chips and Clear Filters | 6 | 6 | 0 | 0 | 6 | 0 | 6 |
| Asset on Site Filter | 7 | 7 | 0 | 0 | 7 | 0 | 7 |
| Collapse and Expand | 5 | 5 | 0 | 0 | 5 | 0 | 5 |
| Customer Filter | 9 | 9 | 0 | 0 | 9 | 0 | 9 |
| Empty State | 3 | 0 | 3 | 0 | 0 | 3 | 3 |
| Filter Bar Layout and Visibility | 3 | 2 | 1 | 0 | 2 | 1 | 3 |
| Lead Technician Filter | 7 | 7 | 0 | 0 | 7 | 0 | 7 |
| Mobile Filters | 10 | 7 | 3 | 0 | 7 | 3 | 10 |
| Page Search Toolbar | 13 | 10 | 1 | 2 | 10 | 1 | 11 |
| Parts Page Filters | 5 | 0 | 0 | 5 | 0 | 0 | 0 |
| Persistence | 6 | 1 | 2 | 3 | 1 | 2 | 3 |
| Reports Page Filters | 4 | 0 | 0 | 4 | 0 | 0 | 0 |
| Service Advisor Filter | 7 | 7 | 0 | 0 | 7 | 0 | 7 |
| Status Filter | 7 | 7 | 0 | 0 | 7 | 0 | 7 |
| Tab Behaviour | 6 | 6 | 0 | 0 | 6 | 0 | 6 |
| URL State and Shareable Links | 6 | 3 | 3 | 0 | 3 | 3 | 6 |
| **TOTAL** | **110** | **81** | **14** | **15** | **81** | **14** | **95** |

## What the 15 HOLDs are waiting on, and who owes it

| Waiting on | Cases | Who |
|---|---|---|
| Branko's Parts and Reports product write-up — the filter bars ARE built, but nothing documents what they should do | C38904, C38905, C38906, C38907, C38908, C38882, C38909, C38910, C38911, C38880 = **10** | **Branko** |
| A second test login on this branch | C29615, C38895 = **2** | **QA lead** |
| The page-search rollout finishing — Customers still uses the old table search, and Reports, Dashboard and Administration have no search box at all | C38891, C38901 = **2** | engineering |
| An account whose filters were saved before the redesign | C38881 = **1** | engineering / data |

**These four rows total exactly 15, the HOLD count — no case is double-counted and none is missing.**

## The 14 expect-fail cases, and the ticket each waits on

| Ticket | Status read live at write time | Cases |
|---|---|---|
| **SV-8832** | Open — still reproduces | C29616, C29619, C29620, C29634 |
| **SV-8847** | closed OBSOLETE but **still reproduces** — recommend reopening | C29606, C29607, C38897 |
| **SV-8875** | Open — still reproduces | C29624, C29625 |
| **SV-8883** | Open — replaces the closed SV-8843 | C29557 |
| **SV-8871** | Open — still reproduces | C29613 |
| **SV-8845** | **reopened by the QA lead** — still reproduces, and worse than merely being ignored | C29618 |
| **SV-8846** | Open — still reproduces | C29628 |
| **SV-8912** | Open — **filed by this pass** | C38889 |

**These total exactly 14, the EXPECT-FAIL count.**

## Honest limits

- **The branch is not final and will not be declared final**, so all 110 verdicts are PROVISIONAL. That is a statement about durability, not rigour: all 110 were observed live on the marker named above, and each case records on itself when it was last checked.
- Two cases assert something a single account cannot demonstrate — that one person's saved filters do not reach another. They are HOLD, not quietly passed.
- The Parts and Reports filter bars are **shipped and untested**. That is the largest real gap in this project, and it is blocked on a document, not on us.
- Three things colleagues have raised have **no counterpart in our 110** and were deliberately not authored: SV-8903 (where the funnel toggle sits), SV-8904 (chip leading icons) and SV-8906 (empty-state consistency across Parts and Reports).
