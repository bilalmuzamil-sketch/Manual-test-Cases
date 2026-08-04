#!/usr/bin/env python3
"""
Report Suite — VIU push 2026-08-04: THE EDIT SET.

Builds the intended `update_case` payloads by EXACT substring surgery on the
pre-write snapshot (snapshots/PRE-cases-group4281.json).  Every replacement
asserts its `old` occurs EXACTLY ONCE, so a payload can never be built from a
fuzzy match (Standing Rule 50 — exact, not "looks right").

Emits: edit-set.json  =  { cid: {field: new_value, ...}, ... }

Sources (all staged 2026-08-03/04, authorised by the QA lead 2026-08-04):
  build/report-suite/viu-2026-08-03/batch-sbc-sbr/STAGED-CHANGES.md
  build/report-suite/viu-2026-08-03/batch-pv-tu/STAGED-CHANGES.md
  build/report-suite/viu-2026-08-03/batch-wip-iv/STAGED-CHANGES.md
  build/report-suite/viu-2026-08-03/CHANGE-LEDGER.md          (corroborating)
  build/report-suite/spec-watch-verification-2026-08-03/       (SBC-API-06)
"""
import json, os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PRE = {c['id']: c for c in json.load(
    open(os.path.join(ROOT, 'snapshots', 'PRE-cases-group4281.json')))}

F = {'title': 'title', 'pre': 'custom_preconds', 'steps': 'custom_steps',
     'exp': 'custom_expected', 'refs': 'refs'}

# cid -> list of (short-field, old, new)
E = {}


def ed(cid, *reps):
    E.setdefault(cid, []).extend(reps)


# ---------------------------------------------------------------- PARTS VELOCITY / TU
# batch-pv-tu §B1..B6 — build-accurate labels (Rule 9).  Live header reads
# "Turns/Yr" (no spaces): evidence/pv/ui/pv-ui-3.json turnsIconPresent.text.
ed(30346,
   ('title', 'Info icons sit on Units Sold; Demand and Turns / Yr with descriptions',
            'Info icons sit on Units Sold, Demand and Turns/Yr with descriptions'),
   ('pre', '2. The Turns / Yr column has been enabled', '2. The Turns/Yr column has been enabled'),
   ('steps', 'Units Sold, Demand, and Turns / Yr header labels', 'Units Sold, Demand, and Turns/Yr header labels'),
   ('exp', 'the Turns / Yr icon appears only once', 'the Turns/Yr icon appears only once'),
   ('exp', '4. Turns / Yr shows exactly:', '4. Turns/Yr shows exactly:'))

ed(30351, ('exp', 'On Hand, Turns / Yr, Min, Max.', 'On Hand, Turns/Yr, Min, Max.'))

ed(30353,
   ('steps', 'then Units Returned, then Turns / Yr - in that', 'then Units Returned, then Turns/Yr - in that'),
   ('exp', 'On Hand, Turns / Yr, Min, Max.', 'On Hand, Turns/Yr, Min, Max.'),
   ('exp', 'Turns / Yr after On Hand', 'Turns/Yr after On Hand'))

# TU-TECH-01: the control's field label reads "Technician" (evidence/tu/ui/tu-ui-1.json
# -> selects).  Spec S5-R1 writes "Filter by Technician" — difference logged for Chris.
ed(30423,
   ('steps', '1. Find the toolbar filter labeled "Filter by Technician" and open it.',
             '1. Find the toolbar filter labeled "Technician" and open it.'),
   ('exp', '1. The toolbar has a filter labeled "Filter by Technician" that allows selecting more than one technician.',
           '1. The toolbar has a filter labeled "Technician" that allows selecting more than one technician (when several are chosen its label reads, for example, "2 technicians").'))

# TU-TECH-03: the menu offers "All technicians", "Clear all", then the names — there is
# no control labelled "Select all" (evidence/tu/ui/tu-ui-1.json -> filter1.menus).
ed(30425,
   ('title', 'Select all and Clear all controls set every technician on or off',
             'All technicians and Clear all controls set every technician on or off'),
   ('steps', '1. In the Filter by Technician filter, use the control labeled "Clear all".',
             '1. In the Technician filter, use the control labeled "Clear all".'),
   ('steps', '2. Use the control labeled "Select all".', '2. Use the control labeled "All technicians".'),
   ('exp', '"Clear all" sets every currently-listed technician to deselected; "Select all" selects all technicians at once.',
           '"Clear all" sets every currently-listed technician to deselected; "All technicians" selects all technicians at once.'))

