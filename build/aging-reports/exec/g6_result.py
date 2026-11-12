"""g6_result.py — 12 Nov 2026 08:00 UTC: retests asked by the QA lead (Failed test + ticket Ready for QA ⇒ retest; fixed ⇒ Passed), v26.45.3-34788b2.
C1079009 (SV-12547 Ready for QA): A/R Collection PDF for one customer closes it with "Total for <customer>" + Totals. C1095436 (SV-12544 Ready for QA):
screen "$-5.00"; PDF "(-$5.00)", "Oct 26 2026". Outcome (3) of each EXPECT FAIL marker: the fix shipped — tell the QA lead."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 'g6/out.json')); r1, r2 = o['R1'], o['R2']
assert 'Total for ZZAUTOTEST AR R36 Collect X $110.00 $110.00' in r1['lines'] and not any('Subtotal' in l for l in r1['lines']) and sum(1 for l in r1['lines'] if 'Credit term' in l) == 1
assert '$-5.00' in r2['row'] and '(-$5.00)' in r2['pdfLine'] and r2['pdfLine'].startswith('Oct 26 2026')
R = {'C1079009': {'verdict': 'Passed', 'observed': [
    'Retest after https://shopview.atlassian.net/browse/SV-12547 (Ready for QA), on the new build v26.45.3-34788b2.',
    'A/R Aging Collection with only customer "ZZAUTOTEST AR R36 Collect X" picked in the Customer chip; Export menu, Download (PDF).',
    'Step 7: the PDF prints only that customer - its line (invoice S11315-17846, $110.00), then "Total for ZZAUTOTEST AR R36 Collect X $110.00 $110.00", then "Totals $110.00 $110.00". The word "Subtotal" no longer appears.'],
    'pictures': [P('C1079009', 'g6/R1-1-picked.png', 'Set up: only customer X picked in the Customer chip', [(490, 118, 230, 32, 'good', 'Customer X only')]),
                 P('C1079009', 'g6/R1-pdf-p1-1.png', 'Step 7: only customer X, its "Total for" line and the Totals row', [])]},
     'C1095436': {'verdict': 'Passed', 'observed': [
    'Retest after https://shopview.atlassian.net/browse/SV-12544 (Ready for QA), on the new build v26.45.3-34788b2.',
    'Step 4: on screen the credit memo CM11315-4209 of ZZAUTOTEST AR R42 Memo Line still reads "$-5.00".',
    'Step 9: in the PDF its line reads "Oct 26 2026" for both dates (no comma) and "(-$5.00)" - in brackets with a minus sign, as PRD S3-R7a requires.'],
    'pictures': [P('C1095436', 'g6/R2-1-screen.png', 'Step 4: on screen the credit memo still reads $-5.00', []),
                 P('C1095436', 'g6/R2-pdf-p1-1.png', 'Step 9: in the PDF "Oct 26 2026" and "(-$5.00)"', [])]}}
json.dump({'pass_meta': {'note': '12 Nov 2026, run 557, g6 retests'}, 'results': R}, open(PP + 'RESULTS-g6.json', 'w'), indent=1); print(list(R))
