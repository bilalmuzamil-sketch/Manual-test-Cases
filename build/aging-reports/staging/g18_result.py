"""g18_result.py - 14 Nov 2026, run 557, staging v26.45.4-f3d3d2d, QA lead's session, browser Asia/Karachi, 1440 px. New tests batch 2:
C1145247 (A/R Customer menu) Failed on SV-12722 (Ready to Fix) - the full list squeezes a long no-space name into a one-line row (ZZBREAK... over 10 Trucking);
customer A is not in the first 50 names the menu loads, found only by search, where it wraps inside a taller row.
C1145248 (A/P Vendor menu) Failed, ticket HELD with the QA lead - vendor A's name cut off at the top and drawn over the next row (same component as SV-12722, which names the Customer menu only).
C1145250 / C1145252 / C1145254 / C1145260 Passed. C1145253 (A/R Collection) Failed on SV-12764 (Open) exactly as the test describes.
Measurements s16b/out.json (menus rerun 14 Nov with search + exact-name match), s19/s20 (customer menu loads 50 names; search lets the row grow)."""
import json, re, html, sys
sys.path.insert(0, '/home/user/Manual-test-Cases/build/aging-reports/exec')
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/staging/'
def P(cid, path, t, b): src = path if path.startswith('/') else PP + path; dst = PP + 'pics/%s-%s' % (cid, src.split('/')[-1]); ann(src, dst, t, [], [], b); return dst
B = json.load(open(PP + 's16b/out.json')); S20 = json.load(open(PP + 's20/out.json'))
D = json.load(open(PP + '../new-tests-1114-full.json'))
def SRC(cid):
    e = html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', D[cid[1:]]['custom_expected']))); i = e.find('From: PRD'); j = e.find('Last checked'); k = e.find('Partly checked'); j = min(x for x in (j, k, len(e)) if x > 0)
    return e[i:j].strip()
RUN = 'Test run 557: https://shopview.testrail.io/index.php?/runs/view/557'
SET = 'Set up: staging (build v26.45.4-f3d3d2d), Admin, 1440 px wide, 100%% zoom, browser on Pakistan time; %s.'
N120 = 'ZZAUTOTEST' + 'Abcdefghij' * 11
R = {}
# C1145247
q = B['C1145247']; zb = S20['zzbreak']; assert zb['cutAtTop'] and zb['overNextRow'] and zb['overNextBox'] and zb['count'] == 51
assert q['A']['exact'] and not q['A']['overNextRow'] and q['A']['box'][3] == 80 and 'Abcde...' in q['chip3'] and '2 customers' in q['chip4'] and not q['B']['overNextRow']
R['C1145247'] = {'verdict': 'Failed', 'failed_steps': 'Failed at step 2: in the Customer menu list a long name with no spaces is squeezed into a one-line row - cut off at the top and drawn over the next customer and its tick box.', 'bold_steps': [2],
  'source': SRC('C1145247'), 'ticket': 'Follow the status here https://shopview.atlassian.net/browse/SV-12722 (Ready to Fix, read 14 Nov 2026) - the known problem this test names.',
  'todo': 'What needs to be done: nothing for the tester now; re-run this test on staging when SV-12722 reaches Ready for QA.',
  'observed': [SET % 'A/R Aging Summary, customer A = the 120-letter no-space customer, customer B = the long name with & " \' < >',
    'Step 2: the menu loads only the first 50 customers, so customer A cannot be reached by scrolling; in that list the long no-space customer "ZZBREAK ... Superlongunbrokencustomername..." wraps onto 4 lines inside a 1-line row: the first line is cut off at the top and the last line is drawn over "10 Trucking" and its tick box.',
    'Step 2: customer A, found by typing in the menu\'s search box, wraps onto 3 lines inside a taller row and stays clear of the row under it - the overlap shows in the full list, where rows keep one line\'s height.',
    'This is the known problem the test names (SV-12722, https://shopview.atlassian.net/browse/SV-12722, Ready to Fix), so nothing new is raised.', RUN],
  'pictures': [P('C1145247', q['pic1'], 'Step 2: the Customer menu list - the long no-space name is cut off at the top and drawn over "10 Trucking" and its tick box', [(490, 295, 335, 82, 'bad', 'Name cut off and drawn over the next row')]),
               P('C1145247', q['pic2'], 'Step 2: customer A found by search - its row grows to 3 lines (only in a short search list)', [(482, 315, 352, 80, 'good', 'Customer A inside its row'), (482, 395, 352, 40, 'good', 'Next row readable')])]}
