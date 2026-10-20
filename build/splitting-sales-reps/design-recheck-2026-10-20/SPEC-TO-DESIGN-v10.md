# PRD v10 to design — Splitting Sales Representatives (20 Oct 2026)

Every PRD v10 (Confluence 919928833, 19 Oct 2026, Chris Ward) word or element a screen can show, checked against the design export of
19 Oct 2026 by LOOKING at the 68 board pictures (not only OCR). SHOWN / DIFFERENT (with the board) / NOT DRAWN. Each difference or
not-drawn element points at its row in `DESIGN-DIVERGENCE-REGISTER.json`.

Totals: 78 elements; DIFFERENT 9, NOT DRAWN 18, SHOWN 51. The machine check (`spec_to_design_check.py`, OCR + canvas texts as the design files) is in `spec-to-design-tool-run.txt`.

| # | PRD v10 | Kind | Element (PRD) | Result | Boards | Design shows | Register outcome | Cases |
|---|---|---|---|---|---|---|---|---|
| E01 | S1-R1 | position | Sales Representative field directly under Service Advisor | **SHOWN** | 1.2-1.16 | under Service Advisor | - | C665915, C666017 |
| E02 | S1-R2 | label | label "Sales Representative" on line 1, name on line 2, same style/size/weight/left edge as Lead Technician and Service Advisor | **SHOWN** | 1.2, 1.5 | same, x=36 | - | C666017 |
| E03 | S1-R3 | look at rest | no box, no dropdown arrow, no buttons at rest | **SHOWN** | 1.2, 1.5, 1.9, 1.12, 1.14, 1.16 | plain text | - | C666017, C666021 |
| E04 | S1-R4 | hover | hover shows the box on every Sales Representative field at once, same height/left edge as LT/SA, arrow and buttons together; they stay while a dropdown or the + menu is open or a field has keyboard focus | **SHOWN (focus NOT DRAWN)** | 1.3, 1.6, 1.8, 1.10, 1.11 | box on SR only; stays with list/menu open; no focus board | DESIGN-SILENT | C666018, C666021 |
| E05 | S1-R5 | spacing | box ends 16px before the 32px button column | **DIFFERENT** | 1.3, 1.6, 1.7, 1.10, 1.13 | about 22 px (16 px in the customer window) | PO-RULED | C666018 |
| E06 | S1-R6 | spacing | 16px between Lead Technician, Service Advisor and every Sales Representative field (one field, two fields, read-only) | **SHOWN** | 1.2, 1.9, 1.10, 1.17 | 16 px measured | - | C666017, C666021, C666024 |
| E07 | S1-R6a | message/layout | a Lead Technician message shows directly below the Lead Technician field and pushes the fields under it down | **NOT DRAWN** | - | no board shows a Lead Technician message | QUESTION-NEEDED | MISSING: GAP-8 (held) |
| E08 | S1-R7 | value | "Unassigned" with nobody assigned | **SHOWN** | 1.2, 1.16 | Unassigned | - | C665915, C666017, C666023 |
| E09 | S1-R8 | list rows | dropdown: "Unassigned" first, then every active rep A-Z by first, then last name | **SHOWN** | 1.4, 1.11, 1.15 | Unassigned, Becky Gonzales, Daniel Montoya, Gerald Ortiz | - | C665916, C666019 |
| E10 | S1-R9 | list state | the person in the field is checked; with nobody "Unassigned" is checked | **SHOWN** | 1.4, 1.11, 1.15 | tick + blue row | - | C666019 |
| E11 | S1-R10 | list | no x inside the field; picking "Unassigned" clears | **SHOWN** | 1.15, 1.16 |  | - | C665918, C666023 |
| E12 | S1-R11 | icon position | arrow at the right end, vertically centred (one field); bottom-right on the name line (two fields) | **SHOWN** | 1.6, 1.10, 1.13, 6.7 |  | - | C666018, C666021 |
| E13 | S1-R12 | list | no search box | **SHOWN** | 1.4, 2.4, 3.3, 6.3 |  | - | C666019 |
| E14 | S1-R15 | behaviour | dropdown closes on pick, click outside, Escape | **NOT DRAWN** | - | pictures cannot show closing | DESIGN-SILENT | C665917, C665919 |
| E15 | S1-N1 | read-only | no Create & Edit, invoiced, paid or history: plain text, same label and wording, no + / x | **SHOWN (invoiced only)** | 1.17 | invoiced card | - | C665920, C665932, C666024 |
| E16 | S1-N2 | message | "The selected staff member is not a sales representative." | **NOT DRAWN** | - |  | DESIGN-SILENT | C665923 |
| E17 | S1-N3 | message | error message after a failed save, field returns to the saved value | **NOT DRAWN** | - |  | DESIGN-SILENT | C665924 |
| E18 | S1-E2 | value | "(Inactive)" after the name, e.g. "Elliot Brennan (Inactive)"; no option checked | **NOT DRAWN** | - |  | DESIGN-SILENT | C665921, C665922 |
| E19 | S1-E3 | value | staff member gone or in another organization reads "Unassigned", never a bare "(Inactive)" | **NOT DRAWN** | - | developer-only (context note S6-N1) | DESIGN-SILENT | MISSING (behaviour, developer check): no case quotes S1-E3 |
| E20 | S2-R1 | button | + : Tertiary button, small icon-only, 32px square, 8px corners, Lucide plus at 20px | **SHOWN** | 1.3, 1.7 | 32x32, grey plus | - | C666018 |
| E21 | S2-R2 | button state | grey on no fill at rest; light fill on hover; fill stays while the menu is open | **SHOWN** | 1.3, 1.7, 1.8 |  | - | C666018, C666020 |
| E22 | S2-R3 | tooltip | "Add representative" on hover; not shown while the menu is open | **SHOWN** | 1.7, 1.8, 2.6 |  | - | C666020, C666026 |
| E23 | S2-R4 | menu rows | menu below the + with ONE option "Sales Representative - Parts"; outside click / Escape closes | **SHOWN (closing NOT DRAWN)** | 1.8, 6.5 | 1 row, right-aligned under the + | DESIGN-SILENT | C665927, C666020 |
| E24 | S2-R5 | labels/order | "Sales Representative - Labor" then "Sales Representative - Parts" | **SHOWN** | 1.9 |  | - | C665925, C666021 |
| E25 | S2-R6 | values | both start with the one field's person (or Unassigned) | **SHOWN** | 1.9 | both Becky | - | C665925, C665926 |
| E26 | S2-R7 | behaviour | neither dropdown opens on its own | **SHOWN** | 1.9 | no list open | - | C665925 |
| E27 | S2-R8 | button | remove x beside "Sales Representative - Parts": same Tertiary 32px button, Lucide x 20px, grey, light fill on hover | **SHOWN** | 1.10, 1.13 |  | - | C666021, C666022 |
| E28 | S2-R9 | tooltip | "Remove Sales Representative - Parts" | **SHOWN** | 1.13 |  | - | C666022 |
| E29 | S2-R10 | button | no + while two fields show; nothing beside Labor | **SHOWN** | 1.10 |  | - | C666021 |
| E30 | S2-R14 | label | both labels in full, never cut off | **SHOWN** | 1.9, 6.6 |  | - | C666021 |
| E31 | S2-R16 | result | remove x leaves one "Sales Representative" with the Labor person | **SHOWN** | 1.14 | Daniel Montoya | - | C665929, C666022 |
| E32 | S2-R17 | read-only labels | invoiced/paid/history: plain text, same label and wording, no + / x; both labels shown; ONLY the Sales Representative fields read as in S1-R2/S2-R5; Lead Technician and Service Advisor keep today's read-only labels | **SHOWN** | 1.17 | "Lead technician", "Service advisor", "Sales Representative - Labor", "Sales Representative - Parts" | PO-RULED | C665932, C666024, MISSING: GAP-1 (LT/SA labels) |
| E33 | S2-N2 | label | part sale keeps one field, no +; its label stays "Sales representative" and its look and behaviour do not change | **DIFFERENT** | 3.1-3.4 | label "Sales Representative" (capital R) | PO-RULED | C665935, C666030, MISSING: GAP-2 |
| E34 | S2-E4 | message | "The sales representative cannot be changed on an invoiced or paid work order." | **NOT DRAWN** | - |  | DESIGN-SILENT | C665933 |
| E35 | S2-E6 | behaviour | two screens: the later save wins; each screen shows what was saved | **NOT DRAWN** | - |  | DESIGN-SILENT | MISSING (behaviour): no case quotes S2-E6 |
| E36 | S3-R1 | list | tap opens the same dropdown Lead Technician and Service Advisor open on a phone, same options | **SHOWN** | 6.1, 6.3, 6.7 | same list as today's phone list | - | C665938, C666034 |
| E37 | S3-R2 | button | + and remove x always shown at 32px on a touch screen | **SHOWN** | 6.2, 6.4, 6.6 |  | - | C665938, C666034 |
| E38 | S3-R4 | phone look | on a touch screen the Sales Representative fields always show their dropdown arrow; LT/SA keep today's arrow-on-tap | **DIFFERENT** | 6.2, 6.6 | no arrow at rest; note 'At rest the rows read as plain text.' | PO-RULED | C665938, C666014, C666034 |
| E39 | S3-R5 | phone | Edit Customer / New Customer fields, + and x on a phone | **NOT DRAWN** | - |  | DESIGN-SILENT | C665939 |
| E40 | S3-R6 | phone control | card opens collapsed; fields show after the card is expanded with its edit button; expand control unchanged | **DIFFERENT (collapsed state NOT DRAWN)** | 6.0, 6.2-6.7 | 'Hide Details' toggle above the card on every phone board, today (6.0) and build | QUESTION-NEEDED | C665937, C665938, C666014, MISSING: GAP-5 (held) |
| E41 | S4-R1 | field/position | Edit Customer and New Customer: field in today's Edit Customer place, outlined box | **SHOWN** | 2.3, 2.16 | after Credit Terms/Limit; New Customer after State/Country | - | C665940, C665941, C666026, C666029 |
| E42 | S4-R3 | list rows | "Unassigned" first, then active reps A-Z by first, then last name; every one listed; no search; same list from a part sale | **DIFFERENT** | 2.4, 2.11 | Unassigned, Dylan Rush, Christian Wallace, Jason Garrison | PO-RULED | C665940, C666026 |
| E43 | S4-R3 | access | New Customer opened from a part sale by a part-sales-only user lists the reps | **NOT DRAWN** | - |  | DESIGN-SILENT | MISSING (behaviour): C665990 covers the work-order route only |
| E44 | S4-R4 | button | + and remove x always shown in the window; arrows centred; no x inside a field | **SHOWN** | 2.3-2.18 |  | - | C665940, C666026 |
| E45 | S4-R5 | tooltip | "Add representative" | **SHOWN** | 2.6 |  | - | C666026 |
| E46 | S4-R6 | menu rows | in this order, each field not yet added: "Sales Representative - Service Parts", "Sales Representative - Part Sales"; no + when both added | **SHOWN** | 2.7, 2.9, 2.10, 2.17 | 2 rows; 1 row after Service Parts; no + with three fields | - | C666026, C666027, C666029 |
| E47 | S4-R7 | label | "Sales Representative - Service Labor" / "Sales Representative - Service Parts", both the first field's person | **SHOWN** | 2.8 |  | - | C665942, C666027 |
| E48 | S4-R8 | label | "Sales Representative - Part Sales" last, starting with what new part sales get | **SHOWN** | 2.10, 2.18 |  | - | C665943, C666027, C666029 |
| E49 | S4-R9 | order | first field, Service Parts, Part Sales | **SHOWN** | 2.10, 2.12 |  | - | C666027 |
| E50 | S4-R10 | tooltip | "Remove Sales Representative - Service Parts" / "Remove Sales Representative - Part Sales"; first field has the + while something is left | **SHOWN (Part Sales tooltip NOT DRAWN)** | 2.13, 2.14 |  | DESIGN-SILENT | C665943, C666027 |
| E51 | S4-R11 | result | removing Service Parts renames the first field "Sales Representative"; Part Sales keeps its choice | **SHOWN** | 2.14 |  | - | C665944, C666027 |
| E52 | S4-R19 | page rows | customer page rows with the window's labels and order; empty reads Unassigned; rows show with or without an address | **SHOWN (no-address case NOT DRAWN)** | 2.3 (behind), 2.15 |  | - | C665947, C666028 |
| E53 | S4-R21 | dialog line | Deactivate window: "They will be removed as sales representative from {n} customer{s}." ("customer" when n is 1) in place of "Their customer assignments will stay where they are."; "Turn Off Sales Representative" warning unchanged, no count | **NOT DRAWN** | - |  | DESIGN-SILENT | C665957 / C665958 check the count only: wording MISSING (behaviour) |
| E54 | S4-R23 | file/columns | "Sales Representative Assignments", file sales-representative-assignments.csv, column Side after "Representative is active?", values "Parts and Service", "Service Labor", "Service Parts", "Part Sales", "Parts and Service, Part Sales" | **NOT DRAWN** | - |  | DESIGN-SILENT | C665960 (file name not checked) |
| E55 | S4-N2 | value | switch-off person reads "Name (Inactive)" in Edit Customer and on the customer page; no option checked | **NOT DRAWN** | - |  | DESIGN-SILENT | C665959 expects the plain name: now wrong |
| E56 | S4-E1 | value | "Unassigned" instead of "N/A" | **SHOWN** | 2.0 vs 2.3 | N/A today, Unassigned in the build | - | C665947, C666003 |
| E57 | S5-R6 | column | each split row shows its share of whole-invoice fees/discounts in its Adjustments column | **SHOWN** | 4.7, 4.11, 4.12 | Elliot S1-12 83.32, Devon S1-12 11.03 | - | MISSING: GAP-7 |
| E58 | S5-R10 | value | one person on both sides: one row "Labor, Parts" | **SHOWN** | 4.10, 4.11, 4.12 | S1-32 | - | C665969, C666031 |
| E59 | S5-R15 | cells | Labor row: parts columns dash; Parts row: labor, hours and Shop Supplies dash, not $0.00; a both-sides row keeps Labor Delta 0.0 with no labor | **DIFFERENT** | 4.5, 4.10 | dashes, but Shop Supplies $0.00 on Devon's Parts row | PO-RULED | C665962, C666031 |
| E60 | S5-R15a | cells | Part Sales row: Shop Supplies dash when no shop supplies charge; $0.00 only with a $0.00 charge | **DIFFERENT** | 4.5, 4.10, 4.11, 4.12 | $0.00 / 0.00 | PO-RULED | C665968, C666031 |
| E61 | S5-R9/S5-R15 | cells | Part Sales row labor columns (Labor Delta, Labor Invoiced, Labor Margin; hours in exports): PRD names no rule | **DIFFERENT (from today; PRD silent)** | 4.3 vs 4.5, 4.10, 4.11, 4.12 | today 0.00 / $0.00; build '—' on screen and PDF, blank in CSV | QUESTION-NEEDED | MISSING: GAP-3 (held) |
| E62 | S5-R16 | cells | summary rows show real sums, never dashes | **SHOWN** | 4.5, 4.7 |  | - | C665962, C666031 |
| E63 | S5-R19 | column order | "Sales Type" after Status and before Location (Status, Sales Type, Location); values "Labor", "Parts", "Part Sales", "Labor, Parts" | **SHOWN (Location NOT DRAWN)** | 4.9, 4.10 | after Status; no Location column on any board | DESIGN-SILENT | C665972, C666031, MISSING: GAP-6 |
| E64 | S5-R20 | picker | Sales Type first in the column selector | **SHOWN** | 4.8 |  | - | C665972, C666031 |
| E65 | S5-R21 | default | Sales Type off by default on screen | **SHOWN** | 4.4, 4.8 | tooltip covers the switch | PO-RULED | C665972, C666031 |
| E66 | S5-R23 | exports | Expanded CSV and PDF always carry Sales Type, after Status and before Location; non-credited cells blank (CSV) / dash (PDF) | **SHOWN (Location NOT DRAWN; Shop Supplies DIFFERENT)** | 4.11, 4.12 |  | DESIGN-SILENT | C665973, C666032, MISSING: GAP-6 |
| E67 | Answer 33 | exports | the same invoice dates on screen and in the exports | **DIFFERENT** | 4.10 vs 4.11, 4.12 | Sep 28 2026 on screen, Sep 29 2026 in both exports | PO-RULED | MISSING: GAP-4 |
| E68 | Story 6 | printout | printed row "Devon Whitfield", "(Inactive)", "(Parts) · ... (Labor)", "(Parts, inactive)", "(Labor, inactive)", "Unassigned (Labor)", row left off with nobody | **NOT DRAWN** | - | page 1 has no printout | DESIGN-SILENT | C665976, C665977, C665978, C665979, C665980 |
| E69 | S7-R1/R2/R3 | log | "Sales representative changed"; "Sales Representative: {before} → {after}"; Parts first, " · ", "Unassigned" for an empty side; adding Parts with the same person writes one entry | **SHOWN** | 1.19 | same wording with the design's sample names | SHOWN-WHEN-DRIVEN | C665981, C665982, C666025 |
| E70 | S7-R6 | log | gone / other-organization staff reads "Unassigned" in the entry | **NOT DRAWN** | - |  | DESIGN-SILENT | MISSING (behaviour, developer check): no case quotes S7-R6 |
| E71 | S8-R1 | menu rows | Sales Type filter options in order "Labor", "Parts", "Part Sales", all selected by default | **SHOWN** | 4.6 | plus 'Select all', '3 selected', 'Clear selection' (existing control) | - | C665984, C666031 (step 3 compares the menu with board 4.6) |
| E72 | S8-R3 | chip | "Sales Type: All"; "Sales Type: None"; selected names in option order e.g. "Sales Type: Labor, Parts" | **SHOWN ('All', 'Labor'); 'None' and two names NOT DRAWN** | 4.4, 4.7 |  | DESIGN-SILENT | C665984 |
| E73 | S8-R4 | exports | export filter line "Sales Type: All" or names; none selected: "Empty export", no file; other empty exports still download headings | **SHOWN ('Sales Type: All'); 'Empty export' NOT DRAWN** | 4.11, 4.12 |  | DESIGN-SILENT | C665985, C666032 |
| E74 | S8-R5 | empty state | no option selected: no invoices, the report's empty state | **NOT DRAWN (empty state drawn only for today's Product Type, 4.1)** | 4.1 | 'No record matches these filters' / 'Try changing filters to widen your results.' | DESIGN-SILENT | C665984 |
| E75 | S8-R6/R7 | chip/menu rows | Sales By Customer filter "Sales Type", options "Part Sales", "Service Sales" | **SHOWN** | 5.1, 5.2 | 'Select all', '2 selected', 'Part Sales', 'Service Sales', 'Clear selection' | PO-RULED | C665986, C665998, C666033 |
| E76 | S8-R8 | chip | "Sales Type: All Sales"; one option: its name; none: "Sales Type: No sales" | **SHOWN ('All Sales'); others NOT DRAWN** | 5.1, 5.2 |  | DESIGN-SILENT | C665986, C665998 |
| E77 | S8-R9 | exports | "Sales Type: All Sales", "Sales Type: Part Sales only", "Sales Type: Service Sales only"; "Empty export" | **NOT DRAWN** | - |  | DESIGN-SILENT | C665987 |
| E78 | Release day | export name | "Sales Rep Assignments" renamed "Sales Representative Assignments" | **NOT DRAWN** | - |  | DESIGN-SILENT | C665960 |

