<!-- FILED 29 Oct 2026 as SV-11938 (https://shopview.atlassian.net/browse/SV-11938), parent SV-11936 (temporary parking epic), on the QA lead's go-ahead. Exact filed text: ../filed/html/P2-A2-SV-11938.html
SUMMARY: Reports - Work In Progress counts parts marked "Receive Later" as Parts Remaining instead of Parts Earned
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-8660 (WIP - Story 4 - Columns and Calculations)
PICTURES: pictures/P2-A2-1-wip-parts-columns.png · pictures/P2-A2-2-work-order-receive-later.png
BASIS: Chris Ward's answer to question 6 (28 Oct 2026): "No, it belongs in Parts Earned. "Received later" means the part is already on the job and only the receiving paperwork waits. Defect. S4-R18 gets updated."
RE-CHECKED: 29 Oct 2026, 00:48 UTC (= 29 Oct, 5:48 AM in Karachi), staging v26.43.2-f8698cb, Staging Heavy Duty - 9919; session, browser (and the app's own time-zone setting) and test computer all on Asia/Karachi.
DUPLICATE CHECK: none found (searched "received later", "receive later", Work In Progress, last 365 days).
NOTE FOR THE QA LEAD: Chris's answer covers the money columns. Whether such a work order should also move from "Approved - Not Started" to "Approved - Partially Completed" is not covered, so this ticket does not ask for it.
-->

## What is wrong

On the **Work In Progress** report, a part that is marked **Receive Later** on the work order is counted in **Parts Remaining** (work still to do).

"Receive Later" means the part is already on the job and only the receiving paperwork is waiting. So it should be counted in **Parts Earned** (work done).

Example: work order **S2-33740** has one part at **$36.67** and its core charge at **$1.00**, both marked Receive Later.

| | Actual | Expected |
|---|---|---|
| Parts Earned | $0.00 | $36.67 + $1.00 = **$37.67** |
| Parts Remaining | **$37.67** | $0.00 |

The **Earned** and **Remaining** totals on the row (and the summary figures at the top) are off by the same $37.67.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **Staging Heavy Duty - 9919**.
3. Click **Work Orders** and open **S2-33740** (customer 4 Star Truck Repair).
4. On the **Lines** tab, under line **11**, look at **Parts**: the part "(11) 11" ($36.67) and "(11) Core for 11" ($1.00) both show **Receive Later**.
5. Click **Reports**, then **Work In Progress** in the left menu. Leave **As of** on today.
6. Click **Customer: All customers**, pick **4 Star Truck Repair**, and close the list.
7. Click the **Approved - Not Started** tab.
8. Click the columns button (top right of the report) and switch on **Parts Earned** and **Parts Remaining**.
9. Find the row **S2-33740**.

**Actual:** Parts Earned **$0.00**, Parts Remaining **$37.67**.

**Expected:** Parts Earned **$37.67**, Parts Remaining **$0.00**.

---

**Source:** Chris Ward, answer to question 6 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> No, it belongs in Parts Earned. "Received later" means the part is already on the job and only the receiving paperwork waits. Defect. S4-R18 gets updated.

## Screenshots

**1.** Work In Progress, Heavy Duty, Approved - Not Started, customer 4 Star Truck Repair, with Parts Earned and Parts Remaining switched on: S2-33740 shows $0.00 earned and $37.67 remaining.

**2.** Work order S2-33740, Lines tab: both parts are marked Receive Later ($36.67 + $1.00).

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 29 Oct 2026 (Karachi time), Admin.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (Asia/Karachi).
- Other work orders at Heavy Duty show the same, for example S2-33465 and S2-33376 (each has a Receive Later part and shows $37.67 in Parts Remaining on the same tab).
- Not checked on Production or on a QA branch. The PDF and CSV downloads were not checked.
