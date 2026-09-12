# Legacy QA vs Legacy Production — design, sizes and spacing (2026-09-12)

**Status: analysis only. Nothing filed, nothing posted, no ticket raised.**

The QA lead supplied two PDFs and asked for a byte-to-byte comparison, then added:
*"DO compare the design, sizes, spaces/gaps etc the customer are sensitive so they want the legacy
production to be exactly like Legacy QA."*

| | file | document | shop | producer | pages |
|---|---|---|---|---|---|
| **QA** | `Legacy_QA.pdf` | **INV-S99999-16518** | Staging Heavy Duty - 9919 (Calgary) | WeasyPrint 69.0 | 6 |
| **PROD** | `Legacy_Production.pdf` | **INV-S2-194** | Trucks Hill 2 (Ajman, UAE) | WeasyPrint 69.0 | 2 |
| **QA-EMPTY** | `QA_Legacy_Empty.pdf` | **EST-S99999-17582** | Staging Heavy Duty - 9919 | WeasyPrint 69.0 | 1 |

The empty document was supplied as the **reference skeleton** — it shows every header and label the
template emits when there is almost no data to fill them.

Every number below is read out of the PDFs with pymupdf — text spans (position, size, font, colour),
vector drawings (rules, borders, cell boxes), embedded font tables and image placement. Nothing is
eyeballed. Geometry is compared **unrounded**, with a 0.05 pt tolerance (1/1440 inch) below which a
difference is glyph ink, not layout.

Reproduce with `python3 design_check.py` (full output saved as `DESIGN-CHECKS.txt`) and
`python3 make_exhibits.py`.

---

## The answer in one line

**The design is identical (70 of 70 measurements, 0 differ) and every header, column name and label
is present on production (35 of 35). One cell wraps on production that does not wrap on QA — the
"Service Order" heading on `INV-S2-194` — and the QA branch does the same thing to its own asset
value on `EST-S99999-17582`, so it is the template's auto-sizing reacting to data, not a difference
between the two builds (section 4).** Type, sizes, weights, colours, margins, column positions,
rules, cell boxes, logo slot, every vertical gap and every row pitch — plus every label the template
emits, checked against the empty-invoice skeleton. The two documents *look* different because the **data** is different — a different
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

## 3. Every header, column name and label — checked against production

The QA lead supplied `QA_Legacy_Empty.pdf` as the reference skeleton and asked the question directly:
*"If QA branch shows the header 'Unit' the production should also show 'Unit'."*

**Every one of the 35 template labels the QA documents emit is present on production.**

| Group | Labels | On production |
|---|---|---|
| Section headings | Bill To · Remit payment to | **all present** |
| Asset table | Unit · VIN/Serial # · Asset · Mileage · Eng Hrs | **all present** |
| Order table | Service Order · Terms · Due date · Customer PO · Authorizer | **all present** |
| Line table | Description · Quantity · Rate · Amount | **all present** |
| Per-line totals | Parts Total · Labor Total · Line Total | **all present** |
| Row-type gutter | Labor · Parts | **both present** |
| Summary block | Labor · Parts · Shop supplies · Subtotal · Total · Payments · Balance | **all present** |
| Masthead | Invoice: · Invoice Date: · Due date: | **all present** |
| Signature block | Customer signature: · Printed name: · Date: | **all present** |
| Disclaimer | the full 7-line paragraph | **present, verbatim, same wrap** |
| Footer | Powered by ShopView · page-number line | **present** |

Three labels came back as "not found" on a first pass. **All three are false alarms and each is
proven so:**

1. **"Service Order"** — it *is* there, split across two spans ("Service" at x 76.14, "Order" at
   x 79.89) because the cell wraps. That is difference 2.2 above, not a missing header.
2. **"Shop supplies"** — it *is* there, as `Shop supplies (10% of labor)` starting at x 341.01. My
   filter only looked right of x 400; the label is longer, so it starts further left, but it
   **right-aligns to 472.42 pt — exactly the same column as QA.** The org names the fee differently.
3. **"Estimate:"** — the QA-EMPTY file is an **Estimate**; QA and production are both **Invoices**,
   and both correctly print `Invoice:`. Different document type, not a missing label.

The only string genuinely absent is **`GST (5%)`**, which is the Canadian org's tax name. Production
prints its own two: `2% VAT (2%)` and `3% VAT (3%)`. That is data.

### Value slots — is production missing any data it should show?

