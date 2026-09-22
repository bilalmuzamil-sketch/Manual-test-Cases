# SV-9647 — credits spread across invoices print only the slice applied to each. Findings.

**Fix branch** `sv9647.qa.shopview.com`, build **`v26.36.8-fc4dd05`**, last-modified Mon 21 Sep
08:48:45 GMT, etag `02d7ad481359311c5c530eeadf09b72d`. Organization `d55bc308…`.

## §1 — The reported shape, reproduced and passing

**The fixture**, built as the customer's own case: one customer, two part-sale invoices, two credit
memos, settled in **ONE** payment.

| | |
|---|---|
| Customer | **ZZAUTOTEST SV-9647 Credit Split** `468d37dd…`, account `5e7e36d7-613c-4b99-ab9a-a80ed1e90651` |
| Part sale 1 | **P9647-248** `0a33e93d…` → invoice **INV-P9647-248**, total **$4.66** (parts $4.44 + GST $0.22) |
| Part sale 2 | **P9647-249** `00950c4c…` → invoice **INV-P9647-249**, total **$87.74** (parts $83.56 + GST $4.18) |
| Credit memo 1 | **CM9647-4189** `5e2255a2…` — **$22.00** |
| Credit memo 2 | **CM9647-4190** `6e4c329b…` — **$65.98** |
| The payment | ONE payment, both invoices and both credits selected together; both credits shown **"Fully consumed"**, cash remainder **$4.42**, method CASH, reference `ZZAUTOTEST-9647` |

**Note on the figures.** The handoff asks for invoices of exactly $4.44 and $83.56 with $0.01 cash
each. Mine are **$4.66 and $87.74** because **5% GST applies** — the customer is flagged tax exempt on
both local and federal and the tax was charged anyway (see §1b). The *shape* is identical and the
reconciliation below is exact, so the check is answered; the cents differ from the handoff only
because the totals do.

### What the two documents print

**INV-P9647-248 — the small one, the equivalent of the customer's P-10311:**

```
Total                                   $4.66
Payments
  (Credit) Sep 22, 2026 - CM-4189       $1.17
  (Credit) Sep 22, 2026 - CM-4190       $3.49
BALANCE                                 $0.00
```

**INV-P9647-249:**

```
Total                                  $87.74
Payments
  Sep 22, 2026 - Cash                   $4.42
  (Credit) Sep 22, 2026 - CM-4189      $20.83
  (Credit) Sep 22, 2026 - CM-4190      $62.49
BALANCE                                 $0.00
```

### It reconciles, in both directions

| Check | Result |
|---|---|
| **$22.00, $65.98, $87.98 and $87.99 appear NOWHERE** on the $4.66 document | **confirmed** — searched the rendered text for each |
| Each document's credit lines sum to that document's own total | $1.17 + $3.49 = **$4.66** ✓ · $4.42 + $20.83 + $62.49 = **$87.74** ✓ |
| **Each memo is accounted for exactly once across the two documents** | CM-4189: $1.17 + $20.83 = **$22.00** ✓ · CM-4190: $3.49 + $62.49 = **$65.98** ✓ |
| Balance | **$0.00** on both, and the customer's account balance went $92.40 → **$0.00** |

**So the reported defect does not occur on this branch.** The customer's complaint was that a $4.44
invoice itemised $88.00 of credits; here the $4.66 invoice itemises $4.66 of credits, and the rest of
each memo appears on the invoice that actually consumed it.

### The apportionment rule, derived from the numbers rather than assumed

Cash is applied first and in full to one invoice; each credit is then split across the invoices in
proportion to what that invoice still owes. On INV-P9647-249 the credits cover $87.74 − $4.42 =
**$83.32**, and $22.00 / $87.98 × $83.32 = **$20.83**, $65.98 / $87.98 × $83.32 = **$62.49** — both
match to the cent. The same rule gives $1.17 and $3.49 on the $4.66 invoice. **Predicting the figures
before reading them, and getting them, is the part that makes this a pass rather than a shrug.**

## §1b — Reported, not filed: customer tax exemption did not apply to these part sales

The customer carries `tax_exempt_local: 1` and `tax_exempt_federal: 1` (set before either part sale was
created, and re-read afterwards to confirm it stuck), and **GST 5% was charged anyway** on both. Setting
the part sale's tax to the organization's "Zero Tax" rate via `POST /api/work-orders/{id}/tax` returned
**200** but changed nothing — the work order still carries the default GST tax object.

**I am not calling this a defect.** I have not established whether customer tax exemption is meant to
reach part sales at all, or whether it applies only at a different level, and it is not what SV-9647 is
about. It is recorded because it changed my fixture's figures and someone should say which behaviour is
correct.

## Environment notes worth keeping

