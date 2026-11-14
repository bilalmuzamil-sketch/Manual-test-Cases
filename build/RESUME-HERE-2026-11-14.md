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
- RUNNING when the session paused: case-writing phase 1 (library in `tiered-pricing/authoring/` + Stories 1-4 + 11 linked tickets read +
  QA site address + design divergence register). If it did not finish, check `tiered-pricing/authoring/` for what landed (PHASE-1-REPORT.md
  is its final output) and restart phase 1 from there with the same brief (in the session transcript; summary: build tp_lib.py, common.py,
  design_refs.py, sections.json, build.py gates, AUTHORING-GUIDE.md; write Stories 1-4; register; gates; sample read; batch plan).
- NEXT: phase 2 = two parallel batches for Stories 5-19 + the reports PRD; then the PO question sheet for Matt Barge (shown to the QA lead
  first), gates, drafts and counts to the QA lead, write only after his yes, folder note on section 138770.

## Outstanding with the QA lead
Nothing waiting on him except the PO answers above. Remind him: the Atlassian connector uses a deprecated V1 endpoint (retired 1 Mar 2027).
