# Rule-65 notice — Automated case C26577 was corrected (2026-09-10)

**C26577** — https://shopview.testrail.io/index.php?/cases/view/26577
"API - See Financial Data OFF: work order document response carries no pricing"
(epic SV-7388 · story SV-7523 · task SV-7484). `custom_atmstatus = 3` (Automated), `created_by = 3`,
`custom_automation_type = 1` (unchanged).

**Authorised:** the QA lead gave explicit go-ahead on 2026-09-10 to correct this case (Rule 71). This
case is and remains a **backend API test** (it checks the endpoint response, not a UI walk). Only the
title, preconditions, steps and expected changed; `atmstatus`, section and automation_type untouched.
Fields written through the TestRail UI editor → render `fr-view` (served-page scan clean); runnable-gate 1/1.

## Why it changed (build-verified live on staging app.staging.shopview.com, 2026-09-10)
The old steps told the test to hit "the Work Order's PDF download endpoint (PDF-controller /
LinesDetailProvider path). The exact URL is confirmed at build-verification." Confirmed on the build:
- The Work Order has **no server PDF download endpoint** — its "Print Work Order" action is a
  client-side browser print of a time-only printer-friendly sheet that carries no pricing for anyone.
- The money-bearing document render path is the **invoice/estimate document**:
  `GET /api/invoices/preview?invoice_id=<the WO's invoice_id>&type=pdf` (use `type=html` to inspect —
  the PDF has no text layer).

## Behaviour confirmed (proof)
Same paid work order, invoice document endpoint:
- See-Financial-Data-ON user: pricing present — e.g. $464.86, $513.67, **$539.35**.
- See-Financial-Data-OFF user: **no pricing at all.** ✅

## What the corrected API test now does
- Precondition: a Fin-OFF user (ideally a Full View role with only "See Financial Data" off, e.g.
  staging role "TEST"), a Fin-ON control user, and an **invoiced** work order.
- Step: call the document render endpoint as the Fin-OFF user (`/api/invoices/preview?...&type=pdf`,
  inspect via `type=html`), read the response, look for any pricing on every line and the totals; then
  repeat as the Fin-ON control user.
- Assert: Fin-OFF response has **no** sellPrice/cost/margin/rate/tax/total/money; Fin-ON response DOES
  (control guards against a false pass on an empty/zero document).

## Secondary finding (separate from this case)
The Work Order JSON payload (`/api/work-orders/view/<id>`) zeroes the totals for a Fin-OFF user **but
still returns one tax dollar amount** ($37.29). The invoice document render is clean. Flagged to the QA
lead as a possible separate defect.

Before/after snapshots: `build/custom-roles/build-verify-C26577-2026-09-10/evidence/c26577_{before,after}.json`.
