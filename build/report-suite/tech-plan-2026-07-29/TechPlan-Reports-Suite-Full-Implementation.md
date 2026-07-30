<!-- SOURCE: user upload 2026-07-29 — engineering tech plan (Reports Suite Full Technical Implementation Plan), copied VERBATIM below this header. Ingested 2026-07-30. -->

# Reports Suite — Full Technical Implementation Plan (Foundation + 6 Reports)

**Date:** 2026-07-21
**Requirements doc:** `docs/tech-plans/reports-suite-preplan.md` (+ specs staged under `docs/tech-plans/reports-suite-specs/`; six Confluence specs re-fetched 2026-07-21, all build-ready)
**Tech stack:** BE PHP 8.5 / Symfony 7.4 / Doctrine ORM 3 / DBAL 4 / MySQL 8; FE Vue 3.5 / Quasar 2 / TanStack Query / TypeScript
**Estimated complexity:** High (cross-cutting infrastructure + six full reports; one ledger-table rebuild; two cross-tenant snapshot crons)

> **This is the complete, end-to-end plan for the whole reports suite** — the shared **Foundation** (Part A, Phases 1–5) plus a phase group for each of the **six reports** (Part B: WIP, TU, PV, IV, SBC, SBR). It is meant to be implemented start-to-finish under one `/loop /implement`. Delivery is **two PRs** (Milan, 2026-07-21): **PR-1** = the `inventory_changes` ledger fix (Phase 0 — small, ships first, fixes a live QB-corruption bug independent of the suite); **PR-2** = the reports suite itself — **one branch / one PR, multiple phases** (foundation + six reports), frequent remote pushes, no per-report PR split.
>
> **Why one document (Milan, 2026-07-21):** the JIT-per-report split in the preplan was a hedge against planning a report before its shared contract was built. Since the six specs are locked/build-ready, the BE data research is done (preplan §2), and the contract's shape is pinned by Part A, that hedge no longer pays for itself — one Execution State is cleaner for `/loop`.
> **The one caveat:** Part B phases are written against the Foundation **as designed** (Part A), not **as built**. If a Part A contract detail shifts during implementation, re-verify the affected Part B phase against the real shell before implementing it (each Part B group names its Part A dependencies).
>
> **Build order (preplan §5.4 + IV slotted with the Parts reports):** Foundation → **WIP → TU → PV → IV → SBC → SBR**.

---

## 0. Execution State

_Keep this block current so any agent (or person) can resume mid-flight — this plan may be executed by someone who did not write it._

- **Status:** Authored — Part A (Foundation, A1–A5) + Part B (all six reports, B1–B6) written and grounded against `develop @ 674007b37e`. Ready for review, then `/loop /implement`.
- **Current phase:** Not started (implementation). Entry point = Phase A1.
- **Last completed:** Full plan authored (Part A + B1 WIP, B2 TU, B3 PV, B4 IV, B5 SBC, B6 SBR).
- **Open questions / blockers:** None blocking authoring. Confirmed with Milan 2026-07-21: (1) **no replica connection** — use `default`, fetchers connection-injectable for a later swap; (2) **two PRs** — `inventory_changes` fix is **PR-1 (Phase 0)**, ships first off-peak (measured 714,814 rows / 517 MB → small, single `COPY` migration ~10–40s); reports suite is **PR-2**, one branch; (3) **per-browser** remembered-view (localStorage), migration path to `UserPagePreference` documented; (4) **full suite in one document**.

### 🔴 Decisions to surface before/at the relevant phase (grounding-discovered)

These need a human call during implementation — the plan names each at its phase; consolidated here so none is missed:

1. **SBR rep identity (B6.1)** — `work_order.service_advisor_id` = staff.id but `company.sales_rep_id` = user.id. Pick one identity for the new rep columns (staff.id recommended) + translate the customer fallback via `staff.user_id`. Most bug-prone point in the suite.
2. **SBR payment "balance owed" (B6.2)** — deposits are excluded from `paid_balance` (SV-6616), so the `prepaid→Paid` branch needs a deposit-contribution join; a naive `total_balance − paid_balance` misclassifies every prepaid invoice. Coordinate with Minja's payments rewrite before locking.
3. **SBR "dual rep fields" don't exist (B6.1)** — nothing to collapse (spec build-note described the dead prototype); build the single-rep chain fresh.
4. **SBC multi-location tenant scoping (B5.2)** — 🔴 intersect requested workplace ids with the user's accessible set + keep `OrganizationDecorator`; do NOT copy the TimesheetActivity precedent that skips validation. (Applies to every report's location filter.)
5. **SBC dedicated permission (B5.3)** — new atom + a bundle-placement product decision (43rd bundle vs ride existing); must land in one commit or the `be-permission-drift` CI check fails.
6. **Two cross-tenant snapshot crons (B1.2 WIP, B4.2 IV)** — each is a Golden-Rule tenant-scoping exemption; record in the PR's "Golden Rule Exemptions" block.
7. **inventory_changes rebuild (Phase 0 / PR-1)** — RESOLVED: measured 714,814 rows / 517 MB → small; single off-peak `COPY` migration (~10–40s write-pause), ships as PR-1 ahead of the suite. No online-DDL tooling needed.
8. **CSV delivery (D5)** — suite reports use true file attachments; the Sales Rep Assignments export (B6.2) deliberately stays on the legacy JSON-wrapped convention. Confirm D5.
9. **SBR staff-dialog Escape (B6.3)** — spec S13-R8 wants Esc-to-dismiss; Golden Rule #9 says Esc isn't a supported close path. Pick one.
10. **IV snapshot sizing (B4.1)** — get prod per-workplace in-stock part count before locking the table; may need month-partitioning if >100M rows/yr.

### Suite roadmap (all phases, one branch)

| # | Part | Phase group | Key output | Depends on |
|---|------|-------------|------------|------------|
| 0 (PR-1) | Prerequisite | `inventory_changes` INT→DECIMAL + QB fix | ledger precision (separate PR, ships first) | — |
| A2 | Foundation | Paginated-report contract | RequestDto+Query base, count+page helper, sort whitelist, void predicate, money rule | — |
| A3 | Foundation | Export contract + 10k cap | CSV attachment + PDF scaffold + cap guard | A2 |
| A4 | Foundation | Invoice financial columns + backfill + clock subscriber | SBC/SBR data source | — |
| A5 | Foundation | FE report shell | table/remembered-view/filters/themes/nav/formatters | A2, A3 |
| B1 | WIP | Work In Progress report + nightly snapshot | 4 tabs, summary strip, earned/remaining, Story 11 cron | A2, A5 |
| B2 | TU | Technician Utilization report | tech rows, per-day expand, Timesheet reconciliation | A2, A5 |
| B3 | PV | Parts Velocity report + `last_sold_at` | inventory/catalogue movement + profitability | A1, A2, A5 |
| B4 | IV | Inventory Value report + nightly snapshot | on-hand valuation, matrix sell, as-of + Story 11 cron | A2, A5 |
| B5 | SBC | Sales By Customer report | Customer→Asset→Invoice tree, dedicated permission | A2, A4, A5 |
| B6 | SBR | Sales By Representative report | rep schema, WO field, staff dialog, 4-format export | A2, A4, A5 |

_Part B sections are appended below Section 9 as each report's grounding completes. Sections 1–9 currently describe Part A (Foundation); each Part B group carries its own mini Architecture / DB / API / Phases / Tests / Traceability so it is independently implementable._

> 🛑 **About to implement this plan? Run it as `/loop /implement <this-file>`.** This plan is meant to be executed by the `/implement` orchestrator inside a `/loop` — that combination adds the code-review loop, the Phase 5 runtime gates (migration / compile / smoke / browser-walk), the mandatory E2E ask, and phase-by-phase hands-off execution. Free-hand implementation skips all of it.
>
> - **However you were handed this** — "implement it", "here's the path, do it", or a single phase — do **not** start editing code directly. Route through `/loop /implement <this-file>` (or `/loop /implement Phase N from <this-file>` for one phase). Announce that you're routing through `/loop /implement` and proceed.
> - **The foundation + WIP phases are SUPERVISED** (preplan plan-authoring model): they contain user-decision stops (Golden-Rule exemption in later snapshot phases, migration review, the E2E ask). `/loop`-driven autonomous execution is reserved for later mechanical report phases.
> - **If you are ALREADY running under `/loop /implement`**, ignore this note and continue.
> - **If you are a sub-agent** (`be-implementer`, `fe-implementer`, …), execute only the scope handed to you and report back; do not invoke `/loop`/`/implement`.
> - **Precedence:** only a live, explicit user instruction to the contrary wins.

---

## 1. Architecture Overview

The six reports share one shape: a server-paginated, server-sorted, server-filtered table with a bounded date window (≤366 days, no "All Time"), a location multi-select, a page-local search, a column picker, a per-browser remembered view, and server-generated CSV/PDF exports capped at 10,000 rows. SBC and SBR additionally aggregate invoice financials (labor/parts sell + cost, hours) that are expensive to derive per request today.

The foundation builds that shared shape once, on both sides:

```
                          ┌───────────────────────────────────────────────────────┐
   FE (app/)              │  FE Report Shell (Phase 5)                            │
                          │  useReportTableQuery · useRememberedView              │
                          │  LocationFilter · DateRange(366) · ColumnSelector     │
                          │  export menu · page-local search · 2 themes           │
                          │  reporting formatter module · Parts nav group         │
                          └───────────────┬───────────────────────────────────────┘
                                          │  {collection, pagination:{rowsNumber}} envelope
                                          │  server sort + filters + page-local search
                          ┌───────────────▼───────────────────────────────────────┐
   BE (api/)              │  Shared paginated-report contract (Phase 2)           │
                          │  clean RequestDto + Query base · count+page helper    │
                          │  Paginator sort-whitelist · void-exclusion predicate  │
                          │  money round-once rule                                │
                          ├───────────────────────────────────────────────────────┤
                          │  Export contract + 10k row-cap guard (Phase 3)        │
                          │  CSV attachment · WeasyPrint PDF (copy TechEfficiency)│
                          ├───────────────────────────────────────────────────────┤
                          │  Invoice financial columns + backfill + clock         │
                          │  subscriber (Phase 4)   [feeds SBC/SBR]               │
                          ├───────────────────────────────────────────────────────┤
                          │  inventory_changes INTEGER→DECIMAL rebuild (Phase 1)  │
                          │  [feeds PV; fixes QB journal amounts]                 │
                          └───────────────┬───────────────────────────────────────┘
                                          │  Doctrine DBAL `default` connection
                                          │  (injectable seam — replica slots in later)
                                          ▼
                                   MySQL 8 (writer)
```

No report business logic lives in the foundation. Each report supplies its own fetcher (a `$sortFields` whitelist + a count query + a page query) and its own DTOs; the foundation supplies the reusable machinery those fetchers plug into.

**Grounding:** every file path below was verified against `develop @ 674007b37e` by `be-planner` and `fe-planner` (2026-07-21). Preplan drift is called out inline.

---

## 2. Technical Decisions

