# SV-8589 — [Reports Suite][PR-1] inventory_changes INT→DECIMAL precision fix + QB correction

> **Source (pointer only, login-walled):** https://shopview.atlassian.net/browse/SV-8589
> **Ingested:** 2026-07-27 (via Atlassian MCP, live session)
> **Key:** SV-8589 · **Type:** Story · **Epic:** SV-8582 · **PO:** Chris Ward
> **Status:** Open · **Relates to report:** Shared / Inventory+QB (feeds PV)
> **Labels:** (none) · **Comments:** 0 · **Attachments:** 0

## Summary
[Reports Suite][PR-1] inventory_changes INT→DECIMAL precision fix + QB correction

## Description
**Plan:** Reports Suite Tech Plan — Phase 0 / PR-1 (ships as its own PR, ahead of the suite).

**Goal:** Fix the live QuickBooks-corruption bug caused by `inventory_changes.old_quantity`/`new_quantity` being mapped `integer` while the domain types them `float` — fractional units are truncated at hydrate/persist and QB journal-entry sync multiplies these into dollar amounts.

**Scope:**

* Hand-written migration: `ALTER TABLE inventory_changes MODIFY old_quantity/new_quantity DECIMAL(10,2)` (ALGORITHM=COPY, \~10–40s write-pause; measured 714,814 rows / 517 MB → single off-peak migration, no online-DDL tooling).
* Update mapping `InventoryChanges.orm.xml:20-21` integer → decimal so `migrations:diff` stays a no-op.
* Verify QB sync read paths (`JournalEntry/Services/ReportGenerator.php`, `JournalEntrySyncService.php`) receive un-truncated quantities.
* Forward-only (historical truncation unreconstructible).

**Tests:** fractional-quantity round-trip regression; QB journal amount exact from fractional movement.

**DoD gates:** cs-fix / phpstan / pest (Inventory + JournalEntry mirrors); migration gate (`migrations:diff --allow-empty-diff` = "No changes detected"); smoke.

Depends on: nothing. Blocks: B3 (PV — Units Sold precision).