# TU-LOC-01: lower-case "All locations" + the "Clear all" action; item 4's Rule-42
# hedge replaced with the observed fact (a Location column, "Multiple" for a
# technician spanning locations).
ed(30442,
   ('steps', '3. Choose "All Locations", then uncheck one individual location.',
             '3. Choose "All locations", then uncheck one individual location.'),
   ('exp', '2. It lists the locations the signed-in user has access to, plus an "All Locations" option.',
           '2. It lists the locations the signed-in user has access to, plus an "All locations" option and a "Clear all" action. (If you only have access to one location, the "All locations" entry is not offered - you see "Clear all" and your one location.)'),
   ('exp', '3. "All Locations" acts as a select-all shortcut:', '3. "All locations" acts as a select-all shortcut:'),
   ('exp', '4. With all locations selected you can tell which location the shown data belongs to — a location label or marking is shown. (Exactly where and how it appears is confirmed in the build; this report pools each technician\'s hours into one row, so the marking may take a different form here.)',
           '4. With more than one location selected, a Location column appears in the table and each row names its location - or reads "Multiple" for a technician whose hours span more than one of them. (Where that column sits on screen is checked by its own test.)'))

# PV-VIS-02 — authorised earlier: make it layman-runnable, the same treatment
# C30387 / C30309 / C30448 already carry.  No assertion is dropped; the exact
# pixel/rem values move into a design-team note because a manual tester cannot
# measure them.
ed(30386,
   ('pre', '1. You are on the Parts Velocity report with data loaded (use browser devtools to measure paddings).',
           '1. You are on the Parts Velocity report with data loaded.'),
   ('steps', """1. Inspect the toolbar's background and internal padding.
2. Inspect the table header cells and the border between header and toolbar.
3. Inspect the body cells and the first/last cell padding in a row.""",
             """1. Look at the toolbar strip above the table and at the space between its controls and the edges of the strip.
2. Look at the column-header band and at the line between it and the toolbar above it.
3. Look at the data cells, and at the space between the first and last columns and the left and right edges of the table.
4. Compare all of the above with another report in the suite (for example Inventory Value) opened side by side."""),
   ('exp', """1. The toolbar background is white (black in dark mode) with internal padding 32px top, 2rem right, 24px bottom, 2rem left.
2. Header cells have a white background and a 1px top border separating them from the toolbar.
3. Body cells have a white background.
4. The leftmost cell in every row (header and body) has 2rem left padding; the rightmost cell has 2rem right padding.""",
           """1. The toolbar strip is white (dark in dark mode), and its controls sit clear of the edges rather than pressed up against them.
2. There is a thin dividing line between the toolbar and the column-header band, and the header band and the data cells are white.
3. The first and last columns sit clear of the left and right edges of the table - the text is not touching the edge.
4. It all looks the same as the other reports in the suite: put another report side by side and nothing should look out of place.
5. Note for the tester: you do not need to measure anything and you do not need any tool. Just say whether the spacing and the dividing line look right and consistent with the other reports, and only report it if something looks obviously off. (The exact figures behind this - 32px/24px toolbar padding, a 1px header border, 2rem edge padding - are design-token values the design and engineering team check with their own tooling, not by hand.)"""))

# ---------------------------------------------------------------- WIP
# B1 / B2 / B3 + the mandatory Rule-28 consistency sweep.  LIVE-PROVEN both ways:
# the WIP Column Selection panel lists Location between VIN and Advisor, OFF by
# default; toggling it on added the column and toggling it off removed it, with two
# locations in scope throughout.  This also resolves an internal contradiction —
# C30466 and C30507 already listed Location inside the toggleable order.
ed(30467,
   ('exp', '2. Every other column (VIN, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Inv. Hrs) is available in the column-selection control and off by default.\n3. Location is NOT offered in the column-selection control — it appears on its own whenever more than one location is in scope, and is hidden when a single location is in scope.',
           '2. Every other column (VIN, Location, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Inv. Hrs) is available in the column-selection control and off by default.\n3. Location IS offered in the column-selection control, between VIN and Advisor, and is off by default. Turning it on adds a Location column that names each job\'s location; turning it off removes it again.\n4. Note for the tester: the Location column does NOT appear on its own when you have more than one location selected - you have to switch it on yourself. That is what the build does today.'))

