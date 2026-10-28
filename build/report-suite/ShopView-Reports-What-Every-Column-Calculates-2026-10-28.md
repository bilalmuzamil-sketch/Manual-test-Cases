# ShopView Reports — What Every Column Calculates

Oct 28, 2026 · @Bilal

## How to read this

Each report has one table: a row per column and per total cell, in the order the screen shows them. For each one you get what it calculates in plain words, the exact formula, which records are counted or left out, and the code file it comes from.

To check a dashboard number, find its row in **Dashboard check**, then recompute it with the formula of the report column it should agree with.

Every formula here was read from the application's source code, not from a live screen. See **Sources and verification status** for what that means for your checks.

## The reports in the Reports tab

The left-hand menu shows 23 entries in 6 groups, in every environment. Two more reports, Timesheets and Follow Up, are switched off in the menu code but their screens still exist, so they are covered too. Export Reports is a download dialog rather than a report.

| Menu group | Report (as the menu shows it) | Note |
| --- | --- | --- |
| Labor | Timesheets | Not in the menu in any environment, staging included; screen still exists |
| Labor | Timesheet Activities | Opens first when you click Reports |
| Performance | Sales |  |
| Performance | Technician Efficiency |  |
| Performance | Advisor Analysis |  |
| Performance | Shop Efficiency |  |
| Performance | Work In Progress |  |
| Performance | Technician Utilization |  |
| Performance | Sales By Customer |  |
| Performance | Sales By Representative |  |
| Parts | Parts Velocity |  |
| Parts | Inventory Value |  |
| Sales | Follow Up | Not in the menu in any environment, staging included; screen still exists (titled Sales Follow Up) |
| Finance | Sales Tax Collected | Two tabs: Invoices and All tax rates |
| Finance · Accounts Receivable | A/R Aging Summary |  |
| Finance · Accounts Receivable | A/R Aging Detail |  |
| Finance · Accounts Receivable | A/R Aging Collection |  |
| Finance · Accounts Payable | A/P Aging Summary |  |
| Finance · Accounts Payable | A/P Aging Detail |  |
| Finance · Accounts Payable | A/P Unpaid Invoices |  |
| Accounting | IBS Batches |  |
| Accounting | QB Unexported |  |
| Accounting | Export Reports | A download dialog, not a screen |
| Communications | Notes |  |
| Communications | Reminders |  |

Three older report screens still exist in the code but are not in the menu: Vendor Transactions, Customer Transactions and Inventory. They are not covered here.

## Labor

### Timesheets (not in the menu)

The screen is titled "Payroll Timesheet". It is switched off in the menu in every environment, but its screen still exists.

**Filters that change the numbers:** only a date **preset** is sent (choosing Custom falls back to today). Rows are attendance records dated in that preset with mark "present". **No location filter was found** in the query, so it probably covers all locations (not confirmed).

| Column | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Employee Name | The staff member | shows name | — | PayrollTimeSheetQueryHandler.php:55-64 |
| Date | Attendance date | `attendance_record.record_date` | — | same |
| Clock In Time / Clock Out Time | Times recorded | shown as stored | — | PayrollTimeSheetData.php |
| Lunch | — | always shows "N/A" | — | same |
| Hours | Hours between in and out | whole hours of the difference; **minutes are dropped** (7 h 50 min shows 7) | — | same |
| Totals | None | — | — | — |

### Timesheet Activities

**What it shows:** Every clock-in (on a work order or a department) with its hours.

**Filters that change the numbers:** Date Range (default This month, worked out on the server). A clock is listed when **any part** of it falls in the dates; a running clock only when the dates include now. Optional staff filter. Current location only.

| Column | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Date | Day of the clock | the clock's day; a clock that crosses midnight is split into one row per day | — | DataProvider.php |
| Employee | Staff member | shows name | — | same |
| Work Order | Invoice number, otherwise work-order number | first of invoice display number, work-order display number, work-order number | A work order with several invoices may show more than one row (not confirmed) | same |
| Clock In Activity | What was clocked | department name, otherwise line name | — | same |
| Clock In / Clock Out | Start and end times | shows values | — | same |
| Total Hours | Length of the clock | round((end − start) ÷ 3600, 2) | **Not** cut to the dates on the row | same |
| WO Hours | Time on a work order | = Total Hours when the clock is on a work order, else 0 | — | same |
| Internal Hours | Time on a department | = Total Hours when the clock is on a department, else 0 | — | same |
| Modified By, Modified Date/Time, Comment | Edit history | shows values | — | same |
| **Footer WO Hours / Internal Hours** | Totals for the dates | Σ hours, **cut to the dates**, rounded per clock | Worked out in the database, so it can differ from adding the rows | DataProvider.php:154-200 |
| **Footer Total Hours** | Total | footer WO Hours + footer Internal Hours (in the browser) | Clocks on neither a work order nor a department are left out — confirmed in the code | PunchClockActivities.vue:684-688 |

**Gotcha:** the footer is cut to the dates but the rows are not, so the rows will not always add up to the footer.

## Performance

**Read this first.** "Sales" and "invoiced hours" do not mean the same thing in every report:

- **Sales, Advisor Analysis and the dashboard Revenue tile** use the invoice **subtotal before** the old invoice-level % discount, and Sales subtracts credit memos. **Sales By Customer and Sales By Representative** use the frozen invoice figures **after** that discount and ignore credit memos. Their totals can legitimately differ.
- **Invoiced hours** is the line's *quoted time* (`time_estimate`) in Sales, Advisor Analysis and Shop Efficiency, but the line's *technician time* (`tech_time`) in Technician Efficiency.
- **Which invoice counts** for a work order also differs: Sales uses the newest invoice for hours, Advisor Analysis the earliest in the dates, Technician Efficiency the latest non-void invoice overall.

### Sales

**What it shows:** One row per invoice, plus one negative row per credit memo.

**Filters that change the numbers:**

- **Date** (default This month, at most 366 days, weeks start Sunday): invoice created date, or credit memo created date for credit rows. Both ends included. Presets are worked out on the server in the location's time zone.
- **Customer** (optional). **Location:** the current location only.
- **Left out:** void invoices and void credit memos. Unpaid invoices **are** included. A sale with no company shows as "(No company)".

| Column | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Invoice Date | Date the invoice (or credit memo) was created | shows `invoice.created_on` / `credit_memo.date_created` | — | DbalSalesReportDataFetcher.php:117-259 |
| Invoice | Invoice number, or credit memo number | display number, or credit number with shop id | — | SalesData.php |
| Customer | Company name, cut to 23 characters on screen | shows company name | — | Sales.vue |
| Inv. Hrs | Hours billed on the work order | Σ round(line `time_estimate` minutes ÷ 60, 2) over non-declined lines | Work-order level: only the **newest** invoice of a work order carries it, any other invoice shows 0.00. Credit rows 0 | WorkOrderStatsFetcher.php, LinesStatsFetcher.php |
| Billing Efficiency | Billed hours as a share of hours worked | Inv. Hrs ÷ hours worked × 100, 2 dp; **N/A** if worked = 0. Hours worked = Σ round(clock hours, 2) over clocks on the work order's lines; a running clock counts up to now | — | SalesData.php |
| Labor Invoiced | Labor billed | Σ `invoice_statement.price` | Gross: line fees/discounts and shop supplies not included. Credit rows 0 | DbalSalesReportDataFetcher.php |
| Labor Margin | Labor profit as a share of labor billed | (Labor Invoiced − labor cost) ÷ Labor Invoiced × 100; N/A if 0. Labor cost = hours × technician hourly rate | Labor cost on the newest invoice only | SalesData.php |
| Parts Invoiced | Parts billed | Σ part price × quantity ÷ 100. Credit rows: −(credit total − credit tax) ÷ 100 | — | DbalSalesReportDataFetcher.php |
| Parts Cost | What the parts cost the shop | current work-order part cost × quantity, minus returns, plus outstanding part requests | **Live** figure: changes if costs change later | DbalSalesReportDataFetcher.php |
| Parts Margin | Parts profit as a share of parts billed | (Parts Invoiced − Parts Cost) ÷ Parts Invoiced × 100 | — | SalesData.php |
| Profit | Labor profit + parts profit | round(parts profit) + round(labor profit) | Excludes shop supplies and work-order fees | SalesData.php:168-175 |
| Margin | Profit as a share of labor + parts billed | Profit ÷ (Labor Invoiced + Parts Invoiced) × 100 | — | SalesData.php |
| Subtotal | Invoice subtotal before tax | `invoice.subtotal` ÷ 100. Credit rows: −(credit total − credit tax) | **Includes** shop supplies and fees; the old invoice-level % discount is **not** taken off. So Subtotal ≠ Labor + Parts | SalesData.php |
| **Totals row** | Sum of every row | Σ of each money and hours column. Billing Efficiency, Labor Margin, Parts Margin and Margin are **recalculated from the sums**, not averaged (Parts Margin and Margin use the absolute value) | All rows in the dates (no paging) | SalesDataCollection.php:103-106 |

**The chart** on the page is the dashboard Revenue chart (same data). **Gotchas:** hours and costs are live, billed amounts are frozen at invoicing; quarter presets read the server's calendar.

