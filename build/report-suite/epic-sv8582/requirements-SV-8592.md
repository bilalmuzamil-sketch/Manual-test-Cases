# SV-8592 — [Reports Suite][A4] Denormalized invoice financial columns + backfill + clock subscriber

> **Source (pointer only, login-walled):** https://shopview.atlassian.net/browse/SV-8592
> **Ingested:** 2026-07-27 (via Atlassian MCP, live session)
> **Key:** SV-8592 · **Type:** Story · **Epic:** SV-8582 · **PO:** Chris Ward
> **Status:** Open · **Relates to report:** SBC+SBR (shared foundation)
> **Labels:** (none) · **Comments:** 0 · **Attachments:** 0

## Summary
[Reports Suite][A4] Denormalized invoice financial columns + backfill + clock subscriber

## Description
**Plan:** Reports Suite Tech Plan — Part A / Phase 4 (Foundation). Feeds SBC + SBR.

**Goal:** Denormalize six invoice financial values as individual nullable columns so SBC/SBR can `SUM`/`GROUP BY` on real columns instead of deriving per request.

**Scope (**`api/`):

* Migration: `ALTER TABLE invoice ADD` labor_sell, labor_cost, parts_sell, parts_cost (INT cents), hours_invoiced, hours_worked (DECIMAL(10,2)) — all nullable, ALGORITHM=INSTANT. Map in `Invoice.orm.xml`.
* `Invoice.php` — add fields (+ `captureFinancialSnapshot(...)`).
* `InvoiceBuilder::buildInvoice()` AND `updateInvoice()` — compute+set the six columns inside the existing `processCreate` transaction (sources: `WorkOrderStatsFetcher` + labor/parts sell queries).
* `InvoiceFinancialSnapshotService` — assembles the six values for one WO.
* `BackfillInvoiceFinancialColumnsCommand` — `app:invoicing:backfill-financial-columns`, idempotent (`WHERE labor_sell IS NULL`), batched, writer-only, `--dry-run`/`--limit`/`--organization-id`/`--workplace-id`.
* `RecomputeInvoiceLaborOnClockChange` subscriber — recompute `hours_worked`+`labor_cost` for the affected WO's non-void invoice; new past-tense `TaskChangedEvent` dispatched from `ChangeCommandHandler` (+ Move flow) — these flows dispatch no domain event today.

**Tests:** snapshot matches per-request derivation; TTR edit after invoicing recomputes hours_worked/labor_cost on non-void invoice, sell columns untouched; backfill idempotent; void/reversal excluded.

**DoD gates:** cs-fix / phpstan / pest (Invoicing + LabourBilling); migration gate (diff no-op); smoke (create/update invoice must not 500); backfill dry-run.

Depends on: sequenced after A2/A3. Blocks: B5 (SBC), B6 (SBR).
