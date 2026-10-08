|  |  |
| --- | --- |
|  |  |
| **Epic** | <https://shopview.atlassian.net/browse/SV-10647> SV-10647, FounderMode Part Lifecycle |
| **Owner** | Chris Ward |
| **Status** | Ready for dev - 2026-10-07 |
| **Design** | <https://claude.ai/artifact/Vz6rprcWyP16tYxzM1kdeE> |

---

# Part Lifecycle, Product Spec

## 1. Business Case

The parts system has three structural gaps that cause daily friction for shop staff. First, a shop has no way to retire a discontinued or phased-out part without deleting it, which loses its history on past work orders and invoices. Second, some inventory items (bulk hardware, loose-dispensed fasteners, miscellaneous consumables) cannot realistically be counted in bins or tied to a reorder cycle, yet the system forces them through the full quantity-tracking workflow or keeps them out of the system entirely. Third, creating a part means going through the part library before adding stock, a split that does not match how shops think about a part. Together, these gaps push shops to leave dead parts in the active list, delete parts and lose their history, or work around the system rather than with it.

## 2. Feature Overview

**Core functionality**

- Every inventory part has an active or inactive state and a tracked or untracked state. The two are independent.
- Both states belong to the part at one location. The same part at another location keeps its own states.
- The Inventory list shows Active and Inactive parts on separate tabs.
- A part can be set active or inactive one at a time, from the part dialog, or in bulk from the Inventory list. Bulk changes happen in a mode the user turns on from the Inventory actions menu, the same way Cycle count works.
- An inactive part cannot be added to new work. It stays on every record it is already on, and it stays available for returns and credits.
- The system refuses an inactive part on new work however it arrives, including a part number typed by hand as a special order.
- An untracked part is not counted. The Inventory list shows "Not Tracked" instead of its total quantity, and the part has no Min / Max. Its bins and their quantities stay on screen as a shelf reference. It can still be used on work orders and invoices.
- Creating a part takes a part number and a description typed straight into the part dialog. The system links the part to the Part Library in the background.
- A part's number and description can be edited from the part dialog. The change is made to the part's own Part Library entry, which every location that stocks the part shares.
- A core always has the same active state and the same tracking state as the part it belongs to.

**Accounting**

- Tracking changes what the shop counts, never what the books record. An untracked part moves stock and posts to the accounting system exactly as a tracked part does.
- The Inventory Value report leaves out untracked parts, because they keep no stock count to value. This is a report change only.
- The Inventory Value report run for a past date shows each part as it was on that date. Turning tracking off today does not change an earlier date's figures.
- The Inventory Value report run for a date before release counts every part as tracked.
- The dashboard's inventory figure and the opening inventory used for accounting keep untracked parts, because that stock still sits in the books.
- Setting a part inactive does not touch stock, cost of goods or QuickBooks.

**Form factor**

- Parts management (the Inventory list, the part dialog and the bulk bar) is desktop and tablet. No phone layout is provided for it.
- Story 9 applies on every device, including technician charge-out on a phone.

**Out of scope**

- Changing how untracked parts post to the accounting system (expensing them on purchase instead of moving stock). This is its own project.
- Reorder and stockout alert changes, beyond leaving untracked and inactive parts out of the dashboard's Critical Reorder list and the Supply filter (S5-R14, S6-R10, S9-E12).
- Any change to the Part Library management screen beyond Stories 11 and 12.
- Merging duplicate Part Library entries, re-pointing a part to a different Part Library entry, and creating a Part Library entry on its own. A merge and duplicate tool is its own project.
- A description that differs by location. A part has one description, shared by every location that stocks it.
- Hard-deletion guardrails for parts that carry transactional history (PRD 462, FR-032 to FR-035).
- Mapping a status column during CSV part import (PRD 462, FR-043 to FR-049).
- How the parts CSV import matches a part number to a Part Library entry. The import matches a number ignoring upper and lower case. If nothing matches, it also ignores hyphens, asterisks, periods and spaces. It writes the row's description onto the entry it matches. It never moves a part to a different entry and never changes an entry's part number (S13-N9).
- An "All" option alongside the Active and Inactive tabs (PRD 462, FR-012).
- Filtering the Inventory list by vendor, category, quantity on hand, or zero quantity on hand (PRD 462, FR-040 and FR-041).

## 3. Jobs to be Done / Goals

**When** a part is discontinued or no longer purchased, **I want to** mark it inactive, **so I can** remove it from daily work without losing its history on past work orders.

**When** I stock a loose-dispensed consumable, **I want to** add it without bin and quantity tracking, **so I can** use it on invoices without false stockout noise.

**When** I add a new part, **I want to** type a part number and description, **so I can** get the part into the system without a separate Part Library lookup.

**When** a part number or description is wrong, **I want to** correct it on the part itself, **so I can** keep the part's history and avoid a second part appearing.

**Goals**

- No data loss when a part is retired. History, invoices and reports stay intact.
- No stockout or reorder signals for items the shop knows it cannot count.
- No Part Library step when a part is created.
- No duplicate part created by correcting a part number.

## 4. Key Decisions

- **Active and tracked are set per location.** A part is stocked at a location, and whether the shop still sells it, or counts it, is that location's call. Changing either state at one location never changes the same part at another location.
- **The number and description are shared.** They live on the part's Part Library entry, which every location that stocks the part shares. Editing them at one location changes them at every location, and the dialog says so before the save (S13-R12, S13-R16).
- **Part Number is required, on create and on edit.** The Part Library link, the duplicate check and the other-locations warning all depend on the number. A shop without its paperwork yet types a temporary number and corrects it later, which keeps the part, its history and its Part Library entry (Story 13).
- **In the New Inventory Part dialog, a new part links to an existing Part Library entry only on an exact match.** Exact means the same characters, including upper and lower case. Any other number gets an entry of its own. A near match is never linked, because two different products can share a number that differs only in punctuation, and linking them would merge them.
- **A new part number already stocked at the location is refused, ignoring case and punctuation.** This check stops a second copy of a part at one location. It runs when a part is created or its number is changed, never when a part is saved with its number unchanged. It is separate from linking, which stays exact.
- **A rename follows the same match rule as linking.** A rename is refused only when another Part Library entry has exactly the typed number: the same characters, with the same upper and lower case.
- **Turning tracking off only hides the count.** Nothing is cleared and nothing is written off, so there is nothing to confirm. Turning tracking back on shows the count as it stands. Clearing stock while the accounting kept moving it would count the same cost twice.
- **A core follows its part.** A core is never activated, deactivated, tracked or untracked on its own.
- **Bulk status change is a mode.** A row click on the Inventory list opens the part. Bulk status uses the same pattern as Cycle count: the user turns the mode on from the actions menu, checkboxes appear, search and filtering keep working, and the X on the bulk bar leaves the mode.
- **The part dialog sets the status, and Save applies it.** Part Status is a choice in the form. Picking Active or Inactive changes nothing until Save, and Save asks for confirmation first, the same confirmation the list uses.
- **Every confirmation is the application's standard dialog.** A title, a message, an optional note, Cancel and a confirm button. There is no confirmation word to type.
- **Inactive parts stay out of new work, and stay in returns and credits.** A retired part on a past sale still has to be returnable to the vendor and creditable to the customer.
- **Typing a retired number by hand does not get around it.** The lookup does not offer the number as a special order, and the system refuses an inactive part on new work however it arrives (Story 9).
- **Access does not change.** Retiring a part, bringing it back and changing its tracking use the same access ShopView applies to deleting an inventory part today. The controls show to exactly the users who see Delete on the part dialog today. The system accepts exactly the users it accepts a delete from today, on every route. No user gains or loses access on release day (Story 8).
- **Pointing a part at a different Part Library entry is removed from the part dialog.** The dialog has no Part Library selector, and the system refuses a re-point by any other route. The merge and duplicate tool (Out of scope) is where that will live.
- **A rename carries over to work that is still open.** Open purchase order lines, open part requests, canned jobs and open returns follow the new number, so receiving and returning still find the part. Records already completed keep the number they were written with.
- **The Part Library has no standalone create.** Every Part Library entry is created from a part number in use. In the reference dataset 19,664 of 29,376 entries had no inventory part behind them and 17,359 were referenced by nothing at all.
- **This spec is a slice of an approved PRD.** PowerTools PRD 462, "Inactive Part Status Management" (SV-5497), is approved. This spec covers the inventory side plus the selection blocking in Story 9. Requirements deferred from PRD 462 are named with their numbers under Out of scope. Nothing in this spec contradicts PRD 462.
- **Hiding a part from the Inventory list is not enough on its own.** The customer evidence behind PRD 462 is about technicians selecting retired part numbers. Story 9 is what stops that.

