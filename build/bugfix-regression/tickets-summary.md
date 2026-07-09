# Bug-Fix / Regression Re-Test Plan

Source: ShopView Jira/Confluence (shopview.atlassian.net). Read-only extraction on 2026-07-03.
Cloud ID: 19fdd96d-a135-46c4-83e7-d2cc218a4e63

- Tickets to re-test: **114**
- Excluded (SV-4796 children assigned to Milan): **16**
- Release pages parsed: v0.31, v0.43, v0.44, v0.48, v0.54 (Bug Fixes + Regressions sections) + Epic SV-4796 children

> Steps to Reproduce / Expected / Actual were auto-extracted from each ticket's description. `has_usable_repro=false` means no explicit steps block was present and the repro must be inferred.

## v0.31 Bug Fixes (18)

### SV-3104 — BUG: Loader should be added on vendor/unpaid_invoices page
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nebojsa Miskovic  |  **Fix Version:** v0.31
- **Appears in:** v0.31 Bug Fixes
- **Reported issue:** * See video:
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-3264 — BUG: Columns Billable canot be sorted on administration/staff page
- **Area:** roles / permissions  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** parth fadadu  |  **Fix Version:** v0.31
- **Appears in:** v0.31 Bug Fixes
- **Reported issue:** * On the page administration/staff each column with arrow can be sorted. It works for each field except for Billable.
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** it should work the same as Is Active column
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-3408 — Part Request Identifier Not Working
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** OBSOLETE  |  **Assignee:** Jasna Mladenovic  |  **Fix Version:** v0.31
- **Appears in:** v0.31 Bug Fixes
- **Reported issue:** In the parts tab on a work order, on the left side there is an icon wich is supposed to have the user initials on it of 'who' created the original parts request. This is not working, and it is showing AN. See screen shot.

It should be showing the initials, and on hover, the persons name, of the user that created the initial parts request.

‌

‌

Submitted by Kimberly at Foothills

—
created by Support (intercom@shopview.com) in Intercom
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** Ticket status is OBSOLETE - confirm still in scope before testing.; No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-3606 — Regression - unable to update IBS approval code
- **Area:** general / UI  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** parth fadadu  |  **Fix Version:** v0.31
- **Appears in:** v0.31 Bug Fixes
- **Reported issue:** Users are not able to update the IBS approval code in the approval modal. Screenshot below and original ticket linked.

Field is greyed out and I get the red circle upon hover.

To fix:

field should be open to edit and a save button should be present when edited.
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-3612 — Stuck on invoiced status - paid
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Milan Zivanovic  |  **Fix Version:** v0.31
- **Appears in:** v0.31 Bug Fixes
- **Reported issue:** We have a user who is reporting that two of his invoices are showing as invoiced but are currently paid. nothing looks off with them but there are payments applied to them and I have confirmed the status is still Invoiced. the user was unable to provide any details, please test and confirm bug

https://app.shopview.com/workorders/6d98be18-dc34-4b3d-8ec7-2a2234887f05/lines

‌

https://app.shopview.com/workorders/a666f762-adb3-4821-968c-780938759689/lines

Update 06.12

Just had this one reported as well for Caledonia

https://app.shopview.com/workorders/6d68b7cb-197d-4484-9570-d408c525ef2e/finance

---

07.24.2025

Here is a new one that was just reported for Caledonia as well S-1028.

Shows ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-3715 — Bug: Special Order Part Price/Cost Changes from .99 to .98 After Receipt
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** parth fadadu  |  **Fix Version:** v0.31
- **Appears in:** v0.31 Bug Fixes
- **Reported issue:** Description:
There is a pricing bug affecting special order parts where a cost or sell price ending in .99 (e.g., $16.99) is automatically changed to .98 (e.g., $16.98) after the part is received.

This issue has been confirmed to:

* Only affect values ending in .99
* Affect both cost and sell price
* Happen after the part is received
* Be unfixable via the Edit Part modal, but can be corrected via the Parts tab

---
- **Steps to reproduce:**
  1. Request a special order part.
  2. Set Cost to $16.99.
  3. Receive the part.
  4. Observe the price/cost now reads $16.98.
  5. Attempt to edit via Edit Part modal – value does not save.
  6. Edit the value via the Parts tab – correctly saves as $16.99.
- **Expected after fix:** Prices and costs should reflect exactly what the user inputs, especially for specific decimal values like .99. The system should not round or alter values during or after any workflow events like receiving a part.
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-3897 — Change status of Paid WO to Paid - Foothills
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Milan Zivanovic  |  **Fix Version:** v0.31
- **Appears in:** v0.31 Bug Fixes
- **Reported issue:** We had this bug reported before but I was never able to figure out how it happened and it is very intermittent, support was tagged to test.

The related bug ticket is linked and I believe we manually went in and flipped the status over for them, I’d like to do the same for Foothills please.

Here are the WO that are paid in ShopView but stuck on the status invoiced. Users are also not able to delete the payments and try paying them again.

S5-523 https://app.shopview.com/workorders/3cbe0c80-75f9-4f98-b9d9-89dfddb3a0bb/finance

S5-2434 https://app.shopview.com/workorders/4b50d53b-9e8e-47fb-aea4-b358cc81c17b/finance

S5-2708 ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-3916 — Prevent Invoicing of Declined Work Orders
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** parth fadadu  |  **Fix Version:** v0.31
- **Appears in:** v0.31 Bug Fixes
- **Reported issue:** Description:

Currently, a Work Order (WO) with all lines declined can still be invoiced. This leads to the following issues:

* A $0 invoice is created and marked as paid.
* When sent to QuickBooks (QB), the invoice contains no lines, resulting in a QB error.
* Users are able to inadvertently invoice WOs that are entirely declined, which should either remain for future approval or be deleted if no longer needed.
- **Steps to reproduce:**
  1. Create a Work Order.
  2. Add a line item.
  3. Decline the line.
  4. Attempt to invoice the WO.
  5. A $0 invoice is created and marked as paid.
- **Expected after fix:** The "Invoice" button should not be present if all lines on the WO are declined. It should act like an open work order still. A WO must have at least one completed line, with all lines completed in order to be invoiced.
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-4071 — Manually Remove Stuck Parts and Delete Work Order S-100
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Milan Zivanovic  |  **Fix Version:** v0.31
- **Appears in:** v0.31 Bug Fixes
- **Reported issue:** The customer reported that parts on Work Order S-100 are stuck and cannot be removed. A new WO (S-438) has already been created with the correct information.

‌

Requesting the backend team to:

‌

1. Manually remove the stuck parts from S-100
2. Delete Work Order S-100 from the system

‌

‌

Customer: Antares Hire NZ Ltd

‌
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-4112 — Bulk edit on Lines throws an error
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Dusan Bulovan  |  **Fix Version:** v0.31
- **Appears in:** v0.31 Bug Fixes
- **Reported issue:** When selecting multiple Lines, and then using gyros menu to change it in bulk, an error is thrown:
Could not resolve the App\\VehicleService\\WorkOrders\\Application\\Line\\ChangeLines\\ChangeCommand class
Which is a masked error in front of real error:
SQLSTATE[42S22]: Column not found: 1054 Unknown column 'pr.part_request_type' in 'where clause'
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-4113 — Inventory Import Preview Not Working
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Stefan Mitrovic  |  **Fix Version:** v0.31
- **Appears in:** v0.31 Bug Fixes
- **Reported issue:** Environment:
Staging

Issue:
The Inventory Import preview is not working, but the imported parts are still visible in the app.

‌

On production, the same file was imported successfully, and the preview worked as expected.
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-4140 — Schedule - Default Timeline Position
- **Area:** scheduling  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Dusan Radulovic  |  **Fix Version:** v0.31
- **Appears in:** v0.31 Bug Fixes
- **Reported issue:** Environment:
Staging and Production

Issue:
Navigating between days in Scheduling table (via calendar picker, Prev/Next Day buttons, or the Today button) causes the timeline to briefly show 12:00 AM before jumping to the intended 6:00 AM. This issue does not occur on the initial Schedule page load.

