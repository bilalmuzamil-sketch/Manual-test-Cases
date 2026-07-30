# Filters — SPEC DIFF: our baseline **V1.0** → CURRENT **v1.6**

**Produced 2026-07-31.** Sources:
- **CURRENT:** `Filters-spec-current-2026-07-31/Filters-spec-current.md` — Confluence page **572030978**, Confluence **version 12**, body version **1.6**, updated **2026-07-28 by Branko Cicovic**. Pulled live via Confluence REST (HTTP 200).
- **BASELINE:** `build/filters/requirements.md` — spec **V1.0**, = Confluence **version 4** (2026-05-14), also re-pulled live this run for a byte-level diff.

## Headline

| | |
|---|---|
| How far behind were we | **8 Confluence versions / 5 spec minor versions** (V1.0 → v1.2 → v1.3 → v1.4 → v1.5 → v1.6) |
| Requirements in V1.0 | **78** |
| Requirements in v1.6 | **127** |
| **ADDED** | **49** |
| **REMOVED** | **0** |
| **CHANGED (text differs)** | **4** (`S8-R3`, `S8-R4`, `S10-R2`, `S12-R4`) |
| New stories | **Story 13 — Page Search** (29 reqs) and **Story 14 — Remove Page Filtering from Global Search** (7 reqs) |
| v1.6 reqs with **no case citing them** | **37 of 127** — but see the honest read-down in §4: 12 are *effectively* covered by cases that cite the tech plan instead of the spec anchor |
| Requirements our cases now **contradict** | **1 pair only** — `S9-R2`/`S9-R3` + `S2-N1`/`S2-N2` (Status chip on Estimates/Completed). See §5 — and note this text is **unchanged since V1.0**, so being behind did NOT cause it. |

**Blunt summary of what being behind cost us.** Almost nothing on Stories 1–12: no
requirement was ever removed and only 4 were reworded, and we had already absorbed 3
of those 4 through Branko's answer sheets and the tech-plan pass. The real cost is
**Story 13 (Page Search) and Story 14 (Global Search de-filtering)** — 36 brand-new
requirements that were ratified into the PRD on **2026-07-26 (v1.2)**, refined
2026-07-27/28, and which we have been treating as *unratified design/tech-plan
material* ever since. Our 16 cases in that space (9 `FLT-SRCH-*` + 7 `FLT-PSRCH-*`)
carry hedging notes like *"spec v1.3 (export awaited)"* and *"not in the ratified
product spec"* — **that hedging is now wrong: the spec exists, is ratified, and is
more detailed than what we wrote against.** That is on us.

---

## 1. Change log in order (V1.0 → v1.6), from Confluence version metadata

| Conf. ver | Date | Spec ver | What Branko changed |
|---|---|---|---|
| v4 | 2026-05-14 | **V1.0** | *(our baseline)* |
| v5 | 2026-07-20 | (unnumbered) | Add Parts and Reports filters to Feature Overview, Jobs to be Done, and Key Decisions |
| v6 | 2026-07-20 | (unnumbered) | Remove Status label from header |
| v7 | 2026-07-26 | **v1.2** | **Add Story 13 (Page Search) and Story 14 (Global Search: remove page filtering); amend Stories 8, 10, 11, 12** |
| v8 | 2026-07-26 | **v1.3** | Replace em dashes throughout with colons, semicolons and commas; remove orphaned comment annotations |
| v9 | 2026-07-27 | **v1.4** | **Resolve engineering review: persistence model, URL runtime-only rule, query session scoping, tab scoping, Imported exclusivity, table-wide search rule, endpoint-reuse for searchable fields** |
| v10 | 2026-07-27 | **v1.5** | CTA renamed to **"Back to my view"**; design link added to Story 11; open design note removed |
| v11 | 2026-07-28 | (v1.5+) | S14-R6: record the full affected-surface list from the engineering audit (42 surfaces / 39 components); note client-side surfaces against S13-R23 |
| v12 | 2026-07-28 | **v1.6** | Inventory debounce set to **350ms**; S13-R22 scope note vs audit list; **Vendor Invoices** added to QA naming note |

**There is no change-log SECTION inside the page body** — the above is reconstructed
from Confluence version comments. `v1.1` was never labelled (versions 5 and 6 carry
no version number), so the ladder reads V1.0 → v1.2 → … → v1.6.

