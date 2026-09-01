#!/usr/bin/env python3
"""The Defects-for-Testers workbook (skill 04 section 6.1) for both suites being handed over.

Layout per the skill: a TAB PER VERDICT STATUS plus a Summary tab. One row per case that did NOT
pass, with the C-id and its TestRail link (Rule 8), what the DOCUMENT requires with its anchor and
version, what the BUILD actually does as observed with the evidence reference, the verdict, the
Rule-91 freshness badge, and - never omitted - a plain "What needs to be done" a non-technical QA can
act on. A bare DEVIATION or Blocked with no next step is what leaves a finding sitting for a week.

Numbers and rows are GENERATED from each suite's verdicts.py, never transcribed (G7).
"""
import sys, json, os, collections
import openpyxl
from openpyxl.styles import Font, Alignment, PatternFill

ROOT = '/home/user/Manual-test-Cases'
BUILD = 'v26.35.6-598cc8a'
BADGE = f'GREEN - checked 1 Sep 2026 on build {BUILD} (0 days old)'
link = lambda i: f'https://shopview.testrail.io/index.php?/cases/view/{i}'

def load(path, cases_json):
    sys.path.insert(0, path)
    import importlib, verdicts
    importlib.reload(verdicts)
    cases = {c['id']: c for c in json.load(open(cases_json))}
    v = dict(verdicts.V)
    sys.path.remove(path)
    del sys.modules['verdicts']
    return v, cases

SUITES = [
 ('Inline Add and Edit Parts',
  f'{ROOT}/build/inline-add-edit-parts/build-verify-2026-09-01/verdicts',
  '/tmp/inl6597/cases6597.json',
  'Inline Add and Edit Parts on Work Order Lines specification version 16'),
 ('Printer Friendly Work Orders',
  f'{ROOT}/build/printer-friendly-wo/build-verify-2026-09-01/verdicts',
  '/tmp/pf6617/cases6617.json',
  'Printer Friendly Work Orders specification version 8'),
]

# the plain next step, per case. Written for a non-technical reader, and never left blank.
NEXT = {
 45068: 'RUN IT AND EXPECT IT TO FAIL. Type a part into the inline row without saving, then click the '
        'pencil on another part on the same line. The "Discard this part?" question should appear '
        'first; it does not - the Edit Part Request window opens straight away and your typed part is '
        'left behind it. Mark the case FAILED and add nothing else; the ticket for it is already '
        'written and waiting on the QA lead.',
 44993: 'RUN THE PART YOU CAN. Open a work order whose status is Paid and check the Add Part button is '
        'not there - that part is confirmed working. The other four statuses the case names (Complete, '
        'Invoiced, Declined, Imported) do not exist on this test system, so SKIP those and mark the '
        'case Blocked with the note "no work order in that status exists here".',
 44994: 'Same as the case above, for the pencil (Edit) control instead of the Add Part button.',
 44996: 'DO NOT RUN IT YET. Nobody knows yet what makes a work order un-editable other than its '
        'status, so there is no way to set the situation up. It is waiting on an answer from the '
        'product owner. Leave it Untested.',
 45034: 'DO NOT RUN IT YET. It needs a second person to change the same part while your edit row is '
        'open. If you can get a colleague to do that at the same time, run it; otherwise leave it '
        'Untested and tell the QA lead.',
 45060: 'DO NOT RUN IT YET. It needs a part that has no cost and no sell price recorded at all. Every '
        'part on this test system has at least 0.00 in those boxes, which is not the same as empty. '
        'Waiting on an answer from the product owner.',
 45239: 'DO NOT RUN IT YET. It needs a part that is not kept in any bin. Every part on this test system '
        'is in at least one bin. Waiting on an answer from the product owner.',
 45220: 'NOT YOURS TO RUN OR CHANGE - this case belongs to Vladimir Tomovic and it has no steps '
        'written in it. Leave it alone entirely.',
 45088: 'RUN THE THREE YOU CAN. The Print option is confirmed present on Estimate, Approved and Paid '
        'work orders. The other seven statuses the case names do not exist on this test system - skip '
        'those and mark the case Blocked with the note "only three of the ten statuses exist here".',
 45107: 'DO NOT RUN IT. It cannot be done: on a work order with no lines the Print option is greyed '
        'out, so you can never see the printout it describes. The written description contradicts '
        'itself here and the product owner has to settle it. Leave it Untested.',
 45116: 'DO NOT RUN IT - same reason as the case above. You cannot print a work order that has no '
        'lines, so there is no summary to look at.',
 45090: 'DO NOT RUN IT YET. It needs an account that cannot open work orders at all. Ask the QA lead '
        'to set one up, or leave it Untested.',
 45097: 'DO NOT RUN IT YET. It needs a work order with no customer on it, and every work order on this '
        'test system has one.',
 45098: 'DO NOT RUN IT YET. It needs a work order with no vehicle on it, and every work order on this '
        'test system has one.',
 45104: 'DO NOT RUN IT YET. It needs a line whose status is Cancelled, and none of the work orders '
        'checked had one. If you can set a line to Cancelled yourself, do that and then run it.',
 45111: 'DO NOT RUN IT YET. It needs a tech story at least 500 characters long - roughly a full '
        'paragraph. If you can paste that much text into a line\'s tech story, do that and then run it.',
 45123: 'RUN IT NORMALLY - the behaviour is correct. One thing to expect: the history row is called '
        '"Work order printed history", not "Work Order Printed" as the case says. That difference is '
        'already reported, so do NOT raise it again; pass the case on the behaviour.',
}
FLAVOUR = {'FAIL': 'DEVIATION', 'PARTIAL': 'PARTLY BLOCKED', 'UNREACHABLE': 'CANNOT BE RUN',
           'NOTVER': 'BLOCKED - DATA MISSING', None: 'NOT CHECKED YET', 'FOREIGN': 'NOT OURS'}
