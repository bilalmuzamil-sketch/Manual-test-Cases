<!-- Release-notes pages, Dashboard sections — read 2026-10-14 (~15:45 UTC) with getConfluencePage (markdown), read 100% (both pages, every feature section).
Page 931069964 "Release Notes (Combined): Dashboard, Board View & Tech View, Part Sales, Notifications, Digital Inspections" — current version 7 (2026-10-14T15:34:49Z, Chris Ward, "Board/Tech: lead locked on Invoiced or Paid; Imported opens in List only (Bilal Q6)"); Dashboard change in version 6 (2026-10-14T15:07:03Z, Chris Ward, "Dashboard: totals can change (not only drop); tile custom range up to 366 days"). Previous: v5 2026-10-09T19:02:52Z.
https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/931069964/Release+Notes+Combined+Dashboard+Board+View+Tech+View+Part+Sales+Notifications+Digital+Inspections
Page 928121200 "Release Notes Dashboard, WO Board & Tech Views FM: Part Sales Update V1 FM: Notifications Update V1" — current version 6 (2026-10-14T15:34:46Z, same message as above); Dashboard change in version 5 (2026-10-14T15:07:01Z, same message as v6 of the combined page). Previous: v4 2026-10-08T20:47:19Z.
https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/928121200/Release+Notes+Dashboard+WO+Board+Tech+Views+FM+Part+Sales+Update+V1+FM+Notifications+Update+V1
-->

# Release notes — Dashboard sections, 14 Oct 2026 (second read)

## 1 · What SOURCE-CHECK-2026-10-14 recorded (morning of 14 Oct)

SOURCE-CHECK quoted the Dashboard "Worth knowing" line of 931069964 (then version 5, 9 Oct 19:02 UTC, = 10 Oct local)
and recorded the two pages' Dashboard sections as identical:

> "Sales report totals can drop for some past dates. Voided invoices are no longer counted, and invoices with no customer
> attached are now included. The Service Advisor Analysis report changes the same way, and walk-in sales now count toward
> advisor figures. Expect questions about this."

## 2 · What changed in the Dashboard sections since then (Confluence's own version diffs, verbatim)

Both pages changed the same two Dashboard lines on 14 Oct 2026 (931069964 v5→v6 at 15:07:03 UTC; 928121200 v4→v5 at
15:07:01 UTC). The later versions (931069964 v7, 928121200 v6) change only the Board View / Tech View section.

Diff 931069964 v5→v7: https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=931069964&selectedPageVersions=5&selectedPageVersions=7
Diff 928121200 v4→v6: https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=928121200&selectedPageVersions=4&selectedPageVersions=6

```
-    - Each tile has its own date range: Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week or Last Week.
+    - Each tile has its own date range: Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week or Last Week, or any range of up to 366 days picked on the calendar.
```
```
-- **Sales report totals can drop for some past dates.** Voided invoices are no longer counted, and invoices with no customer attached are now included. The Service Advisor Analysis report changes the same way, and walk-in sales now count toward advisor figures. Expect questions about this.
+- **Sales report totals can change for some past dates.** Voided invoices are no longer counted, which lowers a total, and invoices with no customer attached are now included, which raises one. A voided invoice that was invoiced again counts only the new amount. The Service Advisor Analysis report changes the same way, and walk-in sales now count toward advisor figures. Expect questions about this.
```

Every other Dashboard line is unchanged. Not changed and worth knowing: the Dashboard "Worth knowing" lines of the
**Pre-release email** ("The Sales report no longer counts voided invoices, so some past totals will be lower.") and the
**Release day email** ("The Sales report no longer counts voided invoices, so some past totals are lower.") still say
only "lower", on both pages.

## 3 · Current Dashboard "Release notes" section (928121200 v6; the same words in 931069964 v7), verbatim

**Our latest release is live.** The new Dashboard puts revenue, billing efficiency, technician efficiency, technician utilization and your at-risk customers on one screen, and every number matches its report.

### 📊 Your whole shop on one screen

- **Six tiles, one screen.** \[Video: placeholder\]
    - Revenue, Billing Efficiency, Technician Efficiency and Technician Utilization across the top. Sales by Customer and At Risk Customers below.
    - Each tile shows a headline number and a trend line.
    - Revenue shows how much came from parts and how much from labor. The efficiency and utilization tiles show the hours behind the percentage, for example invoiced hours against clocked hours.
    - When there are no hours to divide by, a tile shows "-" instead of 0.00%.

\[Image\]

- **Numbers you can trust.**
    - Every figure on the Dashboard matches the report it comes from, for the same location, dates and filters.
    - Voided invoices are left out everywhere.
- **Dig in without leaving.** \[Video: placeholder\]
    - **View details** expands a tile to its chart, its table, or both, one tile at a time.
    - Each tile has its own date range: Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week or Last Week, or any range of up to 366 days picked on the calendar.
    - Filter the Technician Efficiency and Technician Utilization charts by technician (pick as many as you like), and the Billing Efficiency chart by advisor (pick one).
    - Hover a point on the Billing Efficiency chart to see each advisor's ELR.
    - The report link opens the full report on the same dates.

### 🚨 Spot customers before they slip away

- **At Risk Customers** counts the customers who have bought from you more than once, or in the last 12 months, but have had no invoice in the window you choose. \[Video: placeholder\]
    - Pick 30, 60, 90, 120 or 180 days. It starts at 120, and the tile remembers your choice.
    - Expanded, the list puts the biggest spenders of the last 12 months first.
- **Sales by Customer** shows how many customers bought in the period, and your top customer.

\[Image\]

### 📈 Charts on your reports

- The Sales, Service Advisor Analysis, Technician Efficiency and Technician Utilization reports show the matching chart above the table. **Show chart** and **Hide chart** turn it on and off, and each report remembers your choice.
- The Sales, Service Advisor Analysis and Technician Efficiency reports gain a **Last 12 months** date option.

Everyone with access to Reports gets the Dashboard on release, with nothing to switch on. Users without access to Reports still land on the Work Orders page.

### 👀 Worth knowing

- **The Dashboard is now the first screen after login** for anyone with access to Reports. Open it any time from **Dashboard**, to the right of Reports.
- **Sales report totals can change for some past dates.** Voided invoices are no longer counted, which lowers a total, and invoices with no customer attached are now included, which raises one. A voided invoice that was invoiced again counts only the new amount. The Service Advisor Analysis report changes the same way, and walk-in sales now count toward advisor figures. Expect questions about this.
- **One location at a time:** the Dashboard shows the location selected at the top of ShopView.
