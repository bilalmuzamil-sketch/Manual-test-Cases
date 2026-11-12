"""s94_473_result.py — 12 Nov 2026 00:35 UTC: C715473 (A/R PDF prints the as-of date you picked, late in the day too). Run at 00:29 UTC on 12 Nov =
5:29 pm on 11 Nov at Staging Heavy Duty - 9919 (America/Edmonton), browser clock set to that zone (s94/C715473.json)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 's94/C715473.json')); C = 'C715473'
assert o['utc'].startswith('2026-11-12') and o['edmonton'].startswith('2026-11-11') and 'As of: 11/11/2026' in o['chips'][0] and o['asOfLine'] == 'As of Nov 11, 2026' and o['pdfTop'][5] == '91 or more days past due'
R = {C: {'verdict': 'Passed', 'observed': [
    'Run at 00:29 UTC on 12 November, which is 5:29 pm on 11 November at Staging Heavy Duty - 9919 (location A, Edmonton time); the computer clock was set to that time zone; A/R Aging Detail opened at location A.',
    'Step 1: the date chip reads "As of: 11/11/2026" - today at location A, not the UTC date (12 November).',
    'Step 2: Download (PDF) from the ⋯ menu downloads "ar-aging-detail.pdf" with "Success - Data exported successfully".',
    'Step 3: the PDF\'s as-of line reads "As of Nov 11, 2026" - three-letter month, day, four-digit year, the same date, not tomorrow. The PDF prints the buckets in the screen\'s order: 91 or more days past due, 61-90, 31-60, 1-30, Current.'],
    'pictures': [P(C, 's94/C715473-1-chip.png', 'Step 1 at 5:29 pm Edmonton (00:29 UTC next day): As of 11/11/2026', [(283, 118, 185, 32, 'good', 'Today at location A')]),
                 P(C, 's94/C715473-pdf-01.png', 'Step 3: the PDF reads "As of Nov 11, 2026" - not tomorrow; buckets in screen order', [])]}}
json.dump({'pass_meta': {'note': '12 Nov 2026 00:29 UTC, run 557, s94'}, 'results': R}, open(PP + 'RESULTS-s94-473.json', 'w'), indent=1); print(list(R))
