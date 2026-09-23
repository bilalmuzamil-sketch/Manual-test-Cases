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

## STATUS 2026-09-22 — SUITE AUTHORED (39 cases: C88594–C88626 base + C88627–C88632 design/tech-plan gaps)
After the QA lead's Rule-115 instruction, the design (New Dashboard variant only) and the tech plan were explored and reconciled; 6 gap cases added (detail-table columns, New Dashboard visual, At Risk aggregate FR-016, NFR-001 performance, NFR-010 report corrections). See DESIGN-REVIEW-2026-09-22.md for the per-source coverage verdict. NF subfolder = 12179.
Authored the full Dashboards suite into 12166 across 12 per-story subfolders (12167–12178), covering
all 131 PRD requirement anchors (S1–S12), each exactly once. Expected Results in the 2026-09-22 layout
(plain results / Source / exact verbatim quotes, Rule 113); preconditions+steps runnable by a manual
tester (Rule 114); **AUTOMATION: HOLD — not yet build-verified on sv8311** on all 33 (source-verified
only, per QA-lead choice). All fr-view confirmed. Reproducible: `build_dash.py` + `plain-bullets.txt` +
`anchor_lib.py` + `section-map.json`.
| Story (subfolder) | Cases | C-ids |
|---|---|---|
| S1 Access & Entry Point (12167) | 5 | C88594–C88598 |
| S2 One Fixed Layout (12168) | 2 | C88599–C88600 |
| S3 Measure Formulas & Parity (12169) | 3 | C88601–C88603 |
| S4 KPI Hero Tiles (12170) | 4 | C88604–C88607 |
| S5 Count Tiles (12171) | 4 | C88608–C88611 |
| S6 Expanding a Tile (12172) | 5 | C88612–C88616 |
| S7 Per-Tile Date Ranges (12173) | 2 | C88617–C88618 |
| S8 Chart Filters (12174) | 2 | C88619–C88620 |
| S9 Chart Behavior (12175) | 2 | C88621–C88622 |
| S10 Report Drill-In (12176) | 1 | C88623 |
| S11 Chart on the Report Page (12177) | 2 | C88624–C88625 |
| S12 Visual Conformance (12178) | 1 | C88626 |

Outstanding: build verification on sv8311 (offered, gated — flip markers when run); create/sync a test
run (Rule 34); the S1-R7/S3-R1/S1-N9 server-side/analytics checks are flagged in-case as developer/
automated (not manual).

## STATUS 2026-09-22 (later) — DATA-ACCURACY SUITE ADDED → 59 cases total
Per QA-lead Rules 115/116 and the data-correctness mandate, drove the design end-to-end (New Dashboard
only; evidence in design-exploration-2026-09-22/) and added a rigorous **DATA · Accuracy & Report Parity**
suite (subfolder 12180): C88633–C88652 (20 cases) proving each number is correct — exact value from
seeded known inputs, parity with the matching report at every range/filter, and every arithmetic hazard
(ratios pooled not averaged; zero-denominator n/a; void/credit/negative; distinct counting; proportional
tech-time split incl. zero-clock; rounding/precision; sparkline bucket boundaries; timezone/day-boundary;
month-end as-of; workplace scoping; freshness/no-stale-window; internal consistency).
Suite now **59 cases**: 33 base (S1–S12) + 6 design/tech-plan (C88627–88632) + 20 data-accuracy (C88633–88652).
Subfolders: 12167–12178 (S1–S12), 12179 (NF), 12180 (DATA). All AUTOMATION: HOLD (not build-verified).

## PARKED 2026-09-23 — QA lead switched to new project "WO Board and Tech View"
Dashboards left COMPLETE as source-verified authoring: 59 cases (33 base + 6 design/tech-plan + 20 data-accuracy),
subfolders 12167–12180, all AUTOMATION: HOLD. Design driven end-to-end (New Dashboard only). Per-source coverage
verdict in DESIGN-REVIEW-2026-09-22.md. Outstanding: build verification on sv8311; test-run creation; PO questions
(red KPI headline colour rule; Sales-by-Customer "Labor Delta" column; ratio-denominator workplace-scoping open item).
