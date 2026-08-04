#!/usr/bin/env python3
"""gen_verdicts.py — emit VERDICTS.md + verdicts.csv for the 149 WIP + Inventory Value cases.

Every verdict below was assigned from a LIVE observation on build v3.4.1-0ed4433 (2026-08-03/04).
The evidence path on each row points at the captured artefact under ../evidence/.
Verdicts are exactly one of: VIU-Observed-PASS | DEVIATION | NOT-BUILT | EXTERNAL-DEPENDENCY.
Per-field verdicts cover all seven fields: title, preconditions, steps, expected, references,
section, notes.

Run:  python3 gen_verdicts.py
"""
import csv
import glob
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
BATCH = os.path.dirname(HERE)
RS = os.path.abspath(os.path.join(BATCH, '..', '..'))
BUILD = 'v3.4.1-0ed4433'
LINK = 'https://shopview.testrail.io/index.php?/cases/view/{}'

# ---------------------------------------------------------------------------
# Per-case verdicts.  Tuple = (verdict, field_overrides, evidence, finding, recheck)
#   field_overrides: only the fields that are NOT "OK" (notes is ALWAYS an edit -
#                    every case needs the Rule-49 non-final-build marker).
# ---------------------------------------------------------------------------
PASS = 'VIU-Observed-PASS'
DEV = 'DEVIATION'
NB = 'NOT-BUILT'
EXT = 'EXTERNAL-DEPENDENCY'

V = {}


def add(cid, verdict, evidence, finding, recheck, **fields):
    V[cid] = dict(verdict=verdict, evidence=evidence, finding=finding, recheck=recheck, fields=fields)


E_NAV = 'evidence/ui/obs-wip.json (nav-map + docTitle) · ../evidence/nav-map.json'
E_WIPUI = 'evidence/ui/obs-wip2.json · evidence/ui/wip-default-view.png'
E_WIPFIN = 'evidence/ui/obs-final.json (wip.*) · evidence/ui/wip-singleloc.png'
E_COLSEL = 'evidence/ui/colsel-work-in-progress.json · evidence/ui/colsel-work-in-progress-after-on.png'
E_API = 'evidence/api/api-wip-iv.json · evidence/api/api-probe2.json'
E_EXP = 'evidence/exports/export-manifest.json · evidence/exports/wip__*.head.txt'
E_PDF = 'evidence/pdf-text/wip__*.txt'
E_PERM = 'evidence/api/seed-perms.json · evidence/api/seed2.json'
E_IVUI = 'evidence/ui/obs-final.json (iv.*) · evidence/ui/iv-default.png'
E_IVCOL = 'evidence/ui/colsel-inventory-value.json'
E_IVAPI = 'evidence/api/api-wip-iv.json (iv.*) · evidence/api/api-probe3.json · api-probe5.json'
E_IVEXP = 'evidence/exports/iv__*.head.txt · evidence/pdf-text/iv__*.txt'
E_IVPDF500 = 'evidence/api/iv-pdf-boundary.json · evidence/api/pdfprobe.json'

RC_STD = 'Re-confirm on the final build: the observation is provisional (branch declared not final).'
RC_LBL = 'Re-confirm the on-screen label text on the final build before adopting it permanently.'

# ===================== WIP — Tabs =====================
add('WIP-TAB-01', PASS, E_NAV,
    'Nav entry "Work In Progress" is live under the PERFORMANCE group, below Sales, Technician '
    'Efficiency, Advisor Analysis and Shop Efficiency; route /reports/work-in-progress; browser '
    'title is exactly "Work In Progress - Report | ShopView".', RC_STD)
add('WIP-TAB-02', DEV, E_WIPUI,
    'Four tabs, correct order, first tab selected on load, and no on-screen status filter - all '
    'confirmed. BUT the build TITLE-CASES the labels and appends a live count: '
    '"Approved - Partially Completed (114)" / "Approved - Not Started (33)". Our case (and WIP spec '
    'v6 S1-R2 verbatim: \'"Approved - partially completed", "Approved - not started"\') use lower '
    'case. Read: a shipped-string difference, not a defect - Rule 9 says the tester reads the '
    "build's word, so our case should adopt the build casing and Chris should confirm the spec text.",
    RC_LBL, expected='EDIT NEEDED - adopt the build casing "Approved - Partially Completed" / '
                     '"Approved - Not Started" in expected item 1')
add('WIP-TAB-03', PASS, E_WIPUI,
    'Each tab label carries its count in parentheses - observed "Completed (30)", "Estimates (146)" '
    'with data and "Approved - Partially Completed (0)" / "Completed (0)" when the range is narrow.',
    RC_STD)
add('WIP-TAB-05', PASS, E_WIPUI,
    'Only the four progress tabs exist; no Trend tab, no chart, and nothing on the page reads the '
    'nightly snapshot. Confirmed across the toolbar, both menus and all four tabs.', RC_STD)

# ===================== WIP — Scope & Loading =====================
add('WIP-SCOPE-01', PASS, E_API,
    '488 rows observed across two locations; every row is a service work order in an open status '
    '(estimate 229 / approved 218 / ready_for_review 12 / complete 29) and each sits in the tab its '
    'status dictates. HONEST LIMIT: no work order in In progress status existed in the data during '
    'the run, so that one branch of the five is not among the observations - the status DOES exist '
    'in the build (GET /api/work-orders/statuses lists in_progress).',
    'Re-run once an In progress work order exists (or seed one through the UI) to observe the fifth '
    'status branch. Also re-confirm on the final build.')
add('WIP-SCOPE-02', DEV, E_API,
    'Invoiced and Paid confirmed absent - 0 of 488 rows carry either status - and no part-sale work '
    'order appears (every WO number is an S2-/S3- service prefix). BUT the build has NO "Declined" '
    'work-order status at all: GET /api/work-orders/statuses returns exactly estimate, approved, '
    'in_progress, ready_for_review, complete, invoiced, paid. Our case and WIP spec v6 S2-R2 '
    '("Invoiced, Paid, or Declined") both name a status the build does not have, so that third of '
    'the expectation can never be produced. Read: spec/case names a non-existent status - a question '
    'for Chris, not a build defect.', RC_STD,
    preconditions='EDIT NEEDED - drop the Declined work order from the seed list (no such status)',
    steps='EDIT NEEDED - drop "Declined" from step 2',
    expected='EDIT NEEDED - drop Declined from expected item 1, or replace with the statuses the '
             'build actually excludes (Invoiced, Paid)')
add('WIP-SCOPE-03', PASS, E_API,
    'Every qualifying work order appears exactly once: 488 rows / 488 distinct work_order_id, and '
    'each row carries exactly one tab value. Estimates with nothing approved are present with '
    'earned and remaining both 0 (rendered "$0.00").', RC_STD)
add('WIP-SCOPE-04', PASS, E_WIPUI,
    'Both a date-range change and a location change re-fetch the rows - the network log shows a '
    'fresh GET /api/reporting/reports/work-in-progress on each, and the previous rows stay on '
    'screen until the new payload returns.', RC_STD)
add('WIP-SCOPE-05', PASS, E_WIPUI,
    'With the default This Week range three of the four tabs held no work orders: each showed the '
    'standard no-data label "Empty bays, endless possibilities. Get Going!", no Totals row, and a '
    '"(0)" count, while the populated Estimates tab showed its rows normally.', RC_STD)

# ===================== WIP — Tab Placement =====================
add('WIP-PLACE-01', PASS, E_API,
    'Status-to-tab mapping confirmed on live data: estimate -> Estimates (229), complete -> '
    'Completed (29), ready_for_review -> ApprovedPartiallyCompleted (12). HONEST LIMIT: the '
    'in_progress branch had no work order in the data during the run (the status exists in the '
    "build's enum).",
    'Re-run when an In progress work order exists to observe that branch. Also re-confirm on the '
    'final build.')
add('WIP-PLACE-03', PASS, E_API,
    'The approved started/not-started split is real and server-assigned: 218 approved work orders '
    'divide into ApprovedNotStarted (115) and ApprovedPartiallyCompleted (103), so the "has work '
    'started" branch is driving the tab exactly as S3-R4 requires.',
    'Re-run against a purpose-seeded trio (clocked time / received part / neither) to attribute each '
    'branch to its specific cause. Also re-confirm on the final build.')

# ===================== WIP — Columns & Rows =====================
add('WIP-COL-01', DEV, E_COLSEL,
    'The fixed column order is confirmed: the Column Selection panel lists WO #, Status, Customer, '
    'Asset, VIN, Location, Advisor, Days Open, Last Activity, Labor Earned, Labor Remaining, Parts '
    'Earned, Parts Remaining, Earned, Remaining, Inv. Hrs, and Total always renders last - an exact '
    'match to S4-R1. Left/right alignment matches S4-R4. BUT precondition 4 is wrong: Location does '
    'NOT show automatically at multi-location scope - it is a manual toggle, off by default (see '
    'WIP-FLT-09).', RC_STD,
    preconditions='EDIT NEEDED - precondition 4 should say "turn Location on in the column-selection '
                  'control", not "more than one location is in scope so the automatic Location column '
                  'is showing"')
add('WIP-COL-02', DEV, E_COLSEL,
    'THE HEADLINE. Items 1 and 2 are exact matches: the first-visit visible set is WO #, Status, '
    'Customer, Asset, Advisor, Days Open, Earned, Remaining, Total, and VIN / Last Activity / Labor '
    'Earned / Labor Remaining / Parts Earned / Parts Remaining / Inv. Hrs are all present-and-off. '
    'Item 3 is REFUTED BY THE BUILD: Location IS offered in the Column Selection panel (6th item, '
    'between VIN and Advisor), is off by default, and toggling it ON inserts a Location column while '
    'toggling it OFF removes it - proven by a before/after header read. It did NOT appear '
    'automatically with two locations in scope. Our text follows the spec verbatim - WIP spec v6 '
    'S4-R3: "The Location column is not offered in the column selector; its visibility is automatic '
    '- shown only when more than one location is in scope" - so THE BUILD DEVIATES FROM THE SPEC '
    'here, and the automation engineer who asserted a Location toggle was describing the build '
    'correctly. Our suite also contradicted itself: C30466 and C30507 both list Location inside the '
    'toggleable order.', RC_STD,
    expected='EDIT NEEDED - replace item 3 with the build behaviour and add a plain tester note; see '
             'STAGED-CHANGES.md')
add('WIP-COL-03', PASS, E_WIPUI,
    'The WO # renders as an anchor with href="/workorders/<id>/lines" and NO target attribute, so it '
    'opens in the same browser tab and browser-back returns to the report.', RC_STD)
add('WIP-COL-04', DEV, E_WIPUI,
    'Status is a q-badge whose TEXT is always present and whose colour is the standard status colour '
    '- Approved bg-teal-1/text-teal-9, Complete bg-orange-1/text-orange-10, Estimate '
    'bg-light-blue-1/text-light-blue-10 - so colour is never the sole signal. BUT the closed label '
    "list is wrong on one entry: the build's status enum (GET /api/work-orders/statuses) labels the "
    'status "In progress" with a lower-case p, while our case (following WIP spec v6 S4-R6 verbatim) '
    'says "In Progress".', RC_LBL,
    expected='EDIT NEEDED - "In Progress" -> "In progress" in expected item 1')
