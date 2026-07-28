# SV-8721 — Where the 1-cent subtotal difference lives ($2,288.64 vs $2,288.65)

**[SIDE PROJECT]** Date: 2026-07-28 · Env: app.staging.shopview.com / api.staging.shopview.com (admin)
Live, evidence-based (Rules 10/12/13/14). NO TestRail writes. Seeded + deleted a ZZAUTOTEST WO.

## What I did (plain)
- Re-seeded a fresh ZZAUTOTEST work order (WO **S9-26212**, id `a7f79fd9…`) in the Staging Heavy Duty (9919) workplace.
- Added the SAME 6 vendor parts with the SAME costs used before:
  124.96545, 122.99656, 40.99885, 0.123456 (stored as 0.12346), 999.00001, 1000.55555.
- Ordered all 6 into ONE purchase order (PO **S9-26212**, id `76149d6d…`).
- Opened three screens, captured them, and drew a red box + arrow + label on each.
- Deleted the seeded work order at the end.

## The plain answer — which screen shows which number

| Number | Screen | The EXACT on-screen label next to it | How it is calculated |
|--------|--------|--------------------------------------|----------------------|
| **$2,288.64** | **Receive Parts screen** (the "Purchase Order Details" page reached from the WO, `/order/{id}?receive=1…`) | **"Subtotal:"** (and the **"Total:"** just below it also reads **$2,288.64**) | **Sum-then-round:** add up the full 5-decimal costs, THEN round the total once. 124.96545 + 122.99656 + 40.99885 + 0.12346 + 999.00001 + 1000.55555 = 2288.63988 → **$2,288.64** |
| **$2,288.65** | **Purchase Orders list** (`/parts/orders`) | **"Total Price"** column, on the S9-26212 row | **Round-each-line-then-sum:** round every line to 2 decimals FIRST, then add them. 124.97 + 123.00 + 41.00 + 0.12 + 999.00 + 1000.56 = **$2,288.65** |
| *(no aggregate figure)* | **PO Details screen** (`/order/{id}`, Remaining Parts tab) | Columns are only **"Cost"** (full 5 decimals) and **"Total Cost"** (2 decimals) per line — **there is NO Subtotal / aggregate Total field anywhere on this screen** | n/a — it never sums the lines on screen |

Confirmed live: the PO Details screen has **no** subtotal or grand-total row (the user was right). It shows each
line's 5-decimal Cost and 2-decimal Total Cost only.

## Is the 1-cent difference actually visible to a user?
**No — not on any single screen.** The two figures live on two DIFFERENT screens:
- The **Receive Parts** screen shows **$2,288.64** (Subtotal / Total).
- The **Purchase Orders list** shows **$2,288.65** (Total Price column).
- The **PO Details** screen shows neither (no aggregate at all).

So a user would only ever notice the 1-cent gap by flipping between the Purchase Orders list and the Receive
screen and comparing them side by side. They never contradict each other on one page at the same time. This is a
**display/rounding-method inconsistency between two screens**, not a same-screen contradiction.

## Are the per-LINE numbers consistent across screens? (yes)
Every per-line **Cost** (5 decimals) and **Total Cost / Total** (2 decimals) is **identical** on the Receive
screen, the PO Details screen, and the backend order JSON:

| Part | Cost (5dp, all screens) | Line total (2dp, all screens) |
|------|--------------------------|-------------------------------|
| PR1 | $124.96545 | $124.97 |
| PR2 | $122.99656 | $123.00 |
| PR3 | $40.99885  | $41.00 |
| PR4 | $0.12346   | $0.12 |
| PR5 | $999.00001 | $999.00 |
| PR6 | $1,000.55555 | $1,000.56 |

**Only the aggregate/subtotal differs by 1 cent**, purely because the Receive screen sums-then-rounds while the
PO record / PO list rounds-each-line-then-sums. No per-line value is wrong or corrupted.

## Which total would feed QuickBooks? (honest)
- I **could NOT drive a live QuickBooks round-trip** this run (no reachable connected-QB company on this staging
  org; a real QB push needs a connected QB company + a human in QuickBooks — per project memory). So this is the
  **ShopView-side** answer, not an observed QB result.
- The **stored aggregate** on the purchase order is `total_price` / **`total_price_decimal = 2288.65`** (the
  round-each-line-then-sum value — same as the Purchase Orders list "Total Price").
- A QuickBooks bill/invoice for received parts is built from the **per-line received costs**, each a 2-decimal
  currency amount ($124.97, $123.00, $41.00, $0.12, $999.00, $1,000.56), which sum to **$2,288.65**.
- Therefore QuickBooks would receive **$2,288.65** (matching the PO record's stored `total_price_decimal`), **not**
  the Receive-screen display figure $2,288.64. The Receive-screen **Subtotal $2,288.64 is a display-only
  sum-then-round** and is not the persisted total.
- Stored field name that the QB figure derives from: the order's **`total_price_decimal`** (with the per-line
  `total_cost_decimal` / rounded `price` fields as the line sources). A full live QB verification still needs a
  QB-connected company + a human if you want that leg driven.

## Bottom line (plain)
- **$2,288.64** = **Receive Parts** screen, field **"Subtotal:"** (and "Total:"). Sum-then-round.
- **$2,288.65** = **Purchase Orders list**, column **"Total Price"** (= stored `total_price_decimal`). Round-each-line-then-sum. This is the one that would flow to QuickBooks.
- **PO Details** screen shows **no** subtotal/total — only per-line **Cost** (5dp) and **Total Cost** (2dp).
- The 1-cent gap is **NOT visible on one screen**; it only appears if you compare the two screens.
- All per-line costs/totals are **consistent** everywhere; only the aggregate rounding method differs.

## Evidence (this run)
- `evidence/discrepancy-locate/raw-a-receive-screen.png` + `ANNOT-a-receive-subtotal.png` — Receive screen "Subtotal: $2,288.64".
- `evidence/discrepancy-locate/raw-b-po-list.png` + `ANNOT-b-po-list-total-price.png` — PO list "Total Price $2,288.65".
- `evidence/discrepancy-locate/raw-c-po-details.png` + `ANNOT-c-po-details-no-total.png` — PO Details, no aggregate total.
- `evidence/discrepancy-locate/order-detail.json` — backend order JSON (per-line `*_decimal` + order `total_price_decimal = 2288.65`).

## Honest limits (Rule 12)
- Live-observed with evidence: all three screens + on-screen labels + the backend order JSON, this run.
- NOT driven this run: the live QuickBooks sync (see the QuickBooks section) — needs a QB-connected company + a human.
