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

---

# VIN/Serial # — the same column, and the older build breaks it earlier

Asked to check the VIN column too, because it breaks sooner on one of the documents.

## In the printed PDF it never breaks

Every PDF I hold prints the VIN on one line, and the column sits at the same place on both builds
(header x 166.3→227.2 on the v26.35.10 and v26.36.2 renders of S-16810). Checked across seven
documents: `1LH930VHXK1E27469` · `NKLXH84FY4MY5U7B2` · `8M5W3KR3WLJBG0W4B` · `KZUGZYRTJV6G5L64N` ·
`BEEJJJJ2SK23R9RYR` — **one line, all of them.** This is a screen-preview matter only.

## On screen, the older build gives the column less room

Same positional rule as "Service Order": the VIN is column 2, base `width: 25%`, raised to **27%** by
the `@media screen` override that exists only on v26.36.2.

| | VIN column | text room after padding |
|---|---|---|
| **v26.35.10** (no override) | 159.5px | **147.5px** |
| **v26.36.2** (override active) | 172.3px | **160.3px** |

**+12.8px, and that is the whole of the difference.** The older build breaks it earlier.

## Why the same 17-character field breaks on one document and not the next

Every VIN is 17 characters, but the **pixel width is not** — it depends on which letters it contains.
Measured at the preview's own font:

| VIN | width | v26.35.10 | v26.36.2 |
|---|---|---|---|
| `1LH930VHXK1E27469` | 143.2px | one line | one line |
| `3AKJHHDR5LSLX8888` | 147.1px | one line | one line |
| `BEEJJJJ2SK23R9RYR` | 145.3px | one line | one line |
| `1FUJGLDR8CLBP8834` | 147.9px | **breaks** | one line |
| `KZUGZYRTJV6G5L64N` | 151.5px | **breaks** | one line |
| `NKLXH84FY4MY5U7B2` | 151.8px | **breaks** | one line |
| **`8M5W3KR3WLJBG0W4B`** | **161.8px** | **breaks** | **still breaks** |

The middle three are the ones that make it look inconsistent: they fall **between** the two column
widths, so they wrap on the old build and fit on the new one.

Verified by substitution, not by arithmetic — each VIN was put into the real preview on each branch
and the rendered line boxes counted.

## The residual worth reporting

**The fix does not cover the widest VINs.** `8M5W3KR3WLJBG0W4B` is **161.8px** against the corrected
column's **160.3px** — **1.5px short** — so on v26.36.2 it still wraps, leaving a lone **"B"** on the
second line. That VIN is not hypothetical: it is the one on **EST-S1-17520**, one of the documents
supplied earlier in this thread.

So the 27% override fixes the common case and leaves the wide-glyph case. Options for whoever picks it
up: a little more width, or letting that cell shrink its text, or not pinning the preview to 718px at
all. **Not filed — the call is the PO's and the QA lead's.**

Exhibit: `ev/EX2-vin-column.png` (raw captures `ev/v-a.png`, `ev/v-b.png`, `ev/v-c.png` with geometry).
