# Global Search V1 — Regression Baseline & Invariant Set (handoff for V2 test-case authoring)

> **Purpose.** This is the FACTUAL behaviour of the CURRENT (V1) Global Search, captured from source as a
> regression baseline. Use it while writing V2 test cases so that **anything V2 does not explicitly change
> in the PRD is treated as a "must-not-change" invariant** (silence defaults to "must not change"; a
> high-collateral silence is a PO question, not an assumption).
>
> **Every claim is cited to file + line at a pinned commit. If the PRD does not mention a row below, that
> row is a regression candidate for V2.** Do not infer new behaviour from V2 code — documents establish
> intent; code establishes fact.

## 0. Provenance (pin every V2 comparison to this)

| Field | Value |
|---|---|
| Repo | `ShopView/shopview` (monorepo: `app/` Vue 3 + Quasar 2 FE, `api/` PHP 8.5 / Symfony BE) |
| Baseline branch | `develop` |
| **Baseline commit SHA** | **`55767168ede1577c58b5c6861860435cef179059`** |
| Production parity | Global Search FE+BE is **byte-identical to `main`** (`d9ce0e59cfcd48b982dd2a7a06ecaefabb5e3ddd`) — this is what users have in prod today |
| V2 present in baseline? | **No.** Single implementation; no `v2` / `SV-9160` / `pg_trgm` markers; one endpoint only |
| Backend module | `api/src/Reporting/GlobalSearch/Application/FetchData/` (Controller, Query, Handler, Result) |
| Frontend | `app/src/components/ts/navigation/GlobalSearch.vue`, `app/src/composables/useGlobalSearch.ts`, `app/src/api/global/*`, `app/src/services/routingService.ts` |
| Endpoint | `GET /api/global-search/fetch` (one call, cached for the session) |

---

## PART A — INVARIANT REGISTER (the must-not-change assertions)

Each row is written as a testable assertion. **INV-IDs** are for cross-referencing in the V2 test suite.
"Risk if broken" flags collateral. Unless the PRD explicitly changes it, V2 must still pass every row.

### A1. Searchable entities & matched fields

| INV | Invariant (must remain true) | Source (file:line) |
|---|---|---|
| INV-01 | Exactly **6 result types** exist: `Work Order`, `Part Sale`, `Customer`, `Vehicle`, `Vendor`, `Part`. No others. | `FetchDataQueryHandler.php:56-67`, `GlobalModel.ts:6-12` |
| INV-02 | **Work Order / Part Sale** match on: raw number, formatted number (incl. `S`/`P` + shop-id prefixes), company name, and status (`quality_check`→`qualitycheckqc`; else underscores stripped). | `FetchDataQueryHandler.php:91-118` |
| INV-03 | **Customer** matches on: company name (with and without spaces), address 1/2, state/province, postal code, city, telephone, website, **and every contact's** first name, last name, title, telephone. | `FetchDataQueryHandler.php:224-245` |
| INV-04 | **Vehicle** matches on: owner company name, year, maker, model, unit, VIN, licence plate. Carries `companyId`. | `FetchDataQueryHandler.php:285-293, 272` |
| INV-05 | **Vendor** matches on: name, address 1/2, state/province, postal code, city, telephone, email. | `FetchDataQueryHandler.php:155-164` |
| INV-06 | **Part** = `CataloguePart` (catalog), NOT inventory stock. Matches on name + part number (with and without `-`). | `FetchDataQueryHandler.php:317-330` |
| INV-07 | **Invoices are NOT a searchable result type.** The `invoices` join exists only to derive the WO number's shop-id prefix. (Controller docblock's "invoice data" is misleading — no invoice row is ever returned.) | `FetchDataQueryHandler.php:123`; docblock `FetchDataController.php:24` |

### A2. Matching rules & ranking

