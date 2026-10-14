# DVI V2 — design text inventory triage, 14 Oct 2026 (Rule 124 gate (b))

**Main inventory** (`design_text_inventory.py`, 33 files + image/PDF transcription): 2133 distinct texts, 147 already in a case of ours, 1986 to classify.

**Supplementary inventory** (`scripts/supp.py`, lenient: catches what the shared tool drops — single words, lowercase texts containing a digit, and any sentence containing "this", "let", "var" or "const"; sources = every board and prototype, rendered sweep text, the 49 flow states, transcriptions): 566 extra distinct texts, 138 already in a case, 428 to classify.

**Classified: 2414 rows · UNCLASSIFIED: 0.** OUT-OF-SCOPE 1184 · DESIGN NOTE 674 · DATA 280 · COVERED 198 · SPEC-CONFLICT 75 · CASE-NEEDED 3

Classes: DATA (sample record content) · COVERED (C-id of the case that tests the behaviour) · OUT-OF-SCOPE (with the ruling) · DESIGN NOTE (designer caption, exploration, superseded draft, prototype chrome) · SPEC-CONFLICT (design differs from the PRD — Confluence 768507905, 14 Oct copy — PO question; the cases follow the PRD) · CASE-NEEDED (behaviour with a PRD source and no case). Expected results are never taken from the design (Rules 57, 113).

## SPEC-CONFLICT register

| ID | What | PRD says vs design | Cases affected |
|---|---|---|---|
| SC-01 | Explanatory helper sentences on product surfaces | PRD Key Decision: "Explanatory subtext is not added unless a requirement asks for it — no descriptor line, no hint paragraph, no helper sentence beyond what is specified."; S12-R14 "Validation rules will be explained on demand rather than as permanent text on the panel"; S12-R29 Axles control "explained on demand rather than in permanent text"; S12-R33 "Preview explains nothing about itself." | C88552, C88562, C88564, C88565, C88568, C88569, C88577, C88578 |
| SC-02 | Generated descriptor lines on the fill screen and Preview | S12-N3: "No surface the technician sees — the fill screen, and therefore Preview — carries a generated descriptor line summarising a field's configuration." | C88566, C88568, C88570 |
| SC-03 | Starter template names | S12-R4: "Class 8 Tractor PM Inspection, DOT / Annual Federal Safety Inspection, Air-Brake Inspection, Trailer Inspection and Light-Duty PM Inspection"; design TB1 shows "DOT Annual Federal Inspection", "Air Brake Inspection", "Light Duty PM" | C88563 |
| SC-04 | Per-axle canvas row does not say the technician adds axles while filling | S12-R18: "A per-axle field will list its measurement rows and note that the technician adds axles while filling." | C88566 |
| SC-05 | Row scope wording and a scope control on brake rows (prototype) | S8-R4/S8-R5: tire rows "'1 per side' or 'Outer + inner'… The two brake rows are always '1 per side'… the brake rows have no scope control"; Key Decision "One vocabulary for the row scope: \"1 per side\" and \"Outer + inner\", on every surface." Prototype offers "Every tire"/"Each side" on every row. | C88549, C88550, C88564 |
| SC-06 | Name of a new per-axle field (prototype) | S8-R2: "A new per-axle field will be named \"New axle measurements\""; prototype names it "Per axle measurements". | C88549 |
| SC-07 | Adding a measurement row (prototype) | S8-R7: "Adding a row offers only the row types the field does not already have, and the add control is not shown when all four are present"; prototype adds a generic "New measurement" row without limit (static TB2b complies). | C88550, C88564 |
| SC-08 | Follow-up toggle explained by permanent text (prototype) | S19-R11: "Both the section toggle and the acknowledgement toggle will be explained on demand, on an information affordance. Neither will carry permanent text on the panel." Prototype shows "A follow-up is text and one file, shown to the technician only when they give that response." under the toggle. | C88586 |
| SC-09 | Reference file types and size stated in advance (prototype, earlier drafts) | S11-R2/S11-R3: PDF, JPG, PNG, HEIC, Word and Excel accepted; "The size limit is not stated in advance… The limit is 20 MB." Prototype: "PDF, JPG or PNG · up to 10 MB" (static TB2 complies: "PDF, JPG, PNG, HEIC, Word or Excel"). | C88557 |
| SC-10 | Builder label of the always-visible attachment | S19-R12 / S11-R10: "labelled \"General reference file\" on every field type"; static TB2 and TB3 panels read "REFERENCE FILE" (CI boards and prototype read "GENERAL REFERENCE FILE"). | C88557, C88586 |
| SC-11 | Separate Open button on the reference file | S11-R11: "the name is a hyperlink that opens it in the viewer. There is no separate \"Open\" or \"View\" button"; M8 board and the Fill prototype show an "Open" button; the Template Builder prototype Preview shows "Open" (S12-R31: shown but cannot be opened). | C88558, C88578, C88568 |
| SC-12 | Mark OK levels and what the press reports (prototype) | S18-R1: "'Mark all OK', 'Mark section OK' and 'Mark field OK'. There is no axle level"; S18-R6: "counted in its own unit — fields at inspection and section level, positions on a field". Fill prototype has "Mark axle OK" and "Mark section OK" only, and reports "31 answers marked OK" for a section. | C88580, C88581 |
| SC-13 | Phone submit label (prototype) | S19-R25: "It is named 'Submit & Generate Report' on every surface"; S18-R11 keeps Back beside 'Submit & Generate Report'. Fill prototype phone shows "Review & Sign" (static M2/M3 comply). | C88590, C88582 |
| SC-14 | Acknowledgement can be cleared and keeps its label (prototype) | S19-R17: "a checkbox reading Acknowledge, becoming Acknowledged when set… the technician cannot clear it". Fill prototype unticks on a second press and never shows "Acknowledged" (CI3/CI4 comply). | C88588 |
| SC-15 | First axle: delete offered, clear action missing | S8-R20: "The first axle can never be deleted. It will carry a clear action that empties its readings and verdicts". Fill prototype shows "Remove this axle" on Axle 1 when more axles exist; no board draws the clear action (only Mark OK Exploration 1d "Clear axle"). | C88553, C88568 |
| SC-16 | Axles control range (prototype and board script) | S12-R29: "It defaults to 3 and offers 1 to 8"; S12-R31 "Add Axle stops at 8". Template Builder prototype and the TB board script offer 2 to 5. | C88569, C88568 |
| SC-17 | Tread depth default unit 32nds (prototypes) | S8-R3: "Defaults will be psi for tire pressure and inches for tread depth, brake lining and push-rod travel". Both prototypes and their data use 32nds ("4/32nds"); static boards now use in. | C88549 |
| SC-18 | Work Order Handoff prototype carries superseded findings and wording | S3-R4 findings list "naming each flagged row… followed by every flagged position on it with its reading"; S8-R26 one finding per flagged row; S3-R6 plain no-ShopCoach line; S5-R11 "N of M have findings with no lines yet". Prototype lists one position per finding with the value apart, says "The report is on the work order. Build the lines from the findings there." and "1 of 5 has findings with no lines yet" (static boards comply). | C88520, C88528 |
| SC-19 | Expanding axles one or all | S8-R22: "Axles can be expanded one at a time or all at once. Opening one will not collapse another." Fill prototype shows one axle at a time through tabs; no board has an expand-all control. | C88553 |
| SC-20 | Phone outstanding count drawn as a separate banner | S14-R6: "Outstanding required work will be surfaced on the action that completes the section, carrying a count, rather than as a separate banner". M5 and M8 draw a separate row "2 notes, 2 photos required" / "1 note, 1 photo required" above the section action (CI6/CI8 put the count on the action). | C88578, C88590 |
| SC-21 | Phone primary action and axles (PRD internally inconsistent) | S14-R4: "the primary action will advance to the next axle" vs S18-R11 "The footer stays section navigation and gains nothing". M4 follows S18-R11 ("Back: Section 1" / "Next: Section 2"). | C88577 |
| SC-22 | Template authoring drawn on a phone | PRD Out of scope: "Template authoring on mobile. The builder is a desktop tool"; S12 prerequisite "Template authoring is a desktop screen". CI9 draws the phone builder and the Template Builder prototype has a Phone switch. | none (cases are desktop-only); PO to confirm CI9 is out of scope |
| SC-23 | Reopen button in the completed-inspection footer | S3-R6: "With ShopCoach the card's footer will offer View PDF, Go to work order and Build lines… Without ShopCoach the footer will offer View PDF and Go to work order". Boards B, B3, P1, P1b add "Reopen". | C88519, C88520, C88522 |
| SC-24 | Monitor finding drafted as ordinary work | S15-E6: "A Monitor finding does not reach the panel as work to be done now. It arrives as a watch item the advisor can read as such." C2/P3 draft "Adjust slack adjuster" with 1 hr labour and a part from a Monitor finding, shown like any other line. | C88548 |
| SC-25 | Odometer asked as a template field (sample content) | Key Decision: "The meter reading is not a template field. The report fills Mileage and Hours from the work order". M1/M7 sample template has "Unit reading" "Enter the odometer reading". | none |
| SC-26 | Section collapse control has no PRD sentence | No PRD requirement describes collapsing a section on the fill screen ("Collapse section", "Expand section", "Show N fields"); PO ruling needed before any case (Rules 58, 64). | none |
| SC-27 | Single-axle report block has no scope heading | S13-R0: "The sub-tables are headed by scope, 'OUTER + INNER' and '1 PER SIDE'." The R1 PDF single axle (Axle 1 Single · Disc) prints one LEFT/RIGHT table with no scope heading. | C88554 |

## CASE-NEEDED register

| ID | What | Source and design | Cases |
|---|---|---|---|
| CN-01 | Outcome replaces Build lines on the completed inspection footer | S3-R8: "Once the inspection has been built from, the footer shows the outcome in place of Build lines: 'WO created S-235' or 'Lines added S-58', linking to that work order (S2-R13)". Design B3 ("WO created S-235"), B4b ("WO created S-200"), P1b ("Lines added S-58"). No case cites S3-R8; C88515 and C88524 still quote the superseded "asked to confirm before adding a second set". | new case; C88515, C88524 need the S2-R13 rewrite |
| CN-02 | Outcome replaces Build lines on the work order note | S4-R5: "Once the inspection has been built from, the note shows the outcome in place of Build lines, worded as in S3-R8 (S2-R13)". Design E2 ("Lines added S-58"). No case cites S4-R5. | new case; C88523/C88524 context |

## SPEC-CONFLICT — 75 rows

| # | Text | First seen (file:line) | Reason |
|---|---|---|---|
| 0 | Reference file · always available on this field | Digital Inspections - Marketing Slides-print.dc.html:94 | SC-01 Explanatory helper sentences on product surfaces |
| 1 | Every tire took OK from the press. Change one and only that tire changes. | Digital Inspections V2 - All Screens.dc.html:1080 | SC-01 Explanatory helper sentences on product surfaces |
| 2 | 3 fields still open; you can return any time | Digital Inspections V2 - All Screens.dc.html:1527 | SC-01 Explanatory helper sentences on product surfaces |
| 3 | Tap one to go straight to it | Digital Inspections V2 - All Screens.dc.html:1622 | SC-01 Explanatory helper sentences on product surfaces |
| 4 | Not OK on any position makes the row and the axle Not OK, and the field needs a note. | Digital Inspections V2 - All Screens.dc.html:1870 | SC-01 Explanatory helper sentences on product surfaces |
| 5 | Select a template to start building the inspection. | Digital Inspections V2 - All Screens.dc.html:286 | SC-01 Explanatory helper sentences on product surfaces |
| 6 | OK / Monitor / Not OK / N/A | Digital Inspections V2 - All Screens.dc.html:292 | SC-01 Explanatory helper sentences on product surfaces |
| 7 | Every row is recorded left and right, with a verdict per position. | Digital Inspections V2 - All Screens.dc.html:367 | SC-01 Explanatory helper sentences on product surfaces |
| 8 | rows do not. | Digital Inspections V2 - All Screens.dc.html:367 | SC-01 Explanatory helper sentences on product surfaces |
| 9 | The technician can open this while answering. Not included in the customer report. | Digital Inspections V2 - All Screens.dc.html:416 | SC-01 Explanatory helper sentences on product surfaces |
| 10 | 1.2 MB · not in the customer report | Digital Inspections V2 - All Screens.dc.html:581 | SC-01 Explanatory helper sentences on product surfaces |
| 11 | The outline stays, so you can preview one section at a time. | Digital Inspections V2 - All Screens.dc.html:622 | SC-01 Explanatory helper sentences on product surfaces |
| 12 | Tap a tire to jump to its value. Tint follows that tire's verdict. | Digital Inspections V2 - All Screens.dc.html:631 | SC-01 Explanatory helper sentences on product surfaces |
| 13 | Always available on this field, whatever the technician answers. | Inspection Template Builder V2 - Desktop.dc.html:383 | SC-01 Explanatory helper sentences on product surfaces |
| 14 | {…} · not in the customer report | Prototype - Template Builder.dc.html:249 | SC-01 Explanatory helper sentences on product surfaces |
| 15 | {{ refSize }} · not in the customer report | Prototype - Template Builder.dc.html:249 | SC-01 Explanatory helper sentences on product surfaces |
| 16 | 1.4 MB · not in the customer report | flow TB-12 | SC-01 Explanatory helper sentences on product surfaces |
| 17 | Select a field type to begin. You can reorder and edit it after. | transcribed/image-and-pdf-texts.txt:148 | SC-01 Explanatory helper sentences on product surfaces |
| 18 | Text answer that grows as you type | transcribed/image-and-pdf-texts.txt:150 | SC-01 Explanatory helper sentences on product surfaces |
| 19 | Measurement rows repeated per axle | transcribed/image-and-pdf-texts.txt:152 | SC-01 Explanatory helper sentences on product surfaces |
| 20 | Required photo evidence | transcribed/image-and-pdf-texts.txt:153 | SC-01 Explanatory helper sentences on product surfaces |
| 21 | Read-only callout for the tech | transcribed/image-and-pdf-texts.txt:154 | SC-01 Explanatory helper sentences on product surfaces |
| 22 | Each tire takes the worst verdict of the rows measuring it. Clicking one opens the same dropdown. | transcribed/image-and-pdf-texts.txt:471 | SC-01 Explanatory helper sentences on product surfaces |
| 23 | The note rule is on by default for new templates; the photo rule is not. Existing templates keep what they have. | transcribed/image-and-pdf-texts.txt:890 | SC-01 Explanatory helper sentences on product surfaces |
| 24 | Number + unit (default in.) | transcribed/image-and-pdf-texts.txt:908 | SC-01 Explanatory helper sentences on product surfaces |
| 25 | Select # of axles to start with | transcribed/image-and-pdf-texts.txt:917 | SC-01 Explanatory helper sentences on product surfaces |
| 26 | Checkbox · required to complete | Digital Inspections V2 - All Screens.dc.html:1212 | SC-02 Generated descriptor lines on the fill screen and Preview |
| 27 | PER AXLE · 2 axles | Digital Inspections V2 - All Screens.dc.html:1512 | SC-02 Generated descriptor lines on the fill screen and Preview |
| 28 | CHECKBOX · reference file | Digital Inspections V2 - All Screens.dc.html:1520 | SC-02 Generated descriptor lines on the fill screen and Preview |
| 29 | PER AXLE · 1 axle | Digital Inspections V2 - All Screens.dc.html:1592 | SC-02 Generated descriptor lines on the fill screen and Preview |
| 30 | Per axle · a verdict on every position | Prototype - Fill Inspection.dc.html:289 | SC-02 Generated descriptor lines on the fill screen and Preview |
| 31 | Note required if Monitor or Not OK | Prototype - Template Builder.dc.html:388 | SC-02 Generated descriptor lines on the fill screen and Preview |
| 32 | Checkbox · note required if Monitor or Not OK | transcribed/image-and-pdf-texts.txt:669 | SC-02 Generated descriptor lines on the fill screen and Preview |
| 33 | DOT Annual Federal Inspection | Digital Inspections V2 - All Screens.dc.html:286 | SC-03 Starter template names |
| 34 | Air Brake Inspection | Digital Inspections V2 - All Screens.dc.html:286 | SC-03 Starter template names |
| 35 | Light Duty PM | Digital Inspections V2 - All Screens.dc.html:286 | SC-03 Starter template names |
| 36 | Per axle · 3 measurements | Conditional Follow-up V2.dc.html:1330 | SC-04 Per-axle canvas row does not say the technician adds axles while filling |
| 37 | Per axle · Tire pressure (psi), Tread depth (in.), Brake lining (in.) | Conditional Follow-up V2.dc.html:301 | SC-04 Per-axle canvas row does not say the technician adds axles while filling |
| 38 | Per axle · 4 rows · verdict per tire | Digital Inspections V2 - All Screens.dc.html:344 | SC-04 Per-axle canvas row does not say the technician adds axles while filling |
| 39 | Per axle · Tire pressure (psi), Tread depth (in.), Brake lining (in.), Push-rod travel (in.) | Digital Inspections V2 - All Screens.dc.html:549 | SC-04 Per-axle canvas row does not say the technician adds axles while filling |
| 40 | Per axle · Tire pressure (psi), Tread depth (32nds), Brake lining (in.), Push-rod travel (in.) · 3 axles | sweep Prototype - Template Builder-pages.txt:32 | SC-04 Per-axle canvas row does not say the technician adds axles while filling |
| 41 | Every tire | Prototype - Template Builder.dc.html:233 | SC-05 Row scope wording and a scope control on brake rows (prototype) |
| 42 | Each side | Prototype - Template Builder.dc.html:233 | SC-05 Row scope wording and a scope control on brake rows (prototype) |
| 43 | Per axle measurements | Prototype - Template Builder.dc.html:319 | SC-06 Name of a new per-axle field (prototype) |
| 44 | Per axle · Tire pressure (psi), Tread depth (32nds), Brake lining (in.), Push-rod travel (in.), New measurement (in.) · 3 axles | flow TB-07 | SC-07 Adding a measurement row (prototype) |
| 45 | Per axle · Tire pressure (mm), Tread depth (32nds), Brake lining (in.), Push-rod travel (in.), New measurement (in.) · 3 axles | flow TB-07 | SC-07 Adding a measurement row (prototype) |
| 46 | Per axle · Tread depth (32nds), Brake lining (in.), Push-rod travel (in.), New measurement (in.) · 3 axles | flow TB-07 | SC-07 Adding a measurement row (prototype) |
| 47 | A follow-up is text and one file, shown to the technician only when they give that response. | Prototype - Template Builder.dc.html:217 | SC-08 Follow-up toggle explained by permanent text (prototype) |
| 48 | PDF, JPG or PNG · up to 10 MB | transcribed/image-and-pdf-texts.txt:872 | SC-09 Reference file types and size stated in advance (prototype, earlier drafts) |
| 49 | Mark axle OK | Digital Inspections - Marketing Slides-print.dc.html:146 | SC-12 Mark OK levels and what the press reports (prototype) |
| 50 | 10 positions marked OK | flow FI-01 | SC-12 Mark OK levels and what the press reports (prototype) |
| 51 | 31 answers marked OK | flow FI-02 | SC-12 Mark OK levels and what the press reports (prototype) |
| 52 | 2 answers marked OK | flow FI-10 | SC-12 Mark OK levels and what the press reports (prototype) |
| 53 | Review & Sign | transcribed/image-and-pdf-texts.txt:591 | SC-13 Phone submit label (prototype) |
| 54 | Remove this axle | Prototype - Fill Inspection.dc.html:169 | SC-15 First axle: delete offered, clear action missing |
| 55 | 4/32nds | Prototype - Work Order Handoff.dc.html:258 | SC-17 Tread depth default unit 32nds (prototypes) |
| 56 | Tread at 4/32nds, below the 5/32nds minimum. | Prototype - Work Order Handoff.dc.html:262 | SC-17 Tread depth default unit 32nds (prototypes) |
| 57 | Brake & tire measurements · Axle 1 · Tire pressure · left outer | Prototype - Work Order Handoff.dc.html:258 | SC-18 Work Order Handoff prototype carries superseded findings and wording |
| 58 | Brake & tire measurements · Axle 1 · Tread depth · left outer | Prototype - Work Order Handoff.dc.html:258 | SC-18 Work Order Handoff prototype carries superseded findings and wording |
| 59 | Axle 1 · Tire pressure · left outer | Prototype - Work Order Handoff.dc.html:259 | SC-18 Work Order Handoff prototype carries superseded findings and wording |
| 60 | Axle 1 · Tire pressure · left inner | Prototype - Work Order Handoff.dc.html:259 | SC-18 Work Order Handoff prototype carries superseded findings and wording |
| 61 | Axle 1 · Tread depth · left outer | Prototype - Work Order Handoff.dc.html:259 | SC-18 Work Order Handoff prototype carries superseded findings and wording |
| 62 | 1 of 5 has findings with no lines yet | Prototype - Work Order Handoff.dc.html:333 | SC-18 Work Order Handoff prototype carries superseded findings and wording |
| 63 | The report is on the work order. Build the lines from the findings there. | Prototype - Work Order Handoff.dc.html:87 | SC-18 Work Order Handoff prototype carries superseded findings and wording |
| 64 | 2 notes, 2 photos required | Digital Inspections V2 - All Screens.dc.html:1834 | SC-20 Phone outstanding count drawn as a separate banner |
| 65 | 1 note, 1 photo required | Digital Inspections V2 - All Screens.dc.html:2001 | SC-20 Phone outstanding count drawn as a separate banner |
| 66 | Inspection templates | Conditional Follow-up V2.dc.html:1321 | SC-22 Template authoring drawn on a phone |
| 67 | Adjust slack adjuster | Digital Inspections V2 - All Screens.dc.html:2485 | SC-24 Monitor finding drafted as ordinary work |
| 68 | Slack adjuster travel · Monitor | Digital Inspections V2 - All Screens.dc.html:2485 | SC-24 Monitor finding drafted as ordinary work |
| 69 | Travel out of range; confirm chamber and adjuster. | Digital Inspections V2 - All Screens.dc.html:2486 | SC-24 Monitor finding drafted as ordinary work |
| 70 | Unit reading | Digital Inspections V2 - All Screens.dc.html:1500 | SC-25 Odometer asked as a template field (sample content) |
| 71 | Enter the odometer reading | Digital Inspections V2 - All Screens.dc.html:1504 | SC-25 Odometer asked as a template field (sample content) |
| 72 | Collapse section | Digital Inspections V2 - All Screens.dc.html:628 | SC-26 Section collapse control has no PRD sentence |
| 73 | Expand section | Prototype - Fill Inspection.dc.html:492 | SC-26 Section collapse control has no PRD sentence |
| 74 | Show 2 fields | flow FI-14 | SC-26 Section collapse control has no PRD sentence |

## CASE-NEEDED — 3 rows

| # | Text | First seen (file:line) | Reason |
|---|---|---|---|
| 0 | S-235 | Digital Inspections V2 - All Screens.dc.html:2202 | CN-01 (outcome link "WO created S-235", B3) |
| 1 | Work order · Notes: lines already added from this inspection | Digital Inspections V2 - All Screens.dc.html:2729 | CN-02 (E2 "Lines added S-58" on the note; also P1b) |
| 2 | S-58 | Digital Inspections V2 - All Screens.dc.html:2806 | CN-02 (E2 "Lines added S-58" on the note; also P1b) |

## COVERED — 198 rows

