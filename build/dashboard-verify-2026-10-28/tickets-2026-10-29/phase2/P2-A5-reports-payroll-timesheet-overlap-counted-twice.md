<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
EDITED 29 Oct 2026 after the filter recheck: export date range widened to Custom 01/01 of this year to today (Today / September dropped); overlap example re-figured to about 1.08 (65 minutes); picture 3 replaced; "Where it was seen" = v26.43.3-8ad4001, 29 Oct 2026.
SUMMARY: Reports - Payroll Timesheet export counts overlapping timesheets twice, so a day can show more than 24 hours
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-2071 ("Payroll Timesheet" Export Report (export-step 10))
PICTURES: pictures/P2-A5-1-timesheet-two-overlapping.png · pictures/P2-A5-2-payroll-export-today.png · ../filter-recheck/evidence/f1/A5-held-replacement.png (replaces P2-A5-3)
BASIS: Chris Ward's answer to question 39 (28 Oct 2026): "No. Overlapping time counts once, so a day can't go over 24. Defect."
RE-CHECKED: 29 Oct 2026, 00:45–00:47 UTC (= 28 Oct, 8:45 PM in Toronto; 29 Oct, 5:46 AM in Karachi), staging v26.43.2-f8698cb, DVI Test and Staging Heavy Duty - 9919; for each location the session, browser (and the app's own time-zone setting) and test computer were on that location's zone (America/Toronto, Asia/Karachi).
TEST DATA: customer "ZZAUTOTEST P2A Labor", work order S1-38220, line "Test DVI Line"; two Admin Shopview timesheets on 28 Oct 2026, both made on screen (7:39–8:34 PM by New, 8:08–8:41 PM by a running timesheet that was clocked out).
DUPLICATE CHECK: none covers the export total. Related, not the same: SV-9723 (Open, Timesheet Activities shows duplicated/overlapping entries), SV-10702 (Blocked, export puts a multi-day punch on the wrong days), SV-10695 (Done, cancelling the overlap warning saved the entry — fixed: re-checked, cancelling now saves nothing).
NOTE FOR THE QA LEAD: the figures in question 39 (Admin Shopview 40.70 h on 10 Sep, 32.34 h on 17 Sep) do NOT reproduce with the zones matched: the export now shows 7.70 h on 10 Sep (the same as Timesheet Activities) and 12.10 h on 17 Sep (9.99 h worked that day plus 2.11 h that belong to 16 Sep but are added to 17 Sep — a different problem, asked about in the rewritten question 39(b)). The earlier figures were read with an unmatched time zone. Haley Brown's 6 Sep (28.50 h) does reproduce and is used below.
-->

## What is wrong

When one person has two timesheets that overlap in time, the **Payroll Timesheet** export (Reports → Export Reports) adds both in full. The same minutes are paid twice.

Overlapping time should count once. A day can therefore never be more than 24 hours.

Example made on screen (DVI Test, 28 Oct 2026, Admin Shopview, work order S1-38220):

- Timesheet A: 7:39 PM to 8:34 PM = 0.92 hours.
- Timesheet B: 8:08 PM to 8:41 PM = 0.55 hours.
- They overlap from 8:08 PM to 8:34 PM. Together they cover 7:39 PM to 8:41 PM = 62 minutes (**1.03** hours).
- Admin Shopview also had three 1-minute timesheets earlier that day (3 minutes; the file shows each as 0.02 hours, so 0.06).
- **Actual** Total Hours for 28 Oct: 0.92 + 0.55 + 0.06 = **1.53**.
- **Expected:** 62 + 3 = 65 minutes = about **1.08** hours.

The same happens on existing data at Heavy Duty: **Haley Brown** shows **28.50** Total Hours on **6 Sep 2026**. Her 15 timesheets that day all fall between 7:00 PM and 9:00 PM, so the day should show **2.00**.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **DVI Test**.
3. Use a work order with an approved line, for example a new work order for a **ZZAUTOTEST** customer with one labor line.
4. Click **Reports**, then **Timesheet Activities**, then **New**.
5. Pick **Select Staff:** Admin Shopview, your **Work Order** and its **Line**. **Start:** today, now minus 30 minutes. Leave **End** empty. Click **Create**. (This is a running timesheet.)
6. Click **New** again. Pick the same person, work order and line. **Start:** now minus 60 minutes. **End:** now minus 5 minutes. Click **Create**. No overlap warning appears, and the entry is saved.
7. Stop the running timesheet: click the timer at the top of the screen, click **Stop** on the line, then **Clock Out**.
8. Set **Date Range: Today**. The two timesheets for the same person overlap.
9. Click **Export Reports** in the left menu.
10. **Report Name:** Payroll Timesheet. **Date range:** Custom, from 01/01 of this year to today. Click **Export**.
11. Open the downloaded file **payroll_timesheet.csv** and find the person's row for today.

Existing example, no set-up needed: switch to **Staging Heavy Duty - 9919**, **Export Reports**, **Payroll Timesheet**, Date range **Custom**, 01/01/2026 to today, and find **Haley Brown**, **2026-09-06**.

**Actual:** the person's day adds every timesheet in full: 1.53 in our example; 28.50 for Haley Brown on 6 Sep.

**Expected:** overlapping time counts once: about 1.08 in our example; 2.00 for Haley Brown on 6 Sep. No day is ever more than 24 hours.

---

**Source:** Chris Ward, answer to question 39 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> No. Overlapping time counts once, so a day can't go over 24. Defect.

## Screenshots

**1.** Timesheet Activities, DVI Test, Today: Admin Shopview's two timesheets on S1-38220 overlap from 8:08 PM to 8:34 PM.

**2.** The downloaded payroll_timesheet.csv (DVI Test, Today): Admin Shopview 1.53 Total Hours on 2026-10-28.

**3.** The downloaded payroll_timesheet.csv (Heavy Duty, Custom 01/01/2026 to 10/29/2026): Haley Brown 28.50 hours on 6 Sep and 24.50 on 2 Sep.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.3-8ad4001, 29 Oct 2026 (Karachi time for Staging Heavy Duty - 9919; Toronto time for DVI Test), Admin.
- Browser, the app's own time-zone setting and the test computer set to each location's time zone (Asia/Karachi, America/Toronto).
- Heavy Duty, September 2026: 3 employee-days are over 24 hours (Haley Brown 2 Sep 24.50 and 6 Sep 28.50; Admin Shopview 19 Sep 24.33). Admin Shopview's 19 Sep has a different cause: the part of a clock that runs past midnight is added to the next day. That is not covered by this ticket; it is asked about separately in the rewritten question 39(b).
- Not checked on Production or on a QA branch.
