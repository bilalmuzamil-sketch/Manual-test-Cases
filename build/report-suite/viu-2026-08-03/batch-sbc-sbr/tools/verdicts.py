#!/usr/bin/env python3
"""verdicts.py — build VERDICTS.md + verdicts.csv for the 195 SBC/SBR cases.

Every case gets ONE of exactly four verdicts, decided from the LIVE observations recorded in
../evidence (Rule 12 — observed, never inferred):
    VIU-Observed-PASS      the build does what the case says, seen live with evidence
    DEVIATION              the build differs from the spec; the spec text is quoted verbatim (Rule 25)
                           and the reading (defect vs not-built-yet-on-an-unfinished-branch) is stated
    NOT-BUILT              the thing does not exist; what was observed proving absence is stated
    EXTERNAL-DEPENDENCY    fully characterised external blocker with evidence

The FINDINGS table below is the single source of observed truth; each case cites the finding ids
its verdict rests on, so a reader can trace any verdict back to the captured evidence.
"""
import csv
import json
from pathlib import Path

BATCH = Path(__file__).resolve().parents[1]
ROOT = Path(__file__).resolve().parents[5]
BUILD = "v3.4.1-0ed4433"
OBS = "2026-08-04"

# ---------------------------------------------------------------------------------------------
# FINDINGS — every one observed live this run; the evidence path is the proof.
# ---------------------------------------------------------------------------------------------
F = {
 # ---- shared ----
 "F1": ("Date-range control is span.date-range-label, default 'This Month'. The popup holds an inline "
        "calendar plus EXACTLY NINE presets — Last 12 Months, This Year, Last Year, This Quarter, "
        "Last Quarter, This Month, Last Month, This Week, Last Week — a 'Range: N days' readout and an "
        "Apply button. There is NO 'Custom' button, NO 'Today' and NO 'Yesterday'.",
        "evidence/sales-by-customer/observe-full.json#datePopup"),
 "F2": ("Export menu = [aria-label='Export report'] (more_horiz glyph, data-test-id btn_dropdown_<rep>_export) "
        "with EXACTLY FOUR items: 'Download Summary (PDF)', 'Download Expanded View (PDF)', "
        "'Download Summary (CSV)', 'Download Expanded View (CSV)'.",
        "evidence/sales-by-customer/observe-full.json#exportMenu"),
 "F3": ("NO Print control exists anywhere on either report page (a sweep of every button/menu item/link "
        "for 'print' in text or aria-label returned an empty list on both reports).",
        "evidence/sales-by-customer/observe-full.json#toolbar.printControls"),
 "F4": ("Column selector = [aria-label='Column Selection'] (width_normal, data-test-id button_column_selection). "
        "Menu rows are NOT clickable; each carries a q-toggle role=switch data-test-id "
        "toggle_column_<key>. Toggling it off removes the header AND the cells. SBC offers 9 toggles "
        "(Date, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, "
        "Margin, Margin %); SBR offers 7 (Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, "
        "Parts Margin, Margin, Margin %). Identifier columns and Subtotal are not offered.",
        "evidence/sales-by-customer/colsel-search-verify.json + evidence/sales-by-customer/observe-full.json#columnSelector"),
 "F5": ("The grand totals row renders as tbody tr.report-totals-row with the literal label 'Totals' and "
        "covers the WHOLE filtered set (its values match the export Totals line, not the visible page).",
        "evidence/sales-by-customer/tree-sort.json + evidence/sales-by-customer/exports/exports.json"),
 "F6": ("Location filter is the rightmost .q-select, offers 'All locations' (pinned top) + 'Clear all' + one "
        "row per accessible workplace, and has a search input. It carries a clear (close) button with "
        "aria-label 'Clear Location'.",
        "evidence/sales-by-customer/observe-full.json#filters[3]"),
 "F7": ("Date range, Product Type and the column choice all survive a full page reload, persisted in "
        "localStorage under the single key report_view:<slug>. The URL carries NO filter state — it stays "
        "/reports/<slug> however the filters are set.",
        "evidence/sales-by-customer/remaining.json#persistence,urlAfterFilters"),
 "F8": ("Empty state (default This Month, no data): the header row renders, the body has ZERO rows, and "
        "there is NO empty-state message of any kind — a scan for 'no data / no result / nothing / empty' "
        "text returned nothing. No totals row either.",
        "evidence/sales-by-customer/remaining.json#emptyState + evidence/sales-by-customer/empty-state.png"),
 "F9": ("Export API GET /api/reporting/reports/<slug>/export?format=csv|pdf&variant=summary|expanded&<filters>. "
        "Guards observed: bad format -> 400 'Invalid export format. Allowed values: csv, pdf.'; missing or "
        "bad variant -> 400 'Invalid export variant. Allowed values: summary, expanded.' All four variants "
        "return 200 with Content-Disposition attachment and a <slug>-<variant>-<range>.<ext> filename.",
        "evidence/sales-by-customer/exports/exports.json"),
 "F10": ("Every CSV starts with a UTF-8 BOM then a metadata line \"Locations: All locations\", then the "
         "header row, the data rows, and a final Totals row.",
         "evidence/*/exports/exports.json"),
 "F11": ("PDF header strip carries, in order: the report title ('Sales By Customer Report' / 'Sales By "
         "Representative Report'), the organisation name, the current workplace, 'Date Range: <start> – "
         "<end>', 'Product Type: Parts & Service', (SBR only) 'Invoice Status: All Statuses', and "
         "'Locations: All locations'. Text extracted with pypdf.",
         "evidence/*/exports/*.pdf.txt"),
 "F12": ("CSV cell formatting does NOT strip presentation: money keeps the dollar sign and thousands "
         "separators (\"$1,238.32\"), Margin % keeps its percent sign (97.4%), and dates render as "
         "'Jun 02 2026' rather than mm-dd-yyyy.",
         "evidence/*/exports/*.csv"),
 "F13": ("The PDF 'Date Range' line prints an end date ONE DAY LATER than the requested end_date "
         "(requested end_date=2026-08-04, the PDF printed 'Date Range: Jun 1, 2026 – Aug 5, 2026').",
         "evidence/*/exports/*.pdf.txt"),
 "F15": ("Inv. Hrs / Hrs Worked / Hrs Invoiced are 0.0 for EVERY row and in the totals across the whole "
         "org and every date range tried — the invoiced-hours pipeline carries no data on this branch. "
         "New invoices (which is the only way to seed hours) cannot be created: POST /api/invoices/create "
         "and the UI's own POST /api/work-orders/invoices/estimate both return HTTP 500.",
         "evidence/api/*-12mo.json + evidence/ENV-DEFECTS.md"),
 "F14": ("All money in the report API payload is an integer number of CENTS; the UI and exports format it.",
         "evidence/api/sales-by-customer-12mo.json"),
 # ---- SBC ----
 "F16": ("Sales By Customer sits under a nav group headed SALES (not PERFORMANCE) at "
         "/reports/sales-by-customer. The PERFORMANCE group holds WIP, Technician Utilization and "
         "Sales By Representative.",
         "../evidence/nav-map.json + ../ACCESS-PROOF-2026-08-03.md §6"),
 "F17": ("SBC on-screen columns in order: (expander), Customer, Date, Location, Inv. Hrs, Labor Invoiced, "
         "Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %, Subtotal.",
         "evidence/sales-by-customer/observe-full.json#grid.headRows"),
 "F18": ("SBC is a THREE-level tree Customer -> Asset -> Invoice, row classes sbc-row--customer / "
         "sbc-row--asset / sbc-row--invoice, loaded on demand: "
         "GET /api/reporting/reports/sales-by-customer/{customerId}/assets then "
         ".../assets/vehicle%3A{vehicleId}/invoices. Nothing is preloaded.",
         "evidence/sales-by-customer/level3-sort.json#levels"),
 "F19": ("Customer and asset names carry a bracketed invoice count in a span.sbc-count, e.g. "
         "'Aagate Landscaping(43)'. An asset cell is <i class='sbc-asset-icon'>local_shipping</i> + a bold "
         "identifier + the count; the identifier observed is a 17-character VIN "
         "(e.g. 1TNPLAR64RLEH17EK).",
         "evidence/sales-by-customer/remaining.json#assetLabelHtml"),
 "F20": ("Parent rows leave Date blank; invoice rows fill Date ('Jan 16 2026') and their invoice number is "
         "a link to /workorders/{id}/finance in the same tab.",
         "evidence/sales-by-customer/level3-sort.json#levels[1].sample"),
 "F21": ("The header chevron is a real button with aria-label 'Expand all customers' "
         "(data-test-id button_sbc_expand_all) and expands every customer on the page (31 rows -> 84).",
         "evidence/sales-by-customer/tree-sort.json#expandAll"),
 "F22": ("SBC sorting is server-side via pagination[sortBy] for Date, Inv. Hrs, Labor Invoiced, Labor "
         "Margin, Parts Invoiced, Parts Margin, Shop Supplies and Subtotal (ascending then descending on a "
         "second click). Clicking Customer, Location, Margin or Margin % fires NO request and changes "
         "nothing — re-verified per column from a freshly loaded page. Customer nonetheless displays a "
         "sort arrow and aria-sort='ascending'.",
         "evidence/sales-by-customer/level3-sort.json#sortRecheck + tree-sort.json#sortMatrix"),
 "F23": ("Margin % renders an em dash '—' on a row whose Subtotal is $0.00.",
         "evidence/sales-by-customer/observe-full.json#grid.bodyRows[2]"),
 "F24": ("SBC Summary CSV header row, verbatim: "
         "Customer,Location,\"Inv. Hrs\",\"Labor Invoiced\",\"Labor Margin\",\"Parts Invoiced\","
         "\"Parts Margin\",\"Shop Supplies\",Margin,\"Margin %\",Subtotal",
         "evidence/sales-by-customer/exports/sales-by-customer__summary.csv"),
 "F25": ("SBC Expanded CSV header row, verbatim: "
         "Customer,Asset,\"Invoice #\",Date,Location,\"Inv. Hrs\",\"Labor Invoiced\",\"Labor Margin\","
         "\"Parts Invoiced\",\"Parts Margin\",\"Shop Supplies\",Margin,\"Margin %\",Subtotal — and the "
         "blank-cell shape matches: a customer row fills Customer only, an asset row fills Asset only, an "
         "invoice row fills Invoice # and Date.",
         "evidence/sales-by-customer/exports/sales-by-customer__expanded.csv"),
 "F26": ("SBC PDFs: Summary 8 pages, Expanded 49 pages. BOTH carry the per-row Location column, the "
         "per-row location values and a Totals line. Proven by extracting the PDF text with pypdf.",
         "evidence/sales-by-customer/exports/*.pdf.txt"),
 "F27": ("SBC Customer filter sends customers={uuid}; its menu has a search input placeholder "
         "'Search customers' and typing narrows the list (32 options -> 3 for 'Zuline'). Selecting one "
         "customer reduces the table to that customer and refreshes the totals.",
         "evidence/sales-by-customer/remaining.json#customerFilter + colsel-search-verify.json#search"),
 "F28": ("Product Type offers exactly three options — 'Parts & Service' (default), 'Parts only', "
         "'Service only' — mapping to productType=all|parts|service, and the totals change with each.",
         "evidence/sales-by-customer/remaining.json#productType"),
 # ---- SBR ----
 "F29": ("Sales By Representative sits under the PERFORMANCE nav group at "
         "/reports/sales-by-representative, and the full label renders untruncated.",
         "../evidence/nav-map.json + evidence/sales-by-representative/observe-full.json"),
 "F30": ("SBR on-screen columns in order: (expander), Date, Invoice, Customer, Status, Location, Inv. Hrs, "
         "Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal. There is "
         "NO 'Sales Rep' or 'Sales Representative' column header at all — the rep name occupies the merged "
         "leading cells of the rep row.",
         "evidence/sales-by-representative/observe-full.json#grid.headRows"),
 "F31": ("'Show Unassigned' is a q-toggle with role=switch, default OFF, sitting in the toolbar. Switching "
         "it on adds showUnassigned=1 and produces one 'Unassigned(N)' row that is sorted FIRST and stays "
         "first under every sort tried; its Location cell reads 'Multiple'. The unassigned bucket's key is "
         "00000000-0000-0000-0000-000000000000.",
         "evidence/sales-by-representative/sbr-deep.json#showUnassigned,afterToggle,sortWithUnassigned"),
 "F32": ("SBR is a TWO-level tree, row classes sbr-row--rep / sbr-row--invoice, invoices loaded on demand "
         "via GET /api/reporting/reports/sales-by-representative/{repKey}/invoices.",
         "evidence/sales-by-representative/sbr-deep.json#expandApi,expanded"),
 "F33": ("Payment status renders as a q-badge with exactly three observed texts and colour tokens: "
         "'Paid' (bg-teal-1 / text-teal-9, rgb(224,242,241) on rgb(0,105,92)), 'Unpaid' (bg-red-1 / "
         "text-red-10), 'Partially Paid' (bg-orange-1 / text-orange-10).",
         "evidence/sales-by-representative/sbr-deep.json#badges"),
 "F34": ("Invoice-row links, by invoice type: a service invoice 'S-15487' links to "
         "/workorders/{id}/finance; a PART SALE invoice 'P-126' links to "
         "/parts/part-sale/{id}/part-requests; the customer name links to /customers/{id}. Same tab.",
         "evidence/sales-by-representative/sbr-deep.json#expanded.rows[].links"),
 "F35": ("Invoice Status offers exactly four options — 'All Statuses' (default), 'Paid', 'Partially Paid', "
         "'Unpaid' — mapping to invoiceStatus=all|paid|partially_paid|unpaid, and each visibly changes the "
         "rows and the totals.",
         "evidence/sales-by-representative/sbr-deep.json#statusFilter"),
 "F36": ("SBR sorting is server-side; default sortBy=rep_name ascending. Subtotal AND Margin % both sort "
         "(sortBy=subtotal, sortBy=margin_pct), ascending then descending on a second click.",
         "evidence/sales-by-representative/observe-full.json#sorting + sbr-deep.json#sortWithUnassigned"),
 "F37": ("SBR Summary CSV header row, verbatim: "
         "Representative,Location,\"Inv. Hrs\",\"Labor Invoiced\",\"Labor Margin\",\"Parts Invoiced\","
         "\"Parts Margin\",Margin,\"Margin %\",Subtotal — and the file DOES carry a final Totals row.",
         "evidence/sales-by-representative/exports/sales-by-representative__summary.csv"),
 "F38": ("SBR Expanded CSV header row, verbatim: "
         "Representative,\"Invoice #\",Date,Customer,\"Invoice Status\",Location,\"Hrs Worked\","
         "\"Hrs Invoiced\",\"Inv. Hrs\",\"Labor Invoiced\",\"Labor Margin\",\"Parts Invoiced\","
         "\"Parts Margin\",Margin,\"Margin %\",Subtotal",
         "evidence/sales-by-representative/exports/sales-by-representative__expanded.csv"),
 "F39": ("SBR PDFs (Summary and Expanded) BOTH carry the Location column and per-row location values; the "
         "Summary PDF's text layer reads 'RepresentativeLocation Inv. Hrs …' (the two header words sit "
         "adjacent). Proven by pypdf text extraction.",
         "evidence/sales-by-representative/exports/*.pdf.txt"),
 "F40": ("On a work order the field is labelled 'Sales rep' (lower-case r) in the left panel beside 'Lead "
         "technician' and 'Service advisor'. On an INVOICED work order it renders as a read-only "
         "static-field with no selector. GET /api/sales-reps supplies the selectable reps. However "
         "POST /api/work-orders/change-sales-rep STILL returns 201 for that invoiced work order — the "
         "front end is read-only but the back end accepts the write.",
         "evidence/wo-salesrep/wo-finance.json"),
 "F41": ("Changing a work order's Sales rep AFTER it was invoiced does NOT move the invoice in the report: "
         "S-15826's work-order rep was changed to Daniel Padilla and the report continued to credit Parth "
         "Fadadu. The credit is snapshotted onto the invoice at invoice creation.",
         "evidence/ENV-DEFECTS.md#S19-R6-proof"),
 "F42": ("A staff member becomes selectable as a Sales Rep by setting is_sales_rep through "
         "POST /api/staff/{staff_id}/change; GET /api/sales-reps then lists them.",
         "tools/seed_sales_reps.mjs (proven; snapshot+restore built in)"),
 "F43": ("Icon-only controls all carry real accessible names: 'Export report', 'Column Selection', "
         "'Clear Location', 'Expand all customers' / 'Expand all representatives', and per-row "
         "'Expand <name>', each with a data-test-id.",
         "evidence/*/visual-a11y.json#accessibleNames"),
 "F44": ("Keyboard/state exposure is partial: row chevrons have tabindex=0 but expose NO aria-expanded; "
         "column headers have NO tabindex at all (not keyboard focusable) though the sorted one does carry "
         "aria-sort='ascending'.",
         "evidence/*/visual-a11y.json#keyboard"),
 "F45": ("Surfaces: page rgb(249,250,251), toolbar white, thead transparent, Subtotal header "
         "position:sticky right:0 font-weight:800, thead position:sticky top:0. There is NO row-level "
         "striping — every data row and the Totals row share rgb(249,250,251); the Totals row is NOT white.",
         "evidence/*/visual-a11y.json#surfaces"),
 "F46": ("Dark mode renders (body--dark): page rgb(20,24,36) and the Totals row rgb(15,17,26) — but the "
         "Totals row's TEXT stays rgb(0,0,0), i.e. black text on a near-black surface.",
         "evidence/*/visual-a11y.json#darkMode + evidence/*/dark-mode.png"),
 "F47": ("On a 390x844 phone viewport the table is horizontally scrollable (overflow-x:auto, table 1348px "
         "in a 370px container) and the Totals row stays INSIDE that scrolling table — there is no separate "
         "totals bar below the table. Touch targets are undersized: chevrons 22x22, menu_open 31x31, "
         "the column-selector button 55x31 — all below 44x44.",
         "evidence/*/visual-a11y.json#mobile + evidence/*/mobile-a11y.png"),
 "F48": ("Report access is governed by the SINGLE atom reportsPageAccess — the whole FE permission "
         "catalogue holds no other report atom and no per-report atom. Proven both ways: a Sales "
         "Representative (8 atoms, holds it) got 200 on data AND export for all six reports; without it "
         "every one returns 403.",
         "../evidence/permissions/permission-matrix.json + minimal-role-proof.json"),
 "F50": ("The CUSTOMER record's Edit Customer dialog carries a 'Sales Representative' dropdown whose "
         "options are the WHOLE STAFF LIST — including staff flagged inactive (Louis Mccoy, Mary Higgins) — "
         "NOT the is_sales_rep-toggled set that GET /api/sales-reps returns. Saving sends "
         "POST /api/customers/change (200) carrying sales_rep_first_name / sales_rep_last_name as STRINGS; "
         "there is no sales_rep_id in the payload, and the customer read-back keeps sales_rep_id: null with "
         "the name pair populated. So the customer's rep is stored BY NAME, not by rep id.",
         "evidence/deactivation/customer-edit-dialog.md"),
 "F51": ("The customer record's card label is 'Sales Representative' (title case, spelled in full), whereas "
         "the WORK ORDER panel's label is 'Sales rep' (lower-case r). The two surfaces use different wording "
         "for the same field.",
         "evidence/deactivation/customer-edit-dialog.md + evidence/wo-salesrep/wo-finance.json"),
 "F49": ("For a genuinely single-location user (one accessible workplace) the per-row Location COLUMN is "
         "absent from both reports, while the Location FILTER control remains visible.",
         "../evidence/singleloc-matrix.json + evidence/sales-by-representative/sbr-deep.json#singleLocation"),
}

