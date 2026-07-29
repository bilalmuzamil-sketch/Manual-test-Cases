# Report Suite — Consolidation (Merge/Cut) Plan — 2026-07-28

**Companion to:** `USEFULNESS-AUDIT-2026-07-28.md` + `per-case-verdicts.csv` (same folder).
**Source snapshot:** `build/report-suite/cases/*.json` at git SHA `ddf8c16b1c271b12459838f6c9e51a34078087bf` (working tree clean for this folder at snapshot time).
**Status: PROPOSAL ONLY — nothing has been edited.** No case JSON was touched, no TestRail writes were made (Standing Rule 6). The user can approve the whole plan, per-group, or reject it.

> **EXECUTED 2026-07-28 (user authorization "Push ALL"):** all 41 merge groups + all 6 cuts were applied locally AND pushed to TestRail (survivor update_case ×41 within the 70-update bundle; member/cut delete_case, all verified) — 0 groups HELD. See `../reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md` + `../consolidation-backup-2026-07-28/MANIFEST.md`. WEAK-KEEPs kept as planned.

## What this plan does

- **41 merge groups** absorb **50 member cases** into their named survivors (the survivor gains the members' steps/expected lines as a step table — no coverage is lost).
- **6 outright cuts** (no-op assertions, manual-untestable minutiae, literal duplicates).
- Result: **515 → 459 cases** with identical behavioral coverage.
- A further **50 WEAK-KEEP** cases are flagged (legitimate but low-value / verify-once); dropping them too would give **409**. The recommendation is to KEEP them but tag them "build-acceptance / verify once" rather than per-cycle regression.

Execution note (if approved): this is a TestRail `update_case` (survivor gains steps) + `delete_case` (members/cuts) pass — it requires fresh explicit authorization per Standing Rule 6, a per-case audit log, and regeneration of the import + id-map afterwards. Also reconcile with the pending video-delta rework (serial-number identifier, SBC Print removal, SBC compressed export, location-filter gating) so cases are not edited twice.

## Merge groups

### G-SBC-NAV
- **Survivor:** SBC-NAV-01 (C30096, https://shopview.testrail.io/index.php?/cases/view/30096) — "Sales By Customer appears in the Reports navigation and opens the report"
- **Absorbs:**
  - SBC-NAV-02 (C30097, https://shopview.testrail.io/index.php?/cases/view/30097) — "Page title and browser tab title read Sales By Customer" — Two title assertions; not a separate flow — fold into the nav/open case.
- **What the survivor gains:** page title + browser-tab title become 2 expected lines of the nav/open case

### G-SBC-DEFAULTS
- **Survivor:** SBC-PERS-05 (C30178, https://shopview.testrail.io/index.php?/cases/view/30178) — "With no saved view every setting uses its own default"
- **Absorbs:**
  - SBC-DATE-02 (C30103, https://shopview.testrail.io/index.php?/cases/view/30103) — "Date range defaults to This Month when nothing is saved and no range is in the page link" — Default restated: SBC-PERS-05 already asserts "Date range = This Month".
  - SBC-LOC-02 (C30110, https://shopview.testrail.io/index.php?/cases/view/30110) — "Location filter defaults to the user's active location on first load" — Default restated: SBC-PERS-05 already asserts "Location = your active location".
- **What the survivor gains:** first-load defaults are already enumerated once in PERS-05; the per-filter default cases restate two of its lines

### G-SBC-TYPE
- **Survivor:** SBC-TYPE-02 (C30107, https://shopview.testrail.io/index.php?/cases/view/30107) — "Service only shows only invoices starting with S; Parts only shows only invoices starting with P"
- **Absorbs:**
  - SBC-TYPE-01 (C30106, https://shopview.testrail.io/index.php?/cases/view/30106) — "Product Type dropdown offers exactly three options with Parts & Service as the default" — Options+default of the same 3-option dropdown TYPE-02 exercises; one control, one case.
  - SBC-TYPE-03 (C30108, https://shopview.testrail.io/index.php?/cases/view/30108) — "Parts & Service applies no product-type filter" — The trivial third state (no filter) of the same dropdown; one extra step, not a case.
- **What the survivor gains:** one Product Type case: options list + default (from TYPE-01), S-only/P-only effect (TYPE-02 core), and the no-filter third state (TYPE-03) as a final step

### G-SBC-ALLCUST
- **Survivor:** SBC-CUST-04 (C30115, https://shopview.testrail.io/index.php?/cases/view/30115) — "First load starts in the all-customers state and the report shows every customer"
- **Absorbs:**
  - SBC-CUST-08 (C30119, https://shopview.testrail.io/index.php?/cases/view/30119) — "In the all-customers state a filter change keeps every customer included, including newly-appearing ones" — Same all-customers explicit-state contract as CUST-04 with one extra trigger.
- **What the survivor gains:** the all-customers explicit-state case gains the filter-change step proving new customers stay auto-included

### G-SBC-CLEARALL
- **Survivor:** SBC-CUST-03 (C30114, https://shopview.testrail.io/index.php?/cases/view/30114) — "Pinned control toggles between All customers and Clear all with the matching action"
- **Absorbs:**
  - SBC-CUST-07 (C30118, https://shopview.testrail.io/index.php?/cases/view/30118) — "Clearing every customer shows the empty state with a zero totals row" — The outcome of the Clear-all action CUST-03 performs; one extra expected block.
- **What the survivor gains:** the pinned All/Clear control case gains the outcome of Clear all: empty state + zero totals + label "None"

### G-SBC-EXPAND
- **Survivor:** SBC-TREE-03 (C30123, https://shopview.testrail.io/index.php?/cases/view/30123) — "Expanding a customer reveals its asset rows with vehicle icon, label, count, rolled-up columns and indentation"
- **Absorbs:**
  - SBC-TREE-07 (C30127, https://shopview.testrail.io/index.php?/cases/view/30127) — "Chevrons toggle closed on a second click and every customer's and asset's expansion is independent" — Chevron toggle/independence is UI mechanics of the expand flow TREE-03 drives.
- **What the survivor gains:** expand case gains 2 steps: second click collapses; customer/asset expansion independence

### G-SBC-LBL
- **Survivor:** SBC-LBL-01 (C30134, https://shopview.testrail.io/index.php?/cases/view/30134) — "Asset label = year make model plus the most specific identifier: Unit, then plate, then last 8 of VIN"
- **Absorbs:**
  - SBC-LBL-02 (C30135, https://shopview.testrail.io/index.php?/cases/view/30135) — "An asset with no year, make or model is labeled with the VIN on its own" — One branch of the single label fallback chain; a row in LBL-01's input table.
  - SBC-LBL-03 (C30136, https://shopview.testrail.io/index.php?/cases/view/30136) — "An asset with no year, make, model or VIN is labeled Unknown Asset" — One branch (final fallback "Unknown Asset") of the same chain; a table row.
- **What the survivor gains:** one asset-label case with an input table covering the whole fallback chain: Unit > plate > VIN-8 > whole VIN > VIN-only > "Unknown Asset"

### G-SBC-SORTSCOPE
- **Survivor:** SBC-SORT-01 (C30142, https://shopview.testrail.io/index.php?/cases/view/30142) — "Every column is sortable except the chevron column; text sorts alphabetically and numbers by value"
- **Absorbs:**
  - SBC-SORT-05 (C30146, https://shopview.testrail.io/index.php?/cases/view/30146) — "Sorting reorders only the customer summary rows; asset and invoice ordering is untouched" — A scope invariant of sorting, not a separate flow; one expected line in SORT-01.
- **What the survivor gains:** sortability case gains the invariant that only customer summary rows reorder

### G-SBC-SORTRELOAD
- **Survivor:** SBC-TREE-09 (C30129, https://shopview.testrail.io/index.php?/cases/view/30129) — "Any change that reloads customer rows collapses all expansion, but typing in the Customer filter does not"
- **Absorbs:**
  - SBC-SORT-06 (C30147, https://shopview.testrail.io/index.php?/cases/view/30147) — "Changing the sort shows the loading state, collapses expanded rows, and can change which customers are on the page" — Reload-collapse on sort duplicates TREE-09 (sort is one of its listed triggers).
- **What the survivor gains:** the reload-collapses-expansion case already covers sort as a trigger; loading-state + page-membership lines fold in

### G-SBC-COLBOUNDS
- **Survivor:** SBC-COL-02 (C30157, https://shopview.testrail.io/index.php?/cases/view/30157) — "A toggle hides the column's header and cells together; Customer, Subtotal and the chevron column are never in the list"
- **Absorbs:**
  - SBC-COL-03 (C30158, https://shopview.testrail.io/index.php?/cases/view/30158) — "Hiding all nine toggleable columns is allowed and the table still shows Customer, Subtotal and the totals Subtotal" — Hide-all edge of the same toggle behavior COL-02 tests.
- **What the survivor gains:** hide/show case gains the hide-all-nine edge (Customer/Subtotal/totals still render)

### G-SBC-EXPNAME
- **Survivor:** SBC-EXP-02 (C30160, https://shopview.testrail.io/index.php?/cases/view/30160) — "CSV download is a plain .csv file named by the active date range per the filename map"
- **Absorbs:**
  - SBC-EXP-07 (C30165, https://shopview.testrail.io/index.php?/cases/view/30165) — "PDF download uses the same range-based filename map with a .pdf extension" — Identical filename map as EXP-02 with a different extension; one case, two file types.
- **What the survivor gains:** one range-to-filename map case asserting both .csv and .pdf extensions

### G-SBC-EXPTOAST
- **Survivor:** SBC-EXP-06 (C30164, https://shopview.testrail.io/index.php?/cases/view/30164) — "CSV action shows a loading state while exporting and a CSV export failed toast on failure"
- **Absorbs:**
  - SBC-EXP-12 (C30170, https://shopview.testrail.io/index.php?/cases/view/30170) — "PDF action shows a loading state while exporting and a PDF export failed toast on failure" — Same loading/failure pattern as EXP-06 with PDF wording; a two-row step table.
- **What the survivor gains:** one export in-flight/failure case with a CSV row and a PDF row (identical behavior, different toast text)

### G-SBC-EMPTYSEL
- **Survivor:** SBC-EMPTY-01 (C30181, https://shopview.testrail.io/index.php?/cases/view/30181) — "No matching data shows the empty-state message in the table body while the toolbar stays interactive"
- **Absorbs:**
  - SBC-EMPTY-03 (C30183, https://shopview.testrail.io/index.php?/cases/view/30183) — "A narrowed customer selection with no data shows the empty state but the selection is kept and the customers reappear" — Empty-state variant (selection kept); an extra scenario in EMPTY-01.
- **What the survivor gains:** empty-state case gains: a narrowed customer selection is KEPT and customers reappear when filters widen

### G-SBR-NAV
- **Survivor:** SBR-NAV-01 (C30195, https://shopview.testrail.io/index.php?/cases/view/30195) — "Sales By Representative appears at the bottom of the Performance group and opens the report"
- **Absorbs:**
  - SBR-NAV-02 (C30196, https://shopview.testrail.io/index.php?/cases/view/30196) — "Page title and browser tab title read Sales By Representative" — Title assertions fold into the nav case (same pattern as SBC).
- **What the survivor gains:** page/tab-title lines fold into the Performance-group nav case

### G-SBR-DEFAULTS
- **Survivor:** SBR-PERS-04 (C30274, https://shopview.testrail.io/index.php?/cases/view/30274) — "First visit or cleared browser storage yields the full set of defaults with no server-side profile"
- **Absorbs:**
  - SBR-DATE-03 (C30203, https://shopview.testrail.io/index.php?/cases/view/30203) — "Date range defaults to This Month and changing it re-fetches the report with a loading indicator" — Default -> PERS-04; reload/loading half already covered by STATE-03.
  - SBR-LOC-02 (C30214, https://shopview.testrail.io/index.php?/cases/view/30214) — "Location filter defaults to the user's currently active location only" — Default restated: PERS-04 already asserts "Location = your active location".
- **What the survivor gains:** first-visit defaults live once in PERS-04; the date-default and location-default restatements fold in (the reload/loading half of DATE-03 is already STATE-03)

### G-SBR-TYPE
- **Survivor:** SBR-TYPE-02 (C30206, https://shopview.testrail.io/index.php?/cases/view/30206) — "Parts only includes only P invoices, Service only includes only S invoices, and Parts & Service applies no filter"
- **Absorbs:**
  - SBR-TYPE-01 (C30205, https://shopview.testrail.io/index.php?/cases/view/30205) — "Product Type dropdown offers exactly three options with Parts & Service as the default" — Options+default of the dropdown TYPE-02 exercises option-by-option.
- **What the survivor gains:** options+default become 2 expected lines of the per-option behavior case

### G-SBR-GATE
- **Survivor:** SBR-STAT-04 (C30211, https://shopview.testrail.io/index.php?/cases/view/30211) — "Filters compose: only invoices matching ALL active filters contribute anywhere"
- **Absorbs:**
  - SBR-TYPE-03 (C30207, https://shopview.testrail.io/index.php?/cases/view/30207) — "Product Type is part of the contributor gate: a rep with no matching invoice disappears and every metric narrows" — Same contributor-gate rule as STAT-03/STAT-04, applied to a different filter — one gate case with per-filter legs.
  - SBR-STAT-03 (C30210, https://shopview.testrail.io/index.php?/cases/view/30210) — "Invoice Status is part of the contributor gate and narrows every metric" — Same contributor-gate rule as TYPE-03/STAT-04 — the composition case (STAT-04) is the survivor.
- **What the survivor gains:** ONE contributor-gate/composition case: a rep appears iff >=1 invoice matches ALL filters, with a per-filter step table (product type / status / location legs)

### G-SBR-ROWLAYOUT
- **Survivor:** SBR-ROW-02 (C30218, https://shopview.testrail.io/index.php?/cases/view/30218) — "Row layout: 12 columns in order, chevron plus rep name in the Date cell, blank identifier cells, bold summary vs regular detail rows"
- **Absorbs:**
  - SBR-ROW-04 (C30220, https://shopview.testrail.io/index.php?/cases/view/30220) — "Column alignment is a hard invariant: every row renders exactly the report's column count with blanks in position" — Restates ROW-02's layout contract as an "invariant"; no new observable behavior.
- **What the survivor gains:** the 12-column layout case absorbs the column-alignment "hard invariant" restatement

### G-SBR-BADGE
- **Survivor:** SBR-BADGE-01 (C30226, https://shopview.testrail.io/index.php?/cases/view/30226) — "Status column sits between Customer and Inv. Hrs and every detail row shows the mapped badge text"
- **Absorbs:**
  - SBR-BADGE-03 (C30228, https://shopview.testrail.io/index.php?/cases/view/30228) — "Badges are vertically centered, blank on summary rows, and carry their text as the accessible label" — Three residual badge attributes; fold into the badge placement/mapping case.
- **What the survivor gains:** badge placement/mapping case gains: vertically centered, blank on summary rows, text as accessible label

### G-SBR-CALCZERO
- **Survivor:** SBR-CALC-02 (C30230, https://shopview.testrail.io/index.php?/cases/view/30230) — "Inv. Hrs shows +green, -red, or 0.0 default on every row type, with rollups computed from unrounded deltas"
- **Absorbs:**
  - SBR-CALC-04 (C30232, https://shopview.testrail.io/index.php?/cases/view/30232) — "Edge: a delta that rounds to zero shows 0.0 in the default color, and negatives always use an explicit minus with one decimal" — Rounds-to-zero / explicit-minus edges of the CALC-02 formatting contract (SBC combined these in one case).
- **What the survivor gains:** the +green/-red/0.0 case gains the rounds-to-zero and explicit-minus edges (mirrors how SBC-CALC-04 was already combined)

### G-SBR-STICKY
- **Survivor:** SBR-TOT-01 (C30237, https://shopview.testrail.io/index.php?/cases/view/30237) — "Subtotal is the rightmost column, pinned to the right edge, bold everywhere, on the row's own background"
- **Absorbs:**
  - SBR-TOT-04 (C30240, https://shopview.testrail.io/index.php?/cases/view/30240) — "The column-header row is sticky to the top during vertical scroll and the Subtotal header is sticky in both axes" — Sticky-header mechanics of the same pinned layout TOT-01 covers.
- **What the survivor gains:** pinned-Subtotal case gains sticky header-row / both-axes assertions

### G-SBR-LINKS
- **Survivor:** SBR-LINK-01 (C30247, https://shopview.testrail.io/index.php?/cases/view/30247) — "Invoice number on a detail row navigates the current tab to the underlying work order or parts sale"
- **Absorbs:**
  - SBR-LINK-02 (C30248, https://shopview.testrail.io/index.php?/cases/view/30248) — "Customer name on a detail row navigates the current tab to the customer's record" — Second link target of the same drilldown behavior; one case with two targets.
- **What the survivor gains:** one drilldown-targets case: invoice number -> WO/parts sale; customer name -> customer record; both same tab

### G-SBR-NODIALOG
- **Survivor:** SBR-DEACT-07 (C30258, https://shopview.testrail.io/index.php?/cases/view/30258) — "No dialog when the toggle is off, when the member is already inactive, or on reactivation — assignments resurface immediately"
- **Absorbs:**
  - SBR-DEACT-01 (C30252, https://shopview.testrail.io/index.php?/cases/view/30252) — "Deactivating a sales rep with no customer assignments applies silently with no dialog" — One of three no-dialog paths DEACT-07 already enumerates.
- **What the survivor gains:** one no-dialog case: no assignments / toggle off / already inactive / reactivation

### G-SBR-UNASROW
- **Survivor:** SBR-UNAS-02 (C30262, https://shopview.testrail.io/index.php?/cases/view/30262) — "Turning Show Unassigned on adds a single Unassigned row pinned to the top and recomputes the grand Totals"
- **Absorbs:**
  - SBR-UNAS-03 (C30263, https://shopview.testrail.io/index.php?/cases/view/30263) — "The Unassigned row behaves like a rep row — count, expandable, in the Totals — and never carries an (Inactive) tag" — "Behaves like a rep row" lines belong on the row case UNAS-02 creates.
- **What the survivor gains:** the Unassigned-row case gains behaves-like-a-rep-row lines (count, expandable, in Totals, never (Inactive))

### G-SBR-COLSEL
- **Survivor:** SBR-COL-01 (C30265, https://shopview.testrail.io/index.php?/cases/view/30265) — "Column selector opens a dropdown of the seven metric columns with toggle switches, all visible on first visit"
- **Absorbs:**
  - SBR-COL-02 (C30266, https://shopview.testrail.io/index.php?/cases/view/30266) — "The five always-visible columns do not appear in the dropdown and cannot be hidden" — Selector-contents negative (5 always-on not offered); one line in COL-01.
  - SBR-COL-06 (C30270, https://shopview.testrail.io/index.php?/cases/view/30270) — "With all seven metric columns hidden the five always-on columns and the grand Totals still render — not an empty state" — All-hidden edge of the same selector; one step in COL-01.
- **What the survivor gains:** one selector-contents-and-bounds case: 7 toggleable + 5 always-on not offered + all-hidden still renders the 5

### G-SBR-EMPTYBAR
- **Survivor:** SBR-STATE-01 (C30298, https://shopview.testrail.io/index.php?/cases/view/30298) — "The empty state shows "No sales activity matches the current filters." with no grand Totals — including when no rep was ever credited"
- **Absorbs:**
  - SBR-STATE-02 (C30299, https://shopview.testrail.io/index.php?/cases/view/30299) — "The toolbar stays visible and interactive in the empty state" — Toolbar-interactive-in-empty-state is one expected line of STATE-01.
- **What the survivor gains:** empty-state case gains: toolbar stays interactive and widening the range recovers

### G-PV-TYPE
- **Survivor:** PV-FILT-01 (C30328, https://shopview.testrail.io/index.php?/cases/view/30328) — "Type filter is single-select, first in the filter row, with options Both, Inventory, Catalogue (default Both)"
- **Absorbs:**
  - PV-FILT-02 (C30329, https://shopview.testrail.io/index.php?/cases/view/30329) — "Selecting a Type value immediately reloads the data limited to that type" — Per-option effect of the Type filter FILT-01 defines; one control, one case.
- **What the survivor gains:** Type filter options/default case gains the per-option reload effect (all rows read Inventory / Catalogue)

### G-PV-EXPTOAST
- **Survivor:** PV-EXP-10 (C30384, https://shopview.testrail.io/index.php?/cases/view/30384) — "A failed export shows the server message when available, otherwise the exact fallback error toast with lowercase (csv)/(pdf)"
- **Absorbs:**
  - PV-EXP-09 (C30383, https://shopview.testrail.io/index.php?/cases/view/30383) — "Successful downloads show the exact success toasts with uppercase (CSV)/(PDF)" — Success-toast wording; pairs with the failure case as one notification case.
- **What the survivor gains:** one export-toast case: success texts (uppercase CSV/PDF) + failure texts (lowercase) + server-message precedence

### G-TU-COLS
- **Survivor:** TU-HRS-02 (C30401, https://shopview.testrail.io/index.php?/cases/view/30401) — "Total, WO, and Internal Hours show the range's clocked hours in two decimals with no thousands separator"
- **Absorbs:**
  - TU-HRS-01 (C30400, https://shopview.testrail.io/index.php?/cases/view/30400) — "Column headers appear in the fixed order ending with Est. Lost Labor" — A header-order assertion; expected line 1 of the hours-columns case.
- **What the survivor gains:** the fixed header order becomes expected line 1 of the hours-columns case

### G-TU-EMPTY
- **Survivor:** TU-NAV-08 (C30399, https://shopview.testrail.io/index.php?/cases/view/30399) — "The standard no-data message shows when no technician clocked time in scope"
- **Absorbs:**
  - TU-TECH-05 (C30427, https://shopview.testrail.io/index.php?/cases/view/30427) — "Clearing all technicians shows the no-data message and hides the Summary row" — NAV-08 explicitly covers the cleared-filter trigger for the same message.
- **What the survivor gains:** NAV-08 already states the same no-data message serves both genuinely-no-data and cleared-filter; the clear-all trigger becomes a step

### G-WIP-NAV
- **Survivor:** WIP-TAB-01 (C30451, https://shopview.testrail.io/index.php?/cases/view/30451) — "Work In Progress appears in the reports navigation under the Performance group"
- **Absorbs:**
  - WIP-TAB-04 (C30454, https://shopview.testrail.io/index.php?/cases/view/30454) — "The browser page title reads "Work In Progress - Report | ShopView"" — Browser-title assertion; folds into the nav/open case.
- **What the survivor gains:** browser-title line folds into the nav/open case

### G-WIP-EMPTY
- **Survivor:** WIP-SCOPE-05 (C30460, https://shopview.testrail.io/index.php?/cases/view/30460) — "When no work order qualifies, every tab shows "Empty bays, endless possibilities. Get Going!" and no Totals row"
- **Absorbs:**
  - WIP-SCOPE-06 (C30461, https://shopview.testrail.io/index.php?/cases/view/30461) — "A single empty tab shows the no-data message while the other tabs still show their rows" — Single-tab-empty variant of SCOPE-05; a second scenario row.
- **What the survivor gains:** one empty-state case: all-tabs-empty and single-tab-empty as two scenario rows

### G-WIP-PLACE-STATUS
- **Survivor:** WIP-PLACE-01 (C30462, https://shopview.testrail.io/index.php?/cases/view/30462) — "An Estimate work order lands in the Estimates tab and a Complete work order lands in the Completed tab"
- **Absorbs:**
  - WIP-PLACE-02 (C30463, https://shopview.testrail.io/index.php?/cases/view/30463) — "In Progress and Review work orders land in the "Approved - partially completed" tab" — Status->tab mapping row; PLACE-01/02 are one mapping case with a table.
- **What the survivor gains:** one status-to-tab mapping case with a table: Estimate->Estimates, Complete->Completed, In Progress/Review->partially completed

### G-WIP-PLACE-START
- **Survivor:** WIP-PLACE-03 (C30464, https://shopview.testrail.io/index.php?/cases/view/30464) — "An Approved work order with clocked time or a received part lands in "Approved - partially completed""
- **Absorbs:**
  - WIP-PLACE-04 (C30465, https://shopview.testrail.io/index.php?/cases/view/30465) — "An Approved work order with no clocked time and no received part lands in "Approved - not started"" — The other side of the started-boundary rule PLACE-03 tests; one boundary case.
- **What the survivor gains:** one started-boundary case: clocked time OR received part -> partially completed; neither -> not started

### G-WIP-RECOMPUTE
- **Survivor:** WIP-FLT-08 (C30505, https://shopview.testrail.io/index.php?/cases/view/30505) — "Advisor, customer, and asset filters combine with AND, feed the strip and Totals rows, and an empty combination shows the no-data message"
- **Absorbs:**
  - WIP-SUM-06 (C30492, https://shopview.testrail.io/index.php?/cases/view/30492) — "Changing the advisor, customer, or asset filter recomputes every summary figure immediately, with no reload" — Strip recompute on filter change — already asserted by FLT-08.
  - WIP-TOT-03 (C30496, https://shopview.testrail.io/index.php?/cases/view/30496) — "The Totals row recomputes whenever the advisor, customer, or asset filter changes" — Totals-row recompute on filter change — already asserted by FLT-08.
- **What the survivor gains:** the AND-composition case already asserts strip+Totals recompute; the two per-surface recompute cases fold in as expected lines

### G-IV-RELOAD
- **Survivor:** IV-FLT-02 (C30570, https://shopview.testrail.io/index.php?/cases/view/30570) — "The Category filter, Vendor filter, and part search apply server-side — each change re-queries and returns the first page"
- **Absorbs:**
  - IV-NAV-04 (C30537, https://shopview.testrail.io/index.php?/cases/view/30537) — "Changing the date, location, Category, Vendor, part search, or sort reloads the rows from the server with the standard loading indicator" — Reload-trigger list + loading indicator; the server-side re-query case covers it.
- **What the survivor gains:** the server-side re-query case absorbs the reload-triggers list + loading indicator lines

### G-IV-EMPTY
- **Survivor:** IV-NAV-06 (C30539, https://shopview.testrail.io/index.php?/cases/view/30539) — "When no in-stock part exists for the selected location(s) on the resolved date, the no-data message shows instead of rows"
- **Absorbs:**
  - IV-DATE-07 (C30567, https://shopview.testrail.io/index.php?/cases/view/30567) — "When no recorded day exists on or before the end of the selected range, the report shows the no-data message and no totals row" — Same no-data message/no-totals with a snapshot cause; a cause-table row in NAV-06.
  - IV-LOC-05 (C30578, https://shopview.testrail.io/index.php?/cases/view/30578) — "When the selected location(s) hold no in-stock parts on the resolved date, the no-data message shows" — Same no-data message/no-totals with a location cause; a cause-table row in NAV-06.
- **What the survivor gains:** one no-data case with a cause table: no in-stock parts / no recorded day on-or-before range / empty selected locations — same message + no totals row

### G-IV-SCOPE
- **Survivor:** IV-SCOPE-01 (C30540, https://shopview.testrail.io/index.php?/cases/view/30540) — "A part appears only when it is not a core charge AND its on-hand quantity is greater than zero"
- **Absorbs:**
  - IV-SCOPE-03 (C30542, https://shopview.testrail.io/index.php?/cases/view/30542) — "A core-charge part is never shown, regardless of its quantity" — Negative half (core excluded) of the two-condition rule SCOPE-01 already asserts.
  - IV-SCOPE-04 (C30543, https://shopview.testrail.io/index.php?/cases/view/30543) — "A part with zero or negative on-hand quantity is never shown" — Negative half (qty<=0 excluded) of the same two-condition rule.
- **What the survivor gains:** one row-scope case with a 4-part seed table: normal part shown; core part never; zero-qty never; negative-qty never (SCOPE-01 already asserts both conditions)

### G-IV-TOTFILTER
- **Survivor:** IV-TOT-02 (C30557, https://shopview.testrail.io/index.php?/cases/view/30557) — "The totals row sums Qty on Hand, Margin, Total Sell, and Total Cost over the FULL filtered set on the server, not just the visible page"
- **Absorbs:**
  - IV-TOT-04 (C30559, https://shopview.testrail.io/index.php?/cases/view/30559) — "Applying the Category filter, the Vendor filter, or the part search recomputes the totals on the server to match the filtered set" — Recompute-on-filter action of the full-set totals contract TOT-02 owns.
- **What the survivor gains:** full-set server totals case gains the change-filter-and-recompute steps

### G-IV-EXPTOAST
- **Survivor:** IV-EXP-09 (C30595, https://shopview.testrail.io/index.php?/cases/view/30595) — "A failed download shows the format-specific error notification, verbatim"
- **Absorbs:**
  - IV-EXP-08 (C30594, https://shopview.testrail.io/index.php?/cases/view/30594) — "A successful download shows the format-specific success notification, verbatim" — Success-notification wording; pairs with EXP-09 as one notification case.
- **What the survivor gains:** one notification case: verbatim success (PDF/CSV) + failure texts

### G-IV-TOTSTICKY
- **Survivor:** IV-TOT-01 (C30556, https://shopview.testrail.io/index.php?/cases/view/30556) — "The totals row is labeled "Total" in the Part # cell, leaves the per-unit and identity cells blank, and pins its bold Total Cost far right"
- **Absorbs:**
  - IV-VIS-03 (C30598, https://shopview.testrail.io/index.php?/cases/view/30598) — "The totals row stays visible at the bottom while the user scrolls the rows" — Totals-row visible-on-scroll duplicates the pinned-layout assertions in TOT-01.
- **What the survivor gains:** totals-row layout case gains the stays-visible-while-scrolling line

## Cuts

- **SBC-SORT-07 (C30148, https://shopview.testrail.io/index.php?/cases/view/30148)** — "With no customer rows the sort headers are still present and produce no visible change" — No-op assertion (sort headers with zero rows produce no change). A failure here would never be a reportable bug; tests framework idle behavior, not the feature.
- **SBR-SORT-06 (C30246, https://shopview.testrail.io/index.php?/cases/view/30246)** — "With only one rep row the sort affordances are present but produce no observable change" — No-op assertion (sorting a single row changes nothing). Not a reportable failure; framework behavior.
- **SBR-EXP-09 (C30284, https://shopview.testrail.io/index.php?/cases/view/30284)** — "Font tier edge rules: a longer negative shifts one tier smaller (clamped at 8px); a document with no positive dollar value stays at 11px" — PDF font-tier EDGE rules (negative-string shifts one px tier, no-positive stays 11px). Pure spec minutiae a manual tester cannot verify (measuring px font sizes in a PDF); belongs in a dev unit test, not a manual case. (Base-tier case EXP-08 kept as WEAK.)
- **PV-COL-07 (C30357, https://shopview.testrail.io/index.php?/cases/view/30357)** — "A saved view with a stale schema version is ignored and the current defaults load" — Requires manufacturing a "stale schema version" in browser storage — not executable by a manual tester; implementation detail for a dev test. Defensive-restore behavior is already covered by PV-COL-05.
- **WIP-TOT-04 (C30497, https://shopview.testrail.io/index.php?/cases/view/30497)** — "A tab with no visible jobs shows no Totals row" — Duplicate: "empty tab shows no Totals row" is already an expected line of WIP-SCOPE-05 and WIP-SCOPE-06.
- **IV-TOT-05 (C30560, https://shopview.testrail.io/index.php?/cases/view/30560)** — "When no parts qualify, no totals row is shown" — Duplicate: "no totals row when empty" is already expected line 2 of IV-NAV-06 (and its merged variants).

## WEAK-KEEP flags (keep, but verify-once / trim if suite size matters)

- SBC-CUST-01 (C30112, https://shopview.testrail.io/index.php?/cases/view/30112) — Placement/search-icon/hint cosmetics of the Customer control; legitimate spec line, low failure value.
- SBC-TREE-10 (C30130, https://shopview.testrail.io/index.php?/cases/view/30130) — Low-yield edge (single-invoice asset expands; only-parts-sales customer); keep only if suite size is no concern.
- SBC-TREE-13 (C30133, https://shopview.testrail.io/index.php?/cases/view/30133) — Structural/font-weight invariant restating the layout; cosmetic-leaning.
- SBC-LINK-03 (C30140, https://shopview.testrail.io/index.php?/cases/view/30140) — Link color / no-visited-purple cosmetics.
- SBC-EXP-08 (C30166, https://shopview.testrail.io/index.php?/cases/view/30166) — A4/25px-margins/footer: px values not measurable by a manual tester without tooling.
- SBC-EXP-15 (C30173, https://shopview.testrail.io/index.php?/cases/view/30173) — Empty export still downloads headers+zero totals; legitimate but low value.
- SBC-EMPTY-02 (C30182, https://shopview.testrail.io/index.php?/cases/view/30182) — No-empty-message-while-loading; a race a manual tester can rarely drive deterministically.
- SBC-VIS-01 (C30185, https://shopview.testrail.io/index.php?/cases/view/30185) — Hex/px theme parroting (#f9fafb, 32px/24px/2rem); PO said his local visuals are broken and the video is the reference — verify once at build acceptance, not per cycle.
- SBC-VIS-02 (C30186, https://shopview.testrail.io/index.php?/cases/view/30186) — Row-surface color assignments per tree level; verify once.
- SBC-VIS-03 (C30187, https://shopview.testrail.io/index.php?/cases/view/30187) — Dark mode + PDF-stays-light; verify once per report.
- SBR-NAV-03 (C30197, https://shopview.testrail.io/index.php?/cases/view/30197) — Real known issue (video: "Representative" squishes) but the FIX is undecided (padding vs other); asserting the padding solution is premature.
- SBR-LOC-04 (C30216, https://shopview.testrail.io/index.php?/cases/view/30216) — Single-location-still-sees-filter: directly contradicted by pending video P33 (hide when <=1 location) — likely to be inverted by the spec update.
- SBR-BADGE-02 (C30227, https://shopview.testrail.io/index.php?/cases/view/30227) — Badge color tokens; cosmetic conformance, verify once.
- SBR-LINK-04 (C30250, https://shopview.testrail.io/index.php?/cases/view/30250) — Link styling/hover/focus/never-purple; cosmetic.
- SBR-EXP-05 (C30280, https://shopview.testrail.io/index.php?/cases/view/30280) — 18-char PDF truncation detail; testable but low value.
- SBR-EXP-08 (C30283, https://shopview.testrail.io/index.php?/cases/view/30283) — PDF body font px by longest-dollar-string tier table; barely verifiable manually (kept only as the base rule; the edge rules case is CUT).
- SBR-MOB-03 (C30304, https://shopview.testrail.io/index.php?/cases/view/30304) — 44x44px touch targets need measurement tooling; keep as a one-time design check.
- SBR-VIS-01 (C30305, https://shopview.testrail.io/index.php?/cases/view/30305) — Px/hex toolbar/table theme parroting; verify once.
- SBR-VIS-02 (C30306, https://shopview.testrail.io/index.php?/cases/view/30306) — Dark-mode equivalents; verify once.
- SBR-VIS-05 (C30309, https://shopview.testrail.io/index.php?/cases/view/30309) — WCAG AA contrast ratio requires tooling; one-time a11y check.
- PV-NAV-03 (C30324, https://shopview.testrail.io/index.php?/cases/view/30324) — Loading-indicator/no-blank-flash; standard framework behavior, verify once.
- PV-FILT-11 (C30338, https://shopview.testrail.io/index.php?/cases/view/30338) — Verbatim empty-state label; string conformance, verify once.
- PV-FILT-13 (C30340, https://shopview.testrail.io/index.php?/cases/view/30340) — Single-location-still-sees-filter: contradicted by pending video P33; may invert.
- PV-COL-08 (C30358, https://shopview.testrail.io/index.php?/cases/view/30358) — All-20-columns-hidden edge + not-restored subtlety; legitimate but low value.
- PV-EXP-08 (C30382, https://shopview.testrail.io/index.php?/cases/view/30382) — Export column alignment (centered/left/right); cosmetic conformance.
- PV-VIS-01 (C30385, https://shopview.testrail.io/index.php?/cases/view/30385) — Two-tone theme parroting; verify once.
- PV-VIS-02 (C30386, https://shopview.testrail.io/index.php?/cases/view/30386) — Px paddings/1px borders; verify once.
- PV-VIS-03 (C30387, https://shopview.testrail.io/index.php?/cases/view/30387) — Dark mode + 3:1 icon contrast (tooling); one-time check.
- TU-NAV-05 (C30396, https://shopview.testrail.io/index.php?/cases/view/30396) — Loading indicator/toolbar-interactive; framework behavior, verify once.
- TU-DAY-01 (C30418, https://shopview.testrail.io/index.php?/cases/view/30418) — Accessible-name wording of the chevron; one-time a11y check.
- TU-EXP-08 (C30441, https://shopview.testrail.io/index.php?/cases/view/30441) — Verbatim toast texts ("Download started"/"Failed to download report"); string conformance.
- TU-LOC-05 (C30446, https://shopview.testrail.io/index.php?/cases/view/30446) — Single-location-still-sees-filter: contradicted by pending video P33; may invert.
- TU-VIS-01 (C30447, https://shopview.testrail.io/index.php?/cases/view/30447) — All-white table / toolbar order; cosmetic, verify once.
- TU-VIS-02 (C30448, https://shopview.testrail.io/index.php?/cases/view/30448) — Dark mode legibility + 3:1 contrast (tooling); one-time check.
- WIP-SCOPE-04 (C30459, https://shopview.testrail.io/index.php?/cases/view/30459) — Loading indicator behavior; framework, verify once.
- WIP-COL-06 (C30471, https://shopview.testrail.io/index.php?/cases/view/30471) — Customer-name-or-blank; restates a default rendering, low value.
- WIP-VIS-01 (C30519, https://shopview.testrail.io/index.php?/cases/view/30519) — All-white/no-zebra; cosmetic, verify once.
- WIP-VIS-02 (C30520, https://shopview.testrail.io/index.php?/cases/view/30520) — Strip band styling (rules, not cards); cosmetic.
- WIP-VIS-03 (C30521, https://shopview.testrail.io/index.php?/cases/view/30521) — Bold/pinned Total column styling; overlaps TOT-01; cosmetic-leaning.
- WIP-VIS-04 (C30522, https://shopview.testrail.io/index.php?/cases/view/30522) — Scroll-container/fill-height behavior; framework-leaning, verify once.
- WIP-VIS-07 (C30525, https://shopview.testrail.io/index.php?/cases/view/30525) — Dark mode legibility; verify once.
- IV-COL-05 (C30555, https://shopview.testrail.io/index.php?/cases/view/30555) — Em-dash for missing category/vendor; a rendering default, low value.
- IV-FLT-03 (C30571, https://shopview.testrail.io/index.php?/cases/view/30571) — No-selection-means-no-narrowing; restates the absence of a filter (trivial inverse).
- IV-LOC-04 (C30577, https://shopview.testrail.io/index.php?/cases/view/30577) — Single-location-still-sees-filter: contradicted by pending video P33; may invert.
- IV-EXP-05 (C30591, https://shopview.testrail.io/index.php?/cases/view/30591) — Verbatim filenames; string conformance, verify once.
- IV-VIS-01 (C30596, https://shopview.testrail.io/index.php?/cases/view/30596) — All-white/backdrop theme; cosmetic, verify once.
- IV-VIS-02 (C30597, https://shopview.testrail.io/index.php?/cases/view/30597) — Toolbar control order; cosmetic conformance.
- IV-VIS-05 (C30600, https://shopview.testrail.io/index.php?/cases/view/30600) — Dark mode legibility; verify once.
- IV-VIS-06 (C30601, https://shopview.testrail.io/index.php?/cases/view/30601) — aria-sort exposure; one-time a11y check.
- IV-VIS-07 (C30602, https://shopview.testrail.io/index.php?/cases/view/30602) — Accessible names on icon buttons; one-time a11y check.

---
*Generated by `gen_merge_plan.py` from the same verdict source as `per-case-verdicts.csv` (single source of truth).*
