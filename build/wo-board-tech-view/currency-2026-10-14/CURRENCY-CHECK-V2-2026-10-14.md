# WO Board and Tech View — Testing Suite Currency Check V2, 14 Oct 2026

Run as **V2** (QA lead's choice). **No TestRail write.** Skill: `build/skills/22-TESTING-SUITE-CURRENCY-CHECK-V2.md`.
Owner (QA lead, 14 Oct): "For this testing suite: I own ALL the test cases as it is mainly my Testing Suite. No matter what
Vladimir comments in the stories, I have to make sure that all the test cases are in good shape and current."

## Deliverables (Google Sheets, read back: 231 of 231 filled cells as written — QA 164, PO 67)
- **QA file:** "WO Board and Tech View Feature Squad – Test cases with changed behaviour – for Bilal Muzamil (14 Oct 2026)"
  https://docs.google.com/spreadsheets/d/16BP5SASXHUGsGZAXMdJ9Efy8Z8MDJfnHmGORY2b3x6c/edit
  Read me · Test cases to update (5) · New test cases needed (3) · Need product decision first (6).
- **PO file:** "WO Board and Tech View Feature Squad – Questions on the spec and design – for Chris Ward (14 Oct 2026)"
  https://docs.google.com/spreadsheets/d/1gBGmNB4B1bRrD2ZJvBn1tuvbfxFPjcsKddz_I5H3CvU/edit — 11 questions, colour-coded.
- Builder `notify/build_wo_v2.py` → `notify/sheet-data.json`; "before" columns copied by script from `snapshots-before/`.

## Sources — `SOURCE-CHECK-2026-10-14.md`, `PRD-DIFF-2026-10-07-vs-now.md`, `../design-drive-2026-10-14/`
PRD 845185030 v42 → **v48** (8–12 Oct, Chris Ward): 5 codes added, 1 removed (S4-N9), 5 reworded, 215 identical; Change Log
empty, dates from page history. Review Decisions 853901313 unchanged (v13, 29 Sep). 88 comments, none after 7 Oct. 57 Jira
issues updated. Tech plan unchanged. Design 14 Oct: new "Work Orders Details" board (List row-click preview panel), Add
Part read-only mode, one new screenshot; Rule 124 gates all passed (573 elements, 1,908 texts / 0 unclassified, 16 flows).

## Behaviour-first result (258 live cases)
| Case | Change | Fix |
|---|---|---|
| C154648 (ours, manual) | v48 exact Imported tooltips (S1-R13a/b) | expect the two exact tooltips |
| C368133 (ours, automated) | v47 S4-R28 "covers every current line" | give work order C two lines |
| C96965 (ours, manual) | v47 S4-R28 | give [WO-1]/[WO-2] two lines |
| C236975, C236976 (Vladimir, automated) | v47 S4-R28 | two lines in setup |
Already current: C96923, C368131 (Vladimir), C154884 (setup). Wording-only (left out): C96963, C97009, C368158 quote old
S4-N2. Adversarial: C96960/61/C368140/C368168 have no Schedule-shift-only line (→ new test); one-line Schedule booking fact
from C368178.
New tests: filtered empty state (S1-N1a), search-only empty state (S1-N1b) — C96918 removed; Schedule-shift line follows the
new lead (S4-R8 note, v46). Not proposed: C368149 concurrency (deleted 12 Oct on the QA lead's instruction, SV-11119
Obsolete); SV-11087 timesheet rules (bugfix release); C368160/62/64 design-only controls (→ PO question 11).
W-1..W-16 (8 Oct register) NOT folded in: handed to the build verification session on 8 Oct; W-3 and W-13 now answered by
the spec (design still differs → PO question 10).

## After the check (14 Oct, later)
- PO sheet shared with Chris Ward (chris.w@shopview.com — Slack profile; NOT chris@shopview.com, which is Chris Amani), edit access.
- QA lead, verbatim: "Do not touch the test cases created by Vladimir, but yes create new and edit which were created by me
  even if they are automated." → applying: edit C154648, C368133 (automated), C96965; create 3 new; run 498 union-only.
  C236975 and C236976 (Vladimir's) stay as they are. Record of the write: `apply/`.
