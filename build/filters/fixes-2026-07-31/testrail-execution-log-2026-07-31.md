# TestRail execution log — Filters, 2026-07-31 (EXECUTED)

**Authorization:** user-authorized 2026-07-31 (the 4 immediate FIX-PLAN fixes + the
authored spec-v1.6 gap cases + the run-352 sync).
**Spec baseline recorded on every case:** **v1.6** — Confluence page 572030978, version
**12**, updated 2026-07-28.
**Scope:** project 1 / suite 1 / group **4110** only. Sections touched: 4111, 4117, 4119,
4120, 4122, 5410. **Run 352 only.**
**Totals: 15 `update_case` calls over 12 distinct cases + 8 `add_case` + 1 `update_run`.
0 `delete_case`, 0 `add_section`, 0 result writes.** Every op HTTP 200, every op re-GET
verified. Machine logs: `oplog-updates.json`, `oplog-adds.json`, `new-cids.json`,
`run352/`.

---

## 1. `update_case` — 12 cases (pass 1, then a refs re-push, then 3 wording cleanups)

| Case | Internal ID | Section | HTTP | re-GET |
|---|---|---|---|---|
| [C29559](https://shopview.testrail.io/index.php?/cases/view/29559) | FLT-BAR-03 | 4111 | 200 | **MATCH** |
| [C29612](https://shopview.testrail.io/index.php?/cases/view/29612) | FLT-TAB-05 | 4120 | 200 | **MATCH** |
| [C38879](https://shopview.testrail.io/index.php?/cases/view/38879) | FLT-URL-05 | 4122 | 200 | **MATCH** |
| [C29598](https://shopview.testrail.io/index.php?/cases/view/29598) | FLT-CHIP-04 | 4117 | 200 | **MATCH** |
| [C29607](https://shopview.testrail.io/index.php?/cases/view/29607) | FLT-EMPTY-02 | 4119 | 200 | **MATCH** |
| [C38883](https://shopview.testrail.io/index.php?/cases/view/38883) | FLT-PSRCH-01 | 5410 | 200 | **MATCH** |
| [C38884](https://shopview.testrail.io/index.php?/cases/view/38884) | FLT-PSRCH-02 | 5410 | 200 | **MATCH** |
| [C38886](https://shopview.testrail.io/index.php?/cases/view/38886) | FLT-PSRCH-03 | 5410 | 200 | **MATCH** |
| [C38888](https://shopview.testrail.io/index.php?/cases/view/38888) | FLT-PSRCH-04 | 5410 | 200 | **MATCH** |
| [C38889](https://shopview.testrail.io/index.php?/cases/view/38889) | FLT-PSRCH-05 | 5410 | 200 | **MATCH** |
| [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | FLT-PSRCH-06 | 5410 | 200 | **MATCH** |
| [C38893](https://shopview.testrail.io/index.php?/cases/view/38893) | FLT-PSRCH-07 | 5410 | 200 | **MATCH** |

**Two honest deviations from a single clean pass, both self-corrected:**

1. **TestRail normalizes the `refs` field** as a comma-separated reference list and
   strips the space after each comma. Pass 1 therefore re-GET-**MISMATCHED** on 6 cases
   (C38879, C38886, C38888, C38889, C38891, C38893) — **content identical, spacing only**.
   All 20 refs strings (12 updates + 8 adds) were rewritten **comma-free** (semicolons and
   dashes) and the 12 updates re-pushed: live now byte-identical to local. Both passes are
   in `oplog-updates.json`.
2. **Three cases carried "(VIU-confirm …)" inside a tester-facing Expected line** (taken
   verbatim from FIX-PLAN F1a/F5 and one new case). That breaks the VIU-word-free import
   rule and Rule 7 (a manual tester does not know what "VIU" means). Caught by the
   generator's hygiene check *after* the push, reworded in plain English and re-pushed:
   **C29559, C38879, C38902** — HTTP 200 + re-GET MATCH. The VIU-confirm flags now live in
   the internal `notes` layer only.

## 2. `add_case` — 8, all HTTP 200 + re-GET MATCH

Each carries `custom_atmstatus: 3` + `custom_automation_type: 0` (non-API, verified on
re-GET), plus title / preconditions / steps / expected / refs / priority / type.

| Internal ID | New case | Section | Type / Priority |
|---|---|---|---|
| FLT-URL-06 | **[C38896](https://shopview.testrail.io/index.php?/cases/view/38896)** | 4122 URL State and Shareable Links | Negative / Medium |
| FLT-EMPTY-03 | **[C38897](https://shopview.testrail.io/index.php?/cases/view/38897)** | 4119 Empty State | Functional / High |
| FLT-PSRCH-08 | **[C38898](https://shopview.testrail.io/index.php?/cases/view/38898)** | 5410 Page Search Toolbar | Functional / Medium |
| FLT-PSRCH-09 | **[C38899](https://shopview.testrail.io/index.php?/cases/view/38899)** | 5410 | Functional / High |
| FLT-PSRCH-10 | **[C38900](https://shopview.testrail.io/index.php?/cases/view/38900)** | 5410 | Functional / High |
| FLT-PSRCH-11 | **[C38901](https://shopview.testrail.io/index.php?/cases/view/38901)** | 5410 | Functional / Medium |
| FLT-PSRCH-12 | **[C38902](https://shopview.testrail.io/index.php?/cases/view/38902)** | 5410 | Negative / High |
| FLT-PSRCH-13 | **[C38903](https://shopview.testrail.io/index.php?/cases/view/38903)** | 5410 | Functional / Medium |

## 3. Run 352 sync (Standing Rule 34) — 1 `update_run`, all assertions PASS

Run **352 "Filters - Ahtasham (Awaiting QA- ENV)"** — `include_all` **false** (confirmed
before and after), `is_completed` false.

| Step | Result |
|---|---|
| `get_run/352` BEFORE | snapshot `run352/get_run-BEFORE.json` |
| `get_tests/352` BEFORE | **94 tests / 94 distinct case_ids** (`run352/get_tests-BEFORE.json`) |
| `get_results_for_run/352` BEFORE | **395 result records** (`run352/get_results-BEFORE.json`) |
| Union computation | `set(current) ⊆ union` **PASS**; `len(union) == 94 + 8 = 102` **PASS** (`run352/case-ids.json`) |
| `update_run/352` | **HTTP 200** (`case_ids` = the 102-id union; `include_all` left false; nothing else changed) |
| Verify test count | **102 == expected 102** — PASS |
| Verify all 94 prior case_ids present | **PASS** (0 missing) |
| Verify all 8 new case_ids present | **PASS** |
| Verify no extra case_ids | **PASS** |
| Verify results count UNCHANGED | **395 → 395** — PASS (no result was written, changed or lost) |
| Verify `include_all` still false | **PASS** |

**Run 352: 94 → 102 tests. No other run was read or written.**

## 4. Post-push reconciliation

| Check | Result |
|---|---|
| Live cases under group 4110 | **102** |
| `testrail-id-map.csv` non-blank C-ids | **102** — equal both ways (0 live-not-in-map, 0 map-not-live) |
| id-map rows | **118** (102 pushed + **16 deliberately blank**: FLT-PARTS ×4, FLT-RPTS ×3, FLT-SRCH ×9) |
| Import regenerated | `testrail-import/filters-v1-testrail-import.csv` + `.xlsx`, **118 rows** |
| Import header | **byte-identical** to the simple-flow and report-suite imports (md5 of header row matches) |
| Hygiene | **VIU occurrences 0**, feature-flag words 0, duplicate titles **NONE**, duplicate internal ids **NONE**, rows missing Preconditions/Steps/Expected **NONE** |
| Rule 4 | 6 API cases, all in **"API — Work Orders List Filtering"**; none of the 8 new cases is API-content |
| Rule 19 titles | all 20 touched/new titles ≤ 80 chars (50–75); the 39 **pre-existing** over-length titles remain the standing trim queue |
