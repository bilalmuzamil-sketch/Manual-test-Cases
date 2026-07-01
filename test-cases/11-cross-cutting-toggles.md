# Cross-Cutting Toggles (XCUT)

> **Epic:** [SV-7388 – Custom Roles and Permissions](https://shopview.atlassian.net/browse/SV-7388)
> **Spec:** [Custom Roles and Permissions (Confluence)](https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions)

**Scope:** Verifies the three independent cross-cutting permission toggles that span multiple areas of the app: See Financial Data (SV-7523), Manage Accounts Payable and Receivable (SV-7524), and View History Logs (SV-7525). Covers their app-wide show/hide behavior, dependencies (Part Sales/Invoicing require See Financial Data; Invoicing delete additionally requires Manage AP/AR), their independence from one another, and the SV-7973 financial-data-leak regression.

> **Note (label drift for awareness):** The final permission name is "Manage Accounts Payable and Receivable" (`seeApArData`); an older label was "View and Manage AP/AR". If the UI still shows the older label, note it but treat it as the same toggle.

## Prerequisites
- File `00-test-environment-and-setup.md` completed: test shop with sample work orders (with lines), part sales, invoices, customers, and vendors; an Administrator account; per-role test users.
- Ability to create/edit custom roles under Administration > Roles and Permissions and assign them to a test user via Administration > Staff.
- Two browsers (or one browser plus incognito): one for the Administrator to reconfigure roles, one for the test user. Changing a user's role forces that user to log out; new permissions apply on next login.
- To test any toggle: create/pick a custom role with the toggles set as required, assign it to a test user, log in as that user, verify the effect, then reset to baseline.

## Test Cases

### CR-XCUT-001 — See Financial Data ON shows financial data app-wide

| Field | Value |
|---|---|
| **Related Jira** | SV-7523 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | Admin can edit roles; sample data with pricing/costs exists. |
| **Test Data** | Custom role "QA Financial ON" with See Financial Data ON plus View access to Work Orders, Part Sales, Invoicing, and Reports; test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create "QA Financial ON" (See Financial Data ON; Work Orders View, Part Sales View, Invoicing View, Reports ON). Assign to test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user; open a work order with lines. | Labor rates, parts pricing, and total/labor/parts columns and summaries are visible. |
| 3 | Open Part Sales. | Pricing/cost/margin columns and totals are visible. |
| 4 | Open Invoicing and an invoice. | Financial totals are visible. |
| 5 | Open Reports and a financial report. | Cost/margin/financial figures are visible. |

**Expected Final Result:** With See Financial Data ON, all pricing, costs, margins, totals, and financial columns/summaries are visible across work orders, part sales, invoicing, and reports.

---

### CR-XCUT-002 — See Financial Data OFF hides all financial data app-wide

| Field | Value |
|---|---|
| **Related Jira** | SV-7523 |
| **Priority** | Critical |
| **Type** | Negative |
| **Preconditions** | Admin can edit roles. |
| **Test Data** | Custom role "QA Financial OFF" with See Financial Data OFF plus View access to Work Orders, Part Sales, Invoicing, and Reports; test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create "QA Financial OFF" (See Financial Data OFF; Work Orders View, Part Sales View, Invoicing View, Reports ON). Assign to test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user; open a work order with lines. | No labor rates, no parts pricing, no total/labor/parts columns, no cost/margin, no financial summaries are shown. |
| 3 | Open Part Sales. | Pricing/cost/margin columns and totals are hidden. |
| 4 | Open Invoicing and an invoice. | Financial totals are hidden. |
| 5 | Open Reports. | Financial figures are hidden; financial-only reports are unavailable per report gating. |

**Expected Final Result:** With See Financial Data OFF, all financial data is hidden everywhere in the app. It is a single app-wide toggle with no per-area granularity.

---

### CR-XCUT-003 — See Financial Data OFF still allows CRUD actions

| Field | Value |
|---|---|
| **Related Jira** | SV-7523 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | CR-XCUT-002 role available, extended with Edit permissions where noted. |
| **Test Data** | Custom role "QA Financial OFF + Edit" with See Financial Data OFF but Work Orders View/Edit ON and Customers View/Edit ON; test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create the role (See Financial Data OFF; Work Orders View/Edit ON; Customers View/Edit ON). Assign to test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user; create or edit a work order. | Create/edit succeeds even though financial values are hidden. |
| 3 | Create or edit a customer. | Create/edit succeeds. |

**Expected Final Result:** See Financial Data OFF hides monetary values but does not block CRUD — records can still be created and edited normally. (Note: Part Sales and Invoicing CRUD have a separate dependency on this toggle — see CR-XCUT-004.)

---

### CR-XCUT-004 — Dependency: enabling Part Sales / Invoicing CRUD while Financial is OFF triggers the Financial Data confirmation modal

| Field | Value |
|---|---|
| **Related Jira** | SV-7523 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | Admin can edit roles; editing a role in the Roles and Permissions editor. |
| **Test Data** | A custom role open in the editor with See Financial Data OFF. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, open a custom role with See Financial Data OFF. | Role opens; financial toggle is OFF. |
| 2 | Enable Part Sales Edit (create & edit) while See Financial Data is still OFF. | A Financial Data confirmation modal appears, indicating Part Sales requires See Financial Data. |
| 3 | Confirm/accept in the modal. | See Financial Data is enabled together with the Part Sales CRUD (dependency satisfied), OR the change is blocked until confirmed, per the modal's design. |
| 4 | Repeat with Invoicing Edit while See Financial Data is OFF (reset the role first). | The same Financial Data confirmation modal appears for Invoicing. |

**Expected Final Result:** Enabling Part Sales or Invoicing CRUD while See Financial Data is OFF triggers the Financial Data confirmation modal; those CRUD areas cannot function without See Financial Data ON. Confirming resolves the dependency.

---

### CR-XCUT-005 — Security regression: Receive Part modal must not expose financial info when financial perms are disabled (SV-7973)

| Field | Value |
|---|---|
| **Related Jira** | SV-7973 |
| **Priority** | Critical |
| **Type** | Regression |
| **Preconditions** | Admin can edit roles; a vendor order that can be received exists. |
| **Test Data** | Custom role "QA Financial OFF + Receive" with See Financial Data OFF plus the permissions needed to open the Receive Part flow (Vendor & Order Management View/Edit as required); test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create the role (See Financial Data OFF; permissions to reach Receive Part). Assign to test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user and open a vendor order, then open the Receive Part modal. | The modal opens. |
| 3 | Inspect every field in the Receive Part modal. | NO financial information (unit cost, extended cost, pricing, totals, margins) is shown. |

**Expected Final Result:** The Receive Part modal exposes no financial information when See Financial Data is OFF, confirming SV-7973 remains fixed. Any financial value visible here is a reopened security defect.

---

### CR-XCUT-006 — Regression: Invoiced/Paid status filters unavailable without See Financial Data (SV-7943)

| Field | Value |
|---|---|
| **Related Jira** | SV-7943 |
| **Priority** | Medium |
| **Type** | Regression |
| **Preconditions** | Admin can edit roles. |
| **Test Data** | Custom role "QA Financial OFF" (See Financial Data OFF) with access to a list view that offers Invoiced/Paid status filters; test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the test user whose role has See Financial Data OFF. | Login succeeds. |
| 2 | Open the list/view that offers status filters (e.g. work orders or invoicing list). | The list loads. |
| 3 | Open the status filter options. | The Invoiced and Paid status filters are NOT available (they are financial-status filters gated by See Financial Data). |

**Expected Final Result:** Without See Financial Data, the Invoiced/Paid status filters are unavailable, per SV-7943. Their presence for a no-financial user is a defect.

---

### CR-XCUT-007 — Manage AP/AR ON shows AP/AR tabs, aging reports, bulk payments, and sensitive customer fields

| Field | Value |
|---|---|
| **Related Jira** | SV-7524 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Admin can edit roles; sample customers and vendors with unpaid invoices exist. |
| **Test Data** | Custom role "QA AP/AR ON" with Manage AP/AR ON plus Customers View and Vendor & Order Management View and Reports ON; test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create "QA AP/AR ON" (Manage AP/AR ON; Customers View; Vendor & Order Management View; Reports ON). Assign to test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user; open a Customer detail page and a Vendor detail page. | The Unpaid Invoices, Payments, and Credits tabs are visible on both. |
| 3 | Open the Unpaid Invoices tab and initiate a bulk payment. | Bulk payment from the Unpaid Invoices tab is available. |
| 4 | Open Reports and look for AP/AR aging reports. | AR Aging Summary, AR Aging Detail, AR Aging Collection, AP Aging Summary, AP Aging Detail, and AP Unpaid Invoices reports are available. |
| 5 | Open the Edit Customer modal and the Customer Overview panel. | The sensitive customer fields (AP/AR-gated) are visible. |

**Expected Final Result:** With Manage AP/AR ON, the AP/AR tabs, the six aging reports, bulk payments from Unpaid Invoices, and the sensitive customer fields on the Edit Customer modal and Customer Overview panel are all available.

---

### CR-XCUT-008 — Manage AP/AR OFF hides AP/AR tabs, aging reports, bulk payments, and sensitive customer fields

| Field | Value |
|---|---|
| **Related Jira** | SV-7524 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Admin can edit roles. |
| **Test Data** | Custom role "QA AP/AR OFF" with Manage AP/AR OFF plus Customers View, Vendor & Order Management View, and Reports ON; test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create "QA AP/AR OFF" (Manage AP/AR OFF; Customers View; Vendor & Order Management View; Reports ON). Assign to test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user; open a Customer detail page and a Vendor detail page. | The Unpaid Invoices, Payments, and Credits tabs are NOT visible on either. |
| 3 | Open Reports and look for AP/AR aging reports. | None of the six AP/AR aging reports are available. |
| 4 | Look for any bulk-payment action. | Bulk payments from the Unpaid Invoices tab are unavailable (the tab itself is hidden). |
| 5 | Open the Edit Customer modal and the Customer Overview panel. | The sensitive AP/AR-gated customer fields are NOT visible. |
| 6 | Attempt to reach an AP/AR aging report or the Unpaid Invoices tab by direct URL if known. | Access is blocked. |

**Expected Final Result:** With Manage AP/AR OFF, the AP/AR tabs, aging reports, bulk payments, and sensitive customer fields are all hidden and unreachable.

---

### CR-XCUT-009 — Manage AP/AR is independent from See Financial Data (Financial ON + AP/AR OFF)

| Field | Value |
|---|---|
| **Related Jira** | SV-7524 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | Admin can edit roles. This mirrors the real Service Advisor configuration. |
| **Test Data** | Custom role "QA Financial ON, AP/AR OFF" with See Financial Data ON and Manage AP/AR OFF plus Customers View, Part Sales View, Invoicing View, Reports ON; test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create the role (See Financial Data ON; Manage AP/AR OFF; Customers View; Part Sales View; Invoicing View; Reports ON). Assign to test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user; open a work order and part sales. | Financial data (pricing/costs/totals) IS visible (Financial ON). |
| 3 | Open a Customer detail page. | The Unpaid Invoices/Payments/Credits tabs are NOT visible (AP/AR OFF). |
| 4 | Open Reports. | AP/AR aging reports are NOT available (AP/AR OFF), even though other financial reports are. |
| 5 | Open the Edit Customer modal / Customer Overview panel. | The sensitive AP/AR-gated customer fields are NOT visible. |

**Expected Final Result:** A role can have See Financial Data ON while Manage AP/AR is OFF: financial values show everywhere, but AP/AR tabs, aging reports, and sensitive customer fields remain hidden. The two toggles are independent.

---

### CR-XCUT-010 — Manage AP/AR does not gate any CRUD area

| Field | Value |
|---|---|
| **Related Jira** | SV-7524 |
| **Priority** | Medium |
| **Type** | Positive |
| **Preconditions** | Admin can edit roles. |
| **Test Data** | Custom role "QA AP/AR OFF + CRUD" with Manage AP/AR OFF but Work Orders View/Edit ON, Customers View/Edit ON, and Invoicing View/Edit ON (with See Financial Data ON so Invoicing works); test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create the role (Manage AP/AR OFF; Work Orders View/Edit; Customers View/Edit; Invoicing View/Edit; See Financial Data ON). Assign to test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user; create/edit a work order, a customer, and an invoice. | All CRUD actions succeed despite Manage AP/AR being OFF. |

**Expected Final Result:** Manage AP/AR does not gate any CRUD area — records can be created/edited/deleted per their own CRUD permissions regardless of the AP/AR toggle. (Exception: Invoicing DELETE additionally requires Manage AP/AR ON — see CR-XCUT-011.)

---

### CR-XCUT-011 — Cross-dependency: Invoicing DELETE additionally requires Manage AP/AR ON

| Field | Value |
|---|---|
| **Related Jira** | SV-7524 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | Admin can edit roles; a deletable sample invoice exists. |
| **Test Data** | Two roles: (A) "QA Invoice Delete, AP/AR OFF" = Invoicing View/Edit/Delete ON, See Financial Data ON, Manage AP/AR OFF; (B) same but Manage AP/AR ON. One test user cycled through both. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Assign role A (Invoicing Delete ON but AP/AR OFF) to the test user; save; log in as the user; open an invoice. | Invoice opens. |
| 2 | Attempt to delete the invoice. | Delete is NOT permitted — the delete action is unavailable/blocked because Manage AP/AR is OFF. |
| 3 | As Administrator, switch the test user to role B (Manage AP/AR ON); save; re-log-in as the user. | User forced to log out; new login applies role B. |
| 4 | Open an invoice and attempt to delete it. | Delete succeeds (Invoicing Delete ON and Manage AP/AR ON). |

**Expected Final Result:** Deleting an invoice requires both Invoicing Delete and Manage AP/AR ON. With Manage AP/AR OFF, invoice deletion is blocked even when Invoicing Delete is granted.

---

### CR-XCUT-012 — View History Logs ON shows history/audit logs

| Field | Value |
|---|---|
| **Related Jira** | SV-7525 |
| **Priority** | Medium |
| **Type** | Positive |
| **Preconditions** | Admin can edit roles; sample records with history exist (a work order that has been edited, a part sale, a parts order). |
| **Test Data** | Custom role "QA History ON" with View History Logs ON plus View access to Work Orders, Part Sales, and Vendor & Order Management; test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create "QA History ON" (View History Logs ON; Work Orders View; Part Sales View; Vendor & Order Management View). Assign to test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user; open a work order and view its history log. | The WO history/audit log is visible. |
| 3 | Open a part sale and view its history. | The part sales history is visible. |
| 4 | Open a parts order and view its history. | The parts order history is visible. |

**Expected Final Result:** With View History Logs ON, history/audit logs (WO history, part sales history, parts order history, etc.) are visible throughout the app.

---

### CR-XCUT-013 — View History Logs OFF hides history/audit logs

| Field | Value |
|---|---|
| **Related Jira** | SV-7525 |
| **Priority** | Medium |
| **Type** | Negative |
| **Preconditions** | Admin can edit roles. |
| **Test Data** | Custom role "QA History OFF" with View History Logs OFF plus View access to Work Orders, Part Sales, and Vendor & Order Management; test user assigned this role. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create "QA History OFF" (View History Logs OFF; Work Orders View; Part Sales View; Vendor & Order Management View). Assign to test user; save. | Role saved; user forced to log out. |
| 2 | Log in as the test user; open a work order and look for its history log. | The WO history/audit log is NOT visible. |
| 3 | Open a part sale and a parts order and look for their history. | Part sales history and parts order history are NOT visible. |
| 4 | Attempt to reach a history log by direct URL if known. | Access is blocked. |

**Expected Final Result:** With View History Logs OFF, history/audit logs are hidden throughout the app and unreachable by direct URL.

---
