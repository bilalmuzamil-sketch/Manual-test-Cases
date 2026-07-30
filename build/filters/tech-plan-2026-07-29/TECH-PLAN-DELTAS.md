# Filters — Tech-Plan Delta Analysis (2026-07-29)

**Source:** `TechPlan-AppWide-Filter-Redesign.md` (engineering tech plan, user upload
2026-07-29). **Scope of this doc:** classify every test-relevant point of the tech
plan against the current Filters suite (122 cases: 79 in TestRail C29557–C29635 +
43 design-level with blank C-ids) and drive the local-only case improvements.
**A tech plan is ENGINEERING INTENT — product truth stays the ratified spec + Branko's
answers (newest PRODUCT ruling wins).** Nothing here is pushed to TestRail.

---

## 0. Headline findings (read first)

1. **The Confluence spec has moved to v1.3 — we hold V1.0.** The tech plan's
   decisions log (2026-07-20) records: "Spec updated to v1.3 — Parts + Reports +
   Page Search now fully specified" — Parts filters (8 views), Reports filters
   (~21 reports), **Story 13 Page Search (23 requirements)**, **Story 14 Remove
   page filtering from global search**, a **new date-range filter type**, and
   **per-view/per-tab state scoping**. This IS the "Branko PRD update" we have been
   awaiting since 2026-07-17 — it exists on Confluence; we need the export (or an
   Atlassian MCP read) and then a Rule-11 ask (SPEC-RELEVANCE-RECONCILIATION run).
2. **Canonical spec URL now known (resolves OQ-2):**
   https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/572030978/Filters
   (from the tech plan header; reference pointer, do not fetch without MCP).
3. **One direct conflict with an already-pushed Branko ruling:** tech plan G9/§3.1
   builds the Status chip **HIDDEN** on Estimates/Completed; Branko's Q4=B
   (2026-07-17) ruled it **shown greyed-out, pre-filled, not clickable** — and we
   pushed FLT-TAB-02/03 (C29609/C29610) to TestRail on that ruling. Must go back to
   Branko (see §3 C3). No case edit until he re-rules.
4. **No feature flag (D13) + ONE program PR (D11):** when Filters lands on a QA
   branch it arrives all-at-once — WO pilot + Parts + Reports + mobile + page
   search + the global-search decoupling. Plan the VIU accordingly.
5. **The FLT-SRCH-01..09 cases describe the WRONG component for this project** per
   engineering: the spotlight/⌘K palette is Global Search v2 (separate PRD); the
   Filters program ships a small **page-toolbar search control** (Story 13). New
   page-search cases authored (§2.9); the spotlight cases stay flagged for
   transfer/retire pending Branko's Q6 ruling.

---

## 1. Classification summary

| Classification | Count | Outcome |
|---|---|---|
| IMPROVES-CASE | 16 items | 12 edit groups (notes-led + 1 content edit) + 15 new cases |
| API-CONTRACT | 6 items | 1 new API case + notes on FLT-API-01..05 |
| CONFLICTS-WITH-SPEC/PO | 9 items | Questions-for-Branko-dev.md (no silent rewrites) |
| VIU-PREP | 14 facts | recorded in §5 (no case changes) |
| NO-IMPACT | 12 items | listed §6 |

---

## 2. IMPROVES-CASE — testable behaviors our cases miss or under-specify

