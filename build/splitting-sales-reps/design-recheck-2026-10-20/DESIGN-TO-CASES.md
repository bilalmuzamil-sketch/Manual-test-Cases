# Design to cases — Splitting Sales Representatives (20 Oct 2026)

Every row of the 19 Oct text inventory (1,370 rows) and of the visual inventory (70 rows), re-classified against PRD v10 and Chris
Ward's answers, with the case that checks it. 'Picture' coverage = the case attaches that board's picture and tells the tester to
compare the screen with it (attachment log `applied/apply*-log.jsonl`); 'wording' = the case's own text contains the words.

## Counts

| Text rows by class (v10) | n |
|---|---|
| DATA | 783 |
| DESIGN-ONLY | 388 |
| DIFFERENT | 5 |
| SAME | 194 |

| Text rows by status | n |
|---|---|
| COVERED | 353 |
| DATA | 783 |
| DESIGN NAVIGATION | 6 |
| EXISTING SCREEN TEXT, unchanged by this feature | 220 |
| MISSING | 5 |
| PO-RULED | 3 |

| Visual rows by status | n |
|---|---|
| COVERED | 64 |
| MISSING | 6 |

Rows left to check by hand: 0.

## Visual inventory rows (70)

| # | Row | Class (v10) | Case(s) | Status |
|---|---|---|---|---|
| V1 | Field order LT, SA, SR (1.2) | SAME | C666017, C665915 | COVERED |
| V2 | Label line 1 / name line 2, same left edge | SAME | C666017 | COVERED |
| V3 | No box/arrow/buttons at rest | SAME | C666017, C666021 | COVERED |
| V4 | Hover box on SR only, light-blue halo, 44 px | SAME | C666018 | COVERED |
| V5 | Caret centred (one field) | SAME | C666018 | COVERED |
| V6 | Grey + beside the field | SAME | C666018 | COVERED |
| V7 | Box to + gap 22 px vs 16px | DIFFERENT (PO-RULED answer 2) | C666018 | COVERED |
| V8 | + 32x32 with light fill on hover | SAME | C666018, C666020 | COVERED |
| V9 | Tooltip 'Add representative' centred below the + | SAME | C666020 | COVERED |
| V10 | List under the field, same width, caret flips, tick + blue row, no search | SAME | C666019 | COVERED |
| V11 | Options A-Z by first name | SAME | C666019, C665916 | COVERED |
| V12 | + keeps fill, no tooltip while the menu is open | SAME | C666020 | COVERED |
| V13 | Menu 1 row, 4 px below the +, right-aligned | SAME | C666020 | COVERED |
| V14 | Two rows Labor then Parts, both Becky, labels in full | SAME | C666021 | COVERED |
| V15 | Both boxes; caret on the name line; x beside Parts only | SAME | C666021 | COVERED |
| V16 | Label pitch 60 px, 16 px between boxes | SAME | C666021 | COVERED |
| V17 | LT blank pitch 52 vs 72 px today | SAME (v10 dropped the 36px note, answer 3) | C666017 | COVERED |
| V18 | x 32x32; tooltip 'Remove Sales Representative - Parts' below it | SAME | C666022 | COVERED |
| V19 | Labor list open, x still shown | SAME | C666021 | COVERED |
| V20 | Read-only: 'Lead technician', 'Service advisor' + title-case SR labels | SAME (v10 S2-R17, answer 8) | C666024 (LT/SA labels not stated), MISSING -> GAP-1 | MISSING -> GAP-1 |
| V21 | Work Order Log columns; bold 'Sales Representative:'; Parts first | SAME | C666025, C665981 | COVERED |
| V22 | Edit Customer field in today's place, outlined | SAME | C666026, C665940 | COVERED |
| V23 | Field narrowed; + 16 px from it, flush right | SAME | C666026 | COVERED |
| V24 | + and x shown without hover; fill on hover | SAME | C666026, C666027 | COVERED |
| V25 | Customer list order not A-Z | DIFFERENT (PO-RULED answer 15) | C666026, C665940 | COVERED |
| V26 | Customer + tooltip below | SAME | C666026 | COVERED |
| V27 | Customer + menu 2 rows, right-aligned | SAME | C666026, C666029 | COVERED |
| V28 | Field order; x beside added fields; + only while something is left | SAME | C666027 | COVERED |
| V29 | 'Remove Sales Representative - Service Parts' tooltip covers the Part Sales x | SAME (overlap design-only) | C666027 | COVERED |
| V30 | Customer page labels wrap to 2 lines | SAME (wrapping design-only) | C666028 | COVERED |
| V31 | New Customer field after State/Province + Country | SAME | C666029 | COVERED |
| V32 | 'N/A' today -> 'Unassigned' | SAME | C665947, C666003 | COVERED |
| V33 | Part sale: one field, full width, no + / x; label 'Sales Representative' | DIFFERENT (label casing; PO-RULED answer 7, v10 S2-N2) | C666030 (expects capital R), MISSING -> GAP-2 | MISSING -> GAP-2 |
| V34 | Part sale label 5 px left of the card text | DESIGN-ONLY (Part Sales Update v1 look) | C666030 | COVERED |
| V35 | Chips Date, Show Unassigned, Sales Type: All, Invoice Status, Location | SAME | C666031 | COVERED |
| V36 | Default columns, no Sales Type | SAME | C666031, C665972 | COVERED |
| V37 | Rows grouped, link-style customers, status pills | DESIGN-ONLY (existing) | C666031 | COVERED |
| V38 | Dashes for the side not credited (Labor/Parts rows) - and in part-sale labor columns | SAME for Labor/Parts rows; part-sale labor dashes: QUESTION-NEEDED | C666031, C665962, MISSING -> GAP-3 (held) | MISSING -> GAP-3 (held) |
| V39 | Shop Supplies $0.00 on the Parts row | DIFFERENT (PO-RULED answer 24) | C666031, C665962 | COVERED |
| V40 | Shop Supplies $0.00 on part sale rows | DIFFERENT (PO-RULED answer 25) | C666031, C665968 | COVERED |
| V41 | Summary rows real sums | SAME | C666031, C665962 | COVERED |
| V42 | Columns clip under the pinned Subtotal at 1600 px | DESIGN-ONLY (production same) | C666031 (step 6 'nothing overlaps') | COVERED |
| V43 | Sales Type menu: Select all / 3 selected / 3 options / Clear selection | SAME + DESIGN-ONLY rows | C666031 (step 3 compares with board 4.6), C665984 | COVERED |
| V44 | 'Sales Type: Labor': summary rows $0.00 parts | SAME | C666031, C665969 | COVERED |
| V45 | Picker under the columns button, Sales Type first | SAME | C666031, C665972 | COVERED |
| V46 | 'Column Selection' tooltip covers the Sales Type switch | DIFFERENT (PO-RULED acceptable, answer 36) | C666031 | COVERED |
| V47 | Sales Type column right after Status | SAME (before Location: DESIGN-SILENT) | C666031, C665972, MISSING -> GAP-6 | MISSING -> GAP-6 |
| V48 | CSV header block and columns; Parts row Shop Supplies 0.00 | SAME; 0.00 PO-RULED answer 24 | C666032, C665973, C665985 | COVERED |
| V49 | PDF title, filter labels, logo, dashes; $0.00 Shop Supplies | SAME; $0.00 PO-RULED answer 24 | C666032, C665973 | COVERED |
| V50 | Dates Sep 28 on screen, Sep 29 in exports | DIFFERENT (PO-RULED answer 33: must match) | MISSING -> GAP-4 | MISSING -> GAP-4 |
| V51 | SBC chip 'Sales Type: All Sales' in Product Type's place | SAME | C666033, C665986 | COVERED |
| V52 | SBC menu Select all / 2 selected / Part Sales / Service Sales / Clear selection | SAME | C666033, C665998 | COVERED |
| V53 | SBC today options 'Parts' / 'Services' | DIFFERENT note vs picture (PO-RULED answer 28) | C666008, C666033 | COVERED |
| V54 | Phone 6.2: + always, no arrow at rest | DIFFERENT (PO-RULED answer 11) | C666034, C665938 | COVERED |
| V55 | Phone 6.6: no arrows at rest | DIFFERENT (PO-RULED answer 11) | C666034 | COVERED |
| V56 | Phone: box + caret after a pick / with a list open | SAME | C666034 | COVERED |
| V57 | Phone pitch 60 px; + and x icons in a right column | SAME | C666034 | COVERED |
| V58 | Phone list looks like the desktop list | SAME (= today's phone list 6.1) | C666034, C665938 | COVERED |
| V59 | Phone: details panel 'Hide Details'; collapsed card not drawn | DIFFERENT (S3-R6 'edit button'): QUESTION-NEEDED | C665937, C666014, MISSING -> GAP-5 (held) | MISSING -> GAP-5 (held) |
| V60 | Phone + menu below the +, right-aligned | SAME | C666034 | COVERED |
| R1 | 16px between every field | SAME | C666017, C666021, C666024 | COVERED |
| R2 | Tertiary 32px, 8px corners, grey Lucide, light fill | SAME | C666018 | COVERED |
| R3 | Clear only by picking Unassigned | SAME | C665918, C666023 | COVERED |
| R4 | Customer window + / x always show | SAME | C665940, C666026 | COVERED |
| R5 | No 'Same as Service Parts' option | SAME | C666027 | COVERED |
| R6 | PDF: an empty side shows a dash | SAME (picture breaks it for Shop Supplies; PO-RULED 24) | C666032, C665973 | COVERED |
| R7 | Phone: + and x always show | SAME | C665938, C666034 | COVERED |
| R8 | Phone: 'At rest the rows read as plain text.' | DIFFERENT (PO-RULED answer 11) | C666034 | COVERED |
| R9 | Read-only: hovering changes nothing | SAME | C666024, C665932 | COVERED |
| R10 | 'Production uses one name per person.' | DESIGN-ONLY (test-data note) | C666026 (names the login-name note) | COVERED |

## Text inventory rows that are not sample data

| Row | Src | Text | Class (v10) | Boards | Wording cases | Picture cases | Status |
|---|---|---|---|---|---|---|---|
| 1 | A-page | 1. Work order card: one rep, add, remove | DESIGN-ONLY |  |  |  | DESIGN NAVIGATION (page name; every page's boards are attached to cases) |
| 2 | A-page | 2. A customer's reps: Edit Customer and New Customer | DESIGN-ONLY |  |  |  | DESIGN NAVIGATION (page name; every page's boards are attached to cases) |
| 3 | A-page | 3. A part sale's rep | DESIGN-ONLY |  |  |  | DESIGN NAVIGATION (page name; every page's boards are attached to cases) |
| 4 | A-page | 4. Sales By Representative report | DESIGN-ONLY |  |  |  | DESIGN NAVIGATION (page name; every page's boards are attached to cases) |
| 5 | A-page | 5. Sales By Customer: the filter name | DESIGN-ONLY |  |  |  | DESIGN NAVIGATION (page name; every page's boards are attached to cases) |
| 6 | A-page | 6. On a phone | DESIGN-ONLY |  |  |  | DESIGN NAVIGATION (page name; every page's boards are attached to cases) |
| 7 | A-title | 1.0 Before: the card today | DESIGN-ONLY | 1.0 | C666004 | C666004 | COVERED (wording) |
| 8 | A-title | 1.1 Before: picking the rep today | DESIGN-ONLY | 1.1 | C666004 | C666004 | COVERED (wording) |
| 9 | A-title | 1.2 Nobody assigned, at rest | DESIGN-ONLY | 1.2 | C666017 | C666017 | COVERED (wording) |
| 10 | A-title | 1.3 Hover: the box and the + | DESIGN-ONLY | 1.3 | C666018 | C666018 | COVERED (wording) |
| 11 | A-title | 1.4 The list: Unassigned first | DESIGN-ONLY | 1.4 | C666019 | C666019 | COVERED (wording) |
| 12 | A-title | 1.5 One rep picked, at rest | DESIGN-ONLY | 1.5 | C666017 | C666017 | COVERED (wording) |
| 13 | A-title | 1.6 Hover: box, arrow and + | DESIGN-ONLY | 1.6 | C666018 | C666018 | COVERED (wording) |
| 14 | A-title | 1.7 Hover the + | DESIGN-ONLY | 1.7 | C666020 | C666020 | COVERED (wording) |
| 15 | A-title | 1.8 The + menu | DESIGN-ONLY | 1.8 | C666020 | C666020 | COVERED (wording) |
| 16 | A-title | 1.9 Parts added: both rows copy Becky | DESIGN-ONLY | 1.9 | C666021 | C666021 | COVERED (wording) |
| 17 | A-title | 1.10 Hover: two rows | DESIGN-ONLY | 1.10 | C666021 | C666021 | COVERED (wording) |
| 18 | A-title | 1.11 Labor: pick who sold the labor | DESIGN-ONLY | 1.11 | C666021 | C666021 | COVERED (wording) |
| 19 | A-title | 1.12 Two reps | DESIGN-ONLY | 1.12 | C666022 | C666022 | COVERED (wording) |
| 20 | A-title | 1.13 Hover the remove x | DESIGN-ONLY | 1.13 | C666022 | C666022 | COVERED (wording) |
| 21 | A-title | 1.14 Parts removed: the Labor person stays | DESIGN-ONLY | 1.14 | C666022 | C666022 | COVERED (wording) |
| 22 | A-title | 1.15 Clearing: pick Unassigned | DESIGN-ONLY | 1.15 | C666019, C666023 | C666019, C666023 | COVERED (wording) |
| 23 | A-title | 1.16 Cleared: Unassigned | DESIGN-ONLY | 1.16 | C666023 | C666023 | COVERED (wording) |
| 24 | A-title | 1.17 After invoicing: read only | DESIGN-ONLY | 1.17 | C666024 | C666024 | COVERED (wording) |
| 25 | A-title | 1.18 Before: the Work Order Log today | DESIGN-ONLY | 1.18 | C666025 | C666025 | COVERED (wording) |
| 26 | A-title | 1.19 The log records every rep change | DESIGN-ONLY | 1.19 | C666025 | C666025 | COVERED (wording) |
| 27 | A-title | 2.0 Before: the customer page today | DESIGN-ONLY | 2.0 | C666003 | C666003 | COVERED (wording) |
| 28 | A-title | 2.1 Before: Edit Customer today | DESIGN-ONLY | 2.1 | C666003 | C666003 | COVERED (wording) |
| 29 | A-title | 2.2 Before: New Customer today | DESIGN-ONLY | 2.2 | C666003 | C666003 | COVERED (wording) |
| 30 | A-title | 2.3 Edit Customer: one field and the + | DESIGN-ONLY | 2.3 | C666026 | C666026 | COVERED (wording) |
| 31 | A-title | 2.4 The list: Unassigned first | DESIGN-ONLY | 2.4 | C666026 | C666026 | COVERED (wording) |
| 32 | A-title | 2.5 One rep picked | DESIGN-ONLY | 2.5 | C666026 | C666026 | COVERED (wording) |
| 33 | A-title | 2.6 Hover the + | DESIGN-ONLY | 2.6 | C666026 | C666026 | COVERED (wording) |
| 34 | A-title | 2.7 The + menu: two options | DESIGN-ONLY | 2.7 | C666026 | C666026 | COVERED (wording) |
| 35 | A-title | 2.8 Service Parts added | DESIGN-ONLY | 2.8 | C666027 | C666027 | COVERED (wording) |
| 36 | A-title | 2.9 The + menu now offers Part Sales only | DESIGN-ONLY | 2.9 | C666027 | C666027 | COVERED (wording) |
| 37 | A-title | 2.10 Part Sales added: three rows | DESIGN-ONLY | 2.10 | C666027 | C666027 | COVERED (wording) |
| 38 | A-title | 2.11 The Part Sales list | DESIGN-ONLY | 2.11 | C666027 | C666027 | COVERED (wording) |
| 39 | A-title | 2.12 Three different people | DESIGN-ONLY | 2.12 | C666027 | C666027 | COVERED (wording) |
| 40 | A-title | 2.13 Hover the remove x | DESIGN-ONLY | 2.13 | C666027 | C666027 | COVERED (wording) |
| 41 | A-title | 2.14 Part Sales without Service Parts | DESIGN-ONLY | 2.14 | C666027 | C666027 | COVERED (wording) |
| 42 | A-title | 2.15 The customer page reads every row | DESIGN-ONLY | 2.15 | C666028 | C666028 | COVERED (wording) |
| 43 | A-title | 2.16 New Customer: the same field | DESIGN-ONLY | 2.16 | C666029 | C666029 | COVERED (wording) |
| 44 | A-title | 2.17 New Customer: the + menu | DESIGN-ONLY | 2.17 | C666029 | C666029 | COVERED (wording) |
| 45 | A-title | 2.18 New Customer with a Part Sales rep | DESIGN-ONLY | 2.18 | C666029 | C666029 | COVERED (wording) |
| 46 | A-title | 3.0 Before: a part sale today | DESIGN-ONLY | 3.0 | C666030 | C666030 | COVERED (wording) |
| 47 | A-title | 3.1 The Sales Representative field | DESIGN-ONLY | 3.1 | C666030 | C666030 | COVERED (wording) |
| 48 | A-title | 3.2 Hover | DESIGN-ONLY | 3.2 |  | C666030 | COVERED (board title/note of an attached board; quoted under References from Design) |
| 49 | A-title | 3.3 The list | DESIGN-ONLY | 3.3 | C666030 | C666030 | COVERED (wording) |
| 50 | A-title | 3.4 A rep picked, hovered | DESIGN-ONLY | 3.4 | C666030 | C666030 | COVERED (wording) |
| 51 | A-title | 4.0 Before: the report today | DESIGN-ONLY | 4.0 | C666005 | C666005 | COVERED (wording) |
| 52 | A-title | 4.1 Before: the Product Type filter | DESIGN-ONLY | 4.1 | C666005 | C666005 | COVERED (wording) |
| 53 | A-title | 4.2 Before: the column picker | DESIGN-ONLY | 4.2 | C666005 | C666005 | COVERED (wording) |
| 54 | A-title | 4.3 Before: expanded | DESIGN-ONLY | 4.3 | C666005 | C666005 | COVERED (wording) |
| 55 | A-title | 4.4 One row per rep | DESIGN-ONLY | 4.4 | C666031 | C666031 | COVERED (wording) |
| 56 | A-title | 4.5 Expanded: Sales Type column off | DESIGN-ONLY | 4.5 | C666031 | C666031 | COVERED (wording) |
| 57 | A-title | 4.6 The Sales Type filter | DESIGN-ONLY | 4.6 | C666031 | C666031 | COVERED (wording) |
| 58 | A-title | 4.7 Labor only | DESIGN-ONLY | 4.7 | C666031 | C666031 | COVERED (wording) |
| 59 | A-title | 4.8 The column picker | DESIGN-ONLY | 4.8 | C666031 | C666031 | COVERED (wording) |
| 60 | A-title | 4.9 Sales Type switched on | DESIGN-ONLY | 4.9 | C666031 | C666031 | COVERED (wording) |
| 61 | A-title | 4.10 Expanded with Sales Type | DESIGN-ONLY | 4.10 | C666031 | C666031 | COVERED (wording) |
| 62 | A-title | 4.11 Expanded export (CSV) | DESIGN-ONLY | 4.11 | C666032 | C666032 | COVERED (wording) |
| 63 | A-title | 4.12 Expanded export (PDF) | DESIGN-ONLY | 4.12 | C666032 | C666032 | COVERED (wording) |
| 64 | A-title | 5.0 Before: "Product Type" | DESIGN-ONLY | 5.0 | C666008 | C666008 | COVERED (wording) |
| 65 | A-title | 5.1 After: "Sales Type" | DESIGN-ONLY | 5.1 | C666033 | C666033 | COVERED (wording) |
| 66 | A-title | 5.2 After: the filter open | DESIGN-ONLY | 5.2 | C666033 | C666033 | COVERED (wording) |
| 67 | A-title | 6.0 Before: the details panel today | DESIGN-ONLY | 6.0 | C666014 | C666014 | COVERED (wording) |
| 68 | A-title | 6.1 Before: picking the rep today | DESIGN-ONLY | 6.1 | C666014 | C666014 | COVERED (wording) |
| 69 | A-title | 6.2 The field on a phone | DESIGN-ONLY | 6.2 | C666034 | C666034 | COVERED (wording) |
| 70 | A-title | 6.3 Tap: the list | DESIGN-ONLY | 6.3 | C666034 | C666034 | COVERED (wording) |
| 71 | A-title | 6.4 One rep picked | DESIGN-ONLY | 6.4 | C666034 | C666034 | COVERED (wording) |
| 72 | A-title | 6.5 Tap the + | DESIGN-ONLY | 6.5 | C666034 | C666034 | COVERED (wording) |
| 73 | A-title | 6.6 Parts added | DESIGN-ONLY | 6.6 | C666034 | C666034 | COVERED (wording) |
| 74 | A-title | 6.7 Parts list on a phone | DESIGN-ONLY | 6.7 | C666034 | C666034 | COVERED (wording) |
| 75 | A-note | Production today. One Sales Representative field under Service Advisor. /  / Measured gaps: Lead Technician to Service Advisor 36px; Service | SAME | 1.0 |  | C666004 | COVERED (Before board attached as today's look) |
| 76 | A-note | Production today. A plain list: Unassigned, then every active sales representative. | DESIGN-ONLY | 1.1 | C666004 | C666004 | COVERED (wording) |
| 77 | A-note | Plain text, like Lead Technician and Service Advisor: "Sales Representative", reading "Unassigned". No box and no buttons at rest. /  / Meas | SAME | 1.2 |  | C666017 | COVERED (board title/note of an attached board; quoted under References from Design) |
| 78 | A-note | Hovering the rep row shows the field box with its dropdown arrow, and the grey + beside it. | SAME | 1.3 | C666018 | C666018 | COVERED (wording) |
| 79 | A-note | "Unassigned" is the first option, checked when nobody is picked, then every active sales representative. | SAME | 1.4 | C666019 | C666019 | COVERED (wording) |
| 80 | A-note | Becky Gonzales is the Sales Representative, shown as plain text. She gets credit for the whole job: labor, parts and shop supplies. | SAME | 1.5 | C666017 | C666017 | COVERED (wording) |
| 81 | A-note | With a person in the field, hovering shows the same box and arrow, and the + beside the row. To clear it, pick "Unassigned" from the list (d | SAME | 1.6 | C666018 | C666018 | COVERED (wording) |
| 82 | A-note | Tooltip: "Add representative". | SAME | 1.7 | C666020, C666026 | C666020 | COVERED (wording) |
| 83 | A-note | The menu lists the one row a work order can add: "Sales Representative - Parts". | SAME | 1.8 | C666020 | C666020 | COVERED (wording) |
| 84 | A-note | Two rows, "Sales Representative - Labor" and "Sales Representative - Parts", both reading Becky Gonzales: the added row starts with the pers | SAME | 1.9 |  | C666021 | COVERED (board title/note of an attached board; quoted under References from Design) |
| 85 | A-note | Both boxes show at once, each with its arrow. With Labor and Parts showing, the arrow sits on the name line in the bottom corner (decision 7 | SAME | 1.10 | C666021 | C666021 | COVERED (wording) |
| 86 | A-note | With Labor and Parts showing, the arrow sits on the name line in the bottom corner (decision 70). Each row has the same list: Unassigned fir | SAME | 1.11 | C666021 | C666021 | COVERED (wording) |
| 87 | A-note | Daniel Montoya sold the labor, Becky Gonzales the parts. On the invoice and in Sales By Representative, each gets only their own side; shop  | SAME | 1.12 | C666022 | C666022 | COVERED (wording) |
| 88 | A-note | Tooltip: "Remove Sales Representative - Parts". With Labor and Parts showing, the arrow sits on the name line in the bottom corner (decision | SAME | 1.13 | C666022 | C666022 | COVERED (wording) |
| 89 | A-note | Removing the Parts row leaves the Labor person, Daniel Montoya, as the one Sales Representative for the whole job (decision 66). Becky is no | SAME | 1.14 | C666022 | C666022 | COVERED (wording) |
| 90 | A-note | To clear the field, open its list and pick "Unassigned", the first option (decision 69). Daniel Montoya is checked as the current rep. | SAME | 1.15 | C666019, C666023 | C666019, C666023 | COVERED (wording) |
| 91 | A-note | After picking Unassigned the field reads "Unassigned": nobody gets credit for this work order unless the customer fallback applies at invoic | SAME | 1.16 | C666023 | C666023 | COVERED (wording) |
| 92 | A-note | Invoiced work order S2-17540 with two reps. The rows are plain text: "Sales Representative - Labor" Daniel Montoya, "Sales Representative -  | SAME | 1.17 |  | C666024 | COVERED (board title/note of an attached board; quoted under References from Design) |
| 93 | A-note | Production today. A rep change does not appear in the log. | DESIGN-ONLY | 1.18 | C666025 | C666025 | COVERED (wording) |
| 94 | A-note | Each change is a "Sales representative changed" entry with who, when, and before → after. Adding Parts: "Becky Gonzales → Becky Gonzales (Pa | SAME | 1.19 | C666025 | C666025 | COVERED (wording) |
| 95 | A-note | WORK ORDER CARD: ONE REP, ADD, REMOVE /  / Read left to right. Boards marked Before are production today. Every other board is the build, on | SAME | page 1 |  |  | COVERED (page intro; its rules are rows in the visual inventory R1-R10 and in this file) |
| 96 | A-note | Production today. One Sales Representative, or N/A. | SAME | 2.0 | C666003 | C666003 | COVERED (wording) |
| 97 | A-note | Production today. One Sales Representative dropdown. | DESIGN-ONLY | 2.1 | C666003 | C666003 | COVERED (wording) |
| 98 | A-note | Production today. New Customer has no Sales Representative field. | SAME | 2.2 | C666003 | C666003 | COVERED (wording) |
| 99 | A-note | One outlined "Sales Representative" field reading "Unassigned", with the + beside it. | SAME | 2.3 | C666026 | C666026 | COVERED (wording) |
| 100 | A-note | Unassigned, then the reps. | SAME | 2.4 | C666026 | C666026 | COVERED (wording) |
| 101 | A-note | Christian Wallace is the customer's one rep: Service Labor, Service Parts and Part Sales all go to him. To clear it, pick "Unassigned" from  | SAME | 2.5 | C666026 | C666026 | COVERED (wording) |
| 102 | A-note | Tooltip: "Add representative". | SAME | 2.6 | C666020, C666026 | C666026 | COVERED (wording) |
| 103 | A-note | "Sales Representative - Service Parts" and "Sales Representative - Part Sales". | SAME | 2.7 | C665942, C665943, C666026, C666029 | C666026 | COVERED (wording) |
| 104 | A-note | The first field is renamed "Sales Representative - Service Labor". The new "Sales Representative - Service Parts" row starts with the same p | SAME | 2.8 | C666027 | C666027 | COVERED (wording) |
| 105 | A-note | Service Parts is already added, so the menu lists only "Sales Representative - Part Sales". | SAME | 2.9 | C666027 | C666027 | COVERED (wording) |
| 106 | A-note | Service Labor, Service Parts and Part Sales; Service Parts and Part Sales each have a remove x. The + is gone: nothing left to add. Part Sal | SAME | 2.10 | C666027 | C666027 | COVERED (wording) |
| 107 | A-note | Jason Garrison is picked for Service Parts. The Part Sales list is the same as every other: Unassigned first, then the reps. No "Same as Ser | SAME | 2.11 | C666027 | C666027 | COVERED (wording) |
| 108 | A-note | Christian Wallace for Service Labor, Jason Garrison for Service Parts, Dylan Rush for Part Sales. | SAME | 2.12 | C666027 | C666027 | COVERED (wording) |
| 109 | A-note | Tooltip: "Remove Sales Representative - Service Parts". | SAME | 2.13 | C666027 | C666027 | COVERED (wording) |
| 110 | A-note | Service Parts removed: the Service Labor person (Christian Wallace) is the one "Sales Representative" again, and Part Sales keeps its own ro | SAME | 2.14 |  | C666027 | COVERED (board title/note of an attached board; quoted under References from Design) |
| 111 | A-note | Service Parts added back (Jason Garrison) and saved. The customer page shows the same rows as the window, as plain text: Service Labor Chris | SAME | 2.15 | C666028 | C666028 | COVERED (wording) |
| 112 | A-note | Decision 34: New Customer gets the same optional Sales Representative field and +, in the same spot as on Edit Customer. | SAME | 2.16 | C666029 | C666029 | COVERED (wording) |
| 113 | A-note | The same two options as Edit Customer. (A name is typed so the window shows no required-field message.) | SAME | 2.17 | C666029 | C666029 | COVERED (wording) |
| 114 | A-note | Part Sales added on its own: "Sales Representative" and "Sales Representative - Part Sales", with its remove x. Same rows and rules as Edit  | SAME | 2.18 | C666029 | C666029 | COVERED (wording) |
| 115 | A-note | A CUSTOMER'S REPS: EDIT CUSTOMER AND NEW CUSTOMER /  / The customer's reps are the defaults for its new work orders and part sales. Read lef | SAME | page 2 |  |  | COVERED (page intro; its rules are rows in the visual inventory R1-R10 and in this file) |
| 116 | A-note | Production today. The part sale card has no Sales Representative field. | DESIGN-ONLY | 3.0 | C666030 | C666030 | COVERED (wording) |
| 117 | A-note | One "Sales Representative" field on the part sale card, plain text at rest, the full width of the card. The part sale field belongs to Part  | SAME | 3.1 | C666030 | C666030 | COVERED (wording) |
| 118 | A-note | Part Sales Update v1's own hover box and arrow, the full width of the card. | SAME | 3.2 | C666030 | C666030 | COVERED (wording) |
| 119 | A-note | Part Sales Update v1's list, unchanged by this project. The rep on the part sale when it is invoiced gets the credit. | SAME | 3.3 | C666030 | C666030 | COVERED (wording) |
| 120 | A-note | Gerald Ortiz picked. The same field, still no + button and no remove x. | SAME | 3.4 | C666030 | C666030 | COVERED (wording) |
| 121 | A-note | A PART SALE'S REP /  / The part sale field belongs to Part Sales Update v1 (SV-10266) and looks exactly as that feature builds it; Split Rep | SAME | page 3 |  |  | COVERED (page intro; its rules are rows in the visual inventory R1-R10 and in this file) |
| 122 | A-note | Production today. A "Product Type" filter. Each invoice is credited whole to its one rep. | DESIGN-ONLY | 4.0 | C666005 | C666005 | COVERED (wording) |
| 123 | A-note | Production today. Part Sales or Service Sales. | DESIGN-ONLY | 4.1 | C666005 | C666005 | COVERED (wording) |
| 124 | A-note | Production today. No Sales Type column. | DESIGN-ONLY | 4.2 | C666005 | C666005 | COVERED (wording) |
| 125 | A-note | Production today. One row per invoice under each rep. | DESIGN-ONLY | 4.3 | C666005 | C666005 | COVERED (wording) |
| 126 | A-note | The filter is now "Sales Type". Devon 3 invoices, $1,314.68; Elliot 3 invoices, $2,788.81; total $4,103.49. A split invoice counts once for  | SAME | 4.4 | C666031 | C666031 | COVERED (wording) |
| 127 | A-note | Decision 40: the Sales Type column is off by default on screen. S1-12 appears under both reps: Devon with its parts, Elliot with its labor a | SAME | 4.5 | C666031 | C666031 | COVERED (wording) |
| 128 | A-note | Labor, Parts and Part Sales, all on by default. Rows and every total follow it; any combination works. | SAME | 4.6 | C666031 | C666031 | COVERED (wording) |
| 129 | A-note | "Sales Type: Labor" keeps only the labor side of each work order. (The Sales Type column is switched on in this board, from board 4.9.) | SAME | 4.7 | C666031 | C666031 | COVERED (wording) |
| 130 | A-note | Sales Type is the first entry, off by default. | SAME | 4.8 | C666031 | C666031 | COVERED (wording) |
| 131 | A-note | Switching it on adds the column next to Status. | SAME | 4.9 | C666031 | C666031 | COVERED (wording) |
| 132 | A-note | Values: Labor, Parts and Part Sales. One rep with both sides of one work order shows as one row reading "Labor, Parts" (S1-32, decision 38). | SAME | 4.10 |  | C666031 | COVERED (board title/note of an attached board; quoted under References from Design) |
| 133 | A-note | Downloaded with the Sales Type column switched off on screen: the file still has Sales Type (decision 40). An empty side is a blank cell. (S | SAME | 4.11 | C666032 | C666032 | COVERED (wording) |
| 134 | A-note | The PDF always has the Sales Type column. An empty side shows a dash. Header lines name the filters, including "Sales Type: All". | SAME | 4.12 | C666032 | C666032 | COVERED (wording) |
| 135 | A-note | SALES BY REPRESENTATIVE REPORT /  / Each rep is credited only for the side they sold. Read left to right. /  / Boards marked Before are prod | SAME | page 4 |  |  | COVERED (page intro; its rules are rows in the visual inventory R1-R10 and in this file) |
| 136 | A-note | Production today: "Product Type: All products", options Part Sales and Service Sales. | DESIGN-ONLY | 5.0 | C666008 | C666008 | COVERED (wording) |
| 137 | A-note | "Sales Type: All Sales", same options (Part Sales, Service Sales) and same behavior. Sales By Customer keeps whole invoices; it does not spl | SAME | 5.1 | C666033 | C666033 | COVERED (wording) |
| 138 | A-note | The filter open. Options read Part Sales and Service Sales; with both selected it reads Sales Type: All Sales (S8-R6 to S8-R8). /  / At 1600 | SAME | 5.2 |  | C666033 | COVERED (board title/note of an attached board; quoted under References from Design) |
| 139 | A-note | SALES BY CUSTOMER: THE FILTER NAME /  / Only the filter's wording changes, to match Sales By Representative. Board 5.0 is production today;  | SAME | page 5 |  |  | COVERED (page intro; its rules are rows in the visual inventory R1-R10 and in this file) |
| 140 | A-note | Production today. On a phone the work order card sits behind the details panel. | DESIGN-ONLY | 6.0 | C666014 | C666014 | COVERED (wording) |
| 141 | A-note | Production today. The same one-person list as on a computer. | DESIGN-ONLY | 6.1 | C666014 | C666014 | COVERED (wording) |
| 142 | A-note | "Sales Representative" reading "Unassigned", with the + always showing beside it. | SAME | 6.2 | C666034 | C666034 | COVERED (wording) |
| 143 | A-note | The native dropdown, the same as Lead Technician: Unassigned first, then the reps. | SAME | 6.3 | C666034 | C666034 | COVERED (wording) |
| 144 | A-note | Becky Gonzales. The + shows without any hover. | SAME | 6.4 | C666034 | C666034 | COVERED (wording) |
| 145 | A-note | The menu: "Sales Representative - Parts". | SAME | 6.5 | C666034 | C666034 | COVERED (wording) |
| 146 | A-note | "Sales Representative - Labor" and "Sales Representative - Parts", both Becky; labels in full; the Parts row has its remove x, always showin | DIFFERENT | 6.6 | C666034 | C666034 | PO-RULED (PO-RULED answer 11 (arrow always shows)); the cases follow the ruling |
| 147 | A-note | The same list per row. With Labor and Parts showing, the arrow sits on the name line in the bottom corner (decision 70). | SAME | 6.7 | C666034 | C666034 | COVERED (wording) |
| 148 | A-note | ON A PHONE /  / The same field and the same rules on a 390px-wide touch screen. Read left to right. /  / Boards 6.0 and 6.1 are production t | SAME | page 6 |  |  | COVERED (page intro; its rules are rows in the visual inventory R1-R10 and in this file) |
| 149 | H | Lead Technician | SAME | 1.0, 1.16 | C665915, C665937, C665938, C666004, C666014, C666017 … | C666004, C666023 | COVERED (wording) |
| 150 | H | Service Advisor | SAME | 1.0, 1.16 | C665915, C665937, C665938, C666004, C666014, C666017 … | C666004, C666023 | COVERED (wording) |
| 151 | H | Sales Representative | SAME | 1.0, 1.8, 1.14, 1.16 | C665915, C665916, C665917, C665918, C665919, C665920 … | C666004, C666020, C666022, C666023 | COVERED (wording) |
| 152 | H | Unassigned | SAME | 1.2, 1.3, 1.4, 1.11, 1.15, 1.16 | C665915, C665916, C665917, C665918, C665923, C665924 … | C666017, C666018, C666019, C666021, C666023 | COVERED (wording) |
| 158 | H | Add representative | SAME | 1.7, 2.6 | C665925, C665942, C666020, C666026 | C666020, C666026 | COVERED (wording) |
| 159 | H | Sales Representative - Parts | SAME | 1.8, 6.5 | C665925, C665926, C665927, C665928, C665929, C665930 … | C666020, C666034 | COVERED (wording) |
| 160 | H | Sales Representative - Labor | SAME | 1.9, 1.13, 1.17, 6.6, 6.7 | C665925, C665926, C665928, C665929, C665930, C665931 … | C666021, C666022, C666024, C666034 | COVERED (wording) |
| 161 | H | Sales Representative - Parts | SAME | 1.9, 1.13, 1.17, 6.6, 6.7 | C665925, C665926, C665927, C665928, C665929, C665930 … | C666021, C666022, C666024, C666034 | COVERED (wording) |
| 162 | H | Remove Sales Representative - Parts | SAME | 1.13 | C665929, C666022 | C666022 | COVERED (wording) |
| 163 | H | Lead technician | SAME | 1.17 |  | C666024 | MISSING -> GAP-1 (C666024 / C665932 do not state the LT/SA read-only labels) |
| 164 | H | Service advisor | SAME | 1.17 |  | C666024 | MISSING -> GAP-1 (C666024 / C665932 do not state the LT/SA read-only labels) |
| 168 | H | Work Order Log | DESIGN-ONLY | 1.18, 1.19 | C666025 | C666025 | COVERED (wording) |
| 169 | H | Search | DESIGN-ONLY | 1.18, 1.19 |  | C666025 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 170 | H | Event | DESIGN-ONLY | 1.18, 1.19 |  | C666025 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 171 | H | User | DESIGN-ONLY | 1.18, 1.19 |  | C666025 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 172 | H | Line | DESIGN-ONLY | 1.18, 1.19 |  | C666025 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 173 | H | Details | DESIGN-ONLY | 1.18, 1.19 |  | C666025 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 174 | H | Date | DESIGN-ONLY | 1.18, 1.19, 2.0, 2.15, 4.0, 4.1, 4.2, 4.3 … |  | C666003, C666005, C666008, C666025, C666028, C666031 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 175 | H | Time | DESIGN-ONLY | 1.18, 1.19, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5 … |  | C666005, C666008, C666025, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 176 | H | Sales representative changed | SAME | 1.19 | C665948, C665981, C665982, C665983, C665994, C666025 | C666025 | COVERED (wording) |
| 177 | H | Sales Representative: Daniel Montoya → Unassigned | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 178 | H | Sales Representative: Becky Gonzales (Parts) · Daniel Montoya (Labor) → Daniel Montoya | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 179 | H | Sales Representative: Becky Gonzales (Parts) · Becky Gonzales (Labor) → Becky Gonzales (Parts) · Daniel Montoya (Labor) | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 180 | H | Sales Representative: Becky Gonzales → Becky Gonzales (Parts) · Becky Gonzales (Labor) | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 181 | H | Sales Representative: Unassigned → Becky Gonzales | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 182 | H | Sales Representative: Becky Gonzales (Parts) · Unassigned (Labor) → Unassigned | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 183 | H | Sales Representative: Unassigned (Parts) · Unassigned (Labor) → Becky Gonzales (Parts) · Unassigned (Labor) | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 184 | H | Sales Representative: Unassigned → Unassigned (Parts) · Unassigned (Labor) | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 186 | H | Line created | DESIGN-ONLY | 1.18 |  | C666025 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 187 | H | Line authorized | DESIGN-ONLY | 1.18 |  | C666025 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 188 | H | Line authorization required | DESIGN-ONLY | 1.18 |  | C666025 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 189 | H | Created | DESIGN-ONLY | 1.18 |  | C666025 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 190 | H | Status: Authorization Required → Authorized | DESIGN-ONLY | 1.18 |  | C666025 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 191 | H | N/A | SAME | 2.0 |  | C666003 | COVERED (picture: the case compares the screen with this board) |
| 192 | H | Edit Customer | SAME | 2.1, 2.3, 2.14 | C665939, C665940, C665941, C665942, C665943, C665944 … | C666003, C666026, C666027 | COVERED (wording) |
| 193 | H | New Customer | SAME | 2.2, 2.16, 2.18 | C665939, C665940, C665941, C665990, C666003, C666026 … | C666003, C666029 | COVERED (wording) |
| 194 | H | Sales Representative | SAME | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … | C665915, C665916, C665917, C665918, C665919, C665920 … | C666003, C666004, C666014, C666017, C666018, C666019 | COVERED (wording) |
| 195 | H | Unassigned | SAME | 2.3, 2.4, 2.11 | C665915, C665916, C665917, C665918, C665923, C665924 … | C666026, C666027 | COVERED (wording) |
| 201 | H | Sales Representative - Service Parts | SAME | 2.7, 2.8, 2.13, 2.15, 2.17 | C665939, C665941, C665942, C665943, C665944, C665945 … | C666026, C666027, C666028, C666029 | COVERED (wording) |
| 202 | H | Sales Representative - Part Sales | SAME | 2.7, 2.9, 2.10, 2.14, 2.15, 2.17, 2.18 | C665941, C665942, C665943, C665944, C665945, C665947 … | C666026, C666027, C666028, C666029 | COVERED (wording) |
| 203 | H | Sales Representative - Service Labor | SAME | 2.8, 2.13, 2.15 | C665939, C665941, C665942, C665943, C665944, C665945 … | C666027, C666028 | COVERED (wording) |
| 204 | H | Remove Sales Representative - Service Parts | SAME | 2.13 | C665942, C665943, C666027, C666029 | C666027 | COVERED (wording) |
| 208 | H | Name * | DESIGN-ONLY | 2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9 … |  | C666003, C666026, C666027, C666029 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 209 | H | Phone | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666003, C666004, C666014, C666017, C666018, C666019 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 210 | H | Address 1 | DESIGN-ONLY | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8 … |  | C666003, C666026, C666027, C666029 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 211 | H | Address 2 | DESIGN-ONLY | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8 … |  | C666003, C666026, C666027, C666029 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 212 | H | City | DESIGN-ONLY | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8 … |  | C666003, C666026, C666027, C666029 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 213 | H | ZIP/Postal Code | DESIGN-ONLY | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8 … |  | C666003, C666026, C666027, C666029 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 214 | H | State/Province | DESIGN-ONLY | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8 … |  | C666003, C666026, C666027, C666029 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 215 | H | Country | DESIGN-ONLY | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8 … |  | C666003, C666026, C666027, C666029 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 216 | H | Credit Terms | DESIGN-ONLY | 2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9 … |  | C666003, C666026, C666027 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 217 | H | Credit Limit | DESIGN-ONLY | 2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9 … |  | C666003, C666026, C666027 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 218 | H | Default Labor Rate | DESIGN-ONLY | 2.3, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.12 … |  | C666026, C666027 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 219 | H | Default Shop Supplies | DESIGN-ONLY | 2.3, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.12 … |  | C666026, C666027 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 220 | H | Min | DESIGN-ONLY | 2.3, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.12 … |  | C666026, C666027 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 221 | H | Max | DESIGN-ONLY | 2.3, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.12 … |  | C666026, C666027 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 222 | H | Notes | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666003, C666004, C666014, C666017, C666018, C666019 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 223 | H | Website | DESIGN-ONLY | 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7 … |  | C666003, C666026, C666027, C666028, C666029 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 224 | H | IBS | DESIGN-ONLY | 1.0, 1.1, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5 … |  | C666003, C666004, C666005, C666008, C666026, C666027 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 225 | H | Taxes | DESIGN-ONLY | 2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9 … |  | C666003, C666026, C666027 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 226 | H | Default Tax Settings | DESIGN-ONLY | 2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9 … |  | C666003, C666026, C666027 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 227 | H | PO is required | DESIGN-ONLY | 2.1 |  | C666003 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 228 | H | Pin notes? | DESIGN-ONLY | 2.3, 2.4, 2.5, 2.6, 2.7 |  | C666026 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 229 | H | Save | DESIGN-ONLY | 2.2, 2.16, 2.17, 2.18, 3.0-3.4 |  | C666003, C666029, C666030 | EXISTING SCREEN TEXT, unchanged by this feature (New Customer and part sale 'Save' buttons, seen on attached boards) |
| 230 | H | Empty bays, endless possibilities. Get Going! | DESIGN-ONLY | 2.0 |  | C666003 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 231 | H | Sales Representative | DIFFERENT | 3.1, 3.4 | C665915, C665916, C665917, C665918, C665919, C665920 … | C666030 | MISSING -> GAP-2 (C666030 expects "Sales Representative"; C665935 silent) |
| 234 | H | Sales By Representative | SAME | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … | C665934, C665948, C665951, C665954, C665955, C665956 … | C666005, C666008, C666031, C666032, C666033 | COVERED (wording) |
| 235 | H | Product Type: All products | SAME | 4.0, 4.3, 5.0 | C666008 | C666005, C666008 | COVERED (wording) |
| 236 | H | Parts | DESIGN-ONLY | 4.1, 5.0 |  | C666005, C666008 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 237 | H | Services | DESIGN-ONLY | 4.1, 5.0 |  | C666005, C666008 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 238 | H | Sales Type: All | SAME | 4.4, 4.6, 4.8, 4.10 | C665984, C665985, C665986, C665987, C665998, C666001 … | C666031 | COVERED (wording) |
| 239 | H | Sales Type: Labor | SAME | 4.7 | C665984, C666001, C666031 | C666031 | COVERED (wording) |
| 240 | H | Labor | SAME | 4.6 |  | C666031 | COVERED (picture: the case compares the screen with this board) |
| 241 | H | Parts | SAME | 4.6 |  | C666031 | COVERED (picture: the case compares the screen with this board) |
| 242 | H | Part Sales | SAME | 4.6 | C665935, C665939, C665941, C665942, C665943, C665944 … | C666031 | COVERED (wording) |
| 243 | H | Labor, Parts | SAME | 4.10 | C665962, C665969, C665972, C665984, C665991, C666001 … | C666031 | COVERED (wording) |
| 244 | H | Sales Type | SAME | 4.7, 4.8, 4.9, 4.10 | C665955, C665956, C665962, C665963, C665964, C665965 … | C666031 | COVERED (wording) |
| 245 | H | Select all | DESIGN-ONLY | 4.1, 4.6 |  | C666005, C666031 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 246 | H | 3 selected | DESIGN-ONLY | 4.6 |  | C666031 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 247 | H | 2 selected | DESIGN-ONLY | 4.1, 5.0, 5.2 |  | C666005, C666008, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 248 | H | Clear selection | DESIGN-ONLY | 4.1, 4.6, 5.0, 5.2 | C665998 | C666005, C666008, C666031, C666033 | COVERED (wording) |
| 249 | H | Column Selection | DESIGN-ONLY | 4.2, 4.8 |  | C666005, C666031 | COVERED (picture: the case compares the screen with this board) |
| 250 | H | No record matches these filters | DESIGN-ONLY | 4.1, 4.2, 5.0 |  | C666005, C666008 | COVERED (picture: the case compares the screen with this board) |
| 251 | H | Try changing filters to widen your results. | DESIGN-ONLY | 4.1, 4.2, 5.0 |  | C666005, C666008 | COVERED (picture: the case compares the screen with this board) |
| 252 | H | Show Unassigned | SAME | 4.0, 4.3, 4.4, 4.10 | C665934, C665951, C665956, C665962, C665963, C665964 … | C666005, C666031 | COVERED (wording) |
| 253 | H | Unassigned (1570) | SAME | 4.0, 4.3 |  | C666005 | COVERED (picture: the case compares the screen with this board) |
| 256 | H | Date: Last 12 months | DESIGN-ONLY | 4.0, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9 … |  | C666005, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 257 | H | Date: This month | DESIGN-ONLY | 4.1, 4.2, 5.0 |  | C666005, C666008 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 258 | H | Invoice Status: All statuses | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666031 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 261 | H | Invoice | DESIGN-ONLY | 2.0, 2.15, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5 … |  | C666003, C666005, C666008, C666028, C666031, C666032 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 262 | H | Customer | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666003, C666004, C666005, C666008, C666017, C666018 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 263 | H | Status | SAME | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … | C665962, C665972, C665973, C665991, C665996, C666001 … | C666003, C666004, C666005, C666017, C666018, C666019 | COVERED (wording) |
| 264 | H | Labor Delta | SAME | 4.0, 4.2, 4.3, 4.4, 4.5, 4.7, 4.8, 4.9 … | C665962, C665963, C665992 | C666005, C666031, C666032, C666033 | COVERED (wording) |
| 265 | H | Labor Invoiced | SAME | 4.0, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8 … | C665962, C665963, C665964, C665969, C665971, C665992 … | C666005, C666031, C666032, C666033 | COVERED (wording) |
| 266 | H | Labor Margin | SAME | 4.0, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8 … | C665962, C665963, C665971, C665992 | C666005, C666008, C666031, C666032, C666033 | COVERED (wording) |
| 267 | H | Parts Invoiced | SAME | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … | C665962, C665964, C665969, C665992, C665993, C666016 | C666005, C666008, C666031, C666032, C666033 | COVERED (wording) |
| 268 | H | Parts Margin | SAME | 4.0, 4.1, 4.2, 4.4, 4.5, 4.6, 4.7, 4.8 … | C665962, C665971, C665992, C666016, C666031 | C666005, C666008, C666031, C666032, C666033 | COVERED (wording) |
| 269 | H | Shop Supplies | SAME | 2.3, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.12 … | C665962, C665963, C665964, C665965, C665966, C665967 … | C666005, C666008, C666026, C666027, C666031, C666032 | COVERED (wording) |
| 270 | H | Adjustments | SAME | 4.0, 4.1, 4.2, 4.4, 4.7, 4.8, 4.9, 4.11 … | C666033 | C666005, C666008, C666031, C666032 | MISSING -> GAP-7 (no case says the share shows in Adjustments) |
| 271 | H | Margin | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666004, C666005, C666008, C666017, C666018, C666019 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 272 | H | Margin % | SAME | 4.2, 4.8, 4.9, 4.11, 4.12, 5.0 | C665971 | C666005, C666008, C666031, C666032 | COVERED (wording) |
| 273 | H | Subtotal | DESIGN-ONLY | 3.0, 3.1, 3.2, 3.3, 3.4, 4.0, 4.3, 4.4 … |  | C666005, C666008, C666030, C666031, C666032, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 274 | H | Totals | DESIGN-ONLY | 4.0, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9 … |  | C666005, C666031, C666032, C666033 | COVERED (picture: the case compares the screen with this board) |
| 275 | H | Hrs Worked | SAME | 4.11, 4.12 | C665962, C665963, C665992 | C666032 | COVERED (wording) |
| 276 | H | Hrs Invoiced | SAME | 4.11, 4.12 | C665962, C665963, C665992, C665993 | C666032 | COVERED (wording) |
| 277 | H | — | SAME | 1.0, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8 … |  | C666003, C666004, C666005, C666008, C666017, C666018 | COVERED (wording: 'dash' in C665962, C665973, C666031, C666032) |
| 278 | H | $0.00 (shown clipped as '$0.(') in Shop Supplies of Devon's S1-12 Parts row | DIFFERENT | 4.5, 4.11, 4.12 |  | C666031, C666032 | PO-RULED (PO-RULED answer 24 (dash / blank)); the cases follow the ruling |
| 279 | H | $0.00 in Shop Supplies of the part sale rows P1-9006, P1-4, P1-9005 | DIFFERENT | 4.5, 4.10, 4.11, 4.12 |  | C666031, C666032 | PO-RULED (PO-RULED answer 25 (dash; $0.00 only for a $0.00 charge)); the cases follow the ruling |
| 280 | H | Sales By Representative - Expanded View (CSV), opened as a spreadsheet | DESIGN-ONLY | 4.11 |  | C666032 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 282 | H | Invoice Status: All Statuses | DESIGN-ONLY | 4.11, 4.12 |  | C666032 | COVERED (picture: the case compares the screen with this board) |
| 284 | H | Representative | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … | C665915, C665916, C665917, C665918, C665919, C665920 … | C666003, C666004, C666005, C666008, C666014, C666017 | COVERED (wording) |
| 285 | H | Invoice # | DESIGN-ONLY | 4.11, 4.12 |  | C666032 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 286 | H | Sales By Representative Report | DESIGN-ONLY | 4.12 |  | C666032 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 290 | H | Sales By Customer | SAME | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … | C665986, C665987, C665988, C665998, C665999, C666000 … | C666005, C666008, C666031, C666033 | COVERED (wording) |
| 291 | H | Sales Type: All Sales | SAME | 5.1, 5.2 | C665986, C665987, C665998, C666001, C666008, C666033 | C666033 | COVERED (wording) |
| 292 | H | Service Sales | SAME | 5.2 | C665986, C665987, C665988, C665998, C665999, C666001 … | C666033 | COVERED (wording) |
| 293 | H | Customer: All customers | DESIGN-ONLY | 5.1, 5.2 |  | C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 294 | H | Hide Details | DIFFERENT | 6.0, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7 |  | C666014, C666034 | MISSING -> GAP-5 (no case names the phone toggle) |
| 295 | H | Clock In | DESIGN-ONLY | 3.1, 3.2, 3.3, 3.4, 6.0, 6.1, 6.2, 6.3 … |  | C666014, C666030, C666034 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 297 | O | ShopHub » | DESIGN-ONLY | 1.0, 1.4, 1.6, 1.7, 1.9, 1.10, 1.11, 1.12 … |  | C666003, C666004, C666005, C666008, C666018, C666019 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 298 | O | Work Orders | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666003, C666004, C666005, C666008, C666017, C666018 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 299 | O | Schedule | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666003, C666004, C666005, C666008, C666017, C666018 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 300 | O | Customers | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666003, C666004, C666005, C666008, C666017, C666018 | COVERED (picture: the case compares the screen with this board) |
| 301 | O | Parts | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666003, C666004, C666005, C666008, C666017, C666018 | COVERED (picture: the case compares the screen with this board) |
| 302 | O | Reports | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666003, C666004, C666005, C666008, C666017, C666018 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 303 | O | Search customers, work orders, .. | DESIGN-ONLY | 1.0, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8 … |  | C666003, C666004, C666005, C666008, C666017, C666018 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 305 | O | Ctrl K | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.4, 1.5, 1.6, 1.7, 1.9 … |  | C666003, C666004, C666005, C666008, C666017, C666018 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 309 | O | Stats | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666004, C666017, C666018, C666019, C666020, C666021 | COVERED (picture: the case compares the screen with this board) |
| 310 | O | Finance | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666004, C666017, C666018, C666019, C666020, C666021 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 311 | O | SHOPCOACH ANALYSIS | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666004, C666017, C666018, C666019, C666020, C666021 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 314 | O | Name/Description | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666004, C666017, C666018, C666019, C666020, C666021 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 315 | O | Actual/Estimate | DESIGN-ONLY | 1.0, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8 … |  | C666004, C666017, C666018, C666019, C666020, C666021 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 316 | O | Progress | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666003, C666004, C666005, C666008, C666014, C666017 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 317 | O | Status | SAME | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … | C665962, C665972, C665973, C665991, C665996, C666001 … | C666003, C666004, C666005, C666017, C666018, C666019 | COVERED (wording) |
| 318 | O | Action | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666004, C666017, C666018, C666019, C666020, C666021 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 319 | O | Rate | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666004, C666017, C666018, C666019, C666020, C666021 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 320 | O | Margin | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666004, C666005, C666008, C666017, C666018, C666019 | COVERED (picture: the case compares the screen with this board) |
| 321 | O | Total | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666003, C666004, C666005, C666014, C666017, C666018 | COVERED (picture: the case compares the screen with this board) |
| 326 | O | ¢ Approved ») | DESIGN-ONLY | 1.0 |  | C666004 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 332 | O | Add tech story for this line | DESIGN-ONLY | 1.0, 1.1 |  | C666004 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 333 | O | Lead Technician | SAME | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … | C665915, C665937, C665938, C666004, C666014, C666017 … | C666003, C666004, C666014, C666017, C666018, C666019 | COVERED (wording) |
| 334 | O | Labor | SAME | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666004, C666005, C666008, C666017, C666018, C666019 | COVERED (picture: the case compares the screen with this board) |
| 335 | O | Unassigned | SAME | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … | C665915, C665916, C665917, C665918, C665923, C665924 … | C666004, C666005, C666014, C666017, C666018, C666019 | COVERED (wording) |
| 336 | O | + Add Part | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666004, C666017, C666018, C666019, C666020, C666021 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 337 | O | Service Advisor | SAME | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … | C665915, C665937, C665938, C666004, C666014, C666017 … | C666004, C666014, C666017, C666018, C666019, C666020 | COVERED (wording) |
| 342 | O | Sales Representative | SAME | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … | C665915, C665916, C665917, C665918, C665919, C665920 … | C666003, C666004, C666014, C666017, C666018, C666019 | COVERED (wording) |
| 346 | O | ¥ Pinned Notes: | DESIGN-ONLY | 1.0, 1.2, 1.3, 1.5, 1.6, 1.7, 1.8, 1.10 … |  | C666004, C666017, C666018, C666020, C666021, C666022 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 356 | O | Contact | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666003, C666004, C666014, C666017, C666018, C666019 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 358 | O | Auth To Order ) | DESIGN-ONLY | 1.0, 1.1 |  | C666004 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 363 | O | Phone | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666003, C666004, C666014, C666017, C666018, C666019 | COVERED (picture: the case compares the screen with this board) |
| 369 | O | Authorizer | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666004, C666014, C666017, C666018, C666019, C666020 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 370 | O | None | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666004, C666014, C666017, C666018, C666019, C666020 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 371 | O | IBS# | DESIGN-ONLY | 1.0, 1.1 |  | C666004 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 378 | O | ShopHub v | DESIGN-ONLY | 1.1, 4.0, 4.3 |  | C666004, C666005 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 379 | O | Q_ Search customers, work orders, | DESIGN-ONLY | 1.1, 1.4, 2.0, 2.15, 4.0, 4.3 |  | C666003, C666004, C666005, C666019, C666028 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 383 | O | ¢ Approved ) | DESIGN-ONLY | 1.1 |  | C666004 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 384 | O | v Unassigned | SAME | 1.1, 1.4, 2.4, 3.3, 6.3 |  | C666004, C666019, C666026, C666030, C666034 | COVERED (picture: the case compares the screen with this board) |
| 386 | O | ( Auth To Order ) | DESIGN-ONLY | 1.1 |  | C666004 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 388 | O | ShopHub ~ | DESIGN-ONLY | 1.2, 1.5, 1.14, 1.16, 3.4 |  | C666017, C666022, C666023, C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 389 | O | Q. Search customers, work orders, ... Ctrl K | DESIGN-ONLY | 1.2, 1.5, 1.10, 1.14, 1.16 |  | C666017, C666021, C666022, C666023 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 395 | O | ¢ In Progress ) Over Limit | DESIGN-ONLY | 1.2, 1.8, 1.10 |  | C666017, C666020, C666021 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 402 | O | C Approved ) | DESIGN-ONLY | 1.2, 1.5, 1.8, 1.9, 1.12, 1.14, 1.16 |  | C666017, C666020, C666021, C666022, C666023 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 416 | O | ( Needs Approval ) | DESIGN-ONLY | 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9 … |  | C666017, C666018, C666019, C666020, C666021, C666022 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 439 | O | Unit # | DESIGN-ONLY | 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.14 … |  | C666017, C666018, C666019, C666020, C666022, C666023 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 442 | O | VIN/Gerial # | DESIGN-ONLY | 1.2, 1.4 |  | C666017, C666019 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 445 | O | ShopHub | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666003, C666004, C666005, C666008, C666017, C666018 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 446 | O | Search customers, work orders, ... Ctrl. K | DESIGN-ONLY | 1.3, 1.8, 1.11 |  | C666018, C666020, C666021 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 447 | O | < Approved ) | DESIGN-ONLY | 1.3, 1.6 |  | C666018 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 448 | O | VIN/Gerial & | DESIGN-ONLY | 1.3 |  | C666018 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 449 | O | Q_ Search customers, work orders, .. | DESIGN-ONLY | 1.4, 2.0, 2.15, 4.0, 4.3 |  | C666003, C666005, C666019, C666028 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 451 | O | ¢ In Progress ) © Over Limit ) | DESIGN-ONLY | 1.4 |  | C666019 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 459 | O | ( Requested ) | DESIGN-ONLY | 1.4, 1.7, 1.15 |  | C666019, C666020, C666023 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 461 | O | In Progress ) Over Limit | DESIGN-ONLY | 1.2, 1.5, 1.6, 1.7, 1.8, 1.10, 1.14, 1.16 |  | C666017, C666018, C666020, C666021, C666022, C666023 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 462 | O | Search customers, work orders, ... Ctrl K | DESIGN-ONLY | 1.2, 1.5, 1.6, 1.10, 1.14, 1.16, 2.0, 4.0 … |  | C666003, C666005, C666017, C666018, C666021, C666022 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 463 | O | C In Progress ) Over Limit | DESIGN-ONLY | 1.6, 1.7 |  | C666018, C666020 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 465 | O | (Approved ) | DESIGN-ONLY | 1.7 |  | C666020 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 469 | O | Q. Search customers, work orders, ... Ctrl. K | DESIGN-ONLY | 1.8 |  | C666020 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 471 | O | Sales Representative - Parts | SAME | 1.8, 1.9, 1.10, 1.12, 1.13, 1.17, 2.7, 2.17 … | C665925, C665926, C665927, C665928, C665929, C665930 … | C666020, C666021, C666022, C666024, C666026, C666029 | COVERED (wording) |
| 472 | O | Q. Search customers, work orders, .. | DESIGN-ONLY | 1.2, 1.5, 1.8, 1.9, 1.10, 1.12, 1.14, 1.16 … |  | C666017, C666020, C666021, C666022, C666023, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 473 | O | C In Progress | DESIGN-ONLY | 1.6, 1.7, 1.9, 1.12 |  | C666018, C666020, C666021, C666022 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 474 | O | Over Limit | DESIGN-ONLY | 1.2, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10 … |  | C666017, C666018, C666019, C666020, C666021, C666022 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 475 | O | Sales Representative - Labor | SAME | 1.9, 1.10, 1.11, 1.12, 1.13, 1.17, 6.6, 6.7 | C665925, C665926, C665928, C665929, C665930, C665931 … | C666021, C666022, C666024, C666034 | COVERED (wording) |
| 476 | O | Pinned Notes: | DESIGN-ONLY | 1.0, 1.2, 1.3, 1.5, 1.6, 1.7, 1.8, 1.9 … |  | C666004, C666014, C666017, C666018, C666020, C666021 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 477 | O | ¢ In Progress ) Over Limit ) | DESIGN-ONLY | 1.10 |  | C666021 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 478 | O | Approved ) | DESIGN-ONLY | 1.1, 1.2, 1.3, 1.5, 1.6, 1.7, 1.8, 1.9 … |  | C666004, C666017, C666018, C666020, C666021, C666022 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 479 | O | In Progress ) < Over Limit ) | DESIGN-ONLY | 1.11 |  | C666021 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 483 | O | ( Requested }) | DESIGN-ONLY | 1.11 |  | C666021 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 484 | O | ¥# Pinned Notes: | DESIGN-ONLY | 1.12 |  | C666022 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 486 | O | CinProgress ) | DESIGN-ONLY | 1.13 |  | C666022 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 489 | O | ¢ In Progress | DESIGN-ONLY | 1.2, 1.4, 1.8, 1.10, 1.15 |  | C666017, C666019, C666020, C666021, C666023 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 491 | O | Over Limit ) | DESIGN-ONLY | 1.4, 1.10, 1.11, 1.15 |  | C666019, C666021, C666023 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 493 | O | Approved | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.7, 1.8 … |  | C666004, C666017, C666018, C666019, C666020, C666021 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 508 | O | Complete | DESIGN-ONLY | 1.17 |  | C666024 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 512 | O | Lead technician | DESIGN-ONLY | 1.17 |  | C666024 | COVERED (picture: the case compares the screen with this board) |
| 517 | O | Service advisor | DESIGN-ONLY | 1.17 |  | C666024 | COVERED (picture: the case compares the screen with this board) |
| 540 | O | Unit | DESIGN-ONLY | 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.14 … |  | C666003, C666017, C666018, C666019, C666020, C666022 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 541 | O | Work Order Log | DESIGN-ONLY | 1.18, 1.19 | C666025 | C666025 | COVERED (wording) |
| 542 | O | Search | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666003, C666004, C666005, C666008, C666014, C666017 | COVERED (picture: the case compares the screen with this board) |
| 543 | O | Event | DESIGN-ONLY | 1.18, 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 544 | O | User | DESIGN-ONLY | 1.18, 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 545 | O | Line | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666003, C666004, C666017, C666018, C666019, C666020 | COVERED (picture: the case compares the screen with this board) |
| 546 | O | Details | DESIGN-ONLY | 1.18, 1.19, 6.0, 6.1, 6.2, 6.3, 6.4, 6.5 … |  | C666014, C666025, C666034 | COVERED (picture: the case compares the screen with this board) |
| 547 | O | Date | DESIGN-ONLY | 1.18, 1.19, 2.0, 2.15, 4.0, 4.1, 4.2, 4.3 … |  | C666003, C666005, C666008, C666025, C666028, C666031 | COVERED (picture: the case compares the screen with this board) |
| 548 | O | Time | DESIGN-ONLY | 1.18, 1.19, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5 … |  | C666005, C666008, C666025, C666031, C666033 | COVERED (picture: the case compares the screen with this board) |
| 549 | O | Line created | DESIGN-ONLY | 1.18 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 553 | O | Line authorized | DESIGN-ONLY | 1.18 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 555 | O | Status: Authorization Required > Authorized | DESIGN-ONLY | 1.18 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 558 | O | Line authorization required | DESIGN-ONLY | 1.18 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 559 | O | Status: Authorized > Authorization Required | DESIGN-ONLY | 1.18 |  | C666025 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 561 | O | Created | DESIGN-ONLY | 1.18, 2.0, 2.15 |  | C666003, C666025, C666028 | COVERED (picture: the case compares the screen with this board) |
| 563 | O | Q Search | DESIGN-ONLY | 1.19, 2.15 |  | C666025, C666028 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 564 | O | Sales Representative: Daniel Montoya > | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 565 | O | Sales representative changed | SAME | 1.19 | C665948, C665981, C665982, C665983, C665994, C666025 | C666025 | COVERED (wording) |
| 569 | O | Sales Representative: Becky Gonzales | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 570 | O | (Parts) - Daniel Montoya (Labor) > Daniel | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 572 | O | (Parts) - Becky Gonzales (Labor) > Becky | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 573 | O | Gonzales (Parts) - Daniel Montoya (Labor) | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 574 | O | Sales Representative: Becky Gonzales > | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 575 | O | Becky Gonzales (Parts) - Becky Gonzales | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 576 | O | (Labor) | SAME | 1.19 | C665977, C665978, C665980, C665981, C665982, C665994 … | C666025 | COVERED (wording) |
| 577 | O | Sales Representative: Unassigned > | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 579 | O | (Parts) - Unassigned (Labor) > Unassigned | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 580 | O | Sales Representative: Unassigned (Parts) | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 581 | O | - Unassigned (Labor) > Becky Gonzales | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 582 | O | (Parts) - Unassigned (Labor) | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 583 | O | Unassigned (Parts) - Unassigned (Labor) | SAME | 1.19 |  | C666025 | COVERED (picture: the case compares the screen with this board) |
| 589 | O | ShopHub »v | DESIGN-ONLY | 2.0 |  | C666003 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 590 | O | Q_ Search customers, work orders, ... Ctrl K | DESIGN-ONLY | 2.0, 4.0, 4.3 |  | C666003, C666005 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 591 | O | Part Sales | SAME | 2.0, 2.7, 2.9, 2.10, 2.12, 2.13, 2.14, 2.15 … | C665935, C665939, C665941, C665942, C665943, C665944 … | C666003, C666026, C666027, C666028, C666029, C666031 | COVERED (wording) |
| 594 | O | Notes | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666003, C666004, C666014, C666017, C666018, C666019 | COVERED (picture: the case compares the screen with this board) |
| 595 | O | Invoices | DESIGN-ONLY | 2.0, 2.15, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5 … |  | C666003, C666005, C666008, C666028, C666031, C666033 | COVERED (picture: the case compares the screen with this board) |
| 597 | O | Deposits | DESIGN-ONLY | 2.0, 2.15 |  | C666003, C666028 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 600 | O | Address | DESIGN-ONLY | 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7 … |  | C666003, C666026, C666027, C666028, C666029 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 602 | O | 3\¢ Status v | DESIGN-ONLY | 2.0 |  | C666003 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 605 | O | Number ~ | DESIGN-ONLY | 2.0, 2.15 |  | C666003, C666028 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 606 | O | Asset | DESIGN-ONLY | 2.0, 2.15, 3.0, 3.1, 3.2, 3.3, 3.4 |  | C666003, C666028, C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 607 | O | VIN/Serial # | DESIGN-ONLY | 2.0, 2.15 |  | C666003, C666028 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 608 | O | Progress Lead Technician | SAME | 2.0, 2.15 |  | C666003, C666028 | COVERED (picture: the case compares the screen with this board) |
| 609 | O | Lines | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666003, C666004, C666017, C666018, C666019, C666020 | COVERED (picture: the case compares the screen with this board) |
| 610 | O | Total Price | DESIGN-ONLY | 2.0, 2.15 |  | C666003, C666028 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 611 | O | Created On | DESIGN-ONLY | 2.0, 2.15 |  | C666003, C666028 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 612 | O | Invoiced Date | DESIGN-ONLY | 2.0, 2.15 |  | C666003, C666028 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 613 | O | Days Open | DESIGN-ONLY | 2.0, 2.15 |  | C666003, C666028 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 614 | O | Returns | DESIGN-ONLY | 2.0 |  | C666003 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 616 | O | Credit term | DESIGN-ONLY | 2.0, 2.15 |  | C666003, C666028 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 618 | O | Empty bays, endless possibilities. Get Going! | DESIGN-ONLY | 2.0 |  | C666003 | COVERED (picture: the case compares the screen with this board) |
| 619 | O | Credit limit | DESIGN-ONLY | 2.0, 2.15 |  | C666003, C666028 | COVERED (picture: the case compares the screen with this board) |
| 620 | O | N/A | SAME | 2.0, 2.15 |  | C666003, C666028 | COVERED (picture: the case compares the screen with this board) |
| 621 | O | Website | DESIGN-ONLY | 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7 … |  | C666003, C666026, C666027, C666028, C666029 | COVERED (picture: the case compares the screen with this board) |
| 622 | O | IBS | DESIGN-ONLY | 1.0, 1.1, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5 … |  | C666003, C666004, C666005, C666008, C666026, C666027 | COVERED (picture: the case compares the screen with this board) |
| 623 | O | Contacts | DESIGN-ONLY | 2.0, 2.15 |  | C666003, C666028 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 624 | O | Assets | DESIGN-ONLY | 2.0, 2.15 |  | C666003, C666028 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 625 | O | Edit Customer | SAME | 2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9 … | C665939, C665940, C665941, C665942, C665943, C665944 … | C666003, C666026, C666027 | COVERED (wording) |
| 626 | O | Name * | DESIGN-ONLY | 2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9 … |  | C666003, C666026, C666027, C666029 | COVERED (picture: the case compares the screen with this board) |
| 628 | O | Address 1 | DESIGN-ONLY | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8 … |  | C666003, C666026, C666027, C666029 | COVERED (picture: the case compares the screen with this board) |
| 629 | O | / Address 2 | DESIGN-ONLY | 2.1 |  | C666003 | COVERED (picture: the case compares the screen with this board) |
| 630 | O | City | DESIGN-ONLY | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8 … |  | C666003, C666026, C666027, C666029 | COVERED (picture: the case compares the screen with this board) |
| 631 | O | ZIP/Postal Code | DESIGN-ONLY | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8 … |  | C666003, C666026, C666027, C666029 | COVERED (picture: the case compares the screen with this board) |
| 634 | O | State/Province | DESIGN-ONLY | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8 … |  | C666003, C666026, C666027, C666029 | COVERED (picture: the case compares the screen with this board) |
| 635 | O | Country | DESIGN-ONLY | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8 … |  | C666003, C666026, C666027, C666029 | COVERED (picture: the case compares the screen with this board) |
| 638 | O | Credit Terms | DESIGN-ONLY | 2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9 … |  | C666003, C666026, C666027 | COVERED (picture: the case compares the screen with this board) |
| 639 | O | Credit Limit | DESIGN-ONLY | 2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9 … |  | C666003, C666026, C666027 | COVERED (picture: the case compares the screen with this board) |
| 644 | O | Taxes | DESIGN-ONLY | 2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9 … |  | C666003, C666026, C666027 | COVERED (picture: the case compares the screen with this board) |
| 645 | O | Default Tax Settings | DESIGN-ONLY | 2.1, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9 … |  | C666003, C666026, C666027 | COVERED (picture: the case compares the screen with this board) |
| 646 | O | (CD PO is required | DESIGN-ONLY | 2.1 |  | C666003 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 647 | O | New Customer | SAME | 2.2, 2.16, 2.17, 2.18 | C665939, C665940, C665941, C665990, C666003, C666026 … | C666003, C666029 | COVERED (wording) |
| 648 | O | Address 2 | DESIGN-ONLY | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8 … |  | C666003, C666026, C666027, C666029 | COVERED (picture: the case compares the screen with this board) |
| 654 | O | Default Labor Rate | DESIGN-ONLY | 2.3, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.12 … |  | C666026, C666027 | COVERED (picture: the case compares the screen with this board) |
| 655 | O | Default Shop Supplies | DESIGN-ONLY | 2.3, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.12 … |  | C666026, C666027 | COVERED (picture: the case compares the screen with this board) |
| 656 | O | Min | DESIGN-ONLY | 2.3, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.12 … |  | C666026, C666027 | COVERED (picture: the case compares the screen with this board) |
| 657 | O | Max | DESIGN-ONLY | 2.3, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.12 … |  | C666026, C666027 | COVERED (picture: the case compares the screen with this board) |
| 661 | O | (CD required | DESIGN-ONLY | 2.3, 2.4, 2.5, 2.6, 2.7 |  | C666026 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 662 | O | Pin notes? | DESIGN-ONLY | 2.3, 2.4, 2.5, 2.6, 2.7 |  | C666026 | COVERED (picture: the case compares the screen with this board) |
| 667 | O | Add representative | SAME | 2.6 | C665925, C665942, C666020, C666026 | C666026 | COVERED (wording) |
| 668 | O | . Sales Representative - Parts | SAME | 2.7 |  | C666026 | COVERED (picture: the case compares the screen with this board) |
| 669 | O | Sales Representative - Part Sales | SAME | 2.7, 2.9, 2.10, 2.12, 2.13, 2.14, 2.15, 2.17 … | C665941, C665942, C665943, C665944, C665945, C665947 … | C666026, C666027, C666028, C666029 | COVERED (wording) |
| 670 | O | Sales Representative - Service Labor | SAME | 2.8, 2.9, 2.10, 2.11, 2.12, 2.13 | C665939, C665941, C665942, C665943, C665944, C665945 … | C666027 | COVERED (wording) |
| 671 | O | Sales Representative - Service Parts | SAME | 2.8, 2.9, 2.10, 2.11, 2.12, 2.13 | C665939, C665941, C665942, C665943, C665944, C665945 … | C666027 | COVERED (wording) |
| 674 | O | Sales Representa | SAME | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … | C665915, C665916, C665917, C665918, C665919, C665920 … | C666003, C666004, C666014, C666017, C666018, C666019 | COVERED (wording) |
| 675 | O | art Sales | SAME | 2.0, 2.7, 2.9, 2.10, 2.11, 2.12, 2.13, 2.14 … | C665935, C665939, C665941, C665942, C665943, C665944 … | C666003, C666026, C666027, C666028, C666029, C666031 | COVERED (wording) |
| 680 | O | Remove Sales Representative - Service Parts | SAME | 2.13 | C665942, C665943, C666027, C666029 | C666027 | COVERED (wording) |
| 689 | O | 3 Status v | DESIGN-ONLY | 2.15 |  | C666028 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 691 | O | Number ~ Asset | DESIGN-ONLY | 2.15 |  | C666028 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 692 | O | Progress Lead Technician Lines | SAME | 2.15 |  | C666028 | COVERED (picture: the case compares the screen with this board) |
| 694 | O | In Progress ) | DESIGN-ONLY | 1.2, 1.4, 1.5, 1.6, 1.7, 1.8, 1.10, 1.11 … |  | C666017, C666018, C666019, C666020, C666021, C666022 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 699 | O | Paid ) | DESIGN-ONLY | 2.15, 4.6 |  | C666028, C666031 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 710 | O | Sales Representative - Service | SAME | 2.8, 2.9, 2.10, 2.11, 2.12, 2.13, 2.15 | C665939, C665941, C665942, C665943, C665944, C665945 … | C666027, C666028 | COVERED (wording) |
| 715 | O | Paid | DESIGN-ONLY | 2.15, 4.6, 4.11, 4.12 |  | C666028, C666031, C666032 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 789 | O | Ctrl | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666003, C666004, C666005, C666008, C666017, C666018 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 791 | O | Statistics | DESIGN-ONLY | 3.0, 3.1, 3.2, 3.3, 3.4 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 794 | O | Description | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666004, C666017, C666018, C666019, C666020, C666021 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 795 | O | PartNumber Quantity Cost | DESIGN-ONLY | 3.0, 3.1, 3.2, 3.3, 3.4 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 796 | O | Core | DESIGN-ONLY | 3.0, 3.1, 3.2, 3.3, 3.4 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 797 | O | Sell Price | DESIGN-ONLY | 3.0, 3.1, 3.2, 3.3, 3.4 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 798 | O | Category | DESIGN-ONLY | 3.0, 3.1, 3.2, 3.3, 3.4 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 799 | O | Vendor | DESIGN-ONLY | 3.0, 3.1, 3.2, 3.3, 3.4 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 800 | O | Part Nu.. | DESIGN-ONLY | 3.0 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 801 | O | Qua... | DESIGN-ONLY | 3.0, 3.1, 3.2, 3.3, 3.4 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 802 | O | Cost | DESIGN-ONLY | 3.0, 3.1, 3.2, 3.3, 3.4 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 803 | O | Core C... | DESIGN-ONLY | 3.0 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 804 | O | Sell Pr... | DESIGN-ONLY | 3.0, 3.1, 3.2, 3.3, 3.4 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 815 | O | Inventory | DESIGN-ONLY | 3.0, 3.1, 3.2, 3.3, 3.4, 4.0, 4.1, 4.2 … |  | C666005, C666008, C666030, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 828 | O | Add Asset | DESIGN-ONLY | 3.0, 3.1, 3.2, 3.3, 3.4 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 845 | O | Financial Info | DESIGN-ONLY | 3.0, 3.1, 3.2, 3.3, 3.4 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 846 | O | Item | DESIGN-ONLY | 3.0, 3.1, 3.2, 3.3, 3.4 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 848 | O | Subtotal | DESIGN-ONLY | 3.0, 3.1, 3.2, 3.3, 3.4, 4.0, 4.3, 4.4 … |  | C666005, C666008, C666030, C666031, C666032, C666033 | COVERED (picture: the case compares the screen with this board) |
| 849 | O | GST | DESIGN-ONLY | 3.0, 3.1, 3.2, 3.3, 3.4 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 852 | O | Balance | DESIGN-ONLY | 3.0, 3.1, 3.2, 3.3, 3.4 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 853 | O | Clock In | DESIGN-ONLY | 3.1, 3.2, 3.3, 3.4, 6.0, 6.1, 6.2, 6.3 … |  | C666014, C666030, C666034 | COVERED (picture: the case compares the screen with this board) |
| 857 | O | Requested At Status | DESIGN-ONLY | 3.1, 3.2, 3.3, 3.4 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 870 | O | (In Stock | DESIGN-ONLY | 3.1, 3.2, 3.4 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 881 | O | 0) Clock In | DESIGN-ONLY | 3.2 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 889 | O | Add Part | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666004, C666017, C666018, C666019, C666020, C666021 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 897 | O | ShopHub ~» | DESIGN-ONLY | 3.4 |  | C666030 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 899 | O | Q_ Search customers, work ... | DESIGN-ONLY | 6.0, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7 |  | C666014, C666034 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 900 | O | Hide Details | DESIGN-ONLY | 6.0, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7 |  | C666014, C666034 | COVERED (picture: the case compares the screen with this board) |
| 912 | O | E Pinned Notes: | DESIGN-ONLY | 6.4 |  | C666034 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 915 | O | Search customers, work orders, ... | DESIGN-ONLY | 1.2, 1.3, 1.5, 1.6, 1.8, 1.10, 1.11, 1.14 … |  | C666003, C666005, C666008, C666017, C666018, C666020 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 916 | O | Sales By Customer | SAME | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … | C665986, C665987, C665988, C665998, C665999, C666000 … | C666005, C666008, C666031, C666033 | COVERED (wording) |
| 919 | O | LABOR | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666033 | COVERED (picture: the case compares the screen with this board) |
| 920 | O | 6 Date: This month v | DESIGN-ONLY | 4.1, 4.2, 5.0 |  | C666005, C666008 | COVERED (picture: the case compares the screen with this board) |
| 922 | O | © Timesheet Activities | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 923 | O | Product Type: All products ® | SAME | 4.1, 5.0 |  | C666005, C666008 | COVERED (picture: the case compares the screen with this board) |
| 925 | O | 2 selected | DESIGN-ONLY | 4.1, 5.0, 5.2 |  | C666005, C666008, C666033 | COVERED (picture: the case compares the screen with this board) |
| 926 | O | nvoiced Labor Margin | SAME | 4.2, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 5.0 |  | C666005, C666008, C666031 | COVERED (picture: the case compares the screen with this board) |
| 927 | O | Shop Supplies | SAME | 2.3, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.12 … | C665962, C665963, C665964, C665965, C665966, C665967 … | C666005, C666008, C666026, C666027, C666031, C666032 | COVERED (wording) |
| 928 | O | PERFORMANCE | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666033 | COVERED (picture: the case compares the screen with this board) |
| 929 | O | Customer « | DESIGN-ONLY | 5.0, 5.1, 5.2 |  | C666008, C666033 | COVERED (picture: the case compares the screen with this board) |
| 930 | O | pa Select all | DESIGN-ONLY | 5.0 |  | C666008 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 931 | O | Parts Invoiced Parts Margin | SAME | 4.1, 4.2, 4.4, 4.5, 4.6, 4.8, 4.11, 5.0 |  | C666005, C666008, C666031, C666032 | COVERED (picture: the case compares the screen with this board) |
| 932 | O | Adjustments | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.4, 4.7, 4.8, 4.9, 4.11 … |  | C666005, C666008, C666031, C666032 | COVERED (picture: the case compares the screen with this board) |
| 933 | O | Margin % | SAME | 4.2, 4.8, 4.9, 4.11, 4.12, 5.0 | C665971 | C666005, C666008, C666031, C666032 | COVERED (wording) |
| 934 | O | B Sales | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 935 | O | Technician Efficiency | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 936 | O | Services | DESIGN-ONLY | 1.2, 1.3, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10 … |  | C666005, C666008, C666017, C666018, C666020, C666021 | COVERED (picture: the case compares the screen with this board) |
| 937 | O | Advisor Analysis | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 938 | O | Shop Efficiency | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 939 | O | Clear selection | DESIGN-ONLY | 4.1, 4.6, 5.0, 5.2 | C665998 | C666005, C666008, C666031, C666033 | COVERED (wording) |
| 940 | O | Work In Progress | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 941 | O | Technician Utilization | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 942 | O | No record matches these filters | DESIGN-ONLY | 4.1, 4.2, 5.0 |  | C666005, C666008 | COVERED (picture: the case compares the screen with this board) |
| 943 | O | Try changing filters to widen your results. | DESIGN-ONLY | 4.1, 4.2, 5.0 |  | C666005, C666008 | COVERED (picture: the case compares the screen with this board) |
| 944 | O | & Sales By Representative | SAME | 4.1, 4.2, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9 … |  | C666005, C666008, C666031, C666033 | COVERED (picture: the case compares the screen with this board) |
| 945 | O | PARTS | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666033 | COVERED (picture: the case compares the screen with this board) |
| 946 | O | Parts Velocity | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 947 | O | ® Inventory Value | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 948 | O | FINANCE | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666033 | COVERED (picture: the case compares the screen with this board) |
| 949 | O | @ Sales Tax Collected | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 950 | O | ACCOUNTS RECEIVABLE | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 951 | O | BG AJR Aging Summary | DESIGN-ONLY | 4.1, 4.2, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 952 | O | E AJR Aging Detail | DESIGN-ONLY | 4.1, 4.2, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 953 | O | AJR Aging Collection | DESIGN-ONLY | 4.1, 4.2, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 954 | O | ACCOUNTS PAYABLE | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 955 | O | B Aging Summary | DESIGN-ONLY | 4.1, 4.2, 4.5, 4.6, 4.8, 4.9, 4.10, 5.0 |  | C666005, C666008, C666031 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 956 | O | E AJP Aging Detail | DESIGN-ONLY | 4.1, 4.2, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9 … |  | C666005, C666008, C666031 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 957 | O | (8 A/P Unpaid Invoices | DESIGN-ONLY | 4.1, 4.2, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9 … |  | C666005, C666008, C666031 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 958 | O | ACCOUNTING | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666033 | COVERED (picture: the case compares the screen with this board) |
| 959 | O | @ IBS Batches | DESIGN-ONLY | 4.1, 4.2, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 960 | O | A QB Unexported | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 961 | O | % Export Reports | DESIGN-ONLY | 4.1, 4.2, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10 … |  | C666005, C666008, C666031 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 963 | O | Date: Last 12 months v | DESIGN-ONLY | 4.0, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9 … |  | C666005, C666031, C666033 | COVERED (picture: the case compares the screen with this board) |
| 964 | O | Sales Type: AllSales v | SAME | 5.1 |  | C666033 | COVERED (picture: the case compares the screen with this board) |
| 965 | O | Customer: All customers v | DESIGN-ONLY | 5.1, 5.2 |  | C666033 | COVERED (picture: the case compares the screen with this board) |
| 966 | O | Labor Delta | SAME | 4.0, 4.2, 4.3, 4.4, 4.5, 4.7, 4.8, 4.9 … | C665962, C665963, C665992 | C666005, C666031, C666032, C666033 | COVERED (wording) |
| 967 | O | Labor Invoiced | SAME | 4.0, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8 … | C665962, C665963, C665964, C665969, C665971, C665992 … | C666005, C666031, C666032, C666033 | COVERED (wording) |
| 968 | O | Labor Margin | SAME | 4.0, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8 … | C665962, C665963, C665971, C665992 | C666005, C666008, C666031, C666032, C666033 | COVERED (wording) |
| 969 | O | Parts Invoiced | SAME | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … | C665962, C665964, C665969, C665992, C665993, C666016 | C666005, C666008, C666031, C666032, C666033 | COVERED (wording) |
| 970 | O | Parts Margin | SAME | 4.0, 4.1, 4.2, 4.4, 4.5, 4.6, 4.7, 4.8 … | C665962, C665971, C665992, C666016, C666031 | C666005, C666008, C666031, C666032, C666033 | COVERED (wording) |
| 971 | O | Adjust: | DESIGN-ONLY | 5.1, 5.2 |  | C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1021 | O | @ Parts Velocity | DESIGN-ONLY | 4.0, 4.3, 5.1, 5.2 |  | C666005, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1042 | O | G AJR Aging Summary | DESIGN-ONLY | 4.1, 4.2, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1051 | O | (B AIR Aging Collection | DESIGN-ONLY | 5.1 |  | C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1068 | O | G ASP Aging Summary | DESIGN-ONLY | 5.1, 5.2 |  | C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1069 | O | —& AJP Aging Detail | DESIGN-ONLY | 5.1 |  | C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1073 | O | (@ Unpaid Invoices | DESIGN-ONLY | 5.1 |  | C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1096 | O | Export Reports | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1097 | O | Totals | DESIGN-ONLY | 4.0, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9 … |  | C666005, C666031, C666032, C666033 | COVERED (picture: the case compares the screen with this board) |
| 1105 | O | Sales Type: AllSales © | SAME | 5.2 |  | C666033 | COVERED (picture: the case compares the screen with this board) |
| 1106 | O | Select all | DESIGN-ONLY | 4.1, 4.6, 5.0, 5.2 |  | C666005, C666008, C666031, C666033 | COVERED (picture: the case compares the screen with this board) |
| 1107 | O | abor Delta | SAME | 4.0, 4.2, 4.3, 4.4, 4.5, 4.7, 4.8, 4.9 … | C665962, C665963, C665992 | C666005, C666031, C666032, C666033 | COVERED (wording) |
| 1109 | O | Service Sales | SAME | 5.2 | C665986, C665987, C665988, C665998, C665999, C666001 … | C666033 | COVERED (wording) |
| 1112 | O | BG ASP Aging Summary | DESIGN-ONLY | 5.2 |  | C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1113 | O | E AIP Aging Detail | DESIGN-ONLY | 5.2 |  | C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1114 | O | A/P Unpaid Invoices | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1118 | O | Sales By Representative | SAME | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … | C665934, C665948, C665951, C665954, C665955, C665956 … | C666005, C666008, C666031, C666032, C666033 | COVERED (wording) |
| 1120 | O | & Product Type: All products v | SAME | 4.0, 4.3 |  | C666005 | COVERED (picture: the case compares the screen with this board) |
| 1121 | O | & Invoice Status: All statuses v | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666031 | COVERED (picture: the case compares the screen with this board) |
| 1122 | O | & Show Unassigned | SAME | 4.0, 4.1, 4.2, 4.4, 4.5, 4.6, 4.7, 4.8 … |  | C666005, C666031 | COVERED (picture: the case compares the screen with this board) |
| 1123 | O | Status Labor Delta | SAME | 4.0, 4.2, 4.4 |  | C666005, C666031 | COVERED (picture: the case compares the screen with this board) |
| 1124 | O | Invoice | DESIGN-ONLY | 2.0, 2.15, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5 … |  | C666003, C666005, C666008, C666028, C666031, C666032 | COVERED (picture: the case compares the screen with this board) |
| 1125 | O | Customer | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … |  | C666003, C666004, C666005, C666008, C666017, C666018 | COVERED (picture: the case compares the screen with this board) |
| 1126 | O | Unassigned (1570) | SAME | 4.0, 4.3 |  | C666005 | COVERED (picture: the case compares the screen with this board) |
| 1129 | O | % Technician Efficiency | DESIGN-ONLY | 4.0, 4.3, 4.4, 4.5, 4.7, 4.8, 4.10 |  | C666005, C666031 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1131 | O | &? Shop Efficiency | DESIGN-ONLY | 4.0, 4.3, 4.4, 4.5, 4.7, 4.8, 4.10 |  | C666005, C666031 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1132 | O | © Work In Progress | DESIGN-ONLY | 4.0, 4.3, 4.4, 4.5, 4.7, 4.8, 4.10 |  | C666005, C666031 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1133 | O | 22. Technician Utilization | DESIGN-ONLY | 4.0, 4.3 |  | C666005 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1134 | O | 22: Sales By Customer | SAME | 4.0, 4.3, 4.4, 4.5, 4.7, 4.8, 4.10 |  | C666005, C666031 | COVERED (picture: the case compares the screen with this board) |
| 1135 | O | PARTS. | DESIGN-ONLY | 4.0, 4.3 |  | C666005 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1136 | O | G A/R Aging Summary | DESIGN-ONLY | 4.0, 4.3 |  | C666005 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1137 | O | AYR Aging Detail | DESIGN-ONLY | 4.0 |  | C666005 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1138 | O | (B A/R Aging Collection | DESIGN-ONLY | 4.0, 4.3 |  | C666005 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1139 | O | G A/P Aging Summary | DESIGN-ONLY | 4.0, 4.3 |  | C666005 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1140 | O | E A/P Aging Detail | DESIGN-ONLY | 4.0 |  | C666005 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1141 | O | (B A/P Unpaid Invoices | DESIGN-ONLY | 4.0, 4.3 |  | C666005 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1142 | O | /BS Batches | DESIGN-ONLY | 4.0, 4.3 |  | C666005 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1143 | O | §& Invoice Status: All statuses v | DESIGN-ONLY | 4.1, 4.2, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9 … |  | C666005, C666031 | COVERED (picture: the case compares the screen with this board) |
| 1144 | O | Status Labe | DESIGN-ONLY | 4.1 |  | C666005 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1145 | O | ibor Margin | DESIGN-ONLY | 4.1 |  | C666005 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1146 | O | @& Sales By Representative | SAME | 4.1, 4.2, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9 … |  | C666005, C666031 | COVERED (picture: the case compares the screen with this board) |
| 1148 | O | > Product Type: All products v | SAME | 4.2 |  | C666005 | COVERED (picture: the case compares the screen with this board) |
| 1149 | O | © Location: Staging Heavy D.. Labor Delta | SAME | 4.2 |  | C666005 | COVERED (picture: the case compares the screen with this board) |
| 1150 | O | Labor Invoiced Labor Margin | SAME | 4.2, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10 |  | C666005, C666031 | COVERED (picture: the case compares the screen with this board) |
| 1151 | O | Show Unassigned | SAME | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … | C665934, C665951, C665956, C665962, C665963, C665964 … | C666005, C666031 | COVERED (wording) |
| 1195 | O | A/R Aging Detail | DESIGN-ONLY | 4.3 |  | C666005 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1210 | O | A/P Aging Detail | DESIGN-ONLY | 4.0, 4.3 |  | C666005 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1231 | O | Sales Type: All v | SAME | 4.4, 4.5, 4.8, 4.9, 4.10 |  | C666031 | COVERED (picture: the case compares the screen with this board) |
| 1257 | O | 22: Technician Utilization | DESIGN-ONLY | 4.4, 4.5, 4.7, 4.8, 4.10 |  | C666031 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1258 | O | B ASP Aging Summary | DESIGN-ONLY | 4.4, 4.7 |  | C666031 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1259 | O | Shop Suppli | SAME | 2.3, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.12 … | C665962, C665963, C665964, C665965, C665966, C665967 … | C666005, C666008, C666026, C666027, C666031, C666032 | COVERED (wording) |
| 1284 | O | Sales Type: All © | SAME | 4.6 |  | C666031 | COVERED (picture: the case compares the screen with this board) |
| 1285 | O | 3 selected | DESIGN-ONLY | 4.6 |  | C666031 | COVERED (picture: the case compares the screen with this board) |
| 1286 | O | delta | DESIGN-ONLY | 4.6 |  | C666031 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1289 | O | ( Partially Paid ) | DESIGN-ONLY | 4.6 |  | C666031 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1290 | O | Sales Type: Labor v | SAME | 4.7 |  | C666031 | COVERED (picture: the case compares the screen with this board) |
| 1291 | O | Status Sales Type Labor Delta | SAME | 4.7 |  | C666031 | COVERED (picture: the case compares the screen with this board) |
| 1298 | O | Sales Type | SAME | 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11 … | C665955, C665956, C665962, C665963, C665964, C665965 … | C666031, C666032, C666033 | COVERED (wording) |
| 1299 | O | Labor, Parts | SAME | 4.9, 4.10, 4.11, 4.12 | C665962, C665969, C665972, C665984, C665991, C666001 … | C666031, C666032 | COVERED (wording) |
| 1300 | O | Sales By Representative - Expanded View (CSV), opened as a spreadsheet | DESIGN-ONLY | 4.11 |  | C666032 | COVERED (picture: the case compares the screen with this board) |
| 1302 | O | Sales Type: All | SAME | 4.4, 4.5, 4.6, 4.8, 4.9, 4.10, 4.11, 4.12 … | C665984, C665985, C665986, C665987, C665998, C666001 … | C666031, C666032, C666033 | COVERED (wording) |
| 1303 | O | Invoice Status: All Statuses | DESIGN-ONLY | 4.11, 4.12 |  | C666032 | COVERED (picture: the case compares the screen with this board) |
| 1305 | O | Representative | DESIGN-ONLY | 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 … | C665915, C665916, C665917, C665918, C665919, C665920 … | C666003, C666004, C666005, C666008, C666014, C666017 | COVERED (wording) |
| 1306 | O | Invoice # | DESIGN-ONLY | 4.11, 4.12 |  | C666032 | COVERED (picture: the case compares the screen with this board) |
| 1307 | O | Hrs Worked Hrs Invoiced | SAME | 4.11 |  | C666032 | COVERED (picture: the case compares the screen with this board) |
| 1308 | O | Margin % Subtotal | DESIGN-ONLY | 4.11 |  | C666032 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1320 | O | Unpaid | DESIGN-ONLY | 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 … |  | C666005, C666008, C666031, C666032, C666033 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1323 | O | Partially Paid | DESIGN-ONLY | 4.6, 4.11, 4.12 |  | C666031, C666032 | EXISTING SCREEN TEXT, unchanged by this feature (seen on attached boards) |
| 1357 | O | Sales By Representative Report | DESIGN-ONLY | 4.12 |  | C666032 | COVERED (picture: the case compares the screen with this board) |
| 1361 | O | Hrs Worked | SAME | 4.11, 4.12 | C665962, C665963, C665992 | C666032 | COVERED (wording) |
| 1362 | O | Hrs Invoiced | SAME | 4.11, 4.12 | C665962, C665963, C665992, C665993 | C666032 | COVERED (wording) |

The 783 DATA rows (names, amounts, dates, ids, record text) are listed in `DESIGN-TO-CASES.json` with their boards.
