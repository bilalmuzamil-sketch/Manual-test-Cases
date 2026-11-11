import json, sys, re
S = '/tmp/claude-0/-home-user/ef40c1d4-3e84-5396-9a66-1a25d97a7768/scratchpad/'; sys.path.insert(0, S)
from spec import K
O = '/home/user/Manual-test-Cases/build/ar-ap-report-sorting/v1-regression/live-run-2026-11-11/testrail-results-v2/'
RES = {c['key']: c for c in json.load(open('/home/user/Manual-test-Cases/build/ar-ap-report-sorting/v1-regression/live-run-2026-11-11/results.json'))['cases']}
pics = json.load(open(S + 'pics.json')); pics.update(json.load(open(S + 'pics-pdf.json'))); pics.update(json.load(open(S + 'pics-fail.json')))
PRD = 'PRD "A/R and A/P Report Sorting, Export and Location Filter" (Confluence 947650561, version 11, 5 Nov 2026)'
T = lambda k: 'Ticket: https://shopview.atlassian.net/browse/%s (status: Open)' % k
TODO_LOSS = 'What needs to be done: nothing for the tester now; re-run this test once the Product Owner has answered question %d and the ticket is fixed or closed.'
F = {
 'V1R-07': dict(failed_steps='Failed at steps 4 and 5: a date after today cannot be picked - every day after 11/11/2026 is greyed out and the next-month arrow does nothing, so the chip stays on today.',
   bold_steps=[4, 5], tk='SV-12545', q=19,
   source='Production v26.45.3 (the behaviour before this release, which this test protects): on A/R Aging Summary the date menu lets you pick a date after today, for example 31 Dec 2026, and the report is worked out for that date. ' + PRD + ' does not ask for this change; PO question 19 is open.',
   observed=['Set up: A/R Aging Summary on the QA site, working at Staging Heavy Duty - 9919; today is 11/11/2026.',
     'Step 4: in the date menu every day after 11/11/2026 is greyed out and the next-month arrow does nothing, so 31 Dec 2026 (the last day of next month) cannot be reached.',
     'Step 5: the date chip stays on As of: 11/11/2026.',
     'The test says the last day of next month can be picked, the chip shows it, and the report is worked out for that date.',
     'On production (v26.45.3) the same steps pick 31 Dec 2026 and the report is recalculated: customer aqeel transport 56 shows Current $1,229.93 today, and on 12/31 that amount moves into the past-due columns.']),
 'V1R-08': dict(failed_steps='Failed at step 5: a saved link with ?asOfDate=2026-12-31 opens A/P Aging Summary on today, 11/11/2026, and the date is dropped from the address.',
   bold_steps=[5], tk='SV-12545', q=19,
   source='Production v26.45.3: a saved A/P Aging Summary link that carries ?asOfDate= with a date after today opens on that date (for 2026-12-31 the chip reads Date: 2026-12-31) and the figures are worked out for it. ' + PRD + ' does not ask for this change; PO question 19 is open.',
   observed=['Set up: A/P Aging Summary on the QA site; today is 11/11/2026; ?asOfDate=2026-12-31 added to the address.',
     'Step 5: the date chip reads As of: 11/11/2026 (today), and the address no longer carries the date.',
     'The test says the chip shows the last day of next month and the report is worked out for that date.',
     'On production (v26.45.3) the same link opens with Date: 2026-12-31 and figures different from today\'s.']),
 'V1R-35': dict(failed_steps='Failed at step 7: the A/R Aging Detail PDF leaves out the empty "61-90 days past due" bucket and its "Total for 61-90 days past due" $0.00 line; only the bucket that holds a document is printed.',
   bold_steps=[7], tk='SV-12546', q=20,
   source='Production v26.45.3: the A/R Aging Detail print shows every bucket, an empty one too, with its "Total for ... past due" line at $0.00 (seen on production as of 1 Jul 2025: "Total for 91 or more days past due $0.00"). ' + PRD + ' does not ask for this change; PO question 20 is open.',
   observed=['Set up: A/R Aging Detail narrowed to customer ZZAUTOTEST AR R13 Payment After; on screen the bucket "61-90 days past due (0)" shows Total $0.00 $0.00.',
     'Step 7: in the downloaded PDF there is no "61-90 days past due" heading and no "Total for 61-90 days past due" line; the only bucket printed is "31-60 days past due".',
     'The test says the PDF still prints the empty bucket\'s heading followed by "Total for 61-90 days past due" with $0.00, so all five buckets appear on paper.',
     'On production (v26.45.3) the print still shows an empty bucket with its $0.00 total line.']),
 'V1R-36': dict(failed_steps='Failed at step 7: the A/R Aging Collection PDF closes customer ZZAUTOTEST AR R36 Collect X with "Subtotal $110.00 $110.00" instead of a "Total for ZZAUTOTEST AR R36 Collect X" line.',
   bold_steps=[7], tk='SV-12547', q=21,
   source='Production v26.45.3: the A/R Aging Collection print closes each customer with "Total for <customer name>" (for example "Total for aqeel transport 56"). ' + PRD + ' does not ask for this change; PO question 21 is open.',
   observed=['Set up: A/R Aging Collection with only ZZAUTOTEST AR R36 Collect X picked in the Customer chip; Export menu, Download (PDF).',
     'Step 7: the PDF prints only that customer, but the line that closes it reads "Subtotal $110.00 $110.00"; there is no "Total for ZZAUTOTEST AR R36 Collect X" line.',
     'The test says the PDF prints a "Total for" line for the picked customer, with a Totals row.',
     'The amounts are right; only the "Total for <customer>" label is lost.',
     'On production (v26.45.3) the same print closes the picked customer with "Total for aqeel transport 56".']),
 'V1R-80': dict(failed_steps='Failed at step 9: in the PDF the credit memo\'s dates print as "Oct 26, 2026" (with a comma) instead of the required "Nov 04 2026" form ("Oct 26 2026").',
   bold_steps=[9], tk='SV-12544', q=None,
   source=PRD + ', S3-R7a: "The PDF uses the app-wide report PDF format, the same as Sales By Customer and Inventory Value: a negative amount prints in brackets with a minus sign, for example "(-$11,111.00)", and dates print as "Nov 04 2026"."',
   observed=['Set up: credit memo CM11315-4209 of ZZAUTOTEST AR R42 Memo Line (dated Oct 26, 2026, $-5.00) on A/R Aging Detail; Export menu, Download (PDF).',
     'Step 9: in the PDF its line reads Date "Oct 26, 2026" and Due Date "Oct 26, 2026" - with a comma. The amount reads "(-$5.00)", in brackets with a minus sign, as required.',
     'The test says the amount reads "(-$5.00)" and the date reads like "Nov 04 2026": three-letter month, two-digit day, year, no comma.',
     'The A/R Aging Collection PDF prints its dates the same way (for example "Oct 27, 2026"). This was first seen at 12:10 UTC on 11 November 2026.']),
}
HOLD = {'V1R-68', 'V1R-70'}
out = {}
for key, r in RES.items():
    if r['verdict'] == 'BLOCKED' or key in HOLD: continue
    cid = r['cid']
    if r['verdict'] == 'PASS':
        out[cid] = {'verdict': 'Passed', 'observed': K[key]['b'], 'pictures': pics[key], 'note': key}
    else:
        f = F[key]
        out[cid] = {'verdict': 'Failed', 'failed_steps': f['failed_steps'], 'bold_steps': f['bold_steps'], 'source': f['source'], 'observed': f['observed'],
                    'ticket': T(f['tk']), 'defects': [f['tk']], 'pictures': pics[key], 'note': key,
                    'todo': (TODO_LOSS % f['q']) if f['q'] else 'What needs to be done: nothing for the tester now; re-run this test once the ticket is fixed.'}
