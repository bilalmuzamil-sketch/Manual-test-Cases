# A-R A-P before release 2026-11-19

What production looked like **before** the A/R and A/P release of 19 Nov 2026, captured by following
`../PRODUCTION-PREP-FOR-MUDASSIR.md` (8 sections). The tests in run 557 compare against this after the release.

## What was used

| What | Value |
|---|---|
| Captured on | **10 Nov 2026** (17:57 to 18:10 UTC), before the release |
| Production version at the time | **v26.45.3-fc08f23** (read from the page's app-version marker at 18:15 UTC) |
| Where | `https://app.shopview.com`, the production test account |
| Signed in as | an **Admin** user ("Service Advisor No Reports" account), desktop window **1440 px** wide |
| As-of date | **10 Nov 2026** (the reports' default that day). Section 2 uses **18 Nov 2026**, the credit memo's own date |
| Locations | **Truck Hill 1** (current location, ticked alone in section 3), **Trucks Hill 2** (unticked in section 7), SANKAN, ZZAUTOTEST C614715 Empty Location |
| Customer (section 2) | **ZZAUTOTEST SV11744 Q3**, credit memo **CM1-4411**, $5.00, dated 18 Nov 2026, unused |
| Customer (section 6) | **aqeel transport 56** |
| Vendor (section 6) | **Delete Test** |
| Customer search typed (section 8) | **ZZAUTO** |

🔴 **Do not delete or use credit memo CM1-4411.** The after-release check needs it exactly as it is.

## What is in each folder

| Folder | Section of the prep file | What was found |
|---|---|---|
| `1-six-reports` | 1. The six reports, untouched | All six opened at 10 Nov 2026 with no other filter touched. Every row saved as text (`rows.txt`) plus screenshots; the three A/R prints saved as PDF. Rows: A/R Aging Summary 34, A/R Aging Detail 9 (buckets closed), A/R Aging Collection 34, A/P Aging Summary 21, A/P Aging Detail 9, A/P Unpaid Invoices 21 |
| `2-credit-memo` | 2. Credit memo | CM1-4411 sits in **"1-30 days past due"** on A/R Aging Detail as of 18 Nov 2026. ⚠️ A/R Aging Detail has **no customer filter** before the release, so "tick its customer" could not be done; every bucket was expanded instead |
| `3-files-and-links` | 3. Files and a link | Each report with only Truck Hill 1 ticked: screenshot, the ⋯ menu, every download, the page address. ⚠️ Sales By Customer has a **date range** ("This month"), not an as-of date, and its menu has four downloads (Summary / Expanded View, PDF / CSV) rather than "Download (PDF)" and "Download (CSV)" |
| `4-export-failure` | 4. Export failure | With the network off, **two** messages appeared: "Network Error" and "This report is too large to export. Narrow the date range or filters, then try again." The second is misleading |
| `5-location-switcher` | 5. Location switcher | The top-right menu offers **only one** location, Truck Hill 1, under "Change Location:" |
| `6-drill-down-links` | 6. Drill-down links | aqeel transport 56 opens `…/reports/ar-aging-collection?customerName=aqeel+transport+56&customerId=01de15df-…`; Delete Test opens `…/reports/ap-unpaid-invoices?vendorName=Delete+Test&vendorId=f9618e14-…` (full addresses in NOTES.txt) |
| `7-location-filter-memory` | 7. Does the filter remember? | **No**, on all three reports: after unticking Trucks Hill 2 and coming back through the Reports menu, the filter said "All locations" again |
| `8-sbc-filter-menus` | 8. Sales By Customer's menus | Clear selection then Select all → "Location: All locations", address `…/reports/sales-by-customer` (nothing added). Typing kept going into the Customer search box ("ZZAUTO"). At 900 px the filter row scrolls sideways and the Location chip is hidden behind an arrow |
| `scripts` | — | The exact browser scripts that made these captures, for the after-release check (see `RE-CHECK-AFTER-RELEASE.md`) |

Every folder has a `NOTES.txt` with the exact words seen on screen.

## Differences from the prep file

Recorded, not worked around:

1. **The as-of date is 10 Nov 2026**, not the prep file's example of 17 Nov. The prep file says "for example".
2. **A/R Aging Detail has no customer filter**, so the credit memo was found by expanding every bucket.
3. **Sales By Customer has a date range, not an as-of date.** It was left at "This month" (November 2026).
4. **Sales By Customer's ⋯ menu has no "Download (PDF)" or "Download (CSV)".** All four of its downloads were saved, and
   section 4 used "Download Summary (CSV)".
5. **The network was switched off in the browser only**, not on the computer. The page cannot tell the difference.
6. **The location switcher offers only Truck Hill 1** to this user, although the reports list four locations.
