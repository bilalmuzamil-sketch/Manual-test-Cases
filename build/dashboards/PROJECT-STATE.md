# Dashboards — PROJECT-STATE (canonical cold-resume doc)

**Started:** 2026-09-22 (authoring). **PO / spec owner:** Chris Ward. **Manual tester:** TBC.
**TestRail:** group **12166** "Dashboard (Sep 2026)", suite 1 — empty at start (0 subfolders, 0 cases).
Link: https://shopview.testrail.io/index.php?/suites/view/1&group_id=12166

## What this is
Dashboard v1 (epic **SV-490**) — one fixed, read-only manager dashboard: six tiles (4 KPI: Revenue,
Billing Efficiency, Technician Efficiency, Technician Utilization; 2 count: Sales by Customer, At Risk
Customers), each with a sparkline, per-tile date range, expand-to-detail, and a drill-in to its report.
Plus the dashboard chart embedded on four report pages. **Central rule: every dashboard figure equals
its matching report's figure (S3-R1).** It is a REBUILD — the old customizable dashboard is deleted;
per-user customization/edit-mode/presets are OUT OF SCOPE.

## Sources (Rule 57), in build/dashboards/sources/
- **PRD — Confluence 788430850 "Dashboard" (Dashboard v1)**, owner Chris Ward, last modified 2026-09-16.
  Saved verbatim: `sources/CONFLUENCE-788430850-Dashboard-v1-2026-09-22.md`. **THE authoritative source.**
  Clean anchor scheme S1..S12, each with R#/N#/E#. QA env `https://sv8311.qa.shopview.com`, branch
  `SV-8311-dashboard-v1`.
- **Tech plan** `sources/Dashboard-v1-Technical-Implementation-Plan.md` (2026-09-16). Engineering doc —
  informs, never overrules (Rule 30/57). Notes it is a rebuild; reports' calculations are kept.
- **Design** `sources/design/ShopView Dashboard Directions.html` (Claude design export). Story 12 cites it.
- **Epic SV-490** — CURRENT stories **SV-9573 (S1) … SV-9584 (S12)**, all Open.

## 🔴 Obsolete — never trace a case to these
SV-9341–SV-9352 ("First Visit Opens the Chooser", "Starter Templates", "The Catalog", "Saved Layout
Follows the User", "Customize Dialog", "Edit Mode", "Card Sizing and Packing", …), SV-9451, and the bug
SV-9699 are all **OBSOLETE** — the scrapped customizable-dashboard design. The spec explicitly removes
per-user customization. Cases trace ONLY to SV-9573..SV-9584.

## Story → Jira → TestRail-subfolder map
| Story | Jira | Area |
|---|---|---|
| S1 Access & Entry Point | SV-9573 | access/nav gating, landing, workplace scope |
| S2 One Fixed Layout | SV-9574 | fixed tile set/order, no customization |
| S3 Measure Formulas & Report Parity | SV-9575 | formulas, parity, void exclusion, n/a |
| S4 KPI Hero Tiles | SV-9576 | 4 KPI tiles: label/headline/supporting/sparkline |
| S5 Count Tiles | SV-9577 | Sales by Customer + At Risk (windows, at-risk rule) |
| S6 Expanding a Tile | SV-9578 | view details, one-open, loading/failure, storage |
| S7 Per-Tile Date Ranges | SV-9579 | per-tile ranges, defaults, not remembered |
| S8 Chart Filters | SV-9580 | technician/advisor filters |
| S9 Chart Behavior | SV-9581 | axis scaling/200% cap, ELR on hover |
| S10 Report Drill-In | SV-9582 | report links, opens with tile range |
| S11 Chart on the Report Page | SV-9583 | embedded chart on 4 reports |
| S12 Visual Conformance | SV-9584 | layout, themes, small-screen stacking |

## Method (same as DVI V2)
Author from the PRD anchors, Expected in the QA-lead 2026-09-22 layout (plain results / Source / exact
quotes, Rule 113), preconditions+steps runnable by a manual tester (Rule 114). Per-story subfolders in
12166. Not build-verified yet ⇒ `AUTOMATION: HOLD - not yet build-verified` (Rule 114) until run on
sv8311. Type = NEW feature (not a V1→V2 comparison; old dashboard scrapped, its stories obsolete).

## Currency (Rule 31/32) — confirmed live 2026-09-22
PRD 788430850 last modified 2026-09-16 (read today). Epic SV-490 children read today: SV-9573..9584 Open,
SV-93xx/9451/9699 obsolete. No newer source known.
