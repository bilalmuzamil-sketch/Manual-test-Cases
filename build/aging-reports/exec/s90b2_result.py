"""s90b2_result.py — 11 Nov 2026: C715417 (A/R Collection: part sale P3-188 at Lethbridge asks to switch; "Switch location" opens its finance page
and the active location becomes Lethbridge). EXPECT FAIL SV-12139 marker: outcome (3) - passes, "Switch location" now has a small l (as on C715416)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, n, t, b): src = PP + 's90/' + n; dst = PP + 'pics/%s-%s' % (cid, n); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 's90/C715417.json')); C = 'C715417'
assert o['stayed'] and o['dialog'] == 'Switch location? close This part sale is in Staging Lethbridge - 4310. Switch your active location to view it? Cancel Switch location'
b = {x[0]: x for x in o['buttons']}; assert b['Cancel'][1] < b['Switch location'][1] and b['close'][1] > b['Switch location'][1] and b['close'][2] < b['Cancel'][2]
assert '/parts/part-sale/' in o['urlAfter2'] and o['urlAfter2'].endswith('/finance') and 'Staging Lethbridge - 4310' in o['switcher']
R = {C: {'verdict': 'Passed', 'observed': [
    'A/R Aging Collection, as of today, signed in at Staging Heavy Duty - 9919, customer "Doi Truck Center" ticked and open; part sale invoice P3-188 made at Staging Lethbridge - 4310 ($528.95, 81 days past due).',
    'Step 1: clicking P3-188 opens a dialog over the report (the address does not change). Title "Switch location?"; message "This part sale is in Staging Lethbridge - 4310. Switch your active location to view it?"; "Cancel" on the left, "Switch location" (small l) on the right; a close × at the top right.',
    'Step 2: clicking "Switch location" opens the part sale\'s Finance page, and the location switcher at the top right now reads "Staging Lethbridge - 4310".',
    'This test carried a "what you should see today" note for a known problem (the button read "Switch Location" with a capital L). That problem is gone - the fix has shipped, so the note can come off. (Switched back to Heavy Duty afterwards.)'],
    'pictures': [P(C, '05-C715417-1-dialog.png', 'Step 1: "Switch location?" over the report - Cancel left, "Switch location" (small l) right, × top right', [(416, 345, 608, 201, 'good', 'Exact wording')]),
                 P(C, '06-C715417-2-switched.png', 'Step 2: the part sale\'s Finance page; active location now Staging Lethbridge - 4310', [(1180, 8, 250, 42, 'good', 'Lethbridge')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, s90b C715417'}, 'results': R}, open(PP + 'RESULTS-s90b-417.json', 'w'), indent=1); print(list(R))
