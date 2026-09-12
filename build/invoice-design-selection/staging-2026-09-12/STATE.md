# Invoice Design Selection — the three customer-portal cases on Staging

Run 446 · https://shopview.testrail.io/index.php?/runs/view/446
Worked 12 September 2026 on Staging, build `v26.36.2-38f5dd6`.
**Run now stands at 45 passed · 0 failed · 0 blocked — the suite is complete.**

## Where each case landed

| Case | Link | Verdict | Evidence |
|---|---|---|---|
| C53569 Standalone portal Payment Receipt is unaffected by the setting | https://shopview.testrail.io/index.php?/cases/view/53569 · test https://shopview.testrail.io/index.php?/tests/view/2924654 | **Passed** | `evidence/S9.json`. Receipt identical under both settings (same wording, same amounts, same page size 42,657) while a control invoice in the same pass DID change. Its printed PDF is identical too (`pdf-legacy-receipt.pdf` / `pdf-modern-receipt.pdf`, both 232 chars, same three amounts). 0 guard discards. |
| C53566 Customer portal on-screen and PDF render the current setting | https://shopview.testrail.io/index.php?/cases/view/53566 · test https://shopview.testrail.io/index.php?/tests/view/2924651 | **Passed** | On screen `evidence/S9.json`; PDF `evidence/S15.json` + `pdf-{legacy,modern}-{paid,unpaid}.pdf`. Legacy = sentence-case headings (Bill To / Remit payment to / Line Total); Modern = capitalised blocks (ADDRESSES / BILL TO / REMIT PAYMENT TO / SUMMARY / BALANCE) with the totals moved up. Same invoice number, identical money set. Repeated on a second invoice. 0 discards. |
| C53567 Paid banner appears only on portal Invoice PDF | https://shopview.testrail.io/index.php?/cases/view/53567 · test https://shopview.testrail.io/index.php?/tests/view/2924652 | **Passed** | `evidence/S24.json`, `evidence/S28.json`, `pdf24-*.pdf` and the rendered pages `pdf24-*-p1.png`. **PAID IN FULL** pill present under both settings on `Print with Payment Receipt`; absent on plain `Print Invoice`, absent on an invoice with no payment, absent on the in-app Finance tab of the same invoice and of an estimate (both documents fully rendered, so the negatives are proved). 0 discards. |

## How the paid banner is actually reached (the part that cost the time)

The portal has no PDF endpoint. The printer control on `/invoices/<id>` is a **dropdown** —
`Print Invoice` and `Print with Payment Receipt` — **but only when the invoice carries a ShopPay
payment**; an invoice paid by card inside the shop app has `props.payment === null` and gets a plain
link instead. The banner is injected client-side by `PreviewInvoice-*.js` only when a **succeeded**
payment is passed, so the working URL is
`/invoices/<id>/preview?include_receipt=1&payment_id=<payment id>`. Qualifying pairs come straight
from the portal Payments list (`status==='succeeded' && invoice_id && !is_batch_payment`).
Full recipe now in `build/APP-ACTIONS-PLAYBOOK.md` under CUSTOMER PORTAL.

## Probes kept here

| File | What it does |
|---|---|
| `S9_run.mjs` | the on-screen pass over all three cases, guarded |
| `S15_pdf.mjs` | prints the portal documents to real PDFs under both settings, with an unpaid control |
| `S24_paid_banner.mjs` | the paid-banner pass with both portal negative controls and the print-menu proof |
| `S25_inapp.mjs` / `S28_estimate.mjs` | the in-app contrasts (invoice Finance tab, estimate Finance tab) |
| `S13_controls.mjs` | enumerate every control on a portal page, no exclusions |
| `S16_routes.mjs` / `S17_devmode.mjs` | the access probes from a cold jar |

Read a browser-printed PDF with **pymupdf**, not `pdf_text.py` (which returns empty for them), and
render the page to PNG when the thing you are looking for may be a graphic.

## Left behind on Staging

The Invoice Design setting was found on **Legacy** and is left on **Legacy** (read back after the last
pass). Nothing was seeded, nothing was paid, no data was created.
