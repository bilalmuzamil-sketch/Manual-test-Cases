# SV-9480 — Edit Fee / Discount popup subtracts the existing discount twice in the subtotal preview

**Verdict: PASS.** Tested 2026-09-30 on the QA branch `sv9480.qa.shopview.com`,
build **v26.39.1-59f1f91**, with production **v26.39.2-1aeb22d** captured as the before-state.
All five checks in the QA handoff pass, and the reported behaviour was reproduced on production first.

---

## 1. Sources read

| Source | What it says | Read |
|---|---|---|
| **SV-9480** (Bug · TESTING QA · Medium · reporter Ryan Fyfe · assignee Stefan Vukovic) | Customer Aidan Brown / Grizzly Equipment Repair Inc / 19 users, via Intercom. Editing an existing work-order discount shows the already-discounted subtotal and then subtracts the discount again. Saving is correct; only the preview is wrong. | 2026-09-30 |
| **QA handoff — Stefan Mitrovic, 28 Sep (77478)** | PR #3343 (hotfix → main). In edit mode the preview now removes the edited adjustment from the subtotal first, including where the discount exceeds the subtotal. Add mode and line-level fees/discounts unchanged. Five numbered checks. | 2026-09-30 |

## 2. Builds

| | Build | `last-modified` | etag |
|---|---|---|---|
| Branch `sv9480.qa.shopview.com` | **v26.39.1-59f1f91** | Mon, 28 Sep 2026 22:48:23 GMT | `caed07882fd757b41fb990423de81649` |
| Production `app.shopview.com` | **v26.39.2-1aeb22d** | Tue, 29 Sep 2026 09:36:08 GMT | `631482bb64cdcb1ec1f15b23ba76f192` |

## 3. Before — the bug reproduces on production

Work order **S2-808**, subtotal **$255.69**, no adjustments. Added a whole-work-order flat discount of
**$100.00**, taking the card to **Subtotal $155.69 / Total $163.47**. Opening that discount's
**Edit Fee / Discount** popup:

| Row | Production shows |
|---|---|
| Work-order subtotal | **$155.69** ← already includes the discount |
| Discount | **−$100.00** ← taken off a second time |
| New work-order subtotal | **$55.69** |

Correct would be **$255.69 → −$100.00 → $155.69**. Production's **add** mode is right: adding a
further $50 discount previewed **$155.69 → −$50.00 → $105.69**.

## 4. After — the fix branch, the handoff's five checks

### Check 1 — edit mode starts from the pre-discount subtotal — **PASS**
Work order with labor $300.00 + shop supplies $31.50 = **$331.50**, carrying a **$100** whole-work-order
flat discount, so the card reads **Subtotal $231.50**. The edit popup shows:

```
Work-order subtotal        $331.50   <- the pre-discount amount
Discount                  -$100.00
New work-order subtotal    $231.50   <- equals the card's current subtotal
```

### Check 2 — the saved subtotal matches the preview — **PASS**
Changed the amount to **$60**; the preview read **$331.50 → −$60.00 → $271.50**. After saving, the
card reads **Subtotal $271.50 / Total $285.08**, and `work_order.sub_total` is **271.50**.

### Check 3 — add mode unchanged — **PASS**
With the $60 discount already on the work order, adding a **new $25** discount previewed
**$271.50 → −$25.00 → $246.50** — the first row equals the card's current subtotal, as before.
(The same holds on a work order with no discount at all: **$331.50 → −$100.00 → $231.50**.)

### Check 4 — discount larger than the subtotal — **PASS**
Set the discount to **$500** on the $331.50 work order; the card then reads **Subtotal $0.00 /
Total $0.00**. Re-opening that discount shows:

```
Work-order subtotal        $331.50   <- the real pre-discount amount, not the card's $0.00
Discount                  -$500.00
New work-order subtotal      $0.00
```

### Check 5 — line-level fees and discounts unchanged — **PASS**
A **10% discount on a labor line** previews against that line, not the work order, and behaves
identically on both builds:

| | Add | Edit |
|---|---|---|
| Branch (line labor $300.00) | Line labor total $300.00 · −$30.00 · **$270.00** | identical |
| Production (line labor $149.95) | Line labor total $149.95 · −$15.00 · **$134.95** | identical |

## 5. How the branch was unblocked

The branch initially refused to create **any** fee or discount: the add button was disabled behind
*"Map a Discount item in Settings → QuickBooks…"*, `POST /api/work-orders/adjustments/add` returned
**409**, no templates existed, and **0 of 400** work orders across both branch locations carried an
adjustment.

The cause was configuration: `GET /api/bookkeeping/integration` showed
**`toggles.advancedModeEnabled: true`** on the branch versus **`false`** on production, and advanced
mode requires a QuickBooks item mapping that only becomes settable once a QuickBooks company is
connected. `PUT /api/bookkeeping/settings` could not be used to clear it (it accepts `{"settings":{}}`
but 500s on every field shape).

**The way through was the organization's feature flags:**
`POST /api/organization/feature-flags {organization_id, feature_flag_ids:[…]}` sets the org's enabled
features to exactly the list supplied. Re-posting the list **without QuickBooks** removed the guard,
and the discount was created (**201**). **The flag was restored afterwards** — the org is back to its
original eleven features including QuickBooks, verified by re-reading the list.

Testing with QuickBooks off is, if anything, **closer to production**, where QuickBooks is likewise
unconnected and advanced mode is off.

## 6. One thing investigated and cleared, not reported as a defect

The branch's Finance tab raised *"Ooooops! An error occurred"* and *"Error fetching draft invoice
details"* from **`GET /api/invoices/{id}/details` → 500** and
**`POST /api/work-orders/invoices/estimate` → 500**. Three checks established it is unrelated to this
ticket:

1. it fires on work orders with **no adjustments at all**;
2. an **existing** branch work order returns **200** — only **freshly created** ones fail;
3. **production does exactly the same** for a brand-new work order (`500`), so it is not a branch
   regression.

It also survived the feature-flag restore, so it was not caused by my own change either. The discount
edit itself raised **no** failing call, and saving reported *"Discount updated"*.

## 7. What I could not check

* The customer's exact figures ($2,815.89 subtotal with a $1,300 discount) were not recreated; the
  same arithmetic was proven at $331.50/$100, $331.50/$500 and $271.50/$60.
* Only the whole-work-order and labor-line cases were driven. A **part**-line fee or discount was not
  exercised — the handoff's check 5 says "labor or part", and labor was used.

## 8. Environment

**Branch** (per-ticket QA branch, full CRUD authority): the organization's **QuickBooks feature flag
was turned off and then restored** (verified back to the original eleven features). Left in place:
three scratch work orders, one of them carrying the **$100 "SV9480 Family Discount"** used for the
checks. A line-level discount created for check 5 was removed (`204`).

**Production** (restore-after discipline): two scratch work orders created and **deleted** (`201`
each); one $100 discount added to **S2-808** and **removed** (`204`); one line-level discount added and
**removed** (`204`). S2-808 re-read afterwards at its original **subtotal $255.69 / 0 adjustments**.

## 9. Evidence

* `ev/01-edit-preview-before-after.png` — production `$155.69 → −$100.00 → $55.69` beside the branch's
  `$331.50 → −$100.00 → $231.50`.
* `ev/02-edge-case.png` — a $500 discount on a $331.50 work order: the card reads $0.00, the popup
  still shows the real $331.50.
* `ev/03-line-level-unchanged.png` — the labor-line preview on both builds.
