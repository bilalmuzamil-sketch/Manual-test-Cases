# STAGED RUN-357 SYNC — Aug-5 design-review reconciliation — 2026-08-18

**NO SYNC REQUIRED — 0 new cases authored this pass.**

Standing Rule 34 requires a run-sync only after an authorised `add_case` adds cases to the suite
(a run with `include_all: false` does not auto-pick-up new cases). This pass added **0** cases and
edited **0** cases, so **run 357 (Ayesha Khan) needs no change** and no `update_run` is staged.

The 55 new cases authored across the earlier passes (Schedule/Report/Filters) were already
union-synced into runs 357/359/352 on 2026-08-18 (`fabian-review-2026-08-17-CONSOLIDATED/run-sync-2026-08-17/RUN-SYNC-REPORT.md`).

**If Branko later confirms the carryover cluster (E7/E8/E9/E15) or the whole-WO preference (E6) are
V1** (see `RECONCILIATION.md` OUTSTANDING #1/#2), any cases authored then WILL require a union-only
run-357 sync (snapshot `get_tests` + `get_results_for_run` first; send the FULL union; verify every
prior result present by id; `include_all` stays false) — **with the QA lead's explicit per-ask
authorisation**, since run 357 belongs to another tester.
