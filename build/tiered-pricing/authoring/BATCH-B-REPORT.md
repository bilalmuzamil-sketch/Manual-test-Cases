# Tiered Pricing — batch B report (lines, accounting and reports), 14 Nov 2026

**Nothing was written to TestRail, Jira, Slack or Google.** Drafts only; folders planned in `sections.json`. Files (batch B owns only these):
`cases_s10.py`, `cases_s11.py`, `cases_s13.py`, `cases_s17.py`, `cases_s18.py`, `cases_rpt.py`, `cases_inv_b.py`, `cases_design_batch_b.py`,
`verdicts_batch_b.py`, `po_questions_batch_b.py`, `register_rows_batch_b.json`. No shared file was edited; no library change was needed
(no `LIB-REQUESTS-BATCH-B.md`). `make_register.py` was run to merge the register rows; the regenerated `DESIGN-DIVERGENCE-REGISTER.json` and
`proposals.json` are shared outputs and were **not** committed by batch B (the coordinator commits them after both batches).

## Counts

| Folder | Cases | Held |
|---|---|---|
| Story 10: How a part is priced | 38 (+1 in the waiting folder) | 2 (S10-33 timing part, S10-37 pre-release data) |
| Story 11: When a part is priced again | 43 | 0 |
| Story 13: Part Sales | 6 | 0 |
| Story 17: Reports and totals stay consistent | 6 | 0 |
| Story 18: Accounting and QuickBooks | 7 | 1 (S18-06 AccountingHub where connected) |
| Sales by Tier and Sales by Category | 75 (+1 in the waiting folder) | 0 |
| Must not change: today's pricing (§A, §E, §F) | 48 | 3 (INV-85, INV-87 pre-release data; INV-83 AccountingHub where connected) |
| Design — how it looks (D-400…D-465) | 45 | 9 design versions (Q40, Q41, Q44, Q4, Q42 ×5) |
| Waiting on Matt Barge's answers | 2 (S10-39 on Q1, RPT-63 on Q4) | 2 |
| **Total batch B** | **270** | **17** |

Design cases: 28 screen/state cases, 4 held design versions, 5 held movement cases (Q42), 2 settled movement cases, 6 stress cases. Rule 116
number cases: 155 flagged `numbers` (arithmetic shown; registry `verdicts_batch_b.NUMBERS`, 56 entries from NUMBERS-AND-HAZARDS.md N1-N6, N10,
R1-R14). Pictures: 429 attachments, 54 distinct (39 of the 41 non-Today boards of pages 10, 11, 13, 20 attached, every one viewed when assigned, plus Today pictures
10.1, 10.2, 10.3, 13.1, 14.1, 20.1 and 2.1; boards 10.1-10.3, 13.1, 20.1 are attached as `today:` pictures; 10.4 and 13.2, the prototype's entry
lists, are explained in UNUSED_BOARDS and register TPD-B410).

Where each invariant runs (QA lead, 14 Nov 2026): every INV case opens with its place — staging, the QA site too once the release is there;
history rows (INV-10, INV-85, INV-87) need staging's pre-release data; **only INV-83 (and S18-06) may need the production test account after the
release, read only, if staging has no AccountingHub connection.** The QA site `sv11692.qa.shopview.com` still does not resolve (phase 1).

## Gates (run 14 Nov 2026, Batch A's files present)

- `python3 build.py`: **PROBLEM lines: 0** (817 cases in the merged suite at the last run).
- `python3 build/testing-tools/tester_readiness_check.py build/tiered-pricing`: **0 hard problems** (3 found in batch B on the first run —
  "Make sure" for tiers the test makes, S10-08, S10-09, RPT-26 — rewritten as "Note that tiers … are made one right after another").