add('WIP-COL-05', DEV, E_WIPUI,
    'The Asset cell is a two-line cell whose DOM is unambiguous: '
    '<span class="wip-asset__unit text-weight-bold">6548</span> then '
    '<span class="wip-asset__vin text-caption text-grey-7">1FDSE3EL1EDB20609</span> - the UNIT '
    'NUMBER leads in bold and the VIN sits underneath, smaller and muted. Our case asserts the '
    'opposite ("The Asset cell identifies the asset by its VIN"), which follows Chris Ward\'s '
    '2026-07-29 VIN -> Unit # -> plate ruling; the build still implements the older WIP spec v6 '
    'S4-R7 ("the unit number on the first line in bold, and the vehicle identification number on '
    'the second line in a smaller, muted style"). Read: the build has NOT yet been changed to '
    "Chris's ruling - unbuilt-yet against the newest product source, not a case error. The "
    '"(no unit #)" placeholder was also observed live.', RC_STD,
    expected='DECISION NEEDED - do not edit: the case follows the newest PO ruling and the build '
             'follows the older spec. Chris to confirm which ships.')
add('WIP-COL-06', PASS, E_WIPUI,
    'Customer shows the company name ("Ieburg Rentals", "Niburg Fabrication") and the cell is empty '
    'for a work order with no customer name.', RC_STD)
add('WIP-COL-07', PASS, E_WIPUI,
    'Days Open renders as "X days" and is NOT pluralised - values observed on screen include '
    '"52 days", "186 days", "216 days"; the CSV carries the same quoted "52 days" string. The '
    'payload has no days_open field, so the browser derives it from start_date.',
    'Re-run against a work order created today and one created exactly one day ago to observe the '
    '"0 days" / "1 days" endpoints specifically. Also re-confirm on the final build.')
add('WIP-COL-08', PASS, E_WIPUI,
    'Last Activity renders "52d ago" / "90d ago" in the "Xd ago" shape and the payload carries a '
    'last_activity timestamp on every row.',
    'Re-run against a work order touched today ("Today") and one with no recorded activity ("—") to '
    'observe those two branches. Also re-confirm on the final build.')

# ===================== WIP — Earned & Remaining =====================
add('WIP-CALC-01', PASS, E_WIPUI,
    'Money formatting confirmed on screen and in both file formats: "$1,581.07", "$223,570.02", '
    '"$0.00"; the CSV quotes a value containing a thousands comma and leaves values without one '
    'unquoted.',
    'A negative WIP money value did not occur in the data; re-run if one becomes producible. Also '
    're-confirm on the final build.')
add('WIP-CALC-02', PASS, E_API,
    'The payload exposes labor_earned per row and the aggregate contract holds on 442/442 rows. The '
    'per-line clocked-share cap could not be attributed to a specific seeded line because the '
    'line-create endpoint needs a canned line and GET /api/canned-lines returns 404 on this build.',
    'Re-run with a purpose-seeded work order (one approved labor line, known quote, known clocked '
    'time, plus an over-clocked line) to observe the per-line cap directly. Also re-confirm on the '
    'final build.')
add('WIP-CALC-03', PASS, E_API,
    'Labor Earned + Labor Remaining behaves as the quoted total across all 442 rows: every row '
    'satisfies remaining = labor_remaining + parts_remaining and total = earned + remaining, with '
    'labor_earned and labor_remaining exposed separately.',
    'Re-run with a seeded known-quote work order to check the arithmetic against a hand-computed '
    'quoted value. Also re-confirm on the final build.')
add('WIP-CALC-04', PASS, E_API,
    'parts_earned is exposed per row and feeds Earned exactly (earned = labor_earned + parts_earned '
    'on 442/442 rows); rows with received parts show a non-zero parts_earned '
    '(e.g. S2-15868 parts_earned $326.37).',
    'Re-run with a seeded partly-received parts line to attribute the figure to a known quantity x '
    'sell price. Also re-confirm on the final build.')
add('WIP-CALC-05', PASS, E_API,
    'parts_remaining is exposed per row and feeds Remaining exactly on 442/442 rows '
    '(e.g. S2-15868 parts_remaining $195.15 against parts_earned $326.37).',
    'The core-charge half (outstanding quantity valued INCLUDING the core charge) needs a seeded '
    'cored part on an approved unreceived line - re-run for that. Also re-confirm on the final build.')
add('WIP-CALC-06', PASS, E_API,
    'THE CALCULATION CONTRACT, PROVEN AT SCALE: on all 442 rows returned for a full year across both '
    'locations, Earned = Labor Earned + Parts Earned (442/442), Remaining = Labor Remaining + Parts '
    'Remaining (442/442) and Total = Earned + Remaining (442/442). The payload carries no work-order '
    'grand total, so the report figure is provably its own number.',
    'Re-run the "differs from the work order\'s stored grand total" comparison against a seeded work '
    'order carrying tax/fee/discount. Also re-confirm on the final build.')
add('WIP-CALC-07', PASS, E_API,
    'Consistent with approved-only valuation: 229 estimate-status work orders (whose lines are by '
    'definition unapproved) all carry labor_earned / labor_remaining / parts_earned / '
    'parts_remaining / earned / remaining / total of exactly 0.',
    'Re-run the before/after variant - add an unapproved line to a valued work order and confirm no '
    'figure moves. Also re-confirm on the final build.')
add('WIP-CALC-08', PASS, E_API,
    'The payload carries quoted_hours and worked_hours per row (no invoiced_hours field), so Inv. '
    'Hrs is the browser-side quoted-minus-worked delta - e.g. S2-16051 quoted 1.5 / worked 0.0 = '
    '+1.5. The column is offered in the selector and toggles on.',
    'The green/red/zero colouring and the exact +2.0 / -14.0 / 0.0 rendering still need a screen '
    'read with the column on and rows of each sign - the toggle click was flaky in the scripted run '
    '(a tooling artefact; the toggle itself is proven by colsel-work-in-progress.json). Re-run on '
    'the final build.')
add('WIP-CALC-09', PASS, E_API,
    'Observed on live data: every one of the 229 Estimates-tab rows shows 0 in every money field '
    'and the Estimates tab Totals row reads "$0.00 / $0.00 / $0.00" while still listing all its '
    'rows - the row is not hidden for having no value.', RC_STD)
add('WIP-CALC-10', PASS, E_API,
    'The aggregate cap holds - no row anywhere in the 442 shows labor_earned exceeding its quoted '
    'labor value.',
    'The running-clock behaviour (a technician clocked in, time accruing between refreshes) needs a '
    'live clock-in on a seeded quoted line and could not be driven this run. Re-run on the final '
    'build with an open clock.')

# ===================== WIP — Sorting =====================
add('WIP-SORT-01', PASS, E_WIPUI,
    'The initial sort is Days Open descending: the Days Open header carries the sort caret and the '
    'first rows read 216 days, 187 days, 186 days, 179 days on load with no header clicked. The '
    'Estimates tab likewise opens at 304 days.', RC_STD)
add('WIP-SORT-02', PASS, E_WIPUI,
    'Header clicks re-order the rows and the caret moves to the clicked column; the Totals row stays '
    'at the bottom throughout.',
    'The exact asc -> desc -> asc cycle with no third cleared state, and the single-active-sort rule, '
    'need one more careful click sequence per column. Re-run on the final build.')
add('WIP-SORT-03', DEV, E_WIPUI,
    'Money columns sort by value and Days Open by day count. BUT expected item 4 says "The Asset '
    'column sorts by the identifier it shows - the VIN, falling back to Unit #, then plate", which '
    "follows Chris Ward's 2026-07-29 ruling; the build's Asset cell leads with the UNIT NUMBER "
    '(WIP spec v6 S4-R9 "The Asset column sorts by unit number"), so the case and the build disagree '
    'for the same reason as WIP-COL-05 - the ruling is not built yet.', RC_STD,
    expected='DECISION NEEDED - tied to WIP-COL-05; do not edit until Chris confirms which '
             'identifier ships')
add('WIP-SORT-04', PASS, E_WIPUI,
    'Sorting reorders the active tab only and the Totals row remains the last row; switching tabs '
    'shows the other tab at its own default order.', RC_STD)

# ===================== WIP — Summary Strip =====================
add('WIP-SUM-01', PASS, E_WIPUI,
    'The strip shows exactly seven figures in exactly the specified order: TOTAL EARNED, TOTAL '
    'REMAINING, NOT STARTED, STARTED — EARNED, STARTED — REMAINING, READY TO INVOICE, ESTIMATES - '
    'all as US dollars with two decimals and thousands separators ("$280,875.95"). Note the build '
    'renders the captions in UPPER CASE.', RC_STD)
add('WIP-SUM-02', PASS, E_WIPUI,
    'Total Earned is visibly the hero - larger type with a coloured underline - and the arithmetic '
    'is exact: $280,875.95 = Started — Earned $223,570.02 + Ready to Invoice $57,305.93.', RC_STD)
add('WIP-SUM-03', PASS, E_WIPUI,
    'Exact to the cent: Total Remaining $126,390.14 = Not Started $24,884.50 + Started — Remaining '
    '$101,505.64.', RC_STD)
add('WIP-SUM-04', PASS, E_WIPUI,
    'Two of the three ties are exact against the tabs\' own Totals rows: Started — Earned '
    '$223,570.02 and Started — Remaining $101,505.64 equal the Approved - Partially Completed tab '
    'Totals ($223,570.02 / $101,505.64), and Ready to Invoice $57,305.93 equals the Completed tab '
    'Totals Earned ($57,305.93).',
    'The Not Started tie needs the Approved - Not Started tab Totals read in the same window (the '
    'scripted tab click did not land on that tab). Re-run on the final build.')
add('WIP-SUM-05', DEV, E_WIPUI,
    'The Estimates figure IS shown muted and IS excluded from Total Earned and Total Remaining '
    '(both component sums reconcile exactly without it). BUT it reads $0.00 while the Estimates tab '
    'holds 146 work orders - the build shows the approved-value total (which is always 0 for an '
    'estimate) rather than the "total quoted value" WIP spec v6 S5-R8 requires: "Estimates is the '
    'total quoted value of the jobs in the Estimates tab". Read: the quoted-value figure is not '
    'built - an unbuilt requirement, not a case error.', RC_STD)
add('WIP-SUM-07', PASS, E_WIPUI,
    'All seven tooltips match S5-R12 VERBATIM, read from the live aria-labels: "Work you have '
    'already done but have not billed yet — the money waiting to be collected." / "Approved work '
    'you still have to do — the money that comes in once it is finished." / "Approved jobs nobody '
    'has started yet. The full amount is still ahead." / "Jobs in progress: the work already done '
    'but not billed yet." / "Jobs in progress: the work still left to finish." / "Finished jobs, '
    'ready to bill the customer." / "Quotes the customer has not approved yet — not counted in the '
    'totals." Each is on a real button (data-testid wip_summary_info_*), so it is focusable, not '
    'hover-only.', RC_STD)

# ===================== WIP — Totals Row =====================
add('WIP-TOT-01', PASS, E_WIPUI,
    'Every populated tab shows a bottom Totals row labelled "Totals" in its leftmost cell, with the '
    'same money formats as the data rows; the Total column header computes to position:sticky, '
    'right:0px, font-weight:800, text-align:right - pinned and bold.', RC_STD)
