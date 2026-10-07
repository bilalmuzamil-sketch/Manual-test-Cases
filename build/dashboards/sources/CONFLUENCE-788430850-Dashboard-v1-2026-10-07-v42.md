<!-- Confluence 788430850 Dashboard v1 — saved 2026-10-07 from ADF; lastModified 28 minutes ago; version {} -->

Companion Video: Needs filming.

| **Epic** | SV-490 |

| **Owner** | Chris Ward |

| **Demo Branch** | https://sv8311.qa.shopview.com |

| **Design** | https://claude.ai/artifact/Wae9DFQ8PJQBy8mbLsL5ge |

# Dashboard v1

## 1. Business Case

A user who can view reports still has no single screen that answers "how is the shop doing right now." Each headline number — revenue, billing efficiency, technician performance, customer health — lives on its own report page, so someone who wants all of them has to open four or five reports and re-apply filters each time. This dashboard puts those numbers on one screen, each with a small trend line and a one-click path into its full report. The user sees the state of the shop at a glance and opens a report only when a number needs a closer look.

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

- **One fixed layout for every user.** Per-user customization was removed because in the previous version it produced wrong numbers and hidden tiles. A single fixed screen is simpler and safer.

- **Access is the Reports permission, and nothing else.** Any user with the Reports permission sees the dashboard and every tile on it. There is no separate dashboard permission and no per-tile permission — the six tiles all read report data the Reports permission already grants.

- **Every dashboard figure equals its matching report's figure.** This is the central rule of the dashboard and is stated as a testable requirement in Story 3. A dashboard number must never differ from its report.

- **The sparkline is the tile's only comparison.** The trend line carries the "up or down" signal; a tile shows no separate change number.

- **One workplace at a time.** The dashboard shows figures for the workplace selected in the top navigation and reloads when that selection changes. There is no location control on the dashboard itself.

- **ELR is shown on hover, not as its own line.** On the Billing Efficiency chart, each advisor's Effective Labor Rate appears in the hover tooltip beside the billing-efficiency percent, rather than as a second drawn line, to keep the chart readable.

## 4. Terminology

- **KPI tile** — one of the four top tiles whose headline is a dollar amount or a percentage: Revenue, Billing Efficiency, Technician Efficiency, Technician Utilization.

- **Count tile** — one of the two lower tiles whose headline is a count of customers, not a dollar or percentage: Sales by Customer, At Risk Customers.

- **Sparkline** — the small trend line drawn inside a tile.

- **Worked hours (clocked hours)** — the time technicians actually clocked, from their time records.

- **Invoiced hours** — the labor time billed on work order lines.

- **Invoiced technician hours** — the technician time recorded on work order lines. Used by Technician Efficiency. This is a different figure from invoiced hours.

- **Work-order hours** — clocked time a technician spent on a work order.

- **Internal hours** — clocked time not tied to a work order, such as internal tasks.

- **ELR (Effective Labor Rate)** — labor sales divided by worked hours, shown per advisor.

- **At-risk customer** — a customer who has bought before but whose most recent invoice is at least the selected number of days old (the inactivity window), and who also has either two or more lifetime invoices or some revenue in the last twelve months.

- **Inactivity window** — the number of days of no invoicing that defines an at-risk customer. The tile offers 30, 60, 90, 120, and 180 days.

- **Embedded chart** — the dashboard's chart shown on a report page, above the report's own table.

- **Small screen (mobile device)** — a browser viewport less than 1024 pixels wide, measured by the width of the browser window, not the physical device. This is the point below which the desktop layout no longer fits, so it covers phones in any orientation and tablets held in portrait. A viewport 1024 pixels or wider is treated as a desktop screen and shows the full layout.

** Context note: the width is re-checked live, so a tablet or a resized desktop window switches between the small-screen and desktop layouts the moment it crosses 1024 pixels. The threshold is the boundary between ShopView's tablet and desktop layout sizes.*

## 5. Assumptions

- Every KPI and count figure comes from a report or a report's calculation. If a report's calculation changes, the matching tile changes with it.

- The user is viewing a single workplace, selected in the top navigation, and the dashboard scopes every figure to that workplace.

** Context note: the At Risk Customers measure has no report counterpart. Its definition (Story 3 and Story 5) is the only place the "at risk" rule is written down for a user, so it is stated in full here rather than deferred to a report.*

## 6. Requirements

---

### Story 1: Dashboard Access and Entry Point

