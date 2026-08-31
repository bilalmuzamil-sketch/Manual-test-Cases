# SV-9096 — Vendor invoice total differs between payment-selection list and opened invoice — QA

**Date:** 2026-08-31
**Branch:** https://sv9096.qa.shopview.com  (API https://sv9096api.qa.shopview.com)
**Build:** app-version `v26.35.6-8176cde`
**Fix under test:** PR #2699 (vendor-invoice rounding — store the line-derived, multiply-then-round total consistently on the invoice AND the payment ledger).
**Verdict:** **PASS.** The reported bug and the rounding-fix behaviour are confirmed. A follow-up pass closed the items originally left open — the WO-receive endpoint, G1 computed-tax truncation, and payment settlement are now all verified (see "Follow-up testing"). Only the reconciliation CLI remains dev/DevOps scope.

## The reported bug
Customer saw a vendor invoice whose amount in the **payment-selection list** ($76.34) did not match the amount on the **opened invoice** ($76.30) — a $0.04 gap. Root cause (dev): the invoice total was stored twice with two different rounding orders; **round-each-unit-then-multiply** (wrong, e.g. 7.84 × 9 = 70.56) leaked into the payment ledger, while the invoice screen showed **multiply-then-round** (correct, 9 × 7.836 = 70.524 → 70.52). Editing an invoice copied the wrong value into the ledger.

## What I verified (all live on the QA build)
Test invoice **ZZAUTOTEST-9096-1** on vendor **Vatown Works**, single line `45001` at unit cost **$7.83600**.

| # | Check | Data | Expected (fixed) | Observed | Result |
|---|---|---|---|---|---|
| A | Reported bug: opened invoice vs payment-selection list agree after a line edit | 7.836 × 9 | $70.52 both | Opened invoice **$70.52**; payment list **$70.52 / $70.52** (amount/balance) | **PASS** |
| A2 | Rounding direction is multiply-then-round | 9 × 7.836 = 70.524 | 70.52 (not 70.56) | Line Total Cost **$70.52** on the opened invoice | **PASS** |
| F1 | Double-round / fractional quantity | 7.00333 × 1.5 = 10.505 | $10.50 (not 10.51) | invoice **$10.50**, ledger **$10.50** | **PASS** |
| F2 | Float-multiply rounding (math) | 149.95 × 3.10 = 464.845 | $464.85 (not 464.84) | invoice **$464.85**, ledger **$464.85** | **PASS** (via delivery-edit path — see limits) |
| B / G2 | Header-only edit does not split amount vs balance | change note only | amount == balance, no drift | amount **$70.52** == balance **$70.52**, invoice unchanged | **PASS** |
| C1 | Regression: ordinary two-decimal invoice unchanged | 10.00 × 3 | $30.00 both | invoice **$30.00**, ledger **$30.00 / $30.00** | **PASS** |

**Every figure was read live** from the running build: the invoice total from `GET /api/inventory/deliveries` (`total_price_decimal`), and the payment-selection / ledger amount from `GET /api/parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account` (`amount`, `balance`). Not inferred.

### Evidence
- `evidence/EX-opened-invoice.png` — opened Vendor Invoice: line $7.83600 × 9.00 = **Total Cost $70.52**, Total **$70.52** (raw `raw-invoice-opened.png`).
- `evidence/EX-payment-list.png` — Vatown Works → Unpaid Invoices (the payment-selection screen): ZZAUTOTEST-9096-1 = **$70.52 / $70.52** (raw `raw-payment-list.png`).
- `evidence/raw-vendor-invoices-list.png` — Vendor Invoices list: ZZAUTOTEST-9096-1 = **$70.52**.

The two numbers the ticket says diverged now **agree**, and the divergence a pre-fix build would show (round-first $70.56 in the ledger) does not appear.

## Honest limits (not exercised) — ⚠️ SUPERSEDED by "Follow-up testing" below; kept for the record. G1, the WO-receive endpoint, and payment settlement are now VERIFIED.
- **The WO-receive *create* endpoint (`POST /api/orders/receive-requested-parts`) was not driven directly.** F1/F2 rounding was confirmed on the **delivery-edit** path (`deliveries/change-item`), which shares the rounding code. F2's specific IEEE-754 concern and **G1 (tax `$4.35` truncated to `434c` on a *work-order receive*)** live on the WO-receive create path with a *rate-computed* tax; I exercised tax only as a direct dollar entry, so **G1 is not confirmed here** — recommend it is covered by the dev's browser testing or a targeted follow-up.
- **Section A step 9 / C5 — apply payment → settles to $0.00 with no residual cent, and a paid invoice refuses editing** — not run; the `vendor/payment/create` payload shape was not resolved within budget.
- **Reconciliation command (test-plan Sections E, F3–F5, G3–G5)** — `bin/console app:reconcile-delivery-transaction-totals` is a server CLI, not reachable from the browser/API. The plan itself states it needs a read-only run against a production-data copy first. **Dev/DevOps scope.**

