# SV-8593 — [Reports Suite][A5] FE report shell (table/remembered-view/filters/themes/nav/formatters)

> **Source (pointer only, login-walled):** https://shopview.atlassian.net/browse/SV-8593
> **Ingested:** 2026-07-27 (via Atlassian MCP, live session)
> **Key:** SV-8593 · **Type:** Story · **Epic:** SV-8582 · **PO:** Chris Ward
> **Status:** Open · **Relates to report:** SUITE (shared chassis)
> **Labels:** (none) · **Comments:** 0 · **Attachments:** 0

## Summary
[Reports Suite][A5] FE report shell (table/remembered-view/filters/themes/nav/formatters)

## Description
**Plan:** Reports Suite Tech Plan — Part A / Phase 5 (Foundation). Depends on A2/A3 (envelope + export contract). Buildable in parallel with A4.

**Goal:** Build the shared FE chassis all six reports consume — server-paged table, per-browser remembered view, shared toolbar, two themes, nav, formatters.

**Scope (**`app/`):

* `composables/useReportTableQuery.ts` — paged (NOT infinite) TanStack useQuery, `rowsNumber` from envelope, `disable-virtual-scroll`; keys in `api/reporting/keys.ts`.
* `composables/useRememberedView.ts` — per-browser localStorage, schema-versioned, defensive restore (drop inaccessible location / dead sort column / column-set mismatch), restore synchronously before first fetch, restore beats URL. Migration-path note to `UserPagePreference`.
* `components/ts/reporting/shell/LocationFilter.vue` — location multi-select + pinned "All Locations"; default from `useLocation()` validated against `useMyWorkplaces()`; scoping stays BE-enforced.
* `DateRangeSelector.vue` — enforce 366-day cap.
* `shell/ColumnSelector.vue`, `shell/ReportSearchInput.vue` (page-local, NOT global search), `SubActionsDropDown.vue` (per-item loading).
* `css/app.scss` — theme layer `report-shell--two-tone` / `report-shell--all-white`.
* `ReportLeftMenuNav.vue` — add net-new **Parts** group; report-registration 4-touch contract (route / componentMap / nav / permission).
* `utils/reporting.ts` — formatter module (accounting-parens negatives, margin% 1dp + em-dash, signed Inv. Hrs coloring, "N days", em-dash null).

**Tests (Vitest):** remembered-view round-trip/defensive-drop/version-bump/restore-before-fetch; useReportTableQuery paging/sort/filter key behavior; formatter module; LocationFilter default seed + All-Locations toggle.

**DoD gates:** eslint / vitest related / vue-tsc; compile (Vite up at :7200). Browser-walk deferred to first consuming report (WIP) — shell has no route of its own.

Depends on: A2, A3. Blocks: all six reports (FE).
