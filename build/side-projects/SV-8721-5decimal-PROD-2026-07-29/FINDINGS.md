# SV-8721 — 5-Decimal Cost Fix — PRODUCTION Verification — FINDINGS

**[SIDE PROJECT #2]** — self-contained, not one of the 7 main ShopView projects.
Date: 2026-07-29 · Env: **PRODUCTION** app.shopview.com / api.shopview.com (org 72b2cc90…, the prod test org)
Live, evidence-based verification (Rules 10/12/13/14). NO TestRail writes. Seeded + fully deleted a ZZAUTOTEST WO/PO.

## VERDICT (one line)
**SV-8721 is FIXED on Production and behaves EXACTLY as verified on staging on 2026-07-27** — every checkpoint (5-decimal costs, line totals, the $15.32 subtotal, the backend decimal fields, the 45.6789 storage, the PO list total) matches the staging-verified values row for row.

## Plain summary (read this first)
- The fix the developers deployed to Production works. The Purchase Order **Receive Parts** screen on
  Production now shows part costs at full **5-decimal precision** and calculates line totals and the
  Subtotal from that full precision — exactly like staging.
- Reproduced the customer's exact numbers live on Production: 3 parts at costs **0.240 / 0.027 / 0.089**
  → the Receive screen showed **$0.24000 / $0.02700 / $0.08900**, line totals **$9.60 / $2.16 / $3.56**,
  and **Subtotal $15.32** (correct). The original bug produced **$15.60**.

## How I tested (live on Production)
- Session: real login `POST https://api.shopview.com/api/login {username,password}` (the user's supplied
  cookie also worked read-only at first; the fresh login was used for the browser + cleanup). No SSO on prod.
- Seeded a ZZAUTOTEST work order **S2-795** (WO id c68bcc21…) in the **Trucks Hill 2** workplace,
  added one authorized line (via `POST /api/work-orders/{id}/lines/create-from-canned-line` — the staging
  `lines/create` payload 400s on prod), then added 4 vendor part requests:
  - ZZ-CB2SC-P · qty 40 · cost **0.240**
  - ZZ-SWS-P · qty 80 · cost **0.027**
  - ZZ-NNSC-P · qty 40 · cost **0.089**
  - ZZ-AY-4DP-P · qty 3 · cost **45.6789** (the 4-decimal check)
- Ordered all 4 into ONE purchase order (**PO S2-795**, id a78a3994…), opened the **Receive Parts** screen
  (`/order/{id}?receive=1&returnTo=WorkOrder&returnId={wo}`) in a real browser, read the on-screen values,
  and captured the backend order-detail JSON. Deleted the WO at the end (PO auto-removed, verified gone).

## Observed on Production (with evidence)
| Checkpoint | Production observed | Evidence |
|---|---|---|
| Unit costs on Receive screen | **$0.24000 / $0.02700 / $0.08900 / $45.67890** (5 decimals) | PROD-R1 / PROD-R2 screenshots |
| Line totals | **$9.60 / $2.16 / $3.56 / $137.04** | PROD-R1 screenshot |
| Subtotal, customer's 3 parts | **$15.32** (deselecting the 4-dp part recalcs the subtotal live to $15.32) | PROD-R2 screenshot |
| Subtotal/Total, all 4 parts | **$152.36** (buggy math would be $152.64) | PROD-R1 screenshot |
| Backend decimal fields | `price_decimal` = "0.24000" / "0.02700" / "0.08900" / "45.67890"; `total_cost_decimal` = 9.6 / 2.16 / 3.56 / 137.0367; order `total_price_decimal` = **152.36** (legacy `total_price` still 152.64) | PROD-order-detail.json |
| 45.6789 storage | stored as **45.67890** (5 dp, trailing zero appended — same cosmetic behavior as staging) | PROD-order-detail.json |
| PO list "Total Price" | **$152.36** on the S2-795 row (full-precision; buggy = $152.64) | PROD-B0 screenshot |

## PRODUCTION vs STAGING — row by row ("is it now working exactly as it was on staging?")
Staging values from `build/side-projects/SV-8721-5decimal-2026-07-27/FINDINGS.md` + `PRECISION-RECHECK.md`
(verified 2026-07-27/28); original bug values from the customer report / SV-8721.

| Checkpoint | Original bug | Staging observed (2026-07-27) | Production observed (2026-07-29) | Match? |
|---|---|---|---|---|
| Unit cost display (0.240 / 0.027 / 0.089) | $0.24 / $0.03 / $0.09 (2 dp) | $0.24000 / $0.02700 / $0.08900 | $0.24000 / $0.02700 / $0.08900 | **MATCH** |
| Line totals (40×0.240 / 80×0.027 / 40×0.089) | $9.60 / $2.40 / $3.60 | $9.60 / $2.16 / $3.56 | $9.60 / $2.16 / $3.56 | **MATCH** |
| Subtotal (customer's 3 parts) | **$15.60** (wrong) | **$15.32** | **$15.32** | **MATCH** |
| Backend `price_decimal` fields present | absent/rounded | "0.24000" / "0.02700" / "0.08900" | "0.24000" / "0.02700" / "0.08900" | **MATCH** |
| Backend `total_cost_decimal` | n/a | full precision (e.g. 3.56) | 9.6 / 2.16 / 3.56 / 137.0367 | **MATCH** |
| Backend order `total_price_decimal` | n/a (only a rounded total) | full-precision total; legacy field still rounded | **152.36**; legacy `total_price` still 152.64 | **MATCH** |
| 4-decimal entry 45.6789 | n/a | stored `price_decimal` = "45.67890", line total $137.04 | stored `price_decimal` = "45.67890", line total $137.04 | **MATCH** |
| PO list "Total Price" | rounded sum ($152.64-style) | **$152.36** (full precision) | **$152.36** | **MATCH** |

**Answer: yes — Production now works exactly as staging did on 2026-07-27. 8/8 checkpoints MATCH, 0 DIFFER.**

## Honest limits (Rule 12 — what was NOT driven this run)
- The standalone **Bulk PO Receive** (multi-PO "Receive Selected") page was not driven (needs multiple
  same-vendor POs; same honest limit as the staging pass — the single-PO Receive screen verified here is
  the surface the customer's bug was on).
- The **Edit Part Request dialog** reopen-rounding and the **Work-Order-side** rounded displays (WO line
  "Parts" view, Financial Info "Parts" figure) were not re-driven on prod — on staging those were scoped
  by dev as separate/pre-existing items OUTSIDE SV-8721, so they are not part of this verdict.
- Receive was NOT actually submitted (the Receive button was not pressed) — the fix under test is the
  cost display + subtotal math on the Receive screen, which is what the ticket names; keeping the
  footprint minimal on prod (the WO/PO were deleted after).

## Seeding footprint + cleanup (Production residue = NONE)
- Created: 1 ZZAUTOTEST WO in QA Testing (deleted immediately after a workplace mix-up), 1 ZZAUTOTEST WO
  **S2-795** in Trucks Hill 2 with 1 canned line + 4 ZZAUTOTEST vendor parts, ordered into PO S2-795.
- Deleted: both WOs via `POST /api/work-orders/delete` (201). Verified gone: WO view → 400 "Not found",
  PO view → 400 "Not found", PO absent from the Purchase Orders list. **Zero residue.**
- No settings, roles, or other data touched. No TestRail writes. Secrets kept in /tmp only.

## Evidence files (evidence/)
- `PROD-R1-receive-screen-4parts.png` — Production Receive Parts screen: 5-dp costs, line totals, Subtotal $152.36.
- `PROD-R2-receive-3parts-subtotal-15.32.png` — same screen with only the customer's 3 parts selected: **Subtotal $15.32** (the exact staging/vendor-invoice figure).
- `PROD-B0-po-list-total-152.36.png` — Purchase Orders list, S2-795 row, Total Price **$152.36**.
- `PROD-order-detail.json` — backend order detail: `price_decimal` / `total_cost_decimal` / `total_price_decimal` vs the legacy rounded fields.
