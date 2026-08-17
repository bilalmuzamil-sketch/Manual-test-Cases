# STAGED — Run 352 sync (Filters) — NOT EXECUTED, needs authorization

**Run 352 "Filters - Ahtasham" belongs to Ahtasham Amjad. It was NOT written this pass.**
`update_run` is the most destructive TestRail call we make (a partial list deletes graded
results), and per Common-core §4 step 0 a run write needs explicit per-ask authorization even
when a sync is mandatory after add_case. Task instruction this pass: **STAGE only, no run-352 write.**

## Snapshot taken (read-only), 2026-08-17
- `include_all`: **False** (frozen selection — new cases never appear automatically)
- Tests: **120** · Result records: **648** · Counts: 81 Passed / 8 Failed / 4 Blocked / 27 Untested
- The **9 new cases are missing** from the run: C43841, C43842, C43843, C43844, C43845, C43846,
  C43847, C43848, C43849.
- No OTHER of our cases is missing (the 60 updated cases were already in the run).

## The union to apply (when authorized)
`sorted(set(current 120 case_ids) | set(9 new)) = 129 case_ids`.
- Snapshot `get_tests` + `get_results_for_run` first and COMMIT it.
- `update_run` with the **FULL 129-case union** (never a partial list).
- Verify after: 129 tests, case_id sets equal both ways, **all 648 prior results present BY ID**,
  `include_all` still False. Use a single-run-scoped executor (§4).

Current case_id list is committed in `run352-snapshot.json`.

## OUTSTANDING
Ahtasham's authorization to add the 9 new cases to run 352. Until then the 9 are live in the suite
but not in his run (a false coverage gap for a reviewer looking only at the run — the exact
2026-07-31 Filters incident).