- **D1 — No read-replica in this plan; `default` connection everywhere (Milan 2026-07-21).** Report fetchers take a `Connection` via constructor injection so a `reporting` (read-only) connection can be swapped in later by changing one wiring line — but that connection, the `DATABASE_RO_URL` env, and the Terraform task-def injection are **out of scope here** and deferred to separate infra work. (The Aurora reader `shopview-schopcoach-ro` exists in prod TF but is not injected into the api task def; leaving it that way for now.)
- **D2 — Two PRs (Milan 2026-07-21).** **PR-1 (Phase 0):** the `inventory_changes` INT→DECIMAL fix ships separately, ahead of the suite — it fixes a live QB-corruption bug now, wants isolated bookkeeping review, and is independent of everything else. **PR-2:** the reports suite (foundation + six reports) is one branch/PR with frequent remote pushes, no per-report split. Measured 2026-07-21: `inventory_changes` = **714,814 rows / 517 MB** → small; the type-change `COPY` rebuild is ~10–40s, so PR-1 needs only a single off-peak migration (no online-DDL tooling — §3).
- **D3 — Per-browser remembered-view (Milan 2026-07-21).** localStorage, schema-versioned, defensive restore, exactly per the specs (SBC S6, SBR S23, PV S4-R6, TU §3, WIP S8, IV S8). This deliberately **diverges from the filters-redesign program** (`docs/tech-plans/wo-list-filters-plan.md`, not started) which builds server-side `UserPagePreference` and lists Reports in its rollout. Migration path documented in §5 Phase 5 so the two programs don't ship rival seams; specs win for now (SBR S23-N1 "no server-side profile").
- **D4 — New clean paginated-report base, NOT `ReportRequestPayload`.** The existing `App\Reporting\Domain\ReportRequestPayload` implements both `RequestPayload` **and** `Query` and carries `#[Pagination]`/`#[Service]` — forbidden on a Query per `api/AGENTS.md` "RequestDto vs Command/Query Separation." Build a rule-compliant base: a UI-layer `RequestDto` (carries `#[Pagination]`, range, filters) mapped to a plain `Query`. Do not extend the legacy base. _(Note its date guard says "over one year"; the suite cap is exactly 366 days — the new base enforces 366.)_
- **D5 — Reports exports are true file attachments, not the legacy JSON-wrapped string.** The current `Reporting/Export/Application/ExportController` returns a CSV serialized into a JSON envelope (`SuccessJsonResponse([$string])`). The specs describe real downloads with exact filenames (e.g. `velocity-report.csv`, `sales-by-representative-summary.pdf`) and a row-cap toast. The suite's export endpoints return `Content-Disposition: attachment` responses (`text/csv`, `application/pdf`). This is a deliberate, suite-scoped departure from the legacy convention; existing export controllers are untouched. **Flag for review** — if you'd rather keep the JSON-wrapped convention and download client-side, that changes the FE export-menu wiring in Phase 5.
- **D6 — Money: round half-up once, from unrounded sums; no Money VO.** SUM raw cents/DECIMAL in SQL (never `ROUND()` inside aggregates — that reintroduces the Timesheet per-record-round-then-sum trap, preplan §2.4). Round `\RoundingMode::HalfAwayFromZero` once at the presentation edge using the existing `FixedDecimal2`/`DecimalValue` primitives. Do **not** introduce a Money VO — that's the separate future money-alignment project, and Minja's payments rewrite is in flight (memory).
- **D7 — Denormalize invoice financials as six individual nullable columns** (approved 2026-07-15), not a JSON blob — the point is server-side `SUM`/`GROUP BY` on real columns. MySQL 8 `ALGORITHM=INSTANT` makes the `invoice` ADD metadata-only.
- **D8 — Two FE report themes as a shared theme layer.** "Two-tone" (SBC/PV) and "all-white" (SBR/TU/WIP/IV) are both net-new; build both in the shell so per-report pages opt in via a `theme` prop/class. (Theme convergence is parked per Milan — explicit per-spec statements win.)

**New dependencies:** none (no new Composer/npm packages). All work reuses existing framework primitives.

---

## 3. Database Changes

### Modified tables

**`invoice`** (Phase 4) — six new nullable snapshot columns. Money in **int cents**; hours in **DECIMAL(10,2)** (`fixed_decimal_2`), matching `api/.claude/reference/database.md` "Prices and Decimals" and the existing header-money columns.

Mapping: `api/src/Invoicing/Invoice/Infrastructure/Doctrine/Invoice.orm.xml` (entity `App\Invoicing\Invoice\Domain\Invoice`, `TABLE_NAME = 'invoice'`).

```sql
-- Illustrative shape only, NOT the migration to copy-paste. MySQL 8 ALGORITHM=INSTANT (nullable appends).
ALTER TABLE invoice
  ADD COLUMN labor_sell      INT          NULL,   -- cents
  ADD COLUMN labor_cost      INT          NULL,   -- cents
  ADD COLUMN parts_sell      INT          NULL,   -- cents
  ADD COLUMN parts_cost      INT          NULL,   -- cents
  ADD COLUMN hours_invoiced  DECIMAL(10,2) NULL,
  ADD COLUMN hours_worked    DECIMAL(10,2) NULL;
```

No new index in the foundation — the existing `inv__work_place_id_created_on_idx (work_place_id, created_on)` already serves the range scan SBC/SBR need. (Per-report plans add covering indexes only if their `EXPLAIN` shows a need.)

**`inventory_changes`** (Phase 1) — type change on the two ledger quantity columns.

Mapping: `api/src/Inventory/Parts/Infrastructure/Doctrine/InventoryActions/InventoryChanges.orm.xml:20-21` currently maps `oldQuantity`/`newQuantity` as `type="integer"` while the domain object types them `float` (`InventoryChanges.php:35-36`) — fractional units are silently truncated at hydrate/persist, and QB journal-entry sync multiplies these into dollar amounts (`JournalEntry/Services/ReportGenerator.php:144-145`, `JournalEntrySyncService.php:52-59`), so the ledger corrupts bookkeeping values today.

```sql
-- Illustrative shape only. ⚠ ALGORITHM=COPY — full table rebuild, write-blocking. Off-peak deploy window.
ALTER TABLE inventory_changes
  MODIFY old_quantity DECIMAL(10,2) NOT NULL,
  MODIFY new_quantity DECIMAL(10,2) NOT NULL;
```

Update the mapping `type` to a decimal type matching `DECIMAL(10,2)` so `migrations:diff` stays a no-op. **Forward-only** — historical truncation is unreconstructible (documented in preplan §1; QB heads-up already posted to Chris).

> ⚠️ Migrations are written **by hand** and verified as a no-op with `bin/console doctrine:migrations:diff --allow-empty-diff` ("No changes detected"). DBAL's schema tools choke on functional/expression indexes in this repo (the `default` connection uses `ExpressionIndexFilteringSchemaManagerFactory`, `doctrine.yaml:35`). Any hand-written FK on a plain-id column must be registered in `ExpressionIndexFilteringMySQLSchemaManager::MANUALLY_MANAGED_FOREIGN_KEYS` with its backing index declared in XML. Index names are globally unique (`<alias>__..._idx`; SQLite tests share one namespace). No FKs are added in the foundation. See `api/.claude/reference/database.md`.

