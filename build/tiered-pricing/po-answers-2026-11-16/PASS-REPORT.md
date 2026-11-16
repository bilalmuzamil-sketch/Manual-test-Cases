# Tiered Pricing — PRD v38 and Matt Barge's answers: PASS REPORT (16 Nov 2026)

QA lead's decisions, 16 Nov 2026 (verbatim choices): **"Named set, write it (Recommended)"** · **"Wait for his canvas (Recommended)"** (pictures left as they are) · **"Add both to the sheet (Recommended)"** (follow-ups F1/F2 become questions 32/33). Plan: `IMPACT.md`, `IMPACT-CASES.json`.

## 1 · Sources (Rule 59 re-check at the start, 13:14 UTC)

| Source | Read | Verdict |
|---|---|---|
| Tiered Pricing PRD 938213378 | page **v38**, created 2026-11-16T12:28:08Z by Matthew Barge, "QA questions from Bilal (Nov 16)" (metadata.version.number) | unchanged since the impact pass: go |
| Reports PRD 968687617 | page **v21**, 2026-11-12T22:08:41Z | unchanged: go |
| Matt Barge's answers 1-31 | `questions-2026-11-14/ANSWERS-2026-11-16.json` (word for word) | all applied |
| Epic SV-11692 | JQL `parent = SV-11692 AND updated >= "2026-11-14"` (13:40Z): exactly the 10 stories edited 12:30Z, none later; `sources/jira/JIRA-SWEEP-SV-11692-2026-11-16.json`; `ticket_sweep.py` exits 0 (PRD v38 handled) | handled |
| Design canvas | not re-read (QA lead: wait for Matt's canvas changes); pictures untouched | as held |

## 2 · Library

- `requirements.json`: the extractor reproduces all 279 numbered v37 rows exactly, then moves every Tiered Pricing row to page v38: **18 rows changed** (the 18 the v37→v38 diff names; old text kept as `text_v37`), **S19-R24 added**; Error Handling and Permissions rows unchanged (`v38/requirements_to_v38.py`).
- Library PRD source = page v38 for every case. `build.py` re-proved every stored quote: exactly the 20 cases IMPACT named rested on a changed sentence; all in the named set.
- `prove_unchanged.py`: **735 cases outside the named set are byte-identical** in every TestRail field and folder; the 9 no-write cases (4 quote-only, 5 checked) too (`v38/prove-unchanged.json`).
- New source kind `QA(...)`: Matt Barge's written answer, word for word, used only where v38 does not word the point (S10-39: new work order "new number, Approved", paid one untouched; D-64 and the report movement cases: answer 31).
- Edits kept as scripts: `v38/patches/`; the 25 deleted cases' source: `v38/deleted-library-cases.py` (with question, choice and Matt's words).
- Questions: Q1-Q31 ANSWERED in `authoring/po_questions.py`; **Q32 (F1)** and **Q33 (F2)** added; Q33 holds S3-40; Q32 holds no case (`NO_CASE_YET`: the category-page check between the pick and Save is added when answered; S3-17/S3-18 check prices, which v38 and the answer settle).
- Register: every PO-CANDIDATE row closed by its ruling (`DESIGN-DIVERGENCE-REGISTER.json`: 120 CLOSED, 13 NO-DIFFERENCE; deleted cases kept as `deleted_cases` with C-ids).
- Gates: `build.py` **0 PROBLEM lines** (802 cases, 15 held); `tester_readiness_check.py` **0 hard problems**. Rule 138 reading: all 58 written cases read in full (49 changed + 9 new), every "does not / never" result in them checked for a visible control; fixed before writing: S2-35/S2-79/D-14 tier precondition wording, S3-18/S3-47 negative-only results, S10-39 (a step to open the new work order), S8-13 ("choose" item Q).

## 3 · Writes (all logged: operation, C-id, HTTP status, read-back)

