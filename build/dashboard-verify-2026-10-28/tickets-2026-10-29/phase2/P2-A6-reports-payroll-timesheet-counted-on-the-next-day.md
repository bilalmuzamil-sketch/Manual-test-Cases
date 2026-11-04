<!-- COORDINATOR NOTE 4 Nov 2026 (Rule 86 check of the worker's evidence: rerun-2026-11-04/results/sec3/server-pay-HD-AdminShopview-2026-09-17-2026-09-22.json → 18 Sep 23.67, 19 Sep 24.33, 20 Sep 24.00; matches this draft).
PROBABLE DUPLICATE OF SV-10702 (Blocked) — "Payroll Timesheet export dates each day of a multi-day punch one day early".
- SV-10702's stated cause is a double time-zone conversion of the day slices of a MULTI-DAY punch (PayrollTimesheetExportQueryHandler.php :233).
- The S2-15119 timesheet here is multi-day (Sep 18 11:40 PM to Sep 21 6:06 AM). At Karachi (UTC+5) the same double conversion moves a late-evening slice to the NEXT day. SV-10702 shows the "one day early" direction at a location behind UTC.
- RECOMMENDATION TO THE QA LEAD: do not file this as a new ticket. Add one comment to SV-10702 with this Karachi example and Chris Ward's answer 39 (corrected)(b) as the confirmed expected behaviour (needs the QA lead's go-ahead: Jira write).
- If he prefers a separate ticket, file this draft linked "relates to SV-10702". -->
<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
RESULT: REPRODUCED — 4 Nov 2026, 17:24–17:34 UTC (= 10:24–10:34 PM in Karachi), staging v26.45.0-440aa25 (app meta "app-version"), Staging Heavy Duty - 9919. Timesheet Activities shows Admin Shopview's S2-15119 timesheet (Sep 18, 2026 11:40 PM to Sep 21, 2026 6:06 AM) as 0.33 h on Sep 18 and 24.00 h on Sep 19. The downloaded Payroll Timesheet file shows 2026-09-18 = 23.67 and 2026-09-19 = 24.33: the 20 minutes worked before midnight on 18 Sep are counted on 19 Sep. Server read the same minutes gives the same figures. Second example, same person: a timesheet from Sep 16 9:53 PM to Sep 17 1:19 AM: the file shows 0.01 on 16 Sep and 12.10 on 17 Sep, while Timesheet Activities shows 2.12 and 9.99.
NEW DRAFT 4 Nov 2026, written after Chris Ward's answer to question 39 (corrected) (b).
SUMMARY: Reports - Payroll Timesheet export counts time worked before midnight on the next day
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-2071 ("Payroll Timesheet" Export Report (export-step 10)) · relates to SV-10702 (Payroll Timesheet export dates each day of a multi-day punch one day early; Blocked)
PICTURES: pictures/P2-A6-1-timesheet-activities-18-19-sep-2026-11-04.png · pictures/P2-A6-2-payroll-export-18-sep-23-67-19-sep-24-33-2026-11-04.png
BASIS: Chris Ward, "Dashboard and Reports – questions for Chris Ward (28 Oct 2026)", Section 3, question 39 (corrected) (b): "Yes. Time counts on the day it was worked, in the location's time zone. A timesheet that runs past midnight is split at midnight. Defect."
HOW THIS DIFFERS FROM SV-10702: SV-10702 (seen on production at a location in Mountain time, behind UTC) reports every day of a multi-day punch dated ONE DAY EARLY, with the real last day showing 0.00. Here, at a location AHEAD of UTC (Karachi, UTC+5), the part of a timesheet worked BEFORE midnight is counted on the NEXT day, so that day goes over 24 hours and the first day is short. The direction and the visible symptom differ. Whether both come from the same cause is for the developers to decide; it is not claimed here. Not every timesheet that crosses midnight is affected: Admin Shopview's S2-33043 timesheet (Sep 17 3:22 PM to Sep 18 11:40 PM) is split correctly (8.63 on 17 Sep inside the 12.10, 23.67 on 18 Sep).
ZONES (Rule 99): zone read live from GET /api/staff/my-workplaces (Heavy Duty = Asia/Karachi); session change-location workplace_timezone, browser timezoneId, process TZ and the app's localStorage 'timezone' = Asia/Karachi, localStorage 'location' = Heavy Duty's id; header showed "Staging Heavy Duty - 9919" at the start and end of each run. Evidence: rerun-2026-11-04/results/sec3/screen-payHD.json, screen-taHD.json, server-pay-HD-AdminShopview-2026-09-17-2026-09-22.json, server-pay-HD-AdminShopview-2026-09-15-2026-09-17.json.
DUPLICATE CHECK (4 Nov 2026, read-only JQL): project = SV AND (summary ~ "Payroll Timesheet" OR summary ~ "payroll export" OR (text ~ "Payroll Timesheet" AND (text ~ "overlap" OR text ~ "midnight"))) ORDER BY created DESC → 21 issues. None reports time before midnight moved to the next day. Related, not the same: SV-10702 (Blocked, see above), SV-10701 (Blocked, daylight-saving days counted as 24 hours), SV-3276 (Done, Jan 2025, export not matching timesheets), SV-2662 (Done, 2024, timesheet issue with work orders lasting more than one day).
NOTE FOR THE QA LEAD: Timesheet Activities opened from a link with a Custom range in the address (…?range=custom&startDate=…&endDate=…) shows "No record matches these filters" on this build and sends no list request; the Custom range set with the Date Range button works. Seen while taking picture 1; not investigated further and not part of this ticket.
-->

