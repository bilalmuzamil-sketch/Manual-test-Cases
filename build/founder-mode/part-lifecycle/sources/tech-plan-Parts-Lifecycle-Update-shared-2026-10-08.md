# Parts Lifecycle Update — Technical Implementation Plan

**Date:** 2026-10-07
**PRD:** [Parts Lifecycle Update](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/829227015/Parts+Lifecycle+Update), v22, "Ready for dev" (Product's `/prd-review` verdict READY, 2026-10-07)
**Jira epic:** [SV-10647 FounderMode Part Lifecycle](https://shopview.atlassian.net/browse/SV-10647). Stories SV-10814 … SV-10826. ⚠️ The epic is marked *Done* in Jira while all 13 stories are Open. Re-open it before work starts.
**Design:** [Part Lifecycle design canvas](https://claude.ai/artifact/Vz6rprcWyP16tYxzM1kdeE), 46 boards across pages 1–7 (create, correct, retire, bulk, tracking, daily, library)
**Tech stack:** Symfony 7.4 / PHP 8.5 / Doctrine ORM 3 + DBAL 4 / MySQL (`api/`); Vue 3.5 + Quasar 2 + Vuex 4 + vue-query (`app/`); Playwright (`e2e/`)
**Estimated complexity:** **High.** 13 stories touch 6 bounded contexts (Inventory/Parts, PartsCatalogue, VehicleService/WorkOrders, Reporting, Search, OpenApi), 3 schema migrations, a search index mapping change with a rebuild, and a structural rewrite of the Inventory page and the part dialog.

---

## 0. Execution State

_Keep this block current so any agent (or person) can resume mid-flight — this plan may be executed by someone who did not write it._

- **Status:** Not started. Plan complete against PRD v22; awaiting plan review (wizard Phase 9).
- **Current phase:** —
- **Last completed:** —
- **Open questions / blockers:** none from Product. All 17 planning questions are answered on the PRD (verdict comment, v22) and folded in below. Remaining before code starts: user plan review, then the verification tickets.
  - 🔴 **Merge order:** #3528 (Min/Max history, now the delivery of S10-R22a) and #3294 (SV-10033 manufacturer cleanup, which S7-R6d depends on) must be on `develop` before Phases 2 and 6 respectively; #3384 before Phase 7.
  - ⚠️ Epic SV-10647 is marked *Done* in Jira while its 13 stories are open. Re-open it.

> 🛑 **About to implement this plan? Run it as `/loop /implement <this-file>`.** This plan is meant to be executed by the `/implement` orchestrator inside a `/loop` — that combination is what adds the code-review loop, the Phase 5 runtime gates (migration / compile / smoke / browser-walk), and phase-by-phase hands-off execution. Free-hand implementation skips all of it.
>
> - **However you were handed this** — "implement it", "here's the path, do it", or a single phase — do **not** start editing code directly. Route through `/loop /implement <this-file>` (or `/loop /implement Phase N from <this-file>` for one phase). That *is* "doing the implementation" — just with the gates. Announce that you're routing through `/loop /implement` and proceed; no need to ask.
> - **If you are ALREADY running under `/loop /implement`**, ignore the routing part of this note and continue — you're in the right place. But the `/loop` session is **orchestrator-only**: every code edit, including a one-line review or runtime-gate fix, goes through `be-implementer` / `fe-implementer` (or the matching test-writer). You dispatch, run the runtime gates, and keep this Execution State current, but you never edit code yourself.
> - **If you are a sub-agent** (`be-implementer`, `fe-implementer`, …) without orchestration tools, do **not** invoke `/loop` or `/implement` — that's the orchestrator's job. Execute only the scope you were handed and report back.
> - **Precedence:** only a *live, explicit* user instruction to the contrary wins — if the user in this session says to implement directly or skip the loop, honor that. Being handed just the plan path is **not** such an instruction; absent one, default to `/loop /implement` without asking.

> 🎨 **Design access.** The design isn't in the repo or bundled with this plan; open it from the link in the header. Open design links with the **DesignSync** tool (load it with `ToolSearch` `select:DesignSync`), using `get_project` / `list_files` / `get_file` with the project id from a `claude.ai/design/p/<projectId>` link. `get_file` is capped at 256 KiB, so check `.truncated`. This plan's canvas is a `claude.ai/artifact/<id>` link, which opens with the **Artifact** tool (`action: "read"`). WebFetch and curl return 403 on both. Project sub-agents (`be-*`, `fe-*`, `e2e-implementer`) don't have these tools, so the orchestrator opens the link and passes what a phase needs (the boards it cites) into the agent's prompt.

---

## 1. Requirements (extracted from PRD)

**Functional requirements are the PRD's own IDs.** They are stable, testable and already grouped by story; renumbering them would break traceability back to the PRD. The PRD text is the source of truth for every message string and rule. This table maps IDs to stories:

| Story | Jira | Requirement IDs |
|---|---|---|
| 1 Active and Inactive tabs on the Inventory list | SV-10814 | S1-R1…R10 (incl. R5a, R5b, R9a), S1-N1…N2 |
| 2 Deactivate parts in bulk | SV-10815 | S2-R1…R17 (incl. R7a, R7b, R8a, R9a, R10a, R10b), S2-N1…N3, S2-E1…E4 |
| 3 Activate parts in bulk | SV-10816 | S3-R1…R5, S3-N1 |
| 4 Create an untracked part | SV-10817 | S4-R1…R9 (incl. R6a, R8a, R8b), S4-N1…N2 |
| 5 Change tracking on an existing part | SV-10818 | S5-R1…R14 (incl. R3a), S5-N1…N2, S5-E1 |
| 6 Search and sort by tracking state | SV-10819 | S6-R1…R10, S6-N1 |
| 7 Create a part by typing number + description | SV-10820 | S7-R1…R11 (incl. R6a, R6b, R6c, R6d), S7-N1…N6 (incl. N5a, N5b) |
| 8 Permissions | SV-10821 | S8-R1…R16, S8-N1…N3 |
| 9 Inactive parts cannot be added to new work | SV-10822 | S9-R1…R20 (incl. R9a, R10a), S9-N1…N3, S9-E1…E12 (incl. E2a, E8a) |
| 10 Confirming and recording a status change | SV-10823 | S10-R1…R29 (incl. R13a, R22a, R25a), S10-N1…N4 |
| 11 The Part Library is browse and edit only | SV-10824 | S11-R1…R7 (incl. R3a, R3b, R6a), S11-N1, S11-E1…E3 |
| 12 Call the shared parts list the Part Library | SV-10825 | S12-R1…R14, S12-N1…N3 |
| 13 The part dialog | SV-10826 | S13-R1…R28 (incl. R4a, R19a…R19d), S13-N1…N9 (incl. N3a), S13-E1 |

PRD v22 absorbed every analysis-only functional requirement the first draft carried (global search, Critical Reorder, Supply filter, Part Library page rename, the 50-character refusal), so those now trace to PRD IDs: FR-GS1 → S9-R18…R20, FR-DB1 → S5-R14 / S9-E12, FR-SF1 → S6-R10, FR-PL1 → S11-R3a, FR-LEN1 → S13-N7.

**Non-functional requirements introduced by analysis** (not in the PRD text):

| ID | Story | Requirement | Origin |
|---|---|---|---|
| NFR-001 | SV-10821 | Status changes, create-untracked and tracking changes are enforced server-side with **the existing** `ROLE_CATALOG_INVENTORY::DELETE` atom, exactly as the inventory part delete (`Inventory/Parts/UI/HTTP/DeletePartController.php:20`); the FE gates on the `catalogInventoryDelete` bundle exactly as the Delete button does today. No new atom, no permission data change (S8-R14, S8-R15) | PRD v22 (supersedes D14) |
| NFR-002 | SV-10814, SV-10822 | `GET inventory/parts` status filter is explicit opt-in (`active|inactive|all`, default `all`); vendor return/credit keep inactive parts | analysis (D3) |
| NFR-003 | SV-10815 | Bulk change of up to 200 parts (+cores) runs as a batch write within the PHP-FPM 30s CPU cap | analysis (D7) |
| NFR-004 | SV-10814 | Inventory list's Part History count read is bounded to the page's part ids | analysis (D8) |
| NFR-005 | SV-10820 | Normalized matching reuses `catalogue_part.part_number_stripped` plus a new composite index; no expression index | analysis (D5) |
| NFR-006 | SV-10824, SV-10820 | Remove `POST /api/parts-catalogue/add-catalogue-part` and the unpaginated `catalogue-parts-that-are-not-on-location` endpoint | analysis (D13) |
| NFR-007 | SV-10822 | Tenant scoping on every new or touched query; fix the unscoped canned-job part read | analysis (Golden Rule) |
| NFR-008 | SV-10815 | Shared presentational bulk-bar shell extracted from the work-order `BulkActionBar.vue`; WO lines unchanged | user decision (D15) |
| NFR-009 | SV-10815, SV-10822, SV-10826 | **No N+1.** Bulk status, canned-job inactive check, rename propagation, search reindex and history counts are set-based: one scoped read, batch writes, `UPDATE … JOIN`. No per-part query inside a loop. | user directive (with the D17 sign-off) |
| NFR-010 | SV-10822 | The global-search `parts` index gains `is_active` and `is_tracked`; the mapping change ships with an index rebuild + alias swap before the FE reads the fields | PRD v22 engineering note (D26) |

### Clarifications & PRD comment outcomes

| Question | Asked via | Answer |
|---|---|---|
| Intake directives | intake | None. PRD analyzed as-is. |
| `/prd-review` verdict | Product | v22, READY, PRD + codebase (2026-10-07). Every answer below is written into the page. |
| Q1 Global search shows inventory parts | Confluence comment | Keep inactive parts, grey "Inactive" tag; selecting one opens the Inactive tab searched to its number; untracked shows "Not Tracked" in place of the stock badge (S9-R18…R20) |
| Q2 S13-N1 rename refusal: exact or normalized? | Confluence comment | Exact (same characters and case), like create's link rule. Public API create's normalized 409 unchanged (S13-N1) |
| Q3 Critical Reorder | Confluence comment | Leaves out untracked and inactive parts (S5-R14, S9-E12) |
| Q4 Canned-job warnings | Confluence comment | One warning per canned job listing every part and fee left out (S9-R10, S9-R10a) |
| Q5 "not"/"tracked" search | Confluence comment | Additive: untracked parts **plus** the normal matches (S6-R1) |
| Q6 Release day | Confluence comment | Every existing part tracked and active; on for every shop, no rollout setting (S1-R5a, S1-R5b) |
| Q7 Export | Confluence comment | "Not Tracked" in the quantity column; no status column (S1-R9a) |
| Q8 Tracking info text | Confluence comment | Adds "Untracked parts are left out of the Inventory Value report." (S4-R3) |
| Q9 S12-R11 copy | Confluence comment | Delete refusal "This Part Library entry is in use and cannot be deleted."; the Vendor-source message is **kept and renamed** (it exists as "Since catalogue part is provided, source has to be vendor." in `PartRequestCommandAbstract.php:103`); tab titles, delete confirmation and special-order subtitle move to Part Library (S12-R11…R14) |
| Q10 CSV import matching (FYI) | Confluence comment | PRD corrected: case first, then hyphens/asterisks/periods/spaces; never re-points, never renames (S13-N9) |
| Q11 Part request entry timing (FYI) | Confluence comment | PRD corrected: entry created when the requested part is received (S11-R6) |
| Q12 Category on a linked entry | Confluence reply | Kept (S7-R6c) |
| Q13 Supply filter | Confluence reply | Untracked only under "All" (S6-R10) |
| Q14 Part Library detail-page rename | Confluence reply | Follows the dialog's rules (S11-R3a) |
| Q15 Unaccepted vendor bill lines | Confluence reply | Take the new number; accepted bills keep the old (S13-R19, R19b). In code, a delivery row only exists once accepted, so "not yet accepted" is the open Receive screen: S13-R19c (accept uses the part's current number) covers it |
| Q16 >50-char rename onto an open part request | Confluence reply | Refused: "Part number can't be longer than 50 characters while it's on an open part request." (S13-N7) |
| Q17 Column headers | Confluence reply | Keep "Total Qty" / "Avg Cost"; PRD now says "Total Qty" |
| Product additions in v22 | verdict comment | Past-date Inventory Value is as-of (snapshot `is_tracked`); access does not change (S8-R14/R15); re-point refused on every route (S13-N8); S9-N3 shows the standard access error |
| Q18 S8-N1 scope: "save an untracked part" | Confluence reply 2026-10-08 (non-blocking) | **Assumption:** only create-untracked and tracking change need Delete; other edits of an untracked part keep today's edit access. Awaiting Product OK |
| Q19 Partial-failure toast singular | Confluence reply 2026-10-08 (non-blocking) | **Assumption:** "1 part updated, {m} could not be changed." Awaiting Product OK |
| Phase 8.5 PRD audit | fresh agent, PRD v22 | 0 🔴; 4 🟡 + nits, all fixed (history search uncapped, PartSelect inactive message when fuzzy matches exist, dialog status-failure copy, declined vendor returns terminal) or sent to Product (Q18, Q19) |
| E1 How to enforce Delete server-side | user → **superseded** | Originally a new dedicated atom; Product's v22 rule (access does not change) accepted by the user on 2026-10-07 → existing `ROLE_CATALOG_INVENTORY::DELETE` (NFR-001) |
| E2 Bulk bar: shared shell vs separate | user | Extract a shared shell (NFR-008) |
| Golden Rule: per-part "Part not found." for unowned ids | user | Approved, on condition of no N+1 (NFR-009) → **Golden Rule Exemption** in the PR |
| `work_order_part_request.part_number` VARCHAR(50) | user | Refuse >50 now (S13-N7); widen in a separate ticket |

No prod queries were needed. Every data-dependent choice either has a safe default or became a user decision.

## 2. Architecture Overview

```
                      ┌──────────────────────── app/ ─────────────────────────┐
 Inventory page ──────┤ Inventory.vue (moved to ts/parts/inventory/)          │
  tabs, bulk mode     │  ├ InventoryToolbar.vue  ├ useInventoryBulkStatus.ts   │
                      │  ├ InventoryBulkStatusBar.vue → shared/BulkBar.vue ◄──┼── WO BulkActionBar.vue (also consumes the shell)
                      │  └ InventoryPartDialog.vue → StatusChangeConfirmDialog │
 Every new-work       │ PartSelect.vue (one component, two endpoints)          │
 part lookup ─────────┤  ├ options endpoint  → excludes inactive, inactiveMatch│
                      │  └ inventory/parts   → return/credit, keeps inactive   │
                      └───────────────┬────────────────────────────────────────┘
                                      │ REST
 ┌──────────────────────────────────── api/ ──────────────────────────────────────────┐
 │ Inventory/Parts                         PartsCatalogue/CataloguePart               │
 │  part.is_active, part.is_tracked (new)   catalogue_part (number, description,      │
 │  PATCH inventory/parts/status (bulk)     part_number_stripped) ◄── shared org-wide │
 │  create/change: typed number + desc      CataloguePartLinker (exact link)          │
 │  InactivePartGuard ◄────────────┐        CataloguePartRenamedEvent ──┐             │
 │  Part History = entity_event    │                                    ▼             │
 │                                 │        subscribers (one per module): open PO lines,
 │ VehicleService/WorkOrders ──────┘        part requests, canned parts, returns      │
 │  ValidationAwarePartRequestCommand, UpdatePartRequestValidator, canned-job warnings│
 │ Reporting: Inventory Value live filter + snapshot.is_tracked (as-of replay)        │
 │ Search: parts index + is_active/is_tracked   Dashboard: Critical Reorder filter     │
 │ OpenApi: PATCH /v1/parts/{id} rename → shared CataloguePartRenamer                 │
 └────────────────────────────────────────────────────────────────────────────────────┘
 Accounting (core + shopview-accounting): no change. Neither status nor tracking moves stock or cost.
```

Key facts from the codebase cross-check:

- **Number and description already live only on the shared `catalogue_part` row.** `part` has neither column. The PRD's model of a shared library entry matches the schema.
- **A core is a second `part` row** (`is_core = 1`, linked by `part.core_part_id`) with its own `catalogue_part` row ("Core for {description}"). "A core follows its part" means writing both rows in one operation.
- **Neither active/inactive nor tracked/untracked exists today.** Both are new columns.
- **Normalized matching already exists.** `PartNumber::sanitize()` → `catalogue_part.part_number_stripped` (indexed). We follow that pattern and never use an expression index, which DBAL's schema tools can't handle in this repo.
- **Inventory Value is already point-in-time** (`AsOfResolver` + `inventory_value_snapshot`). The snapshot row gains `is_tracked` (default 1, so every pre-release date counts all parts as tracked); replay filters on it, so a past date shows each part as it was.
- **Global search indexes inventory parts** (`PartDocumentProvider`, `mappings/parts.json`), reindexing a part whenever a Doctrine `Part` changes. The bulk DBAL write skips those listeners, hence the explicit reindex port (D7).
- **Three routes bypass the part dialog today:** the public API `PATCH /api/v1/parts/{id}` renames an entry with no collision check or carry-over; the CSV import rewrites an entry's number (`updateCatalogPart()` calls `setPartNumber`) and can re-point a part via `Part::change($cataloguePart, …)`; and the Part Library page uppercases the number on the client (`CataloguePartDialog.vue:263, 368, 384`). v22 closes all three (S13-R19d, S13-N8, S13-N9, S11-R3b).
- **Accounting:** both sides were checked. Core emits no per-part event, and the hub has no consumer of core's part feed. Status and tracking changes emit nothing.

## 3. Technical Decisions

**User decisions**
- **D14 — SUPERSEDED by PRD v22 (user-accepted 2026-10-07).** The first draft added a dedicated atom because `ROLE_CATALOG_INVENTORY::DELETE` is also granted by `catalogInventoryCreateAndEdit`, `settingsParts` and `seeFinancialData` (`api/src/Auth/UI/Cli/OneOff/Mapping/FEPermissionMappings.php:365-374, 683-694, 763-774`), so 9 of 11 default roles hold it. Product ruled that access does not change (S8-R14, S8-R15): the server checks `ROLE_CATALOG_INVENTORY::DELETE` exactly as the inventory part delete does, and the FE gates on the `catalogInventoryDelete` bundle exactly as the Delete button does. Consequence, accepted: a user without the Delete checkbox but holding the atom through another bundle can call the endpoints directly, exactly as with Delete Part today.
- **D15, NFR-008: extract a presentational `BulkBar` shell** from `app/src/components/ts/work-orders/work-order-lines/BulkActionBar.vue`; WO lines and Inventory both consume it. Rejected: a separate Inventory bar (the two would drift).
- **D17: per-part "Part not found." on the bulk endpoint** for missing, other-location and other-tenant ids. Never written, and the text is identical in every case, so there is no existence oracle. Condition: **no N+1** (NFR-009). 🔴 This departs from `database.md` §Inbound Identifiers, so it must be recorded under **"Golden Rule Exemptions"** in the PR description. Rejected: rejecting the whole request (S10-R13a becomes unreachable); org-strict hybrid.
- **D18: refuse a rename longer than 50 characters onto open part requests** (now PRD S13-N7) and widen `work_order_part_request.part_number` in a separate ticket. Widening forces a utf8mb4 COPY rebuild of a busy table, which needs a maintenance window.

**Agent decisions** (straightforward; override at plan review)
- **D2:** `part.is_active` and `part.is_tracked`: `TINYINT(1) NOT NULL DEFAULT 1`, written as `ALGORITHM=INSTANT`. `DEFAULT 1` is the release-day backfill (S1-R5, Q6).
- **D3:** `status` on `GET inventory/parts` is opt-in and defaults to `all`, because vendor return and credit read the same endpoint and must keep inactive parts (S9-R11).
- **D4:** one predicate in the shared options query covers S9-R1/R2/R3/R5/R6/R8 and S9-R15. Estimates and part sales are work orders, so they need no separate path.
- **D5:** normalized matches go through `cp.part_number_stripped` plus a new index `(organization_id, part_number_stripped)`.
- **D6:** Inventory Value excludes untracked parts in `applyLiveFilters()` (today). The daily snapshot **stores** `is_tracked` per row instead of dropping untracked rows, and the replay path filters `is_tracked = 1`; existing rows default to 1, so dates before release count every part (PRD Goals, v22).
- **D7 / NFR-003 / NFR-009:** the bulk status write is one scoped SELECT, one guarded batch `UPDATE`, and one multi-row `INSERT` into `entity_event` (≤ 400 rows: 200 parts + their cores). It sets `updated_at`/`updated_by` itself and asks search to reindex through a new port, because DBAL skips the Doctrine listeners.
- **D8:** `PartHistoryFetcher::getCountGroupByPart()` gains `IN (:pageIds)`. Today it aggregates the whole workplace's history on every 30-row page.
- **D9:** canned-job warnings use a request-scoped `CannedLineApplicationWarnings` collector (a `ResetInterface` service), filled by the two canned-line subscribers and returned by the controller as **one** combined `warning` (S9-R10/R10a, v22).
- **D10:** the part dialog sends the change-part request, then the status request (one id), exactly as S13-R22/N4/N5 describe.
- **D11:** bulk ticks are kept as `ref<string[]>` of part ids, not on the row objects, so a sort refetch keeps them (S2-R10a). This is the WorkOrderLines pattern, not the Cycle count one.
- **D12 / D21:** Part History search is built server-side (today `ViewQuery::getSearch()` is ignored). The BE `PartHistoryEventTextComposer` matches against the on-screen text, with a JSON parity fixture shared with the FE label generators. The FE keeps rendering its own labels.
- **D13:** remove the standalone Part Library create and the unpaginated, attribute-less `catalogue-parts-that-are-not-on-location` endpoint (~20k rows per dialog open).
- **D19:** one status endpoint, `PATCH /api/inventory/parts/status`, used by the bulk bar and by the dialog with a single id.
- **D20:** a rename reaches open work via a synchronous `CataloguePartRenamedEvent` on `IntegrationEventBus`. There is one subscriber per owning module, each running a set-based `UPDATE … JOIN`, so module ownership holds and there is no N+1.
- **D22:** a canned part pointing at another workplace's part uses that part's own status. "Changed at" stores the location name at change time. No index on the `part` flags until EXPLAIN shows a need. Core rows mirror the parent's tracking but get **no** tracking-history entries: the PRD asks for core history only on status (S10-R19) and number/description (S10-R26). `ChangePartRequestDto.min/max` become nullable, with null meaning keep (otherwise hiding Min/Max for untracked parts writes 0 and breaks S5-R4).
- **D23:** FE: a dedicated `StatusChangeConfirmDialog` over `BaseDialog`'s `#body` slot rather than a note prop on the shared dialog. `git mv` `Inventory.vue` into `ts/parts/inventory/` (a pure-move commit) and extract `InventoryToolbar.vue` + `useInventoryBulkStatus.ts`. `partsOptionsQueryOptions` returns `{ rows, inactiveMatch }`. S9-R16 on blur becomes a PartSelect validation rule rather than a new state in `usePartSelection`. The checkbox column is hand-rolled. Horizontal scroll is reset with a local DOM write. `BaseFormDialog` gains a `header-end` slot.
- **D24:** design boards settle what the PRD is silent on. Show "N records selected." under the table in bulk mode (boards 4.3, 4.9). Keep "New Inventory Part" visible in bulk mode (4.3, 4.8). Use "Sell Price" / "Core Charge" capitalization (S13-R4).
- **D25:** contract names follow the BE.
- **D26:** global search: `parts.json` mapping + `PartDocumentProvider` gain `is_active` / `is_tracked` (keyword/boolean); `SearchItemAssembler` exposes `isActive` / `isTracked`; the row's target adds `query.tab = 'inactive'` for an inactive part, which `Inventory.vue` honors on mount alongside the existing `?search=` prefill. Ships with `RebuildIndexesCommand` + `SwapAliasCommand` per environment before the FE reads the fields (absent fields read as active/tracked, so the order is safe).
- **D27:** one `CataloguePartRenamer` domain service (collision check S13-N1, S13-N3a no-op, S13-N7 length check, `rename()`/`describe()`, history, `CataloguePartRenamedEvent`) is called by all three rename routes: the part dialog (`ChangePartCommandHandler`), the Part Library page (`PartsCatalogue/.../Change/ChangeCommandHandler`) and the public API (`OpenApi/Part/Application/Update/UpdateController`). History rows carry `changedThrough` (`'public_api'` or null) so S10-R25a renders.
- **D28:** re-pointing is refused in the domain: `Part::change()` throws `PartError("A part can't be moved to a different Part Library entry.")` when handed a different `CataloguePart` (S13-N8). `CorePartModifier`'s core re-link uses `setCataloguePart()` on core rows and is unaffected. The CSV import resolves an existing part's **own** entry and never calls `setPartNumber` on it (S13-N9).
- **D29:** S11-R6a trimming lives in the catalogue `PartNumber` value object (`trim()` in the constructor), the one choke point every create route passes through; case is kept (S11-R3b). Overlaps #3384, which trims at the part-request layer; the two compose.
- **D30:** S13-R19c: `ReceiveADelivery.php:88,108` take the number posted by the Receive screen; for a line linked to an order item with a `part_id`, the handler resolves the number from that part's current entry instead, so a rename between opening and accepting is honored and no entry is created for the old number.

**New dependencies:** none.

**In-flight PRs that touch the same code (merge-order risk).** All target `main`; this epic branches from `develop`.
- **#3528 SV-10645** (Min/Max history): **delivers S10-R22a** ("Min/Max updated … Source: Edit Part / Import", `PartHistorySource::EditPart` / `InventoryImport`) and S5-E1's history half. It appends fields to the append-only, positional `PartHistoryPayloadDto` / `PartHistoryDto`. Phase 2 must start from a `develop` that contains it, and appends its fields **after** `source`.
- **#3384 SV-9938** (trim part numbers on part request): rebase Phase 7 after it.
- **#3294 SV-10033** (catalogue manufacturer FK + dangling-id cleanup): **S7-R6d depends on it** (PRD context note). Phase 6's index migration sorts after `Version20260924120000`; `fillManufacturerIfMissing` treats an id with no manufacturer row in the org as missing, so it is correct even before the cleanup runs.
- **#3489 SV-9827** and **#3486 SV-10628:** low risk; not touched.

## 4. Database Changes

### Modified tables

```sql
-- Illustrative shape only, NOT the migration to copy-paste
-- Phase 1 — Part.orm.xml: isActive (is_active), isTracked (is_tracked), boolean, default 1
ALTER TABLE part
  ADD is_active  TINYINT(1) DEFAULT 1 NOT NULL,
  ADD is_tracked TINYINT(1) DEFAULT 1 NOT NULL,
  ALGORITHM=INSTANT;

-- Phase 4 — InventoryValueSnapshot.orm.xml: isTracked (is_tracked), boolean, default 1
ALTER TABLE inventory_value_snapshot
  ADD is_tracked TINYINT(1) DEFAULT 1 NOT NULL,
  ALGORITHM=INSTANT;

-- Phase 6 — CataloguePart.orm.xml <indexes>
CREATE INDEX cp__organization_id_part_number_stripped_idx
  ON catalogue_part (organization_id, part_number_stripped);
```

- `part` has no organization column; the tenant is reached via `workplace`. No FK is added, so nothing goes into `MANUALLY_MANAGED_FOREIGN_KEYS`.
- No index on `is_active`/`is_tracked`. Every reader narrows by `workplace_id` first, and `part` is write-hot. Phase 2's DoD records an EXPLAIN.

**No permission data change.** Status, tracking and untracked-create reuse `ROLE_CATALOG_INVENTORY::DELETE` (NFR-001, S8-R15), so no atom, bundle link or atom-change allowlist entry is added.

> ⚠️ Migrations are written **by hand** and verified as a no-op with `bin/console doctrine:migrations:diff --allow-empty-diff` ("No changes detected"). DBAL's schema tools choke on functional/expression indexes in this repo, so the real migration is produced by the implementer against the live schema. Hand-authored FKs must be registered in `MANUALLY_MANAGED_FOREIGN_KEYS`. See `api/.claude/reference/database.md`.

### Data migrations
- Release-day state comes from `DEFAULT 1` (active and tracked, S1-R5/R5a). There is no separate backfill and no rollout setting (S1-R5b).
- Existing `inventory_value_snapshot` rows take `is_tracked = 1`, which is exactly "a date before release counts every part as tracked".
- **Search index rebuild (not SQL):** after the Phase 7 deploy, `bin/console` `RebuildIndexesCommand` for the `parts` index, then `SwapAliasCommand`, per environment (D26).
- No derived or denormalized data is introduced.
- Out of scope, separate ticket: widen `work_order_part_request.part_number` from `VARCHAR(50)` to 255 (D18).

## 5. API Changes

### New endpoints

**`PATCH /api/inventory/parts/status`.** Attribute: `#[IsGranted(PermissionEnum::ROLE_CATALOG_INVENTORY_DELETE)]`, the same as `Inventory/Parts/UI/HTTP/DeletePartController.php:20`; 403 otherwise (S8-N3, S8-R15).

```json
// request
{ "partIds": ["uuid"], "status": "inactive", "note": "Superseded by N6801-06-04X" }
// response 200 — also when every part fails
{ "data": { "updated": [{ "id": "uuid", "partNumber": "N68SL-356" }],
            "failed":  [{ "id": "uuid", "partNumber": "N68SL-356", "reason": "Part is already in that state." }] } }
```

- Whole-request 400s, with exact strings:
  - empty `partIds` → "Select at least one part." (S10-N4)
  - more than 200 distinct ids → "Select 200 parts or fewer." (S2-R8a)
  - trimmed note longer than 255 characters (`mb_strlen`) → "A note cannot be longer than 255 characters." (S10-N3)
- Per-part reasons, verbatim from S10-R13a:
  - "A core follows its part. Activate or deactivate the part instead."
  - "Part not found." (D17)
  - "Part is already in that state."
- Duplicate ids are de-duplicated. An empty or whitespace-only note is stored as null (S10-R15).

### Modified endpoints

| Endpoint | Change | Phase |
|---|---|---|
| `GET /api/inventory/parts` | `status=active\|inactive\|all` (default `all`); rows add `is_active`, `is_tracked`; Total Quantity sort per S6-R4…R9; history count bounded | 2, 4, 5 |
| `GET /api/inventory/parts/export`, `GET /api/inventory/count-sheet-pdf` | accept `status`; export writes "Not Tracked" for untracked parts; count sheet leaves untracked parts out | 2, 4 |
| `GET /api/inventory/parts/{id}` (view) | adds `isActive`, `isTracked` | 2 |
| `POST /api/inventory/parts/create` | **drops** `catalogPartId`; **adds** `partNumber`, `description` (trimmed, required, ≤255), `isTracked` (default true). Response `{ part_id, cataloguePartId, linkedToExistingEntry, libraryDescriptionKept }`. `isTracked=false` needs `ROLE_CATALOG_INVENTORY::DELETE` (S8-N1; read as "create untracked / change tracking", not every later edit of an untracked part — confirm with Product, Q18). `libraryDescriptionKept` = linked entry's description differs from the typed one ignoring case and outer spaces (S7-R9) | 4, 6 |
| `POST /api/inventory/parts/change` | **drops** `catalogPartId` (re-pointing refused, S13-E1/N8); **adds** `partNumber`, `description`, `isTracked` (omitted = unchanged); `min`/`max` nullable (null = keep). A tracking change needs `ROLE_CATALOG_INVENTORY::DELETE` (S8-N2). New refusals: S13-N1 (exact), S13-N7, S13-N8; a number differing only by outer spaces is no change (S13-N3a); the duplicate-at-location check runs only when the number changes (S7-N5b). The response includes the new `part_number`, `name`, `is_tracked` | 4, 6 |
| `GET /api/work-orders/part/request/inventory-parts-as-options-with-remaining-catalogue-parts` | excludes inactive parts and Part Library rows whose stripped number matches an inactive-only part here (S9-R15); adds `data.inactiveMatch: { partNumber } \| null` (S9-R16) | 7 |
| `POST /api/work-orders/part/make-request`, `change-request`; `POST /api/inventory/orders/create`, `add-item`, `change-item`; `POST /api/orders/items/{id}/part-number`; deprecated `POST /api/work-orders/parts/create` | refuse an inactive part or typed inactive-only number: "{part number} is inactive. Activate it from the Inactive tab to use it." (S9-R17). Not refused: re-saving the same part (S9-E2), ordering an existing part request (S9-E6), pick, receive, split, invoice | 7 |
| Apply canned line (`Line/CreateFromCannedLine`) | response `{ line_id, warning: { partNumbers: string[], skippedFees: [{ feeName, partNumber }], message } \| null }`: one warning per canned job; `message` is the full S9-R10/R10a text ("These parts are inactive and were not added: A, B." + one "The {fee} fee for {part number} was not added." per fee) | 7 |
| `GET /api/part-sales/{invoiceId}/list-credit-available-parts` | rows add `isInventoryPartInactive` | 7 |
| `GET /api/inventory/parts/history/...` (view) | `search` is honored server-side (S10-R27…R29); payload adds `note`, `changedAtWorkplaceId`, `changedAtWorkplaceName` | 2, 6, 8 |
| `POST /api/parts-catalogue/add-catalogue-part` | **removed** (S11-R1/R2, NFR-006) | 9 |
| `GET /api/parts-catalogue/catalogue-parts-that-are-not-on-location` | **removed** (dead after Phase 6; unpaginated, no `#[IsGranted]`) | 9 |
| Public API `POST /api/v1/parts` | **unchanged**, including its normalized 409 (S11-E3, S13-N1 note) | — |
| Public API `PATCH /api/v1/parts/{id}` | `part_number` / `name` go through `CataloguePartRenamer` (S13-R19d): S13-N1 → 409 `conflict`, S13-N7 → 422 `validation_error`, carry-over to open work, history ending "\| Changed through: Public API" (S10-R25a). Other fields unchanged | 6 |
| `GET /api/search` (parts hits) | `fields.isActive`, `fields.isTracked` (S9-R18…R20) | 7 |
| `POST /api/data-import/import-inventory` (CSV) | never re-points a part, never changes an entry's number (S13-N9); a blank Manufacturer cell keeps the entry's manufacturer (S9-E8a) | 6 |

## 6. Implementation Phases

Every phase lands BE and FE together and can be tested on its own. No phase has pending Product items (PRD v22).

---

### Phase 1: Foundations: schema, domain flags, shared FE primitives
**Implements:** S1-R5, S1-R5a, S1-R5b (data), S2-R17 / S5-R9 (domain), S2-N3 (domain), NFR-008
**Depends on:** nothing

#### Database changes:
| Migration/Change | Description |
|---|---|
| `api/migrations/Version<ts>.php` | `part.is_active`, `part.is_tracked` (§4). No feature flag (S1-R5b) |

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `api/src/Inventory/Parts/Infrastructure/Doctrine/Part.orm.xml` | Modify | map `isActive`, `isTracked` |
| `api/src/Inventory/Parts/Domain/Part.php` | Modify | append ctor params `bool $isActive = true, bool $isTracked = true`; `isActive()`, `isTracked()`, `deactivate()`, `activate()`, `stopTracking()`, `startTracking()` all also apply to `$this->corePart`; `setCorePart()` copies the parent's flags onto a newly attached core (S5-R9, covering `CoreChargeService`, `PartModifier`, `SpecialPartsToInventoryCommandHandler`); calling these on a core throws `PartError('A core follows its part. Activate or deactivate the part instead.')` |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/shared/BulkBar.vue` | Create | `count` prop, default slot for actions, `close` emit; count badge + "selected", divider, `q-space`, X `aria-label="Clear selection"` / `button_bulk_close_selection` **plus a `q-tooltip` "Clear selection"** (S2-R9; the WO bar's X has no hover text today, so WO lines gain it too — the one intended visible change of the extraction); moves the `--bulk-bar-*` styles and the `body--dark` block here; **keeps** the `bulk-action-bar__*` class names (asserted by `BulkActionBar.spec.ts` and the E2E page object) |
| `app/src/components/ts/work-orders/work-order-lines/BulkActionBar.vue` | Modify | root becomes `<BulkBar class="bulk-action-bar">`. 🔴 Re-anchor scoped rules from `.bulk-action-bar__inner :deep(...)` to the shell **root**, or they silently stop matching |
| `app/src/components/ts/shared/StatusPill.vue` | Create | `label`, `tone: 'positive' \| 'neutral'`, `dense`; pill geometry from `DefaultBadge.vue`; dark-theme variants |
| `app/src/components/ts/parts/inventory/StatusChangeConfirmDialog.vue` | Create | wraps `BaseDialog` `#body`; note `Input` labeled "Note (Optional)" with `maxlength=255` (S10-R10); confirm color `negative`/`primary` + text "Deactivate"/"Activate"; uses `:async-confirm` (reject keeps it open) |
| `app/src/components/ts/parts/inventory/Model.ts` | Modify | pure `buildStatusChangeCopy({ action, source, count, partNumber, description })` → `{ title, lead, lines[{ text, tone }] }`, the S10-R3…R9 matrix |
| `app/src/components/ts/shared/dialogs/BaseFormDialog.vue` | Modify | additive `header-end` slot between `q-space` and the close X |

#### Key code changes:
```php
// api/src/Inventory/Parts/Domain/Part.php — the core-follows rule lives in one place
public function deactivate(): void
{
    $this->assertNotCore();
    $this->isActive = false;
    $this->corePart?->followParentActive(false);
}
public function setCorePart(?Part $corePart): void
{
    $this->corePart = $corePart;
    $corePart?->followParent($this->isActive, $this->isTracked); // S5-R9: a core added later takes the part's state
}
```

#### Unit / Integration tests:
- BE `api/tests/Unit/Inventory/Parts/Domain/PartTest.php`: core follows on deactivate/activate/stopTracking/startTracking; `setCorePart` copies the flags; a core refuses on its own.
- `bin/console permissions:diff-atoms` shows **no** drift (CI `be-permission-drift.yml`): this epic changes no permission data.
- FE `shared/tests/BulkBar.spec.ts`, `StatusPill.spec.ts`, `StatusChangeConfirmDialog.spec.ts`, `inventory/tests/Model.spec.ts` (the whole copy matrix, including n=1 wording), and one `BaseFormDialog.spec.ts` case.
- FE regression, unchanged and green: `BulkActionBar.spec.ts`, `BulkActionBar.undoToast.spec.ts`, `useBulkActions.spec.ts`, `WorkOrderLines.actions.spec.ts`, `CompletionWizard.spec.ts`, `WorkOrderNavBar.spec.ts`, `notificationUndo.spec.ts`.

#### Verification (Definition of Done gates):
- **Static:** BE cs-fix + phpstan (files) + pest; FE eslint + vitest related + vue-tsc
- **Migration gate:** `doctrine:migrations:migrate`, then `doctrine:migrations:diff --allow-empty-diff` → "No changes detected"
- **Smoke:** `bin/smoke-test.sh`
- **Compile:** Vite clean
- **Browser-walk:** a work order with ticked lines, light **and** dark theme. The bulk bar must look and behave exactly as before, except that hovering the X now shows "Clear selection".

#### E2E tests (e2e/):
- No new workflow (no user-visible change). Regression: `bulk-line-actions.spec.ts`, `bulk-status-undo.spec.ts`, `bulk-create-invoice.spec.ts`, `completion-optional-invoice.spec.ts` (page object `bulk-action-bar.page.ts` keeps its test-ids).
- Coverage block: override marker (§7).

---

### Phase 2: Status change and the Active/Inactive tabs
**Implements:** S1-R1…R10, S1-N1…N2, S8-R1…R5, S8-N3, S10-R14…R20 (BE), S13-R3 (data), NFR-002, NFR-004, D17, NFR-009
**Depends on:** Phase 1; `develop` must contain #3528

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `api/src/Inventory/Parts/UI/HTTP/PartStatus/ChangePartsStatusController.php` + `DTO/ChangePartsStatusRequestDto.php` | Create | `PATCH /api/inventory/parts/status`; plain string ids (not `#[MapEntity]`, per D17); `Count(min:1)`, `All(Uuid)`, `Choice` |
| `api/src/Inventory/Parts/Application/Command/PartStatus/ChangePartsStatusCommand.php`, `Application/Handler/PartStatus/ChangePartsStatusCommandHandler.php`, `Application/DTO/PartStatus/PartsStatusChangeResultDto.php` | Create | handler: scoped read → plan → one transaction (batch UPDATE + batch history INSERT) → reindex after commit |
| `api/src/Inventory/Parts/Domain/Model/PartStatus.php`, `Domain/Model/PartLifecycleNote.php`, `Domain/Service/Status/PartStatusChangePlan.php` | Create | enum; note VO (trim, empty → null, 255 `mb_strlen`); pure plan (failures, eligible parents, ids to write incl. cores) |
| `api/src/Inventory/Parts/Domain/Repository/PartStatusRepositoryInterface.php`, `Infrastructure/Persistence/Query/Dbal/DbalPartStatusRepository.php` | Create | `findForStatusChange()` (one SELECT, `WorkplaceDecorator`), `setActive()` (one guarded UPDATE that also sets `updated_at`/`updated_by`) |
| `api/src/EntityEvent/Domain/Repository/EntityEventBatchWriterInterface.php`, `api/src/EntityEvent/Infrastructure/Persistence/DbalEntityEventBatchWriter.php` | Create | multi-row INSERT, chunked at 200 |
| `api/src/Inventory/Parts/Domain/Repository/PartSearchReindexRequesterInterface.php`, `api/src/Search/Infrastructure/Adapter/SearchIndexPartReindexRequester.php` | Create | port + adapter → `SearchIndexChangeCollector::add(EntityType::Part, $id)` |
| `api/src/Inventory/Parts/Domain/History/PartHistoryEvents.php` | Modify | `PART_DEACTIVATED = 'part.status.deactivated'` ("Deactivated"), `PART_ACTIVATED = 'part.status.activated'` ("Activated"), in all three lists |
| `api/src/Inventory/Parts/Application/HTTP/History/DTOs/PartHistoryPayloadDto.php`, `PartHistoryDto.php` | Modify | append **after #3528's `source`**: `?string $note`, `?string $changedAtWorkplaceId`, `?string $changedAtWorkplaceName` (the last two are filled in Phase 6) |
| `api/src/Inventory/Parts/Domain/Service/History/PartHistoryResolver.php` | Modify | `hydrateData()` passes the new fields; extract `entityEventsFor()` so the bulk path and `dispatchEntityEventsFromPartHistory()` share the payload code |
| `api/src/Inventory/Parts/UI/HTTP/Part/DTO/PartListRequestDto.php`, `Application/Query/Part/PartListQuery.php`, `UI/HTTP/Part/PartListController.php`, `Infrastructure/Persistence/DbalPartListFetcher.php`, `Application/Service/Part/PartListResultFactory.php` | Modify | `status` param (default `all`); `AND p.is_active = :isActive` when it isn't `all`; select and map `is_active`, `is_tracked` |
| Export: `.../DTO/ExportPartRequestDto.php`, `.../Query/Part/ExportPartQuery.php`, `.../Handler/Part/ExportPartQueryHandler.php`; Count sheet: `.../CountSheetPdf/DTO/CountSheetPdfRequestDto.php`, `api/src/Inventory/Parts/Application/Pdf/CountSheetPdfQueryHandler.php` | Modify | `status` param (S1-R9, S1-R10). The count sheet has its own query, so it needs its own predicate |
| `api/src/Inventory/Parts/Application/HTTP/View/ViewQueryHandler.php`, `ViewQueryResult.php` | Modify | `isActive`, `isTracked` |
| `api/src/Inventory/Parts/Domain/Service/History/PartHistoryFetcher.php` | Modify | `getCountGroupByPart(array $partIdBytes)` adds `IN (:ids)`; empty input → `[]` with no query. Callers: `PartListResultFactory.php:32`, `ChangePartCommandHandler.php:242` |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `app/src/components/parts/Inventory.vue` → `app/src/components/ts/parts/inventory/Inventory.vue` | Move (pure `git mv` commit), then Modify | update `app/src/pages/Parts.vue:95-97`; move `Inventory.spec.ts` and `InventoryHistoryButton.spec.ts` alongside |
| `app/src/components/ts/parts/inventory/InventoryToolbar.vue` | Create | search / FilterBar / column selection / actions menu / New Inventory Part row, lifted out of `<Table #top>` |
| `.../inventory/Inventory.vue` | Modify | page-level column layout: title slot → `q-tabs` (`tab_active_inventory`, `tab_inactive_inventory`) → (bulk bar, Phase 3) → toolbar → `<Table>` with no `#top`; replace `.max-height` with flex sizing (`flex: 1; min-height: 0`, as in the reports suite) so there's one scrollbar; `statusTab` ref (not URL-synced) sent on list, export and print; `#no-data`: narrowed → `FilteredTableEmptyState`, Inactive tab → "No inactive parts at this location." (`text_no_inactive_parts`) |
| same | Modify | `menuItems` → computed list with `:data-test-id="menu_item_inventory_<key>"`, which also adds IDs to the existing **Cycle count** and **Export** items |
| `app/src/api/parts/PartsModel.ts`, `app/src/api/parts/index.ts` | Modify | `FetchPartsParams.status`; `InventoryPart.is_active/is_tracked/deletable?/has_work_order_part?/has_outstanding_return?`; `changePartsStatus()` (PATCH) with `handlesFailureLocally`; typed `CountSheetParams` |
| MSW default handlers (`app/src/testing`) | Modify | `inventory/parts` rows carry the flags; new status handler |

> 🔴 `PartSelect.vue:394-397` (the vendor return/credit path) must **not** send `status`. It relies on the `all` default (NFR-002).

#### Key code changes:
```sql
-- DbalPartStatusRepository — one scoped read (no N+1), WorkplaceDecorator fails closed
SELECT p.id, p.is_core, p.is_active, p.core_part_id, cp.part_number, cr.id AS core_id
FROM part p JOIN catalogue_part cp ON cp.id = p.catalogue_part
LEFT JOIN part cr ON cr.id = p.core_part_id
WHERE p.id IN (:ids) AND p.workplace_id = :wp;
-- one guarded write; a concurrent identical change is a no-op
UPDATE part SET is_active = :to, updated_at = :now, updated_by = :user
WHERE id IN (:idsToWrite) AND workplace_id = :wp AND is_active <> :to;
```

#### Unit / Integration tests:
- BE unit: `PartStatusChangePlanTest` (not found / core / already in state / core written with parent / mixed / duplicates), `PartLifecycleNoteTest`, `ChangePartsStatusCommandHandlerTest` (nothing eligible → no transaction; rollback; reindex only after commit), `PartHistoryEventsTest`.
- BE functional:
  - `ChangePartsStatusTest`: per-part results; core follows; one `entity_event` per parent + core with the note; `updated_at` moves; S10-N3/N4; more than 200 refused; an id from another workplace → "Part not found." and nothing changes.
  - `ChangePartsStatusAuthorizationTest`: mirrors `DeletePartController`'s matrix exactly (S8-R15) — a user without `ROLE_CATALOG_INVENTORY::DELETE` → 403; Parts Manager → 200; a user holding the atom only through Create & Edit → 200, the same as a delete today.
  - `PartListStatusFilterTest`: active / inactive / all; the default is all.
  - export and count sheet `status`; `PartHistoryViewTest` shows a status row with its note.
- BE integration: `DbalEntityEventBatchWriterTest`.
- FE `ts/parts/inventory/tests/Inventory.spec.ts`: Active by default; `status` sent; switching tabs refetches; the two empty states; menu test IDs present; export and print get `status`.

#### Verification (Definition of Done gates):
- **Static** (both areas) · **Smoke** · **Compile**
- **EXPLAIN** of the list query with `status=active` on a data copy, recorded in the PR
- **Browser-walk** `/parts/inventory` as **admin**: the tabs sit on their own line under the title (board 3.5); the Inactive tab's empty state (board 4.10); a single scrollbar at 1920×1080 and 1366×768. Status changes are exercised via the API until Phase 3.

#### E2E tests (e2e/):
- Happy path: the Inventory list opens on Active; Active lists A but not B, and Inactive lists B but not A (B deactivated via `PartsFactory.setPartsStatus`).
- Verify `inventory.page.ts:36` page-load anchor `table_inventory` still resolves after `#top` is removed.
- The empty Inactive state stays at FE-unit level (`Inventory.spec.ts`), since the shared org always has inactive parts from other specs.

---

### Phase 3: Bulk status mode (Stories 2, 3, bulk half of 10)
**Implements:** S2-R1…R17, S2-N1…N3, S2-E1…E4, S3-R1…R5, S3-N1, S10-R1…R13a (bulk), S10-N1/N2, S8-R3/R4
**Depends on:** Phase 2

#### Backend changes (`api/`):
None (the Phase 2 endpoint serves it).

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/parts/inventory/useInventoryBulkStatus.ts` | Create | `isOn`, `selectedIds: ref<string[]>` (D11), header-tick over loaded rows (S2-R6), `blockedReason` ("Tick the parts to deactivate/activate", "Select 200 parts or fewer."), `enter()` (resets horizontal scroll via `.q-table__middle.scrollLeft = 0`, S2-R4), `exit()`, `clearTicks()` |
| `app/src/components/ts/parts/inventory/InventoryBulkStatusBar.vue` | Create | `<BulkBar>` + one action in the **wrapper-span tooltip pattern** copied from `BulkActionBar.vue:41-103` (Quasar puts a native `disabled` on buttons, so a nested tooltip never fires), including the `--hint-anchor` margin shuffle; `button_bulk_deactivate_parts` / `button_bulk_activate_parts` (color `primary` — the blue "Deactivate"/"Activate" of S2-R7b/S3-R2, set explicitly rather than inheriting the WO bar's action styling), `tooltip_bulk_status_blocked` |
| `.../inventory/Inventory.vue` | Modify | menu entry "Deactivate parts"/"Activate parts" (`menu_item_inventory_bulk_status`) between Cycle count and Export, shown only when the reactive `usePermissions().canDelete('catalogInventory')` (hidden, not disabled); in mode the menu is `[Export]` only (S2-R10b); a 44px `bulk_select` column with `checkbox_select_all_inventory` / `checkbox_select_inventory_part_<id>`; a row click toggles the tick (before the `canEdit` early return); search and filter changes clear ticks, sort keeps them; tab change → `exit()`; "N records selected." line under the table (D24); New Inventory Part stays visible |
| same | Modify | submit flow below; success removes rows from `inventoryData` without a reload (S2-R12, S3-R4) |
| `app/src/utils` barrel | Modify | re-export `responseErrorMessages` from `boot/axios.ts`, so feature code doesn't import `@/boot` |

#### Key code changes:
```ts
// useInventoryBulkStatus.ts — submit (called from StatusChangeConfirmDialog :async-confirm)
const submit = async (note: string | null) => {
  const { updated, failed } = await partsApi.changePartsStatus(
    { partIds: selectedIds.value, status: action.value === 'activate' ? 'active' : 'inactive', note: note ?? undefined },
    { handlesFailureLocally: true });
  removeRows(updated.map((u) => u.id));
  if (!failed.length) { showSuccessNotification({ message: plural(updated.length, 'part') + ' updated.' }); exit(); return; }
  selectedIds.value = failed.map((f) => f.id);                       // S2-R15 / S10-N2: retry the failures
  showErrorNotification({
    message: updated.length ? `${plural(updated.length, 'part')} updated, ${failed.length} could not be changed.` /* Q19 assumption */ : 'No parts were changed.',
    caption: failed.map((f) => `${escapeHtml(f.partNumber)}: ${escapeHtml(f.reason)}`).join('<br>'), // 🔴 escape: user-entered
    html: true, timeout: 0,
  });
};
// catch: 400 → responseErrorMessages + "Please try to resolve this.", timeout 3000;
//        5xx → "Failed to update part status" / "Please try again or contact support for help", timeout 7000; rethrow keeps the confirm open
```

#### Unit / Integration tests:
- FE `useInventoryBulkStatus.spec.ts`: the header tick covers loaded rows only; ticks survive a sort refetch; search/filter clears them; a tab change exits; 0 and 201 ticked give the right reasons; partial failure keeps only the failed ids; full success exits.
- FE `InventoryBulkStatusBar.spec.ts`: disabled button with the wrapper tooltip; the label follows the tab.
- FE `Inventory.spec.ts`: mode adds the column; a row click ticks instead of opening; the menu shows only Export in mode; rows are removed on success; the confirm copy is right for bulk deactivate/activate and n=1.

#### Verification (Definition of Done gates):
- **Static (FE)** · **Compile**
- **Browser-walk** `/parts/inventory`:
  - as **admin**: boards 4.1–4.10. Deactivate 2 parts with a note, then check Part History; reactivate from the Inactive tab; tick past 200 by scrolling and using select-all to get the tooltip; the X leaves the mode; check dark theme.
  - as a **Create & Edit without Delete** role (e.g. Service Advisor): no bulk menu entry.

#### E2E tests (e2e/):
- Happy path: bulk deactivate two parts with a note → they leave Active and appear on Inactive; Part History shows "Deactivated | Reason: …".
- Happy path: bulk activate from the Inactive tab.
- Edge: partial failure (B made inactive via API after ticking): "1 part updated, 1 could not be changed." (Q19) lists B's reason, and the mode stays on with only B ticked.
- The permission and disabled-tooltip edges live in Phase 6's permission UPDATE and in FE unit tests respectively.

---

### Phase 4: Tracking (Stories 4, 5 except the dialog UI, Inventory Value, cycle count)
**Implements:** S1-R9a, S4-R6a, S4-R8, S4-R8a, S4-R8b, S4-R9, S4-N1/N2, S5-R2…R14, S5-N1, S6-R10, S8-R7…R10, S8-N1/N2, S9-E12, S10-R22, PRD Goals (past-date Inventory Value)
**Depends on:** Phase 1 (Phase 2 for the history payload fields)

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `api/src/Inventory/Parts/UI/HTTP/CreatePartController.php`, `ChangePartController.php`, `UI/HTTP/DTO/CreatePartRequestDto.php`, `UI/HTTP/DTO/ChangePartRequestDto.php`, `Application/Command/CreatePartCommand.php`, `ChangePartCommand.php` | Modify | `isTracked`; `denyAccessUnlessGranted(PermissionEnum::ROLE_CATALOG_INVENTORY_DELETE)` on create-untracked and on a real tracking change (S8-N1/N2, S8-R15 — the delete's own check); `validateBinsDefault()` enforces "At least one bin must be provided." / "…marked as default." **only when the effective state is tracked** ("Only one bin can be marked as default." always applies); `ChangePartRequestDto.min/max` → `?int = null` (keep) |
| `api/src/Inventory/Parts/Application/Handler/CreatePartCommandHandler.php`, `ChangePartCommandHandler.php` | Modify | build/flip tracking through the domain (the core follows); `ChangePartOutputDto` + create response include `isTracked` |
| `api/src/Inventory/Parts/Domain/Service/History/InventoryPartUpdatedEventsDispatcher.php`, `Domain/History/PartHistoryEvents.php` | Modify | `recordOnTrackingChanged()` for part + core, written even with nothing on hand; `PART_TRACKING_TURNED_OFF = 'part.tracking.turned_off'` ("Tracking turned off"), `PART_TRACKING_TURNED_ON` ("Tracking turned on") |
| `api/src/Inventory/Parts/Application/Handler/CycleCount/PartsCycleCountCommandHandler.php` | Modify | skip untracked parts (S5-R12) |
| `api/src/Inventory/Parts/Application/Pdf/CountSheetPdfQueryHandler.php` | Modify | `AND p.is_tracked = 1` (S5-R13) |
| `api/src/Reporting/Reports/Infrastructure/Persistence/Query/Dbal/DbalInventoryValueFetcher.php` | Modify | `applyLiveFilters()`: `AND p.is_tracked = 1`. One method covers the count, page, totals and staged builders |
| `api/migrations/Version<ts>.php`; `api/src/Reporting/Reports/Infrastructure/Doctrine/InventoryValueSnapshot.orm.xml`, `Domain/Model/InventoryValueSnapshot.php` | Create / Modify | `inventory_value_snapshot.is_tracked` (§4), mapped `isTracked` |
| `api/src/Reporting/Reports/Application/InventoryValue/Snapshot/InventoryValueSnapshotCapturer.php`, `Infrastructure/Persistence/Repository/Doctrine/DbalInventoryValueSnapshotRepository.php` | Modify | capture **writes** `p.is_tracked` on every row (untracked rows are kept, D6) |
| `DbalInventoryValueFetcher.php` (replay / snapshot path) | Modify | `AND s.is_tracked = 1`, so a past date shows each part's as-of tracking state; pre-release rows are all 1 |
| `api/src/Inventory/Parts/Application/Handler/Part/ExportPartQueryHandler.php` | Modify | an untracked part's quantity is exported as "Not Tracked"; no status column (S1-R9a) |
| `api/src/Inventory/Parts/Infrastructure/Persistence/PartSupplyFilterDecorator.php` | Modify | for any supply value other than `all`, add `AND p.is_tracked = 1` (S6-R10) |
| `api/src/Dashboard/Application/Query/Inventory/InventoryQueryHandler.php::fetchCriticalReorder` | Modify | `AND p.is_tracked = 1 AND p.is_active = 1` (S5-R14, S9-E12). Stock-value figures and slow/fast movers are untouched |

🔴 **Do not** add a tracking filter to `AccountingOnboardingSourceFetcher::fetchOpeningInventoryByWorkplace()`, `PartQuantityChangedEventManualChangeSubscriber`, `CreatePartCommandHandler::saveInventoryChange()`, `Dashboard/.../InventoryQueryHandler::fetchSlowMovingInventory/fetchFastMovingInventory`, or `DbalPartsVelocityFetcher`. The PRD's Accounting section keeps untracked parts in all of them.

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `.../inventory/Inventory.vue` | Modify | `#body-cell-quantity`: untracked → "Not Tracked" (`text_not_tracked_<id>`, grey) in the host, not inside `StockQuantityBadge` (global search also uses it); bins and Min/Max cells unchanged (S4-R8a/R8b); `#body-cell-count`: untracked → "Not Tracked" (`text_count_not_tracked_<id>`) |
| `app/src/composables/useCycleCount.ts` | Modify | untracked rows never count against the 200 budget, `isCountChanged` or the submit payload |
| `.../inventory/Inventory.vue` `updateInventoryCache` | Modify | merge `is_tracked` (S5-R10, no reload) |

#### Unit / Integration tests:
- BE unit: create untracked with no bins; a flip writes history for part + core; null min/max keeps the values; DTO bin rules only when tracked.
- BE functional: `PartTrackingTest`, `PartTrackingAuthorizationTest` (403 without `ROLE_CATALOG_INVENTORY::DELETE`, the same matrix as the part delete; a tracked create is allowed, S8-R10), `PartsCycleCountTest` (untracked skipped), `CountSheetPdfTest`, Inventory Value live + capture (untracked row kept with `is_tracked = 0`) + past-date replay (a part untracked today still counts on a date when it was tracked; a pre-release date counts everything), export "Not Tracked", `PartSupplyFilterTest` (untracked only under `all`), `CriticalReorderTest` (untracked and inactive left out); regression `ChangePartOmittedBinsStockLossTest`, `CostChangeRevaluationTest`, #3528's `ChangePartMinMaxHistoryTest`.
- FE: `Inventory.spec.ts` (Not Tracked cells), `useCycleCount` spec cases.

#### Verification (Definition of Done gates):
- **Static** (both) · **Smoke** · **Compile**
- Inventory Value report checked by hand on a seeded workplace, live and past date
- Dashboard Critical Reorder and the Supply filter checked with one untracked part below its Min
- **Browser-walk** `/parts/inventory` as admin: an untracked part (set via the API until Phase 6) shows "Not Tracked" with bins and Min/Max still visible (board 5.3); cycle count shows "Not Tracked" (board 5.7); the printed count sheet leaves it out.

#### E2E tests (e2e/):
- Happy path: an untracked part (seeded via API) shows "Not Tracked" in Total Qty with its bin chip still visible, and cycle count shows "Not Tracked" with no input.
- Factory: `createUntrackedPart` (old create contract + `isTracked: false`). `afterEach` deletes it.

---

### Phase 5: Search and sort by tracking state (Story 6)
**Implements:** S6-R1…R9, S6-N1
**Depends on:** Phase 4

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `api/src/Inventory/Parts/Infrastructure/Persistence/PartTrackingSearchDecorator.php` | Create | the single place that maps search terms to tracking state; applied in `DbalPartListFetcher::searchParts()` and `ExportPartQueryHandler` |
| `api/src/Inventory/Parts/Infrastructure/Persistence/DbalPartListFetcher.php` | Modify | explicit ORDER BY; build `Paginator` with `sortFields: []` (it then adds no ORDER BY, and `applyPostSort` for `sell_price` keeps working) |

#### Frontend changes (`app/`):
None. The FE sends no `sortBy` by default (verify), and search is a server param.

#### Key code changes:
```php
// PartTrackingSearchDecorator — S6-R1 (v22): additive
private const UNTRACKED_TERMS = ['not tracked', 'not', 'tracked'];          // trimmed + lower-cased
public static function isUntrackedTerm(string $s): bool { return in_array(mb_strtolower(trim($s)), self::UNTRACKED_TERMS, true); }
// the term keeps going through SearchDecorator as usual (number, description, tags, other standard fields),
// and the decorator ORs in the untracked parts:  (<SearchDecorator predicate>) OR p.is_tracked = 0

// DbalPartListFetcher — S6-R4…R9
if ('quantity' === $sortBy) {
    $qb->addOrderBy('p.is_tracked', 'DESC')                                  // untracked last in BOTH directions
       ->addOrderBy('CASE WHEN p.is_tracked = 1 THEN p.quantity END', $dir)
       ->addOrderBy('cp.name', 'ASC');
} elseif (null !== $sortBy && isset($this->sortFields[$sortBy])) {
    $qb->addOrderBy($this->sortFields[$sortBy], $dir)->addOrderBy('cp.name', 'ASC');   // S6-R8
} else {
    $qb->addOrderBy('p.is_tracked', 'DESC')->addOrderBy('cp.name', 'ASC');            // S6-R9
}
$qb->addOrderBy('p.id', 'ASC');                                               // deterministic infinite scroll
```

Known pre-existing gap, not fixed here: the SQL sorts on `p.quantity`, while the cell shows the bin-derived available quantity.

#### Unit / Integration tests:
- BE unit `PartTrackingSearchDecoratorTest` (terms, case, whitespace; "t" and "track" don't match).
- BE functional `PartListTrackingSortTest` (S6-R4…R9 both directions) and `PartListSearchTest` (S6-R1 additive: "not" returns the untracked parts **and** a tracked "NOTCHED BELT"; R2, N1).

#### Verification (Definition of Done gates):
- **Static (BE)** · **Smoke**
- **Browser-walk:** board 5.4. Search "not tracked"; sort Total Qty both ways.

#### E2E tests (e2e/):
- None. No UI-affecting path changes, so no coverage block is needed. BE functional tests cover the S6 ordering exhaustively.

---

### Phase 6: The part dialog, create by typing, rename and propagation (Stories 4/5 dialog UI, 7, 13, dialog half of 10)
**Implements:** S4-R1…R7, S5-R1, S5-R3…R8, S7-R1…R11 (incl. R6c, R6d), S7-N1…N6 (incl. N5b), S8-R6, S8-R9, S8-R11, S8-R12, S10-R1…R11 (dialog), S10-R23…R26, S10-R25a, S11-R3a, S11-R6a, S13-R1…R28 (incl. R19b…R19d), S13-N1…N9 (incl. N3a), S13-E1, S5-E1, S9-E8a, NFR-005
**Depends on:** Phases 1, 2, 4; #3294 merged (S7-R6d)

#### Database changes:
| Migration/Change | Description |
|---|---|
| `api/migrations/Version<ts>.php` | `cp__organization_id_part_number_stripped_idx` (§4); sorts after #3294's `Version20260924120000` |

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `CreatePartRequestDto.php`, `CreatePartCommand.php`, `CreatePartController.php`, `CreatePartCommandHandler.php` | Modify | typed `partNumber`/`description` (`NotBlank(normalizer: trim)` → "Part number is required." / "Description is required.", S7-N6; ≤255); replace the `'Cannot add part variant…'` guard with the S7-N3/N4/N5/N5a refusals naming the **existing** part's number |
| `api/src/PartsCatalogue/CataloguePart/Domain/Service/CataloguePartLinker.php`, `LinkResult.php` | Create | exact, case-sensitive link (fetch case-insensitively, then filter with PHP `===`); 1 match → link (S7-R5), with tags union (R6a), manufacturer filled if missing **or pointing at no manufacturer in this org** (R6b, R6d), the description kept (R6) and the category kept (R6c — today the dialog's pick overwrites it); 0 or more than 1 match → own entry (S7-R7/R8) |
| `api/src/Inventory/Parts/Domain/Repository/PartNumberAtLocationFetcherInterface.php`, `Infrastructure/Persistence/Query/Dbal/DbalPartNumberAtLocationFetcher.php` | Create | one query: `JOIN catalogue_part … WHERE cp.part_number_stripped = ? AND p.workplace_id = ? AND p.is_core = 0` (org + workplace scoped) |
| `api/src/PartsCatalogue/CataloguePart/Domain/CataloguePart.php` | Modify | `createForNewPart()`, `fillManufacturerIfMissing()`, `rename()`, `describe()`. **Rename and describe also update the core entry** (same number; "Core for {description}"). This doesn't happen today |
| `api/src/Inventory/Parts/Domain/Service/CatalogPartTagFactory.php`, `PartsCatalogue/.../CataloguePartFetcherInterface.php`, `DbalCataloguePartFetcher.php` | Modify | `addTagsToCatalog()`; `findNonCoreByPartNumberCaseInsensitive()` |
| `ChangePartRequestDto.php`, `ChangePartCommand.php`, `ChangePartCommandHandler.php` | Modify | drop `catalogPartId` and the re-point branch; add `partNumber`/`description`; number/description changes go through `CataloguePartRenamer` (D27); the duplicate-at-location check (S7-N3/N4) runs **only** when the number changes, never on a save with the number unchanged (S7-N5b), so existing same-location duplicates keep saving |
| `api/src/PartsCatalogue/CataloguePart/Domain/Service/CataloguePartRenamer.php` | Create | shared by the dialog, the Part Library page and the public API (D27): compare **trimmed** typed vs. saved — equal → no change, saved value kept (S13-N3, N3a); collision check (S13-N1); S13-N7 check (one `EXISTS` on open part requests for the entry and its core, only when the new number is longer than 50); `rename()` / `describe()`; history with `changedThrough`; publish `CataloguePartRenamedEvent` |
| `api/src/PartsCatalogue/CataloguePart/Domain/PartNumber.php` | Modify | constructor `trim()`s; case kept (S11-R6a, S11-R3b, D29). Composes with #3384's part-request trim |
| `api/src/PartsCatalogue/CataloguePart/Domain/Service/PartLibraryNumberCollisionChecker.php` | Create | org-scoped, non-core, excludes self + own core; **exact** match: fetch candidates on `cp.part_number = :n` via `cp_part_number_idx` (case-insensitive like the linker's fetch; the implementer confirms the column collation), then PHP `===` (S13-N1); "Part number {number} already belongs to another part in the Part Library." |
| `api/src/PartsCatalogue/CataloguePart/Application/Integration/Event/CataloguePartRenamedEvent.php` | Create | `cataloguePartId`, `coreCataloguePartId`, `oldNumber`, `newNumber`, `organizationId` |
| `api/src/Inventory/Orders/Application/Integration/EventSubscriber/RenameOpenOrderItemsOnCataloguePartRenamed.php` | Create | set-based `UPDATE … JOIN` on open PO lines (+ `parent_part_number` for core lines). An unaccepted delivery is covered by these lines (S13-R19); `inventory_delivery_item` rows exist only once accepted and keep their number (S13-R19b) |
| `api/src/Inventory/Returns/Application/Integration/EventSubscriber/RenameOpenReturnItemsOnCataloguePartRenamed.php` | Create | open vendor returns + manual return requests |
| `api/src/VehicleService/WorkOrders/Application/Integration/EventSubscriber/RenameOpenPartRequestsOnCataloguePartRenamed.php` | Create | open part requests, canned parts, open WO return requests; no length check here — `CataloguePartRenamer` refuses an over-50 number **before** saving (S13-N7), so the subscriber can never truncate |
| `api/src/Inventory/Parts/Domain/Service/History/CataloguePartUpdatedHistoryPayloadHydrator.php` | Modify | write core entries for number and description changes (S10-R26); set `changedAtWorkplaceId/Name` only on other locations (S10-R25); for a public API change set `changedThrough = 'public_api'` on every location's entry instead of changed-at (S10-R25a). One batch insert across locations (NFR-009) |
| `api/src/Inventory/Parts/Domain/Service/PartFetcher.php::getByCataloguePartId()` | Modify | add the org predicate (unscoped today) |
| `api/src/PartsCatalogue/CataloguePart/Application/Change/ChangeCommandHandler.php` | Modify | number/description via `CataloguePartRenamer` (S11-R3a); any request to change the entry a part points at is refused (S13-N8) |
| `api/src/Inventory/Parts/Domain/Part.php` | Modify | `change()` throws `PartError("A part can't be moved to a different Part Library entry.")` when handed a `CataloguePart` other than its own (S13-N8, D28). Lands **with** the import fix below, because today's import can hand `change()` another entry |
| `api/src/Organization/DataImport/Application/Handler/Inventory/ImportInventoryCommandHandler.php` | Modify | (1) a row matching an existing part at this location uses **that part's own entry**; `updateCatalogPart()` no longer calls `setPartNumber()` (S13-N9, D28), so `Part::change()` never receives a different entry; (2) `setManufacturerId()` only when the cell is non-blank (S9-E8a); (3) Min/Max and bin quantities apply to an untracked part exactly as to a tracked one, with #3528's history row (S5-E1); `is_tracked` / `is_active` never written |
| `api/src/OpenApi/Part/Application/Update/UpdateController.php` | Modify | `part_number` / `name` via `CataloguePartRenamer` with `changedThrough = public_api` (S13-R19d, S10-R25a); map S13-N1 → 409 `conflict`, S13-N7 → 422 `validation_error`; the existing `recordOnPartNumberChanged` / `recordOnDescriptionChanged` calls move into the renamer |
| `api/src/Inventory/Deliveries/Application/HTTP/ReceiveADelivery/ReceiveADelivery.php:88,108` | Modify | for an item linked to an order item whose `part_id` is set, take the number from that part's current entry, not the posted one (S13-R19c, D30); one batch read of the linked parts. A hand-typed line keeps its own number (S13-R19a) |
| `api/src/Inventory/Parts/Application/HTTP/History/DTOs/PartHistoryPayloadDto.php`, `PartHistoryDto.php` | Modify | append `?string $changedThrough` **after** `changedAtWorkplaceName` (append-only, positional) |

**Open-work definition for the rename carry-over (S13-R19/R19a).** Rows are linked **by id only**, never by number. Each subscriber is one set-based `UPDATE … JOIN`, org-scoped through its own table's workplace or organization path.

| Table | Column(s) | Link | "Open" |
|---|---|---|---|
| `inventory_order_item` | `part_number`; `parent_part_number` (core lines) | `part_id` / `parent_part_id` ∈ parts of the entry or its core | `quantity_received < quantity_ordered` and order `status IN ('ordered','partial_delivery')` |
| `work_order_part_request` | `part_number` | `inventory_part_id` ∈ P or `catalogue_part_id` ∈ C | `status NOT IN ('received','returned')` |
| `work_order_canned_line_part` | `part_number` | `inventory_part_id` ∈ P | always (a template) |
| `vendor_return_item` | `part_number` | `inventory_part_id` ∈ P | `vendor_return.status NOT IN ('accepted_by_vendor','declined_by_vendor')` — both terminal; `declined_by_vendor` is unreachable in code today (only set via the enum) but excluded so a future decline flow keeps its number (S13-R19 "not completed") |
| `manual_part_return_request_item` | `part_number` | `inventory_part_id` ∈ P | request `status <> 'completed'` |
| `work_order_part_return_request` | `part_number`, `parent_part_number` | `inventory_part_id` ∈ P or `catalogue_part_id` ∈ C | non-terminal status (confirm the set in `PartReturnRequest/Status.php`) |

These are left alone, because completed records keep their number: `work_order_part`, `inventory_delivery_item` (a delivery row is written only on accept, so every row is an accepted bill, S13-R19b), `credit_memo_line_item`, `invoice*`, `inventory_value_snapshot`, and fully received PO lines.

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/parts/inventory/InventoryPartDialog.vue` | Modify | **remove** the catalogue `Select` and everything feeding it (`fetchCataloguePartOptions`, `onCatalogueSelect`, auto-fill, the `onMounted` fetch); **add** Description + Part Number `Input`s (`input_part_description`, `input_part_number`; trimmed-required rules "Description is a required field" / "Part number is a required field"); Part Status `q-radio` pair (edit only; `radio_part_status_active/inactive`; disabled without Delete, S8-R6); "Inventory Tracking" section with info icon (`icon_inventory_tracking_info`, S4-R3 text, including "Untracked parts are left out of the Inventory Value report.") and `q-toggle` "Track quantities and cost of goods" (`toggle_track_quantities`, disabled without Delete, S8-R9); Min/Max shown only while tracked, values kept (S5-R4); turning tracking on seeds the default bin or marks the first one (S5-R7/R8); labels "Sell Price" / "Core Charge" |
| same | Modify | other-locations hints (`text_description_other_locations`, `text_part_number_other_locations`): count = rows with a `partId` **and** a `workplaceId` other than the current one (the endpoint also returns delivery-only locations and the current one); shown only while the trimmed value differs from the saved one |
| same | Modify | header `#header-end` → `StatusPill` showing the **saved** status (`pill_part_status`, S13-R3/R25); `#action-buttons` footer: Delete Part (left, `button_delete_part`, red + trash icon, edit + Delete only) · Cancel (`button_cancel_inventory_part`) · Save (`button_save_inventory_part`, submit); hairlines are consumer-side CSS only |
| same | Modify | 🔴 **Delete trap:** the new Delete button gets **no** `:disable` tied to `deletable`. It stays enabled and no-ops, so the S13-R27/R28 tooltip fires (Quasar's native `disabled` would kill it). Add a comment and a regression spec |
| same | Modify | save → confirm → status sequence (below); `persistForm` now **rethrows**; avoid double-toasting 400s already raised by the interceptor; drop the `responseUnknown as …` cast |
| `app/src/components/ts/parts/inventory/InventoryBinLocations.vue` | Modify | "Add Bin Location" gets `icon="add"` (S13-R5). Also shows in `PartReturnToInventoryDialog` (harmless) |
| `.../inventory/Inventory.vue` | Modify | `updateInventoryCache` merges `part_number`, `name`, `is_tracked` (today it **drops** `part_number`); `@status-changed` removes the row from the current tab; remove the dead `@part-deleted` listener |
| `app/src/api/parts/PartsModel.ts`, `index.ts`, `queries.ts`, `keys.ts` | Modify | create/update requests: `partNumber`, `description`, `isTracked`, no `catalogPartId`; `CreateInventoryPartResponse.libraryDescriptionKept`; `PartWorkplaceRow`; `usePartWorkplacesQuery(cataloguePartId)` |
| `app/src/store/ts/parts/actions.ts` | Modify | `createPart` stops refetching the removed not-on-location list |

#### Key code changes:
```ts
// InventoryPartDialog.vue — D10, S13-R21…R24, S13-N4/N5
const onSubmit = async () => {                       // BaseFormDialog :async-submit, after q-form validates
  if (statusChanged.value) { formSaved = false; confirmOpen.value = true; return; }   // S13-R21
  await persistForm(); closeDialog();                // S13-R24: no confirmation
};
const onConfirmStatus = async (note: string | null) => {   // StatusChangeConfirmDialog :async-confirm
  if (!formSaved) {
    try { await persistForm(); formSaved = true; } catch { return; }  // S13-N5: confirm closes, dialog shows the refusal
  }
  try {
    const { failed } = await partsApi.changePartsStatus(
      { partIds: [part.id], status: pickedActive.value ? 'active' : 'inactive', note: note ?? undefined },
      { handlesFailureLocally: true });
    if (failed.length) throw new StatusRefusedError(failed[0].reason);
  } catch (e) { reportDialogStatusFailure(e, pickedActive.value); throw e; }  // S13-N4: confirm stays open; retry skips the re-save
  showSuccessNotification({ message: pickedActive.value ? 'Part activated.' : 'Part deactivated.' });
  emit('statusChanged', { id: part.id, active: pickedActive.value }); closeDialog();
};
// reportDialogStatusFailure (toast table): StatusRefusedError → "This part could not be deactivated" / "…activated", reason as caption, timeout 0;
// any other error → "Failed to set this part inactive" / "…active", caption "Please try again or contact support for help", timeout 7000.
// Cancel on the confirm: nothing saved, pickedActive kept (S13-R23)
```

```php
// CataloguePartLinker — S7-R4…R8
$atLocation = $this->partsAtLocation->findNonCoreByStrippedNumber(PartNumber::sanitize(new PartNumber($typed)));
if ([] !== $atLocation) { throw PartError::alreadyAtLocation($atLocation); }   // S7-N3/N4/N5/N5a
$exact = array_values(array_filter(
    $this->catalogueParts->findNonCoreByPartNumberCaseInsensitive($typed),
    static fn (CataloguePart $cp): bool => $cp->getPartNumber()->getValue() === $typed));
return 1 === count($exact) ? LinkResult::linked($exact[0], $desc) : LinkResult::created(/* own entry */);
```

#### Unit / Integration tests:
- BE unit: `CataloguePartLinkerTest` (0/1/many exact; case-sensitive; manufacturer fill, including a dangling manufacturer id (S7-R6d); tag union; description and **category** kept (S7-R6c)), `CataloguePartTest` (rename/describe update the core entry), `PartNumberTest` (outer spaces trimmed, case kept), `CataloguePartRenamerTest` (S13-N3a outer-space-only edit is no change; S13-N7 refuses only with an open part request and >50; `changedThrough`), `PartLibraryNumberCollisionCheckerTest` ("brake01" vs "BRAKE-01" allowed; "BRAKE-01" refused; own core excluded), `CataloguePartUpdatedHistoryPayloadHydratorTest` (core entries; changed-at only on other locations).
- BE functional:
  - `CreatePartByTypingTest` (S7-R3…R10, N1…N6, `libraryDescriptionKept`)
  - `RenamePartTest` (S13-N1 exact, N3, N3a, core rename, history at 2 locations)
  - `ExistingDuplicateSaveTest` (S7-N5b): two parts at one location whose numbers normalize equal both still save with their numbers unchanged; changing one's number to the other's normalized form is refused
  - `PartLibraryChangeRenameTest` (S11-R3a): the Part Library page edit refuses a collision, carries to open work, writes history at every location
  - `OpenApiPartRenameTest` (S13-R19d, S10-R25a): 409 on collision, 422 on S13-N7, carry-over, history "Changed through: Public API" at every location; `POST /api/v1/parts` normalized 409 unchanged
  - `ImportTest` cases: an existing part's entry number is never rewritten and the part never moves, even when the row's number differs only by case or punctuation (S13-N9); a blank Manufacturer keeps the entry's (S9-E8a); Min/Max/bins on an untracked part save with a Min/Max history row (S5-E1)
  - `ImportTest` (S13-E1, second sentence): after a rename, re-importing a row under the old number creates a **separate** part under the old number; the renamed part is untouched
  - `RepointRefusedTest` (S13-N8): `Part::change` with another entry and the Part Library change route both refuse with "A part can't be moved to a different Part Library entry."
  - `ReceiveAfterRenameTest` (S13-R19c): open a PO line, rename the part, accept a delivery posting the old number → the delivery row and stock use the new number and no entry exists for the old one; a hand-typed line keeps its own number
  - `RenamePropagatesToOpenWorkTest`: one open row per table, plus a completed twin that must not change, plus a number-only twin with no id link that must not change (S13-R19a), plus another org's row that must not change
  - S13-N7 refusal with the exact copy; no open part request → a 60-character rename saves
  - rewrite or remove `ChangePartDuplicateVariantRowTest`
  - update every fixture/test posting `catalogPartId`: `PartMoneyInputFixtures`, `InitialStockEmissionTest`, `PartMoneyInputValidationTest`, `ChangePartOmittedBinsStockLossTest`, `CoreChargeClaimedCorePartTest`, `CatalogInventoryRoleAuthorizationTest`, `CostChangeRevaluationTest`, `ChangePartDrainedBatchCostTest`
- FE `InventoryPartDialog.spec.ts` (heavy update): typed fields required + trimmed; no `catalogPartId`; linked-description toast; other-locations count excludes delivery-only rows and the current location, and hides when reverted; confirm cancel keeps the pick; confirm → save then status; save failure closes the confirm and skips status; status refusal keeps it open and the retry skips the re-save; pill shows the saved status; tracking toggle hides and keeps Min/Max; bin seeding; non-Delete user sees radios and toggle disabled and no Delete; Delete AND trap.

#### Verification (Definition of Done gates):
- **Static** (both) · **Migration gate** · **Smoke** · **Compile**
- **Browser-walk** `/parts/inventory`:
  - as **admin**: boards 1.1–1.6 (create; "same number in lower case" refusal; untracked create), 2.1–2.6 (rename at one location, then check the other location's list and Part History with "Changed at"), 3.1–3.8 (dialog deactivate with a note, pill shows the saved status, reactivate), 5.1–5.6.
  - as a **Create & Edit without Delete** role: radios and toggle disabled, no Delete Part, and a rename still allowed (S8-R11).
- Cross-area: `e2e/src/api/factories/parts.factory.ts` create switches to `partNumber`/`description` **in the same PR**.

#### E2E tests (e2e/):
- 🔴 **Reference breakage lands in this PR** (§7 table, Phase 6 rows): `parts.factory.ts` create contract (~73 seed callers), `new-inventory-part.dialog.ts`, `edit-inventory-part.dialog.ts`, `inventory-part-bins.helper.ts`, `error-codes.ts`, C104/C107/C108/C332–C334/C2201/C2444, C20451/C20452, C30637/C45212.
- Happy path: dialog status change: pill shows the saved status, confirm with a note, "Part deactivated.", the part moves to the Inactive tab.
- Edge: typed exact number links to an existing library entry and keeps its description (toast S7-R9).
- Happy path: rename carries to an id-linked open PO line; the row updates without a reload.
- Happy + edge: untracked create via the dialog toggle; flipping an existing part off and on keeps Min/Max.
- Edge (UPDATE C27409/C27460): the role without Delete sees no bulk entry, disabled radios and toggle, and no Delete Part, but can still save a description; the role with Delete sees all of them.
- Duplicate-at-location refusals stay at the Dev layer (BE functional `CreatePartByTypingTest`).

---

### Phase 7: Inactive parts blocked from new work (Story 9)
**Implements:** S9-R1…R20, S9-N1…N3, S9-E1…E11, NFR-007, NFR-010
**Depends on:** Phases 1, 2, 6 (the index); rebase after #3384

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `api/src/Inventory/Parts/Domain/Repository/InactivePartNumberFetcherInterface.php`, `Infrastructure/Persistence/Query/Dbal/DbalInactivePartNumberFetcher.php` | Create | "inactive-only" numbers at the current workplace (an inactive part with **no** active part sharing the normalized number), as one query: all of them, or a batch lookup by a list of stripped numbers |
| `api/src/Inventory/Parts/Domain/Service/InactivePartGuard.php`, `Domain/Error/InactivePartError.php` | Create | `assertUsableForNewWork(Part)`, `assertTypedNumberUsableForNewWork(?string)` → "{part number} is inactive. Activate it from the Inactive tab to use it." |
| `api/src/VehicleService/WorkOrders/Application/Part/Request/ListInventoryPartsAsOptionsWithRemainingCatalogueParts/ListingQueryHandler.php` (+ `ListingQueryResult`) | Modify | `(p.id IS NOT NULL AND p.is_core = 0 AND p.is_active = 1) OR (p.id IS NULL AND cp.is_core = 0)`; exclude `cp.part_number_stripped IN (:inactiveOnly)` for non-stocked rows (S9-R15); `inactiveMatch` when the normalized search term is inactive-only (S9-R16). Covers WO, estimate, tech charge-out (every device), PO, vendor-bill re-point, part sale |
| `api/src/VehicleService/WorkOrders/Application/Part/Request/ValidationAwarePartRequestCommand.php` | Modify | `validateWhenInventorySource()` → `assertUsableForNewWork`; `validateWhenVendorSource()` → `assertTypedNumberUsableForNewWork` |
| `api/src/VehicleService/WorkOrders/Application/Service/Part/Request/UpdatePartRequestValidator.php` | Modify | guard only on `isInventoryRelink` / `isVendorPartChange`; re-saving the same part or number is allowed (S9-E2/E2a) |
| `api/src/Inventory/Application/Handler/Order/CreateOrderCommandHandler.php`, `api/src/Inventory/Orders/Application/HTTP/AddOrderItem/AddCommandHandler.php`, `api/src/Inventory/Application/Handler/Order/ChangeOrderItemCommandHandler.php`, `UpdatePartNumberCommandHandler.php`, `api/src/VehicleService/WorkOrders/Application/Part/Create/CreateCommandHandler.php` (deprecated) | Modify | guard items with no `part_request_id` (S9-E6: ordering a request isn't new work); on change, only when the part or number changes. Confirm `OrderRepository` scoping in `AddCommandHandler` before adding the guard, and fix it if unscoped |
| `api/src/VehicleService/WorkOrders/Application/Line/CreateFromCannedLine/CannedLineApplicationWarnings.php` | Create | request-scoped collector (`ResetInterface`): `skipPart(partNumber)`, `skipFee(feeName, partNumber)`, `toWarning(): ?CannedLineWarning` building the **one** S9-R10/R10a message (part numbers joined ", " in canned-job order, then one fee sentence per skipped fee) |
| `api/src/VehicleService/WorkOrders/Application/Part/Create/AddPartsToLineAfterCreatedFromCannedLine.php` | Modify | `getInventoryPartsFromIds()` selects `p.is_active` and **adds org scoping** (NFR-007); **one** `findInactiveOnlyByStrippedNumbers()` call for vendor numbers before the loop (NFR-009); skip + record a warning before any `PartRequest` is created |
| `api/src/VehicleService/WorkOrders/Application/Adjustment/AddAdjustmentsToLineAfterCreatedFromCannedLine.php` | Modify | `resolveTargetId`: when the target part was skipped → `feeSkipped()` (the fee drop already happens today) |
| `.../CreateFromCannedLine/CreateController.php` | Modify | `reset()` the collector; response `{ line_id, warning }` (§5) |
| `api/src/VehicleService/WorkOrders/Application/Service/PartSaleCredit/PartSaleCreditProcessor.php` (+ `AvailablePartDto`) | Modify | `LEFT JOIN part ip ON ip.id = wop.inventory_part_id AND ip.workplace_id = wo.workplace_id`; `isInventoryPartInactive` (S9-R13) |
| `api/src/Search/Infrastructure/DocumentProvider/PartDocumentProvider.php` | Modify | `fetchRows()` selects `p.is_active`, `p.is_tracked`; `buildDocuments()` writes `is_active`, `is_tracked` (S9-R18, R20). Inactive parts stay in the index (S9-R18). Doctrine `Part` changes already reindex (`interestedIn()`); the bulk path uses Phase 2's `PartSearchReindexRequesterInterface` (one batched `add` per request, NFR-009) |
| `api/src/Search/Infrastructure/OpenSearch/mappings/parts.json` | Modify | `is_active`, `is_tracked`: `boolean` (NFR-010) |
| `api/src/Search/Application/Assembler/SearchItemAssembler.php` (`EntityType::Part`) | Modify | `isActive`, `isTracked` (absent → `true`, so documents written before the rebuild read active/tracked) |

**Not refused** (verified paths): pick inventory parts (S9-E6), receive, delivery change-item, WO split (S9-E7), invoice conversion (S9-E3), CSV import (S9-E8; the importer never writes the column), and editing or recalculating an existing line on a work order, estimate or part sale, **including a completed part sale** (S9-E1). S9-N3 is today's behavior: `PartListController` is `#[IsGranted(ROLE_CATALOG_INVENTORY_VIEW)]`, so the return/credit picker without View gets the standard 403 toast; regression test only.

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `app/src/api/work-orders/queries.ts` (`partsOptionsQueryOptions`), `WorkOrdersModel.ts`; consumer `WorkOrderPartRequests.vue:2392` and specs | Modify | result becomes `{ rows, inactiveMatch }` (keep the SHOPVIEW-APP-4HH degrade) |
| `app/src/components/ts/work-orders/PartSelect.vue` | Modify | `#no-option`: inactive match → `text_part_select_inactive_match` message in place of `PartSelectCreateAction` (board 6.3); the same message also renders in `#before-options` when `inactiveMatch` is set but the list is non-empty (fuzzy active matches, e.g. "AB-123" vs "AB-1234", so `#no-option` never fires) and in `#after-options` in place of the PO offer row; `#after-options` / `createActionInputValue`: suppress the create row on PO screens **only when the typed number is the inactive match** (other numbers keep today's offer); an always-on validation rule fails a typed non-inventory option whose normalized number is the inactive match (blur path, S9-R16 second half); 🔴 the special order that `usePartSelection.ts` commits on blur (`commit`, line ~198) must **not** commit when the typed number is the inactive match, and the always-on offer row (`PartSelectCreateAction.vue`) on PO screens is suppressed for it (PRD v22 engineering note); S9-R17 on the server is the backstop; `defineExpose({ inactiveMatchMessage })`; `StatusPill` "Inactive" beside the description when `opt.is_active === false` (return/credit lookups only, S9-R12, board 6.6); `getPartDetails` source "Catalog" → "Part Library" for both branches (`PartSelect.vue:444, 448`), so the special-order lookup reads "Part Library · {vendor}" (S12-R10, S12-R14) |
| `app/src/components/ts/work-orders/PartSelectModel.ts` | Modify | `is_active?` on options |
| `app/src/components/ts/work-orders/work-order-lines/InlinePartRow.vue` | Modify | `rowMessage` shows `inactiveMatchMessage`; the focus-first-invalid pass already validates (Tech View charge-out, S9-R3/R16) |
| `app/src/components/ts/work-orders/cannedLineWarnings.ts` | Create | `showCannedLineWarning(warning)`: one `type: 'warning'`, `timeout: 0` notification with the server's `message`, close button; nothing when `warning` is null (S9-R10/R10a) |
| `app/src/components/ts/work-orders/LineDialog.vue` (+ `app/src/api/work-orders/index.ts`, `queries.ts` types) | Modify | call it after a canned apply |
| `app/src/components/ts/credits/PartsReturnPicker.vue`, `credits/Model.ts`, part-sale Model | Modify | `#body-cell-partNumber` adds `StatusPill` "Inactive" (`pill_parts_return_inactive_<id>`, board 6.7) |
| `app/src/components/ts/navigation/search/searchRowVariants.ts` (`case 'parts'`), `SearchResultRow.vue`, `Model.ts` | Modify | inactive → `badges: [{ label: 'Inactive', tone: 'neutral' }]` (grey, as `StatusPill`) and `target.query.tab = 'inactive'` (S9-R18, R19); untracked → `stock` replaced by a "Not Tracked" text (S9-R20) |
| `app/src/components/ts/parts/inventory/Inventory.vue` | Modify | on mount, `route.query.tab === 'inactive'` selects the Inactive tab before the first fetch (with the existing `?search=` prefill) |

#### Unit / Integration tests:
- BE unit: `InactivePartGuardTest` (active + inactive with the same normalized number → allowed), `MakePartRequestCommandTest`, `UpdatePartRequestValidatorTest`, `AddPartsToLineAfterCreatedFromCannedLineTest`, `CannedLineApplicationWarningsTest` (one message for 2 parts + 1 fee; null when nothing skipped), `PartDocumentProviderTest` (`is_active`/`is_tracked` in the document), `SearchItemAssemblerTest` (absent fields → true).
- BE integration: `DbalInactivePartNumberFetcherTest`.
- BE functional: `InactivePartRefusedTest` (make, change, typed vendor number, same-number re-save allowed), `InactivePartRefusedOnPurchaseOrderTest` (create, add-item, change-item, part-number; ordering a request is allowed), `PartOptionsInactiveFilterTest` (S9-R1/R15 + `inactiveMatch`), `CreateFromCannedLineInactiveTest` (one `warning`), `ListCreditAvailablePartsTest`, a `PickInventoryParts` regression for an inactive part (S9-E6), a completed-part-sale recalculation regression (S9-E1), a return-picker 403 without View (S9-N3), and a search integration test: deactivate → the document reads `is_active = false` after commit.
- FE: `PartSelect.spec.ts` / `PartSelectLogic.spec.ts` (blur does not commit a special order for the inactive match; no offer row on PO screens), `usePartSelection.spec.ts`, `InlinePartRow.spec.ts`, `cannedLineWarnings.spec.ts` + a `LineDialog` MSW case, `searchRowVariants.spec.ts` (Inactive badge, `tab=inactive`, Not Tracked), `Inventory.spec.ts` (`?tab=inactive`), `PartsReturnPicker.spec.ts`, options `queries.spec.ts`.

#### Verification (Definition of Done gates):
- **Static** (both) · **Smoke** · **Compile**
- **Browser-walk** with an inactive part GREASETUBE (boards 6.1–6.7):
  - not offered on a WO line (Full View) or in Tech View, or at **phone width** in DevTools
  - typing "greasetube" shows the inactive message, and Tech View blocks the save
  - not offered on a PO line or in the vendor-bill re-point
  - a canned job containing it and a second inactive part shows **one** warning naming both
  - global search (Search v2 org): the part shows the grey "Inactive" tag; selecting it opens the Inactive tab searched to its number; an untracked part shows "Not Tracked"
  - **Search rebuild gate:** `RebuildIndexesCommand` + `SwapAliasCommand` locally before the browser-walk
  - a vendor return and a part-sale credit still offer it, with the grey tag

#### E2E tests (e2e/):
- Happy + edge: an inactive part isn't offered in the WO line lookup; typing its number in a different case shows "{n} is inactive. Activate it from the Inactive tab to use it." with no special-order offer, and tabbing out blocks the row.
- Happy path: a vendor return still offers the inactive part with the "Inactive" tag (new `CreateReturnPage`).
- Edge (UPDATE `new-line-from-canned-line.spec.ts`): a canned job holding an inactive part adds the job without it and shows the one warning "These parts are inactive and were not added: {A}."

---

### Phase 8: Part History (rest of Story 10)
**Implements:** S10-R16…R29 (incl. R22a display parity, R25a), S10-N3 (display)
**Depends on:** Phases 2, 6

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `api/src/Inventory/Parts/Application/HTTP/History/ViewQueryHandler.php` | Modify | non-empty search: load **all** rows for the part (no cap: S10-R27 says any entry; hydrate + compose in chunks of 1,000 to keep memory flat and well inside the FPM 30s CPU cap — measure on the largest prod part history during implementation), hydrate, compose texts, keep entries whose text or `userName` contains the term (`mb_stripos`, S10-R27), narrow `binChanges` to matching bins unless the staff name matched (S10-R28), paginate in PHP. Empty search keeps today's path |
| `api/src/Inventory/Parts/Application/Service/History/PartHistoryEventTextComposer.php` | Create | ports the FE label generators, including the new status, tracking, note, changed-at and "Changed through: Public API" texts and #3528's "Min/Max updated | Min: … | Max: … | Source: …" (S10-R22a); price segments only when `PricingVisibilityProviderInterface::canSeePricing()` (S10-R29) |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/parts/part-history/PartHistoryModel.ts`, `PartHistory.vue`, `app/src/api/parts/PartsModel.ts` (`PartHistoryRow`) | Modify | event types `part.status.deactivated/activated`, `part.tracking.turned_off/on`; labels "Deactivated" / "Activated" + " \| Reason: {note}" (S10-R17), "Tracking turned off/on" (S10-R22), " \| Changed at: {changedAtWorkplaceName}" on number and description entries (S10-R25), or " \| Changed through: Public API" when `changedThrough === 'public_api'` (S10-R25a, never both); literal strings |
| `PartHistory.vue` | Modify | S10-R21: fixed `headerStyle` widths on Staff/Date/Time, Event elastic, `table-layout: fixed` + ellipsis (the Inventory list approach) |

#### Unit / Integration tests:
- BE unit `PartHistoryEventTextComposerTest`, one case per event type, against a **JSON parity fixture** the FE spec also consumes.
- BE functional `PartHistoryViewTest`: search by event text and by staff; bin-row narrowing; price hidden without See Financial Data; case-insensitive.
- FE `PartHistory.spec.ts`: new labels with and without a note; Changed at; header widths; the same parity fixture.

#### Verification (Definition of Done gates):
- **Static** (both) · **Smoke** · **Compile**
- **Browser-walk** `/parts/history/:id` as admin: boards 3.8, 5.5, 2.4, 2.6. Search "deactivated"; a short entry doesn't widen the columns.

#### E2E tests (e2e/):
- Happy path: after a dialog deactivation with a note, Part History shows "Deactivated | Reason: …"; after a tracking flip, it shows "Tracking turned off".
- Edge: Part History search on the note text, in lower case, lists only that entry; clearing the search restores all entries.

---

### Phase 9: Part Library (Stories 11, 12)
**Implements:** S11-R1…R7 (incl. R3b), S11-N1, S11-E1…E3, S12-R1…R13 (R14 in Phase 7), S12-N1…N3, NFR-006
**Depends on:** Phase 6 (the typed create replaces the old flow and the E2E factory path)

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `api/src/PartsCatalogue/CataloguePart/Application/Create/{CreateController,CreateCommand,CreateCommandHandler}.php` | Delete | `POST /api/parts-catalogue/add-catalogue-part` |
| `api/src/PartsCatalogue/CataloguePart/Application/ListCataloguePartsThatAreNotOnLocation/*` | Delete | unpaginated, no `#[IsGranted]` |
| `api/src/PartsCatalogue/CataloguePart/Application/Handler/DeleteCataloguePartCommandHandler.php` | Modify | "This Part Library entry is in use and cannot be deleted." (S12-R11) |
| `api/src/PartsCatalogue/CataloguePart/Domain/CataloguePartNotFoundError.php` | Modify | "Part Library entry not found for ID: %s." / "…for part number: %s." / "Part Library entry not found." |
| `ValidationAwarePartRequestCommand.php`, `api/src/Inventory/Parts/Application/HTTP/History/ViewQueryHandler.php` | Modify | "Part Library entry missing category."; "Part Library entry not found."; grep every remaining "atalogue part not found" for the no-period variant "Part Library entry not found" (S12-R11 lists both) |
| `api/src/VehicleService/WorkOrders/Application/Part/Request/Common/PartRequestCommandAbstract.php:103` | Modify | "Since catalogue part is provided, source has to be vendor." → "A part from the Part Library must have Vendor as its source." (S12-R11; the message exists, so Q9's "drop it" was corrected by Product) |

Public API messages are **unchanged** (S11-E3). No permission is re-keyed (S12-N1).

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/parts/PartsLeftMenuNav.vue:82` | Modify | "Part Library" (keep `parts_nav_catalog`, S12-N2) |
| `app/src/pages/Parts.vue:164`; `app/src/router/routes.ts` (meta titles "Parts Catalogue", "Catalogue Part") | Modify | "Part Library" on the list, "Library Part" on the detail page (S12-R12). The route paths stay the same (S12-N2) |
| `app/src/components/ts/parts/dialogs/CataloguePartDialog.vue` | Modify | remove the create mode; title "Edit Library Part"; "Failed to save library part." / "Library part deleted successfully."; stop uppercasing the part number (`input-class="text-uppercase"` at :125 and `toUpperCase()` at :263, :368, :384 where they apply to `part_number`; size keeps its behavior) so it saves exactly as typed (S11-R3b); the S13-N1 / S13-N7 / S13-N8 refusals surface through the interceptor toast and the dialog stays open (S11-R3a) |
| `app/src/components/ts/parts/catalogue/PartsCatalogue.vue` | Modify | remove the "New catalog part" button (`button_new_catalog_part`) + dialog mount (S11-R1/R2/R7) |
| `app/src/components/ts/administration/permissions/PermissionGrid.vue:92,240,243`, `labels.ts:31-33` | Modify | S12-R6…R9 strings |
| `app/src/components/ts/shared/dialogs/DeleteDialog.vue:93` | Modify | "Are you sure you want to delete this library part?" (S12-R13) |
| `app/src/store/ts/parts/actions.ts`, `app/src/api/parts/index.ts`, `PartsModel.ts` | Modify | remove `createCataloguePart`, `fetchCataloguePartsThatAreNotOnLocation`, `MissingPartsResponse` |

#### Unit / Integration tests:
- BE: update assertions on the renamed strings (including the Vendor-source message); `RemovedEndpointsTest` (routes no longer resolve).
- FE: `PartsCatalogue.spec.ts` (no create button for any role), `CataloguePartDialog.spec.ts` (mixed-case number saved as typed), `DeleteDialog.spec.ts`, permission labels.

#### Verification (Definition of Done gates):
- **Static** (both) · **Smoke**: `debug:router | grep parts-catalogue` shows neither removed route; refresh the smoke list if needed · **Compile**
- **Browser-walk** `/parts/parts-catalogue` (boards 7.1, 7.2: no create control; a row opens the detail page) and Administration → Roles & Permissions → Edit Role (labels).
- Cross-area: `e2e/src/api/factories/parts.factory.ts` `createCatalogPart` moves to the typed create **before** the endpoint is deleted.

#### E2E tests (e2e/):
- No new workflow. 🔴 Reference breakage in this PR (§7 table, Phase 9 rows): `fresh-org-bootstrap.ts` **first**, then `createCatalogPart`/`findOrCreateCatalogPart` callers, library-only seeds via `createLibraryOnlyEntry`, `catalog.page.ts` / `edit-catalog-part.dialog.ts` text, permission specs C26414/C27409/C27460/C27469/C27488/C27491.
- Deletes C89, C91 and C20455: confirmed by the user 2026-10-08.
- Coverage block: override marker (§7).

---

## 7. Testing Strategy

### Unit tests (`api/` and `app/`)
- **Backend:**
  - domain rules on `Part` (core follows, core refuses on its own)
  - `PartStatusChangePlan`
  - `PartLifecycleNote`
  - `CataloguePartLinker` (exact vs. normalized)
  - `PartLibraryNumberCollisionChecker`
  - `InactivePartGuard` (inactive-only semantics)
  - `PartTrackingSearchDecorator`
  - `CannedLineApplicationWarnings` (one combined warning)
  - `CataloguePartRenamer` (exact collision, outer-space no-op, 50-char rule, `changedThrough`)
  - `Part::change()` re-point refusal
  - `PartDocumentProvider` / `SearchItemAssembler` fields
  - `PartHistoryEventTextComposer`, with a parity fixture shared with the FE
- **Frontend:**
  - `buildStatusChangeCopy` (whole matrix)
  - `useInventoryBulkStatus` (selection survives sort; 200 cap; partial failure)
  - `InventoryPartDialog` (save → confirm → status sequence; Delete trap)
  - `PartSelect` / `usePartSelection` (inactive message, blur rule, no special-order commit, no PO offer row)
  - `searchRowVariants` (Inactive badge, Inactive-tab target, Not Tracked)
  - `CataloguePartDialog` (number saved as typed)
  - `useCycleCount` (untracked)
  - `PartHistory` labels
  - BulkBar extraction regression set
- **Edge cases to watch:**
  - same normalized number shared by an active and an inactive part (allowed)
  - case-only rename of a part's own entry (allowed)
  - a part deleted mid-bulk ("Part not found.")
  - a note of exactly 255 multibyte characters
  - an untracked part with no bins (refused by the part save today; the bin checks become conditional)
  - two existing parts at one location with normalized-equal numbers keep saving (S7-N5b)
  - a rename that differs only by outer spaces (S13-N3a)
  - a delivery accepted after its part was renamed (S13-R19c)
  - a tracking flip on a part with on-hand stock (bins untouched)

### Integration tests
- `DbalEntityEventBatchWriter` (chunking, column round-trip)
- `DbalInactivePartNumberFetcher`
- Rename propagation per table, against real MySQL via functional tests: open rows change; completed, number-only and other-org twins don't
- Inventory Value live vs. snapshot replay (`is_tracked` per row; pre-release rows all 1)
- Global search document after a status change (bulk DBAL path and Doctrine path)
- CSV import against existing parts (no re-point, no renumber, blank manufacturer kept)
- FE ↔ BE contracts via the updated MSW handlers (`inventory/parts`, the status endpoint, options `inactiveMatch`, canned `warning`, search `isActive`/`isTracked`)

### Manual testing checklist
1. Bulk bar on work-order lines: unchanged in light and dark theme (Phase 1).
2. Inventory page at 1920×1080 and 1366×768 has one scrollbar, with and without the bulk bar.
3. Select-all past 200 rows via scrolling → disabled Deactivate with "Select 200 parts or fewer." (board 4.9).
4. Rename at location A → location B's list, Part History ("Changed at: A"), an open PO line, an open part request and a canned job all show the new number. A received PO line keeps the old one.
5. Inventory Value for today excludes an untracked part; for a date before the change, it includes it. Dashboard Critical Reorder and the Supply filter's Under-supplied leave it out.
6. Tech View charge-out at phone width: a typed inactive number blocks the save with the message under the field.
7. A role with Create & Edit but not Delete: no bulk entry, disabled radios and toggle, no Delete Part. A crafted `PATCH …/status` gets exactly the answer a crafted inventory part delete gets for that role (S8-R15); a View-only role → 403 on both.
8. The accounting dashboard and opening inventory are unchanged by a tracking flip.
9. Global search: an inactive part shows the grey tag and opens the Inactive tab; an untracked part shows "Not Tracked".
10. Public API rename of a part stocked at two locations: history at both ends with "| Changed through: Public API"; an open PO line takes the new number.

### E2E tests

Planned per `e2e/.claude/reference/coverage-policy.md`. Each implementation phase runs its own `/e2e-after-change` pass (`batchCap = 5` workflows per run). **Reference breakage is mandatory and uncapped. It ships in the same PR as the change that causes it.**

**Placement and wiring**
- New specs go in **mapped** TestRail folders: `ui/parts-inventory/`, `ui/parts-returns/`, `ui/work-orders/`. `ui/parts/` is not in `testrail-push.ts` SECTION_MAP.
- Register every new file in `e2e/playwright.config.ts`: the `parts` and `workorders` projects use explicit `testMatch` lists.
- Rows are located **by id only** (`table_cell_*_<id>`, `checkbox_select_inventory_part_<id>`), never with the index-based `td[n]` helpers, which shift when the checkbox column shows.
- Every spec that creates parts deletes them in `afterEach`. A leftover untracked part makes the first-row specs read "Not Tracked" and fail.

**Roles**
- Admin: `.auth/admin.json`.
- "Create & Edit without Delete": a custom role via `mergeSpecs(withArea(zeroPermissions(...), 'cataloginventory', 'createEdit'), { viewMode: 'full', crossToggles: { seeFinancialData: true } })` + `provisionConfirmedCustomRoleUser`, following `tests/permissions/custom/catalog-inventory-mutating-enforcement.spec.ts`. This role holds `ROLE_CATALOG_INVENTORY::DELETE` through Create & Edit, so E2E asserts only what the screen hides (S8-R14); the server matrix is BE functional (S8-R15).
- Refresh `setup-admin` after Phase 1 ships, because a stale `.auth/admin.json` permission wrapper hides the new bulk entry.

#### Reference breakage, by the phase that causes it

| Phase | File | What breaks | Fix |
|---|---|---|---|
| 1 | `e2e/src/pages/work-orders/bulk-action-bar.page.ts:88-91` | Nothing; test-ids and classes are kept | Run `bulk-line-actions.spec.ts`, `bulk-status-undo.spec.ts`, `bulk-create-invoice.spec.ts`, `completion-optional-invoice.spec.ts` as a regression guard |
| 2 | `e2e/src/pages/parts/inventory.page.ts:36` | The page-load anchor `table_inventory` must survive removal of `#top` | Verify; re-anchor on `tab_active_inventory` if it moves |
| 2 | `inventory.page.ts:59-60`, `cycle-count.page.ts:121`, `multi-bin/export.spec.ts:28,60` | Text locators "Cycle count" / "Export" still match | Harden to `menu_item_inventory_cycle_count` / `_export` (optional) |
| 6 | `e2e/src/api/factories/parts.factory.ts:117-155` (`createInventoryPart`), `:1263-1305` (`createFullInventoryPart`) | Posts `catalogPartId` → every inventory seed fails (~73 callers, `test-data.fixture.ts:2806,2829`, `part-sale.factory.ts:740-746`, report seeders) | Send `partNumber`, `description`, `isTracked?`; read `cataloguePartId` from the 201. An exact typed number still links (S7-R4/R5), so seeds behave the same |
| 6 | `e2e/src/pages/dialogs/new-inventory-part.dialog.ts:36-37, 42-43, 48, 59-87, 154-185` | `select_catalogue_part` removed; `aria-label` 'Sell price'/'Core charge'/'Save' | Delete the catalog setters; add `input_part_description`, `input_part_number`, `toggle_track_quantities`; use `input_sell_price`, `input_core_charge`, `button_save_inventory_part`; `fillInForm*` types unique values |
| 6 | `e2e/src/pages/dialogs/edit-inventory-part.dialog.ts:29, 35-36, 41-45, 116-145, 183` | catalog field, aria-labels, the old Delete (`aria-label='Delete'`, a confirm step, `aria-disabled`), stale tooltip text | `button_delete_part` (never disabled, no confirm); tooltip `.q-tooltip` hasText "Please delete related work order parts first." |
| 6 | `e2e/src/pages/dialogs/inventory-part-bins.helper.ts:18` | `:has-text('Inventory')` also matches the new "Inventory Tracking" heading (strict-mode) → C22211–C22223 | `:text-is('Inventory')` or a `text_inventory_section_title` test-id |
| 6 | `e2e/src/enums/error-codes.ts:23` | `CATALOG_PART_MISSING_ERROR` stale | Remove; add `DESCRIPTION_REQUIRED`, `PART_NUMBER_REQUIRED` |
| 6 | `tests/ui/parts-inventory.spec.ts` C104, C334 (form), C107, C2444, C2201, C332, C333 (locators), C108 (delete assertion) | dialog rewrite | Page-object fixes; C108 asserts `button_delete_part` visible and enabled (don't click the shared first row) |
| 6 | `tests/ui/parts/inventory-crud.spec.ts` C20451, C20452 | catalog seed + `selectCatalogPartByDescription` | Type number + description; this becomes the S7 typed-create happy path |
| 6 | `tests/ui/parts/inventory-part-delete.spec.ts` C30637 (`:93`), C45212 (`:175, 204-212`) | `button_cancel_dialog` was Delete; a blocked click no longer closes the dialog | `button_delete_part`; assert the dialog **stays open** and the row survives |
| 9 | `parts.factory.ts:50-74` (`createCatalogPart`), `:106-113` (`findOrCreateCatalogPart`) | `add-catalogue-part` removed | Remove; migrate callers to one typed create; add `createLibraryOnlyEntry` for entries not stocked here |
| 9 | 🔴 `e2e/src/api/fixtures/fresh-org-bootstrap.ts:573-579` | Global setup fails on every fresh-org run (stage/QA CI) | Typed create / `createLibraryOnlyEntry`. **Highest priority of Phase 9; must land before the endpoint is deleted** |
| 9 | `test-data.fixture.ts:2806,2829`; `part-sale.factory.ts:740`; `sales-by-representative-seed.helper.ts:353`; `parts-velocity-seed.helper.ts:382`; `inventory-value-seed.helper.ts:191`; `sales-by-customer-seed.helper.ts:377`; specs `inline-part-bin-selection`, `inline-part-more-options-escalation`, `inventory-fixed-price`, `pricing-fixed-rules`, `inventory-part-delete`, `inventory-column-selection`, `multi-bin/inventory-bin-filter-location-switch`, `multi-bin/inventory-page-and-bins`, `multi-bin/receive-parts-from-po`, `multi-bin/request-part-on-wo-or-ps`, `multi-bin/cycle-count-select-all-scope` | catalog-then-inventory seeds | single typed create |
| 9 | library-only seeds: `po-part-link-seed.helper.ts:29` (C146193–5), `inline-part-sell-price-repricing.spec.ts:359` (C45252, C45253, C55687), `receive-parts-from-po.spec.ts:103` (C22226), `catalogue-part-route-guard.spec.ts:78` (C29915), `global-search-catalog-permission.spec.ts:94,156` (C29912, C29913), `catalog-inventory-mutating-enforcement.spec.ts:215` (C26415), `combo-parts-inventory-vendor-enforcement.spec.ts:319` (C27460), `catalog-functional.spec.ts:86` (C20456) | no API creates an entry with no inventory part here | `createLibraryOnlyEntry`. C45252 re-verifies the 0/0 price option |
| 9 | `e2e/src/pages/parts/catalog.page.ts:15, 26, 28, 59-66`; `e2e/src/pages/dialogs/edit-catalog-part.dialog.ts:34` | title "Catalog" → "Part Library"; create button gone; "Edit Catalog Part" → "Edit Library Part" (C87–C96, C20456, C27460) | match the new text (better: add test-ids); delete the create helpers |
| 9 | `catalog-inventory-mutating-enforcement.spec.ts:79-196` C26414; `combo-parts-inventory-vendor-enforcement.spec.ts` C27409, C27460, C27469, C27491; `role-persona-enforcement.spec.ts:769-777` C27488 | assert `button_new_catalog_part` | seed the entry and keep the edit half (C26414); retarget the create affordance to `button_new_inventory_part`; retitle |

**`createLibraryOnlyEntry` approach (implementer to confirm in Phase 9).** Typed create at a secondary workplace (`setLocationIdOverride`) is the safe default. Typed create followed by `POST /inventory/parts/delete` works only if the delete leaves the `catalogue_part` row behind, which hasn't been verified.

#### New coverage, by implementation run

| Run | Spec | Type | Requirements | Role |
|---|---|---|---|---|
| Phase 2 (1) | `e2e/tests/ui/parts-inventory/inventory-status-tabs.spec.ts`: Active tab lists A not B; Inactive tab lists B not A (B set inactive via API) | Happy | S1-R1…R4, R7, NFR-002 | admin |
| Phase 3 (1 workflow, 2 cases) | `e2e/tests/ui/parts-inventory/inventory-bulk-status.spec.ts`: **(a)** bulk deactivate A+B with a note → "2 parts updated.", rows leave without a reload, mode ends; activate A from Inactive → back on Active. **(b)** partial failure: B made inactive via API after ticking → "1 part updated, 1 could not be changed." (Q19) listing "B: Part is already in that state."; mode stays on with only B ticked | Happy + Edge | S2-R1…R15, S3-R1…R5, S10-R1…R13a | admin |
| Phase 4 (1) | `e2e/tests/ui/parts-inventory/inventory-untracked-part.spec.ts`: untracked part (seeded via API) shows "Not Tracked" in Total Qty, its bin chip still shows, and cycle count shows "Not Tracked" with no input | Happy | S4-R8, R8a, S5-R12 | admin |
| Phase 5 | none (no UI-affecting path; BE functional tests cover S6 ordering) | — | — | — |
| Phase 6 (5) | 1. `inventory-part-status-dialog.spec.ts`: pill "Active" → pick Inactive (pill stays) → Save → "Deactivate part?" with lead "{number} {description}" → Cancel keeps the pick → Save, note, confirm → "Part deactivated.", leaves Active; on Inactive the pill reads "Inactive" | Happy | S13-R3, R20…R25, S10-R10/R11, S9-R14 | admin |
| | 2. `inventory-part-create-by-number.spec.ts`: typed number N exactly matching a library entry stocked elsewhere ("LIB DESC") → toast 'Part created. Linked to N in the Part Library. Its description "LIB DESC" was kept.' | Edge | S7-R4…R6, R9 | admin |
| | 3. `inventory-part-rename-open-work.spec.ts`: rename N1 → N2; row updates without a reload; an **id-linked** open PO line shows N2 | Happy | S13-R11, R14, R18, R19, S8-R11 | admin |
| | 4. UPDATE `inventory-untracked-part.spec.ts`: create untracked via the dialog toggle (Min/Max hidden, bins stay); flip an existing part off and on → row flips without a reload, Min/Max return | Happy + Edge | S4-R1, R5, R6, S5-R1, R3, R4, R10, S8-R7 | admin |
| | 5. UPDATE `tests/permissions/custom/combo-parts-inventory-vendor-enforcement.spec.ts` C27409 (no Delete): no bulk menu entry; radios + toggle disabled; no Delete Part; a description edit saves. C27460 (Delete): all present and enabled | Edge | S8-R3…R6, R9, R11, R12, R14 | custom roles |
| Phase 7 (4) | 1. `e2e/tests/ui/work-orders/inactive-part-blocked-on-line.spec.ts`: inactive "AB-123" not offered; typing "ab123" shows "AB-123 is inactive. Activate it from the Inactive tab to use it." and no special-order offer; tab-out → row message, not added | Happy + Edge | S9-R1, R15, R16, R17 | admin |
| | 2. `e2e/tests/ui/parts-returns/vendor-return-inactive-part.spec.ts`: vendor return offers the inactive part with the grey "Inactive" tag; the return saves (needs a new `src/pages/parts/returns/create-return.page.ts`) | Happy | S9-R11, R12, NFR-002 | admin |
| | 3. UPDATE `e2e/tests/ui/work-orders/new-line-from-canned-line.spec.ts` (beside C26742): canned line with A and C (both inactive) and B → line created with B only + **one** persistent warning "These parts are inactive and were not added: A, C." | Edge | S9-R9, R10 | admin |
| | 4. UPDATE `e2e/tests/ui/search/global-search-part-to-inventory.spec.ts`: an inactive part's result carries the grey "Inactive" tag; selecting it opens Inventory on the **Inactive** tab searched to its number | Happy | S9-R18, R19 | admin |
| Phase 8 (3) | 1. UPDATE `inventory-part-status-dialog.spec.ts`: Part History shows "Deactivated \| Reason: E2E retired" with the staff name | Happy | S10-R14, R16, R17 | admin |
| | 2. UPDATE `inventory-untracked-part.spec.ts`: Part History shows "Tracking turned off" | Happy | S10-R22 | admin |
| | 3. `e2e/tests/ui/parts-inventory/part-history-search.spec.ts`: searching the note in lower case lists only the Deactivated entry; clearing restores all | Edge | S10-R20, R27 | admin |
| Phase 9 | none new; reference updates + deletes only | — | — | — |

**Deletes (⚠️ need explicit user confirmation before the implementer runs them).** Creating an entry from the Part Library page no longer exists (S11-R1/R2):
- `tests/ui/parts.spec.ts:119-130` "new catalog part - happy case" (C89)
- `tests/ui/parts.spec.ts:132-137` "new catalog part - close dialog" (C91)
- `tests/ui/parts/catalog-functional.spec.ts:45-70` "C20455 - Catalog - Add a new catalog part" (C20455)
- then `e2e/src/pages/dialogs/new-catalog-part.dialog.ts`, which has no consumers left

**Coverage skips.** Override marker, since no §8 reason fits:
- **Phase 1:** "behavior-preserving BulkBar extraction; WO bulk-bar specs re-run green". If the BE-only schema/atom part ships as its own PR, it matches no UI-affecting path and needs no block.
- **Phase 9:** "Part Library rename and create removal: 3 deprecated cases, reference updates only".
- **Phase 5:** no UI-affecting path, so no block.

**Backlog (ranked)**

| # | Workflow | Why deferred |
|---|---|---|
| 1 | Credit on an invoice shows an inactive part with the tag (S9-R13) | Same shape as the vendor-return case; BE functional covers the flag |
| 2 | "Changed at {location}" on another location after a rename (S10-R25/R26) | Needs a second workplace; BE functional covers the fan-out |
| 3 | Dialog status refused after save keeps the confirm open (S13-N4) | Hard to induce; FE unit owns it |
| 4 | Phone-width tech charge-out with a typed inactive number (S9-R3/R16) | Device variant of the Phase 7 WO case |
| 5 | Export from the Inactive tab (S1-R9) | BE functional covers it |
| 6 | Global search "Not Tracked" in place of the stock badge (S9-R20) | FE unit (`searchRowVariants.spec.ts`) covers it; same page as Phase 7 case 4 |
| 7 | Part Library page rename refusal / carry-over (S11-R3a) | Same renamer as the dialog; BE functional covers it |
| 8 | Public API rename history "Changed through: Public API" (S10-R25a) | No UI to drive; BE functional covers it |

**Factories / page objects needed:**
- `PartsFactory.setPartsStatus(partIds, status, note?)` → `PATCH /api/inventory/parts/status` (Phase 2)
- `PartsFactory.listInventoryParts({ search, status })` (Phase 2)
- `createUntrackedPart` (Phase 4, old create contract + `isTracked`)
- reworked `createInventoryPart` / `createFullInventoryPart` + `createInventoryPartByNumber` (Phase 6)
- `PurchaseOrderFactory.create` items gain the part id, so the PO line is id-linked; the implementer confirms the request field that sets `inventory_order_item.part_id` (Phase 6)
- `createLibraryOnlyEntry` (Phase 6 test 2, then Phase 9)
- page objects:
  - `InventoryPage`: tabs, bulk, row checkbox, `text_not_tracked_<id>`
  - `CycleCountPage`: `text_count_not_tracked_<id>`
  - new `StatusChangeConfirmDialog` object
  - new `CreateReturnPage`

**TestRail:**
- 11 new cases: Phase 2 ×1, Phase 3 ×2, Phase 4 ×1, Phase 6 ×3, Phase 7 ×3, Phase 8 ×1. Mark them Automated as their specs land.
- Deprecate C89, C91, C20455 (confirmed 2026-10-08).
- Retitle C26414, C27488, C20451, C104.
- Run `/testrail-push` after each phase.

**Dev-layer coverage (gates 1–3, not E2E)** is already listed per phase in §6: 200-cap and note bounds, core-follows, 403 without Delete, duplicate-at-location, rename collision, completed lines keep their number, PO/PS/estimate lookups, PO refusals, Inventory Value/count sheet, bin seeding, required-field messages, other-locations hints, no create button, removed endpoints, Critical Reorder, Supply filter, CSV import rules, public API rename, re-point refusal, delivery accept after rename.

## 8. Rollback Plan

- **Code-only revert.** Keep the columns: with `DEFAULT 1`, old code ignores them.
- **Effect of a revert:**
  - the public API and CSV import regain their old rename/re-point behavior (Phase 6)
  - parts marked inactive become selectable again
  - untracked parts are counted again by cycle count and re-enter Inventory Value from the next snapshot
  - no stock, cost or accounting data is affected
- 🔴 **Never run the `down()` migrations in prod.** Dropping the columns loses every status and tracking decision, and release-day state can't be rebuilt from history.
- **Data that stays behind is harmless:**
  - `entity_event` rows with the new event types are tolerated by old code (the FE label map returns `''` for unknown types)
  - the `catalogue_part` index and `inventory_value_snapshot.is_tracked` are inert
  - the extra `is_active` / `is_tracked` search fields are ignored by old code; no index rebuild is needed on revert
- **Removed endpoints (Phase 9)** return with a code revert and need no data. Revert Phase 9 before Phase 6 if both must go: the E2E factory and any old client need the standalone create back first.
- **Phases are independently revertible in reverse order.** Phase 7 (blocking) is the most likely to need a fast revert if a shop reports a blocked workflow. It touches no schema.

## 9. Security Considerations

- **Authorization (NFR-001):** status, create-untracked and tracking changes are enforced server-side with `ROLE_CATALOG_INVENTORY::DELETE`, the inventory part delete's own check (S8-N1…N3, S8-R15). Hiding controls is not the only protection. Known and accepted by Product and the user: several bundles carry that atom behind the scenes, so the server accepts these calls from exactly the users it accepts a delete from today (D14 superseded).
- **Tenant scoping (NFR-007):** every new and touched query is scoped:
  - `part` by `p.workplace_id` (`WorkplaceDecorator`, fails closed)
  - `catalogue_part` by `organization_id` (`OrganizationDecorator`)
  - rename propagation is **organization-scoped across workplaces**, which the PRD requires ("every location"), on every table's own join path
  - pre-existing unscoped reads fixed while touched: the canned-job `getInventoryPartsFromIds()` and `PartFetcher::getByCataloguePartId()`
  - `AddCommandHandler`'s order lookup is verified, and fixed if unscoped
- 🔴 **Golden Rule Exemption (record in the PR description):** the bulk status endpoint reports unowned ids per part as "Part not found." instead of failing the whole request (D17, user-approved). Rejected alternatives: whole-request reject (makes S10-R13a unreachable) and an org-strict hybrid. Mitigations: identical text for missing, other-workplace and other-tenant ids (no existence oracle); unowned ids are never written; the read is one scoped query.
- **XSS:** the bulk partial-failure toast uses `html: true` with user-entered part numbers. Everything goes through `escapeHtml`.
- **Removed attack surface:** the unpaginated, `#[IsGranted]`-less `catalogue-parts-that-are-not-on-location` endpoint is deleted (NFR-006).
- **Input bounds:** at most 200 ids; note ≤ 255 (`mb_strlen`); part number and description ≤ 255; S13-N7 guards the 50-char part-request column.
- **Public API rename (S13-R19d)** now reaches other locations' open work through the org-scoped renamer. `UpdateController` resolves the entry by id via `externalIdResolver` + `findById`; the implementer confirms that lookup is organization-scoped (Golden Rule) and fixes it if not, since a rename now fans out across workplaces.

## 10. Requirement Traceability

| Requirement | Phase | Layer | Files | Status |
|---|---|---|---|---|
| S1-R1…R4, R6, R8 | 2 | App | `app/src/components/ts/parts/inventory/Inventory.vue`, `InventoryToolbar.vue` | Planned |
| S1-R3/R4 | 2 | API | `api/src/Inventory/Parts/Infrastructure/Persistence/DbalPartListFetcher.php` | Planned |
| S1-R5, R5a, R5b | 1 | API | `part` migration (`DEFAULT 1`); no flag | Planned |
| S1-R7, R9, R10 | 2 | API+App | `ExportPartQueryHandler.php`, `CountSheetPdfQueryHandler.php`, `Inventory.vue` | Planned |
| S1-R9a | 4 | API | `ExportPartQueryHandler.php` | Planned |
| S1-N1/N2 | 2 | App | `Inventory.vue` `#no-data` | Planned |
| S2-R9 (X tooltip) | 1 | App | `shared/BulkBar.vue` | Planned |
| S2-R1…R10b, R12…R16, N1, N2, E4 | 3 | App | `useInventoryBulkStatus.ts`, `InventoryBulkStatusBar.vue`, `Inventory.vue`, `shared/BulkBar.vue` | Planned |
| S2-R11, R17, N3, E1…E3 | 1, 2 | API | `Part.php`, `ChangePartsStatusCommandHandler.php`, `PartStatusChangePlan.php` | Planned |
| S3-R1…R5, N1 | 3 | App | as Story 2 | Planned |
| S4-R1…R5, R7 | 6 | App | `InventoryPartDialog.vue` | Planned |
| S4-R6, R6a, N1, N2 | 4 | API | `CreatePartRequestDto.php`, `CreatePartCommandHandler.php` | Planned |
| S4-R8, R8a, R8b | 4 | App | `Inventory.vue` | Planned |
| S4-R9, Goals (past-date as-of) | 4 | API | `DbalInventoryValueFetcher.php`, `InventoryValueSnapshotCapturer.php`, snapshot `is_tracked` migration | Planned |
| S5-R1, R3…R8 | 6 | App | `InventoryPartDialog.vue` | Planned |
| S5-R2, R4, R9, R11, N1 | 4 | API | `ChangePartRequestDto.php`, `ChangePartCommandHandler.php`, `Part.php`, `InventoryPartUpdatedEventsDispatcher.php` | Planned |
| S5-R10, R12 | 4 | App | `Inventory.vue`, `useCycleCount.ts` | Planned |
| S5-R12, R13 | 4 | API | `PartsCycleCountCommandHandler.php`, `CountSheetPdfQueryHandler.php` | Planned |
| S5-R14, S9-E12 | 4 | API | `InventoryQueryHandler.php::fetchCriticalReorder` | Planned |
| S5-E1 | 6 | API | `ImportInventoryCommandHandler.php` (+ #3528) | Planned |
| S5-N2 | 6 | App | `InventoryPartDialog.vue` | Planned |
| S6-R1 (additive), R2, N1 | 5 | API | `PartTrackingSearchDecorator.php` | Planned |
| S6-R10 | 4 | API | `PartSupplyFilterDecorator.php` | Planned |
| S6-R3…R9 | 5 | API | `DbalPartListFetcher.php` | Planned |
| S7-R1…R3, N1, N2 | 6 | App | `InventoryPartDialog.vue` | Planned |
| S7-R4, R7…R11, N3…N6 | 6 | API | `CataloguePartLinker.php`, `DbalPartNumberAtLocationFetcher.php`, `CreatePartCommandHandler.php` | Planned |
| S7-R5, R6, R6a…R6d | 6 | API | `CataloguePartLinker.php` (R6d after #3294) | Planned |
| S7-N5b | 6 | API | `ChangePartCommandHandler.php` | Planned |
| S7-R9, R10 | 6 | App | `InventoryPartDialog.vue` | Planned |
| S8-R1…R2, N3, R15 | 2 | API | `ChangePartsStatusController.php` (`ROLE_CATALOG_INVENTORY_DELETE`) | Planned |
| S8-R3…R5 | 2, 3 | App | `Inventory.vue` menu | Planned |
| S8-R6, R9, R12 | 6 | App | `InventoryPartDialog.vue` | Planned |
| S8-R7, R8, R10, N1, N2 | 4 | API | `CreatePartController.php`, `ChangePartController.php` | Planned |
| S8-R11 | 6 | API | `ChangePartController.php` (Create & Edit) | Planned |
| S8-R13, R14, R16 | — | — | No permission data change; FE gates on `catalogInventoryDelete` as today | N/A (verified by `permissions:diff-atoms` showing no drift) |
| S9-R1…R3, R5, R6, R8, R15, R16 | 7 | API | `ListingQueryHandler.php`, `DbalInactivePartNumberFetcher.php` | Planned |
| S9-R3, R16 | 7 | App | `PartSelect.vue`, `usePartSelection.ts`, `PartSelectCreateAction.vue`, `InlinePartRow.vue` | Planned |
| S9-R18…R20 | 7 | API+App | `PartDocumentProvider.php`, `mappings/parts.json`, `SearchItemAssembler.php`, `searchRowVariants.ts`, `Inventory.vue` (`?tab=inactive`) | Planned |
| S9-R4, R7 | — | — | No such screen exists; the shared filter covers any future lookup | N/A |
| S9-R9, R9a | 7 | API | `AddPartsToLineAfterCreatedFromCannedLine.php` | Planned |
| S9-R10, R10a | 7 | API+App | `CannedLineApplicationWarnings.php`, `AddAdjustmentsToLineAfterCreatedFromCannedLine.php`, `cannedLineWarnings.ts` | Planned |
| S9-R11, R12 | 2, 7 | API+App | `PartListController.php` (default `all`), `PartSelect.vue` | Planned |
| S9-R13 | 7 | API+App | `PartSaleCreditProcessor.php`, `PartsReturnPicker.vue` | Planned |
| S9-R14 | 6 | App | `InventoryPartDialog.vue` pill | Planned |
| S9-R17, E2, E2a, E6 | 7 | API | `InactivePartGuard.php`, `ValidationAwarePartRequestCommand.php`, `UpdatePartRequestValidator.php`, order handlers | Planned |
| S9-N1…N3, E1, E3…E5, E7…E11 | 2, 7 | API | existing behavior kept; regression tests in Phase 7 (E1 incl. completed part sale; N3 = standard 403) | Planned |
| S9-E8a | 6 | API | `ImportInventoryCommandHandler.php` | Planned |
| S10-R1…R11 | 1, 3, 6 | App | `StatusChangeConfirmDialog.vue`, `Model.ts` | Planned |
| S10-R12, R13, R13a, N2 | 2, 3 | API+App | `PartStatusChangePlan.php`, `useInventoryBulkStatus.ts` | Planned |
| S10-R14…R20, N3, N4 | 2 | API | `ChangePartsStatusCommandHandler.php`, `PartLifecycleNote.php`, `DbalEntityEventBatchWriter.php` | Planned |
| S10-R21 | 8 | App | `PartHistory.vue` | Planned |
| S10-R22 | 4, 8 | API+App | `InventoryPartUpdatedEventsDispatcher.php`, `PartHistory.vue` | Planned |
| S10-R22a | prerequisite | API+App | delivered by #3528; Phase 8 parity fixture includes it | Depends on #3528 |
| S10-R23…R26, R25a | 6, 8 | API+App | `CataloguePartUpdatedHistoryPayloadHydrator.php`, `CataloguePartRenamer.php`, `PartHistory.vue` | Planned |
| S10-R27…R29 | 8 | API | `ViewQueryHandler.php`, `PartHistoryEventTextComposer.php` | Planned |
| S10-N1 | 3, 6 | App | `StatusChangeConfirmDialog.vue` | Planned |
| S11-R1, R2, R7 | 9 | API+App | removed `Create/*`; `PartsCatalogue.vue` | Planned |
| S11-R3…R5, E1…E3 | — | — | Unchanged behavior; verified in browser-walk | Planned |
| S11-R3a | 6 | API | `PartsCatalogue/.../Change/ChangeCommandHandler.php` → `CataloguePartRenamer.php` | Planned |
| S11-R3b | 9 | App | `CataloguePartDialog.vue` | Planned |
| S11-R6a | 6 | API | catalogue `PartNumber.php` (trim) | Planned |
| S11-R6, N1 | 6, 9 | API | `CataloguePartLinker.php`; standalone create removed | Planned |
| S12-R1…R10 | 9 (R10 in 7) | App | `PartsLeftMenuNav.vue`, `Parts.vue`, `CataloguePartDialog.vue`, `PermissionGrid.vue`, `labels.ts`, `PartSelect.vue` | Planned |
| S12-R11 | 9 | API | `DeleteCataloguePartCommandHandler.php`, `CataloguePartNotFoundError.php`, `ValidationAwarePartRequestCommand.php`, `PartRequestCommandAbstract.php` | Planned |
| S12-R12, R13 | 9 | App | `routes.ts`, `DeleteDialog.vue` | Planned |
| S12-R14 | 7 | App | `PartSelect.vue:444,448` | Planned |
| S12-N1…N3 | 9 | API+App | label-only; routes unchanged | Planned |
| S13-R1…R10, R20…R28, N2, N4…N6 | 6 | App | `InventoryPartDialog.vue`, `BaseFormDialog.vue` (`header-end`) | Planned |
| S13-R11…R18, N3 | 6 | API+App | `ChangePartCommandHandler.php`, `CataloguePart.php`, `InventoryPartDialog.vue` | Planned |
| S13-R19, R19a, R19b | 6 | API | three rename subscribers; delivery rows untouched | Planned |
| S13-R19c | 6 | API | `ReceiveADelivery.php` | Planned |
| S13-R19d | 6 | API | `OpenApi/Part/Application/Update/UpdateController.php` → `CataloguePartRenamer.php` | Planned |
| S13-N1 (exact), N3a, N7 | 6 | API | `PartLibraryNumberCollisionChecker.php`, `CataloguePartRenamer.php` | Planned |
| S13-N8, N9 | 6 | API | `Part.php::change()`, `PartsCatalogue/.../ChangeCommandHandler.php`, `ImportInventoryCommandHandler.php` | Planned |
| S13-E1 | 6 | API | re-point branch removed from `ChangePartCommandHandler.php`; refused elsewhere (S13-N8) | Planned |
| NFR-001 | 2, 4 | API | `ChangePartsStatusController.php`, `CreatePartController.php`, `ChangePartController.php` (`ROLE_CATALOG_INVENTORY_DELETE`) | Planned |
| NFR-002 | 2 | API+App | `PartListRequestDto.php`, `PartSelect.vue` (no `status`) | Planned |
| NFR-003, NFR-009 | 2, 6, 7 | API | `DbalPartStatusRepository.php`, `DbalEntityEventBatchWriter.php`, rename subscribers, canned-job batch lookup | Planned |
| NFR-004 | 2 | API | `PartHistoryFetcher.php` | Planned |
| NFR-005 | 6 | API | index migration, `DbalPartNumberAtLocationFetcher.php` | Planned |
| NFR-006 | 9 | API+App | removed endpoints + FE callers | Planned |
| NFR-007 | 6, 7 | API | `AddPartsToLineAfterCreatedFromCannedLine.php`, `PartFetcher.php` | Planned |
| NFR-008 | 1 | App | `shared/BulkBar.vue`, `BulkActionBar.vue` | Planned |
| NFR-010 | 7 | API | `mappings/parts.json`, rebuild + alias swap | Planned |

| S1-R1…R4, R7, NFR-002 | 2 | E2E | `e2e/tests/ui/parts-inventory/inventory-status-tabs.spec.ts` | Planned |
| S2-R1…R15, S3-R1…R5, S10-R1…R13a | 3 | E2E | `e2e/tests/ui/parts-inventory/inventory-bulk-status.spec.ts` | Planned |
| S4-R1, R5, R6, R8, R8a, S5-R1, R3, R4, R10, R12, S8-R7 | 4, 6 | E2E | `e2e/tests/ui/parts-inventory/inventory-untracked-part.spec.ts` | Planned |
| S13-R3, R20…R25, S10-R10, R11, S9-R14 | 6 | E2E | `e2e/tests/ui/parts-inventory/inventory-part-status-dialog.spec.ts` | Planned |
| S7-R4…R6, R9 | 6 | E2E | `e2e/tests/ui/parts-inventory/inventory-part-create-by-number.spec.ts` | Planned |
| S7-R1…R3, R7 | 6 | E2E | `e2e/tests/ui/parts/inventory-crud.spec.ts` (C20451, reworked) | Planned |
| S13-R11, R14, R18, R19, S8-R11 | 6 | E2E | `e2e/tests/ui/parts-inventory/inventory-part-rename-open-work.spec.ts` | Planned |
| S8-R3…R6, R9, R12, R14 | 6 | E2E | `e2e/tests/permissions/custom/combo-parts-inventory-vendor-enforcement.spec.ts` (C27409, C27460) | Planned |
| S9-R1, R15, R16, R17 | 7 | E2E | `e2e/tests/ui/work-orders/inactive-part-blocked-on-line.spec.ts` | Planned |
| S9-R11, R12 | 7 | E2E | `e2e/tests/ui/parts-returns/vendor-return-inactive-part.spec.ts` | Planned |
| S9-R9, R10 | 7 | E2E | `e2e/tests/ui/work-orders/new-line-from-canned-line.spec.ts` | Planned |
| S9-R18, R19 | 7 | E2E | `e2e/tests/ui/search/global-search-part-to-inventory.spec.ts` (UPDATE) | Planned |
| S10-R14, R16, R17, R20, R22, R27 | 8 | E2E | `inventory-part-status-dialog.spec.ts`, `inventory-untracked-part.spec.ts`, `e2e/tests/ui/parts-inventory/part-history-search.spec.ts` | Planned |
| S11-R1, R2, S12-R2, R3 | 9 | E2E | reference updates (`catalog.page.ts`, `edit-catalog-part.dialog.ts`); deletes C89/C91/C20455 (confirmed) | Planned |
| S9-R13, S9-R20, S10-R25/R26, S10-R25a, S11-R3a, S13-N4, S1-R9 | — | E2E | Backlog (§7) | Backlog |

## 11. Verification Tickets

| Ticket | Title | Covers | Linked stories | Assignee |
|--------|-------|--------|----------------|----------|
| SV-11038 | Verify Phase 1 - Schema, domain flags and shared bulk bar | S1-R5, S1-R5a, S1-R5b, S2-R17, S5-R9, S2-N3, NFR-008 | SV-10814, SV-10815, SV-10818 | Nemanja Djuric |
| SV-11039 | Verify Phase 2 - Status change and Active/Inactive tabs | S1-R1…R10, S1-N1…N2, S8-R1…R5, S8-N3, S10-R14…R20, S13-R3, NFR-002, NFR-004, NFR-009 | SV-10814, SV-10821, SV-10823, SV-10826 | Nemanja Djuric |
| SV-11040 | Verify Phase 3 - Bulk deactivate and activate | S2-R1…R17, S2-N1…N3, S2-E1…E4, S3-R1…R5, S3-N1, S10-R1…R13a (bulk), S10-N1/N2, S8-R3/R4 | SV-10815, SV-10816, SV-10823, SV-10821 | Nemanja Djuric |
| SV-11041 | Verify Phase 4 - Untracked parts across lists, reports and counts | S1-R9a, S4-R6a, S4-R8, S4-R8a, S4-R8b, S4-R9, S4-N1/N2, S5-R2…R14, S5-N1, S6-R10, S8-R7…R10, S8-N1/N2, S9-E12, S10-R22, Inventory Value past-date rule | SV-10814, SV-10817, SV-10818, SV-10819, SV-10821, SV-10822, SV-10823 | Nemanja Djuric |
| SV-11042 | Verify Phase 5 - Search and sort by tracking | S6-R1…R9, S6-N1 | SV-10819 | Nemanja Djuric |
| SV-11043 | Verify Phase 6 - Part dialog, create by typing, rename | S4-R1…R7, S5-R1, S5-R3…R8, S7-R1…R11 (R6c, R6d), S7-N1…N6 (N5b), S8-R6, R9, R11, R12, S10-R1…R11 (dialog), S10-R23…R26, S10-R25a, S11-R3a, S11-R6a, S13-R1…R28 (R19b…R19d), S13-N1…N9 (N3a), S13-E1, S5-E1, S9-E8a, NFR-005 | SV-10817, SV-10818, SV-10820, SV-10821, SV-10822, SV-10823, SV-10824, SV-10826 | Nemanja Djuric |
| SV-11044 | Verify Phase 7 - Inactive parts blocked from new work | S9-R1…R20, S9-N1…N3, S9-E1…E11, S12-R14, NFR-007, NFR-010 | SV-10822, SV-10825 | Nemanja Djuric |
| SV-11045 | Verify Phase 8 - Part History search and labels | S10-R16…R29 (R22a display, R25a), S10-N3 | SV-10823 | Nemanja Djuric |
| SV-11046 | Verify Phase 9 - Part Library browse and edit only | S11-R1…R7 (R3b), S11-N1, S11-E1…E3, S12-R1…R13, S12-N1…N3, NFR-006 | SV-10824, SV-10825 | Nemanja Djuric |

When all these tickets are marked Done, the feature is ready for QA.