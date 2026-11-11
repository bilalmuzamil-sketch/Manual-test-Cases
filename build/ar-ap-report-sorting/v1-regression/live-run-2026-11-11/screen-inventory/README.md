# Screen inventory — every report, before (production) and after (QA branch), 11 Nov 2026

Captured by `tools/inventory.js` (signed-in Chromium, 1440 px): for each report in the Reports menu, the column headings,
every filter chip and its open panel, the ⋯ / export menus, the first rows, totals, row links, and a full-page screenshot.

| | Before = V1 | After = V2 |
|---|---|---|
| Site | app.shopview.com (production test account) | sv11315.qa.shopview.com (QA branch of SV-11315) |
| Version marker | v26.45.3-fc08f23 | v26.45.2-6a8b89c (does not name the deployed commit; the upgrade's API is live there, measured) |
| Captured (UTC) | 11 Nov 2026, about 10:45–11:05 | 11 Nov 2026, about 10:20–10:43 |

The two sites hold DIFFERENT data (production test organization vs the QA branch's staging copy), so only structure is compared:
what a user can see and use, never amounts.

## What it shows (observed, not inferred)

**The six A/R and A/P reports: every column production has is still there after the upgrade.**

| Report | Before (production) | After (QA) |
|---|---|---|
| A/R Aging Summary | Customer, Current, 1-30, 31-60, 61-90, 91 And Over, Total; filter: Date | same columns + Location; every column sortable; filters: As of, Customer, Past due, Location |
| A/R Aging Detail | Date, Transaction Type, ID, Customer Full Name, Location Full Name, Due Date, Amount, Open Balance; filter: Date | same, "Location Full Name" now "Location" and moved second; filters: As of, Customer, Past due, Location |
| A/R Aging Collection | Date, Transaction Type, ID, Location Full Name, Due Date, Past Due, Amount, Open Balance; filters: Customer, Date | same, Location renamed and moved; filters: As of, Customer, Past due, Location |
| A/P Aging Summary | Vendor, Current, 1-30, 31-60, 61-90, 91 And Over, Total; filter: Date | same + Location; filters: As of, Vendor, Past due, Location |
| A/P Aging Detail | Date, Transaction Type, No., Vendor Name, Location Name, Due Date, Past Due, Amount, Open Balance; filter: Date | same, "Location Name" now "Location"; filters: As of, Vendor, Past due, Location |
| A/P Unpaid Invoices | same nine columns; filters: Vendor, Date | same nine; filters: As of, Vendor, Past due, Location |

The renamed date chip ("Date" → "As of") and the Location column are planned changes (PRD v11; cases V1R-73 and the existing
S6 cases). The export/print menus were not captured reliably by this script (a click timed out); they are checked by the cases.

**Other reports:** no column, filter or report was lost between the two versions, except that FOUR reports did not load on the QA
branch in this capture — **Sales, Service Advisor Analysis, Technician Efficiency and Technician Utilization** showed "Something went
wrong loading this section" with a Retry button (screenshots `qa/<report>.png`); on production all four loaded.
✅ **WITHDRAWN 11 Nov 2026 — not a product problem.** The QA lead opened Technician Utilization on the QA branch on his own
phone (11 Nov 2026, about 11:41 UTC) and it loaded fully: chart, four technicians, Summary row, the Est. Lost Labor info icon
(`qa-lead-check/`). In our headless test browser the page still fails at phone and desktop width, because the chart data request
is cancelled inside that browser (the same request answers 200 in 0.7 s by curl). So these four screens cannot be checked by our
automation browser; they are checked by a person. The original note, kept for the record:
🔴 **UNPROVEN, not a finding yet:** the QA browser was signed in by filling the app's stored user details by hand (only the
permissions were real), and these four reports may read details that were left empty. It must be re-checked in a genuine QA
browser session before anyone calls it a defect. Technician Utilization is also one of the screens the upgrade's shared code
touches (case V1R-69).

Parts Velocity and Sales By Customer loaded on both, but the script timed out reading their filters (both sites); see their screenshots.
