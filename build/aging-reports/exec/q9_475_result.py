"""q9_475_result.py — 11 Nov 2026 20:15 UTC: C715475 (Inventory Value link, PDF and CSV work as before the release) - FAILED at step 2.
Before = production v26.45.3: Inventory Value PDF of one location (1,439 parts, prod/q3p) and of every location (2,856 parts, prod/q3p3, ~90 s)
download. After = QA: link + CSV fine (q3d, Lethbridge); the PDF fails for every selection over ~250 parts - export answers HTTP 500 "An error
occurred…" at ~31 s and the screen says "This report is too large to export…" (q6/q6b/q6c/q9: 3,627 · 3,089 · 2,896 · 2,071 · 1,464 · 1,194 ·
614 parts fail; 245 parts print in 16 s). Same signature as SV-12539 (A/P PDFs fail with 500 after 30-52 s, Open). q7/q8: every PDF that
printed on the site took under 30 s; A/P Detail at 1,784 rows also fails at 31 s. Ticket held: the QA lead decides new ticket vs SV-12539."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
q9 = json.load(open(PP + 'q9/out.json')); C = 'C715475'
assert q9['answer']['st'] == 500 and 'too large' in q9['msg'][0]
R = {C: {'verdict': 'Failed', 'failed_steps': 'Failed at step 2: "Download (PDF)" gives no PDF - after about 30 seconds the screen says "This report is too large to export. Narrow the date range or filters, then try again."', 'bold_steps': [2],
    'source': 'Test case step 2 (Inventory Value works as before the release): "The PDF downloads." Before the release (production v26.45.3-f5ba431) Inventory Value\'s PDF downloads for one location (1,439 parts) and for every location (2,856 parts).',
    'observed': [
    'Set up: Inventory Value with one location ticked ("Staging Lethbridge - 4310"), as of today; to see the size, the Category filter was used to make smaller lists.',
    'Do: ⋯ menu > "Download (PDF)".',
    'You see: no PDF; after about 30 seconds the message "This report is too large to export. Narrow the date range or filters, then try again."',
    'It fails for every list tried from 614 parts up (614, 1,194, 1,464, 2,071, 2,896, 3,089, 3,627); a list of 245 parts prints. Production printed 1,439 and 2,856 parts before the release.',
    'The link and the CSV work as before (the CSV of all 3,627 parts downloads in seconds).',
    'The same failure after about 30 seconds is open for the A/P reports as SV-12539.'],
    'ticket': 'Ticket prepared and with the QA lead for approval (number added here when filed). Same failure as https://shopview.atlassian.net/browse/SV-12539 (Open, read 11 Nov 2026 ~20:10 UTC) - the QA lead decides whether it goes there.',
    'todo': 'What needs to be done: nothing for the tester now; re-run this test once the ticket is fixed.', 'ticket_held': True,
    'pictures': [P(C, 'prod/q3p/C715475-iv-pdf-p1-01.png', 'Before the release (production): Inventory Value PDF for one location (1,439 parts) downloads', []),
                 P(C, 'q9/C715475-3-message.png', 'Step 2 on the new build: no PDF, "This report is too large to export" after about 30 seconds (614 parts)', [(940, 815, 400, 78, 'bad', 'No PDF - error message'), (482, 124, 262, 30, 'good', '614 parts listed')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, q3d + q6 + q6b + q6c + q9 + prod q3p/q3p3'}, 'results': R}, open(PP + 'RESULTS-q9-475.json', 'w'), indent=1); print(list(R))
