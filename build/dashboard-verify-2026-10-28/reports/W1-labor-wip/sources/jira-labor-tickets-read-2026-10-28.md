

===== SV-11688 [Ready to Fix] Technician Utilization counts open (never clocked-out) timesheets as 24 h/day — shop % collapses, idle days show 33.33 % instead of "-"
Env: Staging – Heavy Duty 9919 (26.43.0). Dashboard tile = TU report (parity OK) → bug is in the shared TU calculation.

Bug: an "Active" timesheet (clocked in, never out) is counted as wall-clock time, 24 h for every open day, still ticking.

Steps

1. Reports → Timesheet Activities, This month → 4 rows Aug 31 2026, Clock Out = Active (Montoya, Calderon, Smith, Brady – 1,246–1,249 h).
2. Dashboard → Technician Utilization (This Month) → View details.
3. Table: Brady 526.28 / 526.28 (100 %), Montoya & Calderon 0 / 526.28 (0 %) → headline 35.33 % (589 / 1,668 h).
4. Last Month → same 3 at 720.00 h each (30 × 24) → 41.17 %.
5. Any idle day on the chart = 33.33 % (only the 3 open entries exist that day).

Expected

* Open entry capped at shift end / 24 h, or excluded on past days.
* No closed time → "-" (PRD S3-E3 / S4-R11), not 33.33 %.
* Oct 1–22 shop TU ≈ 70.6 % (62.9 / 89.1 h without the open entries).

Actual: 35.33 %; Sep 41.17 %; Jan–Aug were 82–93 %. 3 open entries = 95 % of clocked hours.

Impact: any prod shop with a forgotten clock-out gets a silently wrong TU (tile + report). TE / BE not affected.

Evidence: MP4 walkthrough, 2 PNG tables, deep-dive report (attached).  
PRD: Dashboard v1 (SV-490) S3-R2, S3-E3, S4-R11. Housekeeping: close the 4 Active staging timesheets after fix; restore staging tz to America/Edmonton.  

