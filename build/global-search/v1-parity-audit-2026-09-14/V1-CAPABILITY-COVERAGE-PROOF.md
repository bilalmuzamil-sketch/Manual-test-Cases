# V1 CAPABILITY COVERAGE PROOF — 100% of V1, mapped case by case

**Date:** 2026-09-14 · **Suite:** TestRail section **6769** (Global Search V2 — V1 Regression Suite) · **Run:** 415

**V1 baseline:** `ShopView/shopview @ 55767168` (`develop`; Global Search FE+BE byte-identical to `main d9ce0e5`)


## THE RULE THIS PROVES AGAINST

**For this suite, V1 *is* the specification.** Not PRD v1.5, not the epic, not the designs. The only
question asked of every row below is **"could a user do this in V1?"** — and if the answer is yes, a
case exists. Whether the V2 specification mentions, omits or forbids the behaviour is irrelevant to
whether it is tested; it bears only on what the Product Owner decides after the test has run.

## HOW THE V1 LIST WAS BUILT — mechanically, not from memory

The searchable fields were **extracted programmatically** from the `search` expression of every
fetcher in `api/src/Reporting/GlobalSearch/Application/FetchData/FetchDataQueryHandler.php` at the
baseline commit — every `COALESCE(...)` column inside each concatenation. That is the definitive
enumeration: it is the literal SQL that decided what V1 could find. The behaviours come from the
invariant register `INV-01…INV-91` in `GLOBAL-SEARCH-V1-BASELINE-INVARIANTS.md`, itself derived the
same way.

## THE RESULT

| Measure | Value |
|---|---|
| V1 capabilities enumerated | **65** (37 searchable fields + 28 behaviours) |
| Cases live in section 6769 | **58** |
| Tests in run 415 | **157** |
| Capabilities with **no** case | **0** |
| Cases mapped but missing from run 415 | **0** |
| Cases in 6769 serving **no** V1 capability | **0** |


**Every V1 capability has a case, every case is in the run, and no case is dead weight.**


---

## 1 · SEARCHABLE FIELDS — what a user could type to find a record

