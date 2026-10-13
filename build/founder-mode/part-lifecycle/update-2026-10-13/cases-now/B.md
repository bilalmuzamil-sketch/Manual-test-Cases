

========== C154766 · section 20471 (S4 Create an untracked part)
TITLE: New Inventory Part opens with tracking on in its own Inventory Tracking section
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: none. Nothing is saved in this case.
--- STEPS
- Click New Inventory Part.
- Look at the Track quantities and cost of goods switch without touching it.
- Read the dialog from the Cost, Sell Price and Core Charge row down to the Tags field.
- Click Cancel.
--- EXPECTED
Expected results
- Step 1: The New Inventory Part dialog opens.
- Step 2: The switch labelled "Track quantities and cost of goods" is on (blue).
- Step 3: Directly below the Cost, Sell Price and Core Charge row there is a heading "Inventory Tracking" with an info icon; under the heading comes the switch, then the Min and Max fields, and only then the Tags field.
- Step 4: The dialog closes and no part is created.
Source — where this behaviour comes from
Epic SV-10647; story SV-10817 (Story 4, Create an Untracked Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S4-R1, S4-R2, S4-R4, read 8 Oct 2026; design canvas board 1.1 (New Inventory Part opens). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S4-R1: “The New Inventory Part dialog has a "Track quantities and cost of goods" switch, on by default.”
- S4-R2: “The switch sits in its own section headed "Inventory Tracking", below the cost, Sell Price and Core Charge fields, and above Tags (S13-R4).”
- S4-R4: “Min and Max sit in the section, under the switch.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: New Inventory Part opens with tracking on in its own Inventory Tracking section
Test case: C154766, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: none. Nothing is saved in this case.
# Part 1. Setup for manual QA tester
- Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
- Check the setup worked: the toolbar shows the blue New Inventory Part button. If it does not, your role lacks Create & Edit in the Part Library and Inventory group; sign in as an Admin.



========== C154767 · section 20471 (S4 Create an untracked part)
TITLE: Switching tracking off hides Min and Max but keeps the bin section
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: none. Nothing is saved in this case.
--- STEPS
- Click New Inventory Part.
- Click the Track quantities and cost of goods switch once.
- Look at the area between the switch and the Tags field.
- Look at the Inventory section at the bottom of the dialog.
- Click the switch once more.
- Click Cancel.
--- EXPECTED
Expected results
- Step 2: The switch turns off (grey) and no confirmation or message appears.
- Step 3: The Min and Max fields are gone; Tags now follows the switch directly.
- Step 4: The Inventory section is still shown, with its bin row (Bin Location, Quantity 0 and the Default pill) and the + Add Bin Location link.
- Step 5: The switch is on again and the Min and Max fields are back.
- Step 6: The dialog closes and no part is created.
Source — where this behaviour comes from
Epic SV-10647; story SV-10817 (Story 4, Create an Untracked Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S4-R5, S4-R6, read 8 Oct 2026; design canvas board 1.6 (Branch: a new part with tracking off). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S4-R5: “When the switch is off, Min and Max are hidden.”
- S4-R6: “When the switch is off, the bin location section stays visible and is optional. A bin can be set as a shelf reference without being required to save.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Switching tracking off hides Min and Max but keeps the bin section
Test case: C154767, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: none. Nothing is saved in this case.
# Part 1. Setup for manual QA tester
- Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
- Check the setup worked: the toolbar shows the blue New Inventory Part button. If it does not, sign in as an Admin.



========== C154768 · section 20471 (S4 Create an untracked part)
TITLE: An untracked part shows Not Tracked with its bins, Min and Max in the list
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one untracked part [Part-A] at [Loc-1] holding two bins, [Bin-1] with 4 and [Bin-2] with 3, and a saved Min of 2 and Max of 6.
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- On the Active tab, type [Part-A] in the Inventory search.
- Open the column picker in the toolbar and make sure Bin Location / Quantity, Total Quantity, Min and Max are switched on.
- Read the [Part-A] row in those four columns.
--- EXPECTED
Expected results
- Step 3: The Total Quantity cell reads "Not Tracked" (grey text, no quantity badge).
- Step 3: The Bin Location / Quantity cell still shows both bins with their quantities: "[Bin-1] | 4" and "[Bin-2] | 3".
- Step 3: The Min cell reads 2 and the Max cell reads 6 (the values saved before tracking was turned off).
Source — where this behaviour comes from
Epic SV-10647; story SV-10817 (Story 4, Create an Untracked Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S4-R8, S4-R8a, S4-R8b, read 8 Oct 2026; design canvas board 5.3 (The list says Not Tracked). The column is headed "Total Quantity" on design board 5.3 and on today's Inventory list; PRD v26 calls it "Total Qty". Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S4-R8: “An untracked part shows "Not Tracked" in the Inventory list's Total Qty column instead of a quantity.”
- S4-R8a: “On the Inventory list, an untracked part's Bin Location / Quantity column still shows each bin with its quantity.”
- S4-R8b: “On the Inventory list, an untracked part's Min and Max columns still show the saved values.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: An untracked part shows Not Tracked with its bins, Min and Max in the list
Test case: C154768, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one untracked part [Part-A] at [Loc-1] holding two bins, [Bin-1] with 4 and [Bin-2] with 3, and a saved Min of 2 and Max of 6.
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL NOT TRACKED LIST and Part Number ZZAUTOTEST-PL-NOTTRK-LIST-01; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and type Min 2 and Max 6.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 4.
      – Click + Add Bin Location, pick another bin ([Bin-2] = that bin; if the list offers no other bin, first add one in Settings → Bin Locations, e.g. ZZAUTOTEST-PL-BIN-B) and set its Quantity to 3.
      – Click Save. The dialog closes.
3. Write down [Part-A] = ZZAUTOTEST-PL-NOTTRK-LIST-01.
4. Open [Part-A] (search its part number in Inventory and click the row), click the Track quantities and cost of goods switch so it is off, and click Save.
5. Check the setup worked: open [Part-A] again; the switch is off and the Inventory section lists [Bin-1] with 4 and [Bin-2] with 3. If the switch is on, turn it off and Save. Close the dialog with Cancel.



========== C154769 · section 20471 (S4 Create an untracked part)
TITLE: A tracked new part always keeps a default bin in the dialog
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: at least two bin locations exist at [Loc-1] (the default one, e.g. General Storage, and one more). Nothing is saved in this case.
--- STEPS
- Click New Inventory Part and leave the Track quantities and cost of goods switch on.
- Look at the Inventory section.
- Try to remove the only bin row (use its remove control if one is shown).
- Click + Add Bin Location and pick a second bin ([Bin-2] = that bin).
- Try to take the Default mark off the first bin row ([Bin-1]) so that no row is marked Default.
- Try to remove the [Bin-1] row, which is marked Default.
- Click Cancel.
--- EXPECTED
Expected results
- Step 2: One bin row is already filled in: the location's default bin (e.g. General Storage), Quantity 0, with the Default pill.
- Step 3: The only bin row cannot be removed (no remove control is offered, or it does nothing).
- Step 5: One of the two rows always stays marked Default; the dialog never shows two bin rows with no Default pill.
- Step 6: The row marked Default cannot be removed; both rows are still there.
- Step 7: The dialog closes and no part is created.
Source — where this behaviour comes from
Epic SV-10647; story SV-10817 (Story 4, Create an Untracked Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S4-R7 and the Story 4 context note, read 8 Oct 2026; design canvas board 1.1 (New Inventory Part opens). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S4-R7: “When the switch is on, at least one bin location must be set, and one must be marked as the default, before the part can be saved.”
- PRD §7 Story 4 context note: “in the dialog a new part always starts with the location's default bin, and the last bin and the default bin cannot be removed, so S4-N1 and S4-N2 come from requests made outside the dialog.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A tracked new part always keeps a default bin in the dialog
Test case: C154769, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: at least two bin locations exist at [Loc-1] (the default one, e.g. General Storage, and one more). Nothing is saved in this case.
# Part 1. Setup for manual QA tester
- Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
- Open New Inventory Part, click + Add Bin Location and open its Bin Location list. If it offers no bin other than the default one, click Cancel and add one in Settings → Bin Locations (e.g. ZZAUTOTEST-PL-BIN-B).
- Check the setup worked: the Bin Location list in New Inventory Part offers at least two bins. Click Cancel.



========== C425627 · section 20471 (S4 Create an untracked part)
TITLE: Inventory Tracking info icon shows the tracking help text
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: none. Nothing is saved in this case.
--- STEPS
- Click New Inventory Part.
- Hover the mouse over the info icon beside the Inventory Tracking heading.
- Read the text that appears, word for word.
- Click Cancel.
--- EXPECTED
Expected results
- Step 2: A tooltip appears next to the info icon.
- Step 3: It reads exactly: "Tracked parts keep a stock count, with Min and Max. Turn this off for items you don't count. Untracked parts are left out of the Inventory Value report." All three sentences must be there; if the last sentence (about the Inventory Value report) is missing, the case fails.
- Step 4: The dialog closes and no part is created.
Source — where this behaviour comes from
Epic SV-10647; story SV-10817 (Story 4, Create an Untracked Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S4-R3, read 8 Oct 2026; design canvas board 5.1 (The Inventory Tracking section). Tech plan 7 Oct 2026, clarification Q8 (the tooltip adds the Inventory Value sentence). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S4-R3: “The heading has an info icon. Hovering it shows "Tracked parts keep a stock count, with Min and Max. Turn this off for items you don't count. Untracked parts are left out of the Inventory Value report."”
- Tech plan §1 Clarifications (Q8 Tracking info text): “Adds "Untracked parts are left out of the Inventory Value report." (S4-R3)”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Inventory Tracking info icon shows the tracking help text
Test case: C425627, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: none. Nothing is saved in this case.
# Part 1. Setup for manual QA tester
- Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
- Check the setup worked: the toolbar shows the blue New Inventory Part button. If it does not, sign in as an Admin.



========== C425628 · section 20471 (S4 Create an untracked part)
TITLE: An untracked part saves with its bin and quantity as a shelf reference
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: no part numbered ZZAUTOTEST-PL-UNTRK-SAVE-01 exists at [Loc-1] yet; this case creates it.
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- Click New Inventory Part.
- Type [Desc-A] in Description and [Part-A] in Part Number.
- Pick any Category (e.g. Uncategorized) and type Cost 4.00.
- Click the Track quantities and cost of goods switch so it is off.
- In the Inventory section, keep the bin the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 12.
- Click Save.
- Type [Part-A] in the Inventory search.
- Click the [Part-A] row.
- Read the switch and the Inventory section of the dialog.
--- EXPECTED
Expected results
- Step 6: The dialog closes and the part is saved; no bin error appears.
- Step 7: One row is listed for [Part-A]; its Bin Location / Quantity cell reads "[Bin-1] | 12" and its Total Quantity cell reads "Not Tracked".
- Step 9: The Edit Inventory Part dialog shows the switch off, and the Inventory section still holds [Bin-1] with Quantity 12 (the 12 typed in Step 5, unchanged).
Source — where this behaviour comes from
Epic SV-10647; story SV-10817 (Story 4, Create an Untracked Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S4-R6, S4-R6a, read 8 Oct 2026; design canvas board 1.6 (Branch: a new part with tracking off). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S4-R6: “When the switch is off, the bin location section stays visible and is optional. A bin can be set as a shelf reference without being required to save.”
- S4-R6a: “The bins set on an untracked part are saved with their quantities, the same as on a tracked part.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: An untracked part saves with its bin and quantity as a shelf reference
Test case: C425628, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: no part numbered ZZAUTOTEST-PL-UNTRK-SAVE-01 exists at [Loc-1] yet; this case creates it.
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
- Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
- Search ZZAUTOTEST-PL-UNTRK-SAVE-01 in the Inventory search. If a row is found (left from an earlier run), open it and use the Delete Part button, or switch to the Inactive tab and check there too.
- Write down [Part-A] = ZZAUTOTEST-PL-UNTRK-SAVE-01 and [Desc-A] = ZZAUTOTEST PL UNTRACKED SHOP RAGS.
- Check the setup worked: searching [Part-A] on both the Active and the Inactive tab finds no row.



========== C425630 · section 20471 (S4 Create an untracked part)
TITLE: Inventory Value report leaves out an untracked part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: two parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-IVUNT-: [Part-T] tracked, 4 on hand at a cost of $10.00; [Part-U] untracked, 3 on hand at a cost of $20.00.
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- In the top bar click Reports and open the Inventory Value report.
- Leave the as-of date on today and set the Location filter to [Loc-1] only.
- Type ZZAUTOTEST-PL-IVUNT- in the report's Search box.
- Read the rows listed.
- Read the Totals row.
- Go back to Parts → Inventory and search ZZAUTOTEST-PL-IVUNT-.
--- EXPECTED
Expected results
- Step 4: Exactly one row is listed: [Part-T] with Qty 4.00, Unit Cost $10.00 and Total Cost $40.00 (4 × $10.00 = $40.00). There is no row for [Part-U].
- Step 5: Totals reads Qty 4.00 and Total Cost $40.00. [Part-U]'s 3 × $20.00 = $60.00 is not added: the total is $40.00, not $100.00.
- Step 6: The Inventory list is unchanged by the report: [Part-U] still shows "Not Tracked" with bin "[Bin-1] | 3" (the report change does not touch the stock).
Source — where this behaviour comes from
Epic SV-10647; story SV-10817 (Story 4, Create an Untracked Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S4-R9 and §2 Feature Overview, Accounting, read 8 Oct 2026; design canvas board 5.3 (The list says Not Tracked) and tracking-note-2. Report labels (Qty, Unit Cost, Total Cost, Totals, as-of date, Location filter) are those of the Inventory Value report already in the build. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S4-R9: “The Inventory Value report does not include untracked parts.”
- PRD §2 Accounting: “The Inventory Value report leaves out untracked parts, because they keep no stock count to value. This is a report change only.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Inventory Value report leaves out an untracked part
Test case: C425630, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: two parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-IVUNT-: [Part-T] tracked, 4 on hand at a cost of $10.00; [Part-U] untracked, 3 on hand at a cost of $20.00.
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-T]: click New Inventory Part; type Description ZZAUTOTEST PL IV UNTRACKED TRACKED ONE and Part Number ZZAUTOTEST-PL-IVUNT-T1; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 4.
      – Click Save. The dialog closes.
3. Create [Part-U]: click New Inventory Part; type Description ZZAUTOTEST PL IV UNTRACKED UNTRACKED ONE and Part Number ZZAUTOTEST-PL-IVUNT-U1; pick any Category (e.g. Uncategorized); type Cost 20.00.
      – Click the Track quantities and cost of goods switch so it is off (grey). Min and Max disappear.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 3.
      – Click Save. The dialog closes.
4. Write down [Part-T] = ZZAUTOTEST-PL-IVUNT-T1 and [Part-U] = ZZAUTOTEST-PL-IVUNT-U1.
5. Check the setup worked: search ZZAUTOTEST-PL-IVUNT- in Inventory. [Part-T] shows Total Quantity "4 Available" and Average Cost $10.00; [Part-U] shows Total Quantity "Not Tracked", bin "[Bin-1] | 3" and Average Cost $20.00. Fix any value that differs before you start.



========== C154770 · section 20472 (S5 Edit tracking state)
TITLE: Turning tracking on gives a part with no bin the default bin at zero
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one untracked part [Part-A] at [Loc-1] that holds no bin location at all.
- The dialog may not let you remove the last bin of a part; if it does not, this part has no manual way to exist and the case is Blocked (see Setup).
--- STEPS
- Search [Part-A] in Inventory and click its row.
- Click the Track quantities and cost of goods switch so it is on.
- Read the Inventory section.
- Click Save.
- Read the [Part-A] row in the list.
- Click the [Part-A] row and read the Inventory section.
--- EXPECTED
Expected results
- Step 2: The switch turns on and the Min and Max fields appear.
- Step 3: The Inventory section now holds one bin row: the location's default bin (e.g. General Storage) with Quantity 0 and the Default pill.
- Step 4: The dialog closes with no bin error.
- Step 5: Total Quantity shows "0 Available" (a number, not "Not Tracked"), and Bin Location / Quantity shows the default bin with 0.
- Step 6: The saved part keeps that one bin, Quantity 0, marked Default.
Source — where this behaviour comes from
Epic SV-10647; story SV-10818 (Story 5, Change Tracking on an Existing Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S5-R7, read 8 Oct 2026; design canvas board 5.6 (Switch back on). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S5-R7: “In the part dialog, when the user turns tracking on and the part has no bin location, the dialog gives it the location's default bin location, with a quantity of zero, marked as the default.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Turning tracking on gives a part with no bin the default bin at zero
Test case: C154770, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one untracked part [Part-A] at [Loc-1] that holds no bin location at all.
• The dialog may not let you remove the last bin of a part; if it does not, this part has no manual way to exist and the case is Blocked (see Setup).
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL TRACK ON NO BIN and Part Number ZZAUTOTEST-PL-TRKON-NOBIN-01; pick any Category (e.g. Uncategorized); type Cost 8.00.
      – Click the Track quantities and cost of goods switch so it is off (grey). Min and Max disappear.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 0.
      – Click Save. The dialog closes.
3. Write down [Part-A] = ZZAUTOTEST-PL-TRKON-NOBIN-01.
4. Open [Part-A], remove its only bin row in the Inventory section (use the row's remove control) and click Save.
5. Check the setup worked: open [Part-A] again; the switch is off and the Inventory section shows no bin row. If the dialog does not let you remove the last bin, mark this case Blocked with the comment "cannot make an untracked part with no bin by hand". Close the dialog with Cancel.



========== C154771 · section 20472 (S5 Edit tracking state)
TITLE: Turning tracking off and back on keeps Min and Max
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one tracked part [Part-A] at [Loc-1] with Min 2, Max 6 and one bin [Bin-1] holding 4.
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- Click the [Part-A] row.
- Click the Track quantities and cost of goods switch so it is off.
- Look for the Min and Max fields.
- Click Save.
- Read the [Part-A] row in the list (Total Quantity, Min, Max).
- Click the [Part-A] row again.
- Click the switch so it is on.
- Read the Min and Max fields.
- Click Save and read the [Part-A] row.
--- EXPECTED
Expected results
- Step 2: The switch turns off; nothing else is asked.
- Step 3: Min and Max are hidden.
- Step 5: Total Quantity reads "Not Tracked"; Min still reads 2 and Max 6.
- Step 8: Min shows 2 and Max shows 6 again, exactly as before; they are not blank and not 0.
- Step 9: The row shows Total Quantity "4 Available", Min 2 and Max 6.
Source — where this behaviour comes from
Epic SV-10647; story SV-10818 (Story 5, Change Tracking on an Existing Part); story SV-10817 (Story 4, Create an Untracked Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S5-R1, S5-R3, S5-R4, S4-R8b, read 8 Oct 2026; design canvas boards 5.2 (Switch off) and 5.6 (Switch back on). Board 5.6 shows Min 0 and Max 0 as example data; the expected values come from the PRD. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S5-R1: “The "Track quantities and cost of goods" switch can be changed in the Edit Inventory Part dialog.”
- S5-R3: “Turning tracking off hides Min and Max in the part dialog. It does not change the quantity in any bin.”
- S5-R4: “Turning tracking off keeps the Min and Max values, so turning tracking back on shows them as they were.”
- S4-R8b: “On the Inventory list, an untracked part's Min and Max columns still show the saved values.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Turning tracking off and back on keeps Min and Max
Test case: C154771, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one tracked part [Part-A] at [Loc-1] with Min 2, Max 6 and one bin [Bin-1] holding 4.
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL MIN MAX KEPT and Part Number ZZAUTOTEST-PL-MINMAX-01; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and type Min 2 and Max 6.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 4.
      – Click Save. The dialog closes.
3. Write down [Part-A] = ZZAUTOTEST-PL-MINMAX-01.
4. Check the setup worked: search [Part-A]; the row shows Total Quantity "4 Available", Min 2 and Max 6 (switch these columns on in the column picker if needed).



========== C154772 · section 20472 (S5 Edit tracking state)
TITLE: Turning tracking off on a part with stock asks for no confirmation
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one tracked part [Part-A] at [Loc-1] with two bins, [Bin-1] holding 4 and [Bin-2] holding 3 (7 on hand).
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- Click the [Part-A] row.
- Click the Track quantities and cost of goods switch so it is off.
- Click Save.
--- EXPECTED
Expected results
- Step 2: The switch turns off at once. No confirmation, warning or message appears, even though the part holds 7.
- Step 3: The dialog closes straight away. No confirmation dialog of any kind opens (in particular no "Disable tracking?" dialog), and the row now reads "Not Tracked".
Source — where this behaviour comes from
Epic SV-10647; story SV-10818 (Story 5, Change Tracking on an Existing Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S5-R5, S5-R1, read 8 Oct 2026; design canvas board 5.2 (Switch off) and tracking-note-1. PRD v26 removed the old confirmation requirements (S5-E2 to S5-E9 of the IN-REVIEW draft). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S5-R5: “Turning tracking off asks for no confirmation, whatever the part holds.”
- S5-R1: “The "Track quantities and cost of goods" switch can be changed in the Edit Inventory Part dialog.”
- PRD §4 Key Decisions (tracking off): “Turning tracking off only hides the count. Nothing is cleared and nothing is written off, so there is nothing to confirm.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Turning tracking off on a part with stock asks for no confirmation
Test case: C154772, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one tracked part [Part-A] at [Loc-1] with two bins, [Bin-1] holding 4 and [Bin-2] holding 3 (7 on hand).
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL NO CONFIRMATION and Part Number ZZAUTOTEST-PL-NOCONF-01; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 4.
      – Click + Add Bin Location, pick another bin ([Bin-2] = that bin; if the list offers no other bin, first add one in Settings → Bin Locations, e.g. ZZAUTOTEST-PL-BIN-B) and set its Quantity to 3.
      – Click Save. The dialog closes.
3. Write down [Part-A] = ZZAUTOTEST-PL-NOCONF-01.
4. Check the setup worked: search [Part-A]; the row shows Total Quantity "7 Available" (4 + 3).



========== C154773 · section 20472 (S5 Edit tracking state)
TITLE: Turning tracking off keeps every bin quantity
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one tracked part [Part-A] at [Loc-1] with two bins, [Bin-1] holding 4 and [Bin-2] holding 3.
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- Click the [Part-A] row.
- Click the Track quantities and cost of goods switch so it is off.
- Read the Inventory section before saving.
- Click Save.
- Read the [Part-A] row's Bin Location / Quantity cell.
- Click the [Part-A] row and read the Inventory section.
--- EXPECTED
Expected results
- Step 3: Both bin rows are still shown with their quantities: [Bin-1] 4 and [Bin-2] 3.
- Step 5: Bin Location / Quantity still reads "[Bin-1] | 4" and "[Bin-2] | 3" (4 + 3 = 7 units still on the shelf; nothing was set to zero).
- Step 6: The dialog shows the switch off and the same two bins, 4 and 3.
Source — where this behaviour comes from
Epic SV-10647; story SV-10818 (Story 5, Change Tracking on an Existing Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S5-R3, S5-R3a, read 8 Oct 2026; design canvas board 5.2 (Switch off) and tracking-note-1. PRD v26 removed the old rule that set every bin to zero on confirmation (S5-E5 to S5-E9 of the IN-REVIEW draft). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S5-R3: “Turning tracking off hides Min and Max in the part dialog. It does not change the quantity in any bin.”
- S5-R3a: “The bin locations and their quantities stay visible in the part dialog, as a shelf reference (S4-R6).”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Turning tracking off keeps every bin quantity
Test case: C154773, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one tracked part [Part-A] at [Loc-1] with two bins, [Bin-1] holding 4 and [Bin-2] holding 3.
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL KEEP BINS and Part Number ZZAUTOTEST-PL-KEEPBINS-01; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 4.
      – Click + Add Bin Location, pick another bin ([Bin-2] = that bin; if the list offers no other bin, first add one in Settings → Bin Locations, e.g. ZZAUTOTEST-PL-BIN-B) and set its Quantity to 3.
      – Click Save. The dialog closes.
3. Write down [Part-A] = ZZAUTOTEST-PL-KEEPBINS-01.
4. Check the setup worked: search [Part-A]; Bin Location / Quantity shows "[Bin-1] | 4" and "[Bin-2] | 3" and Total Quantity "7 Available".



========== C425631 · section 20472 (S5 Edit tracking state)
TITLE: Turning tracking on marks the first bin as default when none is
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one untracked part [Part-A] at [Loc-1] holding two bins, [Bin-1] with 2 and [Bin-2] with 5, neither marked Default.
- The dialog may not let a part keep bins with no Default mark; if it does not, the case is Blocked (see Setup).
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- Search [Part-A] in Inventory and click its row.
- Click the Track quantities and cost of goods switch so it is on.
- Read the Inventory section.
- Click Save.
- Read the [Part-A] row in the list.
--- EXPECTED
Expected results
- Step 3: The first bin row, [Bin-1], now carries the Default pill; [Bin-2] does not. The quantities are unchanged: [Bin-1] 2 and [Bin-2] 5.
- Step 4: The dialog closes with no bin error.
- Step 5: Total Quantity shows "7 Available" (2 + 5 = 7) and Bin Location / Quantity shows "[Bin-1] | 2" and "[Bin-2] | 5".
Source — where this behaviour comes from
Epic SV-10647; story SV-10818 (Story 5, Change Tracking on an Existing Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S5-R8, read 8 Oct 2026; design canvas board 5.6 (Switch back on). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S5-R8: “In the part dialog, when the user turns tracking on and the part has bin locations but none is the default, the dialog marks the first one as the default.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Turning tracking on marks the first bin as default when none is
Test case: C425631, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one untracked part [Part-A] at [Loc-1] holding two bins, [Bin-1] with 2 and [Bin-2] with 5, neither marked Default.
• The dialog may not let a part keep bins with no Default mark; if it does not, the case is Blocked (see Setup).
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL TRACK ON NO DEFAULT and Part Number ZZAUTOTEST-PL-TRKON-NODEF-01; pick any Category (e.g. Uncategorized); type Cost 8.00.
      – Click the Track quantities and cost of goods switch so it is off (grey). Min and Max disappear.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Click + Add Bin Location, pick another bin ([Bin-2] = that bin; if the list offers no other bin, first add one in Settings → Bin Locations, e.g. ZZAUTOTEST-PL-BIN-B) and set its Quantity to 5.
      – Click Save. The dialog closes.
3. Write down [Part-A] = ZZAUTOTEST-PL-TRKON-NODEF-01.
4. Open [Part-A], take the Default mark off [Bin-1] so that neither bin row shows the Default pill, and click Save.
5. Check the setup worked: open [Part-A] again; the switch is off, [Bin-1] shows 2 and [Bin-2] shows 5, and neither row shows Default. If the dialog will not leave both rows without Default, mark this case Blocked with the comment "cannot make an untracked part with no default bin by hand". Close the dialog with Cancel.



========== C425632 · section 20472 (S5 Edit tracking state)
TITLE: The list shows Not Tracked right after Save, without a page reload
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one tracked part [Part-A] at [Loc-1] with one bin [Bin-1] holding 5.
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- With [Part-A] in the search box, click the [Part-A] row.
- Click the Track quantities and cost of goods switch so it is off.
- Click Cancel.
- Read the [Part-A] row.
- Click the [Part-A] row again and look at the switch.
- Click the switch so it is off and click Save.
- Without refreshing the browser, read the [Part-A] row.
--- EXPECTED
Expected results
- Step 4: The row still shows "5 Available": switching without saving changed nothing.
- Step 5: The switch is on.
- Step 7: The Total Quantity cell already reads "Not Tracked"; the page did not reload (the search box still holds [Part-A] and the list did not go blank or scroll to the top).
Source — where this behaviour comes from
Epic SV-10647; story SV-10818 (Story 5, Change Tracking on an Existing Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S5-R2, S5-R10, read 8 Oct 2026; design canvas boards 5.2 (Switch off) and 5.3 (The list says Not Tracked). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S5-R2: “The change applies when the user saves the part.”
- S5-R10: “After the save, the Total Qty column shows the new state without a page reload.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The list shows Not Tracked right after Save, without a page reload
Test case: C425632, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one tracked part [Part-A] at [Loc-1] with one bin [Bin-1] holding 5.
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL NO RELOAD and Part Number ZZAUTOTEST-PL-NORELOAD-01; pick any Category (e.g. Uncategorized); type Cost 6.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 5.
      – Click Save. The dialog closes.
3. Write down [Part-A] = ZZAUTOTEST-PL-NORELOAD-01.
4. Check the setup worked: search [Part-A]; the row shows Total Quantity "5 Available".



========== C425633 · section 20472 (S5 Edit tracking state)
TITLE: Turning tracking back on shows the count as it stands now
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one untracked part [Part-A] at [Loc-1] whose bins were 4 ([Bin-1]) and 3 ([Bin-2]) when tracking was turned off, and whose [Bin-1] was then changed to 1 while untracked.
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- Click the [Part-A] row.
- Click the Track quantities and cost of goods switch so it is on.
- Read the Inventory section.
- Click Save.
- Read the [Part-A] row's Total Quantity cell.
--- EXPECTED
Expected results
- Step 3: The bins show the quantities as they stand now: [Bin-1] 1 and [Bin-2] 3 (not the 4 and 3 held when tracking was turned off).
- Step 5: Total Quantity reads "4 Available" (1 + 3 = 4), not 7.
Source — where this behaviour comes from
Epic SV-10647; story SV-10818 (Story 5, Change Tracking on an Existing Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S5-R6, read 8 Oct 2026; design canvas board 5.6 (Switch back on) and tracking-note-5. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S5-R6: “Turning tracking on shows the count as it stands.”
- PRD §4 Key Decisions (tracking off): “Turning tracking back on shows the count as it stands.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Turning tracking back on shows the count as it stands now
Test case: C425633, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one untracked part [Part-A] at [Loc-1] whose bins were 4 ([Bin-1]) and 3 ([Bin-2]) when tracking was turned off, and whose [Bin-1] was then changed to 1 while untracked.
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL AS IT STANDS and Part Number ZZAUTOTEST-PL-ASITSTANDS-01; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 4.
      – Click + Add Bin Location, pick another bin ([Bin-2] = that bin; if the list offers no other bin, first add one in Settings → Bin Locations, e.g. ZZAUTOTEST-PL-BIN-B) and set its Quantity to 3.
      – Click Save. The dialog closes.
3. Write down [Part-A] = ZZAUTOTEST-PL-ASITSTANDS-01.
4. Open [Part-A] (search its part number in Inventory and click the row), click the Track quantities and cost of goods switch so it is off, and click Save.
5. Open [Part-A] again, change the Quantity of [Bin-1] from 4 to 1 and click Save.
6. Check the setup worked: the [Part-A] row shows "Not Tracked" and bins "[Bin-1] | 1" and "[Bin-2] | 3".



========== C425634 · section 20472 (S5 Edit tracking state)
TITLE: A part's core turns untracked together with the part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one tracked part [Part-A] at [Loc-1] with a Core Charge, so it has a core ([Core-A] = the core part, described "Core for" followed by [Part-A]'s description).
- The core must be visible as its own row in the Inventory list; if it is not, the core's state cannot be seen by hand (see Setup).
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- Search [Part-A] and click its row.
- Click the Track quantities and cost of goods switch so it is off and click Save.
- Search "Core for [Desc-A]" and read the [Core-A] row's Total Quantity.
- Search [Part-A], click its row, turn the switch on and click Save.
- Search "Core for [Desc-A]" and read the [Core-A] row again.
--- EXPECTED
Expected results
- Step 3: [Core-A] reads "Not Tracked", changed by the same save as [Part-A]; you did not edit the core.
- Step 5: [Core-A] shows a quantity again (it is tracked again), changed by the same save that turned [Part-A] back on.
Source — where this behaviour comes from
Epic SV-10647; story SV-10818 (Story 5, Change Tracking on an Existing Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S5-R9, read 8 Oct 2026. Design: no board shows a core; the core's row in the list is the visible proof. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S5-R9: “The part's core is tracked or untracked together with the part, in the same save. A core added to the part later, or in the same save, takes the part's tracking state.”
- PRD §4 Key Decisions (core): “A core follows its part. A core is never activated, deactivated, tracked or untracked on its own.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A part's core turns untracked together with the part
Test case: C425634, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one tracked part [Part-A] at [Loc-1] with a Core Charge, so it has a core ([Core-A] = the core part, described "Core for" followed by [Part-A]'s description).
• The core must be visible as its own row in the Inventory list; if it is not, the core's state cannot be seen by hand (see Setup).
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL CORE TRACKING and Part Number ZZAUTOTEST-PL-CORETRK-01; pick any Category (e.g. Uncategorized); type Cost 40.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Type Core Charge 25.00.
      – Click Save. The dialog closes.
3. Write down [Part-A] = ZZAUTOTEST-PL-CORETRK-01 and [Desc-A] = ZZAUTOTEST PL CORE TRACKING.
4. Search "Core for [Desc-A]" in the Inventory search. [Core-A] = the row found.
5. Check the setup worked: the [Core-A] row is listed and its Total Quantity is a number (not "Not Tracked"). If no core row can be found in the Inventory list, mark this case Blocked with the comment "core not visible in the Inventory list".



========== C425635 · section 20472 (S5 Edit tracking state)
TITLE: A core charge added to an untracked part gives it an untracked core
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one untracked part [Part-A] at [Loc-1] with no Core Charge (so no core yet).
- The core must be visible as its own row in the Inventory list; if it is not, the case is Blocked (see the last step's result).
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- Search [Part-A] and click its row.
- Type 30.00 in Core Charge and click Save.
- Search "Core for [Desc-A]" in the Inventory search.
- Read the core row's Total Quantity.
--- EXPECTED
Expected results
- Step 3: A core row ([Core-A]) is now listed. If no core row appears anywhere in the Inventory list, write "not checked by hand" and mark the case Blocked with the comment "core not visible in the Inventory list".
- Step 4: [Core-A] reads "Not Tracked": the new core took [Part-A]'s untracked state.
Source — where this behaviour comes from
Epic SV-10647; story SV-10818 (Story 5, Change Tracking on an Existing Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S5-R9, read 8 Oct 2026. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S5-R9: “The part's core is tracked or untracked together with the part, in the same save. A core added to the part later, or in the same save, takes the part's tracking state.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A core charge added to an untracked part gives it an untracked core
Test case: C425635, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one untracked part [Part-A] at [Loc-1] with no Core Charge (so no core yet).
• The core must be visible as its own row in the Inventory list; if it is not, the case is Blocked (see the last step's result).
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL NEW CORE UNTRACKED and Part Number ZZAUTOTEST-PL-NEWCORE-01; pick any Category (e.g. Uncategorized); type Cost 40.00.
      – Click the Track quantities and cost of goods switch so it is off (grey). Min and Max disappear.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Click Save. The dialog closes.
3. Write down [Part-A] = ZZAUTOTEST-PL-NEWCORE-01 and [Desc-A] = ZZAUTOTEST PL NEW CORE UNTRACKED.
4. Check the setup worked: [Part-A] shows "Not Tracked"; searching "Core for [Desc-A]" finds no row.



========== C425636 · section 20472 (S5 Edit tracking state)
TITLE: Cycle count shows Not Tracked for an untracked part and never counts it
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: two parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-CC-: [Part-T] tracked with 5 in [Bin-1]; [Part-U] untracked with 3 in [Bin-1].
- Settings: no Cycle count is in progress on the Inventory list.
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- With ZZAUTOTEST-PL-CC- in the search box, click the ⋮ actions menu and choose Cycle count.
- Read the Total Quantity and Count cells of both rows.
- Type 6 in the Count box of [Part-T].
- Click Save in the toolbar and confirm if asked.
- Read both rows in the list.
--- EXPECTED
Expected results
- Step 2: [Part-U]'s Total Quantity and Count cells both read "Not Tracked" in grey, and there is no Count box on its row; [Part-T] shows "5 Available" and an empty Count box.
- Step 5: [Part-T] now shows "6 Available" (counted 6 replaces 5, an adjustment of +1). [Part-U] still shows "Not Tracked" with "[Bin-1] | 3": it was not counted and its bin did not change.
Source — where this behaviour comes from
Epic SV-10647; story SV-10818 (Story 5, Change Tracking on an Existing Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S5-R12 and §8 User Feedback Summary (Untracked part in Cycle count), read 8 Oct 2026; design canvas board 5.7 (Cycle count leaves it out) and tracking-note-6. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S5-R12: “In Cycle count, an untracked part shows "Not Tracked" in the count column instead of count boxes, and it is never counted.”
- PRD §8 User Feedback Summary (Untracked part in Cycle count): “"Not Tracked"”
- PRD §8 User Feedback Summary (Untracked part in Cycle count): “In the count column, in place of the count boxes”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Cycle count shows Not Tracked for an untracked part and never counts it
Test case: C425636, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: two parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-CC-: [Part-T] tracked with 5 in [Bin-1]; [Part-U] untracked with 3 in [Bin-1].
• Settings: no Cycle count is in progress on the Inventory list.
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-T]: click New Inventory Part; type Description ZZAUTOTEST PL CYCLE COUNT TRACKED and Part Number ZZAUTOTEST-PL-CC-T1; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 5.
      – Click Save. The dialog closes.
3. Create [Part-U]: click New Inventory Part; type Description ZZAUTOTEST PL CYCLE COUNT UNTRACKED and Part Number ZZAUTOTEST-PL-CC-U1; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Click the Track quantities and cost of goods switch so it is off (grey). Min and Max disappear.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 3.
      – Click Save. The dialog closes.
4. Write down [Part-T] = ZZAUTOTEST-PL-CC-T1 and [Part-U] = ZZAUTOTEST-PL-CC-U1.
5. Check the setup worked: search ZZAUTOTEST-PL-CC-; [Part-T] shows "5 Available" and [Part-U] shows "Not Tracked" with "[Bin-1] | 3".



========== C425637 · section 20472 (S5 Edit tracking state)
TITLE: The printed count sheet leaves out an untracked part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: three parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-SHEET-: [Part-T1] and [Part-T2] tracked, [Part-U] untracked.
- Settings: no Cycle count is in progress on the Inventory list.
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- With ZZAUTOTEST-PL-SHEET- in the search box, click the ⋮ actions menu and choose Cycle count.
- Click the printer icon in the toolbar.
- Read the parts listed on the count sheet that opens.
- Click Cancel in the toolbar to leave Cycle count.
--- EXPECTED
Expected results
- Step 3: The count sheet lists [Part-T1] and [Part-T2] (2 parts) and does not list [Part-U].
Source — where this behaviour comes from
Epic SV-10647; story SV-10818 (Story 5, Change Tracking on an Existing Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S5-R13, read 8 Oct 2026; design canvas board 5.7 (Cycle count leaves it out; printer icon) and tracking-note-6. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S5-R13: “The printed count sheet leaves out untracked parts.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The printed count sheet leaves out an untracked part
Test case: C425637, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: three parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-SHEET-: [Part-T1] and [Part-T2] tracked, [Part-U] untracked.
• Settings: no Cycle count is in progress on the Inventory list.
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-T1]: click New Inventory Part; type Description ZZAUTOTEST PL COUNT SHEET TRACKED ONE and Part Number ZZAUTOTEST-PL-SHEET-T1; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Click Save. The dialog closes.
3. Create [Part-T2]: click New Inventory Part; type Description ZZAUTOTEST PL COUNT SHEET TRACKED TWO and Part Number ZZAUTOTEST-PL-SHEET-T2; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 4.
      – Click Save. The dialog closes.
4. Create [Part-U]: click New Inventory Part; type Description ZZAUTOTEST PL COUNT SHEET UNTRACKED and Part Number ZZAUTOTEST-PL-SHEET-U1; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Click the Track quantities and cost of goods switch so it is off (grey). Min and Max disappear.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 6.
      – Click Save. The dialog closes.
5. Write down [Part-T1] = ZZAUTOTEST-PL-SHEET-T1, [Part-T2] = ZZAUTOTEST-PL-SHEET-T2 and [Part-U] = ZZAUTOTEST-PL-SHEET-U1.
6. Check the setup worked: searching ZZAUTOTEST-PL-SHEET- lists exactly these three rows; only [Part-U] reads "Not Tracked".



========== C425638 · section 20472 (S5 Edit tracking state)
TITLE: Part History records Tracking turned off and Tracking turned on
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one tracked part [Part-A] at [Loc-1] with nothing on hand (its only bin holds 0).
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- Click the [Part-A] row, turn the Track quantities and cost of goods switch off and click Save.
- Click the clock icon (tooltip "Part History") on the [Part-A] row.
- Read the newest entry at the top of Part History.
- Go back to Parts → Inventory, search [Part-A], click its row, turn the switch on and click Save.
- Open Part History for [Part-A] again and read the two newest entries.
--- EXPECTED
Expected results
- Step 3: The newest entry's Event reads "Tracking turned off", with Staff [Me] and today's date and time, even though the part holds nothing.
- Step 5: The newest entry reads "Tracking turned on" and the one below it "Tracking turned off", each with Staff [Me], today's date and its own time.
Source — where this behaviour comes from
Epic SV-10647; story SV-10818 (Story 5, Change Tracking on an Existing Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S5-R11, with the entry text from S10-R22, read 8 Oct 2026; design canvas board 5.5 (Part History) and tracking-note-4. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S5-R11: “The change is recorded in Part History (S10-R22).”
- S10-R22: “Turning tracking off writes the entry "Tracking turned off" to the part's Part History, and turning it on writes "Tracking turned on". A part with nothing on hand still gets the entry.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Part History records Tracking turned off and Tracking turned on
Test case: C425638, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one tracked part [Part-A] at [Loc-1] with nothing on hand (its only bin holds 0).
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL TRACKING HISTORY and Part Number ZZAUTOTEST-PL-TRKHIST-01; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 0.
      – Click Save. The dialog closes.
3. Write down [Part-A] = ZZAUTOTEST-PL-TRKHIST-01 and [Me] = your own name as it shows in Part History's Staff column.
4. Check the setup worked: search [Part-A]; the row shows "0 Available".



========== C425639 · section 20472 (S5 Edit tracking state)
TITLE: Critical Reorder on the dashboard leaves out an untracked part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one tracked part [Part-A] at [Loc-1] holding 1 with Min 5 and Max 10 (below its Min, so it qualifies for reorder while tracked).
- The Dashboard may refresh its figures only about once an hour, hence the waits.
- The Dashboard must still have a Critical Reorder list on this build (see Setup).
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- Go to Parts → Inventory, search [Part-A], click its row, turn the Track quantities and cost of goods switch off and click Save.
- Wait about 70 minutes.
- Open the Dashboard at [Loc-1] and read the Critical Reorder list.
--- EXPECTED
Expected results
- Step 3: [Part-A] is no longer listed in Critical Reorder, although it still holds 1 against a Min of 5.
Source — where this behaviour comes from
Epic SV-10647; story SV-10818 (Story 5, Change Tracking on an Existing Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S5-R14, read 8 Oct 2026. Design: no dashboard board. Tech plan Phase 4 (fetchCriticalReorder leaves out untracked parts). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S5-R14: “The dashboard's Critical Reorder list leaves out untracked parts.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Critical Reorder on the dashboard leaves out an untracked part
Test case: C425639, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one tracked part [Part-A] at [Loc-1] holding 1 with Min 5 and Max 10 (below its Min, so it qualifies for reorder while tracked).
• The Dashboard may refresh its figures only about once an hour, hence the waits.
• The Dashboard must still have a Critical Reorder list on this build (see Setup).
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL CRITICAL REORDER and Part Number ZZAUTOTEST-PL-REORDER-01; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and type Min 5 and Max 10.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 1.
      – Click Save. The dialog closes.
3. Write down [Part-A] = ZZAUTOTEST-PL-REORDER-01.
4. Wait about 70 minutes, then open the Dashboard (the page ShopView opens after sign-in) at [Loc-1] and find the Critical Reorder list.
5. Check the setup worked: [Part-A] is listed in Critical Reorder. If the Dashboard has no Critical Reorder list, mark this case Blocked with the comment "no Critical Reorder list on this build's Dashboard". If the list exists but [Part-A] is not in it after 2 hours, mark Blocked with the comment "tracked part below Min not listed".



========== C425640 · section 20472 (S5 Edit tracking state)
TITLE: Importing Min, Max and a bin quantity for an untracked part saves them
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one untracked part [Part-A] at [Loc-1] with Min 2, Max 6 (saved while it was tracked) and one bin [Bin-1] holding 4.
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- In Settings → Data Import → Inventory, upload [File-1] and run the import.
- Go to Parts → Inventory, search [Part-A] and read the row (Total Quantity, Bin Location / Quantity, Min, Max).
- Click the clock icon (tooltip "Part History") on the row and read the newest entries.
--- EXPECTED
Expected results
- Step 1: The import finishes without an error for the [Part-A] row.
- Step 2: The row still reads "Not Tracked"; Bin Location / Quantity reads "[Bin-1] | 9", Min 3 and Max 8: the imported values were saved just as on a tracked part.
- Step 3: Part History has the entry "Min/Max updated | Min: 2 → 3 | Max: 6 → 8 | Source: Import".
Source — where this behaviour comes from
Epic SV-10647; story SV-10818 (Story 5, Change Tracking on an Existing Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S5-E1, with the entry text from S10-R22a, read 8 Oct 2026. Tech plan Phase 6 (import applies Min/Max and bins to an untracked part). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S5-E1: “The parts CSV import can change Min, Max and bin quantities on an untracked part. The values are saved the same way as on a tracked part, and a Min or Max change is written to Part History (S10-R22a).”
- S10-R22a: “Changing Min or Max writes "Min/Max updated | Min: {old} → {new} | Max: {old} → {new} | Source: {source}" to the part's Part History, where the source is "Edit Part" or "Import". No entry is written when neither value changed.”
- Tech plan Phase 6 (ImportInventoryCommandHandler): “Min/Max and bin quantities apply to an untracked part exactly as to a tracked one”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Importing Min, Max and a bin quantity for an untracked part saves them
Test case: C425640, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one untracked part [Part-A] at [Loc-1] with Min 2, Max 6 (saved while it was tracked) and one bin [Bin-1] holding 4.
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL IMPORT UNTRACKED and Part Number ZZAUTOTEST-PL-IMPORT-U1; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and type Min 2 and Max 6.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 4.
      – Click Save. The dialog closes.
3. Write down [Part-A] = ZZAUTOTEST-PL-IMPORT-U1 and [Desc-A] = ZZAUTOTEST PL IMPORT UNTRACKED.
4. Open [Part-A] (search its part number in Inventory and click the row), click the Track quantities and cost of goods switch so it is off, and click Save.
5. Go to Settings → Data Import → Inventory, download the template and fill one row: part number [Part-A], description [Desc-A], the same category, bin [Bin-1] with quantity 9, Min 3 and Max 8. Save it as [File-1].
6. Check the setup worked: the [Part-A] row shows "Not Tracked", bin "[Bin-1] | 4", Min 2 and Max 6; [File-1] holds one row with 9, 3 and 8.



========== C425657 · section 20472 (S5 Edit tracking state)
TITLE: Inventory Value for an earlier date still counts a part untracked today
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one part [Part-A] at [Loc-1] that was tracked, holding 4 at a cost of $10.00, at the end of Day 1, and is turned untracked on Day 2.
- Settings: the Inventory Value report records each day's stock overnight, so Day 1's figures exist on Day 2.
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- On [Day-2], go to Parts → Inventory, search [Part-A], click its row, turn the Track quantities and cost of goods switch off and click Save.
- Open Reports → Inventory Value, set the Location filter to [Loc-1] only and the as-of date to [Day-1], and type [Part-A] in the report's Search box.
- Read the [Part-A] row and the Totals row.
- Change the as-of date to today ([Day-2]).
- Read the rows and the Totals row.
--- EXPECTED
Expected results
- Step 3: [Part-A] is still listed for [Day-1] with Qty 4.00, Unit Cost $10.00 and Total Cost $40.00 (4 × $10.00); Totals Qty 4.00 and Total Cost $40.00. Turning tracking off today did not change Day 1's figures.
- Step 5: For today, [Part-A] is not listed; Totals Qty 0.00 and Total Cost $0.00 (or the report's empty state).
Source — where this behaviour comes from
Epic SV-10647; story SV-10817 (Story 4, Create an Untracked Part); story SV-10818 (Story 5, Change Tracking on an Existing Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), §2 Feature Overview, Accounting, and S4-R9, read 8 Oct 2026. Tech plan Product addition v22 (past-date Inventory Value is as-of). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- PRD §2 Accounting: “The Inventory Value report run for a past date shows each part as it was on that date. Turning tracking off today does not change an earlier date's figures.”
- S4-R9: “The Inventory Value report does not include untracked parts.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Inventory Value for an earlier date still counts a part untracked today
Test case: C425657, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one part [Part-A] at [Loc-1] that was tracked, holding 4 at a cost of $10.00, at the end of Day 1, and is turned untracked on Day 2.
• Settings: the Inventory Value report records each day's stock overnight, so Day 1's figures exist on Day 2.
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Day 1: Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL IV PAST DATE and Part Number ZZAUTOTEST-PL-IVPAST-01; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 4.
      – Click Save. The dialog closes.
3. Write down [Part-A] = ZZAUTOTEST-PL-IVPAST-01 and [Day-1] = today's date.
4. Wait until the next calendar day ([Day-2]).
5. Check the setup worked: on [Day-2], the Inventory Value report at [Loc-1], as of [Day-1], searched [Part-A], lists [Part-A] with Qty 4.00 and Total Cost $40.00. If it does not, the overnight record did not run; mark Blocked with the comment "no Inventory Value record for [Day-1]".



========== C425658 · section 20472 (S5 Edit tracking state)
TITLE: Inventory Value before the release date counts every part as tracked
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: [Old-Date] = a date before the Part Lifecycle build reached this environment; any date on or before 7 October 2026 is safe. [Part-Old] = a part at [Loc-1] that the Inventory Value report lists for [Old-Date].
- This case cannot use a part created by itself, because the part has to exist before the release; prefer a part whose number starts with ZZAUTOTEST, and put the part back to tracked at the end.
--- STEPS
- Go to Parts → Inventory, search [Part-Old], click its row, turn the Track quantities and cost of goods switch off and click Save.
- Open Reports → Inventory Value, Location [Loc-1] only, as-of date [Old-Date], and type [Part-Old] in the Search box.
- Read the [Part-Old] row.
- Change the as-of date to today and read the list.
- Go back to [Part-Old], turn the switch on and click Save (restores the part).
--- EXPECTED
Expected results
- Step 3: [Part-Old] is listed for [Old-Date] with the same Qty [Qty-Old] and Total Cost [Cost-Old] as before you turned tracking off: a date before release counts it as tracked.
- Step 4: For today, [Part-Old] is not listed (it is untracked today).
- Step 5: [Part-Old] shows a quantity again in the Inventory list.
Source — where this behaviour comes from
Epic SV-10647; story SV-10817 (Story 4, Create an Untracked Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), §2 Feature Overview, Accounting, read 8 Oct 2026. Tech plan D6 (records made before release count every part as tracked). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- PRD §2 Accounting: “The Inventory Value report run for a date before release counts every part as tracked.”
- S4-R9: “The Inventory Value report does not include untracked parts.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Inventory Value before the release date counts every part as tracked
Test case: C425658, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: [Old-Date] = a date before the Part Lifecycle build reached this environment; any date on or before 7 October 2026 is safe. [Part-Old] = a part at [Loc-1] that the Inventory Value report lists for [Old-Date].
- This case cannot use a part created by itself, because the part has to exist before the release; prefer a part whose number starts with ZZAUTOTEST, and put the part back to tracked at the end.
# Part 1. Setup for manual QA tester
- Open Reports → Inventory Value, set the Location filter to [Loc-1] only and the as-of date to [Old-Date].
- Pick one listed part, preferably one whose number starts with ZZAUTOTEST. [Part-Old] = its part number; [Qty-Old] and [Cost-Old] = its Qty and Total Cost on that date.
- Check the setup worked: [Part-Old] is listed for [Old-Date] with a Qty and Total Cost written down. If the report lists nothing for any date before 7 October 2026, mark Blocked with the comment "no Inventory Value records before the release".



========== C425659 · section 20472 (S5 Edit tracking state)
TITLE: The dashboard inventory figure keeps an untracked part's stock
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-DASH] = a location created for this case that holds only this case's part, so its figures come from that part alone.
- Data: one part [Part-A] at [Loc-DASH] holding 6 at a cost of $10.00 ($60.00 of stock), tracked at the start.
- The Dashboard may refresh its figures only about once an hour, hence the waits. The Dashboard must still show an inventory value figure on this build (see Setup).
- The opening inventory used for accounting cannot be seen on any screen; that part is not checked by hand.
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- Go to Parts → Inventory at [Loc-DASH], search [Part-A], click its row, turn the Track quantities and cost of goods switch off and click Save.
- Wait about 70 minutes.
- Open the Dashboard at [Loc-DASH] and read the inventory value figure.
- Open Reports → Inventory Value, Location [Loc-DASH] only, as-of date today, and read the Totals row.
--- EXPECTED
Expected results
- Step 3: The Dashboard figure still reads $60.00, the same as [Dash-Before]: the untracked part's stock is kept.
- Step 4: The Inventory Value report shows Total Cost $0.00 (no rows): the report leaves the part out while the Dashboard keeps it.
- Steps 1 to 4: The opening inventory used for accounting cannot be checked by hand; write "not checked by hand" for it in the result comment.
Source — where this behaviour comes from
Epic SV-10647; story SV-10817 (Story 4, Create an Untracked Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), §2 Feature Overview, Accounting, read 8 Oct 2026. Tech plan Phase 4 (do not add a tracking filter to the dashboard stock figures or the accounting opening inventory). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- PRD §2 Accounting: “The dashboard's inventory figure and the opening inventory used for accounting keep untracked parts, because that stock still sits in the books.”
- PRD §2 Accounting: “The Inventory Value report leaves out untracked parts, because they keep no stock count to value. This is a report change only.”
- Tech plan Phase 4: “The PRD's Accounting section keeps untracked parts in all of them.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The dashboard inventory figure keeps an untracked part's stock
Test case: C425659, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-DASH] = a location created for this case that holds only this case's part, so its figures come from that part alone.
• Data: one part [Part-A] at [Loc-DASH] holding 6 at a cost of $10.00 ($60.00 of stock), tracked at the start.
• The Dashboard may refresh its figures only about once an hour, hence the waits. The Dashboard must still show an inventory value figure on this build (see Setup).
• The opening inventory used for accounting cannot be seen on any screen; that part is not checked by hand.
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Go to Settings → Locations and add a location named ZZAUTOTEST PL DASHBOARD LOC (fill the required fields with any values). [Loc-DASH] = this location.
2. Pick [Loc-DASH] in the location switcher and open Parts → Inventory.
3. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL DASHBOARD STOCK and Part Number ZZAUTOTEST-PL-DASH-01; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 6.
      – Click Save. The dialog closes.
4. Write down [Part-A] = ZZAUTOTEST-PL-DASH-01.
5. Wait about 70 minutes, then open the Dashboard (the page ShopView opens after sign-in) at [Loc-DASH] and find its inventory value figure. [Dash-Before] = that figure.
6. Check the setup worked: [Dash-Before] reads $60.00 (6 × $10.00). If the Dashboard has no inventory value figure, mark Blocked with the comment "no inventory figure on this build's Dashboard".



========== C154774 · section 20473 (S6 Search & sort by tracking state)
TITLE: Searching not tracked returns untracked parts plus normal matches
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: three parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-SRCHA-: [Part-U] untracked, whose fields contain neither "not" nor "tracked"; [Part-N] tracked, whose description contains the words NOT TRACKED; [Part-P] tracked, whose fields contain neither word.
- Other parts in the environment will also be returned; this case checks only these three.
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- Type not tracked in the Inventory search.
- Click the Part Number column header until it sorts Z to A, so the ZZAUTOTEST rows come first, and read which of the three parts are listed.
- Replace the search text with Not (capital N).
- Read which of the three parts are listed.
- Replace the search text with TRACKED typed with two spaces before and two spaces after it.
- Read which of the three parts are listed.
--- EXPECTED
Expected results
- Step 2: [Part-U] is listed (it reads "Not Tracked"), [Part-N] is listed (its description matches) and [Part-P] is not listed.
- Step 4: The same: [Part-U] and [Part-N] listed, [Part-P] not listed (upper and lower case do not matter).
- Step 6: The same: [Part-U] and [Part-N] listed, [Part-P] not listed (the spaces before and after do not matter).
Source — where this behaviour comes from
Epic SV-10647; story SV-10819 (Story 6, Search and Sort the Inventory List by Tracking State); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S6-R1, read 8 Oct 2026; design canvas board 5.4 (Finding untracked parts) and tracking-note-3. Tech plan clarification Q5 (additive search). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S6-R1: “Typing "not tracked", "not" or "tracked" in the Inventory search returns the untracked parts, together with every part those words match on part number, description, tags and the other standard fields. Upper and lower case, and spaces before and after the term, do not matter.”
- Tech plan §1 Clarifications (Q5 "not"/"tracked" search): “Additive: untracked parts plus the normal matches (S6-R1)”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Searching not tracked returns untracked parts plus normal matches
Test case: C154774, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: three parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-SRCHA-: [Part-U] untracked, whose fields contain neither "not" nor "tracked"; [Part-N] tracked, whose description contains the words NOT TRACKED; [Part-P] tracked, whose fields contain neither word.
• Other parts in the environment will also be returned; this case checks only these three.
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-U]: click New Inventory Part; type Description ZZAUTOTEST PL SEARCH A WASHER and Part Number ZZAUTOTEST-PL-SRCHA-U1; pick any Category (e.g. Uncategorized); type Cost 2.00.
      – Click the Track quantities and cost of goods switch so it is off (grey). Min and Max disappear.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 3.
      – Click Save. The dialog closes.
3. Create [Part-N]: click New Inventory Part; type Description ZZAUTOTEST PL SEARCH A NOT TRACKED LABEL and Part Number ZZAUTOTEST-PL-SRCHA-N1; pick any Category (e.g. Uncategorized); type Cost 2.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 4.
      – Click Save. The dialog closes.
4. Create [Part-P]: click New Inventory Part; type Description ZZAUTOTEST PL SEARCH A PLAIN GASKET and Part Number ZZAUTOTEST-PL-SRCHA-P1; pick any Category (e.g. Uncategorized); type Cost 2.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 5.
      – Click Save. The dialog closes.
5. Write down [Part-U] = ZZAUTOTEST-PL-SRCHA-U1, [Part-N] = ZZAUTOTEST-PL-SRCHA-N1 and [Part-P] = ZZAUTOTEST-PL-SRCHA-P1.
6. Check the setup worked: searching ZZAUTOTEST-PL-SRCHA- lists the three rows; only [Part-U] reads "Not Tracked".



========== C154775 · section 20473 (S6 Search & sort by tracking state)
TITLE: Total Quantity sort puts untracked parts below tracked parts both ways
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: five parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-SORTQ-, each holding one bin with only a positive quantity:- [Part-ALPHA] tracked, description ending ALPHA, 5 on hand (part number ending -12)
- [Part-BRAVO] tracked, description ending BRAVO, 5 on hand (part number ending -11)
- [Part-CHARLIE] tracked, description ending CHARLIE, 2 on hand (part number ending -15)
- [Part-XRAY] untracked, description ending XRAY, 1 on the shelf (part number ending -14)
- [Part-YANKEE] untracked, description ending YANKEE, 9 on the shelf (part number ending -13)
- The part numbers deliberately run against the descriptions, so a sort by number would give a different order. Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- With ZZAUTOTEST-PL-SORTQ- in the search box, click the Total Quantity column header once (ascending).
- Read the five rows from top to bottom.
- Click the Total Quantity header again (descending).
- Read the five rows from top to bottom.
--- EXPECTED
Expected results
- Step 1: The Total Quantity column sorts (its header shows a sort arrow).
- Step 2: Order: CHARLIE (2), ALPHA (5), BRAVO (5), XRAY, YANKEE. Tracked parts go up by quantity (2 before 5); ALPHA comes before BRAVO because equal quantities are ordered by description A to Z; both untracked parts come after every tracked part, XRAY before YANKEE by description.
- Step 4: Order: ALPHA (5), BRAVO (5), CHARLIE (2), XRAY, YANKEE. Tracked parts go down by quantity; ALPHA still comes before BRAVO (description A to Z); the untracked parts are still last, still XRAY then YANKEE, even though YANKEE has 9 on the shelf.
Source — where this behaviour comes from
Epic SV-10647; story SV-10819 (Story 6, Search and Sort the Inventory List by Tracking State); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S6-R3, S6-R4, S6-R5, S6-R6, S6-R7, read 8 Oct 2026; design canvas board 5.4 (Finding untracked parts) and tracking-note-3. The column is headed "Total Quantity" on the design and today's list; PRD v26 calls it "Total Qty". Tech plan Phase 5 notes the sort reads the stored quantity while the cell shows available stock, so this case uses parts with positive bins only. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S6-R3: “The Total Qty column can be sorted.”
- S6-R4: “When that column is sorted, untracked parts sit below every tracked part, in both sort directions.”
- S6-R5: “Tracked parts sort against each other by quantity.”
- S6-R6: “Tracked parts with the same quantity are then ordered by description, A to Z.”
- S6-R7: “Untracked parts are ordered by description, A to Z.”
- Tech plan Phase 5 (known gap): “Known pre-existing gap, not fixed here: the SQL sorts on `p.quantity`, while the cell shows the bin-derived available quantity.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Total Quantity sort puts untracked parts below tracked parts both ways
Test case: C154775, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: five parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-SORTQ-, each holding one bin with only a positive quantity:
      – [Part-ALPHA] tracked, description ending ALPHA, 5 on hand (part number ending -12)
      – [Part-BRAVO] tracked, description ending BRAVO, 5 on hand (part number ending -11)
      – [Part-CHARLIE] tracked, description ending CHARLIE, 2 on hand (part number ending -15)
      – [Part-XRAY] untracked, description ending XRAY, 1 on the shelf (part number ending -14)
      – [Part-YANKEE] untracked, description ending YANKEE, 9 on the shelf (part number ending -13)
      – The part numbers deliberately run against the descriptions, so a sort by number would give a different order. Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-ALPHA]: click New Inventory Part; type Description ZZAUTOTEST PL SORTQ ALPHA and Part Number ZZAUTOTEST-PL-SORTQ-12; pick any Category (e.g. Uncategorized); type Cost 3.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 5.
      – Click Save. The dialog closes.
3. Create [Part-BRAVO]: click New Inventory Part; type Description ZZAUTOTEST PL SORTQ BRAVO and Part Number ZZAUTOTEST-PL-SORTQ-11; pick any Category (e.g. Uncategorized); type Cost 3.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 5.
      – Click Save. The dialog closes.
4. Create [Part-CHARLIE]: click New Inventory Part; type Description ZZAUTOTEST PL SORTQ CHARLIE and Part Number ZZAUTOTEST-PL-SORTQ-15; pick any Category (e.g. Uncategorized); type Cost 3.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Click Save. The dialog closes.
5. Create [Part-XRAY]: click New Inventory Part; type Description ZZAUTOTEST PL SORTQ XRAY and Part Number ZZAUTOTEST-PL-SORTQ-14; pick any Category (e.g. Uncategorized); type Cost 3.00.
      – Click the Track quantities and cost of goods switch so it is off (grey). Min and Max disappear.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 1.
      – Click Save. The dialog closes.
6. Create [Part-YANKEE]: click New Inventory Part; type Description ZZAUTOTEST PL SORTQ YANKEE and Part Number ZZAUTOTEST-PL-SORTQ-13; pick any Category (e.g. Uncategorized); type Cost 3.00.
      – Click the Track quantities and cost of goods switch so it is off (grey). Min and Max disappear.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 9.
      – Click Save. The dialog closes.
7. Check the setup worked: searching ZZAUTOTEST-PL-SORTQ- lists five rows: ALPHA 5 Available, BRAVO 5 Available, CHARLIE 2 Available, XRAY Not Tracked (bin 1), YANKEE Not Tracked (bin 9).



========== C425641 · section 20473 (S6 Search & sort by tracking state)
TITLE: Searching track or no does not return untracked parts by their tracking
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: three parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-SRCHB-: [Part-U] untracked, whose fields contain neither "track" nor "no"; [Part-K] tracked, whose description contains TRACKBAR; [Part-O] tracked, whose description contains NOZZLE.
- Every ZZAUTOTEST name contains the letter t, so the single-letter term "t" cannot be checked with this case's own data; "track" and "no" stand in for part of the words.
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- Type track in the Inventory search.
- Sort the Part Number column Z to A and read which of the three parts are listed.
- Replace the search text with no.
- Read which of the three parts are listed.
--- EXPECTED
Expected results
- Step 2: [Part-K] is listed (TRACKBAR matches); [Part-U] is not listed, although it is untracked; [Part-O] is not listed.
- Step 4: [Part-O] is listed (NOZZLE matches); [Part-U] is not listed; [Part-K] is not listed.
Source — where this behaviour comes from
Epic SV-10647; story SV-10819 (Story 6, Search and Sort the Inventory List by Tracking State); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S6-R2, read 8 Oct 2026; design canvas board 5.4 (Finding untracked parts). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S6-R2: “Any other term, including part of those words such as "t" or "track", matches on part number, description, tags and the other standard fields, never on tracking state.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Searching track or no does not return untracked parts by their tracking
Test case: C425641, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: three parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-SRCHB-: [Part-U] untracked, whose fields contain neither "track" nor "no"; [Part-K] tracked, whose description contains TRACKBAR; [Part-O] tracked, whose description contains NOZZLE.
• Every ZZAUTOTEST name contains the letter t, so the single-letter term "t" cannot be checked with this case's own data; "track" and "no" stand in for part of the words.
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-U]: click New Inventory Part; type Description ZZAUTOTEST PL SEARCH B WASHER and Part Number ZZAUTOTEST-PL-SRCHB-U1; pick any Category (e.g. Uncategorized); type Cost 2.00.
      – Click the Track quantities and cost of goods switch so it is off (grey). Min and Max disappear.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 3.
      – Click Save. The dialog closes.
3. Create [Part-K]: click New Inventory Part; type Description ZZAUTOTEST PL SEARCH B TRACKBAR and Part Number ZZAUTOTEST-PL-SRCHB-K1; pick any Category (e.g. Uncategorized); type Cost 2.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 4.
      – Click Save. The dialog closes.
4. Create [Part-O]: click New Inventory Part; type Description ZZAUTOTEST PL SEARCH B NOZZLE and Part Number ZZAUTOTEST-PL-SRCHB-O1; pick any Category (e.g. Uncategorized); type Cost 2.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 5.
      – Click Save. The dialog closes.
5. Write down [Part-U] = ZZAUTOTEST-PL-SRCHB-U1, [Part-K] = ZZAUTOTEST-PL-SRCHB-K1 and [Part-O] = ZZAUTOTEST-PL-SRCHB-O1.
6. Check the setup worked: searching ZZAUTOTEST-PL-SRCHB- lists the three rows; only [Part-U] reads "Not Tracked".



========== C425642 · section 20473 (S6 Search & sort by tracking state)
TITLE: With no untracked parts, searching not tracked returns no results
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-NT] = a location created for this case that holds no untracked part; it holds one tracked part only.
- Data: [Part-A] tracked at [Loc-NT], whose fields contain neither "not" nor "tracked".
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- At [Loc-NT], on the Active tab, type not tracked in the Inventory search.
- Read the list.
--- EXPECTED
Expected results
- Step 2: No part is listed; the list shows its usual empty search result (e.g. "No parts match the search "not tracked".").
Source — where this behaviour comes from
Epic SV-10647; story SV-10819 (Story 6, Search and Sort the Inventory List by Tracking State); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S6-N1, read 8 Oct 2026; design canvas board 3.4 (Done; the empty search state). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S6-N1: “If there are no untracked parts, searching "not tracked" returns no results.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: With no untracked parts, searching not tracked returns no results
Test case: C425642, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-NT] = a location created for this case that holds no untracked part; it holds one tracked part only.
• Data: [Part-A] tracked at [Loc-NT], whose fields contain neither "not" nor "tracked".
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Go to Settings → Locations and add a location named ZZAUTOTEST PL NO UNTRACKED LOC (fill the required fields with any values). [Loc-NT] = this location.
2. Pick [Loc-NT] in the location switcher in the top bar and open Parts → Inventory.
3. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL PLAIN WASHER and Part Number ZZAUTOTEST-PL-NOUNT-01; pick any Category (e.g. Uncategorized); type Cost 2.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 3.
      – Click Save. The dialog closes.
4. Write down [Part-A] = ZZAUTOTEST-PL-NOUNT-01.
5. Check the setup worked: at [Loc-NT] the Active tab lists exactly one part, [Part-A], with "3 Available", and the Inactive tab lists none.



========== C425643 · section 20473 (S6 Search & sort by tracking state)
TITLE: Sorting by Average Cost ignores whether parts are tracked
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: four parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-SORTC-:- [Part-ALPHA] tracked, Average Cost $7.00
- [Part-BRAVO] untracked, Average Cost $9.00
- [Part-DELTA] untracked, Average Cost $3.00
- [Part-ECHO] tracked, Average Cost $9.00
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- With ZZAUTOTEST-PL-SORTC- in the search box, click the Average Cost column header once (ascending).
- Read the four rows from top to bottom.
- Click the Average Cost header again (descending).
- Read the four rows from top to bottom.
--- EXPECTED
Expected results
- Step 2: Order: DELTA ($3.00, untracked), ALPHA ($7.00), BRAVO ($9.00, untracked), ECHO ($9.00). Cost decides first; BRAVO and ECHO share $9.00 and are ordered by description A to Z; the untracked DELTA comes first and is not pushed below the tracked parts.
- Step 4: Order: BRAVO ($9.00, untracked), ECHO ($9.00), ALPHA ($7.00), DELTA ($3.00, untracked). The untracked BRAVO is at the top; the $9.00 pair is still BRAVO before ECHO.
Source — where this behaviour comes from
Epic SV-10647; story SV-10819 (Story 6, Search and Sort the Inventory List by Tracking State); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S6-R8, read 8 Oct 2026. Tech plan Phase 5 (any other sort column, then description A to Z). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S6-R8: “Sorting by any other column sorts by that column first, then by description, A to Z. Tracking state plays no part in it.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Sorting by Average Cost ignores whether parts are tracked
Test case: C425643, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: four parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-SORTC-:
      – [Part-ALPHA] tracked, Average Cost $7.00
      – [Part-BRAVO] untracked, Average Cost $9.00
      – [Part-DELTA] untracked, Average Cost $3.00
      – [Part-ECHO] tracked, Average Cost $9.00
      – Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-ALPHA]: click New Inventory Part; type Description ZZAUTOTEST PL SORTC ALPHA and Part Number ZZAUTOTEST-PL-SORTC-01; pick any Category (e.g. Uncategorized); type Cost 7.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Click Save. The dialog closes.
3. Create [Part-BRAVO]: click New Inventory Part; type Description ZZAUTOTEST PL SORTC BRAVO and Part Number ZZAUTOTEST-PL-SORTC-02; pick any Category (e.g. Uncategorized); type Cost 9.00.
      – Click the Track quantities and cost of goods switch so it is off (grey). Min and Max disappear.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Click Save. The dialog closes.
4. Create [Part-DELTA]: click New Inventory Part; type Description ZZAUTOTEST PL SORTC DELTA and Part Number ZZAUTOTEST-PL-SORTC-03; pick any Category (e.g. Uncategorized); type Cost 3.00.
      – Click the Track quantities and cost of goods switch so it is off (grey). Min and Max disappear.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Click Save. The dialog closes.
5. Create [Part-ECHO]: click New Inventory Part; type Description ZZAUTOTEST PL SORTC ECHO and Part Number ZZAUTOTEST-PL-SORTC-04; pick any Category (e.g. Uncategorized); type Cost 9.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Click Save. The dialog closes.
6. Check the setup worked: searching ZZAUTOTEST-PL-SORTC- lists four rows with Average Cost ALPHA $7.00, BRAVO $9.00, DELTA $3.00, ECHO $9.00; BRAVO and DELTA read "Not Tracked".



========== C425644 · section 20473 (S6 Search & sort by tracking state)
TITLE: With no sort chosen, tracked parts are listed before untracked parts
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: four parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-NOSORT-: [Part-ALPHA] and [Part-CHARLIE] tracked; [Part-AARDVARK] and [Part-ZULU] untracked.
- Settings: no column of the Inventory list is sorted (no sort arrow on any header).
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- With no column sorted, type ZZAUTOTEST-PL-NOSORT- in the Inventory search.
- Read the four rows from top to bottom.
--- EXPECTED
Expected results
- Step 2: Order: ALPHA, CHARLIE (the tracked parts, description A to Z), then AARDVARK, ZULU (the untracked parts, description A to Z). AARDVARK sorts first alphabetically but still comes after both tracked parts.
Source — where this behaviour comes from
Epic SV-10647; story SV-10819 (Story 6, Search and Sort the Inventory List by Tracking State); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S6-R9, read 8 Oct 2026. Tech plan Phase 5 (no sort: tracked first, then description A to Z). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S6-R9: “With no sort chosen, tracked parts are listed first and untracked parts after them, each ordered by description, A to Z.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: With no sort chosen, tracked parts are listed before untracked parts
Test case: C425644, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: four parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-NOSORT-: [Part-ALPHA] and [Part-CHARLIE] tracked; [Part-AARDVARK] and [Part-ZULU] untracked.
• Settings: no column of the Inventory list is sorted (no sort arrow on any header).
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-CHARLIE]: click New Inventory Part; type Description ZZAUTOTEST PL NOSORT CHARLIE and Part Number ZZAUTOTEST-PL-NOSORT-01; pick any Category (e.g. Uncategorized); type Cost 2.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 1.
      – Click Save. The dialog closes.
3. Create [Part-ALPHA]: click New Inventory Part; type Description ZZAUTOTEST PL NOSORT ALPHA and Part Number ZZAUTOTEST-PL-NOSORT-02; pick any Category (e.g. Uncategorized); type Cost 2.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 8.
      – Click Save. The dialog closes.
4. Create [Part-ZULU]: click New Inventory Part; type Description ZZAUTOTEST PL NOSORT ZULU and Part Number ZZAUTOTEST-PL-NOSORT-03; pick any Category (e.g. Uncategorized); type Cost 2.00.
      – Click the Track quantities and cost of goods switch so it is off (grey). Min and Max disappear.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 1.
      – Click Save. The dialog closes.
5. Create [Part-AARDVARK]: click New Inventory Part; type Description ZZAUTOTEST PL NOSORT AARDVARK and Part Number ZZAUTOTEST-PL-NOSORT-04; pick any Category (e.g. Uncategorized); type Cost 2.00.
      – Click the Track quantities and cost of goods switch so it is off (grey). Min and Max disappear.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 1.
      – Click Save. The dialog closes.
6. If any column header shows a sort arrow, click that header until the arrow disappears, or sign out and in again.
7. Check the setup worked: no header shows a sort arrow, and searching ZZAUTOTEST-PL-NOSORT- lists four rows.



========== C425645 · section 20473 (S6 Search & sort by tracking state)
TITLE: Supply filter shows an untracked part only under All
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: two parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-SUPPLY-, each holding 1 with Min 5 and Max 10: [Part-T] tracked (below its Min, so under-supplied) and [Part-U] untracked (Min and Max saved while it was tracked).
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- With ZZAUTOTEST-PL-SUPPLY- in the search box, open the Supply filter and choose Under-supplied.
- Read which of the two parts are listed.
- Change the Supply filter to Well-supplied and read the list.
- Change the Supply filter to Over-supplied and read the list.
- Change the Supply filter to All and read the list.
--- EXPECTED
Expected results
- Step 2: [Part-T] is listed (1 is below its Min of 5); [Part-U] is not listed, although it also holds 1 against a Min of 5.
- Step 3: [Part-U] is not listed (and neither is [Part-T]).
- Step 4: [Part-U] is not listed (and neither is [Part-T]).
- Step 5: Both [Part-T] and [Part-U] are listed.
Source — where this behaviour comes from
Epic SV-10647; story SV-10819 (Story 6, Search and Sort the Inventory List by Tracking State); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S6-R10, read 8 Oct 2026. Tech plan clarification Q13 and Phase 4 (Supply filter). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S6-R10: “In the Supply filter, an untracked part shows only under "All". Under-supplied, Well-supplied and Over-supplied leave it out.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Supply filter shows an untracked part only under All
Test case: C425645, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: two parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-SUPPLY-, each holding 1 with Min 5 and Max 10: [Part-T] tracked (below its Min, so under-supplied) and [Part-U] untracked (Min and Max saved while it was tracked).
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-T]: click New Inventory Part; type Description ZZAUTOTEST PL SUPPLY TRACKED and Part Number ZZAUTOTEST-PL-SUPPLY-T1; pick any Category (e.g. Uncategorized); type Cost 2.00.
      – Leave Track quantities and cost of goods on and type Min 5 and Max 10.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 1.
      – Click Save. The dialog closes.
3. Create [Part-U]: click New Inventory Part; type Description ZZAUTOTEST PL SUPPLY UNTRACKED and Part Number ZZAUTOTEST-PL-SUPPLY-U1; pick any Category (e.g. Uncategorized); type Cost 2.00.
      – Leave Track quantities and cost of goods on and type Min 5 and Max 10.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 1.
      – Click Save. The dialog closes.
4. Write down [Part-T] = ZZAUTOTEST-PL-SUPPLY-T1 and [Part-U] = ZZAUTOTEST-PL-SUPPLY-U1.
5. Open [Part-U] (search its part number in Inventory and click the row), click the Track quantities and cost of goods switch so it is off, and click Save.
6. Check the setup worked: searching ZZAUTOTEST-PL-SUPPLY- lists both; [Part-T] shows "1 Available", Min 5, Max 10; [Part-U] shows "Not Tracked", Min 5, Max 10.



========== C425656 · section 20473 (S6 Search & sort by tracking state)
TITLE: Global search shows Not Tracked for an untracked part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: two parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-GS-: [Part-T] tracked holding 4, [Part-U] untracked holding 3.
- Global search may take a few minutes to pick up a new part.
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- Click Search in the top bar (or press Ctrl+K).
- Type ZZAUTOTEST-PL-GS-.
- Read the result rows for [Part-T] and [Part-U]. If neither is listed, wait 5 minutes and search again.
--- EXPECTED
Expected results
- Step 3: [Part-T]'s result shows its stock badge (e.g. "4 available").
- Step 3: [Part-U]'s result shows "Not Tracked" in the place of that badge, and no number.
Source — where this behaviour comes from
Epic SV-10647; story SV-10818 (Story 5, Change Tracking on an Existing Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), §8 User Feedback Summary (Untracked part in global search), with S9-R20, read 8 Oct 2026. Story 9 (SV-10822) owns S9-R20; this case is kept here for the §8 "Not Tracked" row. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- PRD §8 User Feedback Summary (Untracked part in global search): “"Not Tracked"”
- PRD §8 User Feedback Summary (Untracked part in global search): “In place of the "{n} available" badge”
- S9-R20: “Global search shows "Not Tracked" for an untracked part, in place of its "{n} available" badge.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Global search shows Not Tracked for an untracked part
Test case: C425656, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: two parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-GS-: [Part-T] tracked holding 4, [Part-U] untracked holding 3.
• Global search may take a few minutes to pick up a new part.
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-T]: click New Inventory Part; type Description ZZAUTOTEST PL GLOBAL SEARCH TRACKED and Part Number ZZAUTOTEST-PL-GS-T1; pick any Category (e.g. Uncategorized); type Cost 2.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 4.
      – Click Save. The dialog closes.
3. Create [Part-U]: click New Inventory Part; type Description ZZAUTOTEST PL GLOBAL SEARCH UNTRACKED and Part Number ZZAUTOTEST-PL-GS-U1; pick any Category (e.g. Uncategorized); type Cost 2.00.
      – Click the Track quantities and cost of goods switch so it is off (grey). Min and Max disappear.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 3.
      – Click Save. The dialog closes.
4. Write down [Part-T] = ZZAUTOTEST-PL-GS-T1 and [Part-U] = ZZAUTOTEST-PL-GS-U1.
5. Check the setup worked: the Inventory list shows [Part-T] "4 Available" and [Part-U] "Not Tracked".



========== C154780 · section 20475 (S8 Permissions)
TITLE: Without Delete, the actions menu offers no Deactivate parts or Activate parts
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- User 2: [User-B], whose custom role [Role-B] has View and Create & Edit but NOT Delete in the Part Library and Inventory group, and can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: none needed; the menu entries show whatever the tab holds.
--- STEPS
- Browser 1 (Admin): open Parts → Inventory, Active tab, and click the ⋮ actions menu.
- Browser 1: press Esc, click the Inactive tab and click the ⋮ actions menu. Press Esc.
- Browser 2 ([User-B]): open Parts → Inventory, Active tab, and click the ⋮ actions menu.
- Browser 2: click Cycle count, then click Cancel in the toolbar.
- Browser 2: click the Inactive tab and click the ⋮ actions menu.
--- EXPECTED
Expected results
- Step 1: The Admin's menu shows Cycle count, Deactivate parts and Export, in that order (a control showing the entry exists on this build).
- Step 2: The Admin's menu on the Inactive tab shows Cycle count, Activate parts and Export.
- Step 3: [User-B]'s menu shows Cycle count and Export only; there is no Deactivate parts entry.
- Step 4: Cycle count starts for [User-B] (its count controls appear) and Cancel leaves it: Cycle count needs nothing more than Create & Edit.
- Step 5: [User-B]'s menu on the Inactive tab shows Cycle count and Export only; there is no Activate parts entry.
Source — where this behaviour comes from
Epic SV-10647; story SV-10821 (Story 8, Permissions); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S8-R3, S8-R4, S8-R5, read 8 Oct 2026; design canvas board 4.1 (The actions menu) and bulk-note-1. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S8-R3: “A user without that permission does not see the "Deactivate parts" entry in the Inventory actions menu.”
- S8-R4: “That user does not see the "Activate parts" entry on the Inactive tab.”
- S8-R5: “The actions menu needs the 'Part Library & Inventory → Create & Edit' permission. Its Cycle count and Export entries need nothing more. Only the bulk status entry also needs the 'Part Library & Inventory → Delete' permission.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Without Delete, the actions menu offers no Deactivate parts or Activate parts
Test case: C154780, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• User 2: [User-B], whose custom role [Role-B] has View and Create & Edit but NOT Delete in the Part Library and Inventory group, and can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: none needed; the menu entries show whatever the tab holds.
# Part 1. Setup for manual QA tester
1. Create [Role-B]: go to Settings → Roles & Permissions, click Create custom role, choose Skip (blank role), type Role name ZZAUTOTEST-PL-NODEL-MENU-ROLE.
      – In the Part Library and Inventory group tick View, Create & Edit and leave Delete unticked. Also tick the permission that lets the role see costs and prices (See Financial Data), so the Cost fields show. Click Create (the toast reads "Role created successfully.").
2. Create [User-B]: go to Settings → Staff and add a staff member: First name ZZAUTOTEST, Last name PL-NODEL-MENU, an email inbox you can open (e.g. your own address with +plnodelmenu added before the @), Role [Role-B], location [Loc-1]. Save.
      – Open the invitation email in that inbox, accept it and set a password. [User-B] = this staff member.
      – Sign in as [User-B] in a second browser (or a private window), so the Admin stays signed in in the first browser. Below, "Browser 1" is the Admin and "Browser 2" is [User-B].
3. Check the setup worked: in Browser 2, [User-B] can open Parts → Inventory and sees the ⋮ actions menu button in the toolbar.



========== C154781 · section 20475 (S8 Permissions)
TITLE: Without Delete, the tracking switch shows but cannot be changed
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- User 2: [User-B], whose custom role [Role-B] has View and Create & Edit but NOT Delete in the Part Library and Inventory group, and can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: two parts at [Loc-1] created by the Admin: [Part-T] tracked and [Part-U] untracked.
--- STEPS
- Browser 2 ([User-B]): click the [Part-T] row and look at the Track quantities and cost of goods switch.
- Click the switch.
- Click Cancel.
- Click the [Part-U] row and look at the switch.
- Click the switch, then click Cancel.
--- EXPECTED
Expected results
- Step 1: The switch is shown, on, and disabled (greyed).
- Step 2: Nothing changes: the switch stays on and Min and Max stay visible.
- Step 4: The switch is shown, off, and disabled, so [User-B] can read that [Part-U] is untracked.
- Step 5: The switch stays off; Min and Max stay hidden; the part is unchanged (still "Not Tracked" in the list).
Source — where this behaviour comes from
Epic SV-10647; story SV-10821 (Story 8, Permissions); story SV-10818 (Story 5, Change Tracking on an Existing Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S8-R8, S8-R9, S5-N2, read 8 Oct 2026; design canvas board 5.2 (Switch off). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S8-R8: “Changing an existing part's tracking, in either direction, requires the same permission.”
- S8-R9: “A user without that permission sees the tracking switch disabled, so they can read the state but not change it.”
- S5-N2: “A user without the 'Part Library & Inventory → Delete' permission sees the switch disabled (S8-R9).”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Without Delete, the tracking switch shows but cannot be changed
Test case: C154781, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• User 2: [User-B], whose custom role [Role-B] has View and Create & Edit but NOT Delete in the Part Library and Inventory group, and can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: two parts at [Loc-1] created by the Admin: [Part-T] tracked and [Part-U] untracked.
# Part 1. Setup for manual QA tester
1. Create [Role-B]: go to Settings → Roles & Permissions, click Create custom role, choose Skip (blank role), type Role name ZZAUTOTEST-PL-NODEL-SWITCH-ROLE.
      – In the Part Library and Inventory group tick View, Create & Edit and leave Delete unticked. Also tick the permission that lets the role see costs and prices (See Financial Data), so the Cost fields show. Click Create (the toast reads "Role created successfully.").
2. Create [User-B]: go to Settings → Staff and add a staff member: First name ZZAUTOTEST, Last name PL-NODEL-SWITCH, an email inbox you can open (e.g. your own address with +plnodelswitch added before the @), Role [Role-B], location [Loc-1]. Save.
      – Open the invitation email in that inbox, accept it and set a password. [User-B] = this staff member.
      – Sign in as [User-B] in a second browser (or a private window), so the Admin stays signed in in the first browser. Below, "Browser 1" is the Admin and "Browser 2" is [User-B].
3. Browser 1: open Parts → Inventory.
4. Create [Part-T]: click New Inventory Part; type Description ZZAUTOTEST PL NO DELETE SWITCH TRACKED and Part Number ZZAUTOTEST-PL-NODEL-SW-T1; pick any Category (e.g. Uncategorized); type Cost 5.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Click Save. The dialog closes.
5. Create [Part-U]: click New Inventory Part; type Description ZZAUTOTEST PL NO DELETE SWITCH UNTRACKED and Part Number ZZAUTOTEST-PL-NODEL-SW-U1; pick any Category (e.g. Uncategorized); type Cost 5.00.
      – Click the Track quantities and cost of goods switch so it is off (grey). Min and Max disappear.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Click Save. The dialog closes.
6. Check the setup worked: in Browser 2, [User-B] finds both parts; [Part-T] shows "2 Available" and [Part-U] "Not Tracked".



========== C154782 · section 20475 (S8 Permissions)
TITLE: Admin, Service Manager and Parts Manager see the status and tracking controls
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Users 2 to 4: [User-SM] with the default Service Manager role, [User-PM] with the default Parts Manager role, and [User-SA] with the default Service Advisor role (a default role expected NOT to have them).
- Settings: the three system roles are reset to their template before the check, so earlier edits on this shared environment do not skew the result.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one tracked, active part [Part-A] at [Loc-1].
--- STEPS
- As yourself (Admin): open the ⋮ actions menu on the Active tab, then click the [Part-A] row and look at the footer, Part Status and the Track quantities and cost of goods switch. Click Cancel.
- Browser 2, signed in as [User-SM]: do the same.
- Browser 2, signed in as [User-PM]: do the same.
- Browser 2, signed in as [User-SA]: do the same.
--- EXPECTED
Expected results
- Step 1: The menu shows Deactivate parts; the dialog shows the red Delete Part button, Part Status can be changed and the switch can be changed.
- Step 2: The same four controls show and work for [User-SM] (Service Manager).
- Step 3: The same four controls show and work for [User-PM] (Parts Manager).
- Step 4: For [User-SA] (Service Advisor) Delete Part is not shown, and equally Deactivate parts is missing from the menu, Part Status is disabled and the switch is disabled.
- Steps 1 to 4: For every user, the status and tracking controls are available exactly when Delete Part is shown in the dialog.
Source — where this behaviour comes from
Epic SV-10647; story SV-10821 (Story 8, Permissions); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S8-R14, read 8 Oct 2026. Rule 26: roles reset to template before a permission check on a shared environment. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S8-R14: “The controls this spec gates on the 'Part Library & Inventory → Delete' permission show to exactly the users who see Delete on the part dialog today. By default those are Admin, Service Manager and Parts Manager.”
- PRD §4 Key Decisions (access): “The controls show to exactly the users who see Delete on the part dialog today.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Admin, Service Manager and Parts Manager see the status and tracking controls
Test case: C154782, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Users 2 to 4: [User-SM] with the default Service Manager role, [User-PM] with the default Parts Manager role, and [User-SA] with the default Service Advisor role (a default role expected NOT to have them).
• Settings: the three system roles are reset to their template before the check, so earlier edits on this shared environment do not skew the result.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one tracked, active part [Part-A] at [Loc-1].
# Part 1. Setup for manual QA tester
1. Go to Settings → Roles & Permissions. For each of Service Manager, Parts Manager and Service Advisor: open the role, click Edit, click Reset To Template and click Save (if Save stays disabled the role already matches its template). Write down what changed, if anything.
2. Create [User-SM], [User-PM] and [User-SA] in Settings → Staff (First name ZZAUTOTEST, Last names PL-DEFROLE-SM, PL-DEFROLE-PM and PL-DEFROLE-SA, an email inbox you can open for each, e.g. your own address with +pldefsm, +pldefpm, +pldefsa added before the @), with the roles Service Manager, Parts Manager and Service Advisor. Accept each invitation and set a password.
3. Open Parts → Inventory.
4. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL DEFAULT ROLES and Part Number ZZAUTOTEST-PL-DEFROLE-01; pick any Category (e.g. Uncategorized); type Cost 5.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Click Save. The dialog closes.
5. Write down [Part-A] = ZZAUTOTEST-PL-DEFROLE-01.
6. Check the setup worked: each of the three new users can sign in (Browser 2) and open Parts → Inventory.



========== C154783 · section 20475 (S8 Permissions)
TITLE: A status change is refused for a user who has just lost the right to delete
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- User 2: [User-D], whose custom role [Role-D] starts with View, Create & Edit and Delete in the Part Library and Inventory group and is cut down to View only during the steps, so [User-D] becomes a user who cannot delete inventory parts while a screen is still open.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- This is the manual way to send a request from a user without the right: if the screen notices the change and hides or closes the control before you click, that item cannot be checked by hand.
- Data: two active parts at [Loc-1]: [Part-A] (to deactivate) and [Part-B] (to compare with Delete Part).
--- STEPS
- Browser 2 ([User-D]): on the Active tab click ⋮ → Deactivate parts, tick [Part-A] and click Deactivate in the bar. Leave the confirmation open; do not confirm yet.
- Browser 1 (Admin): in Settings → Roles & Permissions edit [Role-D]: in the Part Library and Inventory group untick Create & Edit and Delete (keep View), untick See Financial Data and every Settings permission, and click Save.
- Browser 2: click Deactivate in the confirmation.
- Browser 2: read the message shown.
- Browser 1: on the Active tab search [Part-A].
- Browser 1: edit [Role-D] back to View, Create & Edit and Delete (and See Financial Data) and Save. Browser 2: reload, click the [Part-B] row and leave the dialog open.
- Browser 1 (Admin): in Settings → Roles & Permissions edit [Role-D]: in the Part Library and Inventory group untick Create & Edit and Delete (keep View), untick See Financial Data and every Settings permission, and click Save.
- Browser 2: click Delete Part and read the message shown.
- Browser 1: search [Part-B] on the Active tab.
--- EXPECTED
Expected results
- Step 4: The change is refused with an access denied error (a message that [User-D] is not allowed to do this). No "1 part updated." toast appears.
- Step 5: [Part-A] is still on the Active tab: its status did not change.
- Step 8: The delete is refused in the same way (an access denied error).
- Step 9: [Part-B] still exists. The status change and the delete were both refused for the same user at the same moment: the system accepts a status change from exactly the users it accepts a delete from.
- Steps 3 and 8: If the screen closed or hid the control before you could click, write "not checked by hand" in the result comment for that item.
Source — where this behaviour comes from
Epic SV-10647; story SV-10821 (Story 8, Permissions); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S8-N3, S8-R15 and the Story 8 context note, read 8 Oct 2026; design canvas boards 4.3 and 4.4 (bulk confirm). Tech plan §9 Security and D14 (the server checks the same right as the inventory part delete). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S8-N3: “If that user tries to set a part active or inactive by any route, the request is refused with an access denied error.”
- S8-R15: “The system accepts a status change, a tracking change and an untracked part from exactly the users it accepts an inventory part delete from today.”
- PRD §7 Story 8 context note: “S8-N1 to S8-N3 hold for a user who cannot delete inventory parts today. The system checks that access itself, so hiding the controls is not the only protection.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A status change is refused for a user who has just lost the right to delete
Test case: C154783, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• User 2: [User-D], whose custom role [Role-D] starts with View, Create & Edit and Delete in the Part Library and Inventory group and is cut down to View only during the steps, so [User-D] becomes a user who cannot delete inventory parts while a screen is still open.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• This is the manual way to send a request from a user without the right: if the screen notices the change and hides or closes the control before you click, that item cannot be checked by hand.
• Data: two active parts at [Loc-1]: [Part-A] (to deactivate) and [Part-B] (to compare with Delete Part).
# Part 1. Setup for manual QA tester
1. Create [Role-D]: go to Settings → Roles & Permissions, click Create custom role, choose Skip (blank role), type Role name ZZAUTOTEST-PL-REVOKE-STATUS-ROLE.
      – In the Part Library and Inventory group tick View, Create & Edit, Delete. Also tick the permission that lets the role see costs and prices (See Financial Data), so the Cost fields show. Click Create (the toast reads "Role created successfully.").
2. Create [User-D]: go to Settings → Staff and add a staff member: First name ZZAUTOTEST, Last name PL-REVOKE-STATUS, an email inbox you can open (e.g. your own address with +plrevokest added before the @), Role [Role-D], location [Loc-1]. Save.
      – Open the invitation email in that inbox, accept it and set a password. [User-D] = this staff member.
      – Sign in as [User-D] in a second browser (or a private window), so the Admin stays signed in in the first browser. Below, "Browser 1" is the Admin and "Browser 2" is [User-D].
3. Browser 1: open Parts → Inventory.
4. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL REVOKE STATUS A and Part Number ZZAUTOTEST-PL-REVOKE-ST-A1; pick any Category (e.g. Uncategorized); type Cost 5.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Click Save. The dialog closes.
5. Create [Part-B]: click New Inventory Part; type Description ZZAUTOTEST PL REVOKE STATUS B and Part Number ZZAUTOTEST-PL-REVOKE-ST-B1; pick any Category (e.g. Uncategorized); type Cost 5.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Click Save. The dialog closes.
6. Check the setup worked: in Browser 2, [User-D] sees Deactivate parts in the ⋮ menu and the red Delete Part button in [Part-B]'s dialog.



========== C425646 · section 20475 (S8 Permissions)
TITLE: A user with only View sees no Inventory actions menu
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- User 2: [User-C], whose custom role [Role-C] has only View in the Part Library and Inventory group (no Create & Edit, no Delete).
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: none needed.
--- STEPS
- Browser 2 ([User-C]): open Parts → Inventory, Active tab.
- Look at the toolbar for the ⋮ actions menu button.
- Click the Inactive tab and look at the toolbar again.
--- EXPECTED
Expected results
- Step 1: The Inventory list opens and shows parts (viewing the list still works with View only).
- Step 2: There is no ⋮ actions menu button, so no Cycle count, Export, Deactivate parts or Activate parts can be reached.
- Step 3: There is no ⋮ actions menu button on the Inactive tab either.
Source — where this behaviour comes from
Epic SV-10647; story SV-10821 (Story 8, Permissions); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S8-R5, S8-R13, read 8 Oct 2026; design canvas board 4.1 (The actions menu). Story SV-10821 acceptance criterion: "Given a user with only View, when they open the Inventory list, then no actions menu is shown." Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S8-R5: “The actions menu needs the 'Part Library & Inventory → Create & Edit' permission. Its Cycle count and Export entries need nothing more. Only the bulk status entry also needs the 'Part Library & Inventory → Delete' permission.”
- S8-R13: “Editing pricing, editing bin quantities and viewing the Inventory list follow the permissions that already govern them.”
- SV-10821 acceptance criteria: “Given a user with only View, when they open the Inventory list, then no actions menu is shown.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A user with only View sees no Inventory actions menu
Test case: C425646, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• User 2: [User-C], whose custom role [Role-C] has only View in the Part Library and Inventory group (no Create & Edit, no Delete).
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: none needed.
# Part 1. Setup for manual QA tester
1. Create [Role-C]: go to Settings → Roles & Permissions, click Create custom role, choose Skip (blank role), type Role name ZZAUTOTEST-PL-VIEWONLY-ROLE.
      – In the Part Library and Inventory group tick View and leave Create & Edit, Delete unticked. Leave See Financial Data and every Settings permission unticked. Click Create (the toast reads "Role created successfully.").
2. Create [User-C]: go to Settings → Staff and add a staff member: First name ZZAUTOTEST, Last name PL-VIEWONLY, an email inbox you can open (e.g. your own address with +plviewonly added before the @), Role [Role-C], location [Loc-1]. Save.
      – Open the invitation email in that inbox, accept it and set a password. [User-C] = this staff member.
      – Sign in as [User-C] in a second browser (or a private window), so the Admin stays signed in in the first browser. Below, "Browser 1" is the Admin and "Browser 2" is [User-C].
3. Check the setup worked: in Browser 2, [User-C] can open Parts → Inventory and sees the list of parts.



========== C425647 · section 20475 (S8 Permissions)
TITLE: A custom role can change part status only once Delete is granted
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- User 2: [User-B], whose custom role [Role-B] has View and Create & Edit but NOT Delete in the Part Library and Inventory group, and can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one tracked, active part [Part-A] at [Loc-1].
--- STEPS
- Browser 2 ([User-B]): click the [Part-A] row and look at Part Status. Click Cancel.
- Browser 1 (Admin): in Settings → Roles & Permissions edit [Role-B], tick Delete in the Part Library and Inventory group and click Save.
- Browser 2: reload the page, open Parts → Inventory and click the ⋮ actions menu.
- Browser 2: press Esc, search [Part-A], click its row, pick Inactive under Part Status and click Save.
- Browser 2: in the confirmation, click Deactivate.
- Browser 2: click the Inactive tab, search [Part-A], click its row, pick Active and click Save, then click Activate in the confirmation.
--- EXPECTED
Expected results
- Step 1: Part Status shows Active and Inactive but both options are disabled (greyed, cannot be picked).
- Step 2: The role is saved.
- Step 3: The menu now shows Cycle count, Deactivate parts and Export: the role has exactly what was granted.
- Step 4: Part Status can be picked and the confirmation "Deactivate part?" opens.
- Step 5: The toast reads "Part deactivated." and [Part-A] leaves the Active tab: setting a part inactive works once Delete is granted.
- Step 6: The confirmation "Activate part?" opens, the toast reads "Part activated." and [Part-A] leaves the Inactive tab.
Source — where this behaviour comes from
Epic SV-10647; story SV-10821 (Story 8, Permissions); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S8-R1, S8-R2, S8-R16, with the toasts from §8 (Part deactivated / activated from the part dialog), read 8 Oct 2026; design canvas boards 3.1 to 3.4, 3.7 (Retire one part). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S8-R1: “Setting a part inactive requires the 'Part Library & Inventory → Delete' permission.”
- S8-R2: “Setting a part active requires the same permission.”
- S8-R16: “A custom role has only the permissions granted to it.”
- PRD §8 User Feedback Summary (Part deactivated from the part dialog): “"Part deactivated."”
- PRD §8 User Feedback Summary (Part activated from the part dialog): “"Part activated."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A custom role can change part status only once Delete is granted
Test case: C425647, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• User 2: [User-B], whose custom role [Role-B] has View and Create & Edit but NOT Delete in the Part Library and Inventory group, and can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one tracked, active part [Part-A] at [Loc-1].
# Part 1. Setup for manual QA tester
1. Create [Role-B]: go to Settings → Roles & Permissions, click Create custom role, choose Skip (blank role), type Role name ZZAUTOTEST-PL-GRANT-ROLE.
      – In the Part Library and Inventory group tick View, Create & Edit and leave Delete unticked. Also tick the permission that lets the role see costs and prices (See Financial Data), so the Cost fields show. Click Create (the toast reads "Role created successfully.").
2. Create [User-B]: go to Settings → Staff and add a staff member: First name ZZAUTOTEST, Last name PL-GRANT, an email inbox you can open (e.g. your own address with +plgrant added before the @), Role [Role-B], location [Loc-1]. Save.
      – Open the invitation email in that inbox, accept it and set a password. [User-B] = this staff member.
      – Sign in as [User-B] in a second browser (or a private window), so the Admin stays signed in in the first browser. Below, "Browser 1" is the Admin and "Browser 2" is [User-B].
3. Browser 1: open Parts → Inventory.
4. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL GRANT DELETE and Part Number ZZAUTOTEST-PL-GRANT-01; pick any Category (e.g. Uncategorized); type Cost 5.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Click Save. The dialog closes.
5. Write down [Part-A] = ZZAUTOTEST-PL-GRANT-01.
6. Check the setup worked: in Browser 2, [User-B] finds [Part-A] on the Active tab and the ⋮ menu offers Cycle count and Export only.



========== C425648 · section 20475 (S8 Permissions)
TITLE: Without Delete, New Inventory Part creates only tracked parts
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- User 2: [User-B], whose custom role [Role-B] has View and Create & Edit but NOT Delete in the Part Library and Inventory group, and can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: no part numbered ZZAUTOTEST-PL-NODEL-CREATE-01 exists at [Loc-1].
--- STEPS
- Browser 2 ([User-B]): click New Inventory Part and look at the Track quantities and cost of goods switch.
- Click the switch.
- Type Description ZZAUTOTEST PL NO DELETE CREATE and Part Number [Part-A]; pick any Category (e.g. Uncategorized); type Cost 5.00; set the bin Quantity to 3.
- Click Save.
- Search [Part-A] and read its Total Quantity.
--- EXPECTED
Expected results
- Step 1: The switch is on and disabled.
- Step 2: It stays on: [User-B] cannot create an untracked part.
- Step 4: The dialog closes; the part is saved: creating a tracked part needs only Create & Edit.
- Step 5: Total Quantity reads "3 Available" (a tracked part), not "Not Tracked".
Source — where this behaviour comes from
Epic SV-10647; story SV-10821 (Story 8, Permissions); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S8-R7, S8-R10, read 8 Oct 2026; design canvas board 1.1 (New Inventory Part opens) and create-note-6. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S8-R7: “Creating a part with tracking off requires the 'Part Library & Inventory → Delete' permission.”
- S8-R10: “Creating a tracked part needs only the 'Part Library & Inventory → Create & Edit' permission.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Without Delete, New Inventory Part creates only tracked parts
Test case: C425648, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• User 2: [User-B], whose custom role [Role-B] has View and Create & Edit but NOT Delete in the Part Library and Inventory group, and can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: no part numbered ZZAUTOTEST-PL-NODEL-CREATE-01 exists at [Loc-1].
# Part 1. Setup for manual QA tester
1. Create [Role-B]: go to Settings → Roles & Permissions, click Create custom role, choose Skip (blank role), type Role name ZZAUTOTEST-PL-NODEL-CREATE-ROLE.
      – In the Part Library and Inventory group tick View, Create & Edit and leave Delete unticked. Also tick the permission that lets the role see costs and prices (See Financial Data), so the Cost fields show. Click Create (the toast reads "Role created successfully.").
2. Create [User-B]: go to Settings → Staff and add a staff member: First name ZZAUTOTEST, Last name PL-NODEL-CREATE, an email inbox you can open (e.g. your own address with +plnodelcreate added before the @), Role [Role-B], location [Loc-1]. Save.
      – Open the invitation email in that inbox, accept it and set a password. [User-B] = this staff member.
      – Sign in as [User-B] in a second browser (or a private window), so the Admin stays signed in in the first browser. Below, "Browser 1" is the Admin and "Browser 2" is [User-B].
3. Write down [Part-A] = ZZAUTOTEST-PL-NODEL-CREATE-01.
4. Check the setup worked: in Browser 2, [User-B] sees the New Inventory Part button, and searching [Part-A] finds nothing.



========== C425649 · section 20475 (S8 Permissions)
TITLE: Without Delete, Part Status in the part dialog is disabled
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- User 2: [User-B], whose custom role [Role-B] has View and Create & Edit but NOT Delete in the Part Library and Inventory group, and can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one active part [Part-A] and one inactive part [Part-I] at [Loc-1], created by the Admin.
--- STEPS
- Browser 2 ([User-B]): click the [Part-A] row and look at Part Status and the pill in the title row.
- Try to pick Inactive. Click Cancel.
- Click the Inactive tab, click the [Part-I] row and look at Part Status.
- Try to pick Active. Click Cancel.
--- EXPECTED
Expected results
- Step 1: Part Status shows Active selected; both options are disabled. The title row shows the green "Active" pill.
- Step 2: Inactive cannot be picked; Active stays selected.
- Step 3: Part Status shows Inactive selected, both options disabled; the title row shows the grey "Inactive" pill.
- Step 4: Active cannot be picked; the part stays inactive.
Source — where this behaviour comes from
Epic SV-10647; story SV-10821 (Story 8, Permissions); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S8-R6, read 8 Oct 2026; design canvas boards 3.1 (Part Status in the dialog) and 3.6 (Opening the inactive part). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S8-R6: “That user sees the Part Status choice in the part dialog disabled (S13-R20).”
- S13-R20: “When editing, a "Part Status" choice offers two options, Active and Inactive, set to the part's saved status. A user without the 'Part Library & Inventory → Delete' permission sees the choice disabled.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Without Delete, Part Status in the part dialog is disabled
Test case: C425649, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• User 2: [User-B], whose custom role [Role-B] has View and Create & Edit but NOT Delete in the Part Library and Inventory group, and can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one active part [Part-A] and one inactive part [Part-I] at [Loc-1], created by the Admin.
# Part 1. Setup for manual QA tester
1. Create [Role-B]: go to Settings → Roles & Permissions, click Create custom role, choose Skip (blank role), type Role name ZZAUTOTEST-PL-NODEL-STATUS-ROLE.
      – In the Part Library and Inventory group tick View, Create & Edit and leave Delete unticked. Also tick the permission that lets the role see costs and prices (See Financial Data), so the Cost fields show. Click Create (the toast reads "Role created successfully.").
2. Create [User-B]: go to Settings → Staff and add a staff member: First name ZZAUTOTEST, Last name PL-NODEL-STATUS, an email inbox you can open (e.g. your own address with +plnodelstatus added before the @), Role [Role-B], location [Loc-1]. Save.
      – Open the invitation email in that inbox, accept it and set a password. [User-B] = this staff member.
      – Sign in as [User-B] in a second browser (or a private window), so the Admin stays signed in in the first browser. Below, "Browser 1" is the Admin and "Browser 2" is [User-B].
3. Browser 1: open Parts → Inventory.
4. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL NO DELETE STATUS ACTIVE and Part Number ZZAUTOTEST-PL-NODEL-ST-A1; pick any Category (e.g. Uncategorized); type Cost 5.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Click Save. The dialog closes.
5. Create [Part-I]: click New Inventory Part; type Description ZZAUTOTEST PL NO DELETE STATUS INACTIVE and Part Number ZZAUTOTEST-PL-NODEL-ST-I1; pick any Category (e.g. Uncategorized); type Cost 5.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Click Save. The dialog closes.
6. Browser 1: open [Part-I], pick Inactive under Part Status, click Save and click Deactivate in the confirmation.
7. Check the setup worked: in Browser 2, [User-B] finds [Part-A] on the Active tab and [Part-I] on the Inactive tab.



========== C425650 · section 20475 (S8 Permissions)
TITLE: Without Delete, the part dialog shows no Delete Part button
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- User 2: [User-B], whose custom role [Role-B] has View and Create & Edit but NOT Delete in the Part Library and Inventory group, and can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one part [Part-A] at [Loc-1], not on any work order, created by the Admin.
--- STEPS
- Browser 1 (Admin): click the [Part-A] row and look at the left end of the footer. Click Cancel.
- Browser 2 ([User-B]): click the [Part-A] row and look at the left end of the footer.
- Click Cancel.
--- EXPECTED
Expected results
- Step 1: The Admin sees the red Delete Part button at the left of the footer (control).
- Step 2: [User-B] sees no Delete Part button; the footer holds only Cancel and Save.
Source — where this behaviour comes from
Epic SV-10647; story SV-10821 (Story 8, Permissions); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S8-R12, read 8 Oct 2026; design canvas board 2.1 (The part as it stands; Delete Part in the footer). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S8-R12: “Delete Part in the part dialog requires the 'Part Library & Inventory → Delete' permission. Without it the button is not shown.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Without Delete, the part dialog shows no Delete Part button
Test case: C425650, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• User 2: [User-B], whose custom role [Role-B] has View and Create & Edit but NOT Delete in the Part Library and Inventory group, and can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one part [Part-A] at [Loc-1], not on any work order, created by the Admin.
# Part 1. Setup for manual QA tester
1. Create [Role-B]: go to Settings → Roles & Permissions, click Create custom role, choose Skip (blank role), type Role name ZZAUTOTEST-PL-NODEL-DELBTN-ROLE.
      – In the Part Library and Inventory group tick View, Create & Edit and leave Delete unticked. Also tick the permission that lets the role see costs and prices (See Financial Data), so the Cost fields show. Click Create (the toast reads "Role created successfully.").
2. Create [User-B]: go to Settings → Staff and add a staff member: First name ZZAUTOTEST, Last name PL-NODEL-DELBTN, an email inbox you can open (e.g. your own address with +plnodeldelbtn added before the @), Role [Role-B], location [Loc-1]. Save.
      – Open the invitation email in that inbox, accept it and set a password. [User-B] = this staff member.
      – Sign in as [User-B] in a second browser (or a private window), so the Admin stays signed in in the first browser. Below, "Browser 1" is the Admin and "Browser 2" is [User-B].
3. Browser 1: open Parts → Inventory.
4. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL NO DELETE BUTTON and Part Number ZZAUTOTEST-PL-NODEL-DELBTN-01; pick any Category (e.g. Uncategorized); type Cost 5.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Click Save. The dialog closes.
5. Check the setup worked: in Browser 2, [User-B] finds [Part-A] on the Active tab.



========== C425651 · section 20475 (S8 Permissions)
TITLE: Without Delete, a user can still rename a part stocked at two locations
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- User 2: [User-B], whose custom role [Role-B] has View and Create & Edit but NOT Delete in the Part Library and Inventory group, and can see costs and prices; [User-B] works at [Loc-1].
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1]. [Loc-2] = a second location created in Setup.
- Data: [Part-A] stocked at both [Loc-1] and [Loc-2] on the same Part Library entry (same part number typed exactly).
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- Browser 2 ([User-B], at [Loc-1]): click the [Part-A] row.
- Replace the Description with [Desc-New].
- Read the text under the Description field.
- Click Save.
- Browser 1 (Admin): pick [Loc-2], open Parts → Inventory and search [Part-A].
--- EXPECTED
Expected results
- Step 3: Under the field: "This also changes the description at 1 other location."
- Step 4: The dialog closes and the change is saved; no access error appears, although [User-B] has no Delete and the change reaches [Loc-2].
- Step 5: At [Loc-2], [Part-A] now reads [Desc-New].
Source — where this behaviour comes from
Epic SV-10647; story SV-10821 (Story 8, Permissions); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S8-R11, read 8 Oct 2026; design canvas boards 2.2 (Both fields edited) and 2.5 (Lethbridge: renamed there too), correct-note-5. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S8-R11: “Changing a part's number or description needs only the 'Part Library & Inventory → Create & Edit' permission, including when the change reaches other locations.”
- S13-R12: “When the user changes the description and at least one other location stocks the same Part Library entry, the dialog shows, under the field, "This also changes the description at {n} other locations.", or "This also changes the description at 1 other location." for one.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Without Delete, a user can still rename a part stocked at two locations
Test case: C425651, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• User 2: [User-B], whose custom role [Role-B] has View and Create & Edit but NOT Delete in the Part Library and Inventory group, and can see costs and prices; [User-B] works at [Loc-1].
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1]. [Loc-2] = a second location created in Setup.
• Data: [Part-A] stocked at both [Loc-1] and [Loc-2] on the same Part Library entry (same part number typed exactly).
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Go to Settings → Locations and add a location named ZZAUTOTEST PL RENAME LOC 2 (fill the required fields with any values). [Loc-2] = this location.
2. Create [Role-B]: go to Settings → Roles & Permissions, click Create custom role, choose Skip (blank role), type Role name ZZAUTOTEST-PL-NODEL-RENAME-ROLE.
      – In the Part Library and Inventory group tick View, Create & Edit and leave Delete unticked. Also tick the permission that lets the role see costs and prices (See Financial Data), so the Cost fields show. Click Create (the toast reads "Role created successfully.").
3. Create [User-B]: go to Settings → Staff and add a staff member: First name ZZAUTOTEST, Last name PL-NODEL-RENAME, an email inbox you can open (e.g. your own address with +plnodelrename added before the @), Role [Role-B], location [Loc-1]. Save.
      – Open the invitation email in that inbox, accept it and set a password. [User-B] = this staff member.
      – Sign in as [User-B] in a second browser (or a private window), so the Admin stays signed in in the first browser. Below, "Browser 1" is the Admin and "Browser 2" is [User-B].
4. Browser 1: pick [Loc-1] and open Parts → Inventory.
5. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL RENAME OLD and Part Number ZZAUTOTEST-PL-NODEL-RENAME-01; pick any Category (e.g. Uncategorized); type Cost 5.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Click Save. The dialog closes.
6. Browser 1: pick [Loc-2] in the location switcher, open Parts → Inventory, click New Inventory Part and type exactly the same Description and Part Number ZZAUTOTEST-PL-NODEL-RENAME-01; pick any Category, Cost 5.00, Save.
7. Write down [Part-A] = ZZAUTOTEST-PL-NODEL-RENAME-01, [Desc-Old] = ZZAUTOTEST PL RENAME OLD and [Desc-New] = ZZAUTOTEST PL RENAME NEW.
8. Check the setup worked: [Part-A] is listed at both [Loc-1] and [Loc-2] (Browser 1, switching location); in Browser 2 [User-B] finds it at [Loc-1].



========== C425652 · section 20475 (S8 Permissions)
TITLE: Without Delete, pricing and bin quantities can still be edited as before
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- User 2: [User-B], whose custom role [Role-B] has View and Create & Edit but NOT Delete in the Part Library and Inventory group, and can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one tracked part [Part-A] at [Loc-1] with Sell Price $15.00 and one bin [Bin-1] holding 4, created by the Admin.
--- STEPS
- Browser 2 ([User-B]): click the [Part-A] row.
- Change Sell Price to 18.00.
- Change the Quantity of [Bin-1] from 4 to 6.
- Click Save.
- Read the [Part-A] row.
--- EXPECTED
Expected results
- Step 4: The dialog closes and saves with no access error: these edits do not need Delete.
- Step 5: The row shows Sell Price $18.00 and Total Quantity "6 Available" (4 + 2 added = 6).
Source — where this behaviour comes from
Epic SV-10647; story SV-10821 (Story 8, Permissions); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S8-R13, read 8 Oct 2026. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S8-R13: “Editing pricing, editing bin quantities and viewing the Inventory list follow the permissions that already govern them.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Without Delete, pricing and bin quantities can still be edited as before
Test case: C425652, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• User 2: [User-B], whose custom role [Role-B] has View and Create & Edit but NOT Delete in the Part Library and Inventory group, and can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one tracked part [Part-A] at [Loc-1] with Sell Price $15.00 and one bin [Bin-1] holding 4, created by the Admin.
# Part 1. Setup for manual QA tester
1. Create [Role-B]: go to Settings → Roles & Permissions, click Create custom role, choose Skip (blank role), type Role name ZZAUTOTEST-PL-NODEL-PRICE-ROLE.
      – In the Part Library and Inventory group tick View, Create & Edit and leave Delete unticked. Also tick the permission that lets the role see costs and prices (See Financial Data), so the Cost fields show. Click Create (the toast reads "Role created successfully.").
2. Create [User-B]: go to Settings → Staff and add a staff member: First name ZZAUTOTEST, Last name PL-NODEL-PRICE, an email inbox you can open (e.g. your own address with +plnodelprice added before the @), Role [Role-B], location [Loc-1]. Save.
      – Open the invitation email in that inbox, accept it and set a password. [User-B] = this staff member.
      – Sign in as [User-B] in a second browser (or a private window), so the Admin stays signed in in the first browser. Below, "Browser 1" is the Admin and "Browser 2" is [User-B].
3. Browser 1: open Parts → Inventory.
4. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL NO DELETE PRICE and Part Number ZZAUTOTEST-PL-NODEL-PRICE-01; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 4.
      – Click Save. The dialog closes.
5. Browser 1: open [Part-A], type Sell Price 15.00 and click Save.
6. Check the setup worked: in Browser 2, [User-B] finds [Part-A] with "4 Available" and Sell Price $15.00.



========== C425653 · section 20475 (S8 Permissions)
TITLE: Without Delete, a user can still edit an untracked part's price and bins
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- User 2: [User-B], whose custom role [Role-B] has View and Create & Edit but NOT Delete in the Part Library and Inventory group, and can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one untracked part [Part-U] at [Loc-1] with Sell Price $15.00 and one bin [Bin-1] holding 4, created by the Admin.
--- STEPS
- Browser 2 ([User-B]): click the [Part-U] row.
- Change Sell Price to 18.00, change the Quantity of [Bin-1] to 6, and replace the Description with [Desc-New].
- Click Save.
- Read the [Part-U] row.
--- EXPECTED
Expected results
- Step 3: The dialog closes and saves with no access error: editing other fields of an untracked part needs the same access as on a tracked part.
- Step 4: The row shows [Desc-New], Sell Price $18.00, bin "[Bin-1] | 6" and still "Not Tracked" (the tracking state did not change).
Source — where this behaviour comes from
Epic SV-10647; story SV-10821 (Story 8, Permissions); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S8-N1a, read 8 Oct 2026. Product comment, Chris Ward, 8 Oct 2026 (S8-N1 narrower reading, new S8-N1a). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S8-N1a: “Editing any other field of a part that is already untracked, such as its price, bins or description, needs the same access as editing a tracked part today.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Without Delete, a user can still edit an untracked part's price and bins
Test case: C425653, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• User 2: [User-B], whose custom role [Role-B] has View and Create & Edit but NOT Delete in the Part Library and Inventory group, and can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one untracked part [Part-U] at [Loc-1] with Sell Price $15.00 and one bin [Bin-1] holding 4, created by the Admin.
# Part 1. Setup for manual QA tester
1. Create [Role-B]: go to Settings → Roles & Permissions, click Create custom role, choose Skip (blank role), type Role name ZZAUTOTEST-PL-NODEL-UNTRKEDIT-ROLE.
      – In the Part Library and Inventory group tick View, Create & Edit and leave Delete unticked. Also tick the permission that lets the role see costs and prices (See Financial Data), so the Cost fields show. Click Create (the toast reads "Role created successfully.").
2. Create [User-B]: go to Settings → Staff and add a staff member: First name ZZAUTOTEST, Last name PL-NODEL-UNTRKEDIT, an email inbox you can open (e.g. your own address with +plnodeluntrk added before the @), Role [Role-B], location [Loc-1]. Save.
      – Open the invitation email in that inbox, accept it and set a password. [User-B] = this staff member.
      – Sign in as [User-B] in a second browser (or a private window), so the Admin stays signed in in the first browser. Below, "Browser 1" is the Admin and "Browser 2" is [User-B].
3. Browser 1: open Parts → Inventory.
4. Create [Part-U]: click New Inventory Part; type Description ZZAUTOTEST PL NO DELETE UNTRACKED EDIT and Part Number ZZAUTOTEST-PL-NODEL-UNTRK-01; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Click the Track quantities and cost of goods switch so it is off (grey). Min and Max disappear.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 4.
      – Click Save. The dialog closes.
5. Browser 1: open [Part-U], type Sell Price 15.00 and click Save.
6. Write down [Desc-New] = ZZAUTOTEST PL NO DELETE UNTRACKED EDITED.
7. Check the setup worked: in Browser 2, [User-B] finds [Part-U] with "Not Tracked", bin "[Bin-1] | 4" and Sell Price $15.00.



========== C425654 · section 20475 (S8 Permissions)
TITLE: A tracking change is refused for a user who has just lost the right to delete
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- User 2: [User-D], whose custom role [Role-D] starts with View, Create & Edit and Delete in the Part Library and Inventory group and is cut down to View only during the steps, so [User-D] becomes a user who cannot delete inventory parts while a screen is still open.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- This is the manual way to send a request from a user without the right: if the screen notices the change and hides or closes the control before you click, that item cannot be checked by hand.
- Data: one tracked part [Part-A] at [Loc-1] holding 2.
--- STEPS
- Browser 2 ([User-D]): click the [Part-A] row, click the switch so it is off. Do not save yet.
- Browser 1 (Admin): in Settings → Roles & Permissions edit [Role-D]: in the Part Library and Inventory group untick Create & Edit and Delete (keep View), untick See Financial Data and every Settings permission, and click Save.
- Browser 2: click Save.
- Browser 2: read the message shown.
- Browser 1: search [Part-A] and read its Total Quantity.
--- EXPECTED
Expected results
- Step 4: The save is refused with an access denied error.
- Step 5: [Part-A] still shows "2 Available": its tracking did not change.
- Step 3: If the screen closed the dialog or disabled Save before you could click, write "not checked by hand" in the result comment.
Source — where this behaviour comes from
Epic SV-10647; story SV-10821 (Story 8, Permissions); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S8-N2, S8-R15, read 8 Oct 2026; design canvas board 5.2 (Switch off). Tech plan §9 Security. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S8-N2: “If that user tries to change a part's tracking by any route, the request is refused with an access denied error.”
- S8-R15: “The system accepts a status change, a tracking change and an untracked part from exactly the users it accepts an inventory part delete from today.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A tracking change is refused for a user who has just lost the right to delete
Test case: C425654, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• User 2: [User-D], whose custom role [Role-D] starts with View, Create & Edit and Delete in the Part Library and Inventory group and is cut down to View only during the steps, so [User-D] becomes a user who cannot delete inventory parts while a screen is still open.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• This is the manual way to send a request from a user without the right: if the screen notices the change and hides or closes the control before you click, that item cannot be checked by hand.
• Data: one tracked part [Part-A] at [Loc-1] holding 2.
# Part 1. Setup for manual QA tester
1. Create [Role-D]: go to Settings → Roles & Permissions, click Create custom role, choose Skip (blank role), type Role name ZZAUTOTEST-PL-REVOKE-TRACK-ROLE.
      – In the Part Library and Inventory group tick View, Create & Edit, Delete. Also tick the permission that lets the role see costs and prices (See Financial Data), so the Cost fields show. Click Create (the toast reads "Role created successfully.").
2. Create [User-D]: go to Settings → Staff and add a staff member: First name ZZAUTOTEST, Last name PL-REVOKE-TRACK, an email inbox you can open (e.g. your own address with +plrevoketrk added before the @), Role [Role-D], location [Loc-1]. Save.
      – Open the invitation email in that inbox, accept it and set a password. [User-D] = this staff member.
      – Sign in as [User-D] in a second browser (or a private window), so the Admin stays signed in in the first browser. Below, "Browser 1" is the Admin and "Browser 2" is [User-D].
3. Browser 1: open Parts → Inventory.
4. Create [Part-A]: click New Inventory Part; type Description ZZAUTOTEST PL REVOKE TRACKING and Part Number ZZAUTOTEST-PL-REVOKE-TRK-01; pick any Category (e.g. Uncategorized); type Cost 5.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.
      – Click Save. The dialog closes.
5. Check the setup worked: in Browser 2, [User-D] opens [Part-A] and the Track quantities and cost of goods switch can be clicked. Click Cancel.



========== C425655 · section 20475 (S8 Permissions)
TITLE: Creating an untracked part is refused for a user who has just lost Delete
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- User 2: [User-D], whose custom role [Role-D] starts with View, Create & Edit and Delete in the Part Library and Inventory group and is cut down to View only during the steps, so [User-D] becomes a user who cannot delete inventory parts while a screen is still open.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- This is the manual way to send a request from a user without the right: if the screen notices the change and hides or closes the control before you click, that item cannot be checked by hand.
- Data: no part numbered ZZAUTOTEST-PL-REVOKE-CR-01 exists at [Loc-1].
--- STEPS
- Browser 2 ([User-D]): click New Inventory Part, type Description ZZAUTOTEST PL REVOKE CREATE and Part Number [Part-A], pick any Category, type Cost 5.00, and click the switch so it is off. Do not save yet.
- Browser 1 (Admin): in Settings → Roles & Permissions edit [Role-D]: in the Part Library and Inventory group untick Create & Edit and Delete (keep View), untick See Financial Data and every Settings permission, and click Save.
- Browser 2: click Save.
- Browser 2: read the message shown.
- Browser 1: search [Part-A] on the Active and Inactive tabs.
--- EXPECTED
Expected results
- Step 4: The save is refused with an access denied error.
- Step 5: No [Part-A] exists: no untracked part was created.
- Step 3: If the screen closed the dialog or disabled Save before you could click, write "not checked by hand" in the result comment.
Source — where this behaviour comes from
Epic SV-10647; story SV-10821 (Story 8, Permissions); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S8-N1, S8-R15, read 8 Oct 2026; design canvas board 1.6 (a new part with tracking off). Tech plan §9 Security. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S8-N1: “If a user without the 'Part Library & Inventory → Delete' permission tries to create an untracked part by any route, the request is refused with an access denied error.”
- S8-R15: “The system accepts a status change, a tracking change and an untracked part from exactly the users it accepts an inventory part delete from today.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Creating an untracked part is refused for a user who has just lost Delete
Test case: C425655, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User 1: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• User 2: [User-D], whose custom role [Role-D] starts with View, Create & Edit and Delete in the Part Library and Inventory group and is cut down to View only during the steps, so [User-D] becomes a user who cannot delete inventory parts while a screen is still open.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• This is the manual way to send a request from a user without the right: if the screen notices the change and hides or closes the control before you click, that item cannot be checked by hand.
• Data: no part numbered ZZAUTOTEST-PL-REVOKE-CR-01 exists at [Loc-1].
# Part 1. Setup for manual QA tester
1. Create [Role-D]: go to Settings → Roles & Permissions, click Create custom role, choose Skip (blank role), type Role name ZZAUTOTEST-PL-REVOKE-CREATE-ROLE.
      – In the Part Library and Inventory group tick View, Create & Edit, Delete. Also tick the permission that lets the role see costs and prices (See Financial Data), so the Cost fields show. Click Create (the toast reads "Role created successfully.").
2. Create [User-D]: go to Settings → Staff and add a staff member: First name ZZAUTOTEST, Last name PL-REVOKE-CREATE, an email inbox you can open (e.g. your own address with +plrevokecr added before the @), Role [Role-D], location [Loc-1]. Save.
      – Open the invitation email in that inbox, accept it and set a password. [User-D] = this staff member.
      – Sign in as [User-D] in a second browser (or a private window), so the Admin stays signed in in the first browser. Below, "Browser 1" is the Admin and "Browser 2" is [User-D].
3. Write down [Part-A] = ZZAUTOTEST-PL-REVOKE-CR-01.
4. Check the setup worked: in Browser 2, [User-D] opens New Inventory Part and the switch can be clicked; searching [Part-A] finds nothing. Click Cancel.



========== C425660 · section 54274 (Inventory Value net quantity (SV-10380))
TITLE: Bins of +5 and -2 show quantity 3 and $30 in Inventory Value
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one part [Part-MIX] at [Loc-1] with two bins: [Bin-1] holding 5 and [Bin-2] holding -2 (net 3).
- Every part here is tracked and costs $10.00 per unit. Negative bin quantities must be possible to enter by hand (see Setup).
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- In the top bar click Reports and open the Inventory Value report.
- Leave the as-of date on today and set the Location filter to [Loc-1] only.
- Type ZZAUTOTEST-PL-IVNET-MIX- in the report's Search box.
- Read the rows listed (Qty, Unit Cost and Total Cost).
- Read the Totals row.
--- EXPECTED
Expected results
- Step 4: One row, [Part-MIX], with Qty 3.00, Unit Cost $10.00 and Total Cost $30.00 (5 + (−2) = 3; 3 × $10.00 = $30.00). It does not show Qty 5.00 or $50.00 (the positive bin alone).
- Step 5: Totals reads Qty 3.00 and Total Cost $30.00.
Source — where this behaviour comes from
Epic SV-10647; bug SV-10380 (Inventory Value report ignores negative bins and overstates net inventory value; child of this epic, ships with it), Jira text and comments read 8 Oct 2026, acceptance criteria and Expected behavior; PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), read 8 Oct 2026, for the Inventory list and Supply filter labels. Reproduction table row "+5 and -2": expected 3 / $30. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- SV-10380 acceptance criteria: “At $10 unit cost, +5 and -2 bins produce quantity 3 and cost value $30.”
- SV-10380 expected behavior: “Use the net sum of all bin quantities, including negatives, for Inventory Value report quantities and valuation.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Bins of +5 and -2 show quantity 3 and $30 in Inventory Value
Test case: C425660, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one part [Part-MIX] at [Loc-1] with two bins: [Bin-1] holding 5 and [Bin-2] holding -2 (net 3).
• Every part here is tracked and costs $10.00 per unit. Negative bin quantities must be possible to enter by hand (see Setup).
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-MIX]: click New Inventory Part; type Description ZZAUTOTEST PL IV NET MIXED and Part Number ZZAUTOTEST-PL-IVNET-MIX-01; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 5.
      – Click + Add Bin Location, pick another bin ([Bin-2] = that bin; if the list offers no other bin, first add one in Settings → Bin Locations, e.g. ZZAUTOTEST-PL-BIN-B) and set its Quantity to 0.
      – Click Save. The dialog closes.
3. Write down [Part-MIX] = ZZAUTOTEST-PL-IVNET-MIX-01.
4. Make [Bin-2] of [Part-MIX] hold -2: open [Part-MIX], in the Inventory section change the Quantity of [Bin-2] to -2, and click Save.
      – If the dialog does not accept a negative quantity, use Settings → Data Import → Inventory instead: download the template, fill one row for [Part-MIX] giving bin [Bin-2] the quantity -2, upload it and run the import.
      – If neither way accepts a negative quantity, stop here and mark this case Blocked with the comment "no way to create negative stock by hand".
5. Check the setup worked: the [Part-MIX] row shows Bin Location / Quantity "[Bin-1] | 5" and "[Bin-2] | -2" and Average Cost $10.00.



========== C425661 · section 54274 (Inventory Value net quantity (SV-10380))
TITLE: A part with only a -2 bin shows -2 and -$20 and lowers the totals
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: two parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-IVNET-NEG-: [Part-NEG] with one bin [Bin-1] holding -2, and [Part-POS] with one bin [Bin-1] holding 4.
- Every part here is tracked and costs $10.00 per unit. Negative bin quantities must be possible to enter by hand (see Setup).
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- In the top bar click Reports and open the Inventory Value report.
- Leave the as-of date on today and set the Location filter to [Loc-1] only.
- Type ZZAUTOTEST-PL-IVNET-NEG- in the report's Search box.
- Read the rows listed (Qty, Unit Cost and Total Cost).
- Read the Totals row.
--- EXPECTED
Expected results
- Step 4: [Part-NEG] is listed (not left out) with Qty -2.00, Unit Cost $10.00 and Total Cost -$20.00 (−2 × $10.00). [Part-POS] is listed with Qty 4.00 and Total Cost $40.00.
- Step 5: Totals reads Qty 2.00 and Total Cost $20.00 (4 + (−2) = 2; $40.00 + (−$20.00) = $20.00). It does not read 4.00 / $40.00, which would mean the negative part was left out.
Source — where this behaviour comes from
Epic SV-10647; bug SV-10380 (Inventory Value report ignores negative bins and overstates net inventory value; child of this epic, ships with it), Jira text and comments read 8 Oct 2026, acceptance criteria and Expected behavior; PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), read 8 Oct 2026, for the Inventory list and Supply filter labels. Reproduction table row "-2 only": expected -2 / -$20. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- SV-10380 acceptance criteria: “A -2-only part appears with quantity -2 and cost value -$20 and reduces report totals accordingly.”
- SV-10380 expected behavior: “Include negative-quantity parts with their signed values.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A part with only a -2 bin shows -2 and -$20 and lowers the totals
Test case: C425661, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: two parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-IVNET-NEG-: [Part-NEG] with one bin [Bin-1] holding -2, and [Part-POS] with one bin [Bin-1] holding 4.
• Every part here is tracked and costs $10.00 per unit. Negative bin quantities must be possible to enter by hand (see Setup).
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-NEG]: click New Inventory Part; type Description ZZAUTOTEST PL IV NET NEGATIVE ONLY and Part Number ZZAUTOTEST-PL-IVNET-NEG-01; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 0.
      – Click Save. The dialog closes.
3. Create [Part-POS]: click New Inventory Part; type Description ZZAUTOTEST PL IV NET POSITIVE CONTROL and Part Number ZZAUTOTEST-PL-IVNET-NEG-02; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 4.
      – Click Save. The dialog closes.
4. Write down [Part-NEG] = ZZAUTOTEST-PL-IVNET-NEG-01 and [Part-POS] = ZZAUTOTEST-PL-IVNET-NEG-02.
5. Make [Bin-1] of [Part-NEG] hold -2: open [Part-NEG], in the Inventory section change the Quantity of [Bin-1] to -2, and click Save.
      – If the dialog does not accept a negative quantity, use Settings → Data Import → Inventory instead: download the template, fill one row for [Part-NEG] giving bin [Bin-1] the quantity -2, upload it and run the import.
      – If neither way accepts a negative quantity, stop here and mark this case Blocked with the comment "no way to create negative stock by hand".
6. Check the setup worked: [Part-NEG] shows bin "[Bin-1] | -2" and [Part-POS] "[Bin-1] | 4", both with Average Cost $10.00.



========== C425662 · section 54274 (Inventory Value net quantity (SV-10380))
TITLE: Bins of +5 and -5 add nothing to the Inventory Value totals
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: two parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-IVNET-ZERO-: [Part-ZERO] with [Bin-1] holding 5 and [Bin-2] holding -5 (net 0), and [Part-POS] with one bin [Bin-1] holding 4.
- Every part here is tracked and costs $10.00 per unit. Negative bin quantities must be possible to enter by hand (see Setup).
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- In the top bar click Reports and open the Inventory Value report.
- Leave the as-of date on today and set the Location filter to [Loc-1] only.
- Type ZZAUTOTEST-PL-IVNET-ZERO- in the report's Search box.
- Read the rows listed (Qty, Unit Cost and Total Cost).
- Read the Totals row.
--- EXPECTED
Expected results
- Step 4: [Part-POS] is listed with Qty 4.00 and Total Cost $40.00. [Part-ZERO] is either not listed or listed with Qty 0.00 and Total Cost $0.00; it never shows 5.00 or $50.00.
- Step 5: Totals reads Qty 4.00 and Total Cost $40.00 (5 + (−5) = 0, so [Part-ZERO] adds $0.00; $40.00 + $0.00 = $40.00, not $90.00).
Source — where this behaviour comes from
Epic SV-10647; bug SV-10380 (Inventory Value report ignores negative bins and overstates net inventory value; child of this epic, ships with it), Jira text and comments read 8 Oct 2026, acceptance criteria and Expected behavior; PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), read 8 Oct 2026, for the Inventory list and Supply filter labels. Reproduction table row "+5 and -5": expected net 0 / $0 contribution. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- SV-10380 acceptance criteria: “+5 and -5 bins contribute zero value, not $50.”
- SV-10380 expected behavior: “A net-zero part contributes zero; this bug does not mandate displaying a zero-quantity row.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Bins of +5 and -5 add nothing to the Inventory Value totals
Test case: C425662, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: two parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-IVNET-ZERO-: [Part-ZERO] with [Bin-1] holding 5 and [Bin-2] holding -5 (net 0), and [Part-POS] with one bin [Bin-1] holding 4.
• Every part here is tracked and costs $10.00 per unit. Negative bin quantities must be possible to enter by hand (see Setup).
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-ZERO]: click New Inventory Part; type Description ZZAUTOTEST PL IV NET ZERO and Part Number ZZAUTOTEST-PL-IVNET-ZERO-01; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 5.
      – Click + Add Bin Location, pick another bin ([Bin-2] = that bin; if the list offers no other bin, first add one in Settings → Bin Locations, e.g. ZZAUTOTEST-PL-BIN-B) and set its Quantity to 0.
      – Click Save. The dialog closes.
3. Create [Part-POS]: click New Inventory Part; type Description ZZAUTOTEST PL IV NET ZERO CONTROL and Part Number ZZAUTOTEST-PL-IVNET-ZERO-02; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 4.
      – Click Save. The dialog closes.
4. Write down [Part-ZERO] = ZZAUTOTEST-PL-IVNET-ZERO-01 and [Part-POS] = ZZAUTOTEST-PL-IVNET-ZERO-02.
5. Make [Bin-2] of [Part-ZERO] hold -5: open [Part-ZERO], in the Inventory section change the Quantity of [Bin-2] to -5, and click Save.
      – If the dialog does not accept a negative quantity, use Settings → Data Import → Inventory instead: download the template, fill one row for [Part-ZERO] giving bin [Bin-2] the quantity -5, upload it and run the import.
      – If neither way accepts a negative quantity, stop here and mark this case Blocked with the comment "no way to create negative stock by hand".
6. Check the setup worked: [Part-ZERO] shows "[Bin-1] | 5" and "[Bin-2] | -5"; [Part-POS] shows "[Bin-1] | 4"; both Average Cost $10.00.



========== C425663 · section 54274 (Inventory Value net quantity (SV-10380))
TITLE: Bins of +5 and +3 still show quantity 8 and $80 in Inventory Value
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one tracked part [Part-POS] at [Loc-1] with two bins, [Bin-1] holding 5 and [Bin-2] holding 3, at a cost of $10.00.
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- In the top bar click Reports and open the Inventory Value report.
- Leave the as-of date on today and set the Location filter to [Loc-1] only.
- Type ZZAUTOTEST-PL-IVNET-POS- in the report's Search box.
- Read the rows listed (Qty, Unit Cost and Total Cost).
- Read the Totals row.
--- EXPECTED
Expected results
- Step 4: [Part-POS] is listed with Qty 8.00, Unit Cost $10.00 and Total Cost $80.00 (5 + 3 = 8; 8 × $10.00 = $80.00), the same result the report gave before this fix.
- Step 5: Totals reads Qty 8.00 and Total Cost $80.00.
Source — where this behaviour comes from
Epic SV-10647; bug SV-10380 (Inventory Value report ignores negative bins and overstates net inventory value; child of this epic, ships with it), Jira text and comments read 8 Oct 2026, acceptance criteria; PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), read 8 Oct 2026, for the Inventory list and Supply filter labels. Reproduction table row "+5 and +3": current and expected both 8 / $80. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- SV-10380 acceptance criteria: “All-positive quantities retain existing results.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Bins of +5 and +3 still show quantity 8 and $80 in Inventory Value
Test case: C425663, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one tracked part [Part-POS] at [Loc-1] with two bins, [Bin-1] holding 5 and [Bin-2] holding 3, at a cost of $10.00.
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-POS]: click New Inventory Part; type Description ZZAUTOTEST PL IV NET ALL POSITIVE and Part Number ZZAUTOTEST-PL-IVNET-POS-01; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 5.
      – Click + Add Bin Location, pick another bin ([Bin-2] = that bin; if the list offers no other bin, first add one in Settings → Bin Locations, e.g. ZZAUTOTEST-PL-BIN-B) and set its Quantity to 3.
      – Click Save. The dialog closes.
3. Write down [Part-POS] = ZZAUTOTEST-PL-IVNET-POS-01.
4. Check the setup worked: [Part-POS] shows "[Bin-1] | 5", "[Bin-2] | 3", "8 Available" and Average Cost $10.00.



========== C425664 · section 54274 (Inventory Value net quantity (SV-10380))
TITLE: The Inventory list's available quantity still ignores a negative bin
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one tracked part [Part-MIX] at [Loc-1] with [Bin-1] holding 5 and [Bin-2] holding -2. Negative bin quantities must be possible to enter by hand (see Setup).
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- On the Active tab of Parts → Inventory, search [Part-MIX].
- Read the Total Quantity cell.
- Open Reports → Inventory Value, Location [Loc-1] only, as-of date today, search [Part-MIX], and read its Qty.
--- EXPECTED
Expected results
- Step 2: Total Quantity keeps the shop-floor figure it showed before this fix: "5 Available" (the positive bin only; the -2 bin is not subtracted for picking).
- Step 3: The Inventory Value report, by contrast, shows Qty 3.00 (5 + (−2)): only the report changed to the net figure.
Source — where this behaviour comes from
Epic SV-10647; bug SV-10380 (Inventory Value report ignores negative bins and overstates net inventory value; child of this epic, ships with it), Jira text and comments read 8 Oct 2026, acceptance criteria, Summary and Expected behavior; PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), read 8 Oct 2026, for the Inventory list and Supply filter labels. The 5 Available figure is the positive-bin availability the ticket describes as today's shop-floor behaviour; see notes. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- SV-10380 acceptance criteria: “The parts list's available-to-pick quantity and supply filters retain their existing behavior.”
- SV-10380 expected behavior: “Keep the shop-floor availability calculation unchanged. Availability for picking and financial valuation serve different purposes and must not share a positive-only rule merely for consistency.”
- SV-10380 summary: “The Inventory Value report uses positive-bin availability rather than net recorded stock to calculate inventory value.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The Inventory list's available quantity still ignores a negative bin
Test case: C425664, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one tracked part [Part-MIX] at [Loc-1] with [Bin-1] holding 5 and [Bin-2] holding -2. Negative bin quantities must be possible to enter by hand (see Setup).
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-MIX]: click New Inventory Part; type Description ZZAUTOTEST PL IV NET AVAILABLE and Part Number ZZAUTOTEST-PL-IVNET-PICK-01; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 5.
      – Click + Add Bin Location, pick another bin ([Bin-2] = that bin; if the list offers no other bin, first add one in Settings → Bin Locations, e.g. ZZAUTOTEST-PL-BIN-B) and set its Quantity to 0.
      – Click Save. The dialog closes.
