# Dashboard v1 — Confluence 788430850 (owner Chris Ward; last modified 2026-09-16; read 2026-09-22)

Epic: SV-490 · Owner: Chris Ward · Branch: `SV-8311-dashboard-v1` · QA Environment: https://sv8311.qa.shopview.com
Design: https://claude.ai/code/artifact/9a71339c-e477-4895-8501-ac95d6143825

## 1. Business Case
A user who can view reports still has no single screen that answers "how is the shop doing right now." Each headline number — revenue, billing efficiency, technician performance, customer health — lives on its own report page, so someone who wants all of them has to open four or five reports and re-apply filters each time. This dashboard puts those numbers on one screen, each with a small trend line and a one-click path into its full report.

## 2. Feature Overview
### Core ShopView
- The dashboard is one fixed screen, the same for every user. There is no per-user customization.
- The dashboard shows six tiles: four KPI tiles across the top (Revenue, Billing Efficiency, Technician Efficiency, Technician Utilization) and two count tiles below (Sales by Customer, At Risk Customers).
- Each tile shows a headline value and a small trend line (sparkline).
- Each tile can be expanded to reveal its full chart, its detail table, or both, without leaving the dashboard.
- Each KPI tile and the Sales by Customer tile has its own date range and a link to its full report.
- Every number the dashboard shows for a measure equals the number its matching report shows for the same workplace, date range, and filters.
- The dashboard shows data for the one workplace the user has selected in the top navigation.
- Four report pages (Sales, Service Advisor Analysis, Technician Efficiency, Technician Utilization) show the dashboard's matching chart embedded above the report table.

### Out of Scope
- Any per-user customization: choosing, adding, removing, reordering, or hiding tiles; saved layouts; an edit mode; role-based dashboard presets; or a switcher between role-specific views. None of these exist in this version.
- Separate Parts, Service Advisor, and Technician dashboards. These are future work.
- Any new report. The dashboard reuses existing reports and does not create new ones.
- A dedicated At Risk Customers report. At Risk is a dashboard-only measure with no report page.
- Every tile, measure and card that is not one of the six named in this spec. The code carries definitions left from the earlier dashboard, including further KPI measures, further chart series, and a set of card components. None of them is part of this version and none of them renders. This spec describes six tiles; anything else appearing on the dashboard is a defect, and whether the unused definitions are removed or left dormant is a technical decision outside this spec.

## 3. Key Decisions
- One fixed layout for every user. Per-user customization was removed because in the previous version it produced wrong numbers and hidden tiles.
- Access is the Reports permission, and nothing else. Any user with the Reports permission sees the dashboard and every tile on it.
- Every dashboard figure equals its matching report's figure. Stated as a testable requirement in Story 3.
- The sparkline is the tile's only comparison. A tile shows no separate change number.
- One workplace at a time. Reloads when the top-nav selection changes. No location control on the dashboard.
- ELR is shown on hover, not as its own line, on the Billing Efficiency chart.

## 4. Terminology
- KPI tile — one of the four top tiles (Revenue, Billing Efficiency, Technician Efficiency, Technician Utilization).
- Count tile — one of the two lower tiles (Sales by Customer, At Risk Customers).
- Sparkline — the small trend line drawn inside a tile.
- Worked hours (clocked hours) — the time technicians actually clocked, from their time records.
- Invoiced hours — the labor time billed on work order lines.
- Invoiced technician hours — the technician time recorded on work order lines. Used by Technician Efficiency. Different from invoiced hours.
- Work-order hours — clocked time a technician spent on a work order.
- Internal hours — clocked time not tied to a work order.
- ELR (Effective Labor Rate) — labor sales divided by worked hours, shown per advisor.
- At-risk customer — a customer who has bought before but whose most recent invoice is at least the selected number of days old (the inactivity window), and who also has either two or more lifetime invoices or some revenue in the last twelve months.
- Inactivity window — the number of days of no invoicing that defines an at-risk customer. The tile offers 30, 60, 90, 120, and 180 days.
- Embedded chart — the dashboard's chart shown on a report page, above the report's own table.
- Small screen (mobile device) — a browser viewport less than 1024 pixels wide, measured by the width of the browser window. A viewport 1024 pixels or wider is treated as a desktop screen.

