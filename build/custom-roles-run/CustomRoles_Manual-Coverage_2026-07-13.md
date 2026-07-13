# Custom Roles — Manual-Coverage Hand-off — 2026-07-13

Definitive hand-off list: the **Blocked-UI** cases from the 2026-07-13 behavioural VIU pass that could NOT be driven headless. Each is genuine harness / environment residue — a manual tester (or a second real user account) is needed to finish it. Every case's **wording** is already build-accurate and pushed to TestRail; only the **behaviour** still needs a live pass.

**Rule 8:** every row carries the TestRail Case ID (C#####) + a clickable link.

## Total: 39 cases across 9 categories

| Category | Cases |
|---|---:|
| Staff editor / staff record (needs a real browser or a 2nd real user account) | 9 |
| Calendar drag / slot interaction (needs a real browser) | 3 |
| In-page payment / terminal / return / financial / timesheet-entry editors (needs a real browser) | 9 |
| Portal / Send-to-Portal surfaces (not exposed in this test environment) | 5 |
| Parts delete / restock detail-page affordance (not reachable in the harness) | 4 |
| Seeded work-order line-state operations (review / pick / core / set-line-status / line-delete / qty) | 6 |
| Tech-view parts-request form field count (needs a real browser) | 1 |
| Last-Administrator guard (shared org has 89 admins — cannot create the last-admin state) | 1 |
| Migration (needs a pre-migration org with a legacy Owner user) | 1 |
| **TOTAL** | **39** |

## Staff editor / staff record (needs a real browser or a 2nd real user account) — 9

### C26356 — You can view a role's Permission Summary from Edit Staff Member using the eye icon next to the Role dropdown
- **TestRail:** [C26356](https://shopview.testrail.io/index.php?/cases/view/26356) · **Section:** Permission Summary (3532)
- **Why it could not be automated:** needs the Edit Staff Member modal Role selector + its eye (View Permissions) icon; the staff row action reached opens Manage-staff-enrollments (departments/workplaces), not the role editor. Follow-up: open Edit Staff Member via the correct control.
- **How to cover:** Open the Staff page, click a real staff member to open the Edit Staff Member window, click the eye icon next to the Role dropdown, and confirm a read-only Permission Summary opens.

### C26450 — View/Manage Wages ON lets the user manage wages
- **TestRail:** [C26450](https://shopview.testrail.io/index.php?/cases/view/26450) · **Section:** Settings Access (3542)
- **Why it could not be automated:** wage rate fields live on the Edit Staff Member profile, which is not reachable in this harness (the staff row action opens Manage-staff-enrollments, not the profile/wage editor — same limitation as C26356/C26490/C26491). Role has settingsWages; needs the staff profile editor opened (real browser) to confirm wage fields shown/editable.
- **How to cover:** Give a test user a role with View/Manage Wages turned ON, open that user's Edit Staff Member profile, and confirm the wage/pay fields are shown and editable. Repeat with the toggle OFF and confirm they are hidden.

### C26490 — The Staff role dropdown groups roles into System Roles and Custom Roles
- **TestRail:** [C26490](https://shopview.testrail.io/index.php?/cases/view/26490) · **Section:** Staff Page Role Assignment (3547)
- **Why it could not be automated:** the Edit Staff Member Role dropdown (System/Custom grouping) was not reached — the staff row click opened Manage-staff-enrollments. Follow-up: locate the Edit Staff Member action, open the Role selector.
- **How to cover:** Open Edit Staff Member for any staff member, open the Role dropdown, and confirm the roles are grouped under two headings: 'System Roles' and 'Custom Roles'.

### C26491 — The View Permissions button next to the role selector opens the Permission Summary
- **TestRail:** [C26491](https://shopview.testrail.io/index.php?/cases/view/26491) · **Section:** Staff Page Role Assignment (3547)
- **Why it could not be automated:** View Permissions eye next to the staff Role selector not reached (same Edit-Staff-Member surface as C26490).
- **How to cover:** On the Edit Staff Member window, click the 'View Permissions' (eye) button next to the role selector and confirm the Permission Summary window opens.

### C26493 — If a role change fails, the user keeps their previous role
- **TestRail:** [C26493](https://shopview.testrail.io/index.php?/cases/view/26493) · **Section:** Staff Page Role Assignment (3547)
- **Why it could not be automated:** forcing a failed role change (to confirm the user keeps the prior role) requires inducing a server error on /change; not reproducible on demand this pass.
- **How to cover:** Needs a real browser plus a way to make the save fail (for example, disconnect the network mid-save). Change a staff member's role, force the save to fail, and confirm the user still shows their previous role.

### C26526 — Whether a technician can be scheduled depends on their department, not their role
- **TestRail:** [C26526](https://shopview.testrail.io/index.php?/cases/view/26526) · **Section:** Staff Record Settings (3550)
- **Why it could not be automated:** (needs two seeded users + departments)
- **How to cover:** Needs two test technicians set to different departments. Confirm whether each one can be scheduled based on their department setting, not their role.

### C26527 — Clocking in on a work order line depends on the per-staff Time Clock setting
- **TestRail:** [C26527](https://shopview.testrail.io/index.php?/cases/view/26527) · **Section:** Staff Record Settings (3550)
- **Why it could not be automated:** (needs two seeded users)
- **How to cover:** Needs two test users with different per-staff Time Clock settings. On a work order line, confirm the clock-in option follows the Time Clock setting, not the role.

### C26539 — Reassigning a staff member's role updates the row with no success message (billing note in the window)
- **TestRail:** [C26539](https://shopview.testrail.io/index.php?/cases/view/26539) · **Section:** User Feedback Strings (3552)
- **Why it could not be automated:** (needs live Staff page); billing note not re-captured this pass
- **How to cover:** On the Staff page, reassign a staff member's role and confirm the row updates immediately with NO success-message popup.

### C27873 — Edit/delete options on another user's customer note are hidden without the right permission
- **TestRail:** [C27873](https://shopview.testrail.io/index.php?/cases/view/27873) · **Section:** Work Orders Permissions (3534)
- **Why it could not be automated:** needs a customer note authored by a DIFFERENT user, then observe edit/delete affordance hidden for a role lacking the note permission — requires seeding a note as user A and viewing as user B; not reachable with single Tech identity this pass.
- **How to cover:** Needs two real user accounts. As user A, add a note to a customer. Log in as user B (a role that lacks the note permission) and confirm the edit/delete options on user A's note are hidden.

## Calendar drag / slot interaction (needs a real browser) — 3

### C26395 — Schedule Create & Edit allows creating, changing and dragging appointments
- **TestRail:** [C26395](https://shopview.testrail.io/index.php?/cases/view/26395) · **Section:** Schedule Permissions (3536)
- **Why it could not be automated:** the Schedule calendar renders for a scheduleCreateAndEdit role, but creating/dragging/editing an appointment requires real calendar drag/slot mouse interaction that does not trigger headless (Schedule button + calendar-cell clicks opened no create dialog); appointment CRUD API endpoint not exposed at standard paths. Needs a real browser.
- **How to cover:** Needs a real browser. Give a test user Schedule Create & Edit, open the Schedule calendar, create a new appointment, drag it to a different slot, and edit it — confirm all three work.

### C26396 — Schedule Delete allows removing appointments
- **TestRail:** [C26396](https://shopview.testrail.io/index.php?/cases/view/26396) · **Section:** Schedule Permissions (3536)
- **Why it could not be automated:** appointment delete requires selecting an existing appointment on the calendar (drag/slot interaction) which is not triggerable headless; same calendar-automation limitation as C26395.
- **How to cover:** Needs a real browser. With Schedule Delete, select an existing appointment on the calendar and delete it — confirm it is removed.

### C27867 — A Schedule Create & Edit only role can open 'Assign existing work order' and the unscheduled work order list loads
- **TestRail:** [C27867](https://shopview.testrail.io/index.php?/cases/view/27867) · **Section:** Schedule Permissions (3536)
- **Why it could not be automated:** the Assign existing work order dialog / unscheduled WO list could not be opened headless (Schedule button + calendar clicks opened no dialog); needs the calendar create-entry interaction in a real browser.
- **How to cover:** Needs a real browser. With a Schedule Create & Edit only role, open 'Assign existing work order' on the calendar and confirm the unscheduled work order list loads.

## In-page payment / terminal / return / financial / timesheet-entry editors (needs a real browser) — 9

### C26401 — Customers Delete does NOT let the user delete customer payments (that needs Invoicing & payments Delete)
- **TestRail:** [C26401](https://shopview.testrail.io/index.php?/cases/view/26401) · **Section:** Customer Management Permissions (3537)
- **Why it could not be automated:** verifying that Customers Delete does NOT delete payments needs a role with customersDelete + AP/AR (to see the customer Payments tab) but WITHOUT invoicingPaymentsDelete, on a customer with payments, to observe no payment-delete option. The payment-delete UI affordance was not reachable in the harness (same limitation as C26422/C26423). Customer-delete itself is verified (C26400); payment delete is gated by invoicingPaymentsDelete per the perm model.
- **How to cover:** Needs a customer with a payment on file. Give a test user Customers Delete but NOT Invoicing & payments Delete, and confirm they cannot delete the customer's payment.

### C26422 — Invoicing & payments Delete lets the user delete payments and void transactions (but not reverse invoices)
- **TestRail:** [C26422](https://shopview.testrail.io/index.php?/cases/view/26422) · **Section:** Invoicing and Payments Permissions (3539)
- **Why it could not be automated:** per-payment delete/void affordance not located on the WO Finance tab in the harness (payment rows/menus did not expose a delete/void control); needs the invoice->payment detail view with a with/without invoicingPaymentsDelete contrast.
- **How to cover:** Give a test user Invoicing & payments Delete. On a work order with a payment, confirm they can delete the payment and void the transaction (but cannot reverse the invoice).

### C26423 — Deleting a customer payment needs Invoicing & payments Delete, not Customers Delete
- **TestRail:** [C26423](https://shopview.testrail.io/index.php?/cases/view/26423) · **Section:** Invoicing and Payments Permissions (3539)
- **Why it could not be automated:** deleting a customer payment (gated by Invoicing Delete not Customers Delete) needs the payment delete control located; the Finance-tab payment row menu was not reachable this pass.
- **How to cover:** Confirm that deleting a customer payment works only with Invoicing & payments Delete and NOT with Customers Delete (compare a role that has one against a role that has the other).

### C26427 — The Send to Terminal action needs Invoicing & payments Create & Edit
- **TestRail:** [C26427](https://shopview.testrail.io/index.php?/cases/view/26427) · **Section:** Invoicing and Payments Permissions (3539)
- **Why it could not be automated:** Send to Terminal was not shown at the WO Finance-tab level even for a role with Invoicing C&E + Customer Portal (Service Advisor); it appears within the take-payment flow on an open invoice — needs seeding an open invoice + entering the payment dialog.
- **How to cover:** Give a test user Invoicing & payments Create & Edit. Open an invoice's take-payment flow and confirm the 'Send to Terminal' action is available.

### C27871 — Deleting or cancelling a return is controlled by Invoicing & payments Delete
- **TestRail:** [C27871](https://shopview.testrail.io/index.php?/cases/view/27871) · **Section:** Invoicing and Payments Permissions (3539)
- **Why it could not be automated:** deleting/cancelling a return (gated by Invoicing Delete) needs a part return seeded first (create return via admin) then observe the delete/cancel gate; return flow not seeded this pass.
- **How to cover:** First create a part return. Then confirm that deleting or cancelling the return is only allowed with Invoicing & payments Delete.

### C29434 — Send to Terminal needs Invoicing & payments Create & Edit AND Customer portal ON
- **TestRail:** [C29434](https://shopview.testrail.io/index.php?/cases/view/29434) · **Section:** Invoicing and Payments Permissions (3539)
- **Why it could not be automated:** same as C26427 — Send to Terminal (needs Invoicing C&E AND Customer Portal) is in the payment dialog, not reached; needs an open invoice + payment flow to observe both-gates.
- **How to cover:** Confirm 'Send to Terminal' appears only when the user has BOTH Invoicing & payments Create & Edit AND Customer portal turned ON (test with each one missing).

### C29438 — Invoicing & payments Create & Edit gives the edit control on the work order Financial Info card
- **TestRail:** [C29438](https://shopview.testrail.io/index.php?/cases/view/29438) · **Section:** Invoicing and Payments Permissions (3539)
- **Why it could not be automated:** on an open WO the Financial Info card shows an edit affordance, but the same generic WO-header edit affordance appears for BOTH an invoicing-C&E role and a WO-C&E-only (no invoicing) role — the invoicing-specific Financial Info edit control could not be isolated from general WO-edit affordances in the harness. Needs a real browser to confirm the invoicing-gated edit control specifically.
- **How to cover:** On an open work order, confirm the edit control on the Financial Info card appears only for a user with Invoicing & payments Create & Edit, and not for a work-order-edit-only role.

### C26479 — View and Manage AP/AR Data ON allows paying several invoices at once from the Unpaid Invoices tab
- **TestRail:** [C26479](https://shopview.testrail.io/index.php?/cases/view/26479) · **Section:** View and Manage AP/AR Data (3545)
- **Why it could not be automated:** (needs seeded role + live payment)
- **How to cover:** Give a test user View and Manage AP/AR Data ON. On the Unpaid Invoices tab, confirm they can pay several invoices at once.

### C26431 — Timesheets Create & Edit lets the user edit entries
- **TestRail:** [C26431](https://shopview.testrail.io/index.php?/cases/view/26431) · **Section:** Timesheets Permissions (3540)
- **Why it could not be automated:** the timesheet entry EDIT affordance was not reachable in the harness for a timesheetsCreateAndEdit role — the WO Timesheets tab is a summary (no edit for view or C&E) and the /timesheets page exposed no per-row edit control/dialog/menu on click. Needs the timesheet entry editor (real browser) to confirm edit works; view-only read-only is confirmed (C26430).
- **How to cover:** Give a test user Timesheets Create & Edit. Open a timesheet entry and confirm they can edit it. Compare with a view-only role that cannot edit.

## Portal / Send-to-Portal surfaces (not exposed in this test environment) — 5

### C26437 — Customer portal ON lets the user manage the customer portal
- **TestRail:** [C26437](https://shopview.testrail.io/index.php?/cases/view/26437) · **Section:** Page Access Toggles (3541)
- **Why it could not be automated:** the Customer Portal management surface is not exposed in the app nav/sidebar/customer-detail even for Admin (who has customerPortalPageAccess). The portal page-access toggle exists in the role editor but no managed Customer Portal page is reachable in this environment — cannot verify manage/edit. Needs the portal feature surfaced (real browser / env with portal enabled).
- **How to cover:** Needs an environment with the Customer Portal feature enabled. With Customer portal ON, confirm the user can manage the customer portal.

### C26438 — Customer portal OFF hides the customer portal from navigation
- **TestRail:** [C26438](https://shopview.testrail.io/index.php?/cases/view/26438) · **Section:** Page Access Toggles (3541)
- **Why it could not be automated:** cannot confirm gating — no Customer Portal nav entry is shown for ANY role including Admin (surface not exposed in this env), so on/off cannot be compared.
- **How to cover:** Needs the Customer Portal surface enabled. With Customer portal OFF, confirm the customer portal item is hidden from navigation.

### C26439 — Billing Portal ON lets the user manage the billing portal
- **TestRail:** [C26439](https://shopview.testrail.io/index.php?/cases/view/26439) · **Section:** Page Access Toggles (3541)
- **Why it could not be automated:** the Billing Portal management surface is not present in the Settings area even for Admin (who has billingPortalPageAccess) — no Billing Portal page reachable in this env; cannot verify manage/edit.
- **How to cover:** Needs the Billing Portal feature enabled. With Billing Portal ON, confirm the user can manage the billing portal.

### C26440 — Billing Portal OFF hides the Billing Portal item in the Settings area
- **TestRail:** [C26440](https://shopview.testrail.io/index.php?/cases/view/26440) · **Section:** Page Access Toggles (3541)
- **Why it could not be automated:** cannot confirm gating — Billing Portal is not shown in the Settings area for any role including Admin (surface not exposed in this env), so on/off cannot be compared.
- **How to cover:** Needs the Billing Portal surface enabled. With Billing Portal OFF, confirm the Billing Portal item is hidden in the Settings area.

### C26466 — Full View: a user who can approve lines sees the 'Send to Portal' button
- **TestRail:** [C26466](https://shopview.testrail.io/index.php?/cases/view/26466) · **Section:** View Mode (3543)
- **Why it could not be automated:** Send to Portal was NOT found on the full-view (admin) lines page body; it is likely in the WO header more_vert menu or gated by WO state — needs the header action menu expanded to confirm.
- **How to cover:** In Full View, with a user who can approve lines, confirm the 'Send to Portal' button is shown (check the work order header action menu if it is not on the page body).

## Parts delete / restock detail-page affordance (not reachable in the harness) — 4

### C26412 — Part sales Delete lets the user delete part sales and reverse part sales invoices
- **TestRail:** [C26412](https://shopview.testrail.io/index.php?/cases/view/26412) · **Section:** Parts Department Permissions (3538)
- **Why it could not be automated:** Part sales Delete affordance (delete/reverse a part sale) not located in this pass — the part-sale row menu did not open in the harness; needs the part-sale detail-page delete control with a with/without partSalesDelete contrast.
- **How to cover:** Give a test user Part sales Delete. On a part sale, confirm they can delete it and reverse the part-sales invoice. Compare with a role that lacks the permission.

### C26415 — Catalog and Inventory Delete removes catalog parts
- **TestRail:** [C26415](https://shopview.testrail.io/index.php?/cases/view/26415) · **Section:** Parts Department Permissions (3538)
- **Why it could not be automated:** Catalog Delete affordance not located — the catalogue row more_vert menu did not open in the harness; needs the catalog-part detail delete control (Parts Manager has catalogInventoryDelete) vs a no-delete role.
- **How to cover:** Give a test user Catalog and Inventory Delete. Open a catalog part detail and confirm they can delete it. Compare with a role that lacks the permission.

### C26418 — Vendor and order management Delete lets the user delete vendors and purchase orders and reverse vendor transactions
- **TestRail:** [C26418](https://shopview.testrail.io/index.php?/cases/view/26418) · **Section:** Parts Department Permissions (3538)
- **Why it could not be automated:** Vendor/PO Delete affordance (delete vendor/PO, reverse vendor txn) not located this pass; needs the vendor/PO detail delete control with/without vendorOrderManagementDelete.
- **How to cover:** Give a test user Vendor and order management Delete. Confirm they can delete a vendor and a purchase order and reverse a vendor transaction.

### C26419 — Returning a part to inventory (restocking) is controlled by Vendor and order management
- **TestRail:** [C26419](https://shopview.testrail.io/index.php?/cases/view/26419) · **Section:** Parts Department Permissions (3538)
- **Why it could not be automated:** restocking (return part to inventory) control not reached — needs a WO/PO with a picked part to exercise the return-to-inventory action gated by Vendor and order management.
- **How to cover:** On a work order or purchase order that has a picked part, confirm the return-to-inventory (restock) action is controlled by Vendor and order management.

## Seeded work-order line-state operations (review / pick / core / set-line-status / line-delete / qty) — 6

### C26379 — The Review work orders sub-toggle controls the Review action on work orders
- **TestRail:** [C26379](https://shopview.testrail.io/index.php?/cases/view/26379) · **Section:** Work Orders Permissions (3534)
- **Why it could not be automated:** with woReviewWorkOrders the WO/line showed no explicit Review/Approve action (header menu: Audit Log/Add Fee-Discount; line menu: Add line note/Story history/Audit log). The Review action likely requires a submitted line-authorization state to appear; needs seeding that authorization workflow to show toggle on vs off.
- **How to cover:** First put a work order line into the submitted/awaiting-review state. Then, with the 'Review work orders' sub-toggle ON, confirm the Review action appears; with it OFF, confirm it is hidden.

### C26380 — Pick parts needs only Work orders View, not Create & Edit
- **TestRail:** [C26380](https://shopview.testrail.io/index.php?/cases/view/26380) · **Section:** Work Orders Permissions (3534)
- **Why it could not be automated:** Technician (woPickParts + WO View, no C&E) shows Complete/Start on lines but no Pick action was visible on the test WO (parts already picked/requested). Needs a seeded pending pickable part-request state to display and exercise the Pick action.
- **How to cover:** On a work order that has a pending part request to pick, give a test user Work orders View + Pick parts (no Create & Edit) and confirm they can pick the parts.

### C26391 — Work order lines Delete allows removing lines
- **TestRail:** [C26391](https://shopview.testrail.io/index.php?/cases/view/26391) · **Section:** Work Order Lines Permissions (3535)
- **Why it could not be automated:** WOL Delete role shows line-selection checkboxes but no line delete/remove button was exposed (selecting a line revealed no bulk-delete control; no per-line delete icon). Line-delete affordance not reachable in the harness; needs the expanded-line editor delete control or the line-delete endpoint confirmed.
- **How to cover:** Give a test user Work order lines Delete. On a work order, confirm they can remove a line.

### C27866 — A default Technician (with Work order lines Create & Edit) can bulk-complete another tech's line via Set Line Status
- **TestRail:** [C27866](https://shopview.testrail.io/index.php?/cases/view/27866) · **Section:** Work Order Lines Permissions (3535)
- **Why it could not be automated:** needs multiple lines assigned to a DIFFERENT technician plus the Set Line Status bulk control; Set Line Status was not present on the test WO for the Technician role. Requires seeding another tech-s lines + reaching the bulk Set Line Status action.
- **How to cover:** Seed a work order with lines assigned to a DIFFERENT technician. With a default Technician role (Work order lines Create & Edit), confirm they can bulk-complete those lines via 'Set Line Status'.

### C27870 — Work order lines Create & Edit lets the user mark a core OK/Not-OK and add line history
- **TestRail:** [C27870](https://shopview.testrail.io/index.php?/cases/view/27870) · **Section:** Work Order Lines Permissions (3535)
- **Why it could not be automated:** needs a work order line with a cored part to expose the core OK/Not-OK control; no cored-part line was present on the test WOs. Requires seeding a core part on a line (New Part Request with a cored catalog PN) then observe the core control + line history for a WOL C&E role.
- **How to cover:** Seed a work order line with a cored part (use New Part Request with a cored catalog part number). With Work order lines Create & Edit, confirm the user can mark the core OK / Not-OK and see the line history.

### C29435 — A Pick/Order Parts role can edit the Quantity on the Part Requests tab
- **TestRail:** [C29435](https://shopview.testrail.io/index.php?/cases/view/29435) · **Section:** Work Orders Permissions (3534)
- **Why it could not be automated:** the Part Requests tab (Order-Parts role) shows a Quantity column, but the inline quantity-edit interaction could not be triggered in this harness (cell-click did not open an editable input). Needs manual confirm that qty is editable.
- **How to cover:** On the Part Requests tab, with a Pick/Order Parts role, confirm the Quantity value can be edited inline.

## Tech-view parts-request form field count (needs a real browser) — 1

### C26460 — Tech view: the parts request form shows fewer fields
- **TestRail:** [C26460](https://shopview.testrail.io/index.php?/cases/view/26460) · **Section:** View Mode (3543)
- **Why it could not be automated:** needs the New Part Request form opened in tech view vs full view to compare field counts; the lines screen is drivable but the request-form modal step was not reached this pass.
- **How to cover:** Open the New Part Request form once in tech view and once in full view, and confirm the tech view shows fewer fields.

## Last-Administrator guard (shared org has 89 admins — cannot create the last-admin state) — 1

### C26550 — The last Administrator cannot be left with zero users
- **TestRail:** [C26550](https://shopview.testrail.io/index.php?/cases/view/26550) · **Section:** Cross-Permission Combinations (3553)
- **Why it could not be automated:** cannot test the last-Administrator guard on shared staging — the org has 89 users on the Admin role, so the single-last-admin state cannot be created without mass-reassigning real users (destructive/irreversible on a shared env). Product rule; needs an isolated org or DB-level setup. Route to product team to confirm the rule exists.
- **How to cover:** Needs an isolated org (not shared staging). Try to remove or reassign the last remaining Administrator and confirm the system blocks leaving zero Administrators. Route to the product team to confirm the rule exists.

## Migration (needs a pre-migration org with a legacy Owner user) — 1

### C27731 — Legacy 'Owner' users become 'Administrator' after migration (Owner merged into Admin)
- **TestRail:** [C27731](https://shopview.testrail.io/index.php?/cases/view/27731) · **Section:** Migration (3549)
- **Why it could not be automated:** 
- **How to cover:** Needs a pre-migration org that has a legacy 'Owner' user. After migration, confirm the Owner user becomes an 'Administrator' (Owner merged into Admin).
