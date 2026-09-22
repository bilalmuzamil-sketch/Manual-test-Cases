# SV-9697 — Delete Part Sale P-158 and Associated Incorrect Customer Credit

**Ticket:** https://shopview.atlassian.net/browse/SV-9697 · status TESTING QA · priority Medium
**QA branch:** https://sv9697.qa.shopview.com · API https://sv9697api.qa.shopview.com
**Pre-fix reference:** production https://app.shopview.com (org 72b2cc90…, login bilal.muzamil@shopview.com)
**PR:** shopview#3134 · commit 132baea5f5

## What the ticket actually reports (Rule 66 — the description, not the handoff)

Colby Leonard (Marvin's Farm Equipment Repair) entered the **core charge wrong** on part sale
**P-158**. Correcting it created a credit, the credit amount was also wrong, and it is now sitting on
the customer's account as store credit. **Because a credit exists, P-158 can no longer be reversed** —
even though Colby had already cancelled one of the two credits himself. He wants the order and the
incorrect credit gone so his accounting is not wrong.

His own words: *"I need to reverse it because the core charge is wrong"* · *"now it shows the customer
has an incorrect store credit amount"* · *"I don't want to show a credit on the customers account"*.

## The rulings that define "fixed" (Rule 57 — the source is the document)

Chris Ward, 2026-09-07 (comment 76132) and 2026-09-14 (comment 76513):

1. **Button state mirrors the backend rule.** Credit cancelled or unused → **enabled**. Credit
   genuinely spent → **disabled**, with a tooltip naming the credit and saying what to do.
2. **The confirmation names what it will cancel**, verbatim example:
   > This will re-open and undo the invoice. It will also cancel credit CM-4353 for $600.00.
   If more than one credit is affected, name them all and show the total. **If there is no credit
   involved the confirmation stays exactly as it is today — don't add an empty clause.**
3. **Spent credit still blocks.** Tooltip formats, verbatim:
   * one — `Credit CM-4353 ($600.00) has been applied. Unwind it before reversing.`
   * two — `Credits CM-4353 and CM-4360 ($1,350.00 total) have been applied. Unwind them before reversing.`
   * three or more — `Credits CM-4353, CM-4360 and 2 more ($2,100.00 total) have been applied. Unwind them before reversing.`
4. **The 25 legacy part sales** (dead credit records) keep the disabled button but get corrected copy:
   `Reverse is unavailable for this part sale. Contact ShopView Support to correct it.`
5. **Part sales only in this hotfix.** Service work orders get the new confirmation copy (shared
   dialog) but keep their always-clickable button; the mirrored rule for them is a follow-up.

## Build markers

| Where | Marker | Read at |
|---|---|---|
| Branch `sv9697` | `v26.36.8-132baea` | (re-read at each phase, see below) |
| Production | pre-fix build | 2026-09-18 |

---

## §0 — The pre-fix BEFORE (production)

Read-only: the menu was opened, the Reverse item hovered, the dialog opened where enabled, then
Escape. **Nothing was confirmed and nothing was written on production.**

| Part sale | Reverse | Tooltip / dialog |
|---|---|---|
| P2-58 | **disabled** | `This invoice has an existing credit. Reverse is not allowed.` |
| P2-38 | **disabled** | `This invoice has an existing credit. Reverse is not allowed.` |
| P2-15 | **disabled** | `This invoice has an existing credit. Reverse is not allowed.` |
| P2-11 | **disabled** | `This invoice has an existing credit. Reverse is not allowed.` |
| P2-37 | enabled (no credit) | dialog: `This invoice has been paid, please delete payment before reversing.` |

That first row is exactly Colby's dead end: a greyed-out button, no explanation, no way out.

---

## §1 — Reverse with an UNSPENT credit (the fix) — **PASS**

Seeded on the branch: part sale **P9697-248** (`9b9420f3-953a-497f-9862-309366054877`),
customer **Mayfield Heights Truck Centre**, part `ZZ9697-A1`, invoiced, balance **$420.00**, unpaid,
no credits.

1. ⋮ → **Issue Credit** → untick *Parts are being returned* → Amount **137.25** → Issue Credit.
   `POST 201 /api/credit-memos` → **CM-4189**.
2. The new API read confirms the state the front end is now driven from —
   `GET /api/work-orders/view/{id}`:
   ```json
   "invoiceCredits": [{"number":"CM-4189","amountCents":13725,"status":"open",
                       "statusLabel":"Open","blocksReverse":false,"autoVoidedByReverse":true}],
   "reverseBlockedByCredits": false
   ```
3. ⋮ → **Reverse** is **enabled** (pre-fix this is where the customer was stopped).
4. Confirmation text, read live:
   > **This action will re-open and undo the invoice. It will also cancel credit CM-4189 for $137.25. Are you sure you want to proceed?**

   Chris asked for *"It will also cancel credit CM-4353 for $600.00."* — the clause matches his
   wording exactly, and it is inserted into today's sentence rather than replacing it.
5. Confirmed → `POST 200 /api/invoices/reverse-invoice`. Part sale returns to **Complete**,
   `invoice_status` null, `invoiceCredits` now empty.

Evidence: `ev/P248_unspent_1_menu.png`, `ev/P248_unspent_3_dialog.png`, `ev/P248_unspent_4_after.png`.

---

## §3 (partial) — SPENT credit blocks with the naming tooltip

The dev called this *"the highest-value step"* and flagged it under Known mismatches as not
browser-verified. Read live on the branch:

| Part sale | Reverse | Tooltip |
|---|---|---|
| P-193 | **disabled** | `Credit CM-3956 ($231.00) has been applied. Unwind it before reversing.` |
| P-57 | **disabled** | `Credits CM-2190 and CM-2191 ($240.16 total) have been applied. Unwind them before reversing.` |

Both match Chris's specified one-credit and two-credit formats **byte for byte**. The three-or-more
format is still outstanding.

---

## §3b — no-credit confirmation is unchanged — **PASS (branch side)**

Branch, P9697-248 before any credit existed:
> This action will re-open and undo the invoice. Are you sure you want to proceed?

No empty clause about credits, exactly as Chris required.

---

## §1b — The customer's exact shape: a PARTS credit on a part sale with a core charge

§1 used an amount-only credit. Colby's credit came from **correcting a core charge**, so a second
part sale was built to match his case exactly.

Seeded on the branch — part sale **P-250** (`a1843a0b-fe2a-428f-8705-e5ea5bd81419`), same customer:

1. Add Part → part number `ZZ9697-CORE1` (never requested before), **Source = Vendor**,
   qty 1, cost $180, sell $520, **Core Charge 95**. One part request becomes **two**:
   the part and `Core for ZZAUTOTEST ZZ9697-CORE1`.
2. Authorize → Order (both rows land on purchase order `48234a14…`) → Receive with vendor
   invoice `ZZ9697INV1`. Toast **"Received Parts"**; both rows `status: received`.
3. Invoice → `POST /api/invoices/create` → balance **$645.75**.
4. ⋮ → **Issue Credit**, *Parts are being returned* left ticked. The dialog lists both rows with
   their own Qty Available For Credit. Crediting the part row gives **CM-4190, $546.00**
   (subtotal $520.00 + tax $26.00).
5. The API now reads **`has_part_sale_credits: true`** — the old single flag the pre-fix front end
   greyed the button out from — while **`reverseBlockedByCredits: false`**. That is the fix in one
   line: the old flag still says "a credit exists", and the button no longer listens to it.

**Side observation, not a defect (recorded so nobody re-derives it):** the `Core for …` row can be
ticked on its own in the Issue Credit dialog, but the totals stay **$0.00** and **Issue Credit stays
disabled** — a core is credited with its parent part, never by itself. That is the same
parent-follows rule already recorded for the Process Return screen in the playbook (§AE.4).

---

## §1c — More than one credit: the confirmation names them all and shows the total — **PASS**

A second, amount-only credit of **$60.00** (CM-4191) was added to P-250 so it carried two unspent
credits. Reverse stayed enabled and the confirmation read, live:

> **This action will re-open and undo the invoice. It will also cancel credits CM-4191 and CM-4190 for $606.00 total. Are you sure you want to proceed?**

$546.00 + $60.00 = **$606.00**. Chris's requirement — *"If more than one credit is affected, name
them all and show the total"* — is met, and the sentence is still inserted into today's wording
rather than replacing it.

---

## §2 — Cancel the credit yourself first, then reverse — **PASS**

This is Colby's own move: he cancelled one of his two credits before coming to Support.

On P-250 (which carried CM-4190 $546.00 and CM-4191 $60.00, both open):

1. Customer → **Invoices** tab → the credit row's bin icon (`button_delete_credit_<id>`) →
   dialog **"Reverse Credit — This will reverse the credit. Are you sure you want to proceed?"**
   → REVERSE. `POST 200 /api/credit-memos/{id}/void`. CM-4190 becomes **Voided**.
2. The API now distinguishes the two exactly as Chris's rule requires:
   ```json
   {"number":"CM-4191","status":"open",  "blocksReverse":false,"autoVoidedByReverse":true},
   {"number":"CM-4190","status":"voided","blocksReverse":false,"autoVoidedByReverse":false}
   ```
3. ⋮ → **Reverse** — still enabled — and the confirmation names **only the one it will actually
   cancel**:
   > **This action will re-open and undo the invoice. It will also cancel credit CM-4191 for $60.00. Are you sure you want to proceed?**

   The already-cancelled CM-4190 is not mentioned. No empty clause, and no claim about a credit it
   will not touch.
4. Confirmed → `POST 200 /api/invoices/reverse-invoice`; part sale back to **Complete**.

**Field-by-field check of the credit records across the reverse** (customer transaction list,
30 fields per record, before vs after):

| Credit | Result |
|---|---|
| CM-4189 (other part sale) | **identical on all 30 fields** — untouched |
| CM-4190 (already cancelled) | `status` stays **voided**, amount stays **−$546.00**; **no second void** |
| CM-4191 (open) | `unapplied` → **voided**, as the confirmation promised |

**One honest note:** both P-250 credits lose their `origin_invoices` back-reference, because the
invoice they pointed at no longer exists after the reverse. That is the invoice going away, not a
change to the credit — the status, the amount and the memo are all unchanged on CM-4190.

---

## §3 — A genuinely SPENT credit still blocks, and the refusal names it — **PASS for one and two credits**

The developer flagged this as *"the highest-value step"* and listed it under Known mismatches as not
browser-verified. Read live on the branch, hovering the disabled Reverse item:

| Part sale | Spent credits | Tooltip, verbatim | Chris's spec |
|---|---|---|---|
| P2-193 | CM-3956 | `Credit CM-3956 ($231.00) has been applied. Unwind it before reversing.` | **exact match** |
| P2-57 | CM-2190, CM-2191 | `Credits CM-2190 and CM-2191 ($240.16 total) have been applied. Unwind them before reversing.` | **exact match** |

The API agrees: on both, `reverseBlockedByCredits: true` and every credit carries
`status: "fully_consumed", blocksReverse: true`.

**The three-or-more format was NOT reproduced — honest limit, see below.**

---

## §4 — Regressions on the shared surfaces

⚠️ **CORRECTION TO AN EARLIER VERSION OF THIS DOCUMENT.** It first recorded a service-work-order test
against **S-16654 with NO credit**, found the wording unchanged, and concluded that this confirmed
Chris's ruling. **That test did not touch the thing that changed.** The developer's checklist step 8
asks for a service work order **WITH an unspent credit**, where the confirmation should now **name**
the credit — new in `ac94c66342`. The no-credit test could never have shown that either way, and the
conclusion drawn from it was not supported. It was re-run properly:

**Service work order S-16654, invoiced, with an unspent credit CM-4199 ($250.00) attached** — ⋮ →
Reverse is enabled and the confirmation reads:
> **This action will re-open and undo the invoice. It will also cancel credit CM-4199 for $250.00. Are you sure you want to proceed?**

**The confirmation names the credit — step 8 PASSES.** The earlier no-credit observation still stands
on its own (unchanged wording when no credit is involved), but it is not evidence about this change.

**Paid-invoice guard still takes precedence:** on P2-92 (paid, one open credit) Reverse is enabled and
clicking it gives the pre-existing **"This invoice has been paid, please delete payment before
reversing."** — the credit change has not displaced the payment guard.

---

## What was NOT done, and why — every item names who ruled it out

⚠️ **THIS SECTION WAS REWRITTEN.** An earlier version of it called four things "honest limits". Two of
them were not limits at all — they were work I had not done, and both are now done and recorded in §8
and §10. The rule I now hold myself to: a check is only outstanding when the developer or the QA lead
has ruled it out in writing, or the dependency genuinely cannot be obtained. Everything else is
untested work, however well the paragraph explaining it is written.

**RESOLVED — the three-or-more spent-credit tooltip.** Recorded here as a limit; it was not one. The
missing piece was that a credit is spent by ticking the invoice **and** the credit together in
Customer → Invoices and taking a payment — not by the "Applied credit" payment method, which makes a
held deposit and consumes nothing. Once that was found, all three formats were produced in about
twenty minutes. See **§8**.

**RESOLVED — the credited line and the stock quantities.** Also recorded as a limit. The missing piece
was that an inventory part on a part sale has to be **Authorized** and then **Picked** before stock
moves at all. See **§10**.

**BLOCKED, with the blocker named — the portal-payment precedence check (step 7).** All 98 invoiced or
paid work orders on the branch were read and none is portal-paid, and the customer portal's own
sign-in returns a server error on this environment, so no portal payment can be made. The QA lead has
ruled this one out: *"Portal Payments can not be tested on QA, for that we have to ask the developer
to enable Portal and Billing on the QA branch specially. SO you can SKIP portal part."* See **§9**.

**(c) The corrected copy for the 25 legacy part sales.** Chris ordered
`Reverse is unavailable for this part sale. Contact ShopView Support to correct it.` for the
pre-rebuild part sales whose credit records are empty. **Those part sales are not on this branch at
all.** I checked **every one of the 96 part sales** via `GET /api/work-orders/view/{id}`: only five
carry any credit, and every one of those has a real credit record behind it —

| Part sale | Credits | Blocked |
|---|---|---|
| P2-193 | CM-3956 fully consumed | yes |
| P2-57 | CM-2190, CM-2191 both fully consumed | yes |
| P2-54 | CM-2177 fully consumed | yes |
| P2-38 | CM-2070 fully consumed | yes |
| P2-92 | CM-2821 open | no |

Nothing on this branch shows `reverseBlockedByCredits: true` with an empty credit list, which is the
shape those 25 have. That copy needs either a seeded legacy record or a check on production after
release.

**(d) The 25-vs-23 count** in the developer's analysis could not be re-derived here for the same
reason — the records are not on this branch.

---

## §5 — A REFUNDED credit blocks the reverse, with its own wording — **PASS** (checklist step 5)

The developer flagged this as *"New in ac94c66342 and pending PO sign-off, so flag it rather than fail
it if the wording differs"*, and his own caveat says all three blocked states were **staged directly
in the local database** because *"none of those states occurs naturally outside production"*.

**It is reachable through the UI.** Customer → Invoices → the credit row's middle icon
(`button_cash_out_credit_<id>`) opens **Cash Out Credit** (Date · Amount, pre-filled · Payment Method ·
Reason). Choosing **Cash** and confirming turns the credit into:

```json
{"number":"CM-4196","amountCents":1200,"status":"closed_via_refund",
 "statusLabel":"Closed via Refund","blocksReverse":true,"autoVoidedByReverse":false}
```

and `reverseBlockedByCredits` flips to **true**. Hovering the now-disabled Reverse gives, live:

> **Credit CM-4196 ($12.00) has been refunded. Reverse the refund before reversing this invoice.**

**The wording matches his expectation exactly**, and it follows the same shape as the applied-credit
tooltip — the credit named, the amount in brackets, and what to do about it.

**Precedence is right too:** P-250 carried the refunded CM-4196 **and** two still-open credits
(CM-4197 $13.00, CM-4198 $14.00). Only the refunded one blocks, and the tooltip names only it.

Evidence: `ev/` → `cashout4196c_1_dialog.png`, `P250refund_1_menu.png`, `P250refund_2_tooltip.png`.

⚠️ **A trap worth recording:** the Cash Out dialog fills correctly and its **Cash Out** button reports
`disabled=false`, but a coordinate click on it posts **nothing** — no request, no toast, no change.
Clicking the same button through its test-id (`button_confirm_dialog`) with Playwright's actionability
click works. Two runs were lost to this before the state appeared.

---

## §6 — The credited line after a reverse (checklist step 10) — **half verified at the time; the other half is now done in §10**

**Verified:** on P-250, after the part was credited and the invoice reversed, the credited line is
**still present on the order at quantity 0**, with its core line alongside it at quantity 1:

| Line | Quantity | Status |
|---|---|---|
| ZZAUTOTEST ZZ9697-CORE1 | **0** | received |
| Core for ZZAUTOTEST ZZ9697-CORE1 | 1 | received |

That is exactly what the checklist predicts — *"the credited line stays visible on the order (quantity
may be 0)"*.

