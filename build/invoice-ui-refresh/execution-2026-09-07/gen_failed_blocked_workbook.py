#!/usr/bin/env python3
"""Invoice UI Refresh — the Failed and Blocked cases, with their tickets and how to unblock.

Two tabs as asked for on 2026-09-08: FAILED and BLOCKED, each pairing the test case with its
ticket and that ticket's LIVE status. The Blocked tab additionally says, in plain words, whether
the case is still worth keeping, what has to happen before it can be run, and who can do it.

Case titles are read LIVE from TestRail (never a snapshot - the 2026-09-01 KeyError lesson).
Ticket statuses are passed in from a LIVE Jira query, never transcribed from memory.
"""
import sys, json, datetime
sys.path.insert(0, 'build/testing-tools')
import tr_client as t
import openpyxl
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side

OUT = ('build/invoice-ui-refresh/execution-2026-09-07/'
       'Invoice-UI-Refresh_Failed-and-Blocked-Cases_2026-09-08.xlsx')
BUILD = 'v26.35.9-9812433'
RUN = 417
tixlink = lambda k: f'https://shopview.atlassian.net/browse/{k}'

# The link the QA lead wants is the case's entry IN THE RUN - the recorded result, its comment
# and its history - not the case definition. That is /tests/view/<test_id>, and the test_id is
# read LIVE from the run because it is per-run and cannot be derived from the C-id.
TESTID = {}
def runlink(cid):
    return f'https://shopview.testrail.io/index.php?/tests/view/{TESTID[cid]}'

# --- LIVE Jira statuses, read 2026-09-08 (passed in, not remembered)
TIX = {
 'SV-9642': ('QA Complete',   'Work Order chip hidden when the WO number does not match the document number'),
 'SV-9680': ('Code Review',   'Asset band prints Mileage 0 and Eng Hrs 0 for an asset with no recorded values'),
 'SV-9710': ('Open',          'IBS approval cannot be requested on QA - Approval Code chip unverifiable'),
 'SV-9761': ('TESTING STAGE', 'Staging PDF embeds DejaVu Sans instead of Inter'),
 'SV-9773': ('QA Complete',   "Line footer ignores the line's own fee, so Line total is less than what is charged"),
 'SV-9781': ('Board Backlog', 'Production PDF server still uses the old font image, so Inter will not show after release'),
 'SV-9790': ('Open',          'Credit note prints no disclaimer unless it came from an invoice'),
 'SV-9804': ('OBSOLETE',      'A shop logo cannot be removed, so the no-logo masthead rule cannot be tested'),
 'SV-9805': ('OBSOLETE',      'Masthead identity fields are all mandatory, so the hide-when-empty rule cannot be tested'),
 'SV-9803': ('OBSOLETE',      'Paid banner omits the "Remaining Balance" row'),
}

FAILED = [
 (44917, 'SV-9642',
  'The Work Order number is left off the document when it does not match the document number. It '
  'should always be shown.',
  'Nothing for you to do yet. The fix has moved to QA Complete SINCE this test was run on 7 September, '
  'so it was still failing on the build tested. RE-RUN this case on the next staging build - if it '
  'passes, mark it Passed and the ticket can close.'),
 (44926, 'SV-9680',
  'An asset with no mileage and no engine-hours reading still prints "Mileage 0" and "Eng Hrs 0". '
  'Those rows should be hidden when the asset has no reading.',
  'Nothing for you to do. The fix is in Code Review and had not reached the tested build. Re-run this '
  'case once it ships.'),
 (44935, 'SV-9773',
  "A fee added to a single work line is left out of that line's own total, so the printed Line total "
  'is LESS than the customer is actually charged. The fee is still added further down in the Summary, '
  'so the same page disagrees with itself.',
  'Nothing for you to do yet. The ticket has moved to QA Complete SINCE this test was run, so it was '
  'still failing on the build tested. RE-RUN this case on the next staging build. This is the highest '
  'risk item found - it is a money figure on a customer-facing document.'),
 (44970, 'SV-9790',
  'A credit note created on its own prints no disclaimer text at the bottom. One created from an '
  'invoice does print it. Both should.',
  'Nothing for you to do. The ticket is Open and waiting on development. Re-run this case once it '
  'ships.'),
 (44974, 'SV-9761',
  'The printed documents use the wrong typeface. Every PDF checked embeds DejaVu Sans, not the Inter '
  'font the design asks for.',
  'Nothing for you to do here, but note the second ticket: SV-9781 records that the LIVE PDF server '
  'still has the old font too, so this will still be wrong after release unless that is also done.'),
]