| Slot | QA-EMPTY | QA | PRODUCTION |
|---|---|---|---|
| Unit | *(blank)* | H9725 | **5454** |
| VIN/Serial # | *(blank)* | CPVNUEG53WP5MMV75 | **WA1LAAF71KD987654** |
| Asset | 2011 Hyundai Santa Fe | 1998 Ford Lt9513 | **2019 Toyota 4-runner** |
| Mileage | *(blank)* | 407,185 | **45,656** |
| Eng Hrs | *(blank)* | 16,408 | **656,566** |
| Service Order | S99999-17582 | S99999-16518 | **S2-194** |
| Terms | COD | Net 60 | **Net 15** |
| Due date | Sep 12, 2026 | Nov 11, 2026 | **Sep 27, 2026** |
| Customer PO | *(blank)* | *(blank)* | *(blank)* |
| Authorizer | *(blank)* | *(blank)* | *(blank)* |
| Bill To | 3 lines | 3 lines | **3 lines** |
| Remit payment to | 4 lines | 4 lines | **4 lines** |

**Production fills every slot QA fills.** Customer PO and Authorizer are blank on **all three**
documents, including the QA ones — no value was entered, so the template correctly prints nothing.

### Part rows — I was wrong about this, and the correction matters

My earlier note said the QA invoice was "labour-only (Parts $0.00 on every line)". **That is wrong.**
The QA summary block says **Parts $613.78**, which should have told me so immediately; I read page 1
and generalised. The QA invoice has **11 part rows**; production has **3**. So they *can* be compared,
and they match:

| | QA | PRODUCTION |
|---|---|---|
| Row-type gutter label | x 60.75 | **60.75** |
| Part text | x 90.41 | **90.41** |
| Part text format | `NUMBER - Description` (`BRAKECLEAN - Brake & Parts Cleaner`) | **`NUMBER - Description`** (`2010 - Reteststage`) |
| Quantity column | x 355.76 | **355.76** |
| Rate right edge | 465.11 | **465.11** |
| Amount right edge | 537.00 | **537.00** |
| Sub-item row pitch | 16.09 pt | **16.09 pt** |

### Lines that show only "Line Total"

