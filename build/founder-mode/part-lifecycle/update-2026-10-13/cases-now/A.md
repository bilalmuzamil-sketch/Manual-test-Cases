

========== C154752 · section 20468 (S1 Active / Inactive tabs)
TITLE: Inventory opens on the Active tab, with the Inactive tab beside it
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: 1 active, tracked part of this case at [Loc-1]: [Part-A] (example part number ZZAUTOTEST-PL-TABS-01). The number and description are examples; the part must be active and stocked at [Loc-1].
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu.
- Look at the area between the page title "Inventory" and the table.
- Type [Part-A] in the Search box.
- Click the Inactive tab.
- Click the Active tab.
--- EXPECTED
Expected results
- Step 1: The Inventory page opens with two tabs, "Active" and "Inactive", and "Active" is the selected tab (shown in blue) without you clicking it.
- Step 2: The two tabs sit on their own line directly under the title "Inventory". The search and filter row (Search, Bin Location, Category, Supply, the columns icon, the ⋮ menu and New Inventory Part) sits below the tabs, not beside them.
- Step 3: The Active tab lists [Part-A] (1 row).
- Step 4: "Inactive" becomes the selected tab and [Part-A] is not listed there.
- Step 5: "Active" is selected again and [Part-A] is listed again.
Source — where this behaviour comes from
Epic SV-10647; story SV-10814 (Story 1, Active and Inactive Tabs on the Inventory List); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S1-R1, S1-R2, S1-R8, read 8 Oct 2026; design canvas board 3.5 (The Inactive tab), board 4.1 (The actions menu), board 4.10 (Branch: no inactive parts). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S1-R1: “The Inventory list shows two tabs, Active and Inactive.”
- S1-R2: “Active is the selected tab when the page opens.”
- S1-R8: “The Active and Inactive tabs sit on their own line under the page title, above the search and filter row.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Inventory opens on the Active tab, with the Inactive tab beside it
Test case: C154752, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: 1 active, tracked part of this case at [Loc-1]: [Part-A] (example part number ZZAUTOTEST-PL-TABS-01). The number and description are examples; the part must be active and stocked at [Loc-1].
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL tabs part" and Part Number ZZAUTOTEST-PL-TABS-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Check the setup worked: on Parts → Inventory, Active tab, type [Part-A] in the Search box; exactly one row shows [Part-A]. If not, repeat step 2.



========== C154753 · section 20468 (S1 Active / Inactive tabs)
TITLE: Parts that existed before the release are active and tracked
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: 3 parts at [Loc-1] that existed before the Part Lifecycle build was deployed and have not been changed since: [Old-1], [Old-2], [Old-3]. [Old-2] has a quantity above 0 and Min and Max set. This case only reads them; it changes nothing.
--- STEPS
- Sign in on the Part Lifecycle build as [User-A].
- Pick [Loc-1] in the location selector in the top bar.
- In the top bar click Parts, then click Inventory in the left menu.
- Type [Old-1] in the Search box.
- Replace the search text with [Old-2].
- Replace the search text with [Old-3].
- Click the Inactive tab.
- Type [Old-1] in the Search box.
- Replace the search text with [Old-2].
- Replace the search text with [Old-3].
- Click the Active tab.
- Replace the search text with [Old-2].
- Click the [Old-2] row.
- Click Cancel.
- Open Settings and look through Settings, the Parts group (Pricing, Bin Locations, Categories) and Roles & Permissions.
- Pick another location in the location selector.
- Open Parts → Inventory there (repeat these two steps for every location).
--- EXPECTED
Expected results
- Steps 4 to 6: Each of [Old-1], [Old-2] and [Old-3] is listed on the Active tab, and its total quantity column shows a number, never "Not Tracked".
- Steps 8 to 10: None of the three is listed on the Inactive tab.
- Step 13: Edit Inventory Part opens with a green "Active" pill in the title row, Part Status set to Active, and the "Track quantities and cost of goods" switch on, with Min and Max showing [Old-2-Min] and [Old-2-Max].
- Step 15: There is no on/off setting for the Active and Inactive tabs or for tracking: the feature is simply on.
- Step 17: Every location shows the Active and Inactive tabs.
Source — where this behaviour comes from
Epic SV-10647; story SV-10814 (Story 1, Active and Inactive Tabs on the Inventory List); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S1-R5, S1-R5a, S1-R5b, read 8 Oct 2026; design canvas board 3.1 (Part Status in the dialog), board 1.1 (New Inventory Part opens), board 5.3 (The list says Not Tracked). Tech plan "Parts Lifecycle Update — Technical Implementation Plan" (7 Oct 2026), §4 Database Changes (Data migrations). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S1-R5: “Every part that exists on the day of release is active.”
- S1-R5a: “Every part that exists on the day of release is tracked.”
- S1-R5b: “The feature is on for every shop on the day of release. There is no rollout setting.”
- Tech plan §4 Database Changes (Data migrations): “Release-day state comes from `DEFAULT 1` (active and tracked, S1-R5/R5a). There is no separate backfill and no rollout setting (S1-R5b).”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Parts that existed before the release are active and tracked
Test case: C154753, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: 3 parts at [Loc-1] that existed before the Part Lifecycle build was deployed and have not been changed since: [Old-1], [Old-2], [Old-3]. [Old-2] has a quantity above 0 and Min and Max set. This case only reads them; it changes nothing.
# Part 1. Setup for manual QA tester
- Before the Part Lifecycle build is deployed, sign in on the earlier build as [User-A], pick [Loc-1], and create 3 parts the way that build allows (Parts → Catalog → New Catalog Part, then Parts → Inventory → New Inventory Part picking that catalog part), with part numbers such as ZZAUTOTEST-PL-RELEASE-01, -02 and -03, Quantity 4 each, and on -02 Min 1 and Max 6.
- If the build was deployed before step 1 could be done, pick instead any 3 parts that the Inventory list at [Loc-1] showed before the deployment and that nobody has changed since (this case does not change them).
- [Old-1], [Old-2], [Old-3] = the three part numbers. [Old-2-Min] and [Old-2-Max] = the Min and Max [Old-2] had before the deployment (e.g. 1 and 6).
- Check the setup worked: on the Part Lifecycle build, Parts → Inventory, the Search box finds each of [Old-1], [Old-2] and [Old-3] on one of the two tabs. If one is not found, replace it with another part that existed before the deployment.



========== C425585 · section 20468 (S1 Active / Inactive tabs)
TITLE: Each tab lists only the parts with that status at the current location
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Locations: [Loc-1] and [Loc-2], two locations [User-A] can pick in the location selector in the top bar (Setup creates [Loc-2] if only one exists).
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [Part-A] (e.g. ZZAUTOTEST-PL-LOCTAB-01) active at [Loc-1] and not stocked at [Loc-2]. [Part-B] (e.g. ZZAUTOTEST-PL-LOCTAB-02) stocked at both locations with the same part number: inactive at [Loc-1], active at [Loc-2]. Numbers and descriptions are examples; the statuses and locations must hold.
--- STEPS
- With [Loc-1] picked, click Parts in the top bar, then Inventory in the left menu.
- Type ZZAUTOTEST-PL-LOCTAB in the Search box.
- Click the Inactive tab.
- Pick [Loc-2] in the location selector in the top bar.
- Open Parts → Inventory and make sure the Active tab is selected.
- Type ZZAUTOTEST-PL-LOCTAB in the Search box.
- Click the Inactive tab.
--- EXPECTED
Expected results
- Step 2: At [Loc-1] the Active tab lists [Part-A] and does not list [Part-B]: 1 row.
- Step 3: At [Loc-1] the Inactive tab lists [Part-B] and does not list [Part-A]: 1 row.
- Step 6: At [Loc-2] the Active tab lists [Part-B], because it is still active at [Loc-2]: 1 row. [Part-A] is not listed (it is not stocked at [Loc-2]).
- Step 7: At [Loc-2] the Inactive tab lists no ZZAUTOTEST-PL-LOCTAB part. Making [Part-B] inactive at [Loc-1] did not change it at [Loc-2].
Source — where this behaviour comes from
Epic SV-10647; story SV-10814 (Story 1, Active and Inactive Tabs on the Inventory List); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S1-R3, S1-R4, §4 Key Decisions, read 8 Oct 2026; design canvas board 3.5 (The Inactive tab), board 2.5 (Lethbridge: renamed there too). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S1-R3: “The Active tab lists only parts that are active at the current location.”
- S1-R4: “The Inactive tab lists only parts that are inactive at the current location.”
- PRD §4 Key Decisions (Active and tracked are set per location): “Active and tracked are set per location. A part is stocked at a location, and whether the shop still sells it, or counts it, is that location's call. Changing either state at one location never changes the same part at another location.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Each tab lists only the parts with that status at the current location
Test case: C425585, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Locations: [Loc-1] and [Loc-2], two locations [User-A] can pick in the location selector in the top bar (Setup creates [Loc-2] if only one exists).
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [Part-A] (e.g. ZZAUTOTEST-PL-LOCTAB-01) active at [Loc-1] and not stocked at [Loc-2]. [Part-B] (e.g. ZZAUTOTEST-PL-LOCTAB-02) stocked at both locations with the same part number: inactive at [Loc-1], active at [Loc-2]. Numbers and descriptions are examples; the statuses and locations must hold.
# Part 1. Setup for manual QA tester
- If the location selector in the top bar lists only one location, create a second one: Settings → Locations → New Location, type a name (e.g. ZZAUTOTEST-PL-LOC-B) and the other required fields, and save. [Loc-2] = the second location; [Loc-1] = the one you work in first.
- Pick [Loc-1] in the location selector.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL loc tab part A" and Part Number ZZAUTOTEST-PL-LOCTAB-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create [Part-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL loc tab part B" and Part Number ZZAUTOTEST-PL-LOCTAB-02 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-B] = the part number you typed.
- Pick [Loc-2] in the location selector and create the same part there: New Inventory Part, the same Description "ZZAUTOTEST PL loc tab part B" and exactly the same Part Number [Part-B] (same upper and lower case), any Category, Cost (e.g. 10.00), Sell Price (e.g. 20.00), tracking on, default bin Quantity (e.g. 3), Save.
- Pick [Loc-1] again. Make [Part-B] inactive: on the Active tab type [Part-B] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Check the setup worked: at [Loc-1] the Inactive tab searched for ZZAUTOTEST-PL-LOCTAB lists only [Part-B]; at [Loc-2] the Active tab searched for ZZAUTOTEST-PL-LOCTAB lists [Part-B]. If not, redo steps 5 and 6.



========== C425586 · section 20468 (S1 Active / Inactive tabs)
TITLE: Switching tabs ends bulk mode and clears the ticked rows
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 2 active parts [Part-A] and [Part-B] and 2 inactive parts [Part-C] and [Part-D], all with part numbers starting ZZAUTOTEST-PL-SWITCH- (e.g. -01 to -04). Numbers are examples; the statuses must hold.
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-SWITCH in the Search box.
- Click the ⋮ actions menu button in the toolbar (to the left of New Inventory Part).
- Click Deactivate parts.
- Click the [Part-A] row.
- Click the [Part-B] row.
- Click the Inactive tab.
- If the Search box is empty, type ZZAUTOTEST-PL-SWITCH in it.
- Click the ⋮ actions menu button.
- Click Activate parts.
- Click the [Part-C] row.
- Click the Active tab.
- Click the Inactive tab.
--- EXPECTED
Expected results
- Step 6: The bulk bar reads "2 selected" and the [Part-A] and [Part-B] rows are ticked.
- Step 7: The Inactive tab opens with no bulk bar and no checkbox column: bulk mode has ended and nothing is ticked.
- Step 8: The Inactive tab lists [Part-C] and [Part-D], without checkboxes.
- Step 11: The bulk bar reads "1 selected" and the [Part-C] row is ticked.
- Step 12: The Active tab shows no bulk bar and no checkboxes; [Part-A] and [Part-B] are still listed (nothing changed status).
- Step 13: The Inactive tab shows no bulk bar and no checkboxes; [Part-C] is not ticked and is still listed.
Source — where this behaviour comes from
Epic SV-10647; story SV-10814 (Story 1, Active and Inactive Tabs on the Inventory List); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S1-R6, S2-R16, read 8 Oct 2026; design canvas board 4.2 (Mode on), board 4.6 (Inactive tab, Activate parts). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S1-R6: “Switching tabs clears any rows the user had ticked.”
- S2-R16: “Switching between the Active and Inactive tabs ends the mode and clears the selection.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Switching tabs ends bulk mode and clears the ticked rows
Test case: C425586, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 2 active parts [Part-A] and [Part-B] and 2 inactive parts [Part-C] and [Part-D], all with part numbers starting ZZAUTOTEST-PL-SWITCH- (e.g. -01 to -04). Numbers are examples; the statuses must hold.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL switch A" and Part Number ZZAUTOTEST-PL-SWITCH-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create [Part-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL switch B" and Part Number ZZAUTOTEST-PL-SWITCH-02 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-B] = the part number you typed.
- Create [Part-C]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL switch C" and Part Number ZZAUTOTEST-PL-SWITCH-03 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-C] = the part number you typed.
- Create [Part-D]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL switch D" and Part Number ZZAUTOTEST-PL-SWITCH-04 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-D] = the part number you typed.
- Make [Part-C] inactive: on the Active tab type [Part-C] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Make [Part-D] inactive: on the Active tab type [Part-D] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Check the setup worked: searched for ZZAUTOTEST-PL-SWITCH, the Active tab lists [Part-A] and [Part-B] and the Inactive tab lists [Part-C] and [Part-D].



========== C425587 · section 20468 (S1 Active / Inactive tabs)
TITLE: Search, filters and sort work the same way on the Inactive tab
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 4 parts with part numbers starting ZZAUTOTEST-PL-FILT- : active [Part-A] (description "ZZAUTOTEST PL filter Alpha", category [Cat-1]) and [Part-B] ("ZZAUTOTEST PL filter Bravo", [Cat-2]); inactive [Part-C] ("ZZAUTOTEST PL filter Charlie", [Cat-1]) and [Part-D] ("ZZAUTOTEST PL filter Delta", [Cat-2]). Descriptions must sort Alpha, Bravo, Charlie, Delta; categories are examples.
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-FILT in the Search box.
- Open the Category filter and pick [Cat-1].
- Open the Category filter and pick All categories.
- Click the Description column header.
- Click the Description column header again.
- Click the Inactive tab.
- If the Search box is empty, type ZZAUTOTEST-PL-FILT in it.
- Open the Category filter and pick [Cat-1].
- Open the Category filter and pick All categories.
- Click the Description column header.
- Click the Description column header again.
--- EXPECTED
Expected results
- Step 2: The Active tab lists [Part-A] and [Part-B]: 2 rows.
- Step 3: Only [Part-A] is listed (1 row).
- Step 4: [Part-A] and [Part-B] are listed again.
- Steps 5 and 6: The list is sorted by Description, and the second click reverses the order (Alpha above Bravo in one direction, Bravo above Alpha in the other).
- Step 8: The Inactive tab lists [Part-C] and [Part-D]: 2 rows.
- Step 9: Only [Part-C] is listed (1 row), just as the same filter left only the [Cat-1] part on the Active tab.
- Step 10: [Part-C] and [Part-D] are listed again.
- Steps 11 and 12: The list is sorted by Description and the second click reverses it (Charlie above Delta, then Delta above Charlie), the same behaviour as on the Active tab.
Source — where this behaviour comes from
Epic SV-10647; story SV-10814 (Story 1, Active and Inactive Tabs on the Inventory List); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S1-R7, read 8 Oct 2026; design canvas board 3.5 (The Inactive tab), board 4.10 (Branch: no inactive parts). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S1-R7: “Search, filters and sort work the same way on both tabs.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Search, filters and sort work the same way on the Inactive tab
Test case: C425587, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 4 parts with part numbers starting ZZAUTOTEST-PL-FILT- : active [Part-A] (description "ZZAUTOTEST PL filter Alpha", category [Cat-1]) and [Part-B] ("ZZAUTOTEST PL filter Bravo", [Cat-2]); inactive [Part-C] ("ZZAUTOTEST PL filter Charlie", [Cat-1]) and [Part-D] ("ZZAUTOTEST PL filter Delta", [Cat-2]). Descriptions must sort Alpha, Bravo, Charlie, Delta; categories are examples.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- [Cat-1] and [Cat-2] = two different categories from the Category list in New Inventory Part (e.g. the first and the second offered).
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL filter Alpha" and Part Number ZZAUTOTEST-PL-FILT-01 (examples), pick [Cat-1], type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create [Part-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL filter Bravo" and Part Number ZZAUTOTEST-PL-FILT-02 (examples), pick [Cat-2], type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-B] = the part number you typed.
- Create [Part-C]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL filter Charlie" and Part Number ZZAUTOTEST-PL-FILT-03 (examples), pick [Cat-1], type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-C] = the part number you typed.
- Create [Part-D]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL filter Delta" and Part Number ZZAUTOTEST-PL-FILT-04 (examples), pick [Cat-2], type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-D] = the part number you typed.
- Make [Part-C] inactive: on the Active tab type [Part-C] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Make [Part-D] inactive: on the Active tab type [Part-D] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Check the setup worked: searched for ZZAUTOTEST-PL-FILT, the Active tab lists [Part-A] and [Part-B], and the Inactive tab lists [Part-C] and [Part-D].



========== C425588 · section 20468 (S1 Active / Inactive tabs)
TITLE: Export from each tab holds only that tab's parts
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], active [Part-A] and [Part-B] and inactive [Part-C], part numbers starting ZZAUTOTEST-PL-EXP- (examples).
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-EXP in the Search box.
- Click the ⋮ actions menu button in the toolbar.
- Click Export.
- Open the downloaded file and look for [Part-A], [Part-B] and [Part-C].
- Click the Inactive tab.
- If the Search box is empty, type ZZAUTOTEST-PL-EXP in it.
- Click the ⋮ actions menu button.
- Click Export.
- Open the second downloaded file and look for [Part-A], [Part-B] and [Part-C].
- Pick up to 3 other part numbers from the second file and search each on the Inactive tab.
--- EXPECTED
Expected results
- Step 4: A file downloads.
- Step 5: The file from the Active tab holds [Part-A] and [Part-B] and does not hold [Part-C].
- Step 9: A second file downloads.
- Step 10: The file from the Inactive tab holds [Part-C] and does not hold [Part-A] or [Part-B].
- Step 11: Every part number picked from the second file is found on the Inactive tab: the Inactive export holds only inactive parts.
Source — where this behaviour comes from
Epic SV-10647; story SV-10814 (Story 1, Active and Inactive Tabs on the Inventory List); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S1-R9, read 8 Oct 2026; design canvas board 4.1 (The actions menu). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S1-R9: “Export in the actions menu exports the parts on the tab that shows: active parts from the Active tab, inactive parts from the Inactive tab.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Export from each tab holds only that tab's parts
Test case: C425588, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], active [Part-A] and [Part-B] and inactive [Part-C], part numbers starting ZZAUTOTEST-PL-EXP- (examples).
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL export A" and Part Number ZZAUTOTEST-PL-EXP-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create [Part-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL export B" and Part Number ZZAUTOTEST-PL-EXP-02 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-B] = the part number you typed.
- Create [Part-C]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL export C" and Part Number ZZAUTOTEST-PL-EXP-03 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-C] = the part number you typed.
- Make [Part-C] inactive: on the Active tab type [Part-C] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Check the setup worked: the Active tab searched for ZZAUTOTEST-PL-EXP lists [Part-A] and [Part-B]; the Inactive tab lists [Part-C].



========== C425589 · section 20468 (S1 Active / Inactive tabs)
TITLE: Export shows Not Tracked for an untracked part and has no status column
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 2 active parts with part numbers starting ZZAUTOTEST-PL-EXPNT- : [Part-T] tracked with quantity 6, and [Part-U] untracked with a bin holding quantity 4. Numbers are examples; the tracking states must hold.
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-EXPNT in the Search box.
- Click the ⋮ actions menu button in the toolbar.
- Click Export.
- Open the downloaded file and find the rows for [Part-T] and [Part-U].
- Read every column heading in the file.
--- EXPECTED
Expected results
- Step 5: In the quantity column, the [Part-U] row reads "Not Tracked" and the [Part-T] row reads 6.
- Step 6: No column holds the part's status: there is no Status, Active or Inactive column.
Source — where this behaviour comes from
Epic SV-10647; story SV-10814 (Story 1, Active and Inactive Tabs on the Inventory List); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S1-R9a, read 8 Oct 2026; design canvas board 5.3 (The list says Not Tracked). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S1-R9a: “An untracked part exports "Not Tracked" in the quantity column. The export has no status column.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Export shows Not Tracked for an untracked part and has no status column
Test case: C425589, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 2 active parts with part numbers starting ZZAUTOTEST-PL-EXPNT- : [Part-T] tracked with quantity 6, and [Part-U] untracked with a bin holding quantity 4. Numbers are examples; the tracking states must hold.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-T]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL export tracked" and Part Number ZZAUTOTEST-PL-EXPNT-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 6, and click Save. [Part-T] = the part number you typed.
- Create [Part-U]: Parts → Inventory → New Inventory Part, Description "ZZAUTOTEST PL export untracked", Part Number ZZAUTOTEST-PL-EXPNT-02 (examples), any Category, Cost (e.g. 10.00), Sell Price (e.g. 20.00), switch "Track quantities and cost of goods" off (Min and Max disappear), keep the default bin with Quantity 4, and click Save. [Part-U] = the part number you typed.
- Check the setup worked: the Active tab searched for ZZAUTOTEST-PL-EXPNT shows [Part-T] with a total quantity of 6 and [Part-U] with "Not Tracked" in the total quantity column.



========== C425590 · section 20468 (S1 Active / Inactive tabs)
TITLE: Cycle count on the Inactive tab counts only the inactive parts
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], tracked parts with part numbers starting ZZAUTOTEST-PL-CC- : active [Part-A], inactive [Part-B] and [Part-C], each with quantity 5 (examples).
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu.
- Click the Inactive tab.
- Type ZZAUTOTEST-PL-CC in the Search box.
- Click the ⋮ actions menu button in the toolbar.
- Click Cycle count.
- Click the printer icon in the count toolbar and look at the printed count sheet (the print preview is enough).
- Close the print preview without printing.
- Click Cancel in the count toolbar.
- Click the Active tab.
- Click the ⋮ actions menu button.
- Click Cycle count.
- Click Cancel in the count toolbar.
--- EXPECTED
Expected results
- Step 4: The menu on the Inactive tab offers Cycle count.
- Step 5: The count starts on the Inactive tab: [Part-B] and [Part-C] are listed, each with an empty Count box; [Part-A] is not listed.
- Step 6: The printed count sheet lists [Part-B] and [Part-C] and does not list [Part-A].
- Step 8: The count ends without saving; quantities are unchanged.
- Step 11: On the Active tab the count lists [Part-A] with a Count box, and does not list [Part-B] or [Part-C] (if the Search box was cleared, type ZZAUTOTEST-PL-CC to see this).
- Step 12: The count ends without saving.
Source — where this behaviour comes from
Epic SV-10647; story SV-10814 (Story 1, Active and Inactive Tabs on the Inventory List); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S1-R10, read 8 Oct 2026; design canvas board 5.7 (Cycle count leaves it out). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S1-R10: “Cycle count is offered on both tabs. It counts the parts on the tab that shows, and the printed count sheet lists those parts.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Cycle count on the Inactive tab counts only the inactive parts
Test case: C425590, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], tracked parts with part numbers starting ZZAUTOTEST-PL-CC- : active [Part-A], inactive [Part-B] and [Part-C], each with quantity 5 (examples).
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL count A" and Part Number ZZAUTOTEST-PL-CC-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create [Part-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL count B" and Part Number ZZAUTOTEST-PL-CC-02 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-B] = the part number you typed.
- Create [Part-C]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL count C" and Part Number ZZAUTOTEST-PL-CC-03 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-C] = the part number you typed.
- Make [Part-B] inactive: on the Active tab type [Part-B] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Make [Part-C] inactive: on the Active tab type [Part-C] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Check the setup worked: the Inactive tab searched for ZZAUTOTEST-PL-CC lists [Part-B] and [Part-C]; the Active tab lists [Part-A].



