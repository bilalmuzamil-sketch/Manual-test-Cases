# SV-8598 — [Reports Suite][B5] Sales By Customer (SBC) report + dedicated permission

> **Source (pointer only, login-walled):** https://shopview.atlassian.net/browse/SV-8598
> **Ingested:** 2026-07-27 (via Atlassian MCP, live session)
> **Key:** SV-8598 · **Type:** Story · **Epic:** SV-8582 · **PO:** Chris Ward
> **Status:** OBSOLETE · **Relates to report:** SBC
> **Labels:** (none) · **Comments:** 0 · **Attachments:** 0

## Summary
[Reports Suite][B5] Sales By Customer (SBC) report + dedicated permission

## Description
**Plan:** Reports Suite Tech Plan — Part B / B5. **Spec:** SBC page 577634305. Depends on A2, **A4** (invoice financial columns), A5. **Complexity: High** (3-level tree + lazy drill-down + dedicated permission).

**Scope:**

* DB: no new report tables (aggregates A4 columns). One new permission atom.
* BE fetcher: customer rows GROUP BY `company_id` (NOT customer_id/contact) over A4 columns, filtered by (work_place_id IN, created_on range, status != void via A2 predicate). Subtotal = labor_sell+parts_sell+shop_supplies_charge; Margin excludes shop supplies. Sort-by-Date = MAX(created_on). Totals over full filtered set. Customer type-ahead. Lazy asset drill-down (group by COALESCE(vehicle_id, snapshot key); "Parts Sales" bucket = vehicle_id IS NULL; labels from invoice_vehicle_details text; dup-label tiebreaker). Invoice rows emit workOrderId + type. Exports flat (Customer→Invoice); 10k cap counts customers + invoices (two-level).
* 🔴 **Multi-location tenant scoping:** intersect requested workplaceIds with `WorkplaceFetcher::getByUserId()` (admin→getAllForOrganization) AND keep OrganizationDecorator. Do NOT copy TimesheetActivity precedent that skips validation. Backfill-NULL guard (COALESCE or gate on backfill completion).
* Dedicated view permission (SV-5319 model, must land in one commit or `be-permission-drift` CI fails): atom `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW`, bundle decision (43rd bundle vs ride existing — product call), FEPermissionMappings, IntentionalAtomChanges, seeder CLIs, FE bundleCatalog.ts. Every SBC endpoint gates on the new atom via `#[IsGranted]`, NOT ROLE_REPORT_VIEW.
* FE: **two-tone theme**, 3-level tree Customer→Asset→Invoice (server-paged customers, lazy asset+invoice on expand, expand-all bounded to page), type-ahead all-customers state flag, product-type dropdown, Inv. Hrs colored, invoice link by type, column selector, remembered-view.

**E2E:** reference-breakage scan + happy paths (permission-gated nav, expand tree, invoice link, filter, CSV/PDF) + edge (empty, Parts Sales bucket, permission-denied nav hidden + direct-link denied).

Depends on: A2, A4, A5.
