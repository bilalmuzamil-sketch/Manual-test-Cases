<!-- FILED 29 Oct 2026 as SV-11939 (https://shopview.atlassian.net/browse/SV-11939), parent SV-11936 (temporary parking epic), on the QA lead's go-ahead. Exact filed text: ../filed/html/P2-A4-SV-11939.html
EDITED 29 Oct 2026 after the filter recheck: Date Range left on This month on both screens; example re-seeded 29 Oct 7:12 AM: 8.52 + 0.56 = about 9.08 (Timesheet Activities 9.09); both pictures re-taken; Technician Utilization bullet dropped; Where it was seen = v26.43.3-8ad4001.
SUMMARY: Reports - Shop Efficiency leaves a running timesheet out of Total Clocked Hours
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-2116 (Create 'Shop Billing Efficiency' report (report-four)) · relates to SV-11688 (Technician Utilization counts open (never clocked-out) timesheets as 24 h/day — the ruling that a running shift under 24 hours counts)
PICTURES: ../filter-recheck/evidence/f1/SV-11939-pic1-replacement.png · ../filter-recheck/evidence/f1/SV-11939-replacement.png
BASIS: Chris Ward's answer to question 12 (28 Oct 2026): "Yes, same rule as SV-11688: a running shift under 24 hours counts. Defect."
RE-CHECKED: 29 Oct 2026, 00:30–00:34 UTC (= 28 Oct, 8:30–8:34 PM in Toronto), staging v26.43.2-f8698cb, DVI Test; session, browser and test computer all on America/Toronto. NOTE: these two pictures were taken BEFORE the app's own time-zone setting was found (Rule 99, fourth place). Both pages ask the server for "Today" by name and showed 28 Oct Toronto rows while UTC was already 29 Oct, so the window was Toronto's; a re-take needs a new running shift — do it on the go-ahead if wanted.
TEST DATA: customer "ZZAUTOTEST P2A Labor", work order S1-38220, line "Test DVI Line". The running timesheet (Admin Shopview, started 7:49 PM) was made on screen and deleted after the pictures.
DUPLICATE CHECK: none found (searched "Shop Efficiency", "Shop Billing Efficiency", last 365 days).
-->

## What is wrong

**Shop Efficiency** leaves out a timesheet that is still running (clocked in, not yet clocked out). Its **Total Clocked Hours** only counts finished timesheets.

A running shift under 24 hours should count, up to now. **Timesheet Activities** and **Technician Utilization** already count it, so the reports disagree.

Example (DVI Test, This month, 29 Oct 2026):

- Finished timesheets this month: **8.52** hours.
- Admin Shopview's running timesheet on S1-38220, started 7:12 AM: **0.56** hours at the moment of the pictures.
- **Actual** Total Clocked Hours: **8.52**.
- **Expected:** 8.52 + 0.56 = about **9.08** (it grows while the timesheet runs). Timesheet Activities, same range, shows 9.09; the 0.01 is rounding of single rows.

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
9. Leave **Date Range** on **This month**. Note **Totals → Total Hours** (it includes the running time).
10. Click **Shop Efficiency** in the left menu and leave **Date Range** on **This month**.
11. Look at **Total Clocked Hours**.
12. Afterwards, stop the timesheet (the timer at the top → **Stop** → **Clock Out**) or delete it.

**Actual:** Total Clocked Hours leaves out the running timesheet (8.52 in our example).

**Expected:** Total Clocked Hours includes the running timesheet up to now (about 9.08 in our example), the same as Timesheet Activities.

---

**Source:** Chris Ward, answer to question 12 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> Yes, same rule as SV-11688: a running shift under 24 hours counts. Defect.

## Screenshots

**1.** Timesheet Activities, DVI Test, This month: Admin Shopview's timesheet on S1-38220 is Active (0.56 hours so far); Totals 9.09 = 8.53 finished + 0.56 running.

**2.** Shop Efficiency, DVI Test, This month, while the same timesheet runs (timer at the top, 0.56 hours so far): Total Clocked Hours 8.52; the running time is missing.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.3-8ad4001, 29 Oct 2026, about 7:45 AM (Toronto time), Admin.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto).
- Not checked on Production or on a QA branch.
