# Knowledge Base — ShopView Custom Roles and Permissions

Distilled from the official product specification (Confluence, snapshot
2026-07-09). This is the support bot's single source of truth for feature
behavior.

---

## 1. What the feature is

ShopView previously had 15 hardcoded roles with no way to customize them.
Shops often granted Administrator access to people who only needed one extra
capability, over-exposing sensitive data. This release replaces that with a
configurable permission system:

- **12 system roles** ship as sensible defaults (Admin, Service Manager,
  Senior Service Advisor, Service Advisor, Foreman, Technician, Parts Manager,
  Parts Tech, Office, Sales Representative, Time Clock).
- Admins can create **custom roles**: start from a system role template, then
  change any setting.
- Every user has **exactly one role**. There is no combining/stacking of
  roles.

**In this release:** the Roles & Permissions admin page (list/create/edit/
delete), the updated Staff page role assignment, the full permission model,
and the migration from the 15 legacy roles.

**NOT in this release (out of scope — do not promise these):**
- Audit log of permission changes
- Dashboard type assignment per role
- Data scoping (e.g. "view only my own records" — a technician with Work
  Orders View sees ALL work orders, not just theirs; the schedule always
  shows all technicians)
- Per-report access control (Reports is all-or-nothing)

**Feature access, not data access:** permissions control access to features/
pages. Example: a user who can create work orders but has no Customers access
can still pick a customer from the list inside the New Work Order flow — they
just don't see the Customers item in the top navigation.

---

## 2. Core concepts

### Roles

- **System roles** — 12 built-in templates. They CAN be edited (a shop can
  tweak the defaults), with two exceptions: **Office** and **Time Clock**
  cannot be edited (opening them shows a read-only permission summary). The
  **Admin** system role cannot be edited to lose access to the Admin pages
  (prevents locking everyone out). System roles can never be deleted.
- **Custom roles** — created by admins, always starting from a system role
  template (the template choice is saved for reference). Can be edited and
  deleted.

### Permission building blocks

1. **CRUD areas** — View / Create-and-Edit / Delete per functional area.
2. **Page access toggles** — on/off for whole sections (Reports, Customer
   Portal, Billing Portal, Parts Department).
3. **Settings access** — parent toggle + 7 sub-toggles for admin sections.
4. **Work Order sub-settings** — Review Work Orders, Pick Parts, Order Parts.
5. **View Mode** — Tech View vs Full View (UI simplification, NOT security).
6. **Cross-cutting toggles** — See Financial Data; Manage Accounts Payable
   and Receivable; View Part History.

### The CRUD cascade rule (applies to every CRUD area)

- **Delete requires Edit; Edit requires View.**
- Enabling a higher level auto-enables the ones below (turning on Delete turns
  on Edit and View).
- Disabling a lower level auto-disables the ones above (turning off View turns
  off Edit and Delete).
- "Create and Edit" is one combined level — there is no separate
  create-without-edit.

### When access is off, the nav item is hidden

No greyed-out menus: if a user lacks View on an area (or a page toggle is
off), that top-level navigation item simply is not there for them.

---

## 3. CRUD areas — what each level controls

### 3a. Work Orders (`workOrders`)

- **View:** see the WO list and open WO detail pages. Includes the Notes tab:
  can create notes, edit ANY note (notes are collaborative), and delete their
  OWN notes. Can mark cores Ok / Not Ok (everyone with WO View can — agreed
  product decision). If OFF, the Work Orders nav item is hidden.
- **Create and Edit:** create WOs; edit WO fields (customer details / change
  customer, asset, service advisor, lead technician, status, on-site status
  of asset). Can view WO-level and line-level audit logs.
