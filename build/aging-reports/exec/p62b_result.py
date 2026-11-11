"""p62b_result.py — 11 Nov 2026: C715633-C715638 (design: each report's load error message in place of the rows) from p62b - offline the six
reports show no message (same as C715442/C715443, held ticket draft 05); a server error shows it (control)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, n, t, b=()): dst = PP + 'pics/%s-%s' % (cid, n); ann(PP + 'p62b/' + n, dst, t, [], [], list(b)); return dst
SRC = 'PRD "A/R and A/P Report Sorting, Export and Location Filter" (Confluence 947650561, version 11, 5 Nov 2026), Story 8, S8-R6: "If a report fails to load, it shows \\"Something went wrong loading this report. Please try again.\\" in place of the rows, with the standard error message."'
ROWS = (278, 209, 1132, 600)
R = {}
for i, (cid, rep) in enumerate([('C715633', 'A/R Aging Summary'), ('C715634', 'A/R Aging Detail'), ('C715635', 'A/R Aging Collection'), ('C715636', 'A/P Aging Summary'), ('C715637', 'A/P Aging Detail'), ('C715638', 'A/P Unpaid Invoices Report')]):
    n = 3 * i + 1
    R[cid] = {'verdict': 'Failed', 'failed_steps': 'Failed at step 2: with the network off, changing the as-of date shows no "Something went wrong loading this report. Please try again." message.', 'bold_steps': [2], 'source': SRC.replace('\\"', '"'),
      'observed': ['Set up: open %s (as of today) and switch the network off.' % rep,
                   'Step 2: change the as-of date to yesterday (10).',
                   'You see: no message and no standard error message (watched 30 seconds); the earlier rows stay on screen.',
                   'The test says "Something went wrong loading this report. Please try again." shows in place of the rows, with the standard error message.',
                   'For the developer: when the report\'s load fails while the computer is online, the message and "Ooooops! An error occurred" do appear (second picture).'],
      'pictures': [P(cid, '%02d-%s-1-offline.png' % (n, cid), 'Step 2, offline: no message, the old rows stay', [ROWS + ('bad', 'No "Something went wrong loading this report" message')]),
                   P(cid, '%02d-%s-2-server-500.png' % (n + 1, cid), 'For comparison, online with a server error: the message shows in place of the rows')],
      'ticket': 'Ticket prepared and with the QA lead for approval (number added here when filed).', 'ticket_held': True,
      'todo': 'What needs to be done: nothing for the tester now; re-run this test once the ticket is fixed.'}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, p62b load error (offline)'}, 'results': R}, open(PP + 'RESULTS-p62b.json', 'w'), indent=1); print(list(R))
