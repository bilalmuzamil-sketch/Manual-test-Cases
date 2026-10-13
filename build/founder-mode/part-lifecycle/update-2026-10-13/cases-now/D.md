

========== C154784 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Work order part lookup no longer offers a part once it is inactive
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part at [Loc-1], quantity 4 in its default bin, active at first and set inactive in Setup.
- Data: [WO-1] = an open work order at [Loc-1] with one approved line [Line-1] that holds no parts.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [WO-1] and stay on the Lines tab.
- On [Line-1] open the line's ⋮ menu and click "Request part".
- In the "New Part Request" dialog type "ZZAUTOTEST-PL-WOL" in Part Number.
- Clear Part Number and type [Desc-A].
- Close the dialog with ×.
--- EXPECTED
Expected results
- Step 2: The "New Part Request" dialog opens from the work order line, which is where a part request is raised.
- Step 3: No row for [Part-A] is offered: no inventory row with "Inventory Qty" and no "Part Library" row. If nothing else matches, the list reads "No results".
- Step 4: Again no row for [Part-A] is offered.
- Step 5: The dialog closes and [Line-1] still holds no parts.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R1, S9-E10, read 8 Oct 2026; design canvas boards 6.1 (While active: GREASETUBE is found) and 6.2 (Once inactive: not offered). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Tech plan "Parts Lifecycle Update — Technical Implementation Plan", 7 Oct 2026 (informs, never overrules), §6 Phase 7.
Exact quotes from the source (for reproducibility)
- S9-E10: “If ShopView adds a way to raise a part request from a purchase order, it uses the purchase order's part lookup, which leaves inactive parts out (S9-R5). Today part requests are raised on the work order (S9-R1).”
- S9-R1: “Part lookup on a work order line does not return inactive parts.”
- Tech plan (Parts Lifecycle Update, 7 Oct 2026), §6 Phase 7, ListingQueryHandler: “Covers WO, estimate, tech charge-out (every device), PO, vendor-bill re-point, part sale”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Work order part lookup no longer offers a part once it is inactive
Test case: C154784, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part at [Loc-1], quantity 4 in its default bin, active at first and set inactive in Setup.
- Data: [WO-1] = an open work order at [Loc-1] with one approved line [Line-1] that holds no parts.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL WOLOOK PART), Part Number (e.g. ZZAUTOTEST-PL-WOLOOK-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-WOLOOK-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL WOLOOK PART).
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL WOLOOK Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-WOLOOK-UNIT"); click Create.
- [WO-1] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-1] click "New Line", type Title (e.g. "ZZAUTOTEST PL WOLOOK line"), click "Save & Close". [Line-1] = that line. Click "Approve" on [Line-1].
- While [Part-A] is still active, on [Line-1] open the ⋮ menu, click "Request part" and type "ZZAUTOTEST-PL-WOL" in Part Number: [Part-A] is offered with "Inventory Qty: 4". Close the dialog with × without saving.
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: on Parts → Inventory the Inactive tab lists [Part-A] and the Active tab does not; [Line-1] on [WO-1] holds no parts. If [Part-A] is still on the Active tab, repeat the previous step.



========== C154785 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Inactive part's dialog shows a grey Inactive badge in the title row
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part, set inactive in Setup. [Part-B] = one tracked part, active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Go to Parts → Inventory, click the Inactive tab and search [Part-A].
- Click the [Part-A] row.
- Read the dialog's title row and the Part Status choice.
- Close the dialog with ×.
- On the Active tab search [Part-B] and click its row.
--- EXPECTED
Expected results
- Step 3: The dialog is titled "Edit Inventory Part" and shows a grey "Inactive" pill beside the close ×; Part Status has "Inactive" picked.
- Step 4: The dialog closes with nothing changed.
- Step 5: [Part-B]'s dialog shows a green "Active" pill in the same place.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R14, read 8 Oct 2026; design canvas boards 3.6 (Opening the inactive part) and 3.1 (Part Status in the dialog). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-R14: “The part dialog of an inactive part shows the grey "Inactive" badge in its title row (S13-R3).”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Inactive part's dialog shows a grey Inactive badge in the title row
Test case: C154785, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part, set inactive in Setup. [Part-B] = one tracked part, active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL BADGE A), Part Number (e.g. ZZAUTOTEST-PL-BADGE-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-BADGE-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL BADGE A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL BADGE B), Part Number (e.g. ZZAUTOTEST-PL-BADGE-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-BADGE-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL BADGE B).
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [Part-A] is on the Inactive tab and [Part-B] on the Active tab.



========== C154786 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: A user with only the View permission can open the Inactive tab
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- User: [User-B] = a staff member whose custom role [Role-B] has only 'Part Library & Inventory → View' in the Parts department (no Create & Edit, no Delete).
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part set inactive by [Admin] in Setup.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- In browser 2 (as [User-B]) go to Parts → Inventory.
- Click the Inactive tab.
- Search [Part-A].
--- EXPECTED
Expected results
- Step 1: The list opens on the Active tab, with the Inactive tab beside it.
- Step 2: The Inactive tab opens.
- Step 3: [Part-A] is listed.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-N1, read 8 Oct 2026; design canvas none (board 3.5 shows the Inactive tab as Admin). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-N1: “A user who can view the Inventory list can open the Inactive tab. Seeing inactive parts needs no extra permission.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A user with only the View permission can open the Inactive tab
Test case: C154786, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- User: [User-B] = a staff member whose custom role [Role-B] has only 'Part Library & Inventory → View' in the Parts department (no Create & Edit, no Delete).
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part set inactive by [Admin] in Setup.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Settings → Roles & Permissions, click "Create custom role", skip the template, name it (e.g. "ZZAUTOTEST PL VIEWONLY"), turn on the Parts department and tick only 'Part Library & Inventory → View', click Save. [Role-B] = that role.
- Go to Settings → Staff, add a staff member (e.g. first name "ZZAUTOTEST", last name "PL VIEWONLY") with an email address you can open, Role [Role-B]; save, open the invite email and set a password. [User-B] = that user.
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL VIEWONLY PART), Part Number (e.g. ZZAUTOTEST-PL-VIEWONLY-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-VIEWONLY-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL VIEWONLY PART).
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: in browser 2, signed in as [User-B], Parts → Inventory opens. If it does not open, re-check that View is ticked on [Role-B].



========== C154787 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: A work order line keeps its inactive part and can still be edited
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, Sell Price $20.00, quantity 4, added to [Line-1] of [WO-1] (quantity 2) while active, then set inactive.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [WO-1] and read the [Part-A] row on [Line-1].
- Open the [Part-A] row, change Quantity from 2 to 3 and save.
- Open it again, change Sell Price to $22.00 and save.
- Open it again, add the note "ZZAUTOTEST still here" and save.
--- EXPECTED
Expected results
- Step 1: The row is still on [Line-1]: quantity 2, $20.00, total $40.00 (2 × $20.00).
- Step 2: The change saves and the row total reads $60.00 (3 × $20.00).
- Step 3: The change saves and the row total reads $66.00 (3 × $22.00); the line total includes it.
- Step 4: The note saves, and the row still holds [Part-A].
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-E1, S9-E2, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Tech plan "Parts Lifecycle Update — Technical Implementation Plan", 7 Oct 2026 (informs, never overrules), §5 Modified endpoints.
Exact quotes from the source (for reproducibility)
- S9-E1: “A line that already holds a part when the part becomes inactive stays on its work order, estimate or part sale, including a completed part sale, and its totals keep calculating.”
- S9-E2: “The user can still change the quantity, price and notes on that line, and save it again with the same part or number.”
- Tech plan (Parts Lifecycle Update, 7 Oct 2026), §5 Modified endpoints: “Not refused: re-saving the same part (S9-E2), ordering an existing part request (S9-E6), pick, receive, split, invoice”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A work order line keeps its inactive part and can still be edited
Test case: C154787, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, Sell Price $20.00, quantity 4, added to [Line-1] of [WO-1] (quantity 2) while active, then set inactive.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL KEEPLINE PART), Part Number (e.g. ZZAUTOTEST-PL-KEEPLINE-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-KEEPLINE-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL KEEPLINE PART).
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL KEEPLINE Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-KEEPLINE-UNIT"); click Create.
- [WO-1] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-1] click "New Line", type Title (e.g. "ZZAUTOTEST PL KEEPLINE line"), click "Save & Close". [Line-1] = that line. Click "Approve" on [Line-1].
- On [Line-1] open the line's ⋮ menu, click "Request part", type [Part-A] in Part Number, pick the row that shows "Inventory Qty", set Quantity to 2 and click "Save Part".
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: on [WO-1] the [Part-A] row of [Line-1] shows quantity 2, $20.00 and total $40.00 (2 × $20.00); [Part-A] is on the Inactive tab.



========== C154788 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: An invoiced work order with an inactive part can be viewed and printed
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [WO-1] = an invoiced work order holding [Part-A] (1 × $20.00); [Part-A] set inactive after the invoice.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [WO-1] and read its Lines tab.
- Open the Finance tab and read the invoice.
- Click the print icon on the Finance tab.
- Go to Reports → Parts Velocity, set a date range that includes today and search [Part-A].
--- EXPECTED
Expected results
- Step 1: [WO-1] opens and [Line-1] shows [Part-A].
- Step 2: The invoice shows [Part-A], 1 × $20.00.
- Step 3: The print preview opens and lists [Part-A].
- Step 4: The report lists [Part-A] with its sold quantity 1.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-E4, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-E4: “Completed and invoiced work orders that hold an inactive part stay viewable, printable and reportable.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: An invoiced work order with an inactive part can be viewed and printed
Test case: C154788, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [WO-1] = an invoiced work order holding [Part-A] (1 × $20.00); [Part-A] set inactive after the invoice.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL OLDWO PART), Part Number (e.g. ZZAUTOTEST-PL-OLDWO-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-OLDWO-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL OLDWO PART).
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL OLDWO Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-OLDWO-UNIT"); click Create.
- [WO-1] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-1] click "New Line", type Title (e.g. "ZZAUTOTEST PL OLDWO line"), click "Save & Close". [Line-1] = that line. Click "Approve" on [Line-1].
- On [Line-1] open the line's ⋮ menu, click "Request part", type [Part-A] in Part Number, pick the row that shows "Inventory Qty", set Quantity to 1 and click "Save Part".
- Pick [Part-A], mark [Line-1] complete, complete [WO-1] (Review if asked), then click "Create Invoice" on the Finance tab.
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [WO-1] reads Invoiced and [Part-A] is on the Inactive tab.



========== C425724 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Estimate part lookup no longer offers a part once it is inactive
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part at [Loc-1], quantity 4, set inactive in Setup.
- Data: [WO-1] = a work order still at the estimate stage (it shows the "Estimate" pill and its line [Line-1] reads "Needs Approval"), with no parts.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [WO-1].
- On [Line-1] open the line's ⋮ menu and click "Request part".
- Type "ZZAUTOTEST-PL-EST" in Part Number.
- Clear Part Number and type [Desc-A].
- Close the dialog with ×.
--- EXPECTED
Expected results
- Step 3: No row for [Part-A] is offered, neither as an inventory part nor as a "Part Library" row.
- Step 4: Again no row for [Part-A] is offered.
- Step 5: [Line-1] still holds no parts and [WO-1] is still an estimate.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R2, read 8 Oct 2026; design canvas board 6.2 (Once inactive: not offered; shown on a work order in the Estimate stage). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Tech plan "Parts Lifecycle Update — Technical Implementation Plan", 7 Oct 2026 (informs, never overrules), §6 Phase 7.
Exact quotes from the source (for reproducibility)
- S9-R2: “Part lookup on an estimate line does not return inactive parts.”
- Tech plan (Parts Lifecycle Update, 7 Oct 2026), §6 Phase 7, ListingQueryHandler: “Covers WO, estimate, tech charge-out (every device), PO, vendor-bill re-point, part sale”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Estimate part lookup no longer offers a part once it is inactive
Test case: C425724, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part at [Loc-1], quantity 4, set inactive in Setup.
- Data: [WO-1] = a work order still at the estimate stage (it shows the "Estimate" pill and its line [Line-1] reads "Needs Approval"), with no parts.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL ESTLOOK PART), Part Number (e.g. ZZAUTOTEST-PL-ESTLOOK-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-ESTLOOK-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL ESTLOOK PART).
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL ESTLOOK Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-ESTLOOK-UNIT"); click Create.
- [WO-1] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-1] click "New Line", type Title (e.g. "ZZAUTOTEST PL ESTLOOK line"), click "Save & Close". [Line-1] = that line.
- While [Part-A] is still active, on [Line-1] open the ⋮ menu, click "Request part" and type "ZZAUTOTEST-PL-EST" in Part Number: [Part-A] is offered. Close the dialog with × without saving.
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [WO-1] shows the "Estimate" pill, [Line-1] reads "Needs Approval" (do not approve it), and [Part-A] is on the Inactive tab only.



========== C425725 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Technician charge-out does not offer or accept an inactive part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- User: [Tech-A] = a staff member with the default Technician role (work order view mode "Tech view"), signed in in a second browser on a desktop computer.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part at [Loc-1], quantity 4, set inactive in Setup.
- Data: [WO-1] = an open work order with one approved line [Line-1] on which [Tech-A] is a technician; no parts on it.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- In browser 2 (as [Tech-A]) open [WO-1].
- Under [Line-1] click "+ Add Part".
- In the new part row type "ZZAUTOTEST-PL-TECHD" in the part field.
- Clear the field and type [Part-A] in full, all in lower case.
- Press Enter (or click the row's "Save").
--- EXPECTED
Expected results
- Step 3: No row for [Part-A] is offered.
- Step 4: The field shows, as its error, "[Part-A] is inactive. Activate it from the Inactive tab to use it." with [Part-A] written as it was saved (capitals, hyphens). No offer to add it as a special order or a new part appears.
- Step 5: The row is not saved: [Line-1] gets no new part and the error stays under the field.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R3, S9-R16, read 8 Oct 2026; design canvas board 6.3 (Typing the retired number in full; same message, shown on New Part Request). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Tech plan "Parts Lifecycle Update — Technical Implementation Plan", 7 Oct 2026 (informs, never overrules), §6 Phase 7.
Exact quotes from the source (for reproducibility)
- S9-R3: “Technician charge-out part selection does not return inactive parts, on every device.”
- S9-R16: “When the number typed in a part lookup matches an inactive part at this location, the lookup does not offer to add it as a special order. It shows "{part number} is inactive. Activate it from the Inactive tab to use it.", naming the inactive part's number. On technician charge-out, where a typed number is taken straight from the field, the field shows the same message as its error and the line cannot be saved.”
- PRD §8 User Feedback Summary (Retired number typed in a part lookup): “"{part number} is inactive. Activate it from the Inactive tab to use it."”
- PRD §8 User Feedback Summary (Retired number typed in a part lookup): “Shown in the lookup in place of the special order offer; on technician charge-out, error under the field”
- Tech plan (Parts Lifecycle Update, 7 Oct 2026), §6 Phase 7, ListingQueryHandler: “Covers WO, estimate, tech charge-out (every device), PO, vendor-bill re-point, part sale”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Technician charge-out does not offer or accept an inactive part
Test case: C425725, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- User: [Tech-A] = a staff member with the default Technician role (work order view mode "Tech view"), signed in in a second browser on a desktop computer.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part at [Loc-1], quantity 4, set inactive in Setup.
- Data: [WO-1] = an open work order with one approved line [Line-1] on which [Tech-A] is a technician; no parts on it.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Settings → Staff, add a staff member (e.g. first name "ZZAUTOTEST", last name "PL TECHDESK") with an email address you can open, Role Technician; save, open the invite email and set a password. [Tech-A] = that user.
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL TECHDESK PART), Part Number (e.g. ZZAUTOTEST-PL-TECHDESK-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-TECHDESK-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL TECHDESK PART).
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL TECHDESK Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-TECHDESK-UNIT"); click Create.
- [WO-1] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-1] click "New Line", type Title (e.g. "ZZAUTOTEST PL TECHDESK line") and add [Tech-A] under Technicians, click "Save & Close". [Line-1] = that line. Click "Approve" on [Line-1].
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: in browser 2, signed in as [Tech-A], Work Orders lists [WO-1]; [Line-1] shows "+ Add Part" under its Parts row. In browser 1, [Part-A] is on the Inactive tab only.



========== C425726 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Technician charge-out on a phone refuses an inactive part number
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- User: [Tech-A] = a staff member with the default Technician role (work order view mode "Tech view"), signed in on a phone's web browser.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part at [Loc-1], quantity 4, set inactive in Setup.
- Data: [WO-1] = an open work order with one approved line [Line-1] on which [Tech-A] is a technician; no parts on it.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- On the phone open [WO-1].
- Under [Line-1] tap "+ Add Part".
- Type "ZZAUTOTEST-PL-TECHP" in the part field.
- Clear the field and type [Part-A] in full, all in lower case.
- Tap the row's "Save".
--- EXPECTED
Expected results
- Step 3: No row for [Part-A] is offered.
- Step 4: The field shows the error "[Part-A] is inactive. Activate it from the Inactive tab to use it." under it, naming [Part-A] as it was saved.
- Step 5: The row is not saved and [Line-1] gets no new part.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R3, S9-R16, read 8 Oct 2026; design canvas board 6.3 (desktop only; the design has no phone board). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Tech plan "Parts Lifecycle Update — Technical Implementation Plan", 7 Oct 2026 (informs, never overrules), §7 Manual testing checklist.
Exact quotes from the source (for reproducibility)
- S9-R3: “Technician charge-out part selection does not return inactive parts, on every device.”
- PRD §2 Feature Overview, Form factor: “Story 9 applies on every device, including technician charge-out on a phone.”
- S9-R16: “When the number typed in a part lookup matches an inactive part at this location, the lookup does not offer to add it as a special order. It shows "{part number} is inactive. Activate it from the Inactive tab to use it.", naming the inactive part's number. On technician charge-out, where a typed number is taken straight from the field, the field shows the same message as its error and the line cannot be saved.”
- Tech plan (Parts Lifecycle Update, 7 Oct 2026), §7 Manual testing checklist, item 6: “Tech View charge-out at phone width: a typed inactive number blocks the save with the message under the field.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Technician charge-out on a phone refuses an inactive part number
Test case: C425726, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- User: [Tech-A] = a staff member with the default Technician role (work order view mode "Tech view"), signed in on a phone's web browser.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part at [Loc-1], quantity 4, set inactive in Setup.
- Data: [WO-1] = an open work order with one approved line [Line-1] on which [Tech-A] is a technician; no parts on it.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Settings → Staff, add a staff member (e.g. first name "ZZAUTOTEST", last name "PL TECHPHONE") with an email address you can open, Role Technician; save, open the invite email and set a password. [Tech-A] = that user.
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL TECHPHONE PART), Part Number (e.g. ZZAUTOTEST-PL-TECHPHONE-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-TECHPHONE-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL TECHPHONE PART).
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL TECHPHONE Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-TECHPHONE-UNIT"); click Create.
- [WO-1] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-1] click "New Line", type Title (e.g. "ZZAUTOTEST PL TECHPHONE line") and add [Tech-A] under Technicians, click "Save & Close". [Line-1] = that line. Click "Approve" on [Line-1].
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: on the phone, signed in as [Tech-A], [WO-1] opens and [Line-1] shows "+ Add Part"; the page uses the phone layout (no desktop side bar). In the desktop browser [Part-A] is on the Inactive tab only.