| INV | Invariant | Source |
|---|---|---|
| INV-10 | **Minimum 2 characters** to search. `<2` chars shows history, runs no match. | `useGlobalSearch.ts:69-71`; `GlobalSearch.vue:201` |
| INV-11 | **Pass 1 = prefix match on `label` only** (`startsWith`), case-insensitive. | `useGlobalSearch.ts:76-82` |
| INV-12 | **Pass 2 = substring match on the `search` haystack** (`includes`), case-insensitive, with **all whitespace stripped from the query**. | `useGlobalSearch.ts:84-93` |
| INV-13 | Matching is **case-insensitive** (both sides lower-cased). **No fuzzy / typo-tolerant matching** exists. | `useGlobalSearch.ts:67,81,91` |
| INV-14 | **Cap = 3 results per type** (`MAX_PER_TYPE`). Because `Customer` and `Contact` are separate types both grouped "Customers", the **Customers group can show up to 6**. | `useGlobalSearch.ts:152,160,191,214-217` |
| INV-15 | **No overall total-results cap and no pagination.** Whole collection is filtered client-side. | `useGlobalSearch.ts` (whole `filtered`); `queries.ts:29-38` |
| INV-16 | An id matched in pass 1 is **not** re-shown in pass 2 (de-dup by id). | `useGlobalSearch.ts:182-184` |
| INV-17 | A `Customer` matching only via the haystack (not label prefix) is shown as a **"Contact"** row with `more_info = "Contact/info match"`. | `useGlobalSearch.ts:187-188,207-209,102-108` |
| INV-18 | **Work Order/Part Sale rows are ordered newest-first** (`start_date DESC`). Customer/Vehicle/Vendor/Part have **no explicit ordering** (unspecified DB order). | `FetchDataQueryHandler.php:124` |
| INV-19 | **Group order is data-driven** (a group header appears the first time one of its types matches, pass 1 then pass 2) — NOT a fixed section order. | `useGlobalSearch.ts:161-164,193-195` |
| INV-20 | The internal group name **"Vehicles" is displayed to users as "Assets"**. | `GlobalSearch.vue:60` |

### A3. Fetch model, debounce, cancellation

| INV | Invariant | Source |
|---|---|---|
| INV-30 | The collection is fetched **once per session** (`GET /api/global-search/fetch`, `staleTime: Infinity`); all filtering is client-side. | `queries.ts:29-38`; `index.ts:9-10` |
| INV-31 | Filter input is **debounced 350 ms**. | `GlobalSearch.vue:17` |
| INV-32 | **No per-keystroke request and no request cancellation** exist (there is nothing to cancel — one cached collection). | (absence) `queries.ts`, `GlobalSearch.vue` |
| INV-33 | The collection is **re-fetched** after creating a searchable entity, via `invalidateSearchData()` from 5 call sites (see collateral C-3). | `useGlobalSearch.ts:309-313` |
| INV-34 | A user with **no default workplace never fetches** the collection (query stays disabled). | `GlobalSearch.vue:131-137` |

### A4. Keyboard, states, selection

| INV | Invariant | Source |
|---|---|---|
| INV-40 | **Ctrl+K (Win) / ⌘K (Mac) focuses the search**, unless focus is already in an input/textarea/select. | `GlobalSearch.vue:243-254` |
| INV-41 | After each filter, the **first selectable result is auto-highlighted** (Enter selects it). | `GlobalSearch.vue:173-184,205` |
| INV-42 | Group headers are **not selectable**. | `GlobalSearch.vue:157-159` |
| INV-43 | **Loading state**: input disabled + placeholder "Loading…" until the collection is fetched (for users with a default workplace); then placeholder "Search". | `GlobalSearch.vue:12-14,147-149` |
| INV-44 | **"No results"** shows only after a ≥2-char search that yields 0 matches. | `GlobalSearch.vue:33-39,151-153` |
| INV-45 | Errors are **not** shown in a dedicated UI; they surface via the shared axios interceptor (toast + Sentry). No per-query `onError`. | `queries.ts:9-15` |
| INV-46 | **Selecting a result** navigates to the type's route with `params.id` (Vehicle adds `?companyId=`); the `history_` prefix is stripped from the id first. Routes: Work Order→`WorkOrder`, Part Sale→`PartSale`, Customer/Contact→`CustomerWorkOrdersTab`, Vehicle→`VehicleWorkOrdersTab`, Vendor→`Vendor`, Part→`CataloguePart`. | `GlobalSearch.vue:208-235`; `useGlobalSearch.ts:95-139` |
| INV-47 | **If you are already on the selected record's id, it neither navigates nor records history.** | `GlobalSearch.vue:223-234` |
| INV-48 | Selecting a result fires a Google Analytics `global_search_use` event. | `GlobalSearch.vue:211-217` |
| INV-49 | Focusing the input **clears the current query** (`@focus="clearSearch"`). | `GlobalSearch.vue:31,161-165` |
| INV-50 | Placement: **desktop always visible; tablet always visible; mobile toggles inline via a search icon** (with an in-field close button). | `DesktopMenu.vue:52,74,77-101`; `GlobalSearch.vue:81-91` |

### A5. History / recents

