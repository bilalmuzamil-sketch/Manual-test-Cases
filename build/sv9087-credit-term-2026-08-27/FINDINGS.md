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
| **G** — QuickBooks | **NOT RUN** — needs `qb1.qa.shopview.com` access | — |
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

## Not run
- **G (QuickBooks):** must run on `qb1.qa.shopview.com` (QA 1 CA / QA 1 US). Only sv9087 cookies were provided — **needs qb1 access**. Terms persist and can't be deleted, so the existing Terms list must be noted first.
- **F** partial: only the Accept-Delivery path of the four vendor write paths was driven.
- **E** partial: the created-invoice due date is verified; AR aging + statement PDF agreement not separately pulled.

## Recommendation
The credit-term case-insensitivity fix is **verified working across all six user-facing surfaces reachable on this branch** (A, B, C, D, E, F). The only outstanding checklist item is **G (QuickBooks)**, which needs `qb1` access. Suggest QA-Pass on the sv9087-testable scope, with G to follow on qb1.

## Env note learned this run
The invoice preview (`GET /api/invoices/{wo}/details`) 500s until the WO's customer has a **contact** selected; once a contact exists the preview renders and Create Invoice enables. Completion recipe + status enums recorded in `build/APP-ACTIONS-PLAYBOOK.md` T.13.