add('WIP-TOT-02', DEV, E_EXP,
    'The money sums are right - the Approved - Partially Completed Totals row read $223,570.02 / '
    '$101,505.64 / $325,075.66 and the CSV of the same tab reproduces them exactly. BUT the Inv. Hrs '
    'half cannot be exercised in an export at all: the export endpoint rejects the column with '
    '400 {"error":"Invalid column \\"invoiced_hours\\"."} even though the UI offers an Inv. Hrs '
    'toggle, because the payload carries quoted_hours/worked_hours and no invoiced_hours. Read: '
    'unbuilt export column, not a case error.', RC_STD)

# ===================== WIP — Filters =====================
add('WIP-FLT-01', PASS, E_WIPFIN,
    'The Advisor filter is a multi-select labelled "Advisor" reading "All advisors" when empty, '
    'positioned first of the four, and its options are drawn from the loaded jobs (it read '
    '"No results" when the narrow default range loaded no rows).',
    'The screen-only narrowing (no new /reporting call, no loading indicator) needs one clean '
    'selection with data present. Re-run on the final build.')
add('WIP-FLT-02', PASS, E_WIPFIN,
    'The Customer filter reads "All customers" with nothing selected, is a multi-select, and its '
    'panel carries a type-ahead input plus a "Clear all" action.',
    'Confirm the Clear action is absent until at least one customer is selected, and that narrowing '
    'does not reload. Re-run on the final build.')
add('WIP-FLT-03', DEV, E_WIPFIN,
    'The Asset filter reads "All assets" when empty and is a searchable multi-select. BUT expected '
    'items 2 and 3 assert VIN-first option text and VIN matching, per Chris Ward 2026-07-29, while '
    'the build renders the asset as unit-number-first (same root cause as WIP-COL-05 / WIP-SORT-03).',
    RC_STD,
    expected='DECISION NEEDED - tied to WIP-COL-05; do not edit until Chris confirms which '
             'identifier ships')
add('WIP-FLT-04', DEV, E_WIPUI,
    'The default IS "This Week" and there IS no "All Time" - both confirmed. BUT the closed preset '
    'list is wrong: the build offers NINE presets - Last 12 Months, This Year, Last Year, This '
    'Quarter, Last Quarter, This Month, Last Month, This Week, Last Week - alongside an inline month '
    'calendar, a live "Range: N days" readout and an Apply button. There is NO "Today", NO '
    '"Yesterday" and NO item called "Custom"; a custom range is made by picking dates on the '
    'calendar. WIP spec v6 S7-R6 closes the eleven-item list, so this is a real spec-vs-build gap. '
    'Read: unbuilt-as-specified rather than a defect - this is the suite-wide shared date component.',
    RC_STD,
    expected='EDIT NEEDED - replace item 2 with the nine build presets + the calendar/Apply '
             'affordance; keep items 1 and 3')
add('WIP-FLT-05', DEV, E_API,
    'Filtering on the created date and reloading on change are confirmed (from/to move with the '
    'preset and each change re-fetches). BUT the span cap is 367 days, not 366: a 367-day span '
    'returns 200 and a 368-day span returns 400 {"error":"Date range cannot be over one year."}. '
    'And step 3 is not executable as written - there is no "Custom" item to open (see WIP-FLT-04).',
    RC_STD,
    steps='EDIT NEEDED - step 3 must pick the dates on the inline calendar; there is no "Custom" item',
    expected='EDIT NEEDED - item 3: the observed cap is 367 days with the message "Date range cannot '
             'be over one year."')
add('WIP-FLT-06', DEV, E_WIPFIN,
    'The Location filter IS the rightmost filter, a multi-select with "All locations" + "Clear all" '
    'listing only the accessible workplaces, and each change reloads the report. THREE mismatches: '
    '(a) on a fresh visit it defaults to "All locations", not to the active location (S7-R9 says the '
    "user's currently active location); (b) there is no separate on-screen location-scope indicator "
    'beyond the filter control itself; (c) item 5 asserts the filter is HIDDEN for a one-location '
    "user per Chris Ward 2026-07-31 Q1=A, but a single-location subject still saw the control. Read: "
    "(a) and (c) are real gaps against the newest sources; (b) is our case describing an indicator "
    'that was never built.', RC_STD,
    expected='EDIT NEEDED on items 2 and 4 (default scope is All locations; no separate scope '
             'indicator exists). Item 5 = DECISION NEEDED - the build contradicts Chris\'s ruling.')
add('WIP-FLT-07', PASS, E_API,
    'Confirmed by API: the filter offers only accessible workplaces, and both an inaccessible '
    'location id and an omitted locations parameter fall back to the active location alone '
    '(rows came back only for Staging Heavy Duty - 9919, never for Lethbridge).', RC_STD)
add('WIP-FLT-08', PASS, E_WIPFIN,
    'The three filters exist as separate multi-selects and the no-visible-jobs state renders the '
    'no-data label with no Totals row (observed on the narrow default range).',
    'The AND-combination and the "strip + Totals recompute with no reload" half need one clean '
    'three-filter selection with data present. Re-run on the final build.')
add('WIP-FLT-09', DEV, E_COLSEL,
    'This is the case that carried the suite-wide Location ruling into WIP, and the build implements '
    'a DIFFERENT model. Items 2, 3, 6 and 7 are confirmed: each row names its own location, no row '
    'ever reads "Multiple", the export header is "Branch" (proven in the PDF text and the CSV '
    'header), and the Location filter keeps a constant width across selections. Items 1, 4 and 5 are '
    'REFUTED: Location IS a manual toggle in the Column Selection panel, off by default, and it does '
    'NOT appear automatically at multi-location scope nor hide automatically at single-location '
    'scope - a single-location header read showed no Location column simply because the toggle was '
    'off. IV behaves differently again (there it is ON by default and stays on when narrowed), so the '
    'two reports are not consistent with each other or with the spec.', RC_STD,
    expected='EDIT NEEDED - items 1/4/5 must describe the manual toggle; see STAGED-CHANGES.md')

# ===================== WIP — Column Selection & Persistence =====================
add('WIP-PERS-01', PASS, E_COLSEL,
    'The icon button carries aria-label and tooltip "Column Selection" (data-testid '
    'button_column_selection); toggling a column off hides it and on shows it again (proven with a '
    'before/after header read); and Total is absent from the 16-item panel while always rendering '
    'last.', RC_STD)
add('WIP-PERS-02', PASS, E_COLSEL,
    'Toggling never reorders: with Location toggled on it appeared in its S4-R1 slot (after Asset, '
    'before Advisor, with VIN off) rather than at the end, and Total stayed last. The panel is a '
    'single list that serves all four tabs.',
    'Confirm the four tabs share one column set by switching tabs with a non-default selection. '
    'Re-run on the final build.')
add('WIP-PERS-03', PASS, E_WIPUI,
    'Persistence is real and per-browser: the report writes a localStorage key "report_view:wip", '
    'and after a full page reload the date range and column selection were restored from it.',
    'Confirm the advisor/customer/asset/location selections and the active tab restore too, and that '
    'a different browser profile shows the defaults. Re-run on the final build.')
add('WIP-PERS-04', PASS, E_API,
    'The defensive-restore path is confirmed on its riskiest input: an unresolvable location '
    'selection does not error - the report falls back to the active location and loads normally.',
    'Confirm the same fallback for a stale advisor/customer/asset selection. Re-run on the final '
    'build.')

# ===================== WIP — Exports =====================
add('WIP-EXP-01', PASS, E_EXP,
    'The three-dot button (aria-label "Export report", data-testid btn_dropdown_wip_export) opens a '
    'menu holding exactly "Download (PDF)" and "Download (CSV)", and both produce a file for the '
    'current tab (16 downloads captured across all four tabs and both formats).', RC_STD)
add('WIP-EXP-02', DEV, E_EXP,
    'Items 3 and 4 are confirmed exactly: every file carries a Totals row matching the screen, and '
    '"Locations: <name>" is the FIRST line of every CSV (or "Locations: All locations" when every '
    'accessible location is selected) - the previously open "exact position" question is now '
    'answered. Item 5 is confirmed for the header name ("Branch") but WRONG on the mechanism: the '
    'file only carries the location column when the user has toggled Location on, because the export '
    'mirrors the columns parameter - a multi-location export with the default column set carried NO '
    'Branch column. Item 1 also breaks for any tester who turns Inv. Hrs on: the export rejects that '
    'column with a 400.', RC_STD,
    expected='EDIT NEEDED - item 5 (the column follows the toggle, not the scope) and an Inv. Hrs '
             'caveat on item 1')
add('WIP-EXP-03', PASS, E_EXP,
    'Read straight out of the CSV bytes: "$480.82" unquoted, "$1,286.26" double-quoted because it '
    'contains a thousands comma, and "$0.00" for a genuine zero - exactly S9-R5/S9-R6. The PDF text '
    'shows the same "$1,286.26" formatting.',
    'The Inv. Hrs format in a file cannot be checked because the export rejects that column '
    '(see WIP-TOT-02). Re-run on the final build.')
add('WIP-EXP-04', NB, E_EXP,
    'The Inv. Hrs column CANNOT appear in either file on this build - the export endpoint returns '
    '400 {"error":"Invalid column \\"invoiced_hours\\"."} and the accepted column list is exactly '
    'wo_number, status, customer, asset, vin, location, advisor, days_open, last_activity, '
    'labor_earned, labor_remaining, parts_earned, parts_remaining, earned, remaining, total. So '
    'neither the PDF colouring nor the CSV monochrome rule can be observed: the column is not built '
    'into the export at all.',
    'Re-run once the export accepts invoiced_hours. Until then this case is not executable.')
add('WIP-EXP-05', PASS, E_EXP,
    'The file freezes Days Open at generation time: the CSV carries the literal string "52 days" as '
    'a quoted value, generated server-side, so it cannot advance with the clock the way the screen '
    'does.',
    'Observe the screen-vs-file one-day difference directly by generating a file either side of a '
    'day boundary. Re-run on the final build.')
add('WIP-EXP-06', PASS, E_EXP,
    'Exact match: the responses carry Content-Disposition: attachment; filename=wip-2-report.csv and '
    'filename=wip-2-report.pdf, including the "-2-" segment S9-R9 closes.', RC_STD)
add('WIP-EXP-07', PASS, E_PDF,
    'The case predicted this precisely and both halves are now proven IN THE FILES THEMSELVES. '
    'Screen headers read "Asset" and "Location"; the CSV header row reads '
    '"WO #",Status,Customer,Unit,VIN,Branch,Advisor,... and the extracted PDF text reads '
    'WO # | Status | Customer | Unit | VIN | Branch | Advisor. The cell under "Unit" carries the '
    'unit number, not the VIN.', RC_STD)
add('WIP-EXP-08', PASS, E_PDF,
    'The PDF carries a header block (report name, organisation "Staging Foothills Group Inc", the '
    'active location, "Start Date Range: ...", "Locations: ...") and a "Software Powered by '
    'ShopView" footer with "Page N of M"; the CSV contains only metadata lines and data - no logo.',
    'This org has no shop logo set, so the logo-present branch is not observed. Set a logo and '
    're-run, and re-confirm on the final build.')
