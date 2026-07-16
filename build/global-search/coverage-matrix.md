# Global Search (v2) — Coverage Matrix

> Proves completeness: every in-scope spec requirement (`requirements.md`) and every
> in-scope Figma state (`design-notes.md`) maps to the GS- case(s) covering it.
> Cases are authored LOCAL-ONLY (not in TestRail). TestRail Case IDs are "pending
> push" until the user grants explicit permission (Standing Rule 6).
>
> Total cases authored: **84** across **15 sections** (14 functional + 1 API).
> API cases (12) all live under the API-titled section (Standing Rule 4).

## A. Spec requirement coverage (requirements.md)

| Spec ref | Requirement | GS- case(s) |
|---|---|---|
| §1 / §4 Part Sales | Part Sales is a NEW searchable entity | GS-TAB-08, GS-ENT-06 |
| §4 Work Orders | WO indexed/displayed fields (number, customer, status, assignee, date) | GS-ENT-01, GS-ENT-08 |
| §4 Customers | Customer name, address, open-WO count chip | GS-ENT-02 |
| §4 Assets | Year/make/model + owning customer | GS-ENT-03 |
| §4 Parts | Description, part number, qty chip w/ stock color | GS-ENT-04 |
| §4 Vendors | Vendor name + address | GS-ENT-05 |
| §4 Part Sales | P-number + customer, status, price, date | GS-ENT-06 |
| §4 Contact-field match | "Contact/info match" affordance on phone/email match | GS-ENT-07, GS-FUZ-07 |
| §5.1 Trigger | Open via header field click / ⌘K (K) | GS-KEY-01, GS-KEY-02 |
| §5.1 Surface | Centered modal, dims page behind | GS-KEY-01, GS-KEY-02 |
| §5.1 Close | Esc / underlay click / ⌘K again | GS-KEY-03, GS-KEY-04, GS-KEY-05 |
| §5.1 Footer | Keyboard legend always visible | GS-KEY-10 |
| §5.2 State 1 First-time | Placeholder + helper + 3 quick-create chips | GS-EMPTY-01, GS-EMPTY-02 |
| §5.2 State 2 Recent | Grouped Today/Yesterday/Past week/Past 30 days, mixed types, same row template | GS-REC-01, GS-REC-02, GS-REC-03 |
| §5.2 State 3 Typing/results | Tab strip, grouped results + counts | GS-TAB-01..08, GS-GRP-01 |
| §5.2 State 3 | Up to 5 per group (raised from 3) | GS-GRP-02 |
| §5.2 State 3 | "Show all N" overflow link | GS-GRP-03 |
| §5.2 Show all behavior | Show all → scoped tab in modal (OQ-SPEC-1) | GS-GRP-04 |
| §5.2 State 4 No results | "No results for '<query>'" + quick-create chips | GS-NORES-01, GS-NORES-02 |
| §5.2 State 5 Persisting | Query retained in header + count badge; restore on reopen; clear × | GS-PERS-01, GS-PERS-02, GS-PERS-03 |
| §5.3 Row anatomy | Entity icon, primary/secondary, right cluster | GS-ENT-01..06 |
| §5.3 Highlight | Matched substring highlighted | GS-GRP-06 |
| §5.3 Status/stock badges | Badge colors (WO tokens) + stock badges | GS-ENT-08, GS-ENT-04 |
| §5.4 Quick actions | WO Add new line / Asset New work order+icons / Customer New work order(+contact) / Vendor Add contact / Part Add part / Add to work order | GS-HOVER-01..06 |
| §5.4 Non-destructive | Quick actions never destructive | GS-HOVER-07 |
| §5.5 Keyboard nav | ↑/↓ skip headers | GS-KEY-06 |
| §5.5 Keyboard nav | Enter same tab / ⌘+Enter new tab | GS-KEY-07, GS-KEY-08 |
| §5.5 Keyboard nav | Tab → tab strip, ←/→ cycle tabs | GS-KEY-09 |
| §5.5 Keyboard nav | Esc close | GS-KEY-03 |
| §6.1 Per-entity ranking | WO signals (open/recency/assigned/old-closed) | GS-RANK-02 |
| §6.1 Per-entity ranking | Parts in-stock boost, out-of-stock not hidden | GS-RANK-03 |
| §6.2 Cross-entity order | Group order WO→Cust→Asset→Part→Vendor→PartSale | GS-GRP-05, GS-API-08 |
| §6.2 Pinned top | ID match >0.95 pinned single row on top | GS-RANK-01, GS-API-04 |
| §6.3 Contextual bias | Customer page boosts its assets/WOs | GS-RANK-04, GS-API-10 |
| §6.3 Contextual bias | WO page demotes parts already on WO | GS-RANK-05 |
| §7 Fuzzy trigram | Petersn → Peterson (Jaccard ≥0.35) | GS-FUZ-01 |
| §7 Fuzzy | Abrige → Aabridge | GS-FUZ-02 |
| §7 Damerau-Levenshtein | frieghtliner → Freightliner (transposition) | GS-FUZ-03 |
| §7 Double Metaphone | Filbridge → Fibridge (phonetic, last resort) | GS-FUZ-04 |
| §7 Normalization (identifiers) | WO# with/without dash/space | GS-FUZ-05, GS-API-04 |
| §7 Identifier exact-only | VIN exact-only | GS-FUZ-06 |
| §7 Phone normalization | Digits-only phone match | GS-FUZ-07 |
| §7 Identifier exact-only | Part number exact-only | GS-FUZ-08 |
| §7 Not fuzzy | Identifier typo → no fuzzy match | GS-FUZ-09, GS-API-05 |
| §7 Highlighting | Soft-match "≈"/italic indicator (design polish) | GS-FUZ-10 |
| §8 Open via click/⌘K | (functional summary) | GS-KEY-01, GS-KEY-02 |
| §8 Debounce 150ms | Input debounced before query | GS-API-12 |
| §8 Query endpoint w/ scope+context | GET /api/search | GS-API-01, GS-API-02, GS-API-10 |
| §8 Render grouped ≤200ms | Fast grouped render | GS-API-12 (perf note) |
| §8 Keyboard nav | (see §5.5 rows) | GS-KEY-06..09 |
| §8 Persist last query / rehydrate | Persisting query | GS-PERS-01, GS-PERS-02 |
| §8 Recent-entity-views 30 days | Recent activity | GS-REC-01, GS-API-11 |
| §8 Show all N overflow | Overflow link | GS-GRP-03 |
| §8 Hover quick actions | Per entity | GS-HOVER-01..07 |
| §8 Graceful degrade AI flag off | *(OUT OF SCOPE — AI, see note)* | — (OQ-3) |
| §8 Telemetry impression/click | *(mechanism only, no UI surface)* | see note (§6.4) |
| §8 Error banner | "Search unavailable, retry" | GS-ERR-01, GS-API-07 |
| §9 Latency p95 ≤250ms | Perf NFR | GS-API-12 (perf note) |
| §9 Index refresh ≤30s | Freshness NFR | see note (perf/backend) |
| §9 Empty entity type OK | Sparse-data tenants | covered implicitly by GS-TAB-08 / GS-NORES-01; VIU sparse-data pass |
| §9 Tenant isolation | Own-tenant only | GS-PERM-04 |
| §9 Role-based access | Technician w/o Parts sees no Parts | GS-PERM-01, GS-PERM-02, GS-PERM-03, GS-API-06 |
| §9 WCAG 2.1 AA | Keyboard operability, focus rings, SR count announce | GS-GRP-07, GS-KEY-06..10 |
| §10 Phase 1 GET /api/search | scope/limit/cursor/context params, grouped scored payload | GS-API-01..04, GS-API-08, GS-API-09, GS-API-10 |
| §10 Phase 1 per-group limit default 5 + totals | limit param | GS-API-03 |
| §10 Phase 4 recent-entities endpoints | GET/POST recent-entities | GS-API-11 |
| §10 Phase 5 permission scoping (low-perm user) | server-side enforcement | GS-API-06, GS-PERM-02 |
| §11 OQ-SPEC-1 Show all target | scoped tab vs full page | GS-GRP-04 (flagged) |

