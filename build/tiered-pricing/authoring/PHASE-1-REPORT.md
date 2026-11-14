# Tiered Pricing — phase 1 report (14 Nov 2026)

Library built, Stories 1-4 written in full, 11 linked tickets read, divergence register started. **Nothing was written to TestRail, Jira,
Slack or Google.** Folders are planned in `sections.json`, not created.

## What I did

| Step | Result |
|---|---|
| A · Library `build/tiered-pricing/authoring/` | `tp_lib.py` (case model, NO-format renderer, refs builder, word-for-word source check), `common.py`, `design_refs.py` (board → picture, board words), `sections.json` (24 planned folders), `verdicts.py`, `po_questions.py`, `make_register.py`, `build.py` (gates below), `proposals.json` (IWO shape + `pictures`, `picture_files`, `held_on`, `sources`), `AUTHORING-GUIDE.md` |
| B · Cases | **258**: Story 1: 22 · Story 2: 78 · Story 3: 45 (2 in the waiting folder) · Story 4: 41 · Design — how it looks: 72 (46 screen/state cases, 16 held design-version cases, 6 stress, 4 movement) |
| C · Linked tickets | 11 descriptions read in full (Rovo getJiraIssue), copies in `sources/jira/linked/` (personal names and e-mails removed: public repo); testable notes below |
| D · Register | `../DESIGN-DIVERGENCE-REGISTER.json`: 102 rows, both directions; stories 1-4: 72 rows, 0 open (57 closed / no difference, 15 PO candidates each with a held case); 30 listed for the next batches |
| E · Gates | `build.py`: **0 PROBLEM lines**. `tester_readiness_check.py build/tiered-pricing`: **0 hard problems**, 37 "does not / never" results |

### Folders (planned)

| Folder | Cases |
|---|---|
| Story 1: Release day | 22 (7 held: need a matrix set up on staging before the release is deployed there) |
| Story 2: Tiers | 78 |
| Story 3: Matrices and rules | 43 (1 held, same pre-release reason) |
| Story 4: The tier grid: every tier of a matrix, edited in place | 41 |
| Design — how it looks | 72 (16 held on Q5-Q19) |
| Waiting on Matt Barge's answers | 2 (S3-17, S3-18, held on Q2) |
| Must not change: today's pricing / Run on Production After Release | 0 in phase 1 (invariants are in the batch plan; no case needs production) |

Markers: 232 "AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026"; 26 HOLD (16 design version, 8 pre-release
staging set-up, 2 waiting on Q2). Pictures: 501 attachments, 142 distinct (all 120 boards of pages 1-4 and the coordinator's Today
pictures were viewed when assigned; board 2.1 is the Today board, attached as `today:2.1`).

### build.py gates (all pass)
Format (title ≤ 80, no ";", "Design: " exactly in the design folder, steps = results, one action per step incl. "from its three-dot menu",
plain precondition bullets, no placeholder / For example / Scenario / Blocked / who-to-ask, Expected = Step N + bullets + blank line + only
the AUTOMATION line, no quotes / From: / References from Design) · every bullet has a source, every quote word for word (PRD v37, reports
PRD v21, tech plans, saved Jira copies, board words) · every case tied to a requirement row; behaviour cases rest on a PRD sentence ·
every in-scope requirement and tech-plan row has a verdict · refs ticket + story/requirement, < 250, no comma in an anchor · closed lists
need a closing source · every negative has a visible control in the same step · Rule 137 (records used or explained, made for this test) ·
§6d line 9 stress registry · line 10 movement registry (screenshot before/after) · Rule 116 numbers registry with arithmetic shown ·
held cases on existing questions, every candidate holds a case, non-design held → waiting folder · register in-scope rows closed or held
with an existing case · cited boards attached · every in-scope board attached or explained.

