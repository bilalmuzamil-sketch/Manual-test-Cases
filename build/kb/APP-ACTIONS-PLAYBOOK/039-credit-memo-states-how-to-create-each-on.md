## Credit memo states — how to CREATE each one (proven on sv8218, 2026-09-03)

Recorded because a whole pass stalled on "the data does not exist". It does; the route to make it was
simply unknown. Every step below was watched, and the API call each fires is named.

| To get | The clicks | What fires |
|---|---|---|
| **Unapplied** | `Customers` → the customer → `Invoices` tab → `Issue Credit` → `Amount` → `Outcome` = `Issue Store Credit` → `Reason` → the confirm button, which **relabels from `Issue Refund` to `Issue Credit`** once the outcome is chosen | `POST /api/credit-memos` → 201 |
| **Applied** | tick the credit's row **AND** an unpaid invoice's row together → `New Payment` → put the credit's full amount in that invoice's `Payment` box → pick a `Payment method` (`Make payment` stays disabled without one, even when a credit covers the lot) → `Make payment` | `POST /api/customer-account/create-customer-payment` → 201 |
| **Partially applied** | the same, on an invoice whose balance is **smaller than the credit** | as above |
| **Refunded** / partly refunded | the credit row's `Action` column → the icon whose hover tooltip reads `Cash Out` → `Amount` (it opens holding the whole open balance; type less for a part refund) → `Payment method` → `Cash Out` | `POST /api/credit-memos/{id}/cash-out` → 200 |
| **Voided** | the same column → the icon whose tooltip reads `Reverse` → the `Reverse Credit` dialog (*"This will reverse the credit. Are you sure you want to proceed?"*) → `Reverse` | `POST /api/credit-memos/{id}/void` → 200 |

**Five traps, each of which cost a run:**

1. **The credit's own row cannot apply it.** Its three actions are `Print credit memo`, `Cash Out` and
   `Reverse` — nothing else. Applying is done from the invoice side.
2. **Ticking only the invoice looks like it works and does not.** `Amount to credit` then reads `0.00`
   and typing into it merely ENLARGES the payment: the invoice gets paid by method, the credit stays
   `Unapplied`, and an unwanted **deposit** is created out of the overpayment.
3. **A deposit already on the account is consumed BEFORE the credit.** The dialog lists every available
   credit and deposit automatically, not only the ticked rows. Seed on an account with none.
4. **The dialog's own summary can disagree with the outcome.** On an invoice LARGER than the credit,
   `Applies $300.00 · $600.00 remaining` was shown and the whole $900 was consumed. On an invoice
   smaller than the credit it behaves as it says.
5. **A confirm dialog's last button is usually `Cancel`.** `page.locator('.q-dialog button').last()`
   cancelled the `Reverse Credit` dialog and the run reported `fired: []` — which reads exactly like
   "the control does nothing". Click by TEXT.

**Finding a customer to seed on** (the shapes, read from the screen's own calls — three earlier hunts
returned zero because each key was guessed):
`/api/customers?pagination[rowsPerPage]=250&pagination[page]=N` → `data.collection[]` ·
`/api/customers/view/{id}` → `data.company.customer_account_id` (the customer id is **not** the account
id) · `/api/customer-account/list-unpaid-transaction?accountId=…&openOnly=false` →
`data.response.collection[]`, each row carrying `type`, `status`, `status_label`, `invoice_number`,
`balance`, `origin_invoices`. Harness: `build/invoice-ui-refresh/seed-2026-09-03/`.

**Reading the printed document:** `python3 build/testing-tools/pdf_text.py <file.pdf>`. These PDFs
embed subset fonts and write text as raw glyph ids, so every ordinary extractor returns an empty
string — which reads exactly like "the document has no text" and is the same false negative that
produced the withdrawn *"the credit note is not rendered on this branch"* conclusion.

