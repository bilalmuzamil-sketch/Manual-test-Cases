# Technician Utilization Report

> **VERBATIM CAPTURE — current Confluence spec**
> - pageId: 641400833
> - Page title: Technician Utilization Report
> - Current version: v5
> - Last updated: 2026-07-29T06:45:11.442Z by Chris Ward
> - Confluence space: ~712020aa00b8d6a71f4259891982a304227c20
> - Captured: 2026-07-31 (REST storage-format -> markdown via html2text, unicode-preserving; escape-normalized to match the 2026-07-28 capture pipeline — validated 6/6 byte-identical on the prior versions)

---
|
---|---
**Epic**|  TBD
**Owner**|  Chris W.
**Status**|  In review — 2026-07-16
**Branch**|  TBD

# Technician Utilization — Product Specification

## 1. Business Case

Shop managers want to know, for each technician, how much of their clocked time is billable work-order time versus internal, non-billable time — and what that internal time costs the shop.

The Timesheet Activities report can already show this for one technician at a time. Filtering it to a single technician makes its totals row that technician's work-order and internal hours. But it cannot show every technician side by side, it never expresses the result as a utilization rate, and it never puts a dollar value on the internal time. Comparing the whole team means filtering to each technician in turn and doing the rate and cost math by hand.

The Technician Utilization report removes that manual work. It lists every technician in one view — one row each, showing total, work-order, and internal hours, the utilization rate, and the estimated lost labor — above a Summary row for the visible technicians, with a per-day breakdown available on demand.

## 2. Feature Overview

**Core report**

  * The report shows one row per technician for the selected date range and location(s).

  * Each row shows total clocked hours, work-order hours, internal hours, the utilization rate, and the Est. Lost Labor value.

  * A pinned Summary row at the bottom shows the totals for the **currently visible** technicians (which equals the shop totals when every technician is selected — see Story 3 / S5-E1).

  * Each technician row can be expanded to show a per-day breakdown.

  * The report can be **sorted** by any column (Story 2), **filtered by technician** (on-screen only, Story 5), and **scoped by location** (server-side, Story 9).

  * Each technician's Total Hours value links to the Timesheet Activities report, already filtered to that technician and date range.

  * The user can download the report as a PDF (summary or expanded) or CSV; the exports mirror the columns currently shown on screen.

  * When the current scope spans **more than one location** , the report shows a per-row **Location** column identifying each row's location; the column is hidden when a single location is in scope. Every export names the location scope in a **" Locations:"** line regardless.

  * The user can show or hide individual columns from a **column selector** ; Est. Lost Labor is one of the hideable columns (shown by default), while Technician is always shown. The column selection is remembered per browser.




_* Context note: "internal hours" means time a technician clocked to an internal, non-billable activity rather than to a work order — for example shop cleanup or a staff meeting._

**Relationship to the Timesheet Activities report**

  * The numbers in this report come from the same clock records as the Timesheet Activities report.

  * For the **same date range and the same location** , the total clocked hours in this report match the total in the Timesheet Activities report to the cent (two decimals) — subject to the closed-records and single-location scope stated in S1-R9.




_* Context note: the two reports must agree because they read the same underlying clock data. For the same range and location (closed records), a mismatch is a defect — see S1-R9 for the exact scope of the guarantee (open clocks and multi-location drill-through are deliberate scope differences, not defects)._

**Out of scope**

  * Scheduling exports to run automatically is not included.




## 3. Key Decisions

  * **The technician filter works on screen only and does not reload the report** (Story 5); the **location filter reloads the report from the server** (Story 9).

  * **The report remembers the user's selected date range, technician selection, location selection, and column selection** (per browser), and restores them when the user returns. **Sort is not remembered** — it resets to Technician A→Z on every load (S2-R15).




_* Context note: the report saves these in the user's browser only, not on the user's account. They persist across visits and page reloads in the same browser, but do not follow the user to another browser or device._

  * **Est. Lost Labor is the bold, pinned headline column when shown** (S2-R10, S2-R11) — it is the report's main takeaway — but it is now a user-hideable column (shown by default; S10-R3).

  * **Est. Lost Labor is valued per location.** Each technician's internal hours are valued at the default labor rate of the location where those hours were clocked, and the per-location amounts are summed for the technician's Est. Lost Labor (S2-R8). In the common single-location view this is simply that one location's rate × the technician's internal hours.

  * **Every displayed number is computed from the unrounded underlying values and rounded only for display, using round-half-up** (a tie rounds away from zero — 0.005 → 0.01). This covers the hours columns, Utilization %, and Est. Lost Labor, at every level (rows, day rows, and the Summary). Computing from unrounded values (rather than from the already-rounded per-row displays) is what lets the totals reconcile to the Timesheet Activities report to the cent.

  * **The report's columns are user-selectable.** A column selector lets the user show or hide individual columns; the selection is remembered per browser. Technician is always shown; Est. Lost Labor — previously always-on — is now a hideable column shown by default. Both exports mirror the columns currently shown (Story 10, S7-R10).

  * **A per-row Location column appears only when more than one location is in scope.** When the scope spans a single location the column is hidden (the scope is unambiguous); when it spans more than one, each row shows its location — a technician (or per-day) row whose hours are all at one location shows that location's name, while a row aggregating more than one location shows the literal **Multiple**. Every export additionally carries a "Locations:" line naming the scope, so a multi-location export is never ambiguous about which locations it covers.




