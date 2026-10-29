<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
SUMMARY: Reports - Technician Efficiency drops a line's tech time when the clock is under 36 seconds (Dashboard tile too)
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-2115 (Create Technician Efficiency (invoiced) report) · relates to SV-5450 (BE 'Completed' Technician Efficiency Report) · relates to SV-9575 (Dashboard v1 - Story 3)
PICTURES: pictures/P1-2-1-dashboard-technician-efficiency.png · pictures/P1-2-2-work-order-S3-17383-line-4.png · pictures/P1-2-3-technician-efficiency-report-line.png
BASIS: Chris Ward's answer to question 28 (28 Oct 2026): "Yes. Split on the real time clocked and round only for display, so that tech gets the full 0.50. Defect."
RE-CHECKED: 28 Oct 2026 23:23 UTC (API) and 29 Oct 2026 00:37–00:38 UTC (screen, pictures re-taken), staging v26.43.2-f8698cb, Staging Lethbridge - 4310; session, browser, the app's own time-zone setting and the test computer all on America/Edmonton. Same figures both times.
-->

## What is wrong

When a technician's clock on a line adds up to **less than 36 seconds** (it shows as 0.01 hours), Technician Efficiency gives that technician **no tech time at all** for the line.

For example, line 4 of work order S3-17383 has 30 minutes of tech time. Joseph Nelson is the only one who clocked on it, for 30 seconds. He gets 0 Invoiced Tech Hrs for the line instead of 0.50.

## Where this shows on the Dashboard

- **Technician Efficiency tile:** the headline % and "… Invoiced Tech Hrs / … Clocked" are too low.
- **View details** on that tile: the technician's row is too low.
- The **Technician Efficiency** report shows the same: Invoiced Tech Hrs **0** on the line, and lower totals.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **Staging Lethbridge - 4310**.
3. Click **Dashboard**.
4. On the **Technician Efficiency** tile, click the date button. Pick **Aug 25, 2026** as both the start and the end date, then click **Apply**.
5. Read the line under the headline, then click **View details** and find **Joseph Nelson**.
6. Open work order **S3-17383** (Monroe Truck Service & Repair). On the **Lines** tab, line 4 **Replace cabin air filter** reads **0.01 / 0.50**: 30 seconds clocked by Joseph Nelson, 0.50 hour of tech time.
7. Optional: open **Reports → Technician Efficiency**, set the date to **Last quarter**, and expand **Joseph Nelson**. The row for S3-17383 line 4 shows **Clocked Hrs 0.01** and **Invoiced Tech Hrs 0**.

**Actual:** the tile reads **33.50** Invoiced Tech Hrs / **29.36** Clocked = **114.10 %**. Joseph Nelson reads **9.75** Invoiced Tech Hrs, **131.22 %**.

**Expected:** the 0.50 hour of line 4 goes to Joseph Nelson:

| | Invoiced Tech Hrs | Clocked | Efficiency |
|---|---|---|---|
| Tile | 33.50 + 0.50 = **34.00** | 29.36 | 34.00 ÷ 29.36 = **115.80 %** |
| Joseph Nelson | 9.75 + 0.50 = **10.25** | 7.43 | 10.25 ÷ 7.43 = **137.95 %** |

The same thing happens on every line where a technician clocked less than 36 seconds, at every location.

---

**Source:** Chris Ward, answer to question 28 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> Yes. Split on the real time clocked and round only for display, so that tech gets the full 0.50. Defect.

SV-5450:

> Each technician receives a proportional share of the Completed Tech Time Hours for that labor line

Dashboard PRD, version 53, Story 3, S3-R2:

> Each work order line's technician time is split across the technicians who worked it, in proportion to each technician's share of the clocked time on that line.

## Screenshots

**1.** Dashboard, Lethbridge, Technician Efficiency, Aug 25, 2026: 33.50 / 29.36 = 114.10 %, and Joseph Nelson 9.75 (should be 34.00 / 115.80 % and 10.25 / 137.95 %).

**2.** Work order S3-17383, line 4: 0.50 hour of tech time, 0.01 hour (30 seconds) clocked by Joseph Nelson.

**3.** Technician Efficiency report, the same line: Invoiced Tech Hrs 0.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026, Admin.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Edmonton).
- Not checked on Production or on a QA branch.
