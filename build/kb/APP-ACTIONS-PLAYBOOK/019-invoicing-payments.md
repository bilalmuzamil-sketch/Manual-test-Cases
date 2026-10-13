## INVOICING / PAYMENTS

### Create an invoice
- **UI path:** WO detail → **Finance** tab → **Create Invoice** button. (After success the app auto-opens a "New Customer Payment" dialog.)
- **API:** `POST /api/invoices/create` → **201** (returns invoice_id; WO status → "Invoiced"). Invoice detail `GET /api/invoices/{id}/details`. Estimate PDF/HTML `POST /api/work-orders/invoices/estimate`.
- **Preconditions (ALL required):** every part **RECEIVED with a real PART NUMBER** (no "Requested", no `(-)`, no badge) **AND** the **Review** step completed **AND** `invoicingPaymentsCreateAndEdit` + `seeFinancialData` (SFD OFF → no Finance tab at all, even with V/E/D).
- **Gotcha/Unblock:** **OVER LIMIT badge blocks nothing** — if Create Invoice does nothing, it's a missing part number or an unclicked Review, not the credit badge. Use a **clean throwaway customer** + a fresh WO taken Approved → Reviewed → Complete.
- **Confidence:** High (created 201 across Foreman/SM/SA/SSA).

### Reverse an invoice
- **⚠️ A PAID INVOICE CANNOT BE REVERSED** — `POST /api/invoices/reverse-invoice` answers **400
  *"Customer transaction cannot be deleted."*** Reverse its payments first, or start from an unpaid
  invoice. (Proven 2026-09-01; the previous entry only recorded the 200 and the 403.)
- **UI path:** WO detail → Finance tab → invoice **three-dot** menu → **Reverse** → Warning ("re-open and undo the invoice") → confirm Reverse. (Part-sales invoice: Part Sales → invoice → reverse.)
- **API:** `POST /api/invoices/reverse-invoice` body `{id}` → **200** (WO reverts "Invoiced" → "Complete", Create Invoice reappears).
- **Preconditions:** WO-invoice reverse is gated by **Work Orders: Delete** (SM has WO Delete → reverse allowed even though `invoicingPaymentsDelete`=OFF). Foreman/Parts Manager without it → menu shows only "Issue Credit" and the endpoint returns **403 "Access denied."**
- **Confidence:** High (executed 200 allowed and 403 blocked, both observed).

### Issue credit
- **UI path:** WO detail → Finance tab → invoice three-dot menu → **Issue Credit** (present even for roles that lack Reverse).
- **API (driven live 2026-09-01, 201):** `POST /api/credit-memos` —
  `{customerAccountId, amount, reason, originKind:"invoice"|"manual", originInvoiceId, originDate,
  lineItems:[{partNumber, description, quantity, sellPrice, restockingFee, taxAmount,
  originatingInvoiceLineId}], refund?:{amount, paymentMethod, memo, externalReference}}`.
  Payload read off the product's own `IssueCreditMemoDialog` chunk, then executed.
- **🔑 `amount` IS IN DOLLARS, NOT CENTS** — and when `lineItems` is present the server derives the
  total from the lines and ignores `amount` entirely. Passing `6084` for a manual credit created a
  **$6,084.00** credit, not $60.84. Two credits differing only in this looked identical in the
  request and were 100× apart in the record.
- **Creditable parts:** `GET /api/part-sales/{id}/list-credit-available-parts` takes the **INVOICE
  id**, not the part-sale id. The part-sale id answers **400 `{"invoiceId":"Not found"}`**, which
  reads like a missing feature and is really a wrong id.
- **The parts-return picker is PART-SALE ONLY** (`PartsReturnPicker` props default
  `invoiceType:"partSale"`); a service work order's credit is a plain amount.
- **Void / cash out:** `POST /api/credit-memos/{id}/void` · `POST /api/credit-memos/{id}/cash-out`.
  Voiding an already-voided credit answers a clean **400** *"Cannot void a credit memo while it is
  in status \"voided\"."* — a refusal, not a failure.
