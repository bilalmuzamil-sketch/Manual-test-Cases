#!/usr/bin/env python3
"""Report Suite — apply the USER-AUTHORIZED 2026-07-28 sense-check FIX-WORDING
repairs (9 cases) + the merge/cut consolidation (41 merge groups absorbing 50
members, 6 cuts, + the SBC-EXP-13 Print retire) to the LOCAL case source.

Sources of truth:
  - quality-audit-2026-07-28/SENSE-CHECK-2026-07-28.md (the 9 repairs)
  - quality-audit-2026-07-28/MERGE-PLAN.md (41 groups + 6 cuts)
  - reconciliation-2026-07-28/video-promotion-edit-log-2026-07-28.md (SBC-EXP-13)

What it does (LOCAL ONLY — the TestRail push is executed separately):
  1. Backs up every touched case's verbatim pre-edit body to
     build/report-suite/consolidation-backup-2026-07-28/ (+ MANIFEST.md).
  2. Applies the 9 FIX-WORDING repairs.
  3. Rewrites each of the 41 survivors folding in the members' distinct content
     (steps/expected additions, spec_ref union per Rule 20, ≤80-char titles).
  4. Marks the 50 merged-away members + 6 cuts + SBC-EXP-13 as Retired locally
     (bodies KEPT — never lost).

Survivor priorities/types are deliberately NOT changed (the merge plan does not
prescribe priority changes; noted in the manifest).
"""
import json, glob, os, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))            # reconciliation-2026-07-28
RS = os.path.dirname(HERE)                                   # build/report-suite
CASES = os.path.join(RS, "cases")
BK = os.path.join(RS, "consolidation-backup-2026-07-28")

# ---------------------------------------------------------------- merge plan
GROUPS = {
 "G-SBC-NAV": ("SBC-NAV-01", ["SBC-NAV-02"]),
 "G-SBC-DEFAULTS": ("SBC-PERS-05", ["SBC-DATE-02", "SBC-LOC-02"]),
 "G-SBC-TYPE": ("SBC-TYPE-02", ["SBC-TYPE-01", "SBC-TYPE-03"]),
 "G-SBC-ALLCUST": ("SBC-CUST-04", ["SBC-CUST-08"]),
 "G-SBC-CLEARALL": ("SBC-CUST-03", ["SBC-CUST-07"]),
 "G-SBC-EXPAND": ("SBC-TREE-03", ["SBC-TREE-07"]),
 "G-SBC-LBL": ("SBC-LBL-01", ["SBC-LBL-02", "SBC-LBL-03"]),
 "G-SBC-SORTSCOPE": ("SBC-SORT-01", ["SBC-SORT-05"]),
 "G-SBC-SORTRELOAD": ("SBC-TREE-09", ["SBC-SORT-06"]),
 "G-SBC-COLBOUNDS": ("SBC-COL-02", ["SBC-COL-03"]),
 "G-SBC-EXPNAME": ("SBC-EXP-02", ["SBC-EXP-07"]),
 "G-SBC-EXPTOAST": ("SBC-EXP-06", ["SBC-EXP-12"]),
 "G-SBC-EMPTYSEL": ("SBC-EMPTY-01", ["SBC-EMPTY-03"]),
 "G-SBR-NAV": ("SBR-NAV-01", ["SBR-NAV-02"]),
 "G-SBR-DEFAULTS": ("SBR-PERS-04", ["SBR-DATE-03", "SBR-LOC-02"]),
 "G-SBR-TYPE": ("SBR-TYPE-02", ["SBR-TYPE-01"]),
 "G-SBR-GATE": ("SBR-STAT-04", ["SBR-TYPE-03", "SBR-STAT-03"]),
 "G-SBR-ROWLAYOUT": ("SBR-ROW-02", ["SBR-ROW-04"]),
 "G-SBR-BADGE": ("SBR-BADGE-01", ["SBR-BADGE-03"]),
 "G-SBR-CALCZERO": ("SBR-CALC-02", ["SBR-CALC-04"]),
 "G-SBR-STICKY": ("SBR-TOT-01", ["SBR-TOT-04"]),
 "G-SBR-LINKS": ("SBR-LINK-01", ["SBR-LINK-02"]),
 "G-SBR-NODIALOG": ("SBR-DEACT-07", ["SBR-DEACT-01"]),
 "G-SBR-UNASROW": ("SBR-UNAS-02", ["SBR-UNAS-03"]),
 "G-SBR-COLSEL": ("SBR-COL-01", ["SBR-COL-02", "SBR-COL-06"]),
 "G-SBR-EMPTYBAR": ("SBR-STATE-01", ["SBR-STATE-02"]),
 "G-PV-TYPE": ("PV-FILT-01", ["PV-FILT-02"]),
 "G-PV-EXPTOAST": ("PV-EXP-10", ["PV-EXP-09"]),
 "G-TU-COLS": ("TU-HRS-02", ["TU-HRS-01"]),
 "G-TU-EMPTY": ("TU-NAV-08", ["TU-TECH-05"]),
 "G-WIP-NAV": ("WIP-TAB-01", ["WIP-TAB-04"]),
 "G-WIP-EMPTY": ("WIP-SCOPE-05", ["WIP-SCOPE-06"]),
 "G-WIP-PLACE-STATUS": ("WIP-PLACE-01", ["WIP-PLACE-02"]),
 "G-WIP-PLACE-START": ("WIP-PLACE-03", ["WIP-PLACE-04"]),
 "G-WIP-RECOMPUTE": ("WIP-FLT-08", ["WIP-SUM-06", "WIP-TOT-03"]),
 "G-IV-RELOAD": ("IV-FLT-02", ["IV-NAV-04"]),
 "G-IV-EMPTY": ("IV-NAV-06", ["IV-DATE-07", "IV-LOC-05"]),
 "G-IV-SCOPE": ("IV-SCOPE-01", ["IV-SCOPE-03", "IV-SCOPE-04"]),
 "G-IV-TOTFILTER": ("IV-TOT-02", ["IV-TOT-04"]),
 "G-IV-EXPTOAST": ("IV-EXP-09", ["IV-EXP-08"]),
 "G-IV-TOTSTICKY": ("IV-TOT-01", ["IV-VIS-03"]),
}
CUTS = {
 "SBC-SORT-07": "CUT per usefulness+sense audit (no-op assertion)",
 "SBR-SORT-06": "CUT per usefulness+sense audit (no-op assertion)",
 "SBR-EXP-09": "CUT per usefulness+sense audit (px font-tier edge minutiae, not manually testable)",
 "PV-COL-07": "CUT per usefulness+sense audit (stale-schema seeding not executable manually)",
 "WIP-TOT-04": "CUT per usefulness audit (duplicate of the merged WIP empty-state case)",
 "IV-TOT-05": "CUT per usefulness audit (duplicate of the merged IV no-data case)",
}
PRINT_RETIRE = "SBC-EXP-13"

MERGE_NOTE = ("MERGED 2026-07-28 (user-authorized consolidation, MERGE-PLAN "
              "{g}): absorbed {members}. Members retired locally + deleted "
              "from TestRail; bodies kept in cases/ marked Retired.")

# --------------------------------------------------- full new survivor bodies
# Only the listed fields change; everything else keeps the survivor's values.
E = {}

E["SBC-NAV-01"] = dict(
 title='Sales By Customer appears in Reports navigation and opens with correct titles',
 steps=[
  "1. Open the Reports area from the main navigation.",
  "2. Look through the Reports left-side navigation for the report entry.",
  '3. Click the "Sales By Customer" entry.',
  "4. Read the page title at the top of the report and the browser tab's title.",
 ],
 expected=[
  '1. "Sales By Customer" is listed in the Reports left-side navigation.',
  "2. Clicking it opens the Sales By Customer report in the main content area.",
  '3. The page title reads "Sales By Customer."',
  '4. The browser tab title reads "Sales By Customer - Report | ShopView".',
 ],
 spec_ref="specs/sbc-sales-by-customer.md Story 1 S1-R1; S1-R3; S1-R4",
)

