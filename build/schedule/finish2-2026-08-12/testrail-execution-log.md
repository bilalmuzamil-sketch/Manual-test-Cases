# Schedule — TestRail execution log, 2026-08-12 (finish2 pass)

**Build `v3.5-65d6500`** · last-mod Tue 11 Aug 2026 09:33:33 GMT · etag `3250d285ffcf50626363a578fe273071` ·
`index.html` sha256 `9348ca09d6167375dc52bfc29bf3b9f8c4163dede2ea5ea62269b186c9cc5f6f`.

`update_case` **only**. **0 add · 0 delete · 0 section · 0 run · 0 result** writes.
**0 Jira calls of any kind** — the creation hold is active (Standing Rule 62 and the QA lead's
2026-08-10 ruling, verbatim: *"Do not create anything until my next order."*).
`custom_atmstatus` was never sent. No role, staff record or setting was touched.

**41 operations over 39 distinct cases**, every one **HTTP 200 and byte-verified**:
30 fields compared each, 3 intended, **0 mismatches and 0 collateral changes**. All three text
fields (`custom_preconds`, `custom_steps`, `custom_expected`) went on every payload, because
TestRail re-renders any text field it is not sent.

## Two things went wrong in this batch, and both are recorded rather than tidied away

**1 · A transient HTTP 502 stopped the batch, which is what should happen.**
`policy unavailable` hit the **pre-snapshot READ** for **C30010** part-way through. The batch
**stopped**, as Rule 50 requires. C30010 was then **read back live** and confirmed **unwritten**
(it still named `v3.5-7ec992f`) before the run resumed — a failed write is never retried until the
live state has been read, because a failure can come back from a write that already landed.

**2 · The resume applied one tester note TWICE, and it was my defect.**
`restamp.py` skips any case that already names the running build — but it **deliberately exempted**
the two note-carrying cases from that skip, which is right on the first run and **wrong on a
resume**. So **C29929** came back with its note duplicated. **It was found by reconciling the
operation count against the plan — 39 writes over 38 cases — not by chance**, and repaired in one
further write (`fix_29929.py`). Both note cases were then re-read live and carry **exactly one**
note, one marker and one provenance line. The correct guard is to skip when the note is already
present; that is written into the repair script so the next pass does not repeat it.

## Every operation