json.dump({'pass_meta': {'note': 'Run 557, 11 Nov 2026: results re-added in the format of the "Create defects from TestRail" session (Rule 117). V1R-68 C1079041 and V1R-70 C1079043 held: their live case text still says step 5 "it appears", which was not observed.'}, 'results': out},
          open(O + 'RESULTS.json', 'w'), indent=1, ensure_ascii=False)
# checker
bad = []
for cid, r in out.items():
    txt = json.dumps([r['observed'], r.get('failed_steps', ''), r.get('source', '')], ensure_ascii=False)
    for pat in ['OK ', 'NOT OK', 'keyboard_', 'arrow_', 'calendar_today', 'data-test-id', '_cell_', 'days_1_to_30', 'local_shipping', '{"']:
        if pat in txt: bad.append((cid, 'forbidden ' + pat))
    if not r['pictures']: bad.append((cid, 'no picture'))
    for p in r['pictures']:
        if not re.match(r'C\d+-', p.rsplit('/', 1)[1]) or p.rsplit('/', 1)[1].split('-')[0] != cid: bad.append((cid, 'picture name ' + p))
    if r['verdict'] == 'Failed' and ('browse/SV-' not in r['ticket'] or not r['defects']): bad.append((cid, 'ticket'))
    if len(r['pictures']) > 6: bad.append((cid, '>6 pictures'))
from collections import Counter
print('results', len(out), Counter(r['verdict'] for r in out.values()), 'pictures', sum(len(r['pictures']) for r in out.values()))
print('CHECK', 'PASS' if not bad else bad)