Defines who can reach the dashboard, where its entry point appears, that it is the landing screen, and the single workplace it is scoped to.

**Design:** https://sv8311.qa.shopview.com  **Jira:** SV-9573

**Prerequisites:**

- User must have the Reports permission enabled — the same permission that shows the "Reports" entry in the top navigation.

**Requirements:**

- **S1-R1:** The user sees a "Dashboard" entry in the top navigation.

- **S1-R2:** When the user selects "Dashboard", the dashboard screen opens.

- **S1-R3:** When a user who has the Reports permission logs in, the dashboard is the screen they land on.

- **S1-R4:** The dashboard shows figures for the workplace the user currently has selected in the top navigation.

- **S1-R5:** The "Dashboard" entry sits immediately to the right of the "Reports" entry.

- **S1-R6:** The "Dashboard" entry is shown to any user who has the **reportsPageAccess** permission, the same permission that shows the "Reports" entry. That permission is the only gate: there is no organization-level Dashboard feature and no other switch.

- **S1-R7 (enforcement is server-side):** The gate in S1-R6 is enforced by the server, not only by hiding the navigation entry. A request to any of the dashboard's own endpoints from a user who lacks **reportsPageAccess** is refused with an authorization failure and returns no dashboard data. Hiding the entry is a convenience for the user, never the control.

- **S1-R8 (where a user without access goes):** A user who lacks the permission in S1-R6 lands on Work Orders. This applies both to where they land after logging in and to entering the dashboard address directly, which redirects to Work Orders rather than showing an error page.

**Negative cases:**

- **S1-N1:** If the user does not have the Reports permission, the "Dashboard" entry is not shown and the user cannot open the dashboard.

- **S1-N2:** If the user does not have the Reports permission, they do not land on the dashboard when they log in.

- **S1-N5:** The shop logo in the top navigation is not a link, at any screen size.

- **S1-N6:** Selecting the shop logo does nothing, at any screen size.

- **S1-N7:** On a small screen the shop logo is not part of the menu button, so tapping the logo does not open the menu.

- **S1-N8:** On a small screen the menu button has its own menu icon and opens the menu when tapped.

- **S1-N9:** Selecting the shop logo sends no analytics event.

**Edge cases:**

- **S1-E1:** If the user switches the selected workplace in the top navigation, the dashboard reloads its figures for the newly selected workplace.

- **S1-E2:** If no workplace is selected, the dashboard does not load data.

** Context note: there is no separate dashboard permission. Access is the Reports permission and nothing more, so a user who can see Reports can open the dashboard. There is no second gate: no organization-level Dashboard feature and no shop-by-shop rollout switch, so on release every user who has the Reports permission sees the Dashboard entry. (@chris ruling, 2026-09-24: drop the feature flag altogether.)*

** Context note: S1-N5 to S1-N9 exist because the logo used to be the way into the dashboard, before there was a navigation entry. It is branding, not navigation, so it was made inert on purpose. Anyone who finds it unclickable and assumes it is broken should read this rather than reinstate the link.*

** Context note: on a small screen the logo used to sit inside the menu button, which made the logo itself tappable and brought the affordance back through the side door. The logo is rendered outside that button now and the button carries its own menu icon, so the two are separate things that look separate.*

---

### Story 2: One Fixed Layout

Defines the fixed set and order of tiles and establishes that the user cannot customize the layout.

**Design:** https://sv8311.qa.shopview.com  **Jira:** SV-9574

**Prerequisites:**

- User can access the dashboard (Story 1).

**Requirements:**

- **S2-R1:** The dashboard shows the four KPI tiles in a fixed top row, left to right: Revenue, Billing Efficiency, Technician Efficiency, Technician Utilization.

- **S2-R2:** The dashboard shows the two count tiles below the KPI row, left to right: Sales by Customer, At Risk Customers.

- **S2-R3:** The tile set and their order are the same for every user.

- **S2-R4:** Every user who can open the dashboard sees all six tiles.

**Negative cases:**

- **S2-N1:** The user has no control to add a tile.

- **S2-N2:** The user has no control to remove a tile.

- **S2-N3:** The user has no control to reorder tiles.

- **S2-N4:** The user has no control to hide or show tiles.

- **S2-N5:** No saved layout carries over between sessions.

---

### Story 3: Measure Formulas and Report Parity

Defines each measure's calculation and the rule that every dashboard figure must equal its matching report's figure.

