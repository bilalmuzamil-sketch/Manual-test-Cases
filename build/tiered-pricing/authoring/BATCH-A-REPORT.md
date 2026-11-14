# Tiered Pricing — batch A report (14 Nov 2026)

Batch A of phase 2: settings, customers and shared behaviour. **Nothing was written to TestRail, Jira, Slack or Google.** Only batch A's
own files were created or committed: `cases_s5.py`, `cases_s6.py`, `cases_s7.py`, `cases_s8.py`, `cases_s9.py`, `cases_s12.py`,
`cases_s14.py`, `cases_s15.py`, `cases_s16.py`, `cases_s19.py`, `cases_inv_a.py`, `cases_design_batch_a.py`, `verdicts_batch_a.py`,
`po_questions_batch_a.py`, `register_rows_batch_a.json`, `LIB-REQUESTS-BATCH-A.md` and this report.

## Counts

| Folder | Cases | Held |
|---|---|---|
| Story 5: Price Part Simulator | 14 | 0 |
| Story 6: Every matrix in one list | 19 | 0 |
| Story 7: Categories | 20 | 0 |
| Story 8: Categories over time | 12 | 0 |
| Story 9: Putting customers on tiers | 38 | 0 |
| Story 12: Seeing what priced a part | 22 | 0 |
| Story 14: Changing the customer on a work order | 9 | 0 |
| Story 15: The below-cost warning | 8 | 0 |
| Story 16: Who can do what (incl. the 12 Permissions-table rows) | 20 | 0 |
| Story 19: Shared behavior | 23 | 0 |
| Must not change: today's pricing (INV §B, §C, §D + SV-3398/SV-3411) | 32 | 0 |
| Design — how it looks (D-100…D-225) | 72 | 12 design-version cases on Q20-Q30 |
| **Total** | **289** | **12** |

Flags: 40 number cases (Rule 116, arithmetic shown), 6 stress cases (§6d line 9), 7 before-and-after cases (line 10). Pictures: 466
attachments, 136 distinct (all 105 boards of pages 5, 6, 7, 8, 9, 12, 14, 15 attached or listed: 6.1, 9.25, 9.26, 9.27, 9.38, 14.1 are Today
boards whose screenshots are attached as `today:` pictures). Every board was viewed (cropped montages) when assigned. The 9 full-height
pictures cannot be attached by the library yet (LIB-REQUESTS-BATCH-A.md #1; cases to receive them are listed there).

Markers: 277 "AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026"; 12 HOLD (design differs, waiting on the PO).

## Gates

- `build.py`: **0 PROBLEM lines in batch A's cases, rows, boards, questions and register rows.** Batch B's files were present during the
  run; the remaining PROBLEM lines (between 1 and 116 over the day, as batch B worked) were all in batch B's files (INV §A/§F, S10, S11,
  RPT, Q40+); none is batch A's.