_* Context note: a consequence is that the Summary and the per-row displays are each rounded independently from unrounded inputs, so eye-summing the displayed rows may differ from the displayed Summary by a cent. This is expected in a compute-from-unrounded report._

## 4. Terminology

  * **Internal hours** → Time a technician clocked to an internal, non-billable activity, not to a work order.

  * **Work-order hours** → Time a technician clocked directly to a work order.

  * **Total (clocked) hours** → All time a technician was clocked in for the date range.

  * **Utilization** → The share of a technician's total clocked hours that was spent on work orders.

  * **Est. Lost Labor** → Short for "Estimated Lost Labor"; the dollar value of a technician's internal hours, valued at the default labor rate of the location(s) where those hours were clocked (§3, S2-R8).

  * **Location** → A shop/workplace the user has access to. The report can be scoped to one, several, or all of them (Story 9).

  * **Location (column)** → A per-row column, shown only when the current scope spans more than one location, naming the location a row belongs to. A row whose hours are all at one location shows that location's name; a row aggregating more than one location shows the literal **Multiple**. Hidden entirely when a single location is in scope. Separately, every export carries a "Locations:" line naming the scope, reading "All locations" when every location the user has access to is selected.




## 5. Assumptions

  * Each location (workplace) may have its own configured default labor rate; a location may also have **no** default labor rate configured. A configured rate of exactly $0.00 is a _known_ rate (it values internal hours at $0.00), distinct from _no rate configured_ (S2-E2/E3).

  * Every clock record — work-order and internal alike — carries the location (workplace) at which it was clocked; that location is the source of the default labor rate used to value internal hours. Day grouping and time-zone windowing, however, use a single report-level time zone — the active workplace's (S1-R7) — not each record's own location.

  * The Timesheet Activities report rounds the same way this report does (round-half-up, two decimals) from the same clock data; the to-the-cent reconciliation (S1-R9) depends on that shared rounding.




## 6. Requirements

### Story 1: Report Access and Display

The report is reachable from the reports navigation and shows technician rows for the selected date range and location(s).

**Design:** See Story 8 **Jira:** TBD

**Prerequisites:**

  * The user must have the permission that grants access to the timesheet reports (the same permission that controls the existing Timesheet Activities report — this report adds no new permission).




**Requirements:**

  * **S1-R1:** The report appears in the reports navigation under the **Performance** group, labeled "Technician Utilization".

  * **S1-R2:** When the user opens the report, it shows one row for each technician who has clocked time in the selected date range at the selected location(s).

  * **S1-R3:** On the user's first visit (no saved settings — §3), the report defaults to the **current calendar month** (the date picker's "This Month" preset) and the user's currently active location. Because a range never extends past "now," the current-month default effectively shows the month to date.

  * **S1-R4:** The user can change the date range with the report's date-range picker (Story 9 covers the location filter). A Custom range is capped at a 366-day maximum span (start–end), matching the largest preset.

  * **S1-R5:** When the user changes the date range or the location selection, the report reloads its rows for the new range/location(s) (see S1-R10 for the loading state).

  * **S1-R6:** The report shows data for the location(s) currently selected in the location filter (Story 9), defaulting to the user's active location.

  * **S1-R7:** Every clock record is day-grouped and windowed in a **single report-level time zone — the active workplace's** — regardless of the location where each record was clocked (a record's day, the current-month default boundary, and the midnight split of a record are all evaluated in that one report-level time zone). This matches the Timesheet Activities report's single-time-zone grouping (S1-R9).

  * **S1-R8:** On later visits, the report opens with the date range, location selection, and column selection the user last used, and the technicians the user previously **deselected** stay deselected (all others, including technicians who appear for the first time, are selected — S5-R9/R10). The report restores its own saved location selection independent of the application's current global location switcher; the switcher's active location seeds the selection on a first visit (S9-R2) and serves as the defensive fallback on return when the saved location set resolves to empty (S9-R6, S9-R7).

  * **S1-R9: Reconciliation guarantee (scope).** For the **same date range and the same single location** , and counting **closed** clock records, this report's Total Hours for a technician equals the Timesheet Activities report's total for that technician to the cent. Two deliberate scope differences are **not** defects: (a) an **open** (not-yet-clocked-out) record is snapshotted at each report's own load instant, so two reports loaded at different moments can differ by the elapsed open time (S1-E1); (b) when **multiple** locations are selected here, the Total Hours drill-through opens Timesheet Activities for the active shop only and therefore reflects one location's portion, not the multi-location total (S6-R6).

  * **S1-R10: Loading state.** On the initial load and on every reload (date-range or location change), the data area shows the standard reports loading indicator; existing rows are replaced only when the new data returns. The toolbar remains interactive.




