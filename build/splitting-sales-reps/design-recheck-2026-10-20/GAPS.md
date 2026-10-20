# Splitting Sales Representatives — design re-check, both ways: the gaps (20 Oct 2026)

QA lead, 20 Oct 2026: "see if you had missed adding the test cases related to design for this and add the missed one after learning
from the yesterday's incident". Lessons applied: L-01 (the look, not only the words) and L-02 (check both ways; every menu, list,
dialog, tooltip and message by hand, row by row; every difference closed by a ruling or a question, never "KNOWN").
Sources: PRD **v10** (Confluence 919928833, 19 Oct 2026, Chris Ward; the 120 cases were written on v8), Chris Ward's 38 answers of
19 Oct 2026 (`chris-answers.json`), the design export of 19 Oct 2026 (68 boards, **every picture looked at again today**).
Nothing was written to TestRail, Jira, Slack or Google; nothing was committed.

## 1 · Result in one table

| | Count | File |
|---|---|---|
| PRD v10 elements checked against the design | 78: SHOWN 51 · DIFFERENT 9 · NOT DRAWN 18 | `SPEC-TO-DESIGN-v10.md/.json` |
| Menus, lists, dialogs, tooltips, messages compared row by row by hand | 27 | same file, second table |
| Design text rows re-classified (v10 + answers) | 1,370: SAME 194 · DESIGN-ONLY 388 · DIFFERENT 5 · DATA 783; **MISSING 5** · CHECK BY HAND 0 | `DESIGN-TO-CASES.md/.json` |
| Visual inventory rows | 70: COVERED 64 · **MISSING 6** | same file |
| Divergence register rows (Rule 130) | 59: PO-RULED 12 · DESIGN-SILENT 40 · SHOWN-WHEN-DRIVEN 4 · **QUESTION-NEEDED 3** | `DESIGN-DIVERGENCE-REGISTER.json` |
| `spec_to_design_check.py` (OCR + canvas + hand transcription as the design files) | 35 PRD words not in the design text, 0 open in the register, exit 0 | `spec-to-design-tool-run.txt` |
| `design_text_inventory.py` on the design files | 138 texts, 127 already in a case, 11 left: 6 page names + 5 page intros / fragments, all classified in `DESIGN-TO-CASES` | `tools/inventory-run/` |
| **Missing design checks** | **8** (3 of them held "design version" cases waiting on the PO) | below; drafts in `new-design-cases.json` |
| Existing design cases whose expectations v10 or the answers changed | 11 of 18 (plus all 18 quote "version 8") | §4 |

**What the text check could not see (the L-02 trap again):** PRD v10 S2-N2 says the part sale's label stays "Sales representative";
the boards read "Sales Representative". `spec_to_design_check.py` reports nothing for it, because it matches case-insensitively and
also finds "Sales representative changed" in the log board. It was found only by looking at board 3.1 (4x crop). Our own C666030
expects the capital R.

## 2 · The missing design checks (each drafted in `new-design-cases.json`, section 84277)

| Gap | Draft | Title | Why it is missing | Source | Boards |
|---|---|---|---|---|---|
| GAP-1 | DR-01 | Design: invoiced card keeps "Lead technician" and "Service advisor" labels | v10 added the sentence; C666024 / C665932 state only the Sales Representative labels | S2-R17 v10; answer 8 | 1.17, 1.2 |
| GAP-2 | DR-02 | Design: a part sale's field label still reads "Sales representative" | v10 fixed the label; the design shows a capital R and **C666030 expects the capital R (wrong now)**; C665935 does not check the label | S2-N2 v10; answer 7 | 3.1, 3.2, 3.4 |
| GAP-3 | DR-03 (**held**) | Design: a part sale row shows a dash in the labor columns | design-only change from today (board 4.3 shows 0.00 / $0.00); no PRD sentence, no answer, no case | S5-R9, S5-R3; question Q-A | 4.3, 4.10, 4.11, 4.12 |
| GAP-4 | DR-04 | Design: invoice dates in the Expanded exports match the screen | answer 33 made it a rule; no case compares export dates with the screen | answer 33 | 4.10, 4.11, 4.12 |
| GAP-5 | DR-05 (**held**) | Design: on a phone the reps show under the "Hide Details" toggle | every phone board (today and build) shows "Hide Details"; PRD and answer 9 say "edit button" | S3-R6; answer 9; question Q-B | 6.0, 6.2 |
| GAP-6 | DR-06 | Design: Sales Type sits between Status and Location | v10 added "before Location"; the design draws no Location column; no case checks it | S5-R19, S5-R23 v10; answer 26 | 4.9, 4.11, 4.12 |
| GAP-7 | DR-07 | Design: each split row shows its share under Adjustments | v10 added "Each row shows its share in its Adjustments column"; the boards show it; no case names the column (C665964 says "judge the amounts wherever they show") | S5-R6 v10; answer 22 | 4.7, 4.11, 4.12 |
| GAP-8 | DR-08 (**held**) | Design: a Lead Technician message pushes the fields below it down | new v10 requirement, no case, no board, and no source says what makes the message show | S1-R6a v10; answer 4; question Q-C | 1.2 |

DR-01 and DR-02 could instead be folded into C666024 and C666030 (those cases are ours; C666030 must change either way). Held cases
(DR-03, DR-05, DR-08) carry `AUTOMATION: HOLD - …waiting on the PO` and, per Rule 130 item 5, go into a run only once released.
All 8 drafts pass the suite's own checks (title ≤ 80 with "Design: ", one "Step N:" result per step, placeholders defined, quotes
verbatim against PRD v10 and the answers, "From:" line per document, build line, "References from Design", AUTOMATION last,
pictures named in the preconditions): `tools/draft_new_cases.py`, 0 problems.

