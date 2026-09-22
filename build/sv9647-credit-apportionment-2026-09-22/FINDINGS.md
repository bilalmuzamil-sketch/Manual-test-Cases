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