ed(30466,
   ('pre', '4. More than one location is in scope, so the automatic Location column is showing.',
           '4. Location is turned ON in the column-selection control (it is off by default).'))

ed(38916,
   ('exp', '1. With more than one location in scope a Location column is shown, in its fixed position between VIN and Advisor, left-aligned.',
           '1. Location is offered in the column-selection control, between VIN and Advisor, and is off by default. Turning it on adds the Location column in that fixed position, left-aligned.'),
   ('exp', '4. Location is NOT offered in the column-selection control — its visibility follows the location scope automatically.\n5. With a single location in scope the Location column is hidden.',
           '4. The column does not appear or disappear on its own when you change the location selection - it follows the column-selection toggle only.\n5. With the toggle off the Location column is not shown, whatever the location selection is.'))

# B4 — the build title-cases every tab word and appends a live count.
ed(30452,
   ('exp', '1. Four tabs are shown, labeled in this order: "Approved - partially completed", "Approved - not started", "Completed", and "Estimates".',
           '1. Four tabs are shown, labeled in this order: "Approved - Partially Completed", "Approved - Not Started", "Completed", and "Estimates" - each followed by its count in brackets, for example "Completed (30)".'),
   ('exp', '2. The "Approved - partially completed" tab is selected by default on load.',
           '2. The "Approved - Partially Completed" tab is selected by default on load.'),
   ('steps', '', ''))

# B5 — GET /api/work-orders/statuses returns the build's own label "In progress".
ed(30469,
   ('pre', '(Estimate, Approved, In Progress, Review, Complete)', '(Estimate, Approved, In progress, Review, Complete)'),
   ('exp', '1. Status is shown as a badge using the status\'s label: "Estimate", "Approved", "In Progress", "Review", or "Complete".',
           '1. Status is shown as a badge using the status\'s label: "Estimate", "Approved", "In progress", "Review", or "Complete".'))

# B6 — the build has NO Declined status (enum: estimate, approved, in_progress,
# ready_for_review, complete, invoiced, paid), so the precondition is unreachable
# as written (Rule 28 dimension 2).  Invoiced/Paid/part-sale absence confirmed.
ed(30457,
   ('title', 'Invoiced; Paid; Declined and part-sale work orders never appear',
             'Invoiced; Paid and part-sale work orders never appear'),
   ('pre', 'one Invoiced, one Paid, one Declined, and one part-sale work order.',
           'one Invoiced, one Paid, and one part-sale work order.'),
   ('steps', '2. Look for the Invoiced, Paid, and Declined work orders and the part-sale work order in every tab.',
             '2. Look for the Invoiced and Paid work orders and the part-sale work order in every tab.'),
   ('exp', '1. The Invoiced, Paid, and Declined work orders do not appear in any tab, any Totals row, the summary strip, or the download.',
           '1. The Invoiced and Paid work orders do not appear in any tab, any Totals row, the summary strip, or the download.'))

# B8 — step 3 is not executable as written (no "Custom" item exists); the build's own
# refusal message is quoted (Rule 9) and the observed boundary recorded without
# asserting 366 or 367, because the one-day difference against S7-R8 is a shared-
# component question for Chris, not ours to settle.
ed(30502,
   ('steps', '3. Open "Custom" and try to pick a start and end date more than 366 days apart.',
             '3. Open the date control and pick a start and an end date on the calendar more than a year apart.'),
   ('exp', '3. A Custom range is capped at a 366-day maximum span from start to end — a longer span cannot be applied.',
           '3. A range longer than about a year is refused with the message "Date range cannot be over one year." and the wider range is not loaded.\n4. Note for the tester: on this build the exact cut-off sits one day later than the specification says (a 367-day span is accepted, 368 is refused). Record what you see; the one-day difference is already known and is with the product owner.'))