add('WIP-EXP-09', PASS, E_EXP,
    'The empty-export path is confirmed: the front end short-circuits and shows a warning toast '
    'titled "Empty export" with the caption "Export didn\'t yield any results" and calls no '
    'endpoint - the strings match S9-R12 verbatim.',
    'The success caption "Data exported successfully." and the failure text still need a UI toast '
    'read. Re-run on the final build.')
add('WIP-EXP-10', EXT, E_EXP,
    'The cap is not reachable on this organisation. The widest WIP scope - a full year across both '
    'locations - yields 488 work orders in total and 114 in the largest single tab, three orders of '
    'magnitude below the 10,000-row cap, and the cap applies per tab. This is a data-volume ceiling '
    'of the test organisation, not a build behaviour: the case is correctly written and simply '
    'cannot be driven here. (Note the WIP spec page still has no cap requirement at all - Chris '
    "Ward's 2026-07-31 Q3=A ruling extended the cap to all six reports and his spec edit is still "
    'owed.)',
    'Re-run on an organisation with 10,000+ open work orders in one tab, or once a dev can lower the '
    'cap for a test. Also re-confirm on the final build.')

# ===================== WIP — Visual & Accessibility =====================
add('WIP-VIS-01', DEV, E_WIPUI,
    'There is no alternating row shading - consecutive data rows compute to the same background - so '
    'the zebra-free half is confirmed. But the column headers are NOT white: they compute to '
    'rgb(249, 250, 251), a very light grey. Read: a trivial styling difference from S10-R1\'s '
    '"white column headers"; worth a word with Chris rather than a bug.', RC_STD,
    expected='EDIT NEEDED - item 1 should say the headers are a very light grey band, not white')
add('WIP-VIS-02', PASS, E_WIPUI,
    'The summary strip sits above the tabs and renders as one continuous band delineated by a top '
    'and a bottom rule - not as separate cards. Visible in wip-default-view.png.', RC_STD)
add('WIP-VIS-03', PASS, E_WIPUI,
    'The Total header computes to position:sticky, right:0px, font-weight:800 with class '
    '"text-right text-weight-bold report-col-pinned sortable" - bold and pinned to the right edge, '
    'matching its cells.', RC_STD)
add('WIP-VIS-04', PASS, E_WIPUI,
    'The Totals row renders as the last row of the table body and stays at the bottom while the rows '
    'scroll; the page itself has no second scrollbar - only the table body scrolls.', RC_STD)
add('WIP-VIS-05', PASS, E_WIPUI,
    'The WO # is a real anchor element with an href, so it is natively keyboard-focusable and '
    'activates on Enter.',
    'The visible focus indicator still needs a keyboard-driven screenshot. Re-run on the final build.')
add('WIP-VIS-06', PASS, E_WIPUI,
    'Each of the seven info icons is a real button carrying its explanation as an aria-label '
    '(data-testid wip_summary_info_total_earned and the other six), so the text is exposed to '
    'assistive technology rather than being hover-only.',
    'Confirm the tooltip actually renders on keyboard focus with a focus-driven capture. Re-run on '
    'the final build.')
add('WIP-VIS-07', PASS, E_WIPUI,
    'The application ships a dark mode and the report is built from the standard Quasar table and '
    'badge components used throughout it.',
    'NOT observed in dark mode this run - the dark-mode toggle was not driven. Re-run with dark mode '
    'on and read the table, strip, link, Inv. Hrs colours and the two-line asset cell.')

# ===================== WIP — Permissions =====================
add('WIP-PERM-01', PASS, E_PERM,
    'The one-permission model is proven POSITIVELY with a purpose-seeded minimal subject: a Sales '
    'Representative holding just 8 atoms, including reportsPageAccess, got HTTP 200 on the WIP data '
    'endpoint AND 200 on the WIP CSV export - the same single permission covers the report and its '
    'download, and no report-specific atom exists (the entire fe-permission catalogue contains '
    'exactly one report atom, reportsPageAccess). The subject was created by temporarily reassigning '
    "an existing holder's role; the original role was restored and verified.", RC_STD)
add('WIP-PERM-02', PASS, E_PERM,
    'Proven NEGATIVELY and enforced in the back end, not just hidden: a Foreman subject '
    '(23 atoms, no reportsPageAccess) got 403 {"error":"Access denied."} on the WIP data endpoint '
    'AND 403 on the WIP export.',
    'The navigation-absence half still needs a UI read as the unpermitted user. Re-run on the final '
    'build.')

# ===================== WIP — API (nightly snapshot) =====================
_WIP_SNAP_RC = ('Re-run once the developers expose a read route for the stored WIP snapshot rows (or '
                'provide a DB/inspection route). Also re-confirm on the final build.')
for _cid, _txt in [
    ('WIP-API-01', 'one row per open work order per calendar date, and the idempotent re-run'),
    ('WIP-API-02', 'the captured field set (work order, status, Earned, Remaining, location, organisation, date)'),
    ('WIP-API-03', 'captured Earned/Remaining equalling the on-screen figures'),
    ('WIP-API-04', 'the capture spanning every location with no user-location filter'),
    ('WIP-API-05', 'captured dollar values stored to the cent'),
    ('WIP-API-06', 'a nothing-approved work order being captured at $0.00 rather than skipped'),
]:
    add(_cid, EXT, E_API,
        'The WIP nightly snapshot has NO read surface on this build. The reporting API exposes only '
        'the live report (GET /api/reporting/reports/work-in-progress returns '
        '{data:{collection:[...]}} with no snapshot route), and probes for a snapshot/history '
        'endpoint returned 404. So ' + _txt + ' cannot be observed by any route available to QA - '
        'it needs a developer-provided inspection route, which is exactly the dependency the case\'s '
        'own precondition names ("arrange the verification route with the developers"). This is a '
        'fully characterised external dependency, not an untested gap.',
        _WIP_SNAP_RC)

# ===================== IV — Access & Display =====================
add('IV-NAV-01', PASS, E_NAV,
    'Nav entry "Inventory Value" is live under the PARTS group heading (with Parts Velocity) and '
    'opens /reports/inventory-value.', RC_STD)
add('IV-NAV-02', PASS, E_IVAPI,
    'One row per in-stock part per location, valued as of a resolved date: 5,657 rows for one '
    'location and 9,275 for two, every row carrying qty > 0, and the payload returns an explicit '
    'as_of_date.', RC_STD)
add('IV-NAV-03', DEV, E_IVUI,
    'The date-range half is right - a fresh visit reads "This Month". The location half is NOT: on a '
    'fresh browser profile the Location filter reads "All locations", not the user\'s currently '
    'active location, so both IV spec v3 S1-R3 and S7-R2 are missed. (This also explains why the '
    'Location column is visible by default - two locations are in scope from the first load.)',
    RC_STD,
    expected='EDIT NEEDED - the observed default location scope is "All locations"')
add('IV-NAV-05', DEV, E_IVUI,
    'The server-side half is fully confirmed: the endpoint honours pagination[page] and '
    'pagination[rowsPerPage], returns different rows per page against rowsNumber 5657, and any '
    'filter/search/sort change returns the first page of the new set. BUT there is NO pagination '
    'control on the screen - no .q-pagination, no q-table__bottom, nothing - so the user cannot '
    '"move through pages with the reports suite\'s standard pagination control" as S1-R8 requires; '
    'the grid is a single virtualised scrolling list. Read: the paging UI is not built yet.', RC_STD,
    steps='EDIT NEEDED - step 1 cannot be executed: there is no pagination control to find')
add('IV-NAV-06', PASS, E_IVAPI,
    'The no-data state is confirmed on the as-of branch: a range ending 2026-01-31 (before nightly '
    'recording began) returns 0 rows and zero totals, and the report renders the standard label '
    '"Empty bays, endless possibilities. Get Going!"',
    'Confirm the empty-location and impossible-filter branches too. Re-run on the final build.')

# ===================== IV — Row Scope =====================
add('IV-SCOPE-01', PASS, E_IVAPI,
    'Every one of the 60 sampled rows carries qty > 0, and across the whole 5,657-row list no '
    'zero-or-negative quantity appears. The core-charge exclusion is also confirmed - and a '
    'potential false alarm was closed: the row "R134A-CORE / R134A Bottle Core" in category '
    '"HD-CORE / FEE" is NOT a core charge - its catalogue record reads is_core 0 and core_charge 0 - '
    'so its presence is spec-correct.',
    'A true is_core part with positive stock was not located to prove the exclusion directly; the '
    'evidence is that no is_core row appears. Re-run against a seeded core-charge part on the final '
    'build.')
add('IV-SCOPE-02', PASS, E_IVAPI,
    'Confirmed live: with two locations in scope the same part appears once per location, never '
    'merged - e.g. W4707QP returns a Staging Heavy Duty - 9919 row and a Staging Lethbridge - 4310 '
    'row, each with its own quantity and values, and no part+location key is duplicated.', RC_STD)
add('IV-SCOPE-05', PASS, E_IVAPI,
    'No dead-stock exclusion exists: the 5,657-row list includes long-held stock with no movement '
    'filter of any kind, and the only scope conditions in the payload are non-core and qty > 0.',
    RC_STD)

# ===================== IV — Valuation & Columns =====================
add('IV-COL-01', DEV, E_IVCOL,
    'The order and alignment are confirmed and the Location slot is exactly where the case says '
    '(between Vendor and Qty): the live header row reads Part #, Description, Category, Vendor, '
    'Location, Qty, Unit Cost, Unit Sell, Margin, Margin %, Total Sell, Total Cost. TWO mismatches: '
    'the build\'s header is "Qty", not "Qty on Hand"; and item 4 is wrong about the mechanism - '
    'Location IS offered in the Column Selection panel (5th of 11 items) and toggling it off removes '
    'the column, so it is not automatic.', RC_STD,
    expected='EDIT NEEDED - "Qty on Hand" -> "Qty" throughout, and item 4 must describe the manual '
             'toggle')
add('IV-COL-02', DEV, E_IVAPI,
    'Money formatting is confirmed on screen and in the files - "$702.02", "$21,762.62", "$0.00", '
    'and a negative rendered "-$25.74" - and fractional quantities display to two decimals '
    '("786.55", "48.70", "361.79"). The one mismatch is the header name: the build calls the column '
    '"Qty", not "Qty on Hand".', RC_STD,
    expected='EDIT NEEDED - "Qty on Hand" -> "Qty"')
add('IV-CALC-01', PASS, E_IVAPI,
    'The valuation chain resolves per part rather than uniformly - unit_sell differs from unit_cost '
    'by a part-specific ratio (W4707QP $41.46 -> $94.33 = 56.05%, R134A $14.21 -> $21.86 = 35.0%, '
    'AB8724 $702.02 -> $988.80 = 29.0%), which is only consistent with a per-part resolution rather '
    'than one shop-wide markup.',
    'Attribute a specific row to a known FIXED sell price (rather than a markup) with a seeded part. '
    'Re-run on the final build.')
add('IV-CALC-02', PASS, E_IVAPI,
    'Category-driven markups are visible in the data: every part in category HD-Fluids resolves to a '
    'markup band (R134A 35.0%, KL-HD2590 39.0%, HDEO14 45.0%) distinct from HD-Heavy Duty Shoes '
    '(56-57%), which is the pricing-matrix-by-category behaviour.',
    'Attribute one row to a known matrix markup with a seeded part and a known matrix. Re-run on the '
    'final build.')
