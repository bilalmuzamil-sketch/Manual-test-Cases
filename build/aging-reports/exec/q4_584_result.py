"""q4_584_result.py — 11 Nov 2026 20:30 UTC: C715584 (Sales By Customer's filter menus behave as before the release). Before = production v26.45.3:
prod/pr1.json (Clear/Select all/typing/900 px) and prod/pr8.json (the same clicks with the browser's stored current location set as the QA site's own
sign-in leaves it - pr7 showed the API sign-in leaves none, which is why production first opened "All locations"). After = QA q4/out.json."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
q = json.load(open(PP + 'q4/out.json'))['C715584']; p8 = json.load(open(PP + 'prod/pr8.json')); p1 = json.load(open(PP + 'prod/pr1.json'))['C715584']; C = 'C715584'
assert 'Location: No locations' in q['afterClear']['chips'][-1] and 'Location: No locations' in p8['afterClear']['chips'][-1]
assert 'All locations' in q['afterAll']['chips'][-1] and 'All locations' in p8['afterAll']['chips'][-1] and q['afterAll']['url'].count('locationIds=') == 3 and p8['afterAll']['url'].count('locationIds=') == 4
assert q['hasSearch'] and [s['n'] for s in q['steps']] == [29, 5, 4] and all(s['focus'] for s in q['steps']) and q['typed'] == 'Des' and p1['focusInInput']
R = {C: {'verdict': 'Passed', 'observed': [
    'Before the release (production v26.45.3-f5ba431), signed in with the current location remembered by the browser (as the QA site\'s sign-in leaves it): Sales By Customer opens on the current location; "Clear selection" -> "Location: No locations", address unchanged; "Select all" -> "Location: All locations" and the address lists every location (".../reports/sales-by-customer?locationIds=…" once per location, 4 here); the Customer search keeps the cursor while typing; at 900 px the filter row becomes one scrolling row with an arrow.',
    'Step 1: "Clear selection" - no location ticked; the chip reads "Location: No locations"; the address is unchanged (".../reports/sales-by-customer").',
    'Step 2: "Select all" - all three locations ticked; the chip reads "Location: All locations"; the address lists every location (".../reports/sales-by-customer?locationIds=…" three times, one per location) - the same form as before the release.',
    'Step 3: the Customer menu opens with its search box ("Search customer").',
    'Step 4: typing "D", "e", "s" narrows the list at each letter: 26 customers after "D", 2 after "De", 1 after "Des" ("ZZAUTOTEST AR R47 Oldest First" - the search matches the letters anywhere in the name).',
    'Step 5: the cursor stays in the search box all along and every letter appears ("Des"), as before the release.',
    'Step 6: at 900 px the filter row shows as one scrolling row (Date, Product Type, Customer, then an arrow), the same as before the release.'],
    'pictures': [P(C, 'prod/13-C715584-2-select-all.png', 'Before the release (production): Select all - Location: All locations', [(970, 118, 215, 32, 'good', 'Chip before the release')]),
                 P(C, 'q4/C715584-1-cleared.png', 'Step 1: Clear selection - Location: No locations', [(890, 118, 230, 32, 'good', 'No locations')]),
                 P(C, 'q4/C715584-2-select-all.png', 'Step 2: Select all - every location ticked, Location: All locations', [(890, 118, 230, 32, 'good', 'All locations')]),
                 P(C, 'q4/C715584-4-typing.png', 'Steps 4-5: typing "Des" narrows the list; cursor stays in the box', [(700, 150, 330, 200, 'good', 'Narrowed list, cursor kept')]),
                 P(C, 'prod/15-C715584-6-900px.png', 'Before the release (production): the filter row at 900 px', [(30, 188, 840, 58, 'good', 'Row before the release')]),
                 P(C, 'q4/C715584-5-900px.png', 'Step 6: the filter row at 900 px - the same as before the release', [(30, 188, 840, 58, 'good', 'Same row')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, q4 + pr1 + pr8'}, 'results': R}, open(PP + 'RESULTS-q4-584.json', 'w'), indent=1); print(list(R))
