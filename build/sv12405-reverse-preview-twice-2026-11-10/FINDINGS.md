# SV-12405 — Finance tab: invoice preview drawn twice after Reverse (fix PR #4289)

Asked by the QA lead 10 Nov 2026. Mode: **API mode**, **no recording**, **no technical section** (his answers, 10 Nov).
Ticket: our own follow-up from SV-12351 (Bug, FE, Work Orders, TESTING QA, assignee Milomir Kotlajic, QA assignee empty, no Powertools plan, no comments, no QA Branch field).

## Fix and where it is deployed
- PR ShopView/shopview#4289 "[SV-12405] Render the invoice preview once while Finance loads" (open, Hotfix → main, head 88296c8). Changes `app/src/components/ts/billing/Invoice.vue` (+ unit tests): the first preview build on mount now holds the same latch as later refreshes (`buildInitialInvoiceDocument`).
- PR text says the double render is NOT caused by SV-12351 (also doubles on pre-SV-12351 code under that timing).
- **sv12405.qa.shopview.com** reports `v26.45.3-1c2403e` (develop's merge of PR #4284) — the PR commit is not in that sha, so the deployed bundle was read directly: `js/Invoice.Cqdb8uK8.js` contains `withTransactions:i>0` (the fix's `reads > 0`); production `js/Invoice.Dp1hvFCQ.js` (v26.45.3-fc08f23) has the old `withTransactions:!1`. ⇒ the fix IS deployed on sv12405 and NOT on production.

## Test data
- Branch: S2-16273 (Los Lunas Diesel & Fleet Repair, id c33308ec-695e-4676-a37c-21fa3f486b54), location Staging Heavy Duty - 9919.
- Production: S2-918 (Ahsan, id ee9adbb2-0df5-4e12-8771-506591445638), location Trucks Hill 2 — the work order used in the original report.

## Set-up notes found during the pass
- On BOTH builds (production v26.45.3-fc08f23 and sv12405), clicking **Create Invoice** opens the **New Customer Payment** window, and closing it with the **X** sends `POST /api/invoices/remove-customer-transaction` and the work order goes back to **Complete** (observed on S2-16273, S2-17113 and production S2-918). So the ticket's own step 3 ("close it with the X") no longer leaves an invoice to reverse. Same on production ⇒ not caused by this fix. For the counts below, the page is **reloaded** with the payment window open instead (the invoice stays; work order shows Invoiced), then ⋮ → Reverse → Reverse.
- Work orders finally used: the ticket's own — **S2-15597** (Los Lunas Diesel & Fleet Repair, 4b168567-78b5-42a1-9602-968ade61f480) on sv12405 and **S2-918** (Ahsan, ee9adbb2-0df5-4e12-8771-506591445638) on production.

## Normal tries (no tricks) — Create Invoice → reload → ⋮ → Reverse → Reverse, count preview requests in the 12 s after Reverse
| Build | Tries | Sent twice at once | Detail |
|---|---|---|---|
| sv12405 (fix) | 10 | **0** | every try: 1 request, max 1 in flight; status back to Complete; preview shows the invoice |
| production (no fix) | 10 | **2** (tries 4 and 6) | try 4: 183.31–183.68 and 183.41–183.81 s; try 6: 281.42–281.78 and 281.55–281.88 s |
Logs: `ev/branch-log.txt`, `ev/prod-log.txt`, `ev/*-run.out`; screenshots `ev/{branch,prod}-try*.png`.
| sv12405 (fix), second run | 10 | **0** | `ev/branch2-run.out` — every try 1 request, max 1 in flight |

**Total: sv12405 0 of 20 doubled; production 2 of 10.**

## Forced-timing variants (test-only holds in the browser, comparison only)
Held one of the three responses after Reverse to widen the race. Neither build sent two previews *at the same time* under any hold:
| Hold | Build | Requests | Max at once |
|---|---|---|---|
| lines response +3 s | sv12405 | 2, 2 | 1 (second one queued after the first — the trailing rebuild the fix describes) |
| lines response +3 s | production | 2 | 1 |
| preview response +2.4 s | sv12405 / production | 1, 1 / 1 | 1 |
| draft details | sv12405 / production | 1, 1 / 1 | 1 |
So the natural race is narrow; the normal-tries comparison above is the evidence.

## Regression (reg.mjs) — preview still refreshes once per change and shows the newest values
| Check | sv12405 (S2-15597, Complete) | production (S2-918, invoiced) |
|---|---|---|
| Open Finance | 1 request, max 1, preview shown | saved invoice shown (no estimate needed) |
| Customer PO edit | 1 request, preview shows ZZ12405-A1926 | preview shows ZZ12405-A1966 |
| Two quick PO edits | 2 requests, never 2 at once, preview shows the latest (C1707), older value not shown | shows latest (C1808) |
| Invoice date change | 1 request, preview "Invoice date: Nov 12, 2026" | skipped — invoiced WO has no date field |
| Page errors | none | none |
Logs `ev/branch-reg-run.out`, `ev/prod-reg-run.out`.

## Exhibit
`ev/exhibit/before-after-reverse-preview.png` (scripts/exhibit.py): production try 4 (two requests overlapping) vs sv12405 try 4 (one), screenshots + request bars from the measured times.

## Pre-post gate (10 Nov, before posting)
- Markers re-read: sv12405 v26.45.3-1c2403e, last-modified 17:19:08 GMT (same as the runs); production v26.45.3-fc08f23, 10:12:40 GMT (same). Fix code `withTransactions:i>0` still in sv12405 `js/Invoice.Cqdb8uK8.js`.
- Ticket re-read: TESTING QA, only comment 80706 (Milomir, QA env link). QA Branch field = sv12405. No Powertools plan.
- Handoff/checklist: none beyond the ticket; tested the ticket's own flow + SV-12351's "serialized/coalesced rebuilds" clause (quick PO edits) + date change.
- Not a fault, flagged as a note (same on production): closing the New Customer Payment window with X now cancels the new invoice (step 3 of the ticket's own steps) — reload used instead.
- Voice/format: green PASSED, no technical section, no recording (QA lead's answers).
