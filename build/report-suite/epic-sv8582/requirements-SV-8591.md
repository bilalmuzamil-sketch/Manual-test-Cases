# SV-8591 — [Reports Suite][A3] Export contract + 10k row-cap guard (CSV attachment + PDF scaffold)

> **Source (pointer only, login-walled):** https://shopview.atlassian.net/browse/SV-8591
> **Ingested:** 2026-07-27 (via Atlassian MCP, live session)
> **Key:** SV-8591 · **Type:** Story · **Epic:** SV-8582 · **PO:** Chris Ward
> **Status:** Open · **Relates to report:** SUITE (shared chassis)
> **Labels:** (none) · **Comments:** 0 · **Attachments:** 0

## Summary
[Reports Suite][A3] Export contract + 10k row-cap guard (CSV attachment + PDF scaffold)

## Description
**Plan:** Reports Suite Tech Plan — Part A / Phase 3 (Foundation). Depends on A2 (count helper).

**Goal:** Shared export machinery for all reports — a uniform 10k row cap and true file-attachment CSV/PDF (deliberate departure from the legacy JSON-wrapped export convention; existing export controllers untouched).

**Scope (**`api/`):

* `Reporting/Shared/Application/Export/ExportRowCapGuard` — runs a per-report count callable, throws `ReportExportTooLargeError extends DomainError` at `> 10_000` (single suite-wide constant). Takes a count callable/query per report (SBC counts customers + invoices — two-level).
* `ReportExportTooLargeError` — mapped to 4xx carrying the exact spec toast.
* PDF scaffold — copy the `TechnicianEfficiency` Summary/Expanded PdfQueryHandler pair over `WeasyPrintPdfGenerator` (600s timeout).
* CSV attachment helper — `text/csv` + `Content-Disposition: attachment` (D5).

**Tests:** cap boundary at 10,000 / 10,001 (both single-table and two-level count callables); empty-set export = header-only file, guard does not fire at zero.

**DoD gates:** cs-fix / phpstan / pest; smoke.

Depends on: A2. Blocks: all six reports' exports.
