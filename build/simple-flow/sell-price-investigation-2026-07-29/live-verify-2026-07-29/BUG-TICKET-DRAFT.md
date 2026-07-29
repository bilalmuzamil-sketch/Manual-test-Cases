# BUG TICKET DRAFT — Sell price does not auto-calculate on the Receive Parts screen

*(Ready to file. Raised by Fabian (founder) on 2026-07-29; reproduced and verified live by QA
the same day on staging AND production. Evidence filenames refer to
`build/simple-flow/sell-price-investigation-2026-07-29/live-verify-2026-07-29/`.)*

## Summary

On the Receive Parts screen, typing a Cost for a part does not fill in the Sell price. The
Sell price stays 0 no matter how many times the Cost is changed, and because the Sell price
stays empty, the Receive button never becomes clickable. The shop's price matrix has rules for
parts without a category (the "Uncategorized" category), so the Sell price should have been
worked out automatically from the Cost.

## Steps to reproduce

1. Create a new work order.
2. Create a new line on it.
3. Request a special order part, but do NOT add anything in the new part request window except
   the Description and the Quantity, then click Save & Close.
4. Click Order on that part.
5. Click Receive.
6. On the receive screen, select the Vendor from the dropdown at the top left.
7. Add the Invoice number.
8. Add the missing Part number.
9. Add a Cost (for example 50).
10. Click outside the Cost field.

## Expected

- The Sell price fills in automatically, worked out from the price matrix's **Uncategorized**
  category rules (the part has no category, so those rules apply). With the staging matrix,
  a Cost of 50 should give a Sell price of 125.00.
- Once the Sell price is filled in, the Receive button becomes clickable by itself.

## Actual

- The Sell price stays **0** after the Cost is entered. Changing the Cost again (to 100) and
  clicking outside again still leaves the Sell price at 0 — it never updates, no matter how
  many times the Cost is changed.
- The Receive button stays greyed out. (If the tester types a Sell price by hand, the Receive
  button immediately becomes clickable — so it is the missing auto-calculation that blocks
  receiving.)
- The same thing happens on production, so this is not a one-environment glitch.

## Environment

- Staging: app.staging.shopview.com, work order S3-26244, 2026-07-29. The shop's price matrix
  HAS rules for the Uncategorized category ("Default matrix 07/12/2023", 21 rules — e.g. a
  cost between $24.01 and $55.00 gets a 150% markup).
- Production (same result): app.shopview.com prod test org, work order S2-809, 2026-07-29.
  That org's "Default matrix" also covers Uncategorized ($1–$2500 → 800% markup).
- Both test work orders were cleaned up after verification.

## Evidence

- `10-after-blur-cost-50-KEY.png` — Cost 50 entered, Sell still 0, Receive greyed (staging).
- `11-after-blur-cost-100-repeat.png` — Cost changed to 100, Sell still 0 (staging).
- `12-counterfactual-manual-sell-enables-receive.png` — typing a Sell by hand enables Receive.
- `02-pricing-matrix-default-uncategorized.png` — the Uncategorized matrix rules exist.
- `21-PROD-after-blur-cost-50-KEY.png` / `22-PROD-after-blur-cost-100-repeat.png` — production
  does the same.
- `network-log-receive-screen.json` — technical note for the developer: editing the Cost on
  this screen sends no request to the server at all, so nothing ever recalculates the Sell
  price there.

## Notes

- Related history: SV-5003 ("Sell Price Not Updating When Average Cost or Category Is Changed
  on parts tab", fixed in v0.54) was the same kind of problem on the Work Order Parts tab; the
  Receive Parts screen was not covered by that fix.
- Test cases already exist for this behavior (added 2026-07-29): C38860, C38861, C38862.
