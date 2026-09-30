# SV-9480 — Edit Fee / Discount popup subtracts the existing discount twice in the subtotal preview

**Status: BLOCKED — no verdict.** The fix cannot be exercised on `sv9480.qa.shopview.com`
(build **v26.39.1-59f1f91**) because **no fee or discount can be created there, and none exists**.
The reported bug **was reproduced on production** (build **v26.39.2-1aeb22d**), so the before-state
is captured and everything is ready to finish the moment the branch is unblocked.

---

## 1. Sources read

| Source | What it says | Read |
|---|---|---|
| **SV-9480** (Bug · TESTING QA · Medium · reporter Ryan Fyfe · assignee Stefan Vukovic) | Customer Aidan Brown / Grizzly Equipment Repair Inc / 19 users, via Intercom. Editing an existing work-order discount shows the already-discounted subtotal and then subtracts the discount again. Saving is correct; only the preview is wrong. | 2026-09-30 |
| **QA handoff — Stefan Mitrovic, 28 Sep (77478)** | PR #3343 (hotfix → main). In edit mode the preview now removes the edited adjustment from the subtotal first, including the case where the discount exceeds the subtotal. Add mode and line-level fees/discounts unchanged. Five numbered checks. | 2026-09-30 |

## 2. Builds

| | Build | `last-modified` | etag |
|---|---|---|---|
| Branch `sv9480.qa.shopview.com` | **v26.39.1-59f1f91** | Mon, 28 Sep 2026 22:48:23 GMT | `caed07882fd757b41fb990423de81649` |
| Production `app.shopview.com` | **v26.39.2-1aeb22d** | Tue, 29 Sep 2026 09:36:08 GMT | `631482bb64cdcb1ec1f15b23ba76f192` |

Production is on a **higher** version than the branch, which is built from an older main.

## 3. The bug reproduces on production — before-state captured

Work order **S2-808**, subtotal **$255.69**, no adjustments. A whole-work-order flat discount of
**$100.00** was added, taking the card to:

```
Fees & Discounts (1)   -$100.00
Subtotal                $155.69
2+3% VAT                  $7.78
Total                   $163.47
```

Opening that discount's **Edit Fee / Discount** popup shows:

| Row | Shown |
|---|---|
| Work-order subtotal | **$155.69** ← already includes the discount |
| Discount | **−$100.00** ← subtracted a second time |
| New work-order subtotal | **$55.69** |

Correct would be **$255.69 → −$100.00 → $155.69**. Capture: `ev/prod-edit-preview.png`
(preview element at x585 y608 w430 h109).

**Add mode on production is correct** and must stay that way: with the $100 discount already on the
work order, adding a further **$50** discount previewed **$155.69 → −$50.00 → $105.69**.

Production was left exactly as found — the seeded discount was removed (`204`) and S2-808 re-read at
**subtotal $255.69 / total $268.47 / 0 adjustments**.

## 4. What I could verify on the branch

**Check 3 — add mode unchanged: PASS.** On a seeded branch work order (labor $300.00, shop supplies
$31.50, **subtotal $331.50**), the add dialog previewed:

```
Work-order subtotal        $331.50
Discount                  -$100.00
New work-order subtotal    $231.50
```

The first row equals the card's current subtotal, which is what the handoff asks for. This is the
only one of the five checks that can be run without an existing adjustment, because the preview
updates live before anything is saved.

## 5. Why the other four checks cannot be run — the blocker, with evidence

Checks 1, 2, 4 and 5 all need a work order that **already carries** an adjustment. On this branch:

| Attempt | Result |
|---|---|
| Add through the UI (⋮ → Add Work Order Fee / Discount) | Button **disabled**; banner reads *"Map a Discount item in Settings → QuickBooks before adding a discount."* |
| `POST /api/work-orders/adjustments/add` · `kind: discount` | **409** — *"Connect a QuickBooks item for discounts before adding a discount."* |
| same · `kind: fee` | **409** — *"Connect a QuickBooks item for fees before adding a fee."* |
| same · `kind: processing_fee` | **400** — *"A processing fee can only be added from a template."* (and the template dialog offers only Fee and Discount) |
| Fees & Discounts templates (`/administration/adjustment-templates`) | list is **empty**; a template saves fine until **Auto-apply** is ticked, at which point **Create disables** |
| Existing work orders carrying an adjustment | **0 out of 400 scanned** — 200 in *Staging Heavy Duty - 9919* and 200 in *Staging Lethbridge - 4310* |

**The cause is a configuration difference, not code.** `GET /api/bookkeeping/integration`:

| | `advancedModeEnabled` | QuickBooks connected |
|---|---|---|
| Branch | **true** | no (page offers only "Connect to QuickBooks") |
| Production | **false** | no (identical page) |

Advanced mode requires each fee and discount to map to a QuickBooks item, and the mapping screen
only appears once a QuickBooks company is connected — which is the one dependency that genuinely
cannot be provisioned from here.

**Attempts to turn advanced mode off from the outside:** `PUT /api/bookkeeping/settings` accepts
`{"settings":{}}` with **200**, but returns **500** for every field shape that could be inferred
(`advancedModeEnabled`, `toggles.advancedModeEnabled`, `discountItem`). The screen that would send
the real payload is behind the QuickBooks connection, so its shape could not be captured from the
app.

## 6. What would unblock it — any one of these

1. Set **`advancedModeEnabled` to false** for the branch org (production runs this way), **or**
2. **Map the QuickBooks fee and discount items** on the branch, **or**
3. **Seed one work order** with a whole-work-order flat discount — plus, for check 4, one whose
   discount is larger than its subtotal.

With any of those in place the remaining four checks, the customer's own scenario, and the
before-and-after exhibit take one pass.

## 7. One thing corrected before it became a false finding

An earlier capture appeared to show the branch's QuickBooks settings page throwing
*"Ooooops! An error occurred"* and firing a failing `PUT /api/bookkeeping/settings`. Re-running the
page load on its own showed it loads **cleanly** (`GET /api/bookkeeping/integration` → 200, no error
banners): the failures were **my own probe calls** captured in the same run. Nothing is wrong with
that page.

## 8. Environment

**Branch** (per-ticket QA branch — no cleanup required): two scratch work orders were created
(`cd9d95ea…` with a $300 canned line, and two empty ones), and nothing else was changed — no
adjustment, template or setting was successfully written.

**Production** (restore-after discipline): one scratch work order created and **deleted** (`201`);
one discount added to **S2-808** and **removed** (`204`), with the work order re-read afterwards at
its original **$255.69 / $268.47 / 0 adjustments**.

## 9. Evidence

* `ev/prod-edit-preview.png` — the production Edit Fee / Discount popup showing
  `$155.69 → −$100.00 → $55.69`, the bug as reported.
* `ev/branch-add-preview.png` — the branch add-mode preview, `$331.50 → −$100.00 → $231.50`.