_* Context note: "current month" (S1-R3), the day grouping (Story 4), and the open-clock cutoff (S1-E1) are all measured in the active workplace's report-level time zone (S1-R7), not UTC._

**Negative Cases:**

  * **S1-N1:** If the user does not have the required permission, the report does not appear in the navigation.

  * **S1-N2:** If no technician has clocked time in the selected date range at the selected location(s), the report shows the no-data message (§7) instead of rows.




**Edge Cases:**

  * **S1-E1:** If a technician is still clocked in when the report loads, that open time is counted up to the moment the report loads — a fixed snapshot taken at load, not a value that keeps ticking on screen. This matches how the Timesheet Activities report treats an open record. (See S1-R9(a) for the reconciliation consequence.)




_* Context note: clocked time is measured only within the selected date range — a record that starts before the range or ends after it counts only the part inside the range. A record that crosses midnight is split by day (in the active workplace's report-level time zone), so each day counts only its own hours. This matches the Timesheet Activities report._

### Story 2: Columns and Calculations

Each technician row shows the hours breakdown, the utilization rate, and the Est. Lost Labor value, in a fixed column order.

**Design:** See Story 8 **Jira:** TBD

**Prerequisites:**

  * The report has loaded rows for the selected date range and location(s) (Story 1).




**Requirements:**

  * **S2-R1:** The column headers appear in this fixed left-to-right order: Technician, Total Hours, WO Hours, Internal Hours, Utilization %, Est. Lost Labor. When shown (more than one location in scope — S9-R9), the per-row **Location** column precedes them all as the leftmost column. Showing or hiding columns via the column selector (Story 10) never reorders the remaining columns.

  * **S2-R2:** Total Hours shows the technician's total clocked hours for the range.

  * **S2-R3:** WO Hours shows the technician's work-order hours for the range.

  * **S2-R4:** Internal Hours shows the technician's internal hours for the range (all of them, including hours at a location with no configured rate — see S2-E3).

  * **S2-R5:** Hours values show two decimal places, with no thousands separator (for example, "107.70"), rounded from the unrounded hours using round-half-up (§3).

  * **S2-R6:** Utilization % shows work-order hours as a percentage of total clocked hours, computed from the unrounded hours.

  * **S2-R7:** Utilization % shows one decimal place followed by a percent sign, rounded round-half-up (e.g., 66.65% → 66.7%). When total clocked hours are 0 (which cannot occur for a rendered row — S1-R2 admits only technicians with clocked time), Utilization % would be undefined and renders "—"; in practice this state is unreachable on a technician or day row.

  * **S2-R8:** Est. Lost Labor is the technician's internal hours valued at the default labor rate of the location(s) where they were clocked: for each contributing location, (that location's default labor rate × the technician's internal hours at that location); the per-location products are summed at full precision and the technician's total is rounded once (round-half-up). In a single-location view this is simply the one location's rate × the technician's internal hours.

  * **S2-R9:** Est. Lost Labor shows a dollar value with two decimal places and commas between thousands (for example, "$1,234.50").

  * **S2-R10:** When shown, the Est. Lost Labor column is pinned to the far right of the row.

  * **S2-R11:** When shown, the Est. Lost Labor column is displayed in bold.

  * **S2-R12:** When the report first loads (and after any data reload — S2-R15), the technician rows are sorted by Technician name, from A to Z, and the Technician header shows the ascending sort indicator (S8-R8).

  * **S2-R13:** All six columns (Technician, Total Hours, WO Hours, Internal Hours, Utilization %, Est. Lost Labor) are sortable by clicking the column header. Clicking a column that is not the active sort sorts it ascending; clicking the active sort column again toggles it to descending. There is no third "cleared" state — clicking only ever toggles ascending↔descending. Because Technician-ascending is the active sort on load (S2-R12), the first click on the Technician header sorts it descending (Z→A). Sorting is applied on screen to the loaded rows (no reload).

  * **S2-R14:** When two technicians have the same value in the sorted column, they are ordered by Technician name, A to Z; if two technicians share the same display name, they retain a stable order (their order does not change between renders of the same result set).

  * **S2-R15:** When the report reloads (a date-range or location change), the sort returns to Technician name, A to Z. Sort is not persisted across visits (§3).

  * **S2-R16:** Sorting reorders the technician rows only; the Summary row stays at the bottom, and each technician's expanded day rows stay under that technician in date order.

  * **S2-R17:** When sorting by Est. Lost Labor, rows whose value is "—" (no rate configured at any contributing location — S2-E3) sort to the **bottom in both ascending and descending order** , ordered among themselves by Technician name A→Z; they are never floated to the top by reversing direction. (A "$0.00" value is a number, not "—", and sorts as zero.)




**Edge Cases:**

  * **S2-E1:** If a technician has internal hours but zero work-order hours, Utilization % shows "0.0%".

  * **S2-E2:** If a technician has zero internal hours, Est. Lost Labor shows "$0.00" — regardless of whether the location has a rate configured (there is nothing to value). Likewise, internal hours valued at a location whose configured rate is exactly $0.00 contribute $0.00 (a known rate), not "—".

  * **S2-E3:** If a technician has internal hours but **none of the location(s) where those hours were clocked has a default labor rate configured** , Est. Lost Labor is unknown and shows "—" (an em-dash), not "$0.00".

  * **S2-E4: Partial valuation.** If a technician's internal hours span both rated and unrated locations, Est. Lost Labor is the sum of the valued (rated-location) portions; the internal hours at unrated locations are excluded from the dollar amount. The amount is shown as a normal "$X.XX" with **no partial-value indicator in this version** — so on such a row Est. Lost Labor values fewer hours than the Internal Hours column shows. This is a known limitation; a partial-value indicator is a possible follow-up.




_* Context note: "$0.00" (S2-E2) means "the rate is known and there is nothing to value"; "—" (S2-E3) means "the rate is unknown, so the value cannot be computed." They are different states. Work-order hours are always part of total clocked hours, so Utilization % is never more than 100%._

### Story 3: Summary Totals Row

A pinned Summary row shows the totals for the visible technicians.

**Design:** See Story 8 **Jira:** TBD

**Prerequisites:**

  * The report has loaded rows for the selected date range and location(s) (Story 1).




_* Context note: throughout this story, "visible technicians" means the technicians currently selected in the technician filter (Story 5), not the rows scrolled into view._

**Requirements:**

  * **S3-R1:** A Summary row is pinned to the bottom of the report.

  * **S3-R2:** The Summary row is labeled "Summary".

  * **S3-R3:** The Summary Total Hours, WO Hours, and Internal Hours each show the total of that column across the visible technicians, computed from unrounded hours and rounded once for display.

  * **S3-R4:** The Summary Utilization % shows the visible technicians' total work-order hours as a percentage of their total clocked hours (a weighted rate — summed WO hours ÷ summed clocked hours, from unrounded hours — not the average of the per-technician percentages).

  * **S3-R5:** The Summary Est. Lost Labor is computed the same way as a row (S2-R8) but over all visible technicians' internal hours: the sum, across the visible technicians and their contributing rated locations, of (that location's default labor rate × internal hours there), summed at full precision and rounded once. A visible technician whose Est. Lost Labor is "—" (no rate anywhere) contributes nothing to the sum; the Summary therefore understates true lost labor whenever any visible technician is "—" or partially valued (S2-E4). The Summary shows "—" only when **every** visible technician's Est. Lost Labor is "—".

  * **S3-R6:** The Summary row uses the same number formats as the technician rows.

  * **S3-R7:** The Summary row shows its values without any label prefix such as "TOTAL:" or "AVG:".




