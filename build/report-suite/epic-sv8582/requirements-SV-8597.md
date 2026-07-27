# SV-8597 — [Reports Suite][B4] Inventory Value (IV) report + nightly snapshot + retention

> **Source (pointer only, login-walled):** https://shopview.atlassian.net/browse/SV-8597
> **Ingested:** 2026-07-27 (via Atlassian MCP, live session)
> **Key:** SV-8597 · **Type:** Story · **Epic:** SV-8582 · **PO:** Chris Ward
> **Status:** OBSOLETE · **Relates to report:** IV
> **Labels:** (none) · **Comments:** 0 · **Attachments:** 0

## Summary
[Reports Suite][B4] Inventory Value (IV) report + nightly snapshot + retention

## Description
**Plan:** Reports Suite Tech Plan — Part B / B4. **Spec:** IV page 720142338. Depends on A2, A3, A5. **Complexity: High** (pricing-matrix sell in SQL + second cross-tenant snapshot cron + retention).

**Scope:**

* DB: `inventory_value_snapshot` table (denormalized category/vendor names to survive rename/delete on as-of replay; join org-purge path). **⚠️ Sizing gate before locking:** `COUNT(*) FROM part WHERE quantity>0 AND is_core=0` per workplace — fleet-wide could be 50–200M/yr; retention bounds it, else month-RANGE partition. Verify `pricing_rule.matrix_id` index exists.
* BE fetcher: one row per (part, workplace), is_core=0, in-stock; join skeleton = `DbalPartListFetcher::searchParts` with multi-location. **Qty** = `AVAILABLE_QUANTITY_SQL` (positive-bins-only, agrees with Parts page — do NOT copy Dashboard's raw p.quantity). **Unit sell** = ONE shared SQL sell expression (used by live query AND capture INSERT…SELECT): fixed / no-category=cost / matrix markup via `part_category.pricing_matrix_id` → org default → interval clamp. Ship cent-parity test vs `PricingRulesApplier`. As-of resolution (live today / nearest snapshot / none→empty). Permission `ROLE_REPORT_VIEW`.
* 🔴 Nightly snapshot `app:reporting:capture-inventory-value-snapshots` — **cross-tenant Golden-Rule exemption** (record in PR block); set-based DELETE+INSERT…SELECT with shared sell expression; likely no session-injection hack (pure DBAL). Retention prune (≤13mo daily → monthly last-capture) as in-command step. EventBridge→ECS nightly.
* FE: all-white theme, Parts nav (shared w/ PV), server-paginated, Total Cost pinned + default sort desc, column picker (Margin/Total Sell off by default), date-range as "as-of" anchor + "As of X" indicator, category/vendor filters + page-local search, export.

**E2E:** reference-breakage scan + happy paths (Parts nav, filters, search, column toggle, CSV) + edge (past date before first capture empty, >10k cap, qty-drift positive-bins).

Depends on: A2, A3, A5.
