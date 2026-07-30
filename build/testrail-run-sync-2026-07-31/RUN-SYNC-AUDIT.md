# TestRail Run-vs-Cases Sync Audit — 2026-07-31

**Scope:** every test run in TestRail project 1 (suite 1 "Master") checked against our
CURRENT active case sets, to find test cases that exist in TestRail but are MISSING from
the tester's run (the false-"no case exists" coverage gap).

**Method (100% READ-ONLY):** `get_runs/1` (open + closed) -> `get_run`/`get_tests/{run_id}` for
every fixed-selection run -> `get_cases/1&suite_id=1` + `get_sections/1&suite_id=1` for the live
case/section tree -> compared against each project `testrail-id-map.csv`.
**ZERO TestRail writes were made. No `update_run`, no `add_result`, no case writes.**
Execution of the sync plan in §6 **awaits explicit user authorization** (Standing Rule 6).

---

## 1. What was found (plain English)

- **113 active test cases are missing from the runs the testers are working in.**
- **6 runs need syncing.** 1 run (Global Search, run 347) is already fully in sync.
- The cause: these runs were created from a **fixed case selection** (`include_all = false`).
  TestRail does **not** add newly created cases to that kind of run. Every case we have
  authored and pushed since each run was built is simply not in the tester's list.
- The 251 open **"Nightly Test Run"** automation runs are `include_all = true` and are
  **already perfectly in sync** - verified live: run 370 contains exactly the 4,085 live
  cases, including cases added on 2026-07-30 and 2026-07-31. Nothing to do for those.
- **Deleted / retired cases already dropped out of every run by themselves** - 0 stale
  case ids found in any run (e.g. Reports Suite run 359 sits at 458 tests after the
  2026-07-28 consolidation deleted 57 cases; Schedule run 357 sits at 143 after the
  2026-07-31 consolidation). So the sync is **add-only**.
- **EVERY run already has result HISTORY** (checked live via `get_results_for_run`, not just
  the run's status counters). Two runs hold real *graded* results - **Simple Flow run 325 (147
  graded: 109 Passed / 23 Blocked / 15 Failed)** and **Fees & Discounts run 324 (185 graded:
  179 Passed / 5 Failed / 1 Retest)** - plus Custom Roles run 278 (3,521 graded). The four
  "all Untested" runs (359, 357, 352, 347) still carry 258-539 result *records* each
  (status-reset / assignment records). **A partial `case_ids` write would destroy that history
  in every one of them.** The union must be exact - always.

## 2. Per-run table (the project runs)

| Run | Name | Owner (from name) | include_all | Tests now | Active cases for that project | Missing (active, not in run) | Result records (graded) | Verdict |
|---|---|---|---|---|---|---|---|---|
| 359 | Reports Suite - Nebojsa/Viktoria (VIU Pending) | Nebojsa / Viktoria | False | 458 | 465 | **7** | 539 (0 graded) | NEEDS SYNC (+7) |
| 357 | Schedule - Ayesha (VIU Pending) | Ayesha | False | 143 | 165 | **22** | 429 (0 graded) | NEEDS SYNC (+22) |
| 352 | Filters - Ahtasham (Awaiting QA- ENV) | Ahtasham | False | 79 | 94 | **15** | 395 (0 graded) | NEEDS SYNC (+15) |
| 347 | Global Search - Mudassir (Awaiting QA- ENV) | Mudassir | False | 86 | 86 | **0** | 258 (0 graded) | IN SYNC - no action |
| 325 | Simple Flow - Ayesha Khan | Ayesha Khan | False | 152 | 187 | **35** | 342 (**147 graded**) | NEEDS SYNC (+35) |
| 324 | Fees and Discount - Ahtasham (Specs 6/7/2026) | Ahtasham | False | 178 | 203 | **25** | 363 (**185 graded**) | NEEDS SYNC (+25) |
| 278 | Custom Permissions | (unlabelled - Custom Roles suite run) | False | 746 | 755 | **9** | 3537 (**3521 graded**) | NEEDS SYNC (+9) |

### Deliberately-scoped Custom Roles runs (NOT sync candidates)

These runs were built for a named narrow purpose, so a "missing" count is meaningless for
them - they were never meant to hold the whole 755-case Custom Roles suite. Listed for
completeness (Rule 17); **no sync recommended** unless the user says otherwise.

| Run | Name | State | Tests | Custom Roles cases in run | Has results? |
|---|---|---|---|---|---|
| 323 | §3646 DVI Per-Role Access Checks — automation verification (staging, 2026-07-07) | open | 132 | 132 | YES |
| 311 | CR  - Failed and Blocked test Run - Bilal | open | 21 | 21 | YES |
| 304 | SV-7388 Custom Roles — Manual | open | 55 | 55 | YES |
| 303 | SV-7388 Custom Roles — Automation (fast) | open | 124 | 124 | YES |
| 331 | Re-Running the failed test cases - Jul 9, 2026 | closed | 160 | 61 | YES |

### Other fixed-selection runs (out of scope - contain none of our 7 project suites)

23 further fixed-selection runs exist (legacy regression / onboarding / other-feature runs:
runs 275, 274, 259, 249, 245, 243, 183, 163, 134, 56, 50, 48, 47, 46, 44, 42, 41, 40, 39, 38, 37, 36, 35).
None of them contain a single case from Report Suite / Filters / Schedule / Simple Flow /
Global Search / Fees & Discounts / Custom Roles, so there is nothing for us to sync in them.
All 23 have **0 stale case ids** too.

### Automation runs

| Group | Count | include_all | Status |
|---|---|---|---|
| "Nightly Test Run - <date>" + a few onboarding runs | 251 open, 1 closed | true | **Auto-synced - verified live on run 370 (4,085 tests == 4,085 live cases, newest cases present)** |

## 3. Missing-case lists (the actionable part)