## 6. Requirements

### Story 1: Dashboard Access and Entry Point — Jira SV-9573
Prerequisites: User must have the Reports permission enabled — the same permission that shows the "Reports" entry in the top navigation.
- **S1-R1:** The user sees a "Dashboard" entry in the top navigation.
- **S1-R2:** When the user selects "Dashboard", the dashboard screen opens.
- **S1-R3:** When a user who has the Reports permission logs in, the dashboard is the screen they land on.
- **S1-R4:** The dashboard shows figures for the workplace the user currently has selected in the top navigation.
- **S1-R5:** The "Dashboard" entry sits immediately to the right of the "Reports" entry.
- **S1-R6:** The "Dashboard" entry is shown only to organizations that have the Dashboard feature turned on. The two gates are named exactly: the permission is reportsPageAccess (the same permission that shows the "Reports" entry), and the organization feature is DashboardAdministrator. Both must be true. The feature name is historical and does not mean the dashboard is limited to administrators.
- **S1-R7:** The gates in S1-R6 are enforced by the server, not only by hiding the navigation entry. A request to any of the dashboard's own endpoints from a user who lacks reportsPageAccess, or whose organization lacks the DashboardAdministrator feature, is refused with an authorization failure and returns no dashboard data. Hiding the entry is a convenience for the user, never the control.
- **S1-R8:** A user who fails either gate in S1-R6 lands on Work Orders. This applies both to where they land after logging in and to entering the dashboard address directly, which redirects to Work Orders rather than showing an error page.
- **S1-N1:** If the user does not have the Reports permission, the "Dashboard" entry is not shown and the user cannot open the dashboard.
- **S1-N2:** If the user does not have the Reports permission, they do not land on the dashboard when they log in.
- **S1-N3:** If the organization does not have the Dashboard feature turned on, the "Dashboard" entry is not shown, even to a user who has the Reports permission.
- **S1-N4:** If the organization does not have the Dashboard feature turned on, that user cannot open the dashboard by any route.
- **S1-N5:** The shop logo in the top navigation is not a link, at any screen size.
- **S1-N6:** Selecting the shop logo does nothing, at any screen size.
- **S1-N7:** On a small screen the shop logo is not part of the menu button, so tapping the logo does not open the menu.
- **S1-N8:** On a small screen the menu button has its own menu icon and opens the menu when tapped.
- **S1-N9:** Selecting the shop logo sends no analytics event.
- **S1-E1:** If the user switches the selected workplace in the top navigation, the dashboard reloads its figures for the newly selected workplace.
- **S1-E2:** If no workplace is selected, the dashboard does not load data.

### Story 2: One Fixed Layout — Jira SV-9574
Prerequisites: User can access the dashboard (Story 1).
- **S2-R1:** The dashboard shows the four KPI tiles in a fixed top row, left to right: Revenue, Billing Efficiency, Technician Efficiency, Technician Utilization.
- **S2-R2:** The dashboard shows the two count tiles below the KPI row, left to right: Sales by Customer, At Risk Customers.
- **S2-R3:** The tile set and their order are the same for every user.
- **S2-R4:** Every user who can open the dashboard sees all six tiles.
- **S2-N1:** The user has no control to add a tile.
- **S2-N2:** The user has no control to remove a tile.
- **S2-N3:** The user has no control to reorder tiles.
- **S2-N4:** The user has no control to hide or show tiles.
- **S2-N5:** No saved layout carries over between sessions.