## By hand: every menu, list, dialog, tooltip and message, row by row (lesson L-02)

| Item | PRD v10 | PRD rows / options / buttons | Boards | Design rows / options / buttons | Verdict |
|---|---|---|---|---|---|
| Work order Sales Representative list (one field) | S1-R8, S1-R9, S1-R12 | Unassigned (checked when empty) · every active rep A-Z by first, then last name · no search · no buttons | 1.4, 1.15 | Unassigned ✓ · Becky Gonzales · Daniel Montoya · Gerald Ortiz · no search · no buttons | **SAME** |
| Work order Labor list / Parts list | S2-R11 | as above, per field; the other field's person is not removed | 1.11, 6.7 | Unassigned · Becky Gonzales ✓ · Daniel Montoya · Gerald Ortiz | **SAME** |
| Work order + menu | S2-R4 | 1 row: "Sales Representative - Parts" · below the + · no buttons | 1.8, 6.5 | 1 row "Sales Representative - Parts" · below the +, right-aligned · no buttons | **SAME** |
| Work order + tooltip | S2-R3 | "Add representative"; hidden while the menu is open | 1.7, 1.8 | "Add representative" below the +; gone when the menu is open | **SAME** |
| Work order remove x tooltip | S2-R9 | "Remove Sales Representative - Parts" | 1.13 | "Remove Sales Representative - Parts" | **SAME** |
| Invoiced (read-only) work order card | S2-R17, S1-N1 | LT and SA keep today's read-only labels · SR labels as editable · no + / x · no box on hover | 1.17 | "Lead technician" · "Service advisor" · "Sales Representative - Labor" · "Sales Representative - Parts" · no buttons | **SAME (v10)** |
| Work Order Log dialog | S7-R1-R3, Story 7 prerequisites | Event "Sales representative changed"; "Sales Representative: {before} → {after}"; opened from Audit Log | 1.19 | Title "Work Order Log", Search, close x; columns Event · User · Line · Details · Date · Time; Line "-"; bold "Sales Representative:" | **SAME (Line column design-only)** |
| Edit Customer / New Customer Sales Representative list | S4-R3 | Unassigned · every active rep A-Z by first, then last name · all listed · no search | 2.4, 2.11 | Unassigned ✓ · Dylan Rush · Christian Wallace · Jason Garrison | **DIFFERENT (order) - PO-RULED answer 15** |
| Customer + menu (nothing added) | S4-R6 | 2 rows in order: "Sales Representative - Service Parts" · "Sales Representative - Part Sales" | 2.7, 2.17 | same 2 rows, same order, right-aligned under the + | **SAME** |
| Customer + menu (Service Parts added) | S4-R6 | 1 row: "Sales Representative - Part Sales" | 2.9 | 1 row "Sales Representative - Part Sales" | **SAME** |
| Customer + menu (Part Sales added, Service Parts not) | S4-R6 | 1 row: "Sales Representative - Service Parts" | - | not drawn (2.14 shows the + back, menu closed) | **NOT DRAWN** |
| Customer + (both added) | S4-R6 | no + | 2.10 | no + | **SAME** |
| Customer + tooltip | S4-R5 | "Add representative" | 2.6 | "Add representative" | **SAME** |
| Customer remove x tooltips | S4-R10 | "Remove Sales Representative - Service Parts" · "Remove Sales Representative - Part Sales" | 2.13 | only "Remove Sales Representative - Service Parts" drawn | **SAME / Part Sales NOT DRAWN** |
| Part sale Sales Representative field and list | S2-N2 | label "Sales representative" · one field · no + / x · look and list unchanged (Part Sales Update v1) | 3.1-3.4 | label "Sales Representative" · Unassigned ✓ · Becky Gonzales · Daniel Montoya · Gerald Ortiz · no + / x | **DIFFERENT (label casing) - PO-RULED answer 7 + v10 S2-N2** |
| Deactivate window | S4-R21 | line "They will be removed as sales representative from {n} customer{s}." replacing "Their customer assignments will stay where they are." | - | not drawn | **NOT DRAWN** |
| Turn Off Sales Representative warning | S4-R21, S4-N2 | unchanged, no count | - | not drawn | **NOT DRAWN** |
| Error messages | S1-N2, S2-E4, S1-N3 | "The selected staff member is not a sales representative." · "The sales representative cannot be changed on an invoiced or paid work order." · the server's message | - | not drawn | **NOT DRAWN** |
| Sales By Representative Sales Type menu | S8-R1, S8-R3 | 3 options in order "Labor", "Parts", "Part Sales", all selected; chip "Sales Type: All" / names / "Sales Type: None" | 4.6, 4.7 | "Select all" · "3 selected" · Labor ✓ · Parts ✓ · Part Sales ✓ · "Clear selection"; chip ⓧ while open; "Sales Type: All", "Sales Type: Labor" | **SAME (+ 3 design-only rows of the existing control; 'None' not drawn)** |
| Sales By Representative column selector | S5-R20, S5-R21 | "Sales Type" first, off by default | 4.8, 4.9 | Sales Type · Labor Delta · Labor Invoiced · Labor Margin · Parts Invoiced · Parts Margin · Shop Supplies · Adjustments · Margin · Margin %; "Column Selection" tooltip covers the first switch | **SAME (overlap PO-RULED acceptable, answer 36)** |
| Sales By Representative columns on screen | S5-R19, S5-R21 | Sales Type off by default; when on: Status, Sales Type, Location | 4.4, 4.9 | Date · Invoice · Customer · Status · [Sales Type] · Labor Delta ... Adjustments · Margin · Subtotal; no Location column | **SAME (Location NOT DRAWN)** |
| Sales By Representative Expanded CSV | S5-R23, S8-R4 | Sales Type after Status and before Location; non-credited cells blank; filter line | 4.11 | Representative · Date · Invoice # · Customer · Status · Sales Type · Hrs Worked · Hrs Invoiced · Labor Delta ... Margin % · Subtotal; header lines Date Range / Sales Type: All / Invoice Status: All Statuses / Locations | **SAME (Shop Supplies 0.00 PO-RULED 24/25; dates PO-RULED 33; Location NOT DRAWN)** |
| Sales By Representative Expanded PDF | S5-R23, S8-R4 | as the CSV, dash for non-credited cells | 4.12 | same columns; '—'; title 'Sales By Representative Report', company, location, bold filter labels, logo | **SAME (same rulings)** |
| Empty export / empty state | S8-R4, S8-R5, S8-R9 | "Empty export", no file; empty state | 4.1, 5.0 (today only) | today's empty state 'No record matches these filters' / 'Try changing filters to widen your results.' | **NOT DRAWN for Sales Type** |
| Sales By Customer Sales Type menu | S8-R6-R8 | "Part Sales", "Service Sales"; chip "Sales Type: All Sales" / name / "Sales Type: No sales" | 5.1, 5.2 | "Select all" · "2 selected" · Part Sales ✓ · Service Sales ✓ · "Clear selection"; "Sales Type: All Sales" | **SAME (others not drawn)** |
| Phone Sales Representative list | S3-R1 | same dropdown as LT/SA on a phone, same options | 6.3, 6.7 | Unassigned ✓ · Becky Gonzales · Daniel Montoya · Gerald Ortiz (same look as today's 6.1) | **SAME** |
| Phone card expand control | S3-R6 | card opens collapsed; expanded with its edit button; control unchanged | 6.0, 6.2-6.7 | "Hide Details" toggle above the card (today and build); collapsed state not drawn | **DIFFERENT - QUESTION-NEEDED** |