HEAD = ['C-ID', 'TestRail link', 'Suite', 'Case title', 'What the document requires',
        'What the build actually does (observed)', 'Verdict', 'Freshness', 'What needs to be done']

rows_by_status = collections.defaultdict(list)
summary = []
for suite, vdir, cjson, specref in SUITES:
    V, cases = load(vdir, cjson)
    c = collections.Counter(v[0] for v in V.values())
    summary.append((suite, len(V), c))
    for cid, (verdict, ev, note) in sorted(V.items()):
        if verdict == 'PASS':
            continue
        flav = FLAVOUR.get(verdict, str(verdict))
        rows_by_status[flav].append([
            f'C{cid}', link(cid), suite, cases[cid]['title'],
            f'{specref} - see the case\'s own provenance line for the exact section',
            note or 'not exercised by this pass',
            flav, BADGE,
            NEXT.get(cid, 'ASK THE QA LEAD before running this one - no instruction has been written '
                          'for it, which is itself something to report.'),
        ])
    # C45123 is a PASS but carries an instruction, so it rides along on its own tab
    if suite.startswith('Printer') and 45123 in V:
        rows_by_status['PASS - BUT READ THE NOTE'].append([
            'C45123', link(45123), suite, cases[45123]['title'],
            f'{specref}, section S6-R1', V[45123][2], 'PASS with a wording difference', BADGE, NEXT[45123]])

wb = openpyxl.Workbook(); wb.remove(wb.active)
ws = wb.create_sheet('Summary')
ws['A1'] = 'WHAT DID NOT PASS - both suites, checked 1 September 2026'
ws['A1'].font = Font(bold=True, size=13)
ws['A2'] = (f'Build checked: {BUILD} on https://sv9315.qa.shopview.com. Everything not listed on the '
            'other tabs PASSED. A case on this list is not necessarily broken - most of them just need '
            'something that does not exist on the test system yet, and each row says exactly what to do.')
ws['A2'].alignment = Alignment(wrap_text=True, vertical='top')
ws.append([]); ws.append(['Suite', 'Cases', 'Passed', 'Needs attention', 'Breakdown'])
for c_ in range(1, 6): ws.cell(row=4, column=c_).font = Font(bold=True)
for suite, n, c in summary:
    ws.append([suite, n, c.get('PASS', 0), n - c.get('PASS', 0),
               ', '.join(f'{FLAVOUR.get(k, k)}: {v}' for k, v in c.items() if k != 'PASS')])
ws.append([])
ws.append(['Tab', 'Rows', 'What it means'])
ws.cell(row=ws.max_row, column=1).font = Font(bold=True)
ws.cell(row=ws.max_row, column=2).font = Font(bold=True)
ws.cell(row=ws.max_row, column=3).font = Font(bold=True)
MEANING = {
 'DEVIATION': 'The build genuinely does the wrong thing. Run it, expect it to fail, mark it FAILED.',
 'PARTLY BLOCKED': 'Part of the case can be run today and part cannot. Run the part you can.',
 'CANNOT BE RUN': 'The situation the case describes cannot be created at all. Leave it Untested.',
 'BLOCKED - DATA MISSING': 'The case is fine but the test system has nothing to run it against yet.',
 'NOT CHECKED YET': 'We did not get to it. Leave it Untested unless the row says otherwise.',
 'NOT OURS': 'Somebody else owns this case. Do not run or change it.',
 'PASS - BUT READ THE NOTE': 'It passes, but something on screen differs from the wording in the case.',
}
for k, v in rows_by_status.items():
    ws.append([k, len(v), MEANING.get(k, '')])
for col, w in zip('ABCDE', (36, 10, 10, 18, 62)): ws.column_dimensions[col].width = w
for row in ws.iter_rows(min_row=2):
    for cell in row: cell.alignment = Alignment(wrap_text=True, vertical='top')

for status, rows in rows_by_status.items():
    t = wb.create_sheet(status[:31])
    t.append(HEAD)
    for i in range(1, len(HEAD) + 1):
        t.cell(row=1, column=i).font = Font(bold=True)
        t.cell(row=1, column=i).fill = PatternFill('solid', fgColor='DDDDDD')
    for r in rows: t.append(r)
    for col, w in zip('ABCDEFGHI', (10, 46, 26, 52, 44, 62, 22, 40, 78)):
        t.column_dimensions[col].width = w
    for row in t.iter_rows(min_row=2):
        for cell in row: cell.alignment = Alignment(wrap_text=True, vertical='top')
    t.freeze_panes = 'A2'

out = f'{ROOT}/build/handoff-2026-09-01/Inline-Add-and-Edit-Parts_and_Printer-Friendly-Work-Orders_Defects-for-Testers_2026-09-01.xlsx'
wb.save(out)
print('written', out)
for k, v in rows_by_status.items(): print(f'  tab {k}: {len(v)} rows')
missing = [r[0] for rows in rows_by_status.values() for r in rows if 'ASK THE QA LEAD before running' in r[8]]
print('rows with no written next step:', missing or 'none')
