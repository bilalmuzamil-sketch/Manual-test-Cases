# OBSERVED UI LABELS — Dashboard · sv490.qa.shopview.com · build v26.39.1-09be696 · observed 2026-10-02
# RULE: label enters here ONLY from a live probe with evidence. Evidence: build-verify-2026-10-02/
## Top nav: "Work Orders" · "Schedule" · "Customers" · "Parts" · "Reports" · "Dashboard" (new)
## Dashboard (/dashboard)  — Evidence: dashboard-main.png
KPI hero tiles: "Revenue" · "Billing Efficiency" · "Technician Efficiency" · "Technician Utilization".
  Sub-measures: "N Invoices" · "X Invoiced / Y Clocked" (Billing Efficiency) · "X Invoiced Tech Hrs / Y Clocked"
  (Technician Efficiency) · "NN WO Hrs / NN Clocked" + a progress bar (Technician Utilization).
Count tiles: "Sales by Customer" ("N customers" · "Top: <customer name>" · area chart) · "At Risk Customers"
  ("N" · "$X (12mo) · N customers" · area chart).
Per tile: an expand/open icon, a date-range dropdown, "View details".
Date ranges seen: "This Month" · "Last 12 Months" · "120 Days".
## STILL TO OBSERVE: tile expand/drill-in report (S6/S10), date-range option list (S7), chart filters (S8),
#  chart behavior/hover (S9), chart on report page (S11), visual conformance (S12).

## Expanding a tile (S6)  — Evidence: tile-drill-in.png
"View details" (chevron) expands the tile INLINE into a chart panel below the tile row (header = tile name,
a chart, empty state "No data for selected date range"). Clicking again collapses it. The expand/open icon
(top-right ↗) is separate — it opens the full report page (S10/S11 drill-in).
## Date-range options (S7)  — Evidence: date-range-open.png
"Today" · "This Week" · "Last Week" · "This Month" · "Last Month" · "This Quarter" · "This Year" · "Last Year" ·
"Last 12 Months" · "120 Days" · "Custom".
## STILL TO OBSERVE: report page drill-in (expand icon, S10/S11) · chart filters (S8) · chart hover/behavior (S9).

## Reports pages (tile drill-in targets, S10/S11) — observed 2026-10-02, build v26.39.1-09be696
# Evidence: reverify-2026-10-02/reports-landing.png, report-technician-efficiency.png, report-advisor-analysis.png
Reports left rail sections + entries (the smallest element label each tester sees):
  LABOR: "Timesheet Activities".
  PERFORMANCE: "Sales" · "Technician Efficiency" · "Advisor Analysis" (rail label) · "Shop Efficiency" ·
    "Work In Progress" · "Technician Utilization" · "Sales By Customer" · "Sales By Representative".
  PARTS: "Parts Velocity" · "Inventory Value".  FINANCE: "Sales Tax Collected".
  ACCOUNTS RECEIVABLE: "A/R Aging Summary/Detail/Collection".  ACCOUNTS PAYABLE: "A/P Aging Summary/Detail/Unpaid Invoices".
  ACCOUNTING: "IBS Batches" · "QB Unexported" · "Export Reports".
# NOTE (glossary): the PERFORMANCE rail shows "Advisor Analysis" but the REPORT PAGE'S OWN HEADING is
#   "Service Advisor Analysis" (route /reports/service-advisor-analysis). Cases that name "Service Advisor
#   Analysis" are build-accurate (page heading = smallest element that owns the title). C204098 confirmed OK.
## A report page layout (Technician Efficiency /reports/technician-efficiency; same shell as Advisor Analysis)
Heading = report name (e.g. "Technician Efficiency" · "Service Advisor Analysis").
Filter row (one horizontal line, top-right): "Date: This month" dropdown (calendar icon) · report-specific filter
  (e.g. "Advisor") · "⋯" (more actions) menu · "Hide Chart" / "Show Chart" toggle (chart icon).
Embedded CHART panel sits ABOVE the data tabs; empty state in the chart = "No data for selected date range".
Data TABS under the chart (Technician Efficiency): "Invoiced" · "Completed".
Empty table state: "No record matches these filters" / "Try changing filters to widen your results."
Technician Efficiency columns: Date · Invoice · Customer · WO Line · Clocked Hrs · Invoiced Tech Hrs · Hrs Profit · Efficiency.
Service Advisor Analysis columns: Date · Invoice · Customer · Advisor · Days Open · Lines · Hrs Worked · Hrs Invoiced ·
  Labor Delta · Billing Efficiency · ELR · Parts Cost · Parts Invoiced · Parts Profit · Parts Margin · Total Profit · T Subtotal.
