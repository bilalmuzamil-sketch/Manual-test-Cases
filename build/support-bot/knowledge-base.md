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

- **11 system roles** ship as sensible defaults (Admin, Service Manager,
  Senior Service Advisor, Service Advisor, Foreman, Technician, Parts Manager,
  Parts Tech, Office, Sales Representative, Time Clock). (The spec sometimes says
  "12" — that's a stale count from before the old Owner role was merged into
  Admin; see §14.1.)
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

- **System roles** — 11 built-in templates. They CAN be edited (a shop can
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
  contacts and vehicles. Sensitive fields are hidden unless "Manage AP/AR" is on
  (see §7b). Note: creating a customer *inside the New Work Order flow* does NOT
  require this — Work Orders: Create & Edit covers it (see §14.3).
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

## 9. The 11 system roles

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
| Office | `system-office` | Back-office operations, reporting, customer & invoicing/payments admin (NOT editable). Current spec: Work Orders View, Part Sales View, full Invoicing CRUD (Create-Invoice button still hard-disabled), Customers full; WO Lines OFF. See §14.1. |
| Sales Representative | `system-salesrep` | Work Orders + Customers + Part Sales (view), plus Reports and financial visibility. NOT "Reports only" — see §14 (SV-8061). |
| Time Clock | `system-timeclock` | Clock in/out only (NOT editable; no view mode) |

### Default matrix highlights (V = View, E = Create+Edit, D = Delete)

CRUD areas:

| Area | Svc Mgr | Sr. SA | Svc Advisor | Foreman | Tech | Parts Mgr | Parts Tech | Office | Sales Rep | Time Clock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Work Orders | V/E/D | V/E/D | V/E | V/E | V | V/E | V | V | V | V |
| WO Lines | V/E/D | V/E/D | V/E/D | V/E/D | V/E | V/E | V | —† | V | — |
| Schedule | V/E/D | V/E/D | V/E/D | V/E/D | V | V | V | V | — | V |
| Customers | V/E/D | V/E | V/E | V/E | V | V/E/D | V/E | V/E/D | V/E | — |
| Part Sales | V/E/D | V/E/D | V/E | V | — | V/E/D | V/E | V | V | — |
| Catalog & Inv | V/E/D | V/E | V/E | V/E | — | V/E/D | V/E | V | — | — |
| Vendor & Order | V/E/D | V/E/D | V/E | V/E | — | V/E/D | V/E/D | V | — | — |
| Invoicing | V/E | V/E/D | V/E/D | V/E | — | V/E/D | V/E | V/E/D | — | — |
| Timesheets | V/E | V/E | V | V | — | — | V | V/E | — | V |

**† Office role — current state (spec as of 2026-07-15).** The Office
definition churned over a couple of days; the CURRENT spec is: Office has **Work
Orders = View**, **Part Sales = View**, **Invoicing & Payments = V/E/D (full)**,
Customers V/E/D, Catalog V, Vendor V, Schedule V, Timesheets V/E. Office's **WO
Lines is set to OFF** in the matrix even though it has Work Orders: View (WO
Lines normally inherits WO View — this is an explicit spec exception; flag it if
a customer's Office user unexpectedly can/can't see line-level items). Even with
full Invoicing CRUD, the hard-coded rule still **disables the Create-Invoice
button for Office** — Office can process/edit/delete payments but cannot create
new invoices. See §14.1.

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
| Office | Catalog reduced to View only. Customer Management expanded to full (gains Delete). **2026-07: gains full Invoicing & Payments CRUD (Create-Invoice button still disabled) and loses WO Lines access; keeps Work Orders View and Part Sales View.** |
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

Product-behavior truths established or confirmed while fixing defects during the
release — the "surprising but intended" things customers ask about. Distilled
from a full review of the resolved Bug and Story-Defect tickets under the epic
(276 tickets). Pure internal fixes (blank pages, server errors, cosmetic) are
not listed; if a customer still hits one, treat it as a regression and escalate.

### 14.1 Roles & templates

- **Sales Rep is NOT "Reports only" (SV-8061, verified).** Includes Work Orders:
  View, WO Lines: View, Customers: View + Create & Edit, Part Sales: View (Parts
  Department ON), plus Reports, See Financial Data, See AP/AR, Full View.
  Migrated Sales Reps keep Customers and Work Orders access.
- **Service Manager DOES have Work Orders: Delete (SV-8297, verified).** Its
  template and system role include WO View/Create&Edit/Delete.
- **There are 11 system roles, not 12 (SV-8119).** The spec's "12" is a stale
  count (the old Owner role was merged into Admin). The 11: Admin, Service
  Manager, Senior Service Advisor, Service Advisor, Foreman, Technician, Parts
  Manager, Parts Tech, Office, Sales Representative, Time Clock. There is **no
  "Junior Service Advisor"** (SV-7813) — only Service Advisor and Senior SA.
- **Standardized display names (SV-8178):** shown as "Time Clock User", "Parts
  Technician", "Office User" across the app.
- **Office role updated (spec Change Log 2026-07-14, matrix refined 2026-07-15).**
  The Office definition changed over two days; the CURRENT state is: Office keeps
  **Work Orders: View** and **Part Sales: View**, and gains **full Invoicing &
  Payments CRUD** (View/Create&Edit/Delete). It also keeps Customers (full),
  Catalog (view), Vendor (view), Schedule (view), Timesheets (view/edit),
  Reports, Settings (App/Service/Integrations/Finance/Data Import/Wages), See
  Financial Data, and Manage AP/AR. What Office **lost is WO Lines access** (set
  to OFF in the matrix, an explicit exception to the usual "WO Lines inherits WO
  View"). **The hard-coded rule still disables the Create-Invoice button for
  Office** — Office takes/edits/deletes payments but cannot create new invoices.
  (A brief interim spec had removed Office's Work Orders and Part Sales
  entirely; that was reverted — Office still has both at View.)
- **Service Advisor assignment eligibility (SV-8034):** only Admin, Service
  Manager, Senior SA, Service Advisor, or ANY custom role can be selected as the
  Service Advisor on a work order. Technician, Foreman, Office, Sales Rep, Parts
  roles, and Time Clock are excluded. The list is org-wide; already-assigned
  advisors stay shown even if their role later becomes ineligible.

### 14.2 Work Orders — view vs edit, notes, fields

- **WO View shows fields READ-ONLY, it doesn't hide them (SV-7931/8134/8137).**
  With Work Orders: View a user can SEE Mileage, Engine Hours, License Plate,
  the Service Advisor, etc.; editing any of them requires Work Orders: Create &
  Edit.
- **Technicians see ALL work orders for their location (SV-7942/7851).** Tech
  View does not filter which WOs are visible. "My Work Orders" is an optional
  filter (WOs where they're the lead tech, service advisor, or assigned to a
  task/line) — turning it off shows the full location list.
- **On-Site status toggle:** on the WO / dashboard it needs Work Orders: Create
  & Edit (SV-8021); from the Asset → WO-list "On-Site pin" surface it needs
  Customer: Create & Edit (SV-8030).
- **Notes:** see §3k. (Confirmed by SV-8003/8018/8135/8319.)

### 14.3 Creating a customer inside the New Work Order flow

**Correction — this is the opposite of an earlier reading.** Within the New Work
Order flow, a user with **Work Orders: Create & Edit** can add a brand-new
Customer, Contact, and Asset **even without Customer Management create/edit**
(Customer: View is enough alongside it). The Customer Management permission only
governs the Customers main-nav area, not what a WO-permitted user can do inside
a work order. The "Add Customer" button appearing there is intended
(SV-8118/8147/8156/8160/8190/8305, PO-ruling + verified).

### 14.4 Parts on a work order — who can do what

- **Request a part** on a line = Work Order Lines: Create & Edit (NOT Pick/Order
  Parts) (SV-7818/7848).
- **Pick** a part from inventory = Pick Parts (SV-7818).
- **Select a catalog/inventory part / edit part fields** on the Parts tab = Work
  Order Lines: Create & Edit (Pick Parts also allows selecting) (SV-8055).
- **Move a part** between lines or work orders = Work Order Lines: Create & Edit
  (Pick Parts alone is not enough) (SV-7861).
- **Change the quantity** of a part from the WO line = Work Order Lines: Create
  & Edit (Pick/Order Parts alone don't grant it) (SV-8136).
- **Order** a part / **receive** a delivery = Order Parts (needs Work Orders:
  View; receiving does not need WO Lines C&E) (SV-7820/7864). Order Parts also
  requires See Financial Data.
- **Mark a core OK / Not-OK** = Work Orders: View (everyone who can see the WO)
  (SV-8130/7874). *(This corrects any older note tying cores to WO Lines C&E.)*
- **Return a part** from a WO/line = no permission gate at all; the user just
  needs WO View to see the button (SV-8008/8035).
- The **Parts tab** on a WO is shown/hidden by the Order Parts sub-setting;
  pricing on it is hidden separately by See Financial Data (SV-8055).

### 14.5 Invoicing, payments, reversals, returns — the money actions

- **Invoicing & Payments needs an entry point:** it's only usable if the user
  also has Work Orders: View OR Part Sales: View (plus See Financial Data)
  (SV-8085).
- **Edit invoice financial fields** = Invoicing: Create & Edit + See Financial
  Data (SV-8086).
- **Reverse a WORK ORDER invoice** = Work Orders: Delete (SV-8088/8237).
- **Reverse a PART SALE invoice** = Part Sales: Delete (NOT Work Orders: Delete
  — the 6/28 change-log line saying WO Delete was wrong and was corrected)
  (SV-8237/8238).
- **Delete a payment** (customer or vendor) = Invoicing & Payments: Delete, and
  it depends on Manage AP/AR (the Payments tab that holds the action is hidden
  when AP/AR is off); enabling Invoicing Delete while AP/AR is off prompts to
  enable AP/AR (SV-8100/8167/8170/7913).
- **Delete a Part Sale** = Part Sales: Delete (type-aware; not WO Delete). A part
  sale with received parts can't be deleted until those parts are returned or
  reassigned (SV-8126/8127).
- **Delete a return:** from a Part Sale = Invoicing: Delete; from the Returns
  page = Vendor & Order Management: Delete (SV-7911/7813).
- If the invoice has a payment, the payment must be deleted first before the
  invoice can be reversed (SV-8237).

### 14.6 See Financial Data (SFD) — the money-visibility switch

- SFD OFF hides every cost/price/total across the **core app**, with three
  exemptions: **Settings pages, Customer Portal, and Billing Portal**
  (SV-8161/8211/8212/8213). Settings → Labor Rates, Canned Lines, and Pricing
  keep showing amounts by design.
- Confirmed screens where SFD OFF must hide money: Inventory list, Part History,
  Catalog part details, Deliveries / Vendor Invoices, Purchase Orders list &
  details, Returns/Credits, WO Audit Log invoice total, exported CSVs/PDFs, and
  even the ShopCoach "Revenue Opportunity ($)" chip (SV-8091/8094/8214/8216/
  8217/8220/8222/8223/8224/8253).
- The **Inventory page itself stays accessible** with SFD OFF (it's gated by
  Parts Department, not SFD) — only the money columns hide (SV-7957).
- The **Finance tab** on a WO/part sale is HIDDEN entirely (not blanked) when
  SFD is off (SV-7969).
- Creating an inventory part with SFD OFF: Cost/Sell Price/Core Charge fields
  are hidden, the user can still save, and the system stamps those three as 0
  (SV-8090/8318).
- **Not gated by SFD:** staff Salary (gated by Wages), and the sensitive
  customer/vendor financial fields (gated by Manage AP/AR) (SV-8161).
- **Editor prompts:** enabling ANY Part Sales or Invoicing checkbox — *including
  View* — while SFD is off triggers the "enable See Financial Data" prompt
  (SV-7967/7969); enabling Order Parts prompts the same (SV-8176); enabling
  Manage AP/AR prompts to enable SFD (SV-8210); turning SFD off while any
  dependent is on prompts to disable them (SV-8059).

### 14.7 Manage AP/AR — payment tabs & sensitive fields

- AP/AR OFF hides the **Unpaid Invoices / Payments / Deposits (Credits) tabs on
  BOTH customer and vendor** detail pages (SV-8100/8110/8007). Service Advisor
  ships with AP/AR OFF, so it intentionally doesn't see them.
- AP/AR also hides sensitive **customer** fields (Credit Terms, Credit Limit,
  Default Labor Rate, Shop Supplies, Min/Max, Taxes, PO Required) and sensitive
  **vendor** fields (Credit Terms, Credit Limit, Taxes) on the edit modals AND
  the detail/overview cards — not just the modal (SV-8104/8133/7925/7842).
- **AR/AP aging reports follow the Reports permission (all-or-nothing), NOT
  Manage AP/AR** (SV-8177/7996/8011/8230). Reports ON shows all six aging
  reports regardless of AP/AR.

### 14.8 Schedule, Send-to-Portal / Terminal, Reviews

- **Schedule:** viewing the page and reordering departments = Schedule: View;
  creating/assigning a work order or adding an event from a schedule block =
  Schedule: Create & Edit (SV-8023/8026/8027).
- **Send to Portal** = Full View + ability to approve a WO line — ONLY (not
  Customer Portal, Invoicing, or SFD); hidden in Tech View. Foreman qualifies
  with Full View (SV-7798/7816/7841).
- **Send to Terminal** = Invoicing: Create & Edit + Customer Portal ON; if
  Customer Portal is off the button is hidden and no portal token is issued
  (closes a leak where the user could land in the portal) (SV-8087).

### 14.9 Clock in/out & timesheets (staff-record, not role)

- **All clock in/out** — attendance AND clocking into WO line tasks — is
  governed by the **"Time Clock" toggle on the staff record**, not by any role
  permission (SV-8141/8022/7946). The Technician role has it ON and locked
  (SV-8205).
- **Clock in/out is universal (spec §1i):** no role/config may block it with a
  403 (SV-8069). The clock-in dialog lists only WOs where the user is assigned
  as line labor (SV-8165).
- **"My Timesheets"** is visible to anyone with Time Clock enabled on their staff
  record — not gated by the Timesheets permission or any role (SV-8097/8060/
  8149).

### 14.10 Access control & data scoping

- Turning a resource's View off truly blocks it — e.g. WO View OFF blocks
  `/workorders` even via a direct URL, and financial data can't be reached by
  URL manipulation (SV-7852/7965). It's real access control, not just a hidden
  menu.
- **Report links and global search respect permissions:** links to areas a role
  can't access render as plain non-clickable text (SV-7854/7855/7951), and
  search history only surfaces records the role can access (SV-7952).
- **Location scoping:** a user assigned to one location cannot see work orders or
  part sales created at a different location (SV-8028).
- A **customer-only view role** still sees the Work Orders / Part Sales tabs on a
  customer's profile, but the entries are non-clickable references (SV-8050) —
  intended, matches spec Q10.

### 14.11 Two items that are NOT fully settled — escalate if they come up

- **Tech View + See Financial Data ON, labor rates (SV-8107).** The spec says
  Tech View hides labor rates, but when See Financial Data is ON the WO-line
  Rate column showed anyway; the team leaned toward "Tech with SFD ON should see
  prices" but never issued a final ruling. If a customer questions whether a
  technician should see labor rates, treat it as unsettled and escalate.
- **Notes: can WO View edit OTHER people's notes? (SV-8135 vs SV-8003/8319).**
  The spec and the notes-specific tickets say View can edit anyone's note (see
  §3k), but one ticket's staging result behaved as "own notes only" and flagged
  an open reconciliation. The bot answers per the spec (View edits any note),
  but if a customer reports a View-only user being unable to edit someone else's
  note, treat it as this known-open item and escalate rather than calling it
  wrong.

> Coverage note: distilled from a full pass over the 276 resolved Bug +
> Story-Defect tickets under Epic SV-7388. Most were internal fixes with no
> lasting customer rule; the behavior-defining ones are captured above. Add new
> rulings here as Product resolves further defects.