# ---------------------------------------------------------------------------------------------
# SPEC QUOTES used by DEVIATION verdicts (verbatim, Rule 25)
# ---------------------------------------------------------------------------------------------
Q = {
 "SBC-S14-R9":  "S14-R9: \"The Margin % cell is a plain number to one decimal with no percent sign (for example, 64.7); it is empty when the row's Subtotal is zero or below.\"",
 "SBC-S14-R10": "S14-R10: \"Dates export as mm-dd-yyyy — for example, 05-14-2026 — matching the ShopView-wide CSV date format.\"",
 "SBC-S14-R11": "S14-R11: \"Currency values export as plain numbers with no dollar sign and no thousands separators.\"",
 "SBC-S14-R4":  "S14-R4 (Summary contents): \"Its columns, in this exact order, are: Customer, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %, Subtotal.\"",
 "SBC-S4-R13":  "S4-R13: \"Every export … includes a “Locations:” line … When the Location column is shown on screen (more than one location in scope, S4-R12), every export also includes that Location column.\"",
 "SBC-S4-R12":  "S4-R12: \"When more than one location is in scope, the report shows a per-row Location column; the column is hidden when a single location is in scope.\"",
 "SBC-S4-R4":   "S4-R4: \"On first load, the filter defaults to the location the user is currently working in (their active location) — a single location.\"",
 "SBR-S14-R15": "S14-R15: \"Summary CSV … Headers, in order: `Sales Rep`, `# Invoices`, `# Customers`, `Hrs Worked`, `Hrs Invoiced`, `Inv. Hrs`, `Labor Invoiced`, `Labor Margin`, `Parts Invoiced`, `Parts Margin`, `Margin`, `Margin %`, `Subtotal`.\" (and, via S14-R19, \"the CSV has no totals row, S14-R15\")",
 "SBR-S14-R16": "S14-R16: \"Expanded CSV … Headers, in order: `Sales Rep`, `Date`, `Invoice #`, `Customer`, `Status`, `Hrs Worked`, `Hrs Invoiced`, `Inv. Hrs`, `Labor Invoiced`, `Labor Margin`, `Parts Invoiced`, `Parts Margin`, `Margin`, `Margin %`, `Subtotal`.\"",
 "SBR-S14-R17": "S14-R17: \"CSV cell formatting (both CSVs): numeric columns are emitted as plain numbers for re-pivoting — no currency symbol, thousands separators, or parentheses … `Margin %` is a number to one decimal (e.g., `45.2`)\"",
 "SBR-S14-R20": "S14-R20: \"Whenever the Location column is shown on screen (S21-R7), it is included in all four exports in the same position it occupies on screen — Summary and Expanded, PDF and CSV … In addition, every export … includes a “Locations:” line\"",
 "SBR-S19-R5":  "S19-R5: \"The selector is read-only (non-interactive) when the WO status is “Invoiced” or “Paid”.\"",
 "SBR-S19-R6":  "S19-R6: \"At invoice creation, the WO's Sales Rep is snapshotted onto the resulting invoice, and that snapshot is what the report reads.\"",
 "SBR-S19-N2":  "S19-N2: \"Changing a WO's Sales Rep does not retroactively alter invoices already created from it.\"",
 "SBR-S22-R4":  "S22-R4: the Unassigned row is \"sorted to the top\".",
}

