"""s90b_result.py — 11 Nov 2026: C715415 (A/R Collection: part sale invoice P11315-248 at Heavy Duty - only the number is a link, opens the part sale's
finance page; the Open Balance cell does nothing) from s90/C715415.json (s90b re-run with sortlib expand)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, n, t, b): src = PP + 's90/' + n; dst = PP + 'pics/%s-%s' % (cid, n); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 's90/C715415.json')); C = 'C715415'
hv = {c[0]: c for c in o['hover']}; assert hv['P11315-248'][2] == 'pointer' and hv['P11315-248'][3] and all(not c[3] and c[1] == 'rgb(0, 0, 0)' for c in o['hover'] if c[0] != 'P11315-248')
assert o['obCursor'] == 'auto' and o['afterBalanceClick']['same'] and not o['afterBalanceClick']['newTab'] and not o['afterBalanceClick']['dialog']
assert '/parts/part-sale/' in o['opened']['url'] and o['opened']['url'].endswith('/finance')
ROW = (278, 305, 1132, 48); OB = (1290, 305, 120, 48); NUM = (791, 305, 144, 48)
R = {C: {'verdict': 'Passed', 'observed': [
    'A/R Aging Collection, as of today, customer "ZZAUTOTEST AR Customer A" ticked and its group open; part sale invoice P11315-248 (Sep 15, 2026, Staging Heavy Duty - 9919, $300.00 open, 27 days past due).',
    'Step 1: hovering the Open Balance cell ($300.00) the pointer stays an arrow; the row\'s text is black - only the number P11315-248 is blue with a hand pointer.',
    'Step 2: clicking the Open Balance cell nothing opens: same page, no new tab, no window.',
    'Step 3: clicking P11315-248 opens the part sale\'s Finance page (Parts / Notes / Stats / Finance tabs) in the same tab.'],
    'pictures': [P(C, '02-C715415-1-hover-balance.png', 'Step 1: pointer on Open Balance stays an arrow; only the number is blue', [OB + ('good', 'No hand'), NUM + ('good', 'Only link')]),
                 P(C, '03-C715415-2-balance-clicked.png', 'Step 2: clicking the Open Balance cell - nothing opens', [OB + ('good', 'Nothing opens')]),
                 P(C, 'C715415-3-opened.png', 'Step 3: the number opens the part sale\'s Finance page', [])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, s90b C715415'}, 'results': R}, open(PP + 'RESULTS-s90b-415.json', 'w'), indent=1); print(list(R))