- Coverage self-check (RPT and TPX rows are not gated by build.py's story check): 139 PRD rows + 25 tech-plan rows, **0 without a verdict**.

## Sample read (Rule 138)

15 random batch B cases (seed 1115) and all 45 batch B "does not / never" results read in full. Every negative has a visible control in its own
step. Fixed: S10-23 "Point at the part's sell price" with two parts on the line (now names the $30.00 part); RPT-15 a work order of only a
−$5.00 part might not invoice (labor added so the invoice total is positive); RPT-75 "Its lines are listed there" (now a figure); RPT-63's held
order result read backwards (rewritten); RPT-42 expected a plain "Sales Type" chip (the reports PRD says "Sales Type: All": corrected, the
design's label-only chip moved into held D-440). Earlier gate fixes: steps bundling two actions ("Click Delete in the page's three-dot menu"),
closed lists ("only") without a closing source, records not used, a tech-plan quote that was the requirement map's paraphrase (TPX-01, TPX-36:
replaced by the plan's own words or dropped).

## Coverage per row (stories 10, 11, 13, 17, 18; reports PRD; tech-plan rows)

| Row | Verdict and cases |
|---|---|
| TP-S10-R1 | COVERED — S10-01, S10-02, S10-03, S10-04, S10-05, S10-06, S10-07, S10-08 …+96 |
| TP-S10-R17 | COVERED — S10-11, S10-19, D-401, INV-03, INV-13 |
| TP-S10-R18 | COVERED — S10-18 |
| TP-S10-R19 | COVERED — S10-02, INV-01, INV-03 |
| TP-S10-R20 | COVERED — S10-01, S10-03, S10-07, S10-08, S10-16, S10-17, S10-20, S10-30 …+4 |
| TP-S10-R21 | COVERED — S10-12 |
| TP-S10-R2 | COVERED — S10-10, S17-06 |
| TP-S10-R3 | COVERED — S10-13, INV-05, INV-12 |
| TP-S10-R4 | COVERED — S10-03, S10-04, S10-05, S10-06, S10-07, INV-08 |
| TP-S10-R5 | COVERED — S10-04, S10-13, S10-14 |
| TP-S10-R15 | COVERED — S10-15 |
| TP-S10-R6 | COVERED — S10-05 |
| TP-S10-R7 | COVERED — S10-05 |
| TP-S10-R11 | COVERED — S10-20 |
| TP-S10-R16 | COVERED — S10-21, INV-14 |
| TP-S10-R12 | COVERED — S10-22 |
| TP-S10-R13 | COVERED — S10-23, INV-23, RPT-22 |
| TP-S10-R14 | COVERED IN PART — Everything but a reopened paid work order is checked (S10-34 to S10-38); which tier prices parts added after reopening is held on Q1 (S10-39). — S10-34, S10-35, S10-36, S10-37, S10-38, S10-39, RPT-08 |
| TP-S10-R22 | COVERED IN PART — The fill is observed; the 0.3-second target at the largest client's size is an engineering measurement (S10-33 marked HOLD for that part). — S10-33 |
| TP-S10-N1 | COVERED — S10-24, S10-25, S10-26, D-404, S11-01 |
| TP-S10-N2 | COVERED — S10-27 |
| TP-S10-E2 | COVERED — S10-28, D-407 |
| TP-S10-E3 | COVERED — S10-29 |
| TP-S10-E4 | COVERED — S10-30, INV-36 |
| TP-S10-E7 | COVERED — S10-31, INV-37 |
| TP-S10-E5 | COVERED — S10-32 |
| TP-S10-E6 | COVERED — S10-23, INV-22 |
| TP-S10-E8 | COVERED — S10-09 |
| TP-S10-EH1 | NOT TESTABLE BY HAND — States that pricing has no error handling of its own ("Not applicable: pricing runs when a part is saved on a line"); nothing to look at. |
| TP-S11-R1 | COVERED — S11-01 |
| TP-S11-R2 | COVERED — INV-09, S11-02, S11-03 |
| TP-S11-R16 | COVERED — INV-18, S11-04, S11-05 |
| TP-S11-R12 | COVERED — D-406, INV-28, S11-06, S11-07, S11-08, S11-09 |
| TP-S11-R3 | COVERED — INV-09, S11-10, S11-11 |
| TP-S11-R4 | COVERED — INV-17, S11-12 |
| TP-S11-R5 | COVERED — S10-16, S10-22, D-407, INV-01, S11-04, S11-05, S11-12, S11-13 |
| TP-S11-R6 | COVERED — S10-36, INV-42, S11-03, S11-14, S11-15, S11-16, S11-43, S18-02 |
| TP-S11-R7 | COVERED IN PART — Quick Add, the inline row, catalog search, the part request modal, Tech View, the phone part request, canned lines (tier and Default work orders, no-c… — INV-38, INV-40, S11-17, S11-18, S11-19, S11-20, S11-21, S11-23 |
| TP-S11-R14 | COVERED — INV-29, S11-24 |
| TP-S11-R8 | COVERED — INV-25, S11-25 |
| TP-S11-R9 | COVERED — D-410, D-411, D-442, INV-10, INV-11, S11-26, S11-27, S11-28 …+3 |
| TP-S11-R15 | COVERED — D-410, D-442, S11-31 |
| TP-S11-R10 | COVERED — INV-27, S11-33 |
| TP-S11-N1 | COVERED — INV-26, S11-09, S11-34, S11-35 |
| TP-S11-N2 | COVERED — S11-36 |
| TP-S11-E2 | COVERED — INV-34, S11-37 |
| TP-S11-E8 | COVERED — S11-22 |
| TP-S11-E7 | COVERED — INV-21, S11-38 |
| TP-S11-E5 | COVERED — S10-07, D-403, INV-20, S11-39 |
| TP-S11-E6 | COVERED — D-408, D-409, INV-41, S11-40, S11-41, S11-42, S13-06 |
| TP-S11-EH1 | NOT TESTABLE BY HAND — States that repricing has no error handling of its own ("Not applicable"); nothing to look at. |
| TP-S13-R1 | COVERED — S10-18, D-412, D-413, INV-42, S11-09, S11-43, S13-01, S13-02 …+4 |
| TP-S13-E1 | COVERED — S13-05 |
| TP-S13-EH1 | NOT TESTABLE BY HAND — States "Not applicable beyond Part Sales' own errors, as today"; nothing new to look at. |
| TP-S17-R1 | COVERED — S17-01, S17-02 |
| TP-S17-R2 | COVERED — S17-03 |
| TP-S17-R5 | COVERED — S17-04 |
| TP-S17-R3 | COVERED — INV-85, INV-87, S17-05 |
| TP-S17-N1 | NOT TESTABLE BY HAND — States there is no negative case ("None. Totals only read saved prices, so there is nothing to refuse."). |
| TP-S17-E1 | COVERED — INV-15, S17-06 |
| TP-S17-EH1 | NOT TESTABLE BY HAND — States "Not applicable: totals and reports behave as today"; nothing new to look at. |
| TP-S18-R1 | COVERED — INV-81, S18-01, S18-02 |
| TP-S18-R3 | COVERED — INV-81, S18-03, S18-04 |
| TP-S18-R5 | COVERED — S18-05 |
| TP-S18-R6 | COVERED IN PART — Checked where AccountingHub is connected (staging, else the production test account after release, read only). — INV-83, S18-06 |
| TP-S18-R4 | NOT TESTABLE BY HAND — The Open API is checked with API calls, not in the product screens (Rule 114): listed for the automation owner (INV-84). |
| TP-S18-N1 | COVERED — INV-82, S18-07 |
| TP-S18-N2 | NOT TESTABLE BY HAND — What internal and no-charge work orders send is set by the Internal Work Orders PRD (skill 07 §6.0 f: another owner); this suite holds no expected res… |
| TP-S18-EH1 | NOT TESTABLE BY HAND — Sync failures: a manual tester cannot make the server fail on purpose; listed for the developers' and the automation owner's checks (Rule 114, lesson … |
| RPT-S1-R1 | COVERED — INV-88, INV-90, INV-91, INV-92, RPT-01 |
| RPT-S1-R2 | COVERED — RPT-02, RPT-03, RPT-06, RPT-37 |
| RPT-S1-R3 | COVERED — RPT-03, RPT-04, RPT-05 |
| RPT-S1-R6 | COVERED — D-414, D-450, D-451, D-456, D-460, D-461, D-462, RPT-06 …+2 |
| RPT-S1-R7 | COVERED IN PART — The tie-out to Sales by Customer is checked; "engineering lists ... the owning PM signs off each" is a process step (TPX-39). — D-456, INV-86, RPT-03, RPT-04, RPT-07, RPT-13, S17-05 |
| RPT-S1-R8 | COVERED — RPT-08, RPT-09, RPT-12 |
| RPT-S1-R9 | COVERED — RPT-10 |
| RPT-S1-R10 | COVERED — RPT-11 |
| RPT-S1-R11 | COVERED — D-440, D-460, RPT-12 |
| RPT-S1-R12 | COVERED — D-456, RPT-13 |
| RPT-S1-R13 | COVERED — RPT-14 |
| RPT-S1-R14 | COVERED — D-422, RPT-16, RPT-59 |
| RPT-S1-N1 | COVERED — D-420, RPT-17 |
| RPT-S1-N2 | COVERED — INV-93, RPT-18 |
| RPT-S1-E1 | COVERED — RPT-19 |
| RPT-S1-E2 | COVERED — RPT-20 |
| RPT-S1-E4 | COVERED — RPT-21, RPT-22, RPT-23 |
| RPT-S1-E5 | COVERED — RPT-24 |
| RPT-S1-E6 | COVERED — RPT-25 |
| RPT-S1-E7 | COVERED — RPT-26 |
| RPT-S1-E8 | COVERED — INV-86, RPT-27, RPT-28, RPT-29, RPT-30, RPT-76 |
| RPT-S1-E9 | COVERED — RPT-31 |
| RPT-S1-EH1 | NOT TESTABLE BY HAND — Report load failure: a manual tester cannot make the server fail on purpose; listed for the developers' and the automation owner's checks (Rule 114, l… |
| RPT-S2-R1 | COVERED — D-415, D-450, RPT-32 |
| RPT-S2-R2 | COVERED — D-415, D-450, D-461, RPT-32, RPT-33, RPT-34, RPT-50, RPT-54 |
| RPT-S2-R3 | COVERED — D-415, D-450, RPT-32, RPT-35 |
| RPT-S2-R4 | COVERED — RPT-32 |
| RPT-S2-R5 | COVERED — RPT-19 |
| RPT-S2-N1 | COVERED — RPT-36 |
| RPT-S2-E1 | NOT TESTABLE BY HAND — A customer can't be deleted while they have work orders or Part Sales (Tiered Pricing S9-E3), so a tester can't make a customer with invoices deleted;… |
| RPT-S2-EH1 | NOT TESTABLE BY HAND — A row's customers or invoices failing to load: a manual tester cannot make the server fail on purpose; listed for the developers' and the automation o… |
| RPT-S3-R1 | COVERED — D-420, RPT-17, RPT-23, RPT-37, RPT-38, RPT-41 |
| RPT-S3-R3 | COVERED — D-416, D-440, D-460, RPT-05, RPT-39 |
| RPT-S3-R9 | COVERED — D-417, D-441, D-462, RPT-40 |
| RPT-S3-R4 | COVERED — D-415, D-417, D-450, D-461, RPT-16, RPT-41, RPT-57, RPT-61 |
| RPT-S3-R5 | COVERED — D-419, D-426, D-427, RPT-42, RPT-63 |
| RPT-S3-R2 | COVERED — D-418, RPT-36, RPT-43, RPT-44, RPT-45, RPT-46 |
| RPT-S3-R10 | COVERED — RPT-47 |
| RPT-S3-R12 | COVERED — D-418, D-419, D-440, D-454, RPT-48 |
| RPT-S3-R6 | COVERED — RPT-45, RPT-49 |
| RPT-S3-R11 | COVERED — RPT-50 |
| RPT-S3-R7 | COVERED — RPT-51, RPT-52 |
| RPT-S3-R8 | COVERED — D-421, D-455, RPT-16, RPT-50, RPT-52, RPT-53, RPT-54, RPT-59 |
| RPT-S3-N1 | COVERED — D-426, D-427, D-451, RPT-42, RPT-55, RPT-64 |
| RPT-S3-E1 | COVERED — RPT-56 |
| RPT-S3-EH1 | NOT TESTABLE BY HAND — States "Not applicable beyond the report's own load error"; nothing to look at. |
| RPT-S4-R1 | COVERED — D-424, D-425, D-463, RPT-57 |
| RPT-S4-R2 | COVERED — RPT-58 |
| RPT-S4-R3 | COVERED — D-440, D-463, RPT-59 |
| RPT-S4-R4 | COVERED — RPT-19 |
| RPT-S4-R5 | COVERED IN PART — The PDF limit and its message are checked on a staging location with more than 2,000 rows; the CSV limit (50,000 rows) can't be reached by hand. — D-424, RPT-60 |
| RPT-S4-R6 | COVERED — D-425, INV-86, RPT-61 |
| RPT-S4-R7 | COVERED IN PART — The header lines' content and wording are checked (RPT-62); their ORDER (Category before Priced By) is held on Q4 (RPT-63, D-443). — D-425, D-443, RPT-62, RPT-63 |
| RPT-S4-N1 | COVERED IN PART — The PDF refusal with no file is checked on a staging location with more than 2,000 rows (RPT-60); the CSV refusal needs 50,001 rows, which a tester ca… — RPT-60 |
| RPT-S4-N2 | COVERED — D-426, RPT-64 |
| RPT-S4-E1 | COVERED — RPT-14 |
| RPT-S4-EH1 | NOT TESTABLE BY HAND — Download failure: a manual tester cannot make the server fail on purpose; listed for the developers' and the automation owner's checks (Rule 114, less… |
| RPT-S5-R1 | COVERED — D-423, D-452, RPT-65, RPT-76 |
| RPT-S5-R2 | COVERED — D-423, D-452, D-462, RPT-65, RPT-66 |
| RPT-S5-R3 | COVERED — RPT-65 |
| RPT-S5-R4 | COVERED — D-423, RPT-67 |
| RPT-S5-R5 | COVERED — RPT-68 |
| RPT-S5-R6 | COVERED — RPT-69 |
| RPT-S5-N1 | COVERED — RPT-70 |
| RPT-S5-E1 | COVERED — RPT-71 |
| RPT-S5-E2 | COVERED — RPT-65 |
| RPT-S5-E3 | COVERED — RPT-72, RPT-73 |
| RPT-S5-E4 | COVERED — RPT-74 |
| RPT-S5-E5 | COVERED — RPT-75 |
| RPT-S5-EH1 | NOT TESTABLE BY HAND — Sales by Category load failure: a manual tester cannot make the server fail on purpose; listed for the developers' and the automation owner's checks (… |
| TPX-01 (→ TP-S10-R14) | HELD on Q1 — S10-39 |
| TPX-04 (→ TP-S11-R12) | COVERED — S11-08 |
| TPX-05 (→ TP-S11-R4, TP-S11-R5) | COVERED — S11-12 |
| TPX-06 (→ TP-S10-N1) | COVERED — S10-25, S10-26 |
| TPX-08 (→ TP-S10-R17) | COVERED — S10-19 |
| TPX-09 (→ TP-S11-R9, TP-S11-R15) | COVERED — S11-32 |
| TPX-10 (→ TP-S11-R6) | COVERED — INV-42, S11-43 |
| TPX-23 (→ RPT-S3-R1) | COVERED — RPT-37 |
| TPX-24 (→ RPT-S3-R2, RPT-S3-R12) | COVERED — RPT-48 |
| TPX-25 (→ RPT-S3-R12, RPT-S3-R5) | COVERED — RPT-42 |
| TPX-26 (→ RPT-S1-R14) | COVERED — RPT-16 |
| TPX-27 (→ RPT-S2-R3, RPT-S3-R8) | COVERED — RPT-35 |
| TPX-28 (→ RPT-S3-R2, RPT-S4-R4) | COVERED — RPT-19, RPT-43 |
| TPX-29 (→ RPT-S3-R4) | COVERED — RPT-41 |
| TPX-30 (→ RPT-S1-R13, RPT-S4-E1) | COVERED — RPT-14 |
| TPX-31 (→ RPT-S4-R7) | COVERED IN PART — The all-wording is checked (RPT-62); the line order is held on Q4 (RPT-63). — RPT-62 |
| TPX-32 (→ RPT-S4-R2, RPT-S4-R6) | COVERED — RPT-58 |
| TPX-33 (→ RPT-S1-E8) | COVERED — RPT-30, RPT-76 |
| TPX-34 (→ RPT-S3-R8, RPT-S2-R1) | COVERED — RPT-54 |
| TPX-35 (→ RPT-S2-EH1) | NOT TESTABLE BY HAND — Loading the next 30 rows failing: a manual tester cannot make the server fail on purpose; listed for the developers' and the automation owner's checks… |
| TPX-36 (→ RPT-S1-EH1, RPT-S1-N1) | NOT TESTABLE BY HAND — Both halves are timing or failure states: "no empty state shows before the first load finishes" is a moment too short to judge by eye, and "a failed l… |
| TPX-37 (→ RPT-S3-R11, RPT-S3-R2) | COVERED — RPT-46, RPT-50 |
| TPX-38 (→ RPT-S1-R7, RPT-S1-R3) | NOT TESTABLE BY HAND — Held by engineering (tech plan 2 Phase 2 has not reported whether imported invoices with no part lines exist); nothing a tester can set up; listed in … |
| TPX-39 (→ RPT-S1-R7) | NOT TESTABLE BY HAND — A process step (the RPT-S1-R7 list of invoices that don't add up, tech plan 2 Appendix C, empty on 14 Nov 2026): no screen to test. |
| TPX-40 (→ RPT-S1-E4, TP-S10-R13) | COVERED — RPT-22 |

## Invariants (INVARIANTS.md §A 43, §E 5, §F 9 = 57)

- **Regression cases (48):** INV-01, 02, 03, 05-18, 20-23, 25-29, 34-38, 40-43, 80-83, 85-93 (folder "Must not change: today's pricing").
- **Superseded (7), covered by new-behaviour cases:** INV-04 → S10-14; INV-19 → Story 1 release-day cases (phase 1); INV-24 → RPT-73; INV-30 → S11-13;
  INV-31 → S10-19; INV-32 → S10-25; INV-33 → S11-07, S11-08.
- **Not testable by hand (2):** INV-39 (a Maintenance Reminder canned line copied at another location: known only from engineering's code read);
  INV-84 (Open API: automation owner). INV-82's failure half is a forced failure (the no-integration half is checked).

## Divergence register (Rule 130) — rows TPD-B401…B422

22 rows, all in scope and closed or held: 13 CLOSED / NO-DIFFERENCE (precedence or a PRD sentence named, with the case), 5 PO candidates each holding
a case. Replaced phase-1 LATER-BATCH rows: TPD-I04, TPD-E24, E25, E29-E33, TPD-L01. TPD-I03's 20.22 part is closed by TPD-B401 (I03 itself was
already closed). **TPD-L03 and TPD-L04 are shared with batch A**: batch B added its parts (TPD-B414 movements of pages 10, 11, 20 → Q42; TPD-B415
stress of pages 10, 13, 20 → closed by the reports PRD Key Decision "the columns fit without sideways scrolling") without replacing the row,
so batch A's parts are not dropped; the coordinator replaces L03/L04 once both batches' rows exist. Both directions were checked: PRD → design for
the quoted texts of stories 10, 11, 13 and the reports PRD (TPD-B421, B422: design-silent states follow the PRD), design → PRD by hand from every
page-10/11/13/20 dialog, toast, panel, empty state and picture (proof §6, §6b, §6c, §7b, §8).

## Question candidates (not sent; skill 07 §6.0 checks a-h)

| Q | About | Holds | §6.0 record |
|---|---|---|---|
| Q1 (intake) | reopened paid work order: which tier | S10-39 (TPX-01) | intake record stands (money; tech plan contradicts the PRD's general rule) |
| Q4 (intake) | download header lines: Category before Priced By (PRD) or after (design 20.20) | RPT-63, D-443 | intake record stands; merged with TPD-L01/E33 (one question) |
| Q40 | report labels: PRD "2 · Fleet", "(archived)", "Sales Type: All"; design shows names only and plain chip labels (20.2-20.5, 20.9, 20.20) | D-440 | a: the reports PRD's "Design wording is binding: the labels and messages here ship as written" can be read for either side, so it does not settle it · b: PRD text, but the design disagrees (Rule 130) · c: sources disagree · d: n/a · e: testable · f: Product · g: label format on every row and export, not one word · h: kept |
| Q41 | Category filter: Uncategorized first (PRD) or in A-to-Z (design 20.7) | D-441 | a: no precedence sentence on order · b/c: PRD and design disagree · e: testable · f: Product · g: behaviour (order) · h: kept |
| Q42 | layout moves with no source (Sales by Tier 58-94 px, empty states 20-36 px, Sales by Category 5-10 px, chips, Quick Add 19-71 px) | D-450…D-454 | a: PRD v37 §7 says layout follows the canvas, but whether a move is intended is not settled (as phase 1's Q18) · c: no source speaks · e: testable by screenshots · g: behaviour (layout stability, L-21) · h: coordinator may merge with Q18 |
| Q44 | after receiving: PRD's notice "Updating the cost also updates the sell price." and nothing about tiers (S11-R15) vs design's toast "Part received / $80.00 each, Tier 2." (11.7) | D-442 | a: no precedence sentence · b/c: PRD and design disagree · e: testable · f: Product · g: what the user sees after receiving (tier shown or not) · h: kept |
| (dropped) Location "Clear selection" (20.8) | — | — | g: behaviour settled by RPT-S3-R12 (chip always holds a location); register TPD-B416 |
| (merged) plain "Sales Type" chip vs "Sales Type: All" | — | — | merged into Q40 (same kind of label difference) |

## Open points

1. **Waiting on the PO (Rule 132):** no sheet exists yet for Tiered Pricing. Batch B candidates Q40, Q41, Q42, Q44 plus intake Q1 and Q4; cases held:
   S10-39 (Q1), RPT-63 and D-443 (Q4), D-440 (Q40), D-441 (Q41), D-450-D-454 (Q42), D-442 (Q44). One merged sheet for Matt Barge after the
   coordinator's check h.
2. Pre-release data: S10-37, INV-85 and INV-87 need data noted or made on staging **before** the release reaches staging (same decision as phase 1's 8 cases).
3. AccountingHub: S18-06 and INV-83 run on staging only if AccountingHub is connected there; otherwise the production test account after the release (read only).
4. Not testable by hand and listed for the developers / automation owner: forced failures (S18-EH1, RPT EH rows, TPX-35, TPX-36), the CSV 50,000-row
   limit, the Open API (S18-R4, INV-84), the 0.3-second fill target, a deleted customer with invoices (RPT-S2-E1, blocked by S9-E3), ShopCoach and
   Maintenance Reminder canned lines (S11-R7 part), INV-39.
5. TPX-38 (imported invoices with no part lines) waits on engineering's Phase 2 report; TPX-39 / RPT-S1-R7's tie-out exception list (tech plan 2
   Appendix C) is still empty — historical parity checks must exclude its invoices once it exists.
6. Labels a tester needs that no source names exactly (written in plain words, to be confirmed on the build): how a part is marked as warranty,
   the Move action between Part Sales, the inspection-to-line action, Purchase Order Receive's preview — all are existing ShopView flows the PRD names.
7. Reading coverage: reports PRD v21 read in full (35,271 bytes, 100%); PRD v37 stories 10, 11, 13, 17, 18, Out of Scope and "Pricing today" read in
   full through their requirement rows and text; tech plans 1 and 2 were read in full at intake (notes in `sources/notes/`, 100% recorded there) —
   batch B read the tech plan 2 notes in full and the tech-plan passages each TPX row rests on; design pages 10, 11, 13, 20: every board's text
   (render log) and every picture viewed.

## OUTSTANDING — what I need from you

| What | Why | Recommendation |
|---|---|---|
| Send the merged PO sheet (Q1, Q2, Q4, Q5-Q19, batch A's Q20-Q39, batch B's Q40-Q44) | 17 batch B cases wait on answers (Rule 132) | Coordinator runs check h on the merged list, merges Q42 with Q18, then one sheet to Matt Barge |
| Pre-release data on staging (S10-37, INV-85, INV-87, plus phase 1's 8) | they compare before and after the release | Ask engineering whether staging already has the release; if yes, use the QA site with a copy of pre-release data |
| AccountingHub on staging? | decides whether S18-06 / INV-83 run on staging or the production test account | Ask engineering; production test account only as a read-only fallback after the release |

**Waiting on the PO:** no sheet exists yet for Tiered Pricing; nothing has been sent. Batch B holds S10-39 (Q1), RPT-63 and D-443 (Q4), D-440 (Q40),
D-441 (Q41), D-450-D-454 (Q42), D-442 (Q44).