========== C425727 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Purchase order line lookup does not offer an inactive part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part at [Loc-1], quantity 4, set inactive in Setup.
- Data: [PO-1] = an open purchase order for [Vendor-1] holding one line [Vend-1] (a vendor part ordered from [WO-1]).
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Go to Parts → Purchase Orders and open [PO-1].
- Add a new line to [PO-1] (the purchase order's add-part control).
- Type "ZZAUTOTEST-PL-POL" in the new line's Part Number.
- Clear Part Number and type [Part-A] in full, all in lower case.
- Leave the new line unsaved and close it.
--- EXPECTED
Expected results
- Step 3: No row for [Part-A] is offered.
- Step 4: The lookup shows "[Part-A] is inactive. Activate it from the Inactive tab to use it." in place of the offer to add the typed number as a new part, naming [Part-A] as it was saved.
- Step 5: [PO-1] still holds only [Vend-1].
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R5, S9-R16, read 8 Oct 2026; design canvas none (no board shows a purchase order; message wording from board 6.3). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Tech plan "Parts Lifecycle Update — Technical Implementation Plan", 7 Oct 2026 (informs, never overrules), §6 Phase 7.
Exact quotes from the source (for reproducibility)
- S9-R5: “Part lookup on a purchase order line does not return inactive parts.”
- S9-R16: “When the number typed in a part lookup matches an inactive part at this location, the lookup does not offer to add it as a special order. It shows "{part number} is inactive. Activate it from the Inactive tab to use it.", naming the inactive part's number. On technician charge-out, where a typed number is taken straight from the field, the field shows the same message as its error and the line cannot be saved.”
- PRD §8 User Feedback Summary (Retired number typed in a part lookup): “"{part number} is inactive. Activate it from the Inactive tab to use it."”
- PRD §8 User Feedback Summary (Retired number typed in a part lookup): “Shown in the lookup in place of the special order offer; on technician charge-out, error under the field”
- Tech plan (Parts Lifecycle Update, 7 Oct 2026), §6 Phase 7, ListingQueryHandler: “Covers WO, estimate, tech charge-out (every device), PO, vendor-bill re-point, part sale”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Purchase order line lookup does not offer an inactive part
Test case: C425727, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part at [Loc-1], quantity 4, set inactive in Setup.
- Data: [PO-1] = an open purchase order for [Vendor-1] holding one line [Vend-1] (a vendor part ordered from [WO-1]).
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Vendors, click "New Vendor", type Name (e.g. "ZZAUTOTEST PL POLOOK Vendor"), click "Save & Close". [Vendor-1] = that vendor.
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL POLOOK PART), Part Number (e.g. ZZAUTOTEST-PL-POLOOK-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-POLOOK-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL POLOOK PART).
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL POLOOK Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-POLOOK-UNIT"); click Create.
- [WO-1] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-1] click "New Line", type Title (e.g. "ZZAUTOTEST PL POLOOK line"), click "Save & Close". [Line-1] = that line. Click "Approve" on [Line-1].
- On [Line-1] open the line's ⋮ menu, click "Request part", type a new number in Part Number (e.g. ZZAUTOTEST-PL-POLOOK-VEND-01) and press Tab, pick Source "Vendor", Category (e.g. Uncategorized), Vendor [Vendor-1], Cost (e.g. $8.00), Sell Price (e.g. $16.00), click "Save Part". [Vend-1] = that number.
- On [WO-1] open the Parts tab and order [Vend-1] (its "Order" action). Go to Parts → Purchase Orders: a new purchase order for [Vendor-1] holds [Vend-1]. [PO-1] = its number.
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: Parts → Purchase Orders lists [PO-1] (not yet received) with the line [Vend-1]; [Part-A] is on the Inactive tab only.



========== C425728 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Re-pointing a received vendor bill line does not offer an inactive part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part, quantity 4, set inactive in Setup. [Part-B] = one tracked part, quantity 4, active.
- Data: [Bill-1] = a received vendor bill (vendor invoice) for [Vendor-1] with one line [Vend-1].
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Go to Parts → Vendor Invoices and open [Bill-1].
- On the line [Vend-1], open the control that changes which part the line points to.
- Type "ZZAUTOTEST-PL-BILL-0" in its part lookup.
- Close the lookup without picking anything.
--- EXPECTED
Expected results
- Step 3: [Part-B] is offered and [Part-A] is not.
- Step 4: The line still points to [Vend-1].
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R6, read 8 Oct 2026; design canvas none (no board shows a vendor bill). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Tech plan "Parts Lifecycle Update — Technical Implementation Plan", 7 Oct 2026 (informs, never overrules), §6 Phase 7.
Exact quotes from the source (for reproducibility)
- S9-R6: “Changing which part a line on a received vendor bill points to does not offer inactive parts.”
- Tech plan (Parts Lifecycle Update, 7 Oct 2026), §6 Phase 7, ListingQueryHandler: “Covers WO, estimate, tech charge-out (every device), PO, vendor-bill re-point, part sale”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Re-pointing a received vendor bill line does not offer an inactive part
Test case: C425728, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part, quantity 4, set inactive in Setup. [Part-B] = one tracked part, quantity 4, active.
- Data: [Bill-1] = a received vendor bill (vendor invoice) for [Vendor-1] with one line [Vend-1].
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Vendors, click "New Vendor", type Name (e.g. "ZZAUTOTEST PL BILL Vendor"), click "Save & Close". [Vendor-1] = that vendor.
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL BILL PART A), Part Number (e.g. ZZAUTOTEST-PL-BILL-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-BILL-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL BILL PART A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL BILL PART B), Part Number (e.g. ZZAUTOTEST-PL-BILL-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-BILL-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL BILL PART B).
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL BILL Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-BILL-UNIT"); click Create.
- [WO-1] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-1] click "New Line", type Title (e.g. "ZZAUTOTEST PL BILL line"), click "Save & Close". [Line-1] = that line. Click "Approve" on [Line-1].
- On [Line-1] open the line's ⋮ menu, click "Request part", type a new number in Part Number (e.g. ZZAUTOTEST-PL-BILL-VEND-01) and press Tab, pick Source "Vendor", Category (e.g. Uncategorized), Vendor [Vendor-1], Cost (e.g. $8.00), Sell Price (e.g. $16.00), click "Save Part". [Vend-1] = that number.
- On [WO-1] open the Parts tab and order [Vend-1] (its "Order" action). Go to Parts → Purchase Orders: a new purchase order for [Vendor-1] holds [Vend-1]. [PO-1] = its number.
- Open [PO-1], click "Receive", type an invoice number (e.g. ZZAUTOTEST-PL-BILL-INV), the delivered quantity 1, Cost $8.00 and Sell $16.00, then click "Receive". [Bill-1] = that invoice number.
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: Parts → Vendor Invoices lists [Bill-1] with the line [Vend-1]; [Part-A] is on the Inactive tab and [Part-B] on the Active tab.



========== C425729 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Part sale line lookup does not offer an inactive part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part, quantity 4, set inactive in Setup. [PS-1] = an open part sale for [Cust-1] with no parts.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [PS-1] and its Parts tab.
- Click "Add Part".
- Type "ZZAUTOTEST-PL-PSL" in Part Number.
- Close the part row without saving.
--- EXPECTED
Expected results
- Step 3: No row for [Part-A] is offered.
- Step 4: [PS-1] still has no parts.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R8, read 8 Oct 2026; design canvas none (board 6.7 shows a part sale, not its part lookup). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Tech plan "Parts Lifecycle Update — Technical Implementation Plan", 7 Oct 2026 (informs, never overrules), §6 Phase 7.
Exact quotes from the source (for reproducibility)
- S9-R8: “Part lookup on a part sale line does not return inactive parts.”
- Tech plan (Parts Lifecycle Update, 7 Oct 2026), §6 Phase 7, ListingQueryHandler: “Covers WO, estimate, tech charge-out (every device), PO, vendor-bill re-point, part sale”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Part sale line lookup does not offer an inactive part
Test case: C425729, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part, quantity 4, set inactive in Setup. [PS-1] = an open part sale for [Cust-1] with no parts.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL PSLOOK PART), Part Number (e.g. ZZAUTOTEST-PL-PSLOOK-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-PSLOOK-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL PSLOOK PART).
- Go to Customers, create a customer named (e.g.) "ZZAUTOTEST PL PSLOOK Customer" and save it. [Cust-1] = that customer.
- Go to Parts → Part Sales, start a new part sale for [Cust-1]. [PS-1] = the part sale number shown (e.g. P2-89).
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [PS-1] opens with an empty Parts tab; [Part-A] is on the Inactive tab only.



========== C425730 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Canned job is added without its inactive parts and one warning names them
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B] = two tracked parts set inactive in Setup; [Part-C] = one tracked part, active. Each quantity 4.
- Data: [Job-1] = a canned job holding [Part-A], [Part-B] and [Part-C] (3 parts). [WO-1] = an open work order without lines.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [WO-1].
- Click "New Line".
- Type the start of [Job-1] in Title.
- Pick the [Job-1] suggestion.
- Click "Save & Close".
- Read the warning at the bottom right.
- Wait 10 seconds.
- Click "Close" on the warning.
--- EXPECTED
Expected results
- Step 4: The suggestion reads [Job-1] with "Total Parts: 3".
- Step 5: [WO-1] gets a new line [Job-1] holding one part, [Part-C]. [Part-A] and [Part-B] are not on it.
- Step 6: Exactly one warning shows (one for the whole canned job, not one per part): "These parts are inactive and were not added: [Part-A], [Part-B]."
- Step 7: The warning is still on screen after 10 seconds.
- Step 8: The warning closes.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R9, S9-R10, read 8 Oct 2026; design canvas boards 6.4 (A canned job that holds it) and 6.5 (The canned job leaves it out; its toast wording is the older one, the PRD wins). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Tech plan "Parts Lifecycle Update — Technical Implementation Plan", 7 Oct 2026 (informs, never overrules), §6 Phase 7.
Exact quotes from the source (for reproducibility)
- S9-R9: “Applying a canned job adds the job without its inactive parts.”
- S9-R10: “When a canned job leaves out parts, the system shows one warning listing every part left out: "These parts are inactive and were not added: {part numbers}." The warning stays until the user closes it.”
- PRD §8 User Feedback Summary (Canned job leaves out inactive parts): “"These parts are inactive and were not added: {part numbers}." plus "The {fee} fee for {part number} was not added." for each fee left out”
- PRD §8 User Feedback Summary (Canned job leaves out inactive parts): “Warning toast, one per canned job, stays until closed”
- Tech plan (Parts Lifecycle Update, 7 Oct 2026), §6 Phase 7 browser-walk: “a canned job containing it and a second inactive part shows one warning naming both”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Canned job is added without its inactive parts and one warning names them
Test case: C425730, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B] = two tracked parts set inactive in Setup; [Part-C] = one tracked part, active. Each quantity 4.
- Data: [Job-1] = a canned job holding [Part-A], [Part-B] and [Part-C] (3 parts). [WO-1] = an open work order without lines.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL CANNED A), Part Number (e.g. ZZAUTOTEST-PL-CANNED-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-CANNED-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL CANNED A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL CANNED B), Part Number (e.g. ZZAUTOTEST-PL-CANNED-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-CANNED-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL CANNED B).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL CANNED C), Part Number (e.g. ZZAUTOTEST-PL-CANNED-03), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-C] = the part number you typed (e.g. ZZAUTOTEST-PL-CANNED-03); [Desc-C] = the description you typed (e.g. ZZAUTOTEST PL CANNED C).
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL CANNEDSRC Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-CANNEDSRC-UNIT"); click Create.
- [WO-0] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-0] click "New Line", type Title (e.g. "ZZAUTOTEST PL CANNEDSRC line"), click "Save & Close". [Line-0] = that line. Click "Approve" on [Line-0].
- On [Line-0] open the line's ⋮ menu, click "Request part", type [Part-A] in Part Number, pick the row that shows "Inventory Qty", set Quantity to 1 and click "Save Part".
- On [Line-0] open the line's ⋮ menu, click "Request part", type [Part-B] in Part Number, pick the row that shows "Inventory Qty", set Quantity to 1 and click "Save Part".
- On [Line-0] open the line's ⋮ menu, click "Request part", type [Part-C] in Part Number, pick the row that shows "Inventory Qty", set Quantity to 1 and click "Save Part".
- On [Line-0] open the line's ⋮ menu, click "Save as canned line" and save it under the line's title. [Job-1] = that canned job name.
- Go to Work Orders, click "New Work Order", create the customer "ZZAUTOTEST PL CANNED Customer" and unit "ZZAUTOTEST-PL-CANNED-UNIT", click Create. [WO-1] = that work order number.
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Set [Part-B] inactive: on the Active tab search [Part-B], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: on [WO-1] click "New Line" and type the start of [Job-1] in Title: the suggestion shows "Total Parts: 3"; close the dialog. [Part-A] and [Part-B] are on the Inactive tab, [Part-C] on the Active tab.



========== C425731 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Canned job leaves out a typed vendor part that matches an inactive part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part, set inactive in Setup. [Part-C] = one tracked part, active.
- Data: [Job-1] = a canned job holding [Part-C] and a vendor part typed in by hand as [Typed-1], a number that equals [Part-A] once case, hyphens and periods are ignored.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [WO-1].
- Click "New Line".
- Type the start of [Job-1] in Title and pick the [Job-1] suggestion.
- Click "Save & Close".
- Read the warning at the bottom right.
--- EXPECTED
Expected results
- Step 4: The new line [Job-1] holds [Part-C] only; the vendor part [Typed-1] is not on it.
- Step 5: One warning shows, starting "These parts are inactive and were not added:" and naming the left-out part. It stays until closed.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R9a, S9-R10, read 8 Oct 2026; design canvas none (boards 6.4 and 6.5 show an inventory part, not a typed vendor part). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-R9a: “A canned job part that was typed in as a vendor part, and whose number matches an inactive part at this location, is left out too.”
- PRD Story 9 context note: “in S9-R9a, S9-R15, S9-R16 and S9-R17 a number "matches" an inactive part when the two are the same once upper and lower case, hyphens, asterisks, periods and spaces are ignored. A number that also belongs to an active part at this location is not refused.”
- S9-R10: “When a canned job leaves out parts, the system shows one warning listing every part left out: "These parts are inactive and were not added: {part numbers}." The warning stays until the user closes it.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Canned job leaves out a typed vendor part that matches an inactive part
Test case: C425731, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part, set inactive in Setup. [Part-C] = one tracked part, active.
- Data: [Job-1] = a canned job holding [Part-C] and a vendor part typed in by hand as [Typed-1], a number that equals [Part-A] once case, hyphens and periods are ignored.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Vendors, click "New Vendor", type Name (e.g. "ZZAUTOTEST PL CANVEND Vendor"), click "Save & Close". [Vendor-1] = that vendor.
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL CANVEND A), Part Number (e.g. ZZAUTOTEST-PL-CANVEND-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-CANVEND-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL CANVEND A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL CANVEND C), Part Number (e.g. ZZAUTOTEST-PL-CANVEND-03), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-C] = the part number you typed (e.g. ZZAUTOTEST-PL-CANVEND-03); [Desc-C] = the description you typed (e.g. ZZAUTOTEST PL CANVEND C).
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL CANVENDSRC Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-CANVENDSRC-UNIT"); click Create.
- [WO-0] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-0] click "New Line", type Title (e.g. "ZZAUTOTEST PL CANVENDSRC line"), click "Save & Close". [Line-0] = that line. Click "Approve" on [Line-0].
- On [Line-0] open the ⋮ menu, click "Request part", type "zzautotest.pl.canvend.01" in Part Number and press Tab, pick Source "Vendor", Vendor [Vendor-1], Category (e.g. Uncategorized), Cost $8.00, Sell Price $16.00, click "Save Part". [Typed-1] = that typed number.
- On [Line-0] open the line's ⋮ menu, click "Request part", type [Part-C] in Part Number, pick the row that shows "Inventory Qty", set Quantity to 1 and click "Save Part".
- On [Line-0] open the line's ⋮ menu, click "Save as canned line" and save it under the line's title. [Job-1] = that canned job name.
- Go to Work Orders, click "New Work Order", create the customer "ZZAUTOTEST PL CANVEND Customer" and unit "ZZAUTOTEST-PL-CANVEND-UNIT", click Create. [WO-1] = that work order number.
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: the [Job-1] suggestion on New Line shows "Total Parts: 2"; [Part-A] is on the Inactive tab.



========== C425732 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Canned job leaves out the fee that belongs to an inactive part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part with a part fee [Fee-1], set inactive in Setup. [Part-C] = one tracked part with a part fee [Fee-2], active.
- Data: [Job-1] = a canned job holding [Part-A] with [Fee-1] and [Part-C] with [Fee-2].
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [WO-1].
- Click "New Line".
- Type the start of [Job-1] in Title and pick the [Job-1] suggestion.
- Click "Save & Close".
- Read the warning at the bottom right.
--- EXPECTED
Expected results
- Step 4: The new line holds [Part-C] with [Fee-2] ($3.00). Neither [Part-A] nor [Fee-1] ($5.00) is on it.
- Step 5: One warning shows: "These parts are inactive and were not added: [Part-A]. The [Fee-1] fee for [Part-A] was not added." It stays until closed.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R10a, S9-R10, read 8 Oct 2026; design canvas none (board 6.5 shows no fee). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Tech plan "Parts Lifecycle Update — Technical Implementation Plan", 7 Oct 2026 (informs, never overrules), §5 Modified endpoints.
Exact quotes from the source (for reproducibility)
- S9-R10a: “When a part left out carries a fee, the fee is left out too, and the same warning adds "The {fee} fee for {part number} was not added." for each one.”
- PRD §8 User Feedback Summary (Canned job leaves out inactive parts): “"These parts are inactive and were not added: {part numbers}." plus "The {fee} fee for {part number} was not added." for each fee left out”
- Tech plan (Parts Lifecycle Update, 7 Oct 2026), §5 Modified endpoints (apply canned line): “is the full S9-R10/R10a text ("These parts are inactive and were not added: A, B." + one "The {fee} fee for {part number} was not added." per fee)”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Canned job leaves out the fee that belongs to an inactive part
Test case: C425732, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part with a part fee [Fee-1], set inactive in Setup. [Part-C] = one tracked part with a part fee [Fee-2], active.
- Data: [Job-1] = a canned job holding [Part-A] with [Fee-1] and [Part-C] with [Fee-2].
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL CANFEE A), Part Number (e.g. ZZAUTOTEST-PL-CANFEE-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-CANFEE-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL CANFEE A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL CANFEE C), Part Number (e.g. ZZAUTOTEST-PL-CANFEE-03), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-C] = the part number you typed (e.g. ZZAUTOTEST-PL-CANFEE-03); [Desc-C] = the description you typed (e.g. ZZAUTOTEST PL CANFEE C).
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL CANFEESRC Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-CANFEESRC-UNIT"); click Create.
- [WO-0] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-0] click "New Line", type Title (e.g. "ZZAUTOTEST PL CANFEESRC line"), click "Save & Close". [Line-0] = that line. Click "Approve" on [Line-0].
- On [Line-0] open the line's ⋮ menu, click "Request part", type [Part-A] in Part Number, pick the row that shows "Inventory Qty", set Quantity to 1 and click "Save Part".
- On [Line-0] open the line's ⋮ menu, click "Request part", type [Part-C] in Part Number, pick the row that shows "Inventory Qty", set Quantity to 1 and click "Save Part".
- On the [Part-A] row of [Line-0] open its ⋮ menu, click "Add Part Fee / Discount", pick Fee, Name (e.g. "ZZAUTOTEST PL Disposal"), flat amount $5.00, save. [Fee-1] = that fee name.
- On the [Part-C] row open its ⋮ menu, click "Add Part Fee / Discount", pick Fee, Name (e.g. "ZZAUTOTEST PL Shop"), flat amount $3.00, save. [Fee-2] = that fee name.
- On [Line-0] open the line's ⋮ menu, click "Save as canned line" and save it under the line's title. [Job-1] = that canned job name.
- Go to Work Orders, click "New Work Order", create the customer "ZZAUTOTEST PL CANFEE Customer" and unit "ZZAUTOTEST-PL-CANFEE-UNIT", click Create. [WO-1] = that work order number.
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: Settings → Canned Lines → [Job-1] shows both parts with their fees. If the canned job did not keep the part fees, mark the case Blocked with 'canned job has no part fees'.