### Technician Efficiency

**What it shows:** Per technician, then per work-order line: hours clocked against hours credited to the technician. Two tabs.

**Filters that change the numbers:**

- **Invoiced tab:** invoice created date. Uses each work order's **latest non-void invoice** only; the work order must be Invoiced or Paid and have a company.
- **Completed tab:** the line's completed date (status complete). **No** void, status or invoice filter.
- Optional technician filter. Current location only.

| Column | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Date / Completed Date | Invoice date (Invoiced) or line completed date (Completed) | shows the date | — | DataProvider.php:604-630 |
| Invoice / Work Order | Invoice number or work-order number | shows number | — | DbalInvoicedTechnicianTimesheetQueryRepository.php:114-183 |
| Customer | Company | shows name | — | same |
| WO Line | Line order number and name | "order. - name" | — | DataProvider.php |
| Clocked Hrs | Time the technician clocked on the line | Σ full length of each clock (not cut to the dates), 2 dp. Technician row = Σ of the rounded line values | Running clocks count up to now | DataProvider.php:360-558 |
| Invoiced Tech Hrs / Completed Tech Hrs | The technician's share of the line's technician time | (this technician's clocked ÷ all technicians' clocked on the line) × line `tech_time` minutes ÷ 60, 2 dp | Uses `tech_time`, not the quoted time | DataProvider.php:360-410 |
| Hrs Profit | Credited minus clocked | Tech Hrs − Clocked Hrs | — | DataProvider.php |
| Efficiency | Credited hours as a share of clocked hours | round(Tech Hrs ÷ Clocked Hrs × 100, 2); **0** if either is under 0.01 | — | DataProvider.php:404-409 |
| **Totals row** | All technicians | Σ technician rows; Efficiency = total Tech Hrs ÷ total Clocked × 100 (worked out in the browser, **without** the 0.01 rule) | — | TechnicianEfficiencyInvoiced.vue:564-601 |

**The chart** is the dashboard Technician Efficiency chart.

### Advisor Analysis

**What it shows:** One row per invoiced work order with its service advisor.

**Filters that change the numbers:** invoice created date; each work order counted once, on its **earliest** non-void invoice in the dates; the work order must have an advisor and the invoice must be at the work order's location. Optional Advisor filter.

| Column | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Date, Invoice, Customer, Advisor | Invoice date and number, company (23 chars), advisor (13 chars) | shows values | — | DbalServiceAdvisorAnalysisQueryRepository.php:164-217 |
| Days Open | How long the work order was open | ceiling((invoice created − work-order start) ÷ 86,400 seconds) | — | ServiceAdvisorAnalysisData.php |
| Lines | Number of lines | count of non-declined lines | Live count | same |
| Hrs Worked | Clocked time | Σ round(clock hours, 2) on non-declined lines; running clocks to now | — | DbalWorkOrderHoursFetcher.php:190-203 |
| Hrs Invoiced | Billed time | Σ round(`time_estimate` ÷ 60, 2) | — | same |
| Labor Delta | Billed minus worked | Hrs Invoiced − Hrs Worked | — | ServiceAdvisorAnalysisData.php |
| Billing Efficiency | Billed as a share of worked | round(Hrs Invoiced ÷ Hrs Worked × 100, 2); N/A if worked = 0 | — | same |
| ELR | Effective labor rate | labor billed ÷ Hrs Worked | Labor billed is not a column of its own | same |
| Parts Cost / Parts Invoiced | Cost and billed value of parts | live part cost; Σ price × quantity ÷ 100 | — | same |
| Parts Profit / Parts Margin | Parts profit, and as % of parts billed | Invoiced − Cost; ÷ Invoiced × 100 | — | same |
| Total Profit | Labor profit + parts profit | labor billed − labor cost + Parts Profit | Labor cost is used but not shown | same |
| Total Margin | Profit as a share of labor + parts billed | Total Profit ÷ (labor billed + Parts Invoiced) × 100 | — | same |
| Subtotal | Invoice subtotal | `invoice.subtotal` ÷ 100 | — | same |
| **Totals row** | All rows | Σ of each column; percentages recalculated from the sums | — | ServiceAdvisorAnalysisDataCollection.php:23-115 |

**The chart** is the dashboard Billing Efficiency chart.

### Shop Efficiency

**What it shows:** Only a totals row, no detail rows. Current location only.

| Cell | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Total Clocked Hours | All billable clock time in the dates | round(Σ clocked hours, 2), each clock **cut to the dates** | Only billable clocks. **Running clocks are left out** (they have no end time) | TechnicianTaskRecordFetcher.php:217-239 |
| Total Invoiced Hours | Billed hours on invoices created in the dates | Σ `time_estimate` ÷ 60 on non-declined lines | **Void invoices are included** (no status filter on the invoice) — confirmed in the code | InvoiceFetcher.php:60-85 |
| Difference | Billed minus clocked | Invoiced − Clocked | — | ShopBillingEfficiency.php:45-55 |
| Efficiency | Billed as a share of clocked | Invoiced ÷ Clocked × 100; N/A if clocked = 0 | — | same |

No dashboard tile reads this report (the code says Utilization is a different measure).

### Work In Progress

**What it shows:** Open service work orders and how much of their value is earned or still to do, on one chosen day.

**Filters that change the numbers:**

- **As of day:** today is live; any past day is read from that night's stored snapshot ("No snapshot is available for this date" if none).
- **Included:** service work orders in status estimate, approved, in progress, ready for review or complete, started on or before the day.
- Location, Advisor, Customer and Asset chips. Tabs: Approved – partially completed, Approved – not started, Completed, Estimates.

| Column | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| WO #, Status, Customer, Asset, VIN, Location, Advisor | Work-order details | shows values | — | DbalWorkInProgressFetcher.php:59,291-302 |
| Days Open | Days since the work order started | max(0, as-of day − local start day) | — | WorkInProgressCalculator.php |
| Last Activity | Latest activity date | shows date | — | same |
| Labor Earned | Labor value already done | per approved line: min(clocked, quoted) ÷ quoted × line value; if quoted = 0, full value once the line is complete. Completed tab: all of it | — | WorkInProgressCalculator.php:87-175 |
| Labor Remaining | Labor value still to do | line value + line adjustments − Labor Earned | Can be negative | same |
| Parts Earned | Parts value already used | Σ (sell + core) × quantity of received part requests + fixed parts on completed lines + part adjustments | — | same |
| Parts Remaining | Parts value still to come | parts authorized to order, waiting to receive, or in stock | — | same |
| Earned / Remaining | Labor + parts | Labor Earned + Parts Earned; Labor Remaining + Parts Remaining | — | same |
| Adjustments | Work-order level fees/discounts | stored adjustments | **Not** in Earned or Remaining | same |
| Labor Delta | Quoted minus worked hours | quoted hours − worked hours | — | same |
| Total | Whole value | Earned + Remaining + Adjustments | — | same |
| **Totals row** | Active tab, whole filtered set | Σ of each column | — | WorkInProgressAggregates.php:87-106 |
| Strip: Completed Work on Open WOs |  | Σ Earned, partially completed tab | No adjustments | same |
| Strip: Ready to Invoice |  | Σ Earned, Completed tab | No adjustments | same |
| Strip: Total Completed Work |  | the two above added | — | same |
| Strip: Not Started |  | Σ (Earned + Remaining), not-started tab | No adjustments | same |
| Strip: Remaining on Open WOs / Remaining Work |  | Σ Remaining, partially completed tab; and the sum | No adjustments | same |
| Strip: Estimates |  | Σ Total, Estimates tab | The **only** strip figure that includes adjustments | same |

**Gotcha:** a work order with some lines done and some not can appear on two tabs.

### Technician Utilization

**What it shows:** Per technician (and per day): how much clocked time went on work orders.

**Filters that change the numbers:** date range (presets worked out in the browser, ending today); each clock counts only the part inside the dates; Location chip ("Multiple" when several); technician chip; only staff marked billable.

| Column | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Technician, Location | Name; location or "Multiple" | shows values | — | DbalTechnicianUtilizationFetcher.php |
| Total Hours | All clocked time in the dates | Σ round(overlap seconds ÷ 3600, 2) per clock | Includes clocks on neither a work order nor a department, so it can be more than WO + Internal | DbalTechnicianUtilizationFetcher.php:553-554 |
| WO Hours | Time on work orders | same, clocks with a work order | — | same |
| Internal Hours | Time on departments | same, clocks with a department | — | same |
| Utilization % | Work-order share | round(WO ÷ Total × 100, 2); "—" if Total = 0 | — | Model.ts:118-139 |
| Est. Lost Labor | Labor value of internal time | Σ hourly rate × internal seconds ÷ 3600 | — | EstimatedLostLabor.php:67-121 |
| **Summary row** | All technicians | round(Σ seconds ÷ 3600, 2) for each hours column; Utilization % weighted from the sums; Σ Lost Labor | — | TechnicianUtilizationSummary.php:49-72 |

**The chart** is the dashboard Technician Utilization chart.

### Sales By Customer

**What it shows:** Customer → asset → invoice, with frozen figures saved on each invoice when it was created.

**Filters that change the numbers:**