========== C425591 · section 20468 (S1 Active / Inactive tabs)
TITLE: An empty Inactive tab says No inactive parts at this location.
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Location: [Loc-E], a location with no inactive parts at all (a new location has none).
- Data: 1 active part at [Loc-E]: [Part-A] (e.g. ZZAUTOTEST-PL-EMPTY-01).
--- STEPS
- With [Loc-E] picked, click Parts in the top bar, then Inventory in the left menu.
- If the Search box holds text, clear it.
- If a filter is narrowed, set it back (Bin Location: All bin locations, Category: All categories).
- Click the Inactive tab.
- Click the Active tab.
- Click the [Part-A] row.
- Pick Part Status → Inactive in Edit Inventory Part.
- Click Save.
- Click Deactivate in the "Deactivate part?" confirmation.
- Click the Inactive tab.
--- EXPECTED
Expected results
- Step 4: In place of the list, the Inactive tab shows "No inactive parts at this location." (grey text under the column headers); no rows are shown.
- Step 10: The Inactive tab now lists [Part-A], and the message "No inactive parts at this location." is gone.
Source — where this behaviour comes from
Epic SV-10647; story SV-10814 (Story 1, Active and Inactive Tabs on the Inventory List); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S1-N1, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 4.10 (Branch: no inactive parts). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S1-N1: “If there are no inactive parts at the location and no search or filter is narrowing the list, the Inactive tab shows "No inactive parts at this location."”
- PRD §8 User Feedback Summary (Inactive tab with no parts, nothing narrowing it): “"No inactive parts at this location."”
- PRD §8 User Feedback Summary (Inactive tab with no parts, nothing narrowing it): “In place of the list”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: An empty Inactive tab says No inactive parts at this location.
Test case: C425591, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Location: [Loc-E], a location with no inactive parts at all (a new location has none).
- Data: 1 active part at [Loc-E]: [Part-A] (e.g. ZZAUTOTEST-PL-EMPTY-01).
# Part 1. Setup for manual QA tester
- Sign in as [User-A]. Create a new location: Settings → Locations → New Location, name (e.g. ZZAUTOTEST-PL-LOC-EMPTY) and the other required fields, Save. [Loc-E] = this location.
- Pick [Loc-E] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL empty tab part" and Part Number ZZAUTOTEST-PL-EMPTY-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Check the setup worked: at [Loc-E] the Active tab lists [Part-A], and nobody has made any part inactive at [Loc-E].



========== C425592 · section 20468 (S1 Active / Inactive tabs)
TITLE: An Inactive tab emptied by a search shows the usual no-match message
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 1 inactive part [Part-A] (e.g. ZZAUTOTEST-PL-NOMATCH-01) in category [Cat-1]; [Cat-2] is another category. No part anywhere has the number ZZAUTOTEST-PL-NOMATCH-ZZZ.
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu.
- Click the Active tab.
- Type ZZAUTOTEST-PL-NOMATCH-ZZZ in the Search box.
- Click the Inactive tab.
- If the Search box is empty, type ZZAUTOTEST-PL-NOMATCH-ZZZ in it.
- Replace the search text with [Part-A].
- Open the Category filter and pick [Cat-2].
--- EXPECTED
Expected results
- Step 3: The Active tab shows the list's usual no-match empty state for a search (on the design: a magnifier icon with "No parts match the search "ZZAUTOTEST-PL-NOMATCH-ZZZ".").
- Step 5: The Inactive tab shows the same usual no-match empty state as the Active tab did, not "No inactive parts at this location."
- Step 6: [Part-A] is listed (1 row).
- Step 7: With the search and the [Cat-2] filter leaving nothing, the Inactive tab again shows the usual filtered empty state, not "No inactive parts at this location."
Source — where this behaviour comes from
Epic SV-10647; story SV-10814 (Story 1, Active and Inactive Tabs on the Inventory List); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S1-N2, read 8 Oct 2026; design canvas board 3.4 (Done), board 4.10 (Branch: no inactive parts). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S1-N2: “If a search or filter leaves the Inactive tab empty, it shows the list's standard filtered empty state.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: An Inactive tab emptied by a search shows the usual no-match message
Test case: C425592, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 1 inactive part [Part-A] (e.g. ZZAUTOTEST-PL-NOMATCH-01) in category [Cat-1]; [Cat-2] is another category. No part anywhere has the number ZZAUTOTEST-PL-NOMATCH-ZZZ.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- [Cat-1] and [Cat-2] = two different categories from the Category list (e.g. the first and second offered).
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL no match part" and Part Number ZZAUTOTEST-PL-NOMATCH-01 (examples), pick [Cat-1], type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Make [Part-A] inactive: on the Active tab type [Part-A] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Check the setup worked: the Inactive tab searched for [Part-A] lists 1 row.



========== C154754 · section 20469 (S2 Deactivate parts)
TITLE: The actions menu offers Deactivate parts between Cycle count and Export
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 1 active part [Part-A] and 1 inactive part [Part-B], part numbers starting ZZAUTOTEST-PL-MENU- (examples).
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Click the ⋮ actions menu button in the toolbar (to the left of New Inventory Part).
- Press Escape to close the menu.
- Click the Inactive tab.
- Click the ⋮ actions menu button.
- Press Escape to close the menu.
- Click the Active tab.
- Click the ⋮ actions menu button.
- Click Deactivate parts.
- Click the X at the right end of the dark bar.
--- EXPECTED
Expected results
- Step 2: The menu lists, from top to bottom, "Cycle count", "Deactivate parts" and "Export" (3 entries). "Activate parts" is not in it.
- Step 5: On the Inactive tab the menu lists "Cycle count", "Activate parts" and "Export". "Deactivate parts" is not in it.
- Step 9: Bulk mode turns on: a dark bar appears under the tabs and a checkbox column appears in the list.
- Step 10: Bulk mode ends; the bar and the checkboxes disappear.
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-R1, S2-R2, read 8 Oct 2026; design canvas board 4.1 (The actions menu), board 4.6 (Inactive tab, Activate parts). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S2-R1: “Bulk deactivation is a mode. The user turns it on from the Inventory actions menu, the three-dot button in the toolbar that holds Cycle count and Export.”
- S2-R2: “The menu entry reads "Deactivate parts" while the Active tab shows and "Activate parts" while the Inactive tab shows. Only one of the two shows at a time. It sits between Cycle count and Export.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The actions menu offers Deactivate parts between Cycle count and Export
Test case: C154754, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 1 active part [Part-A] and 1 inactive part [Part-B], part numbers starting ZZAUTOTEST-PL-MENU- (examples).
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL menu A" and Part Number ZZAUTOTEST-PL-MENU-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create [Part-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL menu B" and Part Number ZZAUTOTEST-PL-MENU-02 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-B] = the part number you typed.
- Make [Part-B] inactive: on the Active tab type [Part-B] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Check the setup worked: searched for ZZAUTOTEST-PL-MENU, the Active tab lists [Part-A] and the Inactive tab lists [Part-B].



========== C154755 · section 20469 (S2 Deactivate parts)
TITLE: Outside bulk mode the list has no checkboxes and a row click opens the part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], active [Part-A] and inactive [Part-B], part numbers starting ZZAUTOTEST-PL-NOBOX- (examples). Bulk mode is off.
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-NOBOX in the Search box.
- Look at the left edge of the table and at its header row.
- Click the [Part-A] row (on its description).
- Click Cancel.
- Click the Inactive tab.
- If the Search box is empty, type ZZAUTOTEST-PL-NOBOX in it.
- Click the [Part-B] row.
- Click Cancel.
--- EXPECTED
Expected results
- Step 3: There is no checkbox column and no checkbox in the header row, so no part can be ticked.
- Step 4: Edit Inventory Part opens for [Part-A] (its Part Number field holds [Part-A]); nothing is ticked.
- Step 5: The dialog closes without changes.
- Step 8: Edit Inventory Part opens for [Part-B]; the Inactive tab has no checkbox column either.
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-R3, S2-N2, §4 Key Decisions, read 8 Oct 2026; design canvas board 4.0 (Before: the Inventory list today), board 4.1 (The actions menu), board 3.6 (Opening the inactive part). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S2-R3: “Outside the mode the Inventory list has no checkbox column, and a row click opens the part.”
- S2-N2: “Outside the mode there is no checkbox column, so no part can be ticked from the default list.”
- PRD §4 Key Decisions (Bulk status change is a mode): “Bulk status change is a mode. A row click on the Inventory list opens the part. Bulk status uses the same pattern as Cycle count: the user turns the mode on from the actions menu, checkboxes appear, search and filtering keep working, and the X on the bulk bar leaves the mode.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Outside bulk mode the list has no checkboxes and a row click opens the part
Test case: C154755, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], active [Part-A] and inactive [Part-B], part numbers starting ZZAUTOTEST-PL-NOBOX- (examples). Bulk mode is off.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL no box A" and Part Number ZZAUTOTEST-PL-NOBOX-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create [Part-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL no box B" and Part Number ZZAUTOTEST-PL-NOBOX-02 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-B] = the part number you typed.
- Make [Part-B] inactive: on the Active tab type [Part-B] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Check the setup worked: the Active tab lists [Part-A] and the Inactive tab lists [Part-B] (search ZZAUTOTEST-PL-NOBOX); no dark bulk bar is showing.



========== C154756 · section 20469 (S2 Deactivate parts)
TITLE: In bulk mode a click anywhere on a row ticks it instead of opening it
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 3 active, tracked parts [Part-A], [Part-B] and [Part-C] with part numbers starting ZZAUTOTEST-PL-ROWTICK- (examples), quantity 5 each.
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-ROWTICK in the Search box.
- Click the ⋮ actions menu button in the toolbar (to the left of New Inventory Part).
- Click Deactivate parts.
- Click the [Part-A] row on its description text.
- Click the [Part-A] row on its Category cell.
- Click the [Part-B] row on its Part Number cell.
- Click the checkbox at the left of the [Part-B] row.
--- EXPECTED
Expected results
- Step 4: The bulk bar shows "0 selected" and every row has an empty checkbox.
- Step 5: The [Part-A] row is ticked and the bar reads "1 selected". No part dialog opens.
- Step 6: The [Part-A] row is unticked and the bar reads "0 selected". No dialog opens.
- Step 7: The [Part-B] row is ticked and the bar reads "1 selected". No dialog opens.
- Step 8: The [Part-B] row is unticked and the bar reads "0 selected".
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-R5, read 8 Oct 2026; design canvas board 4.3 (Two rows ticked). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S2-R5: “While the mode is on, a click anywhere on a row ticks or unticks that row instead of opening the part.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: In bulk mode a click anywhere on a row ticks it instead of opening it
Test case: C154756, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 3 active, tracked parts [Part-A], [Part-B] and [Part-C] with part numbers starting ZZAUTOTEST-PL-ROWTICK- (examples), quantity 5 each.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL row tick A" and Part Number ZZAUTOTEST-PL-ROWTICK-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create [Part-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL row tick B" and Part Number ZZAUTOTEST-PL-ROWTICK-02 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-B] = the part number you typed.
- Create [Part-C]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL row tick C" and Part Number ZZAUTOTEST-PL-ROWTICK-03 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-C] = the part number you typed.
- Check the setup worked: the Active tab searched for ZZAUTOTEST-PL-ROWTICK lists [Part-A], [Part-B] and [Part-C] (3 rows).



========== C154757 · section 20469 (S2 Deactivate parts)
TITLE: The bulk bar sits under the tabs and counts the ticked rows
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 3 active, tracked parts [Part-A], [Part-B] and [Part-C] with part numbers starting ZZAUTOTEST-PL-BAR- (examples), quantity 5 each.
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-BAR in the Search box.
- Note where the search and filter row sits (directly under the tabs).
- Click the ⋮ actions menu button in the toolbar.
- Click Deactivate parts.
- Click the [Part-A] row.
- Click the [Part-B] row.
- Click the [Part-A] row again.
--- EXPECTED
Expected results
- Step 5: A dark bar appears directly under the Active and Inactive tabs, across the full width of the list. The search and filter row moves down and now sits under the bar.
- Step 5: From left to right the bar shows a round badge "0" followed by the word "selected", a thin divider, a blue "Deactivate" button, and an X at the right end. The New Inventory Part button is still shown.
- Step 6: The badge reads "1".
- Step 7: The badge reads "2", and the line under the table reads "2 records selected."
- Step 8: The badge reads "1".
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-R7, S2-R7b, read 8 Oct 2026; design canvas board 4.2 (Mode on), board 4.3 (Two rows ticked). Tech plan "Parts Lifecycle Update — Technical Implementation Plan" (7 Oct 2026), §3 Technical Decisions D24 (design-only details). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S2-R7: “While the mode is on, the bulk bar spans the full width of the list directly under the Active and Inactive tabs, and the search and filter row moves down under it.”
- S2-R7b: “From left to right the bar shows: the number of ticked rows in a round badge followed by the word "selected", a thin divider, and a blue button reading "Deactivate". The number updates as the user ticks.”
- Tech plan §3 Technical Decisions (D24): “Show "N records selected." under the table in bulk mode (boards 4.3, 4.9). Keep "New Inventory Part" visible in bulk mode (4.3, 4.8).”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The bulk bar sits under the tabs and counts the ticked rows
Test case: C154757, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 3 active, tracked parts [Part-A], [Part-B] and [Part-C] with part numbers starting ZZAUTOTEST-PL-BAR- (examples), quantity 5 each.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL bar A" and Part Number ZZAUTOTEST-PL-BAR-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create [Part-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL bar B" and Part Number ZZAUTOTEST-PL-BAR-02 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-B] = the part number you typed.
- Create [Part-C]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL bar C" and Part Number ZZAUTOTEST-PL-BAR-03 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-C] = the part number you typed.
- Check the setup worked: the Active tab searched for ZZAUTOTEST-PL-BAR lists [Part-A], [Part-B] and [Part-C] (3 rows).



========== C154758 · section 20469 (S2 Deactivate parts)
TITLE: The X on the bulk bar shows Clear selection and leaves bulk mode
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 3 active, tracked parts [Part-A], [Part-B] and [Part-C] with part numbers starting ZZAUTOTEST-PL-CLEAR- (examples), quantity 5 each.
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-CLEAR in the Search box.
- Click the ⋮ actions menu button in the toolbar (to the left of New Inventory Part).
- Click Deactivate parts.
- Click the [Part-A] row.
- Click the [Part-B] row.
- Hover over the X at the right end of the bar.
- Optional: turn on the computer's screen reader (Windows: Narrator, Ctrl + Windows key + Enter; Mac: VoiceOver, Command + F5), press Tab until the X is focused, listen, then turn the screen reader off.
- Click the X.
- Click the ⋮ actions menu button.
- Press Escape to close the menu.
- Click the [Part-A] row.
- Click Cancel.
--- EXPECTED
Expected results
- Step 7: Hovering the X shows "Clear selection".
- Step 8: The screen reader reads the X as "Clear selection". If you skipped this step, write "screen reader label not checked by hand" in the result comment.
- Step 9: Bulk mode ends: the dark bar and the checkbox column disappear, nothing is ticked, and the search and filter row is back directly under the tabs.
- Step 10: The menu is back to normal: "Cycle count", "Deactivate parts", "Export".
- Step 12: The row click opens Edit Inventory Part for [Part-A] (no tick); [Part-A] and [Part-B] are still on the Active tab.
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-R9, S2-R9a, read 8 Oct 2026; design canvas board 4.2 (Mode on), board 4.3 (Two rows ticked). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S2-R9: “An X button sits at the right end of the bar. Hovering it shows "Clear selection", which is also its screen reader label.”
- S2-R9a: “The X leaves the mode, clears the selection and puts the toolbar back to its normal state.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The X on the bulk bar shows Clear selection and leaves bulk mode
Test case: C154758, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 3 active, tracked parts [Part-A], [Part-B] and [Part-C] with part numbers starting ZZAUTOTEST-PL-CLEAR- (examples), quantity 5 each.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL clear A" and Part Number ZZAUTOTEST-PL-CLEAR-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create [Part-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL clear B" and Part Number ZZAUTOTEST-PL-CLEAR-02 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-B] = the part number you typed.
- Create [Part-C]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL clear C" and Part Number ZZAUTOTEST-PL-CLEAR-03 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-C] = the part number you typed.
- Check the setup worked: the Active tab searched for ZZAUTOTEST-PL-CLEAR lists [Part-A], [Part-B] and [Part-C] (3 rows).



========== C154759 · section 20469 (S2 Deactivate parts)
TITLE: Confirming Deactivate moves the ticked parts to the Inactive tab
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 3 active, tracked parts [Part-A], [Part-B] and [Part-C] with part numbers starting ZZAUTOTEST-PL-BULKOFF- (examples), quantity 5 each.
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-BULKOFF in the Search box.
- Click the ⋮ actions menu button in the toolbar (to the left of New Inventory Part).
- Click Deactivate parts.
- Click the [Part-A] row.
- Click the [Part-B] row.
- Click the Deactivate button on the bar.
- Click Deactivate in the "Deactivate parts?" confirmation.
- Wait 10 seconds without touching the page.
- Click the Inactive tab.
- If the Search box is empty, type ZZAUTOTEST-PL-BULKOFF in it.
- Click the Active tab.
- If the Search box is empty, type ZZAUTOTEST-PL-BULKOFF in it.
- Click the ⋮ actions menu button.
- Click Deactivate parts.
- Click the [Part-C] row.
- Click the Deactivate button.
- Click Deactivate in the confirmation.
--- EXPECTED
Expected results
- Step 7: The "Deactivate parts?" confirmation opens and reads "2 parts selected."
- Step 8: A green toast reads "2 parts updated." [Part-A] and [Part-B] leave the Active list at once, without a page reload; [Part-C] is still listed. The dark bar and the checkbox column disappear: bulk mode has ended and nothing is ticked.
- Step 9: The green toast closes on its own.
- Step 11: The Inactive tab lists [Part-A] and [Part-B].
- Step 17: The confirmation reads "1 part selected."
- Step 18: A green toast reads "1 part updated."; [Part-C] leaves the Active list without a reload and bulk mode ends.
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-R11, S2-R12, S2-R13, S2-R14, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 4.3 (Two rows ticked), board 4.4 (Confirm), board 4.5 (Done). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S2-R11: “When the user confirms (Story 10), every ticked part becomes inactive.”
- S2-R12: “The deactivated parts leave the Active tab without a page reload.”
- S2-R13: “The deactivated parts appear on the Inactive tab.”
- S2-R14: “When every ticked part changes, the mode ends and the selection clears.”
- PRD §8 User Feedback Summary (Bulk change, every part changed): “"{n} parts updated." ("1 part updated." for one)”
- PRD §8 User Feedback Summary (Bulk change, every part changed): “Success toast, fades on its own”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Confirming Deactivate moves the ticked parts to the Inactive tab
Test case: C154759, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 3 active, tracked parts [Part-A], [Part-B] and [Part-C] with part numbers starting ZZAUTOTEST-PL-BULKOFF- (examples), quantity 5 each.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL bulk off A" and Part Number ZZAUTOTEST-PL-BULKOFF-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create [Part-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL bulk off B" and Part Number ZZAUTOTEST-PL-BULKOFF-02 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-B] = the part number you typed.
- Create [Part-C]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL bulk off C" and Part Number ZZAUTOTEST-PL-BULKOFF-03 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-C] = the part number you typed.
- Check the setup worked: the Active tab searched for ZZAUTOTEST-PL-BULKOFF lists [Part-A], [Part-B] and [Part-C] (3 rows).



========== C154760 · section 20469 (S2 Deactivate parts)
TITLE: When some parts fail, only the failed parts stay ticked
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 2 active parts [Part-A] and [Part-B], part numbers ZZAUTOTEST-PL-PARTFAIL-01 and -02 (examples).
--- STEPS
- In browser tab 1, click Parts in the top bar, then Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-PARTFAIL in the Search box.
- Click the ⋮ actions menu button in the toolbar.
- Click Deactivate parts.
- Click the [Part-A] row.
- Click the [Part-B] row.
- Open a second browser tab on the same ShopView address and go to Parts → Inventory (tab 2).
- In tab 2, type [Part-B] in the Search box.
- In tab 2, click the [Part-B] row.
- In tab 2, pick Part Status → Inactive.
- In tab 2, click Save.
- In tab 2, click Deactivate in the "Deactivate part?" confirmation.
- Go back to tab 1 without reloading it.
- In tab 1, click the Deactivate button on the bar.
- In tab 1, click Deactivate in the "Deactivate parts?" confirmation.
- Wait 15 seconds.
- Click Close on the toast.
--- EXPECTED
Expected results
- Step 12: In tab 2 [Part-B] is deactivated ("Part deactivated." toast).
- Step 14: In tab 1 the confirmation reads "2 parts selected."
- Step 15: A red error toast reads "1 part updated, 1 could not be changed." and lists [Part-B] with the reason "Part is already in that state."
- Step 15: Bulk mode stays on and only the failed part stays ticked: the bar reads "1 selected" and the [Part-B] row is ticked. [Part-A] has left the Active list.
- Step 16: The error toast is still on screen after 15 seconds (it stays until closed).
- Step 17: The toast closes.
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-R15, S10-R13a, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 4.3 (Two rows ticked), board 4.4 (Confirm). Story SV-11040 (Verify Phase 3) checklist. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S2-R15: “When some parts fail, the mode stays on and the selection keeps only the parts that failed.”
- PRD §8 User Feedback Summary (Bulk change, some parts failed): “"{n} parts updated, {m} could not be changed." ("1 part updated, {m} could not be changed." for one)”
- PRD §8 User Feedback Summary (Bulk change, some parts failed): “Error toast, stays until closed, lists each failed part and its reason”
- S10-R13a: “The reasons are "A core follows its part. Activate or deactivate the part instead.", "Part not found." and "Part is already in that state."”
- SV-11040 verification checklist (Verify Phase 3): “Partial failure (one part changed in another tab first) → "1 part updated, 1 could not be changed." listing the reason; only the failed part stays ticked (S2-R15, S10-N2)”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: When some parts fail, only the failed parts stay ticked
Test case: C154760, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 2 active parts [Part-A] and [Part-B], part numbers ZZAUTOTEST-PL-PARTFAIL-01 and -02 (examples).
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL part fail A" and Part Number ZZAUTOTEST-PL-PARTFAIL-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create [Part-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL part fail B" and Part Number ZZAUTOTEST-PL-PARTFAIL-02 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-B] = the part number you typed.
- Check the setup worked: the Active tab searched for ZZAUTOTEST-PL-PARTFAIL lists [Part-A] and [Part-B].



========== C154762 · section 20469 (S2 Deactivate parts)
TITLE: With nothing ticked Deactivate is disabled and its hover text says why
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 1 active part [Part-A] (e.g. ZZAUTOTEST-PL-NOTICK-01).
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-NOTICK in the Search box.
- Click the ⋮ actions menu button in the toolbar (to the left of New Inventory Part).
- Click Deactivate parts.
- Hover over the Deactivate button on the bar.
- Click the Deactivate button.
- Click the [Part-A] row.
- Hover over the Deactivate button.
- Click the [Part-A] row again.
- Hover over the Deactivate button.
- Click the X at the right end of the bar.
--- EXPECTED
Expected results
- Step 5: The Deactivate button is visible but dimmed (disabled), and hovering it shows "Tick the parts to deactivate".
- Step 6: Nothing opens: no "Deactivate parts?" confirmation appears.
- Step 8: With 1 row ticked the button is bright blue (enabled) and the hover text does not appear.
- Step 10: With nothing ticked again, the button is disabled and hovering shows "Tick the parts to deactivate".
- Step 11: Bulk mode ends and [Part-A] is still active.
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-R8, S2-N1, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 4.2 (Mode on), board 4.3 (Two rows ticked). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S2-R8: “The Deactivate button is disabled while no row is ticked. Hovering it then shows "Tick the parts to deactivate".”
- S2-N1: “With nothing ticked, the Deactivate button is visible but disabled, so the confirmation cannot open.”
- PRD §8 User Feedback Summary (Deactivate hovered with nothing ticked): “"Tick the parts to deactivate"”
- PRD §8 User Feedback Summary (Deactivate hovered with nothing ticked): “Tooltip on the disabled button”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: With nothing ticked Deactivate is disabled and its hover text says why
Test case: C154762, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 1 active part [Part-A] (e.g. ZZAUTOTEST-PL-NOTICK-01).
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL no tick A" and Part Number ZZAUTOTEST-PL-NOTICK-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Check the setup worked: the Active tab searched for [Part-A] lists 1 row.



