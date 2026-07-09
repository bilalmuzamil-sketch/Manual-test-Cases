# Custom Roles & Permissions — Consolidated Current State

> **Purpose.** A single, current-state picture of ShopView Custom Roles &
> Permissions, consolidated from all project memory. It separates **(a) what is
> LIVE** on staging (safe to tell customers), **(b) UPCOMING / spec-pending**
> changes (not live yet), and **(c) known issues / internal caveats** (not for
> customers).
>
> **Sources consolidated:** `CLAUDE.md` (Custom Roles detail, "Key findings",
> Sasha's spec updates, the CAUTION note); `build/TESTING-RUNBOOK.md`;
> `build/APP-ACTIONS-PLAYBOOK.md`; `build/custom-roles-run/CustomRoles_Run312_SUMMARY.md`
> (159 Passed = live; 34 Failed / 44 Retest = spec-not-yet-implemented or drift);
> `build/custom-roles-run/run-plan.json` / `run-plan.md`;
> `build/custom-roles-spec-update/*` (amended / created / deleted case audits);
> `build/custom-roles-run/sv8193-viu-findings.md` (fresh VIU delete proof);
> `build/PERMISSIONS-ASSESSMENT.md`.
>
> **Date consolidated:** 2026-07-07. **Env:** `app.staging.shopview.com` /
> `api.staging.shopview.com`.
>
> **Spec-update ingest (2026-07-09):** ingested the updated Confluence spec
> "Custom Roles and Permissions" (SV-7388), **export dated 09 Jul 2026** (latest
> Change Log row 09 Jul 2026). Verbatim copy:
> `build/custom-roles-spec-update/updated-spec-source.md`; full delta:
> `build/custom-roles-spec-update/updated-spec-diff.md`; TestRail write audit:
> `build/custom-roles-spec-update/testrail-caseupdate-2-log.md`. This pass diffed
> the spec against the **RUN 331** case set (160 cases;
> `build/custom-roles-run/run331-tests.json`) and updated 3 cases (C2528, C26424,
> C26475), flagging 16 others. **Several §B "spec-pending" items below are now
> confirmed in the updated spec** (Order Parts controls the WO Parts tab + requires
> SFD; aging reports follow the Reports permission; Integrations settings stays and
> hosts QuickBooks/IBS/Open API) — treat §B as historical drift notes pending the
> Phase-2 VIU re-verification. **New/changed spec expectations for Phase-2 VIU:**
> View History Logs renamed **View Part History** (Part-history only; WO audit log
> now needs WO Create&Edit, line story needs WOL View); Reverse Invoice moved to
> **WO → Delete**; SFD OFF **prompts** to disable dependents (no silent auto-clear);
> Manage AP/AR requires SFD ON + gates sensitive **Vendor** fields; Customer Portal
> default ON for SA/SSA/SM/PM; Office **cannot create invoices** (hard-coded);
> customer notes governed by **Customer Management** perms; Send to Portal needs
> Full View; Send to Terminal needs Invoicing C&E + Customer Portal ON.

---

## 0. The two-layer model (how permissions actually work)

1. **A permission grants an action** (e.g. Work Orders: Create & Edit).
2. **Some actions also need a related toggle** (e.g. seeing money needs **See
   Financial Data**; ordering parts is meant to go together with See Financial
   Data because ordering shows prices).

**Enforcement reality (verified):** the **backend enforces only resource-level
View / Create & Edit**. Granular **Delete**, WO sub-permissions, the cross-toggles,
and the view mode are **front-end display gates** — the UI hides the control, but
the raw API frequently does not block it. (This nuance is INTERNAL — see §C.)

---

## A. LIVE / IMPLEMENTED — safe to tell customers

Everything here is grounded in run-312 **Passed** cases, VIU proof, and the
proven playbook.

### A1. System roles (the built-in roles)

There are **11 system roles**, all shipped as defaults (`default=true`):

`Administrator`, `Office`, `Time Clock` (labelled "Time Clock"), `Service Manager`,
`Service Advisor`, `Senior Service Advisor`, `Foreman`, `Technician`,
`Parts Manager`, `Parts Technician`, `Sales Representative`.

- **No system role can be deleted.**
- **Only `Office` and `Time Clock` are non-editable** (they show a lock and an
  eye/"View Permissions" only — read-only summary at `/{id}/summary`).
- **All other system roles, including Administrator, are editable** (pencil +
  three-dot Edit). Administrator's toggles are shown but disabled with a
  **"Full administrative access"** banner (Admin = all 41 permissions ON).
- **Actions column:** a standalone **eye (View Permissions)** icon appears **only**
  for Office and Time Clock. For every other role (system or custom) View
  Permissions lives inside the **three-dot menu**.
- Confirmed defaults of note: `Sales Representative` = exactly Reports + See
  Financial Data + Manage AP/AR (3 perms); `Senior Service Advisor` = 32 perms
  incl. Reports; `Administrator` = all 41.

### A2. Creating & editing custom roles

- Admins create a role via **Settings → Roles & Permissions → Create custom role**,
  optionally starting from a **template** (Apply prefills; Skip = blank).
- A role needs a **name** and **at least one permission** to save
  ("At least one permission is required"). Duplicate name → blocked; duplicate
  permission set → "Similar role already exists" confirm.
- **Edit** via the row pencil; Save shows a **"Confirm Permission Updates"** dialog
  listing what was added/removed.
- **A role with assigned users cannot be deleted** — the Delete action is hidden /
  disabled until users are reassigned to 0.
- **Reset to Template** (on a template-based role) restores that template's
  defaults; Save enables only if the role currently differs from the template.
- **CRUD cascade:** ticking **Delete** auto-ticks **Create & Edit** + **View**;
  un-ticking **View** clears everything under that resource. There is **no upward
  cascade** (you can't enable a sub-item while its parent View is off).
- **Assigning a role** to a staff member: Settings → Staff → Edit Staff Member →
  Role select, grouped **SYSTEM / CUSTOM**; an eye icon previews the role's
  permissions.
- **Changing a user's role forces re-login** — the held session expires
  immediately (HTTP 409); the new permissions apply on next login. This is
  expected behaviour, not an error.

### A3. Permission catalog (resources & structure — as it appears live)

**Authoritative source list (2026-07-07):** the machine catalog of all permission
atoms is now captured in **`build/custom-roles-run/permission-catalog-source.json`**
(`GET /api/roles/{Admin}` → `fe_permissions`). Admin = **41 permission atoms**.
View mode is itself a mutually-exclusive code (`woFullViewMode` / `woTechViewMode`),
so there are 42 distinct codes but any single role carries exactly one → "~41" per
role. The three `cross_toggles` are `seeFinancialData`, `seeApArData`,
`viewHistoryLogs`. `GET /api/auth/me/fe-permissions` returns `fe_permissions` as
code strings + `view_mode` + `cross_toggles`.

Resource cards, each with the columns shown:

| Resource / card | Columns present | Notes (live) |
|---|---|---|
| **Work Orders** | View · Create & Edit · Delete | Parent for WO Lines and the WO sub-toggles. |
| **Work Order Lines** | Create & Edit · Delete (**no View column**) | Inherits visibility from Work Orders: View. |
| **Schedule** | View · Create & Edit | Calendar shows all users' appointments. |
| **Customer Management** | View · Create & Edit · Delete | Customers area. |
| **Parts Department** | View · Create & Edit · Delete | **One consolidated card** — Catalog, Inventory, Vendors/Orders, and **Part Sales** live under it (there is no separate "Part sales" card in the current UI). |
| **Invoicing & Payments** | View · Create & Edit · Delete | Finance tab, invoices, payments. |
| **Timesheets** | View · Create & Edit (**no Delete column**) | Timesheet activity. |
| **Reports** | Page access (**all-or-nothing**) | One switch; governs the Reports area. |
| **Settings** | Parent + **6 sub-toggles** | App Settings, Service, Parts, Finance, Data Import, View/Manage Wages. (No 7th "Integrations" sub-toggle.) |
| **Page-access toggles** | on/off | e.g. Customer Portal access. |

**Work Order sub-permissions (under Work Orders):**
- **Order Parts** — order parts on a work order. Works together with **See
  Financial Data** (ordering involves prices/costs). **CONFIRMED LIVE
  (2026-07-07 VIU): Order Parts controls the WO Parts tab** — ON shows the Parts
  tab (grid with a Core column); OFF hides it. Gated specifically by Order Parts,
  not Pick Parts (Pick ON with Order OFF still hides the tab). Screenshots
  `support-viu/g2_*`.
- **Pick Parts** — pick in-stock parts.
- **Review Work Orders** — the Review sign-off step; until Review is done,
  **Create Invoice stays disabled**.

*(Note: there is **no separate "Add Parts" permission atom** — the WO sub-perms in
the catalog are Order Parts, Pick Parts, Review Work Orders, and the view-mode
code. See the authoritative list in `permission-catalog-source.json`.)*

**View Mode (Full vs Tech):** each role has a work-order **view mode**, expressed
as a permission code — `woFullViewMode` (Full) or `woTechViewMode` (Tech),
mutually exclusive.
- **Full View** = the complete work-order screen.
- **Tech View** = a simplified, technician-focused view.

**CONFIRMED LIVE (2026-07-07 VIU) — Full-vs-Tech differences on the WO Lines
screen** (with See Financial Data held equal, so money shows in both):

| Element | Full view | Tech view |
|---|---|---|
| Per-line **Approve / Decline** action | Shown | **Hidden** |
| Lines-toolbar **bulk-approve** icon | Shown | **Hidden** |
| WO header hours label | "Total Hours" | "Total **Tech** Hours" |
| Rate / Margin / Line total | governed by **See Financial Data**, not view mode | same |

Headline: view mode's job is to **remove the Approve action** (per-line + bulk);
money visibility is a separate lever (See Financial Data). Screenshots
`support-viu/g4_*`.

**Cross-cutting toggles (apply across resources):**
- **See Financial Data (SFD)** — shows dollar amounts on **work orders, parts, and
  invoices**; required for the **Finance tab** (together with Invoicing: View); and
  reveals cost/sell columns in the Catalog. *(Scoped to WO/parts/invoices — it does
  NOT govern the Reports area; see §B on the Reports Sales report.)*
- **Manage Accounts Payable & Receivable (AP/AR)** — reveals the **7 sensitive
  customer fields** (Credit Terms, Credit Limit, Default Labor Rate, Default Shop
  Supplies, Min & Max, Taxes, "PO is required") and the customer AP/AR tabs.
  **Currently also gates the AP/AR aging reports** (see §B — the move to
  Reports-only is not live yet).
- **View History Logs** — shows work-order history. **CONFIRMED LIVE
  (2026-07-07 VIU):** it is a **single WO history feed that contains BOTH
  WO-level events** (e.g. `work_order.created`, `lineId: null`) **AND line-level
  events** (e.g. `work_order.line.created`, populated `lineId`/`lineName`) — one
  feed, keyed by presence of `lineId`. Surfaces as the WO **History** tab (via
  `GET /api/work-orders/{wo}/history`). **Work orders only** — part-sales /
  inventory-order / purchase-order history endpoints all 404; there is **no**
  history log for Part Sales or Purchase Orders (confirmed with product owner).

### A4. Notes behaviour (live, per Sasha's confirmed rule)

- **Work Orders: View lets a user create and edit ANY note** on a work order
  (not just their own).
- **Work Orders: Delete lets a user delete ANY note.**
  (Confirmed live: an admin edited a technician-authored note successfully.)

### A5. Financial-data gating (live)

- With **See Financial Data OFF**, dollar figures on work orders, parts, and
  invoices are hidden; the **Finance tab does not appear at all** (even with
  Invoicing View/Create&Edit).
- Catalog **cost/sell price columns** are hidden with SFD OFF; parts are still
  creatable.

### A6. Settings structure (live)

- The **Settings** parent reveals exactly **6** sub-toggles (App Settings,
  Service, Parts, Finance, Data Import, View/Manage Wages).
- Sidebar mapping: **App Settings** → Settings, Staff, Roles & Permissions,
  Locations, Departments, Taxes · **Service** → Labor Rates, Canned Lines, Asset
  Types, Inspection Templates · **Parts** → Pricing, Bin Locations, Categories ·
  **Finance** → Payment Methods · **Data Import** → Contacts/Assets/Vendors/
  Inventory/Invoices · **Wages** → staff wage fields.

---

## B. UPCOMING / SPEC-PENDING — NOT LIVE YET

These are Sasha's spec updates (SV-7388 model) that run 312 shows are **not yet
implemented on staging**. Do **not** tell customers these behave this way today.

| Spec-pending change | What's live today instead | Evidence |
|---|---|---|
| **Aging reports follow the Reports permission (all-or-nothing), no longer Manage AP/AR** | Aging reports are **still gated by Manage AP/AR** (plus Reports) today | Case 26482 FAILED |
| **Order Parts editor dependency on See Financial Data auto-enforced** (turning SFD off auto-clears Order Parts; turning Order Parts on prompts to enable SFD) | The role editor does **not** auto-link them — you can toggle Order Parts on with SFD off, and turning SFD off does not clear Order Parts | Cases 26475, 27869 FAILED |
| **QuickBooks relocated into Finance settings; Integrations group removed** | **QuickBooks is absent** from Finance (and everywhere); the **Integrations group is still present** (now hosts "IBS") | Cases 26448, 26529–26531 FAILED |
| **Migration renames / legacy-role consolidation UI (Owner, SA Technician, JSA split, etc.)** | Staging is already post-migration; legacy roles / rename labels not observable ("Time Clock" not "Time Clock User"; no JSA role) | Migration cases 26507–26524 Blocked/Failed |
| **On-toggle warning modal when enabling See Financial Data** | No dedicated warning modal on the toggle; access is only summarised in the Save "Confirm Permission Updates" dialog | Cases 26536, 26535 |
| **Core OK/Not-OK + line story governed by WO Lines: Create & Edit** | Model documented; core UI surface confirmed live (Parts grid "Core" column; inventory `is_core`/`core_charge`/`core_part_id` fields; e.g. part "CONNECTOR" core_charge $20) but the OK/Not-OK action still **not driven end-to-end** (needs a received core part seeded manually) | Gap case 27870 (not driven); 2026-07-07 VIU §Gap 5 |

> **Resolved since last consolidation (2026-07-07 VIU):** "Order Parts controls
> the WO Parts tab" is now **CONFIRMED LIVE** (moved to §A3 — ON shows / OFF hides,
> gated by Order Parts specifically).

**Note on Reports Sales report:** with SFD OFF the **Reports → Sales report still
shows financial data**. This is likely **by design** (SFD is scoped to
WO/parts/invoices; the Reports area is gated only by the Reports permission), not a
pending change — but it is a common point of confusion. (Case 26469.)

---

## C. KNOWN ISSUES / CAVEATS — INTERNAL ONLY (not for customers)

### C1. Completed-inspection delete (SV-8193) — confirmed live defect
A role with **Work Order Lines: View/Edit but NOT Delete** (verified for
**Technician** and **Parts Manager**) can **actually delete a completed
inspection**. The bin control is shown, and the backend **allows** the delete
(`DELETE /api/inspections/{id}` → **204**, inspection genuinely gone / GET → 404).
It is **not** merely a wrongly-shown button — there is no 403. SV-8095 AC3B
(delete/reopen a completed inspection requires WO Lines: Delete) is enforced in
**neither the FE nor the API**. Filed as **SV-8193** (awaiting Ayesha's confirm).

### C2. Front-end display gate vs backend enforcement
The backend enforces only **resource-level View / Create & Edit**. These are
**FE-only display gates** the raw API does **not** enforce (observed):
- Granular **Delete** permissions (e.g. inspection delete above; catalog
  `change/remove` returned 200 for view-only Office / no-delete Parts Tech).
- **change-service-advisor** succeeded for a Technician despite the FE hiding it.
- WO sub-toggles (Order/Pick) return **400 validation, not 403** when missing.

**Implication for support/QA:** "this role can't do X" claims that rely on a
granular Delete / sub-toggle are **UI-level only**; a determined API call may still
succeed. Denial expectations must be verified in the **UI**, not by the endpoint.

### C3. Other observed gaps (internal)
- **Add Customer / Add Asset** affordances on the New Work Order dialog appear and
  function even when Customer Management: Create & Edit is OFF (FE-gating gap;
  cases 26387/26388).
- **Zero-permission roles** cannot be created (API 400 "At least one permission is
  required") — some adversarial cases are not establishable.
- **Existing-WO detail pages bounce** to `/workorders` on mount for all roles in
  the harness; a freshly-created WO is needed to land on the detail page (test
  tooling note, not a customer behaviour).

---

## D. Run 312 headline (context)

253 of 254 in-scope cases executed; **159 Passed** (logged to run 312 as the live
baseline), **34 Failed**, **44 Retest**, **16 Blocked**, 1 Not Run. Failures split
into ~17 real discrepancies (spec-not-yet-implemented, per §B) and ~17 stale cases
(UI/string drift where behaviour is actually correct). Combo+Breakage,
Digital-Inspections DVI, and Backend-API sections were out of scope for this run.

---

## E. What could NOT be determined from the files (gaps to fill)

**2026-07-07 VIU update:** gaps 1–3 and 6 below are now **CLOSED**; gap 4 is
**PARTIAL**. See `support-viu-findings.md` and
`permission-catalog-source.json`.

1. ~~No single authoritative permission-key catalog file.~~ **CLOSED** — captured
   to `build/custom-roles-run/permission-catalog-source.json` (41 Admin atoms).
2. ~~WO Parts tab gating by Order Parts unconfirmed.~~ **CLOSED** — Order Parts ON
   shows the Parts tab / OFF hides it (gated by Order Parts, not Pick Parts).
3. ~~Line-level vs WO-level history not exercised.~~ **CLOSED** — one WO history
   feed carries both (`work_order.created` WO-level + `work_order.line.created`
   line-level); part-sales/PO history 404 (WO-only).
4. **Core OK/Not-OK** — **PARTIAL.** Core UI surface + data fields confirmed live
   (Parts grid "Core" column; inventory `is_core`/`core_charge`/`core_part_id`),
   but the OK/Not-OK action still not driven (needs a manually-seeded received
   core part).
5. **Per-role page-access details** (e.g. Customer Portal per role) are only partly
   captured (SM = ON confirmed). *(Not in scope of this VIU.)*
6. ~~View Mode matrix only partially verified.~~ **CLOSED** — Full-vs-Tech
   confirmed: Tech view hides per-line Approve/Decline + the bulk-approve icon and
   relabels hours "Total Tech Hours"; financials are governed by See Financial
   Data, not view mode (see §A3 matrix).
</content>
</invoke>
