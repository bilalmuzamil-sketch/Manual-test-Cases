<!-- FILED 29 Oct 2026 as SV-11940 (https://shopview.atlassian.net/browse/SV-11940), parent SV-11936 (temporary parking epic), on the QA lead's go-ahead. Exact filed text: ../filed/html/P2-B1-SV-11940.html
SUMMARY: Reports - Parts Velocity "Last 90 days" covers 91 days
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-11514 (Parts Velocity: Last 90 Days default and remembered range) · relates to SV-8642 (Velocity - Story 2 - Filters & Search)
PICTURES: pictures/P2-B1-1-parts-velocity-last-90-days.png · pictures/P2-B1-2-download-shows-91-days.png
BASIS: Chris Ward's answer to question 13 (28 Oct 2026): "Yes, exactly 90 days: today and the 89 before it. Defect."
RE-CHECKED: 29 Oct 2026, 12:09 AM–12:11 AM UTC (= 28 Oct, 8:09–8:11 PM in Toronto), staging v26.43.2-f8698cb, DVI Test; session, browser and test computer all on America/Toronto.
DUPLICATE CHECK: none open (JQL in SUMMARY-p2b.md).
-->

## What is wrong

On **Parts Velocity**, the date option **Last 90 days** covers **91 days**: it starts one day too early.

For example, on 28 October 2026 it runs from **30 July** to **28 October**:

- Actual: 30 Jul to 28 Oct = 2 days of July + 31 + 30 + 28 = **91 days**.
- Expected: 31 Jul to 28 Oct = 1 day of July + 31 + 30 + 28 = **90 days** (today and the 89 days before it).

So every figure on the report under Last 90 days (the report's default) includes one extra day of sales.

The report screen itself only says "Last 90 days". The dates it used are printed at the top of the downloads, on the **Date Range** line.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **DVI Test**.
3. Click **Reports**, then in the left menu under **Parts**, click **Parts Velocity**.
4. Leave the date as it opens: **Date: Last 90 days**. Leave **Location: DVI Test**.
5. At the top right of the report, click **⋯** and choose **Download (PDF)**. (Download (CSV) shows the same line.)
6. Open the downloaded file and read the **Date Range** line at the top.
   - Work out the expected first day as today's date minus 89 days. For example, on 1 November 2026 it should be 4 August 2026.

**Actual:** on 28 Oct 2026 the download says **Date Range: Jul 30, 2026 - Oct 28, 2026**, which is 91 days.

**Expected:** **Date Range: Jul 31, 2026 - Oct 28, 2026**, which is 90 days: today and the 89 days before it.

---

**Source:** Chris Ward, answer to question 13 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> 13. Yes, exactly 90 days: today and the 89 before it. Defect.

SV-11514: "The default range is Last 90 Days."

## Screenshots

**1.** Parts Velocity at DVI Test, opened with its default date, "Last 90 days".

**2.** The PDF download of the same view: "Date Range: Jul 30, 2026 - Oct 28, 2026", 91 days.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026 (Toronto time), Admin.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto).
- The other date options (This week, Last week, This month, Last month, This quarter, Last quarter, This year, Last year, Last 12 months) cover the right dates (checked 28 Oct 2026).
- Not checked on Production or on a QA branch.
