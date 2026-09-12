# Production seed + invoice comparison — plan (2026-09-12)

**Status: planned, not executed. Waiting on production credentials.**

The QA lead asked me to seed similar data in production so the invoice it produces can be compared
against the QA baseline `S16810___12092026.pdf` (Invoice **INV-S9901-16810**, md5 `72b665bb…`).

---

## ⚠️ Time-critical: seed BEFORE the deploy, not after

The deploy is a few hours away. That gives us a choice between a weak test and a strong one.

**The weak version** — seed after the deploy and compare the prod invoice against the QA file. Two
different companies, so the shop name, address, tax number, remit-to block, tax rate, shop-supplies
amount and the order number all differ. Byte equality is impossible; only a structural comparison
means anything, and every difference has to be argued about.

**The strong version** — seed the work order and invoice it **now, before the deploy**, take the PDF,
then re-render **the same invoice** after the deploy and compare the two.

That is the identical design that settled the sv9901/sv9872 question yesterday: **same company, same
work order, same data, same order number — only the build changes.** Every difference is then the
deployment, with nothing to argue about. It is also the only version where "byte to byte" is a fair
description of what we are doing.

**This only works if the seed happens before the deploy.** After that the before-state is gone.

I will do both if there is time — the before/after pair is the evidence; the QA baseline stays as a
cross-check.

---

## What gets seeded

Prod test org `72b2cc90-6964-4429-a207-76e55f946936`, workplace **Trucks Hill 2**
`b617914c-16e9-4485-8e8b-193cd86aa416` (has canned lines — the QA Testing workplace does not).
Everything tagged **ZZAUTOTEST**.

Matched deliberately to the QA baseline, because these are what drive the layout:

| | value | why |
|---|---|---|
| Asset VIN | `1LH930VHXK1E27469` | the VIN column sizes to its content — using the same VIN removes that variable entirely |
| Asset description | `2019 Landoll Corporation 930e` | so the Asset cell wraps onto two lines the same way |
| Unit # | left blank | the baseline's Unit cell is empty |
| Mileage / Eng Hrs | 11 / 0 | same |
| Terms | Net 30 | same |
| Customer PO / Authorizer | left blank | both blank on the baseline |
| Display toggles | `summarizePartsTotal: true`, `summarizeLaborTotal: true` | set through `POST /api/invoices/{woId}/settings/change`; this is what makes the Parts Total / Labor Total rows appear, and it is what caught us out on sv9872 |

Line shape — enough to exercise every element of the document:

1. a **labour-only** line with a multi-row tech story (exercises the description wrap and the
   `Labor` gutter label)
2. a **labour + parts** line (exercises the `Parts` gutter, the part rows, Parts Total)
3. a line whose totals block **falls across a page break** (exercises the continuation header and
   the split rule)
4. enough lines to reach **at least 2 pages**
5. a **payment** for the full amount, so Balance prints $0.00 as it does on the baseline

## What cannot be matched, and will differ

Stated now so nothing is mistaken for a regression later:

- **Shop name, address, phone, tax number and the remit-to block** — different company. If the prod
  shop name fits on fewer lines than "Staging Heavy Duty - 9919", the masthead is shorter and the gap
  above "Bill To" grows. That is the fixed-height header block behaving normally.
- **The order number.** Prod assigns it and there is no `S9901` branch prefix, so it will be shorter
  than `S9901-16810`. **The header table sizes its columns to their content**, so a shorter number
  narrows column 1 and can push **"Service Order"** onto two lines and squeeze the **VIN** column.
  Measured yesterday; it is not a defect.
- **Tax label and rate** — the baseline prints `GST (5%)`.
- **Shop supplies** — $350.00 on the baseline, whatever the prod org is set to here.
- **Customer name and address**, and therefore the Bill To block's height.

## Method

1. `POST /api/login {username, password}` → PHPSESSID. **Log in once** — a second login for the same
   user expires the first session.
2. `POST /api/iam/change-location` to Trucks Hill 2.
3. Create the customer, asset and work order; add lines with
   `POST /api/work-orders/{id}/lines/create-from-canned-line` (the plain `lines/create` returns 400
   on prod), parts with `part/make-request`.
4. Set the two display toggles.
5. Invoice it, take the payment, then pull the PDF with
   `GET /api/invoices/preview?invoice_id=<id>&type=pdf`.
6. **After the deploy**, re-pull the same invoice id and compare the two PDFs element by element —
   positions, type sizes, weights, colours, every rule and border, the page frames — the same pass as
   `build/invoice-old-vs-new-2026-09-11/live/`.
7. Record the build marker (`<meta name="app-version">`) on both sides.

## Cleanup

Production is **not** a per-ticket QA branch, so the restore-after discipline applies: the seeded
work order, customer and asset are deleted afterwards (`POST /api/work-orders/delete` removes the WO
and its un-received PO), and any org setting I touch is put back byte-identical. The two display
toggles are per-work-order, so they go with the work order.

## Needed before any of this runs

- **Production credentials** for the dummy account (`app.shopview.com`) — username and password.
  `/tmp` was wiped on the container restart, so I hold nothing. They stay in `/tmp`, never committed.
- **Confirmation that seeding and invoicing on production is authorised** for this purpose. Standing
  Rule 6 says the prod account is a disposable test account, but a production write deserves a yes.
- **The deploy time**, so the before-state is captured in good time.
