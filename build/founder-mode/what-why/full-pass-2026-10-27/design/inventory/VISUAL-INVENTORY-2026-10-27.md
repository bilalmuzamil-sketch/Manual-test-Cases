# What/Why visual inventory, 27 Oct 2026 (Rule 126 point 3)

11 rows from `design_visual_inventory.py` (14 states: 7 boards × 1440/1536, 0 fatal) + 36 hand rows from the board files and the rendered DOM. By class: {'OUT-OF-SCOPE': 14, 'CASE-NEEDED': 30, 'COVERED': 2, 'SPEC-CONFLICT': 1} · **unclassified: 0**

| Id | Source | Board | Element | Attribute | Value | Class | Case / ref | Reason |
|---|---|---|---|---|---|---|---|---|
| V0001 | tool | all boards | frame · board | gap to viewport left / right (px) | 0 / 0 | OUT-OF-SCOPE |  | board canvas background (#8d8d8d grey behind the dialogs, #f4f6f8 behind the text boards): design-tool page, not the product |
| V0002 | tool | all boards | frame · board | inside a card or panel | no | OUT-OF-SCOPE |  | board canvas background (#8d8d8d grey behind the dialogs, #f4f6f8 behind the text boards): design-tool page, not the product |
| V0003 | tool | all boards | frame · board | painted ancestors (inner→outer) | d0 x-dc bg=rgba(0, 0, 0, 0) r=0px pad=0px ; d1 body bg=rgb(141, 141, 141) r=0px pad=0px | OUT-OF-SCOPE |  | board canvas background (#8d8d8d grey behind the dialogs, #f4f6f8 behind the text boards): design-tool page, not the product |
| V0004 | tool | all boards | frame · board | painted ancestors (inner→outer) | d0 x-dc bg=rgba(0, 0, 0, 0) r=0px pad=0px ; d1 body bg=rgb(244, 246, 248) r=0px pad=0px | OUT-OF-SCOPE |  | board canvas background (#8d8d8d grey behind the dialogs, #f4f6f8 behind the text boards): design-tool page, not the product |
| V0005 | tool | all boards | frame · page | body background / theme attribute / page wider than viewport | rgb(141, 141, 141) /  / False | OUT-OF-SCOPE |  | board canvas background (#8d8d8d grey behind the dialogs, #f4f6f8 behind the text boards): design-tool page, not the product |
| V0006 | tool | all boards | frame · page | body background / theme attribute / page wider than viewport | rgb(244, 246, 248) /  / False | OUT-OF-SCOPE |  | board canvas background (#8d8d8d grey behind the dialogs, #f4f6f8 behind the text boards): design-tool page, not the product |
| V0007 | tool | all boards | icon · unnamed svg #f39d1b (1 shapes) | on control · size · colour | (no control) · 16px · rgb(0, 0, 0) | CASE-NEEDED | D-01, D-03, D-06 | 16 px grey line icon (1 shape = down-arrow on the Title picker, Add Technician, Labor Rate, Status; 2 shapes = close X) |
| V0008 | tool | all boards | icon · unnamed svg #p1se0t (2 shapes) | on control · size · colour | (no control) · 16px · rgb(0, 0, 0) | CASE-NEEDED | D-01, D-03, D-06 | 16 px grey line icon (1 shape = down-arrow on the Title picker, Add Technician, Labor Rate, Status; 2 shapes = close X) |
| V0009 | tool | all boards | overlap · text | clipped without ellipsis | none | CASE-NEEDED | D-07..D-10 | no overlap / clipping in any board at 1440 and 1536: carried into the width cases |
| V0010 | tool | all boards | overlap · text | overlapping text pairs | none | CASE-NEEDED | D-07..D-10 | no overlap / clipping in any board at 1440 and 1536: carried into the width cases |
| V0011 | tool | all boards | overlap · text | truncated with ellipsis (by design) | none | CASE-NEEDED | D-07..D-10 | no overlap / clipping in any board at 1440 and 1536: carried into the width cases |
| H001 | hand (board files an | 1.2 | Title picker box | background · bottom line · corners | light grey #d9d9d9 · 2 px dark red #8b0f1d · rounded top only | CASE-NEEDED | D-01 | focused field as drawn (S1-R5 focus on open) |
| H002 | hand (board files an | 1.2 | Title label | position · size · colour | top left inside the box · 10 px · dark red #8b0f1d | CASE-NEEDED | D-01 | S1-R3 label at the top |
| H003 | hand (board files an | 1.2 | Title prompt | text · colour · case | "What are you doing?" · grey #8b95a3 · sentence case | CASE-NEEDED | D-01 | S1-R3; note-case |
| H004 | hand (board files an | 1.2 | Title picker | icon | down-arrow (chevron) at the right, grey #5b6472, 16 px | CASE-NEEDED | D-01 | drawn picker |
| H005 | hand (board files an | 1.2 | Title label | asterisk | none ("Title"; the 13 Oct copy read "Title *") | CASE-NEEDED | D-01 | S1-R1 "with no asterisk"; DV-03 closed |
| H006 | hand (board files an | 1.2 | Description box | border · background · corners | 1 px light grey #c6ccd4 · white · 4 px rounded | CASE-NEEDED | D-02 | as drawn |
| H007 | hand (board files an | 1.2 | Description label / prompt | position · colours | small grey label #7b8595 at top left, prompt grey #8b95a3 underneath | CASE-NEEDED | D-02 | S1-R3 |
| H008 | hand (board files an | 1.2 | Title and Description boxes | width · order | both full dialog width (455 px dialog), Title directly above Description | CASE-NEEDED | D-02, D-03 | S1-R7 order |
| H009 | hand (board files an | 1.2 | Header | elements left to right | "New Line" 17 px bold · purple #9C27B0 "AI" tag (white text) · blue #2276DA capitals "SHOPCOACH LINE BUILDER" · grey X far right | CASE-NEEDED | D-03 | unchanged header |
| H010 | hand (board files an | 1.2 | Technicians | layout | 13 px dark label above an outlined "Add Technician" box with down-arrow | CASE-NEEDED | D-03 | S1-R7 |
| H011 | hand (board files an | 1.2 | Labor row | layout · order | one row: Labor Rate (widest, down-arrow) · Estimated Time · Tech Time; small grey labels at the top | CASE-NEEDED | D-03 | S1-R7 |
| H012 | hand (board files an | 1.2 | Buttons | order · style · alignment | right-aligned: Save & Add Part, Save & Add Line (white, blue 1 px border, blue text) · Save & Close (solid blue, white text) | CASE-NEEDED | D-03 | S1-R7, note 'all three button labels' |
| H013 | hand (board files an | 1.2 | Dialog | frame | white card, 8 px corners, shadow, 455 px wide, over a grey backdrop | CASE-NEEDED | D-03, D-07, D-08 | dialog frame as drawn; backdrop colour is the board's |
| H014 | hand (board files an | 1.5 | Title box (Edit Line) | border · background | 1 px light grey border, white (no grey fill, no red line: no picker in Edit Line) | CASE-NEEDED | D-04 | 1.5 note 2 'no canned-line picker' |
| H015 | hand (board files an | 1.5 | Title label / value | colours | small grey "Title" #7b8595 at top; saved value dark #1d2129, 14 px | CASE-NEEDED | D-04 | S1-R3 filled state |
| H016 | hand (board files an | 1.5 | Description box (empty) | label / prompt | small grey "Description" at top; grey prompt "Why are you doing it?" underneath | CASE-NEEDED | D-05 | S1-R3 empty state |
| H017 | hand (board files an | 1.5 | Header | elements | "Edit Line" 17 px bold · blue #2276DA X at the far right · no AI tag or line builder link | CASE-NEEDED | D-06 | unchanged header |
| H018 | hand (board files an | 1.5 | Status | layout | outlined box: small "Status" label, value, down-arrow | CASE-NEEDED | D-06 | S1-R7 |
| H019 | hand (board files an | 1.5 | Labor guide link | position · style | under the labor row: purple "AI" tag + blue capitals "SHOPCOACH LABOR GUIDE" (11 px, 600) | CASE-NEEDED | D-06 | S1-R7 |
| H020 | hand (board files an | 1.5 | Buttons | order · colour | right-aligned: Delete (solid red #C10015) then Save & Close (solid blue #2276DA) | CASE-NEEDED | D-06 | S1-R7 |
| H021 | hand (board files an | 1.2, 1.5 | Whole dialog | width check | every label, prompt and button whole, no overlap, at 1440 and at 1536 px (tool: 0 overlaps, 0 clipped at both widths) | CASE-NEEDED | D-07, D-08, D-09, D-10 | Rule 126 point 2 |
| H022 | hand (board files an | 1.2, 1.5 | Theme | dark | not drawn (light only); PRD silent | OUT-OF-SCOPE |  | design draws light theme only; no dark-theme source for these dialogs |
| H023 | hand (board files an | 1.2, 1.5 | Phone width | layout | not drawn; PRD Form Factor: same words, no separate design | COVERED | C549078 | words at phone width; no look source |
| H024 | hand (board files an | 1.3 | Legacy invoice panel | layout | title bold 12.5 px dark · description regular grey · tech story regular grey on its own line · no labels | CASE-NEEDED | D-11, D-13 | PRD §3 |
| H025 | hand (board files an | 1.3 | Modern invoice panel | layout | title bold · description · small grey capitals "SCOPE OF WORK" heading (11 px, 700, #8b95a3) · tech story | CASE-NEEDED | D-12, D-14 | PRD §3 |
| H026 | hand (board files an | 1.3 | QuickBooks tables | columns · styles | DESCRIPTION / QTY / AMOUNT, monospace description, old text in dark red | OUT-OF-SCOPE |  | QuickBooks' own screen, drawn as an illustration; its text is covered by C154713/C154715 |
| H027 | hand (board files an | 1.3 | Before / After markers | dots | red dot "BEFORE", green dot "AFTER" | OUT-OF-SCOPE |  | board annotation |
| H028 | hand (board files an | 1.1, 1.4 | Before boards | all looks | today's dialogs (label inside the box, Title Case questions) | OUT-OF-SCOPE |  | Before boards: control only |
| H029 | hand (board files an | 1.1, 1.2, 1.4, 1.5 | Board pills | style | white pill, 11 px uppercase, grey (before) / green (after) | OUT-OF-SCOPE |  | board annotation |
| H030 | hand (board files an | 2.1 | Cards | layout | four white cards, blue rule headings, grey 'Line reads' boxes, green card for the semicolon | OUT-OF-SCOPE |  | text-output illustration; texts covered by C549081, C154718, C154713, C154716, C549082 |
| H031 | hand (board files an | 2.2 | Cut diagram | layout | blue 'Title · always survives', white clipped description with red ▾, pink 'Dropped' | OUT-OF-SCOPE |  | illustration of S3-R7; behaviour covered by C154717, C549083, C549084 |
| H032 | hand (board files an | 2.2 | Scale figures | numbers | 255 · 65,535 · blue 4,000 · green rare | OUT-OF-SCOPE |  | illustration; 4,000 covered by C154717 |
| H033 | hand (board files an | (no board) | ShopCoach editor | label position | label at the top, prompt underneath (tech plan D5 stack-label on all five fields) | CASE-NEEDED | D-16 | S2-R1/R2 + tech plan |
| H034 | hand (board files an | (no board) | ShopCoach table | cell size | cells must not grow or shift (tech plan Phase 3 walk 5, SV-10391) | CASE-NEEDED | D-17 | tech plan |
| H035 | hand (board files an | (no board) | ShopCoach empty cell | style | grey italic (developer note on SV-10131 only) | SPEC-CONFLICT | DQ-02 | no source (PRD and design silent); asked, not asserted |
| H036 | hand (board files an | (no board) | Title required message | position | under the Title box (S1-R6) | COVERED | C154709, C549075 | PRD look sentence with no board; Phase A adds the on-leaving-empty case |
