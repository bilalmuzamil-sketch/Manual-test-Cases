# Run-sync execution log — 2026-08-05

**Status: EXECUTED — TWICE.** Authorised by the QA lead, verbatim: *"Please run this sync and the syncs
for other projects too."* Scope = the three ACTIVE projects' runs only (Standing Rule 47).

Per Standing Rule 50 this log records, per operation: the operation · its target · the HTTP status ·
and the verification result. A log recording only `200 OK` is non-compliant.

> ## ⚠️ TWO SYNCS RAN ON 2026-08-05 — PHASES 1–4 BELOW ARE **SYNC 1 ONLY**
>
> **Sync 1** at **17:00:46Z** — run 359 **469 → 473**, adding **C43550 · C43551 · C43552 · C43553**.
> **Sync 2** at **19:14:38Z** — run 359 **473 → 476**, adding **C43557 · C43558 · C43559**.
>
> This log was written at **17:04Z** and describes **sync 1**. **Sync 2 is logged in Phase 5 at the end
> of this file.** Sync 2 re-ran the **same executor** and **overwrote `sync-plan.json`,
> `verification.json` and the `snapshots-*/` files IN PLACE**, so:
>
> - **the JSON and snapshots now in this folder are SYNC 2's**;
> - **sync 1's are preserved in git at commit `33d69b5`** — `git show
>   33d69b5:build/testrail-run-sync-2026-08-05/<file>`.
>
> **Every sync-1 figure in Phases 1–4 was re-sourced from `33d69b5`; every sync-2 figure in Phase 5
> from the working-tree files.** Nothing here was reconstructed from memory. **`update_run` was called
> exactly ONCE PER SYNC, both times on run 359 only; runs 357 and 352 were NEVER written.**

## Phase 1 — SYNC 1: read-only audit and BEFORE snapshots (no writes)

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

## Phase 2 — SYNC 1: the write

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

## Phase 3 — SYNC 1: the two runs that needed nothing

| # | Operation | Target | HTTP | Result |
|---|---|---|---|---|
| — | **`update_run` NOT CALLED** | 357 | — | union (165) == current selection (165); **set-equal both directions**, so a write would have been a pointless risk to 429 result records |
| — | **`update_run` NOT CALLED** | 352 | — | union (110) == current selection (110); **set-equal both directions**, so a write would have been a pointless risk to 443 result records |

## Phase 4 — SYNC 1: independent re-verification (cold read, against the committed snapshots)

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

## Phase 5 — SYNC 2 (19:14:38Z), the second sync of the day

**Run by the Report Suite *"Chris new requirements"* pass, using the SAME executor**
(`tools/run_sync_2026_08_05.py`). Its narrative landed as commit **`2949646`**; the regenerated JSON
evidence in this folder was committed unchanged as **`a34dbe6`**. **Sources for everything below: this
folder's current `sync-plan.json` + `verification.json` + working-tree snapshots**, with run 359's test
count independently re-read live afterwards as **476**.

### Phase 5.1 — what it read (BEFORE state, from `sync-plan.json` / the snapshots)

| Run | `include_all` | Tests before | Results before | Live cases in group | Ours | Foreign | Union | Adding |
|---|---|---|---|---|---|---|---|---|
| **359** | false | **473** | **535** | **481** | **476** | **5** | **476** | **C43557 · C43558 · C43559** |
| **357** | false | **168** | **429** | **168** | **168** | 0 | 168 | — (none) |
| **352** | false | **110** | **457** | **110** | **110** | 0 | 110 | — (none) |

**Two BEFORE figures had moved since sync 1, and neither is damage:** run **357** was already at
**168** tests (the Schedule pass authored **C43554/C43555/C43556** and union-synced its own run in
between), and run **352** held **457** results rather than 443 (**+14 graded by Ahtasham** in the
interval). See §2B of `RUN-SYNC-2026-08-05.md`.

### Phase 5.2 — the write

| # | Operation | Target | Payload | HTTP | Verification |
|---|---|---|---|---|---|
| 1 | **`update_run`** | **359** | `{"include_all": false, "case_ids": [<full 476-item UNION>]}` | **200** | **VERIFIED — see 5.3** |

**Union derivation:** `sorted(set(current 473) | set(ours 476))` = **476**; the five foreign cases
(C38919–C38923) **excluded from the union and absent from the run**, so there was nothing to preserve.

### Phase 5.3 — verification, verbatim from `verification.json`

| Clause | Outcome |
|---|---|
| Run record, field by field | **35 fields compared; moved = `['untested_count', 'updated_on']`** — all derived counters. **The specific counter values are NOT recorded in this sync's `verification.json`, so they are not quoted here rather than reconstructed.** |
| `case_id` set vs union | **got 476 / want 476; `got − want` empty, `want − got` empty** — equal in BOTH directions |
| Test count | **473 → 476**, expected 476 |
| Prior tests by id | **473 checked by id, lost 0, rebound 0** |
| Prior results by id | **535 checked BY ID, missing 0** |
| Graded-field changes on those 535 | **0** |
| Declared echoes `case_title` / `case_refs` | **0 moved** (`echoes_moved = {}`) |
| New results during the window | **0** — *"none may be ours — we call no add_result"* |

### Phase 5.4 — the two runs that needed nothing, again

| Operation | Target | Result |
|---|---|---|
| **`update_run` NOT CALLED** | **357** | `wrote: false`, reason *"union == current selection"* (168 == 168) — **429 result records never at risk** |
| **`update_run` NOT CALLED** | **352** | `wrote: false`, reason *"union == current selection"* (110 == 110) — **457 result records never at risk** |

## Operation totals

**SYNC 1 (17:00Z):**

| | Count |
|---|---|
| `update_run` | **1** (run 359) |
| `add_result` or any result write | **0** |
| `add_run` · `delete_run` · `close_run` | **0** |
| `update_case` · `add_case` · `delete_case` · `add_section` | **0** |
| Run fields changed other than the case selection | **0** |
| Runs 278 / 324 / 325 read or written | **0** |
| Foreign cases added to any run | **0** |

**SYNC 2 (19:14Z):**

| | Count |
|---|---|
| `update_run` | **1** (run 359) |
| `add_result` or any result write | **0** |
| `add_run` · `delete_run` · `close_run` | **0** |
| Run fields changed other than the case selection | **0** |
| Runs 278 / 324 / 325 read or written | **0** |
| Foreign cases added to any run | **0** |

**BOTH SYNCS COMBINED: `update_run` ×2, both on run 359 only (469 → 473 → 476). Runs 357 and 352 were
NEVER written by either sync. 0 result writes, 0 run creations/deletions/closures, 0 foreign cases
added, 0 out-of-scope runs touched.**

*(The `update_case` / `add_case` row is deliberately omitted from the sync-2 table: that sync ran inside
a Report Suite pass which DID make authorised case writes of its own — 16 TestRail ops per commit
`2949646`. Those are logged in that pass's own execution log, not here. **What is asserted here is only
that the run-sync step itself wrote nothing but the one `update_run`.**)*
