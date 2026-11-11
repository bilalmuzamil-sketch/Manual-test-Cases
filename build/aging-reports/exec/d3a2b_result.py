"""d3a2b_result.py — 11 Nov 2026: C715529 (narrower than 1024 px: the native mobile filter row + a table that scrolls sideways). At 900 px A/R Aging
Summary and A/P Unpaid Invoices (d3a C715529) show the chips in one sliding strip under the title with a > arrow - the same strip Sales By Customer
shows at 900 px (d3d SBC-900) - and the table scrolls sideways under the pinned Total / Open Balance column."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 'd3a/C715529.json')); q = json.load(open(PP + 'd3d/SBC900.json')); C = 'C715529'
assert all(x[2] == q['row'][0][2] for x in q['row'] + q['ars']) and o['ars']['chips'] == 4 and o['apu']['chips'] == 4
ROW = (30, 188, 840, 58); TAB = (30, 246, 840, 600)
R = {C: {'verdict': 'Passed', 'observed': [
    'Browser window 900 px wide; compared with Sales By Customer at the same width.',
    'Step 1: A/R Aging Summary shows the mobile filter row - the four chips (As of, Customer, Past due, Location) in one sliding strip under the title with a > arrow at the right - the same strip Sales By Customer shows at 900 px.',
    'Step 2: the table scrolls sideways (the columns run past the right edge under the pinned Total column); nothing else is laid out differently for small screens.',
    'Step 3: A/P Unpaid Invoices at the same width is the same: the mobile filter row and a table that scrolls sideways.'],
    'pictures': [P(C, 'd3d/SBC-900.png', 'For comparison: Sales By Customer at 900 px - the native mobile filter row', [ROW + ('good', 'Native mobile filter row')]),
                 P(C, 'd3a/C715529-ars-900.png', 'Steps 1-2: A/R Aging Summary at 900 px - same filter row; the table scrolls sideways', [ROW + ('good', 'Same filter row'), TAB + ('good', 'Scrolls sideways')]),
                 P(C, 'd3a/C715529-apu-900.png', 'Step 3: A/P Unpaid Invoices at 900 px - the same', [ROW + ('good', 'Same filter row'), TAB + ('good', 'Scrolls sideways')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, d3a2 + d3d C715529'}, 'results': R}, open(PP + 'RESULTS-d3a2-529.json', 'w'), indent=1); print(list(R))
