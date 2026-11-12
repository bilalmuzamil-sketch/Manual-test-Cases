"""g10_result.py — 12 Nov 2026, run 557, build v26.45.3-34788b2. QA lead: "retest ALL the tests which is in blocked status and add a new comment".
Ten offline tests → PASSED: a load cut off as by a dropped connection shows the PRD message (g8: the report's requests failed with
ERR_INTERNET_DISCONNECTED, only the QA site's own redirect stopped); a server error shows it with the standard notice "Ooooops! An error occurred"
(rv1112/p62, p62b, g2, 11 Nov). With Wi-Fi off BEFORE the action the app's data library sends nothing and waits, then loads when the connection is
back - the same on production's current A/R Aging Summary and Inventory Value (prod/pr17), so not this release (Rule 140 check 4) and not a failed
load in the PRD's sense; the test's step 1 assumption is reported to the QA lead, Expected untouched (114).
Nine still BLOCKED, each retested today: PDFs (p48c 2,000 lines stops at 31.6 s, SV-12539 Open, developer 80903 "We won't change QA's setup");
C715475 needs a before-staging copy; C797943/C715468 out of scope (QA lead 12 Nov); overpaid invoice/bill and no-due-date documents still refused
(q13/q13b/q13c) and production refuses an overpayment too (prod/pr16)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
g = {i: json.load(open(PP + 'g8/%s.json' % i)) for i in ['C715442', 'C715443', 'C715633', 'C715634', 'C715635', 'C715636', 'C715637', 'C715638', 'C1062582', 'C1062583']}
REP = 'Something went wrong loading this report. Please try again.'
for i in ['C715442', 'C715443', 'C715633', 'C715634', 'C715635', 'C715636', 'C715637', 'C715638']: assert g[i]['msg2'] == REP, i
assert g['C1062582']['msg2'].startswith('Something went wrong loading this bucket') and g['C1062582']['msg5'] is None and g['C1062582']['lines5'] > 0
assert g['C1062583']['msg3'].startswith('Not every line loaded') and g['C1062583']['msg6'] is None and g['C1062583']['lines6'] == g['C1062583']['lines1']
pr17 = json.load(open(PP + 'prod/pr17.json')); assert pr17['ars']['notes1'] == [] and pr17['iv']['notes1'] == []
p48c = json.load(open(PP + 'p48c/out.json')); q13 = json.load(open(PP + 'q13/out.json')); pr16 = json.load(open(PP + 'prod/pr16.json'))
assert 'cannot be overpaid' in pr16['pay']['body']
WIFI = ('Note: with Wi-Fi switched off BEFORE the step, the report sends nothing until the connection is back, then loads by itself, and no error message shows. '
        'Production\'s current A/R Aging Summary and Inventory Value behave the same way today (no request, no error message; they show an empty "No record matches these filters" table, where the new reports keep the previous rows), '
        'so this is not a failed load and not new with this release. Reported to the QA lead.')
QA = 'On this QA site the error notice reads "QA env is sleeping" (the QA site\'s own notice for a lost connection); with a server error the standard notice "Ooooops! An error occurred" shows (11 Nov).'
MSGBOX = (560, 250, 570, 38, 'good', 'The PRD message, in place of the rows'); TOAST = (940, 832, 400, 58, 'good', 'Error notice (QA site wording)')
R = {}
for i, rep, back in [('C715442', 'A/R Aging Collection', True), ('C715443', 'A/P Aging Summary', True), ('C715633', 'A/R Aging Summary', False), ('C715634', 'A/R Aging Detail', False),
                     ('C715635', 'A/R Aging Collection', False), ('C715636', 'A/P Aging Summary', False), ('C715637', 'A/P Aging Detail', False), ('C715638', 'A/P Unpaid Invoices', False)]:
    o = g[i]; obs = ['Retest of the Blocked result, 12 Nov 2026, build v26.45.3-34788b2, %s.' % rep,
                     'Step 2: with the connection cut while the report loads the new as-of date (11/11/2026), the rows are replaced by "%s" and an error notice shows.' % REP]
    if back: obs.append('Step 4: back online, as-of date set back to today - the report loads normally again (%d rows), no message.' % o['rows4'])
    else: obs.append('Step 3: the connection is back.')
    obs += [QA, WIFI]
    pics = [P(i, 'g8/' + o['p2'].split('/')[-1], 'Step 2: the load fails - the PRD message shows in place of the rows', [MSGBOX, TOAST])]
    pics.append(P(i, 'g8/' + (o.get('p4') or o['p3']).split('/')[-1], 'Back online' + (' and back to today: the report loads normally' if back else ''), []))
    if i == 'C715633': pics.append(P(i, 'prod/' + pr17['ars']['p1'].split('/')[-1], 'Production today (before the release): Wi-Fi off, date changed - nothing is sent and no error message shows (an empty table)', [(1150, 85, 195, 30, 'good', 'Date changed while offline')]))
    R[i] = {'verdict': 'Passed', 'observed': obs, 'pictures': pics}
o = g['C1062582']; R['C1062582'] = {'verdict': 'Passed', 'observed': [
    'Retest of the Blocked result, 12 Nov 2026, build v26.45.3-34788b2, A/R Aging Detail.',
    'Step 2: with the connection cut while the "Current" bucket loads its lines, the bucket shows "Something went wrong loading this bucket. Collapse and expand it to try again." in place of its lines.',
    'Steps 4-5: back online, collapse and expand - its %d lines load and the message is gone.' % o['lines5'], QA, WIFI],
    'pictures': [P('C1062582', 'g8/' + o['p2'].split('/')[-1], 'Step 2: the bucket\'s lines fail to load - the PRD message in place of its lines', [(278, 449, 1132, 48, 'good', 'The PRD message, inside the bucket'), TOAST]),
                 P('C1062582', 'g8/' + o['p5'].split('/')[-1], 'Step 5: back online, expanded again - the lines load, no message', [])]}
o = g['C1062583']; R['C1062583'] = {'verdict': 'Passed', 'observed': [
    'Retest of the Blocked result, 12 Nov 2026, build v26.45.3-34788b2, A/P Aging Detail, bucket "91 or more days past due" (11,949 lines).',
    'Step 1: the bucket opens with its first 100 lines.',
    'Step 3: with the connection cut while scrolling loads the next lines, the 100 lines shown stay and under them the bucket shows "Not every line loaded. Collapse and expand this bucket to try again."',
    'Steps 5-6: back online, collapse and expand - the first 100 lines again, no message.', QA, WIFI],
    'pictures': [P('C1062583', 'g8/' + o['p3'].split('/')[-1], 'Step 3: later lines fail to load - the lines shown stay, the PRD message under them', [(278, 612, 1132, 48, 'good', 'The PRD message, under the lines'), TOAST]),
                 P('C1062583', 'g8/' + o['p6'].split('/')[-1], 'Step 6: expanded again online - first 100 lines, no message', [])]}
DEV = 'Developer on SV-12539 (Nemanja Djuric, 11 Nov 2026, comment 80903): "Even with all the CPU QA\'s server has, about 1,100 rows take 42 seconds, over QA\'s 30-second limit … We won\'t change QA\'s setup. Please re-test PDFs between 800 and 2,000 rows on staging once this work is there."'
TK = 'Follow the status here https://shopview.atlassian.net/browse/SV-12539 (Open, read 12 Nov 2026).'
NOT = 'No new ticket: '
R['C715469'] = {'verdict': 'Blocked', 'failed_steps': 'Blocked at step 4: the 2,000-line PDF cannot be judged on the QA site - its PDF service stops any PDF after 30 seconds.', 'bold_steps': [4], 'source': DEV, 'ticket': TK,
    'todo': 'What needs to be done: run on staging once the release is there (staging allows 120 seconds per PDF). ' + TK,
    'observed': ['Retest 12 Nov 2026 on build v26.45.3-34788b2: the same three vendors still add up to exactly 2,000 lines; the PDF stopped after %d seconds with "We couldn\'t export this report. Please try again." and no file.' % round(p48c['calls'][-1]['ms'] / 1000),
                 NOT + 'the ticket above already covers it, and the developer confirmed the QA site\'s 30-second PDF limit causes it (the report code does not); a second ticket would be a duplicate.'],
    'pictures': [P('C715469', 'p48c/13-pdf-032s.png', 'Retest 12 Nov: 2,000 lines, the PDF stops at the QA site\'s 30-second limit', [(940, 833, 400, 58, 'bad', 'Stopped by the QA site\'s 30-second limit')])]}
R['C715475'] = {'verdict': 'Blocked', 'failed_steps': 'Blocked at step 1: this test compares Inventory Value with a PDF and CSV saved on staging BEFORE the feature is deployed there; the feature is not on staging yet.', 'bold_steps': [1],
    'source': 'The test\'s own set-up: "before the feature was deployed on staging, you saved Inventory Value\'s PDF and CSV … and copied a link to Inventory Value with that filter."', 'ticket': TK,
    'todo': 'What needs to be done: on staging, just before the release is deployed there, save the PDF, CSV and link; after it is deployed, run the steps.',
    'observed': ['Retest 12 Nov 2026 on build v26.45.3-34788b2: the same Inventory Value list (614 parts, Staging Lethbridge - 4310, HD-Hose & Fittings) now prints its PDF in 23 seconds on the QA site; yesterday it stopped at 30 seconds.',
                 'The link and the CSV work as before the release (11 Nov).', NOT + 'nothing here differs from the sources; the earlier PDF stop was the QA site\'s 30-second limit (ticket above).'],
    'pictures': [P('C715475', 'q9/C715475-1-filtered.png', 'Retest 12 Nov: the 614-part list whose PDF now prints in 23 seconds on the QA site', [])]}
SC = 'QA lead\'s decision, 12 Nov 2026: out of scope on the QA site.'
R['C797943'] = {'verdict': 'Blocked', 'failed_steps': 'Blocked at step 1: the QA site has more than 1,100 vendors; the test needs 8 or fewer.', 'bold_steps': [1], 'source': SC,
    'todo': 'What needs to be done: nothing on the QA site (QA lead\'s decision).',
    'observed': ['Retest 12 Nov 2026: re-read today - the QA organization still has more than 1,100 vendors, and the Vendor menu shows "Search vendors", as the PRD asks above 8 vendors.', NOT + 'the product does what the PRD says for this many vendors; only the test\'s set-up cannot be made here.']}
R['C715468'] = {'verdict': 'Blocked', 'failed_steps': 'Blocked at step 1: the QA site has no as-of date with exactly 2,000 or 2,001 customers (155 rows today).', 'bold_steps': [1], 'source': SC,
    'todo': 'What needs to be done: nothing on the QA site (QA lead\'s decision); the developers checked this boundary (SV-11595, Done).',
    'observed': ['Retest 12 Nov 2026: A/R Summary lists 155 rows today; the QA site\'s 30-second PDF limit would also stop a 2,000-row PDF here.', NOT + 'nothing seen differs from the sources.']}
OV = 'Production today (before the release): a payment of $1,102.93 on its $1,082.93 invoice S2-1760 is refused with "Transaction cannot be overpaid." - the same as the new build.'
for i, step in [('C715462', 1), ('C1095432', 3)]:
    R[i] = {'verdict': 'Blocked', 'failed_steps': 'Blocked at step %d: an invoice paid more than its amount cannot be made - the app refuses the overpayment.' % step, 'bold_steps': [step], 'source': OV,
        'todo': 'What needs to be done: nothing to fix; this test can only run on an organization that already holds an overpaid invoice (the PRD says production has 16 such invoices, made in the past).',
        'observed': ['Retest 12 Nov 2026 on build v26.45.3-34788b2: a new $100.00 invoice (S11315-17913, customer ZZX Overpaid Q13); the app\'s payment of $120.00 is refused with "Transaction cannot be overpaid." and the invoice stays $100.00 open.',
                     OV, NOT + 'refusing an overpayment is how payments already work on production; the PRD only describes how the report treats overpaid invoices that already exist, it does not ask that new ones can be made.']}
R['C1078998'] = {'verdict': 'Blocked', 'failed_steps': 'Blocked at step 4: an invoice with no due date cannot be made - the app always stores one from the customer\'s credit term.', 'bold_steps': [4],
    'source': 'Retest 12 Nov 2026: the app stores a due date on every new invoice.', 'todo': 'What needs to be done: nothing to fix; this test can only run where an invoice without a due date already exists.',
    'observed': ['Retest 12 Nov 2026 on build v26.45.3-34788b2: a Net 30 customer (ZZR No Due Date Q13) and an invoice dated 40 days ago (S11315-17912): the app stored the due date Nov 1, 2026 at once.', NOT + 'the PRD says how the report ages an invoice that has no due date; it does not ask that such invoices can be made.']}
R['C1078999'] = {'verdict': 'Blocked', 'failed_steps': 'Blocked at step 4: a bill with no due date cannot be made - a vendor with an empty credit term gets the bill date as due date, and a missing term is refused.', 'bold_steps': [4],
    'source': 'Retest 12 Nov 2026: every new bill gets a due date.', 'todo': 'What needs to be done: nothing to fix; this test can only run where a bill without a due date already exists.',
    'observed': ['Retest 12 Nov 2026 on build v26.45.3-34788b2: vendor "ZZRV No Due Date Q13c E" with an empty credit term; its bill ZZRV-NODUE-Q13-3053E dated Oct 20 was stored with due date Oct 20 and shows 22 days past due.',
                 'A vendor with no credit term at all is refused: "credit_term: Missing required parameter".', NOT + 'the PRD describes how the report treats such bills; it does not ask that they can be made.']}
R['C1079000'] = {'verdict': 'Blocked', 'failed_steps': 'Blocked at step 4: a $100.00 bill cannot be paid $110.00 - the app refuses to overpay a vendor bill.', 'bold_steps': [4],
    'source': 'Retest 12 Nov 2026: the app refuses: "Vendor transaction cannot be overpaid."', 'todo': 'What needs to be done: nothing to fix; this test can only run where an overpaid bill already exists.',
    'observed': ['Retest 12 Nov 2026 on build v26.45.3-34788b2: vendor "ZZRV Overpaid Q13b" with a $100.00 bill; paying $110.00 is refused with "Vendor transaction cannot be overpaid."', 'Overpaying a customer invoice is refused on production the same way (12 Nov).',
                 NOT + 'the PRD describes how the report lists an overpaid bill; it does not ask that one can be made.']}

# pictures for the Blocked ones (q12 this morning; q14 screen pictures of the q13 refusals, 12 Nov)
R['C797943']['pictures'] = [PP + 'pics/C797943-q12-01-C797943-vendor-menu.png']
R['C715468']['pictures'] = [PP + 'pics/C715468-q12-02-C715468-ar-summary.png']
pi = P('C715462', 'q14/03-C715462-overpay-invoice-typed.png', 'Retest 12 Nov: paying $120.00 on the $100.00 invoice is refused on screen', [(1102, 403, 184, 60, 'bad', 'Payment cannot be higher than 100'), (977, 583, 152, 36, 'bad', 'Make Payment stays disabled')])
R['C715462']['pictures'] = [pi]; R['C1095432']['pictures'] = [P('C1095432', 'q14/03-C715462-overpay-invoice-typed.png', 'Retest 12 Nov: paying $120.00 on the $100.00 invoice is refused on screen', [(1102, 403, 184, 60, 'bad', 'Payment cannot be higher than 100'), (977, 583, 152, 36, 'bad', 'Make Payment stays disabled')])]
R['C1078998']['pictures'] = [P('C1078998', 'q14/01-C1078998-invoice-due-date.png', 'Retest 12 Nov: the new Net 30 invoice got a due date at once (Nov 1, 2026)', [(278, 401, 1132, 48, 'bad', 'Due date stored: Nov 1, 2026')])]
R['C1078999']['pictures'] = [P('C1078999', 'q14/02-C1078999-bill-due-date.png', 'Retest 12 Nov: the bill of a vendor with an empty credit term got its bill date as due date', [(278, 401, 1132, 48, 'bad', 'Due date = bill date, Oct 20, 2026')])]
R['C1079000']['pictures'] = [P('C1079000', 'q14/04-C1079000-overpay-bill-typed.png', 'Retest 12 Nov: paying $110.00 on the $100.00 bill is refused on screen', [(1102, 403, 184, 60, 'bad', 'Payment cannot be higher than 100'), (1151, 583, 152, 36, 'bad', 'Make Payment stays disabled')])]
R['C1079000']['observed'][0] = R['C1079000']['observed'][0] + ' On the vendor\'s Unpaid Invoices tab, typing 110.00 shows "Payment cannot be higher than 100" and Make Payment stays disabled.'
for i in ('C715462', 'C1095432'): R[i]['observed'][0] += ' On screen (its work order\'s Finance page, New Payment), typing 120.00 shows "Payment cannot be higher than 100" and Make Payment stays disabled.'
json.dump({'pass_meta': {'note': '12 Nov 2026, run 557, g10: retest of every Blocked test'}, 'results': R}, open(PP + 'RESULTS-g10.json', 'w'), indent=1); print(len(R), sorted(R))
