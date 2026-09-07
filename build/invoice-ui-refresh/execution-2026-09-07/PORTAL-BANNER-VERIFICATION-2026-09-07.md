# Customer-portal paid banner — the three held cases, executed live
**Date:** 2026-09-07 · **Environment:** staging (`app.staging.shopview.com` + `staging.portal.shopview.com`) · **Build:** `v26.35.9-9812433`

## How the portal is reached (this was the blocker, and it is now closed)

The customer portal is **not** discoverable from the shop-app bundle, the invoice email or the API.
It is reached from the **account menu**:

> click the avatar at the top right → **Customer Portal** (marked *New*) → opens
> `https://staging.portal.shopview.com/invoices` in a new tab.

The click posts to `https://staging.portal.shopview.com/sso-login`, which mints a
`shopview_customer_portal_session` cookie for the same signed-in shop user. **No separate portal
password exists or is needed.** The portal is a Laravel + Inertia app (route map in its inline
`Ziggy` block), entirely separate from the Quasar shop app.

## How the banner document is produced

Open an invoice in the portal → the **printer icon** at the top right → **“Print with Payment
Receipt”**. That loads `/invoices/{invoice}/preview?include_receipt=1`. “Print Invoice” (the other
menu entry) produces the same document **without** the banner.

**The banner is rendered client-side**, by `build/assets/PreviewInvoice-DQmgXtBb.js`. The server’s own
invoice HTML (`props.htmlContent`) contains none of the banner strings — which is why every earlier
attempt to find the banner by fetching the document server-side came back empty.

## What was seeded to produce every state

| State | How |
|---|---|
| Partially paid, one portal payment | S-32263 — Stripe test card 4242 4242 4242 4242, $100.00 of $406.09 |
| Fully paid, two single portal payments | S-32263 — second payment of $306.09 |
| Fully paid, one batch payment covering two invoices | S-32264 + S-32221, batch checkout ($14,230.01) |
| One single payment then one batch payment on the same invoice | S-32220 ($50.00 single, then batched with S-32136) |
| A batch payment carrying a **late fee** | S-12725 (existing, Apr 17 2026, late fee CA$4.73) |
| One shop-recorded payment **and** one portal payment on the same invoice | S-32052 — CASH $5.00 via `create-customer-payment`, then $5.00 in the portal |

Batch payment is driven from the portal invoice list: filter by customer, tick two unpaid rows, **Pay
Online**.

## Verdicts

| Case | Verdict | Why |
|---|---|---|
| **C44951** — banner appears only on portal PDFs, before all content | **Passed** | All five clauses observed. Banner sits above the masthead; it lists only the portal payment on S-32052 while the Summary lists both `Sep 7, 2026 - Cash $5.00` and `Sep 7, 2026 - Online $5.00`; the shop-app document for S-32263 and S-32220 — both of which now carry portal payments — contains **zero** occurrences of `PAID IN FULL`, `PARTIALLY PAID`, `Payment Receipt`, `Payments by ShopView` or `portal-paid-invoice-summary`. |
| **C45175** — pill and title wording | **Passed** | `PAID IN FULL` / `PARTIALLY PAID` exact; `Payment Receipt - Payments by ShopView` whenever any listed payment is a single one; `Payment Receipt (Batch) - Payments by ShopView` when every listed payment is a batch payment (S-32264, S-12725). |
| **C44952** — labelled fields and conditional rows | **FAILED, clause 4 only** | `Remaining Balance` never appears. Everything else passes: exact labels, `Total Charged (Batch)` covering the whole batch, `Late Fee` shown only when non-zero, `Payment 2 of 2 · Batch` marker, `Sep 7, 2026 - 10:23 AM MDT` date format. |

## The clause-4 finding, and why it is a SPEC correction rather than a build defect

`Remaining Balance` was absent on four invoices where the balance immediately after a listed payment
was greater than $0.00 — S-32263 ($306.09 after payment 1 of 2), S-32220 ($150.23 after payment 1 of
2), S-32052 ($7.45, still `PARTIALLY PAID`) and the partially paid state of S-32263.

The string **does not exist anywhere in the portal front end**: all 133 JavaScript assets listed in
`https://staging.portal.shopview.com/build/manifest.json` were downloaded and searched — zero
occurrences.

**Production carries the same code.** `https://portal.shopview.com/build/manifest.json` maps the same
chunk name, and the file is byte-identical:

```
626a1d5723ef32a340fc78161caad3a6b4153313dd7f0e97e49babac1d4c1c77  portal.shopview.com/…/PreviewInvoice-DQmgXtBb.js
626a1d5723ef32a340fc78161caad3a6b4153313dd7f0e97e49babac1d4c1c77  staging.portal.shopview.com/…/PreviewInvoice-DQmgXtBb.js
```

So the row has never existed in production. Spec v57 **S8-R8** opens *“Behavior already in
production, restated unchanged — this spec adds no new banner work”*, and **S8-R9 is not marked
net-new**. The spec's own standing principle then decides it:

> *“Where a rule in this spec is found to disagree with what production already does, and that rule
> is not marked net-new, the rule is amended to describe production rather than production being
> changed to match the rule.”*

⇒ Raised as a **spec correction**, not as a build defect.

## One case-text correction

C44952 clause 5 reads `"Payment X of Y - Batch"` with a hyphen. Spec v45 and v57 both write
`"Payment X of Y · Batch"` with a middle dot, and the build renders the middle dot. The **build is
right and the case text is wrong**; the case text is corrected to match the spec.

## Evidence

`evidence-portal-banner/` — `ann-1-banner.png`, `ann-2-balance.png`, `ann-3-twopayments.png`
(annotated), the raw captures, and the extracted document text.