### Run 359 - Reports Suite - Nebojsa/Viktoria (VIU Pending)

Missing **7** active Report Suite cases (run has 458 of 465).
Recorded results in this run: 539 result records, **0 graded** (all status-reset/assignment records).

| Internal ID | TestRail ID | Link | Section | Title | Added by which pass |
|---|---|---|---|---|---|
| SBC-EXP-16 | C38856 | https://shopview.testrail.io/index.php?/cases/view/38856 | SBC — Exports | Summary and Expanded View downloads exist for both PDF and CSV | Report Suite full push 2026-07-28 (video/consolidation pass) |
| TU-COL-01 | C38859 | https://shopview.testrail.io/index.php?/cases/view/38859 | TU — Visual & Accessibility | A column selector lets the user choose which columns show | Chris Ward answers push 2026-07-29 |
| PV-EXP-11 | C38885 | https://shopview.testrail.io/index.php?/cases/view/38885 | PV — Exports | An over-cap Parts Velocity export is refused with the too-large message | tech-plan push 2026-07-30 |
| TU-EXP-09 | C38887 | https://shopview.testrail.io/index.php?/cases/view/38887 | TU — Exports | An over-cap Technician Utilization export is refused with the too-large message | tech-plan push 2026-07-30 |
| WIP-CALC-10 | C38890 | https://shopview.testrail.io/index.php?/cases/view/38890 | WIP — Earned & Remaining | A technician still clocked in counts toward Labor Earned, capped at the quote | tech-plan push 2026-07-30 |
| IV-DATE-09 | C38892 | https://shopview.testrail.io/index.php?/cases/view/38892 | IV — As-of Date & Snapshots | A recorded day keeps its category and vendor names after a rename or delete | tech-plan push 2026-07-30 |
| SBR-CALC-09 | C38894 | https://shopview.testrail.io/index.php?/cases/view/38894 | SBR — Inv. Hrs & Calculations | A clock-record edit after invoicing updates Inv. Hrs; billed money stays put | tech-plan push 2026-07-30 |

### Run 357 - Schedule - Ayesha (VIU Pending)

Missing **22** active Schedule cases (run has 143 of 165).
Recorded results in this run: 429 result records, **0 graded**.

| Internal ID | TestRail ID | Link | Section | Title | Added by which pass |
|---|---|---|---|---|---|
| SCH-PERM-12 | C30614 | https://shopview.testrail.io/index.php?/cases/view/30614 | Permissions | With Work Orders: View OFF, work-order-derived details on shifts (customer, lines, money fields) are hidden or masked | spec_1 + design + Branko sync 2026-07-22 |
| SCH-EVT-08 | C30615 | https://shopview.testrail.io/index.php?/cases/view/30615 | Events | An event does not count toward a technician's capacity bar and does not raise a conflict | spec_1 + design + Branko sync 2026-07-22 |
| SCH-HRS-02 | C38847 | https://shopview.testrail.io/index.php?/cases/view/38847 | Working Hours Settings | Business-hours toggle reveals a per-day (Mon-Sun) From-To editor | epic SV-8685 backfill push 2026-07-27 |
| SCH-HRS-03 | C38848 | https://shopview.testrail.io/index.php?/cases/view/38848 | Working Hours Settings | Edit Staff has a 'Set custom hours for this technician' toggle, off by default | epic SV-8685 backfill push 2026-07-27 |
| SCH-HRS-04 | C38849 | https://shopview.testrail.io/index.php?/cases/view/38849 | Working Hours Settings | A technician with no custom hours inherits the shop business hours | epic SV-8685 backfill push 2026-07-27 |
| SCH-HRS-05 | C38850 | https://shopview.testrail.io/index.php?/cases/view/38850 | Working Hours Settings | 'Add hours' appends a removable second range for split shifts, starting empty | epic SV-8685 backfill push 2026-07-27 |
| SCH-HRS-06 | C38851 | https://shopview.testrail.io/index.php?/cases/view/38851 | Working Hours Settings | Overlapping hour ranges block Save; incomplete rows are ignored | epic SV-8685 backfill push 2026-07-27 |
| SCH-EXP-01 | C38853 | https://shopview.testrail.io/index.php?/cases/view/38853 | Week Export and Printing | Week Export opens a printable Department-by-Technician week grid | epic SV-8685 backfill push 2026-07-27 |
| SCH-REAS-06 | C38855 | https://shopview.testrail.io/index.php?/cases/view/38855 | Reassignment and Context Menu | 'New Work Order' in the cell menu points the user to the Work Orders tab | epic SV-8685 backfill push 2026-07-27 |
| SCH-SPREAD-11 | C38863 | https://shopview.testrail.io/index.php?/cases/view/38863 | Multi-Day Spread Scheduling | Spread past 8 weeks asks to confirm; a series can never exceed 120 shifts | tech-plan push 2026-07-30 |
| SCH-DEL-10 | C38864 | https://shopview.testrail.io/index.php?/cases/view/38864 | Deletion, Series Scopes and Undo | Schedule actions save immediately - Undo reverses them, closing does not cancel | tech-plan push 2026-07-30 |
| SCH-EDGE-07 | C38865 | https://shopview.testrail.io/index.php?/cases/view/38865 | Edge Cases and Responsiveness | A multi-week series keeps the same local start time across the clock change | tech-plan push 2026-07-30 |
| SCH-EDGE-08 | C38866 | https://shopview.testrail.io/index.php?/cases/view/38866 | Edge Cases and Responsiveness | Schedule and all its dialogs display correctly in dark mode | tech-plan push 2026-07-30 |
| SCH-REG-01 | C38867 | https://shopview.testrail.io/index.php?/cases/view/38867 | Cross-Module and Rewrite Regression | Shifts and events created before the Schedule rewrite still appear after it | tech-plan push 2026-07-30 |
| SCH-REG-02 | C38868 | https://shopview.testrail.io/index.php?/cases/view/38868 | Cross-Module and Rewrite Regression | Dashboard shows one schedule row per work order even with many shifts | tech-plan push 2026-07-30 |
| SCH-REG-03 | C38869 | https://shopview.testrail.io/index.php?/cases/view/38869 | Cross-Module and Rewrite Regression | A work order created with an appointment shows up on the Schedule board | tech-plan push 2026-07-30 |
| SCH-REG-04 | C38870 | https://shopview.testrail.io/index.php?/cases/view/38870 | Cross-Module and Rewrite Regression | A multi-location technician's shift appears only on the work order's location | tech-plan push 2026-07-30 |
| SCH-REG-05 | C38871 | https://shopview.testrail.io/index.php?/cases/view/38871 | Cross-Module and Rewrite Regression | Work order form offers a Priority (High/Medium/Low) that drives the sidebar | tech-plan push 2026-07-30 |
| SCH-API-01 | C38872 | https://shopview.testrail.io/index.php?/cases/view/38872 | API — Schedule | API - Schedule reads need View; writes need Edit; deletes need Delete (403) | tech-plan push 2026-07-30 |
| SCH-API-02 | C38873 | https://shopview.testrail.io/index.php?/cases/view/38873 | API — Schedule | API - Series past 8 weeks returns 409 until acknowledged; over 120 shifts 422 | tech-plan push 2026-07-30 |
| SCH-API-03 | C38874 | https://shopview.testrail.io/index.php?/cases/view/38874 | API — Schedule | API - No pricing fields in Schedule responses; WO details need Work Orders View | tech-plan push 2026-07-30 |
| SCH-API-04 | C38875 | https://shopview.testrail.io/index.php?/cases/view/38875 | API — Schedule | API - A shift from another location returns 404, not another shop's data | tech-plan push 2026-07-30 |

