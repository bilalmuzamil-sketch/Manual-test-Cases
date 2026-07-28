# SV-8721 — BEFORE vs AFTER Screenshot Comparison (complete, all 5 customer images)

**Ticket:** SV-8721 — *"Purchase Order Receiving Rounds Part Costs, Causing Vendor Invoice Totals to Mismatch"* (status: TESTING STAGE)
**Rule tested:** SV-4543 — *"show 5 decimal points on the item cost then round for the line total"*
**Prepared:** 2026-07-28 · Env: `app.staging.shopview.com` (admin, Heavy Duty 9919) · Live-observed, evidence-based (Rules 10/12/13/14).
**Fresh seed:** WO **S9-26209** (`5a7034f7-…`, marked ZZAUTOTEST), customer *Aadale Motors*, 2020 Ford Transit. One approved line, 4 vendor part requests at the customer's exact costs (0.240 / 0.027 / 0.089) plus a 5-decimal part (45.6789) for the Edit-dialog test. Ordered into PO **S9-26209** (`d229f6b1-…`). Deleted after capture.

## Plain summary (read this first)
- The customer's core complaint — **PO Receive subtotal $15.60 vs vendor invoice $15.32** — is **FIXED**. The Receive Parts screen and the Purchase Order Details → Remaining Parts tab both now show the unit cost at full **5 decimals** and compute totals from that precision, so the PO subtotal is **$15.32** (exact match to the paper invoice).
- Two surfaces still display a **2-decimal rounded** cost and are captured honestly below:
  1. the **Work Order line "Parts" view** (Rate/cost column) — unchanged, still rounds (this view was not part of the PO-Receive fix);
  2. the **Edit Part Request dialog** — on re-open it rounds the cost to 2 decimals (e.g. 0.089 → **0.09000**, 45.6789 → **45.68000**). Dev (Dusan) scoped this dialog quirk as **separate / pre-existing** from SV-8721.

---

## The 5 customer images — each with an exact matching AFTER

| # | Area | Before (ticket) | After (live staging) | Key number (before → after) | Verdict |
|---|------|-----------------|----------------------|-----------------------------|---------|
| 1 | PO **Receive Parts** screen | `before/before-03-receive-parts-subtotal-15.60.png` (att 59050) | `R1-receive-screen.png` | Subtotal **$15.60 → $15.32** | ✅ **FIXED** |
| 2 | Vendor **paper invoice** (target) | `before/before-04-vendor-paper-invoice-15.32.png` (att 59051) | `R1-receive-screen.png` (Subtotal $15.32) | invoice 15.32 ↔ ShopView **$15.32** | ✅ **MATCHES TARGET** |
| 3 | WO line **"Parts" view** | `before/before-02-wo-line-parts-rounded.png` (att 59049) | `after/after-02-wo-line-parts-5dp.png` | cost $0.03/$0.09, totals **$2.40/$3.60 → $2.40/$3.60** (unchanged) | ❌ **STILL ROUNDS** (view outside fix scope) |
| 4 | **Edit Part Request** dialog | `before/before-01-edit-part-request-dialog.png` (att 59048) | `after/after-01b-edit-nnsc-0.089.png` (same part) + `after/after-01-edit-part-request-dialog.png` (45.6789) | Cost **$0.08900 → $0.09000** ; 45.6789 → **45.68000** | ❌ **STILL ROUNDS** (separate pre-existing, dev Dusan) |
| 5 | PO Details → **Remaining Parts** | `before/before-05-po-details-remaining-parts-5dp.png` (att 59052) | `after/after-05-po-details-remaining-parts-5dp.png` | cost shown at **5dp $0.24000 / $0.02700 / $0.08900** | ✅ **FIXED (5dp preserved)** |

Side-by-side images (labelled BEFORE | AFTER) in `evidence/side-by-side/`:
`SBS-01-receive-parts-screen.png`, `SBS-02-wo-line-parts.png`, `SBS-03-edit-part-request-dialog.png`, `SBS-04-vendor-invoice-vs-receive.png`, `SBS-05-po-details-remaining-parts.png`.

---

## Area 1 — PO **Receive Parts** screen (the customer's exact case)  ✅ FIXED

| | File | What it shows |
|---|---|---|
| **BEFORE** | `before/before-03-receive-parts-subtotal-15.60.png` (att 59050) | Costs rounded to 2dp **$0.24 / $0.03 / $0.09**; line totals **$9.60 / $2.40 / $3.60**; **Subtotal $15.60**. |
| **AFTER** | `R1-receive-screen.png` | Costs at 5dp **$0.24000 / $0.02700 / $0.08900**; line totals **$9.60 / $2.16 / $3.56**; **Subtotal $15.32**. |
| **Combined** | `side-by-side/SBS-01-receive-parts-screen.png` | Before (left) vs After (right). |

Key changes: SWS washer $0.03→$0.02700 (line $2.40→$2.16); NNSC nut $0.09→$0.08900 (line $3.60→$3.56); **Subtotal $15.60→$15.32** (now equals the vendor invoice).
*(R1 is the clean 3-part customer case; reused per instruction. Backend `GET /api/inventory/orders/{id}` on the fresh PO independently confirms `price_decimal` 0.24000 / 0.02700 / 0.08900 and `total_price_decimal` 152.36.)*

## Area 2 — Vendor's paper invoice (the "correct" target)  ✅ AFTER MATCHES

