<!-- FILED 29 Oct 2026 as SV-11941 (https://shopview.atlassian.net/browse/SV-11941), parent SV-11936 (temporary parking epic), on the QA lead's go-ahead. Exact filed text: ../filed/html/P2-B2-SV-11941.html
EDITED 29 Oct 2026 after the filter recheck: Last 90 days, one location and the search removed (Last 12 months, All locations, Part # sort); Cancel Return step now names the second click "Are You Sure?"; picture 2 replaced.
SUMMARY: Reports - Parts Velocity counts a return to the vendor in Units Returned
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-8645 (Velocity - Story 5 - Metric Calculations)
PICTURES: P2-B2-1-vendor-return-on-parts-returns.png · ../filter-recheck/evidence/f2/pictures/SV-11941-B2-units-returned-no-filters.png
BASIS: Chris Ward's answer to question 15 (28 Oct 2026): "No. Only customer returns count: work order part returns and part sale credits. Defect."
RE-CHECKED: 29 Oct 2026, 12:18 AM–12:27 AM UTC (= 28 Oct, 8:18–8:27 PM in Toronto), staging v26.43.2-f8698cb, DVI Test; session, browser and test computer all on America/Toronto. The return was made through the screen.
DUPLICATE CHECK: none open (JQL in SUMMARY-p2b.md).
NOTE FOR THE QA LEAD: the test return was cancelled afterwards, so the part is back to 4 in stock and Units Returned is back to 0.00. Cancel Return needs two clicks: Yes, then Are You Sure? (re-checked 29 Oct, it works). Not checked further; not part of this ticket.
-->

## What is wrong

On **Parts Velocity**, the **Units Returned** column counts parts that the shop sends **back to its vendor** (Parts → Returns).

Units Returned should only count parts that **customers** return: a part returned from a work order, or a part-sale credit. A return to the vendor is not a customer return, so it should not change Units Returned.

For example, returning **1** unit of ZZAUTOTEST-PV1-10282011 to the vendor raised its Units Returned:

- Actual: 0.00 + 1 (vendor return) = **1.00**.
- Expected: **0.00**, because no customer returned anything.

Cancelling the vendor return puts it back to 0.00.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **DVI Test**.
3. Click **Parts**, then in the left menu under **Supply Chain**, click **Returns**.
4. Click **Create Return**.
5. In **Vendor**, choose **123 Cannabis Forestlawn**.
6. In **Packaging Slip**, type **ZZAUTOTEST vendor return**.
7. In **Part Number**, type **ZZAUTOTEST-PV1-10282011** and choose the option that reads **Inventory Qty: …** (4 EA on 28 Oct).
8. In **Qty To Return**, type **1**.
9. Click **Save Return**. The return is listed on **Returns** with the status **Manual**.
10. Click **Reports**, then in the left menu under **Parts**, click **Parts Velocity**. Click the **Date** filter and choose **Last 12 months**. Click the **Location** filter and click **Select all**, so it reads **Location: All locations**.
11. Click the columns button at the top right of the table (the last icon, right of **⋯**) and switch on **Units Returned**.
12. Click the **Part #** column heading twice, so the arrow points down (Z to A). Scroll down to the row **ZZAUTOTEST-PV1-10282011** (about 100 rows down). You can instead type it in **Search**; the figures are the same.
13. Read **Units Returned** on the row **Inventory · ZZAUTOTEST-PV1-10282011**.
14. Afterwards, go back to **Parts → Returns** and cancel the return: **⋮ → Cancel Return → Yes**. The button then changes to **Are You Sure?**; click it. The message "Manual return cancelled successfully" appears and the row goes.

**Actual:** Units Returned reads **1.00** (and On Hand drops from 4.00 to 3.00).

**Expected:** Units Returned stays **0.00**. Only customer returns count. On Hand dropping to 3.00 is correct.

---

**Source:** Chris Ward, answer to question 15 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> 15. No. Only customer returns count: work order part returns and part sale credits. Defect.

Parts Velocity Report PRD (version 12), S5-R3: "Units Returned is sourced from part-return records — the record written when a return is initiated, via a work-order part return or a parts-sale credit".

## Screenshots

**1.** Parts → Returns at DVI Test: the return of 1 ZZAUTOTEST-PV1-10282011 to the vendor 123 Cannabis Forestlawn.

**2.** Parts Velocity, Last 12 months, all locations, nothing in Search, Units Returned switched on: the part reads 1.00.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026 (Toronto time), Admin.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto).
- First seen the same way on 28 Oct 2026 (a different return of the same part, also cancelled afterwards).
- Not checked on Production or on a QA branch.
