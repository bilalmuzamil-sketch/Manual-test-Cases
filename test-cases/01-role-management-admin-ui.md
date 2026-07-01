# Role Management — Administration UI (Roles, Permissions, Staff Assignment)

> **Epic:** [SV-7388 – Custom Roles and Permissions](https://shopview.atlassian.net/browse/SV-7388)
> **Spec:** [Custom Roles and Permissions (Confluence)](https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions)

**Scope:** Manual QA test cases for the administrative UI of the Custom Roles and Permissions feature: the Roles & Permissions list page, the Create/Edit Custom Role editor (including CRUD cascade and dependency enforcement), role deletion rules, the read-only Permission Summary, the Financial Data confirmation modal, and Staff-page role assignment with forced logout. Covers stories SV-7499 through SV-7505.

## Prerequisites
- A ShopView tenant with the Custom Roles and Permissions feature enabled.
- An **Administrator** account with the **App Settings** permission (able to reach Administration menus).
- Access to **Administration > Roles and Permissions** and **Administration > Staff**.
- At least the 12 built-in **System Roles** present (including **Administrator**, **Office**, and **Time Clock**).
- Ability to create at least one secondary test user for reassignment/forced-logout scenarios (a second browser or incognito session is helpful).
- Optional: at least one pre-existing **Custom Role** with 0 users and one with 1+ users assigned, or the ability to create them during testing.

## Test Cases

### CR-ROLEMGMT-001 — Roles & Permissions list page renders all columns

| Field | Value |
|---|---|
| **Related Jira** | SV-7499 |
| **Priority** | High |
| **Type** | UI |
| **Preconditions** | Logged in as Administrator. At least one Custom Role exists (created from a template) plus the 12 system roles. |
| **Test Data** | Existing custom role e.g. "Front Desk Lite" created from template "Office". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to Administration > Roles and Permissions. | The Roles & Permissions list page loads without error. |
| 2 | Inspect the table header row. | Columns are present in order: Role Name, Type, Template, Description, Users Assigned, Actions. |
| 3 | Inspect a system role row (e.g., Administrator). | Type shows "System"; Template shows "—"; Users Assigned shows a numeric count; Description is shown. |
| 4 | Inspect a custom role row (e.g., "Front Desk Lite"). | Type shows "Custom"; Template shows the source template name ("Office"); Users Assigned shows a numeric count. |
| 5 | Locate the page-level action control. | A "Create Custom Role" button is visible and enabled. |

**Expected Final Result:** The list page displays every role with all six columns correctly populated, distinguishing System vs Custom rows, and exposes the Create Custom Role button.

---

### CR-ROLEMGMT-002 — System badge shown on system roles only

| Field | Value |
|---|---|
| **Related Jira** | SV-7499 |
| **Priority** | Medium |
| **Type** | UI |
| **Preconditions** | Logged in as Administrator with the Roles & Permissions list page (Administration > Roles and Permissions) open. |
| **Test Data** | System role "Administrator"; at least one custom role (e.g., "Front Desk Lite"). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Locate the "Administrator" (system) role row and inspect its Role Name cell. | A "System" badge/label is displayed inline next to the role name. |
| 2 | Locate a custom role row (e.g., "Front Desk Lite") and inspect its Role Name cell. | No "System" badge is displayed next to the custom role name. |
| 3 | Cross-check every visible row's badge against its Type column value. | Each row with a System badge shows Type = System, and each custom row shows Type = Custom with no badge. |

**Expected Final Result:** The System badge appears exclusively on system roles and is consistent with the Type column.

---

### CR-ROLEMGMT-003 — Action availability by role type (Edit / Delete / View Permissions)

| Field | Value |
|---|---|
| **Related Jira** | SV-7499 |
| **Priority** | High |
| **Type** | UI |
| **Preconditions** | Logged in as Administrator; list page open with system roles (including Office and Time Clock) and at least one custom role. |
| **Test Data** | Editable system role (e.g., Parts Manager); Office; Time Clock; a custom role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Inspect the Actions column for an editable system role (not Office/Time Clock). | Edit and View Permissions are available; Delete is absent or disabled. |
| 2 | Inspect the Actions for the Office role. | View Permissions is available; the Edit action opens a read-only summary rather than the editor; Delete is absent or disabled. |
| 3 | Inspect the Actions for the Time Clock role. | Same as Office: read-only summary on Edit; no active Delete. |
| 4 | Inspect the Actions for a custom role. | Edit, Delete, and View Permissions are all available (Delete subject to assignment rules). |
| 5 | Attempt to trigger Delete on any system role. | Delete is not actionable (disabled or not present) for every system role. |

**Expected Final Result:** Edit/Delete/View Permissions actions are correctly enabled or disabled per role type: system roles are non-deletable, Office/Time Clock are read-only, custom roles are fully editable and deletable.

---

### CR-ROLEMGMT-004 — View Permissions opens read-only summary from the list page

| Field | Value |
|---|---|
| **Related Jira** | SV-7499, SV-7503 |
| **Priority** | Medium |
| **Type** | UI |
| **Preconditions** | Logged in as Administrator; list page open. |
| **Test Data** | Any role (system or custom). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Click "View Permissions" in the Actions column for a role. | A read-only Permission Summary dialog opens for that role. |
| 2 | Attempt to modify any value in the dialog. | No control is editable; the dialog is view-only. |
| 3 | Close the dialog. | The dialog closes and the list page is unchanged. |

**Expected Final Result:** View Permissions on the list page opens a read-only Permission Summary for the selected role.

---

### CR-ROLEMGMT-005 — Create Custom Role: happy path end-to-end

| Field | Value |
|---|---|
| **Related Jira** | SV-7500 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | Logged in as Administrator; list page open. |
| **Test Data** | Template: "Technician"; Name: "Senior Tech QA"; Description: "Test-created custom role". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Click "Create Custom Role". | The create flow opens on the Template Selection step. |
| 2 | Select one of the 12 system templates ("Technician") and continue. | Template is selected; flow advances to Role Details with settings pre-filled from the template. |
| 3 | Enter Name "Senior Tech QA" and Description "Test-created custom role"; continue. | Flow advances to the Permission Editor. |
| 4 | Review the Permission Editor (CRUD grid, WO sub-settings, Parts Department, Invoicing, Timesheets, Page Access toggles, Settings, View Mode, Cross-Cutting toggles) and adjust one permission. | The editor shows all sections; the adjusted permission updates. |
| 5 | Click Save. | Validation passes; the role is saved and the user returns to the list page. |
| 6 | Locate the new role in the list. | "Senior Tech QA" appears with Type = Custom and Template = Technician. |

**Expected Final Result:** A new custom role is created via the four-step flow and appears in the list with the correct Type and source Template.

---

### CR-ROLEMGMT-006 — Template selection pre-fills all settings

| Field | Value |
|---|---|
| **Related Jira** | SV-7500 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Logged in as Administrator; Create Custom Role flow open. |
| **Test Data** | Template with a known permission profile (e.g., "Parts Manager"). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | On Template Selection, choose a template with a distinctive profile ("Parts Manager"). | Template is highlighted/selected; 12 templates are available to choose from. |
| 2 | Advance to the Permission Editor. | All permissions (CRUD grid, toggles, view mode, etc.) are pre-populated to match the chosen template's defaults, not blank. |
| 3 | Complete Name and save; then open View Permissions for the new role. | The saved role retains the template reference and the pre-filled values as adjusted. |

**Expected Final Result:** Choosing a template pre-fills every setting from that template and records it as the role's source template.

---

### CR-ROLEMGMT-007 — Create Custom Role blocked when name is blank

| Field | Value |
|---|---|
| **Related Jira** | SV-7500 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Logged in as Administrator; Create Custom Role flow open; a template selected. |
| **Test Data** | Name: (blank). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | On Role Details, leave the Name field empty. | Name is required (indicated as such). |
| 2 | Attempt to advance/save. | Save/advance is blocked; a validation message indicates the name is required. |
| 3 | Confirm no role is created. | Returning to the list shows no new blank-named role. |

**Expected Final Result:** A role with a blank name cannot be created; validation blocks the save.

---

### CR-ROLEMGMT-008 — Create Custom Role blocked on duplicate name

| Field | Value |
|---|---|
| **Related Jira** | SV-7500 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Logged in as Administrator; an existing role named "Senior Tech QA" exists (e.g., from CR-ROLEMGMT-005). |
| **Test Data** | Name: "Senior Tech QA" (duplicate). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Start Create Custom Role, select a template, and enter Name "Senior Tech QA". | The name matches an existing role. |
| 2 | Attempt to save. | Save is blocked with a validation message indicating the name must be unique. |
| 3 | Change the name to a unique value and save. | The role saves successfully. |

**Expected Final Result:** Duplicate role names are rejected with a uniqueness validation error; a unique name succeeds.

---

### CR-ROLEMGMT-009 — CRUD cascade enabling (View ← Edit ← Delete)

| Field | Value |
|---|---|
| **Related Jira** | SV-7500 |
| **Priority** | Critical |
| **Type** | Dependency |
| **Preconditions** | Logged in as Administrator; Permission Editor open (create or edit); a permission area with all CRUD off. |
| **Test Data** | Any CRUD area (e.g., Work Orders) starting with View/Edit/Delete all OFF. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | In an area with all CRUD OFF, enable **Edit**. | Edit turns ON and View auto-enables. |
| 2 | Reset the area to all OFF, then enable **Delete**. | Delete turns ON and both Edit and View auto-enable. |
| 3 | Confirm the auto-enabled checkboxes reflect in the grid immediately. | The dependent checkboxes visibly become checked without a page reload. |

**Expected Final Result:** Enabling Edit cascades to View; enabling Delete cascades to Edit and View.

---

### CR-ROLEMGMT-010 — CRUD cascade disabling (Delete → Edit → View)

| Field | Value |
|---|---|
| **Related Jira** | SV-7500 |
| **Priority** | Critical |
| **Type** | Dependency |
| **Preconditions** | Logged in as Administrator; Permission Editor open; a CRUD area with View/Edit/Delete all ON. |
| **Test Data** | Any CRUD area (e.g., Work Orders) starting with all CRUD ON. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | In an area with all CRUD ON, disable **Edit**. | Edit turns OFF and Delete auto-disables; View remains ON. |
| 2 | Reset to all ON, then disable **View**. | View turns OFF and both Edit and Delete auto-disable. |
| 3 | Confirm the state after each action. | Downstream checkboxes update immediately and consistently. |

**Expected Final Result:** Disabling View disables Edit and Delete; disabling Edit disables Delete — cascade works in the downward direction.

---

### CR-ROLEMGMT-011 — Parts Department OFF hides its three children (slide)

| Field | Value |
|---|---|
| **Related Jira** | SV-7500 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | Logged in as Administrator; Permission Editor open with Parts Department ON and its 3 children visible. |
| **Test Data** | Parts Department parent toggle. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | With Parts Department ON, confirm its 3 child settings are visible. | The 3 child controls are shown. |
| 2 | Toggle Parts Department OFF. | The 3 child settings hide with a slide transition. |
| 3 | Toggle Parts Department back ON. | The 3 child settings reappear (slide) and are editable again. |

**Expected Final Result:** Turning Parts Department off hides its three children with a slide transition; turning it back on restores them.

---

### CR-ROLEMGMT-012 — Settings OFF hides its six sub-settings (slide)

| Field | Value |
|---|---|
| **Related Jira** | SV-7500 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | Logged in as Administrator; Permission Editor open with Settings parent ON and its 6 sub-toggles visible. |
| **Test Data** | Settings parent toggle. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | With Settings ON, confirm its 6 sub-settings are visible. | All 6 sub-toggles are shown. |
| 2 | Toggle Settings OFF. | The 6 sub-settings hide with a slide transition. |
| 3 | Toggle Settings back ON. | The 6 sub-settings reappear and are editable. |

**Expected Final Result:** Turning Settings off hides its six sub-settings with a slide transition; turning it on restores them.

---

### CR-ROLEMGMT-013 — See Financial Data OFF disables Part Sales & Invoicing with explanatory note

| Field | Value |
|---|---|
| **Related Jira** | SV-7500 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | Logged in as Administrator; Permission Editor open; "See Financial Data" currently ON. |
| **Test Data** | See Financial Data cross-cutting toggle. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Confirm See Financial Data is ON and Part Sales & Invoicing controls are enabled. | Both areas are enabled/interactive. |
| 2 | Turn See Financial Data OFF. | Part Sales and Invoicing become disabled, accompanied by an explanatory note tying them to See Financial Data. |
| 3 | Turn See Financial Data back ON. | Part Sales and Invoicing become enabled again. |

**Expected Final Result:** Disabling See Financial Data disables Part Sales and Invoicing and shows an explanatory note; re-enabling restores them.

---

### CR-ROLEMGMT-014 — WO sub-settings visible but greyed when WO View OFF

| Field | Value |
|---|---|
| **Related Jira** | SV-7500 |
| **Priority** | Medium |
| **Type** | UI |
| **Preconditions** | Logged in as Administrator. Open Administration > Roles and Permissions, click Edit (or Create Custom Role) to open the Permission Editor, and scroll to the Work Orders section. |
| **Test Data** | A custom role open in the editor; the Work Orders "View" toggle and its sub-settings (Review Work Orders, Pick Parts, Order Parts). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | In the Work Orders section, set the "View" toggle ON. | The WO sub-settings (Review Work Orders, Pick Parts, Order Parts) are displayed in full colour and each toggle can be clicked and changed. |
| 2 | Set the Work Orders "View" toggle OFF. | The same WO sub-settings remain on screen (not hidden) but render greyed/dimmed, and clicking their toggles has no effect (disabled). |
| 3 | Set the Work Orders "View" toggle back ON. | The WO sub-settings return to full colour and become clickable again, retaining their previous ON/OFF selections. |

**Expected Final Result:** The WO sub-settings stay visible at all times; they appear greyed out and disabled (not removed) while WO View is OFF, and become interactive again when WO View is ON.

---

### CR-ROLEMGMT-015 — Financial Data Confirmation Modal — Part Sales, Confirm

| Field | Value |
|---|---|
| **Related Jira** | SV-7504 |
| **Priority** | Critical |
| **Type** | Dependency |
| **Preconditions** | Logged in as Administrator; Permission Editor open; See Financial Data is OFF. |
| **Test Data** | Part Sales CRUD checkbox (e.g., Part Sales View). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | With See Financial Data OFF, enable a Part Sales CRUD checkbox. | A confirmation modal appears reading "Part Sales requires 'See Financial Data' to be enabled. Enable it?" |
| 2 | Click Confirm. | See Financial Data auto-enables and the Part Sales checkbox is applied (stays checked). |
| 3 | Inspect See Financial Data and the Part Sales checkbox. | See Financial Data is ON; the Part Sales checkbox is ON. |

**Expected Final Result:** Confirming the modal auto-enables See Financial Data and applies the Part Sales checkbox.

---

### CR-ROLEMGMT-016 — Financial Data Confirmation Modal — Part Sales, Cancel

| Field | Value |
|---|---|
| **Related Jira** | SV-7504 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | Logged in as Administrator; Permission Editor open; See Financial Data is OFF. |
| **Test Data** | Part Sales CRUD checkbox. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | With See Financial Data OFF, enable a Part Sales CRUD checkbox. | The confirmation modal appears with the Part Sales message. |
| 2 | Click Cancel. | The modal closes; the Part Sales checkbox reverts to OFF. |
| 3 | Inspect See Financial Data. | See Financial Data remains OFF. |

**Expected Final Result:** Cancelling the modal reverts the Part Sales checkbox and leaves See Financial Data OFF.

---

### CR-ROLEMGMT-017 — Financial Data Confirmation Modal — Invoicing, Confirm

| Field | Value |
|---|---|
| **Related Jira** | SV-7504 |
| **Priority** | Critical |
| **Type** | Dependency |
| **Preconditions** | Logged in as Administrator; Permission Editor open; See Financial Data is OFF. |
| **Test Data** | Invoicing CRUD checkbox. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | With See Financial Data OFF, enable an Invoicing CRUD checkbox. | A confirmation modal appears reading "Invoicing requires 'See Financial Data' to be enabled. Enable it?" |
| 2 | Click Confirm. | See Financial Data auto-enables and the Invoicing checkbox is applied. |
| 3 | Inspect both controls. | See Financial Data is ON; the Invoicing checkbox is ON. |

**Expected Final Result:** Confirming the modal for Invoicing auto-enables See Financial Data and applies the Invoicing checkbox.

---

### CR-ROLEMGMT-018 — Financial Data Confirmation Modal — Invoicing, Cancel

| Field | Value |
|---|---|
| **Related Jira** | SV-7504 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | Logged in as Administrator; Permission Editor open; See Financial Data is OFF. |
| **Test Data** | Invoicing CRUD checkbox. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | With See Financial Data OFF, enable an Invoicing CRUD checkbox. | The confirmation modal appears with the Invoicing message. |
| 2 | Click Cancel. | The modal closes; the Invoicing checkbox reverts to OFF. |
| 3 | Inspect See Financial Data. | See Financial Data remains OFF. |

**Expected Final Result:** Cancelling the modal reverts the Invoicing checkbox and leaves See Financial Data OFF.

---

### CR-ROLEMGMT-019 — Edit an existing custom role and save changes

| Field | Value |
|---|---|
| **Related Jira** | SV-7501 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | Logged in as Administrator; at least one custom role exists. |
| **Test Data** | Custom role "Senior Tech QA"; change Description and one permission. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | On the list page, click Edit for the custom role. | The Permission Editor opens pre-loaded with the role's current settings (no Template Selection step on edit). |
| 2 | Change the Description and toggle one permission (observe cascade if applicable). | Changes register; cascade/dependency rules apply the same as in create. |
| 3 | Click Save. | Changes are validated and saved; user returns to the list. |
| 4 | Reopen the role via Edit or View Permissions. | The changed Description and permission persist. |

**Expected Final Result:** An existing custom role loads into the editor, edits are saved with the same enforcement rules, and changes persist.

---

### CR-ROLEMGMT-020 — Edit an editable system role

| Field | Value |
|---|---|
| **Related Jira** | SV-7501 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Logged in as Administrator; an editable system role exists (any system role except Office and Time Clock). |
| **Test Data** | System role e.g. "Parts Manager"; toggle one non-critical permission. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Click Edit for an editable system role (not Office/Time Clock). | The Permission Editor opens with the role's settings. |
| 2 | Change one permission and observe cascade behavior. | The same cascade/dependency enforcement applies as for custom roles. |
| 3 | Save. | Changes save successfully. |
| 4 | Confirm the role still shows Type = System and its System badge. | The role remains a system role after editing. |

**Expected Final Result:** Editable system roles (all except Office and Time Clock) can be edited via the same editor with the same enforcement, and remain system roles.

---

### CR-ROLEMGMT-021 — Office and Time Clock open read-only summary (not editable)

| Field | Value |
|---|---|
| **Related Jira** | SV-7501, SV-7503 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Logged in as Administrator; list page open. |
| **Test Data** | Office role; Time Clock role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Click Edit (or the equivalent) for the Office role. | A read-only Permission Summary opens; no editable controls are presented. |
| 2 | Attempt to change any value in the Office summary. | Nothing is editable. |
| 3 | Repeat for the Time Clock role. | Time Clock also opens read-only with no editable controls. |

**Expected Final Result:** Office and Time Clock cannot be edited; both open a read-only summary instead of the editor.

---

### CR-ROLEMGMT-022 — Administrator cannot be edited to lose Admin page access

| Field | Value |
|---|---|
| **Related Jira** | SV-7501 |
| **Priority** | Critical |
| **Type** | Negative |
| **Preconditions** | Logged in as Administrator; Administrator role opened in the editor. |
| **Test Data** | Administrator role; attempt to disable access to Admin pages. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the Administrator role in the Permission Editor. | The editor loads; the Administrator is editable for non-admin-access settings. |
| 2 | Attempt to disable/remove the Admin pages access permission. | The action is blocked or prevented — Administrator cannot be edited to lose access to the Admin pages. |
| 3 | Change a different (non-admin-access) permission and save. | Other edits are allowed and save successfully. |

**Expected Final Result:** The Administrator role cannot be modified to lose Admin page access, while all other settings remain editable.

---

### CR-ROLEMGMT-023 — Delete a custom role with 0 users assigned

| Field | Value |
|---|---|
| **Related Jira** | SV-7502 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Logged in as Administrator; a custom role with 0 users assigned exists. |
| **Test Data** | Custom role with Users Assigned = 0. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Confirm the target custom role shows Users Assigned = 0. | Users Assigned count is 0. |
| 2 | Click Delete in the Actions column. | A confirmation dialog appears. |
| 3 | Confirm the deletion. | The role is deleted and disappears from the list. |
| 4 | Refresh/re-check the list. | The role is no longer present. |

**Expected Final Result:** A custom role with no assigned users is deleted after confirmation and removed from the list.

---

### CR-ROLEMGMT-024 — Delete blocked for a custom role with users assigned

| Field | Value |
|---|---|
| **Related Jira** | SV-7502 |
| **Priority** | Critical |
| **Type** | Negative |
| **Preconditions** | Logged in as Administrator; a custom role with 1+ users assigned exists. |
| **Test Data** | Custom role with Users Assigned = N (N ≥ 1). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Confirm the target custom role shows Users Assigned ≥ 1. | Users Assigned count is 1 or more. |
| 2 | Click Delete in the Actions column. | A "Cannot Delete" modal appears reading "This role is assigned to N user(s). Reassign them to another role before deleting." with the actual count for N. |
| 3 | Observe the Delete button state in the modal. | The Delete button is disabled. |
| 4 | Reassign all users off the role (via Staff page), then retry Delete. | Once Users Assigned = 0, Delete proceeds via the standard confirmation and succeeds. |

**Expected Final Result:** Deletion is blocked with the "Cannot Delete" modal while users are assigned; after reassignment the role becomes deletable.

---

### CR-ROLEMGMT-025 — System roles are never deletable

| Field | Value |
|---|---|
| **Related Jira** | SV-7502, SV-7499 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Logged in as Administrator; list page open with system roles. |
| **Test Data** | Any system role (e.g., Administrator, Office, Technician). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Inspect the Actions column for several system roles. | No enabled Delete action is present for any system role. |
| 2 | Attempt to delete a system role by any available means. | Deletion cannot be initiated; the system role remains in the list. |

**Expected Final Result:** No system role can be deleted, regardless of assigned user count.

---

### CR-ROLEMGMT-026 — Permission Summary read-only view content and format

| Field | Value |
|---|---|
| **Related Jira** | SV-7503 |
| **Priority** | Medium |
| **Type** | UI |
| **Preconditions** | Logged in as Administrator with the Roles & Permissions list page (Administration > Roles and Permissions) open. |
| **Test Data** | A role known to have a mix of ON and OFF permissions (e.g., a custom role with Work Orders View ON and Parts Department OFF). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Click "View Permissions" in the Actions column for the mixed-permission role. | A read-only Permission Summary dialog opens listing the role's full permission set with each entry showing an ON or OFF indicator. |
| 2 | Locate one permission known to be ON and one known to be OFF. | The ON permission shows an ON/enabled indicator and the OFF permission shows an OFF/disabled indicator, each matching the role's configuration. |
| 3 | Attempt to change any indicator, then close the dialog. | No indicator or control responds to clicks (view-only); closing the dialog returns to the unchanged list page. |

**Expected Final Result:** The Permission Summary presents a role's complete permission set in a compact read-only ON/OFF layout.

---

### CR-ROLEMGMT-027 — Staff page role selector grouping (System vs Custom)

| Field | Value |
|---|---|
| **Related Jira** | SV-7505 |
| **Priority** | High |
| **Type** | UI |
| **Preconditions** | Logged in as Administrator; at least one custom role exists in addition to the 12 system roles. |
| **Test Data** | Any staff user; the 12 system roles plus one or more custom roles (e.g., "Front Desk Lite"). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Navigate to Administration > Staff, select a user, and open that user's role selector dropdown. | The role selector dropdown opens and displays the list of assignable roles. |
| 2 | Inspect how the options are grouped within the dropdown. | Options appear under two labelled group headings: "System Roles" (containing the 12 system roles) and "Custom Roles". |
| 3 | Verify each existing custom role appears under the Custom Roles heading and each system role under System Roles. | Every custom role (e.g., "Front Desk Lite") is listed under Custom Roles and every system role under System Roles, with no role in the wrong group. |

**Expected Final Result:** The Staff-page role selector groups roles into System Roles (12) and Custom Roles.

---

### CR-ROLEMGMT-028 — View Permissions from the Staff page

| Field | Value |
|---|---|
| **Related Jira** | SV-7505, SV-7503 |
| **Priority** | Medium |
| **Type** | UI |
| **Preconditions** | Logged in as Administrator with Administration > Staff open and a user selected. |
| **Test Data** | A specific role to select in the user's role selector (e.g., "Front Desk Lite"). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | In the selected user's role selector, choose a role (e.g., "Front Desk Lite"). | The chosen role appears as the selected/highlighted value in the role selector. |
| 2 | Click the "View Permissions" button next to the role selector. | A read-only Permission Summary dialog opens showing the ON/OFF permission set for the selected role. |
| 3 | Compare the summary contents to the same role's summary opened from the Roles & Permissions list page, then close the dialog. | The permission entries and ON/OFF states match the list-page summary exactly, no control is editable, and closing returns to the Staff page unchanged. |

**Expected Final Result:** The Staff page exposes a View Permissions button that opens the read-only summary for the selected role.

---

### CR-ROLEMGMT-029 — Changing a user's role forces logout; new role applies on next login

| Field | Value |
|---|---|
| **Related Jira** | SV-7505 |
| **Priority** | Critical |
| **Type** | Dependency |
| **Preconditions** | Logged in as Administrator; a second test user logged in on a separate session/browser. |
| **Test Data** | Test user with an initial role; a different target role to assign. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Confirm the test user is actively logged in on their own session. | The test user has an active session. |
| 2 | As Administrator, change that user's role on the Staff page and save. | The role change is saved. |
| 3 | Observe the test user's session. | The test user is forcibly logged out. |
| 4 | Have the test user log back in and check their access. | On next login the new role's permissions take effect. |

**Expected Final Result:** Changing a user's role forces that user to log out, and the new role's permissions apply on their next login.

---
