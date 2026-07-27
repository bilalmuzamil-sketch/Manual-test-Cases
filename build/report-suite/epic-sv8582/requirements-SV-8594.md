# SV-8594 — [Reports Suite][B1] Work In Progress (WIP) report + nightly snapshot cron

> **Source (pointer only, login-walled):** https://shopview.atlassian.net/browse/SV-8594
> **Ingested:** 2026-07-27 (via Atlassian MCP, live session)
> **Key:** SV-8594 · **Type:** Story · **Epic:** SV-8582 · **PO:** Chris Ward
> **Status:** OBSOLETE · **Relates to report:** WIP
> **Labels:** (none) · **Comments:** 0 · **Attachments:** 0

## Summary
[Reports Suite][B1] Work In Progress (WIP) report + nightly snapshot cron

## Description
**Plan:** Reports Suite Tech Plan — Part B / B1. **Spec:** WIP page 703660034. Depends on A2, A5. First report built. **Complexity: High** (new money model + first cross-tenant snapshot cron).

**Architecture note:** WIP does NOT use the paged table — it loads the entire bounded open-WO set in one fetch and does tabs/counts/summary/filters client-side (plain TanStack useQuery, not useReportTableQuery). Still consumes the rest of the shell (all-white theme, remembered-view, LocationFilter, DateRange 366, ColumnSelector, export).

**Scope:**

* DB: `work_order_wip_snapshot` table (one row per open WO per date; join org-purge path; no FK; no reader this version).
* BE fetcher: open-WO set (`type=SERVICE`, open statuses), date anchor = `work_order.start_date`; earned/remaining money model (Labor Earned = Σ min(clocked value, quoted); Parts Earned/Remaining by request status); 4-tab placement; Last Activity from `entity_event`. Delete dead WIP code (segment handler + Dashboard sections).
* 🔴 Nightly snapshot cron `app:reporting:capture-wip-snapshots` — **cross-tenant Golden-Rule exemption** (record in PR "Golden Rule Exemptions" block); EventBridge→ECS RunTask \~08:00 UTC; idempotent delete+reinsert per (workplace, WO, date).
* FE: `WorkInProgressReport.vue` (4 tabs), `WipSummaryStrip.vue` (7-figure band), two-line asset cell, status badge (reuse WO tokens), per-tab Totals row, client filters (advisor/customer/asset), export per tab. Reuse route name/path `WorkInProgress`. `formatLastActivity` added to formatter module.

**E2E (hard-block):** reference-breakage scan (deleted `table_work_in_progress_report` test-id + old nav ids) + happy paths + edge (empty per tab, Estimates all-$0.00, permission-denied nav).

Depends on: A2, A5.