3. Write down [Part-MIX] = ZZAUTOTEST-PL-IVNET-PICK-01.
4. Make [Bin-2] of [Part-MIX] hold -2: open [Part-MIX], in the Inventory section change the Quantity of [Bin-2] to -2, and click Save.
      – If the dialog does not accept a negative quantity, use Settings → Data Import → Inventory instead: download the template, fill one row for [Part-MIX] giving bin [Bin-2] the quantity -2, upload it and run the import.
      – If neither way accepts a negative quantity, stop here and mark this case Blocked with the comment "no way to create negative stock by hand".
5. Check the setup worked: the [Part-MIX] row shows "[Bin-1] | 5" and "[Bin-2] | -2".



========== C425665 · section 54274 (Inventory Value net quantity (SV-10380))
TITLE: The Supply filter still uses the positive bins for a part with a negative bin
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one tracked part [Part-MIX] at [Loc-1] with Min 4 and Max 10, [Bin-1] holding 5 and [Bin-2] holding -2. On the positive bins (5) it sits between Min and Max; on the net figure (3) it would be below Min. Negative bin quantities must be possible to enter by hand (see Setup).
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- On the Active tab of Parts → Inventory, search [Part-MIX].
- Open the Supply filter and choose Under-supplied; read the list.
- Change the Supply filter to Well-supplied; read the list.
--- EXPECTED
Expected results
- Step 2: [Part-MIX] is not listed under Under-supplied (the net 3 is not used by the Supply filter).
- Step 3: [Part-MIX] is listed under Well-supplied (5 on the positive bins lies between Min 4 and Max 10), as before this fix.
Source — where this behaviour comes from
Epic SV-10647; bug SV-10380 (Inventory Value report ignores negative bins and overstates net inventory value; child of this epic, ships with it), Jira text and comments read 8 Oct 2026, acceptance criteria and Code evidence; PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), read 8 Oct 2026, for the Inventory list and Supply filter labels. The positive-bin supply figure comes from the ticket's description of today's behaviour; see notes. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- SV-10380 acceptance criteria: “The parts list's available-to-pick quantity and supply filters retain their existing behavior.”
- SV-10380 code evidence: “positive-only availability is also used for operational supply filtering; preserve that behavior.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The Supply filter still uses the positive bins for a part with a negative bin
Test case: C425665, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one tracked part [Part-MIX] at [Loc-1] with Min 4 and Max 10, [Bin-1] holding 5 and [Bin-2] holding -2. On the positive bins (5) it sits between Min and Max; on the net figure (3) it would be below Min. Negative bin quantities must be possible to enter by hand (see Setup).
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-MIX]: click New Inventory Part; type Description ZZAUTOTEST PL IV NET SUPPLY and Part Number ZZAUTOTEST-PL-IVNET-SUPPLY-01; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and type Min 4 and Max 10.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 5.
      – Click + Add Bin Location, pick another bin ([Bin-2] = that bin; if the list offers no other bin, first add one in Settings → Bin Locations, e.g. ZZAUTOTEST-PL-BIN-B) and set its Quantity to 0.
      – Click Save. The dialog closes.
