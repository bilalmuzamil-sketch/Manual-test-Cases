# Design visual inventory — A/R and A/P Report Sorting (22 Oct 2026)

Rule 126 point 3 and skill 21 §4b: every look the design shows (columns and their order, icons, chips and their colours at rest and active,
header styles, sort marks, chevrons, pinned rows, the Totals row, link style in light and dark, tooltip and menu positions, empty state,
toast, dialog, sizes at 1440 px, overlap) is COVERED by a case or classified. The canvas is image-only (each board is a row of 1440 x 900
screenshots with a caption), so `design_visual_inventory.py` (which renders live boards) does not fit: every attribute below was read off
the pictures by viewing them, with a few colours sampled from the PNG files (pixel values given). Library sentences come from
`files/project/ds/shopviewdesignsystem_fac6ef/` (components.css comments). Picture ids I01–I43: `TRANSCRIPTS.md`, `authoring/design_data.py`.

**Rows: 97 (V1–V96 and one DATA row) · COVERED 81 · SPEC-CONFLICT 6 · OUT-OF-SCOPE 9 · DATA 1 · unclassified 0.**

## 1 · Page frame and chrome

| # | Attribute (where) | Class | Case(s) / reason |
|---|---|---|---|
| V1 | Title row: title, grey circled-i info icon directly right of it, grey "⋯" at the far right, all on one line (all after pictures) | COVERED | D-01, D-50, D-54, D-59, S8-R2 cases |
| V2 | Filter row sits under the title row, left-aligned, four chips in order As of, Customer/Vendor, Past due, Location (I03, I05, I10) | COVERED | S5-01–S5-06, D-50, D-52, D-54 |
| V3 | Table runs across the page with no card or frame, rows divided by thin lines, page background rgb(249,250,251) (all after pictures) | COVERED | D-50 (library: "A list screen … the table runs edge to edge. Nothing is wrapped in a card.") |
| V4 | Top bar gains "Dashboard"; search box shortened to "Searc..." (after pictures) | OUT-OF-SCOPE | app chrome outside the six reports; not in PRD v5 |
| V5 | Left menu: reports under ACCOUNTS RECEIVABLE / ACCOUNTS PAYABLE, the open report blue (all pictures) | COVERED | every START line (on-screen navigation), S1-14 |
| V6 | Page title of A/P Unpaid Invoices reads "A/P Unpaid Invoices Report" (I16, I25, I43) | COVERED | START of every A/P Unpaid Invoices case, D-58 |
| V7 | Location switcher top right "Staging Heavy Duty - 9919" with avatar (all) | COVERED | S5-05, REL-10 (unchanged) |

## 2 · Chips (filter row)

