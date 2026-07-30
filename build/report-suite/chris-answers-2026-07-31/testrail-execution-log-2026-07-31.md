# Report Suite — TestRail EXECUTION LOG 2026-07-31 (Chris Ward's answers + the 2026-07-29 spec changelog)

**Executed:** 2026-07-30 15:27:09Z · executor `exec_push_2026-07-31.py` · manifest
`testrail-push-manifest-2026-07-31.md` (header now EXECUTED).

## Result: ALL operations succeeded — 0 failures

| Operation | Count | HTTP 200 | re-GET MATCH |
|---|---|---|---|
| `update_case` | 70 | 70 | 70 |
| `add_case` | 7 | 7 | 7 |
| `delete_case` | 0 | — | — |
| `add_section` | 0 | — | — |
| `update_run` (run 359 case sync) | 1 | 1 | verified |

**Live case count under group 4281 after the push: 472 == expected 472 == id-map 472.**

Every `update_case` was preceded by a `get_case` snapshot saved to `pre-push-snapshot/`
(70 case snapshots + `run359.pre-sync-2026-07-31.json`). Verification compared title,
preconditions, steps, expected and refs on a fresh re-GET after every single write.

## New cases created

| Internal ID | TestRail | Link |
|---|---|---|
| SBC-LOC-04 | C38912 | https://shopview.testrail.io/index.php?/cases/view/38912 |
| SBR-LOC-05 | C38913 | https://shopview.testrail.io/index.php?/cases/view/38913 |
| PV-FILT-14 | C38914 | https://shopview.testrail.io/index.php?/cases/view/38914 |
| TU-LOC-06 | C38915 | https://shopview.testrail.io/index.php?/cases/view/38915 |
| WIP-FLT-09 | C38916 | https://shopview.testrail.io/index.php?/cases/view/38916 |
| IV-LOC-06 | C38917 | https://shopview.testrail.io/index.php?/cases/view/38917 |
| WIP-EXP-10 | C38918 | https://shopview.testrail.io/index.php?/cases/view/38918 |

## Run 359 case sync (Standing Rule 34)

- Run: **359** "Reports Suite - Nebojsa/Viktoria (VIU Pending)" — owned by another tester.
- `include_all` = **False** → a fixed case selection, so new cases do NOT appear automatically; a union `update_run` was required.
- Snapshot BEFORE: **465 tests**, **539 recorded results**, 465 distinct case_ids.
- Union: 465 existing + 7 new = **472** (asserted the existing set is a subset of the union and the length is exactly existing+new — never a partial list, which would delete tests and their results).
- AFTER: **472 tests**, **539 recorded results**.
- Verification: {'count': True, 'prior_cases_present': True, 'new_cases_present': True, 'results_unchanged': True} — test count correct, every prior case still present, all 7 new cases present, **recorded results UNCHANGED (539 → 539)**.
- **No other run was touched.**

## Per-operation detail