E["SBC-PERS-05"] = dict(
 preconditions=[
  "1. Clear the browser's site data for the application (or use a fresh browser profile).",
  "2. You open the report by its plain address with no date range in the page link.",
  "3. You are working in a known active location (check the application's location switcher).",
 ],
 expected=[
  "1. Date range = This Month (nothing saved and no range in the page link).",
  '2. Product Type = "Parts & Service."',
  "3. Location = the single location you are currently working in (your active location) — not all locations.",
  '4. Customer filter = all customers selected (label "All customers").',
  "5. Sort = Customer name ascending.",
  "6. All nine toggleable columns visible.",
 ],
 spec_ref="specs/sbc-sales-by-customer.md Story 6 S6-N1; Story 2 S2-R5; Story 4 S4-R4",
)

E["SBC-TYPE-02"] = dict(
 title="Product Type: three options with Parts & Service default; S/P prefix filtering",
 preconditions=[
  "1. You are on the Sales By Customer report with no saved view (first visit or cleared browser storage), so the first-load default can be read.",
  "2. The date range contains at least one service invoice (number starting with S) and one parts invoice (number starting with P) — seed ZZAUTOTEST data if needed.",
 ],
 steps=[
  '1. Find the "Product Type" dropdown in the report toolbar; read its value before touching it, then open it and read the options in order.',
  '2. Set Product Type to "Service only," expand a customer down to invoice rows, and read the invoice numbers.',
  '3. Set Product Type to "Parts only" and read the invoice numbers again.',
  '4. Set Product Type back to "Parts & Service."',
 ],
 expected=[
  '1. The dropdown offers exactly three options, in this order: "Parts & Service," "Parts only," "Service only" — with "Parts & Service" selected by default on first load.',
  '2. Under "Service only," every invoice shown has a number starting with S; parts invoices are gone and all counts/totals reflect only S invoices.',
  '3. Under "Parts only," every invoice shown has a number starting with P; service invoices are gone and all counts/totals reflect only P invoices.',
  '4. With "Parts & Service" selected, no product-type filter is applied — both S and P invoices are included and counts/totals cover both.',
  "5. The whole invoice is classified by its number prefix — there is no per-line-item split.",
 ],
 spec_ref="specs/sbc-sales-by-customer.md Story 3 S3-R1; S3-R2; S3-R3; S3-R4; S3-R5; S3-R6",
)

E["SBC-CUST-04"] = dict(
 preconditions=[
  "1. Your browser has no saved view for this report.",
  "2. Several customers have invoices in the default date range.",
  "3. A customer exists that has invoices ONLY in a wider date range than the current one (seed a ZZAUTOTEST invoice dated last month if needed).",
 ],
 steps=[
  "1. Open the Sales By Customer report.",
  "2. Read the Customer filter's collapsed label.",
  "3. Check the customer rows shown.",
  "4. Widen the date range so the customer with no matching invoices now has one; re-check the label and the rows.",
 ],
 expected=[
  '1. The Customer filter\'s collapsed label reads "All customers."',
  "2. The report shows every customer matching the other active filters.",
  "3. The all-customers state is an explicit state — while it is active, any customer that appears later (new data) is included automatically.",
  '4. After the filter change the filter stays in the all-customers state (label still "All customers") and every customer matching the new filters is included — including the newly-appearing one, with no manual re-selection.',
 ],
 spec_ref="specs/sbc-sales-by-customer.md Story 18 S18-R4; S18-R5; S18-R9; S18-E1",
)

E["SBC-CUST-03"] = dict(
 title="Pinned control toggles All customers and Clear all; clearing shows empty state",
 steps=[
  "1. Open the Customer filter while it is in the all-customers state and read the pinned control at the top of the dropdown.",
  '2. Activate it ("Clear all") and read the table body, the totals row, and the filter\'s collapsed label.',
  "3. Read the pinned control again and activate it once more.",
 ],
 expected=[
  '1. In the all-customers state the pinned control reads "Clear all"; activating it clears the selection to an empty set.',
  '2. When the filter is NOT in the all-customers state the pinned control reads "All customers"; activating it puts the filter back in the all-customers state.',
  "3. The control is pinned to the top of the dropdown in both states.",
  '4. After "Clear all": the report shows the empty-state message "No sales data found for the selected filters.", the totals row shows zeros, and the collapsed label reads "None."',
 ],
 spec_ref="specs/sbc-sales-by-customer.md Story 18 S18-R3; S18-N1; S17-E1",
)

E["SBC-TREE-03"] = dict(
 title="Expanding a customer reveals asset rows; chevrons toggle and are independent",
 preconditions=[
  "1. A customer in the current view has invoices on at least two different vehicles (seed ZZAUTOTEST work orders on two assets if needed).",
  "2. At least two customers with assets are in the current view.",
 ],
 steps=[
  "1. Click the chevron control on customer A's summary row and read the rows that appear beneath it.",
  "2. Expand one of customer A's assets, then expand customer B.",
  "3. Click customer A's chevron again and check customer B.",
 ],
 expected=[
  "1. The customer's asset rows appear beneath the summary row — one row per vehicle the customer's invoices were done on.",
  "2. Each asset row shows a vehicle icon, the asset label, and the asset's invoice count in parentheses.",
  "3. Each asset row shows the same financial columns as the customer row, rolled up for that asset.",
  "4. The Date cell is blank on asset rows.",
  "5. Asset rows are indented one level under the customer.",
  "6. Each chevron toggles back to collapsed on a second activation.",
  "7. Collapsing customer A does not affect customer B's expansion; each asset's expansion state is likewise independent.",
 ],
 spec_ref="specs/sbc-sales-by-customer.md Story 8 S8-R1; S8-R2; S8-R5; S8-R5a; S8-R5b; S8-R5c; S8-R15",
)

E["SBC-LBL-01"] = dict(
 title="Asset label = year make model + serial number, with missing-data fallbacks",
 preconditions=[
  "1. One customer has ZZAUTOTEST assets with invoices in range: (a) one with a serial number recorded, (b) one with no serial number, (c) one with a VIN but no year, make, or model, (d) one with no year, make, model, or VIN (blank the fields as far as the asset form allows).",
 ],
 steps=[
  "1. Expand the customer and read each asset row's label.",
 ],
 expected=[
  "1. Labels for assets that have them start with the vehicle's year, make, and model.",
  "2. Asset (a) shows its SERIAL NUMBER after the year/make/model as the identifier.",
  "3. For asset (b) (no serial number), note what the label shows instead — what stands in when the serial number is missing is confirmed in the build (the older wording used the unit number, then the plate, then the last 8 of the VIN).",
  "4. Asset (c) (no year/make/model) is labeled with the VIN on its own.",
  '5. Asset (d) (no year/make/model/VIN) is labeled "Unknown Asset."',
 ],
 spec_ref=("SV-8606 (specs/sbc-sales-by-customer.md Story 8 S8-R7; S8-R8 — identifier OVERRIDDEN to serial "
           "number by kickoff video P24 29:54-30:46, user ruling 2026-07-28; S8-R9; S8-R10 fallback rules kept)"),
 notes_append=("If the asset form will not allow a fully-blank vehicle for (d), record what minimum the form "
               "enforces and mark Blocked-Env with reason (after attempting all seeding routes per Standing "
               "Rule 14). The S8-R9 VIN-only and S8-R10 'Unknown Asset' rules are not overridden by the video "
               "— re-confirm both in the build once the serial-number identifier ships."),
)

E["SBC-SORT-01"] = dict(
 title="All columns sortable except chevron; text alphabetical, numbers by value",
 preconditions=[
  "1. Several customers with differing values are in the current view.",
  "2. A customer with multiple assets and invoices is in the view.",
 ],
 steps=[
  "1. Click each column header in turn (Customer, Date, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %, Subtotal) and watch the order change.",
  "2. Try clicking the chevron column's header position.",
  "3. Compare a text sort (Customer) and a numeric sort (Subtotal) against the values.",
  "4. Sort by Subtotal descending, expand a customer and an asset, and read the asset and invoice order.",
 ],
 expected=[
  "1. Every column is sortable except the chevron column.",
  "2. Text columns sort alphabetically; numeric columns sort by value (not as text).",
  '3. Sorting reorders only the customer summary rows — asset rows keep their own order (A→Z with "Parts Sales" last) and invoice rows keep their order under their asset.',
 ],
 spec_ref="specs/sbc-sales-by-customer.md Story 10 S10-R1; S10-R2; S10-R6",
)

