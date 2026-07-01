# Test Environment and Setup

> **Epic:** [SV-7388 – Custom Roles and Permissions](https://shopview.atlassian.net/browse/SV-7388)
> **Spec:** [Custom Roles and Permissions (Confluence)](https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions)

**Scope:** Establishes and verifies the shared test environment (test shop with sample data, an administrator account, per-role test users, and seeded system role templates) that every other file in this suite depends on. Execute this file first; other files reference its prerequisites.

## Prerequisites
- Access to a ShopView environment (staging/QA) where the Custom Roles and Permissions feature (Epic SV-7388) is enabled.
- Credentials for at least one Administrator-level account, or the ability to have one provisioned.
- Two browsers or one browser plus an incognito/private window available (needed for the role-change-forces-logout behavior).

## Test Cases

### CR-SETUP-001 — Verify a test shop with representative sample data exists

| Field | Value |
|---|---|
| **Related Jira** | SV-7388 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | Access to the QA environment with the feature enabled. |
| **Test Data** | Target test shop identifier (from PM/QA lead). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as an Administrator and open the target test shop. | Shop loads without error. |
| 2 | Navigate to Work Orders. | At least a few sample work orders exist, including at least one with work-order lines. |
| 3 | Navigate to Customers. | At least a few sample customers exist. |
| 4 | Navigate to the Parts department (Part Sales, Catalog & Inventory, Vendor & Order Management). | Sample parts, at least one catalog/inventory record, and at least one vendor with an order exist. |
| 5 | Navigate to Invoicing. | At least one sample invoice exists. |
| 6 | Navigate to Schedule. | At least one sample appointment exists. |

**Expected Final Result:** The test shop contains observable sample data across work orders, WO lines, customers, parts, vendors, invoices, and schedule appointments, so permission effects (hidden/disabled/blocked actions) are observable during testing. If any area is empty, seed it or request seeding before proceeding.

---

### CR-SETUP-002 — Verify an Administrator test account can reach role and staff administration

| Field | Value |
|---|---|
| **Related Jira** | SV-7388 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | CR-SETUP-001 passed. Administrator credentials available. |
| **Test Data** | Administrator account email/password. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Administrator test account. | Login succeeds. |
| 2 | Open Administration > Roles and Permissions. | The Roles and Permissions list page loads and is accessible to this account. |
| 3 | Open Administration > Staff. | The Staff page loads and is accessible to this account. |

**Expected Final Result:** The Administrator test account can reach both Administration > Roles and Permissions and Administration > Staff. This account is the driver for all role configuration and staff-assignment test cases.

---

### CR-SETUP-003 — Provision one dedicated test user per system role

| Field | Value |
|---|---|
| **Related Jira** | SV-7388 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | CR-SETUP-002 passed. CR-SETUP-004 confirms the templates are seeded. |
| **Test Data** | Naming convention for test users, e.g. `qa-<role>@shopview-test.com` (one per role). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, open Administration > Staff. | Staff list loads. |
| 2 | For each of the 12 system roles, create (or confirm there exists) a dedicated test user whose role is set to that system role: Administrator, Service Manager, Senior Service Advisor, Service Advisor, Foreman, Technician, Parts Manager, Parts Technician, Office, Sales Representative, Time Clock. (Note: the matrix names 11 roles; see the Owner discrepancy in the README.) | A distinct, loginable test user exists for each system role. |
| 3 | Record each test user's credentials in the shared QA credential store. | Credentials are recorded and retrievable. |

**Expected Final Result:** There is exactly one dedicated, loginable test user per system role. These users let each role's permissions be verified by logging in as that user. If creation is not possible in this environment, note which users must be provisioned by an admin before role-specific files can run.

---

### CR-SETUP-004 — Verify the 12 system role templates are seeded and visible

| Field | Value |
|---|---|
| **Related Jira** | SV-7526 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | CR-SETUP-002 passed. |
| **Test Data** | Expected role names (see spec / file 12). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, open Administration > Roles and Permissions. | The roles list page loads. |
| 2 | Review the list of roles marked as system/template roles. | The system role templates are present and labeled as system roles. |
| 3 | Confirm the following are listed: Administrator, Service Manager, Senior Service Advisor, Service Advisor, Foreman, Technician, Parts Manager, Parts Technician, Office, Sales Representative, Time Clock. | All listed roles are present. |
| 4 | Count the system roles. | Count matches the PM-confirmed number. Spec says 12 but the matrix names 11 (Owner merged into Admin) — flag any mismatch per the README discrepancy list. |

**Expected Final Result:** All expected system role templates are seeded and visible on the Roles and Permissions list page. Any deviation in the set or count is logged against the README discrepancy note (item 1).

---

### CR-SETUP-005 — Verify "role change forces logout" behavior and set up efficient two-session testing

| Field | Value |
|---|---|
| **Related Jira** | SV-7388 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | CR-SETUP-003 provided at least one non-admin test user. Two browsers or one browser + incognito available. |
| **Test Data** | One non-admin test user (e.g. the Technician test user) and the Administrator account. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | In Browser A, log in as the non-admin test user and remain on any page. | User is logged in. |
| 2 | In Browser B (or incognito), log in as Administrator, open Administration > Staff, and change the test user's role to a different role. Save. | Role change saves successfully. |
| 3 | In Browser A, perform an action or navigate. | The test user is logged out (session invalidated) as a result of the role change. |
| 4 | In Browser A, log the test user back in. | The newly assigned role's permissions are now in effect. |

**Expected Final Result:** Changing a user's role forces that user to log out; the new role applies on next login. QA must expect this between test runs. Use two browsers/incognito (admin in one, test user in the other) to reconfigure roles and re-log-in efficiently.

---

### CR-SETUP-006 — Establish reset guidance between test cases

| Field | Value |
|---|---|
| **Related Jira** | SV-7388 |
| **Priority** | Medium |
| **Type** | Positive |
| **Preconditions** | CR-SETUP-003 and CR-SETUP-004 passed. |
| **Test Data** | None. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Before a case that modifies a system role's permissions, note the role's current settings (or plan to Reset to Template if that feature is confirmed available — see README item 6). | Baseline captured. |
| 2 | After a case that modified a role or created a custom role, restore the modified system role to its documented defaults and delete any custom roles created solely for the test. | Environment returns to a known clean baseline. |
| 3 | After a case that reassigned a test user's role, reassign that user back to its dedicated system role and re-log-in per CR-SETUP-005. | Test users are back on their dedicated roles. |

**Expected Final Result:** Between test cases, roles, custom roles, and test-user assignments are reset to the known baseline so cases do not interfere with each other. Prefer editing/deleting via the admin UI; use Reset to Template only once its behavior is PM-confirmed.

---

## Glossary / permission reference (appendix)

This appendix summarizes the setting groups referenced throughout the suite. It is descriptive, not a test case.

### CRUD Areas
Areas configured with View / Edit / Delete levels: **Work Orders, WO Lines, Schedule, Customers, Part Sales, Catalog & Inventory, Vendor & Order Management, Invoicing, Timesheets.**
- **View** — see records in the area.
- **Edit** — create and edit records (also called Create & Edit).
- **Delete** — delete records.
- **Cascade (both directions):** enabling a higher level automatically enables the lower ones (enabling Delete enables Edit and View; enabling Edit enables View). Disabling a lower level automatically disables the higher ones (disabling View disables Edit and Delete; disabling Edit disables Delete).
- WO Lines View is inherited from Work Orders View.

### WO sub-settings
Additional Work Order controls: **Review Work Orders, Pick Parts, Order Parts.** These require Work Orders **View** (not Edit) to be enabled.

### Page Access Toggles
On/off page-level access, independent of CRUD: **Reports, Customer Portal, Billing Portal.** (Parts Department also acts as a parent gate for the parts CRUD areas — see file 06.)

### Settings + sub-toggles
A parent **Settings** access toggle plus sub-toggles controlling specific settings sections. The sub-toggle set includes App Settings, Service, Parts, Finance, Data Import, Integrations, and View/Manage Wages. (Spec intro says 6 sub-toggles but the table lists 7 — see README discrepancy item 2.)

### View Mode (Tech / Full)
A per-role display mode: **Tech View** (streamlined technician-focused UX) vs **Full View**. View Mode is a UX/presentation choice only — it is **not** a security control and must not be relied on to hide restricted data.

### Cross-Cutting toggles
Independent controls that span multiple areas:
- **See Financial Data** — show/hide monetary values (pricing, costs, totals) across the app.
- **Manage AP/AR** — manage Accounts Payable and Receivable (label drift noted in README item 3).
- **View History Logs** — access history/audit logs.