* **Create Invoice is disabled until the parts are ordered AND received** — with a vendor-sourced part
  sitting at `requested` on a line marked `authorization_required`, the button renders `disabled` with
  no tooltip. Authorising the line (`POST /api/work-orders/lines/change-status`
  `{line_id, status:"authorized"}`) moves the part to `authorized_to_order`; it still needs ordering and
  receiving before the sale reaches `complete` and the button enables. **The QA lead ordered and
  received these two by hand** after I misread the disabled button as a click problem.
* **Invoice creation:** `POST /api/invoices/create` with `invoice_number`, `due_date`, `cost`,
  `customer_id` (the **contact**), `company_id`, `work_order_id`, `work_place_id`.
* **Credit memo:** `POST /api/credit-memos` `{customerAccountId, amount, reason, originKind:"manual",
  originDate}`. The account id is **not** the company id — it comes back in this payload.
* **The batch payment:** tick the invoices **and** the credit memos on the customer's Invoices tab, then
  New Payment — the dialog then lists each credit as *"Fully consumed"* and reduces the cash amount to
  the remainder. `POST /api/customer-account/create-customer-payment` with `account_id`,
  `payment_method`, `reference_number` and a `transactions[]` array.
* A **QuickBooks sync warning** appears after the payment (*"The payment was saved, but the QuickBooks
  sync did not complete"*) — this organization is not QuickBooks-connected, so it is expected noise, not
  a finding.

## §0 — The pre-fix BEFORE, captured on staging

**Build `v26.36.8-e2c29c5`**, `app.staging.shopview.com`, `index.html` last-modified Tue 22 Sep 2026
05:34:18 GMT, etag `f3e1dab3640788cf201b1adbc7553592`. Organization `d55bc308…`, signed in through the
**Quick login → Admin** button.

**The fixture** — deliberately built from **work orders with fixed-price canned lines** rather than part
sales, so no part has to be ordered or received (see the receive note below). Same *shape* as the
customer's case: one customer, two invoices, two credit memos, settled in **ONE** payment.

| | |
|---|---|
| Customer | **ZZAUTOTEST SV-9647 Credit Split BEFORE** `27bfb198-95a0-491b-820a-59566432e598`, account `17c6e8d6-ca8c-43b8-8498-7e2d3235b39e` |
| Contact | **ZZ Tester** `2288624a-ba8b-4778-a183-0d5d805a73c6` |
| Work order 1 | **S2-33369** `669d5baf…` — canned line *Service - Wheels off trailer single or tandem*, labour $125.00 → invoice **INV-S2-33369**, total **$145.04** (labour $125.00 + shop supplies $13.13 + GST $6.91) |
| Work order 2 | **S2-33370** `14fe4f27…` — labour $350.00 → invoice **INV-S2-33370**, total **$406.09** |
| Credit memo 1 | **CM2-4398** `174b7c47…` — **$200.00** |
| Credit memo 2 | **CM2-4399** `452a6f71…` — **$300.00** |
| The payment | ONE payment, both invoices and both credits ticked together; both credits shown **"Fully consumed"**, cash remainder **$51.13**, method CASH, reference `ZZ-9647-BEFORE` |

### What the pre-fix build prints — the bug, exactly as reported

**INV-S2-33369 — total $145.04:**

```
Total                                  $145.04
Payments
  Sep 22, 2026 - Cash                   $51.13
  (Credit) Sep 22, 2026 - CM-4399      $300.00
  (Credit) Sep 22, 2026 - CM-4398      $200.00
BALANCE                                  $0.00
```

**$51.13 + $300.00 + $200.00 = $551.13 of payments printed against a $145.04 invoice**, and the document
still ends *BALANCE $0.00*. That is Brian Orban's complaint word for word.

**INV-S2-33370 — total $406.09** is wrong in the same way, just less absurdly:

```
Total                                  $406.09
Payments
  (Credit) Sep 22, 2026 - CM-4399      $300.00
  (Credit) Sep 22, 2026 - CM-4398      $200.00
BALANCE                                  $0.00
```

$500.00 of credits against a $406.09 invoice. **So pre-fix, every document prints the FULL FACE of every
credit in the payment, regardless of how much of that credit the invoice in front of you actually
consumed** — and the cash row lands wherever the payment allocated it (here entirely on the small
invoice, the opposite of the branch).

Compare §1: on the fix branch each document prints only its own slice, and the slices reconcile in both
directions.

## §0b — Two staging blockers that are worth recording, because both cost time

* **A work order created through `POST /api/work-orders/create` has NO customer contact, and without one
  the whole invoice path dies** — `Create Invoice` renders **disabled with no tooltip**,
  `POST /api/work-orders/invoices/estimate` → **500**, `GET /api/invoices/{woId}/details` → **500**.
  It looks like a status or permission problem and is neither. Fix:
  `POST /api/contacts/create {company_id, first_name}` then
  `POST /api/work-orders/change-contact {work_order_id, vehicle_id, contact_id, update_vehicle:true}` →
  200, after which estimate and details both return 200 and the button enables. **This was already
  written down in `APP-ACTIONS-PLAYBOOK.md` §R.7a and I re-derived it the hard way — read the playbook
  first (Standing Rule 27).**
* **Completing a work order needs mileage AND engine hours**, and they are two separate endpoints:
  `POST /api/work-orders/change-mileage {work_order_id, mileage:'100000'}` and
  `POST /api/work-orders/change-engine-hours {work_order_id, engine_hours:'120'}`, both → 201. Passing
  `engine_hours` to `change-mileage` returns 201 and silently does nothing.

## §0c — I WAS WRONG TWICE ABOUT "STAGING CANNOT RECEIVE". It can. I was on the wrong screen.

**What I claimed, in two escalating versions, and both were wrong.**

*First*, I wrote that receiving is broken environment-wide on staging, on the strength of a "control" run
against a pre-existing purchase order. **That control was invalid**: the order I used, **S-33368
`bca430f5…`**, has `vendorMissing: true` and no vendor at all, so it was failing for a reason that has
nothing to do with my fixture. I should have read the order's state before drawing a conclusion
(Standing Rule 75 — configuration first).

*Then*, having fixed the control, I still reported the receive as failing: **HTTP 500** on
`POST /api/inventory/orders/accept`, requestId `6a409ed9-679f-4e4a-8eba-4ec117aa0c5e`, sent by **the
application's own form** on `/accept-delivery/628ad251…` while signed in through **Quick login → Admin**
on an order that *does* have a vendor. All of that is accurately reported and all of it is beside the
point, because **`/accept-delivery/{orderId}` is not the screen a part sale is received from.**

**The QA lead pointed at the right one and it works first time.** From the part sale's own **Part
Requests** tab — `/parts/part-sale/{partSaleId}/part-requests` — the row carries a **Receive** button
which opens a *Receive parts* panel grouped by vendor (vendor selector, Vendor Invoice Number, Invoice
Date, Delivery Note, per-row Qty Received, Tax, and a **Receive Parts (n)** button). That panel posts
**`POST /api/orders/receive-requested-parts`** — a different endpoint entirely — and it returned
**HTTP 200**, with the row flipping to **Received**. The same worked on the second part sale
(`ZZ9647-BEF-B`, item `416f4890…`) → **200, Received**.

* Received this way: **P-2145** (part sale `0dcaa2bc…`, invoice number `ZZ9647-BEF-A`) and **P-2146**
  (part sale `c40b9af5-1ecf-43e5-b908-18f2d7af135f`, `ZZ9647-BEF-B`).
* Control ids for the panel: vendor group `f7f509b5-3cfe-4041-852b-b5c4662bb0e8`,
  `input_invoice_number_<group>`, `input_quantity_<itemId>`, `button_receive_vendor_<group>`.

**The lesson, and it is one already written down in the playbook (§U.0, question 2): "is there more than
one surface for this action, and am I on the one the product uses?"** I spent a long time proving, very
rigorously, that a screen the product does not use for this flow returns a 500 — and then reported it as
an environment fault. Rigour on the wrong surface is not rigour.

**What is left genuinely open:** `/accept-delivery/{orderId}` really does return 500 for this order, as
the application's own form sends it. That may be a dead or mis-wired route rather than a defect, and it
is **not** on SV-9647's path. I am not filing anything on it; it is recorded here in case it matters to
someone.

## §2 — Cross-workplace, same organization: the fix PASSES, and a separate pre-existing gap sits next to it

The handoff calls this the highest-risk shape: *"one payment settling invoices across two workplaces of
the same org is a real, already-supported flow (SV-7761)… scoping it to workplace would have silently
re-created the bug on exactly those invoices"*, with the acceptance line **"if either document shows the
full $100.00 face, the fix has regressed"**.

**Neither document shows the full face. Check 2 passes.**

### Fixture A — credit issued in Heavy Duty

Two $145.04 work orders, one in **Staging Heavy Duty - 9919** (`b3c8c820…`) and one in **Staging
Lethbridge - 4310** (`f8a8b802…`), same customer, settled in **one** payment with **one $250.00 credit**
plus $40.08 cash. The payment dialog itself confirms it is a cross-location payment — it prints
*"Select invoices from a single location to pay by terminal."*

Allocation read back from the payment record: cash $40.08 → **S-17585 (Heavy Duty)**, cash $0 →
**S-17587 (Lethbridge)**, `applied_credits: -250`.

| document | workplace | what it prints |
|---|---|---|
| **S-17585** | Heavy Duty | Cash **$40.08** · (Credit) CM-4193 **$104.96** → sums to **$145.04** ✓ |
| **S-17587** | Lethbridge | **Payments section EMPTY** — no cash row (correct, it is $0) and **no credit row** — BALANCE **$0.00** |

### Fixture B — the same thing with the credit issued in Lethbridge

| document | workplace | what it prints |
|---|---|---|
| **S-17589** | Lethbridge | (Credit) CM-4194 **$145.04** → its own slice ✓ |
| **S-17588** | Heavy Duty | Cash **$40.08** only — **the $104.96 credit slice is missing** — BALANCE **$0.00** |

**The two fixtures are mirror images, which is what makes the rule readable rather than guessable: the
credit row renders ONLY on invoices belonging to the credit memo's own workplace.** Wherever it does
render, the amount is the correct apportioned slice — so the thing SV-9647 changes is working. What is
missing is the row itself on the invoice in the other location.

### It is PRE-EXISTING, not a regression — proven on staging

The same cross-workplace fixture on staging (`v26.36.8-e2c29c5`), credit CM-4401 issued in Heavy Duty,
cash $40.08 allocated to the Lethbridge invoice:

| document | workplace | staging (pre-fix) prints |
|---|---|---|
| **S-33373** | Heavy Duty | (Credit) CM-4401 **$250.00** — the full face on a $145.04 invoice, i.e. the SV-9647 bug |
| **S-33374** | Lethbridge | Cash **$40.08** only — **no credit row** |

**So the foreign-workplace omission is present on both builds and is not caused by this change.** What
the fix changed is the amount on the row that does render: **$250.00 → $104.96**.

### How this was verified

Counted in the rendered document HTML from `GET /api/invoices/preview`, not read off a screenshot: the
Lethbridge invoice contains **zero** `data-test-id="invoice-payment-row"` elements, an
`invoice-payments-heading` with nothing under it, and `invoice-balance` = $0.00. The Heavy Duty invoice
of the same payment contains the Cash row and the credit row, each exactly once.

### What I am claiming, and what I am not

* **Claiming:** on both builds, an invoice settled by a credit belonging to another workplace prints no
  credit row, so a customer sees *Balance $0.00* with nothing explaining how it was settled — and in
  fixture A the Lethbridge document shows **no payment information at all**.
* **Not claiming:** that SV-9647 caused it. It reproduces byte-for-byte on the pre-fix build.
* **Not claiming** it is out of scope either — it is one query away from what this ticket touches, and
  the handoff's own reasoning is about exactly this flow. Whether it becomes its own ticket is the QA
  lead's call.

## §0e — The customer's own document type: a matched PART-SALE pair, now that receiving works

With the right receive screen (§0c) the staging part sales could be driven to invoice, so the fixture
from §1 — which is a **part sale**, the thing Brian Orban actually complained about — now exists on both
builds with **identical totals and identical credit faces**.

| | BEFORE — staging `v26.36.8-e2c29c5` | AFTER — branch `v26.36.8-fc4dd05` |
|---|---|---|
| Small invoice | **P2-2145**, $4.66 (part sale `0dcaa2bc…`) | **INV-P9647-248**, $4.66 |
| Large invoice | **P2-2146**, $87.74 (part sale `c40b9af5-1ecf…`) | **INV-P9647-249**, $87.74 |
| Credits | CM2-4402 **$22.00** · CM2-4403 **$65.98** | CM-4189 **$22.00** · CM-4190 **$65.98** |
| Payment | one CASH payment, both credits *Fully consumed*, remainder $4.42 | same |

### The $4.66 document, side by side

```
BEFORE (staging)                          AFTER (fix branch)
Total                       $4.66         Total                       $4.66
Payments                                  Payments
  (Credit) CM-4402         $22.00           (Credit) CM-4189          $1.17
  (Credit) CM-4403         $65.98           (Credit) CM-4190          $3.49
BALANCE                     $0.00         BALANCE                     $0.00
                    ——————————                                ——————————
payments printed           $87.98         payments printed            $4.66
```

**$87.98 of credits printed on a $4.66 invoice**, with the document still ending *BALANCE $0.00* — the
reported defect, on the reported document type, reproduced from scratch. On the fixed build the same
invoice prints $1.17 + $3.49 = $4.66, and the remainder of each memo appears on the invoice that
consumed it.

`$87.98` and `$87.99` appear nowhere on the fixed document, and `$22.00` / `$65.98` appear nowhere on it
either — searched in the rendered text.

**So the pair now exists twice over: once on work orders (§0d, $145.04 / $406.09) and once on part sales
(here, $4.66 / $87.74). Both shapes give the same answer.**