## 5. Terminology

- **Active / Inactive** → Whether a part is in daily use at a location. An inactive part is retired: it cannot be added to new work, and its history is kept.
- **Tracked / Untracked** → Whether a location keeps a stock count for a part. A tracked part has bins, a quantity on hand, and Min / Max. An untracked part has no Min / Max and shows "Not Tracked" instead of its total quantity. Its bins and their quantities stay on screen as a shelf reference.
- **Part Library** → The shop's shared list of parts, across every location. Each inventory part at a location points to one Part Library entry, which holds its number and description.
- **Bulk status mode** → The state of the Inventory list after the user picks Deactivate parts or Activate parts from the actions menu: a checkbox column shows, a row click ticks the row, and the bulk bar sits under the tabs.
- **Bulk bar** → The dark bar across the Inventory list, under the Active and Inactive tabs, while bulk status mode is on. It is the same bar work order lines show for ticked lines.
- **Open work** → A purchase order line not yet fully received, a part request not yet received or returned, a canned job, and a return that is not completed.

## 6. Assumptions

- We assume every place a user picks a part for new work reads from one shared part lookup. Story 9 lists those places. If one of them looks parts up its own way, its lookup needs the same filter. The system's own refusal (S9-R17) still stops the part being saved.
- We assume no shop relies on a retired part staying selectable. Story 9 removes inactive parts from every new-work lookup.

## 7. Requirements

### Story 1: Active and Inactive Tabs on the Inventory List

As a parts manager, I want to see active and inactive parts in separate tabs so that I can work from a clean active list without losing access to retired parts.

**Design:** Part Lifecycle design canvas, page 3, board 3.5; page 4, boards 4.2, 4.6 and 4.10  
**Jira:** SV-10814

**Prerequisites**

- User is on the Parts → Inventory page.
- User has the 'Part Library & Inventory → View' permission enabled.

**Requirements**

- **S1-R1:** The Inventory list shows two tabs, Active and Inactive.
- **S1-R2:** Active is the selected tab when the page opens.
- **S1-R3:** The Active tab lists only parts that are active at the current location.
- **S1-R4:** The Inactive tab lists only parts that are inactive at the current location.
- **S1-R5:** Every part that exists on the day of release is active.
- **S1-R5a:** Every part that exists on the day of release is tracked.
- **S1-R5b:** The feature is on for every shop on the day of release. There is no rollout setting.
- **S1-R6:** Switching tabs clears any rows the user had ticked.
- **S1-R7:** Search, filters and sort work the same way on both tabs.
- **S1-R8:** The Active and Inactive tabs sit on their own line under the page title, above the search and filter row.
- **S1-R9:** Export in the actions menu exports the parts on the tab that shows: active parts from the Active tab, inactive parts from the Inactive tab.
- **S1-R9a:** An untracked part exports "Not Tracked" in the quantity column. The export has no status column.
- **S1-R10:** Cycle count is offered on both tabs. It counts the parts on the tab that shows, and the printed count sheet lists those parts.

> *\* Context note: S1-R5 describes the data on release day, not a rule the system keeps enforcing. Nothing makes a part active again on its own.*

**Negative cases**

- **S1-N1:** If there are no inactive parts at the location and no search or filter is narrowing the list, the Inactive tab shows "No inactive parts at this location."
- **S1-N2:** If a search or filter leaves the Inactive tab empty, it shows the list's standard filtered empty state.

### Story 2: Deactivate Parts in Bulk

As a parts manager, I want to retire many parts at once so that they stop appearing in daily work without being deleted.

**Design:** Part Lifecycle design canvas, page 4, boards 4.1 to 4.5, 4.8 and 4.9  
**Jira:** SV-10815

**Prerequisites**

- User is on the Active tab of the Inventory list.
- User has the 'Part Library & Inventory → Delete' permission enabled.

**Requirements**

