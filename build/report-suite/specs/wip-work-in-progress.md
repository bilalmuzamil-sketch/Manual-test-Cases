# WIP (Work In Progress) Report — COMPLETE spec (verbatim-structured)

> **Report Suite project — per-report spec (ingested 2026-07-22).**
> - **Project:** Report Suite (ShopView App) — ONE project, SIX reports, each with its own spec.
> - **Report:** WIP (Work In Progress) Report.
> - **Canonical spec URL (Confluence):**
>   https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/703660034/WIP+Work+In+Progress+Report
>   (Atlassian-SSO login-walled — **REFERENCE POINTER ONLY, do NOT fetch**; content below
>   was ingested from the exported `.doc` MHTML file the user provided).
> - **Spec doc metadata (from the export header):** Epic TBD · Owner Chris W. · Status = Draft — 2026-07-19 · Branch TBD · latest change-log entry 2026-07-21 (Milan review + Chris override: snapshot in scope, same-tab drill-through, All-Time removed / This-Week default). Export filename `WIPWorkInProgressReport_1.doc` (revision `_1`).
> - **PO:** **Chris Ward** (same PO as Fees & Discounts — never mix PO attributions:
>   Report Suite = Chris Ward; Global Search/Filters/Schedule = Branko; Simple Flow = Milos).
> - **Epic / Jira key:** ⚠️ **NOT AVAILABLE — ASK THE USER when VIU begins** (do NOT invent).
> - **Design / Figma:** **NOT YET AVAILABLE** — spec-only authoring; mark unpinned on-screen
>   labels/states "VIU-confirm"; design-reconciliation later if designs arrive.
> - **Specs WILL keep changing** — on every spec update run
>   `build/SPEC-RELEVANCE-RECONCILIATION-PROCESS.md` per Standing Rule 11 (always ask first).
> - **Extraction method:** the `.doc` was a Confluence "Export to Word" MHTML /
>   quoted-printable file (`Subject: Exported From Confluence`,
>   `Content-Transfer-Encoding: quoted-printable`). Decoded with Python `email` (MIME walk
>   to the `text/html` part; `get_payload(decode=True)` handles the quoted-printable) +
>   BeautifulSoup, preserving ALL headings, lists, and tables (tables → pipe tables).

---



# WIP (Work In Progress) Report

|  |  |
| --- | --- |
| Epic | TBD |
| Owner | Chris W. |
| Status | Draft — 2026-07-19 |
| Branch | TBD |

# Work In Progress — Product Specification

## 1. Business Case
Shop managers need to see, at any moment, every open job on the floor and how much money is tied up in it — the work that has been authorized but not yet invoiced. Today that number lives only inside individual work orders; there is no single screen that lists every open job with its earned-versus-remaining value.
Just as important, an owner wants to know *where* that money sits: how much has already been earned on the floor and is only waiting to be billed, versus how much is still work left to do. A single grand-total figure hides that split.
The Work In Progress report answers both. It lists every open work order — one row each — and splits each job's value into what has been **earned** (work already done) and what is still **remaining** (approved work not yet done). A summary strip across the top rolls the whole floor into a handful of headline figures, and four tabs separate jobs by how far along they are.

## 2. Feature Overview
**Core report**
- The report shows one row per open work order for the selected location(s): a service work order whose status is Estimate, Approved, In Progress, Review, or Complete.
- Each open job is placed in one of four tabs by how far along it is: **Approved - partially completed**, **Approved - not started**, **Completed**, and **Estimates**.
- Each row shows the work order number, status, customer, asset (unit number over vehicle identification number), advisor, how long the job has been open, an earned/remaining money breakdown, an optional labor-hours delta, and a pinned **Total** (earned + remaining).
- A summary strip across the top shows the whole floor as headline figures — Total Earned (the hero), Total Remaining, and a per-stage breakdown — and recomputes as the user filters.
- Each tab is a flat table with a pinned **Total** column on the far right and a Totals row at the bottom summing the jobs in that tab.
- The user can choose which columns show, filter by advisor / customer / asset / date range / location, and download the current tab as a PDF or CSV.
** Context note: "earned" means the value of approved work already performed — labor hours clocked toward the estimate, plus parts already received. "Remaining" means the value of approved work not yet performed — labor still to be worked, plus parts ordered but not yet received. A job's Total is earned + remaining; it is the report's own money figure, not the work order's stored grand total.*
**Relationship to the work order**
- The report reads live from the same work-order data the shop already maintains; it stores nothing of its own and never changes a work order.
- Every money figure is derived only from the work order's **approved** line items (lines the shop has authorized). Lines that are not yet approved contribute nothing.
**Out of scope**
- **A trend / over-time view.** This report shows the floor as it stands right now. It does not chart work-in-progress dollars over time, and there is no Trend tab in this version. (The nightly WIP snapshot that a future Trend view will read *is* captured in this version — see Story 11 — but no screen in this report displays that history yet.)
- Fees, discounts, and tax on these not-yet-invoiced jobs are not shown; the report is a labor-and-parts earned/remaining view.
- Scheduling exports to run automatically is not included.

