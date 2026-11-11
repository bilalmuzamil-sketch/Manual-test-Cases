"""s88_result.py — 11 Nov 2026: the three-location tests from exec/s88/<id>.json (s88 run 15:42). A = Staging Heavy Duty - 9919, B = Staging
Lethbridge - 4310, C = ZZAUTOTEST V1R-87 Location C (another session's location; long name). Builds RESULTS-s88-<part>.json for the ids given."""
import json, sys
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, n, t, b=()): dst = PP + 'pics/%s-%s' % (cid, n); ann(PP + 's88/' + n, dst, t, [], [], list(b)); return dst
CH = (278, 116, 1132, 36); HEAD = (278, 161, 1132, 48); ROWS = (278, 209, 1132, 140)
def j(c): return json.load(open(PP + 's88/%s.json' % c))
R = {}
d = j('C715387')
R['C715387'] = {'verdict': 'Passed', 'observed': ['A/R Aging Summary, as of today; the Location menu lists three locations: Staging Heavy Duty - 9919, Staging Lethbridge - 4310, ZZAUTOTEST V1R-87 Location C.',
    'Step 1: the chip reads "Location: All locations".', 'Step 2: Lethbridge unticked - "Location: 2 locations".',
    'Step 3: Heavy Duty unticked too - "Location: ZZAUTOTEST V1R-..." (location C\'s name shortened with "..." because it is long), as Sales By Customer\'s chip does with one location.',
    'Step 4: location C unticked - "Location: No locations".'],
    'pictures': [P('C715387', '01-C715387-1.png', 'Step 1: "Location: All locations"', [CH + ('good', 'All locations')]), P('C715387', '02-C715387-2.png', 'Step 2: "Location: 2 locations"', [CH + ('good', '2 locations')]),
                 P('C715387', '03-C715387-3.png', 'Step 3: one location - its name shortened with "..."', [CH + ('good', 'ZZAUTOTEST V1R-...')]), P('C715387', '04-C715387-4.png', 'Step 4: "Location: No locations"', [CH + ('good', 'No locations')])]}
d = j('C715394')
R['C715394'] = {'verdict': 'Passed', 'observed': ['A/P Aging Summary, three locations (A = Staging Heavy Duty - 9919, B = Staging Lethbridge - 4310, C = ZZAUTOTEST V1R-87 Location C).',
    'Step 1: location C unticked - the address carries two "locationIds=" entries with long codes (b3c8c820-… and f8a8b802-…), not names; the chip reads "Location: 2 locations".',
    'Steps 2-3: the address edited to one entry "locationIds=b3c8c820-…,f8a8b802-…" and opened with Enter - the report opens with those two ticked ("Location: 2 locations").',
    'Step 4: "Select all" - every location ticked and the address no longer lists locations (.../ap-aging-summary).',
    'Steps 5-6: A and B unticked - only C ticked ("Location: ZZAUTOTEST V1R-..."); the address holds one entry, C\'s code 19abb244-….',
    'Steps 7-8: the address edited to the three codes separated by commas and opened - "Location: All locations", and the address no longer lists locations.'],
    'pictures': [P('C715394', '05-C715394-1.png', 'Step 1: two locations ticked - two locationIds entries in the address'), P('C715394', '06-C715394-2-3-comma-link.png', 'Steps 2-3: one entry with two codes separated by a comma - 2 locations ticked', [CH + ('good', 'Location: 2 locations')]),
                 P('C715394', '07-C715394-6.png', 'Step 6: only location C ticked', [CH + ('good', 'ZZAUTOTEST V1R-...')]), P('C715394', '08-C715394-7-8-all-codes.png', 'Steps 7-8: all three codes in the link - "Location: All locations"', [CH + ('good', 'All locations')])]}
d = j('C715411')
R['C715411'] = {'verdict': 'Passed', 'observed': ['A/R Aging Collection, three locations in the Location menu.',
    'Step 1: "Location: All locations" - the Location column is shown (Date, Location, Transaction Type, ...).', 'Step 2: location C unticked - "Location: 2 locations"; the Location column is shown.',
    'Step 3: Lethbridge unticked too - "Location: Staging Heavy D..."; the Location column is hidden (Date, Transaction Type, ID, Due Date, Past Due, Amount, Open Balance).',
    'Step 4: "Clear selection" - "Location: No locations"; the Location column is hidden and the empty state shows: "No record matches these filters", "Try changing filters to widen your results.", "Clear all filters".'],
    'pictures': [P('C715411', '09-C715411-1.png', 'Step 1: all locations - Location column shown', [HEAD + ('good', 'Location column shown')]), P('C715411', '10-C715411-2.png', 'Step 2: two locations - Location column shown', [HEAD + ('good', 'Location column shown')]),
                 P('C715411', '11-C715411-3.png', 'Step 3: one location - Location column hidden', [HEAD + ('good', 'No Location column')]), P('C715411', '12-C715411-4.png', 'Step 4: no locations - empty state, no Location column')]}
d = j('C715412')
R['C715412'] = {'verdict': 'Passed', 'observed': ['A/R Aging Summary, Customer filter "#1 Diesel" (customer A, documents at Staging Heavy Duty only) and "ZZAUTOTEST LOC MIX" (customer B, documents at Heavy Duty and Lethbridge).',
    'Step 1: customer A\'s Location cell reads "Staging Heavy Duty - 9919"; customer B\'s reads "Multiple".',
    'Step 2: Lethbridge unticked (Heavy Duty and location C left, "Location: 2 locations") - the Location column stays, and customer B\'s cell now reads "Staging Heavy Duty - 9919"; its Total drops from $3,788.88 to $3,440.80 (only its Heavy Duty documents count).'],
    'pictures': [P('C715412', '13-C715412-1.png', 'Step 1: customer A one location, customer B "Multiple"', [ROWS + ('good', 'Staging Heavy Duty - 9919 / Multiple')]), P('C715412', '14-C715412-2.png', 'Step 2: Lethbridge unticked - customer B now shows Staging Heavy Duty - 9919', [ROWS + ('good', 'Multiple -> Staging Heavy Duty - 9919')])]}
ids = sys.argv[1:] or list(R); out = {k: R[k] for k in ids if k in R}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, s88 three locations'}, 'results': out}, open(PP + 'RESULTS-s88-a.json', 'w'), indent=1); print(list(out))
