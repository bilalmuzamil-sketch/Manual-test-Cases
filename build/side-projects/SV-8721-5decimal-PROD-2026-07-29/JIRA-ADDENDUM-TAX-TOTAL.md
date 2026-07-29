# SV-8721 — Jira comment ADDENDUM (tax/total leg) — ✅ FOLDED INTO COMMENT 74275 (2026-07-29), NOT posted separately

This addendum was folded into the main Production verification comment 74275 via an
in-place edit on 2026-07-29 (new section "2b) Tax and grand Total", 4th screenshot
PROD-R3-tax-total.png = attachment id 59142, intro + Verdict strengthened). See
JIRA-COMMENT-PROD-SV-8721.md for the live comment text. Original draft kept below
for the record:

---

Tax/Total also verified live on Production (Jul 29): with the customer's three costs the Receive Parts screen shows Subtotal **$15.32**, and entering the vendor invoice tax **$0.77** gives Total **$16.09** — exactly the customer's invoice figures (the bug produced 15.60 / 0.78 / 16.38). Note: the tax field default differs only because our prod test org has a 0% tax rate (it correctly showed Tax $0.00 / Total $15.32 before the entry) — a tax-rate setting, not a precision issue.

---

Evidence: `evidence/PROD-R3-tax-total.png` + `evidence/PROD-R3-order-detail-3parts.json`
(seeded WO S2-796 / PO 25989663… deleted after, verified gone).
