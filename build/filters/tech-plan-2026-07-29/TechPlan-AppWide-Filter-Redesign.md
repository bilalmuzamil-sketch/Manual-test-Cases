<!-- Source: user upload 2026-07-29 — engineering tech plan (App-Wide Filter Redesign). Copied VERBATIM below this header line for the Filters project reconciliation. -->

# Tech Plan — App-Wide Filter Redesign (pilot: Work Orders)

Program: **every page with filters gets: the new chip design + shareable-link (URL) filter state + per-user persistence** (saved server-side via the generic prefs endpoint, each page under its own `pageKey`) **+ a page-local search input** (the page/global search split — see G8/D18). The Work Orders page is the pilot AND the only page whose filter *semantics* change (new filters, tab restructure). All other pages keep their existing filters exactly — what was filterable stays filterable — they gain the design, the links, and the persistence. The design cannot ship on WO alone — the rollout phases (6–8) are part of this plan, not future "maybe" work.
Spec: https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/572030978/Filters
All product/design decisions are settled and inlined in §2a "Decisions register" — FINAL, do not reopen; anything not covered there is a scope question to surface for a human decision.
IDs like `S9-R5` / `S11-N1` are story/requirement/negative-case numbers from the Confluence spec above; each usage here carries its own behavioral gloss, so Confluence is reference, not required reading.

---

## 1. Execution State

**Current phase:** Phase 0 — Verification & decisions
**Status:** In progress — 0.1/0.2/0.5 closed; 0.3/0.4 next

### Checklist

- [ ] **Phase 0 — Verification & decisions** (no production code)
  - [x] 0.1 EXPLAIN unfiltered All-tab query on largest workplace (prod-sized data) — done 2026-07-20, see log
  - [x] 0.2 EXPLAIN tech-only / advisor-only filter selections → decided: NO extra composites; keep 1.4 — see log
  - [ ] 0.3 Decide + record FilterDecorator multi-value convention (recommended: repeated-eq)
  - [ ] 0.4 Decide + record service-advisors active-only shape (recommended: `activeOnly` param)
  - [x] 0.5 ~~Invoice fan-out ticket~~ — RETIRED 2026-07-20: not a real bug (see log)
- [ ] **Phase 1 — Backend**
  - [ ] 1.1 `UserPagePreference` aggregate + repository (Domain/Infrastructure, `src/IAM/Preferences/`)
  - [ ] 1.2 Migration: `user_page_preference` table
  - [ ] 1.3 GET/PUT `/api/users/me/preferences/{pageKey}` endpoints (UI/Application layers)
  - [ ] 1.4 Migration: composite index `(workplace_id, type, company_id)` on `work_order` (+ extras only if 0.2 says so)
  - [ ] 1.5 Whitelist `tech_assigned_id` + `service_advisor_id` in `ListingQueryHandler::$filterFields`
  - [ ] 1.6 Verify + functionally test `vehicleHere=0` path
  - [ ] 1.7 Service advisors: active-only per 0.4 decision
  - [ ] 1.8 Pest tests for all of the above; schema-sync gate; smoke test
- [ ] **Phase 2 — FE shared filter system** (`app/src/components/ts/shared/filters/`)
  - [ ] 2.1 `Model.ts` — `FilterDef` / `FilterState` / option types
  - [ ] 2.2 `FilterChip.vue` + dropdown panels (option-list / search-list / yes-no)
  - [ ] 2.3 `FilterBar.vue` (chips row, Clear filters, active states, collapse behavior)
  - [ ] 2.4 `src/api/preferences/` module + `usePagePreferences` composable
  - [ ] 2.5 `useFilterUrlSync` composable (G7 runtime-view semantics, page-agnostic)
  - [ ] 2.6 `PageSearchInput.vue` — kit search input per Story 13 (4 component states, expand-in-place, blur rules, 300ms debounce; D18)
  - [ ] 2.6b `FilterDateRangePanel.vue` + `FilterType` union extension — the new date-range chip (D19); no presets, no default, applies on second date, URL `range=custom&from=&to=`
  - [ ] 2.7 Vitest coverage (all Phase 2 components + composables)
- [ ] **Phase 3 — WO page integration** (`app/src/pages/WorkOrders.vue`)
  - [ ] 3.1 Tab restructure: All / Estimates / Completed / My Work Orders; retire By Status + old Work Orders tab + both toggles
  - [ ] 3.2 Wire 5 chips to `filters[]` request convention; per-tab status-chip visibility; imported exclusivity
  - [ ] 3.3 Persistence migration: localStorage → prefs endpoint incl. startup sequencing + debounced saves
  - [ ] 3.4 URL sync + "back to my saved filters" affordance (G7)
  - [ ] 3.5 Empty state with clear-filters prompt
  - [ ] 3.6 WO page-toolbar search per Story 13 (`PageSearchInput` → existing `search` param; page stops listening to `globalSearchTriggered`; in URL sync AND in the saved pref per S10-R4; D18)
  - [ ] 3.7 Vitest coverage; desktop browser-walk
- [ ] **Phase 4 — Mobile**
  - [ ] 4.1 Horizontal chip row (no collapse toggle on mobile)
  - [ ] 4.2 "All Filters" combined bottom sheet with batch Apply (D15)
  - [ ] 4.3 Per-filter bottom sheets
  - [ ] 4.4 Vitest coverage; mobile-viewport browser-walk
- [ ] **Phase 5 — WO verification** (pilot gates; NO PR yet — the program ships as one PR at the end of Phase 9)
  - [ ] 5.1 Static gates scoped to all changed files (BE + FE)
  - [ ] 5.2 Migration gate (`doctrine:migrations:diff` no-op)
  - [ ] 5.3 Compile gate + endpoint smoke sweep + BE log check
  - [ ] 5.4 Browser-walk desktop + mobile viewport with `QUICK_LOGIN_USERS`
- [ ] **Phase 6 — Rollout foundation: page inventory & design gaps** (same branch)
  - [ ] 6.1 Inventory every page in `app/` with a filter UI → rollout matrix appended to §4.6 of this plan
  - [ ] 6.2 Map each page to its Figma frame; list pages with NO design → request designs from the spec author before their batch (known gap: Parts **Vendors** view)
  - [ ] 6.3 S14-R5/R6 sweep list: enumerate EVERY page whose record set is currently altered by global search (the 38-consumer inventory in §Phase 9 is the seed) and mark each as "gets a control" (default — the Phase 9.1 opt-out `Table.vue` input) so no page silently loses text narrowing
- [ ] **Phase 7 — Rollout: Parts views** (spec lists 8: Inventory, Part Sales, Catalog, Returns, Credits, Purchase Orders, Vendor Invoices, **Vendors**; same branch)
  - [ ] 7.1 Inventory (`11894:21846`), Part Sales (`11902:8517`), Catalog (`11902:9736`)
  - [ ] 7.2 Returns (`11902:9852`), Credits (`11903:10067`), Purchase Orders (`11903:10188`), Vendor Invoices (`11903:10312`/`11903:10461`)
  - [ ] 7.3 **Vendors** — ⚠️ no Figma frame found in the Parts section although the spec lists it; resolve via Phase 6.2 (request design) before building
  - [ ] 7.4 Per-view filter sets are context-specific (spec v1.3 Parts section): e.g. Inventory = Bin Location, Category, Supply, Vendor; Purchase Orders = Vendor, Status, Date, Ordered by. Entity filters use searchable multi-select; Category/Manufacturer searchable; short enums checkbox; date columns use the D19 date-range chip