- **Delete:** delete WOs; **reverse a work order's invoice** (reversal moved
  here from Invoicing Delete) as long as validation passes (e.g. no payments
  made); delete ANY note including other users'. NOT enough to delete payments
  (that's Invoicing: Delete). Note: reversing a *part sale* invoice is under
  Part Sales: Delete, not here.

**Work Order sub-settings** (always visible in role editor; greyed out when
WO View is OFF; they require only WO **View**, not Edit):

- **Review Work Orders** (`woReviewWorkOrders`) — see and use the Review
  option on WOs. Without it, no Review option. This setting always wins over
  View Mode (Full or Tech).
- **Pick Parts** (`woPickParts`) — pick parts from inventory onto a WO line.
- **Order Parts** (`woOrderParts`) — place POs for parts needed on a WO
  (creates a PO linked to the WO); also controls receiving part deliveries
  onto a WO and visibility of the **Parts tab** on the WO. **Requires "See
  Financial Data"** — enabling it while that's off prompts to enable it.

The three are independent (e.g. Foreman-style: Pick Parts ON, Order Parts
OFF). **Returning a part from a WO line requires no permission** — anyone who
can see the WO can return a part.

### 3b. Work Order Lines (`workOrderLines`)

Child of Work Orders. **No independent View** — lines are visible whenever WO
View is ON.

- **Create and Edit:** add lines, edit line details, move parts between
  lines, authorize lines, manage part requests on lines, add inspections to
  lines, delete INCOMPLETE inspections, edit mileage / engine hours / license
  plate / VIN.
- **Delete:** remove lines; reopen COMPLETED digital inspections; delete
  COMPLETED inspections.
- Story history at line level requires WOL View (i.e. WO View).

### 3c. Schedule (`schedule`)

- **View:** see the schedule/calendar page, appointments, tech assignments.
  Shows ALL technicians (no "own only" filter — it's a shared coordination
  resource). If OFF, nav item hidden.
- **Create and Edit:** create/modify appointments, assign technicians,
  drag-and-drop.
- **Delete:** remove appointments.

### 3d. Customer Management (`customers`)

- **View:** see customers, contacts, vehicles, vehicle history. Notes tab (on
  both Customer AND Asset — see §3k): create notes, edit anyone's notes, delete
  own notes. If OFF, nav hidden.
- **Create and Edit:** create/edit customers (incl. the Notes field), manage
  contacts and vehicles. Also enables creating a customer inside the New WO
  flow. Sensitive fields are hidden unless "Manage AP/AR" is on (see §7b).
- **Delete:** delete customer records; delete notes other people created.
  Does NOT allow deleting customer payments (that's Invoicing: Delete).

### 3e. Part Sales (`partSales`)

Gated by the **Parts Department** parent toggle AND requires **See Financial
Data** (part sales inherently involve pricing; enabling any checkbox while
financial data is off triggers the confirmation modal).

- **View:** view part sales, part returns, part transactions.
- **Create and Edit:** create part sales and returns, process transactions.
- **Delete:** delete part sales and reverse part-sale invoices.

### 3f. Catalog and Inventory (`catalogInventory`)

Gated by Parts Department.

- **View:** browse catalog, view inventory levels/stock, view parts history.
- **Create and Edit:** create/edit catalog entries; inventory adjustments
  INCLUDING returning items to inventory (restocking); cycle counts.
- **Delete:** delete parts from the catalog.

### 3g. Vendor and Order Management (`vendorOrderManagement`)

Gated by Parts Department.

- **View:** view vendors, purchase orders, deliveries, part history, part
  return requests.
- **Create and Edit:** create/edit vendors; create/manage POs; manage
  deliveries; create vendor invoices; return parts to vendors or inventory.
- **Delete:** delete vendors and purchase orders.

### 3h. View Part History (single toggle)

Gated by Parts Department. Lives under Part Sales, last in the list. ON = the
Part History icon on the inventory page works; OFF = it's hidden. (Label was
formerly "View History Logs"; it now controls ONLY part history.)

### 3i. Invoicing and Payments (`invoicingPayments`)

Requires **See Financial Data**. **Delete additionally requires Manage
AP/AR** (enabling Delete while AP/AR is off prompts to enable it).

- **View:** view invoices from WOs, part sales, or customers (needs access to
  those entry points too). If OFF but See Financial Data is ON: user still
  sees pricing on WOs, just can't open invoices.
- **Create and Edit:** create invoices, process payments from WOs and part
  sales, manage invoice fields, collect **deposits**, **Send to Terminal**
  (Send to Terminal also requires Customer Portal ON).
- **Delete:** delete payments (including customer payments), void
  transactions, delete a part-sale return. (Invoice REVERSAL is NOT here —
  it moved to Work Orders: Delete / Part Sales: Delete.)

### 3j. Timesheets (`timesheets`)

- **View:** view timesheets from work orders. If OFF the Timesheets nav item
  is hidden — but a user with Reports ON still sees the timesheet activities
  report.
- **Create and Edit:** edit timesheet entries, adjust hours, manage
  attendance for all staff (from the WO and from the timesheet activities
  report).
- **No Delete level exists for Timesheets.**
- **Everyone can always clock in/out** regardless of this setting, and anyone
  who can clock in/out can see "My Timesheets".

### 3k. Notes across the app (WO, Customer, Asset, Reports, Notifications)

Notes appear in several places and are **not their own permission** — each notes
surface follows the CRUD of a governing area (ruling per SV-8003, Sasha
Grosman, spec-updated). There are two different things called "notes": the
**Notes tab** and the **Notes field**.

**Notes TAB** (Work Order > Notes incl. line notes; Customer > Notes; Asset >
Notes). Governing area:
- Work Order notes → **Work Orders** CRUD.
- **Customer notes AND Asset notes → Customer Management CRUD** (Asset has no
  separate permission; it rides on Customer).

Rules on a notes tab:
- **View** (of the governing area): create notes; **edit anyone's notes**;
  delete **only your own** notes.
- **Delete** (of the governing area): additionally **delete other people's
  notes**.
- So: WO View / Customer View = create + edit-any + delete-own; WO Delete /
  Customer Delete = also delete-others.

**Important UI behavior:** for a user WITHOUT the governing Delete permission,
the Edit / Delete / Attach-files options on **other people's** notes are
**hidden** (not shown-then-403). Every user can always create, edit, and delete
**their own** notes. So "the edit/delete option disappeared on someone else's
note" is expected for a role without Delete — not a bug.

**Notes FIELD** (the Notes box on the Edit Customer and Edit Asset modals, and
the equivalent on WO). This follows the **same CRUD as the other fields on that
modal**, NOT the tab rules above:
- **View** of the governing area = see the field's value.
- **Create and Edit** of the governing area = open the edit modal and change the
  field.
- (Customer/Asset field → Customer CRUD; WO field → Work Orders CRUD.)

**Other notes surfaces:**
- **Notifications** (personal reminders/notes, the icon by the profile menu) —
  available to **everyone**, not behind any permission.
- **Reports > Notes** page (and Reminders) — covered by the **Reports** toggle;
  Reports ON grants access to everything on Reports, including Notes.

**Known enforcement gap (escalate if hit):** as of the latest testing, the
Customer/Asset side of "edit or delete other people's notes" may still return an
Access-restricted (403) error on save/delete even when the role has Customer
View/Delete — the fix was in progress. If a customer reports this specific 403,
treat it as a known issue and escalate; don't tell them it's their
configuration.

---

## 4. Page access toggles

- **Reports (`reports`):** ON = access to ALL reports (tech efficiency, SA
  analysis, requested parts, vendor expenses, WO statuses, inventory, WIP,
  AR/AP aging, etc.). **All-or-nothing — no per-report control.** AR/AP aging
  reports follow THIS toggle, not Manage AP/AR.
- **Customer Portal (`customerPortal`):** ON = access/manage the
  customer-facing portal configuration.
- **Billing Portal (`billingPortal`):** ON = access/manage the billing
  portal.
- **Parts Department (`partsDepartment`):** PARENT GATE for Part Sales,
  Catalog and Inventory, and Vendor and Order Management. OFF = all three are
  inaccessible regardless of their CRUD settings and the Parts nav section is
  hidden; their CRUD settings are preserved and restored when turned back ON.
  In the role editor, OFF hides the three child areas (slide transition).

---

## 5. Settings access

Parent toggle (`settings`) gates the whole Administration area (OFF = nav
item hidden, all sub-settings inaccessible and hidden in the role editor).
When ON, seven independent sub-toggles:

| Sub-setting | Controls |
| --- | --- |
| App Settings | Org name, business info, locale, branding; **Roles and Permissions management**; Staff/Workplaces; Departments |
| Service | Labor types, canned lines, asset types, Digital Inspections templates |
| Parts | Pricing matrices, categories, parts config |
| Integrations | QuickBooks, IBS, Open API |
| Finance | Tax configuration, payment settings, payment methods |
| Data Import | Bulk import of customers, vehicles, parts, etc. |
| View/Manage Wages | Employee wage rates (sensitive — typically Admin/SM/Office) |

Note: managing roles themselves requires Settings ON + App Settings ON.

---

## 6. View Mode (Tech View vs Full View)

Controls **UI complexity of the work order interface only**. It does NOT
control data access — CRUD permissions and cross-cutting toggles do that. It
is a UX simplification, **not a security boundary**.

- **Full View:** complete WO interface; all workflow actions (approve,
  review, split…) subject to permissions — except Review, which is always
  controlled by the "Review Work Orders" setting; has the Send to Portal
  button; Estimate column shows the actual estimate.
- **Tech View restrictions:**
  - Estimate column shows **Tech Time** instead of the estimate value
  - Tech time input field hidden on WO lines
  - Cannot approve work orders or WO lines (buttons hidden)
  - **Cannot Send to Portal** (button not visible)
  - Labor rate columns/fields hidden on WO lines
  - Simplified parts request form (subset of fields)
  - Can only CREATE new WO lines; existing lines are read-only
  - A line is editable only while authorization is pending; once approved it
    becomes read-only for that user
- **Time Clock role has NO view mode** (neither Full nor Tech — the setting
  is empty for it).
- Send to Portal: requires Full View; available to anyone who can approve a
  WO line.

---

## 7. Cross-cutting toggles

### 7a. See Financial Data (`seeFinancialData`)

ON = pricing, costs, margins, and financial columns visible throughout the
app (labor rates on lines, parts pricing, total/labor/parts columns, cost and
margin on parts, financial summaries).
OFF = ALL financial data hidden on every page — dollar amounts, rates, costs,
margins, totals. The user can still perform their permitted CRUD actions;
they just can't see pricing.

- Applies to the **core app only** — it does NOT apply to Customer Portal,
  Billing Portal, or Settings pages.
- **Creating an inventory item without See Financial Data:** the Cost field
  is hidden on the form; the user can still save; the system stamps Cost,
  Sell Price, and Core Charge with 0. (With the toggle ON, Cost is required.)
- **Gates these settings** (they can't be on while it's off): Invoicing &
  Payments (full CRUD), Part Sales (full CRUD), Order Parts (WO sub-setting),
  Manage AP/AR.
- **Turning it OFF while gated settings are on:** the user is prompted with
  the list of settings that must be disabled.
- Design intent: one toggle, all-or-nothing app-wide (legacy visibility was
  inconsistent per role).

### 7b. Manage Accounts Payable and Receivable (`seeApArData`)

Requires See Financial Data ON (prompt appears if not).

ON = sees **Unpaid Invoices, Payments, and Credits tabs** on Customer AND
Vendor detail pages; can make bulk payments from Unpaid Invoices; sees
sensitive customer fields and sensitive vendor fields.
OFF = those tabs hidden on both pages; sensitive fields hidden. The user can
still create invoices / process payments if they have Invoicing permissions —
they just can't see the consolidated AP/AR views.

**Sensitive customer fields hidden when OFF** (Edit Customer modal + Customer
Overview panel): Credit Terms, Credit Limit, Default Labor Rate, Default Shop
Supplies, Min and Max, Taxes, PO is Required.
**Sensitive vendor fields hidden when OFF** (Edit Vendor modal + Vendor
Overview card): Credit Terms, Credit Limit, Taxes.

- Independent from See Financial Data in the other direction: a role can see
  pricing everywhere (Financial ON) but not AP/AR tabs (AP/AR OFF) — e.g.
  Service Advisor.
- Does NOT gate any CRUD area.
- Does NOT gate AR/AP aging reports anymore — those follow Reports.

---

## 8. Admin pages behavior

### Roles and Permissions list (Administration > Roles and Permissions)

Table of all roles with: Role Name (System badge for system roles), Type
(System/Custom), Template (custom roles show which system role they started
from), Description, **Users Assigned count**, Actions (Edit / Delete / View
Permissions). "Create Custom Role" button starts the creation flow.

### Create / Edit custom role flow

1. **Template selection** (create only) — pick a system role; all settings
   pre-fill; template choice is saved.
2. **Role details** — Name (required, must be unique), Description
   (optional).
3. **Permission editor** — all groups above, with live dependency
   enforcement: CRUD cascade auto-checks/unchecks; Parts Department OFF hides
   its three child areas; Settings OFF hides its sub-settings; See Financial
   Data OFF disables Part Sales and Invoicing with an explanatory note; WO
   sub-settings grey out when WO View is OFF.
4. **Save** — validates and saves.

### Financial Data confirmation modal

Trigger: enabling any Invoicing or Part Sales CRUD checkbox, or Order Parts,
while See Financial Data is OFF. Text: "[Area] requires 'See Financial Data'
to be enabled. Enable it?" Confirm = auto-enables See Financial Data and
applies the change; Cancel = reverts the checkbox.

### Deleting a role

- 0 users assigned → confirm and delete.
- 1+ users assigned → "Cannot Delete" modal: "This role is assigned to N
  user(s). Reassign them to another role before deleting." The confirm button
  is DISABLED until all users are reassigned.
- System roles can never be deleted.

### Permission Summary (read-only)

Compact ON/OFF view of a role's full permission set. Reached via "View
Permissions" on the roles list and next to the role selector on the Staff
page. It's the only way to inspect Office and Time Clock (which aren't
editable).

