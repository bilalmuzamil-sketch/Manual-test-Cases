# Regression: work order lifecycle, parts lifecycle, invoice accuracy: intake (started 16 Nov 2026)

## The order (QA lead, 13 Nov 2026, verbatim)
> "I need to run the regression tests on workorder l;ifecycle and parts lifecycle and also ensure that the invoices being created by both parts lifecycle and work order are accurate and nothing is being missed. Can you do that ?"

## Answers so far
- **Build:** STAGING. QA lead, 16 Nov: *"Yes Staging if the QA environment is destroyed."* (sv11839 unreachable since 13 Nov.)
  - Staging app.staging.shopview.com build **v26.45.4-f3d3d2d** at 06:28 UTC 16 Nov; sign-in 200.
- **Still open:** the rest of the intake (scope, TestRail use, epic for bugs). See OUTSTANDING in chat.

## Candidate sources found (Confluence CQL title search + Jira, 16 Nov 2026 ~06:40 UTC). Versions to be read before use (Rule 31/59).

| Area | Source | Notes |
|---|---|---|
| Parts lifecycle (NEW feature) | Confluence 829227015 "Parts Lifecycle Update" (owner Chris Ward; status "Ready for dev - 2026-10-07"; last changed 13 Nov 2026) | Epic **SV-10647** "FounderMode Part Lifecycle", TESTING QA. 13 stories SV-10814…SV-10826 (Testing Stage / Ready for Production), verify tasks SV-11038…SV-11046 (Done), SV-11756 and SV-12010 (Board Backlog), SV-12606 (unit tests). A V2/upgrade of parts behaviour, so Rule 96 applies: derive the invariant set (what must NOT change in the WO/invoice/part flows). |
| Parts on WO lines | 782761986 "Inline Add and Edit Parts on Work Order Lines" (SV-9315) | |
| Part sale / receiving / WO completion | 646021121 "Simple Mode — Streamlined Work Order Completion & Bulk Receiving" (SV-7301; our completed Simple Flow project) | |
| Parts ordering | 54689805 "Parts Ordering" (Sep 2025) | old |
| Invoice creation | 989757441 "Create Invoice: closing the payment window" (SV-11987, "current behavior in production, checked against the code on 30 Oct 2026") | |
| Invoice/payment statuses | 767066118 "Invoice Status and Payment Status Reference" | |
| Invoice document | 755990532 "Invoice UI Refresh" (SV-8218); 845447188 "Invoice Design Selection" (SV-9892); 894009346 "Manual Invoice PDFs" (SV-10493) | |
| Fees, discounts, tax on invoices | our Fees & Discounts V1 project (SV-7387): `build/fees-discounts/` | completed 27 Jul |
| Voids | 827064321 "AccountingHub: Voided Invoice Defects" | accounting side |
| Work order lifecycle | 75071512 "Work Order Life Cycle - SLA" (excerpt empty) | **No WO-lifecycle PRD found yet.** Search Jira epics next; ask the QA lead / Chris for the WO lifecycle source |

## TestRail
- No TestRail credentials are in this container (/tmp/testrail missing).
- Existing WO / parts / invoice cases cannot be read until the QA lead supplies them, or says to work without TestRail.

## Scope change, QA lead 16 Nov 2026 (verbatim): "Please do not do anytning for parts lifecycle."
- **OUT of scope:** the parts lifecycle. That means the Part Lifecycle feature (SV-10647, Confluence 829227015) and any parts-lifecycle testing.
  - Nothing is to be read, tested, drafted or filed for it.
- **IN scope:** the work order lifecycle, and the accuracy of the invoices it creates.
- **Asked of the QA lead (open):** are part-sale invoices (over-the-counter part sales) also out?
  - Recommended: treat them as out until he says otherwise.