### Run 352 - Filters - Ahtasham (Awaiting QA- ENV)

Missing **15** active Filters cases (run has 79 of 94).
Recorded results in this run: 395 result records, **0 graded**.

| Internal ID | TestRail ID | Link | Section | Title | Added by which pass |
|---|---|---|---|---|---|
| FLT-TAB-06 | C38876 | https://shopview.testrail.io/index.php?/cases/view/38876 | Tab Behaviour | First visit opens the Estimates tab; your last-used tab is remembered | tech-plan push 2026-07-30 |
| FLT-STAT-07 | C38877 | https://shopview.testrail.io/index.php?/cases/view/38877 | Status Filter | Imported works alone: picking it greys out the other filters | tech-plan push 2026-07-30 |
| FLT-ASSET-07 | C38878 | https://shopview.testrail.io/index.php?/cases/view/38878 | Asset on Site Filter | Choosing No shows only work orders whose asset is not on site | tech-plan push 2026-07-30 |
| FLT-URL-05 | C38879 | https://shopview.testrail.io/index.php?/cases/view/38879 | URL State and Shareable Links | Opening a filtered link never overwrites your saved filters | tech-plan push 2026-07-30 |
| FLT-PERS-05 | C38880 | https://shopview.testrail.io/index.php?/cases/view/38880 | Persistence | Each page and tab remembers its own filters separately | tech-plan push 2026-07-30 |
| FLT-PERS-06 | C38881 | https://shopview.testrail.io/index.php?/cases/view/38881 | Persistence | Filters saved before the redesign carry over after the update | tech-plan push 2026-07-30 |
| FLT-RPTS-23 | C38882 | https://shopview.testrail.io/index.php?/cases/view/38882 | Active Filter Chips and Clear Filters | Date range filter: results update when both start and end dates are picked | tech-plan push 2026-07-30 |
| FLT-PSRCH-01 | C38883 | https://shopview.testrail.io/index.php?/cases/view/38883 | Page Search Toolbar | Page toolbar Search expands in place and narrows the list as you type | tech-plan push 2026-07-30 |
| FLT-PSRCH-02 | C38884 | https://shopview.testrail.io/index.php?/cases/view/38884 | Page Search Toolbar | Page search combines with filters and is cleared separately | tech-plan push 2026-07-30 |
| FLT-PSRCH-03 | C38886 | https://shopview.testrail.io/index.php?/cases/view/38886 | Page Search Toolbar | The page search text is remembered and restored like filters | tech-plan push 2026-07-30 |
| FLT-PSRCH-04 | C38888 | https://shopview.testrail.io/index.php?/cases/view/38888 | Page Search Toolbar | The search term is part of the shareable page link | tech-plan push 2026-07-30 |
| FLT-PSRCH-05 | C38889 | https://shopview.testrail.io/index.php?/cases/view/38889 | Page Search Toolbar | On mobile the search expands in the toolbar and buttons make room | tech-plan push 2026-07-30 |
| FLT-PSRCH-06 | C38891 | https://shopview.testrail.io/index.php?/cases/view/38891 | Page Search Toolbar | Every list page keeps its own search box (Parts, Reports, detail tabs) | tech-plan push 2026-07-30 |
| FLT-PSRCH-07 | C38893 | https://shopview.testrail.io/index.php?/cases/view/38893 | Page Search Toolbar | The top navigation search no longer filters page lists | tech-plan push 2026-07-30 |
| FLT-API-06 | C38895 | https://shopview.testrail.io/index.php?/cases/view/38895 | API — Work Orders List Filtering | Saved-filters service round-trip: save, reload, and per-user isolation | tech-plan push 2026-07-30 |

### Run 347 - Global Search - Mudassir (Awaiting QA- ENV)

**IN SYNC.** All 86 active Global Search cases are in the run. No action.

### Run 325 - Simple Flow - Ayesha Khan

