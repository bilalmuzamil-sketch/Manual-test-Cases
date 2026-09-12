# Legacy QA vs Legacy Production — design, sizes and spacing (2026-09-12)

**Status: analysis only. Nothing filed, nothing posted, no ticket raised.**

The QA lead supplied two PDFs and asked for a byte-to-byte comparison, then added:
*"DO compare the design, sizes, spaces/gaps etc the customer are sensitive so they want the legacy
production to be exactly like Legacy QA."*

| | file | document | shop | producer | pages |
|---|---|---|---|---|---|
| **QA** | `Legacy_QA.pdf` | **INV-S99999-16518** | Staging Heavy Duty - 9919 (Calgary) | WeasyPrint 69.0 | 6 |
| **PROD** | `Legacy_Production.pdf` | **INV-S2-194** | Trucks Hill 2 (Ajman, UAE) | WeasyPrint 69.0 | 2 |

Every number below is read out of the PDFs with pymupdf — text spans (position, size, font, colour),
vector drawings (rules, borders, cell boxes), embedded font tables and image placement. Nothing is
eyeballed. Geometry is compared **unrounded**, with a 0.05 pt tolerance (1/1440 inch) below which a
difference is glyph ink, not layout.

Reproduce with `python3 design_check.py` (full output saved as `DESIGN-CHECKS.txt`) and
`python3 make_exhibits.py`.

---

## The answer in one line

**The design is identical. 70 of 70 design measurements match exactly, 0 differ.** Type, sizes,
weights, colours, margins, column positions, rules, cell boxes, logo slot, every vertical gap and
every row pitch. The two documents *look* different because the **data** is different — a different
shop, a different customer, different jobs, a different tax set-up and a much shorter order number.

---

## 1. The design comparison — 70 checks

### Paper, producer, font files
| Check | Result |
|---|---|
| Page size | **SAME** — A4 595.28 × 841.89 pt |
| PDF producer | **SAME** — WeasyPrint 69.0 |
| Embedded font subsets | **SAME** — `VPGUFU+Nunito-Sans-Bold`, `ZFIQEG+Nunito-Sans` |

The subset tags are identical, which means the **same font files, subset the same way** — the
strongest single signal that the same template rendered both.

### Type
| Check | Result |
|---|---|
| Font families | **SAME** — Nunito-Sans, Nunito-Sans-Bold |
| Type sizes | **SAME** — 6.48 / 9.6 / 10.5 / 10.8 / 14.4 pt |
| Size × weight pairs | **SAME** — all 7 combinations |
| Text colours | **SAME** — `#000000` body, `#424242` disclaimer |

### Page frame
| Check | QA | PROD |
|---|---|---|
| White page card | x 28.50 → 566.78, width 538.28 | identical |
| Page-1 card height | 793.37 pt | identical |
| Body text left edge | 58.50 pt | identical |
| Masthead right-aligned edge | 540.7 pt | identical |
| Footer baseline | y 814.08 | identical |
| Footer left / centre x | 22.50 / 248.65 | identical |
| Footer right edge | 572.80 | identical |
| **Logo slot** | x 217.9 → 396.4, centred on y 81.0 | **identical** |

The logo *images* differ in height inside that slot (87.6 vs 89.2 pt) purely because the two shops'
logo files have different aspect ratios. The slot itself is the same box, in the same place.

### Rules, borders and cell boxes
| Check | Result |
|---|---|
| Horizontal rules (x0, x1, width, thickness, colour) | **SAME** — 3 distinct rules, incl. the grey `#a8a8a8` divider at 58.50 → 536.78 and the black table rule at 60.00 → 535.28 × 0.75 pt |
| Totals cell boxes | **SAME** — x 392.99→463.38 and 464.88→535.28, both 70.39 × 16.09 pt |

### Line-table horizontal geometry
| Element | QA | PROD |
|---|---|---|
| "Description" header | x 90.41 → 141.06 | identical |
| "Quantity" header | x 339.40 → 377.88 | identical |
| "Rate" header | x 442.17 → 462.63 | identical |
| "Amount" header | x 498.79 → 534.53 | identical |
| Row-type gutter ("Labor"/"Parts") | x 60.75 | identical |
| Description text left | x 90.41 | identical |
| Rate column right edge | 465.11 / 465.12 / 465.13 / 465.25 | identical |
| Amount column right edge | 537.00 | identical |