# C1145248
q = B['C1145248']; a = q['A']; assert a['exact'] and a['cutAtTop'] and a['overNextRow'] and a['box'][3] == 40 and a['lines'] == 3
R['C1145248'] = {'verdict': 'Failed', 'failed_steps': 'Failed at step 2: vendor A\'s name is cut off at the top of its row and drawn over the row under it.', 'bold_steps': [2],
  'source': SRC('C1145248'), 'ticket_held': True,
  'ticket': 'No ticket yet - the decision is with the QA lead: the same fault is reported for the Customer menu in SV-12722 (Ready to Fix), which does not name the Vendor menu.',
  'todo': 'What needs to be done: nothing for the tester now; the QA lead decides whether this joins SV-12722 or gets its own ticket.',
  'observed': [SET % 'A/P Aging Detail, vendor A = the 120-letter no-space vendor',
    'Step 2: vendor A\'s name wraps onto %d lines in a row only one line high: the first line is cut off at the top (drawn over the 78-letter vendor above it) and the last line is drawn over the next vendor, "%s"; that row\'s tick box stays clear.' % (a['lines'], a['nextText']),
    'The Customer menu shows the same fault (SV-12722, https://shopview.atlassian.net/browse/SV-12722, Ready to Fix), but that report names only the Customer menu.', RUN],
  'pictures': [P('C1145248', q['pic2'], 'Step 2: the Vendor menu - vendor A\'s name is cut off at the top and drawn over the next vendor', [(490, 438, 335, 66, 'bad', 'Vendor A cut off and drawn over the next row'), (482, 492, 352, 40, 'bad', '"%s" overwritten' % a['nextText'][:24])])]}
# C1145250
q = B['C1145250']; c = q['cell1']; assert c['text'] == N120 and q['over1'] == {'table': 0, 'page': 0} and not q['wrap1'] and c['lines'] >= 2 and not c['overflowsCell'] and not c['runsIntoNext']
R['C1145250'] = {'verdict': 'Passed', 'observed': [SET % 'A/P Aging Summary, only vendor A (the 120-letter no-space vendor) ticked',
    'Step 1: vendor A\'s name wraps inside its own cell onto %d lines and does not run into Location; every heading from Vendor to Total is on one line and visible, there is no sideways scroll bar, and Total is bold at the right edge.' % c['lines'], RUN],
  'pictures': [P('C1145250', q['pic1'], 'Step 1: A/P Summary - the 120-letter vendor name wraps inside its cell; every column visible', [tuple(c['box']) + ('good', 'Name wraps in its cell'), (278, 160, 1132, 48, 'good', 'Every heading on one line')])]}
# C1145252
q = B['C1145252']; c = q['cells2'][0]; assert q['over1'] == {'table': 0, 'page': 0} and q['over2'] == {'table': 0, 'page': 0} and not q['wrap1'] and not q['wrap2'] and c['lines'] >= 2 and not c['overflowsCell'] and q['boldLast'] == '700'
R['C1145252'] = {'verdict': 'Passed', 'observed': [SET % 'A/P Aging Detail, only vendor A (the 120-letter no-space vendor) ticked, every bucket collapsed',
    'Step 1: every heading from Date to Open Balance is visible on one line and there is no sideways scroll bar.',
    'Step 2: with Current open, vendor A\'s bill shows; the name in Vendor Name wraps inside its own cell (%d lines) without running into Due Date; every heading still visible, no sideways scroll bar, Open Balance bold at the right edge.' % c['lines'], RUN],
  'pictures': [P('C1145252', q['pic1'], 'Step 1: A/P Detail collapsed - every heading on one line, no sideways scroll bar', [(278, 160, 1132, 48, 'good', 'Every heading on one line')]),
               P('C1145252', q['pic2'], 'Step 2: Current open - the long vendor name wraps inside its cell', [tuple(c['box']) + ('good', 'Name wraps in its cell'), (278, 160, 1132, 48, 'good', 'Every heading still visible')])]}
