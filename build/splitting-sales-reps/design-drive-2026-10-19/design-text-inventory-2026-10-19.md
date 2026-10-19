# Design text inventory — Splitting Sales Representatives (19 Oct 2026)

Design: `sources/design-2026-10-19-upload/Splitting_Sales_Representatives.html` (Claude artifact 8MHqwyffAYtqZ6EccS5RUm). The design is IMAGE-ONLY: 68 boards, each one PNG screenshot, so the words were taken (1) from `canvas.json`, (2) by eye from every image, and (3) by OCR of every image as a completeness net. Compared against PRD Confluence 919928833 **v8** (14 Oct 2026). Built by `tools/build_text_inventory.py` from `tools/hand_transcription.json`; machine copy `design-text-inventory-2026-10-19.json`.

Classes: **SAME** (the PRD says it; code given) · **DESIGN-ONLY** (not in the PRD, no conflict) · **SPEC-CONFLICT** (differs from the PRD; both sides in DESIGN-REVIEW) · **DATA** (names, amounts, dates, ids, record text). OCR rows that are the same words as a hand-verified row inherit its class. **Unclassified: 0.**

## Counts

| Source | SAME | DESIGN-ONLY | SPEC-CONFLICT | DATA | Total |
|---|---|---|---|---|---|
| Canvas texts (page names, board titles, notes) from canvas.json | 62 | 85 | 1 | 0 | 148 |
| Hand-verified on-screen texts (read by eye from every board image) | 53 | 64 | 2 | 28 | 147 |
| Every distinct OCR line of the 68 board images | 77 | 243 | 0 | 755 | 1075 |
| **All rows** | **192** | **392** | **3** | **783** | **1370** |

OCR rows are noisy by nature (icons read as letters, clipped words); each one is still classified, and every feature-relevant word was confirmed by eye in section 2.

## 1 · Canvas texts (page names, board titles, notes) from canvas.json

| # | Text | Where | Class | PRD | Note |
|---|---|---|---|---|---|
| 1 | 1. Work order card: one rep, add, remove | canvas "6 pages" menu | DESIGN-ONLY |  | page name; PRD Stories cite "page 1/2/4/5/6"; page 3 (part sale) is cited by no story |
| 2 | 2. A customer's reps: Edit Customer and New Customer | canvas "6 pages" menu | DESIGN-ONLY |  | page name; PRD Stories cite "page 1/2/4/5/6"; page 3 (part sale) is cited by no story |
| 3 | 3. A part sale's rep | canvas "6 pages" menu | DESIGN-ONLY |  | page name; PRD Stories cite "page 1/2/4/5/6"; page 3 (part sale) is cited by no story |
| 4 | 4. Sales By Representative report | canvas "6 pages" menu | DESIGN-ONLY |  | page name; PRD Stories cite "page 1/2/4/5/6"; page 3 (part sale) is cited by no story |
| 5 | 5. Sales By Customer: the filter name | canvas "6 pages" menu | DESIGN-ONLY |  | page name; PRD Stories cite "page 1/2/4/5/6"; page 3 (part sale) is cited by no story |
| 6 | 6. On a phone | canvas "6 pages" menu | DESIGN-ONLY |  | page name; PRD Stories cite "page 1/2/4/5/6"; page 3 (part sale) is cited by no story |
| 7 | 1.0 Before: the card today | board title, page card | DESIGN-ONLY |  | artboard caption |
| 8 | 1.1 Before: picking the rep today | board title, page card | DESIGN-ONLY |  | artboard caption |
| 9 | 1.2 Nobody assigned, at rest | board title, page card | DESIGN-ONLY |  | artboard caption |
| 10 | 1.3 Hover: the box and the + | board title, page card | DESIGN-ONLY |  | artboard caption |
| 11 | 1.4 The list: Unassigned first | board title, page card | DESIGN-ONLY |  | artboard caption |
| 12 | 1.5 One rep picked, at rest | board title, page card | DESIGN-ONLY |  | artboard caption |
| 13 | 1.6 Hover: box, arrow and + | board title, page card | DESIGN-ONLY |  | artboard caption |
| 14 | 1.7 Hover the + | board title, page card | DESIGN-ONLY |  | artboard caption |
| 15 | 1.8 The + menu | board title, page card | DESIGN-ONLY |  | artboard caption |
| 16 | 1.9 Parts added: both rows copy Becky | board title, page card | DESIGN-ONLY |  | artboard caption |
| 17 | 1.10 Hover: two rows | board title, page card | DESIGN-ONLY |  | artboard caption |
| 18 | 1.11 Labor: pick who sold the labor | board title, page card | DESIGN-ONLY |  | artboard caption |
| 19 | 1.12 Two reps | board title, page card | DESIGN-ONLY |  | artboard caption |
| 20 | 1.13 Hover the remove x | board title, page card | DESIGN-ONLY |  | artboard caption |
| 21 | 1.14 Parts removed: the Labor person stays | board title, page card | DESIGN-ONLY |  | artboard caption |
| 22 | 1.15 Clearing: pick Unassigned | board title, page card | DESIGN-ONLY |  | artboard caption |
| 23 | 1.16 Cleared: Unassigned | board title, page card | DESIGN-ONLY |  | artboard caption |
| 24 | 1.17 After invoicing: read only | board title, page card | DESIGN-ONLY |  | artboard caption |
| 25 | 1.18 Before: the Work Order Log today | board title, page card | DESIGN-ONLY |  | artboard caption |
| 26 | 1.19 The log records every rep change | board title, page card | DESIGN-ONLY |  | artboard caption |
| 27 | 2.0 Before: the customer page today | board title, page customer | DESIGN-ONLY |  | artboard caption |
| 28 | 2.1 Before: Edit Customer today | board title, page customer | DESIGN-ONLY |  | artboard caption |
| 29 | 2.2 Before: New Customer today | board title, page customer | DESIGN-ONLY |  | artboard caption |
| 30 | 2.3 Edit Customer: one field and the + | board title, page customer | DESIGN-ONLY |  | artboard caption |
| 31 | 2.4 The list: Unassigned first | board title, page customer | DESIGN-ONLY |  | artboard caption |
| 32 | 2.5 One rep picked | board title, page customer | DESIGN-ONLY |  | artboard caption |
| 33 | 2.6 Hover the + | board title, page customer | DESIGN-ONLY |  | artboard caption |
| 34 | 2.7 The + menu: two options | board title, page customer | DESIGN-ONLY |  | artboard caption |
| 35 | 2.8 Service Parts added | board title, page customer | DESIGN-ONLY |  | artboard caption |
| 36 | 2.9 The + menu now offers Part Sales only | board title, page customer | DESIGN-ONLY |  | artboard caption |
| 37 | 2.10 Part Sales added: three rows | board title, page customer | DESIGN-ONLY |  | artboard caption |
| 38 | 2.11 The Part Sales list | board title, page customer | DESIGN-ONLY |  | artboard caption |
| 39 | 2.12 Three different people | board title, page customer | DESIGN-ONLY |  | artboard caption |
| 40 | 2.13 Hover the remove x | board title, page customer | DESIGN-ONLY |  | artboard caption |
| 41 | 2.14 Part Sales without Service Parts | board title, page customer | DESIGN-ONLY |  | artboard caption |
| 42 | 2.15 The customer page reads every row | board title, page customer | DESIGN-ONLY |  | artboard caption |
| 43 | 2.16 New Customer: the same field | board title, page customer | DESIGN-ONLY |  | artboard caption |
| 44 | 2.17 New Customer: the + menu | board title, page customer | DESIGN-ONLY |  | artboard caption |
| 45 | 2.18 New Customer with a Part Sales rep | board title, page customer | DESIGN-ONLY |  | artboard caption |
| 46 | 3.0 Before: a part sale today | board title, page partsale | DESIGN-ONLY |  | artboard caption |
| 47 | 3.1 The Sales Representative field | board title, page partsale | DESIGN-ONLY |  | artboard caption |
| 48 | 3.2 Hover | board title, page partsale | DESIGN-ONLY |  | artboard caption |
| 49 | 3.3 The list | board title, page partsale | DESIGN-ONLY |  | artboard caption |
| 50 | 3.4 A rep picked, hovered | board title, page partsale | DESIGN-ONLY |  | artboard caption |
| 51 | 4.0 Before: the report today | board title, page sbr | DESIGN-ONLY |  | artboard caption |
| 52 | 4.1 Before: the Product Type filter | board title, page sbr | DESIGN-ONLY |  | artboard caption |
| 53 | 4.2 Before: the column picker | board title, page sbr | DESIGN-ONLY |  | artboard caption |
| 54 | 4.3 Before: expanded | board title, page sbr | DESIGN-ONLY |  | artboard caption |
| 55 | 4.4 One row per rep | board title, page sbr | DESIGN-ONLY |  | artboard caption |
| 56 | 4.5 Expanded: Sales Type column off | board title, page sbr | DESIGN-ONLY |  | artboard caption |
| 57 | 4.6 The Sales Type filter | board title, page sbr | DESIGN-ONLY |  | artboard caption |
| 58 | 4.7 Labor only | board title, page sbr | DESIGN-ONLY |  | artboard caption |
| 59 | 4.8 The column picker | board title, page sbr | DESIGN-ONLY |  | artboard caption |
| 60 | 4.9 Sales Type switched on | board title, page sbr | DESIGN-ONLY |  | artboard caption |
| 61 | 4.10 Expanded with Sales Type | board title, page sbr | DESIGN-ONLY |  | artboard caption |
| 62 | 4.11 Expanded export (CSV) | board title, page sbr | DESIGN-ONLY |  | artboard caption |
| 63 | 4.12 Expanded export (PDF) | board title, page sbr | DESIGN-ONLY |  | artboard caption |
| 64 | 5.0 Before: "Product Type" | board title, page sbc | DESIGN-ONLY |  | artboard caption |
| 65 | 5.1 After: "Sales Type" | board title, page sbc | DESIGN-ONLY |  | artboard caption |
| 66 | 5.2 After: the filter open | board title, page sbc | DESIGN-ONLY |  | artboard caption |
| 67 | 6.0 Before: the details panel today | board title, page phone | DESIGN-ONLY |  | artboard caption |
| 68 | 6.1 Before: picking the rep today | board title, page phone | DESIGN-ONLY |  | artboard caption |
| 69 | 6.2 The field on a phone | board title, page phone | DESIGN-ONLY |  | artboard caption |
| 70 | 6.3 Tap: the list | board title, page phone | DESIGN-ONLY |  | artboard caption |
| 71 | 6.4 One rep picked | board title, page phone | DESIGN-ONLY |  | artboard caption |
| 72 | 6.5 Tap the + | board title, page phone | DESIGN-ONLY |  | artboard caption |
| 73 | 6.6 Parts added | board title, page phone | DESIGN-ONLY |  | artboard caption |
| 74 | 6.7 Parts list on a phone | board title, page phone | DESIGN-ONLY |  | artboard caption |
| 75 | Production today. One Sales Representative field under Service Advisor. /  / Measured gaps: Lead Technician to Service Advisor 36px; Service Advisor to Sales Representative 16px. | canvas note card-note-0 | SAME | S1-R6 context note | production 36px LT→SA, 16px SA→SR |
| 76 | Production today. A plain list: Unassigned, then every active sales representative. | canvas note card-note-1 | DESIGN-ONLY |  | production list |
| 77 | Plain text, like Lead Technician and Service Advisor: "Sales Representative", reading "Unassigned". No box and no buttons at rest. /  / Measured gaps: 16px, 16px. /  / Lead Technician reads blank here on first load; production does the same (board 1.0). It is not part of this project. | canvas note card-note-2 | SAME | S1-R2/S1-R3/S1-R6/S1-R7 |  |
| 78 | Hovering the rep row shows the field box with its dropdown arrow, and the grey + beside it. | canvas note card-note-3 | SAME | S1-R4/S2-R1 |  |
| 79 | "Unassigned" is the first option, checked when nobody is picked, then every active sales representative. | canvas note card-note-4 | SAME | S1-R8/S1-R9 |  |
| 80 | Becky Gonzales is the Sales Representative, shown as plain text. She gets credit for the whole job: labor, parts and shop supplies. | canvas note card-note-5 | SAME | S1-R13 |  |
| 81 | With a person in the field, hovering shows the same box and arrow, and the + beside the row. To clear it, pick "Unassigned" from the list (decision 69). | canvas note card-note-6 | SAME | S1-R4/S1-R10 | cites decision 69 |
| 82 | Tooltip: "Add representative". | canvas note card-note-7 | SAME | S2-R3 |  |
| 83 | The menu lists the one row a work order can add: "Sales Representative - Parts". | canvas note card-note-8 | SAME | S2-R4 |  |
| 84 | Two rows, "Sales Representative - Labor" and "Sales Representative - Parts", both reading Becky Gonzales: the added row starts with the person the work order already credits (decision 65), so adding it alone moves no credit. No list opens on its own. /  / Labels show in full. Measured gaps: 16px, 16px, 16px. | canvas note card-note-9 | SAME | S2-R5/S2-R6/S2-R7/S2-R14/S1-R6 | cites decision 65 |
| 85 | Both boxes show at once, each with its arrow. With Labor and Parts showing, the arrow sits on the name line in the bottom corner (decision 70). The + is gone (nothing left to add); the Parts row has a grey x beside it that removes the row. | canvas note card-note-10 | SAME | S1-R4/S1-R11/S2-R8/S2-R10 | cites decision 70 |
| 86 | With Labor and Parts showing, the arrow sits on the name line in the bottom corner (decision 70). Each row has the same list: Unassigned first, then the reps. A person already on the other row is not hidden (decision 67). | canvas note card-note-11 | SAME | S1-R11/S2-R11 | cites decisions 67, 70; "a person already on the other row is not hidden" is implied by S1-R8, not stated |
| 87 | Daniel Montoya sold the labor, Becky Gonzales the parts. On the invoice and in Sales By Representative, each gets only their own side; shop supplies ride with Labor. | canvas note card-note-12 | SAME | S2-R13/S5-R4 |  |
| 88 | Tooltip: "Remove Sales Representative - Parts". With Labor and Parts showing, the arrow sits on the name line in the bottom corner (decision 70). | canvas note card-note-13 | SAME | S2-R9/S1-R11 |  |
| 89 | Removing the Parts row leaves the Labor person, Daniel Montoya, as the one Sales Representative for the whole job (decision 66). Becky is not put back. | canvas note card-note-14 | SAME | S2-R16 | cites decision 66 |
| 90 | To clear the field, open its list and pick "Unassigned", the first option (decision 69). Daniel Montoya is checked as the current rep. | canvas note card-note-15 | SAME | S1-R10 | cites decision 69 |
| 91 | After picking Unassigned the field reads "Unassigned": nobody gets credit for this work order unless the customer fallback applies at invoicing. | canvas note card-note-16 | SAME | S1-R7/S4-R17 |  |
| 92 | Invoiced work order S2-17540 with two reps. The rows are plain text: "Sales Representative - Labor" Daniel Montoya, "Sales Representative - Parts" Becky Gonzales. Measured gaps: 16px, 16px, 16px (decision 47). /  / Hovering the rows changes nothing: no box, no arrow, no + and no remove x (checked in the browser: zero buttons on the card; the hovered screenshot is identical to this one). | canvas note card-note-17 | SAME | S2-R17/S1-R6 | cites decision 47 |
| 93 | Production today. A rep change does not appear in the log. | canvas note card-note-18 | DESIGN-ONLY |  | production log |
| 94 | Each change is a "Sales representative changed" entry with who, when, and before → after. Adding Parts: "Becky Gonzales → Becky Gonzales (Parts) · Becky Gonzales (Labor)". Removing it: "Becky Gonzales (Parts) · Daniel Montoya (Labor) → Daniel Montoya". Clearing: "Daniel Montoya → Unassigned". (Test entries from building this canvas fill the list.) | canvas note card-note-19 | SAME | S7-R1/S7-R2/S7-R3 |  |
| 95 | WORK ORDER CARD: ONE REP, ADD, REMOVE /  / Read left to right. Boards marked Before are production today. Every other board is the build, on work order S2-17528 (invoiced S2-17540 for the read-only boards). /  / One "Sales Representative" field. At rest the rows are plain text. Hovering the rep rows shows every field's box and dropdown arrow, and the buttons beside the rows: a + beside the first row (tooltip "Add representative") and an x beside an added row (tooltip "Remove Sales Representative - Parts"). /  / Buttons: the design system's Tertiary button, small icon-only size, 32px square, 8px corners, grey Lucide icon, light fill on hover. /  / Spacing rule (decision 47): the vertical gap between Lead Technician, Service Advisor and every Sales Representative field is 16px, one field or two. Measured on these boards: 16px every time. Production today has 36px between Lead Technician and Service Advisor. /  / To clear a field, pick "Unassigned", first in every list; it is the only way to clear (decision 69). | canvas note card-intro | SAME | S1-R4/S2-R1/S2-R2/S2-R3/S2-R9/S1-R6/S1-R10 | cites decisions 47, 69 |
| 96 | Production today. One Sales Representative, or N/A. | canvas note customer-note-0 | SAME | S4-E1 |  |
| 97 | Production today. One Sales Representative dropdown. | canvas note customer-note-1 | DESIGN-ONLY |  | production |
| 98 | Production today. New Customer has no Sales Representative field. | canvas note customer-note-2 | SAME | Release day (S4-R1) |  |
| 99 | One outlined "Sales Representative" field reading "Unassigned", with the + beside it. | canvas note customer-note-3 | SAME | S4-R1/S4-R5 |  |
| 100 | Unassigned, then the reps. | canvas note customer-note-4 | SAME | S4-R3 | the image under it is not in A–Z order (C2) |
| 101 | Christian Wallace is the customer's one rep: Service Labor, Service Parts and Part Sales all go to him. To clear it, pick "Unassigned" from the list (decision 69). | canvas note customer-note-5 | SAME | S4-R17/S4-R26/S4-R10 | cites decision 69 |
| 102 | Tooltip: "Add representative". | canvas note customer-note-6 | SAME | S4-R5 |  |
| 103 | "Sales Representative - Service Parts" and "Sales Representative - Part Sales". | canvas note customer-note-7 | SAME | S4-R6 |  |
| 104 | The first field is renamed "Sales Representative - Service Labor". The new "Sales Representative - Service Parts" row starts with the same person (Christian Wallace), so adding it alone moves no credit, and its list does not open on its own. It has a remove x beside it. | canvas note customer-note-8 | SAME | S4-R7/S4-R15/S4-R10 |  |
| 105 | Service Parts is already added, so the menu lists only "Sales Representative - Part Sales". | canvas note customer-note-9 | SAME | S4-R6 |  |
| 106 | Service Labor, Service Parts and Part Sales; Service Parts and Part Sales each have a remove x. The + is gone: nothing left to add. Part Sales also starts with the person already credited. | canvas note customer-note-10 | SAME | S4-R6/S4-R8/S4-R10 |  |
| 107 | Jason Garrison is picked for Service Parts. The Part Sales list is the same as every other: Unassigned first, then the reps. No "Same as Service Parts" option. | canvas note customer-note-11 | SAME | S4-R3/S4-R14 |  |
| 108 | Christian Wallace for Service Labor, Jason Garrison for Service Parts, Dylan Rush for Part Sales. | canvas note customer-note-12 | SAME | S4-R9 |  |
| 109 | Tooltip: "Remove Sales Representative - Service Parts". | canvas note customer-note-13 | SAME | S4-R10 |  |
| 110 | Service Parts removed: the Service Labor person (Christian Wallace) is the one "Sales Representative" again, and Part Sales keeps its own row (Dylan Rush). A customer can have its own Part Sales rep without splitting service. The + is back, offering Service Parts. /  / Removing the Part Sales row puts part sales back on the Service Parts person (or the one rep). | canvas note customer-note-14 | SAME | S4-R11/S4-R12 |  |
| 111 | Service Parts added back (Jason Garrison) and saved. The customer page shows the same rows as the window, as plain text: Service Labor Christian Wallace, Service Parts Jason Garrison, Part Sales Dylan Rush. | canvas note customer-note-15 | SAME | S4-R19/S4-R16 |  |
| 112 | Decision 34: New Customer gets the same optional Sales Representative field and +, in the same spot as on Edit Customer. | canvas note customer-note-16 | SAME | S4-R1 | cites decision 34 |
| 113 | The same two options as Edit Customer. (A name is typed so the window shows no required-field message.) | canvas note customer-note-17 | SAME | S4-R6 |  |
| 114 | Part Sales added on its own: "Sales Representative" and "Sales Representative - Part Sales", with its remove x. Same rows and rules as Edit Customer. | canvas note customer-note-18 | SAME | S4-R8/S4-R10 |  |
| 115 | A CUSTOMER'S REPS: EDIT CUSTOMER AND NEW CUSTOMER /  / The customer's reps are the defaults for its new work orders and part sales. Read left to right. /  / Boards marked Before are production today. Every other board is the build, on Gonsoulin Diesel Services Inc. /  / In the customer window the fields are outlined like every other field, and the + and remove x always show (no hover needed). The + menu offers "Sales Representative - Service Parts" and "Sales Representative - Part Sales", each only until it is added. There is no "Same as Service Parts" option. /  / Test data note: this local copy is anonymized, so the customer window lists the reps by their login names (Christian Wallace, Jason Garrison, Dylan Rush) while the work order card shows their staff names. Production uses one name per person. | canvas note customer-intro | SAME | S4-R4/S4-R6/S4-R24..26 | test-data note: names in the customer window are login names, the card shows staff names |
| 116 | Production today. The part sale card has no Sales Representative field. | canvas note partsale-note-0 | DESIGN-ONLY |  | production |
| 117 | One "Sales Representative" field on the part sale card, plain text at rest, the full width of the card. The part sale field belongs to Part Sales Update v1 (SV-10266) and looks exactly as that feature builds it; Split Representatives changes nothing about it (decision 71). No + button, no remove x. | canvas note partsale-note-1 | SAME | S2-N2 context note | cites decision 71 |
| 118 | Part Sales Update v1's own hover box and arrow, the full width of the card. | canvas note partsale-note-2 | SAME | S2-N2 context note |  |
| 119 | Part Sales Update v1's list, unchanged by this project. The rep on the part sale when it is invoiced gets the credit. | canvas note partsale-note-3 | SAME | S5-R9/S2-N2 |  |
| 120 | Gerald Ortiz picked. The same field, still no + button and no remove x. | canvas note partsale-note-4 | SAME | S2-N2 |  |
| 121 | A PART SALE'S REP /  / The part sale field belongs to Part Sales Update v1 (SV-10266) and looks exactly as that feature builds it; Split Representatives changes nothing about it (decision 71). No + button, no remove x. /  / A part sale has one Sales Representative. Read left to right. Board 3.0 is production today. Boards 3.1 to 3.4 are the build, on part sale P2-204. | canvas note partsale-intro | SAME | S2-N2 context note | cites decision 71 |
| 122 | Production today. A "Product Type" filter. Each invoice is credited whole to its one rep. | canvas note sbr-note-0 | DESIGN-ONLY |  | production |
| 123 | Production today. Part Sales or Service Sales. | canvas note sbr-note-1 | DESIGN-ONLY |  | note says production options are "Part Sales or Service Sales"; the image 4.1 shows "Parts" and "Services" (note and image disagree) |
| 124 | Production today. No Sales Type column. | canvas note sbr-note-2 | DESIGN-ONLY |  | production |
| 125 | Production today. One row per invoice under each rep. | canvas note sbr-note-3 | DESIGN-ONLY |  | production |
| 126 | The filter is now "Sales Type". Devon 3 invoices, $1,314.68; Elliot 3 invoices, $2,788.81; total $4,103.49. A split invoice counts once for each rep who sold part of it; the totals do not change because of a split. | canvas note sbr-note-4 | SAME | S8-R1/S5-R13/S5-R14 |  |
| 127 | Decision 40: the Sales Type column is off by default on screen. S1-12 appears under both reps: Devon with its parts, Elliot with its labor and shop supplies. A side a rep did not sell shows a dash. | canvas note sbr-note-5 | SAME | S5-R21/S5-R15 | cites decision 40; the image shows $0.0… in Shop Supplies on the Parts row (C1) |
| 128 | Labor, Parts and Part Sales, all on by default. Rows and every total follow it; any combination works. | canvas note sbr-note-6 | SAME | S8-R1/S8-R2 |  |
| 129 | "Sales Type: Labor" keeps only the labor side of each work order. (The Sales Type column is switched on in this board, from board 4.9.) | canvas note sbr-note-7 | SAME | S5-R12 |  |
| 130 | Sales Type is the first entry, off by default. | canvas note sbr-note-8 | SAME | S5-R20/S5-R21 |  |
| 131 | Switching it on adds the column next to Status. | canvas note sbr-note-9 | SAME | S5-R19 |  |
| 132 | Values: Labor, Parts and Part Sales. One rep with both sides of one work order shows as one row reading "Labor, Parts" (S1-32, decision 38). S1-12: Devon "Parts" ($266.18), Elliot "Labor" ($2,186.82), shop supplies ($175.50) with Labor (decision 37). /  / At 1600px wide, the columns after Parts Margin scroll under the pinned Subtotal; production behaves the same. | canvas note sbr-note-10 | SAME | S5-R10/S5-R19/S5-R4 | cites decisions 37, 38; pinned-Subtotal scrolling is DESIGN-ONLY |
| 133 | Downloaded with the Sales Type column switched off on screen: the file still has Sales Type (decision 40). An empty side is a blank cell. (Shown as a spreadsheet would open it.) | canvas note sbr-note-11 | SAME | S5-R23 | cites decision 40 |
| 134 | The PDF always has the Sales Type column. An empty side shows a dash. Header lines name the filters, including "Sales Type: All". | canvas note sbr-note-12 | SAME | S5-R23/S8-R4 | the PDF image shows $0.00 Shop Supplies on the Parts row (C1) |
| 135 | SALES BY REPRESENTATIVE REPORT /  / Each rep is credited only for the side they sold. Read left to right. /  / Boards marked Before are production today (Staging Heavy Duty data). Every other board is the build, Last 12 months: S1-12 split (Devon Parts, Elliot Labor), S1-32 Devon alone, and part sales P1-9006, P1-4 and P1-9005. | canvas note sbr-intro | SAME | Story 5 |  |
| 136 | Production today: "Product Type: All products", options Part Sales and Service Sales. | canvas note sbc-note-0 | DESIGN-ONLY |  | note says production options are "Part Sales and Service Sales"; image 5.0 shows "Parts" and "Services" (note and image disagree) |
| 137 | "Sales Type: All Sales", same options (Part Sales, Service Sales) and same behavior. Sales By Customer keeps whole invoices; it does not split by rep. | canvas note sbc-note-1 | SAME | S8-R6/S8-R7/S8-R10 | "same options ... same behavior" vs image 5.0 option wording (Q6) |
| 138 | The filter open. Options read Part Sales and Service Sales; with both selected it reads Sales Type: All Sales (S8-R6 to S8-R8). /  / At 1600px wide, Adjustments and Margin scroll under the pinned Subtotal; the report behaves the same way on Sales By Representative (board 4.10). | canvas note sbc-note-2 | SAME | S8-R7/S8-R8 |  |
| 139 | SALES BY CUSTOMER: THE FILTER NAME /  / Only the filter's wording changes, to match Sales By Representative. Board 5.0 is production today; 5.1 and 5.2 are the build (Staging Heavy Duty data, Date: Last 12 months). | canvas note sbc-intro | SAME | S8-R6 |  |
| 140 | Production today. On a phone the work order card sits behind the details panel. | canvas note phone-note-0 | DESIGN-ONLY |  | production |
| 141 | Production today. The same one-person list as on a computer. | canvas note phone-note-1 | DESIGN-ONLY |  | production |
| 142 | "Sales Representative" reading "Unassigned", with the + always showing beside it. | canvas note phone-note-2 | SAME | S3-R2 | the image shows no dropdown arrow at rest (C3) |
| 143 | The native dropdown, the same as Lead Technician: Unassigned first, then the reps. | canvas note phone-note-3 | SAME | S3-R1 |  |
| 144 | Becky Gonzales. The + shows without any hover. | canvas note phone-note-4 | SAME | S3-R2 |  |
| 145 | The menu: "Sales Representative - Parts". | canvas note phone-note-5 | SAME | S2-R4/S3-R2 |  |
| 146 | "Sales Representative - Labor" and "Sales Representative - Parts", both Becky; labels in full; the Parts row has its remove x, always showing. At rest the rows read as plain text. | canvas note phone-note-6 | SPEC-CONFLICT | S3-R4 | "At rest the rows read as plain text" vs S3-R4 "the Sales Representative fields always show their dropdown arrow" (C3) |
| 147 | The same list per row. With Labor and Parts showing, the arrow sits on the name line in the bottom corner (decision 70). | canvas note phone-note-7 | SAME | S1-R11/S3-R1 |  |
| 148 | ON A PHONE /  / The same field and the same rules on a 390px-wide touch screen. Read left to right. /  / Boards 6.0 and 6.1 are production today; 6.2 to 6.7 are the build, on S2-17528. /  / There is no hover on a phone, so the + and remove x always show. To clear a field, pick "Unassigned" from its list (decision 69). Tapping a field opens the native dropdown, like Lead Technician (decision 48). | canvas note phone-intro | SAME | S3-R1/S3-R2/S3-R3 | cites decisions 48, 69 |

