# Global Search v2 + Unified Search Framework — Technical Implementation Plan

**Date:** 2026-08-12
**PRD:** https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/576978945/Global+Search+-+Product+Requirements+Development+Plan
**Jira epic:** [SV-9160](https://shopview.atlassian.net/browse/SV-9160) (stories SV-9161…SV-9176)
**Design:** [claude.ai/design — global-search](https://claude.ai/design/p/fac6efcf-a972-4c02-96a5-def12ed8b037?file=preview%2Fglobal-search.html&via=share) (PRD v1.1 header; source `global-search.jsx` — verified 2026-08-17: all 9 entity rows, 10 tabs with counts, no Show-all link, quick actions rendered). **Mobile:** same design project, file [`Mobile Global Search.html`](https://claude.ai/design/p/fac6efcf-a972-4c02-96a5-def12ed8b037?via=share&file=Mobile+Global+Search.html) — added 2026-08-19, **not inspected by this plan's author** (the share link needs a browser session); see FR-022. Older Figma frames superseded where they disagree.
**Tech stack:** PHP 8.5 / Symfony 7.4 / MySQL Aurora + **AWS OpenSearch Service (managed domain)** · Vue 3.5 / Quasar 2 / Vite · Playwright
**Estimated complexity:** High

This plan supersedes the search-read-tier ADR draft referenced by SV-9161 (that draft was never committed and no longer exists anywhere) — the infrastructure decision is made here (§3, D9). If a standalone ADR is still wanted, commit the §3 decision as a new ADR under `docs/adr/` (residual scope on SV-9161).

---

## 0. Execution State

_Keep this block current so any agent (or person) can resume mid-flight — this plan may be executed by someone who did not write it._

- **Status:** **Ready to implement, all phases.** SV-8785 preflight satisfied (below); the mobile design exists and will be on the implementing dev's machine (FR-022) — read it during Phase 4 rather than treating it as a blocker.
- **Current phase:** —
- **Last completed:** Planning + PRD/ticket alignment pass (2026-08-20)
- **Mobile design located 2026-08-20:** `Mobile Global Search.html` in the same claude.ai design project (link in the header). Confirmed by the user as straightforward and available on the dev machine at implementation time — FR-022's four points are answered by reading it, not by a design round-trip.
- **Alignment pass 2026-08-20:** analytics removed from v1 (D20 — `search_event`, FR-010, NFR-008 deferred to v2; SV-9167 moved to Board Backlog); the rollout metrics, baseline capture and monitoring window removed (they came from PRD §10 Phase 5, a section that no longer exists in PRD v1.1); FR-022 added for the mobile design. All 13 epic stories + the Phase 3/6 verification tickets updated to match this plan. Product notified via a comment on the PRD page.
- **⚠️ Tickets follow THIS PLAN, not the PRD.** Several v1 decisions deliberately depart from the PRD (nine entities, no Show-all link, no AI row, no feature flags, OpenSearch rather than the PRD's Postgres stack, no telemetry). Where a ticket, the PRD and this plan disagree, this plan wins.

**✅ Pre-implementation preflight — SATISFIED (verified 2026-08-20).** SV-8785 (filters + page search, [PR #2462](https://github.com/ShopView/shopview/pull/2462)) **merged to `develop` on 2026-08-19** and is heading to prod. All four page-search prerequisites confirmed present on `origin/develop`:

| File | Status |
|---|---|
| `app/src/components/ts/shared/filters/PageSearchInput.vue` | ✅ |
| `app/src/composables/usePageSearchSession.ts` | ✅ |
| `app/src/composables/usePageSearchUrlSync.ts` | ✅ |
| **`app/src/components/forms/Table.vue`** — `builtInSearch` prop | ✅ (note the path: `components/forms/`, **not** `components/ts/shared/`) |

Branch off `develop` and this world already exists. Do not build page-search UI inside this plan — it is SV-8785's, already delivered. **D14's "parallel work, resolve conflicts at merge" is moot**: SV-8785 landed first, so Phases 4–5 build on top of it rather than racing it.

**Ops-owned gates:** every staging/prod step (Terraform apply, staging `search:index:create`/`search:reindex`, staging p95 measurements, the prod rollout) requires AWS access the implementation agent doesn't have — the domain is VPC-only. These bullets are executed by Milan/devs; the agent prepares the commands and asks.
- **Open questions / blockers:** ~~SV-8785 not yet merged~~ — **resolved, merged 2026-08-19 (see preflight above)**. Resolved on resume 2026-08-17 (Branko reply + PRD v1.1 + new claude.ai design): non-goals removed, identifiers confirmed, sales-rep deferred, 9-entity design delivered; Show-all → tabs-only (D15), design group order (D16), no AI in v1 (D17), quick actions back in v1 (D18). Outstanding: PO display format ("PO-3241" in design vs `S-/I-/P-` stored) and Vendor-Invoice Paid/Unpaid + Invoice/Sublet fields (BE verification → Product follow-up in reply comment); §2 goals Contacts typo to be fixed by Product.

> 🛑 **About to implement this plan? Run it as `/loop /implement <this-file>`.** This plan is meant to be executed by the `/implement` orchestrator inside a `/loop` — that combination is what adds the code-review loop, the Phase 5 runtime gates (migration / compile / smoke / browser-walk), the mandatory E2E ask, and phase-by-phase hands-off execution. Free-hand implementation skips all of it.
>
> - **However you were handed this** — "implement it", "here's the path, do it", or a single phase — do **not** start editing code directly. Route through `/loop /implement <this-file>` (or `/loop /implement Phase N from <this-file>` for one phase). That *is* "doing the implementation" — just with the gates. Announce that you're routing through `/loop /implement` and proceed; no need to ask.
> - **If you are ALREADY running under `/loop /implement`**, ignore this note and continue — you're in the right place.
> - **If you are a sub-agent** (`be-implementer`, `fe-implementer`, …) without orchestration tools, do **not** invoke `/loop` or `/implement` — that's the orchestrator's job. Execute only the scope you were handed and report back.
> - **Precedence:** only a *live, explicit* user instruction to the contrary wins — if the user in this session says to implement directly or skip the loop, honor that. Being handed just the plan path is **not** such an instruction; absent one, default to `/loop /implement` without asking.

---

> 📌 **Missing PRD content — check with the user at implementation time.** This plan and the epic's tickets were written against PRD sections that no longer exist in v1.1: **§10** (rollout phases, the `search_event` schema, the config-file-weights requirement, the feature-flag rollout) and an apparent **§11** (FR-020's "ten PRD areas" for QA coverage). Everything load-bearing has already been carried into this plan, so **implementation is not blocked**. Two comments are open on the PRD page asking Product to resolve it. **If, at the moment of implementation, something referenced here is still missing from the PRD and actually matters for the work in hand — raise it with the user then.** Do not stall on it, and do not go hunting for the retired sections.

## 1. Requirements (extracted from PRD + intake directives + resolved comments)

### Functional

- **FR-001 (SV-9162):** `GET /api/search` accepting `q`, `scope`, `context {type,id}`, `limit` — grouped, ranked results with **true per-group totals**; every row renders with no follow-up fetch.
- **FR-002 (SV-9162):** Nine searchable entity types: Work Orders, Part Sales, Customers, Contacts, Assets (vehicles), Parts (**inventory `part`, not `catalogue_part`** — scope change vs. today), Vendors, Purchase Orders, Vendor Invoices.
- **FR-003 (SV-9162):** Customer/Vendor rows matched on a contact field (phone/email) carry a "Contact/info match" flag (preserves today's affordance).
- **FR-004 (SV-9163):** Index backfill + incremental maintenance, staleness ≤ 30s incl. **deletes**; WO documents reindex on **line** changes (D12); per-tenant and per-entity **reindex console commands with criteria filters** (required for rollout and maintenance, D10).
- **FR-005 (SV-9164):** Normalization + identifier parsing. Two analyzer chains (PRD §7): **text/name** = lowercase + diacritic stripping (`asciifolding`) + whitespace collapse + hyphens/apostrophes optional; **identifier** adds strip-non-alphanumerics. All SV-3210 variants: WO number ×7 forms (`S3-3512`, `3512`, `S33512`, `S3 3512`, `S3*3512`, `S3.3512`, `33512`), unit ×8 forms (`Unit:546`…`UNIT#: 546`), part number ×9 forms, phone digits regardless of punctuation.
- **FR-006 (SV-9164):** Fuzzy matching per PRD §7's two-stage pipeline — n-gram candidate generation (**Jaccard ≥ 0.35**), normalized Damerau-Levenshtein refinement (similarity `1−(distance/max(len))`, accept **≥ 0.70** for queries ≥4 chars, **≥ 0.80** shorter), phonetic fallback (names only, reduced score ≤ +0.20). NOT `fuzziness: AUTO` — its absolute edit-distance ladder is neither PRD-conformant nor tunable. **Threshold enforcement happens engine-side** (ngram clause `min_score` + a rescore window computing the normalized-DL similarity) so per-group totals and cursor pagination stay engine-authoritative — any app-side DL computation only *annotates* the match descriptor, it never drops engine hits. Candidate-set cap 10k (config), inside the NFR-001 budget. **Identifiers (VIN, WO/P/PO number, part number) are never fuzzy.** All thresholds live in config.
- **FR-007 (SV-9165):** Ranking per PRD §6 signals, weights in config (no deploy to tune). Pinned top-hit above groups when score > 0.95. Match-quality clauses include the **primary-display-name bonus (+0.10)** on top of exact/prefix/word/fuzzy; final score is **clamped**. Group order (D16, per new design): **WO → Customers → Contacts → Assets → Parts → Vendors → Part Sales → POs → Vendor Invoices**. Ties break by recency.
- **FR-008 (SV-9165):** Contextual bias via `context` param: Customer page boosts that customer's assets/WOs (+0.20); WO page demotes parts already on the WO (−0.10), boosts same-category parts (+0.05). **At most one contextual bias applies per result** (PRD §6.3 "single signal" — clauses are mutually exclusive, never additive).
- **FR-009 (SV-9166):** Recent-entities API — `POST /api/user/recent-entities/touch` (result clicks + direct entity-page visits) and `GET /api/user/recent-entities`; 30-day retention, per-user + per-tenant, permission-filtered on read, deleted entities excluded, deduplicated (re-view moves up).
- **FR-010 (SV-9167) — ~~Telemetry~~ DEFERRED TO v2 (D20).** `search_event` is cut from v1: its only specified consumer is PRD §6.4's offline CTR weight-tuning job, which is itself post-v1 with no ticket and no owner, so v1 would ship a write-only table holding raw customer names, phones and VINs. Ranking stays tunable meanwhile via the config weights (FR-007, no deploy needed). This **overrides** PRD §6.4's "schema is in place from day 1" — decided by the user 2026-08-20, recorded on the PRD page for visibility, not for approval. SV-9167 is parked in Board Backlog. If ranking-tuning is ever scheduled, land the table ≥30 days ahead of it so §6.4 has history.
- **FR-011 (SV-9168):** Modal shell — ⌘K/Ctrl+K + header-field click open (⌘K hint chip rendered inside the header field, as today); five states (first-time, recents, results, no-results, error); first-time helper text **"Type to start searching for work orders, parts, customers and more"** + the three chips **`+ New work order` / `+ New customer` / `+ New inventory part`** (same chips on no-results); focus trap + return-focus; footer legend always visible, verbatim **"↓↑ Navigate · ⏎ Select · Esc Close"**; placeholder is **plain search copy** (D5 — no AI in v1, replacing "Search or ask a question").
- **FR-012 (SV-9169):** Permission-aware scope tab strip (no tab for entity types the user can't see); groups with true totals capped at 5 rows; pinned top-hit row slot.
- **FR-013 (SV-9169 + D15, supersedes the Show-all design):** **No Show-all link.** Scoped tabs carry live counts (`Work Orders (12)`) and a scoped tab shows the **full result list** — scoped default limit 25 with cursor/load-more pagination inside the modal. No list-page banner (dropped with the old Figma flow); `?search=` URL prefill remains available via SV-8785 but the modal no longer targets it.
- **FR-014 (SV-9170):** One shared base row + 9 variants; status/stock badges reuse the existing color tokens (extracted to shared helpers, not duplicated); match highlighting driven by the API match descriptor; unit number bolded on Asset rows (SV-3210); **per-type leading entity icon on every row including the pinned top hit** (design's Lucide set: clipboard-list WO, building customer, user-round contact, truck asset, cog part, store vendor, shopping-cart part sale, package PO, file-text VI); Part rows navigate to **inventory**, not catalogue. Right-side cluster hosts the quick actions (D18/FR-021).
- **FR-015 (SV-9171):** Keyboard navigation per PRD §5.5 (↑↓ skip group headers, Enter / ⌘+Enter, Tab → strip, ←→ cycle tabs, Esc close).
- **FR-016 (SV-9172):** Recents bucketing (Today/Yesterday/Past week/Past 30 days) client-side; persisting query per tab (`sessionStorage`), reopening restores query + scope + results.
- **FR-017 (SV-9174):** 150ms debounce, in-flight cancellation / out-of-order guard, inline "Search unavailable, retry" banner, shared page-context composable (route → primary entity).
- **FR-018 (SV-9162/9163, intake):** **SearchProvider framework** — port + adapters; page search on the WO / Inventory Parts / Customers list pages served by the same engine with identical matching; adding a new searchable entity = one provider class + mapping (NFR-011). Exports keep their current DBAL path in v1 (flagged in §6 Phase 5).
- **FR-019 (SV-9176, D10):** Rollout **without feature flags** — ships for everyone. Prod backfill via reindex commands; old `GET /api/global-search/fetch` + `FetchData/` handler + client-side filtering removed after stabilization; SV-6325 (subsumed), SV-3210 (delivered/re-filed per ask, incl. vendor-invoice search: **delivered here**), SV-4977 (tags carried into the index) reconciled.
- **FR-020 (SV-9175):** QA/E2E coverage per the ten PRD areas (see §7 and per-phase E2E sections).
- **FR-021 (SV-9173, D18 — reinstated):** Quick actions on result-row hover per the new design's action set — WO → `Add new line` (only when currently editing a WO elsewhere), Customer/Contact → `New work order`, Asset → `New work order` + history/invoices icon buttons, Part → `Add to work order` (when editing a WO) / `Add part`, Vendor → `Add contact`, Part Sale → `Add part`, PO → `Receive`, Vendor Invoice → none. Never destructive; every action keyboard-reachable (NFR-006); reuses existing endpoints (`POST /work-orders`, `POST /work-orders/{id}/lines`, receive-delivery flow, …) — any missing endpoint is raised, not built ad-hoc; "Currently editing a WO" state comes from the shared page-context composable (FR-017) — one source of truth.

- **FR-022 (PRD Change Log 2026-08-19 — "Added mobile design"):** the search surface must work on mobile/tablet viewports per [`Mobile Global Search.html`](https://claude.ai/design/p/fac6efcf-a972-4c02-96a5-def12ed8b037?via=share&file=Mobile+Global+Search.html) in the design project (added 2026-08-19). **Open this file first — the plan's author could not (the share link needs a browser session), so nothing below is derived from the actual frames.** The user confirms the design is straightforward and will be available on the implementing machine. **The PRD body was not updated** — §5.1 still specifies a desktop-only centred modal (640×~700) and §5.4 gates quick actions on "(desktop, pointer present)". Confirm with design **before Phase 4 FE work** — (a) centred modal vs full-screen sheet below Quasar's `sm` breakpoint; (b) how quick actions (FR-021) are reached without hover — tap-to-reveal, row overflow menu, or suppressed on touch; (c) whether the ⌘K hint chip and the footer keyboard legend (FR-011) are hidden on touch; (d) tab-strip overflow/scrolling with up to 10 tabs on a narrow viewport. Supersedes the SV-3210 "mobile/tablet responsiveness" ask (§6 Phase 6 step 3) instead of re-filing it.

  > **If that design file is unreachable or empty when Phase 4 starts, stop and ask the user running the implementation** to either supply the mobile design or explicitly decide to skip mobile for v1. Do **not** infer a mobile layout from the desktop frames, and do not silently ship desktop-only.

### Non-functional

- **NFR-001 (PRD):** search p95 ≤ 250 ms up to 100k entities/tenant (largest real tenant today: 15k WOs / 53k parts — measured 2026-08-12).
- **NFR-002 (PRD):** index staleness ≤ 30 s for create/update/delete.
- **NFR-003 (PRD, 🔴 CRITICAL):** tenant isolation baked into **every document** (org_id + workplace_id where applicable) and **every query** (a missing org/workplace filter in an OpenSearch query is the ES-equivalent of a missing `OrganizationDecorator`). Contacts scope via `company.organization_id` (`customer.company_id` is nullable → company-less contacts are excluded from the index and counted in backfill output).
- **NFR-004 (PRD, 🔴):** permission filtering per FE bundles — authoritative 9-entity mapping: `work_orders`→`workOrdersView` · `part_sales`→`partSalesView` · `customers`/`contacts`/`assets`→`customersView` · `parts`→`catalogInventoryView` · `vendors`/`purchase_orders`/`vendor_invoices`→`vendorOrderManagementView` (POs/VIs sit under Vendor & Order Management per the ACL spec). Hidden groups leak neither rows nor counts; TimeClock role → empty result. FE note: today's `SEARCH_TYPE_PERMITTED` map in `routingService.ts` keys on display names and routes Part Sale via the WorkOrders route map — the modal migrates it to this bundle-code mapping (fail-closed for unknown types stays).
- **NFR-005 (PRD §9 "existing role-based-access checks", 🔴):** See Financial Data (`PricingVisibilityProvider::canSeePricing()`) masks every price field in results (part purchase/sell price, part-sale total, WO total, PO total, vendor-invoice total). Mask in response DTOs; never persist masked values (SV-8318 bug class).
- **NFR-006 (PRD):** WCAG 2.1 AA — full keyboard operability, focus rings, result-count live-region announcements in the PRD's format: **"12 results found across 5 categories"**.
- **NFR-007 (PRD):** grouped results render ≤ 200 ms p95 after response; empty entity types render correctly (no empty group headings).
- **NFR-008 — dropped with FR-010 (D20).** Covered telemetry ingest only; no telemetry in v1, so nothing to constrain. (Retention/PII treatment of the `query` column goes away with it — the PRD never specified either.)
- **NFR-009 (analysis):** backfill must not saturate the Aurora writer (batch reads, pacing).
- **NFR-010 (D10/D11):** indexing never runs in-request — user requests only enqueue; no request may slow, time out, or fail because of indexing. Known bulk triggers that must stay safe: Data Import (customers/vehicles/parts, BATCH_SIZE=500), receive-order, WO split, vehicle merge, company-rename fan-out.
- **NFR-011 (intake):** extensibility — adding a searchable entity requires implementing one interface + mapping + running the reindex command; documented in `api/.claude/reference/`.

### Clarifications & PRD comment outcomes

| Question | Asked via | Answer |
|----------|-----------|--------|
| Unify page + global search on one engine; analyze all searchable models; ACL included; AWS ES; propose cluster; extensible framework | intake (user directives at wizard start) | All adopted — they shape FR-018, NFR-003/004/011, §3 |
| v1 entity scope: 6 or 9? | user | **9 entities** (Contacts, POs, Vendor Invoices added per Product comments) |
| Quick actions in v1? | user | 2026-08-12: moved to v2 per Product comment → **REVERSED 2026-08-17 (D18)**: back in v1 per the new design's action set |
| Page-search cutover scope | user | Framework + global search + **WO/Parts/Customers list cutover** |
| `Show all N` behavior | user + Figma 12145:20155 | 2026-08-12: full-page navigation per old Figma → **REVISED 2026-08-17 (D15)**: new claude.ai design drops the link entirely; **tabs with live counts + scoped full list (cursor/load-more)**; no list-page banner |
| AI "ask a question" placeholder | user | No AI in v1; plain search placeholder copy |
| Draft ADR 0001 (not in tree) | user | Superseded by this plan |
| Feature-flagged staged rollout (PRD §10) | user | **No flags at all** — direct rollout for everyone; PRD §10 treated as non-binding tech prescription |
| WO line descriptions in the WO doc | user | **Keep** per PRD §4 (drives reindex-on-line-change) |
| Realtime vs async doc building | user | **Async in v1** — known bulk triggers exist (imports etc.); requests only enqueue |
| Local dev engine | user | Official `opensearchproject/opensearch:2` container in compose — free; no localstack layer; paid domains only staging+prod |
| Corpus sizing | prod query (run 2026-08-12) | `work_order` 250,038 (235,937 service / 13,366 parts) · `company` 151,637 · `customer` 185,643 · `vehicle` 345,775 · `part` 866,724 · `part_vendor` 55,095 · `inventory_order` 120,878 · `inventory_delivery` 131,711 · lines 523,474. **≈ 2.1M docs, ~700MB source.** Largest org: 15,077 WOs; largest workplace: 53,157 parts. → small managed domain suffices (§3) |
| Portal contacts endpoint (`GET /api/portal/customers`) unscoped | user | **Not fixed here** — External/portal namespace, not core app; recorded as observation (§9) |
| SV-8785 not merged | user | Parallel work; resolve conflicts at merge (§2, §6 Phase 4/5 notes) |
| Mobile design | PRD Change Log 2026-08-19 (Branko) | Mobile frames **added to the design**; PRD body still desktop-only. Recorded as **FR-022**; the four layout/interaction points listed there need design confirmation before Phase 4 |
| Search telemetry (`search_event`) in v1? | user (2026-08-20) | **No — deferred to v2 (D20).** Its only consumer (PRD §6.4 CTR weight-tuning) is post-v1 and unowned, so v1 would ship a write-only table of names/phones/VINs. Ranking stays tunable via config weights. **Overrides** PRD §6.4's "schema in place from day 1"; PRD commented for visibility. SV-9167 parked in Board Backlog, not deleted |

| Resume 2026-08-17 — Branko reply 776437766 + PRD v1.1 | confluence | Non-goals **removed from spec**; design rows for all 9 entities **delivered** in the new claude.ai design; identifiers **confirmed**; sales-rep deferral **confirmed** |
| Show-all / group order / AI row / quick actions vs new design | user (2026-08-17) | D15 tabs-only · D16 design group order · D17 still no AI in v1 · D18 quick actions back in v1 |

Design-vs-data verification (BE check, 2026-08-17): **VI payment badge** = `vendor_transaction.vendor_transaction_status` (tri-state `unpaid`/`partially_paid`/`paid`; LEFT JOIN on `reference_id = inventory_delivery.id` + type `delivery`; nullable; do NOT reuse the buggy `VendorTransactionType::getLabel()`); **"Invoice/Sublet" type label has no data source** — dropped from v1, flagged to Product; **PO numbers keep the real spliced format** (`S12-1234` via `formatWorkOrderId`) — the design's "PO-3241" is net-new and contradicts the confirmed identifiers; design to update.

Remaining with Product (reply comment pending approval): fix §2 goals typo (Contacts missing, "Vendors" duplicated); update §5.2 (Show-all text) to the shipped tabs-only behavior; resolve Sasha's PS-second comment vs the design's group order; VI badge is tri-state (not binary) and "Invoice/Sublet" dropped pending a data model; PO rows use the real number format. Design-polish assumptions: fuzzy soft-match `≈` treatment, zero-result tab appearance.

## 2. Architecture Overview

```
                       ┌────────────────────────── app/ (Vue 3 + Quasar) ──────────────────────────┐
                       │  Header field + ⌘K ──► SearchModal (5 states, tabs w/ counts, rows,        │
                       │        │                keyboard, quick actions; scoped tab = full list)   │
                       │        ▼                                                                   │
                       │  GET /api/search        GET/POST /api/user/recent-entities                     │
                       └───────┬────────────────────────┬───────────────────────────┬───────────────┘
                               ▼                        ▼                           ▼
   api/src/Search/ (new bounded context)        user_recent_entity            list endpoints
   ┌──────────────────────────────────────┐        (MySQL)              (WO / parts / customers)
   │ UI: SearchController                 │                                   │ search term only
   │ Application: SearchQueryHandler      │◄──────────────────────────────────┘ via SearchProvider
   │   • per-section permission gate      │        (hybrid: OpenSearch → ids → existing DBAL query)
   │   • tenant filter on every query     │
   │   • ranking weights from config      │
   │ Domain: SearchProviderInterface ─────┼──► Infrastructure: OpenSearchSearchProvider
   │         SearchDocumentProvider (×9)  │         (opensearch-php, one index per entity type)
   └──────────────┬───────────────────────┘
                  │ async only (NFR-010)
   Doctrine listener (LogCommandBus pattern) ──► ReindexDocumentsJob (AsyncJob → SQS/doctrine)
   entity change → affected root doc IDs         └─► DocumentProviders build docs → bulk upsert/delete
   backfill / reindex console commands ──────────────► same providers, batched, writer-safe (NFR-009)

   MySQL = source of truth. OpenSearch = disposable read model (rebuildable via reindex commands).
```

Index layout: **one index per entity type**, versioned name + alias (`search_work_orders_v1` → alias `search_work_orders`), each document carrying `organization_id` (+ `workplace_id` for WO/PS/Part/PO/VendorInvoice). Global search = `msearch` across permitted entity indexes (giving per-group totals + top N per group in one round trip); page search = single-index query returning IDs.

**SV-8785 coordination (D14):** the filters + page-search redesign (PR #2462) is in flight. It moves page search out of the global-search seam and gives all three list pages `?search=` URL prefill — exactly what FR-013 targets. Overlap: `api/src/VehicleService/WorkOrders/Application/List/ListingQueryHandler.php` (BE, additive on their side) and the three list pages (FE). **Work proceeds in parallel; whichever lands second resolves conflicts.** Phases 4–5 FE tasks assume the SV-8785 world (PageSearchInput, URL-synced `search`); if it hasn't merged when Phase 5 starts, rebase Phase 5 onto the branch or hold Phase 5 last.

## 3. Technical Decisions

- **Engine: AWS OpenSearch Service managed domain (D9)** — chosen over: *OpenSearch Serverless* (redundant-prod OCU floor ≈ $700+/mo — wrong shape for a ~2.1M-doc, low-QPS corpus), *Typesense/Meilisearch* (compelling DX but self-hosted on ECS: Raft-cluster ops / single-writer OSS respectively — fails the AWS-managed constraint), *MySQL FULLTEXT+ngram* (keeps load on the DB that had the 2026-06-05 CPU incident; weaker fuzzy; no framework win). MySQL remains source of truth; the index is disposable.
- **Sizing (D9, grounded in prod counts):** prod domain **2× `t4g.small.search`, multi-AZ, 1 replica, ~30GB gp3 each** (~$60–90/mo); staging **1× `t4g.small.search`** (~$30/mo); qa/sandbox none (compose container if ever needed). Upgrade path: `m6g.large.search` if burstable CPU wobbles. Version: newest 2.x offered by AWS; local image pinned to the same minor. Enable the bundled **`analysis-phonetic` plugin** (Double Metaphone) — supported on managed domains; installed in the local image via a small Dockerfile.
- **Local dev:** official `opensearchproject/opensearch:2` single-node in `docker-compose.yaml` (profiles `[be, full]`, security plugin disabled, healthcheck), like the existing `redis` service. **No localstack** — it boots the same engine behind a provisioning shim the app never calls.
- **Client library:** `opensearch-project/opensearch-php` (new composer dep) with SigV4 request signing via the already-present `aws/aws-sdk-php` for AWS envs; plain HTTP locally.
- **Framework shape (NFR-011):** `SearchDocumentProviderInterface` per entity (tagged service): `entityType()`, `interestedIn(): array<class-string, callable>` (maps a changed Doctrine entity → affected root doc IDs — e.g. `Line` → its WO id, `Company` rename → its WO/vehicle doc ids), `buildDocuments(array $ids)`, `backfillQuery()`. Adding an entity = one provider + one index mapping + reindex run.
- **Index maintenance hook:** Doctrine lifecycle listener modeled on `api/src/AuditLog/Log/Infrastructure/Doctrine/LogCommandBus.php` (`#[AsDoctrineListener]` postPersist/postUpdate/postRemove) collecting affected `(entityType, docId)` pairs per request into a new request-scoped collector service (dedup; deferral pattern à la `DeferredEventMiddleware` — note: no reusable collector class exists today), flushing **one** `ReindexDocumentsJob` (extends `App\Shared\Infrastructure\Messenger\AsyncJob`, auto-routed to the `async` transport → SQS in prod) after commit. Domain events are NOT the hook — WO lines have no CRUD events (BE research §4). Unlike LogCommandBus, the listener must stay active in CLI (backfill emits nothing extra: commands write directly through the providers).
- **Cross-entity fan-out:** provider interest maps handle it (company rename → bounded reindex of its WOs/vehicles/contacts docs). Fan-out >N docs (config, default 500) chunks into multiple jobs — the async queue absorbs imports and mass edits (NFR-010).
- **Ranking:** OpenSearch `function_score` — match-quality from query structure (exact-normalized identifier `term` > name prefix > whole word > fuzzy, plus the +0.10 primary-display-name bonus, each a scored clause; final score clamped), entity signals from indexed fields: static flags denormalized (open status, on-hand qty, bin present, open-PO flag), **time signals stored as raw dates/counts and windowed at query time** (`exp` decay with half-life via `scale`+`decay: 0.5` — 14d WO updates, 7d Part Sales; `range` clauses for the 30d/90d windows) so aging documents never need reindexing; per-user boosts via `term`/`terms` clauses — "viewed last **7 days**" from `user_recent_entity` IDs filtered to `viewed_at >= now-7d` (window in config, bounded ≤100), "assigned to current user" on the WO doc's `assigned_user_ids`, "created-by current user" on the Part Sale doc's `created_by_user_id`; contextual bias via `context` param clauses (mutually exclusive, FR-008). **All weights/half-lives/windows/thresholds in `api/config/packages/search.yaml` parameters** — tunable without deploy (`%search.weights.wo_open_status%` style), per-env overridable.
- **Identifier handling (FR-005):** custom normalizer (lowercase, strip non-alphanumerics) on keyword subfields; document stores all display variants (via `ShopIdSplicedNumberSearchFields` logic ported into the doc builders); query side parses `unit:`/`unit#`-style prefixes before matching. Exact identifier clauses bypass fuzziness entirely.
- **Page-search cutover = hybrid ID-injection:** when a list request carries a search term, the handler asks `SearchProviderInterface` for ranked matching IDs (tenant-scoped, capped 10k) and replaces the `SearchDecorator` LIKE-clauses with `x.id IN (:ids)`; filters/sort/pagination/response shape stay MySQL. Zero response-contract change, exports and the other ~78 SearchDecorator call sites untouched.
- **Rollout (D10):** no feature flags, no staged percentages. Sequenced cutover by deploy: infra → backfill → endpoint live → FE modal replaces dropdown → page-search cutover → old path removal. Rollback = redeploy previous release (old endpoint/code kept intact until the final removal phase); the index is rebuildable at any time via reindex commands.
- **New dependencies:** `opensearch-project/opensearch-php` (BE). None on FE.
- **Decision registry** (full context in the §1 clarifications table): D1 nine entities · D2 quick actions→v2 *(superseded by D18)* · D3 cutover scope (framework + global + 3 list pages) · D4 Show-all full-page nav *(superseded by D15)* · D5/D17 no AI in v1 · D6 plan supersedes lost ADR · D7 consolidated Confluence comms · D8 PS-second group order *(superseded by D16)* · D9 OpenSearch managed domain + sizing · D10 no-flag rollout · D11 async indexing v1 · D12 WO line texts kept · D13 portal contacts hole out of scope · D14 SV-8785 parallel/merge · D15 tabs-only, no Show-all · D16 design group order · D17 no AI row · D18 quick actions in v1 (new action set) · D19 VI tri-state badge, no Invoice/Sublet, real PO format · D20 telemetry (`search_event`, FR-010/NFR-008) deferred to v2 — no v1 reader, PII with no retention owner.

## 4. Database Changes

MySQL gains **one table only** (the search index lives in OpenSearch, not MySQL; `search_event` deferred per D20).

### New tables

**`user_recent_entity`** (FR-009) — Doctrine-mapped entity in `api/src/Search/Domain/RecentEntity.php`:

```sql
-- Illustrative shape only, NOT the migration to copy-paste
CREATE TABLE user_recent_entity (
  id BINARY(16) NOT NULL PRIMARY KEY,
  user_id BINARY(16) NOT NULL,
  organization_id BINARY(16) NOT NULL,
  entity_type VARCHAR(32) NOT NULL,
  entity_id BINARY(16) NOT NULL,
  viewed_at DATETIME NOT NULL,
  UNIQUE KEY uniq_user_recent_entity (user_id, organization_id, entity_type, entity_id),
  KEY idx_user_recent_entity_read (user_id, organization_id, viewed_at)
);
```

Touch = upsert (`INSERT … ON DUPLICATE KEY UPDATE viewed_at`), cap 100/user enforced on write, 30-day cutoff on read + periodic cleanup command.

> ⚠️ Migrations are written **by hand** and verified as a no-op with `bin/console doctrine:migrations:diff --allow-empty-diff` ("No changes detected"). DBAL's schema tools choke on functional/expression indexes in this repo (`communication_note` — hidden by `api/src/Shared/Infrastructure/Doctrine/Schema/ExpressionIndexFilteringMySQLSchemaManager.php`), so the real migration is produced by the implementer against the live schema. Hand-authored FKs must be registered in `MANUALLY_MANAGED_FOREIGN_KEYS` (same class). Index names globally unique (SQLite functional tests). See `api/.claude/reference/database.md`.

### Data migrations

None in MySQL. OpenSearch backfill = `bin/console search:reindex` (Phase 2), batched reads (NFR-009), resumable, per-entity/per-tenant/`--since` criteria (D10).

## 5. API Changes

### New endpoints

**`GET /api/search`** (FR-001) — `api/src/Search/UI/HTTP/SearchController.php`
- Params: `q` (required, ≥2 chars), `scope` (`all` default | `work_orders` | `part_sales` | `customers` | `contacts` | `assets` | `parts` | `vendors` | `purchase_orders` | `vendor_invoices`), `context[type]`/`context[id]` (optional), `limit` (per-group, default 5, scoped default 25, max 50).
- Auth: authenticated (`/api` firewall); **no coarse atom** — per-section FE-bundle gating in the handler (same accepted pattern as SV-7952; decision recorded here per the Golden-Rule process). TimeClock → empty result. Tenant + workplace filters on every OpenSearch query (NFR-003 🔴).
- Response: `{ pinned: Item|null, groups: [{ type, total, items: Item[] }] }`; `Item` = `{ id, type, primary, secondary, fields{...per-entity display data}, score, match: { field, kind: exact|prefix|word|fuzzy|phonetic, highlight }, contactInfoMatch: bool }`. Prices inside `fields` masked per NFR-005.
- Pagination: none on `all` (top 5 per group + true totals); scoped requests use `limit` (default 25) + opaque `cursor` (`search_after`-based) for in-modal load-more (D15). Totals are engine-computed with `track_total_hits: true` (never the 10k default cap); fuzzy thresholds are enforced in the engine so totals and cursor pages are deterministic.
- Errors: 400 (short/missing q), 503 with `Retry-After` when OpenSearch is unreachable (FE shows the retry banner).

**`GET /api/user/recent-entities`** / **`POST /api/user/recent-entities/touch`** (FR-009) — `api/src/Search/UI/HTTP/RecentEntitiesController.php`. GET returns the same `Item` DTO as `/api/search` (one row contract on FE), permission-filtered + existence-checked on read; POST body `{type, id}`, fire-and-forget cheap upsert.


### Modified endpoints

| Endpoint | Change |
|---|---|
| `GET /api/work-orders` (`ListingQueryHandler`) | search term → SearchProvider ID-injection replaces the 16 LIKE fields; filters/sort/shape unchanged (SV-8785 overlap — D14) |
| `GET /api/inventory/parts` (`DbalPartListFetcher::searchParts`) | same — replaces the 13 LIKE fields incl. tags subquery (the known worst offender) |
| `GET /api/customer/listing` (`Customer/Customers/Application/Listing`) | same — replaces the 9+2 LIKE fields |
| `GET /api/global-search/fetch` | untouched until Phase 6 removal |

## 6. Implementation Phases

### Phase 1: Infrastructure + framework core
**Implements:** FR-018 foundations, NFR-003/010/011 groundwork · **Depends on:** nothing

#### Infrastructure changes:
| File | Action | Description |
|------|--------|-------------|
| `infrastructure/environments/_shared/opensearch.tf` | Create | `aws_opensearch_domain`, VPC mode, SG with VPC-CIDR ingress :443, `prevent_destroy`, per-env sizing vars — modeled on `redis.tf`; symlink into all four env dirs (staging+prod sized, qa/sandbox count=0) |
| `infrastructure/environments/_shared/variables.tf` | Modify | opensearch sizing/version vars with safe defaults |
| `infrastructure/environments/{production,staging}/terraform.tfvars` | Modify | prod 2× t4g.small.search multi-AZ + replica; staging 1× t4g.small |
| `infrastructure/modules/services/shopview/templates/*task-definition.json.tpl` + `ecs-service-api.tf` + `_shared/main.tf` | Modify | `OPENSEARCH_URL` env var threaded tfvars → module → task defs (all templates) |
| `docker-compose.yaml` | Modify | `opensearch` service (official 2.x image + analysis-phonetic, single-node, security disabled, healthcheck, profiles `[be, full]`) |
| `api/.env` | Modify | `OPENSEARCH_URL=` placeholder (local value in compose `environment:` / `.env.local`) |

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/composer.json` | Modify | add `opensearch-project/opensearch-php` |
| `api/src/Search/Domain/SearchProviderInterface.php`, `SearchDocumentProviderInterface.php`, `EntityType.php` (enum, 9 cases), `SearchDocument.php` | Create | the framework ports (§3). `SearchProviderInterface`: `search(SearchQuerySpec): SearchResult`, `msearch(array<SearchQuerySpec>): array<SearchResult>`, `matchIds(EntityType, string $q, int $cap = 10000): array<Uuid>` (tenant filters injected inside the adapter, never by callers) |
| `api/src/Search/UI/CLI/SwapAliasCommand.php` (`search:index:swap-alias`) | Create | mapping-change procedure: create `_v2` index → backfill into it → atomic alias swap → drop `_v1`; documented in the Phase 6 framework guide |
| `api/config/packages/messenger.yaml` + task-definition templates | Modify | dedicated `search` Messenger transport + its own consumer container (do NOT share the 256M `async` sidecar with webhooks — a 2.1M-doc backfill/import fan-out would starve it); backfill itself runs via CLI, not the queue |
| `api/src/Search/Infrastructure/OpenSearch/OpenSearchClientFactory.php`, `OpenSearchSearchProvider.php`, `IndexManager.php` | Create | client (SigV4 on AWS, plain local), msearch/search/bulk adapter, index creation with versioned name + alias |
| `api/src/Search/Infrastructure/OpenSearch/mappings/*.json` (9 files) | Create | per-entity mappings: identifier keyword subfields w/ strip-non-alnum normalizer, ngram/edge-ngram analyzers on names/descriptions, phonetic analyzer on person/company names, denormalized ranking fields, `organization_id`/`workplace_id` keywords |
| `api/config/packages/search.yaml` | Create | endpoint DSN + **all ranking weights/half-lives/fuzzy thresholds as parameters** (FR-006/007) |
| `bin/console search:index:create` command (`api/src/Search/UI/CLI/CreateIndexesCommand.php`) | Create | creates/updates indexes + aliases |

#### Verification (Definition of Done gates):
- **Static (scoped):** BE cs-fix + phpstan + pest on new files
- **Terraform:** `terraform plan` clean for staging (apply staging only in this phase)
- **Smoke:** `bin/smoke-test.sh` — no 500s (nothing user-facing changed)
- Local: compose opensearch healthy; `search:index:create` creates 9 indexes locally and on staging domain

---

### Phase 2: Indexing pipeline
**Implements:** FR-002, FR-004, FR-018 (index half), NFR-002/003/009/010 · **Depends on:** Phase 1

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Search/Infrastructure/DocumentProvider/{WorkOrder,PartSale,Company,Contact,Vehicle,Part,Vendor,PurchaseOrder,VendorInvoice}DocumentProvider.php` | Create | 9 providers: `buildDocuments()` (DBAL, batched, all display+indexed+ranking fields incl. WO line texts from `work_order_line`, number display variants via `ShopIdSplicedNumberSearchFields` port), `interestedIn()` (e.g. `Line::class → WO id`, `Company::class → own doc + its WO/PS/vehicle/contact docs`, `CatalogPartTag`/`BinLocation` → part docs, `Staff`/`User` name changes → WO/PS docs carrying them, `Vendor::class → own doc + its part/PO/VI docs`, part-sale line → part docs (sold-30d input), `Order::class → own doc + vendor doc` (open-PO flag), `VendorTransaction::class → its VI doc`), `backfillQuery()`. Contacts: scope via company join, skip+count `company_id IS NULL` (NFR-003). VendorInvoice: LEFT JOIN `vendor_transaction` (`reference_id = delivery.id`, type `delivery`) for the tri-state payment status (nullable; never use `VendorTransactionType::getLabel()` — broken `\|\|`-switch); interest map includes `VendorTransaction::class → its delivery doc` so payments refresh the badge. PO docs store the real `S-/I-/P-` number + spliced variants (no "PO-" format) |
| `api/src/Search/Infrastructure/Doctrine/SearchIndexSubscriber.php` | Create | `#[AsDoctrineListener]` postPersist/postUpdate/postRemove → per-request dedup collector → flush one `ReindexDocumentsJob` after commit (LogCommandBus pattern; stays active in CLI) |
| `api/src/Search/Application/Indexing/ReindexDocumentsJob.php` + `ReindexDocumentsJobHandler.php` | Create | extends `AsyncJob` (SQS in prod); chunks fan-outs >500 docs; bulk upsert/delete via provider + IndexManager |
| `api/src/Search/UI/CLI/ReindexCommand.php` (`search:reindex --entity=… --org=… --workplace=… --since=… --id=…`) | Create | backfill + maintenance reindex (D10): batched, resumable, paced (NFR-009), progress output, reports skipped company-less contacts |
| `api/migrations/Version…` (hand-written) | Create | none needed this phase unless an outbox/checkpoint table is chosen during implementation — default design needs no MySQL table |

#### Document field reference (indexed ▸ displayed ▸ ranking inputs) — from PRD §4 + D19:
| Entity | Indexed | Displayed | Ranking inputs |
|---|---|---|---|
| Work Order | number + raw + spliced variants, customer name, asset y/m/m, unit, VIN, lead tech name, service advisor name, status, line texts | number + customer (primary), status badge, lead tech, asset/unit, created/updated date | open-status flag, `updated_at`, `assigned_user_ids` (tech+SA) |
| Customer | name, phone digits, address 1/2, city, state | name, address line, open-WO count badge, phone | open-WO count, `created_at` |
| Contact | first+last name, title, email, phone/mobile, company name | full name, company + title/phone | parent company's open-WO flag |
| Asset | year, make, model, VIN, unit, owning customer name | year+make+model (primary), **bolded unit**, customer name | has-open-WO flag, year |
| Part (inventory) | description, part number + variants, tags, category, manufacturer, vendor name, bin location | description, part number, qty + stock-status color | qty, bin-present flag, sale dates (30d window), price fields (maskable) |
| Vendor | name, phone, email, address, city | name, address line | open-PO flag, last-used date |
| Part Sale | P-number + variants, customer name, asset, VIN, created-by name, status | P# + customer, status badge, total price (maskable) + created date | `created_at` (7d half-life), paid flag, `created_by_user_id` |
| Purchase Order | order number + spliced variants (`S-/I-/P-`), vendor name, status, ordered-by, note, linked WO number, item part numbers/names | spliced number + vendor, status badge, total price (maskable) + created date | status, `created_on` |
| Vendor Invoice | invoice number, order number + variants, vendor name, received-by, note | invoice # + vendor, **tri-state payment badge** (from `vendor_transaction`, nullable), total (maskable) + received date | `date_received`, payment status |

#### Unit / Integration tests:
- Provider tests per entity: document content matches the field table above (incl. WO line texts, PS `P-` numbers, PO `S-/I-/P-` variants, VI free-text invoice number); tenant fields always present
- Subscriber test: line change enqueues WO reindex; company rename fans out bounded; delete produces index deletion
- Staleness test: create/update/delete each entity → doc visible/gone after worker runs (functional, local opensearch)

#### Verification:
- **Static (scoped)** · **Smoke** (`bin/smoke-test.sh`) · **BE log check** after sample requests
- Staging: full `search:reindex` run against the weekly prod-copy — duration + writer CPU recorded (NFR-009), doc counts vs. §1 sizing table
- Local browser-walk: N/A (no UI yet)

---

### Phase 3: Search API — matching, ranking, recents
**Implements:** FR-001/003/005/006/007/008/009, FR-013 (BE cursor), NFR-001 (measured), NFR-004/005 · **Depends on:** Phase 2

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Search/UI/HTTP/SearchController.php` + `DTO/SearchRequestDto.php` | Create | modeled on `PartListController` (`final`, `__invoke`, RequestDto → Query); per-section bundle gate + TimeClock short-circuit (ported from `FetchDataController`/handler) |
| `api/src/Search/Application/Query/SearchQuery.php` + `SearchQueryHandler.php` | Create | builds per-entity queries: identifier parse (FR-005 incl. `unit:` forms) → exact clauses; name prefix/word clauses; **two-stage fuzzy per FR-006** (n-gram candidates Jaccard ≥0.35 → normalized-DL similarity ≥0.70/≥0.80 enforced engine-side via `min_score` + rescore, so totals/cursor stay engine-authoritative — NOT `fuzziness: AUTO`) gated off identifier fields; `track_total_hits: true` on every query (defaults silently cap totals at 10k — we have 53k-part workplaces); phonetic fallback clause; `function_score` with config weights (exp decays, windowed range clauses, per-user boosts per §3); contextual bias from `context` (single-signal); recent-view boost via 7d-filtered `user_recent_entity` IDs; msearch across permitted indexes; maps hits → `Item` DTOs with match descriptor + highlight + contactInfoMatch; **masks prices via `PricingVisibilityProviderInterface`** (NFR-005) |
| `api/src/Search/Application/Query/RecentEntitiesQuery*` + `TouchRecentEntityCommand*` + `Domain/RecentEntity.php` + XML mapping + hand-written migration | Create | FR-009 incl. permission + existence filtering on read |
| `api/src/Search/UI/CLI/CleanupRecentEntitiesCommand.php` | Create | 30-day recents expiry (PRD §8) |

#### Unit / Integration tests:
- Matching: every SV-3210 variant (WO ×7, unit ×8, part ×9), `Petersn→Peterson`, `Abrige→Aabridge`, `frieghtliner→freightliner`, `Filbridge→Fibridge`, phone punctuation; **negative:** one-char-off VIN → no match; 2–3-char queries not noisy
- Ranking: per-signal direction tests; exact identifier outranks all + pins; out-of-stock parts NOT demoted; 90-day invoiced WO below open WO; weights read from config (change → order change, no code change)
- 🔴 Functional: org A never sees org B rows **per entity type**; per-bundle section filtering incl. TimeClock + partial-access role; hidden groups leak neither rows nor counts; pricing-blind user gets masked prices; recents never return lost-permission/deleted entities

#### Verification:
- **Static (scoped)** · **Migration gate** (1 hand-written migration; `migrations:diff` no-op) · **Smoke** · **BE logs**
- Staging measured: p95 vs NFR-001 on the prod-copy dataset (record numbers in Execution State)

---

### Phase 4: Global-search modal (FE)
**Implements:** FR-011–FR-017, FR-021, FR-022, FR-008/009 (App halves), NFR-004/005 (App halves), NFR-006/007 · **Depends on:** Phase 3 (integration); shell/rows can start on mocks in parallel

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/api/search/{index,SearchModel,keys,queries}.ts` | Create | Vue Query module per `app/docs/patterns/vue-query.md`: search query (per-term, replaces the `staleTime: Infinity` whole-org collection), recents query, touch mutation |
| `app/src/components/ts/navigation/search/SearchModal.vue` | Create | q-dialog-based spotlight (640×~700, anchored, dim underlay), five states, quick-create chips, focus trap + return focus, footer legend. **Responsive per FR-022** — mobile/tablet layout follows the 2026-08-19 design frames; resolve FR-022's four open points before building this component. **Deliberate convention exception: Esc closes** (PRD §5.5) — documented against `app/docs/patterns/dialogs.md` X-icon rule; raw q-dialog (not BaseFormDialog — it's neither form nor confirm) |
| `app/src/components/ts/navigation/search/{SearchTabStrip,SearchResultGroup,SearchResultRow}.vue` | Create | permission-aware tabs with live counts (reuse `isSearchTypePermitted` extended to 9 types, fail-closed); `All` groups capped at 5 with true totals + pinned slot; scoped tab renders the full list with load-more (cursor, D15); one base row + 9 variant configs, unit bolded on assets, part rows → Inventory route, "Contact/info match" secondary |
| `app/src/components/ts/navigation/search/SearchQuickActions.vue` | Create | FR-021/D18: per-entity hover action cluster (WO `Add new line`, Customer/Contact `New work order`, Asset `New work order`+history/invoices, Part `Add to work order`/`Add part`, Vendor `Add contact`, Part Sale `Add part`, PO `Receive`); conditional actions read the shared page-context "currently editing WO" state; keyboard-reachable; success/failure feedback in-modal; each action reuses an existing endpoint — gaps raised, not built here |
| `app/src/components/ts/navigation/search/useSearchModal.ts`, `useSearchKeyboard.ts` | Create | modal state machine; keyboard map per §5.5 (skip headers, pinned first, ⌘+Enter new tab, focus reset on new result set — documented choice), aria-activedescendant + live region |
| `app/src/composables/usePageContext.ts` | Create | route → `{type,id}` for the `context` param (Vue composable — PRD's "React context" corrected) |
| `app/src/composables/useRecentEntitiesTouch.ts` + `router.afterEach` hook | Create | touch on entity-page visits + result clicks (once per click) |
| `app/src/utils/workOrderStatus.ts`, `app/src/utils/stockStatus.ts` | Create | **extract** `statusLabel` map from `pages/WorkOrders.vue` (~line 1088) and `setColor` from `components/parts/Inventory.vue` (~line 943); both pages import back from utils (badges reuse, not duplicate — FR-014) |
| `app/src/components/ts/navigation/GlobalSearch.vue` | Modify | header field becomes modal trigger (keeps ⌘K handler, lines ~250–261); persisted query rendered as plain text; dropdown/select path removed at Phase 6 |
| `app/src/composables/useGlobalSearch.ts` | Modify | modal-era slim-down: keep history sentinel + permission gate; drop client-side matcher when old path is removed (Phase 6) |

Persisting search: `sessionStorage` per tab (`usePageSearchSession` pattern from SV-8785); restore query + scope + results on reopen. Debounce 150ms + AbortController cancellation + out-of-order guard (FR-017 — the 950-request-storm lesson: assert request count in a test).

#### Unit tests (Vitest):
- state transitions ×5, chips on first-time AND no-results, keyboard map incl. header-skipping + pinned-first, debounce/cancellation, bucketing across a day boundary, persistence round-trip, permission-hidden tabs, fuzzy-highlight + OOS badge row cases, masked-price row for pricing-blind user, scoped-tab load-more, quick-action conditional visibility ("currently editing WO" on/off) + never-destructive assertion

#### E2E tests (e2e/):
- **Happy paths (new specs, batch of 5 — see §7):** open modal → search → open result; keyboard-only journey; persistence across close/navigate/reopen; permission scoping (groups/tabs/counts absent, TimeClock empty); quick-action journey (Customer row → `New work order` → real WO created).
- **Reference breakage (mandatory, uncapped):** replacing the header q-select breaks the `GlobalSearchPage` page object (`e2e/src/pages/navigation/global-search.page.ts` — full rewrite to `SearchModalPage`, keeping the assertion-helper API), specs @C29914/@C29912/@C29913 (roles × search), `dashboard.page.ts` search helpers, `part-sales.page.ts` `searchSpecificPartSale` (drives the old dropdown UI directly). Full forecast list in §7; re-verify with `/e2e-after-change` against the real diff.
- **Test-id inventory (bake in from the start):** modal root, input, group headers, result rows (+ `aria-selected` on the highlighted row), tab strip + tabs (with counts), load-more control, pinned row, no-results, error banner + retry, chips, quick-action buttons, recents headers, footer legend, result-count `aria-live` region.

#### Verification:
- **Static (scoped):** eslint + vitest related + vue-tsc · **Compile gate:** quasar/Vite clean
- **Browser-walk (mandatory):** `http://localhost:7200` as `admin` and `tech` (QUICK_LOGIN_USERS): ⌘K, type `Fib`, arrow to a WO, Enter; switch to a scoped tab and load more; hover a Customer row → `New work order` opens the create flow; verify tech sees no Parts group/tab; verify recents populate after visiting a WO page; console clean. **Mobile pass (FR-022):** repeat the open→search→open-result journey at a phone viewport (device toolbar) — modal/sheet renders per the design, tab strip scrolls, quick actions reachable without hover

---

### Phase 5: Page-search cutover
**Implements:** FR-018 (cutover half), NFR-001 · **Depends on:** Phase 3; coordinates with SV-8785 (D14). _FE list-page changes were dropped with D15 (no Show-all link, no banner) — this phase is BE-only plus parity verification._ **Preflight:** the SV-8785 page-search UI must already exist on the branch (see Section 0) — this phase only re-points what feeds it; if it's absent, stop and ask the user.

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/VehicleService/WorkOrders/Application/List/ListingQueryHandler.php` | Modify | search term → `SearchProviderInterface::matchIds(EntityType::WorkOrder, q)` → `wo.id IN (:ids)`; drop the 16 LIKE fields; filters/sort/shape untouched (SV-8785 conflict point — resolve at merge). **OpenSearch-down: fail closed** — empty result + "search unavailable" notice, never the unfiltered list (functional test) |
| `api/src/Inventory/Parts/Infrastructure/Persistence/DbalPartListFetcher.php` | Modify | same for parts (kills the tags-subquery LIKE fan-out — the 2026-06-05 offender); same fail-closed OpenSearch-down behavior + test |
| `api/src/Customer/Customers/Application/Listing/ListingQueryHandler.php` | Modify | same for customers (company + contact-name matching now via index); same fail-closed OpenSearch-down behavior + test |

Exports (`ExportPartQueryHandler` etc.) and the other ~78 SearchDecorator call sites stay on DBAL LIKE in v1 — explicitly out of scope, noted for the follow-up.

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| _none_ | — | D15 dropped the banner and Show-all navigation; the list pages' page-search UI is entirely SV-8785's (already supports `?search=` URL prefill if ever needed) |

#### Unit / Integration tests:
- BE functional per handler: same filters+search return identical row sets pre/post cutover on fixtures; tenant/workplace scoping preserved; term absent → query byte-identical to today

#### E2E tests (e2e/):
- **Parity check (folded into existing list specs):** the same token (incl. a fuzzy variant) returns the same rows via the WO page search and the global-search modal — asserted while retargeting `work-orders.page.ts`.
- **Reference breakage (mandatory, uncapped):** page objects that today type into the nav search or a bare `//input[@type='search']` retarget to the new local page-search inputs — `work-orders.page.ts` `filterListViaGlobalSearch` (4 consumer specs stay untouched; keep it client-side for @C29919's warm-nav premise), `inventory.page.ts` `searchField` (~15 consumer specs — watch for fuzzy widening: seeds need distinctive tokens), `customers.page.ts`, `catalog.page.ts`, `work-order.spec.ts` @C1865 inline locator, plus the Table.vue-built-in-search retargets (staff/category/vendors/tech-efficiency/part-sales-data.setup) and @C30092 (Customer Invoices tab → SV-8785 built-in table search input, behavior preserved).
- **Non-cutover lists:** everything else keeps search via SV-8785's `Table.vue` built-in input (MySQL LIKE, unchanged in v1) — no product regression, page objects just retarget.

#### Verification:
- **Static (scoped)** BE+FE · **Smoke** · **Compile** · **BE logs**
- **Browser-walk:** type `Fib` and the fuzzy `Fibrige` into the WO list page search → same result set as the global-search modal for the same terms (FR-018 behavioral parity); repeat on Inventory and Customers
- Staging p95 for the three list endpoints with search, vs. today's numbers

---

### Phase 6: Rollout & old-path removal
**Implements:** FR-019, FR-020 close-out, NFR-011 (docs) · **Depends on:** Phases 1–5, E2E pass (SV-9175). Split: **6a = code** (steps 2 & 4 — removal + docs, agent-executable) · **6b = ops runbook** (steps 1 & 3 — prod rollout + Jira reconciliation; human-owned, no agent gate).

1. Prod TF apply (domain) → `search:index:create` → `search:reindex` full backfill (off-peak; writer CPU watched) → deploy BE (endpoint live) → deploy FE (modal replaces dropdown; page-search cutover) — **no flags (D10)**; rollback = redeploy previous release, old code path intact until step 2.
2. **Removal:** `GET /api/global-search/fetch` + `api/src/Reporting/GlobalSearch/Application/FetchData/` (~446 lines), client matcher in `useGlobalSearch.ts` (Customer→Contact remap + SV-7952 gate behaviors preserved server/modal-side — verified before delete), the 5 `invalidateSearchData()` call sites + its definition/export.
3. **Reconciliation:** close SV-6325 (subsumed); SV-3210 asks verified delivered (vendor-invoice search ✓, unit tokens ✓, inventory-not-catalogue ✓, bolded unit ✓; mobile/tablet responsiveness → delivered via FR-022); SV-4977 part-tags confirmed in the index; "ask a question" copy verified corrected (D5).
4. Docs: `api/.claude/reference/search.md` — framework guide: "adding a searchable entity" (NFR-011).

#### Verification:
- NFR-001 (search p95 ≤ 250 ms) and NFR-002 (index staleness ≤ 30 s) measured in prod; smoke + logs clean post-removal deploy

## 7. Testing Strategy

### Unit tests (`api/` and `app/`)
- **BE:** matching pipeline (all identifier variant matrices, fuzzy cases, VIN negative), ranking signals (direction + magnitude per entity, config-driven), document providers (content, tenant fields, fan-out maps), permission gating, price masking, recents rules.
- **FE:** modal state machine, keyboard map, debounce/cancel, bucketing, persistence, permission-hidden tabs, row variants (9, incl. tri-state VI payment badge), highlight from match descriptor, error banner, quick-action conditional visibility.
- Edge cases: empty entity types per tenant; company-less contacts; PO number prefix collisions (`S-` WO vs `S-` special PO); masked-price rows; results changing under keyboard focus.

### Integration tests
- Functional suite against local OpenSearch: index→search round trips per entity; staleness (create/update/delete visible ≤ worker run); cross-tenant isolation per entity (🔴); pre/post cutover row-set parity for the three list handlers.

### Manual testing checklist
1. ⌘K from 5 different routes; Esc/underlay/⌘K close; focus returns to header field
2. Screen-reader pass (VoiceOver): dialog, combobox, count announcements
3. `tech` role: no Parts/Vendors/PO/VI groups or tabs; no prices anywhere in rows
4. TimeClock user: modal opens, zero sections
5. Fuzzy: `Petersn`, `Fibrige`; identifier: full WO/unit/part matrices; phone with punctuation
6. Scoped tab shows the full list with load-more; page search on the 3 cutover lists returns the same rows as the modal for the same term (incl. a fuzzy term)
7. Two browser tabs hold independent persisted queries
8. Data Import of 500 parts → search stays responsive; new parts searchable ≤ 30s after worker drain
9. Kill OpenSearch container locally → modal shows retry banner; list-page search errors gracefully; recovery works
10. Mobile/tablet viewport (FR-022): open, search, open a result; tab strip overflow; quick actions without hover; no horizontal page scroll

### E2E tests

New specs live in `e2e/tests/ui/global-search/` (TestRail section "Global Search" exists; add SECTION_MAP entries in `e2e/scripts/testrail-push.ts`; domain tag `@global_search`). Seeding via API factories with unique run tokens; all test users on the same shop location; waits target the data signal (result row / banner text / `aria-live` count), never spinner-disappearance. **batchCap = 5** — the batch below; surplus in the Backlog table.

**Test: Open modal, search, open a result** (Happy path, FR-001/011/014) — `search-open-navigate.spec.ts`
1. Press ⌘K (and separately: click the header field) → modal opens, input focused
2. Type a seeded distinctive customer name
3. Click the customer row
- **Expected:** grouped server-ranked results render; row click navigates to the customer page; Esc/underlay close verified en route.

**Test: Permission scoping** (Edge case, NFR-003/004) — `search-permission-scoping.spec.ts` (staging-only: custom-role harness)
1. As a custom role holding `workorders:view` only, open modal, search a token seeded on both a vendor and a WO customer
2. As a zero-permission (TimeClock-like) user, repeat
- **Expected:** WO group present; Vendors group, tab, and count entirely absent; zero-permission user gets an empty state with no leaked counts.

**Test: Quick action — Customer → New work order** (Happy path, FR-021) — `search-quick-action-new-wo.spec.ts`
1. Seed a distinctive customer; open modal, search it
2. Hover the customer row → click `New work order`
3. Complete the create flow
- **Expected:** the create-WO flow opens pre-bound to that customer; a real WO is created and visible; no destructive action exists on any row.

**Test: Persisting search** (Happy path, FR-016) — `search-persistence.spec.ts`
1. Search token, switch to Work Orders tab, Esc
2. Navigate elsewhere via SPA nav, press ⌘K
- **Expected:** header field held the query; reopen restores query + Work Orders scope + the same real result rows.

**Test: Keyboard-only journey** (Happy path, FR-015, NFR-006) — `search-keyboard-journey.spec.ts`
1. ⌘K → type token seeded across two groups (customer + WO)
2. ↓ traverse rows across the group boundary
3. Enter on a highlighted row
- **Expected:** highlight skips group headers, crosses groups row-to-row, Enter opens the entity — mouse never used.

**Backlog** (deferred beyond batchCap; note in PR block):

| Workflow | File (proposed) | Why deferred |
|---|---|---|
| Scoped-tab full list + load-more (cursor) | `search-scoped-tab-pagination.spec.ts` | mostly FE-unit observable; tab counts already asserted in the batch specs |
| Recent searches (touch on click + page visit, grouping, exclusions) | `recent-searches.spec.ts` | P2 convenience; needs deleted-entity choreography |
| Quick-create chips → dialog → created | `quick-create-chips.spec.ts` | chip render is FE-unit; WO creation covered elsewhere |
| Pinned top-hit on exact identifier | `pinned-top-hit.spec.ts` | scoring is BE-functional; waits on that suite |
| Inventory page-search parity (identifier variants) | `inventory-page-search-parity.spec.ts` | WO parity folded into the Phase 5 retarget of `work-orders.page.ts` |
| Conditional quick actions ("currently editing WO" variants) | `search-quick-action-conditional.spec.ts` | the unconditional journey is in the batch; conditional state machine is FE-unit first |
| See Financial Data price masking in rows | `search-price-masking.spec.ts` | P2; do soon after batch (masked-pricing bug-class history) |

**Reference breakage (mandatory, uncapped — not part of batchCap):** forecast of every existing spec/page-object broken by removing the header q-select and the nav-search→`Table.vue` filtering path — `GlobalSearchPage` PO rewrite → `SearchModalPage`; @C29914/@C29912/@C29913 retargets (+ assert Vendors *tab* absent; Parts rows now navigate to inventory); @C30092 → Customer Invoices tab's SV-8785 built-in table search; `work-orders.page.ts:454`, `inventory.page.ts:33` (~15 consumers), `customers.page.ts:17`, `catalog.page.ts:33`, `dashboard.page.ts:26`, `part-sales.page.ts:198`, `work-order.spec.ts:2766` (@C1865), bare `//input[@type='search']` POs (staff/category/vendors/tech-efficiency/`part-sales-data.setup.ts:331`). Re-verify with `/e2e-after-change` against the implemented diff — this list is a pre-implementation forecast.

**Routed to other layers (no E2E case):** fuzzy + identifier-variant matrices, VIN-never-fuzzy, ranking/caps/totals/group order → **BE functional** (new suite; port/extend `api/tests/Functional/Reporting/GlobalSearch/GlobalSearchPermissionFilteringTest.php` to `GET /api/search`); modal states, error/retry render, ⌘+Enter/tab-cycling key handling, WCAG announcements → **FE unit** (replaces `useGlobalSearch.spec.ts` when the old composable dies).

**TestRail sync process (Phase 4 E2E step):** create the 5 new cases first (bodies drafted in the curation report) → tag the specs with the minted `@Cxxx` IDs → add the `'ui/global-search/': 'Global Search'` prefix entry to `e2e/scripts/testrail-push.ts` SECTION_MAP (Modify) → run `/e2e-after-change` on the branch so `e2e/.e2e-coverage-block.md` exists for the CI check. Updated cases @C29914 @C30092 @C1865. **@C29912/@C29913 are semantic rewrites, not retargets** — they assert catalogue-part results in global search, and Parts moves to inventory; rewrite them against inventory parts (or deprecate + replace).

## 8. Rollback Plan

- **Any phase pre-cutover:** revert the deploy; nothing user-facing depends on the new tier until Phase 4 ships.
- **Post-cutover (no flags, D10):** rollback = redeploy the previous release — the old endpoint + dropdown code remain in the tree until Phase 6 step 4, so a redeploy fully restores the old search. OpenSearch outage ≠ rollback: `/api/search` 503s → FE retry banner; list-page search **fails closed** — empty result set + an explicit "search unavailable" notice (never the silently-unfiltered list, never a 500); the three handlers catch provider transport failures, each with a functional test asserting this (Phase 5).
- **Index corruption/drift:** `search:reindex` rebuilds any entity/tenant from MySQL truth at any time.
- **Infra:** `prevent_destroy` on the domain; TF revert removes cleanly (stateless read model).

## 9. Security Considerations

- **Tenant isolation (NFR-003 🔴):** org/workplace filters are constructed inside `OpenSearchSearchProvider` from the authenticated context (`OrganizationIdProvider`/`WorkplaceIdProvider`), not passed by callers — impossible to forget per call site. Functional tests assert per-entity isolation. Contacts scope via company join; company-less contacts never indexed.
- **Permissions (NFR-004 🔴):** per-section FE-bundle gating (SV-7952 pattern, decision recorded §5); groups the user can't see are never queried (no count leak); recents re-checked on read (server-side `permittedHistory` equivalent).
- **Pricing (NFR-005 🔴):** masking via `PricingVisibilityProviderInterface` at DTO assembly; masked-echo bug class (SV-8318) noted for reviewers.
- **Observation (not in scope, D13):** `GET /api/portal/customers` (`api/src/External/Customer/Application/List/ListQueryHandler.php`) paginates contacts with no org scoping — portal namespace, low load; flagged to the team as a follow-up ticket candidate.
- OpenSearch domain: VPC-only, SG ingress from VPC CIDR :443, no public endpoint; SigV4 signing with the task role (no basic-auth secrets).

## 10. Requirement Traceability

| Requirement | Phase | Layer | Files (primary) | Status |
|-------------|-------|-------|-----------------|--------|
| FR-001 | 3 | API | `api/src/Search/UI/HTTP/SearchController.php`, `Application/Query/SearchQueryHandler.php` | Planned |
| FR-002 | 2–3 | API | `api/src/Search/Infrastructure/DocumentProvider/*` (9) | Planned |
| FR-003 | 3 | API | `SearchQueryHandler` (match descriptor → contactInfoMatch) | Planned |
| FR-004 | 2 | API | `SearchIndexSubscriber`, `ReindexDocumentsJob*`, `ReindexCommand` | Planned |
| FR-005 | 3 | API | `SearchQueryHandler` + mappings normalizers | Planned |
| FR-006 | 3 | API | `SearchQueryHandler`, `config/packages/search.yaml` | Planned |
| FR-007 | 3 | API | `SearchQueryHandler` function_score + config | Planned |
| FR-008 | 3 | API | `SearchQueryHandler` (context clauses) | Planned |
| FR-008 | 4 | App | `usePageContext.ts` | Planned |
| FR-009 | 3 | API | `RecentEntitiesController`, `RecentEntity`, migration | Planned |
| FR-009 | 4 | App | `useRecentEntitiesTouch.ts`, router hook | Planned |
| FR-011 | 4 | App | `SearchModal.vue`, `useSearchModal.ts` | Planned |
| FR-012 | 4 | App | `SearchTabStrip.vue`, `SearchResultGroup.vue` | Planned |
| FR-013 | 3–4 | API+App | `SearchQueryHandler` (cursor), `SearchTabStrip.vue` + `SearchResultGroup.vue` (counts, load-more) | Planned |
| FR-021 | 4 | App | `SearchQuickActions.vue`, `usePageContext.ts` | Planned |
| FR-022 | 4 | App | `SearchModal.vue`, `SearchTabStrip.vue`, `SearchQuickActions.vue` (responsive) | Planned — read the mobile design file at Phase 4 |
| FR-014 | 4 | App | `SearchResultRow.vue`, `utils/workOrderStatus.ts`, `utils/stockStatus.ts` | Planned |
| FR-015 | 4 | App | `useSearchKeyboard.ts` | Planned |
| FR-016 | 4 | App | `useSearchModal.ts` (sessionStorage), recents bucketing | Planned |
| FR-017 | 4 | App | search api module + `SearchModal.vue` | Planned |
| FR-018 | 1–2 | API | `SearchProviderInterface`, providers, mappings | Planned |
| FR-018 | 5 | API | 3 listing handlers (ID-injection) | Planned |
| FR-019 | 6 | API+App+Infra | removal list (§6 Phase 6 step 2), reconciliation | Planned |
| FR-020 | 4–6 | E2E | `e2e/tests/ui/global-search/*` (5 specs) + reference updates | Planned |
| FR-001/011/014 | 4 | E2E | `e2e/tests/ui/global-search/search-open-navigate.spec.ts` | Planned |
| FR-015 / NFR-006 | 4 | E2E | `e2e/tests/ui/global-search/search-keyboard-journey.spec.ts` | Planned |
| FR-016 | 4 | E2E | `e2e/tests/ui/global-search/search-persistence.spec.ts` | Planned |
| NFR-003/004 | 4 | E2E | `e2e/tests/ui/global-search/search-permission-scoping.spec.ts` | Planned |
| FR-021 | 4 | E2E | `e2e/tests/ui/global-search/search-quick-action-new-wo.spec.ts` | Planned |
| FR-018 | 5 | E2E | parity assertions in retargeted `work-orders.page.ts` consumers | Planned |
| FR-005/006/007 | 3 | BE-functional | new `api/tests/Functional/Search/*` suite (E2E-routed) | Planned |
| NFR-001 | 3, 5, 6 | API | measured staging + prod, numbers in Execution State | Planned |
| NFR-002 | 2 | API | subscriber + worker; staging staleness test | Planned |
| NFR-003 | 1–3 | API | provider-level tenant filters + per-entity functional tests | Planned |
| NFR-004 | 3–4 | API+App | section gating + tab gating + tests | Planned |
| NFR-005 | 3–4 | API+App | DTO masking + masked-row rendering | Planned |
| NFR-006 | 4 | App | keyboard + ARIA + SR verification | Planned |
| NFR-007 | 4 | App | render-perf check in integration story | Planned |
| NFR-009 | 2 | API | paced backfill, staging prod-copy run | Planned |
| NFR-010 | 2 | API | enqueue-only listener; bulk-flow tests | Planned |
| NFR-011 | 1–2, 6 | API | provider interface + `api/.claude/reference/search.md` | Planned |


## 11. Verification Tickets

Created 2026-08-17 (all children of SV-9160, Product Area "Platform Features", labels `global-search-v2` + `verification`). Also created: **SV-9306** — new story "BE — Page search cutover" (closes the FR-018 story gap, unassigned).

| Ticket | Title | Covers | Linked stories | Assignee |
|--------|-------|--------|----------------|----------|
| SV-9307 | Verify Phase 1 — OpenSearch infrastructure & search framework core | FR-018 foundations, NFR-003/011 | SV-9161, SV-9163 | Sinisa Nogic (BE) |
| SV-9308 | Verify Phase 2 — indexing pipeline, backfill & staleness | FR-004, NFR-002/003/009/010 | SV-9163 | Sinisa Nogic (BE) |
| SV-9309 | Verify Phase 3 — /api/search matching, ranking, permissions, recents | FR-001–009, FR-013(BE), NFR-001/004/005 | SV-9162, SV-9164–9166 | Sinisa Nogic (BE) |
| SV-9310 | Verify Phase 4 — search modal: states, rows, keyboard, persistence, quick actions | FR-011–017, FR-021, NFR-006/007 | SV-9168–9174 | Nikola Milosevic (FE) |
| SV-9311 | Verify Phase 5 — page-search cutover parity | FR-018, NFR-001 | SV-9162, SV-9306 | Sinisa Nogic (BE) |
| SV-9312 | Verify Phase 6 — rollout & BE old-path removal | FR-019 | SV-9176 | Sinisa Nogic (BE) |
| SV-9313 | Verify Phase 6 — FE old-path removal & copy | FR-019 (FE) | SV-9176, SV-9168 | Nikola Milosevic (FE) |

When all these tickets are marked Done, the feature is ready for QA.