- **⚠️ REVERSING AN INVOICE AUTO-VOIDS ANY CREDIT ISSUED AGAINST IT, AND DELETES THE INVOICE
  RECORD.** Proven 2026-09-01: the credit went *Unapplied → Voided*, its Balance $10.94 → $0.00, and
  the credit document's **Invoice Number column disappeared** (correct per spec S11-R3, which hides
  it when there is no origin invoice). Afterwards `GET /api/invoices/{id}/view` answers 400 *"The
  invoice doesn't exist"*.
- **Confidence:** High (create, render, reverse-origin, re-render and void all executed).

### Import an historical / "imported" work order  🆕 2026-09-01
- **Why it matters:** a session on 2026-08-31 reported invoice import as **not built** on the
  strength of four **guessed** routes all answering 404. It is built. **Four 404s from guessed routes
  are not evidence of absence** — a guessed route and a wrong id 404 identically.
- **API:** `POST /api/imports/work-order-historical`, **multipart, field name `file`** → 200
  `{"duplicatedInvoices":[]}`. A bare POST answers 400 *"file file is missing or invalid"*; wrong
  headers answer *"Invalid file headers provided!"*.
- **The CSV contract is shipped by the product itself** — an inline template literal in the
  `InvoicesDataImport` chunk, downloadable in-app as `invoices_template.csv`. **24 columns; the 10
  marked `*` are required.** Keep the asterisks and the exact column order:
  `*Shop Location,*Customer,VIN,Year,Make,Model,Unit #,Unit Type,Mileage,Hours,*Invoice Number,*Invoice Date,PO,Service Advisor,*Item,*Line Title - What are you doing,Line Description - Why are you doing it,Tech Story,Part #,Part Description,*Qty,*Rate,*Total,*Tax Amount`
  · `*Invoice Date` is **MM/DD/YYYY** (an ISO date is read as empty) · `*Item` is one of
  Labor / Part / Shop Supplies / Misc / Sublet / Credit Memo · `*Shop Location` and `*Customer` must
  match existing records by name.
- **Read them back:** `GET /api/work-orders-imported` (list) · `GET /api/work-orders-imported/{id}`.
  They are **NOT** in `GET /api/work-orders` — `imported` is a **synthetic status on a separate
  endpoint** and is absent from `GET /api/work-orders/statuses`. 600 work orders scanned for
  `status == imported` found zero; the separate endpoint had them.
- **Screen:** route `/imported-work-orders/:id`, component `ImportedWorkOrderLeftSection`.
- **Screen navigation, tester-style:** Work Orders list → the **Imported** status chip → click the
  row. (The route also has a guard, `requiredCheck: () => featureFlags().WorkOrders`.)
- **🛑 A PAGE THAT LANDS ON `/` WITH ~148 BODY CHARACTERS IS THE ENVIRONMENT ASLEEP, NOT A ROUTE
  GUARD AND NOT A MISSING SCREEN.** sv8218 auto-sleeps mid-run and every route then serves
  `sleep.qa.shopview.com/?app=sv8218&api=sv8218` reading *"Environment Sleeping — This environment is
  currently paused to save resources… Wake Up"*. On 2026-09-01 this was first misdiagnosed as the
  route guard firing before the feature-flag store loaded; the body text settled it.
  **Assert the landing, and read the body text before diagnosing** — wake with the toggleQaEnv
  lambda (below) and re-run. **The API keeps answering for a while after the SPA host has gone to
  sleep**, so an API-only probe will not warn you.
- **No document route:** an imported work order has no invoice PDF of its own
  (`/api/invoices/preview` rejects its id; `/api/work-orders-imported/{id}/pdf` is 404).
- **Confidence:** High (seeded `ZZAUTOTEST-IMP-001` live and read it back).

### Impersonation, and the inline part row  🆕 2026-09-01 (sv9315)
- **🛑 `quick-login` DOES NOT END IMPERSONATION.** After a `switch-user`, a second `switch-user`
  answers **400 *"You are already impersonating a user. Exit impersonation first."*** even though the
  profile reads Admin and `view_mode` reads `full`. The exit route is **`POST /api/exit-switch-user`**
  (read off the SPA bundle; eight guessed shapes returned 404). **Always exit before switching again,
  and exit before handing the branch back.**
- **A bare `quick-login` at the END of a run strands the next process.** It rotates the shared
  PHPSESSID; if the new value is not written back to the cookie file every later call answers
  **409 "Session has expired."** and looks like dead credentials. Persist the rotated session.