========== C425733 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Vendor return lookup offers an inactive part with a grey Inactive tag
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part from [Vendor-1], quantity 4, set inactive in Setup. [Part-B] = one tracked part from [Vendor-1], quantity 4, active. Their numbers share the start ZZAUTOTEST-PL-RET-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Go to Parts → Returns and start a new return (the "Create Return" page).
- Pick Vendor [Vendor-1].
- Type "ZZAUTOTEST-PL-RET-0" in the Part Number lookup.
- Pick [Part-A].
- Set Qty To Return to 1, Price Per Unit $10.00 and click "Save Return".
--- EXPECTED
Expected results
- Step 3: Both [Part-A] and [Part-B] are offered. [Part-A] carries a grey "Inactive" tag beside its description; [Part-B] has no tag.
- Step 4: [Part-A] fills the line with [Desc-A] and its stock (4).
- Step 5: The return saves with [Part-A] on it.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R11, S9-R12, read 8 Oct 2026; design canvas board 6.6 (Vendor return: still offered, tagged). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-R12: “In those lookups an inactive part carries a grey "Inactive" tag beside its description.”
- S9-R11: “Part lookup on a vendor return and on a vendor credit includes inactive parts.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Vendor return lookup offers an inactive part with a grey Inactive tag
Test case: C425733, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part from [Vendor-1], quantity 4, set inactive in Setup. [Part-B] = one tracked part from [Vendor-1], quantity 4, active. Their numbers share the start ZZAUTOTEST-PL-RET-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Vendors, click "New Vendor", type Name (e.g. "ZZAUTOTEST PL RET Vendor"), click "Save & Close". [Vendor-1] = that vendor.
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL RET PART A), Part Number (e.g. ZZAUTOTEST-PL-RET-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00), Vendor [Vendor-1]; leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-RET-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL RET PART A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL RET PART B), Part Number (e.g. ZZAUTOTEST-PL-RET-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00), Vendor [Vendor-1]; leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-RET-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL RET PART B).
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [Part-A] is on the Inactive tab and [Part-B] on the Active tab, both with quantity 4.



========== C425734 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Vendor credit lookup offers an inactive part with a grey Inactive tag
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part from [Vendor-1], quantity 4, set inactive in Setup. [Part-B] = one tracked part from [Vendor-1], quantity 4, active. Their numbers share the start ZZAUTOTEST-PL-VCR-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Go to Parts → Vendors and open [Vendor-1].
- Start a new vendor credit for [Vendor-1] (the vendor's credit option).
- Type "ZZAUTOTEST-PL-VCR-0" in the credit's Part Number lookup.
- Pick [Part-A].
- Set quantity 1 and amount $10.00 and save the credit.
--- EXPECTED
Expected results
- Step 3: Both [Part-A] and [Part-B] are offered. [Part-A] carries a grey "Inactive" tag beside its description; [Part-B] has no tag.
- Step 4: [Part-A] fills the line with [Desc-A] and its stock (4).
- Step 5: The credit saves with [Part-A] on it.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R11, S9-R12, read 8 Oct 2026; design canvas none (board 6.6 shows the vendor return lookup, which the vendor credit shares). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-R12: “In those lookups an inactive part carries a grey "Inactive" tag beside its description.”
- S9-R11: “Part lookup on a vendor return and on a vendor credit includes inactive parts.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Vendor credit lookup offers an inactive part with a grey Inactive tag
Test case: C425734, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part from [Vendor-1], quantity 4, set inactive in Setup. [Part-B] = one tracked part from [Vendor-1], quantity 4, active. Their numbers share the start ZZAUTOTEST-PL-VCR-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Vendors, click "New Vendor", type Name (e.g. "ZZAUTOTEST PL VCR Vendor"), click "Save & Close". [Vendor-1] = that vendor.
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL VCR PART A), Part Number (e.g. ZZAUTOTEST-PL-VCR-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00), Vendor [Vendor-1]; leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-VCR-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL VCR PART A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL VCR PART B), Part Number (e.g. ZZAUTOTEST-PL-VCR-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00), Vendor [Vendor-1]; leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-VCR-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL VCR PART B).
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [Part-A] is on the Inactive tab and [Part-B] on the Active tab, both with quantity 4. If no part lookup can be found on a vendor credit, mark the case Blocked with 'vendor credit part lookup not found'.



========== C425735 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Credit on a part sale invoice lists an inactive part with its tag
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] (Sell Price $20.00) and [Part-B] (Sell Price $15.00) = two tracked parts, quantity 4 each, both sold once on the invoice [Inv-1] of a part sale; [Part-A] is set inactive after the invoice.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [PS-1] and its Finance tab.
- Open the invoice's ⋮ menu and click "Issue Credit".
- Tick "Parts are being returned".
- Read the "Parts to return" list.
- Click "Cancel".
--- EXPECTED
Expected results
- Step 4: Both parts are listed: [Part-A] at $20.00 and [Part-B] at $15.00. [Part-A] carries a grey "Inactive" tag right after its part number; [Part-B] has none.
- Step 5: The credit dialog closes with nothing issued.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R13, read 8 Oct 2026; design canvas board 6.7 (Part sale credit: still offered, tagged). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-R13: “A credit on any invoice, from a part sale or a work order, lists the parts sold on the invoice, active or inactive. A part that is now inactive carries the grey "Inactive" tag beside its part number.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Credit on a part sale invoice lists an inactive part with its tag
Test case: C425735, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] (Sell Price $20.00) and [Part-B] (Sell Price $15.00) = two tracked parts, quantity 4 each, both sold once on the invoice [Inv-1] of a part sale; [Part-A] is set inactive after the invoice.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL PSCR PART A), Part Number (e.g. ZZAUTOTEST-PL-PSCR-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-PSCR-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL PSCR PART A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL PSCR PART B), Part Number (e.g. ZZAUTOTEST-PL-PSCR-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $15.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-PSCR-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL PSCR PART B).
- Go to Customers, create a customer named (e.g.) "ZZAUTOTEST PL PSCR Customer" and save it. [Cust-1] = that customer.
- Go to Parts → Part Sales, start a new part sale for [Cust-1]. [PS-1] = the part sale number shown (e.g. P2-89).
- On [PS-1] open the Parts tab, click "Add Part", type [Part-A] in Part Number, pick the inventory row, set Quantity to 1 and click "Save & Close".
- On [PS-1] open the Parts tab, click "Add Part", type [Part-B] in Part Number, pick the inventory row, set Quantity to 1 and click "Save & Close".
- On [PS-1] pick both parts (status "Picked"), then on the Finance tab click "Create Invoice". [Inv-1] = the invoice shown.
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [Inv-1] exists on the part sale with [Part-A] $20.00 and [Part-B] $15.00; [Part-A] is on the Inactive tab.



========== C425736 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Credit on a work order invoice lists an inactive part with its tag
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] (Sell Price $20.00) and [Part-B] (Sell Price $15.00) = two tracked parts, quantity 4 each, both sold once on the invoice [Inv-1] of a work order; [Part-A] is set inactive after the invoice.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [WO-1] and its Finance tab.
- Open the invoice's ⋮ menu and click "Issue Credit".
- Tick "Parts are being returned".
- Read the "Parts to return" list.
- Click "Cancel".
--- EXPECTED
Expected results
- Step 4: Both parts are listed: [Part-A] at $20.00 and [Part-B] at $15.00. [Part-A] carries a grey "Inactive" tag right after its part number; [Part-B] has none.
- Step 5: The credit dialog closes with nothing issued.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R13, read 8 Oct 2026; design canvas board 6.7 (shown on a part sale; the PRD says work order invoices behave the same). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-R13: “A credit on any invoice, from a part sale or a work order, lists the parts sold on the invoice, active or inactive. A part that is now inactive carries the grey "Inactive" tag beside its part number.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Credit on a work order invoice lists an inactive part with its tag
Test case: C425736, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] (Sell Price $20.00) and [Part-B] (Sell Price $15.00) = two tracked parts, quantity 4 each, both sold once on the invoice [Inv-1] of a work order; [Part-A] is set inactive after the invoice.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL WOCR PART A), Part Number (e.g. ZZAUTOTEST-PL-WOCR-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-WOCR-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL WOCR PART A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL WOCR PART B), Part Number (e.g. ZZAUTOTEST-PL-WOCR-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $15.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-WOCR-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL WOCR PART B).
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL WOCR Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-WOCR-UNIT"); click Create.
- [WO-1] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-1] click "New Line", type Title (e.g. "ZZAUTOTEST PL WOCR line"), click "Save & Close". [Line-1] = that line. Click "Approve" on [Line-1].
- On [Line-1] open the line's ⋮ menu, click "Request part", type [Part-A] in Part Number, pick the row that shows "Inventory Qty", set Quantity to 1 and click "Save Part".
- On [Line-1] open the line's ⋮ menu, click "Request part", type [Part-B] in Part Number, pick the row that shows "Inventory Qty", set Quantity to 1 and click "Save Part".
- Pick both parts on [WO-1], mark [Line-1] complete, complete [WO-1] (do the Review if asked), then on the Finance tab click "Create Invoice". [Inv-1] = the invoice shown.
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [Inv-1] exists on the work order with [Part-A] $20.00 and [Part-B] $15.00; [Part-A] is on the Inactive tab.



========== C425737 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Library entry stocked only elsewhere is hidden when it matches an inactive part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Location: [Loc-2] = a second location [Admin] can switch to.
- Data: [Part-A] = a tracked part at [Loc-1], set inactive in Setup. [Num-2] = a part number stocked only at [Loc-2] that equals [Part-A] once case, hyphens and periods are ignored. [Num-3] = a part number stocked only at [Loc-2] that matches nothing at [Loc-1]. All three have the description [Desc-A].
- Data: [WO-1] = an open work order at [Loc-1] with one approved line [Line-1].
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- At [Loc-1] open [WO-1].
- On [Line-1] open the ⋮ menu and click "Request part".
- Type [Desc-A] in Part Number.
- Close the dialog with ×.
--- EXPECTED
Expected results
- Step 3: Neither [Part-A] nor the "Part Library" row for [Num-2] is offered. [Num-3] is still offered as a "Part Library" row.
- Step 4: [Line-1] holds no parts.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R15, read 8 Oct 2026; design canvas boards 6.1 and 6.2 (the Part Library row beside the inventory row). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-R15: “A Part Library entry with no part stocked at this location is not offered in the lookups of S9-R1 to S9-R8 when its number matches an inactive part at this location.”
- PRD Story 9 context note: “in S9-R9a, S9-R15, S9-R16 and S9-R17 a number "matches" an inactive part when the two are the same once upper and lower case, hyphens, asterisks, periods and spaces are ignored. A number that also belongs to an active part at this location is not refused.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Library entry stocked only elsewhere is hidden when it matches an inactive part
Test case: C425737, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Location: [Loc-2] = a second location [Admin] can switch to.
- Data: [Part-A] = a tracked part at [Loc-1], set inactive in Setup. [Num-2] = a part number stocked only at [Loc-2] that equals [Part-A] once case, hyphens and periods are ignored. [Num-3] = a part number stocked only at [Loc-2] that matches nothing at [Loc-1]. All three have the description [Desc-A].
- Data: [WO-1] = an open work order at [Loc-1] with one approved line [Line-1].
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Settings → Locations, add a location (e.g. "ZZAUTOTEST PL LIBMATCH Loc") and save. [Loc-2] = that location.
- Go to Settings → Staff, open [Admin] and make sure [Loc-2] is one of the locations [Admin] can use; save. [Loc-2] now shows in the top-bar location switcher.
- Switch to [Loc-2]. Create two parts with New Inventory Part, both with Description (e.g. ZZAUTOTEST PL LIBMATCH), Category, Cost and Sell Price: Part Number (e.g.) "ZZAUTOTEST.PL.LIBMATCH.01" and Part Number (e.g.) "ZZAUTOTEST-PL-LIBOTHER-01". [Num-2] = the first number, [Num-3] = the second.
- Switch to [Loc-1]. Create [Part-A] with New Inventory Part: Part Number (e.g.) "ZZAUTOTEST-PL-LIBMATCH-01" and the same Description. [Part-A] = that number, [Desc-A] = that description.
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL LIBMATCH Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-LIBMATCH-UNIT"); click Create.
- [WO-1] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-1] click "New Line", type Title (e.g. "ZZAUTOTEST PL LIBMATCH line"), click "Save & Close". [Line-1] = that line. Click "Approve" on [Line-1].
- While [Part-A] is still active, on [Line-1] click ⋮ → "Request part" and type [Desc-A] in Part Number: [Part-A] (with "Inventory Qty"), [Num-2] and [Num-3] (both marked "Part Library") are offered. Close with ×.
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: at [Loc-1] [Part-A] is on the Inactive tab; at [Loc-2] both [Num-2] and [Num-3] are on the Active tab.



========== C425738 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Typing an inactive part number in full shows the inactive message
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part, set inactive in Setup. [WO-1] = an open work order with one approved line [Line-1] and no parts.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [WO-1], on [Line-1] open the ⋮ menu and click "Request part".
- Type [Part-A] in full, all in lower case, in Part Number.
- Clear Part Number and type [Part-A] with spaces in place of the hyphens (e.g. zzautotest pl typed 01).
- Press Tab, pick Source "Vendor", Category (e.g. Uncategorized), Sell Price $5.00 and click "Save Part".
--- EXPECTED
Expected results
- Step 2: The lookup shows "[Part-A] is inactive. Activate it from the Inactive tab to use it." with [Part-A] written as it was saved (capitals and hyphens). No offer to add it as a special order appears.
- Step 3: The same message shows, naming [Part-A].
- Step 4: The part request is not saved and [Line-1] holds no part. If the system answers, it shows the error "[Part-A] is inactive. Activate it from the Inactive tab to use it." with a smaller second line "Please try to resolve this.", fading after about 3 seconds.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R16, S9-R17, read 8 Oct 2026; design canvas board 6.3 (Typing the retired number in full). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-R16: “When the number typed in a part lookup matches an inactive part at this location, the lookup does not offer to add it as a special order. It shows "{part number} is inactive. Activate it from the Inactive tab to use it.", naming the inactive part's number. On technician charge-out, where a typed number is taken straight from the field, the field shows the same message as its error and the line cannot be saved.”
- PRD §8 User Feedback Summary (Retired number typed in a part lookup): “"{part number} is inactive. Activate it from the Inactive tab to use it."”
- PRD §8 User Feedback Summary (Retired number typed in a part lookup): “Shown in the lookup in place of the special order offer; on technician charge-out, error under the field”
- PRD Story 9 context note: “in S9-R9a, S9-R15, S9-R16 and S9-R17 a number "matches" an inactive part when the two are the same once upper and lower case, hyphens, asterisks, periods and spaces are ignored. A number that also belongs to an active part at this location is not refused.”
- S9-R17: “The system refuses an inactive part on new work however it arrives: adding a part to a work order or estimate line, raising a part request or special order, adding a part sale line, and adding a purchase order line or changing its part or number. The refusal reads "{part number} is inactive. Activate it from the Inactive tab to use it."”
- PRD §8 User Feedback Summary (Inactive part reaches new work by another route): “Error toast, fades after 3 seconds”
- PRD §8 context note: “every refusal sent by the system, the rows that fade after 3 seconds, also shows a second, smaller line under the message: "Please try to resolve this."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Typing an inactive part number in full shows the inactive message
Test case: C425738, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part, set inactive in Setup. [WO-1] = an open work order with one approved line [Line-1] and no parts.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL TYPED PART), Part Number (e.g. ZZAUTOTEST-PL-TYPED-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-TYPED-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL TYPED PART).
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL TYPED Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-TYPED-UNIT"); click Create.
- [WO-1] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-1] click "New Line", type Title (e.g. "ZZAUTOTEST PL TYPED line"), click "Save & Close". [Line-1] = that line. Click "Approve" on [Line-1].
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [Part-A] is on the Inactive tab only and [Line-1] holds no parts.



========== C425739 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Saving a part request is refused once the part was retired meanwhile
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part, quantity 4, active at the start (it is set inactive during the steps). The work order to add it to is created in Setup.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- In tab 1: Open [WO-1], on [Line-1] open the ⋮ menu, click "Request part", type [Part-A] in Part Number, pick its "Inventory Qty" row and set Quantity 1. Do not save.
- In tab 2 search [Part-A] on the Active tab, click its row, pick Part Status "Inactive", click Save and click "Deactivate".
- In tab 1 click "Save Part".
- Wait 5 seconds.
--- EXPECTED
Expected results
- Step 2: [Part-A] leaves the Active tab in tab 2.
- Step 3: The save is refused with the error "[Part-A] is inactive. Activate it from the Inactive tab to use it." and a smaller second line "Please try to resolve this."; [Part-A] is not added.
- Step 4: The error has faded on its own (after about 3 seconds).
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R17, read 8 Oct 2026; design canvas none (no board shows this; the message wording is on board 6.3). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-R17: “The system refuses an inactive part on new work however it arrives: adding a part to a work order or estimate line, raising a part request or special order, adding a part sale line, and adding a purchase order line or changing its part or number. The refusal reads "{part number} is inactive. Activate it from the Inactive tab to use it."”
- PRD §8 User Feedback Summary (Inactive part reaches new work by another route): “"{part number} is inactive. Activate it from the Inactive tab to use it."”
- PRD §8 User Feedback Summary (Inactive part reaches new work by another route): “Error toast, fades after 3 seconds”
- PRD §8 context note: “every refusal sent by the system, the rows that fade after 3 seconds, also shows a second, smaller line under the message: "Please try to resolve this."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Saving a part request is refused once the part was retired meanwhile
Test case: C425739, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part, quantity 4, active at the start (it is set inactive during the steps). The work order to add it to is created in Setup.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL TABWO PART), Part Number (e.g. ZZAUTOTEST-PL-TABWO-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-TABWO-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL TABWO PART).
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL TABWO Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-TABWO-UNIT"); click Create.
- [WO-1] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-1] click "New Line", type Title (e.g. "ZZAUTOTEST PL TABWO line"), click "Save & Close". [Line-1] = that line. Click "Approve" on [Line-1].
- Check the setup worked: [Part-A] is on the Active tab and the work order opens. Open a second browser tab on Parts → Inventory (tab 2); keep the work order in tab 1.