### Staff page

Role selector groups **System Roles** and **Custom Roles**. "View
Permissions" button beside the selector shows the summary before assigning.
**Changing a user's role forces that user to log out; the new role takes
effect when they log back in.**

---

## 9. The 12 system roles

| Role | ID | Purpose |
| --- | --- | --- |
| Admin | `system-admin` | Full system access (cannot be edited to lose Admin-page access) |
| Service Manager | `system-sm` | Full operational access; limited admin (App Settings + Wages) |
| Senior Service Advisor | `system-ssa` | WO + customer management, expanded access |
| Service Advisor | `system-jsa` | WO + customer management with invoicing; no AP/AR |
| Foreman | `system-foreman` | Oversees technicians and work orders |
| Technician | `system-tech` | Assigned work, time tracking, Tech View |
| Parts Manager | `system-pm` | Full parts and inventory control |
| Parts Tech | `system-pt` | Parts operations and vendor management |
| Office | `system-office` | Back-office operations and reporting (NOT editable) |
| Sales Representative | `system-salesrep` | Work Orders + Customers + Part Sales (view), plus Reports and financial visibility. NOT "Reports only" — see §14 (SV-8061). |
| Time Clock | `system-timeclock` | Clock in/out only (NOT editable; no view mode) |

### Default matrix highlights (V = View, E = Create+Edit, D = Delete)

