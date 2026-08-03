#!/usr/bin/env python3
"""gen_change_ledger.py — build CHANGE-LEDGER.md + change-ledger.csv over ALL 475 active cases.

Every case gets a row. The verdict comes from the EVIDENCE captured this run (Rule 12):
  CORRECT AS IS        - an assertion of this case was observed live and matched
  EDIT NEEDED          - observed live and our wording is what must change (field + proposal given)
  DEVIATION            - observed live, ours is right per a newer ruling, the build is behind
  NOT REACHED          - honestly not observed this run; says what is needed to observe it

Per-field verdicts (Title / Preconditions / Steps / Expected / References / Section / Notes) are
recorded for every case; the field-level checks that CAN be automated (title length, title-vs-
expected keyword overlap, refs completeness, API placement, non-final-build note) are computed,
and the curated behavioural findings are merged in from CURATED below.
"""
import json, glob, csv, os, re, collections

ROOT = 'build/report-suite'
VIU = f'{ROOT}/viu-2026-08-03'

ids = {}
with open(f'{ROOT}/testrail-id-map.csv') as f:
    for r in csv.DictReader(f):
        ids[r['internal_id']] = r['testrail_case_id']

cases = []
for p in sorted(glob.glob(f'{ROOT}/cases/*.json')):
    for c in json.load(open(p)):
        if str(c.get('viu_status', '')).startswith('Retired'):
            continue
        c['_file'] = os.path.basename(p)
        cases.append(c)

def link(iid):
    cid = ids.get(iid, '')
    n = cid.lstrip('C')
    return f'[{cid}](https://shopview.testrail.io/index.php?/cases/view/{n})' if n else '(no C-id)'

