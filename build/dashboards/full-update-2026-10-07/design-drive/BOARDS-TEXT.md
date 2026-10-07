## Main.dc.html
Dashboard v1
Every screen this PR touches, before and after. Every board is a screenshot, not a drawing, except row 15, which is drawn from the approved empty-state design.
Before is production's code as it ships today; after is this PR's build. Both ran on the same
local QA Testing data, so the figures can be read side by side.
PRD Dashboards
Ticket SV-8311
Branch SV-8311-dashboard-v1
Owner Chris Ward
Status Built, in PR review
Before · production
After · this build
New · no before exists
What this covers
The dashboard as it opens : six cards on one screen, each on its default range, every visit
Every card on Last 12 Months : the same comparison with the ranges matched
Choosing a date range : a pill per card, same presets
Revenue : the chart opens under its row instead of on a second page, and hovering it
Billing Efficiency : chart and Advisor Analysis table, hovering a month and a name
Technician Efficiency : chart and table, hovering a month and a name
Technician Utilization : chart and table, hovering a month and a name
Sales by Customer : new card
At Risk Customers : table under its card, and the inactivity window
Sales report : chart above the details, shown, hidden and hovered
Service Advisor Analysis report : chart above the details, shown, hidden and hovered
Technician Efficiency report : chart above the details, shown, hidden and hovered
Technician Utilization report : chart above the details, shown, hidden and hovered
On a phone : stacked cards with View Report
Tiles with no data : a grey dash and an empty-chart placeholder (approved design, to build)
Before: main at d7fdcd7, production's code; no dashboard code changed between release v26.39.1 and main.
After: SV-8311 merged with develop at 88d2825. The wider search box in the top bar comes from develop, not from this PR.
Captured 2026-09-28 at 1920 wide, and 390 wide for the phone.

## 01_Opens_Before.dc.html
Before · production
1. The dashboard as it opens
Every tile on its default: the four number tiles on This Month, the four chart panels on Last 12 Months, the four tables on This Month. The chart panels render empty, as the DDR records them on production.
Production code · defaults · full page
The same measure goes by two names: Invoicing Efficiency on the tile, Billing Efficiency by Advisor below it. Tech Efficiency reads "6 %" with a space, and Efficiency by Tech prints its percentages as bare numbers with no % sign. The top bar has no Dashboard link; the logo is the only way in.
[image before-dash-default.png] alt: Production dashboard on its defaults: four number tiles on This Month, four empty chart panels on Last 12 Months, four tables on This Month, At Risk Customers

## 01_Opens_After.dc.html
After · this build
1. The dashboard as it opens
Six cards on one screen. The four number cards open on This Month and Sales by Customer on Last 12 Months (S7-R7); At Risk opens on 120 days. Every visit opens on these defaults, whatever was chosen last time (S7-R8). Dashboard is now a link in the top bar.
This build · defaults · full page
Figures carry two decimals: Technician Efficiency reads 5.98% where the old tile rounded it to "6 %".
[image after-dash-default.png] alt: New dashboard on its defaults: four number cards on This Month, Sales by Customer on Last 12 Months, At Risk Customers on 120 days

## 02_Last12_Before.dc.html
Before · production
2. Every card on Last 12 Months
The same page with every tile, chart and table switched to Last 12 Months: 2,466 pixels tall at 1920 wide, and the four charts still empty.
Production code · Last 12 Months · full page
[image before-dash.png] alt: Production dashboard with every tile, chart and table on Last 12 Months; the four chart panels are still empty

## 02_Last12_After.dc.html
After · this build
2. Every card on Last 12 Months
The same six cards on Last 12 Months: Revenue $3,744,808.21, Billing Efficiency 105.54%, Technician Efficiency 43.98%, Technician Utilization 74.73%. Each card has its own trend line and an arrow beside its name that opens its report.
This build · Last 12 Months · full page
At Risk reads $40.50 (12mo) for Ruline Partners, where before read $446. The card now measures revenue the way Sales By Customer does, from the labor, parts and shop supplies stored on each invoice, and this local test invoice stores only its $40.50 of shop supplies.
[image after-dash.png] alt: New dashboard with every card on Last 12 Months