**Negative Cases:**

  * **S3-N1:** If no technician rows are visible, the Summary row is not shown.




### Story 4: Per-Day Breakdown

Each technician row can expand to show that technician's day-by-day clock totals.

**Design:** See Story 8 **Jira:** TBD

**Prerequisites:**

  * The report has loaded rows for the selected date range and location(s) (Story 1).




**Requirements:**

  * **S4-R1:** Each technician row has a control to expand and collapse it. The control carries an accessible name reflecting its next action, scoped to that technician ("Expand 's daily breakdown" when the row is collapsed, "Collapse 's daily breakdown" when it is expanded).

  * **S4-R2:** When a row is expanded, the report shows one row for each day the technician clocked time in the range, in date order from earliest to latest. The day rows **load on expand** — they are fetched on demand when the technician row is expanded, not shipped with the initial report payload; because expansion state resets (all collapsed) on any data reload (S4-R5), nothing is lost. When several locations are selected, a day's row pools that day's hours across the selected locations (one day row per date, not one per location), matching the pooling of the technician row (S9-R4).

  * **S4-R3:** Each day row shows the same columns, in the same formats, as the technician row, with that day's values (including a per-day Est. Lost Labor valued per location per S2-R8).

  * **S4-R4:** The report has a single control that expands or collapses all technician rows at once; if any row is collapsed it expands all rows, and only when every row is already expanded does it collapse all rows. The control lives in the table's header row (in the Technician column) — not in the toolbar action cluster (S8-R3) — and carries an accessible name reflecting its next action ("Expand all technicians" when it will expand, "Collapse all technicians" when every row is already expanded).

  * **S4-R5:** Expansion state is view-only and is not persisted: it resets (all collapsed) on any data reload (date-range or location change) and on a fresh visit. Deselecting and re-selecting a technician in the technician filter (an on-screen operation) does not change the expansion state of the other rows.