### Story 3: Measure Formulas and Report Parity — Jira SV-9575
Prerequisites: User can access the dashboard (Story 1).
- **S3-R1:** Every figure the dashboard shows for a measure equals the figure the measure's matching report shows for the same workplace, date range, and filters. This holds at every moment, not merely in principle. The dashboard may serve a figure from a cache, but only in a way that cannot produce a difference: the tile and its report must resolve to the same stored calculation, or the cache must be invalidated by the same events that change the report's answer. A tile that shows a different number from its report because one of them is more recently computed than the other is a defect, not an accepted staleness window. There is no freshness allowance and no "up to N minutes behind" in this spec.
- **S3-R2:** Each measure is calculated as defined in the table below. Revenue = Sum of invoice subtotals in the selected range, before any discount and before tax, minus credit memos, shown to the cent (matching report: Sales report). Billing Efficiency = Invoiced hours divided by worked hours, times 100, for the selected range (Service Advisor Analysis report). Technician Efficiency = Invoiced technician hours divided by clocked hours, times 100, for the selected range; each work order line's technician time is split across the technicians who worked it, in proportion to each technician's share of the clocked time on that line (Technician Efficiency report (Invoiced)). Technician Utilization = Work-order hours divided by the sum of work-order hours and internal hours, times 100, for the selected range (Technician Utilization report). Sales by Customer (count) = the count of distinct customers with sales in the selected range (Sales By Customer report). At Risk Customers (count) = the count of customers whose most recent invoice is at least the selected number of days old, and who also have either two or more lifetime invoices or some revenue in the last twelve months (matching report: None, dashboard-only). ELR (on the Billing Efficiency chart) = Labor sales divided by worked hours, per advisor (Service Advisor Analysis report).
- **S3-N1:** If a measure's report shows a value, the matching tile shows the same value; the two never disagree.
- **S3-E1:** The Revenue figure can be negative when credit memos in the range exceed sales; the dashboard shows the true negative figure rather than flooring it at zero.
- **S3-E2:** A voided invoice is excluded from every figure the dashboard shows. It contributes nothing to Revenue or to the parts-versus-labor split, nothing to invoiced hours or invoiced technician hours, and it is counted in neither the Sales by Customer count nor the At Risk Customers count, including when deciding a customer's most recent invoice. This is not a dashboard rule of its own: it is what the reports do, and the dashboard matches them (S3-R1). A void means the document was undone, so a figure that still carried its money or its hours would overstate the shop.
- **S3-E3:** Billing Efficiency, Technician Efficiency and Technician Utilization are each a ratio. When the denominator for the selected range is zero, worked hours, clocked hours, or the sum of work-order and internal hours, the measure has no value for that range. It is not zero, and the tile must not show "0.00%", because no hours recorded and a genuine zero percent are different facts. The same applies to the Revenue tile's parts-versus-labor split when revenue for the range is zero (S4-N2 already gives that tile its fallback supporting line). Inside the Technician Efficiency calculation, a work order line with invoiced technician time but no clocked time contributes no split share rather than an infinite one. The tile headline reads exactly "n/a", in lower case and without periods.

### Story 4: KPI Hero Tiles — Jira SV-9576
Prerequisites: User can access the dashboard (Story 1).
- **S4-R1:** Each KPI tile shows a label, a headline value, a sparkline, a date-range control, and a report link.
- **S4-R2:** The Revenue tile headline is the total revenue for the selected range, shown as a dollar amount to the cent.
- **S4-R3:** The Revenue tile shows a supporting line reading "Parts {parts}% · Labor {labor}%", each percent shown as a whole number.
- **S4-R4:** The Billing Efficiency tile headline is the billing efficiency percentage for the selected range, shown to two decimal places.
- **S4-R5:** The Billing Efficiency tile shows a supporting line reading "{invoiced hours} Invoiced / {clocked hours} Clocked".
- **S4-R6:** The Technician Efficiency tile headline is the technician efficiency percentage for the selected range, shown to two decimal places.
- **S4-R7:** The Technician Efficiency tile shows a supporting line reading "{invoiced tech hours} Invoiced Tech Hrs / {clocked hours} Clocked".
- **S4-R8:** The Technician Utilization tile headline is the technician utilization percentage for the selected range, shown to two decimal places.
- **S4-R9:** The Technician Utilization tile shows a supporting line reading "{work-order hours} WO Hrs / {clocked hours} Clocked".
- **S4-R10:** The sparkline shows the tile's measure trending over the selected range.
- **S4-R11:** The sparkline draws one point per bucket, and the bucket size is chosen from the length of the selected range: a range of 31 days or fewer buckets by day; 32 to 182 days by week; 183 to 731 days by month; anything longer by quarter. Each point is the measure recomputed over that bucket using the same calculation as the headline, so a point can never disagree with the tile it sits in. A bucket for which the measure has no value (S3-E3) contributes no point, and interior gaps are preserved rather than closed up or drawn as zero. The line is not drawn at all when fewer than two points have values.
- **S4-N1:** No KPI tile shows a delta indicator; the sparkline is the only comparison.
- **S4-N2:** If the Revenue tile has no parts-versus-labor split to show, its supporting line reads "{count} Invoices" instead.
- **S4-E1:** If the underlying report has an extreme value, the tile headline still shows the true figure to the report's precision.

