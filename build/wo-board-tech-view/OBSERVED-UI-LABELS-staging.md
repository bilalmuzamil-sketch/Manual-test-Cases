# WO Board & Tech View — labels observed on STAGING

## 2026-10-14 — staging app.staging.shopview.com, build v26.40.17-ddb9ba1 (admin quick-login; location Staging Heavy Duty - 9919)
Evidence: `build/wo-board-tech-view/build-verify-staging-2026-10-14/probe/`.
- Top menu: `Work Orders` · `Schedule` · `Customers` · `Parts` · `Reports`. Work Orders tabs: `All` · `Estimates` · `Work Orders` · `Completed`.
- Toolbar: `Search` · `Status` · `Assigned to me` · `Asset on Site` (chip; on this shared admin account it showed `Asset on Site: Yes` with an x — a remembered choice, the filter definition has no default) · density/width icons · display switcher `List` / `Tech View` / `Board View` (aria-labels and tooltips with exactly those words) · `Create Work Order`.
- Status options: `Estimate` · `Approved` · `In progress` · `Review` · `Complete` · `Invoiced` · `Paid` · `Declined` · `Imported` (helper text `Imported work orders open in List.`) · `Clear selection`.
- Board View card `more_horiz` menu: `Reassign lead technician` → window `Reassign lead technician` (work order · customer, searchable technician list with `N open`) · `Cancel` / `Reassign` (opened and cancelled; nothing saved).
- In the build's code (not triggered on screen): clear-shifts question `Clear <lead>'s scheduled shifts?` with `Keep shifts` / `Clear shifts` (ClearShiftsPrompt); empty state `No work orders match these filters` + `Try removing a filter to widen your results.` + `Clear all filters`, and `No work orders match the search "<text>".`; messages `Lead technician updated` / `Lead technician removed`; Imported tooltip `Not available while Imported is selected`.
- Schedule: `Today` with arrows either side, date `Wed, Oct 14`, views `Day` · `Week` · `Month`.
- Work order page tabs: `Lines (n)` · `Parts (n)` · `Notes (n)` · `Timesheets (n)` · `History (n)` · `Stats` · `Finance`; each line has a `Labor` row; clicking the line name opens `Edit Line` (`What Are You Doing?` · `Why Are You Doing It?` · `Status` · `Technicians` · `Add Technician` · `Labor Rate` · `Estimated Time` · `Tech Time` · `Delete` · `Save & Close`) — closed without saving.
- Departments include `Service`.

## 2026-10-14 (second set) — same build v26.40.17-ddb9ba1, same location
Evidence: `build-verify-staging-2026-10-14/probe/10-*` to `13-*` (no write made during any probe).
- Board View toolbar also shows `Density` (`Compact` · `Regular` · `Comfortable`) and `Fields to display`, whose list reads: `Lead technician` · `Customer` · `Asset` · `VIN/serial` · `Progress` · `Service advisor` · `Clocked in` · `Line count` · `Line technicians` · `Estimated hours` · `Total price` · `On-site` · `Created date`. (There is no item called "Lead technician name".)
- Board View column header for a pinned technician has `Unpin <name>`; each card has `More actions for <work order number>`.
- List columns: `On Site` · `Status` · `Waiting On Parts` · `Number` · `Customer` · `Asset` · `Unit` · `VIN/Serial #` · `Progress` · `Service Advisor` · `Lead Technician` · `Clocked In` · `Lines` · `Total Price` · `Created On` · `Invoiced Date` · `Days Open` · `Parts` · `Returns`.
- Work order page side panel: `Total Hours: <n> hrs` · `Progress` · `Lead Technician` (dropdown) · `Service Advisor`.
- New Line form: `What Are You Doing?` · `Why Are You Doing It?` · `Technicians` · `Add Technician` · `Labor Rate` · `Estimated Time` · `Tech Time` · `Line Approved` · `Save & Add Part` · `Save & Add Line` · `Save & Close`.
- In the build's code (not triggered on screen): refusal text containing `can't be assigned work orders`; `Inactive` marking in Board View.
- Settings > Staff: `New Staff Member` · tabs `Active(n)` · `Deactivated(n)`; edit form `First Name` · `Last Name` · `Email` · `Salary Type` · `Hourly Rate` · `Job Title` · `Role` · `Location` · `Billable`.
- Profile menu (initials): `Edit Profile` · `Change Location:` · `My Timesheets` · `Settings` · `Logout`.
- Settings menu group `IMPORTS` > `Invoices` opens `Invoices Import Preview` with `Select CSV File` · `Download Template` · `Import Invoices` and the column list (`Shop Location, Customer, … Invoice Number, Invoice Date, … Item, Line Title - What are you doing, … Qty, Rate, Total, Tax Amount`). The success message after an import was not seen (no import was made — outside this lane).
- Schedule: left panel `Search work orders`; dropping a multi-line card opens a window with tabs `Entire work order` / `Choose lines`.
  - `Entire work order`: `Schedule` dropdown (default `Remaining time (<n>h)`; choose `Specific hours…` to get the `Hours` − / + control); summary line `<n> shift(s) · <h>`; buttons `Cancel` / `Create <n> shift(s)` (for example `Create 2 shifts`).
  - `Choose lines`: `Search lines` · `All <n>` · `Unscheduled <n>` · `Select all`; each line shows `<h> left of <h>` or `Est. <h>` or `No estimate`; `Hours` − / +; with nothing ticked the button reads `Select lines`, with lines ticked `Create shift · <n> line · <h>` (seen: `Create shift · 1 line · 1.5h`).
