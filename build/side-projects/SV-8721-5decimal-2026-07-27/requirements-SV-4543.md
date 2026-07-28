# SV-4543 — 5-decimal feature rules (the SPEC to test SV-8721 against)  [SIDE PROJECT]

Source (login-walled pointer): https://shopview.atlassian.net/browse/SV-4543
Ingested live via Atlassian REST v3 on 2026-07-28.

## Header
- **Summary:** Show 5 decimal points on returns when part was received with 5 decimal points
- **Type:** Task   **Status:** Done   **Fix Version:** v0.37
- **Assignee:** Damjan Veljkovic   **Reporter:** Katie Carrick

## The core 5-decimal RULE (verbatim from the ticket description — Rule 15)
> "We need to **show 5 decimal points on the item cost** then **round for the line total** for returns"
> "50 x 58.96836 = 2948.42"

So, in plain terms, the governing precision rule is:
- **Item / unit COST displays 5 decimal places** (the exact received cost is preserved, up to 5 dp).
- **The LINE TOTAL (cost × quantity) is rounded to 2 decimals for display / money.**
- Example given: 50 × 58.96836 = 2948.418 → shown as **2948.42**.

## WHERE the rule applies (from description + evidence images)
The ticket originally scopes this to the **returns** area, on these screens:
1. **Process Return** screen (`/parts/confirm-return`): the "**Price Per Unit**" column shows 5 dp.
2. **Returned Items** screen (`/parts/returns`): the "**Cost**" column shows 5 dp; "**Total Cost**" rounded.

## Evidence (ingested images) — the rule in action
- 23187.png — Returned Items screen: Cost **$0.11984** (5 dp), Qty 50.00 → Total Cost **$5.99** (rounded 2 dp).
  Second row: Cost **$20.00000** (5 dp), Qty 71.00 → Total Cost **$1420.00**.
- 23185.png — Process Return screen: "Price Per Unit" **0.11984** (5 dp), Accepted Qty 50.00,
  Sub total / Total **$5.99** (rounded 2 dp).
- 23156.png — Returned Items list with the Cost column highlighted (the field that must carry the precision).

## QA/acceptance notes from comments (context)
- Bilal Muzamil (2025-09-26): verification pass — "**Price after storing (Stored Price is rounded) →
  Which is as per the acceptance criteria → Passed.**" i.e. the STORED per-unit price on the returns
  flow was accepted as rounded in that specific stored-record case; the DISPLAY rule is 5 dp cost / 2 dp total.
- Katie Carrick (2025-09-26): tested for **CAD and USD**, both work as intended → Ready for production.
- Verified on Staging then Prod (2025-09-29).

## How this is the SPEC for SV-8721
SV-4543 establishes ShopView's decimal-precision contract for part costs:
- **Unit cost is carried/displayed to 5 decimal places** (do NOT round the unit cost to 2 dp).
- **Money line totals (cost × qty), subtotals, and tax are computed on the full-precision cost and the
  resulting money value is rounded to 2 dp** (standard currency rounding).

SV-8721 is the same contract applied to the **PO Receive / Bulk PO Receive** screens, which were
incorrectly rounding the unit cost to 2 dp BEFORE computing line totals/subtotal/tax. The test therefore
checks that on Receive: (a) unit cost keeps its full (up to 5 dp) precision on screen, and (b) line
total / subtotal / tax are computed from that full-precision cost, then money-rounded to 2 dp.
