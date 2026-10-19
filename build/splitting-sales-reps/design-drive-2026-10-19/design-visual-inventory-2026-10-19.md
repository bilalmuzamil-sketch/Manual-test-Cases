# Design visual inventory — Splitting Sales Representatives (19 Oct 2026)

Rule 126 / skill 21 §4b. The design is **image-only** (68 PNG boards, no DOM), so `design_visual_inventory.py` (which renders a
DOM per state) cannot run on it. The same observations were taken from the pixels instead: every board viewed by eye, and
sizes measured with `tools/measure_card.py` plus targeted pixel scans (the boards are 1× screenshots: 1 image px = 1 CSS px;
phone boards are 2×, halved below). Measurements are from images, ±1 px; anything a tester must confirm on the build is
measured there with the browser's own tools.

Classes: **CONFIRM** (design matches the PRD code) · **DESIGN-ONLY** (PRD silent; the design is the source for the look) ·
**SPEC-CONFLICT** (design differs from the PRD; see DESIGN-REVIEW §6) · **GAP** (PRD names it, no board shows it).
Screens: file names in `screens/` (browser Play-view screenshots) and `unpacked/png/` (the board images themselves).

## 1 · Work order card (page 1)

| # | Screen / state | What the design shows | PRD | Class |
|---|---|---|---|---|
| V1 | 1.2 rest | Field order on the card: Lead Technician, Service Advisor, Sales Representative (directly under Service Advisor) | S1-R1 | CONFIRM |
| V2 | 1.2–1.16 | Label (small grey, ~11 px) on line 1, name (dark, ~14 px) on line 2; all three labels start at the same left edge, x = 37 | S1-R2 | CONFIRM |
| V3 | 1.2, 1.5, 1.9, 1.12, 1.14, 1.16 rest | No box, no arrow, no + or x at rest | S1-R3 | CONFIRM |
| V4 | 1.3, 1.6 hover | Box appears on the Sales Representative field only (not on Lead Technician / Service Advisor): white-blue fill #FBFDFF, 1 px border, a 3 px light-blue (#EBF2FE) halo outside it, rounded corners; field box 177 × 44 px (x 35–211, y 370–413 in 1.6) | S1-R4 | CONFIRM (box look itself DESIGN-ONLY) |
| V5 | 1.3, 1.6 hover | Dropdown arrow = small filled triangle (caret-down, 8 × 4 px) at the right end of the field, vertically centred on label + name (caret centre y 391, box centre y 391.5) | S1-R11 | CONFIRM |
| V6 | 1.3, 1.6 hover | Grey + (Lucide plus, glyph 14 px = 20 px icon) to the right of the field, no fill | S2-R1/S2-R2 | CONFIRM |
| V7 | 1.6, 1.7 | **Gap from the field box to the + button: 22 px from the box's border (19 px from the outer edge of the 3 px halo)** — button x 234–265, box border ends x 211/212, halo ends x 214 | S1-R5 "16px" | **SPEC-CONFLICT (C5)** |
| V8 | 1.7 hover + | + button with light-grey fill #E3E5E8, 32 × 32 px (x 234–265, y 376–407), square with rounded corners | S2-R1/S2-R2 | CONFIRM |
| V9 | 1.7 | Tooltip "Add representative": dark grey #757575 box, white text, 134 × 31 px, **centred below the +, 14 px under it**, overlapping the next card and the left edge of the lines panel | S2-R3 | CONFIRM text; position DESIGN-ONLY |
| V10 | 1.4, 1.11, 1.15 list | Dropdown opens directly below the field, **same width as the field box** (x 35–211), white, shadow, 4 options × 48 px rows; arrow flips to caret-up while open; checked option = tick + blue text on light-blue row | S1-R8/S1-R9/S1-R12 | CONFIRM (no search box) |
| V11 | 1.4 | Options order: Unassigned, Becky Gonzales, Daniel Montoya, Gerald Ortiz (A–Z by first name) | S1-R8 | CONFIRM |
| V12 | 1.8 menu | + keeps its grey fill while the menu is open; no tooltip; box + arrow stay shown | S2-R2/S2-R3/S1-R4 | CONFIRM |
| V13 | 1.8 menu | Menu: one option "Sales Representative - Parts", white with shadow, 200 × 32 px, **4 px below the +, right edge aligned with the + button's right edge** (so it extends left over the field) | S2-R4 "below it" | CONFIRM; alignment DESIGN-ONLY |
| V14 | 1.9 rest | Two rows "Sales Representative - Labor" then "- Parts", both "Becky Gonzales", labels in full, plain text | S2-R5/S2-R6/S2-R14 | CONFIRM |
| V15 | 1.10 hover | Both boxes at once; arrow moves to the **bottom-right corner on the name line** (caret y 398–402, name line 396–409), right of where the longer label ends; no + anywhere; grey x (Lucide x, glyph 12 px) beside Parts only; nothing beside Labor | S1-R11/S2-R8/S2-R10 | CONFIRM |
| V16 | 1.10 | Vertical rhythm: label-to-label pitch 60 px for Lead Technician → Service Advisor → SR-Labor → SR-Parts (labels at y 258, 318, 378, 438); boxes 44 px tall with 16 px between them (Labor box ends 413/414, Parts box starts 430) | S1-R6 | CONFIRM |
| V17 | 1.2 / 1.0 | With Lead Technician blank, its pitch to Service Advisor is 52 px in the build vs 72 px in production (the 20 px message strip removed) | S1-R6 context note | CONFIRM |
| V18 | 1.13 hover x | x button: light-grey fill, 32 × 32 px (x 234–265, y 436–467); tooltip "Remove Sales Representative - Parts" centred below it, overlapping the next card and lines panel | S2-R8/S2-R9 | CONFIRM; position DESIGN-ONLY |
| V19 | 1.11 Labor list | Labor list open below Labor field, Parts row hidden under the list, x still shown beside Parts | S1-R4/S2-R11 | CONFIRM |
| V20 | 1.17 read-only (invoiced) | Plain text; labels "Lead technician", "Service advisor" (lower-case second word) next to "Sales Representative - Labor" / "- Parts" (title case) on the same card; label style here is a larger grey than on the editable card; label pitch 58 px; zero buttons (note) | S2-R17/S1-N1/S1-R6 | CONFIRM wording; **mixed label casing = DESIGN-ONLY (existing read-only card), question Q11** |
| V21 | 1.19 log | Dialog "Work Order Log": columns Event, User, Line, Details, Date, Time; Details label "Sales Representative:" in bold, "→" arrow, Parts first, "·" separator; long values wrap to 3 lines | S7-R1–R3 | CONFIRM wording; layout DESIGN-ONLY |

