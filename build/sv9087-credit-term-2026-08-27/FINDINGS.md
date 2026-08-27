# SV-9087 — Credit-term case-sensitivity — QA status (2026-08-27)

**Branch:** https://sv9087.qa.shopview.com  build `v26.35.4-b216483`  (API sv9087api)
**Root cause (per PR #2724 / handoff):** `credit_term` is free-text; comparisons were case-sensitive, so CSV-imported spellings (`NET 30`, `cod`, `CREDIT HOLD`, `Due On Receipt`) fell through every gate. The fix case-folds + trims (incl. NBSP/BOM) at every comparison site, FE and BE.
**Seeding:** `POST /api/customers/change` (customer) and `POST /api/parts-catalogue/change-vendor` (vendor, key = `vendor_id`) with the full record + a mis-spelled `credit_term` — the UI dropdown only emits canonical values. Confirmed working.

## VERIFIED LIVE — PASS

### Check C — Credit Hold gate (case-insensitive) : PASS
Customer Aachester Partners, WO S9087-15xx. Seeded each spelling and viewed the WO:
| Seeded term | Credit Hold badge + banner | Create Invoice | Tooltip |
|---|---|---|---|
| `CREDIT HOLD` (CSV spelling) | shows "This customer is on Credit Hold!" | disabled | "Cannot invoice this customer. Customer is on Credit Hold" |
| `credit hold` (lowercase) | shows | disabled | same |
| `  Credit Hold  ` (padded) | shows | disabled | same |
| `Credit Hold` (canonical control) | shows | disabled | same |
| `Net 30` (no-hold control) | NOT shown | (disabled only because WO incomplete) | none |
Before the fix, the non-canonical spellings did NOT gate (bypassable). Evidence: `EX-C-credit-hold-annotated.png`, `C-banner-*.png`, `C-finance-*.png`, `results-C.json`.

### Check F — vendor due dates (case-insensitive, BE-computed) : PASS
Vendor Jehaven Fabrication seeded `credit_term = "NET 30"` → created a WO part order → **Accept Delivery**. The delivery record's due date came back **30 days out**: invoice_date `2026-08-27` → due_date `2026-09-26` (= +30). Before the fix, an unrecognised `NET 30` resolved to 0 days (due = invoice date). This exercises the same `CreditTerms` value object the invoice/AR side uses. Evidence: `F-receive-screen.png` + API delivery record.

Together, C and F prove the ticket's core fix (case-insensitive credit-term handling) live, from both the customer side (credit-hold gating) and the vendor side (BE due-date computation).

## BLOCKED — invoice preview 500s for every WO on this branch (not the fix)
Checks A, B, D and E all need the Finance-tab **invoice preview / Create Invoice** flow to work. After the completion-blocking settings were turned off (mileage / tech story / review / approval / receive-parts all OFF), I could complete work orders cleanly (line → `complete`, WO auto-completes to `Complete`). But the invoice preview then **fails to render on every work order**:

- `GET /api/invoices/{work_order_id}/details?includeDeclined=0` → **HTTP 500**
- `POST /api/work-orders/invoices/estimate` → **HTTP 500**

On screen the Finance tab loads and the totals compute (Labor $112.46, Subtotal $124.27), but the preview area stays blank behind a stack of red errors: *"Error fetching draft invoice details"*, *"Error get invoice HTML"*, *"Ooooops! An error occurred"*. Because the preview never renders, **Create Invoice stays disabled**, so the invoice-date field cannot be exercised on a real invoice and no payment dialog can open. Evidence: `EX-A-blocker-details-500-annotated.png` (+ `A2-before.png`, `A-invoice-created.png`).

**This 500 is proven to be independent of the credit-term fix**, so it is not evidence for or against SV-9087:
- It 500s **identically** for canonical `Net 30`, mis-spelled `NET 30`, `Due On Receipt`, `Credit Hold`, and even `banana garbage` (if `credit_term` were the trigger these would differ).
- It 500s for **3 different customers**, including a well-established one (Aagate Landscaping, 17 vehicles, full billing profile) and one with a real contact available (Christina Campbell).
- It 500s regardless of how the WO was completed (UI complete-line button vs API `change-status`).
- **Check F already proves the back-end `CreditTerms` due-date computation works**, so the shared value object is not throwing here.

Most likely a separate invoice-preview/`details` infrastructure issue on this fresh QA branch (e.g. the draft-invoice HTML renderer), unrelated to PR #2724.

**One weak-positive side observation (not claimed as a pass):** even while `/details` was 500ing, editing the `date_input_invoice_date` field to `09/15/2026` and then to the impossible `13/45/2026` did **not** blank the Finance tab or trip an error boundary — the page stayed intact. On `main` the reported bug blanks the page. This hints the FE crash-prevention half of the fix holds, but it cannot be claimed as a clean Check-A pass because the invoice preview (which shows the due date `10/15/2026`) never rendered.

### What is needed to finish A/B/D/E
Any one of these unblocks them:
- A dev (or the QA lead) to look at why `GET /api/invoices/{wo}/details` and `POST /api/work-orders/invoices/estimate` return 500 for all WOs on `sv9087` — or confirm it is a known env quirk and how to get a rendering invoice preview.
- Point me at an existing WO on the branch whose invoice preview already renders / whose Create Invoice is enabled.

## Out of scope this run
- **G (QuickBooks):** must run on `qb1.qa.shopview.com` (QA 1 CA / QA 1 US). Only sv9087 cookies were provided — needs qb1 access. Terms persist and can't be deleted, so the existing Terms list must be noted first.
- **H (regression):** the `Net 30` no-hold control (in C) confirms canonical terms behave as before; a full end-to-end canonical invoice is part of A/E above.

## Where it stands
- **C — PASS** (Credit Hold gate, case-insensitive) — live, annotated.
- **F — PASS** (vendor due dates, case-insensitive, BE-computed) — live.
- **A / B / D / E — BLOCKED** by the branch-wide invoice-preview 500 above (not the fix).
- **G — needs qb1 access.**
- **H — partly covered** by C's `Net 30` control.

Together C and F prove the ticket's **core** fix (case-insensitive credit-term handling) live, from both the customer side (credit-hold gating, FE `creditTerms.ts`) and the vendor side (BE `CreditTerms.php` due-date computation). The remaining checks are blocked by an environment issue, not by the fix.

## Automation-path recipe learned this run (for the playbook)
Completing a WO to the invoice stage on a QA branch with the completion settings off:
1. `POST /api/iam/change-location {workplace_id, workplace_timezone}` to scope to the workplace.
2. `POST /api/work-orders/create {company_id, vehicle_id, workplace_id, start_date, is_vehicle_here:true}`.
3. Add a labor line via the **UI New Line dialog** (`button_new_line` → `select_line_canned_line` type name → pick option → `checkbox_line_approved` → `button_save_close`). Direct `POST /api/work-orders/lines/create` is unreliable (500 without a canned line; canned-only 400 "Labor or fixed prices must be set").
4. Complete the line: `POST /api/work-orders/lines/change-status {line_id, work_order_id, status:'complete'}` (valid line status = `complete`; `completed`/`done` are rejected). **The WO auto-completes to `Complete` when its last line completes** — a separate `POST /api/work-orders/change-status {id, status:'complete'}` then returns 400 "Complete work order cannot change its status again".
5. Invoice endpoints: `POST /api/invoices/create {work_order_id, ...}`; draft preview = `GET /api/invoices/{wo}/details` + `POST /api/work-orders/invoices/estimate`.