### Story 5: Count Tiles — Sales by Customer and At Risk Customers — Jira SV-9577
Prerequisites: User can access the dashboard (Story 1).
- **S5-R1:** The Sales by Customer tile headline is the count of distinct customers with sales in the selected range.
- **S5-R2:** The Sales by Customer headline reads "{count} customer" when the count is one and "{count} customers" otherwise.
- **S5-R3:** The Sales by Customer tile shows a supporting line reading "Top: {top customer name}".
- **S5-R4:** The Sales by Customer tile has its own date-range control (Story 7).
- **S5-R5:** The Sales by Customer sparkline shows the customer count over the tile's selected date range, bucketed by S4-R11, with each point the count of distinct customers with sales in that bucket. The headline and the sparkline therefore always describe the same window (S7-R4, S7-E1).
- **S5-R6:** The Sales by Customer tile shows a report link to the Sales By Customer report.
- **S5-R7:** The At Risk Customers tile headline is the count of at-risk customers for the selected inactivity window, shown as a plain number.
- **S5-R8:** The At Risk Customers tile shows a supporting line reading "${revenue} (12mo) · {customer name}" when exactly one customer is at risk.
- **S5-R9:** The At Risk Customers tile shows a supporting line reading "${revenue} (12mo) · {count} customers" when more than one customer is at risk.
- **S5-R10:** The At Risk Customers tile has an inactivity-window control offering 30, 60, 90, 120, and 180 days.
- **S5-R11:** The inactivity-window control defaults to 120 days.
- **S5-R12:** When the user changes the inactivity window, the At Risk headline, supporting line, sparkline, and detail table all update for the new window.
- **S5-R13:** The At Risk Customers sparkline shows the at-risk count over the trailing twelve months as twelve monthly points. Each historical point is the at-risk count as of the last day of that month in the workplace's timezone, using the inactivity window the tile currently shows. The twelfth point is computed as of now, rather than as of a month end that has not happened yet, so it always equals the headline. Every point is recomputed from current data, so a later void changes the past points: recording the count as it stood at the time would contradict S3-E2, which excludes a voided invoice even when deciding a customer's most recent invoice.
- **S5-R14:** The inactivity window the user chose is remembered and applied on their next visit, in place of the 120-day default (S5-R11), under the storage rule in S6-R16.
- **S5-R15:** Two parts of the at-risk definition are fixed here so the count cannot be read two ways. "Some revenue in the last twelve months" means revenue greater than $0.00 over the trailing twelve months, measured the way the Revenue tile measures revenue: invoice subtotals before any discount and before tax, minus credit memos. A customer whose twelve-month revenue is exactly $0.00, or is negative because credits exceeded sales, does not satisfy this part of the test, though they can still qualify on the two-or-more-lifetime-invoices part. "At least the selected number of days old" is counted in whole calendar days in the selected workplace's timezone, from the date of the customer's most recent invoice to the current date. The count therefore changes at the shop's own midnight and is stable through the shop's working day, and two people viewing the same workplace from different places see the same number.
- **S5-N1:** No count tile shows a delta indicator; the sparkline is the only comparison.
- **S5-N2:** The At Risk Customers tile does not show a report link, because there is no At Risk report.
- **S5-E1:** If no customers had sales in the selected range, the Sales by Customer headline shows 0.
- **S5-E2:** If no customers are at risk in the selected window, the At Risk Customers headline shows 0.
- **S5-E3:** Sales made on an invoice with no company are counted together as a single "no company" customer in the Sales by Customer count.