**Design:** N/A (data definition)  **Jira:** SV-9575

**Prerequisites:**

- User can access the dashboard (Story 1).

**Requirements:**

- **S3-R1:** Every figure the dashboard shows for a measure equals the figure the measure's matching report shows for the same workplace, date range, and filters. **This holds at every moment, not merely in principle.** The dashboard may serve a figure from a cache, but only in a way that cannot produce a difference: the tile and its report must resolve to the same stored calculation, or the cache must be invalidated by the same events that change the report's answer. A tile that shows a different number from its report because one of them is more recently computed than the other is a defect, not an accepted staleness window. There is no freshness allowance and no "up to N minutes behind" in this spec.

- * *Context note (S3-R1): the build today caches dashboard sections for one hour while the report pages compute live, so the two can differ for up to an hour. That does not meet this rule, and the rule is what governs: the build has to change to hold the invariant, rather than the invariant being relaxed to describe the build. How it is held, whether by serving the tiles live or by having the tile and the report read one shared calculation, is an implementation choice for the technical specification. The same applies to S1-R7: the dashboard's own endpoints have to refuse a request that fails the gate in S1-R6, which the report endpoints already do and the dashboard endpoints do not yet. (@chris ruling, 2026-09-04: the dashboard must always match the report.)*

- **S3-R2:** Each measure is calculated as defined in the table below.

| Measure | Calculation | Matching report |

| Revenue | Sum of invoice subtotals in the selected range, before any discount and before tax, minus credit memos. Shown to the cent. | Sales report |

| Billing Efficiency | Invoiced hours divided by worked hours, times 100, for the selected range. | Service Advisor Analysis report |

| Technician Efficiency | Invoiced technician hours divided by clocked hours, times 100, for the selected range. Each work order line's technician time is split across the technicians who worked it, in proportion to each technician's share of the clocked time on that line. | Technician Efficiency report (Invoiced) |

| Technician Utilization | Work-order hours divided by the sum of work-order hours and internal hours, times 100, for the selected range. | Technician Utilization report |

| Sales by Customer (count) | The count of distinct customers with sales in the selected range. | Sales By Customer report |

| At Risk Customers (count) | The count of customers whose most recent invoice is at least the selected number of days old, and who also have either two or more lifetime invoices or some revenue in the last twelve months. | None (dashboard-only) |

| ELR (on the Billing Efficiency chart) | Labor sales divided by worked hours, per advisor. | Service Advisor Analysis report |

**Negative cases:**

- **S3-N1:** If a measure's report shows a value, the matching tile shows the same value; the two never disagree.

**Edge cases:**

- **S3-E1:** The Revenue figure can be negative when credit memos in the range exceed sales; the dashboard shows the true negative figure rather than flooring it at zero.

- **S3-E2:** **A voided invoice is excluded from every figure the dashboard shows.** It contributes nothing to Revenue or to the parts-versus-labor split, nothing to invoiced hours or invoiced technician hours, and it is counted in neither the Sales by Customer count nor the At Risk Customers count, including when deciding a customer's most recent invoice. This is not a dashboard rule of its own: it is what the reports do, and the dashboard matches them (S3-R1). A void means the document was undone, so a figure that still carried its money or its hours would overstate the shop.

- * *Context note (S3-E2): the newer reports exclude void invoices through one shared rule rather than each report deciding for itself. The Sales report predates that rule and does not yet use it: as of 2026-09-15 its invoice total includes voided invoices and omits invoices that carry no company. That is a defect in the Sales report rather than a dashboard decision, and it is corrected inside this project so Revenue can match it (@chris ruling, 2026-09-15). Correcting it moves the Sales report's own existing totals for any range containing voided or no-company invoices, so it ships with a release note. If that shared rule ever changes, the dashboard follows it rather than keeping its own copy. (@chris call, 2026-09-04: always match the report.)* ** Context note (S3-E2), how much this actually moves, measured on production 2026-09-16 over the last twelve months, 213,012 invoices across 650 shops: ****13 voided invoices totalling $15,883.98, across 10 shops.**** Those ten see their Sales report total drop by that amount for ranges containing them; the other 640 see no change. ****No invoice with no customer record exists, and none with no work order****, so that half of the correction changes no history and closes a gap going forward. The reach of the change was checked at the same time: ShopView has no commission calculation and no tax-filing feature, so no shop can be running either off this total from inside the product, and the Sales report has no export, no PDF and no scheduled email, so its total appears on one screen. Sales by Customer and Sales by Representative already exclude voided invoices and already include walk-in sales, so a shop paying representatives off Sales by Representative sees no change, and everything sent to the accounting service and to QuickBooks uses a different figure that already excludes voids. ****Service Advisor Analysis is a direct copy of the Sales report's invoice query and carries both flaws, so it is corrected in this project too**** (@chris ruling, 2026-09-16: the figures need to match each other and to be right, and today they are neither). That moves advisor revenue and ELR down for periods containing voided invoices and adds walk-in sales to advisor figures, under the same release note. The Sales Follow-Up report, the Customers Spending widget and the Sales Tax Report carry related gaps, are not read by any tile, and are filed as their own tickets rather than widening this project.*

