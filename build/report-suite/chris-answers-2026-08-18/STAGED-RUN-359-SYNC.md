# STAGED — Run 359 union sync for the new WIP case (NOT executed)

**Run 359 belongs to Nebojsa Glavinic / Viktoria Videnovic (Report Suite). Standing Rule 34 / Common
Core §4.1 STEP 0: a run write needs the QA lead's EXPLICIT per-ask authorisation. This pass was told to
STAGE only — nothing was written to run 359.**

## Why a sync is owed
The pass created ONE new case, **WIP-PLACE-05 = C43979**. Run 359 was built with `include_all: false`, so
it is FROZEN and will not pick up a new case automatically. The four UPDATED cases (C30456, C30458,
C30464, C30493) are already tests in the run and need no sync (an update never adds/removes a test).

## Read-only snapshot taken 2026-08-18 (`run359-snapshot.json`)
- `include_all` = **false**
- current tests = **507** (distinct case_ids 507); run counter total 501 untested + 6 passed + 0 failed +
  0 blocked + 0 retest = **507** — matches, so paging was complete (no silent truncation, §3.3).
- result records = **535** (snapshotted for the before/after presence-by-id check).
- **C43979 is NOT yet in the run.**

## The staged operation (UNION ONLY — §4.1)
```
union = sorted(set(current_507_case_ids) | {43979})   # = 508 case_ids
update_run/359  with case_ids = <the full 508 union>   # NEVER a partial list
```
`update_run` REPLACES the selection, so a partial list would DELETE the other 507 tests and their 535
graded results. The union is add-only; the 507 current case_ids are in `run359-snapshot.json`.

## Verify after (if executed)
- test count 507 → **508**; `include_all` still false.
- case_id sets equal BOTH ways for the 507 carried tests; C43979 present.
- **all 535 prior result records present BY ID**, 0 graded fields moved (`status_id · comment · defects ·
  elapsed · version · assignedto_id · created_by · created_on · test_id · case_id · id`); `case_title` /
  `case_refs` echoes are not graded fields (§3.4).
- Scope the executor to run 359 ALONE (copy `sync_runs_EXECUTOR.py` with SCOPE cut to 359).

## Authorisation needed
**QA lead: reply "sync run 359" to add C43979 (the one new WIP case) to the Report Suite run.** Until
then C43979 is live in TestRail (group 4281) but not in run 359.
