<!-- FILED 29 Oct 2026 as SV-11948 (https://shopview.atlassian.net/browse/SV-11948), parent SV-11936 (temporary parking epic), on the QA lead's go-ahead. Exact filed text: ../filed/html/P2-C1-SV-11948.html
SUMMARY: Reports - Sales By Representative keeps the old Labor Delta after a timesheet is corrected
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-8626 (SBR - Story 9 - Inv. Hrs (Labor Delta) column display)
PICTURES: pictures/P2-C1-1-edit-timesheet.png · pictures/P2-C1-2-stats-tab-after.png · pictures/P2-C1-3-sbr-after.png
BASIS: Chris Ward's answer to question 27 (28 Oct 2026): "Use the figures as they are now, so the reports agree with the work order's Stats tab. Defect."
REPRODUCED: 29 Oct 2026, 12:08 AM–12:40 AM UTC (28 Oct, 8:08–8:40 PM in Toronto), staging v26.43.2-f8698cb, DVI Test. The work order was set up for the test; the correction was made on the screen (Timesheet Activities → Edit timesheet). Session, browser, test computer and the app's own time-zone setting all on America/Toronto.
SCOPE NOTE: the same behaviour on Sales By Customer is Phase-1 draft P1-4. Chris's answer covers both reports; this ticket is the Sales By Representative half.
-->

## What is wrong

**Labor Delta** is hours invoiced minus hours worked. It tells the shop whether a customer was billed for more time than was worked.

If a manager corrects a technician's timesheet **after** the invoice is made, Sales By Representative keeps the **old** Labor Delta. The work order's **Stats** tab shows the new hours, but the report does not.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **DVI Test**.
3. Make a work order for any customer with one labor line of **1 hour** of tech time. For example, use **New Line** and pick the canned line **3x inspection**.
4. On the work order card, set **Sales Representative** to **Viktoria Videnovic**.
5. Clock a technician on that line for about **30 minutes**. Mark the line **Complete**. On the **Finance** tab, click **Create Invoice**.
6. Open **Reports → Sales By Representative**. Leave **Date: This month** (from 1 November pick **Last month**).
7. Click the arrow next to **Viktoria Videnovic** to open her invoices. Find your invoice: Labor Delta reads **+0.50** (1.00 invoiced − 0.50 worked).
8. Open **Reports → Timesheet Activities**. Find the technician's clock on your work order and click the pencil (**Edit timesheet**).
9. Move **Start** 30 minutes earlier so the clock is **1 hour** long. Click **Save**.
10. Open the work order's **Stats** tab. Tech hours **1.00**, Clocked hours **1.00**, so Labor Delta is now 1.00 − 1.00 = **0.00**.
11. Go back to **Reports → Sales By Representative**, open **Viktoria Videnovic** again and find your invoice.

**Actual:** Labor Delta still reads **+0.50**.

**Expected:** Labor Delta reads **0.00**, the same as the work order's Stats tab today.

Our example is work order **S1-38217** (customer ZZAUTOTEST P2C REP, sales representative Viktoria Videnovic). Its clock was changed from 7:28–7:58 PM to 6:58–7:58 PM. The Stats tab shows 1.00 / 1.00, and Sales By Representative still shows +0.50.

---

**Source:** Chris Ward, answer to question 27 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> Use the figures as they are now, so the reports agree with the work order's Stats tab. Defect.

Sales By Representative PRD (as quoted in the question): Labor Delta is

> hours invoiced minus hours worked

and hours worked are

> the technician clocked (timesheet) hours recorded against that work order

## Screenshots

**1.** Timesheet Activities → Edit Timesheet on S1-38217 after the correction: Start 06:58 PM, End 07:58 PM (the clock is now 1.00 hour).

**2.** Work order S1-38217, Stats tab, after the correction: 1.00 Tech hours and 1.00 Clocked hours.

**3.** Sales By Representative, This month, Viktoria Videnovic opened, after the correction: Labor Delta for S1-38217 still +0.50 (should be 0.00).

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026 (Toronto time), Admin.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto).
- Not checked on Production or on a QA branch.
