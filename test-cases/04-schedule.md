# Schedule — Custom Roles and Permissions Test Cases

> **Epic:** [SV-7388 – Custom Roles and Permissions](https://shopview.atlassian.net/browse/SV-7388)
> **Spec:** [Custom Roles and Permissions (Confluence)](https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions)

**Scope:** Verifies that the Schedule area (area code SCHED, permission key `schedule`, SV-7510) correctly enforces View / Edit / Delete permissions on the schedule/calendar page, including CRUD cascade behavior, nav visibility, and the fact that the schedule is a shared resource showing all technicians' appointments (no "own only" filtering). Includes regression coverage for SV-8047 and SV-8048.

## Prerequisites
- Access to a ShopView environment (staging/QA) with admin rights to create Custom Roles and assign them to users.
- Ability to create/edit Custom Roles under Settings → Roles & Permissions.
- At least two test users available for role assignment (so the admin session stays logged in).
- Note: role changes force the affected user to log out; always re-log in as the test user after any role change.
- General cascade rule (applies to all CRUD areas): enabling **Edit** auto-enables **View**; enabling **Delete** auto-enables **Edit + View**; disabling **View** disables **Edit + Delete**; disabling **Edit** disables **Delete**. When **View is OFF**, the area's nav item is **hidden**.
- At least one Work Order (WO) and one technician/staff record exist for scheduling/assignment steps.

## Test Cases

### CR-SCHED-001 — Schedule View enabled shows Schedule nav and all technicians' appointments

| Field | Value |
|---|---|
| **Related Jira** | SV-7510 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | Custom role with Schedule: View = ON, Edit = OFF, Delete = OFF exists. At least two technicians have appointments on the calendar. |
| **Test Data** | Role "SCHED View Only"; test user schedview@test; two techs (Tech A, Tech B) each with ≥1 appointment |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create/pick custom role with Schedule: View = ON only. | Role saved; Edit and Delete remain OFF. |
| 2 | Assign the role to test user and log in as that user. | Login succeeds. |
| 3 | Locate the Schedule/Calendar item in the main navigation. | Schedule nav item is visible. |
| 4 | Open the Schedule page. | Calendar/schedule loads with appointments and technician assignments. |
| 5 | Inspect the appointments shown for Tech A and Tech B. | Appointments for ALL technicians are visible (shared resource); there is no "own only" filter limiting the view to a single technician. |

**Expected Final Result:** A Schedule View-only user can open the Schedule and see all technicians' appointments read-only.

---

### CR-SCHED-002 — Schedule View OFF hides the Schedule nav item

| Field | Value |
|---|---|
| **Related Jira** | SV-7510 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Custom role with Schedule: View = OFF (Edit/Delete therefore OFF via cascade). |
| **Test Data** | Role "SCHED No Access"; test user noschted@test |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create/pick custom role with Schedule: View = OFF. | Edit and Delete are also OFF (cascade). |
| 2 | Assign role to test user and log in as that user. | Login succeeds. |
| 3 | Inspect the main navigation. | No Schedule/Calendar nav item is present. |
| 4 | Attempt to reach the schedule via a direct URL (if known). | User cannot access the schedule page (blocked/redirected). |

**Expected Final Result:** With Schedule View OFF, the Schedule nav is hidden and the schedule is inaccessible.

---

### CR-SCHED-003 — Cascade: enabling Schedule Edit auto-enables View

| Field | Value |
|---|---|
| **Related Jira** | SV-7510 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | New/edited custom role with all Schedule CRUD OFF. |
| **Test Data** | Role "SCHED Edit Cascade" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the role's Schedule permissions with View/Edit/Delete all OFF. | All three OFF. |
| 2 | Toggle Schedule: Edit = ON. | View automatically turns ON as well. |
| 3 | Save the role. | Role saves with View = ON, Edit = ON, Delete = OFF. |

**Expected Final Result:** Enabling Schedule Edit auto-enables Schedule View.

---

### CR-SCHED-004 — Cascade: enabling Schedule Delete auto-enables Edit + View

| Field | Value |
|---|---|
| **Related Jira** | SV-7510 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | New/edited custom role with all Schedule CRUD OFF. |
| **Test Data** | Role "SCHED Delete Cascade" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the role's Schedule permissions with View/Edit/Delete all OFF. | All three OFF. |
| 2 | Toggle Schedule: Delete = ON. | Edit and View both automatically turn ON. |
| 3 | Save the role. | Role saves with View = ON, Edit = ON, Delete = ON. |

**Expected Final Result:** Enabling Schedule Delete auto-enables both Edit and View.

---

### CR-SCHED-005 — Cascade: disabling Schedule View disables Edit + Delete

| Field | Value |
|---|---|
| **Related Jira** | SV-7510 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | Custom role with Schedule: View = ON, Edit = ON, Delete = ON. |
| **Test Data** | Role "SCHED Full" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the role with Schedule View/Edit/Delete all ON. | All three ON. |
| 2 | Toggle Schedule: View = OFF. | Edit and Delete automatically turn OFF. |
| 3 | Save the role. | Role saves with View = OFF, Edit = OFF, Delete = OFF. |

**Expected Final Result:** Disabling Schedule View cascades OFF to Edit and Delete.

---

### CR-SCHED-006 — Cascade: disabling Schedule Edit disables Delete

| Field | Value |
|---|---|
| **Related Jira** | SV-7510 |
| **Priority** | Medium |
| **Type** | Dependency |
| **Preconditions** | Custom role with Schedule: View = ON, Edit = ON, Delete = ON. |
| **Test Data** | Role "SCHED Full" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the role with Schedule View/Edit/Delete all ON. | All three ON. |
| 2 | Toggle Schedule: Edit = OFF. | Delete automatically turns OFF; View stays ON. |
| 3 | Save the role. | Role saves with View = ON, Edit = OFF, Delete = OFF. |

**Expected Final Result:** Disabling Schedule Edit cascades OFF to Delete while View remains.

---

### CR-SCHED-007 — Schedule View-only user cannot create, drag, or delete appointments

| Field | Value |
|---|---|
| **Related Jira** | SV-7510 |
| **Priority** | Critical |
| **Type** | Negative |
| **Preconditions** | Custom role with Schedule: View = ON, Edit = OFF, Delete = OFF assigned to a test user. |
| **Test Data** | Role "SCHED View Only"; test user schedview@test; existing appointment "Appt-1" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Schedule View-only user and open the Schedule. | Calendar loads read-only. |
| 2 | Attempt to create a new appointment (new event / add button). | No create control is available, or the action is blocked/disabled. |
| 3 | Attempt to drag-and-drop an existing appointment to a new slot. | Drag-and-drop is disabled; the appointment cannot be moved. |
| 4 | Attempt to reassign a technician to a slot. | Assignment controls are unavailable/disabled. |
| 5 | Attempt to delete "Appt-1". | No delete control is available; deletion is not possible. |

**Expected Final Result:** A Schedule View-only user can view but cannot create, modify (drag/assign), or delete appointments.

---

### CR-SCHED-008 — Schedule Edit user can create appointments, assign techs, and drag-and-drop

| Field | Value |
|---|---|
| **Related Jira** | SV-7510 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | Custom role with Schedule: View = ON, Edit = ON, Delete = OFF assigned to a test user. |
| **Test Data** | Role "SCHED Edit"; test user schededit@test; Tech A; WO-100 |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Schedule Edit user and open the Schedule. | Calendar loads with create/edit controls available. |
| 2 | Create a new appointment in an open slot. | Appointment is created and persists on the calendar. |
| 3 | Assign Tech A to the new appointment slot. | Tech A is assigned and shown on the appointment. |
| 4 | Drag-and-drop the appointment to a different time slot. | Appointment moves and the new time is saved. |

**Expected Final Result:** A Schedule Edit user can create appointments, assign technicians, and reschedule via drag-and-drop.

---

### CR-SCHED-009 — Schedule Edit-not-Delete user cannot delete appointments

| Field | Value |
|---|---|
| **Related Jira** | SV-7510 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Custom role with Schedule: View = ON, Edit = ON, Delete = OFF assigned to a test user. |
| **Test Data** | Role "SCHED Edit"; test user schededit@test; existing appointment "Appt-2" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Schedule Edit (no Delete) user and open the Schedule. | Calendar loads with edit controls. |
| 2 | Open "Appt-2" and modify its details (e.g., time or notes). | Edit succeeds and is saved. |
| 3 | Look for a delete option on "Appt-2". | No delete control is available; the appointment cannot be removed. |

**Expected Final Result:** A Schedule Edit-without-Delete user can modify but not delete appointments.

---

### CR-SCHED-010 — Schedule Delete user can remove appointments

| Field | Value |
|---|---|
| **Related Jira** | SV-7510 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Custom role with Schedule: View = ON, Edit = ON, Delete = ON assigned to a test user. |
| **Test Data** | Role "SCHED Full"; test user schedfull@test; existing appointment "Appt-3" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Schedule Delete user and open the Schedule. | Calendar loads with full controls. |
| 2 | Open "Appt-3" and select Delete. | A delete/confirm control is available. |
| 3 | Confirm deletion. | "Appt-3" is removed from the schedule and no longer appears after refresh. |

**Expected Final Result:** A Schedule Delete user can permanently remove appointments.

---

### CR-SCHED-011 — Regression (SV-8047): Schedule View-only user can log in and reach the schedule

| Field | Value |
|---|---|
| **Related Jira** | SV-8047 |
| **Priority** | Critical |
| **Type** | Regression |
| **Preconditions** | Custom role with Schedule: View = ON only, assigned to a test user. (Bug: this role previously showed "Access Restricted" on login.) |
| **Test Data** | Role "SCHED View Only"; test user schedview@test |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Assign the Schedule View-only role to the test user. | Role assigned; user forced to log out. |
| 2 | Log in as the Schedule View-only user. | Login succeeds; NO "Access Restricted" page appears. |
| 3 | Confirm the landing/home loads normally. | User reaches the application without an access error. |
| 4 | Open the Schedule from the nav. | Schedule page loads and displays appointments read-only. |

**Expected Final Result:** A Schedule View-only user logs in without an "Access Restricted" error and can reach the schedule (SV-8047 fixed).

---

### CR-SCHED-012 — Regression (SV-8048): Schedule View + Create&Edit — new events persist and "Assign to existing WO" works

| Field | Value |
|---|---|
| **Related Jira** | SV-8048 |
| **Priority** | Critical |
| **Type** | Regression |
| **Preconditions** | Custom role with Schedule: View = ON, Edit (Create&Edit) = ON, assigned to a test user. (Bug: new events disappeared and "Assign to existing WO" failed.) |
| **Test Data** | Role "SCHED Edit"; test user schededit@test; existing WO-200 |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Schedule Create&Edit user and open the Schedule. | Calendar loads with create controls. |
| 2 | Create a new event/appointment and save it. | Event is created and remains visible after save. |
| 3 | Refresh the Schedule page. | The new event still appears (it does NOT disappear). |
| 4 | On a new or existing event, choose "Assign to existing WO" and select WO-200. | Assignment succeeds; the event is linked to WO-200 without error. |
| 5 | Reopen the event to confirm the WO link. | WO-200 is shown as the assigned work order. |

**Expected Final Result:** New schedule events persist after refresh and "Assign to existing WO" completes successfully (SV-8048 fixed).

---