| # | Case | HTTP | What changed | Verification |
|---|---|---|---|---|
| 1 | [C29929](https://shopview.testrail.io/index.php?/cases/view/29929) | 200 | sentence 2 re-stamped; tester note added; marker -> HOLD | update_case C29929: 30 fields compared, 3 intended, 0 mismatch |
| 2 | [C29935](https://shopview.testrail.io/index.php?/cases/view/29935) | 200 | sentence 2 re-stamped | update_case C29935: 30 fields compared, 3 intended, 0 mismatch |
| 3 | [C29951](https://shopview.testrail.io/index.php?/cases/view/29951) | 200 | sentence 2 re-stamped | update_case C29951: 30 fields compared, 3 intended, 0 mismatch |
| 4 | [C29952](https://shopview.testrail.io/index.php?/cases/view/29952) | 200 | sentence 2 re-stamped | update_case C29952: 30 fields compared, 3 intended, 0 mismatch |
| 5 | [C29987](https://shopview.testrail.io/index.php?/cases/view/29987) | 200 | sentence 2 re-stamped | update_case C29987: 30 fields compared, 3 intended, 0 mismatch |
| 6 | [C29988](https://shopview.testrail.io/index.php?/cases/view/29988) | 200 | sentence 2 re-stamped | update_case C29988: 30 fields compared, 3 intended, 0 mismatch |
| 7 | [C29989](https://shopview.testrail.io/index.php?/cases/view/29989) | 200 | sentence 2 re-stamped | update_case C29989: 30 fields compared, 3 intended, 0 mismatch |
| 8 | [C29990](https://shopview.testrail.io/index.php?/cases/view/29990) | 200 | sentence 2 re-stamped | update_case C29990: 30 fields compared, 3 intended, 0 mismatch |
| 9 | [C29991](https://shopview.testrail.io/index.php?/cases/view/29991) | 200 | sentence 2 re-stamped | update_case C29991: 30 fields compared, 3 intended, 0 mismatch |
| 10 | [C29992](https://shopview.testrail.io/index.php?/cases/view/29992) | 200 | sentence 2 re-stamped | update_case C29992: 30 fields compared, 3 intended, 0 mismatch |
| 11 | [C29995](https://shopview.testrail.io/index.php?/cases/view/29995) | 200 | sentence 2 re-stamped | update_case C29995: 30 fields compared, 3 intended, 0 mismatch |
| 12 | [C29996](https://shopview.testrail.io/index.php?/cases/view/29996) | 200 | sentence 2 re-stamped | update_case C29996: 30 fields compared, 3 intended, 0 mismatch |
| 13 | [C29997](https://shopview.testrail.io/index.php?/cases/view/29997) | 200 | sentence 2 re-stamped | update_case C29997: 30 fields compared, 3 intended, 0 mismatch |
| 14 | [C29999](https://shopview.testrail.io/index.php?/cases/view/29999) | 200 | sentence 2 re-stamped | update_case C29999: 30 fields compared, 3 intended, 0 mismatch |
| 15 | [C30001](https://shopview.testrail.io/index.php?/cases/view/30001) | 200 | sentence 2 re-stamped | update_case C30001: 30 fields compared, 3 intended, 0 mismatch |
| 16 | [C30003](https://shopview.testrail.io/index.php?/cases/view/30003) | 200 | sentence 2 re-stamped | update_case C30003: 30 fields compared, 3 intended, 0 mismatch |
| 17 | [C30009](https://shopview.testrail.io/index.php?/cases/view/30009) | 200 | sentence 2 re-stamped | update_case C30009: 30 fields compared, 3 intended, 0 mismatch |
| 18 | [C30010](https://shopview.testrail.io/index.php?/cases/view/30010) | **FAILED** | — | FAILED: pre-snapshot C30010 HTTP 502: policy unavailable |
| 19 | [C29929](https://shopview.testrail.io/index.php?/cases/view/29929) | 200 | sentence 2 re-stamped; tester note added; marker -> HOLD | update_case C29929: 30 fields compared, 3 intended, 0 mismatch |
| 20 | [C30010](https://shopview.testrail.io/index.php?/cases/view/30010) | 200 | sentence 2 re-stamped | update_case C30010: 30 fields compared, 3 intended, 0 mismatch |
| 21 | [C30011](https://shopview.testrail.io/index.php?/cases/view/30011) | 200 | sentence 2 re-stamped | update_case C30011: 30 fields compared, 3 intended, 0 mismatch |
| 22 | [C30012](https://shopview.testrail.io/index.php?/cases/view/30012) | 200 | sentence 2 re-stamped | update_case C30012: 30 fields compared, 3 intended, 0 mismatch |
| 23 | [C30014](https://shopview.testrail.io/index.php?/cases/view/30014) | 200 | sentence 2 re-stamped | update_case C30014: 30 fields compared, 3 intended, 0 mismatch |
| 24 | [C30021](https://shopview.testrail.io/index.php?/cases/view/30021) | 200 | sentence 2 re-stamped | update_case C30021: 30 fields compared, 3 intended, 0 mismatch |
| 25 | [C30022](https://shopview.testrail.io/index.php?/cases/view/30022) | 200 | sentence 2 re-stamped | update_case C30022: 30 fields compared, 3 intended, 0 mismatch |
| 26 | [C30027](https://shopview.testrail.io/index.php?/cases/view/30027) | 200 | sentence 2 re-stamped | update_case C30027: 30 fields compared, 3 intended, 0 mismatch |
| 27 | [C30028](https://shopview.testrail.io/index.php?/cases/view/30028) | 200 | sentence 2 re-stamped | update_case C30028: 30 fields compared, 3 intended, 0 mismatch |
| 28 | [C30030](https://shopview.testrail.io/index.php?/cases/view/30030) | 200 | sentence 2 re-stamped | update_case C30030: 30 fields compared, 3 intended, 0 mismatch |
| 29 | [C30033](https://shopview.testrail.io/index.php?/cases/view/30033) | 200 | sentence 2 re-stamped | update_case C30033: 30 fields compared, 3 intended, 0 mismatch |
| 30 | [C30035](https://shopview.testrail.io/index.php?/cases/view/30035) | 200 | sentence 2 re-stamped | update_case C30035: 30 fields compared, 3 intended, 0 mismatch |
| 31 | [C30036](https://shopview.testrail.io/index.php?/cases/view/30036) | 200 | sentence 2 re-stamped | update_case C30036: 30 fields compared, 3 intended, 0 mismatch |
| 32 | [C30038](https://shopview.testrail.io/index.php?/cases/view/30038) | 200 | sentence 2 re-stamped | update_case C30038: 30 fields compared, 3 intended, 0 mismatch |
| 33 | [C30040](https://shopview.testrail.io/index.php?/cases/view/30040) | 200 | sentence 2 re-stamped | update_case C30040: 30 fields compared, 3 intended, 0 mismatch |
| 34 | [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) | 200 | sentence 2 re-stamped | update_case C30041: 30 fields compared, 3 intended, 0 mismatch |
| 35 | [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) | 200 | sentence 2 re-stamped; tester note added; marker -> HOLD | update_case C30050: 30 fields compared, 3 intended, 0 mismatch |
| 36 | [C30066](https://shopview.testrail.io/index.php?/cases/view/30066) | 200 | sentence 2 re-stamped | update_case C30066: 30 fields compared, 3 intended, 0 mismatch |
| 37 | [C30070](https://shopview.testrail.io/index.php?/cases/view/30070) | 200 | sentence 2 re-stamped | update_case C30070: 30 fields compared, 3 intended, 0 mismatch |
| 38 | [C30071](https://shopview.testrail.io/index.php?/cases/view/30071) | 200 | sentence 2 re-stamped | update_case C30071: 30 fields compared, 3 intended, 0 mismatch |
| 39 | [C30086](https://shopview.testrail.io/index.php?/cases/view/30086) | 200 | sentence 2 re-stamped | update_case C30086: 30 fields compared, 3 intended, 0 mismatch |
| 40 | [C43588](https://shopview.testrail.io/index.php?/cases/view/43588) | 200 | sentence 2 ADDED (case had none) | update_case C43588: 30 fields compared, 3 intended, 0 mismatch |
| 41 | [C29929](https://shopview.testrail.io/index.php?/cases/view/29929) | 200 | REPAIR - the resume re-applied the tester note; the duplicate copy removed | update_case C29929: 30 fields compared, 3 intended, 0 mismatch |
| 42 | [C38873](https://shopview.testrail.io/index.php?/cases/view/38873) | 200 | sentence 2 re-stamped | update_case C38873: 30 fields compared, 3 intended, 0 mismatch |

## Run 357 — proven untouched BY CONTENT, never by a timestamp

| | before | after |
|---|---|---|
| `include_all` | False | False |
| tests | 176 | 176 |
| result records | 529 | 529 |

**`case_id` and `test_id` sets equal in BOTH directions.** All **529** prior result records present
**by id** — **0 missing, 0 new**. **0 graded fields changed** and **0 derived/echo fields changed**,
not even `case_title`, because no case was retitled.

**Re-proved at the end of the pass**, after every write: `include_all` still False, 176 tests, **529
results**, and the **test_id, case_id and result_id sets all equal the pre-write snapshot exactly**.

Snapshot: `evidence/run357-PRE.json` (ids only — no result bodies are stored).
