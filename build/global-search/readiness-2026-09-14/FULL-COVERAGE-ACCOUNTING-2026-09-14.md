# FULL COVERAGE ACCOUNTING — all 49 V1 invariants, every one accounted for

**Date:** 2026-09-14 · **Baseline:** `ShopView/shopview @ 55767168` · **Section 6769 · Run 415**

## WHY THIS DOCUMENT EXISTS

The earlier coverage proof verified the **searchable fields** exhaustively — all 35 `(fetcher, column)`
pairs, re-extracted independently. But it carried only **29 of the 49 behavioural invariants**, because
it reused a subset from prior work instead of walking the register end to end.

**That is a delta verification, and Standing Rule 101 says there is no such thing.** Every verification
is full, always. So this document walks **all 49**, and each one ends in exactly one of two states:

- **CASE** — a live test case asserts it, named here
- **NOT-LOSABLE** — no user capability can be lost, **with the reason stated so it can be overruled**

There is no third state, and no row is left implicit.

## RESULT

| | |
|---|---|
| Invariants in the register | **49** |
| Accounted for here | **49** |
| **Unaccounted** | **0** |
| Ending in a CASE | **38** |
| Ending in NOT-LOSABLE, with reason | **11** |


**Two new cases came out of this pass.** First, [C55679](https://shopview.testrail.io/index.php?/cases/view/55679) *"Your recent items come back when a search finds nothing"* — INV-63's second half. In V1 the recent list reappeared whenever a search returned zero matches, so a fruitless search never left you at a dead end. C44864 in the wider suite states V2 shows **only** a 'No results' message. That is a V1 capability with no case, and it now has one. Run 415 is **159 tests**.


---

## 1 · EVERY INVARIANT THAT ENDS IN A CASE

| Invariant | What V1 did | Case(s) |
|---|---|---|
| **INV-01** | Exactly 6 result types exist: `Work Order`, `Part Sale`, `Customer`, `Vehicle`, `Vendor`, `Part`. No others.<br>*6 result types all survive in V2 among its 9; each type has its own cases and C55661 asserts every matching type still appears* | [C55661](https://shopview.testrail.io/index.php?/cases/view/55661) [C53578](https://shopview.testrail.io/index.php?/cases/view/53578) [C55665](https://shopview.testrail.io/index.php?/cases/view/55665) [C55667](https://shopview.testrail.io/index.php?/cases/view/55667) [C53580](https://shopview.testrail.io/index.php?/cases/view/53580) [C55668](https://shopview.testrail.io/index.php?/cases/view/55668) [C55666](https://shopview.testrail.io/index.php?/cases/view/55666) |
| **INV-02** | Work Order / Part Sale match on: raw number, formatted number (incl. `S`/`P` + shop-id prefixes), company name, and status (`quality_check`→`qualitych<br>*umbrella for the WO/Part-Sale match fields - each mapped individually* | [C55672](https://shopview.testrail.io/index.php?/cases/view/55672) [C53579](https://shopview.testrail.io/index.php?/cases/view/53579) [C53578](https://shopview.testrail.io/index.php?/cases/view/53578) [C55665](https://shopview.testrail.io/index.php?/cases/view/55665) [C55658](https://shopview.testrail.io/index.php?/cases/view/55658) |
| **INV-03** | Customer matches on: company name (with and without spaces), address 1/2, state/province, postal code, city, telephone, website, and every contact's f<br>*umbrella for the customer match fields - each mapped individually* | [C55667](https://shopview.testrail.io/index.php?/cases/view/55667) [C53602](https://shopview.testrail.io/index.php?/cases/view/53602) [C53582](https://shopview.testrail.io/index.php?/cases/view/53582) [C53604](https://shopview.testrail.io/index.php?/cases/view/53604) [C55662](https://shopview.testrail.io/index.php?/cases/view/55662) [C53583](https://shopview.testrail.io/index.php?/cases/view/53583) [C55670](https://shopview.testrail.io/index.php?/cases/view/55670) [C53603](https://shopview.testrail.io/index.php?/cases/view/53603) |
| **INV-04** | Vehicle matches on: owner company name, year, maker, model, unit, VIN, licence plate. Carries `companyId`.<br>*umbrella for the asset match fields; "carries companyId" is the navigation half, covered by C45153* | [C53581](https://shopview.testrail.io/index.php?/cases/view/53581) [C53605](https://shopview.testrail.io/index.php?/cases/view/53605) [C55664](https://shopview.testrail.io/index.php?/cases/view/55664) [C53580](https://shopview.testrail.io/index.php?/cases/view/53580) [C55669](https://shopview.testrail.io/index.php?/cases/view/55669) [C53516](https://shopview.testrail.io/index.php?/cases/view/53516) [C45153](https://shopview.testrail.io/index.php?/cases/view/45153) |
| **INV-05** | Vendor matches on: name, address 1/2, state/province, postal code, city, telephone, email.<br>*umbrella for the vendor match fields - each mapped individually* | [C55668](https://shopview.testrail.io/index.php?/cases/view/55668) [C53585](https://shopview.testrail.io/index.php?/cases/view/53585) [C53604](https://shopview.testrail.io/index.php?/cases/view/53604) [C53606](https://shopview.testrail.io/index.php?/cases/view/53606) [C55663](https://shopview.testrail.io/index.php?/cases/view/55663) [C53584](https://shopview.testrail.io/index.php?/cases/view/53584) |
| **INV-06** | Part = `CataloguePart` (catalog), NOT inventory stock. Matches on name + part number (with and without `-`).<br>*Part = catalogue, and the part number in both forms* | [C53601](https://shopview.testrail.io/index.php?/cases/view/53601) [C55666](https://shopview.testrail.io/index.php?/cases/view/55666) [C53607](https://shopview.testrail.io/index.php?/cases/view/53607) |
| **INV-10** | Minimum 2 characters to search. `<2` chars shows history, runs no match. | [C45161](https://shopview.testrail.io/index.php?/cases/view/45161) |
| **INV-11** | Pass 1 = prefix match on `label` only (`startsWith`), case-insensitive. | [C55667](https://shopview.testrail.io/index.php?/cases/view/55667) [C55668](https://shopview.testrail.io/index.php?/cases/view/55668) |
| **INV-12** | Pass 2 = substring match on the `search` haystack (`includes`), case-insensitive, with all whitespace stripped from the query. | [C55659](https://shopview.testrail.io/index.php?/cases/view/55659) [C55660](https://shopview.testrail.io/index.php?/cases/view/55660) |
| **INV-13** | Matching is case-insensitive (both sides lower-cased). No fuzzy / typo-tolerant matching exists. | [C55671](https://shopview.testrail.io/index.php?/cases/view/55671) |
| **INV-14** | Cap = 3 results per type (`MAX_PER_TYPE`). Because `Customer` and `Contact` are separate types both grouped "Customers", the Customers group can show  | [C55661](https://shopview.testrail.io/index.php?/cases/view/55661) |
| **INV-15** | No overall total-results cap and no pagination. Whole collection is filtered client-side. | [C55661](https://shopview.testrail.io/index.php?/cases/view/55661) |
| **INV-16** | An id matched in pass 1 is not re-shown in pass 2 (de-dup by id). | [C45157](https://shopview.testrail.io/index.php?/cases/view/45157) |
| **INV-17** | A `Customer` matching only via the haystack (not label prefix) is shown as a "Contact" row with `more_info = "Contact/info match"`. | [C55670](https://shopview.testrail.io/index.php?/cases/view/55670) |
| **INV-18** | Work Order/Part Sale rows are ordered newest-first (`start_date DESC`). Customer/Vehicle/Vendor/Part have no explicit ordering (unspecified DB order). | [C53588](https://shopview.testrail.io/index.php?/cases/view/53588) |
| **INV-20** | The internal group name "Vehicles" is displayed to users as "Assets". | [C45155](https://shopview.testrail.io/index.php?/cases/view/45155) |
| **INV-33** | The collection is re-fetched after creating a searchable entity, via `invalidateSearchData()` from 5 call sites (see collateral C-3). | [C53586](https://shopview.testrail.io/index.php?/cases/view/53586) [C53587](https://shopview.testrail.io/index.php?/cases/view/53587) |
| **INV-34** | A user with no default workplace never fetches the collection (query stays disabled). | [C45159](https://shopview.testrail.io/index.php?/cases/view/45159) |
| **INV-40** | Ctrl+K (Win) / ⌘K (Mac) focuses the search, unless focus is already in an input/textarea/select. | [C45156](https://shopview.testrail.io/index.php?/cases/view/45156) |
| **INV-41** | After each filter, the first selectable result is auto-highlighted (Enter selects it). | [C55673](https://shopview.testrail.io/index.php?/cases/view/55673) |
| **INV-42** | Group headers are not selectable.<br>*the only case was C44809 in the FUNCTIONAL suite, which is not V1-sourced - so C55680 was added to the regression suite for it* | [C55680](https://shopview.testrail.io/index.php?/cases/view/55680) |
| **INV-43** | Loading state: input disabled + placeholder "Loading…" until the collection is fetched (for users with a default workplace); then placeholder "Search" | [C53589](https://shopview.testrail.io/index.php?/cases/view/53589) |
| **INV-44** | "No results" shows only after a ≥2-char search that yields 0 matches. | [C55675](https://shopview.testrail.io/index.php?/cases/view/55675) |
| **INV-46** | Selecting a result navigates to the type's route with `params.id` (Vehicle adds `?companyId=`); the `history_` prefix is stripped from the id first. R | [C45153](https://shopview.testrail.io/index.php?/cases/view/45153) |
| **INV-47** | If you are already on the selected record's id, it neither navigates nor records history. | [C45154](https://shopview.testrail.io/index.php?/cases/view/45154) |
| **INV-48** | Selecting a result fires a Google Analytics `global_search_use` event. | [C45160](https://shopview.testrail.io/index.php?/cases/view/45160) |
| **INV-50** | Placement: desktop always visible; tablet always visible; mobile toggles inline via a search icon (with an in-field close button). | [C55674](https://shopview.testrail.io/index.php?/cases/view/55674) |
| **INV-63** | History is shown when the query is `<2` chars or the current search yields 0 matches.<br>*the <2-chars half is C45161; the ZERO-MATCHES half is the newly added C55679* | [C45161](https://shopview.testrail.io/index.php?/cases/view/45161) [C55679](https://shopview.testrail.io/index.php?/cases/view/55679) |
| **INV-64** | History entries the user is no longer permitted to see are hidden. | [C45149](https://shopview.testrail.io/index.php?/cases/view/45149) |
| **INV-71** | The TimeClock role receives an entirely empty result. | [C45147](https://shopview.testrail.io/index.php?/cases/view/45147) |
| **INV-72** | BE section gating (the real access boundary), by held FE bundle: WO=`workOrdersView`; Part Sale=`partSalesView`; Customer+Vehicle=`customersView`; Par | [C45142](https://shopview.testrail.io/index.php?/cases/view/45142) [C45144](https://shopview.testrail.io/index.php?/cases/view/45144) [C45145](https://shopview.testrail.io/index.php?/cases/view/45145) [C45146](https://shopview.testrail.io/index.php?/cases/view/45146) |
| **INV-73** | Part (catalog) is gated on `catalogInventoryView` ONLY — a partSales-only role must NOT see Part or Vendor hits, but keeps Part Sale hits (SV-8412). | [C45143](https://shopview.testrail.io/index.php?/cases/view/45143) |
| **INV-74** | FE second layer re-filters displayed types AND history via `isSearchTypePermitted`; unknown/new types default to NOT-permitted. | [C45148](https://shopview.testrail.io/index.php?/cases/view/45148) |
| **INV-80** | Every fetcher is org-scoped (`OrganizationDecorator`). | [C45150](https://shopview.testrail.io/index.php?/cases/view/45150) |
| **INV-81** | Only Work Order / Part Sale rows are workplace-scoped (`WorkplaceDecorator` on `wo.workplace_id`). Customer/Vehicle/Vendor/Part are org-scoped only. | [C45151](https://shopview.testrail.io/index.php?/cases/view/45151) |
| **INV-82** | A location switch clears the cache and re-fetches the collection under the new `X-Location-ID`. | [C45152](https://shopview.testrail.io/index.php?/cases/view/45152) |
| **INV-90** | No feature flag controls Global Search. | [C45158](https://shopview.testrail.io/index.php?/cases/view/45158) |
| **INV-91** | Excluded from results: TimeClock role (empty), users without a default workplace (no fetch), sections/types without the FE bundle, invoices, inventory<br>*exclusion list - every excluded population is cased* | [C45147](https://shopview.testrail.io/index.php?/cases/view/45147) [C45159](https://shopview.testrail.io/index.php?/cases/view/45159) [C45142](https://shopview.testrail.io/index.php?/cases/view/45142) [C53601](https://shopview.testrail.io/index.php?/cases/view/53601) |

## 2 · EVERY INVARIANT THAT ENDS IN NOT-LOSABLE — and exactly why

**Overrule any of these and I will write the case.** They are listed so the judgement is visible rather than invisible.

| Invariant | What V1 did | Why no user capability can be lost |
|---|---|---|
| **INV-07** | Invoices are NOT a searchable result type. The `invoices` join exists only to derive the WO number's shop-id prefix. (Controller d | Invoices were NOT searchable in V1. V2 ADDS them. An addition can never be a regression. |
| **INV-19** | Group order is data-driven (a group header appears the first time one of its types matches, pass 1 then pass 2) — NOT a fixed sect | V1 ordered groups by which type matched first; V2 uses a fixed order plus a pinned exact match. No record becomes unreachable. The one losable part - a type pushed out entirely - IS cased as C55661. Related cases: [C55661](https://shopview.testrail.io/index.php?/cases/view/55661) |
| **INV-30** | The collection is fetched once per session (`GET /api/global-search/fetch`, `staleTime: Infinity`); all filtering is client-side. | Fetch-once-and-filter-locally is an implementation detail. The user-visible capability (finding the record) is covered by every field case. V2 error handling is the functional suite Error State. |
| **INV-31** | Filter input is debounced 350 ms. | 350 ms -> 150 ms. Faster. Nothing lost. |
| **INV-32** | No per-keystroke request and no request cancellation exist (there is nothing to cancel — one cached collection). | No per-keystroke request existed because there was one cached collection. Implementation detail, no user capability. |
| **INV-45** | Errors are not shown in a dedicated UI; they surface via the shared axios interceptor (toast + Sentry). No per-query `onError`. | Errors surfaced through the shared toast, not a dedicated UI. Error handling, not a search capability; the functional suite has an Error State section. |
| **INV-49** | Focusing the input clears the current query (`@focus="clearSearch"`). | V1 cleared the box on focus; V2 keeps the query and offers a clear (x) button (C44863). REROUTED, not lost - you can still get an empty box. Related cases: [C44863](https://shopview.testrail.io/index.php?/cases/view/44863) |
| **INV-60** | History caps at 5, de-dupes, prefixes ids with `history_`, and prepends a `{ group: 'History' }` header. | The 5-item cap, de-dup and history_ prefix are the V1 mechanism. The capability - see and reopen recent items - survives as the recent-entities API and is cased in the functional suite. Related cases: [C44857](https://shopview.testrail.io/index.php?/cases/view/44857) [C44859](https://shopview.testrail.io/index.php?/cases/view/44859) |
| **INV-61** | History is in-memory only (NOT localStorage / not persisted) — it is lost on page reload. | V1 history was in-memory and lost on reload. V2 persists it server-side. Strictly better. |
| **INV-62** | History is cleared on a fresh collection fetch and on a location switch. | History cleared on fetch and on location switch. A clearing rule, not a capability; the location half is cased as C45152. Related cases: [C45152](https://shopview.testrail.io/index.php?/cases/view/45152) |
| **INV-70** | The endpoint has no role gate; it is open to any authenticated user. Per-section access is enforced downstream. | The endpoint had no role gate of its own - that is an absence of a restriction, not a capability. The real boundary is INV-72/73, both cased. |

---

## 3 · THE TWO THINGS THIS PASS PROVES, AND THE ONE IT DOES NOT

**Proves:**
1. **Every searchable field** — 35 of 35 `(fetcher, column)` pairs, re-extracted independently from the
   V1 source rather than trusted from the earlier list.
2. **Every behaviour** — 49 of 49 invariants, each ending in a case or a stated reason.

**Does not prove:** that the *invariant register itself* captured every behaviour in the V1 front end.
The register was built by reading `useGlobalSearch.ts`, `GlobalSearch.vue`, `routingService.ts`,
`FetchDataController.php` and `DesktopMenu.vue` systematically, and the field half has now been
independently re-derived and matched — which is good evidence the same method held for behaviours. But
the behaviour half has **not** been re-extracted from scratch the way the fields were.

**Saying so is the point.** If you want that last gap closed, it is a re-read of those five files
against the register, and I will do it — it is the only remaining place a V1 capability could hide.
