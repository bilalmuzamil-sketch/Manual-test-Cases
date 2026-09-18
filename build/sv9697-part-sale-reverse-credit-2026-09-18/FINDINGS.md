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

**Service work order, branch, S2-16654 (invoiced, no credit):** ⋮ → Reverse is **enabled** and the
confirmation is **today's wording, unchanged**:
> This action will re-open and undo the invoice. Are you sure you want to proceed?

That is exactly what Chris ruled: part sales only in this hotfix, service work orders keep the
always-clickable button, and the shared dialog's no-credit wording does not change.

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
