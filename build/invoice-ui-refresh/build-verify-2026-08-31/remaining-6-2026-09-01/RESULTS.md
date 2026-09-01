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

## Score: 6 of 6 — ALL PASS

| Case | Verdict | What was observed |
|---|---|---|
| [C45197](https://shopview.testrail.io/index.php?/cases/view/45197) | **PASS** | Credit renders after its origin invoice is reversed; no 500; void refuses gracefully |
| [C44947](https://shopview.testrail.io/index.php?/cases/view/44947) | **PASS** | All three payment-method-name rules, proven on one invoice |
| [C45196](https://shopview.testrail.io/index.php?/cases/view/45196) | **PASS** | Mixed cash + credit closes the invoice and flips Due date → Paid date |
| [C45190](https://shopview.testrail.io/index.php?/cases/view/45190) | **PASS** ⚠️ | Authorizer on the work order and parts sale, absent on the imported one — but see the spec conflict |
| [C45191](https://shopview.testrail.io/index.php?/cases/view/45191) | **PASS** | Admin gets a select, a user without work-order edit gets a read-only field |
| [C44923](https://shopview.testrail.io/index.php?/cases/view/44923) | **PASS** | A newly ticked "Approves Work" contact appears without any refresh |

**This closes the Invoice UI Refresh build verification: 108 of 119 cases verified.** The remaining
11 are 5 finished under Rule 69 (feature not built), 3 customer-portal/staging-only, 2 held on the
IBS question, and **C44987, which is back on the to-do list** now that the import turns out to be
built (see `DEFERRED-RUN.md`).

**Rules confirmed incidentally, at no extra cost:** S3-R6 (the "No authorizer" clear option is
present), S3-R8 (the Authorizer is locked once the work order is invoiced — observed as a disabled
control on a paid work order), and S11-R6a (a voided credit's Balance reads $0.00).

**Seed data restored.** The Technician role was never changed (none was needed); the impersonated
session was returned to the admin; the temporary payment method was deleted; the contact flag ticked
for C44923 was set back to unticked and re-read to confirm. What remains on the branch is the
tagged `ZZAUTOTEST-IMP-001` imported work order and the ZZAUTOTEST payments and credits, all of
which are wanted as fixtures for re-runs.

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

---

## C45190 — Work order, imported work order and part sale customer cards after the Authorizer change

**The imported work order did not exist on the branch, so I made one** rather than reporting a
missing data state (Rule 14). The details, and the correction to the "not built" verdict this
overturns, are in `DEFERRED-RUN.md`; in short, the surface was always built and four guessed 404s
were mistaken for its absence.

All three surfaces observed live, each reached the way a tester reaches it:

| Surface | Reached by | Contact | Phone | **Authorizer** | Card renders |
|---|---|---|---|---|---|
| Normal work order | Work Orders → the row | select | static field | **select — present** | yes |
| Parts sale | Parts → Part Sales → the row | select | static field | **select — present** | yes |
| Imported work order | Work Orders → **Imported** status chip → the row | — | — | **absent** | yes |

**Against the case's two expectations:**

1. *"The card renders and functions on all three."* — **met.** The imported card renders its
   customer (Una Truck Center), `VIN/Serial #`, Financial Info and the full document preview
   (`Invoice: INV-ZZAUTOTEST-IMP-001`, line, subtotal $100.00, tax $5.00, total $105.00, signature
   block). No layout break anywhere.
2. *"The Authorizer row appears on the work order and the parts sale only — NOT on the imported work
   order."* — **met exactly.**

**⚠️ BUT THE CASE'S OWN EXPECTATION COMES FROM THE TECHNICAL PLAN AND CONTRADICTS THE SPEC.**
The case cites *"(plan CustomerCard gate)"*. The specification's **S11/S3-R5** says, verbatim:

> *"The Authorizer is selected in the customer contact card on the left side of **every work order**,
> in an 'Authorizer' row directly below the Contact and Phone values…"*

An imported work order **is** a work order in the product's own navigation (it appears in the Work
Orders list under an Imported status chip), and it carries **no Contact or Phone rows at all**, so
the spec's *"directly below the Contact and Phone values"* has nothing to sit below there.

Rule 30 says the technical plan **informs but never overrules**; Rule 96 says a code-versus-document
conflict is a **PO decision item, never a silent invariant**. So the case is **left exactly as it is
and reported as passing**, and the conflict goes to Chris Ward as a question (below). Nothing was
rewritten to match the build.

Evidence: `evidence/final-observations.log`, `evidence/final-observations.json`,
`evidence/final-imported.png`, `evidence/final-partsale.png`.

---

## C45191 — A user without work order edit permission sees the Authorizer as read-only

**No role swap was needed, so none was made.** Skill 03 §8.2a's five-step Technician-role-swap exists
for when no suitable role holder exists — but reading the roles live showed the **Technician role
already lacks `workOrdersCreateAndEdit`**:

| Role | `workOrder*` permissions |
|---|---|
| Admin | `workOrdersView`, `workOrdersCreateAndEdit`, `workOrdersDelete`, `workOrderLinesCreateAndEdit`, `workOrderLinesDelete` |
| **Technician** | `workOrdersView`, `workOrderLinesCreateAndEdit` — **no `workOrdersCreateAndEdit`** |

So the restricted user the case asks for already exists. Nothing was changed, so step 5 (restore the
Technician role) has nothing to restore — the pass leaves the organisation's roles untouched.

Observed as a controlled A/B on **the same work order**, via `POST /api/switch-user` (the recorded
simpler fallback, playbook §G) to **Brandi Smith**, an active Technician:

| Viewer | `workOrdersCreateAndEdit` | Authorizer renders as | `[data-test-id="authorizer_readonly"]` |
|---|---|---|---|
| Admin (positive control) | **yes** | an editable **select** | absent |
| Brandi Smith, Technician | **no** | a **static field** | **present** |

Under the restricted user the static field labels read
`Lead technician · Service advisor · Sales representative · Contact · Phone · Authorizer · Title ·
Unit # · VIN/Serial #` — **and no select control is offered at all** (the only `.q-select` left on
the page is the global Search box).

*"The Authorizer shows as a static, read-only field; no select control is offered"* — **met**, and
the read-only rendering also puts Authorizer **directly below Contact and Phone**, which is S3-R5's
required position.

The session was returned to the admin at the end of the run (`quick-login` → 200), so the branch is
left as it was found.

Evidence: `evidence/final-observations.log`, `evidence/final-c45191.png`.

---

## C44923 — A new 'Approves Work' contact becomes selectable immediately

Observed exactly as the case describes, with **the work order tab never reloaded or re-saved** — a
reload would test nothing.

| Step | Observed |
|---|---|
| Work order **S8218-17358** open (status *estimate*), Authorizer list opened | `No authorizer`, `Peter Soto` |
| **Olivia Sims** present in that list? | **no** — and her record read `is_authorizer: false` |
| Second tab → Customers → the customer → **Contacts** tab → her row's **edit** icon → ticked **"Approves Work"** → **Save** | dialog control found and saved |
| Her record re-read from the API | **`is_authorizer: true`** |
| Back to the **untouched** work order tab (never reloaded), Authorizer list opened again | `No authorizer`, `Peter Soto`, **`Olivia Sims`** |

1. *"The newly enabled contact appears in the work order's Authorizer list."* — **met.**
2. *"It becomes selectable without any refresh or re-save of the work order."* — **met.** The tab's
   URL is unchanged across the whole run and no reload was issued.

**Every reading carries a positive control.** The list must contain **"No authorizer"** (S3-R6's
clear option) or the reader is treated as not having fired and the result is discarded. The control
fired on both the before and the after read, so the change from *absent* to *present* is real.

**Two rules confirmed incidentally:** the list offers **only** contacts with "Approves Work" enabled
(S3-R5 — Olivia Sims was excluded until the moment she qualified), and the **"No authorizer"** clear
option is present (S3-R6).

Evidence: `evidence/c44923-final.log`, `evidence/c44923.json`, `evidence/c44923-after.png`.

### Three wrong readings on the way here, and why none of them was a defect

All three were **my instrument**, not the build (skill 03 §8.0-a). Recording them because each is a
trap the next session will hit:

1. **The first target work order was PAID.** Its Authorizer select carries `q-field--disabled` /
   `aria-disabled="true"`, so the dropdown can never open and every read returned an empty list.
   That is **S3-R8 working correctly** — *"locked once the work order is invoiced"*. **C44923 needs a
   work order that has not been invoiced** (estimate / approved / in progress / review / complete).
   An incidental live confirmation of S3-R8.
2. **`/customers/{id}` redirects to the work-orders tab.** The contacts tab is
   **`/customers/{id}/contacts`**; a run pointed at the bare customer URL searches a work-order table
   for a contact and reports "contact not found".
3. **Table cells are separate `<td>`s**, so a row's `innerText` is `Olivia\tSims` and
   `includes("Olivia Sims")` never matches. **Normalise whitespace on both sides before comparing.**
   And the row is not clickable — each row carries an **`edit_note` icon** that opens the editor.

The positive control is what caught all three: without it, three separate runs would have reported a
passing case as failing.