3. Write down [Part-MIX] = ZZAUTOTEST-PL-IVNET-SUPPLY-01.
4. Make [Bin-2] of [Part-MIX] hold -2: open [Part-MIX], in the Inventory section change the Quantity of [Bin-2] to -2, and click Save.
      – If the dialog does not accept a negative quantity, use Settings → Data Import → Inventory instead: download the template, fill one row for [Part-MIX] giving bin [Bin-2] the quantity -2, upload it and run the import.
      – If neither way accepts a negative quantity, stop here and mark this case Blocked with the comment "no way to create negative stock by hand".
5. Check the setup worked: the [Part-MIX] row shows "[Bin-1] | 5", "[Bin-2] | -2", Min 4 and Max 10.



========== C425666 · section 54274 (Inventory Value net quantity (SV-10380))
TITLE: Fractional bins of +2.5 and -1.25 show quantity 1.25 and $12.50
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: one part [Part-FRAC] at [Loc-1] with [Bin-1] holding 2.5 and [Bin-2] holding -1.25 (net 1.25). The part's unit of measure must allow fractional quantities (see Setup).
- Every part here is tracked and costs $10.00 per unit. Negative bin quantities must be possible to enter by hand (see Setup).
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- In the top bar click Reports and open the Inventory Value report.
- Leave the as-of date on today and set the Location filter to [Loc-1] only.
- Type ZZAUTOTEST-PL-IVNET-FRAC- in the report's Search box.
- Read the rows listed (Qty, Unit Cost and Total Cost).
- Read the Totals row.
--- EXPECTED
Expected results
- Step 4: [Part-FRAC] shows Qty 1.25, Unit Cost $10.00 and Total Cost $12.50 (2.5 + (−1.25) = 1.25; 1.25 × $10.00 = $12.50).
- Step 5: Totals reads Qty 1.25 and Total Cost $12.50.
Source — where this behaviour comes from
Epic SV-10647; bug SV-10380 (Inventory Value report ignores negative bins and overstates net inventory value; child of this epic, ships with it), Jira text and comments read 8 Oct 2026, acceptance criteria; PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), read 8 Oct 2026, for the Inventory list and Supply filter labels. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- SV-10380 acceptance criteria: “Fractional quantities retain supported precision and existing monetary rounding rules.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Fractional bins of +2.5 and -1.25 show quantity 1.25 and $12.50
Test case: C425666, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: one part [Part-FRAC] at [Loc-1] with [Bin-1] holding 2.5 and [Bin-2] holding -1.25 (net 1.25). The part's unit of measure must allow fractional quantities (see Setup).
• Every part here is tracked and costs $10.00 per unit. Negative bin quantities must be possible to enter by hand (see Setup).
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-FRAC]: click New Inventory Part; type Description ZZAUTOTEST PL IV NET FRACTION and Part Number ZZAUTOTEST-PL-IVNET-FRAC-01; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 2.5.
      – Click + Add Bin Location, pick another bin ([Bin-2] = that bin; if the list offers no other bin, first add one in Settings → Bin Locations, e.g. ZZAUTOTEST-PL-BIN-B) and set its Quantity to 0.
      – Click Save. The dialog closes.