### Known Limitations (v1)
These are deliberate v1 boundaries, documented so QA does not file them as defects:
- **No trend view.** Work-in-progress over time is not drawn in this version (see Out of scope). The nightly snapshot that would feed it *is* captured (Story 11); this version simply has no screen that reads it.
- **"Days Open" is not grammatically pluralized** — it renders "1 days" and "0 days" (Story 4).
- **Export column labels differ from the screen for two columns.** On screen the asset column header reads "Asset" and the location column reads "Location"; in the downloaded PDF/CSV the same two columns are headed "Unit" and "Branch" (Story 9, S9-E1).

## 3. Key Decisions
- **A job's Total is Earned + Remaining, not the work order's grand total.** The report's money figure is deliberately the approved-work earned/remaining sum, so it excludes tax, fees, discounts, and any non-approved lines. A Total that differs from the work order's own grand total is expected, not a data error.
- **The date range defaults to "This Week."** A fresh visit shows the open work orders created in the current week; the user can widen to any other preset or a Custom range. "All Time" is not offered (Story 7).
- **Every open job is listed, including one with nothing approved yet.** An open estimate with no approved lines still appears (in the Estimates tab), with its earned and remaining both at $0.00.
- **Jobs are separated into four tabs by progress, and there is no on-screen status filter.** The tab a job lands in is derived from its status and whether any work has started (Story 3); the four tabs take the place of a status filter.
- **The summary strip recomputes from the jobs currently visible.** Filtering by advisor, customer, or asset immediately re-rolls the headline figures and every tab's Totals row from the still-visible jobs, with no reload.
- **The advisor, customer, and asset filters work on screen only; the date range and location filters reload the report.** Narrowing to an advisor/customer/asset hides rows instantly; changing the date range or location re-fetches from the server.
- **The report remembers the user's date range, advisor / customer / asset selections, location selection, column selection, and active tab** (per browser) and restores them on return.
- **"Est." labor hours are the measuring stick on this not-yet-invoiced report.** The Inv. Hrs column compares the hours quoted on the approved work against the hours actually worked, so a manager can see whether a job is beating or overrunning its labor estimate before it is billed (Story 4).
- **The nightly WIP snapshot is in scope.** Once per day the report captures each open work order's earned and remaining value, keyed per work order per day, using the same money model as the on-screen report (Story 11). No screen reads it in this version; it is captured now so a future Trend view reads a consistent history.
** Context note: removing "All Time" and defaulting to "This Week" is a Chris product decision, not a scalability fix. Milan Zivanovic had approved keeping "All Time" on WIP — its population is bounded to currently-open work orders (not a historical scan), so "All Time" was never a scalability risk. This change is a product/UX choice.*
** Context note: the report saves its settings in the user's browser only, not on their account. Settings persist across visits and reloads in the same browser but do not follow the user to another browser or device.*

