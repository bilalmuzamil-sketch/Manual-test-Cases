# Custom Roles — Developer Bug Drafts — 2026-07-13

The genuine build **Deviations** found during the 2026-07-13 behavioural VIU pass, written for developers. The reader-facing part of each bug uses very simple, non-technical language (no case IDs, no permission codes, no HTTP terms). The per-bug **Technical notes (QA internal)** block and the mapping table hold the case IDs, links and permission detail.

## 5 bug drafts (covering 8 test cases)

| # | Bug | Severity |
|---|---|---|
| CR-BUG-1 | New Work Order screen shows 'Add' buttons for creating a customer and an asset to users who are not allowed to add customers | Medium (permission bypass in UI) |
| CR-BUG-2 | Labor rate and pricing stay visible in the simplified technician view when the money permission is on | Low/Needs-decision (view-mode vs SFD precedence) |
| CR-BUG-3 | Turning on the invoice delete permission gives no confirmation prompt about the permission it depends on | Low/Needs-decision (dependency-prompt design) |
| CR-BUG-4 | Two roles can be created with the same name | Low (data hygiene / duplicate role names) |
| CR-BUG-5 | The role template picker shows the same names and long descriptions as the roles list | Low/Needs-decision (spec vs build wording) |

---

## CR-BUG-1 — New Work Order screen shows 'Add' buttons for creating a customer and an asset to users who are not allowed to add customers

**What happens now:** A user is given a role that lets them create work orders and view customers, but NOT create or edit customers. When they open the New Work Order screen they still see and can use the 'Add' button to create a brand-new customer, and — after picking a customer — the 'Add' button to create a brand-new asset.

**What should happen:** Because this user is not allowed to add or edit customers, both 'Add' buttons (new customer and new asset) should be hidden or disabled on the New Work Order screen.

**Steps to see it:**
1. Create a role with 'Work Orders: Create & Edit' ON and 'Customers: View' ON, but 'Customers: Create & Edit' OFF.
2. Assign this role to a test user and log in as that user.
3. Start a New Work Order.
4. Look at the 'Add' button next to the Customer field.
5. Pick a customer, then look at the 'Add' button next to the Asset field.

**Expected:** The 'Add' button next to Customer and the 'Add' button next to Asset are hidden or disabled.

**Actual:** Both 'Add' buttons are shown and clickable — the user can create a new customer and a new asset even though they lack the permission.

