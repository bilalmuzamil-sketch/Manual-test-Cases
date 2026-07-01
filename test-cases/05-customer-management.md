# Customer Management — Custom Roles and Permissions Test Cases

> **Epic:** [SV-7388 – Custom Roles and Permissions](https://shopview.atlassian.net/browse/SV-7388)
> **Spec:** [Custom Roles and Permissions (Confluence)](https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions)

**Scope:** Verifies that the Customer Management area (area code CUST, permission key `customers`, SV-7511) enforces View / Edit / Delete permissions over customer records, contacts, vehicles/assets and history, including CRUD cascade behavior, nav visibility, the New Work Order add-customer/add-asset button gating (SV-8002), the AP/AR gating of sensitive customer fields (`seeApArData`), the reference-only customer picker for users without Customers access, and the SV-8050 tab-visibility case.

## Prerequisites
- Access to a ShopView environment (staging/QA) with admin rights to create Custom Roles and assign them to users.
- Ability to create/edit Custom Roles under Settings → Roles & Permissions.
- At least two test users available for role assignment (so the admin session stays logged in).
- Note: role changes force the affected user to log out; always re-log in as the test user after any role change.
- General cascade rule (applies to all CRUD areas): enabling **Edit** auto-enables **View**; enabling **Delete** auto-enables **Edit + View**; disabling **View** disables **Edit + Delete**; disabling **Edit** disables **Delete**. When **View is OFF**, the area's nav item is **hidden**.
- At least one existing customer record with contacts and a vehicle/asset for read/edit steps.
- Ability to grant a "New Work Order" / WO create permission independently of Customers, for the reference-only picker case.

## Test Cases

### CR-CUST-001 — Customer View enabled shows Customers nav and customer records

| Field | Value |
|---|---|
| **Related Jira** | SV-7511 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | Custom role with Customers: View = ON, Edit = OFF, Delete = OFF. |
| **Test Data** | Role "CUST View Only"; test user custview@test; customer "Acme Fleet" with 1 contact and 1 vehicle |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create/pick custom role with Customers: View = ON only. | Role saved; Edit and Delete remain OFF. |
| 2 | Assign the role to test user and log in as that user. | Login succeeds. |
| 3 | Locate the Customers item in the main navigation. | Customers nav item is visible. |
| 4 | Open "Acme Fleet". | Customer record loads showing contacts, vehicles/assets, and vehicle history. |

**Expected Final Result:** A Customers View-only user can open the Customers area and read customer records, contacts, vehicles, and history.

---

### CR-CUST-002 — Customer View OFF hides the Customers nav item

| Field | Value |
|---|---|
| **Related Jira** | SV-7511 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Custom role with Customers: View = OFF (Edit/Delete therefore OFF via cascade). |
| **Test Data** | Role "CUST No Access"; test user nocust@test |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create/pick custom role with Customers: View = OFF. | Edit and Delete are also OFF (cascade). |
| 2 | Assign role to test user and log in as that user. | Login succeeds. |
| 3 | Inspect the main navigation. | No Customers nav item is present. |
| 4 | Attempt to reach the Customers list via a direct URL (if known). | User cannot access the Customers area (blocked/redirected). |

**Expected Final Result:** With Customers View OFF, the Customers nav is hidden and the area is inaccessible.

---

### CR-CUST-003 — Cascade: enabling Customer Edit auto-enables View

| Field | Value |
|---|---|
| **Related Jira** | SV-7511 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | New/edited custom role with all Customers CRUD OFF. |
| **Test Data** | Role "CUST Edit Cascade" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the role's Customers permissions with View/Edit/Delete all OFF. | All three OFF. |
| 2 | Toggle Customers: Edit = ON. | View automatically turns ON. |
| 3 | Save the role. | Role saves with View = ON, Edit = ON, Delete = OFF. |

**Expected Final Result:** Enabling Customer Edit auto-enables Customer View.

---

### CR-CUST-004 — Cascade: enabling Customer Delete auto-enables Edit + View

| Field | Value |
|---|---|
| **Related Jira** | SV-7511 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | New/edited custom role with all Customers CRUD OFF. |
| **Test Data** | Role "CUST Delete Cascade" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the role's Customers permissions with View/Edit/Delete all OFF. | All three OFF. |
| 2 | Toggle Customers: Delete = ON. | Edit and View both automatically turn ON. |
| 3 | Save the role. | Role saves with View = ON, Edit = ON, Delete = ON. |

**Expected Final Result:** Enabling Customer Delete auto-enables both Edit and View.

---

### CR-CUST-005 — Cascade: disabling Customer View disables Edit + Delete

| Field | Value |
|---|---|
| **Related Jira** | SV-7511 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | Custom role with Customers: View = ON, Edit = ON, Delete = ON. |
| **Test Data** | Role "CUST Full" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the role with Customers View/Edit/Delete all ON. | All three ON. |
| 2 | Toggle Customers: View = OFF. | Edit and Delete automatically turn OFF. |
| 3 | Save the role. | Role saves with View = OFF, Edit = OFF, Delete = OFF. |

**Expected Final Result:** Disabling Customer View cascades OFF to Edit and Delete.

---

### CR-CUST-006 — Cascade: disabling Customer Edit disables Delete

| Field | Value |
|---|---|
| **Related Jira** | SV-7511 |
| **Priority** | Medium |
| **Type** | Dependency |
| **Preconditions** | Custom role with Customers: View = ON, Edit = ON, Delete = ON. |
| **Test Data** | Role "CUST Full" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the role with Customers View/Edit/Delete all ON. | All three ON. |
| 2 | Toggle Customers: Edit = OFF. | Delete automatically turns OFF; View stays ON. |
| 3 | Save the role. | Role saves with View = ON, Edit = OFF, Delete = OFF. |

**Expected Final Result:** Disabling Customer Edit cascades OFF to Delete while View remains.

---

### CR-CUST-007 — Customer Edit user can create/edit customers, contacts, and vehicles

| Field | Value |
|---|---|
| **Related Jira** | SV-7511 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | Custom role with Customers: View = ON, Edit = ON, Delete = OFF assigned to a test user. |
| **Test Data** | Role "CUST Edit"; test user custedit@test |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Customers Edit user and open Customers. | Customers list loads with create controls (e.g., "Add Customer"). |
| 2 | Create a new customer record and save. | Customer is created and appears in the list. |
| 3 | Open the customer and add a new contact. | Contact is added and saved. |
| 4 | Add a new vehicle/asset to the customer. | Vehicle/asset is added and saved. |
| 5 | Edit an existing field on the customer and save. | Change is persisted. |

**Expected Final Result:** A Customers Edit user can create and edit customers, contacts, and vehicles/assets.

---

### CR-CUST-008 — Customer View-only user cannot create or edit; Add buttons hidden (SV-8002)

| Field | Value |
|---|---|
| **Related Jira** | SV-8002 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Custom role with Customers: View = ON, Edit = OFF, Delete = OFF assigned to a test user. |
| **Test Data** | Role "CUST View Only"; test user custview@test; existing customer "Acme Fleet" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Customers View-only user and open Customers. | Customers list loads read-only. |
| 2 | Look for an "Add Customer" control on the list. | The "Add {Customer}" button is hidden (SV-8002). |
| 3 | Open "Acme Fleet" and look for the "Add {Asset}" control. | The "Add {Asset}" button is hidden. |
| 4 | Attempt to edit a customer field. | No edit controls available; the record is read-only. |

**Expected Final Result:** A Customers View-only user sees records read-only with the Add Customer / Add Asset buttons hidden.

---

### CR-CUST-009 — Customer Delete user can delete customer records

| Field | Value |
|---|---|
| **Related Jira** | SV-7511 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Custom role with Customers: View = ON, Edit = ON, Delete = ON assigned to a test user. |
| **Test Data** | Role "CUST Full"; test user custfull@test; disposable customer "Temp Cust" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Customers Delete user and open "Temp Cust". | Record loads with a delete control available. |
| 2 | Select Delete and confirm. | "Temp Cust" is deleted and no longer appears in the list. |

**Expected Final Result:** A Customers Delete user can delete customer records.

---

### CR-CUST-010 — Customer Delete does NOT control deleting customer payments

| Field | Value |
|---|---|
| **Related Jira** | SV-7511 |
| **Priority** | Medium |
| **Type** | Negative |
| **Preconditions** | Custom role with Customers: View/Edit/Delete = ON but Invoicing: Delete = OFF, assigned to a test user. |
| **Test Data** | Role "CUST Full / No Invoicing Delete"; test user custnopay@test; a customer with a recorded payment |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the user (Customers Delete ON, Invoicing Delete OFF). | Login succeeds; Customers area accessible. |
| 2 | Open a customer that has a recorded payment. | Customer and payment are visible. |
| 3 | Attempt to delete the customer payment. | Deleting the payment is NOT permitted (it requires Invoicing: Delete, which is OFF). |

**Expected Final Result:** Customers Delete permission does not grant the ability to delete customer payments; that requires Invoicing: Delete.

---

### CR-CUST-011 — Sensitive customer fields hidden when Manage AP/AR is OFF

| Field | Value |
|---|---|
| **Related Jira** | SV-7511 |
| **Priority** | Critical |
| **Type** | Security |
| **Preconditions** | Custom role with Customers: View = ON, Edit = ON, and Manage AP/AR (`seeApArData`) = OFF, assigned to a test user. |
| **Test Data** | Role "CUST Edit / No AP-AR"; test user custnoapar@test; existing customer "Acme Fleet" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the user (Customers Edit ON, Manage AP/AR OFF). | Login succeeds; Customers accessible. |
| 2 | Open "Acme Fleet" and view the Customer Overview panel. | Sensitive fields are hidden: Credit Terms, Credit Limit, Default Labor Rate, Default Shop Supplies, Min and Max, Taxes, and "PO is Required" are NOT shown. |
| 3 | Open the Edit Customer modal. | The same sensitive fields (Credit Terms, Credit Limit, Default Labor Rate, Default Shop Supplies, Min and Max, Taxes, "PO is Required") are hidden on the modal. |

**Expected Final Result:** With Manage AP/AR OFF, all AP/AR-gated sensitive customer fields are hidden on both the Customer Overview panel and the Edit Customer modal.

---

### CR-CUST-012 — Sensitive customer fields visible when Manage AP/AR is ON

| Field | Value |
|---|---|
| **Related Jira** | SV-7511 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Custom role with Customers: View = ON, Edit = ON, and Manage AP/AR (`seeApArData`) = ON, assigned to a test user. |
| **Test Data** | Role "CUST Edit / AP-AR"; test user custapar@test; existing customer "Acme Fleet" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the user (Customers Edit ON, Manage AP/AR ON). | Login succeeds; Customers accessible. |
| 2 | Open "Acme Fleet" → Customer Overview panel. | Sensitive fields are visible: Credit Terms, Credit Limit, Default Labor Rate, Default Shop Supplies, Min and Max, Taxes, "PO is Required". |
| 3 | Open the Edit Customer modal and edit a sensitive field (e.g., Credit Limit) and save. | Field is editable and the change persists. |

**Expected Final Result:** With Manage AP/AR ON, the AP/AR-gated sensitive customer fields are visible and editable on both the Overview panel and the Edit Customer modal.

---

### CR-CUST-013 — Edit user can create a customer within the New Work Order flow

| Field | Value |
|---|---|
| **Related Jira** | SV-7511 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Custom role with Customers: Edit = ON (View auto-ON) plus permission to create a New Work Order, assigned to a test user. |
| **Test Data** | Role "CUST Edit + WO Create"; test user custwoedit@test |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the user and start the New Work Order flow. | New WO flow opens. |
| 2 | In the customer step, use the "Add {Customer}" control. | The Add Customer button is available (Edit is ON). |
| 3 | Create a new customer inline and continue. | New customer is created and selected on the WO. |
| 4 | (Optional) Use "Add {Asset}" to add a vehicle inline. | Asset add button is available and the asset is created. |

**Expected Final Result:** A user with Customers Edit can create a customer (and asset) inside the New Work Order flow.

---

### CR-CUST-014 — Reference-only picker: WO creator without Customers access can pick but not navigate

| Field | Value |
|---|---|
| **Related Jira** | SV-7511 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | Custom role with Customers: View = OFF (no Customers access) but permission to create a New Work Order, assigned to a test user. At least one existing customer to pick. |
| **Test Data** | Role "WO Create / No Customers"; test user wonocust@test; existing customer "Acme Fleet" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the user (Customers View OFF, WO create ON). | Login succeeds. |
| 2 | Inspect the main navigation. | No Customers nav/tab is present (hidden). |
| 3 | Start the New Work Order flow and open the customer picker. | Existing customers (e.g., "Acme Fleet") can be selected as reference in the WO flow. |
| 4 | Attempt to navigate into the Customers area/tab from anywhere. | No Customers nav/tab is available; picking is reference-only and does not grant Customers navigation. |

**Expected Final Result:** A WO-create user with no Customers access can pick an existing customer in the New WO flow, but the Customers nav/tab stays hidden (reference-only).

---

### CR-CUST-015 — SV-8050: Customers View-only user does not see Part Sales / WO tabs when those areas are OFF

| Field | Value |
|---|---|
| **Related Jira** | SV-8050 |
| **Priority** | High |
| **Type** | Regression |
| **Preconditions** | Custom role with Customers: View = ON, but Part Sales access = OFF and Work Orders access = OFF, assigned to a test user. (Bug: these tabs appeared on the customer profile even though the areas were off.) |
| **Test Data** | Role "CUST View / No PartSales / No WO"; test user custtabs@test; customer "Acme Fleet" |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the user (Customers View ON, Part Sales OFF, Work Orders OFF). | Login succeeds; Customers accessible. |
| 2 | Open the "Acme Fleet" customer profile. | Profile loads. |
| 3 | Inspect the profile tabs. | The Part Sales tab is NOT shown (Part Sales area is OFF). |
| 4 | Continue inspecting the profile tabs. | The Work Orders (WO) tab is NOT shown (Work Orders area is OFF). |

**Expected Final Result:** A Customers View-only user does not see the Part Sales or WO tabs on the customer profile when those areas are off (SV-8050 fixed).

---
