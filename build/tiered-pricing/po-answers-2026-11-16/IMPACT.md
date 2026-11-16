# Tiered Pricing — what Matt Barge's answers (16 Nov 2026) change in our cases

**Read-only measuring pass, 16 Nov 2026.** Nothing was written to TestRail, Jira, Slack or Google, and no case in the library was changed.
Rule 122 (16 Oct amendment): you decide first whether this update is a named set or a full pass; my recommendation is in section 6.

## 1 · Sources, checked today

| Source | What I found | Verdict |
|---|---|---|
| Matt's answers | All 31 answered (sheet rows 6-36, column E), read 12:51 UTC. Chosen: (a) 22 · (b) 5 · (c) 4. Copies: `questions-2026-11-14/ANSWERS-2026-11-16.json` and `.md` (word for word). | CURRENT |
| Tiered Pricing PRD 938213378 | **Page version 38**, created **12:28:08 UTC** by Matt, message "QA questions from Bilal (Nov 16)" (in-body still "v0.17"). Saved word for word: `sources/CONFLUENCE-938213378-v38-read-2026-11-16.md`. Diff v37→v38: 19 change blocks, every one from an answer (`sources/PRD-CHANGES-v37-to-v38.md`, `sources/PRD-DIFF-v37-to-v38.txt`). | CURRENT (v38) |
| Reports PRD 968687617 | Page version 21 (12 Nov), unchanged. | CURRENT |
| Design canvas | Now version 1794823074-c3c9 (published 16 Nov 09:57 UTC, before the answers). Same 322 files; all 280 board/design files the same size as our 14 Nov copy; canvas.json and 31 boards the answers name downloaded and **byte-identical**; only the viewer's index.html and a tool guide differ. **No board has changed yet**, although 22 answers say "canvas … follow(s) it". | CURRENT, but **Matt's canvas fixes are still to come** |
| Epic SV-11692 | Still 54 tickets, none new. 10 stories edited at 12:30 UTC with the same changes as v38, nothing more (`sources/jira/resweep-2026-11-16/`). | CURRENT |
| Tech plans (11 Nov) | Unchanged files; Q19 says Phase 16 should change to Create Category, which the plan does not yet say. The plan informs, never overrules (Rule 30). | as held |

**Is Matt still editing?** The PRD's last change is v38 at 12:28:08 UTC and the ten stories followed at 12:30 UTC. At the end of this pass (see section 8)
the PRD was still v38. His v38 Change Log row lists all 14 fixes he promised, so the **PRD edit looks finished**. The **canvas edit has not started**
(no board changed). I recommend not waiting for the PRD; the pictures can be refreshed when the canvas changes (section 6).

## 2 · Counts