========== C425740 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Saving a part sale line is refused once the part was retired meanwhile
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part, quantity 4, active at the start (it is set inactive during the steps). The part sale to add it to is created in Setup.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- In tab 1: Open [PS-1], Parts tab, click "Add Part", type [Part-A], pick its inventory row and set Quantity 1. Do not save.
- In tab 2 search [Part-A] on the Active tab, click its row, pick Part Status "Inactive", click Save and click "Deactivate".
- In tab 1 click "Save & Close".
- Wait 5 seconds.
--- EXPECTED
Expected results
- Step 2: [Part-A] leaves the Active tab in tab 2.
- Step 3: The save is refused with the error "[Part-A] is inactive. Activate it from the Inactive tab to use it." and a smaller second line "Please try to resolve this."; [Part-A] is not added.
- Step 4: The error has faded on its own (after about 3 seconds).
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R17, read 8 Oct 2026; design canvas none (no board shows this; the message wording is on board 6.3). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-R17: “The system refuses an inactive part on new work however it arrives: adding a part to a work order or estimate line, raising a part request or special order, adding a part sale line, and adding a purchase order line or changing its part or number. The refusal reads "{part number} is inactive. Activate it from the Inactive tab to use it."”
- PRD §8 User Feedback Summary (Inactive part reaches new work by another route): “"{part number} is inactive. Activate it from the Inactive tab to use it."”
- PRD §8 User Feedback Summary (Inactive part reaches new work by another route): “Error toast, fades after 3 seconds”
- PRD §8 context note: “every refusal sent by the system, the rows that fade after 3 seconds, also shows a second, smaller line under the message: "Please try to resolve this."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Saving a part sale line is refused once the part was retired meanwhile
Test case: C425740, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part, quantity 4, active at the start (it is set inactive during the steps). The part sale to add it to is created in Setup.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL TABPS PART), Part Number (e.g. ZZAUTOTEST-PL-TABPS-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-TABPS-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL TABPS PART).
- Go to Customers, create a customer named (e.g.) "ZZAUTOTEST PL TABPS Customer" and save it. [Cust-1] = that customer.
- Go to Parts → Part Sales, start a new part sale for [Cust-1]. [PS-1] = the part sale number shown (e.g. P2-89).
- Check the setup worked: [Part-A] is on the Active tab and the part sale opens. Open a second browser tab on Parts → Inventory (tab 2); keep the part sale in tab 1.



========== C425741 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Saving a purchase order line is refused once the part was retired meanwhile
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part, quantity 4, active at the start (it is set inactive during the steps). The purchase order to add it to is created in Setup.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- In tab 1: Open [PO-1], add a new line, type [Part-A] in its Part Number, pick it and set quantity 1. Do not save.
- In tab 2 search [Part-A] on the Active tab, click its row, pick Part Status "Inactive", click Save and click "Deactivate".
- In tab 1 save the new line.
- Wait 5 seconds.
- In tab 1 change the existing line [Vend-1]'s part number to [Part-A] typed in full and save.
--- EXPECTED
Expected results
- Step 2: [Part-A] leaves the Active tab in tab 2.
- Step 3: The save is refused with the error "[Part-A] is inactive. Activate it from the Inactive tab to use it." and a smaller second line "Please try to resolve this."; [Part-A] is not added.
- Step 4: The error has faded on its own (after about 3 seconds).
- Step 5: The change is refused with the same message and the line keeps [Vend-1].
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R17, read 8 Oct 2026; design canvas none (no board shows this; the message wording is on board 6.3). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-R17: “The system refuses an inactive part on new work however it arrives: adding a part to a work order or estimate line, raising a part request or special order, adding a part sale line, and adding a purchase order line or changing its part or number. The refusal reads "{part number} is inactive. Activate it from the Inactive tab to use it."”
- PRD §8 User Feedback Summary (Inactive part reaches new work by another route): “"{part number} is inactive. Activate it from the Inactive tab to use it."”
- PRD §8 User Feedback Summary (Inactive part reaches new work by another route): “Error toast, fades after 3 seconds”
- PRD §8 context note: “every refusal sent by the system, the rows that fade after 3 seconds, also shows a second, smaller line under the message: "Please try to resolve this."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Saving a purchase order line is refused once the part was retired meanwhile
Test case: C425741, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part, quantity 4, active at the start (it is set inactive during the steps). The purchase order to add it to is created in Setup.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL TABPO PART), Part Number (e.g. ZZAUTOTEST-PL-TABPO-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-TABPO-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL TABPO PART).
- Go to Parts → Vendors, click "New Vendor", type Name (e.g. "ZZAUTOTEST PL TABPO Vendor"), click "Save & Close". [Vendor-1] = that vendor.
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL TABPO Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-TABPO-UNIT"); click Create.
- [WO-1] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-1] click "New Line", type Title (e.g. "ZZAUTOTEST PL TABPO line"), click "Save & Close". [Line-1] = that line. Click "Approve" on [Line-1].
- On [Line-1] open the line's ⋮ menu, click "Request part", type a new number in Part Number (e.g. ZZAUTOTEST-PL-TABPO-VEND-01) and press Tab, pick Source "Vendor", Category (e.g. Uncategorized), Vendor [Vendor-1], Cost (e.g. $8.00), Sell Price (e.g. $16.00), click "Save Part". [Vend-1] = that number.
- On [WO-1] open the Parts tab and order [Vend-1] (its "Order" action). Go to Parts → Purchase Orders: a new purchase order for [Vendor-1] holds [Vend-1]. [PO-1] = its number.
- Check the setup worked: [Part-A] is on the Active tab and the purchase order opens. Open a second browser tab on Parts → Inventory (tab 2); keep the purchase order in tab 1.



========== C425742 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Global search lists an inactive part with a grey Inactive tag
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Setting: the organization uses the new global search (the top-bar Search shows results grouped by record type, with badges). The old search cannot run this case.
- Data: [Part-A] = tracked part set inactive in Setup; [Part-B] = tracked part, active; both at [Loc-1], numbers sharing the start ZZAUTOTEST-PL-GSTAG-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Click "Search" in the top bar (or press Ctrl+K).
- Type "ZZAUTOTEST-PL-GSTAG-0".
- Read the parts results.
--- EXPECTED
Expected results
- Step 3: Both [Part-A] and [Part-B] are listed. [Part-A] carries a grey "Inactive" tag; [Part-B] has no tag.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R18, read 8 Oct 2026; design canvas none (no board shows global search). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Tech plan "Parts Lifecycle Update — Technical Implementation Plan", 7 Oct 2026 (informs, never overrules), §6 Phase 7 browser-walk.
Exact quotes from the source (for reproducibility)
- S9-R18: “Global search lists inactive parts at the current location. Each carries the grey "Inactive" tag.”
- Tech plan (Parts Lifecycle Update, 7 Oct 2026), §6 Phase 7 browser-walk: “global search (Search v2 org): the part shows the grey "Inactive" tag; selecting it opens the Inactive tab searched to its number; an untracked part shows "Not Tracked"”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Global search lists an inactive part with a grey Inactive tag
Test case: C425742, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Setting: the organization uses the new global search (the top-bar Search shows results grouped by record type, with badges). The old search cannot run this case.
- Data: [Part-A] = tracked part set inactive in Setup; [Part-B] = tracked part, active; both at [Loc-1], numbers sharing the start ZZAUTOTEST-PL-GSTAG-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL GSTAG A), Part Number (e.g. ZZAUTOTEST-PL-GSTAG-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-GSTAG-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL GSTAG A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL GSTAG B), Part Number (e.g. ZZAUTOTEST-PL-GSTAG-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-GSTAG-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL GSTAG B).
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: typing ZZAUTOTEST-PL-GSTAG-02 in the top-bar Search lists [Part-B] in grouped results. If the search shows the old flat list, mark the case Blocked with 'new global search not on'.



========== C425743 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Selecting an inactive part in global search opens the Inactive tab
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Setting: the organization uses the new global search (the top-bar Search shows results grouped by record type, with badges). The old search cannot run this case.
- Data: [Part-A] = tracked part set inactive in Setup.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Go to Work Orders (any page other than Inventory).
- Click "Search" in the top bar and type [Part-A].
- Click the [Part-A] result.
--- EXPECTED
Expected results
- Step 2: [Part-A] is listed with its grey "Inactive" tag.
- Step 3: Parts → Inventory opens on the Inactive tab (selected), with [Part-A] in the search box and the [Part-A] row listed.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R19, read 8 Oct 2026; design canvas none (no board shows global search). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Tech plan "Parts Lifecycle Update — Technical Implementation Plan", 7 Oct 2026 (informs, never overrules), §6 Phase 7 browser-walk.
Exact quotes from the source (for reproducibility)
- S9-R18: “Global search lists inactive parts at the current location. Each carries the grey "Inactive" tag.”
- S9-R19: “Selecting an inactive part in global search opens the Inventory list on the Inactive tab, searched to its part number.”
- Tech plan (Parts Lifecycle Update, 7 Oct 2026), §6 Phase 7 browser-walk: “global search (Search v2 org): the part shows the grey "Inactive" tag; selecting it opens the Inactive tab searched to its number; an untracked part shows "Not Tracked"”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Selecting an inactive part in global search opens the Inactive tab
Test case: C425743, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Setting: the organization uses the new global search (the top-bar Search shows results grouped by record type, with badges). The old search cannot run this case.
- Data: [Part-A] = tracked part set inactive in Setup.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL GSOPEN PART), Part Number (e.g. ZZAUTOTEST-PL-GSOPEN-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-GSOPEN-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL GSOPEN PART).
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [Part-A] is on the Inactive tab; the top-bar Search shows grouped results (the new search). If not, mark the case Blocked with 'new global search not on'.



========== C425744 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Global search shows Not Tracked for an untracked part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Setting: the organization uses the new global search (the top-bar Search shows results grouped by record type, with badges). The old search cannot run this case.
- Data: [Part-A] = an untracked part (tracking off) with a shelf quantity 4; [Part-B] = a tracked part with quantity 4; numbers sharing the start ZZAUTOTEST-PL-GSNT-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Click "Search" in the top bar.
- Type "ZZAUTOTEST-PL-GSNT-0".
- Read the badge on each part result.
--- EXPECTED
Expected results
- Step 3: [Part-B] shows its stock badge "4 available". [Part-A] shows "Not Tracked" in the place of that badge, with no "available" figure.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-R20, read 8 Oct 2026; design canvas none (no board shows global search). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Tech plan "Parts Lifecycle Update — Technical Implementation Plan", 7 Oct 2026 (informs, never overrules), §6 Phase 7 browser-walk.
Exact quotes from the source (for reproducibility)
- S9-R20: “Global search shows "Not Tracked" for an untracked part, in place of its "{n} available" badge.”
- PRD §8 User Feedback Summary (Untracked part in global search): “"Not Tracked"”
- PRD §8 User Feedback Summary (Untracked part in global search): “In place of the "{n} available" badge”
- Tech plan (Parts Lifecycle Update, 7 Oct 2026), §6 Phase 7 browser-walk: “global search (Search v2 org): the part shows the grey "Inactive" tag; selecting it opens the Inactive tab searched to its number; an untracked part shows "Not Tracked"”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Global search shows Not Tracked for an untracked part
Test case: C425744, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Setting: the organization uses the new global search (the top-bar Search shows results grouped by record type, with badges). The old search cannot run this case.
- Data: [Part-A] = an untracked part (tracking off) with a shelf quantity 4; [Part-B] = a tracked part with quantity 4; numbers sharing the start ZZAUTOTEST-PL-GSNT-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL GSNT A), Part Number (e.g. ZZAUTOTEST-PL-GSNT-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); switch "Track quantities and cost of goods" off; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-GSNT-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL GSNT A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL GSNT B), Part Number (e.g. ZZAUTOTEST-PL-GSNT-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-GSNT-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL GSNT B).
- Check the setup worked: on the Active tab [Part-A] shows "Not Tracked" in Total Qty and [Part-B] shows 4. The top-bar Search shows grouped results (the new search); if not, mark the case Blocked with 'new global search not on'.



========== C425745 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: A user without the View permission sees neither Inventory tab
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- User: [User-B] = a staff member whose custom role [Role-B] has the Parts department on but every 'Part Library & Inventory' box unticked.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- In browser 2 (as [User-B]) open the Parts section from the top bar.
- Look for Inventory in the Parts side menu.
- Type the Inventory page address (the address ending /parts/inventory) in the browser's address bar and press Enter.
--- EXPECTED
Expected results
- Step 2: Inventory is not offered in the Parts side menu.
- Step 3: The Inventory list does not open: neither the Active nor the Inactive tab is shown.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-N2, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-N2: “A user who cannot view the Inventory list sees neither tab.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A user without the View permission sees neither Inventory tab
Test case: C425745, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- User: [User-B] = a staff member whose custom role [Role-B] has the Parts department on but every 'Part Library & Inventory' box unticked.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Settings → Roles & Permissions, click "Create custom role", skip the template, name it (e.g. "ZZAUTOTEST PL NOVIEW"), turn on the Parts department (e.g. Part Sales → View) and leave every 'Part Library & Inventory' box unticked, click Save. [Role-B] = that role.
- Go to Settings → Staff, add a staff member (e.g. first name "ZZAUTOTEST", last name "PL NOVIEW") with an email address you can open, Role [Role-B]; save, open the invite email and set a password. [User-B] = that user.
- Check the setup worked: in browser 2, signed in as [User-B], the top-bar Parts menu opens (e.g. Part Sales).



========== C425746 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Vendor return part search without View shows the access error
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- User: [User-B] = a staff member whose custom role [Role-B] can create vendor returns but has every 'Part Library & Inventory' box unticked.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part from [Vendor-1], quantity 4, set inactive in Setup.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- In browser 2 (as [User-B]) go to Parts → Returns and start a new return ("Create Return").
- Pick Vendor [Vendor-1].
- Type "ZZAUTOTEST-PL-RETNOVIEW" in the Part Number lookup.
--- EXPECTED
Expected results
- Step 3: No parts are listed and the application's standard access error message shows (the same message the application shows for any page or action the user has no access to).
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-N3, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-N3: “Picking parts on a vendor return or a vendor credit needs the 'Part Library & Inventory → View' permission, as it does today. Without it the part search there shows the standard access error.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Vendor return part search without View shows the access error
Test case: C425746, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- User: [User-B] = a staff member whose custom role [Role-B] can create vendor returns but has every 'Part Library & Inventory' box unticked.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part from [Vendor-1], quantity 4, set inactive in Setup.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Vendors, click "New Vendor", type Name (e.g. "ZZAUTOTEST PL RETNOVIEW Vendor"), click "Save & Close". [Vendor-1] = that vendor.
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL RETNOVIEW PART), Part Number (e.g. ZZAUTOTEST-PL-RETNOVIEW-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00), Vendor [Vendor-1]; leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-RETNOVIEW-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL RETNOVIEW PART).
- Go to Settings → Roles & Permissions, click "Create custom role", skip the template, name it (e.g. "ZZAUTOTEST PL RETNOVIEW"), turn on the Parts department with the vendor and returns permissions needed to create a return, and leave every 'Part Library & Inventory' box unticked, click Save. [Role-B] = that role.
- Go to Settings → Staff, add a staff member (e.g. first name "ZZAUTOTEST", last name "PL RETNOVIEW") with an email address you can open, Role [Role-B]; save, open the invite email and set a password. [User-B] = that user.
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: in browser 2, signed in as [User-B], Parts → Returns opens the "Create Return" page. As [Admin], typing ZZAUTOTEST-PL-RETNOVIEW on that page offers [Part-A].



========== C425747 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: A completed part sale line with an inactive part keeps its totals
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [PS-1] = an invoiced part sale holding [Part-A] (2 × $20.00) and [Part-B] (1 × $15.00); [Part-A] set inactive after the invoice.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [PS-1] and read its Parts tab.
- Open the Finance tab and read the invoice's Summary.
--- EXPECTED
Expected results
- Step 1: [Part-A] is still listed: quantity 2, $20.00, $40.00; [Part-B] 1 × $15.00.
- Step 2: The Summary still reads Parts $55.00 ($40.00 + $15.00), unchanged by the deactivation.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-E1, read 8 Oct 2026; design canvas board 6.7 (shows an invoiced part sale). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-E1: “A line that already holds a part when the part becomes inactive stays on its work order, estimate or part sale, including a completed part sale, and its totals keep calculating.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A completed part sale line with an inactive part keeps its totals
Test case: C425747, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [PS-1] = an invoiced part sale holding [Part-A] (2 × $20.00) and [Part-B] (1 × $15.00); [Part-A] set inactive after the invoice.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL PSDONE A), Part Number (e.g. ZZAUTOTEST-PL-PSDONE-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-PSDONE-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL PSDONE A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL PSDONE B), Part Number (e.g. ZZAUTOTEST-PL-PSDONE-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $15.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-PSDONE-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL PSDONE B).
- Go to Customers, create a customer named (e.g.) "ZZAUTOTEST PL PSDONE Customer" and save it. [Cust-1] = that customer.
- Go to Parts → Part Sales, start a new part sale for [Cust-1]. [PS-1] = the part sale number shown (e.g. P2-89).
- On [PS-1] open the Parts tab, click "Add Part", type [Part-A] in Part Number, pick the inventory row, set Quantity to 2 and click "Save & Close".
- On [PS-1] open the Parts tab, click "Add Part", type [Part-B] in Part Number, pick the inventory row, set Quantity to 1 and click "Save & Close".
- Pick both parts on [PS-1], then on the Finance tab click "Create Invoice".
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [PS-1] is invoiced; its Parts figure reads $55.00 (2 × $20.00 + 1 × $15.00 = $40.00 + $15.00); [Part-A] is on the Inactive tab.