E["SBC-TREE-09"] = dict(
 title="Reload-causing changes collapse expansion; Customer filter typing does not",
 preconditions=[
  "1. You are on the report with at least one customer expanded down to invoice rows.",
  "2. Enough customers exist to fill more than one page of results (seed ZZAUTOTEST customers if needed).",
 ],
 steps=[
  "1. With rows expanded, open the Customer filter and TYPE a search query (do not change the selection); watch the expanded rows.",
  "2. Now change the date range (or Product Type, location, Customer selection, or sort).",
  "3. Look at the previously expanded rows, the loading state, and the set of customers on the page.",
 ],
 expected=[
  "1. Typing in the Customer filter's type-ahead only narrows the dropdown list — the expanded table rows stay expanded.",
  "2. A change that re-fetches customer rows (date range, Product Type, location, Customer selection, or sort) collapses all expanded rows.",
  "3. While the re-fetch is in flight the table shows the standard loading state; when it clears, the page shows the first page of the newly ordered set — the customers on the page can change.",
 ],
 spec_ref="specs/sbc-sales-by-customer.md Story 8 S8-R20; S8-R21; Story 10 S10-R8a; S10-R8b; S10-R8c",
)

E["SBC-COL-02"] = dict(
 title="Column toggles hide header+cells; Customer, Subtotal and chevron never in list",
 steps=[
  '1. Turn the "Shop Supplies" toggle off, then on again, watching the table.',
  "2. Read the toggle list for Customer, Subtotal, or a chevron entry.",
  "3. Turn all nine toggles off and read the table.",
 ],
 expected=[
  "1. Turning a toggle off hides that column's header and all its body cells together; turning it on restores both together.",
  "2. The Customer and Subtotal columns and the chevron control column do NOT appear in the toggle list and are always present.",
  "3. All nine columns can be hidden — nothing blocks the last toggle; the table still renders the Customer and Subtotal columns and the totals row still shows its Subtotal.",
 ],
 spec_ref="specs/sbc-sales-by-customer.md Story 13 S13-R5; S13-R6; S13-N1",
)

E["SBC-EXP-02"] = dict(
 title="CSV and PDF downloads are named by the active date range per the filename map",
 steps=[
  '1. Set the range to This Month and choose "Download (CSV)"; note the downloaded filename.',
  "2. Repeat for at least Today, Last Quarter, and a Custom range.",
  "3. Open a downloaded file in a text editor and in a spreadsheet.",
  '4. Repeat steps 1-2 choosing "Download (PDF)" and note the filenames.',
 ],
 expected=[
  "1. The filename follows the range map: Today → sales-by-customer-today.csv; Yesterday → sales-by-customer-yesterday.csv; This Week → sales-by-customer-this_week.csv; Last Week → sales-by-customer-last_week.csv; This Month → sales-by-customer-this_month.csv; Last Month → sales-by-customer-last_month.csv; This Year → sales-by-customer-this_year.csv; Last Year → sales-by-customer-last_year.csv; This Quarter → sales-by-customer-this_quarter.csv; Last Quarter → sales-by-customer-last_quarter.csv; Custom → sales-by-customer-custom.csv.",
  '2. For Custom the literal word "custom" is used — the actual start/end dates are not in the filename.',
  "3. The file is plain comma-separated text with a .csv extension that opens as rows and columns in a spreadsheet — not an .xlsx workbook and not a JSON file.",
  "4. The PDF download follows the same range-to-filename map with a .pdf extension — for example, sales-by-customer-this_month.pdf, sales-by-customer-custom.pdf.",
 ],
 spec_ref="specs/sbc-sales-by-customer.md Story 14 S14-R4; S14-R5; Story 15 S15-R4",
)

E["SBC-EXP-06"] = dict(
 title="CSV and PDF actions show a loading state and their own export failed toast",
 steps=[
  '1. Choose "Download (CSV)" and immediately look at the menu action.',
  '2. To provoke a failure, disconnect the network (or use browser dev tools offline mode) and choose "Download (CSV)" again.',
  '3. Repeat both checks for "Download (PDF)".',
 ],
 expected=[
  "1. While an export is in progress, that menu action shows a loading state and is non-interactive (CSV and PDF alike).",
  '2. If the CSV export fails, an error toast is shown: "CSV export failed." (dismissed by the user).',
  '3. If the PDF export fails, the toast reads "PDF export failed." — identical behavior, different wording.',
 ],
 spec_ref="specs/sbc-sales-by-customer.md Story 14 S14-E1; S14-N1; Story 15 S15-E1; S15-N1; §7",
)

E["SBC-EMPTY-01"] = dict(
 title="Empty state shows in the table body; toolbar interactive; kept selection returns",
 steps=[
  "1. Set a date range that contains no invoices (for example a Custom range over a quiet week far back).",
  "2. Read the table body and try each toolbar control.",
  "3. Also provoke the empty state via Product Type and via a location with no data, and re-check.",
  "4. Look at the table header row's chevron.",
  "5. Narrow the Customer filter to specific customers, change the date range so none of them have data, read the table and the filter, then change the range back.",
 ],
 expected=[
  '1. The table body shows the message "No sales data found for the selected filters." where customer rows would appear — not in the toolbar, the totals row, or a modal.',
  "2. The toolbar stays visible and interactive (all filters including the Customer filter, and the action controls), so you can adjust filters without leaving the page.",
  "3. The same empty state appears whichever filter caused it (date range, Product Type, or location).",
  "4. The header-row chevron is hidden when the table has no visible rows.",
  "5. With a narrowed customer selection and no data, the empty state shows but the selection is KEPT (not cleared) — when the filters change back, the selected customers reappear.",
 ],
 spec_ref="specs/sbc-sales-by-customer.md Story 17 S17-R1; S17-R2; S17-R3; S17-E1; Story 2 S2-N1; Story 3 S3-N1; Story 4 S4-N2; Story 8 S8-N1",
)

E["SBR-NAV-01"] = dict(   # FIX-WORDING repair + merge of SBR-NAV-02
 title="Sales By Representative at the bottom of Performance group; titles correct",
 preconditions=[
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. You can see the other reports in the Performance group.",
 ],
 steps=[
  "1. Open the Reports area and read the Performance group of the left-side navigation top to bottom.",
  '2. Click the "Sales By Representative" entry.',
  "3. Read the page title at the top of the report and the browser tab's title.",
 ],
 expected=[
  '1. "Sales By Representative" appears in the Performance group, at the BOTTOM of the group — the label is the full word "Representative," not a "Rep" shorthand.',
  "2. The rest of the navigation matches the previous release: no existing entry is moved, replaced, or reordered — if you can compare against production or an earlier build, the only difference is the added entry.",
  "3. Selecting the entry opens the report in the main content area.",
  '4. The page title reads "Sales By Representative".',
  '5. The browser tab title reads "Sales By Representative - Report | ShopView".',
 ],
 spec_ref="specs/sbr-sales-by-representative.md Story 1 S1-R1; S1-R2; S1-R3; S1-R4; S1-R5; S1-R6",
 notes_append=("FIX-WORDING repair 2026-07-28 (sense-check): the additive-placement comparison now points "
               "at production/the prior release — a cold tester cannot observe the pre-add order on a build "
               "where the report already exists."),
)

