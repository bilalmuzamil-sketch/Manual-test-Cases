# Internal Work Orders: layout stress cases (draft, 14 Nov 2026)

The QA lead's decision of 14 Nov 2026: **"Draft all 87 + 4 questions (Recommended)"**. This is the Internal Work Orders part: every case the layout stress gap scan proposes (`build/founder-mode/LAYOUT-STRESS-GAP-SCAN-2026-11-13.md`, part I3) and its two questions for Milos Vasic. **Draft only: nothing was written to TestRail, Jira, Slack or Google, and nothing was committed.** The list goes to the QA lead before any TestRail write.

## Counts

| | |
|---|---|
| Scan proposals | 53 (36 typed text, 17 state changes) |
| New cases drafted | **55** (I-P16 split in three: Board card, Schedule card, Tech View, as the scan's own title says and Rule 136 allows) |
| Design cases ("Design — how it looks", 136719) | 51 (D-94 to D-144) |
| Story cases | 4: S9-49, S9-50, S9-51 (Reports, 136710), S12-49 (No-charge line, 136712) |
| Held on a new question | **6** (D-139 to D-142 on question 17, D-143 and D-144 on question 18) |
| For run 559 | 49 (union only, then every test assigned to user 6) |
| NO_MANUAL (a tester cannot set it up) | **0**. I-P01 and I-S02 need an organization where the setting was never on: the suite's own precedent is a new sign-up (S1-02 C1111834, S1-90 C1112417, D-02 C1112320, all in TestRail). QuickBooks, AccountingHub and portal cases follow today's suite (D-81, D-84, D-65 are in TestRail). |
| Existing cases changed | **0** (the 665 existing proposals are byte-identical to the committed proposals.json) |

## Decisions taken while drafting (for the QA lead to see)

1. **Held cases stay in "Design — how it looks", not WAIT-PO.** The brief said held cases go to WAIT-PO 136720 "as the FOLDER logic does". build.py's FOLDER logic skips design cases, and sections.json records the QA lead's choice that waiting design cases stay in the design folder. All six held cases are design cases, so all six go to 136719 and none to WAIT-PO. If you want them in WAIT-PO, it is a one-line change in build.py (I recommend leaving them where the standing choice puts them).
2. **The stress names carry no "ZZAUTOTEST".** The suite's build.py refuses that word in tester text (an example record name). The names keep the scan's shapes: long with spaces (66 characters), long with no spaces (59; 60 for a category, the PRD limit), and & " ' < >. All share the word "Plainsview", so one search shows them together. Where a window shows one record at a time, two records are used: customer A long with spaces and the special characters, customer B long with no spaces. Every case says "if a name field stops before the end, use the longest name it takes".
3. **Wrapping versus "..." is never asked** (skill 07 §6.0 check g). Only two PRD layout sentences are tested word for word: S9-R2 one line at 1440 and 1536 pixels (S9-49) and S3-R5 "on the left and never over the logo" (D-117, D-118).
4. **D-139 and D-140 use their own word** ("Quillmont" in the example) so the other cases' "Plainsview" records can never break them (Rule 137).
5. **D-141 scrolls instead of paging**: the design library says "pagination: Not designed. Tables in the product scroll."
6. **D-136 checks only the filters, summary strip and tabs**; the table headings when the rows change are in held D-141 (question 17).
7. **The scan's I-S09 quote was not word for word** (it joined "Change category" and "Mark as Billable" without the words between). The case quotes S12-R5 whole. Every other scan quote (35 fragments) was found word for word in PRD v1.3.
8. **Question 18 was narrowed**: the menu column is settled by S12-R5 and S2-R4 hides the price columns (check a); only the positions of the remaining columns are asked. Question 17 is kept (see the checks). No question was dropped.

## The cases

| Key | Scan id | Title | Folder | Held? | Source quoted | Set up by hand? |
|---|---|---|---|---|---|---|
| D-94 | I-P01 | Design: Long and unusual customer names stay inside their turn-on chips | Design — how it looks (136719) | no | PRD v1.3 S1-R2 | yes (a new sign-up organization, as S1-02) |
| D-95 | I-P02 | Design: Make internal window with long customer names keeps both buttons visible | Design — how it looks (136719) | no | PRD v1.3 S1-R11, S1-R7 | yes |
| D-96 | I-P03 | Design: Remove the Internal flag window stays readable with long names | Design — how it looks (136719) | no | PRD v1.3 S1-R12, S1-R6 | yes |
| D-97 | I-P04 | Design: Internal badge stays beside long names in the Customers list | Design — how it looks (136719) | no | PRD v1.3 S1-R8 | yes |
| D-98 | I-P05 | Design: Internal badge stays visible beside a long name in the customer header | Design — how it looks (136719) | no | PRD v1.3 S1-R8 | yes |
| D-99 | I-P06 | Design: Internal badge stays visible on the phone customer card with a long name | Design — how it looks (136719) | no | PRD v1.3 S1-R8 | yes (phone or 390 px window) |
| D-100 | I-P07 | Design: Long category and customer names stay inside the categories tables | Design — how it looks (136719) | no | PRD v1.3 S1-R13, S1-R14 | yes (QuickBooks location) |
| D-101 | I-P09 | Design: Long archived category names read in full with (archived) | Design — how it looks (136719) | no | PRD v1.3 S1-R13, S1-R16 | yes |
| D-102 | I-P10a | Design: Long category names fit the Default internal category select | Design — how it looks (136719) | no | PRD v1.3 S1-R7 | yes |
| D-103 | I-P10b | Design: Long category names fit the Internal category select on Edit Asset | Design — how it looks (136719) | no | PRD v1.3 S1-R15 | yes |
| D-104 | I-P11 | Design: Long category names keep their own rows in QuickBooks ShopView Accounts | Design — how it looks (136719) | no | PRD v1.3 S5-R1, S5-R4 | yes (QuickBooks location) |
| D-105 | I-P12 | Design: New Work Order tooltip with a long category stays readable | Design — how it looks (136719) | no | PRD v1.3 S2-R1 | yes |
| D-106 | I-P13a | Design: Long names fit the No Charge selects in New Work Order | Design — how it looks (136719) | no | PRD v1.3 S2-R2 | yes |
| D-107 | I-P13b | Design: Long names fit the Convert to No Charge and Change category selects | Design — how it looks (136719) | no | PRD v1.3 S2-R5, S2-R6 | yes |
| D-108 | I-P14 | Design: Mark this line window keeps a long line title inside the window | Design — how it looks (136719) | no | PRD v1.3 S12-R2 | yes |
| D-109 | I-P15 | Design: Work orders list keeps every column visible with long customer names | Design — how it looks (136719) | no | PRD v1.3 S2-R10 | yes |
| D-110 | I-P16a | Design: Board cards keep the badge with long customer names | Design — how it looks (136719) | no | PRD v1.3 S2-R10 | yes |
| D-111 | I-P16b | Design: Schedule cards keep the badge with long customer names | Design — how it looks (136719) | no | PRD v1.3 S2-R10 | yes |
| D-112 | I-P16c | Design: Tech View keeps the badge with long customer names | Design — how it looks (136719) | no | PRD v1.3 S2-R10 | yes (technician login, as D-78) |
| D-113 | I-P17a | Design: A long category in the No Charge chip keeps the line's columns in place | Design — how it looks (136719) | no | PRD v1.3 S12-R3 | yes |
| S12-49 | I-P17b | Print Work Order prints a long No Charge chip beside its line | No-charge line on a billable work order (136712) | no | PRD v1.3 S12-E8 | yes |
| D-114 | I-P18 | Design: Posting summary and Close window keep long category names inside | Design — how it looks (136719) | no | PRD v1.3 S3-N4, S3-R2 | yes (QuickBooks location) |
| D-115 | I-P19 | Design: Cost move window with long part names keeps Cancel and Continue visible | Design — how it looks (136719) | no | PRD v1.3 S2-R8, UFS-14 | yes (QuickBooks location) |
| D-116 | I-P20 | Design: System notes with long category and line names stay inside the note | Design — how it looks (136719) | no | PRD v1.3 S12-R6, S2-R18 | yes |
| D-117 | I-P21a | Design: NO CHARGE document keeps a long category line left, clear of the logo | Design — how it looks (136719) | no | PRD v1.3 S3-R5 | yes (shop logo set) |
| D-118 | I-P21b | Design: INTERNAL document keeps a long category line left, clear of the logo | Design — how it looks (136719) | no | PRD v1.3 S3-R5 | yes (shop logo set) |
| D-119 | I-P22 | Design: Portal no-charge estimate keeps a long category line inside the page | Design — how it looks (136719) | no | PRD v1.3 S2-R11, S2-R4 | yes (portal contact login, as D-65) |
| D-120 | I-P23 | Design: Invoice shows a long category under the no-charge line title | Design — how it looks (136719) | no | PRD v1.3 S12-R7, UFS-39 | yes |
| D-121 | I-P24 | Design: Missing original work order message with a long line title is readable | Design — how it looks (136719) | no | PRD v1.3 S12-R9, UFS-38 | yes |
| D-122 | I-P26 | Design: Report summary cards with long category names stay readable | Design — how it looks (136719) | no | PRD v1.3 S9-R2 | yes |
| D-123 | I-P27 | Design: Report Category and Original technician filters show long names in rows | Design — how it looks (136719) | no | PRD v1.3 S9-R2 | yes |
| D-124 | I-P28 | Design: Long technician names stay in their rows on the By technician tab | Design — how it looks (136719) | no | PRD v1.3 S9-R2 | yes |
| D-125 | I-P31 | Design: AccountingHub Held reason with a long category stays in its row | Design — how it looks (136719) | no | PRD v1.3 S8-N2, UFS-22 | yes (AccountingHub, as D-84) |
| D-126 | I-P32 | Design: QB Unexported row with a long customer name keeps the Internal badge | Design — how it looks (136719) | no | PRD v1.3 S7-N3 | yes (QuickBooks closed period, as D-81) |
| D-127 | I-P33 | Design: Asset Invoices tab keeps a long customer name and the badge in place | Design — how it looks (136719) | no | PRD v1.3 S3-R6, S9-R10 | yes |
| S9-49 | I-P25 | Report keeps work order numbers and dates on one line with long names | Reports, dashboard and exports (136710) | no | PRD v1.3 S9-R2 | yes |
| S9-50 | I-P29 | Report PDF and CSV keep long and unusual names whole | Reports, dashboard and exports (136710) | no | PRD v1.3 S9-R2 | yes |
| S9-51 | I-P30 | Customer Invoice export keeps a long category with quotes and commas in one cell | Reports, dashboard and exports (136710) | no | PRD v1.3 S9-R13, S9-R6 | yes |
| D-128 | I-S01 | Design: Turning Internal Work Orders on adds the hint, the toggles above stay | Design — how it looks (136719) | no | PRD v1.3 S1-R10, S1-R3 | yes |
| D-129 | I-S02 | Design: Adding chips in the turn-on window moves nothing above the picker | Design — how it looks (136719) | no | PRD v1.3 S1-R2 | yes (a new sign-up organization, as S1-02) |
| D-130 | I-S03 | Design: Switching category tabs keeps the title, tabs and columns in place | Design — how it looks (136719) | no | PRD v1.3 S1-R13 | yes (QuickBooks location) |
| D-131 | I-S04 | Design: Show archived lists the archived rows without moving the columns | Design — how it looks (136719) | no | PRD v1.3 S1-R13, S1-R16 | yes (QuickBooks location) |
| D-132 | I-S05 | Design: Ticking Internal customer adds the select without moving the fields | Design — how it looks (136719) | no | PRD v1.3 S1-R7 | yes |
| D-133 | I-S06 | Design: Ticking No Charge adds the category fields below, nothing above moves | Design — how it looks (136719) | no | PRD v1.3 S2-R2 | yes |
| D-134 | I-S11 | Design: Closing and reopening keeps the lines table headings in place | Design — how it looks (136719) | no | PRD v1.3 S3-R6, S4-R2 | yes |
| D-135 | I-S12 | Design: Switching report tabs keeps the filters, cards and tabs in place | Design — how it looks (136719) | no | PRD v1.3 S9-R2 | yes |
| D-136 | I-S13 | Design: Changing a report filter keeps the filters and tabs in place | Design — how it looks (136719) | no | PRD v1.3 S9-R2 | yes |
| D-137 | I-S16 | Design: Opening a three-dots menu leaves the lines table headings in place | Design — how it looks (136719) | no | PRD v1.3 S12-R1, S2-R5 | yes |
| D-138 | I-S17 | Design: Turning the setting off keeps the categories table columns in place | Design — how it looks (136719) | no | PRD v1.3 S1-R10, S1-R13 | yes (QuickBooks location) |
| D-139 | I-S07 | Design: Work orders list columns keep their place when Classification changes | Design — how it looks (136719) | yes, question 17 | PRD v1.3 S2-R14 | yes |
| D-140 | I-S08 | Design: Work orders list columns keep their place on the All tab with Closed | Design — how it looks (136719) | yes, question 17 | PRD v1.3 S2-R10 | yes |
| D-141 | I-S14 | Design: Report table headings keep their place when the rows change | Design — how it looks (136719) | yes, question 17 | PRD v1.3 S9-R2 | yes (about 40 closed work orders) |
| D-142 | I-S15 | Design: Technician Efficiency columns keep their place when the chip changes | Design — how it looks (136719) | yes, question 17 | PRD v1.3 S9-R3 | yes |
| D-143 | I-S09 | Design: Lines table columns keep their place when a line is marked No Charge | Design — how it looks (136719) | yes, question 18 | PRD v1.3 S12-R3, S12-R5 | yes |
| D-144 | I-S10 | Design: Lines table columns keep their place when the work order is converted | Design — how it looks (136719) | yes, question 18 | PRD v1.3 S2-R4, S2-R5, S2-R6 | yes |

Every quote is a whole PRD v1.3 requirement line (or a User Feedback Summary row), checked word for word by build.py against `sources/CONFLUENCE-942243841-v1.3-read-2026-11-12.md`. Design references cite version 1794561577-f903 (boards byte-identical to 1794510020-d4ec); pictures from `design-2026-11-12/images/` (v13 pictures where the board was redrawn). Marker: `AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026` (the suite's standard, as D-93); held: `AUTOMATION: HOLD - waiting on the PO (question n)`.

## Questions for Milos Vasic (rows 17 and 18 of the existing sheet)

Sheet `1HMtYS1VTJEH1-m4ykJNVefdg1mu2mwtlH9HhOkRml-w`, rows added at the bottom (Rule 131) under a batch heading, in a new colour: **light purple (#E8DAEF)**, with the colour-guide line "Light purple = questions from checking how the screens hold long names and changing rows (added 14 Nov 2026, from row 24)". Columns as `questions-2026-11-12/sheet_rows.py`: # · Topic · Question for you · What we know today · Your answer · Where we found it. Draft only: the coordinator adds the rows (`questions-2026-11-14/sheet_rows.py`, `sheet-values.json`). They are also rows 17 and 18 of `authoring/po_questions.py`, which holds the six cases.

Batch heading row: Questions from checking how the screens hold long names and changing rows (14 Nov 2026), questions 17 and 18. Hello again sir: while we checked how each screen copes with long names and with rows coming and going, two points came up that only you can decide. Everything else on these screens is written and ready to test.

### Question 17

- **Topic:** Internal Work Orders: The columns of the work orders list and the reports when the rows change
- **Question for you:** When a filter, a tab or the number of rows changes, should the columns of the work orders list, the Internal Work Orders report and Technician Efficiency stay where they are?<br>(a) Yes, the columns keep their place (suggested: a table whose headings jump sideways is hard to read, and we can check it)<br>(b) No, the columns may move with what is in them, as drawn<br>(c) Something else (please say)
- **What we know today:** ShopView sizes the columns of these tables to what is in them, so a long customer name, or a filter that leaves no rows, can shift the headings sideways. The design draws exactly that: on the work orders list, picking a Classification that leaves no rows moves the headings by up to 214 pixels, and the All tab with Status Closed moves some by 9 to 56 pixels. The PRD does not say either way. On the A/R and A/P reports the same movement was raised as a bug after Demo Day (SV-12763), so we would rather ask than guess. Everything else on these screens is tested now; four look checks wait on your answer.
- **Your answer:** (empty, for Milos Vasic)
- **Where we found it:** PRD v1.3 S2-R14, S2-R10, S9-R2, S9-R3; design "Internal Work Orders · All flows v6", Flow 4 boards 01, 02, 03, 04, 05 and Flow 1 board 09; design library, work orders list column widths (only On Site and Status have a fixed width)

Skill 07 §6.0 checks:

| Check | | Result |
|---|---|---|
| a | Precedence | Passed. The PRD's own rule ("Where a frame and this text disagree, the text wins") cannot settle it: the text says nothing about where these columns sit; no other precedence statement applies. |
| b | Suggested-answer test | Passed. No source backs "keep their place": PRD v1.3 has only the one-line sentence for the report (S9-R2, tested in S9-49); the design library has no sentence on column positions (its 20 always/never lines checked). |
| c | Silence is not a gap when another source speaks | Passed, kept. The design and the library speak only by drawing and by code (columns sized to their content; only On Site and Status fixed), not by a stated rule; skill 21 §6d line 10 sends a move the sources do not settle to the product owner. The same move was raised as a defect on A/R and A/P (SV-12763), so leaving it unasked risks a late defect. |
| d | Design library over a single frame | Passed. No library always/never sentence covers column positions ("Tables in the product scroll." is about pages, not widths). |
| e | Untestable goes to the list | Passed. Testable by hand with a screenshot and a comparison: four cases (D-139 to D-142). |
| f | Right owner | Passed. The PRD names no other owner; the feature adds the Classification chip, the Closed status, the report and the Technician Efficiency chip that change these rows. |
| g | Behaviour first | Passed. The behaviour (do the columns move) is the point, not wording. |
| h | Final filter on the merged list | Passed. Run on both new questions together and against questions 1 to 16 (all answered): no overlap; 17 and 18 are kept apart because they cover different screens and different causes (rows and filters against a line's chip and hidden price columns). |

### Question 18

- **Topic:** Internal Work Orders: The lines table when a line, or the whole work order, becomes No Charge
- **Question for you:** When a line is marked No Charge, or the work order is converted to No Charge and back, should the other columns of the lines table stay where they were?<br>(a) Yes, the columns stay where they were (suggested: the advisor finds Actual/Estimate, Status and the prices in the same place on every line)<br>(b) No, they may move, as drawn<br>(c) Something else (please say)
- **What we know today:** The PRD already settles two parts, and both are tested now: a no-charge line keeps its three-dots menu (Change category, Mark as Billable), and a no-charge work order hides Rate, Margin and Total. What it does not say is whether the remaining columns stay put. In the design they move: once a line carries its "No Charge · Warranty" chip, Actual/Estimate and Status sit about 40 pixels further right than before, and after Convert the Rate heading moves about 52 pixels. One design picture (Flow 6 board 03) also leaves out the three-dots column; the PRD keeps the menu, so we follow the PRD there. Two look checks wait on your answer.
- **Your answer:** (empty, for Milos Vasic)
- **Where we found it:** PRD v1.3 S12-R3, S12-R5, S2-R4, S2-R5, S2-R6; design "Internal Work Orders · All flows v6", Flow 6 boards 01, 03, 04 and Flow 2 boards 01, 03

Skill 07 §6.0 checks:

| Check | | Result |
|---|---|---|
| a | Precedence | Passed for what remains. The text-wins rule settles the menu: S12-R5 keeps the three-dots menu on a no-charge line (Flow 6 board 03 drops it; board 04 draws it), and S2-R4 hides Rate, Margin and Total on a no-charge work order (register IWO-D17). Both parts were taken out of the question and are tested now (D-143, D-144, D-137). The positions of the remaining columns are not in the text. |
| b | Suggested-answer test | Passed. No source says the columns stay; the design's own after-picture with the menu (board 04) still moves Actual/Estimate and Status about 40 px (measured against board 01 on 14 Nov 2026). |
| c | Silence is not a gap when another source speaks | Passed, kept. The design contradicts itself (board 03 against board 04) and moves the columns in both; no library rule; skill 21 §6d line 10 sends the move to the product owner. |
| d | Design library over a single frame | Passed. No library always/never sentence on column positions. |
| e | Untestable goes to the list | Passed. Testable by hand: two cases (D-143, D-144). |
| f | Right owner | Passed. Story 12 and Story 2 belong to this PRD; no other owner named. |
| g | Behaviour first | Passed. Behaviour, not wording. |
| h | Final filter on the merged list | Passed. Narrowed on this pass: the scan's draft also asked about the menu column, which S12-R5 settles (check a); only the column positions remain. |

## Gate results

- `python3 authoring/build.py`: 0 PROBLEM lines (720 cases: 665 existing unchanged + 55 new; held 56 = 50 + 6; PRD codes 206 of 206 covered; questions 17 and 18 each hold cases)
- `python3 build/testing-tools/tester_readiness_check.py build/founder-mode/internal-work-orders`: exit 0, 0 hard problems (720 cases; 180 'does not / never' results listed, 28 of them on the new cases, all read)
- Every new case read in full (preconditions, steps, results, notes, design block, marker), all 55; quote bodies checked by build.py's word-for-word gate. Fixes from the read: the "Show archived" link no longer assumes a count (D-101, D-131); each document output named on its own (D-117, D-118); controls a tester can see for three "no longer" results (D-107, D-114, D-132); own search word for D-139 and D-140; scrolling for D-141.
- The readiness check's 28 "does not / never" results on the new cases were read: each sits in the same step as a positive result the tester can see (the name, chip, badge or window itself).
- `layout-stress-2026-11-14/create_layout_stress.py` dry run: 55 to add (DESIGN 51, S9 3, S12 1), 6 held, 49 for run 559, 78 picture uploads (52 files, all present), readiness check passed. Not run with --apply.

## Files

- `authoring/cases_zzzz_stress.py` (new): the 55 cases
- `authoring/po_questions.py`: questions 17 and 18 appended (rows 1 to 16 untouched)
- `authoring/proposals.json`: rebuilt by build.py (720 cases; the 665 existing entries unchanged)
- `questions-2026-11-14/sheet_rows.py`, `sheet-values.json`: the two sheet rows
- `layout-stress-2026-11-14/create_layout_stress.py`: the create script (not run); `render_text.py`, `make_new_cases_md.py`: this file

## Reading coverage

| Source | Read |
|---|---|
| LAYOUT-STRESS-GAP-SCAN-2026-11-13.md | lines 1-90 and 249-460 (summary, stress data, the whole Internal Work Orders part, notes, reading coverage); 100% of the IWO part |
| PRD v1.3 (sources/CONFLUENCE-942243841-v1.3-read-2026-11-12.md) | every requirement line quoted, read whole (S1-R1 to S1-R16, S1-N4, S2-R1/R2/R4/R5/R6/R8/R10/R11/R14/R18, S3-R2/R5/R6/N4, S4-R2, S5-R1/R4, S7-N3, S8-R3/N2, S9-R1 to R4/R6/R10/R11/R13/N1/N3, S12-R1 to R7/R9/E8, UFS rows 05/14/15/17/22/38/39); the 36 scan quote fragments checked by script |
| LESSONS-REGISTER.md | rows L-20, L-21 |
| skills/21-DESIGN-DRIVE-PROTOCOL.md §6d | lines 7-10 |
| skills/07-PO-QUESTIONS.md §6.0 | lines 252-300 |
| rules/RULES-61-96.md | Rules 113, 114, 117 fourteenth and fifteenth amendments, 135-139, in full |
| A/R suite cases_demo_2026_11_13.py | lines 1-60 and 185-266 (D-90 to D-95) |
| design-2026-11-12/DESIGN-VISUAL-INVENTORY.md | lines 1-90 (V01-V80) |
| design pictures viewed | flow4-05, flow6-01, flow6-03, flow6-04, flow0-04, flow0-08, flow1-14, flow3-01 (positions compared by eye) |
| design library _ds_bundle.js (v4) | grep: every always/never line (20), the GAPS block (lines 7268-7285) |
| suite machinery | build.py, iwo_lib.py, common.py, design_refs.py, design_v3.py, create.py, po_questions.py (structure), cases_zzz_v13.py (round 4 additions), write scripts of 13 Nov 2026 |

## OUTSTANDING — what I need from you

1. **Your go-ahead to write** the 55 cases (49 into run 559) with `create_layout_stress.py --apply` (Rule 6). Recommended: yes, after reading this list.
2. **Send questions 17 and 18** to Milos Vasic by adding the two rows to the sheet (Rule 66: the sheet goes last). Recommended: send both; they hold six cases.
3. **Folder for the six held cases**: "Design — how it looks" (Recommended, the standing choice) or WAIT-PO 136720.

Waiting on the PO (Rule 132): Internal Work Orders sheet, questions 1 to 16 all answered; questions 17 and 18 are drafts, not yet sent (six cases would wait on them).

## Full text of every new case

### D-94 · Design: Long and unusual customer names stay inside their turn-on chips

Scan proposal I-P01 · folder Design — how it looks (136719) · refs SV-11758 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Use a new organization created on the build (a new sign-up), in which the Internal Work Orders setting has never been switched on.
 - Have a new customer for this test, customer A, whose name is long with spaces (for example Plainsview Heavy Truck and Trailer Repair Services of North Dakota).
 - Have a new customer for this test, customer B, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new customer for this test, customer C, whose name has the characters & " ' < > (for example Plainsview A&B "Fleet" O'Neil <Parts> & Sons).
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow0-02-01b-turn-on-pick-your-internal-customers.png at 100% zoom beside the screen.

**Steps**

1. Open Settings > Work Orders.
2. Switch the "Internal Work Orders" toggle on.
3. Pick customer A in the customer picker.
4. Pick customer B in the customer picker.
5. Pick customer C in the customer picker.

**Expected Result**

Step 1:

 - The toggle "Internal Work Orders" is off.
Step 2:

 - The window "Which customers are your own company?" opens.
Step 3:

 - A chip with customer A's name and a remove control shows in the picker.
 - The chip stays inside the picker field and the window; its remove control is visible.
Step 4:

 - A chip with customer B's name shows; the long name with no spaces stays inside the picker field and does not run past the window's edge.
 - Both chips show their remove control.
Step 5:

 - A chip with customer C's name shows.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
 - The hint "Pick up to 50 customers here. Flag more from Edit Customer.", the line "You can change this any time: Customers > Edit Customer > Internal customer." and the buttons "Do this later" and "Save" are all visible; no chip covers them.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11758 (Story 1, Turn on Internal Work Orders, flag internal customers, manage categories)

 - S1-R2: “Switching the toggle from off to on for the first time in the organization opens the modal "Which customers are your own company?" with the body "Work orders for these customers are internal: no prices and no invoice; parts cost posts to the expense account of their category when you use QuickBooks or AccountingHub. Nothing is picked for you: your location is not always a customer, and the names can differ. Pick one or more, or do it later from the customer page.", a customer picker (the standard customer Select with search, several customers can be picked, each shown as a chip with a remove control; up to 50, with the hint "Pick up to 50 customers here. Flag more from Edit Customer."), the line "You can change this any time: Customers > Edit Customer > Internal customer." and the buttons "Do this later" and "Save". No customer is preselected. Save is disabled until at least one customer is picked. Save saves the toggle (on) and flags the picked customers in one step (only this toggle and the flags; other unsaved changes on the tab wait for Save settings; to back out, the user switches the toggle off and saves settings), closes the modal and then shows the dialog of S1-R11 for each picked customer with open billable work orders, one after another; the page shows the toggle on and the hint line of S1-R3 with nothing left to save for this setting. Closing the modal with X acts as "Do this later" (S1-R5); Esc and a click outside do nothing, as in every dialog of the app. The modal is shown once per organization: switching the toggle on again later opens nothing (S1-R10). Switching it off opens nothing. The modal never lists who is flagged, and Settings > Work Orders never lists customers.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 0 · Turn it on", board "01b Turn on · pick your internal customers" (Flow 0 · Turn it on).
Design pictures attached to this case:

 - iwo-flow0-02-01b-turn-on-pick-your-internal-customers.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-95 · Design: Make internal window with long customer names keeps both buttons visible

Scan proposal I-P02 · folder Design — how it looks (136719) · refs SV-11758 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new customer for this test, customer A, whose name is long with spaces and has the characters & " ' < > (for example Plainsview Heavy Truck & Trailer "Fleet" O'Neil <Parts> Repair Services).
 - Have a new customer for this test, customer B, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new work order for this test, work order 1, for customer A, in Estimate, so the Make internal window opens.
 - Have a new work order for this test, work order 2, for customer B, in Estimate, so the Make internal window opens.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow0-13-07-make-internal-confirm.png at 100% zoom beside the screen.

**Steps**

1. Open customer A's page.
2. Click Edit Customer on customer A's page.
3. Tick the "Internal customer" checkbox.
4. Click Save.
5. Click "Keep billable".
6. Open customer B's page.
7. Click Edit Customer on customer B's page.
8. Tick the "Internal customer" checkbox.
9. Click Save.

**Expected Result**

Step 1:

 - Customer A's page opens.
Step 2:

 - The Edit Customer window opens.
Step 3:

 - The select "Default internal category" appears under the checkbox.
Step 4:

 - A window opens that reads "[n] open work orders for [customer A's name] are billable. Make them internal? Prices, fees and discounts are removed; costs and hours are kept."
 - Customer A's name shows in full, exactly as saved, and stays inside the window.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
 - Work order 1's row (number, location, unit, status) is visible under the text.
 - The buttons "Keep billable" and "Make internal" are visible; no text covers them.
Step 5:

 - The window closes.
Step 6:

 - Customer B's page opens.
Step 7:

 - The Edit Customer window opens.
Step 8:

 - The select "Default internal category" appears under the checkbox.
Step 9:

 - The window names customer B in full; the long name with no spaces stays inside the window and does not run past its edge.
 - Work order 2's row and the buttons "Keep billable" and "Make internal" are visible.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11758 (Story 1, Turn on Internal Work Orders, flag internal customers, manage categories)

 - S1-R11: “When a customer is flagged (Save in the modal, or on Edit Customer with the checkbox ticked), or the setting is turned on again while flagged customers have open billable work orders (S1-R10), a dialog reads "[n] open work orders for [customer] are billable. Make them internal? Prices, fees and discounts are removed; costs and hours are kept." and lists those work orders under the body, one line each (number, location, unit, status), at every location the user has access to, up to 10 rows and then "and [n] more". Counted as open: every billable work order of that customer that is not invoiced, not paid and not Declined, Estimates included. A row with a deposit carries the note "Deposit: stays billable"; a row with a posted vendor bill carries the note "Vendor bill: cost moves at Close" (no dialog of S2-R8 per work order on this path). Buttons: "Keep billable" and "Make internal". Make internal applies S2-R7 to every listed work order without a deposit; those with a deposit stay billable until the deposit is reversed and the dialog is shown again. Keep billable leaves them as they are; they finish with an invoice as today. Open no-charge work orders of that customer are not listed: they stay no charge with their category and keep Change category and Convert to Billable (S2-R6). With no open billable work orders the dialog is not shown. Saving Edit Customer for a customer that carries the flag shows this dialog again whenever that customer has open billable work orders, so work orders left billable earlier (a deposit since reversed, Keep billable, a user without 'Work Orders — Create & Edit') can be made internal later. Open billable work orders at locations the user has no access to are not listed; the line "[n] more at locations you don't have access to." under the list says how many, and they are converted when a user with access saves Edit Customer or the setting is turned on again (S1-R10). Make internal converts the listed work orders without switching location. A pending portal estimate of a work order made internal is no longer available: the portal refuses approval with "This estimate is no longer available." and shows the existing obsolete banner, since internal work orders are never on the portal (S2-R11).”
 - S1-R7: “Edit Customer shows the checkbox "Internal customer" as the last field of the dialog, below "PO is required", with the helper "Work orders for this customer are internal: no prices, no invoice, parts cost posts to the expense account of the internal category." When ticked, the select "Default internal category" appears under it, listing the active Internal categories, General Internal preselected, with the helper "Used by every new internal work order for this customer unless the asset has its own category." It is shown while the setting is on (S1-N4 for the exception). New Customer does not show it: a customer is flagged after it exists, from Edit Customer or the modal. The checkbox and the modal are the only places the flag is set; ticking it on Save flags the customer (with the dialog of S1-R11 when open billable work orders exist).”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 0 · Turn it on", board "07 Make internal · confirm" (Flow 0 · Turn it on).
Design pictures attached to this case:

 - iwo-flow0-13-07-make-internal-confirm.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-96 · Design: Remove the Internal flag window stays readable with long names

Scan proposal I-P03 · folder Design — how it looks (136719) · refs SV-11758 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new customer for this test, customer A, flagged as an Internal customer, whose name is long with spaces and has the characters & " ' < > (for example Plainsview Heavy Truck & Trailer "Fleet" O'Neil <Parts> Repair Services).
 - Have a new customer for this test, customer B, flagged as an Internal customer, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new internal work order for this test, work order 1, for internal customer A, in Estimate, so the window shows its full body.
 - Have a new internal work order for this test, work order 2, for internal customer B, in Estimate, so the window shows its full body.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow0-14-08-remove-flag-confirm.png at 100% zoom beside the screen.

**Steps**

1. Open customer A's page.
2. Click Edit Customer on customer A's page.
3. Untick the "Internal customer" checkbox.
4. Click Cancel in the Remove the Internal flag window.
5. Click Cancel in the Edit Customer window.
6. Open customer B's page.
7. Click Edit Customer on customer B's page.
8. Untick the "Internal customer" checkbox.

**Expected Result**

Step 1:

 - Customer A's page opens.
Step 2:

 - The Edit Customer window opens.
Step 3:

 - A window "Remove the Internal flag from [customer A's name]?" opens with the body "[n] open internal work orders for [customer A's name] stay internal and close without an invoice. New work orders for [customer A's name] will be billable."
 - Customer A's name shows in full in the title and the body and stays inside the window.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
 - The buttons Cancel and "Remove flag" are visible; no text covers them.
Step 4:

 - The window closes and "Internal customer" is still ticked.
Step 5:

 - The Edit Customer window closes.
Step 6:

 - Customer B's page opens.
Step 7:

 - The Edit Customer window opens.
Step 8:

 - The window names customer B in full in the title and the body; the long name with no spaces stays inside the window and does not run past its edge.
 - The buttons Cancel and "Remove flag" are visible.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11758 (Story 1, Turn on Internal Work Orders, flag internal customers, manage categories)

 - S1-R12: “Removing the flag (unticking the checkbox on Edit Customer, S1-R6) opens the dialog "Remove the Internal flag from [customer]?" with the body "[n] open internal work orders for [customer] stay internal and close without an invoice. New work orders for [customer] will be billable." with the buttons Cancel and "Remove flag" (with no open internal work orders the first sentence is omitted). Confirming clears the flag; open internal work orders keep their classification and badge, close as internal, and can be made billable by changing their customer.”
 - S1-R6: “Unticking the "Internal customer" checkbox on Edit Customer opens the dialog of S1-R12 before the dialog is saved; on confirmation Save clears the flag. Cancel leaves the checkbox ticked.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 0 · Turn it on", board "08 Remove flag · confirm" (Flow 0 · Turn it on).
Design pictures attached to this case:

 - iwo-flow0-14-08-remove-flag-confirm.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-97 · Design: Internal badge stays beside long names in the Customers list

Scan proposal I-P04 · folder Design — how it looks (136719) · refs SV-11758 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new customer for this test, customer A, flagged as an Internal customer, whose name is long with spaces (for example Plainsview Heavy Truck and Trailer Repair Services of North Dakota).
 - Have a new customer for this test, customer B, flagged as an Internal customer, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new customer for this test, customer C, flagged as an Internal customer, whose name has the characters & " ' < > (for example Plainsview A&B "Fleet" O'Neil <Parts> & Sons).
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow0-10-04-customers-list.png at 100% zoom beside the screen.

**Steps**

1. Open Customers.
2. Type "Plainsview" in the customers search.

**Expected Result**

Step 1:

 - The Customers list opens.
Step 2:

 - The rows of customer A, customer B and customer C show.
 - Each name stays inside its own cell, with the "Internal" badge right after it; no badge is pushed out of the row or covered.
 - Customer B's name with no spaces does not run over the next column.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
 - Every column heading of the list is visible on screen without scrolling sideways.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11758 (Story 1, Turn on Internal Work Orders, flag internal customers, manage categories)

 - S1-R8: “While the setting is on, a flagged customer shows an "Internal" badge next to its name in the customer header, in the customers list and on the customers list mobile card. While the setting is off the badge is hidden in all three places (S1-N4); the badges on work orders stay (S2-R10).”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 0 · Turn it on", board "04 Customers list" (Flow 0 · Turn it on).
Design pictures attached to this case:

 - iwo-flow0-10-04-customers-list.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-98 · Design: Internal badge stays visible beside a long name in the customer header

Scan proposal I-P05 · folder Design — how it looks (136719) · refs SV-11758 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new customer for this test, customer A, flagged as an Internal customer, whose name is long with spaces (for example Plainsview Heavy Truck and Trailer Repair Services of North Dakota).
 - Have a new customer for this test, customer B, flagged as an Internal customer, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new customer for this test, customer C, flagged as an Internal customer, whose name has the characters & " ' < > (for example Plainsview A&B "Fleet" O'Neil <Parts> & Sons).
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow0-11-05-customer-page-internal-customer.png at 100% zoom beside the screen.

**Steps**

1. Open customer A's page.
2. Open customer B's page.
3. Open customer C's page.

**Expected Result**

Step 1:

 - The header shows customer A's name in full with the "Internal" badge after it; the name stays inside the header and covers neither the badge nor the header's buttons.
Step 2:

 - The header shows customer B's name with the badge visible; the long name with no spaces does not run past the header's edge or over its buttons.
Step 3:

 - The header shows customer C's name with the badge.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11758 (Story 1, Turn on Internal Work Orders, flag internal customers, manage categories)

 - S1-R8: “While the setting is on, a flagged customer shows an "Internal" badge next to its name in the customer header, in the customers list and on the customers list mobile card. While the setting is off the badge is hidden in all three places (S1-N4); the badges on work orders stay (S2-R10).”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 0 · Turn it on", board "05 Customer page · internal customer" (Flow 0 · Turn it on).
Design pictures attached to this case:

 - iwo-flow0-11-05-customer-page-internal-customer.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-99 · Design: Internal badge stays visible on the phone customer card with a long name

Scan proposal I-P06 · folder Design — how it looks (136719) · refs SV-11758 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a phone, or a browser window narrowed to 390 pixels wide, signed in to the same account.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new customer for this test, customer A, flagged as an Internal customer, whose name is long with spaces (for example Plainsview Heavy Truck and Trailer Repair Services of North Dakota).
 - Have a new customer for this test, customer B, flagged as an Internal customer, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new customer for this test, customer C, flagged as an Internal customer, whose name has the characters & " ' < > (for example Plainsview A&B "Fleet" O'Neil <Parts> & Sons).
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow0-10-04-customers-list.png at 100% zoom beside the screen.

**Steps**

1. Open Customers.
2. Type "Plainsview" in the customers search.

**Expected Result**

Step 1:

 - The customers list shows as cards.
Step 2:

 - The cards of customer A, customer B and customer C show.
 - Each name stays inside its own card with the "Internal" badge visible; no name runs past the card's edge or over the next card.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
 - Nothing on the page needs sideways scrolling.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11758 (Story 1, Turn on Internal Work Orders, flag internal customers, manage categories)

 - S1-R8: “While the setting is on, a flagged customer shows an "Internal" badge next to its name in the customer header, in the customers list and on the customers list mobile card. While the setting is off the badge is hidden in all three places (S1-N4); the badges on work orders stay (S2-R10).”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 0 · Turn it on", board "04 Customers list" (Flow 0 · Turn it on).
Design pictures attached to this case:

 - iwo-flow0-10-04-customers-list.png
The design draws the desktop Customers list only; the phone card is not drawn. The results check the card's own edges.
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-100 · Design: Long category and customer names stay inside the categories tables

Scan proposal I-P07 · folder Design — how it looks (136719) · refs SV-11758 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Make sure the test location is connected to QuickBooks Online and that AccountingHub is not enabled.
 - Have a new Internal category for this test, category A, whose name is 60 characters long with spaces (for example Plainsview Company Vehicle and Heavy Equipment Upkeep Region).
 - Have a new Internal category for this test, category B, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new Internal category for this test, category C, whose name has the characters & " ' < > (for example Plainsview "Yard" & O'Neil <Units> Upkeep).
 - Have a new customer for this test, customer A, flagged as an Internal customer, whose Default internal category is category A, whose name is long with spaces (for example Plainsview Heavy Truck and Trailer Repair Services of North Dakota).
 - Have a new customer for this test, customer B, flagged as an Internal customer, whose Default internal category is category B, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have three new No Charge categories for this test, category D, category E and category F, named like categories A, B and C.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached pictures iwo-flow0-04-2a-internal-work-orders-page-internal-categories.png, iwo-flow0-05-2b-internal-work-orders-page-no-charge-categories.png at 100% zoom beside the screen.

**Steps**

1. Open Administration > Service > Internal Work Orders.
2. Open the No Charge categories tab.

**Expected Result**

Step 1:

 - The Internal categories tab shows the rows of category A, category B and category C.
 - Each category name stays inside the Category cell; none runs over the QuickBooks expense account column.
 - Customer A's and customer B's names stay inside the "Internal customers" cell of their category's row; none runs over the Work orders column.
 - On every row the QuickBooks expense account ("Not set" with its warning icon), the Work orders count and the three-dots menu are visible.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
Step 2:

 - The No Charge categories tab shows the rows of category D, category E and category F, each name inside the Category cell.
 - On every row the QuickBooks expense account, Original work order ("Required" or "Not asked"), Work orders and the three-dots menu are visible.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11758 (Story 1, Turn on Internal Work Orders, flag internal customers, manage categories)

 - S1-R13: “Administration > Service > Internal Work Orders is a page with two tabs. Internal categories: columns Category (the default carries a Default badge), QuickBooks expense account (with the QuickBooks mark; "Not set" with a warning icon when empty), Internal customers using it, Work orders (count, all time; a billable work order with a no-charge line of the category counts too), and a row menu with Edit and Archive. No Charge categories: Category, QuickBooks expense account, Original work order (Required / Not asked), Work orders, row menu. Buttons "New Internal Category" and "New No Charge Category". Under the Internal categories tab a hint reads "Set on the customer, or on the asset for one unit. An internal work order takes it when it is created." The starting set is seeded for every organization when this release ships, so the categories, the QuickBooks rows (S5-R5) and the hub rows (S6-R2) exist before the setting is turned on; turning the setting on seeds nothing: General Internal (default, cannot be archived); Warranty (requires the original work order), Goodwill (does not), Comeback (requires). Archived categories stay on the work orders and lines that used them and in the report filter under Archived; a "Show archived (n)" link lists them with Restore. The page needs 'Settings — Service', like every Administration > Service page; while the setting is off it shows the notice "Internal Work Orders is off. Turn it on in Settings > Work Orders." and the lists stay editable. Each list holds up to 100 active categories; past that, the New button is disabled with "You can have up to 100 active categories in this list. Archive one to add another." The QuickBooks expense account column is shown only while the current location is connected to QuickBooks.”
 - S1-R14: “The category dialog ("New Internal Category", "New No Charge Category", or Edit with the current values) has: Name (required, unique within its list including archived categories, refused with "A category with this name is archived. Restore it instead."; 60 characters; helper "It shows in the badge tooltip on the work order, on the NO CHARGE document and in the Internal Work Orders report."); "QuickBooks expense account", one picker per connected location listing that location's expense accounts (the same picker as the ShopView Accounts rows), with the helper "One per connected location, picked from the chart that is already in QuickBooks. Parts cost of this category posts here instead of Cost of Parts. Empty: posts to the ShopView Review account until you pick one."; on a No Charge category the checkbox "Requires the original work order" with the helper "The work order asks which earlier work order the job comes from, or Not in ShopView. Optional when the work order is created, required at Close."; on an Internal category the checkbox "Default category" with the helper "Used by internal customers that have no category of their own. One default at a time; it cannot be archived." Saving the account here and on the QuickBooks page (S5-R1) writes the same mapping; the account pickers are editable only with 'Settings — Integrations' and read-only with the text "Set in Integrations > QuickBooks" otherwise. The dialog shows the AccountingHub mapping as read-only text when the hub is enabled (the row is edited in the hub, S6-R1). A user without access to every connected location sees the pickers of the locations they can access; the other locations keep their mapping.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 0 · Turn it on", boards "2a Internal Work Orders page · Internal categories" (Flow 0 · Turn it on), "2b Internal Work Orders page · No Charge categories" (Flow 0 · Turn it on).
Design pictures attached to this case:

 - iwo-flow0-04-2a-internal-work-orders-page-internal-categories.png
 - iwo-flow0-05-2b-internal-work-orders-page-no-charge-categories.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-101 · Design: Long archived category names read in full with (archived)

Scan proposal I-P09 · folder Design — how it looks (136719) · refs SV-11758 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new Internal category for this test, category B, archived after it was set on customer A, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new Internal category for this test, category C, whose name has the characters & " ' < > (for example Plainsview "Yard" & O'Neil <Units> Upkeep), archived after it was set on customer B.
 - Have a new customer for this test, customer A, flagged as an Internal customer, whose Default internal category is category B.
 - Have a new customer for this test, customer B, flagged as an Internal customer, whose Default internal category is category C.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached pictures iwo-flow0-17-11-edit-customer-min-without.png, iwo-flow0-04-2a-internal-work-orders-page-internal-categories.png at 100% zoom beside the screen.

**Steps**

1. Open customer A's page.
2. Click Edit Customer on customer A's page.
3. Click Cancel.
4. Open customer B's page.
5. Click Edit Customer on customer B's page.
6. Click Cancel.
7. Open Administration > Service > Internal Work Orders.
8. Click the "Show archived" link under the table.

**Expected Result**

Step 1:

 - Customer A's page opens.
Step 2:

 - "Default internal category" shows "[category B's name] (archived)"; the long name with no spaces and "(archived)" stay inside the select box.
 - The hint "Archived. Pick an active category." is visible under it and covers no other field.
Step 3:

 - The window closes.
Step 4:

 - Customer B's page opens.
Step 5:

 - "Default internal category" shows "[category C's name] (archived)" inside the select box, with the hint under it.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
Step 6:

 - The window closes.
Step 7:

 - The Internal categories tab opens.
Step 8:

 - The archived categories show, category B and category C among them, each name inside its Category cell, each with Restore visible.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11758 (Story 1, Turn on Internal Work Orders, flag internal customers, manage categories)

 - S1-R16: “A category has a stable key; renaming it keeps the history, the report filter and the mappings. Archiving a category in use keeps it on existing work orders, lines, documents and reports; it is no longer offered in any select. The default Internal category cannot be archived; changing the default moves nothing on existing customers. The green QuickBooks mark (the existing QuickBooks icon) is shown wherever a field maps to QuickBooks: the account columns and pickers of S1-R13 and S1-R14, the asset field of S1-R15 and the Settings hint of S1-R3. Archiving a category that is the stored default of customers or assets first shows "[n] internal customers and [m] assets use this category as their default. Their new work orders will use the next category in line." The stored value stays on the customer and the asset, shown as "[name] (archived)" with the hint "Archived. Pick an active category."; resolution for a new work order (S2-R1) skips archived categories: the asset's, else the customer's, else the default Internal category, the first active one wins. Restore puts everything back as it was.”
 - S1-R13: “Administration > Service > Internal Work Orders is a page with two tabs. Internal categories: columns Category (the default carries a Default badge), QuickBooks expense account (with the QuickBooks mark; "Not set" with a warning icon when empty), Internal customers using it, Work orders (count, all time; a billable work order with a no-charge line of the category counts too), and a row menu with Edit and Archive. No Charge categories: Category, QuickBooks expense account, Original work order (Required / Not asked), Work orders, row menu. Buttons "New Internal Category" and "New No Charge Category". Under the Internal categories tab a hint reads "Set on the customer, or on the asset for one unit. An internal work order takes it when it is created." The starting set is seeded for every organization when this release ships, so the categories, the QuickBooks rows (S5-R5) and the hub rows (S6-R2) exist before the setting is turned on; turning the setting on seeds nothing: General Internal (default, cannot be archived); Warranty (requires the original work order), Goodwill (does not), Comeback (requires). Archived categories stay on the work orders and lines that used them and in the report filter under Archived; a "Show archived (n)" link lists them with Restore. The page needs 'Settings — Service', like every Administration > Service page; while the setting is off it shows the notice "Internal Work Orders is off. Turn it on in Settings > Work Orders." and the lists stay editable. Each list holds up to 100 active categories; past that, the New button is disabled with "You can have up to 100 active categories in this list. Archive one to add another." The QuickBooks expense account column is shown only while the current location is connected to QuickBooks.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 0 · Turn it on", boards "11 Edit Customer · Min without %" (Flow 0 · Turn it on), "2a Internal Work Orders page · Internal categories" (Flow 0 · Turn it on).
Design pictures attached to this case:

 - iwo-flow0-17-11-edit-customer-min-without.png
 - iwo-flow0-04-2a-internal-work-orders-page-internal-categories.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-102 · Design: Long category names fit the Default internal category select

Scan proposal I-P10a · folder Design — how it looks (136719) · refs SV-11758 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new Internal category for this test, category A, whose name is 60 characters long with spaces (for example Plainsview Company Vehicle and Heavy Equipment Upkeep Region).
 - Have a new Internal category for this test, category B, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new Internal category for this test, category C, whose name has the characters & " ' < > (for example Plainsview "Yard" & O'Neil <Units> Upkeep).
 - Have a new customer for this test, customer A, not flagged.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow0-17-11-edit-customer-min-without.png at 100% zoom beside the screen.

**Steps**

1. Open customer A's page.
2. Click Edit Customer on customer A's page.
3. Tick the "Internal customer" checkbox.
4. Open the "Default internal category" select.
5. Pick category B.
6. Open the "Default internal category" select.
7. Pick category C.

**Expected Result**

Step 1:

 - Customer A's page opens.
Step 2:

 - The Edit Customer window opens.
Step 3:

 - The select "Default internal category" appears under the checkbox.
Step 4:

 - The list shows category A, category B and category C, each name inside its own row; no name runs over the next row or out of the list.
Step 5:

 - The select box shows category B's name; it stays inside the box and covers neither the helper under it nor the window's edge.
 - The helper "Used by every new internal work order for this customer unless the asset has its own category." is visible.
Step 6:

 - The list opens again.
Step 7:

 - The select box shows category C's name.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11758 (Story 1, Turn on Internal Work Orders, flag internal customers, manage categories)

 - S1-R7: “Edit Customer shows the checkbox "Internal customer" as the last field of the dialog, below "PO is required", with the helper "Work orders for this customer are internal: no prices, no invoice, parts cost posts to the expense account of the internal category." When ticked, the select "Default internal category" appears under it, listing the active Internal categories, General Internal preselected, with the helper "Used by every new internal work order for this customer unless the asset has its own category." It is shown while the setting is on (S1-N4 for the exception). New Customer does not show it: a customer is flagged after it exists, from Edit Customer or the modal. The checkbox and the modal are the only places the flag is set; ticking it on Save flags the customer (with the dialog of S1-R11 when open billable work orders exist).”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 0 · Turn it on", board "11 Edit Customer · Min without %" (Flow 0 · Turn it on).
Design pictures attached to this case:

 - iwo-flow0-17-11-edit-customer-min-without.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-103 · Design: Long category names fit the Internal category select on Edit Asset

Scan proposal I-P10b · folder Design — how it looks (136719) · refs SV-11758 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new Internal category for this test, category B, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new Internal category for this test, category C, whose name has the characters & " ' < > (for example Plainsview "Yard" & O'Neil <Units> Upkeep).
 - Have a new customer for this test, customer A, flagged as an Internal customer, whose Default internal category is category B, with one asset.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow0-18-11b-edit-asset-internal-category.png at 100% zoom beside the screen.

**Steps**

1. Open customer A's asset.
2. Click Edit on the asset's page.
3. Open the "Internal category" select.
4. Pick category C.

**Expected Result**

Step 1:

 - The asset's page opens.
Step 2:

 - Under a divider the select "Internal category" shows, with the helper ending "Leave it empty to use the customer's category, [category B's name]."
 - Category B's name in the helper shows in full and stays inside the window.
Step 3:

 - The list shows category B and category C, each inside its own row.
Step 4:

 - The select box shows category C's name inside the box.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
 - The window's Save and Cancel buttons are visible.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11758 (Story 1, Turn on Internal Work Orders, flag internal customers, manage categories)

 - S1-R15: “Edit Asset of an internal customer shows, after the existing fields and under a divider, the select "Internal category" (the active Internal categories; empty means the customer's default) with the helper, led by the QuickBooks mark, "Categories are mapped to QuickBooks expense accounts. This one is where the asset's internal work orders post. Leave it empty to use the customer's category, [customer's default]." The field is not shown on assets of other customers, nor while the setting is off. A new internal work order on the asset takes this category (S2-R1).”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 0 · Turn it on", board "11b Edit Asset · internal category" (Flow 0 · Turn it on).
Design pictures attached to this case:

 - iwo-flow0-18-11b-edit-asset-internal-category.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-104 · Design: Long category names keep their own rows in QuickBooks ShopView Accounts

Scan proposal I-P11 · folder Design — how it looks (136719) · refs SV-11762 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Make sure the test location is connected to QuickBooks Online and that AccountingHub is not enabled.
 - Have a new Internal category for this test, category A, whose name is 60 characters long with spaces (for example Plainsview Company Vehicle and Heavy Equipment Upkeep Region).
 - Have a new Internal category for this test, category B, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new No Charge category for this test, category C, whose name has the characters & " ' < > (for example Plainsview "Yard" & O'Neil <Units> Upkeep).
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached pictures iwo-flow0-15-09-settings-integrations-quickbooks.png, iwo-flow0-16-10-quickbooks-category-row-not-set.png at 100% zoom beside the screen.

**Steps**

1. Open Settings > Integrations > QuickBooks.

**Expected Result**

Step 1:

 - Under "Internal work orders" the ShopView Accounts rows of category A and category B show, and under "No Charge work orders" the row of category C.
 - Each row's name stays inside the row's label and covers neither its account picker nor the row below.
 - Under each of these rows the hint reads "Not set. Parts cost of [category's name] work orders posts to the ShopView Review account until you pick one.", with the name in full inside the row.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
 - Every row's account picker is visible.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11762 (Story 5, QuickBooks Online account mapping)

 - S5-R1: “Integrations > QuickBooks, ShopView Accounts, shows one row per category directly under Cost of Parts (above Cost of Goods (tax)), grouped under the headers "Internal work orders" and "No Charge work orders", each row named after its category and carrying the QuickBooks mark. A category the shop adds appears as a new empty row; an archived category keeps its row, greyed, with its mapping, and the row can still be remapped (a reopened work order still posts to its archived category, S12-E8). Under the rows a note reads "Shop supplies on internal and no-charge work orders are credited to the income account of your Shop supplies item in Products And Services; nothing to map here." Nothing is created in QuickBooks: the picker lists the location's existing expense accounts.”
 - S5-R4: “While a category row is empty, the row shows the existing empty-row hint with the text "Not set. Parts cost of [category] work orders posts to the ShopView Review account until you pick one." There is no fallback from one row to another. While the setting is off, empty rows show no hint.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 0 · Turn it on", boards "09 Settings > Integrations > QuickBooks" (Flow 0 · Turn it on), "10 QuickBooks · category row not set" (Flow 0 · Turn it on).
Design pictures attached to this case:

 - iwo-flow0-15-09-settings-integrations-quickbooks.png
 - iwo-flow0-16-10-quickbooks-category-row-not-set.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-105 · Design: New Work Order tooltip with a long category stays readable

Scan proposal I-P12 · folder Design — how it looks (136719) · refs SV-11759 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new Internal category for this test, category B, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new Internal category for this test, category C, whose name has the characters & " ' < > (for example Plainsview "Yard" & O'Neil <Units> Upkeep).
 - Have a new customer for this test, customer A, flagged as an Internal customer, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota), with one asset whose Internal category is category B.
 - Have a new customer for this test, customer B, flagged as an Internal customer, whose name has the characters & " ' < > (for example Plainsview A&B "Fleet" O'Neil <Parts> & Sons), with one asset whose Internal category is category C.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Start on Work Orders.
 - Open the attached picture iwo-flow1-04-2b2-new-work-order-asset-with-its-own-category.png at 100% zoom beside the screen.

**Steps**

1. Click New Work Order.
2. Pick customer A.
3. Pick customer A's asset.
4. Hover the info icon next to the "Internal" badge.
5. Pick customer B in the customer field.
6. Pick customer B's asset.
7. Hover the info icon next to the "Internal" badge.

**Expected Result**

Step 1:

 - The New Work Order window opens.
Step 2:

 - Customer A's name shows in the field with the "Internal" badge and the info icon after it; the long name stays inside the field and does not push the badge out of the window.
Step 3:

 - The asset is picked.
Step 4:

 - The tooltip reads "Internal customer: no prices, no invoice. Posts to [category B's name], from the asset."
 - The tooltip shows category B's name in full, stays on screen and covers no button of the window.
Step 5:

 - Customer B's name shows in the field with the badge and the info icon.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
Step 6:

 - The asset is picked.
Step 7:

 - The tooltip names category C exactly as saved and stays on screen.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11759 (Story 2, An internal or no-charge work order from creation to Close)

 - S2-R1: “In the New Work Order dialog, picking a customer with the Internal customer flag shows the "Internal" badge next to the customer name with an info icon; the tooltip reads "Internal customer: no prices, no invoice. Posts to [category], from the asset." or "... from the customer." (the latter also when neither the asset nor the customer has a category of its own and the default Internal category applies). There is no checkbox to tick and no category to pick on the work order. The work order is created internal with the category resolved as: the asset's Internal category (S1-R15), else the customer's default (S1-R7), else the default Internal category; it is re-resolved while the work order is open when the asset changes or when the category of the asset or the customer is edited (a closed work order never changes), archived categories are skipped (S1-R16), and it can be changed on the asset or the customer, never on the work order. A work order created from an inspection, or from a maintenance reminder once Maintenance Reminders ship, follows the same rule: it is internal when its customer carries the flag at creation, and otherwise billable.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 1 · Create and close", board "2b2 New work order · asset with its own category" (Flow 1 · Create and close).
Design pictures attached to this case:

 - iwo-flow1-04-2b2-new-work-order-asset-with-its-own-category.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-106 · Design: Long names fit the No Charge selects in New Work Order

Scan proposal I-P13a · folder Design — how it looks (136719) · refs SV-11759 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new No Charge category for this test, category B, with "Requires the original work order" ticked, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new user for this test, technician A, a technician whose first name is long with no spaces (for example Bartholomewvanderbiltmontgomeryfitzgerald).
 - Have a new customer for this test, customer A, not flagged, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota), with one asset.
 - Have a new invoiced work order for this test, work order 1, for customer A, whose first line, line 1, has a long title with spaces (for example Replace front and rear brake chambers, slack adjusters and every air line) and was worked by technician A.
 - Have a new invoiced work order for this test, work order 2, for customer A, whose first line has a title with the characters & " ' < > (for example Brakes & "Air" O'Neil <Kit>).
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Start on Work Orders.
 - Open the attached picture iwo-flow1-07-02e-new-work-order-no-charge-ticked.png at 100% zoom beside the screen.

**Steps**

1. Click New Work Order.
2. Pick customer A.
3. Tick "No Charge".
4. Open the "Category" select.
5. Pick category B.
6. Open the "Original work order" select.
7. Pick work order 1.
8. Open the "Original line" select.
9. Pick line 1.

**Expected Result**

Step 1:

 - The New Work Order window opens.
Step 2:

 - Customer A's name shows in the field inside the window.
Step 3:

 - The required select "Category" appears.
Step 4:

 - Category B's row shows its name inside the list; it does not run out of the list.
Step 5:

 - The select box shows category B's name inside the box.
 - The select "Original work order" appears under it.
Step 6:

 - The rows of work order 1 and work order 2 show number, date and first line, each inside its own row; the long line title does not run over the next row.
 - Work order 2's first line shows exactly as saved.
Step 7:

 - The select box shows work order 1 inside the box.
 - The line "Original technician: [names]" shows technician A's name in full inside the window.
Step 8:

 - Line 1's row shows number, title and technician inside the row.
Step 9:

 - The select box shows line 1 inside the box.
 - The buttons at the bottom of the window (Cancel and Save) are visible; no select covers them.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11759 (Story 2, An internal or no-charge work order from creation to Close)

 - S2-R2: “In the New Work Order dialog (New Work Order only; Edit Work Order, which shares the dialog, is unchanged), picking a customer without the flag shows, at the bottom of the dialog below the "Asset Here?" checkbox and separated from it by a divider, an unticked checkbox "No Charge" with an info icon whose tooltip reads "Warranty, goodwill or comeback work. Closes without an invoice; parts cost posts to the expense account of the category." Ticking it reveals the required select "Category" listing the active No Charge categories, empty by default; Save is refused with the field message "Pick a category" until one is picked. When the category requires the original work order, the select "Original work order" appears under it (the customer's invoiced and closed work orders at the locations the user has access to, those on the same asset first, each as number, date and first line, and "Not in ShopView" under Other), optional here, with the helper "Which earlier work order this job comes from, or Not in ShopView, and the line on it. The line sets the original technician for the comeback and warranty numbers. Optional here, required at Close."; once a work order is picked, the optional select "Original line" lists its lines (number, title, technician). The checkbox is hidden when the selected customer is an internal customer and for users without 'See Financial Data'. Ticked, the work order is created No Charge with that category. It works whether or not any customer is flagged. As soon as a work order or a line is picked, the line "Original technician: [names]" (or "Original technician: none") shows under the selects, so a wrong attribution is seen and corrected by picking the line before anything is saved.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 1 · Create and close", board "02e New work order · No Charge ticked" (Flow 1 · Create and close).
Design pictures attached to this case:

 - iwo-flow1-07-02e-new-work-order-no-charge-ticked.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-107 · Design: Long names fit the Convert to No Charge and Change category selects

Scan proposal I-P13b · folder Design — how it looks (136719) · refs SV-11759 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Make sure the test location has no accounting integration (neither QuickBooks Online nor AccountingHub).
 - Have a new No Charge category for this test, category B, with "Requires the original work order" ticked, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new No Charge category for this test, category C, with "Requires the original work order" unticked, whose name has the characters & " ' < > (for example Plainsview "Yard" & O'Neil <Units> Upkeep).
 - Have a new customer for this test, customer A, not flagged, with one asset.
 - Have a new invoiced work order for this test, work order 1, for customer A, whose first line has a long title with no spaces (for example ReplaceFrontAndRearBrakeChambersSlackAdjustersAndEveryAirLine).
 - Have a new work order for this test, work order 2, for customer A, billable, not invoiced, with no deposit.
 - Have a new No Charge work order for this test, work order 3, for customer A, category C, in Estimate.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached pictures iwo-flow2-04-02-confirm.png, iwo-flow2-07-3c-change-category.png at 100% zoom beside the screen.

**Steps**

1. Open work order 2.
2. Click the three-dots menu in the header.
3. Click Convert to No Charge.
4. Pick category B in Category.
5. Open the "Original work order" select.
6. Click Cancel.
7. Open work order 3.
8. Click the three-dots menu in the header.
9. Click Change category.

**Expected Result**

Step 1:

 - Work order 2 opens.
Step 2:

 - The menu opens.
Step 3:

 - The window "Convert work order [number] to No Charge?" opens.
Step 4:

 - The select box shows category B's name inside the box; it covers neither the window's edge nor the selects that appear under it.
 - The selects "Original work order" and "Original line" appear.
Step 5:

 - Work order 1's row shows its number, date and first line inside the row; the long title with no spaces does not run out of the list.
Step 6:

 - The window closes; work order 2 shows no "No Charge" badge.
Step 7:

 - Work order 3 opens.
Step 8:

 - The menu opens.
Step 9:

 - The window "Change category for work order [number]" opens with category C's name preselected inside the Category box.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
 - The buttons Cancel and Save are visible.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11759 (Story 2, An internal or no-charge work order from creation to Close)

 - S2-R5: “On a billable work order on a regular customer, the three-dots menu offers "Convert to No Charge" (next to Add Work Order Fee / Discount) until the work order is invoiced. It opens the confirmation "Convert work order [number] to No Charge?" with the body "Prices, fees and discounts are removed from every line; costs and hours are kept. It closes with a NO CHARGE document instead of an invoice. You can convert it back until it is closed.", the required select "Category" (active No Charge categories; empty by default, "Pick a category" when missing), the selects "Original work order" and "Original line" of S2-R2 when the category requires it, and the buttons Cancel and "Convert to No Charge". Confirming applies S2-R3 and S2-R4, stores the category, the original work order and line, and writes the note of S2-R18. There is no checkbox on the work order detail. If the work order already carries no-charge lines (Story 12), converting it makes every line No Charge under the chosen category; the lines' own categories are replaced and the note names them.”
 - S2-R6: “On a no-charge work order the menu offers "Change category" and "Convert to Billable" until the work order is closed. Convert to Billable opens "Convert work order [number] to billable?" with the body "Every line is priced as a new line would be today. You can convert it to no charge again until it is invoiced." and the buttons Cancel and "Convert to Billable"; confirming removes the badge and the category, and every line comes back billable, including lines that carried their own No Charge mark before the work order was converted (S2-R5 replaced their categories; the advisor marks them again if needed), priced the way a new line on this work order would be priced that day: labor at the customer's labor rate, else the location's; parts from the pricing rules applied to the cost already on the line (the cost Close would post), not today's catalogue cost. Change category opens the dialog "Change category for work order [number]" with the Category select (the current category preselected) and, when the new category requires it, the Original work order and Original line selects of S2-R2 (changing to a category that does not require them clears them) and the buttons Cancel and Save; Save is enabled once the category, the original work order or the original line differs from the current values (as on a line, S12-R5), so a missing original can be added before Close; it changes nothing else. It is offered while the setting is off too (S2-N1). After Close the category is locked with the classification (S2-R9); a wrong category on a closed work order is fixed by Reopen, Change category and Close again, an accepted cost of one lock for everything. Cancelling or dismissing any of these leaves the work order as it was. If a no-charge estimate was sent to the portal, after Convert to Billable the portal hides the NO CHARGE stamp and shows the live price summary; Approve and Decline keep working and the advisor re-sends when wanted.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 2 · No charge on a customer's work order", boards "02 Confirm" (Flow 2 · No charge on a customer's work order), "3c Change category" (Flow 2 · No charge on a customer's work order).
Design pictures attached to this case:

 - iwo-flow2-04-02-confirm.png
 - iwo-flow2-07-3c-change-category.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-108 · Design: Mark this line window keeps a long line title inside the window

Scan proposal I-P14 · folder Design — how it looks (136719) · refs SV-12226 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new user for this test, technician A, a technician whose first name is long with no spaces (for example Bartholomewvanderbiltmontgomeryfitzgerald).
 - Have a new customer for this test, customer A, not flagged.
 - Have a new work order for this test, work order 1, for customer A, billable, not invoiced, whose line 1 has a long title with no spaces (for example ReplaceFrontAndRearBrakeChambersSlackAdjustersAndEveryAirLine), 1.0 h of labor by technician A and one stock part with a cost, and whose line 2 has a title with the characters & " ' < > (for example Brakes & "Air" O'Neil <Kit>).
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow6-02-02-mark-this-line-as-no-charge.png at 100% zoom beside the screen.

**Steps**

1. Open work order 1.
2. Click the three-dots menu of line 1.
3. Click Mark as No Charge.
4. Click Cancel.
5. Click the three-dots menu of line 2.
6. Click Mark as No Charge.

**Expected Result**

Step 1:

 - Work order 1 opens.
Step 2:

 - The line menu opens.
Step 3:

 - The window "Mark this line as No Charge?" opens with the line summary (title, hours, parts, technician, current price).
 - Line 1's long title and technician A's name show in full and stay inside the window; nothing runs past its edge.
 - The body, the Category select and the buttons Cancel and "Mark as No Charge" are visible; the summary covers none of them.
Step 4:

 - The window closes.
Step 5:

 - The line menu opens.
Step 6:

 - The line summary shows line 2's title exactly as saved.
 - The title shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-12226 (Story 12, A no-charge line on a billable work order)

 - S12-R2: “Mark as No Charge opens the dialog "Mark this line as No Charge?" with the line summary (title, hours, parts, technician, current price), the body "The line stays on this work order and shows $0.00 on the invoice. Hours, parts and the story stay; the technician works it like any other line. When the invoice is created, the parts cost of this line posts to the expense account of the category instead of Cost of Parts.", the required select Category (active No Charge categories, "Pick a category" when missing), the selects Original work order and Original line when the category requires it (optional here; helper and the "Original technician: [names]" line as in S2-R2, with "required before the invoice is created"), and the buttons Cancel and "Mark as No Charge".”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 6 · Move one line off a billable work order", board "02 Mark this line as No Charge?" (Flow 6 · Move one line off a billable work order).
Design pictures attached to this case:

 - iwo-flow6-02-02-mark-this-line-as-no-charge.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-109 · Design: Work orders list keeps every column visible with long customer names

Scan proposal I-P15 · folder Design — how it looks (136719) · refs SV-11759 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new customer for this test, customer A, flagged as an Internal customer, whose name is long with spaces (for example Plainsview Heavy Truck and Trailer Repair Services of North Dakota).
 - Have a new customer for this test, customer B, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new customer for this test, customer C, whose name has the characters & " ' < > (for example Plainsview A&B "Fleet" O'Neil <Parts> & Sons).
 - Have a new internal work order for this test, work order 1, for internal customer A, in Estimate.
 - Have a new No Charge work order for this test, work order 2, for customer B, category Goodwill, in Estimate.
 - Have a new work order for this test, work order 3, for customer C, billable, in Estimate.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow4-01-01-work-orders-list.png at 100% zoom beside the screen.

**Steps**

1. Open Work Orders.
2. Type "Plainsview" in the work orders search.
3. Resize the browser window to 1536 pixels wide.

**Expected Result**

Step 1:

 - The work orders list opens.
Step 2:

 - The rows of work order 1, work order 2 and work order 3 show.
 - Each customer name stays inside the Customer cell; customer B's name with no spaces does not run over the next column.
 - Work order 1 shows the "Internal" badge and work order 2 the "No Charge" badge; each badge is fully visible and covered by nothing.
 - Work order 1 and work order 2 show "No Charge" in Total Price.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
 - Every column heading of the list is on screen without scrolling sideways, Total Price included.
Step 3:

 - The same rows show with each name inside its cell, both badges visible and every column heading on screen.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11759 (Story 2, An internal or no-charge work order from creation to Close)

 - S2-R10: “The work orders list shows the badge in the status column for internal and no-charge work orders in every tab, in the Tech View display and on the mobile card. Open and closed internal and no-charge rows show "No Charge" in Total Price (the column exists only for users with 'See Financial Data'; others see the badge); closed ones show where invoiced ones show (the All tab, Status "Closed"; the filter value Closed appears once the organization has switched the setting on or closed a work order, the trigger that makes the report appear in S9-R4, so a shop that never uses the feature sees its filter as before), not in the Completed tab, which lists work waiting for an invoice. Board cards show the badge, and a closed internal or no-charge work order sits where an invoiced one sits on the Board. Schedule cards show the badge next to the work order number (the card shows no status text); global search results show it next to the status. The Status chip on the All tab gets the value "Closed", which matches only closed internal and no-charge work orders; Invoiced and Paid do not match them. The customer's and the asset's Work Orders tabs show the same badge.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 4 · Find internal and no-charge work orders", board "01 Work orders list" (Flow 4 · Find internal and no-charge work orders).
Design pictures attached to this case:

 - iwo-flow4-01-01-work-orders-list.png
Difference: register IWO-D35: the design draws the badge after the customer name; the PRD puts it in the status column. The case follows the PRD for where the badge is; either way it must stay visible.
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-110 · Design: Board cards keep the badge with long customer names

Scan proposal I-P16a · folder Design — how it looks (136719) · refs SV-11759 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new customer for this test, customer B, flagged as an Internal customer, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new customer for this test, customer C, whose name has the characters & " ' < > (for example Plainsview A&B "Fleet" O'Neil <Parts> & Sons).
 - Have a new internal work order for this test, work order 1, for internal customer B, with one labor line In Progress.
 - Have a new No Charge work order for this test, work order 2, for customer C, category Goodwill, with one labor line In Progress.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow4-10-10-board-internal-card.png at 100% zoom beside the screen.

**Steps**

1. Open the Board.

**Expected Result**

Step 1:

 - The cards of work order 1 and work order 2 show.
 - Each customer name stays inside its own card; customer B's name with no spaces does not run past the card's edge or over the next card.
 - Work order 1's card shows the "Internal" badge and work order 2's the "No Charge" badge; neither is pushed out of the card or covered.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11759 (Story 2, An internal or no-charge work order from creation to Close)

 - S2-R10: “The work orders list shows the badge in the status column for internal and no-charge work orders in every tab, in the Tech View display and on the mobile card. Open and closed internal and no-charge rows show "No Charge" in Total Price (the column exists only for users with 'See Financial Data'; others see the badge); closed ones show where invoiced ones show (the All tab, Status "Closed"; the filter value Closed appears once the organization has switched the setting on or closed a work order, the trigger that makes the report appear in S9-R4, so a shop that never uses the feature sees its filter as before), not in the Completed tab, which lists work waiting for an invoice. Board cards show the badge, and a closed internal or no-charge work order sits where an invoiced one sits on the Board. Schedule cards show the badge next to the work order number (the card shows no status text); global search results show it next to the status. The Status chip on the All tab gets the value "Closed", which matches only closed internal and no-charge work orders; Invoiced and Paid do not match them. The customer's and the asset's Work Orders tabs show the same badge.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 4 · Find internal and no-charge work orders", board "10 Board · internal card" (Flow 4 · Find internal and no-charge work orders).
Design pictures attached to this case:

 - iwo-flow4-10-10-board-internal-card.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-111 · Design: Schedule cards keep the badge with long customer names

Scan proposal I-P16b · folder Design — how it looks (136719) · refs SV-11759 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new customer for this test, customer B, flagged as an Internal customer, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new customer for this test, customer C, whose name has the characters & " ' < > (for example Plainsview A&B "Fleet" O'Neil <Parts> & Sons).
 - Have a new internal work order for this test, work order 1, for internal customer B, with one labor line In Progress.
 - Have a new No Charge work order for this test, work order 2, for customer C, category Goodwill, with one labor line In Progress.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Have work order 1 and work order 2 scheduled today for a technician, so their cards show on today's Schedule.
 - Open the attached picture iwo-flow4-11-11-schedule-card.png at 100% zoom beside the screen.

**Steps**

1. Open Schedule.

**Expected Result**

Step 1:

 - The cards of work order 1 and work order 2 show on today's Schedule.
 - Each card shows the badge next to the work order number; the badge is not pushed out of the card or covered.
 - Each customer name stays inside its own card and covers neither the number nor the next card.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11759 (Story 2, An internal or no-charge work order from creation to Close)

 - S2-R10: “The work orders list shows the badge in the status column for internal and no-charge work orders in every tab, in the Tech View display and on the mobile card. Open and closed internal and no-charge rows show "No Charge" in Total Price (the column exists only for users with 'See Financial Data'; others see the badge); closed ones show where invoiced ones show (the All tab, Status "Closed"; the filter value Closed appears once the organization has switched the setting on or closed a work order, the trigger that makes the report appear in S9-R4, so a shop that never uses the feature sees its filter as before), not in the Completed tab, which lists work waiting for an invoice. Board cards show the badge, and a closed internal or no-charge work order sits where an invoiced one sits on the Board. Schedule cards show the badge next to the work order number (the card shows no status text); global search results show it next to the status. The Status chip on the All tab gets the value "Closed", which matches only closed internal and no-charge work orders; Invoiced and Paid do not match them. The customer's and the asset's Work Orders tabs show the same badge.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 4 · Find internal and no-charge work orders", board "11 Schedule · card" (Flow 4 · Find internal and no-charge work orders).
Design pictures attached to this case:

 - iwo-flow4-11-11-schedule-card.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-112 · Design: Tech View keeps the badge with long customer names

Scan proposal I-P16c · folder Design — how it looks (136719) · refs SV-11759 · held: no

**Preconditions**

- Sign in as a technician assigned to the labor lines of work order 1 and work order 2.
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new customer for this test, customer B, flagged as an Internal customer, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new customer for this test, customer C, whose name has the characters & " ' < > (for example Plainsview A&B "Fleet" O'Neil <Parts> & Sons).
 - Have a new internal work order for this test, work order 1, for internal customer B, with one labor line In Progress.
 - Have a new No Charge work order for this test, work order 2, for customer C, category Goodwill, with one labor line In Progress.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow4-09-09-tech-view.png at 100% zoom beside the screen.

**Steps**

1. Open Tech View.

**Expected Result**

Step 1:

 - Work order 1 and work order 2 show, each with its badge next to the number.
 - Each customer name stays inside its own card or row and covers neither the badge nor the next work order.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11759 (Story 2, An internal or no-charge work order from creation to Close)

 - S2-R10: “The work orders list shows the badge in the status column for internal and no-charge work orders in every tab, in the Tech View display and on the mobile card. Open and closed internal and no-charge rows show "No Charge" in Total Price (the column exists only for users with 'See Financial Data'; others see the badge); closed ones show where invoiced ones show (the All tab, Status "Closed"; the filter value Closed appears once the organization has switched the setting on or closed a work order, the trigger that makes the report appear in S9-R4, so a shop that never uses the feature sees its filter as before), not in the Completed tab, which lists work waiting for an invoice. Board cards show the badge, and a closed internal or no-charge work order sits where an invoiced one sits on the Board. Schedule cards show the badge next to the work order number (the card shows no status text); global search results show it next to the status. The Status chip on the All tab gets the value "Closed", which matches only closed internal and no-charge work orders; Invoiced and Paid do not match them. The customer's and the asset's Work Orders tabs show the same badge.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 4 · Find internal and no-charge work orders", board "09 Tech View" (Flow 4 · Find internal and no-charge work orders).
Design pictures attached to this case:

 - iwo-flow4-09-09-tech-view.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-113 · Design: A long category in the No Charge chip keeps the line's columns in place

Scan proposal I-P17a · folder Design — how it looks (136719) · refs SV-12226 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new No Charge category for this test, category B, with "Requires the original work order" unticked, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new No Charge category for this test, category C, with "Requires the original work order" unticked, whose name has the characters & " ' < > (for example Plainsview "Yard" & O'Neil <Units> Upkeep).
 - Have a new customer for this test, customer A, not flagged.
 - Have a new work order for this test, work order 1, for customer A, billable, not invoiced, whose line 1 has a long title with spaces (for example Replace front and rear brake chambers, slack adjusters and every air line) and is marked No Charge under category B, and whose line 2 has a title with the characters & " ' < > (for example Brakes & "Air" O'Neil <Kit>) and is marked No Charge under category C.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached pictures iwo-flow6-03-03-line-marked-no-charge-0-00.png, iwo-flow6-04-04-line-menu-change-category-mark-as-billable.png at 100% zoom beside the screen.

**Steps**

1. Open work order 1.
2. Resize the browser window to 1536 pixels wide.

**Expected Result**

Step 1:

 - Line 1 shows the chip "No Charge · [category B's name]" next to its title, and line 2 the chip "No Charge · [category C's name]".
 - Each title and its chip stay inside the Name/Description cell; neither runs over Actual/Estimate.
 - On both lines Actual/Estimate, Status, Rate ($0.00), Total ($0.00) and the three-dots menu are visible.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
Step 2:

 - The same: each chip inside the Name/Description cell, every column and the three-dots menus visible.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-12226 (Story 12, A no-charge line on a billable work order)

 - S12-R3: “A no-charge line shows the chip "No Charge · [category]" next to its title on the lines table, in Tech View and on mobile; Rate, Total and every part on it show $0.00; Margin shows nothing. Hours, technician, status, approval, parts ordering, picking, receiving, clock-ins, notes, inspections and the story work as on any line. The original work order and line are not shown on the line; they are in the notes, the Audit Log, the report and the hub record.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 6 · Move one line off a billable work order", boards "03 Line marked No Charge · $0.00" (Flow 6 · Move one line off a billable work order), "04 Line menu · Change category, Mark as Billable" (Flow 6 · Move one line off a billable work order).
Design pictures attached to this case:

 - iwo-flow6-03-03-line-marked-no-charge-0-00.png
 - iwo-flow6-04-04-line-menu-change-category-mark-as-billable.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### S12-49 · Print Work Order prints a long No Charge chip beside its line

Scan proposal I-P17b · folder No-charge line on a billable work order (136712) · refs SV-12226 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new No Charge category for this test, category B, with "Requires the original work order" unticked, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new No Charge category for this test, category C, with "Requires the original work order" unticked, whose name has the characters & " ' < > (for example Plainsview "Yard" & O'Neil <Units> Upkeep).
 - Have a new customer for this test, customer A, not flagged.
 - Have a new work order for this test, work order 1, for customer A, billable, not invoiced, whose line 1 is marked No Charge under category B and whose line 2 is marked No Charge under category C.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.

**Steps**

1. Open work order 1.
2. Click the three-dots menu in the header.
3. Click Print Work Order.

**Expected Result**

Step 1:

 - Work order 1 opens.
Step 2:

 - The menu opens.
Step 3:

 - The printed work order shows the chip "No Charge · [category B's name]" next to line 1 and "No Charge · [category C's name]" next to line 2.
 - Each chip shows the category's name in full and stays on the page; it covers no other text of the line.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-12226 (Story 12, A no-charge line on a billable work order)

 - S12-E8: “Mark as No Charge is not offered on a declined line, on a line that already has a return or a credit, or on a line of a work order that is internal or No Charge as a whole. The Board card and any list reading the stored total show the billable total of the work order; Print Work Order prints the "No Charge · [category]" chip next to the line. An asset carrying an Internal category that moves to a customer without the flag keeps the stored value, hidden until the customer is flagged. Reopen then Close on a work order whose category was archived in between keeps the archived category and its account. The customer page Fees & Discounts tab keeps the history of removed adjustments as it does for deleted ones today.”
The build is not yet available to check this case against.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-114 · Design: Posting summary and Close window keep long category names inside

Scan proposal I-P18 · folder Design — how it looks (136719) · refs SV-11760 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Make sure the test location is connected to QuickBooks Online and that AccountingHub is not enabled.
 - Have a new No Charge category for this test, category B, with "Requires the original work order" ticked, with no QuickBooks expense account, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new No Charge category for this test, category C, with "Requires the original work order" unticked, with no QuickBooks expense account, whose name has the characters & " ' < > (for example Plainsview "Yard" & O'Neil <Units> Upkeep).
 - Have a new customer for this test, customer A, not flagged.
 - Have a new No Charge work order for this test, work order 1, for customer A, category B, with no original work order, every line Complete, with one stock part with a cost.
 - Have a new No Charge work order for this test, work order 2, for customer A, category C, every line Complete, with one stock part with a cost.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached pictures iwo-flow1-17-7b-finance-tab-no-account-set-v13.png, iwo-flow2-11-4b-close-original-work-order-required-v13.png at 100% zoom beside the screen.

**Steps**

1. Open work order 1.
2. Open the Finance tab.
3. Click Close Work Order on the Finance tab.
4. Click Cancel.
5. Open work order 2.
6. Open the Finance tab.

**Expected Result**

Step 1:

 - Work order 1 opens.
Step 2:

 - The posting summary's Stock parts row carries the note "No account set for [category B's name]. The entry posts to the ShopView Review account until you set one." with a "Set account" link.
 - The note shows category B's name in full and stays inside the posting summary; it covers neither the amount nor the row below.
Step 3:

 - A window "Close work order [number]?" opens with the warning "[category B's name] requires the original work order. Pick the earlier work order this job comes from, or Not in ShopView."
 - The warning stays inside the window; the selects, Cancel and "Close Work Order" are visible.
Step 4:

 - The window closes; work order 1's header shows no Closed status.
Step 5:

 - Work order 2 opens.
Step 6:

 - The Stock parts note names category C exactly as saved, inside the posting summary.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11760 (Story 3, Close an internal or no-charge work order)

 - S3-N4: “If no account is mapped for the work order's classification (for a no-charge work order in QuickBooks, no account for the work order's category), the posting summary of S3-R2 replaces the account note with: QuickBooks, "No account set for [category]. The entry posts to the ShopView Review account until you set one." with a "Set account" link to Integrations > QuickBooks; AccountingHub, "No account set for [category]. The entry is held in Accounting Events until you set one." with a link to Account Mappings. The link is shown only to users with 'Settings — Integrations' (QuickBooks) or 'Accounting — Settings' (AccountingHub); others see the note without the link. The Shop supplies row follows the same rule when the Shop supplies item is not mapped (S10-N2). Close Work Order is not blocked and closes as in S3-R3. At a QuickBooks location without Inventory Asset or Cost of Parts, the parts rows carry the note of S7-N5 instead.”
 - S3-R2: “Close asks nothing in the common case. The Finance tab of an open internal or no-charge work order carries, where a billable work order has the Invoice Date field and the invoice preview, the field "Posting date" (default today; it follows the rules of Invoice Date today, and it is the date of the internal invoice, of every entry, and of the record in every report, export and the asset Invoices tab), the preview of the NO CHARGE document (S3-R5) and, for users with 'See Financial Data', a posting summary with these rows: "Stock parts $[stock parts cost]" with the note "Posted to [mapped account name]" (the amount reads "$[amount], includes $[core amount] core cost" when a picked part carries a core, S2-E7); "Special orders and sublet $[amount]", one line per state present: already posted to the work order's account (note "Already posted to [account] at the vendor bill"), posted elsewhere and reclassed at Close (note "Moved from [account] to [account]"), and not yet billed (note "Posts to [account] when the vendor bill is entered"); the amount is the vendor bill line amount for billed items and the line cost for items not yet billed; the row is hidden when there are none; "Labor [hours] h" with the note "Hours only, nothing posted"; "Shop supplies $[amount]" with the note "Posted to [work order's expense account], credited to [shop supplies account]" (row hidden when the amount is $0.00); under the rows, "Closing posts the parts cost and shop supplies to your books and marks the work order Closed · Internal. You can reopen it later." (Closed · No Charge on a no-charge work order). The document and the report show one Parts cost: stock parts plus special orders (S3-R5). Parts cost is the cost on each line at Close, as invoicing posts to Cost of Parts today; the hours are the labor hours on the lines. With both QuickBooks and AccountingHub, each note names the QuickBooks account and the AccountingHub account. The summary is information, never a step: Close Work Order from the header, the menu, the bulk bar or the wizard closes without opening anything. Two cases open a dialog before closing, each only when its case applies: (1) a no-charge work order whose category requires the original work order and has none: "Close work order [number]?" with the selects "Original work order *" and "Original line" of S2-R2, the warning "[Category] requires the original work order. Pick the earlier work order this job comes from, or Not in ShopView.", and the buttons Cancel and "Close Work Order", disabled until one is picked; Goodwill never shows this; (2) a vendor bill whose cost moves to another account at Close (S7-R4), at a location with an accounting integration: "Close work order [number]?" with one "Moved from [account] to [account] $[amount]" row per pair of accounts, the amounts added up, and the buttons Cancel and "Close Work Order", the same dialog Create invoice shows for a move (S7-R8). When both apply, one dialog carries the selects above the rows.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): pages "Flow 1 · Create and close" / "Flow 2 · No charge on a customer's work order", boards "7b Finance tab · no account set" (Flow 1 · Create and close), "4b Close · original work order required" (Flow 2 · No charge on a customer's work order).
