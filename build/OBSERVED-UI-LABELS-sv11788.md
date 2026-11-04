# OBSERVED UI LABELS — sv11788.qa.shopview.com, build `v26.43.5-9596ea9`, read 2026-11-04

Every label below was read on screen this pass by the probes in `build/technician-toggle-bv/probe/`
(p01–p18; text dumps and screenshots are committed beside each script). Signed in as the quick-login
Admin at Staging Heavy Duty - 9919. The version label names a develop commit that lacks the feature;
the screen shows the feature (see `build/technician-toggle-bv/README.md`, "Build facts").

## Top bar and profile menu (p02, p13, p15)
- Top bar: `ShopHub` · `Dashboard` · `Work Orders` · `Schedule` · `Customers` · `Parts` · `Reports` · `Search customers, work orders, parts...` · `Clock In` · location name + initials (profile button).
- Profile menu: `Edit Profile` · `Change Location: <location>` (opens a list of locations: `Staging Heavy Duty - 9919`, `Staging Lethbridge - 4310`) · `My Timesheets` · `Customer Portal` · `Billing` · `What's New` · `Settings` · `Logout`.

## Settings (p02, p04, p11, p16)
- Tabs: `Settings` · `Staff` · `Roles & Permissions` · `Locations` · `Departments` · `Taxes` · `Labor Rates` · … (full list in probe 02).
- Staff tab: `Search` (placeholder `Type to search`) · `Permissions: …` · `Locations: …` · `Departments: …` · `New Staff Member` · notice `New: Decide who appears on Board View, Tech View and the technician dropdowns. …` · tabs `Active(n)` / `Deactivated(n)` · columns `First Name` `Last Name` `Email` `Job Title` `Role` `Department(S)` `Created` `Confirmed Invitation` `Technician` (with `New` pill) `Billable` · row edit icon.
- New Staff Member: fields `First Name` `Last Name` `Email` `Salary Type` `Salary` `Job Title` `Role` `All Departments` `Location` `Billable`; toggles `Time Clock` · `Sales Representative` · `Technician` + `New`; hints `Turn on Time Clock first. Only staff who clock in can be technicians.` and (Office User, Time Clock User) `This role can't be a technician.`; buttons `Save & Add Next` · `Save & Close`; note `Adding new staff members will impact billing.`
- Role list: `Admin` `Foreman` `Office User` `Parts Manager` `Parts Technician` `Sales Representative` `Senior Service Advisor` `Service Advisor` `Service Manager` `Technician` `Time Clock User`.
- Edit Staff Member: as above plus `Hourly Rate`, `TECHNICIAN HOURS`, `Resend Invitation`, `Deactivate Account` (acts at once, no confirmation), `Delete`, `Save & Close`; on a deactivated person `Activate Account`. No phone number field.
- Turn Off Technician window: `<name> leads 1 open work order and is on 1 labor line. They'll stay on them, but won't be offered as a technician on anything new.` · `Cancel` · `Save`.
- Roles & Permissions: `Create Custom Role` → `Choose a template` (`Admin` … `Technician` `Time Clock User`) · `Skip` · `Apply` → `Create Role`: `Role name*` · `Description` · under Work orders `View mode` `Full View` / `Tech view` · `Reset To Template` · `Cancel` · `Create`.
- Locations: `New Location` → `Name *` `Shop Id` `Address 1` … `Timezone` … `Save & Close`.
- Departments: `New Department` → `Name` · `Enable time clock?` · `Display on schedule?` · `Save & Close`.

## Work Orders (p06–p10, p13, p15–p18)
- Tabs `All` `Estimates` `Work Orders` `Completed`; `Search` · `Assigned to me` · `Technician` filter (`Unassigned`, people, `Clear selection`) · `Asset on Site` · three view icons `List` / `Tech View` / `Board View` · `Create Work Order`.
- Board View: column per person with a pin button (`Pin <name>`); `Unassigned` column; card `···` button (`More actions for <number>`) → `Assign lead technician` (opens a window of the same name listing people with open counts, `Cancel`).
- New Work Order: `Customer` · `Asset` · `Save`; then `Customer Notes` (`Ok`) and `New Line`: `Title` · `Description` · `Technicians` · `Add Technician` · `Labor Rate` · `Estimated Time` · `Tech Time` · `Line Approved` · `Save & Add Part` · `Save & Add Line` · `Save & Close`.
- Work order page: card at left `Lead Technician` (a dropdown once the work order has a line; read-only `Lead technician` before) · `Service Advisor` · `Sales Representative`; tabs `Lines` `Parts` `Notes` `Stats` `Finance` and `⋮` → `Audit Log` · `Timesheets (n)` · `Add Work Order Fee / Discount` · `Print Work Order` · `Delete Work Order`.
- Line: clicking the title opens `Edit Line` (`Title` `Description` `Status` `Technicians` `Add Technician` `Labor Rate` … `Delete` `Save & Close`); right-click menu `Request part` · `Add line note` · `Save as canned line` · `Story history` · `Audit log` · `Add inspection` · `Edit labor` · `Authorization required` · `Decline` · `Delete line`; `Edit labor` opens `Edit Labor` (`Technician`, `Max 5 selections`, `Save & Close`); labor row `Start` / `Stop`, line action `Complete`. `Start` clocks the signed-in user in on the line and the work order then shows `In Progress`; `Stop` opens `Stop working on …` (`Line Completed?`, `What Have You Been Doing On This Line?`, `Clock Out`).
- Timesheets tab: `Filter By Technician`; columns `Name` `Line` `Description` `Date` `Start Time` `End Time` `Total Time` `Last Edited`.

## Reports, Schedule, Parts (p11, p12, p13, p15)
- Reports left menu includes `Timesheet Activities` (route punch-clock-activities; filter `Filter by Staff`), `Technician Efficiency` (no technician filter seen), `Technician Utilization` (filter `Technician: All technicians`).
- Schedule: month header, `Filters`.
- Parts left menu: `Part Sales` · `Inventory` · `Catalog` · `Returns` · `Purchase Orders` · `Vendor Invoices` · `Vendors`; Part Sales `New Part Sale` → `New part sale` (`Customer`, `Save`).

## Not seen on this build this pass
`No technicians yet` / `Set Up Technicians` / `Nothing here yet` (no location without technicians) · `Deleted technician` in the Technician filter · `Reassign lead technician` (only `Assign …` on a card with no lead) · the Sales Representative removal warning · a part sale's own page · Schedule department lanes · the add-time-entry window · signing in as a newly made staff member · putting a work order in Ready for Review / Declined / Complete / Invoiced / Paid.