- `tester_readiness_check.py build/tiered-pricing`: **0 hard problems** (817 cases in the suite; the 2 hard problems seen at one point were
  batch B's S10-08/S10-09).

## Sample read (Rule 138)

15 random batch A cases (seed 1114: D-187, S14-05, D-127, D-125, D-176, D-104, S5-11, S12-21, INV-73, D-103, S19-19, S19-09, S14-07,
S9-19, S16-04) and all 190 "does not / never / no" results of batch A read in full. Fixed:
1. Users without some permission could not make the test's own records: every non-Admin sign-in line now adds "An Admin makes the records
   below before the test." (S16 role helper, 6 INV cases, S9-10, S14-08).
2. S19-19 assumed the first click on the Category header sorts Z to A (no source says so for a name column): it now keeps the first-load
   A-to-Z order; S7-08 says the order "reverses".
3. S15-03 and S15-08: "no warning icon" results got a visible control (the value itself) in the same step.
4. INV-49's "add a fixed rule … in its dialog" bundled four actions: split into one action per step (and a gate idea for the library).
5. Earlier while writing: a "Make sure" for customers the test makes (S9-27), stress results that named wrap versus "…" without a source
   (D-217), and closed-list words without a closing source (several) were rewritten.
Every negative now has a visible control in its own step or its own bullet states what is seen.

## Coverage of batch A's rows (150 PRD rows + 7 tech-plan rows)

PRD rows: **125 covered, 11 covered in part, 14 not testable by hand** (125 + 11 + 14 = 150). Tech-plan rows: 6 covered, 1 not testable by hand.

| Row | Section | Verdict | Cases |
|---|---|---|---|
| S5-R1 | Requirements | COVERED | D-100, D-103, D-104, S5-01, S5-02, S5-03, S5-04, S5-05 …+10 |
| S5-R2 | Requirements | COVERED | D-100, S10-14, S15-06, S5-01, S5-02, S5-04, S5-05, S5-09 …+4 |
| S5-R3 | Requirements | COVERED | S5-05, S5-06, S5-07, S5-08 |
| S5-R4 | Requirements | COVERED | D-103, S5-04, S5-09 |
| S5-R5 | Requirements | COVERED | D-101, S5-10 |
| S5-R6 | Requirements | COVERED | S5-09, S5-11 |
| S5-N1 | Negative Cases | COVERED | D-102, S5-12, S5-13, S5-14 |
| S5-EH1 | Error Handling | NOT TESTABLE BY HAND: The PRD states it does not apply ("the simulator calculates on screen and saves nothing"); there is nothing to look at. |  |
| S6-R11 | Requirements | COVERED | D-120, D-405, INV-49, S6-01, S6-08, S6-19, S7-09 |
| S6-R1 | Requirements | COVERED | D-120, D-124, D-128, D-129, S6-02, S6-03 |
| S6-R10 | Requirements | COVERED | D-121, D-122, S6-04, S6-05, S6-06, S6-07 |
| S6-R8 | Requirements | COVERED | S6-08, S8-10 |
| S6-R7 | Requirements | COVERED | S6-09 |
| S6-R9 | Requirements | COVERED | D-126, S6-10, S6-11, S6-12 |
| S6-R2 | Requirements | COVERED | D-123, D-125, S6-13, S6-14, S6-16, S6-19 |
| S6-R3 | Requirements | COVERED | D-130, S6-15, S6-16 |
| S6-R6 | Requirements | COVERED | S6-15, S6-17, S6-18, S6-19 |
| S6-EH1 | Error Handling | NOT TESTABLE BY HAND: A failed Matrices list load: a manual tester cannot make a load or save fail on purpose; listed for the developers' own  |  |
| S7-R1 | Requirements | COVERED | D-140, D-148, S6-08, S6-19, S7-01, S7-10, S7-11, S7-12 …+6 |
| S7-R2 | Requirements | COVERED | D-141, S7-02, S7-03, S7-04, S7-05 |
| S7-R4 | Requirements | COVERED | D-130, D-142, D-149, S19-19, S7-06, S7-07, S7-08, S7-09 |
| S7-R6 | Requirements | COVERED | D-143, D-148, INV-51, S6-08, S7-10, S7-11, S7-12, S7-17 …+4 |
| S7-R13 | Requirements | COVERED | D-144, D-160, S7-12, S7-13, S7-14, S8-06 |
| S7-R15 | Requirements | COVERED | D-147, S7-14, S7-15 |
| S7-R14 | Requirements | COVERED | INV-54, S7-16 |
| S7-R12 | Requirements | COVERED | INV-51, S19-13, S7-17, S8-01 |
| S7-R9 | Requirements | COVERED | D-160, S19-13, S6-08, S7-18 |
| S7-R11 | Requirements | COVERED | D-145, S7-19 |
| S7-N1 | Negative Cases | COVERED | INV-56, S7-20 |
| S7-EH1 | Error Handling | NOT TESTABLE BY HAND: A failed Categories list load or category save: a manual tester cannot make a load or save fail on purpose; listed for t |  |
| S8-R1 | Requirements | COVERED | S8-01 |
| S8-R10 | Requirements | COVERED | D-164, D-165, D-166, INV-47, INV-59, S6-08, S8-02, S8-03 …+2 |
| S8-R3 | Requirements | COVERED | INV-45, INV-59, S8-05 |
| S8-R4 | Requirements | COVERED | D-161, D-162, S8-06, S8-07 |
| S8-R8 | Requirements | COVERED | D-167, D-168, INV-58, RPT-71, S1-16, S18-05, S18-06, S19-13 …+4 |
| S8-N3 | Negative Cases | COVERED | D-148, D-163, D-168, INV-47, S8-12 |
| S8-E1 | Edge Cases | COVERED IN PART: Catalog parts, work order and Part Sale lines (invoiced included) and canned line parts are checked; order and delivery  | INV-58, S18-05, S8-09, S8-10, S8-11 |
| S8-E2 | Edge Cases | COVERED | S8-10 |
| S8-EH1 | Error Handling | NOT TESTABLE BY HAND: A failed category save: a manual tester cannot make a load or save fail on purpose; listed for the developers' own autom |  |
| S9-R1 | Requirements | COVERED | D-184, D-187, S9-01, S9-10, S9-23, S9-24, S9-38 |
| S9-R2 | Requirements | COVERED IN PART: New Customer's two tier fields and Default for a new customer are checked; an imported customer starting on Default is n | INV-67, S9-02 |
| S9-R3 | Requirements | COVERED | D-184, D-187, D-190, INV-62, S1-11, S9-01, S9-03, S9-05 …+1 |
| S9-R31 | Requirements | COVERED | D-186, S9-04 |
| S9-R30 | Requirements | COVERED | D-184, D-187, D-190, S16-03, S9-05, S9-10, S9-23, S9-24 …+2 |
| S9-R12 | Requirements | COVERED | D-183, D-184, D-186, D-190, INV-62, INV-64, S9-01, S9-03 …+5 |
| S9-R14 | Requirements | COVERED | D-184, INV-66, S9-09 |
| S9-R15 | Requirements | COVERED | S9-10 |
| S9-R16 | Requirements | COVERED | INV-65, S9-11 |
| S9-R4 | Requirements | COVERED | D-170, D-173, D-180, D-189, S9-12, S9-13, S9-19, S9-20 …+1 |
| S9-R17 | Requirements | COVERED | D-173, S9-14 |
| S9-R18 | Requirements | COVERED | D-174, D-175, INV-75, S9-15 |
| S9-R19 | Requirements | COVERED | D-174, S9-16, S9-17, S9-37 |
| S9-R20 | Requirements | COVERED | S9-17 |
| S9-R21 | Requirements | COVERED | D-189, S9-18 |
| S9-R22 | Requirements | COVERED | D-180, S9-20 |
| S9-R23 | Requirements | COVERED | D-174, D-177, D-180, S9-19, S9-20 |
| S9-R24 | Requirements | COVERED | S9-21 |
| S9-R5 | Requirements | COVERED | S9-12, S9-19, S9-22 |
| S9-R7 | Requirements | COVERED | D-174, D-184, S1-11, S10-34, S10-35, S10-39, S11-14, S9-23 |
| S9-R27 | Requirements | COVERED | S9-23, S9-24 |
| S9-R8 | Requirements | COVERED | D-185, INV-68, S9-25 |
| S9-R9 | Requirements | COVERED | D-172, D-189, S9-26, S9-27, S9-28 |
| S9-R10 | Requirements | COVERED | D-177, D-178, D-179, S9-29, S9-30 |
| S9-R11 | Requirements | COVERED | D-183, D-188, INV-61, S9-31 |
| S9-N1 | Negative Cases | COVERED | D-176, S9-19, S9-32 |
| S9-N3 | Negative Cases | COVERED | S9-33 |
| S9-N6 | Negative Cases | COVERED IN PART: The Customers tab and Manage Customers no-match messages and the empty Remove tab are checked; the Add tab's "Every cust | D-171, D-178, D-182, S9-34 |
| S9-E2 | Edge Cases | NOT TESTABLE BY HAND: Selecting all of a large customer list (about 1,284) and saving moves every customer of the client onto one tier; a manu |  |
| S9-E3 | Edge Cases | COVERED | INV-63, S19-17, S9-35 |
| S9-E5 | Edge Cases | COVERED | D-177, S9-36 |
| S9-E7 | Edge Cases | COVERED | S9-37 |
| S9-E6 | Edge Cases | NOT TESTABLE BY HAND: A bulk add or remove that fails part-way (all or nothing): a manual tester cannot make a load or save fail on purpose; l |  |
| S9-EH1 | Error Handling | NOT TESTABLE BY HAND: A failed Manage Customers save: a manual tester cannot make a load or save fail on purpose; listed for the developers' o |  |
| S12-R1 | Requirements | COVERED | D-210, D-217, S1-09, S12-01, S12-04 |
| S12-R10 | Requirements | COVERED IN PART: The gray Manual icon and where it shows are checked; its screen reader name "Price typed by hand: see details" needs a s | D-212, D-400, S10-16, S10-24, S11-04, S12-06, S12-07, S12-08 |
| S12-R2 | Requirements | COVERED | D-210, D-217, D-411, D-413, D-464, INV-70, S12-01, S12-02 …+2 |
| S12-R18 | Requirements | COVERED | D-211, S12-05 |
| S12-R12 | Requirements | COVERED | D-215, S10-23, S11-21, S12-07, S12-08, S12-09, S12-10 |
| S12-R3 | Requirements | COVERED | D-213, D-217, D-400, D-464, INV-69, S1-12, S10-01, S11-01 …+5 |
| S12-R4 | Requirements | COVERED | D-212, S12-06 |
| S12-R15 | Requirements | COVERED IN PART: The line keeps its price after a rename and Priced by shows the current name (Story 12); Sales by Tier grouping a rename | S12-13 |
| S12-R19 | Requirements | COVERED | S10-08, S12-05 |
| S12-R17 | Requirements | COVERED | D-216, S12-22 |
| S12-R5 | Requirements | COVERED | S12-13, S12-14 |
| S12-R6 | Requirements | COVERED | D-214, INV-10, RPT-23, RPT-75, S12-10 |
| S12-R7 | Requirements | COVERED | INV-69, S12-15, S12-21 |
| S12-R8 | Requirements | COVERED | D-401, S12-16 |
| S12-R9 | Requirements | COVERED | S12-17 |
| S12-N2 | Negative Cases | COVERED IN PART: A part with no cost opening details at $0.00 is checked; a found part's typed price showing Manual (S11-E7) is the Story | S10-24, S12-18 |
| S12-N3 | Negative Cases | COVERED | INV-80, S12-19 |
| S12-E1 | Edge Cases | COVERED | S12-20 |
| S12-EH1 | Error Handling | NOT TESTABLE BY HAND: A failed price details load: a manual tester cannot make a load or save fail on purpose; listed for the developers' own  |  |
| S14-R2 | Requirements | COVERED IN PART: No repricing, the single-tier notice and its count, the Manual icon and the price details are checked; the notice for li | D-216, D-217, D-223, D-224, D-225, S12-22, S14-06, S14-08 |
| S14-R3 | Requirements | COVERED | S10-38, S11-14, S14-07 |
| S14-R4 | Requirements | COVERED | D-216, D-217, D-220, D-221, D-225, INV-43, S12-22, S13-05 …+8 |
| S14-R5 | Requirements | COVERED | D-216, D-217, D-221, D-223, D-225, S13-05, S14-03, S14-04 …+2 |
| S14-N1 | Negative Cases | COVERED | INV-43, S14-09 |
| S14-E1 | Edge Cases | COVERED | D-222, S12-22, S14-05, S14-08 |
| S14-EH1 | Error Handling | NOT TESTABLE BY HAND: Change Customer's failures ("exactly as they do today"): a manual tester cannot make a load or save fail on purpose; lis |  |
| S15-R5 | Requirements | COVERED | D-110, D-111, S15-01, S15-02, S15-03, S15-04, S15-05, S15-06 …+2 |
| S15-R2 | Requirements | COVERED | S15-03, S15-04 |
| S15-R3 | Requirements | COVERED | D-111, S15-03 |
| S15-N3 | Negative Cases | COVERED | S15-05 |
| S15-N4 | Negative Cases | COVERED | S15-02 |
| S15-N5 | Negative Cases | COVERED | INV-12, S15-06 |
| S15-EH1 | Error Handling | NOT TESTABLE BY HAND: The PRD states it does not apply ("the warning is calculated on screen and saves nothing"); there is nothing to look at. |  |
| S16-R6 | Requirements | COVERED IN PART: "No new permission appears in settings" is checked (Roles & Permissions); "any internal check engineering adds" is not v | S16-01 |
| S16-R2 | Requirements | COVERED | INV-72, S16-02, S16-18 |
| S16-R4 | Requirements | COVERED | S16-02, S16-03, S16-20 |
| S16-R8 | Requirements | COVERED | S16-15, S16-16 |
| S16-R5 | Requirements | COVERED IN PART: Hidden screens without each permission and a save refused after the permission is removed in a second session are checke | S16-04, S16-05, S16-14, S16-19 |
| S16-R11 | Requirements | COVERED | INV-55, S16-06 |
| S16-R7 | Requirements | COVERED | INV-93, S16-17 |
| S16-N1 | Negative Cases | COVERED | INV-56, S16-07 |
| S16-N4 | Negative Cases | COVERED | INV-79, S11-18, S16-08, S16-09, S16-10 |
| S16-N5 | Negative Cases | COVERED | S16-11, S16-12 |
| S16-E1 | Edge Cases | COVERED | S16-13 |
| S16-EH1 | Error Handling | COVERED | S16-05 |
| S19-R1 | Requirements | COVERED IN PART: The double-click guard, dialogs closing only with Cancel or the X, and the expired session are checked; the spinner itse | D-164, D-166, S19-01, S19-02, S19-03 |
| S19-R13 | Requirements | COVERED | S19-04 |
| S19-R14 | Requirements | COVERED | S19-04, S19-05, S3-31 |
| S19-R15 | Requirements | COVERED | D-36, S19-06 |
| S19-R3 | Requirements | COVERED | D-30, S19-07, S3-08, S3-45, S5-09, S6-12, S8-03 |
| S19-R5 | Requirements | COVERED IN PART: The Priced by column and price details naming the source in words are checked; the screen reader names of the Manual and | S19-08 |
| S19-R6 | Requirements | COVERED | S19-09, S2-16, S2-17 |
| S19-R7 | Requirements | NOT TESTABLE BY HAND: Loading skeletons show only while a page loads; on a normal connection they flash too briefly to judge, and slowing the  |  |
| S19-R10 | Requirements | NOT TESTABLE BY HAND: A failed load ("Ooooops! An error occurred" with Try again): a manual tester cannot make a load or save fail on purpose; |  |
| S19-R8 | Requirements | COVERED | S19-10, S19-11, S19-13 |
| S19-R12 | Requirements | NOT TESTABLE BY HAND: Keeping changes for all time can be seen only long after the release (ShopView's internal copy follows a 90-day cleanup, |  |
| S19-R19 | Requirements | COVERED | D-05, D-18, D-26, D-127, D-146, INV-77, S19-10, S19-11 …+6 |
| S19-R20 | Requirements | COVERED | S19-11, S19-12, S19-13 |
| S19-R21 | Requirements | COVERED | S19-11, S19-17 |
| S19-R22 | Requirements | COVERED | S19-18 |
| S19-R23 | Requirements | COVERED | S19-10, S19-11, S19-12, S19-13 |
| S19-R18 | Requirements | COVERED | S19-19, S6-13, S7-06, S9-05 |
| S19-R9 | Requirements | COVERED | D-30, D-173, D-412, S19-07, S19-20, S3-08, S5-09 |
| S19-E2 | Edge Cases | COVERED | S19-21, S19-22, S19-23 |
| S19-EH1 | Error Handling | NOT TESTABLE BY HAND: A failed save (today's error toast): a manual tester cannot make a load or save fail on purpose; listed for the develope |  |
| PERM-1 | Permissions table | COVERED | S16-14 |
| PERM-2 | Permissions table | COVERED | S16-16 |
| PERM-3 | Permissions table | COVERED | INV-55, S16-06 |
| PERM-4 | Permissions table | COVERED | S16-15 |
| PERM-5 | Permissions table | COVERED | S16-16 |
| PERM-6 | Permissions table | COVERED | S16-11 |
| PERM-7 | Permissions table | COVERED | S16-12 |
| PERM-8 | Permissions table | COVERED | S16-20 |
| PERM-9 | Permissions table | COVERED | INV-66, S16-20 |
| PERM-10 | Permissions table | COVERED | S16-04, S16-18 |
| PERM-11 | Permissions table | COVERED | INV-72, S16-19 |
| PERM-12 | Permissions table | COVERED | S16-17 |

| Tech-plan row | Verdict | Cases |
|---|---|---|
| TPX-07 | COVERED | INV-79, S16-09 |
| TPX-15 | COVERED | S19-21, S19-23 |
| TPX-17 | COVERED | D-189, S9-20 |
| TPX-19 | NOT TESTABLE BY HAND: The customer card's Pricing section skeleton shows only while it loads and its inline error only on a failed l |  |
| TPX-20 | COVERED | S9-38 |
| TPX-21 | COVERED | S12-21 |
| TPX-22 | COVERED | S19-17 |

## Invariants (folder "Must not change: today's pricing")

Each says where to run it: staging; the Tiered Pricing QA site too once it exists (`sv11692.qa.shopview.com` does not resolve); none needs
production. Today pictures attached as the baseline where one exists (6.1 pricing list, 7.1/7.2 categories, 9.25 Customers, 9.26 customer
page, 9.27 Edit Customer, 9.38 phone, 10.1 work order).

| Row | Verdict | Case |
|---|---|---|
| INV-44 General Matrix prices categories with no matrix | regression case | INV-44 (staging pre-release data) |
| INV-45 Uncategorized on the General Matrix; new parts start there | regression case | INV-45 |
| INV-46 matrix name 3-127, unique | regression case | INV-46 |
| INV-47 category name 3+, unique | regression case | INV-47 |
| INV-48 no gap or overlap | regression case | INV-48 |
| INV-49 Fixed Rules works as today | regression case | INV-49 |
| INV-50 tabs and matrix dialog | superseded (REPLACED) | story case S6-01 |
| INV-51 category fields kept | regression case | INV-51 |
| INV-52 Categories QuickBooks column | superseded (REMOVED) | S7-01, D-140 |
| INV-53 Parts group order | superseded (CHANGED) | S7-16 |
| INV-54 Bin Locations works | regression case | INV-54 |
| INV-55 Fixed Rules with Settings — Parts alone | regression case (invariant half) | INV-55 |
| INV-56 no Categories page without Settings — Parts | regression case | INV-56 |
| INV-57 delete blocked today | superseded (CHANGED) | S8-09 |
| INV-58 delete moves parts, removes QuickBooks mapping | regression case (QuickBooks sandbox) | INV-58 |
| INV-59 category from the inventory part dialog | regression case | INV-59 |
| INV-60 margin ≥ 100% converted | superseded (CHANGED) | phase 1 Story 3 margin case |
| INV-61 to INV-68 (customers) | regression cases | INV-61 … INV-68 |
| INV-69 to INV-75, INV-77, INV-79 (work order and Part Sale screens) | regression cases | INV-69 … INV-75, INV-77, INV-79 |
| INV-76 existing screens' load errors and empty states | **not written**: no PRD or TPX sentence the library can cite (LIB request #3) | — |
| INV-78 editable titles (maintenance editor, DVI builder) | **not written**: same reason | — |
| SV-3398 green "Fixed sell price" label | regression case | INV-101 |
| SV-3398 clearing a fixed price recalculates | regression case | INV-102 |
| SV-3411 category change mirrors to catalog and every location | regression case | INV-103 |

## Divergence register (Rule 130)

`register_rows_batch_a.json`: 42 rows (27 CLOSED, 1 NO-DIFFERENCE, 12 PO-CANDIDATE each with a held design-version case, 2 LATER-BATCH
left for batch B's pages). It replaces the 22 phase-1 rows handed to batch A: TPD-I03 (6.8 half; the 20.22 half is batch B's), I05, I06,
I08, I09, E14-E23, E26, E27, E28, E34, L02, L03 and L04 (split: pages 5-15 here, pages 10/11/13/20 left as LATER-BATCH rows). New rows close
both directions for pages 5-15 (column order and Matrices-list summaries by the PRD §7 precedence; toasts the PRD is silent on by the design;
the shortened Edit Customer stand-in by S9-R3; 9.18's question by the tech plan; 5.2/15.1's $50.01 as example data). `make_register.py`
was run locally; the register JSON itself is the coordinator's to commit. All in-scope rows are closed or held.

## PO question candidates (not sent; no sheet exists)

Each passed skill 07 §6.0 checks a-g (check h runs on the merged sheet):

| Q | About | Holds |
|---|---|---|
| Q20 | Matrices list Part Sale Matrix: "On or Off" (S6-R1) vs "Same as work orders" / rule summary (6.2) | D-129 |
| Q21 | No-match wording: Matrices, Categories, a tier's Customers tab (S6-R3, S7-R4, S9-N6 vs 6.10, 7.6, 9.2) | D-130, D-171 |
| Q22 | Category page: a line above the grid (S7-R15) vs an info-icon tooltip (7.9) | D-147 |
| Q23 | New Category buttons: Save (S8-R10, tech plan) vs Create Category (8.6) | D-165 |
| Q24 | Delete question missing a sentence (8.11); taken-name error adds "Click away to keep …" (8.4) | D-168 |
| Q25 | Uncategorized page: no matrix picker / read-only (S8-R4) vs grayed fields and an editable QuickBooks picker (8.3) | D-162 |
| Q26 | Customers tab channel filter: Work orders / Part Sales / Both (S9-R9, tech plan) vs Sales Type rows (9.3) | D-172 |
| Q27 | Manage Customers columns move on a search (9.12, 9.13): intended? | D-179 |
| Q28 | Counter Sale: tooltip (S9-R8) vs a blue info box (9.36) | D-185 |
| Q29 | Price details: matrix side and the Same as previous tier sentence (S12-R2, S12-R18) vs 12.1/12.2 | D-211 |
| Q30 | Change Customer notice counts Fixed price and Manual lines in the design (14.8) but not in the PRD (S14-R2) | D-224 |

## Open points

1. 11 PO candidates (Q20-Q30) unsent, to merge with phase 1's Q5-Q19, intake Q1/Q2/Q4 and batch B's Q40+ on one sheet for Matt Barge
   (Rules 66, 131, 132; skill 07 §6.0 h on the merged list).
2. Library requests (LIB-REQUESTS-BATCH-A.md): full-height pictures, PERM refs, an invariant source helper (INV-76, INV-78 unwritten), a
   bundled-step gate.
3. QA site address still unknown; INV cases say "staging, and the QA site once it exists".
4. Not testable by hand (listed for the developers/automation owner): forced failures (S6-EH1, S7-EH1, S8-EH1, S9-E6, S9-EH1, S12-EH1,
   S14-EH1, S19-R10, S19-EH1, TPX-19), loading skeletons (S19-R7), a 1,284-customer bulk save (S9-E2: would move every customer of the
   client), and the 90-day / all-time audit retention (S19-R12).
5. `proposals.json` and `DESIGN-DIVERGENCE-REGISTER.json` are rewritten by every build / register run and were not committed by batch A.

## OUTSTANDING — what I need from you

| What | Why | Recommendation |
|---|---|---|
| Merge and send the PO sheet (Q20-Q30 with phase 1 and batch B) | Rule 132; 12 design cases are held on them | One sheet for Matt Barge after check h on the merged list |
| Apply LIB requests 1-3 | full-height pictures, PERM refs, two unwritten invariants | Coordinator adds them; batch A cases are listed per request |
| Tiered Pricing QA site address | invariant cases name it | Ask engineering for the branch name |

**Waiting on the PO:** no sheet exists yet; nothing sent. Batch A candidates Q20-Q30 hold D-129, D-130, D-147, D-162, D-165, D-168, D-171,
D-172, D-179, D-185, D-211, D-224.