## 2 · Hand-verified on-screen texts (read by eye from every board image)

| # | Text | Where | Class | PRD | Note |
|---|---|---|---|---|---|
| 1 | Lead Technician | p1 boards 1.0–1.16, card, 1st field label | SAME | S1-R2 | label above the name; same left edge (x=37) as Service Advisor and Sales Representative |
| 2 | Service Advisor | p1 boards 1.0–1.16, card, 2nd field label | SAME | S1-R1/S1-R2 |  |
| 3 | Sales Representative | p1 boards 1.0–1.8, 1.14–1.16, card, field label under Service Advisor | SAME | S1-R1/S1-R2 |  |
| 4 | Unassigned | p1 1.2, 1.3, 1.4, 1.16 field value; first option in 1.4, 1.11, 1.15 | SAME | S1-R7/S1-R8/S1-R9 | checked (tick + blue text + light blue row) when nobody is picked (1.4) |
| 5 | Becky Gonzales | p1 list option / field value / Service Advisor value | DATA | S1-R8 | list order Becky, Daniel, Gerald = A–Z by first name |
| 6 | Daniel Montoya | p1 list option / field value | DATA | S1-R8 |  |
| 7 | Gerald Ortiz | p1 list option; p3 picked rep | DATA | S1-R8 |  |
| 8 | Debra Garcia | p1 1.0/1.1 production value and option; p6 6.0/6.1 | DATA |  | production data |
| 9 | Michele Reed | p1 1.1 and p6 6.1 production list option | DATA |  | production data |
| 10 | Add representative | p1 1.7 tooltip under the +; p2 2.6 | SAME | S2-R3/S4-R5 | dark grey tooltip, white text, centred under the + (WO card), 14px below it |
| 11 | Sales Representative - Parts | p1 1.8 + menu option; p6 6.5 | SAME | S2-R4 | menu opens below the +, right edge aligned with the + button |
| 12 | Sales Representative - Labor | p1 1.9–1.13 and 1.17 field label; p6 6.6/6.7 | SAME | S2-R5 |  |
| 13 | Sales Representative - Parts | p1 1.9–1.13 and 1.17 second field label; p6 6.6/6.7 | SAME | S2-R5 |  |
| 14 | Remove Sales Representative - Parts | p1 1.13 tooltip under the remove x | SAME | S2-R9 |  |
| 15 | Lead technician | p1 1.17 read-only (invoiced) card label, lower-case t | DESIGN-ONLY | S2-R17 | existing read-only card wording; the editable card says 'Lead Technician'. PRD only requires the SR labels keep their wording |
| 16 | Service advisor | p1 1.17 read-only card label, lower-case a | DESIGN-ONLY | S2-R17 | existing read-only card wording |
| 17 | S2-17528 | p1 build work order | DATA |  |  |
| 18 | S2-17540 | p1 1.17 invoiced work order | DATA |  |  |
| 19 | S2-17435 | p1 1.0/1.1/1.18 production work order | DATA |  |  |
| 20 | Work Order Log | p1 1.18/1.19 dialog title | DESIGN-ONLY |  | PRD Story 7 says the log opens from 'Audit Log' in the work order menu; the dialog title is not in the PRD |
| 21 | Search | p1 1.18/1.19 log search; many screens | DESIGN-ONLY |  |  |
| 22 | Event | p1 1.18/1.19 log column | DESIGN-ONLY |  |  |
| 23 | User | p1 1.18/1.19 log column | DESIGN-ONLY |  |  |
| 24 | Line | p1 1.18/1.19 log column | DESIGN-ONLY |  |  |
| 25 | Details | p1 1.18/1.19 log column | DESIGN-ONLY |  |  |
| 26 | Date | log column; report columns | DESIGN-ONLY |  |  |
| 27 | Time | p1 log column | DESIGN-ONLY |  |  |
| 28 | Sales representative changed | p1 1.19 log Event | SAME | S7-R1 |  |
| 29 | Sales Representative: Daniel Montoya → Unassigned | p1 1.19 log Details | SAME | S7-R2 | label 'Sales Representative' in bold |
| 30 | Sales Representative: Becky Gonzales (Parts) · Daniel Montoya (Labor) → Daniel Montoya | p1 1.19 log Details | SAME | S7-R2/S7-R3 | Parts first |
| 31 | Sales Representative: Becky Gonzales (Parts) · Becky Gonzales (Labor) → Becky Gonzales (Parts) · Daniel Montoya (Labor) | p1 1.19 log Details | SAME | S7-R3 |  |
| 32 | Sales Representative: Becky Gonzales → Becky Gonzales (Parts) · Becky Gonzales (Labor) | p1 1.19 log Details (adding the Parts field) | SAME | S7-R1/S7-R3 |  |
| 33 | Sales Representative: Unassigned → Becky Gonzales | p1 1.19 log Details | SAME | S7-R2 |  |
| 34 | Sales Representative: Becky Gonzales (Parts) · Unassigned (Labor) → Unassigned | p1 1.19 log Details | SAME | S7-R3/S2-R16 |  |
| 35 | Sales Representative: Unassigned (Parts) · Unassigned (Labor) → Becky Gonzales (Parts) · Unassigned (Labor) | p1 1.19 log Details | SAME | S7-R3 |  |
| 36 | Sales Representative: Unassigned → Unassigned (Parts) · Unassigned (Labor) | p1 1.19 log Details (adding Parts to an empty field) | SAME | S7-R1 | an entry is written although nobody's credit changes; S7-R1 says adding the Parts field writes one entry |
| 37 | Admin ShopView | p1 1.19 log User | DATA |  |  |
| 38 | Line created | p1 1.18 production log | DESIGN-ONLY |  |  |
| 39 | Line authorized | p1 1.18 production log | DESIGN-ONLY |  |  |
| 40 | Line authorization required | p1 1.18 production log | DESIGN-ONLY |  |  |
| 41 | Created | p1 1.18 production log | DESIGN-ONLY |  |  |
| 42 | Status: Authorization Required → Authorized | p1 1.18 production log | DESIGN-ONLY |  |  |
| 43 | N/A | p2 2.0 customer page, Sales Representative value (production) | SAME | S4-E1/S4-R19 | today's wording, replaced by 'Unassigned' |
| 44 | Edit Customer | p2 2.1, 2.3–2.14 window title | SAME | S4-R1 |  |
| 45 | New Customer | p2 2.2, 2.16–2.18 window title; Customers list button | SAME | S4-R1 |  |
| 46 | Sales Representative | p2 Edit/New Customer outlined field label; customer page label | SAME | S4-R1/S4-R19 | outlined like every other field; narrower so the + sits in the window's right column |
| 47 | Unassigned | p2 2.3 field value; first option in 2.4/2.11; customer page value (2.3 background) | SAME | S4-R3/S4-R19 |  |
| 48 | Dylan Rush | p2 2.4 and 2.11 list option 2 | DATA | S4-R3 | list order Dylan Rush, Christian Wallace, Jason Garrison is NOT A–Z by first name (see SPEC-CONFLICT C2) |
| 49 | Christian Wallace | p2 list option 3; one rep 2.5; Service Labor | DATA | S4-R3 |  |
| 50 | Jason Garrison | p2 list option 4; Service Parts in 2.11–2.15 | DATA | S4-R3 |  |
| 51 | Krystal Davis | p2 2.1 production list | DATA |  | production list has no 'Unassigned' option |
| 52 | Lindsay Perez | p2 2.1 production list | DATA |  |  |
| 53 | Sales Representative - Service Parts | p2 2.7/2.17 + menu option 1; 2.8–2.13 field label; 2.15 customer page | SAME | S4-R6/S4-R7/S4-R19 |  |
| 54 | Sales Representative - Part Sales | p2 2.7/2.9/2.17 + menu option; 2.10–2.14, 2.18 field; 2.15 customer page | SAME | S4-R6/S4-R8/S4-R19 |  |
| 55 | Sales Representative - Service Labor | p2 2.8–2.13 first field label; 2.15 customer page (wraps over two lines) | SAME | S4-R7/S4-R19 |  |
| 56 | Remove Sales Representative - Service Parts | p2 2.13 tooltip under the remove x | SAME | S4-R10 | tooltip covers part of the Part Sales row below it |
| 57 | Gonsoulin Diesel Services Inc | p1 card customer; p2 build customer | DATA |  |  |
| 58 | 4 Star Truck Repair | p2 2.0/2.1 production customer | DATA |  |  |
| 59 | Northline Haulage | p2 2.17/2.18 typed customer name | DATA |  |  |
| 60 | Name * | p2 customer window field | DESIGN-ONLY |  |  |
| 61 | Phone | customer window / page | DESIGN-ONLY |  |  |
| 62 | Address 1 | customer window | DESIGN-ONLY |  |  |
| 63 | Address 2 | customer window | DESIGN-ONLY |  |  |
| 64 | City | customer window | DESIGN-ONLY |  |  |
| 65 | ZIP/Postal Code | customer window | DESIGN-ONLY |  |  |
| 66 | State/Province | customer window; customer list | DESIGN-ONLY |  |  |
| 67 | Country | customer window | DESIGN-ONLY |  |  |
| 68 | Credit Terms | Edit Customer | DESIGN-ONLY |  |  |
| 69 | Credit Limit | Edit Customer | DESIGN-ONLY |  |  |
| 70 | Default Labor Rate | Edit Customer | DESIGN-ONLY |  |  |
| 71 | Default Shop Supplies | Edit Customer | DESIGN-ONLY |  |  |
| 72 | Min | Edit Customer | DESIGN-ONLY |  |  |
| 73 | Max | Edit Customer | DESIGN-ONLY |  |  |
| 74 | Notes | customer window/page | DESIGN-ONLY |  |  |
| 75 | Website | customer window/page | DESIGN-ONLY |  |  |
| 76 | IBS | customer window/page | DESIGN-ONLY |  |  |
| 77 | Taxes | Edit Customer | DESIGN-ONLY |  |  |
| 78 | Default Tax Settings | Edit Customer | DESIGN-ONLY |  |  |
| 79 | PO is required | Edit Customer | DESIGN-ONLY |  |  |
| 80 | Pin notes? | Edit Customer | DESIGN-ONLY |  |  |
| 81 | Save | New Customer button; part sale Add Asset | DESIGN-ONLY |  |  |
| 82 | Empty bays, endless possibilities. Get Going! | p2 2.0 customer page empty work order list | DESIGN-ONLY |  |  |
| 83 | Sales Representative | p3 3.1–3.4 part sale card field (full card width, no +, no x) | SAME | S2-N2 | belongs to Part Sales Update v1 (SV-10266) |
| 84 | P2-204 | p3 build part sale | DATA |  |  |
| 85 | P2-84 | p3 3.0 production part sale | DATA |  |  |
| 86 | Sales By Representative | p4 report title; Reports menu | SAME | Story 5/8 |  |
| 87 | Product Type: All products | p4 4.0–4.3 and p5 5.0 production filter chip | SAME | S8-R6 / Release day | today's label, replaced by Sales Type |
| 88 | Parts | p4 4.1 and p5 5.0 production filter option | DESIGN-ONLY |  | production option wording; build boards read 'Parts' (SBR, a side) and 'Part Sales' (SBC) |
| 89 | Services | p4 4.1 and p5 5.0 production filter option | DESIGN-ONLY |  | production option wording; build SBC reads 'Service Sales' (S8-R7) |
| 90 | Sales Type: All | p4 4.4–4.6, 4.8–4.10 filter chip; CSV/PDF filter line | SAME | S8-R3/S8-R4 |  |
| 91 | Sales Type: Labor | p4 4.7 filter chip | SAME | S8-R3 |  |
| 92 | Labor | p4 4.6 filter option 1; Sales Type cell | SAME | S8-R1/S5-R3 |  |
| 93 | Parts | p4 4.6 filter option 2; Sales Type cell | SAME | S8-R1/S5-R3 |  |
| 94 | Part Sales | p4 4.6 filter option 3; Sales Type cell; p5 option 1 | SAME | S8-R1/S5-R3/S8-R7 |  |
| 95 | Labor, Parts | p4 4.10, CSV, PDF Sales Type cell (S1-32) | SAME | S5-R10/S5-R19 |  |
| 96 | Sales Type | p4 column header after Status (4.7, 4.9, 4.10); column picker first entry (4.8, 4.9); CSV/PDF column | SAME | S5-R19/S5-R20/S5-R23 |  |
| 97 | Select all | p4 4.1/4.6 and p5 filter menu | DESIGN-ONLY |  |  |
| 98 | 3 selected | p4 4.6 filter menu | DESIGN-ONLY |  |  |
| 99 | 2 selected | p4 4.1, p5 5.0/5.2 filter menu | DESIGN-ONLY |  |  |
| 100 | Clear selection | filter menus | DESIGN-ONLY |  |  |
| 101 | Column Selection | p4 4.2/4.8 tooltip of the column button | DESIGN-ONLY | S5-R20 | the tooltip covers the first entry's switch (4.8: the Sales Type switch, whose OFF state the board is meant to show) |
| 102 | No record matches these filters | p4 4.1/4.2, p5 5.0 empty state | DESIGN-ONLY | S8-R5 | empty state wording (PRD: 'shows its empty state') |
| 103 | Try changing filters to widen your results. | p4/p5 empty state | DESIGN-ONLY | S8-R5 |  |
| 104 | Show Unassigned | p4 filter chip (on in 4.0/4.3, off in 4.4–4.10) | SAME | S5-R14/S5-R18 |  |
| 105 | Unassigned (1570) | p4 4.0/4.3 production rep row | SAME | S5-R18 |  |
| 106 | Devon Whitfield (3) | p4 rep summary row | DATA |  |  |
| 107 | Elliot Brennan (3) | p4 rep summary row | DATA |  |  |
| 108 | Date: Last 12 months | p4/p5 date chip | DESIGN-ONLY |  |  |
| 109 | Date: This month | p4 4.1/4.2, p5 5.0 | DESIGN-ONLY |  |  |
| 110 | Invoice Status: All statuses | p4 filter chip | DESIGN-ONLY |  |  |
| 111 | Location: QA Testing | p4 build filter chip | DATA |  |  |
| 112 | Location: Staging Heavy D... | p4/p5 production chip | DATA |  |  |
| 113 | Invoice | p4 column | DESIGN-ONLY |  |  |
| 114 | Customer | p4/p5 column | DESIGN-ONLY |  |  |
| 115 | Status | p4 column (Sales Type sits after it) | SAME | S5-R19 |  |
| 116 | Labor Delta | p4 column / picker | SAME | S5-R4 | PRD names it among the Labor row's figures |
| 117 | Labor Invoiced | p4 column / picker | SAME | S5-R4 |  |
| 118 | Labor Margin | p4 column / picker | SAME | S5-R4 |  |
| 119 | Parts Invoiced | p4 column / picker | SAME | S5-R5 |  |
| 120 | Parts Margin | p4 column / picker | SAME | S5-R5 |  |
| 121 | Shop Supplies | p4 column / picker | SAME | S5-R4/S5-R15 |  |
| 122 | Adjustments | p4 column / picker | DESIGN-ONLY |  | PRD speaks of 'fees and discounts' and 'whole-invoice amounts', not this column name |
| 123 | Margin | p4 column / picker | DESIGN-ONLY |  |  |
| 124 | Margin % | p4 picker / CSV / PDF | SAME | S5-R17 |  |
| 125 | Subtotal | p4 column (pinned right) | DESIGN-ONLY |  |  |
| 126 | Totals | p4/p5 totals row | DESIGN-ONLY | S5-R14 |  |
| 127 | Hrs Worked | p4 CSV/PDF column | SAME | S5-R4 |  |
| 128 | Hrs Invoiced | p4 CSV/PDF column | SAME | S5-R4 |  |
| 129 | — | p4 screen and PDF cells of the side a row is not credited with | SAME | S5-R15/S5-R23 | em dash |
| 130 | $0.00 (shown clipped as '$0.(') in Shop Supplies of Devon's S1-12 Parts row | p4 4.5 screen; 4.11 CSV '0.00'; 4.12 PDF '$0.00' | SPEC-CONFLICT | S5-R15/S5-R23 | PRD: on a Parts row Shop Supplies shows a dash (screen, PDF) / blank (CSV), not $0.00 |
| 131 | $0.00 in Shop Supplies of the part sale rows P1-9006, P1-4, P1-9005 | p4 4.5/4.10 screen (clipped), 4.11 CSV '0.00', 4.12 PDF '$0.00' | SPEC-CONFLICT | S5-R15a | PRD: a dash when the part sale has none (unless $0.00 counts as a real zero; PO question) |
| 132 | Sales By Representative - Expanded View (CSV), opened as a spreadsheet | p4 4.11 caption | DESIGN-ONLY |  | design caption, not product text |
| 133 | Date Range: Nov 1, 2025 - Oct 9, 2026 | p4 4.11/4.12 export filter line | DATA | S8-R4 |  |
| 134 | Invoice Status: All Statuses | p4 export filter line | DESIGN-ONLY | S8-R4 |  |
| 135 | Locations: QA Testing | p4 export filter line | DATA |  |  |
| 136 | Representative | p4 CSV/PDF first column | DESIGN-ONLY |  |  |
| 137 | Invoice # | p4 CSV/PDF column | DESIGN-ONLY |  |  |
| 138 | Sales By Representative Report | p4 4.12 PDF title | DESIGN-ONLY |  |  |
| 139 | Demo company | p4 4.12 PDF company line | DATA |  |  |
| 140 | QA Testing | p4 PDF line; account name | DATA |  |  |
| 141 | Sep 29 2026 | p4 4.11/4.12 export date of S1-32 and S1-12 (screen shows Sep 28 2026) | DATA |  | screen and export dates differ by one day for the same invoices (PO question Q7) |
| 142 | Sales By Customer | p5 report title; Reports menu | SAME | Story 8 |  |
| 143 | Sales Type: All Sales | p5 5.1/5.2 filter chip | SAME | S8-R8 |  |
| 144 | Service Sales | p5 5.2 filter option 2 | SAME | S8-R7 |  |
| 145 | Customer: All customers | p5 filter chip | DESIGN-ONLY |  |  |
| 146 | Hide Details | p6 all boards, details panel toggle | DESIGN-ONLY | S3-R6 | PRD speaks of the card opening collapsed and expanding with its edit button; no board shows the collapsed card |
| 147 | Clock In | header, all screens | DESIGN-ONLY |  |  |

