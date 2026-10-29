<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
EDITED 29 Oct 2026 after the filter recheck: example changed from QA Technician (only an example while the report Location stays on Heavy Duty) to Nebojsa Custom-Admin with Last 12 Months and All locations; picture 1 replaced.
SUMMARY: Reports - Technician Utilization lists a technician who clocked only a few seconds (Dashboard table too)
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-8595 ([Reports Suite][B2] Technician Utilization (TU) report) · relates to SV-9575 (Dashboard v1 - Story 3)
PICTURES: ../filter-recheck/evidence/f1/SV-11933-replacement.png · P1-3-2-technician-utilization-report.png
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
4. On the **Technician Utilization** tile, click the date button, pick **Last 12 Months**, then click **Apply**. Click **View details**.
5. In the table, click the **Total Hours** heading so the lowest hours come first.
6. Find **Nebojsa Custom-Admin**. Their only clocks in the last 12 months are four clocks of a few seconds each, on work orders **S2-33086** (16 Sep 2026) and **S2-33118** (17 Sep 2026).
7. Optional: open **Reports → Technician Utilization**, set **Date: Last 12 months** and **Location: All locations**, and sort by **Total Hours**. The same row is there.

**Actual:** Nebojsa Custom-Admin is listed: **0.00** WO Hours, **0.00** Internal Hours, **0.00** Total Hours, Utilization **n/a** (Dashboard) or **—** (report).

**Expected:** Nebojsa Custom-Admin is **not listed**, because a clock under 0.01 hours counts as no time.

---

**Source:** Chris Ward, answer to question 10 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> Leave them off the report. Under 0.01 hours counts as no time. S2-R7 gets updated.

## Screenshots

**1.** Dashboard, Heavy Duty, Technician Utilization, Last 12 Months, all technicians, sorted by Total Hours: Nebojsa Custom-Admin listed with 0.00 hours and n/a.

**2.** Technician Utilization report, This month, Location left on Staging Heavy Duty - 9919: QA Technician listed with 0.00 hours and "—" (the case under "Where it was seen").

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 29 Oct 2026 (Karachi time), Admin.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (Asia/Karachi).
- Also seen for QA Technician (one clock of a few seconds on S2-38042, 22 Oct 2026) when the report's Location is left on Staging Heavy Duty - 9919.
- Not checked on Production or on a QA branch.