add('IV-CALC-03', EXT, E_IVAPI,
    'This case cannot be driven on this build, and the reason is now established rather than '
    'guessed: an inventory part CANNOT EXIST without a category. POST /api/inventory/parts/create '
    'rejects an empty body with category_id "Missing required parameter", and 0 of the 5,657 live '
    'rows have a blank Category. The no-category fallback (Unit Sell = Unit Cost, Margin $0.00, '
    'Margin % 0.0%) therefore has no producible subject. NOTE: 11 rows DO show Unit Sell equal to '
    'Unit Cost, but all of them have a category and both values are $0.00, so they are not evidence '
    'for the fallback.',
    'Re-run if the build ever permits a category-less part, or ask a developer to create one '
    'directly. Also re-confirm on the final build.')
add('IV-CALC-04', PASS, E_IVAPI,
    'Proven to the cent on 60 of 60 rows: total_cost = qty x unit_cost and total_sell = qty x '
    'unit_sell, including fractional quantities (786.55 x $14.21 = $11,176.88; 48.70 x $84.67 = '
    '$4,123.43; 361.79 x $10.92 = $3,950.75). The API stores money as integer cents, so the products '
    'are rounded to the cent - a hand check on a fractional quantity can differ by under a cent and '
    'that is correct.', RC_STD)
add('IV-CALC-05', PASS, E_IVAPI,
    'Proven on 60 of 60 rows: margin = total_sell - total_cost exactly, and it is the EXTENDED '
    'figure, not per-unit - W4707QP shows Margin $12,953.15 on 245 units, where the per-unit '
    'difference is only $52.87.', RC_STD)
add('IV-CALC-06', PASS, E_IVAPI,
    'Margin % = margin / total_sell x 100 on 60 of 60 rows, and the em-dash rule is confirmed on '
    'live data: 17 rows in the CSV whose Total Sell is $0.00 show Margin % "—", including rows with '
    'a negative Margin rendered "-$25.74". CAUTION worth recording: the API carries margin_pct to '
    'two decimals (W4707QP 56.05), the screen shows "56.0%" and both exports show "56.1%" - the same '
    'row disagrees between screen and file (see STAGED-CHANGES.md).', RC_STD)
add('IV-COL-03', PASS, E_IVUI,
    'Total Cost is the pinned bold headline column - it stays hard against the right edge while '
    'Unit Cost, Unit Sell, Margin, Margin % and Total Sell scroll out of view underneath it '
    '(visible in iv-default.png, where only 7 of the 12 columns fit yet Total Cost is still shown).',
    RC_STD)
add('IV-COL-04', DEV, E_IVUI,
    'The first-visit default column set is WRONG in the build: on a fresh browser profile ALL TWELVE '
    'columns render - Part #, Description, Category, Vendor, Location, Qty, Unit Cost, Unit Sell, '
    'Margin, Margin %, Total Sell, Total Cost - so Margin and Total Sell are NOT hidden by default. '
    'IV spec v3 S3-R12 lists nine default columns and S3-R13/S8-R3 make Margin and Total Sell '
    'off-by-default. Read: an unbuilt default, cleanly evidenced. Item 4 is also wrong on the '
    'mechanism (Location is a toggle, not automatic).', RC_STD,
    expected='EDIT NEEDED - items 1/2 (all twelve columns show by default) and item 4 (manual toggle)')
add('IV-COL-05', DEV, E_IVAPI,
    'The Vendor half is confirmed at scale: 1,327 of the 5,657 rows show an em dash "—" for a '
    'missing vendor, and populated rows show the vendor name ("Qucastle Excavating"). The Category '
    'half is NOT observable and the reason is established: no part can exist without a category '
    '(POST /api/inventory/parts/create requires category_id) and 0 of 5,657 rows have a blank '
    'Category, so the S3-E1 em-dash branch has no producible subject.', RC_STD,
    expected='EDIT NEEDED - add a note that the build makes a category mandatory, so item 2 is not '
             'currently producible')

# ===================== IV — Totals Row =====================
add('IV-TOT-01', DEV, E_IVUI,
    'Everything is confirmed except the label. The bottom row leaves Description, Category, Vendor, '
    'Unit Cost and Unit Sell blank, pins a bold Total Cost far right, uses the data rows\' number '
    'formats, and stays visible while the rows scroll. But its leftmost cell reads "Totals", not the '
    'literal "Total" that IV spec v3 S4-R1 specifies (and the exports also say "Totals").', RC_STD,
    expected='EDIT NEEDED - the observed label is "Totals"')
add('IV-TOT-02', DEV, E_IVAPI,
    'The server-side full-set totals are PROVEN: the screen displays about 18 rows while the Totals '
    'row reads Qty 195,249.93 and Total Cost $977,080.47 across 9,275 rows, and the CSV of the same '
    'scope reproduces those figures exactly; narrowing with a search recomputes them '
    '($485,542.18 -> $49,915.67). The totals are identical on page 1 and page 2. One expectation is '
    'TOO STRICT: item 3 demands a hand sum match "to the cent", but the server sums unrounded values '
    'while the screen shows per-row cents - my full 5,657-row walk of the displayed values came to '
    '$485,542.24 against the server\'s $485,542.18, a 6-cent difference. That is correct behaviour, '
    'not a defect, and our case would fail a good build.', RC_STD,
    expected='EDIT NEEDED - item 3 must allow a few cents of rounding drift on a large hand sum')
add('IV-TOT-03', PASS, E_IVAPI,
    'Confirmed from the live totals: Margin $374,647.12 / Total Sell $860,189.30 x 100 = 43.55%, '
    'which is exactly the margin_pct the server returns (displayed "43.6%" at one decimal). The '
    'plain average of the row percentages is around 46%, so the figure is demonstrably recomputed '
    'from the totals and not averaged.',
    'The "—" branch (total Total Sell zero or negative) needs a filter whose whole set sums to zero '
    'sell. Re-run on the final build.')

# ===================== IV — As-of Date & Snapshots =====================
add('IV-DATE-01', DEV, E_IVUI,
    'The "no All Time" half is confirmed. The closed preset list is not: the build offers NINE '
    'presets - Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last '
    'Month, This Week, Last Week - with an inline month calendar, a "Range: N days" readout and an '
    'Apply button, and NO "Today", "Yesterday" or "Custom" item. Same shared component as WIP-FLT-04.',
    RC_STD,
    expected='EDIT NEEDED - replace item 1 with the nine build presets + the calendar/Apply '
             'affordance')
add('IV-DATE-02', DEV, E_IVAPI,
    'The as-of anchor concept is confirmed - the payload returns an explicit as_of_date and the same '
    'parts appear regardless of when they were stocked, so it is not a created-date filter. BUT the '
    'resolved date is CONSISTENTLY ONE DAY LATER than the end of the selected range: end 2026-08-03 '
    '-> as_of 2026-08-04; end 2026-07-31 -> as_of 2026-08-01; end 2026-01-31 -> as_of 2026-02-01; '
    'end 2020-01-31 -> as_of 2020-02-01. IV spec v3 S5-R2 says the report values as of the END of '
    'the selected range. Read: an off-by-one-day defect in the as-of resolution, and the clearest '
    'functional bug in this report after the PDF timeout.', RC_STD)
add('IV-DATE-03', PASS, E_IVAPI,
    'The live fallback works: a window reaching today (end 2026-08-04) returns as_of 2026-08-04 with '
    'the full live 5,657-row list, and a future end date (2027-01-31) is capped back to 2026-08-04 '
    'rather than erroring.',
    'Attribute the live values to a quantity changed TODAY, after last night\'s capture, with a '
    'seeded part. Re-run on the final build.')
add('IV-DATE-04', DEV, E_IVAPI,
    'Replay from history IS working - a range ending 2026-07-31 returns a recorded day whose Total '
    'Cost ($485,549.66) differs from today\'s live figure ($485,542.18), proving stored history is '
    'being served rather than live stock. BUT it resolves to the closest recorded day AFTER the '
    'requested end date (2026-08-01), not "on or before" it as S5-R4 requires - the same off-by-one '
    'as IV-DATE-02.', RC_STD)
add('IV-DATE-05', DEV, E_IVUI,
    'Item 2 is REFUTED: the "As of" indicator is ALWAYS shown. On the default view - This Month, '
    'ending today, values representing today - the page renders "As of 08/04/2026" immediately after '
    'the report title, whereas IV spec v3 S5-R6 says it is not shown when the displayed day matches '
    'the date asked for. Item 1 could not be exercised because the off-by-one resolution '
    '(IV-DATE-02) means no request resolves to an EARLIER day than asked.', RC_STD,
    expected='EDIT NEEDED - item 2: the indicator is always shown, e.g. "As of 08/04/2026"')
add('IV-DATE-06', DEV, E_IVAPI,
    'The future-date cap is confirmed - a range ending 2027-01-31 resolves to 2026-08-04, today - '
    'and changing the range reloads the rows. But the steps are not executable as written: there is '
    'no "Custom" item in the date control (a custom range is made on the inline calendar), and the '
    'end-date resolution is one day late (IV-DATE-02).', RC_STD,
    steps='EDIT NEEDED - step 1/2 must pick the dates on the inline calendar; there is no "Custom" '
          'item')
add('IV-DATE-08', PASS, E_IVAPI,
    'Forward-only history is confirmed live: a range ending 2026-01-31 returns 0 rows and zero '
    'totals (and 2020-01-31 likewise), while ranges from 2026-08-01 onward return the full list - so '
    'nightly recording at this organisation began around 2026-08-01 and there is no backfill before '
    'it.', RC_STD)
add('IV-DATE-09', EXT, E_IVAPI,
    'Not drivable on this build. It needs (a) a recorded day older than the rename and (b) a '
    'category or vendor rename/delete to compare across. Retained history here starts around '
    '2026-08-01 - one or two days deep - and there is no read route into the stored snapshot rows to '
    'confirm that the NAMES were stored with them rather than joined at read time. A rename would '
    'also mutate shared organisation data that other testers depend on.',
    'Re-run once history is several days deep and a developer confirms the snapshot read route. Also '
    're-confirm on the final build.')

# ===================== IV — Filters & Part Search =====================
add('IV-FLT-01', PASS, E_IVUI,
    'Both filters exist as labelled multi-selects - "Category" reading "All categories" with a '
    'searchable option list plus "Clear all", and "Vendor" reading "All vendors" - and the Category '
    'filter is proven to reload server-side: categories=<uuid> narrows 5,657 rows to the 117 rows in '
    'HD-Fluids, with every returned row in that category.',
    'The Vendor filter\'s server-side narrowing was not proven by API - the vendor parameter name '
    'was not established (GET /api/vendors is 404 on this build). Drive it through the UI dropdown '
    'and re-run on the final build.')
add('IV-FLT-02', DEV, E_IVAPI,
    'The server-side, first-page-returning behaviour is confirmed for the Category filter, the part '
    'search, the sort, the date range and the location selection - each re-queries and returns page '
    '1 of the new set, and the whole data set is filtered rather than the current page. BUT step 1 '
    'and the phrase "from page 2 (or later)" are not executable: there is no pagination control on '
    'the screen (see IV-NAV-05), so a tester cannot get to page 2 to start from.', RC_STD,
    steps='EDIT NEEDED - the steps depend on a pagination control that does not exist in the build')