# C1145253
q = B['C1145253']; assert q['over1']['table'] > 0 and q['cell1']['lines'] == 1 and q['over2']['table'] == 0 and q['cells2'][0]['lines'] == 1
R['C1145253'] = {'verdict': 'Failed', 'failed_steps': 'Failed at steps 1 and 2: customer A\'s name stays on one line across the group row; in step 1 the table is wider than the page and Past Due and Amount are hidden.', 'bold_steps': [1, 2],
  'source': SRC('C1145253'), 'ticket': 'Follow the status here https://shopview.atlassian.net/browse/SV-12764 (Open, read 14 Nov 2026) - the known problem this test names.',
  'todo': 'What needs to be done: nothing for the tester now; re-run this test on staging when SV-12764 reaches Ready for QA.',
  'observed': [SET % 'A/R Aging Collection, only customer A (the 120-letter no-space customer) ticked, its group collapsed',
    'Step 1: customer A\'s name runs on one line across the group row; the table is %d px wider than the page, the headings show Date, Location, Transaction Type, ID, Due Date and Open Balance only - Past Due and Amount are hidden behind the pinned Open Balance - and the Totals row shows only Open Balance.' % q['over1']['table'],
    'Step 2: with the group open the columns fit again, but customer A\'s name still runs on one line in the group row.',
    'This is exactly the known problem the test describes (SV-12764), so nothing new is raised.', RUN],
  'pictures': [P('C1145253', q['pic1'], 'Step 1: A/R Collection - the name runs on one line; Past Due and Amount hidden; Totals shows only Open Balance', [(380, 216, 830, 32, 'bad', 'Name on one line'), (1100, 165, 200, 36, 'bad', 'Past Due and Amount hidden'), (278, 262, 1132, 36, 'bad', 'Totals: only Open Balance')]),
               P('C1145253', q['pic2'], 'Step 2: group open - columns fit, but the name still runs on one line', [tuple(q['cells2'][0]['box']) + ('bad', 'Name still on one line')])]}
# C1145254
q = B['C1145254']; g = q['cells2'][0]; bl = q['cells2'][1]; assert q['cell1']['text'].startswith('ZZAUTOTEST' + 'Abcdefghij' * 6 + 'Abcdefgh') and q['over1'] == {'table': 0, 'page': 0} and q['over2'] == {'table': 0, 'page': 0} and bl['lines'] >= 2 and not bl['overflowsCell'] and q['boldLast'] == '700'
R['C1145254'] = {'verdict': 'Passed', 'observed': [SET % 'A/P Unpaid Invoices, only vendor A (the 78-character no-space vendor) ticked, its group collapsed',
    'Step 1: vendor A\'s whole name shows in the group row; every heading from Date to Open Balance is visible on one line and there is no sideways scroll bar.',
    'Step 2: vendor A\'s bills show under the group row; the name in Vendor Name wraps inside its own cell (%d lines) without running into Due Date; every heading still visible, no sideways scroll bar, Open Balance bold at the right edge.' % bl['lines'], RUN],
  'pictures': [P('C1145254', q['pic1'], 'Step 1: A/P Unpaid - the 78-character name shows whole in the group row; every column visible', [tuple(q['cell1']['box']) + ('good', 'Whole name in the group row'), (278, 160, 1132, 48, 'good', 'Every heading on one line')]),
               P('C1145254', q['pic2'], 'Step 2: group open - the name wraps inside its cell on each bill line', [tuple(bl['box']) + ('good', 'Name wraps in its cell'), (278, 160, 1132, 48, 'good', 'Every heading still visible')])]}
# C1145260
q = B['C1145260']; assert q['menu'] == 'Download (PDF)\nDownload (CSV)' and q['pdf'] and q['subtotal'] is False
sc = 936 / 841.89
R['C1145260'] = {'verdict': 'Passed', 'observed': [SET % 'A/R Aging Collection, only customer A (the 120-letter no-space customer) ticked',
    'Step 1: the Export report menu shows "Download (PDF)" and "Download (CSV)".', 'Step 2: the PDF downloads.',
    'Step 3: customer A\'s group ends with "Total for ZZAUTOTESTAbcdefghij..." (the whole 120-letter name) with Amount $110.00 and Open Balance $110.00; the name fits inside the row on the landscape page and ends well before the Amount figure, so nothing runs over the money or off the page. The word "Subtotal" appears nowhere in the PDF.', RUN],
  'pictures': [P('C1145260', q['picPdf'], 'Steps 1-2: Export report menu used - the PDF downloaded', []),
               P('C1145260', 's16b/C1145260-pdfpage-1.png', 'Step 3: the PDF - "Total for" + the whole name, clear of Amount and Open Balance; no "Subtotal"', [(int(28 * sc), int(309 * sc), int(595 * sc), int(17 * sc), 'good', 'Total for + whole name'), (int(686 * sc), int(309 * sc), int(130 * sc), int(17 * sc), 'good', 'Amount and Open Balance clear')])]}
json.dump({'pass_meta': {'note': '14 Nov 2026, run 557, g18: new tests batch 2 on staging'}, 'results': R}, open(PP + 'RESULTS-g18.json', 'w'), indent=1); print({k: v['verdict'] for k, v in R.items()})
