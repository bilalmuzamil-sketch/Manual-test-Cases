# SV-8721 — Jira comment ADDENDUM (tax/total leg) — DRAFT, not posted

One-line addendum to append to the already-posted Production verification comment
(the user decides whether/when to post):

---

Tax/Total also verified live on Production (Jul 29): with the customer's three costs the Receive Parts screen shows Subtotal **$15.32**, and entering the vendor invoice tax **$0.77** gives Total **$16.09** — exactly the customer's invoice figures (the bug produced 15.60 / 0.78 / 16.38). Note: the tax field default differs only because our prod test org has a 0% tax rate (it correctly showed Tax $0.00 / Total $15.32 before the entry) — a tax-rate setting, not a precision issue.

---

Evidence: `evidence/PROD-R3-tax-total.png` + `evidence/PROD-R3-order-detail-3parts.json`
(seeded WO S2-796 / PO 25989663… deleted after, verified gone).
