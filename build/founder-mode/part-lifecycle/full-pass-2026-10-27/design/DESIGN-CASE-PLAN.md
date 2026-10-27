# Part Lifecycle — "Design — how it looks" case plan (Phase D draft, 27 Oct 2026)

New TestRail section **"Design — how it looks"** under Part Lifecycle 20439 (the coordinator creates it). Keys D-nn, no C-id
yet. Every case follows the QA lead's pattern (Rule 117 fourteenth and fifteenth amendments): title starts "Design: ", short
plain preconditions (sign in, the records the screen needs, "Use a desktop browser at least 1440 pixels wide", "Open board
<n> of the design to compare"), one action per step, "Step N:" results that say what is seen, then the PRD quotes with
From: lines, "References from Design" (board names, attached board pictures, the design's own notes quoted) and the
AUTOMATION line last. Expected look: the PRD where it speaks; the named board where the PRD is silent (Rule 126 point 5).
Pixel values a person cannot judge by eye are compared side by side with the board picture at 100% zoom.

**49 cases** · 47 to release when written · 2 held design-version cases (D-33, D-49), marker `AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO` (D-33: the design and the tech plan differ, waiting on the PO).

Boards attached at least once: every one of the 47 target boards (1.1–7.2); the 5 Before boards (1.0/3.0, 2.0, 4.0, 6.0,
7.0) are today's screens and are not a target, except 4.0's column set, which D-01 uses as today's default columns.

## D-01 · Design: Inventory list page looks as in the design  (50 chars)
- **Boards / pictures:** 1.4 Saved and linked to the Part Library entry; 2.3 Saved: the list shows the new values; 2.5 Lethbridge: renamed there too; 5.3 The list says Not Tracked; 4.0 Before: the Inventory list today (column set only)
- **What the tester checks:**
  - Title "Inventory" at the top left of the page, with the tabs Active and Inactive on their own line under it
  - Selected tab text is blue, the other tab is dark text
  - Toolbar on the next line, right side, left to right: Search (magnifier), "Bin Location: All bin locations" with a pin icon and arrow, "Category: All categories" with an arrow, "Supply" with a box icon and arrow, a thin divider, the columns icon, the three-dot button, the blue "New Inventory Part" button at the right end
  - A typed search shows the term and a round clear (x) icon at the right of the search box
  - Column headers in bold, in this order: Description, Part Number, Tags, Category, Manufacturer, Vendor, Bin Location / Quantity, Total Qty, Avg Cost, Core, Sell Price, Min, Max (the same set and order as today's list on board 4.0)
  - A clock-with-arrow history icon sits at the left of rows that have history; there is no checkbox column
  - Bin cells are outlined chips reading bin name, a thin divider and the quantity (for example "PB1 | 7"); tags are grey rounded chips, with a "..." chip when more do not fit
  - Side menu: PARTS section shows Inventory (blue, selected) and Part Library
- **Backed by:** S1-R1; S1-R8; S2-R3; S2-N2; S4-R8; S12-R1; design 4.0 note: "The quantity column reads \"Total Qty\"."
- **Existing live cases that already check part of it:** C154752 (tabs on their own line, toolbar below); C154755 (no checkbox column); C154832 (menu reads Part Library)

## D-02 · Design: Inactive tab selected looks as in the design  (52 chars)
- **Boards / pictures:** 3.5 The Inactive tab
- **What the tester checks:**
  - "Inactive" is blue and "Active" is dark text
  - The toolbar and the column headers are the same as on the Active tab
  - The inactive part's row looks like any active row: no tag or badge on the row
- **Backed by:** S1-R4; S1-R7; context note: "the Inactive tab (Story 1) is what tells active and inactive parts apart on the Inventory list"
- **Existing live cases that already check part of it:** C154752 step 4; C425585

## D-03 · Design: Empty Inactive tab message looks as in the design  (57 chars)
- **Boards / pictures:** 4.10 Branch: no inactive parts
- **What the tester checks:**
  - The column header row still shows
  - Under it, centred, one line of grey text: "No inactive parts at this location."
  - No icon and no rows
- **Backed by:** S1-N1; §8: "In place of the list"
- **Existing live cases that already check part of it:** C425591 (the words)

## D-04 · Design: Search with no matching part looks as in the design  (59 chars)
- **Boards / pictures:** 3.4 Done
- **What the tester checks:**
  - The column header row still shows
  - Centred below it: a magnifier icon in a light grey circle, then dark text "No parts match the search \"<term>\"."
  - The same empty state shows on the Inactive tab when a search leaves it empty
- **Backed by:** S1-N2
- **Existing live cases that already check part of it:** C425592 (which empty state shows)

## D-05 · Design: Actions menu with Deactivate parts looks as in the design  (65 chars)
- **Boards / pictures:** 4.1 The actions menu
- **What the tester checks:**
  - The three-dot button shows a light grey square while its menu is open
  - The menu opens just below the three-dot button, lined up with its right edge, as a white card with a shadow
  - It lists, top to bottom, plain text with no icons: Cycle count, Deactivate parts, Export
  - The menu covers the column headers under it but not the New Inventory Part button
- **Backed by:** S2-R1; S2-R2
- **Existing live cases that already check part of it:** C154754 (entries and order)

## D-06 · Design: Actions menu in bulk mode shows only Export  (51 chars)
- **Boards / pictures:** 4.8 Branch: the menu while the mode is on
- **What the tester checks:**
  - With the bulk bar showing, the menu opens below the three-dot button with one entry: Export
  - The bulk bar stays in place above the toolbar while the menu is open
- **Backed by:** S2-R10b
- **Existing live cases that already check part of it:** C425599

## D-07 · Design: Bulk bar with nothing ticked looks as in the design  (59 chars)
- **Boards / pictures:** 4.2 Mode on
- **What the tester checks:**
  - A near-black bar with rounded corners spans the full width of the list directly under the tabs
  - At its left: a round dark-grey badge with a white "0", the word "selected" in light grey, a thin divider, then a small blue "Deactivate" button that looks dimmed
  - A white X sits at the right end of the bar
  - The search and filter row sits under the bar; New Inventory Part is still shown
  - A checkbox column is the first column, with an empty box in the header and on every row; the history icon column comes next
  - No row is shaded
- **Backed by:** S2-R4; S2-R7; S2-R7a; S2-R7b; S2-R8; S2-R9; tech plan D24 (New Inventory Part stays visible)
- **Existing live cases that already check part of it:** C154757; C425595; C425593; C154762

## D-08 · Design: Two ticked rows in bulk mode look as in the design  (58 chars)
- **Boards / pictures:** 4.3 Two rows ticked
- **What the tester checks:**
  - Each ticked row's box is filled dark grey with a white tick, and the whole row is shaded light grey
  - The header box shows a dash (some rows ticked)
  - The badge reads "2" and the Deactivate button is bright blue (enabled)
  - Small text under the table, at the left: "2 records selected."
  - Hovering a cut-off description shows the full description in a dark tooltip just under the row
- **Backed by:** S2-R5; S2-R7b; design board 4.3 ("2 records selected.", tech plan D24)
- **Existing live cases that already check part of it:** C154756; C154757

## D-09 · Design: Every row ticked on the Inactive tab looks as in the design  (67 chars)
- **Boards / pictures:** 4.6 Inactive tab, Activate parts
- **What the tester checks:**
  - Inactive is the selected tab
  - The header box shows a full tick when every loaded row is ticked
  - The bar reads "2 selected" and its button reads "Activate", in the same blue as Deactivate
  - "2 records selected." shows under the table
- **Backed by:** S3-R1; S3-R2; S2-R6
- **Existing live cases that already check part of it:** C154764; C425594

## D-10 · Design: Over 200 ticked shows its hover text below Deactivate  (61 chars)
- **Boards / pictures:** 4.9 Branch: more than 200 ticked
- **What the tester checks:**
  - The badge widens to hold "630" and the Deactivate button looks dimmed
  - Hovering Deactivate shows a dark grey tooltip "Select 200 parts or fewer." just below the button, over the search box
  - The tooltip does not cover the badge or the word "selected"
  - "630 records selected." shows under the table
- **Backed by:** S2-R8a; §8: "Tooltip on the disabled button"
- **Existing live cases that already check part of it:** C425596 (the words and the limit)

## D-11 · Design: Bulk deactivation confirmation looks as in the design  (61 chars)
- **Boards / pictures:** 4.4 Confirm
- **What the tester checks:**
  - A white dialog opens in the middle of the page and the page behind it is dimmed
  - Its title "Deactivate parts?" is large and bold, with a thin line under the title row
  - Lines in this order: "2 parts selected.", "These parts won't show up ...", "Existing records that use them stay as they are." (a little bolder), "Stock, cost of goods and QuickBooks aren't affected." (grey)
  - A full-width "Note (Optional)" box sits under the lines
  - A thin line above the footer; at the bottom right a white "Cancel" button with a grey outline, then a red "Deactivate" button
- **Backed by:** S10-R2; S10-R3; S10-R4; S10-R5; S10-R9; S10-R10; S10-R11
- **Existing live cases that already check part of it:** C154794; C154795; C425763; C154797; C154799

## D-12 · Design: Bulk reactivation confirmation looks as in the design  (61 chars)
- **Boards / pictures:** 4.7 Confirm the reactivation
- **What the tester checks:**
  - Title "Activate parts?" large and bold
  - Lines: "2 parts selected.", "These parts can be added to new work again.", "Existing records that use them stay as they are." (a little bolder)
  - No grey "Stock, cost of goods ..." line
  - "Note (Optional)" box, then white Cancel and a blue "Activate" button at the bottom right
- **Backed by:** S10-R3; S10-R8; S10-R9; S10-R10; S10-R11
- **Existing live cases that already check part of it:** C425762; C154799

## D-13 · Design: Bulk change success message looks as in the design  (58 chars)
- **Boards / pictures:** 4.5 Done
- **What the tester checks:**
  - A green message box appears at the bottom right with a white tick-in-circle icon, "2 parts updated." and "Close" at its right
  - The bulk bar and the checkbox column are gone; the search term stays in the search box
- **Backed by:** S10-R12; S2-R14; §8: "Success toast, fades on its own"
- **Existing live cases that already check part of it:** C425764; C154759

## D-14 · Design: New Inventory Part window looks as in the design  (56 chars)
- **Boards / pictures:** 1.1 New Inventory Part opens
- **What the tester checks:**
  - A white window in the middle of the page over the dimmed list
  - Title "New Inventory Part" with a grey X at the right of the title row and a thin line under it; no status pill
  - Fields as outlined boxes with grey labels inside: Description (focused, blue outline, small blue label), Part Number, then Vendor, Category and Manufacturer each with a down arrow
  - Cost, Sell Price and Core Charge as three equal boxes on one line
  - Heading "Inventory Tracking" with a small (i) icon; under it a blue switch, on, labelled "Track quantities and cost of goods"; then Min and Max as two equal boxes on one line; then Tags
  - Heading "Inventory"; a Bin Location box ("General Storage") with a down arrow, a Quantity box ("0") and a light-blue rounded "Default" tag; then a blue "+ Add Bin Location" link with a plus icon
  - A thin line above the footer; no Delete Part; at the bottom right a white "Cancel" with a grey outline and a blue "Save"
- **Backed by:** S13-R1; S13-R2; S13-R4; S13-R5; S13-R6; S13-R8; S13-R9; S13-R10; S4-R1; S4-R2; S4-R3; S4-R4; S7-R1
- **Existing live cases that already check part of it:** C425685; C154766; C154776; C154836 step 1

## D-15 · Design: Typed values in New Inventory Part look as in the design  (64 chars)
- **Boards / pictures:** 1.3 Number and description typed
- **What the tester checks:**
  - A filled box shows its label small at the top left and the value under it
  - Cost and Sell Price show a "$" before the amount
  - The box being typed in has a blue outline and a blue label; the others have a grey outline
- **Backed by:** design board 1.3 (the PRD is silent on field styling)
- **Existing live cases that already check part of it:** none

## D-16 · Design: Required-field errors in the part window look as drawn  (62 chars)
- **Boards / pictures:** 1.2 Save with nothing filled
- **What the tester checks:**
  - Each empty required box turns red (red outline, red label) with a small red message right under it
  - All the messages show at the same time: "Description is a required field", "Part number is a required field", "Category is a required field", "Cost is a required field"
  - Vendor, Manufacturer, Sell Price, Core Charge, Min, Max and Tags stay grey
- **Backed by:** S7-N1; S7-N2; §8: "Inline error on the field, stays until corrected"; design 1.2 note: "Category and Cost are required, as they are today."
- **Existing live cases that already check part of it:** C154779

## D-17 · Design: New part with tracking off looks as in the design  (57 chars)
- **Boards / pictures:** 1.6 Branch: a new part with tracking off
- **What the tester checks:**
  - The switch is grey with its knob at the left
  - Min and Max are gone and Tags moves up directly under the switch
  - The Inventory heading and the bin row with its Default tag still show
- **Backed by:** S4-R5; S4-R6
- **Existing live cases that already check part of it:** C154767

## D-18 · Design: Part created and linked message looks as in the design  (62 chars)
- **Boards / pictures:** 1.4 Saved and linked to the Part Library entry
- **What the tester checks:**
  - A green message box at the bottom right with a white tick-in-circle icon and "Close" at its right
  - The text wraps over up to three lines: "Part created. Linked to <number> in the Part Library. Its description \"<library description>\" was kept."
  - The window has closed and the list shows behind the message
- **Backed by:** S7-R9; §8: "Success toast, fades on its own"
- **Existing live cases that already check part of it:** C154777

## D-19 · Design: Duplicate part number error looks as in the design  (58 chars)
- **Boards / pictures:** 1.5 The same number again, in lower case
- **What the tester checks:**
  - A red message box at the bottom right with a white warning triangle and "Close" at its right
  - First line(s): "<number> already exists at this location."; under it a smaller line "Please try to resolve this."
  - The New Inventory Part window stays open behind it with the typed values
- **Backed by:** S7-N3; S7-N5; §8: "Error toast, fades after 3 seconds"; §8 context note: "Please try to resolve this."
- **Existing live cases that already check part of it:** C425677

## D-20 · Design: Edit Inventory Part window looks as in the design  (57 chars)
- **Boards / pictures:** 2.1 The part as it stands; 3.1 Part Status in the dialog
- **What the tester checks:**
  - Title "Edit Inventory Part"; at the right of the title row a green rounded "Active" pill (light green fill, green text and border), then the grey X; a thin line under the title row
  - Under Part Number: a grey label "Part Status" and two round radio buttons on one line, Active and Inactive; the picked one is filled blue
  - The cost box is labelled "Average Cost"
  - Tags show as blue chips, each with a small x
  - Footer: a red "Delete Part" button at the bottom left with a white trash icon and white label; white Cancel and blue Save at the bottom right
- **Backed by:** S13-R1; S13-R2; S13-R3; S13-R4; S13-R6; S13-R7; S13-R8; S13-R9; S13-R20
- **Existing live cases that already check part of it:** C425684; C425687; C154836; C425702

## D-21 · Design: Inactive part's window shows a grey Inactive pill  (57 chars)
- **Boards / pictures:** 3.6 Opening the inactive part
- **What the tester checks:**
  - The pill at the right of the title row reads "Inactive" in grey (light grey fill, grey text and border), not green
  - The Inactive radio button is the filled one
  - Every other part of the window looks as on the active part's window
- **Backed by:** S13-R3; S9-R14
- **Existing live cases that already check part of it:** C154785; C154836 step 8

## D-22 · Design: Picked status leaves the green Active pill in place  (59 chars)
- **Boards / pictures:** 3.2 Inactive picked
- **What the tester checks:**
  - After clicking Inactive, the Inactive radio is filled blue with a light halo and Active is empty
  - The pill in the title row still reads "Active" in green
- **Backed by:** S13-R21; S13-R25
- **Existing live cases that already check part of it:** C425705; C425704

## D-23 · Design: Other-locations warnings look as in the design  (54 chars)
- **Boards / pictures:** 2.2 Both fields edited
- **What the tester checks:**
  - A small orange line of text sits directly under the Description box: "This also changes the description at 1 other location."
  - A small orange line sits directly under the Part Number box: "This also changes the part number at 1 other location."
  - Neither box turns red; the rest of the window does not move apart from these two lines
- **Backed by:** S13-R12; S13-R16; §8: "Text under the field while it differs"; design board 2.2 (orange text colour; the PRD is silent on colour)
- **Existing live cases that already check part of it:** C154839; C425690

## D-24 · Design: Deactivate part confirmation looks as in the design  (59 chars)
- **Boards / pictures:** 3.3 Save asks first
- **What the tester checks:**
  - A smaller white dialog opens over the Edit Inventory Part window, which dims behind it
  - Title "Deactivate part?" large and bold; a thin line under the title row
  - First line: the part number then the description (for example "N6801-06-04 #06 MALE JIC X #04 MALE ORB 90")
  - Then "This part won't show up ...", "Existing records that use it stay as they are." (a little bolder), "Stock, cost of goods and QuickBooks aren't affected." (grey)
  - The "Note (Optional)" box turns blue while typed in and shows the typed note
  - White Cancel, then a red "Deactivate" button, at the bottom right
- **Backed by:** S10-R3; S10-R4; S10-R6; S10-R9; S10-R10; S10-R11
- **Existing live cases that already check part of it:** C425760; C425761; C425763; C154799

## D-25 · Design: Activate part confirmation looks as in the design  (57 chars)
- **Boards / pictures:** 3.7 Bringing it back
- **What the tester checks:**
  - Title "Activate part?"; first line the part number then the description
  - One more line only: "This part can be added to new work again."
  - An empty "Note (Optional)" box, then white Cancel and a blue "Activate" button
  - Behind it the window's pill still reads "Inactive" while the Active radio is filled
- **Backed by:** S10-R3; S10-R4; S10-R7; S10-R10; S10-R11; S13-R25
- **Existing live cases that already check part of it:** C154796; C154799

## D-26 · Design: Part deactivated message looks as in the design  (55 chars)
- **Boards / pictures:** 3.4 Done
- **What the tester checks:**
  - The part window has closed
  - A green message box at the bottom right: white tick-in-circle icon, "Part deactivated.", "Close" at its right
- **Backed by:** S13-R22; §8: "Success toast, fades on its own"
- **Existing live cases that already check part of it:** C425707

## D-27 · Design: Inventory Tracking hover text opens below its info icon  (63 chars)
- **Boards / pictures:** 5.1 The Inventory Tracking section
- **What the tester checks:**
  - Hovering the (i) icon beside "Inventory Tracking" shows a dark grey box with white text over four lines
  - The box opens just below the icon, over the switch and the Min box; the heading "Inventory Tracking" stays visible
  - The text reads in full: "Tracked parts keep a stock count, with Min and Max. Turn this off for items you don't count. Untracked parts are left out of the Inventory Value report."
- **Backed by:** S4-R3; design board 5.1 (position; the PRD is silent)
- **Existing live cases that already check part of it:** C425627 (the words)

## D-28 · Design: Tracking switched off on a part looks as in the design  (62 chars)
- **Boards / pictures:** 5.2 Switch off
- **What the tester checks:**
  - The switch is grey with its knob at the left
  - Min and Max are gone and Tags sits directly under the switch
  - The bin row still shows the bin and its quantity (for example MZH1C, 10) with its Default tag
  - No message or confirmation appears
- **Backed by:** S5-R3; S5-R3a; S5-R5
- **Existing live cases that already check part of it:** C154773; C154772

## D-29 · Design: Tracking switched back on shows Min and Max again  (57 chars)
- **Boards / pictures:** 5.6 Switch back on
- **What the tester checks:**
  - The switch is blue with its knob at the right
  - Min and Max return as two boxes between the switch and Tags, with the values they had
- **Backed by:** S5-R4
- **Existing live cases that already check part of it:** C154771

## D-30 · Design: Not Tracked in the Inventory list looks as in the design  (64 chars)
- **Boards / pictures:** 5.3 The list says Not Tracked; 5.4 Finding untracked parts
- **What the tester checks:**
  - The Total Qty cell reads "Not Tracked" in light grey plain text, with no coloured badge
  - Tracked parts in the same column show coloured "<n> Available" badges
  - The Bin Location / Quantity cell still shows the outlined chip with the bin and its quantity
  - Min and Max still show numbers
  - Searching "not tracked" lists the untracked part in the same style
- **Backed by:** S4-R8; S4-R8a; S4-R8b; S6-R1
- **Existing live cases that already check part of it:** C154768; C154774

## D-31 · Design: Cycle count with an untracked part looks as in the design  (65 chars)
- **Boards / pictures:** 5.7 Cycle count leaves it out
- **What the tester checks:**
  - The toolbar shows a printer icon, a pale "Save", a blue "Cancel" and "Count changes available: 200" at the right
  - The Active and Inactive tabs still show above the toolbar
  - The untracked row shows "Not Tracked" in light grey in both Total Qty and Count, with no count box
  - Tracked rows show coloured "<n> Available" badges and an empty count box
- **Backed by:** S5-R12; S1-E1
- **Existing live cases that already check part of it:** C425636

## D-32 · Design: Part History page looks as in the design  (48 chars)
- **Boards / pictures:** 2.4 Part History at Heavy Duty; 5.5 Part History
- **What the tester checks:**
  - At the left a white card "Part details": the part's description in blue (cut off with ".." when long), then Part number, Category, Manufacturer and Measurement, each label bold with its value under it
  - To its right the title "Part History" and, at the top right, a magnifier with the word "Search"
  - A table with bold headers Staff, Date, Time, Event; thin lines between rows
  - Event text is dark and a little bolder than Staff, Date and Time (for example "Tracking turned off")
  - Entries at the location where the change was made carry no "Changed at"
- **Backed by:** S10-R20; S10-R22; S10-R24; S10-R25; design 2.4 note
- **Existing live cases that already check part of it:** C425770; C425638; C425775

## D-33 · Design: Part History keeps column widths when events are long  (61 chars)
- **Boards / pictures:** 2.6 Part History at Lethbridge (the board's redrawn table)
- **What the tester checks:**
  - At the other location, Staff, Date and Time are as wide as at the location where the change was made
  - A long Event that ends "| Changed at: <location>" wraps onto a second line inside the Event column
  - No column narrows and no text is cut off
- **Backed by:** S10-R21; S10-R25; design 2.6 note: "Staff, Date and Time keep their production widths; a long Event wraps onto a second line."
- **Existing live cases that already check part of it:** C154798 (short entries do not widen the columns); C425774
- **HELD** on DQ-03 (Rule 130 item 5); not added to the run until released.

## D-34 · Design: Part History search with a term looks as in the design  (62 chars)
- **Boards / pictures:** 3.8 Finding it in Part History
- **What the tester checks:**
  - The search opens as a field at the top right holding the typed term, with a round clear (x) icon at its right
  - Only the matching entries are listed, in the same table style
- **Backed by:** S10-R27
- **Existing live cases that already check part of it:** C425778

## D-35 · Design: Part lookup results look as in the design  (49 chars)
- **Boards / pictures:** 6.1 While active: GREASETUBE is found
- **What the tester checks:**
  - Each result shows the description at the left and the part number at the right on the first line
  - Second line in grey: "Inventory Qty: <n> ea" for a stocked part, or "Part Library" for a library entry
  - Third line: an outlined bin chip with the bin and its quantity
- **Backed by:** S12-R10; S9-R1
- **Existing live cases that already check part of it:** C425623; C154784

## D-36 · Design: Lookup with no match shows No results  (45 chars)
- **Boards / pictures:** 6.2 Once inactive: not offered
- **What the tester checks:**
  - The open lookup list holds one line, "No results", in dark text, and nothing else
- **Backed by:** S9-R1; design 6.2 note: "The same search returns \"No results\" (S9-R1)."
- **Existing live cases that already check part of it:** C154784

## D-37 · Design: Retired number typed in a lookup shows the inactive line  (64 chars)
- **Boards / pictures:** 6.3 Typing the retired number in full
- **What the tester checks:**
  - The open lookup list holds one line of dark text: "<NUMBER> is inactive. Activate it from the Inactive tab to use it.", naming the part's own number in capitals even when typed in lower case
  - No special-order row or add option shows in the list
- **Backed by:** S9-R16
- **Existing live cases that already check part of it:** C425738

## D-38 · Design: Canned job warning looks as in the design  (49 chars)
- **Boards / pictures:** 6.4 A canned job that holds it; 6.5 The canned job leaves it out
- **What the tester checks:**
  - An orange message box at the bottom right with a white "!" icon, the text "These parts are inactive and were not added: <numbers>." and "Close" at its right
  - It stays on screen until Close is clicked
  - The new line shows on the work order without the inactive part
- **Backed by:** S9-R9; S9-R10; §8: "Warning toast, one per canned job, stays until closed"
- **Existing live cases that already check part of it:** C425730; C573684

## D-39 · Design: Inactive tag in the vendor return lookup looks as drawn  (63 chars)
- **Boards / pictures:** 6.6 Vendor return: still offered, tagged
- **What the tester checks:**
  - The inactive part's result shows a small grey rounded "Inactive" tag right after its description, before the part number
  - An active part's result has no tag
- **Backed by:** S9-R11; S9-R12
- **Existing live cases that already check part of it:** C425733; C425734

## D-40 · Design: Inactive tag in the Issue Credit list looks as in the design  (68 chars)
- **Boards / pictures:** 6.7 Part sale credit: still offered, tagged
- **What the tester checks:**
  - In "Parts to return", the inactive part's row shows a small grey rounded "Inactive" tag right after its part number, before the description
  - An active part's row has no tag
- **Backed by:** S9-R13
- **Existing live cases that already check part of it:** C425735; C425736

## D-41 · Design: Part Library page looks as in the design  (48 chars)
- **Boards / pictures:** 7.1 Part Library
- **What the tester checks:**
  - Page title "Part Library"; Part Library is blue (selected) in the side menu
  - Toolbar at the right: Search, "Manufacturer: All manufacturers" with a person icon, "Category: All categories"; no button that creates an entry
  - A header checkbox and a blue three-dot button sit before the Description header; every row has a checkbox
  - Columns, in order: Description, Part Number, Tags, Category, Manufacturer, Measurement, Size
- **Backed by:** S11-R1; S11-R4; S11-R5; S12-R1; S12-R2
- **Existing live cases that already check part of it:** C154828; C425608; C425609; C154832

## D-42 · Design: Part Library entry page looks as in the design  (54 chars)
- **Boards / pictures:** 7.2 An entry opens its detail page
- **What the tester checks:**
  - At the left a white card "Part details": the entry's name in bold with a blue pencil (edit) icon to its right, then Part number, Category, Manufacturer, Measurement and Total parts
  - To its right the title "Parts" and a table with an arrow column, Workplace, Bin location, Average cost, Sell price, Core charge, Remaining Quantity, Min, Max
  - No Delete button anywhere on the page
- **Backed by:** S11-R3; S11-R8 (column name Remaining Quantity)
- **Existing live cases that already check part of it:** C154829

## D-43 · Design: Inventory list and bulk bar fit a 1440 px wide window  (61 chars)
- **Boards / pictures:** 4.2 Mode on; 4.3 Two rows ticked
- **What the tester checks:**
  - At 1440 px wide, the title, tabs, bulk bar and toolbar each fit on their own line with nothing overlapping
  - No toolbar label is cut off (Bin Location, Category, Supply, New Inventory Part read in full)
  - The bar's badge, "selected", divider, Deactivate and X all show; the table scrolls sideways for the columns that do not fit
- **Backed by:** §2 Form factor: "Parts management (the Inventory list, the part dialog and the bulk bar) is desktop and tablet."; design boards drawn 1600 px wide
- **Existing live cases that already check part of it:** none

## D-44 · Design: Inventory list and bulk bar fit a 1536 px wide window  (61 chars)
- **Boards / pictures:** 4.2 Mode on; 4.3 Two rows ticked
- **What the tester checks:**
  - The same checks as at 1440 px, at 1536 px wide
- **Backed by:** §2 Form factor; design boards drawn 1600 px wide
- **Existing live cases that already check part of it:** none

## D-45 · Design: Part window and confirmation fit a 1440 px wide window  (62 chars)
- **Boards / pictures:** 2.1 The part as it stands; 3.3 Save asks first
- **What the tester checks:**
  - At 1440 px wide, the Edit Inventory Part window shows every field and the footer without overlap; the pill and the X do not overlap the title
  - The Deactivate part? confirmation fits inside the window area; its lines wrap and no text is cut off
- **Backed by:** §2 Form factor; design boards drawn 1600 px wide
- **Existing live cases that already check part of it:** none

## D-46 · Design: Part window and confirmation fit a 1536 px wide window  (62 chars)
- **Boards / pictures:** 2.1 The part as it stands; 3.3 Save asks first
- **What the tester checks:**
  - The same checks as at 1440 px, at 1536 px wide
- **Backed by:** §2 Form factor; design boards drawn 1600 px wide
- **Existing live cases that already check part of it:** none

## D-47 · Design: Inactive tag on the Part Library entry page sits before the quantity  (76 chars)
- **Boards / pictures:** 7.2 An entry opens its detail page (table layout only; the design draws no inactive row)
- **What the tester checks:**
  - In the Parts table, a row whose part is inactive at its workplace shows a grey "Inactive" tag in the Remaining Quantity column, before the number
  - An untracked row shows "Not Tracked" in that column in place of the number
  - Other rows show only the number
- **Backed by:** S11-R8; S11-R9
- **Existing live cases that already check part of it:** none
- **Note:** new in PRD v30; Phase C writes the behaviour; drop this key if Phase C's case already checks the tag's place and colour

## D-48 · Design: Not Tracked replaces the stock line in a part lookup  (60 chars)
- **Boards / pictures:** 6.1 While active: GREASETUBE is found (result layout only; the design draws no untracked result)
- **What the tester checks:**
  - An untracked part's result shows "Not Tracked" on its second line where a tracked part shows "Inventory Qty: <n>"
  - Its bin chip still shows on the third line
- **Backed by:** S9-R21
- **Existing live cases that already check part of it:** none
- **Note:** new in PRD v30; Phase B writes the behaviour; drop this key if Phase B's case already checks the placement

## D-49 · Design: Status confirmation has a close X in its title row  (58 chars)
- **Boards / pictures:** 3.3 Save asks first; 3.7 Bringing it back; 4.4 Confirm; 4.7 Confirm the reactivation
- **What the tester checks:**
  - Every status confirmation (Deactivate part?, Activate part?, Deactivate parts?, Activate parts?) shows a grey X at the right end of its title row
  - Clicking the X closes the confirmation with nothing changed, the same as Cancel (the design does not say; part of the question)
- **Backed by:** design boards 3.3, 3.7, 4.4, 4.7 (the X is drawn); PRD §4: "A title, a message, an optional note, Cancel and a confirm button." (no X listed)
- **Existing live cases that already check part of it:** none
- **HELD** on DQ-01 (Rule 130 item 5); not added to the run until released.

## Board → design cases

| Board | Cases |
|---|---|
| 1.1 | D-14 |
| 1.2 | D-16 |
| 1.3 | D-15 |
| 1.4 | D-01, D-18 |
| 1.5 | D-19 |
| 1.6 | D-17 |
| 2.1 | D-20, D-45, D-46 |
| 2.2 | D-23 |
| 2.3 | D-01 |
| 2.4 | D-32 |
| 2.5 | D-01 |
| 2.6 | D-33 |
| 3.1 | D-20 |
| 3.2 | D-22 |
| 3.3 | D-24, D-45, D-46, D-49 |
| 3.4 | D-04, D-26 |
| 3.5 | D-02 |
| 3.6 | D-21 |
| 3.7 | D-25, D-49 |
| 3.8 | D-34 |
| 4.1 | D-05 |
| 4.2 | D-07, D-43, D-44 |
| 4.3 | D-08, D-43, D-44 |
| 4.4 | D-11, D-49 |
| 4.5 | D-13 |
| 4.6 | D-09 |
| 4.7 | D-12, D-49 |
| 4.8 | D-06 |
| 4.9 | D-10 |
| 4.10 | D-03 |
| 5.1 | D-27 |
| 5.2 | D-28 |
| 5.3 | D-01, D-30 |
| 5.4 | D-30 |
| 5.5 | D-32 |
| 5.6 | D-29 |
| 5.7 | D-31 |
| 6.1 | D-35, D-48 |
| 6.2 | D-36 |
| 6.3 | D-37 |
| 6.4 | D-38 |
| 6.5 | D-38 |
| 6.6 | D-39 |
| 6.7 | D-40 |
| 7.1 | D-41 |
| 7.2 | D-42, D-47 |

Target boards with no design case: none (4.0 Before is used by D-01 for the column set only).