========== C154763 · section 20469 (S2 Deactivate parts)
TITLE: A part on an open work order can still be deactivated
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 1 active, tracked part [Part-A] (e.g. ZZAUTOTEST-PL-OPENWO-01) with quantity 5; an open work order [WO-1] (not completed, not invoiced) for a ZZAUTOTEST customer, with one line that holds a part request for [Part-A], quantity 1.
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type [Part-A] in the Search box.
- Click the ⋮ actions menu button in the toolbar.
- Click Deactivate parts.
- Click the [Part-A] row.
- Click the Deactivate button on the bar.
- Click Deactivate in the "Deactivate parts?" confirmation.
- In the top bar click Work Orders.
- Open [WO-1].
- Look at the line that holds [Part-A].
- Go back to Parts → Inventory.
- Click the Inactive tab.
- Type [Part-A] in the Search box.
- Click the clock icon (tooltip "Part History") at the left of the [Part-A] row.
--- EXPECTED
Expected results
- Step 7: The change goes through even though [Part-A] is on an open work order: a green toast reads "1 part updated." and [Part-A] leaves the Active tab.
- Step 10: [Part-A] is still on the [WO-1] line, exactly as [Line-Text]: same part number, description, quantity, price and total.
- Step 13: [Part-A] is listed on the Inactive tab.
- Step 14: Part History shows a new entry "Deactivated" with your name in Staff and today's date and time; the entries that were there before are unchanged.
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-E1, S2-E2, S2-E3, S10-R17, read 8 Oct 2026; design canvas board 4.4 (Confirm), board 4.5 (Done), board 3.8 (Finding it in Part History). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S2-E1: “If a part being set inactive sits on an open work order, the change still goes through.”
- S2-E2: “That part stays on the open work order.”
- S2-E3: “The part's work order and invoice history does not change. The status change is recorded in the part's own history (Story 10).”
- S10-R17: “The entry reads "Deactivated" or "Activated". When the user gave a note it reads "Deactivated | Reason: {note}" or "Activated | Reason: {note}". With no note it reads "Deactivated" or "Activated" and nothing more.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A part on an open work order can still be deactivated
Test case: C154763, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 1 active, tracked part [Part-A] (e.g. ZZAUTOTEST-PL-OPENWO-01) with quantity 5; an open work order [WO-1] (not completed, not invoiced) for a ZZAUTOTEST customer, with one line that holds a part request for [Part-A], quantity 1.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL open WO part" and Part Number ZZAUTOTEST-PL-OPENWO-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create an open work order: in the top bar click Work Orders, click New, and in the New Work Order dialog use the Add button beside Customer to create a customer (e.g. "ZZAUTOTEST PL open WO customer") and the Add button beside Asset to create an asset for it (e.g. unit "ZZAUTOTEST PL open WO-UNIT"); click Save, and click Create if a confirmation appears. [WO-1] = the work order number shown.
- On [WO-1] click New Line, type a Title (e.g. "ZZAUTOTEST PL open WO line"), and click Save & Close.
- On the [WO-1] line, click + Add Part in its Parts row; in New Part Request type [Part-A] in Part Number, pick the result that shows "Inventory Qty", set the quantity to 1, and click Save Part.
- [Line-Text] = what the line's part row shows now: part number, description, quantity, price and total (write it down).
- Check the setup worked: [WO-1] is open (not completed, not invoiced) and its line lists [Part-A] with quantity 1.



========== C425593 · section 20469 (S2 Deactivate parts)
TITLE: Turning on Deactivate parts adds a checkbox column at the left edge
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window narrow enough that the Inventory table scrolls sideways when all its columns are shown (e.g. 1280 pixels wide).
- Data: at [Loc-1], 3 active, tracked parts [Part-A], [Part-B] and [Part-C] with part numbers starting ZZAUTOTEST-PL-COLUMN- (examples), quantity 5 each.
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-COLUMN in the Search box.
- Drag the table's sideways scrollbar all the way to the right (or hold Shift and turn the mouse wheel).
- Click the ⋮ actions menu button in the toolbar.
- Click Deactivate parts.
--- EXPECTED
Expected results
- Step 3: The table shows its right-most columns; the Description column is out of view.
- Step 5: The table scrolls back to its left edge on its own, and a new narrow column with a checkbox on every row (and one in the header) is the first column, in view.
- Step 5: The column is just wide enough for the checkbox. Its exact width (44 pixels) cannot be measured by eye: write "column width not checked by hand" in the result comment.
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-R4, read 8 Oct 2026; design canvas board 4.2 (Mode on). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S2-R4: “Turning the mode on adds a checkbox column, 44px wide, at the left of the table, and scrolls the table back to its left edge so the column is in view.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Turning on Deactivate parts adds a checkbox column at the left edge
Test case: C425593, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window narrow enough that the Inventory table scrolls sideways when all its columns are shown (e.g. 1280 pixels wide).
- Data: at [Loc-1], 3 active, tracked parts [Part-A], [Part-B] and [Part-C] with part numbers starting ZZAUTOTEST-PL-COLUMN- (examples), quantity 5 each.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL column A" and Part Number ZZAUTOTEST-PL-COLUMN-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create [Part-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL column B" and Part Number ZZAUTOTEST-PL-COLUMN-02 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-B] = the part number you typed.
- Create [Part-C]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL column C" and Part Number ZZAUTOTEST-PL-COLUMN-03 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-C] = the part number you typed.
- On Parts → Inventory click the columns icon in the toolbar and tick every column, so the table is wider than the window.
- Check the setup worked: the Active tab searched for ZZAUTOTEST-PL-COLUMN lists 3 rows, and the table has a sideways scrollbar. If it has none, make the window narrower until it does.



========== C425594 · section 20469 (S2 Deactivate parts)
TITLE: The header checkbox ticks only the rows loaded so far
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide and no more than 1080 pixels tall, so 30 rows do not all fit on screen.
- Data: 35 active parts at [Loc-1] whose part numbers start ZZAUTOTEST-PL-HDR- (e.g. ZZAUTOTEST-PL-HDR-01 to ZZAUTOTEST-PL-HDR-35). The count of 35 must hold; the numbers are examples.
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-HDR in the Search box and do not scroll the list.
- Click the ⋮ actions menu button in the toolbar.
- Click Deactivate parts.
- Click the checkbox in the header row.
- Click the checkbox in the header row again.
- Click the checkbox in the header row again.
- Scroll the list down to the bottom until no more rows load.
- Click the X at the right end of the dark bar.
--- EXPECTED
Expected results
- Step 5: The bar reads "30 selected": the list loads 30 parts at a time, so only the 30 rows loaded so far are ticked (the line under the table reads "30 records selected.").
- Step 6: The bar reads "0 selected" and no row is ticked.
- Step 7: The bar reads "30 selected" again.
- Step 8: The 5 remaining parts load (35 rows in all) and are not ticked; the bar still reads "30 selected", which is exactly the number of ticked rows (35 loaded − 5 unticked = 30).
- Step 9: Bulk mode ends and no part changed status (all 35 are still on the Active tab).
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-R6, read 8 Oct 2026; design canvas board 4.6 (Inactive tab, Activate parts), board 4.9 (Branch: more than 200 ticked). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S2-R6: “The checkbox in the header ticks or clears every row loaded in the list. The list loads 30 parts at a time as the user scrolls, so it ticks only the rows loaded so far. The count in the bar shows exactly how many parts will change.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The header checkbox ticks only the rows loaded so far
Test case: C425594, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide and no more than 1080 pixels tall, so 30 rows do not all fit on screen.
- Data: 35 active parts at [Loc-1] whose part numbers start ZZAUTOTEST-PL-HDR- (e.g. ZZAUTOTEST-PL-HDR-01 to ZZAUTOTEST-PL-HDR-35). The count of 35 must hold; the numbers are examples.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create the 35 parts, either one by one (Parts → Inventory → New Inventory Part, Description e.g. "ZZAUTOTEST PL header 01", Part Number ZZAUTOTEST-PL-HDR-01, any Category, Cost 10.00, Sell Price 20.00, tracking on, Quantity 1, Save; repeat to 35), or with Settings → Data Import → Inventory: download the template that page offers, fill 35 rows with these numbers and the required columns, and import it.
- Check the setup worked: on the Active tab type ZZAUTOTEST-PL-HDR in the Search box and scroll to the bottom of the list until no more rows load; 35 rows are listed. Then reload the page.



========== C425595 · section 20469 (S2 Deactivate parts)
TITLE: The bulk bar is near-black in the light theme and white in the dark theme
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Theme: Light at the start (profile menu, the avatar at the top right → Light).
- Data: at [Loc-1], 1 active part [Part-A] (e.g. ZZAUTOTEST-PL-THEME-01).
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-THEME in the Search box.
- Click the ⋮ actions menu button in the toolbar (to the left of New Inventory Part).
- Click Deactivate parts.
- Click the [Part-A] row.
- Look at the bar's colour, the count and the word "selected", and the bar's corners.
- Click the avatar at the top right and pick Dark.
- Look at the bar's colour and its text.
- Click the avatar at the top right and pick Light.
- Click the X at the right end of the bar.
--- EXPECTED
Expected results
- Step 6: In the light theme the bar is near-black, the count "1" is white, the word "selected" is light grey, and the bar's corners are rounded.
- Step 8: In the dark theme the bar is white and its text is dark; the corners are rounded.
- Steps 6 and 8: The exact colour (#121926) and corner size (8 pixels) cannot be measured by eye: write "exact colour and corner size not checked by hand" in the result comment.
- Step 10: Bulk mode ends.
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-R7a, read 8 Oct 2026; design canvas board 4.2 (Mode on), board 4.3 (Two rows ticked). Tech plan "Parts Lifecycle Update — Technical Implementation Plan" (7 Oct 2026), Phase 3 browser-walk (check dark theme). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S2-R7a: “In the light theme the bulk bar is near-black (#121926), the count is white, and the word "selected" is light grey. In the dark theme the bar is white and its text is dark. Its corners are rounded 8px.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The bulk bar is near-black in the light theme and white in the dark theme
Test case: C425595, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Theme: Light at the start (profile menu, the avatar at the top right → Light).
- Data: at [Loc-1], 1 active part [Part-A] (e.g. ZZAUTOTEST-PL-THEME-01).
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL theme A" and Part Number ZZAUTOTEST-PL-THEME-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Click the avatar at the top right and pick Light.
- Check the setup worked: the page is in the light theme (white page background) and the Active tab searched for [Part-A] lists 1 row.



========== C425596 · section 20469 (S2 Deactivate parts)
TITLE: More than 200 ticked parts disables Deactivate and Activate
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: exactly 201 active parts at [Loc-1] whose part numbers start ZZAUTOTEST-PL-CAP- (e.g. ZZAUTOTEST-PL-CAP-001 to ZZAUTOTEST-PL-CAP-201). The count of 201 must hold; the numbers are examples.
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-CAP in the Search box.
- Scroll the list down until no more rows load (201 rows; the list loads 30 at a time, so this takes 7 loads).
- Click the ⋮ actions menu button in the toolbar.
- Click Deactivate parts.
- Click the checkbox in the header row.
- Hover over the Deactivate button.
- Click the Deactivate button.
- Click any one ticked row to untick it.
- Hover over the Deactivate button.
- Click the Deactivate button.
- Click Deactivate in the "Deactivate parts?" confirmation.
- Click the ⋮ actions menu button.
- Click Deactivate parts.
- Click the one remaining row.
- Click the Deactivate button.
- Click Deactivate in the confirmation.
- Click the Inactive tab.
- If the Search box is empty, type ZZAUTOTEST-PL-CAP in it.
- Scroll the list down until no more rows load (201 rows).
- Click the ⋮ actions menu button.
- Click Activate parts.
- Click the checkbox in the header row.
- Hover over the Activate button.
- Click any one ticked row to untick it.
- Hover over the Activate button.
- Click the X at the right end of the bar.
--- EXPECTED
Expected results
- Step 6: The bar reads "201 selected" (and "201 records selected." under the table).
- Step 7: The Deactivate button is dimmed (disabled) and hovering it shows "Select 200 parts or fewer."
- Step 8: Nothing opens.
- Step 9: The bar reads "200 selected" (201 − 1).
- Step 10: The Deactivate button is bright blue (enabled) and the hover text does not appear: 200 is allowed, only more than 200 is refused.
- Step 11: The "Deactivate parts?" confirmation opens and reads "200 parts selected."
- Step 12: A green toast reads "200 parts updated."; the 200 parts leave the Active tab without a page reload, bulk mode ends, and only the 1 part you unticked is still listed.
- Step 17: A green toast reads "1 part updated." and the list is empty for this search.
- Step 20: The Inactive tab lists all 201 parts.
- Step 23: The bar reads "201 selected".
- Step 24: The Activate button is dimmed (disabled) and hovering it shows "Select 200 parts or fewer."
- Step 26: The bar reads "200 selected" and the Activate button is enabled with no hover text.
- Step 27: Bulk mode ends; the 201 parts stay inactive.
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-R8a, S3-R3, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 4.9 (Branch: more than 200 ticked). Tech plan "Parts Lifecycle Update — Technical Implementation Plan" (7 Oct 2026), Phase 3 browser-walk. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S2-R8a: “One change takes at most 200 parts. With more than 200 rows ticked, the Deactivate button is disabled, and hovering it shows "Select 200 parts or fewer."”
- S3-R3: “S2-R3 to S2-R10b, S2-R14 to S2-R17 and S2-N3 apply on the Inactive tab exactly as on the Active tab, with "deactivate" read as "activate". The disabled button's hover text is "Tick the parts to activate".”
- PRD §8 User Feedback Summary (Deactivate or Activate hovered with more than 200 ticked): “"Select 200 parts or fewer."”
- PRD §8 User Feedback Summary (Deactivate or Activate hovered with more than 200 ticked): “Tooltip on the disabled button”
- PRD §8 User Feedback Summary (Bulk change, every part changed): “"{n} parts updated." ("1 part updated." for one)”
- Tech plan Phase 3 (Verification: Browser-walk): “tick past 200 by scrolling and using select-all to get the tooltip; the X leaves the mode; check dark theme.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: More than 200 ticked parts disables Deactivate and Activate
Test case: C425596, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: exactly 201 active parts at [Loc-1] whose part numbers start ZZAUTOTEST-PL-CAP- (e.g. ZZAUTOTEST-PL-CAP-001 to ZZAUTOTEST-PL-CAP-201). The count of 201 must hold; the numbers are examples.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create the 201 parts with Settings → Data Import → Inventory: download the template that page offers, fill 201 rows with part numbers ZZAUTOTEST-PL-CAP-001 to ZZAUTOTEST-PL-CAP-201, descriptions (e.g. "ZZAUTOTEST PL cap 001"), and the other required columns (category, cost, sell price, quantity 1), and import it. (Creating them one by one with New Inventory Part also works.)
- Check the setup worked: on the Active tab type ZZAUTOTEST-PL-CAP in the Search box and scroll to the bottom until no more rows load; exactly 201 rows are listed. Reload the page afterwards.



========== C425597 · section 20469 (S2 Deactivate parts)
TITLE: Search, filters, sorting and scrolling keep working in bulk mode
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], active [Part-A] ("ZZAUTOTEST PL in mode Alpha", category [Cat-1]), [Part-B] ("ZZAUTOTEST PL in mode Bravo", [Cat-2]) and [Part-C] ("ZZAUTOTEST PL in mode Charlie", [Cat-1]), part numbers starting ZZAUTOTEST-PL-INMODE- (examples).
- Data: [Loc-1] lists more than 30 active parts in all (any parts; this case changes none of them). If it lists fewer, the scrolling step is checked with the parts that are there.
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Click the ⋮ actions menu button in the toolbar.
- Click Deactivate parts.
- Type ZZAUTOTEST-PL-INMODE in the Search box.
- Open the Category filter and pick [Cat-1].
- Open the Category filter and pick All categories.
- Click the Description column header.
- Click the Description column header again.
- Clear the Search box.
- Scroll the list down to the bottom.
- Click the X at the right end of the bar.
--- EXPECTED
Expected results
- Step 4: The search works with the bar still on screen: [Part-A], [Part-B] and [Part-C] are listed, each with a checkbox.
- Step 5: The filter works: only [Part-A] and [Part-C] are listed.
- Step 6: All three are listed again.
- Steps 7 and 8: Sorting works: the rows are ordered by Description, and the second click reverses the order (Alpha, Bravo, Charlie, then Charlie, Bravo, Alpha).
- Step 10: More rows load as you scroll (the list loads 30 at a time), each with a checkbox, and the bar stays on screen.
- Step 11: Bulk mode ends; no part changed status.
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-R10, §4 Key Decisions, read 8 Oct 2026; design canvas board 4.2 (Mode on), board 4.3 (Two rows ticked). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S2-R10: “Search, the filter bar, sorting and paging keep working while the mode is on, as they do in Cycle count.”
- PRD §4 Key Decisions (Bulk status change is a mode): “Bulk status change is a mode. A row click on the Inventory list opens the part. Bulk status uses the same pattern as Cycle count: the user turns the mode on from the actions menu, checkboxes appear, search and filtering keep working, and the X on the bulk bar leaves the mode.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Search, filters, sorting and scrolling keep working in bulk mode
Test case: C425597, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], active [Part-A] ("ZZAUTOTEST PL in mode Alpha", category [Cat-1]), [Part-B] ("ZZAUTOTEST PL in mode Bravo", [Cat-2]) and [Part-C] ("ZZAUTOTEST PL in mode Charlie", [Cat-1]), part numbers starting ZZAUTOTEST-PL-INMODE- (examples).
- Data: [Loc-1] lists more than 30 active parts in all (any parts; this case changes none of them). If it lists fewer, the scrolling step is checked with the parts that are there.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- [Cat-1] and [Cat-2] = two different categories from the Category list.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL in mode Alpha" and Part Number ZZAUTOTEST-PL-INMODE-01 (examples), pick [Cat-1], type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create [Part-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL in mode Bravo" and Part Number ZZAUTOTEST-PL-INMODE-02 (examples), pick [Cat-2], type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-B] = the part number you typed.
- Create [Part-C]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL in mode Charlie" and Part Number ZZAUTOTEST-PL-INMODE-03 (examples), pick [Cat-1], type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-C] = the part number you typed.
- Check the setup worked: the Active tab searched for ZZAUTOTEST-PL-INMODE lists 3 rows.



========== C425598 · section 20469 (S2 Deactivate parts)
TITLE: Changing the search or a filter clears the ticks but sorting keeps them
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], active [Part-A] and [Part-B] in category [Cat-1] and [Part-C] in [Cat-2], part numbers ZZAUTOTEST-PL-TICKS-01 to -03 (examples).
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-TICKS in the Search box.
- Click the ⋮ actions menu button in the toolbar (to the left of New Inventory Part).
- Click Deactivate parts.
- Click the [Part-A] row.
- Click the [Part-B] row.
- Click the Description column header.
- Click the Description column header again.
- Change the Search text to ZZAUTOTEST-PL-TICKS-0 (all three parts still match).
- Click the [Part-A] row.
- Click the [Part-B] row.
- Open the Category filter and pick [Cat-1].
- Click the X at the right end of the bar.
--- EXPECTED
Expected results
- Step 6: The bar reads "2 selected".
- Steps 7 and 8: The order of the rows changes, and [Part-A] and [Part-B] stay ticked: the bar still reads "2 selected".
- Step 9: [Part-A], [Part-B] and [Part-C] are still listed, but the ticks are cleared: no row is ticked and the bar reads "0 selected".
- Step 11: The bar reads "2 selected" again.
- Step 12: Only [Part-A] and [Part-B] are listed, and the ticks are cleared: the bar reads "0 selected".
- Step 13: Bulk mode ends; no part changed status.
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-R10a, read 8 Oct 2026; design canvas board 4.3 (Two rows ticked). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S2-R10a: “Changing the search term or a filter clears the ticks, so the user only ever changes parts they can see. Sorting keeps them.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Changing the search or a filter clears the ticks but sorting keeps them
Test case: C425598, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], active [Part-A] and [Part-B] in category [Cat-1] and [Part-C] in [Cat-2], part numbers ZZAUTOTEST-PL-TICKS-01 to -03 (examples).
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- [Cat-1] and [Cat-2] = two different categories from the Category list.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL ticks A" and Part Number ZZAUTOTEST-PL-TICKS-01 (examples), pick [Cat-1], type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create [Part-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL ticks B" and Part Number ZZAUTOTEST-PL-TICKS-02 (examples), pick [Cat-1], type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-B] = the part number you typed.
- Create [Part-C]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL ticks C" and Part Number ZZAUTOTEST-PL-TICKS-03 (examples), pick [Cat-2], type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-C] = the part number you typed.
- Check the setup worked: the Active tab searched for ZZAUTOTEST-PL-TICKS lists [Part-A], [Part-B] and [Part-C] (3 rows).



========== C425599 · section 20469 (S2 Deactivate parts)
TITLE: In bulk mode the actions menu offers only Export
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 1 active part [Part-A] (e.g. ZZAUTOTEST-PL-ONLYEXP-01).
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-ONLYEXP in the Search box.
- Click the ⋮ actions menu button in the toolbar (to the left of New Inventory Part).
- Click Deactivate parts.
- Click the ⋮ actions menu button.
- Click Export.
- Click the X at the right end of the bar.
- Click the ⋮ actions menu button.
--- EXPECTED
Expected results
- Step 5: The menu holds a single entry, "Export". "Cycle count" and "Deactivate parts" are not offered.
- Step 6: A file downloads; bulk mode stays on.
- Step 8: With bulk mode ended, the menu again lists "Cycle count", "Deactivate parts" and "Export".
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-R10b, read 8 Oct 2026; design canvas board 4.8 (Branch: the menu while the mode is on). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S2-R10b: “While the mode is on, the actions menu offers only Export. Cycle count and the bulk entry come back when the mode ends.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: In bulk mode the actions menu offers only Export
Test case: C425599, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 1 active part [Part-A] (e.g. ZZAUTOTEST-PL-ONLYEXP-01).
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL only export A" and Part Number ZZAUTOTEST-PL-ONLYEXP-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Check the setup worked: the Active tab searched for [Part-A] lists 1 row.



========== C425600 · section 20469 (S2 Deactivate parts)
TITLE: Bulk mode cannot be turned on while a cycle count is running
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 1 active, tracked part [Part-A] (e.g. ZZAUTOTEST-PL-CCBLOCK-01) with quantity 5.
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-CCBLOCK in the Search box.
- Click the ⋮ actions menu button in the toolbar.
- Click Cycle count.
- Look at the toolbar for the ⋮ actions menu button.
- Click Cancel in the count toolbar.
- Click the ⋮ actions menu button.
- Click Cycle count.
- Type 5 in the Count box of [Part-A] (the same as its current quantity).
- Click Save in the count toolbar.
- Click the ⋮ actions menu button.
--- EXPECTED
Expected results
- Step 4: The count starts: the toolbar shows the count controls (the printer icon, Save, Cancel and "Count changes available") and the [Part-A] row has a Count box.
- Step 5: The ⋮ actions menu button is not shown while the count runs, so Deactivate parts cannot be reached; no checkbox column appears.
- Step 7: After the count was discarded the menu is back with "Cycle count", "Deactivate parts" and "Export".
- Step 11: After the count was saved the menu is back with "Cycle count", "Deactivate parts" and "Export"; [Part-A] still shows a total quantity of 5.
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-E4, read 8 Oct 2026; design canvas board 5.7 (Cycle count leaves it out), board 4.1 (The actions menu). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S2-E4: “Cycle count and bulk status mode cannot both be on. While Cycle count runs, the actions menu is replaced by the count controls, so the bulk status entry cannot be reached until the count is saved or discarded. While bulk status mode is on, the menu does not offer Cycle count (S2-R10b).”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Bulk mode cannot be turned on while a cycle count is running
Test case: C425600, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 1 active, tracked part [Part-A] (e.g. ZZAUTOTEST-PL-CCBLOCK-01) with quantity 5.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL count block A" and Part Number ZZAUTOTEST-PL-CCBLOCK-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Check the setup worked: the Active tab searched for [Part-A] lists 1 row with a total quantity of 5.