Production has one job line printing **Line Total** with no Parts Total / Labor Total above it — the
one titled *"Fixed Line Test"*. **The QA document does the same thing** (page 5, a $0.00 line), so it
is not a production difference. It matches the open item **OQ-2** already recorded on
[SV-4314](https://shopview.atlassian.net/browse/SV-4314): a Fixed Line does not show the
Parts/Labor breakdown. Two further QA cases that look like this are simply page breaks — the Parts
Total and Labor Total are at the foot of the previous page.

### The one thing I cannot settle from the PDFs

The **footer tax-id cell**: QA prints `GST# 812694966 RT0001`, production prints a bare
`5454545454544544` with **no prefix**. If the template emits the `GST# ` prefix, production is missing
it. If the prefix is part of the free-text tax-id the Calgary shop typed into its own settings, both
are correct. Both QA files come from the same org, so they cannot distinguish the two.

**This needs one look at the branch's tax-id setting to settle, and it is the only open question in
the whole comparison.**


## 4. The wrap audit — run in BOTH directions

The QA lead's question: *"If it is being wrapped on production and not on the QA then you must
highlight that too with the invoice number and with the reason… our customers want everything to
appear ditto as it is appearing in the QA."*

Every fixed block on both documents, counted by how many baselines it occupies:

| Block | QA `INV-S99999-16518` | PRODUCTION `INV-S2-194` | Verdict |
|---|---|---|---|
| Masthead — shop name | 2 lines | 1 line | QA wraps (its name is longer) |
| Masthead — document label | 2 lines | 1 line | QA wraps (`INV-S99999-16518` is longer) |
| Masthead — address | 3 lines | 5 lines | ok — production has more address lines |
| Masthead — dates | 2 lines | 2 lines | ok |
| Bill To block | 3 lines | 3 lines | ok |
| Remit payment to block | 4 lines | 4 lines | ok |
| Asset table **header** row | 1 line | 1 line | ok |
| Asset table **value** row | 1 line | 1 line | ok |
| **Order table header row** | **1 line** | **3 lines** | **🔴 PRODUCTION WRAPS** |
| Order table value row | 1 line | 1 line | ok |
| Line table header row | 1 line | 1 line | ok |
| Summary block | 8 rows | 9 rows | ok — production org has two taxes |
| Signature block | 2 lines | 2 lines | ok |
| Disclaimer | 7 lines | 7 lines | ok — identical wrap points |

### The one that matters: `INV-S2-194`, the "Service Order" heading

**Invoice number: `INV-S2-194` (Trucks Hill 2, production).** The heading cell that reads
**"Service Order"** on one line on QA breaks into **"Service" / "Order"** on two lines, pushing the
other four headings ("Terms", "Due date", "Customer PO", "Authorizer") down to a middle baseline and
taking the whole header row from **1 line to 3 baselines**.

**The reason, measured:**

| | QA | PRODUCTION |
|---|---|---|
| The heading "Service Order" needs | **69.21 pt** | **69.21 pt** (same text, same font, same size) |
| The order number printed under it | `S99999-16518` | `S2-194` |
| …which measures | **73.93 pt** | **38.85 pt** |
| So the column is | wide enough for the heading | **35 pt too narrow** |
| Result | one line | **wraps to two** |

The Service-Order table has **no fixed column widths in the print/PDF path** — each column sizes
itself to the widest thing in it. Production's order number is **six characters** against QA's
**twelve**, so column 1 comes out narrower than the heading needs and the heading breaks.

### This is NOT a production-only fault — the QA branch does it too

The proof is in the QA lead's own reference file. **`EST-S99999-17582`, rendered on the QA branch**,
wraps its **asset value** — *"2011 Hyundai Santa"* / *"Fe"* — across two lines, for exactly the same
reason: the asset column auto-sized narrow because the other values in that row were short.

So the honest statement is: **the same template, on either environment, wraps whenever the data
makes a column narrow.** Production is not behaving differently; it is being fed differently shaped
data. Two of the wraps in the table above run the *other* way — QA's own shop name and invoice
number wrap where production's do not.

### What it would take to make it never happen

Two options, and **both are changes to the Legacy template, so they are Branko's call, not ours** —
the Invoice Design Selection spec ([SV-9892](https://shopview.atlassian.net/browse/SV-9892)) defines
Legacy as *"byte-identical to v26.35.10"*:

1. **Fixed column widths in the print path.** A percentage grid on the Service-Order and asset
   tables, so a column never shrinks below its heading. ⚠️ **Worth checking first:** during the
   earlier sv9872 investigation I found a `@media screen` rule pinning those columns to
   17 / 27 / 25 / 17 / 14 %, with **no equivalent in the print path**. If that also holds for the
   Legacy template, the fix already exists for the on-screen preview and simply needs the same rule
   applied to print. **I have not confirmed that against the Legacy print stylesheet** — it needs one
   look at the branch.
2. **`white-space: nowrap` on the heading cells**, so the column is forced at least as wide as its
   own heading.

Until one of those ships, **any shop whose order numbers are short will see this**, on QA and on
production alike.


## 5. The honest part: these two files can never be byte-identical

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

## 6. What I could not check, stated plainly

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
| `ev/EX4-every-label-present.png` | the asset-table, order-table, line-table, summary and signature labels read off all three documents side by side |
| `ev/EX5-part-rows-both.png` | part rows on both documents with their column x — and the correction to my "labour-only" error |
| `ev/EX6-wrap-audit.png` | every block counted by baselines on both documents, the one production-only wrap in the flesh with its invoice number, and the QA branch doing the same thing |

---

## OUTSTANDING — what I need from you

1. **Production credentials + a go-ahead for production writes** — to seed the matching work order for
   the real byte-to-byte test (`build/invoice-prod-compare-2026-09-12/SEED-PLAN.md`). Production is a
   shared, restore-after environment, so I will not write to it without your say-so.
2. **The deploy time** — the seed has to happen on the *current* production build to be a valid
   baseline for an after-the-deploy comparison.
3. **A product decision on the wrapping** — `INV-S2-194`'s "Service Order" heading breaks because the
   print path has no fixed column widths. It is template behaviour on **both** builds (the QA branch
   wraps its asset value on `EST-S99999-17582` for the same reason), so it is not a production defect
   — but if the customer wants it never to happen it needs fixed column widths or `nowrap` on the
   heading cells, which changes the Legacy template and is therefore a PO call under
   [SV-9892](https://shopview.atlassian.net/browse/SV-9892). **Worth checking first** whether the
   `@media screen` column grid already found on sv9872 simply needs applying to the print path.
4. **One look at the production branch's tax-id setting** — to settle whether the footer's missing
   `GST# ` prefix is template or data. It is the only unresolved item in the comparison.
5. **Nothing has been filed or posted.** No Jira comment, no ticket, no TestRail write.
