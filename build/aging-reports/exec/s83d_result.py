"""s83d_result.py — 11 Nov 2026: C715600 (A/R Collection: group label stays visible at the left when the table scrolls sideways). S4-R7 asks that
the label "stays visible at the left" - not that it is pinned (Rule 137: nothing stricter). Measured (s83d): at 1200 px the table scrolls 6 px, at
900 px 58 px; the label moves with the columns (relative, not sticky) but starts ~110 px in from the table's edge, so it never leaves view."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, n, t, b): src = PP + 's83d/' + n; dst = PP + 'pics/%s-%s' % (cid, n); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 's83d/C715600.json')); C = 'C715600'
a, b = o['w1200'], o['w900']
assert a['before']['sw'] > a['before']['cw'] and a['after']['left'] > 0 and a['after']['visibleAtLeft'] and b['after']['left'] > 0 and b['after']['visibleAtLeft']
assert b['after']['labelX'] >= b['after']['tableLeft']
R = {C: {'verdict': 'Passed', 'observed': [
    'A/R Aging Collection, as of today, customer "Desert Edge Truck Service & Repair" (74 overdue invoices, phone and credit term on its card) ticked and open.',
    'Step 1: at 1200 px wide the table scrolls sideways (only a little: about 6 px of extra width).',
    'Step 2: scrolled fully to the right, the customer\'s label "Desert Edge Truck Service & Repair (74) Phone: 605-175-8825 Credit term: Net 45" stays visible at the left while the columns move.',
    'Checked narrower as well, so the sideways scroll is bigger: at 900 px the table scrolls about 58 px and the label is still fully visible at the left.'],
    'pictures': [P(C, 'C715600-1200-2-scrolled-right.png', 'Step 2 (1200 px): scrolled to the right - the customer label still visible at the left', [(278, 208, 700, 48, 'good', 'Label visible')]),
                 P(C, 'C715600-900-2-scrolled-right.png', 'Also at 900 px (bigger sideways scroll): the label still visible at the left', [(30, 295, 600, 46, 'good', 'Label visible')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, s83d C715600'}, 'results': R}, open(PP + 'RESULTS-s83d.json', 'w'), indent=1); print(list(R))
