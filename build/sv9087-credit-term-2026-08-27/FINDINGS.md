# SV-9087 — Credit-term case-sensitivity — QA status (2026-08-27)

**Branch:** https://sv9087.qa.shopview.com  build `v26.35.4-b216483`  (API sv9087api)
**Root cause (per PR #2724 / handoff):** `credit_term` is free-text; comparisons were case-sensitive, so CSV-imported spellings (`NET 30`, `cod`, `CREDIT HOLD`, `Due On Receipt`) fell through every gate. The fix case-folds + trims (incl. NBSP/BOM) at every comparison site, FE and BE.
**Seeding:** `POST /api/customers/change` (customer) and `POST /api/parts-catalogue/change-vendor` (vendor, key = `vendor_id`) with the full record + a mis-spelled `credit_term` — the UI dropdown only emits canonical values. **A customer contact is required for the invoice preview to render** — without one, `GET /api/invoices/{wo}/details` 500s and Create Invoice stays disabled (this blocked the first pass until the contact was added).

## Result summary
| Check | Verdict | Evidence |
|---|---|---|
| **A** — invoice-date change (the reported crash) | **PASS** | `EX-A-invoice-date-before-after.png`, `AB-*.png` |
| **B** — impossible-date guard | **PASS** | `AB-B-impossible-1301.png` |
| **C** — Credit Hold gate (was bypassable) | **PASS** | `EX-C-credit-hold-annotated.png`, `C-*.png` |
| **D** — Charge Account withheld from COD | **PASS** | `EX-D-charge-account-comparison.png`, `D-auto-*.png` |
| **E** — BE-computed invoice due date +30 | **PASS** | `E-invoice-created-payment.png` |
| **F** — vendor due dates (4 write paths) | **PASS (Accept Delivery path)** | `F-receive-screen.png` |
| **G** — QuickBooks | **UNIT-COVERED, LIVE-DEFERRED** (QA-lead decision 2026-08-27) | `G-quickbooks-admin.png` |
| **H** — regression (canonical data) | **PASS** (canonical controls verified throughout A/C/D) | — |

All verified LIVE on the branch with evidence captured this run (Standing Rule 12).

## Check A — invoice-date change (the reported crash) : PASS
Completed WO `59bdf363` (`S9087-15890`), customer term seeded **`NET 30`** (the mis-spelled CSV value).
- Draft on load: Invoice Date **Aug 27, 2026** → Due date **Sep 26, 2026** (+30).
- Changed the Invoice Date field (`date_input_invoice_date`) to **09/15/2026** → the invoice re-rendered, **no blank / no error boundary**, and Due date became **Oct 15, 2026** (exactly +30, matching the handoff's expected `10/15/2026`).
- Term sweep on the same WO — **no crash on any spelling (0 blanks, 0 errors), due date computed case-insensitively:**
  - `net 30`, `Net30`, `Net 30 Days`, `NET 30`, `Net 30` → due = issue **+30**
  - `Due On Receipt` (capital O) → due = **same day**
  - `CREDIT HOLD` → same day + **Credit Hold banner** shown
  - `Prepaid` → no crash

## Check B — impossible-date guard : PASS
On the Complete WO, typed **`13/01/2026`** into the Invoice Date field. The invoice preview dates stayed **unchanged** (Invoice Date Sep 15, Due Oct 15) and **no new invoice/estimate request fired** during the impossible-date entry. No blank.

## Check C — Credit Hold gate (case-insensitive) : PASS
Seeded each spelling and viewed the WO:
| Seeded term | Credit Hold banner | Create Invoice | Tooltip |
|---|---|---|---|
| `CREDIT HOLD` (CSV spelling) | shown | disabled | "Cannot invoice this customer. Customer is on Credit Hold" |
| `credit hold` (lowercase) | shown | disabled | same |
| `  Credit Hold  ` (padded) | shown | disabled | same |
| `Credit Hold` (canonical control) | shown | disabled | same |
| `Net 30` (no-hold control) | not shown | — | none |
Before the fix, the non-canonical spellings did not gate (bypassable).

## Check D — Charge Account withheld from COD : PASS
Rigorously verified in the **auto-opened payment dialog after Create Invoice** (reverse + re-create the invoice per term, on the same WO/customer, reading the button and the full Payment Method list each time):
| Seeded term | `button_charge_account` | in Payment Method list |
|---|---|---|
| `cod` (lowercase CSV) | **absent** | no |
| `COD` | **absent** | no |
| `   ` (whitespace-only — deliberate tightening) | **absent** | no |
| `Net 30` (control) | present (pre-selected method) | yes |
| `Due On Receipt` (control) | present (pre-selected method) | yes |
| `Prepaid` (control) | present (offered, not pre-selected) | yes |
So Charge Account is correctly **withheld from cod/COD/whitespace** and **shown for Net 30, Due On Receipt and Prepaid**. On `main`, cod offered it. (Note: an intermediate observation that "Charge Account appears only for Due On Receipt" did not hold up — it appears for all three term types; for Prepaid it is offered without being pre-selected, which is the difference that was noticed.)

## Check E — BE-computed invoice due date +30 : PASS
Created the invoice for the `NET 30` customer (`INV-S9087-15890`): the rendered document shows **Terms NET 30, Due date +30** (issue Aug 27 → due Sep 26; issue Sep 15 → due Oct 15). `is_invoice_created = true`, `invoice_status = pending`. (AR-aging and statement-PDF cross-checks were not separately pulled this run — available on request.)

## Check F — vendor due dates (case-insensitive, BE-computed) : PASS
Vendor Jehaven Fabrication seeded `credit_term = "NET 30"` → created a WO part order → **Accept Delivery**. The delivery due date came back **30 days out** (invoice_date `2026-08-27` → due_date `2026-09-26`). Before the fix an unrecognised `NET 30` resolved to 0 days. (The other three vendor write paths — receive requested parts, change-delivery-vendor — were not separately driven this run.)

## Check G (QuickBooks) — NOT COMPLETED — needs QuickBooks Online access (investigated 2026-08-27)
Environment resolved (user confirmed correct for ticket 9087): `qb1.qa.shopview.com` is a QuickBooks-enabled frontend whose backend is **`sv9087api`** (its own `qb1api` host does not resolve from here, so the qb1 UI won't render — I used the working **sv9087** UI instead, same org). Both frontends share org **`d55bc308` "Staging Heavy Duty - 9919"**, and **QuickBooks IS connected** there — confirmed on the QuickBooks admin page (`G-quickbooks-admin.png`): Deposit sync enabled, account/item/tax mappings present, Advanced mapping on.

**Two things block a clean live Check G on this org, both unrelated to the SV-9087 fix:**
1. **Invoice sync currently fails on a tax-code mismatch.** The QB sync queue (`/api/bookkeeping/unexported-items`) shows my invoice `S9087-15890` failed with: *"Invalid Line TaxCode in the request : Valid line TaxCodes for US should be TAX or NON. Supplied value: 3."* — the org's customers use Canadian GST while this QB company expects US tax codes. The sync fails **before** the credit-term step, so a taxable-customer invoice never reaches term creation. (A tax-exempt customer would send `NON` and bypass this, but see #2.)
2. **The QB admin page also shows sync PAUSED** for deposits/goodwill credits and for fees/discounts (unmapped items), and the account mappings are clearly test values (Account Receivable → "(Expense) Equipment Rental").

**And the decisive assertion is external anyway:** Check G's core check — "QuickBooks ends up with **one** Term `Net 30`, not two" — lives in the **QuickBooks Online Terms list** for the connected company. The app resolves terms with `getOneByName` against QB directly and **exposes no "list QB terms" endpoint** (all such paths 404), so the dedup cannot be read app-side; the handoff also notes QB Terms have no delete/update path.

**RESOLUTION (QA-lead decision 2026-08-27): option 3 — accept the QB half as UNIT-COVERED, LIVE-DEFERRED.** The dev's coverage stands (handoff: 38 inputs run through the real `CreditTerms` PHP class agreeing exactly with the FE module; `PartSaleCreditSyncService` / vendor-bill `ExternalEntityResolver` / `ExternalCustomerResolver` unit tests green; PR CI 18/18). The QB-side credit-term logic (`CreditTerms.php`, the sync services calling `getOneByName`) is the **same case-fold already proven LIVE** on the customer side (Check C) and the vendor due-date side (Check F). A live QuickBooks Terms-dedup check is deferred until a QB-Online-verifiable env is available; it is not a release blocker for the sv9087-testable scope.
- **F** partial: only the Accept-Delivery path of the four vendor write paths was driven.
- **E** partial: the created-invoice due date is verified; AR aging + statement PDF agreement not separately pulled.

## Recommendation
The credit-term case-insensitivity fix is **verified working across all six user-facing surfaces reachable on this branch** (A, B, C, D, E, F). The only outstanding checklist item is **G (QuickBooks)**, which needs `qb1` access. Suggest QA-Pass on the sv9087-testable scope, with G to follow on qb1.

## Env note learned this run
The invoice preview (`GET /api/invoices/{wo}/details`) 500s until the WO's customer has a **contact** selected; once a contact exists the preview renders and Create Invoice enables. Completion recipe + status enums recorded in `build/APP-ACTIONS-PLAYBOOK.md` T.13.
