# Global Search (v2) — Complete Requirements

> Source spec: `GlobalSearchProductRequirementsDevelopmentPlan.doc` (Confluence
> "Export to Word" MHTML export, ingested 2026-07-16). Doc title in export:
> **"Global Search - Product Requirements & Development Plan"**.
> Product: ShopView App · Feature: **Global Search v2** · Status (per doc): "Ready for engineering".
> Figma design link (from spec): https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=12053-65992
>
> **CANONICAL SPEC URL — TO CONFIRM WITH USER** (the doc is a Confluence export;
> the live Confluence page URL was NOT included in the export and must be supplied
> by the user — do NOT invent it).
> **PO / Product Owner — TO CONFIRM WITH USER** (not stated in the spec doc).
> **Epic / Jira key — TO CONFIRM WITH USER** (not stated in the spec doc).

This document is the COMPLETE, structured spec built verbatim-faithfully from the
ingested doc. Section numbering mirrors the source doc where practical.

---

## 1. Overview / Background & Problem

Today's global search in ShopView is a lightweight dropdown that:
- Returns up to **3 results per category** (Customers, Work Orders, Assets, Parts,
  Vendors) — confirmed in staging by typing "Aabridge" and "BOLT".
- Does **not** include **Part Sales** as a searchable entity.
- Has **no fuzzy/typo tolerance** — typing "Abrige" instead of "Aabridge" returns
  "No results".
- Provides minimal context per result (a single subtitle line — e.g. address or date).
- Has no recent searches, no quick actions, no keyboard navigation, no
  result-count overflow link, no scoping tabs.
- Loses the user's query as soon as the popover closes.

The redesign is a **spotlight-style global search** addressing each gap. Figma
frames referenced: First time search, No results, Recent searches grouped by time
interval, Quick Actions on Hover, Search results, Multiple search results,
Persisting search.

## 2. Goals & Non-Goals

**Goals** — a single global search surface that:
- (a) searches across Work Orders, Customers, Assets, Parts, Vendors, and Part Sales;
- (b) ranks results by likelihood of relevance to the searcher's current task;
- (c) tolerates real-world typos via fuzzy matching;
- (d) shows enough context inline to act without opening the record;
- (e) supports keyboard-first usage;
- (f) preserves the last query and exposes recent activity;
- (g) offers contextual quick actions that cut 2–3 clicks off common shop flows.

**Non-goals (this iteration):** Live data-freshness/refresh indicator (UX doc item
10); contextual page-aware re-ranking beyond a single bias signal (item 11 is partial).

## 3. Users & Primary Jobs-to-be-Done

Primary users: **service advisors, shop foremen, parts personnel, technicians** on
a desktop in a shop environment (keyboard-heavy, fast typists, frequently
mid-conversation, occasionally with dirty hands). Jobs-to-be-done:
- "find the work order I was just looking at"
- "pull up the customer who's on the phone"
- "see if we have this part in stock and where the bin is"
- "find the vehicle by VIN/unit"
- "find a recent part sale by number or VIN"
- "jump to a vendor to call them about a backorder"
- "start a new work order, customer, or part when nothing matches"

---

## 4. Scope — Searchable Entity Types & Indexed / Displayed Fields

Six entity types are searchable.

### Work Orders
- **Indexed:** WO number (e.g. `S2-15276`), customer name, asset (year/make/model),
  unit number, VIN/serial #, lead technician name, service advisor name, status,
  line item descriptions (parts and labor on the WO).
- **Displayed:** WO number + customer name (primary), status badge
  (Approved / Estimate / In Progress / Review / Completed / Declined / Invoiced),
  lead technician, asset/unit, created/updated date.

### Customers
- **Indexed:** customer name, telephone (digits only, normalized), address 1/2,
  city, state/province.
- **Displayed:** customer name (primary), address line, open WO count badge (e.g.
  `12`), telephone on hover.

### Assets (Vehicles)
- **Indexed:** year, make, model, VIN/serial #, unit number, owning customer name.
- **Displayed:** year + make + model (primary), customer name (secondary smaller).