E["SBR-PERS-04"] = dict(
 title="First visit or cleared storage yields all defaults; no server-side profile",
 preconditions=[
  "1. You have distinctive saved settings, then clear the browser's site data (or use a fresh profile).",
  "2. You are working in a known active location (the application's location switcher).",
 ],
 expected=[
  '1. Date range = This Month; Product Type = "Parts & Service"; Invoice Status = "All Statuses"; Location = your currently active location only (the one location you are working in); Show Unassigned = off; all seven metric columns visible; sort = the A→Z default.',
  "2. Clearing browser storage fully returns the report to first-visit defaults — no server-side profile brings the old settings back.",
 ],
 spec_ref="specs/sbr-sales-by-representative.md Story 23 S23-R4; S23-N1; Story 2 S2-R4; Story 21 S21-R2",
)

E["SBR-TYPE-02"] = dict(
 title="Product Type: three options, Parts & Service default, each option filters right",
 preconditions=[
  "1. A rep has both a P (parts) and an S (service) invoice in the range (seed ZZAUTOTEST data via the WO Sales Rep field).",
  "2. No remembered settings for this report (first visit or cleared storage), so the default can be read.",
 ],
 steps=[
  '1. Find the "Product Type" dropdown in the toolbar; read its default value, then open it and read the options.',
  '2. Select "Parts only," expand the rep, and read the invoice numbers.',
  '3. Select "Service only" and read them again.',
  '4. Select "Parts & Service."',
 ],
 expected=[
  '1. The dropdown offers exactly three options: "Parts & Service," "Parts only," "Service only" — with "Parts & Service" as the default on first load.',
  '2. "Parts only" includes only invoices whose number starts with P.',
  '3. "Service only" includes only invoices whose number starts with S.',
  '4. "Parts & Service" applies no product-type filter — both appear again.',
  "5. Each change re-fetches and re-renders the report.",
 ],
 spec_ref="specs/sbr-sales-by-representative.md Story 3 S3-R1; S3-R2; S3-R3; S3-R4; S3-R5; S3-R6; S3-R7",
)

E["SBR-STAT-04"] = dict(
 title="Filters compose: a rep appears only with an invoice matching ALL active filters",
 preconditions=[
  "1. ZZAUTOTEST invoices exist that each fail exactly one of: date range, product type, invoice status, location — plus one invoice matching all four.",
  "2. For the per-filter legs: rep A has only service invoices and rep B both types; rep C has only Paid invoices and rep D a mix (seed ZZAUTOTEST data).",
 ],
 steps=[
  '1. Set all four filters (a range, "Parts only," "Paid," one location) and read the rep rows, counts, detail rows, and the grand Totals indicator.',
  '2. Product Type leg: select "Parts only"; look for rep A and read rep B\'s (N) count, summary totals, detail rows, and the grand Totals indicator.',
  '3. Invoice Status leg: filter to "Unpaid"; look for rep C and read rep D\'s figures.',
 ],
 expected=[
  "1. Only invoices matching ALL active filters contribute — every metric reflects the intersection; an invoice failing any single filter contributes nothing anywhere.",
  "2. A rep appears only if at least one invoice matches all active filters.",
  "3. Parts-only leg: rep A disappears; rep B's summary totals, detail rows, grand Totals, and (N) count reflect only the matching (P) invoices.",
  "4. Unpaid leg: rep C disappears; rep D's figures reflect only the Unpaid invoices.",
 ],
 spec_ref="specs/sbr-sales-by-representative.md Story 4 S4-R7; S4-R6; S4-N1; Story 3 S3-R8; S3-N1",
)

E["SBR-ROW-02"] = dict(
 title="Row layout: 12 columns in order, blanks in position, bold summary rows",
 steps=[
  "1. Read the column headers left to right.",
  "2. Read a rep summary row cell by cell.",
  "3. Compare the font weight of a summary row and a detail row.",
  "4. Look for any cell whose content has shifted into a neighbouring column or wrapped; check the desktop Totals row's leading cells.",
 ],
 expected=[
  "1. The columns appear left to right: Date, Invoice, Customer, Status, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal (12 columns).",
  '2. On a rep summary row the Date cell holds the chevron control followed by the rep\'s display name ("First Last"); the date value is intentionally blank.',
  "3. The Invoice, Customer, and Status cells are blank on summary rows; the metric cells carry the rep's totals across all matching invoices.",
  "4. Rep summary rows are bold (700) so they read as parent rows; detail rows use the default weight (400) — row type is distinguished by font weight, not background color.",
  "5. Every row renders exactly the report's column count with blanks in position — a cell with nothing to show is blank, never shifted or wrapped (a drifted row is a defect). The grand Totals indicator is exempt: the desktop Totals row merges the four leading identifier columns; the mobile bar is not a table row.",
 ],
 spec_ref="specs/sbr-sales-by-representative.md Story 5 S5-R2; S5-R3; S5-R6; S5-R8; S5-R10; S5-N2; Story 6 S6-R4; Story 18 S18-R4; S18-R6a",
)

E["SBR-BADGE-01"] = dict(
 title="Status badge between Customer and Inv. Hrs; every detail row shows mapped text",
 steps=[
  "1. Locate the Status column relative to its neighbours.",
  "2. Read the badge on each seeded invoice's detail row.",
  "3. Look at a badge's vertical position in its cell, read the Status cell on a rep summary row, and check the status is readable from the badge text alone.",
 ],
 expected=[
  "1. The Status column sits between the Customer column and the Inv. Hrs column.",
  '2. Every detail row renders a small colored badge reading "Paid," "Partially Paid," or "Unpaid" — badge rendering is unconditional on detail rows.',
  "3. The mapping matches §3: paid → Paid; overpaid → Paid; prepaid with zero balance → Paid; prepaid with a balance owed → Partially Paid; partially_paid → Partially Paid; unpaid → Unpaid.",
  "4. Badges are vertically centered in their cells; on rep summary rows the Status cell is blank; the badge's text is the accessible label — status is never conveyed by color alone.",
 ],
 spec_ref="specs/sbr-sales-by-representative.md Story 8 S8-R1; S8-R2; S8-R4; S8-R5; S8-R6; S8-N1; §3 payment-status mapping; Story 18 S18-R6",
)

E["SBR-CALC-02"] = dict(
 title="Inv. Hrs: +green, -red, 0.0 default on every row; rollups from unrounded deltas",
 preconditions=[
  "1. Invoices exist under one rep with a positive, a negative, and a break-even labor delta (seed ZZAUTOTEST data).",
  "2. If producible, an invoice whose delta is tiny (e.g., +0.04) and one with a small negative delta (e.g., -0.5) also exist.",
 ],
 steps=[
  "1. Read the three detail rows' Inv. Hrs values and colors.",
  "2. Read the rep summary row's and the Totals row's Inv. Hrs.",
  "3. Recalculate the rollup as the rounded sum of the unrounded per-invoice deltas.",
  "4. Read the tiny-delta and small-negative invoices' Inv. Hrs.",
 ],
 expected=[
  "1. Positive values show a leading + in green (e.g., +1.5); negative values a leading - in red (e.g., -1.5); zero/break-even shows 0.0 in the default text color.",
  "2. The same calculation, label, format, and coloring apply to rep summary rows, invoice detail rows, and the totals row.",
  "3. The rep-summary/totals value equals round(sum of unrounded per-invoice deltas).",
  "4. A value that rounds to 0.0 (e.g., +0.04) shows 0.0 in the default color — not +0.0 in green; negative values always use an explicit minus and one decimal (e.g., -0.5).",
 ],
 spec_ref="specs/sbr-sales-by-representative.md Story 9 S9-R3; S9-R4; S9-R5; S9-R6; S9-E1; S9-E2",
)