**DDL classification (verified):**
- `invoice` ADD (6 nullable) → `ALGORITHM=INSTANT`, metadata-only, safe in a normal migration.
- `inventory_changes` INTEGER→DECIMAL → `ALGORITHM=COPY`, full rebuild, `LOCK=SHARED` (reads OK, writes blocked for the rebuild). **Measured on prod 2026-07-21: 714,814 rows / 517 MB → small**, so the rebuild is ~10–40s on Aurora. Procedure: a **single hand-written migration** (`isTransactional()` + explicit `MODIFY old_quantity/new_quantity DECIMAL(10,2)`) + the mapping type change, **run off-peak** (schedule PR-1's deploy for a low-traffic window, or run the `ALTER` manually off-peak with a `skipIf` guard so the pipeline no-ops it). No online-DDL tooling (pt-osc/gh-ost), no expand/contract — those were only warranted if the table had been tens of millions of rows; at 715k it isn't. Ships as **PR-1**, ahead of the suite.

### Data migrations

- **Invoice financial backfill** (Phase 4): `app:invoicing:backfill-financial-columns` (writer only), batched over historical non-void invoices, computing the six columns from `WorkOrderStatsFetcher` + labor/parts sell sources (§4). Idempotent (`WHERE labor_sell IS NULL` guard), `--dry-run`/`--limit`/`--organization-id`/`--workplace-id`/`--batch-size`. This is the big one — resumable, off-peak.
- `inventory_changes` has **no** data backfill (forward-only; the rebuild only widens the type).

---

## 4. API Changes

The foundation adds **no report endpoints** (those are per-report). It adds the reusable server-side contract those endpoints will use, plus the invoice write-path change.

### Shared contract (Phase 2) — not an endpoint, a base

- **`ReportListRequestDto`** (new, UI layer, e.g. `api/src/Reporting/Shared/UI/HTTP/DTO/`): carries `#[Pagination] PaginationData`, the bounded date range (11 presets + Custom, **366-day cap**), and a `search` string; maps to a plain `ReportListQuery`. Rule-compliant per D4. Reuses `#[Pagination]` (`api/src/Shared/UI/HTTP/ArgumentResolver/Pagination.php`) and the resolver path (no manual param parsing).
- **`PaginatedReportResult` + count-and-page helper** (new, e.g. `api/src/Reporting/Shared/Infrastructure/Persistence/`): given a `QueryBuilder`, `PaginationData`, and a `$sortFields` whitelist, run the `COUNT` clone then the page query via `App\Shared\Infrastructure\Persistence\Listing\Paginator`, and return `{collection, pagination}` with `rowsNumber` — generalizing the one-off in `Inventory/Parts/Infrastructure/Persistence/Query/Dbal/BinLocationQueryRepository.php:28-83`. Sort whitelist = `Paginator`'s existing `$sortFields` (api-name → SQL expr) + `$defaultSortFields`.
- **Void-exclusion predicate** (new tiny helper): every invoice-based report query filters `status NOT IN (:void)` via `App\Invoicing\Invoice\Domain\Status::getNotVoidStatuses()` — this is data-bug (a) from the preplan, made a shared convention so no report repeats the existing sales fetcher's omission.
- **Envelope:** `data.<resource>[]` + `data.pagination` (`rowsPerPage`, `rowsNumber`), per `api/.claude/reference/api-standards.md:59-89`.

### Export contract (Phase 3)

- **`ExportRowCapGuard`** (new, `Reporting/Shared`): runs the report's count query for the active filter set and throws a dedicated `DomainError` (mapped to a 4xx carrying the spec toast) when it exceeds `10_000` (single suite-wide constant, locked by Chris 07-21). The guard takes a **count callable/query per report** — SBC's cap counts customer rows **plus** invoice rows (two-level), so it must not assume one `COUNT(*)`. Guards CSV, PDF, and Print (Print = PDF fetch, SBC S16-R3).
- **PDF path:** copy the `TechnicianEfficiency` handler pair (`api/src/Reporting/Dashboard/Application/TechnicianEfficiency/Pdf/TechEfficiency{Summary,Expanded}PdfQueryHandler.php`) + templates under `api/templates/reporting/technician-efficiency/` (`summary.html.twig`, `expanded-view.html.twig`) via `App\Shared\Application\Pdf\WeasyPrintPdfGenerator` (600s timeout).
- **CSV path:** true `text/csv` attachment per D5.

### Modified endpoints / write path (Phase 4)

- **`InvoiceBuilder::buildInvoice()`** (`api/src/Invoicing/Invoice/Application/HTTP/Builder/InvoiceBuilder.php:68,91-110`) — the single invoice-creation seam (all three routes — in-app `CreateCommandHandler::processCreate`, public API `OpenApi/Invoice/.../CreateController.php:87`, sandbox seeder `OpenApi/Sandbox/.../InvoiceSeeder.php:78` — funnel through it; **no bypass exists**). Compute and set the six columns here, inside the existing `processCreate` transaction, from:
  - `hours_invoiced`, `hours_worked`, `labor_cost`, `parts_cost` → `App\VehicleService\WorkOrders\Domain\Service\WorkOrderStatsFetcher` (already computes these per WO: `hours_invoiced` at :158, `hours_worked`+`labor_cost` at :110-122 via TTR minutes × `hourly_rate` with `HalfAwayFromZero`, `parts_cost` at :79-88).
  - `labor_sell` → sum of `invoice_statement.price` (DECIMAL since SV-5151), per `DbalSalesReportDataFetcher::fetchLaborTotals`.
  - `parts_sell` → sum of `invoice_statement_item.price × quantity`.
- **`InvoiceBuilder::updateInvoice()`** — recompute the six columns here too. The existing `UpdateTotalWhen*` listeners (`api/src/Invoicing/Invoice/Domain/UpdateTotalWhen{WOLine,WOPart,TaskRecord}*.php`) call `updateInvoice` for **PENDING** invoices when the WO changes post-invoice; if the snapshot isn't recomputed there, a pending invoice edited via WO changes drifts.

---

## 5. Implementation Phases

Ordered by dependency. Phases 1 and 4 are BE data; 2 and 3 are BE infra (2 before 3); 5 is FE (consumes the envelope shape from 2/3). All land on the single suite branch.

---

### Phase 0 / PR-1: `inventory_changes` precision fix + QB correction  — SEPARATE PREREQUISITE PR
**Implements:** FR-F8, NFR-F4
**Depends on:** Nothing. **Ships as its own PR (PR-1), merged + deployed ahead of the suite branch (PR-2).** Independent of the suite; fixes a live QB-corruption bug now; prereq for the PV report phase. Measured small (714,814 rows / 517 MB) → a single off-peak `COPY` migration (~10–40s write-pause), no online-DDL tooling — see §3.

#### Database changes:
| Migration/Change | Description |
|-----------------|-------------|
| `api/migrations/VersionXXX.php` (hand-written) | `ALTER TABLE inventory_changes MODIFY old_quantity/new_quantity DECIMAL(10,2)`. `ALGORITHM=COPY`, off-peak window. |
| `api/src/Inventory/Parts/Infrastructure/Doctrine/InventoryActions/InventoryChanges.orm.xml:20-21` | Modify | `integer` → decimal type matching `DECIMAL(10,2)` so the domain `float` no longer truncates and `migrations:diff` is a no-op. |

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Inventory/Parts/.../InventoryChanges.php:35-36` | Verify | Domain already types `float`; confirm no int-casting on the write path after the type change. |
| QB sync read paths | Verify | `JournalEntry/Services/ReportGenerator.php:144-145`, `JournalEntrySyncService.php:52-59` now receive un-truncated quantities — confirm no compensating rounding elsewhere. |

#### Unit / Integration tests:
- Persist/hydrate an `inventory_changes` row with a fractional quantity (e.g. `1.25`) and assert it round-trips (regression for the truncation bug).
- QB journal-entry amount from a fractional-quantity movement is exact.

#### Verification (Definition of Done gates):
- **Static (scoped):** `composer cs-fix`, `phpstan` on changed files, `pest` on the mirrored Inventory + JournalEntry tests.
- **Migration gate:** `doctrine:migrations:migrate`, then `migrations:diff --allow-empty-diff` reports **"No changes detected"**.
- **Smoke:** `bin/smoke-test.sh` — no 500s.
- **Ops note (not a code gate):** size `inventory_changes` on prod before the deploy; schedule the COPY migration off-peak (§7).

---

### Phase 2: Shared paginated-report contract
**Implements:** FR-F1, FR-F2, FR-F3, NFR-F1, NFR-F3, NFR-F5
**Depends on:** Nothing (BE infra).

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Reporting/Shared/UI/HTTP/DTO/ReportListRequestDto.php` | Create | Clean base RequestDto (D4): `#[Pagination] PaginationData` + bounded range (11 presets + Custom, **366-day** cap) + `search`. |
| `api/src/Reporting/Shared/Application/ReportListQuery.php` | Create | Plain Query the DTO maps to (no `#[Pagination]`/`#[Service]`). |
| `api/src/Reporting/Shared/Infrastructure/Persistence/PaginatedReportResult.php` (+ count-and-page helper) | Create | Generalize `BinLocationQueryRepository`'s COUNT-clone + `Paginator` page query → `{collection, pagination:{rowsNumber}}`. |
| `api/src/Reporting/Shared/Domain/NonVoidInvoicePredicate.php` (or a static on an existing helper) | Create | `status NOT IN Status::getNotVoidStatuses()` predicate helper (data-bug a). |
| Money rule | Document | Bless `FixedDecimal2`/`DecimalValue` (`HalfAwayFromZero`) as the round-once helpers; SUM unrounded in SQL (D6, NFR-F5). No new class unless a per-report plan needs a formatter. |

#### Key code changes:
```php
// api/src/Reporting/Shared/Infrastructure/Persistence/PaginatedReportResult.php — count + page in one place
// $qb is the fully-filtered SELECT (WITHOUT limit/offset/order); $sortFields is the api-name→SQL whitelist.
public function paginate(QueryBuilder $qb, PaginationData $p, array $sortFields, array $default): array
{
    $count = (clone $qb)->select('COUNT(*)')->resetOrderBy()->executeQuery()->fetchOne();
    $paginator = new Paginator($qb, $p, $sortFields, $default); // existing whitelist + bounds (max 1000)
    return [
        'collection' => $paginator->getQuery()->executeQuery()->fetchAllAssociative(),
        'pagination' => array_merge($p->getInfo(), ['rowsNumber' => (int) $count]),
    ];
}
```

#### Unit / Integration tests:
- Contract-level: a fixture report fetcher using the helper returns the correct `rowsNumber`, honors the sort whitelist (rejects/ignores non-whitelisted `sortBy`), and clamps page size ≤ max.
- 366-day cap: a Custom range of 367 days is rejected at the DTO boundary.
- Void exclusion: a void invoice never appears in a helper-backed count or page.

#### Verification (Definition of Done gates):
- **Static (scoped):** BE `cs-fix` + `phpstan` + `pest` on the new `Reporting/Shared` tests.
- **Smoke:** `bin/smoke-test.sh` — no 500s (no live endpoint yet; confirms container wiring / `lint:container`).

---

### Phase 3: Export contract + 10k row-cap guard
**Implements:** FR-F4, NFR-F1
**Depends on:** Phase 2 (uses the count helper).

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Reporting/Shared/Application/Export/ExportRowCapGuard.php` | Create | Runs a per-report count callable; throws `ReportExportTooLargeError extends DomainError` at `> 10_000`. Single constant. |
| `api/src/Reporting/Shared/Application/Export/ReportExportTooLargeError.php` | Create | Mapped to 4xx carrying the exact spec toast string. |
| `api/src/Reporting/Shared/Infrastructure/Pdf/` (scaffold) | Create | Thin report-PDF base copying the `TechEfficiency{Summary,Expanded}PdfQueryHandler` shape over `WeasyPrintPdfGenerator`. |
| CSV attachment helper | Create | `text/csv` + `Content-Disposition` response builder (D5), distinct from the legacy `Reporting/Export/.../ExportController` (untouched). |

#### Key code changes:
```php
// ExportRowCapGuard — cap is uniform; the COUNT is report-specific (SBC counts customers + invoices).
public const MAX_ROWS = 10_000;
public function assertWithinCap(callable $countFilteredRows): void
{
    if ($countFilteredRows() > self::MAX_ROWS) {
        throw new ReportExportTooLargeError(); // → toast: "This report is too large to export. Narrow the date range or filters, then try again."
    }
}
```

#### Unit / Integration tests:
- Guard throws at 10,001 and passes at 10,000 (boundary), with a two-level count callable (SBC-shaped) and a single-table one (PV/IV-shaped).
- Empty-set export still generates a header-only file (SBC S18-R10 / SBR S14-E3) — guard does not fire at zero.

#### Verification (Definition of Done gates):
- **Static (scoped):** BE `cs-fix` + `phpstan` + `pest`.
- **Smoke:** `bin/smoke-test.sh` — no 500s.

---

### Phase 4: Denormalized invoice financial columns + backfill + clock subscriber
**Implements:** FR-F5, FR-F6, FR-F7, NFR-F2, NFR-F4, NFR-F5
**Depends on:** Nothing structural (independent BE data), but sequenced after 2–3 so it lands with the contract it feeds.

#### Database changes:
| Migration/Change | Description |
|-----------------|-------------|
| `api/migrations/VersionYYY.php` (hand-written) | `ALTER TABLE invoice ADD` the six nullable columns. `ALGORITHM=INSTANT`. |
| `api/src/Invoicing/Invoice/Infrastructure/Doctrine/Invoice.orm.xml` | Modify | Map `labor_sell`/`labor_cost`/`parts_sell`/`parts_cost` (int cents) + `hours_invoiced`/`hours_worked` (`fixed_decimal_2`), nullable. |

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Invoicing/Invoice/Domain/Invoice.php` | Modify | Add the six fields + setters (or a `captureFinancialSnapshot(...)` domain method). |
| `api/src/Invoicing/Invoice/Application/HTTP/Builder/InvoiceBuilder.php` | Modify | Compute + set the six columns in `buildInvoice()` **and** `updateInvoice()`, inside the existing `processCreate` transaction (§4). |
| `api/src/Invoicing/Invoice/Application/.../InvoiceFinancialSnapshotService.php` | Create | Application service that assembles the six values (reuses `WorkOrderStatsFetcher` + labor/parts sell queries) for one WO; called by the builder and the backfill. |
| `api/src/Invoicing/Invoice/Application/CLI/BackfillInvoiceFinancialColumnsCommand.php` | Create | `app:invoicing:backfill-financial-columns`; copy `BackfillCannedLinePartCostFromVendorHistoryCommand` options/batching; idempotent `WHERE labor_sell IS NULL`; **writer only**. |
| `api/src/Invoicing/Invoice/Domain/RecomputeInvoiceLaborOnClockChange.php` | Create | `DomainEventSubscriber` copying `UpdateTotalWhenTaskRecordGetsRemoved` shape; recomputes **only** `hours_worked`+`labor_cost` for the affected WO's **non-void** invoice (not just PENDING). Absolute recompute (idempotent). |
| `api/src/LabourBilling/TechnicianTaskRecords/Application/HTTP/Change/ChangeCommandHandler.php` (+ Move flow) | Modify | Dispatch a new past-tense `TaskChangedEvent` (net-new — these flows dispatch no domain event today). Decide whether CheckOut/`TaskFinished` also triggers recompute. |

#### Derived-data invalidation (preplan §3b — implement as designed):
- `labor_sell`, `parts_sell`, `parts_cost`, `hours_invoiced` → **self-heal** via existing lifecycle: reversal hard-deletes the row; post-invoice WO edits void + re-invoice → fresh snapshot. No subscriber. (Requirement met by covering `buildInvoice` **and** `updateInvoice`.)
- `hours_worked`, `labor_cost` → **rebuild-on-change** via the new clock subscriber (post-invoice clock edits/deletes/completes are visible in a headline column, so freeze-at-invoice is rejected).

#### Unit / Integration tests:
- Creating an invoice snapshots the six columns matching the pre-existing per-request derivation (assert against `SalesReportQueryHandler` output for the same WO).
- Editing/deleting a TTR after invoicing recomputes `hours_worked`/`labor_cost` on the invoice (any non-void status), leaving the sell columns untouched.
- Backfill: idempotent (second run no-ops), respects `--limit`/`--dry-run`/`--organization-id`.
- Void/reversal: void invoice excluded from any snapshot-based sum; reversal (hard delete) leaves no orphan snapshot.

#### Verification (Definition of Done gates):
- **Static (scoped):** BE `cs-fix` + `phpstan` + `pest` on Invoicing + LabourBilling mirrors.
- **Migration gate:** migrate, then `migrations:diff --allow-empty-diff` = no-op.
- **Smoke:** `bin/smoke-test.sh` (+ `--warmup` after cache:clear) — creating/updating an invoice must not 500; check `php-fpm`/`dev.log` for fatals.
- **Backfill dry-run** on seeded data reports a sane count and mutates nothing.

---

### Phase 5: FE report shell
**Implements:** FR-F9, FR-F10, FR-F11, FR-F12, FR-F13, FR-F14
**Depends on:** Phases 2–3 (consumes the `{collection, pagination:{rowsNumber}}` envelope + export contract). Buildable in parallel with Phase 4.

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/composables/useReportTableQuery.ts` | Create | Paged (NOT infinite) TanStack `useQuery` with `page` in the query key + `rowsNumber` from the envelope; `@request` write-back reusing `mapPaginationForAPI` semantics from `useTable.ts`; silent `queryFn` (interceptor owns toasts), `isError` + `isQueryErrorReal()` for inline retry. Binding shape from `BinLocations.vue` (the only classic `rowsNumber` server-pagination consumer); `disable-virtual-scroll` on the base `Table`. Add to `composables/index.ts`; keys in `src/api/reporting/keys.ts` (`reportingKeys`). |
| `app/src/composables/useRememberedView.ts` | Create | Per-browser localStorage; key `report_view:<reportSlug>`; `version` field + `checkLocalStorageVersion` invalidation (WorkOrders.vue exemplar, `WORK_ORDERS_VERSION`); per-field validators (drop unknown range / inaccessible location / dead sort column / column-set mismatch → default, SBC S6-R5/R6, SBR S23-R3); **restore synchronously before the first fetch** (S6-R4), and restore **beats** URL (S2-R9 — order restore → `useReportUrlSync`). Uses `getLocalStorage`/`setLocalStorage` (`utils/helpers.ts:1053-1067`). **Migration-path note in-file:** designed so a later swap to `UserPagePreference` (filters-redesign program) replaces the storage backend without touching call sites (D3). |
| `app/src/components/ts/reporting/shell/LocationFilter.vue` | Create | Location multi-select (net-new): `MultipleToggleSelect.vue` base + pinned "All Locations" select/clear; default = `useLocation().location` validated against `useMyWorkplaces()` (`api/auth/queries.ts:143`); accessible-locations scoping stays BE-enforced. |
| `app/src/components/ts/shared/DateRangeSelector.vue` | Modify | Enforce the **366-day** cap in Apply/calendar (S2-N2 = prevention, not a form error). Presets already exact (`DEFAULT_DATE_RANGE_OPTIONS`, `utils/reporting.ts:15`). |
| `app/src/components/ts/reporting/shell/ColumnSelector.vue` | Create | Extract the inline WorkOrders.vue pattern (`Button` aria-label + tooltip "Column Selection" + `q-menu` + per-column `q-toggle`, test-ids `toggle_column_<name>`). |
| `app/src/components/ts/shared/SubActionsDropDown.vue` | Modify | Add per-item loading + non-interactive state (SBC S14-E1/S15-E1/S16-R4), disabled-while-initial-loading, accessible name. |
| `app/src/components/ts/reporting/shell/ReportSearchInput.vue` | Create | Debounced page-local toolbar `Input` feeding the server `search` param (NOT the global search bar — that dependency is forbidden suite-wide). |
| `app/src/css/app.scss` (report shell theme layer) | Modify | `report-shell--two-tone` / `report-shell--all-white` (S20/S18-R7): edge-to-edge, white toolbar (32/24/2rem padding), 1px header separator, per-row-type bg (two-tone) vs all-white, no radius, dark-mode. Extend existing `.report-toolbar`/`.reports-page`. |
| `app/src/components/ts/reporting/ReportLeftMenuNav.vue` | Modify | Add the net-new **Parts** group heading (for PV + IV); mirror existing group markup. Performance group already exists (SBR/TU/WIP). |
| Report registration contract | Document + scaffold | The 4-touch checklist to add a report: child route (`EmptyTabView`) in `router/routes.ts`, `componentMap` + `routeNameToTabName` in `Reporting.vue`, nav entry in `ReportLeftMenuNav.vue`, and per-route permission (`meta.requiredCheck`/`requiredPermissions`). SBC's dedicated atom lands in the SBC phase within the SV-5319 model (`services/permissions/bundleCatalog.ts`). |
| `app/src/utils/reporting.ts` (formatter module) | Modify | Net-new: accounting-parentheses negatives `($1,234.56)` (`Intl` `currencySign:'accounting'`), Margin % 1-decimal + em-dash when Subtotal ≤ 0, signed Inv. Hrs (`+1.5`/`-1.5`/`0.0` with `text-positive`/`text-negative`, pins `#21ba45`/`#c10015`), "N days", em-dash null. Do **not** reuse `getCellValue` (renders 'N/A' at 2dp). |

#### Unit / Integration tests (Vitest):
- `useRememberedView`: round-trips a view; drops an inaccessible location and a stale sort column to defaults; bumps schema version → clears; restores before first fetch.
- `useReportTableQuery`: page change updates the query key and reads `rowsNumber`; sort/filter change resets to page 1.
- Formatter module: each format (accounting parens, margin% em-dash boundary, signed hours coloring, N days, em-dash null).
- `LocationFilter`: default seeds from active location; "All Locations" toggles the concrete set; single-location user still renders the control.

#### Verification (Definition of Done gates):
- **Static (scoped):** FE `eslint --max-warnings=0`, `vitest related --run` on changed files, `vue-tsc --noEmit`.
- **Compile:** quasar/Vite up at `:7200`, no errors (native-mode: watch the `quasar dev` terminal / browser console).
- **Browser-walk:** the shell has **no route of its own** — it's exercised through the first report that consumes it. Defer the browser-walk to the first per-report phase (WIP), which opens `/reports/...` as `admin`. Note this explicitly at report time; do not claim a shell browser-walk.

---

## 6. Testing Strategy

### Unit tests (`api/` and `app/`)
- **BE:** the count-and-page helper (rowsNumber, sort whitelist, page clamp), 366-day boundary, void-exclusion predicate, export-cap boundary (both count shapes), invoice snapshot correctness vs the legacy derivation, clock-subscriber recompute, backfill idempotency, `inventory_changes` fractional round-trip + QB amount.
- **FE:** `useRememberedView` (persist/restore/defensive-drop/version-bump/restore-before-fetch), `useReportTableQuery` (paging/sort/filter key behavior), the formatter module, `LocationFilter`.
- **Edge cases:** empty-set export (header-only file), void invoice never counted, negative movement/money rendering, saved view with a now-inaccessible location, Custom range at exactly 366 vs 367 days.

### Integration tests
- Invoice create/update → six columns match `WorkOrderStatsFetcher` + labor/parts sell for the same WO.
- TTR edit after invoicing → `hours_worked`/`labor_cost` rebuilt on a non-void invoice; sell columns untouched.
- A fixture report endpoint wired to the contract returns the correct envelope and honors sort/pagination server-side.

### Manual testing checklist
1. Run the `invoice` migration; `migrations:diff` = no-op.
2. Run the `inventory_changes` migration on a copy sized like prod; measure the write-block window.
3. Backfill dry-run on seeded data → sane count, no mutation; then real run → columns populated, second run no-ops.
4. Create an invoice in the browser; confirm the six columns populate (DB check) and no 500 (`smoke-test.sh`, `php-fpm` logs).
5. Edit a completed WO's clock record; confirm `hours_worked`/`labor_cost` update on the invoice.

### E2E tests
The foundation has **no user-facing route of its own** — the shared shell and contract are only observable through a report page, and the first report (WIP) is a separate phase. Per `coverage-policy.md` §9, E2E coverage rides on the **per-report phases**, not the foundation. There are no foundation E2E specs; the shell's behavior (remembered view, pagination, filters, export, themes) is unit-tested here and E2E-covered when the first consuming report ships.

- **E2E is a local hard-block, not a yes/no ask** (AGENTS.md, 2026-07-21): after gates pass, `/e2e-after-change` **runs** — it performs the mandatory, uncapped **reference-breakage scan** (existing specs the change would break — e.g. WIP's deleted `data-test-id="table_work_in_progress_report"` and reporting `report_nav_*` ids) AND curates new coverage (`batchCap = 5`).
- **Foundation-only slices:** the BE contract/invoice write-path is non-UI → the §8 skip `no-fe-diff` / `style-only` family applies and `/e2e-after-change` stamps it. The FE shell (Phase 5, Part A) exposes **no standalone route**, so its own new-coverage curation is empty — but its deletions/edits still get the reference-breakage scan. Real new E2E coverage begins with the **first consuming report (WIP, Part B)** and is planned inside each Part B group's own `#### E2E tests` section.
- Per-report E2E scenarios live in each Part B phase group (Step 5 of `/tech-plan`), written with the report's UI in view.

---

## 7. Rollback Plan

- **Phase 1 (`inventory_changes`):** the type WIDENS INTEGER→DECIMAL — no data is lost, so a forward-only correction. Rollback = a compensating migration narrowing back to INTEGER (would re-truncate; avoid). Because it's write-blocking, the real mitigation is **forward** — run off-peak, size first, and if the window is unacceptable, defer the deploy of that one migration (it's independent of the rest of the branch). No app code depends on the widened type beyond removing truncation.
- **Phase 2–3 (contract/export):** additive, no live endpoints yet; revert the files. Zero data risk.
- **Phase 4 (invoice columns):** columns are **nullable and additive** — safe to leave in place even if reads are reverted. Rollback of behavior = stop writing them (revert `InvoiceBuilder`) and drop the subscriber; a null column simply falls back to per-request derivation in the (future) report fetcher. The backfill is idempotent and re-runnable. Dropping the columns is a metadata-only INSTANT operation if ever needed.
- **Phase 5 (FE shell):** no route of its own; reverting the composables/components removes them from the (not-yet-built) report pages. Zero user impact until a report consumes them.
- **Deploy sequencing:** `inventory_changes` (PR-1) merges + deploys **off-peak, ahead of the suite** (PR-2). At 714,814 rows / 517 MB the `COPY` is a ~10–40s write-pause — schedule the PR-1 deploy for low traffic (or run the `ALTER` manually off-peak with a `skipIf` guard). The suite branch (PR-2) then builds on an already-fixed ledger.

---

## 8. Security Considerations

- **NFR-F2 — Tenant scoping preserved.** The foundation touches **no** cross-tenant read path. Report fetchers stay request-scoped (org/workplace from session decorators). The cross-tenant nightly snapshot commands (WIP Story 11, IV Story 11) are **out of scope here** — they're per-report phases and each carries its own reviewed **Golden-Rule exemption** (documented in the PR's "Golden Rule Exemptions" block, tracked our side per preplan §1). The reusable no-session org/workplace-iteration seam is only *named* here (`PopulateWorkOrderTotalPriceValues` pattern); nothing cross-tenant is built.
- **Permissions.** No permission changes in the foundation. The shell defines the *contract* for per-route report permissions (`meta.requiredCheck`); SBC's dedicated view permission (S1-R2) is registered in the SBC phase within the SV-5319 3-layer model — flagged so it isn't invented ad-hoc.
- **Export DoS bound.** The 10k row-cap guard (Phase 3) plus the mandatory 366-day window bound every report and export query — no unbounded scans reach the DB or WeasyPrint (whose 600s timeout becomes unreachable).
- **Void exclusion** (FR-F2) is also a correctness/integrity control — void invoices must never inflate a financial column.

