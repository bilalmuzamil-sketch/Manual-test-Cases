# The last 6 Invoice UI Refresh cases — build verification, 1 September 2026

**Branch:** sv8218 (`https://sv8218.qa.shopview.com` · API `https://sv8218api.qa.shopview.com`)
**Status:** the branch came back up on 1 September after the outage recorded in
`build/BLOCKED-sv8218-env-down-2026-08-31.md`. Everything below was observed live (Rule 12); nothing
is inferred.

**Correction to yesterday's blocker note.** It concluded the wake lambda was *per-environment*
because `{"env":"sv8218"}` answered `Internal Server Error` twice while `{"env":"sv9315"}` answered
normally. **That was wrong** — the same call for `sv8218` answered `sv8218 is waking up.` today. The
failure was transient, not a property of the environment. Everything else in that note stands.

---

## Score: 3 of 6 verified so far — all PASS

| Case | Verdict | What was observed |
|---|---|---|
| [C45197](https://shopview.testrail.io/index.php?/cases/view/45197) | **PASS** | Credit renders after its origin invoice is reversed; no 500; void refuses gracefully |
| [C44947](https://shopview.testrail.io/index.php?/cases/view/44947) | **PASS** | All three payment-method-name rules, proven on one invoice |
| [C45196](https://shopview.testrail.io/index.php?/cases/view/45196) | **PASS** | Mixed cash + credit closes the invoice and flips Due date → Paid date |

Remaining: C44923, C45190, C45191 (all three are customer-card / Authorizer observations).

---

## C45197 — Credit Invoice renders when its originating invoice has been reversed

Seeded cleanly rather than disturbing baseline data: part sale **P8218-212** (status *complete*) was
invoiced, a **parts-return credit** was issued against that invoice, and then that invoice was
reversed. Nothing pre-existing was touched.

| Step | Call | Result |
|---|---|---|
| Invoice the part sale | `POST /api/invoices/create` | **201** — invoice `4eda3fc1…`, balance $95.64 |
| List creditable parts | `GET /api/part-sales/{invoiceId}/list-credit-available-parts` | **200** — 2 parts |
| Issue the parts-return credit | `POST /api/credit-memos` | **201** — **CM-4190**, $10.94, *Unapplied* |
| Render the credit | `GET /api/credit-memos/{id}/pdf` | **200**, 187,073-byte PDF |
| Reverse the origin invoice | `POST /api/invoices/reverse-invoice {id}` | **200** |
| Render the credit again | `GET /api/credit-memos/{id}/pdf` | **200**, 185,746-byte PDF |

**Against the case's three expectations:**

1. *"The document renders without a 500."* — **met.** 200 and a real PDF both before and after.
2. *"The status table handles the missing/reversed origin invoice gracefully … no fatal error."* —
   **met, and it is the documented behaviour.** The origin invoice is genuinely gone after the
   reversal (`GET /api/invoices/{id}/view` → 400 *"The invoice doesn't exist"*; the preview route →
   400 *"invoice_id: Not found"*). S11-R3 says the Invoice Number column *"is hidden for an
   account-level credit with no origin invoice"* — and that is exactly what the document does:

   | | Status table header | Status table row |
   |---|---|---|
   | Before the reversal | `CREDIT NUMBER  STATUS  INVOICE NUMBER` | `CM-4190  Unapplied  INV-P-212` |
   | After the reversal | `CREDIT NUMBER  STATUS` | `CM-4190  Voided` |

3. *"History: SV-7821 void 500s on reversed origin."* — **SV-7821 DOES NOT REPRODUCE (Rule 61,
   outcome 3 — the fix shipped).** Reversing the origin **auto-voids** the credit, and an explicit
   void then returns a clean, plain-language **400**: *"Cannot void a credit memo while it is in
   status \"voided\"."* No 500 at any point.

**A second rule confirmed for free:** the voided credit's Balance reads **$0.00** (it was $10.94
while Unapplied) — S11-R6a's *"$0.00 once nothing remains or when the credit is voided"*.

Evidence: `evidence/c45197.log`, `evidence/c97-before.pdf`, `evidence/c97-after.pdf`.

---

## C44947 — Payment method name resolves per rule (SHOPPAY shows 'Online')

Part sale **P8218-247** was invoiced ($116.58) and paid off with three payments. S8-R3 has three
sub-rules and **all three were observed on the same document**:

| S8-R3 sub-rule | Seeded as | Rendered as | Verdict |
|---|---|---|---|
| Configured method shows the shop-configured **name** | `VISA` | `Sep 1, 2026 - Visa` | ✅ |
| Unconfigured code shows the **code with underscores replaced by spaces** | `ZZAUTOTEST_CARD` | `Sep 1, 2026 - ZZAUTOTEST CARD` | ✅ |
| `SHOPPAY` shows as **"Online"** | `SHOPPAY` | `Sep 1, 2026 - Online` | ✅ |

**How the unconfigured state was reached, since it is not directly creatable.** The payment API
refuses an unknown code outright — `payment_method: "credit_card"` answers **400 *"Payment method
\"credit_card\" is not available for this organization."*** So the state was produced as a
**controlled A/B on one payment row**:

1. `POST /api/organizations/finance/payment-methods/create {name:"ZZAUTOTEST Card", type:1}` → 201,
   and the server derived the code **`ZZAUTOTEST_CARD`** (an underscore, which is what the rule is about).
2. Paid the remaining $40.00 with it → the document rendered **`ZZAUTOTEST Card`** — the configured name.
3. `POST /api/organizations/finance/payment-methods/delete {id}` → 200.
4. Re-rendered the **same invoice, same payment, nothing else changed** → **`ZZAUTOTEST CARD`**.

That is the identical payment row changing from the configured name to the raw code with its
underscore replaced by a space, which is the strongest available evidence for sub-rule 2. The
organisation is back to its original 13 payment methods.

Evidence: `evidence/c44947.log`, `evidence/c44947-invoice-text.txt`.

---

## C45196 — An invoice paid by mixed cash and customer credit shows the Paid date

Part sale **P8218-209** invoiced at $160.84, then closed with **$100.00 cash + $60.84 customer
credit**. The same invoice was rendered before and after, so the change is attributable.

| | Header dates | Payments block | Balance |
|---|---|---|---|
| Before | `Invoice date: Aug 31, 2026` · **`Due date: Sep 30, 2026`** | *(empty)* | `$160.84` |
| After | `Invoice date: Aug 31, 2026` · **`Paid date: Sep 1, 2026`** | `Sep 1, 2026 - Cash $100.00`<br>`(Credit) Sep 1, 2026 - CM-4192 $60.84` | **`$0.00`** |

1. *"Balance reads $0.00; 'Paid date: {date}' replaces 'Due date' (the most recent applied row date)."*
   — **met.** Both payment rows are dated Sep 1, 2026 and the Paid date reads Sep 1, 2026.
2. *"Both rows are listed per S8-R2 / S8-R4 (S10-R4)."* — **met**, and the credit row carries the
   `(Credit)` prefix and its credit number.
3. *"History: SV-7846 (OPEN) - mixed payment not marked Paid."* — **SV-7846 DOES NOT REPRODUCE
   (Rule 61, outcome 3 — the fix shipped).** The mixed-payment invoice *is* marked paid.

Evidence: `evidence/c45196.log`, `evidence/c45196-invoice-text.txt`.

---

## Two history references that no longer reproduce — for the QA lead

Rule 61's outcome (3) says a passing EXPECT-FAIL symptom means the fix shipped and you tell the QA
lead. Neither of these is a case marked EXPECT FAIL — the ticket references sit inside the Expected
Results as history notes — but the same reporting duty applies:

- **SV-7821** — *"void 500s on reversed origin"*. Did not reproduce; the void now refuses with a
  clean 400 and a plain-language message.
- **SV-7846** — *"mixed payment not marked Paid"*. Did not reproduce; the invoice is marked paid and
  shows the Paid date.

**No Jira ticket was created and none was touched** — the creation hold stands.

---

## New durable facts (folded into the playbook in the same pass, Rule 93)

1. `GET /api/part-sales/{id}/list-credit-available-parts` takes the **invoice id**, not the part-sale
   id. Passing the part-sale id answers 400 *"invoiceId: Not found"*.
2. `POST /api/credit-memos` full payload (read off the front end's own `IssueCreditMemoDialog`, then
   executed): `{customerAccountId, amount, reason, originKind:"invoice"|"manual", originInvoiceId,
   originDate, lineItems:[{partNumber, description, quantity, sellPrice, restockingFee, taxAmount,
   originatingInvoiceLineId}], refund?}`.
3. **`amount` is in DOLLARS, not cents** — and with `lineItems` present the server derives the total
   from the lines and ignores it. Passing 6084 for a manual credit created a **$6,084.00** credit.
4. `POST /api/invoices/reverse-invoice` refuses a **paid** invoice with **400 *"Customer transaction
   cannot be deleted."*** Reverse only an unpaid invoice, or reverse its payments first.
5. Reversing an invoice **auto-voids** any credit issued against it, and **deletes the invoice
   record** — the credit's Invoice Number column then hides per S11-R3.
6. `POST /api/customer-account/create-customer-payment` payload:
   `{account_id, payment_date, payment_method, reference_number, description, transactions:[<the
   unpaid-transaction row with transaction_payment_amount set>], primary_id, new_credit, new_deposit,
   applied_credits:[<credit row>], applied_deposits, ibs_batch_id, payment_amount}`.
7. `GET /api/organizations/finance/payment-methods` **500s without a query string**; `?type=1` works.
   A 500 where a 400 belongs — recorded as a finding, not filed.
8. The SPA's chunk graph is fetchable and greppable (`/js/index.*.js` then follow `"./*.js"`
   references). It is the fastest authority on **which route the product actually calls** — used here
   instead of guessing route shapes. Product code is never a source of expected behaviour (Rule 57);
   it was used only to find the route to drive.

## OUTSTANDING — what I need from you

Nothing on these three. Three cases remain (C44923, C45190, C45191) and I am continuing on them.
