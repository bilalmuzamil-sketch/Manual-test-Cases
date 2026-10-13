# Parts Settings Sorting (Categories, Pricing Matrices, Fixed Rules) — Technical Implementation Plan

**Date:** 2026-09-23
**PRD:** [Settings "Pricing" And "Categories" Sorting](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/578781186/Settings+Pricing+And+Categories+Sorting) (Locked for build 2026-09-15; revised 2026-09-23 with Product's answers — adds S3-R18, S3-R19; rewords S1-R19, S1-N5, S3-R12, S3-R12b, S3-R13, §2 Out of scope, §6)
**Jira epic:** [SV-9667 — Founder Mode Batch #1](https://shopview.atlassian.net/browse/SV-9667) · stories [SV-10134](https://shopview.atlassian.net/browse/SV-10134) (Categories), [SV-10135](https://shopview.atlassian.net/browse/SV-10135) (Pricing Matrices), [SV-10136](https://shopview.atlassian.net/browse/SV-10136) (Fixed Rules)
**Design:** [Design canvas](https://claude.ai/artifact/UMNdojKWhYhRyJrjdgZa4P) — page 1 "The three lists" (Categories before/after, Pricing matrices, Fixed rules before/after), page 2 "The three rules that bite". No new screens or controls; existing headers gain the sort they already appear to offer.
**Tech stack:** FE only — Vue 3.5 `<script setup>` + TS, Quasar 2 `q-table` via the `Table` base wrapper. No backend, schema, or endpoint change.
**Estimated complexity:** Medium (three surfaces, a switch from server-side to client-side table mode, and "sort survives reload/search" state handling)

---

## 0. Execution State

_Keep this block current so any agent (or person) can resume mid-flight — this plan may be executed by someone who did not write it._

- **Status:** Not started
- **Current phase:** —
- **Last completed:** —
- **Open questions / blockers:** None. All Product questions answered 2026-09-23 and folded in.

> 🛑 **About to implement this plan? Run it as `/loop /implement <this-file>`.** This plan is meant to be executed by the `/implement` orchestrator inside a `/loop` — that combination is what adds the code-review loop, the Phase 5 runtime gates (migration / compile / smoke / browser-walk), the mandatory E2E ask, and phase-by-phase hands-off execution. Free-hand implementation skips all of it.
>
> - **However you were handed this** — "implement it", "here's the path, do it", or a single phase — do **not** start editing code directly. Route through `/loop /implement <this-file>` (or `/loop /implement Phase N from <this-file>` for one phase). That *is* "doing the implementation" — just with the gates. Announce that you're routing through `/loop /implement` and proceed; no need to ask.
> - **If you are ALREADY running under `/loop /implement`**, ignore this note and continue — you're in the right place.
> - **If you are a sub-agent** (`be-implementer`, `fe-implementer`, …) without orchestration tools, do **not** invoke `/loop` or `/implement` — that's the orchestrator's job. Execute only the scope you were handed and report back.
> - **Precedence:** only a *live, explicit* user instruction to the contrary wins — if the user in this session says to implement directly or skip the loop, honor that. Being handed just the plan path is **not** such an instruction; absent one, default to `/loop /implement` without asking.

---

## 1. Requirements (extracted from PRD)

PRD rule IDs (S1-R1 …) are kept next to each FR so QA can trace both ways.

### Story 1 — Categories (SV-10134)
- **FR-001 (SV-10134):** Name header is sortable; the page opens sorted by name ascending with an ascending arrow on Name; comparison ignores case and compares embedded numbers numerically (`Tier 9` < `Tier 10`). _S1-R1, R2, R3, R4_
- **FR-002 (SV-10134):** Clicking Name toggles ascending ↔ descending; the arrow always shows the applied direction. _S1-R5, R6, R7_
- **FR-003 (SV-10134):** Every category is loaded, so the sort covers the whole list, not just rows fetched so far. _S1-R8_
- **FR-004 (SV-10134):** QuickBooks Products and Services header is sortable; first click ascending, second descending; case-insensitive and numeric-aware. _S1-R9, R10, R11, R12_
- **FR-005 (SV-10134):** Only one column is sorted at a time; only the sorted column shows an arrow. _S1-R13, R14_
- **FR-006 (SV-10134):** The user's sort (column + direction + arrow) survives a reload in place (create/edit/delete dialog closes) and survives typing a search term; matching rows appear in the current sort. _S1-R15, R18_
- **FR-007 (SV-10134):** A fresh open returns the list to name ascending. _S1-R16_
- **FR-008 (SV-10134):** The QuickBooks column keeps showing today's value — the mapped name, or the literal `Parts` when there is no mapping — and sorts on that displayed value. It has no empty state and no row moves to the bottom. _S1-R17_
- **FR-009 (SV-10134):** The Default category ("Uncategorized") is always row 1 whenever it is in the list, under both sorts, in both directions, after reload and after search (a search term that doesn't match it leaves it out, as today, and it is never forced in — S1-R19 as revised); it is placed first, not compared, and keeps its Default badge. _S1-R19, R20, R21_
- **FR-010 (SV-10134):** If the shop isn't connected to QuickBooks, or the connection check fails, the QuickBooks column (and its sort) is absent. On a failed check the user sees "Unable to check QuickBooks connection. Please try again." once, and it is the **only** message: the app's generic error toast for that request is suppressed. The list still loads and Name still sorts. _S1-N1, S1-N5_
- **FR-011 (SV-10134):** With no categories, the Name header still renders as sortable with the ascending arrow. _S1-N2_
- **FR-012 (SV-10134):** Without the Settings — Parts permission (`settingsParts`) the page can't be opened. Existing route guard; no change. _S1-N3_

### Story 2 — Pricing Matrices (SV-10135)
- **FR-013 (SV-10135):** The Matrix Category header (which holds the matrix **name**) is sortable; the tab opens name ascending with an ascending arrow; clicking toggles; case-insensitive and numeric-aware. _S2-R1 … R7_
- **FR-014 (SV-10135):** The sort survives a reload in place (create/edit/duplicate/delete matrix); a fresh open resets to name ascending. _S2-R8, R9_
- **FR-015 (SV-10135):** Tab label reads `Pricing matrices (N)` — one space before `(`; N = matrices loaded. _S2-R10, R11, R12_
- **FR-016 (SV-10135):** The default matrix is **not** pinned; it sorts by its name in both directions and keeps its Default badge. _S2-R13_
- **FR-017 (SV-10135):** With no matrices, the header still renders sortable with the ascending arrow and the standard empty state shows; permission guard unchanged. _S2-N1, S2-N2_

### Story 3 — Fixed Rules (SV-10136)
- **FR-018 (SV-10136):** Part number, Category and Fixed price headers are sortable; first click on an unsorted header sorts ascending, second click descending; one column at a time; only that column shows an arrow. _S3-R1 … R5, R10, R11_
- **FR-019 (SV-10136):** Part number and Category compare case-insensitively and numeric-aware (`BRK-9`, `BRK-10`, `BRK-100`). _S3-R6, R7_
- **FR-020 (SV-10136):** Fixed price sorts by numeric value — lowest first ascending, highest first descending ($9.00 before $10.00). _S3-R8, R9_
- **FR-021 (SV-10136):** The tab opens sorted by Part number ascending (numeric-aware — this **does** change today's opening order, see Clarifications) with the ascending arrow; the sort survives a reload in place; a fresh open resets. _S3-R12, R12a_
- **FR-022 (SV-10136):** The tab lists only rules whose part has a category, as today (3 category-less rules in prod stay unlisted; separate ticket). If an empty Category value ever reaches the list, it sorts last in both directions. _S3-R12b_
- **FR-023 (SV-10136):** Every fixed rule the tab lists loads when the tab opens; the sort covers every rule. _S3-R13, R14_
- **FR-024 (SV-10136):** Tab label reads `Fixed rules (N)` — one space before `(`; N = rules loaded. _S3-R15, R16, R17_
- **FR-025 (SV-10136):** With no fixed rules, the three headers still render sortable and the standard empty state shows; permission guard unchanged. _S3-N1, S3-N2_
- **FR-028 (SV-10136):** Typing in the Fixed Rules search box filters the loaded rules to those whose Part number, Category or Fixed price **as shown on screen** contains the term (case-insensitive), in the current sort; clearing shows every rule again, still sorted. Today the box does nothing. _S3-R18_
- **FR-029 (SV-10136):** While the rules load, the Fixed Rules tab shows a loading indicator, and its column headers, search box and rows can't be used until every rule has loaded. _S3-R19_

### Cross-cutting
- **FR-026 (SV-10134, SV-10135, SV-10136):** A column that can't be sorted (e.g. the Pricing Matrices duplicate/edit/delete action columns) shows no arrow and no hover affordance. _PRD §2 "Sort arrows"_
- **FR-027 (SV-10134):** The release notes say that a sort now stays applied after an edit and after a search, and that Fixed Rules search now works (US spelling). _PRD §4 "One habit changes on release day", S3-R18_ — non-code deliverable.

### Non-functional
- **NFR-001 (analysis):** "Load all" uses the existing paginated endpoints at the 1000-row page cap (`Paginator::LIMIT_PER_PAGE_MAX`) and loops pages. Measured production peaks: **8,994** fixed rules in one workplace (→ 9 requests) and **1,076** categories in one organization (→ 2 requests). The table stays in its loading state until every page has arrived; a partially loaded list is never sorted or shown.
- **NFR-002 (analysis):** A newer load (search keystroke, reload, location switch) supersedes an older in-flight one; stale responses are discarded.
- **NFR-003 (PRD "Presentation Only" + analysis):** No endpoint, parameter, DTO, or schema change. Tenant scoping and authorization are exactly what the endpoints do today.
- **NFR-004 (PRD "Form Factor"):** Desktop only; no mobile pass.
- **NFR-005 (analysis):** Client-side sorting of the largest list (~9k rows) must not visibly lag. Use one shared `Intl.Collator` instance and a precomputed sort key per row, and keep the base `Table` wrapper's virtual scroll on.

### Clarifications & PRD comment outcomes

| Question | Asked via | Answer |
|---|---|---|
| Anything the PRD won't say? | Intake | Nothing to add — analyze the PRD as-is. |
| Where is the epic? | PRD | SV-9667 (smart link in the PRD header). |
| Design boards vs S1-R17: page 2 draws an unmapped QuickBooks cell as empty and sorts it last; the "Categories – after" caption says the same | Confluence comment (FYI) | Product: the canvas will be updated to match; test S1-R17 as written. |
| S3-R12 says the opening order doesn't change | Confluence comment | It does change. Today's visible order comes from a client-side `a.partNumber.localeCompare(b.partNumber)` re-sort in `Pricing.vue` (on top of the server's collation order), and neither is numeric-aware, so numeric-aware ordering reorders rows (10GW now before 10953464). FR-021 is written accordingly. Product adopted the suggested wording verbatim (new S3-R12). |
| **Q-FR-SEARCH** — Fixed Rules search is a no-op today (the server ignores `search`); once every rule loads in the browser, q-table's built-in filter would start working. (a) let it work, or (b) keep it inert? | Confluence comment | **(a)** — Product: "A search box that does nothing is a bug, and it comes free with S3-R13." PRD gains S3-R18 and the Out-of-scope line now exempts Fixed Rules. Added to the release note. → FR-028, D10. |
| Production volumes (read-only prod query) | Prod query | `SELECT BIN_TO_UUID(workplace_id), SUM(fixed_sell_price IS NOT NULL), COUNT(*) FROM part GROUP BY workplace_id ORDER BY 2 DESC LIMIT 10` → max **8,994** fixed rules (9,849 parts), then 3,053 and 2,689. `SELECT BIN_TO_UUID(organization_id), COUNT(*) FROM part_category GROUP BY organization_id ORDER BY 2 DESC LIMIT 5` → max **1,076** categories, then 270 and 249. PRD §6 now carries these figures and QA tests at that scale. Product added a requirement: a loading indicator, and the Fixed Rules tab isn't interactive until every rule has loaded (S3-R19 → FR-029, D16). Drives NFR-001 / D1. |
| US spelling across PRD, design, and release notes | Confluence reply | Agreed; now the standing rule for all PRDs, designs and release notes. PRD already updated. |
| **Q-NULL-CAT** — can a fixed rule without a category actually appear? | Found in code (Phase 4); answered by Product: leave it — S3-R12b/R13 reworded, the 3 rules get their own ticket, not this release | `catalogue_part.category` is nullable, but `DbalPartFixedPriceFetcher` **inner-joins** `part_category`, so a category-less fixed rule is **never returned** today. Prod count (2026-09-23): **3** such rules across all shops. The revised S3-R12b/S3-R13 now say exactly that; the comparator still implements empty-last. |
| **Q-DEFAULT-SEARCH** — S1-R19 says Default stays first "after a search term is typed" | Found in audit; confirmed by Product | "First whenever it is in the list"; never forced into non-matching results. S1-R19 reworded. |
| **Q-N5-TOASTS** — S1-N5 "told once" | Found in audit; answered by Product | "Only our message. Suppress the generic handler for this failure." S1-N5 reworded. Implemented with the **existing** `handlesFailureLocally` request flag (`src/axios.d.ts`), which suppresses the interceptor's 400/5xx/network toasts and the 403 AccessDenied redirect for one request → D8. |

## 2. Architecture Overview

```
Categories.vue ──┐                          ┌─ GET parts-catalogue/categories-list  (unchanged, rowsPerPage=1000, loop)
                 ├─ useTable().fetchAllPages ┤
Pricing.vue ─────┘  (pageSize 1000)          └─ GET parts/list-fixed-price           (unchanged, rowsPerPage=1000, loop)
   │  Pricing Matrices ── GET pricing-rules/list (unchanged, already unpaginated)
   │
   └─ <Table> (q-table, CLIENT-side mode: v-model:pagination WITHOUT rowsNumber)
         :sort-method = makeSortMethod(accessors, pinFirst?)   ← app/src/utils/tableSort.ts (new)
         #header-cell  → q-th with data-test-id + aria-sort
```

Today Categories and Fixed Rules run q-table in **server-side mode**: `useTable()`'s pagination always carries `rowsNumber`, so Quasar never sorts client-side. A header click only emits `request`, and the backend `Paginator` ignores `sortBy` because the whitelist is empty. That is why the Name arrow flips but nothing moves. This plan:

1. loads the complete list once per load (loop of 1000-row pages),
2. switches both tables to client-side mode, binding a small per-table sort state (`{ sortBy, descending, rowsPerPage: 0 }`) instead of `useTable()`'s pagination,
3. sorts through one shared `sort-method`. It must be a custom `sort-method` rather than a per-column `sort`, because Quasar negates a column comparator for descending order, which would break "empty last in **both** directions" and "Default pinned first in **both** directions."

Sort state is component-local, so it lives exactly as long as the page: a reload in place only replaces `rows` and keeps the sort, while a fresh open re-runs setup and resets it.

## 3. Technical Decisions

- **D1 (agent) — Load everything through the existing endpoints at `rowsPerPage=1000`, looping with `useTable().fetchAllPages`.** Both endpoints already accept 1000. It honors the PRD's "no new endpoint, no new parameter." _Rejected:_ raising `Paginator::LIMIT_PER_PAGE_MAX` (it affects every paginated endpoint and report export in the app); a new unpaginated fixed-rules endpoint (contradicts the PRD's Presentation Only section, and it isn't needed at a 9k peak).
  - `fetchAllPages` detects the last page by comparing each page's length to `pagination.pageSize`, so the dedicated `useTable` instance **must** set both `rowsPerPage: 1000` and `pageSize: 1000`. With the default `pageSize: 30`, a 1000-row page followed by a short page still works, but a 500-row final page would be read as full and trigger extra empty requests.
  - `chunkSize: 1` for Categories (almost always one page; avoids 4 wasted parallel requests, each of which is a cold Redis response-cache key). `chunkSize: 3` for Fixed Rules (most shops need at most 3 pages, so one round; the 9-page peak takes 3 rounds).
- **D2 (agent) — Switch Categories and Fixed Rules to q-table client-side mode.** Drop `v-model:pagination="pagination"` (from `useTable`), `@virtual-scroll`, and `@request` on these tables; bind a local sort ref. Virtual scroll rendering stays on (a `Table` default) for row-render performance.
- **D3 (agent) — New shared comparator `app/src/utils/tableSort.ts`.** Uses one `Intl.Collator('en-US', { numeric: true, sensitivity: 'base' })`: case-insensitive and numeric-aware. Numbers compare by value. `null`, `undefined`, and blank strings sort last in both directions. Ties keep their original order (stable). The only existing numeric collator is private to accounting (`accountsView.ts`), and `ReportingModel.customSort` isn't numeric-aware.
- **D4 (agent) — Default pinning through the `sort-method`'s `pinFirst` predicate.** Categories passes `(row) => row.isDefault` (the flag already in the payload; there's no DB column, the server derives it from name === `Uncategorized`). Pricing Matrices passes no pin, which matches today (the FE already re-sorts away the server's `array_unshift`).
- **D5 (agent) — Categories search stays server-side.** An explicit `watch(search)` reloads every matching row, and the current sort is re-applied client-side. Drop `:filter="search"` from the Categories table, because in client mode q-table would also filter locally. Today search runs through q-table's filter watcher and `@request`, and that path disappears in client mode.
- **D6 (agent) — Sort state is component-local, never in the URL or localStorage.** Categories: one ref in `Categories.vue`. Pricing: two refs in `Pricing.vue` (not in the tab panels), so switching tabs keeps each tab's sort; a tab switch isn't a fresh open.
- **D7 (agent) — The QuickBooks column sorts on the displayed value, `productAndServiceName || 'Parts'`.** Unmapped rows sort under P with genuine `Parts` mappings (S1-R17). The dead `product_and_service_name` snake-case fallback in the template is removed (the BE only emits camelCase).
- **D8 (agent, per Product) — S1-N5 "told once" and "only our message."** (1) Replace the `watch(quickBooksError)` toast with a latch **per workplace**: a `Set` of workplace ids already told, keyed by the current `location` from `useLocation()` (Categories already uses `subscribeToLocation` from it). The specific message shows once per workplace per page open. Today it re-fires on every error transition; a single per-visit latch would leave a second failing workplace with no message at all, now that the generic toast is gone. (2) Categories requests the QuickBooks check with the existing `handlesFailureLocally: true` axios flag (precedent: `changeOrganizationInvoiceDesign` in `app/src/api/administration/index.ts`). That suppresses the interceptor's timeout, network, 400 and 5xx toasts and the 403 redirect-and-abort for this request only. **Accepted residuals** (session- or environment-level states, not "the connection can't be checked"): a non-session 401 still toasts "Unauthorized"; a session expiry still logs out; a non-session 409 still toasts; the QA "environment sleeping" branch and the no-default-workplace branch run before the flag is consulted. (3) The query is shared with `QuickBooks.vue` and `LabourTypes.vue`, which must keep their toasts, so the flagged variant gets its **own query key** extending the `quickBooksIntegration()` prefix (existing prefix invalidations still reach it). (4) The column is gated on `!quickBooksError.value` as well: TanStack keeps the previous `data` on a failed refetch, so after a location switch the column could otherwise stay visible while the check has failed.
- **D9 (agent) — Loading state until complete, no partial render.** Rows are assigned only after the loop resolves. Tab counts read `(0)` until then.
- **D10 (Product: option (a)) — Fixed Rules search works client-side.** Keep `:filter="search"` on the Fixed Rules `<Table>`. In client mode Quasar's default filter checks each visible column's **formatted cell value**, which is exactly S3-R18's "as shown on screen" (today `$4.5`; after SV-10387, `$4.50`). It's case-insensitive, and results come out of the same `sort-method`, so they're in the current sort. Search no longer triggers a refetch (the BE ignores the term). `search` is a single URL-synced value shared by both Pricing tabs (`usePageSearchUrlSync('administration-pricing')`), so a term typed on one tab also applies to the other. That's today's shared-box behavior, now visible on Fixed Rules; accepted.
- **D11 (confirmed by Product) — No backend change for category-less fixed rules.** They stay unlisted (the `innerJoin` on `part_category`); S3-R12b/R13 were reworded to say so, and the 3 rules get a separate ticket. The comparator's empty-last logic still covers an empty Category if one ever reaches the list.
- **D13 (agent) — A location switch is a reload in place.** The user stays on the page, so the sort is kept. The one exception: if the sorted column disappears (QB column on a non-QB workplace), fall back to the default sort. The PRD doesn't define this case.
- **D14 (agent) — An incomplete page never counts as the last page, and a cancellation is silent.** The store actions run through `useErrorHandler().errorHandler`, which resolves cancelled and session-expired requests to `undefined`. If a page fetcher mapped that to `[]`, `fetchAllPages` would read it as the short last page and show a partial list as complete (breaking NFR-001, S1-R8, S3-R14). So the page fetchers throw a new exported `LoadAborted` error (`app/src/composables/useTable.ts`), and `fetchAllPages`'s `catch` skips its "Failed to fetch all data" toast for `LoadAborted` (still returning `null`). The load keeps the previous rows, with no spurious toast during a logout or a 403 abort. Real failures still toast as today.
- **D15 (agent) — Rely on the `Table` wrapper's `binaryStateSort: true` default.** Without it Quasar cycles asc → desc → unsorted (`sortBy = null`), which would break S1-R6/S2-R6. Don't override it, and cover desc → asc in tests.
- **D16 (agent, per Product S3-R19) — Fixed Rules is locked while loading.** `:loading="fixedRulesLoading"` gives the table's progress bar. On top of that, while loading: the `<table>` element gets a `fixed-rules--loading` class (`pointer-events: none`, reduced opacity), so headers and rows can't be clicked or sorted; the `PageSearchInput` wrapper gets `inert` (it has no `disable` prop, and `inert` blocks both pointer and keyboard); and `aria-busy="true"` goes on the table. The tab switcher and the Add fixed rule button stay usable, because S3-R19 names only headers, search box and rows.
- **D17 (agent) — Hover arrow on an unsorted sortable header is kept.** Quasar fades in the sort icon (`opacity: .64`) when hovering an unsorted sortable header. The PRD reserves "no arrow and no hover affordance" for columns that **cannot** be sorted, so this is the hover affordance of a sortable column. At rest, only the sorted column shows an arrow (S1-R14, §2). QA and E2E assert arrows at rest, via `aria-sort`, not while hovering.
- **D12 (agent) — Header test hooks.** Add a generic `#header-cell` slot per table that renders `q-th` with `data-test-id="header_<table>_<col>"` and `aria-sort="ascending|descending|none"`. That gives E2E a deterministic, accessible "which header carries the arrow" signal (following the `PartsVelocityReport.vue` precedent). `QTh` given `:props` still renders Quasar's own sort icon and click handling.

No new dependencies.

## 4. Database Changes

None. No schema, mapping, or data migration. `doctrine:migrations:diff` isn't affected.

## 5. API Changes

None. No new or modified endpoints. The FE changes only the page size it requests on two existing endpoints:

| Endpoint | Today (FE sends) | After |
|---|---|---|
| `GET /api/parts-catalogue/categories-list` | `pagination[rowsPerPage]=30`, infinite scroll, `search` | `pagination[rowsPerPage]=1000`, pages looped until a short page, `search` unchanged |
| `GET /api/parts/list-fixed-price` | `pagination[rowsPerPage]=30`, infinite scroll, `search` (ignored by the BE) | `pagination[rowsPerPage]=1000`, pages looped; `search` no longer sent |
| `GET /api/pricing-rules/list` | unpaginated | unchanged |

`categories-list` is Redis response-cached (`parts_catalogue_reference`, 24h, keyed by full query string). A new `rowsPerPage` is a new cold key, not a stale one, and any `POST/PUT/DELETE /api/parts-catalogue*` still invalidates it.

## 6. Implementation Phases

### Phase 1: Shared sort utility
**Implements:** foundations of FR-001, FR-004, FR-008, FR-009, FR-013, FR-016, FR-019, FR-020, FR-022; NFR-005
**Depends on:** Nothing

#### Backend changes (`api/`): none.

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `app/src/utils/tableSort.ts` | Create | `compareSortValues`, `sortRows`, `makeSortMethod`, `ariaSortFor` |
| `app/src/utils/index.ts` | Modify | Re-export (follow the existing barrel) |
| `app/src/utils/tests/tableSort.spec.ts` | Create | Unit tests (see below). Match the location convention of the existing `app/src/utils/tests/` specs. |

#### Key code changes:

```ts
// app/src/utils/tableSort.ts
export type SortValue = string | number | null | undefined;
export type SortAccessors<T> = Record<string, (row: T) => SortValue>;

const collator = new Intl.Collator('en-US', { numeric: true, sensitivity: 'base' });

const isEmpty = (value: SortValue): boolean =>
  value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

/** Direction-aware compare; empty values sort last in BOTH directions. */
export const compareSortValues = (a: SortValue, b: SortValue, descending: boolean): number => {
  const aEmpty = isEmpty(a);
  const bEmpty = isEmpty(b);
  if (aEmpty || bEmpty) return aEmpty === bEmpty ? 0 : aEmpty ? 1 : -1;
  const result =
    typeof a === 'number' && typeof b === 'number' ? a - b : collator.compare(String(a), String(b));
  return descending ? -result : result;
};

export const sortRows = <T>(
  rows: readonly T[],
  accessors: SortAccessors<T>,
  sortBy: string | null | undefined,
  descending: boolean,
  pinFirst?: (row: T) => boolean,
): T[] => {
  const accessor = sortBy ? accessors[sortBy] : undefined;
  if (!accessor) return [...rows];
  const pinned = pinFirst ? rows.filter(pinFirst) : [];
  const rest = pinFirst ? rows.filter((row) => !pinFirst(row)) : [...rows];
  const sorted = rest
    .map((row, index) => ({ row, index, key: accessor(row) }))   // key computed once per row (NFR-005)
    .sort((x, y) => compareSortValues(x.key, y.key, descending) || x.index - y.index)
    .map(({ row }) => row);
  return [...pinned, ...sorted];
};

/** q-table `sort-method` signature: (rows, sortBy, descending) => rows */
export const makeSortMethod =
  <T>(accessors: SortAccessors<T>, pinFirst?: (row: T) => boolean) =>
  (rows: readonly T[], sortBy: string, descending: boolean): T[] =>
    sortRows(rows, accessors, sortBy, descending, pinFirst);

export const ariaSortFor = (
  state: { sortBy?: string | null; descending?: boolean },
  columnName: string,
): 'ascending' | 'descending' | 'none' =>
  state.sortBy === columnName ? (state.descending ? 'descending' : 'ascending') : 'none';
```

#### Unit tests:
- Case-insensitive: `['Zinc', 'alternator']` → `alternator, Zinc`.
- Numeric-aware: `BRK-100, BRK-9, BRK-10` → `BRK-9, BRK-10, BRK-100`. `Tier 10, Tier 9` → `Tier 9, Tier 10`. The design's real set `10953464, 109Y/CB-3840, 10GW, 111165, 11133EA` → `10GW, 109Y/CB-3840, 10953464, 11133EA, 111165`.
- Numbers by value: `[10, 9, 16.1]` → `9, 10, 16.1` ascending and `16.1, 10, 9` descending.
- Empty last in both directions: `['Sublet', null, 'Part', '']` → asc `Part, Sublet, ∅, ∅`; desc `Sublet, Part, ∅, ∅`.
- Pin: a row with `pinFirst` true is index 0 in both directions and isn't compared.
- Stability: equal keys keep their input order. Unknown `sortBy` returns an unchanged copy.
- `ariaSortFor` returns ascending, descending, or none.

#### Verification:
- **Static (scoped):** `npx eslint --max-warnings=0` on the changed files; `npx vitest run app/src/utils/tests/tableSort.spec.ts`; `npx vue-tsc --noEmit`.
- No runtime gate (not wired into UI yet).

#### E2E tests (e2e/):
- None for this phase. `app/src/utils/**` isn't a UI-affecting path under coverage-policy §9, so no E2E is owed for Phase 1 on its own. `/e2e-after-change` runs once, for Phases 2–4 together.

---

### Phase 2: Categories — load all, sortable Name + QuickBooks, pinned Default
**Implements:** FR-001 … FR-012, NFR-001, NFR-002; D8, D13, D14
**Depends on:** Phase 1

#### Backend changes (`api/`): none.

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/parts/Categories.vue` | Modify | Client-side mode, load-all, sort state, search watcher, pinned Default, header hooks, QB toast latch, sortable QB column |
| `app/src/components/ts/parts/tests/Categories.spec.ts` | Modify | Update the `Table` stub (hard-codes `sortBy: ''`, emits `request`) and add sort/reload/search tests |
| `app/src/api/administration/index.ts` | Modify | `fetchQuickBooksData` accepts an optional axios config (D8) |
| `app/src/composables/useTable.ts` | Modify | Export `LoadAborted`; `fetchAllPages` doesn't toast for it (D14) |
| `app/src/composables/tests/useTable.spec.ts` | Modify | `fetchAllPages` returns `null` without a toast on `LoadAborted`, and toasts on other errors |
| `app/src/api/administration/queries.ts` | Modify | `handlesFailureLocally` option on the QB integration query, with its own key (D8) |
| `app/src/api/administration/tests/` (existing queries spec) | Modify | Flag passes through; the flagged variant uses a distinct key; the default key is unchanged |

#### Key code changes (in `Categories.vue`):

```ts
// Dedicated loader: 1000-row pages; pageSize must match or fetchAllPages mis-detects the last page (D1).
const { loading, mapPaginationForAPI, fetchAllPages } = useTable({ rowsPerPage: 1000, pageSize: 1000 });

const DEFAULT_SORT = { sortBy: 'name', descending: false, rowsPerPage: 0, page: 1 } as const;
const tableSort = ref<{ sortBy: string; descending: boolean; rowsPerPage: number; page: number }>({ ...DEFAULT_SORT });
// NO rowsNumber → q-table runs client-side and calls :sort-method (D2).

const qbDisplayValue = (row: PartCategory) => row.productAndServiceName || 'Parts'; // D7, S1-R17
const categorySortMethod = makeSortMethod<PartCategory>(
  { name: (row) => row.name, quickbooks_product_and_service: qbDisplayValue },
  (row) => row.isDefault, // D4, S1-R19/R20
);

let loadSequence = 0; // NFR-002
const loadCategories = async () => {
  const sequence = ++loadSequence;
  loading.value = true;
  try {
    const all = await fetchAllPages(fetchCategoryPage, { chunkSize: 1 });
    if (sequence !== loadSequence || all === null) return;
    categories.value = all; // assigned only when complete (D9)
  } finally {
    if (sequence === loadSequence) loading.value = false;
  }
};

watch(search, () => void loadCategories()); // D5 — PageSearchInput already debounces 300 ms

// If the QB column disappears (location switch to a non-QB shop) while it is the sort column, fall back to the default.
watch(isQuickBooksConnected, (connected) => {
  if (!connected && tableSort.value.sortBy === 'quickbooks_product_and_service') tableSort.value = { ...DEFAULT_SORT };
});
```

- `fetchCategoryPage` keeps its current shape (it already passes `search` and uses `mapPaginationForAPI()`, which now yields `rowsPerPage: 1000`), except that `return result || []` becomes `if (!Array.isArray(result)) throw new LoadAborted(); return result;` (D14).
- `onCategoryChanged` becomes `await loadCategories()`. Reload in place keeps `tableSort` untouched (FR-006).
- `fetchAllCategoriesForValidation` becomes `allCategoriesForValidation.value = categories.value`, because the list is already complete for the current search scope, which is the same scope the function covers today. Remove `fetchPagesInChunks`, `onScroll`, `resetPagination`, `updatePaginationOnSuccess`, `fetchNewDataOnScroll`, `resetAndFetchNewData`, and `updateTableDataOnSuccess` if they end up unused.
- The location subscription (and `onMounted`) calls `loadCategories()` instead of the old reset path. Sort is kept (D13), except for the QB fallback above.
- QB column descriptor: `sortable: true`, and `field: qbDisplayValue` in place of the string field.
- QuickBooks check with the failure flag (D8): `useQuickBooksIntegrationQuery({ enabled: qbEnabled, handlesFailureLocally: true })`. Supporting changes:
  - `app/src/api/administration/index.ts`: `fetchQuickBooksData: (config?: AxiosRequestConfig) => $axios.get('bookkeeping/integration', config)`.
  - `app/src/api/administration/queries.ts`: `quickBooksIntegrationQueryOptions(enabled, { handlesFailureLocally })`. The queryKey becomes `[...administrationKeys.quickBooksIntegration(), { handlesFailureLocally: true }]` (key factory in `app/src/api/administration/keys.ts`) only when the flag is set (other consumers keep the unchanged key), and `queryFn` passes `{ handlesFailureLocally: true }` to `fetchQuickBooksData`. Update the `useQuickBooksIntegrationQuery` options type.
- Toast latch per workplace, and the column gated on the error (D8):
  ```ts
  const { subscribeToLocation, location } = useLocation();
  const qbErrorToldFor = new Set<string>();
  watch(quickBooksError, (err) => {
    const workplaceKey = String(location.value?.id ?? '');
    if (err && isQueryErrorReal(err) && !qbErrorToldFor.has(workplaceKey)) {
      qbErrorToldFor.add(workplaceKey);
      showErrorNotification({ message: 'Unable to check QuickBooks connection. Please try again.' });
    }
  });
  const isQuickBooksConnected = computed(
    () => qbEnabled.value && !quickBooksError.value && !!quickBooksData.value && !quickBooksData.value.authUrl,
  );
  ```
  (Confirm the id field on `location` when implementing; `useLocation()` exposes `location`.)

Template:
```vue
<Table
  v-model:pagination="tableSort"
  :built-in-search="false"
  :data="categories"
  :columns="columns"
  :sort-method="categorySortMethod"
  :loading="loading"
  class="max-height"
  data-test-id="table_categories"
>
  <template #header-cell="headerProps">
    <q-th :props="headerProps" :data-test-id="`header_categories_${headerProps.col.name}`"
          :aria-sort="ariaSortFor(tableSort, headerProps.col.name)">
      {{ headerProps.col.label }}
    </q-th>
  </template>
  <!-- existing #header-cell-quickbooks_product_and_service: add the same data-test-id + aria-sort to its q-th -->
  <!-- #body: add :data-test-id="`category_name_${props.row.id}`" on the name q-td,
       :data-test-id="`category_qb_${props.row.id}`" on the QB q-td, data-test-id="category_default_badge" on the badge;
       QB cell renders qbDisplayValue(props.row) -->
</Table>
```
(`:filter="search"`, `@virtual-scroll`, and `@request` are removed. `data-test-id-suffix="categories"` was inert and is replaced by a literal `data-test-id`, since `Table.vue` has no suffix prop; see SV-10388.)

#### Unit tests (`Categories.spec.ts`):
- Extend the `Table` stub to expose `pagination`, `sortMethod`, and `rows`, and to emit `update:pagination`. Drop the hard-coded `sortBy: ''` `request` emit.
- Mount: fetch is dispatched with `rowsPerPage: 1000`; with 1000 + 76 rows mocked, two pages are fetched and `categories` holds 1,076 (FR-003, NFR-001).
- The bound `pagination` starts at `{ sortBy: 'name', descending: false }` with no `rowsNumber` (FR-001, FR-007).
- `sortMethod` output: Default first under name asc/desc and QB asc/desc (FR-009). QB unmapped → `Parts` sorts with a genuine `Parts` mapping (FR-008).
- `@changed` → reload; `tableSort` unchanged (FR-006).
- A header click sequence asc → desc → asc never lands on unsorted (D15).
- A page fetch resolving to `undefined` (cancelled) doesn't replace rows with a partial list (D14).
- `search` change → reload with the search param; `tableSort` unchanged (FR-006). A slow earlier response doesn't overwrite a newer one (NFR-002).
- QB column absent when not connected; sort falls back to name when the column disappears (FR-010). Error toast shown once across two error transitions (D8).
- The QB query is requested with `handlesFailureLocally: true`; with a 500 from `bookkeeping/integration` (MSW), exactly one notification is shown, the specific message (FR-010, D8).
- A successful check followed by a failed refetch hides the QB column (D8 point 4). A second failing workplace in the same visit gets its own single message (D8 point 1).
- A `LoadAborted` page (fetcher resolved `undefined`) keeps the previous rows and shows no toast (D14).

#### Verification (Definition of Done gates):
- **Static (scoped):** eslint, `npx vitest related --run app/src/components/ts/parts/Categories.vue`, `vue-tsc`.
- **Compile:** Vite up, no overlay.
- **Smoke:** not required (no BE change).
- **Browser-walk:** `http://localhost:7200/administration/categories` as `admin` (QUICK_LOGIN_USERS).
  - Opens name A→Z with the ↑ on Name, and Uncategorized + Default badge in row 1.
  - Click Name: Z→A, arrow flips, Uncategorized still row 1.
  - On a QB-connected workplace, click the QuickBooks header: sorts A→Z with the arrow moved; click again for Z→A.
  - Edit a category and save: sort and arrow unchanged.
  - Type a search: matches appear in the same order.
  - Navigate away and back: name A→Z.
  - Block `bookkeeping/integration` in DevTools (500) on a QB-enabled workplace: exactly one toast, the specific QuickBooks message; the page stays; Name sorts.
  - The Network tab shows one `categories-list` call with `rowsPerPage=1000`. The console has no errors.

---

### Phase 3: Pricing Matrices — sortable name column, tab label spacing
**Implements:** FR-013 … FR-017, FR-026 (action columns), FR-024 (label spacing only; the count is completed in Phase 4)
**Depends on:** Phase 1

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/parts/Pricing.vue` | Modify | Matrices sort state + `sort-method`; `sortable: true` on `name`; header hooks; both copies of the two tab labels; separate matrices loading flag |
| `app/src/components/ts/parts/tests/Pricing.spec.ts` | Modify | Tab labels, default sort, not pinned, sort survives `refreshPricingPage` |

#### Key code changes:
```ts
const matricesSort = ref({ sortBy: 'name', descending: false, rowsPerPage: 0, page: 1 });
const matricesSortMethod = makeSortMethod<PricingMatrix>({ name: (row) => row.name }); // no pin (D4, S2-R13)
const matricesLoading = ref(false);
// loadData(fetchPricing): assign pricingData.value = data.collection (drop the .sort(localeCompare) — sort-method owns ordering)
```
- `pricingColumns.name`: add `sortable: true`. The duplicate/edit/delete columns stay non-sortable, so they get no arrow and no hover (FR-026).
- Matrices `<Table>`: add `v-model:pagination="matricesSort"`, `:sort-method="matricesSortMethod"`, `:loading="matricesLoading"`, `data-test-id="table_pricing_matrices"`, and a `#header-cell` slot with `header_pricing_matrices_<col>` + `aria-sort`. Remove the dead `@request="loadPricingMatrices"`. Keep `:filter="search"`, since matrices search is already client-side and must stay unchanged.
- Existing `#body-cell-name`: add `:data-test-id="\`matrix_name_${props.row.id}\`"`; badge `data-test-id="matrix_default_badge"`.
- **Tab labels, four literals (lines ~38/45 and ~175/182, the `q-tabs` block is duplicated per panel):** `` `Pricing matrices (${pricingData.length})` `` and `` `Fixed rules (${fixedRulesData.length})` ``. The rendered capitalization comes from `.q-tab__label { text-transform: capitalize }` in `app.scss`, which the PRD's context note accepts; don't change it.
- Reload in place (`refreshPricingPage`) only replaces `pricingData`, so `matricesSort` is kept (FR-014). The sort refs live in `Pricing.vue`, so they survive tab switches (D6).

#### Unit tests:
- Tab labels render `Pricing matrices (2)` / `Fixed rules (3)` with exactly one space.
- The bound pagination starts at name asc. `sortMethod` places `Default matrix …` by name, not first, in both directions (FR-016).
- After `refreshPricingPage()`, `matricesSort` is unchanged.

#### Verification:
- **Static (scoped)**, **Compile**.
- **Browser-walk:** `/administration/pricing` as `admin`.
  - The tab reads "Pricing Matrices (N)" (capitalized by CSS, with a space).
  - The list is A→Z with ↑ on Matrix Category, and the Default matrix sits at its alphabetical position with its badge.
  - Click: Z→A.
  - Edit a matrix and save: order kept.
  - Hovering the action columns shows no arrow.
  - Leave and return: A→Z.

---

### Phase 4: Fixed Rules — load all, three sortable columns
**Implements:** FR-018 … FR-025, FR-026, FR-028, FR-029, NFR-001, NFR-002, NFR-005; D10, D14, D16
**Depends on:** Phases 1 and 3 (same file; Phase 3's tab-label edits land first)

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/parts/Pricing.vue` | Modify | Fixed Rules load-all, client-side mode, sort state, sortable columns, header/cell hooks, separate loading flag |
| `app/src/components/ts/parts/tests/Pricing.spec.ts` | Modify | Load-all paging, default sort, numeric price sort, sort survives refresh |

#### Key code changes:
```ts
// Replaces the shared useTable() instance for Fixed Rules (nothing else in Pricing.vue uses it once matrices has its own flag)
const { mapPaginationForAPI, fetchAllPages } = useTable({ rowsPerPage: 1000, pageSize: 1000 });

const fixedRulesSort = ref({ sortBy: 'partNumber', descending: false, rowsPerPage: 0, page: 1 });
const fixedRulesSortMethod = makeSortMethod<FixedPriceRule>({
  partNumber: (row) => row.partNumber,
  categoryName: (row) => row.categoryName,      // empty → last both directions (FR-022)
  fixedPrice: (row) => row.fixedPrice,          // numeric compare (FR-020), not the "$4.5" display string
});
const fixedRulesLoading = ref(false);

const fetchFixedRulesPage = async (page: number): Promise<FixedPriceRule[]> => {
  const data: FetchFixedPriceRulesData | undefined = await store.dispatch('parts/fetchFixedPriceRules', {
    pagination: { ...mapPaginationForAPI(), page },
    filters: getFilters.value,
  });
  // D14: cancelled/expired requests resolve to undefined — never treat that as an empty last page.
  if (!Array.isArray(data?.parts)) throw new LoadAborted();
  return data.parts;
};

let fixedRulesSequence = 0; // NFR-002
const loadFixedRules = async () => {
  const sequence = ++fixedRulesSequence;
  fixedRulesLoading.value = true;
  try {
    const all = await fetchAllPages(fetchFixedRulesPage, { chunkSize: 3 });
    if (sequence !== fixedRulesSequence || all === null) return;
    fixedRulesData.value = all;               // no pre-sort; sort-method owns ordering
  } finally {
    if (sequence === fixedRulesSequence) fixedRulesLoading.value = false;
  }
};

const refreshPricingPage = () => {
  loadPricingMatrices();
  void loadFixedRules();                      // sort refs untouched → survives reload (FR-021)
};
```
- `fixedRulesColumns`: `sortable: true` on all three. Keep `field: (row) => \`$${row.fixedPrice}\`` as the display. Two-decimal formatting belongs to SV-10387, and sorting doesn't read `field`.
- Fixed Rules `<Table>`: `v-model:pagination="fixedRulesSort"`, `:sort-method="fixedRulesSortMethod"`, `:loading="fixedRulesLoading"`, `data-test-id="table_fixed_rules"`. Remove `@virtual-scroll` and `@request`. **Keep `:filter="search"` (D10, S3-R18).** Pass the filter as `:filter="search.trim()"` so a trailing space doesn't defeat a match. Add the loading lock (D16): `` :table-class="`base-table${fixedRulesLoading ? ' fixed-rules--loading' : ''}`" `` (`Table.vue` types `tableClass` as a string; keep the default `base-table`), and `:aria-busy="fixedRulesLoading"` (it falls through to the q-table root), and wrap the Fixed Rules panel's `PageSearchInput` in `<div :inert="fixedRulesLoading || undefined">`, with a scoped style `.fixed-rules--loading { pointer-events: none; opacity: 0.6; }`.
- Add a `#header-cell` slot (`header_fixed_rules_<col>` + `aria-sort`) and cell hooks through `#body-cell-partNumber` / `#body-cell-categoryName` / `#body-cell-fixedPrice`: `q-td :props` with `data-test-id="fixed_rule_<col>_${row.id}"`, rendering `props.value`.
- Remove `updateTableDataOnSuccess`, `resetAndFetchNewData`, `fetchNewDataOnScroll`, and the `onScroll`/`resetPagination`/`updatePaginationOnSuccess` destructures once unused. Remove the `search` param from the fixed-rules fetch (the BE ignores it).

#### Unit tests:
- MSW `*/parts/list-fixed-price*` returns 1000 rows for page 1 and 3 rows for page 2 → 2 requests with `rowsPerPage=1000`, `fixedRulesData.length === 1003`, and the tab label reads `Fixed rules (1003)` (FR-023, FR-024).
- The bound pagination starts at `partNumber` asc. `sortMethod` orders `10GW, 109Y/CB-3840, 10953464, 11133EA, 111165` (FR-019, FR-021).
- `fixedPrice` asc `9, 10` / desc `10, 9` (FR-020). An empty `categoryName` is last in both directions (FR-022).
- After `refreshPricingPage()`, `fixedRulesSort` is unchanged and data is refetched. A superseded load is discarded.
- A page resolving to `undefined` keeps the previous rows (D14).
- Search `brk-1` (and `brk-1 ` with a trailing space) filters to matching part numbers in the current sort; a term matching the displayed price (`$4.5`) or a category name matches too; clearing restores all rows; no refetch on search (FR-028).
- While a load is pending: the table has `aria-busy="true"` and the `fixed-rules--loading` class, and the search wrapper is `inert`; both clear when loading finishes (FR-029).

#### Verification:
- **Static (scoped)**, **Compile**.
- **Browser-walk:** `/administration/pricing` → Fixed Rules tab as `admin`.
  - The label reads "Fixed Rules (N)" with a space.
  - The list opens by part number with ↑, numeric-aware.
  - Click Category: sorts A→Z with the arrow moved; click again for Z→A.
  - Click Fixed price: lowest first, then highest first.
  - Add a fixed rule: the list reloads with the sort kept.
  - Type part of a part number, a category name, then a price as shown: matching rows appear in the current sort; clear it and every rule returns (FR-028).
  - On the 9k-rule tenant, while it loads: progress bar shown; clicking headers or rows and typing in search do nothing; the tabs still switch (FR-029).
  - Leave and return: part number asc.
  - Network: `list-fixed-price` calls at `rowsPerPage=1000` only. Console clean.
  - Volume check: seed or point at a workplace with 2k+ fixed rules and confirm one spinner, then the full list, with no partial ordering.

---

### Phase 5: Release note (non-code)
**Implements:** FR-027
**Depends on:** Phases 2–4 merged

Add a release-notes line in US spelling, e.g. *"Sorting now works on Settings → Parts → Categories, Pricing matrices and Fixed rules. A sort you choose stays applied after you create, edit or delete a row, and after you search; it resets when you leave the page. The Fixed rules search box now filters the list."* Send it to whoever compiles the release notes for the release that ships this.

## 7. Testing Strategy

### Unit tests (`app/`)
- `tableSort.spec.ts`: comparator semantics, including collation, numeric order, empty-last in both directions, pinning, stability, and numbers (Phase 1).
- `Categories.spec.ts`: load-all, default sort binding, sort-method pin, reload/search persistence, stale-response guard, QB fallback, toast latch (Phase 2).
- `Pricing.spec.ts`: tab labels, matrices sort binding and no pin, fixed-rules load-all paging, sort persistence, numeric price order (Phases 3–4).
- Edge cases to watch: an exact multiple of 1000 rows (one extra empty-page request, harmless); a location switch mid-load (stale guard); the QB column disappearing while sorted.

### Integration tests
- No backend change, so no new BE tests. The existing `tests/Functional/Inventory/Parts/PartFixedPricesListTest.php` already covers `rowsPerPage` handling.

### Manual testing checklist
1. Categories on a QB-connected workplace and on a non-connected one: the QB column and its sort are present or absent accordingly.
2. Force the QB check to fail (e.g. block `bookkeeping/integration` in DevTools): the message shows once, and Name still sorts.
3. A large org (the 1,076-category tenant on staging, if its data is available) loads fully with two requests.
4. A large fixed-rules workplace loads fully, then sorts without visible lag.
5. Switch tabs Pricing ↔ Fixed Rules: each keeps its own sort.
6. Mobile isn't applicable (desktop only).

### E2E tests

UI-affecting paths: `Categories.vue` and `Pricing.vue` (`app/src/components/**`). `batchCap = 5`.

**Reference-breakage scan (mandatory, uncapped):** `e2e/src/pages/administration/categories.page.ts` uses `nameColumn` (XPath `//thead/tr/th[contains(text(), 'Name')]`), `tableBodyColumns` (`td[1]`), `defaultCategory` (`getByText('Default').first()`), and the `scrollVirtualTableToFindRow` helper. Virtual scroll stays on, and the label text stays in the `th`, but the helper's assumptions about infinite-scroll loading and the "backend sorts Default first" comment must be re-checked. `e2e/src/pages/administration/pricing.page.ts`: `getPriceMatricesTabCount()` / `waitForMatricesHydrated()` parse `/\((\d+)\)/` and survive the added space. Its docblock line reference is stale. `app/cypress/e2e/administration/pricing.cy.ts` uses tab ids only. `/e2e-after-change` does this scan.

**Test: Categories open sorted with Default pinned, and Name toggles** (Happy path, FR-001, FR-002, FR-009)
1. Seed categories `Tier 10`, `Tier 9`, `alternator`, `Zinc` via `CategoryFactory`.
2. Go to `/administration/categories`.
3. Read `header_categories_name` `aria-sort`, then the row order of `category_name_*`.
4. Click `header_categories_name`.
- **Expected:** on open, `aria-sort="ascending"`, row 1 is Uncategorized with `category_default_badge`, and the seeded rows read `alternator, Tier 9, Tier 10, Zinc`. After the click, `aria-sort="descending"`, the seeded rows are reversed, and Uncategorized is still row 1.

**Test: Categories sort survives edit and search, and resets on fresh open** (Happy path, FR-006, FR-007)
1. Open Categories and click Name, so the sort is descending.
2. Edit a seeded category's tax toggle and save.
3. Type `Tier` into `page_search_input`.
4. Navigate to another settings page and back.
- **Expected:** after the edit, still descending. After the search, only `Tier 10, Tier 9` in descending order with Uncategorized absent (it doesn't match). After returning, `aria-sort="ascending"` on Name.

**Test: Pricing matrices sort by name, Default not pinned, tab label** (Happy path, FR-013, FR-015, FR-016)
1. Seed matrices `A-Matrix 9`, `A-Matrix 10` via `PricingMatrixFactory`.
2. Open `/administration/pricing`.
3. Read `route_tab_pricing_matrices` text and `header_pricing_matrices_name` `aria-sort`.
4. Click the header.
- **Expected:** the label matches `/Pricing matrices \(\d+\)/i`, with one space. Ascending order has `A-Matrix 9` before `A-Matrix 10`. The Default matrix row (`matrix_default_badge`) isn't row 1 unless its name sorts first. After the click, the order is descending.

**Test: Fixed rules numeric-aware part number, price by value, tab label** (Happy path, FR-018 … FR-021, FR-024)
1. Seed three inventory parts with `isFixedPrice: true` via `PartsFactory.createInventoryPart` (part numbers `E2E-BRK-9`, `E2E-BRK-10`, `E2E-BRK-100`; sell prices 10, 9, 100).
2. Open the Fixed Rules tab.
3. Read the order, then click `header_fixed_rules_fixedPrice` twice.
- **Expected:** on open, part number ascending gives `E2E-BRK-9, E2E-BRK-10, E2E-BRK-100` with `aria-sort="ascending"`. Price ascending puts the $9 row first; descending puts $100 first. Only one header has `aria-sort` other than `none`. The label matches `/Fixed rules \(\d+\)/i`.

**Test: Fixed rules search, sort survives add, resets on fresh open** (Edge case, FR-021, FR-023, FR-028)
1. Open Fixed Rules and sort by Category descending.
2. Type `E2E-BRK-1` into `page_search_input`, then clear it.
3. Add a fixed rule through the dialog.
4. Leave the page and return.
- **Expected:** while searching, only `E2E-BRK-10` and `E2E-BRK-100` show, still Category descending; after clearing, every rule is back in the same sort. After the add, still Category descending and the new rule is present. After returning, Part number ascending.

**Backlog (beyond `batchCap`):**

| Workflow | FR | Why deferred |
|---|---|---|
| QuickBooks column sort (asc/desc, `Parts` fallback) | FR-004, FR-008 | Needs a QB-connected workplace fixture; unit-covered |
| QB not connected / check fails, message once | FR-010 | Needs QB fixture or failure injection; unit-covered |
| Empty lists keep sortable headers | FR-011, FR-017, FR-025 | Needs an empty tenant; unit-covered |
| >1000 rows load-all | FR-003, FR-023, NFR-001 | Seeding 1000+ rows is too slow for the suite; unit-covered with MSW |
| Fixed Rules locked while loading | FR-029 | Needs a slow/large dataset to observe the window; unit-covered |
| Tab switch keeps each tab's sort | D6 | Low risk; unit-covered |
| Matrix sort survives create/edit/delete | FR-014 | Same mechanism as the Fixed Rules reload test; unit-covered |
| Non-sortable action columns show no arrow | FR-026 | Static markup; unit-covered |

A non-zero backlog needs the override marker at PR time, per the coverage policy.

## 8. Rollback Plan

FE-only. Revert the PR (or the per-phase commits). There is no data, schema, cache, or API contract to unwind. The Redis `categories-list` keys for `rowsPerPage=1000` simply expire (24h TTL) or are invalidated on the next category write.

## 9. Security Considerations

- No new endpoints, parameters, or data. Loading every row uses the same tenant-scoped endpoints: `categories-list` (org), `list-fixed-price` (org + workplace), `pricing-rules/list` (org). NFR-003.
- Route access stays on `settingsParts` (FR-012/017/025).
- Pre-existing and out of scope: `GET /api/parts-catalogue/categories-list` has no `#[IsGranted]`. Tracked in **SV-10386** and deliberately not folded in, because it's a shared endpoint.

## 10. Requirement Traceability

| Requirement | Phase | Layer | Files | Status |
|---|---|---|---|---|
| FR-001 | 1, 2 | App | `app/src/utils/tableSort.ts`, `app/src/components/ts/parts/Categories.vue` | Planned |
| FR-002 | 2 | App | `Categories.vue` | Planned |
| FR-003 | 2 | App | `Categories.vue` (`fetchAllPages`, 1000) | Planned |
| FR-004 | 2 | App | `Categories.vue` (QB column `sortable`) | Planned |
| FR-005 | 2 | App | `Categories.vue` (q-table single sort, `aria-sort`) | Planned |
| FR-006 | 2 | App | `Categories.vue` (`tableSort` untouched on reload; `watch(search)`) | Planned |
| FR-007 | 2 | App | `Categories.vue` (component-local `DEFAULT_SORT`) | Planned |
| FR-008 | 1, 2 | App | `Categories.vue` (`qbDisplayValue`) | Planned |
| FR-009 | 1, 2 | App | `tableSort.ts` (`pinFirst`), `Categories.vue` | Planned |
| FR-010 | 2 | App | `Categories.vue` (QB fallback watch, toast latch), `app/src/api/administration/index.ts`, `app/src/api/administration/queries.ts` (`handlesFailureLocally`) | Planned |
| FR-011 | 2 | App | `Categories.vue` | Planned |
| FR-012 | — | App | `app/src/router/routes.ts` (existing guard, unchanged) | No change |
| FR-013 | 1, 3 | App | `tableSort.ts`, `app/src/components/ts/parts/Pricing.vue` | Planned |
| FR-014 | 3 | App | `Pricing.vue` (`matricesSort`) | Planned |
| FR-015 | 3 | App | `Pricing.vue` (4 tab-label literals) | Planned |
| FR-016 | 3 | App | `Pricing.vue` (no pin) | Planned |
| FR-017 | 3 | App | `Pricing.vue` | Planned |
| FR-018 | 4 | App | `Pricing.vue` (`fixedRulesColumns` `sortable`) | Planned |
| FR-019 | 1, 4 | App | `tableSort.ts`, `Pricing.vue` | Planned |
| FR-020 | 1, 4 | App | `tableSort.ts` (numeric), `Pricing.vue` (`fixedPrice` accessor) | Planned |
| FR-021 | 4 | App | `Pricing.vue` (`fixedRulesSort`) | Planned |
| FR-022 | 1, 4 | App | `tableSort.ts` (empty-last) | Planned (S3-R12b as revised) |
| FR-023 | 4 | App | `Pricing.vue` (`loadFixedRules`) | Planned |
| FR-024 | 3, 4 | App | `Pricing.vue` | Planned |
| FR-025 | 4 | App | `Pricing.vue` | Planned |
| FR-026 | 2, 3, 4 | App | `Categories.vue`, `Pricing.vue` (non-sortable action columns) | Planned |
| FR-027 | 5 | Docs | Release notes | Planned |
| FR-028 | 4 | App | `Pricing.vue` (`:filter="search"` kept, client-side) | Planned |
| FR-029 | 4 | App | `Pricing.vue` (loading lock, D16) | Planned |
| NFR-001 | 2, 4 | App | `Categories.vue`, `Pricing.vue` | Planned |
| NFR-002 | 2, 4 | App | `Categories.vue`, `Pricing.vue` (sequence guards) | Planned |
| NFR-003 | all | API | none (verified: no `api/` diff) | Planned |
| NFR-004 | — | App | none | No change |
| NFR-005 | 1 | App | `tableSort.ts` (single collator, precomputed keys) | Planned |
| FR-001, FR-002, FR-009 | 2 | E2E | `e2e/tests/ui/categories-sorting.spec.ts` (new) | Planned |
| FR-006, FR-007 | 2 | E2E | `e2e/tests/ui/categories-sorting.spec.ts` | Planned |
| FR-013, FR-015, FR-016 | 3 | E2E | `e2e/tests/ui/parts-pricing-sorting.spec.ts` (new) | Planned |
| FR-018 … FR-021, FR-024 | 4 | E2E | `e2e/tests/ui/parts-pricing-sorting.spec.ts` | Planned |
| FR-021, FR-023, FR-028 | 4 | E2E | `e2e/tests/ui/parts-pricing-sorting.spec.ts` | Planned |
| FR-003, FR-004, FR-008, FR-010, FR-011, FR-014, FR-017, FR-025, FR-026, FR-029, D6 | — | E2E | Backlog | Deferred |

## 11. Verification Tickets

| Ticket | Title | Covers | Linked stories | Assignee |
|---|---|---|---|---|
| [SV-10394](https://shopview.atlassian.net/browse/SV-10394) | Verify: Categories sorting (Name, QuickBooks, pinned Default) | Phases 1–2 / FR-001–FR-012, FR-026, NFR-001/002/005 | SV-10134 | Nemanja Djuric |
| [SV-10395](https://shopview.atlassian.net/browse/SV-10395) | Verify: Pricing Matrices sorting and tab labels | Phase 3 / FR-013–FR-017, FR-024 (label), FR-026 | SV-10135 | Nemanja Djuric |
| [SV-10396](https://shopview.atlassian.net/browse/SV-10396) | Verify: Fixed Rules sorting, load-all, release note | Phases 4–5 / FR-018–FR-029 (incl. FR-026 on this tab, FR-027 release note) | SV-10136 | Nemanja Djuric |

When all these tickets are marked Done, the feature is ready for QA.

## Open Questions / Assumptions / Risks

- **All Product questions are answered** (Confluence reply, 2026-09-23) and folded into §1/§3.
- **Design canvas updated (verified 2026-09-25):** the stale "(none) sorts last" boards and caption are gone; the S1-R17 card now reads "no blanks: never mapped reads Parts", and the visible titles use US spelling.
- **Separate ticket (per Product):** [SV-10445](https://shopview.atlassian.net/browse/SV-10445) — list the 3 category-less fixed rules (needs `leftJoin` in `DbalPartFixedPriceFetcher`). Not this release.
- **Undefined by the PRD, plan behavior:** a browser refresh or history-back keeps `?search=` (URL-synced) but resets the sort, because a refresh is a fresh open. On Pricing, one search term applies to both tabs (D10).
- **Risk — load time for the largest shop:** 9 sequential-ish requests (3 rounds of 3) for 8,994 rules, roughly 1.5–1.8 MB of JSON. Mitigation: loading state, no partial render. Product has been told.
- **Pre-existing, left alone:** category-dialog duplicate-name validation under an active search checks only the matching rows (the same as today); Pricing Matrices client filter also matches hidden action-column values (row ids).
- **Related tickets (outside this plan):** SV-10386 (categories-list authz), SV-10387 (fixed price two decimals), SV-10388 (e2e-precheck phantom table ids), SV-10445 (category-less fixed rules).