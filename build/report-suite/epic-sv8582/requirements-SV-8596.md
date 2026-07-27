# SV-8596 — [Reports Suite][B3] Parts Velocity (PV) report + part.last_sold_at

> **Source (pointer only, login-walled):** https://shopview.atlassian.net/browse/SV-8596
> **Ingested:** 2026-07-27 (via Atlassian MCP, live session)
> **Key:** SV-8596 · **Type:** Story · **Epic:** SV-8582 · **PO:** Chris Ward
> **Status:** OBSOLETE · **Relates to report:** PV
> **Labels:** (none) · **Comments:** 0 · **Attachments:** 0

## Summary
[Reports Suite][B3] Parts Velocity (PV) report + part.last_sold_at

## Description
**Plan:** Reports Suite Tech Plan — Part B / B3. **Spec:** PV page 620888066. Depends on **A1/PR-1** (inventory_changes DECIMAL — Units Sold precision), A2, A5. **Complexity: High** (multi-source movement math, per-location vs merged rows).

**Scope:**

* DB: new composite index `inventory_changes (workplace_id, inventory_part_id, origin, created_at)` (+ catalog_part_id variant); new `part.last_sold_at` (nullable) denorm column killing the all-time MAX() sub-select; backfill command `app:inventory:backfill-last-sold-at`; maintain on invoice create + reversal.
* BE fetcher: INVENTORY parts = per-(part, workplace) rows; CATALOGUE parts = one merged row; core parts excluded; Type filter Both/Inventory/Catalogue. **Units Sold** = net over invoicing origins (`WorkOrderInvoiceCreate` +, `WorkOrderInvoiceReverse` −) — origin filter mandatory. **Demand** = count of in-window invoicing events. Returns via `work_order_part_return_request` + `part_sale_credit`. Profitability from billed part lines (`work_order_part` + `invoice_statement_item`), net reversals via void predicate. Last Sale from denorm column. Permission: existing Inventory Reports→View (no new atom).
* FE: **two-tone theme**, new Parts nav group, 20 columns/14 default (column picker), catalogue rows render "—" for stock; server pagination; export; page-local search.

**⚠️ Re-verify at implementation:** movement queries + `InventoryQueryHandler` discriminators (PV-BE agent stalled). Do NOT copy its WO-type IN-list heuristic or workplace_location_id hack.

**E2E:** reference-breakage scan + happy paths (Parts nav, Type=Catalogue "—" cells, filters, search, column picker, CSV) + edge (bin+catalogue empty, >10k cap toast).

Depends on: PR-1, A2, A5.