========== C425601 · section 20469 (S2 Deactivate parts)
TITLE: When every ticked part fails, nothing changes and the ticks stay
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 2 active parts [Part-A] and [Part-B], part numbers ZZAUTOTEST-PL-ALLFAIL-01 and -02 (examples).
--- STEPS
- In browser tab 1, click Parts in the top bar, then Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-ALLFAIL in the Search box.
- Click the ⋮ actions menu button in the toolbar.
- Click Deactivate parts.
- Click the [Part-A] row.
- Click the [Part-B] row.
- Open a second browser tab on the same ShopView address and go to Parts → Inventory (tab 2).
- In tab 2, type ZZAUTOTEST-PL-ALLFAIL in the Search box.
- In tab 2, click the ⋮ actions menu button.
- In tab 2, click Deactivate parts.
- In tab 2, click the header checkbox.
- In tab 2, click the Deactivate button.
- In tab 2, click Deactivate in the confirmation.
- Go back to tab 1 without reloading it.
- In tab 1, click the Deactivate button on the bar.
- In tab 1, click Deactivate in the "Deactivate parts?" confirmation.
- Wait 15 seconds.
- Click Close on the toast.
--- EXPECTED
Expected results
- Step 13: In tab 2 a green toast reads "2 parts updated."
- Step 16: In tab 1 a red error toast reads "No parts were changed." and lists [Part-A] and [Part-B], each with the reason "Part is already in that state."
- Step 16: The list stays on screen, bulk mode stays on, and both rows stay ticked: the bar reads "2 selected", so the change could be tried again.
- Step 17: The error toast is still on screen after 15 seconds (it stays until closed).
- Step 18: The toast closes.
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-R15, S10-N2, S10-R13a, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 4.4 (Confirm). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S2-R15: “When some parts fail, the mode stays on and the selection keeps only the parts that failed.”
- PRD §8 User Feedback Summary (Bulk change, every part failed): “"No parts were changed."”
- PRD §8 User Feedback Summary (Bulk change, every part failed): “Error toast, stays until closed, lists each failed part and its reason”
- S10-N2: “If every part in a bulk change fails, the list stays on screen and the selection is kept, so the user can retry.”
- S10-R13a: “The reasons are "A core follows its part. Activate or deactivate the part instead.", "Part not found." and "Part is already in that state."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: When every ticked part fails, nothing changes and the ticks stay
Test case: C425601, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 2 active parts [Part-A] and [Part-B], part numbers ZZAUTOTEST-PL-ALLFAIL-01 and -02 (examples).
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL all fail A" and Part Number ZZAUTOTEST-PL-ALLFAIL-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create [Part-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL all fail B" and Part Number ZZAUTOTEST-PL-ALLFAIL-02 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-B] = the part number you typed.
- Check the setup worked: the Active tab searched for ZZAUTOTEST-PL-ALLFAIL lists [Part-A] and [Part-B].



========== C425603 · section 20469 (S2 Deactivate parts)
TITLE: Deactivating a part with a core charge also deactivates its core
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 1 active part [Part-A] (e.g. ZZAUTOTEST-PL-CORE-01) with a Core Charge above 0 (e.g. 25.00), so it has a core.
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-CORE in the Search box.
- Click the ⋮ actions menu button in the toolbar (to the left of New Inventory Part).
- Click Deactivate parts.
- Look at the rows the search lists.
- Click the [Part-A] row.
- Click the Deactivate button on the bar.
- Click Deactivate in the "Deactivate parts?" confirmation.
- Click the Inactive tab.
- If the Search box is empty, type ZZAUTOTEST-PL-CORE in it.
- Click the ⋮ actions menu button.
- Click Activate parts.
- Click the [Part-A] row.
- Click the Activate button on the bar.
- Click Activate in the "Activate parts?" confirmation.
--- EXPECTED
Expected results
- Step 5: Only [Part-A] is listed; its core is not a row of its own, so the core cannot be ticked or changed on its own.
- Step 8: A green toast reports the change and no failure is listed for the core; [Part-A] leaves the Active tab.
- Step 8: The core becomes inactive together with [Part-A]. The core is not shown on the Inventory list, so its status cannot be seen on screen: write "core status not checked by hand" in the result comment.
- Step 10: [Part-A] is on the Inactive tab.
- Step 15: [Part-A] leaves the Inactive tab; its core becomes active with it (core status not checked by hand).
- Steps 5 to 15: A request to change the core on its own, which the system refuses with "A core follows its part. Activate or deactivate the part instead.", cannot be made from the screen: write "core refusal not checked by hand" in the result comment.
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-R17, S2-N3, S3-R3, §8 User Feedback Summary, §4 Key Decisions, read 8 Oct 2026; design canvas board 4.3 (Two rows ticked), board 4.6 (Inactive tab, Activate parts). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S2-R17: “A part's core becomes inactive together with the part, in the same change.”
- S2-N3: “A core cannot be set active or inactive on its own. Asked to, the system refuses it with "A core follows its part. Activate or deactivate the part instead."”
- PRD §8 User Feedback Summary (A core asked to change status on its own): “"A core follows its part. Activate or deactivate the part instead."”
- PRD §8 User Feedback Summary (A core asked to change status on its own): “Listed as the failure reason”
- PRD §4 Key Decisions (A core follows its part): “A core follows its part. A core is never activated, deactivated, tracked or untracked on its own.”
- S3-R3: “S2-R3 to S2-R10b, S2-R14 to S2-R17 and S2-N3 apply on the Inactive tab exactly as on the Active tab, with "deactivate" read as "activate". The disabled button's hover text is "Tick the parts to activate".”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Deactivating a part with a core charge also deactivates its core
Test case: C425603, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 1 active part [Part-A] (e.g. ZZAUTOTEST-PL-CORE-01) with a Core Charge above 0 (e.g. 25.00), so it has a core.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL core A" and Part Number ZZAUTOTEST-PL-CORE-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, type a Core Charge (e.g. 25.00), and click Save. [Part-A] = the part number you typed.
- Check the setup worked: open [Part-A] from the Active tab; Core Charge shows the amount you typed. Click Cancel.



========== C425604 · section 20469 (S2 Deactivate parts)
TITLE: The work order lines bulk bar works as before and its X shows Clear selection
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Theme: Light at the start (avatar at the top right → Light).
- Data: an open work order [WO-1] for a ZZAUTOTEST customer with 2 lines, [Line-1] and [Line-2] (e.g. titles "ZZAUTOTEST PL bulkbar line 1" and "... line 2").
--- STEPS
- In the top bar click Work Orders.
- Open [WO-1] on its Lines tab.
- Click the checkbox of [Line-1].
- Click the checkbox of [Line-2].
- Look at the bar that appears and read its count, its buttons and its X.
- Hover over the X at the right end of the bar.
- Click the avatar at the top right and pick Dark.
- Look at the bar.
- Click the avatar at the top right and pick Light.
- Click the X.
- Click the checkbox of [Line-1].
- Click one of the bar's action buttons and complete it as you would on the previous build.
- If the bar or a toast offers Undo, click it.
--- EXPECTED
Expected results
- Step 4: The bulk bar appears with a round count badge "2" and the word "selected", its action buttons, and an X at the right end, the same as on the previous build.
- Step 6: Hovering the X shows "Clear selection" (this hover text is new on this build).
- Step 8: In the dark theme the bar looks as it did on the previous build in the dark theme.
- Step 10: The bar disappears and both lines are unticked.
- Step 12: The button does to the ticked line exactly what it did on the previous build.
- Step 13: Undo, where offered, works as it did on the previous build. Any difference from the previous build other than the new "Clear selection" hover text fails the case: describe it in the result comment.
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S2-R9, §5 Terminology, read 8 Oct 2026; design canvas board 4.2 (Mode on). Tech plan "Parts Lifecycle Update — Technical Implementation Plan" (7 Oct 2026), Phase 1 verification (browser-walk); story SV-11038 (Verify Phase 1) checklist. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- PRD §5 Terminology (Bulk bar): “Bulk bar → The dark bar across the Inventory list, under the Active and Inactive tabs, while bulk status mode is on. It is the same bar work order lines show for ticked lines.”
- S2-R9: “An X button sits at the right end of the bar. Hovering it shows "Clear selection", which is also its screen reader label.”
- Tech plan Phase 1 (Verification: Browser-walk): “a work order with ticked lines, light and dark theme. The bulk bar must look and behave exactly as before, except that hovering the X now shows "Clear selection".”
- SV-11038 verification checklist (Verify Phase 1): “Work order lines bulk mode still works exactly as before on the extracted bulk bar shell; its X now shows a "Clear selection" tooltip (S2-R9)”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The work order lines bulk bar works as before and its X shows Clear selection
Test case: C425604, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Theme: Light at the start (avatar at the top right → Light).
- Data: an open work order [WO-1] for a ZZAUTOTEST customer with 2 lines, [Line-1] and [Line-2] (e.g. titles "ZZAUTOTEST PL bulkbar line 1" and "... line 2").
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create an open work order: in the top bar click Work Orders, click New, and in the New Work Order dialog use the Add button beside Customer to create a customer (e.g. "ZZAUTOTEST PL bulkbar customer") and the Add button beside Asset to create an asset for it (e.g. unit "ZZAUTOTEST PL bulkbar-UNIT"); click Save, and click Create if a confirmation appears. [WO-1] = the work order number shown.
- On [WO-1] click New Line, type a Title (e.g. "ZZAUTOTEST PL bulkbar line"), and click Save & Close.
- On [WO-1] click New Line again, type a Title (e.g. "ZZAUTOTEST PL bulkbar line 2") and click Save & Close. [Line-1] and [Line-2] = the two lines.
- Check the setup worked: [WO-1]'s Lines tab lists [Line-1] and [Line-2], each with a checkbox at the left.



========== C154764 · section 20470 (S3 Activate parts)
TITLE: Activate parts on the Inactive tab opens the same bulk mode with Activate
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], inactive [Part-A] and [Part-B] and active [Part-C], part numbers ZZAUTOTEST-PL-BULKON-01 to -03 (examples).
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu.
- Click the Inactive tab.
- Type ZZAUTOTEST-PL-BULKON in the Search box.
- Click the ⋮ actions menu button in the toolbar (to the left of New Inventory Part).
- Click Activate parts.
- Click the [Part-A] row.
- Click the X at the right end of the bar.
- Click the Active tab.
- If the Search box is empty, type ZZAUTOTEST-PL-BULKON in it.
- Click the ⋮ actions menu button.
- Click Deactivate parts.
- Click the [Part-C] row.
- Look at the colour of the Deactivate button.
- Click the X at the right end of the bar.
--- EXPECTED
Expected results
- Step 4: The menu lists "Cycle count", "Activate parts" and "Export".
- Step 5: The same bulk mode as on the Active tab turns on: a checkbox column appears at the left of the table and the same dark bar appears under the tabs, reading "0 selected", with a blue button "Activate" and an X at the right end.
- Step 6: The bar reads "1 selected" and the Activate button is enabled (bright blue).
- Step 7: Bulk mode ends; [Part-A] is still inactive.
- Step 13: The Deactivate button on the Active tab is the same blue as the Activate button on the Inactive tab.
- Step 14: Bulk mode ends; nothing changed status.
Source — where this behaviour comes from
Epic SV-10647; story SV-10816 (Story 3, Activate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S3-R1, S3-R2, read 8 Oct 2026; design canvas board 4.6 (Inactive tab, Activate parts), board 4.3 (Two rows ticked). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S3-R1: “Reactivation uses the same mode as Story 2. On the Inactive tab the actions menu entry reads "Activate parts", and turning it on shows the same checkbox column and the same bulk bar.”
- S3-R2: “The bulk bar button reads "Activate", in the same blue as "Deactivate".”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Activate parts on the Inactive tab opens the same bulk mode with Activate
Test case: C154764, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], inactive [Part-A] and [Part-B] and active [Part-C], part numbers ZZAUTOTEST-PL-BULKON-01 to -03 (examples).
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL bulk on A" and Part Number ZZAUTOTEST-PL-BULKON-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create [Part-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL bulk on B" and Part Number ZZAUTOTEST-PL-BULKON-02 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-B] = the part number you typed.
- Create [Part-C]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL bulk on C" and Part Number ZZAUTOTEST-PL-BULKON-03 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-C] = the part number you typed.
- Make [Part-A] inactive: on the Active tab type [Part-A] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Make [Part-B] inactive: on the Active tab type [Part-B] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Check the setup worked: searched for ZZAUTOTEST-PL-BULKON, the Inactive tab lists [Part-A] and [Part-B] and the Active tab lists [Part-C].



========== C154765 · section 20470 (S3 Activate parts)
TITLE: Confirming Activate moves the ticked parts back to the Active tab
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 3 inactive parts [Part-A], [Part-B] and [Part-C], part numbers ZZAUTOTEST-PL-REACT-01 to -03 (examples).
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu.
- Click the Inactive tab.
- Type ZZAUTOTEST-PL-REACT in the Search box.
- Click the ⋮ actions menu button in the toolbar (to the left of New Inventory Part).
- Click Activate parts.
- Click the [Part-A] row.
- Click the [Part-B] row.
- Click the Activate button on the bar.
- Click Activate in the "Activate parts?" confirmation.
- Click the Active tab.
- If the Search box is empty, type ZZAUTOTEST-PL-REACT in it.
--- EXPECTED
Expected results
- Step 8: The "Activate parts?" confirmation opens, reads "2 parts selected.", and its confirm button is a blue "Activate".
- Step 9: A green toast reads "2 parts updated." [Part-A] and [Part-B] leave the Inactive list at once, without a page reload; [Part-C] is still listed. Bulk mode ends and nothing is ticked.
- Step 11: The Active tab lists [Part-A] and [Part-B] (and not [Part-C]).
Source — where this behaviour comes from
Epic SV-10647; story SV-10816 (Story 3, Activate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S3-R4, S3-R5, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 4.6 (Inactive tab, Activate parts), board 4.7 (Confirm the reactivation). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S3-R4: “When the user confirms (Story 10), every ticked part becomes active and leaves the Inactive tab without a page reload.”
- S3-R5: “The reactivated parts appear on the Active tab.”
- PRD §8 User Feedback Summary (Bulk change, every part changed): “"{n} parts updated." ("1 part updated." for one)”
- PRD §8 User Feedback Summary (Bulk change, every part changed): “Success toast, fades on its own”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Confirming Activate moves the ticked parts back to the Active tab
Test case: C154765, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 3 inactive parts [Part-A], [Part-B] and [Part-C], part numbers ZZAUTOTEST-PL-REACT-01 to -03 (examples).
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL react A" and Part Number ZZAUTOTEST-PL-REACT-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create [Part-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL react B" and Part Number ZZAUTOTEST-PL-REACT-02 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-B] = the part number you typed.
- Create [Part-C]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL react C" and Part Number ZZAUTOTEST-PL-REACT-03 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-C] = the part number you typed.
- Make [Part-A] inactive: on the Active tab type [Part-A] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Make [Part-B] inactive: on the Active tab type [Part-B] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Make [Part-C] inactive: on the Active tab type [Part-C] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Check the setup worked: the Inactive tab searched for ZZAUTOTEST-PL-REACT lists [Part-A], [Part-B] and [Part-C].