**Reading the ladder against our own timeline:** v1.2 (2026-07-26) landed *nine days
after* our 79-case push (2026-07-17) and *one day before* our Parts/Reports authoring
(2026-07-27). v1.4/v1.5 (2026-07-27) landed the **same day** as that authoring, and
**v1.4 is the version that answers three of the exact questions we were carrying open
for Branko** (persistence model, URL runtime-only, Imported exclusivity). We asked
Branko questions he had already answered in the PRD.

---

## 2. CHANGED requirements (4) — verbatim, both sides

### `S8-R3`

- **V1.0:** "When the combination of active filters produces no matching work orders, the table shows an empty state with a message indicating no results were found for the current filters"

- **v1.6:** "When the combination of active filters and any active search query produces no matching records, the table shows an empty state with a message indicating no results were found for the current filters and search"

- **Impact:** Broadened from *filters only* to *filters **and any active search query***, and from "work orders" to "records" (the story is now app-wide, not Work-Orders-only). Our `FLT-EMPTY-*` cases speak of filters only.

### `S8-R4`

- **V1.0:** "The empty state includes a prompt or link to clear filters"

- **v1.6:** "The empty state includes a prompt or link to clear filters and, where a search query is active, to clear the query"

- **Impact:** Empty-state prompt must now also offer to **clear the query**. Not in our empty-state cases.

### `S10-R2`

- **V1.0:** "Filter selections persist for the duration of the browser session"

- **v1.6:** "Filter selections are stored server-side against the user account. They survive logout and sync across the user's devices. Where two devices write different state, last write wins. This is not browser-local storage and does not expire with a browser session"

- **Impact:** **The biggest single behavioural change in the whole diff.** V1.0 = browser-session persistence; v1.6 = **server-side against the user account, survives logout, syncs across devices, last-write-wins**. ✅ We already absorbed this via Branko's Round-1 **Q2 answer (2026-07-17, "persistence permanent")** and pushed it to **FLT-PERS-02 = C29614**. The PRD has now caught up to what we already test. No case change needed — but our `requirements.md` still records the stale V1.0 sentence.

### `S12-R4`

- **V1.0:** "The filter bar collapse toggle is not shown on mobile — the filter bar is always visible"

- **v1.6:** "The filter bar collapse toggle is not shown on mobile; the filter bar is always visible"

- **Impact:** Punctuation only (em dash → semicolon), from the v1.3 dash sweep. **No behavioural change.**

---

## 3. ADDED requirements (49) — grouped by story

### Story 2 — Status Filter — 2 new

| Req | Verbatim v1.6 text | Case(s) citing it |
|---|---|---|
| `S2-R7` | Imported is an exception to S2-R2 and cannot be combined with anything else. Imported work orders come from a different data source rather than being a status of the existing records, so selecting Imported switches the list to the imported records and disables the other filter chips while it is active. Deselecting Imported returns the list and re-enables the other chips. This is current production behaviour and is unchanged by this work | **— none —** |
| `S2-N4` | Selecting Imported alongside another status, customer, technician, advisor or asset filter is not a supported combination and is prevented by S2-R7 rather than returning an empty result | **— none —** |

### Story 8 — Clearing Filters & Empty State — 1 new

| Req | Verbatim v1.6 text | Case(s) citing it |
|---|---|---|
| `S8-R5` | Where both a query and filters are active, each is cleared independently from the empty state. Clearing filters does not clear the query and clearing the query does not clear the filters, consistent with S13-R13 | FLT-PSRCH-02 |

### Story 10 — Filter Persistence — 2 new

| Req | Verbatim v1.6 text | Case(s) citing it |
|---|---|---|
| `S10-R4` | Persistence applies uniformly to every view or tab that has filters, with no per-page exceptions. Persistence and scope are separate concerns: each Parts view and each Report tab keeps its own separate filter set (see Key Decisions), and each of those sets persists independently on the terms in S10-R2 | FLT-PSRCH-03 |
| `S10-R5` | The search query is not covered by this story. It is scoped to the browser tab session and is never written to the user account. See S13-R14 and S13-R25 | **— none —** |

### Story 11 — URL State & Shareable Links — 7 new

