<!-- Exported from Confluence pageId 565116952 via Atlassian MCP on 2026-07-15; lastModified: about 11 hours ago -->

# Custom Roles and Permissions

> **Owner:** Sasha Grosman  
> **Epic:** [https://shopview.atlassian.net/browse/SV-7388](https://shopview.atlassian.net/browse/SV-7388)  
> **Figma:** <custom data-type="smartlink" data-id="id-0">https://www.figma.com/design/DR4gEODShYgJqkozs3mF5q/Working---ShopView-App?node-id=12284-6713&t=vPXKfkMuwNCoJHC7-1</custom>  

---

## Business Case

ShopView currently has 15 hardcoded roles with no admin UI for customization. Shops cannot tailor permissions to their specific workflows — a common workaround is granting Administrator access to users who only need one elevated capability, over-exposing sensitive data. Custom permissions is the most-requested feature across ShopView's customer base (800+ requests from 213+ companies).

This feature introduces a configurable permission system where shops can create custom roles by combining granular settings, while retaining system-defined role templates as sensible defaults.

---

## Research and References

* [ShopView User Role Definitions](https://shopview.atlassian.net/wiki/spaces/PM/pages/563838977) — Legacy role definitions
* [Legacy Role to New Settings Mapping Analysis](https://shopview.atlassian.net/wiki/spaces/PM/pages/565116931) — Gap analysis comparing legacy roles to new settings

---

## Scope

**In scope:**

* Roles & Permissions admin page (list, create, edit, delete custom roles)
* Staff page updates (role assignment with new system)
* Complete definition of every permission setting and what it controls
* 12 system role templates as starting points
* Migration plan from legacy 15 roles to new 12 system roles

**Out of scope (separate specs):**

* Audit log for permission changes
* Dashboard type assignment per role
* Data access scoping (e.g., view only my records)

---

## Concepts

### Roles

A **role** is a named collection of permission settings assigned to a user. Each user has exactly one role.

There are two types:

* **System roles** — 12 pre-defined role templates that ship with ShopView. They represent common shop positions (Owner, Admin, Service Manager, etc.). System roles can be edited, with exceptions: **Office** and **Time Clock** roles cannot be edited. System roles cannot be deleted.
* **Custom roles** — Created by admins. Start from a system role template, then customize any setting. Can be edited and deleted.

### Permission Settings

Every role is defined by the following groups of settings:

1. **CRUD Areas** — granular view/edit/delete access to functional areas

    1. Note: this does not control access to data. The users must have access to all data required to perform their functions within each functional areas.
    
2. **Page Access Toggles** — on/off access to entire app sections
3. **Settings Access** — on/off access to admin settings sub-sections
4. **Work Order Sub-Settings** — specific WO capabilities (review WOs, pick parts, order parts)
5. **View Mode** — UI complexity level (Tech View vs Full View)
6. **Cross-Cutting Toggles** — data visibility controls that span multiple pages

---

## Permission Settings: Complete Reference

### 1. CRUD Areas

Each CRUD area has up to three independent permission levels:

| Level | Label | What it means |
| --- | --- | --- |
| **View** | View | Can see records in this area. If OFF, the area is hidden entirely. |
| **Edit** | Create and Edit | Can create new records and modify existing ones. Requires View to be ON. |
| **Delete** | Delete | Can permanently remove records. Requires Edit to be ON. |

**Dependency rule:** Delete requires Edit, and Edit requires View. These cascade in both directions:

* **Enabling a higher level auto-enables the levels below it.** For example, enabling Edit auto-enables View. Enabling Delete auto-enables both Edit and View.
* **Disabling a lower level auto-disables the levels above it.** For example, disabling View auto-disables Edit and Delete. Disabling Edit auto-disables Delete.

This dependency rule applies uniformly to all CRUD areas listed below.

#### 1a. Work Orders

**Key:** `workOrders`  
**Label:** Work Orders  
**Description:** Manage work orders, the core operational records in ShopView.

| Permission | Label | Controls |
| --- | --- | --- |
| **View** | View | See work orders in the work order list and open work order detail pages. Users can also see the Notes tab, create notes, and edit any note (including notes created by others) so people can collaborate within a single note and can delete the notes they created. Users can mark cores Ok/Not Ok.  If OFF, the Work Orders top level nav item is hidden. |
| **Edit** | Create and Edit | Create new work orders. Edit work order fields (edit customer details and change customer, change asset, service advisor, lead technician, status, on site status of asset). Users can view the work order and work order line level audit logs. |
| **Delete** | Delete | Delete work orders, Reverse Invoices as long as validation criteria is met (e.g. no payments made). Delete any note, including notes created by other users. Note: this permission is not enough to delete payments. |

**Work Order sub-settings**

These appear under the Work Orders CRUD area in the role editor. They are **always visible** in the role editor UI. They become **disabled** (greyed out) when Work Orders View is OFF. They control specific capabilities within the work order workflow.

| Sub-setting | Key | Label | Controls |
| --- | --- | --- | --- |
| **Review Work Orders** | `woReviewWorkOrders` | Review Work Orders | Gives the user the ability to see and review the work order. Without this setting, users will not see the Review option on work orders. |
| **Pick Parts** | `woPickParts` | Pick Parts | Pick parts from inventory onto a work order line. |
| **Order Parts** | `woOrderParts` | Order Parts | Place purchase orders for parts needed on a work order. Creates a PO linked to the work order. Also controls receiving parts deliveries onto a work order. Controls visibility of the Parts tab on the work order.  **Financial Gate:**  Enabling Order Parts requires See Financial Data setting. If See Financial Data is OFF the user is prompted to enable See Financial Data.  |

All three are independent toggles. A user can have Pick Parts ON and Order Parts OFF (e.g., a Foreman who can grab parts from the shelf but cannot place purchase orders).

Returning a part from a WOL does not require a permission. In practice, the user will need WO view so they can see the point, but there is no logical gate for returning a part from a WO.

**Important:** These sub-settings only require Work Orders: **View** to be enabled. Users do NOT need Work Orders: Create and Edit to pick parts, order parts, or review work orders. Order Parts additionally requires See Financial Data.

#### 1b. Work Order Lines

**Key:** `workOrderLines`  
**Label:** Work Order Lines  
**Description:** Manage line items on work orders.  
**Parent:** Work Order Lines is a child of Work Orders. There is no independent View toggle — Work Order Lines are visible whenever Work Orders View is ON.

| Permission | Label | Controls |
| --- | --- | --- |
| **Edit** | Create and Edit | Add new lines, edit line details, move parts between lines, authorize lines, manage part requests on lines, add inspections to the work order lines, delete incomplete inspections from work order lines, edit mileage, edit engine hours, edit license plate, edit VIN. Mark a core OK or Not OK on a line. View a line’s story history. |
| **Delete** | Delete | Remove lines from work orders.  
Digital Inspections: Reopen inspections that are complete ([details here](https://shopview.atlassian.net/wiki/spaces/PM/pages/381386757/Digital+Inspections#Story-11%3A-Reopen-and-Edit-a-Completed-Inspection)). Delete complete inspections |

**Key:** `schedule`  
**Label:** Schedule  
**Description:** Manage the shop schedule and technician assignments.

| Permission | Label | Controls |
| --- | --- | --- |
| **View** | View | See the schedule/calendar page. View appointments and technician assignments. If OFF, the Schedule top level nav item is hidden. The schedule shows all technicians' appointments — there is no "own only" schedule filtering. The schedule is a shared resource that SAs/managers use to coordinate work across all techs. |
| **Edit** | Create and Edit | Create and modify appointments, assign technicians to time slots, drag-and-drop scheduling. |
| **Delete** | Delete | Remove appointments from the schedule. |

#### 1d. Customer Management

**Key:** `customers`  
**Label:** Customer Management  
**Description:** Manage customer records, contacts, and vehicles.

| Permission | Label | Controls |
| --- | --- | --- |
| **View** | View | See customer records, contacts, vehicles, and vehicle history. Allows viewing the Notes tab, creating notes, editing notes that anyone created, and deleting your own Notes. If OFF, the Customers top level nav item is hidden. |
| **Edit** | Create and Edit | Create new customers, edit customer information (including Notes field), manage contacts, manage vehicles. Note: sensitive fields on the Edit Customer modal are hidden unless "Manage Accounts Payable and Receivable" is enabled (see below).  |
| **Delete** | Delete | Delete customer records. Does NOT control deleting customer payments — that requires Invoicing: Delete. Allows deleting notes other people created. |

**Sensitive Customer Fields (gated by Manage Accounts Payable and Receivable):**

When **Manage AP/AR** is OFF, the following fields are hidden on the Edit Customer and the Customer Overview panel modal:

* Credit Terms
* Credit Limit
* Default Labor Rate
* Default Shop Supplies
* Min and Max
* Taxes
* PO is Required

This ensures users without AP/AR access cannot see or modify financially sensitive customer settings, even if they have Customer Management: Edit. The user can still create and edit basic customer info (name, address, contact info, etc.).

#### 1e. Part Sales

**Key:** `partSales`  
**Label:** Part Sales  
**Description:** Manage part sales, returns, and related transactions.  
**Parent gate:** Requires Parts Department toggle to be ON. When Parts Department is OFF, child areas are hidden in the role editor (slide transition).  
**Financial gate:** Requires See Financial Data to be ON (part sales inherently involve pricing). If See Financial Data is OFF and a user enables any Part Sales CRUD checkbox, a confirmation modal prompts them to enable See Financial Data (see Financial Data Confirmation Modal section below).

| Permission | Label | Controls |
| --- | --- | --- |
| **View** | View | View part sales records, part returns, and part-related transactions. |
| **Edit** | Create and Edit | Create part sales, create part returns, process part transactions. |
| **Delete** | Delete | Delete part sales and reverse part sales invoices. |

#### 1f. Catalog and Inventory

**Key:** `catalogInventory`  
**Label:** Catalog and Inventory  
**Description:** Manage the parts catalog and inventory levels.  
**Parent gate:** Requires Parts Department toggle to be ON. When Parts Department is OFF, child areas are hidden in the role editor (slide transition).

| Permission | Label | Controls |
| --- | --- | --- |
| **View** | View | Browse the parts catalog, view inventory levels and stock information, view parts history. |
| **Edit** | Create and Edit | Create and edit catalog entries, make inventory adjustments including returning items to inventory, manage stock levels (cycle counts). |
| **Delete** | Delete | Delete parts from the catalog. |

#### 1g. Vendor and Order Management

**Key:** `vendorOrderManagement`  
**Label:** Vendor and Order Management  
**Description:** Manage vendors, purchase orders, deliveries, and part returns.  
**Parent gate:** Requires Parts Department toggle to be ON. When Parts Department is OFF, child areas are hidden in the role editor (slide transition).

| Permission | Label | Controls |
| --- | --- | --- |
| **View** | View | View vendor records, purchase orders, deliveries, part history, and part return requests. |
| **Edit** | Create and Edit | Create and edit vendors, create and manage purchase orders, manage deliveries, create vendor invoices. Includes returning parts to vendors or inventory. |
| **Delete** | Delete | Delete vendors, delete purchase orders. |

#### 1h. View Part History

**Label:** View Part History  
**Description:** Controls visibility of part sale history.  
**Parent gate:** Requires Parts Department toggle to be ON. When Parts Department is OFF, child areas are hidden in the role editor (slide transition).

| State | Behavior |
| --- | --- |
| ON | User can view Part History on inventory page.  |
| OFF | Part History icon is hidden on inventory page. |

---

#### 1i. Invoicing

**Key:** `invoicingPayments`  
**Label:** Invoicing and Payments  
**Description:** Manage invoices and payments directly from work orders and part sales.  
**Financial gates:**

1. Requires See Financial Data to be ON. If See Financial Data is OFF and a user enables any Invoicing CRUD checkbox, a confirmation modal prompts them to enable See Financial Data (see Financial Data Confirmation Modal section below).
2. “Delete” additionally requires Manage Accounts Payable and Receivables (“Manage AP/AR”). If Manage AP/AR is OFF and a user enables Delete checkbox, a confirmation modal prompts them to enable Manage AP/AR.

‌

| Permission | Label | Controls |
| --- | --- | --- |
| **View** | View | View invoices directly from work orders, part sales, or Customers. They will also need access to Work Orders, Part Sales, or Customers to see those entry points.  If OFF (but See Financial Data is ON), users can still see pricing data on work orders but cannot access invoices.  
  
 |
| **Edit** | Create and Edit | Create invoices, process payments directly from work orders and part sales, manage invoice fields and collect deposits. Send to terminal:  To send to terminal use must have this and “Customer Portal: ON” enabled. |
| **Delete** | Delete | Delete payments (including customer payments), void transactions, deleting a Part Sale return. |

**Note:** Deleting customer payments specifically requires Invoicing: Delete — it is NOT controlled by Customer Management: Delete.

#### 1j. Timesheets

**Key:** `timesheets`  
**Label:** Timesheets  
**Description:** View and manage timesheets from work orders.

| Permission | Label | Controls |
| --- | --- | --- |
| **View** | View | View timesheets from work orders. If OFF, the Timesheets top level nav item is hidden. However, if the user has Reports ON they will still see the timesheet activities report.  All users can always clock in/out regardless of this setting. All users who can clock in / out can see “My Timesheets” regardless of this setting. |
| **Edit** | Create and Edit | Edit timesheet entries, adjust hours, manage attendance records for all staff. This includes editing from the work order and the timesheet activities report. |

**No Delete action** — Timesheets only has View and Create and Edit.

---

### 2. Page Access Toggles

Simple on/off toggles that control access to entire app sections. When OFF, the corresponding top level nav item is hidden.

#### 2a. Reports

**Key:** `reports`  
**Label:** Reports  
**Description:** Access all reports in ShopView.

| State | Behavior |
| --- | --- |
| ON | User can access the Reports page and view all available reports (tech efficiency, service advisor analysis, requested parts, vendor expenses, WO statuses, inventory, work-in-progress, etc.). |
| OFF | Reports top level nav item is hidden. User cannot access any reports. |

Note: Reports is all-or-nothing. There is no per-report granularity. AR/AP aging reports are part of Reports — a user with Reports ON sees all reports, including AR/AP aging, regardless of Manage AP/AR.

#### 2b. Customer Portal

**Key:** `customerPortal`  
**Label:** Customer Portal  
**Description:** Access and manage the customer-facing portal.

| State | Behavior |
| --- | --- |
| ON | User can access and manage the customer-facing portal configuration. |
| OFF | Customer Portal top level nav item is hidden. |

#### 2c. Billing Portal

**Key:** `billingPortal`  
**Label:** Billing Portal  
**Description:** Access and manage the billing portal.

| State | Behavior |
| --- | --- |
| ON | User can access and manage the billing portal. |
| OFF | Billing Portal top level nav item is hidden. |

#### 2d. Parts Department (Parent Gate)

**Key:** `partsDepartment`  
**Label:** Parts Department  
**Description:** Gate access to Part Sales, Catalog and Inventory, and Vendor and Order Management.

This is a **parent toggle** that gates access to three CRUD areas: Part Sales, Catalog and Inventory, and Vendor and Order Management.

| State | Behavior |
| --- | --- |
| ON | The three Parts child areas become available and are controlled by their individual CRUD permissions. Parts Department top level nav section is visible. |
| OFF | All three Parts child areas are inaccessible regardless of their individual CRUD settings. Parts Department top level nav section is hidden. |

When this toggle is turned OFF, any CRUD permissions set on the child areas are preserved but inactive. Turning it back ON restores the previous CRUD settings.

**Role editor behavior:** When Parts Department is OFF, the three child CRUD areas are **hidden** in the role editor settings page (slide transition), similar to the Settings parent toggle behavior.

---

### 3. Settings Access

**Key:** `settings`  
**Label:** Settings  
**Description:** Access the Administration/Settings area and its sub-sections.

A parent toggle with 6 sub-settings. The parent toggle gates access to the Settings/Administration area. Each sub-setting controls a specific settings section.

| State | Behavior |
| --- | --- |
| ON | User can access the Administration/Settings area. Which sub-sections they see depends on the sub-settings below. |
| OFF | Administration top level nav item is hidden. All sub-settings are inaccessible. |

**Role editor behavior:** When Settings is OFF, the six sub-settings are **hidden** in the role editor settings page (slide transition).

#### Sub-settings

When the Settings parent toggle is ON, each sub-setting independently controls a section:

| Sub-setting | Label | Controls |
| --- | --- | --- |
| **App Settings** | App Settings | General application configuration — organization name, business info, locale, branding. Also covers Roles and Permissions management (creating/editing/deleting custom roles), Staff/Workplaces management, and departments. |
| **Service** | Service | Service-related configuration — labor types, canned lines, asset types, Digital Inspections. |
| **Parts** | Parts | Parts settings — pricing matrices, categories, parts-specific configuration. |
| **Integrations** | Integrations | Integration Settings - Quickbooks, IBS, Open API |
| **Finance** | Finance | Financial settings — tax configuration, payment settings, payment methods. |
| **Data Import** | Data Import | Data import tools — bulk import of customers, vehicles, parts, and other records. |
| **View/Manage Wages** | View/Manage Wages | View and manage employee wage rates. This is sensitive data — typically limited to Admin, SM, or Office roles. |

Each sub-setting is independently togglable. A role can have Service ON but Finance OFF, for example.

---

### 4. View Mode

**Key:** `viewMode`  
**Label:** View Mode  
**Options:** `tech` | `full`

View Mode controls the **UI complexity** of the work order interface. It does NOT control data access — that is handled by the CRUD permissions and cross-cutting toggles above.

| Mode | Label | Behavior |
| --- | --- | --- |
| **Full View** | Full View | Complete work order interface with all fields visible and editable (subject to CRUD permissions). Full parts request form with all fields. All workflow actions available (approve, review, split, etc.) with one exception: “Review” is controlled by the Review Work Order” permission. Has access to “Send to Portal” button The Estimate column on work order lines shows the actual estimate value. |
| **Tech View** | Tech View | Simplified work order interface designed for technicians. See restriction table below. |

**Tech View restrictions (compared to Full View):**

| Restriction | Detail |
| --- | --- |
| Estimate column shows Tech Time | When viewing a work order, the column labeled "Estimate" shows the value from Tech Time, not the actual estimate value. |
| No tech time field | The tech time input field is hidden on work order lines. |
| No approve action | Cannot approve work orders (approve button hidden). |
| Cannot approve lines | Cannot approve work order lines (approve action hidden). |
| Cannot Send to Portal | The “Send to Portal” button is not visible and the user cannot take this action. |
| Cannot view labor rates | Labor rate columns and fields are hidden on work order lines. |
| Limited parts request | Parts request form shows a simplified subset of fields. |
| Cannot edit existing WO lines | Can only create new work order lines. Cannot edit existing work order lines — they are read-only. |
| WO lines read-only after approval | Can only edit a work order line while its authorization is pending — once a WOL has been approved, it becomes read-only for that user. |

View Mode is a **UX simplification, not a security boundary**. A user in Tech View with Edit permissions still has edit access — they just see a simpler interface. Financial column visibility is controlled separately by "See Financial Data."

---

### 5. Cross-Cutting Toggles

These toggles affect data visibility across multiple pages in the app. They operate independently of CRUD permissions.

#### 5a. See Financial Data

**Key:** `seeFinancialData`  
**Label:** See Financial Data  
**Description:** Controls visibility of all financial data across the application (with the exception of Customer Portal, Billing Portal, and the Setting pages).

| State | Behavior |
| --- | --- |
| ON | User can see pricing, costs, margins, and financial columns throughout the app. This includes: labor rates on work order lines, parts pricing, total/labor/parts columns on work orders, cost and margin data on parts, and financial summaries. Creating an Inventory Item: If a user has See Financial Data, the ‘Cost’ field is still required If user does not have See Financial Data: The ‘Cost’ field will be hidden from the Create Inventory Part form The user will be able to ‘Save’ (create) the Inventory Part The system will stamp the ‘Cost’, ‘Sell Price’, and ‘Core Charge’ field with the 0 These requirements apply to the core app. They do not apply to Customer Portal, Billing Portal, and Settings pages. |
| OFF | All financial data is hidden across every page. Dollar amounts, rates, costs, margins, and totals are not displayed. The user can still perform their CRUD actions, but they cannot see pricing information. These requirements apply to the core app. They do not apply to Customer Portal, Billing Portal, and Settings pages. |

**Dependencies:** When See Financial Data is On and then set to Off, if any of the settings that are gated by See Financial Data are on, the user will be prompted to turn them off. The prompt will list the settings that need to be disabled so the user knows the change to be made.

Current list include:

* Invoicing & Payments → full CRUD
* Part Sales → full CRUD
* Order Parts (Work Orders sub-setting)
* Manage AP/AR

‌

**Design note:** This is intentionally a single cross-cutting toggle that controls ALL financial data visibility app-wide. The legacy system had inconsistent financial data visibility per role. Our new system simplifies this: financial data is either visible everywhere or hidden everywhere.

#### 5b. Manage Accounts Payable and Receivable

**Key:** `seeApArData`  
**Label:** Manage Accounts Payable and Receivable  
**Description:** Controls visibility of accounts payable/receivable data, ability to modify contract terms.

**Financial gate:** Requires See Financial Data to be ON. If See Financial Data is OFF and a user enables any Manage AP/AR toggle, a confirmation modal prompts them to enable See Financial Data (see Financial Data Confirmation Modal section below).

| State | Behavior |
| --- | --- |
| ON | User can see accounts payable/receivable data: Unpaid Invoices tabs, Payments tabs, and Credits tabs on Customer and Vendor detail pagesand can make bulk payments from the Unpaid Invoices tab. Also controls visibility of sensitive customer fields on the Edit Customer modal (Credit Terms, Credit Limit, Default Labor Rate, Default Shop Supplies, Min and Max, Taxes, PO is Required). Also controls visibility of sensitive Vendor fields on the Edit Vendor modal and the Vendor → overview card (Credit Terms, Credit Limit, Taxes) |
| OFF | Unpaid Invoices tabs, Payments tabs, and Credits tabs are hidden on both Customer and Vendor detail pages.  Order Parts (Work Orders sub-setting) Order Parts (Work Orders sub-setting)Sensitive customer fields are hidden on the Edit Customer modal. Sensitive Vendor fields are hidden on the Edit Vendor modal and Vendor → Overview card. The user can still access other invoicing functions (creating invoices, processing payments) if they have Invoicing permissions — they just cannot see the consolidated AP/AR views and tabs. |

**Independent from See Financial Data:** A role can have `seeFinancialData: ON` (sees pricing everywhere) but `seeApArData: OFF` (cannot see AP/AR tabs). This allows roles like Service Advisor to see pricing on work orders while being restricted from customer payment history and aging data.

**Does NOT gate CRUD areas:** Unlike See Financial Data, this toggle does not have a `requiresToggle` dependency. No CRUD areas are blocked when this toggle is OFF.

## Admin Pages

### Roles and Permissions List Page

**Location:** Administration > Roles and Permissions

Displays a table of all roles (system + custom) with the following columns:

| Column | Description |
| --- | --- |
| Role Name | Name of the role. System roles show a "System" badge. |
| Type | System or Custom |
| Template | For custom roles: which system role was used as the starting template. For system roles: — |
| Description | Short description of the role's purpose |
| Users Assigned | Count of users currently assigned to this role |
| Actions | Edit, Delete, View Permissions |

**Behaviors:**

* Most system roles can be edited. Exceptions: **Office** and **Time Clock** cannot be edited — clicking them opens a read-only permission summary.
* System roles cannot be deleted.
* Custom roles can be edited or deleted (subject to user assignment rules — see Delete Role below).
* A "Create Custom Role" button opens the role creation flow.
* A "View Permissions" action button opens the read-only Permission Summary dialog for any role.

### Create / Edit Custom Role

**Flow:**

1. **Template Selection** (create only) — Pick a system role template as the starting point. All settings are pre-filled from the template. The template choice is saved with the role for reference.
2. **Role Details** — Name (required, unique) and Description (optional).
3. **Permission Editor** — A form with all settings grouped into the sections defined above:

    * CRUD Areas grid (checkboxes for View / Edit / Delete per area)
    * Work Order sub-settings (Review Work Orders, Pick Parts, Order Parts toggles)
    * Parts Department parent toggle + child areas
    * Invoicing (with financial data dependency note)
    * Timesheets
    * Page Access Toggles (Reports, Customer Portal, Billing Portal)
    * Settings parent toggle + sub-setting toggles
    * View Mode selector (Tech / Full radio)
    * Cross-Cutting Toggles (See Financial Data, See AP/AR Data)
    
4. **Save** — Validates and saves the custom role.

**Dependency enforcement in the editor:**

* CRUD cascade: Enabling Edit auto-checks View. Enabling Delete auto-checks Edit and View. Disabling View auto-unchecks Edit and Delete. Disabling Edit auto-unchecks Delete.
* Turning off Parts Department **hides** (slide transition) all three child CRUD areas. Turning it back on reveals them with their previous settings preserved.
* Turning off See Financial Data disables Part Sales and Invoicing, showing a note explaining why.
* Turning off Settings parent toggle **hides** (slide transition) all 6 sub-settings.
* Work Order sub-settings are always visible. They become disabled (greyed out) when Work Orders View is OFF.

### Financial Data Confirmation Modal

When a user enables any Invoicing or Part Sales CRUD checkbox while See Financial Data is OFF, a confirmation modal appears:

* **Trigger:** User enables any Invoicing or Part Sales CRUD checkbox (View, Edit, or Delete), or the Order Parts sub-setting, while See Financial Data is OFF.
* **Modal text:** "\[Area\] requires 'See Financial Data' to be enabled. Enable it?"
* **Confirm:** Auto-enables See Financial Data and applies the checkbox change.
* **Cancel:** Reverts the checkbox to its previous state.

This prevents accidental configuration errors where financial areas are enabled without the necessary financial data visibility.

### Delete Role

Deleting a role requires checking user assignments:

* If **0 users** are assigned: confirm and delete.
* If **1+ users** are assigned: a **"Cannot Delete"** modal appears with the message: "This role is assigned to N user(s). Reassign them to another role before deleting." The delete/confirm button is **disabled** — the admin cannot proceed until all users are reassigned to a different role.

A system role cannot be deleted.

### Permission Summary (Read-Only)

A read-only view of a role's complete permission set, used for:

* Viewing system role definitions (especially Office and Time Clock which are not editable)
* Quick reference when comparing roles
* Confirmation during role assignment on the Staff page

Displays all settings in a compact, scannable format showing which permissions are ON/OFF. Accessible via the "View Permissions" action button on the Roles list page and next to the role selector on the Staff page.

---

## Staff Page Updates

**Location:** Administration > Staff

When assigning or changing a user's role:

* The role selector dropdown shows roles grouped into two sections:

    * **System Roles** — the 12 built-in templates
    * **Custom Roles** — any roles created by the shop admin
    
* A "View Permissions" button next to the selector opens the read-only Permission Summary for the selected role, so the admin can verify what the role grants before assigning it.
* Changing a user's role triggers a forced logout for the affected user. The new role takes effect when they log back in.

---

## System Role Templates

The following 12 system roles ship with ShopView. They serve as both default assignments and templates for creating custom roles.

### Permission Matrix

**CRUD Areas** (V = View, E = Create and Edit, D = Delete, — = OFF)

| Area | Admin | Svc Mgr | Sr. SA | Svc Advisor | Foreman | Tech | Parts Mgr | Parts Tech | Office | Sales Rep | Time Clock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Work Orders | V/E/D | V/E/D | V/E/D | V/E | V/E | V | V/E | V | — | V | V |
| WO Lines | V/E/D | V/E/D | V/E/D | V/E/D | V/E/D | V/E | V/E | V | V | V | — |
| Schedule | V/E/D | V/E/D | V/E/D | V/E/D | V/E/D | V | V | V | V | — | V |
| Customers | V/E/D | V/E/D | V/E | V/E | V/E | V | V/E/D | V/E | V/E/D | V/E | — |
| Part Sales | V/E/D | V/E/D | V/E/D | V/E | V | — | V/E/D | V/E | — | V | — |
| Catalog and Inv | V/E/D | V/E/D | V/E | V/E | V/E | — | V/E/D | V/E | V | — | — |
| Vendor and Order | V/E/D | V/E/D | V/E/D | V/E | V/E | — | V/E/D | V/E/D | V | — | — |
| Invoicing | V/E/D  | V/E | V/E/D | V/E/D | V/E | — | V/E/D | V/E | V/E/D | — | — |
| Timesheets | V/E | V/E | V/E | V | V | — | — | V | V/E | — | V |

**Note:** WO Lines View is not independently configurable — it is inherited from Work Orders View.

**Toggles**

| Toggle | Admin | Svc Mgr | Sr. SA | Svc Advisor | Foreman | Tech | Parts Mgr | Parts Tech | Office | Sales Rep | Time Clock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Reports | ON | ON | ON | — | — | — | ON | — | ON | ON | — |
| Customer Portal | ON | ON | ON | ON | — | — | ON | — | — | — | — |
| Parts Dept | ON | ON | ON | ON | ON | — | ON | ON | ON | — | — |
| Billing Portal | ON | ON | — | — | — | — | — | — | ON | — | — |
| Settings | ON | ON | — | — | — | — | ON | — | ON | — | — |

**Settings Sub-Toggles** (only for roles with Settings ON)

| Sub-setting | Admin | Svc Mgr | Parts Mgr | Office |
| --- | --- | --- | --- | --- |
| App Settings | ON | ON | — | ON |
| Service | ON | — | — | ON |
| Parts | ON | — | ON | — |
| Integrations | ON | — | — | ON |
| Finance | ON | — | ON | ON |
| Data Import | ON | — | ON | ON |
| Wages | ON | ON | — | ON |

**WO Sub-Settings, View Mode, Cross-Cutting Toggles**

| Setting | Admin | Svc Mgr | Sr. SA | Svc Advisor | Foreman | Tech | Parts Mgr | Parts Tech | Office | Sales Rep | Time Clock |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Review WOs | ON | ON | ON | ON | ON | — | ON | — | — | — | — |
| Pick Parts | ON | ON | ON | ON | ON | ON | ON | ON | — | — | — |
| Order Parts | ON | ON | ON | ON | ON | — | ON | ON | — | — | — |
| View Mode | Full | Full | Full | Full | Full | Tech | Full | Full | Full | Full | — |
| See Financial | ON | ON | ON | ON | ON | — | ON | ON | ON | ON | — |
| See AP/AR | ON | ON | ON | — | — | — | ON | — | ON | ON | — |
| History Logs | ON | ON | ON | ON | ON | — | ON | ON | ON | — | — |

### Role Descriptions

| Role | ID | Description |
| --- | --- | --- |
| Admin | `system-admin` | Full system access |
| Service Manager | `system-sm` | Full operational access, limited admin (App Settings + Wages only) |
| Senior Service Advisor | `system-ssa` | Work order and customer management with expanded access |
| Service Advisor | `system-jsa` | Work order and customer management with invoicing access |
| Foreman | `system-foreman` | Oversees technicians and work orders |
| Technician | `system-tech` | Assigned work orders and time tracking (Tech View) |
| Parts Manager | `system-pm` | Full parts and inventory control |
| Parts Tech | `system-pt` | Parts operations and vendor management |
| Office | `system-office` | Office administration, reporting, and back-office operations |
| Sales Representative | `system-salesrep` | Reports and financial data access only |
| Time Clock | `system-timeclock` | Clock in/out only |

---

## Migration Plan

### Legacy Role to New System Role Mapping

| Legacy Role | New System Role | Migration Type |
| --- | --- | --- |
| Owner | `system-admin`  - Admin | Direct mapping |
| Administrator | `system-admin` - Admin | Direct mapping |
| Service Manager | `system-sm` - Service Manager | Direct (with adjustments) |
| Service Advisor | `system-ssa` - Senior SA | Renamed + expanded |
| SA Technician | `system-ssa`  - Senior SA | Consolidated — tech schedule/clock-in handled by staff record |
| SA No Reports | `system-ssa` - Senior SA | Consolidated — gains Reports |
| SA Limited View | `system-jsa` - Service Advisor | Mapped to new role — AP/AR OFF preserves restriction |
| Foreman | `system-foreman` - Foreman | Direct (with expansions) |
| Technician | `system-tech` - Technician | Direct mapping |
| Parts Manager | `system-pm` - Parts Manager | Direct (with adjustments) |
| Parts Technician | `system-pt` - Parts Technician | Direct (with expansions) |
| Sales Representative | `system-salesrep` - Sales Representative | Direct mapping |
| Reporting | `system-salesrep` - Sales Representative | Consolidated into Sales Rep (only 4 users) |
| Office | `system-office`- Office Staff | Direct (with adjustments) |
| Time Clock | `system-timeclock`Time Clock | Direct mapping |

### Behavior Changes for Migrating Users

The following changes represent capability expansions or reductions vs. legacy. Shops will be notified:

| Role | Change | Direction |
| --- | --- | --- |
| **Senior SA** | Gains WO/WOL/Schedule/PartSales Delete, Vendor FULL, Invoicing FULL, Timesheets CE, Customer Portal, AP/AR, Reports | Expansion |
| **Service Manager** | Loses Invoicing Delete (cannot reverse). Loses Settings: Service, Parts, Finance, Data Import. Gains Billing Portal, Customer Portal. | Mixed |
| **Foreman** | Gains WOL Delete, Schedule Delete, Parts Dept (Part Sales V, Catalog V/CE, Vendor V/CE), Invoicing V/CE, Order Parts, History Logs. Loses Timesheets Edit. | Expansion |
| **Technician** | Gains Pick Parts Lose Send to Portal | Expansion |
| **Parts Manager** | Loses WO/WOL Delete. Gains Schedule View, Customer Portal. | Mixed |
| **Parts Tech** | Gains Pick Parts, Order Parts, Invoicing V/CE, History Logs | Expansion |
| **Office** | Catalog reduced to V only. Customer Mgmt expanded to FULL (gains Delete). | Mixed |
| **SA No Reports to SSA** | Gains Reports, Customer Portal | Expansion |
| **SA Limited View to Svc Advisor** | Different permission set; AP/AR OFF preserves core restriction. Gains Customer Portal | Restructured |

### Staff Record Settings (Not Part of Permission Model)

Two capabilities that were previously role-based in legacy are actually controlled by staff record settings, NOT by the permission model:

* **Appears on technician schedule** — Controlled by assigning the staff member to a department that is visible on the schedule. Any user in a schedule-visible department appears on the dispatch board regardless of role.
* **Can clock into work order line tasks** — Controlled by the "Time Clock" setting on the staff record. Any user with Time Clock enabled can clock into WO line tasks regardless of role. This is separate from basic attendance clock in/out (which is available to all users).

### Office Users Cannot Create Invoices

Office users are expected to be able to make payments but not create invoices.

* A hard coded rule for Office users will disable the Create Invoice button on Work Orders and Part Sales
* This overrides the Invoicing & Payments CRUD

‌

---

## Future Consideration: Rebrand Role to Profile

> **Placeholder** — The team is considering renaming the concept of "Role" to "Profile" throughout the application, to better reflect the configurable nature of permission sets.
>
> Scope if approved: Rename all user-facing labels (Role to Profile, Roles to Profiles, Custom Role to Custom Profile, System Role to System Profile). Update page titles, navigation labels, button text, dialog titles, descriptions, and help text. Update Staff page Role column to Profile. Internal code identifiers (variable names, API fields, DB columns) are out of scope — cosmetic/label change only.

---

## Key Decisions

| Decision | Rationale |
| --- | --- |
| **System roles are editable (except Office and Time Clock)** | Shops can customize system role defaults for their specific needs. Office and Time Clock are minimal/special-purpose roles that are protected from modification. |
| **Custom roles start from a template** | Faster creation. Reduces errors from building permissions from scratch. Template is recorded for audit/reference. |
| **View Mode is UX, not security** | Tech View simplifies the interface for technicians but is not a permission boundary. CRUD settings are the security layer. |
| **Reports is all-or-nothing** | Per-report granularity adds significant complexity for marginal value. Most roles either need all reports or none. |
| **Parts Department is a parent gate** | Shops that don't use the parts module can turn off the entire section with one toggle, rather than individually disabling three CRUD areas. |
| **See Financial Data gates Part Sales and Invoicing** | These areas are inherently financial. It makes no sense to grant Part Sales access without pricing visibility. |
| **See Financial Data is a single toggle** | Controls ALL financial data visibility app-wide. Legacy had inconsistent per-role financial visibility. Single toggle is simpler and more predictable. |
| **See AP/AR Data is independent from See Financial Data** | A role can see pricing (seeFinancialData ON) but not AP/AR tabs (seeApArData OFF). Resolves legacy SA Limited View conflict. |
| **AP/AR Data controls sensitive customer fields** | When seeApArData is OFF, financially sensitive fields on the Edit Customer modal are hidden. |
| **Edit includes Create** | Separating Create and Edit adds UI complexity for a rare use case. We accept this approximation. |
| **No-access = top level nav item hidden** | When a user lacks permission for an area, the top level nav item is hidden rather than shown-but-disabled. |
| **Clock in/out is always available** | Every user can clock in and out regardless of Timesheets permissions. |
| **Customer delete is not payment delete** | Customer Management: Delete controls deleting customer records. Invoicing: Delete controls deleting/reversing payments. Intentionally separate. |
| **App Settings covers Roles, Staff** | All fall under the App Settings sub-toggle. No separate sub-toggles needed. |
| **Legacy Owner role become Admin** | We are merging the legacy Owner role into Admin role. The legacy role is currently hidden from the UI and very few users have it. |
| **WO sub-settings require View, not Edit** | Pick Parts, Order Parts, and Review Work Orders only require Work Orders: View. |
| **Tech schedule = staff record, not permission** | Whether a user appears on the technician schedule is controlled by department assignment on their staff record. |
| **Job clocking = staff record, not permission** | Whether a user can clock into WO line tasks is controlled by the Time Clock setting on their staff record. |
| **Role change = forced logout** | When a user's role is changed, they are forced to log out. The new role takes effect on their next login. |
| **Roles with assigned users cannot be deleted** | Prevents orphaning users. Admin must reassign all users to another role before deleting. |
| **Parent toggles hide children in role editor** | When Parts Department or Settings is OFF, their child settings are hidden (slide transition) rather than shown as disabled, for a cleaner UI. |
| **Data Access not addressed in this scope** | This feature is about controlling access to features, not to the underlying data. For example, if a user can create work order but does not have access to customers, they shoulld:  
1\. The user should be able to create a new WO, including selecting from the list of Customers to chooose who to make the WO for  
2\. The user will not see the Customers tab in the top nav |
| **Digital Inspections use existing atoms (no separate permission)** | Inspection actions derive from WO Lines CRUD (add/fill = Edit; remove/reopen = Delete) and template authoring from Settings › Service. Avoids a redundant permission area. See SV-8095. |
| **Office Users Cannot Create Invoices** | Office users are expected to be able to make payments but not create invoices. A hard coded rule for Office users will disable the Create Invoice button on Work Orders and Part Sales |
| Marking Cores OK/Not Ok | Discussed with Cody and agreed everyone should have access to this. Therefore gate is WO->View (which implies WOL-> View) |

---

## Open Questions

| # | Question | Context | Answer |
| --- | --- | --- | --- |
| 1 | How should dashboard type be assigned per role? | Legacy system has dashboard mapped to certain roles. It is currently behind a feature flag and only enabled for Foothills. | When we enable it, it should respect the “Reports” custom role and permission.  |
| 2 | Should Office users be able to create invoices? | Currently Invoicing is V only for Office. Open question whether Office should have Invoicing C and E. |  |
| 3 | Does Catalog and Inventory Edit include "return to inventory" (restocking)? | Restocking returned parts is an inventory adjustment. It may fall under Catalog and Inventory: Edit, or it may require a separate permission. Needs investigation. | Yes, it should include return to inventory. |
| 4 | Send to Terminal and Deposits, Clarify what permission they sit behind |  | These sit behind Invoice and Payments - Create and Edit |
| 5 | Verify we want the AP/AR metrics granularity, or is it OK to group those behaviors under “See financial data,” or “edit customer data,” or find another solution |  | Will keep so as not to churn key customer. Will rename “Manage Accounts Payable and Receivable.” |
| 6 | Which new roles get Customer Portal |  | Customer Portal: Service Advisor, Senior Service Advisor, Service Manager, Parts Manager. Send to Portal button: can be anyone who can approve a WOL |
| 7 | Owner role is editable. This could lead to issue where the last owner removes their admin ability which we want to prevent. Should Admin and Owner be editable roles? |  | We will drop Owner role. The legacy Owner role will merge into the new Admin role. |
| 8 | We need to migrate the DI permissions requirements into this epic.  |  | Done. Spec and change log updated. |
| 9 | Can Owner role be editable? |  | Owner role was removed; we only have admin role. Admin system role cannot be edited to lose access to the Admin pages. All other parts are editable. |
| 10 | What happens if user does not have WO or PS, but they do have Customer. On the Customer Detail page, do they see the related tabs? |  | Yes. They see related tabs, but the links to the WO or PS are not clickable so the user cannot access the WO or PS. They can only see the reference. |
| 11 | Requirements missing for Reset to Template |  |  |

# Change Log

| **Data** | **Reporter** | **Change** |
| --- | --- | --- |
| <custom data-type="date" data-id="id-1">5/29/2026</custom>  | <custom data-type="mention" data-id="id-2">@Sasha Grosman</custom>  | Removed “Data model” table. This was an AI hallucination. There was no intent to suggest technical implementation. RE data access vs feature access. Clarified in feature overview and key decisions that these permissions control feature access, not data access. Core requirements did not need updating. |
| <custom data-type="date" data-id="id-3">6/1/2026</custom>  | <custom data-type="mention" data-id="id-4">@Sasha Grosman</custom>  | Clarified Create/Edit customer also affect the ability to create a customer in the New WO flow |
| <custom data-type="date" data-id="id-5">6/2/2026</custom>  | <custom data-type="mention" data-id="id-6">@Sasha Grosman</custom>  | Clarified that edit catalog and inventory enables returning items to inventory Updated the label from Invoicing to Invoicing and Payments Clarified Deposits and Send to Terminal require create and edit for Invoicing and Payments |
| <custom data-type="date" data-id="id-7">6/9/2026</custom>  | <custom data-type="mention" data-id="id-8">@Sasha Grosman</custom>  | Clarified, Time Clock user does not have Full or View permission. Their “View Mode” permission is empty. Clarified, “Review Work Order” always controls the related ability and wins over Full View or Tech View. |
| <custom data-type="date" data-id="id-9">6/10/2026</custom>  | <custom data-type="mention" data-id="id-10">@Sasha Grosman</custom>  | Manage Accounts Payable and Receivable Modified the setting label Formerly, View and Manage AP / AR Now, Manage Accounts Payable and Receivable Modified the setting description Added requirement Send to Portal button is controlled by View Mode. User must have Full View Clarified which roles should have access to Customer Portal and updated the migration behavior changes table Changed requirement The legacy Owner role will merge into the new Admin role We will not have an Owner role |
| <custom data-type="date" data-id="id-11">6/19/2026</custom>  | <custom data-type="mention" data-id="id-12">@Sasha Grosman</custom>  | Service Manager now has Customer Portal set to On |
| <custom data-type="date" data-id="id-13">6/21/2026</custom>  | <custom data-type="mention" data-id="id-14">@Sasha Grosman</custom>  | Added Digital Inspection requirements (adding inspection to WOL, deleting inspections, reopening completed inspections, and creating templates) Removed reference to “bays” as that is not a concept we support |
| <custom data-type="date" data-id="id-15">6/22/2026</custom>  | <custom data-type="mention" data-id="id-16">@Sasha Grosman</custom>  | Replaced “vendor transaction history” with the intended “part history” |
| <custom data-type="date" data-id="id-17">6/24/2026</custom>  | <custom data-type="mention" data-id="id-18">@Sasha Grosman</custom>  | Updated Time Clock User definition |
| <custom data-type="date" data-id="id-19">6/25/2026</custom>  | <custom data-type="mention" data-id="id-20">@Sasha Grosman</custom>  | Clarified details about editing customer and asset information on WO based on WO and WOL settings (see <custom data-type="smartlink" data-id="id-21">https://shopview.atlassian.net/browse/SV-7938</custom> ) Removed redundancy: Work Order Sub Settings were described twice, got rid of the former section 4 which was dedicated to those settings. All requirements are now listed under Section 1 → Work Orders Pick Parts requirements were incorrect. They are updated per <custom data-type="smartlink" data-id="id-22">https://shopview.atlassian.net/browse/SV-7861</custom>  |
| <custom data-type="date" data-id="id-23">6/26/2026</custom>  | <custom data-type="mention" data-id="id-24">@Sasha Grosman</custom>  | Clarified QB and IBS settings entry point live under Finance section. |
| <custom data-type="date" data-id="id-25">6/28/2026</custom>  | <custom data-type="mention" data-id="id-26">@Sasha Grosman</custom>  | Reversing an Invoice has been moved (for Work Orders and Part Sales) Previously: required Invoice & Payments → Delete Now: For WO requires Work Order → Delete For PS requires Part Sale → Delete Clarified Technicians lose “send to portal” Added: Deleting a return requires “Invoice & Payments → Delete” When Manage AP/AR is off the related fields are also hidden from the Customer Overview panel Changed: Integration settings section will remain and will include Quickbooks, IBS, Open API Added setting to control that section |
| <custom data-type="date" data-id="id-27">6/29/2026</custom>  | <custom data-type="mention" data-id="id-28">@Sasha Grosman</custom>  | Everyone has access to Return a part from a WO Setting On Site status on a WO is gated by WO → Create&Edit <custom data-type="smartlink" data-id="id-29">https://shopview.atlassian.net/browse/SV-8021</custom>  |
| <custom data-type="date" data-id="id-30">7/1/2026</custom>  | <custom data-type="mention" data-id="id-31">@Sasha Grosman</custom>  | Added requirements: Handling Notes on WO. See description in WO permissions. When See Financial Data is disabled, user gets prompted to turn off any dependencies that are On Sensitive vendor fields are also controlled by Manage AP/AR |
| <custom data-type="date" data-id="id-32">7/2/2026</custom>  | <custom data-type="mention" data-id="id-33">@Milos Vasic</custom>  <custom data-type="mention" data-id="id-34">@Sasha Grosman</custom>  | Added Digital Inspections permission mapping — inspection actions derive from existing atoms (WO Lines CRUD + Settings › Service), with no separate permission. Documented per-role behavior, the View Mode clarification, and canned-line gating. Tracked in <custom data-type="smartlink" data-id="id-35">https://shopview.atlassian.net/browse/SV-8059</custom>  Cleaned up View Mode → Tech View restrictions table, it had a comment that Review was only controlled by Review setting. I removed the row/comment so it’s now properly documented. |
| Jul 3, 2026 | <custom data-type="mention" data-id="id-36">@Sasha Grosman</custom>  | Changes based on issues/gaps found during testing. Added: Order Parts now controls the WO Parts tab and requires See Financial Data Marking a core OK or Not-OK and viewing a line’s story history are tied to Work Order Lines → Create & Edit. Changed: Work Order View now allows creating and editing any note (in-note collaboration) Work Order Delete can remove other users’ notes. Removed: Manage AP & AR no longer gates the AR & AP aging reports — those now follow the Reports permission (all-or-nothing) Clarified: Viewing WOL-level story history requires WOL Create & Edit vs work-order-level history (View History Logs).  When See Financial Data is OFF, clarified creating Inventory Part experience |
| <custom data-type="date" data-id="id-37">7/6/2026</custom>  | <custom data-type="mention" data-id="id-38">@Sasha Grosman</custom>  | Updated Send to Terminal required both Invoicing.. →  Create & Edit and Customer Portal → ON to be visible. Clarified Clarified See Financial Data requires the user to have any of the entry points configured. (already working, just adding detail to spec). All users who can clock in / out can see “My Timesheets” regardless of this setting. Removed Misleading requirement suggesting Customer setting controls behavior in WO tab |
| <custom data-type="date" data-id="id-39">7/7/2026</custom>  |  | Clarifying Digital Inspections Who can delete incomplete inspections vs. complete ones Story history (WOL level) requires - WOL - View Audit log (both line level and work order level)  requires WO → Create & Edit Changed “View History Logs” Relabel “View Part History” Only controls viewing Part History Setting lives under Part Sales as last in the list Sales Rep default template has been updated Added New section describing how Office Users cannot create invoice (regardless of Invoicing… CRUD) Marking Cores OK/Not Ok is gated by WO->View |
| <custom data-type="date" data-id="id-40">7/8/2026</custom>  |  | Added Manage AP / AR required See Financial Data on (not the other way around) Clarified Notes Tab vs Notes field behavior on WO, Customer, and Asset pages Departments belongs under App Settings (we agreed on this and comment was in pace in spec, just moved the change out of comments and into the actual spec body. Build is correct and all related tickets are closed) Settings → Integrations: clarified which system roles should have this default on. |
| <custom data-type="date" data-id="id-41">7/9/2026</custom>  | <custom data-type="mention" data-id="id-42">@Sasha Grosman</custom>  | Clarified See Financial Data applies to Core app, not Customer Portal, Billing Portal, and Settings pages. |
| <custom data-type="date" data-id="id-43">7/14/2026</custom>  | <custom data-type="mention" data-id="id-44">@Sasha Grosman</custom>  | Updated Office Role definition |

---

‌

‌