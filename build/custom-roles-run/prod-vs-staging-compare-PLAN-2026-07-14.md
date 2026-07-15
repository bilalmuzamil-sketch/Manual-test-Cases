# Custom Roles — PRODUCTION vs STAGING roles+permissions COMPARE — PLAN (offline prep)

> **Project:** Custom Roles & Permissions (ShopView), Epic **SV-7388**. PO = **Sasha Grosman**.
> **Purpose of THIS doc:** release-eve prep to compare **PRODUCTION** roles+permissions
> (OLD legacy model) against **STAGING** roles+permissions (NEW Custom Roles model), to find
> every place where a **PRODUCTION role can do MORE than the STAGING role it maps to**
> (a capability production grants that staging removes — the user's worry, e.g. *Send to
> Terminal*, *Send to Portal*).
> **STATUS: READ-ONLY OFFLINE PREP.** No env touched, no cookies used, no cases/TestRail
> modified. The user will supply **prod + staging cookies next**; this doc lets execution
> start immediately once the mapping is confirmed.
> **Sources:** `build/custom-roles-spec-update/updated-spec-source.md` §"Migration Plan"
> (authoritative), migration cases C26510–C26520 + C27731 (section 3549),
> `roles-matrix-2026-07-13.md`, `permission-catalog-source.json`,
> `CustomRoles_TimeClock-API-Enforcement_2026-07-13.md`, `custom-roles-current-state.md`, CLAUDE.md.

---

## ⚠️ CRITICAL RULE FOR THIS TASK
**NEVER write to PRODUCTION. Production is a REAL system, read-only ONLY** (GET requests,
no POST/PUT/DELETE, no role/staff/settings changes). TestRail is also real — no writes
without fresh explicit authorization. Staging is disposable (usual rules). This entire
compare is a **read-only capability diff**.

---

## 1. PRODUCTION → STAGING role MERGE mapping

**Source of truth = the spec's "Migration Plan → Legacy Role to New System Role Mapping"
table** (`build/custom-roles-spec-update/updated-spec-source.md` lines 452–470). The spec
says migration goes from **15 legacy (production) roles → 11 new (staging) system roles**
(spec prose line 26–27; "12 templates" prose counts the dropped Owner — live shipped = 11,
confirmed `roles-matrix-2026-07-13.md`).

### 1a. Full legacy(production) → staging mapping (from spec migration table)
| Legacy / PRODUCTION role | → STAGING system role | Migration type (spec) |
|---|---|---|
| **Owner** | **Administrator (Admin)** | Direct mapping — **MERGE** (Owner dropped into Admin) |
| **Administrator** | **Administrator (Admin)** | Direct mapping |
| Service Manager | Service Manager | Direct (with adjustments) |
| **Service Advisor** | **Senior Service Advisor** | **Renamed + expanded** ⚠️ see 1c |
| **SA Technician** | **Senior Service Advisor** | **MERGE** — consolidated (tech schedule/clock-in → staff record) |
| **SA No Reports** | **Senior Service Advisor** | **MERGE** — consolidated (gains Reports) |
| **SA Limited View** | **Service Advisor** (new, system-jsa) | Mapped to new role — AP/AR OFF preserves restriction |
| Foreman | Foreman | Direct (with expansions) |
| Technician | Technician | Direct mapping |
| Parts Manager | Parts Manager | Direct (with adjustments) |
| Parts Technician | Parts Technician | Direct (with expansions) |
| **Sales Representative** | **Sales Representative** | Direct mapping |
| **Reporting** | **Sales Representative** | **MERGE** — consolidated into Sales Rep (only 4 users) |
| Office | Office User (Office Staff) | Direct (with adjustments) |
| Time Clock | Time Clock User | Direct mapping |

### 1b. Inverted — for each STAGING system role, which PRODUCTION role(s) feed it
| STAGING system role | PRODUCTION role(s) that map in | Merge? |
|---|---|---|
| **Administrator (Admin)** | **Owner + Administrator** | YES (2→1) |
| Service Manager | Service Manager | 1:1 |
| **Senior Service Advisor** | **Service Advisor + SA Technician + SA No Reports** | YES (3→1) |
| **Service Advisor** (new) | **SA Limited View** | 1:1 (from a differently-named legacy role) |
| Foreman | Foreman | 1:1 |
| Technician | Technician | 1:1 |
| Parts Manager | Parts Manager | 1:1 |
| Parts Tech / Parts Technician | Parts Technician | 1:1 |
| Office User | Office | 1:1 |
| **Sales Representative** | **Sales Representative + Reporting** | YES (2→1) |
| Time Clock User | Time Clock | 1:1 |