**NOT verified — and I am not going to imply otherwise:** the second half of that step, *"part/
inventory quantities return to their pre-credit values after a reverse"*. The part used here was
**vendor-sourced**, so it never entered inventory, and no pre-credit inventory snapshot was taken.
Proving it needs an **inventory-sourced** part with a snapshot taken before the credit and re-read
after the reverse. That is a clean, runnable test — it simply has not been run.

---

## §7 — Checklist step 9: the shared reverse dialog, on the OTHER two surfaces

The developer's step 9 reads: *"Customer → Transactions → reverse a credit, and reverse a deposit.
Expect: unchanged — same dialog was modified."* Both halves are now driven live.

### 9a — Reverse a credit  → PASS (recorded in §1/§2)

### 9b — Reverse a deposit → PASS

**What the deposit table does with the Reverse control.** Read from the deployed build
(`/js/DepositsTable.C3MiUjhA.js` on `v26.36.8-132baea`), then confirmed on screen:

| deposit shape | Reverse control | tooltip |
|---|---|---|
| `status="held"` **and** no work order **and** raised by a payment (an *Excess Payment*) | **disabled** | "To remove this deposit, apply it to an open invoice. Refunding to the customer is coming soon." |
| `status="applied"` | **disabled** | "To undo this deposit, reverse the payment that applied it — the deposit will return to held." |
| any other held deposit (e.g. a deposit taken against a work order) | **enabled** | "Reverse" |