| What | Count |
|---|---|
| Held cases on the 31 questions | 41 |
| — release (the PO chose the case's version) | 5 |
| — rewrite top to bottom, then release | 11 |
| — delete (the PO ruled the design's version out; Rule 130, with your go-ahead) | 25 |
| Released cases (run 560) whose tester-facing text changes | 30 |
| Released cases where only the library's stored PRD quote changes (tester text stays) | 4 |
| Released cases where only the References field gains S19-R24 | 3 |
| Released cases checked against S19-R24 and confirmed as they are | 5 |
| New cases proposed | 9 |
| PRD changes that do not come from an answer | **0** |
| Answers that conflict with a PRD sentence the PRD has not yet changed | **0** (every "PRD fix needed" is already in v38) |

So the named set is **78 existing cases + 9 new** (41 held + 30 changed + 4 quote-only + 3 refs-only). All 1,575 attached pictures
stay as they are until the canvas changes (section 5).

## 3 · Per question: the decision and whether PRD v38 already says it

| # | Topic | Chosen | Decision | PRD v38 |
|---|---|---|---|---|
| 1 | the page trail (breadcrumbs) at the top of a tier's page and a matrix's page | (b) | Breadcrumbs start at Pricing (or Categories), never at Settings. Held: D-50 [C1211096](https://shopview.testrail.io/index.php?/cases/view/1211096) | IN v38: S2-R28, S3-R26, S7-R6 |
| 2 | the Delete [tier]? window | (c) | Delete [tier]? says "This can't be undone." instead of the parts line; Archive keeps the parts line; follower list on both. Held: D-51 [C1211097](https://shopview.testrail.io/index.php?/cases/view/1211097) | IN v38: S2-R30 + messages table (Archive and Delete rows split) |
| 3 | the question shown before Set Rule changes every matrix | (a) | Set Rule question as the PRD writes, no "all". Held: D-52 [C1211098](https://shopview.testrail.io/index.php?/cases/view/1211098) | PRD unchanged (no fix needed) |
| 4 | the words for a matrix where a tier has no rules of its own, on the tier's Pricing tab | (a) | "Uses previous tier" everywhere. Held: D-53 [C1211099](https://shopview.testrail.io/index.php?/cases/view/1211099) | PRD unchanged (no fix needed) |
| 5 | Default's own page | (a) | Default's page: both columns in the grid's short words. Held: D-54 [C1211100](https://shopview.testrail.io/index.php?/cases/view/1211100) | PRD unchanged (no fix needed) |
| 6 | moving a category to a matrix from the matrix's page | (b) | Categories line changeable only in Edit; parts price by the matrix only after Save; Cancel puts them back. Held: S3-17 [C1211539](https://shopview.testrail.io/index.php?/cases/view/1211539), S3-18 [C1211540](https://shopview.testrail.io/index.php?/cases/view/1211540) | IN v38: S3-R13 (and S3-R12: categories save with the grid) |
| 7 | Duplicate on a matrix | (a) | Duplicate creates the copy at once. Held: D-55 [C1211101](https://shopview.testrail.io/index.php?/cases/view/1211101) | PRD unchanged (no fix needed) |
| 8 | where Add Range puts a new cost range | (a) | Add Range adds before the last range. Held: D-58 [C1211104](https://shopview.testrail.io/index.php?/cases/view/1211104) | PRD unchanged (no fix needed) |
| 9 | how the last cost range reads when the grid is not being edited | (a) | Last range reads "and up" in view and edit. Held: D-61 [C1211107](https://shopview.testrail.io/index.php?/cases/view/1211107) | PRD unchanged (no fix needed) |
| 10 | which cost ranges have a delete button | (c) | Neither the first nor the last range has a delete button; a 1- or 2-range matrix has none. Held: D-65 [C1211111](https://shopview.testrail.io/index.php?/cases/view/1211111) | IN v38: S3-R16, S3-R32 |
| 11 | messages when a matrix grid cannot be saved | (a) | Grid errors next to the box only, no banner. Held: D-60 [C1211106](https://shopview.testrail.io/index.php?/cases/view/1211106) | PRD unchanged (no fix needed) |
| 12 | a matrix name that is already taken | (a) | Taken matrix name under the name box. Held: D-62 [C1211108](https://shopview.testrail.io/index.php?/cases/view/1211108) | PRD unchanged (no fix needed) |
| 13 | a grid column switched to % Off or $ Off | (a) | % Off / $ Off column starts empty. Held: D-56 [C1211102](https://shopview.testrail.io/index.php?/cases/view/1211102) | PRD unchanged (no fix needed) |
| 14 | the change count in the grid's edit bar | (c) | Rule-type change counts 1, each changed box 1 more (3-range switch = 1, then 4); Audit Log records both. Held: D-57 [C1211103](https://shopview.testrail.io/index.php?/cases/view/1211103) | IN v38: S4-R4 example + S19-R23 example (Matt named S19-R19; the sentence went into S19-R23) |
| 15 | the message after saving a matrix grid | (c) | Save message in three forms per tier (one rule / per-range bullets / multiple rules). Held: D-59 [C1211105](https://shopview.testrail.io/index.php?/cases/view/1211105) | IN v38: S4-R12 + messages table |
| 16 | the Part Sale Matrix column of the Matrices list | (b) | Matrices list Part Sale Matrix column: "Same as work orders" or a rule summary. Held: D-129 [C1210910](https://shopview.testrail.io/index.php?/cases/view/1210910) | IN v38: S6-R1 |
| 17 | the message when a search finds nothing (Matrices list, Categories list, a tier's Customers tab) | (a) | No-match messages: the PRD's full sentences with a period. Held: D-130 [C1210911](https://shopview.testrail.io/index.php?/cases/view/1210911), D-171 [C1210932](https://shopview.testrail.io/index.php?/cases/view/1210932) | PRD unchanged (no fix needed) |
| 18 | the note about other categories on a category's page | (a) | Shared-matrix line above the grid (exception to the tooltip rule). Held: D-147 [C1210919](https://shopview.testrail.io/index.php?/cases/view/1210919) | IN v38: S19-R15 exception added; S7-R15 unchanged |
| 19 | the buttons of New Category | (b) | New Category has Cancel and Create Category. Held: D-165 [C1210927](https://shopview.testrail.io/index.php?/cases/view/1210927) | IN v38: S8-R10 (the developers' plan Phase 16 still says Save and Cancel; the plan informs, never overrules) |
| 20 | two category messages (Delete and a taken name) | (a) | Category Delete question and taken-name error as the PRD words them. Held: D-168 [C1210930](https://shopview.testrail.io/index.php?/cases/view/1210930) | PRD unchanged (no fix needed) |
| 21 | Uncategorized's page | (b) | Uncategorized: read only, Pricing Matrix and Tax Exempt grayed, only QuickBooks Products and Services can be changed. Held: D-162 [C1210924](https://shopview.testrail.io/index.php?/cases/view/1210924) | IN v38: S8-R4 |
| 22 | the filter on a tier's Customers tab | (a) | Customers tab filter: Work orders / Part Sales / Both, each customer matches exactly one. Held: D-172 [C1210933](https://shopview.testrail.io/index.php?/cases/view/1210933) | IN v38: S9-R9 |
| 23 | the Counter Sale customer's tier fields in Edit Customer | (a) | Counter Sale note as a tooltip. Held: D-185 [C1210946](https://shopview.testrail.io/index.php?/cases/view/1210946) | PRD unchanged (no fix needed) |
| 24 | parts added to a paid work order that is reopened | (a) | A line added to a Sent/Paid work order goes on a NEW work order, priced by the customer's current tier. Held: S10-39 [C1211004](https://shopview.testrail.io/index.php?/cases/view/1211004) | IN v38: S10-R14 (the PRD keeps it short; the answer adds: new number, Approved, paid one and invoice untouched) |
| 25 | the message after receiving a part at a new cost | (a) | Receive shows the PRD's 6-second notice, nothing about tiers. Held: D-442 [C1211035](https://shopview.testrail.io/index.php?/cases/view/1211035) | PRD unchanged (no fix needed) |
| 26 | the price details of a part | (a) | Price details as the PRD says; on a Part Sale with no separate Part Sale pricing the side reads "Same as work orders". Held: D-211 [C1210953](https://shopview.testrail.io/index.php?/cases/view/1210953) | IN v38: S12-R2 |
| 27 | the notice after changing the customer on a work order | (a) | Change Customer notice counts only tier/Default lines. Held: D-224 [C1210964](https://shopview.testrail.io/index.php?/cases/view/1210964) | PRD unchanged (no fix needed) |
| 28 | how tiers and filters are labelled | (a) | Reports: "2 · Fleet", "(archived)", "Sales Type: All". Held: D-440 [C1211033](https://shopview.testrail.io/index.php?/cases/view/1211033) | Reports PRD unchanged (v21, no fix needed) |
| 29 | the order of the Category filter | (a) | Reports Category filter: Uncategorized first, then A to Z. Held: D-441 [C1211034](https://shopview.testrail.io/index.php?/cases/view/1211034) | Reports PRD unchanged (v21, no fix needed) |
| 30 | the order of the filter lines at the top of a download | (a) | Download filter lines: Sales Type, Category, Priced By, Customer. Held: RPT-63 [C1211265](https://shopview.testrail.io/index.php?/cases/view/1211265), D-443 [C1211036](https://shopview.testrail.io/index.php?/cases/view/1211036) | Reports PRD unchanged (v21, no fix needed) |
| 31 | columns that move between the design's own pictures | (a) | Columns and fields keep their place across state changes; the canvas moves are not intended. Held: D-179 [C1210940](https://shopview.testrail.io/index.php?/cases/view/1210940), D-450 [C1211037](https://shopview.testrail.io/index.php?/cases/view/1211037), D-451 [C1211038](https://shopview.testrail.io/index.php?/cases/view/1211038), D-452 [C1211039](https://shopview.testrail.io/index.php?/cases/view/1211039), D-453 [C1211040](https://shopview.testrail.io/index.php?/cases/view/1211040), D-454 [C1211041](https://shopview.testrail.io/index.php?/cases/view/1211041), D-63 [C1211109](https://shopview.testrail.io/index.php?/cases/view/1211109), D-64 [C1211110](https://shopview.testrail.io/index.php?/cases/view/1211110) | IN v38: new S19-R24 |


## 4 · The cases

### 4a · Held cases to release (5)
| Q | Case | C-id | Title | What changes |
|---|---|---|---|---|
| 1 | D-50 | [C1211096](https://shopview.testrail.io/index.php?/cases/view/1211096) | Design: breadcrumbs start at Pricing, as the design draws them | Design wins. Marker to the standard one; re-check the whole case (Rule 134); add PRD v38 S2-R28/S3-R26 as its source. |
| 16 | D-129 | [C1210910](https://shopview.testrail.io/index.php?/cases/view/1210910) | Design: Part Sale Matrix column shows a rule summary or Same as work orders | Design wins (S6-R1 v38). Marker updated; whole-case re-check. |
| 19 | D-165 | [C1210927](https://shopview.testrail.io/index.php?/cases/view/1210927) | Design: the New Category page's button reads Create Category | Design wins (S8-R10 v38). Marker updated; whole-case re-check. |
| 21 | D-162 | [C1210924](https://shopview.testrail.io/index.php?/cases/view/1210924) | Design: Uncategorized's page shows grayed matrix and Tax Exempt fields | Design wins (S8-R4 v38). Change one result: the QuickBooks Products And Services picker can be changed (today it says only 'shows in its usual style'); the design board draws that select as disabled, so the result follows the PRD/answer, not the picture. |
| 30 | RPT-63 | [C1211265](https://shopview.testrail.io/index.php?/cases/view/1211265) | Download header lines put Category before Priced By | The PO chose this case's order. Marker updated; drop the 'picture 20.20 shows the two the other way round' remark or keep it as a design note. |

### 4b · Held cases to rewrite top to bottom, then release (11)
| Q | Case | C-id | Title | What changes |
|---|---|---|---|---|
| 6 | S3-17 | [C1211539](https://shopview.testrail.io/index.php?/cases/view/1211539) | A category picked on an existing matrix moves when the matrix is saved | Step 6 checks that category A's page still names matrix B before Save; neither v38 ('Picked categories show on the line at once; their parts are priced by this matrix only after Save') nor the answer ('saved in the picker when picked') says what the category page shows. Rewrite to check a part's PRICE before and after Save; release. |
| 6 | S3-18 | [C1211540](https://shopview.testrail.io/index.php?/cases/view/1211540) | A category removed from the line goes to the General Matrix on save | Same as S3-17 for a removed category (General Matrix pricing only after Save). |
| 24 | S10-39 | [C1211004](https://shopview.testrail.io/index.php?/cases/view/1211004) | A reopened paid work order prices new parts by its kept tier | The PO chose the opposite of this case: the added line goes on a NEW linked work order (new number, Approved), priced by the customer's CURRENT tier; the paid work order and its invoice are untouched. Title, steps and every result change; release. |
| 31 | D-179 | [C1210940](https://shopview.testrail.io/index.php?/cases/view/1210940) | Design: Manage Customers columns move when the search narrows the list | Rewrite to the PRD's S19-R24: Manage Customers columns keep their place when the search narrows the list; release. |
| 31 | D-450 | [C1211037](https://shopview.testrail.io/index.php?/cases/view/1211037) | Design: Sales by Tier columns move when a row is opened | Rewrite: Sales by Tier columns keep their place when a row opens; release. |
| 31 | D-451 | [C1211038](https://shopview.testrail.io/index.php?/cases/view/1211038) | Design: Sales by Tier headings move on the empty states | Rewrite: Sales by Tier headings keep their place on the empty states; release. |
| 31 | D-452 | [C1211039](https://shopview.testrail.io/index.php?/cases/view/1211039) | Design: Sales by Category columns move when a category opens | Rewrite: Sales by Category columns keep their place when a category opens; release. |
| 31 | D-453 | [C1211040](https://shopview.testrail.io/index.php?/cases/view/1211040) | Design: the lines table's columns move while Quick Add is open | Rewrite: the lines table's columns keep their place while the Add Part row is open; release. |
| 31 | D-454 | [C1211041](https://shopview.testrail.io/index.php?/cases/view/1211041) | Design: the filter chips shift left as a picked chip widens | Rewrite: the filter chips keep their place as a picked chip changes; release. |
| 31 | D-63 | [C1211109](https://shopview.testrail.io/index.php?/cases/view/1211109) | Design: the simulator columns realign between view and edit | Rewrite: the simulator columns keep their place between view and edit; release. |
| 31 | D-64 | [C1211110](https://shopview.testrail.io/index.php?/cases/view/1211110) | Design: the New Matrix category list pushes the grid down | Rewrite: opening the New Matrix category list does not push the tabs and grid; release (if the QA lead reads 'nothing moves down' as covering an opened list, see IMPACT.md). |

### 4c · Held design-version cases to delete (25) — the PO ruled them out (Rule 130; deleted only on your go-ahead)
| Q | Case | C-id | Title | What changes |
|---|---|---|---|---|
| 2 | D-51 | [C1211097](https://shopview.testrail.io/index.php?/cases/view/1211097) | Design: the Delete question adds This can't be undone | The PO chose neither the PRD's v37 wording nor the design's; the design-version case is ruled out (delete); the new behaviour goes into the changed/new cases listed for this question. |
| 3 | D-52 | [C1211098](https://shopview.testrail.io/index.php?/cases/view/1211098) | Design: the Set Rule question says in all n matrices | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 4 | D-53 | [C1211099](https://shopview.testrail.io/index.php?/cases/view/1211099) | Design: a tier's Pricing tab says Same as previous tier | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 5 | D-54 | [C1211100](https://shopview.testrail.io/index.php?/cases/view/1211100) | Design: Default's page shows one column with rule counts | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 7 | D-55 | [C1211101](https://shopview.testrail.io/index.php?/cases/view/1211101) | Design: Duplicate opens an unsaved copy to name and create | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 8 | D-58 | [C1211104](https://shopview.testrail.io/index.php?/cases/view/1211104) | Design: Add Range adds a new last range | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 9 | D-61 | [C1211107](https://shopview.testrail.io/index.php?/cases/view/1211107) | Design: the last range reads with a plus sign in view | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 10 | D-65 | [C1211111](https://shopview.testrail.io/index.php?/cases/view/1211111) | Design: every range but the first has a delete button | The PO chose neither the PRD's v37 wording nor the design's; the design-version case is ruled out (delete); the new behaviour goes into the changed/new cases listed for this question. |
| 11 | D-60 | [C1211106](https://shopview.testrail.io/index.php?/cases/view/1211106) | Design: grid errors show in a Save is blocked banner | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 12 | D-62 | [C1211108](https://shopview.testrail.io/index.php?/cases/view/1211108) | Design: a taken New Matrix name shows in the banner | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 13 | D-56 | [C1211102](https://shopview.testrail.io/index.php?/cases/view/1211102) | Design: picking % Off fills every range with 0 | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 14 | D-57 | [C1211103](https://shopview.testrail.io/index.php?/cases/view/1211103) | Design: one rule type change counts as three changes | The PO chose neither the PRD's v37 wording nor the design's; the design-version case is ruled out (delete); the new behaviour goes into the changed/new cases listed for this question. |
| 15 | D-59 | [C1211105](https://shopview.testrail.io/index.php?/cases/view/1211105) | Design: the saved message names the range of the change | The PO chose neither the PRD's v37 wording nor the design's; the design-version case is ruled out (delete); the new behaviour goes into the changed/new cases listed for this question. |
| 17 | D-130 | [C1210911](https://shopview.testrail.io/index.php?/cases/view/1210911) | Design: the no-match messages say No matrices match and No category matches | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 17 | D-171 | [C1210932](https://shopview.testrail.io/index.php?/cases/view/1210932) | Design: a Customers tab no-match message offers Clear All Filters | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 18 | D-147 | [C1210919](https://shopview.testrail.io/index.php?/cases/view/1210919) | Design: the other categories named in an info icon by the matrix name | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 20 | D-168 | [C1210930](https://shopview.testrail.io/index.php?/cases/view/1210930) | Design: the delete question and taken-name error as the design words them | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 22 | D-172 | [C1210933](https://shopview.testrail.io/index.php?/cases/view/1210933) | Design: the Customers tab's Sales Type filter rows | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 23 | D-185 | [C1210946](https://shopview.testrail.io/index.php?/cases/view/1210946) | Design: the Counter Sale note shows as a blue box above the tier fields | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 25 | D-442 | [C1211035](https://shopview.testrail.io/index.php?/cases/view/1211035) | Design: receiving shows a toast with the price and the tier | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 26 | D-211 | [C1210953](https://shopview.testrail.io/index.php?/cases/view/1210953) | Design: the price details' matrix line and Same as previous tier row | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 27 | D-224 | [C1210964](https://shopview.testrail.io/index.php?/cases/view/1210964) | Design: the notice names Fixed price and Manual lines too | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 28 | D-440 | [C1211033](https://shopview.testrail.io/index.php?/cases/view/1211033) | Design: report rows and Priced By list show tier names without numbers | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 29 | D-441 | [C1211034](https://shopview.testrail.io/index.php?/cases/view/1211034) | Design: the Category list places Uncategorized in A to Z order | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |
| 30 | D-443 | [C1211036](https://shopview.testrail.io/index.php?/cases/view/1211036) | Design: the CSV's filter lines put Priced By before Category | The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling). |

### 4d · Released cases in run 560 whose text changes (30) — each rewritten top to bottom (Rule 134), same C-id, stays in the run
| Q | Case | C-id | Title | What changes |
|---|---|---|---|---|
| 1 | D-143 | [C1210915](https://shopview.testrail.io/index.php?/cases/view/1210915) | Design: a category's page with its matrix grid read-only | Design case: breadcrumb loses 'Settings ›'. |
| 1 | D-144 | [C1210916](https://shopview.testrail.io/index.php?/cases/view/1210916) | Design: the grayed Edit and the link on a shared matrix | Design case: breadcrumb loses 'Settings ›'. |
| 1 | D-145 | [C1210917](https://shopview.testrail.io/index.php?/cases/view/1210917) | Design: New Matrix from a category's page | Design case: New Matrix breadcrumb loses 'Settings ›'. |
| 1 | D-164 | [C1210926](https://shopview.testrail.io/index.php?/cases/view/1210926) | Design: the New Category page, its error and its created message | Design case: New Category breadcrumb loses 'Settings ›' (its unnamed 'blue button' steps already fit Q19). |
| 1 | S2-53 | [C1211497](https://shopview.testrail.io/index.php?/cases/view/1211497) | A tier's row opens its page on the Pricing tab with a breadcrumb | Breadcrumb 'Settings › Pricing › Tiers › tier A' becomes 'Pricing › Tiers › tier A'. |
| 1 | S2-54 | [C1211498](https://shopview.testrail.io/index.php?/cases/view/1211498) | A tier's page opened from a bookmark shows the same breadcrumb | Same breadcrumb change (opened from a bookmark). |
| 1 | S2-58 | [C1211502](https://shopview.testrail.io/index.php?/cases/view/1211502) | Edit on a tier's matrix row opens the grid in edit at that tier | Breadcrumb 'Settings › Pricing › Tiers › tier A › matrix A' loses 'Settings ›'. |
| 1 | S3-01 | [C1211523](https://shopview.testrail.io/index.php?/cases/view/1211523) | A matrix opens as a page from the Matrices list, in view | Breadcrumb 'Settings › Pricing › Matrices › matrix A' loses 'Settings ›'. |
| 1 | S3-02 | [C1211524](https://shopview.testrail.io/index.php?/cases/view/1211524) | A matrix opened from a category shows the category in the breadcrumb | Breadcrumb 'Settings › Categories › category A › matrix A' loses 'Settings ›'. |
| 1 | S3-03 | [C1211525](https://shopview.testrail.io/index.php?/cases/view/1211525) | The General Matrix opened from Uncategorized shows that breadcrumb | Breadcrumb 'Settings › Categories › Uncategorized › General Matrix' loses 'Settings ›'. |
| 1 | S3-05 | [C1211527](https://shopview.testrail.io/index.php?/cases/view/1211527) | A matrix opened from a bookmark shows the Matrices breadcrumb | Bookmark breadcrumb loses 'Settings ›'. |
| 1 | S7-10 | [C1211651](https://shopview.testrail.io/index.php?/cases/view/1211651) | Clicking a category row opens its page with every field | Category page breadcrumb 'Settings › Categories › category A' loses 'Settings ›'. |
| 2 | D-14 | [C1211063](https://shopview.testrail.io/index.php?/cases/view/1211063) | Design: the Delete question and the deleted message | Design case: same Delete dialog wording change (picture 2.29/2.30 still show the old lines until the canvas changes). |
| 2 | S2-35 | [C1211479](https://shopview.testrail.io/index.php?/cases/view/1211479) | Deleting a tier that priced nothing removes it and its columns | Delete dialog reads "This can't be undone." instead of "Parts already on work orders keep their prices.". |
| 6 | S3-40 | [C1211562](https://shopview.testrail.io/index.php?/cases/view/1211562) | Only a grid save asks Change All | Step 8 rests on v37 'changing its categories ... save without asking', removed in v38 ('categories save with the grid'). Whether a categories-only Save on a 2-category matrix asks Change All is not settled by v38: re-derive, or hold on follow-up question F2. |
| 10 | S3-28 | [C1211550](https://shopview.testrail.io/index.php?/cases/view/1211550) | Removing a range merges it into the range above | Step 3: only the middle range has a delete button (not the first); step 5: the two remaining ranges show no delete button. |
| 16 | S6-02 | [C1211624](https://shopview.testrail.io/index.php?/cases/view/1211624) | Matrices list shows each matrix's status, categories, tiers and both sides | Matrix A's Part Sale Matrix reads "Same as work orders" instead of Off. |
| 16 | S6-03 | [C1211625](https://shopview.testrail.io/index.php?/cases/view/1211625) | Part Sale Matrix column reads On once a matrix has its own Part Sale side | Reads "Same as work orders" before, and its Part Sale rules in short after the switch is on (title changes too: no 'reads On'). |
| 16 | S6-07 | [C1211629](https://shopview.testrail.io/index.php?/cases/view/1211629) | A separate Part Sale side does not change the Tiers column | Part Sale Matrix shows the Part Sale rules in short instead of On. |
| 19 | INV-47 | [C1211115](https://shopview.testrail.io/index.php?/cases/view/1211115) | A category name still needs 3 characters and must be unique | Invariant case: 'Click Save' (twice) on New Category becomes 'Click Create Category'. |
| 19 | S16-06 | [C1211394](https://shopview.testrail.io/index.php?/cases/view/1211394) | Settings — Parts without See Financial Data shows Fixed Rules and categories | 'Click Save' on New Category becomes 'Click Create Category'. |
| 19 | S16-15 | [C1211403](https://shopview.testrail.io/index.php?/cases/view/1211403) | Settings — Parts alone can create, rename and delete a category | 'Click Save' on New Category becomes 'Click Create Category'. |
| 19 | S6-08 | [C1211630](https://shopview.testrail.io/index.php?/cases/view/1211630) | General Matrix is first with its badge and its category count | 'Click Save' on New Category becomes 'Click Create Category'. |
| 19 | S8-02 | [C1211663](https://shopview.testrail.io/index.php?/cases/view/1211663) | New Category opens a page with the General Matrix and its grid | The New Category page shows Cancel and Create Category (not Save and Cancel). |
| 19 | S8-03 | [C1211664](https://shopview.testrail.io/index.php?/cases/view/1211664) | New Category creates nothing until Save, and Cancel creates nothing | Title 'creates nothing until Save' becomes 'until Create Category'; steps unchanged. |
| 19 | S8-04 | [C1211665](https://shopview.testrail.io/index.php?/cases/view/1211665) | A new category is priced for every tier from the start | 'Click Save' on New Category becomes 'Click Create Category'. |
| 19 | S8-12 | [C1211673](https://shopview.testrail.io/index.php?/cases/view/1211673) | Category names are unique ignoring capitals and need 3 characters | 'Click Save' on New Category becomes 'Click Create Category'. |
| 21 | S8-06 | [C1211667](https://shopview.testrail.io/index.php?/cases/view/1211667) | Uncategorized's page is read-only with a link to the General Matrix | Uncategorized's page: Pricing Matrix and Tax Exempt shown grayed (not 'no Pricing Matrix picker'); QuickBooks Products and Services can be changed when QuickBooks is connected. |
| 22 | S9-26 | [C1211699](https://shopview.testrail.io/index.php?/cases/view/1211699) | Customers tab search and channel filter narrow the list | Step 7 adds that customer A (on tier A for both channels) is hidden under Part Sales: each customer matches one option. |
| 26 | S12-12 | [C1211355](https://shopview.testrail.io/index.php?/cases/view/1211355) | The Part Sale parts table has a Priced by column too | Part Sale with no separate Part Sale pricing: the price details' side reads "Same as work orders", not Work Order Matrix. |

### 4e · Released cases where only the stored PRD quote changes (4) — tester text confirmed
| Q | Case | C-id | Title | What changes |
|---|---|---|---|---|
| 2 | S2-31 | [C1211475](https://shopview.testrail.io/index.php?/cases/view/1211475) | Archiving a tier nothing follows asks one plain question | Archive question unchanged; its S2-R30 quote is re-anchored to v38 (the '(or "Delete <tier>?") with the same last line' sentence changed). |
| 2 | S2-32 | [C1211476](https://shopview.testrail.io/index.php?/cases/view/1211476) | Archiving a tier lists every tier that follows it | Archive follower list unchanged; S2-R30 quote re-anchored ('After the list, Archive says ...'). |
| 6 | S3-06 | [C1211528](https://shopview.testrail.io/index.php?/cases/view/1211528) | A matrix is renamed in place and saves when the field loses focus | Rename-only case unchanged; S3-R12 quote re-anchored ('Renaming and turning the Part Sale switch on save without asking'). |
| 10 | S3-27 | [C1211549](https://shopview.testrail.io/index.php?/cases/view/1211549) | Ranges are entered by their end and the last range has no end | Last range still has no delete button; S3-R16 quote re-anchored ('Neither can be removed, so every cost is covered'). |

### 4f · Released cases that gain S19-R24 in References only (3)
| Q | Case | C-id | Title | What changes |
|---|---|---|---|---|
| 31 | D-123 | [C1210904](https://shopview.testrail.io/index.php?/cases/view/1210904) | Design: the Status filter and its blue chip keep the columns in place | S19-R24 added to References (the case already checks that columns keep their place in a state S19-R24 lists). |
| 31 | D-149 | [C1210921](https://shopview.testrail.io/index.php?/cases/view/1210921) | Design: a Categories search keeps the columns in place | S19-R24 added to References (the case already checks that columns keep their place in a state S19-R24 lists). |
| 31 | D-78 | [C1211201](https://shopview.testrail.io/index.php?/cases/view/1211201) | Design: Edit then Cancel returns the grid to the same view | S19-R24 added to References (the case already checks that columns keep their place in a state S19-R24 lists). |

### 4g · Released cases checked against the new S19-R24 and confirmed (5)
| Q | Case | C-id | Title | What changes |
|---|---|---|---|---|
| 31 | D-166 | [C1210928](https://shopview.testrail.io/index.php?/cases/view/1210928) | Design: the New Category name error keeps the columns in place | Expects a bar/notice/error line to push the list DOWN by its own height. S19-R24 lists the states that must not move anything and these are not among them, so the case stays as it is (no question needed: the PRD's own list settles it). |
| 31 | D-175 | [C1210936](https://shopview.testrail.io/index.php?/cases/view/1210936) | Design: the dark bar pushes the list down without moving its columns | Expects a bar/notice/error line to push the list DOWN by its own height. S19-R24 lists the states that must not move anything and these are not among them, so the case stays as it is (no question needed: the PRD's own list settles it). |
| 31 | D-225 | [C1210965](https://shopview.testrail.io/index.php?/cases/view/1210965) | Design: the notice pushes the lines down without moving the columns | Expects a bar/notice/error line to push the list DOWN by its own height. S19-R24 lists the states that must not move anything and these are not among them, so the case stays as it is (no question needed: the PRD's own list settles it). |
| 31 | D-76 | [C1211199](https://shopview.testrail.io/index.php?/cases/view/1211199) | Design: the bulk bar pushes the matrix list down but not sideways | Expects a bar/notice/error line to push the list DOWN by its own height. S19-R24 lists the states that must not move anything and these are not among them, so the case stays as it is (no question needed: the PRD's own list settles it). |
| 31 | D-77 | [C1211200](https://shopview.testrail.io/index.php?/cases/view/1211200) | Design: clearing the bulk bar puts the list back in place | Expects a bar/notice/error line to push the list DOWN by its own height. S19-R24 lists the states that must not move anything and these are not among them, so the case stays as it is (no question needed: the PRD's own list settles it). |

### 4h · New cases proposed (9) — written only after your go-ahead
| Q | New case (proposed, not written) | Source |
|---|---|---|
| 2 | Delete a tier that a later tier follows: the question lists the follower, then "This can't be undone." (no parts line) | S2-R30 v38 + messages table |
| 6 | In view, the Categories line cannot be changed; Edit turns it into the picker | S3-R13 v38 |
| 6 | Cancel after picking a category puts the line back and the category's parts keep their old matrix price | S3-R13 v38 |
| 14 | Switching a 3-range column to % Off counts 1 change; typing a value in each box makes 4 | S4-R4 v38 |
| 14 | After that save, the Audit Log entry records the rule-type change and the 3 range values | S19-R23 v38 |
| 15 | Different values per range: the saved message reads "tier A is" and one bullet per range | S4-R12 v38 |
| 15 | More than one rule type in a tier: "tier A is multiple rules" and one bullet per type | S4-R12 v38 |
| 21 | Uncategorized's QuickBooks Products and Services can be changed and saved (QuickBooks connected: staging) | S8-R4 v38 |
| 22 | Work orders and Both each list only the customers on the tier for exactly that | S9-R9 v38 |


## 5 · Design pictures (the canvas has not changed yet)

- 22 answers say the canvas will change (for example 2.29 Delete, 3.11/4.6/4.21 trash icons, 3.12 saved message, 1.4/3.2/4.1 "+").
  No board has changed yet (section 1). **361 released cases attach at least one picture the answers say will change**
  (list with case, C-id, pictures and question: `PICTURES-TO-REFRESH-WHEN-CANVAS-CHANGES.json`). Most of them check something else on that
  picture (for example a matrix page whose last range still shows "+"); their text already follows the PRD.
- Choice for you (Rule 56): **(A, recommended)** leave the pictures until Matt changes the canvas, then refresh them in one scripted pass (re-check the
  design version first, Rule 59) — the case text already says what to expect and the PO has ruled; **(B)** add a plain line now to each case whose
  picture shows the overruled behaviour ("The picture still shows …; Matt Barge ruled on 16 Nov 2026 (question n) that …; we follow his ruling").
  (B) touches up to 361 cases for a gap that closes when the canvas is updated.

## 6 · Recommendation: a NAMED SET, not a full pass (Rule 122, 16 Oct amendment)

**Recommended: named set** — the 41 held cases (5 release, 11 rewrite, 25 delete), the 30 changed cases, the 4 quote-only and 3 refs-only cases, and
9 new cases. Each named case is rewritten top to bottom against v38 and the answers (Rule 134: title, preconditions, steps, results, refs, pictures,
marker, run membership).

**Why a full pass is not needed — the evidence, and its limits:**
1. The PRD diff is small and fully explained: 19 change blocks in 841 lines, every block traced to an answer; the reports PRD did not move.
2. Quote check: all 1,943 PRD sentences the library stores as the source of a result were looked up in v38 word for word. Only 20 cases rest on a
   sentence that changed, and all 20 are in the named set.
3. Requirement check: 204 cases cite a requirement whose text changed. 47 are in the named set; the other 157 cite those requirements for a part
   that did not change (for example S4-R4's "Edit turns every cell editable", S2-R28's "opens its page on the Pricing tab") — their stored
   quotes are still word for word in v38, and a pattern search of every case's text for the changed behaviours (breadcrumbs, Delete wording,
   delete buttons, change counts, saved messages, Part Sale column, New Category buttons, Uncategorized, channel filter, paid work orders,
   price-details side, shared-matrix line, Audit Log, column moves) found nothing outside the named set.
4. Design boards, the reports PRD, the tech plans and the ticket set are unchanged; the 10 story edits repeat v38.
5. Answers where the PRD stays (22 of 31) change no released case: those cases already follow the PRD; only their held design twins go.
- **Limits:** the text search is pattern based; a case that asserts a changed behaviour in unusual words could slip past it. The library build
  (`build.py`, which re-proves every stored quote against the source) will catch any such case when the library is moved to v38, before any write.
  A full pass would also re-drive the whole design, which has not changed.

## 7 · Follow-ups

Two points the answers and v38 leave open (candidates only, not sent; if you agree they go at the bottom of Matt's sheet in a new colour, Rule 131,
after everything else is done, Rule 66):
- **F1 (Q6, S3-R13):** between picking a category on a matrix in Edit and clicking Save, what does that **category's own page** (and the Categories
  list) name as its matrix? Matt wrote "saved in the picker when picked"; v38 says the picked categories "show on the line at once", are priced by
  the matrix only after Save, and Cancel puts them back. My recommendation: ask; until then rewrite S3-17/S3-18 to check prices only (what both say).
- **F2 (Q6, S3-R12):** on a matrix used by two categories, does a Save that **only adds a category** (no grid value changed) ask Change All? v37 said
  category changes save without asking; v38 says "categories save with the grid" and "saving the grid of a matrix used by more than one category asks
  it". Case S3-40 (C1211562) says it does not ask. My recommendation: ask; hold S3-40's step 8 on F2 meanwhile.

Not asked (settled by the PRD's own words, Lesson L-20): whether the bars, notices and error lines that push a list down break S19-R24 — S19-R24
lists the states that must not move anything and these are not among them, so the five cases in 4g stay as they are.

## 8 · End-of-pass re-check (Rule 59)

- Sources read at pass start: 2026-11-16T12:51Z (PRD v38, created 12:28:08Z; reports PRD v21; design c3c9; epic 54 tickets).
- Re-read at the end: 2026-11-16T13:03Z — **PRD still v38 (12:28:08Z)**: it did not move during this pass.

## OUTSTANDING — what I need from you

1. **Named set or full pass?** (Rule 122) Recommended: named set (section 6).
2. **Go-ahead to delete the 25 held design-version cases** in 4c (Rule 130), and to release / rewrite the 16 in 4a-4b.
3. **Pictures:** (A) wait for Matt's canvas update, recommended, or (B) add a plain note now (section 5).
4. **Follow-up questions F1 and F2** (section 7): ask Matt, recommended, or decide without asking.
5. **Waiting on the PO:** nothing from the sheet https://docs.google.com/spreadsheets/d/1qVTIPIWUarmDGg6AjD1q8BbitlynKdjy9VYBCpGuMeY — all 31 questions
   are answered. Still to come from Matt: his canvas changes (22 answers name boards to change).
