# SESSION STATE 2026-07-16 — Prod-vs-Staging compare: exec + QA deliverables (cold-resume doc)

## Purpose
If the session/usage limit cuts off, resume EXACTLY from here. Context: user (QA lead, boss-critical deliverable) requires 100% correctness, fool-proof build→independent-adversarial-audit chain on everything, Excel deliverables, zero "NOT VERIFIED" anywhere, Standing Rules 12-15 absolutely.

## DONE (all pushed; verify with git log)
1. Live prod-vs-staging comparison COMPLETE: build/custom-roles-run/Prod-vs-Staging-LIVE-VERIFIED-2026-07-14.xlsx (+.md) — 176 dual cells (130 MATCH / 26 STAGING-MORE / 20 STAGING-LESS), ZERO "NOT VERIFIED", all live-observed both envs (passes 6-13), evidence live-ui-2026-07-15/ + live-ui-2026-07-16/.
2. Spec-conformance columns ("Per Spec (v2)?" + "Per Standing Instructions?") on all 7 verdict tabs — 297 rows. ADVERSARIAL RE-AUDIT (user caught errors) corrected 64 cells; final tally 283 per-spec / 9 DEVIATION rows (=6 distinct findings) / 5 spec-inconsistent rows (=3 items) / 0 silent. Truth table: spec-conformance/spec-truth-table.md. Root cause fixed at 3 layers (extract/generator/workbook), commit 55ce5fe.
3. The 6 deviations: Send-to-Terminal gating-model Foreman/Office/Parts-Tech (D1-D3, org-device gate vs spec Customer-Portal role-gate); Senior SA AP/AR aging = unimplemented spec grant (D4); Office User WO Notes (D5) + Part Return (D6) over-grants vs 7/14 spec (Office WO access removed). 3 contradictions: SM Invoice-Reverse (matrix vs migration-table); Technician Decline-line (§1b vs §4); Send-to-Portal PT/Office/Sales-Rep. Spec-silent: Issue Credit.
4. EXEC deliverable for the boss — CustomRoles_Release-Readiness_Prod-vs-Staging_EXEC_2026-07-16.xlsx (4 tabs) + EXEC-SUMMARY .md, commit 86316c7, then INDEPENDENT ADVERSARIAL AUDIT verdict CLEAN (zero errors, ~40 checks) — file is APPROVED and delivered to user.
5. Memory: Standing Rule 14 (never NOT-VERIFIED for missing data-state — seed & observe, commit 0cec1a2), Standing Rule 15 (spec calls from verbatim truth table + adversarial self-audit, commit 5718f9d), PROD-VS-STAGING-COMPARE-METHOD.md (+§10).
6. Security: prod password redacted from HEAD (131f5bf) but STILL IN GIT HISTORY commit ee7b7e9 — user must rotate the prod credential (reminded multiple times, still open).

## RESOLVED (was "IN FLIGHT at save time") — QA pre-release checklist DONE AND DELIVERED
The QA pre-release checklist is COMPLETE and DELIVERED:
1. Built (commit b3cabcd): build/custom-roles-run/CustomRoles_QA-PreRelease-Checklist_2026-07-16.xlsx — 61 items: 12 P1 / 33 P2 / 7 P3 / 9 coverage gaps; 35 TestRail-mapped; WO-Delete losing set confirmed = 4 roles (Service Advisor, Foreman, Technician, Office User), Parts Technician = MATCH.
2. Independently adversarially audited — 5 errors found & fixed (3 wrong evidence citations, 1 spec-silent miscategorization QA-47, 1 overstated observation date QA-52), re-audited CLEAN, final commit aad5864.
3. Delivered to user with raw GitHub link.

## Open threads beyond this task (unchanged)
- Vlad's Custom Roles spec-recheck vs DONE tickets (blocked: needs Atlassian access in a FRESH session, or user exports tickets).
- Simple Flow: awaiting Milos Round-3. F&D: FD-CUST-016/FD-VAL-007 dup ruling + bug filing. Prod password rotation (above).

## How to resume (ordered) — TASK COMPLETE, nothing in flight
1. git pull; read this doc + git log -15.
2. Steps 2/3 of the original plan are COMPLETE. Current state: ALL THREE DELIVERABLES DELIVERED — the LIVE-VERIFIED workbook + the EXEC release-readiness xlsx (audited clean, 86316c7) + the QA pre-release checklist (audited clean, aad5864). Nothing in flight.
3. Next session: NO pending work on this task. Open threads remain (see section above): Vlad spec-recheck (needs Atlassian fresh session or exported tickets), Milos Round-3 for Simple Flow, F&D FD-CUST-016/FD-VAL-007 dup ruling + bug filing, prod password rotation (ee7b7e9).
4. Everything user-facing: Excel, layman language, TestRail IDs+links, zero NOT-VERIFIED, build→adversarial-audit chain ALWAYS.