**The 4 MERGES (many prod roles → one staging role):**
1. **Administrator** ← Owner + Administrator
2. **Senior Service Advisor** ← Service Advisor + SA Technician + SA No Reports
3. **Sales Representative** ← Sales Representative + Reporting
4. (**Service Advisor** new ← SA Limited View — 1:1 but a *rename*, so easy to confuse)

### 1c. ✅ RESOLVED 2026-07-14 — mapping CONFIRMED by QA lead (naming trap + contradiction settled)
> **CONFIRMED by QA lead 2026-07-14 (spec migration table is authoritative):**
> staging **Senior Service Advisor** ← legacy Service Advisor + SA Technician + SA No Reports
> (3 merged); staging **Service Advisor** ← legacy **SA Limited View**. The section-3549 1:1
> same-name migration cases (C26514/C26515) are **superseded**. **Administrator** is compared
> **1:1** (prod Administrator ↔ staging Administrator) — the spec's "Owner merged in" is **not
> applicable** (no Owner role exists in either environment). The delta workbook + `.md` are
> finalized under this confirmed mapping (Service-Advisor / Senior-SA rows no longer carry the
> mapping-unconfirmed flag). Original naming-trap analysis retained below for the record.

### 1c-orig. ⚠️ NAMING TRAP + a documented CONTRADICTION (original — now resolved above)
- **Naming trap:** the PRODUCTION role literally named **"Service Advisor"** maps to the
  STAGING role named **"Senior Service Advisor"** (renamed + expanded). The STAGING role
  named **"Service Advisor"** comes from a DIFFERENT production role (**"SA Limited View"**).
  Do NOT match on name alone — a name-match compare would pair the wrong roles and hide a
  large capability expansion.