### Vertical rhythm — every gap the eye can see
| Gap | QA | PROD |
|---|---|---|
| Address line leading (10.8 pt) | 14.732 | **14.732** |
| Heading → first address line | 19.641 | **19.641** |
| Asset header → asset values | 20.323 | **20.323** |
| Service-Order header → values | 20.323 | **20.323** |
| Service-Order values → table header | 33.818 | **33.818** |
| Table header → first job title | 29.444 | **29.444** |
| Description line leading | 13.095 | **13.095** |
| Parts Total → Labor Total | 17.595 | **17.595** |
| Labor Total → Line Total | 17.595 | **17.595** |
| Line Total → next job title | 27.942 | **27.942** |
| Last Line Total → summary block | 33.198 | **33.198** |
| Summary row pitch | 13.095 | **13.095** |
| Balance → disclaimer | 33.929 | **33.929** |
| Disclaimer leading | 8.836 | **8.836** |
| Disclaimer → "Customer signature:" | 26.837 | **26.837** |
| "Customer signature:" → "Printed name:" | 22.094 | **22.094** |

One check is **N/A**: the masthead's 14.4 pt heading-to-heading pitch cannot be measured on
production because that shop's name fits on one line. The same 14.4 pt line box is confirmed
identical by the "heading → first address line" row above, which is 19.641 pt on both.

### The money block and the signature block
| Check | Result |
|---|---|
| Summary label right edge | **SAME** — labels right-align to 472.42 pt on both |
| Summary amount right edge | **SAME** — amounts right-align to 539.25 pt on both |
| Disclaimer line count | **SAME** — 7 lines |
| Disclaimer wrap widths, per line | **SAME** — all 7 lines break at the identical x1 |
| Signature block labels + x | **SAME** — all three at x 58.50 / 382.27 |

The **disclaimer wrap is the cleanest proof of the text-column width**: the same paragraph, wrapped
by the renderer, breaks at exactly the same seven points on both documents (525.02, 522.87, 536.69,
521.88, 506.26, 527.87, 212.85). That cannot happen unless the text column is the same width to the
sub-point.

### Weight map — SV-4314 compliance
All 26 weight checks **SAME**: "Line Total" bold, its amount regular; "Parts Total" / "Labor Total"
regular; "Subtotal" / "Total" labels bold, amounts regular; gutter "Labor"/"Parts" regular;
"Payments" / "Balance" regular; all headers and section headings bold.