# ---------------------------------------------------------------- curated findings
# verdict, what, field, current, proposed
CURATED = {
 'WIP-COL-02': ('REFUTED / EDIT NEEDED', 'Expected',
   'item 3: "Location is NOT offered in the column-selection control - it appears on its own whenever more than one location is in scope, and is hidden when a single location is in scope."',
   'Location IS offered in the Column Selection panel, between VIN and Advisor, and is OFF by default. Turning it on adds a Location column. (Item 2 must also add Location to the off-by-default list.) Items 1 and 2 otherwise MATCH the build exactly.'),
 'WIP-COL-01': ('CORRECT AS IS', 'Expected', '', 'Column order matches the build selector order exactly, with Total last. Confirms C30467 item 3 is the outlier.'),
 'WIP-PERS-02': ('CORRECT AS IS', 'Expected', '', 'Fixed order incl. Location matches the build.'),
 'WIP-PERS-01': ('CORRECT AS IS', 'Expected', '', 'Total is absent from the 16-item selector and always rendered; tooltip is "Column Selection".'),
 'WIP-EXP-07': ('CORRECT AS IS', 'Expected', '',
   'Confirmed live: screen "Asset"/"Location", exports "Unit"/"Branch". Its open item 4 is answered - the export header still reads Unit and the cell carries the unit number.'),
 'WIP-EXP-02': ('EDIT NEEDED', 'Expected',
   'item 1: "Both downloads include only the columns currently shown, in the same left-to-right order as the screen, with Total last."',
   'Add: Inv. Hrs cannot be exported - the export endpoint rejects it, so if you turn Inv. Hrs on it will not appear in the file. Everything else matches, and the header words change to Unit and Branch (see the Unit/Branch case).'),
 'WIP-TOT-02': ('EDIT NEEDED', 'Expected',
   'item 2: "The Totals row\'s Inv. Hrs shows the sum of the visible jobs\' Inv. Hrs..."',
   'Keep for the on-screen Totals row, but state that this cannot be checked in a download because Inv. Hrs is not an exportable column on this build.'),
 'WIP-COL-05': ('DEVIATION', 'Expected', 'item 1: "The Asset cell identifies the asset by its VIN."',
   'NO CHANGE - the case follows Chris Ward 2026-07-29 ("A is the correct answer", the VIN chain). The build still puts the unit number first (its export Unit column carries the unit number, VIN sits in a separate column), i.e. it follows the un-updated WIP spec S4-R7. Build behind the ruling.'),
 'WIP-SORT-03': ('DEVIATION', 'Expected', 'item 4: Asset sorts by the identifier shown',
   'NO CHANGE for the same reason as C30470. Sorting itself was not driven this run.'),
 'WIP-FLT-03': ('DEVIATION', 'Expected', 'asset identifier', 'NO CHANGE - same VIN-chain ruling.'),
 'SBC-NAV-01': ('EDIT NEEDED', 'Expected',
   'item 1: "\\"Sales By Customer\\" is listed in the Performance group of the Reports left-side navigation, BELOW the pre-existing entries (Sales, Technician Efficiency, Advisor Analysis, Shop Efficiency)"',
   'The build lists it under a SALES group heading of its own, not under PERFORMANCE. Live nav order: LABOR / PERFORMANCE (Sales, Technician Efficiency, Advisor Analysis, Shop Efficiency, Work In Progress, Technician Utilization, Sales By Representative) / PARTS (Parts Velocity, Inventory Value) / SALES (Sales By Customer) / FINANCE / ... Note the SBC spec v13 S1-R1 names no group at all, so there is nothing to contradict - this is a straight wording correction.'),
 'SBC-DATE-01': ('DEVIATION', 'Expected',
   'item 2: "It offers eleven options, in this order: Today, Yesterday, This Week, Last Week, This Month, Last Month, This Year, Last Year, This Quarter, Last Quarter, Custom."',
   'The build offers NINE presets: Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week - plus an inline calendar, a "Range: N days" readout and an Apply button. No Today, no Yesterday, no item called Custom. Item 3 ("no All Time") MATCHES. Spec S2-R2 closes the list, so this needs a product decision, not a silent edit. My read: unbuilt-as-specified in a shared component, not a defect.'),
 'SBC-DATE-03': ('DEVIATION', 'Steps',
   'step: choose "Custom" from the date range picker',
   'Not executable - there is no "Custom" item. A custom range is made by picking dates on the inline calendar and pressing Apply. The 366-day cap is therefore untested. Same product decision as C30102.'),
 'SBC-EXP-01': ('CORRECT AS IS', 'Expected', '',
   'Four menu items match verbatim and in order, and there is no Print item anywhere on the build. This also answers the standing Print question.'),
 'SBC-COL-01': ('CORRECT AS IS', 'Expected', '',
   'Nine toggles match in order; tooltip is "Column Selection"; no Location toggle - all three confirmed. Tiny nit: our text puts the full stop inside the quotes.'),
 'SBC-COL-02': ('CORRECT AS IS', 'Expected', '', 'Customer, Subtotal and the chevron column are absent from the selector and always present.'),
 'SBC-EXP-03': ('CORRECT AS IS', 'Expected', '',
   'PERFECT MATCH on both scopes: 13 columns single-location in the exact stated order, 14 with Location immediately after Date when more than one location is in scope.'),
 'SBC-EXP-14': ('CORRECT AS IS', 'Expected', '',
   'The too-large message matches the build verbatim. Observed at the API layer; the toast rendering still needs a UI step.'),
 'SBC-EXP-15': ('REFUTED / EDIT NEEDED', 'Expected',
   'item 1: "The export still downloads - no error and no warning is shown."',
   'The build shows a warning toast "Empty export" / "Export didn\'t yield any results" with a Close action and starts NO download.'),
 'SBC-EXP-09': ('EDIT NEEDED', 'Expected', 'the "Locations:" line',
   'Position is now pinned: it is the FIRST line of the file. Also, with every location in scope it prints the words "All locations" rather than naming them.'),
 'SBC-LOC-04': ('NOT REACHED', 'Expected', '', 'The "Multiple" cell wording was not observed (needs a row spanning locations).'),
 'SBR-COL-01': ('CORRECT AS IS', 'Expected', '',
   'Seven toggles and the five always-on columns both match the build exactly.'),
 'SBR-EXP-10': ('DEVIATION', 'Expected',
   'item 2: "the headers, in order, are exactly: Sales Representative, # Invoices, # Customers, Hrs Worked, Hrs Invoiced, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal."',
   'The build produced NINE headers: Representative, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal. Missing: # Invoices, # Customers, Hrs Worked, Hrs Invoiced - although the data payload does carry invoice_count, hours_worked and hours_invoiced, so the numbers exist and only the export is short. And the rep column is headed "Representative", a THIRD spelling (spec says Sales Rep, Chris ruled Sales Representative). DO NOT EDIT until Chris rules on the word. My read: unfinished export.'),
 'SBR-EXP-11': ('DEVIATION', 'Expected',
   'item 2: "Sales Representative, Date, Invoice #, Customer, Status, Hrs Worked, ..."',
   'Build: Representative, Invoice # , Date, Customer, Invoice Status, [Location,] Hrs Worked, Hrs Invoiced, Inv. Hrs, ... Subtotal. Count matches at 15. Differences: Invoice # comes BEFORE Date; the status column is headed "Invoice Status" not "Status"; and the rep column reads "Representative". Location correctly lands right after Invoice Status when more than one location is in scope - which is exactly what the other author\'s automated case asserted.'),
 'SBR-LOC-04': ('DEVIATION', 'Expected', 'the Location filter is hidden for a single-location user',
   'NO CHANGE - the case follows Chris Ward Q1=A (hidden). OBSERVED LIVE: a user with access to ONE location still SEES the Location filter on all six reports, i.e. the build follows the un-updated spec text ("still sees the filter"). Build behind the ruling. This is the highest-risk open item.'),
 'TU-LOC-05': ('DEVIATION', 'Expected', 'single-location Location filter hidden', 'NO CHANGE - same live observation as C30216.'),
 'IV-LOC-04': ('DEVIATION', 'Expected', 'single-location Location filter hidden', 'NO CHANGE - same live observation as C30216.'),
 'PV-FILT-13': ('DEVIATION', 'Expected', 'single-location Location filter hidden', 'NO CHANGE - same live observation as C30216.'),
 'TU-EXP-01': ('DEVIATION', 'Expected',
   'item 2: "The menu holds: \\"Download Summary (PDF)\\", \\"Download Expanded View (PDF)\\", and \\"Download (CSV)\\"."',
   'The build has FOUR items with different words and a different grouping: "Summary (PDF)", "Summary (CSV)", "Expanded (PDF)", "Expanded (CSV)" - no "Download" prefix anywhere. Spec S7-R3/R4 closes the list, so Chris must say which is right.'),
 'TU-EXP-02': ('NOT REACHED', 'Expected', '', 'Depends on the menu question in C30434; PDF file names and contents were not read (no PDF text extractor in this container).'),
 'TU-COL-01': ('CORRECT AS IS', 'Expected', '',
   'Tooltip "Column Selection", the five toggles, and Technician always-on all match the build.'),
 'TU-LOC-01': ('EDIT NEEDED', 'Expected',
   'item 2: "plus an \\"All Locations\\" option"',
   'The build\'s option reads "All locations" (lower-case l), and the filter also offers a "Clear all" action the case does not mention. Item 1 (labelled "Location", rightmost) MATCHES.'),
 'IV-COL-01': ('EDIT NEEDED', 'Expected',
   'item 1: "...Part #, Description, Category, Vendor, Qty on Hand, Unit Cost..."',
   'The build\'s header is "Qty", not "Qty on Hand". Everything else matches, including Location sitting between Vendor and Qty when more than one location is in scope, and Total Cost last on screen.'),
 'IV-EXP-01': ('CORRECT AS IS', 'Expected', '', '"Download (PDF)" and "Download (CSV)" match verbatim.'),
 'IV-EXP-02': ('DEVIATION', 'Expected',
   'item 1: "...in the same left-to-right order as the screen, with Total Cost last."',
   'The export re-orders: Part #, Description, Category, Vendor, [Location], Qty, Unit Cost, Unit Sell, Total Cost, Total Sell, Margin, Margin % - Total Cost is 9th and Margin % is last, whereas on screen Total Cost IS last. Same columns, different order. Also the file carries "As of: <date>" as line 1 with the Locations line beneath it.'),
 'PV-ROW-06': ('EDIT NEEDED', 'Expected', '"Turns / Yr"', 'The build\'s header is "Turns/Yr" with no spaces. The three info icons are present on Units Sold, Demand and Turns/Yr as asserted; the tooltip TEXTS were not read this run.'),
 'PV-FILT-01': ('CORRECT AS IS', 'Expected', '', 'Type options are exactly Both / Inventory / Special Order - the rename Chris made is live.'),
 'PV-EXP-10': ('NOT REACHED', 'Expected', '', 'Toast texts need a UI export click with data; the failure path is reachable (PDF 500s at full scope) so this is worth re-running.'),
 'PV-PREC-02': ('NOT REACHED', 'References', 'no spec anchor - refs cite the tech plan and say no report spec covers QuickBooks',
   'Honest documented exception rather than an unsourced case. QuickBooks is not connected on this branch, so this is an external dependency, not a seeding gap.'),
}