## 2 · Customer window and customer page (page 2)

| # | Screen / state | What the design shows | PRD | Class |
|---|---|---|---|---|
| V22 | 2.3 Edit Customer | Field in today's place (after Credit Terms / Credit Limit, before Default Labor Rate), outlined grey box like every other field, label inside on line 1, "Unassigned" on line 2, arrow vertically centred | S4-R1/S4-R4 | CONFIRM |
| V23 | 2.3 | Field narrowed so the + sits in the window's right column: field right border x 1030, + button x 1047–1078 (32 px), **gap 16 px**, + right edge flush with the other fields' right edge (x 1078) | S4-R5 (S2-R1) | CONFIRM |
| V24 | 2.3–2.18 | + and x shown without hover (grey icon, no fill); hover shows the light fill (2.6, 2.13) | S4-R4 | CONFIRM |
| V25 | 2.4, 2.11 list | List = field width, Unassigned first and checked; **order Dylan Rush, Christian Wallace, Jason Garrison (not A–Z by first name)** | S4-R3 | **SPEC-CONFLICT (C2)** |
| V26 | 2.6 | Tooltip "Add representative" below the + | S4-R5 | CONFIRM |
| V27 | 2.7, 2.17 | Menu below the +, right-aligned to it: "Sales Representative - Service Parts", then "Sales Representative - Part Sales" | S4-R6 | CONFIRM |
| V28 | 2.8–2.14 | Field order Service Labor → Service Parts → Part Sales; x beside Service Parts and Part Sales; + beside the first field only while something is left; 16 px between fields | S4-R9/S4-R10 | CONFIRM |
| V29 | 2.13 | Tooltip "Remove Sales Representative - Service Parts" below the x, covering the right end of the Part Sales row and its x | S4-R10 | CONFIRM text; overlap DESIGN-ONLY |
| V30 | 2.15 customer page | Bold labels in window order; "Sales Representative - Service Labor" and "- Service Parts" wrap over two lines in the left panel; values plain | S4-R19 | CONFIRM order/wording; wrapping DESIGN-ONLY |
| V31 | 2.16–2.18 New Customer | Field after State/Province + Country, before Notes (the window has no Credit Terms row); same + and x | S4-R1 | CONFIRM |
| V32 | 2.0 vs 2.3 | Customer page value "N/A" (production) → "Unassigned" (build) | S4-E1/S4-R19 | CONFIRM |

