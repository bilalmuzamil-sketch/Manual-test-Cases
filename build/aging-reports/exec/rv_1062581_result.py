"""rv_1062581_result.py — 12 Nov 2026 06:50 UTC: C1062581 retest on v26.45.3-34788b2 (SV-12544 Ready for QA, read 12 Nov ~06:40 UTC).
A/R Aging Detail PDF, invoice S11315-17900 dated Nov 4 2026, Net 30: the row prints "Nov 04 2026" and "Dec 04 2026" (rv1112/s9b)."""
import json, glob
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 'rv1112/s9b/C1062581.json')); C = 'C1062581'
row = [r for r in o['pdfRows'] if 'S11315-17900' in r][0]; assert 'Nov 04 2026' in row and 'Dec 04 2026' in row
R = {C: {'verdict': 'Passed', 'observed': [
    'Retest after SV-12544 (Ready for QA), on the new build v26.45.3-34788b2. Set up: customer ZZX PDF Date S9R with one open invoice S11315-17900 ($64.00) dated Nov 4, 2026, Net 30 (due Dec 4, 2026).',
    'A/R Aging Detail, As of 11/04/2026, only that customer ticked; Download (PDF) from the ⋯ menu.',
    'The PDF row prints Date "Nov 04 2026" and Due Date "Dec 04 2026" - three-letter month, two-digit day and year, as the test asks.'],
    'pictures': [P(C, 'rv1112/s9b/C1062581-1-asof-nov4.png', 'Set up: A/R Aging Detail as of 11/04/2026, customer ZZX PDF Date S9R', [(283, 118, 600, 32, 'good', 'As of and customer')]),
                 P(C, 'rv1112/s9b/C1062581-pdf-p1-1.png', 'The PDF row: "Nov 04 2026" and "Dec 04 2026"', [(20, 296, 1250, 34, 'good', 'Two-digit day, no comma')])]}}
json.dump({'pass_meta': {'note': '12 Nov 2026, run 557, retest rv_s9b_ar'}, 'results': R}, open(PP + 'RESULTS-rv-1062581.json', 'w'), indent=1); print(list(R))