- **Contradiction to resolve:** the migration TEST CASES in section 3549
  (C26514 "Legacy Service Advisor → Service Advisor", C26515 "Legacy Senior Service Advisor
  → Senior Service Advisor") were authored as **simple 1:1 same-name mappings**, which
  **conflicts** with the authoritative spec migration table (Service Advisor → Senior SA;
  SA Limited View → Service Advisor; no "Senior Service Advisor" legacy row exists at all).
  **NEEDS USER CONFIRMATION** — which is authoritative for the compare: the spec migration
  table (recommended) or the as-authored migration cases? This directly changes which prod
  role is diffed against Senior SA vs Service Advisor.
- **NEEDS USER CONFIRMATION (prod inventory):** the exact set of legacy roles ACTUALLY
  present in the specific production org we will compare. The 15 in the spec are the
  program-wide legacy catalog; a given prod org may have a subset and/or shop-specific
  custom roles. Enumerate the real prod role list live before mapping (do NOT assume all 15).
- **Migration-case cross-check (staging side, live-verified in the 0713 pass):** C26510
  Admin→Administrator; C26511 Office→Office User; C26512 Time Clock→Time Clock User; C26513
  Service Manager→Service Manager; C26516 Foreman→Foreman; C26517 Technician→Technician;
  C26518 Parts Manager→Parts Manager; C26519 Parts Tech→Parts Technician; C26520 Sales
  Representative→Sales Representative; **C27731 Owner→Administrator (Owner MERGED into Admin,
  Blocked-UI)**. These confirm the destination staging roles exist; the *prod-side* legacy
  inventory still needs live discovery.

---

## 2. Permission / capability VOCABULARY (staging NEW model) + the high-risk capabilities

### 2a. Staging new-model atoms (from `permission-catalog-source.json`, 41 codes + 3 cross-toggles)
CRUD-family atoms (View / Create&Edit / Delete per area):
- Work Orders: `workOrdersView`, `workOrdersCreateAndEdit`, `workOrdersDelete`
- WO Lines: `workOrderLinesCreateAndEdit`, `workOrderLinesDelete` (WO-Lines **View is inherited from WO View**, not independently configurable — spec line 402)
- Schedule: `scheduleView`, `scheduleCreateAndEdit`, `scheduleDelete`
- Customers: `customersView`, `customersCreateAndEdit`, `customersDelete`
- Part Sales: `partSalesView`, `partSalesCreateAndEdit`, `partSalesDelete`
- Catalog & Inventory: `catalogInventoryView`, `catalogInventoryCreateAndEdit`, `catalogInventoryDelete`
- Vendor & Order Mgmt: `vendorOrderManagementView`, `vendorOrderManagementCreateAndEdit`, `vendorOrderManagementDelete`
- Invoicing & Payments: `invoicingPaymentsView`, `invoicingPaymentsCreateAndEdit`, `invoicingPaymentsDelete`
- Timesheets: `timesheetsView`, `timesheetsCreateAndEdit` (no separate Delete)

Page-access toggles: `reportsPageAccess`, `customerPortalPageAccess`, `billingPortalPageAccess`

Settings sub-toggles: `settingsApp`, `settingsService`, `settingsParts`, `settingsIntegrations`,
`settingsFinance`, `settingsDataImport`, `settingsWages`

WO sub-settings: `woReviewWorkOrders`, `woPickParts`, `woOrderParts`

View mode: `woFullViewMode` / tech view (Technician view). Represented as a `view_mode`
field (`full` | `tech` | `none`) on the role.

Cross-cutting toggles: `seeFinancialData` (SFD), `seeApArData` (AP/AR), `viewHistoryLogs`.

### 2b. WHERE the user's worried capabilities live (send to terminal / send to portal)
- **Send to Portal** — a WO action button. In staging it is gated by **View Mode + line-review**:
  Tech View **HIDES** it (C26465, VIU-Verified); Full-view users who can approve lines see it
  (C26466). **CRITICAL:** the spec "Behavior Changes" table (line 480) explicitly says
  **Technician "Loses Send to Portal"** in migration → so **production Technician COULD Send to
  Portal, staging Technician CANNOT**. This is a confirmed PROD-only capability example and the
  archetype for the whole compare.
- **Send to Terminal** — take-payment action in the invoice/payment flow. Staging gates it on
  **`invoicingPaymentsCreateAndEdit` AND `customerPortalPageAccess` ON** (C26427, C29434 —
  both Blocked-UI; appears inside the payment dialog on an open invoice, not at WO-tab level).
  For the compare: check any prod role that had invoice/payment + terminal access whose mapped
  staging role now lacks Invoicing C&E or Customer Portal.

### 2c. Other HIGH-RISK capabilities to diff (production could grant more)
Derived from the spec's **"Behavior Changes for Migrating Users"** table (lines 474–485) —
these are the spec's OWN list of capability **reductions** (i.e. PROD-only capabilities) —
plus standing high-risk atoms:
| Staging role | PROD-only capability to check (spec-flagged "Loses …") |
|---|---|
| **Service Manager** | **Loses Invoicing Delete** (prod SM could **reverse invoices**); **loses Settings: Service, Parts, Finance, Data Import** |
| **Foreman** | **Loses Timesheets Edit** (`timesheetsCreateAndEdit`) |
| **Technician** | **Loses Send to Portal** |
| **Parts Manager** | **Loses WO Delete + WO Lines Delete** |
| **Office User** | **Catalog reduced to View only** (prod Office had Catalog Create&Edit) |
General high-risk atoms to always diff regardless of role: any `*Delete` (workOrdersDelete,
workOrderLinesDelete, invoicingPaymentsDelete, customersDelete, partSalesDelete,
catalogInventoryDelete, vendorOrderManagementDelete, scheduleDelete), `seeFinancialData`,
`seeApArData`, all `settings*`, `invoicingPaymentsCreateAndEdit` (create invoice / process
payment / reverse), `reportsPageAccess`, portal toggles, view mode, `viewHistoryLogs`,
Send to Terminal, Send to Portal.
Note also the **hard-coded Office rule** (spec line 493): Office users cannot Create Invoices
even if Invoicing CRUD is on — relevant when translating a prod Office invoicing capability.

### 2d. SV-8183 OLD→NEW enforcement mapping
No standalone SV-8183 doc exists in this repo for Custom Roles (SV-8183 matches only appear in
the Simple Flow project — different project, do NOT reuse). The **old→new permission translation
authority for Custom Roles is the spec migration + behavior-change tables above** (§1, §2c).
The staging **enforcement model** (how atoms are actually enforced) is documented:
`CustomRoles_TimeClock-API-Enforcement_2026-07-13.md` + RUN331-STATE §8 — **backend enforces
only resource-level View / Create&Edit; granular perms (Delete, WO sub-perms, cross-toggles,
view_mode) are FRONT-END display gates the raw API does not enforce.** Consequence for the
compare: capability presence must be judged from the **role definition (fe_permissions +
view_mode + cross_toggles)**, not from probing API 403s, because many gates are FE-only.

---

## 3. Comparison METHODOLOGY (capability-level, not raw-field diff)

**Principle:** compare **effective CAPABILITIES**, not raw permission field names. Prod (old
model) and staging (new model) use different representations; a field-name diff is meaningless.
Translate both sides into the staging capability vocabulary (§2a–§2c), then diff.

**Per staging role (11):**
1. **Enumerate STAGING effective capabilities.** Live: `GET /api/organizations/{org}/roles`
   → per-role `GET /api/roles/{id}` (fe_permissions array + view_mode + cross_toggles) +
   `GET /api/auth/me/fe-permissions` when logged in as a user of that role. `roles-matrix-2026-07-13.md`
   holds a captured snapshot but **role IDs are STALE (env reseeded) — re-derive live**
   (e.g. Time Clock User is now `be58f381-52fd-4958-9961-2d207bd1f09c` per the TimeClock doc,
   not the `a0359055…` in the matrix; `a0359055` now 500s as an invalid role_id).
2. **Identify the PRODUCTION role(s) that map to it** (§1b). For a merged staging role,
   compare against **the UNION** of the merged prod roles' capabilities (a prod user in ANY of
   the merged roles must not lose a capability unexpectedly) — but ALSO track per-prod-role so
   we can attribute which specific prod role had the extra capability.