# B10 — item 5's mechanism corrected to match C30467/C38916; item 1 gains the
# Inv. Hrs export limitation (columns=...,invoiced_hours -> HTTP 400
# {"error":"Invalid column \"invoiced_hours\"."}).  The CHANGE-LEDGER rows 8 and 9
# propose the same two additions independently.
ed(30511,
   ('exp', '1. Both downloads include only the columns currently shown, in the same left-to-right order as the screen, with Total last.',
           '1. Both downloads include only the columns currently shown, in the same left-to-right order as the screen, with Total last. One exception on this build: if you turn Inv. Hrs on, the download is refused - that column cannot be exported yet.'),
   ('exp', '5. Note for the tester: when you have more than one location in scope, the files also carry the location column even though you cannot turn it on or off - and in the file it is headed "Branch", not "Location". Both of those are correct. With a single location in scope there is no such column, and that is also correct.',
           '5. Note for the tester: the file carries the location column only when you have switched Location ON in the column-selection control - it does not appear just because you have more than one location selected. In the file it is headed "Branch", not "Location", and the asset column is headed "Unit". Both of those names are correct.'))

# B11 — the Inv. Hrs total can only be checked on screen on this build.
ed(30495,
   ('exp', '3. The Inv. Hrs total uses the same green (positive) / red (negative) / default (exactly 0.0) coloring as a data row.',
           '3. The Inv. Hrs total uses the same green (positive) / red (negative) / default (exactly 0.0) coloring as a data row.\n4. Note for the tester: the Inv. Hrs total can only be checked on screen. On this build a download that includes Inv. Hrs is refused, so do not try to verify this column from a file.'))

# B27 — the widest reachable WIP scope on this estate is 488 work orders in total and
# 114 in the largest tab, and the cap applies per tab.
ed(38918,
   ('exp', '3. Below the cap the download works normally.',
           '3. Below the cap the download works normally.\n4. Note for the tester: on this environment the biggest single tab holds about 114 work orders, so you cannot make this message appear here. Record that and move on.'))

# ---------------------------------------------------------------- INVENTORY VALUE
# B13 — the live header row and BOTH export files read "Qty", not "Qty on Hand"
# (CHANGE-LEDGER row 6 agrees independently).  The Location-mechanism clauses are
# corrected in the same pass: Location is the 5th of 11 items in the IV Column
# Selection panel and toggling it off removes the column.
ed(30551,
   ('exp', '1. With a single location in scope the columns appear in this order: Part #, Description, Category, Vendor, Qty on Hand, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost.',
           '1. With a single location in scope the columns appear in this order: Part #, Description, Category, Vendor, Qty, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost.'),
   ('exp', '4. When more than one location is in scope the automatic Location column also appears, between Vendor and Qty on Hand, left-aligned. It is not in the column-selection control, so its presence is expected and is not a failure of this test.',
           '4. Location is one of the columns in the column-selection control; when it is turned on the Location column appears between Vendor and Qty, left-aligned.'))

ed(30552,
   ('title', 'Value formats: Qty on Hand to two decimals; money as US-dollar currency',
             'Value formats: Qty to two decimals; money as US-dollar currency'),
   ('pre', '2. The report shows a part with a fractional on-hand quantity', '2. The report shows a part with a fractional quantity'),
   ('steps', '1. Read the Qty on Hand cell of the fractional-quantity part.', '1. Read the Qty cell of the fractional-quantity part.'),
   ('exp', '1. Qty on Hand shows the on-hand quantity to two decimal places', '1. Qty shows the on-hand quantity to two decimal places'))

ed(30580,
   ('exp', '1. Whatever columns are shown, they appear in the fixed left-to-right order — with the automatic Location column, when more than one location is in scope, between Vendor and Qty on Hand (Part #, Description, Category, Vendor, Qty on Hand, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost) — toggling visibility never reorders columns.',
           '1. Whatever columns are shown, they appear in the fixed left-to-right order - with Location, when it is turned on in the column-selection control, between Vendor and Qty (Part #, Description, Category, Vendor, Qty, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost) - toggling visibility never reorders columns.'))