---

## 9. Requirement Traceability

FR/NFR IDs are foundation-scoped (no PRD exists; derived per `/tech-plan` Step 1). Each unblocks the noted spec stories, whose own coverage lands in per-report plans.

| Requirement | Unblocks (spec) | Phase | Layer | Files | Status |
|-------------|-----------------|-------|-------|-------|--------|
| FR-F8 `inventory_changes` INT→DECIMAL + QB fix | PV S5-R4 (Units Sold), QB integrity | 1 | DB/API | `InventoryChanges.orm.xml`, `api/migrations/VersionXXX`, QB sync read paths | Planned |
| FR-F1 paginated-report contract (RequestDto+Query, count+page, sort whitelist) | all six: server pagination/sort | 2 | API | `Reporting/Shared/UI/HTTP/DTO/ReportListRequestDto`, `.../Application/ReportListQuery`, `.../Infrastructure/Persistence/PaginatedReportResult` | Planned |
| FR-F2 void-exclusion predicate | SBC S7-R7, SBR §Assumptions, PV/IV | 2 | API | `Reporting/Shared/Domain/NonVoidInvoicePredicate` | Planned |
| FR-F3 money round-once rule | all six §rounding | 2 | API | `FixedDecimal2`/`DecimalValue` (blessed) | Planned |
| FR-F4 export contract + 10k cap | SBC S14/S15/S16, SBR S14-E2, PV S6, IV S10, TU S7 | 3 | API | `Reporting/Shared/Application/Export/ExportRowCapGuard`, `ReportExportTooLargeError`, PDF scaffold, CSV attachment helper | Planned |
| FR-F5 invoice financial columns + snapshot write | SBC/SBR money columns | 4 | DB/API | `Invoice.php`, `Invoice.orm.xml`, `InvoiceBuilder`, `InvoiceFinancialSnapshotService`, `api/migrations/VersionYYY` | Planned |
| FR-F6 invoice backfill command | SBC/SBR historical rows | 4 | API | `BackfillInvoiceFinancialColumnsCommand` | Planned |
| FR-F7 clock-record rebuild subscriber | SBC/SBR `hours_worked`/`labor_cost` accuracy | 4 | API | `RecomputeInvoiceLaborOnClockChange`, `ChangeCommandHandler` (+Move) `TaskChangedEvent` | Planned |
| FR-F9 paged report table composable | all six: server table | 5 | App | `app/src/composables/useReportTableQuery.ts` | Planned |
| FR-F10 remembered-view composable | SBC S6, SBR S23, PV S4-R6, TU §3, WIP S8, IV S8 | 5 | App | `app/src/composables/useRememberedView.ts` | Planned |
| FR-F11 shared toolbar controls | all six: location/date/columns/export/search | 5 | App | `shell/LocationFilter.vue`, `DateRangeSelector.vue`, `shell/ColumnSelector.vue`, `SubActionsDropDown.vue`, `shell/ReportSearchInput.vue` | Planned |
| FR-F12 report theme layer (two-tone + all-white) | SBC/PV S20/S7, SBR/TU/WIP/IV all-white | 5 | App | `app/src/css/app.scss` | Planned |
| FR-F13 reports nav + Parts group + registration contract | PV/IV S1 (Parts section), all nav placement | 5 | App | `ReportLeftMenuNav.vue`, `router/routes.ts`, `Reporting.vue` | Planned |
| FR-F14 reporting formatter module | all six: currency/margin%/Inv.Hrs/N days/em-dash | 5 | App | `app/src/utils/reporting.ts` | Planned |
| NFR-F1 p95 < 2s at largest-org volumes | preplan §1b.8 | 2,3 | API | contract + cap | Planned |
| NFR-F2 tenant scoping preserved (no cross-tenant here) | Golden Rule | all | API | — (snapshots deferred to report phases) | Planned |
| NFR-F3 replica-ready seam (connection injectable) | preplan §1 (deferred replica) | 2 | API | fetcher constructors take `Connection` | Planned |
| NFR-F4 migrations:diff no-op; INSTANT add; controlled COPY window | `database.md` | 1,4 | DB | both migrations | Planned |
| NFR-F5 money precision (SUM unrounded, round once) | all six §rounding | 2,4 | API | contract + snapshot | Planned |

