# SV-8590 — [Reports Suite][A2] Shared paginated-report contract (RequestDto + Query + count/page helper)

> **Source (pointer only, login-walled):** https://shopview.atlassian.net/browse/SV-8590
> **Ingested:** 2026-07-27 (via Atlassian MCP, live session)
> **Key:** SV-8590 · **Type:** Story · **Epic:** SV-8582 · **PO:** Chris Ward
> **Status:** Open · **Relates to report:** SUITE (shared chassis)
> **Labels:** (none) · **Comments:** 0 · **Attachments:** 0

## Summary
[Reports Suite][A2] Shared paginated-report contract (RequestDto + Query + count/page helper)

## Description
**Plan:** Reports Suite Tech Plan — Part A / Phase 2 (Foundation). PR-2, first foundation phase.

**Goal:** Build the rule-compliant server-side contract every report plugs into (do NOT extend the legacy `ReportRequestPayload`, which violates RequestDto-vs-Query separation and guards "over one year" not 366 days).

**Scope (**`api/`):

* `Reporting/Shared/UI/HTTP/DTO/ReportListRequestDto` — `#[Pagination]` + bounded date range (11 presets + Custom, **366-day cap**) + `search`.
* `Reporting/Shared/Application/ReportListQuery` — plain Query the DTO maps to.
* `Reporting/Shared/Infrastructure/Persistence/PaginatedReportResult` (+ count-and-page helper) — generalizes BinLocationQueryRepository's COUNT-clone + `Paginator` page query → `{collection, pagination:{rowsNumber}}`.
* `Reporting/Shared/Domain/NonVoidInvoicePredicate` — `status NOT IN Status::getNotVoidStatuses()` shared helper.
* Money rule: bless `FixedDecimal2`/`DecimalValue` (HalfAwayFromZero) as round-once helpers; SUM unrounded in SQL.
* Fetchers take a `Connection` via constructor injection (replica-ready seam; no replica in this plan).

**Tests:** rowsNumber correctness, sort-whitelist enforcement, page-size clamp, 366-day boundary (367 rejected), void exclusion.

**DoD gates:** cs-fix / phpstan / pest on `Reporting/Shared`; smoke (container wiring).

Depends on: nothing. Blocks: A3, A5, and all six reports.
