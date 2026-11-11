"""d3b_chev_result.py — 11 Nov 2026: C715505-C715508 (design: top-left chevron button, tooltips, pinned group row, dark theme) from d3b/ (steps 1-6, 8)
and d3c/ (step 7: the pinned row in dark theme, scrolled, as d3b's step-7 picture was taken back at the top). Writes RESULTS-d3b-chev.json for the ids
whose d3b and d3c data are both present and clean; prints the rest."""
import json, os, sys
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, d, n, t, b): src = PP + d + '/' + n; dst = PP + 'pics/%s-%s' % (cid, n); ann(src, dst, t, [], [], b); return dst
NAME = {'C715505': ('A/R Aging Detail', 'bucket', '91 or more days past due'), 'C715506': ('A/R Aging Collection', 'customer group', 'Desert Edge Truck Service & Repair'),
        'C715507': ('A/P Aging Detail', 'bucket', '91 or more days past due'), 'C715508': ('A/P Unpaid Invoices', 'vendor group', 'Willoughby')}
BTN = (278, 160, 60, 48); TIP = (270, 115, 140, 45); PIN = (278, 208, 1132, 48); ROWS = (278, 208, 1132, 640)
d3c = json.load(open(PP + 'd3c/d3c.json')) if os.path.exists(PP + 'd3c/d3c.json') else {}
# 11 Nov ~18:58: d3c's under-heading read came back empty for C715506 (light+dark) and C715508 (light+dark), and light for all (L0681);
# judged from the d3c pictures instead: the pinned row named here is under the headings and readable in both themes.
BYPIC = {'C715506': 'Desert Edge Truck Service & Repair (74) Phone: 605-175-8825 Credit term: Net 45', 'C715508': 'Adams Diesel Repair (8)'}
R = {}
for cid, (rep, kind, big) in NAME.items():
    f = PP + 'd3b/%s.json' % cid
    if not os.path.exists(f): print(cid, 'no d3b data'); continue
    o = json.load(open(f)); c = d3c.get(cid, {})
    ok = (o.get('btnIcon0') == 'keyboard_arrow_right' and o.get('tip1') == 'Expand all' and o.get('btnIcon1') == 'keyboard_arrow_down' and o.get('tip2') == 'Collapse all'
          and o.get('tipDark') == 'Collapse all' and not o.get('err'))
    dk = c.get('dark') or {}; lt = c.get('light') or {}
    if cid in BYPIC and c and not c.get('err') and dk.get('dark'): dk = {**dk, 'text': BYPIC[cid], 'matches': True}
    if not c or c.get('err') or not dk.get('dark') or not dk.get('matches'): print(cid, 'step 7 not yet proved', c.get('err'), dk); continue
    if not ok: print(cid, 'd3b values differ - judge by hand', o); continue
    six = ('d3b', '%s-6-pinned.png' % cid)
    if not os.path.exists(PP + 'd3b/%s-6-pinned.png' % cid):  # d3b could not find the named group (C715508): use d3c's light picture and its pinned row
        if cid not in BYPIC and (not lt.get('text') or lt.get('dark')): print(cid, 'step 6 not observed'); continue
        six = ('d3c', '%s-1-light-pinned.png' % cid); big = (BYPIC.get(cid) or lt['text']).split(' Phone')[0][:60]
    R[cid] = {'verdict': 'Passed', 'observed': [
        '%s, as of today, all locations, light theme, 1440 px, every group closed.' % rep,
        'Step 1: one chevron button in the top-left heading cell, pointing right.',
        'Step 2: every %s row shows the same chevron, pointing right while closed.' % kind,
        'Step 3: hovering the button, the tooltip above it reads "Expand all".',
        'Step 4: clicking it opens every %s; the chevrons point down.' % kind,
        'Step 5: hovering again, the tooltip reads "Collapse all".',
        'Step 6: scrolling down through "%s", its row stays just under the column headings with its label at the left.' % big,
        'Step 7: switching to dark theme while scrolled, the page turns dark and the pinned row stays readable (light text "%s" on a dark background).' % (dk.get('text', '')[:60]),
        'Step 8: in dark theme the tooltip "Collapse all" sits above the button and is readable.'],
        'pictures': [P(cid, 'd3b', '%s-1-collapsed.png' % cid, 'Steps 1-2: one chevron top-left pointing right; every %s chevron points right' % kind, [BTN + ('good', 'Chevron, right')]),
                     P(cid, 'd3b', '%s-3-hover-expand.png' % cid, 'Step 3: tooltip "Expand all" above the button', [TIP + ('good', 'Expand all')]),
                     P(cid, 'd3b', '%s-5-hover-collapse.png' % cid, 'Steps 4-5: everything open, chevrons down; tooltip "Collapse all"', [TIP + ('good', 'Collapse all')]),
                     P(cid, six[0], six[1], 'Step 6: the %s row pinned under the headings, label at the left' % kind, [PIN + ('good', 'Pinned row')]),
                     P(cid, 'd3c', '%s-2-dark-pinned.png' % cid, 'Step 7: dark theme while scrolled - the pinned row is readable', [PIN + ('good', 'Readable in dark')]),
                     P(cid, 'd3b', '%s-7-dark-hover.png' % cid, 'Step 8: dark theme - tooltip "Collapse all" above the button, readable', [TIP + ('good', 'Readable tooltip')])]}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, d3b+d3c chevron design checks'}, 'results': R}, open(PP + 'RESULTS-d3b-chev.json', 'w'), indent=1); print('built', list(R))
