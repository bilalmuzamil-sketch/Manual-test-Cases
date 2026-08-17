# STAGED — Run 357 union sync (NOT executed — awaiting authorization)

**Run 357** = "Schedule — Ayesha Khan" (someone else's run). Under Standing Rules 6 + 34 + core §4.1
step 0, a run write needs the QA lead's **explicit permission, per ask** — an `add_case` approval is
**not** a run-sync approval. **Nothing was written to run 357 this pass.** This manifest is ready to
execute the moment authorization is given.

## Snapshot (read live 2026-08-17T18:3x Z, `run357-snapshot.json`)
| | |
|---|---|
| `include_all` | **false** — so the run is FROZEN at its selection and the 19 new cases will NOT appear until synced |
| Current tests | **176** (176 distinct case_ids) |
| Result records | **549** (must all survive: 90 Passed / 11 Failed / 7 Blocked / 68 Untested) |
| New case_ids | **19** — C43795…C43813 — none currently present |
| **UNION** | **195** = 176 current ∪ 19 new |

## The sync (union-only, core §4.1 — a PARTIAL list DELETES tests and their results)
1. Re-snapshot `get_tests(357)` + `get_results_for_run(357)` immediately before the write, and COMMIT it.
2. `update_run/357` with the **FULL union of 195 case_ids** (`sorted(set(current) | {43795..43813})`) — never a partial list.
3. Verify after: test count == 195, `case_id` sets equal BOTH ways, **every one of the 549 prior results present BY ID**, `include_all` still false.
4. Use a **single-run-scoped executor** (copy `sync_runs_EXECUTOR.py` with SCOPE cut to run 357 only — core §4.1) so runs 352/359 cannot be touched.

**⚠️ The 6 existing cases flagged for UPDATE-but-not-yet-updated (see completion report §Deferred) are
already in run 357 — no run change is needed for them.** Only the 19 NEW cases require the union.
