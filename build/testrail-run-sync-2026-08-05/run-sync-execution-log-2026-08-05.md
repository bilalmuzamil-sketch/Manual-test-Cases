# Run-sync execution log — 2026-08-05

**Status: EXECUTED.** Authorised by the QA lead, verbatim: *"Please run this sync and the syncs for
other projects too."* Scope = the three ACTIVE projects' runs only (Standing Rule 47).

Per Standing Rule 50 this log records, per operation: the operation · its target · the HTTP status ·
and the verification result. A log recording only `200 OK` is non-compliant.

## Phase 1 — read-only audit and BEFORE snapshots (no writes)

| # | Operation | Target | HTTP | Result |
|---|---|---|---|---|
| 1 | `get_cases` (paged, 250/page) | project 1 / suite 1 | 200 | 4 055 cases read; last chunk short, so the list is complete |
| 2 | `get_sections` (paged, 250/page) | project 1 / suite 1 | 200 | 625 sections read — **paging is mandatory here**, an unpaged call returns 250 and silently finds zero Filters sections (playbook §J) |
| 3 | `get_run` | 359 | 200 | `include_all` **false**; 469 tests; name *Reports Suite - Nebojsa/Viktoria (VIU Pending)* |
| 4 | `get_tests` (paged) | 359 | 200 | 469 tests captured in full |
| 5 | `get_results_for_run` (paged) | 359 | 200 | **535** result records captured in full |
| 6 | `get_run` | 357 | 200 | `include_all` **false**; 165 tests |
| 7 | `get_tests` (paged) | 357 | 200 | 165 tests captured in full |
| 8 | `get_results_for_run` (paged) | 357 | 200 | **429** result records captured in full |
| 9 | `get_run` | 352 | 200 | `include_all` **false**; 110 tests |
| 10 | `get_tests` (paged) | 352 | 200 | 110 tests captured in full |
| 11 | `get_results_for_run` (paged) | 352 | 200 | **443** result records captured in full |
| 12 | `get_case` ×4 | C43550, C43551, C43552, C43553 | 200 ×4 | each confirmed `created_by = 3` (ours) and inside group 4281 — authorship verified per case, not assumed from the brief |

**All three snapshots were written to `snapshots-before/` and committed to git (commit `529a3fa`)
BEFORE any write.** A snapshot that is not persisted is not a snapshot.

## Phase 2 — the write

| # | Operation | Target | Payload | HTTP | Verification |
|---|---|---|---|---|---|
| 13 | **`update_run`** | **359** | `{"include_all": false, "case_ids": [<full 473-item UNION>]}` | **200** | **VERIFIED — see below** |

**Union derivation:** `sorted(set(current 469) | set(ours 473))` = **473**. Asserted a superset of
the current selection before the request was built; asserted to contain none of the five foreign
cases. **Never a replacement list, never a diff.**

**Verification of operation 13, every clause checked:**

| Clause | Outcome |
|---|---|
| Run record, field by field | 35 fields compared; **only `untested_count` (463 → 467) and `updated_on` moved** — both derived. `passed_count` 6 → 6, `failed_count` 0 → 0, `blocked_count` 0 → 0, `retest_count` 0 → 0. Name, description, `milestone_id` (None), `assignedto_id` (None), `include_all` (false) all byte-identical. |
| `case_id` set vs union | **equal in BOTH directions** (`got − want` = ∅, `want − got` = ∅) |
| Test count | 469 → **473**, expected 473 |
| Prior tests by id | **469 / 469 present**; lost 0; **rebound 0** (no test id re-pointed at another case) |
| Prior results by id | **535 / 535 present**; missing 0 |
| Graded fields on all 535 | **0 changes** — `status_id · comment · defects · elapsed · version · assignedto_id · created_by · created_on · test_id · case_id · id · attachment_ids` |
| Declared echoes `case_title` / `case_refs` | **0 moved** (no case was written this pass, so none should — playbook §J #2 / #2b) |
| New results during the window | **0** |

## Phase 3 — the two runs that needed nothing

| # | Operation | Target | HTTP | Result |
|---|---|---|---|---|
| — | **`update_run` NOT CALLED** | 357 | — | union (165) == current selection (165); **set-equal both directions**, so a write would have been a pointless risk to 429 result records |
| — | **`update_run` NOT CALLED** | 352 | — | union (110) == current selection (110); **set-equal both directions**, so a write would have been a pointless risk to 443 result records |

## Phase 4 — independent re-verification (cold read, against the committed snapshots)

Re-read all three runs from TestRail and diffed against the **committed** BEFORE snapshots rather
than the executor's in-memory copies, so the verdict does not depend on the script that did the
writing.

| Run | Tests | Prior tests lost / rebound | Prior results present by id | Graded-field changes | Other-field changes | New results |
|---|---|---|---|---|---|---|
| 359 | 469 → **473** | 0 / 0 | **535 / 535** | **0** | **0** | **0** |
| 357 | 165 → **165** | 0 / 0 | **429 / 429** | **0** | **0** | **0** |
| 352 | 110 → **110** | 0 / 0 | **443 / 443** | **0** | **0** | **0** |

**1 407 result records across the three runs, every one present by its own id and byte-identical
field for field.**

## Operation totals

| | Count |
|---|---|
| `update_run` | **1** (run 359) |
| `add_result` or any result write | **0** |
| `add_run` · `delete_run` · `close_run` | **0** |
| `update_case` · `add_case` · `delete_case` · `add_section` | **0** |
| Run fields changed other than the case selection | **0** |
| Runs 278 / 324 / 325 read or written | **0** |
| Foreign cases added to any run | **0** |