Missing **35** active Simple Flow cases (run has 152 of 187).
Recorded results in this run: 342 result records, **147 graded** (109 Passed / 23 Blocked / 15 Failed, 41 with comments) - **HIGH CARE**.

| Internal ID | TestRail ID | Link | Section | Title | Added by which pass |
|---|---|---|---|---|---|
| SF-VMIS-07 | C29439 | https://shopview.testrail.io/index.php?/cases/view/29439 | Vendor Missing on WO PO (Story 6) | Verify a sell-price-only part is orderable from the line's Order action, joins the Vendor-Missing PO and moves to waiting-to-receive | V2.4 delta pass 2026-07-13/14 |
| SF-RCV-10 | C29440 | https://shopview.testrail.io/index.php?/cases/view/29440 | Accept Delivery (Story 12) | Verify cost is editable on the Accept Delivery screen when $0 or missing (parity with Bulk Receive) | V2.4 delta pass 2026-07-13/14 |
| SF-VEND-06 | C29442 | https://shopview.testrail.io/index.php?/cases/view/29442 | Assign Vendor + Merge (Story 13) | Verify a part cannot be received until a missing cost / sell price is entered | V2.4 delta pass 2026-07-13/14 |
| SF-AUTO-01 | C29461 | https://shopview.testrail.io/index.php?/cases/view/29461 | Auto-Complete Trigger (Story 16 R12/R13) | Verify resolving the last open line by completing a single line auto-completes the work order when Require Review is off | spec _3 / design _4 auto-complete pass 2026-07-15 |
| SF-AUTO-02 | C29462 | https://shopview.testrail.io/index.php?/cases/view/29462 | Auto-Complete Trigger (Story 16 R12/R13) | Verify resolving the last open lines in bulk (several at once) auto-completes the work order when Require Review is off | spec _3 / design _4 auto-complete pass 2026-07-15 |
| SF-AUTO-03 | C29463 | https://shopview.testrail.io/index.php?/cases/view/29463 | Auto-Complete Trigger (Story 16 R12/R13) | Verify a split that leaves a work order fully resolved auto-completes that work order when Require Review is off | spec _3 / design _4 auto-complete pass 2026-07-15 |
| SF-AUTO-04 | C29464 | https://shopview.testrail.io/index.php?/cases/view/29464 | Auto-Complete Trigger (Story 16 R12/R13) | Verify deleting a line so the remaining lines are all resolved auto-completes the work order when Require Review is off | spec _3 / design _4 auto-complete pass 2026-07-15 |
| SF-AUTO-05 | C29465 | https://shopview.testrail.io/index.php?/cases/view/29465 | Auto-Complete Trigger (Story 16 R12/R13) | Verify that with Require Review on, resolving the last open line routes the work order to Ready for Review instead of auto-completing | spec _3 / design _4 auto-complete pass 2026-07-15 |
| SF-AUTO-06 | C29466 | https://shopview.testrail.io/index.php?/cases/view/29466 | Auto-Complete Trigger (Story 16 R12/R13) | Verify a clock-out that finishes the last line routes the work order to Ready for Review even when Require Review is off | spec _3 / design _4 auto-complete pass 2026-07-15 |
| SF-AUTO-07 | C29467 | https://shopview.testrail.io/index.php?/cases/view/29467 | API — Auto-Complete Trigger (Story 16) | Verify the work order status transitions on the backend when the last open line is resolved (auto-Complete when review off, Ready for Review when review on) | spec _3 / design _4 auto-complete pass 2026-07-15 |
| SF-CORE-11 | C29892 | https://shopview.testrail.io/index.php?/cases/view/29892 | Core parts — Pre-Resolve (Story 18) | Verify the Resolve cores screen lists every un-received vendor core with part info, core charge and OK / Not OK, plus an invoice-accuracy message | spec _4 / V2.6 (Story-18 pre-resolve-cores) push 2026-07-17 |
| SF-CORE-12 | C29893 | https://shopview.testrail.io/index.php?/cases/view/29893 | Core parts — Pre-Resolve (Story 18) | Verify marking a core Not OK immediately adds the core charge to the work order total and customer invoice, while OK adds no charge | spec _4 / V2.6 (Story-18 pre-resolve-cores) push 2026-07-17 |
| SF-CORE-13 | C29894 | https://shopview.testrail.io/index.php?/cases/view/29894 | Core parts — Pre-Resolve (Story 18) | Verify completion and invoice creation are blocked only while a core is undecided — a decided core does not block | spec _4 / V2.6 (Story-18 pre-resolve-cores) push 2026-07-17 |
| SF-CORE-14 | C29895 | https://shopview.testrail.io/index.php?/cases/view/29895 | Core parts — Pre-Resolve (Story 18) | Verify receiving a pre-resolved core auto-applies the saved decision: OK creates exactly one vendor return, Not OK creates none, the invoice never changes, retries create no duplicates | spec _4 / V2.6 (Story-18 pre-resolve-cores) push 2026-07-17 |
| SF-CORE-15 | C29896 | https://shopview.testrail.io/index.php?/cases/view/29896 | Core parts — Pre-Resolve (Story 18) | Verify the receive dialog locks quantity to the full remaining amount once the work order is invoiced/paid, with the core auto-selected and an explanatory tooltip | spec _4 / V2.6 (Story-18 pre-resolve-cores) push 2026-07-17 |
| SF-CORE-16 | C29897 | https://shopview.testrail.io/index.php?/cases/view/29897 | Core parts — Pre-Resolve (Story 18) | Verify the Lines tab shows the core decision state before and after receive: 'Core decision pending', 'Core OK — return to vendor, no charge', 'Core Not OK — customer charged' | spec _4 / V2.6 (Story-18 pre-resolve-cores) push 2026-07-17 |
| SF-CORE-17 | C29898 | https://shopview.testrail.io/index.php?/cases/view/29898 | Core parts — Pre-Resolve (Story 18) | Verify a core decision cannot be changed once the work order has an active invoice | spec _4 / V2.6 (Story-18 pre-resolve-cores) push 2026-07-17 |
| SF-CORE-18 | C29899 | https://shopview.testrail.io/index.php?/cases/view/29899 | API — Core Pre-Resolve (Story 18) | API: Verify POST /api/work-orders/{id}/pre-resolve-cores persists the core decision on the part request with no side-effect records | spec _4 / V2.6 (Story-18 pre-resolve-cores) push 2026-07-17 |
| SF-CORE-19 | C29900 | https://shopview.testrail.io/index.php?/cases/view/29900 | API — Core Pre-Resolve (Story 18) | API: Verify resolving a received core via the existing handle-core endpoints also writes the decision back to the linked core part request | spec _4 / V2.6 (Story-18 pre-resolve-cores) push 2026-07-17 |
| SF-RCV-11 | C29901 | https://shopview.testrail.io/index.php?/cases/view/29901 | Receive Button on WO POs (Story 11) | Verify returning from receiving lands on the exact work order line the receive started from, not the top of the work order | spec _4 / V2.6 (Story-18 pre-resolve-cores) push 2026-07-17 |
| SF-RCV-12 | C29902 | https://shopview.testrail.io/index.php?/cases/view/29902 | Accept Delivery (Story 12) | Verify clicking Receive on a single work order part opens Accept Delivery showing all of that vendor's to-receive parts plus the vendorless group | spec _4 / V2.6 (Story-18 pre-resolve-cores) push 2026-07-17 |
| SF-RCV-13 | C29903 | https://shopview.testrail.io/index.php?/cases/view/29903 | Accept Delivery (Story 12) | Verify a vendorless part can be assigned a vendor / merged into the single-part receive on the spot, reusing the same invoice number | spec _4 / V2.6 (Story-18 pre-resolve-cores) push 2026-07-17 |
| SF-VEND-07 | C29904 | https://shopview.testrail.io/index.php?/cases/view/29904 | Assign Vendor + Merge (Story 13) | Verify an assigned vendor stays changeable via the same dropdown until the part is received or the work order is invoiced/paid | spec _4 / V2.6 (Story-18 pre-resolve-cores) push 2026-07-17 |
| SF-VEND-08 | C29905 | https://shopview.testrail.io/index.php?/cases/view/29905 | Assign Vendor + Merge (Story 13) | Verify the part number stays editable via the edit icon after entry until the part is received or the work order is invoiced/paid | spec _4 / V2.6 (Story-18 pre-resolve-cores) push 2026-07-17 |
| SF-POSEL-07 | C29906 | https://shopview.testrail.io/index.php?/cases/view/29906 | PO Multi-Select (Story 7) | Verify part-sale-originated POs appear in the PO list and are selectable like work-order POs | spec _4 / V2.6 (Story-18 pre-resolve-cores) push 2026-07-17 |
| SF-BULK-11 | C29907 | https://shopview.testrail.io/index.php?/cases/view/29907 | PO Bulk Receive Page (Story 8) | Verify a part-sale-originated PO can be received on the Bulk Receive page like a work-order PO | spec _4 / V2.6 (Story-18 pre-resolve-cores) push 2026-07-17 |
| SF-WOP-04 | C29908 | https://shopview.testrail.io/index.php?/cases/view/29908 | Waiting on Parts Column (Story 14) | Verify part-sale orders behave with the Waiting on Parts column — unreceived count and receive shortcut work without errors | spec _4 / V2.6 (Story-18 pre-resolve-cores) push 2026-07-17 |
| SF-QB-09 | C29909 | https://shopview.testrail.io/index.php?/cases/view/29909 | QuickBooks / Inventory Integrity | Verify part-sale order status transitions are not regressed by the shared order/status logic (requested to waiting-to-receive to received) | spec _4 / V2.6 (Story-18 pre-resolve-cores) push 2026-07-17 |
| (not in id-map) | C30641 | https://shopview.testrail.io/index.php?/cases/view/30641 | Waiting on Parts Column (Story 14) | Waiting-on-parts link opens single-PO receive and returns to Work Orders list | concurrent session (not in our id-map) |
| (not in id-map) | C30645 | https://shopview.testrail.io/index.php?/cases/view/30645 | Completion — No-PO / Skip (Story 2) | Verify Go to Invoice is hidden on the completion Success screen for a user without invoice view and financial data permissions | concurrent session (not in our id-map) |
| SF-PERM-11 | C30646 | https://shopview.testrail.io/index.php?/cases/view/30646 | Permissions | Verify a Vendor & Order Management View-only user cannot receive purchase orders by any path on the Bulk Receive screen | SV-8183 corrective push 2026-07-24 |
| SF-PERM-12 | C30647 | https://shopview.testrail.io/index.php?/cases/view/30647 | Permissions | Verify a no-access role (Time Clock) cannot edit, cancel or change the vendor of a work order part from the part menu | SV-8183 corrective push 2026-07-24 |
| SF-RCV-14 | C38860 | https://shopview.testrail.io/index.php?/cases/view/38860 | Regression & Edge Cases — from tickets | Sell price auto-calculates from Cost when receiving a special order part | sell-price corrective push 2026-07-29 |
| SF-RCV-15 | C38861 | https://shopview.testrail.io/index.php?/cases/view/38861 | Regression & Edge Cases — from tickets | Sell price recalculates on every repeated Cost edit on the Receive screen | sell-price corrective push 2026-07-29 |
| SF-VPART-08 | C38862 | https://shopview.testrail.io/index.php?/cases/view/38862 | Regression & Edge Cases — from tickets | Editing Cost in the part edit dialog updates the Sell price and Margin | sell-price corrective push 2026-07-29 |