## 3 · Part sale card (page 3)

| # | Screen / state | What the design shows | PRD | Class |
|---|---|---|---|---|
| V33 | 3.1–3.4 | One "Sales Representative" field under "Started:", full card width, no +, no x; hover box + arrow full width; list Unassigned / Becky / Daniel / Gerald | S2-N2 + context note | CONFIRM |
| V34 | 3.1 | Field label starts 5 px left of the card's other text (x 36 vs 41) | — (SV-10266 field, decision 71) | DESIGN-ONLY (out of this feature's scope) |

## 4 · Sales By Representative (page 4)

| # | Screen / state | What the design shows | PRD | Class |
|---|---|---|---|---|
| V35 | 4.4 | Filter chips in order: Date, Show Unassigned, **Sales Type: All**, Invoice Status, Location; chip icon unchanged from Product Type | S8-R1/S8-R3 | CONFIRM |
| V36 | 4.4 default columns | Date, Invoice, Customer, Status, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Subtotal (Subtotal pinned right); **no Sales Type** | S5-R21 | CONFIRM |
| V37 | 4.5 expanded | Rows grouped under each rep; invoice rows date-descending; Customer in blue link style; Status as pill (Unpaid red, Partially Paid orange, Paid green) | — | DESIGN-ONLY (existing) |
| V38 | 4.5/4.10 | Side not credited shows an **em dash "—"** in Labor Delta / Labor Invoiced / Labor Margin (Parts and Part Sales rows) and Parts Invoiced / Parts Margin (Labor row) | S5-R15 | CONFIRM |
| V39 | 4.5/4.10 | **Shop Supplies on Devon's S1-12 "Parts" row reads "$0.0…" (clipped) — not a dash** | S5-R15 | **SPEC-CONFLICT (C1)** |
| V40 | 4.5/4.10 | **Shop Supplies on part sale rows P1-9006, P1-4, P1-9005 reads "$0.0…"** | S5-R15a | **SPEC-CONFLICT (C4, ambiguous)** |
| V41 | 4.5 | Summary rows show real sums ($13.50, $175.50, $0.00 where none), never dashes | S5-R16 | CONFIRM |
| V42 | 4.5 at 1600 px | Shop Supplies clipped ("Shop Suppli", "$13.5") and Adjustments/Margin hidden under the pinned Subtotal | — (note: production does the same) | DESIGN-ONLY |
| V43 | 4.6 filter open | Menu below the chip: "Select all · 3 selected", Labor, Parts, Part Sales (all ticked), "Clear selection"; chip shows a clear ⓧ icon while open | S8-R1 | CONFIRM |
| V44 | 4.7 | "Sales Type: Labor": one row per rep, Parts columns $0.00 on summary rows, totals follow | S5-R12/S8-R2 | CONFIRM |
| V45 | 4.8 picker | Column picker (opens under the columns button, right-aligned): Sales Type first, then Labor Delta … Margin %; toggles blue when on | S5-R20 | CONFIRM |
| V46 | 4.8 | **The "Column Selection" tooltip sits over the first row's switch, so the Sales Type OFF switch is not visible on the board meant to show it** (same overlap in production 4.2 over Labor Delta) | S5-R21 | DESIGN-ONLY (question Q10) |
| V47 | 4.9/4.10 | Sales Type column appears right after Status; values Part Sales / Labor, Parts / Parts / Labor; plain text, no pill | S5-R19/S5-R10 | CONFIRM |
| V48 | 4.11 CSV | Header block: Date Range, Sales Type: All, Invoice Status, Locations; columns Representative, Date, Invoice #, Customer, Status, **Sales Type**, Hrs Worked, Hrs Invoiced, Labor Delta, … Subtotal; non-credited side cells blank; **Parts row Shop Supplies "0.00"** | S5-R23/S8-R4 | CONFIRM except **C1** |
| V49 | 4.12 PDF | Title "Sales By Representative Report", company, location, bold filter labels incl. "Sales Type: All", ShopView logo top right; non-credited side "—"; **Parts row Shop Supplies "$0.00"** | S5-R23/S8-R4 | CONFIRM except **C1** |
| V50 | 4.10 vs 4.11/4.12 | Same invoices dated **Sep 28 2026 on screen, Sep 29 2026 in both exports** (S1-32, S1-12) | — | DESIGN-ONLY (question Q7) |