Test case:
[https://shopview.testrail.io/index.php?/cases/view/1880](https://shopview.testrail.io/index.php?/cases/view/1880)
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-4141 — Schedule -  500 Error on July 23rd and Table Loading Issues After Location Change
- **Area:** scheduling  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Milomir Kotlajic  |  **Fix Version:** v0.31
- **Appears in:** v0.31 Bug Fixes
- **Reported issue:** Environment:
Staging and Prod

Issue:

* 500 Error on July 23rd

    * Opening the Scheduler defaults to Today’s date. This works as expected
    * Clicking Prev to go to July 23rd triggers a 500 error
    * Clicking Prev again to July 22nd gives no error
    * Clicking Next to return to July 23rd triggers a 500 error again
    * Selecting July 23rd from the calendar also triggers the error immediately
    * The issue appears specific to July 23rd only

* Changing Location Does Not Load Schedule Automatically

    * When switching to a different shop location, the schedule does not load until the page is manually refreshed

* Error When Location Has No Departments or Staff

    * If the ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-4145 — Parts disappeared from Work Order S2-7450 after approval
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Milan Zivanovic  |  **Fix Version:** v0.31
- **Appears in:** v0.31 Bug Fixes
- **Reported issue:** Kimberly Christiansen ([kchristiansen@foothillsgroup.ca](mailto:kchristiansen@foothillsgroup.ca))

‌

Customer: Foothills Group

Issue Summary:

Kimberly reported that in Work Order S2-7450, lines 1, 2, and 3 were approved by Davin. However, the parts on lines 2 and 3 have vanished from the order. From her understanding, these lines had parts that were either received or authorized to order. Kimberly did not work on this order personally, so she is unsure of what exactly was on those lines before they disappeared.

‌

Request to the team to investigate the order history and determine why lines 2 and 3 were cleared or deleted post-approval. Determine if data can be restored.
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-4153 — BUG: Cannot open any workorder when logged in with roles that are not Admin
- **Area:** roles / permissions  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nemanja Djuric  |  **Fix Version:** v0.31
- **Appears in:** v0.31 Bug Fixes
- **Reported issue:** Steps:
\- Login with user that has any role other than Admin
\- Try opening any of the work orders

See video:
- **Steps to reproduce:**
  1. \- Login with user that has any role other than Admin
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-4177 — BUG: Cannot add new staff member
- **Area:** roles / permissions  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nikola Milosevic  |  **Fix Version:** v0.31
- **Appears in:** v0.31 Bug Fixes
- **Reported issue:** Steps:

* Navigate to {{BASE_URL}}/administration/staff
* Click New Staff member → New Staff Member dialog opens
* Fill in dialog with valid data (set role to anything except Admin)
* Click Save & Close
- **Steps to reproduce:**
  1. Navigate to {{BASE_URL}}/administration/staff
  2. Click New Staff member → New Staff Member dialog opens
  3. Fill in dialog with valid data (set role to anything except Admin)
  4. Click Save & Close
- **Expected after fix:** Staff member is added and email is sent to that member
- **Original actual:** { "errors": \[ { "workPlaceId": "Workplace ID is missing." } \] }
- **Usable repro:** yes

### SV-4183 — BUG: New staff member cannot complete registration
- **Area:** roles / permissions  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nemanja Djuric  |  **Fix Version:** v0.31
- **Appears in:** v0.31 Bug Fixes
- **Reported issue:** Steps:

* Add new Staff member
* Open mail where invite was sent
* Click accept invitation (open that link in incognito or logout from previous account)
* Sett password and repeat password and click submit
- **Steps to reproduce:**
  1. Add new Staff member
  2. Open mail where invite was sent
  3. Click accept invitation (open that link in incognito or logout from previous account)
  4. Sett password and repeat password and click submit
- **Expected after fix:** User registered successfully
- **Original actual:** 403 error
- **Usable repro:** yes

### SV-4208 — BUG: Cannot return special order part
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Stefan Mitrovic  |  **Fix Version:** v0.31
- **Appears in:** v0.31 Bug Fixes
- **Reported issue:** Issue 1: Return function is not working

* See video:

---

Issue 2:  Full Return - Returning parts with cores does not return associated cores
- **Steps to reproduce:**
  1. Order and receive a special order part with a core, with a quantity of 5 on any WO line
  2. Click on the 3 dots next to the part name on the line
  3. In the dropdown, select Return
  4. Set the return quantity to 5 and click Save & Close
  5. Observe
- **Expected after fix:** When parts with cores are returned, the same number of cores should also be returned
- **Original actual:** 5 parts are returned, status is Returned → expected 5 associated cores remain staged on the line → not expected
- **Usable repro:** yes

## v0.43 Bug Fixes (17)

### SV-3208 — Shop Supplies from Declined Lines Are Being Added to the Invoice When 'Show Declined Work' Is Toggled
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Milan Zivanovic  |  **Fix Version:** v0.43
- **Appears in:** v0.43 Bug Fixes
- **Reported issue:** Environment:
Staging & Prod

Issue:
Shop supplies from declined lines are being added to the Invoice when 'Show Declined Work' Is toggled.

Show Declined Work toggle is OFF - everything looks good

Show Declined Work toggle is ON - shop supplies from declined lines are being added to the Balance

‌

How it should work:
When a line item is marked as "declined" on a work order, it means the service or part associated with that line is not being processed or accepted. Therefore, no costs, such as shop supplies, parts, or labor time, should be included in the final calculations for that line. Even if there are parts listed or an estimated time for labor, they should not factor into the total ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-3730 — Work orders and invoice total wrong on work order page
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Milan Zivanovic  |  **Fix Version:** v0.43
- **Appears in:** v0.43 Bug Fixes
- **Reported issue:** On the work orders page, the totals are wrong.

‌

When in work order status still, it seems it is out by a few pennies. Once they are invoiced, they are way out.

These numbers should never be different then what the finance tab is showing. It needs to be pulling from the same place and not doing any of its own calculations.

‌
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-4219 — Parts pricing does not update to current price when adding a canned line
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** parth fadadu  |  **Fix Version:** v0.43
- **Appears in:** v0.43 Bug Fixes
- **Reported issue:** When adding a canned line to a work order, the parts pricing does not update to the current sell price. Instead, it retains the sale price from when the canned line was originally saved.

‌
- **Steps to reproduce:**
  1. ‌
  2. Create a canned line with a part (example: LF14000NN) at a specific sell price (e.g., $2).
  3. Update the part’s sell price in inventory (e.g., $4).
  4. Add the same canned line to a work order.
  5. Observe that the price displayed is still the original $2 instead of the updated $4.
- **Expected after fix:** When a canned line is added, the part’s pricing should pull the current sell price from inventory. If it is a ‘fixed price’ in inventory, it should pull the fixed price. If it is not a fixed price, it should use the matrix as per category set up in inventory.
- **Original actual:** The canned line uses the sell price from when it was originally saved.
- **Usable repro:** yes

### SV-4240 — BE Financial Info card does not calculate Tax on Parts when Labor rate is Fixed Line Total.
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Milan Zivanovic  |  **Fix Version:** v0.43
- **Appears in:** v0.43 Bug Fixes
- **Reported issue:** Customer Name: Genes Wrecker, Tire & Truck

Number of Users: 12

Environment: Customer’s Account

‌

Description:

The Financial Info section on an Estimate is only calculating sales tax on Shop Supplies, while in the Finance tab, tax is calculated correctly on both Parts and Shop Supplies.

‌

Customer’s Account

‌

‌

My TEST ACCOUNT:

‌

I tested the same settings in my own account, and the tax calculation worked correctly. Later, now I just checked the line that the user added, it's a fixed line total. So if we add a Fixed line total, then we will be able to replicate it in the test accoutn.

‌
- **Steps to reproduce:**
  1. In Settings → Taxes, edit the relevant tax and toggle off tax for Labor. Ensure Parts and Shop Supplies are enabled; tax rate set to 8.25%.
  2. Create a Work Order.
  3. Add a new line and select Labor Rate = Fixed Line Total.
  4. Save & Close the line.
  5. Check the Financial Info card/section for the Work Order and review calculated taxes.
- **Expected after fix:** The Financial Info card/section should calculate and display Tax on Parts at 8.25% (per client settings) even when the Labor rate is Fixed Line Total, matching the behavior of the Finance → Invoice.
- **Original actual:** The Financial Info card/section does not calculate or display Tax on Parts for the line with Fixed Line Total. Only Shop Supplies tax appears (consistent with Labor tax being disabled).
- **Usable repro:** yes

### SV-4696 — Credit Amount Rounding Off by 1 Cent (Both Vendor and Customer Credits)
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Milomir Kotlajic  |  **Fix Version:** v0.43
- **Appears in:** v0.43 Bug Fixes
- **Reported issue:** When entering credits on either the Vendor or Customer side, the system occasionally rounds the total amount down by $0.01 after saving.
For example, if a user enters $33.37, it saves as $33.36.
- **Steps to reproduce:**
  1. Go to Vendors → Unpaid Invoices (or Customers → Unpaid Invoices)
  2. Select a Vendor/Customer (e.g., NAPA).
  3. Click Add Credit.
  4. Enter a credit amount such as $33.37, $316.28, $73.24, $1053.84, etc.
  5. Click Save.
  6. Observe that the saved amount is reduced by $0.01 (e.g., $33.37 → $33.36).
- **Expected after fix:** The credit amount should remain exactly as entered after saving (no rounding or decimal change).
- **Original actual:** The system reduces the total by 1 cent after saving, e.g., $33.37 saves as $33.36.
- **Usable repro:** yes

### SV-4768 — Bug: Not Able to Uncomplete the line from Workorder.
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Dusan Bulovan  |  **Fix Version:** v0.43
- **Appears in:** v0.43 Bug Fixes, SV-4796 Epic (V0.43 Regression Testing Bugs)
- **Reported issue:** Env: Staging
- **Steps to reproduce:**
  1. Create a line
  2. Mark it as complete
  3. Attempt to uncomplete the line.
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-4771 — Create Invoice Button is Missing From WO and PS
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Stefan Mitrovic  |  **Fix Version:** v0.43
- **Appears in:** v0.43 Bug Fixes, SV-4796 Epic (V0.43 Regression Testing Bugs)
- **Reported issue:** Environment:
Stage

Issue:
Create Invoice button is missing from WO and PS
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-4772 — Bug: Workorder -> Parts tab is not showing the data in the relevant columns
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nikola Milosevic  |  **Fix Version:** v0.43
- **Appears in:** v0.43 Bug Fixes, SV-4796 Epic (V0.43 Regression Testing Bugs)
- **Reported issue:** STRs:

* Request a few parts on a Wororder → Line
* Click Parts Tab
* Observe the alignment of the data in the columns
  Result: The relevant data is not appearing under the correct headers/columns

Staging Environment:

Production Environment:

---

‌

‌
- **Steps to reproduce:**
  1. Request a few parts on a Wororder → Line
  2. Click Parts Tab
  3. Observe the alignment of the data in the columns
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-4778 — Bug: Workorder -> Parts -> Margin column after it is edited it shows wrong sell price.
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Dusan Bulovan  |  **Fix Version:** v0.43
- **Appears in:** v0.43 Bug Fixes, SV-4796 Epic (V0.43 Regression Testing Bugs)
- **Reported issue:** STRs:

* Create a WorkOrder → Create Line -> Request a Special Order part
* Complete the process of requesting a Special Order part
* Click Parts tab
* Change the value of the Margin
* Observe the wrong sell price being automatically calculated.
- **Steps to reproduce:**
  1. Create a WorkOrder → Create Line -> Request a Special Order part
  2. Complete the process of requesting a Special Order part
  3. Click Parts tab
  4. Change the value of the Margin
  5. Observe the wrong sell price being automatically calculated.
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-4779 — Bug: Work Order can not be marked as completed if a part with core has been returned
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Dusan Bulovan  |  **Fix Version:** v0.43
- **Appears in:** v0.43 Bug Fixes, SV-4796 Epic (V0.43 Regression Testing Bugs)
- **Reported issue:** STRs:

* Create a WO → Request a special order part with core → Receive the part
* DO NOT press OK/Not OK for the core
* Return the main part with core (Refer to the screen recording)
* Attempt to mark the WO as complete
* Observe the result:

    
    Line cant be completed with unfulfilled Core part.
    Please try to resolve this.
    

Note: This is not reproducible on Production

‌

Screen Recording: Staging:

---

‌

Screen Recording production:
- **Steps to reproduce:**
  1. Create a WO → Request a special order part with core → Receive the part
  2. DO NOT press OK/Not OK for the core
  3. Return the main part with core (Refer to the screen recording)
  4. Attempt to mark the WO as complete
  5. Observe the result:  Line cant be completed with unfulfilled Core part. Please try to resolve this. 
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-4800 — Bug: Invoice calculation shows unexpected values for taxes
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Unassigned  |  **Fix Version:** v0.43
- **Appears in:** v0.43 Bug Fixes, SV-4796 Epic (V0.43 Regression Testing Bugs)
- **Reported issue:** Issue is that taxes are not showing expected values.
Invoice: https://app.staging.shopview.com/workorders/9930a4e7-4e39-43e5-a0b9-7a2b0c60c70d/finance

Error reported in test:


The following asserts failed:
	Tax 'gst (5%)' value doesn't add up: Expected 873.36, Found 878.36,
	Tax 'PST (7%)' value doesn't add up: Expected 1222.71, Found 1229.71


Additional info that might help in detecting cause for this bug:
gst = 5% and its value is $5 greater than expected
PST = 7% abd it’s value is $7 gretaer than expected
Might be coincidence but it’s worth looking at.

Here you can see entire log from test automation:


2025-11-04 11:55:46 INFO  pages.finance.FinancePage - Estimate/Invoice toggle set ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-4802 — Inventory Part Remains in Quoted Status after Line Status Changes from Need Approval to Approved
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nikola Milosevic  |  **Fix Version:** v0.43
- **Appears in:** v0.43 Bug Fixes, SV-4796 Epic (V0.43 Regression Testing Bugs)
- **Reported issue:** Environment:
Staging

Issue:
When the line status is updated from Needs Approval/Authorization Required to Approved/Authorized, requested Inventory Part incorrectly remains in the Quoted status instead of updating to the In stock with action Pick

‌
- **Steps to reproduce:**
  1. Create a non-authorized line (status of the line: Needs Approval/Authorization Required)
  2. Request Inventory Part
  3. Change the line status to Approved/Authorized
  4. Observe
- **Expected after fix:** The inventory part status should automatically update from Quoted to In stock with action Pick
- **Original actual:** The inventory part remains in Quoted status
- **Usable repro:** yes

### SV-4816 — Decline Line With Staged Parts on the WO
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Dusan Bulovan  |  **Fix Version:** v0.43
- **Appears in:** v0.43 Bug Fixes, SV-4796 Epic (V0.43 Regression Testing Bugs)
- **Reported issue:** Environment:
Staging vs Production

‌

Issue:

Stage → Line cannot be declined with staged parts

Prod → Line can be declined with staged parts

‌
- **Steps to reproduce:**
  1. Navigate to any WO line
  2. Request and receive parts
  3. Change status to Declined
  4. method1: via Edit Line > Status (dropdown) > Declined
  5. method2: via Line Options (3-dot menu) > Set line status > Declined
  6. Observe
- **Expected after fix:** s:
- **Original actual:** s:
- **Usable repro:** yes

### SV-4821 — Bug: Adding a part to the Fixed line total increases the Price of the Total by 1 cent.
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Unassigned  |  **Fix Version:** v0.43
- **Appears in:** v0.43 Bug Fixes, SV-4796 Epic (V0.43 Regression Testing Bugs)
- **Reported issue:** Issue:

Adding a part to the Fixed line total increases the Price of the Total by 1 cent.

‌
- **Steps to reproduce:**
  1. Create a Fixed line total.
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-4871 — Bug:  Paid Work Orders display incorrect totals in the Work Orders list
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Unassigned  |  **Fix Version:** v0.43
- **Appears in:** v0.43 Bug Fixes, SV-4796 Epic (V0.43 Regression Testing Bugs)
- **Reported issue:** ### Environment:

* Environment: Staging
* User: [bilalmuzamil+shopview@gmail.com](mailto:bilalmuzamil+shopview@gmail.com)
* Password: [REDACTED]
* Location: Import test

---

### Description:

When filtering Work Orders by status = Paid, the Price Total shown in the Work Orders list does not match the total displayed under the Financial Info section or the Finance tab of the same Work Order.
Note: The Work Order has NO parts

### Steps to Reproduce (STRs):

1. Log in using the credentials above.
2. Switch to the location “Import test.”
3. Navigate to the Work Orders section.
4. Filter the Status by Paid.
5. Observe the Price Total of the first Work Order appearing in the list and note the ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-4880 — Move Part: Ordering of the Line is Incorrect in Target Line Dropdown
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Stefan Mitrovic  |  **Fix Version:** v0.43
- **Appears in:** v0.43 Bug Fixes, SV-4796 Epic (V0.43 Regression Testing Bugs)
- **Reported issue:** Environment:
Staging

‌

Issue:
Ordering of the lines is incorrect in Move part to line modal →   Target Line dropdown
- **Steps to reproduce:**
  1. Create WO with 4 lines
  2. Name lines:
  3. Line 1 → 111
  4. Line 2 → 222
  5. Line 3 → 333
  6. Line 4 → 444
  7. Request and pick any part on the Line 1
  8. Move part to any other line
  9. Observe
- **Expected after fix:** Only 3 line should be visible in Target Line dropdown as:
- **Original actual:** 3 line are visible in Target Line dropdown as:
- **Usable repro:** yes

### SV-4881 — BUG: Cannot send invoice email if Customer Email is missing
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Vladimir Radojcic  |  **Fix Version:** v0.43
- **Appears in:** v0.43 Bug Fixes, SV-4796 Epic (V0.43 Regression Testing Bugs)
- **Reported issue:** * See video:
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

## v0.43 Regressions (10)

### SV-4845 — Bug: Changing the Estimated Time for a fixed Line total sets all the values for Labor Portion/Parts Portion etc to "0"
- **Area:** work orders  |  **Type:** Bug  |  **Status:** OBSOLETE  |  **Assignee:** Stefan Mitrovic  |  **Fix Version:** none
- **Appears in:** v0.43 Regressions, SV-4796 Epic (V0.43 Regression Testing Bugs)
- **Reported issue:** Issue:
Changing the Estimated Time for a fixed Line total sets all the values for Labor Portion/Parts Portion etc to "0"

Kindly Note: This is not reproducible on Production Environment.
- **Steps to reproduce:**
  1. Create a WO → Create Line → Set the line to be the Fixed Line total
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes
- **Notes:** Ticket status is OBSOLETE - confirm still in scope before testing.; No fixVersion set on ticket.

### SV-4917 — Email not sending after changing the invoice date
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Aleksa Toljic  |  **Fix Version:** v0.45
- **Appears in:** v0.43 Regressions
- **Reported issue:** What happened:
When creating a work order and proceeding to the invoice, if the user changes the invoice date and then attempts to send the invoice via email, the system keeps spinning (loading) and the email is never sent.

Where it happened:
Feature: Invoice screen (within Work Order)

Client: Fast Truck and Trailer, Benton

Reported by: Chris Prosise

Number of users: 21

Why it’s a problem (impact):
Users are unable to send invoices after updating the invoice date, which delays customer communication and impacts billing operations.
- **Steps to reproduce:**
  1. Go to a work order.
  2. Open the Invoice section.
  3. Change the Invoice Date.
  4. Click Email and try sending the invoice.
  5. Observe that the system keeps spinning (loading) and the email is never sent.
- **Expected after fix:** After clicking Email → Send, the invoice email should be sent immediately without any delay or loading issue.
- **Original actual:** The system shows a continuous loading spinner, and the invoice email is not sent.
- **Usable repro:** yes

### SV-4928 — Work Order (Mobile View) – Unable to add new line in phone view
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nebojsa Miskovic  |  **Fix Version:** none
- **Appears in:** v0.43 Regressions
- **Reported issue:** What happened:
In the phone view of ShopView, the customer is unable to add a new line to a work order. The option to “Add New Line” does not appear on the screen. Customers are also unable to see Line, Part, Notes, Stat, Finance on phone view.
Where it happened:
Feature: Work Order (Mobile/Phone View)

Client: RB Truck Centre & Tire Shop

Reported by: Baj Toor

Number of users affected: 2

Why it’s a problem (impact):
Users accessing ShopView from their phones are unable to add new lines to work orders, preventing them from completing essential tasks such as adding parts or services. This impacts workflow efficiency and mobile usability.
- **Steps to reproduce:**
  1. Log in to ShopView using a mobile device.
  2. Open any work order.
  3. Try to add a new line to the work order.
  4. Observe that there is no option to add a new line.
- **Expected after fix:** Users should be able to see and select an “Add New Line” option in the phone view of ShopView, allowing them to add items or parts to the work order.
- **Original actual:** The “Add New Line” option does not appear in the phone view, preventing users from adding new lines to work orders.
- **Usable repro:** yes
- **Notes:** No fixVersion set on ticket.

### SV-4963 — Taxes: Tax that is actively used can be deleted
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Sinisa Nogic  |  **Fix Version:** v0.49
- **Appears in:** v0.43 Regressions
- **Reported issue:** Steps to Reproduce:

1. Log in and navigate to: [{{BASE_URL}}/administration/taxes](https://app.staging.shopview.com/administration/taxes)
2. Create a new tax for testing purposes
3. Assign the previously created tax to some WO.
4. Navigate to  {{BASE_URL}}/administration/taxes using the Admin account
5. Try to delete the used tax (previously created tax and assigned to some WO).

‌
- **Steps to reproduce:**
  1. Log in and navigate to: [{{BASE_URL}}/administration/taxes](https://app.staging.shopview.com/administration/taxes)
  2. Create a new tax for testing purposes
  3. Assign the previously created tax to some WO.
  4. Navigate to  {{BASE_URL}}/administration/taxes using the Admin account
  5. Try to delete the used tax (previously created tax and assigned to some WO).
- **Expected after fix:** s: The Delete Tax icon is not clickable and displays the following error message on hover: _Cannot delete currently used tax._
- **Original actual:** The Delete Tax icon is active, and the tax is deleted successfully. This will cause an inability to open WO info via the Work Orders tab with the following error messages:
- **Usable repro:** yes

### SV-4970 — Core - ShopCoach - Parts are not displaying when added to WO via either Line Builder OR Parts Guide
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Ryan Fyfe  |  **Fix Version:** v0.46
- **Appears in:** v0.43 Regressions
- **Reported issue:** This PR addresses two regressions in ShopCoach workflows by fixing component refresh issues after parts are added (part dialog and line-builder) and improving the tech story editing experience.

The changes enable immediate UI updates after parts/work orders are added through ShopCoach, provide feedback when no parts are found, and streamline the tech story editing flow by allowing inline editing before saving.

Key Changes:

* Added component key-based refresh mechanism to force re-render of work order lines after ShopCoach actions
* Implemented inline editing for tech stories with direct save capability, eliminating the need for a two-step accept-then-save workflow
* Added user feedback ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-5003 — FE Sell Price Not Updating When Average Cost or Category Is Changed on  parts tab
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nikola Milosevic  |  **Fix Version:** v0.54
- **Appears in:** v0.43 Regressions
- **Reported issue:** ### What happened

When adding or editing a part on a work order in the parts tab, the sell price does not recalculate when the  cost is updated or when the category is selected/changed.

‌

#### Where it happened

* Screen: Work Order → Parts tab
* Workflow: Add or edit part on a work order
* Reported by: Cody MacCarthy

‌

### Steps to Reproduce

1. Open a Work Order.
2. Go to the Parts tab.
3. Add a part (or edit an existing part).
4. Ensure a category is selected for that part.
5. Change the cost field.
6. Observe that the sell price does not update.
7. Now change the category to a different one (with different markup).
8. Observe that the sell price still does not recalculate based on ...
- **Steps to reproduce:**
  1. Open a Work Order.
  2. Go to the Parts tab.
  3. Add a part (or edit an existing part).
  4. Ensure a category is selected for that part.
  5. Change the cost field.
  6. Observe that the sell price does not update.
  7. Now change the category to a different one (with different markup).
  8. Observe that the sell price still does not recalculate based on the new category’s markup.
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-5004 — FR:Work Orders – Cannot Change Category for Inventory Part on Parts Tab (Only Works on Main WO Page)
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** parth fadadu  |  **Fix Version:** v0.55
- **Appears in:** v0.43 Regressions
- **Reported issue:** ### What happened:

When editing an inventory part on a work order:

* From the main Work Order page, the user _is able_ to change the category and successfully save it.
* However, when navigating to the Parts tab on the same work order, the system does NOT allow the category to be changed.
* The category field becomes locked or uneditable, preventing updates.

‌

### Where it happened:

* Screen 1: Work Order → Main Page (category CAN be changed)
* Screen 2: Work Order → Parts Tab (category CANNOT be changed)
* Feature: Category editing for Inventory Parts
* Reported by: _Cody MacCarthy_
* Environment: Production

‌

1. Open any Work Order.
2. On the main Work Order page, select an ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-5019 — Work Orders to Invoices – Part Description presentation on line, parts tab and invoice
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Dipesh Changawala  |  **Fix Version:** v0.49
- **Appears in:** v0.43 Regressions
- **Reported issue:** ### What happened:

Issue 1 – Capitalization Not Preserved

On Work Order S-1820, Line 1, the customer entered a part description in full capital letters:
 “HEATED HEADLIGHT”

However, when the work order was converted to an invoice, the description automatically changed to lowercase, displaying as:
 “heated headlight”

The system is not preserving the customer’s original formatting. Uppercase text is being forced into lowercase formatting on the invoice.

This is problematic because customers and service writers often use capitalization intentionally to emphasize or highlight certain items. Losing formatting causes miscommunication and reduces clarity on the final invoice.

### Where it ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** Text formatting should be preserved exactly as entered in the work order. Capitalization should remain unchanged on the final invoice. If the user enters “HEATED HEADLIGHT,” the invoice must also show “HEATED HEADLIGHT.”
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-5021 — Work Orders – Finance Tab Fails to Load
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Jasna Mladenovic  |  **Fix Version:** none
- **Appears in:** v0.43 Regressions
- **Reported issue:** ### What happened:

When opening Work Order S-1032, the customer is able to successfully view Lines, Parts, Notes, Stats

However, as soon as the customer navigates to the Finance tab, the system throws an error and the invoice fails to load.
 The Finance view remains blank or stuck on an error state, preventing the customer from accessing or reviewing any financial information tied to the work order.

### Where it happened:

* Screen: Work Order → Finance Tab
* Work Order: S-1032
* Client: _Tombstone Diesel & Iron_
* Reported by: _Tyler Brooker_
* Number of Users: 1
* Environment: Production

### Why it’s a problem (impact):

* User is unable to review invoice information from the work ...
- **Steps to reproduce:**
  1. Log in as the customer.
  2. Open Work Order S-1032.
  3. View tabs:
  4. Lines → loads normally
  5. Parts → loads normally
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes
- **Notes:** No fixVersion set on ticket.

### SV-5106 — issue 2 CLONE - Work Orders to Invoices – Part Description presentation on line, parts tab and invoice
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Open  |  **Assignee:** Unassigned  |  **Fix Version:** none
- **Appears in:** v0.43 Regressions
- **Reported issue:** ### What happened:

Issue 2 – Description Field Appears Empty When Editing

When the customer attempts to edit the description, the description box shows up as empty, even though the text exists.
This creates confusion and forces the user to retype the description manually because it _looks_ like the field contains no text.

### Where it happened:

* Screen: Work Order → Parts
* Invoice Screen: Generated invoice from WO S-1820
* Client: _SS Repair Ltd_
* Reported by: _Sam Stuart_
* Users: 8
* Work Order: S-1820, Line 1
* Behavior: Uppercase text changed to lowercase during conversion

### Why it’s a problem (impact):

* Customer-requested emphasis or formatting is lost.
* Items that need to ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** Text formatting should be preserved exactly as entered in the work order. Capitalization should remain unchanged on the final invoice. If the user enters “HEATED HEADLIGHT,” the invoice must also show “HEATED HEADLIGHT.”
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No fixVersion set on ticket.; No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

## v0.44 Bug Fixes (6)

### SV-3256 — FE/BE Column sorting not working - Advisor analysis
- **Area:** reports  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nebojsa Miskovic  |  **Fix Version:** v0.44
- **Appears in:** v0.44 Bug Fixes
- **Reported issue:** As a user of the Advisor Analysis report, I want the first four columns (date, invoice number, customer and advisor) to be sortable so that I can organize and analyze the data more efficiently, while the remaining columns should remain static without sorting options.

---

### Requirements

1. Only the first four columns in the Advisor Analysis report must include sorting functionality.
2. Sorting should allow both ascending and descending order.
3. A clear visual indicator (e.g., arrow icon) should show the current sort direction.
4. Columns beyond the first four must not display any sorting option.
5. Sorting should not affect the layout or accessibility of other columns.

---

### ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-4488 — Text Fields – Accented character forces next letter into uppercase
- **Area:** customer portal / customers  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nebojsa Miskovic  |  **Fix Version:** v0.44
- **Appears in:** v0.44 Bug Fixes
- **Reported issue:** Customer Name: GL Mécanique
Number of users: 11

‌

Description
What happened: When a user types an accented character (such as é, à, etc.), the following character automatically becomes uppercase.

Where it happened: Text input field in ShopView (example: customer/Vendor name).

Why it’s a problem (impact): This creates incorrect formatting in customer/shop names, notes, and other text entries. It slows down data entry and produces inaccurate records.
- **Steps to reproduce:**
  1. Go to text field in ShopView (e.g., Customer name field).
  2. Type a word that includes an accented character (for example: “é”).
  3. Continue typing the next character.
  4. Observe that the following character automatically appears in uppercase.
- **Expected after fix:** After typing an accented character, the next letter should remain in lowercase (unless the user chooses to type uppercase). All transformations for text should be removed. Whatever and however user types text (uppercase or lowercase) should remain, app should not transform text
- **Original actual:** After typing an accented character, the next letter is automatically converted to uppercase.
- **Usable repro:** yes

### SV-4674 — Bug: Part Number is Optional Field on Purchase Order
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nebojsa Miskovic  |  **Fix Version:** v0.44
- **Appears in:** v0.44 Bug Fixes
- **Reported issue:** Environment:
Stage and Prod

Issue:
On the PO page, the Part Number field is currently optional, but it is expected to be mandatory. This behavior is still present and may lead to incorrect or incomplete data entry. The field should be updated to reflect the correct validation rules.
- **Steps to reproduce:**
  1. Navigate to PO page
  2. Click on New PO
  3. Populate all fields except Part Number
  4. Click Add
  5. Observe
- **Expected after fix:** Validation for part Number field should trigger Part should not be added to the PO unless all mandatory fields are populated
- **Original actual:** s:
- **Usable repro:** yes

### SV-4697 — Scrolling issue on Customer Payments list causes page to jump back to top
- **Area:** payments / ShopPay  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Aleksa Toljic  |  **Fix Version:** v0.44
- **Appears in:** v0.44 Bug Fixes
- **Reported issue:** When the user attempts to scroll through payments under a customer profile, the list automatically jumps back to the top, preventing navigation to older payment records. The issue persists across browsers and after cache refresh or re-login.

Customer Impact:
The customer The Shop Truck & Trailer (Kirstie Doi) is unable to view older payments for Riverbend Moving and Storage, which is affecting her ability to resolve accounting issues. Any customer with larger lists of payments will be unable to make payments in ShopView and is fully blocked from the functionality.
- **Steps to reproduce:**
  1. Go to Customers > Riverbend Moving and Storage.
  2. Open the Payments tab.
  3. Attempt to scroll down through the list of payments.
  4. Observe that the view automatically jumps back to the top of the list.
- **Expected after fix:** User should be able to scroll smoothly through the entire payment history without the screen jumping back.
- **Original actual:** The screen continuously jumps back to the top of the payment list, making it impossible to reach older payments.
- **Usable repro:** yes

### SV-4716 — Regression - Part Cost Disappears When Picking or Receiving a Part
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nebojsa Miskovic  |  **Fix Version:** v0.44
- **Appears in:** v0.44 Bug Fixes
- **Reported issue:** Customer Name: Goguen Truck & Trailer Repairs
Number of Users: 20
Date Reported: October 22, 2025
Environment: Production

---

Summary:
When picking or receiving a part, the part cost field intermittently disappears, causing the cost value to display as blank in the work order line.

---

Description:
The issue occurs when a user attempts to pick or receive a part. After the part is picked, the cost value vanishes, even though the markup percentage and extended total remain visible.

The attached screenshot shows one of two identical parts, one displaying the cost correctly, while the other shows a blank cost field after being picked.

‌

This issue was reported by Goguen Truck & Trailer ...
- **Steps to reproduce:**
  1. Open any work order.
  2. Add a part from inventory.
  3. Pick or receive the part.
  4. Observe that in some cases, the part cost disappears while other fields remain visible.
- **Expected after fix:** Part cost should remain visible and consistent before and after the part is picked or received.
- **Original actual:** Part cost becomes blank after picking or receiving the part.
- **Usable repro:** yes

### SV-4722 — Bug: First page of downloaded invoice appears blank — invoice content starts from page 2
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Dipesh Changawala  |  **Fix Version:** v0.44
- **Appears in:** v0.44 Bug Fixes
- **Reported issue:** When generating and downloading an invoice that includes a long technician story, the first page of the PDF appears blank, and the actual invoice data begins from the second page.

This occurs consistently when lengthy text (such as detailed technician stories) is included in the invoice body.

### Steps to Reproduce (STRs):

1. Create a Work Order.
2. Add a Line.
3. Copy and paste a long text block (provided below) as the Technician Story for that line.
4. Complete the Work Order.
5. Review and Create Invoice.
6. Download the invoice (PDF).

Tech Story Content: (Same content which the actual client used)


AFTER HOURS CALLOUT
8:00AM SATURDAY AUGUST 30, 2025.

Line Total $100.00

SERVICE ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

## v0.44 Regressions (3)

### SV-5037 — Reports – Advisor Analysis Report Totals Do Not Match Sales Report or Service Advisor Closers
- **Area:** reports  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Stefan Mitrovic  |  **Fix Version:** v0.47.hotfix-2
- **Appears in:** v0.44 Regressions
- **Reported issue:** ### What happened:

Client reports that the Advisor Analysis report is showing incorrect or incomplete data, and totals do not match:

* Sales Report totals
* Service Advisor Closers data
- **Steps to reproduce:**
  1. Go to Reports → Advisor Analysis.
  2. Select This Month as the date range.
  3. Observe totals — system only shows invoices starting Nov 12 onward.
  4. Now open Reports → Sales.
  5. Select the same This Month date range.
  6. Observe Sales Report shows full month results, including Nov 3, 4, etc.
  7. Compare subtotals — Advisor Analysis shows \~$39,531.33, while Sales shows $124,736.36.
  8. Test with different filters ("Today", "Yesterday", “This Month”).
  9. Observe inconsistent or missing data in Advisor Analysis.
  10. Optional: Compare closers/advisors assigned to invoices vs what Advisor Analysis shows.
- **Expected after fix:** subtotals for advisors
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-5047 — Bug: Core part price should not appear as $0 under the header "Rate".
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Ready to Fix  |  **Assignee:** Unassigned  |  **Fix Version:** none
- **Appears in:** v0.44 Regressions
- **Reported issue:** Environment: Staging/Production
- **Steps to reproduce:**
  1. Request-order-receive a special order part on a line (Set the core price as $10)
  2. Do not press OK/Not OK
  3. Observe The Core price appears as $0 under the header “Rate”(which is absolutely wrong)
- **Expected after fix:** The Core price under the header “RATE” should show the full core price if the OK/Not OK status is unconfirmed.
- **Original actual:** (not stated)
- **Usable repro:** yes
- **Notes:** No fixVersion set on ticket.

### SV-5052 — Work Orders – Discrepancy Between Received Parts and Work Order Display (Only One Part Appears Even Though Two Were Received)
- **Area:** purchase orders / vendor  |  **Type:** Bug  |  **Status:** OBSOLETE  |  **Assignee:** Unassigned  |  **Fix Version:** none
- **Appears in:** v0.44 Regressions
- **Reported issue:** ### What happened:

On Work Order S-32, the customer received two DEF Fluid parts and added the vendor invoice number.
 Initially, the work order displayed:

* 2 parts received
* 1 part waiting to be received
* The system shows 2 received part on the work order
* BUT the Vendor Invoices screen correctly shows both parts received
* Searching the vendor transaction history also shows one received entries

However, the work order itself only displays one of the received parts, and the second received part is missing completely.

### Where it happened:

* Screen 1: Work Order → S-32 → Parts
* Screen 2: Parts → Vendor Invoice Receiving
* Screen 3: Parts → Vendor Invoices list
* Client: _Maktech ...
- **Steps to reproduce:**
  1. Open Work Order S-32.
  2. Receive two DEF Fluid parts from vendor O’Reilly Auto Parts.
  3. Add vendor invoice number (e.g., 0333-355680).
  4. Work order shows:
  5. 2 received
  6. 1 awaiting
  7. The work order:
  8. Only 2 received line remains.
  9. Open Vendor Invoices → Invoice 0333-355680 / 0333-355682:
  10. Shows both items received.
  11. Search parts under vendor transactions:
  12. Shows one receipt entries.
  13. Work order still displays only one part.
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes
- **Notes:** Ticket status is OBSOLETE - confirm still in scope before testing.; No fixVersion set on ticket.

## v0.48 Bug Fixes (1)

### SV-4600 — Apply vendor credit, leave remaining balance if larger than bill
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** parth fadadu  |  **Fix Version:** v0.48
- **Appears in:** v0.48 Bug Fixes
- **Reported issue:** Environment: Staging and Production

Issue Description:
When applying a vendor credit during payment, if the credit amount is greater than the bill amount, the system incorrectly marks the entire credit as spent. It does not leave the remaining balance to be claimed on another payment.

Example:

* Vendor payment amount: $125
* Credit amount: $200
- **Steps to reproduce:**
  1. Navigate to the Vendor Unpaid Invoices tab.
  2. Select one payment and one credit where the credit amount is greater than the payment amount.
  3. Click on New Payment.
  4. Create the new payment.
  5. Observe that the entire credit amount is consumed, and the remaining balance available to be claimed at a later time.
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

## v0.48 Regressions (12)

### SV-5105 — Mobile Bug: Work Orders List Not Loading on Mobile – “Failed To Load More Work Orders”
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Stefan Mitrovic  |  **Fix Version:** v0.48.hotfix-1
- **Appears in:** v0.48 Regressions
- **Reported issue:** Environment: Mobile device (browser), SV Production/Staging

Issue: Work Orders fail to load on mobile. Immediately upon opening the Work Orders page, the app throws the error “Failed To load More Work Orders.”

### Steps to Reproduce (STRs):

1. Log in to your ShopView account on a mobile device.
2. From the main menu, tap Work Orders.
3. Observe the loading behavior.

### Observed Behavior:

* As soon as Work Orders is selected, the screen displays an error:
  “Failed To load More Work Orders.”
* No Work Orders load.

### Expected Behavior:

* The Work Orders list should load normally on mobile devices without errors.
* No “Failed To load More Work Orders” error should appear unless ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-5115 — Mobile View - Techs cannot clock into work orders
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Stefan Mitrovic  |  **Fix Version:** v0.48.hotfix-2
- **Appears in:** v0.48 Regressions
- **Reported issue:** Multiple users reporting that techs cannot clock into work orders on the mobile version of the app, the start button is missing.

‌

Also receiving complaints about:

* Unable to sort the main WO list page (by number, status or customer
* error message when loading the work orders page

‌

‌

—
created by Cody McCarthy (cody@shopview.com) in Intercom
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-5122 — Mobile View – Part Pick Option and Part Number Display Not Available on Work Order Lines
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Stefan Mitrovic  |  **Fix Version:** v0.48.hotfix-3
- **Appears in:** v0.48 Regressions
- **Reported issue:** ### What happened

On the mobile version of the application, users are unable to:

1. Pick a part from the work order line
2. See the part number displayed for parts on that line

The part pick button is  missing on the mobile view for the users, and part numbers do not appear where they should.
 This prevents users from adding or modifying parts while using the mobile interface.

### Where it happened

* Platform: Mobile version (browser/mobile view)
* Feature: Work Orders → Lines → Parts section
* Client: West Side Lube & Truck Repair Ltd
* Reported by: Nicole Smith
* Users: 9

### Why it’s a problem

* User cannot pick parts
* Part numbers are invisible, making it impossible to identify ...
- **Steps to reproduce:**
  1. Open the mobile version of the application (responsive/mobile view).
  2. Navigate to any test Work Order.
  3. Open a line on the work order.
  4. Go to the Request Parts from the inventory.
  5. Observe that:
  6. No option appears to Pick the part on the line
  7. Part numbers do not display
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-5123 — Mobile View – Invoice Layout Under Finance Tab Not Displaying Correctly
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Open  |  **Assignee:** Unassigned  |  **Fix Version:** none
- **Appears in:** v0.48 Regressions
- **Reported issue:** ### What happened

When viewing an invoice under the Finance tab in the mobile version, the invoice layout does not render properly.
 Elements appear misaligned, clipped, or out of order, making the invoice difficult or impossible to read on mobile.

This issue affects the mobile viewing experience for customers and technicians who rely on mobile devices to review invoice details.

### Where it happened

* Platform: Mobile view / responsive layout
* Feature: Work Order → Finance tab → Invoice preview
* Reported by: Tyler Brooker

### How to Check:

1. Open the application on a mobile device or switch browser to mobile responsive mode.
2. Navigate to any test Work Order.
3. Go to the Finance ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No fixVersion set on ticket.; No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-5125 — Mobile View: Core OK / Not OK Buttons Not Visible for Technicians
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Stefan Mitrovic  |  **Fix Version:** v0.48.hotfix-3
- **Appears in:** v0.48 Regressions
- **Reported issue:** In the mobile viewport, technicians are unable to mark a picked core part as OK or Not OK because the corresponding UI buttons do not appear.
This functionality works in desktop view but is missing entirely from the mobile layout.

This blocks technicians from completing required core return workflows on mobile.

# Steps to Reproduce (STRs):

1. Log in on a mobile browser using a Technician account.
2. Open any Work Order.
3. Request a part with a core.
4. Pick the part.
5. Observe the UI options for the picked part.

# Actual Result:

* The OK / Not OK buttons do not appear in mobile view.

# Expected Result:

* The mobile UI should display the OK and Not OK options the same way as ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-5128 — Mobile View: Part Number is not appearing in the Work Order instead it shows Part Description.
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** OBSOLETE  |  **Assignee:** Stefan Mitrovic  |  **Fix Version:** none
- **Appears in:** v0.48 Regressions
- **Reported issue:** Issue: Part Number is not appearing in the Work Order instead it shows Part Description.

Desktop view:

Mobile View:
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** The Part number and Description should appear for main part. For the Core part it is already showing the part number.
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** Ticket status is OBSOLETE - confirm still in scope before testing.; No fixVersion set on ticket.; No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-5132 — Work Orders – Technicians Cannot Add Parts; “Save & Close” Does Nothing
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Stefan Mitrovic  |  **Fix Version:** v0.48.hotfix-4
- **Appears in:** v0.48 Regressions
- **Reported issue:** # This is an Account Specific issue.

* Feature: Work Orders → Parts → Add Part
* Affected Users: Technician role only
* Client: Gearhead Mechanical Ltd
* Reported by: Chris Soetaert
* Users: 5

###
What happened

Technicians are unable to add a part to a work order.
 When they open the Add Part window and click Save & Close, the modal does nothing — it does not close, and the part is not added to the work order.

This issue occurs only for technician users.
 Other roles are able to add and save parts normally.

‌

### Why it’s a problem

* Technicians cannot add required parts to work orders
* Causes workflow interruption in the shop
* Advisors must manually intervene to add parts
* ...
- **Steps to reproduce:**
  1. Unable to reproduce locally.
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-5187 — BUG – Mobile Sessions Logging Users Out Automatically
- **Area:** mobile  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Milomir Kotlajic  |  **Fix Version:** v0.51, v0.52
- **Appears in:** v0.48 Regressions
- **Reported issue:** ## Account-Specific Issue

Reported by: Cody
 Customer: Haggai Truck Center
 Number of Users: 6
 MRR: $506
 Date Requested: 12/11/25

### Description of the Issue

Users on mobile devices are being logged out automatically after roughly one hour of inactivity. This appears to be happening consistently across the customer’s entire team.

The reporter is unable to reproduce the issue on his own device, suggesting the problem may be isolated to specific accounts, devices, or session-handling conditions on mobile.

This behavior causes interruptions in workflow and forces users to repeatedly log back into the system.

### Impact

* Frequent, unexpected session logouts
* Disrupted workflow for ...
- **Steps to reproduce:**
  1. Unable to reproduce locally.
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-5269 — BE - Incorrect Payment Amount Displayed When Invoice Is Paid Using Credit Balance
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Dusan Bulovan  |  **Fix Version:** none
- **Appears in:** v0.48 Regressions
- **Reported issue:** Reported by @Jasna Mladenovic

* Module: Customers → Payments / Unpaid Invoices
* Payment Type: Credit Balance

Issue Description

When an invoice is paid using a customer’s existing credit balance, the Payment entry incorrectly shows the remaining credit amount instead of the invoice amount that was actually paid.

In the attached example, an invoice of $10.00 USD was paid using a credit balance of $14.18 USD. However, the system records the payment as $4.18, which is the _remaining credit_, not the _payment applied to the invoice_.

‌
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** The Payment row should show $10.00 (the invoice amount paid) The remaining credit ($4.18) should:
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No fixVersion set on ticket.; No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-5277 — New Contact Modal Does not appear after Creating Customer
- **Area:** customer portal / customers  |  **Type:** Bug  |  **Status:** Open  |  **Assignee:** Unassigned  |  **Fix Version:** none
- **Appears in:** v0.48 Regressions
- **Reported issue:** Environment

* Environment: Staging
* Module: Customers
* Reproducibility: Consistent on Staging
* Production: Not reproducible

Issue Description

After creating a new customer on Staging, the system does not open the new contact modal. (Sometimes the modal appears briefly and then closes automatically)
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No fixVersion set on ticket.; No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-5296 — BUG-Work order fails to open and shows error message - Workorder Invalidated
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Dusan Bulovan  |  **Fix Version:** none
- **Appears in:** v0.48 Regressions
- **Reported issue:** ## Account-Specific Issue

Reported by: Ashley Cochrum
Customer: Gene's Wrecker, Tire & Truck Repair LLC
Users: 9
Work Order: S-30660
URL:[ https://app.shopview.com/workorders](https://app.shopview.com/workorders)

### What happened

When attempting to open Work Order S-30660, the system fails to load the work order and instead displays an error message.

The user is unable to access the work order at all.

Error message shown:

_Ooooops! An error occurred_
_For more information, please contact support. Include your request ID:_
\[a8b14923-e0ad-4dbf-a3f4-7c6e25348944\]

## Steps to Reproduce

Unable to reproduce on test account.

## Steps to Observe in Client’s Account

1. Log in to the ...
- **Steps to reproduce:**
  1. Unable to reproduce on test account.
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes
- **Notes:** No fixVersion set on ticket.

### SV-5321 — FE BUG Finance tab does not auto-refresh after updating shop supplies and tax settings
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nebojsa Miskovic  |  **Fix Version:** v0.52
- **Appears in:** v0.48 Regressions
- **Reported issue:** ## Reported by

* Reported by: Tyler Brooker

‌

---

### What happened

When shop supplies and tax settings are updated from the Financial Info tab while a user is already viewing the Finance tab on a work order, the Finance tab does not automatically refresh to reflect the new values.

The updated shop supplies and tax amounts only appear after the user manually refreshes the page or navigates away and comes back.

‌

---

## Steps to Reproduce

1. Open any test Work Order.
2. Navigate to the Finance tab.
3. Open the Financial Info tab or section.
4. Update shop supplies and/or tax settings.
5. Save the changes.
6. See on the Finance tab without refreshing the page.
7. Observe that the ...
- **Steps to reproduce:**
  1. Open any test Work Order.
  2. Navigate to the Finance tab.
  3. Open the Financial Info tab or section.
  4. Update shop supplies and/or tax settings.
  5. Save the changes.
  6. See on the Finance tab without refreshing the page.
  7. Observe that the values have not updated.
  8. Refresh the page and observe that the updated values now appear.
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

## v0.54 Bug Fixes (24)

### SV-3274 — FE Edit What Are You Doing
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nebojsa Miskovic  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** When adding a new line you are only able to edit What Are You Doing, by moving your cursor if you haven’t clicked out of it. If you click out you have to delete the whole thing and type it out again.
- **Steps to reproduce:**
  1. Add new line → type something in what are you doing → don’t click out and you can edit
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-4465 — BE Labor amount missing thousands separator in totals section
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Milomir Kotlajic  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** Reported by: Grand Truck Trailer
Date Reported: Sept 16, 2025

Description:
In the invoice totals block, the Labor amount is rendered without a thousands separator when the value is four digits or more. Example shows $1280.00 instead of $1,280.00. Screenshot attached.
- **Steps to reproduce:**
  1. Open a work order with Labor total over 999
  2. View or generate the invoice totals section or PDF.
  3. Observe the Labor line item formatting.
- **Expected after fix:** Labor total should display as $1,280.00 using standard US number formatting. The same formatting rule should apply consistently to Parts, Shop supplies, Subtotal, Tax, and Total.
- **Original actual:** Labor total displays as $1280.00 with no thousands separator.
- **Usable repro:** yes

### SV-4526 — Invoice – Printed invoice not reflecting all applied payments
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Milomir Kotlajic  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** Description

* What happened: An invoice with multiple payments applied shows the correct balance in the Unpaid Invoices list, but the finance and printed invoice PDF still reflect an incorrect balance.
* Where it happened:

    * Customer: Gene’s Wrecker Tire Truck Repair LLC
    * Invoice: Work Order: S-30199
    * Screen: Unpaid Invoices vs Printed Invoice PDF

* Why it’s a problem: Customers receive invoices with an incorrect balance, which creates confusion and potential accounting errors.

### Description:

When ShopView is open in multiple tabs and payments are made/deleted simultaneously, the system does not correctly sync state across tabs. This leads to a discrepancy between the ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** The printed invoice should reflect the correct balance after all applied payments, matching the balance shown in the Unpaid Invoices tab.
- **Original actual:** The printed invoice shows an outdated/incorrect balance that does not include all applied payments, while the Unpaid Invoices tab shows the correct reduced balance.
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-4776 — FE Bug: Part Sales -> Parts -> Margin column after it is edited it shows wrong sell price.
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nikola Milosevic  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** STRs:

* Navigate to Parts → Part Sales
* Complete the process of requesting a Special Order part (As shown in the screen recording)
* Change the value of the Margin
* Observe the wrong sell price being automatically calculated.
- **Steps to reproduce:**
  1. Navigate to Parts → Part Sales
  2. Complete the process of requesting a Special Order part (As shown in the screen recording)
  3. Change the value of the Margin
  4. Observe the wrong sell price being automatically calculated.
- **Expected after fix:** s:
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-4777 — Work Orders – Status filter resets after switching tabs
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nebojsa Miskovic  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** What happened:
When a user filters the Work Orders page by “Status” (e.g., selects “Estimates”), it correctly shows the filtered results. However, if the user switches to another tab (such as “Work Order” or any other tab) and then returns to the Work Orders page, the filter resets to default, and the user must reapply the filter.

Where it happened:
Screen: Work Orders page

Feature: "By Status" filter

Affects: All users

Why it’s a problem:
This causes inconvenience for users who frequently switch between tabs while reviewing work orders, as they have to reapply the filter each time, reducing efficiency and user experience.
- **Steps to reproduce:**
  1. Go to Work Orders page.
  2. Click on the Status filter dropdown.
  3. Select one or more options (e.g., Estimates).
  4. Navigate to another tab (e.g., Work Order).
  5. Return to the Work Orders page.
  6. Observe that the filter resets to default.
- **Expected after fix:** The selected Status filters should remain applied even after navigating away from the page and returning.
- **Original actual:** The Status filter resets to default when switching tabs, requiring the user to reselect the filters.
- **Usable repro:** yes

### SV-4829 — Purchase Order Details: Add Core to the Part
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** parth fadadu  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** Environment:
Stage & Prod

‌

Issue:
Editing Purchase Order by adding a Inventory Part without core than editing that same part by assigning core to it will result in incorrect Core Description.

Issue can be also reproduced by adding the Inventory Part with Core (but removing core before saving changes) an then editing part by assigning core to it.
- **Steps to reproduce:**
  1. Open any no-received Purchase Order (PO)
  2. Add Inventory part to the order without a core
  3. Edit that same part and assign core to it
  4. Observe
- **Expected after fix:** Core Description is displayed as Core for $PartDescription
- **Original actual:** Core Description is displayed as $PartNumber
- **Usable repro:** yes

### SV-5000 — BE Work Orders – Sorting Not Working for Total Price, and Lines Columns Across Multiple Pages
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Vladimir Radojcic  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** ### What happened:

The sorting functionality is not working for key columns on multiple work order–related pages.
 Specifically, the Total Price, and Lines columns do not sort correctly when clicked.

This issue occurs across all major areas where work orders are listed:

1. Main Work Orders page
2. Customer profile → Work Orders tab
3. Asset profile → Work Orders tab

When users attempt to sort by these columns, nothing happens or the sort does not behave as expected. The table remains unchanged, making it impossible to organize or prioritize work orders based on these fields.

### Where it happened:

* Feature: Work Orders → Various list views
* Pages Affected:

    * Main Work Orders ...
- **Steps to reproduce:**
  1. #### Main Work Orders Page
  2. Navigate to Work Orders (main list).
  3. Attempt to sort by  Total Price, or Lines.
  4. Observe that the sorting does not work or the list does not update.
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-5168 — BE BUG – “N/A” Displays Before Asset Name When Asset Year Is Left Blank
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Vladimir Radojcic  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** ### Customer Details

* Customer Name: Straley Ag Repair LLC
* Reported by: James Straley
* Users: 1

### What happened:

When creating an asset and leaving the Year field blank (because the shop does not use year/model tracking), the system displays “N/A” on the invoice before the asset name.

However, if the user edits the asset, enters a year, saves it, and then edits it again and removes the year, the invoice no longer shows “N/A”.

This indicates the system treats an initially blank year differently from a cleared year, creating inconsistent output.

### Where it happened:

* Work Orders → Finance → Invoice Preview
* Asset block (Year + Asset Name display)

### Why it’s a problem:

* ...
- **Steps to reproduce:**
  1. Create a new asset and leave the Year field blank.
  2. Attach the asset to a test work order.
  3. Go to the Finance tab and open the invoice preview.
  4. See that the Asset section displays:
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-5194 — BUG: Paid work order shows “Invoiced” status with incomplete line and no reverse option
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Milomir Kotlajic  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** ### ACCOUNT-SPECIFIC ISSUE

Customer: SRP Automotive & Truck Repair
Reported by: SRP Service Dept
Users: 4
Work Order: S-132
Invoice: INV-S-132
URL:[ https://app.shopview.com/workorders/eb5b2925-90ec-40a5-8ea1-8b25e6836f2e/finance](https://app.shopview.com/workorders/eb5b2925-90ec-40a5-8ea1-8b25e6836f2e/finance)

### What happened

The customer has an old work order that was already paid in full. However:

* The work order status still shows Invoiced instead of Paid.
* One line on the work order appears as incomplete, even though the invoice exists and payment was made.
* On the Finance tab / invoice view, the Reverse option is not available.
* Because the reverse option is missing, the ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-5750 — BE BUG: Invoice marked as paid but payment not visible under customer
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Milomir Kotlajic  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** ## Account-Specific Issue

Company: Caledonia Truck & Trailer Repair Inc.
Contact: Samantha Nealon
Number of Users: 13
—--------------------------------------------------------------------------------------------------------------------------

Customer: Paul Kolobutin
Work Order: S-1028

‌

---

### What happened

Invoice S-1028 shows as Paid when viewed from the Work Order screen.

However:

* Under Customers → Paul Kolobutin, there are:

    * No unpaid invoices
    * No payments listed

* The invoice appears as paid but the associated payment does not display under the customer record.
* The invoice is still appearing in the A/R Aging Summary Report as outstanding/unpaid.
* Attempting to ...
- **Steps to reproduce:**
  1. Unable to reproduce
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-5868 — BUG: Part category not available for assignment to a different matrix
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nebojsa Miskovic  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** Reported by: Beutler Diesel Repair
Contact: Cody Beutler
Users: 1

---

### What happened

The client has assigned the “Filters” category to the "74% Markup" matrix and now wishes to assign it to the "Loyal Customer" matrix.

The client has deselected the category from the first matrix.

When attempting to assign “Filters” to the new matrix, it is not available for selection.

---

### Why it’s a problem

* Customer cannot price his filters correctly
* Prevents creating estimates and invoices without manually adjusting every item in the filters category
* Impacts workflow
* Causes frustration with our platform
* Further instances of this bug may impact other categories and other ...
- **Steps to reproduce:**
  1. Impersonate Cody Beutler
  2. Navigate to the Admin panel → Pricing
  3. Open the 75% Matrix and confirm filters have been de-selected
  4. Navigate to the Loyal Customer matrix, attempt to select the filters category
  5. Observe the Filters category is not available for selection
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-5869 — Bug: Changing the Estimated Time for a fixed Line total changes the values for Labor Portion/Parts Portion
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Vladimir Radojcic  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** Environment:
Prod/Staging

Issue:
Changing the Estimated Time for a fixed Line total changes the values for Labor Portion/Parts Portion
- **Steps to reproduce:**
  1. Create a WO → Create Line → Set the line to be the Fixed Line total
- **Expected after fix:** value for part and labor portion should stay the same if fixed line total is selected
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-5992 — FE BUG: Unpaid Invoices PDF Export Rendering Incorrect Page Break and Totals Layout
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nebojsa Miskovic  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** Customer: Bernadette Whalen
Company: Caietti's Truck Repair
Number of Users: 8

---

### What happened:

When downloading the Unpaid Invoices report for a customer, the rendered PDF layout appears broken.

---

### Why it’s a problem (impact):

* Report formatting looks unprofessional when shared with customers.
* Totals appear disconnected from their headers.
* Can cause confusion when reviewing aging balances.
* Impacts client-facing documentation and accounting reporting.

---

## Steps to Reproduce

1. Go to Reports.
2. Open Unpaid Invoices for a customer.
3. Download or export the report as PDF.
4. Review page layout.
5. Observe that totals are pushed onto a separate page from the ...
- **Steps to reproduce:**
  1. Go to Reports.
  2. Open Unpaid Invoices for a customer.
  3. Download or export the report as PDF.
  4. Review page layout.
  5. Observe that totals are pushed onto a separate page from the aging header.
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-6086 — Invoiced hours link takes you to blank page
- **Area:** invoicing / accounting  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Sava Vukosavljev  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** Clicking Invoiced Hours link takes user to blank page.
- **Steps to reproduce:**
  1. Open Tech Eff. report
  2. Expand a staff member with data
  3. Click on Invoiced Tech Hours
- **Expected after fix:** The work order opens The user work order line edit modal opens If the user does not have appropriate permissions, they will see an error (open question, do we have an existing error for this scenario?)
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-6178 — ShopPay - Update Payment Capture to record actual Stripe fees after payment completion
- **Area:** payments / ShopPay  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nemanja Djuric  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** # 1. Store Actual Fees After Payment Completes

Update the payment flow to capture and store the actual Stripe fees after payment completion:

* On payment success (via webhook), retrieve:

    * balance_transaction.fee
    * balance_transaction.fee_details

* Persist the actual Stripe processing fee in our database

This will ensure accurate fee reporting and eliminate discrepancies caused by international card surcharges.

---

## 2. Provide a clear notice for international Cards Disclaimer

* On the Account Setup Page where we display fees and ‘accept credit cards’, we should make it very clear inline that international cards have this surcharge:

* On the actual payment modal, let’s add ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-6241 — BE Part Sale Appears as Work Order Option When Creating Timesheet from Timesheet Activities Report
- **Area:** reports  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Vladimir Radojcic  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** While creating a new Timesheet entry from the Timesheet Activities Report, the Work Order selection dropdown incorrectly includes Part Sale records.

Part Sales should not be selectable as Work Orders when logging time, as they are not valid entities for timesheet tracking.

---

### Steps to Reproduce (STRs):

1. Navigate to Reports → Timesheet Activities.
2. Click on Create New Timesheet.
3. Open the Work Order selection dropdown.
4. Observe the list of available options.

---

### Actual Result:

* Part Sale IDs (Part Sale #) appear in the Work Order dropdown.
* Users can potentially select them while creating a timesheet.

---

### Expected Result:

* Only valid Work Orders should ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-6446 — Payments - Error with reader. Sending payments blocked.
- **Area:** payments / ShopPay  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nemanja Djuric  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** Getting error with my reader when I try to send payment to it.

I had multiple readers connected before to Foothills, and it was actually showing the same reader connected twice now, after the most recent fixes that you did.

I disconnected all readers, and reconnected the one that I have.

‌

Test connection, connection works. Reader prompts ‘connection successful’ on first connection.

Sent a payment to terminal, and get error. Click try again, and error changes to this one below.

Restarted reader, performed connection sequence and tried again. Same issue.

When I test reader connection, it appears connected
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-6628 — Staff Filter is not showing all Staf members in the list to select one from.
- **Area:** roles / permissions  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** parth fadadu  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** STRs:

(Intermittent issue)

* Randomly add clock-in and clock out time for a few staff member for the current day.
* For remaining 4 staff members only add the clock-in time
* Refresh
* Click the Staff filter
* Observe: A few staff members are missing from the list.

‌
- **Steps to reproduce:**
  1. (Intermittent issue)
  2. Randomly add clock-in and clock out time for a few staff member for the current day.
  3. For remaining 4 staff members only add the clock-in time
  4. Refresh
  5. Click the Staff filter
  6. Observe: A few staff members are missing from the list.
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-6669 — Payments - Reciept not displaying when you click print invoice and receipt.
- **Area:** payments / ShopPay  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nemanja Djuric  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** Receipt does not show up when you click Print invoice and Receipt immediately after payment processes.
I did not check the print receipt button, but that should also be looked at.

‌

https://www.loom.com/share/71d8127051d24838bb0928fd7ceb0e57
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-6671 — Poartal - Cannot de-select the customer after customer is selected with filter on the invoices page
- **Area:** customer portal / customers  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nemanja Djuric  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** On the invoices page in the portal, once you filter for a customer, you cannot unselect that customer filter without researching that customer name.

See video

https://www.loom.com/share/7047181aed84414f891c16861f09210c

‌

We need the ability to remove the customer from the filtered results, to re-display unfiltered invoice results easily, without needing to scroll down or research the customer in the drop down.

‌
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-6681 — Payments - Reader connection not working, after disconnect from one location and reconnect to another location
- **Area:** payments / ShopPay  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nemanja Djuric  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** Reader connection no longer working after disconnecting it from one location and then reconnecting it to a different location.

Video of issue: https://www.loom.com/share/631795649f7d465bb5c602c13382b632

When setting up the new connection, it appears successful.

On settings screen, reader appears connected.

Try to send a payment to the terminal, Payment fails.

Test reader on the settings page, and it says the connection failed, even though it says the connection was successful when setting it up.

‌
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-6682 — Mobile: Work Order Text Not Visible in Dark Mode on Mobile (Staging)
- **Area:** mobile  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nikola Milosevic  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** In Dark Mode on mobile devices, the Work Order text is not properly visible as it appears to be overridden by a white color, causing readability issues.

This results in poor contrast and makes the text difficult or impossible to read.

---

### Environment:

* Staging
* Mobile Device
* Dark Mode Enabled

---

### Steps to Reproduce (STRs):

1. Log in to your staging account using a mobile device.
2. Ensure Dark Mode is enabled.
3. Navigate to the Work Order section.

---

### Actual Result:

* The Work Order text appears white/blended, making it hard to read against the background.

---

### Expected Result:

* Text should have proper contrast in Dark Mode.
* All text should remain clearly ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-6801 — BUG: Missing Payment in “View Payments” (Payout Mismatch UI)
- **Area:** payments / ShopPay  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nemanja Djuric  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** Account: KC Wholesale

Summary:

Payout total is correct, but “View Payments” is not displaying all underlying payments.

‌

Details:

‌

* Payout Date: 4/14/2026
* Payout Amount: $8,303.78
* Under “View Payments”, only 2 payments are दिखाई दे रहे हैं:

    1. $5,548.95 (Cassens Transport Co – S-129590)
    2. $163.09 (ICON GRADING – P-129606)

* Total of visible payments: $5,712.04
* Missing Amount: $8,303.78 - $5,712.04 = $2,591.74

‌

‌

Issue Behavior:

‌

* UI only shows 2 payments instead of all contributing transactions
* Total payout amount is correct → backend aggregation seems accurate
* However, payment breakdown is incomplete
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-6851 — Bug: Transaction Fee Deducted on Failed Payment Attempt Affecting Payout Amount
- **Area:** payments / ShopPay  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nemanja Djuric  |  **Fix Version:** v0.54
- **Appears in:** v0.54 Bug Fixes
- **Reported issue:** Description:
A discrepancy has been identified where a transaction fee is being deducted despite a failed payment attempt, resulting in a mismatch between the invoice total and the payout amount.

Customer: Daufeldt Transport Inc:

* Invoice Total: $1,599.26
* Payout Received: $1,595.80
* Difference: $3.39
* This difference matches the transaction fee from a failed payment attempt

‌

Observed Behavior:

* A failed payment attempt still records a transaction fee
* That fee appears to be deducted from the final payout
* Resulting in underpayment relative to invoice total
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

## v0.54 Regressions (19)

### SV-6725 — Customer -> Notes Attachment Thumbnails Truncated for  the receiver (Technicians)
- **Area:** customer portal / customers  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Dusan Vejin  |  **Fix Version:** none
- **Appears in:** v0.54 Regressions
- **Reported issue:** Environment: Staging

Attachment thumbnails in Customer → Notes are displayed correctly for Administrators, but appear truncated for Technicians when accessed via notifications.
- **Steps to reproduce:**
  1. Log in as and administrator
  2. Navigate to Customers → Notes
  3. Create a new note and attach the picture and files and tag the technician in that note.
  4. Now create the 2nd Note with attachement and tag the same Technician
  5. Observe:
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes
- **Notes:** No fixVersion set on ticket.

### SV-6784 — BUG: Work Order Status Color Not Differentiating (Approved vs In Progress)
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Ryan Fyfe  |  **Fix Version:** none
- **Appears in:** v0.54 Regressions
- **Reported issue:** Description:

There appears to be a UI issue where “Approved” and “In Progress” work order statuses are both displaying in the same green color, making it difficult to distinguish between the two states at a glance.

‌

Each work order status (e.g., Approved, In Progress, Review) should have a clearly distinct color for quick visual identification.
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No fixVersion set on ticket.; No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-6785 — BUG: No Clear Visual Differentiation Between “Approved” and “In Progress” Work Order Statuses
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Jasna Mladenovic  |  **Fix Version:** none
- **Appears in:** v0.54 Regressions
- **Reported issue:** Company: Goguen Truck and Trailer Repairs
Reported By: Cody McCarthy (via internal mention)

---

### Summary

Client reports there is no clear visual differentiation between “Approved” and “In Progress” statuses on the Work Orders list view.

From the screenshot provided, both statuses appear visually similar (green indicators and similar badge styling), making it difficult to quickly distinguish between the two states.

---

### Expected Result

* “Approved” and “In Progress” should have distinct visual styling (color, badge, or icon).
* Users should be able to quickly identify the operational stage at a glance.

### Actual Result

* Both statuses appear visually similar.
* No strong ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No fixVersion set on ticket.; No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-6786 — Sentry issue DivisionByZeroError - SHOPVIEW-API-29J
- **Area:** general / UI  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** parth fadadu  |  **Fix Version:** none
- **Appears in:** v0.54 Regressions
- **Reported issue:** Environment - Production, Staging
https://shopview.sentry.io/issues/7384617443/?alert_rule_id=14951188&alert_type=issue&environment=production&notification_uuid=fab03ae5-934c-459d-a224-2e8ad7454f44&project=4505600213778432&referrer=slack
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No fixVersion set on ticket.; No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-6787 — BUG: Error When Attempting to Review & Invoice Work Order S-1101
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Jasna Mladenovic  |  **Fix Version:** v0.54.hotfix-1
- **Appears in:** v0.54 Regressions
- **Reported issue:** ### Account-Specific Issue

Customer: Amber Turpin
Company: Ed Rose Trucking Ltd
Users: 6

---

### Summary

User is receiving an error when attempting to Review and Invoice Work Order S-1101.

The system is preventing the work order from moving forward in the invoicing process.

NOTE: THE PART PRICE IS $0

---

### Steps to Observe

1. Open Work Order S-1101.
2. Click Review.
3. Attempt to proceed with Invoicing.
4. System displays an error and blocks the action.

---

### Expected Result

Work Order should successfully move to Review and allow invoicing without errors.

### Actual Result

System throws an error and prevents the work order from being invoiced.

---

### Impact

* Work ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-6788 — Shopcoach intermittently not working
- **Area:** work orders  |  **Type:** Bug  |  **Status:** In Progress  |  **Assignee:** Dusan Vejin  |  **Fix Version:** none
- **Appears in:** v0.54 Regressions
- **Reported issue:** Sometimes need to run shopcoach line builder multiple times in order for it to work.

It will stop loading, and give no results. Then click build lines again and it restarts, and loads the second time.

Issue is intermittent and not duplicated every time.
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No fixVersion set on ticket.; No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-6789 — Regression: Remove loading text
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Ryan Fyfe  |  **Fix Version:** none
- **Appears in:** v0.54 Regressions
- **Reported issue:** Previously we removed the loading text from ShopCoach line builder but now it is back.

Remove loading text descriptions from ShopCoach line builder.
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No fixVersion set on ticket.; No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-6790 — BUG: Mobile – Asset Expand Icon Misaligned, Making Mileage Field Difficult to Access
- **Area:** mobile  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Ryan Fyfe  |  **Fix Version:** none
- **Appears in:** v0.54 Regressions
- **Reported issue:** ### Summary

On the mobile app Work Order view, the asset section expand/collapse icon is misaligned and positioned too close to the asset switch icon, creating a touch-target conflict.

This layout issue makes it difficult for technicians to expand the asset section and access the Mileage field.

---

### Steps to Reproduce

1. Open any Work Order in the Mobile.
2. Locate the Asset card (example shown: “1/off Kustoms, LLC”).
3. Attempt to tap the expand arrow icon in the top-right corner of the asset card.

---

### Expected Result

* MILEAGE SHOULD BE EASILY ACCESSIBLE FOR THE TECHNICIANS ( Kindly if possible change the positioning and make it appear somewhere at the front)
* Expand arrow ...
- **Steps to reproduce:**
  1. Open any Work Order in the Mobile.
  2. Locate the Asset card (example shown: “1/off Kustoms, LLC”).
  3. Attempt to tap the expand arrow icon in the top-right corner of the asset card.
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes
- **Notes:** No fixVersion set on ticket.

### SV-6791 — Customers > Work Orders tab: WO number duplicates the shop ID in the workplace prefix
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nebojsa Miskovic  |  **Fix Version:** v0.56
- **Appears in:** v0.54 Regressions
- **Reported issue:** https://shopview.slack.com/archives/C0ASNLT3BT5/p1776263760986829
Issue Details:

The Work Order number incorrectly duplicates the shop ID when displayed in the Customers > Work Orders tab. The WO number displays correctly in the Work Orders tab and on the Work Order detail page — the issue is isolated to the Customers > Work Orders tab only. The duplication compounds with each shop ID change, suggesting the prefix is being appended on top of an already-prefixed value rather than replacing it.

Environment: Staging & Production

---
- **Steps to reproduce:**
  1. Navigate to the Work Orders tab and observe the WO number — it displays correctly with the shop ID prefix (e.g. if shop ID is 2, WO number shows as S2-123).
  2. Navigate to Customers > Work Orders tab and observe the same WO number — the shop ID is duplicated (e.g. S22-123).
  3. Navigate to Settings > Locations and change the shop ID from 2 to 22.
  4. Go back to the Work Orders tab — WO number displays correctly as S22-123.
  5. Navigate to Customers > Work Orders tab — shop ID is duplicated again (e.g. S2222-123).
  6. Navigate to Settings > Locations and change the shop ID to 4422.
  7. Go back to the Work Orders tab — WO number displays as S4422-123 (partially correct).
  8. Navigate to Customers > Work Orders tab — shop ID is duplicated further (e.g. S44224422-123).
- **Expected after fix:** The WO number should display the correct shop ID prefix consistently across the entire application, including the Customers > Work Orders tab. The shop ID should never be duplicated regardless of its value or how many times it has been changed.
- **Original actual:** The WO number duplicates the shop ID in the Customers > Work Orders tab only. The duplication compounds with each shop ID change, producing increasingly incorrect values (e.g. S44224422-123). The Work Orders tab and Work Order detail page are not affected.
- **Usable repro:** yes

### SV-6792 — BUG: Regression – “What Are You Doing?” Field Persists After “Save and Add Line”
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Ryan Fyfe  |  **Fix Version:** none
- **Appears in:** v0.54 Regressions
- **Reported issue:** Company: Goguen Truck and Trailer Repairs
Reported By: Cody McCarthy

---

### Summary

Client reports a regression when adding new lines to a Work Order.

When selecting “Save and Add Line”, the “What are you doing?” field (line description header) persists and carries over into the next new line instead of clearing.

---

### Steps to Reproduce

1. Open any Work Order.
2. Add a new line.
3. Enter text in the “What are you doing?” field.
4. Click Save and Add Line.
5. Observe the new line form that opens automatically.

---

### Expected Result

* The new line form should open blank.
* The “What are you doing?” field should reset and not retain the previous entry.

### Actual Result

* The ...
- **Steps to reproduce:**
  1. Open any Work Order.
  2. Add a new line.
  3. Enter text in the “What are you doing?” field.
  4. Click Save and Add Line.
  5. Observe the new line form that opens automatically.
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes
- **Notes:** No fixVersion set on ticket.

### SV-6794 — Reports > Timesheet Activities: Staff filter has unwanted auto-selection and dependency issues
- **Area:** roles / permissions  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Dusan Radulovic  |  **Fix Version:** v0.55
- **Appears in:** v0.54 Regressions
- **Reported issue:** Summary: Reports > Timesheet Activities: Staff filter has unwanted auto-selection and dependency issues

Environment: Staging and Production

---

Issue Description:

There are multiple interconnected filter issues in the Timesheet Activities report on the Reports page:

A. Auto-selection of a staff member with data when a staff member with no data is selected When a staff member with no data is selected alongside a date filter, the report auto-selects a different staff member who has data for that date range instead of showing an empty state.

B. Auto-selection of a staff member for specific date filters when no staff member is selected Selecting certain date filters without selecting any ...
- **Steps to reproduce:**
  1. Issue A (Staging & Production):
  2. Navigate to Reports > Timesheet Activities.
  3. Observe that data for all staff members loads for "This Month" by default — which is correct.
  4. Select a staff member who has no data for yesterday's date range.
  5. Select "Yesterday" from the date filter.
  6. Observe that the report auto-selects a different staff member who has data in the yesterday timeline.
- **Expected after fix:** If a selected staff member has no data for the chosen date range, the table should show an empty state — it should not auto-select a different staff member. No staff member should be auto-selected when selecting any date filter without an explicit staff selection.
- **Original actual:** The staff filter automatically switches to a different staff member who has data in the selected date range instead of showing an empty state. On Staging, selecting "Today" or "This Week" without a staff selection triggers an unwanted auto-selection. On Production, selecting "Yesterday", "Last Month", or "Last Quarter" without a staff selection triggers an unwanted auto-selection. The auto-selected staff member persists across all date ranges until manually cleared. The staff filter dropdown only shows the auto-selected staff member and does not list any other staff members.
- **Usable repro:** yes

### SV-6797 — What are you doing sticks when using save and add line
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nikola Milosevic  |  **Fix Version:** v0.54.hotfix-2
- **Appears in:** v0.54 Regressions
- **Reported issue:** Overview

When a user enters a ‘what are you doing’ and then selects ‘save and add line’, the new modal for the new line persists the previous ‘what are you doing'
- **Steps to reproduce:**
  1. Select New Line on a WO
  2. Enter value into wha t are you doing
  3. Ensure all required fields are populated
  4. Select Save and Add Line
  5. Observe
- **Expected after fix:** The ‘what are you doing’ field should be empty so the user can generate a new subsequent line
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-6799 — Work Orders: "Approved" and "Paid" statuses display the same color making them indistinguishable
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Open  |  **Assignee:** Ryan Fyfe  |  **Fix Version:** none
- **Appears in:** v0.54 Regressions
- **Reported issue:** Issue Description:

There is a UI issue where the "Approved" and "Paid" work order statuses are both displaying in the same green color. This makes it difficult for users to distinguish between the two states at a glance, affecting both the Work Orders tab and the Customers > Work Orders tab.

---
- **Steps to reproduce:**
  1. Navigate to Work Orders (or Customers > Work Orders).
  2. Ensure there are work orders with both "Approved" and "Paid" statuses visible.
  3. Observe the status badge colors for "Approved" and "Paid".
  4. Notice that both statuses display in the same green color.
- **Expected after fix:** Each work order status (e.g., Approved, In Progress, Review, Paid) should have a clearly distinct color for quick visual identification. "Approved" and "Paid" should be visually distinguishable from one another at a glance.
- **Original actual:** Both "Approved" and "Paid" statuses display in the same green color in the Work Orders tab and Customers > Work Orders tab, making it impossible to differentiate between the two states without reading the label text.
- **Usable repro:** yes
- **Notes:** No fixVersion set on ticket.

### SV-6802 — Regression: When clocked in on mobile view, line is no longer green. Techs cannot tell easily which line they are clocked into.
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Ryan Fyfe  |  **Fix Version:** v0.54.hotfix-3
- **Appears in:** v0.54 Regressions
- **Reported issue:** On the mobile view when a user is clocked in, the line is not green anymore.

The only indicator that a technician has that they are clocked in is the STOP button, but no green line indicator anymore.

‌

Issue effects mobile view only.

‌

Reported in person by multiple technicians.
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-6803 — BUG: Missing Payment Notification Emails
- **Area:** payments / ShopPay  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nemanja Djuric  |  **Fix Version:** none
- **Appears in:** v0.54 Regressions
- **Reported issue:** Account: KC Wholesale

Summary:

Customer is no longer receiving payment notification emails for ShopPay transactions (previously working).

Details:

* Notifications were working before
* Since yesterday, no payment notification emails are being received when an invoice is paid via ShopPay, the usual confirmation/notification email is not being triggered
* Spam/Junk folder has already been checked → nothing found
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No fixVersion set on ticket.; No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-6805 — BUG: QuickBooks Export Fails – “Bookkeeping customer not found”
- **Area:** customer portal / customers  |  **Type:** Bug  |  **Status:** OBSOLETE  |  **Assignee:** Mike Freeman  |  **Fix Version:** none
- **Appears in:** v0.54 Regressions
- **Reported issue:** ### Account-Specific Issue

Customer: Mike Fistler
Company: Central Iowa Ag & Machinery, LLC
Users: 5

---

### Summary

Customer reports that when transferring a customer transaction to QuickBooks, the export fails with a “Bookkeeping customer not found” error.

The affected transaction appears under Reports → QB Unexported Items with the following details:

* Type: Payment Create
* Transaction No.: 4625 ( There is no customer invoice of thai number)
* Customer: Jeff Burkley
* Error: _Bookkeeping customer not found for name "Jeff Burkley"._

The customer confirms that this customer does not exist in QuickBooks, and the expectation is that the integration should automatically create the ...
- **Steps to reproduce:**
  1. Unable to Reproduce
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes
- **Notes:** Ticket status is OBSOLETE - confirm still in scope before testing.; No fixVersion set on ticket.

### SV-6807 — BUG: Parts Page – “Cycle Count” Triggers Column Chooser when it shouldn't.
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Nikola Milosevic  |  **Fix Version:** none
- **Appears in:** v0.54 Regressions
- **Reported issue:** Company: Foothills Group

---

### Summary

On the Parts → Inventory page, when clicking the 3-dot menu and selecting “Cycle Count”, the system incorrectly opens the Column Chooser panel while at the same time  initiating the Cycle Count function.

This behavior is not expected and appears to be a UI event misfire.

---

### Steps to Reproduce

1. Navigate to Parts → Inventory.
2. Click the 3-dot menu.
3. Select Cycle Count.

---

### Expected Result

* The Cycle Count workflow/modal should open.
* Column visibility settings should remain unchanged.

### Actual Result

* The Column Chooser selection panel opens.
* Cycle Count action does not initiate.

---

### Impact

* Workflow ...
- **Steps to reproduce:**
  1. Navigate to Parts → Inventory.
  2. Click the 3-dot menu.
  3. Select Cycle Count.
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes
- **Notes:** No fixVersion set on ticket.

### SV-6808 — BUG: Work Order Print – Only First Page of Lines Prints (Remaining Lines Missing)
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Dusan Radulovic  |  **Fix Version:** v0.56.2
- **Appears in:** v0.54 Regressions
- **Reported issue:** Company: Foothills Group

---

### Summary

When right-clicking the web page and using the browser print function and selecting Print, the print preview only includes the first page of work order lines. Any additional lines beyond the first page do not appear in the print output.

This behavior previously worked correctly and now appears to be a regression.

---

### Steps to Reproduce

1. Open a Work Order with multiple lines (more than one page worth).
2. Right-click anywhere on the Work Order page.
3. Select Print.
4. Review the print preview.

---

### Expected Result

* All Work Order lines should appear across multiple pages in the print preview.
* If the Work Order contains multiple ...
- **Steps to reproduce:**
  1. Open a Work Order with multiple lines (more than one page worth).
  2. Right-click anywhere on the Work Order page.
  3. Select Print.
  4. Review the print preview.
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes

### SV-6873 — BUG - Auto Pick doubles picked quantity on approval and corrupts inventory on return
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Bilal Muzamil  |  **Fix Version:** v0.55
- **Appears in:** v0.54 Regressions
- **Reported issue:** Severity: L2 – Medium
Priority: High
Customer: Gabriel Lapointe / GL Mechanique
Area: Inventory / Auto Pick / Part Sales / Work Orders

Description:
When Auto Pick is enabled, approving a quoted part request causes the system to pick double the requested quantity. In the reported case, a request for 4 units of SV029 picked 8 units instead. Returning the item only restored 4 units, leaving inventory incorrect. Customer reported this occurs across multiple parts and in both Part Sales and Work Orders. Disabling Auto Pick made the workflow behave correctly.
- **Steps to reproduce:**
  1. Enable Auto Pick.
  2. Apply an inventory part (With core) to a work order line or part sale that is not approved.
  3. Approve the request so it auto-picks.
  4. Observe picked quantity and inventory.
  5. Return the item and observe inventory again.
- **Expected after fix:** System picks 4 and returns 4, restoring inventory accurately.
- **Original actual:** System picks 8 and returns only 4, leaving inventory short.
- **Usable repro:** yes

## SV-4796 Epic (V0.43 Regression Testing Bugs) (4)

### SV-4803 — Special Order Part with all Data Remains in Quoted Status after Line Status Changes from Need Approval to Approved
- **Area:** parts / inventory  |  **Type:** Bug  |  **Status:** OBSOLETE  |  **Assignee:** Nikola Milosevic  |  **Fix Version:** none
- **Appears in:** SV-4796 Epic (V0.43 Regression Testing Bugs)
- **Reported issue:** Environment:
Staging

‌

Issue:
When the line status is updated from Needs Approval/Authorization Required to Approved/Authorized, requested Special Order Part with all data incorrectly remains in the Quoted status instead of updating to the Auth to order with action Order
- **Steps to reproduce:**
  1. Create a non-authorized line (status of the line: Needs Approval/Authorization Required)
  2. Request Special Order Part
  3. Change the line status to Approved/Authorized
  4. Observe
- **Expected after fix:** Special Order Part status should automatically update from Quoted to Auth to order with action Order If part is missing data aka Vendor or Cost it should update to Requested status
- **Original actual:** Special Order Part remains in Quoted status
- **Usable repro:** yes
- **Notes:** Ticket status is OBSOLETE - confirm still in scope before testing.; No fixVersion set on ticket.

### SV-4847 — Bug: Work Orders list and Financial Info section show incorrect totals until Work Order is revisited or refreshed
- **Area:** work orders  |  **Type:** Bug  |  **Status:** OBSOLETE  |  **Assignee:** Unassigned  |  **Fix Version:** none
- **Appears in:** SV-4796 Epic (V0.43 Regression Testing Bugs)
- **Reported issue:** The Work Orders list and Financial Info section display incorrect totals immediately after the WO creation. The totals only become correct after the Work Order is reopened or refreshed,

### Environment:

* Environment: Staging
* User: [bilalmuzamil+shopview@gmail.com](mailto:bilalmuzamil+shopview@gmail.com)
* Password: [REDACTED]

---

### Steps to Reproduce (STRs):

1. Log in to Staging using the credentials above.
2. Create a new Work Order.
3. Create a Line.
4. Request an Inventory Part named “reteststage”

    * Quantity: 1
    * Price: $19

5. Click Save and Close.
6. Click the Finance tab.

    * Observe: The total in the Finance tab differs from the total under the Financial Info ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** Ticket status is OBSOLETE - confirm still in scope before testing.; No fixVersion set on ticket.; No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-4849 — Bug: Work Order total price appears off in the workorders list.
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Unassigned  |  **Fix Version:** none
- **Appears in:** SV-4796 Epic (V0.43 Regression Testing Bugs)
- **Reported issue:** The Work Orders total price is appearing off in the Workorders list.

### Environment:

* Environment: Staging
* User: [bilalmuzamil+shopview@gmail.com](mailto:bilalmuzamil+shopview@gmail.com)
* Password: [REDACTED]

---

Not Reproducible on Production Environment

---

### Steps to Reproduce (STRs):

1. Log in to Staging using the credentials above.
2. Create a new Work Order.
3. Create a Line.
4. Request an Inventory Part named “reteststage”

    * Quantity: 336563
    * Price: Do NOT change

5. Click Save and Close
6. Do NOT pick the part
7. Click the Main part.
8. Change the price to $19
9. Now click PICK to pick the part
10. Click NOT OK for the core part
11. Click the Work Orders ...
- **Steps to reproduce:** _none in ticket — infer from reported issue_
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** NO — needs inference
- **Notes:** No fixVersion set on ticket.; No explicit Steps-to-Reproduce block in description - repro must be inferred from the reported issue.

### SV-4910 — Bug: Workorder -> "New Line" button is appearing in Blue background color
- **Area:** work orders  |  **Type:** Bug  |  **Status:** Done  |  **Assignee:** Stefan Mitrovic  |  **Fix Version:** none
- **Appears in:** SV-4796 Epic (V0.43 Regression Testing Bugs)
- **Reported issue:** Issue:  Workorder -> "New Line" button is appearing with Blue background color.
On production this is appearing with white background with Blue text color and blue outline.
- **Steps to reproduce:**
  1. Create WO → See the “New Line“ button
  2. Observe: The button to “New Line“ is appearing with blue background.
- **Expected after fix:** (not stated)
- **Original actual:** (not stated)
- **Usable repro:** yes
- **Notes:** No fixVersion set on ticket.

## Excluded — SV-4796 children assigned to Milan (NOT tested)

- SV-3941 — Calculations on Invoices incorrect - Fixed Line Total Issue (assignee: Milan Zivanovic, status: Done)
- SV-4773 — Bug: Work order -> Total Price is appearing as Zero for ALL statuses. (assignee: Milan Zivanovic, status: Done)
- SV-4780 — Bug: Work Order -> Returning an inventory part with core throws an error. (assignee: Milan Zivanovic, status: Done)
- SV-4784 — Cannot Return Inventory Part -> Work Order gets deleted/invalidated (assignee: Milan Zivanovic, status: Done)
- SV-4786 — Bug: Workorder -> All the lines have disappeared (assignee: Milan Zivanovic, status: Done)
- SV-4787 — Bug: When user opens certain WOs, lines cannot be fetched from database (500 error) (assignee: Milan Zivanovic, status: Done)
- SV-4799 — [BE] Bug: Declining a line with "Fixed line Total" removed the values for Labor portion and Parts Portion (assignee: Milan Zivanovic, status: Done)
- SV-4831 — Bug: WO -> Parts tab show "0" despite of having parts in the WO lines. (assignee: Milan Zivanovic, status: Done)
- SV-4834 — WO: Declining a Line with a Special Order Part Sets the Sell Price to Zero (assignee: Milan Zivanovic, status: Done)
- SV-4846 — Bug: WO -> Core  part Price becomes Zero even when it is marked as "Not OK" (assignee: Milan Zivanovic, status: Done)
- SV-4877 — Returning Special Order Part After Core Was Marked as OK Returns Double Amount of Cores (assignee: Milan Zivanovic, status: Done)
- SV-4878 — Bug: Labor (Estimated Hours) in the Invoice is appearing wrong (assignee: Milan Zivanovic, status: Done)
- SV-4879 — Bug: Customer Invoice Tax on the Main part appears to be off. (assignee: Milan Zivanovic, status: Done)
- SV-4882 — Financial Info: Incorrect Tax Calculation (assignee: Milan Zivanovic, status: Done)
- SV-4884 — Bug: The Invoiced Work Orders are showing different price totals in the Work Orders list compared to the Finance tab and Financial Info section. (assignee: Milan Zivanovic, status: Done)
- SV-4951 — Incorrect line total displayed when using Fixed Line Total (assignee: Milan Zivanovic, status: Done)