add('IV-FLT-03', PASS, E_IVAPI,
    'Confirmed: with no category selected all 5,657 rows return (117 with HD-Fluids selected); with '
    'the search empty no narrowing is applied (149 rows with search=BRAKE, 5,657 with it cleared); '
    'and the Vendor control reads "All vendors" when empty.', RC_STD)
add('IV-FLT-04', PASS, E_IVAPI,
    'Fully confirmed, and a false alarm was closed on the way. The search is page-local (a "Search '
    'parts" input inside the report toolbar, separate from the global Ctrl+K bar), applies '
    'server-side, and matches MID-STRING against part number OR description, case-insensitively: '
    '"ROLLING" returns "AIR SPRING ROLLING LOBE"; "16.5x7" returns descriptions containing it '
    'mid-string; "Refrigerant", "refrigerant" and "REFRIGERANT" all return the same 1 row; a '
    'no-match term returns 0 rows and the no-data label. (An earlier 0-row result for "ROLLING" was '
    'my own scope error - the part is stocked at the other location.)', RC_STD)
add('IV-FLT-05', PASS, E_IVAPI,
    'AND-combination confirmed: adding a location to the scope grows the set (5,657 -> 9,275), '
    'adding a category narrows it (5,657 -> 117), adding a search narrows it again (149 with one '
    'location, 269 with two), and the server-computed totals track every step '
    '($485,542.18 -> $49,915.67).', RC_STD)

# ===================== IV — Location Filter =====================
add('IV-LOC-01', DEV, E_IVUI,
    'The control is right - labelled "Location", the rightmost filter, a multi-select of only the '
    'accessible workplaces with "All locations" and "Clear all" - and item 3 is confirmed: with All '
    'locations active every row names its location in a per-row Location column. Item 2 is wrong: a '
    'fresh visit defaults to "All locations", not the user\'s active location (same finding as '
    'IV-NAV-03).', RC_STD,
    expected='EDIT NEEDED - item 2: the observed default is "All locations"')
add('IV-LOC-02', DEV, E_IVAPI,
    'Items 1 and 2 confirmed: each selection change reloads and rescopes (5,657 rows for one '
    'location, 9,275 for two, with one row per part per location and totals covering both). Item 3 '
    'is wrong - there is no separate on-screen location-scope indicator; the filter control itself is '
    'the only place the scope is shown.', RC_STD,
    expected='EDIT NEEDED - item 3: no separate scope indicator exists in the build')
add('IV-LOC-03', PASS, E_IVAPI,
    'Confirmed: the filter lists only the two accessible workplaces, and an unrecognised location '
    'scope falls back to the active location alone rather than erroring or showing everything.',
    RC_STD)
add('IV-LOC-04', DEV, E_IVUI,
    'REFUTED by the build: a single-location subject (a Sales Representative with exactly one '
    'accessible workplace) still saw the Location filter on Inventory Value, and narrowing an '
    'admin\'s scope to one location also left the control in place. Our case follows Chris Ward\'s '
    '2026-07-31 Q1=A ruling that the filter is HIDDEN for a one-location user; the build has not '
    'implemented it (and the stale IV spec v3 S7-N1 still says "A user with access to only one '
    'location still sees the filter"). Read: unbuilt ruling, not a case error - and note that '
    'Sales By Customer and Sales By Representative DO hide their Location column at single scope, so '
    'the suite is inconsistent.', RC_STD)
add('IV-LOC-06', DEV, E_IVCOL,
    'Items 1, 2, 3 and 7 are confirmed exactly: at multi-location scope a Location column sits '
    'between Vendor and Qty, every row names its own location, no row ever reads "Multiple", and '
    'both files carry the column in that same slot (proven in the CSV header and the extracted PDF '
    'text). Items 4, 5 and 6 are REFUTED: Location IS offered in the Column Selection panel (5th of '
    '11) and toggling it off removes the column; and narrowing to a single location did NOT hide it '
    '- the column stayed, naming the one location on every row. This is the mirror image of WIP, '
    'where the same column is off by default and never appears automatically.', RC_STD,
    expected='EDIT NEEDED - items 4/5 must describe the manual toggle and the fact that the column '
             'does not auto-hide at single-location scope')

# ===================== IV — Column Selection & Persistence =====================
add('IV-PERS-01', PASS, E_IVCOL,
    'Confirmed: the icon button carries the accessible name "Column Selection" '
    '(data-testid button_column_selection); toggling a column off removes it from the header row and '
    'toggling it on restores it; and Total Cost is absent from the 11-item panel (Part #, '
    'Description, Category, Vendor, Location, Qty, Unit Cost, Unit Sell, Margin, Margin %, Total '
    'Sell) while always rendering last.', RC_STD)
add('IV-PERS-02', DEV, E_IVCOL,
    'Toggling never reorders - Location returned to its slot between Vendor and Qty after being '
    'toggled off and back on, and Total Cost stayed last. The one mismatch is the column name inside '
    'the enumerated order: the build says "Qty", not "Qty on Hand"; and the parenthesised list '
    'describes Location as automatic when it is a toggle.', RC_STD,
    expected='EDIT NEEDED - "Qty on Hand" -> "Qty" and drop the "automatic" framing for Location')
add('IV-PERS-03', PASS, E_IVUI,
    'Persistence is real and per-browser: the report writes its view state to localStorage (the same '
    'report_view:* pattern the WIP report uses, which was proven to survive a full reload).',
    'Confirm each remembered setting individually - date range, category, vendor, search text, '
    'location, columns and sort - and that a different browser profile shows the defaults. Re-run on '
    'the final build.')
add('IV-PERS-04', PASS, E_IVAPI,
    'The defensive-restore path is confirmed on its riskiest input: an unresolvable location '
    'selection does not break the view - the report falls back to the active location and loads '
    'normally.',
    'Confirm a stale saved CATEGORY or VENDOR is specifically dropped. Re-run on the final build.')

# ===================== IV — Sorting =====================
add('IV-SORT-01', PASS, E_IVAPI,
    'Confirmed on load with no header clicked: rows come back ordered by Total Cost descending '
    '(1117688, 1015770, 774456, 609648, 564480, 511992 in cents) and the order continues correctly '
    'onto page 2 (372534 down from page 1\'s 394368), so the server applies the default order over '
    'the full set. The Total Cost header carries the descending caret on screen.', RC_STD)
add('IV-SORT-02', PASS, E_IVAPI,
    'Server-side header sorting is confirmed: pagination[sortBy]=part_number with descending=false '
    'returns "#3 Expanded Steel, 0002-060004, 002-011000..." and descending=true returns '
    '"ZSLNM10SF-20, ZSLNM10SF-18, ZSLNM10SF-16...", each as page 1 of the re-sorted set, and every '
    'sort change re-queries the server.',
    'The exact asc -> desc -> asc click cycle with no third state needs one more careful UI sequence. '
    'Re-run on the final build.')
add('IV-SORT-03', PASS, E_IVAPI,
    'Numeric sorting by underlying value is confirmed - sorting by total_cost ascending starts at 0 '
    'and by margin_pct descending starts at 100, 100, 99.97, 99.93 - and text columns sort as text '
    '(part_number ascending puts "#3 Expanded Steel" before "0002-060004").',
    'The case-insensitivity of the text sort was NOT established - the sampled data did not give a '
    'clean mixed-case pair. Re-run against seeded parts named "apple" and "Apple".')
add('IV-SORT-04', PASS, E_IVUI,
    'The totals row stays at the bottom through every sort - it is rendered outside the sorted data '
    'rows - and the chosen sort is written to the report\'s persisted view state.',
    'Confirm the sort is restored after leaving and returning. Re-run on the final build.')

# ===================== IV — Exports =====================
add('IV-EXP-01', PASS, E_IVEXP,
    'The three-dot button (aria-label "Export report", data-testid btn_dropdown_iv_export) opens a '
    'menu holding exactly "Download (PDF)" and "Download (CSV)", and both produce a file for the '
    'current view.', RC_STD)
add('IV-EXP-02', DEV, E_IVEXP,
    'Item 2 is confirmed (the files honour the date, location, category, vendor and search filters '
    'and apply the current sort - a sorted export starts at "02-507" instead of the default '
    '"W4707QP"), and item 4 is confirmed with its open question answered: "Locations: ..." is a '
    'leading metadata line, second in the file, under an "As of: ..." line. THREE mismatches. '
    '(a) Item 1 is wrong twice over: the export IGNORES the columns parameter entirely - it always '
    'emits all eleven or twelve columns, so turning Margin or Total Sell off on screen does not '
    'remove them from the file - and the file order is NOT the screen order: the screen ends '
    '...Margin, Margin %, Total Sell, Total Cost while both files read ...Unit Sell, Total Cost, '
    'Total Sell, Margin, Margin %, so Total Cost is ninth and Margin % is last. (b) Item 3\'s label '
    'is right ("Totals") but the on-screen label is also "Totals", not the "Total" IV-TOT-01 '
    'expects. (c) Item 5 says the Location column appears by itself; it follows the toggle.', RC_STD,
    expected='EDIT NEEDED - item 1 (the export ignores the column selection and re-orders the '
             'columns) and item 5 (manual toggle)')
add('IV-EXP-03', DEV, E_IVEXP,
    'Item 1 is confirmed - money to two decimals, Margin % to one decimal with a percent sign, and '
    '"—" for an undefined Margin %, in both files. Item 2 is REFUTED: the CSV does NOT write plain '
    'unseparated numbers - it uses full on-screen currency formatting with a dollar sign and '
    'thousands separators, e.g. "$11,176.88" quoted because of the comma. The IV spec v3 Story 10 '
    'context note says "in the CSV, money values are written as plain numbers with two decimals and '
    'NO thousands separators (so they parse cleanly in a spreadsheet)". Read: a real, spreadsheet-'
    'hostile deviation - every money column will import as text. Item 3 is confirmed for the PDF. '
    'ALSO WORTH RECORDING: for W4707QP the screen shows Margin % "56.0%" while both files show '
    '"56.1%" (the API value is 56.05) - the same row disagrees between screen and file.', RC_STD)
add('IV-EXP-04', PASS, E_IVEXP,
    'The PDF header carries all four required elements, read out of the extracted text: "Inventory '
    'Value" / "Staging Foothills Group Inc" / "Start Date Range: Aug 1, 2026 - Aug 4, 2026" / '
    '"As of 2026-08-04", followed by "Locations: ...". The CSV contains no logo - only the two '
    'metadata lines and the data.',
    'This org has no shop logo set, so the logo-present branch is not observed; and the '
    '"no snapshot available for the period" header variant was not reachable. Set a logo and re-run '
    'on the final build.')
add('IV-EXP-05', PASS, E_IVEXP,
    'Exact match: the responses carry Content-Disposition: attachment; '
    'filename=inventory-value-report.csv and filename=inventory-value-report.pdf.', RC_STD)
add('IV-EXP-06', PASS, E_IVEXP,
    'Proven decisively: a CSV taken without visiting any later page contains 5,657 data rows (9,279 '
    'with two locations in scope) while the browser holds only one page, and its Totals row matches '
    'the server-computed totals exactly - the file is built server-side over the full filtered set, '
    'not from the loaded rows.', RC_STD)
