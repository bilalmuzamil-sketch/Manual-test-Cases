# Regression & Edge Cases

> **Epic:** [SV-7388 – Custom Roles and Permissions](https://shopview.atlassian.net/browse/SV-7388)
> **Spec:** [Custom Roles and Permissions (Confluence)](https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions)

**Scope:** Regression tests derived from real defects filed under the epic, focused on login access for minimal/View-only roles, server-side permission enforcement and security-bypass prevention, and dependency edge cases across inspections, parts, technician, reports, time clock, AP/AR, portals, and view-mode features. Each case describes the corrected (fixed) behavior so a QA engineer can confirm the defect no longer reproduces.

## Prerequisites
- Access to a ShopView tenant where you can create and edit **Custom Roles** (permission to manage roles).
- At least one test user account you can assign custom roles to and log in as; a second browser/incognito session is convenient for logging in as the test user while you keep an admin session open.
- Remember: **any role/permission change forces the affected user to log out.** After changing a role, the test user must log back in for the new permissions to take effect.
- Standard test workflow for each case below: (1) create a custom role with the described setting, (2) assign it to a test user, (3) log in as that user, (4) reproduce the scenario.
- Existing seeded data: at least one Work Order with lines, a customer, an asset, parts on lines (pick/order/return), a Schedule with events, Timesheets data, an in-progress and a completed Digital Inspection, catalog and inventory parts, special-order parts, an invoice with no payments and one with payments, and AP/AR data (AR Aging, vendor payments).
- Ability to inspect direct URLs and (optionally) network responses (browser devtools) for the security/bypass cases.

## Login / Access-Restricted

### CR-REG-001 — Work Orders View-only role can log in

| Field | Value |
|---|---|
| **Related Jira** | SV-7975 |
| **Priority** | Critical |
| **Type** | Regression |
| **Preconditions** | Custom role with Work Orders → View ON only (Create/Edit and Delete OFF), no other areas enabled. Assigned to test user. |
| **Test Data** | Role "WO View-only". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create role "WO View-only" with Work Orders → View ON, all else OFF. Assign to test user. | Role saves. |
| 2 | Log in as the test user. | Login succeeds. |
| 3 | Observe the landing page and top navigation. | User lands on an appropriate page (e.g., Work Orders list). **No "Access Restricted" wall.** Nav tabs are present. |

**Expected Final Result:** A Work Orders View-only user logs in successfully and is not blocked by an Access Restricted page.

---

### CR-REG-002 — WO View-only user opening a WO loads WO Lines

| Field | Value |
|---|---|
| **Related Jira** | SV-7976 |
| **Priority** | Critical |
| **Type** | Regression |
| **Preconditions** | Custom role with Work Orders → View ON only. Assigned to test user. At least one WO with lines. |
| **Test Data** | Role "WO View-only"; a WO with at least one line. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the WO View-only test user. | Login succeeds. |
| 2 | Open the Work Orders list and click a Work Order that has lines. | WO detail page opens. |
| 3 | Observe the Work Order Lines section. | WO Lines **load and display**. **No "Failed to Load Work Order Lines" error.** |

**Expected Final Result:** A WO View-only user can open a WO and see its lines load without error.

---

### CR-REG-003 — Role without Reports can log in and use the app

| Field | Value |
|---|---|
| **Related Jira** | SV-7977 |
| **Priority** | Critical |
| **Type** | Regression |
| **Preconditions** | Custom role with **Reports OFF** but other reasonable permissions ON (e.g., Work Orders View). Assigned to test user. |
| **Test Data** | Role "No Reports". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create role "No Reports" with Reports OFF and Work Orders → View ON. Assign to test user. | Role saves. |
| 2 | Log in as the test user. | Login succeeds — **no "Access Restricted".** |
| 3 | Navigate around the areas the role does have access to. | App is usable normally; the absence of Reports does not block anything else. |

**Expected Final Result:** A role without Reports logs in and uses the app normally; missing Reports does not cause an Access Restricted wall.

---

### CR-REG-004 — Top nav tabs remain visible on Access-Restricted situations

| Field | Value |
|---|---|
| **Related Jira** | SV-7983 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | A minimal custom role that previously triggered Access-Restricted behavior on some pages. Assigned to test user. |
| **Test Data** | Role "Minimal Access". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user with the minimal role. | Login succeeds. |
| 2 | Navigate to a page the role can access, then to one it partially cannot; repeat a few times. | On every page transition the **top navigation tabs remain visible** and do not sporadically disappear. |

**Expected Final Result:** The top nav tabs stay consistently visible even in access-restricted scenarios.

---

### CR-REG-005 — Role without Reports: Start/Stop on a WO line does not trigger Access Restricted

| Field | Value |
|---|---|
| **Related Jira** | SV-7995 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Custom role with Reports OFF and Work Orders View + WO Lines Create&Edit ON (enough to start/stop). Assigned to test user. |
| **Test Data** | Role "No Reports Tech"; a WO with a startable line. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user and open a WO with a line. | Login succeeds; WO opens. |
| 2 | Click **Start** on a WO line, then **Stop**. | Timer starts and stops. **No "Access Restricted" page appears** at any point. |

**Expected Final Result:** Starting/stopping a WO line for a role without Reports does not surface an Access Restricted error.

---

### CR-REG-006 — WO Lines Create&Edit removes "Failed to Load WO Lines" without needing Customers

| Field | Value |
|---|---|
| **Related Jira** | SV-7997 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Custom role with Work Orders View + WO Lines Create&Edit ON, **Customers OFF**. Assigned to test user. |
| **Test Data** | Role "WO Lines Editor (no Customers)"; a WO with lines. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create the role with WO Lines Create&Edit ON and Customers OFF. Assign to test user. | Role saves. |
| 2 | Log in as the test user and open a WO with lines. | WO opens. |
| 3 | Observe the WO Lines section. | WO Lines **load successfully**. **No "Failed to Load WO Lines" error, even though Customers is OFF.** |

**Expected Final Result:** Enabling WO Lines Create&Edit resolves the load error without requiring the Customers permission.

---

### CR-REG-007 — Schedule View-only lands on Schedule with no Access Restricted

| Field | Value |
|---|---|
| **Related Jira** | SV-8047 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Custom role with Schedule → View ON only, Customers OFF. Assigned to test user. |
| **Test Data** | Role "Schedule View-only". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create role "Schedule View-only" (Schedule View ON, Customers OFF). Assign to test user. | Role saves. |
| 2 | Log in as the test user. | Login succeeds and lands on the **Schedule** page. |
| 3 | Log out and log in again a couple of times to check for intermittency. | Every login lands on Schedule. **No "Access Restricted" appears; enabling Customers is not required.** |

**Expected Final Result:** A Schedule View-only user reliably lands on the Schedule without an Access Restricted wall and without needing Customers.

---

### CR-REG-008 — Schedule View+Create&Edit: new events persist and "Assign to existing WO" works

| Field | Value |
|---|---|
| **Related Jira** | SV-8048 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Custom role with Schedule → View + Create&Edit ON. Assigned to test user. At least one existing WO. |
| **Test Data** | Role "Schedule Editor"; an existing WO to assign to. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Schedule Editor user and open the Schedule. | Schedule opens. |
| 2 | Create a new schedule event and save. | Event saves. |
| 3 | Refresh / reopen the Schedule. | The new event **persists** and is still shown. |
| 4 | On an event, use **Assign to existing WO** and pick a WO. | Assignment succeeds and links the event to the WO. |

**Expected Final Result:** New schedule events persist and "Assign to existing WO" works for a Schedule View+Create&Edit role.

---

### CR-REG-009 — Timesheets View-only reaches Timesheets with tab present

| Field | Value |
|---|---|
| **Related Jira** | SV-8051 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Custom role with Timesheets → View ON only. Assigned to test user. |
| **Test Data** | Role "Timesheets View-only". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create role "Timesheets View-only" (Timesheets View ON). Assign to test user. | Role saves. |
| 2 | Log in as the test user. | Login succeeds; **no "Access Restricted".** |
| 3 | Look for the Timesheets navigation tab and open it. | The **Timesheets tab is present** and opens the Timesheets page. |

**Expected Final Result:** A Timesheets View-only user reaches Timesheets and the tab is visible.

---

### CR-REG-010 — Part Sales View role can log in with and without See Financial Data

| Field | Value |
|---|---|
| **Related Jira** | SV-8052 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Two custom roles: (A) Part Sales → View ON with **See Financial Data OFF**; (B) Part Sales → View ON with **See Financial Data ON**. Assigned to test user(s). |
| **Test Data** | Roles "Part Sales View (no fin)" and "Part Sales View (fin)". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the user with role (A) — Part Sales View, See Financial Data OFF. | Login succeeds; **no "Access Restricted".** |
| 2 | Assign role (B) to the user, have them log back in. | Login succeeds; **no "Access Restricted".** |

**Expected Final Result:** A Part Sales View role logs in successfully regardless of the See Financial Data setting.

---

## Permission Enforcement & Security Bypass

### CR-REG-011 — Role create/update API rejects invalid permission combinations

| Field | Value |
|---|---|
| **Related Jira** | SV-7885 |
| **Priority** | Critical |
| **Type** | Security |
| **Preconditions** | Ability to submit a role create/update request directly (e.g., via browser devtools or an API client) with the same session used in the role admin UI. |
| **Test Data** | A payload that violates parent-gate/cascade rules (e.g., WO Lines Create&Edit ON while Work Orders View OFF). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the role admin UI and confirm the invalid combo is blocked in the UI. | UI prevents the invalid combination. |
| 2 | Capture the role save request and re-send it modified to contain the invalid combo (bypassing the UI). | The **server rejects** the request (validation error / 4xx). The invalid role is **not** created/updated. |
| 3 | Reload the roles list. | No role with the invalid combination exists. |

**Expected Final Result:** Parent-gate/cascade rules are enforced server-side; the API rejects invalid permission combinations even when the UI is bypassed.

---

### CR-REG-012 — Editor blocks WO Lines Create&Edit while WO View is OFF

| Field | Value |
|---|---|
| **Related Jira** | SV-7981 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Role admin UI access. |
| **Test Data** | Role edit with Work Orders → View OFF. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | In the role editor, set Work Orders → View OFF. | View turns OFF. |
| 2 | Attempt to enable WO Lines → Create&Edit. | The editor **does not allow** WO Lines Create&Edit while WO View is OFF (option disabled/blocked). |
| 3 | If such a combo somehow existed on a user, log in as them and open a WO. | No broken/blank state results — the app behaves consistently, not a half-broken screen. |

**Expected Final Result:** The role editor prevents WO Lines Create&Edit without WO View, and no broken/blank state can arise from that combination.

---

### CR-REG-013 — Part Sales (See Financial Data OFF) not reachable via direct URL

| Field | Value |
|---|---|
| **Related Jira** | SV-7965 |
| **Priority** | Critical |
| **Type** | Security |
| **Preconditions** | Custom role with Part Sales financial access OFF (See Financial Data OFF, or Part Sales area OFF as applicable). Assigned to test user. Know the direct URL to the restricted Part Sales/financial view. |
| **Test Data** | Role "No Part Financials"; direct URL to the Part Sales financial page. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user with financial access OFF. | Login succeeds. |
| 2 | Paste the direct URL to the restricted Part Sales financial view into the address bar. | Access is **denied**; the restricted page/data is **not** shown. |

**Expected Final Result:** URL manipulation cannot reach Part Sales financial data when the permission is disabled.

---

### CR-REG-014 — Time Clock role permissions are enforced (no restricted-area access)

| Field | Value |
|---|---|
| **Related Jira** | SV-7958 |
| **Priority** | Critical |
| **Type** | Security |
| **Preconditions** | Custom Time Clock role (limited scope). Assigned to test user. Know direct URLs to areas the role should not reach. |
| **Test Data** | Role "Time Clock only". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Time Clock role user. | Login succeeds into the allowed Time Clock scope. |
| 2 | Attempt to reach restricted areas via nav and via direct URL. | Restricted areas are **not reachable**; access is denied. |

**Expected Final Result:** Time Clock role permissions are enforced and the user cannot reach restricted areas.

---

### CR-REG-015 — Receive Part modal hides financial info when financial perms are off

| Field | Value |
|---|---|
| **Related Jira** | SV-7973 |
| **Priority** | High |
| **Type** | Security |
| **Preconditions** | Custom role able to receive parts but with financial permissions (See Financial Data) OFF. Assigned to test user. A part available to receive. |
| **Test Data** | Role "Receive no financials"; a receivable part. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user and open the Receive Part flow for a part. | Receive Part modal opens. |
| 2 | Inspect all fields in the modal. | **No financial info** (cost/price/totals) is exposed. |

**Expected Final Result:** The Receive Part modal does not expose financial information when financial permissions are disabled.

---

### CR-REG-016 — AP/AR and WO-history controllers are guarded

| Field | Value |
|---|---|
| **Related Jira** | SV-7475 |
| **Priority** | Critical |
| **Type** | Security |
| **Preconditions** | Custom role with **AP/AR OFF**. Assigned to test user. Know the AP/AR and WO-history endpoints/URLs. |
| **Test Data** | Role "No AP/AR"; endpoint/URL for AP/AR data and WO history. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the No AP/AR test user. | Login succeeds. |
| 2 | Attempt to hit the AP/AR controller/endpoint directly (URL or API request). | Request is **rejected / access denied**; no AP/AR data returned. |
| 3 | Attempt to hit the WO-history controller/endpoint directly. | Request is **rejected / access denied**; no data returned. |

**Expected Final Result:** AP/AR and WO-history controllers are guarded server-side; a role without AP/AR cannot access those endpoints or data.

---

## Digital Inspections

### CR-REG-017 — Deleting/reopening inspections requires WO Lines Delete

| Field | Value |
|---|---|
| **Related Jira** | SV-7985 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Custom role with WO View + WO Lines Create&Edit ON but **WO Lines Delete OFF**. Assigned to test user. An in-progress inspection and a completed inspection. |
| **Test Data** | Role "WO Lines Editor (no Delete)"; one in-progress and one completed inspection. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user and open the WO with the in-progress inspection. | WO opens. |
| 2 | Attempt to delete the in-progress inspection. | **Not allowed** (no delete action / blocked) — Create&Edit alone does not permit delete. |
| 3 | Attempt to delete the completed inspection. | **Not allowed.** |
| 4 | Attempt to reopen the completed inspection. | **Not allowed** — reopen requires WO Lines Delete. |

**Expected Final Result:** Deleting in-progress/completed inspections and reopening completed inspections all require WO Lines Delete; Create&Edit alone does not permit them.

---

### CR-REG-018 — Inspection filler is read-only without WO Lines Create&Edit

| Field | Value |
|---|---|
| **Related Jira** | SV-8044 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Custom role with WO View ON but **WO Lines Create&Edit OFF**. Assigned to test user. An inspection to view. |
| **Test Data** | Role "WO View-only"; an inspection. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user and open a WO with an inspection. | WO opens. |
| 2 | Open the inspection filler. | Inspection filler opens in **read-only** mode. |
| 3 | Attempt to edit fields and to submit. | Fields are **not editable**; there is **no working submit** action. |

**Expected Final Result:** For roles without WO Lines Create&Edit, the inspection filler is read-only and cannot be edited or submitted.

---

### CR-REG-019 — Role with WO View + WO Lines Create&Edit + Delete can reopen completed inspections

| Field | Value |
|---|---|
| **Related Jira** | SV-8045 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Custom role with WO View + WO Lines Create&Edit + WO Lines Delete ON. Assigned to test user. A completed inspection. |
| **Test Data** | Role "WO Lines Full"; a completed inspection. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user and open the WO with the completed inspection. | WO opens. |
| 2 | Locate and click the **Reopen** action on the completed inspection. | Reopen action is available and **succeeds**; the inspection returns to an open state. |

**Expected Final Result:** A role with WO View + WO Lines Create&Edit + Delete can reopen completed inspections.

---

### CR-REG-020 — Service Advisor can reopen completed inspections

| Field | Value |
|---|---|
| **Related Jira** | SV-8020 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Service Advisor role (per spec) assigned to test user. A completed inspection. |
| **Test Data** | Role "Service Advisor"; a completed inspection. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Service Advisor user and open the WO with the completed inspection. | WO opens. |
| 2 | Locate the **Reopen** button on the completed inspection. | The **Reopen button is present**. |
| 3 | Click Reopen. | Reopen succeeds. |

**Expected Final Result:** The Service Advisor role can reopen completed inspections and the Reopen button is available.

---

## Parts & Inventory

### CR-REG-021 — Technician with Order Parts OFF does not see "Receive" for special-order parts

| Field | Value |
|---|---|
| **Related Jira** | SV-7972 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Technician-style custom role with **Order Parts OFF**. Assigned to test user. A WO line with a special-order part. |
| **Test Data** | Role "Technician (no Order Parts)"; a special-order part on a line. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user and open the WO line with the special-order part. | Line opens. |
| 2 | Inspect the actions available for the special-order part. | **No "Receive" action** is shown for the special-order part. |

**Expected Final Result:** A technician with Order Parts OFF does not see the Receive option for special-order parts.

---

### CR-REG-022 — Returning a special-order part does not 403 for an authorized role

| Field | Value |
|---|---|
| **Related Jira** | SV-7988 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Custom role authorized to return parts (parts management permissions ON). Assigned to test user. A special-order part that can be returned. |
| **Test Data** | Role "Parts Manager"; a returnable special-order part. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the authorized test user and open the special-order part. | Part opens. |
| 2 | Perform the **Return** action on the special-order part. | Return **succeeds**. **No 403 error.** |

**Expected Final Result:** An authorized role can return a special-order part without a 403.

---

### CR-REG-023 — Catalog & Inventory role with Edit/Delete can create/edit/delete a catalog part

| Field | Value |
|---|---|
| **Related Jira** | SV-8004 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Custom role with Catalog & Inventory → Create&Edit + Delete ON. Assigned to test user. |
| **Test Data** | Role "Catalog Editor". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user and open the parts catalog. | Catalog opens. |
| 2 | Create a new catalog part. | Creation **succeeds** — no 403. |
| 3 | Edit the catalog part. | Edit **succeeds** — no 403. |
| 4 | Delete the catalog part. | Delete **succeeds** — no 403. |

**Expected Final Result:** A Catalog & Inventory role with Edit/Delete can create, edit, and delete a catalog part without 403.

---

### CR-REG-024 — Creating an inventory part succeeds for an authorized role

| Field | Value |
|---|---|
| **Related Jira** | SV-8010 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Custom role authorized to create inventory parts (Catalog & Inventory Create&Edit ON). Assigned to test user. |
| **Test Data** | Role "Inventory Editor". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user and open the inventory area. | Inventory opens. |
| 2 | Create a new inventory part and save. | Creation **succeeds** — no 403 / no error. |

**Expected Final Result:** An authorized role can create an inventory part successfully.

---

### CR-REG-025 — Editing a catalog category succeeds for an authorized role

| Field | Value |
|---|---|
| **Related Jira** | SV-8015 |
| **Priority** | Medium |
| **Type** | Regression |
| **Preconditions** | Custom role authorized to edit catalog categories (Catalog & Inventory Create&Edit ON). Assigned to test user. An existing catalog category. |
| **Test Data** | Role "Catalog Editor"; an existing category. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user and open catalog categories. | Categories open. |
| 2 | Edit an existing catalog category and save. | Edit **succeeds** — no 403 / no error. |

**Expected Final Result:** An authorized role can edit a catalog category successfully.

---

## Technician role

### CR-REG-026 — Technician filtering WOs by "Imported" status does not 403

| Field | Value |
|---|---|
| **Related Jira** | SV-7939 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Technician role assigned to test user. At least one WO list accessible. |
| **Test Data** | Role "Technician"; WO list with an "Imported" status filter. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Technician user and open the Work Orders list. | List opens. |
| 2 | Apply the WO status filter **Imported**. | The list filters to Imported WOs. **No 403 error.** |

**Expected Final Result:** A Technician can filter Work Orders by Imported status without a 403.

---

### CR-REG-027 — "My Work Orders" toggle behaves correctly for Technician

| Field | Value |
|---|---|
| **Related Jira** | SV-7942 |
| **Priority** | Medium |
| **Type** | Regression |
| **Preconditions** | Technician role assigned to test user. |
| **Test Data** | Role "Technician". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Technician user and open the Work Orders list. | List opens. |
| 2 | Observe the **My Work Orders** toggle and its behavior. | The toggle behaves correctly per spec (shown/hidden and filtering as intended) — **not shown inappropriately or misbehaving.** |

**Expected Final Result:** The "My Work Orders" toggle behaves correctly for the Technician role.

---

### CR-REG-028 — Technician does not get a 403 on login

| Field | Value |
|---|---|
| **Related Jira** | SV-7970 |
| **Priority** | Critical |
| **Type** | Regression |
| **Preconditions** | Technician role assigned to test user. |
| **Test Data** | Role "Technician". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Technician user. | Login **succeeds**. **No 403 error** and no Access Restricted wall. |
| 2 | Confirm the landing page loads with nav present. | Appropriate page loads with nav tabs present. |

**Expected Final Result:** A Technician logs in without a 403.

---

### CR-REG-029 — Technician can view the WO Line Log

| Field | Value |
|---|---|
| **Related Jira** | SV-7989 |
| **Priority** | Medium |
| **Type** | Regression |
| **Preconditions** | Technician role assigned to test user. A WO line with log history. |
| **Test Data** | Role "Technician"; a WO line with a log. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Technician user and open a WO line. | Line opens. |
| 2 | Open the **WO Line Log**. | The log **displays** its history — no error / no denial. |

**Expected Final Result:** A Technician can view the WO Line Log.

---

### CR-REG-030 — Technician completing a WO line via "Set Line Status" does not 403

| Field | Value |
|---|---|
| **Related Jira** | SV-8042 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Technician role assigned to test user. A WO line that can be completed. |
| **Test Data** | Role "Technician"; a completable WO line. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Technician user and open a WO line. | Line opens. |
| 2 | Use **Set Line Status** to mark the line complete. | Status change **succeeds**. **No 403 error.** |

**Expected Final Result:** A Technician can complete a WO line via Set Line Status without a 403.

---

## Reports / Sales Rep

### CR-REG-031 — Unavailable reports are not visible for a role without those reports

| Field | Value |
|---|---|
| **Related Jira** | SV-7949 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Custom role with only a subset of reports enabled. Assigned to test user. |
| **Test Data** | Role "Limited Reports". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user and open the Reports area. | Reports area opens. |
| 2 | Inspect the list of reports shown. | Only the enabled reports appear. **Reports the role does not have are not visible.** |

**Expected Final Result:** Reports the role lacks are hidden; only permitted reports are visible.

---

### CR-REG-032 — Report highlighting / active state is correct

| Field | Value |
|---|---|
| **Related Jira** | SV-7950 |
| **Priority** | Low |
| **Type** | Regression |
| **Preconditions** | Custom role with access to multiple reports. Assigned to test user. |
| **Test Data** | Role "Reports Viewer". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user and open the Reports area. | Reports area opens. |
| 2 | Select a report, then select a different report. | The **currently open report is highlighted / shown as active**, and the active-state updates correctly when switching. |

**Expected Final Result:** Report highlighting/active-state reflects the currently selected report correctly.

---

### CR-REG-033 — AR Aging Collection report does not 403 for an authorized (AP/AR) role

| Field | Value |
|---|---|
| **Related Jira** | SV-7996 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Custom role with AP/AR ON and access to the AR Aging Collection report. Assigned to test user. |
| **Test Data** | Role "AP/AR Reports"; AR Aging Collection report. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user and open the Reports area. | Reports area opens. |
| 2 | Open the **AR Aging Collection** report. | The report **loads**. **No 403 error.** |

**Expected Final Result:** An authorized AP/AR role can open the AR Aging Collection report without a 403.

---

## Time Clock role

### CR-REG-034 — Admin can enable the "Time Clock" staff-record setting on a custom role

| Field | Value |
|---|---|
| **Related Jira** | SV-7748 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Admin access. A user assigned a custom role. |
| **Test Data** | A test user on a custom role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As admin, open the Edit Staff modal for a user who has a custom role. | Modal opens. |
| 2 | Enable the **Time Clock** staff-record setting and save. | The setting **enables and saves successfully** for a user on a custom role. |
| 3 | Reopen the modal. | Time Clock remains enabled (persisted). |

**Expected Final Result:** Admin can enable the Time Clock staff-record setting for a user on a custom role.

---

### CR-REG-035 — Time Clock toggle UI renders correctly in Edit Staff modal

| Field | Value |
|---|---|
| **Related Jira** | SV-7759 |
| **Priority** | Medium |
| **Type** | Regression |
| **Preconditions** | Admin access. A user to edit. |
| **Test Data** | A test user. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As admin, open the Edit Staff modal. | Modal opens. |
| 2 | Locate the **Time Clock** toggle. | The toggle **renders correctly** (label, on/off control, alignment) — not missing/broken/misaligned. |

**Expected Final Result:** The Time Clock toggle renders correctly in the Edit Staff modal.

---

### CR-REG-036 — Changing a user's role logs them out cleanly when accessing Time Clock

| Field | Value |
|---|---|
| **Related Jira** | SV-7800 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Test user logged in and using Time Clock. Admin able to change the user's role. |
| **Test Data** | A test user actively in the Time Clock area; a second role to switch them to. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Have the test user log in and open the Time Clock area. | Time Clock loads. |
| 2 | As admin, change the user's role. | Role change saves. |
| 3 | Observe the test user's session as they interact with / access Time Clock. | The user is **logged out cleanly** (redirected to login) — **not shown an error.** |

**Expected Final Result:** Changing a user's role logs them out cleanly rather than erroring when they access Time Clock.

---

## AP/AR & Invoicing

### CR-REG-037 — Service Manager Invoicing & Payments access matches spec (V/E, no Delete)

| Field | Value |
|---|---|
| **Related Jira** | SV-7807 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Service Manager role (per spec) assigned to test user. An invoice with a payment. |
| **Test Data** | Role "Service Manager"; an invoice with a payment. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Service Manager and open an invoice. | Invoice opens; **View** works. |
| 2 | Edit invoice/payment details. | **Edit** is allowed per spec. |
| 3 | Look for a delete action for invoices/payments. | **Delete is not available** — matches spec (View/Edit, no Delete). |

**Expected Final Result:** Service Manager's Invoicing & Payments access is View/Edit with no Delete, matching the spec.

---

### CR-REG-038 — Service Advisor invoice reversal / payment deletion follows AP/AR + reverse-requires-WO-Delete rule

| Field | Value |
|---|---|
| **Related Jira** | SV-7812 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Service Advisor role (per spec) assigned to test user, with and without WO Delete variants as needed. An invoice with a payment eligible for reversal. |
| **Test Data** | Role "Service Advisor"; an invoice with a payment. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as a Service Advisor **without WO Delete** and open an invoice with a payment. | Invoice opens. |
| 2 | Attempt to reverse the invoice / delete the payment. | Reversal/payment-deletion is **gated per AP/AR permission and the reverse-requires-WO-Delete rule** — blocked when WO Delete is absent. |
| 3 | Repeat with a Service Advisor variant that **has WO Delete** and the required AP/AR permission. | Reversal/payment-deletion is **allowed** per the rule. |

**Expected Final Result:** Service Advisor invoice reversal and payment deletion follow the AP/AR permission plus the reverse-requires-WO-Delete rule.

---

### CR-REG-039 — Vendor reverse / payment-delete gated when AP/AR is OFF

| Field | Value |
|---|---|
| **Related Jira** | SV-7871 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Custom role with **AP/AR OFF**. Assigned to test user. A vendor payment eligible for reversal/deletion. |
| **Test Data** | Role "No AP/AR"; a vendor payment. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the No AP/AR test user and open the vendor payment. | Payment opens (if viewable) or the action area is reached. |
| 2 | Attempt to reverse / delete the vendor payment. | The action is **gated / blocked** because AP/AR is OFF. |

**Expected Final Result:** Vendor reverse and payment-delete are correctly gated when AP/AR is OFF.

---

## Send to Portal / View Mode

### CR-REG-040 — "Send to Portal" works for all eligible roles

| Field | Value |
|---|---|
| **Related Jira** | SV-7799 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | An eligible custom role (per spec) assigned to test user. A WO/document eligible for Send to Portal. |
| **Test Data** | Role "Send to Portal eligible"; an eligible WO/document. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the eligible test user and open the WO/document. | It opens. |
| 2 | Use **Send to Portal**. | The action **completes successfully — no error.** |

**Expected Final Result:** "Send to Portal" works (does not error) for eligible roles.

---

### CR-REG-041 — Service Manager accesses Send to Portal per spec (no unexpected Customer Portal requirement)

| Field | Value |
|---|---|
| **Related Jira** | SV-7801 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Service Manager role (per spec, without Customer Portal explicitly enabled). Assigned to test user. An eligible WO/document. |
| **Test Data** | Role "Service Manager (no Customer Portal)"; an eligible WO/document. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Service Manager user and open an eligible WO/document. | It opens. |
| 2 | Use **Send to Portal**. | Access works **per spec**; the action does **not** require the Customer Portal permission unexpectedly. |

**Expected Final Result:** Service Manager can access Send to Portal per spec without an unexpected Customer Portal requirement.

---

### CR-REG-042 — "Send to Terminal" visibility for Parts Technician matches spec

| Field | Value |
|---|---|
| **Related Jira** | SV-7902 |
| **Priority** | Medium |
| **Type** | Regression |
| **Preconditions** | Parts Technician role (per spec) assigned to test user. |
| **Test Data** | Role "Parts Technician". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Parts Technician user and navigate to where Send to Terminal would appear. | Page opens. |
| 2 | Check the visibility of **Send to Terminal**. | Visibility **matches spec** for Parts Technician (shown/hidden exactly as specified). |

**Expected Final Result:** "Send to Terminal" visibility for the Parts Technician role matches the spec.

---

### CR-REG-043 — WO Create/Edit action requiring Full View gives a clear validation prompt

| Field | Value |
|---|---|
| **Related Jira** | SV-7832 |
| **Priority** | Medium |
| **Type** | Negative |
| **Preconditions** | Custom role that can attempt a WO Create/Edit action but lacks Full View. Assigned to test user. |
| **Test Data** | Role "WO Editor (no Full View)". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user and attempt a WO Create/Edit action that requires Full View. | The app **shows a clear validation prompt** explaining Full View is required. **No silent failure.** |

**Expected Final Result:** A WO Create/Edit action requiring Full View produces a clear validation prompt rather than failing silently.

---

## Portals & Misc

### CR-REG-044 — Customers View-only user does not see Part Sales / WO tabs on customer profile when off

| Field | Value |
|---|---|
| **Related Jira** | SV-8050 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Custom role with Customers → View ON but Part Sales and Work Orders areas OFF. Assigned to test user. An existing customer. |
| **Test Data** | Role "Customers View-only"; a customer profile. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user and open a customer profile. | Profile opens. |
| 2 | Inspect the tabs on the customer profile. | **Part Sales and Work Orders tabs are NOT shown** because those areas are off. |

**Expected Final Result:** A Customers View-only user does not see Part Sales or WO tabs on the customer profile when those areas are off.

---

### CR-REG-045 — "Add Customer" in New WO flow is gated by Customer Create&Edit

| Field | Value |
|---|---|
| **Related Jira** | SV-8002 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Two roles: (A) can create a WO but has **Customers Create&Edit OFF**; (B) same but Customers Create&Edit ON. Assigned to test user(s). |
| **Test Data** | Roles "WO Create (no Cust Edit)" and "WO Create (Cust Edit)". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as role (A) and start the New WO flow. | New WO flow opens. |
| 2 | Look for the **Add Customer** action. | Add Customer is **not available** (gated off) — Customer Create&Edit is required. |
| 3 | Switch to role (B) and start the New WO flow. | **Add Customer is available** and works. |

**Expected Final Result:** The "Add Customer" action in the New WO flow is gated by the Customer Create&Edit permission.

---

### CR-REG-046 — Service Advisor field on a WO consistently enforces edit permission

| Field | Value |
|---|---|
| **Related Jira** | SV-7930 |
| **Priority** | Medium |
| **Type** | Negative |
| **Preconditions** | Custom role lacking permission to edit the Service Advisor field on a WO. Assigned to test user. A WO. |
| **Test Data** | Role "WO limited edit"; a WO with a Service Advisor field. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user and open a WO. | WO opens. |
| 2 | Observe the **Service Advisor** field's state. | If a blocked/locked icon is shown, the field is **genuinely non-editable** — consistent behavior. |
| 3 | Attempt to change the Service Advisor field. | The change is **prevented** — there is no "blocked icon but still editable" inconsistency. |

**Expected Final Result:** The Service Advisor field consistently enforces edit permission (no blocked-icon-but-still-editable state).

---

### CR-REG-047 — Clicking the logo loads the Dashboard reliably

| Field | Value |
|---|---|
| **Related Jira** | SV-7819 |
| **Priority** | Medium |
| **Type** | Regression |
| **Preconditions** | Any custom role with Dashboard access. Assigned to test user. |
| **Test Data** | Role "Standard User". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user and navigate to any page. | Page opens. |
| 2 | Click the **logo** in the header. | The **Dashboard loads reliably.** |
| 3 | Repeat from a couple of different pages. | Each click of the logo consistently loads the Dashboard. |

**Expected Final Result:** Clicking the logo reliably loads the Dashboard.

---