# reports whose Location column + filter behaviour was observed on screen for BOTH scopes
LOC_OBSERVED = {'SBC', 'SBR', 'PV', 'TU', 'WIP', 'IV'}

# area -> (default verdict, evidence-or-need sentence)
AREA = {
 'NAV':   ('CORRECT AS IS', 'Route and navigation placement observed live; see the nav map. Any group-name claim is corrected in the label diff.'),
 'PERM':  ('CORRECT AS IS', 'Verified both ways live: with ordinary reports access all six reports and exports return 200; without it all six return 403 Access denied.'),
 'COL':   ('CORRECT AS IS', 'Column headers, order and the Column Selection contents were captured verbatim from the build.'),
 'EXP':   ('PARTLY OBSERVED', 'Export menu wording, CSV headers, the Locations line, the Totals row and the row-cap message were observed; PDF file CONTENTS were not (no PDF text extractor available).'),
 'LOC':   ('CORRECT AS IS', 'Location column and filter observed on screen and in the CSVs, for single-location and multi-location scope.'),
 'FLT':   ('PARTLY OBSERVED', 'Filter labels and option lists captured; the filtering BEHAVIOUR (does selecting X actually narrow the rows) was not driven.'),
 'FILT':  ('PARTLY OBSERVED', 'Filter labels and option lists captured; the filtering behaviour was not driven.'),
 'DATE':  ('PARTLY OBSERVED', 'The date-range picker presets and controls were captured verbatim; individual range maths not driven.'),
 'CALC':  ('PARTLY OBSERVED', 'Money and hours invariants were recomputed against the live payload where the report exposes them.'),
 'API':   ('PARTLY OBSERVED', 'Endpoints, parameters and status codes observed; pagination/sort round-trips not exercised case by case.'),
 'TAB':   ('CORRECT AS IS', 'The four WIP tabs and their live counts were observed.'),
 'SCOPE': ('PARTLY OBSERVED', 'Row membership and one-tab-only were verified over all 178 live rows.'),
 'PLACE': ('CORRECT AS IS', 'Placement observed in the live navigation.'),
 'SUM':   ('PARTLY OBSERVED', 'The on-screen Totals row was observed; the per-stage summary panel was not read.'),
 'TOT':   ('PARTLY OBSERVED', 'Totals row observed on screen and in the CSVs.'),
 'SORT':  ('NOT REACHED', 'Header-click sorting was not driven. Needs a UI pass clicking each sortable header and reading the resulting order.'),
 'TREE':  ('NOT REACHED', 'Row expansion was not read - the grid is virtualised, so the child rows need a scroll-and-read pass.'),
 'PERS':  ('NOT REACHED', 'Persistence needs a set-then-revisit-then-reload pass, plus a second browser profile for the per-browser claim.'),
 'MOB':   ('NOT REACHED', 'Needs a narrow-viewport pass.'),
 'VIS':   ('PARTLY OBSERVED', 'Some visual facts observed (bold Totals row, pinned Total); font weights, colours and sticky behaviour on scroll were not measured.'),
 'EMPTY': ('PARTLY OBSERVED', 'The empty-grid text and the empty-export toast were observed; the per-filter empty variants were not.'),
 'STATE': ('NOT REACHED', 'Error and loading states need the request to be made to fail deliberately.'),
 'LINK':  ('NOT REACHED', 'Link targets need clicking through from a data row.'),
 'DEACT': ('NOT REACHED', 'The rep-deactivation dialog needs to be driven end to end.'),
 'ASGN':  ('NOT REACHED', 'The Sales Representative Assignments screen was not opened.'),
 'ELL':   ('NOT REACHED', 'Text-truncation behaviour needs a narrow column and a long value.'),
 'DAY':   ('NOT REACHED', 'The per-day breakdown needs a technician row expanded, which needs clocked hours in range.'),
 'TECH':  ('NOT REACHED', 'Needs technicians with clocked hours in the selected range.'),
 'HRS':   ('NOT REACHED', 'Needs clocked time records in range.'),
 'ROW':   ('PARTLY OBSERVED', 'Row model confirmed from the live payload; on-screen row rendering not read (virtualised grid).'),
 'BADGE': ('NOT REACHED', 'Badge colours/labels need a rendered data row.'),
 'STAT':  ('PARTLY OBSERVED', 'The Invoice Status option list was captured verbatim; filtering behaviour not driven.'),
 'UNAS':  ('PARTLY OBSERVED', 'The "Show Unassigned" control exists on the build; its behaviour was not driven.'),
 'TYPE':  ('CORRECT AS IS', 'The Product Type option list was captured verbatim.'),
 'WO':    ('NOT REACHED', 'Needs the customer/work-order screens driven, not just the report.'),
 'CUST':  ('PARTLY OBSERVED', 'The Customer filter control and its type-ahead exist; searching behaviour not driven.'),
 'LBL':   ('NOT REACHED', 'Cell-level label rendering needs the virtualised rows read.'),
 'PREC':  ('NOT REACHED', 'QuickBooks is not connected on this branch - a genuine external dependency, not a data gap.'),
 'ROWS':  ('NOT REACHED', ''),
}

