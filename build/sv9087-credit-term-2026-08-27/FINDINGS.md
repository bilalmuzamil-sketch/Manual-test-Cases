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

## NOT YET VERIFIED — need an invoiceable work order
The reported crash and its siblings need the editable **invoice date** field, which appears only on a completed/invoiced WO:
- **A (reported crash):** change the invoice date on a NET-30 (mis-spelled) customer's invoice — page must not blank, due date must move +30.
- **B:** impossible date (`13/01/2026`) rejected without clearing the dates.
- **D:** Charge Account withheld from a `cod` customer at the payment dialog.
- **E:** BE-computed invoice due date +30 (AR aging / statement agree).

**Blocker (documented):** producing an invoiceable WO on this branch requires a completed WO, and completion needs, together in one session: vehicle **mileage** (client-state only), a **tech story** (settable via `POST /api/work-orders/lines/change`), a selected **contact**, an assigned **lead technician / labor**, **no unfulfilled part requests** (use a labor-only canned line), then complete-line → complete-WO → create-invoice. In this unattended run the Quasar contact/lead-tech dropdowns did not open reliably via automation and complete-line failed silently. The paid-WO reverse path (the exact reported repro) is blocked earlier: reversing a paid invoice requires deleting its payment first, and that delete is not exposed on the finance tab / the API paths tried. These are automation-plumbing blockers, **not** evidence about the fix — and the same root-cause fix is already proven by C and F.

## Out of scope this run
- **G (QuickBooks):** must run on `qb1.qa.shopview.com` (QA 1 CA / QA 1 US). Only sv9087 cookies were provided — needs qb1 access. Terms persist and can't be deleted, so the existing Terms list must be noted first.
- **H (regression):** the `Net 30` no-hold control (in C) confirms canonical terms behave as before; a full end-to-end canonical invoice is part of A/E above.

## Recommendation
The fix is confirmed working on the two surfaces reachable without invoicing. To close A/B/D/E (the reported crash + guards): either give the go-ahead to spend the time driving the full completion workflow, point me at an existing completable/invoiceable WO, or reverse a paid invoice's payment so the reinvoice screen is reachable. G needs qb1 credentials.
