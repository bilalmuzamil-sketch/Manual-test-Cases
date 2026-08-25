# Simple Flow V2 — Technical Implementation Plan

**Date:** 2026-08-20
**PRD:** [Simple Flow V2](https://shopview.atlassian.net/wiki/spaces/PM/pages/771391574/Simple+Flow+V2) (revision of 2026-08-20)
**Jira epic:** [SV-8683](https://shopview.atlassian.net/browse/SV-8683)
**Stories:** SV-9247 – SV-9267 (20 in scope; SV-9256 deferred)
**Design:** [Shopview App](https://claude.ai/design/p/0c2ed95b-ce68-4b7f-a86d-0e3de1af5a28?file=Shopview+App.dc.html) · [Purchase Order Details](https://claude.ai/design/p/d2b4d45e-f8f2-4ae6-b69f-24637c6a0d7d?file=Purchase+Order+Details.dc.html)
**Tech stack:** PHP 8.5 / Symfony 7.4 / Doctrine ORM 3 (`api/`) · Vue 3.5 / Quasar 2 / TypeScript / Vuex + TanStack Query (`app/`) · Playwright (`e2e/`)
**Estimated complexity:** High — 20 stories across 10 phases, touching line completion, settings, a new bulk bar, receiving, the completion wizard and the work order header.

---

## 0. Execution State

_Keep this block current so any agent (or person) can resume mid-flight — this plan may be executed by someone who did not write it._

- **Status:** Not started
- **Current phase:** —
- **Last completed:** —
- **Open questions / blockers:** One engineering decision outstanding — the record-count threshold for Story 4's off-hours advisory (see §3, D-7). A prod query is drafted in §1.

> 🛑 **About to implement this plan? Run it as `/loop /implement <this-file>`.** This plan is meant to be executed by the `/implement` orchestrator inside a `/loop` — that combination is what adds the code-review loop, the runtime gates (migration / compile / smoke / browser-walk), the mandatory E2E ask, and phase-by-phase hands-off execution. Free-hand implementation skips all of it.
>
> - **However you were handed this** — "implement it", "here's the path, do it", or a single phase — do **not** start editing code directly. Route through `/loop /implement <this-file>` (or `/loop /implement Phase N from <this-file>` for one phase). That *is* "doing the implementation" — just with the gates. Announce that you're routing through `/loop /implement` and proceed; no need to ask.
> - **If you are ALREADY running under `/loop /implement`**, ignore this note and continue — you're in the right place.
> - **If you are a sub-agent** (`be-implementer`, `fe-implementer`, …) without orchestration tools, do **not** invoke `/loop` or `/implement` — that's the orchestrator's job. Execute only the scope you were handed and report back.
> - **Precedence:** only a *live, explicit* user instruction to the contrary wins.

---

## 1. Requirements

Extracted from the 2026-08-20 PRD revision. Each FR is tagged with its story.

### Functional

**Settings**
- **FR-001 (SV-9247):** Rename *Automatically pick inventory parts* → **Require picking inventory parts**, inverting the stored polarity so behaviour is preserved.
- **FR-002 (SV-9247):** Add **Require ordering parts** — a new setting and new behaviour; nothing orders parts automatically today.
- **FR-003 (SV-9247):** Update the *Require Receiving Parts Before Completion* description; leave its label and field alone.
- **FR-004 (SV-9247):** Build the behaviour behind *Require Approval for New Lines* — new line is Needs Approval when on, Approved when off.
- **FR-005 (SV-9247):** Group the settings page into **Workflow**, **Line requirements** and **Parts** with dividers.
- **FR-006 (SV-9247):** Every default reproduces today's behaviour — all three parts settings default **on**.
- **FR-007 (SV-9248):** A settings change applies to **every open work order**, changing the underlying records, excluding invoiced/paid work orders and declined lines.
- **FR-008 (SV-9248):** Every record changed is written to the audit log on the work order and on each line/part, naming the cause.
- **FR-009 (SV-9248):** A failed run is resumable — re-running finishes the remainder without repeating work.
- **FR-010 (SV-9249):** A confirmation precedes any of the four settings changes, naming the setting, the direction, the consequence and the record count.
- **FR-011 (SV-9249):** Turning receiving **on** and approval **off** are stated as warnings, not counts alone.
- **FR-012 (SV-9250):** While the sweep runs the app shows a blocking indicator; the user is not returned until every record is changed; a partial application is never left visible.

**Completing a line**
- **FR-013 (SV-9251):** **A line completes whatever the state of its parts** — unordered, unpicked and unreceived, in any combination, at every entry point.
- **FR-014 (SV-9251):** Line-level requirements that stay: tech story, mileage, engine hours (each only when its setting is on) and core resolution.
- **FR-015 (SV-9251):** Where receiving is *not* required, an unresolved core is asked before the line completes (V1 behaviour, unchanged).
- **FR-016 (SV-9251):** A line reaches Complete only via: the line, bulk Complete lines, bulk Complete all lines, Create invoice, and Clock out and complete.
- **FR-017 (SV-9251):** The clock-out modal loses its *line completed* tick box and gains **Clock out** plus **Clock out and complete** (or **Clock out and send to review**).
- **FR-018 (SV-9252):** Line actions by status — Needs Approval: Approve, Decline, Request part, Delete line · Approved: Decline, Authorization required, Complete, Request part, Delete line · Declined: Approve, Authorization required, Request part, Delete line · Complete: Decline, Authorization required, Uncomplete.
- **FR-019 (SV-9252):** Decline stays visible but disabled while the line holds received or picked parts, with the reason.
- **FR-020 (SV-9252):** Part actions across **all seven** states — Requested: nothing on row (counted in `Order (n)`) · Quoted: Order · Auth to order: Order · In Stock: Pick · Awaiting: Receive (+ *Received later* caret when receiving required) · Received later: nothing on row, Receive in `…` · Received/picked: nothing · Returned: nothing.
- **FR-021 (SV-9252):** Declining or sending back a line moves only In Stock, Quoted, Auth to order and Awaiting parts to Quoted. Requested, Received and Returned are left alone.

**Bulk actions**
- **FR-022 (SV-9253):** A bulk action bar replaces the column headers while a selection is active, laid out as *n selected* → up to three primary buttons → More → close.
- **FR-023 (SV-9253):** One visibility rule per action — nothing qualifies: hidden · qualifies but blocked: disabled with reason · qualifies and unblocked: shown with count.
- **FR-024 (SV-9253):** Fixed primary slot order: finish action (when the selection covers every open line) → Complete lines → Approve → Order → Receive → Pick. Decline is always in More.
- **FR-025 (SV-9253):** Line actions count lines; parts actions count parts. A count never includes what the action would skip — **except Requested in `Order (n)`**, which is deliberate.
- **FR-026 (SV-9253):** Approve, decline, authorization required, complete and uncomplete apply immediately with an **undo** in the result toast. Ordering and Create invoice confirm first and cannot be undone.
- **FR-027 (SV-9254):** Bulk approve counts Needs Approval only; decline counts Needs Approval + Approved; authorization required counts Approved. **Declined lines are never swept up.**
- **FR-028 (SV-9254):** Per-line judgement — one line failing does not stop the rest; the result names each failure with its line number and reason.
- **FR-029 (SV-9255):** Bulk complete labels: **Complete line** / **Complete lines (n)** / **Complete all lines**. Counts Approved lines only; opens the wizard where something is collectable; creates no invoice and navigates nowhere.
- **FR-030 (SV-9257):** Bulk order runs the existing single-part order per part; Requested parts are included and counted; **only vendor-sourced parts are placed**; confirms first.
- **FR-031 (SV-9258):** Bulk pick runs the existing pick; all picks succeed or fail together; offered whenever a part is In Stock and unpicked, whatever the setting.

**Receiving**
- **FR-032 (SV-9259):** Receive opens a **modal** from all four entry points (part row, line menu, bulk bar, wizard) — no navigation.
- **FR-033 (SV-9259):** Modal contents depend on the entry point; settings never change what it contains.
- **FR-034 (SV-9259):** One card per vendor; **Vendor missing sorts first**; vendor, invoice number and invoice date required, with the receive button disabled until filled.
- **FR-035 (SV-9259):** **Cost and tax are required but may be zero and always arrive prefilled** — cost from the purchase order, tax from the vendor's rate.
- **FR-036 (SV-9259):** Assign vendor is the required first field when no vendor is set; everything below it is disabled until chosen.
- **FR-037 (SV-9259):** One vendor's parts spanning two purchase orders produce **two vendor bills carrying the same invoice number**, stated before confirming.
- **FR-038 (SV-9260):** Purchase orders group by vendor, missing first then alphabetical, all collapsed, with rollups and a vendor count in the page header.
- **FR-039 (SV-9260):** A panel expands **per purchase order**, not per vendor; sell price shown here and only here, read-only.
- **FR-040 (SV-9261):** Receive becomes a split button with **Received later** behind the caret, on the row, in the bulk bar and in the wizard's receive step.
- **FR-041 (SV-9261):** *Received later* is chosen **per part**, satisfies the completion requirement, stays receivable from the `…` menu, and keeps counting in Waiting on Parts.

**Finishing the work order**
- **FR-042 (SV-9262):** The wizard opens from exactly five entry points and only when something required is outstanding *and* collectable; the run records which lines it covers and whether it is heading to an invoice.
- **FR-043 (SV-9263):** Step order becomes **Tech stories → Pick parts → Resolve cores → Receive parts → Missing details**. Only two things move: Missing details first→last, and Tech stories folds in as a step.
- **FR-044 (SV-9263):** Steps are pills with counts; finished steps go read-only with a tick; unfinished stay clickable; **no Continue button** — each step's own action saves and advances.
- **FR-045 (SV-9263):** The receive step opens the same modal as FR-032, carrying the same per-part *Received later* choice.
- **FR-046 (SV-9264):** The header offers exactly one finish action, determined by the review setting and whether every line is complete; *Complete Work Order* is retired everywhere.
- **FR-047 (SV-9264):** Create invoice runs the wizard first when anything is outstanding; on completion the invoice is created, every line completes, and the Finance tab opens with the payment screen.
- **FR-048 (SV-9265):** Part `…` menu = Move, Return, Add part fee or discount, Receive part (only when receiving is optional, always last). Line `…` menu = Request part, Uncomplete line, Add line note, Save as canned line, Edit labour, Receive parts (n), Authorization required.
- **FR-049 (SV-9266):** Parts drag-reorder **within their line**; one stored order drives the line, the invoice and the PDF; a drop is confirmed and undoable.
- **FR-050 (SV-9267):** One new permission atom, **Received later**, off by default in every role.
- **FR-051 (SV-9267):** **See Financial Data governs money; view mode governs work.** No money field is ever both hidden and required.

### Non-functional

- **NFR-001** *(analysis)* — The settings sweep must be **bounded and batched**. It rewrites every open work order in an organization; an unbounded single-transaction UPDATE will lock tables and time out. See §3, D-6.
- **NFR-002** *(analysis)* — The sweep must be **idempotent and resumable** (FR-009 restates this): re-running skips already-changed records rather than repeating work.
- **NFR-003** *(analysis)* — The confirmation's record counts (FR-010) must be **cheap to compute**. They run on every toggle, before any change; they must not scan every line in the shop unindexed.
- **NFR-004** *(analysis)* — Bulk endpoints must be **tenant-scoped** — every line and part id in a bulk payload is verified to belong to the caller's organization and to the work order in the route, before any status change.
- **NFR-005** *(analysis)* — Bulk actions on a large selection must not be **N+1**. Counting and executing both load lines and part requests in bounded queries.
- **NFR-006** *(PRD, SV-9250)* — The sweep is synchronous and blocking from the user's point of view; a partial application is never left visible.
- **NFR-007** *(analysis)* — The bulk bar's counts are derived **client-side from already-loaded line/part state**; no extra request per selection change.
- **NFR-008** *(PRD, SV-9267)* — Values behind a hidden money field are **not sent** to a client that may not display them.

### Clarifications & PRD comment outcomes

| Question | Asked via | Answer |
|---|---|---|
| Do the two specs govern the same users, or is Simple Flow a toggleable mode? | User challenge → code check | **Not a mode.** No Simple Flow feature flag (only `quickbooks`, `CustomerPortalServiceAdvisorNoReportsAccess`, `openapi`), no settings boolean, and `simple-complete` is the only complete-work-order route. Both specs govern the same screen for the same users. |
| Does a Requested part show Order, and is it counted? | Confluence comment | **No button, but counted in `Order (n)`** — *"we want to give them option to do that if they want."* Only vendor-sourced parts are actually placed. |
| Which permission governs money on the part row? | Confluence comment | **See Financial Data.** PRD now states the rule outright: *"See Financial Data governs money. View mode governs work."* |
| Is system attribution in the audit log in scope? | Confluence comment | Delegated to engineering, scoped to *"changes like approved lines setting and review wo setting"*. See D-5. |
| Is building *Require approval for new lines* in scope? | Confluence comment | **Yes** — *"this is new setting and should be in this scope. PRD updated now."* |
| Anything explicitly out of scope? | Confluence comment | **Bulk delete lines (SV-9256) is out** — moved to follow-up, removed from the bulk bar. |
| Does the reviewer ≠ completer rule exist? (PRD Q10) | Code check | **No.** No `completedBy`/`reviewedBy` field, no comparison anywhere in the review path. Closed. |
| Where does Story 20 live? (PRD Q7) | Confluence comment → PRD | **Stays in Simple Flow V2, built last, droppable.** |
| Are `hold` and `imported` editable work order statuses? | Code check | Neither is a backend status. The enum is `estimate, in_progress, approved, declined, ready_for_review, complete, invoiced, paid`. `hold` is an FE-only label; imported work orders are a separate read model. |

---

## 2. Architecture Overview

Simple Flow V2 is a **redesign over live machinery**, not a greenfield build. Three things already exist and are extended rather than created:

| Already exists | Where | What V2 does to it |
|---|---|---|
| Multi-select on lines | `WorkOrderLineRow.vue` checkboxes + `LineActionsMenu.vue` bulk menu | Replace the header menu with the bulk **bar**; keep the selection model |
| The completion wizard | `CompletionWizard.vue` (~1600 lines) + `useCompletionSession.ts` | Reorder steps, fold tech stories in, swap the receive page for a modal |
| Receiving | `PurchaseOrderReceiveBlock.vue` + `useReceiveView.ts`, PO pages | Extract the shared block into a modal; regroup the PO pages by vendor |

```
                    ┌─────────────────────────────────────────┐
   WorkOrder.vue ──▶│ WorkOrderNavBar  (Phase 8: finish action)│
                    └─────────────────────────────────────────┘
                                     │
                    ┌────────────────▼────────────────────────┐
                    │ WorkOrderLines.vue                      │
                    │  ├─ BulkActionBar.vue      (Phase 4 NEW)│
                    │  ├─ WorkOrderLineRow       (Phase 3)    │
                    │  │   └─ WorkOrderLineParts (Phase 3)    │
                    │  │       └─ PartRequestActionButton     │
                    │  │           └─ SplitButton (Phase 5 NEW)│
                    │  └─ CompletionWizard       (Phase 6)    │
                    │       └─ ReceivePartsModal (Phase 5 NEW)│
                    └─────────────────────────────────────────┘

   api/ ── LineCompletableValidator   (Phase 1: drop the parts gate)
        ── Setting + sweep handlers   (Phase 2, 7)
        ── bulk line/part endpoints   (Phase 4)
        ── ReceiveRequestedParts      (Phase 5: prefill cost/tax)
        ── PermissionEnum             (Phase 5: Received later atom)
```

**The single most important change** is one call in `LineCompletableValidator::validate()`. Everything else is surface work built on top of it.

---

## 3. Technical Decisions

| # | Decision | Rationale | By |
|---|---|---|---|
| **D-1** | **Remove `validateAllPartRequestsAreFulfilled()` from `validate()`** rather than making it conditional on settings. | FR-013 is absolute — *"Complete is never disabled for a parts reason, anywhere."* A conditional check would reintroduce the coupling the release exists to remove. The work-order-level gate in `validateWorkOrderIsCompletable()` keeps enforcing parts where the money is. | agent |
| **D-2** | **Invert *Require picking inventory parts* at the API boundary**, not by renaming the column. | The FE already does exactly this for `Require Approval for New Lines` (rendered from `!autoApproveLines`). Following the established pattern avoids a data migration on a per-organization table and keeps the change reversible. The PRD explicitly allows either. | agent |
| **D-3** | **Add `require_ordering_parts` as a new nullable-then-backfilled column** defaulting to `true`. | FR-006 — defaults reproduce today's behaviour, and nothing orders parts automatically today. A hand-written migration backfills existing rows to `true` so no shop changes behaviour on deploy. | agent |
| **D-4** | **The bulk bar computes counts client-side** from already-loaded line and part state. | NFR-007. The work order detail page already holds every line and part request in the Vuex `workorders` module; a round trip per selection change would make the bar feel broken. | agent |
| **D-5** | **Audit attribution: record the acting admin, and name the cause in the message.** No system-actor support is built. | Milos delegated this. `EntityEvent::$userId` is non-nullable and `WorkOrderEventDispatcher::createPayload()` silently drops entries with no user — supporting "nobody" is a platform change for marginal gain. Writing *"Line approved because Require approval for new lines was turned off"* against the admin who pressed the button preserves the "why", which is what the requirement is actually for. **Scoped to the approved-lines and review settings**, per Milos. | agent (delegated) |
| **D-6** | **The settings sweep runs in batches inside one HTTP request**, with a resumable cursor, not as an async message. | NFR-001/002 + FR-012 — the PRD requires the user to wait and forbids a visible partial state, which rules out a background queue. Batching (chunks of ~500 records, each its own transaction, cursor persisted) keeps locks short while remaining resumable if the request dies. | agent |
| **D-7** | **The off-hours advisory threshold is data-dependent** — see §1 prod query below. Provisional: **5,000 affected records**. | The PRD leaves the volume "agreed with engineering, based on how long the run actually takes". Until the query is run this is a placeholder, tuned once real counts are known. | **open** |
| **D-8** | **Build a `SplitButton.vue` base component** rather than composing `q-btn` + `SubActionsDropDown` ad hoc. | No split button exists anywhere in `app/`. FR-040 needs one in three places (part row, bulk bar, wizard receive step); one base component keeps them identical and testable. | agent |
| **D-9** | **Add an `actions` + undo affordance to the existing notification helpers** rather than a new toast system. | `showSuccessNotification` already accepts `NotifyAction[]`; nothing has used it for undo yet. FR-026 needs undo on five bulk actions — extending the existing helper keeps Golden Rule #1 (no direct `Notify` import) intact. | agent |
| **D-10** | **Story 20 uses SortableJS**, mirroring line reordering. | `WorkOrderLines.vue:1696-1735` already does exactly this for lines, posting to `work-orders/lines/change-lines-order`. Part reordering is the same shape one level down. | agent |
| **D-11** | **Prefill cost and tax server-side**, returned by the receive-modal read endpoint. | FR-035 + NFR-008. If the client computed the prefill it would need the cost — which a user without See Financial Data may not receive. Prefilling server-side lets that user submit values they never saw. | agent |

**No new runtime dependencies.** SortableJS, TanStack Query, Quasar and Vuex are all already in `app/`; the backend adds no packages.

### Prod query for D-7 — read-only, run before Phase 7

Feeds the off-hours-advisory threshold and confirms NFR-001's batching is necessary.

```sql
-- How many records would the largest settings sweep touch, per organization?
-- Read as: if the p95 organization exceeds ~5k, keep batching and keep the advisory.
SELECT
    wo.organization_id,
    COUNT(DISTINCT wo.id)   AS open_work_orders,
    COUNT(DISTINCT wol.id)  AS lines_on_open_wos,
    COUNT(DISTINCT pr.id)   AS part_requests_on_open_wos
FROM work_order wo
    LEFT JOIN work_order_line wol ON wol.work_order_id = wo.id
    LEFT JOIN part_request     pr  ON pr.work_order_line_id = wol.id
WHERE wo.status NOT IN ('invoiced', 'paid')
GROUP BY wo.organization_id
ORDER BY part_requests_on_open_wos DESC
LIMIT 25;
```

```sql
-- The highest-consequence sweep (FR-011): how many lines would
-- "Require approval for new lines -> off" approve, shop by shop?
SELECT
    wo.organization_id,
    COUNT(*) AS lines_that_would_be_approved
FROM work_order_line wol
    JOIN work_order wo ON wo.id = wol.work_order_id
WHERE wol.status = 'authorization_required'
  AND wo.status NOT IN ('invoiced', 'paid')
GROUP BY wo.organization_id
ORDER BY lines_that_would_be_approved DESC
LIMIT 25;
```

> ⚠️ Verify the table names against the current schema before running — these are written from the mapped entity names (`work_order`, `work_order_line`, `part_request`) and the migration history should be checked for the actual table names.

---

## 4. Database Changes

### Modified tables

**`setting`** — one new column. Entity: `App\Organization\Setting\Domain\Setting`, mapping `api/src/Organization/Setting/Infrastructure/Doctrine/Setting.orm.xml`.

```sql
-- Illustrative shape only, NOT the migration to copy-paste
ALTER TABLE setting
    ADD COLUMN require_ordering_parts TINYINT(1) NOT NULL DEFAULT 1;
```

Add a matching `private bool $requireOrderingParts = true;` with a `requiresOrderingParts(): bool` getter, following the existing accessor style in `Setting.php` (`autoPickInventoryParts()`, `requiresVendorInvoiceNumber()`, `requiresReview()`).

**Part ordering (FR-049, Phase 10 only)** — part requests need a persisted position within their line, if one does not already exist.

```sql
-- Illustrative shape only — CHECK FIRST whether part_request already carries
-- an ordering column; the line-level equivalent already exists for lines.
ALTER TABLE part_request ADD COLUMN row_order INT NULL;
CREATE INDEX idx_part_request_line_order ON part_request (work_order_line_id, row_order);
```

> ⚠️ Migrations are written **by hand** and verified as a no-op with `bin/console doctrine:migrations:diff --allow-empty-diff` ("No changes detected"). DBAL's schema tools choke on functional/expression indexes in this repo, so the real migration is produced by the implementer against the live schema. Hand-authored FKs must be registered in `MANUALLY_MANAGED_FOREIGN_KEYS`. See `api/.claude/reference/database.md`.

### Data migrations

- **`require_ordering_parts` backfill** — every existing row set to `true` (D-3), so no shop's behaviour changes on deploy. The column default handles new rows.
- **`row_order` backfill (Phase 10)** — populate from the current display order (creation order) per line so existing work orders keep the order customers already see. Needs a deterministic tiebreaker: the existing timestamp has one-second precision, so ties are broken by primary key.
- **No backfill for the auto-pick inversion** (D-2) — the stored column is untouched; only its presentation flips.

---

## 5. API Changes

### New endpoints

**`POST /api/work-orders/{id}/lines/bulk-status`** — FR-027, FR-028, FR-029
- Request: `{ lineIds: string[], targetStatus: 'authorized'|'authorization_declined'|'authorization_required'|'complete' }`
- Response: `{ changed: string[], failures: [{ lineId, lineNumber, reason }] }`
- Auth: `ROLE_WORK_ORDER_CREATE_AND_EDIT` for complete; `ROLE_WORK_ORDER::CREATE_AND_EDIT` for the rest (the atoms collapse — SV-8183).
- **Per-line judgement** — each line runs the existing `StatusTransition` guard; a failure is collected, not thrown (FR-028).
- **Tenant scoping (NFR-004):** every `lineId` is verified to belong to `{id}` and to the caller's organization before anything runs.
- Errors: 404 unknown work order · 403 missing atom · 409 work order invoiced/paid.

> An existing `work-orders/lines/change-lines` handler (`ChangeLinesStatusHandler`) already does a bulk status change but throws on the first failure. Extend it rather than adding a parallel path — FR-028 is the only behavioural difference.

**`POST /api/work-orders/{id}/lines/bulk-undo`** — FR-026
- Request: `{ operationId: string }` — the id returned by the bulk-status response.
- Restores only the lines that actually changed, to the status they held.
- The operation record is short-lived (session or a small table); it is not an audit substitute.

**`GET /api/work-orders/{id}/receive-modal`** — FR-032, FR-033, FR-035, D-11
- Query: `?scope=part|line|workOrder&partRequestId=…|lineId=…`
- Response: vendor-grouped cards with **cost and tax prefilled**, sell price omitted, money fields omitted entirely for a caller without `ROLE_PRICING_VIEW` (NFR-008).
- Auth: same as the existing receive — any of Delivery: Create & Edit, Work Order Part: Create, Work Orders: Create & Edit.

**`POST /api/work-orders/parts/received-later`** — FR-040, FR-041
- Request: `{ partRequestIds: string[] }`
- Auth: the **new** `Received later` atom.
- Sets the parts to the deferred state. Creates no vendor bill, moves no stock, touches no accounting (FR-041).

**`POST /api/work-orders/settings/preview-change`** — FR-010, NFR-003
- Request: `{ setting: string, value: bool }`
- Response: `{ affectedRecords: number, kind: 'parts'|'lines'|'workOrders', warn: bool, advisory: bool }`
- Counts only — changes nothing. `advisory` is true above the D-7 threshold.

**`POST /api/work-orders/lines/{lineId}/parts/reorder`** — FR-049 (Phase 10)
- Request: `{ partRequestIds: string[] }` — the full new order for that line.
- Mirrors `work-orders/lines/change-lines-order`. Refused on an invoiced work order.

### Modified endpoints

- **`POST /api/organizations/settings/change`** (`ChangeSettingController`) — gains `require_ordering_parts`, and triggers the sweep (FR-007) with a resumable cursor (D-6). Response reports what changed and whether the run completed.
- **`POST /api/orders/receive-requested-parts`** (`ReceiveRequestedPartsController`) — cost and tax become **required but zero-permitted** (FR-035). Today `tax` is `?float` with no constraint and per-part cost is not sent at all; both become explicit, with server-side prefill as the source (D-11).
- **`POST /api/inventory/orders/accept`** (`AcceptDeliveryController`) — same validation alignment for the PO page (FR-038's "identical to the receive modal").
- **`POST /api/work-orders/lines/create`** — honours `Require approval for new lines` (FR-004). Today the setting is stored but no line-creation path reads it.

---

## 6. Implementation Phases

Ten phases. Each is independently testable; the dependency chain is stated per phase and no phase depends on a later one.

---

### Phase 1: Parts stop blocking line completion
**Implements:** FR-013, FR-014, FR-015, FR-016, FR-017
**Depends on:** Nothing — this is the starting point
**Also closes:** [SV-8495](https://shopview.atlassian.net/browse/SV-8495), already in the epic

#### Backend changes (`api/`)

| File | Action | Description |
|---|---|---|
| `api/src/VehicleService/WorkOrders/Domain/Line/Service/LineCompletableValidator.php` | Modify | Remove the `validateAllPartRequestsAreFulfilled()` call from `validate()`. Keep the method — `validateWorkOrderIsCompletable()` logic still needs parts rules at work-order level. Keep tech story / mileage / hours / core checks. |
| `api/src/VehicleService/WorkOrders/Domain/Line/Exception/CannotCompleteLineWithUnfulfilledPartRequestsError.php` | Keep | No longer thrown from the single-line path. Still reachable from the work-order path — do not delete. |
| `api/src/LabourBilling/TechnicianTaskRecords/Application/HTTP/CheckOut/CheckOutCommandHandler.php` | Modify | Accept the clock-out variants (FR-017): complete, or send to review when review is required. |

**⚠ Trap for whoever builds this:** `validate()` currently **early-exits at line 38** when the organization has no `Setting` row — skipping *every* check including core resolution. Removing the parts check does not touch that, but any test that relies on "no settings row" will now exercise a different path. Do not treat the early exit as dead code without checking.

#### Frontend changes (`app/`)

| File | Action | Description |
|---|---|---|
| `app/src/components/ts/work-orders/work-order-lines/WorkOrderLines.vue` | Modify | In `getActionButtons` (~1127-1144), drop every parts-derived `restrictNextStatus` reason from the Complete button. Tech story / mileage / engine hours reasons stay. |
| `app/src/components/ts/work-orders/dialogs/ClockInOutDialog.vue` | Modify | Hide the *Line Completed?* toggle (`toggle_complete_line`). Replace the single Stop action with **Clock out** and **Clock out and complete** / **Clock out and send to review**. |
| `app/src/components/ts/tasks/ClockOutDialog.vue` | Modify | Same treatment for the global clock-out dialog (`toggle_line_completed`). |

#### Key code changes

```php
// api/src/VehicleService/WorkOrders/Domain/Line/Service/LineCompletableValidator.php
// FR-013: a line completes whatever the state of its parts.
public function validate(Line|Uuid $line): void
{
    $settings = $this->settingFetcher->findByOrganizationFromSession();
    if (null === $settings) {
        return; // pre-existing early exit — unchanged, see the trap note above
    }

    $this->validateMileage($line, $settings);
    $this->validateHours($line, $settings);
    $this->validateTechStories($line, $settings);
    $this->validateCorePartsAreResolved($line);   // FR-014/FR-015: cores stay

    // REMOVED (FR-013): validateAllPartRequestsAreFulfilled($line)
    // Parts are enforced at work-order level by validateWorkOrderIsCompletable().
}
```

#### Unit / Integration tests
- **BE:** a line with unordered / unpicked / unreceived parts, in every combination, completes. Core-unresolved still throws `CannotCompleteLineCorePartUpdateError`. Tech story / mileage / hours still throw when their setting is on. `validateWorkOrderIsCompletable()` is **unchanged** — regression-test it explicitly.
- **BE:** the SV-8495 repro — complete from the line with an unreceived special-order part — now succeeds.
- **FE:** `WorkOrderLines.spec.ts` — Complete is enabled with outstanding parts; still disabled for a missing tech story.
- **FE:** clock-out dialogs render two actions and no toggle.

#### Verification (Definition of Done gates)
- **Static (scoped):** `composer cs-fix` · `vendor/bin/phpstan analyse` on the changed files · `./vendor/bin/pest` on the mirrored tests · `npx eslint --max-warnings=0` · `npx vitest related --run` · `npx vue-tsc --noEmit`
- **Smoke:** `bin/smoke-test.sh` — no 500s
- **Compile:** Vite up with no errors
- **Browser-walk:** open a work order with an unreceived special-order part as the `admin` quick-login user; complete the line from the row; confirm it completes with no error and the part keeps its status.

---

### Phase 2: Settings page
**Implements:** FR-001, FR-002, FR-003, FR-004, FR-005, FR-006
**Depends on:** Nothing (parallel with Phase 1)

#### Database changes

| Migration/Change | Description |
|---|---|
| `api/migrations/VersionXXX.php` | Add `setting.require_ordering_parts TINYINT(1) NOT NULL DEFAULT 1`; backfill existing rows to `1` (D-3, FR-006). |

#### Backend changes (`api/`)

| File | Action | Description |
|---|---|---|
| `api/src/Organization/Setting/Domain/Setting.php` | Modify | Add `$requireOrderingParts` + `requiresOrderingParts()`. |
| `api/src/Organization/Setting/Infrastructure/Doctrine/Setting.orm.xml` | Modify | Map the new column. |
| `api/src/Organization/Setting/Application/…/ChangeSettingCommandHandler.php` + DTO | Modify | Accept and persist the new setting. |
| `api/src/VehicleService/WorkOrders/Application/Line/Create/…` | Modify | **FR-004** — a new line is created `authorization_required` when approval is required, `authorized` when not. This behaviour does not exist today. |

#### Frontend changes (`app/`)

| File | Action | Description |
|---|---|---|
| `app/src/components/ts/administration/WorkOrderSettings.vue` | Modify | Rename *Automatically Pick Inventory Parts* → **Require picking inventory parts**, bound to `!autoPickInventoryParts` (D-2, mirroring the existing `!autoApproveLines` inversion in the same file). Add the **Require ordering parts** toggle. Replace the *Require Receiving Parts Before Completion* description (FR-003). Group into **Workflow / Line requirements / Parts** with dividers (FR-005). |
| `app/src/api/administration/AdministrationModel.ts` | Modify | Add `requireOrderingParts` to `SettingsData`. |

**⚠ Trap (called out in the PRD):** the toggle labelled *Require Receiving Parts Before Completion* is stored as `requireVendorInvoiceNumber`. The label and field name say different things. **Do not add a second field.**

#### Key code changes

```ts
// app/src/components/ts/administration/WorkOrderSettings.vue
// D-2 / FR-001: the label is the inverse of the stored value.
// This mirrors the Require Approval for New Lines inversion already in this file.
const requirePickingInventoryParts = computed({
  get: () => !settings.value.autoPickInventoryParts,
  set: (v: boolean) => { settings.value.autoPickInventoryParts = !v; },
});
```

#### Unit / Integration tests
- **BE:** default is `true`; a shop upgrading keeps today's behaviour (FR-006). New line status follows the approval setting both ways (FR-004).
- **FE:** `WorkOrderSettings.spec.ts` — the picking toggle reads ON when `autoPickInventoryParts` is `false`, and writes the inverse. The three groups render with dividers.

#### Verification
- **Static (scoped):** as Phase 1
- **Migration gate:** `bin/console doctrine:migrations:migrate --no-interaction`, then `doctrine:migrations:diff --allow-empty-diff` reports **"No changes detected"**
- **Smoke:** `bin/smoke-test.sh`
- **Browser-walk:** `/administration/settings` → Work Orders as `admin`. Confirm the picking toggle reads ON for a shop with auto-pick off, and that saving round-trips.

---

### Phase 3: Line and part action rules
**Implements:** FR-018, FR-019, FR-020, FR-021, FR-048
**Depends on:** Phase 2 (the *Require ordering parts* setting must exist)

This phase is where the **seven part states** land, and it is the foundation the bulk bar counts against.

#### Backend changes (`api/`)

| File | Action | Description |
|---|---|---|
| `api/src/VehicleService/WorkOrders/Domain/PartRequest/UpdatePartRequestsOnLineDeauthorizedEvent.php` | Verify only | **FR-021 already holds.** It demotes only `getPreReceivedStatuses()` — `in_stock`, `quoted`, `authorized_to_order`, `waiting_to_receive` — leaving `requested`, `received`, `returned` alone. Add a regression test; change nothing. |
| `api/src/VehicleService/WorkOrders/Application/View/…` | Modify | Expose the per-part available-actions set so the FE does not re-derive the rules. |

#### Frontend changes (`app/`)

| File | Action | Description |
|---|---|---|
| `app/src/components/ts/work-orders/work-order-lines/helpers.ts` | Modify | Add `lineActionsForStatus()` and `partActionsForState()` as pure functions — the single source for FR-018 and FR-020, shared by the row and the bulk bar. |
| `app/src/components/ts/work-orders/work-order-lines/WorkOrderLines.vue` | Modify | `getActionButtons` delegates to `lineActionsForStatus()`. Hide Complete on Needs Approval and Approve on Approved (both currently offered and both no-ops). |
| `app/src/components/ts/work-orders/PartRequestActionButton.vue` | Modify | Cover all seven states (FR-020). `requested` and `returned` render **nothing**. |
| `app/src/components/ts/work-orders/work-order-lines/PartContextMenuButton.vue` | Modify | FR-048 — Move, Return, Add part fee or discount, then **Receive part** last, only when receiving is optional. |
| `app/src/components/work-orders/ts/WorkOrderLineContextMenuList.vue` | Modify | FR-048 — add **Receive parts (n)** and **Authorization required**; keep Request part hidden on completed lines. |

#### Key code changes

```ts
// app/src/components/ts/work-orders/work-order-lines/helpers.ts
// FR-020: all seven part states. Requested and Returned deliberately render nothing.
export function partActionsForState(state: PartRequestStatus, s: Settings): PartAction[] {
  switch (state) {
    case 'requested':          return [];               // counted in Order(n), no row button
    case 'quoted':
    case 'authorized_to_order': return s.requireOrdering ? ['order'] : [];
    case 'in_stock':            return s.requirePicking  ? ['pick']  : [];
    case 'waiting_to_receive':  return ['receive'];      // caret adds Received later
    case 'received':
    case 'returned':            return [];
  }
}
```

#### Unit / Integration tests
- **FE:** a table-driven spec over all four line statuses × every action (FR-018), and all seven part states × settings on/off (FR-020).
- **FE:** Decline is visible-but-disabled with the exact reason when the line holds received or picked parts (FR-019).
- **BE:** declining a line leaves a `requested` part untouched and moves an `awaiting` part to `quoted` (FR-021).

#### Verification
- **Static (scoped):** as Phase 1 · **Smoke** · **Compile**
- **Browser-walk:** a work order carrying one part in each of the seven states; confirm each row shows exactly what FR-020 specifies, in both Tech View and Full View.

---

### Phase 4: The bulk action bar
**Implements:** FR-022, FR-023, FR-024, FR-025, FR-026, FR-027, FR-028, FR-029, FR-030, FR-031, NFR-004, NFR-005, NFR-007
**Depends on:** Phase 1 (bulk complete), Phase 3 (the action rules it counts against)

#### Backend changes (`api/`)

| File | Action | Description |
|---|---|---|
| `api/src/VehicleService/WorkOrders/Application/Line/ChangeLines/ChangeLinesStatusHandler.php` | Modify | **FR-028** — collect per-line failures instead of throwing on the first. Return `{changed, failures[]}`. |
| `api/src/VehicleService/WorkOrders/UI/HTTP/…/BulkLineStatusController.php` | Create | The endpoint in §5. **NFR-004** — verify every line id against the route's work order and the caller's organization first. |
| `api/src/VehicleService/WorkOrders/UI/HTTP/…/BulkUndoController.php` | Create | FR-026 undo. |
| `api/src/VehicleService/WorkOrders/Application/Service/Part/Request/VendorPartRequestOrderer.php` | Modify | **FR-030** — accept Requested parts; place **only vendor-sourced** ones; skip and never count inventory/found/sourceless parts. |

#### Frontend changes (`app/`)

| File | Action | Description |
|---|---|---|
| `app/src/components/ts/work-orders/work-order-lines/BulkActionBar.vue` | **Create** | FR-022/023/024. Follow the selection-banner pattern in `app/src/components/ts/parts/orders/Orders.vue:9-45`. Replaces the column headers; nothing on the page shifts. |
| `app/src/components/ts/work-orders/work-order-lines/useBulkActions.ts` | **Create** | Counting + slot assignment (D-4, NFR-007), derived from loaded state. Encodes FR-025's Requested exception in one place. |
| `app/src/components/ts/work-orders/work-order-lines/LineActionsMenu.vue` | Modify | Keep select-all; remove the bulk `…` menu that the bar replaces. **Delete lines is not carried over** — bulk deletion is out of scope. |
| `app/src/utils/helpers.ts` | Modify | D-9 — undo affordance on `showSuccessNotification` via the existing `NotifyAction[]`. |

#### Key code changes

```ts
// app/src/components/ts/work-orders/work-order-lines/useBulkActions.ts
// FR-024: fixed slot order. It does NOT reshuffle as parts progress.
const SLOT_ORDER = ['finish', 'completeLines', 'approve', 'order', 'receive', 'pick'] as const;

// FR-025 + FR-030: Requested counts toward Order(n) even though its row has no button.
const orderCount = computed(() =>
  selectedParts.value.filter(p =>
    ['quoted', 'authorized_to_order', 'requested'].includes(p.status)
  ).length
);
// Decline is never a primary slot (FR-024) — it lives in More, always.
```

#### Unit / Integration tests
- **FE:** the show / hide / disable rule (FR-023) across selections — nothing qualifies → hidden; qualifies-but-blocked → disabled with reason; otherwise counted.
- **FE:** declined lines excluded from Approve and Authorization required counts (FR-027); a selection of only declined lines shows **no** Approve button.
- **FE:** slot order is stable while parts progress (FR-024).
- **BE:** a bulk decline of four lines where one holds received parts declines three and reports the fourth (FR-028).
- **BE:** **tenant scoping (NFR-004)** — a line id from another organization is rejected, not silently skipped.

#### Verification
- **Static (scoped)** · **Smoke** · **Compile**
- **Browser-walk:** select mixed-status lines; confirm counts match FR-027, that Decline sits in More, that undo restores only what changed, and that the bar renders `No actions available for this selection` where nothing applies.

---

### Phase 5: Receive modal, Received later, and the new permission
**Implements:** FR-032 – FR-037, FR-040, FR-041, FR-050, FR-051, NFR-008
**Depends on:** Phase 3 (the part row hosts the split button)

#### Backend changes (`api/`)

| File | Action | Description |
|---|---|---|
| `api/src/IAM/AccessControl/Domain/PermissionEnum.php` | Modify | **FR-050** — add the `Received later` atom, format `ROLE_<SUBJECT>::<ACTION>`. |
| `config/packages/security.yaml` + `config/security/all_access_hierarchy.yaml` | Modify | Wire the atom into the hierarchy. |
| `api/src/Auth/Domain/Model/FEPermissionEnum.php` + `Auth/UI/Cli/OneOff/Mapping/FEPermissionMappings.php` | Modify | Expose it as a role-editor bundle, **off by default in every role**. |
| `api/src/Auth/Domain/Model/FEPermissionCascade.php` + `app/src/services/permissions/cascade.ts` | Modify | Cascade rules — these two **must stay in lock-step**. |
| `api/src/VehicleService/WorkOrders/UI/HTTP/…/ReceiveModalController.php` | Create | `GET …/receive-modal` (§5). **D-11 / NFR-008** — prefill cost and tax server-side; omit money fields entirely for a caller without `ROLE_PRICING_VIEW`. |
| `api/src/VehicleService/WorkOrders/UI/HTTP/…/ReceivedLaterController.php` | Create | FR-040/041. Gated on the new atom. Creates no vendor bill, moves no stock. |
| `api/src/Inventory/Orders/Application/HTTP/ReceiveRequestedParts/ReceiveRequestedPartsCommand.php` | Modify | **FR-035** — cost and tax required, zero permitted. |

#### Frontend changes (`app/`)

| File | Action | Description |
|---|---|---|
| `app/src/components/ts/shared/SplitButton.vue` | **Create** | D-8 — primary action + caret. No split button exists in `app/` today. |
| `app/src/components/ts/work-orders/receive/ReceivePartsModal.vue` | **Create** | FR-032/033/034. One card per vendor, **Vendor missing first**. Reuses the field layer from `PurchaseOrderReceiveBlock.vue` rather than duplicating it. |
| `app/src/components/ts/parts/receive/useReceiveView.ts` | Modify | Extract the shared validation/submit so the modal and the PO pages cannot drift (FR-038's "identical to the receive modal"). |
| `app/src/components/ts/work-orders/PartRequestActionButton.vue` | Modify | FR-040 — Receive becomes a `SplitButton` when receiving is required **and** the user holds the new atom; a plain button otherwise. |
| `app/src/components/ts/work-orders/work-order-lines/WorkOrderLines.vue` | Modify | `acceptDelivery` (~2100-2124) opens the modal instead of `router.push({ name: 'Order' })`. |

#### Key code changes

```ts
// app/src/components/ts/work-orders/work-order-lines/WorkOrderLines.vue
// FR-032: receive no longer navigates. Same modal from all four entry points.
function acceptDelivery(part: PartRequest) {
  receiveModal.open({ scope: 'part', partRequestId: part.id });
}
```

#### Unit / Integration tests
- **BE:** a user **without** `See Financial Data` receives successfully — money fields absent from the response and not required on write (FR-051, NFR-008). This is the deadlock the rule exists to prevent; test it explicitly.
- **BE:** one vendor's parts across two purchase orders produce two vendor bills carrying the same invoice number (FR-037).
- **BE:** *Received later* without the atom is refused; with it, no `Delivery` and no `BookkeepingVendorBill` row is created (FR-041).
- **FE:** the split button shows a caret only with the atom (FR-040); *Received later* is never duplicated in the `…` menu while the split button shows.

#### Verification
- **Static (scoped)** · **Smoke** · **Compile**
- **Browser-walk:** receive from a part row, a line menu and the bulk bar — the same modal each time, no navigation. Then repeat as a role without See Financial Data and confirm the receive still completes.

---

### Phase 6: The completion wizard
**Implements:** FR-042, FR-043, FR-044, FR-045
**Depends on:** Phase 1 (completion rules), Phase 5 (the receive step opens the modal)

**The wizard already exists.** This is a redesign and a reordering, not a rebuild — the PRD says so explicitly, and only two things move.

| | Today on `develop` | After this phase |
|---|---|---|
| Steps | Missing details → Pick → Resolve cores → Receive → Success | **Tech stories → Pick → Resolve cores → Receive → Missing details** |
| Tech stories | Separate pre-wizard gate (`TechStoryGateModal.vue`) | Folded in as step 1 |
| Receive | Navigates to the full PO page | Opens the modal from Phase 5 |
| Resolve cores | A working step | **Unchanged** — keeps its grouped rows, counter and invoice preview |

#### Frontend changes (`app/`)

| File | Action | Description |
|---|---|---|
| `app/src/components/ts/work-orders/complete/CompletionWizard.vue` | Modify | Reorder `assembleSteps()` (~873-881); add the `tech-stories` step; pills carry counts; finished steps read-only with a tick; **remove the Continue button** so each step's own action saves and advances (FR-044). |
| `app/src/components/ts/work-orders/complete/TechStoryGateModal.vue` | Modify/retire | Its content becomes the wizard's first step. Keep the component only if it is still reachable outside the wizard. |
| `app/src/composables/useCompletionSession.ts` | Modify | **FR-042** — record which lines the run covers and whether it is heading to an invoice, fixed when the run opens and never inferred later. |

#### Unit / Integration tests
- **FE:** step list contains only outstanding work; a second pass never asks twice (FR-043).
- **FE:** closing mid-run keeps what was done; reopening shows only what is left.
- **FE:** a step the user's role cannot perform is not shown; where it is the only outstanding work the action fails with the reason instead of opening an empty wizard (FR-042).
- **FE:** the three run endings (line/lines → toast; all lines → toast, Mark as reviewed appears; Create invoice → Finance tab).

#### Verification
- **Static (scoped)** · **Compile**
- **Browser-walk:** open the wizard from each of the five entry points; confirm the step order, that Resolve cores still behaves as it does today, and that closing the receive modal returns to the next step.

---

### Phase 7: The settings sweep
**Implements:** FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, NFR-001, NFR-002, NFR-003, NFR-006
**Depends on:** Phase 2 (the settings must exist)
**Prerequisite:** run the §3 prod queries first — they set D-7's threshold.

#### Backend changes (`api/`)

| File | Action | Description |
|---|---|---|
| `api/src/Organization/Setting/Application/Sweep/SettingSweepHandler.php` | Create | One strategy per setting (FR-007). Batched with a resumable cursor (D-6, NFR-001/002). Excludes invoiced/paid work orders and declined lines. |
| `api/src/Organization/Setting/Application/Sweep/SweepCountQuery.php` | Create | **NFR-003** — cheap counts for the confirmation. Indexed, bounded; no full scan per toggle. |
| `api/src/Organization/Setting/UI/HTTP/PreviewChangeController.php` | Create | `POST …/preview-change` (§5). |
| `api/src/VehicleService/WorkOrders/Application/Service/WorkOrder/WorkOrderEventDispatcher.php` | Modify | **FR-008 / D-5** — write an audit entry per changed record, attributed to the acting admin, naming the cause. |

**⚠ Trap:** `WorkOrderEventDispatcher::createPayload()` returns `null` — silently dropping the entry — when there is no `UserInterface` in the session, and `EntityEvent::$userId` is non-nullable. D-5 sidesteps this by always having a real acting user. If a future change runs the sweep headless, the audit trail vanishes without error.

#### Frontend changes (`app/`)

| File | Action | Description |
|---|---|---|
| `app/src/components/ts/administration/SettingChangeConfirmDialog.vue` | Create | FR-010/011 — names the setting and direction, states the consequence and count, uses a **warning** treatment for receiving-on and approval-off. Built on `BaseDialog.vue` per Golden Rule #9. |
| `app/src/components/ts/administration/WorkOrderSettings.vue` | Modify | Call `preview-change` on toggle, show the dialog, and block the UI while the sweep runs (FR-012, NFR-006). |

#### Unit / Integration tests
- **BE:** each of the four settings, both directions, produces exactly the record changes FR-007 lists — and **no** setting change marks anything received.
- **BE:** invoiced/paid work orders and declined lines are untouched (FR-007 negative cases).
- **BE:** **resumability (FR-009/NFR-002)** — kill a run mid-way, re-run, and confirm the remainder completes without repeating.
- **BE:** an audit entry exists on the work order and on each changed line/part, naming the cause (FR-008).
- **FE:** the confirmation shows the right copy and count per setting and direction; cancelling changes nothing.

#### Verification
- **Static (scoped)** · **Smoke** · **Compile**
- **Browser-walk:** on a seeded shop with unapproved lines, toggle *Require approval for new lines* off; confirm the warning, the count, the blocking indicator, and that every line ends Approved with audit entries naming the cause.

---

### Phase 8: The header finish action
**Implements:** FR-046, FR-047
**Depends on:** Phase 1, Phase 6 (Create invoice runs the wizard)

#### Frontend changes (`app/`)

| File | Action | Description |
|---|---|---|
| `app/src/components/ts/work-orders/WorkOrderNavBar.vue` | Modify | Replace `showCompleteButton` (~290-299) with the FR-046 state machine. **Only one finish action is ever on screen.** *Complete Work Order* is retired as a label. |
| `app/src/components/work-orders/ts/WorkOrderNavBarMenu.vue` | Modify | Hold **Create invoice** in the `…` menu while lines are open; remove both actions once an invoice exists. |
| `app/src/components/ts/work-orders/WorkOrder.vue` | Modify | FR-047 — Create invoice runs the wizard when anything is outstanding; its confirmation states the invoice total and how many lines will complete. |

```
FR-046 — the header, in full:
  review off, any line open      → New Line · Send · …(Create invoice)
  review off, all complete       → [Create invoice] · New Line · Send · …
  review on,  any line open      → New Line · Send · …            (no finish action)
  review on,  all complete       → [Mark as reviewed] · New Line · Send · …
  review on,  already reviewed   → [Create invoice] · New Line · Send · …
  lines selected                 → the bulk action bar, whatever the review setting
```

#### Unit / Integration tests
- **FE:** all six header states above (FR-046).
- **FE:** every line declined → no finish action; invoice exists → both gone; user with review but not invoicing sees Mark as reviewed then nothing.
- **FE:** **regression** — deposit auto-apply, over-payment→credit, customer lock, accounting sync and snapshot all still fire from every entry point (FR-047). This is the highest-risk assertion in the plan.

#### Verification
- **Static (scoped)** · **Compile**
- **Browser-walk:** walk all six header states with review on and off; then create an invoice from the header and confirm the Finance tab opens with the payment screen and the deposit path still works.

---

### Phase 9: The receive page and PO bulk receive
**Implements:** FR-038, FR-039
**Depends on:** Phase 5 (shares the validation layer) — otherwise **independent and parallelisable**

#### Frontend changes (`app/`)

| File | Action | Description |
|---|---|---|
| `app/src/components/ts/parts/receive/MultiVendorReceive.vue` | Modify | FR-038 — group by vendor, **Missing vendors first** then alphabetical, all collapsed, rollups per group, vendor count in the page header, amber treatment for missing-vendor groups. |
| `app/src/components/ts/parts/receive/PurchaseOrderReceive.vue` | Modify | FR-039 — a panel expands **per purchase order**, not per vendor. Sell price shown here and only here, read-only. |
| `app/src/components/ts/parts/receive/PurchaseOrderReceiveBlock.vue` | Modify | Align with the modal's validation (FR-035); cost/tax/subtotal/total/sell **absent, not masked**, without See Financial Data. |

#### Unit / Integration tests
- **FE:** ordering and collapse defaults (FR-038); hover reveals Assign vendor on a collapsed row.
- **FE:** the same invoice number may be reused across several of a vendor's POs but is typed per PO, never shared from the group header.
- **FE:** without See Financial Data the money columns are **absent** and receiving still works.

#### Verification
- **Static (scoped)** · **Compile**
- **Browser-walk:** `/parts/bulk-receive` with mixed vendors including missing ones; confirm grouping, collapse, and a successful receive as a role without See Financial Data.

---

### Phase 10: Reordering parts on a line
**Implements:** FR-049
**Depends on:** Nothing else depends on **it** — build last, drop freely

> The PRD states this explicitly: *"Nothing else in this spec depends on it, so it can be built last and dropped without touching anything else."* Keep it that way — no other phase may take a dependency on the stored order.

#### Database changes

| Migration/Change | Description |
|---|---|
| `api/migrations/VersionXXX.php` | `part_request.row_order` + index, with a backfill from current display order, PK as tiebreaker. **Check first** whether an ordering column already exists. |

#### Backend / Frontend changes

| File | Action | Description |
|---|---|---|
| `api/src/VehicleService/WorkOrders/UI/HTTP/…/ReorderPartsController.php` | Create | `POST …/lines/{lineId}/parts/reorder`. Refused on an invoiced work order. Last write wins. |
| Invoice + PDF read paths | Modify | **FR-049's whole point** — the line, the invoice and the PDF read **one** stored order. |
| `app/src/components/ts/work-orders/work-order-lines/WorkOrderLineParts.vue` | Modify | SortableJS drag within the line (D-10), mirroring `WorkOrderLines.vue:1696-1735`. Confirm the drop, offer undo. |

#### Unit / Integration tests
- **BE:** reorder persists; the invoice and PDF read the same order; reorder on an invoiced work order is refused.
- **FE:** dragging across lines is not possible (FR-049 negative case).

#### Verification
- **Static (scoped)** · **Migration gate** · **Smoke** · **Compile**
- **Browser-walk:** reorder parts, generate the invoice PDF, confirm the printed order matches the screen.

---

## 7. Testing Strategy

### Unit tests
- **Backend:** `LineCompletableValidator` (both gates, kept strictly separate); the sweep strategies and their resumability; bulk per-line failure collection; the See-Financial-Data receive path; tenant scoping on every bulk endpoint.
- **Frontend:** `lineActionsForStatus()` / `partActionsForState()` as table-driven specs — these encode FR-018 and FR-020 and are the cheapest place to prove them; `useBulkActions` counting including the Requested exception; the header state machine.
- **Edge cases to watch:** the settings-row early exit in `validate()`; `requested` surviving the decline cascade; one-second timestamp precision when backfilling `row_order`.

### Integration tests
- Complete-from-line with outstanding parts end to end (SV-8495).
- Receive → vendor bill → accounting sync, from the modal and from both PO pages.
- A settings sweep across a shop with hundreds of open work orders, including a mid-run kill and resume.

### Manual testing checklist
1. Complete a line with unordered, unpicked and unreceived parts — every combination.
2. Clock out and complete; clock out and send to review.
3. Toggle each of the four settings both ways; confirm counts, warnings, blocking indicator and audit entries.
4. Select mixed-status lines; verify every count against FR-027 and that undo restores only what changed.
5. Receive from all four entry points; confirm one modal and no navigation.
6. Defer with *Received later*, with and without the atom.
7. Walk all six header states with review on and off.
8. Repeat 5 and 7 as a role **without** See Financial Data.
9. Reorder parts and confirm the invoice PDF matches.

### E2E tests
_Planned in the E2E pass — not yet run for this plan._

---

## 8. Rollback Plan

- **Phases 1, 3, 4, 5, 6, 8, 9, 10** are code-only — revert the commits.
- **Phase 2** adds `setting.require_ordering_parts`. Reverting the code leaves the column unused and harmless; a down migration is available but not required. **The auto-pick inversion is presentation-only (D-2), so no data is at risk.**
- **Phase 7 is the one that cannot be un-run.** The sweep rewrites line and part statuses across a shop. There is **no undo.** Mitigations: the confirmation states the count before anything happens (FR-010); the audit log records every changed record and why (FR-008); and the highest-consequence direction — approval off — is a warning, not a count alone (FR-011). If a shop toggles by mistake, recovery is a manual, audit-log-driven correction. **Say this to Product before Phase 7 ships.**
- **Phase 10** adds a backfilled column; reverting leaves the stored order unread.

---

## 9. Security Considerations

- **Tenant scoping (NFR-004) is the highest-risk area in this plan.** Every new bulk endpoint accepts a list of ids from the client. Each id must be verified against the route's work order **and** the caller's organization before any mutation. A missing check turns a bulk endpoint into a cross-tenant write primitive.
- **NFR-008 / FR-051 — money must not be sent to a client that may not show it.** The receive-modal endpoint omits cost, tax, subtotal, total and sell for a caller without `ROLE_PRICING_VIEW`; it does not send-then-hide. The prefill (D-11) is what lets that user still submit a valid receive.
- **The new `Received later` atom is off by default in every role** (FR-050) and must be granted deliberately. It is the only thing standing between a user and bypassing the vendor-bill requirement.
- **The bulk version of an action carries exactly the same atom as the single version** (FR-051). No bulk endpoint may introduce a weaker gate.
- **`FEPermissionCascade` (BE) and `app/src/services/permissions/cascade.ts` (FE) must stay in lock-step** — a mismatch shows an action the backend will refuse, or hides one the user holds.

---

## 10. Requirement Traceability

| Requirement | Phase | Layer | Files | Status |
|---|---|---|---|---|
| FR-013 – FR-016 | 1 | API | `api/src/VehicleService/WorkOrders/Domain/Line/Service/LineCompletableValidator.php` | Planned |
| FR-013 | 1 | App | `app/src/components/ts/work-orders/work-order-lines/WorkOrderLines.vue` | Planned |
| FR-017 | 1 | App | `app/src/components/ts/work-orders/dialogs/ClockInOutDialog.vue`, `app/src/components/ts/tasks/ClockOutDialog.vue` | Planned |
| FR-017 | 1 | API | `api/src/LabourBilling/TechnicianTaskRecords/Application/HTTP/CheckOut/CheckOutCommandHandler.php` | Planned |
| FR-001 – FR-003, FR-005 | 2 | App | `app/src/components/ts/administration/WorkOrderSettings.vue` | Planned |
| FR-002, FR-006 | 2 | API | `api/src/Organization/Setting/Domain/Setting.php`, `api/migrations/VersionXXX.php` | Planned |
| FR-004 | 2 | API | `api/src/VehicleService/WorkOrders/Application/Line/Create/…` | Planned |
| FR-018 – FR-020, FR-048 | 3 | App | `app/src/components/ts/work-orders/work-order-lines/helpers.ts`, `PartRequestActionButton.vue`, `PartContextMenuButton.vue`, `WorkOrderLineContextMenuList.vue` | Planned |
| FR-021 | 3 | API | `api/src/VehicleService/WorkOrders/Domain/PartRequest/UpdatePartRequestsOnLineDeauthorizedEvent.php` (verify only) | Planned |
| FR-022 – FR-026 | 4 | App | `app/src/components/ts/work-orders/work-order-lines/BulkActionBar.vue`, `useBulkActions.ts` | Planned |
| FR-027 – FR-029, NFR-004, NFR-005 | 4 | API | `api/src/VehicleService/WorkOrders/Application/Line/ChangeLines/ChangeLinesStatusHandler.php`, `BulkLineStatusController.php` | Planned |
| FR-030 | 4 | API | `api/src/VehicleService/WorkOrders/Application/Service/Part/Request/VendorPartRequestOrderer.php` | Planned |
| FR-031 | 4 | API | existing pick path (reused) | Planned |
| FR-032 – FR-034, FR-036 | 5 | App | `app/src/components/ts/work-orders/receive/ReceivePartsModal.vue` | Planned |
| FR-035, FR-037, NFR-008 | 5 | API | `ReceiveModalController.php`, `ReceiveRequestedPartsCommand.php` | Planned |
| FR-040, FR-041 | 5 | App/API | `app/src/components/ts/shared/SplitButton.vue`, `ReceivedLaterController.php` | Planned |
| FR-050, FR-051 | 5 | API | `api/src/IAM/AccessControl/Domain/PermissionEnum.php`, `FEPermissionEnum.php`, `FEPermissionMappings.php` | Planned |
| FR-042 – FR-045 | 6 | App | `app/src/components/ts/work-orders/complete/CompletionWizard.vue`, `app/src/composables/useCompletionSession.ts` | Planned |
| FR-007 – FR-009, NFR-001, NFR-002, NFR-006 | 7 | API | `SettingSweepHandler.php` | Planned |
| FR-008 | 7 | API | `api/src/VehicleService/WorkOrders/Application/Service/WorkOrder/WorkOrderEventDispatcher.php` | Planned |
| FR-010 – FR-012, NFR-003 | 7 | App/API | `SettingChangeConfirmDialog.vue`, `PreviewChangeController.php`, `SweepCountQuery.php` | Planned |
| FR-046, FR-047 | 8 | App | `app/src/components/ts/work-orders/WorkOrderNavBar.vue`, `WorkOrderNavBarMenu.vue`, `WorkOrder.vue` | Planned |
| FR-038, FR-039 | 9 | App | `app/src/components/ts/parts/receive/MultiVendorReceive.vue`, `PurchaseOrderReceive.vue` | Planned |
| FR-049 | 10 | App/API | `WorkOrderLineParts.vue`, `ReorderPartsController.php`, invoice + PDF read paths | Planned |
| NFR-007 | 4 | App | `useBulkActions.ts` | Planned |

Every FR and NFR in §1 appears above.

---

## 11. Verification Tickets

_Filled in by the wizard's ticket phase, once this plan is approved._

| Ticket | Title | Covers | Linked stories | Assignee |
|---|---|---|---|---|
| SV-… | … | … | … | Parth Fadadu |

When all these tickets are marked Done, the feature is ready for QA.

---

## 12. Open Questions & Assumptions

| # | Item | Status |
|---|---|---|
| 1 | **D-7 — the off-hours advisory threshold.** Provisionally 5,000 affected records; the §3 prod queries settle it. | Open, needs the query run |
| 2 | **Cross-spec — the part row anatomy.** SV-9315 removes the part `…` menu that FR-048 fills. One agreed row drawing is still owed. | Raised with Product, unanswered |
| 3 | **Cross-spec — Add Part during Review.** FR-048 hides Request part on completed lines; SV-9315 shows Add Part there. | Raised with Product, unanswered |
| 4 | **Cross-spec — editing an already-ordered part.** Neither spec gates SV-9315's inline Edit on procurement state. | Raised with Product, unanswered |
| 5 | **FR-025's deliberate asymmetry** — Requested is counted in `Order (n)` with no row button. Confirmed intentional by Product; do not "fix" it. | Closed, noted |
| 6 | **Assumption:** Story 19's claim that Uncomplete "is already blocked once the work order is invoiced or paid" is *slightly* off — for **service** work orders the editability flag turns off one status earlier, at `complete`. The plan mirrors the real guard, not the sentence. | Assumption |
| 7 | **Assumption:** D-5's audit attribution (acting admin, cause in the message) satisfies FR-008. Milos delegated the call and scoped it to the approved-lines and review settings. | Assumption |