## 03_Range_Before.dc.html
Before · production
3. Choosing a date range
The range on each tile is small grey text. Clicking it opens a calendar with presets and Apply.
Production code · Revenue range open
[image before-datemenu.png] alt: Production: the Revenue tile range label opens a calendar with presets

## 03_Range_After.dc.html
After · this build
3. Choosing a date range
Each card's range is a blue pill. It opens the same calendar and the same presets, in the order S7-R2 sets: Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week.
This build · Revenue range open
[image after-datemenu.png] alt: New dashboard: the Revenue range pill opens the same calendar and presets

## 04_Revenue_Before.dc.html
Before · production
4. Revenue: opening the detail
Clicking the tile leaves the dashboard for a second Revenue page built under it: Back to Dashboard, an empty chart, and its own table of 900 invoices. The Sales report sits behind a link in the corner.
Production code · after clicking the Revenue tile
[image before-drill-revenueKpi.png] alt: Production: a separate Revenue page under the dashboard with an empty chart and a 900-row table

## 04_Revenue_After.dc.html
After · this build
4. Revenue: opening the detail
View details opens the monthly Revenue chart in a panel under the row, pointing back at its card (S6-R3). The other cards stay where they are. The arrow beside the card's name opens the Sales report itself.
This build · Revenue, View details open
[image after-open-revenueKpi.png] alt: New dashboard: Revenue View details open, monthly revenue bars in a panel under the first row

## 04_Revenue_Hover.dc.html
After · this build
4. Revenue: hovering the chart
Hovering a bar shows that month's revenue: Jul 2026, $2,030,953.
This build · pointer on Jul 2026
Production's chart does not render, so there is nothing to hover there.
[image after-hover-panel-revenueKpi.png] alt: Revenue chart with a tooltip reading Jul 2026, Revenue: $2,030,953

## 05_Billing_Before.dc.html
Before · production
5. Billing Efficiency: opening the detail
Clicking Invoicing Efficiency opens a second page: an empty chart with Filter Advisors, and a 900-row table of invoices with Efficiency % as a bare number (24.1).
Production code · after clicking Invoicing Efficiency
[image before-drill-billingEfficiencyKpi.png] alt: Production: a separate Invoicing Efficiency page with an empty chart and a 900-row table

## 05_Billing_After.dc.html
After · this build
5. Billing Efficiency: opening the detail
View details opens the Billing Efficiency chart, one line per advisor with an Advisor filter, above the Advisor Analysis table (S6-R4). The arrow opens the Service Advisor Analysis report.
This build · Billing Efficiency, View details open
Chart and table read the card's range, here Last 12 Months (S7-R5).
[image after-open-billingEfficiencyKpi.png] alt: New dashboard: Billing Efficiency View details open, one line per advisor above the Advisor Analysis table

## 05_Billing_Hover.dc.html
After · this build
5. Billing Efficiency: hovering the chart
Hovering the chart shows the month under the pointer with every series' value for that month. Each advisor carries that month's ELR on a second line: Marcus Halvorsen 117%, ELR $172.25.
This build · pointer on Jul 2026
Production's chart does not render, so there is nothing to hover there.
[image after-hover-panel-billingEfficiencyKpi.png] alt: Billing Efficiency chart with a Jul 2026 tooltip listing each advisor's percentage and ELR

## 05_Billing_Legend.dc.html
After · this build
5. Billing Efficiency: hovering a name
Hovering a name in the legend shows that person's latest month with a value and their average over the range, without hunting for their line. Marcus Halvorsen: 120%, Aug 2026, avg 107%.
This build · pointer on Marcus Halvorsen
Production's chart does not render, so there is nothing to hover there.
[image after-hover-panel-billingEfficiencyKpi-legend.png] alt: Legend readout for Marcus Halvorsen: 120%, Aug 2026, avg 107%