CRUD areas:

| Area | Svc Mgr | Sr. SA | Svc Advisor | Foreman | Tech | Parts Mgr | Parts Tech | Office | Sales Rep | Time Clock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Work Orders | V/E/D | V/E/D | V/E | V/E | V | V/E | V | V | V | V |
| WO Lines | V/E/D | V/E/D | V/E/D | V/E/D | V/E | V/E | V | V | V | — |
| Schedule | V/E/D | V/E/D | V/E/D | V/E/D | V | V | V | V | — | V |
| Customers | V/E/D | V/E | V/E | V/E | V | V/E/D | V/E | V/E/D | V/E | — |
| Part Sales | V/E/D | V/E/D | V/E | V | — | V/E/D | V/E | V | V | — |
| Catalog & Inv | V/E/D | V/E | V/E | V/E | — | V/E/D | V/E | V | — | — |
| Vendor & Order | V/E/D | V/E/D | V/E | V/E | — | V/E/D | V/E/D | V | — | — |
| Invoicing | V/E | V/E/D | V/E/D | V/E | — | V/E/D | V/E | V | — | — |
| Timesheets | V/E | V/E | V | V | — | — | V | V/E | — | V |

(Admin has full access everywhere; Timesheets Admin = V/E. WO Lines View
always inherits from Work Orders View.)