| Operation | Count | HTTP | Read-back | Log / copies |
|---|---|---|---|---|
| update_case (edit-locked on the live text; 0 edited outside our library) | 49 | [200] | 49/49 field by field | `write/log-update.jsonl`, `write/before/`, `write/after/` |
| move_cases_to_section (empty reply; section_id read back) | 5 | [200] | 5/5 | S3-17, S3-18 → Story 3; S10-39 → Story 10; RPT-63 → reports; S3-40 → Waiting on Matt Barge's answers |
| add_case | 9 | [200] | 9/9 | `write/log-add.jsonl` |
| add_attachment_to_case (new cases only) | 20 | [200] | 9/9 cases by name | existing cases' pictures untouched |
| delete_case (POST {}) | 25 | [200] | 25/25 get_case answers 400 | `write/log-delete.jsonl`, `write/deleted/` |
| update_run 560 (union only; paged tests; S3-40 taken out: no result on its test) | 1 | 200 | 763 → **787**: +25 (16 released, 9 new), −1 (S3-40); every prior test kept | `write/log-run.jsonl`, `write/run560-tests-*-2026-11-16.json` |
| add_results_for_cases (assignedto_id 6 only) | 25 | 200 | 787/787 assigned to user 6 | `write/log-run.jsonl` |
| Folder note 138770 | 0 (already "current as of 11/16/2026", earlier text kept below) | — | read back | `write/log-folder.jsonl` |
| End check `6_verify_all.py` | — | — | 802 live = 802 library, 0 field mismatches, run = every released case, no held case | `write/verify-all-2026-11-16.json` |

## 4 · Per case, every part (Rule 134) — CHANGED / CONFIRMED against PRD v38 and the answers

Verdicts: CHANGE (released, text changed), REWRITE (held → rewritten and released), RELEASE (held → released), REFS-ONLY (References gain S19-R24), LIBRARY-ONLY (only the stored PRD quote moved to v38; not written), CONFIRMED (checked against S19-R24; not written). Pictures: QA lead "Wait for his canvas" — S3-17 and S3-18 now also list board 10.6 in the library (Add Part steps); it is attached with the canvas refresh (`PICTURES-PENDING-2026-11-16.json`).