## 3 · Questions the register needs (drafted 20 Oct 2026, **not sent** — unsent count 3; the lane session sends)

| # | Row in the register | Question (plain words) |
|---|---|---|
| Q-A | `S5-R9\|part sale labor columns` | A part sale row has no labor. The design shows a dash in Labor Delta, Labor Invoiced and Labor Margin (blank labor and hours cells in the CSV); today's report shows 0.00 / $0.00. The feature spec gives the dash rule only for a work order's Labor and Parts rows and a part sale's Shop Supplies. Which is right: (a) dash / blank as the design shows; (b) 0.00 / $0.00 as today? |
| Q-B | `S3-R6\|expand control` | On a phone, the design's picture of today (board 6.0) and every build board show a "Hide Details" toggle above the work order card and no edit button. Your answer 9 says the fields show after the card is expanded with its edit button, not "Show Details". Which control does a tester tap: (a) the card's edit button (where is it?); (b) the "Show Details" / "Hide Details" toggle; (c) both? |
| Q-C | `S1-R6a\|Lead Technician message` | What makes a Lead Technician message show under the Lead Technician field, so a tester can see it push the fields down? (The tech plan says Lead Technician is not a required field.) |

## 4 · Existing design cases whose expectations v10 or the answers changed (listed, NOT rewritten; Rules 122, 123)

All 18 design cases (C666017–C666034, created by us on 19 Oct 2026) quote "PRD … version 8"; their "From:" line needs version 10 and
a read date. Beyond that:

