<!-- FILED 29 Oct 2026 as SV-11939 (https://shopview.atlassian.net/browse/SV-11939), parent SV-11936 (temporary parking epic), on the QA lead's go-ahead. Exact filed text: ../filed/html/P2-A4-SV-11939.html
SUMMARY: Reports - Shop Efficiency leaves a running timesheet out of Total Clocked Hours
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-2116 (Create 'Shop Billing Efficiency' report (report-four)) · relates to SV-11688 (Technician Utilization counts open (never clocked-out) timesheets as 24 h/day — the ruling that a running shift under 24 hours counts)
PICTURES: pictures/P2-A4-1-timesheet-today-running.png · pictures/P2-A4-2-shop-efficiency-today.png
BASIS: Chris Ward's answer to question 12 (28 Oct 2026): "Yes, same rule as SV-11688: a running shift under 24 hours counts. Defect."
RE-CHECKED: 29 Oct 2026, 00:30–00:34 UTC (= 28 Oct, 8:30–8:34 PM in Toronto), staging v26.43.2-f8698cb, DVI Test; session, browser and test computer all on America/Toronto. NOTE: these two pictures were taken BEFORE the app's own time-zone setting was found (Rule 99, fourth place). Both pages ask the server for "Today" by name and showed 28 Oct Toronto rows while UTC was already 29 Oct, so the window was Toronto's; a re-take needs a new running shift — do it on the go-ahead if wanted.
TEST DATA: customer "ZZAUTOTEST P2A Labor", work order S1-38220, line "Test DVI Line". The running timesheet (Admin Shopview, started 7:49 PM) was made on screen and deleted after the pictures.
DUPLICATE CHECK: none found (searched "Shop Efficiency", "Shop Billing Efficiency", last 365 days).
-->

## What is wrong

**Shop Efficiency** leaves out a timesheet that is still running (clocked in, not yet clocked out). Its **Total Clocked Hours** only counts finished timesheets.

A running shift under 24 hours should count, up to now. **Timesheet Activities** and **Technician Utilization** already count it, so the reports disagree.

Example (DVI Test, Today, 28 Oct 2026):

- Finished timesheets today: **3.56** hours.
- Admin Shopview's running timesheet on S1-38220, started 7:49 PM: **0.74** hours at the moment of the picture.
- **Actual** Total Clocked Hours: **3.56**.
- **Expected:** 3.56 + 0.74 = about **4.30** (it grows while the timesheet runs).

Because Total Clocked Hours is too low, **Difference** and **Efficiency** on the same row are wrong too.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **DVI Test**.
3. Use a work order with an approved line, for example a new work order for a **ZZAUTOTEST** customer with one labor line.
4. Click **Reports**, then **Timesheet Activities**, then **New**.
5. **Select Staff:** Admin Shopview (any billable technician works).
6. **Work Order:** your work order. **Line:** its line.
7. **Start:** today, about 30 minutes ago. Leave **End** empty.
8. Click **Create**. The row shows **Active**, and the timer at the top of the screen starts.
9. Set **Date Range: Today**. Note **Totals → Total Hours** (it includes the running time).
10. Click **Shop Efficiency** in the left menu and set **Date Range: Today**.
11. Look at **Total Clocked Hours**.
12. Afterwards, stop the timesheet (the timer at the top → **Stop** → **Clock Out**) or delete it.

**Actual:** Total Clocked Hours leaves out the running timesheet (3.56 in our example).

**Expected:** Total Clocked Hours includes the running timesheet up to now (about 4.30 in our example), the same as Timesheet Activities.

---

**Source:** Chris Ward, answer to question 12 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> Yes, same rule as SV-11688: a running shift under 24 hours counts. Defect.

## Screenshots

**1.** Timesheet Activities, DVI Test, Today: Admin Shopview's timesheet on S1-38220 is Active (0.69 hours so far); Totals 4.25 = 3.56 finished + 0.69 running.

**2.** Shop Efficiency, DVI Test, Today, three minutes later: Total Clocked Hours 3.56; the running time is missing.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026 (Toronto time), Admin.
- Browser and test computer set to the location's time zone (America/Toronto).
- Technician Utilization (This month) counted the same running time: Admin Shopview 0.78 hours, of which 0.72 was the running timesheet.
- Not checked on Production or on a QA branch.
