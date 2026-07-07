# Custom Roles & Permissions — Support Quick-Reference

_Plain-English aid for support staff. The customer-facing sections reflect how ShopView behaves today. The final 'Internal notes' section is NOT for customers._

**Sections:** 1) How Custom Roles work · 2) Permission catalog · 3) Role capability overview · 4) Customer FAQ · 5) Quick troubleshooting · 6) Internal notes (not for customers)


## 1. How Custom Roles Work

| Topic | In plain English |
|---|---|
| System roles vs custom roles | ShopView ships with 11 built-in 'system' roles (Administrator, Office, Time Clock, Service Manager, Service Advisor, Senior Service Advisor, Foreman, Technician, Parts Manager, Parts Technician, Sales Representative). An admin can also create their own 'custom' roles with any mix of permissions. |
| Which roles can be changed | No system role can be deleted. Office and Time Clock are locked (view-only). Every other system role, including Administrator, can be edited — but Administrator always keeps full access (its switches are shown but locked on). |
| How an admin creates a role | Settings > Roles & Permissions > 'Create custom role'. You can start from a template (pre-fills the switches) or from blank. Give it a name and turn on at least one permission, then Create. A role won't save without a name and at least one permission. |
| How an admin edits a role | On the Roles list, click the pencil, change the switches, then Save. A 'Confirm Permission Updates' box lists exactly what you added or removed. 'Reset to Template' puts a template-based role back to its defaults. |
| Deleting a role | A role can only be deleted when no users are assigned to it. If users are still on it, reassign them first — the Delete option stays hidden/disabled until then. |
| Assigning a role to a person | Settings > Staff > open the person > Edit Staff Member > pick a Role. Roles are grouped as SYSTEM and CUSTOM, and an eye icon previews what a role can do. |
| Role change needs a re-login | When you change someone's role, their current session ends right away and the new permissions take effect the next time they log in. That forced logout is normal, not an error. |
| Full view vs Tech view | Every role has a work-order 'view mode'. FULL view shows the complete work order, including the line Approve action and financial actions. TECH view is a simpler, technician-focused screen that hides the Approve action and some other controls — good for people who do the work but shouldn't approve or see everything. |
| The two-layer idea | Some things need TWO things switched on: the permission itself AND a related toggle. The main example is money: a user only sees dollar amounts if 'See Financial Data' is on, on top of having access to the work order/part/invoice. |
| How switches cascade | Turning on Delete for a resource automatically turns on Create & Edit and View for it. Turning View off clears everything under that resource. You can't turn on a sub-item while its parent View is off. |

## 2. Permission Catalog