| Case | What changed | Source |
|---|---|---|
| [C666030](https://shopview.testrail.io/index.php?/cases/view/666030) | Step 1 expects "Sales Representative"; v10 keeps "Sales representative". Its S2-N2 quote (v8) is shorter than v10. Its note "on the product owner's question sheet" is answered | S2-N2 v10; answer 7 |
| [C666024](https://shopview.testrail.io/index.php?/cases/view/666024) | S2-R17 quote is v8; v10 adds "Lead Technician and Service Advisor keep today's read-only labels", which the case does not check | S2-R17 v10; answer 8 |
| [C666025](https://shopview.testrail.io/index.php?/cases/view/666025) | S7-R1 quote is v8; v10 adds the same-person example | S7-R1 v10; answer 31 |
| [C666026](https://shopview.testrail.io/index.php?/cases/view/666026) | S4-R3 quote is v8 (v10 adds the part-sale sentence); the "on the question sheet" note is answered (A to Z wins) | S4-R3 v10; answer 15 |
| [C666031](https://shopview.testrail.io/index.php?/cases/view/666031) | S5-R15 (v10 adds the Labor Delta 0.0 rule) and S5-R19 (v10 adds "before Location") quotes are v8; the Shop Supplies note is answered | answers 24, 25, 26 |
| [C666032](https://shopview.testrail.io/index.php?/cases/view/666032) | S5-R23 (v10 "before Location") and S8-R4 (v10 "other empty exports still download") quotes are v8; note answered | answers 24, 26, 27 |
| [C666018](https://shopview.testrail.io/index.php?/cases/view/666018) | "on the product owner's question sheet" (22 px vs 16 px) is answered: 16 px | answer 2 |
| [C666034](https://shopview.testrail.io/index.php?/cases/view/666034) | arrow-at-rest note answered (arrow always shows); phone expand control now has question Q-B | answers 11, 9 |
| [C666017](https://shopview.testrail.io/index.php?/cases/view/666017) | step 2 still says the "before" board measures 36 px; v10 dropped that context note | answer 3 |
| [C666033](https://shopview.testrail.io/index.php?/cases/view/666033) | no change to its expectations; answer 28 confirms the option rename it already expects | answer 28 |
| [C666028](https://shopview.testrail.io/index.php?/cases/view/666028) | no change; v10 S4-N2 adds "(Inactive)" on the customer page, which no board draws (DESIGN-SILENT) | S4-N2 v10; answer 14 |

### 4b · Behaviour cases (outside the design section) that v10 or the answers changed — for the same decision

C665932 (S2-R17) · C665935 (S2-N2 label) · C665940, C665990 (S4-R3) · C665947, C666003 (S4-E1, ~10 customers; C666003 note answered by 19) ·
C665954 (S4-N2) · **C665959 step 4 expects the plain name; v10 S4-N2 says "(Inactive)"** (answer 14) · C665957, C665958 (S4-R21: the
Deactivate window's new line and the unchanged Turn Off warning are not checked; S4-R20 reactivation not checked) (answers 12, 13) ·
C665960 (S4-R23 file name sales-representative-assignments.csv, answer 17) · C665962, C665963, C665972, C665973, C665991 (S5-R15,
S5-R19, S5-R23) · C665964, C665965, C665992 (S5-R6 Adjustments, answer 22) · **C665966 (S5-R7 rule replaced: Parts rounded to the
nearest cent, Labor gets the rest; example ($0.67)/($0.33); its note "a question for the product owner" is answered by 21)** ·
C665967 (S5-R8, answer 23) · C665968 (S5-R15a, answer 25) · C665981 (S7-R1; its step-4 note is answered by 31), C665982 · C665983 (S7-R4) ·
C665985, C665987 (S8-R4, S8-R9; answer 27) · C666008 (S8-E1; its note is answered by 29).
**v10 requirements with no case at all (behaviour, not design):** B-1 S1-E3 and S7-R6 (gone / other-organization staff reads
Unassigned; developer check per the S6-N1 context note) · B-2 S2-E6 (two screens, later save wins) · B-3 S4-R3 last sentence (New
Customer from a part sale, part-sales-only user; answer 16) · B-4 S4-R21 wording ("They will be removed as sales representative from
{n} customer{s}.", "customer" when n is 1) and the unchanged "Turn Off Sales Representative" warning · B-5 S4-R20 "Reactivating the
account does not put them back" · B-6 S8-R4 / S8-R9 "Any other export with no rows … still downloads a file with the headings".

## 5 · Not settled here

- Q-A, Q-B, Q-C are drafted, not sent (this worker may not write to Google or Slack). Until answered DR-03, DR-05 and DR-08 stay held.
- DR-06's precondition "the report shows its Location column" says WHAT must hold; the sources I read do not say exactly when Sales By
  Representative shows that column (the report-spec review notes two readings), so the example names two selected locations.
- DR-04 and DR-07 state CSV/PDF amounts as "the same shares" / "the same date": the sources give no format for negative amounts in the
  files.
- Whether to add DR-01 / DR-02 as new cases or fold them into C666024 / C666030, and whether to bring the 11 design cases and the
  behaviour cases above to v10 now (full pass or named set, Rule 122 as amended 16 Oct): the QA lead decides.
- TestRail creation needs his go-ahead (Rule 6) and the creation hold H1 (Rule 62) must be checked first.

## 6 · Per-board table — all 68 boards, each picture looked at in this run

Totals: **68 of 68 board pictures viewed** (full image each; plus the 10 zoom crops in `screens/zoom/`, a 4x crop of board 3.1's label
and a 3x crop of board 1.17's labels). 13 boards are "Before" (production today). 14 boards show a difference from PRD v10 (all ruled
by an answer or a v10 sentence except 4 boards that carry an open question: 4.5, 4.10, 6.0, 6.2). 12 boards feed a missing check
(GAP-1 to GAP-7). Every board is attached to at least one existing case.
| Board | Title | Picture | What it shows (looked at 20 Oct 2026) | PRD v10 / Chris answer | Verdict | Case(s) |
|---|---|---|---|---|---|---|
| 1.0 | 1.0 Before: the card today | `card-00-b-wo-rest2.png` | PRODUCTION today, WO S2-17435. Card fields (title-case labels): 'Lead Technician' (blank), 'Service Advisor' Gerald Ortiz, 'Sales Representative' Debra Garcia, plain text. Visibly larger gap under Lead Technician than between the other two fields. | Baseline for S1-R1/S1-R6; v10 removed the S1-R6 '36px' context note (answer 3). | SAME (today) | C666004 |
| 1.1 | 1.1 Before: picking the rep today | `card-01-b-wo-open.png` | PRODUCTION today. Sales Representative open as an outlined box with caret-up; list rows: 'Unassigned' (ticked, blue text, light-blue row), 'Debra Garcia', 'Michele Reed'. No + button. | Baseline for S1-R8/S1-R9 (Unassigned first and ticked). | SAME (today) | C666004 |
| 1.2 | 1.2 Nobody assigned, at rest | `card-02-n1-rest.png` | BUILD, WO S2-17528. 'Lead Technician' (blank), 'Service Advisor' Becky Gonzales, 'Sales Representative' 'Unassigned'; label line 1, name line 2, same left edge; no box, no arrow, no + at rest. | S1-R1, S1-R2, S1-R3, S1-R6, S1-R7: SAME. | SAME | C666017 |
| 1.3 | 1.3 Hover: the box and the + | `card-03-n1-hover.png` | Hover on the rep row: one light-blue outlined box round label+name on Sales Representative only (not on Lead Technician / Service Advisor), small caret-down at the right end vertically centred, grey + (no fill) to the right of the box. | S1-R4, S1-R11 (one field), S2-R1, S2-R2: SAME. Box-to-+ gap measured ~22 px vs S1-R5 16px: DIFFERENT, PO-RULED (answer 2). | SAME + DIFFERENT (ruled) | C666018 |
| 1.4 | 1.4 The list: Unassigned first | `card-04-n1-list.png` | List open under the field, same width as the box, caret flips up, + still shown. Rows in order: 'Unassigned' (ticked, blue, highlighted), 'Becky Gonzales', 'Daniel Montoya', 'Gerald Ortiz' (A-Z by first name). No search box. | S1-R8, S1-R9, S1-R12, S1-R4 (buttons stay while the list is open): SAME. | SAME | C666019 |
| 1.5 | 1.5 One rep picked, at rest | `card-05-n1-picked.png` | 'Sales Representative' Becky Gonzales as plain text; no box/arrow/+. (Lead Technician now reads 'Unassigned'.) | S1-R3, S1-R13: SAME. | SAME | C666017 |
| 1.6 | 1.6 Hover: box, arrow and + | `card-06-n1-picked-hover.png` | Hover with Becky in the field: box + caret-down centred + grey + beside the row. | S1-R4, S1-R11, S2-R1/S2-R2: SAME; gap ~22 px vs S1-R5: PO-RULED (answer 2). | SAME + DIFFERENT (ruled) | C666018 |
| 1.7 | 1.7 Hover the + | `card-07-n1-add-tip.png` | + with light-grey fill; dark-grey tooltip 'Add representative' centred below the +, overlapping the customer card below and the lines panel edge; box and caret stay. | S2-R2, S2-R3: SAME. | SAME | C666020 |
| 1.8 | 1.8 The + menu | `card-08-n1-add-menu.png` | + keeps its fill; NO tooltip; menu directly below the +, right edge aligned with the +, ONE row 'Sales Representative - Parts'; box and caret stay shown. | S2-R2, S2-R3 (no tooltip while open), S2-R4 (one option, below it), S1-R4: SAME. By hand: PRD 1 option = design 1 option. | SAME | C666020 |
| 1.9 | 1.9 Parts added: both rows copy Becky | `card-09-n1-added.png` | Two plain rows: 'Sales Representative - Labor' Becky Gonzales, then 'Sales Representative - Parts' Becky Gonzales; labels in full; no list open; no buttons at rest. | S2-R5, S2-R6, S2-R7, S2-R14, S1-R6: SAME. | SAME | C666021, C665925 |
| 1.10 | 1.10 Hover: two rows | `card-10-n1-added-hover.png` | Hover: both boxes at once, each caret at the bottom-right on the name line; grey x beside Parts only; nothing beside Labor; no +. | S1-R4 (every field at once), S1-R11 (two fields), S2-R8, S2-R10: SAME. | SAME | C666021 |
| 1.11 | 1.11 Labor: pick who sold the labor | `card-11-n1-labor-list.png` | Labor list open (caret up): 'Unassigned', 'Becky Gonzales' (ticked), 'Daniel Montoya', 'Gerald Ortiz'; x beside Parts still shown; the Parts person is not hidden from the Labor list. | S2-R11 (= S1-R8/R9), S1-R4: SAME. | SAME | C666021 |
| 1.12 | 1.12 Two reps | `card-12-n1-two.png` | Plain rows: Labor Daniel Montoya, Parts Becky Gonzales. | S2-R12, S2-R13: SAME. | SAME | C666022 |
| 1.13 | 1.13 Hover the remove x | `card-13-n1-remove-tip.png` | x with light fill; tooltip 'Remove Sales Representative - Parts' centred below the x; both boxes with carets on the name line. | S2-R8, S2-R9: SAME. | SAME | C666022 |
| 1.14 | 1.14 Parts removed: the Labor person stays | `card-14-n1-removed.png` | One plain 'Sales Representative' field reading Daniel Montoya (the Labor person). | S2-R16: SAME. | SAME | C666022, C665929 |
| 1.15 | 1.15 Clearing: pick Unassigned | `card-15-n1-unassign-list.png` | List open: 'Unassigned', 'Becky Gonzales', 'Daniel Montoya' (ticked), 'Gerald Ortiz'; + shown. | S1-R8, S1-R9, S1-R10: SAME. | SAME | C666019, C666023 |
| 1.16 | 1.16 Cleared: Unassigned | `card-16-n1-cleared.png` | 'Sales Representative' 'Unassigned', plain; no x inside the field. | S1-R7, S1-R10: SAME. | SAME | C666023 |
| 1.17 | 1.17 After invoicing: read only | `card-17-n1-invoiced.png` | Invoiced WO S2-17540, plain text: 'Lead technician' Unassigned, 'Service advisor' Gerald Ortiz (small second word), 'Sales Representative - Labor' Daniel Montoya, 'Sales Representative - Parts' Becky Gonzales (title case); left edge x=41 (editable card x=36); no buttons. | S2-R17 v10 (LT/SA keep today's read-only labels) + answer 8: SAME as v10. S1-N1, S1-R6: SAME. | SAME (v10) | C666024 (labels of LT/SA NOT checked), MISSING: GAP-1 |
| 1.18 | 1.18 Before: the Work Order Log today | `card-18-b-audit.png` | PRODUCTION today: dialog 'Work Order Log', 'Search', close x; columns Event, User, Line, Details, Date, Time; entries 'Line created', 'Line authorized', 'Line authorization required', 'Created'; no rep entries. | Baseline for Story 7. | SAME (today) | C666025 |
| 1.19 | 1.19 The log records every rep change | `card-19-n1-audit.png` | BUILD: 'Work Order Log'; Event 'Sales representative changed', User 'Admin ShopView', Line '-', Details bold 'Sales Representative:' + before → after, Parts first, ' · ' separator, wraps to 2-3 lines; includes 'Becky Gonzales → Becky Gonzales (Parts) · Becky Gonzales (Labor)' and 'Unassigned → Unassigned (Parts) · Unassigned (Labor)'. | S7-R1 v10 (adding Parts with the same person writes an entry, answer 31), S7-R2, S7-R3: SAME. 'Line' column '-' design-only. | SAME (v10) | C666025, C665981 |
| 2.0 | 2.0 Before: the customer page today | `customer-00-b-customer-page.png` | PRODUCTION today: customer page left panel 'Sales Representative' 'N/A'. | Baseline for S4-E1/S4-R19 ('N/A' becomes 'Unassigned'). | SAME (today) | C666003 |
| 2.1 | 2.1 Before: Edit Customer today | `customer-01-b-customer-dialog-open.png` | PRODUCTION today: Edit Customer, 'Sales Representative' dropdown open (blue outline, caret up) listing 'Krystal Davis', 'Lindsay Perez' - NO 'Unassigned' row; no +. | Baseline for S4-R3 (v10 adds 'Unassigned' first). | SAME (today) | C666003 |
| 2.2 | 2.2 Before: New Customer today | `customer-02-b-new.png` | PRODUCTION today: New Customer with Name *, Phone, Address 1/2, City, ZIP/Postal Code, State/Province, Country, Notes, Website, IBS, 'Save'; NO Sales Representative field. | Baseline for S4-R1 (New Customer gains the field). | SAME (today) | C666003 |
| 2.3 | 2.3 Edit Customer: one field and the + | `customer-03-n2-edit.png` | Outlined 'Sales Representative' field reading 'Unassigned' after Credit Terms / Credit Limit and before Default Labor Rate; caret centred; grey + outside the box on the right, shown without hover; field narrowed so the + is flush with the right edge. Page behind reads 'Sales Representative' 'Unassigned'. | S4-R1, S4-R4, S4-R5, S4-R19/S4-E1 ('Unassigned' not 'N/A'): SAME. | SAME | C666026, C665940, C665947 |
| 2.4 | 2.4 The list: Unassigned first | `customer-04-n2-edit-list.png` | List full field width: 'Unassigned' (ticked), 'Dylan Rush', 'Christian Wallace', 'Jason Garrison' - not A-Z. | S4-R3 (A-Z): DIFFERENT, PO-RULED answer 15 (A-Z). | DIFFERENT (ruled) | C666026, C665940 |
| 2.5 | 2.5 One rep picked | `customer-05-n2-edit-picked.png` | Field reads Christian Wallace; + beside it. | S4-R2/S4-R5: SAME. | SAME | C666026 |
| 2.6 | 2.6 Hover the + | `customer-06-n2-add-tip.png` | + light fill, tooltip 'Add representative' below it. | S4-R5: SAME. | SAME | C666026 |
| 2.7 | 2.7 The + menu: two options | `customer-07-n2-add-menu.png` | Menu below the +, right-aligned: rows 'Sales Representative - Service Parts', then 'Sales Representative - Part Sales'. | S4-R6 (order, each not yet added): SAME. By hand: PRD 2 rows = design 2 rows, same order. | SAME | C666026 |
| 2.8 | 2.8 Service Parts added | `customer-08-n2-service-parts.png` | First field renamed 'Sales Representative - Service Labor' (+ still beside it), 'Sales Representative - Service Parts' under it, both Christian Wallace; x beside Service Parts; no list open. | S4-R7, S4-R10, S4-R15: SAME. | SAME | C666027, C665942 |
| 2.9 | 2.9 The + menu now offers Part Sales only | `customer-09-n2-add-menu-2.png` | Menu with ONE row 'Sales Representative - Part Sales'. | S4-R6 (only fields not yet added): SAME. | SAME | C666027 |
| 2.10 | 2.10 Part Sales added: three rows | `customer-10-n2-three-added.png` | Three outlined fields: Service Labor, Service Parts, Part Sales, all Christian Wallace; x beside Service Parts and Part Sales; NO + anywhere. | S4-R6 (+ hidden when both added), S4-R8, S4-R9, S4-R10: SAME. | SAME | C666027, C665943 |
| 2.11 | 2.11 The Part Sales list | `customer-11-n2-ps-list.png` | Service Parts now Jason Garrison; Part Sales list open: 'Unassigned', 'Dylan Rush', 'Christian Wallace' (ticked), 'Jason Garrison'; no 'Same as Service Parts' row; Part Sales did not follow the Service Parts change. | S4-R14 (SAME); S4-R3 order DIFFERENT, PO-RULED answer 15. | SAME + DIFFERENT (ruled) | C666027 |
| 2.12 | 2.12 Three different people | `customer-12-n2-three.png` | Service Labor Christian Wallace, Service Parts Jason Garrison, Part Sales Dylan Rush. | S4-R9: SAME. | SAME | C666027 |
| 2.13 | 2.13 Hover the remove x | `customer-13-n2-remove-tip.png` | x beside Service Parts with light fill; tooltip 'Remove Sales Representative - Service Parts' below it, covering the right end of the Part Sales row and its x. | S4-R10: SAME (the Part Sales remove tooltip is not drawn: DESIGN-SILENT, covered by C665943). | SAME | C666027 |
| 2.14 | 2.14 Part Sales without Service Parts | `customer-14-n2-ps-only.png` | 'Sales Representative' Christian Wallace with + back; 'Sales Representative - Part Sales' Dylan Rush with x. | S4-R11 (Part Sales keeps its choice), S4-R10: SAME. The + menu offering Service Parts only is not drawn (DESIGN-SILENT). | SAME | C666027, C665944 |
| 2.15 | 2.15 The customer page reads every row | `customer-15-n2-page-three.png` | Customer page left panel, bold labels in window order: 'Sales Representative - Service Labor' (wraps to 2 lines) Christian Wallace, 'Sales Representative - Service Parts' (wraps) Jason Garrison, 'Sales Representative - Part Sales' Dylan Rush. | S4-R19: SAME (label wrapping design-only). | SAME | C666028, C665947 |
| 2.16 | 2.16 New Customer: the same field | `customer-16-n2-new.png` | New Customer: outlined 'Sales Representative' 'Unassigned' with + after State/Province + Country, before Notes. | S4-R1: SAME. | SAME | C666029, C665941 |
| 2.17 | 2.17 New Customer: the + menu | `customer-17-n2-new-menu.png` | Name typed (Northline Haulage); menu rows 'Sales Representative - Service Parts', 'Sales Representative - Part Sales'. | S4-R6: SAME. | SAME | C666029 |
| 2.18 | 2.18 New Customer with a Part Sales rep | `customer-18-n2-new-ps.png` | 'Sales Representative' Unassigned with +, 'Sales Representative - Part Sales' Unassigned with x. | S4-R8, S4-R10: SAME. | SAME | C666029 |
| 3.0 | 3.0 Before: a part sale today | `partsale-00-b-ps.png` | PRODUCTION today: part sale P2-84 card with NO Sales Representative field. | Baseline (the field comes from Part Sales Update v1, SV-10266). | SAME (today) | C666030 |
| 3.1 | 3.1 The Sales Representative field | `partsale-01-n3-rest.png` | Part sale P2-204 card: one field under 'Started:', label reads 'Sales Representative' (CAPITAL R, confirmed on a 4x crop), 'Unassigned', plain at rest, no + / x. | S2-N2 v10: 'its label stays "Sales representative"' + answer 7 (b): DIFFERENT (label casing), PO-RULED. No + / x: SAME. | DIFFERENT (ruled) | C666030 (expects the capital R: now wrong), MISSING: GAP-2 |
| 3.2 | 3.2 Hover | `partsale-02-n3-hover.png` | Hover box + caret, full card width; label 'Sales Representative'; no +. | S2-N2 (look unchanged): label casing DIFFERENT (ruled). | DIFFERENT (ruled) | C666030, MISSING: GAP-2 |
| 3.3 | 3.3 The list | `partsale-03-n3-list.png` | List: 'Unassigned' (ticked), 'Becky Gonzales', 'Daniel Montoya', 'Gerald Ortiz'. | S2-N2: SAME (Part Sales Update v1's list). | SAME | C666030 |
| 3.4 | 3.4 A rep picked, hovered | `partsale-04-n3-picked-hover.png` | Gerald Ortiz picked, hover box, label 'Sales Representative', no + / x. | S2-N2: label casing DIFFERENT (ruled); no +: SAME. | DIFFERENT (ruled) | C666030, C665935, MISSING: GAP-2 |
| 4.0 | 4.0 Before: the report today | `sbr-00-b-sbr.png` | PRODUCTION today: chips Date: Last 12 months, Show Unassigned (on), 'Product Type: All products', Invoice Status: All statuses, Location; columns Date, Invoice, Customer, Status, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, (Margin), Subtotal; row 'Unassigned (1570)'. | Baseline for S8-R1/Release day. | SAME (today) | C666005 |
| 4.1 | 4.1 Before: the Product Type filter | `sbr-01-b-sbr-filter.png` | PRODUCTION today: Product Type menu 'Select all' / '2 selected', 'Parts', 'Services', 'Clear selection'; empty state 'No record matches these filters' / 'Try changing filters to widen your results.' | Baseline; the empty state is the look S8-R5 points at ('shows its empty state'). | SAME (today) | C666005 |
| 4.2 | 4.2 Before: the column picker | `sbr-02-b-sbr-columns.png` | PRODUCTION today: picker Labor Delta ... Margin %; tooltip 'Column Selection' covers the first switch. | Baseline; answer 36 (overlap acceptable). | SAME (today) | C666005 |
| 4.3 | 4.3 Before: expanded | `sbr-03-b-sbr-expanded.png` | PRODUCTION today, expanded under Unassigned: part sale P2-161 shows Labor Delta '0.00' and '$0.00' in the labor columns (no dashes). | Baseline for GAP-3: today a part sale row shows 0.00 / $0.00 in the labor columns. | SAME (today) | C666005 |
| 4.4 | 4.4 One row per rep | `sbr-04-a4-sbr-c.png` | BUILD: chips Date, Show Unassigned, 'Sales Type: All', Invoice Status, Location (in that order); default columns Date, Invoice, Customer, Status, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Subtotal - no Sales Type; Devon Whitfield (3) $1,314.68, Elliot Brennan (3) $2,788.81, Totals $4,103.49. | S8-R1, S8-R3, S5-R21, S5-R13/S5-R14: SAME. | SAME | C666031 |
| 4.5 | 4.5 Expanded: Sales Type column off | `sbr-05-a4-sbr-expanded.png` | Expanded: Devon's S1-12 Parts row labor columns '—', Shop Supplies '$0.0…'; part sale rows P1-9006/P1-4/P1-9005 labor columns '—' (Labor Delta, Labor Invoiced, Labor Margin), Shop Supplies '$0.0…'; Elliot's S1-12 Labor row parts columns '—'; S1-32 (Devon alone) full figures; summary rows real sums. | S5-R15 dashes SAME; Shop Supplies $0.00 on Parts row DIFFERENT PO-RULED answer 24; on part sale rows DIFFERENT PO-RULED answer 25; dashes in part-sale LABOR columns: PRD silent, today shows 0.00 (4.3) -> QUESTION-NEEDED (GAP-3). | DIFFERENT (ruled) + QUESTION-NEEDED | C666031, C665962, MISSING: GAP-3 |
| 4.6 | 4.6 The Sales Type filter | `sbr-06-a4-filter-open.png` | Menu under the chip (chip shows a clear ⓧ while open): 'Select all' / '3 selected', 'Labor', 'Parts', 'Part Sales' (all ticked), 'Clear selection'. | S8-R1 (3 options, order, all selected): SAME. 'Select all', '3 selected', 'Clear selection' design-only (existing control); C666031 step 3 compares the open menu with this picture. | SAME + DESIGN-ONLY | C666031, C665984 |
| 4.7 | 4.7 Labor only | `sbr-07-a4-sbr-labor-only.png` | 'Sales Type: Labor'; Sales Type column on (header after Status); Devon (1), Elliot (1); summary rows show Parts $0.00 (real sums); Elliot Adjustments $83.32 (his share), Totals $2,335.32. | S8-R2, S8-R3, S5-R12, S5-R16: SAME. S5-R6 v10 'share in its Adjustments column' (answer 22): SAME, no case checks the column. | SAME (v10) | C666031, MISSING: GAP-7 |
| 4.8 | 4.8 The column picker | `sbr-08-a4-columns-off.png` | Picker: 'Sales Type' first, then Labor Delta ... Margin %; the 'Column Selection' tooltip covers the Sales Type switch. | S5-R20, S5-R21: SAME; tooltip overlap PO-RULED acceptable (answer 36). | SAME + DIFFERENT (ruled) | C666031, C665972 |
| 4.9 | 4.9 Sales Type switched on | `sbr-09-a4-columns-on.png` | Sales Type switch on; 'Sales Type' column right after Status; values Part Sales, Labor, Parts, Part Sales, Part Sales, Labor. | S5-R19 (after Status): SAME; 'before Location' (v10, answer 26): no Location column drawn (single location) -> DESIGN-SILENT (GAP-6). | SAME | C666031, C665972, MISSING: GAP-6 |
| 4.10 | 4.10 Expanded with Sales Type | `sbr-10-a4-sbr-expanded-type.png` | Expanded with Sales Type: 'Part Sales', 'Labor, Parts' (S1-32), 'Parts', 'Part Sales', 'Part Sales', 'Labor'; dates Oct 08 2026, Sep 28 2026, ...; part sale labor columns '—'. | S5-R10, S5-R19: SAME. Dates differ from exports (answer 33, GAP-4). Part-sale labor dashes: QUESTION-NEEDED (GAP-3). | SAME + DIFFERENT (ruled) + QUESTION-NEEDED | C666031, C665969, MISSING: GAP-3, GAP-4 |
| 4.11 | 4.11 Expanded export (CSV) | `sbr-11-a4-export-csv.png` | CSV opened as a spreadsheet: header lines 'Date Range: Nov 1, 2025 - Oct 9, 2026', 'Sales Type: All', 'Invoice Status: All Statuses', 'Locations: QA Testing'; columns Representative, Date, Invoice #, Customer, Status, Sales Type, Hrs Worked, Hrs Invoiced, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %, Subtotal; dates Sep 29 2026 (screen Sep 28); Parts row and part-sale Shop Supplies '0.00'; non-credited cells blank; Adjustments Devon S1-12 11.03, Elliot S1-12 83.32; no Location column. | S5-R23, S8-R4: SAME; Shop Supplies 0.00 PO-RULED (24/25); dates PO-RULED (33); column order 'before Location' DESIGN-SILENT (26); Adjustments share SAME (22). | SAME + DIFFERENT (ruled) | C666032, C665973, C665985, MISSING: GAP-4, GAP-6, GAP-7, GAP-3 |
| 4.12 | 4.12 Expanded export (PDF) | `sbr-12-a4-export-pdf-crop-1.png` | PDF: 'Sales By Representative Report', 'Demo company', 'QA Testing', bold 'Date Range:', 'Sales Type: All', 'Invoice Status:', 'Locations:'; ShopView logo top right; same columns as the CSV; non-credited side '—'; Shop Supplies '$0.00' on the Parts row and part sales; dates Sep 29 2026. | S5-R23, S8-R4: SAME; $0.00 PO-RULED (24/25); dates PO-RULED (33). | SAME + DIFFERENT (ruled) | C666032, C665973, MISSING: GAP-4, GAP-6, GAP-7, GAP-3 |
| 5.0 | 5.0 Before: "Product Type" | `sbc-00-b-sbc-filter.png` | PRODUCTION today: chips Date, 'Product Type: All products' (open), Customer, Location; menu 'Select all' / '2 selected', 'Parts', 'Services', 'Clear selection'; empty state. | Baseline; options renamed (answer 28). | SAME (today) | C666008 |
| 5.1 | 5.1 After: "Sales Type" | `sbc-01-n5-sbc.png` | BUILD: chip 'Sales Type: All Sales' where Product Type was; Customer: All customers; columns Customer, Date, Labor Delta ... Subtotal. | S8-R6, S8-R8: SAME. | SAME | C666033, C665986 |
| 5.2 | 5.2 After: the filter open | `sbc-02-n5-sbc-open.png` | Menu 'Select all' / '2 selected', 'Part Sales', 'Service Sales', 'Clear selection'. | S8-R7 + answer 28: SAME. | SAME | C666033, C665998 |
| 6.0 | 6.0 Before: the details panel today | `phone-00-b-phone-details.png` | PRODUCTION today on a phone: 'Hide Details' toggle with caret above the card; card S2-17435 with 'Lead Technician', 'Service Advisor' Gerald Ortiz, 'Sales Representative' Debra Garcia (plain). | S3-R6 v10 + answer 9 say the card expands with its EDIT BUTTON; today's picture shows a 'Hide Details' toggle -> QUESTION-NEEDED (GAP-5). | QUESTION-NEEDED | C666014, MISSING: GAP-5 |
| 6.1 | 6.1 Before: picking the rep today | `phone-01-b-phone-open.png` | PRODUCTION today: phone list 'Unassigned', 'Debra Garcia' (ticked), 'Michele Reed'; box with caret up. | Baseline for S3-R1 ('same dropdown'). | SAME (today) | C666014 |
| 6.2 | 6.2 The field on a phone | `phone-02-n6-field.png` | BUILD: 'Hide Details' (highlighted) above the card; 'Sales Representative' 'Unassigned' with + always shown; NO box and NO arrow at rest. | S3-R2 SAME; S3-R4 arrow always shown: DIFFERENT, PO-RULED answer 11; expand control: QUESTION-NEEDED (GAP-5). | DIFFERENT (ruled) + QUESTION-NEEDED | C666034, C665938, MISSING: GAP-5 |
| 6.3 | 6.3 Tap: the list | `phone-03-n6-list.png` | Tapped: box + caret up; list 'Unassigned' (ticked), 'Becky Gonzales', 'Daniel Montoya', 'Gerald Ortiz'; + still shown. | S3-R1: SAME. | SAME | C666034 |
| 6.4 | 6.4 One rep picked | `phone-04-n6-picked.png` | Becky Gonzales in a box with caret down (focused) and + beside it; Lead Technician 'Unassigned'. | S3-R2: SAME. | SAME | C666034 |
| 6.5 | 6.5 Tap the + | `phone-05-n6-add-menu.png` | + with fill; menu below it, right-aligned: 'Sales Representative - Parts'. | S2-R4 via S3-R2: SAME. | SAME | C666034 |
| 6.6 | 6.6 Parts added | `phone-06-n6-added.png` | Plain 'Sales Representative - Labor' Becky, 'Sales Representative - Parts' Becky, x always shown beside Parts; labels in full; NO arrows. | S2-R14, S3-R2 SAME; S3-R4 DIFFERENT, PO-RULED answer 11. | DIFFERENT (ruled) | C666034 |
| 6.7 | 6.7 Parts list on a phone | `phone-07-n6-parts-list.png` | Both boxes with carets on the name line; Parts list open: 'Unassigned', 'Becky Gonzales' (ticked), 'Daniel Montoya', 'Gerald Ortiz'; x beside Parts. | S3-R1, S1-R11: SAME. | SAME | C666034 |

## 7 · Reading coverage (Rule 119)

| Source | Size | Read | Coverage |
|---|---|---|---|
| `WORKER-BRIEF.md` (this folder) + the coordinator's addition (look at every board, read every canvas note) | 5,525 B | all lines | 100% |
| `build/LESSONS-REGISTER.md` (L-01, L-02, L-03) | 3,273 B | all | 100% |
| `build/wo-board-tech-view/sv11522-11524-2026-10-19/RECORD-SV-11522-11524-2026-10-19.md` | 3,402 B | all | 100% |
| `build/rules/RULES-61-96.md` — Rules 113, 114, 117 (all 12 amendments), 124 (+9 Oct amendment), 126, 130 | lines 2391–2542, 2649–2925, 3062–3186, 3213–3267, 3340–3380 | those rules in full | 100% of the rules named in the brief (the rest of the 328 KB file was not needed and not read) |
| `build/skills/21-DESIGN-DRIVE-PROTOCOL.md` (§4b, §6b, §6c and the rest) | 9,075 B | all | 100% |
| PRD v10 `prd-v10-2026-10-20/CONFLUENCE-919928833-v10-2026-10-20.md` | 49,542 B, 420 lines | lines 1–420 | 100% |
| `REQUIREMENT-DIFF-v8-to-v10.md` / `TEXT-DIFF-v8-to-v10.diff` | 12,335 B / 20,221 B (95 / 140 lines) | all | 100% |
| Chris Ward's answers, Google Sheet 17Ry1BtR…, tab "Questions for Chris", A1:Z45 (rows 6–43 = 38 answers) | 38 rows × 6 columns | every cell (read only) | 100%, saved to `chris-answers.json` |
| Design: the 68 board pictures `design-drive-2026-10-19/unpacked/png/` | 68 PNG | each picture opened and looked at in this run (table §6) | **68 / 68** |
| Design: `screens/zoom/` crops | 10 PNG | each opened | 10 / 10 |
| Design: the 86 Play-view browser screenshots in `screens/` | 86 PNG | not re-opened (same 68 boards inside the canvas viewer, plus canvas chrome); the board files themselves were viewed instead | not viewed this run |
| Design: `unpacked/files/canvas.json` (6 pages, 68 titles, 74 notes, launch view) | 36,001 B | every string value dumped and read | 100% |
| `DESIGN-REVIEW-2026-10-19.md`, `design-files-reading-2026-10-19.md`, `design-visual-inventory-2026-10-19.md` | 19,970 / 19,799 / 15,220 B | all lines | 100% |
| `design-text-inventory-2026-10-19.json` (1,370 rows) | 312,494 B | every row processed by script and re-classified; all 147 hand-verified rows, all 148 canvas rows and every flagged OCR row read by eye; the 755 DATA OCR fragments were not read one by one (sample data) | rows 100% by script; DATA OCR fragments not read by eye |
| `ocr/*.txt` (68 transcripts) | 158,529 B | used by script only (machine checks and board lookup); the pictures were read instead | by script |
| Our 120 cases `ssr-cases-2026-10-20.json` | 469,058 B | the 18 design cases read in full (C666017–C666034); C665932, C665935, C665937, C665938 read in full; steps + expected results + quoted codes of C665921–C665924, C665933, C665939–C665943, C665947, C665957–C665960, C665962, C665964, C665966–C665969, C665972, C665973, C665981, C665984–C665987, C665990, C665998, C666001, C666003, C666007, C666008, C666014, C666024; all 120 titles; every case body searched by script for 37 terms and for every quoted requirement code | design cases 100%; others as listed |
| `authoring/ssr_lib.py`, `common.py`, `build.py`, `cases_design.py` | 10,694 / 1,547 / 4,139 / 23,045 B | all lines (cases_design.py: expected-result lines skipped on screen because they are identical to the case bodies read above) | 100% |
| `applied/sections.json`, `applied/apply*-log.jsonl` (attachment map) | — | by script | 100% of the attachment rows |
| Tech plan upload (278,939 B) | — | **not read**; grepped once for the Lead Technician message (facts only) | not needed by the brief; grep only |
| `report-specs/REPORT-SPECS-REVIEW-2026-10-19.md` | — | grepped for the Location column rule (facts only) | grep only |
