# Invoicing and Payments Permissions (Area code: INV)

> **Epic:** [SV-7388 – Custom Roles and Permissions](https://shopview.atlassian.net/browse/SV-7388)
> **Spec:** [Custom Roles and Permissions (Confluence)](https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions)

**Scope:** Verifies the Invoicing and Payments CRUD area (SV-7515, key `invoicingPayments`), including its two financial gates (whole area requires "See Financial Data"; Delete additionally requires "Manage AP/AR"), the View/Edit/Delete effects, and the cross-area dependencies (reverse-invoice requires Work Orders Delete; delete-customer-payment and delete-part-sale-return require Invoicing Delete).

## Prerequisites
- File `00-test-environment-and-setup.md` completed: test shop with sample data (work orders with pricing, invoices from WOs and part sales, payments including customer payments, at least one part-sale return), an Administrator account, and dedicated test users.
- Two browsers or one browser plus an incognito/private window (role changes force logout — see CR-SETUP-005).
- Ability to create/edit custom roles and assign them via Administration > Staff.
- Reminder: to test any permission, configure a custom role with the setting, assign it to a test user, log in as that user (role changes force logout), then verify the effect.
- CRUD cascade rules apply throughout: enabling Edit enables View; enabling Delete enables Edit + View; disabling View disables Edit + Delete; disabling Edit disables Delete. Turning View OFF also hides the area's navigation.
- Cross-cutting toggles referenced here: **See Financial Data** (show/hide monetary values) and **Manage AP/AR** (manage Accounts Payable/Receivable).

## Test Cases

### CR-INV-001 — Invoicing View: positive (view WO & part-sale invoices, access Finance tab on WOs)

| Field | Value |
|---|---|
| **Related Jira** | SV-7515 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Sample invoices from WOs and from part sales exist. A WO with a Finance tab exists. See Financial Data ON. |
| **Test Data** | Custom role "INV-View": See Financial Data ON, Invoicing = View only. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create "INV-View" and assign to the test user. | Role saves and assigns. |
| 2 | Log in as the test user and open Invoicing. | Invoicing nav is visible; the area opens. |
| 3 | View an invoice created from a work order. | The WO invoice is viewable. |
| 4 | View an invoice created from a part sale. | The part-sale invoice is viewable. |
| 5 | Open a work order and access its Finance tab. | The Finance tab on the WO is accessible. |
| 6 | Look for create/process and delete controls. | Edit and Delete actions are absent or disabled (View only). |

**Expected Final Result:** With Invoicing View, the user can view WO and part-sale invoices and access the Finance tab on WOs, but cannot create, process, or delete.

---

### CR-INV-002 — Invoicing View OFF but See Financial Data ON: pricing shows on WOs, no direct invoice access

| Field | Value |
|---|---|
| **Related Jira** | SV-7515 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | A WO with pricing and an associated invoice exist. |
| **Test Data** | Custom role "INV-NoView-FinOn": See Financial Data ON, Invoicing = all OFF (View OFF). Work Orders View ON so WOs remain accessible. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create "INV-NoView-FinOn" and assign to the test user. | Role saves and assigns. |
| 2 | Log in as the test user and open a work order. | The WO opens; pricing/monetary values are visible (See Financial Data ON). |
| 3 | Inspect the navigation for an Invoicing entry. | No Invoicing nav entry appears (Invoicing View OFF hides the area nav). |
| 4 | Attempt to open an invoice directly (e.g. from the WO or a captured invoice URL). | The user cannot access invoices directly. |

**Expected Final Result:** With Invoicing View OFF but See Financial Data ON, the user still sees pricing on WOs but cannot access invoices directly.

---

### CR-INV-003 — Invoicing View OFF and See Financial Data OFF: negative (no invoices, no pricing)

| Field | Value |
|---|---|
| **Related Jira** | SV-7515 |
| **Priority** | Medium |
| **Type** | Negative |
| **Preconditions** | A WO with pricing exists. |
| **Test Data** | Custom role "INV-NoView-FinOff": See Financial Data OFF, Invoicing = all OFF. Work Orders View ON. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create "INV-NoView-FinOff" and assign to the test user. | Role saves and assigns. |
| 2 | Log in as the test user and inspect navigation. | No Invoicing nav entry appears. |
| 3 | Open a work order. | The WO opens but monetary values/pricing are hidden (See Financial Data OFF). |

**Expected Final Result:** With both Invoicing View and See Financial Data OFF, the user sees neither invoices nor pricing.

---

### CR-INV-004 — Invoicing Edit: positive (create invoices, process payments, manage invoice fields)

| Field | Value |
|---|---|
| **Related Jira** | SV-7515 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | See Financial Data ON. A WO and a part sale eligible for invoicing/payment exist. |
| **Test Data** | Custom role "INV-Edit": See Financial Data ON, Invoicing = View+Edit (Create&Edit). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create "INV-Edit" (Edit auto-enables View) and assign to the test user. | Role saves with View + Edit ON. |
| 2 | Log in as the test user and open Invoicing. | Area is accessible. |
| 3 | Create an invoice from a work order. | The invoice is created successfully. |
| 4 | Process a payment from a WO and from a part sale. | Payments are processed successfully. |
| 5 | Manage/edit invoice fields. | Invoice fields can be edited and saved. |
| 6 | Look for delete/void controls. | Delete and void actions are absent or disabled (Delete OFF). |

**Expected Final Result:** With Invoicing Edit (Create&Edit), the user can create invoices, process payments from WOs/part sales, and manage invoice fields, but cannot delete or void.

---

### CR-INV-005 — Invoicing Edit: positive (collect deposits and Send to Terminal require Create&Edit)

| Field | Value |
|---|---|
| **Related Jira** | SV-7515 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | See Financial Data ON. A payment terminal is configured (or the "Send to Terminal" action is present in the test environment). |
| **Test Data** | Role "INV-Edit" (See Financial Data ON, Invoicing View+Edit) and role "INV-ViewOnly" (See Financial Data ON, Invoicing View only). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Assign "INV-Edit" and log in as the test user. | Invoicing accessible with Create&Edit. |
| 2 | Collect a deposit on a WO or part sale. | The deposit is collected successfully. |
| 3 | Use "Send to Terminal" / "Send payments to terminal". | The payment is sent to the terminal successfully. |
| 4 | Reassign "INV-ViewOnly", log out/in, and look for the deposit and Send to Terminal actions. | Both actions are absent or disabled — they require Invoicing Create&Edit. |

**Expected Final Result:** Collecting deposits and Send to Terminal require Invoicing Create&Edit; a View-only user cannot perform them.

---

### CR-INV-006 — Invoicing Delete: positive (delete payments incl. customer payments, void transactions)

| Field | Value |
|---|---|
| **Related Jira** | SV-7515 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | See Financial Data ON, Manage AP/AR ON (Delete requires both — see CR-INV-008). A payment, a customer payment, and a voidable transaction exist. |
| **Test Data** | Custom role "INV-Delete": See Financial Data ON, Manage AP/AR ON, Invoicing = View+Edit+Delete. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create "INV-Delete" (Delete auto-enables Edit + View) and assign to the test user. | Role saves with full Invoicing CRUD, See Financial Data ON, Manage AP/AR ON. |
| 2 | Log in as the test user and open Invoicing. | Area is accessible. |
| 3 | Delete a payment. | The payment is deleted successfully. |
| 4 | Delete a CUSTOMER payment. | The customer payment is deleted successfully (Invoicing Delete governs this — see CR-INV-010). |
| 5 | Void a transaction. | The transaction is voided successfully. |

**Expected Final Result:** With Invoicing Delete (plus See Financial Data and Manage AP/AR), the user can delete payments including customer payments and void transactions.

---

### CR-INV-007 — FINANCIAL GATE 1: See Financial Data modal appears when enabling ANY Invoicing CRUD checkbox

| Field | Value |
|---|---|
| **Related Jira** | SV-7515 |
| **Priority** | Critical |
| **Type** | Dependency |
| **Preconditions** | Admin access to role editor. |
| **Test Data** | Custom role "INV-FinGate": See Financial Data OFF initially, Invoicing all OFF. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open "INV-FinGate" with See Financial Data OFF. | Role editor open. |
| 2 | Enable any Invoicing CRUD checkbox (e.g. View). | A "Financial Data" confirmation modal appears. |
| 3 | Click Confirm. | The modal closes; the Invoicing checkbox is enabled and See Financial Data turns ON. |
| 4 | Reopen the modal flow on another checkbox and click Cancel instead. | The checkbox reverts to OFF and See Financial Data stays OFF. |

**Expected Final Result:** Enabling any Invoicing CRUD checkbox while See Financial Data is OFF triggers the Financial Data confirmation modal; confirming enables both, cancelling leaves both unchanged.

---

### CR-INV-008 — FINANCIAL GATE 2: Invoicing Delete additionally requires Manage AP/AR (modal on enabling Delete)

| Field | Value |
|---|---|
| **Related Jira** | SV-7515 |
| **Priority** | Critical |
| **Type** | Dependency |
| **Preconditions** | Admin access to role editor. |
| **Test Data** | Custom role "INV-DeleteGate": See Financial Data ON, Manage AP/AR OFF, Invoicing = View+Edit (Delete OFF). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open "INV-DeleteGate" with See Financial Data ON, Manage AP/AR OFF, Invoicing View+Edit. | Role editor open. |
| 2 | Enable Invoicing Delete. | A modal appears indicating Delete requires "Manage AP/AR". |
| 3 | Click Confirm. | The modal closes; Invoicing Delete is enabled and Manage AP/AR turns ON. |
| 4 | Repeat the enable-Delete step in a fresh role and click Cancel. | Invoicing Delete reverts to OFF and Manage AP/AR stays OFF. |

**Expected Final Result:** Enabling Invoicing Delete while Manage AP/AR is OFF triggers a Manage AP/AR requirement modal; confirming enables both, cancelling leaves Delete OFF.

---

### CR-INV-009 — CROSS-DEPENDENCY: reversing an invoice (WO & Part Sales) requires Work Orders → Delete (NOT Invoicing Delete)

| Field | Value |
|---|---|
| **Related Jira** | SV-7515 |
| **Priority** | Critical |
| **Type** | Dependency |
| **Preconditions** | See Financial Data ON. A WO invoice and a part-sale invoice eligible for reversal exist. |
| **Test Data** | Role A "REV-WithWODelete": See Financial Data ON, Invoicing View+Edit (Invoicing Delete OFF), Work Orders = View+Edit+Delete. Role B "REV-NoWODelete": See Financial Data ON, Invoicing View+Edit+Delete (with Manage AP/AR ON), Work Orders = View+Edit (WO Delete OFF). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Assign Role A ("REV-WithWODelete") and log in as the test user. | The user has WO Delete but NOT Invoicing Delete. |
| 2 | Reverse a WO invoice. | The reversal succeeds (governed by Work Orders Delete). |
| 3 | Reverse a part-sale invoice. | The reversal succeeds (also governed by Work Orders Delete). |
| 4 | Reassign Role B ("REV-NoWODelete"), log out/in. Note: this role has Invoicing Delete but NOT WO Delete. | The user has Invoicing Delete but NOT WO Delete. |
| 5 | Attempt to reverse a WO invoice and a part-sale invoice. | Both reversals are blocked/unavailable — Invoicing Delete does NOT grant reversal; WO Delete is required. |

**Expected Final Result:** Reversing an invoice (WO and part sales) is controlled by Work Orders → Delete, not Invoicing → Delete. A user with Invoicing Delete but no WO Delete cannot reverse invoices.

---

### CR-INV-010 — CROSS-DEPENDENCY: deleting a CUSTOMER payment requires Invoicing → Delete (NOT Customer Management Delete)

| Field | Value |
|---|---|
| **Related Jira** | SV-7515 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | See Financial Data ON, Manage AP/AR ON. A customer payment exists. |
| **Test Data** | Role A "CUSTPAY-InvDelete": See Financial Data ON, Manage AP/AR ON, Invoicing View+Edit+Delete, Customers = View+Edit (Customers Delete OFF). Role B "CUSTPAY-CustDeleteOnly": See Financial Data ON, Invoicing View+Edit (Invoicing Delete OFF), Customers = View+Edit+Delete. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Assign Role A ("CUSTPAY-InvDelete") and log in as the test user. | The user has Invoicing Delete but NOT Customers Delete. |
| 2 | Delete a customer payment. | The customer payment is deleted successfully (governed by Invoicing Delete). |
| 3 | Reassign Role B ("CUSTPAY-CustDeleteOnly"), log out/in. | The user has Customers Delete but NOT Invoicing Delete. |
| 4 | Attempt to delete a customer payment. | The deletion is blocked/unavailable — Customer Management Delete does NOT grant it; Invoicing Delete is required. |

**Expected Final Result:** Deleting a customer payment is controlled by Invoicing → Delete, not Customer Management Delete. A user with Customers Delete but no Invoicing Delete cannot delete customer payments.

---

### CR-INV-011 — CROSS-DEPENDENCY: deleting a part-sale return requires Invoicing → Delete

| Field | Value |
|---|---|
| **Related Jira** | SV-7515 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | See Financial Data ON, Manage AP/AR ON. A part-sale return exists. |
| **Test Data** | Role A "PSR-InvDelete": See Financial Data ON, Manage AP/AR ON, Invoicing View+Edit+Delete, Part Sales = View+Edit (Part Sales Delete OFF). Role B "PSR-NoInvDelete": See Financial Data ON, Invoicing View+Edit (Invoicing Delete OFF), Part Sales = View+Edit+Delete. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Assign Role A ("PSR-InvDelete") and log in as the test user. | The user has Invoicing Delete but NOT Part Sales Delete. |
| 2 | Delete a part-sale return. | The part-sale return is deleted successfully (governed by Invoicing Delete). |
| 3 | Reassign Role B ("PSR-NoInvDelete"), log out/in. | The user has Part Sales Delete but NOT Invoicing Delete. |
| 4 | Attempt to delete a part-sale return. | The deletion is blocked/unavailable — Invoicing Delete is required, not Part Sales Delete. |

**Expected Final Result:** Deleting a part-sale return is controlled by Invoicing → Delete. A user without Invoicing Delete cannot delete a part-sale return even with Part Sales Delete.

---

### CR-INV-012 — Invoicing Delete OFF: negative (cannot delete/void payments)

| Field | Value |
|---|---|
| **Related Jira** | SV-7515 |
| **Priority** | Medium |
| **Type** | Negative |
| **Preconditions** | See Financial Data ON. A payment and a voidable transaction exist. |
| **Test Data** | Custom role "INV-EditNoDelete": See Financial Data ON, Invoicing = View+Edit (Delete OFF). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create "INV-EditNoDelete" and assign to the test user. | Role saves. |
| 2 | Log in as the test user, open Invoicing, and attempt to delete a payment. | No delete control is available, or the attempt is blocked. |
| 3 | Attempt to void a transaction. | No void control is available, or the attempt is blocked. |

**Expected Final Result:** Without Invoicing Delete, the user cannot delete payments or void transactions.

---

### CR-INV-013 — CRUD cascade within Invoicing (respecting financial gates)

| Field | Value |
|---|---|
| **Related Jira** | SV-7515 |
| **Priority** | Medium |
| **Type** | Dependency |
| **Preconditions** | Admin access to role editor. |
| **Test Data** | Custom role "INV-Cascade": See Financial Data ON, Manage AP/AR ON (to avoid gate modals interfering with cascade checks). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open "INV-Cascade" with See Financial Data ON, Manage AP/AR ON, Invoicing all OFF. | Editor open; no gate modal expected since financial toggles are already ON. |
| 2 | Enable Invoicing Delete. | Edit and View auto-enable (Delete → Edit + View). |
| 3 | Disable Invoicing View. | Edit and Delete auto-disable (View OFF → Edit + Delete OFF). |
| 4 | Enable Invoicing Edit, then disable Edit. | Enabling Edit enables View; disabling Edit disables Delete. |

**Expected Final Result:** The standard CRUD cascade (Edit→View, Delete→Edit+View, View OFF→Edit+Delete OFF, Edit OFF→Delete OFF) applies within Invoicing, on top of the financial gates.

---
