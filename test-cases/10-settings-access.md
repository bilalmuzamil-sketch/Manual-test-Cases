# Settings Access and Sub-Settings (SETTINGS)

> **Epic:** [SV-7388 – Custom Roles and Permissions](https://shopview.atlassian.net/browse/SV-7388)
> **Spec:** [Custom Roles and Permissions (Confluence)](https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions)

**Scope:** Verifies the Settings parent toggle that gates the entire Administration area (SV-7521) and each independent sub-setting beneath it, including the sensitive View/Manage Wages sub-setting (SV-7522). Confirms the parent-child gating, that App Settings gates Roles/Permissions and Staff management, editor behavior when the parent is toggled off, and the off→on persistence regression (SV-7999).

> **Note (discrepancy for awareness):** The spec intro says there are "6 sub-settings" but the settings table lists 7 (it adds Integrations and View/Manage Wages). Flag this to PM/QA lead to confirm the intended count. This note does not block execution.

## Prerequisites
- File `00-test-environment-and-setup.md` completed: test shop, Administrator account, and per-role test users exist.
- Ability to create/edit custom roles under Administration > Roles and Permissions and assign them to a test user via Administration > Staff.
- Two browsers (or one browser plus incognito): one for the Administrator to reconfigure roles, one for the test user. Changing a user's role forces that user to log out; new permissions apply on next login.
- To test any setting: create/pick a custom role with the toggles set as required, assign it to a test user, log in as that user, verify the effect, then reset to baseline.
- Sub-settings reference: **App Settings** (org name, business info, locale, branding; ALSO Roles & Permissions management and Staff/Workplaces management), **Service** (labor types, canned lines, asset types, departments, Digital Inspections), **Parts** (pricing matrices, categories, parts config), **Integrations** (QuickBooks, IBS, Open API), **Finance** (tax config, payment settings, payment methods), **Data Import** (bulk import of customers/vehicles/parts/records), **View/Manage Wages** (view/manage employee wage rates — sensitive). Each sub-setting is independent and requires the Settings parent ON.

## Test Cases

### CR-SETTINGS-001 — Settings parent OFF hides the entire Administration area

| Field | Value |
|---|---|
| **Related Jira** | SV-7521 |
| **Priority** | Critical |
| **Type** | Negative |
| **Preconditions** | Admin can edit roles; a spare test user is available. |
| **Test Data** | Custom role "QA Settings OFF" with the Settings parent toggle OFF (all sub-settings therefore inactive) but able to log in (Work Orders View ON); test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create "QA Settings OFF" with Settings OFF and Work Orders View ON. Save. | Role saved; sub-settings are unavailable/inactive because the parent is OFF. |
| 2 | Assign the role to the test user; save. | Assignment saved; test user forced to log out. |
| 3 | Log in as the test user. | Login succeeds. |
| 4 | Look at the navigation. | The Administration nav item is NOT visible. |
| 5 | Navigate directly to any Administration URL (e.g. App Settings, Roles and Permissions, Staff, Finance). | Access is denied/blocked — no Administration page loads. |

**Expected Final Result:** With the Settings parent OFF, the Administration nav is hidden and no Administration sub-page is reachable, even by direct URL. The parent toggle gates the whole area.

---

### CR-SETTINGS-002 — Settings parent ON with all sub-settings OFF shows Administration but no sub-sections

| Field | Value |
|---|---|
| **Related Jira** | SV-7521 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | Admin can edit roles. |
| **Test Data** | Custom role "QA Settings ON, subs OFF" with Settings parent ON and every sub-setting OFF; test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create the role with Settings ON and all sub-settings OFF. Save. | Role saved. |
| 2 | Assign to the test user; save. | User forced to log out. |
| 3 | Log in as the test user and look at the navigation. | The Administration nav item is visible (parent ON). |
| 4 | Open Administration and review the available sub-sections. | No sub-sections are accessible — App Settings, Service, Parts, Integrations, Finance, Data Import, and View/Manage Wages are all absent/blocked. |
| 5 | Direct-URL each Administration sub-page. | Each is blocked. |

**Expected Final Result:** The parent ON exposes the Administration area itself, but each sub-section requires its own sub-setting ON. With all subs OFF, no sub-section is reachable.

---

### CR-SETTINGS-003 — App Settings sub-setting ON grants exactly the App Settings section

| Field | Value |
|---|---|
| **Related Jira** | SV-7521 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Admin can edit roles. |
| **Test Data** | Custom role "QA App Settings ON" with Settings parent ON and only the App Settings sub-setting ON; test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create the role (Settings ON, App Settings ON, all other subs OFF). Assign to test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user and open Administration. | Administration nav visible; App Settings section is accessible. |
| 3 | Open App Settings and confirm org name, business info, locale, and branding are manageable. | App Settings content loads and is editable. |
| 4 | Confirm the other sub-sections (Service, Parts, Integrations, Finance, Data Import, View/Manage Wages) are NOT accessible, including by direct URL. | Only App Settings is reachable; the others are hidden/blocked. |

**Expected Final Result:** App Settings ON grants only the App Settings section; other sub-sections remain gated by their own toggles.

---

### CR-SETTINGS-004 — App Settings gates Roles and Permissions and Staff management

| Field | Value |
|---|---|
| **Related Jira** | SV-7521 |
| **Priority** | Critical |
| **Type** | Dependency |
| **Preconditions** | Admin can edit roles. |
| **Test Data** | Two roles: (A) "QA App Settings ON" = Settings ON + App Settings ON; (B) "QA App Settings OFF" = Settings ON + App Settings OFF (another sub such as Service ON). One test user cycled through both. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Assign role B (Settings ON, App Settings OFF) to the test user; save; log in as the user. | Administration nav visible (parent ON). |
| 2 | Attempt to open Administration > Roles and Permissions. | NOT accessible — hidden and blocked by direct URL. |
| 3 | Attempt to open Administration > Staff (and Workplaces). | NOT accessible — hidden and blocked by direct URL. |
| 4 | As Administrator, switch the test user to role A (App Settings ON); save; re-log-in as the user. | User forced to log out on change; new login applies role A. |
| 5 | Open Administration > Roles and Permissions. | Accessible — the roles list loads. |
| 6 | Open Administration > Staff. | Accessible — the staff list loads. |

**Expected Final Result:** Only users with the App Settings sub-setting ON can reach Roles and Permissions management and Staff/Workplaces management. Without App Settings, those areas are hidden and unreachable even though the Administration area is visible.

---

### CR-SETTINGS-005 — Service sub-setting ON/OFF grants/hides only the Service section

| Field | Value |
|---|---|
| **Related Jira** | SV-7521 |
| **Priority** | Medium |
| **Type** | Positive |
| **Preconditions** | Admin can edit roles. |
| **Test Data** | Custom role "QA Service ON" (Settings ON, Service ON, others OFF) and a variant with Service OFF; test user cycled through both. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Assign "QA Service ON" to the test user; save; log in as the user; open Administration. | Service section is accessible; labor types, canned lines, asset types, departments, and Digital Inspections are manageable. |
| 2 | Confirm all other sub-sections are hidden/blocked (including by direct URL). | Only Service is reachable. |
| 3 | As Administrator, set Service OFF for the role; save; re-log-in as the user. | User forced to log out on change. |
| 4 | Open Administration and look for the Service section; also try its direct URL. | Service section is hidden and blocked. |

**Expected Final Result:** The Service sub-setting grants exactly the Service section when ON and hides it when OFF, independent of other sub-settings.

---

### CR-SETTINGS-006 — Parts sub-setting ON/OFF grants/hides only the Parts settings section

| Field | Value |
|---|---|
| **Related Jira** | SV-7521 |
| **Priority** | Medium |
| **Type** | Positive |
| **Preconditions** | Admin can edit roles. |
| **Test Data** | Custom role "QA Parts Settings ON" (Settings ON, Parts ON, others OFF) and a Parts OFF variant; test user cycled through both. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Assign "QA Parts Settings ON" to the test user; save; log in as the user; open Administration. | Parts settings section is accessible; pricing matrices, categories, and parts config are manageable. |
| 2 | Confirm other sub-sections are hidden/blocked. | Only Parts settings is reachable. |
| 3 | As Administrator, set Parts OFF; save; re-log-in as the user. | User forced to log out. |
| 4 | Open Administration and look for Parts settings; try its direct URL. | Parts settings section is hidden and blocked. |

**Expected Final Result:** The Parts sub-setting grants exactly the Parts settings section when ON and hides it when OFF.

---

### CR-SETTINGS-007 — Integrations sub-setting ON/OFF grants/hides only the Integrations section

| Field | Value |
|---|---|
| **Related Jira** | SV-7521 |
| **Priority** | Medium |
| **Type** | Positive |
| **Preconditions** | Admin can edit roles. |
| **Test Data** | Custom role "QA Integrations ON" (Settings ON, Integrations ON, others OFF) and an Integrations OFF variant; test user cycled through both. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Assign "QA Integrations ON" to the test user; save; log in; open Administration. | Integrations section is accessible; QuickBooks, IBS, and Open API config are manageable. |
| 2 | Confirm other sub-sections are hidden/blocked. | Only Integrations is reachable. |
| 3 | As Administrator, set Integrations OFF; save; re-log-in. | User forced to log out. |
| 4 | Open Administration and look for Integrations; try its direct URL. | Integrations section is hidden and blocked. |

**Expected Final Result:** The Integrations sub-setting grants exactly the Integrations section when ON and hides it when OFF. (Integrations is one of the two sub-settings in the spec-count discrepancy — confirm it is intended.)

---

### CR-SETTINGS-008 — Finance sub-setting ON/OFF grants/hides only the Finance section

| Field | Value |
|---|---|
| **Related Jira** | SV-7521 |
| **Priority** | Medium |
| **Type** | Positive |
| **Preconditions** | Admin can edit roles. |
| **Test Data** | Custom role "QA Finance Settings ON" (Settings ON, Finance ON, others OFF) and a Finance OFF variant; test user cycled through both. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Assign "QA Finance Settings ON" to the test user; save; log in; open Administration. | Finance section is accessible; tax config, payment settings, and payment methods are manageable. |
| 2 | Confirm other sub-sections are hidden/blocked. | Only Finance is reachable. |
| 3 | As Administrator, set Finance OFF; save; re-log-in. | User forced to log out. |
| 4 | Open Administration and look for Finance; try its direct URL. | Finance section is hidden and blocked. |

**Expected Final Result:** The Finance sub-setting grants exactly the Finance settings section when ON and hides it when OFF.

---

### CR-SETTINGS-009 — Data Import sub-setting ON/OFF grants/hides only the Data Import section

| Field | Value |
|---|---|
| **Related Jira** | SV-7521 |
| **Priority** | Medium |
| **Type** | Positive |
| **Preconditions** | Admin can edit roles. |
| **Test Data** | Custom role "QA Data Import ON" (Settings ON, Data Import ON, others OFF) and a Data Import OFF variant; test user cycled through both. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Assign "QA Data Import ON" to the test user; save; log in; open Administration. | Data Import section is accessible; bulk import of customers/vehicles/parts/records is available. |
| 2 | Confirm other sub-sections are hidden/blocked. | Only Data Import is reachable. |
| 3 | As Administrator, set Data Import OFF; save; re-log-in. | User forced to log out. |
| 4 | Open Administration and look for Data Import; try its direct URL. | Data Import section is hidden and blocked. |

**Expected Final Result:** The Data Import sub-setting grants exactly the Data Import section when ON and hides it when OFF.

---

### CR-SETTINGS-010 — View/Manage Wages ON shows and enables employee wage rates

| Field | Value |
|---|---|
| **Related Jira** | SV-7522 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Admin can edit roles. The Staff area is reachable (requires App Settings — see CR-SETTINGS-004), since wage rates appear on staff/employee records. |
| **Test Data** | Custom role "QA Wages ON" with Settings ON, App Settings ON, and View/Manage Wages ON; test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create the role (Settings ON, App Settings ON, View/Manage Wages ON). Assign to test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user and open the staff/employee area where wage rates are shown. | Wage rate fields are VISIBLE for employees. |
| 3 | Edit an employee's wage rate and save. | The wage rate is editable and saves successfully. |

**Expected Final Result:** With View/Manage Wages ON, employee wage rates are visible and manageable. (View/Manage Wages is the second sub-setting in the spec-count discrepancy — confirm intended.)

---

### CR-SETTINGS-011 — View/Manage Wages OFF hides employee wage rates (sensitive data)

| Field | Value |
|---|---|
| **Related Jira** | SV-7522 |
| **Priority** | High |
| **Type** | Security |
| **Preconditions** | Admin can edit roles. |
| **Test Data** | Custom role "QA Wages OFF" with Settings ON, App Settings ON, and View/Manage Wages OFF; test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create the role (Settings ON, App Settings ON, View/Manage Wages OFF). Assign to test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user and open the staff/employee area. | Employee records load, but wage rate fields are NOT visible. |
| 3 | Open an individual employee record. | No wage rate value is shown or editable. |
| 4 | If the wage endpoint/URL is known, attempt to reach wage data directly. | Wage data is not returned. |

**Expected Final Result:** With View/Manage Wages OFF, employee wage rates are hidden everywhere they would otherwise appear and are not retrievable, protecting this sensitive data.

---

### CR-SETTINGS-012 — Editor slide-hides sub-settings when the Settings parent is toggled OFF

| Field | Value |
|---|---|
| **Related Jira** | SV-7521 |
| **Priority** | Medium |
| **Type** | UI |
| **Preconditions** | Logged in as Administrator with permission to edit roles. Open Administration > Roles and Permissions and edit a custom role, then scroll to the Settings section. |
| **Test Data** | A custom role open in the Roles and Permissions editor with the Settings parent toggle ON and at least one sub-setting ON. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | In the Settings section, confirm the Settings parent toggle is ON. | The sub-settings (App Settings, Service, Parts, Integrations, Finance, Data Import, View/Manage Wages) are displayed beneath the Settings parent. |
| 2 | Set the Settings parent toggle OFF. | The Settings sub-settings collapse out of view with an animated slide transition (not an instant removal), leaving only the Settings parent toggle visible. |
| 3 | Set the Settings parent toggle back ON. | The sub-settings slide back into view and show the same ON/OFF selections they had before collapsing. |

**Expected Final Result:** The editor animates a slide collapse of the Settings sub-settings when the parent is OFF and reveals them when the parent is ON, with prior selections preserved, matching the parent-child gating.

---

### CR-SETTINGS-013 — Regression: sub-setting selections persist across an off→on parent toggle in the editor (SV-7999)

| Field | Value |
|---|---|
| **Related Jira** | SV-7999 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Admin can edit roles. |
| **Test Data** | A custom role open in the editor with the Settings parent ON and a known subset of sub-settings ON (e.g. App Settings ON, Finance ON, others OFF). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, open a custom role and set Settings ON with App Settings ON and Finance ON (Service, Parts, Integrations, Data Import, View/Manage Wages OFF). Note the exact selections. | Selections set as noted. |
| 2 | Toggle the Settings parent OFF (sub-settings collapse/slide away). | Parent now OFF; sub-settings hidden. |
| 3 | Toggle the Settings parent back ON. | Sub-settings reappear. |
| 4 | Inspect the sub-setting toggles. | App Settings and Finance are still ON; the others are still OFF — the prior selections were NOT wiped. |
| 5 | Save the role and reopen it. | The persisted selections match (App Settings ON, Finance ON, rest OFF). |

**Expected Final Result:** Toggling the Settings parent off and back on preserves the previously chosen sub-setting selections, confirming SV-7999 remains fixed. Any wiped/reset sub-selections after an off→on toggle is a reopened defect.

---
