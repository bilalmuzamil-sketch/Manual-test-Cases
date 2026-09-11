# Old invoice vs new invoice — what actually changed (2026-09-11)

**Status: analysis only. Nothing filed, nothing posted, no ticket raised.**

The QA lead supplied two PDFs and asked what the difference is, and what it would take to make the
new document look exactly like the old one — spacing and design included.

| | file | document | producer | pages |
|---|---|---|---|---|
| **OLD** — the one customers want back | `OLD-EST-S1113-1190.pdf` | Estimate **EST-S1113-1190**, Expo Truck Repair Long Business Name Long (Dubai) | WeasyPrint **66.0** | 7 |
| **NEW** — what they get now | `NEW-EST-S1-17520.pdf` | Estimate **EST-S1-17520**, Staging Heavy Duty - 9919 (Calgary) | WeasyPrint **69.0** | 5 |

Both are the **same Legacy design** and the same paper: A4 595.28 × 841.89pt. Every measurement below
comes out of the PDFs themselves (pymupdf `get_drawings` for the rules and borders, text spans for
positions, sizes, fonts and colours) — none of it is eyeballed.

---

## The one-line answer

The typeface, the type sizes, the colours and the whole vertical rhythm of the line table are
**unchanged**. What changed is that **the content block was pushed 30pt in from each side and a new
left column was added inside the table**, which between them take **34% of the description column's
width away**, and **most of the bold was removed from the money**. That is why it reads as a
different document even though nothing was redesigned.

---

## A. The page frame

| | OLD | NEW | change |
|---|---|---|---|
| Page size | 595.28 × 841.89pt (A4) | same | — |
| Page margin (the footer band runs edge to edge) | 22.5 → 572.8 | 22.5 → 572.8 | **none** |
| White page card | x 28.5 → 566.8 (538.3pt) | x 28.5 → 566.8 (538.3pt) | **none** |
| **Content inside the card** | **28.5 → 566.8 = 538.3pt** | **58.5 → 536.8 = 478.3pt** | **−60.0pt (−11.1%)** |
| Card top / first baseline | 6.0 / 30.0 | 6.0 / 30.0 | none |
| Card bottom | 819.4 | 799.4 | **−20.0pt of usable height** |
| Footer baseline | 824.1 | 814.1 | **10pt higher** |

The page margin and the white card are **identical**. It is the block of content *inside* them that
moved: 30pt of padding was added on the left and 30pt on the right. Exhibit
`ev/EX1-page1-side-by-side.png` shows the two strips of paper the new document no longer prints on.

## B. The line-item table

| | OLD | NEW | change |
|---|---|---|---|
| Table rule | x 30.0 → 566.8 (536.8pt) | x 60.0 → 535.3 (475.3pt) | −61.5pt |
| Description **column** (table edge → Quantity column) | 350.8pt | 262.6pt | −88.2pt |
| Description **text** starts at | x 30.8 — flush with the table edge | x 90.4 | **+29.6pt indent** |
| New left gutter holding the row type (**"Labor"**, and presumably "Parts") | **does not exist** | x 60.8 | **new column** |
| **Description text width actually available** | **350.0pt** | **232.2pt** | **−117.8pt = −34%** |
| Quantity / Rate / Amount column width | 61.5pt each | 70.4pt each | +8.9pt each |
| Quantity header x | 390.8 | 339.4 | −51.4 |
| Rate header x | 482.6 | 442.2 | −40.4 |
| Amount header x | 530.3 | 498.8 | −31.5 |
| Totals cell borders | x 442.3..503.8 and 505.3..566.8, w 61.5, h 16.09 | x 393.0..463.4 and 464.9..535.3, w 70.4, h 16.09 | wider, moved left |
| Row rhythm — description rows 13.1pt, description→Line Total 17.6pt, line→line 28.0pt, header→first row 29.4pt, grey rule→black rule 29.9pt | | identical | **none** |
| Table header repeated on continuation pages at y 23.2 | yes | yes | none |

The description column is squeezed **twice over**: once by the 60pt of body padding, and again by the
29.6pt gutter plus the 26.7pt the three numeric columns gained.

## C. Weight — the reason it looks flat

| element | OLD | NEW |
|---|---|---|
| Sub-item name row (e.g. the labour item) | **bold** | regular |
| "Parts Total" / "Labor Total" labels | **bold** | regular |
| "Line Total" label | **bold** | **bold** (unchanged) |
| Parts Total / Labor Total / Line Total **amounts** | **bold** (31/31/32 rows) | regular (24/24/25 rows) |
| **Subtotal amount** | **bold** | regular |
| **Total (grand total) amount** | **bold** | regular |
| Share of all text that is bold | **399 of 823 spans = 48%** | **92 of 447 spans = 21%** |

Font family, sizes and colours are **identical** on both: Nunito-Sans and Nunito-Sans-Bold at
6.48 / 9.6 / 10.5 / 10.8 / 14.4pt, in #000000 with #424242 for the disclaimer, and the grey rule is
#a8a8a8 on both. Nothing was restyled — the bold was simply dropped.