Toggles:

| Toggle | Admin | Svc Mgr | Sr. SA | Svc Advisor | Foreman | Tech | Parts Mgr | Parts Tech | Office | Sales Rep | Time Clock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Reports | ON | ON | ON | — | — | — | ON | — | ON | ON | — |
| Customer Portal | ON | ON | ON | ON | — | — | ON | — | — | — | — |
| Parts Dept | ON | ON | ON | ON | ON | — | ON | ON | ON | ON | — |
| Billing Portal | ON | ON | — | — | — | — | — | — | ON | — | — |
| Settings | ON | ON | — | — | — | — | ON | — | ON | — | — |
| Review WOs | ON | ON | ON | ON | ON | — | ON | — | — | — | — |
| Pick Parts | ON | ON | ON | ON | ON | ON | ON | ON | — | — | — |
| Order Parts | ON | ON | ON | ON | ON | — | ON | ON | — | — | — |
| View Mode | Full | Full | Full | Full | Full | **Tech** | Full | Full | Full | Full | (none) |
| See Financial | ON | ON | ON | ON | ON | — | ON | ON | ON | ON | — |
| Manage AP/AR | ON | ON | ON | — | — | — | ON | — | ON | ON | — |
| Part History | ON | ON | ON | ON | ON | — | ON | ON | ON | — | — |