This guard is the deposits table's own, long-standing logic. It is **not** SV-9697's, and SV-9697
did not change it.

**The live run.** DEP-4703 on Mayfield Heights Truck Centre is the first shape (Excess Payment, no
work order), so its Reverse is greyed out by design — it could not be the test. A reversible deposit
was seeded instead: **DEP-4705, $150.00 cash, on work order S9697-17358**, customer *Andreasen Truck
& Equipment Repair* (`POST /api/deposits`, setup only — the deposit table has no create surface).

Clicking Reverse on that row opened the shared confirmation dialog, verbatim:

> **Confirmation**
> This action will reverse the deposit and undo any amounts it applied to invoices. The deposit
> record is preserved for audit history. Are you sure you want to proceed?
> *Cancel · Reverse*

Confirming sent `POST /api/deposits/1d542d1f-…/reverse` → **200**, and DEP-4705 left the Open-only
list (status `reversed`); DEP-4704 beside it was untouched.

**Why this is the regression the developer wanted.** The deposit copy is the deposit's own — it
talks about amounts applied to invoices and audit history, and it carries **none** of SV-9697's
credit-memo wording (no credit is named, no "this credit will be cancelled" line). The shared
dialog still renders its per-type copy correctly after the change.

Evidence: `ev/deprev_1_list.png`, `ev/deprev_2_dialog.png`, `ev/deprev_3_after.png`.

**Driven by hand vs by API.** The reverse itself — the thing under test — was clicked in the UI and
the dialog read off the screen. Only the seeding of a reversible deposit used the API, because the
deposits table has no "add deposit" control at all.

---

## §8 — Checklist steps 4 and 6, reached through the REAL apply flow — **PASS**

§3 read the one- and two-credit tooltips off part sales that were **already** in a spent state in the
QA dataset. The developer's step 4 asks for something stricter, and says so: *"reaching it through
this apply flow is exactly what is untested."* This section does that — every spent state below was
produced by applying a credit to an invoice in the UI, on this build.

### How a credit is actually spent (the flow that was missing)

There is no "apply credit" button anywhere. A credit memo is spent by **taking a payment**:
Customer → **Invoices** → tick the invoice **and** tick the credit row → **New Payment**. The dialog
lists the credit underneath the invoice with the hint **"Fully consumed"** and subtracts it from the
money due, so the shop pays the remainder. `POST /api/customer-account/create-customer-payment`.

*(The "Applied credit" payment method is a different thing entirely — it creates a held deposit
marked Excess Payment and consumes no credit memo. Recorded so nobody loses the hour again.)*

### First, the refund instruction was followed — and it works

P-250 was carrying **CM-4196 refunded**, which blocks. Chris's refund tooltip tells the shop to
*"Reverse that refund on the Payments tab before reversing this invoice."* Done exactly as written:
Customer → **Payments** → the Refund row → the bin icon, whose tooltip is **"Remove"** (precisely as
Nemanja described) → *"This action will reverse the payment for all invoices associated with it…"*
→ Reverse. `POST 201 /api/customer-account/reverse-customer-payment`.

**CM-4196 went straight back to `open`, and `reverseBlockedByCredits` returned to `false`.** The
instruction in the tooltip is followable and it clears the block — which is the half of step 5 that
a tooltip on its own cannot prove.

### Then the three tooltip formats, each produced by spending one more credit

P-250 carried three open credits: CM-4196 $12.00, CM-4197 $13.00, CM-4198 $14.00.

| # spent | how it was spent | Reverse | tooltip, verbatim | Chris's spec |
|---|---|---|---|---|
| 1 | CM-4196 → invoice **P-252** (a different invoice), $40.98 cash + $12.00 credit | **disabled** | `Credit CM-4196 ($12.00) has been applied. Unwind it before reversing.` | **exact** |
| 2 | CM-4197 → invoice P-250, $47.75 cash + $13.00 credit | **disabled** | `Credits CM-4197 and CM-4196 ($25.00 total) have been applied. Unwind them before reversing.` | **exact** |
| 3 | CM-4198 → invoice **P-251** (payment removed first to re-open it), $91.00 cash + $14.00 credit | **disabled** | `Credits CM-4198, CM-4197 and 1 more ($39.00 total) have been applied. Unwind them before reversing.` | **exact** |

$12 + $13 = **$25.00**. $12 + $13 + $14 = **$39.00**. Both totals correct.

The three-or-more form names two, counts the rest and shows the combined total — Chris's decision 3,
met to the word. **This is the format that was outstanding after §3, and it is now verified.**

The API tracked each step: every credit moved `open` → `fully_consumed` with `blocksReverse: true`
as it was spent, and `reverseBlockedByCredits` went `false` → `true` on the first one.

Evidence: `ev/ap1_ready.png`, `ev/ap1_after.png`, `ev/ap2_ready.png`, `ev/ap3_ready.png`,
`ev/step4_one_2_tooltip.png`, `ev/step6_two_2_tooltip.png`, `ev/step6_three_2_tooltip.png`,
`ev/paytab_dlg.png`.

### One thing the developer asked Chris about that is NOT settled — flagged, not failed

Nemanja's comment of 18 Sept (07:22) asks Chris for a **mixed** wording — when some blocking credits
were applied and others refunded:

> Credits CM-4353 and CM-4360 ($1,350.00 total) **have been applied or refunded.** Unwind them before reversing.

He states plainly that this one **is not implemented** and that mixed sets keep the "have been
applied" wording. **Chris has not answered.** Our sets above were all-applied, so the gap did not
show here — but it is real, it is unanswered, and it belongs in the outstanding list rather than in
a pass or a fail.

---

## §9 — Checklist step 7: portal-paid invoice takes precedence — **BLOCKED, and here is exactly why**

Step 7 asks for an invoice **paid through the customer portal**, which should keep Reverse disabled
with the portal message ahead of the credit tooltip. This is the one step that could not be produced,
and the reason is concrete, not a shrug.

**1. No such invoice exists in the QA dataset.** The flag lives at
`invoice.customer_transaction.has_portal_payment`, served by `GET /api/invoices/{id}/view`. **All 98
invoiced or paid work orders on this branch were read and every one returns
`has_portal_payment: false`.** Nothing to hover.

**2. The customer portal cannot be entered from here — it is returning a server error.** The portal
is a separate application (`shopview-portal-feature-branch-…laravel.cloud`), reached from
**profile menu → "Customer Portal New"**, which mints a token (`POST /api/token` → 200) and then
posts it to the portal's `sso-login`. Clicking it opens **no tab and shows no message**. Driving the
same call directly explains it:

```
POST https://shopview-portal-feature-branch-xn74b9.laravel.cloud/sso-login
  → HTTP 500
    {"message":"Malformed UTF-8 characters, possibly incorrectly encoded",
     "exception":"InvalidArgumentException",
     "file":".../Illuminate/Http/JsonResponse.php","line":91}
```

Three request shapes were tried (with and without `returnJson`, with and without `destination`) —
**all 500.** The portal's own `/login` page loads, but signing in needs a customer-portal account we
do not have and cannot create without receiving an invitation email.

**This is not SV-9697's fault** — it is a different application on its own feature branch, and it
blocks the step rather than failing it.

**What IS established, and labelled honestly as source-read, not observed.** The disable rule and the
tooltip order are plain in the deployed bundle `InvoiceActionBar.CDwAp5SX.js` on `v26.36.8-132baea`:

* the Reverse item is disabled when **portal-paid OR blocked-by-credits OR blocked-by-legacy-credit**;
* the tooltip is chosen in this order — **portal first**, then the credit message, then the legacy
  Support message:

```
j = customer_transaction.has_portal_payment === true
K = workOrder.reverseBlockedByCredits === true
z = workOrder.reverseBlockedByLegacyCredit === true
disable = j || K || z
tooltip = j ? "This invoice was paid through the customer portal. Credits and refunds must be
               handled through the portal."
        : G ? <credit message>
        : z ? "Reverse is unavailable for this part sale. Contact ShopView Support to correct it."
```

So the precedence the step describes is what the shipped code does, and the portal wording is
verbatim above. **It has not been seen on screen, and this section does not claim it has.**

**What would unblock it:** either the portal application fixed on this environment plus a
customer-portal login, or one QA invoice with a portal payment against it.

---

## §10 — Checklist step 10, second half: inventory returns to its pre-credit value — **PASS**

§6 proved the credited line stays on the order. It could not prove the other half — *"part/inventory
quantities return to their pre-credit values after a reverse"* — because P-250's part was
vendor-sourced and never entered stock. A clean inventory run was built for it.

**The part sale (all of it driven on screen except the two setup calls noted):**

1. Parts → Part Sales → **New Part Sale** → customer *Mayfield Heights Truck Centre* →
   **P9697-253** (`31e8f1de-6080-4db8-a0bb-0c3911195cc0`).
