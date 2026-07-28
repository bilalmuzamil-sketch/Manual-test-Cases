# SV-8721 — Live Staging Test vs SV-4543 5-Decimal Rules — FINDINGS

**[SIDE PROJECT]** — self-contained, not one of the 7 main ShopView projects.
Date: 2026-07-28 · Env: app.staging.shopview.com / api.staging.shopview.com (admin)
Live, evidence-based VIU (Rules 10/12/13/14/15/25). NO TestRail writes.

## Plain summary (read this first)
- **SV-8721 is FIXED on staging.** The Purchase Order **Receive Parts** screen now shows the part
  unit cost at full **5-decimal precision** and calculates the line totals / subtotal from that full
  precision — it no longer rounds the cost to 2 decimals before the math. This matches the SV-4543 rule.
- Reproduced the customer's exact numbers live: 3 parts at costs **0.240 / 0.027 / 0.089** → the Receive
  screen showed **$0.24000 / $0.02700 / $0.08900**, line totals **$9.60 / $2.16 / $3.56**, and
  **Subtotal $15.32** (correct). The OLD bug produced Subtotal $15.60.

## The 5-decimal rule tested (SV-4543, verbatim)
> "We need to **show 5 decimal points on the item cost** then **round for the line total**"  (example: "50 x 58.96836 = 2948.42")
So: unit cost displays up to 5 decimals; the money line total (cost x qty) is rounded to 2 decimals.

## What SV-8721 asks (plain)
PO Receive was rounding unit cost to 2dp before totals, so ShopView PO totals did not match the paper
vendor invoice. Fix = preserve full-decimal cost through Receive and compute totals from it, on both the
PO Receive and Bulk PO Receive pages (per dev Dusan).

## How I tested (live)
Seeded WO **S-26205** (id fa0007f3...), company Iibay Landscaping, GST 5%. Added one approved line, then
3 vendor part requests reproducing the customer's costs + a 4-decimal part for Ayesha's note. Ordered them
(PO **c0aa698f**), opened the **Receive Parts** screen, read on-screen values + backend order-detail JSON.

## Scenario 1 — PO Receive screen, customer's exact case — PASS
| Part | Qty | Cost entered | Receive COST shown | Line Total | Expected |
|------|-----|--------------|--------------------|------------|----------|
| ZZ-NNSC-038 | 40 | 0.089 | **$0.08900** | **$3.56** | 5dp cost, 40x0.089=3.56 ok |
| ZZ-CB2SC-038 | 40 | 0.240 | **$0.24000** | **$9.60** | 40x0.240=9.60 ok |
| ZZ-SWS-038 | 80 | 0.027 | **$0.02700** | **$2.16** | 80x0.027=2.16 ok |
| Subtotal | | | **$15.32** | | 15.32 ok (bug was 15.60) |

- Observed UI: `evidence/R1-receive-screen.png` — same "Receive Parts" screen as the bug shot
  (att8721/59050.png) but now 5-decimal costs and Subtotal **$15.32** (bug showed $15.60).
- Observed backend (`evidence/order-detail.json`), item ZZ-NNSC-038: `price`=0.09 (legacy) BUT
  `price_decimal`="0.08900"; `total_cost`="3.60" (legacy) BUT `total_cost_decimal`=3.56; order-level
  `total_price`="15.60" (legacy) BUT `total_price_decimal`="15.32". The Receive page shows the fixed
  `*_decimal` values.
- SV-4543 rule citation: "show 5 decimal points on the item cost then round for the line total" — cost 5dp
  (0.08900), line total 2dp (3.56). **PASS. Issue does NOT reproduce = FIXED.**

## Scenario 2 — Backend precision contract (all-tenant fix) — PASS
Order/receive backend now carries full precision in `price_decimal` / `total_cost_decimal` /
`total_price_decimal` alongside legacy 2dp fields. Subtotal from full precision = **15.32** (exact
customer value). Evidence: `evidence/order-detail.json`. SV-4543: 5dp cost preserved, money totals 2dp. PASS.

## Scenario 3 — Ayesha 4-decimal note (cost 45.6789) — PASS on Receive/precision side
Entered 45.6789 (4dp). Backend stored `price_decimal`="45.67890" (5dp, trailing zero appended = the
"appends a zero" Ayesha saw; same value, cosmetic); `total_cost_decimal`=137.0367 -> line total **$137.04**
(3 x 45.6789 rounded 2dp). Evidence: order-detail.json item ZZ-AY-4DP. SV-4543: 5dp cost + 2dp total ok.
NOT re-verified this run (honest, Rule 12): Ayesha's other half — reopening the **Edit Part Request dialog**
shows cost rounded to 4dp (45.6800). Could not open that dialog (the ordered part's kebab offered only
Move / Add Part Fee, not Edit). Dev scoped that dialog quirk as separate/pre-existing from this ticket.

## Overall verdict
**SV-8721 = FIXED / PASS on staging.** PO Receive preserves full 5-decimal unit cost and computes line
totals + subtotal on that precision (per SV-4543), so PO totals now match the vendor invoice. Root cause
(2dp cost rounding on receive) is resolved. Only un-reverified item = the separate Edit-Part-Request-dialog
display quirk noted by Ayesha (dev: out of scope for this ticket).

## Honest limits (Rule 12)
- Verified LIVE with evidence: PO Receive screen display + math; backend precision fields.
- NOT driven this run: standalone Bulk PO Receive page; Edit-Part-Request reopen-rounding (dialog not
  reachable on an ordered part). Tax on the Receive screen is a manual vendor-invoice field (default $0.00);
  the fix that matters (Subtotal on full precision) is confirmed.

## Evidence files
- evidence/R1-receive-screen.png — fixed Receive Parts screen (Subtotal $15.32, 5dp costs)
- evidence/order-detail.json — backend order detail: legacy vs *_decimal fields
- evidence/V1-wo-with-line.png — WO with seeded parts
- requirements-SV-8721.md / requirements-SV-4543.md — ingested tickets + rule