Settings sub-toggles (roles with Settings ON):

| Sub-setting | Admin | Svc Mgr | Parts Mgr | Office |
| --- | --- | --- | --- | --- |
| App Settings | ON | ON | — | ON |
| Service | ON | — | — | ON |
| Parts | ON | — | ON | — |
| Integrations | ON | — | — | ON |
| Finance | ON | — | ON | ON |
| Data Import | ON | — | ON | ON |
| Wages | ON | ON | — | ON |

### Special hard-coded rule: Office cannot create invoices

Office users can make payments but NOT create invoices. The Create Invoice
button is disabled for Office users on Work Orders and Part Sales — this
hard-coded rule overrides whatever the Invoicing CRUD says.

---

## 10. Migration from legacy roles (support hotspot)

Every existing user is mapped from the old 15 roles to the new 12:

| Legacy role | New role | Note |
| --- | --- | --- |
| Owner | Admin | Owner role is retired — merged into Admin |
| Administrator | Admin | Direct |
| Service Manager | Service Manager | With adjustments |
| Service Advisor | Senior Service Advisor | Renamed + expanded |
| SA Technician | Senior Service Advisor | Consolidated (tech schedule/clock-in now via staff record) |
| SA No Reports | Senior Service Advisor | Consolidated — GAINS Reports |
| SA Limited View | Service Advisor | AP/AR OFF preserves the old restriction |
| Foreman | Foreman | With expansions |
| Technician | Technician | Direct |
| Parts Manager | Parts Manager | With adjustments |
| Parts Technician | Parts Tech | With expansions |
| Sales Representative | Sales Representative | Direct |
| Reporting | Sales Representative | Consolidated |
| Office | Office | With adjustments |
| Time Clock | Time Clock | Direct |