========== C425605 · section 20470 (S3 Activate parts)
TITLE: With nothing ticked Activate is disabled and its hover text says why
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 1 inactive part [Part-A] (e.g. ZZAUTOTEST-PL-ACTNONE-01).
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu.
- Click the Inactive tab.
- Type ZZAUTOTEST-PL-ACTNONE in the Search box.
- Click the ⋮ actions menu button in the toolbar (to the left of New Inventory Part).
- Click Activate parts.
- Hover over the Activate button on the bar.
- Click the Activate button.
- Click the [Part-A] row.
- Hover over the Activate button.
- Click the X at the right end of the bar.
--- EXPECTED
Expected results
- Step 6: The Activate button is visible but dimmed (disabled), and hovering it shows "Tick the parts to activate".
- Step 7: Nothing opens: no "Activate parts?" confirmation appears.
- Step 9: With 1 row ticked the button is bright blue (enabled) and the hover text does not appear.
- Step 10: Bulk mode ends; [Part-A] is still inactive.
Source — where this behaviour comes from
Epic SV-10647; story SV-10816 (Story 3, Activate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S3-N1, S3-R3, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 4.6 (Inactive tab, Activate parts). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S3-N1: “With nothing ticked, the Activate button is visible but disabled.”
- S3-R3: “S2-R3 to S2-R10b, S2-R14 to S2-R17 and S2-N3 apply on the Inactive tab exactly as on the Active tab, with "deactivate" read as "activate". The disabled button's hover text is "Tick the parts to activate".”
- PRD §8 User Feedback Summary (Activate hovered with nothing ticked): “"Tick the parts to activate"”
- PRD §8 User Feedback Summary (Activate hovered with nothing ticked): “Tooltip on the disabled button”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: With nothing ticked Activate is disabled and its hover text says why
Test case: C425605, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 1 inactive part [Part-A] (e.g. ZZAUTOTEST-PL-ACTNONE-01).
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL activate none A" and Part Number ZZAUTOTEST-PL-ACTNONE-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Make [Part-A] inactive: on the Active tab type [Part-A] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Check the setup worked: the Inactive tab searched for [Part-A] lists 1 row.



========== C425606 · section 20470 (S3 Activate parts)
TITLE: Bulk mode on the Inactive tab behaves exactly as on the Active tab
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 3 inactive parts: [Part-A] ("ZZAUTOTEST PL mirror Alpha", category [Cat-1]), [Part-B] ("ZZAUTOTEST PL mirror Bravo", [Cat-1]) and [Part-C] ("ZZAUTOTEST PL mirror Charlie", [Cat-2]); part numbers ZZAUTOTEST-PL-MIRROR-01 to -03 (examples).
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu.
- Click the Inactive tab.
- Type ZZAUTOTEST-PL-MIRROR in the Search box.
- Click the [Part-A] row.
- Click Cancel.
- Click the ⋮ actions menu button in the toolbar.
- Click Activate parts.
- Click the [Part-A] row.
- Click the [Part-A] row again.
- Click the checkbox in the header row.
- Click the checkbox in the header row again.
- Click the [Part-A] row.
- Click the [Part-B] row.
- Click the Description column header.
- Change the Search text to ZZAUTOTEST-PL-MIRROR-0 (all three parts still match).
- Click the [Part-A] row.
- Open the Category filter and pick [Cat-1].
- Open the Category filter and pick All categories.
- Click the ⋮ actions menu button.
- Press Escape to close the menu.
- Hover over the X at the right end of the bar.
- Click the X.
- Click the ⋮ actions menu button.
- Click Activate parts.
- Click the [Part-A] row.
- Click the [Part-B] row.
- Open a second browser tab on the same ShopView address and go to Parts → Inventory (tab 2).
- In tab 2, click the Inactive tab.
- In tab 2, type [Part-B] in the Search box.
- In tab 2, click the [Part-B] row.
- In tab 2, pick Part Status → Active.
- In tab 2, click Save.
- In tab 2, click Activate in the "Activate part?" confirmation.
- Go back to tab 1 without reloading it.
- In tab 1, click the Activate button on the bar.
- In tab 1, click Activate in the "Activate parts?" confirmation.
- Click Close on the toast.
--- EXPECTED
Expected results
- Step 4: With bulk mode off, the row click opens Edit Inventory Part for [Part-A]; there is no checkbox column.
- Step 7: The checkbox column and the dark bar appear, reading "0 selected", with a blue "Activate" button.
- Step 8: The [Part-A] row is ticked ("1 selected") and no dialog opens.
- Step 9: The [Part-A] row is unticked ("0 selected").
- Step 10: All 3 loaded rows are ticked ("3 selected").
- Step 11: All ticks are cleared ("0 selected").
- Step 13: The bar reads "2 selected".
- Step 14: The rows are re-ordered by Description and [Part-A] and [Part-B] stay ticked ("2 selected").
- Step 15: The ticks are cleared ("0 selected") although all three parts are still listed.
- Step 17: The ticks are cleared ("0 selected") and only [Part-A] and [Part-B] are listed.
- Step 19: The menu offers only "Export".
- Step 21: Hovering the X shows "Clear selection".
- Step 22: Bulk mode ends; the checkbox column and the bar disappear.
- Step 23: The menu lists "Cycle count", "Activate parts" and "Export" again.
- Step 36: A red error toast reads "1 part updated, 1 could not be changed." and lists [Part-B] with the reason "Part is already in that state." Bulk mode stays on and only [Part-B] stays ticked ("1 selected"); [Part-A] leaves the Inactive list.
- Step 37: The toast stays on screen until you close it, then closes.
Source — where this behaviour comes from
Epic SV-10647; story SV-10816 (Story 3, Activate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S3-R3, S2-R5, S2-R10a, S2-R10b, S2-R9, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 4.6 (Inactive tab, Activate parts), board 4.8 (Branch: the menu while the mode is on). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S3-R3: “S2-R3 to S2-R10b, S2-R14 to S2-R17 and S2-N3 apply on the Inactive tab exactly as on the Active tab, with "deactivate" read as "activate". The disabled button's hover text is "Tick the parts to activate".”
- PRD §8 User Feedback Summary (Bulk change, some parts failed): “"{n} parts updated, {m} could not be changed." ("1 part updated, {m} could not be changed." for one)”
- PRD §8 User Feedback Summary (Bulk change, some parts failed): “Error toast, stays until closed, lists each failed part and its reason”
- S2-R5: “While the mode is on, a click anywhere on a row ticks or unticks that row instead of opening the part.”
- S2-R10a: “Changing the search term or a filter clears the ticks, so the user only ever changes parts they can see. Sorting keeps them.”
- S2-R10b: “While the mode is on, the actions menu offers only Export. Cycle count and the bulk entry come back when the mode ends.”
- S2-R9: “An X button sits at the right end of the bar. Hovering it shows "Clear selection", which is also its screen reader label.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Bulk mode on the Inactive tab behaves exactly as on the Active tab
Test case: C425606, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 3 inactive parts: [Part-A] ("ZZAUTOTEST PL mirror Alpha", category [Cat-1]), [Part-B] ("ZZAUTOTEST PL mirror Bravo", [Cat-1]) and [Part-C] ("ZZAUTOTEST PL mirror Charlie", [Cat-2]); part numbers ZZAUTOTEST-PL-MIRROR-01 to -03 (examples).
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- [Cat-1] and [Cat-2] = two different categories from the Category list.
- Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL mirror Alpha" and Part Number ZZAUTOTEST-PL-MIRROR-01 (examples), pick [Cat-1], type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
- Create [Part-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL mirror Bravo" and Part Number ZZAUTOTEST-PL-MIRROR-02 (examples), pick [Cat-1], type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-B] = the part number you typed.
- Create [Part-C]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL mirror Charlie" and Part Number ZZAUTOTEST-PL-MIRROR-03 (examples), pick [Cat-2], type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-C] = the part number you typed.
- Make [Part-A] inactive: on the Active tab type [Part-A] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Make [Part-B] inactive: on the Active tab type [Part-B] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Make [Part-C] inactive: on the Active tab type [Part-C] in the Search box, click its row, pick Part Status → Inactive in Edit Inventory Part, click Save, then click Deactivate in the "Deactivate part?" confirmation (leave Note (Optional) empty).
- Check the setup worked: the Inactive tab searched for ZZAUTOTEST-PL-MIRROR lists 3 rows.



========== C154828 · section 20478 (S11 Part Library browse & edit only)
TITLE: The Part Library page has no button that creates an entry
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role (holds the 'Part Library & Inventory' permissions, including Create & Edit).
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: 1 Part Library entry of this case, [PN-A] (e.g. ZZAUTOTEST-PL-NOCREATE-01), made by creating an inventory part with that number.
--- STEPS
- In the top bar click Parts, then click Part Library in the left menu.
- Look at the page title row, the toolbar and the area above the table.
- Type [PN-A] in the Search box.
- Click the checkbox of the [PN-A] row.
- Click the ⋮ icon at the left end of the table's header row.
- Press Escape to close the menu.
- Click the [PN-A] row (not its checkbox).
- Click the edit icon beside the entry's name in the Part details panel.
- Click Cancel.
--- EXPECTED
Expected results
- Step 2: The toolbar holds Search, "Manufacturer: All manufacturers" and "Category: All categories". There is no button or link that creates an entry: no "New Catalog Part", no "New Library Part", no "New", "Add" or "+" control.
- Step 5: The header menu offers actions for the ticked rows (such as Set category) and nothing that creates a new entry.
- Step 7: The row opens that entry's detail page, not a dialog for creating an entry.
- Step 8: The dialog that opens edits the existing entry (its fields hold [PN-A]); no dialog for creating a new entry can be reached anywhere on the page.
Source — where this behaviour comes from
Epic SV-10647; story SV-10824 (Story 11, The Part Library Is Browse and Edit Only); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S11-R1, S11-R2, §4 Key Decisions, read 8 Oct 2026; design canvas board 7.1 (Part Library), board 7.0 (Before: the Catalog page today), board 7.2 (An entry opens its detail page). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S11-R1: “The Part Library page has no control that creates a Part Library entry.”
- S11-R2: “No dialog for creating a Part Library entry can be reached from the Part Library page.”
- PRD §4 Key Decisions (The Part Library has no standalone create): “The Part Library has no standalone create. Every Part Library entry is created from a part number in use.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The Part Library page has no button that creates an entry
Test case: C154828, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role (holds the 'Part Library & Inventory' permissions, including Create & Edit).
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: 1 Part Library entry of this case, [PN-A] (e.g. ZZAUTOTEST-PL-NOCREATE-01), made by creating an inventory part with that number.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [PN-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL no create" and Part Number ZZAUTOTEST-PL-NOCREATE-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-A] = the part number you typed.
- Check the setup worked: Parts → Part Library, Search [PN-A] lists 1 entry.



========== C154829 · section 20478 (S11 Part Library browse & edit only)
TITLE: Clicking a Part Library row opens the entry's detail page
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role (holds 'Part Library & Inventory' View, Create & Edit and Delete).
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: 1 Part Library entry [PN-A] (e.g. ZZAUTOTEST-PL-DETAIL-01, description "ZZAUTOTEST PL detail") stocked at [Loc-1] only.
--- STEPS
- In the top bar click Parts, then click Part Library in the left menu.
- Type [PN-A] in the Search box.
- Click the [PN-A] row.
- Read the Part details panel and the Parts table.
- Click the edit icon beside the entry's name in the Part details panel.
- Replace the Description with "ZZAUTOTEST PL detail edited".
- Click Save.
- Click the edit icon again.
- Look for the Delete control (do not click it).
- Click Cancel.
--- EXPECTED
Expected results
- Step 3: The entry's detail page opens.
- Step 4: The Part details panel shows the entry's name, "Part number" [PN-A], Category, Manufacturer, Measurement and "Total parts" 1; the Parts table lists one Workplace row for [Loc-1].
- Step 7: The change is saved: the detail page shows "ZZAUTOTEST PL detail edited".
- Step 9: The entry can also be deleted from here: a Delete control is offered.
Source — where this behaviour comes from
Epic SV-10647; story SV-10824 (Story 11, The Part Library Is Browse and Edit Only); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S11-R3, read 8 Oct 2026; design canvas board 7.2 (An entry opens its detail page). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S11-R3: “Clicking a row opens that entry's detail page, where it can be edited and deleted.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Clicking a Part Library row opens the entry's detail page
Test case: C154829, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role (holds 'Part Library & Inventory' View, Create & Edit and Delete).
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: 1 Part Library entry [PN-A] (e.g. ZZAUTOTEST-PL-DETAIL-01, description "ZZAUTOTEST PL detail") stocked at [Loc-1] only.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [PN-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL detail" and Part Number ZZAUTOTEST-PL-DETAIL-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-A] = the part number you typed.
- Check the setup worked: Parts → Part Library, Search [PN-A] lists 1 entry with the description "ZZAUTOTEST PL detail".



========== C154830 · section 20478 (S11 Part Library browse & edit only)
TITLE: A new Part Library entry appears only when a new part number is used
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role (Admin also opens Settings → Data Import).
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: two part numbers that no Part Library entry has yet: [PN-NEW] (e.g. ZZAUTOTEST-PL-NEWENTRY-01) and [PN-IMP] (e.g. ZZAUTOTEST-PL-NEWENTRY-02).
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu.
- Click New Inventory Part.
- Type "ZZAUTOTEST PL new entry" in Description.
- Type [PN-NEW] in Part Number.
- Pick any Category.
- Type 10.00 in Cost.
- Type 20.00 in Sell Price.
- Click Save.
- Click Part Library in the left menu.
- Type [PN-NEW] in the Search box.
- Click the [PN-NEW] row.
- Open Settings → Data Import → Inventory and import [File-1].
- Open Parts → Part Library.
- Type [PN-IMP] in the Search box.
- Look through the Part Library page and its menus for any way to create an entry without a part.
--- EXPECTED
Expected results
- Step 8: The part is saved, with no message about the Part Library (a new entry was created, not linked).
- Step 10: One entry [PN-NEW] is listed, with the description "ZZAUTOTEST PL new entry".
- Step 11: Its detail page shows "Total parts" 1: the new inventory part is behind it.
- Step 14: One entry [PN-IMP] is listed: the parts CSV import created it from the imported row.
- Step 15: There is no way on screen to create an entry with no part, part request, delivery receipt, core charge, return or import row behind it.
- Step 15: Routes behind the screen, including the separate integration create (which is not changed by this release), cannot be checked by hand: write "routes behind the screen not checked by hand" in the result comment.
Source — where this behaviour comes from
Epic SV-10647; story SV-10824 (Story 11, The Part Library Is Browse and Edit Only); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S11-R6, S11-N1, S11-E3, §4 Key Decisions, read 8 Oct 2026; design canvas board 1.3 (Number and description typed), board 7.1 (Part Library). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S11-R6: “A new Part Library entry is created only from a part number in use: creating an inventory part (S7-R7 and S7-R8), a part request when the requested part is received, a delivery receipt, a core charge, returning a special-order part to inventory, returning a core to inventory, the parts CSV import, and the public API.”
- S11-N1: “No route, on screen or behind it, produces a Part Library entry with no inventory part, part request, delivery receipt, core charge, return or import row behind it. The one exception is the public API (S11-E3).”
- S11-E3: “The public API create is a separate integration and is not changed by S11-R1.”
- PRD §4 Key Decisions (The Part Library has no standalone create): “The Part Library has no standalone create. Every Part Library entry is created from a part number in use.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A new Part Library entry appears only when a new part number is used
Test case: C154830, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role (Admin also opens Settings → Data Import).
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: two part numbers that no Part Library entry has yet: [PN-NEW] (e.g. ZZAUTOTEST-PL-NEWENTRY-01) and [PN-IMP] (e.g. ZZAUTOTEST-PL-NEWENTRY-02).
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Parts → Part Library: search [PN-NEW] and [PN-IMP]; both must find nothing (if one exists, choose another suffix).
- Settings → Data Import → Inventory: download the template the page offers and fill one row: part number [PN-IMP], description "ZZAUTOTEST PL imported entry", a category, cost (e.g. 10.00), sell price (e.g. 20.00), quantity (e.g. 2). Save the file as [File-1].
- Check the setup worked: [File-1] holds exactly one row with [PN-IMP], and the Part Library has no entry for [PN-NEW] or [PN-IMP].



========== C154831 · section 20478 (S11 Part Library browse & edit only)
TITLE: Part Library entries from before the release stay listed
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [Old-E], a Part Library entry that existed before the deployment with nothing behind it ("Total parts" 0), and [Old-F], an entry that existed before with a part behind it. This case only reads them.
--- STEPS
- Sign in on the Part Lifecycle build as [User-A].
- Pick [Loc-1] in the location selector in the top bar.
- In the top bar click Parts, then click Part Library in the left menu.
- Type [Old-E] in the Search box.
- Click the [Old-E] row.
- Click Part Library in the left menu.
- Type [Old-F] in the Search box.
--- EXPECTED
Expected results
- Step 4: [Old-E] is still listed although nothing uses it.
- Step 5: Its detail page opens and shows "Total parts" 0: it was neither deleted nor hidden by the release.
- Step 7: [Old-F] is still listed.
Source — where this behaviour comes from
Epic SV-10647; story SV-10824 (Story 11, The Part Library Is Browse and Edit Only); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S11-E1, read 8 Oct 2026; design canvas board 7.1 (Part Library), board 7.2 (An entry opens its detail page). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S11-E1: “Part Library entries that exist on the day of release stay in the list, including the ones nothing references. This spec does not delete or hide them.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Part Library entries from before the release stay listed
Test case: C154831, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [Old-E], a Part Library entry that existed before the deployment with nothing behind it ("Total parts" 0), and [Old-F], an entry that existed before with a part behind it. This case only reads them.
# Part 1. Setup for manual QA tester
- Before the Part Lifecycle build is deployed, sign in on the earlier build as [User-A], pick [Loc-1], and create with Parts → Catalog → New Catalog Part an entry such as ZZAUTOTEST-PL-OLDENTRY-01 (never stock it), and a second, ZZAUTOTEST-PL-OLDENTRY-02, which you then stock with Parts → Inventory → New Inventory Part.
- If the build was deployed before step 1 could be done, pick instead, on the Part Lifecycle build, one existing entry whose detail page shows "Total parts" 0 and one whose detail page shows "Total parts" 1 or more, both created before the deployment (this case does not change them).
- [Old-E] = the entry with nothing behind it; [Old-F] = the entry with a part behind it.
- Check the setup worked: you have both part numbers written down.



========== C425607 · section 20478 (S11 Part Library browse & edit only)
TITLE: Users with and without Create & Edit see the same Part Library toolbar
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role (has 'Part Library & Inventory' Create & Edit).
- User: [User-B], a second staff login you hold, given the custom role [Role-V] (e.g. ZZAUTOTEST-PL-LIBVIEW) that has the Parts Department and only 'Part Library & Inventory' View (no Create & Edit, no Delete).
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: no data of its own is needed; the page is read only.
--- STEPS
- In browser 1, signed in as [User-A], click Parts in the top bar, then Part Library in the left menu.
- Read every control in the title row and toolbar, from left to right.
- In browser 2, signed in as [User-B], click Parts in the top bar, then Part Library in the left menu.
- Read every control in the title row and toolbar, from left to right.
--- EXPECTED
Expected results
- Step 2: [User-A] sees the title "Part Library", Search, "Manufacturer: All manufacturers" and "Category: All categories", and no control that creates an entry.
- Step 4: [User-B] sees exactly the same title and toolbar controls as [User-A]: Search, "Manufacturer: All manufacturers" and "Category: All categories", and no create control. Nothing is added or missing for either user.
Source — where this behaviour comes from
Epic SV-10647; story SV-10824 (Story 11, The Part Library Is Browse and Edit Only); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S11-R7, read 8 Oct 2026; design canvas board 7.1 (Part Library). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S11-R7: “A user with the 'Part Library & Inventory → Create & Edit' permission and a user without it see the same Part Library toolbar.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Users with and without Create & Edit see the same Part Library toolbar
Test case: C425607, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role (has 'Part Library & Inventory' Create & Edit).
- User: [User-B], a second staff login you hold, given the custom role [Role-V] (e.g. ZZAUTOTEST-PL-LIBVIEW) that has the Parts Department and only 'Part Library & Inventory' View (no Create & Edit, no Delete).
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: no data of its own is needed; the page is read only.
# Part 1. Setup for manual QA tester
- Sign in as [User-A]. Settings → Roles & Permissions → Create custom role → Skip (blank role) → Role name (e.g. ZZAUTOTEST-PL-LIBVIEW) → switch on the Parts Department and tick only 'Part Library & Inventory' View (leave Create & Edit and Delete unticked) → Create. [Role-V] = this role.
- Settings → Staff → open a staff member whose login you hold (not [User-A]) → Edit Staff Member → write down their current role ([Old-Role], to put back after the test) → Role = [Role-V] → save. [User-B] = this staff member.
- Check the setup worked: in a second browser (or a private window) sign in as [User-B]; Parts → Part Library opens. If it does not, check [Role-V] has the Parts Department and View ticked.



========== C425608 · section 20478 (S11 Part Library browse & edit only)
TITLE: Part Library rows can still be ticked and changed with Set category
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: 2 Part Library entries [PN-A] and [PN-B] (e.g. ZZAUTOTEST-PL-SETCAT-01 and -02) in category [Cat-1]; [Cat-2] is another category.
--- STEPS
- In the top bar click Parts, then click Part Library in the left menu.
- Type ZZAUTOTEST-PL-SETCAT in the Search box.
- Click the checkbox of the [PN-A] row.
- Click the checkbox of the [PN-B] row.
- Click the ⋮ icon at the left end of the table's header row.
- Click Set category.
- Pick [Cat-2].
- Click the button that applies it (e.g. Save).
--- EXPECTED
Expected results
- Steps 3 and 4: Both rows can be ticked.
- Step 5: The menu offers "Set category".
- Step 8: Both [PN-A] and [PN-B] now show [Cat-2] in the Category column.
Source — where this behaviour comes from
Epic SV-10647; story SV-10824 (Story 11, The Part Library Is Browse and Edit Only); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S11-R4, read 8 Oct 2026; design canvas board 7.1 (Part Library). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S11-R4: “Row selection on the Part Library list and its bulk "Set category" action stay available.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Part Library rows can still be ticked and changed with Set category
Test case: C425608, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: 2 Part Library entries [PN-A] and [PN-B] (e.g. ZZAUTOTEST-PL-SETCAT-01 and -02) in category [Cat-1]; [Cat-2] is another category.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- [Cat-1] and [Cat-2] = two different categories from the Category list.
- Create [PN-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL set category A" and Part Number ZZAUTOTEST-PL-SETCAT-01 (examples), pick [Cat-1], type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-A] = the part number you typed.
- Create [PN-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL set category B" and Part Number ZZAUTOTEST-PL-SETCAT-02 (examples), pick [Cat-1], type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-B] = the part number you typed.
- Check the setup worked: Parts → Part Library searched for ZZAUTOTEST-PL-SETCAT lists [PN-A] and [PN-B], both in [Cat-1].



========== C425609 · section 20478 (S11 Part Library browse & edit only)
TITLE: Part Library search, filters, sorting and columns still work
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: 2 Part Library entries with no manufacturer: [PN-A] ("ZZAUTOTEST PL lib list Alpha", [Cat-1]) and [PN-B] ("ZZAUTOTEST PL lib list Bravo", [Cat-2]); part numbers ZZAUTOTEST-PL-LIBLIST-01 and -02 (examples).
--- STEPS
- In the top bar click Parts, then click Part Library in the left menu.
- Read the column headers.
- Type ZZAUTOTEST-PL-LIBLIST in the Search box.
- Open the Category filter and pick [Cat-1].
- Open the Category filter and pick All categories.
- Open the Manufacturer filter and pick any manufacturer.
- Open the Manufacturer filter and pick All manufacturers.
- Click the Description column header.
- Click the Description column header again.
--- EXPECTED
Expected results
- Step 2: The columns are Description, Part Number, Tags, Category, Manufacturer, Measurement and Size, as on the earlier build.
- Step 3: Search works: [PN-A] and [PN-B] are listed (2 rows).
- Step 4: The Category filter works: only [PN-A] is listed.
- Step 5: Both are listed again.
- Step 6: The Manufacturer filter works: neither entry is listed, because neither has a manufacturer.
- Step 7: Both are listed again.
- Steps 8 and 9: Sorting works: the entries are ordered by Description, and the second click reverses the order.
Source — where this behaviour comes from
Epic SV-10647; story SV-10824 (Story 11, The Part Library Is Browse and Edit Only); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S11-R5, read 8 Oct 2026; design canvas board 7.1 (Part Library), board 7.0 (Before: the Catalog page today). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S11-R5: “Search, filtering, sorting and the column set on the Part Library list stay available.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Part Library search, filters, sorting and columns still work
Test case: C425609, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: 2 Part Library entries with no manufacturer: [PN-A] ("ZZAUTOTEST PL lib list Alpha", [Cat-1]) and [PN-B] ("ZZAUTOTEST PL lib list Bravo", [Cat-2]); part numbers ZZAUTOTEST-PL-LIBLIST-01 and -02 (examples).
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- [Cat-1] and [Cat-2] = two different categories from the Category list.
- Create [PN-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL lib list Alpha" and Part Number ZZAUTOTEST-PL-LIBLIST-01 (examples), pick [Cat-1], type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-A] = the part number you typed.
- Create [PN-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL lib list Bravo" and Part Number ZZAUTOTEST-PL-LIBLIST-02 (examples), pick [Cat-2], type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-B] = the part number you typed.
- Check the setup worked: Parts → Part Library searched for ZZAUTOTEST-PL-LIBLIST lists 2 entries.



========== C425610 · section 20478 (S11 Part Library browse & edit only)
TITLE: Changing an entry's number on the Part Library page renames the part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role (Create & Edit is enough to rename).
- Locations: [Loc-1] and [Loc-2] (Setup creates [Loc-2] if only one exists).
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-1] (e.g. ZZAUTOTEST-PL-LIBREN-01) stocked at both [Loc-1] and [Loc-2] on one Part Library entry. [PN-1N] = the new number, e.g. ZZAUTOTEST-PL-LIBREN-01N, not used by any entry.
--- STEPS
- With [Loc-1] picked, click Parts in the top bar, then Part Library in the left menu.
- Type [PN-1] in the Search box.
- Click the [PN-1] row.
- Click the edit icon beside the entry's name in the Part details panel.
- Replace the Part Number with [PN-1N].
- Replace the Part Number with [PN-1] again.
- Replace the Part Number with [PN-1N].
- Click Save.
- Type [PN-1] in the Part Library Search box.
- Type [PN-1N] in the Part Library Search box.
- Open Parts → Inventory.
- Type [PN-1N] in the Search box.
- Click the clock icon (tooltip "Part History") at the left of the [PN-1N] row.
- Pick [Loc-2] in the location selector.
- Open Parts → Inventory.
- Type [PN-1N] in the Search box.
- Click the clock icon at the left of the [PN-1N] row.
--- EXPECTED
Expected results
- Step 5: Under the Part Number field the dialog shows "This also changes the part number at 1 other location."
- Step 6: With the saved number typed back, the message disappears.
- Step 7: The message shows again.
- Step 8: The change is saved and the detail page shows [PN-1N].
- Step 9: No entry is found for [PN-1]: no new Part Library entry was created for the old number.
- Step 10: One entry is found, [PN-1N], still with "Total parts" 2.
- Step 12: At [Loc-1] the Inventory list shows the part as [PN-1N] (same part, same stock); [PN-1] is no longer listed.
- Step 13: Part History at [Loc-1] has a new entry "Part number updated | Original number: [PN-1] | New number: [PN-1N]" with your name, today's date and time.
- Step 16: At [Loc-2] the same part is listed as [PN-1N].
- Step 17: Part History at [Loc-2] has the entry "Part number updated | Original number: [PN-1] | New number: [PN-1N] | Changed at: [Loc-1-Name]".
Source — where this behaviour comes from
Epic SV-10647; story SV-10824 (Story 11, The Part Library Is Browse and Edit Only); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S11-R3a, S13-R16, S13-R17, S13-R18, S10-R23, S10-R25, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 2.2 (Both fields edited), board 2.4 (Part History at Heavy Duty), board 2.5 (Lethbridge: renamed there too), board 2.6 (Part History at Lethbridge), board 7.2 (An entry opens its detail page). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S11-R3a: “Changing an entry's number or description on its detail page follows the part dialog's rules: S13-R12 to S13-R19, S13-N1, S13-N7, and S10-R23 to S10-R25.”
- S13-R16: “When the user changes the part number and at least one other location stocks the same Part Library entry, the dialog shows, under the field, "This also changes the part number at {n} other locations.", or "This also changes the part number at 1 other location." for one.”
- S13-R17: “That message shows only while the typed number differs from the saved one, ignoring spaces before and after it. Parts at other locations count whether they are active or inactive.”
- S13-R18: “Saving a changed number renames the part in place. The part keeps its identity, its history, and every line that holds it. Its Part Library entry is renamed with it, and its core takes the same number. No new Part Library entry is created.”
- S10-R23: “A changed part number writes "Part number updated | Original number: {old} | New number: {new}" to the Part History of the part at every location that stocks it.”
- S10-R25: “On the entries written at the other locations, the line ends with "| Changed at: {location}", naming the location where the change was made.”
- PRD §8 User Feedback Summary (Part number changed on a part other locations stock): “"This also changes the part number at {n} other locations." ("1 other location." for one)”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Changing an entry's number on the Part Library page renames the part
Test case: C425610, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role (Create & Edit is enough to rename).
- Locations: [Loc-1] and [Loc-2] (Setup creates [Loc-2] if only one exists).
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-1] (e.g. ZZAUTOTEST-PL-LIBREN-01) stocked at both [Loc-1] and [Loc-2] on one Part Library entry. [PN-1N] = the new number, e.g. ZZAUTOTEST-PL-LIBREN-01N, not used by any entry.
# Part 1. Setup for manual QA tester
- Sign in as [User-A].
- If the location selector in the top bar lists only one location, create a second one: Settings → Locations → New Location, type a name (e.g. ZZAUTOTEST-PL-LOC-B) and the other required fields, and save. [Loc-2] = the second location; [Loc-1] = the one you work in first.
- Pick [Loc-1] in the location selector.
- Create [PN-1]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL lib rename" and Part Number ZZAUTOTEST-PL-LIBREN-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-1] = the part number you typed.
- Pick [Loc-2] and create the same part there: New Inventory Part, the same Description "ZZAUTOTEST PL lib rename" and exactly the same Part Number [PN-1] (same upper and lower case), any Category, Cost (e.g. 10.00), Sell Price (e.g. 20.00), tracking on, default bin Quantity (e.g. 2), Save. Then pick [Loc-1] again.
- [PN-1N] = ZZAUTOTEST-PL-LIBREN-01N (example). Check in Parts → Part Library that searching [PN-1N] finds nothing.
- [Loc-1-Name] = the name of [Loc-1] as the location selector shows it.
- Check the setup worked: Parts → Part Library searched for [PN-1] lists 1 entry whose detail page shows "Total parts" 2 and Workplace rows for [Loc-1] and [Loc-2].



========== C425611 · section 20478 (S11 Part Library browse & edit only)
TITLE: Changing an entry's description on the Part Library page reaches every location
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role.
- Locations: [Loc-1] and [Loc-2] (Setup creates [Loc-2] if only one exists).
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-1] (e.g. ZZAUTOTEST-PL-LIBDESC-01) stocked at both locations on one entry, description [Desc-Old] = "ZZAUTOTEST PL lib desc old". [Desc-New] = "ZZAUTOTEST PL lib desc new".
--- STEPS
- With [Loc-1] picked, click Parts in the top bar, then Part Library in the left menu.
- Type [PN-1] in the Search box.
- Click the [PN-1] row.
- Click the edit icon beside the entry's name in the Part details panel.
- Replace the Description with [Desc-New].
- Replace the Description with two spaces, then [Desc-Old], then two spaces.
- Replace the Description with [Desc-New].
- Click Save.
- Open Parts → Inventory.
- Type [PN-1] in the Search box.
- Click the clock icon (tooltip "Part History") at the left of the [PN-1] row.
- Pick [Loc-2] in the location selector.
- Open Parts → Inventory.
- Type [PN-1] in the Search box.
- Click the clock icon at the left of the [PN-1] row.
--- EXPECTED
Expected results
- Step 5: Under the Description field the dialog shows "This also changes the description at 1 other location."
- Step 6: The saved description with only spaces around it does not count as a change: the message disappears.
- Step 7: The message shows again.
- Step 8: The change is saved and the detail page shows [Desc-New].
- Step 10: At [Loc-1] the part shows the description [Desc-New].
- Step 11: Part History at [Loc-1] has a new entry "Description updated | Original description: ZZAUTOTEST PL lib desc old | New description: ZZAUTOTEST PL lib desc new".
- Step 14: At [Loc-2] the same part shows [Desc-New].
- Step 15: Part History at [Loc-2] has "Description updated | Original description: ZZAUTOTEST PL lib desc old | New description: ZZAUTOTEST PL lib desc new | Changed at: [Loc-1-Name]".
- Step 8: The part's core (if it had one) would be renamed "Core for ZZAUTOTEST PL lib desc new"; this part has no core and a core is not shown on screen, so write "core rename not checked by hand" in the result comment.
Source — where this behaviour comes from
Epic SV-10647; story SV-10824 (Story 11, The Part Library Is Browse and Edit Only); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S11-R3a, S13-R12, S13-R13, S13-R14, S10-R24, S10-R25, S13-R15, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 2.2 (Both fields edited), board 2.4 (Part History at Heavy Duty), board 2.6 (Part History at Lethbridge), board 7.2 (An entry opens its detail page). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S11-R3a: “Changing an entry's number or description on its detail page follows the part dialog's rules: S13-R12 to S13-R19, S13-N1, S13-N7, and S10-R23 to S10-R25.”
- S13-R12: “When the user changes the description and at least one other location stocks the same Part Library entry, the dialog shows, under the field, "This also changes the description at {n} other locations.", or "This also changes the description at 1 other location." for one.”
- S13-R13: “That message shows only while the typed description differs from the saved one, ignoring spaces before and after it.”
- S13-R14: “Saving a changed description changes the part's Part Library entry, so every location that stocks the part shows the new description.”
- S10-R24: “A changed description writes "Description updated | Original description: {old} | New description: {new}" to the Part History of the part at every location that stocks it.”
- S10-R25: “On the entries written at the other locations, the line ends with "| Changed at: {location}", naming the location where the change was made.”
- S13-R15: “A changed description also renames the part's core, which reads "Core for {description}".”
- PRD §8 User Feedback Summary (Description changed on a part other locations stock): “"This also changes the description at {n} other locations." ("1 other location." for one)”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Changing an entry's description on the Part Library page reaches every location
Test case: C425611, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role.
- Locations: [Loc-1] and [Loc-2] (Setup creates [Loc-2] if only one exists).
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-1] (e.g. ZZAUTOTEST-PL-LIBDESC-01) stocked at both locations on one entry, description [Desc-Old] = "ZZAUTOTEST PL lib desc old". [Desc-New] = "ZZAUTOTEST PL lib desc new".
# Part 1. Setup for manual QA tester
- Sign in as [User-A].
- If the location selector in the top bar lists only one location, create a second one: Settings → Locations → New Location, type a name (e.g. ZZAUTOTEST-PL-LOC-B) and the other required fields, and save. [Loc-2] = the second location; [Loc-1] = the one you work in first.
- Pick [Loc-1] in the location selector.
- Create [PN-1]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL lib desc old" and Part Number ZZAUTOTEST-PL-LIBDESC-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-1] = the part number you typed.
- Pick [Loc-2] and create the same part there: New Inventory Part, the same Description "ZZAUTOTEST PL lib desc old" and exactly the same Part Number [PN-1] (same upper and lower case), any Category, Cost (e.g. 10.00), Sell Price (e.g. 20.00), tracking on, default bin Quantity (e.g. 2), Save. Then pick [Loc-1] again.
- [Loc-1-Name] = the name of [Loc-1] as the location selector shows it.
- Check the setup worked: Parts → Part Library searched for [PN-1] lists 1 entry with "Total parts" 2.



========== C425612 · section 20478 (S11 Part Library browse & edit only)
TITLE: The Part Library page refuses a number that another entry already has
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role.
- Locations: [Loc-1] and [Loc-2] (Setup creates [Loc-2] if only one exists).
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: two separate Part Library entries: [PN-A] (e.g. ZZAUTOTEST-PL-LIBDUP-01) stocked at [Loc-1] only, and [PN-B] (e.g. ZZAUTOTEST-PL-LIBDUP-02, all capitals) stocked at [Loc-2] only. [PN-B-lower] = [PN-B] in lower case (e.g. zzautotest-pl-libdup-02).
--- STEPS
- With [Loc-1] picked, click Parts in the top bar, then Part Library in the left menu.
- Type [PN-A] in the Search box.
- Click the [PN-A] row.
- Click the edit icon beside the entry's name in the Part details panel.
- Replace the Part Number with [PN-B], exactly (same capitals).
- Click Save.
- Wait 5 seconds.
- Replace the Part Number with [PN-B-lower].
- Click Save.
- Type ZZAUTOTEST-PL-LIBDUP in the Part Library Search box.
--- EXPECTED
Expected results
- Step 6: The save is refused and the Edit Library Part dialog stays open. A red error toast reads "Part number ZZAUTOTEST-PL-LIBDUP-02 already belongs to another part in the Part Library." with a smaller second line "Please try to resolve this."
- Step 7: The toast has closed on its own after about 3 seconds; the entry still has its number [PN-A].
- Step 9: The save goes through, because [PN-B-lower] is not exactly the same as [PN-B] (upper and lower case differ): the detail page shows [PN-B-lower] exactly as typed.
- Step 10: Two entries are listed, [PN-B] and [PN-B-lower]; no entries were merged.
Source — where this behaviour comes from
Epic SV-10647; story SV-10824 (Story 11, The Part Library Is Browse and Edit Only); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S11-R3a, S13-N1, §4 Key Decisions, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 7.2 (An entry opens its detail page). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S11-R3a: “Changing an entry's number or description on its detail page follows the part dialog's rules: S13-R12 to S13-R19, S13-N1, S13-N7, and S10-R23 to S10-R25.”
- S13-N1: “If another Part Library entry already has exactly the typed number, with the same characters and the same upper and lower case, the save is refused, the dialog stays open, and the system shows "Part number {number} already belongs to another part in the Part Library."”
- PRD §4 Key Decisions (A rename follows the same match rule as linking): “A rename follows the same match rule as linking. A rename is refused only when another Part Library entry has exactly the typed number: the same characters, with the same upper and lower case.”
- PRD §8 User Feedback Summary (Part number already belongs to another entry): “"Part number {number} already belongs to another part in the Part Library."”
- PRD §8 User Feedback Summary (Part number already belongs to another entry): “Error toast, fades after 3 seconds; the dialog stays open”
- PRD §8 User Feedback Summary (context note): “every refusal sent by the system, the rows that fade after 3 seconds, also shows a second, smaller line under the message: "Please try to resolve this."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The Part Library page refuses a number that another entry already has
Test case: C425612, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role.
- Locations: [Loc-1] and [Loc-2] (Setup creates [Loc-2] if only one exists).
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: two separate Part Library entries: [PN-A] (e.g. ZZAUTOTEST-PL-LIBDUP-01) stocked at [Loc-1] only, and [PN-B] (e.g. ZZAUTOTEST-PL-LIBDUP-02, all capitals) stocked at [Loc-2] only. [PN-B-lower] = [PN-B] in lower case (e.g. zzautotest-pl-libdup-02).
# Part 1. Setup for manual QA tester
- Sign in as [User-A].
- If the location selector in the top bar lists only one location, create a second one: Settings → Locations → New Location, type a name (e.g. ZZAUTOTEST-PL-LOC-B) and the other required fields, and save. [Loc-2] = the second location; [Loc-1] = the one you work in first.
- Pick [Loc-1].
- Create [PN-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL lib dup A" and Part Number ZZAUTOTEST-PL-LIBDUP-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-A] = the part number you typed.
- Pick [Loc-2]. Create [PN-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL lib dup B" and Part Number ZZAUTOTEST-PL-LIBDUP-02 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-B] = the part number you typed.
- Pick [Loc-1] again.
- Check the setup worked: Parts → Part Library searched for ZZAUTOTEST-PL-LIBDUP lists 2 entries, [PN-A] and [PN-B].



========== C425613 · section 20478 (S11 Part Library browse & edit only)
TITLE: A number changed on the Part Library page reaches an open part request
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-1] (e.g. ZZAUTOTEST-PL-LIBOPEN-01) stocked at [Loc-1]; an open work order [WO-1] for a ZZAUTOTEST customer with one line holding a part request for [PN-1], quantity 1, not received. [PN-1N] = the new number, e.g. ZZAUTOTEST-PL-LIBOPEN-01N.
--- STEPS
- In the top bar click Parts, then click Part Library in the left menu.
- Type [PN-1] in the Search box.
- Click the [PN-1] row.
- Click the edit icon beside the entry's name in the Part details panel.
- Replace the Part Number with [PN-1N].
- Click Save.
- In the top bar click Work Orders.
- Open [WO-1].
- Look at the line's part row.
- Click the Parts tab of [WO-1].
--- EXPECTED
Expected results
- Step 6: The change is saved.
- Step 9: The part request on the line now shows [PN-1N], with the same description, quantity and status as before.
- Step 10: The Parts tab lists the request under [PN-1N]; [PN-1] is not shown.
Source — where this behaviour comes from
Epic SV-10647; story SV-10824 (Story 11, The Part Library Is Browse and Edit Only); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S11-R3a, S13-R19, read 8 Oct 2026; design canvas board 7.2 (An entry opens its detail page), board 2.3 (Saved: the list shows the new values). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S11-R3a: “Changing an entry's number or description on its detail page follows the part dialog's rules: S13-R12 to S13-R19, S13-N1, S13-N7, and S10-R23 to S10-R25.”
- S13-R19: “A rename carries over to open work that holds this part, at every location: purchase order lines not yet fully received, part requests not yet received or returned, canned jobs, and returns that are not completed take the new number. A delivery that is not yet accepted is covered by its open purchase order lines. Receiving, ordering, applying a canned job and returning then find the renamed part.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A number changed on the Part Library page reaches an open part request
Test case: C425613, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-1] (e.g. ZZAUTOTEST-PL-LIBOPEN-01) stocked at [Loc-1]; an open work order [WO-1] for a ZZAUTOTEST customer with one line holding a part request for [PN-1], quantity 1, not received. [PN-1N] = the new number, e.g. ZZAUTOTEST-PL-LIBOPEN-01N.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [PN-1]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL lib open work" and Part Number ZZAUTOTEST-PL-LIBOPEN-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-1] = the part number you typed.
- Create an open work order: in the top bar click Work Orders, click New, and in the New Work Order dialog use the Add button beside Customer to create a customer (e.g. "ZZAUTOTEST PL lib open customer") and the Add button beside Asset to create an asset for it (e.g. unit "ZZAUTOTEST PL lib open-UNIT"); click Save, and click Create if a confirmation appears. [WO-1] = the work order number shown.
- On [WO-1] click New Line, type a Title (e.g. "ZZAUTOTEST PL lib open line"), and click Save & Close.
- On the [WO-1] line, click + Add Part in its Parts row; in New Part Request type [PN-1] in Part Number, pick the result that shows "Inventory Qty", set the quantity to 1, and click Save Part.
- Check the setup worked: [WO-1]'s line lists [PN-1] with quantity 1 and status Requested (not received).



========== C425614 · section 20478 (S11 Part Library browse & edit only)
TITLE: A Part Library number over 50 characters is refused while on an open request
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-1] (e.g. ZZAUTOTEST-PL-LIBLEN-01) stocked at [Loc-1]; an open work order [WO-1] for a ZZAUTOTEST customer with a line holding a part request for [PN-1], not received.
- Data: [N-51] = ZZAUTOTEST-PL-LIBLEN-01-XXXXXXXXXXXXXXXXXXXXXXXXXXX (51 characters); [N-50] = ZZAUTOTEST-PL-LIBLEN-01-XXXXXXXXXXXXXXXXXXXXXXXXXX (50 characters). The lengths must hold; the letters are examples.
--- STEPS
- In the top bar click Parts, then click Part Library in the left menu.
- Type [PN-1] in the Search box.
- Click the [PN-1] row.
- Click the edit icon beside the entry's name in the Part details panel.
- Replace the Part Number with [N-51].
- Click Save.
- Wait 5 seconds.
- Replace the Part Number with [N-50].
- Click Save.
- In the top bar click Work Orders.
- Open [WO-1].
--- EXPECTED
Expected results
- Step 6: The save is refused and the Edit Library Part dialog stays open. A red error toast reads "Part number can't be longer than 50 characters while it's on an open part request."
- Step 7: The toast has closed on its own after about 3 seconds; the entry still has the number [PN-1].
- Step 9: 50 characters are allowed (only more than 50 is refused): the change is saved and the detail page shows [N-50].
- Step 11: The part request on the [WO-1] line shows [N-50].
Source — where this behaviour comes from
Epic SV-10647; story SV-10824 (Story 11, The Part Library Is Browse and Edit Only); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S11-R3a, S13-N7, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 7.2 (An entry opens its detail page). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S11-R3a: “Changing an entry's number or description on its detail page follows the part dialog's rules: S13-R12 to S13-R19, S13-N1, S13-N7, and S10-R23 to S10-R25.”
- S13-N7: “If the new number is longer than 50 characters and the part sits on an open part request, the save is refused with "Part number can't be longer than 50 characters while it's on an open part request."”
- PRD §8 User Feedback Summary (Rename over 50 characters with an open part request): “"Part number can't be longer than 50 characters while it's on an open part request."”
- PRD §8 User Feedback Summary (Rename over 50 characters with an open part request): “Error toast, fades after 3 seconds; the dialog stays open”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A Part Library number over 50 characters is refused while on an open request
Test case: C425614, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-1] (e.g. ZZAUTOTEST-PL-LIBLEN-01) stocked at [Loc-1]; an open work order [WO-1] for a ZZAUTOTEST customer with a line holding a part request for [PN-1], not received.
- Data: [N-51] = ZZAUTOTEST-PL-LIBLEN-01-XXXXXXXXXXXXXXXXXXXXXXXXXXX (51 characters); [N-50] = ZZAUTOTEST-PL-LIBLEN-01-XXXXXXXXXXXXXXXXXXXXXXXXXX (50 characters). The lengths must hold; the letters are examples.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [PN-1]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL lib length" and Part Number ZZAUTOTEST-PL-LIBLEN-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-1] = the part number you typed.
- Create an open work order: in the top bar click Work Orders, click New, and in the New Work Order dialog use the Add button beside Customer to create a customer (e.g. "ZZAUTOTEST PL lib length customer") and the Add button beside Asset to create an asset for it (e.g. unit "ZZAUTOTEST PL lib length-UNIT"); click Save, and click Create if a confirmation appears. [WO-1] = the work order number shown.
- On [WO-1] click New Line, type a Title (e.g. "ZZAUTOTEST PL lib length line"), and click Save & Close.
- On the [WO-1] line, click + Add Part in its Parts row; in New Part Request type [PN-1] in Part Number, pick the result that shows "Inventory Qty", set the quantity to 1, and click Save Part.
- Check the setup worked: [WO-1]'s line lists [PN-1], not received; [N-51] counts 51 characters and [N-50] counts 50 (paste them into any text editor that shows a character count).



========== C425615 · section 20478 (S11 Part Library browse & edit only)
TITLE: The Part Library page keeps upper and lower case in a typed part number
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-1] (e.g. ZZAUTOTEST-PL-LIBCASE-01) stocked at [Loc-1]. [PN-1M] = a mixed-case new number, e.g. ZZautotest-PL-LibCase-01m, not used by any entry.
--- STEPS
- In the top bar click Parts, then click Part Library in the left menu.
- Type [PN-1] in the Search box.
- Click the [PN-1] row.
- Click the edit icon beside the entry's name in the Part details panel.
- Replace the Part Number with [PN-1M], typing it exactly with its mix of capitals and small letters.
- Click Save.
- Open Parts → Inventory.
- Type [PN-1M] in the Search box.
--- EXPECTED
Expected results
- Step 5: The field shows the letters exactly as typed (they are not turned into capitals).
- Step 6: The change is saved and the detail page's "Part number" reads ZZautotest-PL-LibCase-01m exactly as typed, not ZZAUTOTEST-PL-LIBCASE-01M.
- Step 8: The Inventory list shows the part number with the same mix of capitals and small letters.
Source — where this behaviour comes from
Epic SV-10647; story SV-10824 (Story 11, The Part Library Is Browse and Edit Only); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S11-R3b, read 8 Oct 2026; design canvas board 7.2 (An entry opens its detail page). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S11-R3b: “On the Part Library page, a part number is saved exactly as typed, with upper and lower case kept, the same as in the part dialog.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The Part Library page keeps upper and lower case in a typed part number
Test case: C425615, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-1] (e.g. ZZAUTOTEST-PL-LIBCASE-01) stocked at [Loc-1]. [PN-1M] = a mixed-case new number, e.g. ZZautotest-PL-LibCase-01m, not used by any entry.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [PN-1]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL lib case" and Part Number ZZAUTOTEST-PL-LIBCASE-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-1] = the part number you typed.
- Check the setup worked: Parts → Part Library searched for [PN-1] lists 1 entry, and searching [PN-1M] finds nothing else with that spelling.



========== C425616 · section 20478 (S11 Part Library browse & edit only)
TITLE: A part requested from a vendor reaches the Part Library when it is received
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-SO] (e.g. ZZAUTOTEST-PL-SORECV-01), a part number no Part Library entry has; [Vendor-A], any existing vendor (it is only picked, not changed); an open work order [WO-1] for a ZZAUTOTEST customer with one line.
--- STEPS
- In the top bar click Work Orders.
- Open [WO-1].
- On the [WO-1] line, click + Add Part in its Parts row.
- In New Part Request, type [PN-SO] in Part Number.
- Pick the offer to add the typed number as a new part (special order) instead of an existing result.
- Set Source to Vendor.
- Pick any Category.
- Pick [Vendor-A] in Vendor.
- Type 10.00 in Cost.
- Type 20.00 in Sell Price.
- Click Save Part.
- Open Parts → Part Library.
- Type [PN-SO] in the Search box.
- Open [WO-1] from Work Orders.
- Click the Parts tab of [WO-1].
- Order the requested part from [Vendor-A] with the build's order action (it puts the part on a purchase order).
- Open Parts → Purchase Orders.
- Open the purchase order for [Vendor-A] that holds [PN-SO].
- Click Receive on that purchase order.
- Type 1 as the received quantity for [PN-SO].
- Save the receipt.
- Open Parts → Part Library.
- Type [PN-SO] in the Search box.
--- EXPECTED
Expected results
- Step 11: The part request is saved on the [WO-1] line with [PN-SO].
- Step 13: No Part Library entry exists yet for [PN-SO]: a part request alone does not create one.
- Step 21: The part is received.
- Step 23: One entry [PN-SO] is now listed: it was created when the requested part was received.
Source — where this behaviour comes from
Epic SV-10647; story SV-10824 (Story 11, The Part Library Is Browse and Edit Only); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S11-R6, read 8 Oct 2026; design canvas board 6.2 (Once inactive: not offered), board 7.1 (Part Library). Tech plan "Parts Lifecycle Update — Technical Implementation Plan" (7 Oct 2026), §1 Clarifications Q11. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S11-R6: “A new Part Library entry is created only from a part number in use: creating an inventory part (S7-R7 and S7-R8), a part request when the requested part is received, a delivery receipt, a core charge, returning a special-order part to inventory, returning a core to inventory, the parts CSV import, and the public API.”
- Tech plan §1 Clarifications (Q11 Part request entry timing): “PRD corrected: entry created when the requested part is received (S11-R6)”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A part requested from a vendor reaches the Part Library when it is received
Test case: C425616, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-SO] (e.g. ZZAUTOTEST-PL-SORECV-01), a part number no Part Library entry has; [Vendor-A], any existing vendor (it is only picked, not changed); an open work order [WO-1] for a ZZAUTOTEST customer with one line.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Parts → Part Library: search [PN-SO]; it must find nothing (if it exists, choose another suffix).
- [Vendor-A] = any vendor listed under Parts → Vendors (e.g. the first one).
- Create an open work order: in the top bar click Work Orders, click New, and in the New Work Order dialog use the Add button beside Customer to create a customer (e.g. "ZZAUTOTEST PL special order customer") and the Add button beside Asset to create an asset for it (e.g. unit "ZZAUTOTEST PL special order-UNIT"); click Save, and click Create if a confirmation appears. [WO-1] = the work order number shown.
- On [WO-1] click New Line, type a Title (e.g. "ZZAUTOTEST PL special order line"), and click Save & Close.
- Check the setup worked: [WO-1] is open with one line, and the Part Library has no entry for [PN-SO].