## 06_TechEff_Before.dc.html
Before · production
6. Technician Efficiency: opening the detail
Clicking Tech Efficiency opens a second page: an empty chart with Filter Technicians, and a 309-row table of invoice lines with Efficiency % as bare numbers.
Production code · after clicking Tech Efficiency
[image before-drill-techEfficiencyKpi.png] alt: Production: a separate Tech Efficiency page with an empty chart and a 309-row table

## 06_TechEff_After.dc.html
After · this build
6. Technician Efficiency: opening the detail
View details opens the chart, one line per technician with a Technician filter, above the Technician Efficiency table (S6-R5). The arrow opens the Technician Efficiency report.
This build · Technician Efficiency, View details open
Chart and table read the card's range, here Last 12 Months (S7-R5).
[image after-open-techEfficiencyKpi.png] alt: New dashboard: Technician Efficiency View details open, one line per technician above the Technician Efficiency table

## 06_TechEff_Hover.dc.html
After · this build
6. Technician Efficiency: hovering the chart
Hovering the chart shows the month under the pointer with every series' value for that month. Jun 2026: Carlos Mendez 129%, Ravi Kapoor 126%, Elena Sandoval 6%.
This build · pointer on Jun 2026
Production's chart does not render, so there is nothing to hover there.
[image after-hover-panel-techEfficiencyKpi.png] alt: Technician Efficiency chart with a Jun 2026 tooltip listing every technician's percentage

## 06_TechEff_Legend.dc.html
After · this build
6. Technician Efficiency: hovering a name
Hovering a name in the legend shows that person's latest month with a value and their average over the range, without hunting for their line. Grace Sullivan: 115%, Aug 2026, avg 104%.
This build · pointer on Grace Sullivan
Production's chart does not render, so there is nothing to hover there.
[image after-hover-panel-techEfficiencyKpi-legend.png] alt: Legend readout for Grace Sullivan: 115%, Aug 2026, avg 104%

## 07_TechUtil_Before.dc.html
Before · production
7. Technician Utilization: opening the detail
Clicking Tech Utilization opens a second page: an empty chart and a 445-row table of clock punches.
Production code · after clicking Tech Utilization
Its report link reads "Shop Efficiency Report", a different report from the one the tile measures.
[image before-drill-techUtilizationKpi.png] alt: Production: a separate Tech Utilization page with an empty chart and a 445-row table of clock punches

## 07_TechUtil_After.dc.html
After · this build
7. Technician Utilization: opening the detail
View details opens the chart, one line per technician with a Technician filter, above the Technician Utilization table (S6-R6). The arrow opens the Technician Utilization report.
This build · Technician Utilization, View details open
Chart and table read the card's range, here Last 12 Months (S7-R5).
[image after-open-techUtilizationKpi.png] alt: New dashboard: Technician Utilization View details open, one line per technician above the Technician Utilization table

## 07_TechUtil_Hover.dc.html
After · this build
7. Technician Utilization: hovering the chart
Hovering the chart shows the month under the pointer with every series' value for that month. Aug 2026: Grace Sullivan 75%, Aisha Farah 83%, Terry Kelly 39%.
This build · pointer on Aug 2026
Production's chart does not render, so there is nothing to hover there.
[image after-hover-panel-techUtilizationKpi.png] alt: Technician Utilization chart with an Aug 2026 tooltip listing every technician's percentage

## 07_TechUtil_Legend.dc.html
After · this build
7. Technician Utilization: hovering a name
Hovering a name in the legend shows that person's latest month with a value and their average over the range, without hunting for their line. Nadia Petrov: 70%, Aug 2026, avg 95%.
This build · pointer on Nadia Petrov
Production's chart does not render, so there is nothing to hover there.
[image after-hover-panel-techUtilizationKpi-legend.png] alt: Legend readout for Nadia Petrov: 70%, Aug 2026, avg 95%