- **Tech View needs no role change.** The **Technician** role already carries `view_mode: 'tech'` and
  lacks `woFullViewMode`; the **Admin** carries `view_mode: 'full'` and holds it. So impersonating a
  Technician *is* Tech View. There is also a dedicated **"Tech View"** role with one holder.
- **⚠️ IMPERSONATE A TECHNICIAN AT THE WORK ORDER'S OWN WORKPLACE.** A technician based elsewhere sees
  a page with no Parts controls at all, which reads exactly like the feature being absent. Compare the
  work order's `workplace_id` (`GET /api/work-orders/view/{id}`) against the staff record's.
- **The inline part row has TWO ids:** **`inline_part_row`** when adding and
  **`inline_part_edit_row`** when editing. Fields: `input_inline_part_description`,
  `select_inline_part_number`, `input_inline_part_quantity` (all views) plus
  `select_inline_part_category`, `input_inline_part_cost`, `input_inline_part_sell_price` (Full View
  only); controls `button_more_options_inline_part` (opens the full New/Edit Part Request modal),
  `button_save_inline_part`, `button_cancel_inline_part`, and `button_pulled_from_bin` for the bin chip.

### Document snapshots and batch invoices  🆕 2026-09-01
- **Snapshot a document as it was at a history event:**
  `POST /api/work-orders/invoices/snapshot {entity_event_id, work_order_id, type:"html"|"pdf"}` →
  200. `entity_event_id` is an event from `GET /api/work-orders/{id}/history` (payload is
  `data.history`, **not** `data.collection`) whose **`snapshotAvailable`** flag is true.
- **🛑 THE `historyEvent` QUERY PARAM ON `/api/invoices/preview` IS NOT THE SNAPSHOT FEATURE.** It
  binds and changes nothing — five different values including a nonsense one return a byte-identical
  document. A pass spent a day on it and filed a defect candidate for a parameter that is simply not
  the mechanism. **The route above is the mechanism.**
- **⚠️ FINDING (2026-09-01): every PRE-EXISTING snapshot on sv8218 returns HTTP 500**; snapshots
  captured the same day return 200. Proven on one work order (S8218-17113: today 200, its own
  18/13/10 August events all 500, html and pdf), so it is the snapshot's age, not the record or the
  document type. Candidate at
  `build/invoice-ui-refresh/build-verify-2026-08-31/DEFECT-CANDIDATE-snapshot-500.md` (not filed).
- **Batch invoice PDF:** `POST /api/invoices/batch-pdf {invoiceIds:[…]}` → 200, one multi-page PDF.
  **NOT `/api/invoices/batch`**, which is a 404 and was mistaken for the feature being absent.
- **Both the batch PDF and the imported-work-order document render the OLD template**, which is
  correct — they are deferred to SV-9193. Tell them apart by label, not by guesswork: **old** =
  `Invoice Date:` (capital D) · `Customer signature:` / `Printed name:` (lower case, colons) ·
  `Software Powered by ShopView` · `Tax` · `Issue date:` (imported). **New** = `Invoice date:` ·
  `Paid date:` when settled · `Customer Signature` / `Printed Name` · `Powered by ShopView` ·
  `GST (5%)` · the `Addresses` and `Summary` group labels.

### 🛑 NEVER WRITE "NOT BUILT" FROM A GUESSED ROUTE — FETCH THE BUNDLE  🆕 2026-09-01
On 2026-08-31 three features were reported as not built because guessed route names answered 404.
**All three were built** — the imported/historical import, the batch invoice PDF, and document
snapshots. **A guessed route and a wrong id 404 identically**, so a 404 from a name you invented is
evidence of nothing.

**The product's own front-end bundle is the authority on which routes exist, and it is one fetch
away.** It is *product source code*, so it is **never a source of expected behaviour (Rule 57)** —
use it only to find the route to drive and the payload shape to send, then observe live.

