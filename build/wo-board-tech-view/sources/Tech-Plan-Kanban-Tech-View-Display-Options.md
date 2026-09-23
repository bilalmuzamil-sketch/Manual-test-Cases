# Work Orders — Kanban & Tech View Display Options — Technical Implementation Plan

**Date:** 2026-09-17
**PRD:** https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/845185030/Work+Orders+Kanban+Tech+View+Display+Options+Draft+Spec (Draft v0.8)
**Review child (open questions, UX follow-ups, S12 event contract):** https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/853901313/Review+Decisions+and+Open+Questions
**Jira epic:** [SV-10043](https://shopview.atlassian.net/browse/SV-10043) — Stories 1–11 = [SV-10044](https://shopview.atlassian.net/browse/SV-10044) … [SV-10054](https://shopview.atlassian.net/browse/SV-10054); Story 12 has no story yet (requested from Product)
**Design:** Claude Design — Work Orders (linked from the PRD). It lags the PRD; 22 design follow-ups (UX-1…UX-22) are open with the designer. Tasks that depend on one are marked **waits on design UX-n**.
**Tech stack:** PHP 8.5 / Symfony 7.4 / Doctrine DBAL 4 + ORM 3 / MySQL 8.0 (Aurora) · Vue 3.5 / Quasar 2 / TypeScript / TanStack Query / Vitest · Playwright
**Estimated complexity:** High (13 phases; touches the most-used page in the app)

---

## 0. Execution State

_Keep this block current so any agent (or person) can resume mid-flight — this plan may be executed by someone who did not write it._

- **Status:** Not started
- **Current phase:** —
- **Last completed:** —
- **Open questions / blockers:** Two comments are posted on the PRD and awaiting Product — the first covers the default filter view, reordering locked work orders, the untracked design deltas, the six planning assumptions and Unassigned in the All view; the second covers the 17 items in Section 12. None of them block Phases 1–6. Design follow-ups UX-1…UX-22 block only the tasks marked **[design UX-n]**. **Phone/tablet layouts (V-2 / UX-20) are unresolved and gate Phase 13.**

> 🛑 **About to implement this plan? Run it as `/loop /implement <this-file>`.** This plan is meant to be executed by the `/implement` orchestrator inside a `/loop` — that combination is what adds the code-review loop, the Phase 5 runtime gates (migration / compile / smoke / browser-walk), the mandatory E2E ask, and phase-by-phase hands-off execution. Free-hand implementation skips all of it.
>
> - **However you were handed this** — "implement it", "here's the path, do it", or a single phase — do **not** start editing code directly. Route through `/loop /implement <this-file>` (or `/loop /implement Phase N from <this-file>` for one phase). That *is* "doing the implementation" — just with the gates. Announce that you're routing through `/loop /implement` and proceed; no need to ask.
> - **If you are ALREADY running under `/loop /implement`**, ignore this note and continue — you're in the right place.
> - **If you are a sub-agent** (`be-implementer`, `fe-implementer`, …) without orchestration tools, do **not** invoke `/loop` or `/implement` — that's the orchestrator's job. Execute only the scope you were handed and report back.
> - **Precedence:** only a *live, explicit* user instruction to the contrary wins — if the user in this session says to implement directly or skip the loop, honor that. Being handed just the plan path is **not** such an instruction; absent one, default to `/loop /implement` without asking.

---

## 1. Requirements (extracted from PRD)

### 1.1 Functional requirements

The PRD's own atomic IDs **are** the functional requirements: **207 story IDs + V-1 and V-2 = 209 requirements** (PRD v0.8). They are already one-rule-per-ID and each belongs to a story, so they are used verbatim rather than renumbered. Each story maps to a Jira story:

| PRD story | Jira | Requirement IDs |
|---|---|---|
| S1 Switch between display options | SV-10044 | R1, R2, R3, R4, R5, R7, R8, R9, R10, R11, R12; N1–N5; E1–E3 |
| S2 Tech View | SV-10045 | R1–R16; N1–N3; E1, E2 |
| S3 Kanban | SV-10046 | R1–R9, R11–R21; N1–N4; E1–E5 |
| S4 Reassign / unassign lead | SV-10047 | R1, R4–R24; N1–N8; E1–E8 |
| S5 Fields & columns | SV-10048 | R1–R5, R7–R13; N1–N3; E1–E6 |
| S6 Density | SV-10049 | R1–R7; N2; E1 |
| S7 Line technicians on cards/rows | SV-10050 | R1–R6; N1; E1 |
| S8 Remove tech-story check mark | SV-10051 | R1, R2; N1; E1 |
| S9 Drag to reorder / move | SV-10052 | R1–R15; N1–N3; E1–E3 |
| S10 List more-actions | SV-10053 | R1–R3; N1, N2; E1 |
| S11 Keyboard & focus | SV-10054 | R1–R10; N1; E1, E2 |
| S12 Google Analytics | epic SV-10043 (story missing) | R1–R15; N1; E1, E2 |
| Validation | SV-10043 | V-1, V-2 |

### 1.2 Non-functional requirements (introduced by this analysis)

Source: the engineering owner's intake directive — *"this is the most used page in the app and must be optimal / fast loading"* — plus the production sizing in Section 1.3.

| ID | Requirement | Origin |
|---|---|---|
| NFR-001 | Opening any display costs one preference request (session-cached) + **one** data request. No per-column/per-group request fan-out on first paint. | Intake directive |
| NFR-002 | Adaptive board loading: all cards when the filtered total is small (Work Orders view everywhere), otherwise counts for every group + cards for pinned/on-screen groups, batched continuations. | Analysis + user decision |
| NFR-003 | Every list/grouped query ends with a unique tie-break (`wo.id`), so paging never skips or repeats rows. | Analysis (existing defect) |
| NFR-004 | Kanban renders technician columns lazily and virtualises long columns; Tech View virtualises grouped rows. | Analysis (66 technicians; ~8.2k Unassigned cards) |
| NFR-005 | Manual order is stored relationally and applied in SQL; never in the preference JSON. | Analysis (16 KB cap) |
| NFR-006 | Every new query is scoped by workplace **and** organization. | Golden Rules |
| NFR-007 | "N open" counts load only when the Reassign dialog opens. | Analysis |
| NFR-008 | Lead change + line movement + optional shift clearing + audit are one transaction; the status lock is enforced on every path. | S4-R10, FF-4 |
| NFR-009 | Browser Back restores data and vertical + horizontal scroll without refetching from page 1 (S1-R8). | Analysis (broken today) |
| NFR-010 | Tab/filter/search changes cancel in-flight requests; a stale response can never overwrite newer data. | Analysis (no guard today) |
| NFR-011 | Drag and reassign update optimistically with rollback (S4-N3) and immediate count updates (S4-R7); no board refetch after a successful move. | Analysis |
| NFR-012 | Preference writes stay debounced and never trigger a data refetch. | Analysis |
| NFR-013 | Board endpoints are measured on a largest-location fixture (~9,000 WOs, 66 technicians) with a bounded statement count per request and p95 targets; the new routes are traced. | V-1, FF-6 |

### 1.3 Production sizing (read-only queries, 2026-09-17, MySQL 8.0.42)

| Measure | Value |
|---|---|
| Work Orders filter view (approved / in progress / ready for review) | ≤ **164** work orders per location (15 largest); unassigned often nearly all of it |
| Estimates / Completed views | ≤ 369 / ≤ 372 per location |
| All view | up to **~9,000** per location, dominated by invoiced/paid |
| Unassigned inside All | ~8,200 of ~9,000 at the largest location; 3,000–6,500 at several others |
| Work orders per lead technician (All) | max 504, average 10–189 |
| Eligible technicians per location | max 66, 60, 48, 46; others ≤ 31 |
| Saved filter view | Work Orders 1,358 users · All 856 · Estimates 126 · Completed 124 |
| Current latency baseline | Sentry has no transactions for these routes. `RequestProfilerSubscriber` logs `duration` + `db.queries.*` per request (Datadog) — Phase 2 records the baseline. |

### 1.4 Clarifications & PRD comment outcomes

| Question | Asked via | Answer |
|---|---|---|
| Performance expectations for the page | Intake | "We need to care about requests, queries we are using to fetch the data… this is the most used page in the app and must be optimal / fast loading" → NFR-001…013 |
| Design lags the PRD (22 open UX follow-ups) | User | Plan fully; mark UI tasks that depend on an open UX item as "waits on design"; accepted risk |
| Story 12 has no Jira story | User | Do not create it; request it from Product. FRs tag to the epic until it exists |
| OQ-2 destination order for other users | Confluence comment (open) | Planned: a WO that gets a new lead lands after all manually ordered work in that group, then default sort |
| SQ-11 unpin position; pins per location? | Confluence comment (open) | Planned: unpin returns to the previous slot; pins/order per user, filtered to technicians of the current location |
| MF-3 "N open" semantics | Confluence comment (open) | Planned: lead only, current location, Approved / In Progress / Ready for Review, ignoring page filters |
| FF-4 removal prompt + atomicity | Confluence comment (open) | Planned: removal prompts too; clearing failure rolls back the lead change |
| FF-4 shift scope | Confluence comment (open) | Planned: only the outgoing lead's whole-work-order shifts that have not ended |
| SQ-10 click vs drag | Confluence comment (open) | Planned: click anywhere opens; drag after a small movement threshold |
| Default filter view (code = All, PRD = Work Orders) | Confluence comment (open) | Planned: Work Orders for users with no saved preference; saved tabs retained |
| Reordering locked work orders (PRD blocks all drags; design allows reorder) | Confluence comment (open) | Planned: PRD rule — no drag at all in Invoiced/Paid/Declined |
| Untracked design deltas (waiting-on-parts, Undo toast, Unassigned hidden when empty, Details view, Technician/Department chips) | Confluence comment (open) | Planned: the PRD wins |
| Unassigned in All holds thousands of invoiced jobs | Confluence comment (open) | Planned: spec as written + incremental loading |
| FF-4 notifications | Engineering answer | None exist on lead change today → S4-R6 parity = none |
| FF-2 production sort + status matrix | Engineering answer | Recorded in Section 3.9 |
| MF-2 implicit vs explicit line assignment | User decision | Option B — record origin from now on; unknown history falls back to today's rule; roster rows count as explicit |
| Tenant check on inbound technician id | User decision | Add organization-ownership check (eligibility stays the picker's job per the PRD) |
| S1-R10 carve-out: what a shared URL without `?tab` means | Plan decision (Section 3.20) | The **first-visit** default becomes Work Orders; the **URL** default stays All, so an existing shared link without `?tab` still opens All. Product should know this when answering the default-view question |
| S2-R3 "earliest-created staff record" | Data mismatch (Section 12.14) | `staff` has no created date; the plan uses `user.created_on` (NULLs last) then `staff.id`. Different record from the one the PRD names |
| Phone and tablet layouts (V-2, UX-20) | Blocked (Section 12.15) | Design does not exist. Phase 13 keeps today's mobile List and withholds the new displays below the desktop breakpoint — an interim state, not the V-2 requirement |
| Shared-link visits and layout preferences | Plan decision (Section 3.19) | Layout choices made during a shared-link visit now persist, reversing an existing convention. Tab and filters from the link still do not persist |
| S12 reporting rules (R4, R10–R13) | Ownership gap (Section 12.16) | Emitting events is engineering; defining the reports is not. Phase 10 carries the report definitions as a deliverable with an owner |
| 16 further gaps found during code planning | Follow-up comment (drafted) | See Section 12 |

---

## 2. Architecture Overview

```
Work Orders page (app/src/pages/WorkOrders.vue → shell + displays/)
  shell: tabs · filter bar · search · display switcher · density · column/field picker
  │   view state (page-scoped composable)  ── preferences (1 GET, debounced PUT)
  ├── List display        → GET /api/work-orders            (unchanged contract + 3 new fields)
  ├── Tech View display   ┐
  └── Kanban display      ┴→ GET /api/work-orders/board          (groups + counts + adaptive items)
                            GET /api/work-orders/board/items     (batched continuation)
                            POST /api/work-orders/{id}/board-move (reorder | reassign, atomic)
                            GET /api/work-orders/lead-technician-candidates (dialog, lazy)

api/src/VehicleService/WorkOrders/
  Application/Query/WorkOrder/WorkOrderListCriteria          ← ONE criteria object…
  Infrastructure/…/WorkOrderListingCriteriaApplier           ← …applied by List AND board (S1-R11)
  Infrastructure/…/DbalWorkOrderListingFetcher               (List page rows)
  Infrastructure/…/DbalWorkOrderBoardFetcher                 (windowed board query)
  Infrastructure/…/DbalWorkOrderListItemEnricher             (lines, progress, clocked-in, parts, line techs)
  Application/Service/WorkOrder/LeadTechnicianChanger        ← ONE choke point for every lead change
  Domain/WorkOrder::changeLeadTechnician()                   ← status lock lives here (S4-R10)
  Domain/Model/WorkOrderBoardPosition                        ← per-user manual order
  Application/Service/OutgoingLeadShiftClearer (port)  →  TaskManagement/Schedule adapter
```

**Key shapes**

- **One filter implementation.** List and board share `WorkOrderListCriteria` + `WorkOrderListingCriteriaApplier`, which is what makes S1-R11 ("same results, different layout") true by construction instead of by discipline.
- **One board statement.** `ROW_NUMBER() OVER (PARTITION BY lead …)` + `COUNT(*) OVER (PARTITION BY lead)` + `COUNT(*) OVER ()` produce per-group ordering, per-group counts and the adaptive threshold decision in a single query, so the adaptive mode costs no extra round trip.
- **One lead-change choke point.** `WorkOrder::setTechAssignedId()` is removed, so the compiler forces `change-lead-technician`, `/change` and `board-move` through `LeadTechnicianChanger`: row lock → status guard → line movement → optional shift clearing → stale board rows → one audit entry, all inside one transaction.
- **Manual order in SQL.** `work_order_board_position (user_id, work_order_id)` carries the technician the row was written under, so a work order that changed lead ignores its stale position and falls to the bottom — S9-R14 and the OQ-2 assumption with no writes to other users' data.

---

## 3. Technical Decisions

1. **Adaptive board loading** (user decision). One request returns every group with counts; it also returns all cards when the filtered total ≤ ~300 (configurable; true for the Work Orders view at every location). Above that, cards come for the pinned + on-screen groups, then batches of ≤ 6 groups horizontally and 25 cards per group vertically. Rejected: first-N-of-every-group (≈1,650 cards / 1–1.5 MB first load in All at 66 technicians) and viewport-only-always (extra requests on small boards).
2. **One windowed board query** rather than a count query plus per-group `UNION ALL` subqueries. Keeps the statement count constant (≤ 8 per request) and decides the adaptive threshold inline. The alternative stays available behind the fetcher if the Phase 12 EXPLAIN gate shows the window sort spilling.
3. **`POST /api/work-orders/{id}/board-move` for drags** — reorder and reassign in one atomic request. Rejected: reusing `change-lead-technician` plus a separate position call (2 requests per gesture; a lost position when the second fails).
4. **Manual order in a table, not the preference JSON.** The preference document is capped at 16 KB (~400 UUIDs) and cannot be joined for server-side ordering. Positions are keyed `(user_id, work_order_id)` with a sparse `sort_key` and the technician guard above.
5. **Ordering within a group:** ranked rows by `sort_key`, then unranked rows by the List default sort, then `wo.id`. Moving next to an unranked anchor materialises the group's prefix so S9-E2/E3 (hidden items keep their relative order) holds.
6. **In-group default sort = the List desktop default** (`company name ASC, wo.id ASC`), exactly as S2-R6 requires. The backend planner proposed inserting `start_date DESC`; rejected because it would silently depart from the PRD.
7. **MF-2 = option B** (user decision): a nullable `work_order_line.tech_assignment_origin` written from now on (`inherited` / `explicit`); NULL history falls back to today's equality rule; roster rows count as explicit. Rejected: heuristic-only (contradicts OQ-18 and cannot drive UX-16) and roster-backfill (large migration, changes roster semantics).
8. **Organization-ownership check on inbound technician ids** (user decision, Golden Rule). Eligibility stays the picker's job exactly as the PRD decided; only tenant ownership is enforced server-side.
9. **FF-2 recorded from code.** Production List sort: desktop sends `companyName` ASC, mobile `startDate` DESC, both then `wo.id ASC`; a saved sort wins; selecting only Invoiced forces `invoicedDate` DESC. Status chip is visible only on the All tab; Work Orders sends approved + in_progress + ready_for_review, Estimates sends estimate, Completed sends complete; Imported switches to `/api/work-orders-imported`. Default List columns = every non-required column except `invoicedDate`, `daysOpen`, `partRequestsCount`, `partReturnRequestsCount`, `unreceivedPartRequestsCount`.
10. **Frontend state:** TanStack Query for List, board, continuations, candidates and the preference read; a page-scoped composable for UI state. List migrates to the query cache in Phase 2 — NFR-009/010 are not achievable without a key-bound cache and request signals.
11. **Custom pointer-based drag** (`useBoardDrag`), not sortablejs: sortablejs moves DOM nodes (the SV-8446 phantom-duplicate class of bug), its indices are relative to the rendered slice under virtualisation, and an instance on a column that virtualises out mid-drag breaks. The custom handler only reports data: hit-test `data-*`, resolve the anchor at drop time, threshold for SQ-10, Escape to cancel, auto-scroll.
12. **Back/freshness:** 30 s `staleTime` with mutation-driven invalidation (`refetchType: 'none'`), so Back after a change refetches and Back without one costs zero requests.
13. **Pins:** a pinned technician enrolled at the current location always gets a group (even inactive or empty) so it can be unpinned (S3-E3/E5); pins for technicians of other locations are hidden and do not consume the 3-pin cap there.
14. **`lineTechnicians` on List is opt-in** (`include[]=lineTechnicians`) so the customer and vehicle work-order tabs do not pay for the extra statement.
15. **No new dependency.** Everything uses what is already in the repo (TanStack Query, Quasar virtual scroll, DBAL window functions).
16. **Variable card height under virtualisation** (S3-E4): Kanban columns use measured/dynamic item sizing rather than a fixed estimate, because density and optional fields change card height. A fixed estimate would make tall cards unreachable in a virtualised column — the exact failure S3-E4 forbids.
17. **Reaching Tech View and Kanban before Phase 9.** The switcher lists them only from Phase 9, so Phases 7 and 8 expose each display through a dev-only URL parameter (`?display=kanban|tech_view`, non-production builds) purely so the mandatory browser-walk gate is executable. It is not a runtime feature flag and ships disabled in production.
18. **Phone and tablet (V-2, UX-20):** no design exists, so Phase 13 holds today's behaviour — below the desktop breakpoint the mobile List renders and the new displays are withheld, and nothing overwrites the user's desktop choice. This is an interim state that does **not** satisfy V-2; the requirement stays open until UX-20 lands.
19. **Shared-link visits persist layout preferences** (display, density, fields, pins, order, collapse) while tab and filters from the link still do not. This reverses the existing "URL-entered visits never persist" convention documented in `app/src/composables/usePagePreferences.ts`; without it a user who changes density during a shared-link visit silently loses it. Called out in the PR description.
20. **Default filter view is split by entry point** (S1-R10): first visit with no saved preference lands on Work Orders; a URL without `?tab` still resolves to All so existing shared links keep their meaning.
21. **Analytics reporting is a named deliverable, not a by-product.** S12-R4, R10, R11, R12 and R13 define reports and a distinct-user rule; Phase 10 carries them as GA4 exploration definitions with an owner and a sample-calculation check (S12-E2), because emitting events satisfies none of them.

---

## 4. Database Changes

### New table — `work_order_board_position`

Per-user manual order for Tech View and Kanban (S9-R3/R11/R12, D5).

| Column | Type | Notes |
|---|---|---|
| `user_id` | BINARY(16) NOT NULL | PK part 1; FK → `user(id)` ON DELETE CASCADE |
| `work_order_id` | BINARY(16) NOT NULL | PK part 2; FK → `work_order(id)` ON DELETE CASCADE |
| `technician_id` | BINARY(16) NULL | Lead when the row was written; NULL = Unassigned. No FK — it is a guard value; stale rows are ignored by the read predicate |
| `sort_key` | BIGINT NOT NULL | Sparse, gap 2^20 |
| `updated_at` | DATETIME NOT NULL | `datetime_immutable` |

Indexes: PK `(user_id, work_order_id)` (clusters a user's rows; primary-key lookup per work order), `wobp__work_order_id_idx`, `wobp__user_id_technician_id_sort_key_idx (user_id, technician_id, sort_key)`.

```sql
-- Illustrative shape only, NOT the migration to copy-paste
CREATE TABLE work_order_board_position (
  user_id BINARY(16) NOT NULL, work_order_id BINARY(16) NOT NULL,
  technician_id BINARY(16) NULL, sort_key BIGINT NOT NULL, updated_at DATETIME NOT NULL,
  PRIMARY KEY (user_id, work_order_id),
  KEY wobp__work_order_id_idx (work_order_id),
  KEY wobp__user_id_technician_id_sort_key_idx (user_id, technician_id, sort_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Modified table — `work_order_line` (MF-2 option B)

`ADD COLUMN tech_assignment_origin VARCHAR(10) DEFAULT NULL, ALGORITHM=INSTANT` — state `INSTANT` explicitly so MySQL 8.0.42 fails fast instead of silently rebuilding the table. No backfill, no index. Values `inherited` | `explicit`; NULL = unknown history.

> ⚠️ Migrations are written **by hand** and verified as a no-op with `bin/console doctrine:migrations:diff --allow-empty-diff` ("No changes detected"). DBAL's schema tools choke on functional/expression indexes in this repo, so the real migration is produced by the implementer against the live schema. Hand-authored FKs (`work_order_board_position__user_id_fk`, `work_order_board_position__work_order_id_fk`) must be registered in `MANUALLY_MANAGED_FOREIGN_KEYS` in `api/src/Shared/Infrastructure/Doctrine/Schema/ExpressionIndexFilteringMySQLSchemaManager.php`. See `api/.claude/reference/database.md`.

Both tables need ORM mappings (`api/src/VehicleService/WorkOrders/Infrastructure/Doctrine/Model/WorkOrderBoardPosition.orm.xml` (the entity is `Domain/Model/…`, and `doctrine.yaml` maps `Infrastructure/Doctrine/Model` to the `Domain\Model` namespace — precedent `PartRequestBinUsage`), and the new field in `.../Doctrine/Line/Line.orm.xml`) because the SQLite test schema is built from mappings. Writes to `work_order_board_position` go through **DBAL**, not ORM persist: materialisation and rebalancing are set-based, and the generic audit `LogCommandBus` would otherwise queue an audit message on every drag.

### Data migrations

None. MF-2 option B deliberately ships without a backfill: unknown origin falls back to today's behaviour. An optional follow-up (`B+`) can mark lines of open work orders `explicit` from existing `work_order.line.tech.changed` history events.

**Cleanup:** FKs cascade on user/work-order deletion; every lead change deletes the work order's position rows that do not match the new lead (one indexed DELETE) so an A → B → A move does not resurrect an old position.

---

## 5. API Changes

### New endpoints

**`GET /api/work-orders/board`** — `#[IsGranted(PermissionEnum::ROLE_WORK_ORDER_VIEW)]`
- Params: the List's `search`, `filters[]`, `showMyWorkOrders`, plus `groups[]` (staff uuid or `unassigned`, ≤ 12), `fill` (server adds the next N groups in S2-R3 order), `perGroup` (1–100, default 25). `type` is always `service`.
- Response: `{ data: { groups: [{ key, technician: {id, userId, firstName, lastName, active, eligibleInLocation, hasAvatar} | null, count, itemsLoaded, hasMore, nextOffset, items: [...] }], matchingTotal, itemsMode: "all"|"partial", perGroup } }`
- Groups = every eligible technician (even empty) + inactive/ineligible leads with matching work + explicitly requested pinned groups (even at count 0) + Unassigned. Order: Unassigned, then S2-R3; the frontend applies pins and the user's order on top.
- `itemsMode = "all"` when `matchingTotal ≤ threshold` (container parameter; 5 in tests).
- Pagination/bounds: per-group `perGroup` cap 100, `groups[]` cap 12, safety `LIMIT`. Item fields mirror the List row + `techAssignedId`, `vehicleYear`, `lineTechnicians`, `leadChangeAllowed`, `leadHasOpenWorkOrderShifts`.
- Errors: 403 without the permission; foreign `groups[]` ids return an empty group (no existence oracle).

**`GET /api/work-orders/board/items`** — batched continuation: `groups[i][key]`, `groups[i][offset]`, optional `groups[i][limit]` (so a stale refetch reloads everything loaded in one request), ≤ 12 groups. Returns the same group shape with refreshed counts.

**`POST /api/work-orders/{workOrderId}/board-move`** — `#[IsGranted(PermissionEnum::ROLE_WORK_ORDER_CREATE_AND_EDIT)]` (S4-N1, S9-N1)
- Body: `{ technicianId: uuid|null, anchorWorkOrderId?: uuid, placement?: "before"|"after", clearShifts?: bool, scope?: <list filter params> }`
- Response: `{ workOrderId, technicianId, leadChanged, placement: "anchored"|"appended", clearedShiftCount, lineTechnicians: [...]|null, matchesFilters: bool }`
- Errors: 409 `lead_change_locked_status` (Invoiced/Paid/Declined, reorder **and** move), 404 unknown work order or anchor, 422 technician outside the organization, 403 without permission.

**`GET /api/work-orders/lead-technician-candidates`** — `#[IsGranted(PermissionEnum::ROLE_WORK_ORDER_CREATE_AND_EDIT)]`, loaded when the Reassign dialog opens. Returns eligible technicians (S2-R7 rule) with `openCount` per MF-3 (lead only, current location, Approved/In Progress/Ready for Review, ignoring page filters). One statement.

### Modified endpoints

- **`GET /api/work-orders`** — adds `techAssignedId`, `vehicleYear` and (opt-in via `include[]=lineTechnicians`) `lineTechnicians` to each row; adds `wo.id` to the default sort; adds an organization predicate. Response keys, pagination shape and `totalWorkOrderPrice` unchanged.
- **`POST /api/work-orders/change-lead-technician`** — accepts `clear_shifts` and an optional list scope; returns `cleared_shift_count`, the new `techAssignedId`, `lineTechnicians` and `matchesFilters`. Now enforces the status lock and the organization check, and writes exactly one audit entry.
- **`POST /api/work-orders/change`** — when it carries a lead change, it now goes through the same choke point (guard + audit). Re-sending the *current* lead stays a no-op so the asset-on-site toggle keeps working on invoiced work orders.
- **`GET /api/iam/view-avatar/{userId}`** — add `Cache-Control: private, max-age=…` + `ETag`. Today it is `no-cache`, so every board mount re-downloads every technician photo.

---

## 6. Implementation Phases

Legend: **[design]** = waits on a design follow-up; **[pair]** = needs the matching change in the other area in the same release.

### Phase 1: Remove the tech-story check mark
**Implements:** S8-R1, S8-R2, S8-N1, S8-E1
**Depends on:** nothing

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/work-orders/work-order-lines/WorkOrderLineRow.vue` | Modify | Delete the `check_circle` icon in the Story sub-row and the `.tech-story-check` rule. Keep `hasTechStory` (the edit button uses it) and `line_tech_story_<id>` |

#### Unit tests:
- Line with a story renders its text and no check icon (S8-R1); line without a story unchanged (S8-N1); edit button still present (S8-R2).

#### Verification:
- **Static (scoped):** `npx eslint --max-warnings=0`, `npx vitest related --run`, `npx vue-tsc --noEmit`
- **Compile:** Vite up, no errors
- **Browser-walk:** open a work order with a tech story as `admin`; the story text and edit button remain, the check mark is gone

---

### Phase 2: Groundwork — shared criteria, List on the query cache, no visible change
**Implements:** S1-R5, S1-R7, S1-R8, S1-R11, S1-R12, S1-N5, S1-E2, S1-E3, S7 data, NFR-003, NFR-006, NFR-009, NFR-010
**Depends on:** nothing (runs parallel to Phase 1)

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `api/tests/Functional/VehicleService/WorkOrders/ListingTest.php` | Modify | **First**: characterization tests — full serialized key set, order for `companyName` and for no `sortBy`, one search hit per search field |
| `api/src/VehicleService/WorkOrders/Application/Query/WorkOrder/WorkOrderListCriteria.php` | Create | Filter collection, search, `showMyWorkOrders`, staff id, type |
| `api/src/VehicleService/WorkOrders/Infrastructure/Persistence/Query/Dbal/WorkOrderListingCriteriaApplier.php` | Create | Owns joins, filter whitelist, search fields, `showMyWorkOrders` SQL, workplace **and organization** decorators |
| `api/src/VehicleService/WorkOrders/Infrastructure/Persistence/Query/Dbal/DbalWorkOrderListingFetcher.php` (+ interface) | Create | List page SQL moved out of Application; adds `techAssignedId`, `vehicleYear`, `wo.id` tie-break; builds DTOs directly instead of json_encode → deserialize |
| `api/src/VehicleService/WorkOrders/Infrastructure/Persistence/Query/Dbal/DbalWorkOrderListItemEnricher.php` (+ interface) | Create | Line counts, progress, clocked-in, part sums, **line technicians**; 0 statements for an empty page |
| `api/src/VehicleService/WorkOrders/Domain/Service/WorkOrderProgressCalculator.php` | Create | Pure progress math with an `isset` map (today `in_array` is O(n²) in labor rows) |
| `api/src/VehicleService/WorkOrders/Application/List/DTO/WorkOrderDto.php` | Modify | `techAssignedId`, `vehicleYear`, `lineTechnicians` (public props → camelCase) |
| `api/src/VehicleService/WorkOrders/Application/List/ListingQueryHandler.php` | Modify | Thin delegate; response shape unchanged |
| `api/src/VehicleService/WorkOrders/Domain/PartRequest/Service/PartRequestFetcher.php`, `.../PartReturnRequest/Services/PartReturnRequestFetcher.php` | Modify | Add workplace + organization predicates to `getSumByWorkOrderIds` (shared with Part Sales) |
| `api/src/IAM/.../ViewAvatarController` (avatar response) | Modify | `Cache-Control: private, max-age` + `ETag` |

Line-technician statement: lead first, roster rows when present else the legacy line technician, `user` names with `staff` fallback, deduped — one batched query over the page's ids.

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `app/src/pages/WorkOrders.vue` | Modify | Becomes a shell: page, shared-link banner, body keyed on location, dialogs |
| `app/src/components/ts/work-orders/displays/` (`Model.ts`, `constants.ts`, `WorkOrdersPageBody.vue`, `toolbar/WorkOrdersToolbar.vue`, `list/WorkOrdersListDisplay.vue`, `list/WorkOrdersMobileList.vue`, `list/workOrderColumns.ts`, `composables/*`) | Create | Split of the 2,363-line page; List slots moved verbatim |
| `app/src/composables/useTableQuery.ts` | Modify | Pass `{ signal }` into `fetchPage` (additive — **23 files instantiate it** plus `useReportTableQuery.ts`; they ignore the second argument, but the change is repo-wide, so run the full vitest suite) |
| `app/src/api/work-orders/index.ts`, `keys.ts` | Modify | `signal` support; `lists()` / `list(params)` keys |
| `app/src/api/preferences/keys.ts`, `queries.ts` | Create | Preference read cached (`staleTime: Infinity`), updated on successful PUT |
| `app/src/components/ts/work-orders/displays/composables/useWorkOrdersScrollRestoration.ts` | Create | Snapshot keyed by history position, restored only on a pop navigation and only for the same filter scope |

Also: delete the `subscribeToLocation` call (it leaks one listener per mount, so a location switch fires one list request per earlier visit) and key the body on the location instead; move the invoiced-sort special case into a pure function; patch the asset-on-site toggle through the cache instead of two extra GETs.

**Parity the split must preserve** (each gets a test, because the split is where they would silently break):
- **S1-R5** the four filter tabs stay visible to anyone with Work Orders view, with today's Status-chip matrix (Section 3.9).
- **S1-R7** the saved List sort still loads and still wins over the default — it lives in the same preference document and must survive the move.
- **S1-N5** two tabs of the same user: the last preference write wins (the debounced PUT already gives this; assert it rather than assume it).
- **S1-E2** changing location opens that location's default page, and **S1-E3** "Assigned to me" resets on a location change. The frontend research could not find the S1-E3 reset in today's code, so **verify the current behaviour at runtime first** and match it; if it does not exist today, say so in the PR rather than inventing it.

**Do not rename during the split** — every id below is referenced from `e2e/`: `tab_all`, `tab_estimates`, `tab_work_orders`, `tab_completed`, `selected_sort_indicator`, `work_orders_sort_<option>`, `toggle_column_<name>`, `link_waiting_on_parts_<id>`, `button_column_selection`, `button_new_work_order`, `button_sort_work_orders`, `table_work_orders`, the asset-on-site toggle suffix, and `data-cy="work-order-mobile-card"` / `"work-order-customer"`.

#### Unit / integration tests:
- BE: new fields; roster vs legacy fallback, lead first, dedupe (S7-R3/R5/E1), blank when nothing assigned (S7-N1); equal statement count for 3-row and 30-row pages; a work order whose organization does not match is excluded; progress calculator unit tests.
- FE: the existing 2,226-line `app/src/pages/tests/WorkOrders.spec.ts` stays green (mocking only — if it needs restructuring, the split was not verbatim and the E2E locators in Phase 8's parity list are at risk); key change aborts the previous request; a slow old response never replaces newer data; pop restores scroll, push does not, a different scope does not; a location change issues exactly one list request after three mount/unmount cycles; saved sort still applied (S1-R7); tab set unchanged (S1-R5).

#### Verification:
- **Static (scoped):** BE `composer cs-fix` + `phpstan` + `pest`; FE `eslint` + `vitest` + `vue-tsc` (full FE suite, because `useTableQuery` is shared by 23 screens)
- **Smoke:** `bin/smoke-test.sh` — no 500s
- **Compile:** Vite up
- **Browser-walk:** `/workorders` as `admin` — filter, search, sort, scroll, open a work order, press Back (scroll restored, no refetch), switch location (exactly one list request in the network tab). Also open a customer's and a vehicle's work-order tab, which share this endpoint.

#### E2E tests (`e2e/`):
No new spec. Reference work only, all mandatory:
- `e2e/src/pages/work-orders/work-orders-filter-bar.page.ts` — `showOnlyStatus()` must select the All tab first (the Status chip renders only there); fix the stale docblock that claims the list opens on Estimates.
- `e2e/src/pages/work-orders/work-orders.page.ts` + `work-orders-filter-bar.page.ts` — `resetSavedWorkOrderFilters()` and its browser-side twin keep writing `tab: 'all'`.

---

### Phase 3: Lead-change hardening
**Implements:** S4-R6, S4-R8, S4-R9, S4-R10, S4-R17–R24, S4-N2, S4-N4, S4-E1, S4-E2, S4-E5, S4-E6, NFR-008
**Depends on:** Phase 2

#### Database changes:
| Migration/Change | Description |
|---|---|
| `api/migrations/Version2026XXXXXXXXXX.php` | Create `work_order_board_position` + 2 FKs (registered in `MANUALLY_MANAGED_FOREIGN_KEYS`); `work_order_line.tech_assignment_origin` VARCHAR(10) NULL, `ALGORITHM=INSTANT` |

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `api/src/VehicleService/WorkOrders/Domain/WorkOrder.php` | Modify | **Remove `setTechAssignedId()`**; add `changeLeadTechnician()` (same-lead early return before the guard, so the asset-on-site toggle still works on invoiced work orders) + `assertLeadTechnicianCanChange()` + `assertCanBeRepositionedOnBoard()` |
| `api/src/VehicleService/WorkOrders/Domain/Error/LeadTechnicianLockedError.php` | Create | `ConflictError` (409) naming the status |
| `api/src/VehicleService/WorkOrders/Application/Service/WorkOrder/LeadTechnicianChanger.php` | Create | Row lock → refresh → organization check → domain change → line movement → optional shift clearing → stale position cleanup → save → one audit entry |
| `api/src/VehicleService/WorkOrders/Domain/Line/Service/LineFetcher.php` | Modify | S4-R8 predicate: not Complete, no labor **by line or via task**, no roster rows, and (no technician OR the outgoing lead with origin `inherited`/NULL) |
| `api/src/VehicleService/WorkOrders/Application/ChangeLeadTechnician/*`, `Application/Change/ChangeCommandHandler.php` | Modify | Both routed through the changer inside a transaction; `clear_shifts` accepted |
| `api/src/VehicleService/WorkOrders/Application/Service/OutgoingLeadShiftClearer.php` (port) + `api/src/TaskManagement/Schedule/Infrastructure/WorkOrders/ShiftOutgoingLeadShiftClearer.php` | Create | Deletes the outgoing lead's **not-yet-ended, work-order-level** shifts (no shift lines) after asserting the caller's shift scope |
| `api/src/TaskManagement/Schedule/Domain/Repository/ShiftRepository.php` (+ Doctrine impl + fake) | Modify | `findUnendedWorkOrderLevelShiftsForStaff()` |
| Line writer paths (create, canned line, change, assign, clock-in subscriber, task move/change, split) | Modify | Set `tech_assignment_origin` (`inherited` when it follows the lead, otherwise `explicit`) |
| `api/src/Shared/Infrastructure/Validator/Constraints/IsOrganizationStaffIdentifier.php` | Create | Organization-ownership constraint for inbound technician ids |

#### Frontend changes (`app/`) **[pair]**:
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/work-orders/WorkOrder.vue` / `app/src/components/shared/OrderStatusCard.vue` | Modify | Add Declined to the lead lock so the detail page matches the server |
| Asset-on-site toggles (`WorkOrders.vue`, `OrderStatusCard.vue`, `VehicleWorkOrdersTab.vue`) | Modify | Stop sending `tech_assigned_id` — today a stale value can silently undo another user's lead change with no audit entry |

#### Unit / integration tests:
- Allowed statuses vs locked (Invoiced, Paid, Declined) for assign, reassign and remove; same lead returns null even when locked; null status fails open.
- Changer: unchanged → no line fetch/history/cleanup/clearing; clearing only with the flag and a previous lead; a clearing failure propagates before any history; exactly one history call; foreign-organization technician fails before any write.
- Functional: 6 line states × {assign, reassign, remove} = 18 cases, plus active clock-in with zero prior labor; one `work_order.lead_tech.changed` row with the actor; status and labor unchanged (S4-R20, S4-R21); 409 on both endpoints for locked statuses; `/change` with the same lead on an invoiced work order still returns 201; shift clearing keeps ended shifts, line-level shifts and other staff's shifts; an own-data-restricted role gets 403 and nothing is deleted.
- **S4-R18** — changing a technician directly on a line still writes its own line-audit entry (the eight origin-writer paths must not disturb existing line auditing).
- **S4-R19** — creating, moving and deleting a schedule shift leaves the work order's lead technician unchanged. This phase adds a repository method to the Schedule context, which is exactly where that guarantee could regress.

#### Verification:
- **Migration gate:** `doctrine:migrations:migrate`, then `doctrine:migrations:diff --allow-empty-diff` reports "No changes detected"
- **Static (scoped)**, **Smoke** (`bin/smoke-test.sh`, no 500s), BE logs free of fatals
- **Browser-walk:** change the lead on the detail page (allowed status) → lines follow per the table; a Declined work order shows the lock; an invoiced work order's asset-on-site toggle still saves

#### E2E tests (`e2e/`):
No new spec (the 18-case matrix is backend-functional; E2E takes one representative case in Phase 9). Reference work, mandatory:
- `e2e/src/api/factories/work-order.factory.ts` — `setLeadTechnician` must throw a named `LeadTechnicianLockedError` on 409, and its docblock must state the lock statuses so future seeds set the lead **before** invoicing.
- `e2e/tests/permissions/wo-detail-card-permissions.spec.ts` — narrow the `try/catch` around that call so a 409 fails the test instead of silently disabling the read-only assertion.

---

### Phase 4: Preferences, display switcher shell, density, default filter view, mobile guard
**Implements:** S1-R2, S1-R4, S1-R9, S1-R10, S1-N2, S1-N3, S1-N4, S1-E1, S5-N2, S5-N3, S5-E2, S5-E6, S6-R1–R7, S6-N2, S6-E1, NFR-012 — **S1-R1 and S1-R3 land in Phase 9**, when the switcher first offers all three options; S1-N1's shared empty state is wired per display in Phases 7 and 8
**Depends on:** Phase 2

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/work-orders/WorkOrdersBoardModel.ts` | Modify | Preference gains optional `display`, `density`, `kanbanFields`, `pinnedTechnicianIds` (≤3), `technicianOrder`, `collapsedGroups` — old blobs still parse |
| `.../displays/composables/workOrdersPreference.ts` | Create | Pure normalise/migrate/fallback (`default` / `saved` / `fallback`), compact id encoding, budget guard under 16 KB, `moveWithVisibleAnchor` |
| `.../displays/toolbar/DisplayOptionSwitcher.vue` | Create | `q-btn-toggle`, `data-test-id="display_option_<value>"`, active state via `aria-pressed` (S1-R9). Offers **only List** until Phase 9 completes both board displays |
| `.../displays/toolbar/DensityMenu.vue` + `displays/density.scss` | Create | Compact / Regular / Comfortable tokens for List rows, Tech View rows and Kanban cards. Regular equals today's metrics exactly. Compact shrinks spacing, never type (S6-R4) **[design UX-14]** |
| `.../displays/composables/useWorkOrdersViewState.ts` | Create | Shared-link visits still persist layout preferences; after a failed preference load the next save re-reads and merges instead of overwriting saved columns/pins/order (S5-N3) |
| `app/src/composables/usePagePreferences.ts` | Modify | Additive `onPersisted` callback (feeds the cache update and the S12 events) |
| `.../displays/WorkOrdersPageBody.vue` (mobile guard) | Create | Below the desktop breakpoint the existing mobile List always renders; switcher, density control and pickers are hidden; **nothing writes `display`**, so a phone visit cannot strand a user in a display they cannot see. This is the interim state Phase 13 refers to |
| `.../displays/constants.ts` (dev display override) | Create | Dev-only `?display=kanban\|tech_view` parameter, guarded by `import.meta.env.DEV` so it is compiled out of production, used only for the Phase 7–8 browser-walks (Section 3.17). It **never writes the preference**, so it cannot leak a display into a developer's saved settings (Section 3.19) |
| `.../displays/list/workOrderColumns.ts`, `displays/toolbar/WorkOrdersToolbar.vue` (financial gate) | Modify | Without the financial permission, dollar-bearing **filter options are not offered and saved dollar-bearing filters are neither applied nor revealed**, matching the existing column/field gating (S5-E2, S5-E6) |

First-visit default filter view becomes Work Orders; the URL default stays All so old shared links without `?tab` keep their meaning (Section 3.20). The shared `FilteredTableEmptyState` is lifted so every display can render it (S1-N1, wired per display in Phases 7–8) **[design UX-6]**. Phone and tablet behaviour is Phase 13.

#### Unit tests:
Legacy blob without new keys; invalid values fall back; source reported as default/saved/fallback; pins deduped and capped at 3; financial field hidden without permission; both S9-E2 examples through `moveWithVisibleAnchor`; budget trimming; save failure keeps the local choice and retries; layout persists during a shared-link visit while the link's tab and filters do not; first visit lands on Work Orders while a URL without `?tab` still means All; density class switches while the visible column set stays identical (S6-R6); saved dollar-bearing **filters** are not applied and not revealed when the financial permission is off (S5-E2, S5-E6); below the desktop breakpoint the mobile List renders, no switcher/density/picker is shown and `display` is never written; the dev-only `?display=` parameter selects a display without persisting it and is absent from a production build.

#### Verification:
- **Static (scoped)**, **Compile**
- **Browser-walk:** density across List; reload keeps it; a new user (no preference) lands on Work Orders; an existing user keeps their tab; a shared link without `?tab` still opens All

#### E2E tests (`e2e/`):
- **Mandatory reference fix — highest cross-spec risk in this plan.** `resetSavedWorkOrderFilters()` (`e2e/src/pages/work-orders/work-orders-filter-bar.page.ts`) and its browser-side twin in `work-orders.page.ts` do a read-modify-write that preserves unknown keys. Once `display`, `density`, `kanbanFields`, `pinnedTechnicianIds`, `technicianOrder` and `collapsedGroups` exist, one spec that switches display **leaks it into every later spec running as the same admin**, and every List spec then finds no table. Both helpers must reset `display` to `list` and clear pins/order in the same write.
- `e2e/tests/ui/work-order-list.spec.ts` — the top-level `beforeEach` and the mobile-sort `beforeEach` must pin the tab (or call the reset helper) before `goto('/workorders')`: seven tests plus four mobile-sort tests assume the landing view is All and will otherwise fail on an org whose seeds are estimates. While there, drop the `if (alphaIndex !== -1 && zetaIndex !== -1)` guard that makes three of those assertions vacuous.
- **New spec** `e2e/tests/ui/work-orders/display-option-persistence.spec.ts` covers S1-R1/R3/R4/R9/R11 and S1-N2 — but a switcher with one option asserts nothing, so it lands in the **Phase 9** run (see Section 7).
- Backlog for this run: density persistence.

---

### Phase 5: Avatar group, Reassign dialog, List more-actions
**Implements:** S7 (all), S10 (all), S4-R4, S4-R5, S4-R12–R16, S4-N1, S4-N6, S4-N8, S4-N4, S4-E4, S4-E8, NFR-007
**Depends on:** Phases 2–4

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `api/src/VehicleService/WorkOrders/UI/HTTP/LeadTechnician/ListLeadTechnicianCandidatesController.php` + query/handler/DTOs | Create | Eligible technicians + `openCount` (MF-3) in one statement |
| `api/src/VehicleService/WorkOrders/Infrastructure/Persistence/Query/Dbal/LeadTechnicianEligibilityPredicate.php` | Create | One eligibility fragment shared with the board |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/shared/AvatarGroup.vue` | Create | Lead first, deduped, `+N` overflow with names reachable, per-avatar hover target, fixed max per density **[design UX-22]** |
| `.../work-orders/leadAssignmentRules.ts` | Create | `LOCKED_LEAD_STATUSES`, `canReassignLead`, lock reason copy **[design UX-17]** |
| `.../displays/shared/WorkOrderMoreActions.vue` | Create | Hover/focus overlay menu; hidden without create-and-edit; disabled with reason when locked |
| `.../displays/dialogs/ReassignLeadTechnicianDialog.vue` | Create | `BaseFormDialog`, search, Unassigned option, lazy `N open` counts, inactive current lead shown disabled. Option ids bind to the technician id (`option_lead_technician_<id>`, `option_lead_technician_unassigned`) because S2-R3 explicitly contemplates identical names **[design UX-15, UX-18]** |
| `.../displays/list/workOrderColumns.ts` | Modify | `technician` column renders the avatar group; new `actions` column appended **last** so E2E positional selectors do not shift |
| Toast helpers (call sites) | Modify | Success and failure notifications carry `toast_lead_technician_updated` / `toast_lead_technician_removed` / `alert_lead_technician_failed` test ids, so specs do not assert on copy |

#### Unit tests:
Avatar group (lead first, dedupe across lines, `+N`, empty, per-avatar tooltip); dialog (counts only after opening, search, same lead makes no request, success copy for updated vs removed, failure alert is user-dismissible and suppresses the generic toast, double confirm sends one request); more-actions (hidden without permission, disabled reason per locked status, click does not bubble); row removed when the server says it no longer matches (S10-E1).

#### Verification:
- **Static (scoped)**, **Smoke**, **Compile**
- **Browser-walk:** reassign from a List row as `admin` (toast, row updates); the same as `tech` (action hidden); an invoiced row shows the disabled reason

#### E2E tests (`e2e/`):
- **New:** `e2e/tests/ui/work-orders/reassign-lead-from-list.spec.ts` (P3) — S10-R1/R2/R3, S10-N1, S10-E1, S4-R4, S4-R12–R14, S4-R5, S4-N2, S4-N6. Happy path: open a row's more-actions, reassign, toast appears and the Lead Technician cell updates without reload. Edges: cancel changes nothing; an Invoiced row shows the action disabled with its reason. Setup note: `createInvoicedWo` must set the lead **before** invoicing or the new 409 fires during seeding.
- Register the new spec in `e2e/playwright.config.ts` — the `workorders` project lists files explicitly, so an unlisted spec never runs in CI.
- Backlog for this run: line-technician avatars against the real enricher.

---

### Phase 6: Board data (read path)
**Implements:** S2-R3, S2-R7, S2-R14, S2-N2, S3-R1, S3-R9, S3-N2, S4-E7, NFR-001, NFR-002, NFR-005, NFR-006
**Depends on:** Phases 2, 3 (position table), 5

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `.../Infrastructure/Persistence/Query/Dbal/DbalBoardTechnicianFetcher.php` (+ interface) | Create | Eligible technicians ∪ leads with matching work, one statement, S2-R3 order (first name, last name, `user.created_on` NULLs last, `staff.id`), `userId` + `hasAvatar` |
| `.../UI/HTTP/Board/ViewWorkOrderBoardController.php` + request DTO | Create | `groups[]` ≤ 12, `fill`, `perGroup` 1–100 |
| `.../UI/HTTP/Board/ListWorkOrderBoardItemsController.php` + request DTO | Create | Batched continuation with per-group offset/limit |
| `.../Application/Query/Board/*`, `.../Application/Handler/Board/*`, `.../Application/DTO/Board/*` | Create | Query, handlers, assembler, DTOs |
| `.../Infrastructure/Persistence/Query/Dbal/DbalWorkOrderBoardFetcher.php` | Create | The windowed statement; reuses the criteria applier and the enricher |
| `.../Domain/Model/WorkOrderBoardPosition.php` + `.../Infrastructure/Doctrine/Model/WorkOrderBoardPosition.orm.xml` | Create | Mapping (the SQLite test schema is built from mappings); writes via DBAL |

```sql
-- api/src/VehicleService/WorkOrders/Infrastructure/Persistence/Query/Dbal/DbalWorkOrderBoardFetcher.php
-- counts, adaptive threshold and the per-group page in ONE statement
SELECT ranked.lead_id, ranked.rn, ranked.group_count, ranked.total_count, <List projection + techAssignedId, v.year>
FROM (
  SELECT wo.id, wo.tech_assigned_id AS lead_id,
         ROW_NUMBER() OVER (PARTITION BY wo.tech_assigned_id
            ORDER BY CASE WHEN bp.sort_key IS NULL THEN 1 ELSE 0 END, bp.sort_key, c.name, wo.id) AS rn,
         COUNT(*) OVER (PARTITION BY wo.tech_assigned_id) AS group_count,
         COUNT(*) OVER ()                                 AS total_count
  FROM work_order wo
  INNER JOIN workplace w ON w.id = wo.workplace_id
  INNER JOIN company   c ON c.id = wo.company_id
  INNER JOIN vehicle   v ON v.id = wo.vehicle_id
  LEFT JOIN work_order_board_position bp
         ON bp.user_id = :boardUserId AND bp.work_order_id = wo.id
        AND (bp.technician_id = wo.tech_assigned_id OR (bp.technician_id IS NULL AND wo.tech_assigned_id IS NULL))
  WHERE <WorkOrderListingCriteriaApplier: type, workplace, organization, filters, search, showMyWorkOrders>
) ranked
INNER JOIN work_order wo ON wo.id = ranked.id  /* + the List's joins for the wide projection */
WHERE ranked.total_count <= :threshold          -- adaptive: every row is an item
   OR ranked.rn = 1                             -- one row per group carries its count for the header
   OR (ranked.rn <= :perGroup AND ranked.lead_id IN (:requestedGroups))
ORDER BY ranked.lead_id, ranked.rn
LIMIT :safetyCap;
```

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `app/src/api/work-orders/LeadBoardModel.ts`, `leadBoardQueries.ts`, `leadBoardCache.ts` | Create | Wire types, query options, pure optimistic-patch helpers |
| `.../displays/composables/useLeadBoard.ts` | Create | Group ordering (Unassigned, pins, saved order, then server default), batched continuation loader (≤ 6 groups, 120 ms debounce, abort on scope change, late responses discarded) |
| `app/src/testing/handlers.ts` | Modify | MSW stubs for the new endpoints |

Pins, order, collapse and density are read untracked so they never enter a query key (NFR-012).

#### Unit / integration tests:
- BE: **S1-R11 parity** — for 5 criteria combinations the id set across board groups in all-mode equals `GET /api/work-orders?pagination[rowsPerPage]=1000`; all-mode vs partial with a test threshold; in-group order (ranked, stale row ignored, another user's rows ignored, then default sort); tenancy (other workplace and foreign organization excluded); pricing zeroed without the permission; **statement-count delta equal** for 2 groups × 3 items and 6 groups × 20 items.
- FE: ordering; loader batches 8 requests into 2 calls; key change aborts and discards; merge after a refetch discarded; pin/order changes never re-key.
- **S4-E7** — after two users reassign the same work order, a refresh shows both of them the same final lead: the board read is authoritative and no cached group keeps a superseded lead (functional on the read path, plus a frontend test that a refetch replaces an optimistic entry).

#### Verification:
- **Static (scoped)**, **Smoke**, **Migration gate** if Phase 3's migration is not yet applied in the environment
- **API check:** `GET /api/work-orders/board` for a seeded location returns groups + counts; the profiler log shows ≤ 8 statements

---

### Phase 7: Kanban (read-only) + Fields to display
**Implements:** S3-R2–R9, S3-R11–R21, S3-N1, S3-N3, S3-N4, S3-E1–E5, S1-N1 (Kanban), S5-R2, S5-R3, S5-R5, S5-R9, S5-R10, S5-R11, S5-R13, S5-N1, S5-E1, S5-E3, S5-E4, S5-E5, NFR-004
**Depends on:** Phase 6

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `.../displays/kanban/WorkOrdersKanbanDisplay.vue` | Create | Fixed Unassigned pane + horizontally virtualised technician columns (only ~6–10 of 66 in the DOM), `data-test-id="kanban_board"`, `:data-loading` **[design UX-11]** |
| `.../displays/kanban/KanbanColumn.vue`, `KanbanColumnHeader.vue` | Create | Own scroll container per column with the header outside it (headers stay pinned); **dynamic item sizing** so a taller card is never unreachable (S3-E4, Section 3.16), keeping roughly 20 cards mounted in the ~8,200-card Unassigned column (NFR-004); pin control with the 3-pin rule — pinning hidden while "Assigned to me" is on (S3-N3), new pins appended after existing ones (S3-R16), a pinned technician kept after deactivation and still unpinnable (S3-E3, S3-E5); inactive badge; "No work orders" empty state; a dedicated count element (`kanban_column_count_<key>`) so the count is assertable without text matching **[design UX-4, UX-9]** |
| `.../displays/kanban/WorkOrderKanbanCard.vue`, `kanbanFields.ts` | Create | Mandatory number + status (fixed position) + unit with asset fallback; optional fields; zero is a value; financial gating; avatar group; more-actions overlay on hover/focus **[design UX-13]** |
| `.../displays/toolbar/VisibilityPicker.vue` | Create | Kanban "Fields to display" using the existing column-picker pattern and ids. **Default selection (S5-R13):** lead technician name, work order number, customer, unit number, asset, progress, total price, plus mandatory status — total price only with the financial permission **[design UX-12]** |
| `.../displays/kanban/WorkOrdersKanbanDisplay.vue` (empty states) | Create | Shared filtered-empty state for the whole board, distinct from a column's "No work orders", and a first-use state when the organization has no technicians at all **[design UX-5, UX-6]** |

**Optional-field reconciliation (S5-R11).** Before building the picker, map each of the 13 optional fields to a real source and record the result in the PR: lead technician name, customer, asset (year/make/model), VIN/serial, progress, service advisor, line count, estimated hours, total price, on-site indicator and created date all exist on the board item; **line technicians** arrives with the Phase 2 enricher; **"clocked-in time" has no production meaning** — today the List shows clocked-in technician *names* (Section 12.8). Do not invent a duration.

#### Unit tests:
Unassigned outside the scroller and hidden with Assigned-to-me; pins first and new pins appended last (S3-R16); pinning unavailable while Assigned-to-me is on (S3-N3); filtered-empty state distinct from an empty column and from a no-technicians organization; only mounted columns request items; one request per batch; 4th pin disabled with the exact copy; a deactivated pinned technician keeps its column and can be unpinned (S3-E3, S3-E5); a card taller than the estimate stays fully scrollable in a virtualised column (S3-E4); mandatory fields always shown; the S5-R13 default set; unit fallback and both-missing; zero vs missing; price hidden without permission; card click navigates while more-actions does not.

#### Verification:
- **Static (scoped)**, **Compile**
- **Browser-walk:** Kanban is not in the switcher until Phase 9, so open it through the dev-only `?display=kanban` parameter (Section 3.17) on a seeded large location — horizontal scroll across 66 columns, Unassigned stays fixed, headers stay pinned, pin/unpin, field picker; network tab shows 1 board request + batched continuations

#### E2E tests (`e2e/`):
- **New:** `e2e/tests/ui/work-orders/kanban-board-grouping.spec.ts` (P3) — S3-R1, S3-R2, S3-R12, S3-R9, S3-R20, S2-R7, S1-R11, S1-N1. Happy path: three work orders (lead A, lead B, no lead) land in the right columns with matching header counts, Unassigned stays fixed while scrolling. Edges: an eligible technician with no work still gets a column with its empty state; a filter matching nothing shows the shared empty state, not per-column empties.
- **Loading-signal contract E2E depends on** (no precedent exists in the suite, so state it in the PR): `data-loading="true"|"false"` is **always present** on the board root — never presence/absence, which a fast response can skip — and `data-items-loaded` likewise on each column, covering both the first board load and continuations.
- Backlog for the Phase 7 run (below the cap): board pins persistence, Kanban fields picker persistence.

---

### Phase 8: Tech View (read-only) + shared row extraction
**Implements:** S2-R1, S2-R2, S2-R4–R6, S2-R8–R13, S2-R15, S2-R16, S2-N1, S2-N3, S2-E1, S2-E2, S1-N1 (Tech View), S5-R1, S5-R4, S5-R7, S5-R8, S5-R12
**Depends on:** Phase 6 (row extraction lands as its own PR first)

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `.../displays/shared/WorkOrderTableRow.vue` | Create | **Own PR.** Identical DOM to today's List cells (td order, classes incl. `cursor-pointer`, test ids); List switches to it |
| `.../displays/tech-view/WorkOrdersTechViewDisplay.vue` | Create | Flattened virtual rows (group header / item / placeholder / empty / "Show N more"), List columns + chooser, header sorting off; renders the same shared `FilteredTableEmptyState` as List and Kanban when nothing matches, distinct from a group's own "No work orders" (S1-N1, S2-R15) **[design UX-6, UX-7]** |
| `.../displays/tech-view/TechViewGroupHeaderRow.vue`, `TechViewStickyGroupHeader.vue` | Create | Collapse control, count (as its own `tech_view_group_count_<key>` element), avatar, inactive marker, **pin control sharing Kanban's 3-pin state (S2-R11)**; hover reveals the technician's name (S2-R10); sticky overlay showing the group of the first visible row **[design UX-2, UX-3, UX-8, UX-10]** |

#### Unit tests:
Row flattening; Unassigned first and hidden with Assigned-to-me; a filter matching nothing shows the shared empty state rather than a screen of empty groups (S1-N1); collapsed groups render only a header and request nothing; "Show more" triggers one batch; chooser hides columns; sticky overlay tracks the first visible row; pins shared with Kanban and capped at 3 (S2-R11); a lead changed elsewhere appears under its new group on the next refresh (S2-E2); **DOM parity** of the extracted row against the List fixture.

**DOM parity is an E2E contract, not a nicety.** `WorkOrderTableRow.vue` must keep: `cursor-pointer` on the `<tr>` (Quasar adds it automatically today only because `@row-click` is bound — a custom `#body` row loses both that class and the click wiring unless re-added); the `cell <column-name>` classes, specifically `company-name`, `number`, `status`, `is-vehicle-here`; `@click.stop` on the Asset/VIN/Unit cells with a click path from Customer/Number reaching the row handler; and the current column order `vehicleHere(1) · status(2) · rawNumber(3) · companyName(4) · vehicle(5) · unit(6) · vin(7) · progress(8) · serviceAdvisor(9) · technician(10) · clockedInTechnicians(11) · linesCount(12)` with `actions` strictly last. Six E2E locators depend on exactly this list; make it the parity test's assertion set.

#### Verification:
- **Static (scoped)**, **Compile**
- **Browser-walk:** Tech View is not in the switcher until Phase 9, so open it through the dev-only `?display=tech_view` parameter (Section 3.17) — grouping, collapse (persists across reload), load-more inside a big group, column chooser shared with List. Also re-walk the List after the row extraction: rows still open on click, asset-on-site still toggles.

#### E2E tests (`e2e/`):
- **New (promoted from backlog — a whole shipped display must not ship uncovered):** `e2e/tests/ui/work-orders/tech-view-grouping.spec.ts` (P3) — S2-R1, S2-R2, S2-R5, S2-R12, S2-R13, S2-E1. Happy path: the table groups under each lead with counts, Unassigned first; collapse a group and reload — it stays collapsed.
- The List's own specs are the regression net for the row extraction; they must pass **unchanged**.

---

### Phase 9: Drag and drop, board move, shift prompt
**Implements:** S1-R1, S1-R3, S4-R1, S4-R7, S4-R11, S4-N3, S4-N5, S4-N7, S4-E3, S9 (all), S10-R3, S11-R5 (drag cancel), NFR-011
**Depends on:** Phases 3, 6, 7, 8

#### Backend changes (`api/`):
| File | Action | Description |
|---|---|---|
| `.../UI/HTTP/Board/MoveWorkOrderOnBoardController.php` + request DTO | Create | Anchor + placement together or not at all; organization-checked technician id |
| `.../Application/Handler/Board/MoveWorkOrderOnBoardCommandHandler.php` | Create | Changer (locks + refreshes) → reposition-allowed assert when the lead did not change → positioner, in one transaction |
| `.../Application/Service/Board/WorkOrderBoardPositioner.php`, `Domain/Model/{BoardSortKey,BoardPlacement,BoardAnchor}.php` | Create | Sparse keys, prefix materialisation for an unranked anchor (chunked inserts, no `INSERT…SELECT` to avoid next-key locks), one rebalance retry |
| `.../Domain/Repository/WorkOrderBoardPositionRepository.php` + DBAL implementation | Create | Reads always bind the user and join `work_order` with both tenant predicates |

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `.../displays/drag/useBoardDrag.ts`, `BoardDragGhost.vue`, `boardDropRules.ts` | Create | Pointer-events drag: threshold (SQ-10) exported as a named constant and documented so tests can exceed it deterministically, rAF auto-scroll, Escape cancels, click suppressed after a drag; permission/status/inactive-destination rules; **technician-group drags stay inside their area — pinned technicians reorder only among pins, and Unassigned is never a technician drop target (S9-R8, S9-R9)**; a stable per-column drop zone element distinct from the scroll container (Playwright's `dragTo()` cannot drive a pointer-events handler); anchor resolved at drop time |
| `.../displays/composables/useLeadBoardMove.ts` | Create | Optimistic move with inverse patch on failure, authoritative reconcile on success, toasts per PRD §9, no board refetch |
| `.../displays/dialogs/ClearShiftsPrompt.vue` | Create | Keep / clear choice (`dialog_clear_shifts`, `button_clear_shifts_keep`, `button_clear_shifts_confirm`), shown only when the outgoing lead has open work-order shifts. **Wired into both lead-change paths on the board** — the drag flow *and* the card/row Reassign dialog when it is opened from Tech View or Kanban, since both are "changing the lead technician in Kanban or Tech View" (S4-R11); the List dialog never prompts (S10-R3) **[design UX-21]** |
| `.../displays/toolbar/DisplayOptionSwitcher.vue` | Modify | Tech View and Kanban become selectable here — this is where S1-R1 (all three options offered) and S1-R3 (switching re-lays out the same results without touching the filter view, search or filters) are finally delivered; the dev-only `?display=` parameter is removed |
| `.../displays/drag/useBoardDrag.ts` (touch) | Modify | Drag is not started for touch pointers until UX-20 lands; on touch devices the more-actions overlay is always visible and reassignment goes through the dialog (see Phase 13) |

#### Unit / integration tests:
- BE functional: both confirmed S9-E2/E3 examples with hidden items; ranked anchor before/after; forced rebalance; prefix includes hidden work orders and excludes the moved one; reorder writes no audit row (S9-R15); move between technicians changes the lead, moves lines, writes one audit row, honours `clearShifts`; drop on Unassigned removes the lead; 409 for locked statuses on both reorder and move; foreign anchor 404; view-only role 403.
- FE: all three options appear in the switcher and switching preserves tab, search and filters (S1-R1, S1-R3); a touch pointer never starts a drag; under/over threshold; Escape; optimistic counts before the response; rollback on failure; card removed when it no longer matches; two concurrent moves where the first fails leave the second intact; prompt only when the outgoing lead has shifts, and on the dialog path as well as the drag path (S4-R11); a pinned technician cannot be dragged out of the pinned area (S9-R9); reordering inside one technician shows no toast (S9-R15) and leaves List's saved sort untouched (S9-R13).

#### Verification:
- **Static (scoped)**, **Smoke**, **Compile**
- **Browser-walk:** drag within a technician (no toast), across technicians (toast + counts update + lines follow), onto Unassigned, onto an inactive column (rejected), an invoiced card (not draggable), a failed move (card returns, dismissible alert); the switcher now offers all three displays, so walk the full switch cycle and confirm the dev-only `?display=` parameter is gone from production builds

#### E2E tests (`e2e/`):
- **New:** `e2e/tests/ui/work-orders/kanban-drag-reassign-lead.spec.ts` (P3) — S9-R1/R5/R6, S4-R1, S4-R5, S4-R7, S4-R8, S4-E6, NFR-011. Happy path: drag a card from technician A to B — it lands, the toast appears, both counts update, and a reload confirms the lead and the moved line. Edges: dropping on Unassigned removes the lead and returns the following line to unassigned; a line explicitly assigned to a third technician does **not** move (the end-to-end proof of the MF-2 origin work).
- **New:** `e2e/tests/ui/work-orders/lead-change-clear-shifts.spec.ts` (P4 — a wrong branch here deletes real scheduled time) — S4-R11, S4-R21, S4-R22, S4-R23, S4-R24. Keep retains the shift; Clear removes only the whole-work-order shift; a line-level shift on the same work order survives both.
- **New:** `e2e/tests/ui/work-orders/display-option-persistence.spec.ts` (P3, deferred from Phase 4 because the switcher only had one option) — S1-R1/R3/R4/R9/R11, S1-N2, including a second browser session to prove the preference is server-side.
- Drag is driven with `mouse.move/down/move/up` past the exported threshold, never `dragTo()`.
- Register all three specs in `e2e/playwright.config.ts` — consider a dedicated `workorders-displays` project (admin auth only, keeps the shard inside the 60-minute auth TTL).
- Backlog for this run: board manual-order persistence.

---

### Phase 10: Google Analytics — events **and** the reports they exist for
**Implements:** S12 (all)
**Depends on:** Phases 4, 7, 8, 9 (S12-R1 measures display switches, which only exist from Phase 9)

| File | Action | Description |
|---|---|---|
| `app/src/composables/useGoogleAnalytics.ts` | Modify | Additive `trackParamsEvent(name, params)` guarded by `window.gtag` |
| `.../displays/composables/useWorkOrdersAnalytics.ts` | Create | `wo_display_viewed`, `wo_field_exposure`, `wo_field_changed`, `wo_density_changed` per the event contract on the review page; predefined keys only; failures never throw |

**Reporting deliverable (S12-R4, S12-R10, S12-R11, S12-R12, S12-R13).** Five of Story 12's requirements define *reports* and reporting rules, not events, and shipping emitters satisfies none of them. This phase also delivers, in the analytics property rather than the repo:
- weekly display usage by **distinct** users (S12-R4, S12-R13 — repeated events from one user must not inflate the denominator);
- field selection rate per available field and display, as distinct selecting users ÷ distinct exposed users (S12-R10);
- density distribution (S12-R11);
- default / saved / fallback cohorts reported separately (S12-R12).
Each needs a named owner (product analytics, not engineering) and a sample calculation checked against a seeded week (S12-E2). The plan cannot mark Story 12 done on emitters alone; record the exploration links in the verification ticket.

**Tests:** first use / restored / fallback sources; no event on refetch or continuation; no financial exposure without permission; change events only after a successful save; three toggles in one debounce give three events and one PUT; missing `gtag` does not throw; a sample reporting calculation reproduces the expected rate from a seeded event set (S12-E2).
**Verification:** static (scoped); browser-walk with GA debug mode — events fire once per view; the four report definitions exist and their sample numbers match the seeded week.

#### E2E tests (`e2e/`):
None. Analytics is fully observable with a stubbed `window.gtag`, so it belongs in frontend unit tests (`coverage-policy.md` gate 3).

---

### Phase 11: Keyboard and focus
**Implements now:** S11-R2, S11-R7, S11-R8, S11-N1 (S11-R5's Escape-cancels-drag is built in Phase 9 and only verified here) · **Blocked on design UX-19 / SQ-15:** S11-R1, S11-R3, S11-R4, S11-R6, S11-R9, S11-R10, S11-E1, S11-E2
**Depends on:** Phases 5–9

#### Frontend changes (`app/`):
| File | Action | Description |
|---|---|---|
| `.../displays/shared/WorkOrderMoreActions.vue`, `displays/kanban/KanbanColumnHeader.vue`, `displays/tech-view/TechViewGroupHeaderRow.vue`, `displays/toolbar/*` | Modify | Every control is a real button with an `aria-label`; the more-actions overlay reveals on `:focus-within`; pin and collapse are keyboard-reachable (S11-R2, S11-R7, S11-R8) |
| `.../displays/drag/useBoardDrag.ts` | Verify | Escape already cancels an in-progress drag (built in Phase 9, S11-R5) — no change, covered by this phase's keyboard walk |
| `.../displays/dialogs/ReassignLeadTechnicianDialog.vue` | Modify | The dialog is the keyboard path for moving work between technicians; it runs the same permission and status checks as the pointer path (S11-N1) |

**Tests now:** more-actions opens with Enter and Space; the overlay is visible on focus; a keyboard-initiated reassign is refused for a locked status and without permission (S11-N1).

**Waits on design UX-19 / SQ-15** — do not guess these: how focus enters cards and rows (roving tabindex; do not put `tabindex` on hundreds of rows) (S11-R1, S11-R3), what Enter activates (S11-R4), where focus returns after a dialog closes (S11-R6), keyboard reorder and reassign (S11-R9), how opening a work order coexists with dragging for keyboard users (S11-R10), and focus recovery when a card leaves the filter or a technician becomes inactive (S11-E1, S11-E2).

#### Verification:
- **Static (scoped)**; **browser-walk** with the keyboard only: reach the more-actions menu, pin, collapse and the Reassign dialog; Escape cancels a drag.

#### E2E tests (`e2e/`):
None yet — no keyboard semantics can be asserted before UX-19/SQ-15 define them. This silence is a block, not a judgement that coverage is unnecessary; the Phase 11 run revisits it once the design lands.

---

### Phase 12: Performance validation
**Implements:** V-1, NFR-013, and the desktop half of V-2 (the phone/tablet half is Phase 13)
**Depends on:** Phases 6–9

| File | Action | Description |
|---|---|---|
| `api/src/VehicleService/WorkOrders/UI/CLI/SeedWorkOrderBoardPerformanceFixtureCommand.php` | Create | Dev/QA only: 9,000 work orders (164 open, 369 estimates, 372 complete, rest invoiced/paid), 66 technicians, 8,200 unassigned, one lead with 504, lines + labor + roster rows |
| `api/src/Shared/Infrastructure/Profiler/EventSubscriber/RequestProfilerSubscriber.php` | Modify | Merge an optional `_profiler_context` so board routes log `matchingTotal`, `itemsMode`, `groupsLoaded`, `itemsReturned`, `materializedRows` — same log line, no extra volume |

**Gates (run on MySQL, not SQLite):** `EXPLAIN ANALYZE` for All/partial, All/search and the Work Orders tab — no full scan of `work_order` beyond the workplace range, window sort < 50 ms; 200 sequential + 10 concurrent requests per scenario; statement-count invariants from Phases 2 and 6.

**Targets (server time, p95, largest-location fixture):**

| Scenario | p95 | Statements |
|---|---|---|
| `GET /board`, Work Orders view (≤164, all items) | ≤ 300 ms | ≤ 8 |
| `GET /board`, All, partial | ≤ 500 ms | ≤ 8 |
| `GET /board`, All with search | ≤ 700 ms | ≤ 8 |
| `GET /board/items` (6 × 25) | ≤ 300 ms | ≤ 7 |
| `POST board-move`, no materialisation | ≤ 250 ms | — |
| `POST board-move`, materialising ~8.2k rows | p99 ≤ 1 s | — |
| `GET lead-technician-candidates` | ≤ 100 ms | 1 |
| `GET /api/work-orders` (List) | ≤ Phase 2 baseline + 10% | ≤ 7 |

Frontend targets: ≤ 200 mounted Kanban cards, ≤ 4,000 board DOM nodes, ≥ 55 fps horizontal scroll with no long task > 50 ms, drag frame ≤ 16 ms, gzipped board payload ≤ 80 KB for the Work Orders view.
**V-2 (partly):** also exercise a one-to-two-person shop and the QA clones of the two named large shops, including the empty and overflow states on desktop. **The phone/tablet half of V-2 is Phase 13 and is blocked on design.**

#### E2E tests (`e2e/`):
None. Performance gates are measured, not asserted in Playwright.

---

### Phase 13: Phone and tablet — blocked on design (UX-20)
**Implements:** V-2 (phone/tablet half)
**Depends on:** Phases 4, 7, 8, 9 — **and on design UX-20, which does not exist yet**

The PRD requires phone and tablet layouts (V-2: "Include desktop, phone and tablet designs and empty/overflow states"), and the review page tracks them as UX-20, still open with the designer. No design means no honest build, so this phase records what ships in the meantime and what is still owed:

**Interim behaviour, already built elsewhere in this plan** (deliberately *not* V-2):
- **Phase 4** ships the mobile guard: below the desktop breakpoint the existing mobile List renders, the switcher/density/pickers are hidden, and `display` is never written, so a phone visit cannot strand a user in a display they cannot see.
- **Phase 9** ships the touch rules for landscape tablets at desktop widths: drag never starts for a touch pointer, the more-actions overlay is always visible where hover does not exist, and reassignment goes through the dialog.
- **Phase 5** makes avatar names reachable through the overflow menu rather than hover alone (S7-R6).

**Owed once UX-20 lands:** phone and tablet layouts for both new displays, how the fixed Unassigned column coexists with a technician column on a narrow screen, where the scroll regions are, touch access to every hover-only control, and the empty/overflow states at those widths. Story 7's hover-to-reveal names (S7-R6) need the same treatment.

**Verification when unblocked:** browser-walk both displays at phone and tablet widths in portrait and landscape, with an empty group, a no-technicians organization and an overflowing Unassigned column.

---

## 7. Testing Strategy

### Unit tests (`api/` and `app/`)
- **Backend:** lead-change guard matrix, the changer's orchestration, progress calculator, board sort keys, positioner branches, board assembler grouping.
- **Frontend:** preference normalisation/migration/budget, visible-anchor move maths, board cache patches, drag threshold and drop rules, analytics emission, avatar group composition.
- **Edge cases to watch:** zero vs missing values (S5-E4), a work order with no lines, identical technician names, a lead who is inactive, concurrent moves, an active clock-in with no prior labor.

### Integration tests
- **API ↔ DB:** the S1-R11 parity test (board ids = List ids for the same criteria) is the single most valuable test in this plan; statement-count invariants; tenancy exclusions; the 18-case line-movement matrix; shift-clearing scope.
- **Frontend ↔ API:** MSW-backed tests for board loading modes, batched continuation, abort semantics and optimistic move reconciliation.

### Manual testing checklist
1. List behaves exactly as before (filters, search, sort, columns, mobile infinite scroll).
2. Back from a work order restores scroll with no refetch; after a change it refetches.
3. Switch location — exactly one list request.
4. Density across all three displays; text never smaller than the app minimum.
5. Kanban: fixed Unassigned, pinned headers, pin cap message, empty and inactive states.
6. Tech View: collapse persists, load-more, shared columns.
7. Drag: within, across, to Unassigned, rejected on locked/inactive, rollback on failure, shift prompt.
8. Reassign dialog from List and from a card, including "same lead" and cancel.
9. Without "see financial data": no dollar values in columns, cards or pickers.
10. As a technician role: no drag, no more-actions, read-only board.

### E2E tests (`e2e/`, Playwright)

Curated against `e2e/.claude/reference/coverage-policy.md`. This plan ships across 13 phases and many PRs, so each phase's own `/e2e-after-change` run carries its own `batchCap = 5`; no phase here exceeds 3 new specs.

**How each phase PR satisfies the `fe-e2e-coverage-check`.** Every phase here touches `app/src/**` or an `api/**Controller.php`, so each PR is UI-affecting under `coverage-policy.md` §9 and none of the §8 pre-approved skip strings apply (`internal-refactor` does not, because templates move). Therefore, per phase PR: run `/e2e-after-change`, which writes the coverage block; where this plan names new specs for that phase, they are that run's batch; where it names none (Phases 2, 3, 6, 10, 11, 12, 13), the run still executes the reference-breakage scan and the PR carries the override marker `> ⚠️ **E2E-COVERAGE-OVERRIDE:** <reason>` in the first three lines of the description, with the reason this plan gives (analytics is unit-observable; keyboard semantics are undefined until UX-19; performance is measured, not asserted). **A non-empty Backlog fails the check**, so the backlog entries listed per phase must either be promoted into that run's batch or covered by the same override marker — decide at PR time, do not leave the block with a populated Backlog table.

**Reference breakage — mandatory and uncapped.** Three of the five behaviour changes break existing specs by precondition, not by assertion:
1. The first-visit default filter view moves from All to Work Orders. `showOnlyStatus()` must select the All tab first (the Status chip renders only there); `work-order-list.spec.ts`'s top-level and mobile-sort `beforeEach` blocks must pin a tab before navigating — otherwise eleven tests fail on an organization whose seeds are estimates, and three of them currently degrade to a vacuous pass instead.
2. `resetSavedWorkOrderFilters()` and its browser-side twin must reset the new preference keys (**display**, density, fields, pins, order, collapse). Without it, one spec that opens Kanban leaks that display into every later spec run as the same admin — the highest-risk, least-visible regression in this change set.
3. `work-order.factory.ts::setLeadTechnician` gains a 409 for locked statuses: throw a named error, document the lock in the factory, and narrow the `try/catch` in `wo-detail-card-permissions.spec.ts` so a 409 fails loudly instead of silently disabling an assertion.
   Also: a stale docblock claiming the list opens on Estimates, and `playwright.config.ts`'s explicit per-file `testMatch` — an unlisted new spec never runs in CI.
   Clean, no action: the tech-story check mark has no test id and zero E2E references; the added List row fields are additive and no consumer reads them.

**New specs, by phase**

| Phase | Spec | Type | Covers |
|---|---|---|---|
| 5 | `ui/work-orders/reassign-lead-from-list.spec.ts` | happy + 2 edges | S10-R1/R2/R3, S10-N1, S10-E1, S4-R4, S4-R5, S4-R12–R14, S4-N2, S4-N6 |
| 7 | `ui/work-orders/kanban-board-grouping.spec.ts` | happy + 2 edges | S3-R1, S3-R2, S3-R12, S3-R9, S3-R20, S2-R7, S1-R11, S1-N1 |
| 8 | `ui/work-orders/tech-view-grouping.spec.ts` | happy + 1 edge | S2-R1, S2-R2, S2-R5, S2-R12, S2-R13, S2-E1 |
| 9 | `ui/work-orders/kanban-drag-reassign-lead.spec.ts` | happy + 2 edges | S9-R1/R5/R6, S4-R1, S4-R5, S4-R7, S4-R8, S4-E6, NFR-011 |
| 9 | `ui/work-orders/lead-change-clear-shifts.spec.ts` | happy + 2 edges | S4-R11, S4-R21–R24 |
| 9 | `ui/work-orders/display-option-persistence.spec.ts` | happy + 1 edge | S1-R1/R3/R4/R9/R11, S1-N2 |

**Example scenarios**

**Test: Dragging a card to another technician reassigns the lead** (Happy path, S9-R6 / S4-R8)
1. Open Work Orders and switch to Kanban.
2. Note the counts in technician A's and B's column headers.
3. Drag the Approved work order's card from A's column to B's.
4. Reload and reopen Kanban; open the work order.
- **Expected:** the card sits in B's column, "Lead technician updated" toasts and auto-dismisses, A's count drops by one while B's rises by one with no reload, the move survives the reload, the previously unassigned line now belongs to B, and a line explicitly assigned to a third technician is untouched.

**Test: Clearing shifts removes only whole-work-order shifts** (Edge case, S4-R22 / S4-R24)
1. Seed technician A with a whole-work-order shift and a line-level shift on the same work order.
2. Drag the card from A to B and choose **Keep** on the prompt.
3. Drag it back, drag it to B again and choose **Clear**.
4. Open the Schedule for those dates.
- **Expected:** Keep leaves both shifts; Clear removes only A's whole-work-order shift; A's line-level shift survives both.

**Test: An Invoiced row cannot be reassigned** (Edge case, S4-N2 / S4-N6)
1. Seed an Invoiced work order whose lead was set **before** invoicing.
2. Open its more-actions menu on the List.
- **Expected:** "Reassign lead technician" is present but disabled and explains the status restriction. (The 409 itself is a backend functional test; it is not re-asserted here.)

**Backlog** (deferred, promoted in the phase named): Tech View pins shared across displays and persisted (Phase 7) · Kanban fields picker persistence (Phase 7) · density persistence (Phase 4) · line-technician avatars against the real enricher (Phase 5) · board manual order surviving a filter change (Phase 9).

**Deliberately not E2E** (mocked-API or API-only observable, so they stay unit/functional): the tech-story check mark removal, the first-visit default view, the board-versus-List parity test, the 409 status lock, the 18-case line-movement matrix, analytics events, the fourth-pin disabled state, and "density never changes which fields show".

**Testability this plan owes E2E** — without these, the specs above cannot be written cleanly: an always-present `data-loading="true|false"` on the board and `data-items-loaded` per column (covering first load *and* continuations); count elements `kanban_column_count_<key>` / `tech_view_group_count_<key>`; a stable per-column drop zone plus the exported drag threshold (Playwright's `dragTo()` cannot drive a pointer-events handler); toast ids `toast_lead_technician_updated` / `_removed` / `alert_lead_technician_failed`; `button_clear_shifts_keep` / `button_clear_shifts_confirm`; and `option_lead_technician_<id>` / `option_lead_technician_unassigned`.

---

## 8. Rollback Plan

- **Phases 1, 4–11 and 13** are frontend-only or additive endpoints: revert the release; no data changes.
- **Phase 2** changes the List query path. The response contract is unchanged, so rollback is a code revert; the characterization tests from Phase 2 are what prove parity before shipping.
- **Phase 3** is the sensitive one: it changes lead-change behaviour and adds two schema objects. Rollback = revert the code; the new column and table can stay (both are nullable/unused when the code is gone). Do **not** drop `work_order_board_position` on a hot rollback — it only holds per-user ordering, and dropping loses it.
- **Phase 9** writes position rows; reverting leaves them and the board falls back to default ordering.
- Feature exposure: Tech View and Kanban only appear in the switcher from Phase 9, so an incomplete rollout is invisible to users without a runtime flag (the PRD forbids one). The dev-only `?display=` parameter used for the Phase 7–8 browser-walks is compiled out of production builds; confirm that in the Phase 9 walk.

---

## 9. Security Considerations

- **Tenant scoping (NFR-006):** every new query binds workplace **and** organization. Phase 2 also adds the missing organization predicate to the List query and to the two part-request fetchers it shares with Part Sales.
- **Inbound technician ids** are checked for organization ownership on all three lead-change paths (user decision). Eligibility deliberately stays a front-end boundary, as the PRD decided — that remains a knowing product choice, not an oversight.
- **Permissions:** board reads require Work Orders view; `board-move` and the candidates endpoint require create-and-edit. Technician-group reordering is a preference write, so view permission is enough (SQ-16).
- **Financial data:** `totalPrice` is zeroed server-side when the pricing permission is absent, and hidden from cards, columns, pickers **and filter options — including saved filters, which are neither applied nor revealed** (S5-E2, S5-E6).
- **`work_order_board_position` has no tenant columns by design.** Every read binds the authenticated user's id and joins `work_order` with both tenant predicates; writes only happen for work orders resolved in the current workplace — the same pattern as `work_order_line_technician`.
- **Out of scope, raised separately** (user decision): the `workOrdersView` frontend bundle also grants create-and-edit server-side, so view-only roles can call lead-change endpoints; `X-Location-ID` is not verified against the caller's organization; `/api/technicians` has no organization scope or permission attribute. These are pre-existing and need their own tickets.

---

## 10. Requirement Traceability

Layers: **API** = `api/`, **App** = `app/`, **E2E** = `e2e/` (filled in the E2E pass).

| Requirement | Phase | Layer | Files | Status |
|---|---|---|---|---|
| S8-R1, S8-R2, S8-N1, S8-E1 | 1 | App | `app/src/components/ts/work-orders/work-order-lines/WorkOrderLineRow.vue` | Planned |
| S1-R8, S1-R12 | 2 | App | `displays/composables/useWorkOrdersScrollRestoration.ts` | Planned |
| S1-R5, S1-R7, S1-N5, S1-E2, S1-E3 | 2 | App | `displays/toolbar/WorkOrdersToolbar.vue`, `displays/composables/useWorkOrdersViewState.ts`, `workOrdersPreference.ts` (parity tasks) | Planned |
| S1-R11 | 2, 6 | API | `Application/Query/WorkOrder/WorkOrderListCriteria.php`, `Infrastructure/…/WorkOrderListingCriteriaApplier.php` | Planned |
| S7-R1–R6, S7-N1, S7-E1 | 2 (data), 5 (UI) | API + App | `DbalWorkOrderListItemEnricher.php`, `WorkOrderLineTechnicianDto.php`; `app/src/components/ts/shared/AvatarGroup.vue`, `displays/list/workOrderColumns.ts` | Planned |
| NFR-003, NFR-006 | 2 | API | `DbalWorkOrderListingFetcher.php`, `PartRequestFetcher.php`, `PartReturnRequestFetcher.php` | Planned |
| NFR-009, NFR-010 | 2 | App | `useTableQuery.ts`, `useWorkOrdersListQuery.ts`, `api/work-orders/keys.ts` | Planned |
| S4-R6, S4-R8, S4-R9, S4-R10, S4-R17–R24, S4-N2, S4-N4, S4-E1, S4-E2, S4-E5, S4-E6, NFR-008 | 3 | API | `Domain/WorkOrder.php`, `Application/Service/WorkOrder/LeadTechnicianChanger.php`, `Domain/Line/Service/LineFetcher.php`, `ShiftOutgoingLeadShiftClearer.php`, migration | Planned |
| S4-R6 (detail-page parity), S4-N2 (Declined) | 3 | App | `WorkOrder.vue`, `OrderStatusCard.vue`, asset-on-site toggles | Planned |
| S1-R2, S1-R4, S1-R9, S1-R10, S1-N2, S1-N3, S1-N4, S1-E1 | 4 | App | `displays/toolbar/DisplayOptionSwitcher.vue`, `displays/composables/useWorkOrdersViewState.ts`, `workOrdersPreference.ts` | Planned |
| S1-R1, S1-R3 | 9 | App | `displays/toolbar/DisplayOptionSwitcher.vue` (all three options first offered here) | Planned |
| V-2 interim (mobile guard) | 4 | App | `displays/WorkOrdersPageBody.vue` | Planned |
| S1-R1, S1-R3, S1-R4, S1-R9, S1-R11, S1-N2 | 9 | E2E | `e2e/tests/ui/work-orders/display-option-persistence.spec.ts` | Planned |
| S1-N1 | 7, 8 | App | `displays/kanban/WorkOrdersKanbanDisplay.vue`, `displays/tech-view/WorkOrdersTechViewDisplay.vue` (shared `FilteredTableEmptyState`) | Planned |
| S6-R1–R7, S6-N2, S6-E1 | 4 | App | `displays/toolbar/DensityMenu.vue`, `displays/density.scss` | Planned |
| S5-N2, S5-N3, NFR-012 | 4 | App | `workOrdersPreference.ts`, `usePagePreferences.ts` | Planned |
| S4-R4, S4-R5, S4-R12–R16, S4-N1, S4-N6, S4-N8, S4-E4, S4-E8, NFR-007 | 5 | API + App | `ListLeadTechnicianCandidatesController.php`; `ReassignLeadTechnicianDialog.vue`, `leadAssignmentRules.ts` | Planned |
| S10-R1–R3, S10-N1, S10-N2, S10-E1 | 5 | App | `displays/shared/WorkOrderMoreActions.vue`, `displays/list/workOrderColumns.ts` | Planned |
| S2-R3, S2-R7, S2-R14, S2-N2, S3-R1, S3-R9, S3-N2, S4-E7, NFR-001, NFR-002, NFR-005 | 6 | API + App | `DbalBoardTechnicianFetcher.php`, `DbalWorkOrderBoardFetcher.php`, board controllers; `leadBoardQueries.ts`, `useLeadBoard.ts` | Planned |
| S1-R11 (board = List parity) | 6 | API | `api/tests/Functional/VehicleService/WorkOrders/Board/ViewWorkOrderBoardTest.php` | Planned |
| S3-R2–R9, S3-R11–R21, S3-N1, S3-N3, S3-N4, S3-E1–E5, S1-N1 (Kanban), NFR-004 | 7 | App | `displays/kanban/*` | Planned |
| S3-R1, S3-R2, S3-R9, S3-R12, S3-R20, S2-R7, S1-R11, S1-N1 | 7 | E2E | `e2e/tests/ui/work-orders/kanban-board-grouping.spec.ts` | Planned |
| S5-R2, S5-R3, S5-R5, S5-R9, S5-R10, S5-R11, S5-R13, S5-N1, S5-E1, S5-E3, S5-E4, S5-E5 | 7 | App | `displays/kanban/kanbanFields.ts`, `displays/toolbar/VisibilityPicker.vue` | Planned |
| S5-E2, S5-E6 (columns, fields **and** filters) | 4, 7 | App | `displays/toolbar/WorkOrdersToolbar.vue`, `displays/list/workOrderColumns.ts`, `displays/toolbar/VisibilityPicker.vue` | Planned |
| S2-R1, S2-R2, S2-R4–R6, S2-R8–R13, S2-R15, S2-R16, S2-N1, S2-N3, S2-E1, S2-E2 | 8 | App | `displays/tech-view/*`, `displays/shared/WorkOrderTableRow.vue` | Planned |
| S2-R1, S2-R2, S2-R5, S2-R12, S2-R13, S2-E1 | 8 | E2E | `e2e/tests/ui/work-orders/tech-view-grouping.spec.ts` | Planned |
| S5-R1, S5-R4, S5-R7, S5-R8, S5-R12 | 8 | App | `displays/list/workOrderColumns.ts`, `workOrdersPreference.ts` | Planned |
| S1-N1 (Tech View) | 8 | App | `displays/tech-view/WorkOrdersTechViewDisplay.vue` | Planned |
| S9-R1–R15, S9-N1–N3, S9-E1–E3, S4-R1, S4-R7, S4-R11, S4-N3, S4-N5, S4-N7, S4-E3, S10-R3, S11-R5, NFR-011 | 9 | API + App | `MoveWorkOrderOnBoardController.php`, `WorkOrderBoardPositioner.php`; `displays/drag/*`, `useLeadBoardMove.ts`, `ClearShiftsPrompt.vue` | Planned |
| S9-R1, S9-R5, S9-R6, S4-R1, S4-R5, S4-R7, S4-R8, S4-E6, NFR-011 | 9 | E2E | `e2e/tests/ui/work-orders/kanban-drag-reassign-lead.spec.ts` | Planned |
| S4-R11, S4-R21, S4-R22, S4-R23, S4-R24 | 9 | E2E | `e2e/tests/ui/work-orders/lead-change-clear-shifts.spec.ts` | Planned |
| S12-R1–R15, S12-N1, S12-E1, S12-E2 | 10 | App | `displays/composables/useWorkOrdersAnalytics.ts`, `useGoogleAnalytics.ts` | Planned |
| S11-R2, S11-R7, S11-R8, S11-N1 | 11 | App | `WorkOrderMoreActions.vue`, `KanbanColumnHeader.vue`, `TechViewGroupHeaderRow.vue`, toolbar controls | Planned |
| S11-R1, S11-R3, S11-R4, S11-R6, S11-R9, S11-R10, S11-E1, S11-E2 | 11 | App | — | **Blocked on design UX-19 / SQ-15** |
| S10-R1–R3, S10-N1, S10-E1, S4-R4, S4-R5, S4-R12–R14, S4-N2, S4-N6 | 5 | E2E | `e2e/tests/ui/work-orders/reassign-lead-from-list.spec.ts` | Planned |
| V-1, NFR-013 | 12 | API + App | `SeedWorkOrderBoardPerformanceFixtureCommand.php`, `RequestProfilerSubscriber.php` | Planned |
| V-2 (desktop half) | 12 | API + App | small-shop and large-shop fixtures, empty/overflow states | Planned |
| V-2 (phone/tablet half) | 13 | App | — | **Blocked on design UX-20** |

E2E rows above come from the E2E curation pass; the reference-breakage fixes in Section 7 are mandatory and belong to the phase whose change causes them (Phases 2, 3, 4).

## 11. Verification Tickets

_Filled in by Phase 10 of the wizard after the plan is approved._

| Ticket | Title | Covers | Linked stories | Assignee |
|---|---|---|---|---|
| SV-… | … | … | … | … |

When all these tickets are marked Done, the feature is ready for QA.

## 12. Open questions carried into implementation

Posted on the PRD (first comment) and awaiting Product: default filter view; reordering locked work orders; the five untracked design deltas; the six planning assumptions (OQ-2, SQ-11, MF-3, FF-4 scope, FF-4 atomicity, SQ-10); Unassigned in the All view.

Raised in the follow-up comment (drafted after code planning):

1. **S2-R9 / S3-N1 vs S1-R3 / S1-E1** — "Assigned to me" also matches service advisor and line technicians, so hiding Unassigned hides work orders that List shows. Planned: hide per the PRD; the backend always returns the group.
2. **S2-R14 / S3-R9 with Assigned to me** — do all eligible empty technician groups still show?
3. **Imported** — imported work orders are a separate table with no lead, so Tech View and Kanban are unavailable while the Imported chip is selected. Planned: switcher options disabled with a tooltip.
4. **Hidden pins** — pins of technicians from other locations are hidden and do not count toward the 3-pin cap there; a pinned technician at this location always gets a column so it can be unpinned.
5. **Active but ineligible leads** (unenrolled, role changed, not clockable) — treated like inactive for drops; label waits on UX-9.
6. **S4-N6 / §9 reason text** — the "same reason text shown on the work order page today" does not exist; copy is needed. The detail page also locks only Invoiced/Paid today; this plan adds Declined.
7. **S7-R1 "Assigned Tech column"** — List's column is "Lead Technician"; planned to keep the key and render the avatar group there.
8. **S5-R11 "clocked-in time"** — production shows clocked-in technician *names*, not a duration.
9. **S7-R1 declined lines** — planned: technicians on declined lines are included in the avatar group.
10. **OQ-2 "bottom"** — means after all manually ordered work in that group, then default sort.
11. **S12 analytics** — outcome-based events depart from the app's "intent not outcome" convention, and per-field exposure is ~15 events per view.
12. **In-progress shifts** — clearing deletes the whole block rather than truncating it at now.
13. **Behaviour changes users will notice** — Declined locks the lead; lines with roster technicians stop following the lead; lines whose labor is linked only through a task stop moving; re-selecting the current lead no longer assigns unassigned lines.
14. **S2-R3 tie-break** — the PRD orders identical names by "earliest-created **staff** record", but `staff` has no created date. The plan uses `user.created_on` (NULLs last) then `staff.id`. A different record; confirm it is acceptable.
15. **Phone and tablet (V-2, UX-20)** — no design exists, so Phase 13 is blocked and the interim behaviour (mobile List only, new displays withheld below the desktop breakpoint) does **not** satisfy V-2. This is the one PRD requirement the plan cannot deliver on its own; it needs UX-20 before it can be built or estimated.
16. **Default filter view, URL carve-out (S1-R10)** — the first-visit default becomes Work Orders, but a shared link without `?tab` still opens All so existing links keep their meaning. Flagged because the first comment asked the question without this detail.
17. **Analytics reporting ownership (S12-R4, R10–R13)** — four requirements define reports, not events. Phase 10 carries them as GA4 exploration definitions with a sample-calculation check, but they need an owner in product analytics; engineering can ship the events and still leave Story 12 unmet.