# QA Handoff — Auto Generated (from diff)

**Branch:** SV-12203-credit-apply-qb-balance-guard (PR #4186)
**Base:** main (bugfix release)
**Scope:** BE
**Files changed:** 6 (BE: 6, FE: 0)
**Generated:** 2026-11-06

---

## What Changed (plain English)
- When a credit is applied to invoices in ShopView, ShopView sends QuickBooks a $0 "apply credit" payment. Before sending it, ShopView now checks what is left in QuickBooks on the credit memo and the invoice.
- If QuickBooks has less left than ShopView is applying (the credit was already used in QuickBooks, or the invoice was already paid there), nothing is sent. QB Unexported shows one clear message with the amounts, instead of QuickBooks' error *"Business Validation Error: Enter a transaction amount to continue."*
- Normal credit applies (both sides still open in QuickBooks) post to QuickBooks exactly as before.

## Where This Applies

### Backend
- **Screens that trigger it:** Customer → Invoices tab → **New payment** (when a credit is ticked), and **Reports → QB Unexported → Export** on an applied-credit row.
- **Background jobs:** QuickBooks "apply credit" sync only.
- **Data/DB:** no schema change. Only the QB Unexported row text changes for this case.
- **Permissions:** none changed.
- **Config:** none.

## Test Setup (do once)

Use a QA location that is connected to **QuickBooks Online (sandbox)**.

**In QuickBooks Online:**
1. **Settings (gear) → Account and settings → Advanced → Automation**. Set **"Automatically apply credits"** and **"Automatically apply payments"** to **Off**. Save. (If either is On, ShopView shows a different, existing message: *"QuickBooks is set to automatically apply credits and payments…"*. That is expected and not this ticket.)

**In ShopView:**
2. Pick (or create) a test customer, e.g. **"QA Credit Apply Customer"**.
3. Create **4 invoices** for this customer and let them sync to QuickBooks (each about $100.00). Call them **Invoice A, B, C and D** below. Note each invoice number.
4. On the customer → **Invoices** tab, click **New credit** and create **4 credits of $10.00** each. Call them **Credit 1, 2, 3 and 4**. Note each credit number.
5. In QuickBooks, open the customer and check that all 4 invoices and all 4 credit memos are there, with credits showing **Unapplied**.

> Use your own new invoice/credit numbers for each run. Do not reuse numbers from other test runs.

**How to apply a credit in ShopView (used below):** Customer → **Invoices** tab → **New payment** → set Payment date to today, pick any **Payment method**, enter a new **Reference number** → tick the **Credit** row and set **10.00** → tick the target invoice and set its payment to **10.00** → bottom total **Payment amount $0.00** → **Make payment**.

**How to use up a credit in QuickBooks (used below):** QuickBooks → customer page → **New transaction → Payment** → tick an invoice and set its payment to **10.00** → in **Credits**, tick the credit and set **10.00** → **Amount received $0.00** → **Save and close**. The credit now shows **Applied**.

## QA Checklist (do these)

### 1. Credit already used in QuickBooks (invoice still open)
- [ ] In QuickBooks, use up **Credit 1** against **Invoice D** (see "How to use up a credit"). Credit 1 shows **Applied**.
- [ ] In ShopView, apply **Credit 1 ($10.00)** to **Invoice A**. The payment saves.
- [ ] Go to **Reports → QB Unexported**. A row for the customer shows: *"Credit {Credit 1} has $0.00 left in QuickBooks but this payment applies $10.00 (it may have been applied to another invoice there), so it can't be applied here. Fix it in QuickBooks and export again, or click Mark as Exported if QuickBooks is correct."*
- [ ] In QuickBooks, **no** new $0 payment with memo *"Customer Credit Applied: {Credit 1}"* exists, and Invoice A's balance has not changed.
- [ ] Click **Export** on the row. The same message comes back, and there is still only **one** open row for this payment.

### 2. Credit used AND the same invoice paid in QuickBooks (the customer's case)
- [ ] In QuickBooks, use up **Credit 2** against **Invoice B**. Then receive a second payment in QuickBooks for the **rest of Invoice B** (cash), so Invoice B shows **Paid**.
- [ ] In ShopView, apply **Credit 2 ($10.00)** to **Invoice B** (ShopView still shows Invoice B as open).
- [ ] **QB Unexported** shows: *"Credit {Credit 2} has $0.00 left in QuickBooks but this payment applies $10.00, and invoice {Invoice B} has $0.00 open in QuickBooks but this credit applies $10.00. The credit may already be applied to this invoice there, or the invoice total in QuickBooks may be lower than in ShopView (check the tax mapping), so it can't be synced. Fix it in QuickBooks and export again, or click Mark as Exported if QuickBooks is correct."*
- [ ] The old QuickBooks error *"Enter a transaction amount to continue"* does **not** appear.
- [ ] Click **Mark as Exported** → confirm. The row disappears from QB Unexported, and nothing new is created in QuickBooks.

### 3. Invoice already paid in QuickBooks (credit still open)
- [ ] In QuickBooks, receive a payment for **Invoice C** in full (cash), so Invoice C shows **Paid**. Leave **Credit 3** unapplied.
- [ ] In ShopView, apply **Credit 3 ($10.00)** to **Invoice C**.
- [ ] **QB Unexported** shows: *"Invoice {Invoice C} has $0.00 open in QuickBooks but this credit applies $10.00. It may already be paid there, or the invoice total in QuickBooks may be lower than in ShopView (check the tax mapping), so credit {Credit 3} can't be applied to it. Fix it in QuickBooks and export again, or click Mark as Exported if QuickBooks is correct."*
- [ ] In QuickBooks, Credit 3 is still **Unapplied**.

### 4. Fix in QuickBooks, then Export (row clears)
- [ ] Take the row from **Scenario 1**. In QuickBooks, **delete** the $0 payment you made in Scenario 1 that used up Credit 1, so Credit 1 is **Unapplied** again.
- [ ] Back in **QB Unexported**, click **Export** on the Scenario 1 row.
- [ ] The row disappears. In QuickBooks, a new $0 payment *"Customer Credit Applied: {Credit 1}"* exists, Credit 1 shows **Applied**, and Invoice A is $10.00 lower.

### 5. Normal credit apply still works (regression)
- [ ] With **Credit 4** and an invoice that are both open in QuickBooks (e.g. Invoice A or a new invoice), apply **Credit 4 ($10.00)** in ShopView. Do not touch QuickBooks first.
- [ ] **No** new row appears in QB Unexported.
- [ ] In QuickBooks: a new $0 payment *"Customer Credit Applied: {Credit 4}"*, Credit 4 shows **Applied**, and the invoice is $10.00 lower.

### 6. Mixed payment: cash + credit
- [ ] Create a new $10.00 credit (**Credit 5**) and use it up in QuickBooks first (as in Scenario 1).
- [ ] In ShopView, **New payment** on two open invoices: pay **$20.00 cash** on one invoice, and apply **Credit 5 ($10.00)** to the other. Payment amount shows **$20.00** → **Make payment**.
- [ ] In QuickBooks, the **$20.00 cash payment is created** on the first invoice.
- [ ] **QB Unexported** shows only the credit message for Credit 5 (Scenario 1 wording). There is no error for the cash part.

### 7. Two credits on one payment, only one used in QuickBooks
- [ ] Create two new $10.00 credits (**Credit 6**, **Credit 7**). In QuickBooks use up **only Credit 6**.
- [ ] In ShopView, apply both credits (10.00 each) to one open invoice, setting the invoice payment to **20.00**. Payment amount **$0.00** → **Make payment**.
- [ ] **QB Unexported** shows one row that names **only Credit 6** with *"$0.00 left in QuickBooks but this payment applies $10.00"*. Credit 7 is not listed as short.

### 8. Existing auto-apply message still shows first (regression)
- [ ] In QuickBooks, turn **"Automatically apply credits"** On. In ShopView, apply a new open credit to an open invoice.
- [ ] **QB Unexported** shows the existing message *"QuickBooks is set to automatically apply credits and payments…"*, not the new one.
- [ ] Turn the setting **Off** again afterwards.

## What is NOT Impacted (safe to skip)
- [ ] Cash payments without credit: they post to QuickBooks as before.
- [ ] Credit memo create, void and **refund (Check)** sync.
- [ ] Customer **deposit** apply and overflow deposits.
- [ ] Invoice sync to QuickBooks.
- [ ] Vendor credits and vendor payments.
- [ ] ShopView balances: the payment, the credit and the invoice balances in ShopView are saved exactly as before. Only the QuickBooks export is skipped.
- [ ] The **Export** and **Mark as Exported** buttons themselves (unchanged).

## Risk Level: Medium

**Justification:**
- QuickBooks integration change on the credit-apply sync: it adds a QuickBooks read before every apply-credit post. Scenario 5 (normal apply still posts) is the key regression check.
- BE only, no schema/permission/UI change. In the cases the check blocks, the post would have failed in QuickBooks anyway.

## Dev Verification
- [x] Unit tests: builder (both / credit-only / invoice-only short, 1-cent tolerance, no balance returned, summed lines, numeric QuickBooks ids, QuickBooks read error, already-posted marker), logger messages and payload, sync-service mapping. 518 passed.
- [x] PHPStan and cs-fixer clean on changed files; smoke test 0 × 500.
- [x] Local QuickBooks sandbox: Scenarios 1, 2 and 5 verified end to end.

## Regression Hotspots (top 5)
1. Normal credit apply to QuickBooks — must still create the $0 "Customer Credit Applied" payment.
2. Mixed cash + credit payment — cash part must still post when the credit part is skipped.
3. QB Unexported Export/Retry on apply-credit rows — one open row per payment, no duplicates.
4. Auto-apply ON message — must still take priority.
5. Amount display — amounts of $1,000 and above show with a comma (e.g. $1,250.00).

## Coverage Proof

**Files covered:** 6/6

| File | Domain | Covered |
|------|--------|---------|
| api/src/Bookkeeping/Application/BookkeepingCreditMemo/Service/Builder/CreditMemoApplicationBuilder.php | BE (QuickBooks sync) | Yes — Scenarios 1–7 |
| api/src/Bookkeeping/Application/BookkeepingCreditMemo/Service/CreditMemoSyncLogger.php | BE (QuickBooks sync) | Yes — message checks in Scenarios 1, 2, 3, 7 |
| api/src/Bookkeeping/Application/Service/Sync/CreditMemoApplicationSyncService.php | BE (QuickBooks sync) | Yes — Scenarios 1, 4, 8 |
| api/tests/Unit/Bookkeeping/Application/BookkeepingCreditMemo/Service/Builder/CreditMemoApplicationBuilderTest.php | TEST | Yes — Dev Verification |
| api/tests/Unit/Bookkeeping/Application/BookkeepingCreditMemo/Service/CreditMemoSyncLoggerTest.php | TEST | Yes — Dev Verification |
| api/tests/Unit/Bookkeeping/Application/Service/Sync/CreditMemoApplicationSyncServiceTest.php | TEST | Yes — Dev Verification |