## 08_Customers_New.dc.html
New · no before exists
8. Sales by Customer
Production has no Sales by Customer tile, so there is no before. It is the one card added to the set of widgets that already existed (DDR).

## 08_Customers_After.dc.html
After · this build
8. Sales by Customer: opening the detail
View details opens the Sales by Customer table: Customer, Invoices, Labor Delta and Subtotal, ten rows a page (S6-R7). The arrow opens the Sales By Customer report.
This build · Sales by Customer, View details open
[image after-open-salesByCustomer.png] alt: New dashboard: Sales by Customer View details open, a table of customers with invoices, Labor Delta and Subtotal

## 09_AtRisk_Before.dc.html
Before · production
9. At Risk Customers
The At Risk table sits at the foot of the old page with its own Inactive for select. Its Last Work (Days) column is the one the DDR records nobody could explain.
Production code · the At Risk table at the foot of the page
[image before-atrisk.png] alt: Production: the At Risk Customers table with an Inactive for select and a Last Work (Days) column

## 09_AtRisk_After.dc.html
After · this build
9. At Risk Customers: opening the detail
View details opens the At Risk table under its card (S6-R8). Last Invoice Date replaces Last Work (Days). The card has no report arrow, because it has no report to open (S6-E3).
This build · At Risk, View details open
[image after-open-atRiskHero.png] alt: New dashboard: At Risk View details open, a table with Last Invoice Date in place of Last Work (Days)

## 09_AtRisk_Window.dc.html
After · this build
9. At Risk Customers: the inactivity window
The inactivity window is a pill on the card, offering 30, 60, 90, 120 and 180 days. It is the one range-like choice the dashboard remembers (S5-R14).
This build · 120 Days pill open
[image after-riskmenu.png] alt: New dashboard: the At Risk 120 Days pill open, offering 30, 60, 90, 120 and 180 days

## 10_sales_Before.dc.html
Before · production
10. Sales report
The Customer filter and the date filter, then the invoice table. No chart.
Production code · Sales · This year
[image before-report-sales.png] alt: Sales report on production: a table with no chart

## 10_sales_After.dc.html
After · this build
10. Sales report: chart shown
The same report and range with the dashboard card's chart above the details, and Hide Chart at the right end of the toolbar (S11-R2a).
This build · Sales · This year
[image after-report-sales.png] alt: Sales report in this build: the chart above the table, with Hide Chart

## 10_sales_Hidden.dc.html
After · this build
10. Sales report: chart hidden
Hide Chart puts the chart away and the control reads Show Chart. The details below are the before board's, unchanged. The choice is remembered in this browser (S6-R16).
This build · Sales · Hide Chart pressed
[image after-report-sales-hidden.png] alt: Sales report in this build with the chart hidden and a Show Chart control

## 10_sales_Hover.dc.html
After · this build
10. Sales report: hovering the chart
The report's chart hovers the same way as the dashboard's: Jul 2026, $2,030,953.
This build · pointer on Jul 2026
Production's chart does not render, so there is nothing to hover there.
[image after-hover-report-sales.png] alt: Sales report chart with a tooltip reading Jul 2026, Revenue: $2,030,953

## 11_service-advisor-analysis_Before.dc.html
Before · production
11. Service Advisor Analysis report
The date filter and the Advisor filter, then the invoice table. No chart.
Production code · Service Advisor Analysis · This year
[image before-report-service-advisor-analysis.png] alt: Service Advisor Analysis report on production: a table with no chart

## 11_service-advisor-analysis_After.dc.html
After · this build
11. Service Advisor Analysis report: chart shown
The same report and range with the dashboard card's chart above the details, and Hide Chart at the right end of the toolbar (S11-R2a).
This build · Service Advisor Analysis · This year
[image after-report-service-advisor-analysis.png] alt: Service Advisor Analysis report in this build: the chart above the table, with Hide Chart

