# Schedule Epic SV-8685 — Jira Ingest Summary

- **Ingested:** 2026-07-28 (live Atlassian REST v3, reusing the saved /tmp session; `GET /rest/api/3/myself` = HTTP 200 as Bilal Muzamil).
- **Method:** `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` (session was still alive — no re-login/OTP needed).
- **Epic:** SV-8685 — "Schedule — Technician Scheduling Module" — Status **Open**, Priority Medium, PO **Branko**.
- **Child stories found:** **EXACTLY 15** (cross-checked two ways: `parent = SV-8685` = 15 AND `"Epic Link" = SV-8685` = 15 — identical set, `isLast=true`, no paging remainder).
- **Attachments:** 0 across the epic + all 15 stories. **Comments:** 0 across all. No images/videos to analyze.
- **Epic description:** full Problem/Goal/Scope(Included+Deferred)/Stories/Key-Decisions/Related-Issues captured in `requirements-SV-8685.md`.
- **Epic issue links (10, context only):** SV-8038 (Done), SV-5339 (Open), SV-8048 (Ready to Fix), SV-8558 (OBSOLETE), SV-5737, SV-3550, SV-3397, SV-5735, SV-3620 (Board Backlog), SV-5331 (Open).

## Story table

| # | Key | Title | Status | Cmts | Att | Maps to our Schedule area(s) | PRD anchors |
|---|-----|-------|--------|------|-----|------------------------------|-------------|
| 1 | SV-8686 | Schedule Grid Layout & Navigation | Open | 0 | 0 | Navigation and Layout; Grid Toolbar; (perf/responsiveness edge) | §3.2, §6, §11, §14.4 |
| 2 | SV-8687 | Work Order Sidebar & Mini Calendar | Open | 0 | 0 | Sidebar - Mini Calendar / WO List & Search / WO Filters / Line Drill-Down | §3.1, §5.1, §5.2, §11, §14.2 |
| 3 | SV-8688 | Drag-and-Drop Scheduling & Shift Creation | Open | 0 | 0 | Drag-and-Drop Scheduling; Shift Start Times and Unassigned Shifts | §4.1, §4.2, §4.3, §7, §14.1 |
| 4 | SV-8689 | Scope Picker | Open | 0 | 0 | Scope Picker | §4.3, §4.1 |
| 5 | SV-8690 | Shift Block Anatomy & Scope Labeling | Open | 0 | 0 | Shift Block Anatomy | §4.4, §10 |
| 6 | SV-8691 | Multi-Day Spread Scheduling | Open | 0 | 0 | Multi-Day Spread Scheduling; (spread edge cases) | §4.5 |
| 7 | SV-8692 | Linked Series & Banners | Open | 0 | 0 | Linked Series and Banners; Deletion, Series Scopes and Undo | §4.6, §7 |
| 8 | SV-8693 | Overlap & Lane Stacking | Open | 0 | 0 | Overlap and Lane Stacking | §4.7 |
| 9 | SV-8694 | Day View Timeline Interactions | Open | 0 | 0 | Day View Timeline | §4.8 |
| 10 | SV-8695 | Shift Detail Modal & Hover Tooltips | Open | 0 | 0 | Shift Detail Modal; Hover Tooltips; Reassignment (drag) | §4.9, §4.13, §7, §14.1 |
| 11 | SV-8696 | Events | Open | 0 | 0 | Events | §4.10, §4.11, §4.13, §9 |
| 12 | SV-8697 | Conflict Detection | Open | 0 | 0 | Conflict Detection | §4.11 |
| 13 | SV-8698 | Capacity Visualization | Open | 0 | 0 | Capacity Bars | §4.12, §9 |
| 14 | SV-8699 | Working Hours Settings | Open | 0 | 0 | **NO existing section — GAP** (only consumption is tested, not the editor) | §4.2 (settings editor) |
| 15 | SV-8700 | View Options, Color System & Display Customization | Open | 0 | 0 | Filter and Display and View Options; Color System; Keyboard Interactions; (left-click menu) | §9, §10, §11, §4.10, §7 |

## Cross-cutting (no single-story owner)
- **Permissions** (§14.x — View/Edit/Delete tiers, dependencies, WO:View dependency, department rows, Time Clock) is described PRD-wide and referenced by several stories' §14 bullets, not owned by one story → maps to the **epic SV-8685** (with a few permission cases that map cleanly to a specific story — see RECONCILIATION.md).
- **Toast / Undo** (§7) is a cross-cutting interaction pattern referenced by SV-8688, SV-8692 etc.

## Files in this folder
- `requirements-SV-8685.md` … `requirements-SV-8700.md` — one per issue (epic + 15 stories): key/type/status/labels/priority/links + full description + comments + attachment inventory.
- `INGEST-SUMMARY.md` — this file.
- `RECONCILIATION.md` — story→case map, deltas/gaps, and the epic-key backfill plan.
