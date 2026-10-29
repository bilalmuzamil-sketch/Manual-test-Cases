<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
SUMMARY: Reports - Work In Progress shows "1 days" in Days Open instead of "1 day"
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-8660 (WIP - Story 4 - Columns and Calculations)
PICTURES: pictures/P2-A1-1-wip-days-open.png
BASIS: Chris Ward's answer to question 4 (28 Oct 2026): "Calendar dates, as the screen does. That was a deliberate change in SV-9403, so S4-R12 gets updated. One defect: it should read "1 day", not "1 days"."
RE-CHECKED: 29 Oct 2026, 00:47 UTC (= 29 Oct, 5:47 AM in Karachi), staging v26.43.2-f8698cb, Staging Heavy Duty - 9919; session, browser (and the app's own time-zone setting) and test computer all on Asia/Karachi.
DUPLICATE CHECK: none found. Nearest: SV-11821 (In Progress) — the same kind of wording slip on the Dashboard ("1 Invoices", "Range: 1 days"); it does not cover this report.
-->

## What is wrong

On the **Work In Progress** report, the **Days Open** column reads **"1 days"** for a work order that has been open one day.

It should read **"1 day"**. Every other number reads correctly ("0 days", "13 days").

How Days Open is counted is correct: it counts calendar dates, so a work order opened yesterday shows 1, even if it was opened only a few hours ago. Only the word is wrong.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **Staging Heavy Duty - 9919**.
3. You need a work order that was opened **yesterday**. On 29 Oct 2026 work order **S2-38105** (customer 4 Star Truck Repair, opened 28 Oct 2026) is one.
   - On any later date, make your own: click **Work Orders**, create a work order today, and do the rest of these steps tomorrow.
4. Click **Reports**, then **Work In Progress** in the left menu.
5. Leave **As of** on today's date.
6. Click **Customer: All customers**, pick the work order's customer (for S2-38105: **4 Star Truck Repair**), and close the list.
7. Stay on the **Approved - Partially Completed** tab (or the tab your work order is on).
8. Click the **Days Open** heading so the smallest numbers come first.
9. Look at the **Days Open** cell of the work order.

**Actual:** Days Open reads **"1 days"**.

**Expected:** Days Open reads **"1 day"**.

---

**Source:** Chris Ward, answer to question 4 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> Calendar dates, as the screen does. That was a deliberate change in SV-9403, so S4-R12 gets updated. One defect: it should read "1 day", not "1 days".

## Screenshots

**1.** Work In Progress, Heavy Duty, as of 10/29/2026, customer 4 Star Truck Repair, sorted by Days Open: S2-38105 reads "1 days"; the next row reads "13 days".

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 29 Oct 2026 (Karachi time), Admin.
- Browser and test computer set to the location's time zone (Asia/Karachi).
- Not checked on Production or on a QA branch. The PDF and CSV downloads were not checked.

## For developers

Use the singular when the number is exactly 1: "1 day". Keep "0 days" and "2 days" and up as they are. The downloads should use the same wording as the screen.