- **S3-E3 (a measure with nothing to divide by):** Billing Efficiency, Technician Efficiency and Technician Utilization are each a ratio. When the denominator for the selected range is zero, worked hours, clocked hours, or the sum of work-order and internal hours, the measure **has no value for that range**. It is not zero, and the tile must not show "0.00%", because no hours recorded and a genuine zero percent are different facts. The same applies to the Revenue tile's parts-versus-labor split when revenue for the range is zero (S4-N2 already gives that tile its fallback supporting line). Inside the Technician Efficiency calculation, a work order line with invoiced technician time but no clocked time contributes no split share rather than an infinite one. **The tile headline reads exactly "-"**, a single hyphen, in grey.

- * *Context note (S3-E3): the matching report renders its own empty cell differently, as an empty number with the percent sign still shown. Bringing the report's empty state into line is deliberately outside this spec, so a difference between the tile and the report in this one case, where neither is showing a figure, is not a failure of the parity rule in S3-R1. S3-R1 governs the figures. (@chris call, 2026-09-04.)*

** Context note: At Risk Customers has no report, so parity does not apply to it; its formula in this table is the only definition of the measure.*

** Context note: to check parity on a KPI tile that shows a shop-wide figure, compare it against the matching report with all advisors or all technicians selected (no filter applied).*

---

### Story 4: KPI Hero Tiles

Defines the four KPI tiles and the label, headline, supporting line, sparkline, and controls each one shows.

**Design:** https://sv8311.qa.shopview.com  **Jira:** SV-9576

**Prerequisites:**

- User can access the dashboard (Story 1).

**Requirements:**

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

- **S4-R11 (how the sparkline divides the range):** The sparkline draws one point per bucket, and the bucket size is chosen from the length of the selected range: **a range of 31 days or fewer buckets by day; 32 to 182 days by week; 183 to 731 days by month; anything longer by quarter**. Each point is the measure recomputed over that bucket using the same calculation as the headline, so a point can never disagree with the tile it sits in. A bucket for which the measure has no value (S3-E3) contributes no point, and interior gaps are preserved rather than closed up or drawn as zero. When fewer than two points have values, no line is drawn and the tile shows the empty-chart placeholder instead (S4-R12).

- **S4-R12 (when a tile has nothing to plot):** A tile shows the empty-chart placeholder in place of its sparkline when fewer than two points in the selected range have a value.

- **S4-R13:** A tile also shows the empty-chart placeholder when every point that has a value is zero.

- **S4-R14:** The empty-chart placeholder takes the same space as the sparkline, so the tile keeps its height.

- **S4-R15:** The placeholder is an outline drawn as a light grey dashed line, with rounded corners and no fill. The tile's background shows through it.

- **S4-R16:** A line-chart icon, in grey, sits at the center of the placeholder.

- **S4-R17:** A screen reader reads the placeholder as "No data to chart".

- **S4-R18:** The placeholder changes nothing else on the tile. The headline and the supporting line show their usual values.

**Negative cases:**

- **S4-N1:** No KPI tile shows a delta indicator; the sparkline is the only comparison.

- **S4-N2:** If the Revenue tile has no parts-versus-labor split to show, its supporting line reads "{count} Invoices" instead.

**Edge cases:**

- **S4-E1:** If the underlying report has an extreme value, the tile headline still shows the true figure to the report's precision.

- **S4-E2:** A tile whose headline is a real zero, such as "$0.00" on Revenue, keeps that headline and shows the placeholder under it.

- **S4-E3:** A range where every point is zero except one shows the sparkline, because not every point is zero.