| INV | Invariant | Source |
|---|---|---|
| INV-60 | History **caps at 5**, de-dupes, prefixes ids with `history_`, and prepends a `{ group: 'History' }` header. | `useGlobalSearch.ts:243-265` |
| INV-61 | History is **in-memory only (NOT localStorage / not persisted)** — it is lost on page reload. | `useGlobalSearch.ts:55-57` (absence of any storage) |
| INV-62 | History is **cleared on a fresh collection fetch and on a location switch**. | `useGlobalSearch.ts:280-284,294-299` |
| INV-63 | History is shown when the query is `<2` chars **or** the current search yields 0 matches. | `useGlobalSearch.ts:69-71,229-231` |
| INV-64 | History entries the user is **no longer permitted** to see are hidden. | `useGlobalSearch.ts:21-29` |

### A6. Permission gating (TWO layers — both must hold)

| INV | Invariant | Source |
|---|---|---|
| INV-70 | The endpoint has **no role gate**; it is open to any authenticated user. Per-section access is enforced downstream. | `FetchDataController.php:24-31` |
| INV-71 | The **TimeClock role receives an entirely empty result**. | `FetchDataController.php:50-51` |
| INV-72 | **BE section gating** (the real access boundary), by held FE bundle: WO=`workOrdersView`; Part Sale=`partSalesView`; Customer+Vehicle=`customersView`; Part=`catalogInventoryView` **only**; Vendor=`vendorOrderManagementView`. | `FetchDataQueryHandler.php:42-67` |
| INV-73 | **Part (catalog) is gated on `catalogInventoryView` ONLY** — a partSales-only role must NOT see Part or Vendor hits, but keeps Part Sale hits (SV-8412). | `FetchDataQueryHandler.php:47-53`; `routingService.ts:84-85` |
| INV-74 | **FE second layer** re-filters displayed types AND history via `isSearchTypePermitted`; **unknown/new types default to NOT-permitted**. | `routingService.ts:78-99`; `useGlobalSearch.ts:146-150,21-29` |

### A7. Tenant / location scoping

| INV | Invariant | Source |
|---|---|---|
| INV-80 | **Every** fetcher is org-scoped (`OrganizationDecorator`). | `FetchDataQueryHandler.php:127-130,169-171,252-254,302-304,333-335` |
| INV-81 | **Only Work Order / Part Sale rows are workplace-scoped** (`WorkplaceDecorator` on `wo.workplace_id`). Customer/Vehicle/Vendor/Part are org-scoped only. | `FetchDataQueryHandler.php:130` |
| INV-82 | A **location switch clears the cache and re-fetches** the collection under the new `X-Location-ID`. | `useGlobalSearch.ts:286-299` |

### A8. Exclusions & flags

| INV | Invariant | Source |
|---|---|---|
| INV-90 | **No feature flag** controls Global Search. | (absence in component/composable/config) |
| INV-91 | Excluded from results: TimeClock role (empty), users without a default workplace (no fetch), sections/types without the FE bundle, invoices, inventory (non-catalog) parts. | see INV-71, INV-34, INV-72, INV-07, INV-06 |

---

## PART B — Collateral-risk map (what else V2 could break)

| ID | Shared item | Path | Also used by | Risk |
|---|---|---|---|---|
| C-1 | `getPermittedRoutesMap` / `getFirstPermittedRoute` | `app/src/services/routingService.ts:8-60` | **~20 router guards** (`router/routes.ts`), post-login redirect (`router/index.ts:257,276`, `usePostLogin.ts:81-82`), `WorkInProgressReport.vue:686` | 🔴 **HIGH** — the FE search permission gate reuses the whole app's routing map. "Fixing search permissions" here silently re-gates routing + post-login landing. |
| C-2 | `isSearchTypePermitted` / `SEARCH_TYPE_PERMITTED` | `routingService.ts:78-99` | Only `useGlobalSearch.ts` | Search-only, but internally calls C-1 + `permissionService`. |
| C-3 | `useGlobalSearch` (esp. `invalidateSearchData`, `addToHistory`) | `app/src/composables/useGlobalSearch.ts` | `ReceiveOrderDialog.vue:322`, `Customer.vue:701`, `PartSales.vue:424`, `WorkOrders.vue:1914`, `Customers.vue:265` (invalidate); `WorkOrder.vue:1041` (addToHistory) | Changing the public API breaks these 6 callers — the "refresh search after creating an entity" contract. |
| C-4 | Raw DBAL SQL hardcodes DB column names | `FetchDataQueryHandler.php:8-22` (entities), whole file | Tables owned by their own contexts | 🔴 A column rename elsewhere (ORM-only) silently breaks this raw SQL — no compile-time link. Columns referenced incl. `wo.raw_number`, `c.state_or_province`, `v.licence_plate`, `cp.part_number`, `i.workplace_shop_id`. |
| C-5 | `OrganizationDecorator` (298 files) / `WorkplaceDecorator` (263 files) | `api/src/Shared/Infrastructure/Persistence/Listing/` | App-wide | Shared tenant primitives — depend on, don't change. |
| C-6 | `permissionService` (334 files), `FEPermissionEnum` | `app/src/services/permissionService.ts`, `api/src/Auth/Domain/Model/FEPermissionEnum.php` | App-wide auth | Shared — search reads 5 bundle cases. |
| C-7 | Base `Select` wrapper, `useGoogleAnalytics` | `app/src/components/forms/Select.vue`, `app/src/composables/useGoogleAnalytics.ts` | App-wide | Shared UI/analytics primitives. |