E["SBR-TOT-01"] = dict(
 title="Subtotal: rightmost, pinned right, bold everywhere; header row sticky on scroll",
 preconditions=[
  "1. You are on the report with data, narrow enough to force horizontal scrolling.",
  "2. Enough rows exist to also force vertical scrolling.",
 ],
 steps=[
  "1. Confirm nothing renders to the right of Subtotal on any row type.",
  "2. Scroll horizontally and watch the Subtotal column on summary and detail rows.",
  "3. Inspect the Subtotal weight on the header, a summary row, a detail row, and the Totals indicator; check the pinned cell's background.",
  "4. Scroll down through the rows and watch the header row; scroll right and watch the Subtotal header cell.",
 ],
 expected=[
  "1. Subtotal is the rightmost column on every row type.",
  "2. On screen it is pinned to the right edge and stays visible during horizontal scroll on every rep summary and invoice detail row.",
  "3. Subtotal values are bold across the header, every summary row, every detail row, and the grand Totals indicator.",
  "4. The pinned column matches the row's background color (white on body rows) — not a contrasting strip.",
  "5. The column-header row stays stuck to the top during vertical scroll; the Subtotal header cell stays visible in BOTH axes (top while scrolling down, pinned right while scrolling sideways).",
 ],
 spec_ref="specs/sbr-sales-by-representative.md Story 10 S10-R1; S10-R2; S10-R3; S10-R4; S10-R6; S10-N1; Story 18 S18-R7.5",
)

E["SBR-LINK-01"] = dict(
 title="Detail-row invoice number and customer name links navigate in the current tab",
 steps=[
  "1. Click a service invoice's number link and note the destination and tab.",
  "2. Go back, then click a parts invoice's number link.",
  "3. Click the customer name on a detail row.",
 ],
 expected=[
  "1. Each invoice number is a clickable link.",
  "2. Activating it navigates the CURRENT tab to the underlying invoice (work order or parts sale) — never a new tab.",
  "3. The customer name is likewise a clickable link that navigates the current tab to the customer's record.",
 ],
 spec_ref="specs/sbr-sales-by-representative.md Story 12 S12-R1; S12-R2; S12-R3",
 notes_append=("Contrast with Sales By Customer, where the customer name is plain text — the two reports "
               "differ by spec."),
)

E["SBR-DEACT-07"] = dict(
 title="No dialog: toggle off, no assignments, already inactive, or reactivation",
 preconditions=[
  "1. ZZAUTOTEST staff member X is active WITHOUT the sales-rep toggle; ZZAUTOTEST rep Y (with assignments) is currently inactive; ZZAUTOTEST rep Z is active with the sales-rep toggle ON and NO customers assigned.",
 ],
 steps=[
  "1. Deactivate X and watch for a dialog.",
  "2. Reactivate rep Y via the standard toggle and watch for a dialog; check Y's customer assignments afterwards.",
  "3. Deactivate rep Z (sales-rep toggle on, no assignments) and watch for a dialog.",
 ],
 expected=[
  "1. For a staff member without the sales-rep toggle, the precondition check is skipped and no warning is shown.",
  "2. Reactivation never shows the warning dialog (the flow does not apply to an already-inactive member).",
  "3. After reactivation the assignments re-surface immediately with no extra action.",
  "4. Deactivating a sales rep with NO customer assignments applies silently — no warning dialog.",
 ],
 spec_ref="specs/sbr-sales-by-representative.md Story 13 S13-R2; S13-N2; S13-N3; S13-E3",
 notes_append="Restore the ZZAUTOTEST staff members afterwards. The precondition check behind the silent branch is covered by the API case.",
)

E["SBR-UNAS-02"] = dict(
 title="Show Unassigned adds one top-pinned Unassigned row that acts like a rep row",
 steps=[
  '1. Turn "Show Unassigned" on and read the new row and its position.',
  "2. Read the grand Totals indicator.",
  '3. Read the Unassigned row\'s columns and (N) count, click its chevron, and look for any "(Inactive)" tag.',
  "4. Turn the toggle off again.",
 ],
 expected=[
  '1. A single summary row labeled "Unassigned" (verbatim) rolls up every matching invoice that has no assigned rep, respecting all other active filters.',
  "2. The row is pinned to the TOP of the table, above the A→Z reps, and stays pinned regardless of sort.",
  "3. Toggling re-renders the report and recomputes the grand Totals to include or exclude the Unassigned row accordingly.",
  '4. The Unassigned row shows the same metric columns and (N) count as any rep summary row, is expandable to its contributing invoices, is included in the grand Totals, and never carries an "(Inactive)" tag.',
 ],
 spec_ref="specs/sbr-sales-by-representative.md Story 22 S22-R3; S22-R4; S22-R5; S22-R6; Story 6 S6-R1",
)

E["SBR-COL-01"] = dict(
 title="Column selector: seven metric toggles; five always-on columns cannot be hidden",
 steps=[
  "1. Click the column selector button in the toolbar.",
  "2. Read the toggle list.",
  "3. Check the table's visible columns.",
  "4. Look for Date, Invoice, Customer, Status, or Subtotal in the toggle list.",
  "5. Hide all seven metric columns and read the table and the grand Totals indicator.",
 ],
 expected=[
  "1. The dropdown lists the seven toggleable metric columns, each with a toggle switch: Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %.",
  "2. On first visit all seven metric columns are visible.",
  "3. The five always-visible columns (Date, Invoice, Customer, Status, Subtotal) do not appear in the dropdown and cannot be hidden.",
  "4. With all seven metric columns hidden the table still renders the five always-on columns and the grand Totals indicator — no empty or error state.",
 ],
 spec_ref="specs/sbr-sales-by-representative.md Story 20 S20-R1; S20-R2; S20-R3; S20-R6; S20-N1",
)

E["SBR-STATE-01"] = dict(
 title="Empty state: verbatim message, no grand Totals, toolbar stays interactive",
 steps=[
  "1. Apply a filter set that matches no invoices for any rep (for example, a date range with no activity), with Show Unassigned OFF or with no matching unassigned invoices either.",
  "2. Read the data area and look for the grand Totals indicator.",
  "3. If checkable: view an organization/location state where NO staff member has ever been credited with an invoice, and compare the message.",
  "4. Look at the toolbar, then change the date range to a period WITH activity.",
 ],
 expected=[
  '1. The table shows no data rows and the empty-state message "No sales activity matches the current filters."',
  "2. The grand Totals indicator is NOT shown.",
  '3. The same message appears when no staff member has ever been credited — there is no separate "no reps configured" message; the report is contributor-driven.',
  "4. Whenever at least one rep row (or the Unassigned row) IS in the result set, the rep list renders and no empty/error message shows.",
  "5. In the empty state the toolbar — filters, column selector, and the ⋯ exports — stays visible and interactive; widening the range re-fetches and renders the matching reps normally.",
 ],
 spec_ref="specs/sbr-sales-by-representative.md Story 16 S16-R1; S16-R2; S16-R3; S16-N1; §7",
)

E["PV-FILT-01"] = dict(
 title="Type filter: single-select, first in row, three options, default Both; reloads",
 preconditions=[
  "1. You are on the Parts Velocity report with data loaded.",
  "2. This is a first visit (no saved view), so the first-visit defaults apply.",
  "3. Both inventory parts and special-order (catalogue) parts have sales activity in the selected date range.",
 ],
 steps=[
  "1. Look at the first control in the filter row of the toolbar.",
  "2. Open the Type filter and read its options.",
  "3. Note which option is selected by default.",
  "4. Select each Type option in turn and watch the table.",
 ],
 expected=[
  "1. The Type filter is the first control in the filter row.",
  '2. It is single-select and offers exactly three choices: Both, Inventory, and a choice for special-order catalog parts that were never put into stock. (That third choice\'s exact on-screen label is confirmed in the build — the spec calls it "Catalogue" and a rename is being considered.)',
  "3. On a first visit the default is Both.",
  "4. Both is an explicit selection returning inventory and special-order rows together - a deliberate filter value, not the absence of a filter.",
  "5. Each selection immediately reloads the report limited to that type (no separate Apply step) — under Inventory every row's Type column reads Inventory; under the special-order (catalogue) choice every row shows that type; under Both, rows of both kinds appear.",
 ],
 spec_ref=("SV-8642 (specs/parts-velocity.md S2-R1; S3-R5 — 'Catalogue' label rename PENDING per kickoff "
           "video P31 43:34-44:12; latest-info user ruling 2026-07-28)"),
 notes_append=("Seeding for the reload leg: at least one invoiced sale of an inventory part AND at least one "
               "vendor-sourced (catalogue) part request on an invoiced/paid work order in the window."),
)

