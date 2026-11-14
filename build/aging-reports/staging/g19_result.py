"""g19_result.py - 14 Nov 2026, run 557, staging v26.45.4-f3d3d2d, QA lead's session, browser Asia/Karachi, 1440 px. New tests batch 3 (PDF / CSV):
C1145292 A/R Detail and C1145293 A/P Detail PDFs end each bucket with "Total for <bucket>"; C1145294 A/R Collection and C1145295 A/P Unpaid PDFs end each
customer/vendor with "Total for <name>" (special-character name exact, inside the row); C1145296 A/R Detail PDF + CSV print the as-of date Dec 31, 2026
(SV-12545 Merged to Staging). All Passed. Measurements s16c/out.json (C1145294/95 rerun with the exact-name pick), PDF word positions s16c/*-bbox.html."""
import json, re, sys
sys.path.insert(0, '/home/user/Manual-test-Cases/build/aging-reports/exec')
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/staging/'
def P(cid, path, t, b, tag=''): src = path if path.startswith('/') else PP + path; dst = PP + 'pics/%s-%s%s' % (cid, tag, src.split('/')[-1]); ann(src, dst, t, [], [], b); return dst
O = json.load(open(PP + 's16c/out.json')); RUN = 'Test run 557: https://shopview.testrail.io/index.php?/runs/view/557'
SET = 'Set up: staging (build v26.45.4-f3d3d2d), Admin, 1440 px wide, browser on Pakistan time, as of 11/14/2026; %s.'
sc = 936 / 841.89
def words(cid):
    h = open(PP + 's16c/%s-bbox.html' % cid).read().split('<page ')[1]
    return [(float(a), float(b), float(c), float(d), t) for a, b, c, d, t in re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)</word>', h)]
def pdfrows(cid):
    ws = words(cid); out = []
    for i, w in enumerate(ws):
        if w[4] == 'Total' and ws[i + 1][4] == 'for':
            row = [x for x in ws if abs(x[1] - w[1]) < 1]; money = [x for x in row if x[4].startswith('$') or x[4].startswith('(')]; name = [x for x in row if x not in money]
            out.append({'y': w[1], 'nameRight': max(x[2] for x in name), 'moneyLeft': min(x[0] for x in money), 'box': (int(26 * sc), int((w[1] - 3) * sc), int((max(x[2] for x in name) - 22) * sc), int(17 * sc)), 'mbox': (int((min(x[0] for x in money) - 4) * sc), int((w[1] - 3) * sc), int((816 - min(x[0] for x in money)) * sc), int(17 * sc))})
    return out
R = {}
for cid, rep, kind, who, rows in [('C1145292', 'A/R Aging Detail', 'Customer', 'only "ZZAUTOTEST PDF Buckets Customer" ticked (one invoice 31-60 days past due, one 1-30)', [(278, 401, 1132, 47), (278, 545, 1132, 47)]),
                                  ('C1145293', 'A/P Aging Detail', 'Vendor', 'only "ZZAUTOTEST PDF Buckets Vendor" ticked (one bill 31-60 days past due, one 1-30)', [(278, 401, 1132, 47), (278, 545, 1132, 47)])]:
    q = O[cid]; pt = q['pdf']['totals']; assert q['screenTotals'] == pt == ['Total for 31-60 days past due $210.00 $210.00', 'Total for 1-30 days past due $110.00 $110.00'] and q['pdf']['subtotal'] is False and q['menu'] == 'Download (PDF)\nDownload (CSV)'
    pr = pdfrows(cid)
    R[cid] = {'verdict': 'Passed', 'observed': [SET % (rep + ', ' + who),
        'Step 1: Expand all opens every bucket; "31-60 days past due" ends with "Total for 31-60 days past due" $210.00 / $210.00 and "1-30 days past due" ends with "Total for 1-30 days past due" $110.00 / $110.00.',
        'Step 2: the Export report menu shows "Download (PDF)" and "Download (CSV)".', 'Step 3: the PDF downloads.',
        'Step 4: in the PDF the 31-60 bucket ends with "Total for 31-60 days past due" $210.00 / $210.00 and the 1-30 bucket with "Total for 1-30 days past due" $110.00 / $110.00 - the same as on screen; the word "Subtotal" appears nowhere.', RUN],
      'pictures': [P(cid, q['pic1'], 'Step 1: ' + rep + ', Expand all - each bucket ends with its "Total for" row', [rows[0] + ('good', 'Total for 31-60 days past due'), rows[1] + ('good', 'Total for 1-30 days past due')]),
                   P(cid, 's16c/%s-page-1.png' % cid, 'Step 4: the PDF - the same "Total for" rows and amounts; no "Subtotal"', [r['box'] + ('good', 'Total for row') for r in pr] + [pr[0]['mbox'] + ('good', 'Same amounts as on screen')], 'pdf-')]}