2. **Add Part** → part number `MD668D` (*ATF Bulk- Mobil Delvac 1 ATF 668*), Source **Inventory**,
   bin quantity **2**, sell $16.82. Row lands as **Quoted**; Parts total $33.64.
3. **Authorize** → the row becomes **In Stock** and grows a **Pick** action.
4. **Pick** → `POST 201 /api/work-orders/part/perform-request-status-action`; row becomes
   **Received**.
5. Complete + invoice (setup, via the API).
6. ⋮ → **Issue Credit**, *Parts are being returned* ticked, the MD668D row selected, Qty To Credit 2
   → **CM-4200, $35.32** ($33.64 + $1.68 tax).
7. ⋮ → **Reverse** — enabled, confirmation reads *"This action will re-open and undo the invoice. It
   will also cancel credit CM-4200 for $35.32…"* → Reverse.

**The inventory numbers, read live at every stage from `GET /api/inventory/parts?search=MD668D`:**

| Stage | MD668D on hand |
|---|---|
| Before anything | 280 |
| After the part was added (still Quoted) | 280 — *a quoted request does not take stock* |
| **After Pick — the pre-credit value** | **278** |
| After invoicing | 278 |
| After the credit (2 returned to stock) | 280 |
| **After the reverse** | **278 — back to the pre-credit value exactly** |

**And the line is still there.** After the reverse the part row still reads
`MD668D · Inventory · Received` with its quantity cleared, and its row actions are back. Same shape
as P-250 in §6.

`CM-4200` came back **voided**, as the confirmation promised.

**Step 10 is now verified in full** — the line half in §6, the inventory half here.

Evidence: `ev/step10c_1.png`, `ev/step10c_2.png`, `ev/step10_rev_3_dialog.png`,
`ev/step10_after_credit.png`, `ev/step10_after_reverse.png`, `ev/pick1_after.png`.

**Two things worth keeping (both cost time):**

* **An inventory part on a part sale is not picked by adding it.** It has to be **Authorized**
  first, which turns the row into *In Stock* with a **Pick** action; only the Pick moves stock. An
  earlier attempt invoiced without that step, and stock never moved — which is why §6 was left half
  done rather than wrong.
* **The Issue Credit part checkbox does not respond to a click.** Neither a coordinate click nor
  Playwright's own click changes `aria-checked`. **Focus it and press Space** — then the row's
  *Qty To Credit* field appears pre-filled and the totals update.

---

## §11 — The branch REDEPLOYED mid-pass, and the portal was switched on — both caught by the pre-post gate

**The build moved while I was assembling the comment.** Tested on **`v26.36.8-132baea`**; the live
marker at post time read **`v26.36.8-4ee1c0f`**, last-modified **Fri 18 Sep 2026 14:32:57 GMT**. The
cause is on the ticket: the QA lead asked Nemanja at **09:47:11-0500** to enable the portal, and
Nemanja replied at **09:57:32-0500** *"I've set up portal as well here is the url … but you should
access it through the navigation in the core app."* Nothing was posted against the dead build.

**The three files this fix lives in are byte-identical across the redeploy** (sha256 compared against
the copies pulled during testing): `invoiceCreditReverse.C3GmBgwF.js`, `InvoiceActionBar.CDwAp5SX.js`,
`DepositsTable.C3MiUjhA.js`. That is code identity, not observation, so the verdicts were re-observed
as well.

**Re-observed live on `v26.36.8-4ee1c0f`:**

| Path | Result |
|---|---|
| Enabled path — part sale P9697-253 re-invoiced with an unspent credit CM-4201 ($41.50) | Reverse enabled; confirmation reads *"…It will also cancel credit CM-4201 for $41.50…"* |
| Blocked path — P9697-250, three spent credits | Reverse disabled; tooltip byte-identical: *"Credits CM-4198, CM-4197 and 1 more ($39.00 total) have been applied. Unwind them before reversing."* |
| Deposit dialog — DEP9697-4706 | Unchanged, deposit wording only |

### Step 7 (the portal) — the portal is now UP, and the payment still cannot be made

This supersedes §9's second reason. The portal's sign-in no longer errors: **profile menu → "Customer
Portal New"** opens `…laravel.cloud/invoices` and lists our invoices, **P-253 among them, Unpaid at
$35.32** — the ideal specimen, because it already carries the unspent credit CM-4201, so a portal
payment on it would put the portal message and the credit message in direct competition.

**The payment itself fails.** *Pay Now* → *"Who is this payment for?"* → contact selected → amount
pre-filled **$35.32** → **Continue to checkout** →

```
POST 400 /invoices/10133af7-1db4-4168-981d-aecac83d093a/create-checkout-session
{"message":"Unable to process payment at this time. Please try again later."}
```

and the invoice page shows that same sentence. So the card checkout session cannot be created on this
branch — the portal is enabled, the payment processor behind it is not.

**No portal-paid invoice exists in our organisation to observe instead.** All 98 invoiced or paid work
orders read `has_portal_payment: false`. The portal's own Payments list does hold three historic
payments from June, but they belong to a **different organisation** (the portal opens as *Owner Demo*,
and neither *New Customer Port…* nor *QA Foothills Group Inc* appears in our company list).

**So step 7 is still not observable, but for a different and much narrower reason than before** — not
"the portal is unreachable" but "the portal works and its card checkout returns a 400".

---

## §12 — The QA comment (posted)

**Comment 76831 on SV-9697**, posted 2026-09-18. Built by `build_comment.py`, wiki markup through the
v2 API, with the six exhibits uploaded first as real Jira attachments (61088–61093).

**The verdict is deliberately conditional**, on the QA lead's instruction: *"lets reference this for
the portal part at the TOP of your comment and say its ONLY qa passed after Nemanja confirms that the
portal which is not working at the moment is confirmd to be working and verified the portal part by
Nemanja."* So the first line reads **"PASSED ON EVERYTHING EXCEPT THE PORTAL CHECK — NOT A FULL QA
PASS YET"**, and the panel under it links Nemanja's comment 76830 (*"I will check it on Monday and
test the portal part."*) and states plainly that the ticket is only QA-passed once he has confirmed
the portal works and verified that part himself.

**Pre-post gate:** build marker re-read live (`v26.36.8-4ee1c0f`, unchanged since the re-checks) ·
ticket state re-read (Blocked, priority Medium, newest comment 76830 already read and referenced) ·
reader-facing text scanned for machine-authored tells, none found · no "Technical details for
developers" section, per the QA lead's 2026-09-18 instruction.

**Read back from Jira after posting:** six media nodes, every one `"type":"file"` with an attachment
id — real attachments, not external links — in the intended order at 900px wide with their correct
heights; twelve table rows (header + eleven checks); the first line is the conditional verdict; the
link to comment 76830 is present.

---

## §13 — Chris re-specified the blocked-button wording AFTER the build (comment 76885, 18 Sep 15:50)

Read live 2026-09-20. **Build unchanged** — `v26.36.8-4ee1c0f`, last-modified Fri 18 Sep 14:32:57 GMT,
same as when it was tested — and the strings in `invoiceCreditReverse.C3GmBgwF.js` are the ones
verified on Friday.

**Chris has replaced the approved copy.** His reasoning, in his words: *"'Unwind' is not our word. It
appears nowhere in the product — eleven times in code comments and zero times in anything a customer
reads."* The product says **used** (column *Amount used*, empty state *No credits used*) and **Void**
(*Void payment / Void refund / Void credit memo / Void invoice*, 438 uses), and
*"there is no unapply verb on a credit"* — a credit is spent by creating a zero-cash payment, and
voiding that payment is the only way back.

| Case | SHIPPED on the branch | CHRIS'S RULING, 18 Sep 15:50 |
|---|---|---|
| One credit, used | `…has been applied. Unwind it before reversing.` | `…has been used. Void the payment that used it before reversing this invoice.` |
| One credit, refunded | `…has been refunded. Reverse the refund before reversing this invoice.` | `…was refunded. Void that refund before reversing this invoice.` |
| Two | `Credits A and B ($X total) have been applied. Unwind them before reversing.` | `Credits A and B ($X total) have been used. Void them before reversing this invoice.` |
| Three or more | `Credits A, B and N more ($X total) have been applied. Unwind them before reversing.` | `Credits A, B and N more ($X total) have been used. Void them before reversing this invoice.` |

**All four blocked-path strings change. The confirmation strings do NOT** — Chris did not touch
*"It will also cancel credit CM-xxxx for $NN.NN."* — so checks 1, 2, 3 and 8 are unaffected.

**This is not a defect and Nemanja is not at fault.** He built the copy that was approved on
14 September; Chris changed it on the 18th, after the build. It is a spec change, and under Rule 32
the newest authoritative product source wins — so the shipped strings are now out of date.

**Two consequences for comment 76831:**

1. **Checks 4, 5 and 6 were passed against wording that has since been superseded.** They were correct
   against the standard in force when they ran, and the behaviour they prove is unaffected — but the
   copy no longer matches what Chris wants, so they cannot stand as plain PASSED.