**Negative Cases:**

  * **S4-N1:** If a technician has no clocked time on a given day in the range, that day has no row.




### Story 5: Technician Filter

A filter lets the user choose which technicians the report shows, and the Summary updates to match.

**Design:** See Story 8 **Jira:** TBD

**Prerequisites:**

  * The report has loaded rows for the selected date range and location(s) (Story 1).




**Requirements:**

  * **S5-R1:** The toolbar has a filter labeled "Filter by Technician" where the user can select more than one technician.

  * **S5-R2:** On the user's first visit, every technician is selected.

  * **S5-R3:** When the user deselects a technician, that technician's row is hidden.

  * **S5-R4:** When a technician's row is hidden, the Summary row recalculates over the technicians that remain visible.

  * **S5-R5:** When the user re-selects a technician, that technician's row is shown again.

  * **S5-R6:** The filter has a control labeled "Select all" to select all technicians at once.

  * **S5-R7:** The filter has a control labeled "Clear all" to clear all technicians at once. Clearing all sets every currently-listed technician to deselected.

  * **S5-R8:** Changing the date range or location keeps the user's deselected technicians deselected.

  * **S5-R9:** Selection is tracked as the set of **deselected** technicians: a technician the user has not deselected is selected by default, including a technician who first appears after the user changes the date range or location. (Consequently, after "Clear all," a technician who newly appears in a later range/location is selected, because they were never explicitly deselected.)

  * **S5-R10:** When the user returns to the report, the technicians they previously deselected are still deselected (the deselected set is what persists — §3, S1-R8).




**Negative Cases:**

  * **S5-N1:** If the user clears all technicians (all currently-listed technicians deselected), the report shows the no-data message (§7) and hides the Summary row.




**Edge Cases:**

  * **S5-E1:** When every technician is selected, the Summary row equals the shop totals for the full date range at the selected location(s).




_* Context note: the technician filter changes only what is shown on screen; it does not change the date range or reload the report. (The location filter does reload — Story 9.)_

### Story 6: Total Hours Links to Timesheet Activities

Each technician's Total Hours value links to the Timesheet Activities report, filtered to that technician and date range.

**Design:** See Story 8 **Jira:** TBD

**Prerequisites:**

  * The report has loaded rows for the selected date range and location(s) (Story 1).




**Requirements:**

  * **S6-R1:** In a technician row, the Total Hours value is rendered as a link (every rendered technician row has clocked time > 0 per S1-R2, so the link always applies). The link is distinguished by more than color — it carries an underline (or equivalent non-color affordance), is keyboard-focusable with a visible focus indicator, and activates on Enter.

  * **S6-R2:** When the user selects a technician's Total Hours link, the Timesheet Activities report opens in the same browser tab.

  * **S6-R3:** The opened Timesheet Activities report is already filtered to that technician.

  * **S6-R4:** The opened Timesheet Activities report uses the same date range that was active on this report.

  * **S6-R5:** In an expanded day row, the Total Hours value links to the Timesheet Activities report for that technician on that single day.

  * **S6-R6:** The link passes the technician and the date range only; it does **not** pass the location selection. Timesheet Activities opens for the user's currently active shop. Therefore: with a single selected location matching the active shop, the opened total reconciles to the cent (S1-R9); when multiple locations are selected, or when the single selected location is **not** the active shop, the opened Timesheet Activities view shows the active shop's data, which will differ from (or be disjoint with) the report row's value. This is a known drill-through limitation, not a data defect.




**Negative Cases:**

  * **S6-N1:** The Summary row's Total Hours value is not a link.




### Story 7: Export to PDF and CSV

The user can download the report as a Summary PDF, an Expanded PDF, or a CSV file, and the download respects the current filters.

**Design:** See Story 8 **Jira:** TBD

**Prerequisites:**

  * The report has loaded rows for the selected date range and location(s) (Story 1).