_No E2E rows — foundation has no user-facing route; E2E lands with the per-report phases (§6)._

---

## Appendix — develop-drift corrections carried from the planner passes (read before implementing)

1. **TTR indexes — CORRECTED (verified directly against `git show develop:` on 2026-07-21).** The foundation `be-planner` claimed the composites don't exist; that was **wrong**. Committed develop `TechnicianTaskRecord.orm.xml:33-48` has the full set including the composites the preplan/addendum named: `ttr__workplace_id_start_date_idx (workplace_id, start_date)` (:44), `ttr__work_order_id_line_id_idx (work_order_id, line_id)` (:45), and `idx_ttr_wo_id_end_start (work_order_id, end_date, start_date)` (:46), plus the single-column set. So the preplan §2.4/addendum were correct: `ttr.line_id` IS indexed (via the `work_order_id,line_id` composite — matters for WIP's per-line clocked-time join), and single-WO recompute (Phase 4) can use `ttr__work_order_id_idx` or `idx_ttr_wo_id_end_start`. **Lesson: verify index/schema claims with `git show develop:<orm.xml>` — subagent reports (even the foundation planners') have been wrong on this.**
2. **TTR edit/move flows dispatch no domain event today** — Phase 4's subscriber needs **new** events on `Change`/`Move`, not just a new listener.
3. **`UpdateTotalWhen*` listeners only touch PENDING invoices via `InvoiceBuilder::updateInvoice`** — the snapshot must be recomputed in `updateInvoice` (not only `buildInvoice`), and the new clock subscriber must target **any non-void** invoice.
4. **`ReportRequestPayload` violates the RequestDto-vs-Query rule** and guards "over one year," not 366 — D4 builds a clean base instead.
5. **No online-DDL tooling in `api/migrations/`** — the `inventory_changes` COPY window is a genuine ops decision (§7); accept the window (precedent-consistent) unless prod sizing forces a copy-table procedure.
6. **CSV convention today is a JSON-wrapped string** (`Reporting/Export/.../ExportController`) — D5 switches the suite to true `text/csv` attachments; flag if you prefer to keep the legacy convention (changes Phase 5 export wiring).
7. **FE persistence conflict** — `wo-list-filters-plan.md` (not started) builds server-side `UserPagePreference` and lists Reports; D3 chooses per-browser now with a documented migration path so the two programs don't ship rival seams.
8. **Location switch clears the whole TanStack cache** (PR #1886) — don't add per-report location refetch subscriptions on top of `useReportTableQuery`.

---

# Part B — Per-Report Phase Groups

_Each report is a self-contained phase group on the same branch, built in order after Part A. Each carries its own mini architecture / DB / phases / tests / E2E / traceability. Report-specific seams grounded against `develop @ 674007b37e` (2026-07-21) by planner agents + direct `git show develop:` verification; the shared shell/contract (Part A) is assumed built._

## B1 — Work In Progress (WIP)

**Spec:** `reports-suite-specs/` (WIP page 703660034, build-ready 2026-07-21). **Depends on:** A2 (contract — but see note), A5 (shell: all-white theme, export menu, remembered-view, nav). **Complexity:** High (new money model + first cross-tenant snapshot cron).

### B1.0 Architecture note — WIP does NOT use the paged table

Unlike the other five reports, WIP loads the **entire bounded open-WO set** for the selected locations/date-range in one fetch, then does tabs, counts, summary strip, and the advisor/customer/asset filters **client-side** (spec: filters are on-screen, summary "recomputes with no reload"). So WIP uses a **plain TanStack `useQuery`** (fetch-all, house style — `queries.ts` AR-Aging comment block), **not** the Part A `useReportTableQuery`. It still consumes the rest of the shell (theme, `useRememberedView`, `LocationFilter`, `DateRangeSelector` 366-cap, `ColumnSelector`, export menu). The open-WO population is bounded (Milan: "All Time was never a scalability risk here"), but **stale-estimate accumulation can grow the Estimates tab** — verify volumes at largest orgs; if unbounded, revisit. Sort/pagination within the active tab is native `q-table` client-side.

### B1.1 Database changes (snapshot table)

| Migration/Change | Description |
|-----------------|-------------|
| `api/migrations/VersionWWW.php` (hand-written) | New table `work_order_wip_snapshot`. |
| `api/src/Reporting/.../WorkInProgressSnapshot.orm.xml` + entity | Doctrine mapping. |

```sql
-- Illustrative shape only. Story 11: one row per open WO per calendar date.
CREATE TABLE work_order_wip_snapshot (
  id             BINARY(16) NOT NULL,
  organization_id BINARY(16) NOT NULL,
  work_place_id  BINARY(16) NOT NULL,
  work_order_id  BINARY(16) NOT NULL,
  status         VARCHAR(32) NOT NULL,
  earned         INT NOT NULL,        -- cents (S11-R5 to the cent)
  remaining      INT NOT NULL,        -- cents
  snapshot_date  DATE NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY wip_snap__wp_wo_date_uniq (work_place_id, work_order_id, snapshot_date),
  KEY wip_snap__org_wp_date_idx (organization_id, work_place_id, snapshot_date)
);
```

Join the **org-purge path** (sandbox-purge project) — a new derived table must be purged with its org. No FK (plain-id columns, project convention); no reader in this version (S11-R7).

### B1.2 Backend phases

**Open-WO + money model fetcher** (`api/src/Reporting/.../WorkInProgress/`):
- **Open set:** `work_order` where `type = Type::SERVICE` and `status IN (estimate, approved, in_progress, ready_for_review, complete)` (exclude invoiced/paid/declined), scoped by `work_place_id`. **Date-range anchor = `work_order.start_date`** — verified: there is **no** `created_on`/`created_at` column on `work_order` (only `start_date` datetime + `end_date` nullable, `WorkOrder.orm.xml:14,34`); `start_date` is the creation timestamp. Days Open = floor((now − start_date)/24h). Advisor = `service_advisor_id` → staff (indexed).
- **Tab placement** (single partition, mutually exclusive): Estimate→Estimates; Complete→Completed; In Progress|Review→Approved-partial; Approved→Approved-partial if any clocked time OR any part received, else Approved-not-started.
- **Approved lines:** `LineStatus::isLineApproved()` → `[authorized, complete]` (confirm enum on develop). Quoted labor value per line from `work_order_line.time_estimate` (minutes) × labor rate.
- **Labor Earned** = Σ per approved labor line `min(clocked-time value, quoted value)`; clocked-time value from `technician_task_record` joined by `line_id` (index `ttr__work_order_id_line_id_idx` — **confirmed exists**, orm.xml:45) × `hourly_rate`. **Open TTR policy** (`end_date` NULL): value clocked time with `COALESCE(end_date, NOW())` — but note the earned cap at quoted makes runaway open clocks harmless. **Do NOT copy** the existing Reporting-WIP clocked-minutes subquery (it aggregates the whole `ttr` table unscoped, and open rows drop out of `TIMESTAMPDIFF` sums — preplan addendum).
- **Labor Remaining** = Σ quoted approved labor − Labor Earned.
- **Parts Earned/Remaining:** `work_order_part_request.part_request_status` (received/in_stock = received → Parts Earned; authorized_to_order/waiting_to_receive = ordered-not-received → Parts Remaining) + `work_order_part.arrived_date`; sell value incl. `core_charge` (INT cents on both). Verify the exact status enum values at implementation.
- **Last Activity** = `MAX(entity_event.occurred_at)` for the WO via `ee__entity_time` (+ `entity_event_ref` for line-scoped events); "—" when none. Live subquery is acceptable at the bounded open-WO scale; denormalize `work_order.last_activity_at` only if it's hot. (preplan addendum)
- **Void:** not applicable (open WOs aren't invoices); no void filter needed here.

**Delete dead WIP code** (preplan §1b.5, confirmed on develop):
- BE: `Reporting/Reports/Application/WorkInProgress` segment handler + `Dashboard/Application/Query/WorkInProgress` (served via `/api/dashboard/reports`) + the `reporting/work-in-progress` endpoint. Confirm the earned/remaining model is NOT already on develop (preplan verified only the segment report + Dashboard sections exist).

**Nightly snapshot (Story 11) — 🔴 cross-tenant Golden-Rule exemption:**
- Command `app:reporting:capture-wip-snapshots` (`Application/CLI/`), copying the `PopulateWorkOrderTotalPriceValues` session-injection pattern to iterate every org/workplace with no HTTP session; EventBridge→ECS RunTask rule (~08:00 UTC) per `ecs-scheduled-tasks.tf`. Idempotent **delete+reinsert per (workplace, work_order, date)**. Same open-WO + service conditions as the report (S11-R4), same earned/remaining computation (S11-R3), values to the cent, WO with nothing approved → `$0.00`/`$0.00` (S11-R6).
- **This is the suite's first cross-tenant cron.** It must be recorded in the PR's "Golden Rule Exemptions" block (tenant-scoping exemption, tracked our side per preplan §1). Every *read* path (the report itself) stays request-scoped.

### B1.3 Frontend phases

New folder `app/src/components/ts/reporting/work-in-progress/`:
- **`WorkInProgressReport.vue`** — 4 tabs via the `UnexportedItems.vue` label-with-count pattern (`"Completed (22)"`), default "Approved - partially completed"; one loaded dataset → one `visibleJobs` computed (advisor ∧ customer ∧ asset predicates) → partition-by-tab computed → counts/summary/totals all derive from it (wire strip+table+counts to the one chain so "no reload" recompute is free). All-white theme. Route title meta `"Work In Progress - Report"` → yields `"...| ShopView"`.
- **`WipSummaryStrip.vue`** — 7-figure band (copy `ApprovalsWaitingOnCustomerCard.vue` cell shape); hero Total Earned (larger + colored underline, small net-new CSS); muted Estimates; verbatim tooltip strings via `q-icon name="info"` + `q-tooltip` (FallbacksPanel pattern).
- **Two-line Asset cell** (`#body-cell-asset`: unit# bold / VIN `text-caption text-grey-7`; fallbacks `"(no unit #)"` / `"— no VIN —"`); **Status badge** = `q-badge :color="colorCoding(status)" :text-color="textColorCoding(status)"` (`helpers.ts:1200/1249`) — reuse the WO status tokens, don't fork. **Inv. Hrs** signed 1-decimal + `text-positive`/`text-negative` (Part A formatter). **Days Open** "X days" (not pluralized). **Per-tab Totals row** = `#bottom-row` + `.sticky-bottom-row` (copy `ShopBillingEfficiency.vue`). Pinned bold Total column (sticky-right, net-new CSS).
- **Client filters:** Advisor multi-select (`MultipleToggleSelect`), Customer + Asset type-ahead multi-select (base `Select multiple use-input @filter`, options derived from **loaded jobs** — Sales.vue `filterCustomers` mechanic — applied client-side). WO# link → `router.push('/workorders/:id/lines')` same-tab.
- **Add to the Part A formatter module:** `formatLastActivity` ("Today"/"Xd ago"/"—") — net-new, plain date-diff (no dayjs relativeTime plugin in repo).
- **Delete dead WIP FE** (confirmed inventory): uncomment→replace nav entry (`ReportLeftMenuNav.vue:104-123`); delete `WorkInProgress.vue` + its spec, `WorkInProgressRow`/`WorkInProgressSubRow`/`WorkInProgressItem` (`Model.ts:1-11`, `ReportingModel.ts:260-276`), `useWorkInProgressQuery` (`queries.ts:67-75`) + barrel re-export, `reportingApi.fetchWorkInProgressReport` (`index.ts:151-153`), `reportingKeys.workInProgress()`. **Reuse the route name `WorkInProgress` + path `reports/work-in-progress`** (only change `meta.title`) so `LocationSelector.vue:162` and nav specs keep working. Update `Reporting.vue` componentMap/`routeNameToTabName` + `Reporting.spec.ts`/`ReportLeftMenuNav.spec.ts` in lock-step.
- **Export** per current tab: server-side per the Part A export contract; the request carries the active tab + client filters; header renames "Asset"→"Unit", "Location"→"Branch" live in the export layer (S9-E1). Files `wip-2-report.pdf`/`.csv`.

### B1.4 Tests
- **BE:** tab placement for each status (+ Approved with/without started work); Labor Earned caps at quoted; open-TTR valuation; Parts Earned vs Remaining by request status; Total = Earned+Remaining ≠ `work_order.total_price`; snapshot command idempotency (re-run replaces the date's rows) + cross-tenant span + `$0.00` for nothing-approved.
- **FE:** partition mutually-exclusive; summary strip recomputes from filtered jobs with no refetch; two-line asset fallbacks; Inv. Hrs coloring; "X days"/"Xd ago" formatters.

### B1.5 E2E (`e2e/`) — hard-block pass at report completion
- **Reference-breakage scan (mandatory):** the deleted `data-test-id="table_work_in_progress_report"` and old nav id — any existing spec referencing them must be updated/removed.
- Happy paths: report loads on default This Week; tabs show counts; expand a tab, WO# opens the WO same-tab; advisor filter narrows rows + recomputes summary; export CSV downloads.
- Edge: empty-state per tab; Estimates tab all-`$0.00`; permission-denied nav absence.

### B1.6 Traceability (WIP)
| Spec area | Phase | Layer | Files |
|---|---|---|---|
| Open-WO scope + tabs (S2/S3) | B1.2 | API | `Reporting/.../WorkInProgress/*` |
| Earned/Remaining money model (S4-R15..R21) | B1.2 | API | fetcher + `WorkOrderStatsFetcher`-style calc |
| Summary strip (S5) | B1.3 | App | `WipSummaryStrip.vue` |
| 4 tabs + counts (S1/S3) | B1.3 | App | `WorkInProgressReport.vue` |
| Client filters (S7) | B1.3 | App | advisor/customer/asset selects |
| Export (S9) | B1.2/B1.3 | API/App | export contract + menu |
| Nightly snapshot (S11) 🔴 exemption | B1.2 | API/DB | `capture-wip-snapshots` + `work_order_wip_snapshot` |
| Delete old WIP | B1.2/B1.3 | API/App | segment handler + FE inventory above |

## B2 — Technician Utilization (TU)

**Spec:** TU page 641400833 (build-ready 2026-07-16, single report-level timezone). **Depends on:** A2 (contract), A5 (shell: all-white theme, export menu, remembered-view). **Complexity:** Medium-High (must reconcile to the cent with the existing Timesheet Activities report). **Grounding:** preplan §2.4 (thorough) + direct TTR-index confirm; the TU-BE agent stalled, so **re-verify the two flagged points at implementation** (Timesheet methodology alignment; `labour_type` default-rate query).

### B2.0 Architecture note — reuse Timesheet Activities, add per-technician grouping

TU reads the **same clock data** as the existing Timesheet Activities report and must reconcile to the cent for the same range + single location + closed records (S1-R9). The safe path is to **reuse the existing methodology**, not re-derive it: the row/day hours computation lives in `App\Reporting\Domain\TimesheetActivity\Services\DataProvider` (range-clamped per-record hours SQL, `COALESCE(end_date, NOW())`) + `ReportGenerator` (PHP: UTC→local, midnight split with 23:59:59 day-ends, half-away-from-zero, drops out-of-window split ranges). TU adds a **per-technician grouping** layer over that. ⚠ **Trap (preplan §2.4):** Timesheet's totals and rows use *two different methodologies* — TU must compute every displayed number from **unrounded** values and round once (§3 of the spec), which is what makes the reconciliation hold. Server-paginate technician rows via the Part A contract; per-day rows load lazily on expand.

### B2.1 Database changes
**None.** TU is read-only over `technician_task_record`, `labour_type`, `workplace`, `staff`. No new columns, no snapshot.

### B2.2 Backend
- **Fetcher** (`api/src/Reporting/.../TechnicianUtilization/`): one row per staff who clocked time in range at the selected location(s). Total = all clocked; **WO Hours** = records with `work_order_id`; **Internal Hours** = records with `department_id` (internal). Clock source `technician_task_record` (`start_date`, `end_date` NULL=open, `staff_id`, `workplace_id` **nullable**, `hourly_rate` = staff cost-rate snapshot — NOT the location labor rate, `billable`). Indexes available incl. `ttr__workplace_id_start_date_idx`, `idx_ttr_wo_id_end_start` (confirmed present, orm.xml:44-46).
- **Day-grouping + windowing in ONE report-level timezone = the active workplace's** (S1-R7), regardless of each record's own location — matches Timesheet Activities' single-tz grouping (this is the resolution of the old S1-R7/S1-R9 contradiction, Milan's option 1). `workplace.timezone` nullable → UTC fallback.
- **Est. Lost Labor** = Σ per contributing location (that location's **default labor rate** × the tech's internal hours there), summed at full precision, rounded once. Default rate is a `labour_type` row with `is_default = 1` per workplace (`labour_rate` int cents) — **NOT** on `workplace`; **no unique constraint on `is_default`** (pick deterministically if duplicates), and a workplace may have **no** default → that location's internal hours are unvalued and the tech's Est. Lost Labor is "—" only if *no* contributing location has a rate (S2-E3), else partial (S2-E4). NULL-`workplace_id` records are unattributable to a rate/tz — policy: exclude from valuation, document.
- **Reconciliation:** adopt `ReportGenerator`'s methodology verbatim for the hours math so S1-R9 holds; verify the day-split + rounding match at implementation with a same-range/same-location diff test against Timesheet Activities.
- **Contract:** clean `ReportListRequestDto` base; server sort whitelist incl. the S2-R17 nulls-to-bottom rule for Est. Lost Labor "—".

### B2.3 Frontend (`app/src/components/ts/reporting/technician-utilization/`)
- Technician rows + pinned bold **Est. Lost Labor** column (far right) with info-icon tooltip "Internal hours valued at each location's default labor rate"; Summary row (pinned bottom, over **visible** technicians = tech-filter selection). Per-day breakdown lazy-loads on row expand (like SBR/TE expandable pattern). All-white theme.
- **Tech filter = on-screen only** (deselected-set persistence, S5-R9); **location filter reloads** (server). Sort resets to Technician A→Z on every reload (NOT remembered — S2-R15), unlike the other reports.
- **Total Hours = deep-link** to the existing Timesheet Activities report filtered to that technician + range (same tab). Confirm the Timesheet Activities route/param contract at implementation (technician id + date range; it does NOT pass location — S6-R6 known drill-through limitation).
- Est. Lost Labor "—" carries AT label "No default labor rate configured" (S8-R11); `aria-sort` on active header.

### B2.4 Tests
- **BE:** reconciliation to the cent vs Timesheet Activities (same range, single location, closed records); WO vs internal split; per-location Est. Lost Labor incl. partial (rated + unrated locations) and "—" (no rate anywhere) and "$0.00" (known $0 rate / zero internal hours); open-record snapshot-at-load; multi-location single-tz grouping.
- **FE:** Summary recomputes over visible techs; nulls-to-bottom sort; deep-link params; sort resets on reload.

### B2.5 E2E — reference-breakage scan + happy paths (load, expand a tech to day rows, Total-Hours deep-link opens Timesheet Activities, tech filter hides a row + Summary updates, CSV export). Edge: no-clocked-time empty state; Est. Lost Labor "—" row.

### B2.6 Traceability (TU): S1/S2 columns+calc → B2.2 fetcher; S2-R8 Est. Lost Labor → B2.2 `labour_type` join; S3 Summary → B2.3; S4 per-day → B2.3 lazy expand; S6 deep-link → B2.3; S9 location → A5 `LocationFilter`; S7 export → A3 + B2.3.

## B3 — Parts Velocity (PV)

**Spec:** PV page 620888066 (build-ready 2026-07-16, server-side). **Depends on:** A1 (`inventory_changes` DECIMAL fix — Units Sold precision), A2 (contract), A5 (shell: **two-tone** theme, export menu). **Complexity:** High (multi-source movement math, per-location vs merged rows). **Grounding:** preplan §2.3 + direct origin-enum confirm; PV-BE agent stalled → **re-verify the movement queries + `InventoryQueryHandler` discriminators at implementation**.

### B3.1 Database changes
| Migration/Change | Description |
|---|---|
| `api/migrations/VersionPPP.php` | New composite index `inventory_changes (workplace_id, inventory_part_id, origin, created_at)` (+ a `catalog_part_id` variant) — all movement-table indexes are single-column today (preplan §2.3); PV's windowed per-part-per-origin scan needs the composite. |
| `part` table + `Part.orm.xml` | New `part.last_sold_at` (datetime, nullable) denormalized column (§3.3b) — kills the all-time `MAX()` sub-select anti-pattern (`InventoryQueryHandler:354-366`). |

Maintenance for `last_sold_at`: set on invoice create; recompute on invoice reversal (reversed sale may have been the latest → per-part `MAX` over remaining history inside the reversal transaction, which already touches the parts). Backfill command `app:inventory:backfill-last-sold-at` (writer, batched, idempotent).

### B3.2 Backend
- **Row model:** INVENTORY parts = per-`(part, workplace)` rows (On Hand/Min/Max never summed); CATALOGUE parts = one row merged across selected locations. **Core parts excluded** from both. Type filter Both/Inventory/Catalogue.
- **Inventory movement** (`inventory_changes`, now DECIMAL after A1): origins confirmed on develop = `InventoryManual`, `WorkOrderInvoiceCreate`, `WorkOrderInvoiceReverse`, `WorkOrderPartPick`, `WorkOrderPartReturn`. **Units Sold** = net over invoicing events (`WorkOrderInvoiceCreate` adds, `WorkOrderInvoiceReverse` subtracts) windowed by movement date — **filter by origin is mandatory** (manual adjustments + receiving also write here). **Demand** = count of in-window invoicing events (reversal doesn't decrement). The invoicing relabel behavior (pick row relabeled to `WorkOrderInvoiceCreate`, `created_at` overwritten with invoice date) is why movement date ≠ WO date is expected.
- **Catalogue** = `work_order_part_request` (`part_source_type='vendor'`, `catalogue_part_id` indexed no-FK, quantity, requested/ordered/received dates, `is_core`; **no workplace column → join `work_order`**) on Invoiced/Paid WOs windowed by WO end date.
- **Returns (Units Returned)** = `work_order_part_return_request` (`quantity`, `request_date`, `is_return_removed`=cancelled → exclude, `is_based_on_core_charge`=core → exclude, own `workplace_id`) + `part_sale_credit(_item)` (no cancellation flag). Pattern: `ReturnsQueryHandler`.
- **Profitability** (Revenue/Margin/Unit Cost/Sell Price/Margin%) from **billed part lines**: `work_order_part` (`quantity`, `cost`/`cost_decimal`, `sell_price`, `is_core`, `vendor_id`, `inventory_part_id` nullable) + `invoice_statement_item` snapshot (cost NOT snapshotted → join live `work_order_part.cost`). **Net reversals** via the A2 void predicate + reversal-hard-delete. Sold via WO (Service-type) / Sold via Parts Sale (Parts-type) via `work_order.type`.
- **Stock/thresholds:** `part` table per-`(catalogue part, workplace)` (`quantity`, `min`, `max`, `is_core`, `vendor_id`, `purchase_price`=AVG cost); category `catalogue_part.category`; bins `inventory_bin_location` + `inventory_part_bin_location`.
- **Last Sale** = whole days from today to `part.last_sold_at` (all-time, location-scoped) — served from the new denorm column, not a live MAX.
- **Pattern art:** `Dashboard/Application/Query/Inventory/InventoryQueryHandler` (units sold/revenue/COGS/velocity) — **do NOT copy** its WO-type IN-list heuristic (wrong values) or its `workplace_location_id` introspection hack; scope by `workplace_id`, type via `Type::PARTS`. Verify the correct discriminators at implementation.
- **Contract:** server pagination/sort (default Demand desc)/filters (Type, date 366, category, vendor, bin, location, toolbar search on part#/description); export CSV/PDF (A3) 10k cap. Permission: existing **Inventory Reports→View** (`ROLE_REPORT_VIEW` family — no new atom).

### B3.3 Frontend (`app/src/components/ts/reporting/parts-velocity/`)
- **Two-tone theme** (Part A theme layer). New **Parts** nav group (created in A5). Single flat table, 20 columns / 14 default-visible (column picker), Type filter first, Location rightmost. Info-icon tooltips on Units Sold / Demand / Turns/Yr (verbatim S3-R6 strings). Catalogue rows render `—` for On Hand/Turns/Min/Max. Server pagination via `useReportTableQuery` (A5). Export menu (A3). Page-local search (A5).
- Formatter module (A5): negative movement leading-minus, currency, margin% 1dp + em-dash, "N days", em-dash null.

### B3.4 Tests
- **BE:** Units Sold nets reversals (can be 0/negative) and is movement-based (differs from billed units — S5-R7); Demand unaffected by reversal; core excluded; catalogue merged across locations vs inventory per-location; Units Returned excludes cancelled + core; `last_sold_at` maintained on create/reversal; profitability nulls (Unit Cost/Sell Price when billed units ≤0; Margin% when Revenue ≤0).
- **FE:** column picker default 14; catalogue `—` cells; two-tone rendering; server sort/filter round-trips.

### B3.5 E2E — reference-breakage scan + happy paths (Parts nav → PV loads This Year/Both; Type=Catalogue shows `—` inventory cells; category/vendor/bin filters; toolbar search; column picker; CSV export). Edge: bin filter + Type=Catalogue = empty (S2-R8); export >10k cap toast.

### B3.6 Traceability (PV): S2 filters → A5 + B3.2; S5 metrics → B3.2 fetcher; `last_sold_at` → B3.1; S3 row model → B3.2; S4 columns/remembered view → A5; S6 export → A3; S7 two-tone → A5 theme.

## B4 — Inventory Value (IV)

**Spec:** IV page 720142338 (build-ready 2026-07-21, fully server-side). **Depends on:** A2 (contract), A3 (export cap), A5 (shell: **all-white** theme, Parts nav group, export menu). **Complexity:** High (pricing-matrix sell in SQL + second cross-tenant snapshot cron + retention). **Grounding:** IV-BE agent (complete, verified @ 674007b37e).

### B4.1 Database changes
| Migration/Change | Description |
|---|---|
| `api/migrations/VersionIVI.php` + `InventoryValueSnapshot.orm.xml` | New table `inventory_value_snapshot`. |
| (verify) `pricing_rule.matrix_id` index | Mapping shows only `prule__part_id_idx`/`prule__type_idx` — confirm the FK-join index exists in prod DDL; add `prule__matrix_id_idx` if absent (globally-unique name rule). |

```sql
-- Illustrative. Denormalized names on purpose (survive category/vendor rename/delete on as-of replay).
CREATE TABLE inventory_value_snapshot (
  id BINARY(16) NOT NULL, organization_id BINARY(16) NOT NULL, work_place_id BINARY(16) NOT NULL,
  part_id BINARY(16) NOT NULL, catalogue_part_id BINARY(16) NOT NULL,
  part_number VARCHAR(...), description VARCHAR(...),
  category_id BINARY(16) NULL, category_name VARCHAR(...) NULL,
  vendor_id BINARY(16) NULL, vendor_name VARCHAR(...) NULL,
  quantity DECIMAL(10,2) NOT NULL, unit_cost INT NOT NULL, unit_sell INT NOT NULL,   -- cents
  total_cost BIGINT NOT NULL, total_sell BIGINT NOT NULL,                            -- cents
  snapshot_date DATE NOT NULL, PRIMARY KEY (id),
  UNIQUE KEY ivs__workplace_part_date_unq (work_place_id, part_id, snapshot_date),
  KEY ivs__org_workplace_date_idx (organization_id, work_place_id, snapshot_date),
  KEY ivs__snapshot_date_idx (snapshot_date)
);
```
Join the **org-purge path**. **⚠ Sizing gate (do before locking):** run prod `COUNT(*) FROM part WHERE quantity>0 AND is_core=0` per workplace — fleet-wide daily rows could be 50–200M/yr. Retention (below) bounds it; if it still lands >100M, month-RANGE partitioning (drop-partition prune; `snapshot_date` already in the unique key; DBAL ignores partitions so `migrations:diff` stays a no-op). Keys are designed for this now; defer the partition decision to the number.

### B4.2 Backend
- **Fetcher** (`api/src/Reporting/.../InventoryValue/`): one row per `(part, workplace)`, `is_core = 0`, in-stock. Join skeleton = `DbalPartListFetcher::searchParts` (`part p` → `catalogue_part cp` → `part_category pc` → `part_vendor v`; description = `cp.name`), swapping single-workplace `WorkplaceDecorator` for the accessible-locations multi-select.
- **Qty decision (surface, don't bury):** use `AVAILABLE_QUANTITY_SQL` (positive-bins-only, `PartSupplyFilterDecorator`) for BOTH the `qty > 0` predicate and the Qty-on-Hand column, so IV agrees with the Parts page (the SV-8102 drift: `part.quantity` is the all-bins sum incl. negative bins; the list displays positive-bins-only). Use the **same expression** in the nightly capture so as-of replay matches live. (Dashboard valuation uses raw `p.quantity` — do NOT copy.)
- **Unit cost** = `p.purchase_price` (already cents). **Unit sell** = the **one shared SQL sell expression** (used by both the live query and the capture `INSERT…SELECT` — guarantees "recorded = live"): fixed → `ROUND(p.fixed_sell_price*100)`; no category → cost; else matrix markup resolved via `part_category.pricing_matrix_id` (indexed, event-maintained — **correction to preplan: no `FIND_IN_SET`/normalization needed**) → org default (`pricing_matrix.is_default`) fallback → `pricing_rule` interval pick with the applier's clamp semantics (below-first→first, above-last→last). **Ship a cent-parity test** (same part through `PricingRulesApplier` vs the SQL). Degrade to sell=cost for a categorized part in a zero-matrix org (the applier throws there — deliberate divergence).
- **Margin** = Total Sell − Total Cost (extended, S3-R8); **Margin %** = Margin ÷ Total Sell (em-dash when ≤0). **Total Cost** pinned bold, default sort desc. **Totals row** server-computed over the full filtered set (A2 count helper, same WHERE, no pagination).
- **As-of:** window reaches today & today not captured → live query; else `snapshot_date = MAX(snapshot_date ≤ end-of-range)` per workplace; "As of X" indicator when replaying an older day (S5-R5). No snapshot on/before → empty state.
- **Permission:** `ROLE_REPORT_VIEW` (the inventory-reports atom was retired SV-7478 — **correction to spec wording**; no new atom). Category/Vendor/part-search all server-side; export CSV/PDF via A3, 10k cap.

**Nightly snapshot + retention (Story 11) — 🔴 cross-tenant Golden-Rule exemption:**
- Command `app:reporting:capture-inventory-value-snapshots`: per workplace `DELETE WHERE (work_place_id, snapshot_date)` + `INSERT…SELECT` using the shared sell expression (set-based, no per-row PHP). **Likely no session-injection hack needed** — pure DBAL with explicit `:organizationId`/`:workplaceId` params avoids the session-driven decorators (unlike WIP's `WorkOrderStatsFetcher` path); reserve the `PopulateWorkOrderTotalPriceValues` seam only if a PHP fallback is used (and then `resetMatrices()` per org — the applier's static cache leaks across orgs in one CLI process).
- Retention prune (≤13mo daily → monthly last-capture), as an in-command step after capture (one seam; capture idempotent so a prune failure can't corrupt it): batched `DELETE … WHERE snapshot_date < :cutoff AND snapshot_date NOT IN (MAX per workplace per calendar month)` — copy `PurgeAuditLogCommand` mechanics.
- EventBridge→ECS RunTask rule (nightly) copying the `audit_log_purge` wiring. Record the exemption in the PR block.

### B4.3 Frontend (`app/src/components/ts/reporting/inventory-value/`)
All-white theme; **Parts** nav group (shared with PV, created in A5). Server-paginated table (`useReportTableQuery`), Total Cost pinned bold + default sort desc. Column picker (Margin + Total Sell off by default). Date-range control is an **"as-of" anchor** (not a created-date filter) with the "As of X" indicator. Category/Vendor filters + page-local part search (all server-side). Export menu (A3). Formatter module (A5): currency, margin% 1dp + em-dash, em-dash for null category/vendor.

### B4.4 Tests
- **BE:** sell-expression parity vs `PricingRulesApplier` (fixed / no-category / matrix-interval / clamp / zero-matrix-org); is_core + qty>0 (bin-derived) scope; totals over full filtered set; as-of resolution (live today / nearest snapshot / none→empty); capture idempotency + cross-tenant span; retention prune keeps monthly tail.
- **FE:** as-of indicator shows only when replaying older day; column defaults; server filter/sort round-trips.

### B4.5 E2E — reference-breakage scan + happy paths (Parts nav → IV loads This Month as-of today; category/vendor filter; part search; column toggle Margin on; CSV export). Edge: past date before first capture → empty; export >10k cap toast; qty-drift part shows positive-bins qty.

### B4.6 Traceability (IV): S2 row scope → B4.2; S3 columns/sell → B4.2 sell expr; S4 totals → B4.2 + A2; S5 as-of → B4.2; S6 filters+search → A5+B4.2; S9 sort → A2; S10 export → A3; S11 snapshot+retention 🔴 → B4.1/B4.2; S12 all-white → A5.

## B5 — Sales By Customer (SBC)

**Spec:** SBC page 577634305 (build-ready 2026-07-21). **Depends on:** A2 (contract), A4 (invoice financial columns — the aggregation source), A5 (shell: **two-tone** theme). **Complexity:** High (3-level tree + lazy drill-down + dedicated permission). **Grounding:** SBC/SBR-data-BE agent (complete) + SBR-FE agent (expandable/lazy/badge/link patterns transfer) + SBC spec.

### B5.1 Database changes
**No new report tables** — SBC aggregates the A4 invoice financial columns. **One new permission atom** (§B5.3).

### B5.2 Backend (`api/src/Reporting/.../SalesByCustomer/`)
- **Customer rows** (server-paginated): `SELECT company_id, c.name, COUNT(*), SUM(labor_sell/labor_cost/parts_sell/parts_cost/shop_supplies_charge/hours_invoiced/hours_worked), MAX(created_on) FROM invoice JOIN work_order (product-type via wo.type) JOIN company GROUP BY company_id`, filtered by `(work_place_id IN …, created_on range, status != void)` on `inv__work_place_id_created_on_idx`. Subtotal = labor_sell+parts_sell+shop_supplies_charge; Margin excludes shop supplies. Group by `company_id` (the customer company, index `inv__company_id_idx`) — NOT `customer_id` (contact). Void via A2 predicate (`CustomersSpendingQueryHandler` is the shape but **misses void** and loads all into PHP — don't copy those). Sort-by-Date = `MAX(created_on)` (aggregate in the sort whitelist).
- **Totals** (S18-R6): same WHERE, no GROUP BY (A2 count helper handles rowsNumber for customers).
- **Customer type-ahead** (S18-R2): `SELECT DISTINCT company_id, c.name … WHERE c.name LIKE :contains` over the same filtered base; all-customers = a flag state (not an enumeration).
- **Asset drill-down (lazy, per customer):** group that customer's filtered invoices by `COALESCE(wo.vehicle_id, <snapshot key>)`; labels built from `invoice_vehicle_details` **text** fields (`year/make/model/unit/licence_plate/vin` — already denormalized, no maker/model FK joins). "Parts Sales" bucket = `wo.vehicle_id IS NULL` (S8-E3). Live `wo.vehicle_id` vs snapshot can drift (vehicle-switch/dedupe history) — group by current `vehicle_id`, label from a deterministic snapshot (most-recent invoice in the group); note the drift. Dup-label `(#1)/(#2)` needs a stable tiebreaker (vehicle_id/snapshot-id order).
- **Invoice detail rows:** emit `workOrderId` + `type` per row (service → WO Finance tab; parts → part-sale Part Requests tab — a part sale **is** a `type='parts'` WO, no separate entity). `DbalSalesReportDataFetcher::buildInvoiceSubquery` is the copy-me (`record_id` + `work_order_type`).
- **🔴 Multi-location tenant-scoping:** intersect requested `workplaceIds` with `WorkplaceFetcher::getByUserId()` (admin → `getAllForOrganization()`) server-side AND keep `OrganizationDecorator` on the query (S4-R9). **Do NOT copy** the TimesheetActivity `DataProvider` precedent — it takes raw `workplaceIds` and skips accessible-set validation + org re-scope. Surface as an explicit design point.
- **Backfill-NULL guard:** invoices predating the A4 backfill mid-deploy could have NULL columns — `COALESCE(...,0)` or gate report launch on backfill completion.
- **Exports** flat (Customer→Invoice, no asset layer), CSV/PDF/Print via A3; 10k cap counts **customer rows + invoice rows** (two-level — the A3 guard takes a per-report count callable for exactly this).

### B5.3 Dedicated view permission (SV-5319 model) — one commit, drift-gate-enforced
All per-report atoms were retired in SV-7478; the AP/AR survivors (`ROLE_ACCOUNT_{PAYABLE,RECEIVABLE}_REPORT_VIEW`) are the carve-out pattern. Registration checklist (must land together or CI `be-permission-drift` fails):
1. Atom `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW` in `PermissionEnum`.
2. Bundle decision — new `FEPermissionEnum` case (a 43rd bundle) vs ride an existing one. The 42-bundle set is "locked" (SV-7476) → **product-level decision to surface**, not a mechanical default.
3. `FEPermissionMappings::getMappings()` bundle→atom entry (+ any read-companion atoms — SBC's customer type-ahead is its own endpoint, so likely none; verify).
4. `IntentionalAtomChanges::ADDED_BY_DESIGN` entries for every default role that gains the atom.
5. Seeder CLIs (`app:insert-fe-permissions`, `app:assign-fe-permissions-to-be-permissions`, `app:insert-be-permissions`) — deploy step, not migration.
6. FE mirror `app/src/services/permissions/bundleCatalog.ts`.
Every SBC endpoint (rows, drilldown, typeahead, totals, CSV, PDF, Print) gates on the new atom via `#[IsGranted]` — NOT `ROLE_REPORT_VIEW` (S1-N1).

### B5.4 Frontend (`app/src/components/ts/reporting/sales-by-customer/`)
- **Two-tone theme** (A5): customer + header rows white; asset + invoice rows blue-grey; indentation per level; pinned Subtotal on the row's own background.
- **3-level tree** Customer→Asset→Invoice: server-paginated customer rows (`useReportTableQuery`); asset+invoice rows **lazy-fetched on first expand** (per-parent fetch + inject under parent — `TechnicianEfficiencyInvoiced.vue` `#body` slot + `expanded`/`lines` row model is the precedent). Header chevron expand-all **bounded to the current page's customers** (≤ page-size lazy fetches). Any server re-fetch (date/type/location/customer-filter/sort) collapses all.
- Customer type-ahead multi-select with all-customers **state flag** (auto-includes new customers). Product-Type dropdown. Inv. Hrs colored (`+`/green, `-`/red, `0.0` default); Margin % monochrome + em-dash. Invoice# link → same-tab WO Finance / part-sale Part Requests (route by `type`). Export menu (A3, flat).
- Column selector (9 toggleable; Customer + Subtotal always shown). Remembered-view (A5): customer-filter state, product type, location, sort, columns.

### B5.5 Tests
- **BE:** customer aggregation matches per-invoice sums (void excluded); product-type by `wo.type`; asset grouping (vehicle_id + snapshot fallback; Parts Sales bucket); multi-location intersect drops inaccessible ids; totals over full filtered set; export two-level count cap.
- **FE:** lazy drill-down fetches once per customer; expand-all bounded to page; two-tone rendering; type-ahead all-state auto-includes new customer; link routing by type.

### B5.6 E2E — reference-breakage scan + happy paths (permission-gated nav visible only with the atom; report loads This Month; expand customer → assets → invoices; invoice link opens WO Finance same-tab, back restores; customer filter narrows; CSV/PDF export). Edge: empty state; Parts Sales bucket; permission-denied (no atom) → nav hidden + direct-link denied (S1-N1).

### B5.7 Traceability (SBC): S1 permission 🔴 → B5.3; S2/S3/S4 filters → A5+B5.2; S7 customer rows → B5.2; S8 tree/lazy → B5.2+B5.4; S9 invoice link → B5.2+B5.4; S10 server sort → A2; S11 pinned Subtotal → A5; S14/S15/S16 exports → A3+B5.2; S18 customer filter → B5.2+B5.4; S20 two-tone → A5.

## B6 — Sales By Representative (SBR)

**Spec:** SBR page 585629698 (build-ready 2026-07-21). **Depends on:** A2, A4 (invoice financial columns), A5 (**all-white** theme). **Complexity:** Highest (net-new rep schema chain + WO field + staff dialog + 4-format export). **Grounding:** SBC/SBR-data-BE + SBR-FE agents (both complete). Built last (build order) so foundation + SBC learnings settle first.

### B6.1 Database changes (net-new rep schema, forward-only, NO backfill)
| Change | Description |
|---|---|
| `staff.is_sales_rep` BOOLEAN default 0 | `Staff.orm.xml` — copy the `billable`/`clockable` boolean-with-default shape. |
| `work_order.sales_rep_id` (+ `wo__sales_rep_id_idx`) | `WorkOrder.orm.xml` — copy the `serviceAdvisorId` embedded pattern. |
| `invoice.sales_rep_id` + `invoice.sales_rep_name` (+ index on sales_rep_id) | `Invoice.orm.xml` — copy the `CompanySalesRepresentative` embeddable (id + denormalized name). |

Hand-written migrations, `migrations:diff` no-op, no FKs (mirrors `company.sales_rep_id`). **🔴 There are NO dual parts/service rep fields on develop** (swept `api/src` — zero hits; the spec build-note describes the dead prototype) — **nothing to collapse**; build the single-rep chain fresh and say so in the plan so nobody hunts phantom columns.

**🔴 Identity decision (most bug-prone point in SBR):** `work_order.service_advisor_id` = **staff.id**, but `company.sales_rep_id` = **user.id**. Pick ONE identity for `work_order.sales_rep_id`/`invoice.sales_rep_id` — **staff.id recommended** (mirrors service_advisor) — and translate the customer-rep fallback via `staff.user_id` (1:1, indexed). Make this explicit.

### B6.2 Backend (`api/src/Reporting/.../SalesByRepresentative/` + cross-context writes)
- **Rep snapshot write** at invoice creation (in `InvoiceBuilder::buildInvoice`, WO + company already in scope): WO rep (staff.id → name from staff) → else customer rep (user.id → translate via `staff.user_id`; name from staff, else company's denormalized name) → else NULL/NULL. **Must NOT be recomputed in `updateInvoice`** (immutable per S19-N2 — the foundation recomputes the six financial columns there; the rep snapshot must be left alone or pending-invoice WO edits retro-credit).
- **Per-rep rows:** GROUP BY `sales_rep_id` over the A4 invoice columns; Unassigned = NULL rep (pinned top). Contributor gate: a rep appears iff ≥1 non-reversed matching invoice (date/product-type/payment-status/location together). `(Inactive)` marker when the rep's `is_sales_rep` is currently off; deleted-staff name from the denormalized snapshot on the most-recent matching invoice. Server-side sort of rep rows (A2). Detail rows lazy per rep.
- **🔴 Payment status 5→3 mapping** (one shared expression driving both the badge and the S4 filter): `paid|overpaid → Paid`, `partially_paid → Partially Paid`, `unpaid → Unpaid`, `prepaid → CASE balance_owed = 0 THEN Paid ELSE Partially Paid`. **`balance_owed` ≠ `total_balance − paid_balance`** — deposits are excluded from `paid_balance` (SV-6616); the prepaid branch needs a deposit-contribution join (`deposit.work_order_id = invoice.work_order_id`, applied-like rows) mirroring `InvoiceSnapshotDataProvider::calculateLeftToPayBalance`/`calculateSnapshotDepositTotal`, or every prepaid invoice misclassifies. Filter on `payment_status` (not `status`); void-exclude on `status`.
- **WO rep assignment endpoint:** clone `ChangeServiceAdvisor` triple → `ChangeSalesRep` (save-on-change). **Rep selector listing:** clone `Staff/.../ServiceAdvisors/ListingQueryHandler` with role filter → `s.is_sales_rep = 1`.
- **Staff deactivation precondition (Story 13):** small read endpoint `SELECT COUNT(DISTINCT id) FROM company WHERE sales_rep_id = :userId` (+ `OrganizationDecorator`) — keys on **user.id** (identity mismatch again). `company.sales_rep_id` has **no index** (bounded org-scoped scan; add index only if the plan wants it). Deactivation itself (`POST /api/iam/change-status`, staff-active = `user.is_active`) is unchanged — assignments untouched (S13-R10).
- **Sales Rep Assignments export (Story 15):** clone `CustomerContactExport` (DBAL + `OrganizationDecorator`), date-less, `WHERE c.sales_rep_id IS NOT NULL`, `ORDER BY c.name`, "Rep is active?" = `user.is_active` via `LEFT JOIN user`. **Stays on the legacy JSON-wrapped-CSV convention** (it lives in the existing Export Reports dialog) — do NOT apply foundation D5 here.
- **Reports Summary/Expanded PDF + Summary/Expanded CSV** map 1:1 onto the `TechnicianEfficiency` Summary/Expanded pair the A3 scaffold copies; 10k row cap on the Expanded (S14-E2). Font-tier sizing (S14-R12): longest positive $ value → base tier (11px ceiling / 8px floor); negative one-step shift (S14-R14).

### B6.3 Frontend (`app/src/components/ts/reporting/sales-by-representative/` + WO/staff surfaces)
- **All-white theme**; per-rep summary rows (bold) + lazy per-rep detail rows (`TechnicianEfficiencyInvoiced.vue` pattern); header expand-all; Unassigned pinned top (Show Unassigned toggle); `(Inactive)` tag. **Payment badge** = `q-badge` + `colorCoding`/`textColorCoding` (`helpers.ts:1200/1249`) — **feed the mapped display key, never the raw state** (`colorCoding('overpaid')` returns orange, but overpaid must show teal/Paid). **Responsive grand totals:** desktop sticky Totals row (`.sticky-bottom-row`, `colspan=4` merged leading cells, `$q.screen.gt.sm`); **mobile external Subtotal-only bar** (`$q.screen.lt.md`, outside the scroll container — net-new, no precedent). Totals are server-computed (arrive with the summary payload — do NOT sum loaded rows).
- Invoice# link same-tab → WO/parts sale; Customer name link → customer record (body-color, not blue). Invoice Status + Product Type filters. Server-side sort of rep rows. **4-item export menu** (`SubActionsDropDown` supports 4; per-item loading is the A5 shell change — note the `v-close-popup` interaction).
- **WO "Sales Rep" field (Story 19):** add a Select to `OrderStatusCard.vue` cloning the Service-advisor block (save via **mutation**, not a new Vuex action — SV-6324); options from a new `is_sales_rep=1` rep-list query; inactive-current-assignee stays visible (disabled option pattern); read-only static-field variant for Invoiced/Paid; **gate for Part-Sale WOs too** (verify the `cardType` they pass). Customer record already shows the assigned rep (`CustomerLeftSection.vue:76-82`) — relabel "N/A"→"Unassigned" (S19-R7).
- **Staff deactivation dialog (Story 13):** net-new type-YES-to-confirm dialog (no precedent in the app) — auto-focused input, case-insensitive/trimmed match, Enter-submits-when-valid, in-flight lock, disabled-button hover tooltip (StaffDialog Delete-button trick). **🔴 Spec-vs-convention conflict:** S13-R8 wants Escape-to-dismiss, but Golden Rule #9 says Esc is not a supported close path — **surface as a decision, don't silently pick.** Also net-new: the `is_sales_rep` **toggle in `StaffDialog.vue`** (absent from FE today — verify BE field name).
- **Sales Rep Assignments** appended to `ExportReportsDialog.vue` report-type list (hide date picker + show snapshot note when selected).
- Nav: entry at **bottom of Performance** group; **padding fix** so the full "Sales By Representative" label doesn't truncate (S1-R7).

### B6.4 Tests
- **BE:** rep snapshot resolution chain (WO → customer-via-user_id → null) at create; snapshot immutable through `updateInvoice`; contributor gate; payment 5→3 incl. prepaid-with-deposit → Paid (the deposit-join case); staff-deactivation count keys on user.id; assignments export "Rep active?" = user.is_active; forward-only (historical → Unassigned).
- **FE:** badge maps overpaid→teal; responsive totals (desktop row vs mobile bar); WO Sales Rep save via mutation + inactive-assignee visible; type-YES gate enables only on "yes"; 4-format export.

### B6.5 E2E — reference-breakage scan + happy paths (report loads This Month; expand rep → invoices; payment badge; Invoice Status filter; sort by Margin; each of the 4 exports; assign a WO Sales Rep then invoice → credited; Sales Rep Assignments CSV). Edge: Unassigned row; `(Inactive)` rep still credited; staff-deactivation dialog blocks until "yes"; empty state.

### B6.6 Traceability (SBR): S1 nav → B6.3; S2/S3/S4 filters+payment 🔴 → B6.2; S5 rep rows/(Inactive) → B6.2; S6 lazy detail → B6.3; S8 badge → B6.3; S10 responsive totals → B6.3; S11 server sort → A2; S13 staff dialog → B6.2+B6.3; S14 4-format export → A3+B6.2; S15 assignments export → B6.2; S19 WO rep field/schema 🔴 → B6.1+B6.2+B6.3; S22 Unassigned/snapshot → B6.2; S23 persistence → A5.