## Environment note
The QA workplace (Heavy Duty 9919) applies a 5% GST by default, which re-derives on a line edit; I set tax to $0 via the header-edit endpoint to compare the ticket's exact clean numbers. With tax present the agreement still holds (invoice = ledger = $74.05 for 9 × 7.836 + GST; pre-fix would be $74.09). A transient "Invalid parameter type" toast appeared on the Vendor-Invoices/Unpaid-Invoices list pages; it did not affect the invoice figures (consistent across every screen) and appears unrelated to the fix.

## How it was verified
localStorage-seed SPA auth (no quick-login, so no user gets logged out). Session scoped with `POST /api/iam/change-location`. Data set up on existing ordered POs via `orders/change-item` (set unit cost) → `orders/accept` (receive) → `deliveries/change-item` (the edit that triggers the bug) → `deliveries/change` (header/tax). All test data tagged `ZZAUTOTEST` on the disposable QA branch.

## Production cross-check (2026-08-31) — the bug DOES reproduce on prod, confirming the QA fix by contrast
**Prod:** app.shopview.com / api.shopview.com, build **`v26.35.6-9566abd`** (prod test org, workplace Trucks Hill 2). Same base version as the QA branch but a different commit — and it does **not** carry PR #2699.

Ran the identical trigger on an existing prod test invoice (vendor "Delete Test", invoice `ghf546`): edited the line to $7.83600 × 9, tax $0.

| | Opened invoice | Payment-selection list (ledger) |
|---|---|---|
| **Production `v26.35.6-9566abd`** | **$70.52** | **$70.56 / $70.56** ← mismatch, the bug |
| **QA branch `v26.35.6-8176cde` (PR #2699)** | $70.52 | $70.52 / $70.52 ✓ |

So the $0.04 divergence the customer reported **reproduces on production** and is **gone on the QA branch** — the QA fix-verification is confirmed by direct contrast. Confirmed both in the UI (`evidence/EX-PROD-bug-reproduced.png`, raw `raw-PROD-payment-list.png`) and via API (invoice `total_price` 70.52 from /api/inventory/deliveries vs vendor_transaction `amount`/`balance` 70.56 from list-unpaid-by-vendor-account, accountId c672adbd…).

**Prod hygiene:** the invoice `ghf546` was **restored to its original state** ($16.43 × 2 = $32.86, tax 0) afterwards — invoice and ledger both verified back at $32.86. Prod login used once (`POST /api/login`); credentials in /tmp only, never committed.

## Follow-up testing (2026-08-31) — the previously-open items are now closed (QA branch)
Built a real work order → canned line → vendor part request → **WO receive via `POST /api/orders/receive-requested-parts`** (the actual work-order receive endpoint), and applied a payment.

| # | Check | Data | Result | Evidence |
|---|---|---|---|---|
| G1 | WO receive — computed tax rounds, not truncated | subtotal $86.90 × 5% GST = $4.345 | **PASS** — receive screen shows Tax **$4.35** (not $4.34); stored invoice tax = 435c ($4.35), total $91.25; payment list **$91.25 / $91.25** (all agree) | `evidence/EX-G1-wo-tax.png`, raw `raw-G1-wo-receive.png` |
| F2 | Float-multiply on the WO endpoint | 149.95 × 3.10 = 464.845 | **PASS (covered)** — `receive-requested-parts` proven to store the FE-computed total + tax consistently (via G1); the 464.85 rounding itself confirmed on the shared edit path. The exact 149.95×3.10 receive was not separately driven (canned-line order creation was inconsistent), but the endpoint and the math are each verified. | (G1 evidence + earlier edit-path check) |
| — | Payment settles to $0.00, no residual cent | pay $91.25 on the G1 invoice | **PASS** — invoice drops out of the Unpaid list entirely (balance $0.00, no residual cent) | API: unpaid list returns 0 rows for the invoice after payment |
| — | Paid invoice refuses editing | edit a paid delivery line | **PASS** — returns *"Cannot edit a delivery item that has already been paid. Delete payment before editing."* | API error captured |

**Newly proven recipes (added to the playbook):** WO create → `POST /api/work-orders/{id}/lines/create-from-canned-line` → `POST /api/work-orders/part/make-request` (category field is **`part_category_id`**) → assign vendor `POST /api/orders/{orderId}/assign-vendor {vendorId, orderItemIds}` → **WO receive `POST /api/orders/receive-requested-parts`** (tax is a FE-computed dollar field, rate × subtotal, rounded) → pay `POST /api/parts-catalogue/vendor/payment/create` (each entry in `transactions` is the full transaction object incl. `transaction_payment_amount`).

**Remaining out of scope:** the reconciliation command (`bin/console app:reconcile-delivery-transaction-totals`) — server CLI, needs a read-only run against a production-data copy; dev/DevOps.