========== C425748 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Changing a line to another inactive part is refused
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part on [Line-1] of [WO-1] (added while active), then set inactive. [Part-B] = tracked part, set inactive. [Part-C] = tracked part, active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [WO-1] and open the [Part-A] row on [Line-1].
- Replace the part number with [Part-B] typed in full and save.
- Open the row again, replace the part number with [Part-C] (pick it from the lookup) and save.
--- EXPECTED
Expected results
- Step 2: The change is refused with "[Part-B] is inactive. Activate it from the Inactive tab to use it." and the row still holds [Part-A].
- Step 3: The change saves and the row now holds [Part-C].
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-E2a, S9-R17, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-E2a: “Changing that line to a different part, or typing a different number on it, is new work and follows S9-R17.”
- S9-R17: “The system refuses an inactive part on new work however it arrives: adding a part to a work order or estimate line, raising a part request or special order, adding a part sale line, and adding a purchase order line or changing its part or number. The refusal reads "{part number} is inactive. Activate it from the Inactive tab to use it."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Changing a line to another inactive part is refused
Test case: C425748, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part on [Line-1] of [WO-1] (added while active), then set inactive. [Part-B] = tracked part, set inactive. [Part-C] = tracked part, active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL SWAP A), Part Number (e.g. ZZAUTOTEST-PL-SWAP-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-SWAP-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL SWAP A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL SWAP B), Part Number (e.g. ZZAUTOTEST-PL-SWAP-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-SWAP-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL SWAP B).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL SWAP C), Part Number (e.g. ZZAUTOTEST-PL-SWAP-03), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-C] = the part number you typed (e.g. ZZAUTOTEST-PL-SWAP-03); [Desc-C] = the description you typed (e.g. ZZAUTOTEST PL SWAP C).
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL SWAP Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-SWAP-UNIT"); click Create.
- [WO-1] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-1] click "New Line", type Title (e.g. "ZZAUTOTEST PL SWAP line"), click "Save & Close". [Line-1] = that line. Click "Approve" on [Line-1].
- On [Line-1] open the line's ⋮ menu, click "Request part", type [Part-A] in Part Number, pick the row that shows "Inventory Qty", set Quantity to 1 and click "Save Part".
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Set [Part-B] inactive: on the Active tab search [Part-B], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [Line-1] holds [Part-A]; [Part-A] and [Part-B] are on the Inactive tab, [Part-C] on the Active tab.



========== C425749 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: A work order holding an inactive part can still be invoiced
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [WO-1] = a completed work order ready to invoice, holding [Part-A] (1 × $20.00, picked); [Part-A] set inactive before invoicing.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [WO-1] and its Finance tab.
- Click "Create Invoice".
- Read the invoice.
--- EXPECTED
Expected results
- Step 2: The invoice is created and [WO-1] reads Invoiced.
- Step 3: The invoice lists [Part-A], 1 × $20.00 = $20.00.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-E3, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Tech plan "Parts Lifecycle Update — Technical Implementation Plan", 7 Oct 2026 (informs, never overrules), §5 Modified endpoints.
Exact quotes from the source (for reproducibility)
- S9-E3: “Converting that work order to an invoice succeeds.”
- Tech plan (Parts Lifecycle Update, 7 Oct 2026), §5 Modified endpoints: “Not refused: re-saving the same part (S9-E2), ordering an existing part request (S9-E6), pick, receive, split, invoice”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A work order holding an inactive part can still be invoiced
Test case: C425749, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [WO-1] = a completed work order ready to invoice, holding [Part-A] (1 × $20.00, picked); [Part-A] set inactive before invoicing.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL INVOICE PART), Part Number (e.g. ZZAUTOTEST-PL-INVOICE-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-INVOICE-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL INVOICE PART).
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL INVOICE Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-INVOICE-UNIT"); click Create.
- [WO-1] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-1] click "New Line", type Title (e.g. "ZZAUTOTEST PL INVOICE line"), click "Save & Close". [Line-1] = that line. Click "Approve" on [Line-1].
- On [Line-1] open the line's ⋮ menu, click "Request part", type [Part-A] in Part Number, pick the row that shows "Inventory Qty", set Quantity to 1 and click "Save Part".
- Pick [Part-A] on [WO-1], mark [Line-1] complete and complete [WO-1] (do the Review if asked). Do not invoice yet.
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [WO-1] is complete and its Finance tab shows "Create Invoice"; [Part-A] is on the Inactive tab.



========== C425750 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Reopening a completed work order leaves its inactive part inactive
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [WO-1] = a completed (not invoiced) work order holding [Part-A]; [Part-A] set inactive after completion.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [WO-1] and reopen it (change its status back from Complete).
- Go to Parts → Inventory, Inactive tab, search [Part-A].
- Open the Active tab and search [Part-A].
--- EXPECTED
Expected results
- Step 1: [WO-1] is no longer complete and still shows [Part-A] on [Line-1].
- Step 2: [Part-A] is still listed on the Inactive tab.
- Step 3: [Part-A] is not on the Active tab.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-E5, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-E5: “Reopening a completed work order does not make any part on it active.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Reopening a completed work order leaves its inactive part inactive
Test case: C425750, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [WO-1] = a completed (not invoiced) work order holding [Part-A]; [Part-A] set inactive after completion.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL REOPEN PART), Part Number (e.g. ZZAUTOTEST-PL-REOPEN-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-REOPEN-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL REOPEN PART).
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL REOPEN Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-REOPEN-UNIT"); click Create.
- [WO-1] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-1] click "New Line", type Title (e.g. "ZZAUTOTEST PL REOPEN line"), click "Save & Close". [Line-1] = that line. Click "Approve" on [Line-1].
- On [Line-1] open the line's ⋮ menu, click "Request part", type [Part-A] in Part Number, pick the row that shows "Inventory Qty", set Quantity to 1 and click "Save Part".
- Pick [Part-A], mark [Line-1] complete and complete [WO-1]. Do not invoice.
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [WO-1] reads Complete and [Part-A] is on the Inactive tab.



========== C425751 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: A part retired while on order can still be received and picked
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part requested twice on [Line-1] of [WO-1] from [Vendor-1]: [Req-1] already ordered on [PO-1], [Req-2] not yet ordered. [Part-A] is set inactive after that.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- On [WO-1]'s Parts tab order [Req-2] (its "Order" action).
- Open [PO-1] and click "Receive"; type an invoice number (e.g. ZZAUTOTEST-PL-ONORDER-INV), the delivered quantity 1, Cost $10.00, Sell $20.00; click "Receive".
- Back on [WO-1]'s Parts tab, pick the received [Part-A].
--- EXPECTED
Expected results
- Step 1: [Req-2] is ordered (it shows on a purchase order); no inactive-part refusal appears.
- Step 2: The delivery is received with [Part-A].
- Step 3: [Part-A] is picked onto [WO-1] (status "Picked").
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-E6, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Tech plan "Parts Lifecycle Update — Technical Implementation Plan", 7 Oct 2026 (informs, never overrules), §5 Modified endpoints.
Exact quotes from the source (for reproducibility)
- S9-E6: “A part that becomes inactive while it is on an open purchase order or a special order can still be received, and picked onto the work order that ordered it. Ordering an existing part request is not new work.”
- Tech plan (Parts Lifecycle Update, 7 Oct 2026), §5 Modified endpoints: “Not refused: re-saving the same part (S9-E2), ordering an existing part request (S9-E6), pick, receive, split, invoice”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A part retired while on order can still be received and picked
Test case: C425751, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part requested twice on [Line-1] of [WO-1] from [Vendor-1]: [Req-1] already ordered on [PO-1], [Req-2] not yet ordered. [Part-A] is set inactive after that.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Vendors, click "New Vendor", type Name (e.g. "ZZAUTOTEST PL ONORDER Vendor"), click "Save & Close". [Vendor-1] = that vendor.
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL ONORDER PART), Part Number (e.g. ZZAUTOTEST-PL-ONORDER-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00), Vendor [Vendor-1]; leave "Track quantities and cost of goods" on; set the default bin's Quantity to 0; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-ONORDER-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL ONORDER PART).
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL ONORDER Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-ONORDER-UNIT"); click Create.
- [WO-1] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-1] click "New Line", type Title (e.g. "ZZAUTOTEST PL ONORDER line"), click "Save & Close". [Line-1] = that line. Click "Approve" on [Line-1].
- On [Line-1] click ⋮ → "Request part", pick [Part-A], set Source "Vendor", Vendor [Vendor-1], Quantity 1, click "Save Part". [Req-1] = this request. Repeat once more: [Req-2] = the second request.
- On [WO-1]'s Parts tab order [Req-1] (its "Order" action). [PO-1] = the purchase order now listed under Parts → Purchase Orders.
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [PO-1] holds [Part-A] not yet received; [Req-2] is still a request; [Part-A] is on the Inactive tab.



========== C425752 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Splitting a work order moves a line that holds an inactive part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [WO-1] with two approved lines: [Line-1] (no parts) and [Line-2] holding [Part-A]; [Part-A] set inactive after it was added.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [WO-1] and tick the checkbox of [Line-2].
- Open the bulk-action menu and click "Split work order"; confirm.
- Open the new work order. [WO-2] = its number.
--- EXPECTED
Expected results
- Step 2: The split completes without an inactive-part refusal.
- Step 3: [WO-2] holds [Line-2] with [Part-A]; [WO-1] keeps [Line-1] only.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-E7, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Tech plan "Parts Lifecycle Update — Technical Implementation Plan", 7 Oct 2026 (informs, never overrules), §5 Modified endpoints.
Exact quotes from the source (for reproducibility)
- S9-E7: “Splitting a work order moves its existing lines, including lines that hold an inactive part.”
- Tech plan (Parts Lifecycle Update, 7 Oct 2026), §5 Modified endpoints: “Not refused: re-saving the same part (S9-E2), ordering an existing part request (S9-E6), pick, receive, split, invoice”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Splitting a work order moves a line that holds an inactive part
Test case: C425752, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [WO-1] with two approved lines: [Line-1] (no parts) and [Line-2] holding [Part-A]; [Part-A] set inactive after it was added.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL SPLIT PART), Part Number (e.g. ZZAUTOTEST-PL-SPLIT-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-SPLIT-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL SPLIT PART).
- Go to Work Orders, click "New Work Order"; in Customer click Add and create a customer (e.g. "ZZAUTOTEST PL SPLIT Customer"); in Asset click Add and create a unit (e.g. "ZZAUTOTEST-PL-SPLIT-UNIT"); click Create.
- [WO-1] = the work order number shown at the top left (e.g. S2-1234).
- On [WO-1] click "New Line", type Title (e.g. "ZZAUTOTEST PL SPLIT line"), click "Save & Close". [Line-1] = that line. Click "Approve" on [Line-1].
- On [WO-1] click "New Line", Title (e.g. "ZZAUTOTEST PL SPLIT line 2"), "Save & Close", then "Approve". [Line-2] = that line.
- On [Line-2] open the line's ⋮ menu, click "Request part", type [Part-A] in Part Number, pick the row that shows "Inventory Qty", set Quantity to 1 and click "Save Part".
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [WO-1] has [Line-1] and [Line-2]; [Line-2] holds [Part-A]; [Part-A] is on the Inactive tab.



========== C425753 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Parts import updates an inactive part in place and keeps it inactive
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, Sell Price $20.00, set inactive. [CSV-1] = a parts import file with one row for [Part-A] whose Sell Price is 25.00.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Go to Settings → Data Import → Inventory, upload [CSV-1] and run the import.
- Go to Parts → Inventory, Active tab, search [Part-A].
- Click the Inactive tab and search [Part-A].
- Open the [Part-A] row.
--- EXPECTED
Expected results
- Step 1: The import finishes without errors.
- Step 2: [Part-A] is not on the Active tab.
- Step 3: [Part-A] is listed once (one row, no second copy).
- Step 4: Sell Price reads $25.00 and the title row pill reads "Inactive".
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-E8, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Tech plan "Parts Lifecycle Update — Technical Implementation Plan", 7 Oct 2026 (informs, never overrules), §6 Phase 7.
Exact quotes from the source (for reproducibility)
- S9-E8: “The parts CSV import updates an inactive part in place and never makes it active.”
- Tech plan (Parts Lifecycle Update, 7 Oct 2026), §6 Phase 7, Not refused: “CSV import (S9-E8; the importer never writes the column)”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Parts import updates an inactive part in place and keeps it inactive
Test case: C425753, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, Sell Price $20.00, set inactive. [CSV-1] = a parts import file with one row for [Part-A] whose Sell Price is 25.00.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL IMPINACT PART), Part Number (e.g. ZZAUTOTEST-PL-IMPINACT-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-IMPINACT-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL IMPINACT PART).
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Go to Settings → Data Import → Inventory and download the import template. Fill one row for [Part-A] with its Part Number, Description, Category, Cost 10.00, Sell Price 25.00 and the same bin and quantity; save it as a CSV file. [CSV-1] = that file.
- Check the setup worked: [Part-A] is on the Inactive tab with Sell Price $20.00; [CSV-1] has exactly one data row.



========== C425754 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Parts import with a blank Manufacturer keeps the part's manufacturer
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part with a manufacturer [Mfr-1] and Sell Price $20.00. [CSV-1] = an import file with one row for [Part-A], Manufacturer cell blank, Sell Price 26.00.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Go to Settings → Data Import → Inventory, upload [CSV-1] and run the import.
- Open [Part-A] on Parts → Inventory.
--- EXPECTED
Expected results
- Step 1: The import finishes without errors.
- Step 2: Manufacturer still reads [Mfr-1]; Sell Price reads $26.00 (the import did run).
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-E8a, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-E8a: “In the parts CSV import, a blank Manufacturer cell keeps the entry's manufacturer.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Parts import with a blank Manufacturer keeps the part's manufacturer
Test case: C425754, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part with a manufacturer [Mfr-1] and Sell Price $20.00. [CSV-1] = an import file with one row for [Part-A], Manufacturer cell blank, Sell Price 26.00.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL IMPMFR PART), Part Number (e.g. ZZAUTOTEST-PL-IMPMFR-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00), Manufacturer (pick the first manufacturer offered); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-IMPMFR-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL IMPMFR PART).
- [Mfr-1] = the manufacturer you picked.
- Go to Settings → Data Import → Inventory and download the import template. Fill one row for [Part-A] with Part Number, Description, Category, Cost 10.00, Sell Price 26.00 and leave the Manufacturer cell empty; save as CSV. [CSV-1] = that file.
- Check the setup worked: [Part-A]'s dialog shows Manufacturer [Mfr-1]; the Manufacturer cell of [CSV-1] is empty.



========== C425756 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Inventory Value report still lists a part after it is set inactive
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, quantity 4, Cost $12.50 (stock value 4 × $12.50 = $50.00), set inactive during Setup after the report was read once.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Go to Reports → Inventory Value for today at [Loc-1].
- Search [Part-A].
- Clear the search and read the report total.
--- EXPECTED
Expected results
- Step 2: [Part-A] is listed with quantity 4 and value $50.00 (4 × $12.50).
- Step 3: The total equals [IV-1] (difference $0.00). If someone else changed stock at [Loc-1] meanwhile, compare the [Part-A] row only and say so in the result comment.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-E11, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-E11: “Reports keep inactive parts. Inventory Value, Parts Velocity and the dashboard include them, because their stock still has value and their history still happened.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Inventory Value report still lists a part after it is set inactive
Test case: C425756, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, quantity 4, Cost $12.50 (stock value 4 × $12.50 = $50.00), set inactive during Setup after the report was read once.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL IVKEEP PART), Part Number (e.g. ZZAUTOTEST-PL-IVKEEP-01), Category (e.g. Uncategorized), Cost (e.g. $12.50), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-IVKEEP-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL IVKEEP PART).
- Go to Reports → Inventory Value for today at [Loc-1], search [Part-A]: it shows quantity 4 and value $50.00. Clear the search. [IV-1] = the report total shown.
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [Part-A] is on the Inactive tab and [IV-1] is written down.



========== C425757 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Parts Velocity report still lists an inactive part's sales
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part sold 2 times on an invoiced part sale [PS-1] today, then set inactive.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Go to Reports → Parts Velocity with the same range.
- Search [Part-A].
--- EXPECTED
Expected results
- Step 2: [Part-A] is listed and its figures equal [PV-1] (quantity 2).
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-E11, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-E11: “Reports keep inactive parts. Inventory Value, Parts Velocity and the dashboard include them, because their stock still has value and their history still happened.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Parts Velocity report still lists an inactive part's sales
Test case: C425757, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part sold 2 times on an invoiced part sale [PS-1] today, then set inactive.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL PVKEEP PART), Part Number (e.g. ZZAUTOTEST-PL-PVKEEP-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-PVKEEP-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL PVKEEP PART).
- Go to Customers, create a customer named (e.g.) "ZZAUTOTEST PL PVKEEP Customer" and save it. [Cust-1] = that customer.
- Go to Parts → Part Sales, start a new part sale for [Cust-1]. [PS-1] = the part sale number shown (e.g. P2-89).
- On [PS-1] open the Parts tab, click "Add Part", type [Part-A] in Part Number, pick the inventory row, set Quantity to 2 and click "Save & Close".
- Pick [Part-A] on [PS-1] and click "Create Invoice" on its Finance tab.
- Go to Reports → Parts Velocity for a range that includes today, search [Part-A]. [PV-1] = the figures on its row (e.g. quantity 2).
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [PV-1] is written down and [Part-A] is on the Inactive tab.



========== C425758 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Dashboard inventory figure does not change when a part is set inactive
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, quantity 4, Cost $12.50 ($50.00 of stock), set inactive between two readings of the dashboard.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- On the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Open the Dashboard again and read the inventory value figure.
--- EXPECTED
Expected results
- Step 1: [Part-A] moves to the Inactive tab.
- Step 2: The figure equals [Dash-1] (difference $0.00): the $50.00 of [Part-A]'s stock still counts. If someone else changed stock at [Loc-1] meanwhile, say so in the result comment.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-E11, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-E11: “Reports keep inactive parts. Inventory Value, Parts Velocity and the dashboard include them, because their stock still has value and their history still happened.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Dashboard inventory figure does not change when a part is set inactive
Test case: C425758, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, quantity 4, Cost $12.50 ($50.00 of stock), set inactive between two readings of the dashboard.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL DASHKEEP PART), Part Number (e.g. ZZAUTOTEST-PL-DASHKEEP-01), Category (e.g. Uncategorized), Cost (e.g. $12.50), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-DASHKEEP-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL DASHKEEP PART).
- Open the Dashboard and read its inventory value figure at [Loc-1]. [Dash-1] = that figure.
- Check the setup worked: [Dash-1] is written down and [Part-A] is still on the Active tab.



========== C425759 · section 20476 (S9 Inactive parts cannot be selected)
TITLE: Dashboard Critical Reorder list leaves out an inactive part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] and [Part-B] = tracked parts, quantity 1, Min 5, Max 10 (both below Min). [Part-A] is set inactive in the steps; [Part-B] stays active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- On the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Open the Dashboard and read the Critical Reorder list.
--- EXPECTED
Expected results
- Step 1: [Part-A] moves to the Inactive tab.
- Step 2: [Part-A] is no longer in Critical Reorder; [Part-B] still is.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-E12, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-E12: “The dashboard's Critical Reorder list leaves out inactive parts.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Dashboard Critical Reorder list leaves out an inactive part
Test case: C425759, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] and [Part-B] = tracked parts, quantity 1, Min 5, Max 10 (both below Min). [Part-A] is set inactive in the steps; [Part-B] stays active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL REORDER A), Part Number (e.g. ZZAUTOTEST-PL-REORDER-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00), Min (e.g. 5) and Max (e.g. 10); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 1; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-REORDER-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL REORDER A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL REORDER B), Part Number (e.g. ZZAUTOTEST-PL-REORDER-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00), Min (e.g. 5) and Max (e.g. 10); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 1; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-REORDER-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL REORDER B).
- Check the setup worked: the Dashboard's Critical Reorder list shows both [Part-A] and [Part-B] (1 on hand, Min 5).