- Invoice created date, both ends included; presets worked out in the browser and end today.
- Location (multi-select); Product Type by invoice number prefix (P / S; none selected = no rows); Customer search (first 50 matches).
- **Left out:** void invoices. **Credit memos are not included.** Invoices made before the figures were back-filled count as $0 but still add to the "(n)" count.

| Column | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Customer / asset / invoice | Group label; "(n)" = number of invoices | shows values | — | DbalSalesByCustomerFetcher.php |
| Date, Location | Invoice rows only | shows values | — | same |
| Labor Delta | Billed minus worked hours | round(Σ hours invoiced − Σ hours worked, 2) | Frozen on the invoice | SalesByCustomerFinancials.php |
| Labor Invoiced | Labor billed | Σ labor sell | **Includes** labor-line fees/discounts | same |
| Labor Margin | Labor profit in **dollars** | labor sell − labor cost | Dollars, not % | same |
| Parts Invoiced / Parts Margin | Parts billed; parts profit in dollars | Σ parts sell; parts sell − parts cost | — | same |
| Shop Supplies | Shop supply charges | Σ shop supplies | — | same |
| Adjustments | Invoice-level fees/discounts | invoice fees/discounts + processing fee + old % discount, with the $0 floor | — | same |
| Margin | Total profit in dollars | Labor Margin + Parts Margin + Adjustments | — | same |
| Margin % | Profit as a share of sales | Margin ÷ (Labor + Parts + Adjustments) × 100; "—" if that base ≤ 0 | — | SalesByCustomerFinancials.php:137-165 |
| Subtotal | Pre-tax sales | Labor + Parts + Shop Supplies + Adjustments (= subtotal after discount) | — | same |
| **Totals row** | All groups | Sums worked out in the database, then the same formulas | — | same |

Negative amounts show as `(-$45.00)`.

### Sales By Representative

**What it shows:** The same money columns as Sales By Customer, grouped by the sales representative credited with each invoice.

**Filters that change the numbers:** as Sales By Customer, plus an **Invoice Status** filter and **Show Unassigned** (off by default). No credit memos.

| Column | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Invoice / representative | Rep name ("(Inactive)" if inactive) and "(n)" invoices | shows values | Rep is **fixed when the invoice is created**: the work order's rep, otherwise the company's rep | InvoiceSalesRepResolver.php:36-78 |
| Customer | Company, otherwise contact | shows name | — | — |
| Status | Payment badge | Paid / overpaid → Paid; partially paid → Partially Paid; prepaid → Paid if balance ≤ 0; unpaid with balance ≤ 0 → Paid; else Unpaid | — | SalesByRepresentativePaymentStatusMapper |
| Money columns (Labor Delta … Subtotal) | Same as Sales By Customer | same formulas | — | SalesByRepresentativeFinancials.php:75-195 |
| **Totals row** | All reps | same as Sales By Customer | Unassigned only if switched on | same |

No dashboard tile reads this report.

## Parts

### Parts Velocity

**What it shows:** One row per part: units moved, money billed, demand, last sale and stock. Inventory parts get one row per location; Special Order parts are merged across the chosen locations.

**Filters that change the numbers:**

- **Date** (default **Last 90 days**, which is today plus the 90 days before it, so **91 days**; at most 366). Worked out in the browser in the active location's time zone, both ends included.
- **Which date is used:** money, Sold (WO), Sold (Parts Sale) and all Special Order figures use the **invoice created date**. Inventory Units Sold and Demand use the **stock movement date**. Units Returned uses the return / credit memo / manual return date.
- **Type** (Inventory, Special Order; none = no rows). **Category, Vendor** (on Special Order rows these narrow the money to that vendor's or category's share). **Bin:** choosing any bin **removes all Special Order rows**. **Location**, **Search** (part number or description).
- **Left out:** core parts, void invoices, work orders not Invoiced or Paid, declined lines, and inventory parts with no movement, under 1 on hand and no sales.

| Column | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Type, Part #, Description, Category, Vendor | Part details | shows values ("—" if blank) | Special Order rows show the request's category/vendor | PartsVelocityReport Model.ts:121-162 |
| Location | Only shown when more than one location is chosen | part's location; Special Order: that location, or "Multiple" | — | DbalPartsVelocityFetcher.php:189-190 |
| Units Sold | Units out of stock by invoicing | **Inventory:** Σ (old qty − new qty) of stock movements from invoicing and invoice reversal in the dates (a reversed sale cancels out). **Special Order:** Σ billed quantity | Manual stock adjustments and customer returns are **not** subtracted | DbalPartsVelocityFetcher.php:765-780 |
| Units Returned *(hidden by default)* | Units that came back | Σ part-return requests + credit memo line quantities + manual vendor-return items in the dates | Shown beside Units Sold, **not** taken off it. Cancelled returns and core returns left out | DbalPartsVelocityFetcher.php:813-851 |
| Sold (WO) / Sold (Parts Sale) *(hidden)* | Billed units on service work orders / on parts sales | Σ billed quantity by work-order type | A different measure from Units Sold, so they can disagree | DbalPartsVelocityFetcher.php:871-872 |
| Avg Cost | Cost per billed unit | round(Σ (work-order part cost × billed qty) ÷ billed units); "—" if no units | Cost saved on the work-order part, not today's stock cost | PartsVelocityRow.php:76-83 |
| Avg Sell | Price per billed unit | round(Revenue ÷ billed units); "—" if no units | — | PartsVelocityRow.php:85-92 |
| Revenue | Parts billed in the dates | round(Σ price × billed qty) ÷ 100 | No tax. Returns and credit memos **not** taken off | PartsVelocityRow.php:66-69 |
| Margin | Revenue minus cost | round(Revenue − cost) ÷ 100 | — | PartsVelocityRow.php:71-74 |
| Margin % | Margin as a share of Revenue | (Revenue − cost) ÷ Revenue × 100, 2 dp, shown 1 dp; "—" if Revenue ≤ 0 | — | PartsVelocityRow.php:94-101 |
| Demand | Number of separate sales | **Inventory:** distinct invoices with a stock-moving sale in the dates. **Special Order:** number of billed lines | Special Order counts lines, although the tooltip says each transaction once | DbalPartsVelocityFetcher.php:771,995 |
| Last Sale | Days since the part last sold | whole 24-hour blocks from the last sale to now | **All time**, not limited to the dates | DbalPartsVelocityFetcher.php:772,998 |
| On Hand | Stock now | Σ the part's positive bin quantities (or the plain total if none are positive) | **Live now**, not as at the end date. Special Order "—" | InventoryValueBinsExpression.php:47-58 |
| Turns/Yr *(hidden)* | Sell-through per year | (Units Sold × 365 ÷ days in range) ÷ On Hand; 0 if On Hand ≤ 0 | Current stock, not average stock | DbalPartsVelocityFetcher.php:634,1267-1270 |
| Min / Max *(hidden)* | Reorder levels | shows `part.min` / `part.max` | Special Order "—" | DbalPartsVelocityFetcher.php:620-621 |
| Totals | **None** — the screen has no footer | — | — | PartsVelocityReport.vue |

### Inventory Value

**What it shows:** One row per in-stock part per location, valued at cost and at selling price on one chosen day, with a totals row.

**Filters that change the numbers:**

- **As of** (one day, default today, no future dates). **Today** is read live; **any earlier day** comes from that night's stored snapshot. A location with no snapshot for that day shows no rows; if no location has one, the report is empty. Snapshots are kept 13 months.
- Category, Vendor, Location, Search, as Parts Velocity.
- **Left out:** core parts and parts with 0 or less on hand.

