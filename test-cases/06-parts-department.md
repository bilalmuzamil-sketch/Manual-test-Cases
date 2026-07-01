# Parts Department Permissions (Area code: PARTS)

> **Epic:** [SV-7388 – Custom Roles and Permissions](https://shopview.atlassian.net/browse/SV-7388)
> **Spec:** [Custom Roles and Permissions (Confluence)](https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions)

**Scope:** Verifies the Parts Department parent gate (SV-7520) and its three child CRUD areas — Part Sales (SV-7512), Catalog & Inventory (SV-7513), and Vendor & Order Management (SV-7514) — including the parent-gate hide/preserve behavior, the role-editor slide transition, per-child View/Edit/Delete effects, the "See Financial Data" dependency and confirmation modal for Part Sales, and the URL-manipulation security regression (SV-7965).

## Prerequisites
- File `00-test-environment-and-setup.md` completed: test shop with sample data (parts, catalog/inventory records, vendors with POs, part sales), an Administrator account, and dedicated test users.
- Two browsers or one browser plus an incognito/private window (role changes force logout — see CR-SETUP-005).
- Ability to create/edit custom roles via Administration > Roles and Permissions and to assign roles via Administration > Staff.
- Reminder: to test any permission, configure a custom role with the setting, assign it to a test user, log in as that user (role changes force logout), then verify the effect.
- CRUD cascade rules apply throughout: enabling Edit enables View; enabling Delete enables Edit + View; disabling View disables Edit + Delete; disabling Edit disables Delete. Turning View OFF also hides the area's navigation.

## Test Cases

### CR-PARTS-001 — Parent gate OFF hides all three child areas for the end user

| Field | Value |
|---|---|
| **Related Jira** | SV-7520 |
| **Priority** | Critical |
| **Type** | Dependency |
| **Preconditions** | Admin access to role editor. A test user available for assignment. |
| **Test Data** | Custom role "PARTS-ParentOff": Parts Department = OFF, but each child (Part Sales, Catalog & Inventory, Vendor & Order Management) configured with View = ON. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | As Administrator, create custom role "PARTS-ParentOff" with Parts Department OFF and, if reachable, each child's View ON. Save. | Role saves. |
| 2 | Assign "PARTS-ParentOff" to the test user and save. | Assignment saves; the user is forced to log out if currently logged in. |
| 3 | Log in as the test user in Browser A. | Login succeeds. |
| 4 | Inspect the main navigation. | No Part Sales, Catalog & Inventory, or Vendor & Order Management nav entries appear. The Parts department is inaccessible. |

**Expected Final Result:** With Parts Department OFF, none of the three child areas are accessible to the user regardless of the children's own CRUD settings.

---

### CR-PARTS-002 — Parent gate OFF preserves child settings; toggling ON restores them

| Field | Value |
|---|---|
| **Related Jira** | SV-7520 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | Admin access to role editor. |
| **Test Data** | Custom role "PARTS-Preserve" with Parts Department ON and distinct child settings: Part Sales = View+Edit, Catalog & Inventory = View only, Vendor & Order Management = View+Edit+Delete. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create "PARTS-Preserve" with Parts Department ON and the child settings above. Save. | Role saves with the three children configured as specified. |
| 2 | Reopen the role, turn Parts Department OFF, and save. | Role saves; the three child areas are gated off. |
| 3 | Reopen the role, turn Parts Department back ON. | The three children reappear with their PREVIOUSLY saved settings intact (Part Sales View+Edit, Catalog View only, Vendor View+Edit+Delete) — not reset or blanked. |
| 4 | Save and reassign to the test user; log in as the test user. | User sees exactly the previously configured access for each child. |

**Expected Final Result:** Turning Parts Department OFF preserves each child's CRUD configuration; turning it back ON restores those exact settings.

---

### CR-PARTS-003 — Role editor slide-hides the three children when Parts Department is turned OFF

| Field | Value |
|---|---|
| **Related Jira** | SV-7520 |
| **Priority** | Medium |
| **Type** | UI |
| **Preconditions** | Admin access to role editor. |
| **Test Data** | Any custom role, e.g. "PARTS-Editor-UI". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open "PARTS-Editor-UI" in the role editor with Parts Department ON. | The three child sections (Part Sales, Catalog & Inventory, Vendor & Order Management) are visible. |
| 2 | Toggle Parts Department OFF. | The three child sections are hidden via a slide transition (animated collapse), not an abrupt removal. |
| 3 | Toggle Parts Department back ON. | The three child sections slide back into view with their prior settings shown. |

**Expected Final Result:** In the role editor, the three children are shown/hidden with a slide transition driven by the Parts Department toggle.

---

### CR-PARTS-004 — Part Sales View: positive (records, returns, transactions visible)

| Field | Value |
|---|---|
| **Related Jira** | SV-7512 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Sample part sales, returns, and part transactions exist. See Financial Data ON (Part Sales is financially gated). |
| **Test Data** | Custom role "PS-View": Parts Department ON, See Financial Data ON, Part Sales = View only. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create "PS-View" and assign to the test user. | Role saves and assigns. |
| 2 | Log in as the test user and open Part Sales. | Part Sales nav is visible; the area opens. |
| 3 | View part sales records, returns, and part transactions. | The user can view part sales records, returns, and part transactions. |
| 4 | Look for create/process and delete controls. | Create/process and delete actions are absent or disabled (View only). |

**Expected Final Result:** With Part Sales View only, the user can view part sales records, returns, and transactions but cannot create, process, or delete.

---

### CR-PARTS-005 — Part Sales View OFF: negative (nav hidden, area inaccessible)

| Field | Value |
|---|---|
| **Related Jira** | SV-7512 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Parts Department ON. |
| **Test Data** | Custom role "PS-NoView": Parts Department ON, Part Sales = all OFF (View OFF). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create "PS-NoView" and assign to the test user. | Role saves and assigns. |
| 2 | Log in as the test user and inspect navigation. | No Part Sales nav entry appears (View OFF hides the area nav). |

**Expected Final Result:** With Part Sales View OFF, the Part Sales navigation is hidden and the area is inaccessible.

---

### CR-PARTS-006 — Part Sales Edit: positive (create sales/returns, process transactions)

| Field | Value |
|---|---|
| **Related Jira** | SV-7512 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | See Financial Data ON. |
| **Test Data** | Custom role "PS-Edit": Parts Department ON, See Financial Data ON, Part Sales = View+Edit. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create "PS-Edit" (enabling Edit auto-enables View) and assign to the test user. | Role saves with View + Edit ON. |
| 2 | Log in as the test user and open Part Sales. | Area is accessible. |
| 3 | Create a new part sale. | The part sale is created successfully. |
| 4 | Create a part return. | The part return is created successfully. |
| 5 | Process a part transaction. | The transaction is processed successfully. |
| 6 | Attempt to delete a part sale or reverse an invoice. | Delete/reverse actions are absent or disabled (Delete OFF). |

**Expected Final Result:** With Part Sales Edit, the user can create part sales/returns and process transactions but cannot delete or reverse.

---

### CR-PARTS-007 — Part Sales Delete: positive (delete sales, reverse invoices)

| Field | Value |
|---|---|
| **Related Jira** | SV-7512 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | See Financial Data ON. At least one part sale and one part-sale invoice exist. |
| **Test Data** | Custom role "PS-Delete": Parts Department ON, See Financial Data ON, Part Sales = View+Edit+Delete. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create "PS-Delete" (Delete auto-enables Edit + View) and assign to the test user. | Role saves with View + Edit + Delete ON. |
| 2 | Log in as the test user and open Part Sales. | Area is accessible. |
| 3 | Delete an existing part sale. | The part sale is deleted successfully. |
| 4 | Reverse a part sales invoice. | The part sales invoice is reversed successfully. |

**Expected Final Result:** With Part Sales Delete, the user can delete part sales and reverse part sales invoices.

---

### CR-PARTS-008 — Part Sales Delete OFF: negative (cannot delete/reverse)

| Field | Value |
|---|---|
| **Related Jira** | SV-7512 |
| **Priority** | Medium |
| **Type** | Negative |
| **Preconditions** | See Financial Data ON. |
| **Test Data** | Custom role "PS-EditNoDelete": Parts Department ON, See Financial Data ON, Part Sales = View+Edit (Delete OFF). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create "PS-EditNoDelete" and assign to the test user. | Role saves. |
| 2 | Log in as the test user, open Part Sales, and attempt to delete a part sale. | No delete control is available, or the attempt is blocked. |
| 3 | Attempt to reverse a part sales invoice. | No reverse control is available, or the attempt is blocked. |

**Expected Final Result:** Without Part Sales Delete, the user cannot delete part sales or reverse part sales invoices.

---

### CR-PARTS-009 — Part Sales financial dependency: confirmation modal appears when enabling a CRUD checkbox with See Financial Data OFF, and CONFIRMING proceeds

| Field | Value |
|---|---|
| **Related Jira** | SV-7512 |
| **Priority** | Critical |
| **Type** | Dependency |
| **Preconditions** | Admin access to role editor. |
| **Test Data** | Custom role "PS-FinGate": Parts Department ON, See Financial Data OFF initially. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create/open "PS-FinGate" with Parts Department ON and See Financial Data OFF. | Role editor open. |
| 2 | Enable any Part Sales CRUD checkbox (e.g. View). | A "Financial Data" confirmation modal appears, explaining that enabling this requires/turns on See Financial Data. |
| 3 | Click Confirm (the affirmative action) in the modal. | The modal closes; the Part Sales checkbox is enabled and See Financial Data is turned ON. |
| 4 | Save and log in as an assigned test user. | The user has Part Sales access and can see financial data. |

**Expected Final Result:** Enabling a Part Sales CRUD checkbox while See Financial Data is OFF triggers the Financial Data confirmation modal; confirming enables both the checkbox and See Financial Data.

---

### CR-PARTS-010 — Part Sales financial dependency: CANCELLING the confirmation modal leaves the checkbox unchanged

| Field | Value |
|---|---|
| **Related Jira** | SV-7512 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | Admin access to role editor. |
| **Test Data** | Custom role "PS-FinGate-Cancel": Parts Department ON, See Financial Data OFF. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open "PS-FinGate-Cancel" with See Financial Data OFF. | Role editor open. |
| 2 | Enable any Part Sales CRUD checkbox. | The Financial Data confirmation modal appears. |
| 3 | Click Cancel (the negative action) in the modal. | The modal closes; the Part Sales checkbox reverts to OFF and See Financial Data remains OFF. |

**Expected Final Result:** Cancelling the Financial Data modal leaves the Part Sales checkbox and See Financial Data unchanged (both OFF).

---

### CR-PARTS-011 — SECURITY (SV-7965): user without Part Sales access cannot reach Part Sales via direct URL

| Field | Value |
|---|---|
| **Related Jira** | SV-7965 |
| **Priority** | Critical |
| **Type** | Security |
| **Preconditions** | A known Part Sales URL/route (e.g. a part sale detail or the part sales list). A user who lacks Part Sales access. |
| **Test Data** | Custom role "PS-NoAccess": Part Sales access denied (either Part Sales View OFF, or See Financial Data OFF such that Part Sales is not granted). Capture a valid Part Sales URL while logged in as an authorized user first. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | While logged in as an authorized user, copy a valid Part Sales URL (list and a specific record). | URLs captured. |
| 2 | Assign "PS-NoAccess" to the test user and log in as that user. | No Part Sales nav is visible. |
| 3 | Paste the captured Part Sales list URL directly into the address bar and navigate. | Access is denied — user is blocked/redirected (e.g. to a not-authorized page or dashboard); part sales data is NOT rendered. |
| 4 | Paste the captured Part Sales record URL directly and navigate. | Access is denied; the specific part sale is NOT rendered. |

**Expected Final Result:** A user without Part Sales access cannot reach Part Sales through direct URL manipulation; the previous bypass (SV-7965) is closed. Any successful access is a security failure.

---

### CR-PARTS-012 — Catalog & Inventory View: positive (browse catalog, inventory levels, parts history)

| Field | Value |
|---|---|
| **Related Jira** | SV-7513 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Parts Department ON. Sample catalog entries, inventory levels, and parts history exist. |
| **Test Data** | Custom role "CI-View": Parts Department ON, Catalog & Inventory = View only. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create "CI-View" and assign to the test user. | Role saves and assigns. |
| 2 | Log in as the test user and open Catalog & Inventory. | Area is accessible. |
| 3 | Browse the catalog, view inventory levels/stock, and view parts history. | All three are viewable. |
| 4 | Look for create/edit/adjust and delete controls. | Edit and Delete actions are absent or disabled (View only). |

**Expected Final Result:** With Catalog & Inventory View only, the user can browse the catalog, inventory levels/stock, and parts history but cannot edit or delete.

---

### CR-PARTS-013 — Catalog & Inventory View OFF: negative (nav hidden)

| Field | Value |
|---|---|
| **Related Jira** | SV-7513 |
| **Priority** | Medium |
| **Type** | Negative |
| **Preconditions** | Parts Department ON. |
| **Test Data** | Custom role "CI-NoView": Parts Department ON, Catalog & Inventory = all OFF. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create "CI-NoView" and assign to the test user. | Role saves and assigns. |
| 2 | Log in as the test user and inspect navigation. | No Catalog & Inventory nav entry appears (View OFF hides the area nav). |

**Expected Final Result:** With Catalog & Inventory View OFF, the area navigation is hidden and the area is inaccessible.

---

### CR-PARTS-014 — Catalog & Inventory Edit: positive (catalog entries, inventory adjustments incl. return-to-inventory, cycle counts)

| Field | Value |
|---|---|
| **Related Jira** | SV-7513 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Parts Department ON. An item eligible to be returned to inventory exists; a stock location supports cycle counts. |
| **Test Data** | Custom role "CI-Edit": Parts Department ON, Catalog & Inventory = View+Edit. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create "CI-Edit" (Edit auto-enables View) and assign to the test user. | Role saves with View + Edit ON. |
| 2 | Log in as the test user and open Catalog & Inventory. | Area is accessible. |
| 3 | Create or edit a catalog entry. | The catalog entry is created/edited successfully. |
| 4 | Perform an inventory adjustment, including RETURNING an item to inventory. | The adjustment succeeds; the item is returned to inventory. |
| 5 | Manage stock levels via a cycle count. | The cycle count can be performed and stock levels updated. |
| 6 | Attempt to delete a part from the catalog. | Delete is absent or disabled (Delete OFF). |

**Expected Final Result:** With Catalog & Inventory Edit, the user can create/edit catalog entries, perform inventory adjustments including return-to-inventory, and run cycle counts, but cannot delete catalog parts.

---

### CR-PARTS-015 — Catalog & Inventory Delete: positive and negative (delete parts from catalog)

| Field | Value |
|---|---|
| **Related Jira** | SV-7513 |
| **Priority** | Medium |
| **Type** | Positive |
| **Preconditions** | Parts Department ON. A deletable catalog part exists. |
| **Test Data** | Role "CI-Delete" (Parts Department ON, Catalog & Inventory View+Edit+Delete) and role "CI-EditOnly" (View+Edit, Delete OFF). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Assign "CI-Delete" to the test user and log in. | Catalog & Inventory accessible with full CRUD. |
| 2 | Delete a part from the catalog. | The part is deleted successfully. |
| 3 | Reassign "CI-EditOnly" to the test user, log out/in, and attempt to delete a catalog part. | No delete control is available, or the attempt is blocked (Delete OFF). |

**Expected Final Result:** Catalog & Inventory Delete allows deleting catalog parts; without Delete the user cannot delete catalog parts.

---

### CR-PARTS-016 — Vendor & Order Management View: positive (vendors, POs, deliveries, part history, part return requests)

| Field | Value |
|---|---|
| **Related Jira** | SV-7514 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Parts Department ON. Sample vendors, POs, deliveries, part history, and part return requests exist. |
| **Test Data** | Custom role "VOM-View": Parts Department ON, Vendor & Order Management = View only. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create "VOM-View" and assign to the test user. | Role saves and assigns. |
| 2 | Log in as the test user and open Vendor & Order Management. | Area is accessible. |
| 3 | View vendor records, purchase orders (POs), deliveries, part history, and part return requests. | All are viewable. (Use "part history" per final spec, not "vendor transaction history".) |
| 4 | Look for create/edit and delete controls. | Edit and Delete actions are absent or disabled (View only). |

**Expected Final Result:** With Vendor & Order Management View only, the user can view vendors, POs, deliveries, part history, and part return requests but cannot edit or delete.

---

### CR-PARTS-017 — Vendor & Order Management View OFF: negative (nav hidden)

| Field | Value |
|---|---|
| **Related Jira** | SV-7514 |
| **Priority** | Medium |
| **Type** | Negative |
| **Preconditions** | Parts Department ON. |
| **Test Data** | Custom role "VOM-NoView": Parts Department ON, Vendor & Order Management = all OFF. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create "VOM-NoView" and assign to the test user. | Role saves and assigns. |
| 2 | Log in as the test user and inspect navigation. | No Vendor & Order Management nav entry appears (View OFF hides the area nav). |

**Expected Final Result:** With Vendor & Order Management View OFF, the area navigation is hidden and the area is inaccessible.

---

### CR-PARTS-018 — Vendor & Order Management Edit: positive (create/edit vendors, create/manage POs, deliveries, vendor invoices, return parts)

| Field | Value |
|---|---|
| **Related Jira** | SV-7514 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Parts Department ON. A part eligible to be returned to a vendor/inventory exists. |
| **Test Data** | Custom role "VOM-Edit": Parts Department ON, Vendor & Order Management = View+Edit. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create "VOM-Edit" (Edit auto-enables View) and assign to the test user. | Role saves with View + Edit ON. |
| 2 | Log in as the test user and open Vendor & Order Management. | Area is accessible. |
| 3 | Create or edit a vendor. | The vendor is created/edited successfully. |
| 4 | Create and manage a purchase order (PO). | The PO is created and can be managed. |
| 5 | Manage a delivery. | The delivery is managed successfully. |
| 6 | Create a vendor invoice. | The vendor invoice is created successfully. |
| 7 | Return a part to the vendor/inventory. | The part return to vendor/inventory succeeds. |
| 8 | Attempt to delete a vendor or a PO. | Delete is absent or disabled (Delete OFF). |

**Expected Final Result:** With Vendor & Order Management Edit, the user can create/edit vendors, create/manage POs, manage deliveries, create vendor invoices, and return parts to vendors/inventory, but cannot delete vendors or POs.

---

### CR-PARTS-019 — Vendor & Order Management Delete: positive and negative (delete vendors, delete POs)

| Field | Value |
|---|---|
| **Related Jira** | SV-7514 |
| **Priority** | Medium |
| **Type** | Positive |
| **Preconditions** | Parts Department ON. A deletable vendor and a deletable PO exist. |
| **Test Data** | Role "VOM-Delete" (Parts Department ON, Vendor & Order Management View+Edit+Delete) and role "VOM-EditOnly" (View+Edit, Delete OFF). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Assign "VOM-Delete" to the test user and log in. | Vendor & Order Management accessible with full CRUD. |
| 2 | Delete a vendor. | The vendor is deleted successfully. |
| 3 | Delete a PO. | The PO is deleted successfully. |
| 4 | Reassign "VOM-EditOnly", log out/in, and attempt to delete a vendor and a PO. | No delete controls are available, or the attempts are blocked (Delete OFF). |

**Expected Final Result:** Vendor & Order Management Delete allows deleting vendors and POs; without Delete the user cannot delete them.

---

### CR-PARTS-020 — CRUD cascade within a Parts child area

| Field | Value |
|---|---|
| **Related Jira** | SV-7513 |
| **Priority** | Medium |
| **Type** | Dependency |
| **Preconditions** | Admin access to role editor. Parts Department ON. |
| **Test Data** | Custom role "CI-Cascade". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open "CI-Cascade" with Parts Department ON and all Catalog & Inventory levels OFF. | Editor open. |
| 2 | Enable Catalog & Inventory Delete. | Edit and View auto-enable (Delete → Edit + View). |
| 3 | Disable Catalog & Inventory View. | Edit and Delete auto-disable (View OFF → Edit + Delete OFF). |
| 4 | Enable Catalog & Inventory Edit, then disable Edit. | Enabling Edit enables View; disabling Edit disables Delete. |

**Expected Final Result:** The standard CRUD cascade (Edit→View, Delete→Edit+View, View OFF→Edit+Delete OFF, Edit OFF→Delete OFF) applies within each Parts child area.

---
