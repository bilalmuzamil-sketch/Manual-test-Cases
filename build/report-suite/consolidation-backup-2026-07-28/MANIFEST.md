# Consolidation backup MANIFEST (2026-07-28)

**What this folder is:** the verbatim PRE-EDIT body of every case touched by the 2026-07-28 user-authorized sense-check repairs + merge/cut consolidation (one file per case, `<internalID>_pre-edit.json`). If any merge has to be undone, restore the backed-up bodies into the owning `cases/*.json` file, clear the members' Retired status, regenerate the deliverables, and (if the TestRail deletes were already executed) re-create the members from these bodies via `add_case`.

**Applier:** `../reconciliation-2026-07-28/apply_repairs_consolidation_2026-07-28.py`. 106 pre-edit bodies backed up. Priorities/types of survivors deliberately unchanged (the merge plan does not prescribe priority changes).

**HELD groups: NONE** — all 41 merge groups were executable without ambiguity; no survivor body exceeded sensible length.

## Merge groups (41 groups, 50 members -> survivors)

| Group | Survivor (C-id kept) | Members retired+deleted | What the survivor gained |
|---|---|---|---|
| G-SBC-NAV | SBC-NAV-01 (C30096) | SBC-NAV-02 (C30097) | page title + browser-tab title folded into the nav/open case |
| G-SBC-DEFAULTS | SBC-PERS-05 (C30178) | SBC-DATE-02 (C30103), SBC-LOC-02 (C30110) | date default (no saved view, no range in link) + location default (active location, not all) folded into the one first-load defaults case |
| G-SBC-TYPE | SBC-TYPE-02 (C30107) | SBC-TYPE-01 (C30106), SBC-TYPE-03 (C30108) | options list + default (TYPE-01) and the no-filter third state (TYPE-03) folded into one Product Type case |
| G-SBC-ALLCUST | SBC-CUST-04 (C30115) | SBC-CUST-08 (C30119) | filter-change step proving new customers stay auto-included |
| G-SBC-CLEARALL | SBC-CUST-03 (C30114) | SBC-CUST-07 (C30118) | Clear-all outcome: empty state + zero totals + label None |
| G-SBC-EXPAND | SBC-TREE-03 (C30123) | SBC-TREE-07 (C30127) | second-click collapse + customer/asset expansion independence |
| G-SBC-LBL | SBC-LBL-01 (C30134) | SBC-LBL-02 (C30135), SBC-LBL-03 (C30136) | VIN-only (no y/m/m) and Unknown Asset fallback branches as seed-table rows (serial-number survivor body kept) |
| G-SBC-SORTSCOPE | SBC-SORT-01 (C30142) | SBC-SORT-05 (C30146) | sort reorders only customer summary rows invariant |
| G-SBC-SORTRELOAD | SBC-TREE-09 (C30129) | SBC-SORT-06 (C30147) | loading-state + page-membership lines (sort was already a listed reload trigger) |
| G-SBC-COLBOUNDS | SBC-COL-02 (C30157) | SBC-COL-03 (C30158) | hide-all-nine edge (Customer/Subtotal/totals still render) |
| G-SBC-EXPNAME | SBC-EXP-02 (C30160) | SBC-EXP-07 (C30165) | one range-to-filename map case asserting both .csv and .pdf |
| G-SBC-EXPTOAST | SBC-EXP-06 (C30164) | SBC-EXP-12 (C30170) | one export in-flight/failure case with a CSV leg and a PDF leg |
| G-SBC-EMPTYSEL | SBC-EMPTY-01 (C30181) | SBC-EMPTY-03 (C30183) | narrowed selection KEPT + customers reappear scenario |
| G-SBR-NAV | SBR-NAV-01 (C30195) | SBR-NAV-02 (C30196) | page/tab-title lines folded into the Performance-group nav case (+ FIX-WORDING repair applied) |
| G-SBR-DEFAULTS | SBR-PERS-04 (C30274) | SBR-DATE-03 (C30203), SBR-LOC-02 (C30214) | date-default and location-default restatements folded (reload/loading half already covered by SBR-STATE-03) |
| G-SBR-TYPE | SBR-TYPE-02 (C30206) | SBR-TYPE-01 (C30205) | options + default become expected lines of the per-option behavior case |
| G-SBR-GATE | SBR-STAT-04 (C30211) | SBR-TYPE-03 (C30207), SBR-STAT-03 (C30210) | ONE contributor-gate/composition case with product-type and status legs |
| G-SBR-ROWLAYOUT | SBR-ROW-02 (C30218) | SBR-ROW-04 (C30220) | column-alignment hard-invariant restatement absorbed |
| G-SBR-BADGE | SBR-BADGE-01 (C30226) | SBR-BADGE-03 (C30228) | vertically centered + blank on summary + accessible-label lines |
| G-SBR-CALCZERO | SBR-CALC-02 (C30230) | SBR-CALC-04 (C30232) | rounds-to-zero and explicit-minus edges |
| G-SBR-STICKY | SBR-TOT-01 (C30237) | SBR-TOT-04 (C30240) | sticky header-row / both-axes assertions |
| G-SBR-LINKS | SBR-LINK-01 (C30247) | SBR-LINK-02 (C30248) | one drilldown case: invoice number -> WO/parts sale; customer name -> customer record |
| G-SBR-NODIALOG | SBR-DEACT-07 (C30258) | SBR-DEACT-01 (C30252) | no-assignments silent path added to the no-dialog paths |
| G-SBR-UNASROW | SBR-UNAS-02 (C30262) | SBR-UNAS-03 (C30263) | behaves-like-a-rep-row lines (count, expandable, in Totals, never (Inactive)) |
| G-SBR-COLSEL | SBR-COL-01 (C30265) | SBR-COL-02 (C30266), SBR-COL-06 (C30270) | 5 always-on not offered + all-hidden-still-renders edge |
| G-SBR-EMPTYBAR | SBR-STATE-01 (C30298) | SBR-STATE-02 (C30299) | toolbar-stays-interactive + widening recovers |
| G-PV-TYPE | PV-FILT-01 (C30328) | PV-FILT-02 (C30329) | per-option reload effect (P31 special-order wording kept) |
| G-PV-EXPTOAST | PV-EXP-10 (C30384) | PV-EXP-09 (C30383) | success toasts (uppercase) + failure toasts (lowercase) in one notification case |
| G-TU-COLS | TU-HRS-02 (C30401) | TU-HRS-01 (C30400) | fixed header order as expected line 1 |
| G-TU-EMPTY | TU-NAV-08 (C30399) | TU-TECH-05 (C30427) | clear-all-technicians trigger as a step of the no-data case |
| G-WIP-NAV | WIP-TAB-01 (C30451) | WIP-TAB-04 (C30454) | browser-title line folded into the nav/open case |
| G-WIP-EMPTY | WIP-SCOPE-05 (C30460) | WIP-SCOPE-06 (C30461) | all-tabs-empty and single-tab-empty as two scenarios |
| G-WIP-PLACE-STATUS | WIP-PLACE-01 (C30462) | WIP-PLACE-02 (C30463) | one status-to-tab mapping case (Estimate/Complete/In Progress/Review) |
| G-WIP-PLACE-START | WIP-PLACE-03 (C30464) | WIP-PLACE-04 (C30465) | one started-boundary case (time or part vs neither) |
| G-WIP-RECOMPUTE | WIP-FLT-08 (C30505) | WIP-SUM-06 (C30492), WIP-TOT-03 (C30496) | strip + Totals recompute lines folded into the AND-composition case |
| G-IV-RELOAD | IV-FLT-02 (C30570) | IV-NAV-04 (C30537) | reload-trigger list + loading-indicator lines |
| G-IV-EMPTY | IV-NAV-06 (C30539) | IV-DATE-07 (C30567), IV-LOC-05 (C30578) | one no-data case with a cause table (no parts / no recorded day / empty location) |
| G-IV-SCOPE | IV-SCOPE-01 (C30540) | IV-SCOPE-03 (C30542), IV-SCOPE-04 (C30543) | 4-part seed table: normal shown; core never; zero-qty never; negative never |
| G-IV-TOTFILTER | IV-TOT-02 (C30557) | IV-TOT-04 (C30559) | change-filter-and-recompute steps |
| G-IV-EXPTOAST | IV-EXP-09 (C30595) | IV-EXP-08 (C30594) | verbatim success + failure notification texts in one case |
| G-IV-TOTSTICKY | IV-TOT-01 (C30556) | IV-VIS-03 (C30598) | stays-visible-while-scrolling line |

