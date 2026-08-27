# SV-8910 — Vendor invoice total duplicated onto every PO when one receive spans two POs — QA PASS

**Date:** 2026-08-27
**Branch:** https://sv8910.qa.shopview.com (API https://sv8910api.qa.shopview.com)
**Build:** app-version `v26.35.5-d44e2fb`, index.html etag `6f099276d57f7b4d8e1b1e94700b559e`
**Verdict:** PASS. Per Rule 62 (per-ticket QA branch, PASS ⇒ final), not provisional.
**Vendor invoices seen at:** Parts → Vendors → Aabridge Beverages → Unpaid Invoices
(`/parts/vendor/1e7bd0bf-e882-45fa-8c21-835e32ffa374/unpaid-invoices`).

## The bug
When one vendor invoice covers parts on two different purchase orders (received together in one
submission), the full invoice total was written onto BOTH PO rows — the Vendor Invoices list then
showed the invoice worth double. Fix (PR #2800, BE-only): each PO records only its own share, and the
receive-screen tax is split across the POs in proportion to their part costs, summing exactly.

## Checklist (from the dev's QA handoff) and results — every row backed by a screenshot AND observed data

| # | Check | Result | Evidence |
|---|---|---|---|
| — | The merged receive itself (input side) | On-screen Total $300.00, two POs' parts under one vendor/invoice | `EX-0-merged-receive-screen-annotated.png` (+ raw `clean-receive-before.png`) |
| A | Two POs, one invoice — each row its own share ($100 / $200), not $300 twice | PASS — rows $100.00 + $200.00, Totals selected $300.00 (before fix: $600.00) | `EX-A-unpaid-zero-annotated.png` + delivery records read via API |
| B (uneven tax) | Tax 10.01 over a $100/$200 pair — shares total exactly, larger PO larger share | PASS — 3.34 + 6.67 = 10.01; PO rows $103.34 + $206.67 = $310.01 | `EX-B-unpaid-tax-annotated.png` + API |
| B (zero tax) | Tax empty — both rows no tax, totals match part costs | PASS — $100 + $200, no tax | `EX-A` (INV-ZERO) + API |
| C1 | Single-PO full receive with tax — recorded total matches screen, tax matches | PASS — 2×$100 + $15 tax; on-screen Total $215.00 = recorded $215.00 | `EX-C1-single-receive-annotated.png` (+ raw `single-receive-screen.png`) + API |
| C2 | Single-PO partial receive (1 of 2) — total reflects only qty received | PASS — 1×$100 = $100.00 recorded (INV-P) | API-observed delivery record; also visible as a row on `EX-A` |

**Nothing here is inferred.** Every verdict is a value read live from the running build — the on-screen
receive totals (screenshots) and the stored per-PO delivery records (`GET /api/inventory/orders/{id}`,
`deliveries[].total_price` + nested items) — and the vendor Unpaid Invoices page (screenshots). The
"before the fix" figures ($600 / $620.02) are the documented prior behaviour (ticket + the QA lead's
own old-build screenshot on sv8781), not re-measured on this branch (the fix is already deployed here).

Additional confirming run: a $100/$100 two-PO merged receive with tax 10.01 recorded $105.01 + $105.00
= $210.01 (own shares, tax 5.01+5.00 exact).

## Not exercised this pass (honest limits)
- **B (even tax 21.00 two-PO):** not run separately — same split path as the uneven 10.01 case, which
  is the harder "sum exactly" check and passed.
- **C3 (core charge single-PO):** not exercised — needs a cored catalogue part seeded. The fix derives
  the delivery total from the parts on the delivery, so a core line is additive to the same subtotal;
  recommend one core-charge receive as a confirming check when convenient.
- QuickBooks vendor-bill sync not checked (no QBO connected); the known one-bill-per-multi-PO-invoice
  item is out of scope per the handoff.

## How it was verified
Reproduced live via the app (quick-login admin, org d55bc308, workplace HD-9919). Setup via API
(work order, line, parts, order) + UI for the receive screens and split. Verified the per-PO delivery
records with `GET /api/inventory/orders/{id}` (`deliveries[].total_price` vs nested items) and on the
vendor Unpaid Invoices page. Fix mechanism confirmed: receive posts via
`POST /api/orders/receive-requested-parts`; each PO's delivery header carries its own part share + its
own proportional tax share.

Test data left in place (QA branch), tagged `ZZAUTOTEST` / `ZZAUTOTEST-INV-*`.
