<!-- FILED 29 Oct 2026 as SV-11943 (https://shopview.atlassian.net/browse/SV-11943), parent SV-11936 (temporary parking epic), on the QA lead's go-ahead. Exact filed text: ../filed/html/P2-B4-SV-11943.html
EDITED 29 Oct 2026 after the filter recheck: Last quarter and one location removed (Last 12 months, All locations); Expected is now "70 days fewer" (30 Jul − 21 May = 70), not a fixed 91 days, because the day-boundary rule is open (question 40 for Chris); picture 1 replaced; Where it was seen = v26.43.2-9272076.
SUMMARY: Reports - Parts Velocity Last Sale ignores a billed sale that moved no stock
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-8645 (Velocity - Story 5 - Metric Calculations) · relates to SV-11516 (Parts Velocity: store each part's last sale date — Open; the stored date should follow the same rule)
PICTURES: ../filter-recheck/evidence/f2/pictures/SV-11943-B4-last-sale-no-filters.png · P2-B4-2-invoice-S2-16621.png
BASIS: Chris Ward's answer to question 18 (28 Oct 2026): "Yes, any billed sale counts, with or without stock movement. Defect."
RE-CHECKED: 29 Oct 2026, 12:03 AM–12:15 AM UTC (= 29 Oct, 5:03–5:15 AM in Karachi), staging v26.43.2-f8698cb, Staging Heavy Duty - 9919; session, browser and test computer all on Asia/Karachi.
DUPLICATE CHECK: none open. SV-11516 (Open) only changes where the last-sale date is stored, not which sales count.
-->

## What is wrong

On **Parts Velocity**, **Last Sale** ("how many days since this part was last sold") skips a sale when the part was **billed on an invoice but no stock movement was recorded** for it. It shows the sale before that instead, so the part looks as if it has not sold for much longer than it has.

Any billed sale should count for Last Sale, with or without stock movement.

For example, part **N000000001069** (Aluminum Seal Ring, M14) was billed on work order **S2-16621**, invoice date **30 Jul 2026**, for $1.38:

- Actual: Last Sale reads **161 days** on 29 Oct 2026, which points back to 21 May 2026.
- Expected: Last Sale counts from the 30 Jul 2026 sale, so it should read **70 days fewer** (30 Jul − 21 May = 70 days).

The report knows about this sale: with **Date: Last quarter** (1 Jul – 30 Sep 2026; from 1 January 2027 choose **Custom**, **Jul 1, 2026** to **Sep 30, 2026**) the same row shows **Revenue $1.38**, the S2-16621 sale, and nothing else. But it leaves the sale out of Last Sale.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **Staging Heavy Duty - 9919**.
3. Click **Reports**, then in the left menu under **Parts**, click **Parts Velocity**.
4. Click the **Date** filter and choose **Last 12 months**. Click the **Location** filter and click **Select all**, so it reads **Location: All locations**.
5. Click **Search** and type **N000000001069**. This only brings the part on screen; it does not change its figures.
6. Find the row **Inventory · N000000001069 · Aluminum Seal Ring, M14**, vendor **Willoughby Mechanical Services**.
7. Read **Last Sale** on that row.
8. Click **Work Orders**, open **S2-16621** and click the **Finance** tab. Read **Invoice Date**, and find the line **DDE-N000000001069 - SEAL RING**, 1 at $1.38.

**Actual:** Last Sale **161 days** on 29 Oct 2026, which points back to 21 May 2026, although the part was billed on S2-16621 on 30 Jul 2026. It goes up by 1 each day.

**Expected:** Last Sale counts from the 30 Jul 2026 sale, so it should read **70 days fewer** than the screen shows (30 Jul − 21 May = 70 days). It still goes up by 1 each day.

---

**Source:** Chris Ward, answer to question 18 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> 18. Yes, any billed sale counts, with or without stock movement. Defect.

Parts Velocity Report PRD (version 12), S5-R4: Last Sale is "Whole days from today to the part's most recent sale at the selected location(s), over all-time history — not limited to the window."

## Screenshots

**1.** Parts Velocity, Last 12 months, all locations, N000000001069: Last Sale 161 days.

**2.** Work order S2-16621, Finance tab: Invoice Date Jul 30, 2026, with DDE-N000000001069 - SEAL RING billed at $1.38.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-9272076, 29 Oct 2026, 2:38 PM Karachi time, Admin. Figures re-read on v26.43.3-8ad4001 the same day: Last Sale still 161 days.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (Asia/Karachi).
- Also seen on 28 Oct 2026 (it read 160 days that day).
- Not checked on Production or on a QA branch.
