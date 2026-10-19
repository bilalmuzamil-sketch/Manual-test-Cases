# C368131, C368167, C96936: preconditions and steps simplified (19 Oct 2026)

QA lead, 19 Oct 2026: "correct and simplify the following test cases ... the expected result is not supposed to be changed and so the
sources"; "Correct them I will update Vlad later". Only `custom_preconds` and `custom_steps` were written; the Expected field and the
title were read back byte-identical to the before-copies (`before/`). Every step keeps the number its expected result points to.
The how-to moved to `build/wo-board-tech-view/v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md` (SETUP-C368131,
SETUP-C368167, SETUP-C96936), linked from each case; C368131's old per-case Google Doc was read in full (10,919 characters) first.

| Case | Test in run 498 | Automated flag | Preconditions | Steps |
|---|---|---|---|---|
| [C368131](https://shopview.testrail.io/index.php?/cases/view/368131) | [T3761652](https://shopview.testrail.io/index.php?/tests/view/3761652) | no | 12 lines + doc link → 6 + Blocked line | 15 → 15, shorter wording |
| [C368167](https://shopview.testrail.io/index.php?/cases/view/368167) | [T3792488](https://shopview.testrail.io/index.php?/tests/view/3792488) | **Automated** (tell Vladimir) | 9 lines + 8-step Setup block → 4 + Blocked line | 6 → 6 |
| [C96936](https://shopview.testrail.io/index.php?/cases/view/96936) | [T3481880](https://shopview.testrail.io/index.php?/tests/view/3481880) | **Automated** (tell Vladimir) | 7 lines + 6-step Setup block → 4 + Blocked line | 8 → 8 |

Test results in run 498 left as they are (all three Passed on staging v26.40.19-e435950 today, with the same actions).