### Parts (Inventory)
- **Indexed:** description, part number, tags, category, manufacturer, vendor name,
  bin location.
- **Displayed:** description (primary), part number (secondary), total quantity with
  stock-status color (green = in stock, orange = low, red = out — matching existing
  inventory list pattern).

### Vendors
- **Indexed:** name, telephone, email, address, city.
- **Displayed:** vendor name (primary), address line (secondary).

### Part Sales
- **Indexed:** P-number (e.g. `P2-58`), customer name, asset, VIN/serial #,
  created-by user, status.
- **Displayed:** P-number + customer (primary), status badge, total price + created date.

**Contact-field match affordance:** When a customer/vendor matches on a contact
field (phone, email) rather than the name, the secondary line shows
**"Contact/info match"**.

---

## 5. UX Requirements (from Figma)

### 5.1 Trigger and Surface
- Launched from the **persistent search field in the app header**, by clicking it or
  pressing the keyboard shortcut shown in the field (**K / ⌘K**).
- Opens a **centered modal overlay (640×~700 max)** anchored to the search field,
  dimming the page behind it (Figma shows it floating over the Work Orders table).
- **Esc**, clicking the page underlay, or pressing **⌘K again** closes it.
- Footer **always** shows the keyboard legend: **↓↑ Navigate · ⏎ Select · Esc Close**.

### 5.2 States
1. **First-time search (empty).** Placeholder: **"Search or ask a question"**. Below
   the input: helper text **"Type to start searching for work orders, parts,
   customers and more"**, and three quick-create chips: **+ New work order**,
   **+ New customer**, **+ New inventory part**.
2. **Recent searches (returning user, empty input).** Replaces helper text with the
   user's recent activity, grouped under time-interval headings: **Today,
   Yesterday, Past week, Past 30 days**. Each row is a previously **opened entity**
   (not just a previous query string), using the same row template as a result row.
3. **Typing / results.** Horizontal tab strip immediately under the input:
   **All · Work Orders · Customers · Assets · Parts · Vendors · Part Sales**.
   "All" is default. Selecting a tab scopes the query to that entity type. Below the
   tabs, results grouped by entity type with a count: **Work orders (12)**,
   **Customers (2)**, etc. Each group shows up to **5 results** (raised from 3). When
   a group has more, a **Show all N work orders →** link is appended at the bottom.
4. **No results.** **"No results for '<query>'"** plus the same three quick-create chips.
5. **Persisting search.** When the modal closes (Esc or navigating to a result), the
   most recent query string is preserved in the header search field as plain text.
   Reopening restores the query, the scope tab, and the result list. Figma info
   bubble: *"We always save search. When user clicks on this fields it opens up the
   modal with their last search."*

**Show all link behavior:** switches the modal into the corresponding scope tab
(e.g. clicking "Show all 12 work orders" activates the Work Orders tab in the same
modal). Figma calls out two options — **"full page vs. scoped tab"** — recommended
decision = **scoped tab within the modal** (keeps user in flow); the full-page
filtered list is still reachable from any scoped result's overflow.
**(Worth confirming with design before build — see §11 Open Questions.)**

### 5.3 Result Row Anatomy
- Left-side **entity icon**: briefcase = WO, person = customer, vehicle = asset,
  tag = part, building = vendor, label = part sale.
- **Primary line** (bold), **secondary line** (subdued), optional right-side cluster
  (status badges, counts, quick-action buttons on hover).
- The **matched substring is highlighted** in primary text — searching "Fib"
  highlights "Fib" in "S1-644 Fibridge Commercial".
- **Status badge colors** (same tokens as the WO list): Approved green, Estimate
  blue, Review yellow, Declined red, In Progress blue, Completed gray, Invoiced
  purple. **Stock badges** on parts: green available, orange low, red out.

### 5.4 Quick Actions on Hover
On hover (desktop, pointer present), a right-aligned button appears:
- **Work Order →** "Add new line" (only when the user is currently editing a WO
  elsewhere — opens an inline add to that WO).
- **Asset →** "New work order", plus secondary icons for clock (history) and Invoice
  (Invoices).
