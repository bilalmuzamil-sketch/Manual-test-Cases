"""g13_result.py - 12 Nov 2026, run 557, STAGING after the release (build v26.45.4-b8c04e2), browser in Asia/Karachi (Rule 125), the QA lead's
own session (no sign-in, no location change). C715471 (A/R) and C715472 (A/P), untouched reports as of 11/12/2026 compared document by document
with the copies saved from the old reports the same morning (before/*.tsv, session "5", facts only) - s1_compare.mjs + s1_classify.py.
What matched (kept here, NOT in the Failed comments, Rule 135): every customer (262) and vendor (471) with no new, gone or moved document has the
same amount in every column; every new document was made after the copy (customer/vendor absent before, or dated 12 Nov); no amount or balance
changed; 3 A/P bills gone (4Refuel E2E bills, no longer open); CM2-4541 and C-13911 (credits dated on the as-of date) moved to Current with
Past Due 0, as the tests expect; Location chip "Location: All locations" on all six.
What failed: the report counts a document's day in the SIGNED-IN location's time zone (Staging Heavy Duty - 9919 = Asia/Karachi) - 16,457 of
16,457 documents' Past Due match that - while it SHOWS Date/Due Date as the Greenwich day (s3_zone: S2-17154 Oct 12, CM3-4400 Sep 22,
CM1-4535 Oct 28, browser proved Asia/Karachi). So 18 A/R documents moved to a younger column and 1,255 A/P bills read a Past Due one day
different from before, each disagreeing with its own Due Date on screen (PRD v11 S1-R5a). 357 more A/P bills not yet due now read one day more
negative, which S1-R5a's own example requires (SV-11922 was that old fault) - not counted as failure.
Ticket held with the QA lead (Rules 113/140); owning story SV-11531 (Merged to Staging) / SV-11441 (Merged to Staging)."""
import json, sys
sys.path.insert(0, '/home/user/Manual-test-Cases/build/aging-reports/exec')
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/staging/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
import os; os.makedirs(PP + 'pics', exist_ok=True)
c = json.load(open(PP + 's1/classify.json')); cmp_ = json.load(open(PP + 's1/compare.json')); e = json.load(open(PP + 's2k/evidence.json')); s4 = json.load(open(PP + 's4/out.json')); z = json.load(open(PP + 's3/out.json'))
assert len(cmp_['ard']['bucket']) == 18 and c['ars']['untouched_diff'] == 0 and c['aps']['untouched_diff'] == 0 and z['browserZone'] == 'Asia/Karachi'
assert 'S3-17147 Tucson Truck Center Sep 12, 2026' in ' '.join(e['ev-tucson']['rows']) and 'P3-2458 E2E Credits Customer Nov 11, 2026' in ' '.join(e['ev-e2e']['rows'])
assert 'S3-17147 Sep 12, 2026 60' in s4['arc-tucson']['row'] and 'Nov 1, 2026 10' in s4['apd-softhip']['row'] and 'Nov 1, 2026 10' in s4['apu-softhip']['row']
assert c['apd_pastdue']['changed'] == 1613
RUN = 'Test run 557: https://shopview.testrail.io/index.php?/runs/view/557'
SET = 'Set up: staging (build v26.45.4-b8c04e2), Admin, browser on Pakistan time, signed in at "Staging Heavy Duty - 9919" (Pakistan time); each report opened untouched as of 11/12/2026 and compared row by row with the copy of the old reports saved the same morning, as of 11/12/2026.'
WHY = 'Why: the report counts each document\'s day in the signed-in location\'s time zone (Pakistan time) but shows Date and Due Date in Greenwich time, so for a document dated late in the Greenwich evening the column and Past Due are counted from the next day. Every document on the report follows that pattern; the old report used Greenwich time for both.'
SRC = ('PRD "A/R and A/P Report Sorting, Export and Location Filter" (Confluence 947650561, version 11, 5 Nov 2026), What changes for existing users: '
       '"an untouched report shows exactly today\'s organization-wide numbers (apart from the Totals rows noted above)"; S1-R5a: "A document is Current when its due date is on or after the as-of date. '
       'Its Past Due, where the report shows one, is the number of days from the due date to the as-of date"')
HELD = ('No ticket yet: the report is with the QA lead to decide (held). Owning story SV-11531 https://shopview.atlassian.net/browse/SV-11531 (Merged to Staging, read 12 Nov 2026) '
        'and SV-11441 https://shopview.atlassian.net/browse/SV-11441 (Merged to Staging, read 12 Nov 2026).')