** Context note (S4-R12 to S4-E3): the empty-chart placeholder is not the loading placeholder of S6-R14. A tile still loading shows the loading placeholder. A loaded tile with nothing to plot shows the empty-chart placeholder. The full chart inside an expanded tile, and the charts on the report pages (Story 11), are unchanged. Before this rule, a ratio tile with no hours showed no trend line at all, and a tile whose every point was zero showed a flat line along its bottom edge. Design direction from Branko, approved by @chris on 2026-10-07; see the design canvas, row 15.*

---

### Story 5: Count Tiles — Sales by Customer and At Risk Customers

Defines the two count tiles and the count, supporting line, sparkline, and controls each one shows.

**Design:** https://sv8311.qa.shopview.com  **Jira:** SV-9577

**Prerequisites:**

- User can access the dashboard (Story 1).

**Requirements (Sales by Customer):**

- **S5-R1:** The Sales by Customer tile headline is the count of distinct customers with sales in the selected range.

- **S5-R2:** The Sales by Customer headline reads "{count} customer" when the count is one and "{count} customers" otherwise.

- **S5-R3:** The Sales by Customer tile shows a supporting line reading "Top: {top customer name}".

- **S5-R4:** The Sales by Customer tile has its own date-range control (Story 7).

- **S5-R5:** The Sales by Customer sparkline shows the customer count over the tile's selected date range, bucketed by S4-R11, with each point the count of distinct customers with sales in that bucket. The headline and the sparkline therefore always describe the same window (S7-R4, S7-E1).

- **S5-R6:** The Sales by Customer tile shows a report link to the Sales By Customer report.

**Requirements (At Risk Customers):**

- **S5-R7:** The At Risk Customers tile headline is the count of at-risk customers for the selected inactivity window, shown as a plain number.

- **S5-R8:** The At Risk Customers tile shows a supporting line reading "${revenue} (12mo) · {customer name}" when exactly one customer is at risk.

- **S5-R9:** The At Risk Customers tile shows a supporting line reading "${revenue} (12mo) · {count} customers" when more than one customer is at risk.

- **S5-R10:** The At Risk Customers tile has an inactivity-window control offering 30, 60, 90, 120, and 180 days.

- **S5-R11:** The inactivity-window control defaults to 120 days.

- **S5-R12:** When the user changes the inactivity window, the At Risk headline, supporting line, sparkline, and detail table all update for the new window.

- **S5-R13:** The At Risk Customers sparkline shows the at-risk count over the trailing twelve months as twelve monthly points. Each historical point is the at-risk count as of the last day of that month in the workplace's timezone, using the inactivity window the tile currently shows. The twelfth point is computed as of now, rather than as of a month end that has not happened yet, so it always equals the headline. Every point is recomputed from current data, so a later void changes the past points: recording the count as it stood at the time would contradict S3-E2, which excludes a voided invoice even when deciding a customer's most recent invoice.

- **S5-R14:** The inactivity window the user chose is remembered and applied on their next visit, in place of the 120-day default (S5-R11), under the storage rule in S6-R16.

- **S5-R15 (the two loose edges of the at-risk test):** Two parts of the at-risk definition are fixed here so the count cannot be read two ways. **"Some revenue in the last twelve months" means revenue greater than $0.00** over the trailing twelve months, measured the way the Revenue tile measures revenue: invoice subtotals before any discount and before tax, minus credit memos. A customer whose twelve-month revenue is exactly $0.00, or is negative because credits exceeded sales, does not satisfy this part of the test, though they can still qualify on the two-or-more-lifetime-invoices part. **"At least the selected number of days old" is counted in whole calendar days in the selected workplace's timezone**, from the date of the customer's most recent invoice to the current date. The count therefore changes at the shop's own midnight and is stable through the shop's working day, and two people viewing the same workplace from different places see the same number.

- **S5-R16:** The two count tiles follow S4-R12 to S4-R18, S4-E2 and S4-E3: with nothing to plot, they show the empty-chart placeholder in place of their sparkline.

**Negative cases:**

- **S5-N1:** No count tile shows a delta indicator; the sparkline is the only comparison.

- **S5-N2:** The At Risk Customers tile does not show a report link, because there is no At Risk report.

**Edge cases:**

- **S5-E1:** If no customers had sales in the selected range, the Sales by Customer headline shows 0.

- **S5-E2:** If no customers are at risk in the selected window, the At Risk Customers headline shows 0.