========== C154789 · section 20477 (S10 Confirming & recording a status change)
TITLE: Saving a different Part Status asks to confirm first
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- On the Active tab search [Part-A] and click its row.
- Pick Part Status "Inactive".
- Click Save.
- Read the dialog that opens.
- Click "Cancel" in that dialog, then Cancel in the part dialog.
--- EXPECTED
Expected results
- Step 2: Nothing is applied yet: the title row pill still reads green "Active".
- Step 3: Before anything changes, a confirmation titled "Deactivate part?" opens on top of the part dialog.
- Step 4: It is the application's standard confirmation: a title, message lines, a "Note (Optional)" field, "Cancel" and a red "Deactivate" button. There is no word to type to confirm.
- Step 5: [Part-A] is still on the Active tab.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R1, S10-R2, read 8 Oct 2026; design canvas boards 3.2 (Inactive picked) and 3.3 (Save asks first). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R1: “A status change is confirmed before it is applied, from either entry point: the bulk bar (Stories 2 and 3), or Save in the part dialog after the user picks a different Part Status (S13-R21).”
- S10-R2: “The confirmation is the application's standard confirmation dialog. There is no confirmation word to type.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Saving a different Part Status asks to confirm first
Test case: C154789, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL ASKFIRST PART), Part Number (e.g. ZZAUTOTEST-PL-ASKFIRST-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-ASKFIRST-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL ASKFIRST PART).
- Check the setup worked: [Part-A] is on the Active tab.



========== C154790 · section 20477 (S10 Confirming & recording a status change)
TITLE: Bulk change that partly fails lists the failed part and its reason
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B] = tracked parts, active, numbers sharing the start ZZAUTOTEST-PL-PARTFAIL-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- In tab 1, Active tab, search "ZZAUTOTEST-PL-PARTFAIL-0".
- Open the ⋮ actions menu and click "Deactivate parts".
- Tick [Part-A] and [Part-B].
- In tab 2 open [Part-B], pick Part Status "Inactive", Save and click "Deactivate".
- In tab 1 click "Deactivate" in the bulk bar, then "Deactivate" in the confirmation.
- Read the message at the bottom right and wait 10 seconds.
--- EXPECTED
Expected results
- Step 5: [Part-A] leaves the Active tab; the bulk mode stays on with only [Part-B] ticked (2 ticked = 1 changed + 1 failed).
- Step 6: An error message reads "1 part updated, 1 could not be changed." and lists [Part-B] by its part number with the reason "Part is already in that state." It is still there after 10 seconds (it stays until closed).
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R12, S10-R13, S10-R13a, read 8 Oct 2026; design canvas none (board 4.5 shows the all-changed result only). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Jira verification ticket SV-11040 (Phase 3 checklist), read 8 Oct 2026.
Exact quotes from the source (for reproducibility)
- S10-R12: “After a bulk change, the system shows how many parts changed and how many failed.”
- PRD §8 User Feedback Summary (Bulk change, some parts failed): “"{n} parts updated, {m} could not be changed." ("1 part updated, {m} could not be changed." for one)”
- PRD §8 User Feedback Summary (Bulk change, some parts failed): “Error toast, stays until closed, lists each failed part and its reason”
- S10-R13: “For each part that failed, the system names the part by its number and gives the reason.”
- S10-R13a: “The reasons are "A core follows its part. Activate or deactivate the part instead.", "Part not found." and "Part is already in that state."”
- PRD §8 User Feedback Summary (A part already in the requested state): “"Part is already in that state."”
- SV-11040 verification checklist: “Partial failure (one part changed in another tab first) → "1 part updated, 1 could not be changed." listing the reason; only the failed part stays ticked (S2-R15, S10-N2)”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Bulk change that partly fails lists the failed part and its reason
Test case: C154790, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B] = tracked parts, active, numbers sharing the start ZZAUTOTEST-PL-PARTFAIL-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL PARTFAIL A), Part Number (e.g. ZZAUTOTEST-PL-PARTFAIL-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-PARTFAIL-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL PARTFAIL A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL PARTFAIL B), Part Number (e.g. ZZAUTOTEST-PL-PARTFAIL-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-PARTFAIL-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL PARTFAIL B).
- Check the setup worked: the Active tab search ZZAUTOTEST-PL-PARTFAIL-0 lists [Part-A] and [Part-B]. Open a second browser tab on Parts → Inventory (tab 2).



========== C154791 · section 20477 (S10 Confirming & recording a status change)
TITLE: A status change records who made it and when
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Write down the date and time on your computer clock. [T-1] = that time.
- On the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- On the Inactive tab click the clock icon ("Part History") on [Part-A]'s row.
- Read the newest entry.
--- EXPECTED
Expected results
- Step 4: The newest entry reads "Deactivated", Staff [Staff-1], Date today, Time [T-1] or a minute or two later.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R14, read 8 Oct 2026; design canvas board 3.8 (Finding it in Part History). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R14: “Every status change records the user who made it, and the date and time.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A status change records who made it and when
Test case: C154791, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL WHOWHEN PART), Part Number (e.g. ZZAUTOTEST-PL-WHOWHEN-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-WHOWHEN-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL WHOWHEN PART).
- [Staff-1] = [Admin]'s name as Part History shows it (e.g. the name on your profile).
- Check the setup worked: [Part-A] is on the Active tab and has no Deactivated entry in Part History (clock icon).



========== C154792 · section 20477 (S10 Confirming & recording a status change)
TITLE: Deactivating then reactivating keeps two Part History entries
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- On the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, type the note "ZZAUTOTEST retired once" and click "Deactivate" in the "Deactivate part?" confirmation.
- On the Inactive tab click [Part-A]'s row, pick Part Status "Active", click Save, type the note "ZZAUTOTEST back again" and click "Activate".
- Open [Part-A]'s Part History (clock icon).
--- EXPECTED
Expected results
- Step 1: [Part-A] moves to the Inactive tab.
- Step 2: [Part-A] moves back to the Active tab.
- Step 3: Two separate entries show, newest first: "Activated | Reason: ZZAUTOTEST back again" and "Deactivated | Reason: ZZAUTOTEST retired once" (2 changes = 2 entries, each with its own note).
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R16, read 8 Oct 2026; design canvas board 3.8. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R16: “Every status change is written to the part's Part History as its own entry. A part deactivated and later reactivated keeps both entries, each with its own note.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Deactivating then reactivating keeps two Part History entries
Test case: C154792, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL TWOENT PART), Part Number (e.g. ZZAUTOTEST-PL-TWOENT-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-TWOENT-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL TWOENT PART).
- Check the setup worked: [Part-A] is on the Active tab.



========== C154793 · section 20477 (S10 Confirming & recording a status change)
TITLE: Part History entry wording with and without a note
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B] = tracked parts, active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- On the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, type the note "ZZAUTOTEST worn out" and click "Deactivate" in the "Deactivate part?" confirmation.
- On the Active tab search [Part-B], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- On the Inactive tab open [Part-B], pick "Active", Save, leave the note empty and click "Activate".
- On the Inactive tab open [Part-A], pick "Active", Save, type the note "ZZAUTOTEST restocked" and click "Activate".
- Open [Part-A]'s Part History and read its two newest entries.
- Open [Part-B]'s Part History and read its two newest entries.
--- EXPECTED
Expected results
- Step 5: [Part-A] shows "Activated | Reason: ZZAUTOTEST restocked" and "Deactivated | Reason: ZZAUTOTEST worn out".
- Step 6: [Part-B] shows "Activated" and "Deactivated", each with nothing after it (no "| Reason:").
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R17, read 8 Oct 2026; design canvas board 3.8 (Deactivated | Reason: …). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R17: “The entry reads "Deactivated" or "Activated". When the user gave a note it reads "Deactivated | Reason: {note}" or "Activated | Reason: {note}". With no note it reads "Deactivated" or "Activated" and nothing more.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Part History entry wording with and without a note
Test case: C154793, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B] = tracked parts, active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL WORDING A), Part Number (e.g. ZZAUTOTEST-PL-WORDING-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-WORDING-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL WORDING A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL WORDING B), Part Number (e.g. ZZAUTOTEST-PL-WORDING-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-WORDING-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL WORDING B).
- Check the setup worked: both parts are on the Active tab.



========== C154794 · section 20477 (S10 Confirming & recording a status change)
TITLE: Bulk confirmation title and first line give the count
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B] = tracked parts, active; [Part-C] = tracked part, set inactive in Setup. Numbers share the start ZZAUTOTEST-PL-BTITLE-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- On the Active tab search "ZZAUTOTEST-PL-BTITLE-0", open the ⋮ menu and click "Deactivate parts".
- Tick [Part-A] and [Part-B], click "Deactivate" in the bulk bar and read the dialog.
- Click "Cancel", untick [Part-B], click "Deactivate" and read the dialog.
- Click "Cancel", click × on the bulk bar, open the Inactive tab, search "ZZAUTOTEST-PL-BTITLE-0", open ⋮ and click "Activate parts".
- Tick [Part-C], click "Activate" in the bulk bar and read the dialog, then click "Cancel".
--- EXPECTED
Expected results
- Step 2: The confirmation opens before anything changes, titled "Deactivate parts?", first line "2 parts selected."
- Step 3: Titled "Deactivate parts?", first line "1 part selected."
- Step 4: The mode on the Active tab ends and the Inactive tab's bulk mode starts.
- Step 5: Titled "Activate parts?", first line "1 part selected." No part changed status.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R1, S10-R3, S10-R4, read 8 Oct 2026; design canvas boards 4.4 (Confirm) and 4.7 (Confirm the reactivation). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R3: “Raised from the bulk bar, the confirmation is titled "Deactivate parts?" or "Activate parts?". Raised from the part dialog, it is titled "Deactivate part?" or "Activate part?".”
- S10-R4: “Raised from the bulk bar, the confirmation opens with "{n} parts selected.", or "1 part selected." for one. Raised from the part dialog, it opens with the part number followed by the description, as they stand in the form, with spaces before and after removed.”
- S10-R1: “A status change is confirmed before it is applied, from either entry point: the bulk bar (Stories 2 and 3), or Save in the part dialog after the user picks a different Part Status (S13-R21).”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Bulk confirmation title and first line give the count
Test case: C154794, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B] = tracked parts, active; [Part-C] = tracked part, set inactive in Setup. Numbers share the start ZZAUTOTEST-PL-BTITLE-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL BTITLE A), Part Number (e.g. ZZAUTOTEST-PL-BTITLE-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-BTITLE-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL BTITLE A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL BTITLE B), Part Number (e.g. ZZAUTOTEST-PL-BTITLE-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-BTITLE-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL BTITLE B).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL BTITLE C), Part Number (e.g. ZZAUTOTEST-PL-BTITLE-03), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-C] = the part number you typed (e.g. ZZAUTOTEST-PL-BTITLE-03); [Desc-C] = the description you typed (e.g. ZZAUTOTEST PL BTITLE C).
- Set [Part-C] inactive: on the Active tab search [Part-C], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [Part-A], [Part-B] on the Active tab; [Part-C] on the Inactive tab.



========== C154795 · section 20477 (S10 Confirming & recording a status change)
TITLE: Bulk deactivation confirmation shows its three lines in order
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B] = tracked parts, active, numbers sharing the start ZZAUTOTEST-PL-BLINES-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- On the Active tab search "ZZAUTOTEST-PL-BLINES-0", open ⋮ and click "Deactivate parts".
- Tick [Part-A] and [Part-B] and click "Deactivate" in the bulk bar.
- Read the lines under "2 parts selected."
- Click "Cancel", untick [Part-B] and click "Deactivate" again.
- Read the lines, then click "Cancel".
--- EXPECTED
Expected results
- Step 3: In this order: "These parts won't show up when adding parts to work orders, estimates, part sales or purchase orders.", "Existing records that use them stay as they are.", "Stock, cost of goods and QuickBooks aren't affected."
- Step 5: With one part ticked: "This part won't show up when adding parts to work orders, estimates, part sales or purchase orders.", "Existing records that use it stay as they are.", "Stock, cost of goods and QuickBooks aren't affected."
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R5, read 8 Oct 2026; design canvas board 4.4 (Confirm). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R5: “For a deactivation from the bulk bar, the confirmation then states, in this order: "These parts won't show up when adding parts to work orders, estimates, part sales or purchase orders.", "Existing records that use them stay as they are.", and "Stock, cost of goods and QuickBooks aren't affected." With exactly one part ticked, the lines read "This part won't show up ..." and "Existing records that use it stay as they are."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Bulk deactivation confirmation shows its three lines in order
Test case: C154795, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B] = tracked parts, active, numbers sharing the start ZZAUTOTEST-PL-BLINES-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL BLINES A), Part Number (e.g. ZZAUTOTEST-PL-BLINES-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-BLINES-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL BLINES A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL BLINES B), Part Number (e.g. ZZAUTOTEST-PL-BLINES-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-BLINES-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL BLINES B).
- Check the setup worked: both parts are on the Active tab.



========== C154796 · section 20477 (S10 Confirming & recording a status change)
TITLE: Reactivation confirmation from the part dialog has one line
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, set inactive in Setup.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- On the Inactive tab search [Part-A] and click its row.
- Pick Part Status "Active" and click Save.
- Read the confirmation.
- Click "Cancel".
--- EXPECTED
Expected results
- Step 3: Titled "Activate part?", it shows "[Part-A] [Desc-A]", then "This part can be added to new work again." and nothing more (no "Existing records…" line, no "Stock, cost of goods…" line), then the "Note (Optional)" field.
- Step 4: [Part-A] stays on the Inactive tab.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R7, read 8 Oct 2026; design canvas board 3.7 (Bringing it back). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R7: “For a reactivation from the part dialog, the confirmation states "This part can be added to new work again." and nothing more.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Reactivation confirmation from the part dialog has one line
Test case: C154796, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, set inactive in Setup.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL REACT1 PART), Part Number (e.g. ZZAUTOTEST-PL-REACT1-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-REACT1-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL REACT1 PART).
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [Part-A] is on the Inactive tab.



========== C154797 · section 20477 (S10 Confirming & recording a status change)
TITLE: Confirmation note field is labelled Note (Optional) and stops at 255
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active. [Note-300] = the text 1234567890 typed 30 times (300 characters).
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [Part-A], pick Part Status "Inactive" and click Save.
- Read the label of the note field.
- Paste [Note-300] into the note field.
- Read the end of the note field.
- Click "Deactivate", then open [Part-A]'s Part History.
--- EXPECTED
Expected results
- Step 2: The field is labelled "Note (Optional)".
- Step 3: The field stops accepting characters at 255.
- Step 4: It ends with 25 full blocks of 1234567890 and then "12345" (25 × 10 + 5 = 255 characters).
- Step 5: The entry reads "Deactivated | Reason: " followed by those 255 characters, ending "12345". A note over 255 characters cannot be sent from this screen, so the refusal "A note cannot be longer than 255 characters." (error toast, fades after 3 seconds) cannot be checked by hand: write 'not checked by hand' for it in the result comment.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R10, S10-N3, read 8 Oct 2026; design canvas boards 3.3 and 4.4 (the Note (Optional) field). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R10: “The confirmation has a note field labelled "Note (Optional)". It stops accepting input at 255 characters.”
- S10-N3: “If a note longer than 255 characters reaches the system by any route, the change is refused with "A note cannot be longer than 255 characters."”
- PRD §8 User Feedback Summary (Note longer than 255 characters): “"A note cannot be longer than 255 characters."”
- PRD §8 User Feedback Summary (Note longer than 255 characters): “Error toast, fades after 3 seconds”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Confirmation note field is labelled Note (Optional) and stops at 255
Test case: C154797, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active. [Note-300] = the text 1234567890 typed 30 times (300 characters).
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL NOTE255 PART), Part Number (e.g. ZZAUTOTEST-PL-NOTE255-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-NOTE255-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL NOTE255 PART).
- Check the setup worked: [Part-A] is on the Active tab; [Note-300] is 30 blocks of 1234567890 (30 × 10 = 300 characters), e.g. in a text editor.



========== C154798 · section 20477 (S10 Confirming & recording a status change)
TITLE: Part History columns keep their width for a short entry
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part whose only status entry is a short "Deactivated". [Part-B] = tracked part with a long "Description updated" entry.
- Browser: the same window size for both pages (do not resize between steps).
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [Part-A]'s Part History and take a screenshot.
- Open [Part-B]'s Part History and take a screenshot.
- Compare the two screenshots.
--- EXPECTED
Expected results
- Step 1: The short "Deactivated" entry sits in the Event column; Staff, Date and Time are not widened by it.
- Step 3: The Staff, Date and Time columns have the same widths and positions on both pages; only the Event column's text differs.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R21, read 8 Oct 2026; design canvas boards 3.8 and 2.4 (Part History); board 2.6 shows narrower columns with long entries, the PRD wins. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R21: “The Part History table keeps its column layout whatever an entry says. A short entry does not widen the Staff, Date or Time columns.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Part History columns keep their width for a short entry
Test case: C154798, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part whose only status entry is a short "Deactivated". [Part-B] = tracked part with a long "Description updated" entry.
- Browser: the same window size for both pages (do not resize between steps).
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL COLWIDTH A), Part Number (e.g. ZZAUTOTEST-PL-COLWIDTH-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-COLWIDTH-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL COLWIDTH A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL COLWIDTH B), Part Number (e.g. ZZAUTOTEST-PL-COLWIDTH-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-COLWIDTH-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL COLWIDTH B).
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Open [Part-B], replace its Description with a long text (e.g. "ZZAUTOTEST PL COLWIDTH B WITH A VERY LONG DESCRIPTION THAT FILLS THE EVENT COLUMN FROM EDGE TO EDGE") and click Save.
- Check the setup worked: [Part-A]'s Part History shows "Deactivated"; [Part-B]'s shows a long "Description updated | Original description: … | New description: …" entry.



========== C154799 · section 20477 (S10 Confirming & recording a status change)
TITLE: Confirm button is red to deactivate and blue to activate
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active; [Part-B] = tracked part, set inactive. Numbers share the start ZZAUTOTEST-PL-BTNCOL-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [Part-A], pick "Inactive", click Save and look at the confirmation's buttons; click "Cancel" and close the dialog.
- Open [Part-B] on the Inactive tab, pick "Active", click Save and look at the buttons; click "Cancel" and close the dialog.
- On the Active tab turn on "Deactivate parts", tick [Part-A], click "Deactivate" and look at the buttons; click "Cancel" and × on the bar.
- On the Inactive tab turn on "Activate parts", tick [Part-B], click "Activate" and look at the buttons; click "Cancel".
--- EXPECTED
Expected results
- Step 1: A red "Deactivate" button, with "Cancel" to its left.
- Step 2: A blue "Activate" button, with "Cancel" to its left.
- Step 3: A red "Deactivate" button, with "Cancel" to its left.
- Step 4: A blue "Activate" button, with "Cancel" to its left. No part changed status.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R11, read 8 Oct 2026; design canvas boards 3.3, 3.7, 4.4 and 4.7. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R11: “The confirm button reads "Deactivate" in red for a deactivation and "Activate" in blue for a reactivation. Cancel sits to its left.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Confirm button is red to deactivate and blue to activate
Test case: C154799, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active; [Part-B] = tracked part, set inactive. Numbers share the start ZZAUTOTEST-PL-BTNCOL-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL BTNCOL A), Part Number (e.g. ZZAUTOTEST-PL-BTNCOL-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-BTNCOL-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL BTNCOL A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL BTNCOL B), Part Number (e.g. ZZAUTOTEST-PL-BTNCOL-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-BTNCOL-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL BTNCOL B).
- Set [Part-B] inactive: on the Active tab search [Part-B], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [Part-A] on the Active tab, [Part-B] on the Inactive tab.