# B14 is HELD (the un-built default column set is a build defect, so the case stands);
# only item 4's refuted Location mechanism is corrected here, for consistency.
ed(30554,
   ('exp', '1. On first visit with a single location in scope the visible columns are: Part #, Description, Category, Vendor, Qty on Hand, Unit Cost, Unit Sell, Margin %, and Total Cost.',
           '1. On first visit with a single location in scope the visible columns are: Part #, Description, Category, Vendor, Qty, Unit Cost, Unit Sell, Margin %, and Total Cost.'),
   ('exp', '4. When more than one location is in scope the automatic Location column also shows, between Vendor and Qty on Hand — it is not one of the toggleable columns and its presence is expected.',
           '4. Location is one of the columns in the column-selection control; when it is turned on the Location column shows between Vendor and Qty.'))

# Rule-28 sweep addition (NOT in the staged list, but mandatory): IV-LOC-06 makes the
# same refuted "automatic / not in the column selector" assertion as
# C30551/C30554/C30580/C30588, so correcting those four and leaving this one would ship
# a self-contradiction.  Same live evidence: Location is the 5th of 11 items in the IV
# Column Selection panel and toggling it off removes the column.
ed(38917,
   ('title', 'The Location column is automatic, sits after Vendor, and never reads Multiple',
             'The Location column sits after Vendor and never reads Multiple'),
   ('steps', '1. Select two or more locations and read the column headers from the left.',
             '1. Turn Location on in the column-selection control, select two or more locations, and read the column headers from the left.'),
   ('exp', '1. With more than one location in scope a Location column is shown, inserted between Vendor and Qty on Hand.',
           '1. With Location turned on in the column-selection control, a Location column is shown, inserted between Vendor and Qty.'),
   ('exp', '4. Location is NOT offered in the column-selection control — its visibility follows the location scope automatically.\n5. With a single location in scope the Location column is hidden and the surrounding columns close up.',
           '4. Location IS one of the columns offered in the column-selection control - its visibility follows that toggle, not the location selection.\n5. With the Location toggle off the column is not shown and the surrounding columns close up.'),
   ('exp', '7. Both downloads include the Location column in the same position it holds on screen (between Vendor and Qty on Hand), naming each row\'s own location.',
           '7. Both downloads include the Location column in the same position it holds on screen (between Vendor and Qty), naming each row\'s own location.'))

# B15 — a part cannot be saved without a category on this build
# (POST /api/inventory/parts/create -> category_id "Missing required parameter";
# 0 of 5,657 live rows have a blank Category, 1,327 DO show "—" for no vendor).
ed(30555,
   ('exp', '3. A part with no vendor shows an em dash ("—") in its Vendor cell.',
           '3. A part with no vendor shows an em dash ("—") in its Vendor cell.\n4. Note for the tester: on this build a part cannot be saved without a category, so you will not find a part whose Category cell shows "—". Check the Vendor half only.'))

# B18 — the on-screen label and both export files read "Totals", not "Total".
ed(30556,
   ('title', 'Totals row: Total label, blank identity/per-unit cells, pinned bold Total Cost',
             'Totals row: Totals label, blank identity/per-unit cells, pinned bold Total Cost'),
   ('exp', '1. A totals row is shown at the bottom, with the literal label "Total" in the Part # column\'s cell.',
           '1. A totals row is shown at the bottom, with the label "Totals" in the Part # column\'s cell.'))

# B19 — as written the case FAILS a correct build: a 5,657-row walk of the displayed
# values came to $485,542.24 against the server's $485,542.18, because the server sums
# the unrounded values.  Everything else in the case held exactly.
ed(30557,
   ('exp', '3. The hand-summed subset matches the server-computed totals to the cent.',
           '3. A hand sum of a small seeded subset matches the totals row. On a large set the totals can differ from a hand sum of the displayed values by a few cents, because the server sums the unrounded values - that is correct, not a defect.'))

