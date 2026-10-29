<!-- FILED 29 Oct 2026 as SV-11944 (https://shopview.atlassian.net/browse/SV-11944), parent SV-11936 (temporary parking epic), on the QA lead's go-ahead. Exact filed text: ../filed/html/P2-B5-SV-11944.html
EDITED 29 Oct 2026 after the filter recheck: location switch dropped; Location set to All locations for screen and CSV; PDF step keeps DVI Test only (the all-locations PDF did not download); picture 1 replaced; "Where it was seen" updated to the follow-up runs.
SUMMARY: Reports - Inventory Value quantity column is headed "Qty" instead of "On Hand" (screen and downloads)
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-8670 (Inv Value - Story 3 - Columns and Calculations) · relates to SV-8677 (Inv Value - Story 10 - Export to PDF and CSV)
PICTURES: ../filter-recheck/evidence/f2/pictures/SV-11944-B5-qty-heading-no-filters.png · P2-B5-2-download-qty-heading.png
BASIS: Chris Ward's answer to question 20(b) (28 Oct 2026): "Neither. The standard is now "On Hand", the same as Parts Velocity, on screen and in the download. Defect for Inventory Value."
RE-CHECKED: 29 Oct 2026, 12:14 AM–12:16 AM UTC (= 28 Oct, 8:14–8:16 PM in Toronto), staging v26.43.2-f8698cb, DVI Test; session, browser and test computer all on America/Toronto. Screen, PDF and CSV all checked.
DUPLICATE CHECK: none open (JQL in SUMMARY-p2b.md).
NOTE FOR THE QA LEAD: the totals row label "Totals" is correct (Chris, 20(a)); only the column heading is wrong.
-->

## What is wrong

On **Inventory Value**, the column that shows how many of each part are in stock is headed **"Qty"**.

The standard heading is now **"On Hand"**, the same as on Parts Velocity, both on the screen and in the downloads.

For example, part ZZAUTOTEST-PV1-10282011 (location DVI Test) shows **4.00** in stock (on 29 Oct 2026):

- Actual: the 4.00 sits under the heading **Qty** (screen, PDF and CSV).
- Expected: the 4.00 sits under the heading **On Hand**.

The numbers in the column are correct; only the heading is wrong.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. Click **Reports**, then in the left menu under **Parts**, click **Inventory Value**.
3. Click the **Location** filter and click **Select all**, so it reads **Location: All locations**.
4. Read the heading of the column between **Location** and **Unit Cost**.
5. Click **⋯** and choose **Download (CSV)**. Read the same heading in the first row of column names.
6. For the PDF, click the **Location** filter and pick only **DVI Test** (the PDF of all locations at once did not download on 29 Oct). Then click **⋯** → **Download (PDF)** and read the same heading.

**Actual:** the heading reads **Qty** on screen, in the PDF and in the CSV.

**Expected:** the heading reads **On Hand** on screen, in the PDF and in the CSV.

---

**Source:** Chris Ward, answer to question 20 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> 20. (a) "Totals". S4-R1 gets updated. (b) Neither. The standard is now "On Hand", the same as Parts Velocity, on screen and in the download. Defect for Inventory Value.

## Screenshots

**1.** Inventory Value, all locations, As of today: the quantity column is headed "Qty".

**2.** The PDF download: the heading also reads "Qty".

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-9272076, 29 Oct 2026, 5:49 AM Toronto time, Admin. The PDF of all locations did not download that day, so the PDF step uses DVI Test only.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto).
- The CSV header row reads: `"Part #",Description,Category,Vendor,Location,Qty,"Unit Cost",…`.
- Not checked on Production or on a QA branch.