- [ ] **Phase 8 — Rollout: Reports pages** (~24 designed screens; coordinate with the reports-suite track — it owns those pages' specs)
  - [ ] 8.1 Alignment session with reports-suite track (its working doc: `docs/tech-plans/reports-suite-preplan.md`; specs in Confluence under Reports): who executes, batch order
  - [ ] 8.2 Report-page batches per §4.6 recipe — page list per spec S13-R22 (Timesheet Activities, Timesheets, Sales, Technician Efficiency ×2, Advisor Analysis, Shop Efficiency, WIP, Sales Follow Up, Sales Tax ×2, A/R Aging ×3, A/P Aging ×2, A/P Unpaid Invoices, IBS Batch Transactions, QuickBooks Unexported Items, Notes, Reminders); nearly every report leads with the D19 date-range chip; sub-report tabs keep separate state per tab (D20)
- [ ] **Phase 9 — Search decoupling + program verification & PR**
  - [ ] 9.1 Base `Table.vue` built-in search input (opt-out prop) → covers the ~25 nav-search list consumers not on the filter-bar redesign (incl. detail-page tabs, dialogs, 4 client-side `:filter` tables)
  - [ ] 9.2 Remove the list-filter fan-out: delete `Table.vue`'s `searchString` watch/re-emit + `GlobalSearch.vue` cleanup (route-keyed Inventory debounce, blur-placeholder hack); nav search becomes omni-dropdown only
  - [ ] 9.3 E2E rework: `inventory.page.ts` / `catalog.page.ts` / `work-order.spec.ts` list-filter flows move from the nav input to page inputs (omni-dropdown page object + permission specs survive)
  - [ ] 9.4 Program-wide final gates (rerun 5.1–5.4 scope across ALL changed files/pages)
  - [ ] 9.5 Mandatory E2E ask (root AGENTS.md); update `e2e/src/pages/work-orders/work-orders.page.ts` + any other affected page objects
  - [ ] 9.6 `/create-pr` — the program's single PR (D11), body organized per-area (WO / Parts / Reports / Search split)

**NEXT ACTION:** Phase 0, steps 0.3–0.4 — record the FilterDecorator repeated-eq decision (§4.0.3) and the service-advisors `activeOnly` decision (§4.0.4) in the log (recommended defaults are pre-approved; anything else needs the user). 0.1/0.2/0.5 are already closed (see log). Then Phase 1.

### Decisions & deviations log

Executing agents append here.

| Date | What changed | Why |
|---|---|---|
| 2026-07-20 | **0.1 DONE — All-tab EXPLAIN on prod (v8.0.42, largest workplace `62508718…`, 7,169 service WOs):** `wo` rides `wo__workplace_type_status_tech_advisor_id_idx` (ref on workplace+type, est. 12,952 rows) → 9 joins → `Using temporary; Using filesort` for the 3-table ORDER BY. No table scan. | Confirms D10's accepted cost: All tab = ~13k-row filesort per request on the biggest shop; acceptable, and Estimates-as-default keeps it off the landing path. No surprise found. |
| 2026-07-20 | **0.2 DONE — no extra tech/advisor composites.** Tech-only IN(2): optimizer picks lone `wo__tech_assigned_id_idx`, range, est. 742 rows (= exact sum of the two techs' WO counts). Advisor-only IN(2): lone `wo__service_advisor_id_idx`, est. 5,378 rows (exact). Both plans are index-driven and bounded by true result size — staff are workplace-bound, so the lone secondary is inherently scoped. Customer-only IN(2): drives from `company` PK then `wo__company_id_idx` ref, but row estimates are badly off (est. 4/company vs. actual ~2,487 total; `filtered` 3.07%) → misestimate risk under combined filters. | Per §4.0.2 decision rule: `(workplace_id,type,tech_assigned_id)` / `(…,service_advisor_id)` composites NOT warranted. Keep Phase 1.4's `(workplace_id, type, company_id)` composite — Q4's estimate skew is exactly the plan-flip risk it eliminates. `is_vehicle_here` stays unindexed. |
| 2026-07-20 | **Scope expanded from "WO + future rollout" to "app-wide program in this plan":** new chip design + link sharing ships on EVERY filter page (phases 6–8 added); WO remains the pilot and the only page gaining new filters/tabs; other pages = design + URL sharing only, semantics unchanged | Design can't ship on WO alone — the app must not have two filter designs long-term. All pages believed designed in Figma (Phase 6.1 verifies). |
| 2026-07-26 | **Six spec conflicts/gaps raised with the author** (URL-vs-saved precedence, "browser session" wording, query-per-tab ambiguity, Imported exclusivity undocumented, Story-14 surfaces outside S13-R22, missing Parts Vendors design). Build-meanwhile answers tabled in §2. | QA would otherwise write cases against contradictory text; engineering answers keep implementation unblocked while the spec is corrected. |
| 2026-07-20 | **Spec updated to v1.3 — Parts + Reports + Page Search now fully specified.** New: Parts filters (8 views, context-specific chips), Reports filters (~21 reports, date-led), **Story 13 Page Search** (23 requirements: component states, 300ms debounce, page-scoped, additive-and-independently-cleared, persisted + URL'd like filters, mobile inline expansion), **Story 14 Remove page filtering from global search** (app-wide, real removal), plus a **new date-range filter type** and **per-view/per-tab state scoping**. Plan updated: D18 rewritten (query IS persisted — supersedes our earlier default), D19/D20/D21 added, Phase 2 gains the date-range panel, Phase 6 gains the S14 sweep, Phase 7 = 8 views, Phase 8 lists the spec's reports, rollout recipe gains search + date-range + mobile toolbar rules. | The spec caught up with (and extended) the program scope; where it contradicted a working default (search-query persistence) the spec wins. |
| 2026-07-20 | **Search split added to the program (G8 flipped, D14 flipped, D18 added, Phase 9 created):** page-local search ships on every list surface; nav search loses its list-filter side-effect and stays omni-only until the separate GS v2 project replaces it. PR step moved 8.5 → 9.6. Based on fe-research: 38 `globalSearchTriggered` consumers, single-writer/single-observer singleton, per-endpoint `search` param already universal. | One nav input serving as both omni-search and every list's filter is the conflation being retired; the redesign's toolbar Search button is its page-side replacement. |
| 2026-07-20 | **D11 extended to the whole program: ONE branch, ONE PR for phases 0–8** (WO + Parts + Reports rollout together). `/create-pr` moved from 5.6 to 8.5; Phase 5 is gates-only. | Ship the redesign atomically — no window where the app runs two filter designs in prod. |
| 2026-07-20 | Prefs route is `/api/users/me/preferences/{pageKey}` (earlier drafts said `/api/me/preferences/{key}`) | Matches the existing me-scoped route precedent `GET /api/users/me/signature-style` (`api/src/VehicleService/Inspections/UI/HTTP/SignatureStyle/GetSignatureStyleController.php`). Same semantics as G6; naming refinement only. |
| 2026-07-20 | `bin/smoke-test.sh` (referenced by root AGENTS.md gate 4) does **not** exist at the current checkout (`api/bin/` has only `console`, `schema-diff-debug.php`, `setup-pre-commit.sh`; the commit that added it is not reachable from HEAD) | Phase 5 must first `find . -name smoke-test.sh`; if still absent, fall back to a curl sweep over `bin/console debug:router` GET routes asserting no 500s, and report the missing script to the user. |
| 2026-07-20 | `ListingQuery::$status` / `ListingQueryDto::$status` (`#[Choice(['estimate','workOrders','completed','byStatus'])]`) is vestigial — never read by `ListingQueryHandler` | FE must NOT start sending `status=<newTabName>`; new tab names would fail the Choice validation. Tabs drive `filters[]`, not this param. Flagged so nobody "wires the tab" to it. |

### Plan-update protocol (binding on every executing agent)

1. **On completing a step:** tick its checkbox, update `Current phase` / `Status` / `NEXT ACTION` so a fresh session can resume in 30 seconds.
2. **On discovering the plan is wrong or insufficient:** update the affected steps AND append a row to the Decisions & deviations log **before writing any code**.
3. **On any scope-affecting discovery** (new files outside the plan's file list, a behavior change not covered by G1–G9/D10–D17, a Golden-Rule exemption): **STOP and surface to the user** per the Scope Drift rule in root `AGENTS.md`. Never auto-resolve.
4. Phase-end verification gates are not optional; do not start the next phase with a red gate.

---

## 2. Context & constraints

The Work Orders page top area (tabs + filters) is redesigned per the new Figma: tab set becomes **All / Estimates / Completed / My Work Orders**, and a new filter bar with five chips (Status, Customer, Lead Technician, Service Advisor, Asset on Site) replaces the By Status tab and the My Work Orders / Asset Here toggles. Filtering is real-time on desktop; state persists per-user server-side and is shareable via URL.

**Spec conflicts raised with the author 2026-07-26** (Confluence comment on the spec page). Each has a build-meanwhile answer — build these; if the spec text changes, log a deviation and adjust:

| # | Conflict in the spec | Build this meanwhile |
|---|---|---|
| 1 | Closing note says "URL wins on load, **then persists**"; the author's own comment says runtime-only | G7 as written: shared links never write to saved state (query included) |
| 2 | S10-R2 says "browser session"; S10-R3 + comments say per-user server-side | G6: server-side per user, cross-device, survives logout |
| 3 | S13-R14 (query retained across tabs) vs per-tab state for Reports/Parts (Key Decisions) | Query follows that page's filter scoping — shared across WO tabs, per tab where filters are per tab (D20) |
| 4 | S2-R1 lists Imported as a plain status; combining it with other chips is unimplementable | G1: Imported stays synthetic + mutually exclusive, other chips disabled |
| 5 | S14-R6 wants a per-page decision for surfaces losing search that aren't in S13-R22 (detail-page tabs, audit-log dialog) | Every consumer gets a control via the opt-out `Table.vue` input (Phase 9.1) |
| 6 | Parts lists a **Vendors** view with no Figma frame | Phase 6.2 requests the design; Phase 7.3 does not build without it |

**Spec baseline: v1.3** (Confluence link above). It covers all four workstreams this plan executes — Work Orders filters (Stories 1–12), Parts filters (8 views), Reports filters (~21 reports incl. the new date-range chip), **Page Search (Story 13)** and **Remove page filtering from global search (Story 14)**. Story/requirement IDs cited below (`S13-R7`, `S10-R4`, …) are from that page. If the spec version has moved past v1.3, re-read it before building and log any deltas.

### 2a. Decisions register (FINAL — do not reopen)

| ID | Decision |
|---|---|
| G1 | **Imported / Declined statuses — no change.** `imported` is NOT a WO status: it's a separate table + endpoint (`GET /api/work-orders-imported`, pagination+search only, no filters). It stays a synthetic, mutually-exclusive Status option that reroutes the fetch with all other chips disabled — byte-identical to today. `declined` stays FE-appended (excluded from `GET /api/work-orders/statuses` on purpose). No BE work on either. |
| G2 | **Tab set per Figma:** All / Estimates / Completed / My Work Orders. Current "Work Orders" and "By Status" tabs are retired; "My Work Orders" is promoted from toggle to tab (existing `showMyWorkOrders=1` param). |
| G3 | **Customer = company** (`work_order.company_id` — the grid's Customer column). `work_order.customer_id` is the contact person and is NOT the filter target. |
| G4 | **Asset on Site** = dropdown chip Yes / No / Clear selection on `work_order.is_vehicle_here`, replacing the "Asset Here?" toggle. Filtering "No" (`=0`) is new capability. |
| G5 | **Service advisors dropdown lists ACTIVE only.** The endpoint change shape is decided in Phase 0.4 (default: opt-in `activeOnly=1` param; existing consumers unchanged). NB the endpoint is location-scoped (see the docblock at `app/src/api/work-orders/queries.ts:108-112`) — advisor options change on location switch, which Phase 3.2's location handling relies on. |
| G6 | **Persistence = server-side MySQL, per user, cross-device, survives logout.** Generic `user_page_preference` table + `GET/PUT /api/users/me/preferences/{pageKey}`; localStorage retired for migrated pages. Redis rejected (sessions-only cluster; durable data doesn't belong in cache). Last-write-wins across devices. `pageKey` granularity = one per view/tab, not per route — see D20. |
| G7 | **URL filter state is runtime-only and NEVER written to saved prefs** — including manual filter changes made during a URL-entered visit. A "back to my saved filters" affordance restores saved state, strips the params, and re-enters normal (persisting) mode. Normal visits: load saved → apply → mirror to URL → persist every change (debounced). No userId/TTL in URLs. Applies to the search query too, now that it is persisted (D18). ⚠️ **Known wording conflict:** spec v1.3's closing note floats a precedence rule "(URL wins on load, then persists)" — the *then persists* half contradicts this row, which the spec author explicitly agreed to in page comments ("Yes it should, only at a runtime. It shouldn't replace them"). THIS row is authoritative; the conflict is raised for the author to reconcile in the spec text. |
| G8 | **Page/global search split — the PAGE half is IN this program.** Today one nav input is both an omni-search dropdown (navigates to entities) and every list's filter (via a `searchString` singleton fanned out by base `Table.vue` to ~38 consumers). This program gives pages their own local search inputs and removes the list-filter fan-out (Phase 9); the nav search keeps its omni-dropdown role unchanged. The GLOBAL half — the spotlight ⌘K modal — is a separate project with its own PRD: [Global Search v2](https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/576978945) (cross-entity, fuzzy, ranking; "Ready for engineering"). Dependency runs one way: this program must land page search before GS v2 replaces the nav dropdown. |
| G9 | **The Status chip IS the redesigned "By Status"** — dropdown of available statuses. Hidden on Estimates/Completed tabs (they pre-filter); shown on All + My Work Orders. |
| D10 | **Default tab = Estimates on first visit** (All stays first in tab ORDER per Figma — order ≠ default); last-used tab persists per user. Rationale: prod DB peaks at 80–100% of its ACU ceiling in business hours; the unfiltered All query (no status predicate + 3-table filesort) must not be the landing hot path. |
| D11 | **ONE branch, ONE PR for the entire program** (WO pilot + Parts + Reports rollout + search decoupling). `/create-pr` only at Phase 9.6. |
| D12 | Mobile ships in the same PR. |
| D13 | Straight replace, no feature flag. |
| D14 | Page-local "Search" toolbar button — **IN** (flipped 2026-07-20 when the search split joined the program): it is the page half of G8. Behavior contract in D18. |
| D15 | Mobile "All Filters" combined bottom sheet — **IN**, with an "Apply filters" button (batch-apply; deliberate difference from desktop real-time). Individual chips/sheets stay real-time. |
| D16 | Grid columns — **untouched** (the On Site column already exists; nothing reordered). |
| D17 | "Over Limit" badge (mobile Figma card) — **OUT** (per-WO calculation from the detail view; not list-fetchable without new BE aggregation). |
| D18 | **Page search — fully SPEC'D (Story 13 + 14, spec v1.3):** toolbar control per S13-R1–R6 (collapsed magnifier + "Search" text button → expands in place to 180px input, placeholder "Type to search", X-circle clear; exact colors/sizes in the spec, component frame `11829:8908`). Applies as-you-type, **debounced 300ms** (S13-R7; per-page override allowed, e.g. Inventory's existing 750ms). Sends the page's existing `search` request param (BE unchanged; the 4 client-side-filter tables use q-table `:filter`). Strictly page/table-scoped (S13-R9), per-tab on tabbed pages (S13-R11). **Additive AND with filters and cleared independently** (S13-R10/R13, S8-R5). **The query IS persisted per user exactly like filters** (S10-R4/R5) — this SUPERSEDES the earlier "not persisted" default; a restored query that matches nothing shows the empty state rather than being discarded (S10-N2). In URL state (S11-R4/R5; malformed → ignored, S11-N2). Desktop blur: empty collapses, non-empty stays expanded (S13-R15). Mobile: same inline expansion, no modal (S13-R16–R21). Page list = S13-R22; per-page searchable fields = S13-R23 (human-readable identifier columns; numeric/currency/date excluded — those are filters). |
| D22 | **Two searches, two mechanisms — deliberate for this program.** *Global search:* unchanged. It keeps its current design — one org-wide collection prefetched at app boot (`GET /api/global-search/fetch`, `staleTime: Infinity`), matched client-side, results navigate to a record. Do NOT re-architect, re-scope, or "improve" it here; the only change is that it stops filtering page lists (Story 14). *Page search:* real per-page record search — sends the page's existing `search` param to that page's listing endpoint (server-side), except the handful of small tables that already filter client-side via q-table `:filter`. **Forward note:** a later project moves searching to Elasticsearch (+ MySQL) and will likely unify both surfaces, with global search combining results across entities (see the separate Global Search v2 PRD). Build both sides behind thin seams — the kit's `PageSearchInput` emits a term and the page owns the request; `useGlobalSearch` stays a single composable — so the ES swap is a data-source change, not a UI rewrite. Nothing in this program should anticipate ES beyond keeping those seams clean. |
| D19 | **New chip type: date range** (spec v1.3 Parts + Reports sections, Key Decisions): start/end picker, **no presets, no default range**, applies immediately when the second date is picked, single range (not multi-select), URL form `range=custom&from=YYYY-MM-DD&to=YYYY-MM-DD`. Required by nearly every report and by Parts date columns (Date, Invoice date, Date received). Extends the kit's `FilterType` union — built once in Phase 2, consumed by Phases 7–8. |
| D20 | **Filter/search state is scoped per view AND per tab, not per page** (spec v1.3 Key Decisions): selections do not carry across Parts views, Report tabs, or sub-report tabs; each retains and restores its own. Implementation: the prefs `pageKey` is the view/tab identity (e.g. `parts-inventory`, `report-ar-aging-detail__summary-tab`), not the route alone. URL state likewise belongs to the active view/tab. |
| D21 | **Mobile toolbar changes required to fit the search field** (S13-R17–R19): the primary CTA stops stretching and uses hug width (e.g. "New Work Order" 144px, not 211px); pages with **two or more icon-only toolbar actions collapse them into a "more" kebab** on mobile (named in S13-R19: Inventory, Purchase Orders, Timesheet Activities, both Technician Efficiency reports, Sales Tax (Collected), plus any other page with 2+ icon actions). These are in scope wherever page search ships. |
| P1 | Index strategy: add `(workplace_id, type, company_id)` composite; further composites only on EXPLAIN evidence (0.2 concluded: none needed). `is_vehicle_here` stays unindexed (post-filter). |
| P2 | `FilterDecorator` `in` operator silently drops non-UUID values — multi-selects use repeated same-field `eq` instead (Phase 0.3). |

**Hard architectural requirements (this is phase 1 of the app-wide filter redesign; Parts and Reports pages follow in phases 6–8):**

1. Chips/dropdowns/mobile-sheets are **shared, config-driven components** under `app/src/components/ts/shared/filters/` — a filter is a data definition (key, label, icon, type, options source, visibility), not a bespoke component. A future page = a filter-defs array.
2. The prefs endpoint is **`page_key`-agnostic** (`user_page_preference` table, generic GET/PUT), reusable by every later list/report page.
3. The URL-sync + runtime-view semantics (G7) live in a **page-agnostic composable**, not inside `WorkOrders.vue`.

**Delivery constraints (D11): ONE branch, ONE PR for the entire program** — WO pilot AND the phase 6–8 rollout ship together. Mobile in the same PR (D12); straight replace, no feature flag (D13). Consequences the executing agents must respect: (a) phases 6–8 run on the same branch immediately after Phase 5's gates — `/create-pr` happens once, at Phase 9.6, as the program's single PR step; (b) the branch will be long-lived and large — rebase on develop regularly and keep the Execution State current, since multiple sessions will hand off mid-branch; (c) the final PR body must present the change per-area (WO / Parts / Reports) so reviewers can navigate it.

**Rollout scope rule:** for every non-WO page the work is the same recipe — swap the page's existing filter UI for the shared chip components (same visual/interaction contract as WO), wire `useFilterUrlSync` for shareable links, AND wire `usePagePreferences` with the page's own `pageKey` for per-user cross-device persistence — all three are mandatory on every rollout page, none is WO-only. **No new filter capabilities, no changed filter semantics** on those pages — what was filterable stays filterable, nothing more. All filter pages are believed covered in Figma; Phase 6.1's inventory verifies that, and any page found without a frame gets a design request before its batch (6.2).

**Out of scope (do not build even though visible in Figma frames or nearby code):** imported-listing filters (G1), the GS v2 spotlight search modal (separate PRD — see G8), grid column changes (D16), "Over Limit" badge (D17), any rework of the listing's default sort or addition of a COUNT query (pre-existing costs, owned by the separate search/listing-optimization track), `declined` promotion to the BE statuses endpoint (G1). (The suspected invoice-join fan-out was investigated and retired as not-a-bug — see §4.0.5.)

---

## 3. Design references

Figma file: [Working — ShopView App](https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App) (file key **`DR4gEODShYgJqkozs3mF5q`**, canvas "Filters"). Per-story node links are also embedded in the [Confluence spec](https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/572030978/Filters).

**Open any node in the browser:** `https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=<ID with : replaced by ->` — e.g. desktop selected state → [node-id=11854-26246](https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=11854-26246).

**Instruction to executing agents:** fetch the screenshot for the node you are about to build (Figma MCP `get_screenshot` with the file key + node id below) **at build time** — do not build UI from memory or from this table's descriptions alone.

| Component / screen | Node ID | Shows |
|---|---|---|
| Desktop — default state | `11854:24657` | Tab row + filter bar, no selections |
| Desktop — collapsed bar | `11854:25927` | Collapse toggle + active-indicator |
| Desktop — filters selected | `11854:26246` | Active blue chips, truncated labels, "Clear filters" link |
| Desktop — selected + collapsed | `11854:26564` | Collapsed state with active filters |
| Estimates tab state | `11972:32318` | Tab-specific bar (status chip hidden) |
| Status dropdown | `11854:24194`, `11854:24280` | Checkbox list + Clear selection |
| Technician dropdown | `11854:24452` | Search + list + checkmarks |
| Advisor dropdown | `11854:24553` | Search + list + checkmarks |
| Customer dropdown | `11854:19595`, `11842:14236` | Search + selected-as-tags + checkmarks + Clear selection |
| Asset on site dropdown | `11880:12460` | Yes / No / Clear selection |
| Mobile — list | `11857:31046` | Chip row above cards |
| Mobile — All Filters sheet | `11884:13689` | Combined accordion sheet + "Apply filters" button (D15) |
| Mobile — per-filter sheets | `11884:13719`, `11884:21065`, `11884:16160`, `11884:15582`, `11884:13940`, `11884:21271`, `11884:16695`, `11884:16383`, `11884:14296`, `11884:14811` | Individual bottom sheets per filter |
| Components — filter chip | `11829:2935` | Filter chip component spec |
| **Page search component** (Story 13) | `11829:8908` | The 4 states: collapsed button, expanded empty, expanded typed, mobile fill |
| **Parts filters** (section) | `11884:16885` | All Parts views' filter bars — Phase 7 |
| **Reports filters** (section) | `11903:10573` | All report filter bars incl. date-range chip — Phase 8 |

**Frames contain out-of-scope elements — do not build them:** any grid-column reordering (D16 — columns untouched), the mobile "Over Limit" badge (D17 — OUT). (The page-toolbar Search button IS in scope — D14/D18.)

---

## 4. Phases

### Phase 0 — Verification & decisions (no production code)

**Goal:** close the open performance and convention questions with evidence, so Phases 1–3 are mechanical. Everything here is recorded in the Decisions & deviations log.

#### 0.1 — DONE (2026-07-20): unfiltered All-tab EXPLAIN on prod

Executed against the prod reader (MySQL 8.0.42, largest workplace, 7,169 service WOs); full plan + interpretation in the decisions log. Outcome: the query rides the `(workplace_id, type, status, …)` composite, no table scan; the known temp-table + filesort for the 3-table ORDER BY is the accepted cost (D10 keeps it off the landing path). No surprise found; nothing to do.

#### 0.2 — DONE (2026-07-20): filter-selection EXPLAINs → composite decision

Executed on the same prod dataset; evidence in the decisions log. **Decision: NO extra tech/advisor composites.** Tech-only and advisor-only selections use the lone single-column indexes with row estimates matching true result sizes (staff are workplace-bound, so those indexes are inherently scoped). Customer-only showed badly skewed row estimates on the lone `company_id` index — confirming the `(workplace_id, type, company_id)` composite (Phase 1.4) is warranted. `is_vehicle_here` stays unindexed (post-filter). **One follow-up for Phase 1.4:** after the composite lands locally, re-run the customer-only EXPLAIN to confirm the new index is picked.

#### 0.3 FilterDecorator multi-value convention (P2)

Verified current behavior (`api/src/Shared/Infrastructure/Persistence/Listing/FilterDecorator.php`):
- Same-field filters are grouped and OR'd (`decorateQuery()` lines 37–55) — repeated `eq` on one field is a de-facto IN.
- `fromRequest()` lines 89–101: `operator=in` **silently drops every non-UUID value** (a status multi-select sent as `in` becomes `IN ()`), and converts UUID strings to bytes. Single `eq` UUID values are also auto-converted to bytes (lines 82–87).

**Recommended decision (adopt unless a test disproves it): send ALL multi-select filters as repeated same-field `eq` entries** — statuses as `filters[N][field]=status&filters[N][value]=estimate`, UUIDs as repeated `eq` too (auto byte-converted). No `in` operator anywhere on this page, no decorator change, zero blast radius on the other `FilterDecorator` consumers. The alternative — fixing the decorator to pass non-UUID scalars through `in` — is rejected: it changes shared infrastructure used by many endpoints for zero functional gain here (P2, §2a).

**Acceptance:** decision + rationale recorded in the log; Phase 1.8 includes the functional tests that pin this convention (repeated-eq ORs; `in`-with-non-UUIDs documented as dropped).

#### 0.4 Service-advisors active-only shape (G5)

`GET /api/service-advisors` (`api/src/Staff/Staff/Application/ServiceAdvisors/ListingQueryHandler.php`) currently has **no** active filter. The FE consumers (both via `serviceAdvisorsQueryOptions()` in `app/src/api/work-orders/queries.ts:113`):

1. `app/src/components/shared/OrderStatusCard.vue` — WO-detail advisor assignment dropdown.
2. `app/src/components/ts/reporting/ServiceAdvisorAnalysis.vue` — reporting filter over **historical** data; an inactive advisor may still own historical WOs, so hiding them there changes report reachability.

**Recommended decision: opt-in `activeOnly=1` query param** filtering `u.is_active = 1` (exact precedent: `clockableOnly` on `GET /api/technicians`, `api/src/Staff/Staff/Application/Listing/ListingController.php` / SV-8032; the `u.is_active = 1` predicate is already used at `api/src/Staff/Staff/Application/Listing/ListingQueryHandler.php:59`). Only the new filter-bar dropdown passes it; both existing consumers keep today's behavior. A global change is rejected unless the user explicitly confirms ServiceAdvisorAnalysis should hide inactive advisors — if you believe it should, that is a scope question: surface it, don't decide it.

**Acceptance:** decision recorded; if anything other than the opt-in param is chosen, it was confirmed with the user first.

#### 0.5 Invoice fan-out — RETIRED (not a bug)

Closed 2026-07-20 after verification. WO↔invoice is 1:1 by application invariant: `CreateCommand` (`api/src/Invoicing/Invoice/Application/HTTP/Create/CreateCommand.php:45`) rejects creation when `InvoiceFetcher::invoiceForWorkOrderExists()` finds an existing non-void invoice, and in practice the `void` status is unused (reverted invoices are deleted, not voided). So the listing's `LEFT JOIN invoice … status != 'void'` can never match more than one row per WO through any real flow; no fan-out, no ticket. (There is no DB-level unique constraint on `invoice.work_order_id` — the invariant is application-enforced — but that's a hardening nicety, not a bug.) No action.

**Phase 0 gate:** all five items have log entries; no code changed (`git status` clean).

---

### Phase 1 — Backend

**Goal:** ship the generic per-user prefs storage + endpoints, the WO listing whitelist extension, the composite index, and the service-advisors active-only option — fully tested. All new endpoint code follows the canonical DDD/hexagonal layout (be-implementer must load `api/.claude/reference/architecture.md`, `api-standards.md`, `application-layer.md`, `domain-modeling.md`, `database.md`). **Do not copy the legacy flat layout** of `Staff/Staff/Application/ServiceAdvisors/*` (controller inside `Application/`) for any new file — the mirror for new code is the Inspections module.

#### 1.1 `UserPagePreference` aggregate + repository

New sub-context `api/src/IAM/Preferences/` (IAM owns user account data; layered like `IAM/AccessControl` and `VehicleService/Inspections`). Mirror files: `api/src/VehicleService/Inspections/Domain/SignatureStyle/UserSignatureStyle.php` (per-user keyed aggregate), `UserSignatureStyleRepository.php` (port), `api/src/VehicleService/Inspections/Infrastructure/Persistence/Repository/Doctrine/SignatureStyle/DoctrineUserSignatureStyleRepository.php` + `UserSignatureStyle.orm.xml` (adapter + mapping).

Create:
- `Domain/UserPagePreference.php` — `AggregateRoot`; `TABLE_NAME = 'user_page_preference'`; fields: `Uuid $id` (surrogate PK), `Uuid $userId`, `string $pageKey`, `array $value` (Doctrine `json` type), `\DateTimeImmutable $updatedAt`. Static `create(Uuid $userId, string $pageKey, array $value, \DateTimeImmutable $now)`; `changeValue(array $value, \DateTimeImmutable $now)` (last-write-wins per G6 — no version/ETag).
- `Domain/UserPagePreferenceRepository.php` — port: `findForUser(Uuid $userId, string $pageKey): ?UserPagePreference`, `save(UserPagePreference $pref): void`.
- `Infrastructure/Persistence/Repository/Doctrine/DoctrineUserPagePreferenceRepository.php` + `UserPagePreference.orm.xml`. Mapping declares the unique composite index `user_page_preference__user_id_page_key_uniq (user_id, page_key)` (index names are globally unique across the schema — SQLite test constraint, see `database.md`). Register the mapping dir in `config/packages/doctrine.yaml` `mappings:` (new `IAM_Preferences` entry, same shape as the existing entries).

**Acceptance:** aggregate has no framework imports; repository port lives in Domain; PHPStan clean.

#### 1.2 Migration: `user_page_preference`

`api/migrations/Version<timestamp>.php`: table `user_page_preference` — `id BINARY(16) PK`, `user_id BINARY(16) NOT NULL`, `page_key VARCHAR(64) NOT NULL`, `value JSON NOT NULL`, `updated_at DATETIME NOT NULL`, unique key `user_page_preference__user_id_page_key_uniq (user_id, page_key)`. No FK unless the mapping declares one (keep mapping and migration in lockstep; hand-written FKs on plain-id columns go into `MANUALLY_MANAGED_FOREIGN_KEYS` — see `database.md`).

**Acceptance:** after `bin/console doctrine:migrations:migrate --no-interaction`, `bin/console doctrine:migrations:diff --allow-empty-diff` reports **"No changes detected"**.

#### 1.3 GET/PUT `/api/users/me/preferences/{pageKey}`

Route precedent: `/api/users/me/signature-style`. Auth: any authenticated user; **user identity comes exclusively from `AuthenticationContext::getUserId()`** (`App\Shared\Infrastructure\Security\AuthenticationContext`, as used in `GetSignatureStyleQueryHandler`) — never from the request. There is deliberately no `OrganizationDecorator`/`WorkplaceDecorator`: the tenancy boundary for this table **is** the user id; a 🔴 tenant-scoping reviewer question is pre-answered by this paragraph — the repository port only exposes `findForUser`-style methods that require the caller's own user id, so cross-user access is structurally impossible. State this in the PR body if the reviewer flags it.

Create (RequestDto in UI, pure Command/Query in Application — the RequestDto-vs-Command rule in `api/AGENTS.md`):
- `UI/HTTP/GetPagePreferenceController.php` — `GET /api/users/me/preferences/{pageKey}`, route name `users_me_page_preference_get`.
- `UI/HTTP/PutPagePreferenceController.php` — `PUT /api/users/me/preferences/{pageKey}`, route name `users_me_page_preference_put`.
- `UI/HTTP/DTO/PutPagePreferenceRequestDto.php` — implements `RequestPayload`; validates `value` present.
- `Application/Query/GetPagePreferenceQuery.php` + `Application/Handler/GetPagePreferenceQueryHandler.php`.
- `Application/Command/SavePagePreferenceCommand.php` + `Application/Handler/SavePagePreferenceCommandHandler.php` (upsert: find → `changeValue` or `create`; wrap in `\App\Shared\Application\Transactional`).
- `Application/DTO/PagePreferenceResultDto.php` — response DTO (never leak the entity).

Contract (unambiguous, FE builds against this):

```
GET /api/users/me/preferences/work-orders-list
  200 { "data": { "pageKey": "work-orders-list", "value": <json|null>, "updatedAt": "2026-07-20T10:00:00Z"|null } }
  (unset pref => value:null, NOT 404 — saves the FE a special case)

PUT /api/users/me/preferences/work-orders-list
  body: { "value": <arbitrary JSON object> }
  200 { "data": { "pageKey": "...", "value": {...}, "updatedAt": "..." } }
  400 on: pageKey not matching ^[a-z0-9-]{1,64}$, value not an object, or encoded value > 16 KB
```

`pageKey` validation and the size cap are endpoint-level (RequestDto/route requirement), keeping the storage generic but abuse-proof.

#### 1.4 Migration: composite index on `work_order`

Add `<index name="wo__workplace_type_company_id_idx" columns="workplace_id,type,company_id"/>` to `api/src/VehicleService/WorkOrders/Infrastructure/Doctrine/WorkOrder.orm.xml` (indexes block currently lines 51–73) + the matching migration (`ALTER TABLE work_order ADD INDEX ... (workplace_id, type, company_id)` — INPLACE online DDL). Add the tech/advisor composites **only if Phase 0.2 recorded that decision**.

**Acceptance:** migration applied locally; `doctrine:migrations:diff` back to no-op.

#### 1.5 Whitelist extension

`api/src/VehicleService/WorkOrders/Application/List/ListingQueryHandler.php` `$filterFields` (currently lines 83–97): add

```php
'tech_assigned_id' => ['field' => 'wo.tech_assigned_id'],
'service_advisor_id' => ['field' => 'wo.service_advisor_id'],
```

Note for the FE contract: the WO listing's `#[Filter(snakeCase: false)]` (`ListingQueryDto.php:24`) means the FE sends field names **verbatim** — `tech_assigned_id`, `service_advisor_id`, `company_id`, `status`, `vehicleHere` (that last one is camelCase by historical accident; keep it).

#### 1.6 `vehicleHere=0` path

Asset on Site "No" sends `filters[N][field]=vehicleHere&filters[N][value]=0` (operator eq). Trace: `FilterDecorator::fromRequest` passes `'0'` through as a string param; MySQL compares `is_vehicle_here = '0'` fine. Verify with the functional test in 1.8 (a WO with `is_vehicle_here = 0` is returned for value `0` and excluded for value `1`); fix the decorator/whitelist only if the test fails.

#### 1.7 Service advisors active-only

Implement the Phase 0.4 decision (default: `activeOnly` boolean query param on `api/src/Staff/Staff/Application/ServiceAdvisors/ListingController.php` → new field on `ListingQuery` → `->andWhere('u.is_active = 1')` in the handler when set). This module is legacy-flat; **extend it in place** (param + predicate) rather than rewriting its layout — a layout migration is scope drift.

**Regression consumers to keep green:** `OrderStatusCard` and `ServiceAdvisorAnalysis` FE flows (no param → unchanged result set), plus any Pest tests under `tests/` touching `service_advisor_list`.

#### 1.8 Tests + phase gate

Pest tests (PHPUnit class-based syntax; functional tests hit the DB):
- **Functional — prefs endpoint:** GET unset → `value:null`; PUT then GET round-trip; PUT overwrites (updatedAt advances); invalid pageKey → 400; oversized value → 400; unauthenticated → 401; user A cannot read user B's pref (two users, same pageKey, isolated values).
- **Functional — WO listing filters:** repeated-eq `status` values OR'd; `tech_assigned_id` + `service_advisor_id` repeated-eq (UUID→bytes conversion) return the right WOs and AND across fields; `vehicleHere=0` per 1.6; non-whitelisted field still rejected (`FilterException`).
- **Unit — decorator convention pin (per 0.3):** grouped same-field eq builds an OR expression; `in` with non-UUID values yields the documented drop behavior (this test is the trap's documentation).
- **Functional — service advisors:** `activeOnly=1` excludes `u.is_active = 0` staff; absent param includes them.

**Phase 1 gate (all must pass before Phase 2):**
1. `composer cs-fix`, `vendor/bin/phpstan analyse <changed files>`, `./vendor/bin/pest <new/changed tests>` — exit 0.
2. Migration gate: migrations applied; `doctrine:migrations:diff --allow-empty-diff` → "No changes detected".
3. Smoke: `bin/smoke-test.sh` if present (see deviations log — likely absent; fall back to curling `GET /api/work-orders`, `GET /api/service-advisors`, `GET /api/users/me/preferences/work-orders-list` authenticated + a sweep of curated GET routes, asserting no 500) and `tail -n 50 api/var/log/dev.log` free of fatals/exceptions.
4. E2E factory awareness: BE controllers changed → note for the Phase 9.5 E2E ask (curator will likely route prefs as factory-only).

---

### Phase 2 — FE shared filter system

**Goal:** the reusable, config-driven filter kit — components, types, prefs API module, URL-sync composable — with zero WO-page-specific knowledge baked in. fe-implementer must read `app/docs/patterns/base-wrappers.md` (padding + `data-test-id`/`-suffix` precedence) and `vue-query.md` (error contract) before writing code. All Golden Rules apply; the ones this phase will trip over if ignored: GR#3 (`<script lang="ts" setup>` only), GR#7 (v-model single-emit), GR#8 (base wrappers — `Button`/`Input`/`Select`, never `q-btn`/`q-input`/`q-select`), GR#5 (`data-test-id` snake_case on every meaningful interactive element), GR#10 (no `as`/`unknown`/`any`), GR#4 (type location).

#### 2.1 `app/src/components/ts/shared/filters/Model.ts`

The config contract (illustrative — exact naming may be refined, shape may not):

```ts
export type FilterOption = { value: string; label: string };

export type FilterType = 'multi' | 'multi-search' | 'single-boolean';

export interface FilterDef {
  key: string;                   // filter identity == request field name (e.g. 'status', 'tech_assigned_id')
  label: string;                 // chip label ('Status', 'Lead Technician', ...)
  icon?: string;
  type: FilterType;
  // sync options (status) or async loader (tech/advisor/customer). Server-side
  // search loaders receive the term; static loaders ignore it.
  options: FilterOption[] | ((searchTerm: string) => Promise<FilterOption[]>);
  visible?: () => boolean;       // per-tab visibility (G9) — evaluated reactively by the bar
  disabled?: () => boolean;      // imported-exclusivity (G1)
  exclusiveValues?: string[];    // values that clear/lock the other selections (e.g. 'imported')
}

// One page's live selections. single-boolean uses '1'/'0' as the single element.
export type FilterState = Record<string, string[]>;
```

These are component-local types (GR#4) — the API contract types (prefs payload) live in `src/api/preferences/Model.ts` (2.4).

#### 2.2 Chip + panels

Create under `app/src/components/ts/shared/filters/`:
- `FilterChip.vue` — the pill: inactive/active (blue) styling per Figma node `11829:2935`, label + selected-values truncation (reuse the `selectedOptionsTrimmed` approach from `app/src/components/ts/shared/MultipleToggleSelect.vue:116-137`), opens its panel in a `q-menu`. Props `def: FilterDef`, `modelValue: string[]`, emits `update:modelValue` only (GR#7). `data-test-id`: `filter_chip_<key>`.
- `FilterOptionListPanel.vue` — checkbox list + "Clear selection" (Status; Figma `11854:24194`/`11854:24280`). Item test-ids `filter_option_<key>_<value>`.
- `FilterSearchListPanel.vue` — `Input` for search (debounced, drives the async loader), selected-as-tags, checkmarked list, "Clear selection" (Customer/Tech/Advisor; Figma `11854:19595`, `11854:24452`, `11854:24553`). Loading state while the loader is in flight.
- `FilterYesNoPanel.vue` — Yes / No / Clear selection (Figma `11880:12460`).

Panels are chosen by `def.type`; `FilterChip` owns the menu, panels own the content. Selected-value resolution (UUID→name for chip labels) uses the loaded options; a selected UUID absent from loaded options is silently dropped from display AND from the next emitted state — this doubles as the drop-deleted-values mechanism required by spec S10-N1/S11-R3 (deleted customer in saved/shared state → silently ignored).

#### 2.3 `FilterBar.vue`

Props: `filters: FilterDef[]`, `modelValue: FilterState`, `collapsed: boolean`, `sharedViewActive: boolean`. Emits: `update:modelValue`, `update:collapsed`, `clear-filters`, `exit-shared-view`. Renders: visible chips in def order, "Clear filters" link (visible when any selection; test-id `clear_filters`), collapse toggle (test-id `toggle_filter_bar`) with active-indicator dot when collapsed with selections (Figma `11854:25927`/`11854:26564`), and the "back to my saved filters" affordance when `sharedViewActive` (G7; test-id `back_to_saved_filters`). Desktop is real-time: every panel change emits immediately.

#### 2.4 Prefs API module + composable

- `app/src/api/preferences/Model.ts` — `PagePreference<T> { pageKey: string; value: T | null; updatedAt: string | null }` (API contract type, GR#4).
- `app/src/api/preferences/index.ts` — `preferencesApi`: `fetch(pageKey)` → `GET users/me/preferences/{pageKey}`, `save(pageKey, value)` → `PUT ...` (uses `{ $axios }` from `@/boot/axios`, returns `AxiosResponse<ResponseData<...>>` — see `docs/patterns/api-services.md`). Export via the `@/api` barrel.
- `app/src/composables/usePagePreferences.ts` — `usePagePreferences<T>(pageKey, defaults)`: `load(): Promise<T>` (fetch, fall back to `defaults` on error/null — **must not block the page forever**; a failed prefs fetch degrades to defaults and reports via the axios interceptor), `save(value: T)` debounced (~500 ms trailing, flush on `onBeforeUnmount`), and a `suspended` switch the URL-sync composable flips so **shared-view mode never persists** (G7). This is per-user server state consumed once at page setup + written imperatively — a plain api-service composable, not a `useQuery` (nothing observes it reactively; document this classification choice in the composable's docblock referencing `vue-query.md`'s server-state rule so a reviewer sees it was deliberate).

#### 2.5 `app/src/composables/useFilterUrlSync.ts`

Page-agnostic G7 semantics over `app/src/utils/routeQuery.ts` (`toArrayParam`, `replaceQuery`):
- On setup: if the entry URL carries any recognized filter params → **shared-view mode** (`sharedViewActive = true`): apply URL state as the runtime view; suspend persistence (via 2.4's switch) for the whole visit including mid-visit edits; keep reflecting edits into the URL.
- No params on entry → normal mode: apply saved state, mirror to URL (arrays as repeated keys, omit defaults/empty), persist every change.
- `exitSharedView()`: restore saved state, strip filter params from the URL (`replaceQuery`), re-enable persistence.
- Malformed values → ignore that param (S11-N1); values are validated by the same options-resolution drop in 2.2.

#### 2.6 Vitest

Location: `app/src/components/ts/shared/filters/tests/*.spec.ts`, `app/src/composables/tests/*.spec.ts` (patterns per `docs/patterns/unit-testing.md`; `render` from `@/testing`, `screen.getByTestId`, MSW for the prefs endpoints in `handlers.ts`).
- Chip: renders label; active state + truncation with selections; emits `update:modelValue` (spy pattern).
- Panels: option toggle round-trip; Clear selection; search-list loader called with term; yes/no single-value semantics.
- Bar: visibility rules (`visible()` false hides chip); clear-filters emits; collapse toggle; shared-view affordance shown/hidden.
- `usePagePreferences`: load fallback on error; debounced save (fake timers); suspended mode never calls the API.
- `useFilterUrlSync`: params-on-entry → shared-view + no saves; normal mode mirrors to URL; exit restores + cleans URL.

**Phase 2 gate:** `npx eslint --max-warnings=0 <changed files>`, `npx vitest related --run <changed files>` + `npx vitest run <new spec files>`, `npx vue-tsc --noEmit` — all exit 0. `cd e2e && npx tsx scripts/e2e-precheck.ts --files=<new .vue files> --pretty` → no missing test-ids. Compile gate: FE dev server up per root `AGENTS.md` probes, no Vite errors.

---

### Phase 3 — WO page integration (desktop)

**Goal:** `WorkOrders.vue` consumes the Phase-2 kit; tabs restructured; persistence and URL semantics live. This is the highest-blast-radius phase — `WorkOrders.vue` is 1,874 lines; every removal below is verified against current line refs.

#### 3.1 Tab restructure (G2, G9, D10)

In `app/src/pages/WorkOrders.vue`:
- Replace the `q-tabs` block (lines 4–22) with **All / Estimates / Completed / My Work Orders** (`all` / `estimate` / `complete` / `my`), All first in order; test-ids `tab_all`, `tab_estimates`, `tab_completed`, `tab_my_work_orders`.
- Retire: the `status` tab + `MultipleToggleSelect` usage (lines 24–40), the `workorders` tab, both `q-toggle`s (`toggle_my_work_orders` lines 45–57, `toggle_asset_here` lines 59–71). Do **not** delete `MultipleToggleSelect.vue` itself (other pages may use it — check consumers before any removal; removal is scope drift).
- `setStatusFilters()` (lines 1447–1469) is replaced by tab semantics: `all` → no baked status; `estimate` → `['estimate']`; `complete` → `['complete']`; `my` → no baked status + `showMyWorkOrders=1` (existing request param, store action `workorders/fetch` at `app/src/store/ts/work-orders/actions.ts:54` already forwards it). Drop the dead `hold`/`workorders` cases.
- Default selected tab on first visit (no saved pref): **`estimate`** (D10 — order ≠ default). Last-used tab persists via the pref (3.3).
- Do NOT send the vestigial `status` request param (see deviations log).

Story 9 reconciliation: one `statusFilters` source of truth feeding both the status chip and the request; switching to Estimates/Completed hides the status chip (G9: `visible: () => tab is all|my`) and the user's chip selections are **retained in memory, not applied** while hidden (S9-R5) — reapplied when returning to All/My WO.

#### 3.2 Chip wiring

- Build the `FilterDef[]` for the page (component-local, in `app/src/components/ts/work-orders/` model or inline module): Status (`multi`, options from `statusesQueryOptions()` + synthetic `declined`/`imported` exactly as today, `exclusiveValues: ['imported']` reusing `getStatusFiltersWithExclusivity` from `@/utils`), Customer (`multi-search`, loader → `companiesApi` `customers/list-options` with server-side search — `app/src/api/companies/index.ts:101`), Lead Technician (`multi-search`, loader → `techniciansQueryOptions(true)` i.e. `clockableOnly=1`, filtered client-side by term — already active-only + location-scoped), Service Advisor (`multi-search`, loader → `serviceAdvisorsQueryOptions()` **extended to pass `activeOnly=1`** — add the param to `workOrdersApi.fetchServiceAdvisors` + the query options with an optional arg so `OrderStatusCard`/`ServiceAdvisorAnalysis` are untouched), Asset on Site (`single-boolean` → `vehicleHere` `'1'`/`'0'`).
- Extend `getFilters` (currently lines 953–967) to map `FilterState` → the request `filters[]` array: every selected value becomes `{ field, value }` repeated-eq (Phase 0.3 convention). Field names verbatim: `status`, `company_id`, `tech_assigned_id`, `service_advisor_id`, `vehicleHere`.
- Imported (G1): `isFilteredByImported` (line 889) stays the fork to `workorders/fetchImported`; while active, all other chips render disabled (`disabled` def hook) with the existing tooltip copy; behavior byte-identical to today's toggles-disabled state.
- Location switch (`subscribeToLocation`, line 1570) keeps triggering a refetch; tech/advisor loaded options are location-scoped (`staleTime: 0` already) — chip selections referencing staff not in the new location naturally drop via the 2.2 resolution rule.

#### 3.3 Persistence migration (G6)

- Pref key: **`work-orders-list`**. Value = the whole page state (superset of today's v1.4 blob): `{ tab, filters: FilterState, collapsed, columns: Record<string,boolean>, sortBy, descending }`. Type in `src/api/preferences/Model.ts`? No — the page-state shape is page-owned: define `WorkOrdersListPreference` in `app/src/components/ts/work-orders/WorkOrdersBoardModel.ts` and pass it as the generic to `usePagePreferences`.
- Startup sequencing: `await prefs.load()` (returns defaults on any failure) **before** the first `loadData()` on both desktop (`onMounted`, line 1567) and mobile (`onMobileLoad`, line 1217 — the infinite-scroll entry point). The synchronous setup-top-level localStorage read (`checkLocalStorageVersion`/`setStoredWorkOrders`, lines 1563–1565) is removed. Render immediately with defaults while loading (table shows its loading state; do not double-fetch: first list fetch waits for prefs, they don't race).
- One-time migration nicety: on load, if the pref is null and a valid `workOrders` v1.4 localStorage blob exists, seed the pref from it, `PUT` it, then `removeLocalStorage('workOrders')`. Field mapping (defined here so no executor guesses):

| Old v1.4 blob field | New pref field |
|---|---|
| `storedShowMyWorkOrders` truthy | `tab: 'my'` (takes precedence over `storedSelectedTab`) |
| `storedSelectedTab` `'estimate'` / `'complete'` | `tab: 'estimate'` / `'complete'` |
| `storedSelectedTab` `'workorders'`, `'status'`, `'hold'`, anything else | `tab: 'all'` |
| `storedSavedByStatusFilters` | `filters.status` (the chip selections; normalize through the imported-exclusivity gate on load — `imported` survives only if it was the sole value) |
| tab-baked `storedStatusFilters` | dropped (tabs now own that) |
| `storedVehicleHere` truthy | `filters.vehicleHere: ['1']` |
| column map / `storedSortBy` / `storedDescending` | `columns` / `sortBy` / `descending` 1:1 |
| (no old equivalent) | `collapsed: false`; customer/tech/advisor filters empty | Delete the localStorage read/write plumbing: `WORK_ORDERS_VERSION`, `workOrdersToStore` (lines 924–942), `setStoredWorkOrders` (1471–1505), `checkLocalStorageVersion` (1507–1511), the `setLocalStorage` calls in `resetAndFetchNewData` (1214), `handleToggleSelected` (1297–1299), `onSelectNewTab` (1444), and the `getLocalStorage` sort reads inside `loadData` (1112–1118 — sort now comes from the loaded pref).
- Saves: every state change in normal mode → `prefs.save(...)` (debounced by 2.4); shared-view mode saves nothing (composable-enforced).
- Column selection + sort keep working exactly as today, just persisted in the pref instead of localStorage.

#### 3.4 URL sync (G7)

Wire `useFilterUrlSync` with the five filter keys + `tab`. Normal visits mirror state to the URL; URL-entered visits are fully runtime-only with the `back_to_saved_filters` affordance in the bar (exit restores saved state + cleans URL). Omit defaults (empty selections, default tab) from the URL.

#### 3.5 Empty state (S8-R3/R4)

Desktop: `Table` `noDataLabel`/no-data slot override — "No work orders match your filters" + a clear-filters action (test-id `empty_state_clear_filters`) shown only when filters are active. Mobile block (line 506–512) gets the same treatment in Phase 4.

#### 3.6 Tests + gate

Vitest (`app/src/pages/tests/WorkOrders.spec.ts` — extend/replace existing specs; MSW handlers for prefs + listing):
- Tab → request mapping (all/estimate/complete/my incl. `showMyWorkOrders`).
- Chip state → `filters[]` payload (repeated-eq, field names, vehicleHere '0').
- Status chip hidden on Estimates/Completed, selections retained (S9-R5).
- Imported exclusivity: fork to fetchImported + chips disabled.
- Prefs: load-before-first-fetch order; seed-from-localStorage migration; debounced save on change; no save in shared-view mode.
- URL entry → shared view; exit affordance restores.

**Phase 3 gate:** FE static gates (as Phase 2) + compile gate + **desktop browser-walk**: log in via Dev Mode quick-login (`QUICK_LOGIN_USERS` admin), walk: default tab Estimates on first visit (clear the pref first) → select statuses/customer/tech/advisor/asset combinations → verify grid narrows in real time and network shows repeated-eq `filters[]` → reload restores state (now from the API) → open in a second browser profile to confirm cross-device (same account) → paste a URL with params into a fresh tab → verify runtime-only + "back to my saved filters". Console free of red errors. Also re-check `e2e-precheck` on `WorkOrders.vue`.

---

### Phase 4 — Mobile (D12, D15, S12)

**Goal:** the mobile variant per Figma, sharing the Phase-2 defs and state — only presentation differs.

Create under `app/src/components/ts/shared/filters/` (lazy-loaded via `defineAsyncComponent` — GR#6; bottom sheets follow the existing `q-dialog position="bottom"` precedent from inspections, and are **not** form dialogs, so `BaseFormDialog` does not apply — note this deliberate GR#9 boundary in the component docblock):
- `MobileFilterChipRow.vue` — horizontally scrollable chip row (Figma `11857:31046`): leading "All Filters" chip (test-id `filter_chip_all_filters`) + one chip per visible def. **No collapse toggle on mobile** (S12-R4).
- `MobileAllFiltersSheet.vue` — combined sheet titled "All Filters" (Figma `11884:13689`): the 5 filters as accordion rows (`q-expansion-item` is fine — not one of the four wrapped primitives), local draft state, **"Apply filters" button** (test-id `apply_filters`) that batch-applies the draft to the page state on tap — the deliberate D15 difference from desktop real-time. Cancel/X discards the draft.
- `MobileFilterSheet.vue` — single-filter bottom sheet (Figma `11884:*` nodes), reusing the Phase-2 panels; applies per D15: individual sheets stay **real-time** (S12-R2) — only the combined sheet batches.

`WorkOrders.vue`: mobile branch (`$q.screen.lt.md` / existing `screen.gt.sm` checks) renders the chip row above the card list; the mobile empty-state block gets the clear-filters prompt (3.5). Mobile keeps the existing sort menu button untouched.

Vitest: chip row renders defs; All-Filters sheet drafts locally and applies only on button tap; per-filter sheet applies immediately.

**Phase 4 gate:** FE static gates + compile gate + **mobile-viewport browser-walk** (devtools device emulation ~390×844): chip row scrolls, All Filters sheet batch-applies, per-filter sheet is real-time, no collapse toggle, empty state prompt works. `e2e-precheck` clean on all new/modified `.vue` files.

---

### Phase 5 — WO verification (gates only; PR happens once at Phase 9.6 per D11)

Run the Definition of Done gates from root `AGENTS.md`, in order. Numbering below = checklist items 5.1–5.4. The E2E ask and `/create-pr` are NOT run here — they happen once for the whole program at Phase 9.5/9.6 (notes below). After 5.4 passes, proceed to Phase 6 on the same branch.

1. **Static gates, scoped to every file changed on the branch.** BE: `composer cs-fix`, `vendor/bin/phpstan analyse <files>`, `./vendor/bin/pest <tests>`. FE: `npx eslint --max-warnings=0 <files>`, `npx vitest related --run <files>` + changed specs, `npx vue-tsc --noEmit`. All exit 0.
2. **Migration gate:** both migrations applied; `bin/console doctrine:migrations:diff --allow-empty-diff` → "No changes detected".
3. **Compile gate:** FE probe `curl -sf -o /dev/null -w 'FE %{http_code}\n' http://localhost:7200`; check quasar/Vite output for errors per root `AGENTS.md` (docker vs native mode rules there).
4. **Endpoint smoke:** `bin/smoke-test.sh` (+`--warmup` after cache:clear) **if present** — see deviations log: it is missing at plan time; use the fallback documented there and tell the user. Then BE log check (`docker compose logs --tail=50 php-fpm | grep -iE 'fatal|exception'` or `tail -n 50 api/var/log/dev.log`) — empty.
5. **Browser-walk** desktop + mobile viewport with `QUICK_LOGIN_USERS` (admin, then tech for the My Work Orders tab), covering the Phase 3 + Phase 4 walk scripts. Report what was tested and how to reproduce.
**Deferred to Phase 9.5 (E2E ask):** single `AskUserQuestion` — "Quality gates green. Start E2E coverage creation for this branch now? (default: yes)". The branch is UI-affecting (Vue pages/components + BE controllers), so the `fe-e2e-coverage-check` CI check applies. Known E2E collateral: `e2e/src/pages/work-orders/work-orders.page.ts` references the retired `toggle_my_work_orders` test-id (line 94 — the only retired id in `e2e/src/`; the other retired ids appear only in `app/src/pages/tests/WorkOrders.spec.ts`, already covered by 3.6) and must be updated; the curator should also see the new prefs endpoints (likely factory-level only).
**Deferred to Phase 9.6 (PR):** `/create-pr` (single PR, D11). PR body must include: the FilterDecorator convention note, the "no tenant decorator on user_page_preference — user-id-scoped by design" rationale (see 1.3), and the E2E coverage block or override per policy.

---

### Phases 6–8 — App-wide rollout (same branch, immediately after Phase 5 gates)

**Goal:** every filter page in the app on the shared chip design, with shareable-link filter state AND per-user persisted filters (own `pageKey` per page). Existing filter semantics per page are preserved exactly — this is a UI + URL-state + persistence adoption, not a filter-capability change.

**Phase 6 — Inventory & design gaps (one session, read-only + plan update):**
1. Enumerate every page in `app/src/pages/**` + `app/src/components/**` that renders filter controls (Selects/toggles/date-ranges driving a list/report query). Known starting set beyond Parts/Reports frames: Parts `Inventory.vue` filter row, report pages on `useReportUrlSync` / `useSimpleReportFilter`, `ScheduleControls`, and whatever the sweep finds (Customers, Invoicing, Purchasing lists…).
2. Build the **rollout matrix** (append below as §4.6-M): page → current filter controls → Figma frame ID (from the board's Parts/Reports sections, or MISSING) → target batch → notes (page-specific quirks, e.g. date-range filters that need a chip type the WO kit doesn't have yet).
3. Any MISSING design → collect into one design request for the spec author; a page without a design does not enter a batch.
4. **New chip types discovered** (e.g. date-range, numeric-range) are extensions to the shared kit (`FilterDef` type union) — design them once, in the first batch that needs them, and log in the deviations table.

**Phase 7 — Parts batch(es):** per-page recipe below; frames `11894:21846`, `11902:8517`, `11902:9736`, `11902:9852`, `11903:10067`, `11903:10188`, `11903:10312`/`11903:10461` (+ `11902:9973` Part type dropdown component).

**Phase 8 — Reports batches:** ~24 frames under the board's Reports section. **Coordinate with the reports-suite track first** (it owns those pages' specs and several are being rebuilt — adopting filters on a page that track is about to replace is wasted work; agree page-by-page who ships what).

**Per-page adoption recipe (the unit of work for every rollout page):**
1. Fetch the page's Figma frame (get_screenshot) — build to it.
2. Express the page's existing filters as a `FilterDef[]` array (no semantic changes; map each existing control to a chip type).
3. Replace the old filter UI with `FilterBar` (date columns → the D19 date-range chip); wire `useFilterUrlSync` (link sharing, G7 semantics) and `usePagePreferences` with the **view/tab-level** `pageKey` (D20); add `PageSearchInput` per Story 13/D18 (same `search` param the page already sends; `:filter` binding for client-side tables) and drop the page's `globalSearchTriggered` listener; apply the D21 mobile toolbar rules (CTA hug width; kebab-collapse if the page has 2+ icon-only actions).
4. Remove the superseded page-local URL/persistence code (e.g. that page's `useReportUrlSync` wiring) — one pattern app-wide, no parallel mechanisms.
5. Gates: scoped static gates + browser-walk of the page (filter, share a link, reload). E2E ask per policy if specs cover the page.
6. Tick the page in the rollout matrix; commit per batch on the program branch (no per-batch PRs — single program PR at 8.5).

---

### Phase 9 — Search decoupling + program verification & PR

**Goal (spec Story 14):** the nav search stops filtering page lists — S14-R2/R3 require the code path and any carrying state/URL params to be **removed, not flagged or left dormant** — while it keeps its omni-dropdown/navigation role (later replaced by the separate [Global Search v2 PRD](https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/576978945)). Every list that used it has its own input first (S14-N1: page search is a hard prerequisite, so 9.1 lands before 9.2). Verified current state (fe-research 2026-07-20, line refs current then):

- Writer/observer discipline is clean: `GlobalSearch.vue` is the only writer of the `searchString` singleton (`app/src/composables/useGlobalSearch.ts:50-52`); base `Table.vue:175` is the only observer, re-emitting `globalSearchTriggered` to **38 consumer components** (~41 sites) — full inventory in the research report; each keeps a local `search` ref and sends the per-endpoint `search` param (4 exceptions filter client-side via q-table `:filter`: `Workplaces`, `AdjustmentTemplates`, `CustomerDefaultAdjustmentsTab`, `UnpaidTransactionsTable`).
- The consumers are NOT only list pages: detail-page tabs (`GenericNotes` on WO/Customer detail, `WorkOrderHistory`, customer/vendor transaction tabs) and one dialog (`AuditLogDialog`) also listen — they must keep a search affordance after decoupling.
- The omni-dropdown half (`GET /api/global-search/fetch`, entity navigation, ⌘K, history, `invalidateSearchData` callers) is untouched by this phase.

**9.1 Base-Table built-in search.** Add an opt-out search input to `app/src/components/forms/Table.vue` (rendered in its top slot area; `data-test-id` `input_table_search`; debounce per D18; emits/wires exactly like today's `globalSearchTriggered` so consumer code changes are minimal — ideally none beyond removing the nav dependency). This covers every consumer that is not on the filter-bar redesign, including the detail-page tabs and `AuditLogDialog`. Redesigned pages (WO, Parts, Reports batches) suppress it — they have the toolbar `PageSearchInput` from their phases.

**9.2 Remove the fan-out + nav cleanup.** Delete `Table.vue:175`'s `searchString` watch and the `globalSearchTriggered` emit path once all consumers have a local input; in `GlobalSearch.vue` remove the now-pointless route-keyed Inventory debounce (`:input-debounce` route check, line 17) and the blur-placeholder hack (lines 168-172 — it existed to show the active *list* filter, which no longer exists). Keep `select_global_search` test-ids, ⌘K, clear-on-focus, analytics.

**9.3 E2E rework.** `e2e/src/pages/parts/inventory.page.ts` and `catalog.page.ts` drive list filtering through `.global-search input` — move to the page inputs; same for the `work-order.spec.ts` type+Escape flow (~line 2918). `e2e/src/pages/navigation/global-search.page.ts` and the two permission specs test the omni-dropdown and survive unchanged.

**9.4–9.6** Program-wide final gates (rerun Phase 5's gate battery across ALL changed files/pages), the mandatory E2E ask, and `/create-pr` — see the Phase 5 deferred notes for the E2E/PR content requirements.

**Phase 9 gate:** typing in the nav search filters NO list anywhere (spot-check WO, Inventory, a customer detail tab, AuditLogDialog); every checked list filters via its own input; omni-dropdown still navigates; full static gates green.

---

## 5. Testing strategy

| Layer | What | Where |
|---|---|---|
| Pest functional | Prefs endpoint contract + cross-user isolation; WO listing repeated-eq/UUID/vehicleHere=0 filter behavior; whitelist rejection; service-advisors `activeOnly` | `api/tests/Functional/...` mirroring `IAM/Preferences`, `VehicleService/WorkOrders/Application/List`, `Staff/.../ServiceAdvisors` |
| Pest unit | FilterDecorator convention pin (OR-grouping; `in` non-UUID drop documentation) | `api/tests/Unit/Shared/...Listing/` |
| Vitest | Filter kit components (chip/panels/bar), `usePagePreferences`, `useFilterUrlSync`, WO page wiring (tab→request, chip→filters[], persistence sequencing, shared-view mode, imported exclusivity), mobile sheets (batch vs real-time) | `app/src/**/tests/*.spec.ts`, MSW handlers for prefs + listing |
| Browser-walk | Real-time filtering, cross-device persistence, URL share semantics, mobile sheets — the things unit tests can't see | Phase 3/4/5 gates, `QUICK_LOGIN_USERS` |
| Playwright | Decided by the test-curator at the Phase 9.5 ask; the `work-orders.page.ts` update for the retired `toggle_my_work_orders` id is mandatory regardless | `e2e/` |

Do not duplicate a scenario across frameworks (Vitest > Cypress > Playwright preference); no new Cypress specs — existing WO Cypress specs that break on retired test-ids get updated, not extended.

## 6. Risks & watch-items

1. **FilterDecorator `in` trap** (`FilterDecorator.php:89-101`): any future agent "helpfully" switching the FE to `operator=in` for statuses silently empties the filter. The Phase 1.8 unit test is the tripwire; the convention is repeated-eq (Phase 0.3).
2. ~~Invoice LEFT JOIN fan-out~~ — retired: verified not a real bug (1:1 by application invariant, see §4.0.5). No duplicate-row baseline exists.
3. **Startup sequencing race:** the old page read localStorage synchronously; the new page awaits a network call before the first list fetch. Guard rails: defaults-on-failure in `usePagePreferences.load()`, no unconditional spinner deadlock, and the Vitest ordering test (3.6). Watch for double-fetch regressions (prefs resolving after a user's first manual interaction — last interaction wins, never replay stale prefs over user input).
4. **Imported-status interplay:** `imported` forks to a different endpoint with chips disabled (G1). Every new code path (URL sync, prefs restore, mobile batch-apply) must route through the same exclusivity gate (`getStatusFiltersWithExclusivity`) or a saved/shared state containing `imported` + other filters becomes representable. Normalize on load, not just on click.
5. **`WorkOrders.vue` blast radius:** 1,874 lines with mobile infinite-scroll, column selection, sort quirks (`invoicedDate` special-casing in `resetAndFetchNewData` lines 1174–1207) that must survive the refactor byte-identically. Touch the fetch plumbing minimally; the redesign is the top area, not the table.
6. **Shared-component regression surface:** `MultipleToggleSelect` stays (other consumers); `serviceAdvisorsQueryOptions`/`fetchServiceAdvisors` gain an optional param — `OrderStatusCard` + `ServiceAdvisorAnalysis` must remain behaviorally unchanged (their specs are the tripwire).
7. **`bin/smoke-test.sh` missing at HEAD** (deviations log) — Phase 1/5 smoke gates need the fallback until resolved.
8. **Index migration on prod:** both new indexes are INPLACE online DDL on `work_order` (large table) — still coordinate the deploy window like any large-table DDL; note it in the PR.
9. **Search-split blast radius is wide but enumerated:** 38 consumers incl. detail tabs and a dialog — the §Phase 9 inventory is the checklist; missing one leaves a table that silently lost its only search. The 9.1 built-in Table input is the safety net (opt-out, not opt-in, precisely so nothing is forgotten).
10. **G7 precedence wording in the spec (open):** spec v1.3's closing note floats "URL wins on load, then persists" — the persist half contradicts the agreed runtime-only rule. Build G7 as written; `useFilterUrlSync` is the single place that would change if the author re-decides. Do not implement the spec-note variant without a register update.
11. **Story 14 is an app-wide sweep, not a per-module check (S14-R5/R6):** global search must stop altering the record set on EVERY page, including pages with no design and no page-search control. Our answer is the opt-out `Table.vue` input (Phase 9.1) so no page silently loses text narrowing — S14-R6's "explicit decision" is therefore "every consumer gets a control", recorded here. S14-N1 makes page search a hard prerequisite: never remove a page's global-search filtering before its own input exists.
12. **Prefs value is an open JSON blob:** the 16 KB cap and pageKey regex are the only guards. Future pages must not stuff result data into it — preferences only. (Reviewer note for phase-2+ reuse.)