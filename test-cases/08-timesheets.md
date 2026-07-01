# Timesheets — Custom Roles and Permissions Test Cases

> **Epic:** [SV-7388 – Custom Roles and Permissions](https://shopview.atlassian.net/browse/SV-7388)
> **Spec:** [Custom Roles and Permissions (Confluence)](https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions)

**Scope:** Verifies that the Timesheets area (area code TIME, permission key `timesheets`, SV-7516) enforces its View and Edit permissions (there is NO Delete for Timesheets). Covers read-only viewing, hour/attendance editing, nav hiding, the Reports-on interaction (timesheet activities report), the fact that clock in/out always works regardless of the permission, confirmation that no Delete action exists, out-of-scope staff-record settings, and the SV-8051 regression.

## Prerequisites
- Access to a ShopView environment (staging/QA) with admin rights to create Custom Roles and assign them to users.
- Ability to create/edit Custom Roles under Settings → Roles & Permissions.
- At least two test users available for role assignment (so the admin session stays logged in).
- Note: role changes force the affected user to log out; always re-log in as the test user after any role change.
- General cascade rule: enabling **Edit** auto-enables **View**; disabling **View** disables **Edit**. When **View is OFF**, the area's nav item is **hidden**. (Timesheets has only View and Edit — no Delete.)
- At least one Work Order (WO) with existing time entries; at least one other staff member's attendance record for editing steps.
- The "timesheet activities report" is under Reports; have the ability to toggle Reports access independently.

## Test Cases

### CR-TIME-001 — Timesheets View enabled shows Timesheets nav and read-only timesheets

| Field | Value |
|---|---|
| **Related Jira** | SV-7516 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | Custom role with Timesheets: View = ON, Edit = OFF. |
| **Test Data** | Role "TIME View Only"; test user timeview@test; WO-300 with existing time entries |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create/pick custom role with Timesheets: View = ON only. | Role saved; Edit remains OFF. |
| 2 | Assign the role to test user and log in as that user. | Login succeeds. |
| 3 | Locate the Timesheets item in the main navigation. | Timesheets nav item is visible. |
| 4 | Open WO-300 and view its timesheets. | Time entries are visible in read-only form. |
| 5 | Attempt to change an entry's hours. | No edit controls are available; entries cannot be modified. |

**Expected Final Result:** A Timesheets View-only user can view timesheets from WOs read-only and cannot edit them.

---

### CR-TIME-002 — Timesheets Edit user can adjust hours and manage attendance

| Field | Value |
|---|---|
| **Related Jira** | SV-7516 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | Custom role with Timesheets: View = ON, Edit = ON assigned to a test user. |
| **Test Data** | Role "TIME Edit"; test user timeedit@test; WO-300 with time entries; staff member "Tech A" with an attendance record |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Timesheets Edit user. | Login succeeds; Timesheets nav visible. |
| 2 | Open WO-300 timesheets and adjust an entry's hours; save. | Hours are updated and persisted. |
| 3 | Open the timesheet activities report and edit an entry there. | The entry can be edited from the report and saved. |
| 4 | Adjust attendance for "Tech A" (another staff member). | Attendance edit succeeds; the Edit permission covers managing attendance for all staff. |

**Expected Final Result:** A Timesheets Edit user can adjust hours and manage attendance for all staff, from both WOs and the timesheet activities report.

---

### CR-TIME-003 — Cascade: enabling Timesheets Edit auto-enables View

| Field | Value |
|---|---|
| **Related Jira** | SV-7516 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | New/edited custom role with Timesheets View and Edit both OFF. |
| **Test Data** | Role "TIME Edit Cascade" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the role's Timesheets permissions with View and Edit both OFF. | Both OFF. |
| 2 | Toggle Timesheets: Edit = ON. | View automatically turns ON. |
| 3 | Save the role. | Role saves with View = ON, Edit = ON. |

**Expected Final Result:** Enabling Timesheets Edit auto-enables Timesheets View.

---

### CR-TIME-004 — Cascade: disabling Timesheets View disables Edit

| Field | Value |
|---|---|
| **Related Jira** | SV-7516 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | Custom role with Timesheets: View = ON, Edit = ON. |
| **Test Data** | Role "TIME Full" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the role with Timesheets View = ON, Edit = ON. | Both ON. |
| 2 | Toggle Timesheets: View = OFF. | Edit automatically turns OFF. |
| 3 | Save the role. | Role saves with View = OFF, Edit = OFF. |

**Expected Final Result:** Disabling Timesheets View cascades OFF to Edit.

---

### CR-TIME-005 — Timesheets View OFF hides the Timesheets nav

| Field | Value |
|---|---|
| **Related Jira** | SV-7516 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Custom role with Timesheets: View = OFF and Reports = OFF, assigned to a test user. |
| **Test Data** | Role "TIME No Access / No Reports"; test user notime@test |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create/pick role with Timesheets View = OFF and Reports = OFF. | Edit is OFF (cascade). |
| 2 | Assign role to test user and log in as that user. | Login succeeds. |
| 3 | Inspect the main navigation. | No Timesheets nav item is present. |
| 4 | Attempt to reach timesheets via a direct URL (if known). | User cannot access the Timesheets area. |

**Expected Final Result:** With Timesheets View OFF (and Reports OFF), the Timesheets nav is hidden and the area is inaccessible.

---

### CR-TIME-006 — Timesheets View OFF but Reports ON still shows the timesheet activities report

| Field | Value |
|---|---|
| **Related Jira** | SV-7516 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | Custom role with Timesheets: View = OFF but Reports = ON, assigned to a test user. |
| **Test Data** | Role "TIME OFF / Reports ON"; test user timereports@test |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Assign the role (Timesheets View OFF, Reports ON) and log in as the user. | Login succeeds. |
| 2 | Inspect the main navigation. | No dedicated Timesheets nav item (Timesheets View is OFF). |
| 3 | Open the Reports area. | Reports area is accessible. |
| 4 | Locate and open the timesheet activities report. | The timesheet activities report is available and displays timesheet activity data. |

**Expected Final Result:** With Timesheets View OFF but Reports ON, the user still sees the timesheet activities report under Reports even though the Timesheets nav is hidden.

---

### CR-TIME-007 — Clock in/out always works even with Timesheets OFF

| Field | Value |
|---|---|
| **Related Jira** | SV-7516 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | Custom role with Timesheets: View = OFF, Edit = OFF (and Reports OFF), assigned to a test user whose staff record permits clocking. |
| **Test Data** | Role "TIME No Access"; test user notime@test |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the user with Timesheets fully OFF. | Login succeeds; no Timesheets nav. |
| 2 | Locate the clock in control. | Clock in control is available regardless of Timesheets permission. |
| 3 | Clock in. | Clock-in succeeds and is recorded. |
| 4 | Clock out. | Clock-out succeeds and is recorded. |

**Expected Final Result:** All users can always clock in/out regardless of the Timesheets permission (even fully OFF).

---

### CR-TIME-008 — Confirm no Delete action exists for Timesheets

| Field | Value |
|---|---|
| **Related Jira** | SV-7516 |
| **Priority** | Medium |
| **Type** | Negative |
| **Preconditions** | Admin editing a custom role; a Timesheets Edit user for the UI check. |
| **Test Data** | Role "TIME Full"; test user timeedit@test; WO-300 with time entries |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | In Settings → Roles, open the Timesheets permission group for any role. | Only View and Edit toggles exist; there is NO Delete toggle for Timesheets. |
| 2 | Log in as a Timesheets Edit user and open WO-300 timesheets. | Entries are visible and editable. |
| 3 | Look for a delete action on a time entry. | No Delete action is offered for timesheet entries. |

**Expected Final Result:** Timesheets exposes only View and Edit; no Delete permission or delete action exists.

---

### CR-TIME-009 — Out-of-scope: staff-record settings are not governed by the Timesheets role

| Field | Value |
|---|---|
| **Related Jira** | SV-7516 |
| **Priority** | Low |
| **Type** | Negative |
| **Preconditions** | A staff record accessible for inspection; a custom role with any Timesheets setting. |
| **Test Data** | Staff record "Tech A" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open "Tech A" staff record and locate "Appears on technician schedule". | This setting is controlled by the staff member's department assignment — NOT by the Timesheets role. |
| 2 | Locate "Can clock into WO line tasks" on the staff record. | This is controlled by the Time Clock setting on the staff record — NOT by the Timesheets role. |
| 3 | Change the Timesheets permission on the user's role and re-check both settings. | Neither setting changes as a result of the Timesheets permission; they remain independent of the role. |

**Expected Final Result:** "Appears on technician schedule" (department-driven) and "Can clock into WO line tasks" (Time Clock setting) are independent of the Timesheets permission model.

---

### CR-TIME-010 — Regression (SV-8051): Timesheets View-only user can log in and reach timesheets

| Field | Value |
|---|---|
| **Related Jira** | SV-8051 |
| **Priority** | Critical |
| **Type** | Regression |
| **Preconditions** | Custom role with Timesheets: View = ON only, assigned to a test user. (Bug: this role previously showed "Access Restricted".) |
| **Test Data** | Role "TIME View Only"; test user timeview@test; WO-300 with time entries |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Assign the Timesheets View-only role to the test user. | Role assigned; user forced to log out. |
| 2 | Log in as the Timesheets View-only user. | Login succeeds; NO "Access Restricted" page appears. |
| 3 | Confirm the landing/home loads normally. | User reaches the application without an access error. |
| 4 | Open Timesheets (via nav or from WO-300). | Timesheets load and display entries read-only. |

**Expected Final Result:** A Timesheets View-only user logs in without an "Access Restricted" error and can reach timesheets (SV-8051 fixed).

---
