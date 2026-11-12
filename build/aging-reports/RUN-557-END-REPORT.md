# Run 557 — A/R and A/P Report Sorting, Export and Location Filter — end-of-run report (12 Nov 2026 ~01:00 UTC)

Run: https://shopview.testrail.io/index.php?/runs/view/557 · QA site sv11315 (tested on v26.45.2-6a8b89c; the site moved to v26.45.3-34788b2 overnight and the late-day test and every held fault were re-checked on it) · read live 12 Nov 2026 ~01:00 UTC:
470 tests — 439 Passed · 19 Failed · 6 Blocked · 1 Retest · 5 Untested. (The other session's Regression folder and planned-change tests are not ours to run, except the four already done.)

## 1 · DONE
| What | Tests |
|---|---|
| Passed with annotated pictures | 439 (latest: C715473 late-day PDF, C715476, C715480, C715584, C715540, C715617, C715618) |
| Held faults re-checked on the new build v26.45.3-34788b2 (Rule 62(c)) | all four still happen: drafts 04, 05, 06, 07 |
| Failed, ticket already exists | C715469 → SV-12539 · C1062581, C1095436 → SV-12544 · C1078980, C1078981 → SV-12545 · C1079008 → SV-12546 · C1079009 → SV-12547 |
| Failed, ticket HELD for his yes | draft 04 (offline Detail lines): C1062582, C1062583 · draft 05 (offline report message): C715442, C715443, C715633–C715638 · draft 06 (Vendor menu order): C715555 · draft 07 (Inventory Value PDF dies at ~30 s, likely SV-12539): C715475 |

## 2 · LEFT
| Test | How to finish |
|---|---|
| C715471, C715472 release-day untouched reports | only on release day: compare each A/R and A/P report with production pictures taken the day before |
| C715383 (9+ locations), C797943 (≤ 8 vendors), C715468 (2,000 customers) | need his answer (Table 4) |

## 3 · BLOCKED
| Test | Why | Does NOT block |
|---|---|---|
| C715477 | production shows the same "WorkOrder not found" for an address-bar link — the expected prompt never existed for that link form | everything else |
| C715462, C1095432 | the site refuses to make an overpaid invoice | everything else |
| C1078998, C1078999, C1079000 | states the app refuses to create (other session's folder) | everything else |
| C715449 (Retest) | tap on the info icon shows nothing on Work In Progress either — PRD question | everything else |

## 4 · HOW TO UNBLOCK (his decisions)
To be written as full questions (Rule 134): C715477 link form · C715475 add to SV-12539 or new · drafts 04/05/06/07 one at a time · C715383/C797943/C715468 · C715429 precondition (View forced with Create & Edit) · C715548/549 assume two locations · C715449 · C715462 · EXPECT FAIL notes for SV-12139/SV-12141 can come off · duplicate Blocked results (L0669) · code files in commit 660143414 history.

## 5 · HANDOFF-READY
NO — his decisions (Table 4) and the two release-day tests are outstanding. Release-day "before" record: exec/prod/before-release/.
