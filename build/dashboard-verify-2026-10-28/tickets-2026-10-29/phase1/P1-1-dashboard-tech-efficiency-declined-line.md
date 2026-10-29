<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
EDITED 29 Oct 2026 after the filter recheck: date on the tile changed from a custom Oct 25 – Oct 28 range to Last 12 Months; picture 1 replaced; "Where it was seen" updated to the follow-up runs.
SUMMARY: Dashboard - Technician Efficiency counts a line the customer declined
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-9575 (Dashboard v1 - Story 3 - Measure Formulas & Report Parity)
PICTURES: ../filter-recheck/evidence/f1/SV-11931-replacement.png · P1-1-2-work-order-S1-38198-lines.png · P1-1-3-invoice-S1-38198.png
BASIS: Chris Ward's answer to question 1 (28 Oct 2026): "(b) Only billed lines count. A declined line wasn't invoiced, so its tech time shouldn't count either. Defect."
RE-CHECKED: 28 Oct 2026 23:25 UTC (API) and 29 Oct 2026 00:39 UTC = 28 Oct 8:39 PM Toronto (screen, pictures), staging v26.43.2-f8698cb, DVI Test; session, browser, the app's own time-zone setting and the test computer all on America/Toronto (Rule 99).
-->

## What is wrong

When a customer **declines** a line on a work order, that line is not billed. It does not appear on the invoice.

The **Technician Efficiency** tile on the Dashboard still counts the declined line. It adds the line's technician time to **Invoiced Tech Hrs** and its clocked time to **Clocked**. So the technician looks more efficient than the invoice shows.

## Where this shows on the Dashboard

- **Technician Efficiency tile:** the headline % and the line under it ("… Invoiced Tech Hrs / … Clocked").
- **View details** on that tile: the technician's row in the table under the chart.
- The **Technician Efficiency** report (Reports → Technician Efficiency → Invoiced) shows the same numbers, because the tile reads from it.

The **Billing Efficiency** tile already leaves declined lines out.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **DVI Test**.
3. Click **Dashboard**.
4. On the **Technician Efficiency** tile, click the date button, pick **Last 12 Months**, then click **Apply**.
5. Click **View details** under the tile.
6. In the table, find **Fabian Bonjean**.
7. Open work order **S1-38198** (customer ZZAUTOTEST Dash F2). On the **Lines** tab:
   - line 1 is **Complete**, 1.00 hour clocked, 1.00 hour of tech time;
   - line 2 is **Declined**, 0.50 hour clocked, 1.00 hour of tech time.
8. Open the **Finance** tab. The invoice bills line 1 only (Labor Total $135.00).

**Actual:** Fabian Bonjean shows **2.00** Invoiced Tech Hrs, **1.50** Clocked, **133.33 %**. The declined line 2 is counted.

**Expected:** Fabian Bonjean shows **1.00** Invoiced Tech Hrs, **1.00** Clocked, **100.00 %**. Only line 1 was billed: 1.00 ÷ 1.00 = 100 %.

The tile headline is high for the same reason. With Last 12 Months it reads **158.10 %** (8.00 Invoiced Tech Hrs / 5.06 Clocked). The declined lines at DVI Test have 1.02 hours clocked on them. Those hours are inside the 5.06 Clocked. The **Billing Efficiency** tile already leaves them out: it shows 4.04 Clocked, which is 5.06 − 1.02.

---

**Source:** Chris Ward, answer to question 1 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> (b) Only billed lines count. A declined line wasn't invoiced, so its tech time shouldn't count either. Defect.

Dashboard PRD, version 53 (22 Oct 2026), Story 3, S3-R2, Technician Efficiency:

> Invoiced technician hours divided by clocked hours, times 100, for the selected range.

## Screenshots

**1.** Dashboard, Technician Efficiency, Last 12 Months, all technicians: Fabian Bonjean 1.50 Clocked / 2.00 Invoiced Tech Hrs / 133.33 % (should be 1.00 / 1.00 / 100.00 %). Billing Efficiency already leaves the declined lines out (4.04 Clocked against 5.06).

**2.** Work order S1-38198: line 1 Complete, line 2 Declined.

**3.** The invoice for S1-38198 bills line 1 only.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.3-8ad4001, 29 Oct 2026 (Toronto time), Admin.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto).
- Other test data at DVI Test changes the tile total from day to day. Fabian Bonjean's row on S1-38198 is the stable example.
- The work orders S1-38198, S1-38199 and S1-38195 are test data at DVI Test and stay in place.
- Not checked on Production or on a QA branch.
