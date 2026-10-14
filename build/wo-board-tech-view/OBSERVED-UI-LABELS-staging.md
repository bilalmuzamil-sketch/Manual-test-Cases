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