```
C=$(cat /tmp/qa-cookies/<branch>-live-session.txt)
curl -s -H "Cookie: $C" https://<branch>.qa.shopview.com/ | grep -o 'src="[^"]*\.js"'   # entry chunk
# then fetch it, and follow its "./*.js" references (2-3 rounds reaches the whole graph, ~520 files)
grep -ho '\(get\|post\)(`\?"\?[a-z][^`",)]*<keyword>[^`",)]*' *.js | sort -u
```
It also yields the **exact request payload** (as it did for `credit-memos`,
`create-customer-payment` and the snapshot route) and any **CSV import template** the app ships
inline — which is how the historical-import contract was obtained without guessing a write
(skill 03 §8.2-w).

### Create a customer payment (full payload)  🆕 2026-09-01
- **API:** `POST /api/customer-account/create-customer-payment` → **201 `{id}`**. Payload, read off
  `TransactionsPaymentDialog` and executed:
  `{account_id, payment_date:"YYYY-MM-DD HH:MM:SS", payment_method:<CODE>, reference_number,
  description, transactions:[<the row from list-unpaid-transaction with transaction_payment_amount
  set>], primary_id:<that row's id>, new_credit:0, new_deposit:0, applied_credits:[<a credit row,
  same shape>], applied_deposits:[], ibs_batch_id:null, payment_amount:<number>}`.
- **The transaction row's `id` is the TRANSACTION id; `reference_id` is the invoice id.** Match on
  `reference_id` when you are holding an invoice id.
- **Apply a customer credit** by putting the credit's row in `applied_credits` with
  `payment_method:"APPLIED_CREDIT"` and `payment_amount:0`; the document then shows
  `(Credit) {date} - CM-xxxx`.
- **Unpaid list:** `GET /api/customer-account/list-unpaid-transaction?accountId=…&openOnly=true|false`.
  **`openOnly=true` is the "Open only" chip** — fully applied/paid rows vanish from it, which looks
  like deleted data and is not.
- **⚠️ AN UNCONFIGURED PAYMENT CODE IS REFUSED**, so the "unconfigured code" rendering state cannot
  be created directly: `payment_method:"credit_card"` answers **400 *"Payment method \"credit_card\"
  is not available for this organization."*** **Reach it instead by creating a method, paying with
  it, then deleting the method** — `POST /api/organizations/finance/payment-methods/create
  {name, type:1}` (the server derives `code` from the name, upper-snake) →
  `POST /api/organizations/finance/payment-methods/delete {id}`. That leaves the payment carrying a
  code nothing resolves, and gives a controlled A/B on one payment row.
- **⚠️ `GET /api/organizations/finance/payment-methods` 500s with no query string** (and with a
  pagination one); **`?type=1` works.** A 500 where a 400 belongs — recorded, not filed.

### Create a payment
- **UI path:** WO Finance (after invoicing) → **New Payment** → method (e.g. Cash) → amount → **Make Payment**. Customer Payments also on Customers → customer → Payments tab.
- **API:** `POST /api/customer-account/create-customer-payment` → **201** (returns payment id).
- **Preconditions:** an unpaid invoice; `invoicingPaymentsCreateAndEdit` + SFD. **Add Deposit** action on Finance is gated by Invoicing Create&Edit (absent for view-only).
- **Gotcha/Unblock:** `create-customer-payment` returns **HTTP 500 in some sessions** — process via the UI when the API 500s.
- **Confidence:** High (created 201 as SSA); 500 quirk noted.

### Reverse a payment
- **UI path:** Customers → customer → Payments tab → row delete/trash icon → confirmation ("reverse the payment for all invoices … record preserved for audit") → **Reverse**.
- **API:** `POST /api/customer-account/reverse-customer-payment` → **201** (payment removed from invoice; record kept for audit).
- **Preconditions:** per-payment delete icon is gated by **`invoicingPaymentsDelete`** (NOT Customer Management Delete).
- **Confidence:** High (executed 201).

### Remove a customer transaction (delete payment / void)
- **API:** `POST /api/invoices/remove-customer-transaction` → **403 "Access denied."** without `invoicingPaymentsDelete` (observed for Service Manager).
- **Preconditions:** `invoicingPaymentsDelete`.
- **Confidence:** High (403 gating observed).

### Send to Terminal
- **UI path:** WO Finance → **Send to Terminal** (appears on an **unpaid invoice**; gated by Invoicing Create&Edit).
- **Confidence:** Medium (gate confirmed; needs an existing unpaid invoice to surface it).

---