E["PV-EXP-10"] = dict(
 title="Export toasts: exact success texts; server or fallback error text on failure",
 steps=[
  "1. Download the CSV and the PDF normally and read each toast.",
  "2. Trigger a CSV export under the failure condition and read the toast.",
  "3. Trigger a PDF export under the failure condition and read the toast.",
 ],
 expected=[
  '1. On success the toasts read exactly "Velocity report exported (CSV)" / "Velocity report exported (PDF)" and auto-fade — UPPERCASE (CSV)/(PDF).',
  "2. An error toast is shown on failure; when the server provides a message, that server message is shown.",
  '3. Otherwise the failure toast reads exactly: "Failed to export velocity report (csv)" or "Failed to export velocity report (pdf)" — lowercase (csv)/(pdf); the success/failure casing mix is the shipped wording, documented as-is (not a bug).',
 ],
 spec_ref="specs/parts-velocity.md S6-R9; S6-N1; §7 (casing note)",
 notes_append="A future copy pass may normalize the casing - until then the mixed casing is expected. VIU note: record the failure-induction method used (offline toggle / devtools request blocking).",
)

E["TU-HRS-02"] = dict(
 title="Headers in fixed order; Total, WO and Internal Hours show clocked hours (2 dp)",
 steps=[
  "1. Read the column headers left to right.",
  "2. Read the technician's Total Hours, WO Hours, and Internal Hours.",
  "3. Compare against the known clock records.",
  "4. Check the number format on a value over 100 hours.",
 ],
 expected=[
  "1. The headers appear in exactly this order: Technician, Total Hours, WO Hours, Internal Hours, Utilization %, Est. Lost Labor.",
  "2. Total Hours = all time the technician was clocked in for the range.",
  "3. WO Hours = time clocked directly to work orders; Internal Hours = time clocked to internal, non-billable activities.",
  "4. Internal Hours includes ALL internal time - including hours at a location with no configured labor rate.",
  '5. Hours show two decimal places with NO thousands separator (e.g. "107.70"), rounded from the unrounded hours using round-half-up (a tie rounds away from zero - 0.005 → 0.01).',
 ],
 spec_ref="specs/technician-utilization.md S2-R1; S2-R2; S2-R3; S2-R4; S2-R5; §3",
)

E["TU-NAV-08"] = dict(
 title="Standard no-data message when no time in scope or all technicians cleared",
 preconditions=[
  "1. A date range exists in which no technician clocked any time at the selected location(s), or a selectable location has no clocked time for the range.",
  "2. For the cleared-filter check: the report can also be loaded with rows showing.",
 ],
 steps=[
  "1. Select that empty date range (or the empty location) and let the report load.",
  "2. Read the message in the data area and look for the Summary row.",
  '3. Separately, with rows loaded, use "Clear all" in the Filter by Technician filter and re-read the data area and the Summary row.',
 ],
 expected=[
  '1. Instead of rows, the data area shows exactly: "Empty bays, endless possibilities. Get Going!" (the application\'s standard reports no-data label).',
  "2. The Summary row is hidden.",
  "3. Clearing every technician shows the SAME message and hides the Summary row — this version does not use distinct copy for genuinely-no-data vs a cleared filter.",
 ],
 spec_ref="specs/technician-utilization.md S1-N2; S9-N2; S5-N1; S3-N1; §7",
)

E["WIP-TAB-01"] = dict(
 steps=[
  "1. Open the reports navigation.",
  "2. Look inside the Performance group of reports.",
  '3. Click the "Work In Progress" entry.',
  "4. Read the browser tab's page title.",
 ],
 expected=[
  '1. The reports navigation lists a report labeled "Work In Progress" under the Performance group.',
  "2. Clicking it opens the Work In Progress report.",
  '3. The browser page title is exactly "Work In Progress - Report | ShopView" — a plain hyphen with one space on each side.',
 ],
 spec_ref="specs/wip-work-in-progress.md Story 1 S1-R1; S1-R5",
)

E["WIP-SCOPE-05"] = dict(
 title="No qualifying work orders: every tab shows the no-data message and no Totals",
 preconditions=[
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. The Work In Progress report is open.",
  "3. Separately, a state can be produced where some tabs have work orders but at least one tab (for example, Completed) has none.",
 ],
 steps=[
  "1. Set the date range and location so that no open work order qualifies (for example, a Custom range over dates with no work orders created).",
  "2. Open each of the four tabs and read the data area.",
  "3. Then, with work orders in some tabs only, open the empty tab and a populated tab.",
 ],
 expected=[
  '1. Each tab shows the standard reports no-data message "Empty bays, endless possibilities. Get Going!" in place of rows.',
  "2. No tab shows a Totals row.",
  '3. Every tab label count reads "(0)".',
  '4. When only one tab is empty, that tab shows the no-data message, no Totals row, and a "(0)" count while the populated tabs still show their rows normally.',
 ],
 spec_ref="specs/wip-work-in-progress.md Story 2 S2-N1; S2-N2; §7 User Feedback Summary",
)

E["WIP-PLACE-01"] = dict(
 title="Status-to-tab mapping: Estimate, Complete, In Progress and Review work orders",
 preconditions=[
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. Four ZZAUTOTEST service work orders exist within the current date range and location: one in Estimate status, one in Complete status, one in In Progress status, and one in Review status.",
 ],
 steps=[
  "1. Open the Work In Progress report.",
  "2. Look for each seeded work order in each tab.",
 ],
 expected=[
  '1. The Estimate work order appears in the "Estimates" tab and nowhere else.',
  '2. The Complete work order appears in the "Completed" tab and nowhere else.',
  '3. The In Progress and Review work orders appear in the "Approved - partially completed" tab and nowhere else.',
 ],
 spec_ref="specs/wip-work-in-progress.md Story 3 S3-R1; S3-R2; S3-R3",
)

E["WIP-PLACE-03"] = dict(
 title="Approved started-boundary: time or part received vs neither decides the tab",
 preconditions=[
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. Three ZZAUTOTEST service work orders in Approved status exist within the current date range and location: one where a technician has clocked time, one where a part has been received (and no time clocked), and one with neither.",
 ],
 steps=[
  "1. Open the Work In Progress report.",
  "2. Look for each of the three Approved work orders in each tab.",
 ],
 expected=[
  '1. The Approved work order with clocked labor time appears in the "Approved - partially completed" tab.',
  '2. The Approved work order with a received part (and no clocked time) also appears in the "Approved - partially completed" tab — either kind of started work counts.',
  '3. The Approved work order with no clocked time and no received part appears in the "Approved - not started" tab and nowhere else.',
 ],
 spec_ref="specs/wip-work-in-progress.md Story 3 S3-R4 (started + not-started branches + context note)",
)

E["WIP-FLT-08"] = dict(
 title="Advisor, customer and asset filters AND together and recompute strip and Totals",
 expected=[
  "1. A job must pass all three filters to remain visible (the filters combine with AND).",
  "2. The summary strip and each tab's Totals row recompute immediately from the still-visible jobs after every advisor, customer, or asset change — on screen, with no page reload.",
  '3. When the combination leaves no visible jobs, every tab shows the no-data message "Empty bays, endless possibilities. Get Going!" and no Totals row.',
 ],
 spec_ref="specs/wip-work-in-progress.md Story 7 S7-R12; S7-N1; Story 5 S5-R11; Story 6 S6-R6; §3 Key Decisions",
)

E["IV-FLT-02"] = dict(
 title="Category, Vendor and part search are server-side; each change returns page 1",
 steps=[
  "1. From page 2 (or later), select a Category and check which page shows and which rows are listed.",
  "2. Repeat with a Vendor selection.",
  "3. Repeat with a part search.",
  "4. Also change the date range, the location selection, and the sort — watching the data area each time.",
 ],
 expected=[
  "1. Each change re-queries the server and returns the first page of the new result set.",
  "2. The filtering covers the ENTIRE data set — matching parts that were on later pages appear — not just a narrowing of the rows on the current page.",
  "3. Every change — date range, location, Category, Vendor, part search, sort — reloads the rows from the server; while loading the standard reports loading indicator shows, and existing rows are replaced only when the new data returns.",
 ],
 spec_ref="specs/inventory-value.md Story 6 S6-R5; Story 1 S1-R4; S1-R5; S1-R7; S1-R8",
 notes_append=("Every filter on this report is server-side (Story 6 context note) — only the column selection "
               "is client-side. VIU-confirm the loading indicator's appearance."),
)