### Story 6: Expanding a Tile — Jira SV-9578
Prerequisites: User can access the dashboard (Story 1).
- **S6-R1:** Each tile shows a "View details" control that expands the tile.
- **S6-R2:** Expanding a tile reveals that tile's detail content — its chart, its detail table, or both.
- **S6-R3:** The Revenue tile expands to the Revenue chart.
- **S6-R4:** The Billing Efficiency tile expands to the Billing Efficiency chart and the Advisor Analysis table.
- **S6-R5:** The Technician Efficiency tile expands to the Technician Efficiency chart and the Technician Efficiency table.
- **S6-R6:** The Technician Utilization tile expands to the Technician Utilization chart and the Technician Utilization table.
- **S6-R7:** The Sales by Customer tile expands to the Sales by Customer table.
- **S6-R8:** The At Risk Customers tile expands to the At Risk Customers table. The table is ordered by each customer's trailing-twelve-month revenue, highest first, with the customer name as the tiebreaker, so the largest amount at risk reads first. The table lists every at-risk customer. A safety cap of 500 rows applies: if a workplace ever exceeds it, the table shows the first 500 in that order and says so on screen, reading "Showing 500 of N at-risk customers", while the headline still counts every one. The table never truncates silently, because a table that stops short while the headline counts more is a defect: the two then disagree.
- **S6-R9:** At most one tile's detail is open at a time.
- **S6-R10:** When the user expands a tile while another tile's detail is open, the previously open detail closes.
- **S6-R11:** Only the "View details" control expands or collapses a tile.
- **S6-R12:** Selecting the date-range or inactivity-window control on a tile does not expand the tile.
- **S6-R13:** Selecting the report link on a tile does not expand the tile.
- **S6-R14:** A tile whose figures have not arrived shows a placeholder in place of its headline, supporting line and sparkline, and its label and controls remain readable. The dashboard never shows a blank tile and never shows a stale figure from a previous range while a new one loads.
- **S6-R15:** The tiles load independently. A tile whose data cannot be loaded shows that it could not load, and the other five tiles still render their own figures. One failed tile never blanks the dashboard, and the dashboard shows no toast or alert for it (§7).
- **S6-R16:** Every choice the dashboard remembers, the expanded tile, a chart's technician or advisor selection (S8-R6), the At Risk inactivity window (S5-R14), and the show-or-hide state of an embedded chart (S11-E1), is stored in the browser. It is therefore per browser and per device: it does not follow the user to another computer, another browser, or a private window, and it is not part of the user's account. Clearing browser data returns every one of them to its default.
- **S6-N1:** The dashboard has no "expand all" or "collapse all" control.
- **S6-N2:** The dashboard has no Panel-versus-Inline view choice.
- **S6-E1:** On a small screen (see Terminology), a tile cannot be expanded in place.
- **S6-E2:** On a small screen, in place of the "View details" control, the tile's footer is a "View Report" link that opens the tile's full report.
- **S6-E3:** On a small screen, the At Risk Customers tile shows no footer link, because it has no report to open (S10-N1); its detail table is reachable only on a desktop screen.

### Story 7: Per-Tile Date Ranges — Jira SV-9579
Prerequisites: User can access the dashboard (Story 1).
- **S7-R1:** Each KPI tile and the Sales by Customer tile has its own date-range control.
- **S7-R2:** The date-range control offers, in this order: Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week.
- **S7-R3:** When the user changes a tile's date range, that tile's headline value updates for the new range.
- **S7-R4:** When the user changes a tile's date range, that tile's sparkline redraws for the new range.
- **S7-R5:** When the user changes a tile's date range, that tile's expanded chart and table update for the new range.
- **S7-R6:** Changing one tile's date range does not change any other tile's date range.
- **S7-R7:** The four KPI tiles open on This Month. The Sales by Customer tile opens on Last 12 Months.
- **S7-R8:** A tile's date range is not carried between visits. Every visit opens each tile on its default from S7-R7, which is why date ranges are absent from the remembered list in S6-R16. This is a deliberate change from the earlier dashboard, which remembered them.
- **S7-E1:** If the selected range has not finished, the tile's headline and sparkline both describe the same partial window.