BLOCKED = [
 (44902, 'SV-9804', 'KEEP - half of it already passes',
  'The first half of the case passes: when a shop logo is set, it prints. The second half asks you to '
  'check that NOTHING shows when a shop has no logo - and that situation cannot be created. A logo '
  'belongs to the whole organisation, not to one shop location, and the only control is a small pencil '
  'over the picture which opens a file chooser. You can replace a logo. You cannot remove one.',
  'A decision from you, then a few minutes of work. Pick ONE of these three:\n'
  '(A) A shop SHOULD be able to remove its logo. Then this is a missing feature - raise a story for '
  'it, and this case becomes runnable once it ships.\n'
  '(B) The "no logo" situation only happens for a brand-new organisation that never uploaded one. '
  'Then ask whoever administers staging to create a fresh test organisation and NOT upload a logo. '
  'Send me its name and I will run the case the same day. THIS IS THE QUICKEST ROUTE.\n'
  '(C) The rule is not a real requirement. Then the second half of the case should be deleted and the '
  'case becomes a straight Pass.',
  'YOU (or whoever administers staging, for option B). I cannot unblock this myself - I checked the '
  'screen, the settings page and the back end, and there is genuinely no way to remove a logo.',
  'Option B, step by step:\n'
  '1. Ask the staging administrator to create a new test organisation.\n'
  '2. Tell them explicitly: do NOT upload a shop logo to it.\n'
  '3. Send me the organisation name.\n'
  '4. I sign in, raise a work order there, open its document and confirm the masthead shows the shop '
  'details with no logo and no empty grey box.\n'
  '5. I mark the case Passed or Failed and tell you the same day.'),

 (44907, 'SV-9805', 'KEEP - half of it already passes',
  'The first half passes: shop details that have a value do print. The second half asks you to check '
  'that a MISSING detail is hidden and leaves no blank line - and that cannot be created either. All '
  'five shop identity fields (name, address, city and province, postcode, phone) are compulsory on the '
  'location form; it will not save with one left empty.',
  'A decision from you. Pick ONE:\n'
  '(A) The rule exists to protect against older records saved before those fields became compulsory. '
  'Then find me one such location, or have one seeded, and I can run it.\n'
  '(B) The rule is only a safety net and can never be reached through the screen. Then reword the case '
  'to say so, and it stops being counted as blocked.\n'
  '(C) One or more of those fields should not be compulsory. Then that is a change to the product and '
  'needs a story.',
  'YOU. I cannot create the state - the form refuses to save, so there is no route through the '
  'application at all.',
  'Option A, step by step:\n'
  '1. Ask whether any shop location exists whose phone or postcode is blank (older records may have '
  'them).\n'
  '2. If one exists, send me the location name.\n'
  '3. I raise a work order at that location, open its document and check the missing detail is simply '
  'absent, with no gap left behind.\n'
  '4. I report Passed or Failed the same day.\n'
  'If no such location exists anywhere, the honest answer is option B.'),

 (44916, 'SV-9710', 'KEEP - the case is good, only the environment is short',
  'The case is fine. It checks that an approval code from the integrated billing service prints on the '
  'invoice. The problem is that this environment cannot request one of those approvals, so no approval '
  'code ever exists to print. Integrated billing IS switched on for the organisation - the remit-to '
  'payee and customer accounts are configured - but the approval request itself cannot be made here.',
  'Someone with access to the integrated billing service needs to do ONE of these:\n'
  '(A) Enable approval requests on this environment, or\n'
  '(B) Seed a single work order that already carries a real approval code, and send me its number.\n'
  'Option B is far quicker and is enough for the test.',
  'YOU, or whoever owns the integrated billing integration. The existing ticket SV-9710 is Open and '
  'assigned to Milomir Kotlajic. I cannot do this myself - it needs the billing service, not the app.',
  '1. Add a comment to SV-9710 asking: can a work order with a stored approval code be seeded on '
  'staging?\n'
  '2. When it exists, send me the work order number.\n'
  '3. I open it, click Finance, and check the document shows a field labelled exactly "Approval Code" '
  'carrying that code, and that the code no longer appears under the "Authorized By" area.\n'
  '4. I report the same day.'),

 (45275, None, 'CANNOT SAY - the case is empty',
  'This case has a title and a precondition but NO steps and NO expected result recorded in TestRail. '
  'There is literally nothing written down to check, so it cannot be passed or failed by anybody. It '
  'was created by Vladimir Tomovic, and we never change his cases.',
  'Vladimir needs to either finish the case or retire it. Nothing else will unblock it.',
  'VLADIMIR TOMOVIC, or you on his behalf. I am not permitted to edit his cases under any '
  'circumstances, so this one can only be cleared by him.',
  '1. Ask Vladimir whether this case is still wanted.\n'
  '2. If YES - he fills in the Steps and the Expected Result, and tells me. I run it the same day.\n'
  '3. If NO - he retires or deletes it, and it drops out of the suite count of 120.\n'
  '4. Either way, tell me which, so the run stops showing a blocked case nobody is working on.'),
]

