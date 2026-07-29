# Sell-Price Auto-Calc — LIVE VERIFICATION on staging (+ prod comparison) — 2026-07-29

**What this is:** the QA lead's exact 10-step repro (see `../repro-from-qa-lead-2026-07-29.md`)
was run LIVE on `app.staging.shopview.com` today, observed step by step with screenshots and a
network capture (Rule 12 — everything below was observed, nothing inferred). The same flow was
then run on PRODUCTION (`app.shopview.com`, prod test org) to separate "staging regression"
from "long-standing behavior". No TestRail writes were made.

---

## Verdict (plain words)

**BUG CONFIRMED on staging — and PRODUCTION behaves exactly the same way.**

1. **The Sell price does NOT auto-calculate.** With the pricing matrix's Uncategorized rules in
   place, we typed Cost = 50 and clicked outside the field. Sell stayed **0**. We changed Cost to
   100 and clicked outside again. Sell stayed **0**. (Expected from the matrix: Cost 50 → Sell
   $125.00 on staging's rules.)
2. **The Receive button does NOT auto-activate.** It stayed greyed out (disabled) after the cost
   was entered, because Sell was still 0. The moment we typed a Sell value by hand (125), the
   Receive button became clickable — proving the button is gated on Sell being filled, so the
   broken auto-calc is exactly what keeps Receive blocked.
3. **Production does the SAME thing** (Sell stays 0 after Cost 50 and after Cost 100; Receive
   stays disabled), with a properly configured Uncategorized matrix on the prod org too. So this
   is **NOT a new staging regression — it is the same behavior in production**, i.e. the
   auto-calc the QA lead expects does not run on this Receive Parts screen in either environment.
4. **Config differences are ruled out.** Both orgs HAVE pricing-matrix rules covering the
   Uncategorized category (details below), so "the matrix just isn't configured" cannot explain
   the zero Sell in either environment.

**One extra technical observation:** when Cost is edited on this Receive screen, the app fires
**NO backend call at all** on the blur (network capture: only `receive-view`, `assign-vendor`
and `part-number` calls happened; nothing for cost). So there is no server response carrying a
recalculated sellPrice — the field edit is purely local until Receive is pressed. Whatever
auto-calc exists elsewhere in the app is simply not wired up on this screen.

**Context from history:** this is the same class of bug as **SV-5003** ("FE Sell Price Not
Updating When Average Cost or Category Is Changed on parts tab", Done in v0.54) — that fix
covered the WO Parts tab, not this Receive Parts screen.

---

## Step 1 — Pricing-matrix configuration (the facts that decide "should Sell calculate?")

**Where it lives (new recipe):** Settings → PARTS → **Pricing** = route
`/administration/pricing` (permission `settingsParts`). API: `GET /api/pricing-rules/list`
(matrices + rules), `GET /api/parts/list-fixed-price` (fixed sell prices).

**STAGING org d55bc308 — YES, Uncategorized is covered.**
Matrix **"Default matrix 07/12/2023"** (`is_default: true`), Category = **Uncategorized**
(category id `b25c5c04-fe8d-4c21-a15c-a02c69f1ee5d`), **21 rules** (markup-for-interval).
The rule relevant to the repro: **$24.01–$55.00 → Markup 150% / Margin 60%**, so
**Cost 50 → expected Sell = 50 × 2.5 = $125.00**; the Cost-100 repeat falls in
$55.01–$145.00 → Markup 122.22% → expected Sell = $222.22.
Evidence: `01-pricing-matrix-page.png`, `02-pricing-matrix-default-uncategorized.png`
(the Edit Price Matrix dialog showing Category = Uncategorized + the rule rows),
`pricing-rules-list-staging.json` (full 25-matrix dump; one covers Uncategorized).

**PROD test org 72b2cc90 — YES, Uncategorized is covered there too.**
Matrix **"Default matrix"** (`is_default: true`), Category = **Uncategorized** (category id
`00e200b1-59fe-4c4a-88a1-952a6d38fee0`), 1 rule: **$1–$2500 → Markup 800% / Margin 88.89%**,
so **Cost 50 → expected Sell = $450.00** on prod. Evidence: `pricing-rules-list-prod.json`.

---

## Step 2 — The 10-step repro, exactly as the QA lead wrote it (STAGING, live)

Environment: `app.staging.shopview.com`, org d55bc308, workplace Staging Lethbridge - 4310,
admin session, 2026-07-29. Throwaway data tagged ZZAUTOTEST; the WO created was **S3-26244**.

| # | QA lead's step | What we observed live |
|---|---|---|
| 1 | Create a new WO | WO S3-26244 created (customer "11 A new Company", 2020 Ford Transit) |
| 2 | Create a new line | Line "Testing new canned line" added (its auto-added part was removed so the repro part is the only one) |
| 3 | New Part Request modal: ONLY Description + Quantity → Save & Close | Modal filled with Description "ZZAUTOTEST sell-price check" + Quantity 1 — nothing else. NOTE: the modal's Category field **defaults to "Uncategorized" by itself**, matching the QA lead's premise. Cost blank, Sell showed 0.00. Screenshot `03-new-part-request-modal-before-save.png`. Saved: the request was created with category = Uncategorized, cost 0, sell 0, no part number, no vendor |
| 4 | Click Order | Order clicked on the part row; PO created (order id 31f751bb…), part became "Awaiting"; the row button changed to **Receive**. Screenshot `05-after-click-order.png` |
| 5 | Click Receive | Landed on the Receive Parts screen `/order/31f751bb…?receive=1&returnTo=WorkOrder&…&vendorless=1` — "Vendor Missing" group, 1 part. Screenshot `06-receive-screen-initial.png` |
| 6 | Select Vendor (top-left dropdown) | Vendor "123 Cannabis Forestlawn" selected; page re-grouped under the vendor. Screenshot `07-after-vendor-selected.png` |
| 7 | Add Invoice number | "ZZAUTOTEST-INV-1" typed |
| 8 | Add the missing Part number | "ZZAUTO-PN-1" typed (the app saved it via `POST /api/orders/items/{itemId}/part-number`). Screenshot `08-after-invoice-and-partnumber.png` |
| 9 | Add Cost | 50 typed in the Cost field. Screenshot `09-cost-50-typed-before-blur.png` |
| 10 | Click outside the Cost field | **Sell stayed 0. Receive button stayed disabled.** Screenshot `10-after-blur-cost-50-KEY.png` (Cost 50, Sell 0, line Total $50.00, Receive greyed) |

**Repeat edit:** Cost changed to 100 → click outside → **Sell still 0, Receive still disabled**
(`11-after-blur-cost-100-repeat.png`). Matches the founder's "no matter how many times".

**Counterfactual (proves the gating):** typing Sell = 125 **by hand** immediately turned the
Receive button clickable (isDisabled: true → false). Screenshot
`12-counterfactual-manual-sell-enables-receive.png`. Also re-confirmed on the same screen
without the `vendorless=1` URL flag: cost 50 + blur → Sell 0 / Receive disabled
(`13-nonvendorless-after-cost-50-blur.png`) — so the result is not an artifact of the
vendor-missing view.

**Network capture on the cost blur:** `network-log-receive-screen.json` — the complete list of
non-GET calls during the whole receive-screen session is: `inventory/orders/receive-view`,
`orders/{id}/assign-vendor`, `inventory/orders/receive-view`, `orders/items/{id}/part-number`.
**No call fires when Cost is edited/blurred** — no `change-item`, no `change-request`, nothing
returning a sellPrice/margin. (Cost edits don't even persist across a page reload; the value is
only submitted with the final Receive.)

## Step 3 — PRODUCTION comparison (same flow, minimal)

Environment: `app.shopview.com`, prod test org 72b2cc90, workplace Trucks Hill 2, 2026-07-29.
Seeded the identical state (WO **S2-809**, special-order part with ONLY description
"ZZAUTOTEST sell-price check" + quantity 1, category Uncategorized, ordered), then drove the
same Receive screen in the UI: vendor "Delete Test" selected top-left, invoice
"ZZAUTOTEST-INV-P1", part number "ZZAUTO-PN-P1", Cost 50, click outside.

**PROD result: Sell stayed 0, Receive stayed disabled — identical to staging.** Repeat with
Cost 100: same. Screenshots `20-PROD-receive-screen-initial.png`,
`21-PROD-after-blur-cost-50-KEY.png`, `22-PROD-after-blur-cost-100-repeat.png`.

**Interpretation:** regression vs long-standing → **long-standing / both-environments
behavior**, not something a recent staging build broke. (Note this does NOT contradict the
earlier SV-8721 prod observation of non-zero Sell values on a Receive screen — those parts had
catalog/fixed sell prices carried from the part data; this repro's part is a bare special-order
part with no sell anywhere, which is exactly the case where the matrix auto-calc should kick
in and doesn't.)

## Honest limits (Rule 12)

- We did NOT click the final Receive button in either environment (not needed for the verdict;
  kept the shared orgs clean). Whether the backend would compute a Sell at receive-accept time
  was therefore not observed.
- The QA lead's expected behavior states Sell "should" auto-calculate from the Uncategorized
  matrix. Whether that expectation is a spec'd requirement or the app's intended default is a
  product question — the Simple Flow spec itself never mentions cost→sell recalculation (see
  `../FINDINGS.md` §2). What is proven here: the expectation is NOT met, on either environment,
  while both orgs have the matrix configured.
- Prod's vendor list first option ("Delete Test") was used as-is; vendor identity does not
  affect the calc.

## Evidence index

| File | What it shows |
|---|---|
| `01-pricing-matrix-page.png` | Settings → Parts → Pricing (staging), 25 matrices |
| `02-pricing-matrix-default-uncategorized.png` | "Default matrix 07/12/2023" — Category = Uncategorized, rule rows incl. $24.01–55 → 150% markup |
| `pricing-rules-list-staging.json` | Full staging matrix dump (API) |
| `pricing-rules-list-prod.json` | Full prod matrix dump (API) — "Default matrix" covers Uncategorized, $1–2500 → 800% |
| `03-new-part-request-modal-before-save.png` | Step 3: modal with ONLY Description + Quantity (Category auto = Uncategorized) |
| `04-after-save-close-line-parts.png` | Request saved on the line |
| `05-after-click-order.png` | Step 4: ordered; Receive button appears |
| `06-receive-screen-initial.png` | Step 5: Receive Parts screen, Vendor Missing, Sell 0 |
| `07-after-vendor-selected.png` | Step 6: vendor picked top-left |
| `08-after-invoice-and-partnumber.png` | Steps 7–8: invoice + part number in |
| `09-cost-50-typed-before-blur.png` | Step 9: Cost 50 typed |
| `10-after-blur-cost-50-KEY.png` | **Step 10 KEY: Sell = 0 after blur; Receive disabled** |
| `11-after-blur-cost-100-repeat.png` | **Repeat edit: Sell = 0 again** |
| `12-counterfactual-manual-sell-enables-receive.png` | Manual Sell 125 → Receive enabled (gate proof) |
| `13-nonvendorless-after-cost-50-blur.png` | Same result on the non-vendorless receive URL |
| `network-log-receive-screen.json` | No API call fires on the cost blur |
| `20/21/22-PROD-*.png` | PROD: same flow, Sell stays 0 both edits, Receive disabled |
| `BUG-TICKET-DRAFT.md` | Ready-to-file plain-English ticket |

**Cleanup done:** staging WO S3-26244 and prod WO S2-809 deleted (both re-GET 400 "Not found";
deleting the WO also removed its un-received PO in both envs). No roles/settings were changed.

**Relevant corrective cases (already in TestRail, pushed earlier today):**
SF-RCV-14 = [C38860](https://shopview.testrail.io/index.php?/cases/view/38860),
SF-RCV-15 = [C38861](https://shopview.testrail.io/index.php?/cases/view/38861),
SF-VPART-08 = [C38862](https://shopview.testrail.io/index.php?/cases/view/38862).
Today's live run is exactly the observation SF-RCV-14/15 describe → both would FAIL as written
(that is the bug, not a case defect). No TestRail writes were made in this verification.
