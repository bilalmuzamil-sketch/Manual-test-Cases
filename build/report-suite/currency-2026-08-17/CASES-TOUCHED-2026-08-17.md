# Report Suite currency pass 2026-08-17 - CASES TOUCHED

Total touched: 423 of 507 our cases (378 version-pin + 36 content-rewrite + 9 content-cases routed as version-pin). Foreign cases (12): 0 touched.

| Internal ID | C-id | Kind | Report | Title | Link |
|---|---|---|---|---|---|
| IV-API-01 | C30605 | version-pin | IV | Nightly snapshot records one row per in-stock non-core part  | https://shopview.testrail.io/index.php?/cases/view/30605 |
| IV-API-03 | C30607 | version-pin | IV | Nightly snapshot: re-running the capture for a date replaces | https://shopview.testrail.io/index.php?/cases/view/30607 |
| IV-API-05 | C30609 | content-rewrite | IV | Snapshot retention: daily captures are kept for 0–13 months | https://shopview.testrail.io/index.php?/cases/view/30609 |
| IV-API-06 | C30610 | version-pin | IV | Thinned history still served by the closest-recorded-day rul | https://shopview.testrail.io/index.php?/cases/view/30610 |
| IV-CALC-01 | C30545 | version-pin | IV | Unit Sell uses the part's fixed sell price when one is set | https://shopview.testrail.io/index.php?/cases/view/30545 |
| IV-CALC-02 | C30546 | version-pin | IV | With no fixed sell price Unit Sell is the category's pricing | https://shopview.testrail.io/index.php?/cases/view/30546 |
| IV-CALC-03 | C30547 | version-pin | IV | With no fixed sell price and no category, Unit Sell equals U | https://shopview.testrail.io/index.php?/cases/view/30547 |
| IV-CALC-04 | C30548 | version-pin | IV | Total Sell is quantity × Unit Sell and Total Cost is quantit | https://shopview.testrail.io/index.php?/cases/view/30548 |
| IV-CALC-05 | C30549 | version-pin | IV | Margin is Total Sell minus Total Cost for the whole on-hand  | https://shopview.testrail.io/index.php?/cases/view/30549 |
| IV-CALC-06 | C30550 | version-pin | IV | Margin % is Margin over Total Sell to one decimal; em-dash w | https://shopview.testrail.io/index.php?/cases/view/30550 |
| IV-COL-01 | C30551 | version-pin | IV | With every column on they appear in the fixed order with the | https://shopview.testrail.io/index.php?/cases/view/30551 |
| IV-COL-02 | C30552 | version-pin | IV | Value formats: Qty to two decimals; money as US-dollar curre | https://shopview.testrail.io/index.php?/cases/view/30552 |
| IV-COL-03 | C30553 | version-pin | IV | Total Cost is bold and pinned far right; it stays put on sid | https://shopview.testrail.io/index.php?/cases/view/30553 |
| IV-COL-04 | C30554 | version-pin | IV | On a first visit the default columns show and the rest stay  | https://shopview.testrail.io/index.php?/cases/view/30554 |
| IV-COL-05 | C30555 | version-pin | IV | Category and Vendor show their names; an em dash ("—") when  | https://shopview.testrail.io/index.php?/cases/view/30555 |
| IV-DATE-01 | C30561 | content-rewrite | IV | "As of" date control: a single day, defaults to today, cappe | https://shopview.testrail.io/index.php?/cases/view/30561 |
| IV-DATE-02 | C30562 | version-pin | IV | The report values inventory as of the END of the selected ra | https://shopview.testrail.io/index.php?/cases/view/30562 |
| IV-DATE-03 | C30563 | content-rewrite | IV | The "as of" date today, with today not yet recorded, values  | https://shopview.testrail.io/index.php?/cases/view/30563 |
| IV-DATE-04 | C30564 | content-rewrite | IV | For a past date the report replays the closest recorded day  | https://shopview.testrail.io/index.php?/cases/view/30564 |
| IV-DATE-05 | C30565 | content-rewrite | IV | The date control names the resolved day; no separate "As of" | https://shopview.testrail.io/index.php?/cases/view/30565 |
| IV-DATE-06 | C30566 | content-rewrite | IV | The "as of" date values stock as of that day; capped at toda | https://shopview.testrail.io/index.php?/cases/view/30566 |
| IV-DATE-08 | C30568 | version-pin | IV | History accrues forward only; a pre-first-recording date is  | https://shopview.testrail.io/index.php?/cases/view/30568 |
| IV-DATE-09 | C38892 | content-rewrite | IV | A recorded day keeps its category and vendor names after a r | https://shopview.testrail.io/index.php?/cases/view/38892 |
| IV-EXP-01 | C30587 | version-pin | IV | Inventory Value: a three-dot menu holds Download (PDF) and D | https://shopview.testrail.io/index.php?/cases/view/30587 |
| IV-EXP-03 | C30589 | version-pin | IV | Export number formats: money to 2 decimals; Margin % to 1 wi | https://shopview.testrail.io/index.php?/cases/view/30589 |
| IV-EXP-04 | C30590 | version-pin | IV | PDF header shows report name; org; period and an as-of line; | https://shopview.testrail.io/index.php?/cases/view/30590 |
| IV-EXP-05 | C30591 | version-pin | IV | Downloaded files are named inventory-value-report.pdf and .c | https://shopview.testrail.io/index.php?/cases/view/30591 |
| IV-EXP-06 | C30592 | version-pin | IV | Exports are generated server-side over the full filtered set | https://shopview.testrail.io/index.php?/cases/view/30592 |
| IV-EXP-07 | C30593 | content-rewrite | IV | An over-cap set produces no file and shows the too-large-to- | https://shopview.testrail.io/index.php?/cases/view/30593 |
| IV-EXP-09 | C30595 | version-pin | IV | Download notifications: verbatim success and failure texts p | https://shopview.testrail.io/index.php?/cases/view/30595 |
| IV-EXP-10 | C43548 | content-rewrite | IV | A large Inventory Value PDF fails instead of being refused p | https://shopview.testrail.io/index.php?/cases/view/43548 |
| IV-FLT-01 | C30569 | version-pin | IV | Category and Vendor multi-selects reload the report to match | https://shopview.testrail.io/index.php?/cases/view/30569 |
| IV-FLT-02 | C30570 | content-rewrite | IV | Category, Vendor and part search are server-side; each chang | https://shopview.testrail.io/index.php?/cases/view/30570 |
| IV-FLT-03 | C30571 | version-pin | IV | With no category or vendor selected all parts show | https://shopview.testrail.io/index.php?/cases/view/30571 |
| IV-FLT-04 | C30572 | version-pin | IV | Part search matches part number or description on the server | https://shopview.testrail.io/index.php?/cases/view/30572 |
| IV-FLT-05 | C30573 | content-rewrite | IV | "As of" date, Location, Category, Vendor and part search com | https://shopview.testrail.io/index.php?/cases/view/30573 |
| IV-LOC-01 | C30574 | content-rewrite | IV | The Location filter is a rightmost multi-select with an All  | https://shopview.testrail.io/index.php?/cases/view/30574 |
| IV-LOC-02 | C30575 | version-pin | IV | Selecting one, several, or all locations reloads the report  | https://shopview.testrail.io/index.php?/cases/view/30575 |
| IV-LOC-03 | C30576 | version-pin | IV | Scoping never includes an inaccessible location | https://shopview.testrail.io/index.php?/cases/view/30576 |
| IV-LOC-04 | C30577 | version-pin | IV | Inventory Value: the Location filter is hidden for a one-loc | https://shopview.testrail.io/index.php?/cases/view/30577 |
| IV-LOC-06 | C38917 | version-pin | IV | Location column: shown to any multi-location user; toggleabl | https://shopview.testrail.io/index.php?/cases/view/38917 |
| IV-NAV-01 | C30534 | version-pin | IV | Inventory Value appears in the reports navigation under the  | https://shopview.testrail.io/index.php?/cases/view/30534 |
| IV-NAV-02 | C30535 | content-rewrite | IV | One row per in-stock part at the selected locations valued a | https://shopview.testrail.io/index.php?/cases/view/30535 |
| IV-NAV-03 | C30536 | content-rewrite | IV | First visit defaults to today and the active location | https://shopview.testrail.io/index.php?/cases/view/30536 |
| IV-NAV-05 | C30538 | version-pin | IV | The report is server-paginated: one page of rows at a time | https://shopview.testrail.io/index.php?/cases/view/30538 |
| IV-NAV-06 | C30539 | content-rewrite | IV | No qualifying parts, day or location: the no-data message sh | https://shopview.testrail.io/index.php?/cases/view/30539 |
| IV-PERM-01 | C30603 | version-pin | IV | A user with ordinary reports access can open Inventory Value | https://shopview.testrail.io/index.php?/cases/view/30603 |
| IV-PERM-02 | C30604 | version-pin | IV | Without reports access Inventory Value is absent from the na | https://shopview.testrail.io/index.php?/cases/view/30604 |
| IV-PERS-01 | C30579 | version-pin | IV | Column Selection toggles columns; Total Cost cannot be turne | https://shopview.testrail.io/index.php?/cases/view/30579 |
| IV-PERS-02 | C30580 | version-pin | IV | Toggling columns never reorders them | https://shopview.testrail.io/index.php?/cases/view/30580 |
| IV-PERS-03 | C30581 | content-rewrite | IV | The report remembers all filters; columns and sort per brows | https://shopview.testrail.io/index.php?/cases/view/30581 |
| IV-PERS-04 | C30582 | version-pin | IV | Defensive restore: a stale saved category or vendor is dropp | https://shopview.testrail.io/index.php?/cases/view/30582 |
| IV-SCOPE-01 | C30540 | version-pin | IV | A part appears only if not a core charge and on-hand quantit | https://shopview.testrail.io/index.php?/cases/view/30540 |
| IV-SCOPE-02 | C30541 | version-pin | IV | A part stocked at two selected locations shows as two rows;  | https://shopview.testrail.io/index.php?/cases/view/30541 |
| IV-SORT-01 | C30583 | version-pin | IV | Rows are sorted by Total Cost highest first on load and afte | https://shopview.testrail.io/index.php?/cases/view/30583 |
| IV-SORT-02 | C30584 | version-pin | IV | Header clicks sort ascending then descending; no third state | https://shopview.testrail.io/index.php?/cases/view/30584 |
| IV-SORT-03 | C30585 | version-pin | IV | Money and numeric columns sort by value; text columns sort a | https://shopview.testrail.io/index.php?/cases/view/30585 |
| IV-TOT-01 | C30556 | version-pin | IV | Totals row: Total label, blank identity/per-unit cells, pinn | https://shopview.testrail.io/index.php?/cases/view/30556 |
| IV-TOT-02 | C30557 | version-pin | IV | Totals row sums the FULL filtered set on the server, not jus | https://shopview.testrail.io/index.php?/cases/view/30557 |
| IV-TOT-03 | C30558 | version-pin | IV | Totals-row Margin % is recomputed from the totals; not an av | https://shopview.testrail.io/index.php?/cases/view/30558 |
| IV-VIS-01 | C30596 | version-pin | IV | All-white table with no row shading on the standard report b | https://shopview.testrail.io/index.php?/cases/view/30596 |
| IV-VIS-02 | C30597 | version-pin | IV | Toolbar layout: menu leftmost then Column Selection; then th | https://shopview.testrail.io/index.php?/cases/view/30597 |
| IV-VIS-04 | C30599 | version-pin | IV | Long Description; Category and Vendor truncate on hover; Par | https://shopview.testrail.io/index.php?/cases/view/30599 |
| IV-VIS-05 | C30600 | version-pin | IV | In dark mode the page background, toolbar, cells; the "—" gl | https://shopview.testrail.io/index.php?/cases/view/30600 |
| IV-VIS-06 | C30601 | version-pin | IV | Each sortable header exposes its sort state and shows the di | https://shopview.testrail.io/index.php?/cases/view/30601 |
| IV-VIS-07 | C30602 | version-pin | IV | The icon-only download and Column Selection buttons carry ac | https://shopview.testrail.io/index.php?/cases/view/30602 |
| PV-API-01 | C30388 | version-pin | PV | The report is server-paginated - the backend returns one pag | https://shopview.testrail.io/index.php?/cases/view/30388 |
| PV-API-02 | C30389 | version-pin | PV | Each filter or search change re-queries the server and retur | https://shopview.testrail.io/index.php?/cases/view/30389 |
| PV-API-03 | C30390 | version-pin | PV | Header-click sorting re-queries the server; nulls first asc  | https://shopview.testrail.io/index.php?/cases/view/30390 |
| PV-API-04 | C30391 | version-pin | PV | The back end serves report data and export on ordinary repor | https://shopview.testrail.io/index.php?/cases/view/30391 |
| PV-CALC-01 | C30359 | version-pin | PV | Units Sold for an inventory part is net stock movement | https://shopview.testrail.io/index.php?/cases/view/30359 |
| PV-CALC-02 | C30360 | version-pin | PV | Special Order Units Sold = in-window request quantity, net o | https://shopview.testrail.io/index.php?/cases/view/30360 |
| PV-CALC-03 | C30361 | version-pin | PV | Units Returned counts initiated part returns and parts-sale  | https://shopview.testrail.io/index.php?/cases/view/30361 |
| PV-CALC-04 | C30362 | version-pin | PV | Units Returned is windowed by initiation date, ignores invoi | https://shopview.testrail.io/index.php?/cases/view/30362 |
| PV-CALC-05 | C30363 | version-pin | PV | Sold (WO) counts Service work orders, Sold (Parts Sale) coun | https://shopview.testrail.io/index.php?/cases/view/30363 |
| PV-CALC-06 | C30364 | version-pin | PV | Demand counts each transaction once; a reversal neither adds | https://shopview.testrail.io/index.php?/cases/view/30364 |
| PV-CALC-07 | C30365 | version-pin | PV | Last Sale is whole days since the most recent sale over all- | https://shopview.testrail.io/index.php?/cases/view/30365 |
| PV-CALC-08 | C30366 | version-pin | PV | On Hand shows the row's own location stock | https://shopview.testrail.io/index.php?/cases/view/30366 |
| PV-CALC-09 | C30367 | version-pin | PV | Turns / Yr annualizes the sales rate, is 0.00 at zero stock, | https://shopview.testrail.io/index.php?/cases/view/30367 |
| PV-CALC-10 | C30368 | content-rewrite | PV | Revenue, Margin, Avg Cost, Avg Sell and Margin % use the bil | https://shopview.testrail.io/index.php?/cases/view/30368 |
| PV-CALC-11 | C30369 | content-rewrite | PV | A reversed or voided sale is excluded from every billed-line | https://shopview.testrail.io/index.php?/cases/view/30369 |
| PV-CALC-12 | C30370 | content-rewrite | PV | Avg Cost / Avg Sell and Margin % use independent null trigge | https://shopview.testrail.io/index.php?/cases/view/30370 |
| PV-CALC-13 | C30371 | content-rewrite | PV | Number formats match the spec per column; rounding is half a | https://shopview.testrail.io/index.php?/cases/view/30371 |
| PV-CALC-14 | C30372 | version-pin | PV | Core parts are excluded from both the inventory and special- | https://shopview.testrail.io/index.php?/cases/view/30372 |
| PV-CALC-15 | C30373 | content-rewrite | PV | Movement and billed bases may differ; Sold (WO) + Sold (Part | https://shopview.testrail.io/index.php?/cases/view/30373 |
| PV-CALC-16 | C30374 | content-rewrite | PV | Window anchors: movement uses the event date, billed uses th | https://shopview.testrail.io/index.php?/cases/view/30374 |
| PV-COL-01 | C30351 | content-rewrite | PV | Column picker lists all 20 columns and never offers the inte | https://shopview.testrail.io/index.php?/cases/view/30351 |
| PV-COL-02 | C30352 | content-rewrite | PV | First visit shows exactly the 14 default columns in the spec | https://shopview.testrail.io/index.php?/cases/view/30352 |
| PV-COL-03 | C30353 | content-rewrite | PV | A re-enabled column returns to its canonical slot, with no r | https://shopview.testrail.io/index.php?/cases/view/30353 |
| PV-COL-04 | C30354 | version-pin | PV | Filters; columns and sort are remembered per browser before  | https://shopview.testrail.io/index.php?/cases/view/30354 |
| PV-COL-05 | C30355 | version-pin | PV | A saved value that is no longer valid falls back to that set | https://shopview.testrail.io/index.php?/cases/view/30355 |
| PV-COL-06 | C30356 | version-pin | PV | A different user signing in on the same browser inherits the | https://shopview.testrail.io/index.php?/cases/view/30356 |
| PV-COL-08 | C30358 | version-pin | PV | All 20 columns can be hidden; the empty selection is never r | https://shopview.testrail.io/index.php?/cases/view/30358 |
| PV-EXP-01 | C30375 | version-pin | PV | The overflow button opens Download (PDF) then Download (CSV) | https://shopview.testrail.io/index.php?/cases/view/30375 |
| PV-EXP-02 | C30376 | version-pin | PV | Both exports reflect the filters and search active at the ti | https://shopview.testrail.io/index.php?/cases/view/30376 |
| PV-EXP-03 | C30377 | version-pin | PV | Exports include only the enabled columns, in the canonical o | https://shopview.testrail.io/index.php?/cases/view/30377 |
| PV-EXP-04 | C30378 | version-pin | PV | Exports reflect the active sort, including Min/Max and null  | https://shopview.testrail.io/index.php?/cases/view/30378 |
| PV-EXP-05 | C30379 | version-pin | PV | PDF: filename, A3 landscape, title, text truncation, and the | https://shopview.testrail.io/index.php?/cases/view/30379 |
| PV-EXP-06 | C30380 | version-pin | PV | CSV is named velocity-report.csv and holds full untruncated  | https://shopview.testrail.io/index.php?/cases/view/30380 |
| PV-EXP-07 | C30381 | content-rewrite | PV | Em-dash in both exports; Last Sale reads "N days" in the PDF | https://shopview.testrail.io/index.php?/cases/view/30381 |
| PV-EXP-08 | C30382 | version-pin | PV | PDF export alignment: Type centered, text left, numeric and  | https://shopview.testrail.io/index.php?/cases/view/30382 |
| PV-EXP-10 | C30384 | version-pin | PV | Export toasts: exact success texts; server or fallback error | https://shopview.testrail.io/index.php?/cases/view/30384 |
| PV-EXP-11 | C38885 | version-pin | PV | An over-cap Parts Velocity export is refused with the too-la | https://shopview.testrail.io/index.php?/cases/view/38885 |
| PV-EXP-12 | C43547 | version-pin | PV | A large PDF download fails outright while the CSV of the sam | https://shopview.testrail.io/index.php?/cases/view/43547 |
| PV-FILT-01 | C30328 | version-pin | PV | Type filter: single-select, first in row, three options, def | https://shopview.testrail.io/index.php?/cases/view/30328 |
| PV-FILT-03 | C30330 | version-pin | PV | Date range selector offers exactly the eleven bounded option | https://shopview.testrail.io/index.php?/cases/view/30330 |
| PV-FILT-04 | C30331 | version-pin | PV | A Custom date range needs valid dates and rejects a span ove | https://shopview.testrail.io/index.php?/cases/view/30331 |
| PV-FILT-05 | C30332 | version-pin | PV | Category and Vendor multi-select filters limit the table to  | https://shopview.testrail.io/index.php?/cases/view/30332 |
| PV-FILT-06 | C30333 | version-pin | PV | Toolbar search matches part number or description, case-inse | https://shopview.testrail.io/index.php?/cases/view/30333 |
| PV-FILT-07 | C30334 | version-pin | PV | All active filters combine with AND logic | https://shopview.testrail.io/index.php?/cases/view/30334 |
| PV-FILT-08 | C30335 | version-pin | PV | The Bin multi-select limits the table to parts stocked in th | https://shopview.testrail.io/index.php?/cases/view/30335 |
| PV-FILT-09 | C30336 | version-pin | PV | Bin filter excludes special-order rows; Bin plus that Type i | https://shopview.testrail.io/index.php?/cases/view/30336 |
| PV-FILT-10 | C30337 | version-pin | PV | Location filter is rightmost, defaults to the active locatio | https://shopview.testrail.io/index.php?/cases/view/30337 |
| PV-FILT-11 | C30338 | version-pin | PV | Empty state shows the standard no-data message when no parts | https://shopview.testrail.io/index.php?/cases/view/30338 |
| PV-FILT-12 | C30339 | version-pin | PV | Parts with no category; vendor or bin are excluded when that | https://shopview.testrail.io/index.php?/cases/view/30339 |
| PV-FILT-13 | C30340 | version-pin | PV | Parts Velocity: the Location filter is hidden for a one-loca | https://shopview.testrail.io/index.php?/cases/view/30340 |
| PV-FILT-14 | C38914 | version-pin | PV | Location column: leftmost before Type; own location per row; | https://shopview.testrail.io/index.php?/cases/view/38914 |
| PV-NAV-01 | C30322 | version-pin | PV | Parts Velocity appears under a new Parts section in the Repo | https://shopview.testrail.io/index.php?/cases/view/30322 |
| PV-NAV-02 | C30323 | version-pin | PV | First visit: date range defaults to This Year and data is fe | https://shopview.testrail.io/index.php?/cases/view/30323 |
| PV-NAV-03 | C30324 | version-pin | PV | A loading indicator shows and old rows are replaced only whe | https://shopview.testrail.io/index.php?/cases/view/30324 |
| PV-PERM-01 | C30325 | version-pin | PV | A user with ordinary reports access can load the report and  | https://shopview.testrail.io/index.php?/cases/view/30325 |
| PV-PERM-02 | C30326 | version-pin | PV | Without the Manager or Office User role the report entry is  | https://shopview.testrail.io/index.php?/cases/view/30326 |
| PV-PERM-03 | C30327 | version-pin | PV | Ordinary reports access alone opens Parts Velocity and its e | https://shopview.testrail.io/index.php?/cases/view/30327 |
| PV-PREC-01 | C38924 | content-rewrite | PV | Units Sold keeps an exact part-of-a-unit quantity and is nev | https://shopview.testrail.io/index.php?/cases/view/38924 |
| PV-PREC-02 | C38925 | content-rewrite | PV | QuickBooks amount for a part-of-a-unit sale is exact and nev | https://shopview.testrail.io/index.php?/cases/view/38925 |
| PV-ROW-01 | C30341 | version-pin | PV | A part stocked at two selected locations shows as two per-lo | https://shopview.testrail.io/index.php?/cases/view/30341 |
| PV-ROW-02 | C30342 | version-pin | PV | A Special Order part is one merged row summed across selecte | https://shopview.testrail.io/index.php?/cases/view/30342 |
| PV-ROW-03 | C30343 | version-pin | PV | Rows load ranked by Demand descending, indicator on the Dema | https://shopview.testrail.io/index.php?/cases/view/30343 |
| PV-ROW-04 | C30344 | version-pin | PV | A header click sorts ascending first, toggles, and places nu | https://shopview.testrail.io/index.php?/cases/view/30344 |
| PV-ROW-05 | C30345 | version-pin | PV | Sticky header, all-left alignment on screen, and plain-text  | https://shopview.testrail.io/index.php?/cases/view/30345 |
| PV-ROW-06 | C30346 | content-rewrite | PV | Info icons sit on Units Sold, Demand and Turns/Yr with descr | https://shopview.testrail.io/index.php?/cases/view/30346 |
| PV-ROW-07 | C30347 | version-pin | PV | Description; Category and Vendor truncate on hover; Part # n | https://shopview.testrail.io/index.php?/cases/view/30347 |
| PV-ROW-08 | C30348 | version-pin | PV | Em-dash only in nullable fields; counts and Revenue/Margin a | https://shopview.testrail.io/index.php?/cases/view/30348 |
| PV-ROW-09 | C30349 | version-pin | PV | An inventory part drops out only with no movement, no stock  | https://shopview.testrail.io/index.php?/cases/view/30349 |
| PV-VIS-01 | C30385 | version-pin | PV | The report uses the standard two-tone layout | https://shopview.testrail.io/index.php?/cases/view/30385 |
| PV-VIS-02 | C30386 | version-pin | PV | Toolbar and table detail styling matches the suite paddings  | https://shopview.testrail.io/index.php?/cases/view/30386 |
| PV-VIS-03 | C30387 | version-pin | PV | Dark mode is supported and the grey info icon keeps 3:1 cont | https://shopview.testrail.io/index.php?/cases/view/30387 |
| SBC-API-01 | C30190 | version-pin | SBC | Asset and invoice rows are fetched on first expand; one call | https://shopview.testrail.io/index.php?/cases/view/30190 |
| SBC-API-02 | C30191 | version-pin | SBC | Sorting is applied on the server and re-fetches the first pa | https://shopview.testrail.io/index.php?/cases/view/30191 |
| SBC-API-03 | C30192 | version-pin | SBC | The Customer type-ahead queries the server instead of loadin | https://shopview.testrail.io/index.php?/cases/view/30192 |
| SBC-API-04 | C30193 | version-pin | SBC | Customer rows are server-paginated; the totals row is server | https://shopview.testrail.io/index.php?/cases/view/30193 |
| SBC-API-05 | C30194 | version-pin | SBC | Exports are server-generated and the 10,000-row cap is count | https://shopview.testrail.io/index.php?/cases/view/30194 |
| SBC-API-06 | C43546 | version-pin | SBC | The back end serves SBC report data and export on ordinary r | https://shopview.testrail.io/index.php?/cases/view/43546 |
| SBC-CALC-02 | C30150 | version-pin | SBC | Margin % is Margin over Subtotal to one decimal; em dash whe | https://shopview.testrail.io/index.php?/cases/view/30150 |
| SBC-CALC-05 | C30153 | version-pin | SBC | Invoice subtotals sum to their asset row and asset subtotals | https://shopview.testrail.io/index.php?/cases/view/30153 |
| SBC-CALC-06 | C30154 | version-pin | SBC | Subtotal is the rightmost column; pinned on scroll and bold  | https://shopview.testrail.io/index.php?/cases/view/30154 |
| SBC-CALC-07 | C30155 | version-pin | SBC | The totals row covers the whole filtered set; not just the c | https://shopview.testrail.io/index.php?/cases/view/30155 |
| SBC-COL-02 | C30157 | content-rewrite | SBC | Column toggles hide header+cells; Customer, Subtotal and che | https://shopview.testrail.io/index.php?/cases/view/30157 |
| SBC-COL-04 | C43550 | version-pin | SBC | A one-location user never sees Location in the column-select | https://shopview.testrail.io/index.php?/cases/view/43550 |
| SBC-CUST-01 | C30112 | version-pin | SBC | Customer filter sits between Product Type and Location, carr | https://shopview.testrail.io/index.php?/cases/view/30112 |
| SBC-CUST-02 | C30113 | version-pin | SBC | Typing in the Customer filter lists matching customers by co | https://shopview.testrail.io/index.php?/cases/view/30113 |
| SBC-CUST-03 | C30114 | version-pin | SBC | Pinned control toggles All customers and Clear all; clearing | https://shopview.testrail.io/index.php?/cases/view/30114 |
| SBC-CUST-04 | C30115 | version-pin | SBC | First load starts in the all-customers state and the report  | https://shopview.testrail.io/index.php?/cases/view/30115 |
| SBC-CUST-05 | C30116 | version-pin | SBC | Collapsed label reads None, the customer's name, or N select | https://shopview.testrail.io/index.php?/cases/view/30116 |
| SBC-CUST-06 | C30117 | version-pin | SBC | Changing the customer selection narrows the table and refres | https://shopview.testrail.io/index.php?/cases/view/30117 |
| SBC-CUST-09 | C30120 | version-pin | SBC | A subset customer selection reconciles on a filter change; k | https://shopview.testrail.io/index.php?/cases/view/30120 |
| SBC-DATE-01 | C30102 | version-pin | SBC | Date range picker offers nine periods in the specified order | https://shopview.testrail.io/index.php?/cases/view/30102 |
| SBC-DATE-03 | C30104 | version-pin | SBC | Building a custom range on the calendar cannot exceed a 366- | https://shopview.testrail.io/index.php?/cases/view/30104 |
| SBC-DATE-04 | C30105 | version-pin | SBC | Changing the date range writes it into the page link for sha | https://shopview.testrail.io/index.php?/cases/view/30105 |
| SBC-EMPTY-01 | C30181 | version-pin | SBC | Empty state shows in the table body; toolbar interactive; ke | https://shopview.testrail.io/index.php?/cases/view/30181 |
| SBC-EMPTY-04 | C30184 | version-pin | SBC | A failed data fetch shows the error toast which fades after  | https://shopview.testrail.io/index.php?/cases/view/30184 |
| SBC-EXP-01 | C30159 | version-pin | SBC | The overflow menu holds exactly the four download items - no | https://shopview.testrail.io/index.php?/cases/view/30159 |
| SBC-EXP-02 | C30160 | version-pin | SBC | Download file names carry the version and the active date ra | https://shopview.testrail.io/index.php?/cases/view/30160 |
| SBC-EXP-05 | C30163 | version-pin | SBC | CSV and PDF hold exactly the customers matching the active f | https://shopview.testrail.io/index.php?/cases/view/30163 |
| SBC-EXP-06 | C30164 | version-pin | SBC | Each download item shows a loading state and its own export- | https://shopview.testrail.io/index.php?/cases/view/30164 |
| SBC-EXP-08 | C30166 | version-pin | SBC | PDF page: A4 landscape, uniform margins, ShopView footer and | https://shopview.testrail.io/index.php?/cases/view/30166 |
| SBC-EXP-09 | C30167 | version-pin | SBC | PDF header: title, organization, date range, Product Type an | https://shopview.testrail.io/index.php?/cases/view/30167 |
| SBC-EXP-10 | C30168 | version-pin | SBC | PDF logo is embedded, scales without distortion | https://shopview.testrail.io/index.php?/cases/view/30168 |
| SBC-EXP-14 | C30172 | version-pin | SBC | An export over 10,000 data rows is refused with the too-larg | https://shopview.testrail.io/index.php?/cases/view/30172 |
| SBC-EXP-15 | C30173 | version-pin | SBC | A no-match export still downloads headers and a zero totals  | https://shopview.testrail.io/index.php?/cases/view/30173 |
| SBC-EXP-17 | C43553 | version-pin | SBC | A logo that is set but will not load falls back to the ShopV | https://shopview.testrail.io/index.php?/cases/view/43553 |
| SBC-LBL-01 | C30134 | version-pin | SBC | Asset identified by VIN, falling back to Unit #, then plate | https://shopview.testrail.io/index.php?/cases/view/30134 |
| SBC-LBL-04 | C30137 | version-pin | SBC | Duplicate asset labels get stable (#1)/(#2) suffixes that su | https://shopview.testrail.io/index.php?/cases/view/30137 |
| SBC-LINK-01 | C30138 | version-pin | SBC | The invoice number opens the invoice in the same browser tab | https://shopview.testrail.io/index.php?/cases/view/30138 |
| SBC-LINK-02 | C30139 | version-pin | SBC | Browser back from an invoice restores filters; sort and colu | https://shopview.testrail.io/index.php?/cases/view/30139 |
| SBC-LINK-03 | C30140 | version-pin | SBC | Customer name is plain text; the invoice link never turns vi | https://shopview.testrail.io/index.php?/cases/view/30140 |
| SBC-LINK-04 | C30141 | version-pin | SBC | An invoice deleted after load shows the not-found state and  | https://shopview.testrail.io/index.php?/cases/view/30141 |
| SBC-LINK-05 | C43558 | version-pin | SBC | You cannot reach an invoice you have no permission to open | https://shopview.testrail.io/index.php?/cases/view/43558 |
| SBC-LOC-01 | C30109 | version-pin | SBC | Location filter: rightmost, lists accessible locations, All  | https://shopview.testrail.io/index.php?/cases/view/30109 |
| SBC-LOC-03 | C30111 | version-pin | SBC | Selecting locations scopes the data; All locations covers ev | https://shopview.testrail.io/index.php?/cases/view/30111 |
| SBC-LOC-04 | C38912 | version-pin | SBC | Location column: shown to any multi-location user, Multiple  | https://shopview.testrail.io/index.php?/cases/view/38912 |
| SBC-MOB-01 | C30188 | version-pin | SBC | On a phone every toolbar control works on touch; the toolbar | https://shopview.testrail.io/index.php?/cases/view/30188 |
| SBC-MOB-02 | C30189 | version-pin | SBC | On touch the table scrolls sideways with Subtotal pinned and | https://shopview.testrail.io/index.php?/cases/view/30189 |
| SBC-NAV-01 | C30096 | version-pin | SBC | Sales By Customer listed under Performance, below existing l | https://shopview.testrail.io/index.php?/cases/view/30096 |
| SBC-PERM-01 | C30098 | version-pin | SBC | Ordinary reports access opens Sales By Customer — no separat | https://shopview.testrail.io/index.php?/cases/view/30098 |
| SBC-PERM-02 | C30099 | version-pin | SBC | Without reports access, Sales By Customer is not listed and  | https://shopview.testrail.io/index.php?/cases/view/30099 |
| SBC-PERM-03 | C30100 | version-pin | SBC | Opening an invoice you lack permission for shows access-deni | https://shopview.testrail.io/index.php?/cases/view/30100 |
| SBC-PERM-04 | C30101 | version-pin | SBC | Location access enforced: no data from a location the user c | https://shopview.testrail.io/index.php?/cases/view/30101 |
| SBC-PERM-05 | C39447 | version-pin | SBC | No Sales By Customer permission is offered in the role permi | https://shopview.testrail.io/index.php?/cases/view/39447 |
| SBC-PERS-01 | C30174 | version-pin | SBC | Filters; sort and visible columns are restored on the next v | https://shopview.testrail.io/index.php?/cases/view/30174 |
| SBC-PERS-02 | C30175 | version-pin | SBC | Type-ahead search text, expansion state and scroll position  | https://shopview.testrail.io/index.php?/cases/view/30175 |
| SBC-PERS-03 | C30176 | version-pin | SBC | A saved value that is no longer valid is dropped and falls b | https://shopview.testrail.io/index.php?/cases/view/30176 |
| SBC-PERS-04 | C30177 | version-pin | SBC | The saved view is specific to this report and does not affec | https://shopview.testrail.io/index.php?/cases/view/30177 |
| SBC-PERS-05 | C30178 | content-rewrite | SBC | With no saved view every setting uses its own default | https://shopview.testrail.io/index.php?/cases/view/30178 |
| SBC-PERS-06 | C30179 | version-pin | SBC | When a saved view and a page-link range clash the saved view | https://shopview.testrail.io/index.php?/cases/view/30179 |
| SBC-PERS-07 | C30180 | version-pin | SBC | Customer filter restore: all-customers stays all; an id set  | https://shopview.testrail.io/index.php?/cases/view/30180 |
| SBC-SORT-02 | C30143 | version-pin | SBC | Default sort is Customer name ascending case-insensitive | https://shopview.testrail.io/index.php?/cases/view/30143 |
| SBC-SORT-03 | C30144 | version-pin | SBC | Missing values sort to the bottom ascending and to the top d | https://shopview.testrail.io/index.php?/cases/view/30144 |
| SBC-SORT-04 | C30145 | version-pin | SBC | Sorting by Date orders customers by their most recent invoic | https://shopview.testrail.io/index.php?/cases/view/30145 |
| SBC-TREE-01 | C30121 | version-pin | SBC | Each customer gets one summary row with its invoice count in | https://shopview.testrail.io/index.php?/cases/view/30121 |
| SBC-TREE-02 | C30122 | version-pin | SBC | A customer with no matching invoices in the current view is  | https://shopview.testrail.io/index.php?/cases/view/30122 |
| SBC-TREE-03 | C30123 | version-pin | SBC | Expanding a customer reveals asset rows; chevrons toggle and | https://shopview.testrail.io/index.php?/cases/view/30123 |
| SBC-TREE-05 | C30125 | version-pin | SBC | Invoices group into one asset row per vehicle record | https://shopview.testrail.io/index.php?/cases/view/30125 |
| SBC-TREE-06 | C30126 | version-pin | SBC | Asset rows order A to Z with the Parts Sales bucket always l | https://shopview.testrail.io/index.php?/cases/view/30126 |
| SBC-TREE-08 | C30128 | version-pin | SBC | Header-row chevron expands or collapses every customer on th | https://shopview.testrail.io/index.php?/cases/view/30128 |
| SBC-TREE-09 | C30129 | version-pin | SBC | Reload-causing changes collapse expansion; Customer filter t | https://shopview.testrail.io/index.php?/cases/view/30129 |
| SBC-TREE-10 | C30130 | version-pin | SBC | Edge: a single-invoice asset can still be expanded | https://shopview.testrail.io/index.php?/cases/view/30130 |
| SBC-TREE-11 | C30131 | version-pin | SBC | A service (S) invoice with no vehicle also lands in the Part | https://shopview.testrail.io/index.php?/cases/view/30131 |
| SBC-TREE-12 | C30132 | version-pin | SBC | Reversed and voided invoices are excluded from every row; co | https://shopview.testrail.io/index.php?/cases/view/30132 |
| SBC-TREE-13 | C30133 | version-pin | SBC | Every row type renders the same columns in the same order | https://shopview.testrail.io/index.php?/cases/view/30133 |
| SBC-TYPE-02 | C30107 | version-pin | SBC | Product Type multi-select: both toggles on by default; S/P p | https://shopview.testrail.io/index.php?/cases/view/30107 |
| SBC-TYPE-04 | C43591 | version-pin | SBC | Clear all leaves neither Product Type toggle on and shows th | https://shopview.testrail.io/index.php?/cases/view/43591 |
| SBC-VIS-01 | C30185 | version-pin | SBC | Page and toolbar match the suite theme in padding; surface a | https://shopview.testrail.io/index.php?/cases/view/30185 |
| SBC-VIS-02 | C30186 | version-pin | SBC | Row surfaces alternate by tree level; header and totals rows | https://shopview.testrail.io/index.php?/cases/view/30186 |
| SBC-VIS-03 | C30187 | version-pin | SBC | Dark mode darkens every surface while the PDF always renders | https://shopview.testrail.io/index.php?/cases/view/30187 |
| SBR-API-01 | C30316 | version-pin | SBR | A rep's invoice detail rows are fetched from the server only | https://shopview.testrail.io/index.php?/cases/view/30316 |
| SBR-API-02 | C30317 | version-pin | SBR | Sorting is performed server-side and returns the first page | https://shopview.testrail.io/index.php?/cases/view/30317 |
| SBR-API-03 | C30318 | version-pin | SBR | Grand totals are server-computed over the full filtered set | https://shopview.testrail.io/index.php?/cases/view/30318 |
| SBR-API-04 | C30319 | version-pin | SBR | All four exports are generated server-side against the activ | https://shopview.testrail.io/index.php?/cases/view/30319 |
| SBR-API-05 | C30320 | version-pin | SBR | The Expanded View PDF's 10,000-row cap is enforced server-si | https://shopview.testrail.io/index.php?/cases/view/30320 |
| SBR-API-06 | C30321 | version-pin | SBR | Deactivating a rep first runs a server pre-check returning t | https://shopview.testrail.io/index.php?/cases/view/30321 |
| SBR-ASGN-01 | C30292 | version-pin | SBR | Report Name dropdown lists Sales Representative Assignments  | https://shopview.testrail.io/index.php?/cases/view/30292 |
| SBR-ASGN-02 | C30293 | version-pin | SBR | Sales Representative Assignments CSV: file name, headers, su | https://shopview.testrail.io/index.php?/cases/view/30293 |
| SBR-ASGN-03 | C30294 | version-pin | SBR | Assignments CSV: one row per assigned customer, sorted custo | https://shopview.testrail.io/index.php?/cases/view/30294 |
| SBR-ASGN-04 | C30295 | version-pin | SBR | "Rep is active?" tracks the staff-active status, not the tog | https://shopview.testrail.io/index.php?/cases/view/30295 |
| SBR-ASGN-05 | C30296 | version-pin | SBR | A deleted rep record still exports one row from the stored n | https://shopview.testrail.io/index.php?/cases/view/30296 |
| SBR-ASGN-06 | C30297 | version-pin | SBR | Assignments export failure and nothing-to-export use the dia | https://shopview.testrail.io/index.php?/cases/view/30297 |
| SBR-BADGE-02 | C30227 | version-pin | SBR | Badge colors use the canonical payment-status tokens in ligh | https://shopview.testrail.io/index.php?/cases/view/30227 |
| SBR-CALC-05 | C30233 | version-pin | SBR | Margin % to one decimal; em dash when Subtotal <= 0; recompu | https://shopview.testrail.io/index.php?/cases/view/30233 |
| SBR-COL-03 | C30267 | version-pin | SBR | Toggling a column applies at once to summary; detail and Tot | https://shopview.testrail.io/index.php?/cases/view/30267 |
| SBR-COL-04 | C30268 | version-pin | SBR | Column visibility never affects the exports | https://shopview.testrail.io/index.php?/cases/view/30268 |
| SBR-COL-05 | C30269 | version-pin | SBR | Hiding the active sort column keeps the sort | https://shopview.testrail.io/index.php?/cases/view/30269 |
| SBR-DATE-01 | C30201 | version-pin | SBR | Date range picker is in the toolbar and offers the standard  | https://shopview.testrail.io/index.php?/cases/view/30201 |
| SBR-DATE-02 | C30202 | version-pin | SBR | A Custom range uses the date-picker and holds a 366-day maxi | https://shopview.testrail.io/index.php?/cases/view/30202 |
| SBR-DATE-04 | C30204 | version-pin | SBR | An invoice sits in the range by its own invoice date; endpoi | https://shopview.testrail.io/index.php?/cases/view/30204 |
| SBR-DEACT-02 | C30253 | version-pin | SBR | Deactivate dialog: counted pluralized headline, reassurance, | https://shopview.testrail.io/index.php?/cases/view/30253 |
| SBR-DEACT-03 | C30254 | version-pin | SBR | Type-YES gate: auto-focus; case-insensitive match; Enter sub | https://shopview.testrail.io/index.php?/cases/view/30254 |
| SBR-DEACT-04 | C30255 | version-pin | SBR | Cancel and X dismiss the Deactivate dialog; Escape and click | https://shopview.testrail.io/index.php?/cases/view/30255 |
| SBR-DEACT-05 | C30256 | version-pin | SBR | Valid submit locks the dialog, then deactivates keeping assi | https://shopview.testrail.io/index.php?/cases/view/30256 |
| SBR-DEACT-06 | C30257 | version-pin | SBR | After deactivation: toggle unchanged, CSV shows No, report c | https://shopview.testrail.io/index.php?/cases/view/30257 |
| SBR-DEACT-07 | C30258 | version-pin | SBR | No dialog: toggle off, no assignments, already inactive, or  | https://shopview.testrail.io/index.php?/cases/view/30258 |
| SBR-DEACT-08 | C30259 | version-pin | SBR | A deactivation failure shows the error toast and leaves the  | https://shopview.testrail.io/index.php?/cases/view/30259 |
| SBR-DEACT-09 | C30260 | version-pin | SBR | If the assignment pre-check fails, the warning dialog still  | https://shopview.testrail.io/index.php?/cases/view/30260 |
| SBR-EXP-01 | C30276 | version-pin | SBR | The ⋯ overflow menu lists exactly four download actions | https://shopview.testrail.io/index.php?/cases/view/30276 |
| SBR-EXP-02 | C30277 | version-pin | SBR | All four downloads respect filters, full result set, and act | https://shopview.testrail.io/index.php?/cases/view/30277 |
| SBR-EXP-05 | C30280 | version-pin | SBR | Expanded View PDF truncates invoice numbers longer than 18 c | https://shopview.testrail.io/index.php?/cases/view/30280 |
| SBR-EXP-06 | C30281 | version-pin | SBR | PDF footer on every page, default-logo fallback, and determi | https://shopview.testrail.io/index.php?/cases/view/30281 |
| SBR-EXP-07 | C30282 | version-pin | SBR | PDFs render negative dollars in accounting parentheses, keep | https://shopview.testrail.io/index.php?/cases/view/30282 |
| SBR-EXP-08 | C30283 | version-pin | SBR | PDF body font steps down as the longest dollar value grows;  | https://shopview.testrail.io/index.php?/cases/view/30283 |
| SBR-EXP-13 | C30288 | version-pin | SBR | The Unassigned row appears in both CSV downloads only when t | https://shopview.testrail.io/index.php?/cases/view/30288 |
| SBR-EXP-14 | C30289 | version-pin | SBR | A failed download shows the canonical error toast | https://shopview.testrail.io/index.php?/cases/view/30289 |
| SBR-EXP-15 | C30290 | version-pin | SBR | Over-cap Expanded View PDF is refused with the too-large mes | https://shopview.testrail.io/index.php?/cases/view/30290 |
| SBR-LINK-01 | C30247 | version-pin | SBR | Detail-row invoice number and customer name links navigate i | https://shopview.testrail.io/index.php?/cases/view/30247 |
| SBR-LINK-03 | C30249 | version-pin | SBR | Browser back from a drilldown restores expansion and scroll; | https://shopview.testrail.io/index.php?/cases/view/30249 |
| SBR-LINK-04 | C30250 | version-pin | SBR | Invoice links use theme-primary; customer links use the body | https://shopview.testrail.io/index.php?/cases/view/30250 |
| SBR-LINK-05 | C30251 | version-pin | SBR | An unavailable link destination shows the standard not-found | https://shopview.testrail.io/index.php?/cases/view/30251 |
| SBR-LINK-06 | C43559 | version-pin | SBR | Invoice # and customer name when you cannot open what they p | https://shopview.testrail.io/index.php?/cases/view/43559 |
| SBR-LOC-01 | C30213 | version-pin | SBR | Location filter is the rightmost control with an All Locatio | https://shopview.testrail.io/index.php?/cases/view/30213 |
| SBR-LOC-03 | C30215 | version-pin | SBR | Location selection cascades; an inaccessible location's data | https://shopview.testrail.io/index.php?/cases/view/30215 |
| SBR-LOC-04 | C30216 | version-pin | SBR | Sales By Representative: Location filter hidden for a one-lo | https://shopview.testrail.io/index.php?/cases/view/30216 |
| SBR-MOB-01 | C30302 | version-pin | SBR | On a phone every toolbar control works on touch | https://shopview.testrail.io/index.php?/cases/view/30302 |
| SBR-MOB-02 | C30303 | version-pin | SBR | On a phone the table scrolls sideways with Subtotal pinned o | https://shopview.testrail.io/index.php?/cases/view/30303 |
| SBR-MOB-03 | C30304 | version-pin | SBR | Touch targets are at least 44×44 px and touch users get no h | https://shopview.testrail.io/index.php?/cases/view/30304 |
| SBR-NAV-01 | C30195 | version-pin | SBR | Sales By Representative under Performance, below existing li | https://shopview.testrail.io/index.php?/cases/view/30195 |
| SBR-NAV-03 | C30197 | version-pin | SBR | The nav entry fits the full Sales By Representative label; n | https://shopview.testrail.io/index.php?/cases/view/30197 |
| SBR-PERM-01 | C30198 | version-pin | SBR | Sales By Representative is visible to anyone who sees anothe | https://shopview.testrail.io/index.php?/cases/view/30198 |
| SBR-PERM-02 | C30199 | version-pin | SBR | Without Reports access: no navigation, no export menu, no Ex | https://shopview.testrail.io/index.php?/cases/view/30199 |
| SBR-PERM-03 | C30200 | version-pin | SBR | Without staff-administration access the deactivation flow is | https://shopview.testrail.io/index.php?/cases/view/30200 |
| SBR-PERS-01 | C30271 | version-pin | SBR | All filter and view settings are restored before the first d | https://shopview.testrail.io/index.php?/cases/view/30271 |
| SBR-PERS-02 | C30272 | version-pin | SBR | Expansion state and scroll position are not remembered and r | https://shopview.testrail.io/index.php?/cases/view/30272 |
| SBR-PERS-03 | C30273 | version-pin | SBR | A stale saved value falls back to its default and never erro | https://shopview.testrail.io/index.php?/cases/view/30273 |
| SBR-PERS-04 | C30274 | content-rewrite | SBR | First visit or cleared storage yields all defaults; no serve | https://shopview.testrail.io/index.php?/cases/view/30274 |
| SBR-PERS-05 | C30275 | version-pin | SBR | The A to Z default is its own saved value | https://shopview.testrail.io/index.php?/cases/view/30275 |
| SBR-ROW-01 | C30217 | version-pin | SBR | A rep row appears only when the rep has a matching non-rever | https://shopview.testrail.io/index.php?/cases/view/30217 |
| SBR-ROW-03 | C30219 | version-pin | SBR | A toggled-off or deleted contributor still appears; tagged ( | https://shopview.testrail.io/index.php?/cases/view/30219 |
| SBR-SORT-02 | C30242 | version-pin | SBR | Default order is plain A to Z by display name, case-insensit | https://shopview.testrail.io/index.php?/cases/view/30242 |
| SBR-SORT-03 | C30243 | version-pin | SBR | First header click sorts ascending; second descending; no th | https://shopview.testrail.io/index.php?/cases/view/30243 |
| SBR-SORT-04 | C30244 | version-pin | SBR | Sorting reorders rep rows only; Unassigned stays pinned on t | https://shopview.testrail.io/index.php?/cases/view/30244 |
| SBR-SORT-05 | C30245 | version-pin | SBR | Ties keep the A to Z order and an em-dash Margin % sorts as  | https://shopview.testrail.io/index.php?/cases/view/30245 |
| SBR-STAT-01 | C30208 | version-pin | SBR | Invoice Status offers exactly four options; All Statuses is  | https://shopview.testrail.io/index.php?/cases/view/30208 |
| SBR-STAT-02 | C30209 | version-pin | SBR | Status filtering matches on the mapped display value | https://shopview.testrail.io/index.php?/cases/view/30209 |
| SBR-STAT-04 | C30211 | version-pin | SBR | Filters compose: a rep appears only with an invoice matching | https://shopview.testrail.io/index.php?/cases/view/30211 |
| SBR-STAT-05 | C30212 | version-pin | SBR | Money columns always show invoiced amounts, never the outsta | https://shopview.testrail.io/index.php?/cases/view/30212 |
| SBR-STATE-01 | C30298 | version-pin | SBR | Empty state: verbatim message, no grand Totals, toolbar stay | https://shopview.testrail.io/index.php?/cases/view/30298 |
| SBR-STATE-03 | C30300 | version-pin | SBR | Loading shows a centered spinner over the data area and hide | https://shopview.testrail.io/index.php?/cases/view/30300 |
| SBR-STATE-04 | C30301 | version-pin | SBR | A load failure shows the inline could-not-load message with  | https://shopview.testrail.io/index.php?/cases/view/30301 |
| SBR-TOT-01 | C30237 | version-pin | SBR | Subtotal: rightmost, pinned right, bold everywhere; header r | https://shopview.testrail.io/index.php?/cases/view/30237 |
| SBR-TOT-02 | C30238 | version-pin | SBR | Desktop Totals row merges the identifier columns and sticks  | https://shopview.testrail.io/index.php?/cases/view/30238 |
| SBR-TOT-03 | C30239 | version-pin | SBR | Mobile shows a simplified totals bar below the table; Subtot | https://shopview.testrail.io/index.php?/cases/view/30239 |
| SBR-TREE-06 | C30222 | version-pin | SBR | The header chevron expands every visible rep and its glyph t | https://shopview.testrail.io/index.php?/cases/view/30222 |
| SBR-TREE-07 | C30223 | version-pin | SBR | Each invoice appears under exactly one rep or the Unassigned | https://shopview.testrail.io/index.php?/cases/view/30223 |
| SBR-TREE-08 | C30224 | version-pin | SBR | Expansion survives filter and sort changes within the sessio | https://shopview.testrail.io/index.php?/cases/view/30224 |
| SBR-TREE-09 | C30225 | version-pin | SBR | Detail rows run newest first with a numeric invoice-number t | https://shopview.testrail.io/index.php?/cases/view/30225 |
| SBR-TYPE-02 | C30206 | version-pin | SBR | Product Type: three options, Parts & Service default, each o | https://shopview.testrail.io/index.php?/cases/view/30206 |
| SBR-UNAS-01 | C30261 | version-pin | SBR | Show Unassigned sits between the column selector and the dat | https://shopview.testrail.io/index.php?/cases/view/30261 |
| SBR-UNAS-02 | C30262 | version-pin | SBR | Show Unassigned adds one top-pinned Unassigned row that acts | https://shopview.testrail.io/index.php?/cases/view/30262 |
| SBR-UNAS-04 | C30264 | version-pin | SBR | No empty Unassigned row is ever rendered | https://shopview.testrail.io/index.php?/cases/view/30264 |
| SBR-VIS-01 | C30305 | version-pin | SBR | Layout: white toolbar; blue-grey page; separator; edge-to-ed | https://shopview.testrail.io/index.php?/cases/view/30305 |
| SBR-VIS-03 | C30307 | version-pin | SBR | Every icon-only control carries its specified accessible nam | https://shopview.testrail.io/index.php?/cases/view/30307 |
| SBR-VIS-04 | C30308 | version-pin | SBR | Chevrons and sortable headers are keyboard-operable and expo | https://shopview.testrail.io/index.php?/cases/view/30308 |
| SBR-WO-01 | C30310 | version-pin | SBR | Sales Representative selector shows on WO and Part Sale, not | https://shopview.testrail.io/index.php?/cases/view/30310 |
| SBR-WO-02 | C30311 | version-pin | SBR | Selector offers only reps whose sales-representative toggle  | https://shopview.testrail.io/index.php?/cases/view/30311 |
| SBR-WO-03 | C30312 | version-pin | SBR | A new WO opens with Sales Representative unassigned; a chang | https://shopview.testrail.io/index.php?/cases/view/30312 |
| SBR-WO-04 | C30313 | version-pin | SBR | The Sales Representative selector is read-only when Invoiced | https://shopview.testrail.io/index.php?/cases/view/30313 |
| SBR-WO-05 | C30314 | version-pin | SBR | Invoice credit snapshot: WO rep, else customer rep, else una | https://shopview.testrail.io/index.php?/cases/view/30314 |
| SBR-WO-06 | C30315 | version-pin | SBR | Customer record shows a "Sales Representative" row; "Unassig | https://shopview.testrail.io/index.php?/cases/view/30315 |
| TU-API-01 | C30449 | version-pin | TU | The per-day breakdown is fetched only when a technician row  | https://shopview.testrail.io/index.php?/cases/view/30449 |
| TU-API-02 | C30450 | version-pin | TU | Date-range and location changes trigger a fresh server load | https://shopview.testrail.io/index.php?/cases/view/30450 |
| TU-COL-01 | C38859 | version-pin | TU | Column Selection: Technician always on, the other five toggl | https://shopview.testrail.io/index.php?/cases/view/38859 |
| TU-DAY-01 | C30418 | version-pin | TU | Each technician row has an accessible expand/collapse contro | https://shopview.testrail.io/index.php?/cases/view/30418 |
| TU-DAY-02 | C30419 | version-pin | TU | Expanding shows one row per clocked day in date order, loade | https://shopview.testrail.io/index.php?/cases/view/30419 |
| TU-DAY-03 | C30420 | version-pin | TU | Day rows use the same columns and formats as the technician  | https://shopview.testrail.io/index.php?/cases/view/30420 |
| TU-DAY-04 | C30421 | version-pin | TU | One control in the table header expands or collapses all tec | https://shopview.testrail.io/index.php?/cases/view/30421 |
| TU-DAY-05 | C30422 | version-pin | TU | Expansion state is view-only: it resets on any reload and fr | https://shopview.testrail.io/index.php?/cases/view/30422 |
| TU-ELL-01 | C30404 | version-pin | TU | Est. Lost Labor values internal hours at each location's def | https://shopview.testrail.io/index.php?/cases/view/30404 |
| TU-ELL-02 | C30405 | version-pin | TU | Est. Lost Labor, when shown, is pinned right and bold with t | https://shopview.testrail.io/index.php?/cases/view/30405 |
| TU-ELL-03 | C30406 | version-pin | TU | Zero internal hours - or a configured $0.00 rate - shows $0. | https://shopview.testrail.io/index.php?/cases/view/30406 |
| TU-ELL-04 | C30407 | version-pin | TU | Internal hours with no default labor rate anywhere show an e | https://shopview.testrail.io/index.php?/cases/view/30407 |
| TU-ELL-05 | C30408 | version-pin | TU | Internal hours split across rated and unrated locations show | https://shopview.testrail.io/index.php?/cases/view/30408 |
| TU-EXP-01 | C30434 | version-pin | TU | Three-dot menu is leftmost, then Column Selection; four down | https://shopview.testrail.io/index.php?/cases/view/30434 |
| TU-EXP-02 | C30435 | version-pin | TU | The Summary PDF holds the technician rows plus the Summary | https://shopview.testrail.io/index.php?/cases/view/30435 |
| TU-EXP-03 | C30436 | version-pin | TU | The CSV is always summary-level, quotes comma-containing val | https://shopview.testrail.io/index.php?/cases/view/30436 |
| TU-EXP-04 | C30437 | version-pin | TU | Downloads cover only selected technicians, locations, and da | https://shopview.testrail.io/index.php?/cases/view/30437 |
| TU-EXP-05 | C30438 | version-pin | TU | Downloads always order rows Technician A to Z; the on-screen | https://shopview.testrail.io/index.php?/cases/view/30438 |
| TU-EXP-06 | C30439 | version-pin | TU | PDF logo follows the uploaded logo; the spreadsheet never ca | https://shopview.testrail.io/index.php?/cases/view/30439 |
| TU-EXP-07 | C30440 | version-pin | TU | Choosing a download with no technician selected is a silent  | https://shopview.testrail.io/index.php?/cases/view/30440 |
| TU-EXP-08 | C30441 | version-pin | TU | A starting download notifies; a failed one shows the failure | https://shopview.testrail.io/index.php?/cases/view/30441 |
| TU-EXP-09 | C38887 | version-pin | TU | An over-cap Technician Utilization export is refused with th | https://shopview.testrail.io/index.php?/cases/view/38887 |
| TU-EXP-10 | C43552 | version-pin | TU | Both spreadsheet downloads hold the summary rows and no per- | https://shopview.testrail.io/index.php?/cases/view/43552 |
| TU-HRS-02 | C30401 | version-pin | TU | Headers in fixed order; Total, WO and Internal Hours show cl | https://shopview.testrail.io/index.php?/cases/view/30401 |
| TU-HRS-03 | C30402 | version-pin | TU | Utilization % is WO hours over total hours from unrounded va | https://shopview.testrail.io/index.php?/cases/view/30402 |
| TU-HRS-04 | C30403 | version-pin | TU | A technician with only internal hours shows 0.0% utilization | https://shopview.testrail.io/index.php?/cases/view/30403 |
| TU-LINK-01 | C30428 | content-rewrite | TU | Total Hours is a real link with a non-color affordance and k | https://shopview.testrail.io/index.php?/cases/view/30428 |
| TU-LINK-02 | C30429 | version-pin | TU | The Total Hours link opens Timesheet Activities in the same  | https://shopview.testrail.io/index.php?/cases/view/30429 |
| TU-LINK-03 | C30430 | version-pin | TU | Same range, single location, closed records: Total Hours mat | https://shopview.testrail.io/index.php?/cases/view/30430 |
| TU-LINK-04 | C30431 | version-pin | TU | Reconcile exception (a): an open clock is snapshotted at eac | https://shopview.testrail.io/index.php?/cases/view/30431 |
| TU-LINK-05 | C30432 | content-rewrite | TU | Reconciliation exception (b): the link passes no location | https://shopview.testrail.io/index.php?/cases/view/30432 |
| TU-LINK-06 | C30433 | content-rewrite | TU | A day row's Total Hours links to that technician's single-da | https://shopview.testrail.io/index.php?/cases/view/30433 |
| TU-LOC-01 | C30442 | version-pin | TU | The Location filter is the rightmost multi-select; All Locat | https://shopview.testrail.io/index.php?/cases/view/30442 |
| TU-LOC-02 | C30443 | version-pin | TU | Location changes reload with hours pooled into one row per t | https://shopview.testrail.io/index.php?/cases/view/30443 |
| TU-LOC-03 | C30444 | version-pin | TU | The saved location selection restores defensively; bad ones  | https://shopview.testrail.io/index.php?/cases/view/30444 |
| TU-LOC-05 | C30446 | version-pin | TU | Technician Utilization: Location filter hidden for a one-loc | https://shopview.testrail.io/index.php?/cases/view/30446 |
| TU-LOC-06 | C38915 | version-pin | TU | Location column: leftmost for a multi-location user; Summary | https://shopview.testrail.io/index.php?/cases/view/38915 |
| TU-NAV-01 | C30392 | version-pin | TU | Technician Utilization sits under Performance, below existin | https://shopview.testrail.io/index.php?/cases/view/30392 |
| TU-NAV-02 | C30393 | version-pin | TU | One row per technician who clocked time in the range at thos | https://shopview.testrail.io/index.php?/cases/view/30393 |
| TU-NAV-03 | C30394 | version-pin | TU | First visit defaults to the This Month preset and the user's | https://shopview.testrail.io/index.php?/cases/view/30394 |
| TU-NAV-04 | C30395 | version-pin | TU | Changing the date range reloads the rows; a Custom range is  | https://shopview.testrail.io/index.php?/cases/view/30395 |
| TU-NAV-05 | C30396 | version-pin | TU | The loading indicator shows on load and reload; rows swap on | https://shopview.testrail.io/index.php?/cases/view/30396 |
| TU-NAV-06 | C30397 | version-pin | TU | All clock records are day-grouped and windowed in one report | https://shopview.testrail.io/index.php?/cases/view/30397 |
| TU-NAV-07 | C30398 | version-pin | TU | Without reports access Technician Utilization is hidden | https://shopview.testrail.io/index.php?/cases/view/30398 |
| TU-NAV-08 | C30399 | version-pin | TU | Standard no-data message when no time in scope or all techni | https://shopview.testrail.io/index.php?/cases/view/30399 |
| TU-SORT-01 | C30409 | version-pin | TU | On load rows sort by Technician A to Z with the ascending in | https://shopview.testrail.io/index.php?/cases/view/30409 |
| TU-SORT-02 | C30410 | version-pin | TU | All six columns sort on screen: ascending first, toggling wi | https://shopview.testrail.io/index.php?/cases/view/30410 |
| TU-SORT-03 | C30411 | version-pin | TU | A data reload resets the sort to Technician A to Z | https://shopview.testrail.io/index.php?/cases/view/30411 |
| TU-SORT-04 | C30412 | version-pin | TU | Sorting reorders only the technician rows | https://shopview.testrail.io/index.php?/cases/view/30412 |
| TU-SORT-05 | C30413 | version-pin | TU | Sorting Est. Lost Labor keeps em-dash rows last both ways; $ | https://shopview.testrail.io/index.php?/cases/view/30413 |
| TU-SUM-01 | C30414 | version-pin | TU | A pinned Summary row labeled Summary sits at the bottom, sta | https://shopview.testrail.io/index.php?/cases/view/30414 |
| TU-SUM-02 | C30415 | version-pin | TU | Summary totals visible technicians from unrounded hours; 0.0 | https://shopview.testrail.io/index.php?/cases/view/30415 |
| TU-SUM-03 | C30416 | version-pin | TU | Summary Utilization % is the weighted rate; not an average o | https://shopview.testrail.io/index.php?/cases/view/30416 |
| TU-SUM-04 | C30417 | version-pin | TU | Summary Est. Lost Labor sums rated contributions; em-dash on | https://shopview.testrail.io/index.php?/cases/view/30417 |
| TU-TECH-01 | C30423 | version-pin | TU | Filter by Technician starts with every technician selected o | https://shopview.testrail.io/index.php?/cases/view/30423 |
| TU-TECH-02 | C30424 | version-pin | TU | Deselecting a technician hides the row and recalculates the  | https://shopview.testrail.io/index.php?/cases/view/30424 |
| TU-TECH-03 | C30425 | version-pin | TU | All technicians and Clear all controls set every technician  | https://shopview.testrail.io/index.php?/cases/view/30425 |
| TU-TECH-04 | C30426 | version-pin | TU | Previously deselected technicians stay deselected on the nex | https://shopview.testrail.io/index.php?/cases/view/30426 |
| TU-VIS-01 | C30447 | version-pin | TU | All-white table with no row shading; toolbar controls in the | https://shopview.testrail.io/index.php?/cases/view/30447 |
| TU-VIS-02 | C30448 | version-pin | TU | Dark mode keeps every report element legible | https://shopview.testrail.io/index.php?/cases/view/30448 |
| WIP-API-01 | C30528 | version-pin | WIP | Nightly snapshot records one row per then-open job per calen | https://shopview.testrail.io/index.php?/cases/view/30528 |
| WIP-API-03 | C30530 | version-pin | WIP | Captured Earned and Remaining use the same maths as the on-s | https://shopview.testrail.io/index.php?/cases/view/30530 |
| WIP-API-04 | C30531 | version-pin | WIP | Nightly snapshot spans every location with no user location  | https://shopview.testrail.io/index.php?/cases/view/30531 |
| WIP-API-06 | C30533 | version-pin | WIP | Nightly snapshot: a job with nothing approved is captured at | https://shopview.testrail.io/index.php?/cases/view/30533 |
| WIP-CALC-01 | C30474 | version-pin | WIP | Money columns show US dollars to two decimals with thousands | https://shopview.testrail.io/index.php?/cases/view/30474 |
| WIP-CALC-02 | C30475 | version-pin | WIP | Labor Earned is the clocked share of each approved line's qu | https://shopview.testrail.io/index.php?/cases/view/30475 |
| WIP-CALC-03 | C30476 | version-pin | WIP | Labor Remaining is the approved labor's quoted value minus L | https://shopview.testrail.io/index.php?/cases/view/30476 |
| WIP-CALC-04 | C30477 | version-pin | WIP | Parts Earned is the sell value of approved-line parts alread | https://shopview.testrail.io/index.php?/cases/view/30477 |
| WIP-CALC-05 | C30478 | version-pin | WIP | Parts Remaining values the not-yet-received quantity at its  | https://shopview.testrail.io/index.php?/cases/view/30478 |
| WIP-CALC-06 | C30479 | content-rewrite | WIP | Earned + Remaining make Total; not the WO's grand total | https://shopview.testrail.io/index.php?/cases/view/30479 |
| WIP-CALC-07 | C30480 | version-pin | WIP | Lines that are not yet approved contribute nothing to any mo | https://shopview.testrail.io/index.php?/cases/view/30480 |
| WIP-CALC-09 | C30482 | version-pin | WIP | An open estimate with no approved work shows $0.00 in every  | https://shopview.testrail.io/index.php?/cases/view/30482 |
| WIP-CALC-10 | C38890 | version-pin | WIP | A technician still clocked in counts toward Labor Earned, ca | https://shopview.testrail.io/index.php?/cases/view/38890 |
| WIP-CALC-11 | C43592 | version-pin | WIP | A fixed-price line is valued at its fixed amount, not at pic | https://shopview.testrail.io/index.php?/cases/view/43592 |
| WIP-CALC-12 | C43593 | version-pin | WIP | A fixed-price line with no invoiced hours earns all at once  | https://shopview.testrail.io/index.php?/cases/view/43593 |
| WIP-CALC-13 | C43594 | version-pin | WIP | Core charges count in parts value and a core decision never  | https://shopview.testrail.io/index.php?/cases/view/43594 |
| WIP-COL-03 | C30468 | version-pin | WIP | The WO # is a link that opens the WO in the same browser tab | https://shopview.testrail.io/index.php?/cases/view/30468 |
| WIP-COL-04 | C30469 | version-pin | WIP | Status shows as a color-coded badge whose label text is alwa | https://shopview.testrail.io/index.php?/cases/view/30469 |
| WIP-COL-06 | C30471 | version-pin | WIP | Customer shows the customer's company name | https://shopview.testrail.io/index.php?/cases/view/30471 |
| WIP-COL-07 | C30472 | version-pin | WIP | Days Open shows whole days since creation and reads 0 days / | https://shopview.testrail.io/index.php?/cases/view/30472 |
| WIP-COL-08 | C30473 | version-pin | WIP | Last Activity shows Today; Xd ago; or an em-dash when there  | https://shopview.testrail.io/index.php?/cases/view/30473 |
| WIP-EXP-01 | C30510 | version-pin | WIP | Work In Progress: a three-dot menu holds Download (PDF) and  | https://shopview.testrail.io/index.php?/cases/view/30510 |
| WIP-EXP-05 | C30514 | version-pin | WIP | Days Open in a download is frozen at the moment the file is  | https://shopview.testrail.io/index.php?/cases/view/30514 |
| WIP-EXP-06 | C30515 | version-pin | WIP | The downloaded files are named "wip-2-report.pdf" and "wip-2 | https://shopview.testrail.io/index.php?/cases/view/30515 |
| WIP-EXP-07 | C30516 | version-pin | WIP | Export headers read "Unit" and "Branch" — documented limitat | https://shopview.testrail.io/index.php?/cases/view/30516 |
| WIP-EXP-08 | C30517 | version-pin | WIP | The PDF shows the shop logo at the top when one is set | https://shopview.testrail.io/index.php?/cases/view/30517 |
| WIP-EXP-09 | C30518 | version-pin | WIP | Export notifications: success caption, "Empty export" warnin | https://shopview.testrail.io/index.php?/cases/view/30518 |
| WIP-FLT-01 | C30498 | version-pin | WIP | The Advisor filter lists the advisors in the loaded jobs; sc | https://shopview.testrail.io/index.php?/cases/view/30498 |
| WIP-FLT-02 | C30499 | version-pin | WIP | Customer filter is a type-ahead multi-select reading "All cu | https://shopview.testrail.io/index.php?/cases/view/30499 |
| WIP-FLT-03 | C30500 | version-pin | WIP | Asset filter shows Unit # and VIN and matches text against e | https://shopview.testrail.io/index.php?/cases/view/30500 |
| WIP-FLT-06 | C30503 | version-pin | WIP | Location filter: rightmost multi-select with All locations,  | https://shopview.testrail.io/index.php?/cases/view/30503 |
| WIP-FLT-07 | C30504 | version-pin | WIP | The location scope never includes an inaccessible location | https://shopview.testrail.io/index.php?/cases/view/30504 |
| WIP-FLT-08 | C30505 | version-pin | WIP | Advisor, customer and asset filters AND together and recompu | https://shopview.testrail.io/index.php?/cases/view/30505 |
| WIP-FLT-09 | C38916 | version-pin | WIP | Location column names each work order's location and never r | https://shopview.testrail.io/index.php?/cases/view/38916 |
| WIP-PERM-01 | C30526 | version-pin | WIP | Ordinary reports access covers opening and downloading Work  | https://shopview.testrail.io/index.php?/cases/view/30526 |
| WIP-PERM-02 | C30527 | version-pin | WIP | Without reports access Work In Progress is absent from the n | https://shopview.testrail.io/index.php?/cases/view/30527 |
| WIP-PERS-01 | C30506 | version-pin | WIP | Column Selection toggles columns; Total is not offered at al | https://shopview.testrail.io/index.php?/cases/view/30506 |
| WIP-PERS-04 | C30509 | version-pin | WIP | A saved setting that is no longer valid falls back to its de | https://shopview.testrail.io/index.php?/cases/view/30509 |
| WIP-SORT-01 | C30483 | version-pin | WIP | The initial sort is Days Open with the longest-open work ord | https://shopview.testrail.io/index.php?/cases/view/30483 |
| WIP-SORT-02 | C30484 | version-pin | WIP | Clicking a header sorts ascending, clicking again toggles de | https://shopview.testrail.io/index.php?/cases/view/30484 |
| WIP-SORT-03 | C30485 | version-pin | WIP | Columns sort by their underlying values; Asset sorts by the  | https://shopview.testrail.io/index.php?/cases/view/30485 |
| WIP-SORT-04 | C30486 | version-pin | WIP | Sorting reorders only the active tab's rows; Totals stays at | https://shopview.testrail.io/index.php?/cases/view/30486 |
| WIP-SUM-01 | C30487 | version-pin | WIP | The summary strip shows seven figures in a fixed order as US | https://shopview.testrail.io/index.php?/cases/view/30487 |
| WIP-SUM-02 | C30488 | version-pin | WIP | Total Earned is the hero figure and equals the started-stage | https://shopview.testrail.io/index.php?/cases/view/30488 |
| WIP-SUM-03 | C30489 | version-pin | WIP | Total Remaining equals Not Started plus Started — Remaining | https://shopview.testrail.io/index.php?/cases/view/30489 |
| WIP-SUM-04 | C30490 | version-pin | WIP | Each per-stage figure equals the matching tab's money total | https://shopview.testrail.io/index.php?/cases/view/30490 |
| WIP-SUM-05 | C30491 | version-pin | WIP | The Estimates figure is the Estimates tab's total quoted val | https://shopview.testrail.io/index.php?/cases/view/30491 |
| WIP-TAB-01 | C30451 | version-pin | WIP | Work In Progress appears in the reports navigation under the | https://shopview.testrail.io/index.php?/cases/view/30451 |
| WIP-TAB-02 | C30452 | version-pin | WIP | Four tabs in a fixed order with the partially-completed tab  | https://shopview.testrail.io/index.php?/cases/view/30452 |
| WIP-TAB-05 | C30455 | version-pin | WIP | There is no Trend / over-time tab or chart | https://shopview.testrail.io/index.php?/cases/view/30455 |
| WIP-TOT-01 | C30494 | version-pin | WIP | Each tab has a Totals row pinned to the bottom, labeled "Tot | https://shopview.testrail.io/index.php?/cases/view/30494 |
| WIP-VIS-01 | C30519 | version-pin | WIP | Each tab uses an all-white table with no alternating row sha | https://shopview.testrail.io/index.php?/cases/view/30519 |
| WIP-VIS-02 | C30520 | version-pin | WIP | The summary strip is a bold band ruled top and bottom above  | https://shopview.testrail.io/index.php?/cases/view/30520 |
| WIP-VIS-03 | C30521 | version-pin | WIP | The Total column is bold and stays pinned right on sideways  | https://shopview.testrail.io/index.php?/cases/view/30521 |
| WIP-VIS-04 | C30522 | version-pin | WIP | The Totals row stays visible while only the active tab's bod | https://shopview.testrail.io/index.php?/cases/view/30522 |
| WIP-VIS-05 | C30523 | version-pin | WIP | The WO # link is keyboard-focusable and opens the work order | https://shopview.testrail.io/index.php?/cases/view/30523 |
| WIP-VIS-06 | C30524 | version-pin | WIP | Each summary figure's info icon is keyboard-reachable and sc | https://shopview.testrail.io/index.php?/cases/view/30524 |