## 5 · Sales By Customer (page 5)

| # | Screen / state | What the design shows | PRD | Class |
|---|---|---|---|---|
| V51 | 5.1 | Chip "Sales Type: All Sales" in the same place, same icon, as "Product Type: All products" (5.0) | S8-R6/S8-R8 | CONFIRM |
| V52 | 5.2 | Menu: "Select all · 2 selected", Part Sales, Service Sales, Clear selection | S8-R7 | CONFIRM |
| V53 | 5.0 | Production options read **"Parts" / "Services"** although the canvas note says "Part Sales and Service Sales" | S8-R7/S8-E1 | DESIGN-ONLY (note and image disagree; question Q6) |

## 6 · Phone (page 6, 390 px wide)

| # | Screen / state | What the design shows | PRD | Class |
|---|---|---|---|---|
| V54 | 6.2 | "Sales Representative / Unassigned" with the + always shown; **no box and no dropdown arrow at rest** | S3-R2 / **S3-R4** | CONFIRM + / **SPEC-CONFLICT (C3)** |
| V55 | 6.6 | Labor + Parts rows as plain text, x always shown beside Parts, **no arrows** | S3-R2 / **S3-R4** | **SPEC-CONFLICT (C3)** |
| V56 | 6.4, 6.7 | Box + arrow shown after a pick / while a list is open; arrow on the name line with two rows | S1-R11 | CONFIRM |
| V57 | 6.2–6.7 | Label pitch 60 px (16 px gaps) with two rows; + glyph 14 px and x glyph 12 px (20 px Lucide icons) in a right-hand column | S1-R6/S3-R2 | CONFIRM (32 px button size not measurable at rest: no fill shown) |
| V58 | 6.3, 6.7 | List looks like the desktop list (white panel, 61 px rows), not an OS picker | S3-R1 ("same dropdown Lead Technician … open on a phone") | DESIGN-ONLY (note calls it "the native dropdown") |
| V59 | all phone boards | Details panel shown expanded ("Hide Details"); the collapsed card of S3-R6 is not shown | S3-R6 | GAP |
| V60 | 6.5 | + menu below the +, right-aligned | S2-R4 | CONFIRM |

## 7 · "Always / never / must" sentences in the design's own texts

There is no design-system library in this package (no `_ds/`, no tokens file: the boards are screenshots). The rule-like
sentences are in the canvas notes; each is a row:

| # | Sentence (canvas note) | PRD | Class |
|---|---|---|---|
| R1 | "the vertical gap between Lead Technician, Service Advisor and every Sales Representative field is 16px, one field or two" (card-intro) | S1-R6 | CONFIRM (measured 16 px) |
| R2 | "Buttons: the design system's Tertiary button, small icon-only size, 32px square, 8px corners, grey Lucide icon, light fill on hover." (card-intro) | S2-R1/S2-R2 | CONFIRM (32 px measured; 8 px corner radius not measurable reliably from the image) |
| R3 | "To clear a field, pick "Unassigned", first in every list; it is the only way to clear" (card-intro) | S1-R10 | CONFIRM |
| R4 | "In the customer window ... the + and remove x always show (no hover needed)" (customer-intro) | S4-R4 | CONFIRM |
| R5 | "There is no "Same as Service Parts" option." (customer-intro) | S4-R3 (implied) | CONFIRM |
| R6 | "The PDF always has the Sales Type column. An empty side shows a dash." (sbr-note-12) | S5-R23 | CONFIRM wording; the PDF image itself breaks it for Shop Supplies (C1) |
| R7 | "There is no hover on a phone, so the + and remove x always show." (phone-intro) | S3-R2 | CONFIRM |
| R8 | "At rest the rows read as plain text." (phone-note-6) | S3-R4 | **SPEC-CONFLICT (C3)** |
| R9 | "Hovering the rows changes nothing: no box, no arrow, no + and no remove x" (card-note-17, read-only) | S2-R17 | CONFIRM |
| R10 | "Production uses one name per person." (customer-intro test-data note) | — | DESIGN-ONLY |

## Counts

60 visual rows + 10 sentence rows = **70 rows, 0 unclassified**. Rows touching a conflict: **9** (V7, V25, V39, V40, V48,
V49, V54, V55, R8 — five distinct conflicts C1–C5); DESIGN-ONLY: **8** (V34, V37, V42, V46, V50, V53, V58, R10); GAP: **1**
(V59); CONFIRM: **52** (several of them also record a DESIGN-ONLY detail such as a tooltip or menu position).
