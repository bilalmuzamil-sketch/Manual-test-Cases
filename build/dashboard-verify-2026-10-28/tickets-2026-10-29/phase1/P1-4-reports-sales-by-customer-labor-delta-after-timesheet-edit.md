<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
EDITED 29 Oct 2026 after the filter recheck: Sales by Customer tile left on its default Last 12 Months instead of the current week; picture 3 replaced.
SUMMARY: Reports - Sales By Customer keeps the old Labor Delta after a timesheet is corrected (Dashboard table too)
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-8610 (SBC - Story 12 - Inv. Hrs (Labor Delta) display) · relates to SV-9577 (Dashboard v1 - Story 5 - Count Tiles)
PICTURES: P1-4-1-edit-timesheet.png · P1-4-2-stats-tab-after.png · ../filter-recheck/evidence/f1/SV-11934-replacement.png
BASIS: Chris Ward's answer to question 27 (28 Oct 2026): "Use the figures as they are now, so the reports agree with the work order's Stats tab. Defect."
REPRODUCED: 28 Oct 2026, 11:47 PM–11:52 PM UTC (7:47–7:52 PM in Toronto), staging v26.43.2-f8698cb, DVI Test. The work order was set up for the test; the correction was made on the screen (Timesheet Activities → Edit timesheet). Session, browser and test computer all on America/Toronto. Stats tab and Dashboard re-taken 29 Oct 2026 00:41 UTC (8:41 PM Toronto) with the app's own time-zone setting also on America/Toronto: same figures (+0.50). The edit dialog showed the clock in Toronto time (07:07 PM), so that picture stands.
SCOPE NOTE: Sales By Representative has the same behaviour (Chris's answer covers both). That report is not on the Dashboard, so it goes in the Phase-2 batch as its own ticket.
-->

## What is wrong

**Labor Delta** is hours invoiced minus hours worked. It tells the shop whether a customer was billed for more time than was worked.

If a manager corrects a technician's timesheet **after** the invoice is made, Sales By Customer keeps the **old** Labor Delta. The work order's **Stats** tab shows the new hours, but the report and the Dashboard do not.

## Where this shows on the Dashboard

- **Sales by Customer tile → View details:** the **Labor Delta** column for that customer keeps the old figure.
- The other tiles **do** take the corrected time. **Technician Efficiency** and **Billing Efficiency** change straight away. So after a correction the Dashboard disagrees with itself.
- The **Sales By Customer** report shows the same old figure.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **DVI Test**.
3. Make a work order for any customer with one labor line of **1 hour** of tech time. For example, use **New Line** and pick the canned line **3x inspection**.
4. Clock a technician on that line for about **30 minutes**. Mark the line **Complete**. On the **Finance** tab, click **Create Invoice**.
5. Click **Dashboard**. On the **Sales by Customer** tile, leave the date on **Last 12 Months** (its default) and click **View details**. Find your customer: Labor Delta reads **+0.50** (1.00 invoiced − 0.50 worked).
6. Open **Reports → Timesheet Activities**. Find the technician's clock on your work order and click the pencil (**Edit timesheet**).
7. Move **Start** 30 minutes earlier so the clock is **1 hour** long. Click **Save**.
8. Open the work order's **Stats** tab. Tech hours **1.00**, Clocked hours **1.00**, so Labor Delta is now 1.00 − 1.00 = **0.00**.
9. Go back to **Dashboard → Sales by Customer → View details** and find your customer again.

**Actual:** Labor Delta still reads **+0.50**.

**Expected:** Labor Delta reads **0.00**, the same as the work order's Stats tab today.

Our example is work order **S1-38215** (customer ZZAUTOTEST Dash Q27). Its clock was changed from 7:07–7:37 PM to 6:37–7:37 PM. The Stats tab shows 1.00 / 1.00, and the Dashboard still shows +0.50.

---

**Source:** Chris Ward, answer to question 27 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> Use the figures as they are now, so the reports agree with the work order's Stats tab. Defect.

Sales By Customer PRD (as quoted in the question): Labor Delta is

> hours invoiced minus hours worked

and hours worked are

> the technician clocked (timesheet) hours recorded against that work order

## Screenshots

**1.** Timesheet Activities → Edit timesheet: Start corrected from 07:07 PM to 06:37 PM (the clock becomes 1.00 hour).

**2.** Work order S1-38215, Stats tab, after the correction: 1.00 Tech hours and 1.00 Clocked hours.

**3.** Dashboard, Sales by Customer, Last 12 Months, after the correction: Labor Delta still +0.50 (should be 0.00).

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026 (Toronto time), Admin.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto).
- Not checked on Production or on a QA branch.