## B. Figma state coverage (design-notes.md)

| Screenshot | State | GS- case(s) |
|---|---|---|
| 1 | In-page Work Orders list search (banner + Clear search + columns) | GS-LIST-01, GS-LIST-02 |
| 2 | Palette grouped results (tabs, counts, highlight, Show all, per-entity rows) | GS-TAB-01, GS-GRP-01, GS-GRP-06, GS-ENT-01..05 |
| 3 | Palette anchored variant + "Refresh" link at group header | tabs/groups → GS-TAB-01/GS-GRP-01; **"Refresh" link = VIU-confirm scope (see note)** |
| 4 | Recent/default state (Today/Yesterday/…, mixed types, hover Add new line) | GS-REC-01, GS-REC-02, GS-HOVER-01 |
| 5 | Empty state (placeholder + helper + 3 quick-create buttons) | GS-EMPTY-01, GS-EMPTY-02 |
| 6 | No-results state ("No results for '<q>'" + quick-create) | GS-NORES-01, GS-NORES-02 |
| 7 | **AI search-all — OUT OF SCOPE** | **NOT AUTHORED (out of scope)** |
| 8 | **Header search component proposal — OUT OF SCOPE** | **NOT AUTHORED (out of scope)** |
| 9 | Persisting search input/dropdown (persist + count badge + clear ×) | GS-PERS-01, GS-PERS-02, GS-PERS-03 |
| 10 | Quick actions on hover, per entity type | GS-HOVER-01..06 |