**Requirements:**

  * **S7-R1:** The toolbar has a menu, opened from a three-dot button, that holds the download options.

  * **S7-R2:** The menu has an option labeled "Download Summary (PDF)".

  * **S7-R3:** The menu has an option labeled "Download Expanded View (PDF)".

  * **S7-R4:** The menu has an option labeled "Download (CSV)".

  * **S7-R5:** The Summary PDF shows the technician rows and the Summary row.

  * **S7-R6:** The Expanded PDF shows the technician rows, each technician's per-day breakdown, and the Summary row.

  * **S7-R7:** The CSV file shows the technician rows and the Summary row. The CSV is always this summary-level content; it does not vary by the summary/expanded choice.

  * **S7-R8:** Every download includes only the technicians that are currently selected in the technician filter, and covers the location(s) currently selected in the location filter.

  * **S7-R9:** Every download covers the date range that is currently active on the report.

  * **S7-R10:** The downloaded files include the same columns that are currently shown on screen — mirroring the column-selector visibility (Story 10) and including the per-row Location column whenever it is shown (S9-R9) — in the same left-to-right column order and number formats as the on-screen report, including the "—" rendering for an unknown Est. Lost Labor. In the CSV, any value containing a comma (e.g., "$1,234.50") is wrapped in double quotes per standard CSV escaping so the columns parse correctly.

  * **S7-R10a:** Rows in every download are ordered by **Technician name A →Z** (the default order). The on-screen column sort (S2-R13) is applied client-side only and is **not** carried into the export.

  * **S7-R11:** Both PDF views show a logo at the top of the report, resolved by the shared organization-logo resolver: the organization's uploaded logo when it has one, otherwise the bundled ShopView default logo. (Only if even the bundled default is unavailable does a PDF render with no logo.)

  * **S7-R12:** The downloaded files are named "Technician-Utilization-Summary.pdf", "Technician-Utilization-Expanded.pdf", and "technician-utilization.csv". _(The CSV filename is lower-case and the PDF filenames Title-Case, as shipped; the "(PDF)" menu labels likewise carry "View" on the expanded option only, matching the shipped strings.)_

  * **S7-R13:** Every download (both PDF views and the CSV) includes the per-row **Location** column whenever it is shown on screen (more than one location in scope — S9-R9), in its on-screen leftmost position. Every download also includes a "Locations:" line naming the location or locations the report is scoped to, or "All locations" when every location the user has access to is selected. In a PDF it appears in the header area; in the CSV it appears as a leading metadata line above the column-header row.




**Negative Cases:**

  * **S7-N1:** If no technician is selected, choosing a download option does nothing: no file downloads and no message appears.

  * **S7-N2:** If the organization has no uploaded logo, the PDF views show the bundled ShopView default logo (not a blank space).

  * **S7-N3:** The CSV file never includes the logo.




**Edge Cases:**

  * **S7-E1:** When every technician is selected, the download covers all technicians for the range at the selected location(s).




**Error Handling:**

  * When a download starts, the user sees a success notification: "Download started".

  * If a download fails, the user sees an error notification: "Failed to download report".




### Story 8: Visual Conformance and Accessibility

The report conforms to the application's standard all-white reporting theme and layout, and meets the accessibility requirements below.

_* Context note: requirements S8-R1 through S8-R9 define the report's visual structure; S8-R10 through S8-R14 add the accessibility requirements. They do not spell out every icon and finer styling detail — the companion video (linked in the header) and any attached screenshots are the visual reference for details the requirements do not state._

**Design:** TBD **Jira:** TBD

**Prerequisites:**

  * The report has loaded rows for the selected date range and location(s) (Story 1).