- **Customer →** "New work order", "New contact".
- **Vendor →** "Add contact".
- **Part →** "Add to work order" (only when currently editing a WO — Figma: "If you
  are currently editing WO") or "Add part" otherwise.

Quick actions **never trigger destructive operations**. Hover state is
non-essential — every action is reachable from the entity's full record.

### 5.5 Keyboard Navigation
- **↑/↓** moves focus through visible rows (skipping group headers).
- **Enter** opens the focused row in the same tab.
- **⌘+Enter (or Ctrl+Enter)** opens in a new browser tab.
- **Tab** moves focus to the scope tab strip; **←/→** cycles tabs when focus is on
  the tab strip.
- **Esc** closes the modal.
- The shortcut legend at the bottom is always visible.

---

## 6. Ranking & Prioritization

Two layers: **per-entity ranking** (within a group) and **cross-entity ranking**
(choose what shows on "All" and order the groups).

### 6.1 Per-entity score
**Match-quality component (shared):**
- Exact match on identifier (WO number, P-number, VIN, part number, telephone
  digits) → **+1.00** (effectively always wins).
- Prefix match on primary name field → **+0.70**.
- Whole-word match anywhere in indexed fields → **+0.50**.
- Fuzzy match (see §7) → score scaled by similarity, max **+0.40**.
- Bonus for match on primary display name vs. a secondary indexed field → **+0.10**.

**Entity-specific signals (added on top):**
- **Work Orders:** open/active status (Approved, In Progress, Review) +0.30;
  recency of last update (exp. decay, 14-day half-life) up to +0.25; assigned to
  current user (lead tech or SA = signed-in user) +0.15; viewed by current user in
  last 7 days +0.10. Closed/Invoiced WOs older than 90 days demoted −0.20.
- **Customers:** ≥1 open WO +0.20; total open WO count, log-scaled, up to +0.15;
  viewed in last 7 days +0.10; created in last 90 days +0.05.
- **Assets:** has open WO +0.20; viewed recently +0.10; year-newer-than-2015 +0.05
  (tie-breaker only).
- **Parts:** in stock (>0) +0.20; bin location present +0.05; sold/used in last 30
  days (frequency, log-scaled) up to +0.15; viewed recently +0.10; out-of-stock
  parts are **not** demoted.
- **Vendors:** has open POs +0.20; used in last 30 days +0.10.
- **Part Sales:** recency dominates (exp. decay, 7-day half-life) up to +0.30;
  status = Paid +0.05; created-by = current user +0.10.

Score clamped to a sane range; ties broken by recency (most recently updated wins).

### 6.2 Cross-entity ordering and group order
- Group display order in "All": **Work Orders → Customers → Assets → Parts →
  Vendors → Part Sales**.
- Within each group, rows sorted by score descending.
- When the top result across all groups has score **> 0.95** (effectively an ID
  match), it is **pinned as a separate single row at the very top**, above the
  groups, labeled by its entity icon — the "type S2-15276, jump straight to that WO"
  experience.

### 6.3 Contextual bias (lightweight)
- On a **Customer page**: candidate Assets and Work Orders owned by that customer
  get **+0.20**.
- On a **Work Order page**: parts already on that WO demoted **−0.10**; other parts
  in the same category as the WO's existing parts get **+0.05**.
- Implemented as a single signal (UX doc item 11), not full page-context awareness.

### 6.4 Telemetry-driven re-ranking (future-proofing)
- Every impression and click logged as
  `(query, result_entity_type, result_id, position, was_clicked)`.
- After 30 days, a periodic offline job adjusts per-entity weight constants by
  simple gradient descent against click-through rate. **Mechanism only — no ML
  model in v1** — schema in place from day 1.

---

## 7. Fuzzy Matching

Handles noisy shop input: "Petersn"→"Peterson", "frieghtliner"→"freightliner",
"S215276" (no dash), missing spaces, transposed letters. Three layered techniques
chosen by field type.

- **Normalization (query + indexed text):** lowercase; strip diacritics; collapse
  whitespace; for identifier fields (WO number, part number, VIN, phone) also strip
  non-alphanumerics so `S2-15276` = `s215276` and `(264) 328-6723` = `2643286723`.
  For names, keep spaces but treat hyphens/apostrophes as optional.
- **Token n-gram matching (primary for short fields):** trigram indexes on names
  (customer, vendor, asset make/model), part descriptions, and tags. Candidates
  with **Jaccard similarity ≥ 0.35** vs. query trigrams are eligible for fuzzy match
  (catches Petersn → Peterson).
- **Damerau–Levenshtein edit distance (refinement):** among trigram-eligible
  candidates, similarity = `1 − (distance / max(len(query), len(token)))`. Accept
  as fuzzy match when similarity **≥ 0.70** for queries length ≥ 4, **≥ 0.80** for
  shorter queries. Damerau handles transpositions (freihgtliner → freightliner).
- **Phonetic fallback (names only, last resort):** Double Metaphone on customer,
  vendor, and contact names. When trigram pass yields nothing but phonetic codes
  match, surface candidate with reduced fuzzy score (max +0.20). Catches
  Filbridge → Fibridge.
- **What is NOT fuzzy:** exact identifier fields — VIN, WO number, P-number, part
  number — bypass fuzzy logic and require exact match after normalization.
- **Implementation options:** PostgreSQL `pg_trgm` + `levenshtein()`
  (fuzzystrmatch) + `metaphone()`; OR, if search service is OpenSearch/Elasticsearch,
  `fuzziness: AUTO` on match query + ngram analyzers. Chosen in Phase 0 spike.
- **Highlighting:** fuzzy matches still highlight the matched token, with a subtle
  "≈" or italicized treatment for the soft match (design polish — confirm with design).

---

## 8. Functional Requirements (summary list)

The system must:
- open the modal via field click or ⌘K;
- debounce input at **150ms**;
- query the backend search endpoint with current query, scope, and page context;
- render grouped results within **200ms (p95)** of receiving response;
- support keyboard navigation per §5.5;
- persist the last query in client state and rehydrate on reopen;
- persist recent-entity-views in user state for **30 days**, grouped by interval;
- expose **Show all N** overflow;
- show contextual quick actions on hover for each entity;
- **gracefully degrade when the AI flag is off** *(see Open Question OQ-3)*;
- log impression and click telemetry;
- tolerate offline/network failures with an inline **"Search unavailable, retry"** banner.

---

## 9. Non-Functional Requirements

- Search latency **p95 ≤ 250ms** for tenants up to **100k entities** total.
- Index refresh latency **≤ 30s** for entity create/update (data-freshness
  indicator explicitly deferred).
- Must work for a single-tenant dataset where any entity type is empty (e.g. no part
  sales yet).
- **All result fields respect existing tenant-isolation and role-based-access
  checks** — a technician without Parts access does **not** see Parts results.
- **WCAG 2.1 AA:** full keyboard operability, focus rings on every interactive
  element, screen-reader announcements when results count changes ("12 results found
  across 5 categories").

---

## 10. Development Plan / Phasing

Five phases. Phase 1 unblocks 2 and 3 in parallel; phase 4 depends on 2; phase 5 is
sequential at the end.

- **Phase 0 — Spike & decisions (3 days).** Backend spikes search infra choice:
  (a) PostgreSQL pg_trgm + fuzzystrmatch vs. (b) OpenSearch/Elasticsearch. Output: a
  one-page decision doc (index size estimate, refresh strategy, fuzzy-match latency
  benchmark on synthetic 50k-customer dataset). Design open question to close:
  Show all → modal tab (recommended) vs. filtered list page.
- **Phase 1 — Backend search API (1.5 weeks).** Single **`GET /api/search`**
  accepting `q`, `scope` (one of `all`, `work_orders`, `customers`, `assets`,
  `parts`, `vendors`, `part_sales`), `context` (optional `{type, id}` for
  page-context bias), `limit` (per-group cap, default 5), `cursor` (scoped-tab
  pagination). Response = grouped, ranked, scored payload with per-group totals and
  per-item metadata sufficient to render rows without additional fetches. Includes
  indexing/backfill job, normalization pipeline, fuzzy pipeline (§7), ranking
  pipeline (§6) with weights in a **config file (not hardcoded)**, and telemetry
  table `search_event(query, scope, result_type, result_id, position, clicked,
  user_id, tenant_id, ts)`.
- **Phase 2 — Frontend modal shell (1 week, parallel).** Modal component with all
  five states (first-time, recent, typing/results, no-results, error) using mock
  data; tab strip; row component (one per entity type, shared base); keyboard nav
  handler; highlight utility; persisting-query state hook; ⌘K binding; focus
  management (focus trap + return-focus on close). All states reviewed vs. Figma.
- **Phase 3 — Integration (1 week).** Wire modal to `/api/search`; debounce; error
  states; retry; page-context provider (React context that knows the current route's
  primary entity). Hover quick-actions integrated against **existing** endpoints
  (`POST /work-orders/{id}/lines`, `POST /work-orders`, `POST /customers`, etc.) —
  only the trigger surface is new.
- **Phase 4 — Recent searches + persisting query (3 days).** Server endpoints
  **`GET /user/recent-entities`** and **`POST /user/recent-entities/touch`**; client
  records a touch on every result click and every direct entity-page visit;
  bucketing into Today / Yesterday / Past week / Past 30 days at render time.
  Persisting query stored in **sessionStorage per tab**.
- **Phase 5 — Telemetry, QA, rollout (1 week).** Telemetry validated in staging.
  E2E QA covering each empty-state path, fuzzy queries (`Petersn`, `Abrige`,
  `frieghtliner`), identifier queries (`S2-15276`, VIN, phone), page-context bias on
  Customer and WO pages, keyboard-only operation, screen reader, permission scoping
  (run as low-permission user), sparse-data tenants. **Feature-flagged rollout:**
  internal users → 10% → 50% → 100%, with a **kill switch**. Success metrics:
  search-to-click rate, time-to-first-click, zero-result rate (target ≤ 8%),
  quick-action adoption.
- **Total estimate:** ~5 weeks elapsed, 2 backend + 2 frontend engineers + 1
  designer for QA/polish, plus QA support throughout.

---

## 11. Open Questions

### From the spec ("Open Questions for Design / PM")
- **OQ-SPEC-1 (Show all target):** Does the **Show all #N** link switch the modal to
  the corresponding scope tab (spec's recommendation) or navigate to a full-page
  filtered list? To be closed in Phase 0.

### QA onboarding open questions — TO CONFIRM WITH USER
- **OQ-1 (PO / Product Owner):** Not stated in the doc. Who is the PO for Global
  Search? (Never mix PO attributions across projects.)
- **OQ-2 (Canonical spec URL):** The ingested file is a Confluence "Export to Word"
  MHTML export; the live Confluence page URL is NOT in the export. Need the canonical
  URL as a reference pointer.
- **OQ-3 (AI / "ask a question" capability):** The empty-state placeholder is
  **"Search or ask a question"** and §8 requires the system to "gracefully degrade
  when the **AI flag** is off" — this strongly implies a natural-language / AI query
  capability, but the spec does NOT define its behavior, scope, endpoint, or
  acceptance criteria anywhere else. **Is there an AI/natural-language answer feature
  in v1 scope?** If so, its behavior needs its own spec section before those cases
  can be authored. Currently unspecified beyond the placeholder + flag mention.
- **OQ-4 (Epic / Jira key):** Not stated in the doc. Need the Jira epic key for
  traceability.
- **OQ-5 (Environment / feature flag):** Feature is behind a feature flag and rolled
  out internal → 10% → 50% → 100%. Which QA environment / org will host it, and is
  the flag ON there yet? (Not yet available for VIU — see PROJECT-STATE.md.)
- **OQ-6 (Design completeness):** Design capture is currently 5 of 10 screenshots.
  The remaining 5 may reveal additional states/labels (e.g. error/"Search
  unavailable" banner, the pinned top ID-match row, the scoped-tab pagination, the
  fuzzy "≈" treatment) — confirm before final case authoring.
