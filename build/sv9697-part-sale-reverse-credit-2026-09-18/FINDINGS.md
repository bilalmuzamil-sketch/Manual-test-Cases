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
