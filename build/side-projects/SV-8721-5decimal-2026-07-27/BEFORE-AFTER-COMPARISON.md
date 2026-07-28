# SV-8721 — BEFORE vs AFTER Screenshot Comparison

**Ticket:** SV-8721 — *"Purchase Order Receiving Rounds Part Costs, Causing Vendor Invoice Totals to Mismatch"* (status: TESTING STAGE)
**Rule tested:** SV-4543 — *"show 5 decimal points on the item cost then round for the line total"*
**Prepared:** 2026-07-28 · Env: `app.staging.shopview.com` (admin) · Fix verified live (see `FINDINGS.md`)

## Plain summary
- **BEFORE** (customer's bug report): the PO **Receive Parts** screen rounded each unit cost to 2 decimals *before* multiplying, so ShopView's PO subtotal (**$15.60**) did not match the vendor's paper invoice (**$15.32**).
- **AFTER** (fixed on staging): the same screen now shows the unit cost at full **5-decimal** precision and computes totals from it, giving subtotal **$15.32** — an exact match to the vendor invoice.

The customer attached **5 images** to the ticket. Below, each is matched to an "after" screenshot we captured live on staging. The two are truly comparable for the **key** area (the Receive Parts screen); three others are context/reference images and are noted with what (if anything) would be needed to capture a like-for-like "after."

---

## Area 1 — PO **Receive Parts** screen (the customer's exact case)  ✅ EXACT MATCH

| | File | What it shows |
|---|---|---|
| **BEFORE** | `evidence/before/before-03-receive-parts-subtotal-15.60.png` (ticket attachment 59050) | Receive Parts screen. Costs rounded to 2dp: **$0.24 / $0.03 / $0.09**; line totals **$9.60 / $2.40 / $3.60**; **Subtotal $15.60**. |
| **AFTER** | `evidence/R1-receive-screen.png` | Same Receive Parts screen. Costs at 5dp: **$0.24000 / $0.02700 / $0.08900**; line totals **$9.60 / $2.16 / $3.56**; **Subtotal $15.32**. |
| **Combined** | `evidence/side-by-side/SBS-01-receive-parts-screen.png` | Before (left) vs After (right), labelled. |

**Key numbers that changed (before → after):**
- SWS washer cost: **$0.03 → $0.02700**  → line total **$2.40 → $2.16**
- NNSC nut cost: **$0.09 → $0.08900**  → line total **$3.60 → $3.56**
- CB2SC bolt cost: **$0.24 → $0.24000** (no change; already exact)  → line total **$9.60 → $9.60**
- **Subtotal: $15.60 → $15.32** (now equals the vendor invoice)

---

## Area 2 — Vendor's paper invoice (the "correct" target)  ✅ AFTER MATCHES THE TARGET

| | File | What it shows |
|---|---|---|
| **BEFORE (reference)** | `evidence/before/before-04-vendor-paper-invoice-15.32.png` (ticket attachment 59051) | Gregg Distributors paper invoice. Net prices **0.240 / 0.027 / 0.089**; extended **9.60 / 2.16 / 3.56**; **SUB TOTAL 15.32**. This is the number ShopView must match. |
| **AFTER** | `evidence/R1-receive-screen.png` | ShopView Receive Parts **Subtotal $15.32** — an exact match to the paper invoice. |

This image is the vendor document, not a ShopView screen, so there is no separate UI "after"; the match is that our Area 1 after now equals this invoice's $15.32.

---

## Area 3 — WO **line / Parts** view (rounded cost flowing to the line)  ⚠️ PARTIAL MATCH

| | File | What it shows |
|---|---|---|
| **BEFORE** | `evidence/before/before-02-wo-line-parts-rounded.png` (ticket attachment 59049) | The work-order line's Parts rows in the "Awaiting / Receive" state, showing the **rounded** part cost ($0.24 / $0.03 / $0.09) and totals ($9.60 / $2.40 / $3.60). |
| **AFTER (closest)** | `evidence/R0-wo-awaiting.png` | The same WO line Parts view (parts in "Awaiting", Receive buttons) for our seeded WO S9-26205. |

**Partial, not exact.** In our seeded WO the part rows were given non-zero sell margins, so the visible money column is the **Sell rate** ($0.32 / $0.50 / $0.10), not the raw cost the customer's shot displayed. The cost-rounding effect is therefore best shown on the Receive Parts screen (Area 1), where our after is exact. **To produce a like-for-like WO-line "after"** (parts at 0% margin so cost = the visible figure), a fresh live staging run is needed (staging cookies).

---

## Area 4 — **Edit Part Request** dialog  ❌ NO MATCHING AFTER (needs fresh live run)

| | File | What it shows |
|---|---|---|
| **BEFORE** | `evidence/before/before-01-edit-part-request-dialog.png` (ticket attachment 59048) | The "Edit Part Request" dialog for NNSC-038, with **Cost $0.08900** (5dp), Core Charge $0.00, Sell Price $0.32, Margin 72.1875%. |
| **AFTER** | *none captured* | — |

**No after captured.** During the live run the part had already been **ordered**, so its ⋮ (kebab) menu offered only *Move* and *Add Part Fee / Discount* — **no Edit option** (see `evidence/E1-edit-part-dialog.png`, which shows that kebab). The Edit Part Request dialog could not be reopened on an ordered part. Ayesha's separate note (dialog re-displays cost rounded to 4dp) was scoped by dev as a pre-existing/separate item from this ticket. **To capture this "after"**, a fresh live staging run is needed, opening Edit on a **not-yet-ordered** part request.

---

## Area 5 — **PO Details → Remaining Parts** tab (5-decimal cost column)  ⚠️ PARTIAL / RELATED AFTER

| | File | What it shows |
|---|---|---|
| **BEFORE (reference)** | `evidence/before/before-05-po-details-remaining-parts-5dp.png` (ticket attachment 59052) | A different PO (IYZF-33) Purchase Order Details → **Remaining Parts** tab, where the **Cost** column already shows 5dp (**$420.66000**, **$18.38000**) and Total Cost ($420.66 / $220.56). Customer context: 5dp already shows here, but not on Receive. |
| **AFTER (related)** | `evidence/B0-po-list.png` | Purchase Orders list — our seeded PO **S9-26205 Total Price $152.36** (computed on full precision; the buggy rounded math would show $152.64). Confirms the full-precision fix flows through to the PO total. |

**Partial.** We captured the PO-list total (full precision) but **not** the per-part *PO Details → Remaining Parts* tab for our seeded PO, which is the exact surface in attachment 59052. **To produce an exact "after"** for this specific tab, a fresh live staging run is needed (open PO Details → Remaining Parts on the seeded PO).

---

## Backend precision confirmation (all areas)
`evidence/order-detail.json` (staging API order-detail response) shows the fix at the data layer — legacy 2dp fields kept for compatibility alongside new full-precision `*_decimal` fields:

| Part | `price` (legacy) | `price_decimal` (fixed) | `total_cost` (legacy) | `total_cost_decimal` (fixed) |
|---|---|---|---|---|
| ZZ-NNSC-038 | 0.09 | **0.08900** | 3.60 | **3.56** |
| ZZ-CB2SC-038 | 0.24 | **0.24000** | 9.60 | **9.60** |
| ZZ-SWS-038 | 0.03 | **0.02700** | 2.40 | **2.16** |
| Order total | `total_price` 152.64 | | | `total_price_decimal` **152.36** |

The Receive screen and PO total now render the `*_decimal` values.

---

## Summary of matches

| Area | Before (ticket) | After (ours) | Match quality |
|---|---|---|---|
| 1. Receive Parts screen | before-03 (59050) | R1-receive-screen.png | ✅ **Exact** (Subtotal $15.60 → $15.32) |
| 2. Vendor paper invoice | before-04 (59051) | R1 Subtotal $15.32 | ✅ After matches the target |
| 3. WO line Parts view | before-02 (59049) | R0-wo-awaiting.png | ⚠️ Partial (different sell margin; fresh run for exact) |
| 4. Edit Part Request dialog | before-01 (59048) | — | ❌ None (kebab had no Edit on ordered part; fresh run needed) |
| 5. PO Details → Remaining Parts | before-05 (59052) | B0-po-list.png (related) | ⚠️ Partial (captured PO-list total, not the Remaining-Parts tab; fresh run needed) |

**Bottom line:** the customer's core complaint — the **Receive Parts subtotal $15.60 vs invoice $15.32** — has a clean, exact before/after pair (Area 1 + the combined image) plus backend proof. Three secondary images (Edit dialog, WO-line cost view, PO Details Remaining-Parts tab) would each need a fresh live staging run (staging cookies) to produce pixel-for-pixel "after" shots.
