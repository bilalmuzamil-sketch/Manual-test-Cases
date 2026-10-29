<!-- FILED 29 Oct 2026 as SV-11945 (https://shopview.atlassian.net/browse/SV-11945), parent SV-11936 (temporary parking epic), on the QA lead's go-ahead. Exact filed text: ../filed/html/P2-B6-SV-11945.html
EDITED 29 Oct 2026 after the filter recheck: Last 90 days, one location and the search removed (Last 12 months, All locations, Part # sort); date note moved to 1 October 2027; picture 2 replaced.
SUMMARY: Reports - Parts Velocity shows a "Receive later" special-order part as never sold after it is invoiced
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-8645 (Velocity - Story 5 - Metric Calculations)
PICTURES: P2-B6-1-invoice-bills-the-part.png · ../filter-recheck/evidence/f2/pictures/SV-11945-B6-receive-later-no-filters.png
BASIS: Parts Velocity Report PRD (Confluence 620888066, version 12, 14 Sep 2026, Chris Ward), S5-R2 and S5-R4 (quoted below). Earlier finding PV-D1 (reports/W3-parts/defects/TICKET-D1-…wiki), redrafted.
RE-CHECKED: 29 Oct 2026, 12:03 AM–12:17 AM UTC (= 28 Oct, 8:03–8:17 PM in Toronto), staging v26.43.2-f8698cb, DVI Test; session, browser and test computer all on America/Toronto. Screen and server data both still show it.
DUPLICATE CHECK: none open (JQL in SUMMARY-p2b.md).
NOTE FOR THE QA LEAD: the steps below were carried out through the screen on 28 Oct (that made S1-38206); on 29 Oct the result was re-checked on the existing records, with the zones matched.
-->

## What is wrong

A **special-order** part can be marked **Receive later** (the vendor will deliver it after the customer is billed). When the work order is then invoiced, the customer **is billed** for the part, but **Parts Velocity** shows that part as **never sold**: 0.00 sold, $0.00 revenue, Demand 0, Last Sale "—".

A special-order part that is received before invoicing is counted correctly.

For example, **ZZAUTOTEST-SO1-10282011** was billed twice on 28 Oct 2026:

- Actual: Units Sold **0.00**, Revenue **$0.00**, Demand **0**, Last Sale **—**.
- Expected: Units Sold **2.00**, Revenue **$128.96** ($60.00 on S1-38203 + $68.96 on S1-38206), Demand **2**, Last Sale **0 days** (the day of the sale).

So shops that bill before the vendor delivers see these parts as not moving, and their revenue and margin as lower than they are.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **DVI Test**.
3. Click **Work Orders** and create a work order for customer **ZZAUTOTEST PV Customer**, asset **ZZ-PV1**.
4. On the **Lines** tab, click **New Line**, choose a labor line (for example the canned line **3x inspection**) and click **Save & Close**.
5. On that line, click **+ Add Part**.
6. In **Part number**, type **ZZAUTOTEST-SO1-10282011** and choose the option that reads **Inventory Qty: 0 EA**.
7. In **Qty**, type **1**. Click **Save**.
8. On the new part row, click the pencil (edit) button.
9. In the **Edit Part Request** window, set **Source** to **Vendor**, **Category** to **HD-Filters** and **Vendor** to **123 Cannabis Forestlawn**. Click **Save & Close**. The part reads **Auth To Order**, $68.96.
10. On the part row, click **Order**. The part reads **Awaiting**.
11. Click the arrow next to **Receive** and choose **Receive later**. The part reads **Receive Later**.
12. On the line, click **Complete**. If the **Missing Details** window asks for a **VIN**, type **ZZTESTVINPV300001** and click **Finish Work Order**.
13. Open the **Finance** tab and click **Create Invoice**. Close the **New Customer Payment** window without paying. The invoice lists **ZZAUTOTEST-SO1-10282011**, 1, **$68.96**.
14. Click **Reports**, then in the left menu under **Parts**, click **Parts Velocity**. Click the **Date** filter and choose **Last 12 months**. Click the **Location** filter and click **Select all**, so it reads **Location: All locations**.
15. Click the **Part #** column heading twice, so the arrow points down (Z to A), and scroll down to the ZZAUTOTEST rows (about 95 rows down). You can instead type **ZZAUTOTEST-SO1** in **Search**; the figures are the same.
16. Find the row **Special Order · ZZAUTOTEST-SO1-10282011**.
    - Already on staging: S1-38203 and S1-38206 billed this part on 28 Oct 2026. From 1 October 2027, pick **Custom** and choose a range that includes **Oct 28, 2026** instead.

**Actual:** Units Sold **0.00**, Avg Cost **—**, Avg Sell **—**, Revenue **$0.00**, Margin **$0.00**, Margin % **—**, Demand **0**, Last Sale **—**.

**Expected:** the part counts as sold. With the two sales already on staging: Units Sold **2.00**, Revenue **$128.96**, Demand **2**, Last Sale **0 days** on the day of the sale. A work order made with the steps above adds 1.00 sold, $68.96 and 1 Demand.

---

**Source:** Parts Velocity Report PRD (Confluence 620888066, version 12, 14 Sep 2026, Chris Ward):

> S5-R2: Special-order metrics are derived from vendor-sourced part requests (carrying a catalogue part reference, and not a core) on work orders with status Invoiced or Paid whose work-order date falls within the window …

> S5-R4, Special Order: Units Sold — Total quantity across the special-order part's in-window vendor requests … Demand — Count of in-window vendor part requests.

## Screenshots

**1.** Work order S1-38206, Finance: invoice INV-S1-38206 bills ZZAUTOTEST-SO1-10282011, 1 at $68.96.

**2.** Parts Velocity, Last 12 months, all locations, nothing in Search: the same part reads 0.00 sold, $0.00, Demand 0, Last Sale "—".

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026 (Toronto time), Admin.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto).
- Counted correctly for comparison: **ZZAUTOTEST-SO2-10282011**, received before invoicing on S1-38203: 1.00 sold, $80.00, Demand 1.
- Not checked on Production or on a QA branch.
