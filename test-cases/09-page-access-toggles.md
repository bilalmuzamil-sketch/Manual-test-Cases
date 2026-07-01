# Page Access Toggles (PAGES)

> **Epic:** [SV-7388 – Custom Roles and Permissions](https://shopview.atlassian.net/browse/SV-7388)
> **Spec:** [Custom Roles and Permissions (Confluence)](https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions)

**Scope:** Verifies the on/off page-access toggles that show or hide top-level navigation items: Reports (SV-7517), Customer Portal (SV-7518), and Billing Portal (SV-7519). Each toggle is all-or-nothing at the page level: ON makes the nav item visible and usable, OFF hides the nav item and blocks the page even by direct URL. Includes regression cases for known Reports defects.

## Prerequisites
- File `00-test-environment-and-setup.md` completed: test shop with sample data, an Administrator account, and per-role test users exist.
- Ability to create/edit custom roles under Administration > Roles and Permissions and assign them to a test user via Administration > Staff.
- Two browsers (or one browser plus incognito): one for the Administrator to reconfigure roles, one for the test user. Remember: changing a user's role forces that user to log out; the new permissions apply on next login.
- To test any page toggle: create or pick a custom role with the toggle set as required, assign it to a test user, log in as that user, and verify the effect. Reset the role/user to baseline afterward.

## Test Cases

### CR-PAGES-001 — Reports toggle ON shows and enables the Reports nav

| Field | Value |
|---|---|
| **Related Jira** | SV-7517 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Admin can edit roles; a spare test user is available. |
| **Test Data** | Custom role "QA Reports ON" with the Reports page toggle ON (all other page toggles may be default); test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create a custom role "QA Reports ON" with the Reports toggle ON. Save. | Role saves with Reports ON. |
| 2 | Assign the role to the test user via Administration > Staff. Save. | Assignment saved; the test user is forced to log out. |
| 3 | Log in as the test user. | Login succeeds. |
| 4 | Look at the main navigation. | The Reports nav item is visible. |
| 5 | Open Reports and review the available report list. | The Reports area opens and lists reports (e.g. technician efficiency, service advisor analysis, requested parts, vendor expenses, WO statuses, inventory, WIP). |
| 6 | Open at least two different reports. | Each report opens and renders without an access error. |

**Expected Final Result:** With the Reports toggle ON the Reports nav item is visible and every report is reachable and usable. Reports access is all-or-nothing — there is no per-report granularity.

---

### CR-PAGES-002 — Reports toggle OFF hides the Reports nav and blocks direct URL access

| Field | Value |
|---|---|
| **Related Jira** | SV-7517 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Admin can edit roles; a spare test user is available. |
| **Test Data** | Custom role "QA Reports OFF" with the Reports page toggle OFF but enough other permissions to log in and use the app (e.g. Work Orders View ON); test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create/edit a custom role "QA Reports OFF" with the Reports toggle OFF and Work Orders View ON. Save. | Role saves with Reports OFF. |
| 2 | Assign the role to the test user; save. | Assignment saved; the test user is forced to log out. |
| 3 | Log in as the test user. | Login succeeds (see CR-PAGES-006 regression). |
| 4 | Look at the main navigation. | The Reports nav item is NOT visible. |
| 5 | While logged in as the test user, navigate directly to the Reports URL (e.g. paste the Reports page path into the address bar). | Access is denied/blocked — the reports page and report content do not load. |
| 6 | From any page that previously linked to a report, look for report links. | No report links are present or clickable (see CR-PAGES-004 regression). |

**Expected Final Result:** With the Reports toggle OFF the Reports nav item is hidden and the page is unreachable by direct URL. No report content or report links are exposed.

---

### CR-PAGES-003 — Regression: report links must not be clickable when Reports/View is OFF (SV-7855)

| Field | Value |
|---|---|
| **Related Jira** | SV-7855 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | CR-PAGES-002 role available (Reports OFF). |
| **Test Data** | Test user on the "QA Reports OFF" role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user whose role has Reports OFF. | Login succeeds; Reports nav hidden. |
| 2 | Visit each page that historically embedded report links (dashboards, list-page action menus, work order and part sales pages, entity detail pages). | No report hyperlinks/buttons are shown for a user without Reports access. |
| 3 | If any residual report link is displayed, attempt to click it. | The link must be non-functional / not navigate to a report. Any link that opens a report is a regression of SV-7855. |

**Expected Final Result:** No report links are clickable for a user without Reports access, confirming SV-7855 remains fixed. Log any clickable report link as a reopened defect.

---

### CR-PAGES-004 — Regression: unavailable reports must not be visible in the report list (SV-7949)

| Field | Value |
|---|---|
| **Related Jira** | SV-7949 |
| **Priority** | Medium |
| **Type** | Regression |
| **Preconditions** | A role with Reports ON but a permission that makes some report unavailable (e.g. Timesheets View OFF or See Financial Data OFF, depending on which reports those gate). |
| **Test Data** | Custom role "QA Reports ON, Limited" with Reports ON plus at least one data permission OFF; test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create the "QA Reports ON, Limited" role (Reports ON, one underlying data permission OFF). Assign to the test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user and open Reports. | Reports area opens. |
| 3 | Review the full list of reports offered. | Reports whose underlying data the user cannot access are NOT listed (they are hidden, not merely disabled). |
| 4 | Attempt to open any such report by direct URL if its path is known. | Access is blocked. |

**Expected Final Result:** Reports the user cannot use are not shown in the report list, confirming SV-7949 remains fixed. A visible-but-unavailable report is a reopened defect.

---

### CR-PAGES-005 — Regression: Timesheets View OFF but Reports ON must hide the timesheet activities report

| Field | Value |
|---|---|
| **Related Jira** | SV-7949 |
| **Priority** | Medium |
| **Type** | Regression |
| **Preconditions** | Admin can edit roles. |
| **Test Data** | Custom role "QA Reports ON, Timesheets OFF" with Reports ON and Timesheets View OFF; test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create the role with Reports ON and Timesheets View OFF. Assign to the test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user and open Reports. | Reports area opens (Reports nav visible). |
| 3 | Look for the timesheet activities report in the report list. | The timesheet activities report is NOT listed. |
| 4 | Attempt to reach the timesheet activities report by direct URL if known. | Access is blocked. |

**Expected Final Result:** A user with Timesheets View OFF cannot see or open the timesheet activities report even though Reports is ON. A visible timesheet activities report here is a defect (extends SV-7949).

---

### CR-PAGES-006 — Regression: a role WITHOUT Reports must still be able to log in and use the app (SV-7977)

| Field | Value |
|---|---|
| **Related Jira** | SV-7977 |
| **Priority** | Critical |
| **Type** | Regression |
| **Preconditions** | Admin can edit roles. |
| **Test Data** | Custom role "QA No Reports" with the Reports toggle OFF and a normal set of other permissions ON (e.g. Work Orders View/Edit ON, Customers View ON); test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create "QA No Reports" (Reports OFF, other permissions ON). Assign to the test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user. | Login SUCCEEDS. No "Access Restricted" / lockout screen appears (the SV-7977 symptom). |
| 3 | Land on the default landing page and navigate to an area the role permits (e.g. Work Orders). | The app is usable; permitted areas load normally. |
| 4 | Confirm the Reports nav is hidden but nothing else is blocked. | Reports nav hidden; all other permitted functionality works. |

**Expected Final Result:** A role without Reports can log in and use the rest of the application normally. An "Access Restricted" screen at login for a no-Reports role is a reopened SV-7977 defect.

---

### CR-PAGES-007 — Customer Portal toggle ON shows and enables its nav

| Field | Value |
|---|---|
| **Related Jira** | SV-7518 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Admin can edit roles; a spare test user is available. |
| **Test Data** | Custom role "QA Customer Portal ON" with the Customer Portal toggle ON; test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create the role with Customer Portal ON. Assign to the test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user. | Login succeeds. |
| 3 | Look at the navigation. | The Customer Portal nav item is visible. |
| 4 | Open the Customer Portal area. | The customer-facing portal configuration loads and its management options are usable. |

**Expected Final Result:** With Customer Portal ON, its nav item is visible and the portal configuration is accessible and manageable. (Note: system roles Service Advisor, Sr Service Advisor, Service Manager, and Parts Manager receive this by default — spot-check one of them if convenient.)

---

### CR-PAGES-008 — Customer Portal toggle OFF hides its nav and blocks direct URL access

| Field | Value |
|---|---|
| **Related Jira** | SV-7518 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Admin can edit roles; a spare test user is available. |
| **Test Data** | Custom role "QA Customer Portal OFF" with the Customer Portal toggle OFF but able to log in (Work Orders View ON); test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create the role with Customer Portal OFF. Assign to the test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user. | Login succeeds. |
| 3 | Look at the navigation. | The Customer Portal nav item is NOT visible. |
| 4 | Navigate directly to the Customer Portal URL/path. | Access is denied/blocked — the portal configuration does not load. |

**Expected Final Result:** With Customer Portal OFF, its nav item is hidden and the page is unreachable by direct URL.

---

### CR-PAGES-009 — Billing Portal toggle ON shows and enables its nav

| Field | Value |
|---|---|
| **Related Jira** | SV-7519 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Admin can edit roles; a spare test user is available. |
| **Test Data** | Custom role "QA Billing Portal ON" with the Billing Portal toggle ON; test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create the role with Billing Portal ON. Assign to the test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user. | Login succeeds. |
| 3 | Look at the navigation. | The Billing Portal nav item is visible. |
| 4 | Open the Billing Portal area. | The billing portal loads and its management options are usable. |

**Expected Final Result:** With Billing Portal ON, its nav item is visible and the billing portal is accessible and manageable.

---

### CR-PAGES-010 — Billing Portal toggle OFF hides its nav and blocks direct URL access

| Field | Value |
|---|---|
| **Related Jira** | SV-7519 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Admin can edit roles; a spare test user is available. |
| **Test Data** | Custom role "QA Billing Portal OFF" with the Billing Portal toggle OFF but able to log in (Work Orders View ON); test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create the role with Billing Portal OFF. Assign to the test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user. | Login succeeds. |
| 3 | Look at the navigation. | The Billing Portal nav item is NOT visible. |
| 4 | Navigate directly to the Billing Portal URL/path. | Access is denied/blocked — the billing portal does not load. |

**Expected Final Result:** With Billing Portal OFF, its nav item is hidden and the page is unreachable by direct URL.

---

### CR-PAGES-011 — Security: page toggles enforce access server-side, not just by hiding nav

| Field | Value |
|---|---|
| **Related Jira** | SV-7517 |
| **Priority** | High |
| **Type** | Security |
| **Preconditions** | Roles "QA Reports OFF", "QA Customer Portal OFF", and "QA Billing Portal OFF" available. |
| **Test Data** | One test user cycled through each OFF role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as a user whose role has Reports OFF and attempt to reach a report by direct URL and, if feasible, by observing whether report data is returned to the browser. | No report page loads and no report data is returned. |
| 2 | Repeat with Customer Portal OFF: direct-URL the Customer Portal page. | Access blocked; no portal config data returned. |
| 3 | Repeat with Billing Portal OFF: direct-URL the Billing Portal page. | Access blocked; no billing portal data returned. |

**Expected Final Result:** Each page toggle blocks access at the page/data level, not merely by hiding the nav link. Any case where direct navigation exposes a hidden page or its data is a security defect.

---