# ---- live case titles
ids = [c[0] for c in FAILED] + [c[0] for c in BLOCKED]
TITLES = {}
for cid in ids:
    s, c = t.get('get_case/%d' % cid)
    if s != 200:
        sys.exit('get_case/%d failed: %s' % (cid, c))
    TITLES[cid] = c['title']

# ---- live test ids for this run (paged; a test_id belongs to the run, not the case)
_tests, _off = [], 0
while True:
    s, r = t.get('get_tests/%d&limit=250&offset=%d' % (RUN, _off))
    if s != 200:
        sys.exit('get_tests/%d failed: %s' % (RUN, r))
    _tests += r['tests']
    if r.get('_links', {}).get('next'):
        _off += 250
    else:
        break
TESTID.update({x['case_id']: x['id'] for x in _tests})
missing = [c for c in ids if c not in TESTID]
if missing:
    sys.exit('these cases have no test in run %d: %s' % (RUN, missing))

HDR = PatternFill('solid', fgColor='1F3864')
HDRF = Font(bold=True, color='FFFFFF', size=11)
WRAP = Alignment(vertical='top', wrap_text=True)
TOP = Alignment(vertical='top')
THIN = Border(*[Side(style='thin', color='D0D0D0')] * 4)
RED = PatternFill('solid', fgColor='FCE4E4')
AMB = PatternFill('solid', fgColor='FFF2CC')
GRN = PatternFill('solid', fgColor='E2EFDA')
GREY = PatternFill('solid', fgColor='EFEFEF')

STATUS_FILL = {'OBSOLETE': GREY, 'Open': RED, 'Board Backlog': RED,
               'Code Review': AMB, 'TESTING STAGE': AMB, 'QA Complete': GRN}

wb = openpyxl.Workbook()

# ================= Summary =================
ws = wb.active; ws.title = 'Summary'
rows = [
 ('Invoice UI Refresh - Failed and Blocked test cases', ''),
 ('', ''),
 ('Test run', f'R{RUN} - Invoice UI Refresh, Full Suite'),
 ('Run link', f'https://shopview.testrail.io/index.php?/runs/view/{RUN}'),
 ('Environment', 'staging (app.staging.shopview.com)'),
 ('Build tested', BUILD),
 ('Date tested', '7 September 2026'),
 ('Ticket statuses read', '8 September 2026, live from Jira'),
 ('Last updated', '8 September 2026 - C44952 re-scored Passed after the spec was amended'),
 ('', ''),
 ('Cases in the suite', '120'),
 ('Passed', '111'),
 ('Failed', '5   - see the Failed tab'),
 ('Blocked', '4   - see the Blocked tab'),
 ('Untested', '0'),
 ('', ''),
 ('Read this first',
  'FAILED means the build does not do what the documents require. Every one of these already has a '
  'ticket, so there is nothing for you to raise.'),
 ('',
  'BLOCKED means the case could not be run at all. Three of the four are still worth keeping - they '
  'need a decision or a piece of test data from you, and each row says exactly what and who. The '
  'fourth is an empty case that only its author can fix.'),
 ('',
  'Two tickets - SV-9642 and SV-9773 - moved to QA Complete AFTER this run. Both cases were still '
  'failing on the build tested, so both need re-running on the next staging build.'),
 ('',
  'C44952 was Failed on 7 September and is now PASSED. It failed only on a "Remaining Balance" row '
  'that the specification asked for. Chris Ward established that row has never existed in production '
  'and amended S8-R9 (spec v64, SV-9803). The clause is gone from the case; the build never changed.'),
]
for r, (a, b) in enumerate(rows, 1):
    ws.cell(r, 1, a).font = Font(bold=(r == 1 or (a and not b)), size=14 if r == 1 else 11)
    ws.cell(r, 2, b).alignment = WRAP
ws.column_dimensions['A'].width = 26
ws.column_dimensions['B'].width = 105

# ================= Failed =================
ws = wb.create_sheet('Failed')
cols = ['Test case', 'Case title', 'Result in test run R417', 'Ticket', 'Ticket status', 'Ticket link',
        'What is wrong (plain words)', 'What needs to be done']