========== C425617 · section 20478 (S11 Part Library browse & edit only)
TITLE: Spaces around a typed part number do not create a second Part Library entry
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role.
- Locations: [Loc-1] and [Loc-2] (Setup creates [Loc-2] if only one exists).
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-1] (e.g. ZZAUTOTEST-PL-TRIM-01, description "ZZAUTOTEST PL trim part") stocked at [Loc-1] only.
--- STEPS
- Pick [Loc-2] in the location selector.
- Open Parts → Inventory.
- Click New Inventory Part.
- Type "ZZAUTOTEST PL trim part" in Description.
- Type two spaces, then [PN-1], then two spaces in Part Number.
- Pick any Category.
- Type 10.00 in Cost.
- Type 20.00 in Sell Price.
- Click Save.
- Type ZZAUTOTEST-PL-TRIM in the Inventory Search box.
- Open Parts → Part Library.
- Type ZZAUTOTEST-PL-TRIM in the Search box.
- Click the [PN-1] row.
--- EXPECTED
Expected results
- Step 9: The part is saved with no message about the Part Library (the descriptions match).
- Step 10: At [Loc-2] the part is listed as [PN-1], with no spaces before or after it.
- Step 12: Still exactly one entry is listed, [PN-1]: no second entry with spaces was created.
- Step 13: The entry's detail page shows "Total parts" 2, with Workplace rows for [Loc-1] and [Loc-2]: the new part was linked to the existing entry.
Source — where this behaviour comes from
Epic SV-10647; story SV-10824 (Story 11, The Part Library Is Browse and Edit Only); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S11-R6a, S7-R3, S7-R5, read 8 Oct 2026; design canvas board 1.3 (Number and description typed), board 7.2 (An entry opens its detail page). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S11-R6a: “Every route in S11-R6 removes spaces before and after the part number before it looks for an exact match.”
- S7-R3: “Spaces before and after the part number and the description are removed on save.”
- S7-R5: “If exactly one entry matches, the new part is linked to that entry.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Spaces around a typed part number do not create a second Part Library entry
Test case: C425617, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role.
- Locations: [Loc-1] and [Loc-2] (Setup creates [Loc-2] if only one exists).
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-1] (e.g. ZZAUTOTEST-PL-TRIM-01, description "ZZAUTOTEST PL trim part") stocked at [Loc-1] only.
# Part 1. Setup for manual QA tester
- Sign in as [User-A].
- If the location selector in the top bar lists only one location, create a second one: Settings → Locations → New Location, type a name (e.g. ZZAUTOTEST-PL-LOC-B) and the other required fields, and save. [Loc-2] = the second location; [Loc-1] = the one you work in first.
- Pick [Loc-1].
- Create [PN-1]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL trim part" and Part Number ZZAUTOTEST-PL-TRIM-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-1] = the part number you typed.
- Check the setup worked: Parts → Part Library searched for ZZAUTOTEST-PL-TRIM lists 1 entry with "Total parts" 1.



========== C425618 · section 20478 (S11 Part Library browse & edit only)
TITLE: An entry with no part behind it can be edited and a new part links to it
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role (holds 'Part Library & Inventory' Delete, for Delete Part in Setup).
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-O] (e.g. ZZAUTOTEST-PL-ORPHAN-01), a Part Library entry with no inventory part behind it ("Total parts" 0).
--- STEPS
- In the top bar click Parts, then click Part Library in the left menu.
- Type [PN-O] in the Search box.
- Click the [PN-O] row.
- Click the edit icon beside the entry's name in the Part details panel.
- Replace the Description with "ZZAUTOTEST PL orphan entry edited".
- Click Save.
- Open Parts → Inventory.
- Click New Inventory Part.
- Type "ZZAUTOTEST PL orphan link" in Description.
- Type [PN-O] in Part Number, exactly as the entry has it.
- Pick any Category.
- Type 10.00 in Cost.
- Type 20.00 in Sell Price.
- Click Save.
- Open Parts → Part Library.
- Type [PN-O] in the Search box.
- Click the [PN-O] row.
--- EXPECTED
Expected results
- Step 6: The entry with nothing behind it can be edited: the detail page shows "ZZAUTOTEST PL orphan entry edited".
- Step 14: The part is saved and linked to that entry: a green toast reads "Part created. Linked to ZZAUTOTEST-PL-ORPHAN-01 in the Part Library. Its description "ZZAUTOTEST PL orphan entry edited" was kept." (with your [PN-O] and the edited description).
- Step 16: Still one entry [PN-O]; no second entry was created.
- Step 17: The detail page keeps the description "ZZAUTOTEST PL orphan entry edited" and now shows "Total parts" 1.
Source — where this behaviour comes from
Epic SV-10647; story SV-10824 (Story 11, The Part Library Is Browse and Edit Only); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S11-E2, S7-R5, S7-R6, S7-R9, read 8 Oct 2026; design canvas board 1.4 (Saved and linked to the Part Library entry), board 7.2 (An entry opens its detail page). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S11-E2: “An entry with no inventory part behind it can still be edited from its detail page, and is the entry a new part links to when its number is typed exactly (S7-R5).”
- S7-R5: “If exactly one entry matches, the new part is linked to that entry.”
- S7-R6: “A linked entry keeps its own description. The description typed in the dialog does not change it.”
- S7-R9: “When the part was linked to an existing entry whose description differs from the one typed, ignoring upper and lower case and spaces before and after, the system shows "Part created. Linked to {part number} in the Part Library. Its description "{library description}" was kept." For example: "Part created. Linked to N68SL-356 in the Part Library. Its description "BRAKE PAD" was kept."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: An entry with no part behind it can be edited and a new part links to it
Test case: C425618, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role (holds 'Part Library & Inventory' Delete, for Delete Part in Setup).
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-O] (e.g. ZZAUTOTEST-PL-ORPHAN-01), a Part Library entry with no inventory part behind it ("Total parts" 0).
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [PN-O]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL orphan entry" and Part Number ZZAUTOTEST-PL-ORPHAN-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-O] = the part number you typed.
- Open [PN-O] from the Active tab and click Delete Part (the part is on no work order, so it is deleted at once).
- Open Parts → Part Library and search [PN-O]. If the entry is still listed with "Total parts" 0, it is the entry for this case. If it has gone with the part, use instead an entry created before the deployment with Parts → Catalog → New Catalog Part (e.g. ZZAUTOTEST-PL-ORPHAN-02) and never stocked.
- Check the setup worked: Parts → Part Library, [PN-O]'s detail page shows "Total parts" 0.