| # | Attribute | Class | Case(s) / reason |
|---|---|---|---|
| V8 | "As of: 10/19/2026": blue pill, calendar icon, down chevron (I03 …) | COVERED | S5-01, D-50, D-70 |
| V9 | "Customer: All customers": person icon, no fill, dark text (resting) (I03) | COVERED | S5-01, D-50, D-31 |
| V10 | "Vendor: All vendors": truck icon, resting (I05, I10) | COVERED | S5-04, D-52, D-54, D-32 |
| V11 | "Past due: Any": hourglass icon, resting (I03, I05) | COVERED | S5-01, D-50, D-33, D-34 |
| V12 | "Location: All locations": pin icon, BLUE pill (active look although everything is ticked) (I03, I32) | COVERED | D-50, D-65 (PRD silent on this chip's style; design is the source, Rule 126.5) |
| V13 | "Location: No locations": pin icon, no fill (resting) (I35) | COVERED | D-68 |
| V14 | One name ticked: prefix kept, blue pill, long name shortened with "..." ("Location: Staging Lethbri...", "Customer: 10 Trucking", "Customer: Andrews' Truck ...") (I34, I37, I42) | COVERED | D-67, D-70, D-75, S5-13, S5-18, S5-24, S5-28 (DR-03) |
| V15 | "Customer: 2 customers", "Past due: 2 ranges": blue pills (I41, I39) | COVERED | D-72, D-74, S5-23, S5-30 |
| V16 | Chip with its menu open: light-grey background (Past due, Vendor) (I38, I40) | COVERED | D-71, D-73 |
| V17 | Location chip with its menu open: circled "×" in place of the chevron (I33) | COVERED | D-66 |
| V18 | Dark theme: As of and Location dark-blue pills with white text; Customer and Past due white text, no fill (I21) | COVERED | D-59, D-08 |

## 3 · Menus, tooltip, toast, dialog, empty state

| # | Attribute | Class | Case(s) / reason |
|---|---|---|---|
| V19 | Export menu: white panel with shadow under the ⋯, right edges aligned, over the header row; ⋯ shows a light-grey square while open; rows "Download (PDF)", "Download (CSV)" (I09) | COVERED | D-53, D-35, D-36, S3-01, S3-02 |
| V20 | Location menu: "Select all" + grey "N selected", locations, divider, "Clear selection"; no search with two locations (I33, I34) | COVERED | D-66, D-67, D-29, D-30, S5-07, S5-08 |
| V21 | Ticked checkboxes: light-blue fill with a blue tick (I33, I38, I40, I41) | COVERED | D-66 (library: "Checked checkbox/radio use a TINTED fill with an accent glyph") |
| V22 | Range rows and vendor rows show a grey DASH box while "Any" / "All vendors" is ticked (I38, I40) | COVERED | D-71, D-73 |
| V23 | Vendor list not A to Z (native list order) (I40) | COVERED | D-73 (compared with Inventory Value's Vendor menu: PRD "exactly as Inventory Value's Vendor filter") |
| V24 | Vendor search placeholder "Search vendor" (I40) | SPEC-CONFLICT | DD-02, question 12 (drafted); held D-77; PRD-following D-32, D-73, S5-29 |
| V25 | Customer menu with two ticked: names as blue tags with "×" in the search box, a circled clear "×", "2 selected" on "All customers", helper line hidden, ticked names keep their A to Z place (I41) | COVERED | D-74 (DR-04) |
| V26 | Description tooltip: dark-grey box (light) / mid-grey box (dark), white text, four lines, opens BELOW the icon starting near it, covers the As of and Customer chips; icon turns blue on hover (I20, I22) | COVERED | D-60, D-41, D-42, S8 description cases |
| V27 | PDF-too-large toast: solid red box bottom right, white warning triangle, three lines of white text, white "Close", no title, only one (I11) | COVERED | D-55, D-38, DATA-18 |
| V28 | Switch location dialog: centred white dialog, page dimmed behind, bold title, message, buttons bottom right (I29) | COVERED | D-64, D-39 |
| V29 | Dialog buttons "Cancel" (grey, left) then "Switch Location" (blue, right, capital L) and a close "×" top right (I29) | SPEC-CONFLICT | DD-01, question 11 (drafted); held D-76; PRD-following S7-03, S7-04, D-39, D-40, D-64 |
| V30 | After Cancel: the report unchanged (I30) | COVERED | D-64, S7-05 |
| V31 | Empty state: grey circle with magnifier, "No record matches these filters" (larger), grey "Try changing filters to widen your results.", outlined "Clear all filters" (I35) | COVERED | D-68, D-19–D-24, S5-14 |
| V32 | Empty state draws a Totals row reading $0.00 $0.00 (I35) | SPEC-CONFLICT | DD-03, question 13 (drafted); held D-78; PRD-following D-68, S5-14, S3-24, S6-03, D-19–D-24 |

## 4 · Table: headings, sort mark, rows, links

| # | Attribute | Class | Case(s) / reason |
|---|---|---|---|
| V33 | Headings bold, dark, one line each at 1440 px (all after pictures) | COVERED | D-01–D-18, D-61, D-62 |
| V34 | A/R Summary columns: Customer, Location, Current, 1-30 Days, 31-60 Days, 61-90 Days, 91 And Over, Total (I03) | COVERED | D-50, D-01, S2-01–S2-03 |
| V35 | A/P Summary columns: Vendor, Location, … Total (I10) | COVERED | D-54, D-10 |
| V36 | A/R Detail columns: Date, Location, Transaction Type, ID, Customer Full Name, Due Date, Amount, Open Balance (no Past Due) (I28, I32) | COVERED | D-63, D-04, S2-07–S2-10 (letter case: V39) |
| V37 | A/R Collection columns: Date, Location, Transaction Type, ID, Due Date, Past Due, Amount, Open Balance (I14, I19) | COVERED | D-56, D-07, S2-11–S2-14 (letter case: V39) |
| V38 | A/P Detail and A/P Unpaid Invoices columns: Date, Location, Transaction Type, No., Vendor Name, Due Date, Past Due, Amount, Open Balance (I05, I23, I25) | COVERED | D-52, D-61, D-62, D-13, D-16, S2-15–S2-22 |
| V39 | A/R headings in capitals ("Transaction Type", "Customer Full Name", "Due Date", "Past Due", "Open Balance") where PRD S2-R1 writes small letters; today's production already in capitals (I12, I26, I31) | SPEC-CONFLICT | DD-06, question 4 (sent 22 Oct 2026); held D-81; PRD-following D-04, D-07 |
| V40 | Location column right after Date (after Customer/Vendor on the Summaries) (I03, I10, I32) | COVERED | S6-01, S6-02, D-65 |
| V41 | Sort mark: a small dark triangle right of the sorted heading only (up on A to Z / oldest first, down on largest first), sampled rgb(35,35,35) (I03, I04, I05, I14, I36) | COVERED | every "marked as the sorted column (a small arrow beside its heading)" result; D-50, D-51, D-69 |
| V42 | Library: "the arrow is quiet until the column is sorted or hovered" and a sorted arrow in accent blue | OUT-OF-SCOPE | the report screens are the native newer-report table (PRD reuse rule), not this library's table; the pictures show the arrow dark and only on the sorted column (V41). The design names no hover state for headings. |
| V43 | Customer/vendor names on the Summaries blue (rgb(34,118,224) sampled), regular weight; document numbers blue (I03, I28, I16) | COVERED | D-50, D-63, D-58 (colour); weight: V44 |
| V44 | Links at REGULAR weight; PRD S7-R7 says semi-bold (all after pictures) | SPEC-CONFLICT | DD-05, question 15 (drafted); held D-80; PRD-following D-01–D-18 |
| V45 | Links in dark theme: medium blue, readable (I24) | COVERED | D-61, D-05, D-14 |
| V46 | Plain text for credit memos (CM2-…), other-location bills (5956), other-location vendor credits (C-99, C-100) (I14, I25, I28) | COVERED | D-56, D-62, D-63, S7-06, S7-10 |
| V47 | Vendor credit from a return at your location is a link (C-1224) (I16, I43) | COVERED | D-58, S7-07, S7-08 |
| V48 | Blank Due Date / Past Due drawn as an em dash "—" (I16, I25, I43) | COVERED | D-58, S2-23 (DR-05) |
| V49 | Money right-aligned, credits "$-100.00" (minus after $), empty bucket blank in rows (I03, I10) | COVERED | D-50, REL-01, REL-02 (unchanged display) |
| V50 | Name and Transaction Type wrap; Vendor Name wraps on A/P Unpaid Invoices ("Akal's Mobile Truck / Repair"); Location wraps only on A/P Detail ("Staging Heavy / Duty - 9919"); money, dates, numbers never wrap (I16, I23, I25) | COVERED | D-61, D-62, D-13, D-16 |
| V51 | At 1440 px every column visible, no sideways scroll (I23, I25) | COVERED | D-62, D-01–D-18 step 4 |
| V52 | Row hover: light-grey row background (I17, I30, I39, I43) | COVERED | D-58 |
| V53 | Headline column bold on every row and the Totals row (Total on Summaries, Open Balance elsewhere) (I03, I14, I23) | COVERED | D-50, D-56, D-61, D-01–D-18 |
| V54 | Pinned headline column while scrolling sideways (caption of I23) — the picture itself shows no sideways scroll | COVERED | D-47, D-48 (narrower windows: DESIGN-SILENT) |

## 5 · Groups, chevrons, pinned rows, Totals

| # | Attribute | Class | Case(s) / reason |
|---|---|---|---|
| V55 | Header chevron in the top-left cell: grey, pointing right when all closed (I05, I19), down when a group is open (I14, I23) | COVERED | D-52, D-56, D-59, D-25–D-28, S4-01–S4-04 |
| V56 | Group chevrons blue: right when closed, down when open (today: blue filled triangles, up/down) (I05, I14 vs I02, I12) | COVERED | D-52, D-56, S4-01–S4-04 |
| V57 | Bucket rows: bold label with count in brackets, "Total" under Past Due, two bold sums (I05, I34) | COVERED | D-52, S1-08, S1-09 |
| V58 | Customer group row: bold name and count, grey "Phone: …" and "Credit term: …" after the name on one line (I14, I19) | COVERED | D-56, D-59, D-43, S9-01 |
| V59 | Subtotal row "Total for <group>" with bold sums under each open group (I14, I25, I28) | COVERED | D-56, D-62, D-63 |
| V60 | Pinned group row under the headings, rows sliding beneath (I15, I16, I23) | COVERED | D-57, D-58, D-61, S4-09–S4-12 |
| V61 | Totals row stays at the bottom of the table while rows scroll under it (I03, I14, I25) | COVERED | D-50, D-56, D-61 |
| V62 | Totals row on a light-grey band (rgb 241,242,243) in I14, I15, I16, I23, I25, I32 but on the page colour in I03, I19, I28, I30 (same screen I30 vs I32) | COVERED | DR-01: PRD S8-R4 "native totals row style of the newer reports"; D-01–D-18 compare with Sales By Customer |
| V63 | Totals row empty buckets read "$0.00" while rows leave them blank (I41) | COVERED | D-74 |
| V64 | Same-day invoices of one customer not in number order (S3-14690, S3-14693, S3-15660, S3-14691, S3-14692) (I15) | SPEC-CONFLICT | DD-04, question 14 (drafted); held D-79; PRD-following S1-10, S1-11 |

## 6 · States, themes, widths

| # | Attribute | Class | Case(s) / reason |
|---|---|---|---|
| V65 | Light theme: every after screen | COVERED | D-50–D-75 |
| V66 | Dark theme: A/R Collection (I21, I22), A/P Detail (I24) | COVERED | D-59, D-60, D-61; other reports' dark look D-02, D-05, D-08, D-11, D-14, D-17 |
| V67 | 1536 px: not pictured | COVERED | DESIGN-SILENT; every picture case adds a 1536 px overlap step; D-03, D-06, D-09, D-12, D-15, D-18 |
| V68 | Loading bar, load error, Success / Empty export toasts, CSV-too-large message: not pictured | COVERED | DESIGN-SILENT (register); PRD-following D-19–D-24, D-37, D-38 |
| V69 | Collapse all / Expand all tooltip: not pictured | COVERED | DESIGN-SILENT; D-25–D-28, S4-01–S4-04 |
| V70 | Phone/tablet layout, narrower than 1440 px: not pictured | COVERED | DESIGN-SILENT; D-47, D-48, D-49 |

## 7 · Production ("before") pictures — today's look, never a target (Rule 115)

| # | Attribute | Class | Case(s) / reason |
|---|---|---|---|
| V71 | "Date: 2026-10-15" chip, printer icon on A/R (I01, I06, I12, I26, I31) | COVERED | S5-01–S5-06 (now "As of"), S3-01 (Print replaced), REL-01 |
| V72 | A/P with no export (I07, I02) | COVERED | S3-02, D-54 |
| V73 | Customer picker before the date on A/R Collection (I12) | COVERED | S5-03 (now after it) |
| V74 | "Location Full Name" / "Location Name" headings (I12, I26, I31, I02) | COVERED | S6-01, S6-02 |
| V75 | Unsorted customers, no sort marks (I01) | COVERED | S1-01, S1-02 |
| V76 | A/P Detail rows most overdue first (I02) | COVERED | S1-09 |
| V77 | Group toggles blue filled triangles (up open, down closed) (I12, I13, I26, I31) | COVERED | S4-01–S4-04 (now chevrons) |
| V78 | No pinned group row when scrolled (I13) | COVERED | S4-09–S4-12 |
| V79 | Every invoice a link, other location dead-ends in "WorkOrder not found." / "Request failed with status code 400" on the Work Orders list (I26, I27) | COVERED | S7-03, S7-11 (SV-5706) |
| V80 | Work Orders list screen itself (I27) | OUT-OF-SCOPE | not one of the six reports |
| V81 | A/P Detail scrolled sideways, nothing pinned, no description, light and dark (I17, I18) | COVERED | D-47, D-48, S8 description cases |
| V82 | Today's A/R Detail table wider than 1440 px (headings cut) (I26, I31) | COVERED | D-04 step 4 (every column visible at 1440 px) |

## 8 · Design-library sentences (always / never / must) — Rule 126 point 4

The canvas copies the ShopView Design System (namespace shopviewdesignsystem_fac6ef) for its own boards (badges, headings). The report
screens in the pictures are the product's native report components (PRD reuse rule), so a library sentence is in scope where the design
names the element (hourglass icon, chevron, link colour, Totals row, chips) or where the pictures show it.

| # | Library sentence (components.css / colors_and_type.css) | Class | Case(s) / reason |
|---|---|---|---|
| V83 | "A list screen in Shopview is white, its filter row sits on white, and the table runs edge to edge. Nothing is wrapped in a card." | COVERED | D-50 step 6 (pictures: page background, no card) |
| V84 | "Checked checkbox/radio use a TINTED fill with an accent glyph — not a solid accent fill with a white glyph." | COVERED | D-66 step 4 |
| V85 | "the arrow is quiet until the column is sorted or hovered" | OUT-OF-SCOPE | V42 |
| V86 | Tooltip: "The placement class and the arrow class are INVERSES" | OUT-OF-SCOPE | the report tooltip in the pictures has no arrow and opens below (D-60); a developer rule |
| V87 | Menu: "260px panel at elevation 2, 40px rows, gap 2"; "checkable menus reserve the 16px gutter even when unchecked" | OUT-OF-SCOPE | sizes not judged by eye; the menus are compared with the pictures and with Sales By Customer (D-29–D-34, D-66, D-71, D-73) |
| V88 | Toast: "floating toast (400px card at elevation 2)" | COVERED | D-55 (compared with the picture) |
| V89 | Modal: "Radius differs by header type: 12 for the title header" | OUT-OF-SCOPE | the dialog is "the existing location-switch prompt" (PRD); compared with the picture (D-64) and today's prompt (D-39) |
| V90 | "Never hardcode a header height; change the token instead." | OUT-OF-SCOPE | developer rule; the app header is not changed by this PRD |
| V91 | Dark theme: "Dark greys, never pure black; off-whites, never pure white." | COVERED | D-59, D-61 (compared with the dark pictures) |
| V92 | "danger rows recolour the text only — no red hover background" | OUT-OF-SCOPE | no danger menu row on these reports |
| V93 | Tabs: "Count badges are parenthesised text, NOT chips." | COVERED | group counts in brackets, D-52, D-56 |
| V94 | Links: "a { color: var(--sv-fg-link); text-decoration: none; }" (no underline) | COVERED | D-01–D-18 step 8 (no underline), DD-05 for weight |
| V95 | Hourglass icon "the design system's hourglass icon" (caption of figure 8; not in the library files: no icon set is copied) | COVERED | S5-01, D-50, D-71 (named as the design names it) |
| V96 | Chevron icon "the design system's chevron icon" (PRD reuse rule; library `.sv-field__chevron`) | COVERED | D-25–D-28, D-52, D-56 |
| — | Example names, amounts, dates in every picture | DATA | names, money, dates and counts: 478 text rows in DESIGN-TEXT-INVENTORY |

Unsent-question count (Rule 126 point 6): questions 11 to 15 are drafted, not sent (5). They become sent when the QA lead adds them to Chris
Ward's sheet; until then the suite is not called complete.
