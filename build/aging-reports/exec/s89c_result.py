"""s89c_result.py — 11 Nov 2026: C715420 (A/P Detail) / C715421 (A/P Unpaid Invoices) - a vendor credit links to the return it came from; C715391
(A/P Unpaid Invoices) - a vendor credit belongs to its return's location or, if entered directly, to where it was entered. Data seeded by s89b:
vendor "ZZY VCredit Links P89b" - C-13686 ($-31.50, return ZZYCM6825104 made at Heavy Duty), C-13687 ($-42.75, return at Lethbridge), C-13688
($-23.45, entered directly); vendor "ZZY VCredit Loc P89b" - C-13689 ($-52.25, return at Lethbridge), C-13690 ($-19.95, entered directly at Heavy Duty)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, n, t, b): src = PP + 's89c/' + n; dst = PP + 'pics/%s-%s' % (cid, n); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 's89c/out.json')); R = {}
for c, rep in (('C715420', 'A/P Aging Detail'), ('C715421', 'A/P Unpaid Invoices')):
    v = o[c]; assert v['A']['link'] and not v['B']['link'] and not v['C']['link'] and v['B']['found'] and v['C']['found']
    assert '/parts/return/' in v['clickA']['url'] and v['clickA']['heading'][:2] == ['Return Details', 'ZZYCM6825104'] and not v['clickA']['newTab']
    R[c] = {'verdict': 'Passed', 'observed': [
        '%s, as of today, signed in at Staging Heavy Duty - 9919, vendor "ZZY VCredit Links P89b" ticked and open; three unused vendor credits: C-13686 ($-31.50, from a vendor return made at Heavy Duty), C-13687 ($-42.75, from a return made at Staging Lethbridge - 4310), C-13688 ($-23.45, entered directly, no return).' % rep,
        'Step 1: C-13686 is a link (blue, hand pointer); C-13687 and C-13688 are plain black text.',
        'Step 2: clicking C-13686 opens the vendor return it came from - "Return Details" for return ZZYCM6825104, vendor ZZY VCredit Links P89b - in the same tab.'],
        'pictures': [P(c, c + '-1-numbers.png', 'Step 1: only the credit from the Heavy Duty return (C-13686) is a link', [(740, 450, 150, 125, 'good', 'C-13686 link, others plain')] if c == 'C715420' else [(278, 208, 1132, 360, 'good', 'Only C-13686 is a link')]),
                     P(c, c + '-2-opened.png', 'Step 2: the vendor return it came from opens - Return Details ZZYCM6825104', [])]}
v = o['C715391']; r1 = {x[3]: x[1] for x in v['rows1']}; r2 = [x[3] for x in v['rows2']]
assert r1 == {'C-13689': 'Staging Lethbridge - 4310', 'C-13690': 'Staging Heavy Duty - 9919'} and r2 == ['C-13689'] and v['untick'] == 1
R['C715391'] = {'verdict': 'Passed', 'observed': [
    'A/P Unpaid Invoices, as of today, vendor "ZZY VCredit Loc P89b" ticked and its group open; two unused vendor credits: C-13689 ($-52.25, from a vendor return made at Staging Lethbridge - 4310) and C-13690 ($-19.95, entered directly while signed in at Staging Heavy Duty - 9919).',
    'Step 1: C-13689\'s Location cell reads "Staging Lethbridge - 4310" (the return\'s location); C-13690\'s reads "Staging Heavy Duty - 9919" (where it was entered).',
    'Step 2: unticking Staging Heavy Duty - 9919 in the Location menu narrows the report (chip "Location: 2 locations" - Lethbridge and the third test location); the group now reads "ZZY VCredit Loc P89b (1)", total $-52.25.',
    'Step 3: opening the group lists only C-13689.'],
    'pictures': [P('C715391', 'C715391-1-locations.png', 'Step 1: return credit at Lethbridge, direct credit at Heavy Duty', [(380, 262, 230, 84, 'good', 'Location cells')]),
                 P('C715391', 'C715391-2-location-B.png', 'Steps 2-3: Heavy Duty unticked - only the Lethbridge return\'s credit is left', [(278, 118, 900, 32, 'good', 'Narrowed'), (278, 208, 1132, 100, 'good', 'Only C-13689')])]}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, s89b seed + s89c'}, 'results': R}, open(PP + 'RESULTS-s89c.json', 'w'), indent=1); print(list(R))