## C. Deliberately NOT covered (out-of-scope) — Standing Rule + design labels

1. **AI "Search all sources" / natural-language "ask a question"** (Figma screenshot
   7, labelled "AI search (out of scope)"). NOT authored. Note: the empty-state
   placeholder "Search or ask a question" (GS-EMPTY-01) still references an AI
   capability that is out of V1 scope → **OQ-3 open**: confirm whether the placeholder
   wording ships in V1.
2. **Header search component placement proposal** (Figma screenshot 8, labelled "New
   search component proposal (Out of scope)"). NOT authored. The actual entry-point
   placement must be VIU-confirmed against the shipped build (referenced in GS-KEY-02
   notes).
3. **Telemetry impression/click logging** (§6.4, §8) — a backend/data mechanism with
   no user-facing UI surface in V1 ("no ML model in v1"); not authored as a manual UI
   case. Flag for a data/analytics verification pass if the user wants it.
4. **Index-refresh latency ≤30s** (§9) and **live data-freshness indicator** (§2
   NON-GOAL) — backend/perf; not a manual UI case. The screenshot-3 "Refresh" link may
   relate; spec §2 lists data-freshness as a NON-GOAL → **VIU-confirm whether the
   "Refresh" link is in V1 scope** before authoring a case for it.

## D. VIU-confirm placeholders (wording/behavior to verify LIVE once on QA)

These carry a "VIU-confirm" note in the case JSON and MUST be verified against the
real build during the VIU pass (feature not yet on any QA env):

- **Footer legend exact text/order** — Figma "Navigate ↓↑ · Select ↵ · Close esc" vs
  spec "↓↑ Navigate · ⏎ Select · Esc Close" (GS-KEY-10).
- **"Show all N" link** — whether the count N is in the on-screen link text (GS-GRP-03).
- **Show all target** — scoped tab (recommended) vs full-page list; OQ-SPEC-1 (GS-GRP-04).
- **Highlight treatment / color** (yellow captured) (GS-GRP-06).
- **SR announced count string** exact wording (GS-GRP-07).
- **Customer chip** — open-WO count (spec) vs doc-count (design) (GS-ENT-02).
- **Full status badge color set** — only Approved/Estimate/Declined captured (GS-ENT-08).
- **Part stock orange/red variants** — only green captured (GS-ENT-04).
- **Part Sale row cluster** (price/date/status) exact layout (GS-ENT-06).
- **"Contact/info match" label** — spec text, not in captures (GS-ENT-07).
- **Fuzzy soft-match "≈"/italic indicator** — design polish, unconfirmed (GS-FUZ-10).
- **Pinned top ID-match row** appearance/placement — not in captures (GS-RANK-01).
- **Hover conditional visibility** — WO "Add new line" / Part "Add part" vs "Add to
  work order" only when editing a WO (GS-HOVER-01, GS-HOVER-04, GS-HOVER-06); Asset
  second icon (history vs invoice vs checklist) (GS-HOVER-02); Customer "New contact"
  presence (GS-HOVER-03).
- **Error banner** "Search unavailable, retry" wording/placement + retry affordance —
  not in captures (GS-ERR-01).
- **Entry-point placement** — header component is out of scope in Figma; confirm the
  real entry point (GS-KEY-02).
- **⌘+Enter** whether palette stays open in original tab (GS-KEY-08).
- **API response shape / error status codes** — not fully specified in the doc
  (GS-API-01, GS-API-07, GS-API-11).
- **"Refresh" link** (Figma screenshot 3) — confirm V1 scope (see §C.4).

## E. Coverage summary

- Spec requirements/sections mapped: **all in-scope §1–§11 items** (see table A).
- In-scope Figma states mapped: **8 of 10** (screenshots 1–6, 9, 10). Screenshots 7
  and 8 are OUT OF SCOPE by design label → deliberately not authored.
- Gaps: **none within in-scope**. Non-authored items are the 4 out-of-scope items in
  §C (AI, header proposal, telemetry mechanism, index-refresh/data-freshness), each
  documented with rationale.
- VIU-confirm placeholders: **~20** items in §D — all carry a note in the case JSON;
  to be resolved during the live VIU pass once the feature reaches a QA environment.