Design pictures attached to this case:

 - iwo-flow1-17-7b-finance-tab-no-account-set-v13.png
 - iwo-flow2-11-4b-close-original-work-order-required-v13.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-115 · Design: Cost move window with long part names keeps Cancel and Continue visible

Scan proposal I-P19 · folder Design — how it looks (136719) · refs SV-11759 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Make sure the test location is connected to QuickBooks Online and that AccountingHub is not enabled.
 - Have a new customer for this test, customer C, flagged as an Internal customer.
 - Have a new customer for this test, customer A, whose name is long with spaces (for example Plainsview Heavy Truck and Trailer Repair Services of North Dakota).
 - Have a new customer for this test, customer B, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new work order for this test, work order 1, for customer A, billable, with one special-order part whose vendor bill is posted, the part's name long with spaces and the characters & " ' < > (for example Plainsview front brake caliper & "Bracket" O'Neil <Kit> assembly).
 - Have a new work order for this test, work order 2, for customer B, billable, with one special-order part whose vendor bill is posted, the part's name long with no spaces (for example PlainsviewFrontBrakeCaliperAssemblyWithBracketPadsAndHardware).
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow1-05-2c-change-customer-bill-already-posted.png at 100% zoom beside the screen.

**Steps**

1. Open work order 1.
2. Click Change Customer on the customer card.
3. Pick customer C.
4. Click Cancel.
5. Open work order 2.
6. Click Change Customer on the customer card.
7. Pick customer C.

**Expected Result**

Step 1:

 - Work order 1 opens.
Step 2:

 - The customer picker opens.
Step 3:

 - The window "Change where the cost is posted?" opens with the body "The vendor bill for [part's name] ($[amount]) was posted to [account]. If you continue, that cost moves to [account] when this work order is closed."
 - The part's name shows in full and stays inside the window.
 - The part's name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
 - The buttons Cancel and "Continue" are visible; the text covers neither.
Step 4:

 - The window closes and work order 1 keeps customer A.
Step 5:

 - Work order 2 opens.
Step 6:

 - The customer picker opens.
Step 7:

 - The window names work order 2's part in full; the long name with no spaces stays inside the window and does not run past its edge.
 - The buttons Cancel and "Continue" are visible.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11759 (Story 2, An internal or no-charge work order from creation to Close)

 - S2-R8: “If a vendor bill already exists on the work order, a customer change (S2-R7), a Convert action (S2-R5, S2-R6) or, on a line that has a posted vendor bill, Mark as No Charge, Change category or Mark as Billable (Story 12) first shows the dialog "Change where the cost is posted?" with the body "The vendor bill for [part] ($[amount]) was posted to [account]. If you continue, that cost moves to [account] when this work order is [invoiced / closed]." For several bills: "The vendor bills for [n] parts ($[total]) were posted to [account]. ..." Buttons: Cancel and "Continue". The account names are the shop's own mapping rows (Cost of Parts, or the expense account of a category); between the expense accounts of two categories the dialog names both. Not shown when the location has no accounting integration.”
 - User Feedback Summary: “Customer change, Convert or a line No Charge change with a vendor bill | "The vendor bill for [part] ($[amount]) was posted to [account]. If you continue, that cost moves to [account] when this work order is [invoiced / closed]." | Confirmation dialog, Cancel / Continue”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 1 · Create and close", board "2c Change customer · bill already posted" (Flow 1 · Create and close).
Design pictures attached to this case:

 - iwo-flow1-05-2c-change-customer-bill-already-posted.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-116 · Design: System notes with long category and line names stay inside the note

Scan proposal I-P20 · folder Design — how it looks (136719) · refs SV-11759,SV-12226 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new No Charge category for this test, category A, with "Requires the original work order" unticked, whose name is 60 characters long with spaces (for example Plainsview Company Vehicle and Heavy Equipment Upkeep Region).
 - Have a new No Charge category for this test, category C, with "Requires the original work order" unticked, whose name has the characters & " ' < > (for example Plainsview "Yard" & O'Neil <Units> Upkeep).
 - Have a new customer for this test, customer A, not flagged.
 - Have a new work order for this test, work order 1, for customer A, billable, whose line 1 has a long title with no spaces (for example ReplaceFrontAndRearBrakeChambersSlackAdjustersAndEveryAirLine) and was marked No Charge under category A with Not in ShopView as original, and whose line 2 has a title with the characters & " ' < > (for example Brakes & "Air" O'Neil <Kit>) and was marked No Charge under category C.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow6-05-05-notes-and-audit-log.png at 100% zoom beside the screen.

**Steps**

1. Open work order 1.
2. Click the Notes tab.
3. Click the three-dots menu in the header.
4. Click Audit Log.

**Expected Result**

Step 1:

 - Work order 1 opens.
Step 2:

 - The note "Line '[line 1's title]' marked No Charge by [user]. Category [category A's name], ..." shows, author ShopView, with the time.
 - The long title with no spaces and category A's name stay inside the note; no text runs past its edge or over the next note.
 - The note for line 2 shows its title and category C exactly as saved.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
Step 3:

 - The menu opens.
Step 4:

 - The Audit Log shows a row for each mark; each row's text stays inside its row and covers neither the next row nor the time.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11759 (Story 2, An internal or no-charge work order from creation to Close), story SV-12226 (Story 12, A no-charge line on a billable work order)

 - S12-R6: “Each action writes a system note on the work order and an Audit Log row (S2-R18): "Line '[title]' marked No Charge by [user]. Category [name], original work order [number], original line [number]. Line price $[price] removed; cost $[cost] and [hours] h kept. The work order stays billable."; "Category of line '[title]' changed from [a] to [b] by [user]."; "Line '[title]' marked Billable by [user]. Priced as a new line would be today: $[price]. Category [name] removed."”
 - S2-R18: “Every classification change writes a read-only system note on the work order (Notes tab, author ShopView, with the user and the time) and an Audit Log row: Convert to No Charge ("Converted to No Charge by [user]. Category [name], original work order [number]. Prices, fees and discounts removed; costs and hours kept."), Change category (from, to, original work order kept or cleared), Convert to Billable ("Every line priced as a new line would be today. Category [name] removed."), Close (posting date, account), Reopen, and the line actions of Story 12 (S12-R6). Work order numbers in notes are links.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 6 · Move one line off a billable work order", board "05 Notes and Audit Log" (Flow 6 · Move one line off a billable work order).
Design pictures attached to this case:

 - iwo-flow6-05-05-notes-and-audit-log.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-117 · Design: NO CHARGE document keeps a long category line left, clear of the logo

Scan proposal I-P21a · folder Design — how it looks (136719) · refs SV-11760 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new No Charge category for this test, category B, with "Requires the original work order" ticked, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a shop logo set for the test location, so the masthead shows it.
 - Have a new customer for this test, customer A, not flagged, whose name is long with spaces and has the characters & " ' < > (for example Plainsview Heavy Truck & Trailer "Fleet" O'Neil <Parts> Repair Services).
 - Have a new invoiced work order for this test, work order 2, for customer A.
 - Have a new No Charge work order for this test, work order 1, for customer A, category B, original work order work order 2, closed.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow2-12-05-finance-tab-closed.png at 100% zoom beside the screen.

**Steps**

1. Open work order 1.
2. Open the Finance tab.
3. Click Download.
4. Open the downloaded PDF.
5. Click Print.

**Expected Result**

Step 1:

 - Work order 1 opens.
Step 2:

 - The NO CHARGE document shows the NO CHARGE stamp under the masthead line, on the left, with the line "Category: [category B's name] · Original work order [work order 2's number]".
 - The category line stays on the left and never runs over the logo; the long name with no spaces does not run past the document's edge.
 - Bill to shows customer A's name in full, inside its block.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
Step 3:

 - A PDF file downloads.
Step 4:

 - The PDF shows, under the masthead line and on the left, the NO CHARGE stamp with the line "Category: [category B's name]"; the line stays on the left and never runs over the logo.
 - Customer A's name shows in full inside the Bill to block.
Step 5:

 - The print preview opens.
 - The print preview shows, under the masthead line and on the left, the NO CHARGE stamp with the line "Category: [category B's name]"; the line stays on the left and never runs over the logo.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11760 (Story 3, Close an internal or no-charge work order)

 - S3-R5: “The Finance tab of a closed work order shows the NO CHARGE document: the masthead as on the invoice today (letterhead left, the shop logo in the centre slot, the document block "Internal Work Order [number]" or "No Charge Work Order [number]" with the date right), and under the masthead line, on the left and never over the logo, the INTERNAL or NO CHARGE stamp with the line "Category: [name]" and, when set, "· Original work order [number]" (a link in ShopView, plain on the PDF), Bill to the customer, the asset block, labor lines with hours only, parts lines with quantity and cost only (cost under 'See Financial Data'), a Summary with Parts cost (one number: stock parts plus special orders and sublet, at the amounts of S3-R2, core cost excluded, S2-E7), Shop supplies (when above $0.00) and Labor hours (the labor hours on the lines), and no tax, total, payments, balance or signature block; with Download, Print and Email (the recipient field is empty; the user types the shop's own address or any other; never automatically). The Customer PO field is not required. The internal invoice carries the work order number, as every invoice does today; no number is consumed or skipped. Parts cost on the document and in the report is fixed at Close: a vendor bill entered, edited or deleted after Close posts its own amounts to the work order's expense account (S7-R3) and changes neither the document nor the report. Email uses the invoice email template of today (it carries no amounts) with the subject "Internal Work Order [number]" or "No Charge Work Order [number]".”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 2 · No charge on a customer's work order", board "05 Finance tab · closed" (Flow 2 · No charge on a customer's work order).
Design pictures attached to this case:

 - iwo-flow2-12-05-finance-tab-closed.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-118 · Design: INTERNAL document keeps a long category line left, clear of the logo

Scan proposal I-P21b · folder Design — how it looks (136719) · refs SV-11760 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new Internal category for this test, category B, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a shop logo set for the test location, so the masthead shows it.
 - Have a new customer for this test, customer A, flagged as an Internal customer, with one asset whose Internal category is category B, whose name is long with spaces and has the characters & " ' < > (for example Plainsview Heavy Truck & Trailer "Fleet" O'Neil <Parts> Repair Services).
 - Have a new internal work order for this test, work order 1, for internal customer A on that asset, closed.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow1-22-08-work-order-closed-invoice.png at 100% zoom beside the screen.

**Steps**

1. Open work order 1.
2. Open the Finance tab.
3. Click Download.
4. Open the downloaded PDF.
5. Click Print.

**Expected Result**

Step 1:

 - Work order 1 opens.
Step 2:

 - The document shows the INTERNAL stamp under the masthead line, on the left, with the line "Category: [category B's name]".
 - The category line stays on the left and never runs over the logo; the long name with no spaces does not run past the document's edge.
 - Bill to shows customer A's name in full, inside its block.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
Step 3:

 - A PDF file downloads.
Step 4:

 - The PDF shows, under the masthead line and on the left, the INTERNAL stamp with the line "Category: [category B's name]"; the line stays on the left and never runs over the logo.
 - Customer A's name shows in full inside the Bill to block.
Step 5:

 - The print preview opens.
 - The print preview shows, under the masthead line and on the left, the INTERNAL stamp with the line "Category: [category B's name]"; the line stays on the left and never runs over the logo.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11760 (Story 3, Close an internal or no-charge work order)

 - S3-R5: “The Finance tab of a closed work order shows the NO CHARGE document: the masthead as on the invoice today (letterhead left, the shop logo in the centre slot, the document block "Internal Work Order [number]" or "No Charge Work Order [number]" with the date right), and under the masthead line, on the left and never over the logo, the INTERNAL or NO CHARGE stamp with the line "Category: [name]" and, when set, "· Original work order [number]" (a link in ShopView, plain on the PDF), Bill to the customer, the asset block, labor lines with hours only, parts lines with quantity and cost only (cost under 'See Financial Data'), a Summary with Parts cost (one number: stock parts plus special orders and sublet, at the amounts of S3-R2, core cost excluded, S2-E7), Shop supplies (when above $0.00) and Labor hours (the labor hours on the lines), and no tax, total, payments, balance or signature block; with Download, Print and Email (the recipient field is empty; the user types the shop's own address or any other; never automatically). The Customer PO field is not required. The internal invoice carries the work order number, as every invoice does today; no number is consumed or skipped. Parts cost on the document and in the report is fixed at Close: a vendor bill entered, edited or deleted after Close posts its own amounts to the work order's expense account (S7-R3) and changes neither the document nor the report. Email uses the invoice email template of today (it carries no amounts) with the subject "Internal Work Order [number]" or "No Charge Work Order [number]".”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 1 · Create and close", board "08 Work order · Closed, invoice" (Flow 1 · Create and close).
Design pictures attached to this case:

 - iwo-flow1-22-08-work-order-closed-invoice.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-119 · Design: Portal no-charge estimate keeps a long category line inside the page

Scan proposal I-P22 · folder Design — how it looks (136719) · refs SV-11759 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new No Charge category for this test, category B, with "Requires the original work order" unticked, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new customer for this test, customer A, not flagged, with one asset and a portal contact whose portal login the tester can use, whose name is long with spaces and has the characters & " ' < > (for example Plainsview Heavy Truck & Trailer "Fleet" O'Neil <Parts> Repair Services).
 - Have a new work order for this test, work order 1, for customer A, whose estimate was sent to the portal and which was then converted to No Charge with category B.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow2-15-7b-portal-no-charge-estimate.png at 100% zoom beside the screen.

**Steps**

1. Sign in to the customer portal as customer A's contact.
2. Open work order 1's estimate in the portal.

**Expected Result**

Step 1:

 - The portal opens.
Step 2:

 - The estimate shows the NO CHARGE stamp with the line "Category: [category B's name]" under it.
 - The category line stays inside the page; the long name with no spaces does not run past the page's edge or under other text.
 - Customer A's name shows exactly as saved.
 - No prices show.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11759 (Story 2, An internal or no-charge work order from creation to Close)

 - S2-R4: “Lines on an internal or no-charge work order show quantity, cost (parts) and hours (labor) and no sell prices: the Rate, Margin and Total columns of the lines table (a part's sell price sits in Rate) and the Sell price, Rate and Margin fields of the line and part dialogs are hidden and not required; there is no work order total, tax, fee or discount block; the shop supplies block is the flat amount of Story 10. Cost is shown only to users with 'See Financial Data', as cost is today; other users see quantity and hours. The estimate and invoice documents for these work orders show the same and carry the INTERNAL stamp on an internal work order and the NO CHARGE stamp on a no-charge one, the same as the closed document (S3-R5), and, on a no-charge work order, the line "Category: [Category]" under the stamp; the shop-floor Print Work Order is unchanged (it carries no prices today). Board cards and the statistics that show a work order total show "No Charge" in place of the amount.”
 - S2-R11: “Parts ordering, receiving, picking, clock-ins, approvals, notes, inspections, split and review work exactly as on a billable work order. On an internal work order "Send to Portal" and "Request IBS Approval" are not shown. On a no-charge work order "Send to Portal" works for the estimate as today (the document carries NO CHARGE; the portal estimate shows lines, hours and part quantities on its line cards (on no-charge estimates only; billable cards stay as today) with no prices, no cost and no total, the NO CHARGE stamp and the category line of S2-R16, and Approve and Decline work as today) and is not shown once the work order is closed; "Request IBS Approval" is not shown. The "Approval Required" email follows the page: on a no-charge estimate no amounts or totals, the stamp and the category line instead; on a billable estimate a no-charge line at $0.00 with its category.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 2 · No charge on a customer's work order", board "7b Portal · no-charge estimate" (Flow 2 · No charge on a customer's work order).
Design pictures attached to this case:

 - iwo-flow2-15-7b-portal-no-charge-estimate.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-120 · Design: Invoice shows a long category under the no-charge line title

Scan proposal I-P23 · folder Design — how it looks (136719) · refs SV-12226 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new No Charge category for this test, category B, with "Requires the original work order" unticked, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new No Charge category for this test, category C, with "Requires the original work order" unticked, whose name has the characters & " ' < > (for example Plainsview "Yard" & O'Neil <Units> Upkeep).
 - Have a new customer for this test, customer A, not flagged.
 - Have a new work order for this test, work order 1, for customer A, billable, every line Complete, whose line 2 is marked No Charge under category B and whose line 3 is marked No Charge under category C.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow6-07-07-invoice-the-line-at-0-00-warranty.png at 100% zoom beside the screen.

**Steps**

1. Open work order 1.
2. Click Create invoice.
3. Open the invoice preview on the Finance tab.

**Expected Result**

Step 1:

 - Work order 1 opens.
Step 2:

 - The invoice is created.
Step 3:

 - Line 2 shows at $0.00 with category B's name as a line under its title; line 3 at $0.00 with category C's name under its title.
 - Each category name stays inside the line's description; neither runs over the hours or the $0.00 amounts.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-12226 (Story 12, A no-charge line on a billable work order)

 - S12-R7: “Create invoice works as today. The invoice (preview, PDF, email, portal) shows the no-charge line with its hours and parts at $0.00 and the category name as a line under the title ("Warranty"); no stamp, no badge, no "No Charge" wording elsewhere on the document. The invoice statement of the line is priced 0 and flagged no_charge with the category and the original work order, line and technician, the way a declined line's statement is priced 0 today; its items are priced 0. The statement keeps the line's hours and labour rate for the record.”
 - User Feedback Summary: “Invoice with a no-charge line | "[Category]" under the line title; the line at $0.00 | Invoice preview, PDF, email and portal; no stamp, no badge (S12-R7)”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 6 · Move one line off a billable work order", board "07 Invoice · the line at $0.00, Warranty" (Flow 6 · Move one line off a billable work order).
Design pictures attached to this case:

 - iwo-flow6-07-07-invoice-the-line-at-0-00-warranty.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-121 · Design: Missing original work order message with a long line title is readable

Scan proposal I-P24 · folder Design — how it looks (136719) · refs SV-12226 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new customer for this test, customer A, not flagged.
 - Have a new work order for this test, work order 1, for customer A, billable, every line Complete, whose line 2 has a long title with no spaces (for example ReplaceFrontAndRearBrakeChambersSlackAdjustersAndEveryAirLine) and is marked No Charge under Comeback with no original work order.
 - Have a new work order for this test, work order 2, for customer A, billable, every line Complete, whose line 2 has a title with the characters & " ' < > (for example Brakes & "Air" O'Neil <Kit>) and is marked No Charge under Comeback with no original work order.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow6-06-06-edit-line-no-charge-in-the-dialog.png at 100% zoom beside the screen.

**Steps**

1. Open work order 1.
2. Click Create invoice.
3. Open work order 2.
4. Click Create invoice.

**Expected Result**

Step 1:

 - Work order 1 opens.
Step 2:

 - Create invoice is refused with the message "Line '[line 2's title]' needs its original work order (or Not in ShopView) before the invoice."
 - The message shows the long title with no spaces in full and stays on screen; it does not run past the screen's edge.
 - Edit Line opens on line 2.
Step 3:

 - Work order 2 opens.
Step 4:

 - The message names line 2's title exactly as saved.
 - The title shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-12226 (Story 12, A no-charge line on a billable work order)

 - S12-R9: “Create invoice is refused while a no-charge line of a category that requires it has no original work order: the message "Line '[title]' needs its original work order (or Not in ShopView) before the invoice." names the line, and Edit Line opens on it. Convert to No Charge on a work order with no-charge lines follows S2-R5.”
 - User Feedback Summary: “Create invoice with a required original work order missing | "Line '[title]' needs its original work order (or Not in ShopView) before the invoice." | Create invoice refused; Edit Line opens on the line (S12-R9)”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 6 · Move one line off a billable work order", board "06 Edit Line · No Charge in the dialog" (Flow 6 · Move one line off a billable work order).
Design pictures attached to this case:

 - iwo-flow6-06-06-edit-line-no-charge-in-the-dialog.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-122 · Design: Report summary cards with long category names stay readable

Scan proposal I-P26 · folder Design — how it looks (136719) · refs SV-11766 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new Internal category for this test, category A, whose name is 60 characters long with spaces (for example Plainsview Company Vehicle and Heavy Equipment Upkeep Region).
 - Have a new No Charge category for this test, category B, with "Requires the original work order" unticked, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new No Charge category for this test, category C, with "Requires the original work order" unticked, whose name has the characters & " ' < > (for example Plainsview "Yard" & O'Neil <Units> Upkeep).
 - Have a new customer for this test, customer A, flagged as an Internal customer, whose Default internal category is category A.
 - Have a new customer for this test, customer B, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new internal work order for this test, work order 1, for internal customer A, closed this month.
 - Have a new No Charge work order for this test, work order 2, for customer B, category B, closed this month.
 - Have a new No Charge work order for this test, work order 3, for customer B, category C, closed this month.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow4-05-05-internal-work-orders-report.png at 100% zoom beside the screen.

**Steps**

1. Open Reports > Internal Work Orders.
2. Set the date range to this month.

**Expected Result**

Step 1:

 - The report opens.
Step 2:

 - The summary strip shows a card for category A, category B and category C.
 - Each card shows its category's name inside the card, with the parts cost, the count and the hours visible; no name runs past the card's edge or over the next card.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11766 (Story 9, Reports, dashboard and exports)

 - S9-R2: “The report "Internal Work Orders" under Reports lists the closed internal and no-charge work orders of the organization and, one row each, the no-charge lines of invoiced billable work orders. Filters: date range on the posting or invoice date (default this month, at most 12 months), Location (all or one), Classification (All / Internal / No Charge / No Charge line), Category (All or one, archived under a heading), Original technician (All or one). Above the table a summary strip shows one card per category in the range: parts cost, count of work orders and lines, hours. Two tabs. "By work order and line", columns: Work order (link), Line ("Whole work order", or the line number and title), Customer, Classification, Category, Original work order (link, with the original line number when set), Original technician, Closed / invoiced (the posting date, or the invoice date for a line), Parts cost (one number: stock parts plus special orders and sublet, as on the NO CHARGE document, S3-R5; for a line, its own parts), Shop supplies (empty on a line), Hours (the labor hours on the lines, as on the document; clocked hours per technician are in Technician Efficiency with Only internal); a totals row for the whole range, not the page; rows sorted by date, newest first; an empty cell shows a dash, as every table of the app does; work order numbers and dates stay on one line at 1440 and 1536 pixels wide. "By technician", one row per technician with the columns Completed lines (lines with status Complete in the range on which the technician clocked time, the definition Technician Efficiency uses, so the two reports agree), Comeback lines and Warranty lines (no-charge lines of those categories whose stored original technicians include this technician, S2-R17), Comeback rate (comeback lines / completed lines; a dash, never a number, when the technician has no completed lines in the range), Redo hours and Redo parts cost (the hours and parts cost of that comeback and warranty work). A whole no-charge Comeback or Warranty work order counts as one line in this tab, with all its hours and parts cost. A line with several technicians counts once for each of them, in the numerator and the denominator, hours and cost shown whole for each; the totals row counts every line once; a note under the table says so. A row "Unassigned" holds the work without an original technician (Not in ShopView, or no technician on the original). The dollar cost of labor arrives with labor posting. Export: the PDF carries both tabs as sections with the same columns; the CSV carries the tab that is open, as every export gives what is on screen.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 4 · Find internal and no-charge work orders", board "05 Internal Work Orders report" (Flow 4 · Find internal and no-charge work orders).
Design pictures attached to this case:

 - iwo-flow4-05-05-internal-work-orders-report.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-123 · Design: Report Category and Original technician filters show long names in rows

Scan proposal I-P27 · folder Design — how it looks (136719) · refs SV-11766 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new No Charge category for this test, category A, with "Requires the original work order" ticked, whose name is 60 characters long with spaces (for example Plainsview Company Vehicle and Heavy Equipment Upkeep Region).
 - Have a new No Charge category for this test, category B, with "Requires the original work order" ticked, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new No Charge category for this test, category C, with "Requires the original work order" unticked, archived after work order 3 below was closed, whose name has the characters & " ' < > (for example Plainsview "Yard" & O'Neil <Units> Upkeep).
 - Have a new user for this test, technician A, a technician whose name is long with spaces (for example Maximilian Alexander Montgomery-Fitzgerald Vanderbilt).
 - Have a new user for this test, technician B, a technician whose first name is long with no spaces (for example Bartholomewvanderbiltmontgomeryfitzgerald).
 - Have a new customer for this test, customer A.
 - Have a new invoiced work order for this test, work order 4, for customer A, whose line 1 was worked by technician A and whose line 2 by technician B.
 - Have a new No Charge work order for this test, work order 1, for customer A, category A, closed this month, with work order 4's line 1 as its original line.
 - Have a new No Charge work order for this test, work order 2, for customer A, category B, closed this month, with work order 4's line 2 as its original line.
 - Have a new No Charge work order for this test, work order 3, for customer A, category C, closed this month.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow4-05-05-internal-work-orders-report.png at 100% zoom beside the screen.

**Steps**

1. Open Reports > Internal Work Orders.
2. Set the date range to this month.
3. Open the "Category" filter.
4. Pick category B.
5. Open the "Original technician" filter.

**Expected Result**

Step 1:

 - The report opens.
Step 2:

 - Rows for work order 1, work order 2 and work order 3 show.
Step 3:

 - Category A and category B show as rows, and category C under the Archived heading.
 - Each name stays inside its own row; none runs over the next row or out of the list.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
Step 4:

 - The Category filter box shows category B's name inside the box; it covers neither the next filter nor the Export button.
Step 5:

 - Technician A and technician B show as rows, each name inside its own row.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11766 (Story 9, Reports, dashboard and exports)

 - S9-R2: “The report "Internal Work Orders" under Reports lists the closed internal and no-charge work orders of the organization and, one row each, the no-charge lines of invoiced billable work orders. Filters: date range on the posting or invoice date (default this month, at most 12 months), Location (all or one), Classification (All / Internal / No Charge / No Charge line), Category (All or one, archived under a heading), Original technician (All or one). Above the table a summary strip shows one card per category in the range: parts cost, count of work orders and lines, hours. Two tabs. "By work order and line", columns: Work order (link), Line ("Whole work order", or the line number and title), Customer, Classification, Category, Original work order (link, with the original line number when set), Original technician, Closed / invoiced (the posting date, or the invoice date for a line), Parts cost (one number: stock parts plus special orders and sublet, as on the NO CHARGE document, S3-R5; for a line, its own parts), Shop supplies (empty on a line), Hours (the labor hours on the lines, as on the document; clocked hours per technician are in Technician Efficiency with Only internal); a totals row for the whole range, not the page; rows sorted by date, newest first; an empty cell shows a dash, as every table of the app does; work order numbers and dates stay on one line at 1440 and 1536 pixels wide. "By technician", one row per technician with the columns Completed lines (lines with status Complete in the range on which the technician clocked time, the definition Technician Efficiency uses, so the two reports agree), Comeback lines and Warranty lines (no-charge lines of those categories whose stored original technicians include this technician, S2-R17), Comeback rate (comeback lines / completed lines; a dash, never a number, when the technician has no completed lines in the range), Redo hours and Redo parts cost (the hours and parts cost of that comeback and warranty work). A whole no-charge Comeback or Warranty work order counts as one line in this tab, with all its hours and parts cost. A line with several technicians counts once for each of them, in the numerator and the denominator, hours and cost shown whole for each; the totals row counts every line once; a note under the table says so. A row "Unassigned" holds the work without an original technician (Not in ShopView, or no technician on the original). The dollar cost of labor arrives with labor posting. Export: the PDF carries both tabs as sections with the same columns; the CSV carries the tab that is open, as every export gives what is on screen.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 4 · Find internal and no-charge work orders", board "05 Internal Work Orders report" (Flow 4 · Find internal and no-charge work orders).
Design pictures attached to this case:

 - iwo-flow4-05-05-internal-work-orders-report.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-124 · Design: Long technician names stay in their rows on the By technician tab

Scan proposal I-P28 · folder Design — how it looks (136719) · refs SV-11766 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new user for this test, technician A, a technician whose name is long with spaces (for example Maximilian Alexander Montgomery-Fitzgerald Vanderbilt).
 - Have a new user for this test, technician B, a technician whose first name is long with no spaces (for example Bartholomewvanderbiltmontgomeryfitzgerald).
 - Have a new user for this test, technician C, a technician whose name has the characters & " ' < > (for example Ann "AJ" O'Neil <Lead> & Co).
 - Have a new customer for this test, customer A.
 - Have a new invoiced work order for this test, work order 4, for customer A, with line 1 worked by technician A, line 2 by technician B and line 3 by technician C, each line Complete this month.
 - Have a new work order for this test, work order 1, for customer A, invoiced this month, whose line 2 was No Charge under Comeback with work order 4's line 1 as its original line.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow4-06-06-internal-work-orders-report-by-technician.png at 100% zoom beside the screen.

**Steps**

1. Open Reports > Internal Work Orders.
2. Set the date range to this month.
3. Open the "By technician" tab.

**Expected Result**

Step 1:

 - The report opens.
Step 2:

 - Work order 1's line shows.
Step 3:

 - Rows for technician A, technician B and technician C show.
 - Each name stays inside the technician cell; none runs over Completed lines.
 - Every column heading (Completed lines, Comeback lines, Warranty lines, Comeback rate, Redo hours, Redo parts cost) is visible.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11766 (Story 9, Reports, dashboard and exports)

 - S9-R2: “The report "Internal Work Orders" under Reports lists the closed internal and no-charge work orders of the organization and, one row each, the no-charge lines of invoiced billable work orders. Filters: date range on the posting or invoice date (default this month, at most 12 months), Location (all or one), Classification (All / Internal / No Charge / No Charge line), Category (All or one, archived under a heading), Original technician (All or one). Above the table a summary strip shows one card per category in the range: parts cost, count of work orders and lines, hours. Two tabs. "By work order and line", columns: Work order (link), Line ("Whole work order", or the line number and title), Customer, Classification, Category, Original work order (link, with the original line number when set), Original technician, Closed / invoiced (the posting date, or the invoice date for a line), Parts cost (one number: stock parts plus special orders and sublet, as on the NO CHARGE document, S3-R5; for a line, its own parts), Shop supplies (empty on a line), Hours (the labor hours on the lines, as on the document; clocked hours per technician are in Technician Efficiency with Only internal); a totals row for the whole range, not the page; rows sorted by date, newest first; an empty cell shows a dash, as every table of the app does; work order numbers and dates stay on one line at 1440 and 1536 pixels wide. "By technician", one row per technician with the columns Completed lines (lines with status Complete in the range on which the technician clocked time, the definition Technician Efficiency uses, so the two reports agree), Comeback lines and Warranty lines (no-charge lines of those categories whose stored original technicians include this technician, S2-R17), Comeback rate (comeback lines / completed lines; a dash, never a number, when the technician has no completed lines in the range), Redo hours and Redo parts cost (the hours and parts cost of that comeback and warranty work). A whole no-charge Comeback or Warranty work order counts as one line in this tab, with all its hours and parts cost. A line with several technicians counts once for each of them, in the numerator and the denominator, hours and cost shown whole for each; the totals row counts every line once; a note under the table says so. A row "Unassigned" holds the work without an original technician (Not in ShopView, or no technician on the original). The dollar cost of labor arrives with labor posting. Export: the PDF carries both tabs as sections with the same columns; the CSV carries the tab that is open, as every export gives what is on screen.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 4 · Find internal and no-charge work orders", board "06 Internal Work Orders report · by technician" (Flow 4 · Find internal and no-charge work orders).
Design pictures attached to this case:

 - iwo-flow4-06-06-internal-work-orders-report-by-technician.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-125 · Design: AccountingHub Held reason with a long category stays in its row

Scan proposal I-P31 · folder Design — how it looks (136719) · refs SV-11765 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Make sure AccountingHub is enabled for the organization and the test location has no QuickBooks Online connection.
 - Have a new No Charge category for this test, category B, with "Requires the original work order" unticked, whose row in Accounting > Account Mappings is left empty, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new customer for this test, customer A.
 - Have a new No Charge work order for this test, work order 1, for customer A, category B, with one stock part with a cost, closed.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow5-04-04-accountinghub-held-event.png at 100% zoom beside the screen.

**Steps**

1. Open Accounting > Accounting Events.

**Expected Result**

Step 1:

 - Work order 1's event shows with the status Held and the reason "No Charge: [category B's name] row not mapped".
 - The reason shows category B's name in full and stays inside its row; it covers neither the next column nor the row below.
 - The Retry action is visible.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11765 (Story 8, AccountingHub, the closed work order and its parts cost)

 - S8-N2: “If a mapped account on either side of the entry is missing or inactive, or the posting date falls in a closed fiscal period or in none, the event gets a status Held (new in the hub) on the Accounting Events page with the reason ("No Charge: [Category] row not mapped" or "Internal: [Category] row not mapped", the list name telling the two apart (S8-R7), "Shop supplies expense is not mapped", "Inventory asset is not mapped", "Parts cost of goods sold is not mapped", "Period [name] is closed", or the hub's existing "No open fiscal period covers [date]."), the existing Retry action, and automatic retry when the mapping is saved or the period opened. Other events for the organization keep flowing. A held Close withdrawn by Reopen becomes Dismissed (S4-E1). Held exists for these work-order entries only (Close, reversal, no-charge line, and the move of a vendor bill or credit line to its category account, S8-R3); invoices, vendor bills, credits and payments keep today's statuses.”
 - User Feedback Summary: “Hub event held | "No Charge: [Category] row not mapped" / "Shop supplies expense is not mapped" / "Period [name] is closed" | Reason on the Held event, Retry”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 5 · What the books see", board "04 AccountingHub · Held event" (Flow 5 · What the books see).
Design pictures attached to this case:

 - iwo-flow5-04-04-accountinghub-held-event.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-126 · Design: QB Unexported row with a long customer name keeps the Internal badge

Scan proposal I-P32 · folder Design — how it looks (136719) · refs SV-11764 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Make sure the test location is connected to QuickBooks Online and that AccountingHub is not enabled.
 - Have a new customer for this test, customer B, flagged as an Internal customer, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new internal work order for this test, work order 1, for internal customer B, with one stock part with a cost, closed with a posting date in a QuickBooks closed period.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow5-01-01-qb-unexported-held-entry.png at 100% zoom beside the screen.

**Steps**

1. Open QB Unexported.
2. Click the Journal Entries tab.

**Expected Result**

Step 1:

 - QB Unexported opens.
Step 2:

 - Work order 1's row shows with customer B's name and the "Internal" badge.
 - The long name with no spaces stays inside its cell and pushes the badge neither out of the row nor over the next column.
 - Export and Mark as Exported are visible on the row.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11764 (Story 7, QuickBooks Online sync)

 - S7-N3: “If the posting date falls in a closed period, QuickBooks rejects the entry and it lands in QB Unexported under Journal Entries with the QuickBooks error text, the work order number and the classification (type "Internal Work Order Close", "Internal Work Order Reopen" or "No Charge line"), with Export and Mark as Exported as for other rows.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 5 · What the books see", board "01 QB Unexported · held entry" (Flow 5 · What the books see).
Design pictures attached to this case:

 - iwo-flow5-01-01-qb-unexported-held-entry.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-127 · Design: Asset Invoices tab keeps a long customer name and the badge in place

Scan proposal I-P33 · folder Design — how it looks (136719) · refs SV-11760,SV-11766 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new customer for this test, customer B, flagged as an Internal customer, with one asset, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new internal work order for this test, work order 1, for internal customer B on that asset, closed.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow1-24-10b-asset-invoices-tab.png at 100% zoom beside the screen.

**Steps**

1. Open customer B's asset.
2. Click the Invoices tab.

**Expected Result**

Step 1:

 - The asset's page opens.
Step 2:

 - Work order 1's row shows status Closed, the badge and Total balance "No Charge".
 - Customer B's name stays inside its cell; it covers neither the status nor the badge.
 - Every column heading of the tab is visible.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11760 (Story 3, Close an internal or no-charge work order), story SV-11766 (Story 9, Reports, dashboard and exports)

 - S9-R10: “The asset's Invoices tab lists the closed internal and no-charge work orders with the badge, Total balance "No Charge" and Discount and Tax rate empty, dated by the posting date, so the history per unit is there; cost and hours are in the NO CHARGE document (columns are v1.1).”
 - S3-R6: “The asset Invoices tab lists the closed work order with status Closed, the badge, Total balance "No Charge" and Discount and Tax rate empty (rows on that tab have no actions). The customer's Invoices tab (the receivables ledger) does not list it; the customer's Work Orders tab does (S2-R10). GET /api/invoices/list leaves it out too (no screen uses it today). Customer statements, the customer balance and credit limit checks do not include it, and no message driven by an open balance can pick it up, since it carries none. The Finance tab menu of the closed work order offers Reopen Work Order only (S4-R1); Issue Credit is not shown, as there is nothing to credit.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 1 · Create and close", board "10b Asset · Invoices tab" (Flow 1 · Create and close).
Design pictures attached to this case:

 - iwo-flow1-24-10b-asset-invoices-tab.png
The design draws this place with short names only. These results check that its layout holds with long and unusual names; where the PRD says nothing about the look, the pictures are the source.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### S9-49 · Report keeps work order numbers and dates on one line with long names

Scan proposal I-P25 · folder Reports, dashboard and exports (136710) · refs SV-11766 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new Internal category for this test, category A, whose name is 60 characters long with spaces (for example Plainsview Company Vehicle and Heavy Equipment Upkeep Region).
 - Have a new No Charge category for this test, category B, with "Requires the original work order" unticked, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new user for this test, technician A, a technician whose first name is long with no spaces (for example Bartholomewvanderbiltmontgomeryfitzgerald).
 - Have a new customer for this test, customer A, flagged as an Internal customer, whose Default internal category is category A, whose name is long with spaces (for example Plainsview Heavy Truck and Trailer Repair Services of North Dakota).
 - Have a new customer for this test, customer B, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new customer for this test, customer C, whose name has the characters & " ' < > (for example Plainsview A&B "Fleet" O'Neil <Parts> & Sons).
 - Have a new invoiced work order for this test, work order 4, for customer B, whose line 1 was worked by technician A.
 - Have a new internal work order for this test, work order 1, for internal customer A, closed this month.
 - Have a new No Charge work order for this test, work order 2, for customer B, category B, closed this month, with work order 4's line 1 as its original line.
 - Have a new work order for this test, work order 3, for customer C, invoiced this month, billable, whose line 2 has a long title with no spaces (for example ReplaceFrontAndRearBrakeChambersSlackAdjustersAndEveryAirLine) and was No Charge under Goodwill.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.

**Steps**

1. Open Reports > Internal Work Orders.
2. Set the date range to this month.
3. Resize the browser window to 1536 pixels wide.

**Expected Result**

Step 1:

 - The report opens.
Step 2:

 - Rows for work order 1, work order 2 and work order 3's line 2 show.
 - Every work order number and every Closed / invoiced date sits on one line; no number or date is broken over two lines.
 - Each long Customer, Category, Line and Original technician value stays inside its own cell and covers no other column.
 - Work order 1's Original work order and Original technician cells show a dash "—".
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
Step 3:

 - Every work order number and date still sits on one line; each long value still stays inside its own cell.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11766 (Story 9, Reports, dashboard and exports)

 - S9-R2: “The report "Internal Work Orders" under Reports lists the closed internal and no-charge work orders of the organization and, one row each, the no-charge lines of invoiced billable work orders. Filters: date range on the posting or invoice date (default this month, at most 12 months), Location (all or one), Classification (All / Internal / No Charge / No Charge line), Category (All or one, archived under a heading), Original technician (All or one). Above the table a summary strip shows one card per category in the range: parts cost, count of work orders and lines, hours. Two tabs. "By work order and line", columns: Work order (link), Line ("Whole work order", or the line number and title), Customer, Classification, Category, Original work order (link, with the original line number when set), Original technician, Closed / invoiced (the posting date, or the invoice date for a line), Parts cost (one number: stock parts plus special orders and sublet, as on the NO CHARGE document, S3-R5; for a line, its own parts), Shop supplies (empty on a line), Hours (the labor hours on the lines, as on the document; clocked hours per technician are in Technician Efficiency with Only internal); a totals row for the whole range, not the page; rows sorted by date, newest first; an empty cell shows a dash, as every table of the app does; work order numbers and dates stay on one line at 1440 and 1536 pixels wide. "By technician", one row per technician with the columns Completed lines (lines with status Complete in the range on which the technician clocked time, the definition Technician Efficiency uses, so the two reports agree), Comeback lines and Warranty lines (no-charge lines of those categories whose stored original technicians include this technician, S2-R17), Comeback rate (comeback lines / completed lines; a dash, never a number, when the technician has no completed lines in the range), Redo hours and Redo parts cost (the hours and parts cost of that comeback and warranty work). A whole no-charge Comeback or Warranty work order counts as one line in this tab, with all its hours and parts cost. A line with several technicians counts once for each of them, in the numerator and the denominator, hours and cost shown whole for each; the totals row counts every line once; a note under the table says so. A row "Unassigned" holds the work without an original technician (Not in ShopView, or no technician on the original). The dollar cost of labor arrives with labor posting. Export: the PDF carries both tabs as sections with the same columns; the CSV carries the tab that is open, as every export gives what is on screen.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): boards "05 Internal Work Orders report" (page "Flow 4 · Find internal and no-charge work orders"), "06 Internal Work Orders report · by technician" (page "Flow 4 · Find internal and no-charge work orders"), "39 Internal Work Orders report" (page "Happy flow v6"), "39b Internal Work Orders report · by technician" (page "Happy flow v6"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:

 - iwo-flow4-05-05-internal-work-orders-report.png
 - iwo-flow4-06-06-internal-work-orders-report-by-technician.png
 - iwo-happy-39-39-internal-work-orders-report.png
 - iwo-happy-40-39b-internal-work-orders-report-by-technician.png
The design's own words:

 - “By work order and line”
 - “By technician”
 - “Original technician”
Difference IWO-D42 on S9-R2 (label and note): settled by the PRD (S9-R2); this case follows the PRD.
Difference IWO-D43 on S9-R2 (number): settled by the PRD (S9-R2); this case follows the PRD.
Difference IWO-D44 on S9-R2 (look (library rule)): settled by PRD v1.1 (S9-R2), which carries Milos Vasic's answer; this case follows the PRD.
Difference IWO-D45 on S9-R2 (wrapping at 1440/1536): settled by PRD v1.1 (S9-R2), which carries Milos Vasic's answer; this case follows the PRD.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### S9-50 · Report PDF and CSV keep long and unusual names whole

Scan proposal I-P29 · folder Reports, dashboard and exports (136710) · refs SV-11766 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new Internal category for this test, category A, whose name is 60 characters long with spaces (for example Plainsview Company Vehicle and Heavy Equipment Upkeep Region).
 - Have a new No Charge category for this test, category B, with "Requires the original work order" unticked, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new user for this test, technician A, a technician whose first name is long with no spaces (for example Bartholomewvanderbiltmontgomeryfitzgerald).
 - Have a new customer for this test, customer A, flagged as an Internal customer, whose Default internal category is category A, whose name is long with spaces (for example Plainsview Heavy Truck and Trailer Repair Services of North Dakota).
 - Have a new customer for this test, customer B, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new customer for this test, customer C, whose name has the characters & " ' < > (for example Plainsview A&B "Fleet" O'Neil <Parts> & Sons).
 - Have a new invoiced work order for this test, work order 4, for customer B, whose line 1 was worked by technician A.
 - Have a new internal work order for this test, work order 1, for internal customer A, closed this month.
 - Have a new No Charge work order for this test, work order 2, for customer B, category B, closed this month, with work order 4's line 1 as its original line.
 - Have a new work order for this test, work order 3, for customer C, invoiced this month, billable, whose line 2 has a long title with no spaces (for example ReplaceFrontAndRearBrakeChambersSlackAdjustersAndEveryAirLine) and was No Charge under Goodwill.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.

**Steps**

1. Open Reports > Internal Work Orders.
2. Set the date range to this month.
3. Export the report as PDF.
4. Open the downloaded PDF.
5. Export the report as CSV.
6. Open the downloaded CSV in a spreadsheet program.

**Expected Result**

Step 1:

 - The report opens.
Step 2:

 - Rows for work order 1, work order 2 and work order 3's line 2 show.
Step 3:

 - A PDF file downloads.
Step 4:

 - Both tabs show as sections; each long name shows in full inside its own cell and runs over no other column or off the page.
 - Each name shows exactly as you typed it: the characters & " ' < > show as typed, not as "&amp;" or other codes.
Step 5:

 - A CSV file downloads.
Step 6:

 - Each customer, category, line title and technician name sits whole in its own cell, exactly as saved; no row is split into extra columns.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11766 (Story 9, Reports, dashboard and exports)

 - S9-R2: “The report "Internal Work Orders" under Reports lists the closed internal and no-charge work orders of the organization and, one row each, the no-charge lines of invoiced billable work orders. Filters: date range on the posting or invoice date (default this month, at most 12 months), Location (all or one), Classification (All / Internal / No Charge / No Charge line), Category (All or one, archived under a heading), Original technician (All or one). Above the table a summary strip shows one card per category in the range: parts cost, count of work orders and lines, hours. Two tabs. "By work order and line", columns: Work order (link), Line ("Whole work order", or the line number and title), Customer, Classification, Category, Original work order (link, with the original line number when set), Original technician, Closed / invoiced (the posting date, or the invoice date for a line), Parts cost (one number: stock parts plus special orders and sublet, as on the NO CHARGE document, S3-R5; for a line, its own parts), Shop supplies (empty on a line), Hours (the labor hours on the lines, as on the document; clocked hours per technician are in Technician Efficiency with Only internal); a totals row for the whole range, not the page; rows sorted by date, newest first; an empty cell shows a dash, as every table of the app does; work order numbers and dates stay on one line at 1440 and 1536 pixels wide. "By technician", one row per technician with the columns Completed lines (lines with status Complete in the range on which the technician clocked time, the definition Technician Efficiency uses, so the two reports agree), Comeback lines and Warranty lines (no-charge lines of those categories whose stored original technicians include this technician, S2-R17), Comeback rate (comeback lines / completed lines; a dash, never a number, when the technician has no completed lines in the range), Redo hours and Redo parts cost (the hours and parts cost of that comeback and warranty work). A whole no-charge Comeback or Warranty work order counts as one line in this tab, with all its hours and parts cost. A line with several technicians counts once for each of them, in the numerator and the denominator, hours and cost shown whole for each; the totals row counts every line once; a note under the table says so. A row "Unassigned" holds the work without an original technician (Not in ShopView, or no technician on the original). The dollar cost of labor arrives with labor posting. Export: the PDF carries both tabs as sections with the same columns; the CSV carries the tab that is open, as every export gives what is on screen.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): boards "05 Internal Work Orders report" (page "Flow 4 · Find internal and no-charge work orders"), "06 Internal Work Orders report · by technician" (page "Flow 4 · Find internal and no-charge work orders"), "39 Internal Work Orders report" (page "Happy flow v6"), "39b Internal Work Orders report · by technician" (page "Happy flow v6"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:

 - iwo-flow4-05-05-internal-work-orders-report.png
 - iwo-flow4-06-06-internal-work-orders-report-by-technician.png
 - iwo-happy-39-39-internal-work-orders-report.png
 - iwo-happy-40-39b-internal-work-orders-report-by-technician.png
The design's own words:

 - “By work order and line”
 - “By technician”
 - “Original technician”
Difference IWO-D42 on S9-R2 (label and note): settled by the PRD (S9-R2); this case follows the PRD.
Difference IWO-D43 on S9-R2 (number): settled by the PRD (S9-R2); this case follows the PRD.
Difference IWO-D44 on S9-R2 (look (library rule)): settled by PRD v1.1 (S9-R2), which carries Milos Vasic's answer; this case follows the PRD.
Difference IWO-D45 on S9-R2 (wrapping at 1440/1536): settled by PRD v1.1 (S9-R2), which carries Milos Vasic's answer; this case follows the PRD.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### S9-51 · Customer Invoice export keeps a long category with quotes and commas in one cell

Scan proposal I-P30 · folder Reports, dashboard and exports (136710) · refs SV-11766 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new Internal category for this test, category A, whose name has a comma, quotes and the characters & ' < > (for example Plainsview "Yard", O'Neil & Sons <Units>).
 - Have a new No Charge category for this test, category B, with "Requires the original work order" unticked, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new customer for this test, customer A, flagged as an Internal customer, whose Default internal category is category A.
 - Have a new customer for this test, customer B, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new internal work order for this test, work order 1, for internal customer A, closed today, with one labor line of 1.0 hour.
 - Have a new work order for this test, work order 2, for customer B, invoiced today, billable, whose line 2 was No Charge under category B.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.

**Steps**

1. Open Export Reports.
2. Pick Customer Invoice.
3. Tick "Include internal and no-charge work orders".
4. Export today's file.
5. Open the file in a spreadsheet program.

**Expected Result**

Step 1:

 - The Export Reports window opens.
Step 2:

 - Customer Invoice is picked.
Step 3:

 - The option is ticked.
Step 4:

 - The file downloads.
Step 5:

 - Work order 1's rows show Classification "Internal" and category A's name whole in the Category cell, exactly as saved, comma and quotes included.
 - Work order 2's no-charge line shows as a $0.00 row with category B's name in its description.
 - Customer B's name sits whole in its own cell; no row is split into extra columns.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11766 (Story 9, Reports, dashboard and exports)

 - S9-R6: “The Customer Invoice export in the Export Reports dialog gets the option "Include internal and no-charge work orders" (off by default; shown under the rule of S9-R4) with the helper "For your records only. Do not import these rows as invoices." While the option is off the file is exactly today's file. With the option on, the file adds the columns Classification (Billable, Internal, No Charge) and Category (empty on billable rows) and the rows of the closed internal and no-charge work orders of the range: one row per labor and part line as for an invoice, ItemRate and ItemAmount 0.00 on every line, no tax amount and no Supplies row. Parts cost and shop supplies of these work orders are in the Internal Work Orders report (S9-R2), not in this export.”
 - S9-R13: “The Customer Invoice export (S9-R6) shows a no-charge line of a billable invoice as a $0.00 row with the category in the description, without the option of S9-R6, since the invoice is a billable invoice.”
The build is not yet available to check this case against.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-128 · Design: Turning Internal Work Orders on adds the hint, the toggles above stay

Scan proposal I-S01 · folder Design — how it looks (136719) · refs SV-11758 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is off in Settings > Work Orders.
 - Make sure Internal Work Orders has been switched on in this organization before, so switching it on opens no window.
 - Open the attached pictures iwo-flow0-01-01-settings-work-orders-setting-off.png, iwo-flow0-03-02-settings-setting-on-v13.png at 100% zoom beside the screen.

**Steps**

1. Open Settings > Work Orders.
2. Take a screenshot of the page.
3. Switch the "Internal Work Orders" toggle on.
4. Switch the "Internal Work Orders" toggle off.

**Expected Result**

Step 1:

 - The toggle "Internal Work Orders" is off, with its description and no hint line.
Step 2:

 - You have a picture of the toggles with Internal Work Orders off.
Step 3:

 - One hint line with an info icon appears under the toggle's description.
 - Every toggle above Internal Work Orders (Require Review Before Completion included) is in the same place as in your screenshot.
 - The rows below the hint move down by the hint's height only; nothing moves left or right.
Step 4:

 - The hint line goes away and the page matches your screenshot.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11758 (Story 1, Turn on Internal Work Orders, flag internal customers, manage categories)

 - S1-R3: “While the toggle is on, one hint line sits under the description, with an info icon: "Manage categories in Internal Work Orders (Administration > Service). Their expense accounts are set there or in Integrations > QuickBooks." where Internal Work Orders is a link to the categories page (S1-R13) and QuickBooks a link to Integrations > QuickBooks (named only when QuickBooks is connected at any location; for AccountingHub the sentence names Accounting > Account Mappings; with both, it names both; with neither, it ends at "set there."). There is no second line. The earlier hint about flagging the company is dropped; the flag is explained on Edit Customer.”
 - S1-R10: “Turning the toggle off hides the hint line and the customer badges and leaves the flags on the customers. Open internal work orders are not touched: they keep their badge and close as internal. New work orders for a flagged customer are billable while the toggle is off. Turning it on again (with Save settings, like any other toggle) opens no modal: the customer badges and the hint line come back and, on Save settings, for every flagged customer with open billable work orders, the dialog of S1-R11 is shown, one after another. New internal customers are flagged on Edit Customer (S1-R7).”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 0 · Turn it on", boards "01 Settings · Work Orders, setting off" (Flow 0 · Turn it on), "02 Settings · setting on" (Flow 0 · Turn it on).
Design pictures attached to this case:

 - iwo-flow0-01-01-settings-work-orders-setting-off.png
 - iwo-flow0-03-02-settings-setting-on-v13.png
The design's two pictures of this page differ only by the inserted hint line and the rows below it.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-129 · Design: Adding chips in the turn-on window moves nothing above the picker

Scan proposal I-S02 · folder Design — how it looks (136719) · refs SV-11758 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Use a new organization created on the build (a new sign-up), in which the Internal Work Orders setting has never been switched on.
 - Have a new customer for this test, customer A, whose name is long with spaces (for example Plainsview Heavy Truck and Trailer Repair Services of North Dakota).
 - Have a new customer for this test, customer B, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached picture iwo-flow0-02-01b-turn-on-pick-your-internal-customers.png at 100% zoom beside the screen.

**Steps**

1. Open Settings > Work Orders.
2. Switch the "Internal Work Orders" toggle on.
3. Take a screenshot of the window.
4. Pick customer A in the customer picker.
5. Pick customer B in the customer picker.

**Expected Result**

Step 1:

 - The toggle is off.
Step 2:

 - The window "Which customers are your own company?" opens.
Step 3:

 - You have a picture of the window with nothing picked.
Step 4:

 - Customer A's chip shows.
 - The title, the body and the top of the picker field are in the same place as in your screenshot.
 - "Do this later" and "Save" are at the bottom right of the window, in that order, fully visible.
Step 5:

 - Customer B's chip shows; if the chips need more room the window grows downward.
 - The title, the body and the top of the picker field are still in the same place as in your screenshot.
 - "Do this later" and "Save" are still at the bottom right of the window, fully visible.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11758 (Story 1, Turn on Internal Work Orders, flag internal customers, manage categories)

 - S1-R2: “Switching the toggle from off to on for the first time in the organization opens the modal "Which customers are your own company?" with the body "Work orders for these customers are internal: no prices and no invoice; parts cost posts to the expense account of their category when you use QuickBooks or AccountingHub. Nothing is picked for you: your location is not always a customer, and the names can differ. Pick one or more, or do it later from the customer page.", a customer picker (the standard customer Select with search, several customers can be picked, each shown as a chip with a remove control; up to 50, with the hint "Pick up to 50 customers here. Flag more from Edit Customer."), the line "You can change this any time: Customers > Edit Customer > Internal customer." and the buttons "Do this later" and "Save". No customer is preselected. Save is disabled until at least one customer is picked. Save saves the toggle (on) and flags the picked customers in one step (only this toggle and the flags; other unsaved changes on the tab wait for Save settings; to back out, the user switches the toggle off and saves settings), closes the modal and then shows the dialog of S1-R11 for each picked customer with open billable work orders, one after another; the page shows the toggle on and the hint line of S1-R3 with nothing left to save for this setting. Closing the modal with X acts as "Do this later" (S1-R5); Esc and a click outside do nothing, as in every dialog of the app. The modal is shown once per organization: switching the toggle on again later opens nothing (S1-R10). Switching it off opens nothing. The modal never lists who is flagged, and Settings > Work Orders never lists customers.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 0 · Turn it on", board "01b Turn on · pick your internal customers" (Flow 0 · Turn it on).
Design pictures attached to this case:

 - iwo-flow0-02-01b-turn-on-pick-your-internal-customers.png
The design draws this window in one state only, with one chip.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-130 · Design: Switching category tabs keeps the title, tabs and columns in place

Scan proposal I-S03 · folder Design — how it looks (136719) · refs SV-11758 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Make sure the test location is connected to QuickBooks Online and that AccountingHub is not enabled.
 - Open the attached pictures iwo-flow0-04-2a-internal-work-orders-page-internal-categories.png, iwo-flow0-05-2b-internal-work-orders-page-no-charge-categories.png at 100% zoom beside the screen.

**Steps**

1. Open Administration > Service > Internal Work Orders.
2. Take a screenshot of the page.
3. Open the No Charge categories tab.
4. Open the Internal categories tab.

**Expected Result**

Step 1:

 - The Internal categories tab is open.
Step 2:

 - You have a picture of the Internal categories tab.
Step 3:

 - The title, the intro text and the two tabs are in the same place as in your screenshot.
 - The four column headings (Category, QuickBooks expense account, Original work order, Work orders) start at the same left-right places as the four headings in your screenshot.
Step 4:

 - The page matches your screenshot.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11758 (Story 1, Turn on Internal Work Orders, flag internal customers, manage categories)

 - S1-R13: “Administration > Service > Internal Work Orders is a page with two tabs. Internal categories: columns Category (the default carries a Default badge), QuickBooks expense account (with the QuickBooks mark; "Not set" with a warning icon when empty), Internal customers using it, Work orders (count, all time; a billable work order with a no-charge line of the category counts too), and a row menu with Edit and Archive. No Charge categories: Category, QuickBooks expense account, Original work order (Required / Not asked), Work orders, row menu. Buttons "New Internal Category" and "New No Charge Category". Under the Internal categories tab a hint reads "Set on the customer, or on the asset for one unit. An internal work order takes it when it is created." The starting set is seeded for every organization when this release ships, so the categories, the QuickBooks rows (S5-R5) and the hub rows (S6-R2) exist before the setting is turned on; turning the setting on seeds nothing: General Internal (default, cannot be archived); Warranty (requires the original work order), Goodwill (does not), Comeback (requires). Archived categories stay on the work orders and lines that used them and in the report filter under Archived; a "Show archived (n)" link lists them with Restore. The page needs 'Settings — Service', like every Administration > Service page; while the setting is off it shows the notice "Internal Work Orders is off. Turn it on in Settings > Work Orders." and the lists stay editable. Each list holds up to 100 active categories; past that, the New button is disabled with "You can have up to 100 active categories in this list. Archive one to add another." The QuickBooks expense account column is shown only while the current location is connected to QuickBooks.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 0 · Turn it on", boards "2a Internal Work Orders page · Internal categories" (Flow 0 · Turn it on), "2b Internal Work Orders page · No Charge categories" (Flow 0 · Turn it on).
Design pictures attached to this case:

 - iwo-flow0-04-2a-internal-work-orders-page-internal-categories.png
 - iwo-flow0-05-2b-internal-work-orders-page-no-charge-categories.png
The design's two pictures keep the title, the tabs and the four headings at the same places; only the New button's label is longer.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-131 · Design: Show archived lists the archived rows without moving the columns

Scan proposal I-S04 · folder Design — how it looks (136719) · refs SV-11758 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Make sure the test location is connected to QuickBooks Online and that AccountingHub is not enabled.
 - Have a new Internal category for this test, category A, archived.
 - Open the attached picture iwo-flow0-04-2a-internal-work-orders-page-internal-categories.png at 100% zoom beside the screen.

**Steps**

1. Open Administration > Service > Internal Work Orders.
2. Take a screenshot of the page.
3. Click the "Show archived" link under the table.
4. Click the "Show active" link.

**Expected Result**

Step 1:

 - The Internal categories tab is open with a "Show archived" link, followed by the number of archived categories, under the table.
Step 2:

 - You have a picture of the active categories.
Step 3:

 - The table lists the archived categories, category A among them, each with Restore.
 - Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 4:

 - The active categories show again.
 - Every column heading is in the same place as in your screenshot: none has moved left or right.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11758 (Story 1, Turn on Internal Work Orders, flag internal customers, manage categories)

 - S1-R13: “Administration > Service > Internal Work Orders is a page with two tabs. Internal categories: columns Category (the default carries a Default badge), QuickBooks expense account (with the QuickBooks mark; "Not set" with a warning icon when empty), Internal customers using it, Work orders (count, all time; a billable work order with a no-charge line of the category counts too), and a row menu with Edit and Archive. No Charge categories: Category, QuickBooks expense account, Original work order (Required / Not asked), Work orders, row menu. Buttons "New Internal Category" and "New No Charge Category". Under the Internal categories tab a hint reads "Set on the customer, or on the asset for one unit. An internal work order takes it when it is created." The starting set is seeded for every organization when this release ships, so the categories, the QuickBooks rows (S5-R5) and the hub rows (S6-R2) exist before the setting is turned on; turning the setting on seeds nothing: General Internal (default, cannot be archived); Warranty (requires the original work order), Goodwill (does not), Comeback (requires). Archived categories stay on the work orders and lines that used them and in the report filter under Archived; a "Show archived (n)" link lists them with Restore. The page needs 'Settings — Service', like every Administration > Service page; while the setting is off it shows the notice "Internal Work Orders is off. Turn it on in Settings > Work Orders." and the lists stay editable. Each list holds up to 100 active categories; past that, the New button is disabled with "You can have up to 100 active categories in this list. Archive one to add another." The QuickBooks expense account column is shown only while the current location is connected to QuickBooks.”
 - S1-R16: “A category has a stable key; renaming it keeps the history, the report filter and the mappings. Archiving a category in use keeps it on existing work orders, lines, documents and reports; it is no longer offered in any select. The default Internal category cannot be archived; changing the default moves nothing on existing customers. The green QuickBooks mark (the existing QuickBooks icon) is shown wherever a field maps to QuickBooks: the account columns and pickers of S1-R13 and S1-R14, the asset field of S1-R15 and the Settings hint of S1-R3. Archiving a category that is the stored default of customers or assets first shows "[n] internal customers and [m] assets use this category as their default. Their new work orders will use the next category in line." The stored value stays on the customer and the asset, shown as "[name] (archived)" with the hint "Archived. Pick an active category."; resolution for a new work order (S2-R1) skips archived categories: the asset's, else the customer's, else the default Internal category, the first active one wins. Restore puts everything back as it was.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 0 · Turn it on", board "2a Internal Work Orders page · Internal categories" (Flow 0 · Turn it on).
Design pictures attached to this case:

 - iwo-flow0-04-2a-internal-work-orders-page-internal-categories.png
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-132 · Design: Ticking Internal customer adds the select without moving the fields

Scan proposal I-S05 · folder Design — how it looks (136719) · refs SV-11758 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new customer for this test, customer A, not flagged.
 - Open the attached picture iwo-flow0-17-11-edit-customer-min-without.png at 100% zoom beside the screen.

**Steps**

1. Open customer A's page.
2. Click Edit Customer on customer A's page.
3. Take a screenshot of the window.
4. Tick the "Internal customer" checkbox.
5. Click Cancel.

**Expected Result**

Step 1:

 - Customer A's page opens.
Step 2:

 - The Edit Customer window opens.
Step 3:

 - You have a picture of the window.
Step 4:

 - The select "Default internal category" appears under the checkbox.
 - Every field above the select, and the checkbox itself, is in the same place as in your screenshot.
 - The window's buttons are visible at its bottom.
Step 5:

 - The window closes; customer A's header shows no "Internal" badge after the name.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11758 (Story 1, Turn on Internal Work Orders, flag internal customers, manage categories)

 - S1-R7: “Edit Customer shows the checkbox "Internal customer" as the last field of the dialog, below "PO is required", with the helper "Work orders for this customer are internal: no prices, no invoice, parts cost posts to the expense account of the internal category." When ticked, the select "Default internal category" appears under it, listing the active Internal categories, General Internal preselected, with the helper "Used by every new internal work order for this customer unless the asset has its own category." It is shown while the setting is on (S1-N4 for the exception). New Customer does not show it: a customer is flagged after it exists, from Edit Customer or the modal. The checkbox and the modal are the only places the flag is set; ticking it on Save flags the customer (with the dialog of S1-R11 when open billable work orders exist).”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 0 · Turn it on", board "11 Edit Customer · Min without %" (Flow 0 · Turn it on).
Design pictures attached to this case:

 - iwo-flow0-17-11-edit-customer-min-without.png
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-133 · Design: Ticking No Charge adds the category fields below, nothing above moves

Scan proposal I-S06 · folder Design — how it looks (136719) · refs SV-11759 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new customer for this test, customer A, not flagged, with one asset.
 - Have a new invoiced work order for this test, work order 1, for customer A, so Warranty has an original to offer.
 - Start on Work Orders.
 - Open the attached pictures iwo-flow1-02-02a-new-work-order.png, iwo-flow1-07-02e-new-work-order-no-charge-ticked.png at 100% zoom beside the screen.

**Steps**

1. Click New Work Order.
2. Pick customer A.
3. Take a screenshot of the window.
4. Tick "No Charge".
5. Pick Warranty in Category.
6. Click Cancel.

**Expected Result**

Step 1:

 - The New Work Order window opens.
Step 2:

 - Customer A is picked.
Step 3:

 - You have a picture of the window.
Step 4:

 - The select "Category" appears under "No Charge".
 - Every field above "No Charge" is in the same place as in your screenshot.
Step 5:

 - The select "Original work order" appears under Category, offering work order 1.
 - Every field above "No Charge" is still in the same place as in your screenshot.
 - Cancel and Save are visible at the bottom of the window.
Step 6:

 - The window closes and no work order is created.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11759 (Story 2, An internal or no-charge work order from creation to Close)

 - S2-R2: “In the New Work Order dialog (New Work Order only; Edit Work Order, which shares the dialog, is unchanged), picking a customer without the flag shows, at the bottom of the dialog below the "Asset Here?" checkbox and separated from it by a divider, an unticked checkbox "No Charge" with an info icon whose tooltip reads "Warranty, goodwill or comeback work. Closes without an invoice; parts cost posts to the expense account of the category." Ticking it reveals the required select "Category" listing the active No Charge categories, empty by default; Save is refused with the field message "Pick a category" until one is picked. When the category requires the original work order, the select "Original work order" appears under it (the customer's invoiced and closed work orders at the locations the user has access to, those on the same asset first, each as number, date and first line, and "Not in ShopView" under Other), optional here, with the helper "Which earlier work order this job comes from, or Not in ShopView, and the line on it. The line sets the original technician for the comeback and warranty numbers. Optional here, required at Close."; once a work order is picked, the optional select "Original line" lists its lines (number, title, technician). The checkbox is hidden when the selected customer is an internal customer and for users without 'See Financial Data'. Ticked, the work order is created No Charge with that category. It works whether or not any customer is flagged. As soon as a work order or a line is picked, the line "Original technician: [names]" (or "Original technician: none") shows under the selects, so a wrong attribution is seen and corrected by picking the line before anything is saved.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 1 · Create and close", boards "02a New work order" (Flow 1 · Create and close), "02e New work order · No Charge ticked" (Flow 1 · Create and close).
Design pictures attached to this case:

 - iwo-flow1-02-02a-new-work-order.png
 - iwo-flow1-07-02e-new-work-order-no-charge-ticked.png
The design's two pictures are identical above the inserted fields; the window grows downward.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-134 · Design: Closing and reopening keeps the lines table headings in place

Scan proposal I-S11 · folder Design — how it looks (136719) · refs SV-11760,SV-11761 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Make sure the test location has no accounting integration (neither QuickBooks Online nor AccountingHub).
 - Have a new customer for this test, customer A, flagged as an Internal customer.
 - Have a new internal work order for this test, work order 1, for internal customer A, with two lines, every line Complete.
 - Open the attached pictures iwo-flow1-14-05-work-order-complete-ready-to-close.png, iwo-flow3-01-01-work-order-closed.png, iwo-flow3-03-03-work-order-complete-again.png at 100% zoom beside the screen.

**Steps**

1. Open work order 1.
2. Take a screenshot of the page.
3. Open the Finance tab.
4. Click Close Work Order on the Finance tab.
5. Open the Lines tab.
6. Open the Finance tab.
7. Click the three-dots menu on the Finance tab.
8. Click Reopen Work Order.
9. Click Reopen Work Order in the window.
10. Open the Lines tab.

**Expected Result**

Step 1:

 - Work order 1 opens on the Lines tab.
Step 2:

 - You have a picture of the lines table.
Step 3:

 - The Finance tab opens.
Step 4:

 - Work order 1 is Closed.
Step 5:

 - The lines table shows.
 - Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 6:

 - The Finance tab opens.
Step 7:

 - The menu offers Reopen Work Order.
Step 8:

 - The window "Reopen work order [number]?" opens.
Step 9:

 - Work order 1 is Complete again.
Step 10:

 - The lines table shows.
 - Every column heading is in the same place as in your screenshot: none has moved left or right.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11760 (Story 3, Close an internal or no-charge work order), story SV-11761 (Story 4, Reopen a closed internal or no-charge work order)

 - S3-R6: “The asset Invoices tab lists the closed work order with status Closed, the badge, Total balance "No Charge" and Discount and Tax rate empty (rows on that tab have no actions). The customer's Invoices tab (the receivables ledger) does not list it; the customer's Work Orders tab does (S2-R10). GET /api/invoices/list leaves it out too (no screen uses it today). Customer statements, the customer balance and credit limit checks do not include it, and no message driven by an open balance can pick it up, since it carries none. The Finance tab menu of the closed work order offers Reopen Work Order only (S4-R1); Issue Credit is not shown, as there is nothing to credit.”
 - S4-R2: “Reopen opens the dialog "Reopen work order [number]?" with the body "The work order leaves Closed · Internal and goes back to Complete. The parts cost and shop supplies entries are reversed in your books." (Closed · No Charge on a no-charge one) and the buttons Cancel and "Reopen Work Order". Dismissing the dialog in any other way does nothing.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): pages "Flow 1 · Create and close" / "Flow 3 · Reopen", boards "05 Work order · Complete, ready to close" (Flow 1 · Create and close), "01 Work order · Closed" (Flow 3 · Reopen), "03 Work order · Complete again" (Flow 3 · Reopen).
Design pictures attached to this case:

 - iwo-flow1-14-05-work-order-complete-ready-to-close.png
 - iwo-flow3-01-01-work-order-closed.png
 - iwo-flow3-03-03-work-order-complete-again.png
The design's pictures of this work order Complete, Closed and Complete again keep every lines table heading at the same place.
Difference: register IWO-D17: the design still draws Rate and Total on an internal work order; the PRD hides them. The case compares only the headings shown.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-135 · Design: Switching report tabs keeps the filters, cards and tabs in place

Scan proposal I-S12 · folder Design — how it looks (136719) · refs SV-11766 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new customer for this test, customer A, flagged as an Internal customer.
 - Have a new customer for this test, customer B.
 - Have a new internal work order for this test, work order 1, for internal customer A, closed this month.
 - Have a new No Charge work order for this test, work order 2, for customer B, category Goodwill, closed this month.
 - Open the attached pictures iwo-flow4-05-05-internal-work-orders-report.png, iwo-flow4-06-06-internal-work-orders-report-by-technician.png at 100% zoom beside the screen.

**Steps**

1. Open Reports > Internal Work Orders.
2. Set the date range to this month.
3. Take a screenshot of the page.
4. Click the "By technician" tab.
5. Click the "By work order and line" tab.

**Expected Result**

Step 1:

 - The report opens.
Step 2:

 - Work order 1 and work order 2 show.
Step 3:

 - You have a picture of the report on "By work order and line".
Step 4:

 - The title, the filters, the summary cards and the two tabs are in the same place as in your screenshot.
Step 5:

 - The page matches your screenshot.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11766 (Story 9, Reports, dashboard and exports)

 - S9-R2: “The report "Internal Work Orders" under Reports lists the closed internal and no-charge work orders of the organization and, one row each, the no-charge lines of invoiced billable work orders. Filters: date range on the posting or invoice date (default this month, at most 12 months), Location (all or one), Classification (All / Internal / No Charge / No Charge line), Category (All or one, archived under a heading), Original technician (All or one). Above the table a summary strip shows one card per category in the range: parts cost, count of work orders and lines, hours. Two tabs. "By work order and line", columns: Work order (link), Line ("Whole work order", or the line number and title), Customer, Classification, Category, Original work order (link, with the original line number when set), Original technician, Closed / invoiced (the posting date, or the invoice date for a line), Parts cost (one number: stock parts plus special orders and sublet, as on the NO CHARGE document, S3-R5; for a line, its own parts), Shop supplies (empty on a line), Hours (the labor hours on the lines, as on the document; clocked hours per technician are in Technician Efficiency with Only internal); a totals row for the whole range, not the page; rows sorted by date, newest first; an empty cell shows a dash, as every table of the app does; work order numbers and dates stay on one line at 1440 and 1536 pixels wide. "By technician", one row per technician with the columns Completed lines (lines with status Complete in the range on which the technician clocked time, the definition Technician Efficiency uses, so the two reports agree), Comeback lines and Warranty lines (no-charge lines of those categories whose stored original technicians include this technician, S2-R17), Comeback rate (comeback lines / completed lines; a dash, never a number, when the technician has no completed lines in the range), Redo hours and Redo parts cost (the hours and parts cost of that comeback and warranty work). A whole no-charge Comeback or Warranty work order counts as one line in this tab, with all its hours and parts cost. A line with several technicians counts once for each of them, in the numerator and the denominator, hours and cost shown whole for each; the totals row counts every line once; a note under the table says so. A row "Unassigned" holds the work without an original technician (Not in ShopView, or no technician on the original). The dollar cost of labor arrives with labor posting. Export: the PDF carries both tabs as sections with the same columns; the CSV carries the tab that is open, as every export gives what is on screen.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 4 · Find internal and no-charge work orders", boards "05 Internal Work Orders report" (Flow 4 · Find internal and no-charge work orders), "06 Internal Work Orders report · by technician" (Flow 4 · Find internal and no-charge work orders).
Design pictures attached to this case:

 - iwo-flow4-05-05-internal-work-orders-report.png
 - iwo-flow4-06-06-internal-work-orders-report-by-technician.png
The design's two pictures differ above the table only in which tab is selected.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-136 · Design: Changing a report filter keeps the filters and tabs in place

Scan proposal I-S13 · folder Design — how it looks (136719) · refs SV-11766 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new customer for this test, customer A, flagged as an Internal customer.
 - Have a new customer for this test, customer B.
 - Have a new internal work order for this test, work order 1, for internal customer A, closed this month.
 - Have a new No Charge work order for this test, work order 2, for customer B, category Goodwill, closed this month.
 - Open the attached picture iwo-flow4-05-05-internal-work-orders-report.png at 100% zoom beside the screen.

**Steps**

1. Open Reports > Internal Work Orders.
2. Set the date range to this month.
3. Take a screenshot of the page.
4. Pick Internal in the "Classification" filter.
5. Pick All in the "Classification" filter.

**Expected Result**

Step 1:

 - The report opens.
Step 2:

 - Work order 1 and work order 2 show.
Step 3:

 - You have a picture of the report.
Step 4:

 - Only work order 1 shows.
 - The title, every filter box, the top of the summary strip and the two tabs are in the same place as in your screenshot.
Step 5:

 - Both work orders show again; the filters and tabs are still in the same place as in your screenshot.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11766 (Story 9, Reports, dashboard and exports)

 - S9-R2: “The report "Internal Work Orders" under Reports lists the closed internal and no-charge work orders of the organization and, one row each, the no-charge lines of invoiced billable work orders. Filters: date range on the posting or invoice date (default this month, at most 12 months), Location (all or one), Classification (All / Internal / No Charge / No Charge line), Category (All or one, archived under a heading), Original technician (All or one). Above the table a summary strip shows one card per category in the range: parts cost, count of work orders and lines, hours. Two tabs. "By work order and line", columns: Work order (link), Line ("Whole work order", or the line number and title), Customer, Classification, Category, Original work order (link, with the original line number when set), Original technician, Closed / invoiced (the posting date, or the invoice date for a line), Parts cost (one number: stock parts plus special orders and sublet, as on the NO CHARGE document, S3-R5; for a line, its own parts), Shop supplies (empty on a line), Hours (the labor hours on the lines, as on the document; clocked hours per technician are in Technician Efficiency with Only internal); a totals row for the whole range, not the page; rows sorted by date, newest first; an empty cell shows a dash, as every table of the app does; work order numbers and dates stay on one line at 1440 and 1536 pixels wide. "By technician", one row per technician with the columns Completed lines (lines with status Complete in the range on which the technician clocked time, the definition Technician Efficiency uses, so the two reports agree), Comeback lines and Warranty lines (no-charge lines of those categories whose stored original technicians include this technician, S2-R17), Comeback rate (comeback lines / completed lines; a dash, never a number, when the technician has no completed lines in the range), Redo hours and Redo parts cost (the hours and parts cost of that comeback and warranty work). A whole no-charge Comeback or Warranty work order counts as one line in this tab, with all its hours and parts cost. A line with several technicians counts once for each of them, in the numerator and the denominator, hours and cost shown whole for each; the totals row counts every line once; a note under the table says so. A row "Unassigned" holds the work without an original technician (Not in ShopView, or no technician on the original). The dollar cost of labor arrives with labor posting. Export: the PDF carries both tabs as sections with the same columns; the CSV carries the tab that is open, as every export gives what is on screen.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 4 · Find internal and no-charge work orders", board "05 Internal Work Orders report" (Flow 4 · Find internal and no-charge work orders).
Design pictures attached to this case:

 - iwo-flow4-05-05-internal-work-orders-report.png
This case checks the filters, the summary strip and the tabs; the design draws the report in one filter state.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-137 · Design: Opening a three-dots menu leaves the lines table headings in place

Scan proposal I-S16 · folder Design — how it looks (136719) · refs SV-11759,SV-12226 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new customer for this test, customer A, not flagged.
 - Have a new work order for this test, work order 1, for customer A, billable, not invoiced, with two lines.
 - Open the attached picture iwo-flow6-01-01-line-menu-mark-as-no-charge.png at 100% zoom beside the screen.

**Steps**

1. Open work order 1.
2. Take a screenshot of the page.
3. Click the three-dots menu of line 2.
4. Click an empty part of the page.
5. Click the three-dots menu in the header.

**Expected Result**

Step 1:

 - Work order 1 opens on the Lines tab.
Step 2:

 - You have a picture of the lines table.
Step 3:

 - The line menu opens over the rows below, with "Mark as No Charge" between Edit line and Delete line.
 - Every column heading is in the same place as in your screenshot: none has moved left or right.
 - No row moves down to make room for the menu.
Step 4:

 - The menu closes.
Step 5:

 - The work order menu opens over the page.
 - Every column heading is in the same place as in your screenshot: none has moved left or right.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11759 (Story 2, An internal or no-charge work order from creation to Close), story SV-12226 (Story 12, A no-charge line on a billable work order)

 - S12-R1: “On a billable work order, while the setting is on and the work order is not invoiced, the three-dots menu of every line offers "Mark as No Charge" between Edit line and Delete line. Edit Line and New Line show at the bottom, under a divider, the checkbox "No Charge" with the helper "This line shows $0.00 on the invoice. Hours and parts stay; the parts cost posts to the category's expense account." and, when ticked, the selects Category *, Original work order and Original line of S2-R2, so a line can be created No Charge. Both doors write the same fields. Lines the Line Builder creates (it has no dialog) are marked afterwards from the line menu.”
 - S2-R5: “On a billable work order on a regular customer, the three-dots menu offers "Convert to No Charge" (next to Add Work Order Fee / Discount) until the work order is invoiced. It opens the confirmation "Convert work order [number] to No Charge?" with the body "Prices, fees and discounts are removed from every line; costs and hours are kept. It closes with a NO CHARGE document instead of an invoice. You can convert it back until it is closed.", the required select "Category" (active No Charge categories; empty by default, "Pick a category" when missing), the selects "Original work order" and "Original line" of S2-R2 when the category requires it, and the buttons Cancel and "Convert to No Charge". Confirming applies S2-R3 and S2-R4, stores the category, the original work order and line, and writes the note of S2-R18. There is no checkbox on the work order detail. If the work order already carries no-charge lines (Story 12), converting it makes every line No Charge under the chosen category; the lines' own categories are replaced and the note names them.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 6 · Move one line off a billable work order", board "01 Line menu · Mark as No Charge" (Flow 6 · Move one line off a billable work order).
Design pictures attached to this case:

 - iwo-flow6-01-01-line-menu-mark-as-no-charge.png
The design draws the line menu floating over the rows.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-138 · Design: Turning the setting off keeps the categories table columns in place

Scan proposal I-S17 · folder Design — how it looks (136719) · refs SV-11758 · held: no

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Make sure the test location is connected to QuickBooks Online and that AccountingHub is not enabled.
 - Open the attached pictures iwo-flow0-04-2a-internal-work-orders-page-internal-categories.png, iwo-flow0-08-2e-internal-work-orders-page-setting-off.png at 100% zoom beside the screen.

**Steps**

1. Open Administration > Service > Internal Work Orders.
2. Take a screenshot of the page.
3. Open Settings > Work Orders.
4. Switch the "Internal Work Orders" toggle off.
5. Click Save settings.
6. Open Administration > Service > Internal Work Orders.

**Expected Result**

Step 1:

 - The Internal categories tab is open.
Step 2:

 - You have a picture of the categories page.
Step 3:

 - The Work Orders settings open.
Step 4:

 - The toggle is off.
Step 5:

 - The settings are saved.
Step 6:

 - The notice "Internal Work Orders is off. Turn it on in Settings > Work Orders." shows at the top.
 - The tabs and the table move down by the notice's height only; every column heading starts at the same left-right place as in your screenshot.
 - The lists stay editable: the row menus still offer Edit.

Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11758 (Story 1, Turn on Internal Work Orders, flag internal customers, manage categories)

 - S1-R13: “Administration > Service > Internal Work Orders is a page with two tabs. Internal categories: columns Category (the default carries a Default badge), QuickBooks expense account (with the QuickBooks mark; "Not set" with a warning icon when empty), Internal customers using it, Work orders (count, all time; a billable work order with a no-charge line of the category counts too), and a row menu with Edit and Archive. No Charge categories: Category, QuickBooks expense account, Original work order (Required / Not asked), Work orders, row menu. Buttons "New Internal Category" and "New No Charge Category". Under the Internal categories tab a hint reads "Set on the customer, or on the asset for one unit. An internal work order takes it when it is created." The starting set is seeded for every organization when this release ships, so the categories, the QuickBooks rows (S5-R5) and the hub rows (S6-R2) exist before the setting is turned on; turning the setting on seeds nothing: General Internal (default, cannot be archived); Warranty (requires the original work order), Goodwill (does not), Comeback (requires). Archived categories stay on the work orders and lines that used them and in the report filter under Archived; a "Show archived (n)" link lists them with Restore. The page needs 'Settings — Service', like every Administration > Service page; while the setting is off it shows the notice "Internal Work Orders is off. Turn it on in Settings > Work Orders." and the lists stay editable. Each list holds up to 100 active categories; past that, the New button is disabled with "You can have up to 100 active categories in this list. Archive one to add another." The QuickBooks expense account column is shown only while the current location is connected to QuickBooks.”
 - S1-R10: “Turning the toggle off hides the hint line and the customer badges and leaves the flags on the customers. Open internal work orders are not touched: they keep their badge and close as internal. New work orders for a flagged customer are billable while the toggle is off. Turning it on again (with Save settings, like any other toggle) opens no modal: the customer badges and the hint line come back and, on Save settings, for every flagged customer with open billable work orders, the dialog of S1-R11 is shown, one after another. New internal customers are flagged on Edit Customer (S1-R7).”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 0 · Turn it on", boards "2a Internal Work Orders page · Internal categories" (Flow 0 · Turn it on), "2e Internal Work Orders page · setting off" (Flow 0 · Turn it on).
Design pictures attached to this case:

 - iwo-flow0-04-2a-internal-work-orders-page-internal-categories.png
 - iwo-flow0-08-2e-internal-work-orders-page-setting-off.png
The design's two pictures keep the four headings at the same left-right places; the notice pushes the page down.
Difference: register IWO-D07: the design greys the tables while the setting is off; the PRD keeps the lists editable. The case follows the PRD.
AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026

### D-139 · Design: Work orders list columns keep their place when Classification changes

Scan proposal I-S07 · folder Design — how it looks (136719) · refs SV-11759 · held: yes

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new customer for this test, customer A, flagged as an Internal customer, whose name is long with spaces and starts with a word that no other customer in the organization uses (for example Quillmont Heavy Truck and Trailer Repair Services of North Dakota).
 - Have a new customer for this test, customer B, whose name starts with the same word as customer A's and is long with no spaces (for example QuillmontHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new internal work order for this test, work order 1, for internal customer A, in Estimate.
 - Have a new work order for this test, work order 2, for customer B, billable, in Estimate.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Open the attached pictures iwo-flow4-01-01-work-orders-list.png, iwo-flow4-02-02-list-no-charge.png, iwo-flow4-03-03-list-no-charge-no-results.png at 100% zoom beside the screen.

**Steps**

1. Open Work Orders.
2. Type the first word of customer A's name in the work orders search.
3. Take a screenshot of the page.
4. Click the Classification chip.
5. Pick Internal.
6. Click the Classification chip.
7. Pick No Charge.

**Expected Result**

Step 1:

 - The work orders list opens.
Step 2:

 - Work order 1 and work order 2 show.
Step 3:

 - You have a picture of the list with both rows.
Step 4:

 - The chip offers All, Billable, Internal and No Charge.
Step 5:

 - Only work order 1 shows.
 - Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 6:

 - The chip's values show.
Step 7:

 - No row shows.
 - Every column heading is in the same place as in your screenshot: none has moved left or right.

The results that compare the column headings with your screenshot wait on the product owner's answer: the design draws the columns at different places in these two states and no source says whether they should stay. Every other result can be checked now.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11759 (Story 2, An internal or no-charge work order from creation to Close)

 - S2-R14: “While the Internal Work Orders setting is on, the work orders list shows a chip "Classification: All / Billable / Internal / No Charge" (the existing single-choice chip), default All, on every tab and in the mobile filter sheet. While the setting is off the chip is not shown; the badges on the rows stay.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 4 · Find internal and no-charge work orders", boards "01 Work orders list" (Flow 4 · Find internal and no-charge work orders), "02 List · No Charge" (Flow 4 · Find internal and no-charge work orders), "03 List · No Charge, no results" (Flow 4 · Find internal and no-charge work orders).
Design pictures attached to this case:

 - iwo-flow4-01-01-work-orders-list.png
 - iwo-flow4-02-02-list-no-charge.png
 - iwo-flow4-03-03-list-no-charge-no-results.png
The design draws the headings 1 to 4 pixels apart for Internal and up to 214 pixels apart when no row is left (Customer, Unit #, Asset, Lead Technician, Lines, Total price); the PO is asked (question 17).
AUTOMATION: HOLD - waiting on the PO (question 17)

### D-140 · Design: Work orders list columns keep their place on the All tab with Closed

Scan proposal I-S08 · folder Design — how it looks (136719) · refs SV-11759 · held: yes

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new customer for this test, customer A, flagged as an Internal customer, whose name is long with spaces and starts with a word that no other customer in the organization uses (for example Quillmont Heavy Truck and Trailer Repair Services of North Dakota).
 - Have a new customer for this test, customer B, whose name starts with the same word as customer A's and is long with no spaces (for example QuillmontHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new internal work order for this test, work order 1, for internal customer A, in Estimate.
 - Have a new work order for this test, work order 2, for customer B, billable, in Estimate.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Have a new internal work order for this test, work order 3, for internal customer A, closed.
 - Open the attached pictures iwo-flow4-01-01-work-orders-list.png, iwo-flow1-23-09-work-orders-list-all-tab-status-closed.png at 100% zoom beside the screen.

**Steps**

1. Open Work Orders.
2. Type the first word of customer A's name in the work orders search.
3. Take a screenshot of the page.
4. Click the All tab.
5. Pick Closed in the Status chip.

**Expected Result**

Step 1:

 - The work orders list opens.
Step 2:

 - Work order 1 and work order 2 show.
Step 3:

 - You have a picture of the list.
Step 4:

 - Work order 1, work order 2 and work order 3 show.
 - Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 5:

 - Only work order 3 shows, with its badge.
 - Every column heading is in the same place as in your screenshot: none has moved left or right.

The results that compare the column headings with your screenshot wait on the product owner's answer: the design draws the columns at different places in these two states and no source says whether they should stay. Every other result can be checked now.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11759 (Story 2, An internal or no-charge work order from creation to Close)

 - S2-R10: “The work orders list shows the badge in the status column for internal and no-charge work orders in every tab, in the Tech View display and on the mobile card. Open and closed internal and no-charge rows show "No Charge" in Total Price (the column exists only for users with 'See Financial Data'; others see the badge); closed ones show where invoiced ones show (the All tab, Status "Closed"; the filter value Closed appears once the organization has switched the setting on or closed a work order, the trigger that makes the report appear in S9-R4, so a shop that never uses the feature sees its filter as before), not in the Completed tab, which lists work waiting for an invoice. Board cards show the badge, and a closed internal or no-charge work order sits where an invoiced one sits on the Board. Schedule cards show the badge next to the work order number (the card shows no status text); global search results show it next to the status. The Status chip on the All tab gets the value "Closed", which matches only closed internal and no-charge work orders; Invoiced and Paid do not match them. The customer's and the asset's Work Orders tabs show the same badge.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): pages "Flow 4 · Find internal and no-charge work orders" / "Flow 1 · Create and close", boards "01 Work orders list" (Flow 4 · Find internal and no-charge work orders), "09 Work orders list · All tab, Status Closed" (Flow 1 · Create and close).
Design pictures attached to this case:

 - iwo-flow4-01-01-work-orders-list.png
 - iwo-flow1-23-09-work-orders-list-all-tab-status-closed.png
The design draws Unit #, Asset and Lead Technician 9 to 42 pixels apart between these two states; the PO is asked (question 17).
AUTOMATION: HOLD - waiting on the PO (question 17)

### D-141 · Design: Report table headings keep their place when the rows change

Scan proposal I-S14 · folder Design — how it looks (136719) · refs SV-11766 · held: yes

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new Internal category for this test, category A, whose name is 60 characters long with spaces (for example Plainsview Company Vehicle and Heavy Equipment Upkeep Region).
 - Have a new No Charge category for this test, category B, with "Requires the original work order" unticked, whose name is 60 characters long with no spaces (for example PlainsviewCompanyVehicleHeavyEquipmentMaintenanceNorthRegion).
 - Have a new user for this test, technician A, a technician whose first name is long with no spaces (for example Bartholomewvanderbiltmontgomeryfitzgerald).
 - Have a new customer for this test, customer A, flagged as an Internal customer, whose Default internal category is category A, whose name is long with spaces (for example Plainsview Heavy Truck and Trailer Repair Services of North Dakota).
 - Have a new customer for this test, customer B, whose name is long with no spaces (for example PlainsviewHeavyTruckTrailerRepairServicesLimitedNorthDakota).
 - Have a new customer for this test, customer C, whose name has the characters & " ' < > (for example Plainsview A&B "Fleet" O'Neil <Parts> & Sons).
 - Have a new invoiced work order for this test, work order 4, for customer B, whose line 1 was worked by technician A.
 - Have a new internal work order for this test, work order 1, for internal customer A, closed this month.
 - Have a new No Charge work order for this test, work order 2, for customer B, category B, closed this month, with work order 4's line 1 as its original line.
 - Have a new work order for this test, work order 3, for customer C, invoiced this month, billable, whose line 2 has a long title with no spaces (for example ReplaceFrontAndRearBrakeChambersSlackAdjustersAndEveryAirLine) and was No Charge under Goodwill.
 - If a name field stops before the end of a name, use the longest name it takes; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - The category Name field takes 60 characters at most; if it refuses one of the characters & " ' < >, leave that character out and write down which.
 - Have enough other closed internal work orders this month for the report table to need scrolling (for example 40), made for this test.
 - Open the attached picture iwo-flow4-05-05-internal-work-orders-report.png at 100% zoom beside the screen.

**Steps**

1. Open Reports > Internal Work Orders.
2. Set the date range to this month.
3. Take a screenshot of the page.
4. Pick Internal in the "Classification" filter.
5. Pick All in the "Classification" filter.
6. Scroll down to the totals row at the end of the table.
7. Scroll back to the top of the table.

**Expected Result**

Step 1:

 - The report opens.
Step 2:

 - The rows show, with work order 1, work order 2 and work order 3's line 2 among them.
Step 3:

 - You have a picture of the table's headings.
Step 4:

 - Only internal work orders show.
 - Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 5:

 - Every row type shows again.
 - Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 6:

 - The totals row shows under the last row; the values of the last rows line up with the totals row's columns.
Step 7:

 - The headings show again.
 - Every column heading is in the same place as in your screenshot: none has moved left or right.

The results that compare the column headings with your screenshot wait on the product owner's answer: the design draws the columns at different places in these two states and no source says whether they should stay. Every other result can be checked now.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11766 (Story 9, Reports, dashboard and exports)

 - S9-R2: “The report "Internal Work Orders" under Reports lists the closed internal and no-charge work orders of the organization and, one row each, the no-charge lines of invoiced billable work orders. Filters: date range on the posting or invoice date (default this month, at most 12 months), Location (all or one), Classification (All / Internal / No Charge / No Charge line), Category (All or one, archived under a heading), Original technician (All or one). Above the table a summary strip shows one card per category in the range: parts cost, count of work orders and lines, hours. Two tabs. "By work order and line", columns: Work order (link), Line ("Whole work order", or the line number and title), Customer, Classification, Category, Original work order (link, with the original line number when set), Original technician, Closed / invoiced (the posting date, or the invoice date for a line), Parts cost (one number: stock parts plus special orders and sublet, as on the NO CHARGE document, S3-R5; for a line, its own parts), Shop supplies (empty on a line), Hours (the labor hours on the lines, as on the document; clocked hours per technician are in Technician Efficiency with Only internal); a totals row for the whole range, not the page; rows sorted by date, newest first; an empty cell shows a dash, as every table of the app does; work order numbers and dates stay on one line at 1440 and 1536 pixels wide. "By technician", one row per technician with the columns Completed lines (lines with status Complete in the range on which the technician clocked time, the definition Technician Efficiency uses, so the two reports agree), Comeback lines and Warranty lines (no-charge lines of those categories whose stored original technicians include this technician, S2-R17), Comeback rate (comeback lines / completed lines; a dash, never a number, when the technician has no completed lines in the range), Redo hours and Redo parts cost (the hours and parts cost of that comeback and warranty work). A whole no-charge Comeback or Warranty work order counts as one line in this tab, with all its hours and parts cost. A line with several technicians counts once for each of them, in the numerator and the denominator, hours and cost shown whole for each; the totals row counts every line once; a note under the table says so. A row "Unassigned" holds the work without an original technician (Not in ShopView, or no technician on the original). The dollar cost of labor arrives with labor posting. Export: the PDF carries both tabs as sections with the same columns; the CSV carries the tab that is open, as every export gives what is on screen.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 4 · Find internal and no-charge work orders", board "05 Internal Work Orders report" (Flow 4 · Find internal and no-charge work orders).
Design pictures attached to this case:

 - iwo-flow4-05-05-internal-work-orders-report.png
The design draws one state of this table; its columns are sized to their content and its cells wrap, so the rows decide the widths. The design library says tables in the product scroll (no pages). The PO is asked (question 17).
AUTOMATION: HOLD - waiting on the PO (question 17)

### D-142 · Design: Technician Efficiency columns keep their place when the chip changes

Scan proposal I-S15 · folder Design — how it looks (136719) · refs SV-11766 · held: yes

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Have a new user for this test, technician A, a technician whose name is long with spaces (for example Maximilian Alexander Montgomery-Fitzgerald Vanderbilt).
 - Have a new customer for this test, customer A, flagged as an Internal customer.
 - Have a new customer for this test, customer B.
 - Have a new internal work order for this test, work order 1, for internal customer A, closed this month, on which technician A clocked 2.0 hours.
 - Have a new work order for this test, work order 2, for customer B, invoiced this month, billable, on which technician A clocked 1.0 hour.
 - Open the attached picture iwo-flow4-04-04-technician-efficiency-show-all.png at 100% zoom beside the screen.

**Steps**

1. Open Reports > Technician Efficiency.
2. Set the date range to this month.
3. Take a screenshot of the page.
4. Click the Internal work orders chip.
5. Pick Only internal.
6. Click the Internal work orders chip.
7. Pick Hide.

**Expected Result**

Step 1:

 - The report opens with the chip on Show all.
Step 2:

 - Technician A's row shows the hours of work order 1 and work order 2.
Step 3:

 - You have a picture of the report.
Step 4:

 - The chip offers Hide, Only internal and Show all.
Step 5:

 - Technician A's row shows only work order 1's hours.
 - Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 6:

 - The chip's values show.
Step 7:

 - Technician A's row shows only work order 2's hours.
 - Every column heading is in the same place as in your screenshot: none has moved left or right.

The results that compare the column headings with your screenshot wait on the product owner's answer: the design draws the columns at different places in these two states and no source says whether they should stay. Every other result can be checked now.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11766 (Story 9, Reports, dashboard and exports)

 - S9-R3: “Technician Efficiency shows a filter chip "Internal work orders: Hide / Only internal / Show all" (the existing single-choice chip; the chip covers internal and no-charge work orders, tooltip "Internal and no-charge work orders"), default Show all, on both the Invoiced and the Completed tab, so internal hours count as work from the start. With Only internal, hours per technician come from internal and no-charge work orders only, so the accountant can take them for a manual labor entry; a closed internal work order counts as invoiced on the Invoiced tab. With Hide, both the billed and the clocked hours of those work orders are left out. On a billable work order a no-charge line's estimated hours are never counted as invoiced hours and its labor price (zero) never enters the effective labor rate, in the report and in the dashboard Billing Efficiency and Technician Efficiency cards; its clocked hours count as worked hours under Show all and Only internal. The chip's value is part of the report's filter state like any other filter.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 4 · Find internal and no-charge work orders", board "04 Technician Efficiency · Show all" (Flow 4 · Find internal and no-charge work orders).
Design pictures attached to this case:

 - iwo-flow4-04-04-technician-efficiency-show-all.png
The design draws one state of this report; the PO is asked (question 17).
AUTOMATION: HOLD - waiting on the PO (question 17)

### D-143 · Design: Lines table columns keep their place when a line is marked No Charge

Scan proposal I-S09 · folder Design — how it looks (136719) · refs SV-12226 · held: yes

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Make sure the test location has no accounting integration (neither QuickBooks Online nor AccountingHub).
 - Have a new customer for this test, customer A, not flagged.
 - Have a new work order for this test, work order 1, for customer A, billable, not invoiced, with two lines, each with 1.0 h of labor and one stock part with a cost.
 - Open the attached pictures iwo-flow6-01-01-line-menu-mark-as-no-charge.png, iwo-flow6-03-03-line-marked-no-charge-0-00.png, iwo-flow6-04-04-line-menu-change-category-mark-as-billable.png at 100% zoom beside the screen.

**Steps**

1. Open work order 1.
2. Take a screenshot of the page.
3. Click the three-dots menu of line 2.
4. Click Mark as No Charge.
5. Pick Goodwill in Category.
6. Click "Mark as No Charge" in the window.
7. Click the three-dots menu of line 2.
8. Click Mark as Billable.
9. Click "Mark as Billable" in the window.

**Expected Result**

Step 1:

 - Work order 1 opens on the Lines tab.
Step 2:

 - You have a picture of the lines table.
Step 3:

 - The line menu opens.
Step 4:

 - The window "Mark this line as No Charge?" opens.
Step 5:

 - Goodwill is picked.
Step 6:

 - Line 2 shows the chip "No Charge · Goodwill" and $0.00.
 - Line 2 still has its three-dots menu.
 - Every column heading is in the same place as in your screenshot: none has moved left or right.
Step 7:

 - The menu offers "Change category" and "Mark as Billable".
Step 8:

 - The confirmation "Mark line as billable?" opens.
Step 9:

 - The chip is gone and line 2 shows a price again.
 - Every column heading is in the same place as in your screenshot: none has moved left or right.

The results that compare the column headings with your screenshot wait on the product owner's answer: the design draws the columns at different places in these two states and no source says whether they should stay. Every other result can be checked now.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-12226 (Story 12, A no-charge line on a billable work order)

 - S12-R3: “A no-charge line shows the chip "No Charge · [category]" next to its title on the lines table, in Tech View and on mobile; Rate, Total and every part on it show $0.00; Margin shows nothing. Hours, technician, status, approval, parts ordering, picking, receiving, clock-ins, notes, inspections and the story work as on any line. The original work order and line are not shown on the line; they are in the notes, the Audit Log, the report and the hub record.”
 - S12-R5: “The three-dots menu of a no-charge line offers "Change category" (the dialog of S12-R2 with the current values; Save is enabled once the category, the original work order or the original line differs) and "Mark as Billable" (confirmation "Mark line as billable?" with the body "The line is priced as a new line would be today. You can mark it No Charge again until the work order is invoiced."); confirming removes the chip and the category and prices the line as S2-R6 prices a line: labor at the customer's rate, else the location's; parts from the pricing rules on the cost already on the line. Both are unavailable once the work order is invoiced; the invoice is reversed first, as for Convert (S2-R9).”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 6 · Move one line off a billable work order", boards "01 Line menu · Mark as No Charge" (Flow 6 · Move one line off a billable work order), "03 Line marked No Charge · $0.00" (Flow 6 · Move one line off a billable work order), "04 Line menu · Change category, Mark as Billable" (Flow 6 · Move one line off a billable work order).
Design pictures attached to this case:

 - iwo-flow6-01-01-line-menu-mark-as-no-charge.png
 - iwo-flow6-03-03-line-marked-no-charge-0-00.png
 - iwo-flow6-04-04-line-menu-change-category-mark-as-billable.png
The design draws Actual/Estimate and Status about 40 pixels further right once the line carries its chip (boards 01 and 04), and board 03 drops the three-dots column. The menu is settled by the PRD; the column places are asked (question 18).
AUTOMATION: HOLD - waiting on the PO (question 18)

### D-144 · Design: Lines table columns keep their place when the work order is converted

Scan proposal I-S10 · folder Design — how it looks (136719) · refs SV-11759 · held: yes

**Preconditions**

- Sign in as an Admin (a user with every setting, See Financial Data included).
 - Use a desktop browser window 1440 pixels wide at 100% zoom.
 - Make sure the Internal Work Orders setting is on in Settings > Work Orders.
 - Make sure the test location has no accounting integration (neither QuickBooks Online nor AccountingHub).
 - Have a new customer for this test, customer A, not flagged.
 - Have a new work order for this test, work order 1, for customer A, billable, not invoiced, with no deposit, with two lines, each with 1.0 h of labor and one stock part with a cost.
 - Open the attached pictures iwo-flow2-01-01-convert-to-no-charge.png, iwo-flow2-05-03-no-charge-work-order.png at 100% zoom beside the screen.

**Steps**

1. Open work order 1.
2. Take a screenshot of the page.
3. Click the three-dots menu in the header.
4. Click Convert to No Charge.
5. Pick Goodwill in Category.
6. Click "Convert to No Charge" in the window.
7. Click the three-dots menu in the header.
8. Click Convert to Billable.
9. Click "Convert to Billable" in the window.

**Expected Result**

Step 1:

 - Work order 1 opens on the Lines tab.
Step 2:

 - You have a picture of the lines table.
Step 3:

 - The menu opens.
Step 4:

 - The window "Convert work order [number] to No Charge?" opens.
Step 5:

 - Goodwill is picked.
Step 6:

 - Work order 1 shows the "No Charge" badge.
 - The Rate, Margin and Total columns are hidden.
 - The Name/Description, Actual/Estimate and Status headings are in the same place as in your screenshot.
Step 7:

 - The menu offers "Change category" and "Convert to Billable".
Step 8:

 - The window "Convert work order [number] to billable?" opens.
Step 9:

 - The badge is gone and the Rate and Total columns show again.
 - Every column heading is in the same place as in your screenshot: none has moved left or right.

Words in square brackets in a message stand for the value they name, such as the work order's number or the customer's name exactly as it is saved; every other word of the message must match exactly. The results that compare the column headings with your screenshot wait on the product owner's answer: the design draws the columns at different places in these two states and no source says whether they should stay. Every other result can be checked now.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence 942243841, version 1.3 (12 Nov 2026, Milos Vasic), read 12 Nov 2026 · Epic SV-11665, story SV-11759 (Story 2, An internal or no-charge work order from creation to Close)

 - S2-R4: “Lines on an internal or no-charge work order show quantity, cost (parts) and hours (labor) and no sell prices: the Rate, Margin and Total columns of the lines table (a part's sell price sits in Rate) and the Sell price, Rate and Margin fields of the line and part dialogs are hidden and not required; there is no work order total, tax, fee or discount block; the shop supplies block is the flat amount of Story 10. Cost is shown only to users with 'See Financial Data', as cost is today; other users see quantity and hours. The estimate and invoice documents for these work orders show the same and carry the INTERNAL stamp on an internal work order and the NO CHARGE stamp on a no-charge one, the same as the closed document (S3-R5), and, on a no-charge work order, the line "Category: [Category]" under the stamp; the shop-floor Print Work Order is unchanged (it carries no prices today). Board cards and the statistics that show a work order total show "No Charge" in place of the amount.”
 - S2-R5: “On a billable work order on a regular customer, the three-dots menu offers "Convert to No Charge" (next to Add Work Order Fee / Discount) until the work order is invoiced. It opens the confirmation "Convert work order [number] to No Charge?" with the body "Prices, fees and discounts are removed from every line; costs and hours are kept. It closes with a NO CHARGE document instead of an invoice. You can convert it back until it is closed.", the required select "Category" (active No Charge categories; empty by default, "Pick a category" when missing), the selects "Original work order" and "Original line" of S2-R2 when the category requires it, and the buttons Cancel and "Convert to No Charge". Confirming applies S2-R3 and S2-R4, stores the category, the original work order and line, and writes the note of S2-R18. There is no checkbox on the work order detail. If the work order already carries no-charge lines (Story 12), converting it makes every line No Charge under the chosen category; the lines' own categories are replaced and the note names them.”
 - S2-R6: “On a no-charge work order the menu offers "Change category" and "Convert to Billable" until the work order is closed. Convert to Billable opens "Convert work order [number] to billable?" with the body "Every line is priced as a new line would be today. You can convert it to no charge again until it is invoiced." and the buttons Cancel and "Convert to Billable"; confirming removes the badge and the category, and every line comes back billable, including lines that carried their own No Charge mark before the work order was converted (S2-R5 replaced their categories; the advisor marks them again if needed), priced the way a new line on this work order would be priced that day: labor at the customer's labor rate, else the location's; parts from the pricing rules applied to the cost already on the line (the cost Close would post), not today's catalogue cost. Change category opens the dialog "Change category for work order [number]" with the Category select (the current category preselected) and, when the new category requires it, the Original work order and Original line selects of S2-R2 (changing to a category that does not require them clears them) and the buttons Cancel and Save; Save is enabled once the category, the original work order or the original line differs from the current values (as on a line, S12-R5), so a missing original can be added before Close; it changes nothing else. It is offered while the setting is off too (S2-N1). After Close the category is locked with the classification (S2-R9); a wrong category on a closed work order is fixed by Reopen, Change category and Close again, an accepted cost of one lock for everything. Cancelling or dismissing any of these leaves the work order as it was. If a no-charge estimate was sent to the portal, after Convert to Billable the portal hides the NO CHARGE stamp and shows the live price summary; Approve and Decline keep working and the advisor re-sends when wanted.”
The build is not yet available to check this case against.

References from Design
Design canvas "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo), version 1794561577-f903 (its boards byte-identical to version 1794510020-d4ec, which redrew 15 boards for PRD v1.2/v1.3, read and rendered 12 Nov 2026; the other 152 unchanged since version 1794484794-2031; checked 13 Nov 2026): page "Flow 2 · No charge on a customer's work order", boards "01 Convert to No Charge" (Flow 2 · No charge on a customer's work order), "03 No charge work order" (Flow 2 · No charge on a customer's work order).
Design pictures attached to this case:

 - iwo-flow2-01-01-convert-to-no-charge.png
 - iwo-flow2-05-03-no-charge-work-order.png
The design moves the Rate heading about 52 pixels after Convert and keeps Rate and Total with empty cells (register IWO-D17, settled by the PRD: they are hidden). The places of the other columns are asked (question 18).
AUTOMATION: HOLD - waiting on the PO (question 18)