- **S2-R1:** Bulk deactivation is a mode. The user turns it on from the Inventory actions menu, the three-dot button in the toolbar that holds Cycle count and Export.
- **S2-R2:** The menu entry reads "Deactivate parts" while the Active tab shows and "Activate parts" while the Inactive tab shows. Only one of the two shows at a time. It sits between Cycle count and Export.
- **S2-R3:** Outside the mode the Inventory list has no checkbox column, and a row click opens the part.
- **S2-R4:** Turning the mode on adds a checkbox column, 44px wide, at the left of the table, and scrolls the table back to its left edge so the column is in view.
- **S2-R5:** While the mode is on, a click anywhere on a row ticks or unticks that row instead of opening the part.
- **S2-R6:** The checkbox in the header ticks or clears every row loaded in the list. The list loads 30 parts at a time as the user scrolls, so it ticks only the rows loaded so far. The count in the bar shows exactly how many parts will change.
- **S2-R7:** While the mode is on, the bulk bar spans the full width of the list directly under the Active and Inactive tabs, and the search and filter row moves down under it.
- **S2-R7a:** In the light theme the bulk bar is near-black (#121926), the count is white, and the word "selected" is light grey. In the dark theme the bar is white and its text is dark. Its corners are rounded 8px.
- **S2-R7b:** From left to right the bar shows: the number of ticked rows in a round badge followed by the word "selected", a thin divider, and a blue button reading "Deactivate". The number updates as the user ticks.
- **S2-R8:** The Deactivate button is disabled while no row is ticked. Hovering it then shows "Tick the parts to deactivate".
- **S2-R8a:** One change takes at most 200 parts. With more than 200 rows ticked, the Deactivate button is disabled, and hovering it shows "Select 200 parts or fewer."
- **S2-R9:** An X button sits at the right end of the bar. Hovering it shows "Clear selection", which is also its screen reader label.
- **S2-R9a:** The X leaves the mode, clears the selection and puts the toolbar back to its normal state.
- **S2-R10:** Search, the filter bar, sorting and paging keep working while the mode is on, as they do in Cycle count.
- **S2-R10a:** Changing the search term or a filter clears the ticks, so the user only ever changes parts they can see. Sorting keeps them.
- **S2-R10b:** While the mode is on, the actions menu offers only Export. Cycle count and the bulk entry come back when the mode ends.
- **S2-R11:** When the user confirms (Story 10), every ticked part becomes inactive.
- **S2-R12:** The deactivated parts leave the Active tab without a page reload.
- **S2-R13:** The deactivated parts appear on the Inactive tab.
- **S2-R14:** When every ticked part changes, the mode ends and the selection clears.
- **S2-R15:** When some parts fail, the mode stays on and the selection keeps only the parts that failed.
- **S2-R16:** Switching between the Active and Inactive tabs ends the mode and clears the selection.
- **S2-R17:** A part's core becomes inactive together with the part, in the same change.

> *\* Context note: S2-R15 lets the user retry the failures by pressing the button again, instead of finding them by hand. S2-R5 is the reason the mode exists: the row has one click, and the mode changes what that click means. A single part is deactivated from its part dialog (Story 13).*

**Negative cases**

- **S2-N1:** With nothing ticked, the Deactivate button is visible but disabled, so the confirmation cannot open.
- **S2-N2:** Outside the mode there is no checkbox column, so no part can be ticked from the default list.
- **S2-N3:** A core cannot be set active or inactive on its own. Asked to, the system refuses it with "A core follows its part. Activate or deactivate the part instead."

**Edge cases**

- **S2-E1:** If a part being set inactive sits on an open work order, the change still goes through.
- **S2-E2:** That part stays on the open work order.
- **S2-E3:** The part's work order and invoice history does not change. The status change is recorded in the part's own history (Story 10).
- **S2-E4:** Cycle count and bulk status mode cannot both be on. While Cycle count runs, the actions menu is replaced by the count controls, so the bulk status entry cannot be reached until the count is saved or discarded. While bulk status mode is on, the menu does not offer Cycle count (S2-R10b).

### Story 3: Activate Parts in Bulk

As a parts manager, I want to bring retired parts back so that they are available for daily work again.

**Design:** Part Lifecycle design canvas, page 4, boards 4.6 and 4.7  
**Jira:** SV-10816

**Prerequisites**

- User is on the Inactive tab of the Inventory list.
- User has the 'Part Library & Inventory → Delete' permission enabled.

**Requirements**

- **S3-R1:** Reactivation uses the same mode as Story 2. On the Inactive tab the actions menu entry reads "Activate parts", and turning it on shows the same checkbox column and the same bulk bar.
- **S3-R2:** The bulk bar button reads "Activate", in the same blue as "Deactivate".
- **S3-R3:** S2-R3 to S2-R10b, S2-R14 to S2-R17 and S2-N3 apply on the Inactive tab exactly as on the Active tab, with "deactivate" read as "activate". The disabled button's hover text is "Tick the parts to activate".
- **S3-R4:** When the user confirms (Story 10), every ticked part becomes active and leaves the Inactive tab without a page reload.
- **S3-R5:** The reactivated parts appear on the Active tab.

**Negative cases**

- **S3-N1:** With nothing ticked, the Activate button is visible but disabled.

### Story 4: Create an Untracked Part

As a parts manager, I want to add a part without a stock count so that I can use it on invoices without bin or reorder noise.

**Design:** Part Lifecycle design canvas, page 1, board 1.6; page 5, board 5.3  
**Jira:** SV-10817

**Prerequisites**

- User is on the Parts → Inventory page.
- User has the 'Part Library & Inventory → Create & Edit' permission enabled.
- Creating a part with tracking off also needs the 'Part Library & Inventory → Delete' permission (Story 8).

**Requirements**

- **S4-R1:** The New Inventory Part dialog has a "Track quantities and cost of goods" switch, on by default.
- **S4-R2:** The switch sits in its own section headed "Inventory Tracking", below the cost, Sell Price and Core Charge fields, and above Tags (S13-R4).
- **S4-R3:** The heading has an info icon. Hovering it shows "Tracked parts keep a stock count, with Min and Max. Turn this off for items you don't count. Untracked parts are left out of the Inventory Value report."
- **S4-R4:** Min and Max sit in the section, under the switch.
- **S4-R5:** When the switch is off, Min and Max are hidden.
- **S4-R6:** When the switch is off, the bin location section stays visible and is optional. A bin can be set as a shelf reference without being required to save.
- **S4-R6a:** The bins set on an untracked part are saved with their quantities, the same as on a tracked part.
- **S4-R7:** When the switch is on, at least one bin location must be set, and one must be marked as the default, before the part can be saved.
- **S4-R8:** An untracked part shows "Not Tracked" in the Inventory list's Total Qty column instead of a quantity.
- **S4-R8a:** On the Inventory list, an untracked part's Bin Location / Quantity column still shows each bin with its quantity.
- **S4-R8b:** On the Inventory list, an untracked part's Min and Max columns still show the saved values.
- **S4-R9:** The Inventory Value report does not include untracked parts.

**Negative cases**

- **S4-N1:** If a tracked part reaches the system with no bin location, the save is refused with "At least one bin must be provided."
- **S4-N2:** If a tracked part reaches the system with bin locations but none marked as the default, the save is refused with "At least one bin must be marked as default."

> *\* Context note: in the dialog a new part always starts with the location's default bin, and the last bin and the default bin cannot be removed, so S4-N1 and S4-N2 come from requests made outside the dialog.*

### Story 5: Change Tracking on an Existing Part

As a parts manager, I want to turn tracking on or off after a part is created so that I can fix the setup or change how the shop counts it.

**Design:** Part Lifecycle design canvas, page 5, boards 5.1 to 5.7  
**Jira:** SV-10818

**Prerequisites**

- User is editing an existing part in the Edit Inventory Part dialog.
- User has the 'Part Library & Inventory → Delete' permission enabled.

**Requirements**

- **S5-R1:** The "Track quantities and cost of goods" switch can be changed in the Edit Inventory Part dialog.
- **S5-R2:** The change applies when the user saves the part.
- **S5-R3:** Turning tracking off hides Min and Max in the part dialog. It does not change the quantity in any bin.
- **S5-R3a:** The bin locations and their quantities stay visible in the part dialog, as a shelf reference (S4-R6).
- **S5-R4:** Turning tracking off keeps the Min and Max values, so turning tracking back on shows them as they were.
- **S5-R5:** Turning tracking off asks for no confirmation, whatever the part holds.
- **S5-R6:** Turning tracking on shows the count as it stands.
- **S5-R7:** In the part dialog, when the user turns tracking on and the part has no bin location, the dialog gives it the location's default bin location, with a quantity of zero, marked as the default.
- **S5-R8:** In the part dialog, when the user turns tracking on and the part has bin locations but none is the default, the dialog marks the first one as the default.
- **S5-R9:** The part's core is tracked or untracked together with the part, in the same save. A core added to the part later, or in the same save, takes the part's tracking state.
- **S5-R12:** In Cycle count, an untracked part shows "Not Tracked" in the count column instead of count boxes, and it is never counted.
- **S5-R13:** The printed count sheet leaves out untracked parts.
- **S5-R10:** After the save, the Total Qty column shows the new state without a page reload.
- **S5-R11:** The change is recorded in Part History (S10-R22).
- **S5-R14:** The dashboard's Critical Reorder list leaves out untracked parts.

**Negative cases**

- **S5-N1:** If a request to turn tracking on reaches the system with no bin location, it is refused with "At least one bin must be provided." The dialog never sends one, because of S5-R7.
- **S5-N2:** A user without the 'Part Library & Inventory → Delete' permission sees the switch disabled (S8-R9).

**Edge cases**

- **S5-E1:** The parts CSV import can change Min, Max and bin quantities on an untracked part. The values are saved the same way as on a tracked part, and a Min or Max change is written to Part History (S10-R22a).

### Story 6: Search and Sort the Inventory List by Tracking State

As a parts manager, I want to find untracked parts with search and sort so that I can review them without scrolling the whole list.

**Design:** Part Lifecycle design canvas, page 5, board 5.4  
**Jira:** SV-10819

**Prerequisites**

- User is on the Parts → Inventory page, on either tab.

**Requirements**

- **S6-R1:** Typing "not tracked", "not" or "tracked" in the Inventory search returns the untracked parts, together with every part those words match on part number, description, tags and the other standard fields. Upper and lower case, and spaces before and after the term, do not matter.
- **S6-R2:** Any other term, including part of those words such as "t" or "track", matches on part number, description, tags and the other standard fields, never on tracking state.
- **S6-R3:** The Total Qty column can be sorted.
- **S6-R4:** When that column is sorted, untracked parts sit below every tracked part, in both sort directions.
- **S6-R5:** Tracked parts sort against each other by quantity.
- **S6-R6:** Tracked parts with the same quantity are then ordered by description, A to Z.
- **S6-R7:** Untracked parts are ordered by description, A to Z.
- **S6-R8:** Sorting by any other column sorts by that column first, then by description, A to Z. Tracking state plays no part in it.
- **S6-R9:** With no sort chosen, tracked parts are listed first and untracked parts after them, each ordered by description, A to Z.
- **S6-R10:** In the Supply filter, an untracked part shows only under "All". Under-supplied, Well-supplied and Over-supplied leave it out.

**Negative cases**

- **S6-N1:** If there are no untracked parts, searching "not tracked" returns no results.

### Story 7: Create a Part by Typing Its Number and Description

As a parts manager, I want to add a part by typing its part number and description so that I do not have to go through the Part Library first.

**Design:** Part Lifecycle design canvas, page 1, boards 1.1 to 1.5  
**Jira:** SV-10820

**Prerequisites**

- User is on the Parts → Inventory page.
- User has the 'Part Library & Inventory → Create & Edit' permission enabled.

**Requirements**

- **S7-R1:** The New Inventory Part dialog has a Description field, followed by a Part Number field. Both are free text.
- **S7-R2:** The dialog has no Part Library selector and no Part Library lookup step.
- **S7-R3:** Spaces before and after the part number and the description are removed on save.
- **S7-R4:** On save, the system looks for a Part Library entry whose number is exactly the number typed, including upper and lower case.
- **S7-R5:** If exactly one entry matches, the new part is linked to that entry.
- **S7-R6:** A linked entry keeps its own description. The description typed in the dialog does not change it.
- **S7-R6a:** A linked entry keeps all its tags. Tags typed on the new part are added to them, and none are removed.
- **S7-R6b:** A linked entry with no manufacturer takes the one picked in the dialog. An entry that already has a manufacturer keeps it.
- **S7-R6d:** A linked entry has a manufacturer only when it points to a manufacturer that exists in this organization. An entry that points to none takes the one picked in the dialog.
- **S7-R6c:** A linked entry keeps its own category. The category picked in the dialog does not change it.
- **S7-R7:** If no entry matches, the system creates a Part Library entry with the typed number and description, and links the part to it.
- **S7-R8:** If more than one entry matches, the system creates a Part Library entry of its own for the new part.
- **S7-R9:** When the part was linked to an existing entry whose description differs from the one typed, ignoring upper and lower case and spaces before and after, the system shows "Part created. Linked to {part number} in the Part Library. Its description "{library description}" was kept." For example: "Part created. Linked to N68SL-356 in the Part Library. Its description "BRAKE PAD" was kept."
- **S7-R10:** No message about the Part Library is shown when the descriptions match, or when a new entry is created.
- **S7-R11:** Parts that exist on the day of release keep the Part Library entry they have.

> *\* Context note: S7-R4 to S7-R8 decide which Part Library entry a new part shares. Linking happens only on an exact match. A number that matches several entries exactly, or none, never gets guessed onto one of them.*

\*\\\* Context note (S7-R6d): many existing entries point to a manufacturer that no longer exists. The data cleanup in SV-10033 runs before this feature is released.\*

**Negative cases**

- **S7-N1:** Description is required. Left empty, or holding only spaces, the field shows "Description is a required field" and the part is not saved.
- **S7-N2:** Part Number is required. Left empty, or holding only spaces, the field shows "Part number is a required field" and the part is not saved.
- **S7-N3:** If a part with the same number is already stocked at this location and is active, the save is refused with "{part number} already exists at this location."
- **S7-N4:** If a part with the same number is already stocked at this location and is inactive, the save is refused with "{part number} already exists at this location and is inactive. Activate it from the Inactive tab."
- **S7-N5:** For S7-N3 and S7-N4, "the same number" ignores upper and lower case, hyphens, asterisks, periods, spaces and other blank characters. The message names the number of the part already there.
- **S7-N5a:** If the location stocks both an active and an inactive part with that number, the save is refused with the message of S7-N3.
- **S7-N5b:** S7-N3 and S7-N4 apply when a part is created and when its part number is changed. Saving a part with its number unchanged is never refused by them, even when the location already holds a part whose number matches it.
- **S7-N6:** If an empty description or part number reaches the system by any other route, the save is refused with "Description is required." or "Part number is required."

### Story 8: Permissions

As a shop owner or administrator, I want retiring parts and turning tracking off to be limited to staff with management authority so that other staff cannot do either by accident.

**Design:** Not applicable  
**Jira:** SV-10821

**Prerequisites**

- User is signed in to ShopView.

**Requirements**

- **S8-R1:** Setting a part inactive requires the 'Part Library & Inventory → Delete' permission.
- **S8-R2:** Setting a part active requires the same permission.
- **S8-R3:** A user without that permission does not see the "Deactivate parts" entry in the Inventory actions menu.
- **S8-R4:** That user does not see the "Activate parts" entry on the Inactive tab.
- **S8-R5:** The actions menu needs the 'Part Library & Inventory → Create & Edit' permission. Its Cycle count and Export entries need nothing more. Only the bulk status entry also needs the 'Part Library & Inventory → Delete' permission.
- **S8-R6:** That user sees the Part Status choice in the part dialog disabled (S13-R20).
- **S8-R7:** Creating a part with tracking off requires the 'Part Library & Inventory → Delete' permission.
- **S8-R8:** Changing an existing part's tracking, in either direction, requires the same permission.
- **S8-R9:** A user without that permission sees the tracking switch disabled, so they can read the state but not change it.
- **S8-R10:** Creating a tracked part needs only the 'Part Library & Inventory → Create & Edit' permission.
- **S8-R11:** Changing a part's number or description needs only the 'Part Library & Inventory → Create & Edit' permission, including when the change reaches other locations.
- **S8-R12:** Delete Part in the part dialog requires the 'Part Library & Inventory → Delete' permission. Without it the button is not shown.
- **S8-R13:** Editing pricing, editing bin quantities and viewing the Inventory list follow the permissions that already govern them.
- **S8-R14:** The controls this spec gates on the 'Part Library & Inventory → Delete' permission show to exactly the users who see Delete on the part dialog today. By default those are Admin, Service Manager and Parts Manager.
- **S8-R15:** The system accepts a status change, a tracking change and an untracked part from exactly the users it accepts an inventory part delete from today.
- **S8-R16:** A custom role has only the permissions granted to it.

**Negative cases**

- **S8-N1:** If a user without the 'Part Library & Inventory → Delete' permission tries to create an untracked part by any route, the request is refused with an access denied error.
- **S8-N1a:** Editing any other field of a part that is already untracked, such as its price, bins or description, needs the same access as editing a tracked part today.
- **S8-N2:** If that user tries to change a part's tracking by any route, the request is refused with an access denied error.
- **S8-N3:** If that user tries to set a part active or inactive by any route, the request is refused with an access denied error.

> *\* Context note: S8-N1 to S8-N3 hold for a user who cannot delete inventory parts today. The system checks that access itself, so hiding the controls is not the only protection.*

\*\\\* Context note (S8-R14, S8-R15): this spec does not change who can do what. Several role settings carry the right to delete inventory parts behind the scenes, and that stays exactly as it is today.\*

### Story 9: Inactive Parts Cannot Be Added to New Work

As a shop owner, I want an inactive part to disappear from every place staff pick a part for new work so that a retired part number cannot be sold or billed by mistake.

**Design:** Part Lifecycle design canvas, page 6, boards 6.1 to 6.7; page 3, board 3.6  
**Jira:** SV-10822

**Prerequisites**

- The part is inactive at the current location.

**Requirements**

- **S9-R1:** Part lookup on a work order line does not return inactive parts.
- **S9-R2:** Part lookup on an estimate line does not return inactive parts.
- **S9-R3:** Technician charge-out part selection does not return inactive parts, on every device.
- **S9-R4:** If ShopView adds a part lookup to an invoice line outside a work order or part sale, that lookup does not return inactive parts.
- **S9-R5:** Part lookup on a purchase order line does not return inactive parts.
- **S9-R6:** Changing which part a line on a received vendor bill points to does not offer inactive parts.
- **S9-R7:** If ShopView adds a barcode or scan part lookup, that lookup does not return inactive parts.
- **S9-R8:** Part lookup on a part sale line does not return inactive parts.
- **S9-R9:** Applying a canned job adds the job without its inactive parts.
- **S9-R9a:** A canned job part that was typed in as a vendor part, and whose number matches an inactive part at this location, is left out too.
- **S9-R10:** When a canned job leaves out parts, the system shows one warning listing every part left out: "These parts are inactive and were not added: {part numbers}." The warning stays until the user closes it.
- **S9-R10a:** When a part left out carries a fee, the fee is left out too, and the same warning adds "The {fee} fee for {part number} was not added." for each one.
- **S9-R11:** Part lookup on a vendor return and on a vendor credit includes inactive parts.
- **S9-R12:** In those lookups an inactive part carries a grey "Inactive" tag beside its description.
- **S9-R13:** A credit on any invoice, from a part sale or a work order, lists the parts sold on the invoice, active or inactive. A part that is now inactive carries the grey "Inactive" tag beside its part number.
- **S9-R14:** The part dialog of an inactive part shows the grey "Inactive" badge in its title row (S13-R3).
- **S9-R15:** A Part Library entry with no part stocked at this location is not offered in the lookups of S9-R1 to S9-R8 when its number matches an inactive part at this location.
- **S9-R16:** When the number typed in a part lookup matches an inactive part at this location, the lookup does not offer to add it as a special order. It shows "{part number} is inactive. Activate it from the Inactive tab to use it.", naming the inactive part's number. On technician charge-out, where a typed number is taken straight from the field, the field shows the same message as its error and the line cannot be saved.
- **S9-R17:** The system refuses an inactive part on new work however it arrives: adding a part to a work order or estimate line, raising a part request or special order, adding a part sale line, and adding a purchase order line or changing its part or number. The refusal reads "{part number} is inactive. Activate it from the Inactive tab to use it."
- **S9-R18:** Global search lists inactive parts at the current location. Each carries the grey "Inactive" tag.
- **S9-R19:** Selecting an inactive part in global search opens the Inventory list on the Inactive tab, searched to its part number.
- **S9-R20:** Global search shows "Not Tracked" for an untracked part, in place of its "{n} available" badge.

> *\* Context note: S9-R1 to S9-R8 are the point of the feature. The customer evidence in PRD 462 is a shop whose technicians could still select a retired number and bill it. S9-R16 and S9-R17 close the way round it: typing the retired number by hand as a special order.*

> *\* Context note: in S9-R9a, S9-R15, S9-R16 and S9-R17 a number "matches" an inactive part when the two are the same once upper and lower case, hyphens, asterisks, periods and spaces are ignored. A number that also belongs to an active part at this location is not refused.*

> *\* Context note: S9-R4 and S9-R7 describe screens ShopView does not have. They are kept so that any future lookup of that kind follows the same rule.*

> *\* Context note: the Inactive tab (Story 1) is what tells active and inactive parts apart on the Inventory list. If an "All" option is ever added (PRD 462, FR-012), a per-row badge becomes necessary.*

**Negative cases**

- **S9-N1:** A user who can view the Inventory list can open the Inactive tab. Seeing inactive parts needs no extra permission.
- **S9-N2:** A user who cannot view the Inventory list sees neither tab.
- **S9-N3:** Picking parts on a vendor return or a vendor credit needs the 'Part Library & Inventory → View' permission, as it does today. Without it the part search there shows the standard access error.

**Edge cases**

- **S9-E1:** A line that already holds a part when the part becomes inactive stays on its work order, estimate or part sale, including a completed part sale, and its totals keep calculating.
- **S9-E2:** The user can still change the quantity, price and notes on that line, and save it again with the same part or number.
- **S9-E2a:** Changing that line to a different part, or typing a different number on it, is new work and follows S9-R17.
- **S9-E3:** Converting that work order to an invoice succeeds.
- **S9-E4:** Completed and invoiced work orders that hold an inactive part stay viewable, printable and reportable.
- **S9-E5:** Reopening a completed work order does not make any part on it active.
- **S9-E6:** A part that becomes inactive while it is on an open purchase order or a special order can still be received, and picked onto the work order that ordered it. Ordering an existing part request is not new work.
- **S9-E7:** Splitting a work order moves its existing lines, including lines that hold an inactive part.
- **S9-E8:** The parts CSV import updates an inactive part in place and never makes it active.
- **S9-E8a:** In the parts CSV import, a blank Manufacturer cell keeps the entry's manufacturer.
- **S9-E9:** The public API refuses to create a part whose number already exists.
- **S9-E10:** If ShopView adds a way to raise a part request from a purchase order, it uses the purchase order's part lookup, which leaves inactive parts out (S9-R5). Today part requests are raised on the work order (S9-R1).
- **S9-E11:** Reports keep inactive parts. Inventory Value, Parts Velocity and the dashboard include them, because their stock still has value and their history still happened.
- **S9-E12:** The dashboard's Critical Reorder list leaves out inactive parts.

### Story 10: Confirming and Recording a Status Change

As a shop owner, I want a status change to be confirmed and recorded so that nobody retires parts by accident and I can see who did it.

**Design:** Part Lifecycle design canvas, page 2, boards 2.4 and 2.6; page 3, boards 3.3, 3.7 and 3.8; page 4, boards 4.4, 4.5 and 4.7; page 5, board 5.5  
**Jira:** SV-10823

**Prerequisites**

- User has the 'Part Library & Inventory → Delete' permission enabled.

**Requirements**

- **S10-R1:** A status change is confirmed before it is applied, from either entry point: the bulk bar (Stories 2 and 3), or Save in the part dialog after the user picks a different Part Status (S13-R21).
- **S10-R2:** The confirmation is the application's standard confirmation dialog. There is no confirmation word to type.
- **S10-R3:** Raised from the bulk bar, the confirmation is titled "Deactivate parts?" or "Activate parts?". Raised from the part dialog, it is titled "Deactivate part?" or "Activate part?".
- **S10-R4:** Raised from the bulk bar, the confirmation opens with "{n} parts selected.", or "1 part selected." for one. Raised from the part dialog, it opens with the part number followed by the description, as they stand in the form, with spaces before and after removed.
- **S10-R5:** For a deactivation from the bulk bar, the confirmation then states, in this order: "These parts won't show up when adding parts to work orders, estimates, part sales or purchase orders.", "Existing records that use them stay as they are.", and "Stock, cost of goods and QuickBooks aren't affected." With exactly one part ticked, the lines read "This part won't show up ..." and "Existing records that use it stay as they are."
- **S10-R6:** For a deactivation from the part dialog, the confirmation states, in this order: "This part won't show up when adding parts to work orders, estimates, part sales or purchase orders.", "Existing records that use it stay as they are.", and "Stock, cost of goods and QuickBooks aren't affected."
- **S10-R7:** For a reactivation from the part dialog, the confirmation states "This part can be added to new work again." and nothing more.
- **S10-R8:** For a reactivation from the bulk bar, the confirmation states "These parts can be added to new work again." ("This part ..." for one), followed by "Existing records that use them stay as they are."
- **S10-R9:** The "Existing records that use ..." line is medium weight. The "Stock, cost of goods and QuickBooks aren't affected." line is grey. Every other line is regular weight in the default text color.
- **S10-R10:** The confirmation has a note field labelled "Note (Optional)". It stops accepting input at 255 characters.
- **S10-R11:** The confirm button reads "Deactivate" in red for a deactivation and "Activate" in blue for a reactivation. Cancel sits to its left.
- **S10-R12:** After a bulk change, the system shows how many parts changed and how many failed.
- **S10-R13:** For each part that failed, the system names the part by its number and gives the reason.
- **S10-R13a:** The reasons are "A core follows its part. Activate or deactivate the part instead.", "Part not found." and "Part is already in that state."
- **S10-R14:** Every status change records the user who made it, and the date and time.
- **S10-R15:** Leaving the note empty, or entering only spaces, is allowed and records no note.
- **S10-R16:** Every status change is written to the part's Part History as its own entry. A part deactivated and later reactivated keeps both entries, each with its own note.
- **S10-R17:** The entry reads "Deactivated" or "Activated". When the user gave a note it reads "Deactivated | Reason: {note}" or "Activated | Reason: {note}". With no note it reads "Deactivated" or "Activated" and nothing more.
- **S10-R18:** A bulk change over forty parts writes forty Part History entries, one per part, each with the same note.
- **S10-R19:** A core's status change writes its own Part History entry on the core.
- **S10-R20:** A Part History entry keeps the Staff, Date and Time columns of every other entry, and can be found with the Part History search.
- **S10-R21:** The Part History table keeps its column layout whatever an entry says. A short entry does not widen the Staff, Date or Time columns.
- **S10-R22:** Turning tracking off writes the entry "Tracking turned off" to the part's Part History, and turning it on writes "Tracking turned on". A part with nothing on hand still gets the entry.
- **S10-R22a:** Changing Min or Max writes "Min/Max updated | Min: {old} → {new} | Max: {old} → {new} | Source: {source}" to the part's Part History, where the source is "Edit Part" or "Import". No entry is written when neither value changed.
- **S10-R23:** A changed part number writes "Part number updated | Original number: {old} | New number: {new}" to the Part History of the part at every location that stocks it.
- **S10-R24:** A changed description writes "Description updated | Original description: {old} | New description: {new}" to the Part History of the part at every location that stocks it.
- **S10-R25:** On the entries written at the other locations, the line ends with "| Changed at: {location}", naming the location where the change was made.
- **S10-R25a:** Entries written for a change made through the public API end with "| Changed through: Public API" at every location, in place of "| Changed at: {location}".
- **S10-R26:** When the part has a core, the core gets the same number or description entry. The core's description entries read its own description, "Core for {description}".
- **S10-R27:** The Part History search finds an entry when the typed text appears in its Event text as shown on screen, or in its Staff name. Upper and lower case do not matter. This applies to every kind of entry.
- **S10-R28:** An entry whose row is split by bin shows only the bin rows that match. A match on the Staff name shows every bin row.
- **S10-R29:** A price in an entry can be searched only by a user who can see prices.

**Negative cases**

- **S10-N1:** If the user cancels the confirmation, no part changes status.
- **S10-N2:** If every part in a bulk change fails, the list stays on screen and the selection is kept, so the user can retry.
- **S10-N3:** If a note longer than 255 characters reaches the system by any route, the change is refused with "A note cannot be longer than 255 characters."
- **S10-N4:** If a status change reaches the system with no parts in it, it is refused with "Select at least one part."

### Story 11: The Part Library Is Browse and Edit Only

As a shop owner, I want Part Library entries to exist only where a part number is in use so that the Part Library does not fill with entries nothing points at.

**Design:** Part Lifecycle design canvas, page 7, boards 7.1 and 7.2  
**Jira:** SV-10824

**Prerequisites**

- User is on the Parts → Part Library page.
- User has the 'Part Library & Inventory → Create & Edit' permission enabled.

**Requirements**

- **S11-R1:** The Part Library page has no control that creates a Part Library entry.
- **S11-R2:** No dialog for creating a Part Library entry can be reached from the Part Library page.
- **S11-R3:** Clicking a row opens that entry's detail page, where it can be edited and deleted.
- **S11-R3a:** Changing an entry's number or description on its detail page follows the part dialog's rules: S13-R12 to S13-R19, S13-N1, S13-N7, and S10-R23 to S10-R25.
- **S11-R3b:** On the Part Library page, a part number is saved exactly as typed, with upper and lower case kept, the same as in the part dialog.
- **S11-R4:** Row selection on the Part Library list and its bulk "Set category" action stay available.
- **S11-R5:** Search, filtering, sorting and the column set on the Part Library list stay available.
- **S11-R6:** A new Part Library entry is created only from a part number in use: creating an inventory part (S7-R7 and S7-R8), a part request when the requested part is received, a delivery receipt, a core charge, returning a special-order part to inventory, returning a core to inventory, the parts CSV import, and the public API.
- **S11-R6a:** Every route in S11-R6 removes spaces before and after the part number before it looks for an exact match.
- **S11-R7:** A user with the 'Part Library & Inventory → Create & Edit' permission and a user without it see the same Part Library toolbar.

**Negative cases**

- **S11-N1:** No route, on screen or behind it, produces a Part Library entry with no inventory part, part request, delivery receipt, core charge, return or import row behind it. The one exception is the public API (S11-E3).

**Edge cases**

- **S11-E1:** Part Library entries that exist on the day of release stay in the list, including the ones nothing references. This spec does not delete or hide them.
- **S11-E2:** An entry with no inventory part behind it can still be edited from its detail page, and is the entry a new part links to when its number is typed exactly (S7-R5).
- **S11-E3:** The public API create is a separate integration and is not changed by S11-R1.

> *\* Context note: in the reference dataset 29,376 Part Library entries, 19,664 with no inventory part, and 17,359 with no inventory part and no part request either. No standalone create is what keeps that number from growing.*

### Story 12: Call the Shared Parts List the Part Library

As a shop owner, I want the shared parts list to be called the Part Library everywhere I read it so that the name matches what the screen does.

**Design:** Part Lifecycle design canvas, page 7, board 7.1  
**Jira:** SV-10825

**Prerequisites**

- None. This story is display text only.

**Requirements**

- **S12-R1:** The Parts left menu entry reads "Part Library".
- **S12-R2:** The page title on that screen reads "Part Library".
- **S12-R3:** The dialog for editing a Part Library entry is titled "Edit Library Part".
- **S12-R4:** The failure message when saving a Part Library entry reads "Failed to save library part."
- **S12-R5:** The success message when deleting a Part Library entry reads "Library part deleted successfully."
- **S12-R6:** On Administration → Roles & Permissions → Edit Role, the permission group is titled "Part Library and Inventory".
- **S12-R7:** That group's description reads "Manage the parts library and inventory levels."
- **S12-R8:** The Parts Department card description above that group reads "Manage parts inventory, part library, sales, and vendor operations."
- **S12-R9:** The three permission labels read "Part Library & Inventory — View", "Part Library & Inventory — Create & Edit" and "Part Library & Inventory — Delete".
- **S12-R10:** A part lookup result that comes from the shared list shows its source as "Part Library".
- **S12-R11:** Refusals that name the shared list read: "This Part Library entry is in use and cannot be deleted.", "Part Library entry not found.", "Part Library entry not found", "Part Library entry not found for ID: {id}.", "Part Library entry not found for part number: {part number}.", "Part Library entry missing category." and "A part from the Part Library must have Vendor as its source."
- **S12-R12:** The browser tab titles read "Part Library" on the list and "Library Part" on an entry's detail page.
- **S12-R13:** Deleting a Part Library entry asks "Are you sure you want to delete this library part?"
- **S12-R14:** A special-order lookup result shows its source as "Part Library · {vendor}".

**Negative cases**

- **S12-N1:** No permission is added, removed or re-keyed. Every user's access on release day is identical to the day before.
- **S12-N2:** The address of the Part Library page stays the same, so bookmarks and saved links still open it.
- **S12-N3:** No stored data is renamed. The story is confined to text a user reads on screen.

> *\* Context note: a catalog is something a shop buys from. This list is the shop's own record of the parts it knows, which is a library.*

### Story 13: The Part Dialog

As a parts manager, I want one dialog to set up a part, correct its number or description, and set its status so that every change to a part happens in one place and keeps the part's history.

**Design:** Part Lifecycle design canvas, page 1, board 1.1; page 2, boards 2.1 and 2.2; page 3, boards 3.1 to 3.4 and 3.6; ShopView Design System (Modal, Button, Radio)  
**Jira:** SV-10826

**Prerequisites**

- User is on the Parts → Inventory page.
- User has the 'Part Library & Inventory → Create & Edit' permission enabled to save.

**Requirements: layout**

- **S13-R1:** The dialog is titled "New Inventory Part" when creating a part and "Edit Inventory Part" when editing one.
- **S13-R2:** The title row has a thin line under it, and the close X at its right end.
- **S13-R3:** When editing, the title row shows the part's saved status as a pill beside the close X: "Active" in green, or "Inactive" in grey.
- **S13-R4:** The fields appear in this order: Description, Part Number, Part Status (editing only), Vendor, Category, Manufacturer, Average Cost (editing) or Cost (creating), Sell Price, Core Charge, Inventory Tracking (the switch, then Min and Max), Tags, and Inventory (bin locations, then "Add Bin Location").
- **S13-R4a:** Vendor is hidden where the screen that opens the dialog hides it. Cost, Average Cost, Sell Price and Core Charge show only to a user who can see financial data. Min and Max show only while tracking is on (S4-R5).
- **S13-R5:** "Add Bin Location" has a plus icon before its label.
- **S13-R6:** The footer has a thin line above it. "Delete Part" sits at its left; Cancel and Save sit at its right.
- **S13-R7:** "Delete Part" is the design system's danger button: red, with a white trash icon and white label.
- **S13-R8:** Cancel is the design system's secondary button: white, with a grey outline and dark label. It closes the dialog without saving.
- **S13-R9:** Save is the design system's primary button: blue, with a white label.
- **S13-R10:** Delete Part is shown only when editing, to a user with the 'Part Library & Inventory → Delete' permission.

**Requirements: description and part number**

- **S13-R11:** When editing, Description and Part Number are plain text fields holding the part's current values.
- **S13-R12:** When the user changes the description and at least one other location stocks the same Part Library entry, the dialog shows, under the field, "This also changes the description at {n} other locations.", or "This also changes the description at 1 other location." for one.
- **S13-R13:** That message shows only while the typed description differs from the saved one, ignoring spaces before and after it.
- **S13-R14:** Saving a changed description changes the part's Part Library entry, so every location that stocks the part shows the new description.
- **S13-R15:** A changed description also renames the part's core, which reads "Core for {description}".
- **S13-R16:** When the user changes the part number and at least one other location stocks the same Part Library entry, the dialog shows, under the field, "This also changes the part number at {n} other locations.", or "This also changes the part number at 1 other location." for one.
- **S13-R17:** That message shows only while the typed number differs from the saved one, ignoring spaces before and after it. Parts at other locations count whether they are active or inactive.
- **S13-R18:** Saving a changed number renames the part in place. The part keeps its identity, its history, and every line that holds it. Its Part Library entry is renamed with it, and its core takes the same number. No new Part Library entry is created.
- **S13-R19:** A rename carries over to open work that holds this part, at every location: purchase order lines not yet fully received, part requests not yet received or returned, canned jobs, and returns that are not completed take the new number. A delivery that is not yet accepted is covered by its open purchase order lines. Receiving, ordering, applying a canned job and returning then find the renamed part.
- **S13-R19a:** A line that only shares the old number, typed in by hand with no link to this part, keeps its number.
- **S13-R19b:** Vendor bills already accepted keep the number they were written with.
- **S13-R19c:** For a line linked to the renamed part, accepting a delivery uses the part's current number, even when the Receive screen was opened before the rename. No Part Library entry is created for the old number. A hand-typed line (S13-R19a) is received under its own number.
- **S13-R19d:** A change to a part's number or description made through the public API follows the same rules as the part dialog: S13-R14, S13-R15, S13-R18, S13-R19, S13-N1, S13-N7 and S10-R23 to S10-R25.

**Requirements: status**

- **S13-R20:** When editing, a "Part Status" choice offers two options, Active and Inactive, set to the part's saved status. A user without the 'Part Library & Inventory → Delete' permission sees the choice disabled.
- **S13-R21:** Picking a different status changes nothing until Save. When Save is pressed with a different status picked, the confirmation of Story 10 opens first.
- **S13-R22:** Confirming saves every change in the dialog, then applies the status, and closes the dialog with "Part deactivated." or "Part activated.".
- **S13-R23:** Cancelling the confirmation saves nothing and returns to the dialog with the picked status kept.
- **S13-R24:** Saving with the saved status picked saves the part with no confirmation.
- **S13-R25:** The title row pill shows the saved status, not the picked one.

**Requirements: delete**

- **S13-R26:** Delete Part deletes the part and closes the dialog. It asks for no confirmation.
- **S13-R27:** When the part sits on a work order, Delete Part does nothing and hovering it shows "Please delete related work order parts first."
- **S13-R28:** When the part has a return or credit that is not completed, Delete Part does nothing and hovering it shows "Please complete or cancel the related return or credit first."

> *\* Context note: S13-R14 and S13-R18 follow from the description and the number living on the shared Part Library entry. S13-R12 and S13-R16 make that reach visible before the save. Changing either needs only Create & Edit (S8-R11); the message is what makes it deliberate.*

> *\* Context note: S13-R19 matters because those records hold their own copy of the number and find the part by it later. Records already completed, such as received purchase order lines, completed returns and past work orders and invoices, keep the number they were written with. The Inventory list, Part History, Parts Velocity and today's Inventory Value show the new number. Inventory Value run for a date before the rename shows the number as it was on that date.*

**Negative cases**

- **S13-N1:** If another Part Library entry already has exactly the typed number, with the same characters and the same upper and lower case, the save is refused, the dialog stays open, and the system shows "Part number {number} already belongs to another part in the Part Library."
- **S13-N2:** An empty Description shows "Description is a required field" and an empty Part Number shows "Part number is a required field". The part is not saved.
- **S13-N3:** Saving with the number unchanged changes nothing about the number, the Part Library entry or open work.
- **S13-N3a:** A typed number that differs from the saved one only by spaces before or after it is not a change. The saved number is kept as it is.
- **S13-N4:** If the status change is refused after the save, the confirmation stays open and the system shows "This part could not be deactivated" or "This part could not be activated", with the reason.
- **S13-N5:** If saving the form is refused while the confirmation is open, the confirmation closes, the dialog shows the refusal, and nothing is saved.
- **S13-N6:** If Delete Part reaches the system while the part sits on a work order, or has a return or credit that is not completed, the delete is refused with "Inventory part that has a work order part cannot be deleted." or "Inventory part with an open return or a pending credit cannot be deleted." Only that message is shown.
- **S13-N7:** If the new number is longer than 50 characters and the part sits on an open part request, the save is refused with "Part number can't be longer than 50 characters while it's on an open part request."
- **S13-N8:** If a request to point a part at a different Part Library entry reaches the system by any route, it is refused with "A part can't be moved to a different Part Library entry."
- **S13-N9:** The parts CSV import never moves a part to a different Part Library entry and never changes an entry's part number.
- **S13-N9a:** When an import row's number matches a Part Library entry that is already stocked as a part at this location, the import updates that part. It never adds a second part on the same entry. A match ignores upper and lower case, hyphens, asterisks, periods and spaces, so re-importing an old number that differs from the new one only in those ways updates the renamed part.

**Edge cases**

- **S13-E1:** Pointing a part at a different Part Library entry is not offered in the part dialog, and the system refuses it by any other route. Re-importing a part through the parts CSV import with a fully different old number creates a separate part under the old number. Both are for the merge and duplicate tool (Out of scope).

## 8. User Feedback Summary

| **Trigger** | **Message** | **Behavior** |
| --- | --- | --- |
| Tracked part saved with no bin | "At least one bin must be provided." | Error toast, fades after 3 seconds |
| Tracked part saved with no default bin | "At least one bin must be marked as default." | Error toast, fades after 3 seconds |
| Description field empty or only spaces | "Description is a required field" | Inline error on the field, stays until corrected |
| Part Number field empty or only spaces | "Part number is a required field" | Inline error on the field, stays until corrected |
| Empty description reaches the system by another route | "Description is required." | Error toast, fades after 3 seconds |
| Empty part number reaches the system by another route | "Part number is required." | Error toast, fades after 3 seconds |
| New part's number already stocked here, active | "{part number} already exists at this location." | Error toast, fades after 3 seconds |
| New part's number already stocked here, inactive | "{part number} already exists at this location and is inactive. Activate it from the Inactive tab." | Error toast, fades after 3 seconds |
| New part linked to an entry whose description differs | "Part created. Linked to {part number} in the Part Library. Its description "{library description}" was kept." | Success toast, fades on its own |
| Description changed on a part other locations stock | "This also changes the description at {n} other locations." ("1 other location." for one) | Text under the field while it differs |
| Part number changed on a part other locations stock | "This also changes the part number at {n} other locations." ("1 other location." for one) | Text under the field while it differs |
| Part number already belongs to another entry | "Part number {number} already belongs to another part in the Part Library." | Error toast, fades after 3 seconds; the dialog stays open |
| Rename over 50 characters with an open part request | "Part number can't be longer than 50 characters while it's on an open part request." | Error toast, fades after 3 seconds; the dialog stays open |
| Part pointed at a different Part Library entry | "A part can't be moved to a different Part Library entry." | Error toast, fades after 3 seconds |
| Part save fails (server error) | "Failed to save part." with "Please try again." | Error toast, fades after 3 seconds |
| Part delete fails (server error) | "Failed to delete part." with "Please try again." | Error toast, fades after 3 seconds |
| Delete refused, part on a work order | "Inventory part that has a work order part cannot be deleted." | Error toast, fades after 3 seconds |
| Delete refused, part has an open return or credit | "Inventory part with an open return or a pending credit cannot be deleted." | Error toast, fades after 3 seconds |
| Delete Part hovered on a part on a work order | "Please delete related work order parts first." | Tooltip |
| Delete Part hovered on a part with an open return or credit | "Please complete or cancel the related return or credit first." | Tooltip |
| Part deactivated from the part dialog | "Part deactivated." | Success toast, fades on its own |
| Part activated from the part dialog | "Part activated." | Success toast, fades on its own |
| Status change from the part dialog refused | "This part could not be deactivated" / "This part could not be activated", with the reason | Error toast, stays until closed |
| Status change from the part dialog fails (server error) | "Failed to set this part inactive" / "Failed to set this part active", with "Please try again or contact support for help" | Error toast, fades after 7 seconds |
| Bulk change, every part changed | "{n} parts updated." ("1 part updated." for one) | Success toast, fades on its own |
| Bulk change fails (server error) | "Failed to update part status" with "Please try again or contact support for help" | Error toast, fades after 7 seconds |
| Bulk change, some parts failed | "{n} parts updated, {m} could not be changed." ("1 part updated, {m} could not be changed." for one) | Error toast, stays until closed, lists each failed part and its reason |
| Bulk change, every part failed | "No parts were changed." | Error toast, stays until closed, lists each failed part and its reason |
| Deactivate hovered with nothing ticked | "Tick the parts to deactivate" | Tooltip on the disabled button |
| Activate hovered with nothing ticked | "Tick the parts to activate" | Tooltip on the disabled button |
| Deactivate or Activate hovered with more than 200 ticked | "Select 200 parts or fewer." | Tooltip on the disabled button |
| A core asked to change status on its own | "A core follows its part. Activate or deactivate the part instead." | Listed as the failure reason |
| A part missing when the change runs | "Part not found." | Listed as the failure reason |
| A part already in the requested state | "Part is already in that state." | Listed as the failure reason |
| Note longer than 255 characters | "A note cannot be longer than 255 characters." | Error toast, fades after 3 seconds |
| Status change with no parts in it | "Select at least one part." | Error toast, fades after 3 seconds |
| Inactive tab with no parts, nothing narrowing it | "No inactive parts at this location." | In place of the list |
| Untracked part in Cycle count | "Not Tracked" | In the count column, in place of the count boxes |
| Untracked part in global search | "Not Tracked" | In place of the "{n} available" badge |
| Canned job leaves out inactive parts | "These parts are inactive and were not added: {part numbers}." plus "The {fee} fee for {part number} was not added." for each fee left out | Warning toast, one per canned job, stays until closed |
| Retired number typed in a part lookup | "{part number} is inactive. Activate it from the Inactive tab to use it." | Shown in the lookup in place of the special order offer; on technician charge-out, error under the field |
| Inactive part reaches new work by another route | "{part number} is inactive. Activate it from the Inactive tab to use it." | Error toast, fades after 3 seconds |
| Part Library entry in use deleted | "This Part Library entry is in use and cannot be deleted." | Error toast, fades after 3 seconds |
| Part Library entry missing | "Part Library entry not found.", "Part Library entry not found for ID: {id}." or "Part Library entry not found for part number: {part number}." | Error toast, fades after 3 seconds |
| Part request from a Part Library entry with no category | "Part Library entry missing category." | Error toast, fades after 3 seconds |
| Part request from a Part Library entry with a source other than Vendor | "A part from the Part Library must have Vendor as its source." | Error toast, fades after 3 seconds |

> *\* Context note: every refusal sent by the system, the rows that fade after 3 seconds, also shows a second, smaller line under the message: "Please try to resolve this." Messages the screen builds itself carry their own second line, as listed, or none.*
