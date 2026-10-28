# What/Why (Title and Description) — screen names observed on STAGING

Each label below was read on staging during the build verification of 28 Oct 2026, build **v26.43.1-f2d183d**,
signed in with the Admin role at Staging Heavy Duty - 9919. Evidence: `build-verify-staging-2026-10-28/probe/`
(file number in brackets). Labels are quoted as displayed.

## Top bar, location and Settings
- Top bar: `Dashboard` · `Work Orders` · `Schedule` · `Customers` · `Parts` · `Reports`; location box at the top right shows the location name and the initials [01, 02].
- Location box menu: `Edit Profile` · `Change Location:` (current location shown as a button; choices `QB Location` · `Staging Heavy Duty - 9919` · `Staging Lethbridge - 4310` · `DVI Test`) · `My Timesheets` · `Customer Portal` · `Billing` · `What's New` · `Settings` · `Clock Out & Logout` · `Logout` [02, 15, 15c].
- Settings page tabs: `Organization` · `Invoice` · `Work Orders` [02].
- Work Orders tab: `WORKFLOW` · `Require Approval for New Lines` · `LINE REQUIREMENTS` · `Require Tech Story` · `Require Mileage` · `Require Engine Hours` · `PARTS` · `Save Settings` [02, 03].
- Invoice tab: `Legacy invoice layout` · `Save Details` [02, 03].
- Settings left menu headings and items: `SETTINGS` (`Settings`, `Staff`, `Roles & Permissions`, `Locations`, `Departments`, `Taxes`) · `SERVICE` (`Labor Rates`, `Canned Lines`, `Fees & Discounts`, `Asset Types`, `Inspection Templates`) · `PARTS` · `INTEGRATIONS` (`QuickBooks`, `IBS`, `Open API`) · `FINANCE` · `IMPORTS` (`Contacts`, `Assets`, `Vendors`, `Inventory`, `Invoices`) [01, 02-invoices-import.png].
- Canned Lines list includes `Replace - Torque rod` [02].
- Invoices import page: `Invoices Import Preview` · `Select CSV File` · `Download Template` · `Import Invoices`; column list "… Item, Line Title, Line Description, Tech Story, …" [02].
- Roles & Permissions: `Create Custom Role`; role `Admin` described `Full system access`; role editor: `Work orders` · `Work order lines` · `Invoicing & payments` (`View` · `Create & Edit` · `Delete / Reverse`) · `Page Access` → `Reports`, `Settings` (… `Data Import` …) · `Cross-Cutting Toggles` → `See Financial Data` [03, 04, 11].

## Work orders
- Work Orders page: tabs `All` · `Estimates` · `Work Orders` · `Completed`; `Search` (opens "Type to search"); filters `Status: Review` and `Asset on Site: Yes` on by default, each with an x; views `List` · `Tech View` · `Board View`; `Create Work Order` [03, 11].
- Status filter choices: `Estimate` · `Approved` · `In progress` · `Review` · `Complete` · `Invoiced` · `Paid` · `Declined` · `Imported` · `Clear selection` [11].
- List columns include `Created On` · `Invoiced Date` [06].
- `New Work Order` window: `Customer` · `Add Asset` · `Asset Here?` · `Save`; over-limit customer: `Confirmation` "…over their credit limit." `Create` · `Cancel` [04, 06b].
- A new, empty work order opens on its Lines tab with the New Line window already open [06b].
- Work order tabs: `Lines` · `Parts` · `Notes` · `Stats` · `Finance`; `New Line`; `Create Invoice` once lines are complete; work order menu: `Audit Log` · `Timesheets` · `Add Work Order Fee / Discount` · `Print Work Order` · `Delete Work Order` [03, 09].
- `New Line` window: `AI` `SHOPCOACH LINE BUILDER` · `Title` (prompt "What are you doing?") · `Description` (prompt "Why are you doing it?") · `Technicians` · `Add Technician` · `Labor Rate` · `Estimated Time` · `Tech Time` · `Line Approved` · `Save & Add Part` · `Save & Add Line` · `Save & Close`; X closes it [03, 05, 07]. Typing a title opens a list of canned lines; Tab leaves it [07]. `SHOPCOACH LABOR GUIDE` appears once a title is typed [07].
- `Edit Line` window (click a line's title): `Title` · `Description` · `Status` · `Technicians` · `Add Technician` · `Labor Rate` · `Estimated Time` · `Tech Time` · `AI` `SHOPCOACH LABOR GUIDE` · `Delete` · `Save & Close`; X closes it [05].
- The line window capitalises the first letter of Title and Description on leaving the box (typed "excessive play", saved "Excessive play") [07].
- Line row: status `Approved`, Action `Complete`; `Story` row `Add tech story for this line` → `Tech Story: <line title>` window with `Update` [07, 08]. Completing the only line sets the work order to `Complete` by itself [08, 09].
- Finance tab: `Estimate/Invoice` switch · `Create Invoice`; after invoicing a balance, the `New Customer Payment` window (`Make Payment` · `Charge Account` · `Send to Terminal`, X closes it); invoice heading `Invoice: INV-<number>`; invoice menu `Reverse` · `Issue Credit` [09, 10].
- `New Work Order Fee / Discount` window: `Apply From Template` · `Name` · `Type` (`Fee`) · `Calculation Type` · `Amount` · `Taxable` · `Cancel` · `Add Fee` [12].
- Financial Info card: `Shop Supplies` row; `Edit shop supplies charge` [13].
- ShopCoach on the Lines tab: `AI` `SHOPCOACH LINE BUILDER`, box "e.g. Dot Inspection, Oil Change, Check Engine Light", `Build Lines` [00 screenshot, 06b].

## Reports
- Reports left menu, `ACCOUNTING`: `IBS Batches` · `QB Unexported` · `Export Reports` [01].
- `Export Report` dialog: `Report Name` · `Date Range` (`Custom` · `Today` · `Yesterday` · `This Week` · `Last Week` · `This Month` · `Last Month`) · `Export`; Report Name list includes `Customer Invoice` [02, 03].
- `Quickbooks Unexported Items`: tabs `Customers (n)` · `Vendors (n)` · `Journal Entries (n)` [02, 12].

## Not seen this pass
- The clear (x) button in the Title box after picking a canned line; receiving a part; the Reverse confirmation; signing in as a second user with a custom role; anything inside QuickBooks.

## Records seen
- Work order `S2-16710` at Staging Heavy Duty - 9919 (started Jul 21, 2026): line 2 `Service - Adjust engine oil level`, description `High` [04 lineRowText, 00 wo-lines screenshot].

## Values the tester types (test data, not screen labels — listed so the label check does not mistake them for labels)
`Replace tie rod` · `Replace tie rods` · `Replace tie rod - passenger side` · `Excessive play - customer waiting` ·
`Excessive play; also checked the drag link` · `Both outer ends worn, replaced and aligned` · `Torqued to 74 ft-lb, alignment set` ·
`Drag link within spec` · `Align front axle` · `Pulls left` · `Aligned to spec` · `=Replace hose` · `+Replace hose` · `-Replace hose` ·
`@Replace hose` · `Replace hose` · and the import-file headers the tester writes: `*Line Title` · `*Line Name` ·
`*Line Title - What are you doing` · `Line Description - Why are you doing it` · `*line title - WHAT ARE YOU DOING`.

## Quoted in setup but NOT observed
- The placeholder tech-story text the app is meant to store when a line is saved from Edit Line without a tech story (C549082, C839523, C839524); not seen this pass.
