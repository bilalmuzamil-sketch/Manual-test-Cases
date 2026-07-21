# Schedule — cases/ (AUTHORED 2026-07-21 — 166 cases, SPEC-ONLY)

The authored test-case source for the **Schedule** project (ShopView App ·
Technician Scheduling Module): **166 cases across 26 sections**, one JSON file per
area group, internal IDs `SCH-<AREA>-NN` (mirroring the `GS-`/`FLT-`/`SF-`/`FD-`
conventions). Schema is identical to `build/filters/cases/*.json`.

| File | Areas | Cases |
|---|---|---|
| `cases-A-navigation-sidebar.json` | Navigation & Layout · Mini Calendar · WO List & Search · WO Filters · Line Drill-Down | 30 |
| `cases-B-dnd-scope-spread-series.json` | Drag-and-Drop · Scope Picker · Start Times & Unassigned · Multi-Day Spread · Series & Banners | 36 |
| `cases-C-blocks-lanes-dayview-modal.json` | Shift Block Anatomy · Lane Stacking · Day View Timeline · Shift Detail Modal | 25 |
| `cases-D-events-conflicts-capacity-tooltips.json` | Events · Conflict Detection · Capacity Bars · Hover Tooltips | 23 |
| `cases-E-toolbar-views-interactions.json` | Grid Toolbar · Filter and Display / View Options · Reassignment & Context Menu · Deletion/Series/Undo · Keyboard · Color System | 35 |
| `cases-F-permissions-edge.json` | Permissions (§14) · Edge Cases & Responsiveness | 17 |

Rules applied:
- **SPEC-ONLY** (no Figma/designs exist — OQ-4): wording uses the spec's own labels
  verbatim; anything the spec does not pin is written generically with a
  **VIU-confirm** note (see `../coverage-matrix.md` §D for the full register). No
  labels invented (Standing Rules 1/9). Every case is `viu_status: VIU-Pending`.
- **NO API cases** (Standing Rule 4): the spec v1.0 contains no API contract —
  explicit exclusion recorded in `../coverage-matrix.md` §C. All cases are
  `api_related: false`.
- Import: `python3 ../gen_import.py` →
  `testrail-import/schedule-v1-testrail-import.csv`/`.xlsx` (pure 1:1 format,
  Standing Rule 16) + `../testrail-id-map.csv` (Standing Rule 8; C-ids blank until a
  permitted TestRail push — re-merge C-ids after any rerun).
- **No TestRail writes without explicit user permission** (Standing Rule 6).

See `../PROJECT-STATE.md` (canonical resume doc) for status and how-to-resume.