### Run 324 - Fees and Discount - Ahtasham (Specs 6/7/2026)

Missing **25** active Fees & Discounts cases (run has 178 of 203).
Recorded results in this run: 363 result records, **185 graded** (179 Passed / 5 Failed / 1 Retest) - **HIGH CARE**.

| Internal ID | TestRail ID | Link | Section | Title | Added by which pass |
|---|---|---|---|---|---|
| FD-WO-016 | C29441 | https://shopview.testrail.io/index.php?/cases/view/29441 | Work Order — Whole-WO Fee/Discount | Verify the Add/Edit fee-or-discount dialog shows the tax-jurisdiction note below the Taxable Yes/No dropdown | V1_2 spec pass 2026-07-13 |
| FD-TMPL-018 | C29917 | https://shopview.testrail.io/index.php?/cases/view/29917 | Template admin — create | Verify the admin Fee/Discount template dialog shows the tax-jurisdiction note below the Taxable Yes/No dropdown (for every kind) | staging live VIU 2026-07-20 |
| FD-PSALE-001 | C29918 | https://shopview.testrail.io/index.php?/cases/view/29918 | Parts page — 'FEES & DISCOUNTS' column | Verify the Part Sale Add/Edit fee-or-discount dialog shows the tax-jurisdiction note below the Taxable Yes/No dropdown | staging live VIU 2026-07-20 |
| FD-PERM-012 | C29922 | https://shopview.testrail.io/index.php?/cases/view/29922 | Permissions (Story 13) | Fees & Discounts settings page gated by settingsService (not settingsFinance) | dev-authored automated, reconciled 2026-07-21 |
| FD-PERM-013 | C29923 | https://shopview.testrail.io/index.php?/cases/view/29923 | Permissions (Story 13) | Service admin can complete the Fees & Discounts template delete flow | dev-authored automated, reconciled 2026-07-21 |
| FD-WO-017 | C30618 | https://shopview.testrail.io/index.php?/cases/view/30618 | Work Order — Labor-line Fee/Discount | Verify the labor fee/discount entry point is a three-dot menu to the RIGHT of the first technician (or 'Unassigned') and reads 'Add Labor Fee / Discount' | SV-8479/8480 authorized sync 2026-07-22 |
| FD-WO-018 | C30619 | https://shopview.testrail.io/index.php?/cases/view/30619 | Work Order / Parts — Part-line Fee/Discount | Verify the work-order part row three-dot menu item reads 'Add Part Fee / Discount' | SV-8479/8480 authorized sync 2026-07-22 |
| FD-WO-021 | C30620 | https://shopview.testrail.io/index.php?/cases/view/30620 | Work Order — Sidebar 'Work Order Fee / Discount' card | Verify the Work Order Fees & Discounts card shows the disclaimer 'Applies to the whole work order, after all other fees & discounts.' | SV-8479/8480 authorized sync 2026-07-22 |
| FD-WO-025 | C30621 | https://shopview.testrail.io/index.php?/cases/view/30621 | Work Order — Whole-WO Fee/Discount | Verify the work order toolbar three-dot menu item reads 'Add Work Order Fee / Discount' | SV-8479/8480 authorized sync 2026-07-22 |
| FD-WO-028 | C30622 | https://shopview.testrail.io/index.php?/cases/view/30622 | Work Order — Whole-WO Fee/Discount | Verify the tax-jurisdiction note and the 'Pass convenience fee to customer' banner still appear after the fee/discount UI updates | SV-8479/8480 authorized sync 2026-07-22 |
| FD-PSALE-002 | C30623 | https://shopview.testrail.io/index.php?/cases/view/30623 | Parts page — 'FEES & DISCOUNTS' column | Verify the parts-sale Fees & Discounts column no longer shows the '+ Add' button, and the per-row and top-right three-dot entry points remain | SV-8479/8480 authorized sync 2026-07-22 |
| FD-PSALE-003 | C30624 | https://shopview.testrail.io/index.php?/cases/view/30624 | Parts page — 'FEES & DISCOUNTS' column | Verify the parts-sale per-part three-dot menu item reads 'Add Part Fee / Discount' | SV-8479/8480 authorized sync 2026-07-22 |
| FD-PSALE-004 | C30625 | https://shopview.testrail.io/index.php?/cases/view/30625 | Parts Sale — Fees & Discounts card | Verify the Parts Sale Fees & Discounts card shows each adjustment as plain text with the percentage in brackets (no colored badge) | SV-8479/8480 authorized sync 2026-07-22 |
| FD-PSALE-006 | C30626 | https://shopview.testrail.io/index.php?/cases/view/30626 | Parts Sale — Financial Info card | Verify the parts-sale Financial Info card shows a 'Fees & Discounts (N)' line directly above Subtotal and hides it when there are none | SV-8479/8480 authorized sync 2026-07-22 |
| FD-PSALE-008 | C30627 | https://shopview.testrail.io/index.php?/cases/view/30627 | Part Sale — Fee/Discount dialog | Verify the whole-parts-sale fee/discount dialog title reads 'New Parts Sale Fee / Discount' with subline 'Applying To: Entire Parts Sale' | SV-8479/8480 authorized sync 2026-07-22 |
| FD-PSALE-009 | C30628 | https://shopview.testrail.io/index.php?/cases/view/30628 | Parts Sale — Statistics tab | Verify the Fees & Discounts section on the parts-sale Statistics tab shows the '%' and 'Amount' column headings | SV-8479/8480 authorized sync 2026-07-22 |
| FD-CALC-018 | C30629 | https://shopview.testrail.io/index.php?/cases/view/30629 | Calculation contract | Verify a work order line total adds the line's own fees to Labor and Parts (Labor $250 + fee +$50.00 + Part $20.00 + fee +$2.20 → line total $322.20) | SV-8479/8480 authorized sync 2026-07-22 |
| FD-CALC-019 | C30630 | https://shopview.testrail.io/index.php?/cases/view/30630 | Calculation contract | Verify a discount on a line subtracts from the line total while a fee adds (fees add, discounts subtract in the line total) | SV-8479/8480 authorized sync 2026-07-22 |
| FD-CALC-020 | C30631 | https://shopview.testrail.io/index.php?/cases/view/30631 | Calculation contract | Verify a line with no fees or discounts shows a line total of Labor + Parts only (unchanged by the fix) | SV-8479/8480 authorized sync 2026-07-22 |
| FD-CALC-021 | C30632 | https://shopview.testrail.io/index.php?/cases/view/30632 | Calculation contract | Verify the Estimate document is unchanged — labor prints gross, each fee prints its own row, and the grand total is not double-counted | SV-8479/8480 authorized sync 2026-07-22 |
| FD-CALC-022 | C30633 | https://shopview.testrail.io/index.php?/cases/view/30633 | Calculation contract | Verify the Invoice document is unchanged — labor prints gross, each fee prints its own row, and the grand total is not double-counted | SV-8479/8480 authorized sync 2026-07-22 |
| FD-CALC-023 | C30634 | https://shopview.testrail.io/index.php?/cases/view/30634 | Calculation contract | Verify that when the Fees & Discounts feature is turned off, the line total is Labor + Parts only (gross), with no fee/discount rolled in | SV-8479/8480 authorized sync 2026-07-22 |
| FD-CALC-024 | C30635 | https://shopview.testrail.io/index.php?/cases/view/30635 | API — Calculation contract | Verify the backend per-line total includes the line's signed fee/discount amounts (Labor $250 + $50.00 + Part $20.00 + $2.20 → total_cost 322.20) | SV-8479/8480 authorized sync 2026-07-22 |
| FD-PSALE-INV-01 | C30639 | https://shopview.testrail.io/index.php?/cases/view/30639 | Customer document — per-line adjustments | Verify a part-line fee/discount shows as a row under its part on the Finance (Estimate/Invoice) view — on both a work order and a parts sale | spec-recheck / VIU change-list 2026-07-23 |
| FD-PART-DISP-01 | C30640 | https://shopview.testrail.io/index.php?/cases/view/30640 | Work Order / Parts — Part-line Fee/Discount | Verify a part-line fee stays shown on the part row after the part is received or picked | spec-recheck / VIU change-list 2026-07-23 |