E["IV-NAV-06"] = dict(
 title="No qualifying parts, day or location: the no-data message shows and no totals",
 preconditions=[
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. Three causes can be produced: (a) a location you can access holds no in-stock parts, (b) a past range ends entirely before nightly recording began (or its covered dates were pruned by retention), (c) the filters can be set so nothing qualifies.",
 ],
 steps=[
  "1. Scope the report to the empty location and read the data area.",
  "2. Select a Custom range ending before nightly recording began and read the data area and the bottom of the report.",
  "3. Set the filters so nothing qualifies and re-read.",
 ],
 expected=[
  '1. In every case the report shows the standard reports no-data message "Empty bays, endless possibilities. Get Going!" instead of rows.',
  "2. No totals row is shown in any of the cases.",
 ],
 spec_ref="specs/inventory-value.md Story 1 S1-N2; Story 5 S5-N1; Story 7 S7-N2; Story 12; §7 User Feedback Summary",
)

E["IV-SCOPE-01"] = dict(
 title="A part appears only if not a core charge and on-hand quantity is above zero",
 preconditions=[
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. ZZAUTOTEST parts exist at your active location: a normal part with positive on-hand quantity, a core-charge part with a positive quantity, a part with exactly zero on-hand quantity, and (if producible) one with a negative on-hand quantity.",
 ],
 steps=[
  "1. Open the Inventory Value report scoped to the location.",
  "2. Look for the normal in-stock part.",
  "3. Search for the core-charge part, the zero-quantity part, and the negative-quantity part by part number; check the totals row.",
 ],
 expected=[
  "1. The normal, positive-quantity, non-core part appears as one row.",
  "2. The core-charge part is never listed — even with a positive quantity — and its value is not counted in the totals row.",
  "3. The zero-quantity and negative-quantity parts are not listed — only quantities greater than zero are valued.",
  "4. Only parts meeting BOTH conditions — not a core charge, and on-hand quantity greater than zero — are listed.",
 ],
 spec_ref="specs/inventory-value.md Story 2 S2-R1; S2-R2; S2-N1; S2-N2; §3 Key Decisions",
)

E["IV-TOT-02"] = dict(
 title="Totals row sums the FULL filtered set on the server, not just the visible page",
 preconditions=[
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. The current filtered set spans more than one page (more rows than one page shows).",
  "3. The Margin and Total Sell columns are turned on.",
  "4. The report shows parts across at least two categories and two vendors.",
 ],
 steps=[
  "1. Note the totals row's Qty on Hand, Margin, Total Sell, and Total Cost on page 1.",
  "2. Move to page 2 and read the totals row again.",
  "3. Cross-check the Total Cost total against a known seeded subset (filter down to a handful of ZZAUTOTEST parts whose values you can sum by hand).",
  "4. Select one Category and read the totals row; clear it, select one Vendor; clear it, type a part search matching a subset — reading the totals row each time (from a later page too if the set spans pages).",
 ],
 expected=[
  "1. The totals row sums Qty on Hand, Margin, Total Sell, and Total Cost across the FULL filtered result set — every qualifying row for the current Date, Location, Category, Vendor, and part-search selection, not only the rows on the visible page.",
  "2. The totals are identical on every page (they do not change as you page).",
  "3. The hand-summed subset matches the server-computed totals to the cent.",
  "4. After each filter change the totals row recomputes on the server over the full filtered set, independent of which page is shown.",
 ],
 spec_ref="specs/inventory-value.md Story 4 S4-R2; S4-R8; Story 6 S6-R6; §2 Scale and data model; §4 Terminology (Filtered set)",
)

E["IV-EXP-09"] = dict(
 title="Download notifications: verbatim success and failure texts per format",
 preconditions=[
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. The Inventory Value report is open with rows loaded (under the export cap).",
  "3. A download failure can be simulated (for example, disconnect the network just before requesting the download).",
 ],
 steps=[
  "1. Download the PDF and the CSV normally and read each notification.",
  "2. Simulate a failure and request the PDF download; read the notification.",
  "3. Repeat the failure for the CSV download.",
 ],
 expected=[
  '1. Success notifications read verbatim: "Inventory Value report exported (PDF)" and "Inventory Value report exported (CSV)".',
  '2. Failure notifications read verbatim: "Failed to export inventory value report (pdf)" and "Failed to export inventory value report (csv)".',
  '3. The lower-case "(pdf)"/"(csv)" on failure vs the upper-case success ones is the documented spec wording — expected, not a bug.',
 ],
 spec_ref="specs/inventory-value.md Story 10 S10-R13; S10-R14; §7 User Feedback Summary",
)

E["IV-TOT-01"] = dict(
 title="Totals row: Total label, blank identity/per-unit cells, pinned bold Total Cost",
 preconditions=[
  "1. You are signed in to the ShopView App on a desktop browser.",
  "2. The Inventory Value report is open with rows loaded and all columns turned on.",
  "3. The page shows more rows than fit on the screen.",
 ],
 steps=[
  "1. Look at the row at the bottom of the report.",
  "2. Read its Part # cell, its Description/Category/Vendor cells, and its Unit Cost/Unit Sell cells.",
  "3. Look at its Total Cost cell and compare the number formats to the data rows.",
  "4. Scroll the rows up and down and watch the totals row.",
 ],
 expected=[
  '1. A totals row is shown at the bottom, with the literal label "Total" in the Part # column\'s cell.',
  "2. The Description, Category, and Vendor cells are blank; the Unit Cost and Unit Sell cells are blank (a per-unit price has no meaningful sum).",
  "3. The totals-row Total Cost cell is pinned far right and bold, matching the column, and the row uses the same number formats as the data rows.",
  "4. The totals row stays visible at the bottom while the rows scroll.",
 ],
 spec_ref="specs/inventory-value.md Story 4 S4-R1; S4-R4; S4-R5; S4-R6; S4-R7; Story 12 S12-R5",
)

# ------------------------------------------- the remaining FIX-WORDING repairs
E["SBR-CALC-08"] = dict(
 title="Half-up rounding at each precision; totals may differ by one last-decimal unit",
 preconditions=[
  "1. Several invoices whose money values come from calculations that produce fractions of a cent sit under one rep — seed ZZAUTOTEST invoices whose amounts come from hours × rate or percentage-based lines that do not land on a whole cent (money fields themselves only take two decimals, so the sub-cent amounts must come from the math, not be typed in).",
 ],
 notes_append=("FIX-WORDING repair 2026-07-28 (sense-check): the old seeding hint ('values like $10.005') "
               "was untypeable — money fields take two decimals; sub-cent intermediates must come from "
               "hours × rate / percentage math."),
)

E["SBR-EXP-08"] = dict(
 title="PDF body font steps down as the longest dollar value grows; no overflow",
 steps=[
  "1. Download the Summary PDF for a view whose longest positive dollar value is 9 characters or fewer; note the body text size (a relative comparison across files is enough).",
  "2. Repeat for views whose longest positive value is 10, 11, and 12-or-more characters (as far as seedable).",
  "3. In each file, check whether any value overflows or wraps its column.",
 ],
 expected=[
  "1. As the longest positive dollar value in the document grows past each length bracket, the PDF body text visibly steps DOWN in size — the relative step-downs are the pass criterion for this manual test.",
  "2. Column widths are fixed for the worst case regardless of tier — the layout never breaks and no value overflows or wraps its column.",
  "3. Both PDF formats adapt the same way.",
 ],
 notes_append=("FIX-WORDING repair 2026-07-28 (sense-check): the px tier table is metadata, not the manual "
               "pass criterion (it needs a PDF inspector). Spec tier table (S14-R12): longest formatted "
               "positive dollar value 9 chars or fewer → 11px; 10 → 10px; 11 → 9px; 12+ → 8px (8px floor, "
               "11px ceiling, totals included)."),
)