# B21 — there is no "Custom" item to choose; the calendar is always in the popup.
# Expected results are untouched (the future-date cap was confirmed).
ed(30566,
   ('steps', '1. Open the date-range control and choose "Custom".\n2. Pick a start and an end date in the past and apply.',
             '1. Open the date-range control - a month calendar is shown inside it (there is no separate "Custom" item to choose).\n2. Pick a start and an end date in the past on that calendar and press Apply.'))

# B17 — the server-side paging contract is fully honoured, but there is no pagination
# control anywhere on screen (no .q-pagination, no q-table__bottom); the grid is one
# virtualised scrolling list.  The requirement is KEPT (S1-R8 is not built yet); only
# the steps are made executable, with the finding recorded for the tester.
ed(30538,
   ('steps', '1. Open the Inventory Value report and find the pagination control.\n2. Move to page 2 (and further) and watch the rows.\n3. From a later page, change a server-side filter (for example select a Category), then check which page is shown.\n4. Repeat from a later page with a part search and with a sort change.',
             '1. Open the Inventory Value report and scroll to the bottom of the rows, then keep scrolling so further rows load.\n2. Watch that new rows keep arriving as you scroll rather than all of them being present at once.\n3. After scrolling well down the list, change a server-side filter (for example select a Category), then look at where the list starts.\n4. Repeat with a part search and with a sort change.'),
   ('exp', '2. Changing any server-side filter (Date, Location, Category, Vendor), the part search, or the sort returns the FIRST page of the new result set.',
           '2. Changing any server-side filter (Date, Location, Category, Vendor), the part search, or the sort returns the FIRST page of the new result set - the list jumps back to the top.\n3. Note for the tester: on this build there are no numbered page controls on the screen - the rows load as you scroll. That is what you should see; record it and carry on with the checks above.'))

ed(30570,
   ('pre', '2. The unfiltered result set spans multiple pages, and matching parts for a category/vendor/search exist BEYOND page 1.',
           '2. The unfiltered result set is long enough to need scrolling, and matching parts for a category/vendor/search exist well down the list (beyond the first screenful).'),
   ('steps', '1. From page 2 (or later), select a Category and check which page shows and which rows are listed.',
             '1. Scroll well down the list, then select a Category and check where the list starts and which rows are listed.'),
   ('exp', '2. The filtering covers the ENTIRE data set — matching parts that were on later pages appear — not just a narrowing of the rows on the current page.',
           '2. The filtering covers the ENTIRE data set — matching parts that were further down the list appear — not just a narrowing of the rows currently on screen.'))

# B22 — item 1 (the export column order) is HELD: IV S10-R3 is a requirement the build
# slips on, so the case stands.  Only item 5's refuted Location mechanism is corrected.
ed(30588,
   ('exp', '5. Note for the tester: when you have more than one location in scope, the files also carry a Location column (between Vendor and Qty on Hand) even though it is not in the column-selection control. That is correct - it appears by itself. With a single location in scope there is no Location column, and that is also correct.',
           '5. Note for the tester: the files carry the Location column when Location is turned ON in the column-selection control (it sits between Vendor and Qty). It does not appear just because you have more than one location selected.'))

# B24 — reproduced repeatedly and characterised as a ~30 s server-side timeout, not a
# row cap: every failure lands at 31-33 s; the CSV of the identical scope returns in
# 0.8-2.2 s and always 200.
ed(30595,
   ('exp', '3. The lower-case "(pdf)"/"(csv)" on failure vs the upper-case success ones is the documented spec wording — expected, not a bug.',
           '3. The lower-case "(pdf)"/"(csv)" on failure vs the upper-case success ones is the documented spec wording — expected, not a bug.\n4. Note for the tester: on this build a PDF download of a large view fails with a plain error - "An error occurred. We\'re sorry for this inconvenience, please try again a bit later later." - after roughly half a minute. It is a timeout, not the too-large-to-export message. Narrow the view with the part search or a single location and the PDF works. The CSV of the same view always works and is quick. Record the failure; it is a known problem, not a mistake you made.'))

# B25 — the biggest view reachable on this estate is about 9,275 rows, under the cap.
ed(30593,
   ('exp', '3. After narrowing the filters below the cap, the download works again.',
           '3. After narrowing the filters below the cap, the download works again.\n4. Note for the tester: on this environment the biggest view you can build is about 9,275 rows, which is under the cap, so you cannot make this message appear here. If the PDF fails with a plain error instead, that is the separate timeout problem - see the Inventory Value export-notification case.'))