## 3 · Every distinct OCR line of the 68 board images

| # | Text | Where | Class | PRD | Note |
|---|---|---|---|---|---|
| 1 | & Product Type: All products v | OCR · 2 board(s): sbr-00-b-sbr, sbr-03-b-sbr-expanded | SAME | S8-R6 / Release day | same text as hand-verified row "Product Type: All products" |
| 2 | & Sales By Representative | OCR · 3 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open | SAME | Story 5/8 | same text as hand-verified row "Sales By Representative" |
| 3 | & Show Unassigned | OCR · 10 board(s): sbr-00-b-sbr, sbr-01-b-sbr-filter, sbr-02-b-sbr-columns, sbr-04-a4-sbr-c… | SAME | S5-R14/S5-R18 | same text as hand-verified row "Show Unassigned" |
| 4 | (Labor) | OCR · 2 board(s): card-19-n1-audit | SAME | S7-R3 | fragment of a log entry naming both sides |
| 5 | (Parts) - Becky Gonzales (Labor) > Becky | OCR · 2 board(s): card-19-n1-audit | SAME | S7-R3 | fragment of a log entry naming both sides |
| 6 | (Parts) - Daniel Montoya (Labor) > Daniel | OCR · 2 board(s): card-19-n1-audit | SAME | S7-R3 | fragment of a log entry naming both sides |
| 7 | (Parts) - Unassigned (Labor) | OCR · 1 board(s): card-19-n1-audit | SAME | S7-R3 | fragment of a log entry naming both sides |
| 8 | (Parts) - Unassigned (Labor) > Unassigned | OCR · 1 board(s): card-19-n1-audit | SAME | S7-R3 | fragment of a log entry naming both sides |
| 9 | - Unassigned (Labor) > Becky Gonzales | OCR · 1 board(s): card-19-n1-audit | SAME | S7-R3 | fragment of a log entry naming both sides |
| 10 | . Sales Representative - Parts | OCR · 1 board(s): customer-07-n2-add-menu | SAME | S2-R4 | same text as hand-verified row "Sales Representative - Parts" |
| 11 | 22: Sales By Customer | OCR · 7 board(s): sbr-00-b-sbr, sbr-03-b-sbr-expanded, sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded… | SAME | Story 8 | same text as hand-verified row "Sales By Customer" |
| 12 | > Product Type: All products v | OCR · 1 board(s): sbr-02-b-sbr-columns | SAME | S8-R6 / Release day | same text as hand-verified row "Product Type: All products" |
| 13 | @& Sales By Representative | OCR · 9 board(s): sbr-01-b-sbr-filter, sbr-02-b-sbr-columns, sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded… | SAME | Story 5/8 | same text as hand-verified row "Sales By Representative" |
| 14 | Add representative | OCR · 1 board(s): customer-06-n2-add-tip | SAME | S2-R3/S4-R5 | same text as hand-verified row "Add representative" |
| 15 | Becky Gonzales (Parts) - Becky Gonzales | OCR · 2 board(s): card-19-n1-audit | SAME | S7-R3 | fragment of a log entry naming both sides |
| 16 | Edit Customer | OCR · 13 board(s): customer-01-b-customer-dialog-open, customer-03-n2-edit, customer-04-n2-edit-list, customer-05-n2-edit-picked… | SAME | S4-R1 | same text as hand-verified row "Edit Customer" |
| 17 | Gonzales (Parts) - Daniel Montoya (Labor) | OCR · 1 board(s): card-19-n1-audit | SAME | S7-R3 | fragment of a log entry naming both sides |
| 18 | Hrs Invoiced | OCR · 1 board(s): sbr-12-a4-export-pdf-crop-1 | SAME | S5-R4 | same text as hand-verified row "Hrs Invoiced" |
| 19 | Hrs Worked | OCR · 1 board(s): sbr-12-a4-export-pdf-crop-1 | SAME | S5-R4 | same text as hand-verified row "Hrs Worked" |
| 20 | Hrs Worked Hrs Invoiced | OCR · 1 board(s): sbr-11-a4-export-csv | SAME | S5-R4 | contains "Hrs Worked" |
| 21 | Labor | OCR · 75 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | SAME | S8-R1/S5-R3 | same text as hand-verified row "Labor" |
| 22 | Labor Delta | OCR · 10 board(s): sbc-01-n5-sbc, sbr-03-b-sbr-expanded, sbr-05-a4-sbr-expanded, sbr-08-a4-columns-off… | SAME | S5-R4 | same text as hand-verified row "Labor Delta" |
| 23 | Labor Invoiced | OCR · 10 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr, sbr-02-b-sbr-columns… | SAME | S5-R4 | same text as hand-verified row "Labor Invoiced" |
| 24 | Labor Invoiced Labor Margin | OCR · 7 board(s): sbr-02-b-sbr-columns, sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-07-a4-sbr-labor-only… | SAME | S5-R4 | contains "Labor Invoiced" |
| 25 | Labor Margin | OCR · 10 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr, sbr-02-b-sbr-columns… | SAME | S5-R4 | same text as hand-verified row "Labor Margin" |
| 26 | Labor, Parts | OCR · 4 board(s): sbr-09-a4-columns-on, sbr-10-a4-sbr-expanded-type, sbr-11-a4-export-csv, sbr-12-a4-export-pdf-crop-1 | SAME | S5-R10/S5-R19 | same text as hand-verified row "Labor, Parts" |
| 27 | Lead Technician | OCR · 25 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | SAME | S1-R2 | same text as hand-verified row "Lead Technician" |
| 28 | Margin % | OCR · 5 board(s): sbc-00-b-sbc-filter, sbr-02-b-sbr-columns, sbr-08-a4-columns-off, sbr-09-a4-columns-on… | SAME | S5-R17 | same text as hand-verified row "Margin %" |
| 29 | N/A | OCR · 4 board(s): customer-00-b-customer-page, customer-15-n2-page-three | SAME | S4-E1/S4-R19 | same text as hand-verified row "N/A" |
| 30 | New Customer | OCR · 4 board(s): customer-02-b-new, customer-16-n2-new, customer-17-n2-new-menu, customer-18-n2-new-ps | SAME | S4-R1 | same text as hand-verified row "New Customer" |
| 31 | Part Sales | OCR · 14 board(s): customer-00-b-customer-page, sbr-06-a4-filter-open, sbr-09-a4-columns-on, sbr-10-a4-sbr-expanded-type… | SAME | S8-R1/S5-R3/S8-R7 | same text as hand-verified row "Part Sales" |
| 32 | Parts Invoiced | OCR · 11 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr, sbr-02-b-sbr-columns… | SAME | S5-R5 | same text as hand-verified row "Parts Invoiced" |
| 33 | Parts Invoiced Parts Margin | OCR · 8 board(s): sbc-00-b-sbc-filter, sbr-01-b-sbr-filter, sbr-02-b-sbr-columns, sbr-04-a4-sbr-c… | SAME | S5-R5 | contains "Parts Invoiced" |
| 34 | Parts Margin | OCR · 9 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr, sbr-02-b-sbr-columns… | SAME | S5-R5 | same text as hand-verified row "Parts Margin" |
| 35 | Product Type: All products ® | OCR · 2 board(s): sbc-00-b-sbc-filter, sbr-01-b-sbr-filter | SAME | S8-R6 / Release day | same text as hand-verified row "Product Type: All products" |
| 36 | Progress Lead Technician | OCR · 1 board(s): customer-00-b-customer-page | SAME | S1-R2 | contains "Lead Technician" |
| 37 | Progress Lead Technician Lines | OCR · 1 board(s): customer-15-n2-page-three | SAME | S1-R2 | contains "Lead Technician" |
| 38 | Remove Sales Representative - Service Parts | OCR · 1 board(s): customer-13-n2-remove-tip | SAME | S4-R10 | same text as hand-verified row "Remove Sales Representative - Service Parts" |
| 39 | Sales By Customer | OCR · 10 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-01-b-sbr-filter… | SAME | Story 8 | same text as hand-verified row "Sales By Customer" |
| 40 | Sales By Representative | OCR · 13 board(s): sbr-00-b-sbr, sbr-01-b-sbr-filter, sbr-02-b-sbr-columns, sbr-03-b-sbr-expanded… | SAME | Story 5/8 | same text as hand-verified row "Sales By Representative" |
| 41 | Sales Representa | OCR · 1 board(s): customer-11-n2-ps-list | SAME | S1-R1/S1-R2 | same text as hand-verified row "Sales Representative" |
| 42 | Sales Representative | OCR · 32 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | SAME | S1-R1/S1-R2 | same text as hand-verified row "Sales Representative" |
| 43 | Sales Representative - Labor | OCR · 8 board(s): card-09-n1-added, card-10-n1-added-hover, card-11-n1-labor-list, card-12-n1-two… | SAME | S2-R5 | same text as hand-verified row "Sales Representative - Labor" |
| 44 | Sales Representative - Part Sales | OCR · 9 board(s): customer-07-n2-add-menu, customer-09-n2-add-menu-2, customer-10-n2-three-added, customer-12-n2-three… | SAME | S4-R6/S4-R8/S4-R19 | same text as hand-verified row "Sales Representative - Part Sales" |
| 45 | Sales Representative - Parts | OCR · 10 board(s): card-08-n1-add-menu, card-09-n1-added, card-10-n1-added-hover, card-12-n1-two… | SAME | S2-R4 | same text as hand-verified row "Sales Representative - Parts" |
| 46 | Sales Representative - Service | OCR · 2 board(s): customer-15-n2-page-three | SAME | S4-R6/S4-R7/S4-R19 | same text as hand-verified row "Sales Representative - Service Parts" |
| 47 | Sales Representative - Service Labor | OCR · 6 board(s): customer-08-n2-service-parts, customer-09-n2-add-menu-2, customer-10-n2-three-added, customer-11-n2-ps-list… | SAME | S4-R7/S4-R19 | same text as hand-verified row "Sales Representative - Service Labor" |
| 48 | Sales Representative - Service Parts | OCR · 6 board(s): customer-08-n2-service-parts, customer-09-n2-add-menu-2, customer-10-n2-three-added, customer-11-n2-ps-list… | SAME | S4-R6/S4-R7/S4-R19 | same text as hand-verified row "Sales Representative - Service Parts" |
| 49 | Sales Representative: Becky Gonzales | OCR · 5 board(s): card-19-n1-audit | SAME | S7-R2/S7-R3 | contains "Sales Representative:" |
| 50 | Sales Representative: Becky Gonzales > | OCR · 3 board(s): card-19-n1-audit | SAME | S7-R2/S7-R3 | contains "Sales Representative:" |
| 51 | Sales Representative: Daniel Montoya > | OCR · 2 board(s): card-19-n1-audit | SAME | S7-R2/S7-R3 | contains "Sales Representative:" |
| 52 | Sales Representative: Unassigned (Parts) | OCR · 1 board(s): card-19-n1-audit | SAME | S7-R3 | fragment of a log entry naming both sides |
| 53 | Sales Representative: Unassigned > | OCR · 3 board(s): card-19-n1-audit | SAME | S7-R2/S7-R3 | contains "Sales Representative:" |
| 54 | Sales Type | OCR · 5 board(s): sbr-09-a4-columns-on, sbr-10-a4-sbr-expanded-type, sbr-11-a4-export-csv, sbr-12-a4-export-pdf-crop-1 | SAME | S5-R19/S5-R20/S5-R23 | same text as hand-verified row "Sales Type" |
| 55 | Sales Type: All | OCR · 2 board(s): sbr-11-a4-export-csv, sbr-12-a4-export-pdf-crop-1 | SAME | S8-R3/S8-R4 | same text as hand-verified row "Sales Type: All" |
| 56 | Sales Type: All v | OCR · 5 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-08-a4-columns-off, sbr-09-a4-columns-on… | SAME | S8-R3/S8-R4 | same text as hand-verified row "Sales Type: All" |
| 57 | Sales Type: All © | OCR · 1 board(s): sbr-06-a4-filter-open | SAME | S8-R3/S8-R4 | same text as hand-verified row "Sales Type: All" |
| 58 | Sales Type: AllSales v | OCR · 1 board(s): sbc-01-n5-sbc | SAME | S8-R8 | same text as hand-verified row "Sales Type: All Sales" |
| 59 | Sales Type: AllSales © | OCR · 1 board(s): sbc-02-n5-sbc-open | SAME | S8-R8 | same text as hand-verified row "Sales Type: All Sales" |
| 60 | Sales Type: Labor v | OCR · 1 board(s): sbr-07-a4-sbr-labor-only | SAME | S8-R3 | same text as hand-verified row "Sales Type: Labor" |
| 61 | Sales representative changed | OCR · 14 board(s): card-19-n1-audit | SAME | S7-R1 | same text as hand-verified row "Sales representative changed" |
| 62 | Service Advisor | OCR · 25 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | SAME | S1-R1/S1-R2 | same text as hand-verified row "Service Advisor" |
| 63 | Service Sales | OCR · 1 board(s): sbc-02-n5-sbc-open | SAME | S8-R7 | same text as hand-verified row "Service Sales" |
| 64 | Shop Suppli | OCR · 2 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open | SAME | S5-R4/S5-R15 | same text as hand-verified row "Shop Supplies" |
| 65 | Shop Supplies | OCR · 13 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr… | SAME | S5-R4/S5-R15 | same text as hand-verified row "Shop Supplies" |
| 66 | Show Unassigned | OCR · 1 board(s): sbr-03-b-sbr-expanded | SAME | S5-R14/S5-R18 | same text as hand-verified row "Show Unassigned" |
| 67 | Status | OCR · 27 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | SAME | S5-R19 | same text as hand-verified row "Status" |
| 68 | Status Labor Delta | OCR · 3 board(s): sbr-00-b-sbr, sbr-02-b-sbr-columns, sbr-04-a4-sbr-c | SAME | S5-R4 | contains "Labor Delta" |
| 69 | Status Sales Type Labor Delta | OCR · 1 board(s): sbr-07-a4-sbr-labor-only | SAME | S5-R19/S8-R1 | contains "Sales Type" |
| 70 | Unassigned | OCR · 104 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | SAME | S1-R7/S1-R8/S1-R9 | same text as hand-verified row "Unassigned" |
| 71 | Unassigned (1570) | OCR · 2 board(s): sbr-00-b-sbr, sbr-03-b-sbr-expanded | SAME | S5-R18 | same text as hand-verified row "Unassigned (1570)" |
| 72 | Unassigned (Parts) - Unassigned (Labor) | OCR · 1 board(s): card-19-n1-audit | SAME | S7-R3 | fragment of a log entry naming both sides |
| 73 | abor Delta | OCR · 1 board(s): sbc-02-n5-sbc-open | SAME | S5-R4 | same text as hand-verified row "Labor Delta" |
| 74 | art Sales | OCR · 1 board(s): customer-11-n2-ps-list | SAME | S8-R1/S5-R3/S8-R7 | same text as hand-verified row "Part Sales" |
| 75 | nvoiced Labor Margin | OCR · 1 board(s): sbc-00-b-sbc-filter | SAME | S5-R4 | contains "Labor Margin" |
| 76 | v Unassigned | OCR · 5 board(s): card-01-b-wo-open, card-04-n1-list, customer-04-n2-edit-list, partsale-03-n3-list… | SAME | S1-R7/S1-R8/S1-R9 | same text as hand-verified row "Unassigned" |
| 77 | © Location: Staging Heavy D.. Labor Delta | OCR · 1 board(s): sbr-02-b-sbr-columns | SAME | S5-R4 | contains "Labor Delta" |
| 78 | % Export Reports | OCR · 9 board(s): sbc-00-b-sbc-filter, sbr-01-b-sbr-filter, sbr-02-b-sbr-columns, sbr-05-a4-sbr-expanded… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 79 | % Technician Efficiency | OCR · 7 board(s): sbr-00-b-sbr, sbr-03-b-sbr-expanded, sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 80 | & Invoice Status: All statuses v | OCR · 2 board(s): sbr-00-b-sbr, sbr-03-b-sbr-expanded | DESIGN-ONLY |  | same text as hand-verified row "Invoice Status: All statuses" |
| 81 | &? Shop Efficiency | OCR · 7 board(s): sbr-00-b-sbr, sbr-03-b-sbr-expanded, sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 82 | ( Auth To Order ) | OCR · 2 board(s): card-01-b-wo-open | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 83 | ( Needs Approval ) | OCR · 42 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 84 | ( Partially Paid ) | OCR · 1 board(s): sbr-06-a4-filter-open | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 85 | ( Requested ) | OCR · 12 board(s): card-04-n1-list, card-07-n1-add-tip, card-15-n1-unassign-list | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 86 | ( Requested }) | OCR · 4 board(s): card-11-n1-labor-list | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 87 | (8 A/P Unpaid Invoices | OCR · 10 board(s): sbc-00-b-sbc-filter, sbr-01-b-sbr-filter, sbr-02-b-sbr-columns, sbr-04-a4-sbr-c… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 88 | (@ Unpaid Invoices | OCR · 1 board(s): sbc-01-n5-sbc | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 89 | (Approved ) | OCR · 1 board(s): card-07-n1-add-tip | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 90 | (B A/P Unpaid Invoices | OCR · 2 board(s): sbr-00-b-sbr, sbr-03-b-sbr-expanded | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 91 | (B A/R Aging Collection | OCR · 2 board(s): sbr-00-b-sbr, sbr-03-b-sbr-expanded | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 92 | (B AIR Aging Collection | OCR · 1 board(s): sbc-01-n5-sbc | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 93 | (CD PO is required | OCR · 1 board(s): customer-01-b-customer-dialog-open | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 94 | (CD required | OCR · 5 board(s): customer-03-n2-edit, customer-04-n2-edit-list, customer-05-n2-edit-picked, customer-06-n2-add-tip… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 95 | (In Stock | OCR · 3 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-04-n3-picked-hover | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 96 | + Add Part | OCR · 68 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 97 | 0) Clock In | OCR · 1 board(s): partsale-02-n3-hover | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 98 | 2 selected | OCR · 3 board(s): sbc-00-b-sbc-filter, sbc-02-n5-sbc-open, sbr-01-b-sbr-filter | DESIGN-ONLY |  | same text as hand-verified row "2 selected" |
| 99 | 22. Technician Utilization | OCR · 2 board(s): sbr-00-b-sbr, sbr-03-b-sbr-expanded | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 100 | 22: Technician Utilization | OCR · 5 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-07-a4-sbr-labor-only, sbr-08-a4-columns-off… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 101 | 3 Status v | OCR · 1 board(s): customer-15-n2-page-three | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 102 | 3 selected | OCR · 1 board(s): sbr-06-a4-filter-open | DESIGN-ONLY |  | same text as hand-verified row "3 selected" |
| 103 | 3\¢ Status v | OCR · 1 board(s): customer-00-b-customer-page | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 104 | 6 Date: This month v | OCR · 3 board(s): sbc-00-b-sbc-filter, sbr-01-b-sbr-filter, sbr-02-b-sbr-columns | DESIGN-ONLY |  | same text as hand-verified row "Date: This month" |
| 105 | < Approved ) | OCR · 2 board(s): card-03-n1-hover, card-06-n1-picked-hover | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 106 | @ IBS Batches | OCR · 12 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-01-b-sbr-filter… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 107 | @ Parts Velocity | OCR · 4 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr, sbr-03-b-sbr-expanded | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 108 | @ Sales Tax Collected | OCR · 14 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 109 | A QB Unexported | OCR · 14 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 110 | A/P Aging Detail | OCR · 1 board(s): sbr-03-b-sbr-expanded | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 111 | A/P Unpaid Invoices | OCR · 1 board(s): sbc-02-n5-sbc-open | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 112 | A/R Aging Detail | OCR · 1 board(s): sbr-03-b-sbr-expanded | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 113 | ACCOUNTING | OCR · 14 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr… | DESIGN-ONLY |  | existing tab / Reports menu heading |
| 114 | ACCOUNTS PAYABLE | OCR · 14 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 115 | ACCOUNTS RECEIVABLE | OCR · 14 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 116 | AJR Aging Collection | OCR · 11 board(s): sbc-00-b-sbc-filter, sbc-02-n5-sbc-open, sbr-01-b-sbr-filter, sbr-02-b-sbr-columns… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 117 | AYR Aging Detail | OCR · 1 board(s): sbr-00-b-sbr | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 118 | Action | OCR · 18 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 119 | Actual/Estimate | OCR · 17 board(s): card-00-b-wo-rest2, card-02-n1-rest, card-03-n1-hover, card-04-n1-list… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 120 | Add Asset | OCR · 5 board(s): partsale-00-b-ps, partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 121 | Add Part | OCR · 1 board(s): partsale-03-n3-list | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 122 | Add tech story for this line | OCR · 10 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 123 | Address | OCR · 2 board(s): customer-00-b-customer-page, customer-15-n2-page-three | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 124 | Address 1 | OCR · 17 board(s): customer-01-b-customer-dialog-open, customer-02-b-new, customer-03-n2-edit, customer-04-n2-edit-list… | DESIGN-ONLY |  | same text as hand-verified row "Address 1" |
| 125 | Address 2 | OCR · 16 board(s): customer-02-b-new, customer-03-n2-edit, customer-04-n2-edit-list, customer-05-n2-edit-picked… | DESIGN-ONLY |  | same text as hand-verified row "Address 2" |
| 126 | Adjust: | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 127 | Adjustments | OCR · 10 board(s): sbc-00-b-sbc-filter, sbr-00-b-sbr, sbr-01-b-sbr-filter, sbr-02-b-sbr-columns… | DESIGN-ONLY |  | same text as hand-verified row "Adjustments" |
| 128 | Advisor Analysis | OCR · 14 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 129 | Approved | OCR · 1 board(s): card-15-n1-unassign-list | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 130 | Approved ) | OCR · 2 board(s): card-10-n1-added-hover, card-13-n1-remove-tip | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 131 | Asset | OCR · 6 board(s): customer-00-b-customer-page, partsale-00-b-ps, partsale-01-n3-rest, partsale-02-n3-hover… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 132 | Assets | OCR · 1 board(s): customer-00-b-customer-page | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 133 | Auth To Order ) | OCR · 2 board(s): card-00-b-wo-rest2 | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 134 | Authorizer | OCR · 30 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 135 | B ASP Aging Summary | OCR · 2 board(s): sbr-04-a4-sbr-c, sbr-07-a4-sbr-labor-only | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 136 | B Aging Summary | OCR · 8 board(s): sbc-00-b-sbc-filter, sbr-01-b-sbr-filter, sbr-02-b-sbr-columns, sbr-05-a4-sbr-expanded… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 137 | B Sales | OCR · 14 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 138 | BG AJR Aging Summary | OCR · 11 board(s): sbc-00-b-sbc-filter, sbc-02-n5-sbc-open, sbr-01-b-sbr-filter, sbr-02-b-sbr-columns… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 139 | BG ASP Aging Summary | OCR · 1 board(s): sbc-02-n5-sbc-open | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 140 | Balance | OCR · 5 board(s): partsale-00-b-ps, partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 141 | C Approved ) | OCR · 7 board(s): card-02-n1-rest, card-05-n1-picked, card-08-n1-add-menu, card-09-n1-added… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 142 | C In Progress | OCR · 2 board(s): card-09-n1-added, card-12-n1-two | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 143 | C In Progress ) Over Limit | OCR · 2 board(s): card-06-n1-picked-hover, card-07-n1-add-tip | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 144 | Category | OCR · 19 board(s): partsale-00-b-ps, partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 145 | CinProgress ) | OCR · 1 board(s): card-13-n1-remove-tip | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 146 | City | OCR · 17 board(s): customer-01-b-customer-dialog-open, customer-02-b-new, customer-03-n2-edit, customer-04-n2-edit-list… | DESIGN-ONLY |  | same text as hand-verified row "City" |
| 147 | Clear selection | OCR · 4 board(s): sbc-00-b-sbc-filter, sbc-02-n5-sbc-open, sbr-01-b-sbr-filter, sbr-06-a4-filter-open | DESIGN-ONLY |  | same text as hand-verified row "Clear selection" |
| 148 | Clock In | OCR · 11 board(s): partsale-01-n3-rest, partsale-03-n3-list, partsale-04-n3-picked-hover, phone-00-b-phone-details… | DESIGN-ONLY |  | same text as hand-verified row "Clock In" |
| 149 | Complete | OCR · 2 board(s): card-17-n1-invoiced | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 150 | Contact | OCR · 27 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 151 | Contacts | OCR · 2 board(s): customer-00-b-customer-page, customer-15-n2-page-three | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 152 | Core | OCR · 5 board(s): partsale-00-b-ps, partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 153 | Core C... | OCR · 4 board(s): partsale-00-b-ps | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 154 | Cost | OCR · 9 board(s): partsale-00-b-ps, partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 155 | Country | OCR · 17 board(s): customer-01-b-customer-dialog-open, customer-02-b-new, customer-03-n2-edit, customer-04-n2-edit-list… | DESIGN-ONLY |  | same text as hand-verified row "Country" |
| 156 | Created | OCR · 1 board(s): card-18-b-audit | DESIGN-ONLY |  | same text as hand-verified row "Created" |
| 157 | Created On | OCR · 2 board(s): customer-00-b-customer-page, customer-15-n2-page-three | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 158 | Credit Limit | OCR · 13 board(s): customer-01-b-customer-dialog-open, customer-03-n2-edit, customer-04-n2-edit-list, customer-05-n2-edit-picked… | DESIGN-ONLY |  | same text as hand-verified row "Credit Limit" |
| 159 | Credit Terms | OCR · 13 board(s): customer-01-b-customer-dialog-open, customer-03-n2-edit, customer-04-n2-edit-list, customer-05-n2-edit-picked… | DESIGN-ONLY |  | same text as hand-verified row "Credit Terms" |
| 160 | Credit limit | OCR · 2 board(s): customer-00-b-customer-page, customer-15-n2-page-three | DESIGN-ONLY |  | same text as hand-verified row "Credit Limit" |
| 161 | Credit term | OCR · 2 board(s): customer-00-b-customer-page, customer-15-n2-page-three | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 162 | Ctrl | OCR · 1 board(s): partsale-00-b-ps | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 163 | Ctrl K | OCR · 26 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-04-n1-list, card-07-n1-add-tip… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 164 | Customer | OCR · 13 board(s): sbr-00-b-sbr, sbr-01-b-sbr-filter, sbr-02-b-sbr-columns, sbr-03-b-sbr-expanded… | DESIGN-ONLY |  | same text as hand-verified row "Customer" |
| 165 | Customer « | OCR · 3 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open | DESIGN-ONLY |  | same text as hand-verified row "Customer" |
| 166 | Customer: All customers v | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DESIGN-ONLY |  | same text as hand-verified row "Customer: All customers" |
| 167 | Customers | OCR · 39 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DESIGN-ONLY |  | same text as hand-verified row "Customer" |
| 168 | Date | OCR · 16 board(s): card-18-b-audit, card-19-n1-audit, sbc-01-n5-sbc, sbr-00-b-sbr… | DESIGN-ONLY |  | same text as hand-verified row "Date" |
| 169 | Date: Last 12 months v | OCR · 11 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr, sbr-03-b-sbr-expanded… | DESIGN-ONLY |  | same text as hand-verified row "Date: Last 12 months" |
| 170 | Days Open | OCR · 2 board(s): customer-00-b-customer-page, customer-15-n2-page-three | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 171 | Default Labor Rate | OCR · 10 board(s): customer-03-n2-edit, customer-05-n2-edit-picked, customer-06-n2-add-tip, customer-07-n2-add-menu… | DESIGN-ONLY |  | same text as hand-verified row "Default Labor Rate" |
| 172 | Default Shop Supplies | OCR · 10 board(s): customer-03-n2-edit, customer-05-n2-edit-picked, customer-06-n2-add-tip, customer-07-n2-add-menu… | DESIGN-ONLY |  | same text as hand-verified row "Default Shop Supplies" |
| 173 | Default Tax Settings | OCR · 9 board(s): customer-01-b-customer-dialog-open, customer-03-n2-edit, customer-04-n2-edit-list, customer-05-n2-edit-picked… | DESIGN-ONLY |  | same text as hand-verified row "Default Tax Settings" |
| 174 | Deposits | OCR · 1 board(s): customer-00-b-customer-page | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 175 | Description | OCR · 9 board(s): partsale-00-b-ps, partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 176 | Details | OCR · 2 board(s): card-18-b-audit, card-19-n1-audit | DESIGN-ONLY |  | same text as hand-verified row "Details" |
| 177 | E A/P Aging Detail | OCR · 1 board(s): sbr-00-b-sbr | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 178 | E AIP Aging Detail | OCR · 1 board(s): sbc-02-n5-sbc-open | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 179 | E AJP Aging Detail | OCR · 10 board(s): sbc-00-b-sbc-filter, sbr-01-b-sbr-filter, sbr-02-b-sbr-columns, sbr-04-a4-sbr-c… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 180 | E AJR Aging Detail | OCR · 12 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-01-b-sbr-filter… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 181 | E Pinned Notes: | OCR · 1 board(s): phone-04-n6-picked | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 182 | Empty bays, endless possibilities. Get Going! | OCR · 1 board(s): customer-00-b-customer-page | DESIGN-ONLY |  | same text as hand-verified row "Empty bays, endless possibilities. Get Going!" |
| 183 | Event | OCR · 2 board(s): card-18-b-audit, card-19-n1-audit | DESIGN-ONLY |  | same text as hand-verified row "Event" |
| 184 | Export Reports | OCR · 4 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr, sbr-03-b-sbr-expanded | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 185 | FINANCE | OCR · 14 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr… | DESIGN-ONLY |  | existing tab / Reports menu heading |
| 186 | Finance | OCR · 23 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 187 | Financial Info | OCR · 5 board(s): partsale-00-b-ps, partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 188 | G A/P Aging Summary | OCR · 2 board(s): sbr-00-b-sbr, sbr-03-b-sbr-expanded | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 189 | G A/R Aging Summary | OCR · 2 board(s): sbr-00-b-sbr, sbr-03-b-sbr-expanded | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 190 | G AJR Aging Summary | OCR · 1 board(s): sbc-01-n5-sbc | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 191 | G ASP Aging Summary | OCR · 1 board(s): sbc-01-n5-sbc | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 192 | GST | OCR · 5 board(s): partsale-00-b-ps, partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 193 | Hide Details | OCR · 8 board(s): phone-00-b-phone-details, phone-01-b-phone-open, phone-02-n6-field, phone-03-n6-list… | DESIGN-ONLY | S3-R6 | same text as hand-verified row "Hide Details" |
| 194 | IBS | OCR · 19 board(s): customer-00-b-customer-page, customer-01-b-customer-dialog-open, customer-02-b-new, customer-03-n2-edit… | DESIGN-ONLY |  | same text as hand-verified row "IBS" |
| 195 | IBS# | OCR · 2 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 196 | In Progress ) | OCR · 1 board(s): customer-15-n2-page-three | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 197 | In Progress ) < Over Limit ) | OCR · 1 board(s): card-11-n1-labor-list | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 198 | In Progress ) Over Limit | OCR · 3 board(s): card-05-n1-picked, card-14-n1-removed, card-16-n1-cleared | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 199 | Inventory | OCR · 8 board(s): partsale-00-b-ps, partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 200 | Invoice | OCR · 11 board(s): sbr-00-b-sbr, sbr-01-b-sbr-filter, sbr-02-b-sbr-columns, sbr-03-b-sbr-expanded… | DESIGN-ONLY |  | same text as hand-verified row "Invoice" |
| 201 | Invoice # | OCR · 2 board(s): sbr-11-a4-export-csv, sbr-12-a4-export-pdf-crop-1 | DESIGN-ONLY |  | same text as hand-verified row "Invoice #" |
| 202 | Invoice Status: All Statuses | OCR · 2 board(s): sbr-11-a4-export-csv, sbr-12-a4-export-pdf-crop-1 | DESIGN-ONLY | S8-R4 | same text as hand-verified row "Invoice Status: All Statuses" |
| 203 | Invoiced Date | OCR · 2 board(s): customer-00-b-customer-page, customer-15-n2-page-three | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 204 | Invoices | OCR · 1 board(s): customer-00-b-customer-page | DESIGN-ONLY |  | same text as hand-verified row "Invoice" |
| 205 | Item | OCR · 5 board(s): partsale-00-b-ps, partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 206 | LABOR | OCR · 14 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr… | DESIGN-ONLY |  | existing tab / Reports menu heading |
| 207 | Lead technician | OCR · 1 board(s): card-17-n1-invoiced | DESIGN-ONLY | S2-R17 | same text as hand-verified row "Lead technician" |
| 208 | Line | OCR · 2 board(s): card-18-b-audit, card-19-n1-audit | DESIGN-ONLY |  | same text as hand-verified row "Line" |
| 209 | Line authorization required | OCR · 1 board(s): card-18-b-audit | DESIGN-ONLY |  | same text as hand-verified row "Line authorization required" |
| 210 | Line authorized | OCR · 3 board(s): card-18-b-audit | DESIGN-ONLY |  | same text as hand-verified row "Line authorized" |
| 211 | Line created | OCR · 5 board(s): card-18-b-audit | DESIGN-ONLY |  | same text as hand-verified row "Line created" |
| 212 | Lines | OCR · 1 board(s): customer-00-b-customer-page | DESIGN-ONLY |  | same text as hand-verified row "Line" |
| 213 | Margin | OCR · 45 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DESIGN-ONLY |  | same text as hand-verified row "Margin" |
| 214 | Margin % Subtotal | OCR · 1 board(s): sbr-11-a4-export-csv | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 215 | Max | OCR · 10 board(s): customer-03-n2-edit, customer-05-n2-edit-picked, customer-06-n2-add-tip, customer-07-n2-add-menu… | DESIGN-ONLY |  | same text as hand-verified row "Max" |
| 216 | Min | OCR · 10 board(s): customer-03-n2-edit, customer-05-n2-edit-picked, customer-06-n2-add-tip, customer-07-n2-add-menu… | DESIGN-ONLY |  | same text as hand-verified row "Min" |
| 217 | Name * | OCR · 15 board(s): customer-01-b-customer-dialog-open, customer-03-n2-edit, customer-04-n2-edit-list, customer-05-n2-edit-picked… | DESIGN-ONLY |  | same text as hand-verified row "Name *" |
| 218 | Name/Description | OCR · 18 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 219 | No record matches these filters | OCR · 3 board(s): sbc-00-b-sbc-filter, sbr-01-b-sbr-filter, sbr-02-b-sbr-columns | DESIGN-ONLY | S8-R5 | same text as hand-verified row "No record matches these filters" |
| 220 | None | OCR · 31 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 221 | Notes | OCR · 18 board(s): customer-00-b-customer-page, customer-01-b-customer-dialog-open, customer-02-b-new, customer-03-n2-edit… | DESIGN-ONLY |  | same text as hand-verified row "Notes" |
| 222 | Number ~ | OCR · 1 board(s): customer-00-b-customer-page | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 223 | Number ~ Asset | OCR · 1 board(s): customer-15-n2-page-three | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 224 | Over Limit | OCR · 2 board(s): card-09-n1-added, card-12-n1-two | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 225 | Over Limit ) | OCR · 1 board(s): card-15-n1-unassign-list | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 226 | PARTS | OCR · 12 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-01-b-sbr-filter… | DESIGN-ONLY |  | existing tab / Reports menu heading |
| 227 | PARTS. | OCR · 2 board(s): sbr-00-b-sbr, sbr-03-b-sbr-expanded | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 228 | PERFORMANCE | OCR · 14 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr… | DESIGN-ONLY |  | existing tab / Reports menu heading |
| 229 | Paid | OCR · 1 board(s): customer-15-n2-page-three | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 230 | Paid ) | OCR · 13 board(s): customer-15-n2-page-three | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 231 | Part Nu.. | OCR · 4 board(s): partsale-00-b-ps | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 232 | PartNumber Quantity Cost | OCR · 5 board(s): partsale-00-b-ps, partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 233 | Partially Paid | OCR · 6 board(s): sbr-11-a4-export-csv, sbr-12-a4-export-pdf-crop-1 | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 234 | Parts | OCR · 122 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DESIGN-ONLY |  | same text as hand-verified row "Parts" |
| 235 | Parts Velocity | OCR · 10 board(s): sbc-00-b-sbc-filter, sbr-01-b-sbr-filter, sbr-02-b-sbr-columns, sbr-04-a4-sbr-c… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 236 | Phone | OCR · 49 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DESIGN-ONLY |  | same text as hand-verified row "Phone" |
| 237 | Pin notes? | OCR · 5 board(s): customer-03-n2-edit, customer-04-n2-edit-list, customer-05-n2-edit-picked, customer-06-n2-add-tip… | DESIGN-ONLY |  | same text as hand-verified row "Pin notes?" |
| 238 | Pinned Notes: | OCR · 5 board(s): card-09-n1-added, phone-00-b-phone-details, phone-02-n6-field, phone-05-n6-add-menu… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 239 | Progress | OCR · 44 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 240 | Q Search | OCR · 2 board(s): card-19-n1-audit, customer-15-n2-page-three | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 241 | Q. Search customers, work orders, .. | OCR · 4 board(s): card-09-n1-added, card-12-n1-two, sbc-01-n5-sbc, sbc-02-n5-sbc-open | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 242 | Q. Search customers, work orders, ... Ctrl K | OCR · 5 board(s): card-02-n1-rest, card-05-n1-picked, card-10-n1-added-hover, card-14-n1-removed… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 243 | Q. Search customers, work orders, ... Ctrl. K | OCR · 1 board(s): card-08-n1-add-menu | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 244 | Q_ Search customers, work ... | OCR · 8 board(s): phone-00-b-phone-details, phone-01-b-phone-open, phone-02-n6-field, phone-03-n6-list… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 245 | Q_ Search customers, work orders, | OCR · 1 board(s): card-01-b-wo-open | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 246 | Q_ Search customers, work orders, .. | OCR · 2 board(s): card-04-n1-list, customer-15-n2-page-three | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 247 | Q_ Search customers, work orders, ... Ctrl K | OCR · 3 board(s): customer-00-b-customer-page, sbr-00-b-sbr, sbr-03-b-sbr-expanded | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 248 | Qua... | OCR · 14 board(s): partsale-00-b-ps, partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 249 | Rate | OCR · 18 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 250 | Reports | OCR · 39 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 251 | Representative | OCR · 2 board(s): sbr-11-a4-export-csv, sbr-12-a4-export-pdf-crop-1 | DESIGN-ONLY |  | same text as hand-verified row "Representative" |
| 252 | Requested At Status | OCR · 4 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list, partsale-04-n3-picked-hover | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 253 | Returns | OCR · 1 board(s): customer-00-b-customer-page | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 254 | SHOPCOACH ANALYSIS | OCR · 17 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 255 | Sales By Representative - Expanded View (CSV), opened as a spreadsheet | OCR · 1 board(s): sbr-11-a4-export-csv | DESIGN-ONLY |  | same text as hand-verified row "Sales By Representative - Expanded View (CSV), opened as a spreadsheet" |
| 256 | Sales By Representative Report | OCR · 1 board(s): sbr-12-a4-export-pdf-crop-1 | DESIGN-ONLY |  | same text as hand-verified row "Sales By Representative Report" |
| 257 | Schedule | OCR · 39 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 258 | Search | OCR · 2 board(s): card-18-b-audit, customer-00-b-customer-page | DESIGN-ONLY |  | same text as hand-verified row "Search" |
| 259 | Search customers, work orders, .. | OCR · 16 board(s): card-00-b-wo-rest2, card-07-n1-add-tip, card-13-n1-remove-tip, card-15-n1-unassign-list… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 260 | Search customers, work orders, ... | OCR · 4 board(s): sbc-00-b-sbc-filter, sbr-01-b-sbr-filter, sbr-02-b-sbr-columns, sbr-08-a4-columns-off | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 261 | Search customers, work orders, ... Ctrl K | OCR · 1 board(s): card-06-n1-picked-hover | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 262 | Search customers, work orders, ... Ctrl. K | OCR · 2 board(s): card-03-n1-hover, card-11-n1-labor-list | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 263 | Select all | OCR · 3 board(s): sbc-02-n5-sbc-open, sbr-01-b-sbr-filter, sbr-06-a4-filter-open | DESIGN-ONLY |  | same text as hand-verified row "Select all" |
| 264 | Sell Pr... | OCR · 14 board(s): partsale-00-b-ps, partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 265 | Sell Price | OCR · 5 board(s): partsale-00-b-ps, partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 266 | Service advisor | OCR · 1 board(s): card-17-n1-invoiced | DESIGN-ONLY | S2-R17 | same text as hand-verified row "Service advisor" |
| 267 | Services | OCR · 2 board(s): sbc-00-b-sbc-filter, sbr-01-b-sbr-filter | DESIGN-ONLY |  | same text as hand-verified row "Services" |
| 268 | Shop Efficiency | OCR · 7 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-01-b-sbr-filter… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 269 | ShopHub | OCR · 2 board(s): card-03-n1-hover, card-08-n1-add-menu | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 270 | ShopHub v | OCR · 3 board(s): card-01-b-wo-open, sbr-00-b-sbr, sbr-03-b-sbr-expanded | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 271 | ShopHub ~ | OCR · 4 board(s): card-02-n1-rest, card-05-n1-picked, card-14-n1-removed, card-16-n1-cleared | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 272 | ShopHub ~» | OCR · 1 board(s): partsale-04-n3-picked-hover | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 273 | ShopHub » | OCR · 27 board(s): card-00-b-wo-rest2, card-04-n1-list, card-06-n1-picked-hover, card-07-n1-add-tip… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 274 | ShopHub »v | OCR · 1 board(s): customer-00-b-customer-page | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 275 | State/Province | OCR · 17 board(s): customer-01-b-customer-dialog-open, customer-02-b-new, customer-03-n2-edit, customer-04-n2-edit-list… | DESIGN-ONLY |  | same text as hand-verified row "State/Province" |
| 276 | Statistics | OCR · 5 board(s): partsale-00-b-ps, partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 277 | Stats | OCR · 18 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DESIGN-ONLY |  | existing tab / Reports menu heading |
| 278 | Status Labe | OCR · 1 board(s): sbr-01-b-sbr-filter | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 279 | Status: Authorization Required > Authorized | OCR · 3 board(s): card-18-b-audit | DESIGN-ONLY |  | same text as hand-verified row "Status: Authorization Required → Authorized" |
| 280 | Status: Authorized > Authorization Required | OCR · 1 board(s): card-18-b-audit | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 281 | Subtotal | OCR · 14 board(s): partsale-00-b-ps, partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list… | DESIGN-ONLY |  | same text as hand-verified row "Subtotal" |
| 282 | Taxes | OCR · 9 board(s): customer-01-b-customer-dialog-open, customer-03-n2-edit, customer-04-n2-edit-list, customer-05-n2-edit-picked… | DESIGN-ONLY |  | same text as hand-verified row "Taxes" |
| 283 | Technician Efficiency | OCR · 7 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-01-b-sbr-filter… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 284 | Technician Utilization | OCR · 7 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-01-b-sbr-filter… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 285 | Time | OCR · 2 board(s): card-18-b-audit, card-19-n1-audit | DESIGN-ONLY |  | same text as hand-verified row "Time" |
| 286 | Total | OCR · 23 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DESIGN-ONLY | S5-R14 | same text as hand-verified row "Totals" |
| 287 | Total Price | OCR · 2 board(s): customer-00-b-customer-page, customer-15-n2-page-three | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 288 | Totals | OCR · 13 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr, sbr-03-b-sbr-expanded… | DESIGN-ONLY | S5-R14 | same text as hand-verified row "Totals" |
| 289 | Try changing filters to widen your results. | OCR · 3 board(s): sbc-00-b-sbc-filter, sbr-01-b-sbr-filter, sbr-02-b-sbr-columns | DESIGN-ONLY | S8-R5 | same text as hand-verified row "Try changing filters to widen your results." |
| 290 | Unit | OCR · 3 board(s): card-17-n1-invoiced, customer-00-b-customer-page, customer-15-n2-page-three | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 291 | Unit # | OCR · 10 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 292 | Unpaid | OCR · 6 board(s): sbr-11-a4-export-csv, sbr-12-a4-export-pdf-crop-1 | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 293 | User | OCR · 2 board(s): card-18-b-audit, card-19-n1-audit | DESIGN-ONLY |  | same text as hand-verified row "User" |
| 294 | VIN/Gerial # | OCR · 2 board(s): card-02-n1-rest, card-04-n1-list | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 295 | VIN/Gerial & | OCR · 1 board(s): card-03-n1-hover | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 296 | VIN/Serial # | OCR · 2 board(s): customer-00-b-customer-page, customer-15-n2-page-three | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 297 | Vendor | OCR · 9 board(s): partsale-00-b-ps, partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 298 | Website | OCR · 19 board(s): customer-00-b-customer-page, customer-01-b-customer-dialog-open, customer-02-b-new, customer-03-n2-edit… | DESIGN-ONLY |  | same text as hand-verified row "Website" |
| 299 | Work In Progress | OCR · 7 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-01-b-sbr-filter… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 300 | Work Order Log | OCR · 2 board(s): card-18-b-audit, card-19-n1-audit | DESIGN-ONLY |  | same text as hand-verified row "Work Order Log" |
| 301 | Work Orders | OCR · 40 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 302 | ZIP/Postal Code | OCR · 17 board(s): customer-01-b-customer-dialog-open, customer-02-b-new, customer-03-n2-edit, customer-04-n2-edit-list… | DESIGN-ONLY |  | same text as hand-verified row "ZIP/Postal Code" |
| 303 | delta | OCR · 1 board(s): sbr-06-a4-filter-open | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 304 | ibor Margin | OCR · 1 board(s): sbr-01-b-sbr-filter | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 305 | pa Select all | OCR · 1 board(s): sbc-00-b-sbc-filter | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 306 | \| Address 2 | OCR · 1 board(s): customer-01-b-customer-dialog-open | DESIGN-ONLY |  | same text as hand-verified row "Address 2" |
| 307 | \|BS Batches | OCR · 2 board(s): sbr-00-b-sbr, sbr-03-b-sbr-expanded | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 308 | ¢ Approved ) | OCR · 5 board(s): card-01-b-wo-open | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 309 | ¢ Approved ») | OCR · 5 board(s): card-00-b-wo-rest2 | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 310 | ¢ In Progress | OCR · 1 board(s): card-15-n1-unassign-list | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 311 | ¢ In Progress ) Over Limit | OCR · 2 board(s): card-02-n1-rest, card-08-n1-add-menu | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 312 | ¢ In Progress ) Over Limit ) | OCR · 1 board(s): card-10-n1-added-hover | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 313 | ¢ In Progress ) © Over Limit ) | OCR · 1 board(s): card-04-n1-list | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 314 | ¥ Pinned Notes: | OCR · 12 board(s): card-00-b-wo-rest2, card-02-n1-rest, card-03-n1-hover, card-05-n1-picked… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 315 | ¥# Pinned Notes: | OCR · 1 board(s): card-12-n1-two | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 316 | §& Invoice Status: All statuses v | OCR · 9 board(s): sbr-01-b-sbr-filter, sbr-02-b-sbr-columns, sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded… | DESIGN-ONLY |  | same text as hand-verified row "Invoice Status: All statuses" |
| 317 | © Timesheet Activities | OCR · 14 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 318 | © Work In Progress | OCR · 7 board(s): sbr-00-b-sbr, sbr-03-b-sbr-expanded, sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 319 | ® Inventory Value | OCR · 14 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr… | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 320 | —& AJP Aging Detail | OCR · 1 board(s): sbc-01-n5-sbc | DESIGN-ONLY |  | existing ShopView screen text, unchanged by this feature |
| 321 | $ 0.00 | OCR · 21 board(s): customer-01-b-customer-dialog-open, customer-03-n2-edit, customer-04-n2-edit-list, customer-05-n2-edit-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 322 | $ 18.0( | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 323 | $ 19.0! | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 324 | $ 19.2. | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 325 | $ 20.1 | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 326 | $ 21.3. | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 327 | $ 5.28 | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 328 | $0.00 | OCR · 124 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 329 | $0.02 | OCR · 2 board(s): sbr-00-b-sbr | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 330 | $0.44 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 331 | $0.80 | OCR · 4 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 332 | $0.83 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 333 | $0.85 | OCR · 4 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 334 | $0.C | OCR · 8 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 335 | $1,000.22 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 336 | $1,050.94 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 337 | $1,060.79 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 338 | $1,066.92 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 339 | $1,068.98 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 340 | $1,106.63 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 341 | $1,130.97 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 342 | $1,154.13 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 343 | $1,155.15 | OCR · 13 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 344 | $1,181.33 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 345 | $1,301.18 | OCR · 2 board(s): sbr-04-a4-sbr-c, sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 346 | $1,314.68 | OCR · 5 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-10-a4-sbr-expanded-type… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 347 | $1,323.09 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 348 | $1,324.37 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 349 | $1,328.24 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 350 | $1,345.80 | OCR · 6 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 351 | $1,429.79 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 352 | $1,451.97 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 353 | $1,481.70 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 354 | $1,572,997.62 | OCR · 6 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr, sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 355 | $1,581.50 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 356 | $1,739.44 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 357 | $1,742.31 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 358 | $1,753.79 | OCR · 7 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 359 | $1,757.03 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 360 | $1,762.42 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 361 | $1,792.58 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 362 | $1,852.50 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 363 | $1,895.21 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 364 | $1,928.00 | OCR · 28 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-07-a4-sbr-labor-only… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 365 | $1-12 | OCR · 14 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off, sbr-09-a4-columns-on… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 366 | $1-32 | OCR · 7 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off, sbr-09-a4-columns-on… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 367 | $1.29 | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 368 | $1.38 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 369 | $11,655.62 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 370 | $11,879.05 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 371 | $11.03 | OCR · 3 board(s): sbr-04-a4-sbr-c, sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 372 | $11.32 | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 373 | $112.24 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 374 | $116.20 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 375 | $127.6 | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 376 | $13. | OCR · 4 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 377 | $13.50 | OCR · 4 board(s): sbr-04-a4-sbr-c, sbr-07-a4-sbr-labor-only, sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 378 | $135.00 | OCR · 28 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-07-a4-sbr-labor-only… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 379 | $135.14 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 380 | $138.92 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 381 | $145 | OCR · 2 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 382 | $148.50 | OCR · 1 board(s): sbr-07-a4-sbr-labor-only | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 383 | $149.95 | OCR · 77 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 384 | $15.95 | OCR · 8 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 385 | $150 | OCR · 4 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 386 | $16,134.63 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 387 | $16.75 | OCR · 8 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 388 | $16.96 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 389 | $163.20 | OCR · 6 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off, sbr-10-a4-sbr-expanded-type… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 390 | $163.72 | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 391 | $164.95 | OCR · 17 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 392 | $17.1; | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 393 | $175.50 | OCR · 4 board(s): sbr-04-a4-sbr-c, sbr-07-a4-sbr-labor-only, sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 394 | $176,711.07 | OCR · 4 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 395 | $177.11 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 396 | $185.05 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 397 | $189. | OCR · 2 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 398 | $189.00 | OCR · 3 board(s): sbr-04-a4-sbr-c, sbr-07-a4-sbr-labor-only, sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 399 | $190.65 | OCR · 6 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 400 | $2, $4,720,680.52 | OCR · 1 board(s): sbr-00-b-sbr | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 401 | $2,011.32 | OCR · 1 board(s): sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 402 | $2,021.35 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 403 | $2,059.18 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 404 | $2,063.00 | OCR · 16 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-07-a4-sbr-labor-only… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 405 | $2,067.43 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 406 | $2,114.33 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 407 | $2,114.69 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 408 | $2,170,893.53 | OCR · 6 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr, sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 409 | $2,186.82 | OCR · 5 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-07-a4-sbr-labor-only, sbr-10-a4-sbr-expanded-type… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 410 | $2,205.32 | OCR · 2 board(s): sbr-04-a4-sbr-c, sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 411 | $2,216.69 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 412 | $2,331.36 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 413 | $2,335.32 | OCR · 1 board(s): sbr-07-a4-sbr-labor-only | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 414 | $2,373,075.90 | OCR · 6 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr, sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 415 | $2,665.67 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 416 | $2,788.81 | OCR · 5 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-10-a4-sbr-expanded-type… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 417 | $2,830.92 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 418 | $2,891.95 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 419 | $2-11773 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 420 | $2-12011 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 421 | $2-13309 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 422 | $2-16913 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 423 | $2-17292 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 424 | $2-17350 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 425 | $2-17435 | OCR · 4 board(s): card-00-b-wo-rest2, card-01-b-wo-open, phone-00-b-phone-details, phone-01-b-phone-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 426 | $2-17510 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 427 | $2-17528 | OCR · 22 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 428 | $2-17540 | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 429 | $2-9933 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 430 | $2. $4,720,680.52 | OCR · 1 board(s): sbr-00-b-sbr | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 431 | $201.21 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 432 | $204.40 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 433 | $220.85 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 434 | $226.29 | OCR · 2 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 435 | $23,065.27 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 436 | $237.61 | OCR · 2 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 437 | $253.28 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 438 | $255.15 | OCR · 11 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off, sbr-09-a4-columns-on… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 439 | $256.39 | OCR · 2 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 440 | $265.99 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 441 | $266.18 | OCR · 5 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-10-a4-sbr-expanded-type, sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 442 | $27.45 | OCR · 11 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off, sbr-09-a4-columns-on… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 443 | $273.77 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 444 | $274.11 | OCR · 4 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 445 | $287.22 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 446 | $29.38 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 447 | $299.9 | OCR · 60 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 448 | $3,009.51 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 449 | $3,053.05 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 450 | $3,275.71 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 451 | $3,372.46 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 452 | $3,387.27 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 453 | $3,506.50 | OCR · 2 board(s): sbr-04-a4-sbr-c, sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 454 | $3,712.00 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 455 | $3,787.76 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 456 | $3,793.23 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 457 | $3.35 | OCR · 1 board(s): sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 458 | $30.16 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 459 | $30.80 | OCR · 5 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-10-a4-sbr-expanded-type, sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 460 | $32.25 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 461 | $326.13 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 462 | $358.78 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 463 | $36.12 | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 464 | $365.11 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 465 | $370.50 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 466 | $390.49 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 467 | $4,038.33 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 468 | $4,103.49 | OCR · 5 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-10-a4-sbr-expanded-type… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 469 | $4,103.78 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 470 | $4,131.02 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 471 | $4,163.78 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 472 | $4,327.24 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 473 | $4,720,680.52 | OCR · 4 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 474 | $4,807.21 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 475 | $4.43 | OCR · 4 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 476 | $4.75 | OCR · 4 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 477 | $40,651.87 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 478 | $400 | OCR · 4 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 479 | $400.28 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 480 | $434.85 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 481 | $44.99 | OCR · 4 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 482 | $441.65 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 483 | $445.77 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 484 | $446.00 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 485 | $446.90 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 486 | $450.00 | OCR · 27 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off, sbr-09-a4-columns-on… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 487 | $463.74 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 488 | $47.36 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 489 | $47.73 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 490 | $485.73 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 491 | $49.80 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 492 | $5,018.04 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 493 | $5,061.01 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 494 | $5,150.49 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 495 | $5,235.52 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 496 | $5,353.85 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 497 | $5,702.41 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 498 | $5,782.46 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 499 | $5.32 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 500 | $500.00 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 501 | $509.47 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 502 | $52.50 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 503 | $53.65 | OCR · 2 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 504 | $540.80 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 505 | $547.88 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 506 | $549.73 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 507 | $569.46 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 508 | $571.19 | OCR · 10 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off, sbr-09-a4-columns-on… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 509 | $585.00 | OCR · 1 board(s): sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 510 | $598.50 | OCR · 4 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-10-a4-sbr-expanded-type, sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 511 | $598.64 | OCR · 7 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 512 | $6,187.76 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 513 | $6,252.09 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 514 | $6,406.28 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 515 | $6,900.21 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 516 | $607.15 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 517 | $621.03 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 518 | $625.16 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 519 | $638.91 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 520 | $65.64 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 521 | $659.8 | OCR · 30 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 522 | $661.67 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 523 | $663,907.63 | OCR · 4 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 524 | $691.58 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 525 | $7,819.40 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 526 | $7,890.78 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 527 | $714.95 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 528 | $719.77 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 529 | $721.10 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 530 | $739.87 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 531 | $75.07 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 532 | $764.33 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 533 | $768.59 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 534 | $77.69 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 535 | $791.40 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 536 | $8,232.85 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 537 | $8.24 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 538 | $83.32 | OCR · 3 board(s): sbr-07-a4-sbr-labor-only, sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 539 | $86.67 | OCR · 2 board(s): sbr-04-a4-sbr-c, sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 540 | $889.56 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 541 | $896.59 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 542 | $952.70 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 543 | $955.18 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 544 | $97.70 | OCR · 2 board(s): sbr-04-a4-sbr-c, sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 545 | % 10.5! | OCR · 4 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list, partsale-04-n3-picked-hover | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 546 | % 10.7 | OCR · 5 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 547 | % 10.7. | OCR · 4 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 548 | % 10.81 | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 549 | & Customer: v | OCR · 1 board(s): sbc-00-b-sbc-filter | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 550 | (-$259.43) | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 551 | (-) Strap kit | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 552 | (-) Windshield | OCR · 2 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 553 | (-) Wiper blades | OCR · 2 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 554 | (-) accesory belt | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 555 | (-) fan belt | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 556 | (-) hub cap gasket | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 557 | (-) steer wheel seal | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 558 | (-0.23) | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 559 | (-0.73) | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 560 | (-4.30) | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 561 | (-6.72) | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 562 | (029) 938-2141 | OCR · 12 board(s): customer-03-n2-edit, customer-04-n2-edit-list, customer-05-n2-edit-picked, customer-06-n2-add-tip… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 563 | (25) | OCR · 2 board(s): card-00-b-wo-rest2 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 564 | (29-4 1mm) | OCR · 2 board(s): partsale-02-n3-hover, partsale-04-n3-picked-hover | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 565 | (730) 246 - 8895 | OCR · 1 board(s): customer-01-b-customer-dialog-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 566 | (Fuel) Fuel Surcharge, Service Call | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 567 | +0.07 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 568 | +0.09 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 569 | +0.19 | OCR · 4 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 570 | +0.21 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 571 | +0.37 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 572 | +0.50 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 573 | +0.62 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 574 | +0.91 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 575 | +0.97 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 576 | +1.00 | OCR · 14 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-07-a4-sbr-labor-only, sbr-08-a4-columns-off… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 577 | +1.04 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 578 | +13.00 | OCR · 16 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-07-a4-sbr-labor-only… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 579 | +14.00 | OCR · 9 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-07-a4-sbr-labor-only… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 580 | +17.86 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 581 | +2.50 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 582 | +2.68 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 583 | +2.89 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 584 | +208.10 | OCR · 6 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr, sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 585 | +3.29 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 586 | +4.24 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 587 | +5.29 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 588 | +6.12 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 589 | -7747% | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 590 | 0) ClockIn {) — Staging Heavy Duty - 9919 © | OCR · 4 board(s): card-13-n1-remove-tip, customer-00-b-customer-page, sbr-00-b-sbr, sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 591 | 0) ClockIn — Staging Heavy Duty - 9919 © | OCR · 1 board(s): card-14-n1-removed | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 592 | 0) ClockiIn {) — Staging Heavy Duty - 9919 © | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 593 | 0) {) — Staging Heavy Duty - 9919 © | OCR · 4 board(s): card-03-n1-hover, card-08-n1-add-menu, card-11-n1-labor-list, card-15-n1-unassign-list | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 594 | 0.00 | OCR · 25 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-03-b-sbr-expanded, sbr-11-a4-export-csv… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 595 | 0.00 / 0.00 | OCR · 4 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 596 | 0.00 / 0.30 | OCR · 2 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 597 | 0.00 / 1.00 | OCR · 13 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 598 | 0.00 / 2.00 | OCR · 28 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 599 | 0.00 / 4.00 | OCR · 1 board(s): card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 600 | 0.00/ 1.00 | OCR · 1 board(s): card-07-n1-add-tip | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 601 | 0.00/ 1.50 | OCR · 2 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 602 | 0.00/ 2.00 | OCR · 2 board(s): card-07-n1-add-tip | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 603 | 0.27 / 0.37 | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 604 | 0.78/0.88 | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 605 | 00 | OCR · 4 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 606 | 01:59 PM | OCR · 3 board(s): card-19-n1-audit | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 607 | 029-938-2141 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 608 | 02:02 PM | OCR · 5 board(s): card-19-n1-audit | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 609 | 0} ClockIn {) — Staging Heavy Duty - 9919 © | OCR · 1 board(s): card-07-n1-add-tip | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 610 | 1,035.44 / 4.00 | OCR · 5 board(s): card-02-n1-rest, card-05-n1-picked, card-08-n1-add-menu, card-14-n1-removed… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 611 | 1,035.44/ 4.00 | OCR · 6 board(s): card-04-n1-list, card-07-n1-add-tip, card-09-n1-added, card-11-n1-labor-list… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 612 | 1.00 | OCR · 7 board(s): card-11-n1-labor-list, sbr-06-a4-filter-open, sbr-11-a4-export-csv, sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 613 | 1.14-1.6 1" (29-41mm) | OCR · 1 board(s): partsale-03-n3-list | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 614 | 100% | OCR · 130 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 615 | 100.00 | OCR · 6 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 616 | 100.00% | OCR · 6 board(s): sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 617 | 10158622 | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 618 | 10W30 | OCR · 1 board(s): partsale-03-n3-list | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 619 | 10W30 Bulk- Mobil 1 | OCR · 3 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 620 | 11.03 | OCR · 2 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 621 | 114.161" (29-4 1mm) | OCR · 1 board(s): partsale-01-n3-rest | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 622 | 1155..15 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 623 | 1155.15 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 624 | 11:17 AM | OCR · 1 board(s): card-18-b-audit | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 625 | 11:20 AM | OCR · 2 board(s): card-18-b-audit | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 626 | 11:21 AM | OCR · 5 board(s): card-18-b-audit | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 627 | 11:22 AM | OCR · 2 board(s): card-18-b-audit | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 628 | 12:34 PM | OCR · 2 board(s): card-19-n1-audit | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 629 | 12:38 PM | OCR · 2 board(s): card-19-n1-audit | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 630 | 12:39 PM | OCR · 2 board(s): card-19-n1-audit | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 631 | 13.00 | OCR · 4 board(s): sbr-11-a4-export-csv, sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 632 | 13.50 | OCR · 2 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 633 | 1301.18 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 634 | 1314.68 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 635 | 1345.80 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 636 | 135.00 | OCR · 4 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 637 | 14.00 | OCR · 2 board(s): sbr-11-a4-export-csv, sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 638 | 163.20 | OCR · 2 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 639 | 17 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 640 | 175.50 | OCR · 2 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 641 | 1753.79 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 642 | 189.00 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 643 | 190.65 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 644 | 1928.00 | OCR · 4 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 645 | 197-022-7385 | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 646 | 1971 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 647 | 1UYVS2536R2014406 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 648 | 1UYVS3532FU228301 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 649 | 1UYVS3535L2879414 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 650 | 1e. Vitae | OCR · 1 board(s): phone-07-n6-parts-list | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 651 | 2002 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 652 | 2011.32 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 653 | 2022 INTERNATIONAL | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 654 | 2022 INTERNATIONAL LT625 249 | OCR · 4 board(s): phone-02-n6-field, phone-03-n6-list, phone-04-n6-picked, phone-05-n6-add-menu | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 655 | 2023 Hino Incomplete | OCR · 2 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 656 | 2025 GMC SIERRA | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 657 | 2026 | OCR · 6 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 658 | 2063.00 | OCR · 2 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 659 | 215 days | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 660 | 2186.82 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 661 | 2205.32 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 662 | 227 days | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 663 | 235 days | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 664 | 238 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 665 | 247 | OCR · 3 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 666 | 248 | OCR · 3 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 667 | 249 | OCR · 12 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 668 | 250 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 669 | 251 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 670 | 254 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 671 | 255.15 | OCR · 2 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 672 | 25886% | OCR · 1 board(s): card-15-n1-unassign-list | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 673 | 258: | OCR · 4 board(s): card-04-n1-list, card-07-n1-add-tip, card-11-n1-labor-list, card-13-n1-remove-tip | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 674 | 266.18 | OCR · 2 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 675 | 27.45 | OCR · 2 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 676 | 2788.81 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 677 | 28 | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 678 | 28.57 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 679 | 28.57% | OCR · 1 board(s): sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 680 | 3.35 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 681 | 30.80 | OCR · 2 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 682 | 302 days | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 683 | 314 days | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 684 | 3506.50 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 685 | 357 days | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 686 | 396 days | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 687 | 3N3 | OCR · 4 board(s): customer-06-n2-add-tip, customer-09-n2-add-menu-2, customer-10-n2-three-added, customer-14-n2-ps-only | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 688 | 4 Star Truck Repair | OCR · 2 board(s): customer-00-b-customer-page, customer-01-b-customer-dialog-open | DATA |  | same text as hand-verified row "4 Star Truck Repair" |
| 689 | 4.00 | OCR · 5 board(s): card-00-b-wo-rest2, card-03-n1-hover, card-06-n1-picked-hover, card-10-n1-added-hover… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 690 | 4103.49 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 691 | 412 days | OCR · 2 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 692 | 433 days | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 693 | 441 days | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 694 | 450.00 | OCR · 6 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 695 | 47 days | OCR · 2 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 696 | 474-253-2249 | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 697 | 516 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 698 | 522 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 699 | 526 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 700 | 55 days | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 701 | 550045: | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 702 | 5677801 | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 703 | 571.19 | OCR · 2 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 704 | 58404 | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 705 | 585.00 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 706 | 597-156-3927 | OCR · 21 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 707 | 598.50 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 708 | 598.64 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 709 | 5PK875 | OCR · 1 board(s): partsale-00-b-ps | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 710 | 611 GAR G7 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 711 | 61812692 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 712 | 621070 | OCR · 1 board(s): sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 713 | 6263 Elizabeth Causeway Apt. 973 | OCR · 2 board(s): customer-00-b-customer-page, customer-01-b-customer-dialog-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 714 | 62981 Kim Port | OCR · 13 board(s): customer-03-n2-edit, customer-04-n2-edit-list, customer-05-n2-edit-picked, customer-06-n2-add-tip… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 715 | 67 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 716 | 6711922 | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 717 | 69% | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 718 | 730-246-8895 | OCR · 1 board(s): customer-00-b-customer-page | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 719 | 75% | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 720 | 761-378-4012 | OCR · 4 board(s): card-00-b-wo-rest2, card-01-b-wo-open, phone-00-b-phone-details, phone-01-b-phone-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 721 | 77 days | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 722 | 783743 | OCR · 2 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 723 | 7965% | OCR · 21 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 724 | 80W90 | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 725 | 83.32 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 726 | 84.39 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 727 | 84.39% | OCR · 1 board(s): sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 728 | 85% | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 729 | 86.67 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 730 | 89.58 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 731 | 89.58% | OCR · 1 board(s): sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 732 | 929-733-6636 | OCR · 3 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 733 | 97.70 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 734 | 99% | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 735 | @ CW: Hooked up booster cables to unit. Unit started after boosting it. Job complete. | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 736 | @ ClockIn — Staging Heavy Duty - 9919 © | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 737 | @ Clockin — Staging Heavy Duty - 9919 © | OCR · 2 board(s): card-04-n1-list, card-16-n1-cleared | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 738 | @ Ending mileage: 66,573kms | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 739 | @ Staging Heavy Duty - 9919 © | OCR · 1 board(s): card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 740 | @ TV: 1 active code for engine idle speed. engine runs then shuts down after a few moments going from smooth idle to rough idle. engine had Lots of blow by beyond spec. need to remove | OCR · 13 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 741 | A26 | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 742 | AK Truck & Trailer Repair | OCR · 1 board(s): sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 743 | AK Truck & Trailer Repair (8) | OCR · 1 board(s): sbc-01-n5-sbc | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 744 | Accurate Aeronautics | OCR · 21 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off, sbr-09-a4-columns-on… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 745 | Admin ShopView | OCR · 14 board(s): card-19-n1-audit | DATA |  | same text as hand-verified row "Admin ShopView" |
| 746 | Affordable Fleet Servi Part Sales | OCR · 1 board(s): sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 747 | Affordable Fleet Services (1) | OCR · 1 board(s): sbc-01-n5-sbc | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 748 | Al | OCR · 9 board(s): card-02-n1-rest, card-03-n1-hover, card-05-n1-picked, card-06-n1-picked-hover… | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 749 | Alice Truck & Trailer Repair (2) | OCR · 1 board(s): sbc-01-n5-sbc | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 750 | Alice Truck & Trailer Repas | OCR · 1 board(s): sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 751 | Allison Hughes | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 752 | Alternator Belt | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 753 | American Heavy Duty Truck Repair (8) | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 754 | Amory Roadside Truck Repair (1) | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 755 | An | OCR · 1 board(s): sbc-01-n5-sbc | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 756 | Andreasen Truck & Equipment Repair (1) | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 757 | Andrews' Truck & Trailer | OCR · 1 board(s): card-00-b-wo-rest2 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 758 | Andrews' Truck & Trailer Repair LLC | OCR · 1 board(s): phone-00-b-phone-details | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 759 | Andrews' Truck & Trailer Repair LLC (3) | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 760 | Annual inspection | OCR · 4 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 761 | Antell's Fleet Service (6) | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 762 | Apple Valley Truck and Trailer Repair (1) | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 763 | Asian, Blue | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 764 | Assets (17) | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 765 | Assets (5) | OCR · 1 board(s): customer-00-b-customer-page | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 766 | Atque molestiae debitis est libero | OCR · 1 board(s): card-00-b-wo-rest2 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 767 | Atque molestiae debitis est libero accusantium nemo. | OCR · 1 board(s): phone-00-b-phone-details | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 768 | Audubon Truck Center (1) | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 769 | Aug 19, 2026 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 770 | Aug 20, 2026 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 771 | Aug 24, 2026 | OCR · 10 board(s): card-18-b-audit | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 772 | Aug 26, 2025 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 773 | Aug 27, 2025 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 774 | Aug 27, 2026 | OCR · 2 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 775 | Aug 28, 2025 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 776 | Aug 31 2026 | OCR · 14 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 777 | Aug 31, 2026 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 778 | Aug 6, 2025 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 779 | Aug 6, 2026 | OCR · 2 board(s): partsale-02-n3-hover, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 780 | Aug 8, 2025 | OCR · 2 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 781 | Avie 22 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 782 | Avra Valley Truck and Trailer Repair (1) | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 783 | B Q | OCR · 4 board(s): sbr-06-a4-filter-open, sbr-07-a4-sbr-labor-only, sbr-09-a4-columns-on, sbr-10-a4-sbr-expanded-type | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 784 | B QA Testing @ | OCR · 1 board(s): sbr-08-a4-columns-off | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 785 | B arrestin Q | OCR · 2 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 786 | Baron & Sons Truck & Trailer Repair (2) | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 787 | Bay Shore Roadside Truck Repair (2) | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 788 | Becky Gonzales | OCR · 45 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA | S1-R8 | same text as hand-verified row "Becky Gonzales" |
| 789 | Bohac's Fleet Service (2) | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 790 | Boulder Truck & Trailer Repair Inc (2) | OCR · 2 board(s): sbc-01-n5-sbc, sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 791 | Brian Oconnor | OCR · 3 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 792 | British Columbia | OCR · 13 board(s): customer-01-b-customer-dialog-open, customer-03-n2-edit, customer-04-n2-edit-list, customer-05-n2-edit-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 793 | Bulk- Mobil 1 | OCR · 1 board(s): partsale-03-n3-list | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 794 | C3 | OCR · 1 board(s): card-01-b-wo-open | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 795 | CW: Drove to location then drove to stoney pit. Job complete. | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 796 | Canada | OCR · 17 board(s): customer-01-b-customer-dialog-open, customer-02-b-new, customer-03-n2-edit, customer-04-n2-edit-list… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 797 | Ch | OCR · 1 board(s): customer-11-n2-ps-list | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 798 | Christian Wallace | OCR · 16 board(s): customer-04-n2-edit-list, customer-05-n2-edit-picked, customer-06-n2-add-tip, customer-07-n2-add-menu… | DATA | S4-R3 | same text as hand-verified row "Christian Wallace" |
| 799 | Client states: Will not start and will require a boost | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 800 | ClockIn — Staging Heavy Duty - 9919 © | OCR · 1 board(s): card-05-n1-picked | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 801 | ClockiIn {) Staging Heavy Duty - 9919 © | OCR · 1 board(s): sbc-01-n5-sbc | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 802 | Clockin {) — Staging Heavy Duty - 9919 © | OCR · 4 board(s): partsale-00-b-ps, sbc-00-b-sbc-filter, sbr-01-b-sbr-filter, sbr-02-b-sbr-columns | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 803 | CoD | OCR · 2 board(s): customer-00-b-customer-page, customer-11-n2-ps-list | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 804 | Colesville Diesel Repair | OCR · 2 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 805 | Contacts (1) | OCR · 1 board(s): customer-00-b-customer-page | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 806 | DX | OCR · 1 board(s): card-15-n1-unassign-list | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 807 | Daniel Montoya | OCR · 27 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA | S1-R8 | same text as hand-verified row "Daniel Montoya" |
| 808 | Date Range: Nov 1, 2025 - Oct 9, 2026 | OCR · 2 board(s): sbr-11-a4-export-csv, sbr-12-a4-export-pdf-crop-1 | DATA | S8-R4 | same text as hand-verified row "Date Range: Nov 1, 2025 - Oct 9, 2026" |
| 809 | David Combs | OCR · 2 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 810 | De | OCR · 2 board(s): partsale-03-n3-list | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 811 | Debra Garcia | OCR · 4 board(s): card-00-b-wo-rest2, card-01-b-wo-open, phone-00-b-phone-details, phone-01-b-phone-open | DATA |  | same text as hand-verified row "Debra Garcia" |
| 812 | Dec 15, 2025 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 813 | Dec 17, 2025 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 814 | Dec 3, 2025 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 815 | Dec 4, 2025 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 816 | Delvac HDEO | OCR · 4 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 817 | Demo company | OCR · 1 board(s): sbr-12-a4-export-pdf-crop-1 | DATA |  | same text as hand-verified row "Demo company" |
| 818 | Derek Duncan | OCR · 21 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 819 | Desert Edge Truck Service & | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 820 | Devon Whitfield | OCR · 2 board(s): sbr-11-a4-export-csv, sbr-12-a4-export-pdf-crop-1 | DATA |  | same text as hand-verified row "Devon Whitfield (3)" |
| 821 | Devon Whitfield (1) | OCR · 1 board(s): sbr-07-a4-sbr-labor-only | DATA |  | same text as hand-verified row "Devon Whitfield (3)" |
| 822 | Devon Whitfield (3) | OCR · 6 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off… | DATA |  | same text as hand-verified row "Devon Whitfield (3)" |
| 823 | Diagnose - Engine | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 824 | Dylan Rush | OCR · 6 board(s): customer-04-n2-edit-list, customer-11-n2-ps-list, customer-12-n2-three, customer-13-n2-remove-tip… | DATA | S4-R3 | same text as hand-verified row "Dylan Rush" |
| 825 | E2E PO Required Customer | OCR · 6 board(s): sbr-05-a4-sbr-expanded, sbr-08-a4-columns-off, sbr-09-a4-columns-on, sbr-10-a4-sbr-expanded-type… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 826 | E2E PO Required Custor | OCR · 1 board(s): sbr-06-a4-filter-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 827 | EJ | OCR · 8 board(s): phone-00-b-phone-details, phone-01-b-phone-open, phone-02-n6-field, phone-03-n6-list… | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 828 | Edward Bowen | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 829 | Elliot Brennan | OCR · 2 board(s): sbr-11-a4-export-csv, sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 830 | Elliot Brennan (1) | OCR · 1 board(s): sbr-07-a4-sbr-labor-only | DATA |  | same text as hand-verified row "Elliot Brennan (3)" |
| 831 | Elliot Brennan (3) | OCR · 6 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off… | DATA |  | same text as hand-verified row "Elliot Brennan (3)" |
| 832 | Engine | OCR · 16 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 833 | Engine Oil, 5L | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 834 | Engine timing or speed sensor error | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 835 | Equipment Repair | OCR · 3 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 836 | Failed seal | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 837 | Feb 20, 2026 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 838 | Feb 23, 2026 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 839 | Feb 28, 2026 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 840 | Fees & Discounts (0) | OCR · 2 board(s): customer-00-b-customer-page, customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 841 | Frayed | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 842 | Gear Oil | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 843 | Gerald Ortiz | OCR · 12 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-04-n1-list, card-11-n1-labor-list… | DATA | S1-R8 | same text as hand-verified row "Gerald Ortiz" |
| 844 | Gonsoulin Diesel | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 845 | Gonsoulin Diesel Services | OCR · 12 board(s): card-02-n1-rest, card-03-n1-hover, card-05-n1-picked, card-06-n1-picked-hover… | DATA |  | same text as hand-verified row "Gonsoulin Diesel Services Inc" |
| 846 | Gonsoulin Diesel Services Inc | OCR · 17 board(s): customer-03-n2-edit, customer-04-n2-edit-list, customer-05-n2-edit-picked, customer-06-n2-add-tip… | DATA |  | same text as hand-verified row "Gonsoulin Diesel Services Inc" |
| 847 | Gonzales | OCR · 1 board(s): card-19-n1-audit | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 848 | HDEO13 | OCR · 4 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 849 | Hit} | OCR · 3 board(s): sbc-00-b-sbc-filter, sbr-01-b-sbr-filter, sbr-09-a4-columns-on | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 850 | Hueytown Truck & Trailer Repair | OCR · 3 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 851 | INTERNATIONAL LONEST.. | OCR · 3 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 852 | INTERNATIONAL LT625 | OCR · 2 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 853 | Imperial Trailer & Suspension | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 854 | Inc | OCR · 12 board(s): card-02-n1-rest, card-03-n1-hover, card-05-n1-picked, card-06-n1-picked-hover… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 855 | International L9377 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 856 | International Lt625 | OCR · 3 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 857 | Inventory Aug 6, 2026 | OCR · 2 board(s): partsale-01-n3-rest, partsale-03-n3-list | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 858 | Invoices Payments (26) Deposits | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 859 | Jason Garrison | OCR · 16 board(s): card-18-b-audit, customer-04-n2-edit-list, customer-11-n2-ps-list, customer-12-n2-three… | DATA | S4-R3 | same text as hand-verified row "Jason Garrison" |
| 860 | Jul 28, 2026 | OCR · 2 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 861 | Jul 29, 2025 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 862 | Jul 31,2026 | OCR · 4 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 863 | Justin Lin | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 864 | KJ | OCR · 20 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-06-n1-picked-hover, card-08-n1-add-menu… | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 865 | KL-GL10. | OCR · 1 board(s): partsale-00-b-ps | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 866 | KY | OCR · 4 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 867 | Kirby Heavy Duty Truck & | OCR · 3 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 868 | Kolosov's Diesel Repair | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 869 | Krystal Davis | OCR · 1 board(s): customer-01-b-customer-dialog-open | DATA |  | same text as hand-verified row "Krystal Davis" |
| 870 | L3B | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 871 | L7 | OCR · 1 board(s): card-01-b-wo-open | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 872 | LINER GEAR CLAMP | OCR · 4 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 873 | LT625 249 | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 874 | Lansing Truck & Trailer Repair | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 875 | Leland Diesel & Fleet Repair | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 876 | Lexington Park Diesel Repair | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 877 | Lightweight Shockproof | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 878 | Lindsay Perez | OCR · 1 board(s): customer-01-b-customer-dialog-open | DATA |  | same text as hand-verified row "Lindsay Perez" |
| 879 | Lines (2) | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 880 | Lines (5) | OCR · 2 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 881 | Lines (7) | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 882 | Location: 321 Ranchlands Court | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 883 | Locations: QA Testing | OCR · 2 board(s): sbr-11-a4-export-csv, sbr-12-a4-export-pdf-crop-1 | DATA |  | same text as hand-verified row "Locations: QA Testing" |
| 884 | Mantava | OCR · 1 board(s): card-19-n1-audit | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 885 | Mar 12, 2026 | OCR · 2 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 886 | Mar 3, 2026 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 887 | Mary Parker | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 888 | Michael Newman | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 889 | Michele Reed | OCR · 2 board(s): card-01-b-wo-open, phone-01-b-phone-open | DATA |  | same text as hand-verified row "Michele Reed" |
| 890 | Mobile Truck & Trailer Repair Magna | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 891 | Molly Howard | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 892 | Monroe Truck Service & Repair | OCR · 2 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 893 | Montoya | OCR · 1 board(s): card-19-n1-audit | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 894 | N G2ET-2 | OCR · 1 board(s): partsale-03-n3-list | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 895 | NG2ET-2 | OCR · 1 board(s): partsale-01-n3-rest | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 896 | Necart Fdae & Ransir | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 897 | New Julieshire | OCR · 12 board(s): customer-03-n2-edit, customer-04-n2-edit-list, customer-05-n2-edit-picked, customer-06-n2-add-tip… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 898 | New Julieshire, British Columbia | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 899 | Northline Haulage | OCR · 2 board(s): customer-17-n2-new-menu, customer-18-n2-new-ps | DATA |  | same text as hand-verified row "Northline Haulage" |
| 900 | Notes (1) | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 901 | Notes (2) | OCR · 17 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 902 | Oct 07 | OCR · 1 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 903 | Oct 07 2026 | OCR · 6 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off, sbr-09-a4-columns-on… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 904 | Oct 08 | OCR · 2 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 905 | Oct 08 2026 | OCR · 12 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off, sbr-09-a4-columns-on… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 906 | Oct 13, 2026 | OCR · 14 board(s): card-19-n1-audit | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 907 | Oct 21, 2025 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 908 | Oct 22, 2025 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 909 | P1-4 | OCR · 7 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off, sbr-09-a4-columns-on… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 910 | P1-9005 | OCR · 7 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off, sbr-09-a4-columns-on… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 911 | P1-9006 | OCR · 7 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off, sbr-09-a4-columns-on… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 912 | P2-161 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 913 | P2-204 ) | OCR · 1 board(s): partsale-01-n3-rest | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 914 | P2-204 ) (Gratin) | OCR · 2 board(s): partsale-03-n3-list, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 915 | P2-204 Genoa ) (Gratin) | OCR · 1 board(s): partsale-02-n3-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 916 | P2-84 | OCR · 1 board(s): partsale-00-b-ps | DATA |  | same text as hand-verified row "P2-84" |
| 917 | PEN350 | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 918 | Part Sales Contacts (4) | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 919 | Parts (1) | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 920 | Parts (2) | OCR · 6 board(s): card-00-b-wo-rest2, card-01-b-wo-open, partsale-01-n3-rest, partsale-02-n3-hover… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 921 | Parts (6) | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 922 | Parts (7) | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 923 | Payments (2) | OCR · 1 board(s): customer-00-b-customer-page | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 924 | Prestone 50/50 Coolant, | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 925 | Ps | OCR · 2 board(s): sbr-06-a4-filter-open, sbr-09-a4-columns-on | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 926 | QA Testing | OCR · 1 board(s): sbr-12-a4-export-pdf-crop-1 | DATA |  | same text as hand-verified row "QA Testing" |
| 927 | Qc | OCR · 2 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 928 | Quality control check over | OCR · 3 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-18-b-audit | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 929 | R9S 3N3 | OCR · 7 board(s): customer-04-n2-edit-list, customer-07-n2-add-menu, customer-08-n2-service-parts, customer-11-n2-ps-list… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 930 | ROS 3N3 | OCR · 2 board(s): customer-03-n2-edit, customer-05-n2-edit-picked | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 931 | Raystad | OCR · 1 board(s): customer-01-b-customer-dialog-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 932 | Raystad, British Columbia | OCR · 1 board(s): customer-00-b-customer-page | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 933 | Repair | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 934 | Repair - Install driveline from towing | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 935 | Repair LLC | OCR · 1 board(s): card-00-b-wo-rest2 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 936 | Replace - Axle #1 Right side wheel seal leaking | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 937 | Replace - Both engine belts | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 938 | Rraddacl Truclina (1) | OCR · 1 board(s): sbc-01-n5-sbc | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 939 | Rraddacl Truclina 2 Danair (1) | OCR · 1 board(s): sbc-02-n5-sbc-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 940 | Ruline Partners | OCR · 14 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off, sbr-09-a4-columns-on… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 941 | S 0.76 | OCR · 1 board(s): partsale-03-n3-list | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 942 | S 0.76( | OCR · 3 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 943 | S 26.85 | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 944 | S 4.24 | OCR · 1 board(s): partsale-03-n3-list | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 945 | S 4.24( | OCR · 3 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 946 | S 4.716 | OCR · 1 board(s): partsale-00-b-ps | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 947 | S 54.3: | OCR · 1 board(s): partsale-00-b-ps | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 948 | S 60.8! | OCR · 1 board(s): partsale-00-b-ps | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 949 | S$ 0.00 | OCR · 6 board(s): partsale-00-b-ps, partsale-02-n3-hover, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 950 | S$ 30.1: | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 951 | S$2-10819 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 952 | S$2-13499 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 953 | S$2-13759 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 954 | S$2-17387 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 955 | S$2-9133 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 956 | S2-16009 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 957 | S2-16862 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 958 | S2-17276 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 959 | S2-17346 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 960 | S2-17406 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 961 | S2-17407 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 962 | S2-17462 | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 963 | S2-17504 | OCR · 2 board(s): customer-15-n2-page-three, sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 964 | S2-8949 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 965 | S2-9582 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 966 | S2-9591 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 967 | Sep 12, 2025 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 968 | Sep 15, 2025 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 969 | Sep 28 2026 | OCR · 15 board(s): sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-08-a4-columns-off, sbr-09-a4-columns-on… | DATA |  | same text as hand-verified row "Sep 29 2026" |
| 970 | Sep 29 | OCR · 3 board(s): sbr-11-a4-export-csv | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 971 | Sep 29 2026 | OCR · 3 board(s): sbr-12-a4-export-pdf-crop-1 | DATA |  | same text as hand-verified row "Sep 29 2026" |
| 972 | Sep 5, 2025 | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 973 | Service - Boost unit | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 974 | Service - CVIP inspection single or t. | OCR · 2 board(s): card-18-b-audit | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 975 | Service - CVIP inspection single or tandem axle | OCR · 2 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 976 | Service - Mobile service call made by Ben Mills 587-839-9856 | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 977 | Service - Replace wiper blades | OCR · 3 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-18-b-audit | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 978 | Service - Wheels off single or tande. | OCR · 2 board(s): card-18-b-audit | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 979 | Service - Wheels off single or tandem axle | OCR · 2 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 980 | Services Inc | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 981 | ShapView | OCR · 1 board(s): sbr-12-a4-export-pdf-crop-1 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 982 | Shell Rotella T6, 5W40 | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 983 | Spanish Fork Diesel & Fleet Repair | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 984 | StaffPartsPricing | OCR · 14 board(s): partsale-00-b-ps, partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 985 | Staging Heavy Duty - 9919 © | OCR · 4 board(s): partsale-01-n3-rest, partsale-02-n3-hover, partsale-03-n3-list, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 986 | Started: Aug 24, 2026 | OCR · 4 board(s): card-00-b-wo-rest2, card-01-b-wo-open, phone-00-b-phone-details, phone-01-b-phone-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 987 | Started: Aug 27, 2026 | OCR · 21 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 988 | Started: Aug 28, 2026 | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 989 | Started: Jul 31, 2026 | OCR · 3 board(s): partsale-02-n3-hover, partsale-03-n3-list, partsale-04-n3-picked-hover | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 990 | Started: Jul 31,2026 | OCR · 1 board(s): partsale-01-n3-rest | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 991 | Started: May 14, 2026 | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 992 | Starting mileage:66,545kms | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 993 | Stebner's Truck Repair | OCR · 2 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 994 | Still has power | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 995 | Story | OCR · 27 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-02-n1-rest, card-03-n1-hover… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 996 | Streaking/ maintenence (Winter wiper blades as requested by customer) | OCR · 2 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 997 | Sublet - Windshield | OCR · 5 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-18-b-audit | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 998 | Synchromesh Manual | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 999 | TK: attempted to bring in unit will not move. | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1000 | TV: 1 active code for engine idle speed. engine runs then shuts down after a few moments going from smooth idle to rough idle. engine had Lots of blow by beyond spec. need to remove | OCR · 1 board(s): card-13-n1-remove-tip | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1001 | Total Hours: 1.2 hrs | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1002 | Total Hours: 13.0 hrs | OCR · 21 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1003 | Total Hours: 5.8 hrs | OCR · 4 board(s): card-00-b-wo-rest2, card-01-b-wo-open, phone-00-b-phone-details, phone-01-b-phone-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1004 | Totam dolor velit ratione dolorum | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1005 | Towed in | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1006 | Transmission Fluid, 946 | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1007 | Truck idle was low, would not move forward, just shut down. | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1008 | Una Truck Center | OCR · 1 board(s): partsale-00-b-ps | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1009 | Unde consectetur dolores consectetur tempore | OCR · 1 board(s): phone-00-b-phone-details | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1010 | Utility Trailer | OCR · 3 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1011 | V4M 8Y2 | OCR · 2 board(s): customer-00-b-customer-page, customer-01-b-customer-dialog-open | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 1012 | Vehicle L7 | OCR · 1 board(s): card-00-b-wo-rest2 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1013 | Vero quaerat minima animi vitae quos | OCR · 13 board(s): card-02-n1-rest, card-03-n1-hover, card-05-n1-picked, card-06-n1-picked-hover… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1014 | Vero quaerat minima animi vitae quos aut. Asperiores | OCR · 4 board(s): phone-02-n6-field, phone-04-n6-picked, phone-05-n6-add-menu, phone-06-n6-added | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1015 | Vero quaerat minima animi vitae quos aut. Asperiores dignissimos bland | OCR · 1 board(s): customer-12-n2-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1016 | Vero quaerat minima animi vitae quos aut. Asperiores dignissimos bland: | OCR · 1 board(s): customer-10-n2-three-added | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1017 | Vero quaerat minima animi vitae quos aut. Asperiores dignissimos blanditiis ratione | OCR · 7 board(s): customer-03-n2-edit, customer-05-n2-edit-picked, customer-06-n2-add-tip, customer-07-n2-add-menu… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1018 | Vero quaerat minima animi vitae quos aut. Asperiores dignissimos bland’ | OCR · 1 board(s): customer-13-n2-remove-tip | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1019 | Vitae | OCR · 2 board(s): card-04-n1-list, card-15-n1-unassign-list | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1020 | Vv | OCR · 9 board(s): partsale-02-n3-hover, phone-00-b-phone-details, phone-01-b-phone-open, phone-02-n6-field… | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 1021 | Western Star 49x Cha.. | OCR · 3 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1022 | William Parker | OCR · 4 board(s): card-00-b-wo-rest2, card-01-b-wo-open, phone-00-b-phone-details, phone-01-b-phone-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1023 | Work Orders (27) | OCR · 1 board(s): customer-15-n2-page-three | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1024 | Zero Truck and Trailer Repair | OCR · 1 board(s): sbr-03-b-sbr-expanded | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1025 | accusantium nemo. Unde consectetur | OCR · 1 board(s): card-00-b-wo-rest2 | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1026 | aliquid culpa autem. | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1027 | amet est rem. | OCR · 18 board(s): card-02-n1-rest, card-03-n1-hover, card-05-n1-picked, card-06-n1-picked-hover… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1028 | an | OCR · 1 board(s): customer-01-b-customer-dialog-open | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 1029 | ao | OCR · 1 board(s): card-07-n1-add-tip | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 1030 | as | OCR · 1 board(s): card-02-n1-rest | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 1031 | aut. Asperiores dignissimos blanditiis | OCR · 14 board(s): card-02-n1-rest, card-03-n1-hover, card-05-n1-picked, card-06-n1-picked-hover… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1032 | aw | OCR · 1 board(s): card-04-n1-list | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 1033 | coD | OCR · 12 board(s): customer-01-b-customer-dialog-open, customer-03-n2-edit, customer-04-n2-edit-list, customer-05-n2-edit-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1034 | dignissimos blanditiis ratione tempora recusandae. Vitae | OCR · 4 board(s): phone-02-n6-field, phone-04-n6-picked, phone-05-n6-add-menu, phone-06-n6-added | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1035 | dignissimos. Ipsa expedita ad labore | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1036 | dolores consectetur tempore | OCR · 2 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1037 | eee | OCR · 14 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1038 | iV} TV: 1 active code for engine idle speed. engine runs then shuts down after a few moments going from smooth idle to rough idle. engine had Lots of blow by beyond spec. need to remove | OCR · 1 board(s): card-11-n1-labor-list | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1039 | ie. Vitae | OCR · 1 board(s): phone-03-n6-list | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1040 | iores | OCR · 2 board(s): phone-03-n6-list, phone-07-n6-parts-list | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1041 | jan Wallace | OCR · 1 board(s): customer-11-n2-ps-list | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1042 | landitiis | OCR · 2 board(s): card-04-n1-list, card-15-n1-unassign-list | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1043 | ml | OCR · 1 board(s): partsale-00-b-ps | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 1044 | om | OCR · 2 board(s): sbr-02-b-sbr-columns, sbr-08-a4-columns-off | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 1045 | rae quos | OCR · 1 board(s): card-15-n1-unassign-list | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1046 | ratione | OCR · 3 board(s): customer-10-n2-three-added, customer-12-n2-three, customer-13-n2-remove-tip | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1047 | ratione tempora recusandae. Vitae | OCR · 14 board(s): card-02-n1-rest, card-03-n1-hover, card-05-n1-picked, card-06-n1-picked-hover… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1048 | rc | OCR · 1 board(s): partsale-03-n3-list | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 1049 | rerum voluptatibus vel neque. | OCR · 2 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1050 | so | OCR · 5 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 1051 | st | OCR · 1 board(s): card-08-n1-add-menu | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 1052 | tae quos | OCR · 2 board(s): card-04-n1-list, card-11-n1-labor-list | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1053 | tempora recusandae. Vitae amet est rem. | OCR · 10 board(s): customer-03-n2-edit, customer-05-n2-edit-picked, customer-06-n2-add-tip, customer-07-n2-add-menu… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1054 | ti) | OCR · 2 board(s): sbr-00-b-sbr, sbr-03-b-sbr-expanded | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 1055 | tices | OCR · 3 board(s): card-04-n1-list, card-11-n1-labor-list, card-15-n1-unassign-list | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1056 | tt) | OCR · 5 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-07-a4-sbr-labor-only… | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 1057 | v Becky Gonzales | OCR · 1 board(s): card-11-n1-labor-list | DATA | S1-R8 | same text as hand-verified row "Becky Gonzales" |
| 1058 | v Christian Wallace | OCR · 1 board(s): customer-11-n2-ps-list | DATA | S4-R3 | same text as hand-verified row "Christian Wallace" |
| 1059 | v Daniel Montoya | OCR · 1 board(s): card-15-n1-unassign-list | DATA | S1-R8 | same text as hand-verified row "Daniel Montoya" |
| 1060 | valve cover and check cam bridges, they are a common fail point on these engines. | OCR · 15 board(s): card-02-n1-rest, card-03-n1-hover, card-04-n1-list, card-05-n1-picked… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1061 | vel neque. | OCR · 2 board(s): phone-00-b-phone-details, phone-01-b-phone-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1062 | vel. Necessitatibus est omnis expedita | OCR · 1 board(s): card-17-n1-invoiced | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1063 | voluptates possimus. Cupiditate cum | OCR · 2 board(s): card-00-b-wo-rest2, card-01-b-wo-open | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1064 | voluptates possimus. Cupiditate cum rerum voluptatibus | OCR · 1 board(s): phone-00-b-phone-details | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1065 | vy Becky Gonzales | OCR · 1 board(s): phone-07-n6-parts-list | DATA | S1-R8 | same text as hand-verified row "Becky Gonzales" |
| 1066 | vy Debra Garcia | OCR · 1 board(s): phone-01-b-phone-open | DATA |  | same text as hand-verified row "Debra Garcia" |
| 1067 | we | OCR · 3 board(s): sbc-01-n5-sbc, sbr-06-a4-filter-open, sbr-09-a4-columns-on | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 1068 | www.lamberttrucking.com | OCR · 13 board(s): customer-03-n2-edit, customer-04-n2-edit-list, customer-05-n2-edit-picked, customer-06-n2-add-tip… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1069 | {) — Staging Heavy Duty - 9919 © | OCR · 6 board(s): card-00-b-wo-rest2, card-06-n1-picked-hover, card-09-n1-added, card-10-n1-added-hover… | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1070 | ¢€219 20 | OCR · 1 board(s): sbc-01-n5-sbc | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 1071 | © Location: QA Testing v | OCR · 7 board(s): sbr-04-a4-sbr-c, sbr-05-a4-sbr-expanded, sbr-06-a4-filter-open, sbr-07-a4-sbr-labor-only… | DATA |  | same text as hand-verified row "Location: QA Testing" |
| 1072 | © Location: Staging Heavy D... v | OCR · 6 board(s): sbc-00-b-sbc-filter, sbc-01-n5-sbc, sbc-02-n5-sbc-open, sbr-00-b-sbr… | DATA |  | same text as hand-verified row "Location: Staging Heavy D..." |
| 1073 | — Staging Heavy Duty - 9919 © | OCR · 1 board(s): card-02-n1-rest | DATA |  | record data (names, amounts, dates, ids, notes text, line content) |
| 1074 | “aw | OCR · 3 board(s): card-00-b-wo-rest2, card-01-b-wo-open, card-13-n1-remove-tip | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |
| 1075 | €1na1Q An | OCR · 1 board(s): sbc-02-n5-sbc-open | DATA |  | OCR fragment of an icon, badge or number (no word); the board was viewed by eye |

