# SV-11588 — TestRail execution log (22 Oct 2026)

Authorised by the QA lead: "Yes please and put the ticket number there to tell that it has been fixed here".

| # | Operation | Target | HTTP | Verification |
|---|---|---|---|---|
| 1 | Snapshot `get_run` + `get_tests` + `get_results_for_run` (paged) | run 498 | 200 | include_all false, not completed; 276 tests, 1572 results; case 707078 not in run |
| 2 | `update_run/498` with case_ids = current 276 ∪ {707078} (union only) | run 498 | 200 | after: 277 tests; 0 prior cases missing; only 707078 added; all 276 prior test ids kept with the same case; 1572 results before and after, 0 lost by id |
| 3 | `add_result/4216028` status Passed, comment names SV-11588 as the fix | test 4216028 (case C707078) | 200 | result id 535192; re-read: test status 1, 1 result, comment byte-identical to what was sent |

Test-run link: https://shopview.testrail.io/index.php?/tests/view/4216028

Source currency at write time: SV-11588 PASSED comment 79306 + separate point 79307 (posted earlier today); build v26.43.0-003b8fb on sv11588.

Rule checks: 34/47 union-only with snapshot before and by-id verification after; 50 byte-compared read-back; 6 written with explicit permission. No other run or case touched.