### Sample read (Rule 138)
15 random cases (seed 1114) and all 37 "does not / never" results read in full. Fixed: 2 bundled steps (archive/reactivate "from its
three-dot menu"; "Put customer A on tier A … in Edit Customer") — the one-action gate now catches the first pattern; matrix preconditions
that named "category A" without making it (8 cases, now "a new category made for this test"); a result filed under the wrong step
(S4-07 and 30 other Story 4 cases, now aligned); a vague "tier other than Default" precondition (S1-12); "Nothing is created" given a
visible control (S3-25). Re-read S4-07, S2-44, D-73, S1-11 after the fixes. Every negative now has a visible control.

## Coverage, Stories 1-4 (93 PRD rows: 83 covered, 3 covered in part, 7 not testable by hand)

| Row | Section | Verdict | Cases |
|---|---|---|---|
| S1-R1 | Requirements | COVERED | S1-01, S1-02 (held: S1-02) |
| S1-R9 | Requirements | COVERED | D-02, S1-03, S1-04, S1-05 (held: S1-03, S1-04, S1-05) |
| S1-R10 | Requirements | COVERED | D-01, D-02, S1-03, S1-06 (held: S1-03) |
| S1-R11 | Requirements | COVERED | S1-07 |
| S1-R2 | Requirements | COVERED | S1-08 |
| S1-R3 | Requirements | COVERED | S1-09, S1-10, S1-11 |
| S1-R6 | Requirements | COVERED | S1-12 |
| S1-R7 | Requirements | COVERED | S1-13 |
| S1-R8 | Requirements | COVERED IN PART: The in-app What's New entry is checked (Story 1); the client email is sent outside ShopView and cannot be chec | S1-14 |
| S1-N1 | Negative Cases | NOT TESTABLE BY HAND: States that Story 1 has no negative case ("Nothing in this story is a user action"); there |  |
| S1-E1 | Edge Cases | COVERED | S1-15, S1-16 |
| S1-E2 | Edge Cases | COVERED | S1-17 |
| S1-E3 | Edge Cases | COVERED IN PART: The tax half is checked in Story 1; the QuickBooks half (revenue moves to the part's own category) belongs to  | S1-18 |
| S1-E9 | Edge Cases | COVERED | S1-21 (held: S1-21) |
| S1-E11 | Edge Cases | COVERED | S1-19 |
| S1-E12 | Edge Cases | COVERED | S1-20 (held: S1-20) |
| S1-E13 | Edge Cases | COVERED | S1-22 (held: S1-22) |
| S1 Error Handling (no PRD id; numbered here) | Error Handling | NOT TESTABLE BY HAND: States that release day runs no user action, so it has no error handling; nothing to look  |  |
| S2-R1 | Requirements | COVERED | D-01, D-03, D-70, S1-01, S1-08, S2-01, S2-03, S2-04 |
| S2-R25 | Requirements | COVERED | S2-01, S2-05, S2-06, S2-07 |
| S2-R3 | Requirements | COVERED | D-09, D-17, D-70, D-71, D-72, S2-20, S2-21, S2-22 …+3 |
| S2-R15 | Requirements | COVERED | D-04, S2-01, S2-02, S2-08, S2-09, S2-53 |
| S2-R17 | Requirements | COVERED | D-08, D-09, D-10, S2-12, S2-14, S2-15, S2-16, S2-17 …+8 |
| S2-R29 | Requirements | COVERED | D-10, S2-15 |
| S2-R18 | Requirements | COVERED | S2-17 |
| S2-R5 | Requirements | COVERED | D-17, S2-04, S2-25, S2-52, S4-29 |
| S2-R6 | Requirements | COVERED | D-13, D-19, S2-08, S2-31, S2-33, S2-42, S2-43, S2-44 …+6 |
| S2-R26 | Requirements | COVERED | D-06, D-07, D-13, D-70, D-73, D-79, S2-09, S2-27 …+15 |
| S2-R30 | Requirements | COVERED | D-12, D-13, D-14, D-51, D-73, D-79, S2-08, S2-09 …+9 (held: D-51) |
| S2-R7 | Requirements | COVERED | D-11, S2-27, S2-28, S2-30 |
| S2-R12 | Requirements | COVERED | S2-27, S2-28, S2-29 |
| S2-R8 | Requirements | COVERED | D-14, S2-34, S2-35, S2-39, S2-40, S2-41, S2-45 |
| S2-R13 | Requirements | COVERED | D-06, D-18, S2-30, S2-36, S2-37, S2-38 |
| S2-R14 | Requirements | COVERED | D-71, D-73, D-74, D-76, D-77, D-79, S1-17, S2-01 …+70 |
| S2-R28 | Requirements | COVERED | D-15, D-16, D-17, D-50, D-71, D-73, D-76, D-77 …+37 (held: D-50) |
| S2-R20 | Requirements | COVERED | D-15, D-53, D-54, D-74, D-76, D-77, S2-53, S2-56 …+4 (held: D-53, D-54) |
| S2-R22 | Requirements | COVERED | D-20, D-22, D-52, D-73, D-76, D-77, S1-17, S2-05 …+22 (held: D-52) |
| S2-R23 | Requirements | COVERED | D-22, D-23, D-52, D-73, S1-17, S2-05, S2-06, S2-49 …+13 (held: D-52) |
| S2-R24 | Requirements | COVERED | S2-05, S2-06, S2-52, S2-67, S2-68, S2-69, S2-73 |
| S2-R27 | Requirements | COVERED | D-22, S2-70, S2-71, S2-72, S2-73, S2-74 |
| S2-N7 | Negative Cases | COVERED | D-21, D-76, S2-62, S2-75, S2-76, S2-77, S2-78 |
| S2-N8 | Negative Cases | COVERED | S2-57 |
| S2-E2 | Edge Cases | COVERED | S2-33, S2-50, S2-51 |
| S2-E5 | Edge Cases | COVERED | S2-74 |
| S2 Error Handling (no PRD id; numbered here) | Error Handling | NOT TESTABLE BY HAND: If saving a tier fails: a manual tester cannot make a save fail on purpose; listed for the |  |
| S2 Error Handling (no PRD id; numbered here) | Error Handling | NOT TESTABLE BY HAND: Set Rule and its Undo all or nothing when a matrix fails: a manual tester cannot make a sa |  |
| S3-R18 | Requirements | COVERED | D-24, D-25, D-26, D-74, D-75, S1-01, S2-07, S2-17 …+17 |
| S3-R25 | Requirements | COVERED | D-78, S3-01, S3-04, S3-08, S3-09, S3-44, S3-45, S4-29 (held: S3-45) |
| S3-R26 | Requirements | COVERED | D-50, S2-58, S3-01, S3-02, S3-03, S3-05 (held: D-50) |
| S3-R13 | Requirements | COVERED IN PART: Picker, search, Select all, "Now: <matrix>", Uncategorized not listed and the move on save are checked; WHEN t | D-33, D-64, D-75, S1-07, S3-13, S3-14, S3-15, S3-16 …+3 (held: D-64, S3-17, S3-18) |
| S3-R28 | Requirements | COVERED | D-27, S3-12, S3-13 |
| S3-R5 | Requirements | COVERED | S3-20 |
| S3-R20 | Requirements | COVERED | S3-21 |
| S3-R6 | Requirements | COVERED | D-34, D-60, D-62, S3-22, S3-23, S3-24, S3-25, S3-26 (held: D-60, D-62) |
| S3-R16 | Requirements | COVERED | D-43, D-58, D-61, S3-22, S3-27 (held: D-58, D-61) |
| S3-R32 | Requirements | COVERED | D-43, D-65, S3-28 (held: D-65) |
| S3-R23 | Requirements | COVERED | S3-29, S3-30 |
| S3-R30 | Requirements | COVERED | D-33, D-34, S3-16, S3-25, S3-31 |
| S3-R21 | Requirements | COVERED | D-31, D-32, S1-06, S2-07, S2-69, S3-11, S3-32, S3-33 …+2 |
| S3-R31 | Requirements | COVERED | D-32, S3-11, S3-33, S3-34, S3-35 |
| S3-R27 | Requirements | COVERED | D-32, S3-35 |
| S3-R8 | Requirements | COVERED | D-35, D-55, S3-37, S3-38 (held: D-55) |
| S3-R9 | Requirements | COVERED | D-35, S3-39 |
| S3-R12 | Requirements | COVERED | S1-05, S3-06, S3-40, S3-41 (held: S1-05) |
| S3-N3 | Negative Cases | COVERED | S3-42 |
| S3-N4 | Negative Cases | COVERED | S3-19 |
| S3-E3 | Edge Cases | COVERED | S3-43 |
| S3-E4 | Edge Cases | COVERED | S1-02, S3-44, S3-45 (held: S1-02, S3-45) |
| S3 Error Handling (no PRD id; numbered here) | Error Handling | NOT TESTABLE BY HAND: If saving the matrix fails: a manual tester cannot make a save fail on purpose; listed for |  |
| S3 Error Handling (no PRD id; numbered here) | Error Handling | NOT TESTABLE BY HAND: Change All all or nothing on a failure: a manual tester cannot make a save fail on purpose |  |
| S4-R1 | Requirements | COVERED | D-36, S2-25, S4-01 |
| S4-R27 | Requirements | COVERED | D-63, D-72, S4-02, S4-03, S4-04 (held: D-63) |
| S4-R3 | Requirements | COVERED | D-37, S2-17, S4-05, S4-06, S4-07, S4-08, S4-09 |
| S4-R4 | Requirements | COVERED | D-28, D-29, D-30, D-44, D-45, D-57, D-75, D-78 …+46 (held: D-57, S1-05, S1-20, S3-45) |
| S4-R5 | Requirements | COVERED | D-39, S2-07, S4-13, S4-14, S4-27 |
| S4-R28 | Requirements | COVERED | D-38, D-42, S4-16, S4-17, S4-24 |
| S4-R31 | Requirements | COVERED | S4-18, S4-19 |
| S4-R29 | Requirements | COVERED | S4-20, S4-21 |
| S4-R7 | Requirements | COVERED | D-56, S4-14, S4-22 (held: D-56) |
| S4-R26 | Requirements | COVERED | D-40, S2-07, S3-34, S3-38, S4-23, S4-24, S4-27 |
| S4-R10 | Requirements | COVERED | D-41, S4-25, S4-26 |
| S4-R12 | Requirements | COVERED | D-59, S2-07, S2-74, S3-11, S3-29, S3-34, S3-38, S4-27 …+3 (held: D-59) |
| S4-R20 | Requirements | COVERED | S4-27 |
| S4-R15 | Requirements | COVERED | S4-09, S4-29 |
| S4-R30 | Requirements | COVERED | D-45, S4-30, S4-31, S4-32, S4-33, S4-35 |
| S4-R16 | Requirements | COVERED | D-29, D-75, S4-34 |
| S4-R22 | Requirements | COVERED | S4-34 |
| S4-R18 | Requirements | COVERED | D-29, S4-36 |
| S4-R19 | Requirements | COVERED | D-46, S4-37, S4-38, S4-39, S4-40 |
| S4-R32 | Requirements | COVERED | D-46, S4-39 |
| S4-N1 | Negative Cases | COVERED | D-39, S4-15 |
| S4-E3 | Edge Cases | COVERED | S4-41 |
| S4 Error Handling (no PRD id; numbered here) | Error Handling | NOT TESTABLE BY HAND: If the grid save fails: a manual tester cannot make a save fail on purpose; listed for the |  |

Tech-plan rows in scope: TPX-02 (S2-41), TPX-03 (S4-40), TPX-12 Cost Range tooltip (D-36), TPX-13 (S4-09), TPX-14 (S3-36), TPX-16
(S2-72), TPX-18 (S2-46, S2-47). TPX-15 belongs to Story 19 (batch A). Ticket rows TKT-01..03: no case (stale ticket text; noted at intake).
Rule 116 numbers proved here: N1 (rounding, % Off/$ Off per range, mixed rules, $128 double discount), N7 (archived simulator, zero rules),
N9, N11, N12, N13, N16, N17, N18, N19, N20 (`verdicts.NUMBERS`).

## Divergence register (Rule 130)

Stories 1-4: PRD→design 24 rows (spec_to_design_check on a bolded PRD copy, apostrophes normalised: 6 shown, 17 design-silent / example
data / settled by the PRD, 1 PO candidate); design→PRD by hand 28 rows (14 PO candidates, 14 closed by a PRD sentence or the precedence);
the proof's 11 self-inconsistencies (6 in scope, all closed or held) and §8's design behaviours (14 in scope, each mapped to a case).
**PO candidates, not sent (no sheet exists yet; skill 07 §6.0 checks still to run on the merged sheet):** Q5 breadcrumbs start at
"Pricing" · Q6 "This can't be undone." in Delete <tier>? · Q7 "in all n matrices" · Q8 "Same as previous tier" on a tier's Pricing tab ·
Q9 Default's page (one column, "3 rules · markup") · Q10 Duplicate opens an unsaved copy · Q11 % Off starts at 0, not empty · Q12 "3
changes" for one type change · Q13 Add Range adds a last range · Q14 save toast wording · Q15 "Save is blocked" banner and message words
· Q16 "$10,000.01 +" in view · Q17 taken matrix name in the banner · Q18 simulator/category-list layout moves · Q19 delete buttons on
every range except the first. Plus intake Q2 (holds S3-17, S3-18). Unsent count: 16 (must be 0 before the suite is called complete).

## Linked tickets (read in full, 14 Nov 2026)

| Ticket | Status | Testable for the suite |
|---|---|---|
| SV-11165 single price source | Backlog | Engineering goal (one resolver); no screen. Story 10's lookup order is the testable side (batch B). |
| SV-2958 customer default matrix | Backlog | Superseded by tiers (Story 9). Its rule "open work orders keep their pricing; only new ones change" is PRD S10-R14 (batch B). |
| SV-3398 amplify fixed sell price | Done (prod 2025-09-18) | Today's green "Fixed sell price" label under the sell price in Inventory; a fixed price survives matrix rule edits/deletes, category deletes, part category changes and receiving; clearing it recalculates from the matrix. **Two invariant candidates for batch A (INV section B):** the green label, and clearing a fixed price recalculating. Also shows the QA-site naming convention `sv3398.qa.shopview.com`. |
| SV-3411 BE fixed sell price | Done | A category changed in Inventory mirrors to the catalog and every location; recalculates only when there is no fixed price. **Invariant candidate for batch A** (category mirrors across locations); the price half is PRD S11-N2 (batch B). |
| SV-4027 customer-specific matrices | Backlog | Need met by tiers; no case. |
| SV-4409 cost outside a matrix's range | Backlog | Today a cost outside the only range is priced by it; the PRD keeps "below the first range uses the first range's rule" (S1-E12, S10-R3; INV-05). Covered by S1-20 / batch B. |
| SV-4411 last rule can't be deleted | Backlog | PRD S3-R16: the last range can't be removed (S3-27, D-65/Q19). |
| SV-4621 cost on found parts | Backlog | Out of scope; no case. |
| SV-7857 flat-rate markup | Open | Delivered as "+ $" (S3-R5): S3-20, S4-05, S4-06. |
| SV-9414 zero markup for internal customers | Open | Met by a tier (e.g. "Internal" 0% markup, design) and S10-E5 (batch B); no extra case. |
| SV-9492 cost-plus with margin by range | Open | Mixed From cost types per range (S4-R28): S4-16, S4-17, S3-20. |

## QA site

**Not found.** No ticket copy, PRD, tech plan or design names a Tiered Pricing QA site (tech plans: "Branch: —"). By the team's naming
convention (`sv<ticket>.qa.shopview.com`, confirmed by SV-3398's comments, `sv3398.qa.shopview.com`) it would be
`sv11692.qa.shopview.com`, but that name **does not resolve** today (DNS lookup, 14 Nov 2026; `sv9160.qa.shopview.com` resolves, so the
probe works). Nobody logged in anywhere. Story 1 and invariant cases therefore say "staging".

## Open points

1. 16 PO candidates unsent (above) and intake Q1, Q2, Q4 (drafts) — one sheet for Matt Barge after batches A and B add theirs (Rules 66, 131, 132).
2. 8 cases need a matrix set up on staging **before** the release is deployed there (S1-02, S1-03, S1-04, S1-05, S1-20, S1-21, S1-22,
   S3-45): if staging already has the release, they need a staging data reset or the QA site with pre-release data — QA lead to decide.
3. The release note's client e-mail (S1-R8) cannot be checked from the screens (only the What's New entry is, S1-14).
4. Two linked tickets add invariant candidates (SV-3398 green label and clear-recalculates; SV-3411 category mirrors) — for the
   INVARIANTS.md owner / batch A.
5. `TICKET-LEDGER.json` rows for Stories 1-4 still say PENDING (the case keys are in `proposals.json`); the coordinator updates the ledger at write time.

## Plan for the remaining stories — two parallel batches of similar size

| | Batch A — settings, customers, shared behaviour | Batch B — lines, accounting and reports |
|---|---|---|
| PRD stories | 5 Price Part Simulator (8 rows), 6 Matrices list (10), 7 Categories (12), 8 Categories over time (9), 9 Customers on tiers (34), 12 Seeing what priced a part (19), 14 Change Customer (7), 15 Below-cost warning (7), 16 Who can do what (24, incl. the 12 Permissions-table rows), 19 Shared behaviour (20) — **150 rows** | 10 How a part is priced (29), 11 Priced again (22), 13 Part Sales (3), 17 Reports and totals (7), 18 Accounting and QuickBooks (8), Sales by Tier and Sales by Category PRD (70) — **139 rows** |
| Tech-plan rows | TPX-07, 15, 17, 19, 20, 21, 22 (7) | TPX-01 (held Q1), 04, 05, 06, 08, 09, 10, 23-40 (25) |
| Invariants (folder "Must not change") | INVARIANTS.md §B settings (17), §C customers (8), §D work order / Part Sale screens (11) — 36 rows + the SV-3398/SV-3411 candidates | §A pricing and repricing (43), §E documents and integrations (5), §F reports (9) — 57 rows |
| Design pages | 5, 6, 7, 8, 9 (incl. 9 full-height pictures), 12, 14, 15 — 105 boards; Today 9.25, 9.26, 9.27, 9.38, 14.1 | 10, 11, 13, 20 — 46 boards; Today 10.1-10.3, 13.1, 20.1 |
| Register rows to close | TPD-I03 (6.8), I05, I06, I08, I09; E14-E23, E26-E28, E34; L02 (7.9); L03/L04 for their pages | TPD-I03 (20.22), I04; E24, E25, E29-E33; L01 (20.20 CSV, with Q4); L03/L04 for their pages |
| Questions | Q20-Q39 | Q40-Q59; Q1, Q4 |
| Files it owns | `cases_s5.py`, `cases_s6.py`, `cases_s7.py`, `cases_s8.py`, `cases_s9.py`, `cases_s12.py`, `cases_s14.py`, `cases_s15.py`, `cases_s16.py`, `cases_s19.py`, `cases_inv_a.py`, `cases_design_batch_a.py` (D-100…D-399), `verdicts_batch_a.py`, `po_questions_batch_a.py`, `register_rows_batch_a.json` | `cases_s10.py`, `cases_s11.py`, `cases_s13.py`, `cases_s17.py`, `cases_s18.py`, `cases_rpt.py`, `cases_inv_b.py`, `cases_design_batch_b.py` (D-400…D-699), `verdicts_batch_b.py`, `po_questions_batch_b.py`, `register_rows_batch_b.json` |
| Size | 193 rows + 105 boards | 221 rows + 46 boards |

Shared files (`tp_lib.py`, `common.py`, `build.py`, `verdicts.py`, `po_questions.py`, `make_register.py`, `design_refs.py`) are
not edited by either batch; a needed library change goes to the coordinator. Each batch runs `build.py` and the readiness check before
committing, and commits only its own files (`git add -- <its files>`).

## OUTSTANDING — what I need from you

| What | Why | Recommendation |
|---|---|---|
| Decide how to run the 8 pre-release cases (open point 2) | they need data prepared before the release reaches staging | Ask engineering whether staging already has the release; if yes, use the QA site once it exists with a copy of pre-release data |
| PO sheet for Matt Barge (16 candidates + Q1, Q2, Q4) | Rule 132: every unanswered question in every report | Send one sheet after batches A and B, after skill 07 §6.0 on the merged list |
| Tiered Pricing QA site address | `sv11692.qa.shopview.com` does not resolve | Ask engineering for the branch name |

**Waiting on the PO:** no sheet exists yet for Tiered Pricing; nothing has been sent (drafts: Q1, Q2, Q4 in PO-QUESTIONS-DRAFT.md; Q5-Q19 in `po_questions.py`). Cases held: S3-17, S3-18 (Q2); D-50…D-65 (Q5-Q19).