> **Technical notes (QA internal):** RUN331 FAIL persists. Test role = workOrdersCreateAndEdit + customersView, customersCreateAndEdit OFF. The Customers Create&Edit gate is not applied to the 'Add' affordances in the New Work Order modal. Asset 'Add' is only disabled before a customer is selected (customer-required dependency), then becomes enabled. Screenshots: newwo-modal-addbuttons / newwo-custselected-addasset. Affected cases: [C26387](https://shopview.testrail.io/index.php?/cases/view/26387), [C26388](https://shopview.testrail.io/index.php?/cases/view/26388).

---

## CR-BUG-2 — Labor rate and pricing stay visible in the simplified technician view when the money permission is on

**What happens now:** The technician (simplified) view is meant to keep money off the screen. But when a user's role has the money permission ('See Financial Data') turned on, the work order lines screen still shows the labor Rate, Margin and Total columns and the labor dollar amount — even in the technician view.

**What should happen:** Please confirm the intended behaviour: the test case expected the labor rate to stay hidden in the technician view even when the money permission is on. If that is correct, the labor rate columns and amount should be hidden in the technician view.

**Steps to see it:**
1. Create a role set to the technician (simplified) view that ALSO has the money permission ('See Financial Data') ON.
2. Assign it to a test user and log in.
3. Open a work order and view its lines.
4. Look for the Rate, Margin and Total columns and the labor dollar amount.

**Expected:** In the technician view the labor rate columns and the labor dollar amount are hidden.

**Actual:** The Rate, Margin and Total columns and the labor amount ($150) are all shown.

> **Technical notes (QA internal):** Labor-rate visibility follows See Financial Data (SFD), not the view mode. The overall money-by-SFD principle otherwise holds (plain Technician with SFD off shows no $ or prices anywhere). CAVEAT for dev: the test role also had workOrdersCreateAndEdit — dev to confirm that is not what surfaced the columns. Screenshot: techview-sfd-lines. Affected cases: [C26459](https://shopview.testrail.io/index.php?/cases/view/26459), [C26464](https://shopview.testrail.io/index.php?/cases/view/26464).

---

## CR-BUG-3 — Turning on the invoice delete permission gives no confirmation prompt about the permission it depends on

**What happens now:** When editing a role, ticking the 'Invoicing & payments: Delete / Reverse' permission while 'View and Manage AP/AR Data' is OFF simply turns Delete on. No prompt appears.

**What should happen:** The test case expected a prompt to appear asking to also turn on the permission that Delete depends on, so the tester is not left with an inconsistent set of permissions. Please confirm which dependency should be enforced here.

**Steps to see it:**
1. Edit a role.
2. Make sure 'View and Manage AP/AR Data' is OFF.
3. Tick 'Invoicing & payments: Delete / Reverse'.
4. Watch for a confirmation prompt.

**Expected:** A confirmation prompt appears offering to also turn on the dependent permission.

**Actual:** No prompt appears — Invoicing Delete just turns on and the other permission stays off.

> **Technical notes (QA internal):** The build actually links Invoicing to 'See Financial Data' (there IS an SFD-direction dialog), not to View and Manage AP/AR Data. The case's expected AP/AR prompt is stale / not implemented. Dev/PO to confirm the intended dependency (SFD vs AP/AR). Affected cases: [C26424](https://shopview.testrail.io/index.php?/cases/view/26424).

---

## CR-BUG-4 — Two roles can be created with the same name

**What happens now:** You can create a new role using a name that already exists. The system only warns you if the new role has the exact same set of permissions as an existing one, and even then it lets you continue with a 'Create Anyway' button. It does not stop you from reusing a name.

**What should happen:** Role names should be unique — the system should prevent creating a second role with a name that is already in use.

**Steps to see it:**
1. Note the name of an existing role.
2. Start creating a new custom role and type that same name.
3. Give it a different set of permissions.
4. Save.

**Expected:** The system blocks the save and tells you the name is already in use.

**Actual:** The role saves with a duplicate name. (A warning only appears if the permissions are identical, and it can be overridden with 'Create Anyway'.)

> **Technical notes (QA internal):** The SimilarRoleWarningModal keys on IDENTICAL PERMISSIONS ('identical permissions already exists') + 'Create Anyway', not on the name. Name uniqueness is not enforced. Affected cases: [C26339](https://shopview.testrail.io/index.php?/cases/view/26339).

---

## CR-BUG-5 — The role template picker shows the same names and long descriptions as the roles list

**What happens now:** When creating a role you first pick a starting template. The template picker shows the same role names (Admin, Foreman, Office User, ...) and the same descriptions as the main Roles list.

**What should happen:** The test cases expected the template picker to use shorter names and/or different (shorter) descriptions than the Roles list. Please confirm whether distinct template labels were ever intended.

**Steps to see it:**
1. Start creating a new custom role.
2. Look at the names and descriptions in the template picker.
3. Compare them to the names and descriptions in the main Roles list.

**Expected:** The template picker uses shorter names and/or different descriptions than the Roles list.

**Actual:** The template picker names and descriptions are identical to the Roles list (e.g. Admin 'Full system access', Foreman 'Oversees technicians and work orders').

> **Technical notes (QA internal):** Premise likely stale — may be a spec/case expectation mismatch rather than a code defect. Dev/PO to confirm whether distinct/shorter template labels were ever intended. Affected cases: [C26340](https://shopview.testrail.io/index.php?/cases/view/26340), [C26341](https://shopview.testrail.io/index.php?/cases/view/26341).

---

## Not bugs — corrected stale case wording (excluded)

- [C26529](https://shopview.testrail.io/index.php?/cases/view/26529), [C26530](https://shopview.testrail.io/index.php?/cases/view/26530), [C26531](https://shopview.testrail.io/index.php?/cases/view/26531): QuickBooks / Integrations. Re-check of the state doc: the build KEEPS QuickBooks under the Integrations settings section (Integrations gates IBS / Open API / QuickBooks; Finance gates only Payment Methods / Taxes). The old case premise (QuickBooks moving to Finance and Integrations being removed) was STALE and has been corrected in the case wording to match the current build and the 09-Jul spec. This is corrected case wording, NOT a build defect — no dev ticket needed.

## Now Fixed (RUN331 fails re-verified this pass — awareness only, not bugs)

- [C26475](https://shopview.testrail.io/index.php?/cases/view/26475): Turning 'See Financial Data' OFF now shows the 'Disable See Financial Data?' confirmation prompt ('Disabling See Financial Data will also disable Invoicing & Payments. Continue?' [Cancel | Disable]). RUN331 fail now fixed.

- [C26482](https://shopview.testrail.io/index.php?/cases/view/26482): AP/AR aging reports now follow the Reports permission: with Reports ON but 'View and Manage AP/AR Data' OFF, all 6 AP/AR aging reports are still listed on the Reports page (A/R Aging Summary / Detail / Collection, A/P Aging Summary / Detail, A/P Unpaid Invoices). RUN331 fail now fixed.

## Mapping (QA internal): bug -> affected cases + permission / enforcement detail

| Bug | Case | Link | Permission / enforcement detail |
|---|---|---|---|
| CR-BUG-1 | C26387 | [link](https://shopview.testrail.io/index.php?/cases/view/26387) | RUN331 FAIL persists. Test role = workOrdersCreateAndEdit + customersView, customersCreateAndEdit OFF. The Customers Create&Edit gate is not applied to the 'Add' affordances in the New Work Order modal. Asset 'Add' is only disabled before a customer is selected (customer-required dependency), then becomes enabled. Screenshots: newwo-modal-addbuttons / newwo-custselected-addasset. |
| CR-BUG-1 | C26388 | [link](https://shopview.testrail.io/index.php?/cases/view/26388) | RUN331 FAIL persists. Test role = workOrdersCreateAndEdit + customersView, customersCreateAndEdit OFF. The Customers Create&Edit gate is not applied to the 'Add' affordances in the New Work Order modal. Asset 'Add' is only disabled before a customer is selected (customer-required dependency), then becomes enabled. Screenshots: newwo-modal-addbuttons / newwo-custselected-addasset. |
| CR-BUG-2 | C26459 | [link](https://shopview.testrail.io/index.php?/cases/view/26459) | Labor-rate visibility follows See Financial Data (SFD), not the view mode. The overall money-by-SFD principle otherwise holds (plain Technician with SFD off shows no $ or prices anywhere). CAVEAT for dev: the test role also had workOrdersCreateAndEdit — dev to confirm that is not what surfaced the columns. Screenshot: techview-sfd-lines. |
| CR-BUG-2 | C26464 | [link](https://shopview.testrail.io/index.php?/cases/view/26464) | Labor-rate visibility follows See Financial Data (SFD), not the view mode. The overall money-by-SFD principle otherwise holds (plain Technician with SFD off shows no $ or prices anywhere). CAVEAT for dev: the test role also had workOrdersCreateAndEdit — dev to confirm that is not what surfaced the columns. Screenshot: techview-sfd-lines. |
| CR-BUG-3 | C26424 | [link](https://shopview.testrail.io/index.php?/cases/view/26424) | The build actually links Invoicing to 'See Financial Data' (there IS an SFD-direction dialog), not to View and Manage AP/AR Data. The case's expected AP/AR prompt is stale / not implemented. Dev/PO to confirm the intended dependency (SFD vs AP/AR). |
| CR-BUG-4 | C26339 | [link](https://shopview.testrail.io/index.php?/cases/view/26339) | The SimilarRoleWarningModal keys on IDENTICAL PERMISSIONS ('identical permissions already exists') + 'Create Anyway', not on the name. Name uniqueness is not enforced. |
| CR-BUG-5 | C26340 | [link](https://shopview.testrail.io/index.php?/cases/view/26340) | Premise likely stale — may be a spec/case expectation mismatch rather than a code defect. Dev/PO to confirm whether distinct/shorter template labels were ever intended. |
| CR-BUG-5 | C26341 | [link](https://shopview.testrail.io/index.php?/cases/view/26341) | Premise likely stale — may be a spec/case expectation mismatch rather than a code defect. Dev/PO to confirm whether distinct/shorter template labels were ever intended. |