SC2 = 'ZZAUTOTEST Special & "Quoted" \'Single\' <Less> Greater> Customer Two PDF Blocks'; SV2 = SC2.replace('Customer Two', 'Vendor Two')
for cid, rep, unit, A, Bn, rows in [('C1145294', 'A/R Aging Collection', 'customer', SC2, 'ZZAUTOTEST Collection PDF Customer B', {'A': (278, 498, 1132, 47), 'B': (278, 305, 1132, 47)}),
                                    ('C1145295', 'A/P Unpaid Invoices', 'vendor', SV2, 'ZZAUTOTEST Unpaid PDF Vendor B', {'A': (278, 353, 1132, 47), 'B': (278, 497, 1132, 47)})]:
    q = O[cid]; ta = 'Total for %s $160.00 $160.00' % A; tb = 'Total for %s $55.00 $55.00' % Bn
    assert ta in q['screenTotals'] and tb in q['screenTotals'] and ta in q['pdf']['totals'] and tb in q['pdf']['totals'] and q['pdf']['subtotal'] is False and q['menu'] == 'Download (PDF)\nDownload (CSV)'
    pr = pdfrows(cid); ra = max(pr, key=lambda r: r['nameRight']); assert ra['nameRight'] < ra['moneyLeft'] - 50 and ra['nameRight'] < 812
    R[cid] = {'verdict': 'Passed', 'observed': [SET % ('%s, two %ss ticked: %s A = "%s" (two overdue %s) and %s B = "%s"' % (rep, unit, unit, A, 'invoices' if unit == 'customer' else 'bills', unit, Bn)),
        'Step 1: Expand all opens every group; %s A\'s group ends with "Total for %s" $160.00 / $160.00 and %s B\'s with "Total for %s" $55.00 / $55.00.' % (unit, A, unit, Bn),
        'Step 2: the Export report menu shows "Download (PDF)" and "Download (CSV)".', 'Step 3: the PDF downloads.',
        'Step 4: in the PDF %s A\'s block ends with "Total for" and the whole name exactly as typed, & " \' < > included, with $160.00 / $160.00; the name fits inside the row and ends well before the Amount figure, so nothing runs over the money or off the page. %s B\'s block ends with "Total for %s" $55.00 / $55.00. The word "Subtotal" appears nowhere.' % (unit.capitalize(), unit.capitalize(), Bn), RUN],
      'pictures': [P(cid, q['pic1'], 'Step 1: %s, Expand all - each %s ends with its "Total for" row' % (rep, unit), [rows['A'] + ('good', 'Total for %s A (special characters)' % unit), rows['B'] + ('good', 'Total for %s B' % unit)]),
                   P(cid, 's16c/%s-page-1.png' % cid, 'Step 4: the PDF - "Total for" + each whole name, clear of the amounts; no "Subtotal"', [r['box'] + ('good', 'Total for row') for r in pr] + [ra['mbox'] + ('good', 'Amounts clear of the name')], 'pdf-')]}
q = O['C1145296']; assert q['chips2'][0].startswith('calendar_today As of: 12/31/2026') and q['pdfAsOf'] == 'As of Dec 31, 2026' and q['pdfHasInv'] and q['csvHead'][0] == '"As of: Dec 31, 2026"' and 'S2-40373' in open(q['csvFile']).read()
ws = words('C1145296'); aw = [w for w in ws if w[4] == 'As'][0]
R['C1145296'] = {'verdict': 'Passed', 'observed': [SET % 'A/R Aging Detail, only customer A (the 120-letter customer, invoice dated today) ticked',
    'Step 1: the calendar opens on November 2026 with today selected.', 'Step 2: picking 31 in December sets the chip to "As of: 12/31/2026"; the report reloads and customer A\'s invoice is still listed.',
    'Steps 3-5: the PDF downloads and its as-of line reads "As of Dec 31, 2026" (not today); customer A\'s invoice is in it.',
    'Steps 6-8: the CSV downloads and its as-of line reads "As of: Dec 31, 2026"; customer A\'s invoice dated today (S2-40373) is in it.', RUN],
  'pictures': [P('C1145296', q['pic2'] if q.get('pic2') else 's16c/10-C1145296-2-future-date.png', 'Step 2: the as-of date set to the last day of next month', [(283, 119, 186, 30, 'good', 'As of: 12/31/2026')]),
               P('C1145296', 's16c/C1145296-pdfpage-1.png', 'Step 5: the PDF prints "As of Dec 31, 2026"', [(int((aw[0] - 3) * sc), int((aw[1] - 3) * sc), int(125 * sc), int(17 * sc), 'good', 'As of Dec 31, 2026')], 'pdf-')]}
json.dump({'pass_meta': {'note': '14 Nov 2026, run 557, g19: new tests batch 3 (PDF/CSV) on staging'}, 'results': R}, open(PP + 'RESULTS-g19.json', 'w'), indent=1); print({k: v['verdict'] for k, v in R.items()})