| Req | Verbatim v1.6 text | Case(s) citing it |
|---|---|---|
| `S11-R4` | The active search query is reflected in the page URL alongside the filter state, so a filtered-and-searched view can be shared or bookmarked | FLT-PSRCH-04 |
| `S11-R5` | Opening a URL that contains a search query loads the page with that query pre-applied and the search control in its filled state, matching the filter behaviour in S11-R2 | **— none —** |
| `S11-R6` | Filter state arriving from a URL applies at runtime only. It never overwrites the user's saved filter state (S10-R2). Changes the user makes to filters while viewing a shared link are also not written back to their saved state: the entire visit is treated as a temporary view | **— none —** |
| `S11-R7` | While viewing filter state that arrived from a URL, a "Back to my view" action is available. It discards the shared view and restores the user's own saved filters. It also clears any active search query, because the query is not part of saved state and there is nothing to restore it to. The label is deliberately "my view" rather than "my filters", since the action affects both filters and search | **— none —** |
| `S11-R8` | S11-R6 does not need to protect the search query. Because the query is never saved (S13-R25), a query arriving from a URL has no stored value to overwrite: it simply becomes that browser tab's session query | **— none —** |
| `S11-N2` | If the URL search parameter is malformed, the page loads without a query applied and does not show an error, matching S11-N1 | FLT-PSRCH-04 |
| `S11-N3` | "Back to my view" is not shown when the user is viewing their own state rather than state that arrived from a URL | **— none —** |

### Story 12 — Mobile Filter Bar — 1 new

| Req | Verbatim v1.6 text | Case(s) citing it |
|---|---|---|
| `S12-R5` | The page search control is shown on mobile and behaves as it does on desktop (Story 13, S13-R16 to S13-R21). S12-R4, which hides the filter bar collapse toggle on mobile, does not apply to the search control | **— none —** |

### Story 13 — Page Search (**ENTIRELY NEW STORY**) — 29 new