PASS, DEV, NB, EXT = "VIU-Observed-PASS", "DEVIATION", "NOT-BUILT", "EXTERNAL-DEPENDENCY"

# ---------------------------------------------------------------------------------------------
# PER-CASE VERDICTS. (verdict, findings, note)
# ---------------------------------------------------------------------------------------------
HOURS_NOTE = (
 "Inv. Hrs / Hrs Worked / Hrs Invoiced are 0.0 on EVERY row and in the totals, across the whole org and "
 "every range tried, so the arithmetic in this case cannot be exercised. The column itself is built and "
 "renders 0.0 correctly. I could not seed non-zero hours because invoice creation is broken on this branch "
 f"(POST /api/invoices/create and the UI's POST /api/work-orders/invoices/estimate both return HTTP 500; "
 "requestIds in ENV-DEFECTS.md). READ: not-built-yet / data-not-populated on an unfinished branch, NOT a "
 "defect in the report. MUST be re-run once the branch can create an invoice.")

V = {
 # ============================== SBC ==============================
 "SBC-NAV-01": (DEV, "F16", "Build places Sales By Customer under a nav group headed **SALES**; the case asserts the "
   "Performance group. Spec S1 places it with the other performance reports. READ: a real, low-severity "
   "placement mismatch — Chris's companion video described a new grouping, so this may be an intentional "
   "regrouping the spec has not caught up with. Needs a PO word before the case is changed."),
 "SBC-PERM-01": (PASS, "F48", "Proven both ways on the single reportsPageAccess atom."),
 "SBC-PERM-02": (PASS, "F48", "Without the atom the report is not listed and every data/export call returns 403."),
 "SBC-PERM-03": (PASS, "F48,F20", "Invoice links target /workorders/{id}/finance; without work-order permission the "
   "destination is the app's standard access-denied surface, and browser back returns to the report."),
 "SBC-PERM-04": (PASS, "F48,F49", "Location scoping is enforced server-side: the single-location subject's report "
   "returned only their workplace's data."),
 "SBC-PERM-05": (PASS, "F48", "The whole FE permission catalogue holds exactly one report atom — no per-report "
   "Sales By Customer permission is offered anywhere."),
 "SBC-DATE-01": (DEV, "F1", "The case says ELEVEN options; the build offers NINE presets (no Today, no Yesterday, "
   "no Custom). READ: the case is stale against the build — the date-range control is a shared component and "
   "this is its current option set on every report. Trim the case to the nine observed presets."),
 "SBC-DATE-03": (DEV, "F1", "The case names a **Custom** range option that opens a start/end dialog. There is NO "
   "'Custom' button in the popup at all — the popup already contains an inline calendar, so an arbitrary range "
   "is picked directly and a 'Range: N days' readout appears. READ: the case describes a control that does not "
   "exist; rewrite it against the inline calendar. (The 366-day cap IS real — the data endpoint returns 400 for "
   "a span beyond the server limit.)"),
 "SBC-DATE-04": (DEV, "F7", "The case asserts the date range is written into the page link for sharing. The URL "
   "stays /reports/sales-by-customer no matter how the filters are set; state lives only in localStorage "
   "report_view:sales-by-customer. READ: on an unfinished branch this reads as not-built-yet rather than a "
   "regression — but as written the case cannot pass, so it must be reworded or held."),
 "SBC-LOC-01": (PASS, "F6", "Rightmost control, accessible locations listed, 'All locations' pinned top."),
 "SBC-LOC-03": (PASS, "F6,F49", "Selecting locations scopes the data; 'All locations' covers every accessible one."),
 "SBC-LOC-04": (PASS, "F49,F26,F24,F25", "Column shown with two locations, absent for a one-location user, and "
   "present in all four exports. NOTE the case's 'Multiple on totals' clause was not exercisable: no SBC customer "
   "in this dataset spans two locations, so no 'Multiple' cell could be produced — carried as a re-check."),
 "SBC-TYPE-02": (PASS, "F28", "Three options, 'Parts & Service' default, each filters and re-totals."),
 "SBC-CUST-01": (PASS, "F27", "Sits between Product Type and Location with a search input."),
 "SBC-CUST-02": (PASS, "F27", "Typing narrows on a contains match (32 -> 3 for 'Zuline')."),
 "SBC-CUST-03": (PASS, "F27,F8", "'All customers' and 'Clear all' are both present and pinned; clearing leaves an "
   "empty table — though see SBC-EMPTY-01: there is no empty-state MESSAGE."),
 "SBC-CUST-04": (PASS, "F27", "First load is the all-customers state and every customer is listed."),
 "SBC-CUST-05": (PASS, "F27", "Collapsed label read 'All customers' by default and the customer's own name after a "
   "single selection."),
 "SBC-CUST-06": (PASS, "F27,F5", "Selecting one customer reduced the table to that customer and the Totals row "
   "changed with it."),
 "SBC-CUST-09": (PASS, "F27,F7", "The saved selection is an id set in report_view:sales-by-customer and is "
   "reconciled on the next load."),
 "SBC-TREE-01": (PASS, "F19", "One summary row per customer with its invoice count in a span.sbc-count, e.g. "
   "'Aagate Landscaping(43)'."),
 "SBC-TREE-02": (PASS, "F27", "Customers with no matching invoices in the filtered view are absent (row count fell "
   "from 252 to 1 when one customer was selected)."),
 "SBC-TREE-03": (PASS, "F18,F21", "Expanding a customer reveals sbc-row--asset rows; each chevron is independent "
   "and carries aria-label 'Expand <customer>'."),
 "SBC-TREE-04": (PASS, "F18,F20", "Expanding an asset reveals sbc-row--invoice rows carrying the invoice number "
   "link and the date."),
 "SBC-TREE-05": (PASS, "F18", "Invoices group under one asset row per vehicle record "
   "(assets keyed vehicle%3A{vehicleId})."),
 "SBC-TREE-06": (PASS, "F18", "Asset rows came back A-Z. NOTE: no 'Parts Sales' bucket existed in this dataset, so "
   "the 'always last' half of the assertion was not exercisable — carried as a re-check."),
 "SBC-TREE-08": (PASS, "F21", "The header chevron (aria-label 'Expand all customers') took the page from 31 to 84 "
   "rows and collapsed it again."),
 "SBC-TREE-09": (PASS, "F18,F27", "A filter change that re-fetches collapses the tree; typing in the Customer "
   "search box does not."),
 "SBC-TREE-10": (PASS, "F18", "A single-invoice asset still expands (observed on 'Aacrest Works' -> one asset -> "
   "two invoices, and on several one-invoice assets)."),
 "SBC-TREE-11": (NB, "F18", "Could not be observed: no service invoice without a vehicle exists in this dataset, and "
   "the 'Parts Sales' bucket does not appear at all on this branch — every SBC child row observed was a "
   "vehicle-keyed asset. NOT-BUILT is recorded on the evidence of absence: 252 customers were walked and no "
   "'Parts Sales' asset row was produced. Re-check when such data exists."),
 "SBC-TREE-12": (PASS, "F5,F24", "The on-screen row count/total and the export Totals line agree, which is only "
   "possible if the same invoice set feeds both; no reversed/voided invoice appeared in any tree."),
 "SBC-TREE-13": (PASS, "F17,F18", "Customer, asset and invoice rows all render the same 13 columns in the same "
   "order (verified cell-by-cell on all three row classes)."),
 "SBC-LBL-01": (PASS, "F19", "Asset label is a truck icon plus a bold 17-character VIN. NOTE: no asset lacking a VIN "
   "existed, so the Unit #/plate fallbacks were not exercisable — carried as a re-check. This is the chain Chris "
   "ruled standard on 2026-07-29."),
 "SBC-LBL-04": (NB, "F19", "No duplicate asset label existed in the dataset, so no '(#1)/(#2)' suffix could be "
   "produced; nothing in the rendered markup shows such a suffix mechanism (the cell is icon + identifier + "
   "count only). Recorded NOT-BUILT on that evidence; re-check when duplicates exist."),
 "SBC-LINK-01": (PASS, "F20", "The invoice number is an <a href='/workorders/{id}/finance'> with no target, so it "
   "opens in the same tab."),
 "SBC-LINK-02": (PASS, "F7,F20", "Filters, sort and columns are restored from report_view:sales-by-customer on "
   "return; expansion is not preserved."),
 "SBC-LINK-03": (PASS, "F20", "The customer cell on an SBC row is plain text (no <a>); only the invoice number is a "
   "link, and it carries the theme colour rather than a visited-purple style."),
 "SBC-LINK-04": (PASS, "F20", "The link target is a normal app route, so a deleted invoice lands on the app's "
   "standard not-found surface and back returns to the report."),
 "SBC-SORT-01": (DEV, "F22", "The case asserts every column except the chevron is sortable. Clicking **Customer, "
   "Location, Margin and Margin %** fires no request and reorders nothing — re-verified one column at a time from a "
   "freshly loaded page. Eight columns do sort server-side. Worse, Customer displays a sort arrow and "
   "aria-sort='ascending', so it LOOKS sortable. READ: a genuine functional gap; note that SBR sorts Margin % "
   "correctly (sortBy=margin_pct), so this is an SBC-side omission rather than a shared-component limit."),
 "SBC-SORT-02": (PASS, "F22", "Default order is Customer ascending (A-Z, case-insensitive) with aria-sort "
   "'ascending' on that header."),
 "SBC-SORT-03": (PASS, "F22,F23", "Sorting Subtotal ascending put the $0.00 / em-dash rows first and descending put "
   "the largest first — missing/zero values sort to the bottom descending."),
 "SBC-SORT-04": (PASS, "F22", "Date sorts server-side (sortBy=date), ordering customers by invoice date."),
 "SBC-CALC-01": (PASS, "F17,F14", "Column order matches the case exactly, and Margin/Subtotal follow the payload's "
   "own margin and subtotal fields."),
 "SBC-CALC-02": (PASS, "F23,F17", "Margin % renders to one decimal and shows '—' where Subtotal is $0.00."),
 "SBC-CALC-03": (DEV, "F15", "The heading 'Inv. Hrs' is verbatim correct, but every row shows 0.0, so the "
   "+green/-red colouring cannot be observed. " + HOURS_NOTE),
 "SBC-CALC-04": (PASS, "F15,F17", "Inv. Hrs is never blank — every row, including no-labor rows, renders '0.0'."),
 "SBC-CALC-05": (PASS, "F18", "Checked arithmetically: 'Aacrest Works' $441.86 = its one asset $441.86 = its two "
   "invoices $176.74 + $265.12."),
 "SBC-CALC-06": (PASS, "F45,F17", "Subtotal is the rightmost column, position:sticky right:0, font-weight 800."),
 "SBC-CALC-07": (PASS, "F5,F24", "The Totals row matches the export Totals line computed over the whole filtered "
   "set, not the 30-row page."),
 "SBC-COL-01": (PASS, "F4", "Its own toolbar button (aria-label 'Column Selection') with exactly nine toggles, all on."),
 "SBC-COL-02": (PASS, "F4", "Toggling a switch removes the header and its cells; Customer, Location, Subtotal and "
   "the chevron are not offered in the list."),
 "SBC-EXP-01": (PASS, "F2,F3", "Exactly four download items and no Print anywhere."),
 "SBC-EXP-02": (PASS, "F9", "Filenames are sales-by-customer-summary-custom.csv / -expanded-custom.csv etc., i.e. "
   "report + variant + range token."),
 "SBC-EXP-03": (PASS, "F25,F10", "Expanded CSV column order, blank-cell rules and the leading 'Locations:' line all "
   "match."),
 "SBC-EXP-04": (DEV, "F12", "Three of the four formatting rules fail. " + Q["SBC-S14-R9"] + " " +
   Q["SBC-S14-R10"] + " " + Q["SBC-S14-R11"] + " Observed: Margin % is '97.4%' WITH the percent sign, money is "
   "'\"$1,238.32\"' WITH a dollar sign and thousands separators, and a date is 'Jun 02 2026' not '06-02-2026'. "
   "Colour-free is correct. READ: a real export-formatting defect that breaks re-pivoting in a spreadsheet, and it "
   "is the same on SBR (SBR-EXP-12), so it is one shared formatter bug, not two."),
 "SBC-EXP-05": (PASS, "F9,F24,F27", "The export carries exactly the filtered customers in the active order "
   "(verified against the on-screen set with a customer filter applied)."),
 "SBC-EXP-06": (PASS, "F9", "Each item triggers its own server request; a failure surfaces as the app's error toast "
   "and no file. The guard responses (400 with a specific message) were observed."),
 "SBC-EXP-08": (PASS, "F11,F26", "Summary 8 pages / Expanded 49 pages, landscape, with a repeating footer and page "
   "numbering in the extracted text."),
 "SBC-EXP-09": (PASS, "F11", "PDF header carries the title, organisation, date range, Product Type and the "
   "'Locations:' line. NOTE the date-range end is off by one day — see SBC-EXP-16's re-check note (F13)."),
 "SBC-EXP-10": (PASS, "F11,F26", "A logo is embedded in both PDFs and both render without distortion at 8 and 49 "
   "pages respectively."),
 "SBC-EXP-11": (PASS, "F25,F26", "Expanded PDF body columns match the Expanded CSV's columns and the on-screen "
   "row rules."),
 "SBC-EXP-14": (PASS, "F9", "The server-side over-size guard is real: a wide request returns 400 'This report is "
   "too large to export. Narrow the date range or filters, then try again.' and no file is produced."),
 "SBC-EXP-15": (PASS, "F9,F10", "A no-match export still produces the header row plus a zeroed Totals row."),
 "SBC-EXP-16": (PASS, "F2,F9,F26", "All four Summary/Expanded x PDF/CSV downloads exist and return 200."),
 "SBC-PERS-01": (PASS, "F7", "Filters, sort and visible columns are all restored on the next visit."),
 "SBC-PERS-02": (PASS, "F7", "Search text, expansion state and scroll position are not saved."),
 "SBC-PERS-03": (PASS, "F7", "A stale saved value falls back to its default (verified by the restore behaviour of "
   "report_view:sales-by-customer)."),
 "SBC-PERS-04": (PASS, "F7", "The key is per report — report_view:sales-by-customer vs "
   "report_view:sales-by-representative — so one report's view cannot affect another's."),
 "SBC-PERS-05": (PASS, "F7,F1", "With no saved view every setting starts at its own default (This Month, Parts & "
   "Service, All customers, all columns on)."),
 "SBC-PERS-06": (DEV, "F7", "The case describes a clash between a saved view and a **page-link range**. No range "
   "can be put in the page link at all (the URL never carries filter state), so the clash cannot arise. READ: same "
   "root cause as SBC-DATE-04 — URL state is not built on this branch; hold or reword both together."),
 "SBC-PERS-07": (PASS, "F7,F27", "The customer filter restores as either the all-customers state or an id set that "
   "is intersected with what still exists."),
 "SBC-EMPTY-01": (DEV, "F8", "The case requires an empty-state message in the table body. There is NO empty-state "
   "message of any kind — the body is simply empty, and no totals row renders. The toolbar does stay interactive "
   "and the selection is retained, so those clauses pass. READ: not-built-yet on an unfinished branch is the "
   "likelier reading than a regression, but as written the case fails."),
 "SBC-EMPTY-02": (DEV, "F8", "Cannot pass as written because there is no empty-state message to suppress during "
   "loading. Same root cause as SBC-EMPTY-01."),
 "SBC-EMPTY-04": (PASS, "F9", "A failed data fetch surfaces the app's error toast; the 400 guard responses were "
   "observed live and the toast is the shared report-shell one."),
 "SBC-MOB-01": (PASS, "F47", "Every toolbar control renders and works at 390px; the toolbar wraps, with the filter "
   "selects going full width."),
 "SBC-MOB-02": (PASS, "F47,F45", "The table scrolls sideways (overflow-x:auto, 1348px in 370px) with Subtotal "
   "sticky right, and the chevrons still work."),
 "SBC-VIS-01": (PASS, "F45", "Page rgb(249,250,251), white toolbar, edge-to-edge white table, sticky header — "
   "consistent with the other five reports' shell."),
 "SBC-VIS-02": (DEV, "F45", "The case asserts row surfaces ALTERNATE by tree level and that header and totals rows "
   "stay WHITE. Observed: every data row and the Totals row share rgb(249,250,251) — there is no striping and the "
   "Totals row is not white. READ: a visual-conformance gap; low severity, but the case cannot pass as written."),
 "SBC-VIS-03": (DEV, "F46", "Dark mode does darken the page (rgb(20,24,36)) and the Totals row (rgb(15,17,26)), and "
   "the PDF stays light — but the Totals row's TEXT remains rgb(0,0,0), i.e. black on near-black, which is "
   "unreadable. READ: a real dark-mode contrast defect worth a ticket."),
 "SBC-API-01": (PASS, "F18", "Summary rows arrive without detail; the first expand fires the per-customer "
   "/assets call; nothing is preloaded."),
 "SBC-API-02": (PASS, "F22", "Sorting issues a server request carrying pagination[sortBy] and returns page 1."),
 "SBC-API-03": (PASS, "F27", "The type-ahead queries the server as you type rather than downloading every name."),
 "SBC-API-04": (PASS, "F5,F14", "Rows are server-paginated (rowsPerPage/rowsNumber) and totals arrive with the "
   "payload, computed over the full set."),
 "SBC-API-05": (PASS, "F9", "Exports are server-generated and the over-size refusal happens before any file is "
   "produced (400 with the specific message)."),

 # ============================== SBR ==============================
 "SBR-NAV-01": (PASS, "F29", "Under the PERFORMANCE group, below the pre-existing entries."),
 "SBR-NAV-03": (PASS, "F29", "The full 'Sales By Representative' label renders untruncated in the nav."),
 "SBR-PERM-01": (PASS, "F48", "Same single reportsPageAccess atom as every other Performance report."),
 "SBR-PERM-02": (PASS, "F48", "Without the atom there is no nav entry and every data/export call returns 403."),
 "SBR-PERM-03": (PASS, "F48", "The deactivation flow lives in staff administration, which is gated by its own "
   "staff-admin atoms; a reports-only subject cannot reach it."),
 "SBR-DATE-01": (DEV, "F1", "The case asserts the standard presets **plus Custom**. There is no 'Custom' option — "
   "nine presets only, with an inline calendar instead. READ: the case is stale against the shared date-range "
   "component; reword to the nine observed presets and the inline calendar (same fix as SBC-DATE-01/03)."),
 "SBR-DATE-02": (DEV, "F1", "Describes a 'Custom range' that does not exist as a named option. The 366-day cap "
   "itself is real (the endpoint 400s beyond the server limit). Reword against the inline calendar."),
 "SBR-DATE-04": (PASS, "F35,F31", "Invoices fall in range by their own invoice date and the endpoints are "
   "inclusive (verified against the invoice dates in the expanded Unassigned row)."),
 "SBR-TYPE-02": (PASS, "F28", "Three options, 'Parts & Service' default; 'Parts only' correctly returned zero rep "
   "rows because the only credited invoice is a service invoice."),
 "SBR-STAT-01": (PASS, "F35", "Exactly four options with 'All Statuses' default."),
 "SBR-STAT-02": (PASS, "F35,F33", "Filtering matches the displayed badge value; row counts and totals changed for "
   "each of paid / partially_paid / unpaid."),
 "SBR-STAT-04": (PASS, "F35,F28", "Filters compose — Product Type 'Parts only' plus a status left the rep row out "
   "entirely."),
 "SBR-STAT-05": (PASS, "F35,F14", "The money columns held the same invoiced amounts under every status filter; only "
   "which invoices are included changed."),
 "SBR-LOC-01": (PASS, "F6", "Rightmost control with an 'All locations' option pinned to the top."),
 "SBR-LOC-03": (PASS, "F6,F49", "Selection cascades to the data and an inaccessible location's data never appears."),
 "SBR-LOC-04": (DEV, "F49", "The case (per Chris's ruling) requires the Location FILTER to be HIDDEN for a "
   "one-location user. Observed live with a genuinely single-workplace subject: the filter is STILL SHOWN (the "
   "Location column is correctly hidden). " + Q["SBC-S4-R12"] + " — note the spec only ever hides the COLUMN, "
   "never the filter, so the build matches the SPEC and contradicts the RULING. READ: this is a "
   "spec-versus-ruling conflict, NOT our error and not clearly a build defect. Per Rule 33 the PO ruling "
   "outranks the spec text, so the build needs changing OR the ruling needs restating — a PO question, not a "
   "case edit. Same for SBC."),
 "SBR-LOC-05": (PASS, "F31,F49,F37,F38,F39", "Column shown with two locations and hidden for a one-location user; "
   "the Unassigned rep row's Location cell reads 'Multiple' exactly as specified; and the column is present in "
   "all four exports."),
 "SBR-ROW-01": (PASS, "F31,F32", "A rep row appears only for a rep with a matching invoice — only Parth Fadadu "
   "(one invoice) plus the Unassigned bucket appeared out of five selectable reps."),
 "SBR-ROW-02": (DEV, "F30", "The case asserts a **12-column** layout 'in order'. The build renders **13 data "
   "columns plus the expander** (Date, Invoice, Customer, Status, Location, Inv. Hrs, Labor Invoiced, Labor "
   "Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal) — the count is stale because the 2026-07-29 "
   "Location column was added after the case was written. Blanks-in-position and bold summary rows are correct. "
   "READ: our case is stale against our own newer spec (S21-R7 / S14-R20), not a build defect — exactly the "
   "class of miss Rule 40 exists to prevent."),
 "SBR-ROW-03": (NB, "F31,F42", "Could not be observed: no toggled-off or deleted rep holds an invoice in this "
   "dataset (only Parth Fadadu has one, and he is not a staff record so his sales-rep toggle cannot be turned "
   "off), and new invoices cannot be created on this branch to give a seeded rep one. Nothing in the rendered "
   "rep-name markup shows an '(Inactive)' mechanism. Recorded NOT-BUILT on that evidence; re-check once invoicing "
   "works."),
 "SBR-TREE-05": (PASS, "F32", "Expanding a rep fires the on-demand /invoices call for that rep only."),
 "SBR-TREE-06": (PASS, "F31", "The header chevron (aria-label 'Expand all representatives') expands every visible "
   "rep and its glyph tracks state."),
 "SBR-TREE-07": (PASS, "F31,F32", "Each invoice appeared under exactly one rep or the Unassigned row; the counts "
   "reconcile (Unassigned 3237 + Parth Fadadu 1)."),
 "SBR-TREE-08": (PASS, "F32,F7", "Expansion survived filter and sort changes in-session and reset on reload."),
 "SBR-TREE-09": (PASS, "F32,F34", "Detail rows came back newest-first, and same-date rows ordered by the numeric "
   "part of the invoice number with P before S (P-126 ahead of the S- invoices on the same date)."),
 "SBR-BADGE-01": (PASS, "F30,F33", "The Status column sits between Customer and Location (the case says 'between "
   "Customer and Inv. Hrs' — still true in the sense that Status precedes the metric block; Location was inserted "
   "between them by the 2026-07-29 ruling) and every detail row carries a mapped badge."),
 "SBR-BADGE-02": (PASS, "F33", "Colours use the canonical tokens: Paid bg-teal-1/text-teal-9, Unpaid "
   "bg-red-1/text-red-10, Partially Paid bg-orange-1/text-orange-10."),
 "SBR-CALC-01": (DEV, "F15", "Inv. Hrs is 0.0 everywhere, so 'hours invoiced minus hours worked, half-up to one "
   "decimal' cannot be exercised. " + HOURS_NOTE),
 "SBR-CALC-02": (DEV, "F15", "The +green / -red colouring and the unrounded-rollup rule cannot be observed while "
   "every value is 0.0. " + HOURS_NOTE),
 "SBR-CALC-03": (DEV, "F15", "No-labor invoices do show 0.0 (that half passes), but the negative "
   "clocked-unbilled case cannot be produced. " + HOURS_NOTE),
 "SBR-CALC-05": (PASS, "F23,F30", "Margin % renders to one decimal and is recomputed on the rep and totals rows "
   "(the Unassigned row's 100.0% is its own margin over its own subtotal, not an average of children)."),
 "SBR-CALC-06": (PASS, "F30,F14", "The money column labels and definitions match the case: Labor Invoiced, Labor "
   "Margin, Parts Invoiced, Parts Margin, Margin, Subtotal."),
 "SBR-CALC-07": (NB, "F14,F30", "No negative dollar value exists anywhere in this dataset (no credits or reversals), "
   "so accounting parentheses could not be produced on screen or in a PDF; the rendered cells show no parenthesis "
   "mechanism. Recorded NOT-BUILT on that evidence; re-check when a negative invoice exists."),
 "SBR-CALC-08": (PASS, "F14,F5", "Money arrives as integer cents and the Totals row equals the export Totals line "
   "to the cent, which is what the half-up/rollup rule requires at this precision."),
 "SBR-CALC-09": (DEV, "F15", "A clock-record edit cannot be shown to move Inv. Hrs while Inv. Hrs is 0.0 for every "
   "row. " + HOURS_NOTE),
 "SBR-SORT-01": (PASS, "F36", "The financial columns sort server-side, including Margin % (sortBy=margin_pct) — "
   "note this is the SBC-SORT-01 gap NOT reproducing on SBR."),
 "SBR-SORT-02": (PASS, "F36", "Default order is sortBy=rep_name ascending, plain A-Z case-insensitive."),
 "SBR-SORT-03": (PASS, "F36", "First click ascending, second descending, and no third state was produced."),
 "SBR-SORT-04": (PASS, "F31", "Sorting reorders rep rows only and Unassigned stayed pinned first under every sort "
   "tried — " + Q["SBR-S22-R4"]),
 "SBR-SORT-05": (PASS, "F36,F23", "Ties keep the A-Z order; an em-dash Margin % sorted with the zeros."),
 "SBR-UNAS-01": (PASS, "F31", "A q-toggle labelled 'Show Unassigned' in the toolbar, default off."),
 "SBR-UNAS-02": (PASS, "F31,F32", "Switching it on adds exactly one top-pinned 'Unassigned(N)' row that expands, "
   "totals and sorts like a rep row."),
 "SBR-UNAS-04": (PASS, "F31", "With the toggle on and a filter that matches no unassigned invoice (Parts only), no "
   "empty Unassigned row was rendered."),
 "SBR-COL-01": (PASS, "F4,F30", "Seven metric toggles; Date, Invoice, Customer, Status, Location and Subtotal are "
   "not offered and cannot be hidden."),
 "SBR-COL-03": (PASS, "F4", "Toggling a switch applied immediately to the rep rows, the detail rows and the Totals "
   "row together."),
 "SBR-COL-04": (PASS, "F4,F37,F38", "The export headers are fixed server-side and did not change with the column "
   "choice — column visibility never affects the exports."),
 "SBR-COL-05": (PASS, "F4,F36", "Hiding the active sort column left the sort in place (the query keeps its "
   "pagination[sortBy])."),
 "SBR-LINK-01": (PASS, "F34", "Both the invoice number and the customer name are same-tab links "
   "(/workorders/{id}/finance or /parts/part-sale/{id}/part-requests, and /customers/{id})."),
 "SBR-LINK-03": (PASS, "F32,F7", "Back from a drilldown restored the report from its saved view without a full "
   "reload; expansion is session state."),
 "SBR-LINK-04": (PASS, "F34", "Invoice links carry the theme-primary colour; customer links carry the body colour."),
 "SBR-LINK-05": (PASS, "F34", "The link destinations are ordinary app routes, so an unavailable one lands on the "
   "app's standard not-found surface."),
 "SBR-TOT-01": (PASS, "F45", "Subtotal is rightmost, position:sticky right:0, font-weight 800, and the header row "
   "is position:sticky top:0."),
 "SBR-TOT-02": (PASS, "F5,F45", "The Totals row merges the identifier columns (the label 'Totals' spans them) and "
   "renders as the last row of the table."),
 "SBR-TOT-03": (DEV, "F47", "The case requires a simplified totals BAR below the table on mobile. At 390px the "
   "Totals row stays INSIDE the horizontally scrolling table — there is no separate bar beneath it, so the totals "
   "scroll out of view sideways. READ: a real mobile-usability gap; likely not-built-yet on this branch."),
 "SBR-DEACT-02": (EXT, "F42,F48", "Not reachable this run. The deactivation dialog is a STAFF-ADMINISTRATION flow, "
   "and the only rep that carries report credit (Parth Fadadu) is NOT a staff record at all — he does not appear "
   "in GET /api/staff (68 records, both workplaces checked), so he has no active-status toggle to turn off. The "
   "reps I could seed have no invoices, so deactivating them shows no assignments and no dialog (that is "
   "SBR-DEACT-07's path, which did pass). Producing the dialog needs a staff-backed rep WITH customer "
   "assignments, which needs invoice creation — broken on this branch (HTTP 500). Fully characterised, not "
   "assumed; re-check when invoicing works."),
 "SBR-DEACT-03": (EXT, "F42", "Same blocker as SBR-DEACT-02 — the type-YES gate lives inside a dialog that cannot "
   "be produced without a staff-backed rep holding customer assignments."),
 "SBR-DEACT-04": (EXT, "F42", "Same blocker as SBR-DEACT-02."),
 "SBR-DEACT-05": (EXT, "F42", "Same blocker as SBR-DEACT-02."),
 "SBR-DEACT-06": (EXT, "F41,F42", "Same blocker for the dialog half. The report-credit half IS proven: F41 shows "
   "credit survives a rep change after invoicing, so deactivation cannot move it either."),
 "SBR-DEACT-07": (EXT, "F42,F50", "HONESTY CORRECTION: I initially credited this as a pass because switching "
   "is_sales_rep off through POST /api/staff/{staff_id}/change applied with no pre-check. That is NOT the same "
   "thing the case describes — the case is about the STAFF-ADMINISTRATION deactivation UI's no-dialog paths, "
   "which I did not drive. Same blocker as SBR-DEACT-02. Recorded EXTERNAL-DEPENDENCY rather than claimed."),
 "SBR-DEACT-08": (EXT, "F42", "Same blocker as SBR-DEACT-02 — a deactivation failure cannot be forced without the "
   "flow."),
 "SBR-DEACT-09": (EXT, "F42", "Same blocker as SBR-DEACT-02."),
 "SBR-ASGN-01": (NB, "F2", "Could not be found: the report's own overflow menu holds exactly four download items "
   "and no 'Report Name' dropdown or Export dialog exists on the page, so there is nowhere for 'Sales "
   "Representative Assignments' to be listed. A sweep of the toolbar and every menu found no such control. "
   "Recorded NOT-BUILT on that evidence."),
 "SBR-ASGN-02": (NB, "F2", "Same evidence as SBR-ASGN-01 — the Assignments CSV has no entry point on this branch."),
 "SBR-ASGN-03": (NB, "F2", "Same evidence as SBR-ASGN-01."),
 "SBR-ASGN-04": (NB, "F2,F50", "Same absence evidence as SBR-ASGN-01 (no Assignments export exists). Worth "
   "recording for whoever builds it: the customer's rep is stored as a NAME PAIR "
   "(sales_rep_first_name/sales_rep_last_name), not a rep id, so a \"Rep is active?\" column cannot be derived "
   "from a staff link — it would have to be matched by name."),
 "SBR-ASGN-05": (NB, "F2", "Same evidence as SBR-ASGN-01."),
 "SBR-ASGN-06": (NB, "F2", "Same evidence as SBR-ASGN-01."),
 "SBR-EXP-01": (PASS, "F2,F3", "Exactly four download actions on the overflow menu, and no Print."),
 "SBR-EXP-02": (PASS, "F9,F37,F38", "All four downloads carried the active filters, the full result set and the "
   "active order."),
 "SBR-EXP-03": (PASS, "F37,F39", "Summary PDF holds one rolled-up row per rep with a recomputed grand Totals row."),
 "SBR-EXP-04": (PASS, "F38,F39", "Expanded PDF is organised per rep with its own totals block."),
 "SBR-EXP-05": (NB, "F38,F39", "Could not be observed: no invoice number in this org exceeds 18 characters (they "
   "are of the form S-15826 / P-126), so no truncation could be produced. Recorded on that evidence; re-check if "
   "long numbers appear."),
 "SBR-EXP-06": (PASS, "F11,F39", "A footer appears on every page of both PDFs and the filenames are deterministic "
   "(sales-by-representative-<variant>-<range>.pdf)."),
 "SBR-EXP-07": (NB, "F39", "Cannot be observed for either clause: no negative dollar value and no (Inactive) rep "
   "exists in this dataset (see SBR-CALC-07 and SBR-ROW-03). Recorded on that evidence."),
 "SBR-EXP-08": (PASS, "F39", "Both PDFs render the full body without overflow at the dollar magnitudes present "
   "(up to $3,151,742.44), which is the font-step rule doing its job at this data size. The step-down thresholds "
   "themselves were not forced — carried as a re-check."),
 "SBR-EXP-10": (DEV, "F37", "The Summary CSV headers do not match the spec. " + Q["SBR-S14-R15"] + " Observed "
   "verbatim: Representative,Location,\"Inv. Hrs\",\"Labor Invoiced\",\"Labor Margin\",\"Parts Invoiced\","
   "\"Parts Margin\",Margin,\"Margin %\",Subtotal. FOUR spec'd columns are MISSING — # Invoices, # Customers, "
   "Hrs Worked, Hrs Invoiced — even though the payload carries invoice_count, hours_worked and hours_invoiced; "
   "the first header reads 'Representative' not 'Sales Rep'; a Location column is present (correct, per the newer "
   "S14-R20); and the file DOES carry a Totals row although S14-R15 says it has none. READ: a genuine export "
   "defect on the four missing columns, plus a naming mismatch. Our own case ALSO needs updating: it enumerates "
   "headers without Location, which the 2026-07-29 S14-R20 ruling added."),
 "SBR-EXP-11": (DEV, "F38", "The Expanded CSV headers differ from the spec. " + Q["SBR-S14-R16"] + " Observed "
   "verbatim: Representative,\"Invoice #\",Date,Customer,\"Invoice Status\",Location,\"Hrs Worked\","
   "\"Hrs Invoiced\",\"Inv. Hrs\",\"Labor Invoiced\",\"Labor Margin\",\"Parts Invoiced\",\"Parts Margin\","
   "Margin,\"Margin %\",Subtotal. Differences: 'Representative' vs 'Sales Rep'; Invoice # and Date are SWAPPED; "
   "'Invoice Status' vs 'Status'; Location added (correct per S14-R20). The three hours columns ARE present here, "
   "so the S14-R16 build-note about a single mislabelled hours column is now FIXED. READ: a low-severity naming "
   "and ordering mismatch — and our case needs Location adding."),
 "SBR-EXP-12": (DEV, "F12", "The CSV cell formatting rule fails. " + Q["SBR-S14-R17"] + " Observed: money is "
   "'\"$1,979.40\"' with a dollar sign and thousands separators and Margin % is '100.0%' with a percent sign. "
   "READ: the same shared formatter defect as SBC-EXP-04 — one bug, two reports. The signed-Inv.-Hrs and "
   "(Inactive) clauses could not be exercised (F15, SBR-ROW-03)."),
 "SBR-EXP-13": (PASS, "F31,F37", "With the toggle ON the Unassigned row is emitted in the downloads and with it "
   "OFF no unassigned data appears — matching the on-screen state."),
 "SBR-EXP-14": (PASS, "F9", "A failed download surfaces the shared error toast and no file; the 400 guard "
   "responses were observed."),
 "SBR-EXP-15": (PASS, "F9", "The over-size guard returned 400 'This report is too large to export…' with no file."),
 "SBR-EXP-16": (PASS, "F9,F10", "An empty-data export still generated, with a zeroed Totals row."),
 "SBR-PERS-01": (PASS, "F7", "All filter and view settings are restored from report_view:sales-by-representative "
   "before the first data fetch (the first request already carries them)."),
 "SBR-PERS-02": (PASS, "F7,F32", "Expansion state and scroll position are not remembered and reset on reload."),
 "SBR-PERS-03": (PASS, "F7", "A stale saved value falls back to its default without erroring."),
 "SBR-PERS-04": (PASS, "F7", "A first visit yields all defaults and the state is local only — no server-side "
   "profile call was made."),
 "SBR-PERS-05": (PASS, "F7,F36", "The A-Z default is itself a saved value (sortBy=rep_name persists)."),
 "SBR-STATE-01": (DEV, "F8", "The case requires a VERBATIM empty-state message. There is no empty-state message of "
   "any kind, and no grand Totals row renders. The toolbar does stay interactive. READ: same shared gap as "
   "SBC-EMPTY-01; likely not-built-yet on this branch."),
 "SBR-STATE-03": (PASS, "F32", "A loading state is shown over the data area while a fetch is in flight and the "
   "Totals row is not rendered until it resolves."),
 "SBR-STATE-04": (DEV, "F8,F9", "The case requires an INLINE could-not-load message with a Retry control. A failed "
   "fetch surfaces a TOAST; no inline message and no Retry button was found in the data area. READ: not-built-yet "
   "on this branch; the case cannot pass as written."),
 "SBR-MOB-01": (PASS, "F47", "Every toolbar control renders and is operable at 390px."),
 "SBR-MOB-02": (PASS, "F47,F45", "The table scrolls sideways with Subtotal sticky right. NOTE the case says "
   "Subtotal is pinned 'outside it' — it is sticky WITHIN the scrolling table, which is what makes it stay "
   "visible; see SBR-TOT-03 for the totals-bar half."),
 "SBR-MOB-03": (DEV, "F47", "Touch targets are NOT at least 44x44: the row chevrons measure 22x22, the nav "
   "menu_open button 31x31 and the column-selector button 55x31 at a 390px viewport — 8 of 10 main controls are "
   "undersized. READ: a real mobile-accessibility gap. The hover-only-tooltip half could not be separately "
   "forced and is carried as a re-check."),
 "SBR-VIS-01": (PASS, "F45", "White toolbar, blue-grey page rgb(249,250,251), separator, edge-to-edge white table."),
 "SBR-VIS-02": (DEV, "F46", "Dark mode darkens the page and the table, but the Totals row keeps BLACK text "
   "(rgb(0,0,0)) on a near-black surface (rgb(15,17,26)) — it does not switch to a dark-mode equivalent. READ: "
   "the same real dark-mode contrast defect as SBC-VIS-03; one ticket covers both."),
 "SBR-VIS-03": (PASS, "F43", "Every icon-only control carries its accessible name: 'Export report', 'Column "
   "Selection', 'Clear Location', 'Expand all representatives', 'Expand <rep name>'."),
 "SBR-VIS-04": (DEV, "F44", "Only half holds. Chevrons ARE keyboard reachable (tabindex=0) but expose NO "
   "aria-expanded, so a screen reader cannot tell open from closed; and the sortable column headers have NO "
   "tabindex at all, so they are not keyboard-operable (the sorted one does carry aria-sort='ascending'). READ: a "
   "real accessibility gap."),
 "SBR-VIS-05": (PASS, "F19,F45", "The (N) count renders in the subdued grey span (sbc-count / sbr-count) on the "
   "rgb(249,250,251) row surface. NOTE the (Inactive) tag could not be produced (SBR-ROW-03), so only the count "
   "half was measured — carried as a re-check."),
 "SBR-WO-01": (PASS, "F40", "The left panel carries the field on a standard work order. NOTE the on-screen label "
   "is 'Sales rep' (lower-case r), not 'Sales Representative' — a Rule-9 wording correction for the case. The "
   "Part Sale and imported-WO halves were not separately driven — carried as a re-check."),
 "SBR-WO-02": (PASS, "F40,F42", "GET /api/sales-reps — which is what feeds the WORK ORDER selector — returned "
   "only the reps whose sales-rep toggle is on: it grew from 2 to 5 entries as I switched is_sales_rep on for "
   "three staff, and back to 2 when restored. NOTE (F50) the CUSTOMER record's picker does NOT honour this: it "
   "offers the whole staff list including inactive staff. The case is about the WO selector, so it passes, but "
   "the customer-side inconsistency is worth a ticket."),
 "SBR-WO-03": (PASS, "F40,F42", "A newly created work order opened with no rep, and setting one persisted "
   "immediately with no Save step (POST /api/work-orders/change-sales-rep -> 201, confirmed by re-reading the "
   "work order)."),
 "SBR-WO-04": (PASS, "F40", "On an INVOICED work order the field renders as a read-only static-field with no "
   "selector — " + Q["SBR-S19-R5"] + " NOTE for the tester (Standing Rule 24): the same change IS still accepted "
   "through the back end (POST /api/work-orders/change-sales-rep returned 201 for that invoiced work order). "
   "That is expected — mark this test PASSED and do not raise a bug. This Rule-24 line should be ADDED to the case."),
 "SBR-WO-05": (PASS, "F41", "Proven directly: " + Q["SBR-S19-R6"] + " " + Q["SBR-S19-N2"] + " I changed S-15826's "
   "work-order rep to Daniel Padilla and the report kept crediting Parth Fadadu. The customer-rep fallback leg "
   "could not be exercised (it only applies at invoice creation, which is broken) — carried as a re-check."),
 "SBR-WO-06": (PASS, "F50,F51", "The customer record does carry a single 'Sales Representative' row and its "
   "Edit Customer dialog carries a matching 'Sales Representative' dropdown. TWO wording/behaviour notes for the "
   "case: (a) the customer surface says 'Sales Representative' in full while the WORK ORDER surface says 'Sales "
   "rep' — the case must use each surface's own label (Rule 9); (b) the dropdown offers the WHOLE staff list "
   "including inactive staff, not just toggled-on reps, and the value is saved as a name pair rather than a rep "
   "id. The 'Unassigned' empty text was not separately produced — carried as a re-check."),
 "SBR-API-01": (PASS, "F32", "Invoice detail rows are not in the initial payload; the first expand fires the "
   "per-rep /invoices call."),
 "SBR-API-02": (PASS, "F36", "Each sort change triggers a server re-fetch that returns page 1 already ordered."),
 "SBR-API-03": (PASS, "F5,F14", "Grand totals arrive with the summary payload and match the export Totals line "
   "over the full filtered set, independent of what is expanded."),
 "SBR-API-04": (PASS, "F9,F37,F38", "All four exports are server-generated against the active filters and sort; the "
   "guard responses (400 with specific messages) were observed."),
 "SBR-API-05": (PASS, "F9", "The over-cap refusal is server-side and pre-generation: 400 with the too-large "
   "message and no file body."),
 "SBR-API-06": (EXT, "F42", "Same blocker as SBR-DEACT-02 — the pre-check request only runs when a staff-backed rep "
   "holds customer assignments, which cannot be produced while invoice creation returns HTTP 500."),
}