widths = [11, 48, 52, 11, 15, 46, 62, 62]
for i, (c, w) in enumerate(zip(cols, widths), 1):
    cell = ws.cell(1, i, c); cell.fill = HDR; cell.font = HDRF; cell.alignment = WRAP
    ws.column_dimensions[cell.column_letter].width = w
for r, (cid, tix, what, todo) in enumerate(FAILED, 2):
    st, summ = TIX.get(tix, ('NO TICKET', ''))
    ws.cell(r, 1, f'C{cid}')
    ws.cell(r, 2, TITLES[cid])
    ws.cell(r, 3, runlink(cid))
    ws.cell(r, 4, tix or 'none')
    sc = ws.cell(r, 5, st if tix else 'NO OPEN TICKET')
    sc.fill = STATUS_FILL.get(st, RED); sc.font = Font(bold=True)
    ws.cell(r, 6, tixlink(tix) if tix else '')
    ws.cell(r, 7, what)
    ws.cell(r, 8, todo)
    for c in range(1, 9):
        ws.cell(r, c).alignment = WRAP; ws.cell(r, c).border = THIN
    ws.row_dimensions[r].height = 118
# SV-9781 is a second ticket on the same case - call it out rather than hide it
r = len(FAILED) + 3
ws.cell(r, 1, 'Also on C44974:').font = Font(bold=True)
ws.cell(r, 4, 'SV-9781')
c = ws.cell(r, 5, TIX['SV-9781'][0]); c.fill = RED; c.font = Font(bold=True)
ws.cell(r, 6, tixlink('SV-9781'))
ws.cell(r, 7, 'The LIVE PDF server still carries the old font image, so the wrong typeface will '
              'still be there after release even once staging is fixed.').alignment = WRAP
ws.row_dimensions[r].height = 44
ws.freeze_panes = 'A2'
ws.auto_filter.ref = f'A1:H{len(FAILED) + 1}'

# ================= Blocked =================
ws = wb.create_sheet('Blocked')
cols = ['Test case', 'Case title', 'Result in test run R417', 'Is the case still good?',
        'Why it could not be run (plain words)', 'Ticket', 'Ticket status', 'Ticket link',
        'What has to happen to unblock it', 'Who can unblock it', 'Steps to follow']
widths = [11, 46, 52, 26, 70, 11, 15, 46, 66, 40, 70]
for i, (c, w) in enumerate(zip(cols, widths), 1):
    cell = ws.cell(1, i, c); cell.fill = HDR; cell.font = HDRF; cell.alignment = WRAP
    ws.column_dimensions[cell.column_letter].width = w
for r, (cid, tix, keep, why, unblock, who, steps) in enumerate(BLOCKED, 2):
    st, summ = TIX.get(tix, ('NO TICKET', ''))
    ws.cell(r, 1, f'C{cid}')
    ws.cell(r, 2, TITLES[cid])
    ws.cell(r, 3, runlink(cid))
    kc = ws.cell(r, 4, keep); kc.font = Font(bold=True)
    kc.fill = GRN if keep.startswith('KEEP') else AMB
    ws.cell(r, 5, why)
    ws.cell(r, 6, tix or 'none')
    sc = ws.cell(r, 7, st if tix else 'NO TICKET')
    sc.fill = STATUS_FILL.get(st, GREY); sc.font = Font(bold=True)
    ws.cell(r, 8, tixlink(tix) if tix else '')
    ws.cell(r, 9, unblock)
    ws.cell(r, 10, who)
    ws.cell(r, 11, steps)
    for c in range(1, 12):
        ws.cell(r, c).alignment = WRAP; ws.cell(r, c).border = THIN
    ws.row_dimensions[r].height = 250
ws.freeze_panes = 'A2'

r = len(BLOCKED) + 3
ws.cell(r, 1, 'NOTE on the two OBSOLETE tickets').font = Font(bold=True)
ws.cell(r, 5, 'SV-9804 and SV-9805 were raised for C44902 and C44907 and you closed them as OBSOLETE '
              'on 7 September. The cases are still blocked. Closing the tickets did not make the '
              'situations testable - it means no ticket is tracking them, so the decisions in this '
              'sheet are the only route.').alignment = WRAP
ws.row_dimensions[r].height = 62

wb.save(OUT)
print('wrote', OUT)
print('Failed rows:', len(FAILED), '| Blocked rows:', len(BLOCKED))
for cid in ids:
    print('  C%d  %s' % (cid, TITLES[cid]))