Exhibits `ev/EX2-line-item-anatomy.png` and `ev/EX3-totals-block.png`.

## D. Vertical spacing outside the table

| gap | OLD | NEW | change |
|---|---|---|---|
| Shop address block → "Bill To" | 20.7pt | 27.3pt | **+6.6** |
| Bill To block → asset table header | 23.7pt | 32.8pt | **+9.1** |
| Disclaimer end → "Customer signature:" | 14.9pt | 26.9pt | **+12.0** |
| "Customer signature:" → "Printed name:" | 16.1pt | 22.1pt | **+6.0** |
| Masthead line height (14.4pt type) 19.6 · address 14.7 · heading→first row 19.6 · asset header→value 20.3 · service-order values→table 33.8 · Balance→disclaimer 33.9 · disclaimer leading 8.8 | | identical | **none** |

## E. Wording

| | OLD | NEW |
|---|---|---|
| Asset table header | **Vin** | **VIN/Serial #** |
| Asset table header | **Vehicle** | **Asset** |
| Date label | **Issue date:** | **Invoice Date:** — note it says *Invoice* Date on an **Estimate** |
| Footer, centre | Software Powered by ShopView | Powered by ShopView |
| Footer, right | Page 1 of 7 | EST-S1-17520 - Page 1 / 5 |

These read like deliberate product changes rather than accidents, which is a different conversation
from the geometry — see "what I could not determine" below.

## F. What the customer actually sees because of it

- **"Service Order"** no longer fits its column and breaks onto two lines.
- The **asset value** ("2011 Western Star 4900") breaks onto two lines.
- The **disclaimer** now takes **7** lines where it took **6**.
- **24 of the 40** description paragraphs wrap. At the old column width the same text needs
  **at least 25 fewer lines** (62 → at most 37) — measured by re-flowing each wrapped paragraph's own
  inked width at 350pt, so it is a floor, not an estimate.
- Combined with the 20pt of usable height lost per page, the same job list prints on more paper.

---

## What it would take to make the new one match the old

In impact order. The first three are what a customer would notice first.

1. **Remove the 30pt of horizontal padding on the document body.** Content goes back from 478.3pt to
   538.3pt, flush with the white card as it was.
2. **Remove the 29.6pt description indent and the left row-type gutter** — the old design carried no
   "Labor"/"Parts" column; the type was implicit in the Parts Total / Labor Total rows beneath.
3. **Put the three numeric columns back to 61.5pt** (from 70.4pt), which returns another 26.7pt to
   the description. With 1–3 done, the description text area is back at 350pt.
4. **Restore the bold**: sub-item name row; "Parts Total" and "Labor Total" labels; the Parts Total,
   Labor Total and Line Total amounts; the **Subtotal** amount; the **Total** amount.
5. **Restore the page card bottom to 819.4 and the footer baseline to 824.1** — 20pt more content per
   page.
6. **Take back the four gaps**: −6.6pt above "Bill To", −9.1pt above the asset table, −12.0pt above
   the signature block, −6.0pt between the two signature lines.
7. **The wording** — Vin, Vehicle, Issue date, "Software Powered by ShopView", "Page n of m" — only if
   the product owner actually wants them reverted. These look intentional.

---

## What I could not determine, and why

Stated plainly so nothing here is over-claimed.

- **The new document contains no parts at all** (Parts $0.00 throughout), so I could **not** compare
  how a part row renders. Any difference in part-row layout is untested.
- **The old document never produced a $0.00 total row**, so I cannot tell whether the old design
  suppressed zero Parts/Labor Total rows or simply never had one. The new document prints
  "Parts Total $0.00" on every labour-only line; whether that is a change is **unknown**.
- The two files come from **different organisations with different data and different builds**
  (WeasyPrint 66.0 vs 69.0). The **logo vs the ShopView wordmark**, **"Sales Tax (20%)" vs
  "GST (5%)"**, and the **footer tax-id text** are per-organisation data, not design.
- **I have not read the live HTML or print CSS.** The staging session had expired (HTTP 401), so I can
  give the exact point values that need to change but **not** the exact selectors. With fresh staging
  cookies I can pull the estimate's print stylesheet and name each rule.
- Whether each item above is a **regression** or a **deliberate change** cannot be settled from the
  PDFs; that needs the ticket or spec that introduced the new layout.

## Exhibits

| file | shows |
|---|---|
| `ev/EX1-page1-side-by-side.png` | both page 1s at the same scale, the 538pt vs 478pt content bands, and the two unused strips |
| `ev/EX2-line-item-anatomy.png` | one job line close up: the new gutter, the 29.6pt indent, the lost bold |
| `ev/EX3-totals-block.png` | the totals block: Subtotal and Total bold on the old, not on the new |

Rebuild them with `python3 make_exhibits.py` (boxes are drawn from PDF coordinates, not by eye).