| # | Op | Internal ID | TestRail | HTTP | Verify |
|---|---|---|---|---|---|
| 1 | update_case | IV-LOC-04 | C30577 | 200 | MATCH |
| 2 | update_case | PV-CALC-02 | C30360 | 200 | MATCH |
| 3 | update_case | PV-CALC-05 | C30363 | 200 | MATCH |
| 4 | update_case | PV-CALC-06 | C30364 | 200 | MATCH |
| 5 | update_case | PV-CALC-07 | C30365 | 200 | MATCH |
| 6 | update_case | PV-CALC-09 | C30367 | 200 | MATCH |
| 7 | update_case | PV-CALC-10 | C30368 | 200 | MATCH |
| 8 | update_case | PV-CALC-11 | C30369 | 200 | MATCH |
| 9 | update_case | PV-CALC-13 | C30371 | 200 | MATCH |
| 10 | update_case | PV-CALC-14 | C30372 | 200 | MATCH |
| 11 | update_case | PV-CALC-15 | C30373 | 200 | MATCH |
| 12 | update_case | PV-CALC-16 | C30374 | 200 | MATCH |
| 13 | update_case | PV-COL-01 | C30351 | 200 | MATCH |
| 14 | update_case | PV-COL-02 | C30352 | 200 | MATCH |
| 15 | update_case | PV-COL-03 | C30353 | 200 | MATCH |
| 16 | update_case | PV-COL-06 | C30356 | 200 | MATCH |
| 17 | update_case | PV-EXP-04 | C30378 | 200 | MATCH |
| 18 | update_case | PV-EXP-07 | C30381 | 200 | MATCH |
| 19 | update_case | PV-FILT-13 | C30340 | 200 | MATCH |
| 20 | update_case | PV-ROW-02 | C30342 | 200 | MATCH |
| 21 | update_case | PV-ROW-03 | C30343 | 200 | MATCH |
| 22 | update_case | PV-ROW-04 | C30344 | 200 | MATCH |
| 23 | update_case | PV-ROW-08 | C30348 | 200 | MATCH |
| 24 | update_case | PV-ROW-09 | C30349 | 200 | MATCH |
| 25 | update_case | SBC-EXP-02 | C30160 | 200 | MATCH |
| 26 | update_case | SBC-EXP-03 | C30161 | 200 | MATCH |
| 27 | update_case | SBC-EXP-06 | C30164 | 200 | MATCH |
| 28 | update_case | SBC-EXP-11 | C30169 | 200 | MATCH |
| 29 | update_case | SBC-EXP-14 | C30172 | 200 | MATCH |
| 30 | update_case | SBC-EXP-16 | C38856 | 200 | MATCH |
| 31 | update_case | SBC-LOC-01 | C30109 | 200 | MATCH |
| 32 | update_case | SBC-NAV-01 | C30096 | 200 | MATCH |
| 33 | update_case | SBC-PERM-01 | C30098 | 200 | MATCH |
| 34 | update_case | SBC-PERM-02 | C30099 | 200 | MATCH |
| 35 | update_case | SBR-API-06 | C30321 | 200 | MATCH |
| 36 | update_case | SBR-ASGN-01 | C30292 | 200 | MATCH |
| 37 | update_case | SBR-ASGN-02 | C30293 | 200 | MATCH |
| 38 | update_case | SBR-ASGN-03 | C30294 | 200 | MATCH |
| 39 | update_case | SBR-ASGN-04 | C30295 | 200 | MATCH |
| 40 | update_case | SBR-ASGN-05 | C30296 | 200 | MATCH |
| 41 | update_case | SBR-ASGN-06 | C30297 | 200 | MATCH |
| 42 | update_case | SBR-DEACT-02 | C30253 | 200 | MATCH |
| 43 | update_case | SBR-DEACT-05 | C30256 | 200 | MATCH |
| 44 | update_case | SBR-DEACT-06 | C30257 | 200 | MATCH |
| 45 | update_case | SBR-DEACT-07 | C30258 | 200 | MATCH |
| 46 | update_case | SBR-EXP-10 | C30285 | 200 | MATCH |
| 47 | update_case | SBR-EXP-11 | C30286 | 200 | MATCH |
| 48 | update_case | SBR-EXP-12 | C30287 | 200 | MATCH |
| 49 | update_case | SBR-EXP-13 | C30288 | 200 | MATCH |
| 50 | update_case | SBR-EXP-15 | C30290 | 200 | MATCH |
| 51 | update_case | SBR-LOC-04 | C30216 | 200 | MATCH |
| 52 | update_case | SBR-PERM-02 | C30199 | 200 | MATCH |
| 53 | update_case | SBR-TYPE-02 | C30206 | 200 | MATCH |
| 54 | update_case | SBR-UNAS-01 | C30261 | 200 | MATCH |
| 55 | update_case | SBR-WO-01 | C30310 | 200 | MATCH |
| 56 | update_case | SBR-WO-02 | C30311 | 200 | MATCH |
| 57 | update_case | SBR-WO-03 | C30312 | 200 | MATCH |
| 58 | update_case | SBR-WO-04 | C30313 | 200 | MATCH |
| 59 | update_case | SBR-WO-05 | C30314 | 200 | MATCH |
| 60 | update_case | SBR-WO-06 | C30315 | 200 | MATCH |
| 61 | update_case | TU-COL-01 | C38859 | 200 | MATCH |
| 62 | update_case | TU-ELL-02 | C30405 | 200 | MATCH |
| 63 | update_case | TU-EXP-01 | C30434 | 200 | MATCH |
| 64 | update_case | TU-EXP-04 | C30437 | 200 | MATCH |
| 65 | update_case | TU-EXP-06 | C30439 | 200 | MATCH |
| 66 | update_case | TU-LOC-05 | C30446 | 200 | MATCH |
| 67 | update_case | TU-VIS-01 | C30447 | 200 | MATCH |
| 68 | update_case | WIP-COL-01 | C30466 | 200 | MATCH |
| 69 | update_case | WIP-COL-02 | C30467 | 200 | MATCH |
| 70 | update_case | WIP-FLT-06 | C30503 | 200 | MATCH |
| 71 | add_case | SBC-LOC-04 | C38912 | 200 | MATCH |
| 72 | add_case | SBR-LOC-05 | C38913 | 200 | MATCH |
| 73 | add_case | PV-FILT-14 | C38914 | 200 | MATCH |
| 74 | add_case | TU-LOC-06 | C38915 | 200 | MATCH |
| 75 | add_case | WIP-FLT-09 | C38916 | 200 | MATCH |
| 76 | add_case | IV-LOC-06 | C38917 | 200 | MATCH |
| 77 | add_case | WIP-EXP-10 | C38918 | 200 | MATCH |

## Honesty notes

- **Nothing in this push was live-verified against a running build** (Rule 12) — the Report
  Suite QA branch is still unavailable to us. All 472 cases remain **VIU-Pending**.
- Three of the pushed changes will **FAIL against today's build on purpose**, because they
  follow Chris Ward's product ruling rather than the shipped behaviour: the Sales By Customer
  permission model (SBC-PERM-01 C30098, SBC-PERM-02 C30099, SBC-NAV-01 C30096) and the
  "Sales Representative" rename. Each carries a plain tester note saying so.
- No secrets were written to the repo; credentials were read from `/tmp` only.