| Req | Verbatim v1.6 text | Case(s) citing it |
|---|---|---|
| `S13-R1` | A Search control is displayed in the page toolbar, in the right-hand action group, positioned before any icon-only actions and before the primary CTA | FLT-PSRCH-01 |
| `S13-R2` | In its default state the control is a low-emphasis text button: magnifier icon (20×20) and the label "Search", Inter Medium 14/20, grey/600 (#4B5565), 8px corner radius, transparent background, 10px padding | **— none —** |
| `S13-R3` | On hover the control takes a grey/100 (#EEF2F6) background fill; the label colour is unchanged | **— none —** |
| `S13-R4` | On desktop, clicking the control expands it in place into a text input and moves focus into the input. The field grows leftward from its anchor and the remaining toolbar actions stay in position. The expanded width is 180px | **— none —** |
| `S13-R5` | The expanded empty state shows the magnifier icon, the text caret, and the placeholder "Type to search" in grey/500 (#697586) | **— none —** |
| `S13-R6` | Once the user types, the entered text is shown in grey/900 (#121926) and an X-circle clear icon (16×16) appears at the right edge of the field | **— none —** |
| `S13-R7` | The query applies as the user types, debounced at 300ms. There is no apply or submit button and Enter is not required. Inventory uses 350ms because of its load characteristics. Any other table needing a longer interval must be listed here rather than deviating silently | **— none —** |
| `S13-R8` | Long queries use standard text input behaviour: the field neither grows nor truncates, the text scrolls horizontally within it, and the caret follows the insertion point. Keyboard navigation and click-and-drag selection behave as in any text input | **— none —** |
| `S13-R9` | Search is scoped strictly to the records in the current table. It never returns results from another table, another page, another module, or any content outside that table. There is no cross-page lookup and no fallback to a wider search when the query returns nothing | FLT-PSRCH-01 |
| `S13-R10` | Search and filters are additive (AND). A query narrows within the active filters; applying a filter narrows within the active query | FLT-PSRCH-02 |
| `S13-R11` | On pages with tabs, search applies within the active tab only | **— none —** |
| `S13-R12` | Results replace the table contents in place. There is no separate results view or results page | **— none —** |
| `S13-R13` | Clicking the X-circle clears the query and restores the list to its filtered-but-unsearched state. "Clear filters" (S8-R1) does not clear the search query, and clearing the search query does not clear any filters | **— none —** |
| `S13-R14` | The search query is retained for the browser tab session. It survives sorting, pagination, and navigating away from the page and returning. Tab-switch behaviour within a page is governed by S13-R24 | **— none —** |
| `S13-R15` | On desktop, blur with an empty field collapses the control to its default state. Blur with a query keeps the field expanded so the active query stays visible | FLT-PSRCH-01 |
| `S13-R16` | Mobile uses the same inline expansion as desktop. There is no modal, no separate search screen, and no mobile-only state in the component. Tapping the collapsed control expands it in place within the action row, moves focus into the field and raises the keyboard | FLT-PSRCH-05 |
| `S13-R17` | On mobile the expanded field fills the remaining width of the action row rather than taking the fixed 180px desktop width. On Work Orders that resolves to 162px. All other toolbar actions remain visible and in position throughout; nothing is hidden while searching | **— none —** |
| `S13-R18` | To create that room, the primary CTA on mobile uses its natural hug width instead of stretching to fill the row: "New Work Order" is 144px, the same width it has on desktop, not 211px. The action group is right-aligned as on desktop, so the free space sits to the left and the field expands into it | **— none —** |
| `S13-R19` | Where a page has more than one icon-only action in its toolbar, those actions collapse into a single "more" kebab on mobile. This applies to Inventory, Purchase Orders, Timesheet Activities, both Technician Efficiency reports, Sales Tax (Collected), and any other page carrying two or more icon actions | **— none —** |
| `S13-R20` | No separate active-query indicator is needed on mobile. Because the field stays expanded and visible whenever a query is present, the desktop blur rules (S13-R15) apply unchanged: empty collapses, non-empty stays expanded showing the query | **— none —** |
| `S13-R21` | All query behaviour is identical across breakpoints: additive with filters (S13-R10), tab scoping (S13-R11, S13-R24), clearing (S13-R13), retention (S13-R14) and the four component states (S13-R2 to S13-R6). Only the expanded width differs, and that is a fill rule rather than a distinct behaviour | **— none —** |
| `S13-R22` | Every table in the application carries a search control, delivered through the shared table component. This covers the list pages across Work Orders, Parts and Reports, and also tables on detail pages and tables inside dialogs (see S14-R6). Any exception must be listed explicitly here; there are none at time of writing. This replaces the enumerated page list used in earlier versions, which did not account for tables outside list pages. Note the scope of this requirement is wider than the S14-R6 surface list: that list covers only tables global search filters today, so tables it never touched still fall under this rule | FLT-PSRCH-06 |
| `S13-R23` | Each table searches the fields its existing search endpoint already covers today. This is deliberate reuse rather than a newly defined set, so that no page changes behaviour it already has. Where a table needs to search fields beyond what its endpoint covers today, that is scoped separately as backend work and called out against that table. Pending: the per-table list of fields currently covered, from engineering. Until it exists the searchable set is undocumented and QA has no baseline to test against . Five of the surfaces listed under S14-R6 (Customer Contacts, Customer Assets, Customer Fees & Discounts, Administration Locations, Administration Fees & Discounts) narrow rows already loaded in the browser rather than querying an endpoint. For those, no list of covered fields exists to document: the searchable set is whatever the client-side filter happens to match today. Closing this item for them means either scoping the fields as new backend work or stating that the existing client-side narrowing is accepted as-is | **— none —** |
| `S13-R24` | On pages with tabs, the query scopes the same way that page's filters do. The Work Orders tabs share a single query, because they are views of one dataset. Reports sub-tabs and Parts views each keep their own query, matching their per-view filter scoping, because carrying a query between them would apply it to a different table with different columns | **— none —** |
| `S13-R25` | The query is stored in the browser tab session, never against the user account. This is deliberately different from filters, which are stored server-side and sync across devices (S10-R2). The query does not sync across devices, does not survive the tab session ending, and two browser tabs open on the same page each keep their own independent query. A shared link opened in a new tab therefore starts clean | **— none —** |
| `S13-N1` | If no records match the query, the table shows an empty state (see Story 8) | **— none —** |
| `S13-N2` | If the query is cleared while filters remain active, the table returns to the filtered result set rather than the unfiltered list | **— none —** |
| `S13-N3` | Hover states for the expanded field, and disabled and loading states, are not defined and are out of scope for this release | **— none —** |
| `S13-N4` | A query is never restored on a later visit after the tab session has ended. A user returning the next day sees an unsearched list | **— none —** |

### Story 14 — Remove Page Filtering from Global Search (**ENTIRELY NEW STORY**) — 7 new

| Req | Verbatim v1.6 text | Case(s) citing it |
|---|---|---|
| `S14-R1` | The global header search returns navigational results only. It takes the user to a record or page and does not modify the contents of the list the user is currently viewing | **— none —** |
| `S14-R2` | The existing code path that applies a global search query as a filter on the current page's table is removed, not hidden behind a flag or left dormant | FLT-PSRCH-07 |
| `S14-R3` | Any state, URL parameters or persisted values that carry a global search term into page-level filtering are removed with it | **— none —** |
| `S14-R4` | Entering a query in the global search while on a list page leaves that list untouched | **— none —** |
| `S14-R5` | This applies to every page in the application . Global search must no longer alter the visible record set anywhere, including pages outside Work Orders, Parts and Reports, and pages with no design in the current explorations. QA should treat this as an app-wide sweep, not a per-module check | FLT-PSRCH-06 |
| `S14-R6` | The audit of surfaces where global search currently filters content is complete. No surface loses text narrowing: every affected surface keeps a search control, delivered through the shared table component (S13-R22). The audit identified 42 surfaces across 39 components, listed under Affected Surfaces below. It confirmed that global search filters tables well outside the list pages, including Work Order notes, Customer notes, Work Order history, customer and vendor transaction tabs, and the audit log dialog. One candidate was examined and excluded: Work Order Parts, which already has its own local search input independent of global search and therefore loses nothing | **— none —** |
| `S14-N1` | Page search (Story 13) is a hard prerequisite. Removing global-search filtering from a page before page search is available there would leave that page with no way to narrow by text. If the rollout is phased, S14-R2 is scoped per page and S14-R5 is verified once at the end | **— none —** |

---

## 4. Which requirements have NO test case?

**Raw answer: 37 of 127.** But that number over-states the gap, because 12 of our
cases were written from the **tech plan** and cite tech-plan decision IDs (`D18`,
`G1`, `G7`, `Phase 9`) or "spec v1.3 (export awaited)" instead of the real spec
anchor. Read down honestly:

### 4a. Requirements that ARE covered, but by a case citing the wrong source (12) — metadata fix only, Rule 20

| Req | Covering case | What must change |
|---|---|---|
| `S2-R7`, `S2-N4` | **FLT-STAT-07 = C38877** ([view](https://shopview.testrail.io/index.php?/cases/view/38877)) | Case cites *"tech plan G1; spec S2-R1 (conflict raised with the author — export of spec v1.3 awaited)"*. **The conflict is resolved: v1.4 added `S2-R7` and it says exactly what our case asserts.** Re-point `refs`/`spec_ref` to `S2-R7` + `S2-N4`; delete the "PENDING BRANKO" note. |
| `S11-R6` | **FLT-URL-05 = C38879** ([view](https://shopview.testrail.io/index.php?/cases/view/38879)) | Case cites *"tech plan G7 … spec closing-note conflict raised with the author (spec v1.3 export awaited)"*. **Resolved: v1.4 added `S11-R6`, runtime-only, exactly as we test.** Re-point; delete the PENDING note. |
| `S11-R7` (partly) | **FLT-URL-05 = C38879** | Covers the go-back **action**, but not the **label** ("Back to my view", ratified v1.5) and **not the "it also clears any active search query" clause**. Partial — see 4b. |
| `S11-R5`, `S11-N2` | **FLT-PSRCH-04 = C38888** ([view](https://shopview.testrail.io/index.php?/cases/view/38888)) | Cites "spec v1.3 … (export awaited)". Re-point to the real anchors. |
| `S10-R5` | **FLT-PSRCH-03 = C38886** ([view](https://shopview.testrail.io/index.php?/cases/view/38886)) | Same. |
| `S12-R5` | **FLT-PSRCH-05 = C38889** ([view](https://shopview.testrail.io/index.php?/cases/view/38889)) | Same (case covers `S13-R16..R21` on mobile; `S12-R5` is the cross-reference). |
| `S13-R7` (debounce) | **FLT-PSRCH-01 = C38883** ([view](https://shopview.testrail.io/index.php?/cases/view/38883)) | Covers "narrows as you type", but **not the ratified 300ms debounce**, and not v1.6's **350ms Inventory exception**. Partial. |
| `S13-R12`, `S13-R13` | **FLT-PSRCH-01 / FLT-PSRCH-02 = C38883 / C38884** | Behaviour covered; anchors not cited. |
| `S14-R3`, `S14-R4` | **FLT-PSRCH-07 = C38893** ([view](https://shopview.testrail.io/index.php?/cases/view/38893)) | Covers "nav search no longer filters lists"; `S14-R3` (**carrying state/URL params removed, not dormant**) is asserted only loosely. Partial. |

### 4b. GENUINE uncovered requirements — no case, anywhere (the real gaps)

**Group A — Story 11 residue (2 gaps). Small, precise, and worth fixing now.**

| Req | Verbatim | Why it is genuinely uncovered |
|---|---|---|
| `S11-R7` *(second half)* | "It also **clears any active search query**, because the query is not part of saved state and there is nothing to restore it to. The label is deliberately \"my view\" rather than \"my filters\"" | FLT-URL-05 step 4 says only *"Use the on-screen option to go back to your own saved filters"* and expected 3 restores filters. **The query-clearing half is not tested at all**, and the case deliberately avoids naming the control (its note says the name is "engineering intent") — the name is now **ratified in v1.5 as "Back to my view"**. |
| `S11-N3` | "\"Back to my view\" is not shown when the user is viewing their own state rather than state that arrived from a URL" | **No case asserts the negative.** Nothing in our suite checks the control is absent on a normal visit. |
| `S11-R8` | "`S11-R6` does not need to protect the search query. Because the query is never saved (`S13-R25`) …" | Rationale/derivation clause, not independently observable. **Recommend: no case** (cite it as rationale on FLT-PSRCH-04). |

**Group B — Story 13 / Story 14 (the big one, ~25 genuine gaps).** These are the
requirements ratified in v1.2–v1.6 that we have no case for, because we authored this
area from **Figma + the tech plan** before we knew the spec existed:

- **Visual / component states (6):** `S13-R2` (default = low-emphasis text button, magnifier 20×20, label "Search"), `S13-R3` (hover grey/100 `#EEF2F6`), `S13-R4` (click expands in place, focus moves in, field is 180px on desktop), `S13-R5` (expanded-empty placeholder **"Type to search"** in grey), `S13-R6` (typed text grey/900 `#121926`, X-circle clear icon 16×16 appears), `S13-R8` (long queries scroll horizontally, field neither grows nor truncates).
- **Query mechanics (5):** `S13-R7` (**300ms debounce**, no apply/submit, Enter not required — plus v1.6's **Inventory = 350ms**), `S13-R11` (search applies within the **active tab only**), `S13-R14` (query survives sort/pagination/navigating away, **per browser tab**), `S13-R24` (tab scoping matches that page's filter scoping; WO tabs share one query), `S13-R25` (query stored in **browser-tab session, never against the account** — the deliberate contrast with `S10-R2`).
- **Mobile layout mechanics (3):** `S13-R17` (expanded field **fills remaining width**, not fixed 180px), `S13-R18` (primary CTA uses **hug width**, 144px "New Work Order"), `S13-R19` (pages with >1 icon-only action **collapse into a "more" kebab**), `S13-R20` (no separate active-query indicator).
- **Scope / negatives (5):** `S13-R21` (behaviour identical across breakpoints), `S13-R23` (**each table searches only the fields its existing endpoint already covers** — and the spec itself records this list as **Pending from engineering**, so QA has no baseline), `S13-N1`, `S13-N2`, `S13-N3` (hover-expanded / disabled / loading **out of scope** — an explicit non-requirement worth one guard note, not a case), `S13-N4` (query never restored after the tab session ends).
- **Story 14 (5):** `S14-R1` (global search returns **navigational results only**), `S14-R3` (carrying state/URL params **removed, not flagged or dormant**), `S14-R4` (query in global search leaves the list untouched), `S14-R6` (**42 surfaces / 39 components** audit list — every one keeps a search control; WO Parts explicitly excluded), `S14-N1` (page search is a **hard prerequisite**; phased rollout means `S14-R2` is per-page and `S14-R5` verified once at the end).

**Group C — a spec-side blocker we must flag, not paper over.** `S13-R23` says
verbatim: *"**Pending:** the per-table list of fields currently covered, from
engineering. **Until it exists the searchable set is undocumented and QA has no
baseline to test against**."* The PRD itself concedes we cannot author precise
per-page search-field cases yet. That is Branko/engineering's open item, and it
gates a chunk of Story 13.

**Group D — the 9 `FLT-SRCH-*` cases are now provably mis-scoped.** They were
authored from Figma node `11829-8908` and describe a **spotlight/palette** — entity
tabs (All / Work Orders / Customers / Assets / Parts), grouped results with counts,
recent searches by Today/Yesterday/Past week, hover quick-actions, keyboard hints, a
Refresh action. **The v1.6 Story 13 describes none of that.** It describes an
in-toolbar text input that expands in place and narrows the current table
(`S13-R4`/`R12`: *"Results replace the table contents in place. There is no separate
results view or results page"*), and `S13-R22`/§4 Key Decisions state the component is
*"scoped strictly to its own table … it cannot reach content in any other table, on
any other page, or in any other module. Cross-page and cross-module lookup is the job
of the global header search."* **The spec now settles the open question the user held
these nine cases for:** what they describe is Global Search v2, not Filters Story 13.
This is strong new evidence for Branko's pending Q6 answer — but per the user's
2026-07-31 ruling the nine cases still stay put until **Branko confirms**.

---

## 5. Which of our cases now CONTRADICT the current spec text?

**Exactly one behaviour: the Status chip on the Estimates and Completed tabs.** And
it must be said plainly — **this is NOT a consequence of being behind on the spec.**
The text is **byte-identical in V1.0 and v1.6**:

| Anchor | V1.0 (Conf. v4) | v1.6 (Conf. v12) |
|---|---|---|
| `S9-R2` | "On the Estimates tab, the Status filter chip is **hidden**; the remaining four filters are shown and apply on top of the Estimates pre-filter" | **identical** |
| `S9-R3` | "On the Completed tab, the Status filter chip is **hidden**; …" | **identical** |
| `S2-N1` | "On the Estimates tab, the Status filter chip is **not shown**: that tab already pre-filters by the Estimate status" | **identical** |
| `S2-N2` | "On the Completed tab, the Status filter chip is **not shown**: …" | **identical** |
| §4 Key Decisions | "Status filter is **hidden** on the Estimates and Completed tabs, because those tabs are shortcuts that already pre-filter by a single status" | **identical** |

Our cases **FLT-TAB-02 = C29609** and **FLT-TAB-03 = C29610** assert the chip is
*shown, greyed out, pre-filled and not clickable*. They do so on the authority of
**Branko's Round-1 Q4 = B answer (2026-07-17)** and the **QA-lead ruling of
2026-07-30** (*"Status chip is hidden on certain tabs = greyed-out/disabled"*), both
of which are **later and higher-precedence than the PRD prose**. So the cases are
**correct**; the **PRD text is what is out of date**, and Branko has now shipped
**eight versions without fixing it**.

Two things nonetheless need doing, and both are on us:
1. **Branko must align the PRD text** (`S9-R2`, `S9-R3`, `S2-N1`, `S2-N2`, §4 Key
   Decisions) to his own Q4 = B answer, so the next reviewer does not re-raise this.
   Every reviewer who reads only the PRD will keep flagging our cases as wrong.
2. **Our own suite is internally inconsistent** about it — see
   `../ahtesham-review-2026-07-31/VERIFICATION.md` §CONFLICT-1 for the exact
   per-case breakdown and the single wording to standardise on.

No other case in the suite contradicts v1.6. `S12-R2` (mobile identical to desktop)
is also unchanged since V1.0 and is discussed in the same verification doc.

---

## 6. What to do about `requirements.md`

`build/filters/requirements.md` is now a **V1.0 document with a header that claims
"SPEC CONFIRMED CURRENT (designer, via the user, 2026-07-17)"**. That claim is false
as of 2026-07-26. It should be re-ingested from
`Filters-spec-current-2026-07-31/Filters-spec-current.md` (v1.6) so that every
downstream generator, coverage matrix and `refs` string cites live anchors. Tracked
as item 1 of `../ahtesham-review-2026-07-31/FIX-PLAN.md`.