| Column | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Part #, Description, Category, Vendor, Location | Part details | shows values (snapshot values for past days) | — | DbalInventoryValueFetcher.php |
| Qty | Quantity on hand | Σ positive bin quantities (or plain total if none positive), 2 dp | — | InventoryValueBinsExpression.php:47-58 |
| Unit Cost | Cost per unit | the part's **stored average cost** (weighted average of stock batches with qty > 0) | Not last purchase cost, not FIFO | PartCostCalculator.php:21-38 |
| Unit Sell | Selling price per unit | (1) fixed sell price if set; (2) else, no category → = Unit Cost; (3) else Unit Cost × (1 + markup from the category's pricing matrix, else the default matrix, else 0%) | — | InventoryValueSellExpression.php:83-87 |
| Margin | Row profit | Total Sell − Total Cost | — | InventoryValueRow.php:60-63 |
| Margin % | Profit share | Margin ÷ Total Sell × 100, 2 dp, shown 1 dp; "—" if Total Sell ≤ 0 | — | InventoryValueRow.php:65-72 |
| Total Sell | Stock value at selling price | round(Qty × Unit Sell) | — | InventoryValueRow.php:55-58 |
| Total Cost | Stock value at cost | round(Qty × Unit Cost) | Default sort, largest first | InventoryValueRow.php:50-53 |
| **Totals: Qty, Total Cost, Total Sell** | Every filtered row, not just the page | Σ worked out unrounded, rounded once | Can differ by a few cents from adding the shown rows | InventoryValueTotals.php:23-31 |
| **Totals: Margin, Margin %** | Overall | footer Total Sell − footer Total Cost; ÷ footer Total Sell × 100 | Not the sum/average of row margins | InventoryValueTotals.php:33-45 |

## Sales

### Follow Up (not in the menu)

The screen is titled "Sales Follow Up". It is switched off in the menu in every environment, but its screen still exists.

**Filters that change the numbers:** last 3, 6 or 12 months (default 3) on the invoice created date, using the server's clock (probably UTC; not confirmed). The "Contact" filter actually filters by the **company's sales representative**. Current location only. **Void invoices are not left out.**

| Column | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Customer | The contact's name | first name + last name | — | SalesFollowUpReportQueryHandler.php:30-61 |
| Sales Representative | The company's rep | shows name | — | same |
| Number Of Work Orders | Visits | count of work-order × invoice rows | **Not** distinct: a work order with two invoices counts twice | same |
| Total Spend | Money spent | round(Σ subtotal ÷ 100, 2) | **Includes void invoices** | same |
| Last Visit | Most recent invoice | latest created date, shown `dd.mm.yyyy` | No time-zone conversion | same |
| Totals | None | — | — | — |

## Finance

All six aging reports age invoices from their **due date** and credits from their **creation date**. They cover **every location** in the organization, and the as-of date means the end of that day in the time zone of the location you have selected. Backend code lives under `api/src/Reporting/Dashboard/` (A/R in `AccountReceivable`, A/P in `AccountPayable`). Four key claims below were re-checked by hand against the code: the bucket boundaries, rows versus footer, and the A/P today-versus-past switch.

### Sales Tax Collected

**What it shows:** Paid invoices and the tax on them, in two tabs: Invoices and All tax rates.

**Filters that change the numbers:**

- **Date** (default This month; no "Last 12 months"): the invoice's **last payment date** (the latest payment that was not reversed), both ends included. It is **not** the invoice date, so all of an invoice's tax lands in the period of its latest payment.
- **Invoice Status:** uses the status of the latest payment record.
- **Location:** current location only.
- **Left out:** unpaid invoices. Credit memos are not rows. No void filter was found in the query.
- **Search box:** narrows the rows shown but **does not change the totals**.

**Invoices tab**

| Column | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Invoice Status | Payment status | status of the latest payment | — | SalesTaxReportFetcher.php |
| Invoice Created Date | When the invoice was made | `invoice.created_on` | — | same |
| Invoice Paid Date | Last payment date | MAX(payment date) of non-reversed payments | This is the date the report filters on | SalesTaxReportFetcher.php:72,191 |
| Invoice Number, Customer | Invoice and customer | shows values | — | SalesTaxReportMapper.php |
| Labor Total | Labor billed | Σ `invoice_statement.price` | — | same |
| Parts Total | Parts billed | Σ part price × quantity | — | same |
| Shop Supply Total | Shop supplies charged | stored shop supply charge | — | same |
| Invoice Subtotal | Subtotal before tax | `invoice.subtotal` | — | same |
| Taxes | Each tax and its amount | read from the tax rates saved on the invoice; Total Tax = Σ the amounts | — | same |
| Invoice Total | Subtotal plus tax | `subtotal_with_tax` | Not the amount still owed | same |
| **Footer "Total"** | Total of all matching invoices | Σ `subtotal_with_tax` | All invoices in the filter, **ignoring the search box** | SalesTaxReportTotalsCalculator.php |

**All tax rates tab**

| Column | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Tax name, Rates | The tax and its rate | shows values | — | SalesTaxRatesSummary.vue |
| Totals | Tax collected at that rate | Σ amount per rate | **Not reduced by tax on credit memos**. No footer | SalesTaxReportTotalsCalculator.php |

**Gotcha:** the backend also works out a Total Tax with credit memo tax taken off, but no screen shows it.

### A/R Aging Summary

**What it shows:** one row per customer with unpaid invoices, net of open credit memos and unused deposits, split into Current / 1-30 / 31-60 / 61-90 / 91 and Over, plus a Totals footer.

**Filters that change the numbers:**

- **As-of date ("Date" chip):** defaults to today. It is sent as 23:59:59.999 on that day in the selected location's time zone, converted to UTC; if no time zone is stored it falls back to UTC (`app/src/utils/helpers.ts:862-873`, `app/src/services/location.ts:61`).
- **Invoice age** is counted from the due date. If an invoice has no stored due date, it uses invoice date + the customer's credit-term days (`AccountReceivableCustomerService.php:73`).
- **No location filter and no status filter.** A voided (reversed) invoice is deleted outright, so it simply disappears (`InvoiceReversalService.php:~143-158`).
- **Left out:** ledger rows that are not invoices; invoices created after the as-of date; invoices whose balance on the as-of date is not above 0; credit memos voided on or before the as-of date; deposits reversed on or before it; a deposit held on a work order and never applied by then (SV-11690).

| Column (screen label) | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Customer | Company name. Clicking opens A/R Aging Collection for that customer — without passing the as-of date. | shows `company.name` | Listed if the customer has an invoice with balance above 0 on the as-of date, an open credit memo, or a qualifying deposit. Loaded 30 at a time as you scroll. | `AgingSummaryReport.vue:213-220,330-337`; `DbalAccountReceivableCustomerFetcher.php:252-356` |
| Current | What the customer owes that is not yet past due. Credits never land here. | Σ open balance of invoices where whole days(as-of − due date) ≤ 0. Computed in PHP. | Open balance = invoice amount − Σ payments, deposit applications and credit applications dated on or before the as-of date and not reversed by then, ÷ 100. IBS batch payments count. | `AgingCalculator.php:28-47`; `OpenBalanceAsOfSql.php:184-194` |
| 1-30 Days | Amount 1–30 days late, minus credits aged 0–30 days. | Σ invoice open balance where 1 ≤ days past due ≤ 30, minus Σ credit remaining where credit age ≤ 30. Credits are negative. PHP. | Day 30 is in this bucket; day 31 is in the next. Days = complete 24-hour days from the due date to the end of the as-of day. | `AgingCalculator.php:35-39,57-58` |
| 31-60 Days | Same, 31–60 days. | Invoices 31 ≤ days ≤ 60; credits 31 ≤ age ≤ 60. | Day 60 is in this bucket. | `AgingCalculator.php:39-40,59-60` |
| 61-90 Days | Same, 61–90 days. | Invoices 61 ≤ days ≤ 90; credits 61 ≤ age ≤ 90. | Day 90 is in this bucket. | `AgingCalculator.php:41-42,61-62` |
| 91 and Over | Same, more than 90 days. | Invoices days ≥ 91; credits age ≥ 91. | Day 91 is the first day here. | `AgingCalculator.php:43-45,63-65` |
| Total (row) | The customer's net amount owed. | Current + 1-30 + 31-60 + 61-90 + 91+, in PHP. | Can be negative or $0.00 for a customer who only holds credits. | `AgingBuckets.php`; `AgingSummaryQueryHandler.php:26-45` |
| Credits inside the buckets | Open credit memos and unused deposits, as NEGATIVE amounts in 1-30 to 91+ (never Current). | −(credit memo total − Σ applications on or before as-of, not reversed). Deposits: deposit amount − Σ deposit applications, same rule. ÷ 100. Only remainders above 0. | A deposit tied to a work order counts only once part of it is applied, and then only the unused rest. Refunds reduce a memo through a refund-type application. | `AgingCalculator.php:50-67`; `OpenBalanceAsOfSql.php:172-218` |
| Totals footer: Current | Organization-wide Current, from the database — **not** the sum of the visible rows. | Σ as-of balance of invoices where TIMESTAMPDIFF(DAY, due date, as-of) ≤ 0, ÷ 100. | Requires created on or before as-of and balance **≠ 0**. Invoices with no due date fall in no bucket. | `DbalAgingSummaryTotalsFetcher.php:32-78`; `AccountReceivableTotalsCalculator.php:19-33` |
| Totals footer: 1-30 / 31-60 / 61-90 / 91 and Over | Same per bucket, net of credits. | (Σ invoice as-of balance in the day range) − (Σ credit memo and deposit remaining in the age range), ÷ 100. | Credit rules match the rows. | `DbalAgingSummaryTotalsFetcher.php:80-149` |
| Totals footer: Total | Grand total. | Sum of the five footer buckets, in PHP. |  | `AgingSummaryTotals.php` |

**Gotchas:**

- **The footer can differ from the rows.** It is separate SQL over the whole organization, while rows load 30 at a time — scroll to the end before adding them up. The footer includes an over-paid invoice (negative balance); the rows don't. An invoice with no due date sits in a bucket in the rows (via credit terms) but in no bucket in the footer.
- **An empty bucket is blank, not $0.00.** Negatives show as `$-12.34`.
- **Customer order is undefined** and clicking a column header doesn't re-sort.
- **Past dates are replayed** from payment and application dates, not read from today's stored balance.
- **A credit created today lands in 1-30**, never Current.
- **Only complete 24-hour days count** towards age. UNSURE: what time of day stored due dates usually carry.
- **The Print button** uses a different endpoint (`reporting/account-receivable/pdf`) — not traced.

### A/R Aging Detail

**What it shows:** every open invoice, credit memo and unused deposit, grouped into the five buckets (each expandable), with a total per bucket and a grand total.

**Filters that change the numbers:** the as-of date only, with the same rules and the same included/left-out records as the Summary. No customer, location or status filter. All rows load in one go, not paged.

| Column (screen label) | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Bucket header row | Bucket name and how many rows it holds, e.g. "1-30 days past due (n)". Oldest bucket first. | n = rows in the bucket | Each invoice or credit appears once. | `AgingDetailReport.vue:71-85,321-357` |
| Date | Invoice date, or credit creation date. | shows `invoice.created_on` / `credit_memo.date_created` / `deposit.date_created`, in the location time zone; "Today", "Yesterday", "2 days ago", else "MMM d, yyyy". |  | `AgingDetailReport.vue:376-382`; `helpers.ts:186-258` |
| Transaction type | `invoice` or `credit` (credit covers credit memos and deposits). | shows type |  | `AgingDetailTransaction.php:94-97` |
| ID | Invoice number (e.g. S1-123), or credit memo / deposit number with shop id. Clickable for invoices only. | shows display number |  | `AgingDetailReport.vue:390-396` |
| Customer full name | Company name. | shows `company.name` |  | `AgingDetailReport.vue:397-403` |
| Location full name | Location of the invoice, credit memo or deposit. | shows `workplace.name` |  | `AgingDetailReport.vue:404-410` |
| Due date | Invoice due date. For credits, the creation date. | shows `invoice.due_date`, or invoice date + credit-term days |  | `AgingDetailTransaction.php:107-141` |
| Amount | Invoices: the original amount. Credits: minus the **remaining** unapplied amount on the as-of date. | Invoice amount ÷ 100; credit −remaining ÷ 100. PHP. |  | `AgingDetailTransaction.php:107-141` |
| Open balance | Invoices: the as-of open balance. Credits: minus the remaining amount. | Same replay as the Summary. | Rows with a zero or negative balance are left out. | `OpenBalanceAsOfSql.php:184-218` |
| Bucket total (collapsed row, or "Total for \<bucket>" when expanded) | Bucket subtotal. | Σ Amount and Σ Open balance of the bucket's rows, PHP. |  | `AgingDetailBuckets.php:37-52` |
| Which bucket a row is in |  | Invoices: 0 days if not yet due, else whole days since due date. ≤ 0 Current, 1-30, 31-60, 61-90, ≥ 91. Credits: at least 1 day, so never Current. |  | `Invoice.php:47-58`; `Credit.php:34-45` |
| Totals (grand) | Grand totals. | Σ of every row's Amount and Open balance, PHP. |  | `AgingDetailBuckets.php:37-52` |

**Gotchas:**

- **Detail grand Open balance = the Summary's rows (all pages)**, not the Summary footer, for the over-paid and no-due-date cases above.
- **A credit shows its remainder in both Amount and Open balance.**
- **Row order inside a bucket is undefined.** NOT FOUND — searched the customer fetcher, query handler and buckets class for a sort.
- **Dates can look one day off.** Display is in the location time zone, but the bucket is decided on UTC timestamps.

### A/R Aging Collection

**What it shows:** per customer, the invoices that are **past due** on the as-of date (with days past due), plus all that customer's open credits, with customer totals and a grand total.

**Filters that change the numbers:** as-of date, same rule as above. The **Customer** chip limits the customer list. All locations. Invoices not yet past due are left out; all credits are included. Customers load 30 at a time, in undefined order.

| Column (screen label) | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Customer header row | Customer name and how many rows sit under them. | n = rows shown for the customer | Listed if they have a past-due invoice with balance above 0, an open credit memo, or a qualifying deposit — so a credits-only customer can appear. | `AgingCollectionReport.vue:79-95`; `CollectionsQueryHandler.php:21-30` |
| Date | Invoice date, or credit creation date. | shown in the location time zone | Rows within a customer run oldest first. | `CollectionsItem.php:85-91` |
| Transaction type | `invoice` or `credit`. | shows type |  | `CollectionsItemTransaction.php:216-251` |
| ID | Invoice number, or credit number with shop id. | shows display number |  | `CollectionsItem.php:117-124` |
| Location full name | Location name. | shows `workplace.name` |  | `AgingCollectionReport.vue:425-431` |
| Due date | Invoice due date; for credits, the creation date. | shows `invoice.due_date` or invoice date + credit-term days |  | `CollectionsItemTransaction.php:216-251` |
| Past due | Whole days past due. | Invoice: whole days from due date to end of the as-of day; rows of 0 or less are dropped. Credit: at least 1 day since creation. PHP. | Due date + 1 day shows "1". | `Invoice.php:47-58`; `Credit.php:34-45` |
| Amount | Invoice: original amount. Credit: minus the remaining amount. | invoice amount ÷ 100; −remaining ÷ 100 |  | `CollectionsItemTransaction.php:216-251` |
| Open balance | Invoice: as-of open balance. Credit: minus the remaining amount. | Same replay as the Summary |  | `OpenBalanceAsOfSql.php:184-218` |
| Customer total (collapsed row, or "Total for \<customer>") | Customer subtotal. | Σ Amount and Σ Open balance of that customer's listed rows, PHP | Past-due invoices + credits only. | `CollectionsItem.php:62-100` |
| Totals footer: Amount | Organization-wide past-due invoice amounts minus open credits. | (Σ amount of invoices created by as-of, past due, balance ≠ 0) − (Σ remaining of open credit memos and qualifying deposits), ÷ 100. Database. | **Ignores the Customer chip.** | `DbalCollectionsTotalFetcher.php:33-134` |
| Totals footer: Open balance | Same, using open balances. | (Σ as-of open balance of those invoices) − (same credit total), ÷ 100 | Ignores the Customer chip. | `DbalCollectionsTotalFetcher.php:33-134` |

**Gotchas:**

- **With a customer selected, the footer still shows the whole organization.**
- **Not-yet-due invoices are hidden but credits are not**, so a customer here can total lower, or negative, versus their A/R Aging Summary total.
- **A customer with a past-due invoice can be missing** if that invoice has no due date.
- **Rows need a balance above 0; the footer takes anything ≠ 0**, and the footer skips invoices with no due date.
- **The link from the Summary does not carry the as-of date.** UNSURE how a saved date preference interacts.

### A/P Aging Summary

**What it shows:** per vendor, vendor invoices (deliveries) still unpaid, split into Current / 1-30 / 31-60 / 61-90 / 91 and Over by due date, net of unspent vendor credits, plus a Totals footer.

**Filters that change the numbers:**

- **As-of date:** same end-of-day rule as A/R. Invoices age from their due date; vendor credits from their creation date.
- **All locations.** Vendors are always sorted by name.
- **Left out:** vendor transactions that are not deliveries (returns, credits, manual, payments); invoices with no due date; invoices dated after the as-of date; invoices with a zero balance.
- **Two calculation modes — checked by hand.** For today or a future date it reads today's stored balances. For a past date it replays payments and credit applications by date (`ApPaymentAggregationTrait.php:13-16`).

| Column (screen label) | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Vendor | Vendor name. Clicking opens A/P Unpaid Invoices for that vendor. | shows `vendor.name` | Listed if they have a qualifying invoice or credit. Loaded 30 at a time. | `ApAgingSummaryReport.vue:192-199`; `DbalApAgingSummaryFetcher.php:31-67` |
| Current | Invoices not yet past due. Credits never land here. | Σ open balance where TIMESTAMPDIFF(DAY, due date, as-of) ≤ 0, ÷ 100. Database. Blank if 0. | Past date: open balance = amount − Σ payments dated by as-of. Today or later: stored balance. | `DbalApAgingSummaryFetcher.php:74-116,307-337` |
| 1-30 Days | Invoices 1–30 days late minus credits aged 0–30 days. | Σ invoice open balance where 1 ≤ days ≤ 30 − Σ credit unapplied where credit age ≤ 30, ÷ 100 | Day 30 is in this bucket. Past date: credit unapplied = credit amount − Σ credit payments dated by as-of; today: stored balance. | `DbalApAgingSummaryFetcher.php:88-93,137-141`; `ApAgingSummaryQueryHandler.php:86-98` |
| 31-60 Days | Same, 31–60. | Invoices 31 ≤ days ≤ 60; credits 31 ≤ age ≤ 60 | Day 60 is in this bucket. | same fetcher |
| 61-90 Days | Same, 61–90. | Invoices 61 ≤ days ≤ 90; credits 61 ≤ age ≤ 90 | Day 90 is in this bucket. | same fetcher |
| 91 and Over | Same, over 90. | Invoices days > 90; credits age > 90 | Day 91 starts here. | same fetcher |
| Total (row) | Vendor's net amount owed. | Sum of the five buckets, PHP. Blank if all five are blank. | Can be negative. | `ApAgingSummaryQueryHandler.php:100-110` |
| Totals footer (all six cells) | Same buckets across the whole organization. | Same formulas without a vendor filter, summed in the database; Total = sum of the five, PHP. | Same rules as the rows. | `ApAgingSummaryQueryHandler.php:113-136`; `DbalApAgingSummaryFetcher.php:164-300` |

**Gotchas:**

- **Today and a past date use different logic**, so they can disagree for the same data — for example after a backdated payment.
- **A bucket is blank when invoice and credit sums are both exactly 0**, but shows $0.00 when they cancel out.
- **Invoices with no due date appear nowhere** on the A/P reports. Over-paid invoices (negative balance) **are** included.
- **A vendor credit drops out once fully spent** on or before the as-of date.
- **Unlike A/R, the footer matches the rows** across all pages.

### A/P Aging Detail

**What it shows:** every unpaid vendor invoice and unspent vendor credit, grouped into the five buckets, with bucket totals and a grand total.

**Filters that change the numbers:** the as-of date only, with the same rules, the same left-out records and the same two calculation modes as A/P Aging Summary. All locations. Not paged.

| Column (screen label) | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Bucket header row | Bucket name and row count, oldest first. | n = rows in the bucket | The screen shows 100 rows per bucket at first, but "(n)" and totals use all rows. | `ApAgingDetailReport.vue:59-74,346-386` |
| Date | Vendor invoice date, or credit creation date. | shows `vendor_transaction.date` / `vendor_credit.date_created` in the location time zone |  | `DbalApAgingDetailFetcher.php:74,102-103` |
| Transaction type | `invoice` or `credit`. | shows type |  | `ApAgingDetailQueryHandler.php:~40-46` |
| No. | Vendor invoice number or credit number. Clickable for invoices linked to a delivery. | shows `invoice_number` / `credit_number` |  | `DbalApAgingDetailFetcher.php:75,103` |
| Vendor Name | Vendor name. | shows `vendor.name` |  | `ApAgingDetailReport.vue:423-429` |
| Location Name | Location of the vendor account. | shows `workplace.name` |  | `DbalApAgingDetailFetcher.php:85-87` |
| Due Date | Invoice due date; for credits, the creation date. | shows `vendor_transaction.due_date` / `vendor_credit.date_created` |  | `DbalApAgingDetailFetcher.php:79,108` |
| Past Due | Whole days past due, as the database counts them. | Invoice: TIMESTAMPDIFF(DAY, due date, as-of) — 0 or negative when not yet due. Credit: at least 1. | Day 30 is in 1-30. | `DbalApAgingDetailFetcher.php:80,109,137,171` |
| Amount | Invoice: original amount. Credit: minus the **original** credit amount. | `vt.amount` ÷ 100; −`vc.amount` ÷ 100 |  | `ApAgingDetailQueryHandler.php:26-34` |
| Open Balance | Invoice: unpaid balance on the as-of date. Credit: minus the unapplied remainder. | Past date: (amount − payments dated by as-of) ÷ 100; today: stored balance. Credits likewise, negated. |  | `DbalApAgingDetailFetcher.php:82,139,173` |
| Bucket total (collapsed row, or "Total for \<bucket>") | Bucket subtotals. | Σ Amount and Σ Open Balance over all the bucket's rows, PHP |  | `AgingDetailBuckets.php:37-52` |
| Totals footer (Amount, Open Balance) | Grand totals. | Σ of all rows |  | `ApAgingDetailReport.vue:159-171,389-392` |

**Gotchas:**

- **In A/P, a credit's Amount (original) and Open Balance (remainder) differ.** In A/R both show the remainder.
- **Past Due shows 0 or negative** for items not yet due.
- **Rows are sorted by Past Due, highest first**; ties are in undefined order.
- **The Detail Open Balance grand total should equal the A/P Summary Total footer** — same filters and bucket rules.

### A/P Unpaid Invoices

**What it shows:** per vendor, all unpaid vendor invoices — including ones not yet due — and unspent vendor credits on the as-of date, with vendor totals and a grand total.

**Filters that change the numbers:** as-of date, same rule as above. The **Vendor** chip limits which vendors are listed. No age filter and no buckets. Same two calculation modes and the same left-out records as A/P Aging Summary. Vendors load 30 at a time, sorted by name; rows within a vendor run by date, oldest first.

| Column (screen label) | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Vendor header row | Vendor name and how many rows sit under it. | n = the vendor's rows | Listed if they have a qualifying invoice or credit. | `ApUnpaidInvoicesReport.vue:68-84`; `DbalApUnpaidInvoicesFetcher.php:42-79` |
| Date | Vendor invoice date, or credit creation date. | shown in the location time zone |  | `DbalApUnpaidInvoicesFetcher.php:167,198` |
| Transaction Type | `Invoice` or `Credit`. | shows type |  | `DbalApUnpaidInvoicesFetcher.php:166-167,196-197` |
| No. | Vendor invoice number or credit number. | shows `invoice_number` / `credit_number` |  | `ApUnpaidInvoicesReport.vue:407-413` |
| Vendor Name | Vendor name. | shows `vendor.name` |  | `ApUnpaidInvoicesReport.vue:414-420` |
| Location Name | Location of the vendor account. | shows `workplace.name` |  | `ApUnpaidInvoicesReport.vue:421-427` |
| Due Date | Invoice due date; credits show "—". | shows `vendor_transaction.due_date` |  | `DbalApUnpaidInvoicesFetcher.php:174,204` |
| Past Due | Whole days from due date to the as-of cut-off; credits show "—". | TIMESTAMPDIFF(DAY, due date, as-of) — can be 0 or negative | Not floored at 0. | `DbalApUnpaidInvoicesFetcher.php:175,205` |
| Amount | Invoice: original amount. Credit: minus the original credit amount. | `vt.amount` ÷ 100; −`vc.amount` ÷ 100 |  | `ApUnpaidInvoicesVendorGrouper.php:23-31` |
| Open Balance | Invoice: unpaid balance on the as-of date. Credit: minus the unapplied remainder. | Past date: replay; today: stored balance | Over-paid invoices (negative) included. | `DbalApUnpaidInvoicesFetcher.php:177,356,391` |
| Vendor total (collapsed row, or "Total for \<vendor>") | Per-vendor subtotals. | Σ Amount and Σ Open Balance of the vendor's rows, credits negative, PHP |  | `ApUnpaidInvoicesVendorGrouper.php:50-70` |
| Totals footer: Amount | Organization-wide invoices minus credits. | (Σ qualifying invoice amounts) − (Σ qualifying credit amounts), ÷ 100. Database. | **Ignores the Vendor chip.** | `DbalApUnpaidInvoicesFetcher.php:120-136,222-337` |
| Totals footer: Open Balance | Organization-wide open balance. | (Σ invoice open balance) − (Σ credit unapplied remainder), ÷ 100 | Ignores the Vendor chip. | same |

**Gotchas:**

- **With a vendor selected, the footer still shows the whole organization.**
- **Invoices not yet due are included** here with a 0 or negative Past Due; A/P Aging Summary puts them in Current.
- **Sorting a column header doesn't change the order.**

## Accounting

### IBS Batches

**What it shows:** Three tabs for companies set up for IBS: **Ready to Send**, **Sent** (batches) and **Payments**. Nothing is calculated on screen; amounts are stored figures ÷ 100. **No date filter and no totals.**

**Filters that change the numbers:** Ready to Send lists **unpaid** invoices not yet in a batch, plus unapplied deposits and open credit memos, for IBS companies at the active location. Payments lists non-reversed payments tied to a batch. Search works on Ready to Send (invoice number or contact name; company name or credit number for credits) but **the Sent tab ignores it**.

| Tab → Column | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Ready → Date | Invoice created date (credit created date for credits) | shows date | — | ListIbsTransactionsQueryHandler.php:94 |
| Ready → Type, No., Customer | Row type; "INV-" + number; **company** name | shows values | Search matches the contact, not this company name | same:92,101 |
| Ready → Total | Transaction amount | round(amount ÷ 100, 2); credits negative | — | CustomerTransactionDetails.php:69-72 |
| Ready → Balance | Still owed | round(balance ÷ 100, 2); blank for credits | — | CustomerTransactionDetails.php:74-77 |
| Ready → Status | Status | "Unpaid"; credits "Unapplied" | — | same |
| Sent → batch Date | Batch created | shows date | — | ListIbsBatchesQueryHandler.php:46 |
| Sent → batch Total | Net value of the batch | stored batch amount = Σ invoices − credits applied | Stored, not summed on screen | IbsBatch.php:61-70 |
| Sent → batch Balance | Still unpaid | stored balance (falls with payments, rises on a reversal) | — | IbsBatch.php:114-144 |
| Sent → invoice line Date | **Transaction** date | `customer_transaction.date` | Not the same date as Ready to Send | ListIbsBatchesQueryHandler.php:107 |
| Sent → invoice line Total / Balance | Invoice amount and balance | ÷ 100, 2 dp | — | same:117-118 |
| Sent → credit line | Credit applied | Total = −amount ÷ 100; Status Applied / Unapplied | — | same:174-211 |
| Payments → Date, Type, No., Memo, Status | Payment details | shows values | Reversed payments hidden | ListPaymentsQueryHandler.php:93-111 |
| Payments → Amount | Amount paid | round(payment statements amount ÷ 100, 2) | Cash payments only | ListPaymentsQueryHandler.php:135-138 |

### QB Unexported

**What it shows:** QuickBooks sync entries that failed or are still waiting, in Customers / Vendors / Journal Entries tabs. Active location only, newest first, no date filter.

| Column | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Date | When the entry was logged | `bookkeeping_log.created_at` | — | BookkeepingLogPaginatedListReader.php:48 |
| Type | What failed (e.g. Invoice Create, Payment Reverse) | readable label of the entry type | — | ListUnexportedItemsQueryHandler.php:36-58 |
| No. | Document number | invoice / payment / credit / bill number from the entry, depending on type | Blank for some types | same:179-204 |
| Customer / Vendor / User | Name for that tab | all three read the **same** field; Customers tab falls back to a lookup if "Unknown" | The User column may show a record id instead of a name (not confirmed) | UnexportedItemsTable.vue:141-158 |
| Error | Failure message | stored message, tidied | Long text cut; full text in tooltip | same:159-165 |
| **Tab counts "(N)"** | Entries still waiting | count of status "new" entries for that tab at the active location | — | BookkeepingLogPaginatedListReader.php:67-79 |

### Export Reports (download dialog)

**What it shows:** No on-screen numbers — it downloads one CSV for the chosen export and dates.

**Filters that change the numbers:** Today, Yesterday, This Week, Last Week, This Month, Last Month (worked out on the server in the location's time zone, weeks Sunday–Saturday) or Custom (at most 366 days). **Most exports cover all locations**; only Payroll Timesheet is limited to the active location.

| Export → column | What it calculates | Formula | Counted / left out | Source |
| --- | --- | --- | --- | --- |
| Customer Contact / Vendor Contact → Opening Balance | — | always blank | Companies/vendors created in the dates | CustomerContactExportQueryHandler.php:52-77 |
| Sales Representative Assignments | Customer, rep, rep active? | current state, no dates | — | SalesRepAssignment.php |
| Customer Invoice → ItemQuantity | Hours (labor) or units (parts) | labor: `time_estimate` ÷ 60, 2 dp; parts: quantity; fees and shop supplies: 1 | Invoice created date. **No void filter found** | InvoiceGenerator.php:82-88 |
| Customer Invoice → ItemRate | Rate | labor rate ÷ 100; part price ÷ 100; fee amount | "Restricted" without pricing permission | InvoiceData.php:203,219 |
| Customer Invoice → ItemAmount | Line amount | labor: stored price; parts: price ÷ 100 × qty; shop supplies; fees (discounts negative) | Declined lines left out | InvoiceData.php:204-311 |
| Customer Invoice → ItemTaxAmount | Line tax | stored tax figures | — | InvoiceData.php:205-326 |
| Customer Payment → Amount | Cash paid per invoice line; deposits as their own rows | payment line amount ÷ 100; deposit amount ÷ 100 | Payment date / deposit date. Reversed left out | PaymentGenerator.php |
| Customer Credit Memo → Amount | Credit before tax | no lines: total ÷ 100; with lines: round(qty × price) − restocking fee | Credit memo date; voided left out | CustomerCreditMemoExportQueryHandler.php:74-212 |
| Vendor Bill → LineAmount | Value delivered | round(price × quantity delivered, 2) | Delivery invoice date | VendorBillExportQueryHandler.php:65-80 |
| Vendor Bill → LineTaxAmount | Line's share of the bill's tax | weighted by line amount (whole dollars only); last line takes the rounding leftover | — | same:82-155 |
| Vendor Bill Payment → Amount | Amount paid | payment amount ÷ 100 on **every** bill line of the payment; credits negative | A payment over several bills may repeat the full amount on each (not confirmed against data) | VendorPaymentCollection.php:42-49 |
| Vendor Credit Memo → Amount | Credit per returned item | returned credits ÷ 100 | Credit date | VendorReturnCollection.php:49 |
| Payroll Timesheet → Total / WO / Internal Hours | Hours per technician per day | Σ round((end − start) ÷ 3600, 2); WO = on a work order, Internal = not; Total = both | Active location. Clocks over midnight are split; pieces outside the dates dropped | PayrollTimesheetExportQueryHandler.php |
| Journal Entry → Amount | Value of each stock movement, as two opposite rows | ((new qty × new cost) − (old qty × old cost)) ÷ 100 | Invoicing, invoice reversal and manual stock changes only | JournalEntry ReportGenerator.php:72-156 |

## Communications

Neither report calculates anything; they list note cards. Both cover the **whole organisation** (not the active location) and fetch **at most 100 notes**, with no further pages.

### Notes

**Filters that change the numbers:** Date Range (default This Week; All, Today, This/Last Week, This/Last Month, Custom) on the note created date, worked out on the **computer's own clock**, not the shop's time zone. Filter by Author, Filter by Mention, Search (sender or text). Sort: Newest, Oldest, High Priority (reminders due today, then upcoming, then past, then none). Deleted notes and notes you may not read are left out.

| Field | What it shows | Formula | Source |
| --- | --- | --- | --- |
| Sender, reference pill, date/time, "Edited on", Customer Visible, reminder date, text | Stored note fields | shows values | NoteCard.vue:56-140 |
| Totals / counts | **None** | — | NotesReport.vue |

### Reminders

**Filters that change the numbers:** always limited to notes that have a reminder date **and mention you** — a reminder on a note that does not mention you will not appear. Reminder Due (default All) on the reminder date, worked out on the computer's own clock. Search. Sorting is done in the browser on the 100 fetched notes.

| Field | What it shows | Formula | Source |
| --- | --- | --- | --- |
| Note card fields | Same as Notes | shows values | RemindersReport.vue:302-313 |
| Totals / counts | **None** | — | RemindersReport.vue |

## Dashboard check — which report column each dashboard value should match

**How to use this:** set the report to the **same dates and the same location** as the dashboard tile, then compare the figure in the **Totals / Summary row** of the column named below. "Same formula" means the code was checked to use the same calculation — for three tiles the dashboard literally calls the report's own code.

**Before you compare — things that cause a legitimate mismatch:**

- **Each tile has its own date pill.** The four tiles open on **This Month**; Sales by Customer opens on **Last 12 Months**. Charts and cards inside a tile follow that tile's pill.
- **"This Month" ends today on the dashboard**, but the Sales and Advisor Analysis reports end it at the **end of the month**. These only differ if there are future-dated records. To be safe, use a **Custom** range on both.
- **Location:** the dashboard uses only the active location. Set the report's location to the same one.
- **Running clocks:** hours count a running clock up to "now", so figures drift if someone is clocked in between loading the dashboard and loading the report.
- **Chart filters:** a technician or advisor filter on a chart narrows the chart (and hides table rows) but **never changes the tile number**. Clear them before comparing.
- **Chart buckets:** up to 31 days = daily, 32–182 = weekly (rolling 7 days from the start date, not calendar weeks), 183–731 = monthly.
- **No "vs previous period" figure** exists on any tile; the code says it was removed on purpose.

### Tiles

| Dashboard value | What it calculates | Formula | Compare with (Report → column, Totals row) | Same formula? |
| --- | --- | --- | --- | --- |
| **Revenue** headline | Sales before tax, minus credit memos | (Σ invoice subtotal − Σ credit memo amount without tax) ÷ 100, for non-void invoices and credit memos dated in the period. Can be negative | **Sales → Subtotal** | **Same** — same query (SalesRevenuePopulation.php) |
| Revenue: "Parts x% · Labor y% · Other z%" | Share of revenue | Parts = parts billed − credit memos; Labor = labor billed; Other = the rest (shop supplies, fees). Whole percentages forced to add to 100 | **Sales →** Parts Invoiced ÷ Subtotal, Labor Invoiced ÷ Subtotal | Same amounts; the tile rounds to whole % so it can be **up to 1 point** off your own decimal calculation |
| Revenue: "{n} Invoices" (shown when revenue is $0 or less) | Count of invoices | count of distinct non-void invoices in the period | **Sales →** number of rows that have an invoice number (not credit rows) | Same |
| **Billing Efficiency** headline | Billed hours ÷ clocked hours | round(Σ billed hours ÷ Σ clocked hours × 100, 2), each work order on its **earliest** invoice in the period | **Advisor Analysis → Billing Efficiency** (no Advisor filter) | Same. No clocked hours: tile "-", report "N/A" |
| Billing Efficiency: "{x} Invoiced / {y} Clocked" | The two hour totals | Σ billed hours; Σ clocked hours | **Advisor Analysis → Hrs Invoiced, Hrs Worked** | Same |
| **Technician Efficiency** headline | Technician hours credited ÷ clocked | round(Σ tech share ÷ Σ clocked × 100, 2), on each work order's **latest** invoice, Invoiced/Paid only | **Technician Efficiency → Invoiced tab → Efficiency** (not the Completed tab) | **Same** — the tile runs the report's own code. No clocked hours: tile "-", report 0% |
| Technician Efficiency: "{x} Invoiced Tech Hrs / {y} Clocked" | The two hour totals | Σ technician rows | **Invoiced tab → Invoiced Tech Hrs, Clocked Hrs** | Same |
| **Technician Utilization** headline | Work-order share of clocked time | round(Σ WO seconds ÷ Σ all clocked seconds × 100, 2); clocks cut to the period; billable staff only | **Technician Utilization → Summary row → Utilization %** (no technician filter) | **Same** — the tile runs the report's own code |
| Technician Utilization: "{x} WO Hrs / {y} Clocked" | The two hour totals | round(Σ seconds ÷ 3600, 2) | **Summary row → WO Hours, Total Hours** | Same |
| **Sales by Customer**: "{n} customers" | Customers with sales in the period | count of customer groups ("No company" counts as one) | **Sales By Customer →** number of customer rows (all pages, both product types) | Same population. The report has no printed count, so you must count rows |
| Sales by Customer: "Top: {name}" | Biggest customer | first customer when sorted by Subtotal, high to low | **Sales By Customer** sorted by Subtotal → first row | **Same** — the tile calls the report's own code |
| **At Risk Customers** (count, "$ (12mo)", sparkline) | Customers not invoiced for at least the chosen days (default 120) who have 2+ invoices ever or 12-month revenue above $0 | as described | **No matching report** | — |
| Sparklines (all tiles) | One point per bucket | the tile's formula for that bucket only; Revenue points add up exactly to the headline | The same report run for one bucket's dates | Same; Billing Efficiency puts a work order in the bucket of its earliest invoice across the whole range, so a single-bucket rerun can differ |

### Charts (inside the tiles)

| Chart → line | Compare with | Same formula? |
| --- | --- | --- |
| **Revenue** bars | **Sales → Subtotal** for that bucket's dates. Empty buckets show $0. Bars add up to the tile | Same — the Sales page shows this same chart |
| **Technician Efficiency** → Efficiency % / one line per technician | **Technician Efficiency → Invoiced tab → Efficiency** (total or that technician's row) for the bucket | Same — the report shows this same chart |
| **Billing Efficiency** → Billing Efficiency % / one line per advisor; hover ELR | **Advisor Analysis → Billing Efficiency** and **ELR**, filtered to the advisor and bucket | Same |
| **Technician Utilization** → Utilization % / one line per technician | **Technician Utilization → Utilization %** for the bucket | Same; bucket hours can add up slightly differently from the headline when a clock crosses a bucket edge |

### Cards (tables inside the tiles)

| Card → column | Compare with (report column, same dates) | Same formula? |
| --- | --- | --- |
| **Advisor Analysis card** → Worked Hours, Invoiced Hrs, Billing Efficiency, ELR | **Advisor Analysis** filtered to that advisor → Hrs Worked, Hrs Invoiced, Billing Efficiency, ELR | Same. The ELR tooltip "Labor Sales" has **no matching report column** |
| **Technician Efficiency card** → Clocked Hrs, Invoiced Tech Hrs, Efficiency | **Technician Efficiency → Invoiced tab** → that technician's row | Same. Under 0.01 clocked hours: report 0, card blank |
| **Technician Utilization card** → WO Hours, Internal Hours, Total Hours, Utilization % | **Technician Utilization** → that technician's row | Same. Total can be more than WO + Internal (clocks on neither) |
| **Sales by Customer card** → Invoices, Labor Delta, Subtotal | **Sales By Customer** → "(n)" next to the name, Labor Delta, Subtotal | Same |
| **At Risk card** → Last Invoice Date, Revenue (12 mo) | **Sales** filtered to that customer: newest Invoice Date; Subtotal total for the same 12 months (the cell links straight there) | Same. "Lifetime invoices" has **no matching report** (reports stop at 366 days) |

### Reports with no dashboard value

Sales By Representative, Shop Efficiency, Work In Progress, the A/R and A/P aging reports, Sales Tax Collected, Parts Velocity, Inventory Value and everything under Accounting and Communications. **Shop Efficiency is not the Technician Utilization tile** — it measures something different (billed hours ÷ all billable clocked time).

**Watch out:** the **Sales By Customer Subtotal** (and the Sales by Customer card) is **after** the old invoice-level % discount and does **not** take off credit memos. The **Revenue tile** and **Sales Subtotal** are **before** that discount and **do** take off credit memos. Their totals for the same dates can legitimately differ.

The separate **Accounting dashboard** (Cash on hand, Accounts payable, Net income, Effective labor rate, Gross margin, DSO, AR aging, Sales tax owed, Bills coming due) was **not traced** — its figures come from the accounting module, not from the Reports tab.

## Sources and how far this was checked

| Item | Status |
| --- | --- |
| Build you are checking | **Staging.** Last deployed 28 Oct 2026 13:56 UTC from `develop` commit **f8698cbc1**. |
| Code read | `develop` at commit **e8b3c4b31** (28 Oct 2026). The only difference from staging's f8698cbc1 is two commits changing one infrastructure file (`ecs-accounting.tf`) — **no application code** — so every formula here is what staging runs. `main` (production) differs only in five CSV-export files, no calculation code. |
| If staging is redeployed | The formulas still hold unless a later deploy changes report or dashboard code. Check the staging deploy history before relying on this after a redeploy. |
| How it was checked | **Read from the code only. Nothing here was observed on a live screen.** Before each section was written, the strongest claims were re-checked line by line in the code (e.g. aging buckets, Shop Efficiency including void invoices, Sales By Customer ignoring credit memos, the Unit Sell rule, the dashboard tiles calling the reports' own code). |
| Where a line says "not confirmed" | The code was ambiguous or the answer depends on data; treat it as unverified. |
| Older formulas file | `build/report-suite/build-verify-2026-08-18/FORMULAS-SV-8582.md` (18 Aug 2026) covers 6 reports at an older build. The code has moved since, so this document replaces it. |
| Source column | File names are under `api/src/` (backend) or `app/src/` (screens); line numbers are for commit e8b3c4b31 (identical on staging). |

## Open questions (decisions for the product owner)

These are places where the code does something that may or may not be intended. They are **not** defects until the product owner answers.

**Definitions that differ between reports**

1. **What is "revenue" / "sales"?** Sales and the Revenue tile use the subtotal **before** the old invoice-level % discount and take off credit memos; Sales By Customer and Sales By Representative use it **after** that discount and ignore credit memos. Which is intended for a customer's total and for the shop's total?
2. **What are "invoiced hours"?** Quoted time (`time_estimate`) in Sales, Advisor Analysis, Shop Efficiency and Billing Efficiency; technician time (`tech_time`) in Technician Efficiency.
3. **Which invoice counts for a work order?** Newest (Sales hours), earliest in the dates (Advisor Analysis, Billing Efficiency), latest overall and Invoiced/Paid only (Technician Efficiency). A work order with two invoices can count in one and not another.
4. **Margin** means a percentage in Sales but dollars in Sales By Customer / Representative.
5. **Live vs frozen:** Sales and Advisor Analysis use live hours and costs; Sales By Customer uses figures frozen at invoicing. Invoices made before the back-fill count as $0 there.
6. **Zero clocked hours** shows "-" / N/A on the tiles but 0% in the Technician Efficiency totals row. Which should users see?

**Labor**

7. **Shop Efficiency includes void invoices** in Total Invoiced Hours, and has no detail rows. Intended?
8. **Timesheet Activities footer** is cut to the dates and leaves out clocks on neither a work order nor a department, so it doesn't match the rows.
9. **Timesheets** (hidden) drops minutes from Hours, has no location filter and ignores Custom dates. Is it still needed?
10. **Presets** are worked out in the browser for some reports and on the server for others, and "This Month" ends today on some and at month end on others.
11. **Work In Progress** strip figures leave out work-order adjustments (except Estimates).

**Sales and tax**

12. **Sales Tax Collected** dates every invoice by its **last payment**, has no void filter, and its rate totals are not reduced by credit memo tax (the backend works out a reduced figure but never shows it).
13. **Follow Up** (hidden) counts void invoices in Total Spend and counts work orders twice when they have two invoices. Is it still needed?
14. **Sales By Representative** credits the rep fixed at invoicing. Should reassigning a customer move past sales?

**A/R and A/P aging**

15. Over-paid invoices in the footer; invoices with no due date; credits never in Current; the footer ignoring the Customer/Vendor filter; the time zone used when all locations are chosen; A/P using today's balance vs replayed history; negative Past Due; manual/return ledger rows left out; credit Amount shown differently in A/R and A/P; no defined sort order.

**Parts**

16. **Parts Velocity:** customer returns are shown but not taken off Units Sold, Revenue or Demand; Special Order Demand counts lines while the tooltip says transactions; "Last 90 days" is 91 days; money is dated by invoice date, not work-order end date.
17. **Cost basis** differs: Parts Velocity uses the cost saved on the work-order part, Inventory Value the part's average cost.
18. **Inventory Value** shows no rows for a location with a missing nightly snapshot; the footer can differ by cents from adding the rows.

**Accounting and Communications**

19. **IBS Batches:** Customer shows the company but search matches the contact; Sent tab ignores search; the two tabs' Date columns mean different dates.
20. **Exports:** most cover all locations while the screens cover one; Vendor Bill Payment may repeat a full payment on every bill line; Vendor Bill tax weighting uses whole dollars.
21. **QB Unexported:** the User column may show a record id instead of a name.
22. **Notes / Reminders:** organisation-wide, only the first 100 notes, dates from the computer's clock not the shop's, and Reminders only shows notes that mention you.

**Dashboard**

23. Should Shop Efficiency appear on the dashboard? (An unused link to it remains in the code.)
24. Should a filtered chart be allowed to differ from its tile?
25. Can Sales By Customer show its customer count, so the "{n} customers" tile can be checked without counting rows?