# Confirms build-accurate: C137997 (Vlad: Reports>Technician Efficiency, chart above tabs, This Month, No-data state),
#   C204097 (chart axis — chart panel present), C204098 (Show/Hide Chart control on filter row w/ ⋯ menu, 4 chart reports).

## SETUP SCREENS — observed 2026-10-09 on sv490 (Admin quick-login; Tech quick-login for clocking) — for the "Refine tests" pass (skill 21)
Evidence: `build/dashboard-simplify-2026-10-09/probe/sv490/` (probe-*.json, *.png, *.txt). Build marker not printed on the page.
- **Location (workplace):** top right shows the current location beside your initials (e.g. `Staging Heavy Duty - 9919`). Click it → profile menu: `Admin ShopView` `Edit Profile` `Change Location:` (orange button with the current location) `My Timesheets` `Customer Portal` `Billing` `What's New` `Settings` `Logout` `Light` `Dark`. QA lead 2026-10-09 (L0056): click the orange button → pick from the list. Locations on this site: `Staging Heavy Duty - 9919` · `Staging Lethbridge - 4310` · `ZZAUTOTEST Dashboard Quiet`. **No "QA Testing", no "ShopHub" location** — `ShopHub` (top left) is not a location.
- **Settings** (profile menu → `Settings`) sidebar: `Settings` `Staff` `Roles & Permissions` `Locations` `Departments` `Taxes` · SERVICE `Labor Rates` `Canned Lines` `Fees & Discounts` `Asset Types` `Inspection Templates` · PARTS `Pricing` `Bin Locations` `Categories` · …
- **Staff:** `New Staff Member` → First Name · Last Name · Email · Salary Type · Salary · Job Title · Role · `All Departments` · Location · Billable · `Time Clock` · `Sales Representative` · `Save & Add Next` / `Save & Close`. Edit (edit icon) → `Edit Staff Member` … Location (one) · `Time Clock` · `Deactivate Account` `Delete` `Save & Close`. **There is no "Clockable" label.** Staff that exist and can sign in by quick-login: `Admin ShopView` (Admin, 9919, Time Clock on) · `Tech ShopView` (Technician, 9919, Time Clock on). Names used by earlier case text that do NOT exist: Grace Sullivan, Nadia Petrov, Marcus Halvorsen, Priya Raman, Ravi Kapoor, Tom Tech, Alex Advisor, Bea Advisor, Tara Tech.
- **Roles & Permissions:** `Create Custom Role`; roles `Admin` (Full system access) · `Service Advisor` · `Senior Service Advisor` · `Service Manager` · `Office User` · `Sales Representative` · `Parts Manager` · `Parts Technician` · `Technician` · `Foreman` · `Time Clock User`. Role edit lists a permission `Reports` ("Performance statistics, labor/parts/total reports, and analytics"). The admin role is called `Admin`, not "Administrator".
- **Locations:** `New Location` button (form not opened this pass; on sv10043 it needs Name, Address 1, City, State/Province, ZIP/Postal Code, Timezone, Telephone → `Save & Close`).
- **Labor Rates:** named rates with fixed amounts, e.g. `HD Fleet Rate` (default, $149.95), `CP RAIL FLEET RATE` $145, `HD Door Rate` $164.95, `EVR Travel to EVO` $100. A line's rate is picked from this list, not typed.
- **Customers:** `New Customer` → `Name *` · Phone · Address 1/2 · City · ZIP/Postal Code · State/Province · Country · Notes · Website · IBS · `Save`. Customer page tabs: `Work Orders` (`New Work Order`) · `Part Sales` · `Contacts (n)` (`New Contact`) · `Assets (n)` · `Notes` · `Invoices` (`Open only`, `Issue Credit`, `New Payment`) · `Payments (n)` · `Deposits` · `Fees & Discounts (n)`.
- **Parts:** `Parts > Inventory` → `New Inventory Part`; `Parts > Part Sales` → `New Part Sale`.
- **Work Orders** (top menu; page /workorders) tabs `All` `Estimates` `Work Orders` `Completed`; `Create Work Order` → dialog `New Work Order`: Customer (`Add`) · Asset (`Add`) · `Asset Here?` · `Save`. If the customer is over its credit limit: `Confirmation` "Are you sure you want to open a new work order? This customer is over their credit limit." `Create` / `Cancel`. A new work order opens as an `Estimate` on its Lines tab with `New Line` already open.
- **Header (left panel):** `Lead Technician` · `Service Advisor` (defaults to the signed-in user) · `Sales Representative` · customer `Contact` · asset `Mileage`.
- **New Line:** `What Are You Doing?` · `Why Are You Doing It?` · `Technicians` / `Add Technician` · `Labor Rate` (list) · `Estimated Time` · `Tech Time` · `Line Approved` (tick) · `Are required parts authorized?` (when parts) · `Save & Add Part` `Save & Add Line` `Save & Close`.
- **Line row:** Status `Approved`; Action `Complete`; `Story` → "Add tech story for this line" → window `Tech Story: <line>` → `Update`; `Labor` row: technician + `Start`; `Add Part`. `Complete` with no story → `Tech stories` / `Missing Details`; with a story but no mileage → `Missing Details` "Mileage" → `Complete All Lines`. Then status `Review` and button `Mark Reviewed` → status `Complete`. (No separate "Complete Work Order" button appeared for a one-line work order.)
- **Three dots (top of Lines):** `Audit Log` · `Timesheets (n)` · `Add Work Order Fee / Discount` · `Print Work Order` · `Delete Work Order`; per line `Add Labor Fee / Discount`.
- **Finance tab:** Subtotal includes `Shop Supplies` added automatically (e.g. $149.95 labor → $15.74 shop supplies); `Create Invoice` → `New Customer Payment` (Payment Date · Payment Method · Reference Number · Memo · `Make Payment` · `Send to Terminal`) — close it to leave the invoice unpaid. Invoice three dots: `Reverse` · `Issue Credit`.
- **Clocking (as Tech ShopView):** Labor row `Start` → becomes `Stop` → window `Stop working on <WO>, <line>`: `Line Completed?` · `What Have You Been Doing On This Line?` · `Clock Out`. Top bar also has `Clock In`.
- **Reports** left menu: LABOR `Timesheet Activities` (`Date Range`, `Filter by Staff`, `New`) · PERFORMANCE `Sales` `Technician Efficiency` `Advisor Analysis` `Shop Efficiency` `Work In Progress` `Technician Utilization` `Sales By Customer` `Sales By Representative` · …
- Test data left (ZZAUTOTEST, location 9919, customer 4 Star Truck Repair): S490-17644 (one line, invoiced INV-S490-17644, unpaid $173.98) · S490-17645 (estimate, one line, ~1 min clocked by Tech ShopView).
- **Change Location list (sv490, 2026-10-09):** `ZZAUTOTEST Dashboard Quie..` (truncated) · `Staging Heavy Duty - 9919` · `Staging Lethbridge - 4310` (probe-n.json, 71-change-location-list.png).
- **Locations › edit `ZZAUTOTEST Dashboard Quiet`:** `Edit Location` … `Timezone` Asia/Karachi · `Shop Supplies Charge` **0.00 %** of labor, Min 0.00 · `Taxes` GST · `Save & Close`. `New Location`: `Name *` · Shop Id · Address 1/2 · City · State/Province · Country · ZIP/Postal Code · Timezone · Telephone · Remit To · `Shop Supplies Charge` (% of labor, Min, Max) · Taxes · Sales Tax Rounding · Default Color · `Save & Close`.
- **Customer edit (`Edit Customer`):** … `Credit Terms` · `Credit Limit` · `Sales Representative` · `Default Labor Rate` · `Default Shop Supplies` (% of labor, Min, Max) · … `PO is required` · `Save`.
- **Labor rates seen (first 30 of the list):** include `EVR Travel to EVO` **$100** · `Calgary Transit Rate` **$150** · `HD Fleet Rate` $149.95 (default) · `CP RAIL FLEET RATE` $145. No $125, $140 or $250 rate among them.
- **Departments:** columns Name · Members · Clock Time Enabled · Display On Schedule; `New Department` / `Edit Department`: Name · `Enable time clock?` · `Display on schedule?` · `Save & Close` (no member list). Clock-enabled examples: `Training`, `Shop Time (Shop hand)`. Membership is shown read-only on the user's profile (`Departments`: "Staging Heavy Duty - 9919 - Administration" for Tech ShopView) and chosen on `New Staff Member` (Departments field).
- **Timesheet Activities › `New`** → `New Timesheet`: `Select Staff` · `Select Department` (only that person's departments — Tech ShopView: `Administration`, clock off) · `Work Order` · `Line` · Start · End · `Cancel` `Create`.
- **Tech ShopView top-bar `Clock In`** → window `Clock In` listing WORK ORDERS only (no department, because Administration has the time clock off).
