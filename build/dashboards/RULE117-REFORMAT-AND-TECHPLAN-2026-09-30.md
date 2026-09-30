# Dashboard — Rule 117 reformat + tech-plan coverage (2026-09-30)

## Reformat (Rule 117)
All **59 of our cases** (folder 12166, sections 12167–12180, `created_by = 3`) reformatted in place to
the locked Rule-117 standard, from live TestRail content:
- **Concise titles** — every title now ≤ 80 chars (verified live).
- **Seeding as standard, MANUAL QA steps** — the previous preconditions used automation language
  ("seeded via API", "storage state", browser-storage keys like `dashboard.expandedTile`); these were
  rewritten as steps a manual tester performs in the app (Customers > New Customer; create/invoice a
  Work Order dated in-range; record clock hours; collapse any open tile), with example values.
- **Build glossary** (Dashboard, tile, View details, KPI hero tiles, Sales by Customer, At Risk,
  sparkline, per-tile date range, chart filters, the reports each tile mirrors).
- **Runnable Expected observations** were already present and were preserved, along with the verbatim
  **Source line + quotes + AUTOMATION marker (byte-for-byte)**.

Scripts: `dash_lib.py`, `dash_v2_a.py` (S1–S12 + NF, 39), `dash_v2_data.py` (DATA, 20).

## Foreign cases — HANDS OFF (Rule 38)
Three cases in the root section 12166 are `created_by = 1` (another author) and were **not touched**:
- C137997 "Embedded Technician Efficiency chart follows real…"
- C137998 "Reports-permitted user lands on Dashboard after re…"
- C137999 "Authenticated user without Reports permission cann…"
Ours: 59 · live total in folder: 62.

## Tech-plan coverage pass (Rule 115) — Dashboard v1 Technical Implementation Plan
The Dashboard suite already carries an **NF (Non-Functional & Tech Plan)** section and a **DATA**
section, so the tech plan was integrated at authoring time. Re-verified against the plan's §1
non-functional table — verdict **CONFIRM (already covered), no ADD, no DIVERGE**:
- **NFR-001** (500 ms budget + 2 s circuit breaker, per-tile failure isolation) → **C88631**.
- **NFR-010** (both report corrections ship with a release note; void-then-reinvoice can move a figure
  up) → **C88632**.
- **NFR-002** (one batched fetch, sections resolve independently, a failed section never blanks others)
  → **C88615** (loading / per-tile failure).
- **NFR-004** (tile and report resolve against the same replica copy) / **no stale window** → **C88652**.
- **NFR-007** (every query tenant-scoped, two gates server-side) → **C88651** (workplace scoping) +
  **C88595** (access enforcement).
- **NFR-008** (At Risk boundaries in the workplace timezone) → **C88644**.
- **NFR-006** (automated parity incl. voided/no-company fixtures) → the whole **DATA** section
  (C88633–C88652).
- **NFR-003 / NFR-005 / NFR-009** (closed-set input validation, EXPLAIN-verified queries + no caching,
  APM spans/Datadog monitors) → developer/automated or ops concerns, correctly not separate manual
  cases.

Note: the file named "Dashboard__Tech_View" is actually the **Work Orders Board-View & Tech-View**
tech plan and belongs to folder 13204 (WO Board), not to the Dashboard — processed with that folder.

## Result
- **59 cases** reformatted to Rule 117 (+ 3 foreign left untouched). Some cases reference the sv8311 QA
  build and may be build-verifiable; AUTOMATION markers were left exactly as authored.
- Tech plan fully covered (CONFIRM). No new cases required.