========== C154800 · section 20477 (S10 Confirming & recording a status change)
TITLE: Cancelling the confirmation changes nothing
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B] = tracked parts, active, numbers sharing the start ZZAUTOTEST-PL-CANCEL-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- On the Active tab search "ZZAUTOTEST-PL-CANCEL-0", turn on "Deactivate parts", tick both parts and click "Deactivate".
- Click "Cancel" in the confirmation, then × on the bulk bar.
- Open [Part-A], pick "Inactive", click Save, then click "Cancel" in the confirmation.
- Click Cancel in the part dialog.
- Open [Part-A]'s and [Part-B]'s Part History.
--- EXPECTED
Expected results
- Step 2: Both parts are still on the Active tab.
- Step 3: The confirmation closes and the part dialog is back with "Inactive" still picked and the pill still "Active".
- Step 4: [Part-A] is still on the Active tab.
- Step 5: Neither part has a "Deactivated" entry.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-N1, read 8 Oct 2026; design canvas boards 3.3 and 4.4. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-N1: “If the user cancels the confirmation, no part changes status.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Cancelling the confirmation changes nothing
Test case: C154800, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B] = tracked parts, active, numbers sharing the start ZZAUTOTEST-PL-CANCEL-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL CANCEL A), Part Number (e.g. ZZAUTOTEST-PL-CANCEL-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-CANCEL-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL CANCEL A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL CANCEL B), Part Number (e.g. ZZAUTOTEST-PL-CANCEL-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-CANCEL-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL CANCEL B).
- Check the setup worked: both parts are on the Active tab and neither has a Deactivated entry in Part History.



========== C425760 · section 20477 (S10 Confirming & recording a status change)
TITLE: Part dialog confirmation names the part as typed in the form
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active; [Part-B] = tracked part, set inactive.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [Part-A] and replace the Description with "   ZZAUTOTEST PL DTITLE NEW   " (three spaces before and after). Do not save yet.
- Pick "Inactive" and click Save.
- Read the title and first line.
- Click "Cancel" and Cancel in the part dialog.
- Open [Part-B] on the Inactive tab, pick "Active", click Save and read the title and first line; click "Cancel".
--- EXPECTED
Expected results
- Step 3: Titled "Deactivate part?"; first line "[Part-A] ZZAUTOTEST PL DTITLE NEW": the number then the description as typed in the form, without the spaces, not the saved [Desc-A].
- Step 4: Nothing is saved: [Part-A] keeps [Desc-A] and stays active.
- Step 5: Titled "Activate part?"; first line "[Part-B] [Desc-B]".
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R3, S10-R4, read 8 Oct 2026; design canvas boards 3.3 and 3.7. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R4: “Raised from the bulk bar, the confirmation opens with "{n} parts selected.", or "1 part selected." for one. Raised from the part dialog, it opens with the part number followed by the description, as they stand in the form, with spaces before and after removed.”
- S10-N1: “If the user cancels the confirmation, no part changes status.”
- S10-R3: “Raised from the bulk bar, the confirmation is titled "Deactivate parts?" or "Activate parts?". Raised from the part dialog, it is titled "Deactivate part?" or "Activate part?".”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Part dialog confirmation names the part as typed in the form
Test case: C425760, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active; [Part-B] = tracked part, set inactive.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL DTITLE A), Part Number (e.g. ZZAUTOTEST-PL-DTITLE-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-DTITLE-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL DTITLE A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL DTITLE B), Part Number (e.g. ZZAUTOTEST-PL-DTITLE-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-DTITLE-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL DTITLE B).
- Set [Part-B] inactive: on the Active tab search [Part-B], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [Part-A] on the Active tab, [Part-B] on the Inactive tab.



========== C425761 · section 20477 (S10 Confirming & recording a status change)
TITLE: Part dialog deactivation confirmation shows its three lines in order
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [Part-A], pick "Inactive" and click Save.
- Read the lines under the first line.
- Click "Cancel".
--- EXPECTED
Expected results
- Step 2: In this order: "This part won't show up when adding parts to work orders, estimates, part sales or purchase orders.", "Existing records that use it stay as they are.", "Stock, cost of goods and QuickBooks aren't affected."
- Step 3: [Part-A] stays active.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R6, read 8 Oct 2026; design canvas board 3.3 (Save asks first). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R6: “For a deactivation from the part dialog, the confirmation states, in this order: "This part won't show up when adding parts to work orders, estimates, part sales or purchase orders.", "Existing records that use it stay as they are.", and "Stock, cost of goods and QuickBooks aren't affected."”
- S10-N1: “If the user cancels the confirmation, no part changes status.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Part dialog deactivation confirmation shows its three lines in order
Test case: C425761, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL DLINES PART), Part Number (e.g. ZZAUTOTEST-PL-DLINES-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-DLINES-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL DLINES PART).
- Check the setup worked: [Part-A] is on the Active tab.



========== C425762 · section 20477 (S10 Confirming & recording a status change)
TITLE: Bulk reactivation confirmation shows its two lines
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B] = tracked parts set inactive, numbers sharing the start ZZAUTOTEST-PL-RLINES-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- On the Inactive tab search "ZZAUTOTEST-PL-RLINES-0", open ⋮ and click "Activate parts".
- Tick both parts and click "Activate" in the bulk bar; read the dialog.
- Click "Cancel", untick [Part-B], click "Activate" and read the dialog; click "Cancel".
--- EXPECTED
Expected results
- Step 2: "Activate parts?", "2 parts selected.", then "These parts can be added to new work again." and "Existing records that use them stay as they are." No "Stock, cost of goods…" line.
- Step 3: "1 part selected.", then "This part can be added to new work again." and "Existing records that use them stay as they are."
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R8, read 8 Oct 2026; design canvas board 4.7 (Confirm the reactivation). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R8: “For a reactivation from the bulk bar, the confirmation states "These parts can be added to new work again." ("This part ..." for one), followed by "Existing records that use them stay as they are."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Bulk reactivation confirmation shows its two lines
Test case: C425762, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B] = tracked parts set inactive, numbers sharing the start ZZAUTOTEST-PL-RLINES-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL RLINES A), Part Number (e.g. ZZAUTOTEST-PL-RLINES-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-RLINES-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL RLINES A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL RLINES B), Part Number (e.g. ZZAUTOTEST-PL-RLINES-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-RLINES-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL RLINES B).
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Set [Part-B] inactive: on the Active tab search [Part-B], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: both parts are on the Inactive tab.



========== C425763 · section 20477 (S10 Confirming & recording a status change)
TITLE: Confirmation lines use medium weight and grey as specified
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active; [Part-B] = tracked part, set inactive.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [Part-A], pick "Inactive", click Save and look at the text of each line; click "Cancel" and close the dialog.
- On the Active tab turn on "Deactivate parts", tick [Part-A], click "Deactivate" and look at each line; click "Cancel" and × on the bar.
- On the Inactive tab turn on "Activate parts", tick [Part-B], click "Activate" and look at each line; click "Cancel".
--- EXPECTED
Expected results
- Steps 1 and 2: "Existing records that use it/them stay as they are." is medium weight (a little bolder than the other lines); "Stock, cost of goods and QuickBooks aren't affected." is grey; the part line or count line and "This part/These parts won't show up…" are regular weight in the normal dark text colour.
- Step 3: "Existing records that use them stay as they are." is medium weight; "2 parts selected."/"1 part selected." and "These parts/This part can be added to new work again." are regular weight in the normal dark text colour.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R9, read 8 Oct 2026; design canvas boards 3.3, 4.4 and 4.7. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R9: “The "Existing records that use ..." line is medium weight. The "Stock, cost of goods and QuickBooks aren't affected." line is grey. Every other line is regular weight in the default text color.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Confirmation lines use medium weight and grey as specified
Test case: C425763, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active; [Part-B] = tracked part, set inactive.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL WEIGHT A), Part Number (e.g. ZZAUTOTEST-PL-WEIGHT-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-WEIGHT-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL WEIGHT A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL WEIGHT B), Part Number (e.g. ZZAUTOTEST-PL-WEIGHT-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-WEIGHT-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL WEIGHT B).
- Set [Part-B] inactive: on the Active tab search [Part-B], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Check the setup worked: [Part-A] on the Active tab, [Part-B] on the Inactive tab.



========== C425764 · section 20477 (S10 Confirming & recording a status change)
TITLE: Bulk change that succeeds shows how many parts were updated
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B], [Part-C] = tracked parts, active, numbers sharing the start ZZAUTOTEST-PL-BOK-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- On the Active tab search "ZZAUTOTEST-PL-BOK-0", turn on "Deactivate parts", tick [Part-A] and [Part-B], click "Deactivate" and confirm with "Deactivate".
- Read the message at the bottom right and wait 10 seconds.
- Turn on "Deactivate parts" again, tick [Part-C], click "Deactivate" and confirm.
- Read the message.
--- EXPECTED
Expected results
- Step 2: A green message reads "2 parts updated." and fades on its own; [Part-A] and [Part-B] have left the Active tab.
- Step 4: A green message reads "1 part updated."; [Part-C] has left the Active tab.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R12, read 8 Oct 2026; design canvas board 4.5 (Done: "2 parts updated."). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- PRD §8 User Feedback Summary (Bulk change, every part changed): “"{n} parts updated." ("1 part updated." for one)”
- S10-R12: “After a bulk change, the system shows how many parts changed and how many failed.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Bulk change that succeeds shows how many parts were updated
Test case: C425764, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B], [Part-C] = tracked parts, active, numbers sharing the start ZZAUTOTEST-PL-BOK-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL BOK A), Part Number (e.g. ZZAUTOTEST-PL-BOK-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-BOK-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL BOK A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL BOK B), Part Number (e.g. ZZAUTOTEST-PL-BOK-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-BOK-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL BOK B).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL BOK C), Part Number (e.g. ZZAUTOTEST-PL-BOK-03), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-C] = the part number you typed (e.g. ZZAUTOTEST-PL-BOK-03); [Desc-C] = the description you typed (e.g. ZZAUTOTEST PL BOK C).
- Check the setup worked: the three parts are on the Active tab.



========== C425765 · section 20477 (S10 Confirming & recording a status change)
TITLE: Bulk change lists a part deleted meanwhile as Part not found
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B] = tracked parts, active, on no work order or return; numbers share the start ZZAUTOTEST-PL-NOTFOUND-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- In tab 1 search "ZZAUTOTEST-PL-NOTFOUND-0", turn on "Deactivate parts" and tick both parts.
- In tab 2 open [Part-B] and click "Delete Part".
- In tab 1 click "Deactivate" and confirm with "Deactivate".
- Read the message.
--- EXPECTED
Expected results
- Step 2: [Part-B] is deleted.
- Step 4: The message reads "1 part updated, 1 could not be changed." and lists [Part-B] by its number with the reason "Part not found."; [Part-A] has moved to the Inactive tab.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R13, S10-R13a, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R13: “For each part that failed, the system names the part by its number and gives the reason.”
- S10-R13a: “The reasons are "A core follows its part. Activate or deactivate the part instead.", "Part not found." and "Part is already in that state."”
- PRD §8 User Feedback Summary (A part missing when the change runs): “"Part not found."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Bulk change lists a part deleted meanwhile as Part not found
Test case: C425765, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B] = tracked parts, active, on no work order or return; numbers share the start ZZAUTOTEST-PL-NOTFOUND-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL NOTFOUND A), Part Number (e.g. ZZAUTOTEST-PL-NOTFOUND-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-NOTFOUND-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL NOTFOUND A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL NOTFOUND B), Part Number (e.g. ZZAUTOTEST-PL-NOTFOUND-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-NOTFOUND-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL NOTFOUND B).
- Check the setup worked: both parts are on the Active tab. Open a second browser tab on Parts → Inventory (tab 2).



========== C425766 · section 20477 (S10 Confirming & recording a status change)
TITLE: Ticking a core on its own is refused with the core reason
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part with a Core Charge, so it has a core [Core-A] (description "Core for [Desc-A]").
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- On the Active tab search "Core for [Desc-A]", turn on "Deactivate parts" and tick [Core-A] only.
- Click "Deactivate" and confirm with "Deactivate".
- Read the message, then search [Part-A].
--- EXPECTED
Expected results
- Step 3: "No parts were changed." lists the core by its number with the reason "A core follows its part. Activate or deactivate the part instead."; [Core-A] and [Part-A] are both still active.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R13a, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R13a: “The reasons are "A core follows its part. Activate or deactivate the part instead.", "Part not found." and "Part is already in that state."”
- PRD §8 User Feedback Summary (A core asked to change status on its own): “"A core follows its part. Activate or deactivate the part instead."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Ticking a core on its own is refused with the core reason
Test case: C425766, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part with a Core Charge, so it has a core [Core-A] (description "Core for [Desc-A]").
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL COREALONE PART), Part Number (e.g. ZZAUTOTEST-PL-COREALONE-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00), Core Charge (e.g. $25.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-COREALONE-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL COREALONE PART).
- Check the setup worked: on the Active tab search "Core for [Desc-A]": the core row [Core-A] is listed. If core rows are not listed on the Inventory list, the core cannot be ticked on its own by hand: write 'not checked by hand' in the result comment and stop.



========== C425767 · section 20477 (S10 Confirming & recording a status change)
TITLE: A note of only spaces records no note
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [Part-A], pick "Inactive" and click Save.
- Type five spaces in the note field.
- Click "Deactivate".
- Open [Part-A]'s Part History.
--- EXPECTED
Expected results
- Step 3: The change is accepted and [Part-A] moves to the Inactive tab.
- Step 4: The newest entry reads "Deactivated" and nothing more (no "| Reason:").
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R15, read 8 Oct 2026; design canvas board 3.3. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Tech plan "Parts Lifecycle Update — Technical Implementation Plan", 7 Oct 2026 (informs, never overrules), §5 New endpoints.
Exact quotes from the source (for reproducibility)
- S10-R15: “Leaving the note empty, or entering only spaces, is allowed and records no note.”
- Tech plan (Parts Lifecycle Update, 7 Oct 2026), §5 New endpoints: “An empty or whitespace-only note is stored as null (S10-R15).”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A note of only spaces records no note
Test case: C425767, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL SPACES PART), Part Number (e.g. ZZAUTOTEST-PL-SPACES-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-SPACES-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL SPACES PART).
- Check the setup worked: [Part-A] is on the Active tab.



========== C425768 · section 20477 (S10 Confirming & recording a status change)
TITLE: Bulk change of forty parts writes forty Part History entries
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-01] … [Part-40] = forty tracked, active parts at [Loc-1], numbers ZZAUTOTEST-PL-BULK40-01 to ZZAUTOTEST-PL-BULK40-40, made with the parts import.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- On the Active tab search "ZZAUTOTEST-PL-BULK40" and scroll to the bottom so all 40 rows are loaded.
- Turn on "Deactivate parts" and tick the header checkbox.
- Click "Deactivate", type the note "ZZAUTOTEST bulk forty" and confirm with "Deactivate".
- Open the Inactive tab and search "ZZAUTOTEST-PL-BULK40".
- Open the Part History of each of the 40 parts in turn, ticking each off on a list.
--- EXPECTED
Expected results
- Step 2: The bulk bar reads "40 selected".
- Step 3: "40 parts updated." shows.
- Step 4: 40 rows are listed (30 + 10 after scrolling).
- Step 5: Each of the 40 parts has exactly one new entry "Deactivated | Reason: ZZAUTOTEST bulk forty": 40 parts × 1 entry = 40 entries, all with the same note.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R18, read 8 Oct 2026; design canvas board 4.9 (the header checkbox ticks every loaded row). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R18: “A bulk change over forty parts writes forty Part History entries, one per part, each with the same note.”
- PRD §8 User Feedback Summary (Bulk change, every part changed): “"{n} parts updated." ("1 part updated." for one)”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Bulk change of forty parts writes forty Part History entries
Test case: C425768, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-01] … [Part-40] = forty tracked, active parts at [Loc-1], numbers ZZAUTOTEST-PL-BULK40-01 to ZZAUTOTEST-PL-BULK40-40, made with the parts import.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Settings → Data Import → Inventory and download the import template.
- Fill 40 rows: Part Number ZZAUTOTEST-PL-BULK40-01 … ZZAUTOTEST-PL-BULK40-40, Description ZZAUTOTEST PL BULK40 01 … 40, Category Uncategorized, Cost 1.00, Sell Price 2.00, quantity 1 in the default bin; save as CSV. [CSV-1] = that file.
- Upload [CSV-1] on Settings → Data Import → Inventory and run the import. [Part-01] … [Part-40] = the forty part numbers.
- Check the setup worked: on the Active tab search "ZZAUTOTEST-PL-BULK40"; scroll to the bottom: 40 rows are listed (the list loads 30 at a time, so 30 + 10 = 40).



========== C425769 · section 20477 (S10 Confirming & recording a status change)
TITLE: A core's status change writes its own Part History entry
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part with a Core Charge, so it has a core [Core-A] ("Core for [Desc-A]").
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- On the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, type the note "ZZAUTOTEST core follows" and click "Deactivate" in the "Deactivate part?" confirmation.
- On the Inactive tab search "Core for [Desc-A]" and click its clock icon ("Part History").
--- EXPECTED
Expected results
- Step 1: [Part-A] moves to the Inactive tab and so does [Core-A].
- Step 2: [Core-A]'s Part History has its own newest entry "Deactivated | Reason: ZZAUTOTEST core follows".
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R19, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists). Tech plan "Parts Lifecycle Update — Technical Implementation Plan", 7 Oct 2026 (informs, never overrules), §6 Phase 2 tests.
Exact quotes from the source (for reproducibility)
- S10-R19: “A core's status change writes its own Part History entry on the core.”
- Tech plan (Parts Lifecycle Update, 7 Oct 2026), §6 Phase 2 tests: “one `entity_event` per parent + core with the note”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A core's status change writes its own Part History entry
Test case: C425769, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part with a Core Charge, so it has a core [Core-A] ("Core for [Desc-A]").
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL COREHIST PART), Part Number (e.g. ZZAUTOTEST-PL-COREHIST-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00), Core Charge (e.g. $25.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-COREHIST-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL COREHIST PART).
- Check the setup worked: on the Active tab search "Core for [Desc-A]": [Core-A] is listed with a clock icon. If core rows are not listed, the core's Part History cannot be opened by hand: write 'not checked by hand' and stop.



