"""p74_result.py — 11 Nov 2026: C715499-C715504 (loading bar + empty state match Sales By Customer). Loading bar: p74 (every /reporting/ reply held 3 s)
saw the same table progress bar (q-linear-progress text-grey-8 q-table__linear-progress, 2 px, just under the headings at y 207) on Sales By Customer and
on each aging report. Steps 2-6 from s84 (seeded ZZX/ZZY "Only LB P68" customer/vendor with documents only at Lethbridge); SBC empty state from s84b."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
L = json.load(open(PP + 'p74/out.json')); SBC = json.load(open(PP + 's84/SBC2.json'))
BAR = 'q-linear-progress text-grey-8 q-table__linear-progress'
def bar(k): return [x for _, xs in L[k]['samples'] for x in xs if x['cls'] == BAR]
sb = bar('sbc'); assert sb and all(x['box'][1] == 207 and x['box'][3] == 2 for x in sb)
EMPTY = 'search No record matches these filters Try changing filters to widen your results. Clear all filters'
assert SBC['empty']['text'] == EMPTY
MAP = {'C715499': ('ars', 'A/R Aging Summary', 'customer', 'Customer: ZZX Only LB P68'), 'C715500': ('ard', 'A/R Aging Detail', 'customer', 'Customer: ZZX Only LB P68'),
       'C715501': ('arc', 'A/R Aging Collection', 'customer', 'Customer: ZZX Only LB P68'), 'C715502': ('aps', 'A/P Aging Summary', 'vendor', 'Vendor: ZZY Only LB P68'),
       'C715503': ('apd', 'A/P Aging Detail', 'vendor', 'Vendor: ZZY Only LB P68'), 'C715504': ('apu', 'A/P Unpaid Invoices', 'vendor', 'Vendor: ZZY Only LB P68')}
BARBOX = (278, 198, 1132, 20); EBOX = (600, 280, 490, 175); CHIPS = (278, 118, 900, 32)
R = {}
for c, (k, rep, who, pick) in MAP.items():
    o = json.load(open(PP + 's84/%s.json' % c)); b = bar(k)
    assert b and all(x['box'][1] == 207 and x['box'][3] == 2 and x['color'] == sb[0]['color'] for x in b), c
    assert 'As of: 11/10/2026' in o['chips1'][0] and 'As of: 11/11/2026' in o['chips2'][0] and 'Location: Staging Heavy D' in o['chips3'][-1]
    assert any(pick in x for x in o['chips4']) and o['rows4'] == [] and o['empty']['text'] == EMPTY and o['empty']['totals'] is False
    assert [x['box'] for x in o['empty']['kids']] == [x['box'] for x in SBC['empty']['kids']] and [x['size'] for x in o['empty']['kids']] == [x['size'] for x in SBC['empty']['kids']]
    assert 'All locations' in o['chips6'][-1] and o['rows6'] > 0
    sh = {n.split('-', 2)[-1].replace('.png', ''): n.split('/')[-1] for n in o['shots']}
    R[c] = {'verdict': 'Passed', 'observed': [
        '%s, as of today, all locations; compared with Sales By Customer.' % rep,
        'Step 1: changing the as-of date to yesterday, a thin grey progress bar runs across the table just under the column headings while the report loads - the same bar, same size, colour and place, as Sales By Customer shows when its date changes (both pictured with the reply slowed to 3 seconds so the bar can be seen).',
        'Step 2: changing back, the chip reads "As of: 11/11/2026" and today\'s rows show.',
        'Step 3: unticking Staging Lethbridge - 4310, the chip reads "Location: Staging Heavy D..." and the report narrows to that location.',
        'Step 4: ticking the %s that only has documents at Lethbridge ("%s"), the report has no rows.' % (who, pick),
        'Step 5: the empty state reads "No record matches these filters" and "Try changing filters to widen your results." with a "Clear all filters" button, and no Totals row. Its icon, words and button sit at exactly the same places and sizes as Sales By Customer\'s empty state.',
        'Step 6: "Clear all filters" puts the filters back to their defaults ("Location: All locations") and rows show again.'],
        'pictures': [P(c, 'p74/sbc-loading.png', 'Step 1 (comparison): Sales By Customer\'s loading bar under the headings', [BARBOX + ('good', 'Loading bar')]),
                     P(c, 'p74/%s-loading.png' % k, 'Step 1: the same loading bar on %s' % rep, [BARBOX + ('good', 'Same bar')]),
                     P(c, 's84/' + sh['3-location-A'] if '3-location-A' in sh else 's84/' + [v for v in sh.values() if 'location-A' in v][0], 'Step 3: narrowed to Staging Heavy Duty - 9919', [CHIPS + ('good', 'Location A only')]),
                     P(c, 's84/' + [v for v in sh.values() if '4-5-empty' in v][0], 'Steps 4-5: no rows - "No record matches these filters", Clear all filters, no Totals row', [EBOX + ('good', 'Empty state')]),
                     P(c, 's84/03-SBC2-2-empty.png', 'Step 5 (comparison): Sales By Customer\'s empty state - same words, places and sizes', [EBOX + ('good', 'Same layout')]),
                     P(c, 's84/' + [v for v in sh.values() if '6-cleared' in v][0], 'Step 6: filters back to defaults, rows show', [CHIPS + ('good', 'Defaults')])]}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, p74 + s84 loading/empty'}, 'results': R}, open(PP + 'RESULTS-p74.json', 'w'), indent=1); print(list(R))
