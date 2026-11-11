"""q3_480_result.py — 11 Nov 2026 19:55 UTC: C715480 (the location switcher in the top right is unchanged). Before = production v26.45.3
(prod/12-C715480-switcher.png user menu with "Change Location:"; prod/102-C715477-prod-loc-list.png its list, from pr6). After = QA (q3c/out.json)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
q = json.load(open(PP + 'q3c/out.json'))['C715480']; C = 'C715480'
assert 'Staging Lethbridge - 4310' in q['header1'] and 'Staging Heavy Duty - 9919' in q['header'] and q['chips1'] == q['chips0'] and q['rows1'] == q['rows0'] and q['scroll1'] == 0
assert [x for x in q['list'] if x != 'check'] == ['ZZAUTOTEST V1R-87 Locatio..', 'Staging Heavy Duty - 9919', 'Staging Lethbridge - 4310']
R = {C: {'verdict': 'Passed', 'observed': [
    'Before the release (production v26.45.3-f5ba431): clicking the location name and initials at the top right opens the user menu with "Change Location:" and the current location as a coloured button; clicking that button opens the list of the person\'s locations under it, the current one ticked and highlighted, long names shortened with "..".',
    'Step 1: on the new build the same menu opens the same way: "Change Location:" with "Staging Heavy Duty - 9919" as a coloured button; clicking it opens the list under it - "ZZAUTOTEST V1R-87 Locatio..", "Staging Heavy Duty - 9919" (ticked, highlighted), "Staging Lethbridge - 4310" - with the same look as before the release. The button colour is each location\'s own colour (orange here, blue for production\'s location), as before.',
    'Step 2: clicking "Staging Lethbridge - 4310" switches: the top bar then reads "Staging Lethbridge - 4310"; A/R Aging Summary reloads with the same chips (As of: 11/11/2026, Customer: All customers, Past due: Any, Location: All locations), the same first rows in the opening order (#1 Diesel, -1 Diesel, 10 Trucking, 2 Trucking…), scrolled to the top.'],
    'pictures': [P(C, 'prod/102-C715477-prod-loc-list.png', 'Before the release (production): Change Location - the list of locations under the button', [(1167, 140, 252, 255, 'good', 'Switcher before the release')]),
                 P(C, 'q3c/C715480-2-list.png', 'Step 1 on the new build: the same switcher and list of locations', [(1185, 140, 252, 208, 'good', 'Same switcher and list')]),
                 P(C, 'q3c/C715480-3-after-switch.png', 'Step 2: switched to Staging Lethbridge - 4310; same filters and rows, at the top', [(1185, 10, 240, 36, 'good', 'Now at Lethbridge'), (278, 118, 830, 32, 'good', 'Same filters'), (278, 208, 1132, 200, 'good', 'Same rows, at the top')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, q3c + pr6'}, 'results': R}, open(PP + 'RESULTS-q3-480.json', 'w'), indent=1); print(list(R))