Both documents comply with **[SV-4314](https://shopview.atlassian.net/browse/SV-4314)** identically.

---

## 2. Everything that *is* different, and why

Nothing in this list is a design change. Each one is traced to the data.

### 2.1 The block under the shop name sits 3.29 pt lower on production

| | QA | PROD |
|---|---|---|
| Shop name + address lines | 5 | 6 |
| Block content ends at | 113.47 pt | 123.29 pt |
| "Bill To" starts at | 126.00 pt | 129.29 pt |

The masthead block has a **minimum height**. QA's address is shorter than that minimum, so "Bill To"
rests on the floor at 126.00 with 12.53 pt of slack above it. Production's address is one line longer,
overruns the floor by **3.29 pt**, and everything below shifts down by the same 3.29 pt.

Put the same shop address on both and this difference disappears. Exhibit `EX3`, panel 1.

### 2.2 "Service Order" wraps onto two lines on production

| | QA | PROD |
|---|---|---|
| "Service Order" heading needs | **69.21 pt** | **69.21 pt** |
| Order number below it | `S99999-16518` | `S2-194` |
| …which measures | 73.93 pt | **38.85 pt** |
| Result | fits on one line | **wraps to two** |

The Service-Order table **sizes its columns to their content**. A 6-character order number makes
column 1 narrower than the heading needs, so the heading breaks. The heading itself is 69.21 pt on
both — same text, same font, same size.

The same thing governs the asset table: every header cell's *text width* is identical on both
(Unit 23.23, VIN/Serial # 60.87, Asset 30.11, Mileage 40.18, Eng Hrs 41.47 pt) and only the column
*positions* differ, because the values under them differ in width.

**This is a template behaviour, not a production defect** — the QA branch does the same thing with a
short order number. It is worth a product decision if the customer objects to it (a minimum width on
column 1, or a fixed column grid), but it is not a difference between the two builds.
Exhibit `EX3`, panel 2.

### 2.3 Content differences, listed for completeness

| | QA | PROD |
|---|---|---|
| Shop / customer / jobs | Staging Heavy Duty, Monroe Truck Service | Trucks Hill 2, First Customer Prod |
| Shop-supplies label | `Shop supplies` | `Shop supplies (10% of labor)` — the org names the fee |
| Tax rows | one: `GST (5%)` | two: `2% VAT (2%)`, `3% VAT (3%)` |
| Terms | Net 60 | Net 15 |
| Parts on the invoice | none (labour only) | several |
| Pages | 6 | 2 |
| Logo | Foothills Truck & Trailer | Acme Truck & Trailer |

The QA lead already said to ignore the logo.

---

## 3. The honest part: these two files can never be byte-identical

The instruction was *"the invoice from production should and MUST match byte to byte with the invoice
from the QA branch."* **These two files cannot** — they are different invoices. Different company,
different customer, different jobs, different tax set-up, different order number. A literal byte
comparison of them only reports that the content differs, which tells nobody anything.

**What this comparison does instead is the test that actually answers the question:** it strips the
content out and compares the *template* — every coordinate, size, weight, colour, rule and gap the
renderer produced. On that comparison they are identical, 70 of 70.

**The byte-to-byte test the customer's question really needs is the seeded one**, already planned in
`build/invoice-prod-compare-2026-09-12/SEED-PLAN.md`: create a work order on production with the same
shop details, the same customer, the same asset, the same jobs and the same order-number shape,
render it, and compare it against the QA render of the same data. Then a literal difference **is**
meaningful. That plan is still blocked on three things — see below.

---

## 4. What I could not check, stated plainly

- **Part rows on the QA document.** The QA invoice is labour-only (Parts $0.00 on every line), so the
  part-row layout could not be compared like-for-like. Production has part rows and they use the same
  gutter x (60.75), description x (90.41) and a 16.09 pt sub-item pitch — but there is no QA
  counterpart to diff them against.
- **Full continuation-page card height.** QA has four full continuation pages (776.87 pt card);
  production is only 2 pages and its page 2 is the last page, whose card height is content-driven
  (772.03 pt). No full continuation page exists on production to compare.
- **Two content shapes exist only on QA** and therefore have no production counterpart: a 26.19 pt
  paragraph gap inside a multi-paragraph description, and a 34.49 pt gap where a job line has a title
  and no description body. Neither indicates a template difference; both are absent from production
  simply because production's jobs are shaped differently.
- **Neither document was rendered by me.** Both were supplied as files. I have not driven either
  build in this pass, so this is a comparison of two given artefacts, not a live test.

---

## Exhibits

| file | shows |
|---|---|
| `ev/EX1-design-identical.png` | both page 1s side by side with the shared template coordinates (58.50 / 90.41 / 339.40 / 442.17 / 498.79 / 535.28) drawn straight across both — the lines land in the same place on both documents |
| `ev/EX2-money-block-identical.png` | the summary block on both: labels right-aligned to 472.42 pt, amounts to 539.25 pt, 13.09 pt row pitch — identical |
| `ev/EX3-the-two-visible-differences.png` | the masthead shift and the "Service Order" wrap, each with the measurement that causes it |

---

## OUTSTANDING — what I need from you

1. **Production credentials + a go-ahead for production writes** — to seed the matching work order for
   the real byte-to-byte test (`build/invoice-prod-compare-2026-09-12/SEED-PLAN.md`). Production is a
   shared, restore-after environment, so I will not write to it without your say-so.
2. **The deploy time** — the seed has to happen on the *current* production build to be a valid
   baseline for an after-the-deploy comparison.
3. **A product decision on the "Service Order" wrap** — it is template behaviour on both builds, not a
   defect, but if the customer objects it needs a minimum column width or a fixed column grid, which
   is a change to the Legacy template and therefore a PO call (the Legacy template is defined as
   byte-identical to v26.35.10 under
   [SV-9892](https://shopview.atlassian.net/browse/SV-9892), so changing it is not a QA decision).
4. **Nothing has been filed or posted.** No Jira comment, no ticket, no TestRail write.