| # | V1 capability | V1 source evidence | Case(s) |
|---|---|---|---|
| 1 | WO/PS - plain (raw) number | `FetchDataQueryHandler.php:96 wo.raw_number` | [C55672](https://shopview.testrail.io/index.php?/cases/view/55672) |
| 2 | WO/PS - formatted number | `FetchDataQueryHandler.php:98-111 wo.number` | [C53579](https://shopview.testrail.io/index.php?/cases/view/53579) |
| 3 | WO/PS - shop-number-prefixed forms (4 variants) | `FetchDataQueryHandler.php:100-110 shop_id injected 4 ways` | [C53579](https://shopview.testrail.io/index.php?/cases/view/53579) |
| 4 | WO - customer company name | `FetchDataQueryHandler.php:112 c.name` | [C53578](https://shopview.testrail.io/index.php?/cases/view/53578) |
| 5 | Part Sale - customer company name | `FetchDataQueryHandler.php:112 c.name (same fetcher yields Part Sale rows)` | [C55665](https://shopview.testrail.io/index.php?/cases/view/55665) |
| 6 | WO/PS - status word | `FetchDataQueryHandler.php:113-116 wo.status` | [C55658](https://shopview.testrail.io/index.php?/cases/view/55658) |
| 7 | Customer - company name | `FetchDataQueryHandler.php:226 c.name` | [C55667](https://shopview.testrail.io/index.php?/cases/view/55667) |
| 8 | Customer - company name with spaces removed | `FetchDataQueryHandler.php:228 REPLACE(c.name,' ','')` | [C53602](https://shopview.testrail.io/index.php?/cases/view/53602) |
| 9 | Customer - address line 1 | `FetchDataQueryHandler.php:229 c.address_1` | [C53582](https://shopview.testrail.io/index.php?/cases/view/53582) |
| 10 | Customer - address line 2 | `FetchDataQueryHandler.php:229 c.address_2` | [C53604](https://shopview.testrail.io/index.php?/cases/view/53604) |
| 11 | Customer - state or province | `FetchDataQueryHandler.php:230 c.state_or_province` | [C53582](https://shopview.testrail.io/index.php?/cases/view/53582) |
| 12 | Customer - postal code | `FetchDataQueryHandler.php:230 c.postal_code` | [C53582](https://shopview.testrail.io/index.php?/cases/view/53582) |
| 13 | Customer - city | `FetchDataQueryHandler.php:231 c.city` | [C53582](https://shopview.testrail.io/index.php?/cases/view/53582) |
| 14 | Customer - company telephone | `FetchDataQueryHandler.php:235 c.telephone` | [C55662](https://shopview.testrail.io/index.php?/cases/view/55662) |
| 15 | Customer - website | `FetchDataQueryHandler.php:236 c.website` | [C53583](https://shopview.testrail.io/index.php?/cases/view/53583) |
| 16 | Customer - contact first name | `FetchDataQueryHandler.php:240 cu.first_name` | [C55670](https://shopview.testrail.io/index.php?/cases/view/55670) |
| 17 | Customer - contact last name | `FetchDataQueryHandler.php:240 cu.last_name` | [C55670](https://shopview.testrail.io/index.php?/cases/view/55670) |
| 18 | Customer - contact job title | `FetchDataQueryHandler.php:241 cu.title` | [C53603](https://shopview.testrail.io/index.php?/cases/view/53603) |
| 19 | Customer - contact telephone | `FetchDataQueryHandler.php:241 cu.telephone` | [C55662](https://shopview.testrail.io/index.php?/cases/view/55662) [C53603](https://shopview.testrail.io/index.php?/cases/view/53603) |
| 20 | Vendor - name | `FetchDataQueryHandler.php:156 v.name` | [C55668](https://shopview.testrail.io/index.php?/cases/view/55668) |
| 21 | Vendor - address line 1 | `FetchDataQueryHandler.php:157 v.address_1` | [C53585](https://shopview.testrail.io/index.php?/cases/view/53585) |
| 22 | Vendor - address line 2 | `FetchDataQueryHandler.php:158 v.address_2` | [C53604](https://shopview.testrail.io/index.php?/cases/view/53604) |
| 23 | Vendor - state or province | `FetchDataQueryHandler.php:159 v.state_or_province` | [C53606](https://shopview.testrail.io/index.php?/cases/view/53606) |
| 24 | Vendor - postal code | `FetchDataQueryHandler.php:160 v.postal_code` | [C53585](https://shopview.testrail.io/index.php?/cases/view/53585) |
| 25 | Vendor - city | `FetchDataQueryHandler.php:161 v.city` | [C53585](https://shopview.testrail.io/index.php?/cases/view/53585) |
| 26 | Vendor - telephone | `FetchDataQueryHandler.php:162 v.telephone` | [C55663](https://shopview.testrail.io/index.php?/cases/view/55663) |
| 27 | Vendor - email | `FetchDataQueryHandler.php:163 v.email` | [C53584](https://shopview.testrail.io/index.php?/cases/view/53584) |
| 28 | Asset - owning customer name | `FetchDataQueryHandler.php:286 c.name` | [C53581](https://shopview.testrail.io/index.php?/cases/view/53581) |
| 29 | Asset - year | `FetchDataQueryHandler.php:287 v.year` | [C53605](https://shopview.testrail.io/index.php?/cases/view/53605) |
| 30 | Asset - make / maker | `FetchDataQueryHandler.php:288 vmk.name` | [C55664](https://shopview.testrail.io/index.php?/cases/view/55664) |
| 31 | Asset - model | `FetchDataQueryHandler.php:289 vm.name` | [C55664](https://shopview.testrail.io/index.php?/cases/view/55664) |
| 32 | Asset - unit number | `FetchDataQueryHandler.php:290 v.unit` | [C53580](https://shopview.testrail.io/index.php?/cases/view/53580) |
| 33 | Asset - VIN | `FetchDataQueryHandler.php:291 v.vin` | [C55669](https://shopview.testrail.io/index.php?/cases/view/55669) |
| 34 | Asset - licence plate | `FetchDataQueryHandler.php:292 v.licence_plate` | [C53516](https://shopview.testrail.io/index.php?/cases/view/53516) |
| 35 | Part - name / description | `FetchDataQueryHandler.php:325 cp.name` | [C53607](https://shopview.testrail.io/index.php?/cases/view/53607) |
| 36 | Part - part number with and without dashes | `FetchDataQueryHandler.php:326-327 cp.part_number` | [C55666](https://shopview.testrail.io/index.php?/cases/view/55666) |
| 37 | Part - the CATALOGUE is the source, not inventory stock | `FetchDataQueryHandler.php:317-331 from CataloguePart::TABLE_NAME` | [C53601](https://shopview.testrail.io/index.php?/cases/view/53601) [C45153](https://shopview.testrail.io/index.php?/cases/view/45153) |

## 2 · BEHAVIOURS — how search behaved

| # | V1 capability | V1 source evidence | Case(s) |
|---|---|---|---|
| 1 | INV-10 minimum two characters | `useGlobalSearch.ts:69-71` | [C45161](https://shopview.testrail.io/index.php?/cases/view/45161) |
| 2 | INV-11 prefix match on the visible label | `useGlobalSearch.ts:76-82` | [C55667](https://shopview.testrail.io/index.php?/cases/view/55667) [C55668](https://shopview.testrail.io/index.php?/cases/view/55668) |
| 3 | INV-12 substring match anywhere in the record text | `useGlobalSearch.ts:84-93` | [C55659](https://shopview.testrail.io/index.php?/cases/view/55659) [C55660](https://shopview.testrail.io/index.php?/cases/view/55660) |
| 4 | INV-13 case-insensitive matching | `useGlobalSearch.ts:67,81,91` | [C55671](https://shopview.testrail.io/index.php?/cases/view/55671) |
| 5 | INV-14 + INV-15 per-type slots and no overall cap | `useGlobalSearch.ts:152 MAX_PER_TYPE=3, no total cap` | [C55661](https://shopview.testrail.io/index.php?/cases/view/55661) |
| 6 | INV-16 a record matching twice is shown once | `useGlobalSearch.ts:182-184` | [C45157](https://shopview.testrail.io/index.php?/cases/view/45157) |
| 7 | INV-17 a contact match still returns its company | `useGlobalSearch.ts:187-188,207-209` | [C55670](https://shopview.testrail.io/index.php?/cases/view/55670) |
| 8 | INV-18 work orders newest first | `FetchDataQueryHandler.php:124 start_date DESC` | [C53588](https://shopview.testrail.io/index.php?/cases/view/53588) |
| 9 | INV-20 the vehicles group is shown as Assets | `GlobalSearch.vue:60` | [C45155](https://shopview.testrail.io/index.php?/cases/view/45155) |
| 10 | INV-33 a newly created record is findable at once | `useGlobalSearch.ts:309-313 + 5 call sites` | [C53586](https://shopview.testrail.io/index.php?/cases/view/53586) [C53587](https://shopview.testrail.io/index.php?/cases/view/53587) |
| 11 | INV-34 a user with no default workplace | `GlobalSearch.vue:131-137` | [C45159](https://shopview.testrail.io/index.php?/cases/view/45159) |
| 12 | INV-40 keyboard shortcut reaches search | `GlobalSearch.vue:243-254` | [C45156](https://shopview.testrail.io/index.php?/cases/view/45156) |
| 13 | INV-41 first result auto-highlighted; Enter opens it | `GlobalSearch.vue:173-184,205` | [C55673](https://shopview.testrail.io/index.php?/cases/view/55673) |
| 14 | INV-43 loading state while results are not ready | `GlobalSearch.vue:12-14,147-149` | [C53589](https://shopview.testrail.io/index.php?/cases/view/53589) |
| 15 | INV-44 a no-results message | `GlobalSearch.vue:33-39,151-153` | [C55675](https://shopview.testrail.io/index.php?/cases/view/55675) |
| 16 | INV-46 selecting a result opens the right record | `GlobalSearch.vue:208-235; routingService.ts:75` | [C45153](https://shopview.testrail.io/index.php?/cases/view/45153) |
| 17 | INV-47 already on that record - no re-navigation | `GlobalSearch.vue:223-234` | [C45154](https://shopview.testrail.io/index.php?/cases/view/45154) |
| 18 | INV-48 selecting a result records an analytics event | `GlobalSearch.vue:211-217` | [C45160](https://shopview.testrail.io/index.php?/cases/view/45160) |
| 19 | INV-50 reachable on desktop, tablet and phone | `DesktopMenu.vue:52,74,77-101; GlobalSearch.vue:81-91` | [C55674](https://shopview.testrail.io/index.php?/cases/view/55674) |
| 20 | INV-64 history entries the user may not see are hidden | `useGlobalSearch.ts:21-29` | [C45149](https://shopview.testrail.io/index.php?/cases/view/45149) |
| 21 | INV-71 the TimeClock role gets nothing | `FetchDataController.php:50-51` | [C45147](https://shopview.testrail.io/index.php?/cases/view/45147) |
| 22 | INV-72 per-section access gating by held bundle | `FetchDataQueryHandler.php:47-53` | [C45142](https://shopview.testrail.io/index.php?/cases/view/45142) [C45144](https://shopview.testrail.io/index.php?/cases/view/45144) [C45145](https://shopview.testrail.io/index.php?/cases/view/45145) [C45146](https://shopview.testrail.io/index.php?/cases/view/45146) |
| 23 | INV-73 Part gated on catalogInventoryView only | `FetchDataQueryHandler.php:47-53; routingService.ts:84-85` | [C45143](https://shopview.testrail.io/index.php?/cases/view/45143) |
| 24 | INV-74 an unknown result type defaults to not-permitted | `routingService.ts:78-99` | [C45148](https://shopview.testrail.io/index.php?/cases/view/45148) |
| 25 | INV-80 every fetcher is organization-scoped | `FetchDataQueryHandler.php:127-130 et al` | [C45150](https://shopview.testrail.io/index.php?/cases/view/45150) |
| 26 | INV-81 only WO/PS are location-scoped; the rest are org-wide | `FetchDataQueryHandler.php:130` | [C45151](https://shopview.testrail.io/index.php?/cases/view/45151) |
| 27 | INV-82 a location switch refreshes the results | `useGlobalSearch.ts:286-299` | [C45152](https://shopview.testrail.io/index.php?/cases/view/45152) |
| 28 | INV-90 no feature flag controls global search | `absence in component, composable and config` | [C45158](https://shopview.testrail.io/index.php?/cases/view/45158) |

---

## 3 · WHAT IS DELIBERATELY **NOT** A ROW ABOVE — and the reasoning, so nothing is silently dropped

These V1 behaviours were assessed and judged **not to be a capability a user can lose**. They are
listed so that the judgement is visible and can be overruled, rather than made invisibly.

| V1 behaviour | Why there is no case | Overrule it if… |
|---|---|---|
| `INV-30/32` the whole collection was fetched once and filtered in the browser | An implementation detail. The user-visible capability — finding the record — is covered by every field row above | …you want the *speed* of V1's local filtering treated as a promise |
| `INV-31` 350 ms typing delay | V2 is faster (150 ms). Nothing is lost | — |
| `INV-19` group order followed whichever type matched first | V2 uses a fixed group order plus a pinned exact match. No record becomes unreachable | …you consider "my match was at the top" a capability |
| `INV-42` group headings were not clickable | A restriction, not a capability | — |
| `INV-45` errors surfaced through the shared toast | Error handling, not a search capability. The V2 suite covers the error state | — |
| `INV-49` clicking into the box cleared what was there | V2 keeps the text instead. Nothing becomes unfindable; it is a preference | …testers report the persisted query gets in the way |
| `INV-60/61/62/63` in-browser history of the last 5 selections, lost on reload | Replaced by a server-backed recent-activity list — the same capability, better. The one V1 detail not carried is "history reappears when a search finds nothing"; `INV-64` (hiding entries the user may not see) **is** covered by C45149 | …you want the zero-results-shows-recents behaviour pinned |
| `INV-70` the endpoint had no role gate of its own | A restriction. The real boundary is `INV-72`/`INV-73`, both covered | — |
| `INV-07` invoices were **not** searchable in V1 | V2 adds them. An addition can never be a regression | — |
| `INV-01` V1 had 6 result types | All six survive in V2 among its nine. Verified type by type | — |

## 4 · THE ONE CASE THAT HAD TO BE PUT BACK

**[C45153](https://shopview.testrail.io/index.php?/cases/view/45153)** had been *changed* on 2026-09-09
to require that a Part result opens the **inventory** part, following specification v1.3 — its own text
said so: *"earlier this case said a Part opens the catalogue part page. Spec v1.3 changed it… this case
follows the current spec."*

That was the mistake in miniature: a regression case was edited **away from** the V1 behaviour to match
the V2 document. In V1 a Part row opened the **catalogue** part (`routingService.ts:75` — *"the Part
route is the `CataloguePart` route guard"*), which is how every catalogue part was reachable whether or
not the shop had stocked it. The case has been restored to the V1 expectation, the V2 difference is
recorded as a finding, and it now tests a catalogue-only part explicitly.

## 5 · THE OTHER NINETEEN CORRECTED CASES

C45142–C45152 and C45154–C45161 were authored citing PRD v1.5 as their source of expectation. Each has
been **re-derived against its V1 invariant** and re-stamped with the V1 code citation and the line
*"THIS SUITE TESTS AGAINST V1."* Eighteen already matched V1 exactly and needed no change of
expectation. The nineteenth, **C45159**, differs — and differs in V2's favour: in V1 a user with no
default workplace never fetched the collection at all, so they got **no search whatsoever**. V2 giving
them a working search is a gain, not a loss, so the case keeps the V2 expectation, with the reason
recorded on the case.

## OUTSTANDING — what I need from you

Nothing on coverage — the mapping above is complete and mechanically checked. The open items are the
ones in `PO-TASK-TICKET-CANDIDATES.md`: permission to file the tickets, fresh QA cookies, the
bin-location ruling, and telling the execution session the run is now 157 tests.
