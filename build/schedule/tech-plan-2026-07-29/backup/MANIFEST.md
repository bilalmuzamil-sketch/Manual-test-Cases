# Backup MANIFEST — tech-plan reconciliation edits (2026-07-29)

Pre-edit copies taken BEFORE any Phase-3 change (LOCAL only — no TestRail writes).
Restore any file by copying it back over `build/schedule/<name>`.

| Backed-up file | Why it was edited | Cases touched |
|---|---|---|
| `cases-A-navigation-sidebar.json` | tester-facing edit | SCH-WOL-05 (C29940) — expected #3 paged-loading note + tech-plan note |
| `cases-B-dnd-scope-spread-series.json` | notes-only | SCH-START-08 (C29976), SCH-SPREAD-07 (C29983, NQ-1 flag), SCH-SPREAD-08 (C29984, NQ-1 flag) |
| `cases-D-events-conflicts-capacity-tooltips.json` | notes-only | SCH-CONF-01 (C30023, NQ-2 flag), SCH-CONF-02 (C30024, confirmation) |
| `cases-E-toolbar-views-interactions.json` | tester-facing + notes-only | SCH-VIEW-03 (C30044) — expected #4 My-Shifts-hidden note; SCH-DEL-09 (C30065) restore-endpoint note |
| `cases-F-permissions-edge.json` | notes-only | SCH-EDGE-02 (C30086, mobile-out-of-scope), SCH-EDGE-05 (C30089, NQ-1 flag) |
| `cases-G-new-scope.json` | notes-only | SCH-HRS-01/02 (C38846/C38847, NQ-3), SCH-HRS-05/06/07 (C38850–C38852, NQ-4), SCH-REAS-06 (C38855, Q4 info). NOTE: this file also shows cosmetic churn in git (unicode escapes → literal §, list indent) — content unchanged beyond the notes. |
| `gen_import.py` | SECTION_ORDER + docstrings updated for the two new sections ("Cross-Module and Rewrite Regression", "API — Schedule") | — |
| `PO-Questions-Branko-Schedule-2026-07-27.md` | QA-internal appendix appended (tech-plan update for Q1/Q2/Q3/Q4/Q5/Q7); reader-facing questions untouched | — |

NEW files (no backup needed — created this pass):
- `cases/cases-H-tech-plan.json` — 13 new cases (SCH-SPREAD-11, SCH-DEL-10,
  SCH-EDGE-07/08, SCH-REG-01..05, SCH-API-01..04), all VIU-Pending, blank C-ids.
- `tech-plan-2026-07-29/Questions-for-Branko-dev.md` — NQ-1..NQ-5.

HELD untouched (pending Branko): SCH-EVT-08 (C30615), SCH-CAP-01..04 (C30030–C30033),
SCH-MODAL-08 (C30015).
