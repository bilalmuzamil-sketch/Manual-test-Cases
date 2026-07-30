# Schedule coverage re-derivation — TestRail sync MANIFEST (2026-07-31)

**STATUS: EXECUTED** (see `testrail-execution-log-2026-07-31.md`)

**Scope guard:** project 1 / suite 1, **ONLY** the group **4254** subtree and **ONLY run 357**.
No other project, group, section or run is touched. **0 delete_case · 0 delete_section ·
0 result writes.**

## Planned operations — 3 total

| # | Op | Case | Target | Payload |
|---|---|---|---|---|
| 1 | **add_case** | **SCH-PERM-13** (new) | section **4279** "Permissions" | full body + `custom_atmstatus: 3` + `custom_automation_type: 0` (non-API) + refs |
| 2 | **update_case** | **SCH-DND-07** = **C29961** | — | **PARTIAL** payload: `custom_steps`, `custom_expected`, `refs` only |
| 3 | **update_run** (Rule 34) | run **357** "Schedule - Ayesha (VIU Pending)" | — | `case_ids` = **UNION** of the run's current 164 + the 1 new C-id |

`title` is **not** in operation 2's payload (unchanged), so the write is limited to the fields
that actually changed.

## Pre-write safety

* `get_case` snapshot of **C29961** before writing → `pre-push-snapshot/`.
* `get_tests/357` + `get_results_for_run/357` snapshotted before the run write → `pre-push-snapshot/`.
* **Baseline captured 2026-07-31:** run 357 `include_all = **false**` (a fixed selection — it will
  **never** pick up a new case on its own, which is exactly the Rule-34 gotcha), **164 tests**,
  **429 results** (143 status 3 + 286 status-less), 164 untested.
* Every write is verified by a **re-GET byte comparison** of the fields sent; the executor aborts
  on any non-200 or any mismatch.

## Markup-preservation rule (carried over from the previous pass)

16 Schedule cases were reformatted **inside TestRail** into HTML `<ol><li>` lists by another
actor (content identical). **C29961 is NOT one of them** — its live body was re-read this pass
and is plain `1. 2.` text, so writing plain text reverts nobody's formatting. The executor still
sends **partial payloads only** and treats a markup-only difference as no-change (`semeq`), so
the 16 cases can never be clobbered by this pass.

## Rule-34 run sync — the dangerous operation, done safely

`update_run` **REPLACES** the selection, so a partial `case_ids` list would **delete the omitted
tests and their recorded results**. Guards, all asserted before the write:

1. `include_all` re-read live (false → a union write is required).
2. New selection = `sorted(set(current_case_ids) | set(new_case_ids))`.
3. **Assert** `set(current) ⊆ set(new_selection)` (no case may drop out).
4. **Assert** `len(new_selection) == len(current) + 1`.
5. After the write: test count must be **165**, every one of the 164 prior case_ids must still be
   present, and the result count must still be **429** — unchanged.

Run 357 belongs to **Ayesha Khan**. This pass adds the missing test to her run and **never
touches a result**.
