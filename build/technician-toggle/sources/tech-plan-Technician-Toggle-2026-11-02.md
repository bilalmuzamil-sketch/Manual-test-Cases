# Technician Toggle — Technical Implementation Plan

**Date:** 2026-10-28
**PRD:** https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=977371146 (version 9)
**Jira epic:** [SV-11788](https://shopview.atlassian.net/browse/SV-11788). Stories: SV-11879 (S1), SV-11880 (S2), SV-11881 (S3), SV-11882 (S4), SV-11883 (S5), SV-11884 (S6)
**Design:** https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R (6 pages, 28 before/after screenshots)
**Tech stack:** Symfony 7.4 / Doctrine (api), Vue 3 + Quasar + TanStack Query (app), Playwright (e2e)
**Estimated complexity:** Medium-High. The UI surface is small, but the rollout is delicate: session fingerprint, deploy order, and a release-day evidence migration.

---

## 0. Execution State

_Keep this block current so any agent (or person) can resume mid-flight. This plan may be executed by someone who did not write it._

- **Status:** Not started (plan approved 2026-10-29; verification tickets SV-11962…SV-11969 created)
- **Current phase:** —
- **Last completed:** —
- **Open questions / blockers:**
  - None. Q1–Q4 were answered by Product on 2026-10-28 and are now in the PRD itself (v8 and v9); see §1 Clarifications.
  - **External dependency:** only **Phase B6b** (the S3-R10 "Nothing here yet" text and the "Set Up Technicians" button) waits on SV-11555 / PR #3996 (base `main`, open) reaching `develop`. **B6a** (the "No technicians yet" text, which already exists on `develop`) ships in Release B with B1.

> 🛑 **About to implement this plan? Run it as `/loop /implement <this-file>`.** This plan is meant to be executed by the `/implement` orchestrator inside a `/loop`. That combination adds the code-review loop, the Phase 5 runtime gates (migration / compile / smoke / browser-walk), and phase-by-phase hands-off execution. Free-hand implementation skips all of it. E2E coverage is not part of `/implement`: run `/e2e-after-change` before `/create-pr`.
>
> - **However you were handed this** ("implement it", "here's the path, do it", or a single phase), do **not** start editing code directly. Route through `/loop /implement <this-file>` (or `/loop /implement Phase N from <this-file>` for one phase). That *is* doing the implementation, just with the gates. Announce that you're routing through `/loop /implement` and proceed; no need to ask.
> - **If you are ALREADY running under `/loop /implement`**, ignore the routing part of this note and continue. You're in the right place. But the `/loop` session is **orchestrator-only**: every code edit, including a one-line review or runtime-gate fix, goes through `be-implementer` / `fe-implementer` (or the matching test-writer). You dispatch, run the runtime gates, and keep this Execution State current, but you never edit code yourself.
> - **If you are a sub-agent** (`be-implementer`, `fe-implementer`, …) without orchestration tools, do **not** invoke `/loop` or `/implement`. That's the orchestrator's job. Execute only the scope you were handed and report back.
> - **Precedence:** only a *live, explicit* user instruction to the contrary wins. If the user in this session says to implement directly or skip the loop, honor that. Being handed just the plan path is **not** such an instruction; absent one, default to `/loop /implement` without asking.

> 🎨 **Design access.** Design files are never copied into the repo or shipped with this plan; open them from the link. This one is a `claude.ai/artifact/<id>` canvas: open it with the **Artifact** tool (`action: "read"`, then `action: "list", scope: "files"` and read `project/*.dc.html` plus `project/shots/*.png`). WebFetch and curl return 403. Project sub-agents (`be-*`, `fe-*`, `e2e-implementer`) don't have this tool, so the orchestrator opens the link and passes what a phase needs (the boards it cites) into the agent's prompt.

> ⚡🔒 **Performance and security are top priorities for every phase.** Before writing code, read §9. Every new read path must be paginated or bounded, tenant-scoped, and backed by an index, with no N+1 or per-row fan-out. Every new endpoint must enforce authorization. Where §9 says data is derived or backfilled, keep it up to date on the write paths it lists. When a phase is dispatched, the orchestrator includes the §9 items that phase touches in the implementer's prompt.

> 🚦 **Two releases, in order.** **Release A** = Phase A1 only (users see nothing). **Release B** = Phases B1–B6a, plus B6b if SV-11555 has reached `develop` (otherwise B6b follows on its own). Release B's migration must run only where Release A's code is already **deployed and serving** (not merely merged). See §3 D13 and §8.

---

## 1. Requirements (extracted from PRD)

Requirement IDs are the PRD's own, used verbatim. Full text lives in the PRD; the one-line gist is here.

### Story 1 (SV-11879): Technician setting on a role
- **S1-R1**: Third Cross-Cutting card "Technician" (exact title and description) on Create, Edit and Duplicate Role.
- **S1-R2**: "New" pill top-right of the title until 07:00 UTC on release + 7 days, also disappearing in an already-open page.
- **S1-R3**: Nothing changes until save. On **Edit Role** the Confirm Permission Updates window lists Technician under Added or Removed (unless "Don't show this dialog again"). **Create Role and Duplicate Role save straight away with no window, as today** (confirmed by Product, PRD v8).
- **S1-R4**: The saved change applies to every technician list on next load.
- **S1-R5**: Turning it on never warns; turning it off may warn (S2).
- **S1-R6**: View Permissions shows the card read-only, with the pill.
- **S1-R7**: Duplicate Role copies it. **Nothing opens the Duplicate Role screen today and this feature adds no entry point** (confirmed by Product, PRD v8); S1-R1 and S1-R7 apply wherever it is opened from.
- **S1-R8**: Technician and Foreman templates start on; others off. Reset To Template restores it.
- **S1-R9**: A new organization gets it on for Technician and Foreman.
- **S1-R10**: A Technician-only save never logs anyone out. Other permission changes do, as today. Rename and description changes never do.
- **S1-N1**: Built-in Office User and Time Clock User: switch off, grayed, tooltip "This role can't be a technician." Custom roles (including duplicates) are never grayed.
- **S1-N2**: No 'Settings → App Settings' means no access, as today.
- **S1-N3**: No audit record.
- **S1-E1**: Time Clock off means not on the lists.
- **S1-E2**: A role change on staff applies on save.
- **S1-E3**: Open screens refresh on the next load. Back within 30 s shows the old board. The lead dialog refreshes on every open.
- **S1 Error handling**: Built-in role edit refused with the existing **"Role is not editable."** message. Product corrected the §8 table to match in PRD v9, so there is one message, not two.
- **Out of Scope, staff window**: its own fields do not change, but its role-permissions link shows the role's Technician card, read-only and with the "New" pill (confirmed by Product, PRD v9). It reuses `PermissionSummary.vue`, so S1-R6's change delivers this with no extra file — see Phase B3.

### Story 2 (SV-11880): Warning before turning Technician off
- **S2-R1**: Count the open work of active, clockable people on the role, across all locations: WOs they lead plus non-declined lines (labor, Add Technician, or the line's own tech) on service WOs in Estimate, Approved, In Progress or Ready for Review. Deduplicated.
- **S2-R2**: "Turn Off Technician" window naming the people count, the role name as last saved, and what they hold.
- **S2-R3**: Exact copy variants.
- **S2-R4**: Cancel / Save; Cancel, X and Esc keep the role unsaved; click-outside does nothing; Save shows a loading state.
- **S2-R5**: Nothing is unassigned.
- **S2-N1**: No warning when nothing is counted.
- **S2-N2**: No warning when not turning off.
- **S2-E1**: Excluded statuses and types.
- **S2-E2**: Inactive or Time Clock off people are not counted.
- **S2 Error handling**: Counts fail → save proceeds.

### Story 3 (SV-11881): Who appears on the technician lists
- **S3-R1**: Offered = role has Technician + Time Clock on + active + enrolled at the location.
- **S3-R2**: Board columns and Tech View groups for offered people, plus leads of shown work.
- **S3-R3**: The Technician filter matches the board.
- **S3-R4**: Assign/Reassign lead offers only S3-R1. A current non-tech lead is last and labeled "Current · no longer assignable".
- **S3-R5**: Lead Technician dropdown.
- **S3-R6**: Add Technician (New and Edit Line) and the Edit Labor dropdown.
- **S3-R6a**: Part sales unchanged.
- **S3-R7**: A non-tech lead still shows. In the dropdown they are last, grayed, with a check, and not pickable.
- **S3-R7a**: Read-only "Unassigned" fallback.
- **S3-R8**: People on a line stay. Edit Labor shows them grayed in name order. In Edit Line they are a removable chip (lock if they have logged time). Saving keeps them, while the as-today drop of non-Time-Clock labor people stays.
- **S3-R9**: Time sheets, Punch Clock, reports and schedule are unchanged.
- **S3-R10**: Empty-state copy and the "Set Up Technicians" button → Roles & Permissions.
- **S3-N1**: Non-technicians are not offered (unless E1 or E2 applies).
- **S3-N2**: Office User and Time Clock User are never offered.
- **S3-N3**: The server never refuses a non-technician.
- **S3-E1**: A non-tech lead keeps a column.
- **S3-E2**: A pinned non-tech keeps a column. A drop on it is refused with "This technician can't be assigned work orders."
- **S3-E3**: Start / record time unchanged.
- **S3 Error handling**: If the technicians list fails, the pickers keep what they had.

### Story 4 (SV-11882): Staff list column and notice
- **S4-R1**: Read-only "Technician" Yes/No badge left of Billable, on both tabs. Deactivated means No.
- **S4-R1a**: Not location-dependent.
- **S4-R2**: Sortable.
- **S4-R3**: "New" pill on the header.
- **S4-R4**: Notice text and placement.
- **S4-R5**: The notice can't be closed and retires with the pill.
- **S4-N1**: Permission gate, as today.
- **S4-N2**: Nothing shows after the end date.
- **S4-E1**: Value changes only via the role or Time Clock.
- **S4 Error handling**: No new failure paths. The notice still shows when the list fails to load (S4-R4).

### Story 5 (SV-11883): Public API
- **S5-R1**: Read-only `technician` on staff records (same rule as S4-R1).
- **S5-R2**: Changelog entry.
- **S5-N1**: Not settable. A PATCH carrying it succeeds and ignores it.
- **S5-E1**: Roles are not exposed.
- **S5 Error handling**: No new failure paths.

### Story 6 (SV-11884): Release day
- **S6-R1**: Per org and per role (built-in and custom), on when ≥1 active, clockable user meets (a) a WO time entry in the last 90 days (part sales included, department time excluded), (b) lead, line own tech, Add Technician or labor on a non-declined line of a service WO in Approved, In Progress or Ready for Review, or (c) Billable.
- **S6-R2**: Other roles off. Office User and Time Clock User always off.
- **S6-R3**: Technician and Foreman templates on.
- **S6-R4**: No staff record changes.
- **S6-R5**: Nobody logged out.
- **S6-R6**: Open work untouched.
- **S6-N1**: A role with no evidence starts off.
- **S6-E1**: Ex-technicians keep their work.
- **S6-E2**: Exclusions for (b).
- **S6-E3**: Runs once. Later shop choices stick.

### NFRs (introduced by analysis)
- **NFR-001**: The `technician` bundle is session-neutral. `SymfonyUser::fingerprintPermissionCodes()` ignores it. Pinned by unit and functional tests. A session-neutral bundle may never map to a BE atom (test).
- **NFR-002**: The S2 count is one request, organization-scoped only (deliberately no workplace scope), using `wo__tech_assigned_id_idx`, `wol__tech_assigned_work_order_idx`, `wolt__staff_id_idx` and `wot__tech_assigned_work_order_idx`. Never route-cached.
- **NFR-003**: Each technician-list query adds at most one EXISTS on `v2_role_fe_permission` (PK `role_id, fe_permission_id`). No per-row fan-out. `WorkOrderBoardStatementBudgetTest` stays green.
- **NFR-004**: The release migration reads evidence with one non-locking SELECT, then makes chunked, idempotent INSERTs touching only `v2_role_fe_permission` / `v2_role_template_fe_permission`.
- **NFR-005**: Tenant scoping follows each sibling query (`OrganizationDecorator` / `WorkplaceDecorator`).
- **NFR-006**: The staff-list `technician` sort is a whitelisted alias in `$sortFields`.
- **NFR-007** (from D13): Release B's grant migration runs only after Release A's fingerprint exclusion is serving in that environment.

### Clarifications & PRD comment outcomes

| Question | Asked via | Answer |
|----------|-----------|--------|
| Intake: anything the PRD won't say? | intake | "Nothing to add — analyze the PRD as-is." |
| Stories exist and cover all 66 requirements | prd-review (Accepted #1) | SV-11879…SV-11884 created by Product |
| "labor lines" wording while counting Add Technician lines | prd-review (Accepted #2) | Keep "labor lines" |
| Time sheet / Time Clock lists exclude Office User and Time Clock User by name | prd-review (Accepted #3) | As today |
| Where is the existing build cited in the design and the verdict? | user | No build exists on any `origin` ref. Plan against `develop`, PRD scope only, all new. |
| How to store Technician without logging people out | user | Engineering's call. Keeping it in the session is OK if nobody is logged out → D11 |
| Release-day step: default flag vs evidence | user | Explained that a default alone breaks S6-R1/S6-N1 → evidence migration (D12) |
| Size of the 90-day evidence window | prod query (2026-10-28) | `SELECT COUNT(*) FROM technician_task_record WHERE start_date >= NOW() - INTERVAL 90 DAY AND work_order_id IS NOT NULL` → **246,079**. Top tenants: 9,791 / 6,852 / 6,059 / 5,191 / 4,868. `v2_role`: **9,774 roles / 879 orgs**. Set-based migration is safe. |
| Migrations run before the API rolls → old code logs people out | user | **Two releases** (D13) |
| Q1 Confirm window on Create/Duplicate | Confluence comment 983171073 | **Answered 2026-10-28.** Keep it as today: the window shows on Edit Role only; Create Role and Duplicate Role save straight away. Now in S1-R3 (PRD v8). |
| Q2 Duplicate Role has no entry point | Confluence comment 983171073 | **Answered 2026-10-28.** No new entry point for Duplicate Role in this feature. Now in S1-R7 (PRD v8). |
| Q3 "Role is not editable." vs "This role can't be a technician." | Confluence reply 983040008 | **Answered 2026-10-28.** "Role is not editable." The §8 row was left over from an earlier draft and Product fixed it (PRD v9). |
| Q4 Technician card in the staff window's role-permissions panel | Confluence reply 983040008 | **Answered 2026-10-28.** It shows. The staff window's own fields do not change, but its role-permissions view shows the role's Technician card, same as View Permissions. Out of Scope reworded (PRD v9). |

## 2. Architecture Overview

Technician is a **permission bundle that grants no access**. It sits beside the existing cross-toggles `seeFinancialData` / `seeApArData` / `viewHistoryLogs` (the last is live in the DTO but its card is hidden in the UI, so Technician is the 4th wire key and the 3rd visible card) in `v2_role_fe_permission` and rides the existing Cross-Cutting machinery: create/change DTOs, scalar↔bundle reconciliation, templates, Reset To Template, Duplicate and the diff modal. Its single special property is that the session fingerprint ignores it.

```
Role (v2_role) ──< v2_role_fe_permission >── v2_fe_permission{code='technician'} ──(no atoms)
      │                                              ▲ excluded from SymfonyUser::fingerprintPermissionCodes()
      ▼
"offered as technician" = EXISTS(role holds 'technician') ∧ staff.clockable ∧ user.is_active ∧ enrolled here
      │
      ├─ LeadTechnicianEligibilityPredicate::condition()  → board columns / Tech View / Technician filter / lead dialog
      │                                                      (eligibleInLocation; leads-with-work and pins still admitted)
      ├─ GET /api/technicians  → population UNCHANGED, + per-row `technician` bool
      │        ├─ OrderStatusCard (Lead Technician)    filters technician=true; current non-tech lead appended disabled
      │        ├─ LineTechnicianRoster (Add Technician) hides notOffered
      │        ├─ AddLabourDialog (Edit Labor)           grays notOffered
      │        └─ TimeSheets / Punch Clock / Part Sale   ignore the flag (S3-R9)
      ├─ GET /api/staff        → + `technician` (active ∧ clockable ∧ bundle), sortable
      └─ GET /api/v1/staff*    → + `technician` read-only
GET /api/roles/{id}/technician-open-work → S2 warning counts (org-scoped)
Migration (Release B) → evidence → INSERT grants (session-neutral ⇒ no logout, given Release A is live)
```

The board, Tech View, Technician filter, the "Current · no longer assignable" entry, pin survival and the refused-drop copy **already exist**. They are server-decided through `eligibleInLocation` and `takesNewWork`, so narrowing the predicate is the whole change for S3-R2/R3/R4/E1/E2.

## 3. Technical Decisions

- **D1**: Former technicians get `notOffered: true` on picker options, **not** `disabled`. `LineTechnicianRoster.vue` `withoutKnownIneligible` strips `disabled` ids from every Edit Line save, so reusing it would remove ex-technicians from lines and break S3-R8. `disabled` keeps its existing meaning: "has labor but is outside the location's Time Clock list".
- **D2** (revised during requirement mapping): `GET /api/technicians` keeps today's population and adds `technician: bool`. Narrowing happens in the three pickers. The predicate (board/candidates) narrows server-side. The reason: one fetch in `WorkOrder.vue` feeds both the line pickers **and** TimeSheets. PunchClockActivities and PartSale use it too, and S3-R9 forbids narrowing those. Rejected: a narrowed default plus opt-out params on five callers.
- **D3**: The built-in exclusion uses `Role::getUneditableTemplates()` + `isDefault`. Those roles never hold the bundle (the domain strips it on create, and `Role::change()` already refuses edits). The name exclusion stays where it is today.
- **D4**: The S2 count is an organization-scoped endpoint in the Auth context.
- **D5**: The staff list and Public API get a server-computed `technician`. It is read-only on the API and absent from `StaffUpdate`.
- **D6**: S5-R2 → `docs/api/v1/changelog.md` "Unreleased -- Additive", plus `api/openapi/openapi.yaml` `Staff` schema and `docs/api/v1/sync-guide.md`.
- **D7**: S3-R10 is split. **B6a** swaps the Board View / Tech View "No technicians yet" text, which already exists on `develop` (`WorkOrdersBoardViewDisplay.vue:63`, `WorkOrdersTechViewDisplay.vue:223`), and ships in Release B with B1. B1 is what makes that empty state common, so it must not ship with the old "Add technicians…" text. **B6b** ("Nothing here yet" text, button label and target) waits on SV-11555 (#3996), which adds `AddTechnicianButton.vue`, `useAddTechnician.ts` and the first-run `noTechnicians` state.
- **D8**: Pill and notice expiry use one `BadgeBearing` const and `useBadgeExpiry()`, with a new shared `NewPill.vue` (two consumers, placement unlike the display switcher's).
- **D9**: The new concept is named `Role::TECHNICIAN_CAPABILITY` / `Role::offersAsTechnician()`, because the existing name-based `isTechnicianRole()` means something else.
- **D10**: Branch off `develop`.
- **D11** (user-guided): Technician is a session-neutral bundle (`FEPermissionEnum::technician`, zero atoms). `FEPermissionEnum::sessionNeutralBundles()` is filtered out in `SymfonyUser::fingerprintPermissionCodes()`, the single hash with one production caller. Filtering in `RoleRepository::getFEPermissionCodesByRoleId()` is rejected because `InspectionInstanceAccessGate` and `AccountingJwtGenerator` (`:200`, filtered by `accountingHubBundles()`, so `technician` never reaches the hub JWT) also read it. Rejected alternative: an `is_technician` column (new DTO field, template field, FE serializer channel, diff-modal special case).
- **D12**: Release day uses a hand-written Doctrine **data migration** (the sanctioned exception, precedent `Version20260915131500`). It reads evidence with one non-locking SELECT, then makes chunked INSERTs of 1000 role ids, guarded by `NOT EXISTS`. Prod numbers: 246k evidence rows, 9.8k for the top tenant, 9,774 roles. A single `INSERT … SELECT` over the evidence tables is rejected because it would take shared locks on `technician_task_record` / `work_order` while staff clock in (same lock class as the 2026-10-02 `work_order_part` incident).
- **D13** (user, 2026-10-28): **Two releases.** `prod-deploy.yml` runs `doctrine:migrations:migrate` as a one-off task before `update-service` rolls the API. In a single release, the grant migration would land while old code still hashes `technician` into the fingerprint, logging out everyone on a granted role. Release A ships the bundle, the fingerprint exclusion and the optional DTO key, as a tech release `vYY.WW.P.N`. Release B ships everything else. Rejected: a post-roll CLI grant, which leaves minutes of near-empty technician lists.
- **D14**: `crossToggles.technician` is **optional** on the wire (`Assert\Optional`). On change, a missing key **keeps the current value**; on create it means false. This keeps stale SPA tabs and the E2E role factories working, and stops a stale tab silently stripping Technician. The FE always sends it.
- **D15**: The release migration covers every role except built-in Office User / Time Clock User, including built-in roles such as Parts Manager (PRD S6-R1 "built-in and custom").
- **D16**: The S2 response is a plain array (`{people, workOrders, lines}`) because the shared normalizer would snake_case a DTO. Don't alias a SQL column `lines` (reserved in MySQL).
- **D17**: The S2 counts call is an imperative API call, not a TanStack query (a save-time one-shot, like `checkExistingRole`).
- **D19**: Evidence (a) counts a time entry when `work_order_id IS NOT NULL AND work_order_id != ''`, which is the Technician Utilization report's own test for work-order time (`DbalTechnicianUtilizationFetcher.php:281`). The empty-string sentinel is excluded. A row carrying both a department and a work order is still a time entry on a work order, so it counts. That can only turn Technician **on**, the direction PRD S6 prefers ("no shop loses a technician").
- **D18**: The S2 warning runs **first** in `EditRole`'s save chain (S2-R1 "before anything else"): technician check → similar-role check → diff modal → `executeSubmit`.

No new dependencies.

## 4. Database Changes

No schema changes: no new tables, columns or indexes. Two **data** migrations:

| Migration | Release | Writes |
|---|---|---|
| **Migration A**: seed the `technician` bundle | A | `v2_fe_permission` row (`code = name = 'technician'`); `v2_role_template_fe_permission` rows for templates `technician`, `foreman` |
| **Migration B**: release-day evidence grants | B | `v2_role_fe_permission` rows for evidence roles; re-asserts the template snapshot |

```sql
-- Illustrative shape only, NOT the migration to copy-paste
INSERT INTO v2_fe_permission (id, code, name)
SELECT :id, 'technician', 'technician' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM v2_fe_permission WHERE code = 'technician');
```

> ⚠️ Migrations are written **by hand** and verified as a no-op with `bin/console doctrine:migrations:diff --allow-empty-diff` ("No changes detected"). DBAL's schema tools choke on functional/expression indexes in this repo, so the real migration is produced by the implementer against the live schema. Hand-authored FKs must be registered in `MANUALLY_MANAGED_FOREIGN_KEYS`. See `api/.claude/reference/database.md`. Neither migration adds an FK or index. No `skipIf()` (`MigrationSkipRatchetTest`).

### Data migrations
- **Migration B evidence** (S6-R1). See Phase B5 for the SQL. Roles whose people meet (a), (b) or (c) get the bundle. Built-in Office/TimeClock are excluded with the NULL-safe form `(r.is_default = 0 OR t.slug IS NULL OR t.slug NOT IN (...))`. The cutoff is computed once in UTC.
- **Maintenance:** none. This is a one-off seed. Afterwards the value is owned by role saves (S1), templates (`RoleFePermissionMappings`) and new-org bootstrap.
- **Ops rule:** after release, never run `app:assign-fe-permissions-to-role`. It would re-grant Technician to every seeded Technician/Foreman role and override shop choices (S6-E3).
- **`down()`**: pre-release rollback only. Migration B's `down()` deletes **every** Technician grant, because post-release grants can't be told apart (Product's PRD-review verdict comment on the PRD page, "For engineering" #4).

## 5. API Changes

### New endpoints

**`GET /api/roles/{id}/technician-open-work`** (Phase B2)
- `#[IsGranted(PermissionEnum::ROLE_ROLE_CREATE_AND_EDIT)]`, `requirements: ['id' => Requirement::UUID]`. Never route-cached.
- 200: `{"data": {"people": 11, "workOrders": 81, "lines": 504}}`.
- Bounded by construction (aggregate counts, not a list). Scoped by organization only, per S2-R1 ("across every location"); deliberately no `WorkplaceDecorator`, as the docblock states.
- Errors: 404 for a non-UUID or unknown/foreign-org role (`ResourceNotFoundError::forResource('Role')`); 403 without the atom; 401 when unauthenticated.

### Modified endpoints

| Endpoint | Change | Phase |
|---|---|---|
| `POST /api/roles`, `PUT /api/roles/{id}` | `crossToggles.technician?: bool` (optional, D14). PUT on a built-in Office/TimeClock role returns 400 "Role is not editable." (existing). | A1 |
| `GET /api/roles/{id}` (and PUT response) | `cross_toggles.technician: bool`; `fe_permissions` includes `{id, name:'technician', code:'technician'}` when on | A1 |
| `GET /api/fe-permissions` | includes the `technician` row | A1 |
| `GET /api/role-templates/{templateId}/fe-permissions` | includes `technician` for the Technician and Foreman templates | A1 |
| `GET /api/technicians[?clockableOnly=1]` | rows gain `technician: bool`; population unchanged; `clockableOnly` still a no-op | B1 |
| `GET /api/work-orders/board…`, `GET /api/work-orders/lead-technician-candidates` | shape unchanged; `eligibleInLocation` and candidate membership include the bundle rule | B1 |
| `GET /api/staff` | rows gain `technician: bool`; `pagination[sortBy]=technician` | B3 |
| `GET /api/v1/staff`, `/v1/staff/{id}`, `/v1/locations/{id}/staff` | `technician: boolean` (readOnly); not in `StaffUpdate`; `PATCH` ignores it | B4 |

## 6. Implementation Phases

### Phase A1: session-neutral Technician bundle (RELEASE A, tech release)
**Implements:** S1-R10 (mechanism), S1-R9 (mapping), S1-R8 (template snapshot), S1 Error handling (confirmed), S6-R3, S6-R5 (precondition), NFR-001, NFR-007
**Depends on:** nothing. **Ships alone, as tech release `vYY.WW.P.N`** (see `.claude/reference/versioning.md` § "Tech release"; `app/package.json` not bumped). Users see nothing: no role holds the code yet and the old FE ignores it.

#### Database changes:
| Migration/Change | Description |
|-----------------|-------------|
| `api/migrations/Version<ts>.php` (Migration A) | Seed `v2_fe_permission` `technician`; attach to the `technician` and `foreman` templates. Idempotent `NOT EXISTS`. `down()` removes grants, snapshot rows and the catalog row (pre-release only). |

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Auth/Domain/Model/FEPermissionEnum.php` | Modify | `case technician = 'technician';` (62nd); `public static function sessionNeutralBundles(): array { return [self::technician]; }` |
| `api/src/Auth/UI/Cli/OneOff/Mapping/FEPermissionMappings.php` | Modify | `['code' => FEPermissionEnum::technician, 'name' => 'technician', 'permissions' => []]` |
| `api/src/Auth/UI/Cli/Command/RoleFePermissionMappings.php` | Modify | Add `technician` to `Foreman` and `Technician` only (covers `RegisterCommandHandler`, `InsertDefaultRolesCommand`, `SandboxOrganizationFactory`, `app:insert-role-template-bundles`, fixtures) |
| `api/src/Auth/Domain/Model/Role.php` | Modify | `TECHNICIAN_CAPABILITY`, `offersAsTechnician()` (via the existing private `hasFEPermissionCode()`), `?bool $technician = null` on `create()`/`change()`, `normalizeViewModeAndCrossToggles()` strips the code when false **or** when built-in uneditable, `getCrossToggles()` gains `technician` |
| `api/src/Auth/UI/Http/RequestDto/CreateRoleRequestDto.php`, `ChangeRoleRequestDto.php` | Modify | `'technician' => new Assert\Optional([new Assert\NotNull(), new Assert\Type('bool')])`; others stay required, `allowExtraFields: false` |
| `api/src/Auth/Application/Command/CreateCommand.php`, `ChangeCommand.php` | Modify | phpdoc shape `technician?: bool` |
| `api/src/Auth/Application/Handler/CreateCommandHandler.php` | Modify | `$technician = $crossToggles['technician'] ?? false;` → `mergeScalarDerivedBundles` + `Role::create(..., technician:)` |
| `api/src/Auth/Application/Handler/ChangeCommandHandler.php` | Modify | `$technician = $crossToggles['technician'] ?? $role->offersAsTechnician();` (D14), so an old FE that drops the code from `fePermissions` doesn't strip it |
| `api/src/Auth/Application/DTO/RoleViewOutputDto.php` | Modify | default `crossToggles` gains `'technician' => false` |
| `api/src/IAM/Infrastructure/Security/Symfony/SymfonyUser.php` | Modify | `fingerprintPermissionCodes()` filters `sessionNeutralBundles()` before sort and hash |
| `api/src/Auth/Domain/Model/FEPermissionCascade.php` | Modify | docblock: `technician` explicitly not cascaded |
| `api/.claude/reference/permissions-and-roles.md` | Modify | 62 bundles; session-neutral concept; optional key semantics |

#### Frontend changes (`app/`):
None in Release A.

#### Key code changes:
```php
// api/src/IAM/Infrastructure/Security/Symfony/SymfonyUser.php
public static function fingerprintPermissionCodes(array $codes): string
{
    // SV-11788: session-neutral bundles grant no access; a change to them must never drop a session (S1-R10, S6-R5).
    $neutral = array_map(static fn (FEPermissionEnum $b): string => $b->value, FEPermissionEnum::sessionNeutralBundles());
    $codes = array_values(array_diff(array_unique($codes), $neutral));
    sort($codes, SORT_STRING);

    return sha1(implode('|', $codes));
}
```
```php
// api/src/Auth/Domain/Model/Role.php
/** SV-11788 — "offered as a technician". Grants no atom; NOT the name-based isTechnicianRole(). */
public const TECHNICIAN_CAPABILITY = FEPermissionEnum::technician;

public function offersAsTechnician(): bool
{
    return $this->hasFEPermissionCode(self::TECHNICIAN_CAPABILITY->value);
}
```

#### Unit / Integration tests:
- **Update** (count pins): `tests/Unit/Auth/Domain/Model/FEPermissionEnumTest.php` (61→62; rename tests; `ACTIVE_CAMELCASE_BUNDLES`), `tests/Unit/Auth/UI/Cli/Command/RoleFePermissionMappingsMatrixTest.php` (`foremanExpected`, `technicianExpected`), `tests/Unit/Auth/Application/DTO/RoleViewOutputDtoTest.php`, `tests/Unit/Auth/Application/Command/ChangeCommandTest.php`. Run all of `tests/{Unit,Functional}/Auth`.
- **New, `SymfonyUserTest`**: `testFingerprintIgnoresTheTechnicianBundle`, `testIsEqualToReturnsTrueWhenOnlyTechnicianDiffers`. The existing `testIsEqualToReturnsFalseWhenSeeFinancialDataIsGranted` stays green.
- **New, `FEPermissionMappingsTest`**: `testTechnicianMapsToZeroAtoms`, `testSessionNeutralBundlesGrantNoAtoms`.
- **New, `RoleTest`**: technician true/false on create and change; `null` keeps; built-in Office/TimeClock created with the code has it stripped; a custom role with Office provenance keeps it; `change()` on built-in Office throws "Role is not editable.".
- **New, migration unit test** (pattern `AccountingPermissionSeedMigrationTest`): writes only to the two tables, every INSERT guarded, constants equal the enums.
- **New, functional `RoleApiContractTest`**: create with or without the key; PUT without the key keeps the value; PUT with false strips it; non-bool gives 400; built-in Office PUT gives 400 and no grant row.
- **New, functional `RoleChangeSessionInvalidationTest`**: a Technician-only toggle keeps the session (200); rename plus Technician keeps it; Technician plus seeFinancialData drops it (409).

#### Verification (Definition of Done gates):
- **Static (scoped):** `composer cs-fix`, `vendor/bin/phpstan analyse <changed files>` (clear the result cache first), `./vendor/bin/pest` on changed and mirrored tests.
- **Migration gate:** `doctrine:migrations:migrate`, then `doctrine:migrations:diff --allow-empty-diff` gives "No changes detected". Re-run the migration: no new rows.
- **Smoke:** `bin/smoke-test.sh`. No 500s; `GET /api/fe-permissions` lists `technician`.
- **Manual session check:** log in as `tech`. As `admin`, add the `technician` code to the tech's role through the API. The tech's next request returns 200, not 409.
- **Browser-walk:** none (no UI change). Confirm the current FE role editor saves an existing role without a 400 (the optional key).

#### E2E tests (e2e/):
- None. `/e2e-after-change` stamps a pre-approved §8 reason (no FE diff).

---

### Phase B1: technician lists narrow + the `technician` flag (RELEASE B)
**Implements:** S3-R1–R7a, S3-R8, S3-R9, S3-N1, S3-N2, S3-N3, S3-E1, S3-E2, S3-E3, S3 Error handling, S1-R4, S1-E1, S1-E2, S1-E3, NFR-003, NFR-005
**Depends on:** A1 **deployed**. 🔴 **Must never be deployed anywhere without B5**, or every role except Technician/Foreman leaves the board in that environment. Merge B1 and B5 in the same PR, or B5 first.

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/VehicleService/WorkOrders/Infrastructure/Persistence/Query/Dbal/LeadTechnicianEligibilityPredicate.php` | Modify | `condition()`: add `EXISTS (SELECT 1 FROM v2_role_fe_permission erfp INNER JOIN v2_fe_permission efp ON efp.id = erfp.fe_permission_id WHERE erfp.role_id = er.id AND efp.code = :leadEligibilityTechnicianCapability)` inside the active-account subquery; `RESERVED_ALIASES` gains `erfp`, `efp`. `enrolledInCurrentLocation()` unchanged (pins, S3-E2). |
| `api/src/Staff/Staff/Application/Listing/ListingQueryHandler.php` | Modify | Select `CASE WHEN EXISTS(… trfp.role_id = r.id AND tfp.code = :technicianCapability) THEN 1 ELSE 0 END AS technician`; cast to bool; WHERE unchanged; docblock on why it flags instead of filtering (D2) |

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/api/work-orders/WorkOrdersModel.ts` | Modify | `Technician.technician?: boolean` (absent means offered) |
| `app/src/components/ts/work-orders/Model.ts` | Modify | `WorkOrderTechnicianOption.notOffered?: boolean`, with JSDoc on why it isn't `disabled` |
| `app/src/components/ts/work-orders/technicianOptions.ts` | Create | `isOfferedTechnician`, `toTechnicianOptions` |
| `app/src/components/ts/work-orders/WorkOrder.vue` | Modify | Map the fetched technicians through `toTechnicianOptions` (around L2197). `activeAndDeactivatedTechnicians` unchanged: former techs are in the list, so never `disabled`. |
| `app/src/components/shared/OrderStatusCard.vue` | Modify | `leadTechnicians = collection.filter(isOfferedTechnician)`. The existing `techniciansForSelect` appends the current non-offered lead last and disabled (S3-R7/R7a). |
| `app/src/components/ts/work-orders/LineTechnicianRoster.vue` | Modify | `addableOptions` excludes `notOffered` (S3-R6). `withoutKnownIneligible` **unchanged**. Docblocks updated. |
| `app/src/components/ts/work-orders/dialogs/AddLabourDialog.vue` | Modify | `setTechnician` becomes a non-mutating map with `disabled: !!tech.disabled \|\| !!tech.notOffered` (S3-R8, Edit Labor) |
| `app/src/components/ts/work-orders/TechnicianSelect.vue` | **No change** | Shared with the TimeSheets filter (S3-R9). Never add `notOffered` to `optionDisable`. |
| `app/src/testing/handlers.ts` | Modify | `*/technicians` rows gain `technician: true` |

Board, Tech View, Technician filter, `ReassignLeadTechnicianDialog`, `boardDropRules.ts`: no change (server-decided). PunchClockActivities, PartSale, `pages/Administration.vue`, TimeSheets: no change (S3-R9).

#### Key code changes:
```ts
// app/src/components/ts/work-orders/technicianOptions.ts
export const isOfferedTechnician = (row: { technician?: boolean }): boolean => row.technician !== false;

/** Clockable but role lacks Technician ⇒ `notOffered`, NOT `disabled`: LineTechnicianRoster drops
 *  `disabled` ids from a save, and S3-R8 keeps former technicians on the line. */
export const toTechnicianOptions = (rows: readonly Technician[]): WorkOrderTechnicianOption[] =>
  rows.map((row) => ({ ...row, notOffered: !isOfferedTechnician(row) }));
```

#### Unit / Integration tests:
- **BE fixtures** (`tests/Fixture/VehicleService/WorkOrders/LeadTechnicianCandidatesFixtures.php`): `NO_TECHNICIAN_ROLE_ID` (clockable, active, enrolled, role without the bundle), added to `EXCLUDED`; `CUSTOM_TECHNICIAN_ROLE_ID`, added to `ELIGIBLE_IN_ORDER`; a service WO led by the non-technician.
- **BE**: `DbalBoardTechnicianFetcherTest` covers S3-E1 (non-tech lead returned with `eligibleInLocation=false`), S3-E2 (pinned: `eligibleInLocation=false`, `enrolledInLocation=true`) and an unpinned non-lead (absent). `TechniciansListingClockableTest`: population unchanged, and the `technician` flag is true or false per role.
- **BE, expected to break** (update the expectations, since `WorkOrderBoardFixtures` uses `staff-admin`): `ViewWorkOrderBoardTest`, `ListWorkOrderBoardItemsTest`, `MoveWorkOrderOnBoardTest`, `BoardPositionOnLeadChangeTest`, `DbalWorkOrderLeadSnapshotFetcherTest`. `WorkOrderBoardStatementBudgetTest` stays green.
- **BE, new**: `tests/Functional/Auth/TechnicianCapabilityParityTest.php`. Toggle a role through `PUT /api/roles/{id}` and assert `/api/technicians.technician`, the board `eligibleInLocation` and candidate membership flip together (extended in B3/B4). This guards the four inlined EXISTS copies.
- **FE**:
  - `technicianOptions.spec.ts`.
  - **`LineTechnicianRoster.spec.ts`, the S3-R8 regression**: a `notOffered` `ex` plus a `disabled` `gone`. The PUT payload contains `ex` and not `gone`. The remove chip renders for `ex`. Add Technician excludes `ex`. With logged time, the lock shows.
  - `AddLabourDialog.spec.ts`: notOffered is disabled; name order; the prop is not mutated.
  - `TechnicianSelect.spec.ts`: notOffered is still **selectable** (TimeSheets guard).
  - `OrderStatusCard.spec.ts`: the lead list excludes `technician:false`; a former-tech lead is last and disabled; an empty list plus a non-tech lead gives "Unassigned" plus the grayed lead; picking another drops the former lead.
  - `WorkOrder.spec.ts`: a `technician:false` row reaches the lines tab as `notOffered`. When the technicians fetch fails, the pickers stay empty, the assigned lead and line technicians still show grayed out, and the rest of the work order renders (S3 Error handling).
  - `useReassignLeadTechnician.spec.ts`: every open refetches the candidates (S1-E3, `:79`).

#### Verification (Definition of Done gates):
- **Static:** BE cs-fix, phpstan, pest. FE `npx eslint --max-warnings=0 <files>`, `npx vitest run --maxWorkers=2 <specs>`, `npx vue-tsc --noEmit`.
- **Smoke:** `bin/smoke-test.sh`.
- **Compile:** Vite up, no errors.
- **Browser-walk** (`admin`, after B5 has run locally; Technician off on a test role that holds one clockable staff member, "Parts Manager"):
  - `/work-orders` Board View: no column for them. Technician filter: not offered. The card more-actions "Reassign lead" search finds "No technicians match".
  - A WO they lead: Lead Technician dropdown shows them last, grayed, with a check. Edit Line: their chip is removable, and saving keeps them. Edit Labor: grayed. Add Technician: absent.
  - A WO → Time Sheets tab: the filter still lists them (S3-R9). Punch Clock Activities: still listed.

#### E2E tests (e2e/):
- Happy path: W1 (a role turned off leaves Board View / Lead dropdown / Add Technician; turned on, they come back).
- Edge: W5 (Edit Line keeps a former technician); a non-tech lead keeps a column and is grayed in the dropdown.

---

### Phase B2: Turn Off Technician warning
**Implements:** S2-R1–R5, S2-N1, S2-N2, S2-E1, S2-E2, S2 Error handling, S1-R5, NFR-002, NFR-005
**Depends on:** A1 deployed (B3 FE card needed for the browser-walk; build together with B3)

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Auth/Application/Query/TechnicianOpenWork/CountTechnicianOpenWorkQuery.php` | Create | `Uuid $roleId` |
| `api/src/Auth/Application/Query/TechnicianOpenWork/TechnicianOpenWorkCounterInterface.php` | Create | port |
| `api/src/Auth/Application/Handler/TechnicianOpenWork/CountTechnicianOpenWorkQueryHandler.php` | Create | `RoleRepositoryInterface::findByIdInOrganization()`; returns 404 when absent |
| `api/src/Auth/Application/DTO/TechnicianOpenWork/TechnicianOpenWorkCountOutputDto.php` | Create | `toArray()` → camelCase |
| `api/src/Auth/Infrastructure/Persistence/Query/Dbal/DbalTechnicianOpenWorkCounter.php` | Create | One statement, `UNION ALL` of 4 arms + `COUNT(DISTINCT)` (below); `OrganizationDecorator` on the holders and on `wo.organization_id`. Statuses: a private const `[ESTIMATE, APPROVED, IN_PROGRESS, READY_FOR_REVIEW]` (not `LEAD_OPEN_COUNT_STATUSES`). |
| `api/src/Auth/UI/Http/Controller/CountTechnicianOpenWorkController.php` | Create | route, auth, `$this->ok($dto->toArray())` |

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/api/administration/AdministrationModel.ts` | Modify | `TechnicianOpenWorkCounts` |
| `app/src/api/administration/index.ts` | Modify | `fetchTechnicianOpenWork(roleId)` → `roles/${roleId}/technician-open-work` |
| `app/src/components/ts/administration/turnOffTechnicianCopy.ts` | Create | Pure `buildTurnOffTechnicianMessage(counts, roleName): string \| null` |
| `app/src/components/ts/administration/TurnOffTechnicianWarningModal.vue` | Create | `BaseDialog`, title "Turn Off Technician", `:persistent="false" :no-backdrop-dismiss="true"` (ClearShiftsPrompt precedent; the Esc exception is commented) |
| `app/src/components/ts/administration/EditRole.vue` | Modify | Split `checkAndSubmit` into a technician check, then `runSimilarRoleCheck`. Fires only when original on and draft off. Uses `fetchedRole.name` (as last saved). On error, proceeds. Gate re-entry in `submit()` on the existing `isProcessing` computed (`EditRole.vue:641`, `isChecking || isSubmitting`) and set `isChecking` while the counts load. Do not add a new symbol. Lazy-load the modal. |
| `app/src/testing/handlers.ts` | Modify | Default `*/roles/:id/technician-open-work` → zeros |

#### Key code changes:
```sql
-- DbalTechnicianOpenWorkCounter (shape; built with sub-builders + bound params, like DbalLeadTechnicianCandidateFetcher)
SELECT COUNT(DISTINCT items.staff_id) AS people_count,
       COUNT(DISTINCT CASE WHEN items.kind = 'wo'   THEN items.item_id END) AS work_order_count,
       COUNT(DISTINCT CASE WHEN items.kind = 'line' THEN items.item_id END) AS line_count
FROM (
  SELECT wo.tech_assigned_id AS staff_id, 'wo' AS kind, wo.id AS item_id FROM work_order wo
   WHERE wo.tech_assigned_id IN (<holders>) AND wo.type = :service AND wo.status IN (:open) AND wo.organization_id = :org
  UNION ALL SELECT wol.tech_assigned_id, 'line', wol.id FROM work_order_line wol JOIN work_order wo ON wo.id = wol.work_order_id
   WHERE wol.tech_assigned_id IN (<holders>) AND wol.status IN (:nonDeclined) AND wo.type = :service AND wo.status IN (:open) AND wo.organization_id = :org
  UNION ALL SELECT wolt.staff_id, 'line', wol.id FROM work_order_line_technician wolt
   JOIN work_order_line wol ON wol.id = wolt.line_id JOIN work_order wo ON wo.id = wol.work_order_id
   WHERE wolt.staff_id IN (<holders>) AND wol.status IN (:nonDeclined) AND wo.type = :service AND wo.status IN (:open) AND wo.organization_id = :org
  UNION ALL SELECT wot.tech_assigned_id, 'line', wol.id FROM work_order_task wot
   JOIN work_order_line wol ON wol.id = wot.line_id JOIN work_order wo ON wo.id = wol.work_order_id
   WHERE wot.tech_assigned_id IN (<holders>) AND wol.status IN (:nonDeclined) AND wo.type = :service AND wo.status IN (:open) AND wo.organization_id = :org
) items
-- <holders>: SELECT hs.id FROM staff hs JOIN user hu ON hu.id = hs.user_id
--            WHERE hu.role_v2_id = :roleId AND hu.is_active = 1 AND hs.clockable = 1 AND hu.organization_id = :org
```
```ts
// app/src/components/ts/administration/turnOffTechnicianCopy.ts
export const buildTurnOffTechnicianMessage = (
  { people, workOrders, lines }: TechnicianOpenWorkCounts, roleName: string,
): string | null => {
  if (people < 1 || workOrders + lines < 1) return null; // S2-N1
  const one = people === 1;
  const parts: string[] = [];
  if (workOrders > 0) parts.push(`${one ? 'leads' : 'lead'} ${workOrders} open work order${workOrders === 1 ? '' : 's'}`);
  if (lines > 0) parts.push(`${one ? 'is' : 'are'} on ${lines} labor line${lines === 1 ? '' : 's'}`);
  const it = workOrders + lines === 1 ? 'it' : 'them';
  return `${people} ${one ? 'person' : 'people'} on ${roleName} ${parts.join(' and ')}. `
    + `They'll stay on ${it}, but won't be offered as ${one ? 'a technician' : 'technicians'} on anything new.`;
};
```

#### Unit / Integration tests:
- **BE functional `CountTechnicianOpenWorkControllerTest`**:
  - Exact response keys.
  - Counted: estimate, approved, in_progress and ready_for_review.
  - Not counted: complete, invoiced, paid, declined, part sales, declined lines, lines on a complete WO, inactive people, Time Clock off.
  - Deduplication: a shared line counts once; one person on one line via all three routes counts once.
  - Another location in the same org is counted. A foreign-org role returns 404. No atom returns 403.
- **BE**: unit test for the handler's not-found path; `ApiRouteCacheConfigTest` (not cached).
- **FE `turnOffTechnicianCopy.spec.ts`**: an `it.each` table covering the 5 S2-R3 cases verbatim, the S2-R2 example (11/81/504, "Technician"), 1/2/0, and `null` for 0/0/0, 3/0/0 and 0/2/1.
- **FE `EditRole.spec.ts`**:
  - (a) Dialog text uses the saved name, and there is no PUT or similar-role call before Save.
  - (b) Dialog Save → diff modal with Technician under Removed → PUT.
  - (c) Cancel, X and Esc: no PUT, the form stays dirty, the toggle stays off.
  - (d) Backdrop click keeps the dialog.
  - (e) Zero counts skip the dialog.
  - (f) A 500 means no dialog and the save proceeds.
  - (g) Turning on never calls the endpoint.
  - (h) Save shows a loading state while the counts are pending.
- **FE**: `TurnOffTechnicianWarningModal.spec.ts`.

#### Verification (Definition of Done gates):
- **Static** (BE + FE), **Smoke**, **Compile**.
- **Browser-walk** (`admin`): `/settings/roles-permissions` → Edit the "Technician" role (has open work) → switch Technician off → Save.
  - The warning shows the counts; compare against design page 4.
  - Cancel keeps the switch off and unsaved. Save → Confirm Permission Updates lists "Technician" under Removed → saved.
  - The `tech` user is **not** logged out (next navigation works).
  - Turning it back on: no warning.

#### E2E tests (e2e/):
- Happy path: W2 (turn-off warning with counts → Save; the former lead still shows on their WO).
- Edge: Cancel keeps it unsaved; no warning when the role has no open work.

---

### Phase B3: Technician card in the role editor
**Implements:** S1-R1, S1-R2, S1-R3 (the window on Edit Role only), S1-R6, S1-R7, S1-R8, S1-N1, S1-N2, S1-N3, S1 Error handling, and the staff window's role-permissions panel (PRD v9 Out of Scope)
**Depends on:** A1 deployed. Ships in Release B. The FE always sends `crossToggles.technician`.

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/services/permissions/bundleCatalog.ts` | Modify | `CrossTogglesDraft.technician`; `'technician'` in `BUNDLE_CODES`; `emptyRoleDraft()`; `serializeDraft` / `deserializeToDraft`; header 61→62 |
| `app/src/services/permissions/cascade.ts` | Modify | Comment: `technician` is handled by the generic branch and kept out of `isAllOn` |
| `app/src/components/ts/administration/permissions/labels.ts` | Modify | `technician: 'Technician'` |
| `app/src/api/administration/AdministrationModel.ts` | Modify | `RoleCrossTogglesPayload.technician: boolean` (required on request); `CrossTogglesPayload.technician?: boolean` (optional on response, avoiding about 79 fixture edits) |
| `app/src/config/releaseBadges.ts` | Create | `TECHNICIAN_SETTING_BADGE: BadgeBearing = { badge: 'New', badgeUntil: '2026-12-31T07:00:00Z' }` plus `TECHNICIAN_SETTING_NOTICE` (the exact S4-R4 text). The date is a placeholder that must be set to 07:00 UTC on the seventh day after release. **Guard:** export `TECHNICIAN_SETTING_BADGE_IS_PLACEHOLDER = true` next to it, so the placeholder is greppable and can't pass as a real date. Release B is not cut until a PR sets the real date and flips the flag to `false`. Manual checklist item 7 and the B3 verification ticket both gate on this. |
| `app/src/components/ts/shared/NewPill.vue` | Create | Slot plus an in-flow pill using `useBadgeExpiry`; tokens copied from `DisplayOptionSwitcher.vue` `.display-switcher__badge`; top-right of the word (S1-R2) |
| `app/src/components/ts/administration/permissions/CrossTogglesSection.vue` | Modify | Third visible card (exact S1-R1 copy) with `NewPill`; the toggle sits in a wrapper div that owns `q-tooltip` "This role can't be a technician." (`PageAndSettingsToggles.vue` pattern); prop `technicianLocked` |
| `app/src/components/ts/administration/permissions/PermissionEditor.vue` | Modify | Pass `technicianLocked`; `onCrossToggle` ignores `technician` when locked |
| `app/src/components/ts/administration/EditRole.vue` | Modify | Computed `isTechnicianLocked` from the existing `isLockedSystemRole(...)` |
| `app/src/components/ts/administration/permissions/PermissionSummary.vue` | Modify | `useRoleTemplates().loadTemplates()`; compute `technicianLocked`; pass it through (S1-N1 on View Permissions) |
| `app/src/components/ts/administration/CreateNewRole.vue` | No change | Duplicate and template flows carry the code (S1-R7/R8). Create and Duplicate keep saving with no Confirm Permission Updates window, as today (S1-R3), and no entry point to Duplicate Role is added (S1-R7). |
| `app/src/components/office/ts/StaffDialog.vue`, `app/src/components/ts/administration/permissions/PermissionSummaryDialog.vue` | No change | The staff window's role-permissions link opens `PermissionSummaryDialog`, which renders `PermissionSummary` with `embedded`. The S1-R6 change above therefore shows the Technician card (read-only, with the pill) there too, as PRD v9 requires. Pin it with a test rather than a code change. |

S1-N1 as seen by the user: Office User and Time Clock User are already fully read-only (no Edit action; View Permissions and a direct-URL Edit are read-only). What's new is the **hover tooltip** on the grayed Technician switch. A custom role, including a duplicate of Office, is never locked.

#### Key code changes:
```vue
<!-- CrossTogglesSection.vue — after the AP/AR card -->
<div class="cross-toggles__card">
  <div class="cross-toggles__info">
    <div class="cross-toggles__title">
      <NewPill :entry="TECHNICIAN_SETTING_BADGE" test-id-suffix="crosstoggle_technician">Technician</NewPill>
    </div>
    <div class="cross-toggles__description">
      Shows on Board View and Tech View, appears on technician lists and can be assigned work. Staff also need Time Clock on.
    </div>
  </div>
  <div class="cross-toggles__toggle" data-test-id="crosstoggle_technician_wrapper">
    <q-toggle :model-value="draft.crossToggles.technician" :disable="readonly || technicianLocked"
      color="primary" dense data-test-id="crosstoggle_technician"
      @update:model-value="onToggle('technician', !draft.crossToggles.technician)" />
    <q-tooltip v-if="technicianLocked" anchor="center left" self="center right"
      data-test-id="crosstoggle_technician_locked_reason">This role can't be a technician.</q-tooltip>
  </div>
</div>
```

#### Unit / Integration tests:
- `bundleCatalog.spec.ts` (62; serialize / deserialize / round-trip), `cascade.spec.ts`.
- `PermissionEditor.spec.ts`: card order, title and description; toggle emits; locked means disabled with tooltip and the click ignored; pill before and after the deadline (`vi.setSystemTime` + `resetNavBadgeExpiryForTests`).
- `EditRole.spec.ts`: a Technician-only change opens the diff with Technician under Added or Removed; the PUT carries the UUID plus `crossToggles.technician`; the locked Office role shows the tooltip.
- `PermissionSummary.spec.ts`: Office shows the tooltip; a custom role doesn't. Mounted with `embedded` (how the staff window renders it) the Technician card still shows, read-only and with the pill — this is what pins the PRD v9 Out-of-Scope rule, since no file changes for it.
- `CreateNewRole.spec.ts`: Duplicate keeps it; a duplicate of Office isn't locked; the template with the code starts on; **Create and Duplicate save with no Confirm Permission Updates window** (S1-R3, PRD v8).
- New `NewPill.spec.ts`, `config/tests/releaseBadges.spec.ts` (parseable, ends in `T07:00:00Z`).

#### Verification (Definition of Done gates):
- **Static FE**, **Compile**.
- **Browser-walk** (`admin`), compared against design pages 2 and 3:
  - `/settings/roles-permissions` → Edit "Parts Manager" → the card is third, with its pill. Toggle it, Save, check the Confirm window, then View Permissions shows the card read-only.
  - Office User → View Permissions → hover the switch for the tooltip.
  - Settings → Staff → Edit a staff member → the link that shows the selected role's permissions → the Technician card shows, read-only, with the pill (PRD v9).
  - Create from the Technician template: on. Reset To Template on a Foreman-derived role: on.
  - The `tech` user (if their role was edited) stays logged in.

#### E2E tests (e2e/):
- Happy path: W1 setup step (toggle on a custom role through the UI). W3 (Office User: grayed plus tooltip).

---

### Phase B4: staff list column and notice + Public API
**Implements:** S4-R1–R5, S4-R1a, S4-N1, S4-N2, S4-E1, S5-R1, S5-R2, S5-N1, S5-E1, NFR-006
**Depends on:** A1 deployed (B3's `NewPill` / badge const for the FE)

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/IAM/Application/Listing/ListingQueryHandler.php` | Modify | Select `CASE WHEN u.is_active = 1 AND s.clockable = 1 AND EXISTS(… role holds technician) THEN 1 ELSE 0 END AS technician`; `$sortFields['technician'] = 'technician'`; cast to bool. No enrollment term (S4-R1a). |
| `api/src/OpenApi/Staff/Infrastructure/Query/OpenApiStaffQueryRepository.php` | Modify | The same `technician` expression in `list()` and `findById()` (via `u.role_v2_id`) |
| `api/src/OpenApi/Staff/Application/DTO/StaffOutputDto.php` | Modify | `'technician' => 1 === (int) $row['technician']`, after `clockable` (covers all three endpoints) |
| `api/openapi/openapi.yaml` | Modify | `Staff.technician: {type: boolean, readOnly: true}`; **not** in `StaffUpdate` |
| `docs/api/v1/changelog.md` | Modify | "Unreleased -- Additive" entry: field, rule, read-only, and that a role toggle does **not** move `updated_at` |
| `docs/api/v1/sync-guide.md` | Modify | Staff section note |

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/api/office/OfficeModel.ts` | Modify | `StaffListRow.technician: boolean`; update typed fixtures (`api/office/tests/queries.spec.ts`, `customers/tests/CustomerDialog.spec.ts`) |
| `app/src/components/ts/office/StaffTable.vue` | Modify | Column `technician` directly before `billable` (sortable server-side); `#body-cell-technician` `q-badge` (`positive` / `negative`, `data-test-id="staff_technician_badge"`); `#header-cell-technician` with `NewPill` |
| `app/src/components/office/Staff.vue` | Modify | `<InfoNotice v-if="isTechnicianNoticeLive" :message="TECHNICIAN_SETTING_NOTICE" data-test-id-suffix="technician_setting_notice" class="q-mb-md" />` inserted after the `text_staff_list_error` div and before the tabs; `isTechnicianNoticeLive = useBadgeExpiry(TECHNICIAN_SETTING_BADGE)`; exact S4-R4 text |

#### Unit / Integration tests:
- **BE IAM listing functional**: technician true; deactivated false; Time Clock off false; no bundle false; not enrolled at the filtered workplace still true; sort ascending and descending.
- **BE `ApiRouteCacheConfigTest`**: `POST /api/staff/{id}/change`, `PUT /api/roles/{id}` and `POST /api/iam/change-status` invalidate `staff_reference` (S1-E2, already configured).
- **BE OpenApi**:
  - **Update**: `ListControllerTest` L305–319 key pin.
  - **New**: `technician` on list, view and location staff.
  - **New**: `UpdateControllerTest` PATCH `{"technician": false}` returns 200, unchanged.
- Extend `TechnicianCapabilityParityTest` to `/api/staff` and `/api/v1/staff`.
- **FE**: new `StaffTable.spec.ts` (column order, badge colors, header pill expiry, sort emit). `Staff.spec.ts`: notice text; position after the error line and before the tabs; gone after the deadline in an open page.

#### Verification (Definition of Done gates):
- **Static** BE + FE, **Smoke**, **Compile**.
- **Browser-walk** (`admin`) `/settings/staff`, compared against design page 1:
  - The notice sits above the tabs.
  - The Technician column sits left of Billable, with its pill.
  - Sorting works.
  - Deactivated tab: all No.
- **API**: with a Public API token, `GET /api/v1/staff` → `technician` present. A PATCH with it is ignored.

#### E2E tests (e2e/):
- Happy path: W4 (column Yes/No reflects the role setting; notice visible).

---

### Phase B5: release-day migration (Migration B)
**Implements:** S6-R1, S6-R2, S6-R4, S6-R5, S6-R6, S6-N1, S6-E1, S6-E2, S6-E3, NFR-004, NFR-007
**Depends on:** A1 **deployed** in the target environment. Ship it in the same PR as B1, or merged before B1.

#### Database changes:
| Migration/Change | Description |
|-----------------|-------------|
| `api/migrations/Version<ts>.php` (Migration B) | Evidence SELECT (non-locking) → chunked (1000) `INSERT … SELECT … WHERE NOT EXISTS` into `v2_role_fe_permission`; re-asserts the template snapshot; `down()` deletes every Technician grant (pre-release rollback only). Must sort after Migration A (`MainMigrationCollisionRepairTest`). |

#### Key code changes:
```php
/** Public so a functional test can run it on SQLite fixtures. */
public const string EVIDENCE_SQL = <<<'SQL'
    SELECT DISTINCT r.id
    FROM v2_role r
    LEFT JOIN v2_role_template t ON t.id = r.template_id
    INNER JOIN user u  ON u.role_v2_id = r.id AND u.organization_id = r.organization_id AND u.is_active = 1
    INNER JOIN staff s ON s.user_id = u.id AND s.clockable = 1
    WHERE (r.is_default = 0 OR t.slug IS NULL OR t.slug NOT IN (:excludedSlugs))      -- S6-R2, NULL-safe
      AND ( s.billable = 1                                                             -- (c)
         OR EXISTS (SELECT 1 FROM technician_task_record ttr                           -- (a) WO time incl. part sales
                    WHERE ttr.staff_id = s.id AND ttr.work_order_id IS NOT NULL AND ttr.work_order_id != '' AND ttr.start_date >= :cutoff)  -- D19
         OR EXISTS (SELECT 1 FROM work_order wo                                        -- (b) lead
                    WHERE wo.tech_assigned_id = s.id AND wo.organization_id = u.organization_id
                      AND wo.type = :service AND wo.status IN (:openStatuses))
         OR EXISTS (/* (b) line own tech   — work_order_line.tech_assigned_id, wol.status IN (:lineStatuses) */)
         OR EXISTS (/* (b) Add Technician  — work_order_line_technician.staff_id */)
         OR EXISTS (/* (b) labor           — work_order_task.tech_assigned_id */) )
    SQL;
// :cutoff = now UTC − 90 days, computed once; :openStatuses = approved, in_progress, ready_for_review (no estimate);
// :lineStatuses = LineStatus::getNonDeclinedLineStatuses(); :excludedSlugs = office, time_clock_user; :service = 'service'
```

#### Unit / Integration tests:
- **Unit `TechnicianReleaseSeedMigrationTest`** (stubbed connection): ceil(N/1000) INSERTs; none when N = 0; every INSERT guarded; writes only to the two tables; constants equal `FEPermissionEnum::technician`, `RoleTemplateEnum::Office/TimeClock`, `Status::*`, `LineStatus::getNonDeclinedLineStatuses()` and `Type::SERVICE`.
- **Functional `TechnicianReleaseEvidenceTest`** (runs `EVIDENCE_SQL` on SQLite fixtures):
  - Granted: WO time at 89 days; part-sale time; each (b) route on each of the three statuses; billable; a custom duplicate of Office; a built-in Parts Manager with evidence.
  - Not granted: 91 days; department time; estimate, declined, declined line, part sale without time; inactive; Time Clock off; built-in Office with a billable user.
- Do **not** write tests for a CLI command (none here).

#### Verification (Definition of Done gates):
- **Migration gate**: `doctrine:migrations:migrate`; `migrations:diff --allow-empty-diff` gives "No changes detected"; re-run gives 0 new rows. Run it out of band on MySQL 8 (throwaway-container recipe): migrate, re-run, `down()`. Time the evidence SELECT on a production-like copy, not the QA ACL-by-name path (Product's PRD-review verdict comment on the PRD page, "For engineering" #5).
- **Session check**: log in as `tech` before migrating; after migrating, the next request returns 200 (A1 serving).
- **Smoke**: `bin/smoke-test.sh`.
- **Browser-walk** (`admin`): `/settings/staff`: technician column Yes for people on evidence roles. `/settings/roles-permissions`: a role with evidence (any name) on, a role with no evidence off, including a Technician- or Foreman-named role with no evidence. Existing orgs get **no** fixed per-role default (PRD Key Decisions; S6-N1).

#### E2E tests (e2e/):
- None directly. This is a backend data step, covered by the functional evidence test (test-scope rules: cheapest layer). Existing E2E seed factories must give seeded technicians a Technician-bearing role (see §7 reference breakage).

---

### Phase B6a: S3-R10 "No technicians yet" text (Release B, with B1)
**Implements:** S3-R10 (Board View / Tech View text)
**Depends on:** B1. Does **not** depend on SV-11555: both files and the "No technicians yet" title already exist on `develop`.

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/components/ts/work-orders/displays/board/WorkOrdersBoardViewDisplay.vue`, `.../tech-view/WorkOrdersTechViewDisplay.vue` | Modify | Replace today's "Add technicians to assign work orders. Until then, every work order stays in Unassigned." with "Turn Technician on for a role in Roles & Permissions to assign work orders. Until then, every work order stays in Unassigned." Title unchanged. |

#### Unit / Integration tests:
- `WorkOrdersBoardViewDisplay.spec.ts`, `WorkOrdersTechViewDisplay.spec.ts`: exact text.

#### Verification (Definition of Done gates):
- **Static FE**, **Compile**.
- **Browser-walk** (`admin`): a location whose staff all lack Technician → Board View and Tech View show "No technicians yet" with the new text.

---

### Phase B6b: S3-R10 first-run text and "Set Up Technicians" button (after SV-11555)
**Implements:** S3-R10 ("Nothing here yet" text, button label and target)
**Depends on:** SV-11555 / PR #3996 merged and back-merged into `develop`; B6a. If #3996 hasn't landed when Release B ships, Release B ships without B6b. B6b then follows #3996 as a small change; nothing else waits on it.

#### Frontend changes (`app/`) — deltas on top of #3996:
| File | Action | Description |
|------|--------|-------------|
| `app/src/components/ts/work-orders/displays/shared/AddTechnicianButton.vue` | Modify | label "Set Up Technicians"; `:to="{ name: 'RolesPermissions' }"`; keep the file name and test-id suffixes |
| `app/src/components/ts/work-orders/displays/composables/useAddTechnician.ts` | Modify | docblock only (`settingsApp` gate unchanged) |
| `app/src/components/ts/work-orders/displays/shared/WorkOrdersFirstRunState.vue` | Modify | The `noTechnicians` text: "Turn Technician on for a role and create your first work order to track work by tech." |
| `app/src/testing/router.ts` | Modify | Register the `RolesPermissions` mock route |

#### Unit / Integration tests:
- `AddTechnicianButton.spec.ts`, `WorkOrdersFirstRunState.spec.ts`: label, target and copy.

#### Verification (Definition of Done gates):
- **Static FE**, **Compile**.
- **Browser-walk** (`admin`): empty board → "Set Up Technicians" opens Roles & Permissions; an empty tab shows "Nothing here yet" with the new text.

#### E2E tests (e2e/):
- Backlog (see §7).

## 7. Testing Strategy

### Unit tests (`api/` and `app/`)
- **Backend**: session-neutral fingerprint; `Role` create, change and normalize for technician; the migration's constants and chunking; the count handler's not-found path.
- **Frontend**: `bundleCatalog` / `cascade`; the turn-off copy table; `technicianOptions`; `NewPill` / badge expiry; `StaffTable` (new spec); the S3-R8 Edit Line save regression; TimeSheets guard on `TechnicianSelect`.
- **Edge cases to watch**:
  - a stale client omitting `crossToggles.technician`;
  - a role duplicated from Office;
  - a person who is line tech, on the roster and holds labor on one line (count once);
  - a renamed role in the warning (the saved name is used).

### Integration tests
- `TechnicianCapabilityParityTest`: one role toggle flips all four read surfaces.
- `RoleChangeSessionInvalidationTest`: no logout for Technician-only; logout for a real permission.
- `CountTechnicianOpenWorkControllerTest`; `TechnicianReleaseEvidenceTest`; `/api/staff` and `/v1/staff` field and sort tests; the route-cache invalidation assertions.

### Manual testing checklist
1. Release A on staging: a logged-in `tech` session survives an API grant of `technician` to their role.
2. Release B on staging: deploy while `tech` and `admin` are logged in; nobody gets a 409 after the migration.
3. Board View at a location with a non-tech lead: their column stays until the WO is reassigned.
4. Pin a non-technician's column, then drag a WO onto it: "This technician can't be assigned work orders."
5. Back within 30 s after a role change shows the old board; after a reload, the new one.
6. Time Sheets, Punch Clock Activities, Technician Efficiency/Utilization and Schedule still list a non-technician with Time Clock on.
7. Before Release B is cut: `TECHNICIAN_SETTING_BADGE.badgeUntil` is set to 07:00 UTC on the seventh day after release, and `TECHNICIAN_SETTING_BADGE_IS_PLACEHOLDER` is `false`. **Blocking:** with the placeholder left in, the pill and the staff notice, which can't be closed, run until 2026-12-31.

### E2E tests

Per `coverage-policy.md`: `batchCap = 5` new workflows per `/e2e-after-change` run. Release A is a pre-approved §8 skip (no FE diff). Reference-breakage fixes are mandatory and not capped.

**Test: A role's Technician setting decides who is offered** (W1; happy path; S1-R1, S1-R3, S3-R2, S3-R3, S3-R5, S3-R6)
1. Seed via the API a custom role "E2E Parts" with the Technician bundle off, plus a clockable staff member on it, enrolled at the test location.
2. Open Board View → no column for them; open the Technician filter → not listed.
3. Open a WO → Lead Technician dropdown and Add Technician → not offered.
4. Roles & Permissions → Edit "E2E Parts" → switch Technician on → Save → Confirm (Technician under Added).
5. Reload Board View and the WO.
- **Expected:** they now have a column, are in the filter, and are offered in both dropdowns.

**Test: Turn Off Technician warns and keeps existing work** (W2; happy path + edge; S2-R2, S2-R4, S2-R5, S3-R7)
1. Seed a role with Technician on and one staff member leading one open service WO.
2. Edit the role → switch Technician off → Save.
- **Expected:** the "Turn Off Technician" dialog says "1 person on E2E Role leads 1 open work order. They'll stay on it, but won't be offered as a technician on anything new."
3. Cancel → the dialog closes and the role is unsaved (switch still off, Save enabled).
4. Save again → dialog Save → Confirm.
- **Expected:** saved. On the WO the lead still shows; the Lead Technician dropdown lists them last, grayed, with a check.

**Test: Built-in Office User can't be a technician** (W3; edge; S1-N1)
1. Roles & Permissions → View Permissions on "Office User".
2. Hover the Technician switch.
- **Expected:** the switch is off and disabled; the tooltip says "This role can't be a technician."

**Test: Staff list shows who is a technician** (W4; happy path; S4-R1, S4-R4)
1. Seed one staff member on a Technician-bearing role and one on a role without it (both Time Clock on).
2. Open `/settings/staff`.
- **Expected:** the notice text is visible above the tabs; the Technician column shows Yes for the first and No for the second, left of Billable.

**Test: Edit Line keeps a former technician** (W5; edge; S3-R8)
1. Seed a WO line with a staff member added via Add Technician, then turn their role's Technician off via the API.
2. Open the WO → Edit Line.
- **Expected:** their chip is shown and removable; Add Technician doesn't offer them.
3. Change the line description and Save; reopen.
- **Expected:** they are still on the line.

**Backlog** (beyond `batchCap`)

| Workflow | Why deferred | Layer that covers it meanwhile |
|---|---|---|
| Reassign-lead dialog "Current · no longer assignable" for a former tech | Existing UI, already E2E-covered for deactivated leads | BE fixtures + manual checklist |
| Pinned non-tech column refuses a drop | Existing drop rule, already covered (`board-view-pin-technicians.spec.ts`) | BE `DbalBoardTechnicianFetcherTest` |
| S3-R10 "Set Up Technicians" empty state | B6b blocked on SV-11555 | FE specs (B6a, B6b) |
| "New" pill / notice disappear at the deadline | Time-travel, cheaper in vitest | `NewPill.spec.ts`, `Staff.spec.ts` |
| Public API `technician` | API-only | BE functional tests (test-scope rules) |

**Reference breakage to scan (mandatory, `e2e/.claude/reference/coverage-policy.md` §10).** After B1+B5, any spec that seeds staff on a role **without** the Technician bundle and then expects them on the board, the Technician filter, the lead dialog or the WO pickers will fail. Likely touched:
- the `e2e/tests/ui/work-orders/board-view-*` / `tech-view-*` specs;
- `e2e/src/api/factories/work-order.factory.ts`;
- `e2e/src/utils/work-order-lead-seed.helper.ts`;
- `e2e/src/api/fixtures/billable-staff.ts`;
- `e2e/src/permissions/custom-role-presets.ts`.

`e2e/src/api/factories/role.factory.ts` needs a way to set `crossToggles.technician`. The new staff column may shift column-index locators on `table_staff` (`e2e/tests/ui/staff.spec.ts`). Run `/e2e-after-change` after B1 and fix every breakage before the PR.

## 8. Rollback Plan

- **Release A**: safe to revert. Run Migration A's `down()` (no role holds the code yet), then redeploy the previous image. Users see nothing either way.
- **Release B, code only**: redeploy the previous (Release A) image. The grants stay in `v2_role_fe_permission`. Release A code ignores them for sessions, the old FE drops the unknown code from the draft (but D14 keeps it on save), and old list queries don't read it. So the lists revert to "Time Clock on" behavior with no logout. **Prefer this.**
- **Release B, full**: Migration B `down()` removes **every** Technician grant, including shop choices made after release. Use it only before shops have touched the setting.
- **Never** revert Release A while Release B's grants exist: the old fingerprint would then log out every granted role.

## 9. Performance & Security Considerations

### Performance
- **Hot read paths:**
  - **Board / Tech View / lead candidates** (`LeadTechnicianEligibilityPredicate`, B1): one extra correlated EXISTS per staff row on `v2_role_fe_permission`, PK-covered by `(role_id, fe_permission_id)`, with `v2_fe_permission.code` unique. Staff per location is small. `WorkOrderBoardStatementBudgetTest` pins the statement count (Product's PRD-review verdict comment on the PRD page, "For engineering" #7: two correlated checks per row is acceptable at this cardinality).
  - **`GET /api/technicians`** (B1): one `CASE WHEN EXISTS` column; the population is unchanged; route-cached (`staff_reference`, invalidated on `/roles*`, `/staff*`, `/iam*`).
  - **`GET /api/staff`** (B4): the same expression; `PAGE_SIZE = 1000` as today; the sort is a whitelisted alias.
  - **S2 count** (B2): one statement, four `UNION ALL` arms driven by the role's holders (indexed `staff.user_id`, `user.role_v2_id`), then `wo__tech_assigned_id_idx`, `wol__tech_assigned_work_order_idx`, `wolt__staff_id_idx` and `wot__tech_assigned_work_order_idx`. Scoped by organization; not route-cached; called only on a turn-off save.
- **Derived data and backfills:** Migration B (B5) reads 246k `technician_task_record` rows in the window (prod, 2026-10-28; top tenant 9,791) via `ttr__start_date_idx`. Writes are at most 9,774 role grants, chunked by 1000. The evidence read is a plain SELECT (consistent read, no shared locks on hot tables). No ongoing maintenance: the value is owned by role saves afterwards.
- **Known risks:**
  - Four inlined copies of the capability EXISTS (predicate, technicians list, IAM list, OpenApi repo); `TechnicianCapabilityParityTest` guards drift.
  - Don't let the S2 count run on toggle (only on save).
  - The FE fires the count request once per save, guarded against re-entry.

### Security
- **Authorization:**
  - The S2 endpoint requires `ROLE_ROLE_CREATE_AND_EDIT` (part of `settingsApp`).
  - Role create/change keep `ROLE_ROLE_CREATE_AND_EDIT`.
  - The staff list keeps `ROLE_USER_VIEW`.
  - The Public API keeps its token scopes.
  - No new permission is introduced.
- **Privilege safety:** `technician` maps to **zero** BE atoms, enforced by `testSessionNeutralBundlesGrantNoAtoms`. A session-neutral bundle gaining an atom would be a privilege change that skips logout, so that test is the guard (NFR-001).
- **Tenant scoping:**
  - The S2 count is organization-scoped only (`OrganizationDecorator`, plus `wo.organization_id` in every arm), deliberately without a workplace scope (S2-R1). The docblock says so to pre-empt a "missing workplace scope" review flag.
  - Technician lists keep `WorkplaceDecorator` and the predicate's org boundary.
  - Migration B joins `user.organization_id = role.organization_id` and `wo.organization_id = user.organization_id`.
- **Built-in roles:** `Role::change()` refuses edits to Office User and Time Clock User. `Role::create()` and Migration B strip or exclude the bundle for them.
- **Read-only API field:** `technician` is absent from `StaffUpdate`; a PATCH ignores it (S5-N1).
- **Session behavior:** the only intentional change is NFR-001. Every other permission change still drops sessions as today.

## 10. Requirement Traceability

| Requirement | Phase | Layer | Files | Status |
|-------------|-------|-------|-------|--------|
| S1-R1 | B3 | App | app/src/components/ts/administration/permissions/CrossTogglesSection.vue | Planned |
| S1-R2 | B3 | App | app/src/components/ts/shared/NewPill.vue, app/src/config/releaseBadges.ts | Planned |
| S1-R3 | A1, B3 | API, App | api/src/Auth/UI/Http/RequestDto/ChangeRoleRequestDto.php, app/src/services/permissions/bundleCatalog.ts, app/src/components/ts/administration/permissions/labels.ts (→ PermissionDiffModal.vue) | Planned |
| S1-R4 | B1 | API | LeadTechnicianEligibilityPredicate.php, Staff/Staff/Application/Listing/ListingQueryHandler.php | Planned |
| S1-R5 | B2 | App | app/src/components/ts/administration/EditRole.vue | Planned |
| S1-R6 | B3 | App | app/src/components/ts/administration/permissions/PermissionSummary.vue | Planned |
| S1-R7 | A1, B3 | API, App | ChangeCommandHandler.php / CreateNewRole.vue (no change) | Planned |
| S1-R8 | A1 | API | RoleFePermissionMappings.php, Migration A | Planned |
| S1-R9 | A1 | API | RoleFePermissionMappings.php | Planned |
| S1-R10 | A1 | API | api/src/IAM/Infrastructure/Security/Symfony/SymfonyUser.php | Planned |
| S1-N1 | A1, B3 | API, App | Role.php, CrossTogglesSection.vue, PermissionSummary.vue | Planned |
| S1-N2 | — | App | existing route gate (`settingsApp`) | Exists |
| S1-N3 | — | API | no audit on roles today | Exists |
| S1-E1 | B1 | API | LeadTechnicianEligibilityPredicate.php | Planned |
| S1-E2 | — | API | ApiRouteCacheConfig.php:494–498 (`/roles*` already invalidates `staff_reference`; B4 adds a test) | Exists |
| S1-E3 | — | App | existing: `RESUME_STALE_TIME_MS = 30_000` (displays/constants.ts:94); lead dialog refetches on every open (`useReassignLeadTechnician.ts:79`) | Exists (pinned by a B1 spec) |
| S1 Error handling | A1 | API | Role.php ("Role is not editable.") | Planned |
| Out of Scope: staff window's role-permissions panel | B3 | App | PermissionSummary.vue (via StaffDialog.vue → PermissionSummaryDialog.vue, no change) | Planned |
| S2-R1 | B2 | API | api/src/Auth/Infrastructure/Persistence/Query/Dbal/DbalTechnicianOpenWorkCounter.php | Planned |
| S2-R2 | B2 | App | TurnOffTechnicianWarningModal.vue, turnOffTechnicianCopy.ts | Planned |
| S2-R3 | B2 | App | turnOffTechnicianCopy.ts | Planned |
| S2-R4 | B2 | App | EditRole.vue, TurnOffTechnicianWarningModal.vue | Planned |
| S2-R5 | B2 | API | (no unassign path) | Planned |
| S2-N1 | B2 | App | turnOffTechnicianCopy.ts | Planned |
| S2-N2 | B2 | App | EditRole.vue | Planned |
| S2-E1 | B2 | API | DbalTechnicianOpenWorkCounter.php | Planned |
| S2-E2 | B2 | API | DbalTechnicianOpenWorkCounter.php | Planned |
| S2 Error handling | B2 | App | EditRole.vue | Planned |
| S3-R1 | B1 | API | LeadTechnicianEligibilityPredicate.php, Staff/Staff/Application/Listing/ListingQueryHandler.php | Planned |
| S3-R2 | B1 | API | LeadTechnicianEligibilityPredicate.php (DbalBoardTechnicianFetcher unchanged) | Planned |
| S3-R3 | B1 | API | (board payload; FE unchanged) | Planned |
| S3-R4 | B1 | API | DbalLeadTechnicianCandidateFetcher via predicate (FE exists) | Planned |
| S3-R5 | B1 | App | app/src/components/shared/OrderStatusCard.vue | Planned |
| S3-R6 | B1 | App | LineTechnicianRoster.vue, AddLabourDialog.vue | Planned |
| S3-R6a | — | App | none | Exists |
| S3-R7 | B1 | App | OrderStatusCard.vue | Planned |
| S3-R7a | B1 | App | OrderStatusCard.vue (existing fallback) | Planned |
| S3-R8 | B1 | App | technicianOptions.ts, WorkOrder.vue, LineTechnicianRoster.vue, AddLabourDialog.vue | Planned |
| S3-R9 | B1 | App, API | TechnicianSelect.vue (no change), TimeSheets/PunchClock/PartSale (no change), Schedule lanes (department-based, no change), Technician Efficiency/Utilization reports (no change) | Planned |
| S3-R10 | B6a | App | WorkOrdersBoardViewDisplay.vue, WorkOrdersTechViewDisplay.vue | Planned |
| S3-R10 | B6b | App | AddTechnicianButton.vue, useAddTechnician.ts, WorkOrdersFirstRunState.vue, app/src/testing/router.ts | Planned (after SV-11555) |
| S3-N1 | B1 | API, App | predicate, technicianOptions.ts | Planned |
| S3-N2 | A1, B1 | API | Role.php, predicate | Planned |
| S3-N3 | — | API | DbalEligibleTechnicianLookup (unchanged) | Exists |
| S3-E1 | B1 | API | DbalBoardTechnicianFetcher (unchanged, tested) | Planned |
| S3-E2 | B1 | API | enrolledInCurrentLocation (unchanged, tested) | Planned |
| S3-E3 | — | API | unchanged | Exists |
| S3 Error handling | — | App | existing | Exists |
| S4-R1 | B4 | API, App | IAM/Application/Listing/ListingQueryHandler.php, StaffTable.vue | Planned |
| S4-R1a | B4 | API | IAM ListingQueryHandler.php | Planned |
| S4-R2 | B4 | API, App | IAM ListingQueryHandler.php ($sortFields), StaffTable.vue | Planned |
| S4-R3 | B4 | App | StaffTable.vue, NewPill.vue | Planned |
| S4-R4 | B4 | App | app/src/components/office/Staff.vue | Planned |
| S4-R5 | B4 | App | Staff.vue | Planned |
| S4-N1 | — | App | existing route gate | Exists |
| S4-N2 | B4 | App | Staff.vue, NewPill.vue | Planned |
| S4-E1 | B4 | App | StaffTable.vue (read-only) | Planned |
| S4 Error handling | B4 | App | Staff.vue (notice placement covers the fail-to-load case) | Planned |
| S5-R1 | B4 | API | OpenApiStaffQueryRepository.php, StaffOutputDto.php, openapi.yaml | Planned |
| S5-R2 | B4 | Docs | docs/api/v1/changelog.md | Planned |
| S5-N1 | B4 | API | openapi.yaml (not in StaffUpdate) | Planned |
| S5-E1 | — | API | unchanged | Exists |
| S5 Error handling | — | API | no new failure paths | Exists |
| S6-R1 | B5 | API | api/migrations/Version<ts>.php (Migration B) | Planned |
| S6-R2 | B5 | API | Migration B | Planned |
| S6-R3 | A1 | API | Migration A, RoleFePermissionMappings.php | Planned |
| S6-R4 | B5 | API | Migration B | Planned |
| S6-R5 | A1, B5 | API | SymfonyUser.php, Migration B | Planned |
| S6-R6 | B5 | API | Migration B | Planned |
| S6-N1 | B5 | API | Migration B | Planned |
| S6-E1 | B1, B5 | API, App | predicate, OrderStatusCard.vue | Planned |
| S6-E2 | B5 | API | Migration B | Planned |
| S6-E3 | B5 | API | Migration B (once, idempotent) | Planned |
| S6 Error handling | — | API | no user-facing failure path | Exists |
| NFR-001 | A1 | API | SymfonyUser.php, FEPermissionMappingsTest | Planned |
| NFR-002 | B2 | API | DbalTechnicianOpenWorkCounter.php | Planned |
| NFR-003 | B1 | API | predicate, Staff ListingQueryHandler.php | Planned |
| NFR-004 | B5 | API | Migration B | Planned |
| NFR-005 | B1–B4 | API | all new reads | Planned |
| NFR-006 | B4 | API | IAM ListingQueryHandler.php | Planned |
| NFR-007 | A1, B5 | Ops | release sequencing | Planned |
| S1-R1, S1-R3, S3-R2, S3-R3, S3-R5, S3-R6 | B1/B3 | E2E | e2e/tests/ui/work-orders/technician-toggle-lists.spec.ts (W1) | Planned |
| S2-R2, S2-R4, S2-R5, S3-R7 | B2 | E2E | e2e/tests/ui/administration/technician-turn-off-warning.spec.ts (W2) | Planned |
| S1-N1 | B3 | E2E | e2e/tests/ui/administration/technician-builtin-role.spec.ts (W3) | Planned |
| S4-R1, S4-R4 | B4 | E2E | e2e/tests/ui/staff/technician-column.spec.ts (W4) | Planned |
| S3-R8 | B1 | E2E | e2e/tests/ui/work-orders/technician-toggle-line-keeps.spec.ts (W5) | Planned |

## 11. Verification Tickets

| Ticket | Title | Covers | Linked stories | Assignee |
|--------|-------|--------|----------------|----------|
| [SV-11962](https://shopview.atlassian.net/browse/SV-11962) | Verify A1: session-neutral Technician permission (Release A) | A1 / S1-R8, S1-R9, S1-R10, S1 Error handling, S6-R3, S6-R5, NFR-001, NFR-007 | SV-11879, SV-11884 | Nemanja Djuric |
| [SV-11963](https://shopview.atlassian.net/browse/SV-11963) | Verify B1: technician lists offer only technicians | B1 / S3-R1…R9, S3-N*, S3-E*, S3 Error handling, S1-R4, S1-E1…E3, NFR-003, NFR-005 | SV-11881, SV-11879 | Nemanja Djuric |
| [SV-11964](https://shopview.atlassian.net/browse/SV-11964) | Verify B2: Turn Off Technician warning | B2 / S2-*, S1-R5, NFR-002, NFR-005 | SV-11880, SV-11879 | Nemanja Djuric |
| [SV-11965](https://shopview.atlassian.net/browse/SV-11965) | Verify B3: Technician card in Roles & Permissions | B3 / S1-R1…R3, S1-R6…R8, S1-N*, S1 Error handling, staff-window panel | SV-11879 | Nemanja Djuric |
| [SV-11966](https://shopview.atlassian.net/browse/SV-11966) | Verify B4: staff list column, notice and Public API value | B4 / S4-*, S5-*, NFR-006 | SV-11882, SV-11883 | Nemanja Djuric |
| [SV-11967](https://shopview.atlassian.net/browse/SV-11967) | Verify B5: release-day migration keeps every technician | B5 / S6-*, NFR-004, NFR-007 | SV-11884 | Nemanja Djuric |
| [SV-11968](https://shopview.atlassian.net/browse/SV-11968) | Verify B6a: "No technicians yet" text | B6a / S3-R10 (board text) | SV-11881 | Nemanja Djuric |
| [SV-11969](https://shopview.atlassian.net/browse/SV-11969) | Verify B6b: "Set Up Technicians" button and first-run text | B6b / S3-R10 (button, first-run text); after SV-11555 | SV-11881 | Nemanja Djuric |

All are Tasks under SV-11788 (Product Area: Administration), linked to their stories with "Relates". When all eight are Done, the feature is ready for QA.