### Run 278 - Custom Permissions

Missing **9** active Custom Roles cases (run has 746 of 755).
Recorded results in this run: 3,537 result records, **3,521 graded** (2,921 Passed / 527 Failed / 73 Blocked) - **HIGHEST CARE**.

| Internal ID | TestRail ID | Link | Section | Title | Added by which pass |
|---|---|---|---|---|---|
| (not in id-map) | C29469 | https://shopview.testrail.io/index.php?/cases/view/29469 | Digital Inspections – Per-Role Access Checks | Custom role (WO Lines C&E on, Delete off): delete/reopen inspections on a Completed line respects the atom, not line status | other sessions (DVI / SFD / parts / AP-AR passes) |
| (not in id-map) | C29911 | https://shopview.testrail.io/index.php?/cases/view/29911 | See Financial Data | See Financial Data OFF: the WO Fees & Discounts card is hidden entirely | other sessions (DVI / SFD / parts / AP-AR passes) |
| (not in id-map) | C29915 | https://shopview.testrail.io/index.php?/cases/view/29915 | Parts Department Permissions | Catalog part detail deep-link is bounced for a role without Catalog & Inventory View | other sessions (DVI / SFD / parts / AP-AR passes) |
| (not in id-map) | C30642 | https://shopview.testrail.io/index.php?/cases/view/30642 | Work Order Lines Permissions | Part row click does not open part dialog without Work Order Lines Create and Edit | other sessions (DVI / SFD / parts / AP-AR passes) |
| (not in id-map) | C30643 | https://shopview.testrail.io/index.php?/cases/view/30643 | Manage Accounts Payable and Receivable | AP/AR-OFF vendor manager can create a vendor and view the Taxes row | other sessions (DVI / SFD / parts / AP-AR passes) |
| (not in id-map) | C38842 | https://shopview.testrail.io/index.php?/cases/view/38842 | Page Access Toggles | Billing Portal feature flag OFF hides the Billing menu item despite page-access permission | other session (page-access toggles) |
| (not in id-map) | C38843 | https://shopview.testrail.io/index.php?/cases/view/38843 | Parts Department Permissions | Vendors page opens without the Reports permission | post-v0.68/v0.69 release regression 2026-07-27 (CR-REG-01..03) |
| (not in id-map) | C38844 | https://shopview.testrail.io/index.php?/cases/view/38844 | Customer Management Permissions | Customer detail page loads for AP/AR role (Fees & Discounts on) | post-v0.68/v0.69 release regression 2026-07-27 (CR-REG-01..03) |
| (not in id-map) | C38845 | https://shopview.testrail.io/index.php?/cases/view/38845 | Work Order Lines Permissions | Return part & resolve cores allowed with Work Orders: View | post-v0.68/v0.69 release regression 2026-07-27 (CR-REG-01..03) |

