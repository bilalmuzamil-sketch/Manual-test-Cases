"""d3a2_result.py — 11 Nov 2026: C715533 (A/R Summary sorted by Total matches the design picture "Click the Total header") from d3a/C715533.json."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 'd3a/C715533.json')); C = 'C715533'
assert o['s1'] == [['Total', 'descending']] and o['s2'] == [['Total', 'ascending']] and o['t0'] == o['t1'] == o['t2']
assert o['first1'][1].startswith('Desert Edge') and o['first1'][1].endswith('$231,918.94') and '$-2,062.66' in o['first2'][1]
HEAD = (278, 160, 1132, 48); TOT = (278, 852, 1132, 46); TOP = (278, 208, 1132, 48)
R = {C: {'verdict': 'Passed', 'observed': [
    'A/R Aging Summary, as of today, all locations, 1440 px, light theme; compared with the design picture "Click the Total header".',
    'Step 1: clicking "Total" re-sorts the rows largest Total first, as in the picture: "Total" now carries a small down arrow and "Customer" none; no other heading changes. The top row is Desert Edge Truck Service & Repair, $231,918.94.',
    'The Totals row reads the same before and after the click ($3,247.00 / $105,705.77 / $167,713.30 / $126,336.92 / $118,341.26 / $521,344.25).',
    'Step 2: clicking "Total" again reverses the order, smallest first (North Kensington Truck and Trailer Repair, $-2,062.66, at the top); "Total" is still the marked column (up arrow); the Totals row is unchanged.'],
    'pictures': [P(C, 'design-pics/ar-ap-p1-click-the-total-header.png', 'The design picture: sorted by Total, largest first', []),
                 P(C, 'd3a/C715533-1-desc.png', 'Step 1: largest Total first, arrow on Total only; Totals unchanged', [HEAD + ('good', 'Only Total marked'), TOP + ('good', 'Largest first'), TOT + ('good', 'Totals unchanged')]),
                 P(C, 'd3a/C715533-2-asc.png', 'Step 2: smallest Total first, Total still marked', [HEAD + ('good', 'Total still marked'), TOP + ('good', 'Smallest first')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, d3a2 C715533'}, 'results': R}, open(PP + 'RESULTS-d3a2-533.json', 'w'), indent=1); print(list(R))