| # | Text | First seen (file:line) | Reason |
|---|---|---|---|
| 0 | Edit Note | Conditional Follow-up V2.dc.html:637 | C88508 (S1-R3/R5 required note) |
| 1 | Describe what to watch and why | Conditional Follow-up V2.dc.html:702 | C88508 (S1-R3/R5 required note) |
| 2 | Why it is being monitored | Digital Inspections V2 - All Screens.dc.html:1580 | C88508 (S1-R3/R5 required note) |
| 3 | Note missing | flow FI-15 | C88508 (S1-R3/R5 required note) |
| 4 | a photo on every answer | Digital Inspections V2 - All Screens.dc.html:4787 | C88511 (S17-R7 builder summary sentence) |
| 5 | a photo when Not OK | Digital Inspections V2 - All Screens.dc.html:4788 | C88511 (S17-R7 builder summary sentence) |
| 6 | a note when Monitor or Not OK | Digital Inspections V2 - All Screens.dc.html:4789 | C88511 (S17-R7 builder summary sentence) |
| 7 | Nothing is enforced; the technician can leave this field untouched. | Digital Inspections V2 - All Screens.dc.html:4790 | C88511 (S17-R7 builder summary sentence) |
| 8 | The technician must provide | Digital Inspections V2 - All Screens.dc.html:4791 | C88511 (S17-R7 builder summary sentence) |
| 9 | The technician must provide an answer, a note when Monitor or Not OK. | flow TB-05 | C88511 (S17-R7 builder summary sentence) |
| 10 | The technician must provide an answer, a photo on every answer, a note when Monitor or Not OK. | flow TB-05 | C88511 (S17-R7 builder summary sentence) |
| 11 | The technician must provide an answer, a photo when Not OK, a note when Monitor or Not OK. | flow TB-05 | C88511 (S17-R7 builder summary sentence) |
| 12 | The technician must provide an answer, a photo when Not OK. | flow TB-05 | C88511 (S17-R7 builder summary sentence) |
| 13 | The technician must provide a note when Monitor or Not OK. | sweep Prototype - Template Builder-pages.txt:85 | C88511 (S17-R7 builder summary sentence) |
| 14 | or upload from your computer · JPG, PNG or HEIC | Digital Inspections V2 - All Screens.dc.html:1314 | C88511 (S17-R9 HEIC photos) |
| 15 | BUILD THE LINES ON | Digital Inspections V2 - All Screens.dc.html:2336 | C88513 (S2-R14 destination menu) |
| 16 | S-81 · Approved | Digital Inspections V2 - All Screens.dc.html:2339 | C88513 (S2-R14 destination menu) |
| 17 | Seeded with this customer & unit | Digital Inspections V2 - All Screens.dc.html:2343 | C88513 (S2-R14 destination menu) |
| 18 | 3 lines added to new work order S-82 | flow WO-02 | C88513 (S2-R14 destination menu) |
| 19 | Build the lines on | Prototype - Work Order Handoff.dc.html:237 | C88519 (S3-R3 phone target sheet) |
| 20 | Locked · read only | Digital Inspections V2 - All Screens.dc.html:2035 | C88520 (S3-R4/R5/R6/R7 summary card and section review) |
| 21 | 9 OK | Digital Inspections V2 - All Screens.dc.html:2047 | C88520 (S3-R4/R5/R6/R7 summary card and section review) |
| 22 | Brake & tire measurements · Axle 1 · Tire pressure: left outer 42 psi, right outer 40 psi | Digital Inspections V2 - All Screens.dc.html:2058 | C88520 (S3-R4/R5/R6/R7 summary card and section review) |
| 23 | Brake & tire measurements · Axle 1 · Tread depth: left outer 0.13 in. | Digital Inspections V2 - All Screens.dc.html:2062 | C88520 (S3-R4/R5/R6/R7 summary card and section review) |
| 24 | Note attached | Digital Inspections V2 - All Screens.dc.html:2067 | C88520 (S3-R4/R5/R6/R7 summary card and section review) |
| 25 | Three findings are on the customer report and in the work order note feed. Add the lines on the work order. | Digital Inspections V2 - All Screens.dc.html:2070 | C88520 (S3-R4/R5/R6/R7 summary card and section review) |
| 26 | ShopCoach can turn these 3 findings into work order lines with labor and parts. You review everything before it is added. | Digital Inspections V2 - All Screens.dc.html:2128 | C88520 (S3-R4/R5/R6/R7 summary card and section review) |
| 27 | every answer, section by section · read only | Digital Inspections V2 - All Screens.dc.html:2143 | C88520 (S3-R4/R5/R6/R7 summary card and section review) |
| 28 | 2 OK | Digital Inspections V2 - All Screens.dc.html:2708 | C88520 (S3-R4/R5/R6/R7 summary card and section review) |
| 29 | 4 Not OK | Digital Inspections V2 - All Screens.dc.html:2710 | C88520 (S3-R4/R5/R6/R7 summary card and section review) |
| 30 | read only | Digital Inspections V2 - All Screens.dc.html:3077 | C88520 (S3-R4/R5/R6/R7 summary card and section review) |
| 31 | 11 OK | Digital Inspections V2 - All Screens.dc.html:3102 | C88520 (S3-R4/R5/R6/R7 summary card and section review) |
| 32 | Brake & tire measurements · Axle 2 · Tread depth: right outer 0.09 in. | Digital Inspections V2 - All Screens.dc.html:3102 | C88520 (S3-R4/R5/R6/R7 summary card and section review) |
| 33 | This finding is on the customer report and in the work order note feed. The lines are added on the work order. | Digital Inspections V2 - All Screens.dc.html:3102 | C88520 (S3-R4/R5/R6/R7 summary card and section review) |
| 34 | · v2 · 2 sections, 6 fields | Digital Inspections V2 - All Screens.dc.html:2693 | C88523 (S4 report note) |
| 35 | Brake & Axle PM · completed | Prototype - Work Order Handoff.dc.html:189 | C88523 (S4 report note) |
| 36 | Completed inspection 1234 · v2 · 2 sections, 6 fields | sweep Digital Inspections V2 - All Screens-pages.txt:1523 | C88523 (S4 report note) |
| 37 | Technician Issues Work order Report Action | sweep Digital Inspections V2 - All Screens-pages.txt:1660 | C88527/C88532 (S5-R3 columns, S5-E1 not-started dashes) |
| 38 | PDF — | sweep Digital Inspections V2 - All Screens-pages.txt:1743 | C88527/C88532 (S5-R3 columns, S5-E1 not-started dashes) |
| 39 | Not started — — — | sweep Digital Inspections V2 - All Screens-pages.txt:1775 | C88527/C88532 (S5-R3 columns, S5-E1 not-started dashes) |
| 40 | 2 of 18 have findings with no lines yet | Digital Inspections V2 - All Screens.dc.html:2936 | C88528 (S5-R11 summary line) |
| 41 | Lines built from inspection | Digital Inspections V2 - All Screens.dc.html:2872 | C88537 (S7-R1/R2 provenance note, deleted work order tag) |
| 42 | · v2 · from work order | Digital Inspections V2 - All Screens.dc.html:2872 | C88537 (S7-R1/R2 provenance note, deleted work order tag) |
| 43 | Lines built from inspection 1234 · v2 · from work order S-100 | sweep Digital Inspections V2 - All Screens-pages.txt:1618 | C88537 (S7-R1/R2 provenance note, deleted work order tag) |
| 44 | Drafting lines from 3 findings | Digital Inspections V2 - All Screens.dc.html:2392 | C88543 (S15-R8/R9/R15 drafting) |
| 45 | Brake & Axle PM · Today 06:28 AM · about 10 seconds | Digital Inspections V2 - All Screens.dc.html:2393 | C88543 (S15-R8/R9/R15 drafting) |
| 46 | Nothing is added until you press Add Lines. | Digital Inspections V2 - All Screens.dc.html:2424 | C88543 (S15-R8/R9/R15 drafting) |
| 47 | Drafting lines from Brake & Axle PM | Prototype - Work Order Handoff.dc.html:140 | C88543 (S15-R8/R9/R15 drafting) |
| 48 | 3 findings · labor and parts from your catalog | Prototype - Work Order Handoff.dc.html:140 | C88543 (S15-R8/R9/R15 drafting) |
| 49 | Click any title, description, labor or part to edit it. Uncheck a line to leave it out. | Digital Inspections V2 - All Screens.dc.html:2455 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 50 | No parts | Digital Inspections V2 - All Screens.dc.html:2481 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 51 | 2.5 hrs labor · 3 parts | Digital Inspections V2 - All Screens.dc.html:2495 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 52 | no parts | Digital Inspections V2 - All Screens.dc.html:3097 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 53 | 3 of 3 selected · 2.5 hr labor · 3 parts | Digital Inspections V2 - All Screens.dc.html:3097 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 54 | Add 3 Lines to S-81 | Digital Inspections V2 - All Screens.dc.html:3097 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 55 | 3 lines drafted from | Digital Inspections V2 - All Screens.dc.html:3097 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 56 | Edit any title, description or labor. Uncheck a line to leave it out. | Prototype - Work Order Handoff.dc.html:148 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 57 | lines drafted from Brake & Axle PM · review before adding | Prototype - Work Order Handoff.dc.html:319 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 58 | selected · | Prototype - Work Order Handoff.dc.html:325 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 59 | hrs labor · | Prototype - Work Order Handoff.dc.html:325 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 60 | parts · nothing on the work order yet | Prototype - Work Order Handoff.dc.html:325 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 61 | 3 lines drafted from Brake & Axle PM · review before adding | flow WO-01 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 62 | 3 of 3 selected · 2.5 hrs labor · 3 parts · nothing on the work order yet | flow WO-01 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 63 | Add 3 Lines | flow WO-01 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 64 | 2 of 3 selected · 2.2 hrs labor · 3 parts · nothing on the work order yet | flow WO-01 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 65 | Add 2 Lines | flow WO-01 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 66 | 2 lines added to S-81 | flow WO-01 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 67 | 3 lines drafted from Brake & Axle PM · review before adding to a new work order | flow WO-02 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 68 | 2 of 3 selected · 1.3 hrs labor · 1 parts · nothing on the work order yet | flow WO-04 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 69 | 1 of 3 selected · 1.0 hrs labor · 1 parts · nothing on the work order yet | flow WO-04 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 70 | Add 1 Line | flow WO-04 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 71 | 3 lines added to S-81 | flow WO-07 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 72 | Title Description Labor Parts | sweep Digital Inspections V2 - All Screens-pages.txt:1346 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 73 | 3 lines drafted from Brake & Axle PM. Review before adding; edit or deselect any of them. | sweep Digital Inspections V2 - All Screens-pages.txt:1977 | C88544 (S15-R11/R12/R13/R26 proposed lines) |
| 74 | 0 of 3 selected · 0.0 hrs labor · 0 parts · nothing on the work order yet | flow WO-04 | C88547 (S15-N4 Add Lines unavailable when nothing is selected) |
| 75 | Add 0 Lines | flow WO-04 | C88547 (S15-N4 Add Lines unavailable when nothing is selected) |
| 76 | ShopCoach could not draft lines | Digital Inspections V2 - All Screens.dc.html:2522 | C88548 (S15-E1/E2) |
| 77 | Nothing was added to the work order. Try again, or add lines by hand. | Digital Inspections V2 - All Screens.dc.html:2523 | C88548 (S15-E1/E2) |
| 78 | Try again | Digital Inspections V2 - All Screens.dc.html:2525 | C88548 (S15-E1/E2) |
| 79 | No lines to propose | Digital Inspections V2 - All Screens.dc.html:2552 | C88548 (S15-E1/E2) |
| 80 | ShopCoach found nothing in this inspection to turn into a line. The work order was not changed. | Digital Inspections V2 - All Screens.dc.html:2553 | C88548 (S15-E1/E2) |
| 81 | 4 rows | Digital Inspections V2 - All Screens.dc.html:366 | C88550/C88564 (S8-R7, S12-R10 rows editor) |
| 82 | 3 rows | Digital Inspections V2 - All Screens.dc.html:479 | C88550/C88564 (S8-R7, S12-R10 rows editor) |
| 83 | + Add Measurement Row | Digital Inspections V2 - All Screens.dc.html:514 | C88550/C88564 (S8-R7, S12-R10 rows editor) |
| 84 | Delete row | Prototype - Template Builder.dc.html:229 | C88550/C88564 (S8-R7, S12-R10 rows editor) |
| 85 | no value yet | Digital Inspections V2 - All Screens.dc.html:4650 | C88551 (S8-R12 verdict menu names the position) |
| 86 | LEFT INNER TIRE · 98 psi | Digital Inspections V2 - All Screens.dc.html:802 | C88551 (S8-R12 verdict menu names the position) |
| 87 | fields · | Prototype - Fill Inspection.dc.html:488 | C88551 (S8-R12 verdict menu names the position) |
| 88 | Left outer tire · Tire pressure · 42 psi | flow FI-05 | C88551 (S8-R12 verdict menu names the position) |
| 89 | Next: Air system | sweep Prototype - Fill Inspection-pages.txt:95 | C88551 (S8-R12 verdict menu names the position) |
| 90 | 1 position Not OK | Digital Inspections V2 - All Screens.dc.html:940 | C88552 (S8-R25 field header counts positions) |
| 91 | 1 position Monitor | flow FD-02 | C88552 (S8-R25 field header counts positions) |
| 92 | + Add Axle | Digital Inspections V2 - All Screens.dc.html:631 | C88553 (S8-R10/R21 axles) |
| 93 | Drum · Dual · 12 of 12 positions | Digital Inspections V2 - All Screens.dc.html:912 | C88553 (S8-R10/R21 axles) |
| 94 | Drum · Dual · nothing inspected | Inspection Fill V2 - Desktop.dc.html:434 | C88553 (S8-R10/R21 axles) |
| 95 | Axle 4 | flow FI-06 | C88553 (S8-R10/R21 axles) |
| 96 | 0 of 12 positions | flow FI-06 | C88553 (S8-R10/R21 axles) |
| 97 | 2 of 12 positions | sweep Prototype - Fill Inspection-pages.txt:49 | C88553 (S8-R10/R21 axles) |
| 98 | Single · Disc | Inspection Report PDF.dc.html:66 | C88554 (S13-R0 per-axle report blocks) |
| 99 | Dual · Drum | Inspection Report PDF.dc.html:71 | C88554 (S13-R0 per-axle report blocks) |
| 100 | LEFT RIGHT | sweep Digital Inspections V2 - All Screens-pages.txt:2717 | C88554 (S13-R0 per-axle report blocks) |
| 101 | OUTER + INNER LEFT RIGHT | sweep Digital Inspections V2 - All Screens-pages.txt:2728 | C88554 (S13-R0 per-axle report blocks) |
| 102 | OUTER INNER INNER OUTER | sweep Digital Inspections V2 - All Screens-pages.txt:2729 | C88554 (S13-R0 per-axle report blocks) |
| 103 | 1 PER SIDE LEFT RIGHT | sweep Digital Inspections V2 - All Screens-pages.txt:2732 | C88554 (S13-R0 per-axle report blocks) |
| 104 | positions not inspected | Prototype - Fill Inspection.dc.html:439 | C88555 (submitting with unanswered fields) |
| 105 | Answer missing | flow FI-08 | C88555 (submitting with unanswered fields) |
| 106 | 30 positions not inspected | flow FI-08 | C88555 (submitting with unanswered fields) |
| 107 | PDF, JPG, PNG, HEIC, Word or Excel | Digital Inspections V2 - All Screens.dc.html:415 | C88557 (S11-R2/R3) |
| 108 | · Slack adjuster travel | Digital Inspections V2 - All Screens.dc.html:1389 | C88558 (S11-R4 full-page viewer with close and download) |
| 109 | Fit width | Digital Inspections V2 - All Screens.dc.html:1393 | C88558 (S11-R4 full-page viewer with close and download) |
| 110 | Remove file | Prototype - Template Builder.dc.html:200 | C88561 (S11-E2 replacing a file) |
| 111 | 3 fields | Conditional Follow-up V2.dc.html:300 | C88566 (S12-R16/R17 canvas rows) |
| 112 | Checkbox · OK / Monitor / Not OK / N/A · reference file · note required if Monitor / Not OK | Conditional Follow-up V2.dc.html:305 | C88566 (S12-R16/R17 canvas rows) |
| 113 | + Add Field | Conditional Follow-up V2.dc.html:314 | C88566 (S12-R16/R17 canvas rows) |
| 114 | 2 fields | Digital Inspections V2 - All Screens.dc.html:340 | C88566 (S12-R16/R17 canvas rows) |
| 115 | Per axle · | Prototype - Template Builder.dc.html:340 | C88566 (S12-R16/R17 canvas rows) |
| 116 | Checkbox · | Prototype - Template Builder.dc.html:342 | C88566 (S12-R16/R17 canvas rows) |
| 117 | Checkbox · OK / Not OK / N/A · reference file · note required if Not OK | flow TB-02 | C88566 (S12-R16/R17 canvas rows) |
| 118 | Checkbox · OK / Monitor / Not OK / N/A · reference file | flow TB-05 | C88566 (S12-R16/R17 canvas rows) |
| 119 | 4 fields | flow TB-06 | C88566 (S12-R16/R17 canvas rows) |
| 120 | 0 fields | flow TB-11 | C88566 (S12-R16/R17 canvas rows) |
| 121 | Checkbox · OK / Monitor / Not OK / N/A · note required if Monitor / Not OK | sweep Prototype - Template Builder-pages.txt:43 | C88566 (S12-R16/R17 canvas rows) |
| 122 | Inspection · 2 sections · 3 fields · nothing inspected yet | Digital Inspections V2 - All Screens.dc.html:626 | C88568 (S12-R25/R31 Preview mounts the fill screen) |
| 123 | 2 fields · 0 of 36 positions | Digital Inspections V2 - All Screens.dc.html:628 | C88568 (S12-R25/R31 Preview mounts the fill screen) |
| 124 | Drum · Dual | Digital Inspections V2 - All Screens.dc.html:631 | C88568 (S12-R25/R31 Preview mounts the fill screen) |
| 125 | L OUTER | Prototype - Template Builder.dc.html:393 | C88568 (S12-R25/R31 Preview mounts the fill screen) |
| 126 | L INNER | Prototype - Template Builder.dc.html:393 | C88568 (S12-R25/R31 Preview mounts the fill screen) |
| 127 | R INNER | Prototype - Template Builder.dc.html:393 | C88568 (S12-R25/R31 Preview mounts the fill screen) |
| 128 | R OUTER | Prototype - Template Builder.dc.html:393 | C88568 (S12-R25/R31 Preview mounts the fill screen) |
| 129 | Select a field to edit its properties. | Prototype - Template Builder.dc.html:165 | C88571/C88562 (S12-E2 panel clears; S12-R1/E1 add-section control) |
| 130 | + Add Section | Prototype - Template Builder.dc.html:60 | C88571/C88562 (S12-E2 panel clears; S12-R1/E1 add-section control) |
| 131 | Section 3 | flow TB-11 | C88571/C88562 (S12-E2 panel clears; S12-R1/E1 add-section control) |
| 132 | Measured: 125 psi | Inspection Report PDF.dc.html:101 | C88572/C88592 (S13 report wording; S19-N3 instruction and acknowledgement on the report, no file) |
| 133 | INSTRUCTION FOR NOT OK | Inspection Report PDF.dc.html:85 | C88572/C88592 (S13 report wording; S19-N3 instruction and acknowledgement on the report, no file) |
| 134 | Acknowledged by Marcus Bell · Sep 24, 2026 9:24 AM | Inspection Report PDF.dc.html:87 | C88572/C88592 (S13 report wording; S19-N3 instruction and acknowledgement on the report, no file) |
| 135 | INSTRUCTION FOR MONITOR | Inspection Report PDF.dc.html:93 | C88572/C88592 (S13 report wording; S19-N3 instruction and acknowledgement on the report, no file) |
| 136 | Acknowledged by Marcus Bell · Sep 24, 2026 9:31 AM | Inspection Report PDF.dc.html:96 | C88572/C88592 (S13 report wording; S19-N3 instruction and acknowledgement on the report, no file) |
| 137 | VIN/SERIAL | Inspection Report PDF.dc.html:49 | C88574 (S13-R9/R10 customer and asset panel; Key Decision: Mileage and Hours from the work order) |
| 138 | MILEAGE | Inspection Report PDF.dc.html:51 | C88574 (S13-R9/R10 customer and asset panel; Key Decision: Mileage and Hours from the work order) |
| 139 | HOURS | Inspection Report PDF.dc.html:52 | C88574 (S13-R9/R10 customer and asset panel; Key Decision: Mileage and Hours from the work order) |
| 140 | 8 of 8 positions | Conditional Follow-up V2.dc.html:1185 | C88577 (S14-R1/S8-R23 per-axle on a phone) |
| 141 | Left outer · Not OK | Digital Inspections V2 - All Screens.dc.html:1788 | C88577 (S14-R1/S8-R23 per-axle on a phone) |
| 142 | Left inner · OK | Digital Inspections V2 - All Screens.dc.html:1789 | C88577 (S14-R1/S8-R23 per-axle on a phone) |
| 143 | Right inner · OK | Digital Inspections V2 - All Screens.dc.html:1790 | C88577 (S14-R1/S8-R23 per-axle on a phone) |
| 144 | Right outer · Monitor | Digital Inspections V2 - All Screens.dc.html:1791 | C88577 (S14-R1/S8-R23 per-axle on a phone) |
| 145 | Right outer · OK | Digital Inspections V2 - All Screens.dc.html:1810 | C88577 (S14-R1/S8-R23 per-axle on a phone) |
| 146 | Left brake · OK | Digital Inspections V2 - All Screens.dc.html:1826 | C88577 (S14-R1/S8-R23 per-axle on a phone) |
| 147 | Right brake · OK | Digital Inspections V2 - All Screens.dc.html:1827 | C88577 (S14-R1/S8-R23 per-axle on a phone) |
| 148 | Axle 1 · Tire pressure · 42 psi entered | Digital Inspections V2 - All Screens.dc.html:1860 | C88577 (S14-R1/S8-R23 per-axle on a phone) |
| 149 | SECTION 1 OF 2 · FIELD 3 OF 3 | Digital Inspections V2 - All Screens.dc.html:1893 | C88577 (S14-R1/S8-R23 per-axle on a phone) |
| 150 | Go to the first one | Conditional Follow-up V2.dc.html:1042 | C88578 (S14-R6/R7 phone outstanding work) |
| 151 | Section 1 of 2 | Conditional Follow-up V2.dc.html:1177 | C88578 (S14-R6/R7 phone outstanding work) |
| 152 | 2 of 3 answered | Conditional Follow-up V2.dc.html:1177 | C88578 (S14-R6/R7 phone outstanding work) |
| 153 | Not answered | Conditional Follow-up V2.dc.html:1226 | C88578 (S14-R6/R7 phone outstanding work) |
| 154 | 0 / 3 fields | Digital Inspections V2 - All Screens.dc.html:1489 | C88578 (S14-R6/R7 phone outstanding work) |
| 155 | 2 / 3 fields | Digital Inspections V2 - All Screens.dc.html:1549 | C88578 (S14-R6/R7 phone outstanding work) |
| 156 | Section 1 · Tire pressure · left outer | Digital Inspections V2 - All Screens.dc.html:1629 | C88578 (S14-R6/R7 phone outstanding work) |
| 157 | Section 1 · Tread depth · left outer | Digital Inspections V2 - All Screens.dc.html:1639 | C88578 (S14-R6/R7 phone outstanding work) |
| 158 | Section 2 · Slack adjuster travel | Digital Inspections V2 - All Screens.dc.html:1644 | C88578 (S14-R6/R7 phone outstanding work) |
| 159 | 3 fields · 0 of 38 positions | Digital Inspections V2 - All Screens.dc.html:1052 | C88580 (S18 inspection and section rows carrying Mark OK) |
| 160 | Inspection · 2 sections · 5 fields · nothing inspected yet | Digital Inspections V2 - All Screens.dc.html:707 | C88580 (S18 inspection and section rows carrying Mark OK) |
| 161 | 2 fields · 0 of 24 positions | Digital Inspections V2 - All Screens.dc.html:707 | C88580 (S18 inspection and section rows carrying Mark OK) |
| 162 | 2 fields · 2 complete | flow FI-02 | C88580 (S18 inspection and section rows carrying Mark OK) |
| 163 | 2 fields · 1 complete | flow FI-04 | C88580 (S18 inspection and section rows carrying Mark OK) |
| 164 | Inspection · 2 sections · 5 fields · 3 of 5 inspected | Digital Inspections V2 - All Screens.dc.html:1076 | C88581 (S18-R6/R7 what the press covered, Undo) |
| 165 | 3 fields · 38 of 38 positions | Digital Inspections V2 - All Screens.dc.html:1078 | C88581 (S18-R6/R7 what the press covered, Undo) |
| 166 | 3 fields marked OK | Digital Inspections V2 - All Screens.dc.html:1078 | C88581 (S18-R6/R7 what the press covered, Undo) |
| 167 | 36 positions marked OK | Digital Inspections V2 - All Screens.dc.html:1080 | C88581 (S18-R6/R7 what the press covered, Undo) |
| 168 | 1 position marked OK | Digital Inspections V2 - All Screens.dc.html:1082 | C88581 (S18-R6/R7 what the press covered, Undo) |
| 169 | positions marked OK | Prototype - Fill Inspection.dc.html:356 | C88581 (S18-R6/R7 what the press covered, Undo) |
| 170 | 2 positions marked OK | flow FD-01 | C88581 (S18-R6/R7 what the press covered, Undo) |
| 171 | WHOLE INSPECTION | Digital Inspections V2 - All Screens.dc.html:1538 | C88582 (S18-R10/R11 explanations and phone surfaces) |
| 172 | still Not inspected. Verdicts already picked stay. Values are never filled in. | Digital Inspections V2 - All Screens.dc.html:4752 | C88582 (S18-R10/R11 explanations and phone surfaces) |
| 173 | Marks every position in this field OK. | Digital Inspections V2 - All Screens.dc.html:4752 | C88582 (S18-R10/R11 explanations and phone surfaces) |
| 174 | Field properties | Conditional Follow-up V2.dc.html:116 | C88584 (S19-R1/R3 follow-up switch and blocks) |
| 175 | RESPONSE SETTINGS | Conditional Follow-up V2.dc.html:127 | C88584 (S19-R1/R3 follow-up switch and blocks) |
| 176 | Instruction the technician sees | Conditional Follow-up V2.dc.html:146 | C88584 (S19-R1/R3 follow-up switch and blocks) |
| 177 | Rename response | Conditional Follow-up V2.dc.html:121 | C88585 (S19-R7 renamed answers) |
| 178 | Adds text and one file to a single response. The technician sees it only when they give that response. | Conditional Follow-up V2.dc.html:511 | C88586 (S19-R10/R11 canvas list and on-demand explanations) |
| 179 | The technician confirms they have read this follow-up before the inspection can be submitted. On by default for Monitor and Not OK. | Conditional Follow-up V2.dc.html:519 | C88586 (S19-R10/R11 canvas list and on-demand explanations) |
| 180 | No text yet | Prototype - Template Builder.dc.html:375 | C88586 (S19-R10/R11 canvas list and on-demand explanations) |
| 181 | Hide | Prototype - Fill Inspection.dc.html:122 | C88587 (S19-R15 instruction collapsed on OK/N/A) |
| 182 | Section 2 of 2 · 3 fields | Conditional Follow-up V2.dc.html:1010 | C88590 (S19-R24/R25 outstanding list) |
| 183 | 4 items before submitting | Conditional Follow-up V2.dc.html:1017 | C88590 (S19-R24/R25 outstanding list) |
| 184 | Section 1 · Brake chamber condition · Not OK | Conditional Follow-up V2.dc.html:1023 | C88590 (S19-R24/R25 outstanding list) |
| 185 | Section 2 · Air-brake system leak check · Monitor | Conditional Follow-up V2.dc.html:1028 | C88590 (S19-R24/R25 outstanding list) |
| 186 | Section 1 · Brake chamber condition | Conditional Follow-up V2.dc.html:1033 | C88590 (S19-R24/R25 outstanding list) |
| 187 | Section 2 · Trailer axle measurements · 8 positions | Conditional Follow-up V2.dc.html:1038 | C88590 (S19-R24/R25 outstanding list) |
| 188 | 3 items before submitting | Conditional Follow-up V2.dc.html:1093 | C88590 (S19-R24/R25 outstanding list) |
| 189 | Read the instruction and check Acknowledge to complete this inspection. | Conditional Follow-up V2.dc.html:675 | C88590 (S19-R24/R25 outstanding list) |
| 190 | 5 items before submitting | Digital Inspections V2 - All Screens.dc.html:1621 | C88590 (S19-R24/R25 outstanding list) |
| 191 | items missing | Prototype - Fill Inspection.dc.html:437 | C88590 (S19-R24/R25 outstanding list) |
| 192 | Section 1 · Brake & tire measurements · 30 positions | flow FI-08 | C88590 (S19-R24/R25 outstanding list) |
| 193 | Section 2 · Air-brake system leak check | flow FI-08 | C88590 (S19-R24/R25 outstanding list) |
| 194 | Section 2 · Low-air warning buzzer | flow FI-08 | C88590 (S19-R24/R25 outstanding list) |
| 195 | Section 2 · Air-brake system leak check · Not OK | flow FI-15 | C88590 (S19-R24/R25 outstanding list) |
| 196 | Preview · Section 1 of 2 | Conditional Follow-up V2.dc.html:1127 | C88591 (S19-R27 every follow-up named in Preview) |
| 197 | On Not OK | Conditional Follow-up V2.dc.html:1142 | C88591 (S19-R27 every follow-up named in Preview) |

## DATA — 280 rows

| # | Text | First seen (file:line) | Reason |
|---|---|---|---|
| 0 | SERVICE BULLETIN | Digital Inspections V2 - All Screens.dc.html:1404 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 1 | Slack Adjuster Travel, Measurement Procedure | Digital Inspections V2 - All Screens.dc.html:1407 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 2 | Applies to air-brake foundation assemblies on tractors and trailers. | Digital Inspections V2 - All Screens.dc.html:1408 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 3 | Free stroke and applied stroke must both be measured with the system at full reservoir pressure. Chock the wheels and release the parking br | Digital Inspections V2 - All Screens.dc.html:1409 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 4 | Before you start | Digital Inspections V2 - All Screens.dc.html:1410 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 5 | Air pressure at or above 90 psi. Engine off. Wheels chocked. Parking brake released and the transmission in neutral. | Digital Inspections V2 - All Screens.dc.html:1411 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 6 | Measuring free stroke | Digital Inspections V2 - All Screens.dc.html:1412 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 7 | Mark the push rod where it leaves the chamber with the brakes fully released. | Digital Inspections V2 - All Screens.dc.html:1413 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 8 | Using a lever, move the slack adjuster until the shoes contact the drum. | Digital Inspections V2 - All Screens.dc.html:1414 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 9 | Measure between the mark and the chamber face. Free stroke should read between 3/8 in. and 5/8 in. | Digital Inspections V2 - All Screens.dc.html:1415 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 10 | Measuring applied stroke | Digital Inspections V2 - All Screens.dc.html:1416 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 11 | Have an assistant make a full brake application and hold it. | Digital Inspections V2 - All Screens.dc.html:1417 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 12 | Measure the total travel of the push rod. Compare against the chamber size table on page 2. | Digital Inspections V2 - All Screens.dc.html:1418 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 13 | Record both figures on the inspection. Travel beyond the readjustment limit is an out-of-service condition under FMCSA Appendix G. | Digital Inspections V2 - All Screens.dc.html:1419 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 14 | Readjustment limits by chamber size | Digital Inspections V2 - All Screens.dc.html:1426 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 15 | OUTSIDE DIA. | Digital Inspections V2 - All Screens.dc.html:1427 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 16 | CHAMBER | Digital Inspections V2 - All Screens.dc.html:1427 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 17 | Measure the outside diameter of the chamber to identify the type when the stamping is not legible. If the reading is within 1/8 in. of the l | Digital Inspections V2 - All Screens.dc.html:1433 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 18 | Common causes of excessive travel | Digital Inspections V2 - All Screens.dc.html:1434 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 19 | Worn brake lining, a stretched or misaligned push rod, a seized automatic slack adjuster, or a chamber diaphragm that has begun to leak. Rep | Digital Inspections V2 - All Screens.dc.html:1435 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 20 | Recording the result | Digital Inspections V2 - All Screens.dc.html:1442 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 21 | Enter both figures on the inspection against the axle and position measured. A position beyond the readjustment limit is Not OK, requires a  | Digital Inspections V2 - All Screens.dc.html:1443 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 22 | Out-of-service criteria | Digital Inspections V2 - All Screens.dc.html:1444 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 23 | Under FMCSA Appendix G a vehicle is placed out of service when 20 percent or more of the brakes on the unit are defective. A single brake be | Digital Inspections V2 - All Screens.dc.html:1445 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 24 | Torque values | Digital Inspections V2 - All Screens.dc.html:1446 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 25 | Clamp band | Digital Inspections V2 - All Screens.dc.html:1447 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 26 | Chamber mounting nuts | Digital Inspections V2 - All Screens.dc.html:1448 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 27 | Slack adjuster clevis | Digital Inspections V2 - All Screens.dc.html:1449 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 28 | Re-check free stroke after any adjuster or chamber replacement, and again after a short road test. | Digital Inspections V2 - All Screens.dc.html:1450 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 29 | Bulletin SB-2024-11 · supersedes SB-2019-04 · for reference only, always follow the manufacturer's current service literature. | Digital Inspections V2 - All Screens.dc.html:1451 | DATA — content of the sample attached PDF shown in the D4 viewer |
| 30 | Tire pressure 82 psi | sweep Digital Inspections V2 - All Screens-pages.txt:2718 | DATA — rendered report row values |
| 31 | Tread depth 0.13 in. | sweep Digital Inspections V2 - All Screens-pages.txt:2720 | DATA — rendered report row values |
| 32 | Brake pad 0.38 in. 0.36 in. | sweep Digital Inspections V2 - All Screens-pages.txt:2723 | DATA — rendered report row values |
| 33 | Push-rod travel 1.6 in. 1.5 in. | sweep Digital Inspections V2 - All Screens-pages.txt:2724 | DATA — rendered report row values |
| 34 | Tread depth 0.34 in. 0.38 in. 0.38 in. 0.34 in. | sweep Digital Inspections V2 - All Screens-pages.txt:2731 | DATA — rendered report row values |
| 35 | Tire pressure 102 psi 104 psi — 103 psi | sweep Digital Inspections V2 - All Screens-pages.txt:2740 | DATA — rendered report row values |
| 36 | Tread depth 0.31 in. 0.34 in. 0.34 in. 0.31 in. | sweep Digital Inspections V2 - All Screens-pages.txt:2741 | DATA — rendered report row values |
| 37 | Brake lining 0.40 in. 0.41 in. | sweep Digital Inspections V2 - All Screens-pages.txt:2743 | DATA — rendered report row values |
| 38 | Push-rod travel 1.7 in. 1.7 in. | sweep Digital Inspections V2 - All Screens-pages.txt:2744 | DATA — rendered report row values |
| 39 | Tread depth 32nds NOT OK | transcribed/image-and-pdf-texts.txt:633 | DATA — rendered report row values |
| 40 | Brake pad 0.38 in. / 0.36 in. | transcribed/image-and-pdf-texts.txt:75 | DATA — rendered report row values |
| 41 | Tread depth 32nds NOT INSPECTED | transcribed/image-and-pdf-texts.txt:755 | DATA — rendered report row values |
| 42 | Push-rod travel 1.6 in. / 1.5 in. | transcribed/image-and-pdf-texts.txt:76 | DATA — rendered report row values |
| 43 | Tire pressure 104 psi 105 psi 103 psi 104 psi | transcribed/image-and-pdf-texts.txt:81 | DATA — rendered report row values |
| 44 | Tread depth 32nds 8 5 | transcribed/image-and-pdf-texts.txt:810 | DATA — rendered report row values |
| 45 | Tread depth 11/32 in. 12/32 in. 12/32 in. 11/32 in. | transcribed/image-and-pdf-texts.txt:82 | DATA — rendered report row values |
| 46 | Brake lining 0.42 in. 0.44 in. | transcribed/image-and-pdf-texts.txt:84 | DATA — rendered report row values |
| 47 | Push-rod travel 1.7 in. 1.8 in. | transcribed/image-and-pdf-texts.txt:85 | DATA — rendered report row values |
| 48 | Tread depth 32nds | transcribed/image-and-pdf-texts.txt:90 | DATA — rendered report row values |
| 49 | Re-check at the next PM. | Conditional Follow-up V2.dc.html:1337 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 50 | Tag the unit out of service. | Conditional Follow-up V2.dc.html:1338 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 51 | Leak down test before the unit leaves. | Conditional Follow-up V2.dc.html:1343 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 52 | Tag the unit out of service and tell the foreman before it leaves the bay. | Conditional Follow-up V2.dc.html:1390 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 53 | Re-check at the next PM and record the reading. | Conditional Follow-up V2.dc.html:308 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 54 | Tag the unit out of service and tell the foreman in person. | Conditional Follow-up V2.dc.html:309 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 55 | Air-brake system leak check | Conditional Follow-up V2.dc.html:313 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 56 | Leak down test before the unit leaves the bay. | Conditional Follow-up V2.dc.html:313 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 57 | Tag the unit out of service before it leaves the bay and tell the foreman in person, not over the radio. Record the chamber part number and  | Conditional Follow-up V2.dc.html:589 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 58 | Right rear chamber leaking at the clamp band, unit tagged and foreman told. | Conditional Follow-up V2.dc.html:620 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 59 | Lost 3 psi in one minute with the engine off. Leak sounds like it is near the rear service chamber. | Digital Inspections - Marketing Slides-print.dc.html:207 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 60 | Low-air warning pressure | Digital Inspections V2 - All Screens.dc.html:1056 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 61 | Held 90 psi for two minutes, no measurable drop. | Digital Inspections V2 - All Screens.dc.html:1272 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 62 | Trailer axle measurements | Digital Inspections V2 - All Screens.dc.html:1592 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 63 | Replace axle 1 left outer tire | Digital Inspections V2 - All Screens.dc.html:2471 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 64 | Tread at 0.13 in., below the 0.16 in. minimum. | Digital Inspections V2 - All Screens.dc.html:2472 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 65 | Inflate axle 1 outer tires to spec | Digital Inspections V2 - All Screens.dc.html:2478 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 66 | Austin Avenue, Toronto | Digital Inspections V2 - All Screens.dc.html:2926 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 67 | Dule / Milos | Digital Inspections V2 - All Screens.dc.html:2974 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 68 | Testing Live With The Team | Digital Inspections V2 - All Screens.dc.html:2984 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 69 | Axle Test | Digital Inspections V2 - All Screens.dc.html:2994 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 70 | Pre-trip Check | Digital Inspections V2 - All Screens.dc.html:3004 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 71 | Anteres Testing | Digital Inspections V2 - All Screens.dc.html:3054 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 72 | Air-brake leak check | Digital Inspections V2 - All Screens.dc.html:349 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 73 | Governor cut-out pressure | Inspection Report PDF.dc.html:101 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 74 | Technician comments | Inspection Report PDF.dc.html:103 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 75 | Unit came in for the 90-day PM. Driver reported a slight pull to the left under braking; nothing found beyond the axle 1 left tire. | Inspection Report PDF.dc.html:103 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 76 | Columbus, Ohio 43228 | Inspection Report PDF.dc.html:28 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 77 | BRAKE & AXLE PM | Inspection Report PDF.dc.html:41 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 78 | Columbus, Ohio 43223 | Inspection Report PDF.dc.html:45 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 79 | PRT-4471 | Inspection Report PDF.dc.html:50 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 80 | Brake pad | Inspection Report PDF.dc.html:68 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 81 | Axle 1 left tire is low and worn below the 0.16 in. minimum at the outer shoulder. Recommend replacing before the asset returns to service.  | Inspection Report PDF.dc.html:80 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 82 | Axle 1 left, tread | Inspection Report PDF.dc.html:80 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 83 | Axle 1 left, gauge | Inspection Report PDF.dc.html:80 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 84 | Axle 3 right service chamber has a cracked diaphragm housing and is leaking at the clamp. Chamber part number MGM 3030; date code 0419. | Inspection Report PDF.dc.html:83 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 85 | Axle 3 right chamber | Inspection Report PDF.dc.html:83 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 86 | Tag the unit out of service and tell the foreman before it leaves the bay. Record the chamber part number and the date code from the caniste | Inspection Report PDF.dc.html:86 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 87 | Lost 3 psi in one minute with the engine off. Leak sounds like it is near the rear service chamber on axle 3. Within limit today; recommend  | Inspection Report PDF.dc.html:92 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 88 | Rear chamber, axle 3 | Inspection Report PDF.dc.html:92 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 89 | Check the dust boot is seated before closing the card. | Prototype - Fill Inspection.dc.html:291 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 90 | Tag the unit out of service and tell the foreman before it leaves the bay. Record the chamber part number and the date code from the caniste | Prototype - Fill Inspection.dc.html:292 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 91 | Customer called about pickup | Prototype - Work Order Handoff.dc.html:198 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 92 | Replace left outer steer tire | Prototype - Work Order Handoff.dc.html:262 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 93 | Steer tire × 1 | Prototype - Work Order Handoff.dc.html:262 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 94 | Valve stem × 1 | Prototype - Work Order Handoff.dc.html:262 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 95 | Inflate left outer to spec | Prototype - Work Order Handoff.dc.html:263 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 96 | Leak-down test, air system | Prototype - Work Order Handoff.dc.html:264 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 97 | Loss above spec at idle; confirm source before release. | Prototype - Work Order Handoff.dc.html:264 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 98 | Gladhand seal × 2 | Prototype - Work Order Handoff.dc.html:264 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 99 | Pre-trip DOT | Prototype - Work Order Handoff.dc.html:336 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 100 | Annual DOT | Prototype - Work Order Handoff.dc.html:338 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 101 | Do not release the unit for road test until the replacement chamber is fitted and the system has held 90 psi for five minutes with the engin | flow FI-03 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 102 | Before you touch the chamber, chock the wheels, cage the spring brake on that wheel end and drain the wet tank until the gauge reads zero. D | sweep Conditional Follow-up V2-pages.txt:316 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 103 | Tag the unit out of service before it leaves the bay and tell the foreman in person, not over the radio. If the foreman is not on site, call | sweep Conditional Follow-up V2-pages.txt:318 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 104 | Record the chamber part number and the date code from the canister tag. Photograph the clamp band from both sides, the push-rod at rest and  | sweep Conditional Follow-up V2-pages.txt:320 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 105 | If the leak is at the push-rod seal rather than the clamp band, check the slack adjuster travel on the same wheel end and measure the lining | sweep Conditional Follow-up V2-pages.txt:322 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 106 | Replace the chamber as an assembly. Do not reuse the clamp band, the mounting nuts or the push-rod yoke pin, and torque the mounting nuts to | sweep Conditional Follow-up V2-pages.txt:324 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 107 | Do not release the unit for road test until the replacement chamber is fitted, the system has held 90 psi for five minutes with the engine o | sweep Conditional Follow-up V2-pages.txt:326 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 108 | If any of the above cannot be completed on this visit, answer Not OK, say in the note exactly what is outstanding, and leave the unit tagged | sweep Conditional Follow-up V2-pages.txt:328 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 109 | Tread at 0.13 in., below the 0.16 in. minimum. 1.2 hrs | sweep Digital Inspections V2 - All Screens-pages.txt:1389 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 110 | Travel out of range; confirm chamber and adjuster. 1 hr | sweep Digital Inspections V2 - All Screens-pages.txt:1406 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 111 | Tag the unit out of service and tell the f... | transcribed/image-and-pdf-texts.txt:1004 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 112 | Tag the unit out of service and tell the foreman before it leaves the bay. Record the chamber part number from the canister tag. | transcribed/image-and-pdf-texts.txt:1016 | DATA — sample content written by the template author, technician or ShopCoach in the design (instruction text, note, photo caption, drafted line, template or field name) |
| 113 | Aug 10, 2026 | Digital Inspections V2 - All Screens.dc.html:2966 | date, amount, VIN or time (tool pre-mark) |
| 114 | Aug 6, 2026 | Digital Inspections V2 - All Screens.dc.html:2986 | date, amount, VIN or time (tool pre-mark) |
| 115 | Jul 15, 2026 | Digital Inspections V2 - All Screens.dc.html:2996 | date, amount, VIN or time (tool pre-mark) |
| 116 | Jun 2, 2026 | Digital Inspections V2 - All Screens.dc.html:3006 | date, amount, VIN or time (tool pre-mark) |
| 117 | May 14, 2026 | Digital Inspections V2 - All Screens.dc.html:3016 | date, amount, VIN or time (tool pre-mark) |
| 118 | Apr 22, 2026 | Digital Inspections V2 - All Screens.dc.html:3027 | date, amount, VIN or time (tool pre-mark) |
| 119 | Mar 9, 2026 | Digital Inspections V2 - All Screens.dc.html:3037 | date, amount, VIN or time (tool pre-mark) |
| 120 | Bendix-chamber-out-of-service.pdf | Conditional Follow-up V2.dc.html:1393 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 121 | 1.2 MB | Conditional Follow-up V2.dc.html:211 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 122 | Bendix-chamber-out-of-service-procedure.pdf | Conditional Follow-up V2.dc.html:211 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 123 | Bendix-chamber-service.pdf | Conditional Follow-up V2.dc.html:370 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 124 | Air-leak-test-steps.pdf | Conditional Follow-up V2.dc.html:417 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 125 | 640 KB | Conditional Follow-up V2.dc.html:448 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 126 | WO 1234 · Unit 8842 | Conditional Follow-up V2.dc.html:934 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 127 | William Johns | Digital Inspections V2 - All Screens.dc.html:1046 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 128 | Kimberly Barnes | Digital Inspections V2 - All Screens.dc.html:1046 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 129 | Bendix-slack-adjuster-service-bulletin-2024.pdf | Digital Inspections V2 - All Screens.dc.html:1241 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 130 | 2 photos · 1.4 MB | Digital Inspections V2 - All Screens.dc.html:1300 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 131 | Page 1 of 3 | Digital Inspections V2 - All Screens.dc.html:1405 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 132 | Page 2 of 3 | Digital Inspections V2 - All Screens.dc.html:1424 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 133 | Type 12 | Digital Inspections V2 - All Screens.dc.html:1428 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 134 | 4 21/32 in. | Digital Inspections V2 - All Screens.dc.html:1428 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 135 | 1 3/8 in. | Digital Inspections V2 - All Screens.dc.html:1428 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 136 | Type 16 | Digital Inspections V2 - All Screens.dc.html:1429 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 137 | 5 1/4 in. | Digital Inspections V2 - All Screens.dc.html:1429 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 138 | 1 3/4 in. | Digital Inspections V2 - All Screens.dc.html:1429 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 139 | Type 20 | Digital Inspections V2 - All Screens.dc.html:1430 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 140 | 5 1/2 in. | Digital Inspections V2 - All Screens.dc.html:1430 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 141 | Type 24 | Digital Inspections V2 - All Screens.dc.html:1431 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 142 | 5 25/32 in. | Digital Inspections V2 - All Screens.dc.html:1431 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 143 | Type 30 | Digital Inspections V2 - All Screens.dc.html:1432 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 144 | 6 3/8 in. | Digital Inspections V2 - All Screens.dc.html:1432 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 145 | 2 in. | Digital Inspections V2 - All Screens.dc.html:1432 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 146 | Page 3 of 3 | Digital Inspections V2 - All Screens.dc.html:1440 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 147 | 25–30 ft-lbs | Digital Inspections V2 - All Screens.dc.html:1447 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 148 | 85–115 ft-lbs | Digital Inspections V2 - All Screens.dc.html:1448 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 149 | 35–40 ft-lbs | Digital Inspections V2 - All Screens.dc.html:1449 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 150 | 184,220 mi | Digital Inspections V2 - All Screens.dc.html:1902 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 151 | S-81 · ABC Truck Lines · Inspection | Digital Inspections V2 - All Screens.dc.html:2034 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 152 | Today 06:28 AM · O. Demo · report posted to the work order | Digital Inspections V2 - All Screens.dc.html:2044 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 153 | Brake & Axle PM.pdf | Digital Inspections V2 - All Screens.dc.html:2074 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 154 | 42 psi | Digital Inspections V2 - All Screens.dc.html:2146 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 155 | 103 psi | Digital Inspections V2 - All Screens.dc.html:2146 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 156 | 104 psi | Digital Inspections V2 - All Screens.dc.html:2146 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 157 | 40 psi | Digital Inspections V2 - All Screens.dc.html:2146 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 158 | 0.13 in. | Digital Inspections V2 - All Screens.dc.html:2147 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 159 | 0.34 in. | Digital Inspections V2 - All Screens.dc.html:2147 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 160 | 0.38 in. | Digital Inspections V2 - All Screens.dc.html:2147 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 161 | 0.31 in. | Digital Inspections V2 - All Screens.dc.html:2147 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 162 | 9/32 in. | Digital Inspections V2 - All Screens.dc.html:2149 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 163 | 10/32 in. | Digital Inspections V2 - All Screens.dc.html:2149 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 164 | 1.94 in. | Digital Inspections V2 - All Screens.dc.html:2150 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 165 | 62 psi | Digital Inspections V2 - All Screens.dc.html:2150 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 166 | ABC Truck Lines · Inspection | Digital Inspections V2 - All Screens.dc.html:2222 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 167 | Today 06:28 AM · O. Demo | Digital Inspections V2 - All Screens.dc.html:2232 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 168 | S-200 | Digital Inspections V2 - All Screens.dc.html:2319 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 169 | S-81 · Open · ABC Truck Lines | Digital Inspections V2 - All Screens.dc.html:2372 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 170 | Work Order S-81 | Digital Inspections V2 - All Screens.dc.html:2372 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 171 | Notes (2) | Digital Inspections V2 - All Screens.dc.html:2376 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 172 | Steer tire ( 1 ) | Digital Inspections V2 - All Screens.dc.html:2474 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 173 | Valve stem ( 1 ) | Digital Inspections V2 - All Screens.dc.html:2474 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 174 | 42 and 40 psi against 100 psi spec; check for a leak while replacing. | Digital Inspections V2 - All Screens.dc.html:2479 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 175 | 0.3 hrs | Digital Inspections V2 - All Screens.dc.html:2480 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 176 | Slack adjuster ( 1 ) | Digital Inspections V2 - All Screens.dc.html:2488 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 177 | Lines (2) | Digital Inspections V2 - All Screens.dc.html:2574 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 178 | Parts (3) | Digital Inspections V2 - All Screens.dc.html:2574 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 179 | 2.0 hrs | Digital Inspections V2 - All Screens.dc.html:2582 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 180 | Wiper blade ( 2 ) | Digital Inspections V2 - All Screens.dc.html:2583 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 181 | 0.8 hrs | Digital Inspections V2 - All Screens.dc.html:2615 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 182 | Dryer cartridge ( 1 ) | Digital Inspections V2 - All Screens.dc.html:2616 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 183 | 0.4 hrs | Digital Inspections V2 - All Screens.dc.html:2622 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 184 | S1-238 | Digital Inspections V2 - All Screens.dc.html:2649 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 185 | QA Testing | Digital Inspections V2 - All Screens.dc.html:266 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 186 | Lines (1) | Digital Inspections V2 - All Screens.dc.html:2671 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 187 | Parts (1) | Digital Inspections V2 - All Screens.dc.html:2671 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 188 | 10:46 AM, Today | Digital Inspections V2 - All Screens.dc.html:2690 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 189 | 1234.pdf | Digital Inspections V2 - All Screens.dc.html:2705 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 190 | 19.96 kB · 0 photos | Digital Inspections V2 - All Screens.dc.html:2706 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 191 | S-100 | Digital Inspections V2 - All Screens.dc.html:2872 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 192 | 2020 1/off Kustoms, Llc 6130M | Digital Inspections V2 - All Screens.dc.html:2918 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 193 | Inspections (18) | Digital Inspections V2 - All Screens.dc.html:2933 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 194 | 2 days ago | Digital Inspections V2 - All Screens.dc.html:2956 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 195 | 5 Monitor | Digital Inspections V2 - All Screens.dc.html:2958 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 196 | S-81 | Digital Inspections V2 - All Screens.dc.html:2959 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 197 | S-83 | Digital Inspections V2 - All Screens.dc.html:2969 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 198 | S-233 | Digital Inspections V2 - All Screens.dc.html:2979 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 199 | S-229 | Digital Inspections V2 - All Screens.dc.html:2989 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 200 | S-237 | Digital Inspections V2 - All Screens.dc.html:3049 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 201 | S-73 | Digital Inspections V2 - All Screens.dc.html:3059 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 202 | S-81 · Lines | Digital Inspections V2 - All Screens.dc.html:3097 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 203 | 1.2 hr labor | Digital Inspections V2 - All Screens.dc.html:3097 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 204 | 2 parts | Digital Inspections V2 - All Screens.dc.html:3097 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 205 | 0.3 hr labor | Digital Inspections V2 - All Screens.dc.html:3097 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 206 | 1 hr labor | Digital Inspections V2 - All Screens.dc.html:3097 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 207 | 1 part | Digital Inspections V2 - All Screens.dc.html:3097 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 208 | Tires | Digital Inspections V2 - All Screens.dc.html:330 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 209 | ft-lbs | Digital Inspections V2 - All Screens.dc.html:4510 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 210 | Marcus Bell · Signed Sep 24, 2026 9:42 AM | Inspection Report PDF.dc.html:109 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 211 | Northline Truck & Trailer Repair · Work Order S1-10482 | Inspection Report PDF.dc.html:21 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 212 | Northline Truck & Trailer Repair | Inspection Report PDF.dc.html:27 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 213 | 4180 Industrial Parkway | Inspection Report PDF.dc.html:28 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 214 | Unit 6 | Inspection Report PDF.dc.html:28 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 215 | S1-10482 | Inspection Report PDF.dc.html:33 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 216 | Inspected Sep 24, 2026 | Inspection Report PDF.dc.html:34 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 217 | Ridgeway Freight Lines | Inspection Report PDF.dc.html:45 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 218 | 2250 Harmon Avenue | Inspection Report PDF.dc.html:45 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 219 | Dana Pruitt | Inspection Report PDF.dc.html:46 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 220 | 2021 Freightliner Cascadia 126 | Inspection Report PDF.dc.html:47 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 221 | 3AKJHHDR5MSMF4412 | Inspection Report PDF.dc.html:49 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 222 | 412,806 mi | Inspection Report PDF.dc.html:51 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 223 | 9,214 hrs | Inspection Report PDF.dc.html:52 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 224 | 82 psi | Inspection Report PDF.dc.html:68 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 225 | 108 psi | Inspection Report PDF.dc.html:68 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 226 | 0.19 in. | Inspection Report PDF.dc.html:68 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 227 | 0.36 in. | Inspection Report PDF.dc.html:68 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 228 | 1.6 in. | Inspection Report PDF.dc.html:68 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 229 | 1.5 in. | Inspection Report PDF.dc.html:68 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 230 | 105 psi | Inspection Report PDF.dc.html:73 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 231 | 0.42 in. | Inspection Report PDF.dc.html:73 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 232 | 0.44 in. | Inspection Report PDF.dc.html:73 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 233 | 1.7 in. | Inspection Report PDF.dc.html:73 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 234 | 1.8 in. | Inspection Report PDF.dc.html:73 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 235 | 102 psi | Inspection Report PDF.dc.html:78 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 236 | 0.40 in. | Inspection Report PDF.dc.html:78 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 237 | 0.41 in. | Inspection Report PDF.dc.html:78 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 238 | S-81 · ABC Truck Lines · Unit 6130M | Prototype - Fill Inspection.dc.html:42 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 239 | ft-lb | Prototype - Template Builder.dc.html:232 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 240 | 1.4 MB | Prototype - Template Builder.dc.html:282 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 241 | 2.1 MB | Prototype - Template Builder.dc.html:282 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 242 | Chamber-replacement-procedure.pdf | Prototype - Template Builder.dc.html:282 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 243 | Slack-adjuster-spec.pdf | Prototype - Template Builder.dc.html:282 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 244 | S-81 · Open · ABC Truck Lines · Unit 6130M | Prototype - Work Order Handoff.dc.html:124 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 245 | Today 06:28 AM · William Johns | Prototype - Work Order Handoff.dc.html:189 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 246 | 9 OK · 1 Monitor · 2 Not OK. Findings: tire pressure left outer 42 psi, tread depth left outer 4/32nds, slack adjuster travel on Monitor. | Prototype - Work Order Handoff.dc.html:190 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 247 | Yesterday · Kimberly Barnes | Prototype - Work Order Handoff.dc.html:198 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 248 | Customers · Kustoms, LLC | Prototype - Work Order Handoff.dc.html:209 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 249 | 2020 Kenworth T680 · 6130M | Prototype - Work Order Handoff.dc.html:210 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 250 | 1XKYD49X8LJ123456 | Prototype - Work Order Handoff.dc.html:211 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 251 | Inspection report · S-81 | Prototype - Work Order Handoff.dc.html:245 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 252 | 98 psi | Prototype - Work Order Handoff.dc.html:259 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 253 | 42 psi against 100 psi spec; check for a leak while replacing. | Prototype - Work Order Handoff.dc.html:263 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 254 | new work order S-82 | Prototype - Work Order Handoff.dc.html:328 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 255 | Today · William Johns · template v2 | Prototype - Work Order Handoff.dc.html:335 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 256 | 12 Sep · Sasha Reyes · template v1 | Prototype - Work Order Handoff.dc.html:336 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 257 | S-74 | Prototype - Work Order Handoff.dc.html:336 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 258 | 28 Aug · William Johns · template v1 | Prototype - Work Order Handoff.dc.html:337 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 259 | S-69 | Prototype - Work Order Handoff.dc.html:337 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 260 | 3 Jun · Sasha Reyes · template v1 | Prototype - Work Order Handoff.dc.html:338 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 261 | S-52 | Prototype - Work Order Handoff.dc.html:338 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 262 | 14 May · Omar Diaz · template v1 | Prototype - Work Order Handoff.dc.html:339 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 263 | S-47 | Prototype - Work Order Handoff.dc.html:339 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 264 | Today 06:28 AM · William Johns · report posted to the work order | Prototype - Work Order Handoff.dc.html:64 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 265 | Freightliner Cascadia | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 266 | ABC Truck Lines | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 267 | 2 lines | flow WO-01 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 268 | 1.0 hrs | flow WO-01 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 269 | Lines (3) | flow WO-02 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 270 | 52 px acknowledge row · the error and the no-instruction state included · the note opens under the response, as on CI3 | sweep Conditional Follow-up V2-pages.txt:355 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 271 | 42 and 40 psi against 100 psi spec; check for a leak while replacing. 0.3 hrs | sweep Digital Inspections V2 - All Screens-pages.txt:1398 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 272 | Completed 2 days ago Owner Demo | sweep Digital Inspections V2 - All Screens-pages.txt:1665 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 273 | Completed Aug 10, 2026 Owner Demo | sweep Digital Inspections V2 - All Screens-pages.txt:1680 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 274 | Completed Aug 6, 2026 Owner Demo | sweep Digital Inspections V2 - All Screens-pages.txt:1710 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 275 | Completed Jul 15, 2026 Owner Demo | sweep Digital Inspections V2 - All Screens-pages.txt:1725 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 276 | Completed Jun 2, 2026 Owner Demo | sweep Digital Inspections V2 - All Screens-pages.txt:1740 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 277 | Completed May 14, 2026 Owner Demo | sweep Digital Inspections V2 - All Screens-pages.txt:1748 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 278 | Completed Apr 22, 2026 Owner Demo | sweep Digital Inspections V2 - All Screens-pages.txt:1759 | sample record data (person, company, number, measurement, file, date, work order, sample label) |
| 279 | Completed Mar 9, 2026 Owner Demo | sweep Digital Inspections V2 - All Screens-pages.txt:1767 | sample record data (person, company, number, measurement, file, date, work order, sample label) |