## Outright cuts (6) + the Print retire (1)

| Case | C-id | Why |
|---|---|---|
| SBC-SORT-07 | C30148 | No-op assertion (sort headers with zero rows) — usefulness+sense audit CUT |
| SBR-SORT-06 | C30246 | No-op assertion (sorting a single row) — usefulness+sense audit CUT |
| SBR-EXP-09 | C30284 | px font-tier edge minutiae, not manually testable — usefulness+sense audit CUT |
| PV-COL-07 | C30357 | stale-schema browser-storage seeding not executable by a manual tester — CUT |
| WIP-TOT-04 | C30497 | duplicate of the merged WIP empty-state case — CUT |
| IV-TOT-05 | C30560 | duplicate of the merged IV no-data case — CUT |
| SBC-EXP-13 | C30171 | Print removed from Sales By Customer (video P25, user ruling) — retire |

## FIX-WORDING repairs (9, per SENSE-CHECK-2026-07-28.md)

| Case | C-id | Repair |
|---|---|---|
| SBR-NAV-01 | C30195 | additive-placement comparison re-pointed at production/prior release (pre-add order unobservable) — also the G-SBR-NAV merge survivor |
| SBR-CALC-08 | C30236 | untypeable $10.005 seeding hint replaced with derive-sub-cent-from-math seeding |
| SBR-EXP-08 | C30283 | relative step-downs + no-overflow promoted to the pass criterion; px tiers demoted to metadata |
| SBC-PERM-04 | C30101 | concrete probe routes named (edited page link; stale saved view) |
| SBC-EXP-08 | C30166 | 25px margin scoped to inspector-only; observable pass criterion = A4 landscape + uniform margins + footer |
| TU-SUM-02 | C30415 | 'by a cent' corrected to 0.01 (values are hours) |
| TU-LINK-03 | C30430 | 'to the cent' corrected to 'to two decimals' (values are hours) |
| PV-EXP-08 | C30382 | alignment assertions scoped to the PDF (a CSV carries no alignment) |
| IV-PERS-04 | C30582 | Expected scoped to the stale-category/vendor path the steps drive |