## 11_service-advisor-analysis_Hidden.dc.html
After · this build
11. Service Advisor Analysis report: chart hidden
Hide Chart puts the chart away and the control reads Show Chart. The details below are the before board's, unchanged. The choice is remembered in this browser (S6-R16).
This build · Service Advisor Analysis · Hide Chart pressed
[image after-report-service-advisor-analysis-hidden.png] alt: Service Advisor Analysis report in this build with the chart hidden and a Show Chart control

## 11_saa_Hover.dc.html
After · this build
11. Service Advisor Analysis report: hovering the chart
Hovering the chart shows the month under the pointer with every series' value for that month. Each advisor carries that month's ELR on a second line, as on the dashboard.
This build · pointer on Jul 2026
Production's chart does not render, so there is nothing to hover there.
[image after-hover-report-service-advisor-analysis.png] alt: Service Advisor Analysis chart with a Jul 2026 tooltip listing each advisor's percentage and ELR

## 11_saa_Legend.dc.html
After · this build
11. Service Advisor Analysis report: hovering a name
Hovering a name in the legend shows that person's latest month with a value and their average over the range, without hunting for their line. Marcus Halvorsen: 120%, Aug 2026, avg 107%.
This build · pointer on Marcus Halvorsen
Production's chart does not render, so there is nothing to hover there.
[image after-hover-report-service-advisor-analysis-legend.png] alt: Legend readout for Marcus Halvorsen: 120%, Aug 2026, avg 107%

## 12_technician-efficiency_Before.dc.html
Before · production
12. Technician Efficiency report
The date filter and the Invoiced / Completed tabs, then the technician table. No chart.
Production code · Technician Efficiency · This year
[image before-report-technician-efficiency.png] alt: Technician Efficiency report on production: a table with no chart

## 12_technician-efficiency_After.dc.html
After · this build
12. Technician Efficiency report: chart shown
The same report and range with the dashboard card's chart above the details, and Hide Chart at the right end of the toolbar (S11-R2a).
This build · Technician Efficiency · This year
[image after-report-technician-efficiency.png] alt: Technician Efficiency report in this build: the chart above the table, with Hide Chart

## 12_technician-efficiency_Hidden.dc.html
After · this build
12. Technician Efficiency report: chart hidden
Hide Chart puts the chart away and the control reads Show Chart. The details below are the before board's, unchanged. The choice is remembered in this browser (S6-R16).
This build · Technician Efficiency · Hide Chart pressed
[image after-report-technician-efficiency-hidden.png] alt: Technician Efficiency report in this build with the chart hidden and a Show Chart control

## 12_te_Hover.dc.html
After · this build
12. Technician Efficiency report: hovering the chart
Hovering the chart shows the month under the pointer with every series' value for that month. Jul 2026: Grace Sullivan 146%, Aisha Farah 115%, Elena Sandoval 24%.
This build · pointer on Jul 2026
Production's chart does not render, so there is nothing to hover there.
[image after-hover-report-technician-efficiency.png] alt: Technician Efficiency report chart with a Jul 2026 tooltip listing every technician's percentage

## 12_te_Legend.dc.html
After · this build
12. Technician Efficiency report: hovering a name
Hovering a name in the legend shows that person's latest month with a value and their average over the range, without hunting for their line. Jamal Okonkwo: 131%, Aug 2026, avg 99%.
This build · pointer on Jamal Okonkwo
Production's chart does not render, so there is nothing to hover there.
[image after-hover-report-technician-efficiency-legend.png] alt: Legend readout for Jamal Okonkwo: 131%, Aug 2026, avg 99%

## 13_technician-utilization_Before.dc.html
Before · production
13. Technician Utilization report
The date, Technician and Location filters, then the technician table. No chart.
Production code · Technician Utilization · This year
[image before-report-technician-utilization.png] alt: Technician Utilization report on production: a table with no chart

