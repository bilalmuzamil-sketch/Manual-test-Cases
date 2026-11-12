"""g7_result.py — 12 Nov 2026 ~08:30 UTC, run 557, build v26.45.3-34788b2. The QA lead's answers of 12 Nov to three questions:
(1) "Please do" — make 9+ locations with open A/R documents for C715383 (q10: seven "ZZAUTOTEST Q10 Loc n" locations, one invoice each, A/R Summary
now lists 10 locations), and C797943 (8 vendors or fewer) / C715468 (2,000 customers) are out of scope for the QA site (my recommendation, accepted);
(2) "I will follow your recommendation" — C715477 uses the report's own link (preconditions rewritten in the TestRail editor, case-edits-1112; Expected
untouched) and is re-run (q11 QA, pr14 production before-release side)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
q10 = json.load(open(PP + 'q10/out.json')); q11 = json.load(open(PP + 'q11/out.json')); pr = json.load(open(PP + 'prod/pr14.json')); q12 = json.load(open(PP + 'q12/out.json'))
assert len(q10['arAfter']) == 10 and q10['boxFound'] == 1 and q10['s1']['inputs'][0]['ph'] == 'Search locations'
assert q11['hasLoc'] and 'This work order is in Staging Lethbridge - 4310' in q11['dialog2'] and 'Switch cancelled. Returning to work orders.' in ' '.join(q11['notes3']).replace('\n', ' ')
assert 'This work order is in Trucks Hill 2' in pr['dialog'] and 'Switch cancelled. Returning to work orders.' in ' '.join(pr['notes3'])
assert q12['menu']['inputs'][0] == 'Search vendors' and q12['menu']['items'] > 1000
DEC = 'QA lead\'s decision, 12 Nov 2026 (answer "1. Please do" to my recommendation): this test is out of scope on the QA site.'
R = {
 'C715383': {'verdict': 'Passed', 'observed': [
    'Set up: seven new locations ("ZZAUTOTEST Q10 Loc 1" to "Loc 7") were added, each with one open invoice dated today, so A/R Summary lists 10 locations on 11/12/2026.',
    'Step 1: the Location menu opens with all 10 locations ticked ("Select all", "10 selected") and a search box at the top reading "Search locations".',
    'Step 2: typing "Staging" (the first word of location A, "Staging Heavy Duty - 9919") narrows the list to "Staging Heavy Duty - 9919" and "Staging Lethbridge - 4310".'],
    'pictures': [P('C715383', 'q10/06-C715383-step1.png', 'Step 1: 10 locations, all ticked, search box "Search locations" at the top', [(901, 157, 258, 41, 'good', 'Search locations'), (893, 200, 274, 465, 'good', '10 selected, all ticked')]),
                 P('C715383', 'q10/07-C715383-step2.png', 'Step 2: "Staging" typed - only the two Staging locations are left', [(901, 157, 228, 41, 'good', 'Typed "Staging"'), (893, 255, 244, 80, 'good', 'Location A among them')])]},
 'C715477': {'verdict': 'Passed', 'observed': [
    'Set up as the rewritten test asks: at Staging Heavy Duty - 9919, the link of invoice S11315-17724 (made at Staging Lethbridge - 4310) copied from A/R Aging Detail; it ends with "?locationId=" and Lethbridge\'s code.',
    'Step 2: the existing "Switch location?" box shows: "This work order is in Staging Lethbridge - 4310. Switch your active location to view it?" with Cancel and "Switch Location".',
    'Step 3: Cancel closes it and Work Orders shows "Switch cancelled. Returning to work orders."',
    'Before the release (production, same link form, work order of Trucks Hill 2 pasted at SANKAN): the same box ("This work order is in Trucks Hill 2. …") and, after Cancel, the same message.'],
    'pictures': [P('C715477', 'q11/01-C715477-0-report-link.png', 'Set up: the invoice made at location B, whose link is copied from the report', [(278, 449, 1132, 48, 'good', 'Location B invoice'), (767, 462, 92, 19, 'good', 'Copy this link')]),
                 P('C715477', 'q11/03-C715477-2-prompt.png', 'Step 2: the existing switch-location box asks to switch to location B', [(416, 345, 608, 201, 'good', 'Same box as before the release')]),
                 P('C715477', 'q11/04-C715477-3-after-cancel.png', 'Step 3: after Cancel - Work Orders with its message', [(940, 832, 400, 58, 'good', 'Switch cancelled. Returning to work orders.')]),
                 P('C715477', 'prod/305-C715477-prod-2-pasted.png', 'Before the release (production): the same box for the same kind of link', [(416, 345, 608, 201, 'good', 'Production, before the release')])]},
 'C797943': {'verdict': 'Blocked', 'failed_steps': 'Blocked at step 1: the QA site cannot have 8 vendors or fewer - it has more than 1,100 vendors, so the Vendor menu always shows its search box.', 'bold_steps': [1],
    'source': DEC, 'todo': 'What needs to be done: nothing on the QA site. Run it only where an organization has 8 vendors or fewer, if the QA lead asks for it.',
    'observed': ['The QA organization has more than 1,100 vendors (A/P Summary lists 510 of them with open bills today); the Vendor menu opens with "Search vendors" at the top.',
                 'Bringing it down to 8 vendors would mean deleting over a thousand vendors that other tests use; the QA lead ruled the test out of scope for the QA site on 12 Nov 2026.'],
    'pictures': [P('C797943', 'q12/01-C797943-vendor-menu.png', 'The QA site: more than 1,100 vendors, so the Vendor menu always has its search box', [(482, 154, 352, 510, 'bad', 'Far more than 8 vendors'), (490, 160, 336, 40, 'bad', 'Search vendors')])]},
 'C715468': {'verdict': 'Blocked', 'failed_steps': 'Blocked at step 1: the QA site has no as-of date with exactly 2,000 or 2,001 customers - A/R Summary lists 155 rows today.', 'bold_steps': [1],
    'source': DEC, 'todo': 'What needs to be done: nothing on the QA site. The exact 2,000 / 2,001 boundary is checked by the developers (SV-11595), as the test itself says; the QA lead ruled it out of scope here.',
    'observed': ['A/R Summary lists 155 customer rows on 11/12/2026 - far from 2,000; making 1,850 more customers with open invoices takes about 15 seconds each (over 7 hours).',
                 'Even then the QA site\'s PDF service stops any PDF after 30 seconds (from about 800 rows), so a 2,000-row PDF could not be judged here (developer on https://shopview.atlassian.net/browse/SV-12539).'],
    'pictures': [P('C715468', 'q12/02-C715468-ar-summary.png', 'The QA site: A/R Summary lists 155 rows today, not 2,000', [(278, 160, 1132, 690, 'bad', '155 rows, far from 2,000')])]},
}
json.dump({'pass_meta': {'note': '12 Nov 2026, run 557, g7: QA lead answers 1 and 2'}, 'results': R}, open(PP + 'RESULTS-g7.json', 'w'), indent=1); print(list(R))
