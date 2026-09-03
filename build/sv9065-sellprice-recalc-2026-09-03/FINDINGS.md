# SV-9065 — Sell Price recalculation in the Request Part (New Part Request) modal

QA branch: sv9065.qa.shopview.com / sv9065api.qa.shopview.com
Build marker at test time: **v26.35.8-30a5c8b** (note: env redeployed mid-session from v26.35.7-91fb14c → v26.35.8-30a5c8b; all results below were re-run on the current build with the env awake).
WO used: S9065-17435 (b94d839f), workplace Staging Heavy Duty - 9919. Modal opened via a line's ⋮ → "Request part".
Pricing recalc endpoint: GET /api/pricing-rules/calculate-sell-price?category_id=..&cost=..

Source of truth = the ticket description STRs + the QA comment by Nemanja Djuric (scope note: original flow no longer reproduces since SV-9063; PR #2907 hardens the calc — verify the two extra points).

## Reference: Sell Price per category at Cost = $100
| Category | Sell Price | Margin |
|---|---|---|
| 70%Override | $170.00 | 41.18% |
| Uncategorized | $222.22 | 55.00% |
| HD-Filters | $153.85 | 35.00% |
| HD-Fasteners | $158.73 | 37.00% |
→ Sell Price recalculates to the selected category's pricing matrix (evidence 01).

## Checks
- **A — original STRs (re-run to confirm SV-9063): PASS.** Category 70%Override + Cost $100 → Sell $170. Picking a catalogue Part Number (4--PC1466-4A) set the Category to the part's REAL category (**HD-Hose & Fittings**, NOT a stale "Uncategorized") and the Sell Price **recalculated** ($170 → $6.74, 50% margin). The reported bug (category → Uncategorized, Sell Price stays stale) does NOT reproduce. Evidence 02.
- **B — rapid / throttled category switch: PASS.** With all pricing calls throttled to 1.5s, rapidly switching 70%override → Uncategorized → HD-Fasteners (responses arriving out of order), the Sell Price **settles to the CURRENT category** = HD-Fasteners $158.73. The earlier categories' late/out-of-order responses ($170, $222.22) never win. Evidence 03. (Honest note: during sub-second rapid switching a brief intermediate value can flash before it settles to the correct current-category price; the settled value is always correct.)
- **C — failed pricing request: PASS.** With the calc request failing (HTTP 500) while changing Category, the notice **"Could not recalculate the Sell price for this category."** appears, the **spinner clears**, and the **previous Sell Price ($170) stays** (it does not silently pretend to be Uncategorized's $222.22). Evidence 04.

## Honest notes for the developer
- On a **500 / error response**, both a generic "Ooooops! An error occurred" toast AND the specific "Could not recalculate the Sell price for this category." toast appear (double toast — minor; the specific message is present).
- A **total network disconnect** (all requests offline) triggers the app's global "connection lost / redirecting" reload rather than the calc-specific handler — that's separate global behaviour, not this fix. The calc-specific handling (the subject of PR #2907) works as specified when the pricing request itself fails.
- The QA env is ephemeral and sleeps on inactivity ("QA env is sleeping / Redirecting..."); tests were re-run after waking it, on build v26.35.8-30a5c8b.

## Verdict: PASS — Sell Price always corresponds to the currently selected Category; failures are surfaced without faking a recalculated price.
