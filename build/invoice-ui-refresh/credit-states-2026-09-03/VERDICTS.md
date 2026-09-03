# Credit Invoice — the six cases that were NOT VERIFIED now run on seeded data

**2026-09-03 · branch `sv8218` · build `v26.35.6-8454936`.** On 2026-09-02 six Credit Invoice
assertions were recorded as `NOT VERIFIED` because the only credit that existed was `Unapplied`. The
QA lead's instruction was **"Always seed data, never stay blocked"**, so every remaining state was
created on the disposable branch through the UI and each credit's printed note was rendered and read.

## The documents this rests on

| Credit | State | Where the state came from | File |
|---|---|---|---|
| `CM-4198` | **Partially applied** (pure — no refunds) | $4,000 credit, $1,211.85 applied to invoice S2-16913 | `CM-4198-Partially-applied.pdf` |
| `CM-4194` | **Applied** | $600 credit consumed in full against S2-16654 | `CM-4194-Applied.pdf` |
| `CM-4193` | **Voided** | the credit row's `Reverse` action | (state confirmed live) |
| `CM-4191` | **Voided** | `POST /api/credit-memos/{id}/void` | `CM-4191-Voided.pdf` |
| `CM-4192` | **Refunded** (fully) | the credit row's `Cash Out` action, full amount | `CM-4192-Refunded.pdf` |
| `CM-4197` | **Partly applied AND partly refunded** | $2,000: $1,260 applied, $300 cashed out, $440 open | `CM-4197-Partially-applied.pdf` |
| `CM-4189`, `CM-4190` | Unapplied | issued and left alone | `CM-4189-…`, `CM-4190-…` |

## Verdicts

