# PROPOSED correction for C26577 (NOT APPLIED — Automated case, awaiting QA-lead go-ahead)

Keeps the requirement identical (Expected = documents, Rule 57). Only fixes the *route* and the
*observation method* so the case is runnable by a manual tester AND automatable. Wording aligned to
the build glossary (Rule 102).

## Preconditions (proposed)
1. A test user whose role has the **"See Financial Data"** toggle turned **OFF**. Set it at
   **Settings → Roles & Permissions** (left admin sidebar, `verified_user` icon) → open the role →
   **"See Financial Data"** toggle off. (For an isolated check, a **Full View** role with only that
   toggle off is ideal — staging role "TEST" is already configured this way.)
2. A work order that has been **invoiced** (status Invoiced or Paid) so its **Invoice document exists**
   and carries pricing — part sell prices, labour, tax, and a total. (Example on staging: WO
   **S2-32273**.)

## Steps (proposed)
1. Sign in as the See-Financial-Data-OFF user.
2. Open the work order → open its **Invoice** (the "Print / view invoice" action), i.e. the document
   at `GET /api/invoices/preview?invoice_id=<the WO's invoice_id>&type=html` (the same content the
   `type=pdf` download renders).
3. Read the whole invoice document.
4. Look for any money — dollar amounts, labour rates, part sell prices, tax, totals, margins.

## Expected (proposed — requirement unchanged)
1. The invoice document renders with **no pricing of any kind**: no dollar amounts, no rate columns,
   no part sell prices, no tax, no totals.
2. A text search of the document returns **no monetary hits**.

Source: epic SV-7388 (Custom Roles and Permissions), story SV-7523 (See Financial Data — "OFF: all
financial data hidden across every page"), task SV-7484 (CRP-BE-09 seeFinancialData chokepoint —
Fin-OFF payloads carry no sellPrice/cost/margin keys, including the PDF paths). Last checked against
the staging build on 9/10/2026.

AUTOMATION: READY

## Automation notes (why the old wording would break)
- **Do NOT** drive the WO ⋮ → "Print Work Order" action: it is a client-side `window.print()` of a
  time/labour-hours printer-friendly sheet that shows **no money for anyone** → a meaningless assertion.
- **Do NOT** assert on the invoice **PDF's text**: the generated PDF has **no text layer**, so a text
  search returns 0 even for a Fin-ON user → a false pass. Assert on **`type=html`** (or the JSON
  payload's absence of price/cost/margin keys).
- Deterministic assertion: fetch the invoice `type=html` as the Fin-OFF user and assert the response
  contains **no `$[0-9]` / price / cost / margin** values; fetch it as a Fin-ON user in setup to assert
  money **is** present (guards against testing an empty invoice).
