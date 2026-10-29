<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
SUMMARY: Reports - Technician Utilization lists a technician who clocked only a few seconds (Dashboard table too)
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-8595 ([Reports Suite][B2] Technician Utilization (TU) report) · relates to SV-9575 (Dashboard v1 - Story 3)
PICTURES: pictures/P1-3-1-dashboard-technician-utilization.png · pictures/P1-3-2-technician-utilization-report.png
BASIS: Chris Ward's answer to question 10 (28 Oct 2026): "Leave them off the report. Under 0.01 hours counts as no time. S2-R7 gets updated."
RE-CHECKED: 29 Oct 2026 00:38 UTC (= 29 Oct, 5:38 AM in Karachi), staging v26.43.2-f8698cb, Staging Heavy Duty - 9919; session, browser, the app's own time-zone setting and the test computer all on Asia/Karachi (the Dashboard asked for Oct 1 – Oct 29, Karachi's This Month).
NOTE FOR THE QA LEAD: this changes a ROW on the Dashboard table, not a figure — the headline % and the hours are unaffected.
-->

## What is wrong

A technician whose only clocks are a few seconds long is still listed on **Technician Utilization**, with **0.00** hours and no Utilization (shown as "—" on the report and "n/a" on the Dashboard).

Under 0.01 hours (36 seconds) counts as no time, so the technician should not be listed. This happens when someone taps **Start** and **Stop** straight away.

## Where this shows on the Dashboard

- **Technician Utilization tile → View details:** the table lists the technician with 0.00 / 0.00 / 0.00 / n/a.
- The headline % and "… WO Hrs / … Clocked" are **not** affected. Only the extra row appears.
- The **Technician Utilization** report (Reports → Technician Utilization) shows the same row.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **Staging Heavy Duty - 9919**.
3. Click **Dashboard**.
4. On the **Technician Utilization** tile, the date reads **This Month**. Click **View details**.
   - From 1 November 2026, pick **Oct 1, 2026** to **Oct 31, 2026** first.
5. In the table, click the **Total Hours** heading so the lowest hours come first.
6. Find **QA Technician**. Their only clock this month was on work order **S2-38042**, line "E2E test labor line", on 22 Oct 2026, and it lasted a few seconds.
7. Optional: open **Reports → Technician Utilization** with **Date: This month**, and sort by **Total Hours**. The same row is there.

**Actual:** QA Technician is listed: **0.00** WO Hours, **0.00** Internal Hours, **0.00** Total Hours, Utilization **n/a** (Dashboard) or **—** (report).

**Expected:** QA Technician is **not listed**, because a clock under 0.01 hours counts as no time.

---

**Source:** Chris Ward, answer to question 10 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> Leave them off the report. Under 0.01 hours counts as no time. S2-R7 gets updated.

## Screenshots

**1.** Dashboard, Heavy Duty, Technician Utilization, This Month, sorted by Total Hours: QA Technician listed with 0.00 hours and n/a.

**2.** Technician Utilization report, This month: the same row, 0.00 hours and "—".

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 29 Oct 2026 (Karachi time), Admin.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (Asia/Karachi).
- Also seen for Nebojsa Custom-Admin (four clocks of a few seconds each on 16–17 Sep 2026) with This Year selected.
- Not checked on Production or on a QA branch.