## 13_technician-utilization_After.dc.html
After · this build
13. Technician Utilization report: chart shown
The same report and range with the dashboard card's chart above the details, and Hide Chart at the right end of the toolbar (S11-R2a).
This build · Technician Utilization · This year
[image after-report-technician-utilization.png] alt: Technician Utilization report in this build: the chart above the table, with Hide Chart

## 13_technician-utilization_Hidden.dc.html
After · this build
13. Technician Utilization report: chart hidden
Hide Chart puts the chart away and the control reads Show Chart. The details below are the before board's, unchanged. The choice is remembered in this browser (S6-R16).
This build · Technician Utilization · Hide Chart pressed
[image after-report-technician-utilization-hidden.png] alt: Technician Utilization report in this build with the chart hidden and a Show Chart control

## 13_tu_Hover.dc.html
After · this build
13. Technician Utilization report: hovering the chart
Hovering the chart shows the month under the pointer with every series' value for that month. Aug 2026: Grace Sullivan 75%, Aisha Farah 83%, Terry Kelly 39%.
This build · pointer on Aug 2026
Production's chart does not render, so there is nothing to hover there.
[image after-hover-report-technician-utilization.png] alt: Technician Utilization report chart with an Aug 2026 tooltip listing every technician's percentage

## 13_tu_Legend.dc.html
After · this build
13. Technician Utilization report: hovering a name
Hovering a name in the legend shows that person's latest month with a value and their average over the range, without hunting for their line. Nadia Petrov: 70%, Aug 2026, avg 95%.
This build · pointer on Nadia Petrov
Production's chart does not render, so there is nothing to hover there.
[image after-hover-report-technician-utilization-legend.png] alt: Legend readout for Nadia Petrov: 70%, Aug 2026, avg 95%

## 14_Phone_Before.dc.html
Before · production
14. On a phone
Production at 390 pixels wide: every panel stacks into one long column, the empty charts included, and the tables run off the right edge.
Production code · 390 wide · full page
[image before-phone.png] alt: Production dashboard at phone width: every panel stacked, empty charts, tables cut off at the right

## 14_Phone_After.dc.html
After · this build
14. On a phone
Six cards stacked. On a small screen a card cannot expand in place, so its footer is a View Report link instead (S6-E1, S6-E2). At Risk has no footer, because it has no report to open (S6-E3).
This build · 390 wide · full page
[image after-phone.png] alt: New dashboard at phone width: six stacked cards, each with a View Report footer except At Risk

## 15_Empty_Now.dc.html
This build · today
15. Tiles with no data
Today, in this build: the three ratio tiles have nothing to divide by and read "n/a", and draw no trend line at all (fewer than two points with a value). Revenue, Sales by Customer and At Risk have a value of zero at every point and draw a flat line along the bottom.
Drawn from this build's rules · This Month · a shop with nothing in the range
Drawn from the build's own rules rather than captured: the local test data has no shop with nothing in the range.
[image before-empty-tiles.png] alt: Six tiles with no data today: Revenue $0.00 with a flat line along the bottom, three ratio tiles reading n/a with no trend line, Sales by Customer 0 customers and At Risk 0 with a flat line

## 15_Empty_Design.dc.html
Design · approved 2026-10-07, to build
15. Tiles with no data
Branko's direction, approved by Chris: the three ratio tiles read a grey "-" (S3-E3). Every tile with nothing to plot shows a dashed outline with a line-chart icon at its center, no fill, the same height as the trend line (S4-R12 to S4-R18, S5-R16).
Approved design · same shop, same range
Real zeros stay: "$0.00", "0 customers" and "0" keep their headline, and the supporting lines do not change (S4-E2). A tile still loading shows the loading placeholder, not this one.
[image after-empty-tiles.png] alt: The same six tiles with the new empty state: a grey dash on the three ratio tiles and a dashed outline with a chart icon, no fill, in place of every trend line