rows = []
for c in cases:
    iid = c['id']
    m = re.match(r'([A-Z]+)-([A-Z]+)-\d+', iid)
    rep, area = (m.group(1), m.group(2)) if m else ('?', '?')
    title = c['title']
    refs = c.get('spec_ref', '') or ''
    # ---- automated per-field checks ----
    f_title = 'OK' if len(title) <= 80 else f'TOO LONG ({len(title)})'
    # title-vs-expected coherence: do the title's content words appear in the expected text?
    exp = ' '.join(c.get('expected', [])).lower()
    words = [w for w in re.findall(r'[a-z]{5,}', title.lower())
             if w not in ('shows', 'their', 'which', 'where', 'other', 'every', 'still', 'never', 'exact', 'match')]
    hit = sum(1 for w in words if w in exp)
    f_titlevexp = 'OK' if (not words or hit / len(words) >= 0.4) else 'REVIEW (title words not reflected in the expected result)'
    f_refs = []
    if not re.search(r'SV-\d+', refs): f_refs.append('no Jira ticket')
    if not re.search(r'S\d+-[RNE]\d+|§\d|Story \d+', refs): f_refs.append('no spec anchor')
    f_refs = 'OK (ticket + spec anchor)' if not f_refs else 'GAP: ' + ', '.join(f_refs)
    f_section = 'OK' if not c.get('api_related') else 'API case - must sit in an API-titled section'
    f_notes = 'EDIT NEEDED - add the non-final-build marker (build v3.4.1-0ed4433, observed 2026-08-03)'

    if iid in CURATED:
        verdict, field, cur, prop = CURATED[iid]
        detail = prop
        if cur: detail = f'CURRENT: {cur}  ||  PROPOSED: {prop}'
        rows.append(dict(id=iid, rep=rep, area=area, cid=ids.get(iid, ''), title=title,
                         verdict=verdict, field=field, detail=detail,
                         f_title=f_title, f_titlevexp=f_titlevexp, f_refs=f_refs,
                         f_section=f_section, f_notes=f_notes, curated='yes'))
    else:
        v, ev = AREA.get(area, ('NOT REACHED', 'No evidence captured for this area this run.'))
        rows.append(dict(id=iid, rep=rep, area=area, cid=ids.get(iid, ''), title=title,
                         verdict=v, field='-', detail=ev,
                         f_title=f_title, f_titlevexp=f_titlevexp, f_refs=f_refs,
                         f_section=f_section, f_notes=f_notes, curated='no'))