Self-contained to Global Search (safe to change for V2): the BE `FetchData*` module, `app/src/api/global/*`, `GlobalSearch.vue`, and `isSearchTypePermitted`.

---

## PART C — Existing automated coverage (don't duplicate; reuse as V2 regression anchors)

**BE unit** — `api/tests/Unit/Reporting/GlobalSearch/Application/FetchData/FetchDataQueryHandlerTest.php`:
all-bundles→all sections; no-bundles→empty; WO-only; PartSale-only; catalogInventory→Parts-only; query exposes held codes.

**BE functional** — `api/tests/Functional/Reporting/GlobalSearch/GlobalSearchPermissionFilteringTest.php`:
sales-rep→no restricted records; WO-view holder gets WO; sales-rep→no catalog Part rows; sales-rep keeps Part Sale rows; catalogInventory holder gets catalog Part rows.

**FE unit** — `app/src/composables/tests/useGlobalSearch.spec.ts` (21 tests): state defaults; singleton; <2-char history; pass-1 prefix + header; 3-per-type cap; pass-2 includes + Customer→Contact; no double-count; empty→history; SV-7952 permission drops; permission-filtered history; mixed role; partSales-only drops Part+Vendor; addToHistory shape/ignore/dedupe/cap-5; query→collection sync; location-switch refetch; drop rows during refetch; standalone invalidate.

**FE unit** — `app/src/services/tests/routingService.spec.ts` (`isSearchTypePermitted` block): WO/PartSale under WorkOrders; Customer/Contact/Vehicle under Customers; Part(not Vendor) for catalogInventory; Vendor(not Part) for vendorOrderManagement; part-sales-only excludes both; reports-only excludes all; unknown→false.

**E2E (Playwright)** — page object `e2e/src/pages/navigation/global-search.page.ts`; specs (skip on `local`):
- `C29914` hides Vendor for role without Vendor Order Management View
- `C29912` shows catalog Part for Catalog & Inventory View role
- `C29913` hides catalog Part for partSales-only but keeps Part Sale
- `C29915` CataloguePart deep-link bounced without Catalog & Inventory View (route-guard companion)

---

## PART D — Open ambiguities to confirm against the V2 PRD

These are places where V1 behaviour is subtle or possibly unintended — resolve each against the PRD before
writing the V2 expectation (do not resolve from V2 code):

1. **Group/section order is data-driven, not fixed** (INV-19). If the V2 PRD specifies a section order, that
   is a *change*; if silent, V1's data-driven order is the invariant.
2. **Customers group can exceed the "3 per type" cap** (up to 6: Customer+Contact) (INV-14). Confirm whether
   V2 keeps Customer and Contact as separate capped types.
3. **Non-WO types have no deterministic ordering** (INV-18). If V2 introduces relevance ranking, that changes
   this; if silent, undefined order is technically the baseline (flag as a likely PO question).
4. **History is session-only, in-memory** (INV-61). Easy to accidentally "improve" in V2 — only change if the
   PRD asks.
5. **"Assets" vs "Vehicles" label** (INV-20) — keep the user-facing "Assets" unless the PRD renames it.
6. **The FE permission gate is the app's routing map** (C-1) — a V2 permission change here is high-collateral;
   escalate as a PO question rather than assume.
7. **Invoices are searched-adjacent but never returned** (INV-07) — if a user "expects" invoice results, that
   is a V2 feature request, not a V1 regression.

---

*Baseline captured read-only from `ShopView/shopview@55767168ede1577c58b5c6861860435cef179059`
(Global Search FE+BE byte-identical to `main@d9ce0e5`). No repo was modified.*