### Capability changes users will notice after migration

| Role | Change |
| --- | --- |
| Senior SA (was Service Advisor / SA Technician / SA No Reports) | GAINS: WO/WOL/Schedule/Part-Sales Delete, full Vendor access, full Invoicing, Timesheets edit, Customer Portal, AP/AR, Reports |
| Service Manager | LOSES: Invoicing Delete; Settings sections Service/Parts/Finance/Data Import. GAINS: Billing Portal, Customer Portal |
| Foreman | GAINS: WOL Delete, Schedule Delete, Parts Dept (Part Sales V; Catalog V/E; Vendor V/E), Invoicing V/E, Order Parts, Part History. LOSES: Timesheets Edit |
| Technician | GAINS: Pick Parts. LOSES: Send to Portal |
| Parts Manager | LOSES: WO/WOL Delete. GAINS: Schedule View, Customer Portal |
| Parts Tech | GAINS: Pick Parts, Order Parts, Invoicing V/E, Part History |
| Office | Catalog reduced to View only. Customer Management expanded to full (gains Delete) |
| SA Limited View → Service Advisor | Restructured; AP/AR OFF preserves the core restriction. Gains Customer Portal |

Shops are notified of these changes. If a shop wants the OLD behavior back,
the fix is a **custom role**: start from the nearest template and toggle the
specific settings.

### Two things that are STAFF RECORD settings, not permissions

- **Appearing on the technician schedule/dispatch board** — controlled by
  the staff member's DEPARTMENT (any user in a schedule-visible department
  appears, regardless of role).
- **Clocking into work order line tasks** — controlled by the "Time Clock"
  setting on the staff record (separate from attendance clock in/out, which
  everyone always has).

---

## 11. Digital Inspections (no separate permission)

Inspection abilities derive from existing permissions:

- Add an inspection to a WO line / fill it in → WO Lines: Create and Edit
- Delete an INCOMPLETE inspection → WO Lines: Create and Edit
- Delete a COMPLETE inspection, or REOPEN a completed inspection → WO Lines:
  Delete
- Create/author inspection templates → Settings ON + Service sub-setting ON

---

## 12. Quick "who can do X" reference

| Action | Requirement |
| --- | --- |
| Clock in / out (attendance) | Everyone, always |
| See "My Timesheets" | Everyone who can clock in/out |
| Mark core Ok / Not Ok | Work Orders: View |
| Return a part from a WO line | No permission gate (needs WO View to see it) |
| Create a note, or edit ANYONE's note (WO / Customer / Asset tab) | View on the governing area (WO notes → Work Orders; Customer + Asset notes → Customer) |
| Delete your OWN note | View on the governing area (everyone can manage own) |
| Delete someone else's note | Delete on the governing area |
| See/edit the Notes FIELD on Edit Customer/Asset/WO modal | View to see it; Create and Edit to change it (governing area) |
| Notifications (reminders/notes by profile menu) | Everyone — no permission |
| Reports > Notes page | Reports toggle ON |
| See WO/line audit logs | Work Orders: Create and Edit |
| See line story history | WO View (line story requires WOL view, which follows WO View) |
| Reverse an invoice (WO or Part Sale) | Work Orders: Delete / Part Sales: Delete (+ validation, e.g. no payments) |
| Delete a payment | Invoicing: Delete (which also needs Manage AP/AR) |
| Delete a part-sale return | Invoicing: Delete |
| Collect deposits / Send to Terminal | Invoicing: Create and Edit (terminal also needs Customer Portal ON) |
| Send to Portal | Full View + able to approve a WO line |
| Review a work order | "Review Work Orders" sub-setting (wins over view mode) |
| See the WO Parts tab / order parts / receive deliveries on a WO | "Order Parts" sub-setting (needs See Financial Data) |
| Manage roles, staff, departments | Settings ON + App Settings ON |
| See AR/AP aging reports | Reports ON (NOT Manage AP/AR) |
| Restock / return items to inventory | Catalog and Inventory: Create and Edit |

