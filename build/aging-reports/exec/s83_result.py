"""s83_result.py — 11 Nov 2026: C715356 (A/P Detail top-left chevron: Collapse all / Expand all, sort mark unchanged) from exec/s83/C715356.json."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, n, t, b): src = PP + 's83/' + n; dst = PP + 'pics/%s-%s' % (cid, n); ann(src, dst, t, [], [], b); return dst
BTN = (280, 165, 50, 40); ROWS = (278, 209, 1132, 240); HEAD = (278, 161, 1132, 48)
R = {'C715356': {'verdict': 'Passed', 'observed': [
    'A/P Aging Detail, as of today, all locations, every bucket closed; the report opened sorted by Vendor Name (small up arrow).',
    'Step 1: clicking the chevron on "91 or more days past due (11936)" opens that bucket only; its chevron turns from right to down.',
    'Step 2: hovering the chevron button in the top-left heading cell - it points down and the tooltip above it reads "Collapse all".',
    'Step 3: clicking it closes every bucket; the sort mark stays on Vendor Name (the column under the button was not sorted).',
    'Step 4: the button now points right and the tooltip reads "Expand all".',
    'Step 5: clicking it opens all five buckets (91+, 61-90, 31-60, 1-30, Current); every bucket chevron points down; the sort mark is still on Vendor Name.'],
    'pictures': [P('C715356', '02-C715356-1-one-open.png', 'Step 1: one bucket opened - its chevron points down', [ROWS + ('good', 'Only "91 or more days past due" open')]),
                 P('C715356', '03-C715356-2-hover-collapse.png', 'Step 2: tooltip "Collapse all" above the top-left button', [BTN + ('good', 'Collapse all')]),
                 P('C715356', '04-C715356-3-collapsed.png', 'Step 3: every bucket closed, sort mark still on Vendor Name', [HEAD + ('good', 'Sort mark unchanged'), ROWS + ('good', 'All closed')]),
                 P('C715356', '05-C715356-4-hover-expand.png', 'Step 4: tooltip "Expand all"', [BTN + ('good', 'Expand all')]),
                 P('C715356', '06-C715356-5-expanded.png', 'Step 5: every bucket open, sort mark still on Vendor Name', [HEAD + ('good', 'Sort mark unchanged')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, s83b C715356'}, 'results': R}, open(PP + 'RESULTS-s83-a.json', 'w'), indent=1); print(list(R))
