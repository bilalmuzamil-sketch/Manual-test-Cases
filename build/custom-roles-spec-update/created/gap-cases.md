# Custom Roles - (Revised): New Spec-Gap TestRail Cases

Created 2026-07-05 via add_case. 3 new cases; no existing cases modified or deleted.

All fields: template_id=1 (Test Case (Text)), type_id=6 (Functional), custom_atmstatus=3, custom_automation_type=0.

---

## GAP #3 - Case C27868

- New case id: 27868
- URL: https://shopview.testrail.io/index.php?/cases/view/27868
- Section id: 3534
- Section path: 3527 Custom Roles - (Revised) > 3534 Work Orders Permissions
- priority_id: 4
- Title: Order Parts controls the Work Order Parts tab (ON shows it, OFF hides it)

### Preconditions

1. Log in as an Admin (to configure a custom role).
2. Create or edit a custom role.
3. Have a work order available that has at least one part line.

### Steps

1. In the custom role, turn Order Parts ON (with See Financial Data ON, which Order Parts requires) and save.
2. Log in as a user assigned that role.
3. Open a work order.
4. Look for the Parts tab on the work order.
5. Now, as Admin, edit the same role and turn Order Parts OFF, and save.
6. Log back in as the assigned user and open a work order again.
7. Look for the Parts tab on the work order.

### Expected Result

1. With Order Parts ON: the Work Order Parts tab is visible and can be opened.
2. The user can see and work with the parts on the work order via the Parts tab.
3. With Order Parts OFF: the Work Order Parts tab is hidden / not accessible.
4. The WO Parts tab visibility is controlled by the Order Parts permission.

---

## GAP #4 - Case C27869

- New case id: 27869
- URL: https://shopview.testrail.io/index.php?/cases/view/27869
- Section id: 3544
- Section path: 3527 Custom Roles - (Revised) > 3544 See Financial Data
- priority_id: 2
- Title: Enabling Order Parts while See Financial Data is OFF prompts to also enable See Financial Data

### Preconditions

1. Log in as an Admin.
2. Create or edit a custom role.
3. In that role, See Financial Data is currently OFF (and Order Parts is OFF).

### Steps

1. Open the custom role's permission settings.
2. Turn ON the Order Parts permission while See Financial Data is still OFF.
3. Observe the prompt/behavior.
4. Confirm/accept the prompt if one appears.
5. Save the role.

### Expected Result

1. Turning ON Order Parts triggers a prompt indicating See Financial Data must also be enabled (Order Parts requires See Financial Data).
2. Accepting the prompt turns See Financial Data ON automatically.
3. The role saves with both Order Parts and See Financial Data ON.
4. It is not possible to end up with Order Parts ON while See Financial Data is OFF.

---

## GAP #5 - Case C27870

- New case id: 27870
- URL: https://shopview.testrail.io/index.php?/cases/view/27870
- Section id: 3535
- Section path: 3527 Custom Roles - (Revised) > 3535 Work Order Lines Permissions
- priority_id: 4
- Title: WO Lines Create & Edit allows marking a core OK/Not-OK and adding line story/history

### Preconditions

1. Log in as a user assigned a custom role.
2. The role has Work Order Lines: Create and Edit turned ON.
3. A work order exists with a line that has a core-bearing part that has been received and is awaiting a core inspection (OK / Not OK).

### Steps

1. Open the work order and go to the line with the core part.
2. Find the core inspection control (OK / Not OK) on that line.
3. Mark the core as OK (or Not OK).
4. On the same line, add a line 'story' / history entry (a note about the work done on the line).
5. Save.

### Expected Result

1. The core OK / Not OK control is available and can be set by this role.
2. Marking the core OK/Not-OK saves successfully.
3. The line story / history entry can be added and saves successfully.
4. Both marking the core and the line story/history are governed by the Work Order Lines: Create and Edit permission.