## 4. Why this matters (the trigger)

On 2026-07-31 a junior QA reviewing **Filters run 352** reported "no case exists" for
requirements we had already authored and pushed to TestRail. All 15 Filters cases added by
the 2026-07-30 tech-plan push (including the whole 7-case page-search set FLT-PSRCH-01..07)
are in TestRail but **not in his run** - so the review reported a coverage gap that does not
exist. Out-of-sync runs cause false coverage gaps and wasted review cycles.

## 5. The dangerous part of the fix (read before executing)

`update_run` **REPLACES** the run's case selection with whatever `case_ids` list you send.
Sending a partial list **DELETES the omitted tests and their recorded results**. So the fix
is always: read the run's CURRENT case ids -> **UNION** with the new ids -> send the FULL union.
Never send just the new ids. Always snapshot the run's tests + results first.

## 6. Ready-to-execute plan (AWAITING USER AUTHORIZATION - nothing executed)

For each run below, in this exact order:

1. **Snapshot** - `get_run/{id}` + `get_tests/{id}` + `get_results_for_run/{id}` saved to
   `build/testrail-run-sync-2026-07-31/pre-write-snapshot/run-{id}.json` (before any write).
2. **Union** - `case_ids = sorted(set(current_case_ids) | set(missing_case_ids))`.
3. **Write** - `update_run/{id}` with `{"case_ids": <FULL union>}` (nothing else in the body).
4. **Verify** - re-`get_run/{id}`: test count == expected "after"; re-`get_results_for_run`:
   every previously recorded result still present with the same status.