- **S5-E3:** Sales made on an invoice with no company are counted together as a single "no company" customer in the Sales by Customer count.

** Context note (S5-E3): no invoice without a customer record exists in production as of 2026-09-16, measured across 213,012 invoices and 650 shops. This requirement therefore describes a path that carries no data today. It is written so the behaviour is decided before the first one appears rather than discovered afterwards, and QA should expect to create the case rather than find it.*

** Context note: the Sales by Customer headline is a count, not a revenue figure, because revenue is already the Revenue tile's measure; showing revenue here would repeat it.*

** Context note: in the At Risk supporting line, "${revenue} (12mo)" is the customer's revenue over the last twelve months; for more than one customer it is the total across all at-risk customers.*

---

### Story 6: Expanding a Tile

Defines how a tile expands to its detail, what each tile reveals, and that only one tile's detail is open at a time.

**Design:** https://sv8311.qa.shopview.com  **Jira:** SV-9578

**Prerequisites:**

- User can access the dashboard (Story 1).

**Requirements:**

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

- **S6-R14 (while a tile is loading):** A tile whose figures have not arrived shows a placeholder in place of its headline, supporting line and sparkline, and its label and controls remain readable. The dashboard never shows a blank tile and never shows a stale figure from a previous range while a new one loads.

- **S6-R15 (when one tile fails):** The tiles load independently. A tile whose data cannot be loaded shows that it could not load, and the other five tiles still render their own figures. One failed tile never blanks the dashboard, and the dashboard shows no toast or alert for it (§7).

- **S6-R16 (where remembered choices live):** Every choice the dashboard remembers, the expanded tile, a chart's technician or advisor selection (S8-R6), the At Risk inactivity window (S5-R14), and the show-or-hide state of an embedded chart (S11-E1), is stored **in the browser**. It is therefore per browser and per device: it does not follow the user to another computer, another browser, or a private window, and it is not part of the user's account. Clearing browser data returns every one of them to its default.

**Negative cases:**

- **S6-N1:** The dashboard has no "expand all" or "collapse all" control.

- **S6-N2:** The dashboard has no Panel-versus-Inline view choice.

**Edge cases:**

- **S6-E1:** On a small screen (see Terminology), a tile cannot be expanded in place.

- **S6-E2:** On a small screen, in place of the "View details" control, the tile's footer is a "View Report" link that opens the tile's full report.

- **S6-E3:** On a small screen, the At Risk Customers tile shows no footer link, because it has no report to open (S10-N1); its detail table is reachable only on a desktop screen.

** Context note: an expanded tile shows a chart and a table side by side, which needs desktop width to stay readable. On a small screen there is no room for that, so the tile sends the user to the full report page instead of trying to open the detail in place.*

** Context note: a single-panel expansion was chosen over letting several details open at once, so the user reads one thing at a time and the screen stays short.*

---

### Story 7: Per-Tile Date Ranges

Defines the independent date range on each KPI tile and the Sales by Customer tile, and what updates when the range changes.

**Design:** https://sv8311.qa.shopview.com  **Jira:** SV-9579

**Prerequisites:**

- User can access the dashboard (Story 1).

**Requirements:**

- **S7-R1:** Each KPI tile and the Sales by Customer tile has its own date-range control.

- **S7-R2:** The date-range control offers, in this order: Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week.

- **S7-R3:** When the user changes a tile's date range, that tile's headline value updates for the new range.

- **S7-R4:** When the user changes a tile's date range, that tile's sparkline redraws for the new range.

- **S7-R5:** When the user changes a tile's date range, that tile's expanded chart and table update for the new range.

- **S7-R6:** Changing one tile's date range does not change any other tile's date range.

