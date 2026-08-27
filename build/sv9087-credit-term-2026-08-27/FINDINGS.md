# SV-9087 — Credit-term case-sensitivity — QA IN PROGRESS

**Branch:** https://sv9087.qa.shopview.com  build `v26.35.4-b216483`  (API sv9087api)
**Seeding:** `POST /api/customers/change` with the full record + a mis-spelled `credit_term` (the dropdown only emits canonical values). Confirmed working: `Net 30` -> `NET 30`, `credit hold`, `  Credit Hold  `.

## Check C — Credit Hold gate (case-insensitive) : PASS (live)
Customer Aachester Partners, WO S9087-15xx. Seeded each spelling and viewed the WO:
| Seeded term | Credit Hold banner | Create Invoice | Tooltip |
|---|---|---|---|
| `CREDIT HOLD` (CSV spelling) | shows "This customer is on Credit Hold!" | disabled | "Cannot invoice this customer. Customer is on Credit Hold" |
| `credit hold` (lowercase) | shows | disabled | same |
| `  Credit Hold  ` (padded) | shows | disabled | same |
| `Credit Hold` (canonical control) | shows | disabled | same |
| `Net 30` (no-hold control) | NOT shown | (disabled only because WO incomplete) | none |
Before the fix, the non-canonical spellings would NOT gate (bypassable). Evidence: `C-banner-*.png`, `C-finance-*.png`.

## Still to run
- A: invoice-date change crash (reported bug) — needs an invoiceable WO (reverse+reinvoice, or complete a WO). Completion on this branch requires a Contact + tech story + assigned labor.
- D: Charge Account withheld from COD ; E: BE-computed due dates (+30) ; F: vendor due dates ; G: QuickBooks (qb1 env) ; H: regression.
