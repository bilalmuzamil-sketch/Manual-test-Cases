# SV-8595 — [Reports Suite][B2] Technician Utilization (TU) report

> **Source (pointer only, login-walled):** https://shopview.atlassian.net/browse/SV-8595
> **Ingested:** 2026-07-27 (via Atlassian MCP, live session)
> **Key:** SV-8595 · **Type:** Story · **Epic:** SV-8582 · **PO:** Chris Ward
> **Status:** OBSOLETE · **Relates to report:** TU
> **Labels:** (none) · **Comments:** 0 · **Attachments:** 0

## Summary
[Reports Suite][B2] Technician Utilization (TU) report

## Description
**Plan:** Reports Suite Tech Plan — Part B / B2. **Spec:** TU page 641400833. Depends on A2, A5. **Complexity: Medium-High** (must reconcile to the cent with the existing Timesheet Activities report).

**Architecture note:** reuse the existing Timesheet Activities methodology (`TimesheetActivity/Services/DataProvider` + `ReportGenerator`) and add a per-technician grouping layer — do NOT re-derive. Compute every displayed number from unrounded values and round once (avoids the Timesheet two-methodology trap). Server-paginate technician rows; per-day rows lazy on expand.

**Scope:**

* DB: none (read-only over technician_task_record, labour_type, workplace, staff).
* BE fetcher: one row per staff who clocked time in range at selected location(s); Total / WO Hours (work_order_id) / Internal Hours (department_id); day-grouping + windowing in ONE report-level timezone (active workplace's); **Est. Lost Labor** = Σ per contributing location (default labor rate × internal hours) — default rate is a `labour_type` row with `is_default=1` (no unique constraint — pick deterministically; workplace may have none → partial/"—"). NULL workplace_id records excluded from valuation. Reconcile to the cent vs Timesheet Activities.
* FE: technician rows + pinned Est. Lost Labor column + tooltip; Summary over visible techs; per-day lazy expand; tech filter on-screen only, location filter reloads; sort resets to Technician A–Z on reload (NOT remembered); Total Hours deep-links to Timesheet Activities filtered to tech+range. All-white theme.

**⚠️ Re-verify at implementation:** Timesheet methodology alignment + `labour_type` default-rate query (TU-BE agent stalled during planning).

**E2E:** reference-breakage scan + happy paths (load, expand tech, deep-link, tech filter, CSV) + edge (no-clocked-time, "—" Est. Lost Labor).

Depends on: A2, A5.