- **S7-R7 (each tile's default range):** The four KPI tiles open on **This Month**. The Sales by Customer tile opens on **Last 12 Months**.

- **S7-R8 (ranges are not remembered):** A tile's date range is not carried between visits. Every visit opens each tile on its default from S7-R7, which is why date ranges are absent from the remembered list in S6-R16. This is a deliberate change from the earlier dashboard, which remembered them.

** Context note: the At Risk Customers tile uses the inactivity-window control (Story 5) in place of a date-range control, because "at risk" is defined by days of inactivity, not by a calendar range.*

**Edge cases:**

- **S7-E1:** If the selected range has not finished, the tile's headline and sparkline both describe the same partial window.

---

### Story 8: Chart Filters

Defines the technician and advisor filters on the expanded charts and ties their behavior to the matching reports.

**Design:** https://sv8311.qa.shopview.com  **Jira:** SV-9580

**Prerequisites:**

- User can access the dashboard (Story 1).

- The tile is expanded to show its chart (Story 6).

**Requirements:**

- **S8-R1:** The Technician Efficiency and Technician Utilization charts each have a Technician filter.

- **S8-R2:** The Technician filter lets the user select any number of technicians and defaults to all technicians selected.

- **S8-R3:** The Billing Efficiency chart has an Advisor filter.

- **S8-R4:** The Advisor filter lets the user select a single advisor, and shows all advisors when no advisor is chosen, which is the default.

- **S8-R5:** When the user changes a chart filter, the chart reloads scoped to the selected technicians or advisor.

- **S8-R6:** A tile's chart filter selection is remembered for that tile between visits.

**Negative cases:**

- **S8-N1:** If the user deselects every technician on a technician chart, that chart is hidden rather than shown empty.

** Context note: the dashboard chart filters match the technician and advisor filters on the report pages, so a user sees the same lists, the same selection behavior, and the same result in both places.*

---

### Story 9: Chart Behavior

Defines how the charts scale their value axis and how ELR is surfaced on the Billing Efficiency chart.

**Design:** https://sv8311.qa.shopview.com  **Jira:** SV-9581

**Prerequisites:**

- The tile is expanded to show its chart (Story 6).

**Requirements:**

- **S9-R1:** A percentage chart's value axis fits the range of the data shown.

- **S9-R2:** When one value is far above the rest — a value above 200% while the median of the values stays at or below 200% — the axis caps at 200% so the rest of the data stays readable. **The median is taken over every plotted value on the chart, pooled across all of its drawn lines rather than computed per line**, counting only points that have a value; where the number of points is even it is the mean of the two middle values. When the highest value on the chart is at or below 200% the axis simply fits the data and no cap applies.

- **S9-R3:** A value drawn above the axis cap is clipped at the top of the chart but still shows its true value on hover.

- **S9-R4:** The Billing Efficiency chart draws one billing-efficiency line per advisor.

- **S9-R5:** When the user hovers a point on the Billing Efficiency chart, the tooltip shows that advisor's billing efficiency percent and that advisor's ELR dollar amount.

- **S9-R6:** The Billing Efficiency chart does not draw ELR as its own line or axis.

- **S9-R7:** A chart draws only the lines its own story defines: one line per selected technician on the technician charts, and one line per advisor on the Billing Efficiency chart (S9-R4). It draws no shop-average line, no aggregate line and no other reference line behind or alongside them. Any additional drawn series is a defect.

- **S9-R8:** Every chart's vertical axis starts at 0, on percentage charts and dollar charts alike. The one exception: when any drawn value in the selected range is below 0, the axis extends below 0 far enough to show that value in full. (@chris ruling, 2026-09-24.)

** Context note: the median is the middle value when the values are sorted from lowest to highest. Using the median means one very high value does not, by itself, force the axis up.*

** Context note: the axis fits the data. It only pins to 200% when a single outlier would otherwise flatten the rest of the chart; when the data as a whole is genuinely high, the axis scales up to fit it. This behavior applies wherever the chart appears — inside an expanded tile and embedded on a report page (Story 11).*

---

### Story 10: Report Drill-In

Defines the report link on the tiles and what opens when the user selects it.

**Design:** https://sv8311.qa.shopview.com  **Jira:** SV-9582

**Prerequisites:**

- User can access the dashboard (Story 1).

**Requirements:**

- **S10-R1:** Each KPI tile and the Sales by Customer tile shows a report link.

- **S10-R2:** Selecting a tile's report link opens that tile's matching report.

- **S10-R3:** The report opens with the date range the tile currently shows.

- **S10-R4:** Hovering a tile's report link shows a tooltip naming the report the link opens.

- **S10-R5:** When the tile's date range is a preset the report also offers, the report's date-range control opens with that preset selected. It does not show "Custom". Example: a Revenue tile on This Month opens the Sales report with "This month" selected.

- **S10-R6:** A report opened on a preset covers exactly the dates the tile showed (S10-R3). Selecting the preset never moves the window.

- **S10-R7:** The Sales, Service Advisor Analysis and Technician Efficiency reports offer "Last 12 months" in their date-range control, after "Last year" and before "Custom". The option is there whether or not the report was opened from the dashboard.

- **S10-R8:** "Last 12 months" covers the same window on every tile and in every report the dashboard links to: from the first day of the month eleven months before the current month, through today, in the workplace's timezone. Example: on October 5, 2026 it covers November 1, 2025 to October 5, 2026.

**Negative cases:**

- **S10-N1:** The At Risk Customers tile shows no report link, because there is no At Risk report.

**Edge cases:**

- **S10-E1:** If a report does not offer the tile's preset, the report opens with the same dates and its date-range control shows "Custom".

** Context note (S10-R5 to S10-R8): the dates always carried over correctly, but every report opened on "Custom", which reads as if the range had changed. QA raised it on 2026-10-05, and @chris ruled the same day that the report shows the matching preset and that the three older reports gain "Last 12 months", so every tile preset has a match in its report. Sales By Customer and Technician Utilization already offer it.*

** Context note (S10-R8): some other ShopView screens use a different "last 12 months", running from the same calendar day one year ago. The dashboard and the reports it links to do not use that window. A report that did would cover different dates from its tile and break S3-R1.*

** Context note (S10-E1): with S10-R7 in place, every tile preset exists in every linked report, so S10-E1 is reached only if a report's date list changes later.*

** Context note: the tile-to-report links are — Revenue → Sales report; Billing Efficiency → Service Advisor Analysis report; Technician Efficiency → Technician Efficiency report; Technician Utilization → Technician Utilization report; Sales by Customer → Sales By Customer report.*

---

### Story 11: Chart on the Report Page

Defines the dashboard chart embedded on each matching report page and how it takes its scope from the report.

**Design:** https://sv8311.qa.shopview.com  **Jira:** SV-9583

**Prerequisites:**

- User is viewing one of the reports that has a matching embedded chart: Sales, Service Advisor Analysis, Technician Efficiency, or Technician Utilization.

**Requirements:**

- **S11-R1:** The report page shows its matching chart above the report's detail table.

- **S11-R2:** The report page shows a "Show chart" / "Hide chart" control for the chart.

- **S11-R2a:** The control sits on the same horizontal line as the report's filters and its ⋯ (more actions) menu, immediately to the right of them, and the gap between each of those controls is the same. It never sits on a row of its own above the chart.

- **S11-R3:** The embedded chart reflects the report's own active filters, including its date range and its technician or advisor selection.

- **S11-R4:** The embedded chart has no date-range control of its own.

- **S11-R5:** The embedded chart has no technician or advisor filter of its own.

- **S11-R6:** The embedded chart shows no report link.

- **S11-R7:** The embedded chart shows the same figures as the report it sits on.

**Edge cases:**

- **S11-E1:** The user's choice to show or hide the embedded chart is remembered per report between visits.

** Context note: the report-to-chart pairings are — Sales report → the Revenue chart; Service Advisor Analysis report → the Billing Efficiency chart; Technician Efficiency report → the Technician Efficiency chart; Technician Utilization report → the Technician Utilization chart.*

---

### Story 12: Visual Conformance

Defines the dashboard's visual treatment: layout, tile styling, text legibility, and light and dark themes.

**Design:** https://sv8311.qa.shopview.com  **Jira:** SV-9584

**Prerequisites:**

- User can access the dashboard (Story 1).

**Requirements:**

- **S12-R1:** On a desktop screen (1024 pixels or wider), the four KPI tiles sit in one row and the two count tiles in a row below.

- **S12-R2:** The descriptive text on the tiles — tile labels, supporting lines, and the date-range and inactivity-window controls — is shown in a near-black color in the light theme.

- **S12-R3:** The same descriptive text is shown in a near-white color in the dark theme.

- **S12-R4:** The count tiles show their headline count in a larger size than the KPI tiles' headline.

- **S12-R5:** The dashboard renders correctly in both the light and the dark theme.

**Negative cases:**

- **S12-N1:** On a small screen (a viewport less than 1024 pixels wide, see Terminology), the tiles stack in a single column.

** Context note: the descriptive text was darkened from muted grey to a near-black (light) and near-white (dark) so the words read clearly on both themes.*

## 7. User Feedback Summary

The dashboard is read-only. It shows no toasts, alerts, or validation messages. The only user-facing feedback is a visual state: when every technician is deselected on a technician chart, that chart is hidden until at least one technician is selected again (S8-N1).

## 8. Change Log

| Date | Reporter | Change | Notes |

|  |  |  |  |