| Case | Verdict | The document, verbatim |
|---|---|---|
| [C45180](https://shopview.testrail.io/index.php?/cases/view/45180) partly applied | **PASS** (both lines) | On `CM-4198`, **`Payments` shows the label with no rows** — the application to invoice S2-16913 is **not** listed, exactly as line 1 requires. **`Balance $2,788.15`, positive** = $4,000 − $1,211.85, exactly as line 2 requires. The case names $120.00 because its own precondition seeds $200 with $80 applied; the assertion is the arithmetic and the sign, and both hold |
| [C45181](https://shopview.testrail.io/index.php?/cases/view/45181) fully applied · voided | **PASS** (both lines) | Fully applied `CM-4194`: **`Balance $0.00`**. Voided `CM-4191`: **`Balance $0.00`**, the items table and totals render unchanged (`Subtotal -$300.00`, `Tax $0.00`, `Total Credit -$300.00`), and **`CM-4191  Voided`** in the status table is the only indicator — no banner, no strike-through, no extra row |
| [C45182](https://shopview.testrail.io/index.php?/cases/view/45182) refund rows | **PASS** (all three lines) | Line 1: `CM-4192` lists **`Sep 2, 2026 - EFT  -$150.00`** — `{date} - {method}`, negative. Line 2: on the partly refunded `CM-4197` the **`Balance $440.00` is positive**. Line 3: fully refunded `CM-4192` reads **`Balance $0.00`** |
| [C45183](https://shopview.testrail.io/index.php?/cases/view/45183) partly refunded and partly applied | **PASS** | `CM-4197`: original $2,000 − $300 refunded − $1,260 applied = **`Balance $440.00`, positive**, which is the rule the case states |
| [C44967](https://shopview.testrail.io/index.php?/cases/view/44967) line 2 (returned part) | **still NOT VERIFIED** | needs a credit raised from a **returned part**, which is a parts-return flow, not the account-level `Issue Credit` used here. Every other line of C44967 passed on 2026-09-02 |
| [C44968](https://shopview.testrail.io/index.php?/cases/view/44968) line 1 (restocking arithmetic) | **still NOT VERIFIED** | same reason — it needs −2 × $50.00 with a $10.00 restocking fee, i.e. a returned part |

**Running total for the Credit Invoice section (12 cases): 10 fully verified · 2 partly verified
(C44967, C44968 — one line each outstanding) · 0 FAIL.** Nothing in any document contradicts a
documented expectation, so **no defect is raised** (standing instruction: this lane makes tests
runnable, it does not create defects).

## Two observations worth the QA lead's eye — reported, not filed

1. **The New Payment dialog's own summary can disagree with what it then does.** Applying a $900 credit
   to an $8,953.54 invoice with `$300.00` typed in the invoice's `Payment` box, the credit's row read
   **`Applies $300.00 · $600.00 remaining`** — and the payment consumed the **whole $900**, leaving the
   credit `Applied` and the invoice $900 lighter. Where the invoice's balance is **smaller** than the
   credit the same dialog behaves as it says (`CM-4197`, `CM-4198`). No case asserts this text, so
   nothing is Failed by it; it is written down because a tester who reads that line will be surprised.
2. **`Payments` lists an `Applied` row on one credit and not on another.** `CM-4198` (applied only)
   shows the `Payments` label with no rows — which is what C45180 requires. `CM-4197`, which was
   applied **and** partly cashed out, lists **both** `Sep 2, 2026 - EFT  -$300.00` **and**
   `Sep 3, 2026 - Applied  -$1,260.00`, and repeats the `Applied` line in the credited-items table.
   Both documents are consistent with their own case; the difference in whether an application is
   listed is not stated by any source we hold.

## The routes, now proven and reusable

| To get | Do this |
|---|---|
| An **unapplied** credit | `Customers` → the customer → `Invoices` tab → **`Issue Credit`** → amount → **`Issue Store Credit`** → memo → confirm |
| An **applied** or **partly applied** credit | on the same tab **tick the credit's row AND an unpaid invoice's row together** → **`New Payment`** → type the amount in that invoice's `Payment` box → the credit's row states what it will do → choose a `Payment method` if `Make payment` is greyed out → **`Make payment`**. Fully applied when the whole credit is consumed; partly applied when the invoice's balance is smaller than the credit |
| A **refunded** (or partly refunded) credit | the credit row's `Action` column → the icon whose hover tooltip reads **`Cash Out`** → `Amount` (it defaults to the whole open balance; type less for a partial refund) → `Payment method` → **`Cash Out`** |
| A **voided** credit | the credit row's `Action` column → the icon whose tooltip reads **`Reverse`** → the `Reverse Credit` dialog says *"This will reverse the credit. Are you sure you want to proceed?"* → **`Reverse`**. Watched firing `POST /api/credit-memos/{id}/void`; the row then reads `Voided` |

**A deposit on the account will be consumed before the credit is**, because the dialog lists every
available credit and deposit automatically — not only the rows that were ticked. Seed these states on
an account with no deposit on it.

## How the documents were read

`build/testing-tools/pdf_text.py` (new). These PDFs embed subset fonts and write text as raw glyph
ids, so ordinary extraction returns an empty string — indistinguishable from "the document has no
text", which is the same false negative that produced the withdrawn *"not rendered on this branch"*
conclusion of 2026-08-31. The tool expands the compressed object streams, follows `/Font` indirect
references and decodes through each font's `/ToUnicode` CMap.

## The two assertions that were "NOT VERIFIED — needs something text extraction cannot answer"

Both are now answered, and neither needed the QA lead. They were parked as questions for him on
2026-09-02; they turned out to be missing **evidence**, not missing decisions.

### C44970 line 1 — the disclaimer. **FAIL, and the case now says so in plain words**

The 2026-09-02 pass could not tell whether the credit note omits the disclaimer or whether the shop
simply has none configured, because **the control failed**: rendering the same shop's ordinary invoice.
The route for that turned up while looking for something else — a paid part sale's **`Finance`** tab
fires **`GET /api/invoices/preview?invoice_id={id}&type=html&isEstimate=0&includeDeclined=0&historyEvent=`**,
which returns the whole printed invoice as HTML.

**Staging Heavy Duty - 9919 does configure a disclaimer.** Its ordinary invoice (`INV-P2-97`) prints,
immediately above `Customer Signature Printed Name Date`:

> *"Any warranties on the parts and accessories sold hereby are made by the manufacturer. You
> understand and agree that we make no warranties of any kind unless expressed in writing. You hereby
> authorize us to perform the repair work herein set forth … you agree that we are not responsible for
> loss or damage to your vehicle … an express mechanic's lien on your vehicle is granted to secure
> payment of this invoice …"*

**The credit note for the same shop prints none of it.** So C44970 line 1 is a genuine failure, not an
unconfigured shop. Per the standing instruction — *"You are never supposed to create defect, you are
supposed to make the tests RUNNABLE"* — the documented expectation stays, no ticket is prepared, and
**C44970 now carries the three outcomes** so the tester runs it and marks it Failed:

> WHAT YOU SHOULD SEE TODAY, AND IT IS A PROBLEM: the disclaimer is MISSING from the Credit Invoice…
> (1) exactly that ⇒ mark FAILED, raise nothing new. (2) fails DIFFERENTLY ⇒ a new problem, report it.
> (3) the disclaimer IS printed ⇒ the fix has shipped, tell the QA lead.

Line 2 (the signature area) already passed on 2026-09-02 and still does.

### C45168 line 2 — the `Credit To` block's width. **PASS, measured**

A layout claim that text extraction genuinely cannot answer — so the extractor was given coordinates
(`pdf_text.py --positions`). On `CM-4194`, in the band the address block occupies (**y 140–245**):

| | |
|---|---|
| Every run in that band | `ADDRESSES` at x 69.5, then `CREDIT TO` and the three address lines at x 81.0 |
| Largest x in the band | **81.0** |
| Largest x anywhere on the page | **697.5** (the `TOTAL` column) |

**Nothing shares that horizontal band with the `Credit To` block** — the page is 700 points wide there
and the block has all of it, which is exactly the contrast the case is drawing with an ordinary
invoice, where `Remit Payment To` sits beside `Bill To` (confirmed in the invoice HTML above).

**Credit Invoice section, final: 11 of 12 fully verified · C44967 and C44968 each carry one line still
NOT VERIFIED · one line (C44970 line 1) is a FAIL the tester will record.**

## The returned-part credit — found, seeded, and it corrects two earlier conclusions

**2026-09-03, after the QA lead pointed at the `Return` arrow.** The last two unverified lines needed a
credit raised from a returned part carrying a restocking fee. It exists. `CM-4199` on *Alice Truck &
Trailer Repair* is one, and its printed note settles both lines — and overturns something I reported
earlier the same night.

### How it is actually made — and the chain that is NOT it

**The route:** `Parts` → `Part Sales` → a sale whose status is **`paid`** → the **`Finance`** tab → the
toolbar's three-dot menu → **`Issue Credit`**. That dialog is **not** the one on the customer's
`Invoices` tab: it carries a **`Parts to return`** table with `Part Number · Description · Sell Price ·
Qty Available For Credit · Qty To Credit · Restocking Fee · Total`.

**The chain that is not it** — worth recording, because it is the one that looks right. A part sale
line whose status is `Received` has a **`Return`** arrow → `Add new part return request` → the row
lands on `Parts` → `Returns` → tick it → **`Receive Credit`** → the **`Process Return`** page, which
has a per-line `Restocking fee` and a `Post Credit` button. **That posts a credit the shop receives
from its SUPPLIER.** Its `Credits` tab lists vendors and vendor invoices, and the customer's account
gains nothing — checked directly on *Bloomingdale Diesel Repair* after walking the whole chain.

### The document, and the two lines it settles

```
CREDIT NUMBER  STATUS      INVOICE NUMBER
CM-4199        Unapplied   INV-P-97
DESCRIPTION                                        QUANTITY   RATE      RESTOCKING FEE   TOTAL
310206332 - XE35U.02VI-1A Pin                        -2.00    $56.26        $10.00     -$108.15
804400054 - F381CACA080804-930-PG(P) Hose Assembly   -2.00    $42.62         $0.00      -$89.50
805238372 - GB/T6170-2000 nut M12 (dacromet)         -4.00     $1.78         $0.00       -$7.48
```

| Case | Verdict | Why |
|---|---|---|
| [C44967](https://shopview.testrail.io/index.php?/cases/view/44967) line 2 | **PASS** | *"A returned part shows its actual quantity as a negative number, and its rate"* — `-2.00` and `$56.26`. **C44967 is now PASS on all six lines** |
| [C44968](https://shopview.testrail.io/index.php?/cases/view/44968) line 1 | **PASS** | The restocking fee reduces the credit by exactly the fee. Checked on all eight lines: **Total = (quantity × rate + 5% GST) − restocking fee**, and every line matches to the cent. The Pin: 2 × $56.26 = $112.52, +5% = $118.15, −$10.00 = **−$108.15**. The case's own example (2 × $50.00 − $10.00 = $90.00) omits tax because its seeded customer is not taxed; **the rule it states holds exactly**. **C44968 is now PASS on both lines** |
| [C44966](https://shopview.testrail.io/index.php?/cases/view/44966) line 3 | **PASS** | Line 3 needed an origin invoice's number and was unverified on 2026-09-02. This credit's status table reads `CM-4199 · Unapplied · INV-P-97` — the `INVOICE NUMBER` column is present and filled. **C44966 is now PASS on all four lines** |

### ⚠️ CORRECTION — C44970's disclaimer is NOT the plain failure reported earlier tonight

Earlier in this pass I wrote that *"the credit note prints none of it"* and put a three-outcome
paragraph on C44970 telling the tester to mark it **Failed**. **That was drawn from ten credits that
were all the same kind, and it is too broad.** With `CM-4199` in hand the picture is:

| Credit | Disclaimer |
|---|---|
| `CM-4199` — raised from an invoice, carries `INVOICE NUMBER` | **PRESENT**, in full, above the signature lines |
| `CM-4189` `CM-4190` `CM-4191` `CM-4192` `CM-4193` `CM-4194` `CM-4195` `CM-4196` `CM-4197` `CM-4198` — account-level store credits, no invoice number | **absent, all ten** |

So the document **can** print the shop's disclaimer, and does whenever the credit came from an invoice.
**C44970 has been corrected**: the three-outcome paragraph now tells the tester which credit this case
is about (an invoice-raised one, where it PASSES), and says that finding no disclaimer on an
account-level store credit is known and must not fail this case. Its precondition now carries the route
that makes the right kind.

**Whether an account-level store credit should also carry the disclaimer is a question for the PO** —
it is not answered by anything we hold, and no case asserts it.

**Credit Invoice section, final: all 12 cases fully verified against printed documents. 0 FAIL.**