5. **Log** - per-run row in `testrail-execution-log-2026-07-31.md` (before -> after counts,
   HTTP status, results-preserved check).

| Order | Run | Operation | Cases to add | Before | After (expected) | Result records at risk | Care level |
|---|---|---|---|---|---|---|---|
| 1 | 352 (Filters) | union `update_run` | 15 | 79 | 94 | 395 (0 graded) | standard - union still mandatory |
| 2 | 357 (Schedule) | union `update_run` | 22 | 143 | 165 | 429 (0 graded) | standard - union still mandatory |
| 3 | 359 (Report Suite) | union `update_run` | 7 | 458 | 465 | 539 (0 graded) | standard - union still mandatory |
| 4 | 324 (Fees & Discounts) | union `update_run` | 25 | 178 | 203 | 363 (**185 graded**) | **HIGH - union must be exact** |
| 5 | 325 (Simple Flow) | union `update_run` | 35 | 152 | 187 | 342 (**147 graded**) | **HIGH - union must be exact** |
| 6 | 278 (Custom Roles) | union `update_run` | 9 | 746 | 755 | 3,537 (**3,521 graded**) | **HIGHEST - union must be exact** |

**Total adds across the 6 runs: 113 tests.** No deletes, no result writes, no case writes.

Run 347 (Global Search - Mudassir) needs nothing.

### Recommended long-term fix (needs a user decision)

- For the VIU/manual project runs, either (a) keep them fixed-selection and run this sync
  check after EVERY authorized `add_case` pass (new Standing Rule 34), or (b) ask the user
  whether future per-project runs should be created with a **section/group filter that
  include_all-style auto-updates**, so this can never drift again.
- Cheapest durable habit: the run-sync check becomes the last step of every push manifest.

### Decisions the user needs to make before we execute

| Run | Question | Why it matters |
|---|---|---|
| 324 (Fees & Discounts) | **Sync or leave alone?** | Fees & Discounts is a **COMPLETED** project and this run reads 178/178 done (174 Passed / 4 Failed). Adding 25 cases turns a finished run into 178/203 - i.e. it will look unfinished again. Alternative: leave 324 as the historical record and create a NEW small run for the 25 unrun cases (needs authorization either way). |
| 325 (Simple Flow) | **Sync or leave alone?** | Same situation - Simple Flow is **COMPLETED**; 147 graded results already recorded. Adding 35 cases (incl. the 3 sell-price correctives C38860/61/62) leaves 35 Untested tests in a closed-out effort. |
| 278 (Custom Roles) | **Sync or leave alone?** | Only 9 missing, but this run holds 3,521 graded results - the largest history in the project. Lowest benefit, highest blast radius. |
| 352 / 357 / 359 | **Sync - recommended yes** | Filters / Schedule / Report Suite are the 3 **ACTIVE** projects, all VIU-pending, 0 graded results. These are the runs the testers are about to work in, and the ones causing the false "no case exists" reports. Safe and high value. |

**Our recommendation:** sync **352, 357, 359 first** (active projects, zero graded results, this is
where the reported problem actually happened). Ask the user explicitly about 324 / 325 / 278
before touching them, because a "completed" run becoming incomplete is a reporting decision,
not a QA-correctness one.

## 7. Side observations (not part of the ask, no action taken)

1. **Run 312 no longer exists.** CLAUDE.md ("Custom Roles ... execution run = 312",
   "run 312 untouched") references a run that returns HTTP 400 on `get_run/312` - it has been
   deleted in TestRail. The live Custom Roles runs are 278, 303, 304, 311, 323 (+ closed 331).
   Worth correcting in project memory on the next authorized doc pass.
2. **Simple Flow id-map has 4 stale rows** - SF-SET-03 (29277), SF-SET-08 (29282),
   SF-COMP-06 (29295), SF-QB-02 (29427) point at cases that no longer exist in TestRail;
   and 2 live Simple Flow cases (C30641, C30645, added by a concurrent session) are missing
   from the id-map. Live Simple Flow group total = 187.
3. **No test plans exist** in project 1 (`get_plans/1` = 0), so no runs are hidden inside a plan.

---

**Already prepared in this folder (all read-only so far):**
- `run_sync_audit.py` - the reusable read-only audit (re-run any time; independently reproduced these numbers).
- `sync_runs_EXECUTOR.py` - the snapshot -> union -> write -> verify -> log executor. **Run with `--dry-run` (done) or `--authorized` (NOT done).**
- `pre-write-snapshot/run-<id>.json` - **live pre-write snapshots of all 6 runs already captured** (every test + every result record), so any future write is fully reversible/auditable.
- `testrail-execution-log-2026-07-31.md` - currently contains only the **DRY-RUN** row set (proof no write happened).
- `snapshot-2026-07-31/` - live run/case/section snapshots the audit was computed from.

*Audit produced read-only on 2026-07-31. Data snapshots: `runs.json`, `cases.json`,
`sections.json`, `audit.json` regenerated by `run_sync_audit.py` in this folder.*