---

## 13. Known open items (escalate, don't answer)

- **Reset to Template** — requirements not yet defined in the spec. Escalate
  any question about resetting a role to its original template.
- **Rename "Role" to "Profile"** — a future consideration only; not decided,
  not in this release.

---

## 14. Behaviors confirmed through defect testing (Epic SV-7388)

These are product-behavior truths established or confirmed while fixing defects
during the release. They are things a customer might ask about because the
behavior looks surprising but is intended. (Pure internal bugs — blank pages,
server errors, cosmetic glitches — were fixed and are not listed; if a customer
still hits one of those, treat it as a regression and escalate.)

**Sales Rep is not "Reports only" (SV-8061, verified on staging).**
The Sales Representative role includes Work Orders: View, WO Lines: View
(inherited), Customers: View + Create & Edit, and Part Sales: View (Parts
Department ON), plus Reports, See Financial Data, See AP/AR, and Full View —
everything else off. An earlier build showed Sales Rep with Reports only; that
was a bug. Migrated Sales Reps keep their Customers and Work Orders access.

**Technicians see ALL work orders for their location, not just their own
(SV-7942, verified).** Tech View does not filter which work orders a user can
see. The "My Work Orders" toggle is an optional filter that narrows the list to
work orders where the user is the header technician, the service advisor, or is
assigned to a task or a line. So "My Work Orders" is a convenience filter, not a
permission limit — turning it off shows the full location list.

**Everyone with Work Orders: View can create notes (SV-8018).** A view-only
work-order role can add notes; it was a bug that "Add note" was blocked. (See
§3k for the full Notes model from SV-8003.)

**"Add Customer" inside the New Work Order flow needs Customer Management:
Create & Edit (SV-8002).** A user can build a work order and pick an existing
customer with only the work-order permissions, but adding a brand-new customer
mid-flow requires Customer Create & Edit.

**A Customer-only view role still sees the Work Orders / Part Sales tabs on a
customer's profile, as references (SV-8050).** With Work Orders and Parts off,
those tabs still appear on the customer record but the individual WO/PS entries
are not clickable — the user sees that they exist but can't open them. This is
intended (matches the spec's Q10 ruling).

**Financial data must stay hidden when "See Financial Data" is off, everywhere
— including parts receiving and vendor screens (SV-7973, SV-7977-area,
SV-8077/8079).** Costs, totals, core charges, and the cost columns on Receive
Part / Vendor Invoices / Returns must not show (or be editable) for a role
without See Financial Data. If a customer reports seeing or editing prices with
that toggle off, that's a serious issue — escalate.

**Send to Portal / Send to Terminal gating (SV-7799/7801/7902).** Send to
Portal needs Full View and the ability to approve a work-order line. Send to
Terminal needs Invoicing & Payments: Create & Edit AND Customer Portal ON.
(Also in §3i / §6.)

**Digital Inspections gating confirmed (SV-8020/8044/8045).** Reopening or
deleting a COMPLETED inspection requires Work Order Lines: Delete; filling in /
submitting an inspection requires Work Order Lines: Create & Edit (it is
read-only without it). Matches §11.

**Time Clock role is truly restricted (SV-7958).** A Time Clock user cannot
reach other areas of the app; they clock in/out only.

**"My Timesheets" is available to lower-level users including Technicians
(SV-7980).** Anyone who can clock in/out can see My Timesheets, regardless of
the Timesheets permission. (Also in §3j.)

> Coverage note: this section is distilled from the resolved Bug tickets under
> Epic SV-7388. The majority of those tickets were internal implementation
> fixes with no lasting customer-facing rule; only the behavior-defining ones
> are captured here. If Product resolves further defects with new behavior
> rulings, add them here.
