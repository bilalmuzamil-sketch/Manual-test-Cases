# System Role Templates and Migration

> **Epic:** [SV-7388 – Custom Roles and Permissions](https://shopview.atlassian.net/browse/SV-7388)
> **Spec:** [Custom Roles and Permissions (Confluence)](https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions)

**Scope:** Verifies that the system role templates ship with the correct default permission matrix (SV-7526), that system-role editability/deletion rules hold, that custom roles record their source template, and that the legacy 15-role set migrated into the new roles correctly with the expected behavior changes preserved (SV-7527).

## Prerequisites
- File `00-test-environment-and-setup.md` completed: test shop with sample data, Administrator account, per-role test users, and seeded system role templates.
- Access to Administration > Roles and Permissions and Administration > Staff as Administrator.
- For migration cases: access to an environment (or shop snapshot) that was migrated from the legacy 15-role model, with at least one user per legacy role, OR migration records/mapping visible to QA. Coordinate with the PM/dev team if a pre-migration snapshot is required.

### Reference: the 12 system roles (final matrix names 11; Owner merged into Admin)
| # | Display name | Internal id | Notes |
|---|---|---|---|
| 1 | Administrator | system-admin | Full access |
| 2 | Service Manager | system-sm | |
| 3 | Senior Service Advisor | system-ssa | |
| 4 | Service Advisor | system-jsa | |
| 5 | Foreman | system-foreman | |
| 6 | Technician | system-tech | Tech View |
| 7 | Parts Manager | system-pm | |
| 8 | Parts Technician | system-pt | |
| 9 | Office | system-office | Open read-only |
| 10 | Sales Representative | system-salesrep | |
| 11 | Time Clock | system-timeclock | Open read-only |

> Discrepancy: SV-7526 references `system-owner`; Owner was merged into Administrator. The matrix names 11 roles while the spec text says 12. See CR-SYSROLE-001 and README discrepancy item 1.

### Reference: full default permission matrix (V=View, E=Create&Edit, D=Delete, —=off)

**CRUD areas**
| Area | Admin | SM | SrSA | SvcAdv | Foreman | Tech | PartsMgr | PartsTech | Office | SalesRep | TimeClock |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Work Orders | V/E/D | V/E/D | V/E/D | V/E | V/E | V | V/E | V | V | — | V |
| WO Lines | V/E/D | V/E/D | V/E/D | V/E/D | V/E/D | V/E | V/E | V | V | — | — |
| Schedule | V/E/D | V/E/D | V/E/D | V/E/D | V/E/D | V | V | V | V | — | V |
| Customers | V/E/D | V/E/D | V/E | V/E | V/E | V | V/E/D | V/E | V/E/D | — | — |
| Part Sales | V/E/D | V/E/D | V/E/D | V/E | V | — | V/E/D | V/E | V | — | — |
| Catalog & Inventory | V/E/D | V/E/D | V/E | V/E | V/E | — | V/E/D | V/E | V | — | — |
| Vendor & Order Mgmt | V/E/D | V/E/D | V/E/D | V/E | V/E | — | V/E/D | V/E/D | V | — | — |
| Invoicing | V/E/D | V/E | V/E/D | V/E/D | V/E | — | V/E/D | V/E | V | — | — |
| Timesheets | V/E | V/E | V/E | V | V | — | — | V | V/E | — | V |

**Page toggles (ON/off)**
| Toggle | On for |
|---|---|
| Reports | Admin, SM, SrSA, PartsMgr, Office, SalesRep |
| Customer Portal | Admin, SM, SrSA, SvcAdv, PartsMgr |
| Parts Dept | Admin, SM, SrSA, SvcAdv, Foreman, PartsMgr, PartsTech, Office |
| Billing Portal | Admin, SM, Office |
| Settings | Admin, SM, PartsMgr, Office |

**Settings sub-toggles**
| Role | Sub-toggles ON |
|---|---|
| Admin | All |
| SM | App Settings, Wages |
| PartsMgr | Parts, Finance, Data Import |
| Office | App Settings, Service, Finance, Data Import, Wages |

**WO sub-settings / View Mode / cross-cutting**
| Setting | On for |
|---|---|
| Review Work Orders | Admin, SM, SrSA, SvcAdv, Foreman, PartsMgr |
| Pick Parts | Admin, SM, SrSA, SvcAdv, Foreman, Tech, PartsMgr, PartsTech |
| Order Parts | Admin, SM, SrSA, SvcAdv, Foreman, PartsMgr, PartsTech |
| View Mode | Tech View: Technician only. Full View: all others. Time Clock: empty. |
| See Financial Data | All except Technician and Time Clock |
| Manage AP/AR | Admin, SM, SrSA, PartsMgr, Office, SalesRep |
| View History Logs | All except Technician and Time Clock |

### Reference: legacy 15 → new role migration mapping
| Legacy role | Maps to | Notes |
|---|---|---|
| Owner | system-admin | Owner dropped/merged into Admin |
| Administrator | system-admin | |
| Service Manager | system-sm | |
| Service Advisor | system-ssa | |
| SA Technician | system-ssa | |
| SA No Reports | system-ssa | Gains Reports after migration |
| SA Limited View | system-jsa | AP/AR OFF preserves the restriction |
| Foreman | system-foreman | |
| Technician | system-tech | |
| Parts Manager | system-pm | |
| Parts Technician | system-pt | |
| Sales Representative | system-salesrep | |
| Reporting | system-salesrep | |
| Office | system-office | |
| Time Clock | system-timeclock | |

## Test Cases

### CR-SYSROLE-001 — Verify system role set and count (Owner merged into Admin)

| Field | Value |
|---|---|
| **Related Jira** | SV-7526 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | Logged in as Administrator; on Administration > Roles and Permissions. |
| **Test Data** | Expected role list from the reference table above. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the Roles and Permissions list and filter to system/template roles. | System roles are listed and labeled as system roles. |
| 2 | Confirm each expected role is present: Administrator, Service Manager, Senior Service Advisor, Service Advisor, Foreman, Technician, Parts Manager, Parts Technician, Office, Sales Representative, Time Clock. | All 11 named roles are present. |
| 3 | Search the list for a separate "Owner" role. | No standalone Owner role exists; Owner is merged into Administrator. |
| 4 | Compare the total system-role count and internal ids against the PM-confirmed list. | Count and roles match the confirmed list. If `system-owner` still exists or count = 12, log against README discrepancy item 1. |

**Expected Final Result:** The seeded system roles match the confirmed list of 11 (Owner merged into Administrator); no separate Owner role exists. Any reference to `system-owner` or a 12-role count is flagged for PM confirmation.

---

### CR-SYSROLE-002 — Spot-check full default matrix: Administrator (full access)

| Field | Value |
|---|---|
| **Related Jira** | SV-7526 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | On Administration > Roles and Permissions; Administrator system role opened for viewing. |
| **Test Data** | Administrator column of the reference matrix (all areas V/E/D except Timesheets V/E; all page toggles/settings/cross-cutting ON; Full View). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the Administrator system role and view its permission configuration. | Role detail displays all setting groups. |
| 2 | Verify CRUD levels: Work Orders, WO Lines, Schedule, Customers, Part Sales, Catalog & Inventory, Vendor & Order Mgmt, Invoicing all = V/E/D. | All these areas show View, Edit, and Delete enabled. |
| 3 | Verify Timesheets = V/E. | Timesheets shows View and Edit; Delete matches the matrix (V/E). |
| 4 | Verify page toggles: Reports, Customer Portal, Parts Dept, Billing Portal, Settings all ON. | All page toggles ON. |
| 5 | Verify Settings sub-toggles: all ON. | Every Settings sub-toggle is ON. |
| 6 | Verify WO sub-settings (Review WOs, Pick Parts, Order Parts) ON; See Financial ON; Manage AP/AR ON; View History Logs ON; View Mode = Full. | All ON; View Mode Full. |

**Expected Final Result:** The Administrator system role defaults exactly match the full-access configuration in the matrix.

---

### CR-SYSROLE-003 — Spot-check full default matrix: Technician (Tech View, restricted)

| Field | Value |
|---|---|
| **Related Jira** | SV-7526 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | On Administration > Roles and Permissions; Technician system role opened. |
| **Test Data** | Technician column: WO=V, WO Lines=V/E, Schedule=V, Customers=V; Part Sales/Catalog/Vendor/Invoicing/Timesheets=—; Tech View; See Financial OFF; History Logs OFF. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the Technician system role. | Role detail displays. |
| 2 | Verify CRUD: Work Orders = V, WO Lines = V/E, Schedule = V, Customers = V. | These match exactly (WO Lines has Edit; others View only). |
| 3 | Verify Part Sales, Catalog & Inventory, Vendor & Order Mgmt, Invoicing, Timesheets all = — (off). | All five parts/invoicing/timesheets areas are off. |
| 4 | Verify page toggles: Reports OFF, Customer Portal OFF, Billing Portal OFF, Settings OFF; Parts Dept OFF. | These are OFF for Technician. |
| 5 | Verify WO sub-settings: Pick Parts ON; Review WOs OFF; Order Parts OFF. | Pick Parts ON only. |
| 6 | Verify View Mode = Tech View; See Financial Data OFF; Manage AP/AR OFF; View History Logs OFF. | View Mode is Tech; financial and history logs OFF. |

**Expected Final Result:** The Technician system role defaults exactly match the restricted, Tech-View configuration in the matrix, with financial data and history logs hidden.

---

### CR-SYSROLE-004 — Spot-check full default matrix: Time Clock (minimal)

| Field | Value |
|---|---|
| **Related Jira** | SV-7526 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | On Administration > Roles and Permissions; Time Clock system role opened. |
| **Test Data** | Time Clock column: WO=V, Schedule=V, Timesheets=V; WO Lines/Customers/Parts/Invoicing=—; all page toggles OFF; See Financial OFF; History Logs OFF; View Mode empty. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the Time Clock system role. | Role detail displays (read-only — see CR-SYSROLE-006). |
| 2 | Verify CRUD: Work Orders = V, Schedule = V, Timesheets = V. | These three are View only. |
| 3 | Verify WO Lines, Customers, Part Sales, Catalog & Inventory, Vendor & Order Mgmt, Invoicing all = —. | All off. |
| 4 | Verify all page toggles (Reports, Customer Portal, Parts Dept, Billing Portal, Settings) OFF. | All OFF. |
| 5 | Verify WO sub-settings all OFF; See Financial Data OFF; Manage AP/AR OFF; View History Logs OFF. | All OFF. |
| 6 | Verify View Mode is empty/unset for Time Clock. | View Mode shows no selection. |

**Expected Final Result:** The Time Clock system role defaults exactly match the minimal configuration in the matrix (WO/Schedule/Timesheets View only, everything else off, View Mode empty).

---

### CR-SYSROLE-005 — Spot-check full default matrix: Office (non-edit-heavy, read-focused)

| Field | Value |
|---|---|
| **Related Jira** | SV-7526 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | On Administration > Roles and Permissions; Office system role opened. |
| **Test Data** | Office column: Customers=V/E/D; Timesheets=V/E; WO=V; Schedule=V; Part Sales/Catalog/Vendor/Invoicing=V; WO Lines=V; Reports OFF; Customer Portal OFF; Parts Dept ON; Billing Portal ON; Settings ON; Settings subs = App Settings, Service, Finance, Data Import, Wages; See Financial ON; Manage AP/AR ON; History Logs ON; Full View. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the Office system role. | Role detail displays (read-only — see CR-SYSROLE-006). |
| 2 | Verify Customers = V/E/D and Timesheets = V/E. | Office can delete customers and edit timesheets. |
| 3 | Verify Work Orders=V, WO Lines=V, Schedule=V, Part Sales=V, Catalog & Inventory=V, Vendor & Order Mgmt=V, Invoicing=V. | All these are View only (no Edit/Delete). |
| 4 | Verify page toggles: Reports OFF, Customer Portal OFF, Parts Dept ON, Billing Portal ON, Settings ON. | Matches. |
| 5 | Verify Settings sub-toggles ON = App Settings, Service, Finance, Data Import, Wages (Parts and Integrations OFF). | Matches exactly. |
| 6 | Verify See Financial Data ON, Manage AP/AR ON, View History Logs ON, View Mode = Full. | Matches. |

**Expected Final Result:** The Office system role defaults exactly match the matrix, including Customers V/E/D, Timesheets V/E, mostly View-only elsewhere, and its specific Settings sub-toggle set.

---

### CR-SYSROLE-006 — Verify Office and Time Clock are open read-only; other system roles editable

| Field | Value |
|---|---|
| **Related Jira** | SV-7526 |
| **Priority** | Critical |
| **Type** | Security |
| **Preconditions** | Logged in as Administrator; on Administration > Roles and Permissions. |
| **Test Data** | Office, Time Clock, and one editable system role (e.g. Service Manager). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the Office system role. | Role opens and its settings are visible (open) but all controls are read-only — no toggle/level can be changed and there is no Save affordance for edits. |
| 2 | Attempt to change any Office permission. | The change is not possible / not persisted; role remains at defaults. |
| 3 | Open the Time Clock system role and attempt to change any permission. | Time Clock is open but read-only; no permission can be changed. |
| 4 | Open the Service Manager system role and change a non-critical setting, then Save. | Service Manager (an editable system role) allows the edit and saves it. |
| 5 | Revert the Service Manager change. | Reverted successfully. |

**Expected Final Result:** Office and Time Clock system roles are viewable but read-only (cannot be edited); all other system roles are editable. Reset any edited role to defaults afterward.

---

### CR-SYSROLE-007 — Verify system roles cannot be deleted

| Field | Value |
|---|---|
| **Related Jira** | SV-7526 |
| **Priority** | Critical |
| **Type** | Negative |
| **Preconditions** | Logged in as Administrator; on Administration > Roles and Permissions. |
| **Test Data** | Any two system roles (e.g. Administrator, Technician). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Locate a system role (e.g. Administrator) in the list. | Row is shown as a system role. |
| 2 | Look for a Delete action on the system role. | No Delete action is available, or it is disabled. |
| 3 | If a delete affordance exists, attempt to delete the system role. | Deletion is blocked with a clear message that system roles cannot be deleted. |
| 4 | Repeat for a second system role (e.g. Technician). | Same result — cannot be deleted. |

**Expected Final Result:** No system role can be deleted through the UI; the system prevents deletion of template roles.

---

### CR-SYSROLE-008 — Verify a custom role records its source template

| Field | Value |
|---|---|
| **Related Jira** | SV-7526 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Logged in as Administrator; on Administration > Roles and Permissions. |
| **Test Data** | Source template = Service Advisor; new custom role name = `QA Custom From SvcAdv`. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Start creating a new custom role and choose Service Advisor as the starting template. | The new role is pre-populated with Service Advisor's default permissions. |
| 2 | Name it `QA Custom From SvcAdv` and save. | Custom role is created. |
| 3 | Reopen the custom role and inspect its details/metadata. | The role records/displays that its source template was Service Advisor (template recorded for reference). |
| 4 | Confirm the recorded template does not change even if permissions are later edited. | Edit a permission, save, reopen — source template still shows Service Advisor. |
| 5 | Delete the custom role (cleanup). | Deleted successfully (custom roles are deletable, unlike system roles). |

**Expected Final Result:** A custom role starts from the chosen template and persistently records that template for reference, independent of subsequent edits.

---

### CR-SYSROLE-009 — Matrix-verification template (repeat per role)

| Field | Value |
|---|---|
| **Related Jira** | SV-7526 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Logged in as Administrator; on Administration > Roles and Permissions. Have the reference matrix at hand. |
| **Test Data** | The role under test = **__________** (fill in). Use that role's column across all reference tables above. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the role under test. | Role detail displays. |
| 2 | For each CRUD area (Work Orders, WO Lines, Schedule, Customers, Part Sales, Catalog & Inventory, Vendor & Order Mgmt, Invoicing, Timesheets), read the configured V/E/D and compare to the role's column in the CRUD matrix. | Every area's level matches the matrix exactly. |
| 3 | Compare each page toggle (Reports, Customer Portal, Parts Dept, Billing Portal, Settings) to the page-toggles table. | Each matches. |
| 4 | If Settings is ON, compare the Settings sub-toggles to the sub-toggle table. | Sub-toggle set matches. |
| 5 | Compare WO sub-settings (Review WOs, Pick Parts, Order Parts), View Mode, See Financial Data, Manage AP/AR, and View History Logs to the reference table. | Each matches. |
| 6 | Record any cell that does not match, citing area + expected vs actual. | Deviations logged with role name and cell. |

**Expected Final Result:** Every configured setting for the role under test matches its column in the reference matrix. Run this template once per system role not already covered in detail by CR-SYSROLE-002 through 005 (Service Manager, Senior Service Advisor, Service Advisor, Foreman, Parts Manager, Parts Technician, Sales Representative).

---

### CR-SYSROLE-010 — Behavior spot-check by logging in as sampled roles

| Field | Value |
|---|---|
| **Related Jira** | SV-7526 |
| **Priority** | High |
| **Type** | Security |
| **Preconditions** | Per-role test users exist (CR-SETUP-003). Two browsers/incognito available. |
| **Test Data** | Technician, Sales Representative, and Office test users. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Technician test user. | Technician sees Work Orders and can edit WO Lines, but sees no pricing/financial values (See Financial OFF) and no History Logs; no Reports/Settings/Parts Dept. |
| 2 | As Technician, open a work order. | Monetary values are hidden; Pick Parts is available; Review WOs and Order Parts are not. |
| 3 | Log in as the Sales Representative test user. | Sales Rep has no CRUD areas enabled (all —) but can access Reports and Manage AP/AR per the matrix; See Financial is ON. |
| 4 | Log in as the Office test user. | Office can view most areas, delete customers, edit timesheets, access Billing Portal and Settings (its sub-set), but cannot access Reports or Customer Portal. |

**Expected Final Result:** The effective behavior seen by sampled roles matches their matrix defaults, confirming the templates drive real access (not just the config UI).

---

### CR-SYSROLE-011 — Migration: each legacy role mapped to the correct new role

| Field | Value |
|---|---|
| **Related Jira** | SV-7527 |
| **Priority** | Critical |
| **Type** | Regression |
| **Preconditions** | A migrated shop (or migration records) with at least one user per legacy role. Access as Administrator. |
| **Test Data** | Legacy-to-new mapping table above. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | For each legacy user, open Administration > Staff and read their post-migration role. | Role is populated (no user left role-less). |
| 2 | Verify Owner → Administrator, Administrator → Administrator. | Both former-Owner and former-Administrator users are now Administrator. |
| 3 | Verify Service Manager → Service Manager; Service Advisor, SA Technician, SA No Reports → Senior Service Advisor; SA Limited View → Service Advisor. | Each maps as specified. |
| 4 | Verify Foreman → Foreman; Technician → Technician; Parts Manager → Parts Manager; Parts Technician → Parts Technician. | Each maps as specified. |
| 5 | Verify Sales Representative → Sales Representative; Reporting → Sales Representative; Office → Office; Time Clock → Time Clock. | Each maps as specified. |
| 6 | Confirm no legacy role produced an unexpected target. | All mappings match the reference table. |

**Expected Final Result:** Every legacy role migrated to its mapped new role exactly as in the mapping table, with each user assigned a valid new role.

---

### CR-SYSROLE-012 — Migration: legacy Owner users land on Administrator

| Field | Value |
|---|---|
| **Related Jira** | SV-7527 |
| **Priority** | Critical |
| **Type** | Regression |
| **Preconditions** | A migrated shop containing at least one user who was formerly Owner. Access as Administrator. |
| **Test Data** | At least one former-Owner user. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Identify a user who held the legacy Owner role before migration. | User identified. |
| 2 | Open that user in Administration > Staff and read their role. | Role = Administrator. |
| 3 | Log in as that user (or verify effective permissions). | User has full Administrator access. |
| 4 | Confirm the Owner role is not present anywhere as a selectable role. | Owner is absent; only Administrator exists. |

**Expected Final Result:** Former Owner users are on the Administrator role with full access, and Owner no longer exists as a separate selectable role.

---

### CR-SYSROLE-013 — Migration: SA Limited View preserves AP/AR restriction

| Field | Value |
|---|---|
| **Related Jira** | SV-7527 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | A migrated shop with a former SA Limited View user. Access as Administrator. |
| **Test Data** | A former SA Limited View user (now Service Advisor / system-jsa). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the former SA Limited View user in Staff. | Role = Service Advisor (system-jsa). |
| 2 | Inspect the user's effective Manage AP/AR setting. | Manage AP/AR is OFF, preserving the legacy restriction. |
| 3 | Log in as the user and attempt an AP/AR action. | AP/AR management is not available. |

**Expected Final Result:** SA Limited View migrated to Service Advisor with Manage AP/AR left OFF, preserving the original limited-view restriction.

---

### CR-SYSROLE-014 — Migration: SA No Reports gains Reports access

| Field | Value |
|---|---|
| **Related Jira** | SV-7527 |
| **Priority** | Medium |
| **Type** | Regression |
| **Preconditions** | A migrated shop with a former SA No Reports user. Access as Administrator. |
| **Test Data** | A former SA No Reports user (now Senior Service Advisor / system-ssa). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the former SA No Reports user in Staff. | Role = Senior Service Advisor. |
| 2 | Inspect the user's Reports page toggle. | Reports is ON (Senior Service Advisor has Reports; this is a behavior change vs legacy). |
| 3 | Log in as the user and open Reports. | Reports page is accessible. |

**Expected Final Result:** SA No Reports migrated to Senior Service Advisor and now has Reports access, consistent with the notified behavior change.

---

### CR-SYSROLE-015 — Migration: verify notified behavior changes per role

| Field | Value |
|---|---|
| **Related Jira** | SV-7527 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | A migrated shop with users across the affected roles. Access as Administrator. Reference matrix at hand. |
| **Test Data** | Users on Senior Service Advisor, Service Manager, Foreman, Technician, Parts Manager, Parts Technician, Office. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Senior Service Advisor: verify the broad expansion (elevated CRUD across areas per matrix, e.g. WO/WO Lines/Schedule V/E/D, Invoicing V/E/D, Reports ON, AP/AR ON). | Senior SA has the expanded permission set. |
| 2 | Service Manager: verify it lost Invoicing Delete (now V/E), lost several Settings sub-toggles (now only App Settings + Wages), and gained portals (Customer Portal, Billing Portal ON). | Matches the reduced-Invoicing / reduced-Settings / added-portals change. |
| 3 | Foreman: verify expansion — WO Lines Delete, Schedule Delete, Parts Dept ON, Invoicing V/E, Order Parts ON. | Foreman has these added capabilities. |
| 4 | Technician: verify it gained Pick Parts and lost "Send to Portal." | Pick Parts ON; Send to Portal no longer available. |
| 5 | Parts Manager: verify it lost WO Delete and WO Lines Delete (now WO V/E, WO Lines V/E), and gained Schedule View + Customer Portal. | Matches the reduced-delete / added-schedule-view / added-portal change. |
| 6 | Parts Technician: verify the expansion per matrix (e.g. Part Sales V/E, Catalog V/E, Vendor & Order Mgmt V/E/D, Pick/Order Parts ON, Timesheets V). | Parts Tech has the expanded set. |
| 7 | Office: verify Catalog & Inventory reduced to View and Customer Management gained Delete (Customers V/E/D). | Office Catalog = V; Customers = V/E/D. |

**Expected Final Result:** Each affected role reflects the notified post-migration behavior changes exactly as listed, matching the reference matrix. Any deviation is a migration defect logged against SV-7527.