## What is wrong

When a timesheet runs past midnight, the **Payroll Timesheet** export (Reports → Export Reports) counts the part worked **before** midnight on the **next** day. The day it was worked comes out short, and the next day can go over 24 hours.

Time should count on the day it was worked, in the location's time zone. A timesheet that runs past midnight is split at midnight.

Example (Staging Heavy Duty - 9919, Admin Shopview, work order S2-15119):

- The timesheet starts on **18 Sep 2026 at 11:40 PM** and ends on 21 Sep 2026 at 6:06 AM.
- The part before midnight on 18 Sep is 11:40 PM to midnight = 20 minutes = **0.33** hours. Timesheet Activities shows it on Sep 18.
- Admin Shopview's other timesheet on 18 Sep covers midnight to 11:40 PM = **23.67** hours. So 18 Sep should total 23.67 + 0.33 = **24.00**.
- 19 Sep is worked from midnight to midnight = **24.00** hours.
- **Actual** in the file: **2026-09-18 = 23.67** and **2026-09-19 = 24.33** (24.00 + the 0.33 from 18 Sep).
- **Expected:** **2026-09-18 = 24.00** and **2026-09-19 = 24.00**.

The same person shows it again two days earlier: a timesheet from 16 Sep 9:53 PM to 17 Sep 1:19 AM. Its 2.12 hours before midnight belong to 16 Sep (Timesheet Activities: 16 Sep 2.12, 17 Sep 9.99), but the file shows **16 Sep 0.01** and **17 Sep 12.10** (9.99 + 2.11).

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **Staging Heavy Duty - 9919**.
3. Click **Reports**, then **Timesheet Activities**.
4. Click **Date Range**, choose **Custom**, **From** 09/18/2026, **To** 09/19/2026.
5. Find **Admin Shopview**, work order **S2-15119**, **Diagnose - Engine**: on **Sep 18 2026** it shows Clock In **11:40 PM**, Clock Out **11:59 PM**, **0.33** hours; on **Sep 19 2026** it shows 12:00 AM to 11:59 PM, **24.00** hours.
6. Click **Export Reports** in the left menu.
7. **Report Name:** Payroll Timesheet. **Date range:** Custom, from 01/01/2026 to today. Click **Export**.
8. Open the downloaded file **payroll_timesheet.csv**, find **Admin Shopview**, and read the rows **2026-09-18** and **2026-09-19**.

**Actual:** 2026-09-18 shows **23.67** and 2026-09-19 shows **24.33**. The 0.33 hours worked before midnight on 18 Sep are counted on 19 Sep, and 19 Sep goes over 24 hours.

**Expected:** 2026-09-18 shows **24.00** and 2026-09-19 shows **24.00**: each part of the timesheet counts on the day it was worked, in the location's time zone.

---

**Source:** Chris Ward, "Dashboard and Reports – questions for Chris Ward (28 Oct 2026)", Section 3, question 39 (corrected) (b). Question: "should the part of a timesheet worked before midnight always count on the day it was worked?"

> 39 (corrected) (b). Yes. Time counts on the day it was worked, in the location's time zone. A timesheet that runs past midnight is split at midnight. Defect.

## Screenshots

**1.** Timesheet Activities, Heavy Duty, Custom 09/18/2026 to 09/19/2026: S2-15119 shows 0.33 hours on Sep 18 (11:40 PM–11:59 PM) and 24.00 on Sep 19.

**2.** The downloaded payroll_timesheet.csv (Heavy Duty, Custom 01/01/2026 to 11/04/2026), Admin Shopview 16–20 Sep (the first column was added to name the person): 18 Sep 23.67 and 19 Sep 24.33 highlighted.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.45.0-440aa25, 4 Nov 2026, 10:24–10:34 PM Karachi time, Admin, location Staging Heavy Duty - 9919.
- Session, browser, the app's own time-zone setting and the test computer all set to the location's time zone (Asia/Karachi).
- Not checked on Production, on a QA branch, or at a location behind UTC (the opposite direction is reported in SV-10702).
