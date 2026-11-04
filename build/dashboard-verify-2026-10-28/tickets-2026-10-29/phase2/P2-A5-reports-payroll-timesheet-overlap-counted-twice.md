<!-- FILED 4 Nov 2026 19:14 UTC as SV-12201 (https://shopview.atlassian.net/browse/SV-12201), parent SV-11839, on the QA lead's go-ahead (4 Nov: "If it's a big create ticket and attach to the same epic"). Picture 3 replaced by P2-A5-3-v3 (Haley Brown only; v2 also showed the separate before-midnight rows). The "P2-A6" reference was reworded for the reader. Filed text: tickets-2026-11-04/filed/SV-12201.html -->
<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
RESULT: REPRODUCED — 4 Nov 2026, 17:23–17:28 UTC, staging v26.45.0-440aa25 (app meta "app-version"). DVI Test (Pacific/Fiji, 5 Nov 5:23–5:28 AM local): Admin Shopview's two overlapping timesheets on 29 Oct 2026 (11:39 AM–12:34 PM and 12:08–12:41 PM) give 1.53 Total Hours in the downloaded file; counting the overlap once gives 65 minutes, about 1.08. Staging Heavy Duty - 9919 (Asia/Karachi, 4 Nov 10:24–10:25 PM local): Haley Brown 28.50 on 2026-09-06; her 15 timesheets all fall between 7:00 and 9:00 PM (2.00). Server read the same minutes gives the same figures (sum 1.52/1.53 and 28.50; overlap-once 1.08 and 2.00).
UPDATED 4 Nov 2026 after Chris Ward's corrected answer to question 39(a): Source replaced by the verbatim answer; pictures re-taken. NOTE: DVI Test's zone on the server changed from America/Toronto to Pacific/Fiji around 3 Nov, so the same timesheets that read "28 Oct, 7:39–8:41 PM" in Toronto now read "29 Oct, 11:39 AM–12:41 PM". Nothing about the timesheets changed.
SUMMARY: Reports - Payroll Timesheet export counts overlapping timesheets twice, so a day can show more than 24 hours
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-2071 ("Payroll Timesheet" Export Report (export-step 10))
PICTURES: pictures/P2-A5-1-v2-timesheet-two-overlapping-fiji-2026-11-04.png · pictures/P2-A5-2-v2-payroll-export-29-oct-1-53-2026-11-04.png · pictures/P2-A5-3-v2-payroll-export-haley-brown-28-50-2026-11-04.png (replace the 29 Oct pictures)
BASIS: Chris Ward, "Dashboard and Reports – questions for Chris Ward (28 Oct 2026)", Section 3, question 39 (corrected) (a): "Yes. Overlapping time counts once ... Defect."
TEST DATA: customer "ZZAUTOTEST P2A Labor", work order S1-38220, line "Test DVI Line"; two Admin Shopview timesheets, both made on screen on 28 Oct 2026 (UTC 23:39 and 00:08).
ZONES (Rule 99): zone read live from GET /api/staff/my-workplaces (DVI Test = Pacific/Fiji, Heavy Duty = Asia/Karachi); for each location the session change-location workplace_timezone, browser timezoneId, process TZ and the app's localStorage 'timezone' = that zone, localStorage 'location' = that workplace; header showed the location at the start and end of each run. Evidence: rerun-2026-11-04/results/sec3/screen-payDVI.json, screen-taDVI.json, screen-payHD.json, server-pay-DVI-AdminShopview-2026-10-28-2026-10-30.json, server-pay-HD-HaleyBrown-2026-09-06-2026-09-06.json.
DUPLICATE CHECK (4 Nov 2026, read-only JQL): project = SV AND (summary ~ "Payroll Timesheet" OR summary ~ "payroll export" OR (text ~ "Payroll Timesheet" AND (text ~ "overlap" OR text ~ "midnight"))) ORDER BY created DESC → 21 issues. None covers the export adding overlapping time twice. Related, not the same: SV-10702 (Blocked, multi-day punch dated one day early), SV-10701 (Blocked, daylight-saving days counted as 24 hours), SV-11261 (Blocked, duplicate timesheet entries show the same date and time when editing), SV-9795 (OBSOLETE, duplicate overlapping entries on work orders), SV-3276 (Done, export not matching timesheets, Jan 2025). SV-9723 (Timesheet Activities shows duplicated/overlapping entries; named in the 29 Oct draft, not re-read today) is about a different screen.
-->

## What is wrong

When one person has two timesheets that overlap in time, the **Payroll Timesheet** export (Reports → Export Reports) adds both in full. The same minutes are paid twice.

Overlapping time should count once. A day can therefore never be more than 24 hours.

Example (DVI Test, 29 Oct 2026, Admin Shopview, work order S1-38220):

- Timesheet A: 11:39 AM to 12:34 PM = 0.92 hours.
- Timesheet B: 12:08 PM to 12:41 PM = 0.55 hours.
- They overlap from 12:08 PM to 12:34 PM. Together they cover 11:39 AM to 12:41 PM = 62 minutes (**1.03** hours).
- Admin Shopview also had three 1-minute timesheets earlier that day (7:19, 7:21 and 7:23 AM; the file shows each as 0.02 hours, so 0.06).
- **Actual** Total Hours for 29 Oct: 0.92 + 0.55 + 0.06 = **1.53**.
- **Expected:** 62 + 3 = 65 minutes = about **1.08** hours (Chris Ward's answer, which adds 1.03 + 0.06, says 1.09; the 0.01 is rounding).

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

Ready-made example, no set-up needed: at **DVI Test**, **Timesheet Activities**, **Date Range: Last month** (from 1 December 2026, **Custom**, 10/29/2026 to 10/29/2026), work order **S1-38220**; then the export as in step 10, and find **Admin Shopview**, **2026-10-29**.

Existing example at Heavy Duty: switch to **Staging Heavy Duty - 9919**, **Export Reports**, **Payroll Timesheet**, Date range **Custom**, 01/01/2026 to today, and find **Haley Brown**, **2026-09-06**.

**Actual:** the person's day adds every timesheet in full: 1.53 for Admin Shopview on 29 Oct; 28.50 for Haley Brown on 6 Sep.

**Expected:** overlapping time counts once: about 1.08 for Admin Shopview on 29 Oct; 2.00 for Haley Brown on 6 Sep. No day is ever more than 24 hours.

---

**Source:** Chris Ward, "Dashboard and Reports – questions for Chris Ward (28 Oct 2026)", Section 3, question 39 (corrected) (a). Question: "when one person's timesheets overlap, should the export count the overlapping time once (1.09 hours in the fresh example, 2.00 hours for Haley Brown), so that no day can go over 24 hours?"

> 39 (corrected) (a). Yes. Overlapping time counts once, so a person is never paid twice for the same minutes: 1.09 hours in the fresh example and 2.00 hours for Haley Brown. A day can't go over 24 hours. Defect.

## Screenshots

**1.** Timesheet Activities, DVI Test, Last month: Admin Shopview's two timesheets on S1-38220 on 29 Oct overlap from 12:08 PM to 12:34 PM.

**2.** The downloaded payroll_timesheet.csv (DVI Test, Custom 01/01/2026 to today), Admin Shopview's 29 Oct row: 1.53 Total Hours.

**3.** The downloaded payroll_timesheet.csv (Heavy Duty, Custom 01/01/2026 to 11/04/2026): Haley Brown 28.50 hours on 6 Sep (highlighted).

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.45.0-440aa25, 4 Nov 2026 (5 Nov, 5:23–5:28 AM Fiji time for DVI Test; 4 Nov, 10:24–10:25 PM Karachi time for Staging Heavy Duty - 9919), Admin.
- Session, browser, the app's own time-zone setting and the test computer set to each location's time zone (Pacific/Fiji, Asia/Karachi).
- Heavy Duty, 1 Jan 2026 to 4 Nov 2026: 6 employee-days are over 24 hours (Katherine Collins 15 Aug 35.00 and 25 Aug 42.00; Haley Brown 30 Aug 28.00, 2 Sep 24.50 and 6 Sep 28.50; Admin Shopview 19 Sep 24.33). Admin Shopview's 19 Sep has a different cause (time worked before midnight counted on the next day); it has its own draft (P2-A6).
- Not checked on Production or on a QA branch.