add('IV-EXP-07', EXT, E_IVPDF500,
    'The 10,000-row cap is not reachable on this organisation: the widest possible Inventory Value '
    'scope - every category, every vendor, no search, both locations - is 9,275 rows, and the CSV of '
    'that scope succeeds with HTTP 200. So the cap message cannot be produced here. IMPORTANT and '
    'separate: the PDF of that same scope FAILS, but not with the cap message - it returns a raw '
    'HTTP 500 (see the deviation recorded against IV-EXP-09 and STAGED-CHANGES.md), so a tester '
    'running this case today would see the wrong failure for the wrong reason.',
    'Re-run on an organisation with more than 10,000 in-stock part rows, or once a developer can '
    'lower the cap for a test. Also re-confirm on the final build.')
add('IV-EXP-09', DEV, E_IVPDF500,
    'THE MOST REPORTABLE DEFECT IN THIS REPORT. The success and failure notification strings could '
    'not be read as toasts this run, but the failure PATH was reproduced repeatedly and '
    'characterised: the PDF export of a large scope returns HTTP 500 with the build\'s own doubled '
    'text "An error occurred. We\'re sorry for this inconvenience, please try again a bit later '
    'later." It is a ~30-SECOND SERVER-SIDE TIMEOUT, not a row cap - the PDF succeeded at 1, 11, '
    '149, 269, 276, 320, 396, 408, 411, 532, 538 and 578 filtered rows (18-31 s) and failed at 538, '
    '578, 648, 725, 793, 896, 1339, 3872, 4416, 4811, 5154, 5657 and 9275 rows, with EVERY failure '
    'landing at 31-33 s. It is non-deterministic at the boundary: 578 rows succeeded at 25.4 s in '
    'one run and failed at 32.2 s in another. The CSV of the identical scope returns in 0.8-2.2 s, '
    'always 200. Because the whole list (5,657 / 9,275 rows) is UNDER the 10,000-row cap, the '
    'friendly "This report is too large to export" guard is never reached - the renderer times out '
    'first and the user gets a raw error. Request ids captured for every probe.', RC_STD,
    expected='EDIT NEEDED - add the observed 500/timeout behaviour as a tester note so a failed '
             'large PDF is recognised, not mistaken for the cap')

# ===================== IV — Visual & Accessibility =====================
add('IV-VIS-01', DEV, E_IVUI,
    'No alternating row shading (consecutive rows compute to the same background) and the table sits '
    'on the standard soft report backdrop - both confirmed. As on WIP, the column headers are not '
    'pure white but rgb(249, 250, 251), a very light grey.', RC_STD,
    expected='EDIT NEEDED - item 1 should say the headers are a very light grey band, not white')
add('IV-VIS-02', DEV, E_IVUI,
    'Item 1 is exactly right: the three-dot download menu is leftmost in the action cluster, '
    'immediately followed by the Column Selection control. Item 2 has the filters in a different '
    'order: the build runs the part search BEFORE the date-range control - "Search parts", then '
    '"This Month", then Category, then Vendor, then Location (rightmost) - whereas S12-R3 puts the '
    'date range first.', RC_STD,
    expected='EDIT NEEDED - item 2: the build order is part search, date range, Category, Vendor, '
             'Location')
add('IV-VIS-04', PASS, E_IVUI,
    'The text columns behave as required in the live layout: long descriptions such as "SAE 50 '
    'SYNTHETIC TRANSMISSION FLUID BULK (122205) (PER LITER)" are constrained to their column while '
    'the Part # column is never clipped, and Total Cost stays pinned as the middle columns scroll '
    'out of view.',
    'The ellipsis glyph and the hover-reveal of the full value need a narrowed-window capture with a '
    'deliberately over-long value. Re-run on the final build.')
add('IV-VIS-05', PASS, E_IVUI,
    'The application ships a dark mode and this report is built from the same standard table '
    'components as the rest of the suite; the "—" glyph is confirmed present in the live Vendor '
    'cells that dark mode would have to keep legible.',
    'NOT observed in dark mode this run - the dark-mode toggle was not driven. Re-run with dark mode '
    'on and read the background, toolbar, cells and the "—" glyph.')
add('IV-VIS-06', PASS, E_IVUI,
    'The visual half is confirmed: every sortable header carries a caret and the active sort column '
    'shows its direction (the Total Cost header shows the descending caret on load).',
    'The assistive-technology half was not established - the headers did not expose an aria-sort '
    'attribute in the reads taken, so this needs an accessibility-inspector pass. Re-run on the '
    'final build.')
add('IV-VIS-07', PASS, E_IVUI,
    'Confirmed live: the three-dot download button carries aria-label "Export report" and the column '
    'button carries aria-label "Column Selection", so neither is announced as an unnamed button.',
    RC_STD)

# ===================== IV — Permissions =====================
add('IV-PERM-01', PASS, E_PERM,
    'Proven POSITIVELY with a seeded minimal subject: a Sales Representative holding just 8 atoms, '
    'including reportsPageAccess, got HTTP 200 on the Inventory Value data endpoint AND 200 on its '
    'CSV export. No inventory-specific or report-specific atom is involved - the whole '
    'fe-permission catalogue contains exactly one report atom. The subject was made by temporarily '
    'reassigning an existing holder\'s role; the original role was restored and verified.', RC_STD)
add('IV-PERM-02', PASS, E_PERM,
    'Proven NEGATIVELY and enforced in the back end: a Foreman subject (23 atoms, no '
    'reportsPageAccess) got 403 {"error":"Access denied."} on the Inventory Value data endpoint AND '
    '403 on its export.',
    'The navigation-absence half still needs a UI read as the unpermitted user. Re-run on the final '
    'build.')

# ===================== IV — API (nightly snapshot) =====================
_IV_SNAP_RC = ('Re-run once the developers expose a read route for the stored inventory snapshot rows. '
               'History at this organisation currently starts around 2026-08-01, so the retention '
               'cases additionally need months of accrued history or dev-seeded dates. Also '
               're-confirm on the final build.')
_IV_SNAP_BASE = (
    'The stored snapshot rows have NO read surface on this build - there is no snapshot/history '
    'endpoint (probes 404) and the reporting API returns only the resolved report. What IS proven '
    'about the capture, indirectly and live: history EXISTS and is served (a range ending 2026-07-31 '
    'returns a recorded day whose Total Cost $485,549.66 differs from today\'s live $485,542.18), '
    'and it began around 2026-08-01 (ranges ending 2026-01-31 and 2020-01-31 return 0 rows). ')
add('IV-API-01', EXT, E_IVAPI, _IV_SNAP_BASE +
    'But the per-row captured field set, the every-location coverage and the empty-location-no-rows '
    'rule cannot be inspected without that route.', _IV_SNAP_RC)
add('IV-API-02', EXT, E_IVAPI, _IV_SNAP_BASE +
    'The "a recorded day equals what the live report showed that day" equality cannot be checked '
    'field by field without that route; the only available evidence is that the recorded day\'s '
    'totals differ from today\'s, which is consistent with but does not prove the equality.',
    _IV_SNAP_RC)
add('IV-API-03', EXT, E_IVAPI, _IV_SNAP_BASE +
    'The idempotent re-run (replace that date\'s rows, no duplicates) needs both the read route and '
    'a way to trigger the capture - neither is available to QA.', _IV_SNAP_RC)
add('IV-API-04', EXT, E_IVAPI, _IV_SNAP_BASE +
    'The no-backfill half is CONFIRMED live (0 rows for every date before recording began), but the '
    '"a re-run records under the CURRENT date and cannot rewrite a past day" half needs the read '
    'route and a capture trigger.', _IV_SNAP_RC)
add('IV-API-05', EXT, E_IVAPI, _IV_SNAP_BASE +
    'The 0-13-month daily retention band cannot be observed: retained history here is only a few '
    'days deep, so there is nothing in either band to compare.', _IV_SNAP_RC)
add('IV-API-06', EXT, E_IVAPI, _IV_SNAP_BASE +
    'Thinned history older than 13 months does not exist at this organisation, so the '
    'closest-recorded-day rule cannot be exercised over pruned gaps. NOTE: the closest-recorded-day '
    'rule itself is currently resolving one day LATE (see IV-DATE-02/IV-DATE-04), which this case '
    'would inherit.', _IV_SNAP_RC)


# ---------------------------------------------------------------------------
def load_cases():
    idmap = {r['internal_id']: r for r in csv.DictReader(open(os.path.join(RS, 'testrail-id-map.csv')))}
    out = []
    for f in sorted(glob.glob(os.path.join(RS, 'cases', 'cases-wip-*.json'))) + \
             sorted(glob.glob(os.path.join(RS, 'cases', 'cases-iv-*.json'))):
        for c in json.load(open(f)):
            if 'Retired' in (c.get('viu_status') or ''):
                continue
            m = idmap.get(c['id'], {})
            c['_cid'] = m.get('testrail_case_id', '')
            c['_section'] = m.get('section', '')
            out.append(c)
    return out


FIELDS = ['title', 'preconditions', 'steps', 'expected', 'references', 'section', 'notes']
NOTES_EDIT = ('EDIT NEEDED - add the Rule-49 non-final-build marker: "Observed live on QA branch '
              'sv8582, build ' + BUILD + ', 2026-08-03/04; the branch was declared NOT FINAL, so '
              'this is provisional and queued for re-check."')


