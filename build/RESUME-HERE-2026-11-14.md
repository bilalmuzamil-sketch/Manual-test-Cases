# Resume here — state at the end of 14 Nov 2026 (session near its usage limit)

Everything below is committed and pushed on branch `claude/slack-session-setup-7v5itm`. Nothing is waiting in /tmp except secrets
(TestRail key /tmp/testrail/creds.json — re-supplied per environment) and the 10 MB design viewer copies (not needed again).

## Written to TestRail today (all done, read back clean)
| Suite | What | Test links |
|---|---|---|
| A/R and A/P | PRD v13: 14 tester-visible cases updated, 8 new (C1145292-C1145299), run 557 489 tests, folder note | `ar-ap-report-sorting/demo-day-2026-11-13/TESTS-TO-RUN-2026-11-14.md` |
| Bill To | Story 8 named set: 32 updated, 8 new (C1145300-C1145307), S8-09 C1062367 deleted, run 558 322 tests, folder note; 28 cases tell testers to ignore old pictures | `founder-mode/bill-to/story8-2026-11-14/TESTS-TO-RUN-2026-11-14.md` |
| Internal Work Orders | PRD v1.4 named set: 34 updated, 54 new, run 559 663 tests, folder note; 14 cases tell testers to ignore old pictures | `founder-mode/internal-work-orders/po-answers-2026-11-12/TESTS-TO-RUN-v14-2026-11-14.md` |

Not written on purpose (QA lead's choice "named set only"): A/R 366 cases keep their PRD v12 From line; Bill To 332 keep their earlier From
line date; IWO 609 keep v1.3. Their quotes are word for word in the new versions.

## PO sheets changed today
- A/R (Chris): questions 19 and 21 withdrawn, rows deleted, copies in `ar-ap-report-sorting/questions-withdrawn-2026-11-14/`. Open: 18, 20, 22.
- IWO (Milos): question 18 corrected in place (before-copy kept); questions 19-20 added (rows 26-28, light orange). Open: 17-20.
- Bill To (Chris): open 1-10, 12-17. Open list: `build/PO-QUESTIONS-OPEN.md`.

## Tiered Pricing (new suite, IN PROGRESS — nothing in TestRail yet)
- Format: quotes and design references NO (Rule 117 sixteenth amendment); pictures attached; refs = ticket + PRD story/requirement.
- Project type: upgrade; "must not change" cases in their own folder, run on staging (QA site too where possible), production only if neither.
- DONE: sources (`tiered-pricing/SOURCES-REPORT.md`, REQUIREMENTS-MAP.md, requirements.json, INVARIANTS.md, NUMBERS-AND-HAZARDS.md,
  PO-QUESTIONS-DRAFT.md, TICKET-SWEEP.md), full design drive (`design-2026-11-14/DESIGN-DRIVE-PROOF.md`), tool files read
  (TOOL-FILES-READ-2026-11-14.md, QA lead "Read them too"), 11 Today screenshots (`design-2026-11-14/images/today/`), design version
  1794638838-cd70 checked = content-identical (DESIGN-VERSION-CHECK-1794638838-cd70.md).
- PHASE 1 DONE (14 Nov 2026): 258 cases for Stories 1-4 in `tiered-pricing/authoring/` (proposals.json), build.py 0 PROBLEM lines,
  readiness 0 hard problems, 26 held (16 design-version on draft Q5-Q19, 2 on Q2, 8 pre-release on Stories 1/3), 501 pictures assigned,
  register DESIGN-DIVERGENCE-REGISTER.json 102 rows (72 closed/held for S1-4, 30 for the batches), 11 linked tickets saved, QA site not found
  (sv11692.qa.shopview.com does not resolve). Read `authoring/PHASE-1-REPORT.md` and `authoring/AUTHORING-GUIDE.md` first.
- NEXT, phase 2, two parallel workers, each owning only its own cases_*/verdicts_*/po_questions_*/register_rows_* files (listed in
  PHASE-1-REPORT.md): Batch A = Stories 5, 6, 7, 8, 9, 12, 14, 15, 16, 19, invariant sections B, C, D, design pages 5-9, 12, 14, 15
  (193 rows, 105 boards). Batch B = Stories 10, 11, 13, 17, 18, the reports PRD, invariant sections A, E, F, design pages 10, 11, 13, 20
  (221 rows, 46 boards). Same format and rules as phase 1 (its brief is summarised in PHASE-1-REPORT.md and the guide).
- THEN: TICKET-LEDGER verdicts, one PO question sheet for Matt Barge (merge Q2, Q5-Q19 and the batches' questions; run the skill 07 checks;
  show the QA lead before sending), gates + sample read, drafts and counts to the QA lead, TestRail write only after his yes (create the
  folders under 138770, cases, pictures, a run assigned to Mudassir, folder note).

## Outstanding with the QA lead
Nothing waiting on him except the PO answers above. Remind him: the Atlassian connector uses a deprecated V1 endpoint (retired 1 Mar 2027).