========== C154832 · section 20479 (S12 Rename Catalog to Part Library)
TITLE: The Parts menu, page title and browser tab read Part Library
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: 1 Part Library entry [PN-A] (e.g. ZZAUTOTEST-PL-NAME-01) to open.
--- STEPS
- In the top bar click Parts.
- Read the entries under PARTS in the left menu.
- Click Part Library in the left menu.
- Read the page title.
- Read the title on the browser tab.
- Type [PN-A] in the Search box.
- Click the [PN-A] row.
- Read the title on the browser tab.
--- EXPECTED
Expected results
- Step 2: Under PARTS the left menu reads "Inventory" and "Part Library"; there is no "Catalog" entry.
- Step 4: The page title reads "Part Library".
- Step 5: The browser tab title reads "Part Library".
- Step 8: On the entry's detail page the browser tab title reads "Library Part".
Source — where this behaviour comes from
Epic SV-10647; story SV-10825 (Story 12, Call the Shared Parts List the Part Library); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S12-R1, S12-R2, S12-R12, read 8 Oct 2026; design canvas board 7.1 (Part Library), board 7.0 (Before: the Catalog page today), board 7.2 (An entry opens its detail page). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S12-R1: “The Parts left menu entry reads "Part Library".”
- S12-R2: “The page title on that screen reads "Part Library".”
- S12-R12: “The browser tab titles read "Part Library" on the list and "Library Part" on an entry's detail page.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The Parts menu, page title and browser tab read Part Library
Test case: C154832, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: 1 Part Library entry [PN-A] (e.g. ZZAUTOTEST-PL-NAME-01) to open.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [PN-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL name" and Part Number ZZAUTOTEST-PL-NAME-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-A] = the part number you typed.
- Check the setup worked: [PN-A] is listed on Parts → Inventory.



========== C154833 · section 20479 (S12 Rename Catalog to Part Library)
TITLE: Deleting an unused Part Library entry asks and confirms in Part Library words
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role (holds 'Part Library & Inventory' Delete).
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-O] (e.g. ZZAUTOTEST-PL-DELENTRY-01), a Part Library entry with nothing behind it ("Total parts" 0), so it may be deleted.
--- STEPS
- In the top bar click Parts, then click Part Library in the left menu.
- Type [PN-O] in the Search box.
- Click the [PN-O] row.
- Click the edit icon beside the entry's name in the Part details panel.
- Click Delete.
- Read the confirmation question.
- Confirm the deletion.
- Type [PN-O] in the Part Library Search box.
--- EXPECTED
Expected results
- Step 6: The confirmation asks "Are you sure you want to delete this library part?"
- Step 7: The entry is deleted and a success message reads "Library part deleted successfully."
- Step 8: [PN-O] is no longer listed.
Source — where this behaviour comes from
Epic SV-10647; story SV-10825 (Story 12, Call the Shared Parts List the Part Library); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S12-R13, S12-R5, read 8 Oct 2026; design canvas board 7.2 (An entry opens its detail page). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S12-R13: “Deleting a Part Library entry asks "Are you sure you want to delete this library part?"”
- S12-R5: “The success message when deleting a Part Library entry reads "Library part deleted successfully."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Deleting an unused Part Library entry asks and confirms in Part Library words
Test case: C154833, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role (holds 'Part Library & Inventory' Delete).
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-O] (e.g. ZZAUTOTEST-PL-DELENTRY-01), a Part Library entry with nothing behind it ("Total parts" 0), so it may be deleted.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [PN-O]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL delete entry" and Part Number ZZAUTOTEST-PL-DELENTRY-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-O] = the part number you typed.
- Open [PN-O] from the Active tab and click Delete Part (the part is on no work order, so it is deleted at once).
- Open Parts → Part Library and search [PN-O]. If the entry is still listed with "Total parts" 0, it is the entry for this case. If it has gone with the part, use instead an entry created before the deployment with Parts → Catalog → New Catalog Part (e.g. ZZAUTOTEST-PL-DELENTRY-01-OLD) and never stocked.
- Check the setup worked: [PN-O]'s detail page shows "Total parts" 0.



========== C154834 · section 20479 (S12 Rename Catalog to Part Library)
TITLE: Roles & Permissions shows the Part Library and Inventory permission group
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role (opens Settings → Roles & Permissions).
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: a custom role of this case, [Role-L] (e.g. ZZAUTOTEST-PL-LABELS), to open in the editor, so no shared role is touched.
--- STEPS
- In the left menu open Settings, then Roles & Permissions.
- Click the edit (pencil) button of [Role-L].
- Find the Parts Department card and read its description.
- Read the title of the permission group under it that holds the inventory and library permissions.
- Read that group's description.
- Read the three permission labels in that group.
- Click Cancel (or leave without saving).
--- EXPECTED
Expected results
- Step 3: The Parts Department card description reads "Manage parts inventory, part library, sales, and vendor operations."
- Step 4: The permission group is titled "Part Library and Inventory".
- Step 5: The group's description reads "Manage the parts library and inventory levels."
- Step 6: The three labels read "Part Library & Inventory — View", "Part Library & Inventory — Create & Edit" and "Part Library & Inventory — Delete". The word "Catalog" does not appear in the card or the group.
- Step 7: Nothing is saved; [Role-L] is unchanged.
Source — where this behaviour comes from
Epic SV-10647; story SV-10825 (Story 12, Call the Shared Parts List the Part Library); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S12-R6, S12-R7, S12-R8, S12-R9, read 8 Oct 2026; design canvas (no board; Story 12 Roles & Permissions text is not drawn). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S12-R6: “On Administration → Roles & Permissions → Edit Role, the permission group is titled "Part Library and Inventory".”
- S12-R7: “That group's description reads "Manage the parts library and inventory levels."”
- S12-R8: “The Parts Department card description above that group reads "Manage parts inventory, part library, sales, and vendor operations."”
- S12-R9: “The three permission labels read "Part Library & Inventory — View", "Part Library & Inventory — Create & Edit" and "Part Library & Inventory — Delete".”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Roles & Permissions shows the Part Library and Inventory permission group
Test case: C154834, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role (opens Settings → Roles & Permissions).
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: a custom role of this case, [Role-L] (e.g. ZZAUTOTEST-PL-LABELS), to open in the editor, so no shared role is touched.
# Part 1. Setup for manual QA tester
- Sign in as [User-A].
- Settings → Roles & Permissions → Create custom role → Skip (blank role) → Role name (e.g. ZZAUTOTEST-PL-LABELS) → switch on the Parts Department and tick the Part Library and Inventory View permission → Create. [Role-L] = this role.
- Check the setup worked: Settings → Roles & Permissions lists [Role-L].



========== C154835 · section 20479 (S12 Rename Catalog to Part Library)
TITLE: An old bookmark to the Catalog page opens the Part Library
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [Old-URL] = the address of the Catalog page as it was before the Part Lifecycle build was deployed.
--- STEPS
- Sign in on the Part Lifecycle build as [User-A].
- Open [Old-URL] (click the bookmark, or paste it into the address bar and press Enter).
- Read the page title.
- Read the address in the browser's address bar.
--- EXPECTED
Expected results
- Step 2: The page opens without an error or a "page not found" message.
- Step 3: The page title reads "Part Library".
- Step 4: The address is still [Old-URL]: the page's address has not changed.
Source — where this behaviour comes from
Epic SV-10647; story SV-10825 (Story 12, Call the Shared Parts List the Part Library); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S12-N2, read 8 Oct 2026; design canvas board 7.1 (Part Library), board 7.0 (Before: the Catalog page today). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S12-N2: “The address of the Part Library page stays the same, so bookmarks and saved links still open it.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: An old bookmark to the Catalog page opens the Part Library
Test case: C154835, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [Old-URL] = the address of the Catalog page as it was before the Part Lifecycle build was deployed.
# Part 1. Setup for manual QA tester
- Before the deployment, open Parts → Catalog on the earlier build and bookmark it, or copy its address from the browser's address bar. If that was not done, use your ShopView address followed by /parts/parts-catalogue (the Catalog page's address on earlier builds). [Old-URL] = that address.
- Check the setup worked: [Old-URL] is written down or bookmarked.



========== C425619 · section 20479 (S12 Rename Catalog to Part Library)
TITLE: The edit window for a Part Library entry is titled Edit Library Part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: 1 Part Library entry [PN-A] (e.g. ZZAUTOTEST-PL-EDITTITLE-01).
--- STEPS
- In the top bar click Parts, then click Part Library in the left menu.
- Type [PN-A] in the Search box.
- Click the [PN-A] row.
- Click the edit icon beside the entry's name in the Part details panel.
- Read the dialog title.
- Click Cancel.
--- EXPECTED
Expected results
- Step 5: The dialog is titled "Edit Library Part" (not "Edit Catalog Part").
- Step 6: The dialog closes without changes.
Source — where this behaviour comes from
Epic SV-10647; story SV-10825 (Story 12, Call the Shared Parts List the Part Library); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S12-R3, read 8 Oct 2026; design canvas board 7.2 (An entry opens its detail page). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S12-R3: “The dialog for editing a Part Library entry is titled "Edit Library Part".”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The edit window for a Part Library entry is titled Edit Library Part
Test case: C425619, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: 1 Part Library entry [PN-A] (e.g. ZZAUTOTEST-PL-EDITTITLE-01).
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [PN-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL edit title" and Part Number ZZAUTOTEST-PL-EDITTITLE-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-A] = the part number you typed.
- Check the setup worked: Parts → Part Library, Search [PN-A] lists 1 entry.



========== C425620 · section 20479 (S12 Rename Catalog to Part Library)
TITLE: Deleting a Part Library entry that a part uses is refused
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role (holds 'Part Library & Inventory' Delete).
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-A] (e.g. ZZAUTOTEST-PL-INUSE-01), a Part Library entry with an inventory part behind it at [Loc-1].
--- STEPS
- In the top bar click Parts, then click Part Library in the left menu.
- Type [PN-A] in the Search box.
- Click the [PN-A] row.
- Click the edit icon beside the entry's name in the Part details panel.
- Click Delete.
- Confirm the deletion if a confirmation asks.
- Wait 5 seconds.
- Type [PN-A] in the Part Library Search box.
- Open Parts → Inventory.
- Type [PN-A] in the Search box.
--- EXPECTED
Expected results
- Step 6: The delete is refused. A red error toast reads "This Part Library entry is in use and cannot be deleted." with a smaller second line "Please try to resolve this."
- Step 7: The toast has closed on its own after about 3 seconds.
- Step 8: [PN-A] is still listed in the Part Library.
- Step 10: The inventory part [PN-A] is still listed and unchanged.
Source — where this behaviour comes from
Epic SV-10647; story SV-10825 (Story 12, Call the Shared Parts List the Part Library); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S12-R11, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 7.2 (An entry opens its detail page). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S12-R11: “Refusals that name the shared list read: "This Part Library entry is in use and cannot be deleted.", "Part Library entry not found.", "Part Library entry not found", "Part Library entry not found for ID: {id}.", "Part Library entry not found for part number: {part number}.", "Part Library entry missing category." and "A part from the Part Library must have Vendor as its source."”
- PRD §8 User Feedback Summary (Part Library entry in use deleted): “"This Part Library entry is in use and cannot be deleted."”
- PRD §8 User Feedback Summary (Part Library entry in use deleted): “Error toast, fades after 3 seconds”
- PRD §8 User Feedback Summary (context note): “every refusal sent by the system, the rows that fade after 3 seconds, also shows a second, smaller line under the message: "Please try to resolve this."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Deleting a Part Library entry that a part uses is refused
Test case: C425620, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role (holds 'Part Library & Inventory' Delete).
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-A] (e.g. ZZAUTOTEST-PL-INUSE-01), a Part Library entry with an inventory part behind it at [Loc-1].
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [PN-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL in use" and Part Number ZZAUTOTEST-PL-INUSE-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-A] = the part number you typed.
- Check the setup worked: [PN-A]'s Part Library detail page shows "Total parts" 1.



========== C425621 · section 20479 (S12 Rename Catalog to Part Library)
TITLE: Saving a Part Library entry that was deleted in another tab is refused
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role (holds 'Part Library & Inventory' Delete).
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-O] (e.g. ZZAUTOTEST-PL-GONE-01), a Part Library entry with nothing behind it ("Total parts" 0).
--- STEPS
- In browser tab 1, click Parts in the top bar, then Part Library in the left menu.
- In tab 1, type [PN-O] in the Search box.
- In tab 1, click the [PN-O] row.
- In tab 1, click the edit icon beside the entry's name in the Part details panel.
- In tab 1, replace the Description with "ZZAUTOTEST PL gone entry edited" (do not save yet).
- Open a second browser tab on the same ShopView address and go to Parts → Part Library (tab 2).
- In tab 2, type [PN-O] in the Search box.
- In tab 2, click the [PN-O] row.
- In tab 2, click the edit icon.
- In tab 2, click Delete.
- In tab 2, confirm the deletion.
- Go back to tab 1 without reloading it.
- In tab 1, click Save.
- In tab 1, type [PN-O] in the Part Library Search box.
--- EXPECTED
Expected results
- Step 11: In tab 2 the entry is deleted ("Library part deleted successfully.").
- Step 13: The save is refused with a red error message. Its text is "Failed to save library part." and/or one of the Part Library refusals "Part Library entry not found.", "Part Library entry not found for ID: …" or "Part Library entry not found for part number: ZZAUTOTEST-PL-GONE-01." (with your [PN-O]). No message uses the word "catalog".
- Step 14: No entry is listed for [PN-O]: the failed save did not create the entry again.
Source — where this behaviour comes from
Epic SV-10647; story SV-10825 (Story 12, Call the Shared Parts List the Part Library); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S12-R4, S12-R11, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 7.2 (An entry opens its detail page). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S12-R4: “The failure message when saving a Part Library entry reads "Failed to save library part."”
- S12-R11: “Refusals that name the shared list read: "This Part Library entry is in use and cannot be deleted.", "Part Library entry not found.", "Part Library entry not found", "Part Library entry not found for ID: {id}.", "Part Library entry not found for part number: {part number}.", "Part Library entry missing category." and "A part from the Part Library must have Vendor as its source."”
- PRD §8 User Feedback Summary (Part Library entry missing): “"Part Library entry not found.", "Part Library entry not found for ID: {id}." or "Part Library entry not found for part number: {part number}."”
- PRD §8 User Feedback Summary (Part Library entry missing): “Error toast, fades after 3 seconds”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Saving a Part Library entry that was deleted in another tab is refused
Test case: C425621, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role (holds 'Part Library & Inventory' Delete).
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-O] (e.g. ZZAUTOTEST-PL-GONE-01), a Part Library entry with nothing behind it ("Total parts" 0).
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [PN-O]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL gone entry" and Part Number ZZAUTOTEST-PL-GONE-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-O] = the part number you typed.
- Open [PN-O] from the Active tab and click Delete Part (the part is on no work order, so it is deleted at once).
- Open Parts → Part Library and search [PN-O]. If the entry is still listed with "Total parts" 0, it is the entry for this case. If it has gone with the part, use instead an entry created before the deployment with Parts → Catalog → New Catalog Part (e.g. ZZAUTOTEST-PL-GONE-01-OLD) and never stocked.
- Check the setup worked: [PN-O]'s detail page shows "Total parts" 0.