| | File | What it shows |
|---|---|---|
| **BEFORE (reference)** | `before/before-04-vendor-paper-invoice-15.32.png` (att 59051) | Gregg Distributors invoice: nets 0.240/0.027/0.089; extended 9.60/2.16/3.56; **SUB TOTAL 15.32**. |
| **AFTER** | `R1-receive-screen.png` | ShopView Receive Parts **Subtotal $15.32** — exact match. |
| **Combined** | `side-by-side/SBS-04-vendor-invoice-vs-receive.png` | Invoice vs Receive screen. |

## Area 3 — WO line **"Parts" view**  ❌ STILL ROUNDS (surface not in fix scope)

| | File | What it shows |
|---|---|---|
| **BEFORE** | `before/before-02-wo-line-parts-rounded.png` (att 59049) | Line's Parts rows: cost **$0.24 / $0.03 / $0.09**, totals **$9.60 / $2.40 / $3.60**. |
| **AFTER** | `after/after-02-wo-line-parts-5dp.png` | Same view (Awaiting / Receive). Cost still **$0.24 / $0.03 / $0.09**; totals still **$9.60 / $2.40 / $3.60**. |
| **Combined** | `side-by-side/SBS-02-wo-line-parts.png` | Identical rounding before and after. |

**Honest result:** the WO-line Parts "Rate/cost" column and its line totals are **unchanged** — this view still rounds cost to 2 decimals and computes totals from the rounded value ($2.40 not $2.16; $3.60 not $3.56). The SV-8721 fix covers the **PO Receive** and **PO Details** surfaces (where the money is actually committed and matched to the vendor invoice), not this WO-line preview column. Flag to the PO/dev if the 5-decimal display is also expected here.

## Area 4 — **Edit Part Request** dialog  ❌ STILL ROUNDS (separate pre-existing item)

| | File | What it shows |
|---|---|---|
| **BEFORE** | `before/before-01-edit-part-request-dialog.png` (att 59048) | NNSC-038 nut (cost 0.089): Cost field **$0.08900**. |
| **AFTER (same part)** | `after/after-01b-edit-nnsc-0.089.png` | Re-opened NNSC-038 dialog: Cost field **$0.09000** (rounded to 2dp, zero-padded). |
| **AFTER (starker)** | `after/after-01-edit-part-request-dialog.png` | Part entered at cost **45.6789** → dialog re-opens showing **$45.68000** (lost the .0089). |
| **Combined** | `side-by-side/SBS-03-edit-part-request-dialog.png` | $0.08900 → $0.09000. |

**Honest result (Rule 12 — observed live):** on re-opening the Edit Part Request dialog the Cost field is **rounded to 2 decimals and zero-padded to 5** (0.089 → 0.09000; 45.6789 → 45.68000). It reads the legacy 2-decimal cost, not the full-precision value. The full precision is still preserved everywhere it matters (the PO Details cost column shows **$45.67890** for the same part). This matches Ayesha's note and dev **Dusan's** call that the Edit-dialog rounding is **separate / pre-existing** from SV-8721 → belongs on its own ticket, not a blocker for SV-8721's PO-Receive fix.

## Area 5 — PO Details → **Remaining Parts** tab  ✅ FIXED (5dp preserved)

| | File | What it shows |
|---|---|---|
| **BEFORE (reference)** | `before/before-05-po-details-remaining-parts-5dp.png` (att 59052) | Customer PO IYZF-33: Cost column at 5dp ($420.66000, $18.38000). |
| **AFTER** | `after/after-05-po-details-remaining-parts-5dp.png` | Our PO S9-26209: Cost **$0.24000 / $0.02700 / $0.08900 / $45.67890**; Total Cost **$9.60 / $2.16 / $3.56 / $137.04**. |
| **Combined** | `side-by-side/SBS-05-po-details-remaining-parts.png` | 5dp cost column, correct totals. |

---

## Backend precision confirmation (all areas)
`GET /api/inventory/orders/d229f6b1-…` on the fresh PO — legacy 2dp fields kept for compatibility alongside the new full-precision `*_decimal` fields the fixed screens render:

| Part | `price` (legacy) | `price_decimal` (fixed) | `total_cost` (legacy) | `total_cost_decimal` (fixed) |
|---|---|---|---|---|
| ZZ-CB2SC-038 | 0.24 | **0.24000** | 9.60 | **9.60** |
| ZZ-SWS-038 | 0.03 | **0.02700** | 2.40 | **2.16** |
| ZZ-NNSC-038 | 0.09 | **0.08900** | 3.60 | **3.56** |
| ZZ-AY-4DP | 45.68 | **45.67890** | 137.04 | **137.0367** |
| Order total | `total_price` 152.64 | | | `total_price_decimal` **152.36** |

Purchase Orders list total for the PO = **$152.36** (full precision; the buggy rounded math would show $152.64).

## Extra honest finding (not one of the 5 customer images)
On the Work Order **Financial Info** panel the **Parts** figure showed **$152.64** (the rounded sum), while the PO list / PO Details total showed **$152.36** (full precision). So the WO totals panel still aggregates on the rounded 2dp cost. Worth flagging to dev alongside Area 3 (same root cause — WO-side displays still use the legacy 2dp cost).

## Bottom line
5 / 5 customer images now have an exact matching live AFTER. **2 FIXED** (Receive Parts subtotal $15.60→$15.32; PO Details 5-decimal cost), **1 matches the vendor-invoice target**, and **2 honestly still round** (WO-line Parts view + Edit Part Request dialog) — the dialog being the separate pre-existing item dev Dusan already identified. The customer's actual bug (PO receive total not matching the invoice) is resolved.