E["SBC-PERM-04"] = dict(
 title="Location access enforced: no data from a location the user cannot access",
 steps=[
  "1. Sign in as the administrator, open the report, and open the location filter — note the locations listed.",
  "2. Sign in as the non-administrator, open the report, and open the location filter — note the locations listed.",
  "3. As the non-administrator, attempt to request a location you are not assigned to by these routes: (a) edit the page link (URL) if the location selection is carried there, and open the edited link; (b) restore a saved view stored while an extra location was assigned (set that saved view up first if practical).",
  "4. Check the report data.",
 ],
 notes_append=("FIX-WORDING repair 2026-07-28 (sense-check): the probe routes are now named concretely "
               "(edited page link; stale saved view). The pass condition stays: an inaccessible location is "
               "ignored, never widened."),
)

E["SBC-EXP-08"] = dict(
 title="PDF page: A4 landscape, uniform margins, ShopView footer and page numbers",
 expected=[
  "1. The PDF is A4 landscape using the application's standard font; the page margins look uniform on all sides. (The spec's exact 25px margin needs a PDF inspector — check the number only if you have one; otherwise uniform margins pass.)",
  '2. The footer has a centered "Software Powered by ShopView" label and a right-aligned page number "Page X of Y."',
 ],
 notes_append=("FIX-WORDING repair 2026-07-28 (sense-check): the 25px margin is not measurable by eye — "
               "the observable pass criterion is A4 landscape + uniform margins + footer + page numbers; "
               "the exact 25px stays as an inspector-only check."),
)

E["TU-SUM-02"] = dict(
 title="Summary totals visible technicians from unrounded hours; 0.01 drift expected",
 expected=[
  "1. Each Summary hours value is the total of that column across the VISIBLE technicians, computed from unrounded hours and rounded once for display (round-half-up).",
  "2. Eye-summing the displayed rows MAY differ from the displayed Summary by 0.01 — one unit in the last decimal (these values are HOURS, not money) — expected in a compute-from-unrounded report, not a defect.",
  "3. With every technician selected, the Summary row equals the shop totals for the full date range at the selected location(s).",
 ],
 notes_append=("FIX-WORDING repair 2026-07-28 (sense-check): 'differ by a cent' corrected — the values are "
               "hours, so the tolerance is 0.01 (one unit in the last decimal)."),
)

E["TU-LINK-03"] = dict(
 title="Same range, single location, closed records: Total Hours matches Timesheet",
 steps=[
  "1. Read the technician's Total Hours on the Technician Utilization report (two decimals).",
  "2. Click the Total Hours link and read the same technician's total on the opened Timesheet Activities report.",
  "3. Compare the two, to two decimals.",
 ],
 expected=[
  "1. The two totals MATCH exactly, to two decimals (these values are hours, not money) - both reports read the same clock records and round the same way (round-half-up, from unrounded values).",
  "2. Under this exact scope (same range, same single location, closed records) a mismatch IS a defect.",
  "3. The two documented scope differences (open clocks, multi-location drill-through) are covered by separate cases and are NOT defects.",
 ],
 notes_append=("FIX-WORDING repair 2026-07-28 (sense-check): 'to the cent' corrected to 'to two decimals' — "
               "the compared totals are hours. The open-clock and multi-location exceptions are TU-LINK-04 "
               "and TU-LINK-05."),
)

E["PV-EXP-08"] = dict(
 title="PDF export alignment: Type centered, text left, numeric and money right",
 steps=[
  "1. Download the PDF and look at the alignment of each column.",
  "2. Download the CSV and open it in a plain text editor to confirm it is plain comma-separated values (a CSV file carries no alignment of its own).",
 ],
 expected=[
  "1. In the PDF, the Type column is CENTERED.",
  "2. In the PDF, the text columns (Part #, Description, Category, Vendor) are left-aligned.",
  "3. In the PDF, EVERY numeric and money column is right-aligned.",
  "4. This is a deliberate export-only treatment - the on-screen table is all-left-aligned; the difference is documented, not a defect.",
  "5. The CSV is plain data — the alignment assertions apply to the PDF only; how a spreadsheet displays the CSV is not part of this test.",
 ],
 notes_append=("FIX-WORDING repair 2026-07-28 (sense-check): alignment assertions scoped to the PDF — a CSV "
               "carries no alignment."),
)

E["IV-PERS-04"] = dict(
 title="Defensive restore: a stale saved category or vendor is dropped on load",
 expected=[
  "1. The report loads normally — the saved category or vendor that is no longer present in the data is dropped from the selection instead of breaking the view (the defensive-restore rule applied to the path these steps drive).",
  "2. All other saved settings are still restored.",
 ],
 notes_append=("FIX-WORDING repair 2026-07-28 (sense-check): the Expected is scoped to the stale-category/"
               "vendor path the steps actually drive; the general invalid-value fallback across other value "
               "classes is covered the SBC-PERS way only where a case drives it."),
)

# ---------------------------------------------------------------- execution
def main():
    files = {}
    cases = {}
    for f in sorted(glob.glob(os.path.join(CASES, "cases-*.json"))):
        data = json.load(open(f))
        files[f] = data
        for c in data:
            cases[c["id"]] = (c, f)

    survivors = {s for s, _ in GROUPS.values()}
    members = [m for _, ms in GROUPS.values() for m in ms]
    touched = set(E) | set(members) | set(CUTS) | {PRINT_RETIRE}
    missing = [t for t in touched if t not in cases]
    if missing:
        sys.exit("MISSING cases: %s" % missing)

    # title length gate
    for cid, ed in E.items():
        t = ed.get("title")
        if t and len(t) > 80:
            sys.exit("TITLE TOO LONG (%d) %s: %s" % (len(t), cid, t))

    # 1. backup
    os.makedirs(BK, exist_ok=True)
    for cid in sorted(touched):
        c, _ = cases[cid]
        with open(os.path.join(BK, "%s_pre-edit.json" % cid), "w") as fh:
            fh.write(json.dumps(c, indent=2, ensure_ascii=False) + "\n")
    print("Backed up %d pre-edit bodies -> %s" % (len(touched), BK))

    # 2. apply edits
    for cid, ed in E.items():
        c, _ = cases[cid]
        for k in ("title", "preconditions", "steps", "expected", "spec_ref"):
            if k in ed:
                c[k] = ed[k]
        if "notes_append" in ed:
            base = (c.get("notes") or "").strip()
            c["notes"] = (base + " " if base else "") + ed["notes_append"]

    # survivor merge notes
    for g, (s, ms) in GROUPS.items():
        c, _ = cases[s]
        note = MERGE_NOTE.format(g=g, members=", ".join(ms))
        base = (c.get("notes") or "").strip()
        c["notes"] = (base + " " if base else "") + note

    # 3. retire members / cuts / print case
    for g, (s, ms) in GROUPS.items():
        for m in ms:
            c, _ = cases[m]
            c["viu_status"] = ("Retired 2026-07-28 (merged into %s per user-authorized consolidation; "
                               "delete_case authorized 2026-07-28)" % s)
    for cid, why in CUTS.items():
        c, _ = cases[cid]
        c["viu_status"] = "Retired 2026-07-28 (%s; delete_case authorized 2026-07-28)" % why
    c, _ = cases[PRINT_RETIRE]
    c["viu_status"] = ("Retired 2026-07-28 (video P25 Print removed from Sales By Customer; "
                       "delete_case authorized 2026-07-28)")

    # 4. write back
    for f, data in files.items():
        with open(f, "w") as fh:
            fh.write(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print("Applied %d field-edit cases, %d survivor merge notes, %d retirements."
          % (len(E), len(GROUPS), len(members) + len(CUTS) + 1))

    active = sum(1 for c, _ in cases.values()
                 if not str(c.get("viu_status", "")).startswith("Retired"))
    print("Active (non-retired) local cases now:", active)

if __name__ == "__main__":
    main()
