# Writes TICKET.html, CHRIS-COMMENT.html and evidence-chain.json for each question folder (drafts only; nothing is posted). No secrets.
import json, html
OUT = '/home/user/Manual-test-Cases/build/regression-wo-parts-invoices-2026-11/steps-1-2'
ENVL = 'Staging (app.staging.shopview.com), build v26.45.4-f3d3d2d, 16 Nov 2026, location "ZZAUTOTEST R365 Location C with a name longer than the chip", signed in as Admin. Browser and test machine set to the location\'s time zone (America/Edmonton).'
C = {
 'C1-deposit-number-two-formats': dict(
  title='Customers - one deposit shows two different numbers (DEP-4841 and DEP2-4841)',
  shows='A deposit gets a number when it is taken. The same deposit appears on two tabs of the customer page, with two different numbers.',
  example='Customer "ZZAUTOTEST RGWO Customer A", work order S2-40392, a $200.00 Cash deposit taken on Nov 16, 2026. On the Deposits tab it is <b>DEP-4841</b>. On the Payments tab, open the $0.00 payment (made when the invoice used the deposit): the same deposit is <b>DEP2-4841</b>.',
  where='Customers > the customer > Deposits tab (No. column) and Payments tab (open the $0.00 row). Work order and invoice numbers are not affected.',
  steps=['Open a work order at a location whose shop number is 2 (e.g. S2-40392).', 'Finance > Add Deposit: Cash, $200.00 > Record Deposit.', 'Approve and complete the line, then Finance > Create Invoice.', 'Go to Customers > the customer > Deposits: note the No.', 'Go to Payments > open the $0.00 payment: note the deposit No.'],
  actual='Deposits tab: DEP-4841. Payments tab: DEP2-4841.',
  expected='Not settled in writing - see the question. (If fixed: one number for the deposit on every screen.)',
  quote='Confluence 263094273 "Deposits for Work Orders" (last modified 16 Apr 2026), story SV-5675: "The deposit will get a "CP-" unique number same to a credit (e.g. CP3-1234)". SV-10762 (Done, Oct 2026): "Decide which format the deposit memo should use, and make every deposit surface consistent."',
  chain=[('old ticket', 'SV-5675 in Confluence 263094273 (16 Apr 2026): CP- numbers with the shop part, e.g. CP3-1234'), ('newer ticket', 'SV-10762 (Done, comment 77950, 6 Oct 2026): memo uses the on-screen WO number; "make every deposit surface consistent" - about the memo, not the deposit number'), ('code', 'ShopView/shopview develop: 54d4dd0465 "Numbering: make CreditMemo + Deposit per-organization"; 82cbf1ae27 (SV-10219, 19 Sep 2026) "every consumer that forgot to call it printed a number the customer could not match against their paperwork" - no commit found that decides the deposit number format per screen'), ('build', 'Deposits tab DEP-4841 vs Payments tab DEP2-4841, 16 Nov 2026 08:25-08:27 UTC, evidence/wo2/cust-deposits-all.png and cust-payments-expanded.png')],
  ask='Which number should the deposit show - DEP-4841 or DEP2-4841 - and should both tabs show the same one?',
  today='The Deposits tab shows DEP-4841 and the Payments tab shows DEP2-4841 for the same $200.00 deposit on S2-40392.',
  src='The Deposits PRD (16 Apr 2026, SV-5675) gives "CP3-1234" as the example; SV-10762 asked for every deposit surface to be consistent (for the memo).',
  rec='Fix it - show DEP2-4841 on both tabs, the same way work order and invoice numbers carry the location part.',
  ev=['evidence/wo2/cust-deposits-all.png', 'evidence/wo2/cust-payments-expanded.png', 'evidence/wo2/deposits-data.json', 'evidence/customer-payments-all.json']),
 'C2-wo-stays-in-progress-then-review': dict(
  title='Work Orders - with someone still clocked in, completing the last line leaves the work order In Progress, and it then goes to Review although Require Review is Off',
  shows='When every line of a work order is Complete and Require Review Before Completion is Off, the work order is meant to become Complete. Here it stays In Progress while a technician is clocked in, and after the clock-out it becomes Review.',
  example='Work order S2-40397, one line "ZZ C2 repro line" (approved). Admin pressed Start (clocked in), then pressed Complete on the line. Status badge: <b>In Progress</b>. Admin clocked out: status badge <b>Review</b>. Settings > Work Orders > Require Review Before Completion is <b>Off</b>. (Same on S2-40391.)',
  where='The status badge next to the work order number, top left of the work order page. Work orders where nobody is clocked in are not affected (S2-40392 went straight to Complete).',
  steps=['Settings > Work Orders: Require Review Before Completion Off.', 'Create a work order with one approved line.', 'On the line press Start.', 'Press Complete on the line: look at the status badge.', 'Clock out from the timer at the top: look at the status badge again.'],
  actual='In Progress after Complete; Review after the clock-out.',
  expected='Not settled in writing - see the question.',
  quote='Confluence 646021121 "Simple Mode - Streamlined Work Order Completion & Bulk Receiving" (16 Jul 2026), Story 16 R12: "When the WO\'s last remaining open line becomes resolved, the outcome depends on Require review: OFF -> the WO is auto-marked Complete (invoice-ready; no extra manual step) ... Applies regardless of how the last line resolves". R13: "A clock-out that finishes the last line routes the WO to Ready for Review even when review is OFF - left as-is on purpose". Confluence 771391574 "Simple Flow V2" (11 Sep 2026), Story 9: "A work order becomes complete because its lines are".',
  chain=[('PRD', 'Simple Mode 646021121 (16 Jul 2026) R12 and R13'), ('newer PRD', 'Simple Flow V2 771391574 (11 Sep 2026) Story 9 - no rule for an open clock'), ('code', 'api/src/VehicleService/WorkOrders/Domain/Service/WorkOrderStatusRefresher.php decides the status; no commit found that names a decision for "last line completed while someone is clocked in"'), ('build', 'S2-40391 (08:03-08:05 UTC) and S2-40397 (09:06-09:08 UTC) on 16 Nov 2026: In Progress after the last Complete, Review after clock-out; evidence/wo1/07..08, evidence/q-c2-clocked-in-completion/01..02')],
  ask='If someone is still clocked in when the last line is completed with the Complete button, should the work order become Complete straight away (Require Review is Off), or stay In Progress and go to Review when they clock out?',
  today='On S2-40397 the line was completed while the Admin was clocked in: the work order stayed In Progress, then went to Review on clock-out, with Require Review Off.',
  src='Simple Mode R12 says Complete whatever way the last line resolves; R13 sends a clock-out that finishes the last line to Review. Here the Complete button finished the line, not the clock-out, so neither sentence covers it.',
  rec='Fix it - follow R12: Complete as soon as the last line is completed with the Complete button.',
  ev=['evidence/q-c2-clocked-in-completion/01-last-line-completed-by-button-while-clocked-in.json', 'evidence/q-c2-clocked-in-completion/02-after-clock-out.json', 'evidence/wo1/07-both-lines-complete.json', 'evidence/wo1/08-clocked-out.json']),
 'C3-clock-out-asks-tech-story': dict(
  title='Clock Out - "Tech story is a required field" when Line Completed? is on, although Require Tech Story is Off',
  shows='Require Tech Story (Settings > Work Orders) decides whether a line needs a tech story before it can be completed. It is Off, yet the Clock Out window will not complete the line without one.',
  example='Work order S2-40396, line "ZZ A1 repro line". Admin pressed Start, then opened the timer at the top (Clock Out window), switched <b>Line Completed?</b> on, left "What Have You Been Doing On This Line?" empty and pressed <b>Clock Out</b>: red text <b>Tech story is a required field</b>, nothing saved. Settings > Work Orders > Require Tech Story: <b>Off</b>.',
  where='The Clock Out window opened from the running timer at the top of the screen. Completing a line with its own Complete button does not ask for a story.',
  steps=['Settings > Work Orders: Require Tech Story Off.', 'Open a work order with an approved line and press Start.', 'Click the running timer at the top.', 'Switch Line Completed? on, leave the story empty, press Clock Out.'],
  actual='"Tech story is a required field"; clock-out refused until a story is typed.',
  expected='Not settled in writing - see the question.',
  quote='Confluence 771391574 "Simple Flow V2" (11 Sep 2026), Story 5 (SV-9251): "The other line-level requirements stay: tech story, mileage, engine hours, each only when its setting is on" (entry points listed in the same story: "the line itself, the bulk action bar, the completion wizard and clock out"). Same page: "At clock out we will open current prod modal, when technician needs to toggle the Line completed" and "If a tech story is required and empty, it is required at clock out."',
  chain=[('PRD', 'Simple Mode 646021121 (16 Jul 2026) TS-R2: "When Require tech story is on, every line needs a tech story before completion" (silent on Off)'), ('newer PRD', 'Simple Flow V2 771391574 (11 Sep 2026) Story 5 - "each only when its setting is on" vs "we will open current prod modal" (two readings)'), ('code', 'app ClockOutDialog.vue: the story is required whenever Line Completed? is on (or for a department clock); the rule predates SV-8683 (seen in 000308fadb, 26 Mar 2026) and SV-8683 (ccb3ac7932, 27 Aug 2026) kept it - no later commit or ticket found that decides it'), ('build', 'S2-40396 09:05 UTC and S2-40391 08:04 UTC, 16 Nov 2026; evidence/q-c3-clock-out-story/03-line-completed-on-no-story-blocked.json, evidence/wo1/07b-clock-out-asks-tech-story.png')],
  ask='When Require Tech Story is Off, should Clock Out with "Line Completed?" switched on still demand a tech story?',
  today='On S2-40396 Clock Out with Line Completed? on and an empty story shows "Tech story is a required field" and will not clock out; Require Tech Story is Off.',
  src='Simple Flow V2 says the tech story is required "only when its setting is on" and lists clock out, but the same page also says the current clock-out window stays as it is, so it does not settle it.',
  rec='Fix it - follow the setting: no story required at Clock Out when Require Tech Story is Off.',
  ev=['evidence/q-c3-clock-out-story/03-line-completed-on-no-story-blocked.json', 'evidence/q-c3-clock-out-story/03b-repro-dialog.png', 'evidence/q-c3-clock-out-story/04-after-clock-out-with-story.json', 'evidence/wo1/07b-clock-out-asks-tech-story.png']),
}
CSS = '<style>body{font-family:Arial,sans-serif;max-width:900px;margin:24px auto;line-height:1.45;color:#222}h1{font-size:20px}h2{font-size:16px;margin-top:20px}img{max-width:100%;border:1px solid #ccc}.q{background:#f6f6f6;padding:8px 12px;border-left:4px solid #999}</style>'
for folder, c in C.items():
    t = [f'<!doctype html><html><head><meta charset="utf-8"><title>{html.escape(c["title"])}</title>{CSS}</head><body>',
         '<p><b>DRAFT - not filed.</b> Classified as a question for Chris (c), not a bug: the written sources do not settle it.</p>',
         f'<h1>{html.escape(c["title"])}</h1>', f'<p>{c["shows"]}</p>', f'<h2>Example</h2><p>{c["example"]}</p>',
         '<p><img src="annotated.png" alt="annotated screenshot"></p>', f'<h2>Where to look</h2><p>{html.escape(c["where"])}</p>',
         '<h2>Steps</h2><ol>' + ''.join(f'<li>{html.escape(s)}</li>' for s in c['steps']) + '</ol>',
         f'<p><b>Actual:</b> {html.escape(c["actual"])}<br><b>Expected:</b> {html.escape(c["expected"])}</p>',
         f'<h2>Source</h2><p class="q">{html.escape(c["quote"])}</p>', f'<h2>Where it was seen</h2><p>{html.escape(ENVL)}</p></body></html>']
    open(f'{OUT}/{folder}/TICKET.html', 'w').write('\n'.join(t))
    m = [f'<!doctype html><html><head><meta charset="utf-8"><title>Question for Chris</title>{CSS}</head><body>',
         '<p><b>DRAFT comment - not posted.</b> For the ticket this becomes, @mention Chris Ward.</p>',
         f'<p>@Chris Ward - found during the work order and invoice regression on staging (16 Nov 2026).</p>',
         f'<p><b>What happens today:</b> {html.escape(c["today"])}</p>', f'<p><b>What the sources say:</b> {html.escape(c["src"])}</p>',
         f'<p class="q">{html.escape(c["quote"])}</p>', '<p><img src="annotated.png" alt="annotated screenshot"></p>',
         f'<p><b>Question:</b> {html.escape(c["ask"])}</p>', '<p>Fix it, or leave it as it is?</p></body></html>']
    open(f'{OUT}/{folder}/CHRIS-COMMENT.html', 'w').write('\n'.join(m))
    json.dump({'classification': '(c) question for Chris', 'question': c['ask'], 'recommendation': c['rec'], 'evidence_chain': [{'step': s, 'detail': d} for s, d in c['chain']], 'evidence_files': c['ev'], 'environment': ENVL,
               'duplicate_search': 'Jira JQL (read-only, 16 Nov 2026 ~09:00 UTC): tax rounding / line-by-line; create invoice + approve/estimate/nothing; deposit + DEP/number - no open or closed ticket found for this exact behaviour (closest: SV-10762 deposit memo, SV-9867 deposit audit log, SV-11970 deposit date)'},
              open(f'{OUT}/{folder}/evidence.json', 'w'), indent=1)
print('ok')
