# Part Lifecycle — design text inventory and triage, 13 Oct 2026 (Rule 124 as amended 9 Oct)

The design is a canvas of board images, so the inventory is the hand transcription of every board (8 Oct transcript for the 40 unchanged boards, identical bytes; the 13 Oct reading of the 7 changed or new boards) plus the visible text of the 5 Before boards. Every distinct quoted string was compared with every new case (preconditions, steps, results, quotes and both parts of its setup doc). Rows classified on 8 Oct keep that class where the string is identical.

Totals: {'DATA': 351, 'IN A CASE': 198, 'OUT-OF-SCOPE': 85, 'COVERED': 10, 'COVERED via template': 10, 'SUPERSEDED': 2, 'NOT DESIGN TEXT': 7}. Unclassified: 0. CASE-NEEDED: 0. SPEC-CONFLICT: 0 (the 8 Oct design-vs-PRD conflicts are resolved in the 13 Oct boards; see sources/design-2026-10-13-artifact/DESIGN-CHANGES-2026-10-13.md).

| Design text | Where | Class |
|---|---|---|
| deactivated / reason: superseded by n6801-06-04x | 3.8 Finding it in Part History — retire-08-p3-8-history-sear | COVERED via template — "Deactivated | Reason: …" in 8 cases (e.g. C154763, C154792) |
| description updated / original description: fuel filter, mack/volvo / new description: fuel filter, mack/volvo | 2.4 Part History at Heavy Duty — correct-04-p2-4-history-her | COVERED via template — "Description updated | Original description: … | New description: …" and "Part number updated | …" with "| Changed at: {Location-A}" at other locations (C425610, C425611, C154798, C425774, C425775) |
| part number updated / original number: ff5507 / new number: ff5507a | 2.4 Part History at Heavy Duty — correct-04-p2-4-history-her | COVERED via template — "Description updated | Original description: … | New description: …" and "Part number updated | …" with "| Changed at: {Location-A}" at other locations (C425610, C425611, C154798, C425774, C425775) |
| part number updated / original number: ff5507a / new number: ff5507 | 2.4 Part History at Heavy Duty — correct-04-p2-4-history-her | COVERED via template — "Description updated | Original description: … | New description: …" and "Part number updated | …" with "| Changed at: {Location-A}" at other locations (C425610, C425611, C154798, C425774, C425775) |
| description updated / original description: fuel filter, mack/volvo / new description: fuel filter, mack/volvo | 2.6 Part History at Lethbridge — correct-06-p2-6-history-oth | COVERED via template — "Description updated | Original description: … | New description: …" and "Part number updated | …" with "| Changed at: {Location-A}" at other locations (C425610, C425611, C154798, C425774, C425775) |
| part number updated / original number: ff5507 / new number: ff5507a / changed at: staging heavy duty - 9919 | 2.6 Part History at Lethbridge — correct-06-p2-6-history-oth | COVERED via template — "Description updated | Original description: … | New description: …" and "Part number updated | …" with "| Changed at: {Location-A}" at other locations (C425610, C425611, C154798, C425774, C425775) |
| part number updated / original number: ff5507a / new number: ff5507 / changed at: staging heavy duty - 9919 | 2.6 Part History at Lethbridge — correct-06-p2-6-history-oth | COVERED via template — "Description updated | Original description: … | New description: …" and "Part number updated | …" with "| Changed at: {Location-A}" at other locations (C425610, C425611, C154798, C425774, C425775) |
| / changed at: staging heavy duty - 9919 | 2.6 Part History at Lethbridge — correct-06-p2-6-history-oth | COVERED via template — "Description updated | Original description: … | New description: …" and "Part number updated | …" with "| Changed at: {Location-A}" at other locations (C425610, C425611, C154798, C425774, C425775) |
| description updated / original description: … / new description: … / changed at: staging heavy duty - 9919 | 13 Oct changed boards | COVERED via template — "Description updated | Original description: … | New description: …" and "Part number updated | …" with "| Changed at: {Location-A}" at other locations (C425610, C425611, C154798, C425774, C425775) |
| part number updated / original number: … / new number: … / changed at: staging heavy duty - 9919 | 13 Oct changed boards | COVERED via template — "Description updated | Original description: … | New description: …" and "Part number updated | …" with "| Changed at: {Location-A}" at other locations (C425610, C425611, C154798, C425774, C425775) |
| category is a required field | 1.2 Save with nothing filled — create-02-p1-2-required.png | COVERED — C154779 Step 2 notes the existing Category and Cost messages (design board 1.2) |
| cost is a required field | 1.2 Save with nothing filled — create-02-p1-2-required.png | COVERED — C154779 Step 2 notes the existing Category and Cost messages (design board 1.2) |
| count changes available: 200 | 13 Oct changed boards, 13 Oct changed boards (read from the  | COVERED — C425600 (cycle count mode); 200 is the existing limit shown on board 5.7 |
| these parts are inactive and were not added: greasetube. | 13 Oct changed boards, 13 Oct changed boards (read from the  | COVERED — C425730, C425731 ("These parts are inactive and were not added: {Part-A}.") |
| f40010212 already exists at this location. | 1.5 The same number again, in lower case — create-05-p1-5-du | COVERED — S7-N3 (C-09, C-11, C-13) |
| part created. linked to f40010212 in the part library. its description | 1.4 Saved and linked to the Part Library entry — create-04-p | COVERED — S7-R9 toast (C154777, A-34), number as placeholder |
| greasetube is inactive. activate it from the inactive tab to use it. | 6.3 Typing the retired number in full — daily-03-p6-7-specia | COVERED — S9-R16/R17 (D-02, D-03, D-04, D-15 …) |
| 630 records selected. | 4.9 Branch: more than 200 ticked — bulk-09-p4-10-cap.png | COVERED — design-only count line (C154757, A-10, A-12) |
| stock, cost of goods and quickbooks… | 4.7 Confirm the reactivation — bulk-07-p4-7-activate-confirm | COVERED — the full reactivation sentence is in C154795, C425761 (the board text is cut off) |
| superseded by n6801-06-04x | 3.3 Save asks first — retire-03-p3-3-confirm.png, 3.8 Findin | COVERED — the note text of S10-R17 cases (example data) |
| fuel filter | Part Lifecycle design — board transcript (2026-10-08 artifac | DATA — example record value |
| #04 bspp replacement o-ri | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| #04 - #12 steel npt jump siz | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| #04 nexus sae100r5 3/16 | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| #06 male jic x 14mm metric | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| #06 male orfs x 3/8 | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| #08 n1 crimp coupling x #1 | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| #10 male jic x #08 male bspp / | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| #16 c62 o-ring flange bloc | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| #16 male jic x 1-1/4 | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| hd-hose & fittings | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| 90d buna r | 1.2 Save with nothing filled — create-02-p1-2-required.png | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| slack adjuster left | 1.3 Number and description typed — create-03-p1-3-filled.png | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| hd-air brakes & air suspension | 1.3 Number and description typed — create-03-p1-3-filled.png | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| #04 bspp replacement o-ring | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| #06 male jic x 14mm metric banjo | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| #10 male jic x #08 male bspp adj. port 90° | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| #16 c62 o-ring flange block kit x 1 | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| slack adjuster | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| id x 0.116 | 1.6 Branch: a new part with tracking off — create-06-p1-6-un | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| shop rags, box of 50 | 1.6 Branch: a new part with tracking off — create-06-p1-6-un | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| fuel filter, mack/volvo | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| willoughby mechanical services | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| h2c | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| #06 male jic x #04 male orb | 3.1 Part Status in the dialog — retire-01-p3-1-dialog-active | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| #06 male jic x #04 male orb 90 | 3.1 Part Status in the dialog — retire-01-p3-1-dialog-active | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| n6801-06-04 #06 male jic x #04 male orb 90 | 3.3 Save asks first — retire-03-p3-3-confirm.png, 3.7 Bringi | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| back-up light, 20-diode led, 6 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| marker light, 12 diode led 2 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| 1893 light bulb | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| 19 series, led, amber, 1 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| 2-wire pigtail, right angle pl-10 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| pb5 | 4.2 Mode on — bulk-02-p4-2-mode-on.png, 4.3 Two rows ticked  | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| rectangle, bullseye, red, | 4.3 Two rows ticked — bulk-03-p4-3-ticked.png | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| flat hook winch strap hivis 4 | 5.1 The Inventory Tracking section — tracking-00-p5-1-toolti | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| meadowbrook truck & trailer repair | 5.1 The Inventory Tracking section — tracking-00-p5-1-toolti | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| hd-truck accessories | 5.1 The Inventory Tracking section — tracking-00-p5-1-toolti | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| aluminum, white | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| hd-trailer comp | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| cargo bar holder | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| delta ring winch strap 4 | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| double l sliding winch (49207137, 1795) | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| flat hook winch strap - hd 4 | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| slider winch wilson track (4970610) | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| slip hook w/latch g70 1/2 | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| slip hook w/latch g70 3/8 | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| slip hook w/latch g70 5/16 | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| winch bar standard black | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| cameron johnston | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| quis tempore molestiae neque velit dolorum aliquam. repudiandae adipisci cum nulla inventore ut. | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| bill fleming | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| 2023 ford f-750 795 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| repair - top right side front of box | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| corner bent in underneath upper light. can see into box. | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| ep2 grease tube, 390g | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| steering shaft | 6.4 A canned job that holds it — daily-04-p6-1-canned-pick.p | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| replace - steering shaft u joints | 6.4 A canned job that holds it — daily-04-p6-1-canned-pick.p | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| cameron johnston × | 6.4 A canned job that holds it — daily-04-p6-1-canned-pick.p | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| david combs | 6.5 The canned job leaves it out — daily-05-p6-2-canned-warn | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| cushioned tube support | 6.6 Vendor return: still offered, tagged — daily-06-p6-4-ret | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| cushioned tube support (0.38 | 6.6 Vendor return: still offered, tagged — daily-06-p6-4-ret | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| ignition coil | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| reverse switch | 7.1 Part Library — library-01-p7-1-library.png, PartLibraryB | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| drivers seatbelt buckle | 7.1 Part Library — library-01-p7-1-library.png, PartLibraryB | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| hd-body interior | 7.1 Part Library — library-01-p7-1-library.png, PartLibraryB | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| push pull valve, 4 way | 7.1 Part Library — library-01-p7-1-library.png | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| fiberglass repair kit | 7.1 Part Library — library-01-p7-1-library.png | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| reinforcement strap | 7.1 Part Library — library-01-p7-1-library.png | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| 20mm gr8 blk crs nut | 7.1 Part Library — library-01-p7-1-library.png | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| double ended stud | 7.1 Part Library — library-01-p7-1-library.png, PartLibraryB | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| m50 | 7.1 Part Library — library-01-p7-1-library.png | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| w40 | 7.1 Part Library — library-01-p7-1-library.png | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| hd-wheel comp | 7.1 Part Library — library-01-p7-1-library.png, PartLibraryB | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| 10jic f 90deg #10 hose ftg | 7.1 Part Library — library-01-p7-1-library.png | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| oxford white paint | 7.1 Part Library — library-01-p7-1-library.png | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| glob-star gall | 7.1 Part Library — library-01-p7-1-library.png | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| engine oil filter, cummins 6bt | 7.1 Part Library — library-01-p7-1-library.png, LookupBefore | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| wiper motor | 7.1 Part Library — library-01-p7-1-library.png | DATA — example record value (part, description, person, vendor, location, vehicle, note) |
| buna r | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value or cut-off bin chip from a build screenshot |
| rectangular light base, 1 wire | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — example record value or cut-off bin chip from a build screenshot |
| vid1/ | 4.9 Branch: more than 200 ticked — bulk-09-p4-10-cap.png | DATA — example record value or cut-off bin chip from a build screenshot |
| butautas' truck & tr... | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| grand haven diesel ... | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| st20 / 1 | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| st20bin / 5 | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| vid1a / 1 | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| shop / 7 | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| muhlenberg park tr... | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| vid1e / 10 | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| vid1a / 6 | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| ⓘ | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| willoughby mechani... | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| h2c / 3 | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| ⊗ | 2.3 Saved: the list shows the new values — correct-03-p2-3-l | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| vid1g / 4 | 3.1 Part Status in the dialog — retire-01-p3-1-dialog-active | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| …dowbrook truck... | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| pb5 / 4 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| 571.mk19b1 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| 43850 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| pb5 / 5 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.5 Do | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| st24bin3 / | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.5 Do | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| bbin / 6 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.5 Do | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| pb5 / 3 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.5 Do | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| a3b / 6 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.5 Do | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| st24 | 4.2 Mode on — bulk-02-p4-2-mode-on.png, 4.3 Two rows ticked  | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| bbin | 4.2 Mode on — bulk-02-p4-2-mode-on.png, 4.3 Two rows ticked  | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| a3b | 4.2 Mode on — bulk-02-p4-2-mode-on.png, 4.8 Branch: the menu | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| and 571.ld26r13 | 4.3 Two rows ticked — bulk-03-p4-3-ticked.png | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| and ☑ | 4.7 Confirm the reactivation — bulk-07-p4-7-activate-confirm | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| ; footer | 4.7 Confirm the reactivation — bulk-07-p4-7-activate-confirm | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| st20 | 4.9 Branch: more than 200 ticked — bulk-09-p4-10-cap.png | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| shof | 4.9 Branch: more than 200 ticked — bulk-09-p4-10-cap.png | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| mzh1c / 10 | 5.1 The Inventory Tracking section — tracking-00-p5-1-toolti | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| mzi1b 1 | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| mzh1c 1 | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| mzh1c 2 | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| replace - s… | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| excessive pl… | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| e1c / 78 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| replace - rear bumper step / rear metal floor | 6.5 The canned job leaves it out — daily-05-p6-2-canned-warn | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| multiple cracks in step, crossmember cracked and rusted through. | 6.5 The canned job leaves it out — daily-05-p6-2-canned-warn | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| 0.00 / 20.00 | 6.5 The canned job leaves it out — daily-05-p6-2-canned-warn | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| excessive play / worn | 6.5 The canned job leaves it out — daily-05-p6-2-canned-warn | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| 0.00 / 2.00 | 6.5 The canned job leaves it out — daily-05-p6-2-canned-warn | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| ! | 6.5 The canned job leaves it out — daily-05-p6-2-canned-warn | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| restocking f… | 6.6 Vendor return: still offered, tagged — daily-06-p6-4-ret | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| unassigned / 0 | 6.6 Vendor return: still offered, tagged — daily-06-p6-4-ret | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| screw hole) for 5/8 | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| $62.40 | 7.2 An entry opens its detail page — library-02-p7-2-entry-d | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| $111.43 | 7.2 An entry opens its detail page — library-02-p7-2-entry-d | DATA — example record value, bin chip, amount, date, cut-off text or an icon glyph from a build screenshot |
| shophub | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — record identifier, number or location name |
| schedule | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — record identifier, number or location name |
| 3.50-3.82 | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — record identifier, number or location name |
| 1-1/4 | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — record identifier, number or location name |
| 1-1/8 | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — record identifier, number or location name |
| 1.475 | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — record identifier, number or location name |
| n60012-920 | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — record identifier, number or location name |
| f40010212 | 1.3 Number and description typed — create-03-p1-3-filled.png | DATA — record identifier, number or location name |
| $ 45.00 | 1.3 Number and description typed — create-03-p1-3-filled.png | DATA — record identifier, number or location name |
| nbor-04 | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — record identifier, number or location name |
| 4--flt3030lcb20 | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — record identifier, number or location name |
| ), 1/2 | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — record identifier, number or location name |
| 4--n66-hyd003 | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — record identifier, number or location name |
| n3069-06-14 | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — record identifier, number or location name |
| n63550-08-12 | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — record identifier, number or location name |
| n9059-10-08 | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — record identifier, number or location name |
| 1616-20-20 | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — record identifier, number or location name |
| n5404-20-20 | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — record identifier, number or location name |
| $ 81.82 | 1.5 The same number again, in lower case — create-05-p1-5-du | DATA — record identifier, number or location name |
| rag-50 | 1.6 Branch: a new part with tracking off — create-06-p1-6-un | DATA — record identifier, number or location name |
| $ 22.35 | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | DATA — record identifier, number or location name |
| $ 40.64 | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | DATA — record identifier, number or location name |
| $ 0.00 | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | DATA — record identifier, number or location name |
| ff5507a | 2.2 Both fields edited — correct-02-p2-2-warnings.png, 2.3 S | DATA — record identifier, number or location name |
| bf7814 | 2.3 Saved: the list shows the new values — correct-03-p2-3-l | DATA — record identifier, number or location name |
| p550529 | 2.3 Saved: the list shows the new values — correct-03-p2-3-l | DATA — record identifier, number or location name |
| 33721 | 2.3 Saved: the list shows the new values — correct-03-p2-3-l | DATA — record identifier, number or location name |
| n6801-06-04 | 3.1 Part Status in the dialog — retire-01-p3-1-dialog-active | DATA — record identifier, number or location name |
| butautas' truck & trailer repair llc | 3.1 Part Status in the dialog — retire-01-p3-1-dialog-active | DATA — record identifier, number or location name |
| $ 1.14 | 3.1 Part Status in the dialog — retire-01-p3-1-dialog-active | DATA — record identifier, number or location name |
| $ 2.37 | 3.1 Part Status in the dialog — retire-01-p3-1-dialog-active | DATA — record identifier, number or location name |
| vid1g | 3.1 Part Status in the dialog — retire-01-p3-1-dialog-active | DATA — record identifier, number or location name |
| 571. | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — record identifier, number or location name |
| 571.ld26r13 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — record identifier, number or location name |
| 19726 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — record identifier, number or location name |
| 2--571.lb1893 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — record identifier, number or location name |
| 571.lb1893 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — record identifier, number or location name |
| 19350y | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — record identifier, number or location name |
| 571.ld191a4 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — record identifier, number or location name |
| 2-1/2 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — record identifier, number or location name |
| 571.pt117 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — record identifier, number or location name |
| 94902 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — record identifier, number or location name |
| x 4 | 4.3 Two rows ticked — bulk-03-p4-3-ticked.png, 4.4 Confirm — | DATA — record identifier, number or location name |
| x4 | 4.4 Confirm — bulk-04-p4-4-confirm.png | DATA — record identifier, number or location name |
| 571.ld11r7 | 4.4 Confirm — bulk-04-p4-4-confirm.png | DATA — record identifier, number or location name |
| 630 | 4.9 Branch: more than 200 ticked — bulk-09-p4-10-cap.png | DATA — record identifier, number or location name |
| 573.d430fh-hv | 5.1 The Inventory Tracking section — tracking-00-p5-1-toolti | DATA — record identifier, number or location name |
| $ 19.52 | 5.1 The Inventory Tracking section — tracking-00-p5-1-toolti | DATA — record identifier, number or location name |
| $ 37.54 | 5.1 The Inventory Tracking section — tracking-00-p5-1-toolti | DATA — record identifier, number or location name |
| mzh1c | 5.1 The Inventory Tracking section — tracking-00-p5-1-toolti | DATA — record identifier, number or location name |
| 573. | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — record identifier, number or location name |
| 1/4 | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — record identifier, number or location name |
| 573.v1224w-5oe | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — record identifier, number or location name |
| 573.hcbh1 | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — record identifier, number or location name |
| 573.fw6 | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — record identifier, number or location name |
| 573.fw7 | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — record identifier, number or location name |
| 573.gwb3 | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — record identifier, number or location name |
| s2-9647 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| 0% | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| colesville diesel repair | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| 289-319-1746 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| authorizer | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| 838930 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| engine | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| 6.7 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| stats | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| name/description | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| actual/estimate | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| margin | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| 0.00 / 3.00 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| decline | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| $149.95 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| 100% | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| $449.85 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| labor | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| $3358.04 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| $2999 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| $70.88 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| $13.62 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| 45% | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| $108.96 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| $7.14 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| 50% | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| $57.12 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| $15.26 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| 49% | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| $122.08 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| $299.9 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — record identifier, number or location name |
| x1/8 | 6.5 The canned job leaves it out — daily-05-p6-2-canned-warn | DATA — record identifier, number or location name |
| n79l-063 | 6.6 Vendor return: still offered, tagged — daily-06-p6-4-ret | DATA — record identifier, number or location name |
| paid | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | DATA — record identifier, number or location name |
| $1.25 | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | DATA — record identifier, number or location name |
| $88.67 | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | DATA — record identifier, number or location name |
| subtotal | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | DATA — record identifier, number or location name |
| $4.43 | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | DATA — record identifier, number or location name |
| 10/02/2026 | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | DATA — record identifier, number or location name |
| outcome | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | DATA — record identifier, number or location name |
| gn10638 | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | DATA — record identifier, number or location name |
| $87.42 | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | DATA — record identifier, number or location name |
| 21-361 | 7.1 Part Library — library-01-p7-1-library.png | DATA — record identifier, number or location name |
| 3711355c93 | 7.1 Part Library — library-01-p7-1-library.png | DATA — record identifier, number or location name |
| 170.v8ap | 7.1 Part Library — library-01-p7-1-library.png | DATA — record identifier, number or location name |
| 100637 | 7.1 Part Library — library-01-p7-1-library.png | DATA — record identifier, number or location name |
| 08-02564 | 7.1 Part Library — library-01-p7-1-library.png | DATA — record identifier, number or location name |
| zhnm8bc-20 | 7.1 Part Library — library-01-p7-1-library.png | DATA — record identifier, number or location name |
| 201.7003r | 7.1 Part Library — library-01-p7-1-library.png | DATA — record identifier, number or location name |
| r005559r | 7.1 Part Library — library-01-p7-1-library.png | DATA — record identifier, number or location name |
| rr5-10fjb10 | 7.1 Part Library — library-01-p7-1-library.png | DATA — record identifier, number or location name |
| lf3349 | 7.1 Part Library — library-01-p7-1-library.png, LookupBefore | DATA — record identifier, number or location name |
| p558615 | 7.1 Part Library — library-01-p7-1-library.png | DATA — record identifier, number or location name |
| 51607 | 7.1 Part Library — library-01-p7-1-library.png | DATA — record identifier, number or location name |
| upgra... | 7.1 Part Library — library-01-p7-1-library.png, PartLibraryB | DATA — record identifier, number or location name |
| wm*854 | 7.1 Part Library — library-01-p7-1-library.png | DATA — record identifier, number or location name |
| staging lethbridge ... | 7.2 An entry opens its detail page — library-02-p7-2-entry-d | DATA — record identifier, number or location name |
| artboards | Part Lifecycle design — board transcript (2026-10-08 artifac | DATA — transcript heading |
| …y | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| · bin pill | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| …e & fittings | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| (30/30 long stroke spring e | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| brakes & air s... | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| (ss hose clamp (2-1/16 | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| …ipment & hyd... | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| 90d buna replacement ... | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| · (no tag) · | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| (30/30 long stroke spring brake chamb... | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| hd-air brakes & air s... | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| · · | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| #04 - #12 steel npt jump size hyd adapt... | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| hd-equipment & hyd... | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| · tag pill | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| #08 n1 crimp coupling x #12 female orf... | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| male npt straig... | 1.4 Saved and linked to the Part Library entry — create-04-p | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| …ers | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| bf7814 ⊗ | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| p550529 ⊗ | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| 33721 ⊗ | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| 20972295 ⊗ | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| fuel filter, mack/.. | 2.4 Part History at Heavy Duty — correct-04-p2-4-history-her | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| oct 2, 2026 | 2.4 Part History at Heavy Duty — correct-04-p2-4-history-her | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| 04:06 pm | 2.4 Part History at Heavy Duty — correct-04-p2-4-history-her | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| 02:36 pm | 2.4 Part History at Heavy Duty — correct-04-p2-4-history-her | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| 02:35 pm | 2.4 Part History at Heavy Duty — correct-04-p2-4-history-her | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| vendo… | 3.3 Save asks first — retire-03-p3-3-confirm.png | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| buta… | 3.3 Save asks first — retire-03-p3-3-confirm.png | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| categ… | 3.3 Save asks first — retire-03-p3-3-confirm.png, 3.7 Bringi | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| hd-… | 3.3 Save asks first — retire-03-p3-3-confirm.png, 3.7 Bringi | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| man… | 3.3 Save asks first — retire-03-p3-3-confirm.png, 3.7 Bringi | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| avera… | 3.3 Save asks first — retire-03-p3-3-confirm.png, 3.7 Bringi | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| $ 1.1… | 3.3 Save asks first — retire-03-p3-3-confirm.png, 3.7 Bringi | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| inven… | 3.3 Save asks first — retire-03-p3-3-confirm.png, 3.7 Bringi | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| #06 male jic x #04.. | 3.8 Finding it in Part History — retire-08-p3-8-history-sear | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| 04:07 pm | 3.8 Finding it in Part History — retire-08-p3-8-history-sear | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| 02:14 pm | 3.8 Finding it in Part History — retire-08-p3-8-history-sear | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| 01:54 pm | 3.8 Finding it in Part History — retire-08-p3-8-history-sear | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| 01:47 pm | 3.8 Finding it in Part History — retire-08-p3-8-history-sear | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| 01:46 pm | 3.8 Finding it in Part History — retire-08-p3-8-history-sear | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| 01:27 pm | 3.8 Finding it in Part History — retire-08-p3-8-history-sear | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| manuf… | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| …lor | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| (cut by menu) · | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| rectangle, b... | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| hd-lighting & electric... | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| meadowbrook truck... | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| rectangular, 4 dio... | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| · tags | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| · tag | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| bin lo… | 4.2 Mode on — bulk-02-p4-2-mode-on.png, 4.3 Two rows ticked  | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| led marker light reflex (1052, g1... | 4.4 Confirm — bulk-04-p4-4-confirm.png | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| manufactu… | 4.8 Branch: the menu while the mode is on — bulk-08-p4-9-men | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| flat hook winch strap hiv… | 5.1 The Inventory Tracking section — tracking-00-p5-1-toolti | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| …k accessories | 5.1 The Inventory Tracking section — tracking-00-p5-1-toolti | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| · (no tags) · | 5.3 The list says Not Tracked — tracking-02-p5-3-list-not-tr | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| (light grey text) · | 5.3 The list says Not Tracked — tracking-02-p5-3-list-not-tr | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| flat hook winch st.. | 5.5 Part History — tracking-04-p5-4-history.png | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| 04:08 pm | 5.5 Part History — tracking-04-p5-4-history.png | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| 02:03 pm | 5.5 Part History — tracking-04-p5-4-history.png | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| 01:55 pm | 5.5 Part History — tracking-04-p5-4-history.png | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| · orange badge | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| · orange | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| · (no bin) · green | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| (grey text, no badge) · | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| started: aug 28, 2025 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| total hours: 25.0 hrs | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| + add pa… | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| descriptio… | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| save… | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| $ sell price * | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| replace - f… | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| multiple cra… | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| …pproval | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| david comb… | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| (ws2) wel… | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| …sted | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| (sqt2x4x1/… | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| …ed | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| (sqt2x2x1/… | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| (cps1/8) c… | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| (-) u joint | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| (-) u-joint strap kit (if required) | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| repair - to… | 6.3 Typing the retired number in full — daily-03-p6-7-specia | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| corner bent… | 6.3 Typing the retired number in full — daily-03-p6-7-specia | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| …proval | 6.3 Typing the retired number in full — daily-03-p6-7-specia | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| total hours: 23.0 hrs | 6.4 A canned job that holds it — daily-04-p6-1-canned-pick.p | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| e.g. dot inspection, oil c… | 6.4 A canned job that holds it — daily-04-p6-1-canned-pick.p | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| hd fleet rate : $299.90 | 6.4 A canned job that holds it — daily-04-p6-1-canned-pick.p | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| (ws2) welding supplies | 6.5 The canned job leaves it out — daily-05-p6-2-canned-warn | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| (sqt2x4x1/8) steel square tube, 2 | 6.5 The canned job leaves it out — daily-05-p6-2-canned-warn | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| · pill | 6.5 The canned job leaves it out — daily-05-p6-2-canned-warn | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| (sqt2x2x1/8) steel square tube, 2 | 6.5 The canned job leaves it out — daily-05-p6-2-canned-warn | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| (cps1/8) check plate, steel, 1/8 | 6.5 The canned job leaves it out — daily-05-p6-2-canned-warn | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| n/a | 6.6 Vendor return: still offered, tagged — daily-06-p6-4-ret | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| · grey pill | 6.6 Vendor return: still offered, tagged — daily-06-p6-4-ret | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| · right | 6.6 Vendor return: still offered, tagged — daily-06-p6-4-ret | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| started: may 15, 2026 | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| (16mm)od | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| (cut off at board edge); summary | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| q… | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| subtotal:$88.67 | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| tax: $4.43 | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| total:$93.10 | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| hd-heavy duty brake... | 7.1 Part Library — library-01-p7-1-library.png | DATA — transcription fragment, cut-off text, time/date or a visual descriptor |
| parts lifecycle update | 13 Oct changed boards | NOT DESIGN TEXT — phrase from our own 13 Oct change notes, not from a board |
| needs fixing to match | 13 Oct changed boards | NOT DESIGN TEXT — phrase from our own 13 Oct change notes, not from a board |
| the quantity column reads | 13 Oct changed boards | NOT DESIGN TEXT — phrase from our own 13 Oct change notes, not from a board |
| ; s4-r3 tooltip with the inventory value sentence; | 13 Oct changed boards | NOT DESIGN TEXT — phrase from our own 13 Oct change notes, not from a board |
| saving any untracked part needs delete | 13 Oct changed boards | NOT DESIGN TEXT — phrase from our own 13 Oct change notes, not from a board |
| application/json | 13 Oct changed boards | NOT DESIGN TEXT — phrase from our own 13 Oct change notes, not from a board |
| appifact-doc | 13 Oct changed boards | NOT DESIGN TEXT — phrase from our own 13 Oct change notes, not from a board |
| before · what is on staging today | HistoryBefore.dc.html, LookupBefore.dc.html, PartDialogBefor | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| 16mm fine stover l.. | HistoryBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| zslnm10sf-16 | HistoryBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| hd-fasteners | HistoryBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| sep 15, 2026 | HistoryBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| 03:43 am | HistoryBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| cycle count / bin: a1f / starting qty: 0 / new qty: 2 / qty change: 2 | HistoryBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| part history already records what happened to a part and who did it. | HistoryBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| there is no entry for retiring a part, because retiring a part is not possible. the nearest thing a shop can d | HistoryBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| .brake parts | PartLibraryBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| front brake pad sensor | PartLibraryBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| 2bws0452 | PartLibraryBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| a second place a part can be created. | PartLibraryBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| the dialog a shop opens today when it clicks a row on the inventory list. | PartDialogBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| zzautotest-pkg-1 (zzautotest package part) | PartDialogBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| stillwater diesel repair | LookupBefore.dc.html, PartDialogBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| catalog part is required, and it is the first thing on the screen. | PartDialogBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| there is no status anywhere on this dialog. | PartDialogBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| a part cannot be retired from here, and nothing on the screen suggests retiring is possible at all. | PartDialogBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| min and max sit loose between core charge and tags, | PartDialogBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| with nothing saying what they belong to or when they matter. every part has them, because every part is tracke | PartDialogBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| the destructive action available here is | PartDialogBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| , which removes the part outright. there is no middle option between keeping a part in everyone's way and dele | PartDialogBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| new part request, on a work order | LookupBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| the part number field is the lookup. this is the screen the whole feature is for: everything else exists so th | LookupBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| oil filter | LookupBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| inventory qty: 12 ea | LookupBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| oil filter, spin-on | LookupBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| lf9009 | LookupBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| inventory qty: 4 ea | LookupBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| oil filter, superseded housing | LookupBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| lf9009-a | LookupBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| revere truck and trailer repair | LookupBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| oil filter, obsolete housing | LookupBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| lf9009-old | LookupBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| oil filter wrench, 93mm 36 flute | LookupBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| nofw-93 | LookupBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| everything the shop has ever created is offered. | LookupBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| nothing on a row says the part is dead. | LookupBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| the rest of the dialog, the description, quantity, source, category, vendor, cost, core charge, sell price and | LookupBefore.dc.html | OUT-OF-SCOPE — "Before" board: today's staging screen and the designer's description of it, which the feature replaces (not a requirement) |
| part history at lethbridge | 13 Oct changed boards (read from the images) | OUT-OF-SCOPE — board title, not on-screen text |
| bin location: all bin locations | 1.4 Saved and linked to the Part Library entry — create-04-p | OUT-OF-SCOPE — existing Inventory list filter label the feature does not change |
| manufacturer updated / original manufacturer: - / new manufacturer: - | 5.5 Part History — tracking-04-p5-4-history.png, HistoryBefo | OUT-OF-SCOPE — existing Part History entry type on a build screenshot (board 5.5, staging data); the PRD adds no Manufacturer entry rule. Noted for build verification: an entry from "-" to "-" looks like an existing quirk, not a Part Lifecycle requirement |
| clock in | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| sales & service | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| supply chain | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| over limit | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| lead technician | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| sales representative | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| pinned notes: | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| ibs# | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| lines (3) | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| parts (6) | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| shopcoach analysis | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| more options | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| shopcoach line builder | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| e.g. dot inspection, oil change, check engine light | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| build lines | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| inventory qty: 78 ea | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| shopcoach parts guide | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| lines (2) | 6.4 A canned job that holds it — daily-04-p6-1-canned-pick.p | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| parts (4) | 6.4 A canned job that holds it — daily-04-p6-1-canned-pick.p | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| add technician | 6.4 A canned job that holds it — daily-04-p6-1-canned-pick.p | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| labor rate | 6.4 A canned job that holds it — daily-04-p6-1-canned-pick.p | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| estimated time | 6.4 A canned job that holds it — daily-04-p6-1-canned-pick.p | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| save & add part | 6.4 A canned job that holds it — daily-04-p6-1-canned-pick.p | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| save & add line | 6.4 A canned job that holds it — daily-04-p6-1-canned-pick.p | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| packaging slip | 6.6 Vendor return: still offered, tagged — daily-06-p6-4-ret | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| qty in stock | 6.6 Vendor return: still offered, tagged — daily-06-p6-4-ret | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| restocking fee | 6.6 Vendor return: still offered, tagged — daily-06-p6-4-ret | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| inventory qty: 0 ea | 6.6 Vendor return: still offered, tagged — daily-06-p6-4-ret | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| total restocking fee: | 6.6 Vendor return: still offered, tagged — daily-06-p6-4-ret | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| total: | 6.6 Vendor return: still offered, tagged — daily-06-p6-4-ret | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| parts (2) | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| customer po | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| invoice: | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| financial info | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| credit date | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| issue store credit | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| issue refund | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| payment method | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| qty available for credit | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| remaining quantity | 7.2 An entry opens its detail page — library-02-p7-2-entry-d | OUT-OF-SCOPE — existing ShopView screen text this feature does not change (PRD scope; board 6.0 note: "the rest of the dialog … not touched") |
| quoted | 6.5 The canned job leaves it out — daily-05-p6-2-canned-warn | OUT-OF-SCOPE — existing part status pill |
| tech time | 6.4 A canned job that holds it — daily-04-p6-1-canned-pick.p | OUT-OF-SCOPE — existing work order screen label |
| greasetube is inactive and was not added. | 13 Oct changed boards, 6.5 The canned job leaves it out — da | SUPERSEDED — 8 Oct board 6.5 wording; the 13 Oct board reads "These parts are inactive and were not added: GREASETUBE." (C425730, C425731) |
| total quantity | 13 Oct changed boards, 5.3 The list says Not Tracked — track | SUPERSEDED — 8 Oct board wording; the 13 Oct boards read "Total Qty" (as the PRD and the cases) |
| before | Part Lifecycle design — board transcript (2026-10-08 artifac | IN A CASE |
| … | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| ... | 1.4 Saved and linked to the Part Library entry — create-04-p | IN A CASE |
| staging heavy duty - 9919 | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| work orders | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| customers | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| parts | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| reports | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| search | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| ctrl+k | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| 2 | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| as | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| part sales | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| inventory | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| part library | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| returns | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| purchase orders | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| vendor invoices | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| vendors | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| active | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| inactive | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| supply | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| ⋮ | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| new inventory part | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| description | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| manufacturer | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| vendor | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| bin location / | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| history | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| · | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| - | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| general stora | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| mal | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| × | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| part number | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| category | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| cost | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| sell price | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| core charge | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| inventory tracking | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| track quantities and cost of goods | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| min | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| max | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| tags | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| bin location | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| general storage | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| quantity | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| 0 | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| default | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| + add bin location | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| cancel | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| save | 1.1 New Inventory Part opens — create-01-p1-1-new-empty.png, | IN A CASE |
| description is a required field | 1.2 Save with nothing filled — create-02-p1-2-required.png | IN A CASE |
| part number is a required field | 1.2 Save with nothing filled — create-02-p1-2-required.png | IN A CASE |
| $ | 1.3 Number and description typed — create-03-p1-3-filled.png | IN A CASE |
| category: all categories | 1.4 Saved and linked to the Part Library entry — create-04-p | IN A CASE |
| was kept. | 1.4 Saved and linked to the Part Library entry — create-04-p | IN A CASE |
| close | 1.4 Saved and linked to the Part Library entry — create-04-p | IN A CASE |
| please try to resolve this. | 1.5 The same number again, in lower case — create-05-p1-5-du | IN A CASE |
| and | 1.6 Branch: a new part with tracking off — create-06-p1-6-un | IN A CASE |
| ff5507 | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | IN A CASE |
| edit inventory part | 13 Oct changed boards (read from the images), 2.1 The part a | IN A CASE |
| i | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | IN A CASE |
| filter | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | IN A CASE |
| part status | 13 Oct changed boards (read from the images), 2.1 The part a | IN A CASE |
| hd-filters | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | IN A CASE |
| average cost | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | IN A CASE |
| 1 | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | IN A CASE |
| 3 | 2.1 The part as it stands — correct-01-p2-1-edit-open.png, 2 | IN A CASE |
| delete part | 13 Oct changed boards (read from the images), 2.1 The part a | IN A CASE |
| this also changes the description at 1 other location. | 2.2 Both fields edited — correct-02-p2-2-warnings.png | IN A CASE |
| this also changes the part number at 1 other location. | 2.2 Both fields edited — correct-02-p2-2-warnings.png | IN A CASE |
| 1 other location | 2.2 Both fields edited — correct-02-p2-2-warnings.png | IN A CASE |
| part details | 2.4 Part History at Heavy Duty — correct-04-p2-4-history-her | IN A CASE |
| measurement | 2.4 Part History at Heavy Duty — correct-04-p2-4-history-her | IN A CASE |
| ea | 2.4 Part History at Heavy Duty — correct-04-p2-4-history-her | IN A CASE |
| part history | 2.4 Part History at Heavy Duty — correct-04-p2-4-history-her | IN A CASE |
| staff | 13 Oct changed boards (read from the images), 2.4 Part Histo | IN A CASE |
| date | 13 Oct changed boards (read from the images), 2.4 Part Histo | IN A CASE |
| time | 13 Oct changed boards (read from the images), 2.4 Part Histo | IN A CASE |
| event | 13 Oct changed boards (read from the images), 2.4 Part Histo | IN A CASE |
| admin shopview | 2.4 Part History at Heavy Duty — correct-04-p2-4-history-her | IN A CASE |
| staging lethbridge - 4310 | 2.5 Lethbridge: renamed there too — correct-05-p2-5-list-oth | IN A CASE |
| changed at | 13 Oct changed boards, 2.6 Part History at Lethbridge — corr | IN A CASE |
| 4 | 3.1 Part Status in the dialog — retire-01-p3-1-dialog-active | IN A CASE |
| deactivate part? | 3.3 Save asks first — retire-03-p3-3-confirm.png | IN A CASE |
| this part won't show up when adding parts to work orders, estimates, part sales or purchase orders. | 3.3 Save asks first — retire-03-p3-3-confirm.png | IN A CASE |
| existing records that use it stay as they are. | 3.3 Save asks first — retire-03-p3-3-confirm.png | IN A CASE |
| stock, cost of goods and quickbooks aren't affected. | 3.3 Save asks first — retire-03-p3-3-confirm.png, 4.4 Confir | IN A CASE |
| note (optional) | 3.3 Save asks first — retire-03-p3-3-confirm.png, 3.7 Bringi | IN A CASE |
| deactivate | 3.3 Save asks first — retire-03-p3-3-confirm.png, 3.7 Bringi | IN A CASE |
| no parts match the search | 3.4 Done — retire-04-p3-4-toast.png | IN A CASE |
| . | 3.4 Done — retire-04-p3-4-toast.png | IN A CASE |
| / | 3.4 Done — retire-04-p3-4-toast.png | IN A CASE |
| part deactivated. | 3.4 Done — retire-04-p3-4-toast.png | IN A CASE |
| activate part? | 3.7 Bringing it back — retire-07-p3-7-activate-confirm.png | IN A CASE |
| this part can be added to new work again. | 3.7 Bringing it back — retire-07-p3-7-activate-confirm.png | IN A CASE |
| activate | 3.7 Bringing it back — retire-07-p3-7-activate-confirm.png,  | IN A CASE |
| superseded | 3.8 Finding it in Part History — retire-08-p3-8-history-sear | IN A CASE |
| deactivated | 3.8 Finding it in Part History — retire-08-p3-8-history-sear | IN A CASE |
| cycle count | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.8 Br | IN A CASE |
| deactivate parts | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.8 Br | IN A CASE |
| export | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.8 Br | IN A CASE |
|  | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.2 Mo | IN A CASE |
| 2.5 | 4.1 The actions menu — bulk-01-p4-1-actions-menu.png, 4.5 Do | IN A CASE |
| selected | 4.2 Mode on — bulk-02-p4-2-mode-on.png, 4.3 Two rows ticked  | IN A CASE |
| 0 selected | 4.2 Mode on — bulk-02-p4-2-mode-on.png, 4.8 Branch: the menu | IN A CASE |
| 2 records selected. | 4.3 Two rows ticked — bulk-03-p4-3-ticked.png, 4.4 Confirm — | IN A CASE |
| − | 4.3 Two rows ticked — bulk-03-p4-3-ticked.png | IN A CASE |
| 2 selected | 4.3 Two rows ticked — bulk-03-p4-3-ticked.png | IN A CASE |
| deactivate parts? | 4.4 Confirm — bulk-04-p4-4-confirm.png | IN A CASE |
| , | 4.4 Confirm — bulk-04-p4-4-confirm.png | IN A CASE |
| 2 parts selected. | 4.4 Confirm — bulk-04-p4-4-confirm.png, 4.7 Confirm the reac | IN A CASE |
| these parts won't show up when adding parts to work orders, estimates, part sales or purchase orders. | 4.4 Confirm — bulk-04-p4-4-confirm.png | IN A CASE |
| existing records that use them stay as they are. | 4.4 Confirm — bulk-04-p4-4-confirm.png, 4.7 Confirm the reac | IN A CASE |
| 2 parts updated. | 4.5 Done — bulk-05-p4-5-result.png | IN A CASE |
| activate parts? | 4.7 Confirm the reactivation — bulk-07-p4-7-activate-confirm | IN A CASE |
| these parts can be added to new work again. | 4.7 Confirm the reactivation — bulk-07-p4-7-activate-confirm | IN A CASE |
| select 200 parts or fewer. | 4.9 Branch: more than 200 ticked — bulk-09-p4-10-cap.png | IN A CASE |
| no inactive parts at this location. | 4.10 Branch: no inactive parts — bulk-10-p4-8-empty-inactive | IN A CASE |
| tracked parts keep a stock count, with min and max. turn this off for items you don't count. | 5.1 The Inventory Tracking section — tracking-00-p5-1-toolti | IN A CASE |
| 10 | 5.1 The Inventory Tracking section — tracking-00-p5-1-toolti | IN A CASE |
| bin location / quantity | 13 Oct changed boards (read from the images), 5.3 The list s | IN A CASE |
| core | 13 Oct changed boards (read from the images), 5.3 The list s | IN A CASE |
| not tracked | 13 Oct changed boards, 13 Oct changed boards (read from the  | IN A CASE |
| tracking turned off | 5.5 Part History — tracking-04-p5-4-history.png | IN A CASE |
| tracking turned on | 5.5 Part History — tracking-04-p5-4-history.png | IN A CASE |
| count | 13 Oct changed boards (read from the images), 5.7 Cycle coun | IN A CASE |
| adjustment | 13 Oct changed boards (read from the images), 5.7 Cycle coun | IN A CASE |
| 12 | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | IN A CASE |
| 1 available | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | IN A CASE |
| 0 available | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | IN A CASE |
| 2 available | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | IN A CASE |
| 5 | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | IN A CASE |
| o | 5.7 Cycle count leaves it out — tracking-06-p5-7-cycle-count | IN A CASE |
| estimate | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| progress | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| service advisor | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| unassigned | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| contact | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| phone | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| title | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| ap | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| none | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| notes | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| finance | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| ai | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| new line | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| status | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| action | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| rate | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| total | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| needs approval | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| approve | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| enter | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| requested | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| $0.00 | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| new part request | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| greasetu | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| greasetube | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| save part | 6.1 While active: GREASETUBE is found — daily-01-p6-3a-looku | IN A CASE |
| no results | 6.2 Once inactive: not offered — daily-02-p6-3-lookup-no-ina | IN A CASE |
| source | 6.2 Once inactive: not offered — daily-02-p6-3-lookup-no-ina | IN A CASE |
| + add part | 6.3 Typing the retired number in full — daily-03-p6-7-specia | IN A CASE |
| total parts: 3 | 6.4 A canned job that holds it — daily-04-p6-1-canned-pick.p | IN A CASE |
| technicians | 6.4 A canned job that holds it — daily-04-p6-1-canned-pick.p | IN A CASE |
| line approved | 6.4 A canned job that holds it — daily-04-p6-1-canned-pick.p | IN A CASE |
| save & close | 6.4 A canned job that holds it — daily-04-p6-1-canned-pick.p | IN A CASE |
| create return | 6.6 Vendor return: still offered, tagged — daily-06-p6-4-ret | IN A CASE |
| qty to return | 6.6 Vendor return: still offered, tagged — daily-06-p6-4-ret | IN A CASE |
| price per unit | 6.6 Vendor return: still offered, tagged — daily-06-p6-4-ret | IN A CASE |
| — | 6.6 Vendor return: still offered, tagged — daily-06-p6-4-ret | IN A CASE |
| save return | 6.6 Vendor return: still offered, tagged — daily-06-p6-4-ret | IN A CASE |
| p2-89 | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | IN A CASE |
| heavy duty - 9919 | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | IN A CASE |
| not available | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | IN A CASE |
| summary | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | IN A CASE |
| item | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | IN A CASE |
| gst | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | IN A CASE |
| issue credit | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | IN A CASE |
| parts are being returned | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | IN A CASE |
| reason | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | IN A CASE |
| parts to return | 6.7 Part sale credit: still offered, tagged — daily-07-p6-6- | IN A CASE |
| manufacturer: all manufacturers | 7.1 Part Library — library-01-p7-1-library.png, PartLibraryB | IN A CASE |
| size | 7.1 Part Library — library-01-p7-1-library.png, PartLibraryB | IN A CASE |
| uncategorized | 7.1 Part Library — library-01-p7-1-library.png, PartDialogBe | IN A CASE |
| total parts | 7.2 An entry opens its detail page — library-02-p7-2-entry-d | IN A CASE |
| workplace | 7.2 An entry opens its detail page — library-02-p7-2-entry-d | IN A CASE |
| 4.00 | 7.2 An entry opens its detail page — library-02-p7-2-entry-d | IN A CASE |
| tracked parts keep a stock count, with min and max. turn this off for items you don't count. untracked parts a | 13 Oct changed boards, 13 Oct changed boards (read from the  | IN A CASE |
| total qty | 13 Oct changed boards, 13 Oct changed boards (read from the  | IN A CASE |
| avg cost | 13 Oct changed boards (read from the images) | IN A CASE |
| catalog | 13 Oct changed boards (read from the images), LookupBefore.d | IN A CASE |
| add bin location | 13 Oct changed boards (read from the images), PartDialogBefo | IN A CASE |
| new catalog part | PartLibraryBefore.dc.html | IN A CASE |
| the blue | PartLibraryBefore.dc.html | IN A CASE |
| catalog part | PartDialogBefore.dc.html | IN A CASE |
| delete | PartDialogBefore.dc.html | IN A CASE |