| # | Tech-plan anchor | Behavior | Action |
|---|---|---|---|
| 2.1 | D10 | **Default tab = Estimates on first visit** (All first in ORDER, not default); last-used tab persists per user | NEW **FLT-TAB-06** (+ confirm question C5 — product-visible engineering decision) |
| 2.2 | G1, §2 conflict 4 | **Imported exclusivity**: Imported is a synthetic status on a separate endpoint; mutually exclusive — while active all other chips disabled; normalize on load (saved/shared state with imported + others must not be representable) | NEW **FLT-STAT-07** (pending-confirm flag, C2) + note on FLT-STAT-03 |
| 2.3 | G4, §4-1.6 | **Asset on Site "No" is NEW capability** (`vehicleHere=0` path never existed with the old toggle — explicitly flagged as needing functional verification) | NEW **FLT-ASSET-07** |
| 2.4 | G6 | Persistence = **server-side, per user, CROSS-DEVICE, survives logout**, last-write-wins across devices | EDIT **FLT-PERS-02** (C29614): cross-device leg added (consistent with Branko Q2=B "permanent per-user"; cross-device leg VIU-confirm) |
| 2.5 | G7, §4-3.4 | **URL-entered visit is runtime-only** — never writes to saved prefs (incl. mid-visit edits); **"back to my saved filters" affordance** restores saved state + strips params | NEW **FLT-URL-05** (pending-confirm flag, C1) + note on FLT-URL-02 |
| 2.6 | §4-3.3 | **One-time localStorage → server-pref migration**: existing users' old saved filters/tab/columns/sort seed the new pref on first visit (release-critical: users must not lose saved filters) | NEW **FLT-PERS-06** |
| 2.7 | D20 | **Per-view/per-tab state scoping**: selections do not carry across Parts views / report tabs; each retains + restores its own (pageKey = view/tab identity) | NEW **FLT-PERS-05** |
| 2.8 | D19 | **Date-range chip**: start/end picker, NO presets, NO default range, applies when the second date is picked, single range; leads nearly every report + Parts date columns | NEW **FLT-RPTS-23** |
| 2.9 | D18 / spec v1.3 Story 13 (S13-R1..R23, S10-R4/R5, S10-N2, S11-R4/R5, S11-N2) | **Page-toolbar search**: collapsed magnifier + "Search" button → expands in place ("Type to search", X-clear), as-you-type debounced 300 ms, strictly page/table-scoped, **additive AND with filters + cleared independently**, **query persisted per user like filters** (restored no-match query shows empty state), **in the URL** (malformed ignored), desktop blur rules (empty collapses / non-empty stays), mobile inline expansion + D21 toolbar changes | NEW **FLT-PSRCH-01..06** (6 cases, new section "Page Search Toolbar") |
| 2.10 | Story 14 (S14-R2/R3/N1), §Phase 9 | **Nav/global search stops filtering page lists app-wide** (real removal); every list keeps its own search control first (opt-out base-table input covers detail-page tabs + dialogs) | NEW **FLT-PSRCH-07** |
| 2.11 | G3 | **Customer = the customer account/company** (the grid's Customer column), NOT the contact person on the WO | note EDIT FLT-CUST-05 (seeding guidance) |
| 2.12 | §4-3.5 | Empty-state copy "No work orders match your filters" + clear-filters action only when filters active | note EDIT FLT-EMPTY-01 (label VIU-confirm, Rule 9 — engineering copy, capture live) |
| 2.13 | G5, §4-0.4 | Advisor dropdown lists **ACTIVE advisors only** (`activeOnly=1` opt-in; WO-detail + Advisor-Analysis dropdowns unchanged); advisor options are **location-scoped** (change on location switch) | note EDIT FLT-ADV-07 (mechanism + regression scope) |
| 2.14 | §4-3.2 | Technician options = active-only, clockable-only, location-scoped; **selections referencing staff not in the new location silently drop on location switch** | note EDIT FLT-TECH-07 |
| 2.15 | G8/D22 | Page-search ownership split settled at engineering level: spotlight = Global Search v2; toolbar search = Filters | EDIT FLT-SRCH-09 notes (engineering answer recorded; pending Branko Q6) + one-line note on FLT-SRCH-01..08 |
| 2.16 | Rollout scope rule, Phase 6–8 | Every rollout page (Parts + Reports) gets ALL THREE: chip design + URL sharing + per-user persistence; **no semantic changes** (what was filterable stays filterable) — answers part of PO-Q5 (WO-parity) at engineering level | note EDIT FLT-PARTS-11/12, FLT-RPTS-21/22 (pending Branko PRD ratification) |

## 2a. Edits/new-case guardrails applied

- Rule 9: no invented labels — every tech-plan-pinned string ("Type to search",
  "No work orders match your filters", "Apply filters") carries a VIU-confirm flag.
- Rule 20 refs: ticket TBD (Epic key still unavailable) + tech-plan §anchor + spec
  v1.3 S#-R# where the tech plan cites it (spec export awaited).
- Rule 28: no per-column/sort slop; each new case = one distinct observable
  behavior whose failure is a real reportable bug. The blur-rules candidate was
  MERGED into FLT-PSRCH-01 (component states = one case) rather than authored alone.
- Conflicts (§3) are NOT baked into cases; where a case must exist now (FLT-STAT-07,
  FLT-URL-05, FLT-TAB-06) it carries a plain "pending Branko confirmation" flag.

---

## 3. CONFLICTS-WITH-SPEC/PO — flagged for Branko/dev (NO silent rewrites)

| # | Conflict | Sides | Our stance |
|---|---|---|---|
| C1 | **URL precedence** | Spec v1.3 closing note: "URL wins on load, **then persists**" vs tech plan G7 (runtime-only, author agreed in page comments) | Author FLT-URL-05 to runtime-only WITH pending-confirm flag; ask Branko to ratify in spec text (Questions Q2) |
| C2 | **Imported combinability** | Spec S2-R1 lists Imported as a plain status vs G1 mutually-exclusive + chips disabled (tech plan raised it as spec conflict 4) | FLT-STAT-07 authored with pending flag; Questions Q3 |
| C3 | **Status chip on Estimates/Completed — HIDDEN vs GREYED-OUT** ⚠️ highest priority | Tech plan G9/§3.1 builds HIDDEN (per spec) vs **Branko Q4=B 2026-07-17: shown greyed-out, pre-filled, disabled** — already pushed to TestRail as FLT-TAB-02/03 (C29609/C29610) | NO edit — Branko's ruling is the newest PRODUCT truth we hold; but spec v1.3 (2026-07-20) is newer than his answer, so he must re-rule. Questions Q1 |
| C4 | **Mobile per-filter sheet: Apply button vs real-time** | Final design frames (11884:21065/21271) + our FLT-MOB-04 show an "Apply filter" button vs D15: individual sheets are REAL-TIME, only the combined All-Filters sheet batches | note on FLT-MOB-04; Questions Q4 |
| C5 | **Default tab = Estimates (D10)** | Not in any ratified product spec we hold; product-visible behavior decided by engineering for DB-load reasons | FLT-TAB-06 authored with pending flag; Questions Q5 |
| C6 | **Page-search ownership + the FLT-SRCH spotlight cases** | FLT-SRCH-01..08 (authored from the spotlight design) vs G8/D22: spotlight = Global Search v2 project | Recommend transfer/retire of FLT-SRCH-01..08 pending Branko Q6 (already sent 2026-07-27); FLT-SRCH-09 notes updated |
| C7 | **Parts Vendors design missing** | Tech plan conflict 6 / Phase 7.3: NO Vendors Figma frame (won't build without design) vs our FLT-PARTS-08 authored from frame 11903:10461 treating "Vendor Invoices" naming as a design typo | Engineering reads that frame as Vendor Invoices — our typo-read may be wrong. Note on FLT-PARTS-08; Questions Q6 |
| C8 | **Search query across tabs** | Spec S13-R14 (query retained across tabs) vs per-tab state for Reports/Parts (spec Key Decisions — self-conflict, tech plan conflict 3) | Engineering builds: query follows the page's filter scoping (shared across WO tabs, per-tab where filters are per-tab). Noted in FLT-PSRCH-03; VIU-confirm |
| C9 | **Spec version drift V1.0 → v1.3** | requirements.md = V1.0; Confluence = v1.3 with 2 new stories + Parts/Reports sections | Request the v1.3 export (or MCP read) from the user; then Rule-11 ask → SPEC-RELEVANCE-RECONCILIATION over the whole suite. Questions Q7 (request, not A/B) |

---

## 4. API-CONTRACT — endpoints/payloads worth API coverage (Rule 4)

| # | Anchor | Contract | Action |
|---|---|---|---|
| A1 | §4-1.3, G6 | **`GET/PUT /api/users/me/preferences/{pageKey}`** — GET unset → 200 `value:null` (not 404); PUT `{value}` → 200 echo; 400 on bad pageKey (`^[a-z0-9-]{1,64}$`), non-object value, or > 16 KB; per-user isolation (user A cannot read user B); last-write-wins | NEW **FLT-API-06** (saved-filters service round-trip + isolation) |
| A2 | §4-0.3, §4-3.2 | WO list filters = **`filters[N][field]/[value]` repeated-eq** (no `in` operator — non-UUID values silently dropped by `in`); field names verbatim: `status`, `company_id`, `tech_assigned_id`, `service_advisor_id`, `vehicleHere` ('1'/'0') | notes on FLT-API-01/02 (tighten at VIU) |
| A3 | §4-1.8 | Non-whitelisted filter field → rejected (FilterException), not silently ignored | note on FLT-API-04 |
| A4 | §2.2 panels / S10-N1, S11-R3 | Deleted/unknown selected values drop via FE options-resolution (display AND next emitted state) | note on FLT-API-03 (mechanism) |
| A5 | G1 | Imported fetch = separate endpoint `GET /api/work-orders-imported` (pagination + search only, no filters); `declined` FE-appended, excluded from `GET /api/work-orders/statuses` | notes on FLT-API-01 + FLT-STAT-07 |
| A6 | D18 | Page search sends the page's existing `search` request param (BE unchanged); a few small tables filter client-side | note carried in FLT-PSRCH-01 |

---

## 5. VIU-PREP — facts recorded for the later live VIU (no case changes)

1. **No feature flag — straight replace (D13); ONE program PR (D11)** — the whole
   program (WO + Parts + Reports + mobile + page search + global-search decoupling)
   arrives at once on the QA branch.
2. Canonical spec URL: `.../pages/572030978/Filters` (OQ-2 resolved).
3. Prefs endpoint `GET/PUT /api/users/me/preferences/{pageKey}`; WO pageKey =
   **`work-orders-list`**; per-view keys like `parts-inventory`,
   `report-ar-aging-detail__summary-tab` (D20). Pref value = whole page state
   `{tab, filters, collapsed, columns, sortBy, descending}` (+ search query).
4. Request conventions: tabs drive `filters[]` + `showMyWorkOrders=1` (My WO tab);
   the vestigial `status=` request param is NOT sent; repeated-eq per A2.
5. Debounces: page search 300 ms (Inventory 750 ms); prefs save ~500 ms trailing.
6. `data-test-id`s for automation/VIU driving: `filter_chip_<key>`,
   `filter_option_<key>_<value>`, `clear_filters`, `toggle_filter_bar`,
   `back_to_saved_filters`, `tab_all|tab_estimates|tab_completed|tab_my_work_orders`,
   `empty_state_clear_filters`, `filter_chip_all_filters`, `apply_filters` (mobile
   combined sheet), `input_table_search` (base-table search).
7. Empty-state copy (engineering): "No work orders match your filters" — confirm live.
8. Date-range URL form: `range=custom&from=YYYY-MM-DD&to=YYYY-MM-DD` (D19).
9. Advisor options: active-only via `activeOnly=1`, location-scoped; technician
   options: clockable-only, active-only, location-scoped, client-side term filter.
10. Statuses: `GET /api/work-orders/statuses` + FE-appended `declined` + synthetic
    `imported`; 9-status list in FLT-STAT-01 remains correct.
11. Mobile: combined "All Filters" sheet batch-applies; no collapse toggle on mobile
    (S12-R4 — matches FLT-MOB-09); D21 toolbar: CTA hug-width + 2+ icon actions
    collapse into a kebab wherever page search ships.
12. URL sync omits defaults (empty selections, default tab) — a clean URL ≠ no state.
13. Pref blob cap 16 KB; pageKey regex `^[a-z0-9-]{1,64}$`.
14. S13-R22 page list + S13-R23 searchable-fields rules (human-readable identifier
    columns; numeric/currency/date excluded — those are filters) — pull exact lists
    from the spec v1.3 export when it arrives.

---

## 6. NO-IMPACT (test-irrelevant engineering internals)

DB EXPLAIN evidence + index decisions (0.1/0.2, 1.4, P1); invoice fan-out
retirement (0.5); DDD/hexagonal file layout + mirror files (1.1–1.3 internals);
Pest/Vitest/E2E test-code specifics (1.8, 2.6, 3.6, 9.3, §5 table); PR/branch
mechanics + AGENTS.md gates (D11 details, Phase 5/9.4–9.6); `bin/smoke-test.sh`
gap; Redis rejection rationale; Golden-Rule FE coding rules (GR#3..#10);
`MultipleToggleSelect` retention note; prefs-blob hygiene reviewer note (§6-12);
`WorkOrders.vue` line-ref inventory; migration SQL specifics.

---

## 7. Cross-project: Report Suite persistence crossover (flag only — NOT writing into build/report-suite/)

The tech plan **confirms the 2026-07-28 kickoff decision end-to-end**: G6 + hard
architectural requirement 2 make the prefs endpoint **`page_key`-agnostic and
reusable by every later list/report page** — this IS the account-level cross-device
persistence layer the Report Suite will consume (Stefan's clash → "Filters owns,
Report Suite delegates"). Filters-side impact handled here (FLT-PERS-02 cross-device
leg, FLT-PERS-05 per-view scoping, FLT-API-06 contract).

**For the Report Suite folder owner (flag only, do not act here):**
- Tech plan **Phase 8** re-skins ~24 LEGACY report pages (S13-R22 list: Timesheets,
  Sales, Technician Efficiency, A/R / A/P Aging, Sales Tax, WIP-legacy, Notes,
  Reminders, QB Unexported…) with chips + date-range + URL + per-tab persistence —
  Phase 8.1 mandates an alignment session with the reports-suite track ("adopting
  filters on a page that track is about to replace is wasted work; agree
  page-by-page who ships what").
- The Report Suite's own six NEW reports keep LOCAL persistence for now (kickoff
  decision); when Filters ships, cross-device delegates to
  `/api/users/me/preferences/{pageKey}` — their persistence cases will then need
  the same cross-device scope note flagged on FLT-PERS-02.
- Coverage-overlap watch: legacy "WIP" (Phase 8 list) ≠ Report Suite's new WIP
  report — keep the two suites' report-page filter cases from colliding.

---

## 8. Resulting change set (Phase 3)

- **12 case edits** (11 notes-only + 1 content edit FLT-PERS-02): FLT-PERS-02,
  FLT-URL-02, FLT-STAT-03, FLT-CUST-05, FLT-EMPTY-01, FLT-ADV-07, FLT-TECH-07,
  FLT-MOB-04, FLT-PARTS-08, FLT-PARTS-11/12 + FLT-RPTS-21/22 (rollout notes),
  FLT-SRCH-01..09 (ownership notes), FLT-API-01..05 (contract notes).
- **15 new cases** (blank C-ids, all VIU-Pending): FLT-TAB-06, FLT-STAT-07,
  FLT-ASSET-07, FLT-URL-05, FLT-PERS-05, FLT-PERS-06, FLT-RPTS-23,
  FLT-PSRCH-01..06 (new section "Page Search Toolbar"), FLT-PSRCH-07,
  FLT-API-06 (API section).
- **Questions doc:** `Questions-for-Branko-dev.md` (Q1–Q7 per §3).
- **New suite total: 137** (122 + 15). Push queue awaits authorization.
