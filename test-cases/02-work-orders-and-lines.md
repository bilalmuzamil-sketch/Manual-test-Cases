# Work Orders & Work Order Lines — Custom Roles & Permissions Test Cases

> **Epic:** [SV-7388 – Custom Roles and Permissions](https://shopview.atlassian.net/browse/SV-7388)
> **Spec:** [Custom Roles and Permissions (Confluence)](https://shopview.atlassian.net/wiki/spaces/PM/pages/565116952/Custom+Roles+and+Permissions)

**Scope:** Verifies the Work Orders permission (`workOrders`, CRUD with bidirectional cascade), the three independent Work Order sub-settings (`woReviewWorkOrders`, `woPickParts`, `woOrderParts`), and Work Order Lines (`workOrderLines`) including the inspection delete/reopen gating. Area code **WO** (IDs CR-WO-001 …).

## Prerequisites
- Access to a ShopView tenant where you can create and edit **Custom Roles** (permission to manage roles).
- At least one test user account you can assign custom roles to and log in as (a second browser/incognito session is convenient).
- Remember: **any role/permission change forces the affected user to log out.** After changing a role, the test user must log back in for the new permissions to take effect.
- At least one existing Work Order with lines, a customer, an asset, and at least one line that has parts on it (for pick/order/return checks).
- At least one Work Order that has an **invoice** with **no payments made** (needed to test invoice reversal), and one with payments made (to confirm reversal is blocked by validation regardless of permission).
- At least one Digital Inspection on a WO line that is **not yet complete**, and one **completed** inspection (for reopen tests).
- Ability to create/edit Purchase Orders is available in the tenant (for Order Parts tests).

## Test Cases

### CR-WO-001 — Work Orders View ON: user can see nav, list, and detail

| Field | Value |
|---|---|
| **Related Jira** | SV-7506 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | A custom role with Work Orders → **View** ON (Edit/Delete OFF). Role assigned to test user. |
| **Test Data** | Custom role "WO Viewer"; at least one existing Work Order. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create/pick custom role "WO Viewer" with Work Orders → View ON, Edit OFF, Delete OFF. | Role saves. Edit and Delete remain OFF (View does not cascade upward). |
| 2 | Assign the role to the test user and have them log out and log back in. | User session refreshes with the new role. |
| 3 | As the test user, look at the top-level navigation. | The **Work Orders** nav item is visible. |
| 4 | Open the Work Orders list. | The list of Work Orders is visible. |
| 5 | Click a Work Order to open its detail page. | The WO detail page opens and is viewable. |

**Expected Final Result:** A View-only user can reach the Work Orders nav, list, and detail pages.

---

### CR-WO-002 — Work Orders View OFF: nav item hidden

| Field | Value |
|---|---|
| **Related Jira** | SV-7506 |
| **Priority** | Critical |
| **Type** | Negative |
| **Preconditions** | A custom role with Work Orders → View OFF (and therefore Edit/Delete OFF). Role assigned to test user. |
| **Test Data** | Custom role "No WO Access". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create/pick custom role "No WO Access" with Work Orders → View OFF. | Role saves; Edit and Delete are also OFF/greyed. |
| 2 | Assign to test user; user logs out and back in. | New role active. |
| 3 | As the test user, inspect the top-level navigation. | The **Work Orders** nav item is **hidden** — no entry point to WO list or detail. |
| 4 | Attempt to open a Work Order detail URL directly (if known). | Access is denied / page not reachable (no WO view). |

**Expected Final Result:** With WO View OFF, the user has no visible access to Work Orders anywhere in the nav.

---

### CR-WO-003 — View-only user cannot see Create/Edit/Delete actions

| Field | Value |
|---|---|
| **Related Jira** | SV-7506 |
| **Priority** | High |
| **Type** | Negative |
| **Preconditions** | Custom role "WO Viewer" (View ON, Edit OFF, Delete OFF) assigned to test user. |
| **Test Data** | Existing Work Order with an invoice (no payments). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the WO Viewer test user. | User is on the Work Orders list. |
| 2 | Look for a "Create Work Order" / "New WO" action. | No create action is available. |
| 3 | Open a Work Order detail page. | Fields (customer details, asset, service advisor, lead technician, status) are read-only; no edit controls. |
| 4 | Look for Delete and Reverse Invoice actions. | Neither the Delete WO action nor the Reverse Invoice action is available. |

**Expected Final Result:** A View-only user sees no create, edit, delete, or invoice-reversal controls.

---

### CR-WO-004 — Edit permission: create and edit Work Orders

| Field | Value |
|---|---|
| **Related Jira** | SV-7506 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | Custom role with Work Orders → **Edit** ("Create and Edit") ON (which auto-enables View). Delete OFF. Assigned to test user. |
| **Test Data** | Custom role "WO Editor"; a customer, an asset, a service advisor, and a technician available to assign. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create custom role "WO Editor" and turn Work Orders → **Edit** ON. | Turning Edit ON **auto-enables View** (cascade up). Delete stays OFF. |
| 2 | Assign to test user; user logs out and back in. | New role active. |
| 3 | As the test user, create a new Work Order. | WO is created successfully. |
| 4 | Edit the WO: change customer details, change the asset, change service advisor, change lead technician, change status. | All edits save successfully. |
| 5 | Look for Delete and Reverse Invoice actions. | Neither is available (Delete OFF). |

**Expected Final Result:** An Edit-level user can create and fully edit WOs but cannot delete or reverse invoices.

---

### CR-WO-005 — Edit-but-not-Delete user cannot delete a WO or reverse an invoice

| Field | Value |
|---|---|
| **Related Jira** | SV-7506 |
| **Priority** | Critical |
| **Type** | Negative |
| **Preconditions** | Custom role "WO Editor" (Edit ON, Delete OFF) assigned to test user. |
| **Test Data** | A Work Order with an invoice that has **no payments made** (reversal would otherwise be allowed by validation). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the WO Editor test user. | User is on the Work Orders app. |
| 2 | Open a Work Order and look for a Delete action. | No Delete action is available. |
| 3 | Open the WO that has an invoice with no payments and look for a **Reverse Invoice** action. | The Reverse Invoice action is **not available** — reversing an invoice requires Work Orders → **Delete** (per latest spec, NOT Invoicing Delete). |

**Expected Final Result:** Without Work Orders → Delete, the user cannot delete WOs or reverse invoices even when invoice validation (no payments) would otherwise permit reversal.

---

### CR-WO-006 — Delete permission: delete a Work Order

| Field | Value |
|---|---|
| **Related Jira** | SV-7506 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Custom role with Work Orders → **Delete** ON (auto-enables Edit + View). Assigned to test user. |
| **Test Data** | Custom role "WO Manager"; a disposable Work Order that can be deleted. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Create custom role "WO Manager"; turn Work Orders → **Delete** ON. | Turning Delete ON **auto-enables Edit and View** (cascade up). |
| 2 | Assign to test user; user logs out and back in. | New role active. |
| 3 | As the test user, open a disposable Work Order and delete it. | The WO is deleted successfully. |

**Expected Final Result:** A Delete-level user can delete Work Orders (and has Edit + View by cascade).

---

### CR-WO-007 — Delete permission: reverse an invoice when validation is met

| Field | Value |
|---|---|
| **Related Jira** | SV-7506 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | Custom role "WO Manager" (Work Orders → Delete ON) assigned to test user. |
| **Test Data** | A Work Order with an invoice that has **no payments made** (validation for reversal is met). |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the WO Manager test user. | User is on the Work Orders app. |
| 2 | Open the WO whose invoice has no payments. | WO detail with invoice is shown; a **Reverse Invoice** action is available (gated by WO Delete). |
| 3 | Reverse the invoice. | The invoice is reversed successfully. |
| 4 | (Optional) Open a WO whose invoice has payments made and attempt reversal. | Reversal is blocked by **validation** (payments exist), independent of permission. |

**Expected Final Result:** A user with WO Delete can reverse invoices when validation (e.g., no payments) is satisfied; validation still blocks reversal when payments exist.

---

### CR-WO-008 — Cascade up: enabling Edit auto-enables View

| Field | Value |
|---|---|
| **Related Jira** | SV-7506 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | A custom role being edited with all Work Orders CRUD toggles OFF. |
| **Test Data** | Custom role "Cascade Test". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | In the role editor, with WO View/Edit/Delete all OFF, turn **Edit** ON. | **View** is automatically enabled. Delete stays OFF. |
| 2 | Save and reopen the role. | View and Edit remain ON. |

**Expected Final Result:** Enabling Edit forces View ON (upward cascade).

---

### CR-WO-009 — Cascade up: enabling Delete auto-enables Edit and View

| Field | Value |
|---|---|
| **Related Jira** | SV-7506 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | A custom role being edited with all Work Orders CRUD toggles OFF. |
| **Test Data** | Custom role "Cascade Test". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | With WO View/Edit/Delete all OFF, turn **Delete** ON. | **Edit and View** are both automatically enabled. |
| 2 | Save and reopen the role. | View, Edit, and Delete all remain ON. |

**Expected Final Result:** Enabling Delete forces Edit and View ON (upward cascade).

---

### CR-WO-010 — Cascade down: disabling View disables Edit and Delete

| Field | Value |
|---|---|
| **Related Jira** | SV-7506 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | A custom role with Work Orders View, Edit, and Delete all ON. |
| **Test Data** | Custom role "Cascade Test". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the role with WO View + Edit + Delete all ON. | All three are ON. |
| 2 | Turn **View** OFF. | **Edit and Delete are automatically disabled** (downward cascade). |
| 3 | Save and reopen the role. | View, Edit, Delete all OFF. |

**Expected Final Result:** Disabling View forces Edit and Delete OFF.

---

### CR-WO-011 — Cascade down: disabling Edit disables Delete

| Field | Value |
|---|---|
| **Related Jira** | SV-7506 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | A custom role with Work Orders View, Edit, and Delete all ON. |
| **Test Data** | Custom role "Cascade Test". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Open the role with WO View + Edit + Delete all ON. | All three ON. |
| 2 | Turn **Edit** OFF. | **Delete is automatically disabled**; View stays ON. |
| 3 | Save and reopen the role. | View ON; Edit and Delete OFF. |

**Expected Final Result:** Disabling Edit forces Delete OFF while leaving View intact.

---

### CR-WO-012 — WO sub-settings require only WO View, not Edit

| Field | Value |
|---|---|
| **Related Jira** | SV-7507 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | A custom role with Work Orders → View ON, Edit OFF, Delete OFF. |
| **Test Data** | Custom role "WO Viewer + Subs". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | In the role editor with WO View ON and Edit OFF, locate the three sub-settings: Review Work Orders, Pick Parts, Order Parts. | All three sub-settings are **enabled/interactable** (they require only WO View, not Edit). |
| 2 | Turn all three sub-settings ON and save. | Saves successfully with View ON and Edit still OFF. |
| 3 | Assign to test user; log out/in; open a WO. | Sub-setting capabilities are available even though the user has no Edit permission. |

**Expected Final Result:** The three WO sub-settings are governed by WO View only and can be enabled without Edit.

---

### CR-WO-013 — WO sub-settings greyed when WO View is OFF

| Field | Value |
|---|---|
| **Related Jira** | SV-7507 |
| **Priority** | Medium |
| **Type** | UI |
| **Preconditions** | A custom role with Work Orders → View OFF. |
| **Test Data** | Custom role "No WO Access". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | In the role editor set WO View OFF. | View is OFF. |
| 2 | Locate Review Work Orders, Pick Parts, Order Parts. | All three sub-settings are **always visible** but **greyed out / disabled** because WO View is OFF. |
| 3 | Turn WO View ON. | The three sub-settings become interactable. |

**Expected Final Result:** The three sub-settings are always shown but greyed while WO View is OFF, and become editable once View is ON.

---

### CR-WO-014 — Review Work Orders sub-setting ON: Review option available

| Field | Value |
|---|---|
| **Related Jira** | SV-7507 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Custom role with WO View ON and **Review Work Orders** sub-setting ON; other two subs OFF. Assigned to test user. |
| **Test Data** | Custom role "WO Reviewer"; a Work Order eligible for review. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Configure role: WO View ON, Review Work Orders ON, Pick Parts OFF, Order Parts OFF. | Role saves. |
| 2 | Assign to test user; log out/in; open a WO. | The **Review** option is visible and usable on the WO. |

**Expected Final Result:** With Review Work Orders ON, the user can see and use the Review option on WOs.

---

### CR-WO-015 — Review Work Orders sub-setting OFF: Review option hidden

| Field | Value |
|---|---|
| **Related Jira** | SV-7507 |
| **Priority** | Medium |
| **Type** | Negative |
| **Preconditions** | Custom role with WO View ON and **Review Work Orders** sub-setting OFF. Assigned to test user. |
| **Test Data** | Custom role "WO Viewer No Review". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Configure role: WO View ON, Review Work Orders OFF. | Role saves. |
| 2 | Assign to test user; log out/in; open a WO. | The Review option is **not available**. |

**Expected Final Result:** With Review Work Orders OFF, the user cannot see/use the Review option.

---

### CR-WO-016 — Foreman-like config: Pick Parts ON, Order Parts OFF

| Field | Value |
|---|---|
| **Related Jira** | SV-7507 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Custom role with WO View ON, **Pick Parts ON**, **Order Parts OFF** (Review off or on, independent). Assigned to test user. |
| **Test Data** | Custom role "Foreman"; a WO with a line; parts available in inventory. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Configure role: WO View ON, Pick Parts ON, Order Parts OFF. | Role saves with these independent toggles as set. |
| 2 | Assign to test user; log out/in; open a WO line. | User can **pick parts from inventory** onto the WO line. |
| 3 | Attempt to place a PO / order parts on the WO. | Order Parts action is **not available** (Order Parts OFF). |
| 4 | Attempt to receive a parts delivery onto the WO. | Receiving is **not available** (also controlled by Order Parts). |

**Expected Final Result:** Pick Parts and Order Parts are independent; a Foreman-like user can pick parts but cannot order or receive parts.

---

### CR-WO-017 — Order Parts ON: place PO and receive parts on a WO

| Field | Value |
|---|---|
| **Related Jira** | SV-7507 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Custom role with WO View ON and **Order Parts ON**. Assigned to test user. |
| **Test Data** | Custom role "Parts Orderer"; a WO with a line; a part to order. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Configure role: WO View ON, Order Parts ON. | Role saves. |
| 2 | Assign to test user; log out/in; open a WO. | Order Parts capability is available. |
| 3 | Place a PO for parts on the WO. | A PO is created and **linked to the WO**. |
| 4 | Receive a parts delivery onto the WO. | Receiving parts delivery onto the WO succeeds (controlled by Order Parts). |

**Expected Final Result:** Order Parts ON lets the user create WO-linked POs and receive parts deliveries onto the WO.

---

### CR-WO-018 — Returning a part from a WO line requires no permission (only WO View)

| Field | Value |
|---|---|
| **Related Jira** | SV-7507 |
| **Priority** | Medium |
| **Type** | Positive |
| **Preconditions** | Custom role with WO View ON, **Pick Parts OFF, Order Parts OFF, Review OFF**. Assigned to test user. |
| **Test Data** | Custom role "WO Viewer Only"; a WO line that already has a part on it that can be returned. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Configure role: WO View ON, all three sub-settings OFF. | Role saves. |
| 2 | Assign to test user; log out/in; open the WO line with a part on it. | The line and its part are visible (WO View). |
| 3 | Return the part from the WO line. | The return succeeds — **returning a part requires no permission** beyond WO View. |

**Expected Final Result:** A user with only WO View (no sub-settings) can still return a part from a WO line.

---

### CR-WO-019 — WO Lines has no independent View; visible when WO View is ON

| Field | Value |
|---|---|
| **Related Jira** | SV-7509 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | A custom role with WO View ON. |
| **Test Data** | Custom role "WO Viewer"; a WO with lines. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Inspect the role editor for a Work Order Lines **View** toggle. | There is **no independent View** for WO Lines. |
| 2 | With WO View ON, assign to test user; log out/in; open a WO. | The WO **lines are visible** because WO View is ON. |

**Expected Final Result:** WO Lines have no separate View; they appear whenever WO View is ON.

---

### CR-WO-020 — WO Lines Edit: add/edit lines and line management actions

| Field | Value |
|---|---|
| **Related Jira** | SV-7509 |
| **Priority** | Critical |
| **Type** | Positive |
| **Preconditions** | Custom role with WO View ON and Work Order Lines → **Edit** ON, Delete OFF. Assigned to test user. |
| **Test Data** | Custom role "Line Editor"; a WO with at least two lines and parts to move; a part request; an inspection to add. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Configure role: WO View ON, WO Lines Edit ON, WO Lines Delete OFF. | Role saves. |
| 2 | Assign to test user; log out/in; open a WO. | Lines are visible and editable. |
| 3 | Add a new line and edit an existing line. | Add/edit succeed. |
| 4 | Move parts between lines. | Parts move successfully. |
| 5 | Authorize a line; manage a part request; add an inspection to a WO line. | Each action succeeds. |
| 6 | Edit mileage, engine hours, license plate, and VIN. | All edits save. |

**Expected Final Result:** A WO Lines Edit user can add/edit lines, move parts, authorize lines, manage part requests, add inspections, and edit mileage/engine hours/license plate/VIN.

---

### CR-WO-021 — WO Lines Delete: remove lines

| Field | Value |
|---|---|
| **Related Jira** | SV-7509 |
| **Priority** | High |
| **Type** | Positive |
| **Preconditions** | Custom role with WO View ON and Work Order Lines → **Delete** ON (auto-enables WO Lines Edit). Assigned to test user. |
| **Test Data** | Custom role "Line Manager"; a WO with a disposable line. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Configure role: WO View ON, WO Lines Delete ON (Edit auto-enabled). | Role saves. |
| 2 | Assign to test user; log out/in; open a WO. | Lines are visible/editable/removable. |
| 3 | Remove a WO line. | The line is removed successfully. |

**Expected Final Result:** A WO Lines Delete user can remove lines.

---

### CR-WO-022 — WO Lines Delete required to remove not-yet-complete inspections and reopen completed inspections (SV-7985)

| Field | Value |
|---|---|
| **Related Jira** | SV-7509 |
| **Priority** | Critical |
| **Type** | Security |
| **Preconditions** | Two custom roles: (A) WO View ON + WO Lines **Edit only** (Delete OFF); (B) WO View ON + WO Lines **Delete** ON. Each assigned to a test user. |
| **Test Data** | A WO line with a **not-yet-complete** Digital Inspection and a **completed** Digital Inspection. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as user with role A (WO Lines Edit only, Delete OFF); open the WO line with inspections. | Lines and inspections are visible. |
| 2 | Attempt to **remove the not-yet-complete inspection**. | Action is **not available / blocked** — removing an inspection requires WO Lines **Delete**, not Edit. |
| 3 | Attempt to **reopen the completed inspection**. | Action is **not available / blocked** — reopening requires WO Lines **Delete**. |
| 4 | Log out; log in as user with role B (WO Lines Delete ON); open the same WO line. | Delete-level actions available. |
| 5 | Remove the not-yet-complete inspection. | Removal succeeds. |
| 6 | Reopen the completed inspection. | Reopen succeeds. |

**Expected Final Result:** Removing not-yet-complete inspections and reopening completed inspections are gated on WO Lines **Delete** (correct gating for regression SV-7985; Create&Edit alone must NOT allow these).

---

### CR-WO-023 — WO Lines not shown/usable when WO View is OFF (SV-7981)

| Field | Value |
|---|---|
| **Related Jira** | SV-7509 |
| **Priority** | High |
| **Type** | Dependency |
| **Preconditions** | A custom role with WO View OFF. |
| **Test Data** | Custom role "No WO Access". |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | In the role editor set WO View OFF. | View OFF. |
| 2 | Inspect the WO Lines toggles. | Editor should **not allow** enabling WO Lines Create&Edit while WO View is OFF (regression SV-7981: the WO Lines options should be disabled/greyed when WO View is OFF). |
| 3 | If somehow set, assign to test user; log out/in. | The user cannot see or use WO Lines because there is no WO View entry point. |

**Expected Final Result:** With WO View OFF, WO Lines are neither shown nor usable, and the role editor prevents enabling WO Lines Create&Edit (SV-7981 correct behavior).

---

### CR-WO-024 — Edit-only WO Lines user cannot delete lines

| Field | Value |
|---|---|
| **Related Jira** | SV-7509 |
| **Priority** | Medium |
| **Type** | Negative |
| **Preconditions** | Custom role "Line Editor" (WO View ON, WO Lines Edit ON, Delete OFF) assigned to test user. |
| **Test Data** | A WO with a line. |

**Steps**

| # | Action | Expected Result |
|---|--------|-----------------|
| 1 | Log in as the Line Editor test user; open a WO. | Lines are visible and editable. |
| 2 | Look for a delete/remove line action. | No line-delete action is available (WO Lines Delete OFF). |

**Expected Final Result:** A WO Lines Edit-only user can edit but not delete lines.

---