**Requirements — visual:**

  * **S8-R1:** The report uses an all-white table: white column headers and white data cells, with no alternating row shading.

  * **S8-R2:** The three-dot download menu sits leftmost in the toolbar's action cluster, followed by the Column Selection control.

  * **S8-R3:** The toolbar controls run, left to right: the three-dot download menu, the Column Selection control, the date-range picker, the technician filter, and the location filter (rightmost). (The expand/collapse-all control is not a toolbar control — it lives in the table header per S4-R4.)

  * **S8-R4:** When shown, the Est. Lost Labor column header is bold and pinned to the far right, matching its cells.

  * **S8-R5:** The Summary row stays visible at the bottom while the user scrolls the rows.

  * **S8-R6:** When shown, the Est. Lost Labor column header shows an information icon.

  * **S8-R7:** The information icon shows the text "Internal hours valued at each location's default labor rate" on hover, on keyboard focus, and on tap (touch); it is dismissible. _(This wording covers the per-location model of S2-R8; in a single-location view it is simply that location's rate × internal hours.)_

  * **S8-R8:** Each sortable column header shows a sort-direction indicator on the active sort column (ascending or descending); the Technician header shows the ascending indicator on load (S2-R12).

  * **S8-R9:** The report supports dark mode; the page background, toolbar, cells, the Total Hours link, the information icon, the sort indicator, and the "—" glyph all use dark-mode-legible colors meeting contrast.

  * **S8-R15:** When shown (more than one location in scope — S9-R9), the per-row **Location** column renders as the **leftmost** column, before Technician, using the suite's standard column treatment so its placement matches the same column on the other reports in the suite. The Location filter control (S9-R1) keeps a **constant width** regardless of the selected label (a single location name, several, or "All Locations"), so the toolbar layout does not shift when the selection changes.




**Requirements — accessibility:**

  * **S8-R10:** The active sort column header exposes its sort state to assistive technology (`aria-sort` = ascending/descending on the active header, none on the others).

  * **S8-R11:** An Est. Lost Labor cell showing "—" carries the assistive-technology label "No default labor rate configured" (distinguishing it from "$0.00", which reads as its dollar value).

  * **S8-R12:** The expand/collapse controls (per-row S4-R1 and the all-rows control S4-R4) are keyboard-focusable, toggle on Enter/Space, expose their expanded/collapsed state to assistive technology, and carry the verbatim accessible names defined in S4-R1 (per-row) and S4-R4 (all-rows).

  * **S8-R13:** The information icon (S8-R7) meets at least a 3:1 contrast ratio against its background in both light and dark mode.

  * **S8-R14:** The Total Hours link's non-color affordance and focus indicator (S6-R1) apply in both light and dark mode.

  * **S8-R16:** The icon-only Column Selection control carries an accessible name exposed to assistive technology.




**Negative Cases:**

  * **S8-N1:** No column header other than Est. Lost Labor shows the information icon.




### Story 9: Location Filter

A filter lets the user scope the report to one, several, or all of the locations they have access to.

**Design:** See Story 8 **Jira:** TBD

**Prerequisites:**

  * The report has loaded (Story 1).




**Requirements:**

  * **S9-R1:** The toolbar has a location filter labeled "Location" — a multi-select, and the **rightmost** control — listing the locations the signed-in user has access to plus an "All Locations" option. "All Locations" acts as a select-all shortcut: choosing it selects every accessible location; unchecking any individual location leaves the remaining specific locations selected (the selection is always the concrete set of checked locations).

  * **S9-R2:** On a first visit (no saved selection — §3), it defaults to the user's **currently active location** (the location currently selected in the application's global location switcher).

  * **S9-R3:** Selecting one, several, or all locations **reloads** the report scoped to that set (unlike the technician filter, which is on-screen only).

  * **S9-R4:** All metrics (technician rows, per-day rows, and the Summary) reflect only clock records at the selected location(s); a technician's hours are pooled across the selected locations into one row (one row per technician, not one per location), and per-day rows pool the same way (S4-R2).

  * **S9-R5:** Scoping is always constrained to the user's accessible locations — "All Locations" means all locations the user can access, never beyond; a location the user cannot access is never included.

  * **S9-R6:** On return, the saved location selection is restored **defensively** : any saved location the user can no longer access is dropped; if the remaining set is empty, the report falls back to the user's currently active location (S9-R2).

  * **S9-R7:** If the user deselects every location (empties the filter), the report falls back to the user's currently active location rather than showing nothing.

  * **S9-R8:** Both PDF exports and the CSV export cover the location(s) currently selected here.

  * **S9-R9:** When the selected scope spans **more than one location** , the report shows a per-row **Location** column; when the scope is a single location, the column is hidden (the scope is unambiguous). This auto-visibility applies on screen and in every export (S7-R13).

  * **S9-R10:** In the Location column (when shown, S9-R9): a technician row whose hours were all clocked at a single location shows that location's name; a technician row whose hours span more than one selected location shows the literal **Multiple** ; an expanded per-day detail row shows the exact location when that day's hours were all at one location, or **Multiple** when that day spans more than one. The Summary row leaves the Location column blank.




**Negative Cases:**

  * **S9-N1:** A user with access to only one location still sees the filter with a single selectable location; behavior is unchanged from single-location use.

  * **S9-N2:** If the selected location(s) produce no clocked time for the range, the report shows the no-data message (§7).




### Story 10: Column Selection and Persistence

The user can choose which columns show, and the report remembers its setup.

**Design:** See Story 8 **Jira:** TBD

**Prerequisites:**

  * The report has loaded rows for the selected date range and location(s) (Story 1).




**Requirements:**

  * **S10-R1:** A column-selection control — an icon button whose tooltip reads "Column Selection" — lets the user toggle each toggleable column on or off. It sits in the toolbar action cluster immediately after the three-dot download menu (S8-R2/S8-R3).

  * **S10-R2:** The **Technician** column is always shown and cannot be turned off.

  * **S10-R3:** Every other data column — Total Hours, WO Hours, Internal Hours, Utilization %, and Est. Lost Labor — is available in the control and can be toggled on or off. All five are shown by default on a first visit. (Est. Lost Labor was previously always-on; it is now a hideable column like the others.)

  * **S10-R4:** The per-row Location column is not one of the toggleable columns: it is auto-managed by the location scope (shown only when more than one location is in scope — S9-R9) and is never listed in the column selector.

  * **S10-R5:** Whatever columns are shown, they appear in the fixed left-to-right order of S2-R1 (toggling visibility never reorders columns), with the Location column — when shown — leftmost (S8-R15) and Est. Lost Labor last.

  * **S10-R6:** The report remembers the user's column selection in the browser, alongside the date range, technician selection, and location selection (§3, S1-R8), and restores it on the next visit. Restore is defensive: a saved selection that no longer resolves to valid columns falls back to the default-visible set rather than breaking the view.




