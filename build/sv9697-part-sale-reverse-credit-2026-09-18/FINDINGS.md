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

## Honest limits — what I could NOT produce on this branch

**(a) The three-or-more spent-credit tooltip.** No part sale on this branch has three spent credits,
and I could not make a third credit *spent*. What I tried: issuing three credits against one part
sale's invoice (they attach correctly — `invoiceCredits` shows all three), then paying another invoice
and the same invoice with payment method **Applied credit** and an **Amount to credit** of $39.00. The
payment posts (`POST 201 /api/customer-account/create-customer-payment`, the invoice balance drops
$99.75 → $60.75) but **no credit memo is drawn down** — all three stay `unapplied` at full balance.
So the one- and two-credit formats are proven live and byte-exact; the three-or-more format is not.

**(b) The portal-payment precedence check.** No invoice on this branch is paid through the customer
portal, and I found no way to create one from inside the product.

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

## §6 — The credited line after a reverse (checklist step 10) — **half verified**

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