3. Write down [Part-FRAC] = ZZAUTOTEST-PL-IVNET-FRAC-01. If the Quantity field does not accept 2.5, mark this case Blocked with the comment "no fractional quantities by hand".
4. Make [Bin-2] of [Part-FRAC] hold -1.25: open [Part-FRAC], in the Inventory section change the Quantity of [Bin-2] to -1.25, and click Save.
      – If the dialog does not accept a negative quantity, use Settings → Data Import → Inventory instead: download the template, fill one row for [Part-FRAC] giving bin [Bin-2] the quantity -1.25, upload it and run the import.
      – If neither way accepts a negative quantity, stop here and mark this case Blocked with the comment "no way to create negative stock by hand".
5. Check the setup worked: the [Part-FRAC] row shows "[Bin-1] | 2.5" and "[Bin-2] | -1.25" and Average Cost $10.00.



========== C425667 · section 54274 (Inventory Value net quantity (SV-10380))
TITLE: The Inventory Value export shows the same net figures as the screen
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: two parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-IVNET-EXP-: [Part-MIX] with [Bin-1] 5 and [Bin-2] -2, and [Part-NEG] with one bin [Bin-1] holding -2.
- A spreadsheet program or text editor to open a CSV file.
- Every part here is tracked and costs $10.00 per unit. Negative bin quantities must be possible to enter by hand (see Setup).
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- In the top bar click Reports and open the Inventory Value report.
- Leave the as-of date on today and set the Location filter to [Loc-1] only.
- Type ZZAUTOTEST-PL-IVNET-EXP- in the report's Search box.
- Read the rows listed (Qty, Unit Cost and Total Cost).
- Read the Totals row.
- Open the report's export menu and export as CSV.
- Open the CSV file and read the rows for [Part-MIX] and [Part-NEG] and the Totals line.
--- EXPECTED
Expected results
- Step 4: [Part-MIX] Qty 3.00, Total Cost $30.00; [Part-NEG] Qty -2.00, Total Cost -$20.00.
- Step 5: Totals Qty 1.00 and Total Cost $10.00 (3 + (−2) = 1; $30.00 + (−$20.00) = $10.00).
- Step 7: The CSV gives the same figures: [Part-MIX] quantity 3 and total cost $30.00; [Part-NEG] quantity -2 and total cost -$20.00; the Totals line quantity 1 and total cost $10.00. A negative amount is written with the minus before the $ (-$20.00).
Source — where this behaviour comes from
Epic SV-10647; bug SV-10380 (Inventory Value report ignores negative bins and overstates net inventory value; child of this epic, ships with it), Jira text and comments read 8 Oct 2026, acceptance criteria; PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), read 8 Oct 2026, for the Inventory list and Supply filter labels. Export file shape (As of line, Locations line, header, rows, Totals line) as recorded for the Inventory Value report in the app playbook. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- SV-10380 acceptance criteria: “Report rows, aggregate totals, exports and newly captured snapshots use the same net quantity basis for the same scope and cutoff. Quantity-dependent displayed values use that same basis.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The Inventory Value export shows the same net figures as the screen
Test case: C425667, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: two parts at [Loc-1] whose numbers start ZZAUTOTEST-PL-IVNET-EXP-: [Part-MIX] with [Bin-1] 5 and [Bin-2] -2, and [Part-NEG] with one bin [Bin-1] holding -2.
• A spreadsheet program or text editor to open a CSV file.
• Every part here is tracked and costs $10.00 per unit. Negative bin quantities must be possible to enter by hand (see Setup).
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Create [Part-MIX]: click New Inventory Part; type Description ZZAUTOTEST PL IV NET EXPORT MIXED and Part Number ZZAUTOTEST-PL-IVNET-EXP-01; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 5.
      – Click + Add Bin Location, pick another bin ([Bin-2] = that bin; if the list offers no other bin, first add one in Settings → Bin Locations, e.g. ZZAUTOTEST-PL-BIN-B) and set its Quantity to 0.
      – Click Save. The dialog closes.