## DESIGN NOTE — 674 rows

| # | Text | First seen (file:line) | Reason |
|---|---|---|---|
| 0 | The reference file on a checkbox field is unconditional: the technician sees it whatever they answer. A follow-up is the same content, text  | Conditional Follow-up V2.dc.html:102 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 1 | settles the list that was marked unreviewed in | Conditional Follow-up V2.dc.html:1058 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 2 | Monitor off takes its row, its checkbox and its text with it, the same as | Conditional Follow-up V2.dc.html:1462 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 3 | The canvas row gains a short list: one line per follow-up, the response in its own colour, the first line of the text, and a clip where a fi | Conditional Follow-up V2.dc.html:387 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 4 | Pressing Submit & Generate Report with one unchecked does not raise a dialog: it opens the outstanding list in | Conditional Follow-up V2.dc.html:682 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 5 | The note opens by itself under the response and the instruction follows it, the same order as | Conditional Follow-up V2.dc.html:886 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 6 | Reached from the outstanding list in | Conditional Follow-up V2.dc.html:969 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 7 | On the final section the action becomes Submit & Generate Report, carrying a count of what is still outstanding. Tapping it opens the list i | Digital Inspections V2 - All Screens.dc.html:1538 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 8 | Building work order lines from an inspection is a ShopCoach capability, so the same completed inspection is two different screens. Without S | Digital Inspections V2 - All Screens.dc.html:2020 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 9 | the card answers what happened, the sections below it what was entered · targets in | Digital Inspections V2 - All Screens.dc.html:2087 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 10 | The card above answers | Digital Inspections V2 - All Screens.dc.html:2150 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 11 | Either target skips straight to | Digital Inspections V2 - All Screens.dc.html:2346 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 12 | Every screen in one document, in the order the work happens: a manager builds the template, a technician fills it on a laptop or a phone, an | Digital Inspections V2 - All Screens.dc.html:237 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 13 | Three skeleton rows, one per finding; the count is known before the drafting is. The work order is usable while it runs, and Cancel leaves i | Digital Inspections V2 - All Screens.dc.html:2427 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 14 | Whole screens, so each state can be read in place. Three changes: a measurement row is called what it is; the unit left the name and became  | Digital Inspections V2 - All Screens.dc.html:255 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 15 | The note is the report: counts on the card, so the advisor does not open a PDF to learn whether anything failed. Build lines is the same pur | Digital Inspections V2 - All Screens.dc.html:2721 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 16 | Sorted by most recently completed first, and the same purple Build lines action sits in the action column. Once lines exist the cell states  | Digital Inspections V2 - All Screens.dc.html:3066 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 17 | Header, customer and asset panel, and the three count tiles stay as the report is today. Per axle fields print one block per axle that never | Digital Inspections V2 - All Screens.dc.html:4486 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 18 | The same preview at phone width, because a template that reads well on a desktop can still be wrong in a technician's hand. Preview follows  | Digital Inspections V2 - All Screens.dc.html:661 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 19 | The reference file on a checkbox field is unconditional: the technician sees it whatever they answer. A follow-up is the same content, text  | sweep Conditional Follow-up V2-pages.txt:13 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 20 | The canvas row gains a short list: one line per follow-up, the response in its own colour, the first line of the text, and a clip where a fi | sweep Conditional Follow-up V2-pages.txt:138 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 21 | Pressing Submit & Generate Report with one unchecked does not raise a dialog: it opens the outstanding list in CI5 and marks the fields it i | sweep Conditional Follow-up V2-pages.txt:290 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 22 | The note opens by itself under the response and the instruction follows it, the same order as CI3, and both are inside the card. The acknowl | sweep Conditional Follow-up V2-pages.txt:391 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 23 | Reached from the outstanding list in CI6, which is what the section action opens instead of an error dialog. Same two red marks as the deskt | sweep Conditional Follow-up V2-pages.txt:433 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 24 | settles the list that was marked unreviewed in M3 | sweep Conditional Follow-up V2-pages.txt:470 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 25 | the CI1c treatment at 402 px · the sheet scrolls, the response blocks do not shrink | sweep Conditional Follow-up V2-pages.txt:583 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 26 | Monitor off takes its row, its checkbox and its text with it, the same as CI1c on the desktop. The sheet gets shorter, which on the phone is | sweep Conditional Follow-up V2-pages.txt:649 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 27 | Building work order lines from an inspection is a ShopCoach capability, so the same completed inspection is two different screens. Without S | sweep Digital Inspections V2 - All Screens-pages.txt:1079 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 28 | the card answers what happened, the sections below it what was entered · targets in B2, opened the same way from Notes and Asset › Inspectio | sweep Digital Inspections V2 - All Screens-pages.txt:1113 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 29 | The card above answers what happened; these sections answer what was entered. Without them a locked inspection has no readable record outsid | sweep Digital Inspections V2 - All Screens-pages.txt:1190 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 30 | Either target skips straight to C1; no prompt in between. | sweep Digital Inspections V2 - All Screens-pages.txt:1320 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 31 | Header, customer and asset panel, and the three count tiles stay as the report is today. Per axle fields print one block per axle that never | sweep Digital Inspections V2 - All Screens-pages.txt:2666 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 32 | Whole screens, so each state can be read in place. Three changes: a measurement row is called what it is; the unit left the name and became  | sweep Digital Inspections V2 - All Screens-pages.txt:37 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 33 | Every screen in one document, in the order the work happens: a manager builds the template, a technician fills it on a laptop or a phone, an | sweep Digital Inspections V2 - All Screens-pages.txt:8 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 34 | On the final section the action becomes Submit & Generate Report, carrying a count of what is still outstanding. Tapping it opens the list i | sweep Digital Inspections V2 - All Screens-pages.txt:877 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 35 | Whole screens, so each state can be read in place. Three changes: a measurement row is called what it is; the unit left the name and became  | sweep Inspection Template Builder V2 - Desktop-pages.txt:8 | DESIGN NOTE — designer caption/annotation as rendered (sweep text), not product UI text |
| 36 | ON THE TOGGLE | Conditional Follow-up V2.dc.html:508 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 37 | The form as it is filled, section 1 of 2, three field types | Digital Inspections V2 - All Screens.dc.html:1021 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 38 | Mark OK at inspection, section and field level · every field carries its own · nothing in the app chrome | Digital Inspections V2 - All Screens.dc.html:1022 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 39 | After Mark section OK: the section row reports what it did | Digital Inspections V2 - All Screens.dc.html:1071 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 40 | values were typed first, the press set the verdicts · the row pressed counts fields, each field below counts its positions · Undo on the row | Digital Inspections V2 - All Screens.dc.html:1072 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 41 | Live, click a marker to pick a verdict | Digital Inspections V2 - All Screens.dc.html:1090 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 42 | Single / Dual switches with no dialog · hover Mark field OK for its tooltip, press it for the report and Undo | Digital Inspections V2 - All Screens.dc.html:1091 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 43 | Field card, reference file, response, note, photo | Digital Inspections V2 - All Screens.dc.html:1199 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 44 | response row · evidence row · note block | Digital Inspections V2 - All Screens.dc.html:1200 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 45 | Attachment viewer | Digital Inspections V2 - All Screens.dc.html:1381 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 46 | full-page modal · the document gets the whole window, scroll to page through | Digital Inspections V2 - All Screens.dc.html:1382 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 47 | ; these sections answer | Digital Inspections V2 - All Screens.dc.html:2150 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 48 | ; no prompt in between. | Digital Inspections V2 - All Screens.dc.html:2346 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 49 | Completed inspection report, letter size | Digital Inspections V2 - All Screens.dc.html:4489 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 50 | per axle, checkbox with follow-up, measurement, short answer | Digital Inspections V2 - All Screens.dc.html:4489 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 51 | Dual axle: nothing inspected yet | Digital Inspections V2 - All Screens.dc.html:684 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 52 | Mid-fill: the dropdown names the tire it judges | Digital Inspections V2 - All Screens.dc.html:788 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 53 | left outer already Not OK, left inner being set | Digital Inspections V2 - All Screens.dc.html:789 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 54 | Complete, left outer Not OK, left inner OK | Digital Inspections V2 - All Screens.dc.html:834 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 55 | Complete, left brake Not OK | Digital Inspections V2 - All Screens.dc.html:927 | DESIGN NOTE — designer caption/annotation on the board, not product UI text |
| 56 | ← Sections 1 – 4 | Conditional Follow-up V2.dc.html:95 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 57 | Prototype hub | Prototype - Fill Inspection.dc.html:23 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 58 | Filling an inspection · fixed template, Brake & Axle PM | Prototype - Fill Inspection.dc.html:24 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 59 | Reset | Prototype - Fill Inspection.dc.html:25 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 60 | Inspection submitted | Prototype - Fill Inspection.dc.html:50 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 61 | The report is on work order S-81 and the inspection is locked. | Prototype - Fill Inspection.dc.html:514 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 62 | Start Again | Prototype - Fill Inspection.dc.html:53 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 63 | View Completed Inspection | Prototype - Fill Inspection.dc.html:54 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 64 | Add checkbox and per axle fields, rename responses, turn on follow-ups and acknowledgement, set validation, then switch to Preview. | Prototype - Hub.dc.html:28 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 65 | Verdict per tire position across axles, single and dual, Mark OK. Checkbox follow-ups with acknowledgement, the outstanding list, and submit | Prototype - Hub.dc.html:33 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 66 | Inspection → work order | Prototype - Hub.dc.html:37 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 67 | The completed inspection, with ShopCoach on or off. Build lines, review the drafts, add them. Work order Notes and the asset's Inspections t | Prototype - Hub.dc.html:38 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 68 | All screens (static artboards) | Prototype - Hub.dc.html:43 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 69 | Conditional follow-up artboards | Prototype - Hub.dc.html:43 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 70 | Template builder · checkbox and per axle are live, the other field types are disabled | Prototype - Template Builder.dc.html:24 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 71 | is not part of this prototype | Prototype - Template Builder.dc.html:356 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 72 | Discard | Prototype - Work Order Handoff.dc.html:167 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 73 | Open Inspection | Prototype - Work Order Handoff.dc.html:192 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 74 | This tab is not part of the prototype. | Prototype - Work Order Handoff.dc.html:202 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 75 | Completed inspection → work order | Prototype - Work Order Handoff.dc.html:25 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 76 | The report is on work order S-81 and the inspection is locked. 4 fields, 3 axles. | flow FI-10 | DESIGN NOTE — prototype-only chrome or navigation (not product UI; no PRD sentence) |
| 77 | not applicable | Digital Inspections V2 - All Screens.dc.html:4696 | DESIGN NOTE — script/style value never rendered as on-screen text on any board (checked in the board markup and the sweep) |
| 78 | worst of | Digital Inspections V2 - All Screens.dc.html:4697 | DESIGN NOTE — script/style value never rendered as on-screen text on any board (checked in the board markup and the sweep) |
| 79 | positions inspected | Digital Inspections V2 - All Screens.dc.html:4758 | DESIGN NOTE — script/style value never rendered as on-screen text on any board (checked in the board markup and the sweep) |
| 80 | flex-end | Digital Inspections V2 - All Screens.dc.html:4799 | DESIGN NOTE — script/style value never rendered as on-screen text on any board (checked in the board markup and the sweep) |
| 81 | flex-start | Digital Inspections V2 - All Screens.dc.html:4799 | DESIGN NOTE — script/style value never rendered as on-screen text on any board (checked in the board markup and the sweep) |
| 82 | v !== 'none'); return done.length === 0 ? 'none' : done.length | Prototype - Fill Inspection.dc.html:399 | DESIGN NOTE — script/style value never rendered as on-screen text on any board (checked in the board markup and the sweep) |
| 83 | ;box-sizing:border-box | Prototype - Fill Inspection.dc.html:406 | DESIGN NOTE — script/style value never rendered as on-screen text on any board (checked in the board markup and the sweep) |
| 84 | -90deg | Prototype - Fill Inspection.dc.html:493 | DESIGN NOTE — script/style value never rendered as on-screen text on any board (checked in the board markup and the sweep) |
| 85 | 0deg | Prototype - Fill Inspection.dc.html:493 | DESIGN NOTE — script/style value never rendered as on-screen text on any board (checked in the board markup and the sweep) |
| 86 | not-allowed | Prototype - Template Builder.dc.html:358 | DESIGN NOTE — script/style value never rendered as on-screen text on any board (checked in the board markup and the sweep) |
| 87 | ;white-space:nowrap | Prototype - Work Order Handoff.dc.html:281 | DESIGN NOTE — script/style value never rendered as on-screen text on any board (checked in the board markup and the sweep) |
| 88 | ;width:100% | Prototype - Work Order Handoff.dc.html:312 | DESIGN NOTE — script/style value never rendered as on-screen text on any board (checked in the board markup and the sweep) |
| 89 | MARK REMAINING OK | Mark OK Explorations.dc.html:101 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 90 | This axle | Mark OK Explorations.dc.html:102 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 91 | This field | Mark OK Explorations.dc.html:102 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 92 | This section | Mark OK Explorations.dc.html:102 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 93 | Whole inspection | Mark OK Explorations.dc.html:102 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 94 | Brakes, Air system | Mark OK Explorations.dc.html:102 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 95 | Headers carry only content; the bulk action lives with the other page actions. | Mark OK Explorations.dc.html:104 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 96 | Every scope, including the whole inspection, in one menu with counts. | Mark OK Explorations.dc.html:104 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 97 | Scope follows the last field touched, which has to be obvious or the tech marks the wrong thing. | Mark OK Explorations.dc.html:104 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 98 | Overflow menu on each header | Mark OK Explorations.dc.html:107 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 99 | A ⋯ menu on the section, field and axle headers holds the bulk actions for that level, next to other housekeeping like Clear and Collapse. | Mark OK Explorations.dc.html:108 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 100 | Mark remaining OK | Mark OK Explorations.dc.html:110 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 101 | Clear axle | Mark OK Explorations.dc.html:111 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 102 | The cleanest headers of the four; room for more actions later. | Mark OK Explorations.dc.html:114 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 103 | Mark OK sits beside Clear, so the pair reads as “set” and “reset”. | Mark OK Explorations.dc.html:114 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 104 | Hidden one level down; a tech who does not know it is there never finds it. | Mark OK Explorations.dc.html:114 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 105 | Mark OK round 2 | Mark OK Explorations.dc.html:20 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 106 | ROUND 2 · ALIGNED AND LABELLED | Mark OK Explorations.dc.html:22 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 107 | Mark OK on one edge, with a clear marked state | Mark OK Explorations.dc.html:23 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 108 | Every option keeps a text label and puts the section, field and axle actions on one vertical line. Axle 2 is shown after it was marked, so e | Mark OK Explorations.dc.html:24 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 109 | One right edge, one button shape | Mark OK Explorations.dc.html:28 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 110 | 2 fields · 0 complete | Mark OK Explorations.dc.html:30 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 111 | 2 of 8 positions | Mark OK Explorations.dc.html:34 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 112 | The actions line up, so the eye finds them in one column. | Mark OK Explorations.dc.html:38 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 113 | Axle rows lose their inset card look; the blue left bar now marks the active axle. | Mark OK Explorations.dc.html:38 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 114 | Solid green is a clear “this was marked” state; Axle 2 shows it. | Mark OK Explorations.dc.html:38 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 115 | A column of its own | Mark OK Explorations.dc.html:41 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 116 | 2b | Mark OK Explorations.dc.html:41 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 117 | The bulk actions leave the headers and sit in a gutter to the right of the form, each level of the row it belongs to. The form reads as cont | Mark OK Explorations.dc.html:42 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 118 | Perfect alignment, and nothing competes with the answers inside the cards. | Mark OK Explorations.dc.html:51 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 119 | The column can carry Mark all OK for the whole inspection at the top. | Mark OK Explorations.dc.html:51 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 120 | A checkbox that shows the state | Mark OK Explorations.dc.html:54 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 121 | 2c | Mark OK Explorations.dc.html:54 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 122 | Each level gets the same labelled checkbox on the same right edge: Section OK, Field OK, Axle OK, with the count still open. Ticking it sets | Mark OK Explorations.dc.html:55 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 123 | Axle OK | Mark OK Explorations.dc.html:60 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 124 | Ticks up on its own when a tech answers every position by hand. | Mark OK Explorations.dc.html:64 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 125 | Unticking has to mean “undo what I set”, never “clear everything”, and that must be obvious. | Mark OK Explorations.dc.html:64 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 126 | The strongest “this is OK” signal: a ticked box stays ticked while it is true. | Mark OK Explorations.dc.html:64 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 127 | Mark OK explorations | Mark OK Explorations.dc.html:68 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 128 | DIGITAL INSPECTIONS · FILL SCREEN | Mark OK Explorations.dc.html:70 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 129 | Mark OK: four directions | Mark OK Explorations.dc.html:71 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 130 | Same screen in every board: section Brakes, one checkbox field, one per-axle field with Axle 1 partly filled. Each option only ever sets una | Mark OK Explorations.dc.html:72 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 131 | move it out of the headers. | Mark OK Explorations.dc.html:72 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 132 | 1a | Mark OK Explorations.dc.html:72 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 133 | 1b | Mark OK Explorations.dc.html:72 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 134 | 1c | Mark OK Explorations.dc.html:72 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 135 | 1d | Mark OK Explorations.dc.html:72 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 136 | Current: a text action at every level | Mark OK Explorations.dc.html:76 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 137 | Mark section OK, Mark field OK and Mark axle OK sit in three headers, one inside the other, with the same icon and the same blue. | Mark OK Explorations.dc.html:77 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 138 | 0 of 8 positions | Mark OK Explorations.dc.html:78 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 139 | Three identical labels stacked in one view; the eye has to read each to tell them apart. | Mark OK Explorations.dc.html:79 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 140 | The label does not say that only unanswered positions change. | Mark OK Explorations.dc.html:79 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 141 | Icon button, label on hover | Mark OK Explorations.dc.html:82 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 142 | One double-check icon means “mark what is left OK” at every level. The label and what it touches appear as a tooltip. | Mark OK Explorations.dc.html:83 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 143 | Mark 6 remaining positions OK | Mark OK Explorations.dc.html:84 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 144 | Only unanswered positions change | Mark OK Explorations.dc.html:84 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 145 | Same glyph at every level, so it is learned once. | Mark OK Explorations.dc.html:85 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 146 | Needs a hover or a long press to be sure what it does. Phone has no hover, so the phone keeps a label. | Mark OK Explorations.dc.html:85 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 147 | Say how many it will change | Mark OK Explorations.dc.html:88 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 148 | A green pill carries the count of unanswered positions it will set. It disappears when the count reaches zero, so a finished axle or section | Mark OK Explorations.dc.html:89 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 149 | 15 left OK | Mark OK Explorations.dc.html:90 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 150 | 14 left OK | Mark OK Explorations.dc.html:90 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 151 | 6 left OK | Mark OK Explorations.dc.html:90 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 152 | 8 left OK | Mark OK Explorations.dc.html:90 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 153 | Green reads as an OK action, not as navigation like the blue links. | Mark OK Explorations.dc.html:91 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 154 | Three pills can still appear at once; the field one could be dropped when a field has a single axle. | Mark OK Explorations.dc.html:91 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 155 | The number answers “what will this touch?” before the click. | Mark OK Explorations.dc.html:91 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 156 | One control in the footer, scope follows focus | Mark OK Explorations.dc.html:94 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 157 | No bulk actions in headers. One split button next to Next Section names the level the technician is working in; the arrow picks a wider scop | Mark OK Explorations.dc.html:95 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 158 | Mark Axle 1 OK | Mark OK Explorations.dc.html:98 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 159 | Next Section | Mark OK Explorations.dc.html:99 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 160 | Same screen in every board: section Brakes, one checkbox field, one per-axle field with Axle 1 partly filled. Each option only ever sets una | sweep Mark OK Explorations-pages.txt:135 | Mark OK Explorations: design options under study; the decision is PRD S18-R1 |
| 161 | SV-8181 · DIGITAL INSPECTIONS V2 · CONDITIONAL FOLLOW-UP | Conditional Follow-up V2.dc.html:100 | designer caption/annotation/board title or screen id, not product UI text |
| 162 | CI5 Outstanding items desktop | Conditional Follow-up V2.dc.html:1005 | designer caption/annotation/board title or screen id, not product UI text |
| 163 | Outstanding items, desktop: a count on the submit bar, opening the list above it | Conditional Follow-up V2.dc.html:1006 | designer caption/annotation/board title or screen id, not product UI text |
| 164 | drawn for the first time · an unacknowledged instruction is one of the kinds it lists | Conditional Follow-up V2.dc.html:1006 | designer caption/annotation/board title or screen id, not product UI text |
| 165 | A follow-up attached to one response | Conditional Follow-up V2.dc.html:101 | designer caption/annotation/board title or screen id, not product UI text |
| 166 | only, on by default, and the author can turn it off. Follow-ups on | Conditional Follow-up V2.dc.html:102 | designer caption/annotation/board title or screen id, not product UI text |
| 167 | are read-only and never need acknowledging. Where it is on, the inspection cannot be submitted until the technician has confirmed they read  | Conditional Follow-up V2.dc.html:102 | designer caption/annotation/board title or screen id, not product UI text |
| 168 | The count is a button beside submit, not a blocker in front of it: pressing submit with items left opens the same list rather than raising a | Conditional Follow-up V2.dc.html:1053 | designer caption/annotation/board title or screen id, not product UI text |
| 169 | CI6 Outstanding items phone | Conditional Follow-up V2.dc.html:1057 | designer caption/annotation/board title or screen id, not product UI text |
| 170 | Outstanding items, phone: carried on the action that completes the section | Conditional Follow-up V2.dc.html:1058 | designer caption/annotation/board title or screen id, not product UI text |
| 171 | M3 | Conditional Follow-up V2.dc.html:1058 | designer caption/annotation/board title or screen id, not product UI text |
| 172 | CI1c Enabling toggle per-response checkbox | Conditional Follow-up V2.dc.html:106 | designer caption/annotation/board title or screen id, not product UI text |
| 173 | THE COUNT RIDES ON THE SECTION ACTION | Conditional Follow-up V2.dc.html:1062 | designer caption/annotation/board title or screen id, not product UI text |
| 174 | One toggle turns follow-ups on, then a checkbox per response enables its own fields | Conditional Follow-up V2.dc.html:107 | designer caption/annotation/board title or screen id, not product UI text |
| 175 | the toggles move out of the response list into RESPONSE SETTINGS · nothing is hidden behind a click, the fields are on the surface and only  | Conditional Follow-up V2.dc.html:107 | designer caption/annotation/board title or screen id, not product UI text |
| 176 | CI1c | Conditional Follow-up V2.dc.html:107 | designer caption/annotation/board title or screen id, not product UI text |
| 177 | Every section action carries the count, not only the last one, so the number is not saved up for the end. Tapping the badge opens the list;  | Conditional Follow-up V2.dc.html:1078 | designer caption/annotation/board title or screen id, not product UI text |
| 178 | Rows are 64 px and go straight to the field, opening the instruction block if that is what is missing. The wording is the same as the deskto | Conditional Follow-up V2.dc.html:1117 | designer caption/annotation/board title or screen id, not product UI text |
| 179 | FOLLOW-UPS OFF · THE PANEL AS IT IS TODAY | Conditional Follow-up V2.dc.html:112 | designer caption/annotation/board title or screen id, not product UI text |
| 180 | CI7 Follow-up in preview | Conditional Follow-up V2.dc.html:1123 | designer caption/annotation/board title or screen id, not product UI text |
| 181 | Preview: the instruction is there, and takes no input | Conditional Follow-up V2.dc.html:1124 | designer caption/annotation/board title or screen id, not product UI text |
| 182 | the file is shown and is not a link | Conditional Follow-up V2.dc.html:1124 | designer caption/annotation/board title or screen id, not product UI text |
| 183 | CI7 | Conditional Follow-up V2.dc.html:1124 | designer caption/annotation/board title or screen id, not product UI text |
| 184 | No response can be given in Preview, so every configured instruction on the field is shown at once, each naming the response it belongs to.  | Conditional Follow-up V2.dc.html:1158 | designer caption/annotation/board title or screen id, not product UI text |
| 185 | CI8 Phone filling full page | Conditional Follow-up V2.dc.html:1162 | designer caption/annotation/board title or screen id, not product UI text |
| 186 | Phone, filling: the whole page, not the card on its own | Conditional Follow-up V2.dc.html:1163 | designer caption/annotation/board title or screen id, not product UI text |
| 187 | the follow-up in the run of an inspection · the count on the section action falls as it is cleared | Conditional Follow-up V2.dc.html:1163 | designer caption/annotation/board title or screen id, not product UI text |
| 188 | CI8 | Conditional Follow-up V2.dc.html:1163 | designer caption/annotation/board title or screen id, not product UI text |
| 189 | NOT OK ANSWERED · 3 OUTSTANDING | Conditional Follow-up V2.dc.html:1168 | designer caption/annotation/board title or screen id, not product UI text |
| 190 | The note opens under the response and the instruction follows it, so the run of the page is unchanged: one card per field, one action at the | Conditional Follow-up V2.dc.html:1235 | designer caption/annotation/board title or screen id, not product UI text |
| 191 | ACKNOWLEDGED · 2 OUTSTANDING | Conditional Follow-up V2.dc.html:1240 | designer caption/annotation/board title or screen id, not product UI text |
| 192 | The checked box keeps the row it had, so nothing below it moves. The count falls from three to two and the card keeps its blue edge, because | Conditional Follow-up V2.dc.html:1306 | designer caption/annotation/board title or screen id, not product UI text |
| 193 | CI9 Phone building full page | Conditional Follow-up V2.dc.html:1312 | designer caption/annotation/board title or screen id, not product UI text |
| 194 | Phone, building: the same two toggles in a properties sheet | Conditional Follow-up V2.dc.html:1313 | designer caption/annotation/board title or screen id, not product UI text |
| 195 | treatment at 402 px · the sheet scrolls, the response blocks do not shrink | Conditional Follow-up V2.dc.html:1313 | designer caption/annotation/board title or screen id, not product UI text |
| 196 | CI9 | Conditional Follow-up V2.dc.html:1313 | designer caption/annotation/board title or screen id, not product UI text |
| 197 | THE TEMPLATE · A FIELD CARRYING TWO FOLLOW-UPS | Conditional Follow-up V2.dc.html:1317 | designer caption/annotation/board title or screen id, not product UI text |
| 198 | Both toggles leave the response list and sit in their own RESPONSE SETTINGS section, so the list is four rows and nothing else. Each row gai | Conditional Follow-up V2.dc.html:133 | designer caption/annotation/board title or screen id, not product UI text |
| 199 | The same list the desktop canvas carries, shortened to the width a phone has. Tapping the row opens the properties sheet. | Conditional Follow-up V2.dc.html:1352 | designer caption/annotation/board title or screen id, not product UI text |
| 200 | PROPERTIES SHEET · MONITOR ON | Conditional Follow-up V2.dc.html:1356 | designer caption/annotation/board title or screen id, not product UI text |
| 201 | ON · NOTHING CHECKED YET | Conditional Follow-up V2.dc.html:138 | designer caption/annotation/board title or screen id, not product UI text |
| 202 | Every target in the sheet is at least 44 px and every value input is 16 px, so focusing one does not zoom the page. An unchecked block is tw | Conditional Follow-up V2.dc.html:1411 | designer caption/annotation/board title or screen id, not product UI text |
| 203 | PROPERTIES SHEET · MONITOR OFF | Conditional Follow-up V2.dc.html:1415 | designer caption/annotation/board title or screen id, not product UI text |
| 204 | on the desktop. The sheet gets shorter, which on the phone is the difference between one scroll and two. | Conditional Follow-up V2.dc.html:1462 | designer caption/annotation/board title or screen id, not product UI text |
| 205 | The author can see what a follow-up consists of before committing to one: a box of text and one file. The checkbox is the condition, and it  | Conditional Follow-up V2.dc.html:180 | designer caption/annotation/board title or screen id, not product UI text |
| 206 | ON · NOT OK CHECKED | Conditional Follow-up V2.dc.html:185 | designer caption/annotation/board title or screen id, not product UI text |
| 207 | The checked block is the only one with a white ground and a blue edge. Its text area grows to four rows once it can be typed in, and Attach  | Conditional Follow-up V2.dc.html:231 | designer caption/annotation/board title or screen id, not product UI text |
| 208 | ON · INCLUDE MONITOR OFF | Conditional Follow-up V2.dc.html:236 | designer caption/annotation/board title or screen id, not product UI text |
| 209 | With Include Monitor option off, the Monitor row and its whole block go: three responses, three blocks. Text written against Monitor is kept | Conditional Follow-up V2.dc.html:274 | designer caption/annotation/board title or screen id, not product UI text |
| 210 | The cost is height: four blocks make the response list about 990 px instead of 280, which is why it sits behind a toggle that is off by defa | Conditional Follow-up V2.dc.html:277 | designer caption/annotation/board title or screen id, not product UI text |
| 211 | CI1b Builder screen with follow-ups | Conditional Follow-up V2.dc.html:281 | designer caption/annotation/board title or screen id, not product UI text |
| 212 | The same panel in the builder it belongs to | Conditional Follow-up V2.dc.html:282 | designer caption/annotation/board title or screen id, not product UI text |
| 213 | the canvas lists the follow-ups a field carries, on every field and not only the selected one | Conditional Follow-up V2.dc.html:282 | designer caption/annotation/board title or screen id, not product UI text |
| 214 | CI1b | Conditional Follow-up V2.dc.html:282 | designer caption/annotation/board title or screen id, not product UI text |
| 215 | TB3 | Conditional Follow-up V2.dc.html:387 | designer caption/annotation/board title or screen id, not product UI text |
| 216 | CI1e Builder follow-up with only a file | Conditional Follow-up V2.dc.html:390 | designer caption/annotation/board title or screen id, not product UI text |
| 217 | Builder: a follow-up with only a file | Conditional Follow-up V2.dc.html:391 | designer caption/annotation/board title or screen id, not product UI text |
| 218 | CI1e | Conditional Follow-up V2.dc.html:391 | designer caption/annotation/board title or screen id, not product UI text |
| 219 | CI1d Tooltips | Conditional Follow-up V2.dc.html:503 | designer caption/annotation/board title or screen id, not product UI text |
| 220 | The tooltips, shown alone | Conditional Follow-up V2.dc.html:504 | designer caption/annotation/board title or screen id, not product UI text |
| 221 | on the section toggle, and on the acknowledgement toggle inside a follow-up | Conditional Follow-up V2.dc.html:504 | designer caption/annotation/board title or screen id, not product UI text |
| 222 | CI1d | Conditional Follow-up V2.dc.html:504 | designer caption/annotation/board title or screen id, not product UI text |
| 223 | ON REQUIRE ACKNOWLEDGEMENT | Conditional Follow-up V2.dc.html:516 | designer caption/annotation/board title or screen id, not product UI text |
| 224 | NOT OFFERED ON OK AND N/A | Conditional Follow-up V2.dc.html:524 | designer caption/annotation/board title or screen id, not product UI text |
| 225 | A follow-up on OK or N/A is a read, so those responses have no acknowledgement toggle. | Conditional Follow-up V2.dc.html:529 | designer caption/annotation/board title or screen id, not product UI text |
| 226 | Two tooltips, one per thing a first-time author would otherwise guess at: what a follow-up is, and what acknowledging one means. The respons | Conditional Follow-up V2.dc.html:532 | designer caption/annotation/board title or screen id, not product UI text |
| 227 | CI3 Field card desktop follow-up states | Conditional Follow-up V2.dc.html:536 | designer caption/annotation/board title or screen id, not product UI text |
| 228 | Filling, desktop: marker, acknowledgement, the checked state, the error, no instruction, and a very long one | Conditional Follow-up V2.dc.html:537 | designer caption/annotation/board title or screen id, not product UI text |
| 229 | the marker sits with Add Photo and Add Note · the note and the instruction stack full width under the response | Conditional Follow-up V2.dc.html:537 | designer caption/annotation/board title or screen id, not product UI text |
| 230 | CI3 | Conditional Follow-up V2.dc.html:537 | designer caption/annotation/board title or screen id, not product UI text |
| 231 | 1 · Answered OK, and OK carries a follow-up: a marker on the footer, nothing blocked | Conditional Follow-up V2.dc.html:542 | designer caption/annotation/board title or screen id, not product UI text |
| 232 | One word and the icon. The marker is blue because it is something to read, the same blue the reference file uses, and it opens the block in  | Conditional Follow-up V2.dc.html:560 | designer caption/annotation/board title or screen id, not product UI text |
| 233 | 2 · Not OK: the follow-up opens itself and holds submit until it is acknowledged | Conditional Follow-up V2.dc.html:565 | designer caption/annotation/board title or screen id, not product UI text |
| 234 | D4 | Conditional Follow-up V2.dc.html:600 | designer caption/annotation/board title or screen id, not product UI text |
| 235 | 3 · Acknowledged: the box is checked and green, and nothing else on the card moves | Conditional Follow-up V2.dc.html:605 | designer caption/annotation/board title or screen id, not product UI text |
| 236 | Checked, the box turns green and the Required pill in the instruction header goes. Who checked it and when is recorded against the inspectio | Conditional Follow-up V2.dc.html:640 | designer caption/annotation/board title or screen id, not product UI text |
| 237 | 4 · Submit & Generate Report pressed with the box unchecked | Conditional Follow-up V2.dc.html:645 | designer caption/annotation/board title or screen id, not product UI text |
| 238 | CI5 | Conditional Follow-up V2.dc.html:682 | designer caption/annotation/board title or screen id, not product UI text |
| 239 | and marks the fields it is waiting on, and this is what the technician lands on. The error is red because it is an error, not because Not OK | Conditional Follow-up V2.dc.html:682 | designer caption/annotation/board title or screen id, not product UI text |
| 240 | 5 · Monitor, and Monitor carries no instruction: the note takes the whole width | Conditional Follow-up V2.dc.html:687 | designer caption/annotation/board title or screen id, not product UI text |
| 241 | The two-column row is there because the instruction is: with nothing to put beside it, the note runs the full width rather than leaving half | Conditional Follow-up V2.dc.html:709 | designer caption/annotation/board title or screen id, not product UI text |
| 242 | 6 · A body about twenty lines long, which is as far as an author is likely to go | Conditional Follow-up V2.dc.html:715 | designer caption/annotation/board title or screen id, not product UI text |
| 243 | Nothing truncates and nothing scrolls inside the block: the card takes whatever the author wrote and the page scrolls as it always has. Para | Conditional Follow-up V2.dc.html:762 | designer caption/annotation/board title or screen id, not product UI text |
| 244 | 7 · Not OK, and the follow-up is only a file | Conditional Follow-up V2.dc.html:767 | designer caption/annotation/board title or screen id, not product UI text |
| 245 | CI4 Field card phone follow-up states | Conditional Follow-up V2.dc.html:807 | designer caption/annotation/board title or screen id, not product UI text |
| 246 | Filling, phone: the same five states at 402 px | Conditional Follow-up V2.dc.html:808 | designer caption/annotation/board title or screen id, not product UI text |
| 247 | 52 px acknowledge row · the error and the no-instruction state included · the note opens under the response, as on | Conditional Follow-up V2.dc.html:808 | designer caption/annotation/board title or screen id, not product UI text |
| 248 | CI4 | Conditional Follow-up V2.dc.html:808 | designer caption/annotation/board title or screen id, not product UI text |
| 249 | OK · MARKER ONLY | Conditional Follow-up V2.dc.html:813 | designer caption/annotation/board title or screen id, not product UI text |
| 250 | 1234 · FOR CLODISU | Conditional Follow-up V2.dc.html:817 | designer caption/annotation/board title or screen id, not product UI text |
| 251 | Three footer buttons at 52 px, so the marker is a thumb target and not a link inside a label. Add Photo and Add Note shorten to Photo and No | Conditional Follow-up V2.dc.html:839 | designer caption/annotation/board title or screen id, not product UI text |
| 252 | NOT OK · WAITING FOR ACKNOWLEDGEMENT | Conditional Follow-up V2.dc.html:844 | designer caption/annotation/board title or screen id, not product UI text |
| 253 | , and both are inside the card. The acknowledgement keeps a full-width row of its own rather than joining the file row: at 402 px the file r | Conditional Follow-up V2.dc.html:886 | designer caption/annotation/board title or screen id, not product UI text |
| 254 | NOT OK · ACKNOWLEDGED | Conditional Follow-up V2.dc.html:891 | designer caption/annotation/board title or screen id, not product UI text |
| 255 | The checked box keeps the row it had, so nothing on the card moves. Green and checked is the whole of the acknowledged state on both surface | Conditional Follow-up V2.dc.html:925 | designer caption/annotation/board title or screen id, not product UI text |
| 256 | NOT OK · COMPLETE PRESSED, NOT ACKNOWLEDGED | Conditional Follow-up V2.dc.html:930 | designer caption/annotation/board title or screen id, not product UI text |
| 257 | SV-8181 · DIGITAL INSPECTIONS V2 · SECTION 5 | Conditional Follow-up V2.dc.html:94 | designer caption/annotation/board title or screen id, not product UI text |
| 258 | , which is what the section action opens instead of an error dialog. Same two red marks as the desktop: the box and one line under it. | Conditional Follow-up V2.dc.html:969 | designer caption/annotation/board title or screen id, not product UI text |
| 259 | CI6 | Conditional Follow-up V2.dc.html:969 | designer caption/annotation/board title or screen id, not product UI text |
| 260 | 5 Conditional follow-up | Conditional Follow-up V2.dc.html:97 | designer caption/annotation/board title or screen id, not product UI text |
| 261 | MONITOR · NOTE REQUIRED, NO INSTRUCTION | Conditional Follow-up V2.dc.html:974 | designer caption/annotation/board title or screen id, not product UI text |
| 262 | Conditional follow-up on a response | Conditional Follow-up V2.dc.html:98 | designer caption/annotation/board title or screen id, not product UI text |
| 263 | CI1b – CI9 | Conditional Follow-up V2.dc.html:98 | designer caption/annotation/board title or screen id, not product UI text |
| 264 | On the phone the note is full width in every state, so a field with no instruction is the same card with one block fewer. The Required pill  | Conditional Follow-up V2.dc.html:999 | designer caption/annotation/board title or screen id, not product UI text |
| 265 | A5 Full screen real form | Digital Inspections V2 - All Screens.dc.html:1018 | designer caption/annotation/board title or screen id, not product UI text |
| 266 | A5 | Digital Inspections V2 - All Screens.dc.html:1020 | designer caption/annotation/board title or screen id, not product UI text |
| 267 | A5b After Mark section OK | Digital Inspections V2 - All Screens.dc.html:1068 | designer caption/annotation/board title or screen id, not product UI text |
| 268 | A5b | Digital Inspections V2 - All Screens.dc.html:1070 | designer caption/annotation/board title or screen id, not product UI text |
| 269 | A6 Live clickable axle | Digital Inspections V2 - All Screens.dc.html:1087 | designer caption/annotation/board title or screen id, not product UI text |
| 270 | D3 Field card states | Digital Inspections V2 - All Screens.dc.html:1196 | designer caption/annotation/board title or screen id, not product UI text |
| 271 | D3 | Digital Inspections V2 - All Screens.dc.html:1198 | designer caption/annotation/board title or screen id, not product UI text |
| 272 | 1 · Clean card, nothing answered | Digital Inspections V2 - All Screens.dc.html:1207 | designer caption/annotation/board title or screen id, not product UI text |
| 273 | 2 · Template attached a procedure; it sits above the response, not beside it | Digital Inspections V2 - All Screens.dc.html:1228 | designer caption/annotation/board title or screen id, not product UI text |
| 274 | 3 · Add Note pressed: the block opens in place, nothing required | Digital Inspections V2 - All Screens.dc.html:1256 | designer caption/annotation/board title or screen id, not product UI text |
| 275 | 4 · Add Photo pressed; same block, thumbnails beside the target once files land | Digital Inspections V2 - All Screens.dc.html:1286 | designer caption/annotation/board title or screen id, not product UI text |
| 276 | 5 · Not OK: a note and a photo are both required, each badged on its own block | Digital Inspections V2 - All Screens.dc.html:1326 | designer caption/annotation/board title or screen id, not product UI text |
| 277 | 3 Filling an inspection, phone | Digital Inspections V2 - All Screens.dc.html:1464 | designer caption/annotation/board title or screen id, not product UI text |
| 278 | SV-8181 · DIGITAL INSPECTIONS V2 · MOBILE ARTBOARDS | Digital Inspections V2 - All Screens.dc.html:1467 | designer caption/annotation/board title or screen id, not product UI text |
| 279 | Fill screen: phone, 402 px | Digital Inspections V2 - All Screens.dc.html:1468 | designer caption/annotation/board title or screen id, not product UI text |
| 280 | The footer is section navigation and nothing else, Back: Section 1 and Next: Section 2, naming where each goes. Axle switching happens only  | Digital Inspections V2 - All Screens.dc.html:1469 | designer caption/annotation/board title or screen id, not product UI text |
| 281 | M1 Section 1 field list | Digital Inspections V2 - All Screens.dc.html:1476 | designer caption/annotation/board title or screen id, not product UI text |
| 282 | Section 1: field list | Digital Inspections V2 - All Screens.dc.html:1477 | designer caption/annotation/board title or screen id, not product UI text |
| 283 | M1 | Digital Inspections V2 - All Screens.dc.html:1477 | designer caption/annotation/board title or screen id, not product UI text |
| 284 | One card per field, the open one expanded. One full-width primary action, naming where it goes. Android draws the back gesture, so the foote | Digital Inspections V2 - All Screens.dc.html:1478 | designer caption/annotation/board title or screen id, not product UI text |
| 285 | M2 Section 2 last section | Digital Inspections V2 - All Screens.dc.html:1536 | designer caption/annotation/board title or screen id, not product UI text |
| 286 | Section 2: the last one | Digital Inspections V2 - All Screens.dc.html:1537 | designer caption/annotation/board title or screen id, not product UI text |
| 287 | M2 | Digital Inspections V2 - All Screens.dc.html:1537 | designer caption/annotation/board title or screen id, not product UI text |
| 288 | APP-BAR MENU · WHOLE INSPECTION | Digital Inspections V2 - All Screens.dc.html:1538 | designer caption/annotation/board title or screen id, not product UI text |
| 289 | M3 What is missing | Digital Inspections V2 - All Screens.dc.html:1607 | designer caption/annotation/board title or screen id, not product UI text |
| 290 | What is still missing | Digital Inspections V2 - All Screens.dc.html:1608 | designer caption/annotation/board title or screen id, not product UI text |
| 291 | Reached by tapping the badge on Submit & Generate Report. Each row goes straight to that field with the cursor in it, never to a summary. | Digital Inspections V2 - All Screens.dc.html:1609 | designer caption/annotation/board title or screen id, not product UI text |
| 292 | M4 Axle set not inspected | Digital Inspections V2 - All Screens.dc.html:1664 | designer caption/annotation/board title or screen id, not product UI text |
| 293 | Per axle: nothing inspected | Digital Inspections V2 - All Screens.dc.html:1665 | designer caption/annotation/board title or screen id, not product UI text |
| 294 | M4 | Digital Inspections V2 - All Screens.dc.html:1665 | designer caption/annotation/board title or screen id, not product UI text |
| 295 | Tapping an axle in the sub-header swaps the page to it; the footer stays on the section. Labels are 11 px and value rows 52 px, so left oute | Digital Inspections V2 - All Screens.dc.html:1666 | designer caption/annotation/board title or screen id, not product UI text |
| 296 | M5 Axle set mixed verdicts | Digital Inspections V2 - All Screens.dc.html:1742 | designer caption/annotation/board title or screen id, not product UI text |
| 297 | Left outer Not OK, left inner OK | Digital Inspections V2 - All Screens.dc.html:1743 | designer caption/annotation/board title or screen id, not product UI text |
| 298 | M5 | Digital Inspections V2 - All Screens.dc.html:1743 | designer caption/annotation/board title or screen id, not product UI text |
| 299 | Each position states its own verdict above its value, so the block reads without opening anything. A row holding any Not OK position turns i | Digital Inspections V2 - All Screens.dc.html:1744 | designer caption/annotation/board title or screen id, not product UI text |
| 300 | M6 Position verdict sheet | Digital Inspections V2 - All Screens.dc.html:1845 | designer caption/annotation/board title or screen id, not product UI text |
| 301 | Verdict sheet: names the position | Digital Inspections V2 - All Screens.dc.html:1846 | designer caption/annotation/board title or screen id, not product UI text |
| 302 | M6 | Digital Inspections V2 - All Screens.dc.html:1846 | designer caption/annotation/board title or screen id, not product UI text |
| 303 | The dropdown on a value opens a sheet titled with the position, the measurement and the value entered. | Digital Inspections V2 - All Screens.dc.html:1847 | designer caption/annotation/board title or screen id, not product UI text |
| 304 | M7 Checkbox reference file | Digital Inspections V2 - All Screens.dc.html:1881 | designer caption/annotation/board title or screen id, not product UI text |
| 305 | Checkbox: reference file, not answered | Digital Inspections V2 - All Screens.dc.html:1882 | designer caption/annotation/board title or screen id, not product UI text |
| 306 | M7 | Digital Inspections V2 - All Screens.dc.html:1882 | designer caption/annotation/board title or screen id, not product UI text |
| 307 | The reference file is always there, whatever the answer will be. It sits above the response row, so it never competes with it. | Digital Inspections V2 - All Screens.dc.html:1883 | designer caption/annotation/board title or screen id, not product UI text |
| 308 | M8 Checkbox Not OK requirements | Digital Inspections V2 - All Screens.dc.html:1937 | designer caption/annotation/board title or screen id, not product UI text |
| 309 | Checkbox: Not OK, note and photo required | Digital Inspections V2 - All Screens.dc.html:1938 | designer caption/annotation/board title or screen id, not product UI text |
| 310 | M8 | Digital Inspections V2 - All Screens.dc.html:1938 | designer caption/annotation/board title or screen id, not product UI text |
| 311 | What used to be a follow-up branch is now validation. Not OK turns on both rules the template set, and the count rides on the footer action. | Digital Inspections V2 - All Screens.dc.html:1939 | designer caption/annotation/board title or screen id, not product UI text |
| 312 | 4 Inspection → work order | Digital Inspections V2 - All Screens.dc.html:2015 | designer caption/annotation/board title or screen id, not product UI text |
| 313 | SV-8181 · DIGITAL INSPECTIONS V2 · INSPECTION → WORK ORDER | Digital Inspections V2 - All Screens.dc.html:2018 | designer caption/annotation/board title or screen id, not product UI text |
| 314 | The hand-off | Digital Inspections V2 - All Screens.dc.html:2019 | designer caption/annotation/board title or screen id, not product UI text |
| 315 | , in the unit's | Digital Inspections V2 - All Screens.dc.html:2020 | designer caption/annotation/board title or screen id, not product UI text |
| 316 | Inspections list | Digital Inspections V2 - All Screens.dc.html:2020 | designer caption/annotation/board title or screen id, not product UI text |
| 317 | , and started from the work order with no inspection at all. | Digital Inspections V2 - All Screens.dc.html:2020 | designer caption/annotation/board title or screen id, not product UI text |
| 318 | A Completed inspection no ShopCoach | Digital Inspections V2 - All Screens.dc.html:2025 | designer caption/annotation/board title or screen id, not product UI text |
| 319 | Completed inspection: no ShopCoach | Digital Inspections V2 - All Screens.dc.html:2026 | designer caption/annotation/board title or screen id, not product UI text |
| 320 | two actions: Go to work order, View PDF | Digital Inspections V2 - All Screens.dc.html:2026 | designer caption/annotation/board title or screen id, not product UI text |
| 321 | B Completed inspection with ShopCoach | Digital Inspections V2 - All Screens.dc.html:2086 | designer caption/annotation/board title or screen id, not product UI text |
| 322 | Completed inspection: with ShopCoach | Digital Inspections V2 - All Screens.dc.html:2087 | designer caption/annotation/board title or screen id, not product UI text |
| 323 | , opened the same way from Notes and Asset › Inspections | Digital Inspections V2 - All Screens.dc.html:2087 | designer caption/annotation/board title or screen id, not product UI text |
| 324 | B2 | Digital Inspections V2 - All Screens.dc.html:2087 | designer caption/annotation/board title or screen id, not product UI text |
| 325 | B3 Completed inspection lines already added | Digital Inspections V2 - All Screens.dc.html:2154 | designer caption/annotation/board title or screen id, not product UI text |
| 326 | Completed inspection: lines already added | Digital Inspections V2 - All Screens.dc.html:2155 | designer caption/annotation/board title or screen id, not product UI text |
| 327 | B3 | Digital Inspections V2 - All Screens.dc.html:2155 | designer caption/annotation/board title or screen id, not product UI text |
| 328 | B4 Completed inspection work order deleted | Digital Inspections V2 - All Screens.dc.html:2218 | designer caption/annotation/board title or screen id, not product UI text |
| 329 | Completed inspection: work order deleted | Digital Inspections V2 - All Screens.dc.html:2219 | designer caption/annotation/board title or screen id, not product UI text |
| 330 | B4 | Digital Inspections V2 - All Screens.dc.html:2219 | designer caption/annotation/board title or screen id, not product UI text |
| 331 | B4b Completed inspection work order deleted lines on new work order | Digital Inspections V2 - All Screens.dc.html:2273 | designer caption/annotation/board title or screen id, not product UI text |
| 332 | Completed inspection: work order deleted, lines on a new work order | Digital Inspections V2 - All Screens.dc.html:2274 | designer caption/annotation/board title or screen id, not product UI text |
| 333 | B4b | Digital Inspections V2 - All Screens.dc.html:2274 | designer caption/annotation/board title or screen id, not product UI text |
| 334 | B2 Build targets menu | Digital Inspections V2 - All Screens.dc.html:2330 | designer caption/annotation/board title or screen id, not product UI text |
| 335 | Build targets: menu open | Digital Inspections V2 - All Screens.dc.html:2331 | designer caption/annotation/board title or screen id, not product UI text |
| 336 | shown alone so it does not cover the findings it acts on · the same menu opens from all three entry points: this screen, work order › Notes, | Digital Inspections V2 - All Screens.dc.html:2331 | designer caption/annotation/board title or screen id, not product UI text |
| 337 | C1 | Digital Inspections V2 - All Screens.dc.html:2346 | designer caption/annotation/board title or screen id, not product UI text |
| 338 | B2b Build targets work order cannot take lines | Digital Inspections V2 - All Screens.dc.html:2351 | designer caption/annotation/board title or screen id, not product UI text |
| 339 | Build targets: the work order cannot take lines | Digital Inspections V2 - All Screens.dc.html:2352 | designer caption/annotation/board title or screen id, not product UI text |
| 340 | Complete, Invoiced, Paid, Declined, or an invoice exists | Digital Inspections V2 - All Screens.dc.html:2352 | designer caption/annotation/board title or screen id, not product UI text |
| 341 | B2b | Digital Inspections V2 - All Screens.dc.html:2352 | designer caption/annotation/board title or screen id, not product UI text |
| 342 | C1 Generating | Digital Inspections V2 - All Screens.dc.html:2368 | designer caption/annotation/board title or screen id, not product UI text |
| 343 | The moment in between | Digital Inspections V2 - All Screens.dc.html:2369 | designer caption/annotation/board title or screen id, not product UI text |
| 344 | on the work order already · nothing to fill in, nothing to confirm | Digital Inspections V2 - All Screens.dc.html:2369 | designer caption/annotation/board title or screen id, not product UI text |
| 345 | and it stays that way until someone says otherwise. And a verdict belongs to the smallest thing it describes: one tire position. Every roll- | Digital Inspections V2 - All Screens.dc.html:237 | designer caption/annotation/board title or screen id, not product UI text |
| 346 | TB1 · TB2 · TB2b · TB3 · TB7 | Digital Inspections V2 - All Screens.dc.html:240 | designer caption/annotation/board title or screen id, not product UI text |
| 347 | Filling an inspection, desktop | Digital Inspections V2 - All Screens.dc.html:242 | designer caption/annotation/board title or screen id, not product UI text |
| 348 | A1 · A2 · A3 · A3b · A5 · A5b · A6 · D3 · D4 | Digital Inspections V2 - All Screens.dc.html:242 | designer caption/annotation/board title or screen id, not product UI text |
| 349 | Filling an inspection, phone | Digital Inspections V2 - All Screens.dc.html:243 | designer caption/annotation/board title or screen id, not product UI text |
| 350 | M1 · M2 · M3 · M4 · M5 · M6 · M7 · M8 | Digital Inspections V2 - All Screens.dc.html:243 | designer caption/annotation/board title or screen id, not product UI text |
| 351 | C2 Landed reviewing | Digital Inspections V2 - All Screens.dc.html:2433 | designer caption/annotation/board title or screen id, not product UI text |
| 352 | Where it lands: already finished, waiting to be reviewed | Digital Inspections V2 - All Screens.dc.html:2434 | designer caption/annotation/board title or screen id, not product UI text |
| 353 | no prompt, no query box · rows pre-selected and editable | Digital Inspections V2 - All Screens.dc.html:2434 | designer caption/annotation/board title or screen id, not product UI text |
| 354 | C2 | Digital Inspections V2 - All Screens.dc.html:2434 | designer caption/annotation/board title or screen id, not product UI text |
| 355 | Inspection to work order | Digital Inspections V2 - All Screens.dc.html:244 | designer caption/annotation/board title or screen id, not product UI text |
| 356 | A · B · B2 · B2b · B3 · B4 · B4b · C1 · C2 · C3 · C4 · D · E · E2 · E3 · F · P1 · P1b · P2 · P2b · P3 · P4 | Digital Inspections V2 - All Screens.dc.html:244 | designer caption/annotation/board title or screen id, not product UI text |
| 357 | CI1b · CI1c · CI1d · CI1e · CI3 · CI4 · CI5 · CI6 · CI7 · CI8 · CI9 | Digital Inspections V2 - All Screens.dc.html:245 | designer caption/annotation/board title or screen id, not product UI text |
| 358 | Customer report PDF | Digital Inspections V2 - All Screens.dc.html:246 | designer caption/annotation/board title or screen id, not product UI text |
| 359 | 1 Template builder, desktop | Digital Inspections V2 - All Screens.dc.html:250 | designer caption/annotation/board title or screen id, not product UI text |
| 360 | C3 ShopCoach call failed | Digital Inspections V2 - All Screens.dc.html:2502 | designer caption/annotation/board title or screen id, not product UI text |
| 361 | ShopCoach call failed | Digital Inspections V2 - All Screens.dc.html:2503 | designer caption/annotation/board title or screen id, not product UI text |
| 362 | SV-8181 · DIGITAL INSPECTIONS V2 · TEMPLATE BUILDER, FULL SCREENS | Digital Inspections V2 - All Screens.dc.html:253 | designer caption/annotation/board title or screen id, not product UI text |
| 363 | C4 No lines drafted | Digital Inspections V2 - All Screens.dc.html:2532 | designer caption/annotation/board title or screen id, not product UI text |
| 364 | No lines drafted | Digital Inspections V2 - All Screens.dc.html:2533 | designer caption/annotation/board title or screen id, not product UI text |
| 365 | C4 | Digital Inspections V2 - All Screens.dc.html:2533 | designer caption/annotation/board title or screen id, not product UI text |
| 366 | Template builder: whole screens | Digital Inspections V2 - All Screens.dc.html:254 | designer caption/annotation/board title or screen id, not product UI text |
| 367 | line between the name and its options, costing one line of height; every field has a general reference file that is always available, with i | Digital Inspections V2 - All Screens.dc.html:255 | designer caption/annotation/board title or screen id, not product UI text |
| 368 | ); and one rule arrives on for new templates: a note when Monitor or Not OK; the photo rules are opt-in. Renaming happens on the field, with | Digital Inspections V2 - All Screens.dc.html:255 | designer caption/annotation/board title or screen id, not product UI text |
| 369 | is Preview mode: the template rendered as the technician gets it, in the canvas, without publishing it first. | Digital Inspections V2 - All Screens.dc.html:255 | designer caption/annotation/board title or screen id, not product UI text |
| 370 | TB7 | Digital Inspections V2 - All Screens.dc.html:255 | designer caption/annotation/board title or screen id, not product UI text |
| 371 | D Started from the work order | Digital Inspections V2 - All Screens.dc.html:2563 | designer caption/annotation/board title or screen id, not product UI text |
| 372 | Started from the work order | Digital Inspections V2 - All Screens.dc.html:2564 | designer caption/annotation/board title or screen id, not product UI text |
| 373 | same panel, same treatment · entered from the Lines tab instead of an inspection | Digital Inspections V2 - All Screens.dc.html:2564 | designer caption/annotation/board title or screen id, not product UI text |
| 374 | TB1 Empty template | Digital Inspections V2 - All Screens.dc.html:260 | designer caption/annotation/board title or screen id, not product UI text |
| 375 | five starters with content · an equipment slot pending · or pick a field type | Digital Inspections V2 - All Screens.dc.html:261 | designer caption/annotation/board title or screen id, not product UI text |
| 376 | TB1 | Digital Inspections V2 - All Screens.dc.html:261 | designer caption/annotation/board title or screen id, not product UI text |
| 377 | Work order · Notes: the completed inspection lands here | Digital Inspections V2 - All Screens.dc.html:2639 | designer caption/annotation/board title or screen id, not product UI text |
| 378 | the report is the note · Build lines carries the same purple treatment | Digital Inspections V2 - All Screens.dc.html:2639 | designer caption/annotation/board title or screen id, not product UI text |
| 379 | E2 Notes tab lines already added | Digital Inspections V2 - All Screens.dc.html:2728 | designer caption/annotation/board title or screen id, not product UI text |
| 380 | E3 Notes tab original work order deleted | Digital Inspections V2 - All Screens.dc.html:2817 | designer caption/annotation/board title or screen id, not product UI text |
| 381 | Work order S-200 · Notes: built from an inspection whose work order was deleted | Digital Inspections V2 - All Screens.dc.html:2818 | designer caption/annotation/board title or screen id, not product UI text |
| 382 | F Asset inspections tab | Digital Inspections V2 - All Screens.dc.html:2907 | designer caption/annotation/board title or screen id, not product UI text |
| 383 | Customer · Asset · Inspections | Digital Inspections V2 - All Screens.dc.html:2908 | designer caption/annotation/board title or screen id, not product UI text |
| 384 | F | Digital Inspections V2 - All Screens.dc.html:2908 | designer caption/annotation/board title or screen id, not product UI text |
| 385 | every inspection this unit has had · the action column is the point of the table | Digital Inspections V2 - All Screens.dc.html:2908 | designer caption/annotation/board title or screen id, not product UI text |
| 386 | P1 Completed inspection phone with ShopCoach | Digital Inspections V2 - All Screens.dc.html:3075 | designer caption/annotation/board title or screen id, not product UI text |
| 387 | Completed inspection on a phone: with ShopCoach | Digital Inspections V2 - All Screens.dc.html:3076 | designer caption/annotation/board title or screen id, not product UI text |
| 388 | the summary card leads: completion line, a count per verdict, then every flagged position as field · axle · row · position with the reading  | Digital Inspections V2 - All Screens.dc.html:3076 | designer caption/annotation/board title or screen id, not product UI text |
| 389 | P1 | Digital Inspections V2 - All Screens.dc.html:3076 | designer caption/annotation/board title or screen id, not product UI text |
| 390 | P1b Completed inspection phone lines already added | Digital Inspections V2 - All Screens.dc.html:3080 | designer caption/annotation/board title or screen id, not product UI text |
| 391 | Completed inspection on a phone: lines already added | Digital Inspections V2 - All Screens.dc.html:3081 | designer caption/annotation/board title or screen id, not product UI text |
| 392 | P1b | Digital Inspections V2 - All Screens.dc.html:3081 | designer caption/annotation/board title or screen id, not product UI text |
| 393 | P2 Build target sheet phone | Digital Inspections V2 - All Screens.dc.html:3085 | designer caption/annotation/board title or screen id, not product UI text |
| 394 | Build lines: target sheet | Digital Inspections V2 - All Screens.dc.html:3086 | designer caption/annotation/board title or screen id, not product UI text |
| 395 | P2 | Digital Inspections V2 - All Screens.dc.html:3086 | designer caption/annotation/board title or screen id, not product UI text |
| 396 | P2b Build target sheet phone work order cannot take lines | Digital Inspections V2 - All Screens.dc.html:3090 | designer caption/annotation/board title or screen id, not product UI text |
| 397 | Build lines: target sheet, the work order cannot take lines | Digital Inspections V2 - All Screens.dc.html:3091 | designer caption/annotation/board title or screen id, not product UI text |
| 398 | P2b | Digital Inspections V2 - All Screens.dc.html:3091 | designer caption/annotation/board title or screen id, not product UI text |
| 399 | P3 Drafted lines phone | Digital Inspections V2 - All Screens.dc.html:3095 | designer caption/annotation/board title or screen id, not product UI text |
| 400 | Drafted lines, on the phone | Digital Inspections V2 - All Screens.dc.html:3096 | designer caption/annotation/board title or screen id, not product UI text |
| 401 | the technician finishes the build on the device they read the inspection on; rows pre-selected, editable, nothing added until Add Lines | Digital Inspections V2 - All Screens.dc.html:3096 | designer caption/annotation/board title or screen id, not product UI text |
| 402 | P3 | Digital Inspections V2 - All Screens.dc.html:3096 | designer caption/annotation/board title or screen id, not product UI text |
| 403 | P4 Completed inspection phone no ShopCoach | Digital Inspections V2 - All Screens.dc.html:3100 | designer caption/annotation/board title or screen id, not product UI text |
| 404 | Completed inspection on a phone: without ShopCoach | Digital Inspections V2 - All Screens.dc.html:3101 | designer caption/annotation/board title or screen id, not product UI text |
| 405 | P4 | Digital Inspections V2 - All Screens.dc.html:3101 | designer caption/annotation/board title or screen id, not product UI text |
| 406 | two actions and a plain line in place of the ShopCoach note · and the zero rule: this inspection has no Monitor findings, so no Monitor coun | Digital Inspections V2 - All Screens.dc.html:3101 | designer caption/annotation/board title or screen id, not product UI text |
| 407 | TB2 Per axle selected | Digital Inspections V2 - All Screens.dc.html:314 | designer caption/annotation/board title or screen id, not product UI text |
| 408 | Per axle selected: rows editor | Digital Inspections V2 - All Screens.dc.html:315 | designer caption/annotation/board title or screen id, not product UI text |
| 409 | unit and scope per row · defaults on their own line | Digital Inspections V2 - All Screens.dc.html:315 | designer caption/annotation/board title or screen id, not product UI text |
| 410 | TB2 | Digital Inspections V2 - All Screens.dc.html:315 | designer caption/annotation/board title or screen id, not product UI text |
| 411 | TB2b Per axle add row menu | Digital Inspections V2 - All Screens.dc.html:427 | designer caption/annotation/board title or screen id, not product UI text |
| 412 | Per axle: Push-rod travel removed, add menu open | Digital Inspections V2 - All Screens.dc.html:428 | designer caption/annotation/board title or screen id, not product UI text |
| 413 | TB2b | Digital Inspections V2 - All Screens.dc.html:428 | designer caption/annotation/board title or screen id, not product UI text |
| 414 | 6 Customer report PDF | Digital Inspections V2 - All Screens.dc.html:4482 | designer caption/annotation/board title or screen id, not product UI text |
| 415 | The report generated when an inspection is submitted | Digital Inspections V2 - All Screens.dc.html:4485 | designer caption/annotation/board title or screen id, not product UI text |
| 416 | Inspection Report PDF | Digital Inspections V2 - All Screens.dc.html:4486 | designer caption/annotation/board title or screen id, not product UI text |
| 417 | R1 Customer report PDF | Digital Inspections V2 - All Screens.dc.html:4488 | designer caption/annotation/board title or screen id, not product UI text |
| 418 | TB3 Checkbox selected | Digital Inspections V2 - All Screens.dc.html:532 | designer caption/annotation/board title or screen id, not product UI text |
| 419 | Checkbox selected: responses, reference file, validation | Digital Inspections V2 - All Screens.dc.html:533 | designer caption/annotation/board title or screen id, not product UI text |
| 420 | Add follow-up to a response off, which is the default · the general reference file is always there | Digital Inspections V2 - All Screens.dc.html:533 | designer caption/annotation/board title or screen id, not product UI text |
| 421 | TB7 Preview mode | Digital Inspections V2 - All Screens.dc.html:604 | designer caption/annotation/board title or screen id, not product UI text |
| 422 | Preview: the template as the technician gets it, without leaving the builder | Digital Inspections V2 - All Screens.dc.html:605 | designer caption/annotation/board title or screen id, not product UI text |
| 423 | Read only. The only live controls are + Add Axle and delete axle, which Axle 1 never has; adding or deleting an axle writes the count back t | Digital Inspections V2 - All Screens.dc.html:605 | designer caption/annotation/board title or screen id, not product UI text |
| 424 | PREVIEW · PHONE | Digital Inspections V2 - All Screens.dc.html:638 | designer caption/annotation/board title or screen id, not product UI text |
| 425 | 2 Filling an inspection, desktop | Digital Inspections V2 - All Screens.dc.html:672 | designer caption/annotation/board title or screen id, not product UI text |
| 426 | SV-8181 · DIGITAL INSPECTIONS V2 · DESKTOP ARTBOARDS | Digital Inspections V2 - All Screens.dc.html:675 | designer caption/annotation/board title or screen id, not product UI text |
| 427 | Fill screen: desktop | Digital Inspections V2 - All Screens.dc.html:676 | designer caption/annotation/board title or screen id, not product UI text |
| 428 | A dual axle records four tire pressures, so it needs four verdicts. Each value carries its own: a dropdown attached to the input it judges,  | Digital Inspections V2 - All Screens.dc.html:677 | designer caption/annotation/board title or screen id, not product UI text |
| 429 | A1 Dual axle not inspected | Digital Inspections V2 - All Screens.dc.html:681 | designer caption/annotation/board title or screen id, not product UI text |
| 430 | A1 | Digital Inspections V2 - All Screens.dc.html:683 | designer caption/annotation/board title or screen id, not product UI text |
| 431 | A2 Verdict dropdown open | Digital Inspections V2 - All Screens.dc.html:785 | designer caption/annotation/board title or screen id, not product UI text |
| 432 | A2 | Digital Inspections V2 - All Screens.dc.html:787 | designer caption/annotation/board title or screen id, not product UI text |
| 433 | A3 Complete mixed verdicts | Digital Inspections V2 - All Screens.dc.html:831 | designer caption/annotation/board title or screen id, not product UI text |
| 434 | A3 | Digital Inspections V2 - All Screens.dc.html:833 | designer caption/annotation/board title or screen id, not product UI text |
| 435 | A3b Complete brake Not OK | Digital Inspections V2 - All Screens.dc.html:924 | designer caption/annotation/board title or screen id, not product UI text |
| 436 | A3b | Digital Inspections V2 - All Screens.dc.html:926 | designer caption/annotation/board title or screen id, not product UI text |
| 437 | line between the name and its options, costing one line of height; every field has a general reference file that is always available, with i | Inspection Template Builder V2 - Desktop.dc.html:59 | designer caption/annotation/board title or screen id, not product UI text |
| 438 | SV-8181 · DIGITAL INSPECTIONS V2 · PROTOTYPE | Prototype - Hub.dc.html:20 | designer caption/annotation/board title or screen id, not product UI text |
| 439 | Three clickable flows, in the order a template is used. Each has a Desktop and Phone switch at the top. Data is fixed per flow: builder edit | Prototype - Hub.dc.html:22 | designer caption/annotation/board title or screen id, not product UI text |
| 440 | image.png | image-and-pdf-texts.txt:44 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.07.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 441 | 01 Testiung 6 items inspected | image-and-pdf-texts.txt:52 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.07.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 442 | I see we show the VIN here. Do we show any other asset info? If not, we should | transcribed/image-and-pdf-texts.txt:42 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.07.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 443 | VIN shoudl be updated to VIN/Serial | transcribed/image-and-pdf-texts.txt:43 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.07.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 444 | QA Testing 11 Polson Street Toronto, Ontario M5A 1A4 (543) 534 - 5345 | transcribed/image-and-pdf-texts.txt:45 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.07.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 445 | INSPECTION REPORT S-229 | transcribed/image-and-pdf-texts.txt:46 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.07.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 446 | Inspected Aug 6, 2026 | transcribed/image-and-pdf-texts.txt:47 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.07.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 447 | TESTING LIVE WITH THE TEAM | transcribed/image-and-pdf-texts.txt:48 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.07.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 448 | Milos Vasic Company Austin Avenue Toronto, Ontario M4M (513) 798-0932 | transcribed/image-and-pdf-texts.txt:50 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.07.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 449 | Testiung 6 items inspected | transcribed/image-and-pdf-texts.txt:52 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.07.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 450 | g issue. But a lot of changes here based on the instructions | transcribed/image-and-pdf-texts.txt:53 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.07.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 451 | is currently pulling the contat info - this needs to show full company info including address, phone number and contact name 2. | image-and-pdf-texts.txt:55 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.17.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 452 | technician 3. | image-and-pdf-texts.txt:57 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.17.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 453 | 01 Engine Powered System 6 items inspected | image-and-pdf-texts.txt:66 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.17.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 454 | A couple more things here for V2 @Milos Vasic: 1. The | transcribed/image-and-pdf-texts.txt:54 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.17.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 455 | technician should say | transcribed/image-and-pdf-texts.txt:56 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.17.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 456 | should say asset | transcribed/image-and-pdf-texts.txt:58 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.17.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 457 | Short Track Equipment 16830 110 Avenue Northwest Edmonton, Alberta T5P 1G9 (780) 877 - 0225 | transcribed/image-and-pdf-texts.txt:59 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.17.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 458 | INSPECTION REPORT #S-2913 Inspected Jul 31, 2026 3:31 PM | transcribed/image-and-pdf-texts.txt:60 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.17.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 459 | SCISSOR LIFT INSPECTION REPORT · VERSION 4 | transcribed/image-and-pdf-texts.txt:61 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.17.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 460 | Need full company info. Name, Address, Phone and contact Name | transcribed/image-and-pdf-texts.txt:63 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.17.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 461 | Engine Powered System 6 items inspected | transcribed/image-and-pdf-texts.txt:66 | stakeholder feedback in uploads/Screenshot 2026-09-29 at 10.30.17.png (adopted as PRD S13-R3/R9/R10; design R1 follows) |
| 462 | SV-8181 · DIGITAL INSPECTIONS V2 | transcribed/image-and-pdf-texts.txt:127 | superseded earlier design draft or crop: .thumbnail (replaced by the 14 Oct boards) |
| 463 | Template builder, desktop | transcribed/image-and-pdf-texts.txt:129 | superseded earlier design draft or crop: .thumbnail (replaced by the 14 Oct boards) |
| 464 | New template: nothing added yet | transcribed/image-and-pdf-texts.txt:130 | superseded earlier design draft or crop: .thumbnail (replaced by the 14 Oct boards) |
| 465 | 1 row Not OK | image-and-pdf-texts.txt:361 | superseded earlier design draft or crop: 2026-08-18 10.40.45.png (replaced by the 14 Oct boards) |
| 466 | worst of 4 rows | image-and-pdf-texts.txt:368 | superseded earlier design draft or crop: 2026-08-18 10.40.45.png (replaced by the 14 Oct boards) |
| 467 | D2 Axle set — dual axle, rows disagree | transcribed/image-and-pdf-texts.txt:357 | superseded earlier design draft or crop: 2026-08-18 10.40.45.png (replaced by the 14 Oct boards) |
| 468 | the state the old design handled worst | transcribed/image-and-pdf-texts.txt:358 | superseded earlier design draft or crop: 2026-08-18 10.40.45.png (replaced by the 14 Oct boards) |
| 469 | Brake & tire set | transcribed/image-and-pdf-texts.txt:359 | superseded earlier design draft or crop: 2026-08-18 10.40.45.png (replaced by the 14 Oct boards) |
| 470 | Per axle 2 axles · 8 rows | transcribed/image-and-pdf-texts.txt:360 | superseded earlier design draft or crop: 2026-08-18 10.40.45.png (replaced by the 14 Oct boards) |
| 471 | row Not OK | transcribed/image-and-pdf-texts.txt:361 | superseded earlier design draft or crop: 2026-08-18 10.40.45.png (replaced by the 14 Oct boards) |
| 472 | Axle 1 · Not OK | transcribed/image-and-pdf-texts.txt:364 | superseded earlier design draft or crop: 2026-08-18 10.40.45.png (replaced by the 14 Oct boards) |
| 473 | Axle 2 · OK | transcribed/image-and-pdf-texts.txt:365 | superseded earlier design draft or crop: 2026-08-18 10.40.45.png (replaced by the 14 Oct boards) |
| 474 | Set all rows | transcribed/image-and-pdf-texts.txt:369 | superseded earlier design draft or crop: 2026-08-18 10.40.45.png (replaced by the 14 Oct boards) |
| 475 | Per-brake rows record one value per side. Per-tire rows follow Single / Dual. | transcribed/image-and-pdf-texts.txt:370 | superseded earlier design draft or crop: 2026-08-18 10.40.45.png (replaced by the 14 Oct boards) |
| 476 | Axle 2 Drum · Dual · all 4 rows entered | transcribed/image-and-pdf-texts.txt:371 | superseded earlier design draft or crop: 2026-08-18 10.40.45.png (replaced by the 14 Oct boards) |
| 477 | Axle: OK | transcribed/image-and-pdf-texts.txt:372 | superseded earlier design draft or crop: 2026-08-18 10.40.45.png (replaced by the 14 Oct boards) |
| 478 | Testiramo gume brate moj | transcribed/image-and-pdf-texts.txt:376 | superseded earlier design draft or crop: 2026-08-18 10.49.01.png (replaced by the 14 Oct boards) |
| 479 | Per axle · 4 measurement rows · left / right | transcribed/image-and-pdf-texts.txt:377 | superseded earlier design draft or crop: 2026-08-18 10.49.01.png (replaced by the 14 Oct boards) |
| 480 | Tap a tire to jump to its value | transcribed/image-and-pdf-texts.txt:379 | superseded earlier design draft or crop: 2026-08-18 10.49.01.png (replaced by the 14 Oct boards) |
| 481 | Axle 1 · Monitor | transcribed/image-and-pdf-texts.txt:380 | superseded earlier design draft or crop: 2026-08-18 10.49.01.png (replaced by the 14 Oct boards) |
| 482 | Axle 2 · N/A | transcribed/image-and-pdf-texts.txt:381 | superseded earlier design draft or crop: 2026-08-18 10.49.01.png (replaced by the 14 Oct boards) |
| 483 | Axle: Monitor | transcribed/image-and-pdf-texts.txt:383 | superseded earlier design draft or crop: 2026-08-18 10.49.01.png (replaced by the 14 Oct boards) |
| 484 | Axle 2 Dual · 0 of 4 rows judged | transcribed/image-and-pdf-texts.txt:389 | superseded earlier design draft or crop: 2026-08-18 10.49.01.png (replaced by the 14 Oct boards) |
| 485 | A4 Single axle — two positions · and the row shortcut | transcribed/image-and-pdf-texts.txt:453 | superseded earlier design draft or crop: 2026-08-18 20.00.44.png (replaced by the 14 Oct boards) |
| 486 | same control, fewer columns | transcribed/image-and-pdf-texts.txt:454 | superseded earlier design draft or crop: 2026-08-18 20.00.44.png (replaced by the 14 Oct boards) |
| 487 | SINGLE AXLE · ONE TIRE PER SIDE | transcribed/image-and-pdf-texts.txt:455 | superseded earlier design draft or crop: 2026-08-18 20.00.44.png (replaced by the 14 Oct boards) |
| 488 | OK per tire · both OK | transcribed/image-and-pdf-texts.txt:456 | superseded earlier design draft or crop: 2026-08-18 20.00.44.png (replaced by the 14 Oct boards) |
| 489 | Monitor per tire · worst of 2 | transcribed/image-and-pdf-texts.txt:457 | superseded earlier design draft or crop: 2026-08-18 20.00.44.png (replaced by the 14 Oct boards) |
| 490 | OK per brake · both OK | transcribed/image-and-pdf-texts.txt:458 | superseded earlier design draft or crop: 2026-08-18 20.00.44.png (replaced by the 14 Oct boards) |
| 491 | ROW SHORTCUT — SET EVERY POSITION IN ONE ROW | transcribed/image-and-pdf-texts.txt:459 | superseded earlier design draft or crop: 2026-08-18 20.00.44.png (replaced by the 14 Oct boards) |
| 492 | Tire pressure PSI 4 tires Set all 4 tires | transcribed/image-and-pdf-texts.txt:460 | superseded earlier design draft or crop: 2026-08-18 20.00.44.png (replaced by the 14 Oct boards) |
| 493 | AXLE SHORTCUT | transcribed/image-and-pdf-texts.txt:461 | superseded earlier design draft or crop: 2026-08-18 20.00.44.png (replaced by the 14 Oct boards) |
| 494 | The axle header keeps a Set all positions action ... Positions already Not OK are kept unless the overwrite is confirmed. | transcribed/image-and-pdf-texts.txt:462 | superseded earlier design draft or crop: 2026-08-18 20.00.44.png (replaced by the 14 Oct boards) |
| 495 | Roll-up, one rule at every level: tire -> row -> axle -> field. Worst wins: Not OK > Monitor > OK > N/A. A row with any position still Not i | transcribed/image-and-pdf-texts.txt:463 | superseded earlier design draft or crop: 2026-08-18 20.00.44.png (replaced by the 14 Oct boards) |
| 496 | 2 tires Not OK | image-and-pdf-texts.txt:468 | superseded earlier design draft or crop: 2026-08-18 20.01.50.png (replaced by the 14 Oct boards) |
| 497 | worst of 12 positions | image-and-pdf-texts.txt:473 | superseded earlier design draft or crop: 2026-08-18 20.01.50.png (replaced by the 14 Oct boards) |
| 498 | A3 Complete — left outer Not OK, left inner OK | transcribed/image-and-pdf-texts.txt:464 | superseded earlier design draft or crop: 2026-08-18 20.01.50.png (replaced by the 14 Oct boards) |
| 499 | the case the old single row verdict could not record | transcribed/image-and-pdf-texts.txt:465 | superseded earlier design draft or crop: 2026-08-18 20.01.50.png (replaced by the 14 Oct boards) |
| 500 | Per axle 4 measurement rows · verdict per tire | transcribed/image-and-pdf-texts.txt:467 | superseded earlier design draft or crop: 2026-08-18 20.01.50.png (replaced by the 14 Oct boards) |
| 501 | tires Not OK | transcribed/image-and-pdf-texts.txt:468 | superseded earlier design draft or crop: 2026-08-18 20.01.50.png (replaced by the 14 Oct boards) |
| 502 | Not OK per tire · worst of 4 | transcribed/image-and-pdf-texts.txt:474 | superseded earlier design draft or crop: 2026-08-18 20.01.50.png (replaced by the 14 Oct boards) |
| 503 | A per-tire row carries one verdict per tire ... The last column is derived. | transcribed/image-and-pdf-texts.txt:477 | superseded earlier design draft or crop: 2026-08-18 20.01.50.png (replaced by the 14 Oct boards) |
| 504 | Axle 2 Drum · Dual · 12 of 12 positions | transcribed/image-and-pdf-texts.txt:478 | superseded earlier design draft or crop: 2026-08-18 20.01.50.png (replaced by the 14 Oct boards) |
| 505 | Every row is recorded left and right, with a verdict per position. Outer + inner rows split when the tech sets an axle to Dual; 1 per side r | transcribed/image-and-pdf-texts.txt:524 | superseded earlier design draft or crop: 2026-08-18 20.50.46.png (replaced by the 14 Oct boards) |
| 506 | psi (default) | transcribed/image-and-pdf-texts.txt:526 | superseded earlier design draft or crop: 2026-08-18 20.50.46.png (replaced by the 14 Oct boards) |
| 507 | Shown to the tech as Tire pressure (psi) | transcribed/image-and-pdf-texts.txt:529 | superseded earlier design draft or crop: 2026-08-18 20.50.46.png (replaced by the 14 Oct boards) |
| 508 | Tread Depth (32nds) | transcribed/image-and-pdf-texts.txt:530 | superseded earlier design draft or crop: 2026-08-18 20.50.46.png (replaced by the 14 Oct boards) |
| 509 | Brake Lining (in.) | transcribed/image-and-pdf-texts.txt:531 | superseded earlier design draft or crop: 2026-08-18 20.50.46.png (replaced by the 14 Oct boards) |
| 510 | in. (default) | transcribed/image-and-pdf-texts.txt:532 | superseded earlier design draft or crop: 2026-08-18 20.50.46.png (replaced by the 14 Oct boards) |
| 511 | Push-Rod Travel (in.) | transcribed/image-and-pdf-texts.txt:533 | superseded earlier design draft or crop: 2026-08-18 20.50.46.png (replaced by the 14 Oct boards) |
| 512 | 3 · Not OK — a note and a photo are both required, each badged on its own block | image-and-pdf-texts.txt:667 | superseded earlier design draft or crop: 2026-08-19 11.25.43.png (replaced by the 14 Oct boards) |
| 513 | · Not OK — a note and a photo are both required, each badged on its own block | transcribed/image-and-pdf-texts.txt:667 | superseded earlier design draft or crop: 2026-08-19 11.25.43.png (replaced by the 14 Oct boards) |
| 514 | Slack adjuster travel | transcribed/image-and-pdf-texts.txt:668 | superseded earlier design draft or crop: 2026-08-19 11.25.43.png (replaced by the 14 Oct boards) |
| 515 | PDF Recommended procedure Bendix-slack-adjuster-service-bulletin-2024.pdf Open | transcribed/image-and-pdf-texts.txt:671 | superseded earlier design draft or crop: 2026-08-19 11.25.43.png (replaced by the 14 Oct boards) |
| 516 | photos · 1.4 MB | transcribed/image-and-pdf-texts.txt:675 | superseded earlier design draft or crop: 2026-08-19 11.25.43.png (replaced by the 14 Oct boards) |
| 517 | None yet | transcribed/image-and-pdf-texts.txt:677 | superseded earlier design draft or crop: 2026-08-19 11.26.48.png (replaced by the 14 Oct boards) |
| 518 | 4 · Instruction with acknowledgement — a toggle, not a Not done / Done pair | image-and-pdf-texts.txt:678 | superseded earlier design draft or crop: 2026-08-19 11.27.01.png (replaced by the 14 Oct boards) |
| 519 | I have read this | image-and-pdf-texts.txt:681 | superseded earlier design draft or crop: 2026-08-19 11.27.01.png (replaced by the 14 Oct boards) |
| 520 | · Instruction with acknowledgement — a toggle, not a Not done / Done pair | transcribed/image-and-pdf-texts.txt:678 | superseded earlier design draft or crop: 2026-08-19 11.27.01.png (replaced by the 14 Oct boards) |
| 521 | Chock the wheels before crawling under | transcribed/image-and-pdf-texts.txt:679 | superseded earlier design draft or crop: 2026-08-19 11.27.01.png (replaced by the 14 Oct boards) |
| 522 | Shop rule. Air can bleed off while the unit sits on the lift. | transcribed/image-and-pdf-texts.txt:680 | superseded earlier design draft or crop: 2026-08-19 11.27.01.png (replaced by the 14 Oct boards) |
| 523 | Required before the section can be completed | transcribed/image-and-pdf-texts.txt:682 | superseded earlier design draft or crop: 2026-08-19 11.27.01.png (replaced by the 14 Oct boards) |
| 524 | O. Demo · 14:22 | transcribed/image-and-pdf-texts.txt:684 | superseded earlier design draft or crop: 2026-08-19 11.27.01.png (replaced by the 14 Oct boards) |
| 525 | PDF Bendix-chamber-service.pdf 1.2 MB · not in the customer report | transcribed/image-and-pdf-texts.txt:694 | superseded earlier design draft or crop: 2026-08-19 11.52.41.png (replaced by the 14 Oct boards) |
| 526 | Left outer tire · 42 PSI | transcribed/image-and-pdf-texts.txt:695 | superseded earlier design draft or crop: 2026-08-19 11.55.34.png (replaced by the 14 Oct boards) |
| 527 | 10 of 12 positions inspected | image-and-pdf-texts.txt:703 | superseded earlier design draft or crop: 2026-08-19 11.57.05.png (replaced by the 14 Oct boards) |
| 528 | Axle: Not inspected | transcribed/image-and-pdf-texts.txt:702 | superseded earlier design draft or crop: 2026-08-19 11.57.05.png (replaced by the 14 Oct boards) |
| 529 | Not OK worst of 4 tires | transcribed/image-and-pdf-texts.txt:704 | superseded earlier design draft or crop: 2026-08-19 11.57.05.png (replaced by the 14 Oct boards) |
| 530 | OK both brakes OK | transcribed/image-and-pdf-texts.txt:705 | superseded earlier design draft or crop: 2026-08-19 11.57.05.png (replaced by the 14 Oct boards) |
| 531 | Not inspected 0 of 2 brakes | transcribed/image-and-pdf-texts.txt:706 | superseded earlier design draft or crop: 2026-08-19 11.57.05.png (replaced by the 14 Oct boards) |
| 532 | 2 Slack adjuster travel | image-and-pdf-texts.txt:707 | superseded earlier design draft or crop: 2026-08-19 12.04.56.png (replaced by the 14 Oct boards) |
| 533 | Next: Axle 2 → | transcribed/image-and-pdf-texts.txt:714 | superseded earlier design draft or crop: 2026-08-20 11.48.15.png (replaced by the 14 Oct boards) |
| 534 | Required when Not OK | transcribed/image-and-pdf-texts.txt:716 | superseded earlier design draft or crop: 2026-08-20 11.49.20.png (replaced by the 14 Oct boards) |
| 535 | Drop a photo here | transcribed/image-and-pdf-texts.txt:720 | superseded earlier design draft or crop: 2026-08-20 11.50.41.png (replaced by the 14 Oct boards) |
| 536 | or click to browse · JPG or PNG | transcribed/image-and-pdf-texts.txt:721 | superseded earlier design draft or crop: 2026-08-20 11.50.41.png (replaced by the 14 Oct boards) |
| 537 | Pages | image-and-pdf-texts.txt:725 | superseded earlier design draft or crop: 2026-08-20 11.51.33.png (replaced by the 14 Oct boards) |
| 538 | FIT | image-and-pdf-texts.txt:727 | superseded earlier design draft or crop: 2026-08-20 11.51.33.png (replaced by the 14 Oct boards) |
| 539 | D4 Attachment viewer | transcribed/image-and-pdf-texts.txt:722 | superseded earlier design draft or crop: 2026-08-20 11.51.33.png (replaced by the 14 Oct boards) |
| 540 | reading first · portrait page gets the height, download is never the only way | transcribed/image-and-pdf-texts.txt:723 | superseded earlier design draft or crop: 2026-08-20 11.51.33.png (replaced by the 14 Oct boards) |
| 541 | PDF Bendix-slack-adjuster-service-bulletin-2024.pdf · Slack adjuster travel | transcribed/image-and-pdf-texts.txt:724 | superseded earlier design draft or crop: 2026-08-20 11.51.33.png (replaced by the 14 Oct boards) |
| 542 | Drop a photo or video here | transcribed/image-and-pdf-texts.txt:731 | superseded earlier design draft or crop: 2026-08-20 11.56.46.png (replaced by the 14 Oct boards) |
| 543 | Photo or video, or upload from your computer | transcribed/image-and-pdf-texts.txt:732 | superseded earlier design draft or crop: 2026-08-20 11.56.46.png (replaced by the 14 Oct boards) |
| 544 | 2 · Template attached a procedure — it sits above the response, not beside it | image-and-pdf-texts.txt:733 | superseded earlier design draft or crop: 2026-08-20 11.57.23.png (replaced by the 14 Oct boards) |
| 545 | · Template attached a procedure — it sits above the response, not beside it | transcribed/image-and-pdf-texts.txt:733 | superseded earlier design draft or crop: 2026-08-20 11.57.23.png (replaced by the 14 Oct boards) |
| 546 | TIRE STATES | transcribed/image-and-pdf-texts.txt:741 | superseded earlier design draft or crop: 2026-08-20 13.18.31.png (replaced by the 14 Oct boards) |
| 547 | Partly entered | transcribed/image-and-pdf-texts.txt:743 | superseded earlier design draft or crop: 2026-08-20 13.18.31.png (replaced by the 14 Oct boards) |
| 548 | Worst wins. Empty stays empty — never N/A. | transcribed/image-and-pdf-texts.txt:747 | superseded earlier design draft or crop: 2026-08-20 13.18.31.png (replaced by the 14 Oct boards) |
| 549 | · FOR CLODISU | transcribed/image-and-pdf-texts.txt:748 | superseded earlier design draft or crop: 2026-08-20 13.20.25.png (replaced by the 14 Oct boards) |
| 550 | SECTION 1 OF 2 · FIELD 2 OF 3 | transcribed/image-and-pdf-texts.txt:750 | superseded earlier design draft or crop: 2026-08-20 13.20.25.png (replaced by the 14 Oct boards) |
| 551 | Tire pressure psi NOT INSPECTED | transcribed/image-and-pdf-texts.txt:754 | superseded earlier design draft or crop: 2026-08-20 13.20.25.png (replaced by the 14 Oct boards) |
| 552 | Back: fields | transcribed/image-and-pdf-texts.txt:756 | superseded earlier design draft or crop: 2026-08-20 13.20.25.png (replaced by the 14 Oct boards) |
| 553 | Next: Axle 2 | transcribed/image-and-pdf-texts.txt:757 | superseded earlier design draft or crop: 2026-08-20 13.20.25.png (replaced by the 14 Oct boards) |
| 554 | w everything before it is added. | transcribed/image-and-pdf-texts.txt:785 | superseded earlier design draft or crop: 2026-08-20 16.48.16.png (replaced by the 14 Oct boards) |
| 555 | Brake lining in. 0.33 0.35 | transcribed/image-and-pdf-texts.txt:811 | superseded earlier design draft or crop: 2026-08-20 17.25.05.png (replaced by the 14 Oct boards) |
| 556 | On a Single axle every row has two positions, so tire and brake rows read the same — which is fine: what the technician judges is one value  | transcribed/image-and-pdf-texts.txt:812 | superseded earlier design draft or crop: 2026-08-20 17.25.05.png (replaced by the 14 Oct boards) |
| 557 | A6 Live — click a marker to pick a verdict | transcribed/image-and-pdf-texts.txt:813 | superseded earlier design draft or crop: 2026-08-20 17.25.05.png (replaced by the 14 Oct boards) |
| 558 | Single / Dual switches with no dialog · switch back and the values return | transcribed/image-and-pdf-texts.txt:814 | superseded earlier design draft or crop: 2026-08-20 17.25.05.png (replaced by the 14 Oct boards) |
| 559 | Dual axle — nothing inspected yet | transcribed/image-and-pdf-texts.txt:815 | superseded earlier design draft or crop: 2026-09-03 18.52.42.png (replaced by the 14 Oct boards) |
| 560 | every position starts Not inspected · hollow marker, no colour | transcribed/image-and-pdf-texts.txt:816 | superseded earlier design draft or crop: 2026-09-03 18.52.42.png (replaced by the 14 Oct boards) |
| 561 | Mark inspection OK | transcribed/image-and-pdf-texts.txt:819 | superseded earlier design draft or crop: 2026-09-03 18.52.42.png (replaced by the 14 Oct boards) |
| 562 | Section 1 2 fields · nothing inspected yet | transcribed/image-and-pdf-texts.txt:821 | superseded earlier design draft or crop: 2026-09-03 18.52.42.png (replaced by the 14 Oct boards) |
| 563 | Mark axle set OK | transcribed/image-and-pdf-texts.txt:825 | superseded earlier design draft or crop: 2026-09-03 18.52.42.png (replaced by the 14 Oct boards) |
| 564 | See how the technician fills this in | image-and-pdf-texts.txt:870 | superseded earlier design draft or crop: 2026-09-09 10.23.11.png (replaced by the 14 Oct boards) |
| 565 | Preview of the axle field | transcribed/image-and-pdf-texts.txt:869 | superseded earlier design draft or crop: 2026-09-09 10.23.11.png (replaced by the 14 Oct boards) |
| 566 | Starting point for a new inspection | transcribed/image-and-pdf-texts.txt:876 | superseded earlier design draft or crop: 2026-09-09 10.36.42.png (replaced by the 14 Oct boards) |
| 567 | Bendix-chamber-service.p... | image-and-pdf-texts.txt:887 | superseded earlier design draft or crop: 2026-09-16 10.48.59.png (replaced by the 14 Oct boards) |
| 568 | The hint line is too short to carry this, so the card takes an (i). Same tooltip treatment as Mark OK: 300 ms delay, grey-900, white 12/16,  | image-and-pdf-texts.txt:899 | superseded earlier design draft or crop: 2026-09-16 10.48.59.png (replaced by the 14 Oct boards) |
| 569 | TB0 Panel blocks, on their own | transcribed/image-and-pdf-texts.txt:879 | superseded earlier design draft or crop: 2026-09-16 10.48.59.png (replaced by the 14 Oct boards) |
| 570 | the same components the full screens are assembled from | transcribed/image-and-pdf-texts.txt:880 | superseded earlier design draft or crop: 2026-09-16 10.48.59.png (replaced by the 14 Oct boards) |
| 571 | Switching type keeps the label and drops settings that no longer apply. | transcribed/image-and-pdf-texts.txt:881 | superseded earlier design draft or crop: 2026-09-16 10.48.59.png (replaced by the 14 Oct boards) |
| 572 | REFERENCE FILE — EMPTY, THEN ATTACHED | transcribed/image-and-pdf-texts.txt:883 | superseded earlier design draft or crop: 2026-09-16 10.48.59.png (replaced by the 14 Oct boards) |
| 573 | MB · not in the customer report | transcribed/image-and-pdf-texts.txt:888 | superseded earlier design draft or crop: 2026-09-16 10.48.59.png (replaced by the 14 Oct boards) |
| 574 | VALIDATION — DEFAULTS FOR A NEW CHECKBOX | transcribed/image-and-pdf-texts.txt:889 | superseded earlier design draft or crop: 2026-09-16 10.48.59.png (replaced by the 14 Oct boards) |
| 575 | MEASUREMENT ROW — PER AXLE | transcribed/image-and-pdf-texts.txt:891 | superseded earlier design draft or crop: 2026-09-16 10.48.59.png (replaced by the 14 Oct boards) |
| 576 | PER AXLE — TYPE CARD TOOLTIP | transcribed/image-and-pdf-texts.txt:895 | superseded earlier design draft or crop: 2026-09-16 10.48.59.png (replaced by the 14 Oct boards) |
| 577 | One field covers the whole unit. You define the measurement rows here, and the technician adds each axle while filling the inspection in — e | transcribed/image-and-pdf-texts.txt:898 | superseded earlier design draft or crop: 2026-09-16 10.48.59.png (replaced by the 14 Oct boards) |
| 578 | is out of the product — the type is Per axle and a new field is labelled New axle measurements. | transcribed/image-and-pdf-texts.txt:900 | superseded earlier design draft or crop: 2026-09-16 10.48.59.png (replaced by the 14 Oct boards) |
| 579 | FIELD ROW IN THE CANVAS | transcribed/image-and-pdf-texts.txt:901 | superseded earlier design draft or crop: 2026-09-16 10.48.59.png (replaced by the 14 Oct boards) |
| 580 | Brake & tire measurements Per axle · Tire pressure (psi), Tread depth (32nds) | transcribed/image-and-pdf-texts.txt:902 | superseded earlier design draft or crop: 2026-09-16 10.48.59.png (replaced by the 14 Oct boards) |
| 581 | Brake chamber condition Checkbox · reference file · note required if Monitor / Not OK | transcribed/image-and-pdf-texts.txt:903 | superseded earlier design draft or crop: 2026-09-16 10.48.59.png (replaced by the 14 Oct boards) |
| 582 | Unit reading Text · required to complete | transcribed/image-and-pdf-texts.txt:904 | superseded earlier design draft or crop: 2026-09-16 10.48.59.png (replaced by the 14 Oct boards) |
| 583 | Pick one and edit it — a starter is an ordinary template afterwards. Five carry content; the equipment starter turns on when its definition  | transcribed/image-and-pdf-texts.txt:906 | superseded earlier design draft or crop: 2026-09-16 10.50.36.png (replaced by the 14 Oct boards) |
| 584 | Most units of this kind have this many axles, so the technician starts with that many. They can add or remove axles while filling the inspec | image-and-pdf-texts.txt:918 | superseded earlier design draft or crop: 2026-09-16 10.53.13.png (replaced by the 14 Oct boards) |
| 585 | TB6 Per axle — the two things the panel has to explain | transcribed/image-and-pdf-texts.txt:911 | superseded earlier design draft or crop: 2026-09-16 10.53.13.png (replaced by the 14 Oct boards) |
| 586 | what the field covers, and where the axle count comes from · no preview dialog | transcribed/image-and-pdf-texts.txt:912 | superseded earlier design draft or crop: 2026-09-16 10.53.13.png (replaced by the 14 Oct boards) |
| 587 | TYPE CARD IN THE PALETTE | transcribed/image-and-pdf-texts.txt:913 | superseded earlier design draft or crop: 2026-09-16 10.53.13.png (replaced by the 14 Oct boards) |
| 588 | Answers the question the type name cannot: one field, not one per axle. | transcribed/image-and-pdf-texts.txt:914 | superseded earlier design draft or crop: 2026-09-16 10.53.13.png (replaced by the 14 Oct boards) |
| 589 | AXLES, IN THE FIELD PROPERTIES | transcribed/image-and-pdf-texts.txt:915 | superseded earlier design draft or crop: 2026-09-16 10.53.13.png (replaced by the 14 Oct boards) |
| 590 | Axles (i) | transcribed/image-and-pdf-texts.txt:916 | superseded earlier design draft or crop: 2026-09-16 10.53.13.png (replaced by the 14 Oct boards) |
| 591 | Sits directly above + Add Measurement Row, so the panel reads top to bottom ... A default, not a limit — the technician adds and removes axl | transcribed/image-and-pdf-texts.txt:919 | superseded earlier design draft or crop: 2026-09-16 10.53.13.png (replaced by the 14 Oct boards) |
| 592 | WHY NOT A PREVIEW | transcribed/image-and-pdf-texts.txt:920 | superseded earlier design draft or crop: 2026-09-16 10.53.13.png (replaced by the 14 Oct boards) |
| 593 | 1 Brakes 4 fields | image-and-pdf-texts.txt:927 | superseded earlier design draft or crop: 2026-09-16 10.53.37.png (replaced by the 14 Oct boards) |
| 594 | Bendix-slack-adjuster-2024.pdf | image-and-pdf-texts.txt:940 | superseded earlier design draft or crop: 2026-09-16 10.53.37.png (replaced by the 14 Oct boards) |
| 595 | BM1 Field list | transcribed/image-and-pdf-texts.txt:922 | superseded earlier design draft or crop: 2026-09-16 10.53.37.png (replaced by the 14 Oct boards) |
| 596 | One row per field. The subtitle carries the type, the reference file and the rules the technician will be held to. | transcribed/image-and-pdf-texts.txt:923 | superseded earlier design draft or crop: 2026-09-16 10.53.37.png (replaced by the 14 Oct boards) |
| 597 | ADMIN · TEMPLATES | transcribed/image-and-pdf-texts.txt:924 | superseded earlier design draft or crop: 2026-09-16 10.53.37.png (replaced by the 14 Oct boards) |
| 598 | Brake & Axle PM | transcribed/image-and-pdf-texts.txt:925 | superseded earlier design draft or crop: 2026-09-16 10.53.37.png (replaced by the 14 Oct boards) |
| 599 | Brakes 4 fields | transcribed/image-and-pdf-texts.txt:927 | superseded earlier design draft or crop: 2026-09-16 10.53.37.png (replaced by the 14 Oct boards) |
| 600 | Brake & tire measurements Per axle · 4 rows | transcribed/image-and-pdf-texts.txt:928 | superseded earlier design draft or crop: 2026-09-16 10.53.37.png (replaced by the 14 Oct boards) |
| 601 | Brake chamber condition Checkbox · reference file · note if Monitor / Not OK | transcribed/image-and-pdf-texts.txt:929 | superseded earlier design draft or crop: 2026-09-16 10.53.37.png (replaced by the 14 Oct boards) |
| 602 | BM2 Per axle properties — sheet | transcribed/image-and-pdf-texts.txt:934 | superseded earlier design draft or crop: 2026-09-16 10.53.37.png (replaced by the 14 Oct boards) |
| 603 | Type grid two-up, measurement rows summarised with a chevron into their own editor. | transcribed/image-and-pdf-texts.txt:935 | superseded earlier design draft or crop: 2026-09-16 10.53.37.png (replaced by the 14 Oct boards) |
| 604 | Brake & tire measurements | transcribed/image-and-pdf-texts.txt:936 | superseded earlier design draft or crop: 2026-09-16 10.53.37.png (replaced by the 14 Oct boards) |
| 605 | BM3 Measurement rows editor | transcribed/image-and-pdf-texts.txt:943 | superseded earlier design draft or crop: 2026-09-16 10.53.37.png (replaced by the 14 Oct boards) |
| 606 | Name on its own line so it can be renamed in place; unit and scope below it — 1 per side / Outer + inner, the same wording as every desktop  | transcribed/image-and-pdf-texts.txt:944 | superseded earlier design draft or crop: 2026-09-16 10.53.37.png (replaced by the 14 Oct boards) |
| 607 | BRAKE & TIRE SET | transcribed/image-and-pdf-texts.txt:945 | superseded earlier design draft or crop: 2026-09-16 10.53.37.png (replaced by the 14 Oct boards) |
| 608 | Every row is recorded left and right. Per tire rows split into outer and inner when the tech sets an axle to Dual; per brake rows stay one v | transcribed/image-and-pdf-texts.txt:947 | superseded earlier design draft or crop: 2026-09-16 10.53.37.png (replaced by the 14 Oct boards) |
| 609 | 2 fields marked OK | image-and-pdf-texts.txt:959 | superseded earlier design draft or crop: 2026-09-16 11.50.32.png (replaced by the 14 Oct boards) |
| 610 | Marks every field in this inspection OK — 2 sections, 5 fields. Only what is still Not inspected changes; verdicts already picked stay. Valu | image-and-pdf-texts.txt:962 | superseded earlier design draft or crop: 2026-09-16 11.50.32.png (replaced by the 14 Oct boards) |
| 611 | Marks every position in this field OK — 4 rows on 3 axles, 36 positions. Only what is still Not inspected changes. Values are never filled i | image-and-pdf-texts.txt:964 | superseded earlier design draft or crop: 2026-09-16 11.50.32.png (replaced by the 14 Oct boards) |
| 612 | Selects OK for this field — the same as pressing OK below. | image-and-pdf-texts.txt:965 | superseded earlier design draft or crop: 2026-09-16 11.50.32.png (replaced by the 14 Oct boards) |
| 613 | MARK OK · ONE PATTERN, THREE LEVELS | transcribed/image-and-pdf-texts.txt:952 | superseded earlier design draft or crop: 2026-09-16 11.50.32.png (replaced by the 14 Oct boards) |
| 614 | Brake & Axle PM Inspection · 2 sections · 5 fields | transcribed/image-and-pdf-texts.txt:953 | superseded earlier design draft or crop: 2026-09-16 11.50.32.png (replaced by the 14 Oct boards) |
| 615 | SECTION 1 OF 2 Section 1 2 fields · 0 of 24 positions | transcribed/image-and-pdf-texts.txt:955 | superseded earlier design draft or crop: 2026-09-16 11.50.32.png (replaced by the 14 Oct boards) |
| 616 | Brake & tire measurements Per axle · 4 measurement rows | transcribed/image-and-pdf-texts.txt:957 | superseded earlier design draft or crop: 2026-09-16 11.50.32.png (replaced by the 14 Oct boards) |
| 617 | fields marked OK | transcribed/image-and-pdf-texts.txt:959 | superseded earlier design draft or crop: 2026-09-16 11.50.32.png (replaced by the 14 Oct boards) |
| 618 | ON HOVER · EACH LEVEL SAYS EXACTLY WHAT IT WILL DO | transcribed/image-and-pdf-texts.txt:961 | superseded earlier design draft or crop: 2026-09-16 11.50.32.png (replaced by the 14 Oct boards) |
| 619 | Marks every field in Section 1 OK — 3 fields, 38 positions. Only what is still Not inspected changes; verdicts already picked stay. Values a | transcribed/image-and-pdf-texts.txt:963 | superseded earlier design draft or crop: 2026-09-16 11.50.32.png (replaced by the 14 Oct boards) |
| 620 | Tooltip after a 300 ms hover ... A checkbox says the shorter thing, because that is all it does. | transcribed/image-and-pdf-texts.txt:966 | superseded earlier design draft or crop: 2026-09-16 11.50.32.png (replaced by the 14 Oct boards) |
| 621 | Same wording, same treatment, same right edge — one level per row ... every level beneath it swaps its action for the same check and its own | transcribed/image-and-pdf-texts.txt:967 | superseded earlier design draft or crop: 2026-09-16 11.50.32.png (replaced by the 14 Oct boards) |
| 622 | Pu[blish] | image-and-pdf-texts.txt:972 | superseded earlier design draft or crop: 2026-09-16 11.52.03.png (replaced by the 14 Oct boards) |
| 623 | Edit this field | image-and-pdf-texts.txt:978 | superseded earlier design draft or crop: 2026-09-16 11.52.03.png (replaced by the 14 Oct boards) |
| 624 | Brake & Axle PM Inspection · 2 sections · 3 fields · nothing inspected yet | transcribed/image-and-pdf-texts.txt:973 | superseded earlier design draft or crop: 2026-09-16 11.52.03.png (replaced by the 14 Oct boards) |
| 625 | SECTION 1 OF 2 Section 1 2 fields · 0 of 36 positions | transcribed/image-and-pdf-texts.txt:975 | superseded earlier design draft or crop: 2026-09-16 11.52.03.png (replaced by the 14 Oct boards) |
| 626 | Brake & tire measurements Per axle | transcribed/image-and-pdf-texts.txt:977 | superseded earlier design draft or crop: 2026-09-16 11.52.03.png (replaced by the 14 Oct boards) |
| 627 | Axle 2 Drum · Dual | transcribed/image-and-pdf-texts.txt:980 | superseded earlier design draft or crop: 2026-09-16 11.52.03.png (replaced by the 14 Oct boards) |
| 628 | Axle 3 Drum · Dual | transcribed/image-and-pdf-texts.txt:981 | superseded earlier design draft or crop: 2026-09-16 11.52.03.png (replaced by the 14 Oct boards) |
| 629 | Air-brake system leak check Checkbox | transcribed/image-and-pdf-texts.txt:985 | superseded earlier design draft or crop: 2026-09-16 11.52.03.png (replaced by the 14 Oct boards) |
| 630 | + Add Part | image-and-pdf-texts.txt:987 | superseded earlier design draft or crop: 2026-09-18 13.44.46.png (replaced by the 14 Oct boards) |
| 631 | Add Part | transcribed/image-and-pdf-texts.txt:987 | superseded earlier design draft or crop: 2026-09-18 13.44.46.png (replaced by the 14 Oct boards) |
| 632 | + Add Follow-up | image-and-pdf-texts.txt:1000 | superseded earlier design draft or crop: 2026-09-18 14.15.30.png (replaced by the 14 Oct boards) |
| 633 | Re-check at the next PM and record the... | transcribed/image-and-pdf-texts.txt:1002 | superseded earlier design draft or crop: 2026-09-18 14.15.30.png (replaced by the 14 Oct boards) |
| 634 | Bendix-chamber-service.pdf 1.2 MB | transcribed/image-and-pdf-texts.txt:1008 | superseded earlier design draft or crop: 2026-09-18 14.15.30.png (replaced by the 14 Oct boards) |
| 635 | row gains one pill: a count and a dot per response that carries a follow-up, in that response's colour... | transcribed/image-and-pdf-texts.txt:1011 | superseded earlier design draft or crop: 2026-09-18 14.15.30.png (replaced by the 14 Oct boards) |
| 636 | Draft · unsaved | transcribed/image-and-pdf-texts.txt:992 | superseded earlier design draft or crop: 2026-09-18 14.15.30.png (replaced by the 14 Oct boards) |
| 637 | Section 1 3 fields | transcribed/image-and-pdf-texts.txt:994 | superseded earlier design draft or crop: 2026-09-18 14.15.30.png (replaced by the 14 Oct boards) |
| 638 | Brake & tire measurements Per axle · Tire pressure (psi), Tread depth (32nds), Brake lining (in.) | transcribed/image-and-pdf-texts.txt:995 | superseded earlier design draft or crop: 2026-09-18 14.15.30.png (replaced by the 14 Oct boards) |
| 639 | Brake chamber condition Checkbox · OK / Monitor / Not OK / N/A · reference file · note required if Monitor / Not OK | transcribed/image-and-pdf-texts.txt:996 | superseded earlier design draft or crop: 2026-09-18 14.15.30.png (replaced by the 14 Oct boards) |
| 640 | Air-brake system leak check Checkbox · OK / Monitor / Not OK / N/A | transcribed/image-and-pdf-texts.txt:998 | superseded earlier design draft or crop: 2026-09-18 14.15.30.png (replaced by the 14 Oct boards) |
| 641 | 3 · Acknowledged: the button has become the record of who and when | image-and-pdf-texts.txt:1012 | superseded earlier design draft or crop: 2026-09-18 14.21.16.png (replaced by the 14 Oct boards) |
| 642 | · Acknowledged: the button has become the record of who and when | transcribed/image-and-pdf-texts.txt:1012 | superseded earlier design draft or crop: 2026-09-18 14.21.16.png (replaced by the 14 Oct boards) |
| 643 | Brake chamber condition | transcribed/image-and-pdf-texts.txt:1013 | superseded earlier design draft or crop: 2026-09-18 14.21.16.png (replaced by the 14 Oct boards) |
| 644 | Bendix-chamber-out-of-service-procedure.pdf 1.2 MB | transcribed/image-and-pdf-texts.txt:1017 | superseded earlier design draft or crop: 2026-09-18 14.21.16.png (replaced by the 14 Oct boards) |
| 645 | Acknowledged by Marcus Hall · Today, 2:41 PM | transcribed/image-and-pdf-texts.txt:1019 | superseded earlier design draft or crop: 2026-09-18 14.21.16.png (replaced by the 14 Oct boards) |
| 646 | Before it is given, the acknowledgement is a plain white button; once it is given, the record is solid blue ... It is a record and not a con | transcribed/image-and-pdf-texts.txt:1022 | superseded earlier design draft or crop: 2026-09-18 14.21.16.png (replaced by the 14 Oct boards) |
| 647 | 2 Air system 2 fields | image-and-pdf-texts.txt:116 | superseded earlier design draft or crop: scraps/p1-bottom.jpg (replaced by the 14 Oct boards) |
| 648 | RIGHT INNER 12/32nds OK | transcribed/image-and-pdf-texts.txt:112 | superseded earlier design draft or crop: scraps/p1-bottom.jpg (replaced by the 14 Oct boards) |
| 649 | RIGHT OUTER 10/32nds OK | transcribed/image-and-pdf-texts.txt:113 | superseded earlier design draft or crop: scraps/p1-bottom.jpg (replaced by the 14 Oct boards) |
| 650 | Brake lining LEFT 9/32 in. OK RIGHT 10/32 in. OK | transcribed/image-and-pdf-texts.txt:114 | superseded earlier design draft or crop: scraps/p1-bottom.jpg (replaced by the 14 Oct boards) |
| 651 | Brake chamber condition Checkbox OK | transcribed/image-and-pdf-texts.txt:115 | superseded earlier design draft or crop: scraps/p1-bottom.jpg (replaced by the 14 Oct boards) |
| 652 | Air system 2 fields | transcribed/image-and-pdf-texts.txt:116 | superseded earlier design draft or crop: scraps/p1-bottom.jpg (replaced by the 14 Oct boards) |
| 653 | Slack adjuster travel Measurement 1.94 in. Monitor | transcribed/image-and-pdf-texts.txt:117 | superseded earlier design draft or crop: scraps/p1-bottom.jpg (replaced by the 14 Oct boards) |
| 654 | Low-air warning pressure Measurement 62 psi OK | transcribed/image-and-pdf-texts.txt:118 | superseded earlier design draft or crop: scraps/p1-bottom.jpg (replaced by the 14 Oct boards) |
| 655 | 1 Brakes 2 fields | image-and-pdf-texts.txt:123 | superseded earlier design draft or crop: scraps/p1-check.jpg (replaced by the 14 Oct boards) |
| 656 | AI Build lines | transcribed/image-and-pdf-texts.txt:119 | superseded earlier design draft or crop: scraps/p1-check.jpg (replaced by the 14 Oct boards) |
| 657 | WHAT WAS ENTERED read only | transcribed/image-and-pdf-texts.txt:122 | superseded earlier design draft or crop: scraps/p1-check.jpg (replaced by the 14 Oct boards) |
| 658 | Brakes 2 fields | transcribed/image-and-pdf-texts.txt:123 | superseded earlier design draft or crop: scraps/p1-check.jpg (replaced by the 14 Oct boards) |
| 659 | Brake & tire measurements Per axle Not OK | transcribed/image-and-pdf-texts.txt:124 | superseded earlier design draft or crop: scraps/p1-check.jpg (replaced by the 14 Oct boards) |
| 660 | Axle 1 Drum · Dual Not OK | transcribed/image-and-pdf-texts.txt:125 | superseded earlier design draft or crop: scraps/p1-check.jpg (replaced by the 14 Oct boards) |
| 661 | Tire pressure LEFT OUTER 42 psi Not OK LEFT INNER 103 psi OK | transcribed/image-and-pdf-texts.txt:126 | superseded earlier design draft or crop: scraps/p1-check.jpg (replaced by the 14 Oct boards) |
| 662 | Tire pressure PSI | transcribed/image-and-pdf-texts.txt:89 | superseded earlier design draft or crop: uploads/draw-8cf7a7b6-....png (replaced by the 14 Oct boards) |
| 663 | on the section/field header. Text = A1 board (Fill screen: desktop intro, | transcribed/image-and-pdf-texts.txt:91 | superseded earlier design draft or crop: uploads/draw-8cf7a7b6-....png (replaced by the 14 Oct boards) |
| 664 | , TOP VIEW, | transcribed/image-and-pdf-texts.txt:98 | superseded earlier design draft or crop: uploads/draw-8cf7a7b6-....png (replaced by the 14 Oct boards) |
| 665 | , Axle 1 Drum/Disc Single/Dual, MEASUREMENT LEFT OUTER INNER RIGHT INNER OUTER, rows, | transcribed/image-and-pdf-texts.txt:99 | superseded earlier design draft or crop: uploads/draw-8cf7a7b6-....png (replaced by the 14 Oct boards) |
| 666 | 4 2 notes, 2 photos required | image-and-pdf-texts.txt:102 | superseded earlier design draft or crop: uploads/draw-c1e9a761-....png (replaced by the 14 Oct boards) |
| 667 | A – F · P1 – P4 | image-and-pdf-texts.txt:106 | superseded earlier design draft or crop: uploads/draw-c1e9a761-....png (replaced by the 14 Oct boards) |
| 668 | notes, 2 photos required | transcribed/image-and-pdf-texts.txt:102 | superseded earlier design draft or crop: uploads/draw-c1e9a761-....png (replaced by the 14 Oct boards) |
| 669 | Back: Section 1 | transcribed/image-and-pdf-texts.txt:103 | superseded earlier design draft or crop: uploads/draw-c1e9a761-....png (replaced by the 14 Oct boards) |
| 670 | Next: Section 2 | transcribed/image-and-pdf-texts.txt:104 | superseded earlier design draft or crop: uploads/draw-c1e9a761-....png (replaced by the 14 Oct boards) |
| 671 | on the Not OK button of M8); section 4 divider | transcribed/image-and-pdf-texts.txt:105 | superseded earlier design draft or crop: uploads/draw-c1e9a761-....png (replaced by the 14 Oct boards) |
| 672 | the panel steps aside so the canvas has the width · no answers are saved, though the axle count writes back to the draft · click a field to  | transcribed/image-and-pdf-texts.txt:107 | superseded earlier design draft or crop: uploads/draw-eca7094a-....png (replaced by the 14 Oct boards) |
| 673 | Read-only, with one exception: adding or deleting an axle writes the count back to the draft, so returning to Edit shows the new number on t | transcribed/image-and-pdf-texts.txt:110 | superseded earlier design draft or crop: uploads/draw-eca7094a-....png (replaced by the 14 Oct boards) |