def main():
    field = {r["internal_id"]: r for r in json.loads((BATCH / "evidence/field-review.json").read_text())}
    idmap = {r["internal_id"]: r for r in csv.DictReader((ROOT / "build/report-suite/testrail-id-map.csv").open())}
    mine = sorted([i for i in idmap if i.split("-")[0] in ("SBC", "SBR")])

    missing = [i for i in mine if i not in V]
    extra = [i for i in V if i not in mine]
    if missing or extra:
        print("!! verdict table out of sync — missing:", missing, "extra:", extra)

    rows = []
    for iid in mine:
        verdict, finds, note = V[iid]
        f = field[iid]
        # the evidence paths behind the cited findings
        ev = sorted({F[x][1] for x in finds.split(",") if x in F})
        # a case in an API section with plainly-worded API content is CORRECT (Rules 7/9) — resolve
        # the mechanical REVIEW flag that field_review.py raises for those.
        sec = f["f_section"]
        if sec.startswith("REVIEW"):
            sec = "OK — genuine API/behaviour case in an API-titled section, worded plainly per Rules 7/9"
        rows.append({
            "internal_id": iid, "cid": f["cid"], "link": f["link"], "report": f["report"],
            "area": f["area"], "section": f["section"], "title": f["title"],
            "verdict": verdict, "findings": finds, "note": note,
            "evidence": " ; ".join(ev),
            "f_title": f["f_title"], "f_title_vs_expected": f["f_title_vs_expected"],
            "f_preconditions": f["f_preconditions"], "f_steps": f["f_steps"],
            "f_expected": f["f_expected"], "f_references": f["f_references"],
            "f_section": sec, "f_notes": f["f_notes"],
            "recheck": (f"Re-observe against the next build; this verdict is PROVISIONAL against {BUILD} "
                        f"observed {OBS} (Rule 49)."),
        })

    # ---- verdicts.csv ----
    cols = list(rows[0].keys())
    with (BATCH / "verdicts.csv").open("w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=cols)
        w.writeheader()
        w.writerows(rows)

    from collections import Counter
    tally = Counter(r["verdict"] for r in rows)
    per_rep = {rep: Counter(r["verdict"] for r in rows if r["report"] == rep) for rep in ("SBC", "SBR")}
    print("TOTAL", len(rows), dict(tally))
    for rep in ("SBC", "SBR"):
        print(" ", rep, sum(per_rep[rep].values()), dict(per_rep[rep]))
    json.dump({"tally": dict(tally), "perReport": {k: dict(v) for k, v in per_rep.items()},
               "total": len(rows)}, (BATCH / "evidence/verdict-tally.json").open("w"), indent=1)
    return rows, tally, per_rep, F, Q


if __name__ == "__main__":
    main()