========== C425623 · section 20479 (S12 Rename Catalog to Part Library)
TITLE: A part lookup result from the shared list shows Part Library as its source
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-A] (e.g. ZZAUTOTEST-PL-LOOKSRC-01) stocked at [Loc-1] with quantity 5; an open work order [WO-1] for a ZZAUTOTEST customer with one line.
--- STEPS
- In the top bar click Work Orders.
- Open [WO-1].
- On the [WO-1] line, click + Add Part in its Parts row.
- In New Part Request, type ZZAUTOTEST-PL-LOOKSRC in Part Number.
- Read the results offered for [PN-A].
- Close the dialog without saving.
--- EXPECTED
Expected results
- Step 5: [PN-A] is offered twice: once from inventory, whose second line reads "Inventory Qty: 5" with its unit, and once from the shared list, whose second line reads "Part Library". No result reads "Catalog".
Source — where this behaviour comes from
Epic SV-10647; story SV-10825 (Story 12, Call the Shared Parts List the Part Library); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S12-R10, read 8 Oct 2026; design canvas board 6.1 (While active: GREASETUBE is found), board 6.0 (Before: the part lookup today). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S12-R10: “A part lookup result that comes from the shared list shows its source as "Part Library".”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A part lookup result from the shared list shows Part Library as its source
Test case: C425623, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-A] (e.g. ZZAUTOTEST-PL-LOOKSRC-01) stocked at [Loc-1] with quantity 5; an open work order [WO-1] for a ZZAUTOTEST customer with one line.
# Part 1. Setup for manual QA tester
- Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
- Create [PN-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL lookup source" and Part Number ZZAUTOTEST-PL-LOOKSRC-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-A] = the part number you typed.
- Create an open work order: in the top bar click Work Orders, click New, and in the New Work Order dialog use the Add button beside Customer to create a customer (e.g. "ZZAUTOTEST PL lookup source customer") and the Add button beside Asset to create an asset for it (e.g. unit "ZZAUTOTEST PL lookup source-UNIT"); click Save, and click Create if a confirmation appears. [WO-1] = the work order number shown.
- On [WO-1] click New Line, type a Title (e.g. "ZZAUTOTEST PL lookup source line"), and click Save & Close.
- Check the setup worked: [WO-1] is open with one line and [PN-A] is on the Active tab with quantity 5.



========== C425624 · section 20479 (S12 Rename Catalog to Part Library)
TITLE: A special-order lookup result shows Part Library and its vendor
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role.
- Locations: [Loc-1] and [Loc-2] (Setup creates [Loc-2] if only one exists).
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-B] (e.g. ZZAUTOTEST-PL-SOSRC-01) stocked only at [Loc-2], with vendor [Vendor-A] (any existing vendor); an open work order [WO-1] at [Loc-1] for a ZZAUTOTEST customer with one line.
--- STEPS
- With [Loc-1] picked, open [WO-1] from Work Orders.
- Click + Add Part in the line's Parts row.
- In New Part Request, type ZZAUTOTEST-PL-SOSRC in Part Number.
- Read the result offered for [PN-B] and its second line.
- Close the dialog without saving.
--- EXPECTED
Expected results
- Step 4: [PN-B] is not stocked at [Loc-1], so it is offered from the shared list as a special order, and its source reads "Part Library · [Vendor-A-Name]" (the words Part Library, a middle dot, then the vendor's name). No result reads "Catalog".
Source — where this behaviour comes from
Epic SV-10647; story SV-10825 (Story 12, Call the Shared Parts List the Part Library); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S12-R14, read 8 Oct 2026; design canvas board 6.1 (While active: GREASETUBE is found), board 6.0 (Before: the part lookup today). Tech plan "Parts Lifecycle Update — Technical Implementation Plan" (7 Oct 2026), Phase 7 frontend changes (PartSelect). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S12-R14: “A special-order lookup result shows its source as "Part Library · {vendor}".”
- Tech plan Phase 7 (Frontend changes, PartSelect.vue): “the special-order lookup reads "Part Library · {vendor}" (S12-R10, S12-R14)”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A special-order lookup result shows Part Library and its vendor
Test case: C425624, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role.
- Locations: [Loc-1] and [Loc-2] (Setup creates [Loc-2] if only one exists).
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [PN-B] (e.g. ZZAUTOTEST-PL-SOSRC-01) stocked only at [Loc-2], with vendor [Vendor-A] (any existing vendor); an open work order [WO-1] at [Loc-1] for a ZZAUTOTEST customer with one line.
# Part 1. Setup for manual QA tester
- Sign in as [User-A].
- If the location selector in the top bar lists only one location, create a second one: Settings → Locations → New Location, type a name (e.g. ZZAUTOTEST-PL-LOC-B) and the other required fields, and save. [Loc-2] = the second location; [Loc-1] = the one you work in first.
- [Vendor-A] = any vendor listed under Parts → Vendors (e.g. the first one); [Vendor-A-Name] = its name.
- Pick [Loc-2]. Create [PN-B]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL special order source" and Part Number ZZAUTOTEST-PL-SOSRC-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, pick [Vendor-A] in Vendor, and click Save. [PN-B] = the part number you typed.
- Pick [Loc-1].
- Create an open work order: in the top bar click Work Orders, click New, and in the New Work Order dialog use the Add button beside Customer to create a customer (e.g. "ZZAUTOTEST PL special order source customer") and the Add button beside Asset to create an asset for it (e.g. unit "ZZAUTOTEST PL special order source-UNIT"); click Save, and click Create if a confirmation appears. [WO-1] = the work order number shown.
- On [WO-1] click New Line, type a Title (e.g. "ZZAUTOTEST PL special order source line"), and click Save & Close.
- Check the setup worked: at [Loc-1] the Inventory list does not list [PN-B]; at [Loc-2] it does.



========== C425625 · section 20479 (S12 Rename Catalog to Part Library)
TITLE: Release day leaves every role's permissions as they were
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role; [User-B], a staff login you hold that has the custom role [Role-P] (e.g. ZZAUTOTEST-PL-PERMS).
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [Role-P] created before the deployment with, under Catalog and Inventory, View and Create & Edit ticked and Delete unticked; [Ticks-Before] = a screenshot or written list of every permission ticked in [Role-P] before the deployment.
--- STEPS
- After the deployment, sign in on the Part Lifecycle build as [User-A].
- In the left menu open Settings, then Roles & Permissions.
- Click the edit (pencil) button of [Role-P].
- Compare every card with [Ticks-Before].
- Click Cancel.
- Sign in as [User-B].
- Open Parts → Inventory.
- Click any part row.
--- EXPECTED
Expected results
- Step 4: Exactly the same permissions are ticked as in [Ticks-Before]; under the renamed group "Part Library and Inventory", View and Create & Edit are ticked and Delete is not. No permission was added, removed or moved.
- Step 7: [User-B] can open the Inventory list, as before the deployment.
- Step 8: The part dialog opens for [User-B] without a Delete Part button, as before the deployment (no Delete permission).
Source — where this behaviour comes from
Epic SV-10647; story SV-10825 (Story 12, Call the Shared Parts List the Part Library); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S12-N1, read 8 Oct 2026; design canvas (no board shows this screen). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S12-N1: “No permission is added, removed or re-keyed. Every user's access on release day is identical to the day before.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Release day leaves every role's permissions as they were
Test case: C425625, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role; [User-B], a staff login you hold that has the custom role [Role-P] (e.g. ZZAUTOTEST-PL-PERMS).
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: [Role-P] created before the deployment with, under Catalog and Inventory, View and Create & Edit ticked and Delete unticked; [Ticks-Before] = a screenshot or written list of every permission ticked in [Role-P] before the deployment.
# Part 1. Setup for manual QA tester
- Before the deployment, on the earlier build, sign in as [User-A]: Settings → Roles & Permissions → Create custom role → Skip → Role name (e.g. ZZAUTOTEST-PL-PERMS) → Parts Department on, Catalog and Inventory View and Create & Edit ticked, Delete unticked → Create. [Role-P] = this role.
- Still before the deployment, open [Role-P] in the editor and take a screenshot of every card (or write down every ticked permission). [Ticks-Before] = that record.
- Still before the deployment, Settings → Staff → open a staff member whose login you hold (not [User-A]) → Edit Staff Member → write down their role ([Old-Role], to put back after the test) → Role = [Role-P] → save. [User-B] = this staff member. Sign in as [User-B] and note that Parts → Inventory opens and an inventory part dialog shows no Delete button.
- If steps 1 to 3 could not be done before the deployment, this case cannot be run: write "no pre-deployment record, not checked" in the result comment.
- Check the setup worked: [Ticks-Before] exists and [User-B] has [Role-P].



========== C425626 · section 20479 (S12 Rename Catalog to Part Library)
TITLE: Release day keeps saved names that contain the word Catalog
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: created before the deployment: a custom role [Role-C] named e.g. "ZZAUTOTEST PL Catalog Clerk" and a part [PN-C] (e.g. ZZAUTOTEST-PL-CATWORD-01) with the description "ZZAUTOTEST PL Catalog rack".
--- STEPS
- Sign in on the Part Lifecycle build as [User-A].
- Pick [Loc-1] in the location selector in the top bar.
- In the left menu open Settings, then Roles & Permissions.
- Find [Role-C] in the list and read its name.
- In the top bar click Parts, then click Inventory in the left menu.
- Type [PN-C] in the Search box.
- Read the description of [PN-C].
- Click Part Library in the left menu.
- Type [PN-C] in the Search box.
- Read the entry's description.
--- EXPECTED
Expected results
- Step 4: The role is still named "ZZAUTOTEST PL Catalog Clerk", word for word.
- Step 7: The part's description is still "ZZAUTOTEST PL Catalog rack".
- Step 10: The Part Library entry's description is still "ZZAUTOTEST PL Catalog rack": saved data was not renamed; only the screen's own words changed.
Source — where this behaviour comes from
Epic SV-10647; story SV-10825 (Story 12, Call the Shared Parts List the Part Library); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S12-N3, read 8 Oct 2026; design canvas (no board shows this screen). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S12-N3: “No stored data is renamed. The story is confined to text a user reads on screen.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Release day keeps saved names that contain the word Catalog
Test case: C425626, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: created before the deployment: a custom role [Role-C] named e.g. "ZZAUTOTEST PL Catalog Clerk" and a part [PN-C] (e.g. ZZAUTOTEST-PL-CATWORD-01) with the description "ZZAUTOTEST PL Catalog rack".
# Part 1. Setup for manual QA tester
- Before the deployment, on the earlier build, sign in as [User-A]: Settings → Roles & Permissions → Create custom role → Skip → Role name "ZZAUTOTEST PL Catalog Clerk" → tick any one permission → Create. [Role-C] = this role.
- Still before the deployment: Parts → Catalog → New Catalog Part with Part Number ZZAUTOTEST-PL-CATWORD-01 and Description "ZZAUTOTEST PL Catalog rack", then Parts → Inventory → New Inventory Part picking that catalog part, Quantity 1, Save. [PN-C] = that part number.
- If steps 1 and 2 could not be done before the deployment, this case cannot be run: write "no pre-deployment data, not checked" in the result comment.
- Check the setup worked: after the deployment, [Role-C] and [PN-C] still exist (search for them).



========== C154761 · section 54275 (Retire OR retest)
TITLE: A single part can be deactivated from its edit dialog footer
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- You are on the Parts -> Inventory page on the build under test, with permission to view inventory parts.
- You hold the "Part Library & Inventory - Delete" permission (needed to change status/tracking).
- A few inventory parts tagged as throwaway test data (for example part number "ZZAUTOTEST-PKG-1", name "ZZAUTOTEST package part").
--- STEPS
- Open an active part's Edit Inventory Part dialog.
- Read the deactivate control at the footer - its label, position and style.
- Repeat on an inactive part.
--- EXPECTED
Expected results
- A single part can be deactivated from its edit dialog without entering the mode; the control reads "Deactivate" on an active part and "Activate" on an inactive one.
- It sits at the left end of the dialog footer, apart from Delete and Save (which stay at the right), and is blue text with no border and no fill in both states.
Source - where this behaviour comes from
Epic SV-10647; "Parts Lifecycle Update" PRD (Confluence 829227015, IN REVIEW 2026-09-09), Story 2 (Deactivate parts); design canvas Vz6rprcWyP16tYxzM1kdeE; read 30 Sep 2026. Source-verified 30 September 2026 against an IN-REVIEW spec; not yet build-verified.
Exact quotes from the source (for reproducibility)
- S2-R17: “A single part can also be deactivated from its edit dialog, without entering the mode. That control is labelled "Deactivate" on an active part and "Activate" on an inactive one.”
- S2-R18: “That control sits at the left end of the dialog footer, apart from Delete and Save, which stay at the right. It is blue text with no border and no fill, in both states.”
AUTOMATION: HOLD - authored from an IN-REVIEW PRD (Confluence 829227015, status "In review" 2026-09-09) - PROVISIONAL; story-level Jira/design largely TBD; no QA build yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A single part can be deactivated from its edit dialog footer
Test case: C154761, Founder Mode / Part Lifecycle (Retire OR retest). Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• You are on the Parts -> Inventory page on the build under test, with permission to view inventory parts.
• You hold the "Part Library & Inventory - Delete" permission (needed to change status/tracking).
• A few inventory parts tagged as throwaway test data (for example part number "ZZAUTOTEST-PKG-1", name "ZZAUTOTEST package part").
# Part 1. Setup for manual QA tester
The case's full original preconditions, with every step for setting them up:
1. You are on the Parts -> Inventory page on the build under test, with permission to view inventory parts.
2. You hold the "Part Library & Inventory - Delete" permission (needed to change status/tracking).
3. Seed a few inventory parts (tag throwaway data "ZZAUTOTEST", e.g. part number "ZZAUTOTEST-PKG-1", name "ZZAUTOTEST package part") via New Inventory Part.



========== C425602 · section 54275 (Retire OR retest)
TITLE: A server error during a bulk change shows Failed to update part status
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: at [Loc-1], 1 active part [Part-A] (e.g. ZZAUTOTEST-PL-SRVERR-01).
--- STEPS
- In the top bar click Parts, then click Inventory in the left menu (Active tab).
- Type ZZAUTOTEST-PL-SRVERR in the Search box.
- Click the ⋮ actions menu button in the toolbar (to the left of New Inventory Part).
- Click Deactivate parts.
- Click the [Part-A] row.
- Click the Deactivate button on the bar.
- Click Deactivate in the "Deactivate parts?" confirmation.
--- EXPECTED
Expected results
- Step 7: If the server fails the change at this moment, a red error toast reads "Failed to update part status" with the second line "Please try again or contact support for help", and it closes on its own after about 7 seconds; the confirmation stays open (tech plan).
- Step 7: A server failure cannot be produced by hand: write "not checked by hand" in the result comment. When the server answers normally, the toast reads "1 part updated." instead.
Source — where this behaviour comes from
Epic SV-10647; story SV-10815 (Story 2, Deactivate Parts in Bulk); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), §8 User Feedback Summary, read 8 Oct 2026; design canvas board 4.4 (Confirm). Tech plan "Parts Lifecycle Update — Technical Implementation Plan" (7 Oct 2026), Phase 3 (Key code changes). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- PRD §8 User Feedback Summary (Bulk change fails (server error)): “"Failed to update part status" with "Please try again or contact support for help"”
- PRD §8 User Feedback Summary (Bulk change fails (server error)): “Error toast, fades after 7 seconds”
- Tech plan Phase 3 (Key code changes): “5xx → "Failed to update part status" / "Please try again or contact support for help", timeout 7000; rethrow keeps the confirm open”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A server error during a bulk change shows Failed to update part status
Test case: C425602, Founder Mode / Part Lifecycle (Retire OR retest). Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: [User-A], signed in with the Admin role. Admin holds the 'Part Library & Inventory' permissions View, Create & Edit and Delete by default (Settings → Roles & Permissions); Delete is what allows Deactivate parts and Activate parts.
• Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
• Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
• Data: at [Loc-1], 1 active part [Part-A] (e.g. ZZAUTOTEST-PL-SRVERR-01).
# Part 1. Setup for manual QA tester
1. Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
2. Create [Part-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL server error A" and Part Number ZZAUTOTEST-PL-SRVERR-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [Part-A] = the part number you typed.
3. Check the setup worked: the Active tab searched for [Part-A] lists 1 row.



========== C425622 · section 54275 (Retire OR retest)
TITLE: Part request refusals about the Part Library use Part Library wording
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [User-A], Admin role.
- Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
- Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
- Data: an open work order [WO-1] for a ZZAUTOTEST customer with one line; [PN-A] (e.g. ZZAUTOTEST-PL-REQMSG-01) stocked at [Loc-1].
--- STEPS
- In the top bar click Work Orders.
- Open [WO-1].
- On the [WO-1] line, click + Add Part in its Parts row.
- In New Part Request, type [PN-A] in Part Number.
- Pick the result whose second line reads "Part Library".
- Click Save Part.
--- EXPECTED
Expected results
- Step 6: The screen always sends a category and the Vendor source for a part from the Part Library, so the part request is saved.
- Step 6: The refusals "Part Library entry missing category." and "A part from the Part Library must have Vendor as its source." (red error toasts that close after about 3 seconds) only appear for a request that reaches the system another way. They cannot be produced by hand: write "not checked by hand" in the result comment.
Source — where this behaviour comes from
Epic SV-10647; story SV-10825 (Story 12, Call the Shared Parts List the Part Library); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S12-R11, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 6.1 (While active: GREASETUBE is found). Tech plan "Parts Lifecycle Update — Technical Implementation Plan" (7 Oct 2026), §1 Clarifications Q9. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S12-R11: “Refusals that name the shared list read: "This Part Library entry is in use and cannot be deleted.", "Part Library entry not found.", "Part Library entry not found", "Part Library entry not found for ID: {id}.", "Part Library entry not found for part number: {part number}.", "Part Library entry missing category." and "A part from the Part Library must have Vendor as its source."”
- PRD §8 User Feedback Summary (Part request from a Part Library entry with no category): “"Part Library entry missing category."”
- PRD §8 User Feedback Summary (Part request from a Part Library entry with no category): “Error toast, fades after 3 seconds”
- PRD §8 User Feedback Summary (Part request from a Part Library entry with a source other than Vendor): “"A part from the Part Library must have Vendor as its source."”
- PRD §8 User Feedback Summary (Part request from a Part Library entry with a source other than Vendor): “Error toast, fades after 3 seconds”
- Tech plan §1 Clarifications (Q9 S12-R11 copy): “Delete refusal "This Part Library entry is in use and cannot be deleted."; the Vendor-source message is kept and renamed”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Part request refusals about the Part Library use Part Library wording
Test case: C425622, Founder Mode / Part Lifecycle (Retire OR retest). Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: [User-A], Admin role.
• Location: [Loc-1], any one location [User-A] can pick in the location selector in the top bar.
• Browser: a desktop browser window at least 1280 pixels wide (parts management is desktop and tablet only).
• Data: an open work order [WO-1] for a ZZAUTOTEST customer with one line; [PN-A] (e.g. ZZAUTOTEST-PL-REQMSG-01) stocked at [Loc-1].
# Part 1. Setup for manual QA tester
1. Sign in as [User-A] and pick [Loc-1] in the location selector in the top bar.
2. Create [PN-A]: go to Parts → Inventory, click New Inventory Part, type Description "ZZAUTOTEST PL request message" and Part Number ZZAUTOTEST-PL-REQMSG-01 (examples), pick any Category (e.g. the first one offered), type Cost (e.g. 10.00) and Sell Price (e.g. 20.00), leave "Track quantities and cost of goods" on, keep the default bin with Quantity 5, and click Save. [PN-A] = the part number you typed.
3. Create an open work order: in the top bar click Work Orders, click New, and in the New Work Order dialog use the Add button beside Customer to create a customer (e.g. "ZZAUTOTEST PL request message customer") and the Add button beside Asset to create an asset for it (e.g. unit "ZZAUTOTEST PL request message-UNIT"); click Save, and click Create if a confirmation appears. [WO-1] = the work order number shown.
4. On [WO-1] click New Line, type a Title (e.g. "ZZAUTOTEST PL request message line"), and click Save & Close.
5. Check the setup worked: [WO-1] is open with one line and [PN-A] is on the Active tab.



========== C425629 · section 54275 (Retire OR retest)
TITLE: A tracked part sent with no bin is refused with the bin message
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
- Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
- Data: no part numbered ZZAUTOTEST-PL-NOBIN-01 exists at [Loc-1]; the import file in Setup tries to create it.
- Most of this case cannot be checked by hand: the New Inventory Part and Edit Inventory Part dialogs never send a tracked part without a bin. The parts CSV import is the only manual way tried here.
--- STEPS
- In Settings → Data Import → Inventory, upload [File-1].
- Run the import.
- Read the message the import shows for the [Part-A] row.
- Go to Parts → Inventory and search [Part-A].
--- EXPECTED
Expected results
- Step 3: The row is refused with "At least one bin must be provided." (shown as an error message, with the smaller second line "Please try to resolve this." where the import shows system messages). If the import reports the row in its own words instead, this part cannot be checked by hand; write "not checked by hand" and the import's text in the result comment.
- Step 4: No [Part-A] part exists at [Loc-1].
- Steps 1 to 4: The other refusals of this rule cannot be checked by hand: a tracked part sent with bins but none marked as the default ("At least one bin must be marked as default.") and a request to turn tracking on for a part with no bin ("At least one bin must be provided."). Write "not checked by hand" for them in the result comment.
Source — where this behaviour comes from
Epic SV-10647; story SV-10817 (Story 4, Create an Untracked Part); story SV-10818 (Story 5, Change Tracking on an Existing Part); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S4-N1, S4-N2, S5-N1 and §8 User Feedback Summary (Tracked part saved with no bin; Tracked part saved with no default bin), read 8 Oct 2026; design canvas board 1.1 (New Inventory Part opens). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S4-N1: “If a tracked part reaches the system with no bin location, the save is refused with "At least one bin must be provided."”
- S4-N2: “If a tracked part reaches the system with bin locations but none marked as the default, the save is refused with "At least one bin must be marked as default."”
- S5-N1: “If a request to turn tracking on reaches the system with no bin location, it is refused with "At least one bin must be provided." The dialog never sends one, because of S5-R7.”
- PRD §8 User Feedback Summary (Tracked part saved with no bin): “"At least one bin must be provided."”
- PRD §8 User Feedback Summary (Tracked part saved with no bin): “Error toast, fades after 3 seconds”
- PRD §8 User Feedback Summary (Tracked part saved with no default bin): “"At least one bin must be marked as default."”
- PRD §8 User Feedback Summary (Tracked part saved with no default bin): “Error toast, fades after 3 seconds”
- PRD §8 context note: “every refusal sent by the system, the rows that fade after 3 seconds, also shows a second, smaller line under the message: "Please try to resolve this."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A tracked part sent with no bin is refused with the bin message
Test case: C425629, Founder Mode / Part Lifecycle (Retire OR retest). Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: you are signed in as an Admin, or as a user whose role has View, Create & Edit and Delete ticked in the Part Library and Inventory group of Settings → Roles & Permissions and who can see costs and prices.
• Location: [Loc-1] = the location shown in the location switcher in the top bar when you start. Every part in this case is at [Loc-1].
• Data: no part numbered ZZAUTOTEST-PL-NOBIN-01 exists at [Loc-1]; the import file in Setup tries to create it.
• Most of this case cannot be checked by hand: the New Inventory Part and Edit Inventory Part dialogs never send a tracked part without a bin. The parts CSV import is the only manual way tried here.
# Part 1. Setup for manual QA tester
1. Sign in, pick [Loc-1] in the location switcher in the top bar, and open Parts → Inventory (Active tab).
2. Go to Settings → Data Import → Inventory and download the import template.
3. Fill one row: part number [Part-A] = ZZAUTOTEST-PL-NOBIN-01, description ZZAUTOTEST PL NO BIN, any category (e.g. Uncategorized), cost 5.00, and leave every bin location and bin quantity cell empty. Save it as [File-1].
4. Check the setup worked: [File-1] has one data row for [Part-A] with no bin. If the template has no way to leave the bin out (for example the bin cell is required by the template itself), write "not checked by hand" for Steps 1 to 3 and go to Step 4.



========== C425701 · section 54275 (Retire OR retest)
TITLE: A rename made through the public API follows the part window rules
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: part [Part-A] stocked at [Loc-1] and [Loc-2], with an open purchase order line [PO-1] at [Loc-1].
- State this case relies on: [Part-A] has been renamed to [Part-A-new] by a connected system through the ShopView public API. This cannot be done by hand.
--- STEPS
- At [Loc-1]: click the clock icon (Part History) on the [Part-A-new] row.
- Pick [Loc-2] → Parts → Inventory → search [Part-A-new] → click the clock icon.
- Pick [Loc-1] → Parts → Purchase Orders → open [PO-1].
- Parts → Part Library → type [Part-A] in the search.
--- EXPECTED
Expected results
- Step 1: the entry reads "Part number updated | Original number: [Part-A] | New number: [Part-A-new] | Changed through: Public API" (no "Changed at").
- Step 2: the [Loc-2] entry ends the same way, with "| Changed through: Public API".
- Step 3: the open [PO-1] line reads [Part-A-new].
- Step 4: no entry has the old number (renamed in place, no new entry).
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R19d, S10-R25a, read 8 Oct 2026; design canvas: no board shows this behaviour; tech plan §5 public API PATCH row. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R19d: “A change to a part's number or description made through the public API follows the same rules as the part dialog: S13-R14, S13-R15, S13-R18, S13-R19, S13-N1, S13-N7 and S10-R23 to S10-R25.”
- S10-R25a: “Entries written for a change made through the public API end with "| Changed through: Public API" at every location, in place of "| Changed at: {location}".”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A rename made through the public API follows the part window rules
Test case: C425701, Founder Mode / Part Lifecycle (Retire OR retest). Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
• [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
• [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
• Data: part [Part-A] stocked at [Loc-1] and [Loc-2], with an open purchase order line [PO-1] at [Loc-1].
• State this case relies on: [Part-A] has been renamed to [Part-A-new] by a connected system through the ShopView public API. This cannot be done by hand.
# Part 1. Setup for manual QA tester
1. Write down: [Part-A] = ZZAUTOTEST-PL-PUBAPI-01 and [Part-A-new] = ZZAUTOTEST-PL-PUBAPINEW-02 (examples).
2. Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
3. At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Public API → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
4. Pick [Loc-2]: create [Part-A] there the same way, then pick [Loc-1] again.
5. Parts → Purchase Orders → New Purchase Order → any vendor → pick the [Part-A] result with an Inventory Qty → Quantity 1 → save. [PO-1] = its number.
6. The rename to [Part-A-new] through the public API is made by the connected system — this part cannot be checked by hand; if no connected system made it, mark the case Blocked with the comment 'not checked by hand'.
7. Check the setup worked: Parts → Inventory at [Loc-1] → search [Part-A-new] → one row.



========== C425723 · section 54275 (Retire OR retest)
TITLE: Part window server errors show the failure messages
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active part [Part-A].
- State this case relies on: the system fails while saving (a server error). This cannot be made by hand.
--- STEPS
- Click the [Part-A] row, change Sell Price to 25.00 and click Save.
- Click the [Part-A] row, pick Inactive, click Save, then Deactivate.
- Click the [Part-A] row and click Delete Part.
--- EXPECTED
Expected results
- Step 1: on a server failure a red message "Failed to save part." with "Please try again." fades after about 3 seconds — this part cannot be checked by hand; write 'not checked by hand' in the result comment.
- Step 2: on a server failure a red message "Failed to set this part inactive" with "Please try again or contact support for help" fades after about 7 seconds — this part cannot be checked by hand; write 'not checked by hand' in the result comment.
- Step 3: on a server failure a red message "Failed to delete part." with "Please try again." fades after about 3 seconds — this part cannot be checked by hand; write 'not checked by hand' in the result comment.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), §8 User Feedback Summary, read 8 Oct 2026; design canvas: no board shows this behaviour. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- PRD §8 User Feedback Summary (Part save fails (server error)): “"Failed to save part." with "Please try again."”
- PRD §8 User Feedback Summary (Part save fails (server error)) — Behavior: “Error toast, fades after 3 seconds”
- PRD §8 User Feedback Summary (Status change from the part dialog fails (server error)): “"Failed to set this part inactive" / "Failed to set this part active", with "Please try again or contact support for help"”
- PRD §8 User Feedback Summary (Status change from the part dialog fails (server error)) — Behavior: “Error toast, fades after 7 seconds”
- PRD §8 User Feedback Summary (Part delete fails (server error)): “"Failed to delete part." with "Please try again."”
- PRD §8 User Feedback Summary (Part delete fails (server error)) — Behavior: “Error toast, fades after 3 seconds”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Part window server errors show the failure messages
Test case: C425723, Founder Mode / Part Lifecycle (Retire OR retest). Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
• [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
• Data at [Loc-1]: one active part [Part-A].
• State this case relies on: the system fails while saving (a server error). This cannot be made by hand.
# Part 1. Setup for manual QA tester
1. Write down: [Part-A] = ZZAUTOTEST-PL-SRVERR-01 (example).
2. Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
3. At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Server Error → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
4. Check the setup worked: search [Part-A] → one row.



========== C425755 · section 54275 (Retire OR retest)
TITLE: Public API refuses to create a part whose number already exists
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Data: [Part-A] = one tracked part at [Loc-1].
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- On Parts → Inventory, Active tab, search [Part-A].
--- EXPECTED
Expected results
- Step 1: [Part-A] is listed exactly once. The refusal itself (creating a part through the public API with [Part-A]'s number) cannot be checked by hand: write 'not checked by hand' in the result comment.
Source — where this behaviour comes from
Epic SV-10647; story SV-10822 (Story 9, Inactive Parts Cannot Be Added to New Work); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S9-E9, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S9-E9: “The public API refuses to create a part whose number already exists.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Public API refuses to create a part whose number already exists
Test case: C425755, Founder Mode / Part Lifecycle (Retire OR retest). Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
• Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
• Data: [Part-A] = one tracked part at [Loc-1].
• Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
1. Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL APIDUP PART), Part Number (e.g. ZZAUTOTEST-PL-APIDUP-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
2. [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-APIDUP-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL APIDUP PART).
3. Check the setup worked: the Active tab lists [Part-A] once.



========== C425776 · section 54275 (Retire OR retest)
TITLE: Public API rename is recorded as Changed through Public API
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
- Location: [Loc-2] = a second location.
- Data: [Part-A] = one tracked part stocked at [Loc-1] and [Loc-2].
- Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
--- STEPS
- Open [Part-A]'s Part History at [Loc-1] and at [Loc-2].
--- EXPECTED
Expected results
- Step 1: The history opens at both locations. The entries a public API rename writes ("… | Changed through: Public API" at every location, in place of "| Changed at: …") cannot be produced by hand: write 'not checked by hand' in the result comment.
Source — where this behaviour comes from
Epic SV-10647; story SV-10823 (Story 10, Confirming and Recording a Status Change); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S10-R25a, read 8 Oct 2026; design canvas none. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S10-R25a: “Entries written for a change made through the public API end with "| Changed through: Public API" at every location, in place of "| Changed at: {location}".”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Public API rename is recorded as Changed through Public API
Test case: C425776, Founder Mode / Part Lifecycle (Retire OR retest). Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
• User: [Admin] = you, signed in with the Admin role, which by default has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
• Location: [Loc-1] = the location picked in the top-bar location switcher at the start; every step runs at [Loc-1] unless it names another location.
• Location: [Loc-2] = a second location.
• Data: [Part-A] = one tracked part stocked at [Loc-1] and [Loc-2].
• Names and numbers marked (e.g. …) are examples only. What must hold is the status (active or inactive), tracking, quantity and link described above.
# Part 1. Setup for manual QA tester
1. Go to Settings → Locations, add a location (e.g. "ZZAUTOTEST PL APIHIST Loc") and save. [Loc-2] = that location.
2. Go to Settings → Staff, open [Admin] and make sure [Loc-2] is one of the locations [Admin] can use; save. [Loc-2] now shows in the top-bar location switcher.
3. Go to Parts → Inventory, click "New Inventory Part" and fill in Description (e.g. ZZAUTOTEST PL APIHIST PART), Part Number (e.g. ZZAUTOTEST-PL-APIHIST-01), Category (e.g. Uncategorized), Cost (e.g. $10.00), Sell Price (e.g. $20.00); leave "Track quantities and cost of goods" on; set the default bin's Quantity to 4; click Save.
4. [Part-A] = the part number you typed (e.g. ZZAUTOTEST-PL-APIHIST-01); [Desc-A] = the description you typed (e.g. ZZAUTOTEST PL APIHIST PART).
5. Switch to [Loc-2] and create a part with exactly the same Part Number [Part-A] and Description [Desc-A].
6. Check the setup worked: [Part-A] is listed at both locations.

