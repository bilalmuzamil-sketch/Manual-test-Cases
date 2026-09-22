# Dashboards — design review & reconciliation (2026-09-22)

Read AFTER authoring the 33 PRD-based cases, because the QA lead asked whether the design was explored.
Design source: `sources/design/ShopView Dashboard Directions.html` (Claude "Directions" export; real values
from the QA Testing workplace). Extracted text: `sources/design/DESIGN-extracted-text-2026-09-22.txt`.

## Verdict
The design is a **layout-directions** doc, not a per-field spec. The chosen "nested" direction (four hero
KPIs + two count heroes, each expanding to its own chart+table, one panel at a time, light/dark, sparkline
not deltas) **matches the PRD Story 6 exactly**. The design **confirms** the PRD and introduces **no new
requirement** the PRD lacks. Requirement coverage against the PRD stays complete (131/131 anchors).

## What the design CONFIRMS (already covered by our cases)
- Nav order: … Reports · Dashboard … (S1-R5); "View details" control (S6-R1); date control + report link
  on hero tiles (S4-R1, S10-R1); Advisor filter / Technician filter on charts (S8); 0%–200% chart axis
  (S9); At Risk inactivity-window control (S5-R10); Sales by Customer "{n} customers · Top: {name}" (S5);
  count heroes styled as headline counts, not dollars (S5); light + dark (S12); embedded chart on report
  page with Show/Hide (S11).

## Design DETAIL beyond the PRD anchors (testable, not currently checked explicitly)
These come from the existing reports' own tables (the dashboard reuses the reports), so they are detail
the PRD deferred rather than new requirements — but a tester expanding a tile will see them:
- Expanded detail-table COLUMNS per tile:
  - Advisor Analysis: Advisor · Worked Hours · Invoiced Hrs · Billing Efficiency · ELR
  - Technician Efficiency: Tech · Clocked Hrs · Invoiced Tech Hrs · Efficiency
  - Technician Utilization: Tech · WO Hours · Internal Hours · Total Hours · Utilization %
  - Sales by Customer: Customer · Invoices · Labor Delta · Subtotal  (+ pagination "1–10 of 15")
  - At Risk Customers: Customer · Last Invoice Date · Lifetime Invoices · Revenue (12 Mo)
- Affordance naming: date control = blue "filter pill"; report link = arrow-in-a-square icon beside the
  hero name.

## Assessment — will it bite?
- Requirement coverage vs the AUTHORITATIVE source (PRD 788430850): COMPLETE, 131/131, design confirms it.
- Gaps are DETAIL/visual granularity, not missing requirements: (a) expanded-table column content;
  (b) Sales-by-Customer table pagination; (c) affordance naming; (d) our S12 visual case is thin vs the
  rich design.
- The expanded tables are the matching reports' own tables, so their columns are covered indirectly by
  the parity rules (S3-R1, S6-R2..R8, S11-R7) — but not asserted column-by-column.

## Recommendation (proposed, awaiting go-ahead)
Add a small design-sourced tranche (cited to the design per Rule 57): one "expanded detail-table columns"
case per tile area + one strengthened visual-conformance case (nested layout, filter pill, report icon,
hero vs count sizing, light/dark). ~4–6 cases into the existing subfolders. Nothing in the current 33 is
wrong; this is additive thoroughness.

## CORRECTION + gap cases added (2026-09-22, after driving the design)
Rendered the design with headless Chromium. The default/flat view is the **"Current"** baseline (its own
caption: "the real dashboard today … the baseline this nesting is meant to shorten") — NOT ours. The
**"New Dashboard"** variant is the nested one (collapsed hero cards, each expanding to ONE full-width
panel that swaps, KPIs defaulting to This Month). All design-sourced cases below take the New Dashboard
only; nothing was taken from Current.

Added 6 cases (C88627–C88632), same 2026-09-22 Expected layout, AUTOMATION: HOLD:
- **C88627 (S6)** expanded KPI detail-table columns (Advisor Analysis; Technician Efficiency; Technician Utilization) — design.
- **C88628 (S6)** expanded count detail-table columns — Sales by Customer (Labor Delta + pagination) and At Risk — design.
- **C88629 (S12)** New Dashboard visual — nested cards, one swapping panel, blue filter pill, arrow-in-square report icon, light/dark — design.
- **C88630 (S5)** At Risk supporting-line revenue is the all-at-risk aggregate, never the displayed rows — tech plan FR-016.
- **C88631 (NF)** performance budget + per-tile 2s circuit breaker — tech plan NFR-001 (HOLD: needs load measurement).
- **C88632 (NF)** Sales & Service Advisor Analysis void/no-company corrections + release note (void-then-reinvoice can move a figure up) — tech plan NFR-010.

## Per-source coverage verdict (Rule 115 / Rule 43)
| Source | Covered | Notes |
|---|---|---|
| **PRD 788430850 (v1)** | ✅ 131/131 anchors, S1–S12 | authoritative; 33 base cases |
| **Design — New Dashboard variant** | ✅ reconciled + gaps added | confirms PRD; detail-table columns + nested-visual added (C88627-29); "Current" baseline deliberately excluded |
| **Tech plan (.md)** | ✅ FR-table maps to S-anchors (covered); ADDs authored | NFR-001 perf (C88631), NFR-010 report corrections (C88632), FR-016 aggregate (C88630) |
| **Epic SV-490 + stories** | ✅ | cases trace to SV-9573..9584 only; obsolete SV-93xx/9451/9699 excluded |

**Deliberately NOT authored (with reason):** the tile "i" info-icon (design decoration; not a PRD/tech-plan
requirement — build/PO to confirm if it carries content); NFR-002…009 (internal engineering: batched
request, read-replica, EXPLAIN, APM — not user-observable, supported indirectly by parity/independent-load
cases). **Open question to raise (do not invent, Rule 58):** tech-plan §7 blocker 1 — is the ratio
denominator workplace-scoped so a workplace with no clock records yields "n/a" rather than an empty tile?