TODO = 'What needs to be done: nothing for the tester now. When the ticket is decided and fixed, re-run this test on staging against the same saved copy (as of 11/12/2026).'
R = {'C715471': {'verdict': 'Failed', 'failed_steps': 'Failed at steps 1, 2 and 3: 18 documents sit in a different aging column than before the release (and show a Past Due one day less), and each one disagrees with its own Due Date on the screen.',
        'bold_steps': [1, 2, 3], 'source': SRC, 'ticket': HELD, 'ticket_held': True, 'todo': TODO,
        'observed': [SET,
          'Step 2: A/R Detail shows Tucson Truck Center\'s invoice S3-17147 with Due Date "Sep 12, 2026" under "31-60 days past due". Sep 12 to Nov 12 is 61 days, and before the release it was under "61-90 days past due".',
          'Step 2: E2E Credits Customer\'s invoice P3-2458 shows Due Date "Nov 11, 2026" under "Current". It is a day past due, and before the release it was under "1-30 days past due". 18 documents moved this way, all one column younger.',
          'Step 3: A/R Collection shows S3-17147 with Due Date "Sep 12, 2026" and Past Due 60 (61 by the date shown; 61 before the release).',
          'Step 1: so A/R Summary carries these amounts in a different column for 4 customers: E2E Credits Customer, E2E COD Customer, Desert Edge Truck Service & Repair and Tucson Truck Center.',
          WHY, RUN],
        'pictures': [P('C715471', 's2k/03-ev-tucson.png', 'Step 2: Due Date Sep 12 is 61 days before the as-of date, yet the invoice sits under 31-60', [(283, 120, 185, 28, 'good', 'As of 11/12/2026'), (278, 265, 1132, 48, 'bad', 'Column: 31-60'), (278, 507, 1132, 48, 'bad', 'S3-17147 due Sep 12 = 61 days')]),
                     P('C715471', 's2k/02-ev-e2e.png', 'Step 2: Due Date Nov 11 is before the as-of date, yet the invoice sits under Current', [(283, 120, 185, 28, 'good', 'As of 11/12/2026'), (278, e['ev-e2e']['box'][1], 1132, 48, 'bad', 'P3-2458 due Nov 11, in Current')]),
                     P('C715471', 's4/01-arc-tucson.png', 'Step 3: A/R Collection - Due Date Sep 12, Past Due 60 (should be 61)', [(283, 120, 185, 28, 'good', 'As of 11/12/2026'), (278, 507, 1132, 48, 'bad', 'Sep 12 -> Past Due 60')])]},
     'C715472': {'verdict': 'Failed', 'failed_steps': 'Failed at steps 2 and 3: 1,255 bills show a Past Due one day different from before the release, and each one disagrees with its own Due Date on the screen.',
        'bold_steps': [2, 3], 'source': SRC, 'ticket': HELD, 'ticket_held': True, 'todo': TODO,
        'observed': [SET,
          'Step 2: A/P Detail shows ZZSOFTHIP Traders\' bill ZZSH-O_TYPO with Due Date "Nov 1, 2026" and Past Due 10. Nov 1 to Nov 12 is 11 days, and before the release it read 11.',
          'Step 3: A/P Unpaid Invoices shows the same bill with Due Date "Nov 1, 2026" and Past Due 10.',
          'Step 2: 1,255 bills changed this way (no bill changed column). A further 357 bills not yet due now read one day further below zero (for example -9 instead of -8); the PRD asks for exactly that, so they are not part of this failure.',
          WHY, RUN],
        'pictures': [P('C715472', 's4/02-apd-softhip.png', 'Step 2: A/P Detail - Due Date Nov 1, Past Due 10 (Nov 1 to Nov 12 is 11 days)', [(283, 120, 185, 28, 'good', 'As of 11/12/2026'), (278, 401, 1132, 48, 'bad', 'Due Nov 1 -> Past Due 10')]),
                     P('C715472', 's4/03-apu-softhip.png', 'Step 3: A/P Unpaid Invoices - the same bill, Past Due 10', [(278, 257, 1132, 48, 'bad', 'Due Nov 1 -> Past Due 10')])]}}
json.dump({'pass_meta': {'note': '12 Nov 2026, run 557, g13: staging untouched A/R + A/P vs the copy saved before the release'}, 'results': R}, open(PP + 'RESULTS-g13.json', 'w'), indent=1); print(list(R))