3. Create [Part-NEG]: click New Inventory Part; type Description ZZAUTOTEST PL IV NET EXPORT NEGATIVE and Part Number ZZAUTOTEST-PL-IVNET-EXP-02; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 0.
      – Click Save. The dialog closes.
4. Write down [Part-MIX] = ZZAUTOTEST-PL-IVNET-EXP-01 and [Part-NEG] = ZZAUTOTEST-PL-IVNET-EXP-02.
5. Make [Bin-2] of [Part-MIX] hold -2: open [Part-MIX], in the Inventory section change the Quantity of [Bin-2] to -2, and click Save.
      – If the dialog does not accept a negative quantity, use Settings → Data Import → Inventory instead: download the template, fill one row for [Part-MIX] giving bin [Bin-2] the quantity -2, upload it and run the import.
      – If neither way accepts a negative quantity, stop here and mark this case Blocked with the comment "no way to create negative stock by hand".
6. Make [Bin-1] of [Part-NEG] hold -2: open [Part-NEG], in the Inventory section change the Quantity of [Bin-1] to -2, and click Save.
      – If the dialog does not accept a negative quantity, use Settings → Data Import → Inventory instead: download the template, fill one row for [Part-NEG] giving bin [Bin-1] the quantity -2, upload it and run the import.
      – If neither way accepts a negative quantity, stop here and mark this case Blocked with the comment "no way to create negative stock by hand".