## 4. Terminology
- **Open work order** → A service work order whose status is Estimate, Approved, In Progress, Review, or Complete. Invoiced, Paid, and Declined work orders are not open and never appear.
- **Approved line / approved work** → A line item the shop has authorized (line status authorized or complete). All of the report's money comes only from approved lines.
- **Earned** → The value of approved work already performed: the portion of approved labor covered by clocked time (capped at the quoted amount per line) plus approved parts already received.
- **Remaining** → The value of approved work not yet performed: approved labor not yet earned plus approved parts ordered but not yet received.
- **Total** → For a row, Earned + Remaining. Shown as the pinned, bold headline column. (Not the work order's stored grand total.)
- **Inv. Hrs (labor-hours delta)** → Quoted labor hours minus worked (clocked) labor hours across the approved lines. Positive means the job is under its labor estimate; negative means it has overrun.
- **Days Open** → Whole days since the work order was created: elapsed time divided by 24 hours, floored (never negative).
- **Asset** → The vehicle or unit the job is for, identified by its unit number and its vehicle identification number.
- **Snapshot** → A once-daily recorded set of per-work-order earned/remaining figures for a given calendar date (Story 11), captured for a future Trend view.

## 5. Assumptions
- Approved line items carry the data needed to value them: a labor time estimate and a labor rate for labor, and a quantity and sell price for parts.
- A work order's created date is the anchor for Days Open and for the date-range filter.
- Fees, discounts, and tax are not resolved for these non-invoiced work orders and are therefore not shown on this report.

## 6. Requirements

### Story 1: Report Access and Tabs
The report is reachable from the reports navigation and opens on the first section tab, with four tabs in total.
**Design:** See Story 10 **Jira:** TBD
**Prerequisites:**
- The user must have the permission that grants access to Work In Progress reports.
** Context note: the report reuses one existing reporting permission; it does not add a new one, and the same permission covers the report and its downloads.*
**Requirements:**
- **S1-R1:** The report appears in the reports navigation under the **Performance** group, labeled "Work In Progress".
- **S1-R2:** Opening the report shows four tabs, labeled (in order) "Approved - partially completed", "Approved - not started", "Completed", and "Estimates".
- **S1-R3:** The "Approved - partially completed" tab is selected by default on load.
- **S1-R4:** Each tab's label shows the count of work orders currently in that tab, in parentheses (for example, "Completed (22)").
- **S1-R5:** The browser page title is "Work In Progress - Report | ShopView" (the separator is a plain hyphen with one space on each side).
**Negative Cases:**
- **S1-N1:** If the user does not have the required permission, the report does not appear in the navigation.

### Story 2: Work-Order Scope, Loading, and Empty State
The report lists every open work order for the selected location(s).
**Design:** See Story 10 **Jira:** TBD
**Prerequisites:**
- The report has loaded.
**Requirements:**
- **S2-R1:** A work order appears only if ALL of the following hold: it is a service work order; its status is one of Estimate, Approved, In Progress, Review, or Complete; and it belongs to a selected location (Story 7).
- **S2-R2:** Work orders whose status is Invoiced, Paid, or Declined never appear, in any tab, any Totals row, the summary strip, or any download.
- **S2-R3:** Part-sale work orders never appear.
- **S2-R4:** Each qualifying work order appears exactly once, in exactly one tab (Story 3), including a work order with nothing approved yet (its earned and remaining both show "$0.00").
- **S2-R5:** While the report is loading, the data area shows the standard reports loading indicator; existing rows are replaced only when the new data returns.
- **S2-R6:** The report reloads its rows when the user changes the date range or the location selection (Story 7).
**Negative Cases:**
- **S2-N1:** If no work order qualifies for the current date range and location(s), each tab shows the standard reports no-data message (§7) in place of rows, and no Totals row.
- **S2-N2:** If a single tab has no work orders but others do, that tab shows the no-data message while the others show their rows; the tab label count is "(0)".

### Story 3: Tab Placement (Sectioning)
Each open work order is placed in exactly one tab, derived from its status and whether work has started.
**Design:** See Story 10 **Jira:** TBD
**Prerequisites:**
- The report has loaded rows (Story 2).
**Requirements:**
- **S3-R1:** A work order whose status is Estimate is placed in the **Estimates** tab.
- **S3-R2:** A work order whose status is Complete is placed in the **Completed** tab.
- **S3-R3:** A work order whose status is In Progress or Review is placed in the **Approved - partially completed** tab.
- **S3-R4:** A work order whose status is Approved is placed in the **Approved - partially completed** tab when any labor time has been clocked or any part has been received against it, and in the **Approved - not started** tab otherwise.
** Context note: "work has started" means a technician has clocked time to the job or a part has been received for it. An approved job with neither is treated as not started.*

### Story 4: Columns and Calculations
Each row shows the work order's identity, its aging, and its earned/remaining money breakdown, in a fixed column order.
**Design:** See Story 10 **Jira:** TBD
**Prerequisites:**
- The report has loaded rows (Story 2).
**Requirements:**
- **S4-R1:** The columns, in left-to-right order, are: WO #, Status, Customer, Asset, VIN, Location, Advisor, Days Open, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Earned, Remaining, Inv. Hrs, Total.
- **S4-R2:** On first visit, the visible columns are: WO #, Status, Customer, Asset, Advisor, Days Open, Earned, Remaining, and Total.
- **S4-R3:** Every other column (VIN, Location, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Inv. Hrs) is available in the column selector and off by default (Story 8).
- **S4-R4:** WO #, Status, Customer, Asset, VIN, Location, and Advisor are left-aligned; every other column is right-aligned.
- **S4-R5:** WO # is shown as a link that opens the work order in the same browser tab; the user returns via the browser's back navigation.
- **S4-R6:** Status is shown as a badge using the status's label ("Estimate", "Approved", "In Progress", "Review", "Complete"), color-coded per the application's standard status colors; the label text is always present, so color is never the sole signal.
- **S4-R7:** The **Asset** column is a two-line cell: the unit number on the first line in bold, and the vehicle identification number on the second line in a smaller, muted style.
- **S4-R8:** When a work order has no unit number, the Asset cell's first line shows "(no unit #)"; when it has no vehicle identification number, the second line shows "— no VIN —".
- **S4-R9:** The Asset column sorts by unit number.
- **S4-R10:** The **VIN** column (off by default) shows the vehicle identification number on its own line as a separate, sortable column.
- **S4-R11:** Customer shows the customer's company name; it is blank when no customer name exists.
- **S4-R12:** Days Open shows the whole number of days since the work order was created — elapsed time divided by 24 hours, floored, never negative — rendered as "X days". The value is not grammatically pluralized: a same-day work order shows "0 days" and a one-day-old work order shows "1 days".
- **S4-R13:** Last Activity shows how recently the work order was last touched: "Today" when the most recent activity was today, otherwise "Xd ago"; it shows "—" when the work order has no recorded activity.
- **S4-R14:** Money columns (Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Earned, Remaining, Total) show US-dollar currency with a leading "$", two decimal places, and thousands separators; a negative value shows a leading minus before the "$" (for example "$1,234.56" and "-$1,234.56"); a genuine zero shows "$0.00".
- **S4-R15:** **Labor Earned** is the value of approved labor already performed: for each approved line, the share of its quoted labor value covered by the time clocked to it (never more than the full quoted value), summed across the work order's approved lines.
- **S4-R16:** **Labor Remaining** is the approved labor value not yet earned: the total quoted value of the approved labor minus Labor Earned.
- **S4-R17:** **Parts Earned** is the sell value of approved-line parts already received.
- **S4-R18:** **Parts Remaining** is the sell value of approved-line parts ordered but not yet received (the outstanding quantity valued at its sell price including any core charge).
- **S4-R19:** **Earned** is Labor Earned plus Parts Earned.
- **S4-R20:** **Remaining** is Labor Remaining plus Parts Remaining.
- **S4-R21:** **Total** is Earned plus Remaining. It is NOT the work order's stored grand total, and it is NOT the sum of any other displayed subtotal beyond Earned + Remaining.
- **S4-R22:** The **Total** column is pinned to the far right of the row, shown in bold, and stays fixed to the right edge while the user scrolls the row sideways.
- **S4-R23:** **Inv. Hrs** shows the quoted labor hours minus the worked (clocked) labor hours across the approved lines, as a signed number with one decimal place ("+2.0", "-14.0", "0.0"). A zero value shows unsigned as "0.0" (never "+0.0" or blank).
- **S4-R24:** On screen, Inv. Hrs is colored: green when positive, red when negative, and the default text color at exactly 0.0.
- **S4-R25:** The initial sort is Days Open, longest-open first (descending).
- **S4-R26:** The user can re-sort by selecting any column header. The first click on a header sorts ascending; clicking the same header again toggles to descending; there is no third "cleared" state, and only one column sorts at a time.
- **S4-R27:** Money and numeric columns sort by their underlying value; Days Open by its day count; Status by its displayed label; WO #, Customer, Asset, VIN, Location, and Advisor as text.
- **S4-R28:** Sorting reorders the rows within the active tab only; the Totals row stays at the bottom.
**Edge Cases:**
- **S4-E1:** In the Estimates tab, an open estimate with no approved work shows "$0.00" for every money column, including Total.
- **S4-E2:** A row where the job has overrun its labor estimate shows a negative Inv. Hrs (for example "-14.0") in red; a job under its estimate shows a positive value in green.
** Context note: the WO # link opens in the same browser tab and the user returns via the browser's back navigation — the suite convention shared with Sales By Customer and Sales By Rep. (This report previously opened the work order in a new tab.)*
** Context note: "Days Open" on screen is computed live and advances as time passes; in a downloaded file it is frozen at the moment the file was generated (Story 9), so a file can show a day count one higher than the screen it was generated from.*

### Story 5: Summary Strip
A strip across the top shows the whole floor as headline figures, and recomputes as the user filters.
**Design:** See Story 10 **Jira:** TBD
**Prerequisites:**
- The report has loaded rows (Story 2).
** Context note: throughout this story, "visible jobs" means the work orders that pass the current advisor, customer, and asset filters (Story 7) — not the rows scrolled into view, and across all four tabs together.*
**Requirements:**
- **S5-R1:** The summary strip shows seven figures, in this order: **Total Earned**, **Total Remaining**, **Not Started**, **Started — Earned**, **Started — Remaining**, **Ready to Invoice**, and **Estimates**.
- **S5-R2:** **Total Earned** is the report's hero figure, shown larger and with a colored underline. It equals Started — Earned plus Ready to Invoice.
- **S5-R3:** **Total Remaining** equals Not Started plus Started — Remaining.
- **S5-R4:** **Not Started** is the total approved value (earned + remaining) of the jobs in the "Approved - not started" tab.
- **S5-R5:** **Started — Earned** is the total Earned of the jobs in the "Approved - partially completed" tab.
- **S5-R6:** **Started — Remaining** is the total Remaining of the jobs in the "Approved - partially completed" tab.
- **S5-R7:** **Ready to Invoice** is the total Earned of the jobs in the "Completed" tab.
- **S5-R8:** **Estimates** is the total quoted value of the jobs in the "Estimates" tab, and is shown in a muted style.
- **S5-R9:** The Estimates figure is excluded from Total Earned and from Total Remaining.
- **S5-R10:** Every figure shows US-dollar currency with a leading "$", two decimals, and thousands separators.
- **S5-R11:** When the user changes the advisor, customer, or asset filter, every summary figure recomputes immediately from the visible jobs, with no reload.
- **S5-R12:** Each figure shows a small information icon; hovering, focusing, or tapping it reveals its explanation, in plain language, verbatim as follows:
  - Total Earned — "Work you have already done but have not billed yet — the money waiting to be collected."
  - Total Remaining — "Approved work you still have to do — the money that comes in once it is finished."
  - Not Started — "Approved jobs nobody has started yet. The full amount is still ahead."
  - Started — Earned — "Jobs in progress: the work already done but not billed yet."
  - Started — Remaining — "Jobs in progress: the work still left to finish."
  - Ready to Invoice — "Finished jobs, ready to bill the customer."
  - Estimates — "Quotes the customer has not approved yet — not counted in the totals."
** Context note: "Started — Earned" and "Started — Remaining" describe approved jobs that are underway (the "Approved - partially completed" tab). "Started" is used, rather than "In Progress", so the figures are not confused with the "In Progress" work-order status badge.*

### Story 6: Per-Tab Totals Row
Each tab has a Totals row that sums the visible jobs in that tab.
**Design:** See Story 10 **Jira:** TBD
**Prerequisites:**
- The tab has at least one visible job (Story 2).
**Requirements:**
- **S6-R1:** Each tab's table has a Totals row pinned to the bottom, labeled "Totals" in its leftmost cell.
- **S6-R2:** The Totals row sums each visible money column (Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Earned, Remaining, Total) across the tab's visible jobs.
- **S6-R3:** When the Inv. Hrs column is shown, the Totals row shows the sum of the visible jobs' Inv. Hrs, in the same signed one-decimal format and the same green/red/default coloring as a row.
- **S6-R4:** The Totals row's Total cell is pinned far right and shown in bold, matching the column.
- **S6-R5:** The Totals row uses the same number formats as the data rows.
- **S6-R6:** The Totals row recomputes whenever the advisor, customer, or asset filter changes (Story 5).
**Negative Cases:**
- **S6-N1:** If a tab has no visible jobs, it shows no Totals row.

### Story 7: Filters
The report can be filtered by advisor, customer, asset, date range, and location.
**Design:** See Story 10 **Jira:** TBD
**Prerequisites:**
- The report has loaded.
**Requirements:**
- **S7-R1:** The toolbar has an **Advisor** filter, a multi-select listing the advisors present in the loaded jobs. Selecting one or more advisors narrows the visible jobs to those advisors, on screen only (no reload).
- **S7-R2:** The toolbar has a **Customer** filter, a searchable type-ahead multi-select listing the customers present in the loaded jobs. The user types to narrow the list and selects one or more customers; narrowing is on screen only (no reload).
- **S7-R3:** When no customer is selected, the Customer filter reads "All customers" and every job is shown; the filter offers a single "Clear" action that returns it to "All customers", shown only once at least one customer is selected.
- **S7-R4:** The toolbar has an **Asset** filter, a searchable type-ahead multi-select listing the assets present in the loaded jobs. Each option shows the unit number and the vehicle identification number, and the user's typed text matches against EITHER the unit number OR the vehicle identification number. Selecting one or more assets narrows the visible jobs on screen only (no reload).
- **S7-R5:** When no asset is selected, the Asset filter reads "All assets" and every job is shown; the filter offers a single "Clear" action that returns it to "All assets", shown only once at least one asset is selected.
- **S7-R6:** The toolbar has a **date-range** control offering the standard presets — "Today", "Yesterday", "This Week", "Last Week", "This Month", "Last Month", "This Year", "Last Year", "This Quarter", "Last Quarter", and "Custom". It defaults to **"This Week"**. "All Time" is not offered.
- **S7-R7:** Each preset (or Custom) filters the report to work orders whose **created date** falls within the selected range; changing the range reloads the report.
- **S7-R8:** A Custom range is capped at a 366-day maximum span (start to end).
- **S7-R9:** The toolbar has a **Location** filter (rightmost), a multi-select listing the locations the signed-in user can access, with an "All locations" / "Clear all" toggle. On a first visit it defaults to the user's currently active location.
- **S7-R10:** Selecting one, several, or all locations reloads the report scoped to that set.
- **S7-R11:** The location scope is always constrained to the locations the user can access; a location the user cannot access is never included, and if the selection resolves to none, the report falls back to the user's currently active location.
- **S7-R12:** The advisor, customer, and asset filters combine: a job must pass all three to remain visible, and each also feeds the summary strip and each tab's Totals row (Story 5, Story 6).
** Context note: the advisor, customer, and asset filters only change what is shown on screen and never reload the report; the date-range and location filters reload it. The date range narrows by the work order's created date — it is not a way to see what work-in-progress was on a past date.*
** Context note: removing "All Time" and defaulting to "This Week" is a Chris product decision, not a scalability fix. Milan Zivanovic had approved keeping "All Time" on WIP — its population is bounded to currently-open work orders (not a historical scan), so "All Time" was never a scalability risk. This change is a product/UX choice.*
**Negative Cases:**
- **S7-N1:** If the combination of advisor, customer, and asset filters leaves no visible jobs, every tab shows the no-data message (§7) and no Totals row.

### Story 8: Column Selection and Persistence
The user can choose which columns show, and the report remembers its setup.
**Design:** See Story 10 **Jira:** TBD
**Prerequisites:**
- The report has loaded.
**Requirements:**
- **S8-R1:** A column-selection control — an icon button whose tooltip reads "Column Selection" — lets the user toggle each column on or off.
- **S8-R2:** The **Total** column is always shown and cannot be turned off; it is not offered in the control.
- **S8-R3:** On first visit, the visible columns are those listed in S4-R2.
- **S8-R4:** Every other column listed in S4-R3 is available in the control and off by default.
- **S8-R5:** Whatever columns are shown, they appear in the fixed left-to-right order of S4-R1 (toggling visibility never reorders columns), with Total always last.
- **S8-R6:** The column selection applies to every tab at once — the four tabs always show the same set of columns.
- **S8-R7:** The report remembers, in the user's browser, the date range, advisor selection, customer selection, asset selection, location selection, column selection, and active tab, and restores them on the user's next visit.
- **S8-R8:** Restore is defensive: a saved value that is no longer valid falls back to that setting's default rather than breaking the view.
** Context note: persistence is per-browser (not tied to the user's account).*

### Story 9: Export to PDF and CSV
The user can download the current tab as a PDF or CSV.
**Design:** See Story 10 **Jira:** TBD
**Prerequisites:**
- The report has loaded rows (Story 2).
**Requirements:**
- **S9-R1:** The toolbar has a menu, opened from a three-dot button, holding the download options "Download (PDF)" and "Download (CSV)".
- **S9-R2:** Both downloads include only the columns currently shown, in the same left-to-right order as the screen, with Total last.
- **S9-R3:** Both downloads honor the current date range and location filter, and include only the jobs left visible by the advisor, customer, and asset filters.
- **S9-R4:** Both downloads include a Totals row matching the on-screen Totals row for the tab.
- **S9-R5:** Money values use the same "$1,234.56" / "-$1,234.56" format as on screen; Inv. Hrs uses the same signed one-decimal format.
- **S9-R6:** In the CSV, a money value containing a comma (a thousands separator) is enclosed in double-quotes per standard CSV rules; a value without a comma is written unquoted.
- **S9-R7:** In both downloads, the Inv. Hrs column is monochrome — the green/red coloring is applied on screen and in the PDF only, never in the CSV.
- **S9-R8:** In a download, Days Open is the whole number of days as of the moment the file is generated.
- **S9-R9:** The downloaded files are named "wip-2-report.pdf" and "wip-2-report.csv".
- **S9-R10:** The PDF shows the shop logo at the top when one is set; the CSV never includes a logo.
**Edge Cases:**
- **S9-E1:** In a download, the asset column is headed "Unit" and the location column is headed "Branch" (they read "Asset" and "Location" on screen). This label difference is a known v1 limitation, not a defect.
**Error Handling:**
- **S9-R11:** On a successful download the user sees a success notification with the caption "Data exported successfully."
- **S9-R12:** If a download yields no rows, the user sees a warning notification titled "Empty export" with the caption "Export didn't yield any results".
- **S9-R13:** If a download fails, the user sees an error notification: "An error occurred while exporting the report. Please try again."

### Story 10: Visual Conformance and Accessibility
The report conforms to the application's standard all-white reporting theme and layout, and meets the accessibility requirements below.
**Design:** TBD **Jira:** TBD
**Prerequisites:**
- The report has loaded.
**Requirements — visual:**
- **S10-R1:** Each tab uses an all-white table: white column headers and white data cells, with no alternating row shading.
- **S10-R2:** The summary strip is shown as a bold band delineated by a top and bottom rule, above the tabs — not as separate cards.
- **S10-R3:** The Total column header is bold and pinned to the far right, matching its cells.
- **S10-R4:** The Totals row stays visible at the bottom while the user scrolls the rows.
- **S10-R5:** The report fills the available height and only the active tab's table body scrolls; the page itself does not add a second scrollbar.
**Requirements — accessibility:**
- **S10-R6:** The WO # link is keyboard-focusable with a visible focus indicator and opens the work order on activation.
- **S10-R7:** Each summary figure's information icon (S5-R12) is reachable by keyboard focus and exposes its explanation to assistive technology, not by hover alone.
- **S10-R8:** The status badge's meaning is carried by its text label, not by color alone (S4-R6).
- **S10-R9:** The report supports dark mode; the table, the summary strip, the WO # link, the Inv. Hrs coloring, and the two-line asset cell all use dark-mode-legible colors meeting contrast.

### Story 11: Nightly WIP Snapshot Capture
Once per day the report captures every open work order's earned/remaining value, so a future Trend view can read a consistent history. This version captures the snapshot; no screen in this version displays it.
**Design:** TBD **Jira:** TBD
**Prerequisites:**
- None (this is a backend capture behavior; it runs without a signed-in user).
**Requirements:**
- **S11-R1:** Once per day the system records one row per then-open work order — one row per work order per calendar date.
- **S11-R2:** Each snapshot row captures, at minimum: the work order, its status, its Earned value, its Remaining value, the location and organization (copied from the work order), and the snapshot's calendar date.
- **S11-R3:** The Earned and Remaining values are captured using the identical computation as the on-screen report — Earned per S4-R19, Remaining per S4-R20 — so the snapshot and the on-screen report can never diverge for a given work order on the capture date.
- **S11-R4:** The set of work orders captured uses the same service-type and open-status conditions as the report (the first two conditions of S2-R1, evaluated per location), with no user-selected-location filter — the capture spans every location.
- **S11-R5:** Captured dollar values are stored to the cent.
- **S11-R6:** A work order with nothing approved yet is captured with Earned "$0.00" and Remaining "$0.00" (it is not skipped), matching S4-E1.
- **S11-R7:** No screen in this version reads the snapshot; there is no Trend tab (§2, Out of scope).
** Context note: the snapshot's money model is earned/remaining per work order per day — the same split the on-screen report shows (Story 4) — recorded so a future Trend view reads a money model consistent with this report. The capture is in scope for this version; the Trend view that would read it is not.*

## 7. User Feedback Summary

| Trigger | Message | Behavior |
| --- | --- | --- |
| No work order qualifies for the current filters (or the advisor/customer/asset filters leave none visible) | "Empty bays, endless possibilities. Get Going!" | The application's standard reports no-data label, shown in the data area of each affected tab; that tab's Totals row is hidden. |
| A download succeeds | Caption: "Data exported successfully." | Success notification. |
| A download yields no rows | Title: "Empty export"; caption: "Export didn't yield any results" | Warning notification. |
| A download fails | "An error occurred while exporting the report. Please try again." | Error notification. |

## 8. Change Log

| Date | Reporter | Change | Notes |
| --- | --- | --- | --- |
| 2026-07-19 | @chris / @claude | Initial specification — authored from the built "Work In Progress" report (the earned-vs-remaining rebuild that supersedes the original WIP report), code-verified against the front-end and back-end. Captures the four progress tabs, the seven-figure summary strip, the earned/remaining/Total money model (Total = Earned + Remaining, not the grand total), the two-line Asset cell, the type-ahead Customer/Asset filters (empty = "All"), the Inv. Hrs labor-hours delta, and the export behavior. Trend/over-time view recorded as out of scope (nightly capture runs but has no reader in this version). | Supersedes the original WIP report specification on this page. |
| 2026-07-19 | @chris / @claude | Date range now defaults to "All Time" so a fresh visit shows every open work order (a bounded range still filters by created date) — S7-R6/R7/R7a, §3. Simplified all seven summary-strip tooltips to plain, non-technical language (S5-R12). Removed the export-only "Lead Tech" column (dropped S9-E2 and its Known-Limitations entry). | Code-verified; front-end + back-end updated and browser-verified (All Time load shows data, 0 console errors). |
| 2026-07-21 | @chris / @claude | Resolved Milan Zivanovic's review plus one Chris override. (1) Nightly WIP snapshot capture moved IN SCOPE with a locked schema — earned/remaining per work order per day, using the same money model as the on-screen report so a future Trend view reads consistent data (new Story 11); removed the "out of scope / runs in the background / no reader" framing from §2 (Out of scope, Known Limitations). (2) WO # drill-through now opens in the SAME browser tab with browser back-navigation, matching Sales By Customer and Sales By Rep (S4-R5). (3) Removed "All Time" from the date range and set the default to "This Week" (S7-R6/R7; dropped S7-R7a and reworded the §3 Key Decision + the Story 7 context note). | The "All Time" removal is a Chris product/UX decision, not a scalability fix — Milan had approved keeping All Time (its population is bounded to currently-open work orders, not a historical scan, so it was never a scalability risk). Local spec .md/.txt were also re-synced from the current Confluence four-tab design (they had held the superseded two-tab Live/Trend draft). Not yet pushed to Confluence. |