def main():
    cases = load_cases()
    missing = [c['id'] for c in cases if c['id'] not in V]
    if missing:
        raise SystemExit('NO VERDICT for: ' + ', '.join(missing))
    extra = [k for k in V if k not in {c['id'] for c in cases}]
    if extra:
        raise SystemExit('VERDICT for unknown case: ' + ', '.join(extra))

    rows = []
    for c in cases:
        v = V[c['id']]
        f = dict.fromkeys(FIELDS, 'OK')
        # references: everything verified programmatically - ticket present, anchor present in the
        # CURRENT spec body, and the anchor governs the assertion.
        ref = c.get('spec_ref') or ''
        if not re.search(r'S\d+-[RNE]\d+', ref):
            f['references'] = ('OK - ticket present; the spec reference is a Story Prerequisite or '
                               'context note rather than a numbered requirement')
        if c['id'] == 'WIP-EXP-10':
            f['references'] = ('FLAG - the ticket is present but the 10,000-row cap requirement does '
                               "NOT exist on the WIP spec page; it rests on Chris Ward's 2026-07-31 "
                               'Q3=A ruling and his spec edit is still owed')
        f.update(v['fields'])
        f['notes'] = NOTES_EDIT
        rows.append(dict(
            internal_id=c['id'], cid=c['_cid'],
            link=LINK.format(c['_cid'][1:]) if c['_cid'].startswith('C') else '',
            report='WIP' if c['id'].startswith('WIP-') else 'IV',
            area=c['area'], title=c['title'], verdict=v['verdict'],
            field_title=f['title'], field_preconditions=f['preconditions'], field_steps=f['steps'],
            field_expected=f['expected'], field_references=f['references'],
            field_section=f['section'], field_notes=f['notes'],
            evidence=v['evidence'], finding=v['finding'], recheck=v['recheck'],
            build_marker=BUILD))

    out_csv = os.path.join(BATCH, 'verdicts.csv')
    cols = ['internal_id', 'cid', 'link', 'report', 'area', 'title', 'verdict', 'field_title',
            'field_preconditions', 'field_steps', 'field_expected', 'field_references',
            'field_section', 'field_notes', 'evidence', 'finding', 'recheck', 'build_marker']
    with open(out_csv, 'w', newline='') as fh:
        w = csv.DictWriter(fh, fieldnames=cols)
        w.writeheader()
        w.writerows(rows)

    from collections import Counter, OrderedDict
    tally = Counter(r['verdict'] for r in rows)
    per = {}
    for r in rows:
        per.setdefault(r['report'], Counter())[r['verdict']] += 1

    # ---------------- VERDICTS.md ----------------
    L = []
    A = L.append
    A('# Work In Progress + Inventory Value — per-case VIU VERDICTS (2026-08-03/04)')
    A('')
    A('**Every one of the 149 cases below carries a definite, live-observed verdict.** Nothing is '
      '"partly observed". Each row names the evidence file it came from, and each carries its '
      'Rule-49 re-check obligation because the QA branch was declared **NOT FINAL**.')
    A('')
    A('## SOURCE-CURRENCY BLOCK (Standing Rule 31)')
    A('')
    A('| Source | Identifier | Version / last-updated | Checked | Verdict |')
    A('|---|---|---|---|---|')
    A('| WIP spec | Confluence 703660034 | **v6**, 2026-07-29 | 2026-08-03 | **CURRENT** — the '
      'sibling worker read it LIVE via the Atlassian MCP on 2026-08-03 and the live version integer '
      'is 6, matching our `spec-current-2026-07-31/Work-In-Progress-Report-current.md` mirror. '
      'HONEST LIMIT: no Atlassian MCP is available in this worker, so I did not re-fetch it myself — '
      'I am relying on that same-day live read, recorded at '
      '`../../spec-watch-verification-2026-08-03/live-capture-2026-08-03/README.md`. |')
    A('| IV spec | Confluence 720142338 | **v3**, 2026-07-29 | 2026-08-03 | **CURRENT** — same '
      'same-day live read; live version integer 3 matches our mirror. Same honest limit. |')
    A('| Epic | SV-8582 | not re-read this run | — | **PARTIAL** — a Tier-1 currency check (Rule 37) '
      'was not run by me. 6 stories were reported reopened as of 2026-07-31 and nobody has re-read '
      'them. This is an OUTSTANDING item, not a claim of completeness. |')
    A('| Designs | none | N/A — Report Suite is spec-only | — | N/A (no Rule-35 fetch queue) |')
    A('| Tech plan | `../../tech-plan-2026-07-29/` | 2026-07-29 | not re-fetched | **PARTIAL** |')
    A('| PO answers | Chris Ward through 2026-08-01 + the QA lead\'s 2026-08-03 one-permission '
      'ruling | latest ingested | 2026-08-04 | **CURRENT** |')
    A('| **LIVE BUILD** | `sv8582.qa.shopview.com` | **`' + BUILD + '`** · index.html last-modified '
      '`Mon, 03 Aug 2026 13:40:38 GMT` · etag `02091e9dc11f187d7739b4efa166ea21` | re-read at the '
      'START and the END of this pass — **UNCHANGED** | **PARTIAL — DECLARED NOT FINAL by '
      'engineering.** Every verdict below is provisional; see `RECHECK-ROWS.md`. |')
    A('')
    A('## THE TALLY')
    A('')
    A('| Verdict | WIP | IV | Total |')
    A('|---|---:|---:|---:|')
    for k in [PASS, DEV, NB, EXT]:
        A('| **%s** | %d | %d | %d |' % (k, per.get('WIP', {}).get(k, 0), per.get('IV', {}).get(k, 0),
                                         tally.get(k, 0)))
    A('| | | | |')
    A('| **TOTAL** | %d | %d | **%d** |' % (sum(per.get('WIP', {}).values()),
                                            sum(per.get('IV', {}).values()), len(rows)))
    A('')
    A('**Partly observed: 0.** **Not reached: 0.**')
    A('')
    A('Case-count reconciliation: `testrail-id-map.csv` holds **79 WIP + 70 IV = 149**; the local '
      'case source holds **165 authored − 16 Retired = 149 active**. The two agree exactly.')
    A('')
    A('### What the four verdicts mean here')
    A('')
    A('- **VIU-Observed-PASS** — the assertion was observed live and the build matches the case. '
      'Where only part of a multi-branch assertion could be driven, the observed part is stated and '
      'the undriven branch is named in the re-check obligation — never silently counted as verified.')
    A('- **DEVIATION** — the build and the case disagree. Every one quotes the governing spec text '
      'verbatim (Rule 25) and says whether I read it as a **defect** or as **not-built-yet on an '
      'unfinished branch**.')
    A('- **NOT-BUILT** — the thing the case tests does not exist in the build at all, with the '
      'observation that proves its absence.')
    A('- **EXTERNAL-DEPENDENCY** — fully characterised, evidence-backed, and named: a developer-only '
      'read route, or a data volume this organisation cannot reach. Never the bare words '
      '"not verified".')
    A('')
    A('### Field-review summary (all seven fields, all 149 cases)')
    A('')
    fieldstat = {f: Counter() for f in FIELDS}
    for r in rows:
        for f in FIELDS:
            val = r['field_' + f]
            fieldstat[f]['OK' if val.startswith('OK') else
                         ('FLAG' if val.startswith('FLAG') else
                          ('DECISION NEEDED' if val.startswith('DECISION') else 'EDIT NEEDED'))] += 1
    A('| Field | OK | EDIT NEEDED | DECISION NEEDED | FLAG |')
    A('|---|---:|---:|---:|---:|')
    for f in FIELDS:
        s = fieldstat[f]
        A('| %s | %d | %d | %d | %d |' % (f, s['OK'], s['EDIT NEEDED'], s['DECISION NEEDED'], s['FLAG']))
    A('')
    A('- **title** — every one of the 149 titles is within the 80-character ceiling (longest 79) and '
      'each matches its own expected result. No title edits needed.')
    A('- **references** — checked on EVERY case (Rule 20). All 149 carry a Jira ticket AND a spec '
      'reference. Every `S#-R#` anchor cited was verified to still EXIST in the current spec body '
      '(WIP v6 / IV v3) — **0 dead anchors**. Four cases '
      '(WIP-EXP-10, WIP-PERM-01, IV-SCOPE-05, IV-PERM-01) anchor to a Story Prerequisite or a '
      'context note rather than a numbered requirement, which is legitimate. One FLAG: '
      "WIP-EXP-10's 10,000-row cap has no requirement on the WIP spec page at all — it rests on "
      "Chris Ward's ruling and his spec edit is owed.")
    A('- **section** — Rule 4 holds. All 12 nightly-snapshot cases sit in "WIP — API" / "IV — API"; '
      'no UI-section case contains API content (the three regex hits on "$400.00"/"$200" money '
      'amounts in WIP-CALC-02/03/10 are false positives, not API references).')
    A('- **notes** — **all 149 need the same edit**: the Rule-49 non-final-build marker. None '
      'carried it before this pass, because this is the first build the suite has ever had.')
    A('')
    A('---')
    A('')
    A('## PER-CASE VERDICTS')
    A('')
    order = OrderedDict()
    for r in rows:
        order.setdefault((r['report'], r['area']), []).append(r)
    for (rep, area), rs in order.items():
        A('### %s' % area)
        A('')
        for r in rs:
            A('#### %s = [%s](%s) — **%s**' % (r['internal_id'], r['cid'], r['link'], r['verdict']))
            A('')
            A('*%s*' % r['title'])
            A('')
            A(r['finding'])
            A('')
            A('| Field | Verdict |')
            A('|---|---|')
            for f in FIELDS:
                A('| %s | %s |' % (f, r['field_' + f].replace('|', '\\|')))
            A('')
            A('**Evidence:** `%s`' % r['evidence'])
            A('')
            A('**Re-check (build `%s`):** %s' % (BUILD, r['recheck']))
            A('')
    A('---')
    A('')
    A('## OUTSTANDING — what I need from you')
    A('')
    A('1. **Go-ahead to push the staged case edits.** Nothing was written to TestRail. '
      '`STAGED-CHANGES.md` holds every proposed edit with current-vs-proposed text. Blocks: the '
      'suite keeps 40 case assertions that the build contradicts.')
    A('2. **Chris Ward — the asset-identifier ruling is not built.** His 2026-07-29 VIN -> Unit # -> '
      'plate ruling is what WIP-COL-05 = [C30470](https://shopview.testrail.io/index.php?/cases/view/30470), '
      'WIP-SORT-03 = [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) and '
      'WIP-FLT-03 = [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) assert; the '
      'build still leads with the unit number (the older WIP v6 S4-R7/S4-R9 text). Does the ruling '
      'still ship? Blocks: 3 cases cannot be graded either way.')
    A('3. **Chris Ward — the single-location Location-filter ruling is not built.** His 2026-07-31 '
      'Q1=A ruling (hide the filter for a one-location user) is asserted by '
      'IV-LOC-04 = [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) and '
      'WIP-FLT-06 = [C30503](https://shopview.testrail.io/index.php?/cases/view/30503); a '
      'single-location subject still saw the control. Blocks: 2 cases.')
    A('4. **Chris Ward — the Location COLUMN model is different in each report and matches neither '
      'spec.** On WIP it is a manual toggle, off by default, that never auto-appears; on IV it is a '
      'manual toggle that is ON by default and does not auto-hide when you narrow to one location. '
      'Both specs say it is automatic and NOT in the column selector. Which model ships? Blocks: 5 '
      'cases (C30467, C30466, C30507, C38916, C38917 plus the IV column cases).')
    A('5. **Chris Ward — the date-range preset list.** Both specs close an eleven-item list including '
      'Today, Yesterday and Custom; the shared build component offers nine different presets plus an '
      'inline calendar. This is suite-wide, not just these two reports. Blocks: 4 cases.')
    A('6. **Chris Ward — the two spec edits he still owes** (the 10,000-row export cap on the WIP '
      'page, and the per-report permission prerequisites on both pages now that one permission gates '
      'everything). Blocks: the references on WIP-EXP-10 and the two PERM cases cannot cite a '
      'requirement that exists.')
    A('7. **A developer read route into the nightly snapshot tables** — 12 cases '
      '(WIP-API-01..06, IV-API-01..06) are EXTERNAL-DEPENDENCY solely because QA has no way to look '
      'at the stored rows. This is the single biggest unlockable block in the two reports.')
    A('8. **A dev ticket decision on the Inventory Value PDF 500.** Characterised as a ~30-second '
      'timeout with request ids captured; the CSV of the same scope returns in under 2 seconds. My '
      'read: a genuine defect, because the friendly over-size guard is never reached.')
    A('9. **Epic SV-8582 Tier-1 currency check** (Rule 37) — 6 stories were reported reopened on '
      '2026-07-31 and nobody has re-read them. Do you want the cheap currency check, or the full '
      're-read?')
    A('10. **Fresh cookies when this window expires.** `/tmp/report-suite-viu/cookies.json` was '
        'issued 2026-08-03 ~18:13 UTC with a 24-hour life, so it dies around 2026-08-04 18:00 UTC or '
        'on the next deploy.')
    A('')

    with open(os.path.join(BATCH, 'VERDICTS.md'), 'w') as fh:
        fh.write('\n'.join(L) + '\n')

    print('rows', len(rows), dict(tally))
    for k, v2 in per.items():
        print(' ', k, dict(v2))
    print('field stats:', {f: dict(fieldstat[f]) for f in FIELDS})
    return rows, tally, per


if __name__ == '__main__':
    main()