7. Check the setup worked: [Part-MIX] shows "[Bin-1] | 5" and "[Bin-2] | -2"; [Part-NEG] shows "[Bin-1] | -2".



========== C425668 · section 54274 (Inventory Value net quantity (SV-10380))
TITLE: Inventory Value location and category filters still scope the net figures
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1]. [Loc-2] = a second location created in Setup.
- Data: [Part-L1] at [Loc-1] in category [Cat-A] with one bin holding -2; [Part-L2] at [Loc-2] with [Bin-1] holding 5 and [Bin-2] holding -2. Both cost $10.00 per unit. Negative bin quantities must be possible to enter by hand (see Setup).
- Organisation isolation (another company's data never appearing) cannot be checked by hand.
- Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
--- STEPS
- Open Reports → Inventory Value, as-of date today, Location filter [Loc-1] only, Search ZZAUTOTEST-PL-IVNET-LOC-.
- Read the rows and the Totals row.
- Change the Location filter to [Loc-2] only and read the rows and Totals.
- Select both [Loc-1] and [Loc-2] in the Location filter and read the rows and Totals.
- Keep both locations and set the Category filter to [Cat-A] only; read the rows and Totals.
--- EXPECTED
Expected results
- Step 2: Only [Part-L1]: Qty -2.00, Total Cost -$20.00; Totals -2.00 / -$20.00. [Part-L2] is not shown.
- Step 3: Only [Part-L2]: Qty 3.00 (5 + (−2)), Total Cost $30.00; Totals 3.00 / $30.00.
- Step 4: Both rows; Totals Qty 1.00 and Total Cost $10.00 (−2 + 3 = 1; −$20.00 + $30.00 = $10.00).
- Step 5: Only [Part-L1] (the only part in [Cat-A]); Totals -2.00 / -$20.00.
- Steps 1 to 5: Organisation isolation cannot be checked by hand; write "not checked by hand" for it in the result comment.
Source — where this behaviour comes from
Epic SV-10647; bug SV-10380 (Inventory Value report ignores negative bins and overstates net inventory value; child of this epic, ships with it), Jira text and comments read 8 Oct 2026, acceptance criteria; PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), read 8 Oct 2026, for the Inventory list and Supply filter labels. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- SV-10380 acceptance criteria: “Existing location access, organization isolation and report filters remain enforced.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Inventory Value location and category filters still scope the net figures
Test case: C425668, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1]. [Loc-2] = a second location created in Setup.
• Data: [Part-L1] at [Loc-1] in category [Cat-A] with one bin holding -2; [Part-L2] at [Loc-2] with [Bin-1] holding 5 and [Bin-2] holding -2. Both cost $10.00 per unit. Negative bin quantities must be possible to enter by hand (see Setup).
• Organisation isolation (another company's data never appearing) cannot be checked by hand.
• Names, numbers and amounts marked (e.g. …) are examples; the quantities, costs, Min and Max values and the tracked or untracked state given here must hold exactly, because the expected results are worked out from them.
# Part 1. Setup for manual QA tester
1. Go to Settings → Locations and add a location named ZZAUTOTEST PL IV NET LOC 2 (fill the required fields with any values). [Loc-2] = this location.
2. Go to Settings → Categories and add a category named ZZAUTOTEST PL IV NET CATEGORY. [Cat-A] = this category.
3. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
4. Create [Part-L1]: New Inventory Part, Description ZZAUTOTEST PL IV NET LOCATION ONE, Part Number ZZAUTOTEST-PL-IVNET-LOC-01, Category [Cat-A], Cost 10.00, tracking on, keep the bin row the dialog fills in ([Bin-1] = that bin, e.g. General Storage) with Quantity 0, Save.
5. Make [Bin-1] of [Part-L1] hold -2: open [Part-L1], in the Inventory section change the Quantity of [Bin-1] to -2, and click Save.
      – If the dialog does not accept a negative quantity, use Settings → Data Import → Inventory instead: download the template, fill one row for [Part-L1] giving bin [Bin-1] the quantity -2, upload it and run the import.
      – If neither way accepts a negative quantity, stop here and mark this case Blocked with the comment "no way to create negative stock by hand".
6. Pick [Loc-2] in the location switcher and open Parts → Inventory.
7. Create [Part-L2]: click New Inventory Part; type Description ZZAUTOTEST PL IV NET LOCATION TWO and Part Number ZZAUTOTEST-PL-IVNET-LOC-02; pick any Category (e.g. Uncategorized); type Cost 10.00.
      – Leave Track quantities and cost of goods on and leave Min and Max empty.
      – In the Inventory section keep the bin row the dialog filled in ([Bin-1] = that bin, e.g. General Storage) and set its Quantity to 5.
      – Click + Add Bin Location, pick another bin ([Bin-2] = that bin; if the list offers no other bin, first add one in Settings → Bin Locations, e.g. ZZAUTOTEST-PL-BIN-B) and set its Quantity to 0.
      – Click Save. The dialog closes.
8. Make [Bin-2] of [Part-L2] hold -2: open [Part-L2], in the Inventory section change the Quantity of [Bin-2] to -2, and click Save.
      – If the dialog does not accept a negative quantity, use Settings → Data Import → Inventory instead: download the template, fill one row for [Part-L2] giving bin [Bin-2] the quantity -2, upload it and run the import.
      – If neither way accepts a negative quantity, stop here and mark this case Blocked with the comment "no way to create negative stock by hand".
9. Write down [Part-L1] = ZZAUTOTEST-PL-IVNET-LOC-01 and [Part-L2] = ZZAUTOTEST-PL-IVNET-LOC-02.
10. Check the setup worked: at [Loc-1], [Part-L1] shows "[Bin-1] | -2"; at [Loc-2], [Part-L2] shows "[Bin-1] | 5" and "[Bin-2] | -2".