![](blob:https://media.staging.atl-paas.net/?type=file&localId=b2b9414b5b7e&id=b7623a7b-592f-4d38-8dcb-fafe5d36af82&&collection=&height=342&occurrenceKey=null&width=936&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
![](blob:https://media.staging.atl-paas.net/?type=file&localId=2b9f6e793e1e&id=72b9cf08-f480-4bd7-a598-5e12ca96608c&&collection=&height=245&occurrenceKey=null&width=936&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
![](blob:https://media.staging.atl-paas.net/?type=file&localId=5502e0f2119f&id=81310731-ed31-451f-8fad-8a7cd5d07e3d&&collection=&height=984&occurrenceKey=null&width=1536&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

--- comment 2026-10-22 Chris Ward: <custom data-type="mention" data-id="id-0">@Bilal Muzamil</custom> <custom data-type="mention" data-id="id-1">@Mudassir Qamar</custom> thanks for the deep dive. The rule:

1. A timesheet still open for less than 24 hours is a live shift: it counts up to now and is split across the days it covers, like any closed shift. That covers night shifts and long days.
2. A timesheet open for more than 24 hours is treated as a forgotten clock-out: it is left out of Technician Utilization and flagged so a manager can fix it. Once it is fixed, the real hours count.
3. A day with no closed time shows "-" with no chart point (PRD S3-E3, S4-R11), not 33.33%.
4. Timesheet Activities follows the same rule so the two reports still match. Payroll export is unchanged (it already leaves open entries out).
5. Before building, check whether the app already has a long-shift limit or auto clock-out we should reuse.
6. How to check: the 4 Active staging entries no longer count, This Month on staging comes back to about 70.6%, and an entry clocked in 2 hours ago still counts.


--- comment 2026-10-23 Mudassir Qamar: Test case of this ticket: C88641 – Technician Utilization shows the exact percentage and equals its report; C88602 – Each tile's figure matches a hand calculation from known records (TestRail run R525 Dashboards).


===== SV-10702 [Blocked] Payroll Timesheet export dates each day of a multi-day punch one day early
### Overview

In the Payroll Timesheet export, each day of a multi-day punch is dated **one day early**, the real last day shows 0.00, and a single-day export can include a row dated before the chosen range. Per-employee and period totals are still correct; only the per-day dates are wrong. Cody says shops run payroll from this export.

### Steps to Reproduce

1. Find a punch that spans 3 days. On the internal demo org, Marie Stevens has a Shop Cleanup punch from **Aug 29, 10:15 AM to Aug 31, 10:44 AM**.
2. Go to Reports → Export Reports and choose **Payroll Timesheet**, Custom, **Aug 31–Aug 31, 2026**. Click Export.
3. Open the CSV and find Marie.
4. Compare with Reports → Timesheet Activities for Aug 31.

### Observed Outcome

Read-only on production (internal demo org), 2026-09-30.

Timesheet Activities is correct:

* Aug 30: 24.00 h
* Aug 31: 10.74 h (12:00–10:44 AM)
* Aug 31: 1.02 h (a separate PM Service punch)

The export:

| Export range | Marie's rows |
| --- | --- |
| Aug 31 only | `2026-08-31, 1.02` (the PM Service punch) and `2026-08-30, 10.74` (hours worked on Aug 31, dated Aug 30) |
| Aug 30 only | `2026-08-30, 0.00` and `2026-08-29, 24.00` (Aug 30's hours dated Aug 29) |
| Aug 30–31 | `2026-08-30, 10.74`, `2026-08-29, 24.00`, `2026-08-31, 1.02` (dates also unsorted) |

Same pattern for Katie Carrick in a Mar 7–9 export: rows are dated **2026-03-06** (outside the range), 03-07 and 03-08, and 03-09 shows 0.00.

It's common. The demo org has 157 full-day slices this year, and each one is exposed.

Exports split at day or week boundaries add up to the same totals as one combined export, so nothing is lost or double-counted. Single-day punches are dated correctly.

### Expected Outcome

_Proposed; not yet reviewed with Cody._

* Each day's hours are dated the day they were worked, matching Timesheet Activities.
* Only dates inside the chosen range appear.
* Dates are in ascending order.

### Source

* Read-only stress test on production (internal demo org), 2026-09-30.
* Root cause checked by an independent code review.

### Notes

* **Cause:** a double timezone conversion in `api/src/Reporting/Export/Application/PayrollTimesheetExport/PayrollTimesheetExportQueryHandler.php`.

    * Day slices of a multi-day punch are already local wall-clock strings (`:87-89`). `:233` re-parses them as UTC and converts them to local time again.
    * As a result, any slice starting before about 06:00 MDT / 07:00 MST lands on the previous day.
    * Placeholder buckets keyed by the UTC `DATE_FORMAT` (`:113`, `:235-244`) print as 0.00 rows.
    * Buckets print in creation order (`:141-166`), which is why the dates come out unsorted.
    
* **Regression:**

    * This came in with the fix for **SV-3073** (commit `ab8407338e`, 2025-01-28, plus `16a8cc4d20`). That fix corrected single-day punches.
    * Removing `:233` alone would re-break SV-3073. Split rows should use the label they already carry (`start_date_formatted`, `:87`), and unsplit rows need an explicit local-date label.
    
* **Tests:** this handler has none. A failing test should cover a multi-day punch, a single-day export next to it, and a daylight-saving day (see SV-10701).
* **Not verified:** from the code, a single-day punch starting after about 18:00 MDT may also get a spurious 0.00 row dated the next day.
* **Related:**

    * SV-10701 (daylight-saving days counted as 24 h; same export code path).
    * SV-3073 (the same symptom, fixed in Jan 2025).
    * SV-3276 (a duplicate of SV-3073).
    * SV-10630 (QB Unexported dates show one day early, timezone converted twice; the same kind of bug, Ready to Fix).
    




===== SV-10698 [Blocked] Timesheet Activities rows don't add up to Totals when a clock has been running since an earlier day
### Overview

When a technician's clock has been running since an earlier day, their row shows every hour since they clocked in. Totals only count the hours inside the selected date range. The rows then don't add up to Totals, and nothing on the screen explains the gap. Completed entries don't have this problem, because they're split into one row per day.

### Steps to Reproduce

1. Have a technician clock in and leave the clock running past midnight.

    * The internal demo org has a live example: Ben Brig, Shop Cleanup, clocked in Sep 28 at 3:22 PM and still running on Sep 30.
    
2. The next day, go to Reports → Timesheet Activities and set Date Range to **Today**.
3. Add up the Total Hours column and compare it with the Totals row.

### Observed Outcome

Production, internal demo org:

* **Sep 29, 2:50 PM:**

    * Ben's row (dated Sep 28, Active) showed **23.46 h**.
    * The 17 rows added up to **37.30 h**, but Totals showed **28.67 h**.
    * The 8.63 h difference is exactly Ben's time from 3:22 PM to midnight on Sep 28.
    
* **Sep 30, about 10 AM:**

    * The rows added up to **46.23 h**, and Totals showed **13.60 h**.
    * Ben's row alone was 42.98 h.
    

### Expected Outcome

Per Cody McCarthy, 2026-09-30: the rows and Totals **always** add up, including for overnight punches.

### Source

* Reproduced on production (internal demo org), 2026-09-29/30.
* Read-only stress test of 2,532 rows (Jan–Sep).
* Confirmed with Cody McCarthy, 2026-09-30.

### Notes

* **Cause:**

    * **Totals** clip each entry to the range: `api/src/Reporting/Domain/TimesheetActivity/Services/DataProvider.php` (`~:159-195`), using `GREATEST`/`LEAST` and `COALESCE(end, NOW())`.
    * **Rows** come from `ReportGenerator.php` `hydrateData`/`splitIfRequired` (`~:65-98`, `:183-214`). It splits completed entries at midnight, but a running entry keeps one row with its full duration.
    
* **History:**

    * SV-6858 (reported 2026-04-20, closed as obsolete on 2026-09-22) reported the same symptom.
    * Its triage comment identified this exact cause: an open clock showed about 72 h on its row against about 16 h in the total.
    * An automated fix (PR #686) was proposed but never merged. develop still builds Totals this way.
    
* **Related, not part of this ticket:** for a range that ends before now (e.g. Yesterday), a still-running clock is left out of both the rows and Totals (`TimesheetActivityQueryHandler.php:18-19`). It doesn't appear at all on the days it spans. Worth deciding together with this fix.
* **Stress test:** every other range matched within 0.06 h (rounding), except a DST day. That's filed as a separate, linked ticket.




===== SV-8944 [OBSOLETE] Technician Utilization total hours do not match Timesheet Activities for the same technician, range and location
### Description

A technician's Total Hours on Technician Utilization does not agree with the same technician's total on the Timesheet Activities report, even for the same dates, the same single location and only finished clock records. The gap is small but real — up to a quarter of an hour on the technicians checked.

### Steps to reproduce

Environment: QA branch sv8582 (https://sv8582.qa.shopview.com). Desktop browser, signed in as an Admin.

1. Open Reports, then Technician Utilization. Set the date range to This Year and choose the single location Staging Heavy Duty - 9919.
2. Find the row for Andrew Wade and write down his Total Hours.
3. Click that Total Hours figure. Timesheet Activities opens for the same technician and the same dates.
4. Wait for the page to finish loading — the staff name settles to Andrew Wade — and read the Totals line at the bottom.
5. The technicians compared here were Andrew Wade, Brittany Anderson, Colleen Guerrero, Fernando Mercer, Kellie Ayers, Angela Roman, Christian Pitts and Alyssa Randall.

### Current behaviour

Technician Utilization showed Andrew Wade 1080.44 hours; Timesheet Activities showed 1080.64 for the same technician and dates — 0.20 hours apart.

Six of the eight technicians compared disagreed: Andrew Wade +0.20, Fernando Mercer +0.25, Kellie Ayers +0.21, Brittany Anderson +0.16, Colleen Guerrero +0.05, Angela Roman −0.01, Christian Pitts −0.03. Alyssa Randall matched exactly at 744.51.

For the developer, from the underlying data: Timesheet Activities adds up each clock record after rounding it to two decimals, while Technician Utilization adds the raw times and rounds once at the end. Andrew Wade's 604 records total 1080.62 when each is rounded first, against 1080.4422 raw.

It is not an open clock — he has no clock records at all in August 2026, and the two readings were taken two seconds apart. It is not the multi-location difference the description allows: the report was scoped to the single location he works at, and his figure is the same whether one or both locations are selected.

### Expected behaviour

For the same date range, the same single location and only finished clock records, a technician's Total Hours here equals the Timesheet Activities total for that technician exactly.

---

**Source** — the [Technician Utilization report specification](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/641400833/Technician+Utilization+Report) on Confluence, version 6, requirement S1-R9: “Reconciliation guarantee (scope). For the same date range and the same single location, and counting closed clock records, this report's Total Hours for a technician equals the Timesheet Activities report's total for that technician to the cent.”

The same description explains why that is achievable: the Timesheet Activities report is expected to round the same way this one does, round-half-up to two decimals, from the same clock data, and the to-the-cent reconciliation depends on that shared rounding.


===== SV-5983 [Done] Refactor Shop Efficiency report
Migrate ShopBillingEfficiency.vue from Options API to TypeScript + Composition API. The component is already hybrid — it has a setup() hook using useLocation and useReportsTable composables, but still has data(), methods, and mounted() in Options API style.

## Components

* components/reporting/ShopBillingEfficiency.vue — billing efficiency report showing clocked vs invoiced hours with date range filtering

## Vuex store modules accessed

* reporting (action: fetchShopBillingEfficiency via storeInstance())

## Child components

* CustomDateDialog (lazy) — components/ts/shared/dialogs/CustomDateDialog.vue
* DateRangeSelect (lazy) — components/shared/DateRangeSelect.vue
* Table — components/forms/Table.vue (data table with sortable columns and sticky totals row)

## Migration steps

1. Move ShopBillingEfficiency.vue to components/ts/reporting/ShopBillingEfficiency.vue
2. Convert to defineComponent + setup() — consolidate existing setup() with remaining Options API
3. Move data() properties into setup scope as refs (title, linkColumn, totalsTypes)
4. Move methods into setup scope as plain functions (loadCustomDate)
5. Replace mounted() with onMounted()
6. Keep existing useLocation and useReportsTable composables
7. Add TypeScript types for column definitions and totals types
8. Update import in pages/Reporting.vue parent component

## Acceptance criteria

* Component renders and behaves identically to the original
* Date range filtering works (today, this month, custom range)
* Custom date dialog opens and submits correctly
* Table sorts by all columns (clocked hours, invoiced hours, difference, efficiency)
* Sticky totals row displays correct aggregates
* Clicking rows with work_order_id opens work order finance in new tab
* TypeScript compiles with no errors
* ESLint passes with --max-warnings=0

## QA Test Plan

Navigate to Reporting > Shop Billing Efficiency. Verify table loads with data. Test each date range preset (Today, This Week, This Month, etc.). Test Custom date range — open dialog, select dates, confirm. Verify totals row at bottom shows correct sums/averages. Click a sortable column header — verify sort works. Click a row with a work order — verify it opens in new tab. No console errors throughout.
--- comment 2026-03-26 Stefan Mitrovic: **Ready for QA testing.**

**QA Severity:** Medium

**Test Plan:** [View in Powertools](https://powertools.shopview.com/qa/test-plans/47f8ac46-e4d1-4d34-8fd9-0bbab175d245)

### Key highlights

* Shop Billing Efficiency report fully migrated from Options API (JS) to Composition API + TypeScript
* Cell formatting changed from template-slot `getCellValue` to typed column `field` functions; error handling upgraded to shared `errorHandler` wrapper
* Key risk: Date range URL sync, totals row formatting, and custom date flow — all rewritten
* Scope: Reporting > Shop Billing Efficiency tab only (6 files)


--- comment 2026-04-24 Ryan Fyfe: This Medium ticket hasn't had activity in -684 hours. Please update the status or add a comment if this is blocked.


===== SV-5975 [Done] View active timesheets in the Timesheet Activities report
As a shop owner or manager, I want to see all open timesheets so that I know who is working and what they’re working on


===== SV-3309 [Done] Show active punches in Timesheet Activities Report
\*12 intercom links from _existing customers_

‌

Currently active punches are visible in the work order timesheets tab, but not in the Timesheet Activities report page. 

* The activity only populates in the report when it is completed (end time is set)
* For staff members that are actively clocked into departments, there is no visibility into their current activity.

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=6b34c714-c49d-45bd-b7d8-49ec78163f7f&&collection=&height=200&occurrenceKey=null&width=2268&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
**We would like to:**

* **Display all active timesheet activities, including department activities in the timesheet activities report using the same method we display active punches in the work order timesheets tab, as shown above.**
* **Add functionality to allow a user with correct permissions to CLOCK OUT, other users.**

    * **Default ON permission for Owner, Administrator, Service Manager**
    

‌

‌

—  
created by Support (intercom@shopview.com) in Intercom
--- comment 2025-02-27 Kcarrick: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> thoughts of moving this to the board? We do have lots of customers now that have office staff punch in as well so they can’t see what they are currently punched into with only technicians being shown on schedule/WO listing
--- comment 2025-03-03 Kcarrick: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> more questions about this. I’m going to move it to the board so you can have a look
--- comment 2025-09-18 Cody McCarthy: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> <custom data-type="mention" data-id="id-1">@Jasna Mladenovic</custom> <custom data-type="mention" data-id="id-2">@Kcarrick</custom> This one is gaining some momentum, open since Feb. Would love to get some traction soon on this request please. Moved to board for review/prioritization.
--- comment 2025-09-18 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Cody McCarthy</custom> Some process changes with board layout. Please don’t move to board any more. Please just tag us in it, as we are working on prioritizing within the backlog itself.   
  
Also only Jasna/I need to be tagged from product. 


===== SV-3239 [Done] Totals - Timesheet Activities report
‌

Summary: Update the Timesheet Activities report to display accurate totals from the backend (BE) and add tooltips to show precise hours. Ensure consistency between the report totals and payroll export. (currently, report is showing paginated results, and the user needs to scroll to the bottom of it, to get the numbers that they need.)

‌

1. Totals at Page Bottom:

    * Modify the totals at the bottom of the Timesheet Activities report to reflect the sum of all filtered results from the BE, not just paginated results.
    * Update totals dynamically when the time or staff filter changes to show the sum of filtered results.
    
2. Tooltip for Total Hours:

    * Add a tooltip to each row’s ‘Total Hours’ in the Timesheet Activities report.
    * Tooltip should display the true hours from the BE, rounded to 5 decimal places.
    
3. Payroll Export Consistency:

    * Ensure the payroll export uses the true hours from the BE, as displayed in the tooltips, and rounded in the report (Already doing this I think).
    * Verify that the total hours at the bottom of the Timesheet Activities report match the totals in the payroll export.
    

Notes:

* The UI currently rounds numbers; tooltips will clarify the precise BE values.
* Payroll export is believed to already use the 5th decimal place values—confirm this behavior.

‌

‌

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=a3280d78-e8e6-4d08-9bc6-019968c111fc&&collection=&height=1158&occurrenceKey=null&width=2265&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=2e043e41-7315-4bc9-ad61-64ba53314bd9&&collection=&height=694&occurrenceKey=null&width=1308&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
 Payroll export report

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=55596b21-15f3-4d6e-ae7e-ad584b444849&&collection=&height=598&occurrenceKey=null&width=536&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
* Payroll export to have 1yr max block to export at once. 


--- comment 2025-05-22 Dusan Bulovan: I had to push the ticket back from in progress column in favor of this one:  
<custom data-type="smartlink" data-id="id-0">https://shopview.atlassian.net/browse/SV-3680</custom>   
which got updated after yesterday’s discussion.
--- comment 2025-06-03 Dusan Bulovan: This is now ready for code review and for testing.  
Since I’ve sorted out both FE and BE, I created two PRs as well, commented them, labeled it as mutually connected and got approval that the process I’m following is the right one.  
I’ve communicated with Milan as well, so he is gonna check the PR.  
Also, I chatted shortly with Nebojsa just to point out that when the ticket comes to his plate it will need a bit more effort to test it, and I will also make sure I’m available to assist during testing.
--- comment 2025-07-11 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> <custom data-type="mention" data-id="id-1">@Dusan Bulovan</custom> I believe this got merged to production in one of the previous releases? 
--- comment 2025-07-13 Stefan Mitrovic: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> You are right, this has been deployed to production, but the ticket wasn’t updated at the time. Right now we can only notify QA team and let them know to go through this and give us feedback. If something doesn’t work properly we should deploy hotfix. FYI <custom data-type="mention" data-id="id-1">@Vladimir Tomovic</custom> <custom data-type="mention" data-id="id-2">@Nebojsa Glavinic</custom> 
--- comment 2025-07-14 Nebojsa Glavinic: <custom data-type="mention" data-id="id-0">@Dusan Bulovan</custom> <custom data-type="mention" data-id="id-1">@Stefan Mitrovic</custom>   
Tested on both staging and production.  
  
1\. **Timesheet Activities**  
In Timesheet Activities export the following columns should be visible:

* Date
* Employee
* Work Order
* Clock In Activity
* Clock In
* Clock Out
* Total Hours
* WO Hours
* Internal Hours
* Modified By
* Modify Date/Time
* Comment

At the moment over 500 columns are visible on **Timesheet Activities** export (both staging and production)  
Total Hours tooltip is not present at all (2nd request in the ticket body)  
When using **Last Year** filter on staging in the app Totals are off by 0.01  compared to export (**10975.21** in the App and **10975.20** on export)  
On staging with Last Year filter I noticed that reports for some Staff memebrs are missing. We should verify if all staff member’s activities are displaying.  
When using a **This Year** filter on staging for staff member Nebojsa Glavinic, Total Hours and WO Hours in app are showing 0.01 more than on the export.  
If the totals are whole numbers (e.g., 5.00) in the App, they show as 5.00 for Total Hours, but for WO Hours and Internal Hours, they display as 5.  
On the Production, if the **Last Year** filter is selected, it automatically populates **Kurt Thompson**, even when there are records for other staff members. This should only happen if the selected filter/date range return records for a single staff member.  
  
**2. Payroll**  
Payroll timesheet is not displaying anything on the staging. On production this is hidden. Not sure if anything was done on it.  
Payroll exports pulls more data (more staff members and more hours) when filtered by **Yesterday** compared to Timesheet Activities.  
Some reports are off by 0.01 e.g., filtered by **Last Week, This Month** for Bilal Muzammil
--- comment 2025-07-14 Dusan Bulovan: For the transparency, I’m investing time in all this today. Will let you know all here
--- comment 2025-07-14 Dusan Bulovan: Will go through my findings one by one fellas.   
  
So the first one:   
  
**The production** is working on the UI list as expected.   
Please checkout my print screen, look at the total numbers, and then open the spreadsheet file I’ve attached.  
In the spreadsheet file, I inserted all the records being displayed on the web UI,  separately.  
Then I made SUM function for 3 columns: Total hours, WO hours, Internal hours, and all match.  
   
  
So based on the filter “Last Month”, and based on the 2000 records, I can say this is a proof that this page’s calculation works.

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=3933efce-f6db-44b2-a083-4d80dc2cebab&&collection=&height=950&occurrenceKey=null&width=1770&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

--- comment 2025-07-14 Dusan Bulovan: This also works:  
  
Report (Export Report) → Payroll Timesheet → Last Month  
It shows the same Total hours as in web UI.  
I’ve edited the exported file, added sum up for each of the staff members so you can checkout the calculation.  
 
--- comment 2025-07-14 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Nebojsa Glavinic</custom> Can you go through comments below? Appears to be working as per comments from Dusan? 

‌

<custom data-type="mention" data-id="id-1">@Dusan Bulovan</custom> reminder to tag ppl in comments. 
--- comment 2025-07-15 Dusan Bulovan: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> I will, apologize.   
  
I’m still into investigating, so let’s wait for a bit more <custom data-type="mention" data-id="id-1">@Nebojsa Glavinic</custom> please.
--- comment 2025-07-15 Nebojsa Glavinic: <custom data-type="mention" data-id="id-0">@Dusan Bulovan</custom> 

Huddle me if you need assistance. Not all filters have issues. It took me quite some time to go through all of them and compare data for 2–3 users on all of them
--- comment 2025-07-15 Dusan Bulovan: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> I’ve spent the whole day trying to catch it, I’m not happy to say I can’t get it.  
Total number of hours on the bottom of the UI is or correct for some date ranges, OR is =\[correct result + 0.01\].  
So it’s never less than the correct result, it’s never bigger by 0.02 or more, no, it is or correct or 0.01 bigger.  
  
I’ve chatted with <custom data-type="mention" data-id="id-1">@Milan Zivanovic</custom> as well, maybe we’ll find some time tomorrow to check it together.  
  
But I also wanted to prepare a backup approach for the business. Since 0.01 is 100th part of an hour, which is 36 seconds I believe, how much of effort is justified to spend so we and our customers cover and track report for 36 seconds <custom data-type="mention" data-id="id-2">@Fabian Bonjean</custom> ?  
Again, it’s not my way of giving up, we can try more tomorrow, I’m just trying being Idk, rational let’s say.
--- comment 2025-07-16 Dusan Bulovan: I've found what causes 0.01 hour difference error.  
Practically it is not necessarily an error, just the rounding approach we decided to follow.

Staff member Dusan let's say, clocked in his working hours from Jan 29th 15:33:58, until Jan 30th 01:01:25.  
We save this as 1 database record.

Then, for the purpose of UI, mysql database pulls out that for date range 29-30 Jan, Dusan has **9.4575** hours clocked in.  
Total hours on the UI bottom page will show this number as rounded at 2nd decimal, so it becomes **9.46**

But for the purpose of CSV file, we can't show total hours because we want to segregate Dusan's hours day by day. We split one record into two records.  
So on the Jan 29th Dusan had **8.4336** hours. We don't want to show the full decimal number, but we round it to 2nd decimal so it becomes **8.43**.  
On the Jan 30th Dusan had **1.0236** hours, and after rounding it becomes **1.02**.

Let's do addition now:  
 8.4336 + 1.0236 = **9.4572**  
(yes, the original hours value is 9.457**5** but this 4th decimal inconsistency is something else and we ignore it).  
So we can say that without rounding applied, we do have correct value.

But when we sum up CSV's hours, which are rounded beforehand:  
8.43 + 1.02 = **9.45**

This **9.45** is of course different than what we can see on the UI, where it shows **9.46**.

In short, looking at the CSV you observe granulated hours by each day, which are shown already rounded. Summing it up, can't get you the the most accurate value because you don't know e.g. 3rd decimal places.  
But looking at the total numbers on the UI bottom page shows you rounded hours after the addition has been performed.

Can we align it, can we get to show exactly the same numbers?  
The answer is weird, yes and no. We could move decimal places to at least 4th position, or 6th.  
But whatever we do, as long as we do any rounding in the CSV file (and we will do, we won't show 4 decimal places for sure), a customer can take that numbers, sum it up, and still find it different compared it to the one on the UI within total numbers.   
  
<custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> <custom data-type="mention" data-id="id-1">@Milan Zivanovic</custom> <custom data-type="mention" data-id="id-2">@Nebojsa Glavinic</custom> 
--- comment 2025-07-16 Dusan Bulovan: <custom data-type="mention" data-id="id-0">@Nebojsa Glavinic</custom> Hey Nebojsa, just wanted to add here for the transparency, the rest of the things (so all other except 0.01 thingy) has not been covered by the ticket which I worked on. So for the e.g. extra columns and others, that has been floating around before I did this refactor within the ticket, so I’m just thinking maybe you could create an extra ticket for that. What do you think?
--- comment 2025-07-16 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Dusan Bulovan</custom> <custom data-type="mention" data-id="id-1">@Nebojsa Glavinic</custom> Yeah please make a new ticket for the columns on that export.   
  
We decided to leave this issue for now, but as fix in future, if a timesheet spans multiple days, upon time sheet creation, if the timesheet spans 3 days, it will create 3 separate timesheet records with 3 different timesheet IDs, rather then splitting one timesheet ID into 3 different entries with the same ID.   
  
This will fix the rounding issue. 
--- comment 2025-07-16 Nebojsa Glavinic: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> <custom data-type="mention" data-id="id-1">@Dusan Bulovan</custom>   
Yeah, I’ll create separate tickets for these issues. Are we planning to address them in the next release or the one after? I’m currently short on time, so please let me know if it can wait until the weekend or after I finish testing the remaining tickets on staging, or if it’s something we need to prioritize immediately.
--- comment 2025-07-16 Nebojsa Glavinic: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> <custom data-type="mention" data-id="id-1">@Dusan Bulovan</custom>   
  
I created the following tickets:  
  
<custom data-type="smartlink" data-id="id-2">https://shopview.atlassian.net/browse/SV-4075</custom>   
<custom data-type="smartlink" data-id="id-3">https://shopview.atlassian.net/browse/SV-4079</custom>   
  
I’ll continue adding more data, notes, and screenshots, but for now these can serve as placeholders.
--- comment 2025-07-17 Stefan Mitrovic: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom>  <custom data-type="mention" data-id="id-1">@Nebojsa Glavinic</custom>if I understood correctly this ticket is ready to be re-tested (if needed) since we will go as is. Other issues have been addressed in other tickets.
--- comment 2025-07-17 Nebojsa Glavinic: <custom data-type="mention" data-id="id-0">@Stefan Mitrovic</custom>   
Ready for production. All remaining issues have been addressed in separate tickets and are linked to this one.


===== SV-2881 [Done] Report discrepency - Sales report to Shop Billing Efficiency report
There is a discrepency between the Billing Efficiency report, and the Sales report. 

‌

This problem exists in production. There is a lot more data in the production environment to look at. 

Foothills Group production environment. September 8 2024. 

* Billing efficiency report shows ‘Total Hours Invoiced’ 150.75 hours for ‘This Month’ 

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=d11155ea-d9d4-48f0-b9a4-42114995da21&&collection=&height=1262&occurrenceKey=null&width=2513&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
* Sales Report shows ‘Total Invoiced Hours' as 165.25

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=9030a4a5-c3e4-4304-b658-ae09b3043b25&&collection=&height=1282&occurrenceKey=null&width=2499&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

    



‌

_These numbers should be the same. I am not sure which one is correct, and which one is incorrect._ 
--- comment 2024-10-10 Milan Zivanovic: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> <custom data-type="mention" data-id="id-1">@Nebojsa Glavinic</custom> 

this is ready for testing, as issue I found with fixed lines reporting was wrong in billing efficiency report, but I still could see some changes when selecting different date ranges, so will look into that more.

Could be that we are seeing similar issues like for other reports due to how date ranges are handled on BE. If that is the case I will look into it with Minja to apply the latest improvements to all reports/exports.
--- comment 2024-10-12 Nebojsa Glavinic: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> <custom data-type="mention" data-id="id-1">@Milan Zivanovic</custom>   
Tested on staging. There are no discrepancy when using ‘This Month’ filter  
  
Issue persists when using the following filters:

* yesterday
* this year
* custom date


--- comment 2024-10-13 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Nebojsa Glavinic</custom> At the time of my testing:

* Worked for the ‘yesterday’ filter.  - No problems found. 
* The ‘This year’ filter, was 1 hr off. The Sales report is 1hr lower.  - 1 hr off
* Customer filter, pulled from Sep 1 - Oct 5 on both reports and both matched.  - No problems found

    * I also pulled from June 1 - Aug 22 and both reports matched on those ones as well. - No problems found 
    

<custom data-type="mention" data-id="id-1">@Milan Zivanovic</custom> 
--- comment 2024-10-16 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> Following up on this one. Only the ‘This Year’ filter is 1 hr different. 

‌

<custom data-type="mention" data-id="id-1">@Nebojsa Glavinic</custom> I was not able to reproduce the issues that you had. Can you test it again to try reproduce the issues you mentioned? 
--- comment 2024-10-16 Nebojsa Glavinic:  <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> 

Retested on staging per <custom data-type="mention" data-id="id-1">@Fabian Bonjean</custom>  request.   
'This Year' filter is showing 1h difference.   
'Yesterday' is showing correct values now. But it might be that last time I tested it was some time after midnight, so this could be potentially time zone issue.  
'Custom' filter is not showing correct values , see the screenshot:

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=19d37aec-4a3d-4849-9360-0c4686247898&&collection=&height=944&occurrenceKey=null&width=1915&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

--- comment 2024-10-21 Milan Zivanovic: <custom data-type="mention" data-id="id-0">@Nebojsa Glavinic</custom> <custom data-type="mention" data-id="id-1">@Fabian Bonjean</custom> ready for testing
--- comment 2024-10-21 Nebojsa Glavinic: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom>   
Tested on staging. Issue is no longer present. Ready for production.


===== SV-2662 [Done] BUG: Technician time sheet - issue with WO's that last more than 1 day. (Keyword: Timesheet Activities, Timeclock, time clock, punch clock)
* See screenshot:  

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=88c44095-76ab-4af0-af64-27956c8c48d7&&collection=&height=751&occurrenceKey=null&width=1680&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

    



    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=bcf0fafc-d037-4601-8fde-92f99de4cd88&&collection=&height=630&occurrenceKey=null&width=2109&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
* In the example from SS we see 2 records with duration of 115,77h, problem is that in Total time column that time is counted twice and we give user wrong information.

‌

‌

* **The intented behavior is for the timestamp to clock out/in at this time, but it should only show the hours for that day. In the case above, it should show 24 hours.** 

‌

Issue is related to ticket: [SV-2470](https://shopview.atlassian.net/browse/SV-2470) 
--- comment 2024-06-10 Cody McCarthy: <custom data-type="mention" data-id="id-0">@Vladimir Tomovic</custom> Can confirm this issue. 

This timeclock activity was a single punch - technician stayed punched in over the weekend. It looks like the report has broken that punch into its respective 24h intervals, punching the technician out at the end of the day, and back in at 12:01 (desired), but is displaying multiples of the total time of the single activity, rather than the daily breakdowns of 24h. The total hours should never contain a value more than 24.

I pulled the report from the previous month (May) and found 4 more punches, and includes an activity from June… also strange. Added the picture to ticket description.

I confirmed this false information is also going to the export.

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=95f56c66-64b9-47d7-8349-6e7a10e64d3b&&collection=&height=111&occurrenceKey=null&width=963&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
We should test again with new data (entered after the last release (Jun 7). The changes that were made on the linked ticket may not fix old data. 
--- comment 2024-06-19 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Cody McCarthy</custom> Let me know when this has been retested. I put this on the board. This will be a bug incoming once timesheets are used for payroll, which we should start doing ASAP
--- comment 2024-06-19 Cody McCarthy: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> Retested after latest release, still the same issue as stated above:

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=e61ac5e1-0aed-44b3-a458-d0afba32b214&&collection=&height=896&occurrenceKey=null&width=1666&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
Also noted the page filters are no longer working.
--- comment 2024-08-08 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Damjan Veljkovic</custom> I assigned this one to you as well, because it is related to timesheets. 
--- comment 2024-08-15 Damjan Veljkovic: I’ve updated the logic to show records for selected day(s) only.

ex.

* we’re using WO **S-463**
* we have a records spanning over 3 days (15th, 16th and 17th), from 15th at 7AM to 17th 9AM
* selected “Today” from the dropdown (15th)
* resulting table will have a single entry from WO **S-463** from 15th only

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=96c02962-e12a-4500-bfb1-ba3232374189&&collection=&height=170&occurrenceKey=null&width=639&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

    



* now selected “Custom” from the dropdown (14th to 18th)
* resulting table will have all entries from WO **S-463** from 15th to 17th

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=1f92c1f8-dd30-407a-a8da-3b4d6e25661a&&collection=&height=237&occurrenceKey=null&width=632&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

    



<custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> <custom data-type="mention" data-id="id-1">@Cody McCarthy</custom> <custom data-type="mention" data-id="id-2">@Vladimir Tomovic</custom> Please confirm this change is acceptable or needs further adjustments.

On a side note: you’ll notice that ordering is off. records are order by date, but for records spanning over multiple days we show them together. This is a behavior from before this change,  should be this fixed within' this ticket?

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=7d0888d9-9d21-4e54-8676-9082f8b29929&&collection=&height=700&occurrenceKey=null&width=224&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

--- comment 2024-08-15 Milan Zivanovic: <custom data-type="mention" data-id="id-0">@Vladimir Tomovic</custom> <custom data-type="mention" data-id="id-1">@Fabian Bonjean</custom> ready for testing
--- comment 2024-08-18 Fabian Bonjean: I clocked into S3-769 on staging location ‘Fabian’ at 10:10pm, need to clock out next day or 2 and retest to see how time record looks. 
--- comment 2024-08-19 Nebojsa Glavinic: <custom data-type="mention" data-id="id-0">@Damjan Veljkovic</custom>  <custom data-type="mention" data-id="id-1">@Fabian Bonjean</custom> 

I generated records by adjusting the technician's time from an admin account, so the validity of this data may be questionable. Please refer to the screenshot below for further details.

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=8c5f6bc0-d6a3-4238-840a-a372d1829f0d&&collection=&height=855&occurrenceKey=null&width=2329&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
\[marked in green\]  
As for the W/O that lasts more than 1 day, the hours are splitting and showing correctly in the 'Total Hours' and 'WO Hours' columns (no more than 24 hours per day), but I would like to point out some other concerns:

\[marked in red\]  
Damjan already mentioned earlier that ordering is off

\[marked in blue\]  
Two records cannot coexist in the same minute, in other words second record cannot start in the same minute the first record ends. Starting it won't trigger any error, but trying to shift that time from one line to another will result in an error. 

\[marked in pink\]  
Since I changed the technical records, I was able to set a future time frame for a WO created on the current day, and I could edit the entry on the same WO to make it appear as if the technician had worked on it a month ago. This is not directly related to this ticket but potentially can cause a lot of confusion if the admin is not paying attention, making activities merge in the past records or the future records. 

\[marked in yellow\]  
What is the purpose of the 'Total Hours' column? It is mirroring either 'WO Hours' or 'Internal Hours'. 
--- comment 2024-08-19 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Damjan Veljkovic</custom> I clocked in overnight last night, and when testing it today, the time records are not displaying in the timesheet activities report. Not sure why, and I cannot duplicate. I will clock in again over night tonight, and see if I can re-create it. I have made a new ticket for the issue here: <custom data-type="smartlink" data-id="id-1">https://shopview.atlassian.net/browse/SV-2825</custom>   
  
I also added ticket, to re-order: <custom data-type="smartlink" data-id="id-2">https://shopview.atlassian.net/browse/SV-2826</custom> 
--- comment 2024-08-19 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Nebojsa Glavinic</custom> The total hours, is the total of all the hours (Internal, and work order) hours combined.   
  
Re: editing timesheets to the future, yes, this is a possible user error, but something we can live with for now, and a low priority.   
  
Re: timesheets not starting in the same minute, yes, this is because we do not want to show seconds on the timerecords. Damjan may be able to explain this further. 
--- comment 2024-08-19 Fabian Bonjean: I will test this again tomorrow, when my new over night time record shows up in the timesheet acritivies tab.   
at 5:33pm, user Fabian Bonjean (admin user in staging) clocked onto work order S3-345, line 1, and is going to stay clocked on overnight. Will check time record that is created tomorrow.   

--- comment 2024-08-20 Milan Zivanovic: <custom data-type="mention" data-id="id-0">@Kcarrick</custom> <custom data-type="mention" data-id="id-1">@Fabian Bonjean</custom> <custom data-type="mention" data-id="id-2">@Vladimir Tomovic</custom> 

There are new changes pushed and ready for testing, related to the export action.

<custom data-type="mention" data-id="id-3">@Damjan Veljkovic</custom> please fill in with info if necessary, if I understood well, should be checked export of Timesheet Activities, if it works and if csv looks well.
--- comment 2024-08-20 Kcarrick: <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> <custom data-type="mention" data-id="id-1">@Vladimir Tomovic</custom> <custom data-type="mention" data-id="id-2">@Damjan Veljkovic</custom> <custom data-type="mention" data-id="id-3">@Fabian Bonjean</custom> Export now works as intended
--- comment 2024-08-20 Fabian Bonjean: This works as intended when manually editing the timesheets and looking at the numbers.   
  
<custom data-type="mention" data-id="id-0">@Damjan Veljkovic</custom> One thing I noticed however, it does not create the clock out/in at midnight on the timesheet activities tab on a work order, and seems to only do it on the timesheet activities tab? 

.

I have moved this to ready for PR. 

‌

<custom data-type="mention" data-id="id-1">@Nebojsa Glavinic</custom> this looks good. 
--- comment 2024-09-16 Vladimir Tomovic: Tested on Prod.


===== SV-2116 [Done] Create 'Shop Billing Efficiency' report (report-four)
## Create a new report - Shop Billing Efficiency

Report is to be location specific

‌

**This report calculates the total hours clocked in a time period (on all work orders, and department jobs) and compares that against total hours invoiced for the same time  period.** 

In order for this report to pull properly from the correct employees, we will need to identify which employees are ‘billable’ and not ‘billable’. This report is to only pull the clocked hours from the ‘billable’ employees. Any employees who are ‘non billable’ would not report to this report. 

‌

* **Add drop down on the ‘New Staff Member’ modal and also the ‘Edit Staff Member’ modal. This is a mandatory field when adding or editing a staff member.** 

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=a529dbf6-0213-4b2a-9a01-71fe499d468a&&collection=&height=861&occurrenceKey=null&width=2044&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=ae44047d-d2e6-424f-8f5f-91dffaa84d50&&collection=&height=873&occurrenceKey=null&width=2072&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
**Report:**

**Title, Filters, Header/Totals and Scrolling:**

* Filter by date: Use the same date sorting component as the other reports.
* Default date to this month (should pull this month to date)
* Lock table headers at the top
* Create totals as noted in the spreadsheet - lock to bottom of page and **bold**

    * Add tool tips with the noted Descriptions to the totals
    
* Scroll within the header and totals

**Data Fields:**

* Create based on screen shot and spread sheet
* There should only be one row on this report, and that is to indicate the totals.

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=451703ba-b7ee-4534-b275-18cc9fe434d3&&collection=&height=504&occurrenceKey=null&width=1653&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
**Calculations for advanced totals:**

* \*Efficiency = Hours invoiced divided by hours clocked \* 100(%)\*

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=5a1b8069-4949-425a-b629-c3f2ec7d7b31&&collection=&height=388&occurrenceKey=null&width=1754&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=a18426ec-f20e-4504-9674-e627c58d750c&&collection=&height=null&occurrenceKey=null&width=null&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)‌
--- comment 2024-02-29 Milan Zivanovic: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> what should be by default for a staff, billable or not?

Should we maybe better have checkbox for that instead of dropdown? Or it is possible to have some other types in future (so I can know what constraints to set for this property, is it true/false or can have multiple types)?

Not sure I understand this:

> * There should only be one row on this report, and that is to indicate the totals.
> 

So for any date range we select it will be just one row as a result, all staff combined for whole period selected? We have two rows in total always, headers and totals?

> * Scroll within the header and totals
> 

What to scroll if there is just a single totals row?
--- comment 2024-03-01 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> there should be no default, the user should need to select it. 

‌

Only 2 selections available, billable, and non billable, a checkbox would work also, yes. In that case it would be defaulted to unchecked. 

‌

2 rows would be fine then, with the headers. (Yes, all staff combined for the period. We might split it out in the future, but for now we can combine)

‌

No need to scroll. That can be removed. 
--- comment 2024-03-04 Milan Zivanovic: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> 

While fetching data for this one, I am thinking how we can know what is the exact number of invoiced hours for selected period?

In other reports we were fetching ie all invoices that have created date in selected period, then we can show all hours or $ that are related to that specific invoice. So invoice was created on 1st Feb, but all invoiced and worked hours where happening in past and we don’t care exactly when, as we don’t filter those data.

For this one, similar to **Timesheet Activities**, we can calculate clocked in hours for exact day, ie it could happen that one tech started working 1st Feb 23:00:00 and finished 2nd Feb 01:00:00, so total time of that saved timesheet is 2 hours but if only 2nd Feb is selected we should show 1h, as it worked only 1h that day and 1h previous day.

And that is fine, we have a way to do that, but how we can know how many hours were invoiced for that day, as invoiced hours are per line (or whole invoice but it is calculated based on wo lines estimates) and we cannot break that into days?
--- comment 2024-03-04 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> yes, hours can be split over 2 days if the time punch goes to the next day. In your example, it would be 1hr on each day.

---

To calculate how many hours were invoiced for that day, can we not just take the total amount of hours that were invoiced in a day? 

Like a work order has a total of 24 ‘estimated’ hours on it, and the work order was ‘invoiced’ then this would be 24 invoiced hours. 

If the work order did not get invoiced, it would not calculate them. If the lines are declined, it also does not calculate them. 
--- comment 2024-03-07 Kcarrick: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> Can you test this for me please? You have a better grasp than I do with this one
--- comment 2024-03-07 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> The Total Clocked hours seems to not be working and stays at 0

‌

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=ff96c1c8-5296-4cb1-bbb7-bf560a51eeec&&collection=&height=null&occurrenceKey=null&width=null&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
‌

The Total invoiced hours is good, and seems to work with the hours that have been invoiced in the time period. 
--- comment 2024-03-08 Milan Zivanovic: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> ready for testing

btw just to be on the same page, department punches are calc for all locations, and as we said before if invoice is not created for selected period we will have 0 invoiced hours but will have clocked hours (if ofc there are clocked hours for that period)

* let me know about tooltips, not sure if that is what you meant or you would like to be changed (also I put no desc for efficiency, should we add that formula maybe?)
* I’ve put the link below the Efficiency in left side menu of the reports page, let me know if we should move it anywhere else


--- comment 2024-03-11 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> I tried this again and it seems to still not log my time? I clocked into S-198, and the clocked time is not reflecting on the report. 

‌

The invoiced time is working fine, but not the 'Total Clocked Hours” 
--- comment 2024-03-11 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> Here you can see it not working for me. This is on staging. 

‌

* Here you can see 0.54 hours at 9:03am.

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=f778c9dc-5f87-41b0-9796-c6ce6ff8d707&&collection=&height=1434&occurrenceKey=null&width=2782&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
* Then I clocked into work order S-3-198 on staging. I was clocked in for 9 minutes (0.15hr), until 9:13am. Here is the time sheet entry 

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=0fac5a41-d587-4c40-810c-78b658f329c0&&collection=&height=1434&occurrenceKey=null&width=2752&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

‌

* I check the billing efficiency report and it still at 0.54. The Total Clocked Hours did not change. 

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=75fb5dc6-4755-4b2b-9400-3cfc70cbb54e&&collection=&height=1410&occurrenceKey=null&width=2707&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)


--- comment 2024-03-11 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> I also tested the department time and the department time also did not add to the ‘Total Clocked Hours’, which is should. 

I clocked 1.36hrs into the Shop Cleanup Department, and the report still shows the same 0.54 hours. 

Here is the department [timesheet entry ](https://app.staging.shopview.com/reports/punch-clock-activities)

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=e700f8aa-c284-4d79-9215-72a2d7b9b5f5&&collection=&height=1441&occurrenceKey=null&width=2790&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

--- comment 2024-03-12 Milan Zivanovic: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> You didn’t set that staff member as billable?

Btw now it just checks if staff is billable to know if should count hours for selected period, but wouldn’t work if ie staff was billable during Jan, and then switched to non billable, after that, it wont count staff’s hours if Jan is selected. Should we care about that and have billable clocked hours along with staff?
--- comment 2024-03-12 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> Oh yeah. I missed that <custom data-type="emoji" data-id="id-1">:zany_face:</custom> 

It is working, now that I switch it. 

‌

I see what you are saying with switching from billable to non billable.

‌

It should change from counting the hours at the time of switching it. So in the scenario you describe, it should still count the January hours as billable, but not the hours going forward. 

‌

Same thing the other way around. If they are not billable in january, and in Feb they switch to billable, their January hours should not show up, since they just switched to billable in February.
--- comment 2024-03-12 Milan Zivanovic: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> yeah, so I would do changes here and have billable property for clocked hours that are actually set as billable if tech at that time is marked as billable.

So later whenever we query clocked hours, it will check if those ours were billable at that moment, not that staff is marked as billable now.
--- comment 2024-03-12 Milan Zivanovic: That would mean that we would have clocked hours in that stats only from a day we release this and start changing staff to billable. No historic clocked hours will ever show up, unless we manually update some
--- comment 2024-03-12 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> 

> yeah, so I would do changes here and have billable property for clocked hours that are actually set as billable if tech at that time is marked as billable.
>
> So later whenever we query clocked hours, it will check if those ours were billable at that moment, not that staff is marked as billable now.

Yes, that makes sense. 

> That would mean that we would have clocked hours in that stats only from a day we release this and start changing staff to billable. No historic clocked hours will ever show up, unless we manually update some

Correct, only for hours going forward. We do not need to update the past on this one. We can just work going forwards. 

‌

If this one can be part of tomorrows release, that would be awesome too. 
--- comment 2024-03-12 Milan Zivanovic: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> fixed this one. Let me know if it is ready for prod


===== SV-2071 [Done] "Payroll Timesheet" Export Report (export-step 10)
**The report should be titled “Payroll Timesheet”**

Report dates will be driven by the timeclock punches during that period, exported to CSV. 

Any employee who has time punched during the selected time period will be reported. Employees should be by location, the user must switch locations if they wish to export timesheets for another location

* **Employee name**

    * Please have the report group all dates within the employee
    
* **Date**

    * Each date is on its own line please
    
* **Hours**

    * Roll up all time within that date from 12:00:00am - 11:59:59pm, no matter how many punches. Including WO time and department time
    
* **Total**

    * Are we able to have ShopView total up all the hours?
    
* **Headers and lines to help with readability**

CSV template with examples

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=06cf8a41-b717-4a2a-b9d2-e878053c08df&&collection=&height=455&occurrenceKey=null&width=493&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

--- comment 2023-11-29 Fabian Bonjean: [Engineering](https://lakesidernd.atlassian.net/jira/people/team/68ab9485-25de-406a-9fce-ab787db10ab2?ref=jira$&src=issue) (<custom data-type="mention" data-id="id-0">@Dusan Vejin</custom> <custom data-type="mention" data-id="id-1">@FilipJakovljevic</custom> <custom data-type="mention" data-id="id-2">@Nenad Mihajlovic</custom> <custom data-type="mention" data-id="id-3">@Petar Milivojević</custom> <custom data-type="mention" data-id="id-4">@Sasa Stojkovic</custom>) <custom data-type="mention" data-id="id-5">@Milan Zivanovic</custom>   
Can we prioritize this ticket to the top for tomorrow somehow? 

That would be excellent if we could make that happen. 

**If it is not ready for Friday, would we still have ability to see history from before the report was ready?** 
--- comment 2023-11-30 Petar Milivojević: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> will do.
--- comment 2023-11-30 Petar Milivojević: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> <custom data-type="mention" data-id="id-1">@Kcarrick</custom> This is now available on staging. Feel free to test it. One warning i have rounded hours on 2 decimals and there are lot of staging data that only have few seconds so it may appear as 0.00 in export. I highly doubt that in real situations this will be issue.
--- comment 2023-12-06 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Kcarrick</custom> Can you test this. It seems to work good and exports into excel how we intended it to. 
--- comment 2023-12-06 Kcarrick: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> <custom data-type="mention" data-id="id-1">@Petar Milivojević</custom> This is DEADLY!!!!!! ❤️
--- comment 2024-03-25 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Kcarrick</custom> Let’s revisit this one. It seems to not be working at all. 
--- comment 2024-03-25 Kcarrick: Conversation in slack. Tickets have been created to fix it. Will test further


===== SV-2030 [Done] *First report* Enhancements "Punch Clock Activities" Report
Enhancements to the Punch Clock Activities report and some additional features. Then start logging data please.

**Please add the capability to export to CSV**

Each row, indicates one activity with a punch in and a punch out time.

**Filters and Sorting**

* Use the same reusable date filter component as the other reports. 
* Keep filter by employee
* Allow columns to be sorted

**Columns, functions and hyperlinks**

* **~~Shop~~** - Remove the current column. This report should only pull data from the location the user is currently working in. 
* **Date** - Break out date. One date per line. If the user works past 11:59:59pm have ShopView automatically **log them out** and **right back in** at 12:00:00am, starting a new day and new punch clock activity.
* **Employee** - First and Last name
* **Work Order** - please create a column that has the WO for each punch. Make the WO number a hyperlink, have it be on hover, turn the link blue, and change the cursor to the hand. Clicking the link should take you to the work order. 
* **Clock Activity** - Display what the user clocked into. 

    * If they clocked into a line, display the “what are you doing”. 
    * If they clocked into a department show the department. 
    
* **Clock In** - time in
* **Clock Out** - Time out (as they are clocking “in” to the next job.
* **Hours** - total minutes/hours worked on that line in the format 6.33  (Do not use hours/minutes here. Please use hours, followed by 2 decimal places. Each .1 is 6 minutes. 
* **Modified by** - the user who did modifications, if any
* **Modified Date/Time** - Display only the most recent modification. 
* **Comment** - only show the department punch “stories”. Have this truncated and show on hover 

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=e5242c22-6a4e-4157-ae91-56754a5d5e06&&collection=&height=673&occurrenceKey=null&width=1918&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

--- comment 2024-02-20 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Kcarrick</custom> I am still not understanding. Your initial comments says time punches from different organizations. The one you are showing is within the same organization, just different locations? 

‌
--- comment 2024-02-20 Kcarrick: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> my apologies, you are correct. Locations, not organizations
--- comment 2024-02-20 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> see below. It is showing punches from the other locations, not organizations. 
--- comment 2024-02-20 Kcarrick: <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> <custom data-type="mention" data-id="id-1">@Fabian Bonjean</custom> Lord help me, my brain just clicked in.

It’s pulling into FRC organization as well.

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=ed79129c-9821-41c6-9660-339aa0758868&&collection=&height=740&occurrenceKey=null&width=1691&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

--- comment 2024-02-21 Milan Zivanovic: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> <custom data-type="mention" data-id="id-1">@Kcarrick</custom> 

From what I can see, data looks good, which is good thing, just how data is fetched is written “weird”.

So implemented logic pulls all timesheets WHERE:

* (workplace (**location**), the one that user selected on page **equals** timesheet->wo->**workplace** **OR** timesheet->wo->**workplace** doesn’t exist)

**AND**

* (**organization**, the one that user is logged into **equals** timesheet->wo->**organization** **OR** timesheet->wo->**organization** doesn’t exist)

Above means that all timesheets done as department clock ins, will be visible everywhere (all prod orgs and locations), which is the case in your examples, those are all department timesheets that are shared.

I would need info how we want this to work, as departments are not related to location but they are to organization, is it fine to show them in all locations of that organization or we need to have a link between department and location?

It seems that WO timesheets are good and cannot be seen outside of org or location where they where created.

Like the other reports this one is in very similar state (code wise) even though this one shouldn’t be complex at all, it is confusing… there is some comment also that I totally don’t understand, and comments should be there to explain something, not to create more questions (I believe there is no person here that could know what this means) <custom data-type="emoji" data-id="id-2">:smile:</custom> :

> `@TODO WHEN WE IMPLEMENT MORE FUNCTIONALITY THIS NEEDS TO BE MADE`

We have also “fake” split of record that starts one day and finishes another (it is also not checked if that one lasts for more than a day and should be eventually split into more than two or whatever else, and also both of them are returned after split, so you actually can receive record that doesn’t belong to selected date range and also doesn’t exist as entity). So we also need to agree on this as well, do we want for now to show all overlapping records without any split? If any part of the timesheet overlaps with selected date range, show it in results, so if we select 10th Jan - 15th Jan, or 15th Jan - 20th Jan, in both cases some record that starts 15th Jan and ends 16th or later will be returned within result. Or if you would like any other logic here, let me know.
--- comment 2024-02-21 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> Any time sheets, should only be available in the organization they are from. (including departments) 

\-The departments do not need to be related to locations, and can be global to all the locations. 

> `@TODO WHEN WE IMPLEMENT MORE FUNCTIONALITY THIS NEEDS TO BE MADE`

I have no idea what the quote means. 

> We have also “fake” split of record that starts one day and finishes another (it is also not checked if that one lasts for more than a day and should be eventually split into more than two or whatever else, and also both of them are returned after split, so you actually can receive record that doesn’t belong to selected date range and also doesn’t exist as entity). So we also need to agree on this as well, do we want for now to show all overlapping records without any split? If any part of the timesheet overlaps with selected date range, show it in results, so if we select 10th Jan - 15th Jan, or 15th Jan - 20th Jan, in both cases some record that starts 15th Jan and ends 16th or later will be returned within result. Or if you would like any other logic here, let me know.

I am not sure what you mean by fake split of record? For now, yes, we can show overlapping time records. The only way for overlapping time records to happen would be for someone to edit a time record…. If someone clocks in from one place to the next, it will clock them out of the previous time record so there should be no overlap.  I am not sure I fully understand your question/ scenario of overlapping time records.
--- comment 2024-02-21 Milan Zivanovic: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> sry, for overlapping I mean date rage you select on report page and actual timesheet durations.

ie if I select yesterday (filter) should fetch all records let’s say Feb 20th 00:00 - 23:59, and we could have timesheets as result (let’s say each of them is different line/technician so they are not overlapping among selves):

```php
Feb 20th 12:00 - Feb 20th 13:00 // this is regular records that starts and ends the same day and inside requested date range
Feb 20th 14:00 - Feb 20th 16:00 // this is regular records that starts and ends the same day and inside requested date range
Feb 19th 23:00 - Feb 20th 02:00 // this one starts day before but finishes the next day that we selected to see records for
Feb 20th 23:00 - Feb 21th 02:00 // this one starts on that day but ends day after date range we have selected
Feb 19th 23:00 - Feb 21th 02:00 // this one starts before date range we have selected and ends day after, but lasts during time range we selected to see records for
```

So my question is, should we show all of these above when someone selects "Yesterday“, or picking custom date (`Feb 20th - Feb 21th`)?
--- comment 2024-02-21 Milan Zivanovic: So ie in case we show this one: `Feb 19th 23:00 - Feb 21th 02:00`

You could see date for the row: `Feb 19` and you know you selected to receive data for `Feb 20th - Feb 21th` and it could look weird, but again you will see that it lasts during/overlaps with date range you actually picked.
--- comment 2024-02-21 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> I see. The overlapping date should show only the timesheet records on that day only, so if it goes to the next day, it should not show. 

It should indicate though that the timesheet is not ended, and it is overlapping. 
--- comment 2024-02-22 Milan Zivanovic: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> <custom data-type="mention" data-id="id-1">@Kcarrick</custom> there is also some rule here where description (comment) is shown only if clocked in as department, in other case nothing is shown.

Does that make sense or we should show it in any case?
--- comment 2024-02-22 Milan Zivanovic: > One date per line

How should we see in reports if technician has more punches during a day?

One tech can work on multiple lines; each line would indicate what the tech worked on, cannot stay in one row…

It looks like one clock in is one row, so it can be that we have same date in multiple rows?
--- comment 2024-02-22 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> yes, comment only shows for department clock in. 

Yes, one clock is one row. multiple rows for same day since multiple lines can be clocked in on the same day,like you said. 

‌
--- comment 2024-02-26 Milan Zivanovic: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> ready for testing

I’ve made it like initially said one day, one row, so it is broken by day if it passes 11:59PM. I’ve also made a space for improvement, we could mark somehow those rows to say that clock-in or clock-out are out of the selected range so they are not shown.

Let me know how it looks and if you would like any improvements.
--- comment 2024-02-26 Kcarrick: <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> Sorry, this one is a beast. Please see below and let me know if you’d like to have a call or video. Just two more

**Filters and Sorting**

* Create an option to filter by date, (custom, today, yesterday, this week, last week, etc etc) **Custom is NOT done, others are**
* ![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=fbfc1b19-3456-4db4-aa0c-95b09de96fe5&&collection=&height=914&occurrenceKey=null&width=1906&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
* **Hours** - total minutes/hours worked on that line in the format 6.33 (Do not use hours/minutes here. Please use hours, followed by 2 decimal places. Each .1 is 6 minutes. **This is done on report but not on the timesheets in WO**
* ![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=7e10b14d-686b-498b-aa41-371415ea3156&&collection=&height=505&occurrenceKey=null&width=1887&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=473fa9e8-14c9-4d95-aa8a-0265290e789a&&collection=&height=573&occurrenceKey=null&width=1901&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

    



<custom data-type="mention" data-id="id-1">@Fabian Bonjean</custom> Do you want me to make another ticket for this one? We will need the ability to edit department time. _ADDITIONAL: I have no way to edit department time, need to add the little edit button on the far right please._
--- comment 2024-02-26 Kcarrick: <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> My apologies, I see Custom is at the bottom. Can we always have that on the top, we have that is lots of places throughout so we’ll keep it the same
--- comment 2024-02-27 Milan Zivanovic: <custom data-type="mention" data-id="id-0">@Kcarrick</custom> 

> **This is done on report but not on the timesheets in WO**

Hey, expected this to be worked on outside of this ticket, as it is not the same scope, but ok, I can do that within this one, should be quick fix.

> _ADDITIONAL: I have no way to edit department time, need to add the little edit button on the far right please._

Would need a bit of help with department timesheets, how that supposed to work, who should have access to it etc. I know nothing about it. I understand that is time tracking of work that is outside of the work for customers, but inside of the organization, cleaning, moving stuff etc… But would be nice to get some more info…
--- comment 2024-02-27 Milan Zivanovic: <custom data-type="mention" data-id="id-0">@Kcarrick</custom> wo timesheets hours calc is fixed, will be on staging in \~7min
--- comment 2024-02-27 Kcarrick: <custom data-type="mention" data-id="id-0">@Milan Zivanovic</custom> thank you for adding the WO timesheet portion.

I will create another ticket for editing department times and answer all your questions there.

This looks good, this can go to PR
--- comment 2024-02-28 Kcarrick: <custom data-type="mention" data-id="id-0">@Fabian Bonjean</custom> This was originally called Punch Clock Activities and the header still says that however, the left navigation pane calls it Timesheet Activities. which one do you want and I will create another ticket to be the same.

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=d6a8da4a-a6ac-44f6-a77d-5f8700a87006&&collection=&height=291&occurrenceKey=null&width=547&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

--- comment 2024-02-28 Fabian Bonjean: <custom data-type="mention" data-id="id-0">@Kcarrick</custom> call it Timesheet Activities