========== C425770 · section 20477 (S10 Confirming & recording a status change)
TITLE: A status entry has Staff, Date and Time and can be searched
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active (it already has its creation entries in Part History).
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- On the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, leave the note empty and click "Deactivate" in the "Deactivate part?" confirmation.
- Open [Part-A]'s Part History.
- Type "deactivated" in the Part History search.
--- EXPECTED
Expected results
- Step 2: The "Deactivated" entry fills Staff, Date and Time like every other entry on the page.
- Step 3: The "Deactivated" entry is listed.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R20, read 8 Oct 2026; design canvas board 3.8. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R20: “A Part History entry keeps the Staff, Date and Time columns of every other entry, and can be found with the Part History search.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A status entry has Staff, Date and Time and can be searched
Test case: C425770, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active (it already has its creation entries in Part History).
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL STATCOL PART), Part Number (e.g. ZZAUTOTEST-PL-STATCOL-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-STATCOL-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL STATCOL PART).
- Check the setup worked: [Part-A]'s Part History already lists at least one entry.



========== C425771 · section 20477 (S10 Confirming & recording a status change)
TITLE: Turning tracking off and on writes two Part History entries
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part with nothing on hand (quantity 0).
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [Part-A], switch "Track quantities and cost of goods" off and click Save.
- Open [Part-A] again, switch it on and click Save.
- Open [Part-A]'s Part History.
--- EXPECTED
Expected results
- Step 1: Saved with no confirmation; Total Qty reads "Not Tracked".
- Step 2: Saved; Total Qty reads 0.
- Step 3: Two entries, newest first: "Tracking turned on" and "Tracking turned off" (written even with 0 on hand).
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R22, read 8 Oct 2026; design canvas board 5.5 (Part History). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R22: “Turning tracking off writes the entry "Tracking turned off" to the part's Part History, and turning it on writes "Tracking turned on". A part with nothing on hand still gets the entry.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Turning tracking off and on writes two Part History entries
Test case: C425771, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part with nothing on hand (quantity 0).
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL TRKHIST PART), Part Number (e.g. ZZAUTOTEST-PL-TRKHIST-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 0; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-TRKHIST-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL TRKHIST PART).
- Check the setup worked: [Part-A] shows Total Qty 0 on the Active tab.



========== C425772 · section 20477 (S10 Confirming & recording a status change)
TITLE: Changing Min and Max in the part dialog writes one history entry
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part with Min 2 and Max 6.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [Part-A], change Min to 3 and Max to 8, click Save.
- Open [Part-A], change only Sell Price to $21.00, click Save.
- Open [Part-A]'s Part History.
--- EXPECTED
Expected results
- Steps 1 and 2: Both saves succeed.
- Step 3: One entry reads "Min/Max updated | Min: 2 → 3 | Max: 6 → 8 | Source: Edit Part". The Sell Price save added no second "Min/Max updated" entry.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R22a, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R22a: “Changing Min or Max writes "Min/Max updated | Min: {old} → {new} | Max: {old} → {new} | Source: {source}" to the part's Part History, where the source is "Edit Part" or "Import". No entry is written when neither value changed.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Changing Min and Max in the part dialog writes one history entry
Test case: C425772, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part with Min 2 and Max 6.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL MINMAX PART), Part Number (e.g. ZZAUTOTEST-PL-MINMAX-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00), Min (e.g. 2) and Max (e.g. 6); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-MINMAX-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL MINMAX PART).
- Check the setup worked: [Part-A] shows Min 2 and Max 6.



========== C425773 · section 20477 (S10 Confirming & recording a status change)
TITLE: Changing Min and Max through the parts import writes an Import entry
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part with Min 2 and Max 6. [CSV-1] = one import row for [Part-A] with Min 4 and Max 9.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Upload [CSV-1] on Settings → Data Import → Inventory and run the import.
- Open [Part-A]'s Part History.
--- EXPECTED
Expected results
- Step 1: The import finishes without errors.
- Step 2: An entry reads "Min/Max updated | Min: 2 → 4 | Max: 6 → 9 | Source: Import".
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R22a, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R22a: “Changing Min or Max writes "Min/Max updated | Min: {old} → {new} | Max: {old} → {new} | Source: {source}" to the part's Part History, where the source is "Edit Part" or "Import". No entry is written when neither value changed.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Changing Min and Max through the parts import writes an Import entry
Test case: C425773, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part with Min 2 and Max 6. [CSV-1] = one import row for [Part-A] with Min 4 and Max 9.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL MMIMPORT PART), Part Number (e.g. ZZAUTOTEST-PL-MMIMPORT-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00), Min (e.g. 2) and Max (e.g. 6); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-MMIMPORT-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL MMIMPORT PART).
- Download the template from Settings → Data Import → Inventory and fill one row for [Part-A] with the same values but Min 4 and Max 9; save as CSV. [CSV-1] = that file.
- Check the setup worked: [Part-A] shows Min 2 and Max 6.



========== C425774 · section 20477 (S10 Confirming & recording a status change)
TITLE: Changing a part number is recorded at both locations with Changed at
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Location: [Loc-2] = a second location [Admin] can switch to; its name as shown in the location switcher.
- Data: [Part-A] = one tracked part stocked at both [Loc-1] and [Loc-2] on the same Part Library entry.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- At [Loc-1] open [Part-A], change Part Number to (e.g.) ZZAUTOTEST-PL-RENUM-01B and click Save. [Part-A2] = the new value.
- Open [Part-A]'s Part History at [Loc-1].
- Switch to [Loc-2] and open the same part's Part History there.
--- EXPECTED
Expected results
- Step 1: The dialog warned "This also changes the part number at 1 other location." and the save succeeds.
- Step 2: The newest entry reads "Part number updated | Original number: [Part-A] | New number: [Part-A2]" with nothing after it.
- Step 3: The newest entry reads "Part number updated | Original number: [Part-A] | New number: [Part-A2] | Changed at: [Loc-1]", naming the location where the change was made.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R23, S10-R25, read 8 Oct 2026; design canvas boards 2.4 (Part History at Heavy Duty) and 2.6 (Part History at Lethbridge). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- PRD §8 User Feedback Summary (Part number changed on a part other locations stock): “"This also changes the part number at {n} other locations." ("1 other location." for one)”
- S10-R23: “A changed part number writes "Part number updated | Original number: {old} | New number: {new}" to the Part History of the part at every location that stocks it.”
- S10-R25: “On the entries written at the other locations, the line ends with "| Changed at: {location}", naming the location where the change was made.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Changing a part number is recorded at both locations with Changed at
Test case: C425774, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Location: [Loc-2] = a second location [Admin] can switch to; its name as shown in the location switcher.
- Data: [Part-A] = one tracked part stocked at both [Loc-1] and [Loc-2] on the same Part Library entry.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Settings → Locations, add a location (e.g. "ZZAUTOTEST PL RENUM Loc") and save. [Loc-2] = that location.
- Go to Settings → Staff, open [Admin] and make sure [Loc-2] is one of the locations [Admin] can use; save. [Loc-2] now shows in the top-bar location switcher.
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL RENUM PART), Part Number (e.g. ZZAUTOTEST-PL-RENUM-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-RENUM-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL RENUM PART).
- Switch to [Loc-2] and create a part with exactly the same Part Number [Part-A] and Description [Desc-A] (New Inventory Part, Category, Cost, Sell Price, Save).
- Check the setup worked: at [Loc-2] the Active tab lists [Part-A]. Switch back to [Loc-1].



========== C425775 · section 20477 (S10 Confirming & recording a status change)
TITLE: Changing a description is recorded at both locations with Changed at
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Location: [Loc-2] = a second location [Admin] can switch to; its name as shown in the location switcher.
- Data: [Part-A] = one tracked part stocked at both [Loc-1] and [Loc-2] on the same Part Library entry.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- At [Loc-1] open [Part-A], change Description to (e.g.) ZZAUTOTEST PL REDESC NEW and click Save. [Desc-A2] = the new value.
- Open [Part-A]'s Part History at [Loc-1].
- Switch to [Loc-2] and open the same part's Part History there.
--- EXPECTED
Expected results
- Step 1: The dialog warned "This also changes the description at 1 other location." and the save succeeds.
- Step 2: The newest entry reads "Description updated | Original description: [Desc-A] | New description: [Desc-A2]" with nothing after it.
- Step 3: The newest entry reads "Description updated | Original description: [Desc-A] | New description: [Desc-A2] | Changed at: [Loc-1]", naming the location where the change was made.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R24, S10-R25, read 8 Oct 2026; design canvas boards 2.4 (Part History at Heavy Duty) and 2.6 (Part History at Lethbridge). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- PRD §8 User Feedback Summary (Description changed on a part other locations stock): “"This also changes the description at {n} other locations." ("1 other location." for one)”
- S10-R24: “A changed description writes "Description updated | Original description: {old} | New description: {new}" to the Part History of the part at every location that stocks it.”
- S10-R25: “On the entries written at the other locations, the line ends with "| Changed at: {location}", naming the location where the change was made.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Changing a description is recorded at both locations with Changed at
Test case: C425775, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Location: [Loc-2] = a second location [Admin] can switch to; its name as shown in the location switcher.
- Data: [Part-A] = one tracked part stocked at both [Loc-1] and [Loc-2] on the same Part Library entry.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Settings → Locations, add a location (e.g. "ZZAUTOTEST PL REDESC Loc") and save. [Loc-2] = that location.
- Go to Settings → Staff, open [Admin] and make sure [Loc-2] is one of the locations [Admin] can use; save. [Loc-2] now shows in the top-bar location switcher.
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL REDESC PART), Part Number (e.g. ZZAUTOTEST-PL-REDESC-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-REDESC-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL REDESC PART).
- Switch to [Loc-2] and create a part with exactly the same Part Number [Part-A] and Description [Desc-A] (New Inventory Part, Category, Cost, Sell Price, Save).
- Check the setup worked: at [Loc-2] the Active tab lists [Part-A]. Switch back to [Loc-1].



========== C425777 · section 20477 (S10 Confirming & recording a status change)
TITLE: A core gets the same number and description history entries
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part with a Core Charge, so it has a core [Core-A] ("Core for [Desc-A]").
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [Part-A], change Part Number to (e.g.) ZZAUTOTEST-PL-CORERN-01B and Description to (e.g.) ZZAUTOTEST PL CORERN NEW, click Save. [Part-A2] and [Desc-A2] = the new values.
- Search "Core for [Desc-A2]" and open its Part History.
--- EXPECTED
Expected results
- Step 1: Saved.
- Step 2: The core has "Part number updated | Original number: [Part-A] | New number: [Part-A2]" and "Description updated | Original description: Core for [Desc-A] | New description: Core for [Desc-A2]".
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R26, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R26: “When the part has a core, the core gets the same number or description entry. The core's description entries read its own description, "Core for {description}".”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A core gets the same number and description history entries
Test case: C425777, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part with a Core Charge, so it has a core [Core-A] ("Core for [Desc-A]").
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL CORERN PART), Part Number (e.g. ZZAUTOTEST-PL-CORERN-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00), Core Charge (e.g. $25.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-CORERN-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL CORERN PART).
- Check the setup worked: on the Active tab "Core for [Desc-A]" is listed. If core rows are not listed, the core's Part History cannot be opened by hand: write 'not checked by hand' and stop.



========== C425778 · section 20477 (S10 Confirming & recording a status change)
TITLE: Part History search finds entries by text or staff, in any case
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part with a deactivation, a reactivation and a tracking change in its history.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [Part-A]'s Part History.
- Type "superseded kit" in the search.
- Replace it with "TRACKING TURNED".
- Replace it with [Staff-1]'s first name in lower case.
- Clear the search.
--- EXPECTED
Expected results
- Step 2: Only "Deactivated | Reason: ZZAUTOTEST Superseded Kit" is listed.
- Step 3: Only "Tracking turned off" is listed.
- Step 4: Every entry made by [Staff-1] is listed.
- Step 5: All entries are back.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R27, read 8 Oct 2026; design canvas board 3.8 (Finding it in Part History). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R27: “The Part History search finds an entry when the typed text appears in its Event text as shown on screen, or in its Staff name. Upper and lower case do not matter. This applies to every kind of entry.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Part History search finds entries by text or staff, in any case
Test case: C425778, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part with a deactivation, a reactivation and a tracking change in its history.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL HSEARCH PART), Part Number (e.g. ZZAUTOTEST-PL-HSEARCH-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-HSEARCH-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL HSEARCH PART).
- Set [Part-A] inactive: on the Active tab search [Part-A], click its row, pick Part Status "Inactive", click Save, type the note "ZZAUTOTEST Superseded Kit" and click "Deactivate" in the "Deactivate part?" confirmation.
- Open [Part-A] on the Inactive tab, pick "Active", Save, leave the note empty, click "Activate".
- Open [Part-A], switch "Track quantities and cost of goods" off and Save.
- [Staff-1] = [Admin]'s name as Part History shows it.
- Check the setup worked: [Part-A]'s Part History shows Deactivated, Activated and Tracking turned off entries.



========== C425779 · section 20477 (S10 Confirming & recording a status change)
TITLE: Part History search shows only the matching bin rows
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Bin-1], [Bin-2] = two bin locations; [Part-A] = tracked part stocked in both, with one entry whose row is split by bin.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [Part-A]'s Part History.
- Type [Bin-1] in the search.
- Replace it with [Staff-1]'s name.
--- EXPECTED
Expected results
- Step 2: The entry shows only its [Bin-1] row; the [Bin-2] row is hidden.
- Step 3: The entry shows both bin rows.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R28, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R28: “An entry whose row is split by bin shows only the bin rows that match. A match on the Staff name shows every bin row.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Part History search shows only the matching bin rows
Test case: C425779, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Bin-1], [Bin-2] = two bin locations; [Part-A] = tracked part stocked in both, with one entry whose row is split by bin.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Settings → Bin Locations and add two bins (e.g. "ZZAUTOTEST-PL-BINA" and "ZZAUTOTEST-PL-BINB"). [Bin-1], [Bin-2] = those names.
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL BINS PART), Part Number (e.g. ZZAUTOTEST-PL-BINS-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-BINS-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL BINS PART).
- Open [Part-A], click "+ Add Bin Location" twice and set [Bin-1] quantity 4 and [Bin-2] quantity 3; Save.
- Open [Part-A] again, change [Bin-1] to 6 and [Bin-2] to 5 in the same edit; Save.
- [Staff-1] = [Admin]'s name as Part History shows it.
- Check the setup worked: [Part-A]'s Part History has one entry whose row lists both [Bin-1] and [Bin-2]. If the two bins were written as two separate entries, note it and use the last one.



========== C425780 · section 20477 (S10 Confirming & recording a status change)
TITLE: Prices in Part History are searchable only by users who see prices
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- User: [User-B] = a staff member whose custom role [Role-B] has 'Part Library & Inventory → View' and See Financial Data off.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part whose Sell Price was changed from $20.00 to $23.45.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- As [Admin] open [Part-A]'s Part History and search "23.45".
- In browser 2, as [User-B], open [Part-A]'s Part History and search "23.45".
--- EXPECTED
Expected results
- Step 1: The price entry is listed.
- Step 2: No entry is found by the price.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R29, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R29: “A price in an entry can be searched only by a user who can see prices.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Prices in Part History are searchable only by users who see prices
Test case: C425780, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- User: [User-B] = a staff member whose custom role [Role-B] has 'Part Library & Inventory → View' and See Financial Data off.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part whose Sell Price was changed from $20.00 to $23.45.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Settings → Roles & Permissions, click "Create custom role", skip the template, name it (e.g. "ZZAUTOTEST PL NOPRICE"), turn on the Parts department, tick 'Part Library & Inventory → View', and leave See Financial Data off, click Save. [Role-B] = that role.
- Go to Settings → Staff, add a staff member (e.g. first name "ZZAUTOTEST", last name "PL NOPRICE") with an email address you can open, Role [Role-B]; save, open the invite email and set a password. [User-B] = that user.
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL PRICE PART), Part Number (e.g. ZZAUTOTEST-PL-PRICE-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-PRICE-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL PRICE PART).
- Open [Part-A], change Sell Price to $23.45 and Save.
- Check the setup worked: as [Admin], [Part-A]'s Part History shows a price entry containing 23.45; [User-B] can open [Part-A]'s Part History in browser 2.



========== C425781 · section 20477 (S10 Confirming & recording a status change)
TITLE: Bulk change where every part fails keeps the selection
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B] = tracked parts, active, numbers sharing the start ZZAUTOTEST-PL-ALLFAIL-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- In tab 1 search "ZZAUTOTEST-PL-ALLFAIL-0", turn on "Deactivate parts" and tick both parts.
- In tab 2 set [Part-A] and [Part-B] inactive (each: open, Inactive, Save, Deactivate).
- In tab 1 click "Deactivate" and confirm with "Deactivate".
- Read the message and the list; wait 10 seconds.
--- EXPECTED
Expected results
- Step 4: "No parts were changed." lists [Part-A] and [Part-B], each with "Part is already in that state."; it stays until closed. The list stays on screen, the bulk mode stays on and both parts are still ticked ("2 selected"), ready to retry.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-N2, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-N2: “If every part in a bulk change fails, the list stays on screen and the selection is kept, so the user can retry.”
- PRD §8 User Feedback Summary (Bulk change, every part failed): “"No parts were changed."”
- PRD §8 User Feedback Summary (Bulk change, every part failed): “Error toast, stays until closed, lists each failed part and its reason”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Bulk change where every part fails keeps the selection
Test case: C425781, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A], [Part-B] = tracked parts, active, numbers sharing the start ZZAUTOTEST-PL-ALLFAIL-0.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL ALLFAIL A), Part Number (e.g. ZZAUTOTEST-PL-ALLFAIL-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-ALLFAIL-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL ALLFAIL A).
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL ALLFAIL B), Part Number (e.g. ZZAUTOTEST-PL-ALLFAIL-02), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-B] = the part number you typed (e.g. ZZAUTOTEST-PL-ALLFAIL-02); [Desc-B] = the description you typed (e.g. ZZAUTOTEST PL ALLFAIL B).
- Check the setup worked: both parts are on the Active tab. Open a second browser tab on Parts → Inventory (tab 2).



========== C425782 · section 20477 (S10 Confirming & recording a status change)
TITLE: A status change with no parts ticked cannot be sent
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- On the Active tab search [Part-A] and turn on "Deactivate parts".
- With nothing ticked, click "Deactivate" in the bulk bar.
--- EXPECTED
Expected results
- Step 1: The bulk bar reads 0 selected.
- Step 2: The button is disabled and no confirmation opens, so an empty change cannot be sent from the screen. The refusal "Select at least one part." (error toast, fades after 3 seconds) cannot be checked by hand: write 'not checked by hand' for it in the result comment.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-N4, read 8 Oct 2026; design canvas board 4.2 (Mode on: 0 selected). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-N4: “If a status change reaches the system with no parts in it, it is refused with "Select at least one part."”
- PRD §8 User Feedback Summary (Status change with no parts in it): “"Select at least one part."”
- PRD §8 User Feedback Summary (Status change with no parts in it): “Error toast, fades after 3 seconds”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A status change with no parts ticked cannot be sent
Test case: C425782, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = tracked part, active.
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
- Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL NOPARTS PART), Part Number (e.g. ZZAUTOTEST-PL-NOPARTS-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
- [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-NOPARTS-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL NOPARTS PART).
- Check the setup worked: [Part-A] is on the Active tab.