| Case | C-id | Q | Verdict | Title | Preconditions | Steps | Expected results | Sources behind the results (library, PRD v38) | References | Pictures | AUTOMATION marker | Folder | Run 560 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| D-14 | [C1211063](https://shopview.testrail.io/index.php?/cases/view/1211063) | 2 | CHANGE | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| D-143 | [C1210915](https://shopview.testrail.io/index.php?/cases/view/1210915) | 1 | CHANGE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| D-144 | [C1210916](https://shopview.testrail.io/index.php?/cases/view/1210916) | 1 | CHANGE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| D-145 | [C1210917](https://shopview.testrail.io/index.php?/cases/view/1210917) | 1 | CHANGE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| D-164 | [C1210926](https://shopview.testrail.io/index.php?/cases/view/1210926) | 1 | CHANGE | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| INV-47 | [C1211115](https://shopview.testrail.io/index.php?/cases/view/1211115) | 19 | CHANGE | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S12-12 | [C1211355](https://shopview.testrail.io/index.php?/cases/view/1211355) | 26 | CHANGE | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S16-06 | [C1211394](https://shopview.testrail.io/index.php?/cases/view/1211394) | 19 | CHANGE | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S16-15 | [C1211403](https://shopview.testrail.io/index.php?/cases/view/1211403) | 19 | CHANGE | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S2-35 | [C1211479](https://shopview.testrail.io/index.php?/cases/view/1211479) | 2 | CHANGE | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S2-53 | [C1211497](https://shopview.testrail.io/index.php?/cases/view/1211497) | 1 | CHANGE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S2-54 | [C1211498](https://shopview.testrail.io/index.php?/cases/view/1211498) | 1 | CHANGE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S2-58 | [C1211502](https://shopview.testrail.io/index.php?/cases/view/1211502) | 1 | CHANGE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S3-01 | [C1211523](https://shopview.testrail.io/index.php?/cases/view/1211523) | 1 | CHANGE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S3-02 | [C1211524](https://shopview.testrail.io/index.php?/cases/view/1211524) | 1 | CHANGE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S3-03 | [C1211525](https://shopview.testrail.io/index.php?/cases/view/1211525) | 1 | CHANGE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S3-05 | [C1211527](https://shopview.testrail.io/index.php?/cases/view/1211527) | 1 | CHANGE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S3-28 | [C1211550](https://shopview.testrail.io/index.php?/cases/view/1211550) | 10 | CHANGE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S3-40 | [C1211562](https://shopview.testrail.io/index.php?/cases/view/1211562) | 6 | CHANGE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | OUT (was in) |
| S6-02 | [C1211624](https://shopview.testrail.io/index.php?/cases/view/1211624) | 16 | CHANGE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S6-03 | [C1211625](https://shopview.testrail.io/index.php?/cases/view/1211625) | 16 | CHANGE | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S6-07 | [C1211629](https://shopview.testrail.io/index.php?/cases/view/1211629) | 16 | CHANGE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S6-08 | [C1211630](https://shopview.testrail.io/index.php?/cases/view/1211630) | 19 | CHANGE | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S7-10 | [C1211651](https://shopview.testrail.io/index.php?/cases/view/1211651) | 1 | CHANGE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S8-02 | [C1211663](https://shopview.testrail.io/index.php?/cases/view/1211663) | 19 | CHANGE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S8-03 | [C1211664](https://shopview.testrail.io/index.php?/cases/view/1211664) | 19 | CHANGE | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S8-04 | [C1211665](https://shopview.testrail.io/index.php?/cases/view/1211665) | 19 | CHANGE | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S8-06 | [C1211667](https://shopview.testrail.io/index.php?/cases/view/1211667) | 21 | CHANGE | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S8-12 | [C1211673](https://shopview.testrail.io/index.php?/cases/view/1211673) | 19 | CHANGE | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| S9-26 | [C1211699](https://shopview.testrail.io/index.php?/cases/view/1211699) | 22 | CHANGE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| D-166 | [C1210928](https://shopview.testrail.io/index.php?/cases/view/1210928) | 31 | CONFIRMED (checked) | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | IN (was in) |
| D-175 | [C1210936](https://shopview.testrail.io/index.php?/cases/view/1210936) | 31 | CONFIRMED (checked) | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | IN (was in) |
| D-225 | [C1210965](https://shopview.testrail.io/index.php?/cases/view/1210965) | 31 | CONFIRMED (checked) | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | IN (was in) |
| D-76 | [C1211199](https://shopview.testrail.io/index.php?/cases/view/1211199) | 31 | CONFIRMED (checked) | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | IN (was in) |
| D-77 | [C1211200](https://shopview.testrail.io/index.php?/cases/view/1211200) | 31 | CONFIRMED (checked) | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | IN (was in) |
| S2-31 | [C1211475](https://shopview.testrail.io/index.php?/cases/view/1211475) | 2 | LIBRARY-ONLY | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | IN (was in) |
| S2-32 | [C1211476](https://shopview.testrail.io/index.php?/cases/view/1211476) | 2 | LIBRARY-ONLY | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | IN (was in) |
| S3-06 | [C1211528](https://shopview.testrail.io/index.php?/cases/view/1211528) | 6 | LIBRARY-ONLY | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | IN (was in) |
| S3-27 | [C1211549](https://shopview.testrail.io/index.php?/cases/view/1211549) | 10 | LIBRARY-ONLY | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | IN (was in) |
| D-123 | [C1210904](https://shopview.testrail.io/index.php?/cases/view/1210904) | 31 | REFS-ONLY | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| D-149 | [C1210921](https://shopview.testrail.io/index.php?/cases/view/1210921) | 31 | REFS-ONLY | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| D-78 | [C1211201](https://shopview.testrail.io/index.php?/cases/view/1211201) | 31 | REFS-ONLY | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | IN (was in) |
| D-129 | [C1210910](https://shopview.testrail.io/index.php?/cases/view/1210910) | 16 | RELEASE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was out) |
| D-162 | [C1210924](https://shopview.testrail.io/index.php?/cases/view/1210924) | 21 | RELEASE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was out) |
| D-165 | [C1210927](https://shopview.testrail.io/index.php?/cases/view/1210927) | 19 | RELEASE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was out) |
| D-50 | [C1211096](https://shopview.testrail.io/index.php?/cases/view/1211096) | 1 | RELEASE | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | IN (was out) |
| RPT-63 | [C1211265](https://shopview.testrail.io/index.php?/cases/view/1211265) | 30 | RELEASE | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | IN (was out) |
| D-179 | [C1210940](https://shopview.testrail.io/index.php?/cases/view/1210940) | 31 | REWRITE | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | IN (was out) |
| D-450 | [C1211037](https://shopview.testrail.io/index.php?/cases/view/1211037) | 31 | REWRITE | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | IN (was out) |
| D-451 | [C1211038](https://shopview.testrail.io/index.php?/cases/view/1211038) | 31 | REWRITE | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | IN (was out) |
| D-452 | [C1211039](https://shopview.testrail.io/index.php?/cases/view/1211039) | 31 | REWRITE | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | IN (was out) |
| D-453 | [C1211040](https://shopview.testrail.io/index.php?/cases/view/1211040) | 31 | REWRITE | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | IN (was out) |
| D-454 | [C1211041](https://shopview.testrail.io/index.php?/cases/view/1211041) | 31 | REWRITE | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | IN (was out) |
| D-63 | [C1211109](https://shopview.testrail.io/index.php?/cases/view/1211109) | 31 | REWRITE | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | IN (was out) |
| D-64 | [C1211110](https://shopview.testrail.io/index.php?/cases/view/1211110) | 31 | REWRITE | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | IN (was out) |
| S10-39 | [C1211004](https://shopview.testrail.io/index.php?/cases/view/1211004) | 24 | REWRITE | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | IN (was out) |
| S3-17 | [C1211539](https://shopview.testrail.io/index.php?/cases/view/1211539) | 6 | REWRITE | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED (library only; TestRail pictures untouched) | CHANGED | CHANGED | IN (was out) |
| S3-18 | [C1211540](https://shopview.testrail.io/index.php?/cases/view/1211540) | 6 | REWRITE | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED (library only; TestRail pictures untouched) | CHANGED | CHANGED | IN (was out) |

### New cases (9)

| Case | C-id | Q | Title | Folder | Pictures | Run 560 |
|---|---|---|---|---|---|---|
| S2-79 | [C1211712](https://shopview.testrail.io/index.php?/cases/view/1211712) | 2 | Deleting a tier that another tier follows lists it, then This can't be undone | Story 2: Tiers | 2.22, 2.29 | IN |
| S3-46 | [C1211713](https://shopview.testrail.io/index.php?/cases/view/1211713) | 6 | The Categories line can be changed only in Edit | Story 3: Matrices and rules | 3.2, 3.23 | IN |
| S3-47 | [C1211714](https://shopview.testrail.io/index.php?/cases/view/1211714) | 6 | Cancel after picking a category puts the Categories line back | Story 3: Matrices and rules | 3.11, 3.23, 10.6, full:10.6 | IN |
| S4-42 | [C1211715](https://shopview.testrail.io/index.php?/cases/view/1211715) | 14 | Switching a 3-range column to % Off counts 1 change, then 4 | Story 4: The tier grid: every tier of a matrix, edited in place | 4.11, 4.6 | IN |
| S4-43 | [C1211716](https://shopview.testrail.io/index.php?/cases/view/1211716) | 15 | A tier with a different value per range is saved as one bullet per range | Story 4: The tier grid: every tier of a matrix, edited in place | 4.6, 3.12 | IN |
| S4-44 | [C1211717](https://shopview.testrail.io/index.php?/cases/view/1211717) | 15 | A tier with two rule types is saved as multiple rules | Story 4: The tier grid: every tier of a matrix, edited in place | 4.13, 4.14, 3.12 | IN |
| S8-13 | [C1211718](https://shopview.testrail.io/index.php?/cases/view/1211718) | 21 | Uncategorized's QuickBooks Products and Services can be changed | Story 8: Categories over time | 8.3 | IN |
| S9-39 | [C1211719](https://shopview.testrail.io/index.php?/cases/view/1211719) | 22 | The Work orders and Both filters list only customers on exactly that channel | Story 9: Putting customers on tiers | 9.1, 9.3 | IN |
| S19-24 | [C1211720](https://shopview.testrail.io/index.php?/cases/view/1211720) | 14 | The Audit Log records a rule type change and the values typed after it | Story 19: Shared behavior for every new page, dialog and list | 6.14, 2.6 | IN |

### Deleted (25) — Rule 130, PO ruled the design's version out; full before-copies kept

| Case | C-id | Q | Title | Before-copy |
|---|---|---|---|---|
| D-51 | C1211097 | 2 | Design: the Delete question adds This can't be undone | `po-answers-2026-11-16/write/deleted/C1211097-before.json` |
| D-52 | C1211098 | 3 | Design: the Set Rule question says in all n matrices | `po-answers-2026-11-16/write/deleted/C1211098-before.json` |
| D-53 | C1211099 | 4 | Design: a tier's Pricing tab says Same as previous tier | `po-answers-2026-11-16/write/deleted/C1211099-before.json` |
| D-54 | C1211100 | 5 | Design: Default's page shows one column with rule counts | `po-answers-2026-11-16/write/deleted/C1211100-before.json` |
| D-55 | C1211101 | 7 | Design: Duplicate opens an unsaved copy to name and create | `po-answers-2026-11-16/write/deleted/C1211101-before.json` |
| D-58 | C1211104 | 8 | Design: Add Range adds a new last range | `po-answers-2026-11-16/write/deleted/C1211104-before.json` |
| D-61 | C1211107 | 9 | Design: the last range reads with a plus sign in view | `po-answers-2026-11-16/write/deleted/C1211107-before.json` |
| D-65 | C1211111 | 10 | Design: every range but the first has a delete button | `po-answers-2026-11-16/write/deleted/C1211111-before.json` |
| D-60 | C1211106 | 11 | Design: grid errors show in a Save is blocked banner | `po-answers-2026-11-16/write/deleted/C1211106-before.json` |
| D-62 | C1211108 | 12 | Design: a taken New Matrix name shows in the banner | `po-answers-2026-11-16/write/deleted/C1211108-before.json` |
| D-56 | C1211102 | 13 | Design: picking % Off fills every range with 0 | `po-answers-2026-11-16/write/deleted/C1211102-before.json` |
| D-57 | C1211103 | 14 | Design: one rule type change counts as three changes | `po-answers-2026-11-16/write/deleted/C1211103-before.json` |
| D-59 | C1211105 | 15 | Design: the saved message names the range of the change | `po-answers-2026-11-16/write/deleted/C1211105-before.json` |
| D-130 | C1210911 | 17 | Design: the no-match messages say No matrices match and No category matches | `po-answers-2026-11-16/write/deleted/C1210911-before.json` |
| D-171 | C1210932 | 17 | Design: a Customers tab no-match message offers Clear All Filters | `po-answers-2026-11-16/write/deleted/C1210932-before.json` |
| D-147 | C1210919 | 18 | Design: the other categories named in an info icon by the matrix name | `po-answers-2026-11-16/write/deleted/C1210919-before.json` |
| D-168 | C1210930 | 20 | Design: the delete question and taken-name error as the design words them | `po-answers-2026-11-16/write/deleted/C1210930-before.json` |
| D-172 | C1210933 | 22 | Design: the Customers tab's Sales Type filter rows | `po-answers-2026-11-16/write/deleted/C1210933-before.json` |
| D-185 | C1210946 | 23 | Design: the Counter Sale note shows as a blue box above the tier fields | `po-answers-2026-11-16/write/deleted/C1210946-before.json` |
| D-442 | C1211035 | 25 | Design: receiving shows a toast with the price and the tier | `po-answers-2026-11-16/write/deleted/C1211035-before.json` |
| D-211 | C1210953 | 26 | Design: the price details' matrix line and Same as previous tier row | `po-answers-2026-11-16/write/deleted/C1210953-before.json` |
| D-224 | C1210964 | 27 | Design: the notice names Fixed price and Manual lines too | `po-answers-2026-11-16/write/deleted/C1210964-before.json` |
| D-440 | C1211033 | 28 | Design: report rows and Priced By list show tier names without numbers | `po-answers-2026-11-16/write/deleted/C1211033-before.json` |
| D-441 | C1211034 | 29 | Design: the Category list places Uncategorized in A to Z order | `po-answers-2026-11-16/write/deleted/C1211034-before.json` |
| D-443 | C1211036 | 30 | Design: the CSV's filter lines put Priced By before Category | `po-answers-2026-11-16/write/deleted/C1211036-before.json` |

## 5 · Run 560 — test links of every changed and new case in the run

Run: https://shopview.testrail.io/index.php?/runs/view/560 — before **763**, after **787** tests, all assigned to user 6 (Mudassir).

57 tests (49 written cases minus S3-40, which is held and out of the run, plus 9 new):

```
https://shopview.testrail.io/index.php?/tests/view/5128275
https://shopview.testrail.io/index.php?/tests/view/5131476
https://shopview.testrail.io/index.php?/tests/view/5128410
https://shopview.testrail.io/index.php?/tests/view/5128284
https://shopview.testrail.io/index.php?/tests/view/5128285
https://shopview.testrail.io/index.php?/tests/view/5128286
https://shopview.testrail.io/index.php?/tests/view/5128289
https://shopview.testrail.io/index.php?/tests/view/5131477
https://shopview.testrail.io/index.php?/tests/view/5128293
https://shopview.testrail.io/index.php?/tests/view/5131478
https://shopview.testrail.io/index.php?/tests/view/5131479
https://shopview.testrail.io/index.php?/tests/view/5131481
https://shopview.testrail.io/index.php?/tests/view/5131482
https://shopview.testrail.io/index.php?/tests/view/5131483
https://shopview.testrail.io/index.php?/tests/view/5131484
https://shopview.testrail.io/index.php?/tests/view/5131485
https://shopview.testrail.io/index.php?/tests/view/5131486
https://shopview.testrail.io/index.php?/tests/view/5131487
https://shopview.testrail.io/index.php?/tests/view/5131488
https://shopview.testrail.io/index.php?/tests/view/5128529
https://shopview.testrail.io/index.php?/tests/view/5128446
https://shopview.testrail.io/index.php?/tests/view/5131489
https://shopview.testrail.io/index.php?/tests/view/5131480
https://shopview.testrail.io/index.php?/tests/view/5128675
https://shopview.testrail.io/index.php?/tests/view/5128714
https://shopview.testrail.io/index.php?/tests/view/5128723
https://shopview.testrail.io/index.php?/tests/view/5131500
https://shopview.testrail.io/index.php?/tests/view/5128798
https://shopview.testrail.io/index.php?/tests/view/5128816
https://shopview.testrail.io/index.php?/tests/view/5128817
https://shopview.testrail.io/index.php?/tests/view/5128821
https://shopview.testrail.io/index.php?/tests/view/5131492
https://shopview.testrail.io/index.php?/tests/view/5128842
https://shopview.testrail.io/index.php?/tests/view/5128843
https://shopview.testrail.io/index.php?/tests/view/5128844
https://shopview.testrail.io/index.php?/tests/view/5128846
https://shopview.testrail.io/index.php?/tests/view/5131490
https://shopview.testrail.io/index.php?/tests/view/5131491
https://shopview.testrail.io/index.php?/tests/view/5128867
https://shopview.testrail.io/index.php?/tests/view/5131493
https://shopview.testrail.io/index.php?/tests/view/5131494
https://shopview.testrail.io/index.php?/tests/view/5131495
https://shopview.testrail.io/index.php?/tests/view/5131496
https://shopview.testrail.io/index.php?/tests/view/5131497
https://shopview.testrail.io/index.php?/tests/view/5128940
https://shopview.testrail.io/index.php?/tests/view/5128941
https://shopview.testrail.io/index.php?/tests/view/5128945
https://shopview.testrail.io/index.php?/tests/view/5128946
https://shopview.testrail.io/index.php?/tests/view/5128967
https://shopview.testrail.io/index.php?/tests/view/5128979
https://shopview.testrail.io/index.php?/tests/view/5128980
https://shopview.testrail.io/index.php?/tests/view/5128981
https://shopview.testrail.io/index.php?/tests/view/5128983
https://shopview.testrail.io/index.php?/tests/view/5128989
https://shopview.testrail.io/index.php?/tests/view/5131498
https://shopview.testrail.io/index.php?/tests/view/5129015
https://shopview.testrail.io/index.php?/tests/view/5131499
```

## 6 · Held on the new questions

- **33** (F2): S3-40 [C1211562](https://shopview.testrail.io/index.php?/cases/view/1211562) "Only a grid save asks Change All" — `AUTOMATION: HOLD - waiting on the PO (question 33)`, in "Waiting on Matt Barge's answers", out of run 560.
- **32** (F1): no case held; the category-page check between the pick and Save is added when answered.
- Sheet rows drafted (not written): `questions-2026-11-16/F1-F2-rows.json` (rows 37-39, light green, dated heading row).

## OUTSTANDING — what I need from you

1. **Add questions 32 and 33 to Matt's sheet** (coordinator): rows in `questions-2026-11-16/F1-F2-rows.json`.
2. **Waiting on the PO:** https://docs.google.com/spreadsheets/d/1qVTIPIWUarmDGg6AjD1q8BbitlynKdjy9VYBCpGuMeY — questions 32, 33 (once added); case held: S3-40 C1211562 (33).
3. **Matt's canvas changes** (22 answers): then refresh the pictures in one pass (370 cases listed; plus board 10.6 on S3-17/S3-18).