### Story 8: Chart Filters — Jira SV-9580
Prerequisites: User can access the dashboard (Story 1). The tile is expanded to show its chart (Story 6).
- **S8-R1:** The Technician Efficiency and Technician Utilization charts each have a Technician filter.
- **S8-R2:** The Technician filter lets the user select any number of technicians and defaults to all technicians selected.
- **S8-R3:** The Billing Efficiency chart has an Advisor filter.
- **S8-R4:** The Advisor filter lets the user select a single advisor, and shows all advisors when no advisor is chosen, which is the default.
- **S8-R5:** When the user changes a chart filter, the chart reloads scoped to the selected technicians or advisor.
- **S8-R6:** A tile's chart filter selection is remembered for that tile between visits.
- **S8-N1:** If the user deselects every technician on a technician chart, that chart is hidden rather than shown empty.

### Story 9: Chart Behavior — Jira SV-9581
Prerequisites: The tile is expanded to show its chart (Story 6).
- **S9-R1:** A percentage chart's value axis fits the range of the data shown.
- **S9-R2:** When one value is far above the rest — a value above 200% while the median of the values stays at or below 200% — the axis caps at 200% so the rest of the data stays readable. The median is taken over every plotted value on the chart, pooled across all of its drawn lines rather than computed per line, counting only points that have a value; where the number of points is even it is the mean of the two middle values. When the highest value on the chart is at or below 200% the axis simply fits the data and no cap applies.
- **S9-R3:** A value drawn above the axis cap is clipped at the top of the chart but still shows its true value on hover.
- **S9-R4:** The Billing Efficiency chart draws one billing-efficiency line per advisor.
- **S9-R5:** When the user hovers a point on the Billing Efficiency chart, the tooltip shows that advisor's billing efficiency percent and that advisor's ELR dollar amount.
- **S9-R6:** The Billing Efficiency chart does not draw ELR as its own line or axis.
- **S9-R7:** A chart draws only the lines its own story defines: one line per selected technician on the technician charts, and one line per advisor on the Billing Efficiency chart (S9-R4). It draws no shop-average line, no aggregate line and no other reference line behind or alongside them. Any additional drawn series is a defect.

### Story 10: Report Drill-In — Jira SV-9582
Prerequisites: User can access the dashboard (Story 1).
- **S10-R1:** Each KPI tile and the Sales by Customer tile shows a report link.
- **S10-R2:** Selecting a tile's report link opens that tile's matching report.
- **S10-R3:** The report opens with the date range the tile currently shows.
- **S10-R4:** Hovering a tile's report link shows a tooltip naming the report the link opens.
- **S10-N1:** The At Risk Customers tile shows no report link, because there is no At Risk report.

### Story 11: Chart on the Report Page — Jira SV-9583
Prerequisites: User is viewing one of the reports that has a matching embedded chart: Sales, Service Advisor Analysis, Technician Efficiency, or Technician Utilization.
- **S11-R1:** The report page shows its matching chart above the report's detail table.
- **S11-R2:** The report page shows a "Show chart" / "Hide chart" control for the chart.
- **S11-R3:** The embedded chart reflects the report's own active filters, including its date range and its technician or advisor selection.
- **S11-R4:** The embedded chart has no date-range control of its own.
- **S11-R5:** The embedded chart has no technician or advisor filter of its own.
- **S11-R6:** The embedded chart shows no report link.
- **S11-R7:** The embedded chart shows the same figures as the report it sits on.
- **S11-E1:** The user's choice to show or hide the embedded chart is remembered per report between visits.

### Story 12: Visual Conformance — Jira SV-9584
Design: See the Dashboard v1 design directions. Prerequisites: User can access the dashboard (Story 1).
- **S12-R1:** On a desktop screen (1024 pixels or wider), the four KPI tiles sit in one row and the two count tiles in a row below.
- **S12-R2:** The descriptive text on the tiles — tile labels, supporting lines, and the date-range and inactivity-window controls — is shown in a near-black color in the light theme.
- **S12-R3:** The same descriptive text is shown in a near-white color in the dark theme.
- **S12-R4:** The count tiles show their headline count in a larger size than the KPI tiles' headline.
- **S12-R5:** The dashboard renders correctly in both the light and the dark theme.
- **S12-N1:** On a small screen (a viewport less than 1024 pixels wide, see Terminology), the tiles stack in a single column.

## 7. User Feedback Summary
The dashboard is read-only. It shows no toasts, alerts, or validation messages. The only user-facing feedback is a visual state: when every technician is deselected on a technician chart, that chart is hidden until at least one technician is selected again (S8-N1).