3. **Enumerate PRODUCTION effective capabilities** for each prod role (old model — see §3a).
4. **Translate prod capabilities into staging vocabulary** (map old permission/flag → new atom
   using §1/§2c; flag anything that doesn't cleanly map).
5. **Diff → classify each capability:** `PROD-ONLY` (prod grants, staging doesn't = the
   finding we want), `match`, or `staging-more` (staging grants, prod didn't — note but not
   the target). Focus output on **PROD-ONLY**.
6. **Severity** each PROD-ONLY delta (see §4): financial/data-loss/security > operational > cosmetic.

### 3a. PRODUCTION-side API discovery (UNKNOWN old-model shape — discover live FIRST)
The old model's API representation is not documented here. **Before mapping, discover the prod
permission representation live (read-only GETs):**
- `GET /api/organizations/{org}/roles` — may return the legacy role list (confirm shape;
  old model may embed a permissions blob or boolean flags instead of the new fe_permissions array).
- `GET /api/roles/{id}` per prod role — inspect the permission representation.
- `GET /api/auth/me/fe-permissions` (or `/api/auth/me`) logged in as a prod user — old model may
  return a boolean map / legacy flag set rather than a code array.
- Candidate legacy endpoints to probe if the above don't exist on prod: `/api/permissions`,
  `/api/auth/me`, role objects on `/api/staff/{id}`. **Record the actual prod org UUID live**
  (do NOT assume it equals staging's `d55bc308-…`).
- **Deliverable-blocking discovery:** we must confirm (a) the real prod role inventory, (b) the
  prod permission representation, and (c) the prod org id — all live, read-only — before the
  capability translation can be trusted. Flag any prod capability that cannot be mapped to a
  staging atom rather than guessing.

---

## 4. Excel DELIVERABLE structure

**File:** `build/custom-roles-run/ProdVsStaging_RolePermissionDelta_2026-07-14.xlsx` (+ `.csv`).
Generated by a `gen_prod_vs_staging.py` (to be written at execution; keep VIU-word-free per
project rules; include TestRail links only where a case exists per Standing Rule 8).

**Main tab "Prod-vs-Staging Deltas"** — **BI-DIRECTIONAL.** One row per (staging role ×
capability) where **prod ≠ staging in EITHER direction**. LIST EVERY difference; spec-intended
changes are NOT filtered out — they are INCLUDED and annotated `Yes` so both kinds stay visible.
- **STAGING-LESS / PROD-MORE** — the role can do MORE in prod than in staging (prod grants a
  capability staging removed). [the original ask]
- **STAGING-MORE / PROD-LESS** — the new staging model grants the role MORE than prod currently
  has (a capability increase / possible over-grant).

| Column | Meaning |
|---|---|
| Staging Role | the new system role |
| Production role(s) mapped | the legacy role(s) feeding it (name the specific one holding the difference) |
| Capability | plain-language capability (e.g. "Send to Portal", "Reverse invoice", "Delete work order", "Edit timesheets", "Catalog Create & Edit") |
| Prod grants? | Yes/No |
| Staging grants? | Yes/No |
| **Direction (STAGING-LESS / STAGING-MORE)** | **STAGING-LESS** = prod grants more (staging removed it); **STAGING-MORE** = staging grants more than prod |
| **Per spec — intended? (Yes/No)** | **Yes** = the spec documents/accounts for this change (STAGING-LESS: an intended reduction; STAGING-MORE: an intended increase) — cite it; **No** = the spec does NOT account for it — a **release-risk** item needing a decision (unaccounted reduction OR unexpected over-grant) |
| **Spec citation** | the spec section/line that makes it `Yes`, or **"not in spec"** for `No` |
| Severity | High / Medium / Low (financial-payment-security & data-delete = High) |
| Evidence / source | spec line, migration case C#, roles-matrix row, live API capture ref (+ naming-trap/merge/FE-only-gate caveats) |
| Confidence (live/spec-predicted/NEEDS-REVIEW) | how the row was sourced |

> **ALL prod≠staging differences are listed in BOTH directions** — spec-intended changes are
> included, just annotated `Yes` with a spec citation. The **`No` rows in BOTH directions are the
> headline release risks**: unaccounted reductions (STAGING-LESS + No) AND unexpected over-grants
> (STAGING-MORE + No). Both require a keep/change decision.

**Additional tabs:**
- **"Summary per role"** — one row per staging role with a **2×2 breakdown**:
  **[Staging-LESS: Yes-count / No-count]** and **[Staging-MORE: Yes-count / No-count]** — plus
  highest severity, merged? (Y/N), mapped prod role(s), confirmation-needed? flag. The **No**
  counts in either direction are the headline release risks.
- **"Full capability matrix"** — every capability × every role, prod vs staging side-by-side
  (audit backing for the deltas), so match/staging-more rows are traceable too.
- **"Open questions / confirmations"** — the NEEDS-USER-CONFIRMATION items from §1c and any
  unmappable prod capabilities.

---

## 5. RISKS / CAUTIONS (release-critical)
1. **NEVER write to production** — read-only GETs only. No role/staff/settings/data changes.
   TestRail = real, no writes without fresh authorization. (Staging stays disposable per rules.)
2. **Model mismatch** — prod (old) and staging (new) use different permission representations;
   MUST compare translated CAPABILITIES, not raw fields. Prod API shape is UNKNOWN → discover
   live before mapping (§3a).
3. **Merged-role ambiguity** — 4 staging roles absorb multiple prod roles (§1b). For a merge,
   diff against the UNION but attribute the extra capability to the specific prod role; a prod
   user in a merged role that lost a capability is the exact risk.
4. **Naming trap / spec-vs-case contradiction (§1c)** — legacy "Service Advisor" → staging
   "Senior Service Advisor" (NOT staging "Service Advisor"); the 3549 migration cases contradict
   the spec table. Do NOT match on name. **NEEDS USER CONFIRMATION before execution.**
5. **Prod role inventory unknown** — do not assume all 15 legacy roles exist in the target prod
   org, and watch for shop-specific custom roles. Enumerate live.
6. **Stale staging role IDs** — `roles-matrix-2026-07-13.md` IDs are from before an env reseed;
   re-derive every role ID live (Time Clock User now `be58f381-…`).
7. **FE-only enforcement** — many gates (Delete, WO sub-perms, cross-toggles, view_mode, Send to
   Portal/Terminal) are front-end display gates the raw API doesn't 403 on; judge capability from
   the ROLE DEFINITION (fe_permissions + view_mode + cross_toggles), not from API probe results.
8. **Flag, don't guess** — any prod capability that doesn't cleanly translate to a staging atom
   goes to the "Open questions" tab marked NEEDS-USER-CONFIRMATION; never invent a mapping.
9. **Shared staging org** — never assume env state; re-read before runs. If a Tech role switch is
   needed for a live capability check, EXACT email match `tech@shopview.com`, then RESTORE
   (Tech is currently drifted to Technician).

---

## 6. Ready-to-execute checklist (once cookies arrive + mapping confirmed)
1. Confirm §1c items with the user (spec-table vs migration-cases authority; prod role inventory).
2. Supply prod + staging cookies to `/tmp/custom-roles/` (chmod 600, never in repo).
3. **Discover prod live (read-only):** prod org id, prod role inventory, prod permission shape (§3a).
4. **Capture staging live:** re-derive role IDs + per-role fe_permissions/view_mode/cross_toggles.
5. Translate prod → staging vocabulary; diff per §3; classify PROD-ONLY.
6. Build `gen_prod_vs_staging.py` → emit the workbook (§4). State findings + severities.