| Permission / setting | What it controls (plain English) | View / Create & Edit / Delete meaning | Depends on | Where it appears in the app |
|---|---|---|---|---|
| Work Orders | Access to work orders. Also lets a user create and edit ANY note on a work order (not just their own). | View = open work orders and read notes. Create & Edit = create/change work orders and any note. Delete = delete a work order and delete ANY note. | - | Work Orders area; a work order's Notes tab. |
| Work Order Lines | The individual job lines on a work order — marking lines OK/Not-OK, the line 'story'/history, approving lines (in Full view). | No separate View (it follows Work Orders: View). Create & Edit = add/change lines and line work. Delete = remove lines (a line can be deleted in any status except Complete). | Work Orders: View (for visibility) | Inside a work order > Lines tab. |
| Schedule | The scheduling calendar (shows all users' appointments). | View = see the calendar. Create & Edit = add/change appointments. | - | Schedule in the top nav. |
| Customer Management | Customer records. | View = see customers. Create & Edit = add/change customers. Delete = delete customers. | - | Customers in the top nav. |
| Parts Department | The whole parts area — Catalog, Inventory, Vendors & Orders, and Part Sales (these are one combined card, not separate ones). | View = browse parts. Create & Edit = add/change parts, vendors, inventory. Delete = remove them. | See Financial Data (to see cost/price columns) | Parts in the top nav (Catalog, Inventory, Vendors, Part Sales). |
| Invoicing & Payments | The Finance tab on a work order — invoices, payments, deposits, credits. | View = see finance/invoices. Create & Edit = create invoices/payments. Delete = reverse/remove payments and transactions. | See Financial Data (the Finance tab won't appear without it) | Inside a work order > Finance tab; customer Payments tab. |
| Timesheets | Timesheet activity. | View = see timesheets. Create & Edit = edit them. (There is no Delete for timesheets.) | - | Reports > Timesheet Activities. |
| Reports | The Reports area. This is one all-or-nothing switch (no separate view/edit). | On = full access to the Reports area. Off = no Reports. | - | Reports in the top nav. |
| Settings | Access to the admin/settings area, split into 6 sub-switches: App Settings, Service, Parts, Finance, Data Import, and View/Manage Wages. | Each sub-switch on/off controls its part of Settings. | - | Settings sidebar (Roles, Staff, Locations, Labor Rates, Payment Methods, Wages, etc.). |
| Order Parts (work-order sub-permission) | Ordering parts on a work order. | Single on/off sub-permission under Work Orders. | Goes together with See Financial Data (ordering shows prices/costs) | Inside a work order (parts/ordering actions). |
| Pick Parts (work-order sub-permission) | Picking in-stock parts for a work order. | Single on/off sub-permission under Work Orders. | - | Inside a work order (Pick action on in-stock parts). |
| Add Parts (work-order sub-permission) | Adding a part to a work-order line. | Single on/off sub-permission under Work Orders. | - | Inside a work order > line > Request/Add part. |
| Review Work Orders (work-order sub-permission) | The Review sign-off step on a work order. Until Review is done, Create Invoice stays disabled. | Single on/off sub-permission under Work Orders. | - | Inside a work order (Review action). |
| See Financial Data | Whether the user sees dollar amounts on work orders, parts and invoices, and whether the Finance tab appears. | Cross-cutting toggle (on/off). | - | Everywhere money shows: work orders, parts cost/price columns, invoices, the Finance tab. |
| Manage Accounts Payable & Receivable (AP/AR) | The 7 sensitive customer fields (Credit Terms, Credit Limit, Default Labor Rate, Default Shop Supplies, Min & Max, Taxes, 'PO is required') and the customer AP/AR tabs. Today it also controls access to the AP/AR aging reports. | Cross-cutting toggle (on/off). | - | Customer record (sensitive fields + AP/AR tabs); AP/AR aging reports. |
| View History Logs | The work-order history: the work-order-level Audit Log/History and the line-level story/history. Work orders only — there is no history for Part Sales or Purchase Orders. | Cross-cutting toggle (on/off). | - | Inside a work order (History / Audit Log; line story). |

## 3. Role Capability Overview

| System role | Typical use | Sees money (financial data)? | Work orders | Parts | Reports / AP-AR | Notes |
|---|---|---|---|---|---|---|
| Administrator | Full admin | Yes | Full (create/edit/delete) | Full | Full | Full access; cannot be deleted; always keeps full access. |
| Service Manager | Runs the service dept | Yes | Full | Yes | Yes | Broad access across work orders, customers, invoicing. |
| Senior Service Advisor | Senior front-desk | Yes | Yes | Yes | Yes (Reports on) | Wide access including Reports. |
| Service Advisor | Front-desk advisor | Yes | Yes | Yes | Partial | Day-to-day work-order and customer handling. |
| Foreman | Shop lead | Yes | Yes | Yes | Partial | Runs the floor; work orders and parts. |
| Technician | Hands-on tech | No (no See Financial Data by default) | Works lines (Tech view; no Approve) | Pick only (no ordering) | No | Does the work; no money visibility by default. |
| Parts Manager | Runs parts dept | Yes | Supports work orders | Full parts | Partial | Catalog, inventory, vendors, ordering. |
| Parts Technician | Parts helper | Depends on config | Supports parts on work orders | Parts (limited) | No | Receives/handles parts. |
| Office | Back office (locked role) | Config-dependent | View-focused | Limited | Can open AP/AR + reports | Locked/non-editable system role. |
| Sales Representative | Reporting/sales | Yes | No work-order CRUD | No | Reports + AP/AR only | Exactly Reports + See Financial Data + Manage AP/AR. |
| Time Clock | Clock-in only (locked role) | No | Read-only minimal (clock UI) | No | No | Locked/non-editable; minimal read access for the clock screen. |

_Note: High-level guide only. Exact capabilities depend on the shop's configuration and any custom roles. 'Partial' means it depends on the specific switches set for that shop._


## 4. Customer FAQ

| Customer question | Answer support can use |
|---|---|
| Why can a role order parts but the person still needs to see prices? | Ordering parts and seeing financial data go hand in hand. Ordering involves prices and costs, so a user who orders parts also needs 'See Financial Data' turned on to see those amounts. Set both together. |
| Which permission controls the Parts area / parts work? | The 'Parts Department' permission covers Catalog, Inventory, Vendors & Orders and Part Sales — they're one combined permission. To see cost and price columns there, the user also needs 'See Financial Data'. |
| What's the difference between Full view and Tech view? | Full view is the complete work-order screen, including the line Approve action and financial actions. Tech view is a simpler, technician-focused screen that hides the Approve action and some other controls — ideal for people who do the work but shouldn't approve or see everything. |
| How do I stop a role from seeing prices / dollar amounts? | Turn off 'See Financial Data' for that role. With it off, dollar amounts are hidden on work orders, parts and invoices, and the Finance tab won't appear at all. |
| How do I control who sees the AP/AR aging reports? | Right now, access to the AP/AR aging reports is controlled by the 'Manage Accounts Payable & Receivable' permission (in addition to Reports access). Turn that off for roles that shouldn't see aging reports. |
| How do I hide the sensitive customer fields (credit terms, limits, etc.)? | Those 7 fields (Credit Terms, Credit Limit, Default Labor Rate, Default Shop Supplies, Min & Max, Taxes, 'PO is required') are controlled by 'Manage Accounts Payable & Receivable'. Turn it off to hide them; the basic customer fields stay visible. |
| Why can a user edit or delete a note they didn't create? | That's how work-order notes work. Anyone with Work Orders: View (create/edit) can create and edit ANY note on a work order, and anyone with Work Orders: Delete can delete ANY note — notes aren't limited to their author. |
| Why can't this role delete a role I created? | A role can only be deleted when no users are assigned to it. Reassign the users off the role first, then the Delete option becomes available. |
| Why did a user get logged out right after I changed their role? | That's expected. Changing someone's role ends their current session immediately; the new permissions apply the next time they log in. |
| Why won't my new custom role save? | A role needs a name AND at least one permission turned on. Also, the name must be unique — a duplicate name is rejected, and a duplicate set of permissions prompts a 'similar role already exists' confirmation. |
| Can the Administrator role be edited or removed? | Administrator can be opened but always keeps full access (its switches are locked on), and no system role — including Administrator — can be deleted. Only Office and Time Clock are fully locked/view-only. |
| Where does 'View Permissions' live for a role? | For Office and Time Clock there's an eye icon in the Actions column. For every other role (system or custom), View Permissions is inside the three-dot menu. |
| Does Part Sales or a Purchase Order have a history log? | No. The history/audit log ('View History Logs') covers work orders only — both the work-order-level history and the line-level story. There is no history log for Part Sales or Purchase Orders. |
| What does 'Review Work Orders' do? | It controls the Review sign-off step on a work order. Until the Review step is completed, the Create Invoice button stays disabled. |
| Turning on Delete also turned on Create & Edit and View — is that a bug? | No, that's intended. For any resource, Delete requires Create & Edit and View, so switching Delete on turns those on too. Likewise, turning View off clears everything under that resource. |

> Coming soon (not live yet — do not promise these today): the AP/AR aging reports are planned to move to the Reports permission only; the role editor is planned to auto-link Order Parts with See Financial Data; and QuickBooks is planned to move under Finance settings. Until then, describe today's behaviour above.


## 5. Quick Troubleshooting

| Customer says... | Check this permission / toggle |
|---|---|
| "They can't see any prices / dollar amounts." | Turn on 'See Financial Data' for the role. |
| "There's no Finance tab on the work order." | Needs 'See Financial Data' AND Invoicing & Payments: View. Without See Financial Data the Finance tab never shows. |
| "They can't create an invoice." | Needs Invoicing & Payments: Create & Edit + See Financial Data. Also the work order's Review step must be completed and all parts received with a real part number. |
| "They can't order parts on a work order." | Turn on 'Order Parts' (under Work Orders) together with 'See Financial Data'. |
| "They can't pick in-stock parts." | Turn on 'Pick Parts' (under Work Orders). |
| "They can't add a part to a line." | Turn on 'Add Parts' (under Work Orders). |
| "They can't approve work-order lines." | Set the role to Full view (Tech view hides Approve) and give Work Order Lines: Create & Edit. |
| "They can't see or edit the parts catalog / inventory / vendors." | Give 'Parts Department' View or Create & Edit. For cost/price columns also turn on See Financial Data. |
| "They can't see the sensitive customer fields (credit terms/limits)." | Turn on 'Manage Accounts Payable & Receivable'. |
| "They can't open the AP/AR aging reports." | Give Reports access AND 'Manage Accounts Payable & Receivable' (aging reports currently need both). |
| "They can't see the work-order history / audit log." | Turn on 'View History Logs' (work orders only). |
| "They can't get into Settings / Staff / Roles." | Turn on the relevant Settings sub-switch (App Settings covers Roles, Staff, Locations, Departments, Taxes). |
| "They can't delete a work order." | Needs Work Orders: Delete. Note a work order must be moved to Uncomplete before it can be deleted. |
| "They can't reverse an invoice." | Reversing a work-order invoice needs Work Orders: Delete. |
| "They can't reverse/delete a payment." | Needs Invoicing & Payments: Delete. |
| "The role won't delete." | It has users assigned — reassign them to another role first, then delete. |
| "The Customers menu / Parts menu disappeared for them." | The parent permission (Customer Management: View / Parts Department) is off — turning a parent off hides the whole area. |

> Coming soon (not live yet — do not promise these today): the AP/AR aging reports are planned to move to the Reports permission only; the role editor is planned to auto-link Order Parts with See Financial Data; and QuickBooks is planned to move under Finance settings. Until then, describe today's behaviour above.


---


## 6. Internal Notes (NOT FOR CUSTOMERS)

> **Internal support/QA only. Do not read out or paste to customers.**

| Internal caveat | Detail |
|---|---|
| NOT FOR CUSTOMERS | This tab is for internal support/QA only. Do not read out or paste to customers. |
| Completed-inspection delete defect (SV-8193) | A role with Work Order Lines View/Edit but NOT Delete (confirmed for Technician and Parts Manager) can actually DELETE a completed inspection — the bin is shown and the backend allows it (delete succeeds; inspection is gone). It is not just a wrongly-shown button. Fix is pending confirmation. Do not tell a customer this is prevented. |
| Front-end gate vs backend enforcement | The backend only truly enforces resource-level View / Create & Edit. Granular Delete, the work-order sub-toggles, the cross-toggles and view mode are front-end display gates — the UI hides the control, but the underlying API often does not block it. So 'this role can't do X' based on a granular Delete or sub-toggle is a UI-level statement only. |
| Examples of the FE-only gate | Editing/removing catalog parts succeeded via the API for view-only/no-delete roles; changing the service advisor succeeded for a Technician despite the button being hidden; missing sub-toggles return a validation error, not a hard 'access denied'. |
| Add Customer/Asset on New Work Order | The Add Customer and Add Asset buttons on the New Work Order dialog appear and work even when Customer Management: Create & Edit is off (known FE gap). |
| Reports Sales report + See Financial Data | With See Financial Data off, the Reports > Sales report still shows financial figures. This appears to be by design (See Financial Data is scoped to work orders/parts/invoices; Reports is gated only by the Reports permission), but it is a common confusion point. |
| Spec-pending items (not live) | AP/AR aging reports still require Manage AP/AR (the move to Reports-only isn't live); the role editor does not yet auto-link Order Parts with See Financial Data; QuickBooks is absent from Finance settings and the Integrations group is still present; various migration/rename UI items are not observable. Do not describe these to customers as working. |
| Not fully verified | WO Parts tab gating by Order Parts is unconfirmed; line-level (vs WO-level) history was not separately exercised; the core OK/Not-OK control was not driven end-to-end. |