## OUT-OF-SCOPE — 1184 rows

| # | Text | First seen (file:line) | Reason |
|---|---|---|---|
| 0 | Slide 2 Axles and tire positions | Digital Inspections - Marketing Slides-print.dc.html:106 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 1 | AXLES AND TIRE POSITIONS | Digital Inspections - Marketing Slides-print.dc.html:110 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 2 | Inspect every axle and every tire position | Digital Inspections - Marketing Slides-print.dc.html:111 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 3 | Record a result for each tire, single or dual. | Digital Inspections - Marketing Slides-print.dc.html:114 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 4 | Axle and asset results add up on their own. | Digital Inspections - Marketing Slides-print.dc.html:115 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 5 | Mark a whole axle, field or section OK. | Digital Inspections - Marketing Slides-print.dc.html:116 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 6 | WO 10482 · Ridgeway Freight Lines · Unit 214 | Digital Inspections - Marketing Slides-print.dc.html:122 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 7 | 1 tire Not OK | Digital Inspections - Marketing Slides-print.dc.html:127 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 8 | TOP VIEW | Digital Inspections - Marketing Slides-print.dc.html:132 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 9 | 32nds | Digital Inspections - Marketing Slides-print.dc.html:155 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 10 | Dual · 12 of 12 | Digital Inspections - Marketing Slides-print.dc.html:170 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 11 | Axle 3 | Digital Inspections - Marketing Slides-print.dc.html:171 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 12 | Slide 3 Instructions on answers | Digital Inspections - Marketing Slides-print.dc.html:181 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 13 | Tell technicians what to do next | Digital Inspections - Marketing Slides-print.dc.html:186 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 14 | Add instructions to checkbox answers. | Digital Inspections - Marketing Slides-print.dc.html:189 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 15 | Technicians see them as they answer. | Digital Inspections - Marketing Slides-print.dc.html:190 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 16 | Ask them to acknowledge before they submit. | Digital Inspections - Marketing Slides-print.dc.html:191 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 17 | Re-check at the next PM and record the reading. Book the unit for a leak-down test if the loss is above 3 psi a minute. | Digital Inspections - Marketing Slides-print.dc.html:211 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 18 | 820 KB | Digital Inspections - Marketing Slides-print.dc.html:213 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 19 | Leak-test-steps.pdf | Digital Inspections - Marketing Slides-print.dc.html:213 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 20 | Slide 4 Asset inspection history | Digital Inspections - Marketing Slides-print.dc.html:230 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 21 | Every inspection for an asset in one place | Digital Inspections - Marketing Slides-print.dc.html:235 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 22 | Open the asset and go to its Inspections tab. | Digital Inspections - Marketing Slides-print.dc.html:238 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 23 | See what was found on each one, and when. | Digital Inspections - Marketing Slides-print.dc.html:239 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 24 | Open any past inspection or its PDF report. | Digital Inspections - Marketing Slides-print.dc.html:240 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 25 | Unit 214 · 2021 Freightliner Cascadia | Digital Inspections - Marketing Slides-print.dc.html:247 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 26 | Ridgeway Freight Lines · VIN 3AKJHHDR5MSMF4412 | Digital Inspections - Marketing Slides-print.dc.html:247 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 27 | Inspections (5) | Digital Inspections - Marketing Slides-print.dc.html:253 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 28 | Slide 0 Cover | Digital Inspections - Marketing Slides-print.dc.html:26 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 29 | WO 10482 | Digital Inspections - Marketing Slides-print.dc.html:267 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 30 | Sep 24, 2026 | Digital Inspections - Marketing Slides-print.dc.html:268 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 31 | Marcus Bell | Digital Inspections - Marketing Slides-print.dc.html:269 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 32 | ShopView | Digital Inspections - Marketing Slides-print.dc.html:27 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 33 | DOT Annual Inspection | Digital Inspections - Marketing Slides-print.dc.html:274 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 34 | WO 10317 | Digital Inspections - Marketing Slides-print.dc.html:274 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 35 | Aug 12, 2026 | Digital Inspections - Marketing Slides-print.dc.html:275 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 36 | Dana Ruiz | Digital Inspections - Marketing Slides-print.dc.html:276 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 37 | 2 Monitor | Digital Inspections - Marketing Slides-print.dc.html:277 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 38 | WO 10106 | Digital Inspections - Marketing Slides-print.dc.html:281 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 39 | Jun 30, 2026 | Digital Inspections - Marketing Slides-print.dc.html:282 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 40 | 2 Not OK | Digital Inspections - Marketing Slides-print.dc.html:284 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 41 | PM Service A | Digital Inspections - Marketing Slides-print.dc.html:288 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 42 | WO 9874 | Digital Inspections - Marketing Slides-print.dc.html:288 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 43 | May 18, 2026 | Digital Inspections - Marketing Slides-print.dc.html:289 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 44 | Luis Ortega | Digital Inspections - Marketing Slides-print.dc.html:290 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 45 | WO 9412 | Digital Inspections - Marketing Slides-print.dc.html:295 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 46 | Mar 3, 2026 | Digital Inspections - Marketing Slides-print.dc.html:296 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 47 | Improvements coming to Digital Inspections | Digital Inspections - Marketing Slides-print.dc.html:30 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 48 | Slide 5 Work orders with ShopCoach | Digital Inspections - Marketing Slides-print.dc.html:310 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 49 | Build the work order from the inspection | Digital Inspections - Marketing Slides-print.dc.html:315 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 50 | ShopCoach turns findings into lines. | Digital Inspections - Marketing Slides-print.dc.html:318 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 51 | Labor and parts are filled in for you. | Digital Inspections - Marketing Slides-print.dc.html:319 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 52 | Review and edit every line before you add it. | Digital Inspections - Marketing Slides-print.dc.html:320 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 53 | START IT FROM | Digital Inspections - Marketing Slides-print.dc.html:323 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 54 | WO 10482 · Open · Ridgeway Freight Lines | Digital Inspections - Marketing Slides-print.dc.html:330 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 55 | Work Order 10482 | Digital Inspections - Marketing Slides-print.dc.html:330 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 56 | Lines (0) | Digital Inspections - Marketing Slides-print.dc.html:334 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 57 | Parts (0) | Digital Inspections - Marketing Slides-print.dc.html:335 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 58 | Notes (1) | Digital Inspections - Marketing Slides-print.dc.html:336 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 59 | Preview before you publish | Digital Inspections - Marketing Slides-print.dc.html:34 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 60 | 3 lines drafted from Brake & Axle PM | Digital Inspections - Marketing Slides-print.dc.html:343 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 61 | Review before adding | Digital Inspections - Marketing Slides-print.dc.html:347 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 62 | Click any title, labor or part to edit it. Uncheck a line to leave it out. | Digital Inspections - Marketing Slides-print.dc.html:347 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 63 | 3 of 3 selected | Digital Inspections - Marketing Slides-print.dc.html:348 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 64 | See a template the way your technician will. | Digital Inspections - Marketing Slides-print.dc.html:35 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 65 | Replace left steer tire | Digital Inspections - Marketing Slides-print.dc.html:355 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 66 | Axle 1 · Tread depth · left | Digital Inspections - Marketing Slides-print.dc.html:355 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 67 | 1.2 hrs | Digital Inspections - Marketing Slides-print.dc.html:356 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 68 | Steer tire (1) | Digital Inspections - Marketing Slides-print.dc.html:357 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 69 | Valve stem (1) | Digital Inspections - Marketing Slides-print.dc.html:357 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 70 | + Add | Digital Inspections - Marketing Slides-print.dc.html:357 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 71 | Find and fix left steer tire leak | Digital Inspections - Marketing Slides-print.dc.html:361 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 72 | Axle 1 · Tire pressure · left | Digital Inspections - Marketing Slides-print.dc.html:361 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 73 | 0.5 hrs | Digital Inspections - Marketing Slides-print.dc.html:362 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 74 | Leak-down test, air brake system | Digital Inspections - Marketing Slides-print.dc.html:367 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 75 | Air-brake system leak check · Monitor | Digital Inspections - Marketing Slides-print.dc.html:367 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 76 | 1 hr | Digital Inspections - Marketing Slides-print.dc.html:368 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 77 | Chamber gasket (1) | Digital Inspections - Marketing Slides-print.dc.html:369 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 78 | 2.7 hrs labor · 3 parts | Digital Inspections - Marketing Slides-print.dc.html:375 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 79 | Every axle, every tire | Digital Inspections - Marketing Slides-print.dc.html:38 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 80 | Record a result for each tire position. | Digital Inspections - Marketing Slides-print.dc.html:39 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 81 | Instructions on answers | Digital Inspections - Marketing Slides-print.dc.html:42 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 82 | Tell technicians what to do next. | Digital Inspections - Marketing Slides-print.dc.html:43 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 83 | History for every asset | Digital Inspections - Marketing Slides-print.dc.html:46 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 84 | Every inspection for an asset in one place. | Digital Inspections - Marketing Slides-print.dc.html:47 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 85 | Work orders with ShopCoach | Digital Inspections - Marketing Slides-print.dc.html:50 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 86 | Slide 1 Preview | Digital Inspections - Marketing Slides-print.dc.html:59 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 87 | TEMPLATE PREVIEW | Digital Inspections - Marketing Slides-print.dc.html:63 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 88 | See the inspection the way your technician will | Digital Inspections - Marketing Slides-print.dc.html:64 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 89 | Switch between Edit and Preview as you build. | Digital Inspections - Marketing Slides-print.dc.html:67 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 90 | See the form exactly as it opens on the job. | Digital Inspections - Marketing Slides-print.dc.html:68 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 91 | Check every section before you publish. | Digital Inspections - Marketing Slides-print.dc.html:69 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 92 | Air system | Digital Inspections - Marketing Slides-print.dc.html:86 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 93 | · Inspection · 2 sections · 4 fields | Digital Inspections - Marketing Slides-print.dc.html:90 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 94 | Leak-test-procedure.pdf | Digital Inspections - Marketing Slides-print.dc.html:94 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 95 | Low-air warning buzzer | Digital Inspections - Marketing Slides-print.dc.html:95 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 96 | Glad hands and seals | Digital Inspections - Marketing Slides-print.dc.html:96 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 97 | Inspection Completed Technician Issues Report | sweep Digital Inspections - Marketing Slides-print-pages.txt:163 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 98 | Sep 24, 2026 Marcus Bell | sweep Digital Inspections - Marketing Slides-print-pages.txt:167 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 99 | Aug 12, 2026 Dana Ruiz | sweep Digital Inspections - Marketing Slides-print-pages.txt:175 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 100 | Jun 30, 2026 Marcus Bell | sweep Digital Inspections - Marketing Slides-print-pages.txt:182 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 101 | May 18, 2026 Luis Ortega | sweep Digital Inspections - Marketing Slides-print-pages.txt:189 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 102 | Mar 3, 2026 Dana Ruiz | sweep Digital Inspections - Marketing Slides-print-pages.txt:196 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 103 | Title Labor Parts | sweep Digital Inspections - Marketing Slides-print-pages.txt:227 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 104 | Brake & Axle PM · Inspection · 2 sections · 4 fields | sweep Digital Inspections - Marketing Slides-print-pages.txt:40 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 105 | Tire pressure psi | sweep Digital Inspections - Marketing Slides-print-pages.txt:92 | Marketing Slides deck: promotional material, not product UI (no PRD story covers it) |
| 106 | Annual DOT inspection | Digital Inspections V2 - All Screens.dc.html:2582 | OUT-OF-SCOPE — Line Builder started from a work order with no inspection (PRD Out of scope; referenced only by S15-R16/N5) |
| 107 | Federal annual, all systems. | Digital Inspections V2 - All Screens.dc.html:2582 | OUT-OF-SCOPE — Line Builder started from a work order with no inspection (PRD Out of scope; referenced only by S15-R16/N5) |
| 108 | Replace wiper blades | Digital Inspections V2 - All Screens.dc.html:2583 | OUT-OF-SCOPE — Line Builder started from a work order with no inspection (PRD Out of scope; referenced only by S15-R16/N5) |
| 109 | Customer request. | Digital Inspections V2 - All Screens.dc.html:2583 | OUT-OF-SCOPE — Line Builder started from a work order with no inspection (PRD Out of scope; referenced only by S15-R16/N5) |
| 110 | 2 lines drafted from this work order | Digital Inspections V2 - All Screens.dc.html:2591 | OUT-OF-SCOPE — Line Builder started from a work order with no inspection (PRD Out of scope; referenced only by S15-R16/N5) |
| 111 | Drafted from the unit's history and the 2 lines already on this work order; no inspection needed. | Digital Inspections V2 - All Screens.dc.html:2598 | OUT-OF-SCOPE — Line Builder started from a work order with no inspection (PRD Out of scope; referenced only by S15-R16/N5) |
| 112 | 2 of 2 selected | Digital Inspections V2 - All Screens.dc.html:2600 | OUT-OF-SCOPE — Line Builder started from a work order with no inspection (PRD Out of scope; referenced only by S15-R16/N5) |
| 113 | Replace air dryer cartridge | Digital Inspections V2 - All Screens.dc.html:2613 | OUT-OF-SCOPE — Line Builder started from a work order with no inspection (PRD Out of scope; referenced only by S15-R16/N5) |
| 114 | Last replaced 118,000 mi ago | Digital Inspections V2 - All Screens.dc.html:2613 | OUT-OF-SCOPE — Line Builder started from a work order with no inspection (PRD Out of scope; referenced only by S15-R16/N5) |
| 115 | Service interval reached; do it while the unit is on the lift. | Digital Inspections V2 - All Screens.dc.html:2614 | OUT-OF-SCOPE — Line Builder started from a work order with no inspection (PRD Out of scope; referenced only by S15-R16/N5) |
| 116 | Grease chassis fittings | Digital Inspections V2 - All Screens.dc.html:2620 | OUT-OF-SCOPE — Line Builder started from a work order with no inspection (PRD Out of scope; referenced only by S15-R16/N5) |
| 117 | Bundled with the DOT inspection | Digital Inspections V2 - All Screens.dc.html:2620 | OUT-OF-SCOPE — Line Builder started from a work order with no inspection (PRD Out of scope; referenced only by S15-R16/N5) |
| 118 | Standard PM add-on for this unit class. | Digital Inspections V2 - All Screens.dc.html:2621 | OUT-OF-SCOPE — Line Builder started from a work order with no inspection (PRD Out of scope; referenced only by S15-R16/N5) |
| 119 | 1.2 hrs labor · 1 part · nothing added yet | Digital Inspections V2 - All Screens.dc.html:2629 | OUT-OF-SCOPE — Line Builder started from a work order with no inspection (PRD Out of scope; referenced only by S15-R16/N5) |
| 120 | Annual DOT inspection Federal annual, all systems. 2.0 hrs No parts | sweep Digital Inspections V2 - All Screens-pages.txt:1459 | OUT-OF-SCOPE — Line Builder started from a work order with no inspection (PRD Out of scope; referenced only by S15-R16/N5) |
| 121 | Replace wiper blades Customer request. 0.3 hrs | sweep Digital Inspections V2 - All Screens-pages.txt:1460 | OUT-OF-SCOPE — Line Builder started from a work order with no inspection (PRD Out of scope; referenced only by S15-R16/N5) |
| 122 | Service interval reached; do it while the unit is on the lift. 0.8 hrs | sweep Digital Inspections V2 - All Screens-pages.txt:1473 | OUT-OF-SCOPE — Line Builder started from a work order with no inspection (PRD Out of scope; referenced only by S15-R16/N5) |
| 123 | Standard PM add-on for this unit class. 0.4 hrs | sweep Digital Inspections V2 - All Screens-pages.txt:1481 | OUT-OF-SCOPE — Line Builder started from a work order with no inspection (PRD Out of scope; referenced only by S15-R16/N5) |
| 124 | Timesheets | Digital Inspections - Marketing Slides-print.dc.html:337 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 125 | Search | Digital Inspections V2 - All Screens.dc.html:1028 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 126 | ⌘K | Digital Inspections V2 - All Screens.dc.html:1028 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 127 | / 5 fields complete | Digital Inspections V2 - All Screens.dc.html:1040 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 128 | Goes to the customer report. | Digital Inspections V2 - All Screens.dc.html:1983 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 129 | Part Returns | Digital Inspections V2 - All Screens.dc.html:2376 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 130 | Finance | Digital Inspections V2 - All Screens.dc.html:2376 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 131 | Schedule | Digital Inspections V2 - All Screens.dc.html:265 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 132 | OD | Digital Inspections V2 - All Screens.dc.html:266 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 133 | VIN / Serial # | Digital Inspections V2 - All Screens.dc.html:2663 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 134 | Mileage | Digital Inspections V2 - All Screens.dc.html:2664 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 135 | Engine Hours | Digital Inspections V2 - All Screens.dc.html:2665 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 136 | Stats | Digital Inspections V2 - All Screens.dc.html:2671 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 137 | 1 NOTE | Digital Inspections V2 - All Screens.dc.html:2675 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 138 | Newest first | Digital Inspections V2 - All Screens.dc.html:2677 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 139 | Auto-posted | Digital Inspections V2 - All Screens.dc.html:2688 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 140 | Licence Plate | Digital Inspections V2 - All Screens.dc.html:2922 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 141 | By signing, customer acknowledges receipt of this report and authorizes the work marked Approved. | Inspection Report PDF.dc.html:114 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 142 | WJ | Prototype - Fill Inspection.dc.html:37 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 143 | / {…} fields complete | Prototype - Fill Inspection.dc.html:65 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 144 | / {{ totalCount }} fields complete | Prototype - Fill Inspection.dc.html:65 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 145 | (copy) | Prototype - Template Builder.dc.html:328 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 146 | Template published · new inspections use this version | Prototype - Template Builder.dc.html:407 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 147 | No lines on this work order yet. | Prototype - Work Order Handoff.dc.html:174 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 148 | Licence plate | Prototype - Work Order Handoff.dc.html:211 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 149 | VIN | Prototype - Work Order Handoff.dc.html:211 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 150 | Parts ( | Prototype - Work Order Handoff.dc.html:287 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 151 | KB | Prototype - Work Order Handoff.dc.html:44 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 152 | Icon button | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 153 | Clock in | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 154 | HEAVY DUTY | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 155 | DOT inspection | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 156 | On Site | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 157 | Heavy Duty | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 158 | Brake chamber condition (copy) | flow TB-08 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 159 | VIN 1XKYD49X8LJ123456 | flow WO-05 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 160 | Mileage 100,000 | flow WO-05 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 161 | Licence plate — | flow WO-05 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 162 | / 4 fields complete | sweep Prototype - Fill Inspection-pages.txt:22 | OUT-OF-SCOPE — existing Phase 1 screen element unchanged by V2 (PRD Assumptions: "This spec extends it and does not restate Phase 1 behaviour") |
| 163 | # Canvas.dc.html — visible text per page (hidden tooltip text excluded; it is listed per interaction) | sweep Canvas-pages.txt:1 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 164 | ======================== PAGE _whole_board ======================== | sweep Canvas-pages.txt:4 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 165 | # Conditional Follow-up V2.dc.html — visible text per page (hidden tooltip text excluded; it is listed per interaction) | sweep Conditional Follow-up V2-pages.txt:1 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 166 | # Digital Inspections - Marketing Slides.dc.html — visible text per page (hidden tooltip text excluded; it is listed per interaction) | sweep Digital Inspections - Marketing Slides-pages.txt:1 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 167 | ======================== PAGE slide-3 — INSTRUCTIONS / Tell technicians what to do next ======================== | sweep Digital Inspections - Marketing Slides-pages.txt:114 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 168 | ======================== PAGE slide-4 — INSPECTION HISTORY / Every inspection for an asset in one place ======================== | sweep Digital Inspections - Marketing Slides-pages.txt:151 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 169 | ======================== PAGE slide-5 — SHOPCOACH / Build the work order from the inspection ======================== | sweep Digital Inspections - Marketing Slides-pages.txt:203 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 170 | ======================== PAGE slide-1 — TEMPLATE PREVIEW / See the inspection the way your technician will ======================== | sweep Digital Inspections - Marketing Slides-pages.txt:23 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 171 | ======================== PAGE slide-2 — AXLES AND TIRE POSITIONS / Inspect every axle and every tire position ======================== | sweep Digital Inspections - Marketing Slides-pages.txt:67 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 172 | ======================== PAGE slide-0 — DIGITAL INSPECTIONS / Improvements coming to Digital Inspections ======================== | sweep Digital Inspections - Marketing Slides-pages.txt:8 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 173 | # Digital Inspections - Marketing Slides-print.dc.html — visible text per page (hidden tooltip text excluded; it is listed per interaction) | sweep Digital Inspections - Marketing Slides-print-pages.txt:1 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 174 | ======================== PAGE sec-4 — INSTRUCTIONS / Tell technicians what to do next ======================== | sweep Digital Inspections - Marketing Slides-print-pages.txt:114 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 175 | ======================== PAGE sec-5 — INSPECTION HISTORY / Every inspection for an asset in one place ======================== | sweep Digital Inspections - Marketing Slides-print-pages.txt:151 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 176 | ======================== PAGE sec-6 — SHOPCOACH / Build the work order from the inspection ======================== | sweep Digital Inspections - Marketing Slides-print-pages.txt:203 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 177 | ======================== PAGE sec-2 — TEMPLATE PREVIEW / See the inspection the way your technician will ======================== | sweep Digital Inspections - Marketing Slides-print-pages.txt:23 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 178 | ======================== PAGE _header_or_outside ======================== | sweep Digital Inspections - Marketing Slides-print-pages.txt:4 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 179 | ======================== PAGE sec-3 — AXLES AND TIRE POSITIONS / Inspect every axle and every tire position ======================== | sweep Digital Inspections - Marketing Slides-print-pages.txt:67 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 180 | ======================== PAGE sec-1 — DIGITAL INSPECTIONS / Improvements coming to Digital Inspections ======================== | sweep Digital Inspections - Marketing Slides-print-pages.txt:8 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 181 | # Digital Inspections V2 - All Screens.dc.html — visible text per page (hidden tooltip text excluded; it is listed per interaction) | sweep Digital Inspections V2 - All Screens-pages.txt:1 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 182 | ======================== PAGE sc-ho — 4Inspection to work orderA · B · B2 · B2b · B3 · B4 · B4b · C1 · C2 · C3 · C4 · D · E · E2 · E3 · F ·  | sweep Digital Inspections V2 - All Screens-pages.txt:1072 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 183 | ======================== PAGE sc-ci — 5Conditional follow-up on a responseCI1b · CI1c · CI1d · CI1e · CI3 · CI4 · CI5 · CI6 · CI7 · CI8 · CI | sweep Digital Inspections V2 - All Screens-pages.txt:2014 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 184 | ======================== PAGE sc-pdf — 6Customer report PDFR1 ======================== | sweep Digital Inspections V2 - All Screens-pages.txt:2660 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 185 | ======================== PAGE sc-bd — 1Template builder, desktopTB1 · TB2 · TB2b · TB3 · TB7 ======================== | sweep Digital Inspections V2 - All Screens-pages.txt:30 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 186 | ======================== PAGE sc-fd — 2Filling an inspection, desktopA1 · A2 · A3 · A3b · A5 · A5b · A6 · D3 · D4 ======================== | sweep Digital Inspections V2 - All Screens-pages.txt:347 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 187 | ======================== PAGE sc-fm — 3Filling an inspection, phoneM1 · M2 · M3 · M4 · M5 · M6 · M7 · M8 ======================== | sweep Digital Inspections V2 - All Screens-pages.txt:843 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 188 | # Inspection Fill V2 - Desktop.dc.html — visible text per page (hidden tooltip text excluded; it is listed per interaction) | sweep Inspection Fill V2 - Desktop-pages.txt:1 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 189 | ======================== PAGE a3b — A3b / Complete, left brake Not OK ======================== | sweep Inspection Fill V2 - Desktop-pages.txt:137 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 190 | ======================== PAGE a1 — A1 / Dual axle: nothing inspected yet ======================== | sweep Inspection Fill V2 - Desktop-pages.txt:15 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 191 | ======================== PAGE a5 — A5 / The form as it is filled, section 1 of 2, three field types ======================== | sweep Inspection Fill V2 - Desktop-pages.txt:178 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 192 | ======================== PAGE a5b — A5b / After Mark section OK: the section row reports what it did ======================== | sweep Inspection Fill V2 - Desktop-pages.txt:272 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 193 | ======================== PAGE a6 — A6 / Live, click a marker to pick a verdict ======================== | sweep Inspection Fill V2 - Desktop-pages.txt:339 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 194 | ======================== PAGE d3 — D3 / Field card, reference file, response, note, photo ======================== | sweep Inspection Fill V2 - Desktop-pages.txt:370 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 195 | ======================== PAGE d4 — D4 / Attachment viewer ======================== | sweep Inspection Fill V2 - Desktop-pages.txt:438 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 196 | ======================== PAGE a2 — A2 / Mid-fill: the dropdown names the tire it judges ======================== | sweep Inspection Fill V2 - Desktop-pages.txt:71 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 197 | ======================== PAGE sec-1 — SV-8181 · DIGITAL INSPECTIONS V2 · DESKTOP ARTBOARDS / Fill screen: desktop ======================== | sweep Inspection Fill V2 - Desktop-pages.txt:8 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 198 | ======================== PAGE a3 — A3 / Complete, left outer Not OK, left inner OK ======================== | sweep Inspection Fill V2 - Desktop-pages.txt:95 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 199 | # Inspection Fill V2 - Mobile.dc.html — visible text per page (hidden tooltip text excluded; it is listed per interaction) | sweep Inspection Fill V2 - Mobile-pages.txt:1 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 200 | ======================== PAGE sec-2 — M1 / Section 1: field list ======================== | sweep Inspection Fill V2 - Mobile-pages.txt:15 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 201 | ======================== PAGE sec-4 — M7 / Checkbox: reference file, not answered ======================== | sweep Inspection Fill V2 - Mobile-pages.txt:182 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 202 | ======================== PAGE sec-1 — SV-8181 · DIGITAL INSPECTIONS V2 · MOBILE ARTBOARDS / Fill screen: phone, 402 px ===================== | sweep Inspection Fill V2 - Mobile-pages.txt:8 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 203 | ======================== PAGE sec-3 — M4 / Per axle: nothing inspected ======================== | sweep Inspection Fill V2 - Mobile-pages.txt:90 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 204 | # Inspection Report PDF.dc.html — visible text per page (hidden tooltip text excluded; it is listed per interaction) | sweep Inspection Report PDF-pages.txt:1 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 205 | ======================== PAGE sec-7 — Brake chamber condition / ATTENTION ======================== | sweep Inspection Report PDF-pages.txt:103 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 206 | ======================== PAGE sec-8 — 02 / Air system ======================== | sweep Inspection Report PDF-pages.txt:113 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 207 | ======================== PAGE sec-9 — Air-brake system leak check / MONITOR ======================== | sweep Inspection Report PDF-pages.txt:118 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 208 | ======================== PAGE sec-10 — Low-air warning buzzer / PASS ======================== | sweep Inspection Report PDF-pages.txt:128 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 209 | ======================== PAGE sec-2 — Northline Truck & Trailer Repair / 4180 Industrial Parkway ======================== | sweep Inspection Report PDF-pages.txt:13 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 210 | ======================== PAGE sec-11 — Governor cut-out pressure / PASS ======================== | sweep Inspection Report PDF-pages.txt:133 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 211 | ======================== PAGE sec-12 — Technician comments / NO STATUS ======================== | sweep Inspection Report PDF-pages.txt:139 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 212 | ======================== PAGE sec-13 — INSPECTING TECHNICIAN / Marcus Bell ======================== | sweep Inspection Report PDF-pages.txt:145 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 213 | ======================== PAGE sec-14 — This report is generated by ShopView and is not a guarantee of vehicle condition outside the inspecte | sweep Inspection Report PDF-pages.txt:153 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 214 | ======================== PAGE sec-3 — BRAKE & AXLE PM / Inspection results ======================== | sweep Inspection Report PDF-pages.txt:25 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 215 | ======================== PAGE sec-4 — NEEDS ATTENTION / 3 ======================== | sweep Inspection Report PDF-pages.txt:49 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 216 | ======================== PAGE sec-5 — 01 / Brakes ======================== | sweep Inspection Report PDF-pages.txt:58 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 217 | ======================== PAGE sec-6 — Brake & tire measurements / ATTENTION ======================== | sweep Inspection Report PDF-pages.txt:63 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 218 | ======================== PAGE sec-1 — Northline Truck & Trailer Repair · Work Order S1-10482 / Powered by ShopView ======================== | sweep Inspection Report PDF-pages.txt:8 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 219 | # Inspection Template Builder V2 - Desktop.dc.html — visible text per page (hidden tooltip text excluded; it is listed per interaction) | sweep Inspection Template Builder V2 - Desktop-pages.txt:1 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 220 | ======================== PAGE tb7 — TB7 ======================== | sweep Inspection Template Builder V2 - Desktop-pages.txt:229 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 221 | # Mark OK Explorations.dc.html — visible text per page (hidden tooltip text excluded; it is listed per interaction) | sweep Mark OK Explorations-pages.txt:1 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 222 | ======================== PAGE turn-1 — DIGITAL INSPECTIONS · FILL SCREEN / Mark OK: four directions ======================== | sweep Mark OK Explorations-pages.txt:131 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 223 | ======================== PAGE turn-2 — ROUND 2 · ALIGNED AND LABELLED / Mark OK on one edge, with a clear marked state ===================== | sweep Mark OK Explorations-pages.txt:8 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 224 | # Prototype - Fill Inspection.dc.html — visible text per page (hidden tooltip text excluded; it is listed per interaction) | sweep Prototype - Fill Inspection-pages.txt:1 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 225 | # Prototype - Hub.dc.html — visible text per page (hidden tooltip text excluded; it is listed per interaction) | sweep Prototype - Hub-pages.txt:1 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 226 | # Prototype - Template Builder.dc.html — visible text per page (hidden tooltip text excluded; it is listed per interaction) | sweep Prototype - Template Builder-pages.txt:1 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 227 | # Prototype - Work Order Handoff.dc.html — visible text per page (hidden tooltip text excluded; it is listed per interaction) | sweep Prototype - Work Order Handoff-pages.txt:1 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 228 | # ShopCoach Line Builder V2.dc.html — visible text per page (hidden tooltip text excluded; it is listed per interaction) | sweep ShopCoach Line Builder V2-pages.txt:1 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 229 | ======================== PAGE e — Notes tab ======================== | sweep ShopCoach Line Builder V2-pages.txt:733 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 230 | ======================== PAGE f — Inspections list ======================== | sweep ShopCoach Line Builder V2-pages.txt:785 | OUT-OF-SCOPE — sweep tool page/file header line, not design text |
| 231 | 1 Section 1 0 | image-and-pdf-texts.txt:139 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 232 | Work Orders Schedule Customers Parts Reports | transcribed/image-and-pdf-texts.txt:131 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 233 | Search ⌘K | transcribed/image-and-pdf-texts.txt:132 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 234 | QA Testing OD | transcribed/image-and-pdf-texts.txt:133 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 235 | Admin · Inspection templates | transcribed/image-and-pdf-texts.txt:134 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 236 | Untitled Template | transcribed/image-and-pdf-texts.txt:135 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 237 | Draft (unsaved) | transcribed/image-and-pdf-texts.txt:136 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 238 | Save Draft | transcribed/image-and-pdf-texts.txt:137 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 239 | Section 1 0 | transcribed/image-and-pdf-texts.txt:139 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 240 | Untitled template | transcribed/image-and-pdf-texts.txt:140 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 241 | Add a short description (optional) | transcribed/image-and-pdf-texts.txt:141 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 242 | Brake & Axle | transcribed/image-and-pdf-texts.txt:143 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 243 | Drum/disc check + per-axle set | transcribed/image-and-pdf-texts.txt:144 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 244 | PM Service | transcribed/image-and-pdf-texts.txt:145 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 245 | Preventive maintenance, 5 sections | transcribed/image-and-pdf-texts.txt:146 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 246 | OK / Not OK / N/A | transcribed/image-and-pdf-texts.txt:149 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 247 | Number + unit (mm, psi, ...) | transcribed/image-and-pdf-texts.txt:151 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 248 | Click any field on the canvas to edit its properties here. | transcribed/image-and-pdf-texts.txt:155 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 249 | Add Section | transcribed/image-and-pdf-texts.txt:156 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 250 | What should we create? | transcribed/image-and-pdf-texts.txt:157 | build reference screenshot 2026-08-17 20.27.42 (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 251 | vehicle_inspection_link_insp-base | image-and-pdf-texts.txt:158 | build reference screenshot 2026-08-17 20.27.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 252 | eslint 0, vue-tsc 0, vitest 815 prošlo | transcribed/image-and-pdf-texts.txt:159 | build reference screenshot 2026-08-17 20.27.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 253 | Redosled screenshot-ova | transcribed/image-and-pdf-texts.txt:160 | build reference screenshot 2026-08-17 20.27.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 254 | Axle: Not OK | transcribed/image-and-pdf-texts.txt:161 | build reference screenshot 2026-08-17 20.27.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 255 | Recommended procedure | transcribed/image-and-pdf-texts.txt:163 | build reference screenshot 2026-08-17 20.27.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 256 | 1 field | image-and-pdf-texts.txt:165 | build reference screenshot 2026-08-17 20.28.12.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 257 | Switch types to see how this field's properties change. | image-and-pdf-texts.txt:171 | build reference screenshot 2026-08-17 20.28.12.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 258 | The technician can open this while answering. It is not included in the customer report. | image-and-pdf-texts.txt:176 | build reference screenshot 2026-08-17 20.28.12.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 259 | New Instruction / Instructions | transcribed/image-and-pdf-texts.txt:166 | build reference screenshot 2026-08-17 20.28.12.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 260 | Field properties Instructions | transcribed/image-and-pdf-texts.txt:169 | build reference screenshot 2026-08-17 20.28.12.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 261 | Shown read-only to the technician before the next field. | transcribed/image-and-pdf-texts.txt:172 | build reference screenshot 2026-08-17 20.28.12.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 262 | Tech must confirm before completing. | transcribed/image-and-pdf-texts.txt:174 | build reference screenshot 2026-08-17 20.28.12.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 263 | + Add Follow-Up | image-and-pdf-texts.txt:186 | build reference screenshot 2026-08-17 20.28.29.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 264 | Checkbox · OK / Monitor / Not OK / N/A | transcribed/image-and-pdf-texts.txt:180 | build reference screenshot 2026-08-17 20.28.29.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 265 | Show an extra instruction only when the tech picks a given response. Pick a path to edit it. | transcribed/image-and-pdf-texts.txt:185 | build reference screenshot 2026-08-17 20.28.29.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 266 | New Instruction | transcribed/image-and-pdf-texts.txt:194 | build reference screenshot 2026-08-17 20.28.39.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 267 | Follow-up on New check | transcribed/image-and-pdf-texts.txt:195 | build reference screenshot 2026-08-17 20.28.39.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 268 | shown when OK | transcribed/image-and-pdf-texts.txt:196 | build reference screenshot 2026-08-17 20.28.39.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 269 | A conditional follow-up is always an instruction. Its type belongs to the parent check. | transcribed/image-and-pdf-texts.txt:197 | build reference screenshot 2026-08-17 20.28.39.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 270 | On New Check | transcribed/image-and-pdf-texts.txt:200 | build reference screenshot 2026-08-17 20.28.39.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 271 | When OK | transcribed/image-and-pdf-texts.txt:205 | build reference screenshot 2026-08-17 20.28.39.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 272 | No Instruction Yet | transcribed/image-and-pdf-texts.txt:206 | build reference screenshot 2026-08-17 20.28.39.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 273 | Checkbox · OK / Monitor / Not OK / N/A · 1 follow-up | transcribed/image-and-pdf-texts.txt:211 | build reference screenshot 2026-08-17 20.28.39.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 274 | 5 fields | image-and-pdf-texts.txt:222 | build reference screenshot 2026-08-17 20.28.57.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 275 | Checkbox · OK / Monitor / Not OK / N/A · 3 follow-ups | transcribed/image-and-pdf-texts.txt:213 | build reference screenshot 2026-08-17 20.28.57.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 276 | shown when Not OK | transcribed/image-and-pdf-texts.txt:214 | build reference screenshot 2026-08-17 20.28.57.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 277 | shown when Monitor | transcribed/image-and-pdf-texts.txt:215 | build reference screenshot 2026-08-17 20.28.57.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 278 | When OK / When Monitor / When Not OK | transcribed/image-and-pdf-texts.txt:217 | build reference screenshot 2026-08-17 20.28.57.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 279 | 4 rows · Left / Right | image-and-pdf-texts.txt:227 | build reference screenshot 2026-08-17 20.29.09.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 280 | 6 fields | image-and-pdf-texts.txt:236 | build reference screenshot 2026-08-17 20.29.09.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 281 | New Axle Set | transcribed/image-and-pdf-texts.txt:223 | build reference screenshot 2026-08-17 20.29.09.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 282 | New axle set | transcribed/image-and-pdf-texts.txt:225 | build reference screenshot 2026-08-17 20.29.09.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 283 | rows · Left / Right | transcribed/image-and-pdf-texts.txt:227 | build reference screenshot 2026-08-17 20.29.09.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 284 | Every row is recorded Left and Right. Say whether a row is measured on the tire or on the brake. | transcribed/image-and-pdf-texts.txt:228 | build reference screenshot 2026-08-17 20.29.09.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 285 | Add Measurement Row | transcribed/image-and-pdf-texts.txt:233 | build reference screenshot 2026-08-17 20.29.09.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 286 | 0 / 2 fields complete | image-and-pdf-texts.txt:240 | build reference screenshot 2026-08-17 20.31.16.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 287 | CAB | image-and-pdf-texts.txt:246 | build reference screenshot 2026-08-17 20.31.16.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 288 | Work order · v1 | transcribed/image-and-pdf-texts.txt:237 | build reference screenshot 2026-08-17 20.31.16.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 289 | For Clodisu | transcribed/image-and-pdf-texts.txt:238 | build reference screenshot 2026-08-17 20.31.16.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 290 | All changes saved | transcribed/image-and-pdf-texts.txt:239 | build reference screenshot 2026-08-17 20.31.16.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 291 | Photos: 0.0 MB of 10 MB | transcribed/image-and-pdf-texts.txt:241 | build reference screenshot 2026-08-17 20.31.16.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 292 | Section 1 0/2 | transcribed/image-and-pdf-texts.txt:242 | build reference screenshot 2026-08-17 20.31.16.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 293 | Axle 1 | transcribed/image-and-pdf-texts.txt:247 | build reference screenshot 2026-08-17 20.31.16.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 294 | ALL ROWS | transcribed/image-and-pdf-texts.txt:248 | build reference screenshot 2026-08-17 20.31.16.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 295 | Axle 2 | transcribed/image-and-pdf-texts.txt:249 | build reference screenshot 2026-08-17 20.31.16.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 296 | Tech: N/A | transcribed/image-and-pdf-texts.txt:250 | build reference screenshot 2026-08-17 20.31.16.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 297 | Advisor: Owner Demo | transcribed/image-and-pdf-texts.txt:251 | build reference screenshot 2026-08-17 20.31.16.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 298 | Started: N/A | transcribed/image-and-pdf-texts.txt:252 | build reference screenshot 2026-08-17 20.31.16.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 299 | Save & Exit | transcribed/image-and-pdf-texts.txt:253 | build reference screenshot 2026-08-17 20.31.16.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 300 | Unsaved changes | transcribed/image-and-pdf-texts.txt:255 | build reference screenshot 2026-08-17 20.31.39.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 301 | 1 / 2 fields complete | image-and-pdf-texts.txt:259 | build reference screenshot 2026-08-17 20.35.37.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 302 | Instrukcije | image-and-pdf-texts.txt:261 | build reference screenshot 2026-08-17 20.35.37.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 303 | 1 Item Required | image-and-pdf-texts.txt:273 | build reference screenshot 2026-08-17 20.35.37.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 304 | Work order · v2 | transcribed/image-and-pdf-texts.txt:256 | build reference screenshot 2026-08-17 20.35.37.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 305 | SECTION 1 OF 1 | transcribed/image-and-pdf-texts.txt:257 | build reference screenshot 2026-08-17 20.35.37.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 306 | Recommended Procedure | transcribed/image-and-pdf-texts.txt:265 | build reference screenshot 2026-08-17 20.35.37.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 307 | Not done | transcribed/image-and-pdf-texts.txt:268 | build reference screenshot 2026-08-17 20.35.37.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 308 | Item Required | transcribed/image-and-pdf-texts.txt:273 | build reference screenshot 2026-08-17 20.35.37.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 309 | Describe the problem and the recommended repair | transcribed/image-and-pdf-texts.txt:277 | build reference screenshot 2026-08-17 20.35.48.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 310 | 2 New axle set | image-and-pdf-texts.txt:292 | build reference screenshot 2026-08-17 20.39.40.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 311 | 1 of 2 items in this section | image-and-pdf-texts.txt:294 | build reference screenshot 2026-08-17 20.39.40.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 312 | 2 Items Required | image-and-pdf-texts.txt:295 | build reference screenshot 2026-08-17 20.39.40.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 313 | FOR CLODISU | transcribed/image-and-pdf-texts.txt:279 | build reference screenshot 2026-08-17 20.39.40.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 314 | Work Order · V2 | transcribed/image-and-pdf-texts.txt:280 | build reference screenshot 2026-08-17 20.39.40.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 315 | Items Required | transcribed/image-and-pdf-texts.txt:295 | build reference screenshot 2026-08-17 20.39.40.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 316 | Tread depth in. | transcribed/image-and-pdf-texts.txt:296 | build reference screenshot 2026-08-17 20.39.48.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 317 | Brake lining in. | transcribed/image-and-pdf-texts.txt:297 | build reference screenshot 2026-08-17 20.39.48.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 318 | Push-rod travel in. | transcribed/image-and-pdf-texts.txt:298 | build reference screenshot 2026-08-17 20.39.48.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 319 | Screenshot 2026-08-17 at 18.20.46.png | transcribed/image-and-pdf-texts.txt:318 | build reference screenshot 2026-08-17 20.40.52.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 320 | New Instruction (Per axle) | transcribed/image-and-pdf-texts.txt:327 | build reference screenshot 2026-08-17 20.59.16.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 321 | New Text (Text) | transcribed/image-and-pdf-texts.txt:328 | build reference screenshot 2026-08-17 20.59.16.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 322 | New Check (Checkbox · OK / Monitor / Not OK / N/A) | transcribed/image-and-pdf-texts.txt:329 | build reference screenshot 2026-08-17 20.59.16.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 323 | Not OK On New Check | transcribed/image-and-pdf-texts.txt:338 | build reference screenshot 2026-08-17 20.59.27.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 324 | When Not OK | transcribed/image-and-pdf-texts.txt:341 | build reference screenshot 2026-08-17 20.59.27.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 325 | 2 follow-ups | image-and-pdf-texts.txt:346 | build reference screenshot 2026-08-17 21.00.09.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 326 | When Monitor | transcribed/image-and-pdf-texts.txt:349 | build reference screenshot 2026-08-17 21.00.09.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 327 | Not judged | transcribed/image-and-pdf-texts.txt:356 | build reference screenshot 2026-08-17 21.00.37.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 328 | Empty bays, endless possibilities. Get Going! | transcribed/image-and-pdf-texts.txt:394 | build reference screenshot 2026-08-18 12.26.12.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 329 | AI SHOPCOACH LINE BUILDER | transcribed/image-and-pdf-texts.txt:395 | build reference screenshot 2026-08-18 12.26.12.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 330 | e.g. Dot Inspection, Oil Change, Check Engine Light | transcribed/image-and-pdf-texts.txt:396 | build reference screenshot 2026-08-18 12.26.12.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 331 | Click to edit names, descriptions, labor hours, or parts. Add new parts or toggle them on/off. | transcribed/image-and-pdf-texts.txt:399 | build reference screenshot 2026-08-18 12.26.26.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 332 | Interval exceeded; oil degraded due to high ... | transcribed/image-and-pdf-texts.txt:400 | build reference screenshot 2026-08-18 12.26.26.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 333 | Engine oil ( 20 ) | transcribed/image-and-pdf-texts.txt:401 | build reference screenshot 2026-08-18 12.26.26.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 334 | Coolant ( 30 ) | transcribed/image-and-pdf-texts.txt:402 | build reference screenshot 2026-08-18 12.26.26.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 335 | 2 / 2 fields complete | image-and-pdf-texts.txt:408 | build reference screenshot 2026-08-18 12.28.31.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 336 | 4 row Not OK | image-and-pdf-texts.txt:410 | build reference screenshot 2026-08-18 12.28.31.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 337 | 4 Monitor | image-and-pdf-texts.txt:411 | build reference screenshot 2026-08-18 12.28.31.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 338 | 2 Returning to work order | image-and-pdf-texts.txt:414 | build reference screenshot 2026-08-18 12.28.31.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 339 | 9 items need attention. Create basic work order lines for them? (ShopCoach is off; add parts and labor manually.) | image-and-pdf-texts.txt:419 | build reference screenshot 2026-08-18 12.28.31.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 340 | + Create Lines | image-and-pdf-texts.txt:421 | build reference screenshot 2026-08-18 12.28.31.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 341 | Somenting | image-and-pdf-texts.txt:425 | build reference screenshot 2026-08-18 12.28.31.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 342 | Sasha Template | transcribed/image-and-pdf-texts.txt:406 | build reference screenshot 2026-08-18 12.28.31.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 343 | Read only | transcribed/image-and-pdf-texts.txt:407 | build reference screenshot 2026-08-18 12.28.31.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 344 | Returning to work order | transcribed/image-and-pdf-texts.txt:414 | build reference screenshot 2026-08-18 12.28.31.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 345 | Inspection locked | transcribed/image-and-pdf-texts.txt:415 | build reference screenshot 2026-08-18 12.28.31.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 346 | Completed at Today 06:28 AM. Customer report posted to the work order. | transcribed/image-and-pdf-texts.txt:416 | build reference screenshot 2026-08-18 12.28.31.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 347 | Sasha Template.pdf · attached to WO note feed | transcribed/image-and-pdf-texts.txt:417 | build reference screenshot 2026-08-18 12.28.31.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 348 | items need attention. Create basic work order lines for them? (ShopCoach is off; add parts and labor manually.) | transcribed/image-and-pdf-texts.txt:419 | build reference screenshot 2026-08-18 12.28.31.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 349 | Create Lines | transcribed/image-and-pdf-texts.txt:421 | build reference screenshot 2026-08-18 12.28.31.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 350 | Kada p... | transcribed/image-and-pdf-texts.txt:422 | build reference screenshot 2026-08-18 12.28.31.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 351 | CHECKBOX · note required if Monitor / Not OK | transcribed/image-and-pdf-texts.txt:423 | build reference screenshot 2026-08-18 12.28.31.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 352 | Goes to the customer report | transcribed/image-and-pdf-texts.txt:424 | build reference screenshot 2026-08-18 12.28.31.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 353 | Choose where the lines from this inspection should go. | image-and-pdf-texts.txt:429 | build reference screenshot 2026-08-18 12.28.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 354 | Add to this Work Order | image-and-pdf-texts.txt:430 | build reference screenshot 2026-08-18 12.28.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 355 | New estimate, seeded with this customer & vehicle. | image-and-pdf-texts.txt:433 | build reference screenshot 2026-08-18 12.28.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 356 | Continue | image-and-pdf-texts.txt:435 | build reference screenshot 2026-08-18 12.28.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 357 | Build Work Order Lines | transcribed/image-and-pdf-texts.txt:428 | build reference screenshot 2026-08-18 12.28.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 358 | S-81 · Open | transcribed/image-and-pdf-texts.txt:431 | build reference screenshot 2026-08-18 12.28.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 359 | Every row is recorded Left and Right. Set how many values each side needs. | transcribed/image-and-pdf-texts.txt:484 | build reference screenshot 2026-08-18 20.23.48.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 360 | Duplicate Field | transcribed/image-and-pdf-texts.txt:488 | build reference screenshot 2026-08-18 20.23.48.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 361 | Delete Field | transcribed/image-and-pdf-texts.txt:489 | build reference screenshot 2026-08-18 20.23.48.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 362 | Per axle · 4 rows · left / right | transcribed/image-and-pdf-texts.txt:491 | build reference screenshot 2026-08-18 20.23.48.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 363 | When Monitor On New Check | transcribed/image-and-pdf-texts.txt:493 | build reference screenshot 2026-08-18 20.24.23.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 364 | Locked to Instruction. A follow-up cannot be duplicated. | transcribed/image-and-pdf-texts.txt:494 | build reference screenshot 2026-08-18 20.24.23.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 365 | Shows an extra instruction only when the tech picks a given response. One per response. | transcribed/image-and-pdf-texts.txt:500 | build reference screenshot 2026-08-18 20.24.23.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 366 | When Monitor No Instruction Yet | transcribed/image-and-pdf-texts.txt:501 | build reference screenshot 2026-08-18 20.24.23.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 367 | Delete Follow-Up | transcribed/image-and-pdf-texts.txt:503 | build reference screenshot 2026-08-18 20.24.23.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 368 | One per response. | transcribed/image-and-pdf-texts.txt:505 | build reference screenshot 2026-08-18 20.24.51.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 369 | 4 follow-ups | image-and-pdf-texts.txt:508 | build reference screenshot 2026-08-18 20.25.55.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 370 | Testing this like crazy | image-and-pdf-texts.txt:514 | build reference screenshot 2026-08-18 20.25.55.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 371 | shown when N/A | transcribed/image-and-pdf-texts.txt:509 | build reference screenshot 2026-08-18 20.25.55.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 372 | Screenshot 2026-08-18 at 15.54.02.png | transcribed/image-and-pdf-texts.txt:511 | build reference screenshot 2026-08-18 20.25.55.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 373 | When OK Screenshot 2026-08-18 At 15... | transcribed/image-and-pdf-texts.txt:515 | build reference screenshot 2026-08-18 20.25.55.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 374 | When Monitor Testing This Like Crazy | transcribed/image-and-pdf-texts.txt:516 | build reference screenshot 2026-08-18 20.25.55.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 375 | When Not OK Screenshot 2026-08-18 At... | transcribed/image-and-pdf-texts.txt:517 | build reference screenshot 2026-08-18 20.25.55.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 376 | When N/A No Instruction Yet | transcribed/image-and-pdf-texts.txt:518 | build reference screenshot 2026-08-18 20.25.55.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 377 | All four responses have a path. Delete one to add a different branch. | transcribed/image-and-pdf-texts.txt:519 | build reference screenshot 2026-08-18 20.25.55.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 378 | 0 / 3 fields complete | image-and-pdf-texts.txt:546 | build reference screenshot 2026-08-19 10.55.04.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 379 | Screenshot 2026-08-18 at 20.50.41.png | transcribed/image-and-pdf-texts.txt:561 | build reference screenshot 2026-08-19 10.55.04.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 380 | 1 New text | image-and-pdf-texts.txt:572 | build reference screenshot 2026-08-19 10.59.43.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 381 | 2 New check | image-and-pdf-texts.txt:576 | build reference screenshot 2026-08-19 10.59.43.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 382 | 3 New check | image-and-pdf-texts.txt:577 | build reference screenshot 2026-08-19 10.59.43.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 383 | 3 skipped, return anytime | image-and-pdf-texts.txt:578 | build reference screenshot 2026-08-19 10.59.43.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 384 | SECTION 1 OF 2 | transcribed/image-and-pdf-texts.txt:569 | build reference screenshot 2026-08-19 10.59.43.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 385 | New text | transcribed/image-and-pdf-texts.txt:572 | build reference screenshot 2026-08-19 10.59.43.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 386 | skipped, return anytime | transcribed/image-and-pdf-texts.txt:578 | build reference screenshot 2026-08-19 10.59.43.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 387 | 1 New check | image-and-pdf-texts.txt:583 | build reference screenshot 2026-08-19 11.00.06.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 388 | 2 New measurement | image-and-pdf-texts.txt:588 | build reference screenshot 2026-08-19 11.00.06.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 389 | 3 New axle set | image-and-pdf-texts.txt:589 | build reference screenshot 2026-08-19 11.00.06.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 390 | SECTION 2 OF 2 | transcribed/image-and-pdf-texts.txt:580 | build reference screenshot 2026-08-19 11.00.06.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 391 | PNG Recommended procedure Screenshot 2026-08-18 at 20.50.41.png Open | transcribed/image-and-pdf-texts.txt:585 | build reference screenshot 2026-08-19 11.00.06.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 392 | Ready to sign & lock | transcribed/image-and-pdf-texts.txt:590 | build reference screenshot 2026-08-19 11.00.06.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 393 | Axle 1 Single · 0 of 4 rows judged | transcribed/image-and-pdf-texts.txt:598 | build reference screenshot 2026-08-19 11.01.12.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 394 | Set all 4 rows | transcribed/image-and-pdf-texts.txt:602 | build reference screenshot 2026-08-19 11.01.12.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 395 | Brake lining in. PER BRAKE | transcribed/image-and-pdf-texts.txt:609 | build reference screenshot 2026-08-19 11.02.27.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 396 | Push-rod travel in. PER BRAKE | transcribed/image-and-pdf-texts.txt:610 | build reference screenshot 2026-08-19 11.02.27.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 397 | 12/12 positions | image-and-pdf-texts.txt:620 | build reference screenshot 2026-08-19 11.02.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 398 | SECTION 1 OF 1 · BRAKE & TIRE SET | transcribed/image-and-pdf-texts.txt:619 | build reference screenshot 2026-08-19 11.02.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 399 | Set all positions | transcribed/image-and-pdf-texts.txt:627 | build reference screenshot 2026-08-19 11.02.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 400 | Tire pressure PSI NOT OK | transcribed/image-and-pdf-texts.txt:628 | build reference screenshot 2026-08-19 11.02.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 401 | LEFT OUTER · NOT OK 42 | transcribed/image-and-pdf-texts.txt:629 | build reference screenshot 2026-08-19 11.02.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 402 | LEFT INNER · OK 98 | transcribed/image-and-pdf-texts.txt:630 | build reference screenshot 2026-08-19 11.02.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 403 | RIGHT INNER · OK 101 | transcribed/image-and-pdf-texts.txt:631 | build reference screenshot 2026-08-19 11.02.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 404 | RIGHT OUTER · MONITOR 99 | transcribed/image-and-pdf-texts.txt:632 | build reference screenshot 2026-08-19 11.02.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 405 | Brake lining in. OK | transcribed/image-and-pdf-texts.txt:634 | build reference screenshot 2026-08-19 11.02.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 406 | LEFT BRAKE · OK 0.31 | transcribed/image-and-pdf-texts.txt:635 | build reference screenshot 2026-08-19 11.02.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 407 | RIGHT BRAKE · OK 0.34 | transcribed/image-and-pdf-texts.txt:636 | build reference screenshot 2026-08-19 11.02.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 408 | Axle 1 · 12 of 12 positions | transcribed/image-and-pdf-texts.txt:637 | build reference screenshot 2026-08-19 11.02.42.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 409 | Customer reports DEF light intermittent — confirm the fault before authorizing the dosing valve replacement. | transcribed/image-and-pdf-texts.txt:686 | build reference screenshot 2026-08-19 11.51.10.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 410 | ABC Tr... | transcribed/image-and-pdf-texts.txt:687 | build reference screenshot 2026-08-19 11.51.10.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 411 | DOT annual inspecti... | transcribed/image-and-pdf-texts.txt:689 | build reference screenshot 2026-08-19 11.51.10.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 412 | Clutch replacement | transcribed/image-and-pdf-texts.txt:690 | build reference screenshot 2026-08-19 11.51.10.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 413 | Front b... | transcribed/image-and-pdf-texts.txt:691 | build reference screenshot 2026-08-19 11.51.10.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 414 | check to keep it and an X to drop it | transcribed/image-and-pdf-texts.txt:692 | build reference screenshot 2026-08-19 11.51.39.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 415 | Auto-Posted | image-and-pdf-texts.txt:773 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 416 | 19.96 kB · 2 sections · 6 fields · 0 photos | image-and-pdf-texts.txt:778 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 417 | 2 Pass | image-and-pdf-texts.txt:779 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 418 | 4 Fail | image-and-pdf-texts.txt:781 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 419 | + Build Work Order | image-and-pdf-texts.txt:784 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 420 | Over Limit | transcribed/image-and-pdf-texts.txt:760 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 421 | Started: Today | transcribed/image-and-pdf-texts.txt:761 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 422 | Total Hours: - | transcribed/image-and-pdf-texts.txt:762 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 423 | Progress 0% | transcribed/image-and-pdf-texts.txt:763 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 424 | Lead Technician | transcribed/image-and-pdf-texts.txt:764 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 425 | Service Advisor Owner Demo | transcribed/image-and-pdf-texts.txt:765 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 426 | Milos Vasic Company | transcribed/image-and-pdf-texts.txt:766 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 427 | Alfa Cargo Llc | transcribed/image-and-pdf-texts.txt:767 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 428 | Financial Info | transcribed/image-and-pdf-texts.txt:768 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 429 | Lines (1) Parts (1) Notes (1) Stats Finance | transcribed/image-and-pdf-texts.txt:769 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 430 | Sort By Newest First | transcribed/image-and-pdf-texts.txt:770 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 431 | Owner Demo | transcribed/image-and-pdf-texts.txt:772 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 432 | Work Order: S-238 | transcribed/image-and-pdf-texts.txt:774 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 433 | :46 AM, Today | transcribed/image-and-pdf-texts.txt:775 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 434 | Completed inspection: 1234 — v2 | transcribed/image-and-pdf-texts.txt:776 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 435 | kB · 2 sections · 6 fields · 0 photos | transcribed/image-and-pdf-texts.txt:778 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 436 | Build Work Order | transcribed/image-and-pdf-texts.txt:784 | build reference screenshot 2026-08-20 16.47.44.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 437 | 2 of 14 need a work order | image-and-pdf-texts.txt:799 | build reference screenshot 2026-08-20 16.49.00.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 438 | 1234 v2 Not started S-237 Approved | image-and-pdf-texts.txt:800 | build reference screenshot 2026-08-20 16.49.00.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 439 | /off Kustoms, Llc 6130M | transcribed/image-and-pdf-texts.txt:788 | build reference screenshot 2026-08-20 16.49.00.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 440 | Preferred Contact | transcribed/image-and-pdf-texts.txt:790 | build reference screenshot 2026-08-20 16.49.00.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 441 | Invoices (3) | transcribed/image-and-pdf-texts.txt:792 | build reference screenshot 2026-08-20 16.49.00.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 442 | All 14 | transcribed/image-and-pdf-texts.txt:795 | build reference screenshot 2026-08-20 16.49.00.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 443 | Needs action 2 | transcribed/image-and-pdf-texts.txt:796 | build reference screenshot 2026-08-20 16.49.00.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 444 | With issues 8 | transcribed/image-and-pdf-texts.txt:797 | build reference screenshot 2026-08-20 16.49.00.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 445 | Not started 6 | transcribed/image-and-pdf-texts.txt:798 | build reference screenshot 2026-08-20 16.49.00.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 446 | v2 Not started S-237 Approved | transcribed/image-and-pdf-texts.txt:800 | build reference screenshot 2026-08-20 16.49.00.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 447 | Testing With Sasha v1 Not started S-235 | transcribed/image-and-pdf-texts.txt:801 | build reference screenshot 2026-08-20 16.49.00.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 448 | Sasha Template v1 Completed 2 days ago Owner Demo 4 Not OK 5 Monitor S-81 PDF WO created S-235 | transcribed/image-and-pdf-texts.txt:802 | build reference screenshot 2026-08-20 16.49.00.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 449 | Testing Design v1 Completed Aug 10, 2026 1 Not OK 2 Monitor S-83 PDF + Build Work Order | transcribed/image-and-pdf-texts.txt:803 | build reference screenshot 2026-08-20 16.49.00.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 450 | Dule/Milos ... + Build Work Order | transcribed/image-and-pdf-texts.txt:804 | build reference screenshot 2026-08-20 16.49.00.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 451 | Testing Live With The Team ... WO created S-233 | transcribed/image-and-pdf-texts.txt:805 | build reference screenshot 2026-08-20 16.49.00.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 452 | Teating With My Man ... Lines added S-58 | transcribed/image-and-pdf-texts.txt:806 | build reference screenshot 2026-08-20 16.49.00.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 453 | Axle Test v5 ... Lines added S-58 | transcribed/image-and-pdf-texts.txt:807 | build reference screenshot 2026-08-20 16.49.00.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 454 | Testing Hazard Mllos ... WO created S-234 | transcribed/image-and-pdf-texts.txt:808 | build reference screenshot 2026-08-20 16.49.00.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 455 | Testing New Design v2 Completed Jul 9, 2026 3 Monitor S-80 WO created S-230 | transcribed/image-and-pdf-texts.txt:809 | build reference screenshot 2026-08-20 16.49.00.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 456 | 0 / 5 fields complete | image-and-pdf-texts.txt:840 | build reference screenshot 2026-09-03 19.36.17.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 457 | Clock In | transcribed/image-and-pdf-texts.txt:832 | build reference screenshot 2026-09-03 19.36.17.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 458 | Testing Design | transcribed/image-and-pdf-texts.txt:836 | build reference screenshot 2026-09-03 19.36.17.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 459 | Section 1 0/3 | transcribed/image-and-pdf-texts.txt:842 | build reference screenshot 2026-09-03 19.36.17.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 460 | Section 2 0/2 | transcribed/image-and-pdf-texts.txt:843 | build reference screenshot 2026-09-03 19.36.17.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 461 | Axle 3 ... | transcribed/image-and-pdf-texts.txt:852 | build reference screenshot 2026-09-03 19.36.17.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 462 | Tech: William Johns | transcribed/image-and-pdf-texts.txt:858 | build reference screenshot 2026-09-03 19.36.17.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 463 | Advisor: Kimberly Barnes | transcribed/image-and-pdf-texts.txt:859 | build reference screenshot 2026-09-03 19.36.17.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 464 | Field properties Checkbox | transcribed/image-and-pdf-texts.txt:1025 | build reference screenshot 2026-09-21 14.51.22.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 465 | Only forces a photo when marked Not OK. | transcribed/image-and-pdf-texts.txt:1038 | build reference screenshot 2026-09-21 14.51.22.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 466 | 01 Section 1 | image-and-pdf-texts.txt:12 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 467 | 4 items inspected | image-and-pdf-texts.txt:13 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 468 | 1 attention | image-and-pdf-texts.txt:14 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 469 | 2 pass | image-and-pdf-texts.txt:15 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 470 | 10842 West Charleston Boulevard / Suite 450-B / Las Vegas, Nevada 89135 / (403) 523 - 0488 | image-and-pdf-texts.txt:2 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 471 | 12 mm | image-and-pdf-texts.txt:20 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 472 | 02 Section 2 | image-and-pdf-texts.txt:24 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 473 | 2 items inspected | image-and-pdf-texts.txt:25 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 474 | #S2-33465 | image-and-pdf-texts.txt:4 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 475 | Staging Heavy Duty - 9919 | transcribed/image-and-pdf-texts.txt:1 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 476 | MONITOR 0 Wearing items still within spec — plan for replacement at your next PM cycle. | transcribed/image-and-pdf-texts.txt:10 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 477 | PASS 2 Components meeting all manufacturer and DOT specifications at time of inspection. | transcribed/image-and-pdf-texts.txt:11 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 478 | Section 1 | transcribed/image-and-pdf-texts.txt:12 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 479 | items inspected | transcribed/image-and-pdf-texts.txt:13 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 480 | New check PASS | transcribed/image-and-pdf-texts.txt:16 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 481 | New measurement | transcribed/image-and-pdf-texts.txt:17 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 482 | Measured: 12 mm | transcribed/image-and-pdf-texts.txt:18 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 483 | West Charleston Boulevard / Suite 450-B / Las Vegas, Nevada 89135 / (403) 523 - 0488 | transcribed/image-and-pdf-texts.txt:2 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 484 | New instruction | transcribed/image-and-pdf-texts.txt:21 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 485 | Nesto mozda | transcribed/image-and-pdf-texts.txt:22 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 486 | New measurement ATTENTION | transcribed/image-and-pdf-texts.txt:23 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 487 | Section 2 | transcribed/image-and-pdf-texts.txt:24 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 488 | Staging Heavy Duty - 9919 · Work Order #S2-33465 | transcribed/image-and-pdf-texts.txt:27 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 489 | Powered by ShopView | transcribed/image-and-pdf-texts.txt:28 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 490 | Page 1 / 2 | transcribed/image-and-pdf-texts.txt:29 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 491 | New check ATTENTION | transcribed/image-and-pdf-texts.txt:30 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 492 | New short answer | transcribed/image-and-pdf-texts.txt:31 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 493 | Nest nije ok | transcribed/image-and-pdf-texts.txt:32 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 494 | NO STATUS | transcribed/image-and-pdf-texts.txt:33 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 495 | INSPECTING TECHNICIAN | transcribed/image-and-pdf-texts.txt:34 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 496 | Admin ShopView | transcribed/image-and-pdf-texts.txt:35 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 497 | Admin ShopView · Signed Sep 29, 2026 8:22 AM | transcribed/image-and-pdf-texts.txt:36 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 498 | CUSTOMER ACKNOWLEDGMENT | transcribed/image-and-pdf-texts.txt:37 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 499 | Sign by replying to the email link, or in-person at pickup | transcribed/image-and-pdf-texts.txt:38 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 500 | This report is generated by ShopView and is not a guarantee of vehicle condition outside the inspected items. | transcribed/image-and-pdf-texts.txt:40 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 501 | Page 2 / 2 | transcribed/image-and-pdf-texts.txt:41 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 502 | Inspected Sep 29, 2026 8:21 AM | transcribed/image-and-pdf-texts.txt:5 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 503 | MILOS TEST · VERSION 1 | transcribed/image-and-pdf-texts.txt:6 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 504 | Vehicle inspection results | transcribed/image-and-pdf-texts.txt:7 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 505 | Below is a complete record of every item your technician inspected, with photos and notes for anything outside spec. Items in red need atten | transcribed/image-and-pdf-texts.txt:8 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 506 | NEEDS ATTENTION 2 Out-of-spec items that should be addressed before the truck returns to service. | transcribed/image-and-pdf-texts.txt:9 | build reference screenshot uploads/38e14e29-546c-4d62-ad37-3f8aeda2fe22.pdf (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 507 | before the truck returns to service | transcribed/image-and-pdf-texts.txt:69 | build reference screenshot uploads/Screenshot 2026-09-29 at 10.43.34.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 508 | Steer | image-and-pdf-texts.txt:77 | build reference screenshot uploads/Screenshot 2026-09-29 at 11.06.41.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 509 | Per axle · 3 axles · 32 positions | transcribed/image-and-pdf-texts.txt:70 | build reference screenshot uploads/Screenshot 2026-09-29 at 11.06.41.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 510 | Axle 1 Steer · Disc · Single | transcribed/image-and-pdf-texts.txt:71 | build reference screenshot uploads/Screenshot 2026-09-29 at 11.06.41.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 511 | Tire pressure ● 82 psi / 108 psi | transcribed/image-and-pdf-texts.txt:73 | build reference screenshot uploads/Screenshot 2026-09-29 at 11.06.41.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 512 | Tread depth ● 4/32 in. / ● 6/32 in. | transcribed/image-and-pdf-texts.txt:74 | build reference screenshot uploads/Screenshot 2026-09-29 at 11.06.41.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 57) |
| 513 | TIRES | image-and-pdf-texts.txt:80 | build reference screenshot uploads/Screenshot 2026-09-29 at 11.18.36.png and 11.20.21.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 5 |
| 514 | Axle 2 Drive · Drum · Dual | transcribed/image-and-pdf-texts.txt:78 | build reference screenshot uploads/Screenshot 2026-09-29 at 11.18.36.png and 11.20.21.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 5 |
| 515 | Axle 3 Drive · Drum · Dual PASS | transcribed/image-and-pdf-texts.txt:86 | build reference screenshot uploads/Screenshot 2026-09-29 at 11.18.36.png and 11.20.21.png (current/dev build supplied as design input; not the 14 Oct design; expected results come from the PRD, Rule 5 |
| 516 | Shopview Design System | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 517 | URL: `https://www.figma.com/design/4v5M4z7Xj1Uw6qxrM61ktB/ShopView-Design-System` | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 518 | Shadows / elevation | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 519 | pages across Foundations (Logo, Colors, Typography, Icons, Effects, Spacing), Components (Avatar, Buttons, Checkboxes, Toggles, Inputs, Brea | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 520 | Dashed purple** (`#7B61FF` / `#8A38F5`) is used *only* in design-system documentation to delineate component spec regions — never in product | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 521 | Layout and containers | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 522 | Fixed top bar + fixed side panel + scrollable content** is the dominant shell. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 523 | Imagery, motifs, backgrounds | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 524 | No hand-drawn illustrations or background patterns.** The surface vocabulary is clean: white, grey-25, and subtle tinted cards (warm `#FFFAE | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 525 | No gradients** in product UI. Primary blue is a flat fill. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 526 | No photography** in the design system; product screens are text-and-data dense. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 527 | Data visualization** uses success/warning/error semantics for status chips in tables, and additional colors (teal, cyan, violet, pink) for d | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 528 | Products represented | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 529 | Hover = **color shift + subtle lift (shadow-sm → shadow-md)**, not scale. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 530 | Active/press = **darker fill + no shadow**, not shrink. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 531 | Loading buttons show a small row of pulsing circles in place of the label, preserving width. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 532 | No entrance animations on route changes. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 533 | Transparency and blur | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 534 | Overlays behind modals: `rgba(15,17,26,0.5)`, no blur. (Shopview does not use frosted glass.) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 535 | Disabled buttons: reduce to ~40% opacity of their default state. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 536 | Hover / Press / Focus summary | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 537 | State / Background / Border/Outline / Text/Icon / | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 538 | Default / #257CFF / — / white / | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 539 | Shopview appears to ship as a single web application with distinct workspaces: | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 540 | Hover / #1752C0 (primary-700) / — / white / | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 541 | Active / #042260 (primary-800) / — / white / | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 542 | Disabled / #B7D5FF / — / white / | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 543 | Secondary buttons invert the treatment: white bg, grey-300 border, grey-700 text; hover → grey-50 bg, grey-400 border. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 544 | Stroke style.** Line/outlined, not filled, not duotone. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 545 | No emoji in product UI.** Guideline docs may use ✅ ⚠️ ❌ to describe semantic meaning, but the UI never ships emoji as an icon. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 546 | No unicode glyphs as icons.** Arrows, chevrons, close are always proper SVGs. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 547 | SVG, not icon font.** Each icon ships as an SVG with `currentColor` stroke so it inherits text color. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 548 | Work Orders** — the hub. Each work order represents a repair job, broken into Lines (each with labor + parts + statuses like *Authorization  | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 549 | Known substitutions / caveats | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 550 | Fonts**: Inter ships locally in `fonts/` across three optical sizes (18pt for UI, 24pt available for mid-size, 28pt for display). `colors_an | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 551 | Icons**: Lucide is used as a stand-in for Shopview's internal icon library (matched style). | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 552 | Logo**: official wordmarks + symbols ship in `assets/` — `logo-primary-light.svg`, `logo-primary-dark.png`, `logo-black.svg`, `logo-white.sv | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 553 | Dara exploration screens** in Figma are work-in-progress, not canonical; the component pages (Buttons, Inputs, Badges, etc.) are the source  | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 554 | Schedule** — a week-view time grid where technicians' hours are blocked against work orders (e.g. "S1-8, ABC Truck Lines"). | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 555 | Customers** — customer records (e.g. *PepsiCo Foods Can...*) with contact, phone, IBS#. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 556 | Parts / Inventory** — parts catalog with bin location, category, supply, quantity. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 557 | Reports / Finance** — A/R Aging Detail, Canned Lines, Estimates, Invoicing. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 558 | `colors_and_type.css` — design tokens (colors, type, radii, shadows, spacing) as CSS variables, plus base element styles | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 559 | `assets/` — logos, icon set references, logo SVG path | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 560 | Shopview is **shop management software built for heavy-duty shops** — the people who service semi-trucks, tractors, trailers, fleet vehicles | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 561 | `fonts/` — web fonts (Inter, Nunito; both Google Fonts) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 562 | `preview/` — small sample cards that populate the Design System tab | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 563 | `ui_kits/shopview-app/` — the primary product UI kit (React/JSX) with `index.html` demo + component library | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 564 | Content Fundamentals | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 565 | ShopView copy is **direct, short, and verb-first**. It reads like a professional tool for busy shop managers — no marketing fluff, no friend | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 566 | Tone and voice | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 567 | Functional, not friendly.** The product is a system of record; copy gets out of the way. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 568 | Imperative verbs** dominate primary actions: *New Work Order*, *New Line*, *Authorize*, *Decline*, *Complete*, *New Inventory Part*. No "Let | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 569 | Domain language** is preferred over generic UI language. Say *Work Order*, *Line*, *Part*, *Bin Location*, *Service Advisor*, *Lead Technici | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 570 | Title Case for product-world nouns** (*Work Order*, *Part Returns*, *Canned Lines*, *A/R Aging Detail Report*) and in buttons and tabs (*New | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 571 | Sentence case for helper text and guidelines.** ("Use input fields only when the user must provide information, not for actions.") | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 572 | No emoji** in product UI. (Guideline docs use ✅ ⚠️ ❌ informally to describe semantic color meaning, but the UI itself does not.) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 573 | First-person plural is avoided.** The product never refers to itself as "we". Users are addressed obliquely ("My Work Orders"). | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 574 | Status words are single tokens** — *Paid*, *Partially Paid*, *Unpaid*, *Awaiting*, *Requested*, *Authorized*, *Authorization Required*, *App | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 575 | Copy examples (from Figma) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 576 | Button labels: "Save", "Add Part", "Update", "New Work Order", "New Line", "New Inventory Part", "Authorize", "Decline", "Complete" | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 577 | This design system is the source of truth for the product's look, feel, and language. It's derived directly from the official ShopView Desig | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 578 | Vague labels to avoid (per button guidelines): "OK", "New" | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 579 | Preferred over generic: "Delete Part" not just "Delete" | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 580 | Tabs: *Lines (17)*, *Parts (20)*, *Part Returns*, *Notes (2)*, *Timesheets (2)*, *Statistics*, *Finance* | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 581 | Destructive action guideline: dedicated destructive style (red), used for delete/remove/reset. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 582 | Writing rules in short | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 583 | Buttons trigger actions; links navigate. Never conflate. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 584 | One primary button per view. Never two primary buttons side by side. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 585 | Every button has states: Default, Hover, Focused, Disabled. Focused must be visible and accessible. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 586 | Always pair semantic colors with text or iconography — color alone never communicates state. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 587 | Error messages explain *what's wrong* and *how to fix it*. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 588 | Labels always visible; placeholders are examples, not substitutes for labels. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 589 | Visual Foundations | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 590 | Shopview's palette is **a blue-led utilitarian system**: one strong action blue, a cool slate-grey ladder for structure, and four semantic c | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 591 | Primary**: `#257CFF` (buttons, active tabs, links, logo accent). Pantone 2727 C. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 592 | Dark primary text**: `#364152` (grey-700 in our scale). Pantone 7546 C. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 593 | Neutrals (Grey)**: `#F8FAFC → #0F111A` — 11 steps. Used for layout, dividers, backgrounds, text. Grey-25–100 backgrounds, 200–400 containers | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 594 | Success**: `#36B360` family (fill `#ABF5C4`, text `#108737`). | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 595 | Warning**: `#EC9E00` family (fill `#FFF5E0`, text `#B47A00`). | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 596 | Error**: `#EF4444` family (fill `#FCA397`, text `#B52020`). | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 597 | Info**: `#257CFF` family (fill `#E5EDFF`, text `#0868A7`). | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 598 | Never use grey for interactive elements except disabled. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 599 | Body text never lighter than Grey-500. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 600 | Badges paint background tint + darker text — they're pills, not solid chips. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 601 | Inter** is the single product typeface — body, labels, buttons, inputs, navigation, tables, and headlines. Chosen for tall x-height, open ap | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 602 | Two optical sizes ship: **Inter 18pt** (aliased as `Inter`) for UI and body text, and **Inter 28pt** (aliased as `Inter Display`) for H1/H2  | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 603 | Typescale: H1 30/38 (600 or 700), H2 24/32 semibold, H3 20/28 (500 or 700), H4 16/24 semibold, Body 1 14/20 (400/500/600), Body 2 12/16 (500 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 604 | Corner radii | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 605 | Badges**: full pill (height/2) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 606 | Avatars**: full circle | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/README | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 607 | Import design-system components from 'index.js', not component internals. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_adher | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 608 | Literal[value=/font-family\\s*:\\s*(?!['\\"]?(?:Inter/Inter Display))/i] | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_adher | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 609 | Font not provided by the design system. Available: Inter, Inter Display. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_adher | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 610 | Inter Display | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_adher | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 611 | Show financials | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 612 | Notify on completion | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 613 | Motion is utility, not personality. Hover lifts shadow. Press deepens fill. Focus glows. Nothing scales, nothing springs. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 614 | shadow-sm → shadow-md | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 615 | No scale. No translate. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 616 | fill → primary-800 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 617 | No shrink. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 618 | Always visible. Always. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 619 | No interaction. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 620 | Shopview Design System \xB7 Edition 01 \xB7 Apr 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 621 | AI Agent | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 622 | v1.0 \xB7 May 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 623 | [data-dc-section="{…}"] [data-dc-slot] | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 624 | translateX({…}px) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 625 | Work orders (1) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 626 | WO-1041 Fisquare Farms | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 627 | M. Diaz \xB7 Apr 27, 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 628 | Customers (1) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 629 | Fisquare Farms | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 630 | 923 Ross Islands, X1T 2B1 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 631 | Lube Filter \xB7 FL-1A | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 632 | WO-1041 \xB7 qty 2 \xB7 $18.40 ea | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 633 | Assets (1) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 634 | 2019 Freightliner M2 106 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 635 | Fisquare Farms \xB7 1FD0W5HY2EEA05499 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 636 | A reference document for the visual and verbal language of Shopview - built for the people who service semi-trucks, tractors, trailers, and  | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 637 | Inverse - wordmark white | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 638 | Shopview Blue - primary CTA, links, active states. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 639 | One action blue. A slate-grey ladder for structure. Four semantic colors for status - never for decoration. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 640 | Drag to reorder | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 641 | For H1/H2 only - tighter aperture at scale. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 642 | Fleet service & repairs | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 643 | /i, '$1').replace(/( | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 644 | ]*)\s+width="[^"]*"/i, '$1').replace(/( | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 645 | Click to focus | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 646 | UI Icons | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 647 | Lucide, vendored and tuned for the shop floor. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 648 | View Icons → | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 649 | Main CTA - one per view | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 650 | Download PNG | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 651 | Download HTML | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 652 | Click again to delete | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 653 | Click - label floats above the value. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 654 | Scheduled maintenance - Sunday 2:00 AM PT | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 655 | Filter bar - applied set | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 656 | Status - multi-select list | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 657 | Customer - search + checklist | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 658 | linear-gradient(135deg, #7c3aed, #db2777) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 659 | One icon. Two states. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 660 | A self-contained animated web component with a gear-cog body and two eyes. Hover triggers a one-shot spin. Thinking state runs a continuous  | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 661 | hover-spin · random blink | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 662 | continuous spin · eye pulse | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 663 | In context | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 664 | Thinking… | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 665 | FAB \xB7 48\xD748 \xB7 radius-lg | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 666 | Shopview Design System \xB7 Edition 01 \xB7 May 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 667 | Aug 03, 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 668 | Aug 02, 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 669 | Jul 29, 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 670 | Jul 28, 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 671 | Jul 24, 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 672 | Aug 01, 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 673 | Jul 21, 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 674 | Jul 30, 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 675 | Jul 19, 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 676 | Jul 31, 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 677 | Jul 12, 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 678 | Jul 27, 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 679 | Jul 08, 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 680 | Assigned to me | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 681 | M84.5575 12.489H31.729C20.6432 12.489 16.1268 17.2792 13.937 27.6806L3.94616 74.8978C3.53557 77.2244 3.125 79.1405 3.125 80.9197C3.125 82.56 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 682 | Search customers, work orders, parts... | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 683 | Stop time clock | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 684 | Start time clock | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 685 | scale({…}) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 686 | top left | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 687 | User menu | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 688 | Type to search | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 689 | Clear search | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 690 | Clear all | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 691 | Comic Sans MS | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 692 | Marker Felt | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 693 | Segoe Print | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 694 | "Comic Sans MS", "Marker Felt", "Segoe Print", cursive | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 695 | rotate({…}deg) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 696 | No results for “ | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 697 | No work orders match these filters | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 698 | Try a different search term or remove a filter. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 699 | Check the spelling, or search by work order number, customer, unit or VIN. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 700 | Try removing a filter to widen your results. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 701 | Clear all filters | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 702 | Lance Foubert | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 703 | Operations Manager | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 704 | 9919 Shepard Road SE | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 705 | Calgary, AB | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 706 | 4700 112 Ave SE | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 707 | HD & AUTO | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 708 | 4310 9 Ave N | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 709 | Lethbridge, AB | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 710 | This week | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 711 | This month | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 712 | Last month | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 713 | This quarter | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 714 | This year | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 715 | MM/DD/YYYY – MM/DD/YYYY | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 716 | Shop logo | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 717 | Part Sales | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 718 | Purchase Orders | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 719 | Vendor Invoices | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 720 | Search or ask a question | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 721 | Inter, sans-serif | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 722 | Search all sources with | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 723 | Part sales | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 724 | Purchase orders | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 725 | Vendor invoices | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 726 | S1-644 Fibridge Commercial | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 727 | James Smith | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 728 | Apr 27, 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 729 | Add new line | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 730 | S1-578 Fibridge Commercial | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 731 | S1-511 Fisquare Farms | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 732 | Apr 12, 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 733 | Fibridge Commercial | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 734 | Fibrook Equipment | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 735 | 418 Delta Road, X1T 4C8 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 736 | Dana Fibridge | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 737 | Marcus Reid | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 738 | 1999 Ford Explorer | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 739 | 2007 Peterbuilt | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 740 | Microfiber Cloth | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 741 | Add to work order | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 742 | Rear Shock | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 743 | Fibridge Mining | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 744 | 8824 Norman Coves, V9R8M8 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 745 | Add contact | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 746 | Fibrook Supply | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 747 | P2-58 Fibridge Commercial | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 748 | Sarah Chen | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 749 | Add part | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 750 | PO-3241 Fibridge Mining | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 751 | PO-3198 Fibridge Mining | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 752 | Apr 14, 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 753 | S9-25987 Fibridge Mining | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 754 | May 12, 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 755 | S9-25901 Fibrook Supply | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 756 | Apr 30, 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 757 | S1-644 Fisquare Farms | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 758 | S1-644 Bosquare Excavating | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 759 | 2025 Freightliner M2 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 760 | Past week | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 761 | Adale Transport | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 762 | Barlow Condensed | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 763 | "Barlow Condensed", sans-serif | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 764 | P2-58 Toboro Industries | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 765 | Past 30 days | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 766 | Spark Plug | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 767 | Type to start searching for work orders, parts, customers and more | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 768 | New customer | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 769 | New inventory part | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 770 | No results for | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 771 | Freightliner 114SD | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 772 | Western Star 4700 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 773 | Kenworth T880 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 774 | Northgate Logistics | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 775 | Peterbilt 579 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 776 | Basin Oilfield Services | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 777 | Mack Anthem | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 778 | Prairie Haul Co. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 779 | Volvo VNL 760 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 780 | International LT625 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 781 | Cedar Ridge Transport | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 782 | Kenworth W990 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 783 | Peterbilt 389 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 784 | Mack Granite | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 785 | Volvo VHD 300 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 786 | Authorized Dealer | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 787 | Time clock | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 788 | Asset On Site | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 789 | Service Locations | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 790 | rgb(255, 255, 255) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 791 | {…}px {…}px {…}px {…}px | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 792 | Thumbnail rail | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 793 | Inter Display, Inter | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 794 | Screen stub. The full | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 795 | module would live here, built from the same primitives. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 796 | polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 797 | {…}px solid #0062B0 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 798 | {…}px solid transparent | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 799 | Search work orders, parts, customers… | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 800 | Partially Paid | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 801 | PepsiCo Foods Can. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 802 | T-220 Kenworth T680 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 803 | Oct 30 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 804 | TR-14 Freightliner Cascadia | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 805 | Mar 13 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 806 | Twin Cities Logistics | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 807 | 42 Volvo VNL | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 808 | Aug 2 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 809 | Mia Lopez | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 810 | Redline Express | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 811 | F-08 Peterbilt 579 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 812 | Nov 1 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 813 | D. Martinez | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 814 | Northwind Logistics | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 815 | First-run variants | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 816 | H-21 Mack Anthem | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 817 | Nov 4 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 818 | Prairie Haulers | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 819 | L-05 Kenworth W990 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 820 | Oct 28 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 821 | Perform oil and filter change | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 822 | Replace front brake pads and rotors | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 823 | Inspect and repair air compressor | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 824 | S-488 PepsiCo Foods | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 825 | S-487 ABC Truck | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 826 | S-483 Prairie | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 827 | S-486 Twin Cities | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 828 | S-485 Redline Express | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 829 | A · Dusk | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 830 | Awaiting Authorization | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 831 | Action needed | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 832 | Billed \xB7 7d | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 833 | Lead Tech | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 834 | B · Minimal | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 835 | Three Shops. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 836 | rgb(0, 98, 176) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 837 | ← All work orders | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 838 | WO # | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 839 | One Crew. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 840 | IBS# 4482 \xB7 (612) 555-0198 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 841 | VIN 1FUJGL…830971 \xB7 218,440 mi | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 842 | Jackie Moore | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 843 | Work Orders \xB7 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 844 | labor hrs \xB7 $ | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 845 | Week of Nov 4 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 846 | :00 \xB7 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 847 | Voice & Principles | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 848 | Functional, not friendly. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 849 | Shopview copy is verb-first, domain-specific, and gets out of the way. The product is a system of record for shops that don't have time for  | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 850 | New Work Order. Authorize. Decline. Complete. Add Part. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 851 | Never OK, Submit, or Click here. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 852 | Work Order, Line, Bin Location, Service Advisor, IBS#, Eng. Hr. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 853 | Not "item", "entry", or "task". | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 854 | One primary | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 855 | Exactly one primary action per view. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 856 | Secondary buttons for the rest. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 857 | No emoji | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 858 | Status communicated by badge + word. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 859 | Color alone never communicates state. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 860 | Title Case nouns | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 861 | Work Order, Part Returns, Canned Lines. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 862 | Sentence case for helper text. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 863 | No "we" | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 864 | The product is not a person. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 865 | No marketing fluff. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 866 | repeat(11, 1fr) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 867 | One action blue. An eleven-step grey ladder for everything else. Four semantic colors for status, never for decoration. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 868 | Primary \xB7 Shopview Blue | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 869 | Pantone 2727 C \xB7 #257CFF | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 870 | Neutrals \xB7 Slate Grey | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 871 | 11 steps \xB7 F8FAFC → 0F111A | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 872 | Segoe UI | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 873 | -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 874 | Auth. Dealer | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 875 | JetBrains Mono | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 876 | "JetBrains Mono", monospace | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 877 | // CONTACT | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 878 | 5 variants \xD7 3 sizes | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 879 | Delete Part | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 880 | Complete Work Order | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 881 | Bin Location | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 882 | Bin not found in current shop | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 883 | Status Badges | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 884 | Avatar \xB7 Toggle \xB7 Checkbox | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 885 | Hold for parts | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 886 | Work Order WO-1041 marked Completed. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 887 | Two lines on WO-1038 require authorization. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 888 | Could not save: bin location A-12-3 is in another shop. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 889 | Inventory sync ran 4 minutes ago. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 890 | {…}px {…}px {…}px | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 891 | // LOCATIONS | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 892 | rgb(207, 207, 207) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 893 | Alberta \xB7 03 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 894 | 01 — Charcoal Bar | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 895 | Dark back · accent rail | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 896 | 02 — Bold Split | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 897 | Two-panel front · light back | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 898 | 03 — Industrial | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 899 | Big type · diagonal cut | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 900 | 04 — Blueprint | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 901 | Tech grid · monospace | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 902 | 05 — Stencil | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 903 | Hatched · skewed stripe | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 904 | Business Cards — 5 variations | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 905 | Business Card — 5 Directions | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 906 | 3.5″ \xD7 2″ | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 907 | 0.125″ all sides | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 908 | 300 DPI | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 909 | Crop marks shown at corners | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 910 | Red dashed line = trim line \xB7 area beyond is bleed | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 911 | Waiting On Parts | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 912 | VIN/Serial # | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 913 | Clocked In | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 914 | Total price | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 915 | Created on | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 916 | Invoiced Date | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 917 | Days open | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 918 | Find a column | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 919 | No columns match | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 920 | Show all | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 921 | Reset to default | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 922 | Transload Trucking | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 923 | Hard Rock Industries LLC | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 924 | RF Heavy | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 925 | Truck Zone | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 926 | 1st Auto Parts Ltd | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 927 | Partmaster Ltd | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 928 | Auckland Motors Mitsubishi | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 929 | Dodson Autospares | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 930 | Texas Truck And Auto Parts | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 931 | Repco Grey Lynn | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 932 | Segedin Truck And Auto Pa… | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 933 | Eleanor Pena | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 934 | Esther Howard | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 935 | Jenny Wilson | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 936 | Annette Black | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 937 | Leslie Alexander | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 938 | Floyd Miles | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 939 | Theresa Webb | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 940 | Ralph Edwards | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 941 | Kathryn Murphy | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 942 | Kristin Watson | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 943 | Freightliner M2 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 944 | translate3d({…}px, {…}px, 0) scale({…}) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 945 | Total Price | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 946 | Asset on site | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 947 | Clear filters | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 948 | Viewing a shared link - your own saved filters aren't applied | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 949 | Back to my view | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 950 | filters are applied | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 951 | My Work Orders | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 952 | Hide filters | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 953 | Show filters | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 954 | url({…}) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 955 | Clear selection | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 956 | Search customer | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 957 | No matches | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 958 | [data-dc-slot], .dc-editable | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 959 | All Filters | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 960 | Apply filters | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 961 | s native | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 962 | Font size | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 963 | Dark mode | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 964 | [object Object] | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 965 | Close tweaks | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 966 | v1.0 \xB7 Apr 2026 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 967 | Shopview Design System \xB7 Edition 01 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 968 | that runs the | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 969 | shop floor. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 970 | A reference document for the visual and verbal language of Shopview — built for the people who service semi-trucks, tractors, trailers, and  | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 971 | Mark & Wordmark | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 972 | One blue. One mark. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 973 | The wordmark sets in Inter Display 800 italic with a custom symbol replacing the 'o'. Brand blue #257CFF is the only fill. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 974 | Shopview wordmark | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 975 | repeat(3, 1fr) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 976 | On surface · #FFFFFF | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 977 | On grey-25 · #F8FAFC | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 978 | On brand · #257CFF | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 979 | Inverse — wordmark white | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 980 | primary (Blue) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 981 | Shopview Blue — primary CTA, links, active states. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 982 | Hover / press state for primary. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 983 | Default page and card surface. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 984 | Off-white page floor, subtle band. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 985 | Side panel and sub-sidebar. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 986 | Headings, high-contrast text. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 987 | Default body copy. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 988 | Secondary text, helper copy. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 989 | Strong dividers, input borders. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 990 | Paid, Completed, Approved. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 991 | Authorization Required, Awaiting. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 992 | Overdue, destructive actions. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 993 | Tips, sync notifications. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 994 | Palette & Tokens | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 995 | Blue-led, slate-structured. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 996 | One action blue. A slate-grey ladder for structure. Four semantic colors for status — never for decoration. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 997 | repeat({…}, 1fr) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 998 | Display 600 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 999 | Page titles | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1000 | Section titles | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1001 | UI 500 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1002 | UI 600 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1003 | Card titles | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1004 | Body 1 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1005 | UI 400 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1006 | Default body | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1007 | Body 2 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1008 | Labels, meta | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1009 | Eyebrows, micro | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1010 | Type System | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1011 | Inter, two cuts. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1012 | Inter at 18pt for UI and body. Inter Display at 28pt for headlines where the tighter optical cut reads better at scale. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1013 | UI \xB7 18pt | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1014 | The grotesque that runs every screen. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1015 | Display \xB7 28pt | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1016 | For H1/H2 only — tighter aperture at scale. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1017 | {…}px | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1018 | The quick brown fox | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1019 | Inputs (compact) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1020 | Inline tags | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1021 | Buttons, inputs, cards | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1022 | Large cards, modals | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1023 | Modal outer | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1024 | Badges, toggles | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1025 | Grid & Geometry | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1026 | Built on a 4-pixel grid. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1027 | Spacing scale | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1028 | Icons are line-only with rounded joins, sized at 16, 20, 24, or 32. Color comes from currentColor — no fills, no duotone. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1029 | repeat(9, 1fr) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1030 | Main CTA — one per view | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1031 | Supporting actions | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1032 | Low-priority text actions | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1033 | Split · Primary | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1034 | Split · Secondary | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1035 | 0 {…}px | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1036 | With icons | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1037 | View details | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1038 | Aaron Keating | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1039 | Enter a complete phone number. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1040 | Click — label floats above the value. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1041 | 2019 Toyota Tacoma | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1042 | Hard Parts | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1043 | This field is required. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1044 | Rounded · Border | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1045 | Rounded · Solid | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1046 | Square · Border | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1047 | Square · Solid | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1048 | Label text | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1049 | WO-1041 marked Completed | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1050 | The work order is closed and the invoice is ready to send. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1051 | View invoice | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1052 | 3 Lines awaiting authorization | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1053 | Customer approval required before technicians can begin. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1054 | Customer signature is required before authorization. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1055 | Request signature | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1056 | Version 1.4.1 is now available | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1057 | Includes the new dashboard view. Pages will now load faster. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1058 | What's new | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1059 | Work Order saved | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1060 | Couldn't sync timesheet | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1061 | Invoice INV-04821 sent to PepsiCo Foods | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1062 | A copy is in the customer's outbox. Payment terms: Net 30. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1063 | Customer approval required before technicians can begin work. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1064 | Bin location required for Part #BR-44211. Add a bin and try again. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1065 | Scheduled maintenance — Sunday 2:00 AM PT | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1066 | Shopview will be unavailable for ~30 minutes during the 1.4.1 deploy. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1067 | Toast \xB7 Full (400 \xD7 auto) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1068 | Toast \xB7 Compact (single line) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1069 | Inline alert \xB7 Banner | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1070 | Component Library | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1071 | Twelve primitives. One blue. | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1072 | Every screen reduces to a small set of primitives. Reuse aggressively. Build new ones only when the existing set truly doesn't cover the cas | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1073 | repeat(12, 1fr) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1074 | 3 variants \xD7 3 sizes | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1075 | floating label \xB7 text \xB7 dropdown | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1076 | 5 tones \xD7 4 variants | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1077 | Live groups | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1078 | (fontCss ? ' | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1079 | Card \xB7 Work Order Line | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1080 | Replace front brake pads | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1081 | Tech: M. Diaz \xB7 2.5 hr | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1082 | Authorization Required | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1083 | Sam Hill | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1084 | Pat Liu | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1085 | Mae Diaz | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1086 | Aaron K | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1087 | Jane Doe | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1088 | " height=" | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1089 | " viewBox="0 0 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1090 | "><foreignObject width=" | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1091 | ' : '') + xml | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1092 | svg load failed | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1093 | checkbox \xB7 radio \xB7 toggle | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1094 | chip \xB7 dropdown \xB7 bar | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1095 | toast \xB7 compact \xB7 inline alert | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1096 | Chip states | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1097 | repeat(4, 1fr) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1098 | Filter bar — applied set | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1099 | RF Heavy, +2 | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1100 | repeat(2, 1fr) | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1101 | {…}${statusVal.length > 1 ? | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1102 | Status — multi-select list | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1103 | {…}${custVal.length > 1 ? | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1104 | Customer — search + checklist | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_bu | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1105 | AI Agent Icon Component.html | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1106 | AI Agent Icon Component | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1107 | AI Agent Icon.html | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1108 | AI Agent Icon | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1109 | Alberta Diesel Day Email - ShopView.html | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1110 | Alberta Diesel Day Marketing Email | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1111 | Business Cards.html | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1112 | Business Cards | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1113 | Dark Theme Reference.html | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1114 | Two-tier semantic tokens, light + dark reference | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1115 | Design md page | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1116 | Filters -standalone source-.html | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1117 | Filters V2.html | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1118 | Global Search Page.html | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1119 | Global Search Page | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1120 | Mobile Work Orders.html | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1121 | Mobile Work Orders | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1122 | Default and with inline time clock | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1123 | Lucide 0.469 — vendored 24×24 outline set | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1124 | All logo and symbol variants | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1125 | Headers, footers and composed modal variants — light + dark | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1126 | Arrow positions, supporting text, interactive demo — light + dark | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1127 | Global Search | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1128 | 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1129 | 'Inter Display', 'Inter', system-ui, sans-serif | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1130 | ui-monospace, 'SF Mono', Menlo, Consolas, monospace | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1131 | Root Dark | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1132 | SF Mono | _ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/_ds_ma | design-system library (_ds): text no DVI V2 board shows (no board uses a bundle component) |
| 1133 | cd dc-runtime && bun run build | design_handoff_dvi_v2/support.js:1 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1134 | dc-runtime: window.React is not available yet | design_handoff_dvi_v2/support.js:11 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1135 | — exports: | design_handoff_dvi_v2/support.js:1234 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1136 | [dc-runtime] x-import: FAILED to load | design_handoff_dvi_v2/support.js:1247 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1137 | no export named " | design_handoff_dvi_v2/support.js:1267 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1138 | " (has: | design_handoff_dvi_v2/support.js:1267 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1139 | loaded but has no component named | design_handoff_dvi_v2/support.js:1272 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1140 | — available exports: | design_handoff_dvi_v2/support.js:1274 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1141 | }` or set `window. | design_handoff_dvi_v2/support.js:1278 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1142 | never appeared on window after | design_handoff_dvi_v2/support.js:1299 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1143 | loaded but no custom element | design_handoff_dvi_v2/support.js:1333 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1144 | is registered and window. | design_handoff_dvi_v2/support.js:1335 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1145 | is not a function — rendering < | design_handoff_dvi_v2/support.js:1335 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1146 | > as an unknown element. | design_handoff_dvi_v2/support.js:1335 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1147 | not all | design_handoff_dvi_v2/support.js:1461 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1148 | !important | design_handoff_dvi_v2/support.js:1565 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1149 | dc-runtime: window.ReactDOM is not available yet | design_handoff_dvi_v2/support.js:16 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1150 | [dc-runtime] sibling fetch for " | design_handoff_dvi_v2/support.js:1654 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1151 | " failed: | design_handoff_dvi_v2/support.js:1654 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1152 | — the reference renders as an empty placeholder. | design_handoff_dvi_v2/support.js:1658 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1153 | block — not a Design Component. | design_handoff_dvi_v2/support.js:1670 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1154 | " threw: | design_handoff_dvi_v2/support.js:1680 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1155 | [dc-runtime] template compile FAILED for | design_handoff_dvi_v2/support.js:1697 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1156 | class Component extends DCLogic | design_handoff_dvi_v2/support.js:1708 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1157 | must define `class Component extends DCLogic` | design_handoff_dvi_v2/support.js:1708 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1158 | [dc-runtime] logic class eval FAILED for | design_handoff_dvi_v2/support.js:1716 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1159 | — the template renders with props only. | design_handoff_dvi_v2/support.js:1718 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1160 | the open page | design_handoff_dvi_v2/support.js:1880 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1161 | [dc] failed to load React or boot: | design_handoff_dvi_v2/support.js:1908 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1162 | )/gi, " | design_handoff_dvi_v2/support.js:377 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1163 | /gi, " | design_handoff_dvi_v2/support.js:378 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1164 | }} never resolved — rendered as empty | design_handoff_dvi_v2/support.js:593 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1165 | sc-for list=" | design_handoff_dvi_v2/support.js:624 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1166 | " is not an array ( | design_handoff_dvi_v2/support.js:624 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1167 | x-import `from` cannot contain {…} — module URLs are resolved at parse time; use a literal URL | design_handoff_dvi_v2/support.js:733 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1168 | script style textarea option title select canvas iframe video audio | design_handoff_dvi_v2/support.js:782 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1169 | s successful construct can | design_handoff_dvi_v2/support.js:911 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1170 | [dc-runtime] render error in < | design_handoff_dvi_v2/support.js:933 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1171 | exactly for WebKit and | doc-page.js:167 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1172 | Helvetica Neue | doc-page.js:190 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1173 | s geometry is the design | doc-page.js:273 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1174 | s @page geometry and text-wrap defaults can | doc-page.js:399 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1175 | :scope > .page | doc-page.js:537 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1176 | …one page's design… | doc-page.js:54 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1177 | Print headers and footers | doc-page.js:556 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1178 | s sync can never delete the owner | doc-page.js:640 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1179 | :scope > [slot="header"] | doc-page.js:737 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1180 | :scope > [slot="footer"] | doc-page.js:738 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1181 | …body… | doc-page.js:77 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1182 | break-inside: * avoid | doc-page.js:81 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
| 1183 | orphans/ * widows: 3 | doc-page.js:82 | support.js/doc-page.js design-tool runtime: text no DVI V2 board shows (no board uses a bundle component) |