2. **The open PO question at the bottom of the comment is now ANSWERED, and the answer dissolves it.**
   The comment says Chris had not ruled on the mixed applied-or-refunded wording. He has, and his fix
   removes the need for a third sentence: *"'used' is true of a credit spent on an invoice and one
   cashed out as a refund, and 'Void' undoes both, so there is no mixed case needing a third
   sentence."*

**One question Chris leaves open for the developer:** *Void refund* as a labelled control lives in the
Accounting module; in the core app the same undo is the **Remove** icon on the Payments tab. He would
rather the sentence match the button in front of the shop — *"if that is the case, say Remove for them
and keep Void everywhere else."* So whether these shops are on Accounting decides one word.

**On the portal, Chris has diagnosed our blocker.** The QA-branch portal is served from
`shopview-portal-feature-branch-xn74b9.laravel.cloud`, built from **portal main — 2026-08-28, 91
commits behind develop**, and *"endpoints that exist on develop are not there at all."* That is a
stale portal build, not a regression in this fix — which matches the 400 on `create-checkout-session`
exactly, and is worth Nemanja knowing before Monday.


---

## §14 — Comment 76831 updated in place (2026-09-20)

Updated rather than stacked, per the one-complete-comment convention. Changes:

* **The verdict panel now carries TWO outstanding items**, not one — the portal check (linked to
  Nemanja's 76830) and the wording, linked to Chris's 76885, with the explicit note that the shipped
  messages are the ones approved on 14 September and this is a copy change, not a defect.
* **Rows 4, 5 and 6** read *"BEHAVIOUR PASSED — wording now superseded"* instead of a plain PASSED.
* **Row 11** notes Chris has confirmed the legacy part sales stay blocked.
* **A new section** sets the four shipped strings beside the four Chris now wants, states that the
  confirmation copy is untouched so checks 1/2/3/8 stand, gives his reasoning in plain words, and
  carries his open question for the developer — *Void* vs *Remove* depending on whether these shops
  are on Accounting.
* **The EX2 and EX3 captions** no longer say the pictures show "the wording that was agreed"; they
  say the behaviour is right and that the copy in the picture is the 14 September version Chris has
  since replaced.
* **The portal section** now carries Chris's diagnosis — the portal host is built from portal main
  2026-08-28, 91 commits behind develop — as the likely cause, and says P-253 is left ready.
* **The closing section** no longer says the mixed applied-or-refunded question is unanswered. It
  records that Chris answered it and that his fix removes the need for a third sentence.

**Pre-post gate:** build marker re-read live (`v26.36.8-4ee1c0f`, unchanged) · ticket re-read
(Blocked, Medium, newest comment 76885 — the one being folded in) · text scanned for
machine-authored tells, the only hit being the word *endpoints* inside Chris's own quoted diagnosis ·
no technical-details section.

**Read back after the update:** six media nodes, all `"type":"file"`, right order and sizes ·
17 table rows (11 checks + the new 4-row wording table + their headers) · first line is the two-item
verdict · both comment links present · three superseded-wording rows.

---

## §15 — SELF-AUDIT of this whole pass against Skills 19 and 20 (2026-09-21)

The QA lead supplied two new skill files — `build/skills/19-HOW-NOT-TO-TEST.md` (*"I judged the
product from a proxy instead of from the screen"*) and
`build/skills/20-API-VALUES-VS-WHAT-THE-USER-SEES.md` (*"a value read from an endpoint is evidence
about the endpoint… never to decide a pass or a fail"*). This section audits the eleven checks in
comment **76831** against that rule. **It was written before any repair**, so the scale is on the
record rather than absorbed into a fix.

### The result, per check

| # | Check | Where the verdict came from | Verdict on the verdict |
|---|---|---|---|
| 1 | Reverse with an unspent credit | Reverse item observed **enabled**; confirmation sentence **read off the dialog**; API quoted after it as agreement | **Screen. Sound.** |
| 2 | Credit cancelled by hand first | bin icon clicked on screen, dialog read, confirmation sentence **read off the dialog** | **Screen. Sound.** |
| 3 | No-credit confirmation unchanged | sentence **read off the dialog** | **Screen. Sound.** |
| 4 | Applied credit blocks, message names it | **hovered** the disabled item, tooltip read verbatim | **Screen. Sound.** |
| 5 | Refunded credit blocks, own wording | Cash Out driven on screen, **hovered** tooltip read verbatim | **Screen. Sound.** |
| 6 | Two and three spent credits | **hovered** tooltips, all three formats read verbatim | **Screen. Sound.** |
| 7 | Portal-paid invoice | not run — blocker named, and the QA lead ruled it out | **Not a verdict.** |
| 8 | Service work order with an unspent credit | confirmation sentence **read off the dialog** | **Screen. Sound.** |
| 9 | Deposit reverse elsewhere unaffected | dialog opened and read on screen; disable predicate read from the bundle **after** the screen, as explanation | **Screen. Sound.** |
| 10 | **Credited line stays; stock returns to where it was** | line half: **screen** (part row at quantity 0). **Stock half: `GET /api/inventory/parts?search=MD668D`, every one of the six figures** | **⚠️ THE ONE HIT.** |
| 11 | Legacy empty-credit part sales | developer's own note — not testable here | **Not a verdict.** |

### The hit, stated plainly

Check 10 is worded *"part and stock quantities return to where they were"*. **A stock count is a
number a person reads on the Inventory screen.** Every figure behind that half — 280 → 280 → **278**
→ 278 → 280 → **278** — was read from `GET /api/inventory/parts`. Under Skill 20 that is mechanism
**(b), a different layer**: the stored quantity and the quantity the Parts/Inventory screen renders
are two values, and the requirement is about the second one. The endpoint was allowed to decide a
pass, which is the single thing Skill 20 says it may never do.

**And the exhibit is the sharper half of the problem.** `ev/EX6_inventory_returns.png` puts a real
screenshot (the credited line at quantity 0) directly above **a six-row table I typed myself**, in
the same frame, in the same styling, captioned only *"Read live from the branch at every stage."*
That sentence is true and it is not enough: a senior reader sees one exhibit and reads both halves as
captures. Rules 64 and 73 require an **annotated screenshot**; half of EX6 is not a screenshot at
all, and nothing on it says so.

**What I am NOT claiming: I have no evidence the behaviour is wrong.** The stock almost certainly
does return to 278 on the screen as it does in the record. The defect is in the evidence, not
(so far as anything shows) in the product — but "almost certainly" is exactly the word Skill 19 §5
says costs a false pass.

### Two lesser points, checked and cleared rather than waved through

* **The portal absence claim** (*"all 98 invoiced or paid work orders read `has_portal_payment:
  false`"*) is an API **enumeration**, which Skill 20 §3 admits — and the screen half was driven too:
  the portal's own sign-in was opened and returned a server error. **Sound as written.**
* **§13's shipped-wording comparison table** was assembled by reading
  `invoiceCreditReverse.C3GmBgwF.js`. All four of its strings had already been read off the screen
  during §3 and §5, so the bundle is corroboration on top of a screen observation. **Sound**, and the
  bundle read is what let the table be built after the session died.

### What closing this needs

The session cookies expired (~30 h old; `GET` against the API returns **302** to SSO). The branch
itself is up and — importantly — **still on `v26.36.8-4ee1c0f`**, `last-modified` Fri 18 Sep 2026
14:32:57 GMT, etag `7b426f64fdce7ef7d433ee3a45042bca` — **the same build comment 76831 was posted
against**, so a re-observation now is directly comparable rather than a different experiment.

**One fresh cookie set for `.qa.shopview.com`** (`sv_sso_session` / `PHPSESSID` / `cf_clearance`) and
this closes in roughly twenty minutes: seed an inventory-sourced part sale, **read MD668D's on-hand
figure off the Parts/Inventory screen** before the credit, after the credit and after the reverse,
capture each, rebuild EX6 with real captures, and replace the attachment on comment 76831.

There is no self-unblock for it: `quick-login` is itself session-gated and returns the same redirect,
so this is the genuinely-unobtainable case under Standing Rule 85 — a credential this container
cannot mint — and not a habit of skipping.

### The other Skill-19 hit this window, which cost the QA lead a message

I reported `/tmp/atlassian/` as missing and asked him for Atlassian access — **from a listing I had
truncated with `head -5`**. The session was live the whole time; one `GET /rest/api/3/myself` returned
**200**. A truncated `ls` is a proxy, and I read a verdict out of it. Same shape as everything in the
table above.


---

## §16 — Chris asked for checks 4, 5 and 6 to be re-run against his new wording. **The new wording is not built yet.** (2026-09-21)

**What he asked**, comment
[76957](https://shopview.atlassian.net/browse/SV-9697?focusedCommentId=76957), 21 Sep 09:50:
> *"nothing you have already passed is invalidated. Four tooltip strings change; the button
> behaviour, the confirmation and the legacy Support message are all exactly what you tested.
> Re-run checks 4, 5 and 6 against the new wording and this is done."*

He also says in the same comment: *"This is a string-only rebuild and a re-run of steps 4 to 6."*
**The rebuild has not happened.** There is nothing to re-run against yet.

### Established two ways, screen first

**1. On the screen.** Hovering the disabled **Reverse** item (Finance tab → ⋮), live, on
`v26.36.8-4ee1c0f`:

| Part sale | Tooltip today, verbatim | Chris's new copy |
|---|---|---|
| **P2-193** (`405b68e2…`) | `Credit CM-3956 ($231.00) has been applied. Unwind it before reversing.` | *"…has been applied. **Remove the payment that used it on the Payments tab** before reversing this invoice."* |
| **P2-57** (`b7c55aea…`) | `Credits CM-2190 and CM-2191 ($240.16 total) have been applied. Unwind them before reversing.` | *"…have been applied. **Remove the payments that used them on the Payments tab** before reversing this invoice."* |

Both still say **Unwind** — the one word Chris and Nemanja have now agreed appears nowhere in the
product on either line.

**2. In the deployed bundle, as corroboration.** The copy lives in
`js/invoiceCreditReverse.BaWwGD8X.js`, loaded by the Finance page this pass:

* `"Unwind it before reversing."` and `"Unwind them before reversing."` — **both present**
* `"Payments tab"` — **absent**
* any `"Remove th…"` string — **absent**
* `"has been refunded. Reverse the refund before reversing this invoice."` — **still the old refund
  sentence**

### And the chunk is byte-for-byte the same module I read on 18 September

The file name changed (`invoiceCreditReverse.C3GmBgwF.js` → `…BaWwGD8X.js`) which looks like a
rebuild, so it was checked rather than assumed. Diffing the two copies: **same size, 1350 bytes**, and
the **only** difference is the import path and the export binding —
`index.VoHfmjDM.js` → `index.y2Fyik_O.js`, `bb` → `bd`. **Every literal string is identical.** The
earlier name came from the pre-redeploy build `v26.36.8-132baea` recorded in §11, not from a later
change.

`index.html` is unchanged too — **last-modified Fri 18 Sep 2026 14:32:57 GMT, etag
`7b426f64fdce7ef7d433ee3a45042bca`, app-version `v26.36.8-4ee1c0f`** — and it references
`js/index.y2Fyik_O.js`, which is what the browser loads. So the branch has not been rebuilt since
18 September.

### What this means for the ticket

Checks 4, 5 and 6 **cannot be re-run yet** — not blocked by anything on our side, simply waiting on
the string-only rebuild Chris costed in his own comment. The moment it lands, all three are quick:
the fixtures already exist (P2-193 one applied credit, P2-57 two applied credits, and a refunded
credit is one Cash Out away), and the assertion is a straight string comparison against the four
sentences he specified.

**Reported, not assumed:** nothing was failed here. A build that predates a copy decision is not a
defect.

---

## §17 — Check 10's stock figures, now READ OFF THE INVENTORY SCREEN (closes the §15 self-audit hit)

§15 recorded that the stock half of check 10 had been decided from `GET /api/inventory/parts`. It has
now been re-run end to end with **every figure read off Parts → Inventory**, on the same build,
`v26.36.8-4ee1c0f`.

**Part sale `P9697-256` (`8c1b4b33-c7ff-4c81-aa93-869246f5cd37`)**, customer *Mayfield Heights Truck
Centre*, part **MD668D — ATF Bulk- Mobil Delvac 1 ATF 668**, quantity 2, all steps driven on screen:
Add Part → Authorize → Pick → Create Invoice → ⋮ Issue Credit (parts returned, $33.64 + $1.68 tax =
**$35.32**, credit **CM-4203**) → ⋮ Reverse.

**The Inventory screen, at each stage — `Bin Location / Quantity` and `Total Quantity` columns:**

| Stage | Bin Location / Quantity | Total Quantity |
|---|---|---|
| Before anything | SHOP **276** | **276 Available** |
| **After Pick — the pre-credit value** | SHOP **274** | **274 Available** |
| After the credit (2 returned to stock) | SHOP **276** | **276 Available** |
| **After the reverse** | SHOP **274** | **274 Available** — back to the pre-credit value |

Captures: `ev/r3f_s0_baseline_row.png` · `ev/r3f_s1_after_pick_row.png` ·
`ev/r3f_s2_after_credit_row.png` · `ev/r3f_s3_after_reverse_row.png` (plus full-page `_full` versions).

**The verdict is unchanged — check 10 still PASSES — but it is now evidenced by the thing the
requirement is actually about.** The earlier run's figures (280 → 278 → 280 → 278) were correct; they
were simply read from the wrong surface.

**A capture defect caught before it shipped, worth recording.** The first four captures came back
**byte-identical to each other** because the Inventory table scrolls horizontally and a 1500-px clip
cut off before the quantity columns — four pictures of the same left-hand half, each captioned with a
different number. They were only spotted by opening the PNG and looking at it. The fix: a
**2560-px viewport**, scroll every horizontally-scrollable container fully right, then clip on the
row's own bounding box. **Identical hashes are correct here for the matching pairs** —
baseline == after-credit (276) and after-pick == after-reverse (274) — which is the assertion itself.


---

## §18 — Checklist step 7 (portal-paid invoice): the portal now works, a payment went through, and the app has not seen it

Nemanja reported in comment
[76919](https://shopview.atlassian.net/browse/SV-9697?focusedCommentId=76919): *"Portal: fixed, and
working on the QA environment now — so Bilal's outstanding check 7 is unblocked."* That is right about
the portal, and check 7 is still not finished. Here is exactly how far it got.

### The portal is fixed — confirmed, not taken on trust

§9 recorded `POST /sso-login` returning **HTTP 500 "Malformed UTF-8 characters"** on three request
shapes. Driven again today with a freshly minted token:

```
POST https://shopview-portal-feature-branch-xn74b9.laravel.cloud/sso-login
  → HTTP 200 {"message":"SSO login successful","redirect":"https://shopview-portal-feature-branch-xn74b9.laravel.cloud"}
```

The portal opens on **Invoices**, 269 pages of them, signed in as *Owner Demo*.

**A finding worth keeping, because §9 chased it:** the portal **strips the branch prefix from every
number**. The app's `S9697-17580` is the portal's `S-17580`; the app's `P2-161` is the portal's
`P-161`. §9's assumption that no part sale reaches the portal was wrong — **P-193, P-92, P-111 and
P-103 are all there.** Searching the portal for `P9697…` will always return nothing.

### A payment was made, end to end, and it succeeded

Invoice **S-17303** (app `S3-17303`, `3b57e04f-5038-436f-a578-62c4f760c122`), Tucson Truck Center,
Lethbridge - 4310, **$326.55** unpaid.

Portal → **Pay Now** → *"Who is this payment for?"* → customer contact *Justin Davis* → **Next** →
*Select a payment method* → **Card** → **Continue to checkout** → **Stripe Checkout, Sandbox mode**
(`cs_test_…`) → test card `4242 4242 4242 4242`, 12/34, CVC 123, ZIP 10001 → **Pay**.

Result on the portal: **"Payment Successful — Your payment has been processed successfully."**, the
invoice flips to **Paid**, and the portal's *Payments & refunds* panel lists it:

| Date | Status | Customer | Type | Reference | Method | Gross | Fee | Net |
|---|---|---|---|---|---|---|---|---|
| Sep 21, 2026 | **Succeeded** | Tucson Truck Center | Invoice | S-17303 | 💳 Card | **$337.63** | $13.78 | $323.85 |

**A trap worth recording:** the Stripe country defaults to **United States**, so a Canadian postal
code is silently truncated — `T1H6N4` became `164` and the form would not submit. A 5-digit ZIP
(`10001`) works.

### But ShopView has not seen it — so the tooltip still cannot be observed

Back in the app, on the same invoice, switched to the Lethbridge workplace, checked twice about ten
minutes apart:

* **Balance still reads `$326.55`** on the Finance tab.
* **No payment rows at all** (`invoice-payment-row` returns an empty list).
* **Reverse is ENABLED, with no tooltip** — which is the correct behaviour *for an unpaid invoice with
  no credits*. The portal guard has nothing to fire on, because `has_portal_payment` is not true here.

So **check 7 remains unobserved**, and the reason has changed: it is no longer the portal being down,
it is that the successful portal payment has not reached the work order.

### What this is, and what it is not

**It is not SV-9697.** Nothing in this ticket's diff touches payment ingestion; the Reverse guard is
reading the invoice correctly given what the invoice says.

**It is not yet a defect either, and it is not being called one.** A payment-sync job on an interval
longer than ten minutes would produce exactly this, and the portal ships a *PaymentResyncModal*, which
suggests a resync path exists. A third re-check is running.

**What it does mean for the checklist:** step 7 cannot be signed off until a portal payment actually
lands on a ShopView invoice — and, to test the precedence the step is really about, it should land on
a **part sale that also carries a spent credit**, so that the portal message can be seen winning over
the credit message. `P-193` is the natural fixture: it is in the portal, it is a part sale, and it
already blocks Reverse with `Credit CM-3956 ($231.00) has been applied.`

Evidence: `ev/r2_portal_home.png`, `ev/r2_method.png`, `ev/r2_stripe_filled.png`, `ev/r2_paid.png`,
`ev/r2_portal_payments.png`, `ev/r2_portal_tooltip2.png`.

### Followed up rather than left at one attempt

**Three screen checks over roughly forty minutes** — immediately after the payment, ~10 minutes
later, and ~40 minutes later. Every one: balance `$326.55`, no payment rows, Reverse enabled, no
tooltip.

**The portal's own Payments list** (`/payments`) shows the payment is real and settled, alongside the
three checkout attempts I abandoned while working out the Stripe form:

| Date | Status | Customer | Type | Reference | Gross | Fee | Net |
|---|---|---|---|---|---|---|---|
| Sep 21, 2026 | **Succeeded** | Tucson Truck Center | Invoice | S-17303 | $337.63 | $13.78 | $323.85 |
| Sep 21, 2026 | Canceled ×3 | Tucson Truck Center | Invoice | S-17303 | $337.63 | $11.08 | — |

**There is no resync control** on the row — the Actions column is empty for it, so the
`PaymentResyncModal` chunk the page loads is not reachable from here.

**And no invoice anywhere on this branch is flagged as portal-paid.** First pass read
`has_portal_payment` on 60 per workplace; **that was a sample and it was written up as though it were
the population, which is a Rule-50 failure and it reached the posted comment.** Re-run properly against
**every invoiced or paid work order the app returns on both workplaces — 98 on Staging Heavy Duty - 9919
and 97 on Staging Lethbridge - 4310, 195 in all, 0 unreadable**: **zero** come back true, including
S3-17303 itself forty minutes after its payment succeeded. `GET /api/staff/my-workplaces` confirms
there are exactly **two** workplaces, so no location was skipped.

**Honest ceiling on that number, stated because it is not the same as "every record":**
`GET /api/work-orders` **ignores `page`, `limit`, `rowsPerPage` and `offset`** — all four return the
identical 100 rows with `pagination.page` stuck at 1 — and the Work Orders screen has **no paging
control at all**. So 195 is *everything the application hands back*, not provably every row in the
database. The comment now says exactly that.

**Stated as what it is:** the money moved on the payment provider and the portal knows about it; the
shop's own system does not. Whether that is a scheduled job that has not run, a webhook that is not
wired on this branch, or something else, is Nemanja's to say — **it is not a defect claim, and it is
not SV-9697.** What it means for us is concrete: **step 7 cannot be closed until a portal payment
lands on a ShopView invoice.**

---

## §19 — Comment 76831 updated in place (2026-09-21, 16:59 UTC)

Rebuilt as one complete comment rather than chained, per the standing rule. What changed:

* **The status panel** now carries the two live blockers: the new wording is not built, and a portal
  payment succeeded but has not reached ShopView.
* **Checks 4, 5, 6** read *"BEHAVIOUR PASSED - new wording not built yet, cannot re-run"*, with the
  two live tooltips quoted so Chris can see for himself that the branch still says *Unwind*.
* **The wording table** now shows Chris's **21 September** copy (Remove / Payments tab), which
  supersedes his own 18 September version. Both his reversals are explained in one sentence rather
  than as a correction narrative.
* **Check 10** reads *"PASSED - re-checked on the Inventory screen"*, and **EX6 was replaced** with
  **`EX6b_inventory_screen.png`** (attachment **61177**) — four real captures of the Inventory row
  instead of the table of figures the old exhibit carried.
* **The portal section** was rewritten around what actually happened today, and asks Nemanja the one
  question that matters: is there a sync job or webhook for portal payments that is not running here?

**Pre-post gate (Rule 72), run and read before writing:** build marker re-read live —
`v26.36.8-4ee1c0f`, last-modified Fri 18 Sep 2026 14:32:57 GMT, etag `7b426f64…`, **unchanged** ·
ticket re-read — newest comment still **76957**, nothing new since, status now **Blocked** · all six
attachments confirmed present by id · reader-facing text scanned for machine tells — **clean** · no
technical-details section (Rule 84) · one false detail caught and fixed before sending: two sentences
said *"this morning"* when the checks ran through the afternoon.

**Read back after posting:** first line is the verdict panel · **6 media nodes, all `"type":"file"`,
in the intended order** · tables 12 rows (11 checks + header) and 5 rows (4 wording rows + header) ·
`updated` 2026-09-21T11:59:51-0500.

---

## §20 — Claim-by-claim audit of the POSTED comment, and four corrections (2026-09-21, after posting)

Having caught one overstated sentence by re-reading my own posted text, I read the whole comment back
from Jira and checked every factual claim in it against what was actually observed. **Four things were
wrong. None of them was challenged by anyone — they were found by reading.**

| # | What it said | Why it was wrong | Now |
|---|---|---|---|
| 1 | *"I also checked every invoice on both locations - 120 of them"* | **120 was a 60-per-workplace SAMPLE of 195**, written as if it were the population. A false completeness claim, in front of the PO and the developer. | Re-scanned **all 195** (98 + 97, 0 unreadable, zero portal-paid), and the sentence now states the population, the split and the ceiling. |
| 2 | *"P-193, one spent credit"* / *"P-57, two spent credits"* | Those are the **portal's** spellings, used in a paragraph describing **the app's screen**. A developer searching the app for "P-193" finds nothing. | **P2-193** and **P2-57**, the numbers the app itself shows. |
| 3 | *"our P9697-253 is simply P-253 there"* — the example for the prefix finding | **P-253 does not exist in the portal.** I searched for it and got "No results", then used it as the worked example anyway. A reader following it would conclude the whole paragraph was wrong. | Replaced with **P2-193 → P-193**, which I verified by matching customer and amount (Una Truck Center, $700.99). The S-number example was dropped entirely: the app shows **both** `S9697-17580` and `S3-17303` on different surfaces, so I could not state a general rule honestly. |
| 4 | The closing section quoted *"used"* and *"Void"*, and opened *"An earlier version of this comment flagged…"* | Those are Chris's **18 September** words, which **he himself replaced on 21 September** — so the comment was quoting superseded copy as the answer. And the opening was a self-revision narrative, which the QA lead has barred from Jira. | Rewritten to quote the **21 September** wording (*"applied"* / *"Remove"*) and to state the position directly. |

**The pattern in all four: a sentence that was true when it was drafted, or true on a different
surface, carried into a deliverable without being re-checked against what was actually observed.**
Numbers 1 and 3 are the dangerous ones — both would survive any amount of re-reading *for sense*, and
both only fall over when someone goes and looks.

**Claims re-checked and found sound:** the build-unchanged reasoning (identical `index.html` etag,
last-modified and app-version, plus the byte-compared message module) · the two live tooltips · the
"no Payments tab / no Remove sentence" bundle claim · nine-pass arithmetic · the portal payment
figures ($337.63 gross / $323.85 net / Succeeded) · the four unchanged balance readings · the
refunded-credit route · the Inventory figures.

**Verified after each write:** 6 media, all `"type":"file"` · tables 12 and 5 rows · the four
corrections present and the four old strings absent.

---

## §21 — Comment 76831 REVERTED; today's status posted as a NEW comment 76969 (2026-09-21)

**The QA lead's correction:** *"You have edited the old comment. Please revert the old comment to what
it was before you changed it. Post a new comment for today's status of the ticket after you retesting
and tag the relevant people where their attention is needed."*

**He is right, and I had the rule backwards.** The one-complete-comment convention exists so a single
post carries the whole result instead of a chain of corrections **while it is being drafted**. It was
never licence to keep rewriting a comment **after its audience has read it** — and 76831 had been read:
Chris and Nemanja both replied to it. Editing it in place today meant the thread they had been
following silently changed underneath them, and anything they remembered reading no longer matched
what was there. **A comment that people have responded to is part of the record. New information goes
in a new comment.**

**The revert.** The pre-change text was recovered from git — commit `844055cd`, the generator as it
stood after the 20 September update — and PUT back to 76831 (HTTP 200). Verified by reading the stored
comment back: original first line (*"…BUT TWO THINGS ARE OUTSTANDING…"*), **6 media all
`"type":"file"`**, tables **12 and 5** rows, and every original string present — *"Nemanja is taking
this on Monday"*, *"wording now superseded"*, *"Unable to process payment"*, *"278 to 280"*, *"used.
Void the payment that used it"*. All six of today's edits confirmed **absent**.

**The new comment: 76969**, posted 2026-09-21T12:15:52-0500. Verdict line first; **Chris tagged** on
the wording (his copy is not on the branch — nothing further needed from him) and **Nemanja tagged**
on both actionable items (push the string rebuild; explain why portal payments do not reach ShopView).
Two exhibits, both new: **`EX7_unwind_still_shipped.png`** (attachment 61179 — the two live tooltips
still reading *Unwind*, with the greyed Reverse item visible in each) and **`EX6b_inventory_screen.png`**
(61177). Read back after posting: 2 media both `"type":"file"`, **6 mentions resolving to @Chris Ward
and @Nemanja Djuric**, summary table 7 rows, all key figures present.

**Repo now matches live:** `build_comment.py` restored to the 76831 text, and today's comment kept
separately as `build_comment_2026-09-21.py`.

---

## §22 — Nemanja answers the portal, the wording leaves the ticket, and the state is posted as 76974

**Two comments from Nemanja changed the position, and the pre-post gate caught the second one.**

**[76971](https://shopview.atlassian.net/browse/SV-9697?focusedCommentId=76971), 12:25:35:** *"I told
you I tested this and then switched portal feature branch for a different feature and a different QA
env, that is why it failed for you. Portal side is unchanged for this feature."*

That accounts for **everything** §18 recorded and it is self-consistent: the portal app was up (SSO
200), the card payment genuinely succeeded, and it landed in a different environment's data — which
is exactly why `has_portal_payment` stayed false on all 195 sv9697 invoices. These branches are clones
of the same seed data, so the portal listing matching sv9697's records (S-17303, P-193 with the right
customers and amounts) is not evidence it was pointed here.

**Check 7 is therefore closed on HIS evidence, not ours** — the QA lead's ruling (*"I think we can
trust Nemanja's testing based on this comment"*), and Rule 85's first condition: the developer has
stated in writing that the environment was not the one under test. **The comment says so in those
words** rather than implying we observed it (Rule 12).

**[76973](https://shopview.atlassian.net/browse/SV-9697?focusedCommentId=76973), 12:36:23** — posted
**while the status comment was being drafted, and caught by the Rule-72 gate before it went out:**
proof attached (`18981.jpg`, attachment 61180) **and** *"wording will be done on a different ticket
against develop branch as we agreed on the meet."*

**That removes checks 4/5/6 from this ticket.** A meeting decision is the later authoritative source
(Rule 32), so it stands over Chris's written 21 September argument for a string-only rebuild here.

**The consequence was surfaced once, neutrally, because it is a real one.** With the copy moving off,
this branch ships the 14 September wording — *"Unwind it before reversing."* — which is precisely what
Chris argued against in 76957 on the grounds that the word exists nowhere in the product and the
ticket began with a shop hitting a dead end with no explanation. The comment states that plainly,
says explicitly that it is a product call and not QA's, and asks Chris only to confirm he is content.
**It does not re-argue the decision.** It also asks Nemanja for the wording ticket's number so the
four messages stay traceable from here to there.

**Re-verified live before writing** (workplace switched back to Heavy Duty through the profile menu —
the `change-location` endpoint returns 200 and does **not** move the SPA, which cost three runs):
P2-193 → `Credit CM-3956 ($231.00) has been applied. Unwind it before reversing.` · P2-57 →
`Credits CM-2190 and CM-2191 ($240.16 total) have been applied. Unwind them before reversing.` Build
`v26.36.8-4ee1c0f` throughout.

**Posted as comment 76974**, 2026-09-21T12:42:40-0500. Read back: first line is the verdict, 1 media
`"type":"file"`, **5 mentions resolving to @Nemanja Djuric ×3 and @Chris Ward ×2**, summary table 7
rows. No technical-details section (Rule 84). **76831 and 76969 were not touched.**

---

## §23 — Check 7 VERIFIED LIVE, and two things I had missed inside 76973

**I had read 76973's text and never opened what was in it.** The QA lead sent me back to it. Two things
were sitting there:

**(1) An `inlineCard` node my first read did not surface: [SV-10298](https://shopview.atlassian.net/browse/SV-10298).**
I had asked Nemanja in 76974 for "the number of the wording ticket" — **he had already linked it in the
comment I was replying to.** My ADF flattener printed `text` and `mention` nodes and silently dropped
`inlineCard`, so the link never reached me. **Fixed the extractor; the lesson is that a comment is not
read until every node type in it has been rendered.**

**(2) The attachment, `18981.jpg` (61180), which I cited as "proof attached" without looking at.**
Opening it changed the day's outcome. It is a phone capture of the customer transactions view showing
a **Payment, "Payment made Online.", $35.32, Paid**, against invoice **P9697-253** — *one of our own
part sales on this branch*. Total charged $36.79, Stripe fee −$1.76, net $35.03.

### What that made possible

P9697-253 is portal-paid **on sv9697**, so the thing §9 and §18 could never produce was sitting on the
branch all along. Opened it live:

* status **Paid**, invoice **INV-P9697-253**, invoice date Sep 18, **paid date Sep 21**
* payment row **`Sep 21, 2026 - Online $35.32`**, balance **$0.00**
* **Reverse is disabled**, and the tooltip reads, verbatim:
  **`This invoice was paid through the customer portal. Credits and refunds must be handled through the portal.`**

That is the exact string §9 could only read out of `InvoiceActionBar` and explicitly refused to claim
as observed. **Check 7 is now PASSED on our own live observation** — exhibit
`ev/EX8_portal_blocks_reverse.png` (attachment 61182).

**The limit, stated rather than glossed:** `GET /work-orders/view` returns **`credits: []`** for
P9697-253, so it carries no credit. What is proven is that a portal payment blocks the reverse and
shows the specified message. **The ordering — portal message ahead of a blocking-credit message — is
still only what the code says, not something observed**, because no order on this branch has both.

### And a real catch on the follow-up ticket

**SV-10298** is titled *"Reverse-blocked tooltip copy: say 'used' and 'Void', not 'applied' and
'Unwind'"* — Task, Board Backlog. **That is Chris's 18 September wording, the one he himself withdrew
on 21 September** after Nemanja proved "Void" and "used" appear nowhere in the released frontend. Built
to its own title, SV-10298 ships the words both of them already ruled out. Raised in the comment,
tagged to Chris as his call.

**Posted as comment 76975**, 2026-09-21T12:49:13-0500. Read back: verdict line first, 1 media
`"type":"file"`, 3 mentions (@Nemanja ×2, @Chris ×1), links to SV-10298 and comment 76957, table 7
rows. 76831, 76969 and 76974 untouched.

---

## §24 — I flagged a problem to the PO and never actually asked him anything (comment 76976)

**The QA lead's question: *"Have you asked Chris the question you want to ask?"*** I checked the
posted comment rather than my memory of it. **Comment 76975 contains ZERO question marks.** What it
says to Chris is:

> *"it is your copy, so it is your call how you want that ticket worded - but as it stands it points
> at the version you withdrew."*

**That is a statement handed back, not a question.** It gives him nothing to answer, no options, and no
indication that anything is waiting on him — and it leaves *me* without the one fact I need: **which
wording SV-10298 should be built to, because that is the expected result I will assert against when I
test it.** Flagging a risk and then saying "your call" looks like deference and is actually an
unclosed loop: the ticket moves on, nobody answers, and I test against an assumption.

**Posted as comment 76976** in the project's standard PO-question shape (Rule 55): one question, the
two candidate wordings quoted **in full so he can pick without opening anything**, a blank for the
answer, my working assumption stated openly (**A**, his 21 September copy) with the reason, and the
consequence if it is A — **SV-10298's title still says B and will be built to B unless someone
changes it**, which is Nemanja's to action once Chris answers.

Read back: 1 question, both options present, the answer blank present, mentions resolving to
@Chris Ward and @Nemanja Djuric ×2, links to SV-10298 and comment 76957.

**The rule I am taking from this: a flag is not an ask.** If a deliverable needs a decision from
someone, the comment has to contain an actual question, with the options, and a place to put the
answer. "It's your call" is how an open question quietly becomes a silent assumption.

---

## §25 — The overnight re-check fired, was already moot, and could not have run anyway (2026-09-22, 02:03 UTC)

The self-scheduled check-in from yesterday fired on time. **Its premise was already out of date** — it
was written to chase the S-17303 portal payment as *"the only thing blocking checklist step 7"*, and
check 7 had been closed hours later by a different route entirely (P9697-253, §23). **Its step 3 also
told me to update comment 76831**, which is exactly the thing the QA lead had corrected. A reminder is
a note from a past self, not an instruction: it gets re-judged against what is true now.

**It could not have run in any case. The QA branch is no longer reachable from this container.**
Tested straight through the agent proxy, not through our MITM bridge:

| Host | Result |
|---|---|
| `sv9697.qa.shopview.com` | **rejected** — `connect_rejected` |
| `sv9697api.qa.shopview.com` | **rejected** — `connect_rejected` |
| `app.shopview.com` (production) | **200** |
| the customer portal host | **200** |
| Atlassian | **200** |

So it is **not** expired cookies, **not** the bridge, and **not** a general egress outage — it is
specific to the two `sv9697` hosts. Most likely the per-ticket branch has been torn down now the work
on it is finished, which is normal for these environments.

**Consequence for SV-9697: none.** All eleven checks were settled before the branch went, and the only
testing still to come belongs to SV-10298 on develop, which is a different environment. **Consequence
worth knowing: no further live check on this ticket is possible**, so if Chris's answer had implied a
re-test here, it could not be done.

**A harness mistake of my own, recorded because it cost the run.** Seeing six `staging-bridge`
processes I called them stale and killed them all by PID — they were **three live bridges, parent and
child each**, including the one that had been serving every run that afternoon. Three background tasks
reported "failed" at that exact moment. **Count the processes against the bridges you started before
deciding any are stale, and test whether one is serving before killing it.** (`pkill -f` is already
barred for killing the shell; this is the neighbouring trap.)

The trigger disabled itself as designed — `enabled: false`, `ended_reason: run_once_fired`.
