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
  Financial Data** (ordering involves prices/costs). *(Intended to also gate the
  WO Parts tab — see §B/§C for the not-yet-confirmed part.)*
- **Pick Parts** — pick in-stock parts.
- **Add Parts** — add a part to a work-order line.
- **Review Work Orders** — the Review sign-off step; until Review is done,
  **Create Invoice stays disabled**.

**View Mode (Full vs Tech):** each role has a work-order **view mode**.
- **Full View** = the complete work-order screen, including the line **Approve**
  action and financial actions.
- **Tech View** = a simplified, technician-focused view that **hides the Approve
  action** (and other non-tech controls). Used for roles that do hands-on work but
  shouldn't approve/see everything.

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
- **View History Logs** — shows work-order history: the **WO-level Audit Log /
  History** and the **line-level story/history**. **Work orders only** — there is
  **no** history log for Part Sales or Purchase Orders (confirmed with product
  owner).

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
| **Order Parts controls the WO Parts tab (ON shows / OFF hides)** | Tab visibility looked the same ON/OFF; **not confirmed** on staging | Gap case 27868 (created, not verified); playbook "needs manual confirm" |
| **QuickBooks relocated into Finance settings; Integrations group removed** | **QuickBooks is absent** from Finance (and everywhere); the **Integrations group is still present** (now hosts "IBS") | Cases 26448, 26529–26531 FAILED |
| **Migration renames / legacy-role consolidation UI (Owner, SA Technician, JSA split, etc.)** | Staging is already post-migration; legacy roles / rename labels not observable ("Time Clock" not "Time Clock User"; no JSA role) | Migration cases 26507–26524 Blocked/Failed |
| **On-toggle warning modal when enabling See Financial Data** | No dedicated warning modal on the toggle; access is only summarised in the Save "Confirm Permission Updates" dialog | Cases 26536, 26535 |
| **Core OK/Not-OK + line story governed by WO Lines: Create & Edit** | The model is documented, but the core control could not be exercised — **not independently verified** | Gap case 27870 (not driven) |

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

1. **No single authoritative permission-key catalog file** exists in the repo; the
   list in §A3 is assembled from the playbook + run summaries. A formal atom list
   (all 41 Admin permissions with machine keys) is not enumerated in one place.
2. **WO Parts tab gating by Order Parts** is unconfirmed (looked identical ON/OFF).
3. **Line-level history** visibility (vs WO-level) was not individually exercised;
   only WO-level history was confirmed.
4. **Core OK/Not-OK** control was never driven (couldn't seed a received core part).
5. **Per-role page-access details** (e.g. Customer Portal per role) are only partly
   captured (SM = ON confirmed).
6. **View Mode** matrix is only partially verified (7 passed / 8 retest in the
   View Mode section); the Full-vs-Tech concept is confirmed but not exhaustively.
</content>
</invoke>
