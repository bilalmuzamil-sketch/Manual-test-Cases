# Why "Service Order" breaks onto two lines — 2026-09-11

**Status: analysis only. Nothing filed, nothing posted.**

Asked about work order **S-17586** (`2424f223-9d11-4a9f-8b89-c8ab70d3ecbc`, status *approved*, so the
Finance tab shows an **estimate** preview) on **sv9872** — build `v26.36.2-ad8b0e2`, read live.

## It is the on-screen preview only. The printed document is not affected.

Rendering the estimate as a PDF from the same branch
(`POST /api/work-orders/invoices/estimate`, `type: pdf`) and measuring it: **"Service Order" prints on
one line** at x 63.64→132.85, and the order number `S9872-17586` prints on one line at x 63.00→130.63.
So the customer's copy is fine.

## The cause, measured

The preview pins the document to the printed sheet's own width — **718px** — so that it breaks line for
line with the PDF. That leaves the header table **638px**, and the first column is `width: 15%`.

Rendered in Chromium against the branch's own preview HTML, pinned to 718px:

| | column 1 width | text room after padding | "Service Order" needs | result |
|---|---|---|---|---|
| **15%** (the base rule) | 95.7px | **83.7px** | **91.8px** | **breaks in two** — and so does `S9872-17586` |
| **17%** (the `@media screen` override) | 108.5px | **96.5px** | 91.8px | **fits on one line**, order number too |

WeasyPrint lays the same percentages out differently — it gives column 1 about 16% — which is why the
PDF never had the problem.

## There is already a fix on this branch, and it works

The estimate **and** the invoice HTML served by **sv9872** both carry an `@media screen` block setting
the five columns to **17 / 27 / 25 / 17 / 14 %**. The same HTML served by **sv9901 (v26.35.10) does not
carry it** — so this wrap is **pre-existing behaviour that v26.36.2 fixes**, not a regression.

With that block active in my render, nothing wraps. With it deleted, "Service Order" and the order
number both break — which is exactly what the screen shows.

## What I could not confirm

**I could not drive the live Finance tab.** Chromium cannot reach `sv9872.qa.shopview.com` through this
container's proxy (`ERR_CONNECTION_CLOSED` via the MITM bridge, `ERR_CONNECTION_RESET` direct), although
`curl` through the same bridge returns 200. Everything above was measured on the **HTML the branch
itself served me**, not on the rendered application page.

So if the screen still shows two lines: either the page is cached from before the fix landed, or the
override is not reaching the rendered page. **A hard reload settles it.** If it still wraps after a hard
reload, that is a real finding — the fix is in the served HTML but not taking effect — and worth a
ticket.

## Exhibit

`ev/EX1-service-order-wrap.png` — the two states side by side, with the measured column widths.
Raw captures and geometry: `ev/so-unfixed.png`, `ev/so-fixed.png`, and the matching `.json`.
