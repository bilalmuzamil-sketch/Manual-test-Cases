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