_* Context note: persistence is per-browser (not tied to the user's account); it persists across visits in the same browser but does not follow the user to another browser or device._

## 7. User Feedback Summary

Trigger| Message| Behavior
---|---|---
No technician has clocked time in scope, or the user cleared all technicians, or the location produces no data| "Empty bays, endless possibilities. Get Going!"| This exact string is the application's standard reports no-data label, shown in the data area; the Summary row is hidden. (The same message is used for the genuinely-no-data and the filter-cleared causes — this version does not use distinct copy for the two.)
A download starts| "Download started"| Success notification
A download fails| "Failed to download report"| Error notification

 _* Context note: choosing a download with no technician selected is a silent no-op (S7-N1) — it produces neither a file nor a message._

## 8. Change Log

Date| Reporter| Change| Notes
---|---|---|---
2026-06-13| @chris / @claude| Spec drafted + hostile-eye locked; companion video recorded; published to Confluence (Draft — pending review).|
2026-07-11| @claude| **Suite-alignment rewrite (code-verified) + 10-reviewer ESL audit hardening, as part of the 5-spec lockdown.** Added the **multi-location filter** (Story 9; rightmost, default active location, server-side reload, accessible-locations-constrained, hours pooled per technician and per day across locations, defensive restore, All-Locations shortcut, empty→active fallback). Added the **" All Time"** date range as its own Story 10 (the prior draft referenced it only in the change log). Added a **Loading state** (S1-R10), a **reconciliation-scope** requirement (S1-R9: same range + same single location + closed records; open-clock and multi-location drill-through are deliberate scope differences, not defects) and scoped the §2 "mismatch = defect" note to match. **Est. Lost Labor** documented **per location** (S2-R8/S3-R5), with the **null vs $0.00 vs partial** cases pinned (S2-E2/E3/E4: "$0.00" for zero internal hours or a known $0 rate; "—" only when no rate at any contributing location; partial amounts value only rated-location hours, unmarked in this version) and the summary computed from unrounded values. Extended the **round-half-up** rule to cover Utilization % and made it a requirement (S2-R5/R7). Pinned **sort** behavior (S2-R13: all six columns sortable, first-click-on-Technician→descending, no third state, indicator on load, tiebreak + stable order for duplicate names, nulls-to-bottom S2-R17). Clarified persistence (deselected-technician set; sort not persisted; per-day pooling; expansion not persisted, S4-R5). Reworded the **info-icon tooltip** to the per-location model (S8-R7) and added an **accessibility block** (S8-R10..R14: aria-sort, "—" AT text, keyboard expand controls, contrast, touch tooltip, link affordance). CSV comma-quoting (S7-R10). Stripped the sibling-report ("Technician Efficiency") reference (S1-R1, Story 8) so the spec stands alone; the Timesheet Activities dependency (shared clock data + deep-link target) is retained as a functional dependency. §2 "shop totals" → "visible technicians".|
2026-07-11| @chris| **Owner decision — Est. Lost Labor valued per location** (S2-R8, S3-R5, §3). Each technician's internal hours are valued at the default labor rate of the location where they were clocked, then summed. _Build-delta: the current rollup applies a single (first-encountered, chronologically-earliest) location rate to the technician's total internal hours, and the shipped info-icon tooltip reads "Default labor rate multiplied by internal hours" (single-rate); the rollup must be changed to accumulate lost-labor dollars per location and the tooltip updated to the S8-R7 wording. Single-location views are already exact._|
2026-07-16| @chris / @claude| Removed All Time (deleted Story 10; simplified S6-R4); capped Custom at 366 days; per-day breakdown now loads lazily on expand (Story 4); **timezone model changed to a single report-level time zone (active workplace) matching Timesheet Activities (S1-R7), resolving the S1-R7/S1-R9 multi-location divergence** ; header cleanup (removed Companion Video row).| Per Milan Zivanovic's 2026-07-15 engineering review (timezone = his option 1).
2026-07-29| @chris / @claude| Added the suite-standard column selector; made Est. Lost Labor a toggleable (hideable) column; the PDF export logo now uses the shared resolver (org logo → bundled ShopView default → none); added a per-row Location column (shown when more than one location is in scope) plus a "Locations:" export line; exports now mirror the selected columns.|