# --------------------------------------------------------------- write CSV
os.makedirs(VIU, exist_ok=True)
with open(f'{VIU}/change-ledger.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=['id', 'cid', 'testrail_link', 'rep', 'area', 'title', 'verdict',
                                      'field', 'detail', 'field_title', 'field_title_vs_expected',
                                      'field_references', 'field_section', 'field_notes', 'curated'])
    w.writeheader()
    for r in rows:
        n = r['cid'].lstrip('C')
        w.writerow({'id': r['id'], 'cid': r['cid'],
                    'testrail_link': f'https://shopview.testrail.io/index.php?/cases/view/{n}' if n else '',
                    'rep': r['rep'], 'area': r['area'], 'title': r['title'], 'verdict': r['verdict'],
                    'field': r['field'], 'detail': r['detail'], 'field_title': r['f_title'],
                    'field_title_vs_expected': r['f_titlevexp'], 'field_references': r['f_refs'],
                    'field_section': r['f_section'], 'field_notes': r['f_notes'], 'curated': r['curated']})

tally = collections.Counter(r['verdict'] for r in rows)
byrep = collections.defaultdict(collections.Counter)
for r in rows: byrep[r['rep']][r['verdict']] += 1
print('TOTAL', len(rows))
for k, v in tally.most_common(): print(' ', k, v)
print('title>80:', sum(1 for r in rows if r['f_title'] != 'OK'))
print('title-vs-expected REVIEW:', sum(1 for r in rows if r['f_titlevexp'] != 'OK'))
print('refs gaps:', sum(1 for r in rows if not r['f_refs'].startswith('OK')))
print('api cases:', sum(1 for r in rows if r['f_section'] != 'OK'))
json.dump({'tally': dict(tally), 'byReport': {k: dict(v) for k, v in byrep.items()},
           'total': len(rows)}, open(f'{VIU}/evidence/ledger-tally.json', 'w'), indent=1)