# B28 — the PDF header block reads "As of 2026-08-04" (no colon) while the CSV's
# leading line reads "As of: 2026-08-04" (with a colon).
ed(30590,
   ('exp', '3. The CSV never includes a logo.',
           '3. The CSV never includes a logo.\n4. Note for the tester: the two files phrase the as-of line differently - the PDF reads "As of 2026-08-04" and the CSV\'s first line reads "As of: 2026-08-04" (with a colon). Both are correct; do not raise the difference.'))

# ---------------------------------------------------------------- SBC / SBR
# batch-sbc-sbr §4 SBR-WO-04 — the back end still accepts the change, so the
# Standing Rule 24 tester line is required.
ed(30313,
   ('exp', '3. Note for the tester: the product owner has ruled that the full word "Sales Representative" replaces the short "Sales Rep" everywhere. If the screen or file still shows "Sales Rep", mark this test Failed and report it as the pending rename — do not change the test.',
           '3. Note for the tester: the product owner has ruled that the full word "Sales Representative" replaces the short "Sales Rep" everywhere. If the screen or file still shows "Sales Rep", mark this test Failed and report it as the pending rename — do not change the test.\n4. Note for the tester: this field is only made read-only on the screen. If you find the sales rep can still be changed another way (through the back-end/API), that is expected — mark this test PASSED and do not raise it as a bug.'))

# Steps-only executability fixes.  The preset ENUMERATION in these two cases is NOT
# touched — the nine-vs-eleven difference is a shared-date-component product decision
# owed by Chris Ward, so their expected results stand.
ed(30104,
   ('steps', '1. Open the date range picker and choose "Custom."\n2. In the dialog that opens, pick a start and end date less than 366 days apart and apply.\n3. Open "Custom" again and try to pick a start and end date MORE than 366 days apart.',
             '1. Open the date range picker. A month calendar is shown inside it, which is how a custom start and end date are picked on this build.\n2. Pick a start and end date less than 366 days apart on that calendar and apply.\n3. Open the picker again and try to pick a start and end date MORE than 366 days apart.'))

ed(30202,
   ('steps', '1. Pick "Custom" and select a start and end date within 366 days; apply.\n2. Pick "Custom" again and try to select a start-to-end span of more than 366 days (start and end dates inclusive).',
             '1. Open the date range picker and select a start and end date within 366 days on the calendar shown inside it; apply.\n2. Open it again and try to select a start-to-end span of more than 366 days (start and end dates inclusive).'))


# ------------------------------------------------------------------ build payloads
def build():
    out, problems = {}, []
    for cid, reps in E.items():
        if cid not in PRE:
            problems.append(f'C{cid}: not in the pre-write snapshot'); continue
        if PRE[cid]['created_by'] != 3:
            problems.append(f'C{cid}: FOREIGN CASE (created_by={PRE[cid]["created_by"]}) — refused'); continue
        cur = {}
        for short, old, new in reps:
            if not old and not new:
                continue
            f = F[short]
            base = cur.get(f, PRE[cid][f] or '')
            n = base.count(old)
            if n != 1:
                problems.append(f'C{cid} {f}: old text occurs {n}x (need exactly 1): {old[:70]!r}')
                continue
            cur[f] = base.replace(old, new, 1)
        for f, v in list(cur.items()):
            if v == (PRE[cid][f] or ''):
                problems.append(f'C{cid} {f}: new value identical to old — pointless write'); del cur[f]
        if cur:
            out[cid] = cur
    return out, problems


if __name__ == '__main__':
    out, problems = build()
    for p in problems:
        print('PROBLEM:', p)
    print(f'cases with edits: {len(out)}   fields: {sum(len(v) for v in out.values())}')
    if problems:
        sys.exit(1)
    json.dump({str(k): v for k, v in out.items()},
              open(os.path.join(ROOT, 'edit-set.json'), 'w'), indent=1, ensure_ascii=False)
    print('wrote edit-set.json')
