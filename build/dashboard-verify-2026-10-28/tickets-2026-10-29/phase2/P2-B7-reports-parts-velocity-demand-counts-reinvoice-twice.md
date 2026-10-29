<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
SUMMARY: Reports - Parts Velocity Demand counts a work order twice when its invoice is reversed and created again
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-8645 (Velocity - Story 5 - Metric Calculations)
PICTURES: pictures/P2-B7-1-parts-velocity-demand.png
BASIS: Parts Velocity Report PRD (Confluence 620888066, version 12, 14 Sep 2026, Chris Ward), S5-R4 Demand (quoted below), and its change log of 20 Aug 2026. Earlier finding PV-D2 (reports/W3-parts/defects/TICKET-D2-…wiki), redrafted.
RE-CHECKED: 29 Oct 2026, 12:03 AM–12:27 AM UTC (= 28 Oct, 8:03–8:27 PM in Toronto), staging v26.43.2-f8698cb, DVI Test; session, browser and test computer all on America/Toronto. Screen and server data both still show Demand 5.
DUPLICATE CHECK: none open. SV-9810 (Code Review) is about core parts inflating Demand, a different cause.
NOTE FOR THE QA LEAD: the reverse-and-reinvoice steps were carried out through the screen on 28 Oct (on S1-38206); on 29 Oct the result was re-checked on the existing records, with the zones matched.
-->

## What is wrong

On **Parts Velocity**, **Demand** is meant to count **how many work orders (or parts sales)** a part was sold on, each one **once**. When an invoice is **reversed** and then **created again** on the same work order, the report counts that work order **twice**. Every reverse-and-reinvoice adds one more.

For example, stocked part **ZZAUTOTEST-PV1-10282011** was sold on **3** work orders (S1-38203, S1-38204, S1-38206). Two of them had their invoice reversed and created again:

- Actual: Demand **5** (3 work orders + 2 re-invoices).
- Expected: Demand **3** (3 work orders).

Demand is the report's default sort, so parts whose invoices get corrected move up the list above parts that really sell more often.

Units Sold (6.00), Revenue ($180.00) and the other money columns stay correct.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **DVI Test**.
3. Click **Reports**, then in the left menu under **Parts**, click **Parts Velocity** (**Date: Last 90 days**, **Location: DVI Test**).
4. Click **Search**, type **ZZAUTOTEST-PV1** and note the **Demand** of **ZZAUTOTEST-PV1-10282011**.
5. Click **Work Orders** and create a work order for customer **ZZAUTOTEST PV Customer**, asset **ZZ-PV1**.
6. On the **Lines** tab, click **New Line**, choose a labor line (for example the canned line **3x inspection**) and click **Save & Close**.
7. On that line, click **+ Add Part**. In **Part number**, type **ZZAUTOTEST-PV1-10282011** and choose the option that reads **Inventory Qty: …**.
8. In **Qty**, type **1**. Click **Save**.
9. On the part row, click **Pick**.
10. On the line, click **Complete**. If the **Missing Details** window asks for a **VIN**, type **ZZTESTVINPV300001** and click **Finish Work Order**.
11. Open the **Finance** tab and click **Create Invoice**. Close the **New Customer Payment** window without paying.
12. Open **Parts Velocity** again. Demand has gone up by **1** (correct).
13. Go back to the work order's **Finance** tab. Click **⋮** next to the invoice and choose **Reverse**. In the **Warning** window, click **Reverse**.
14. Click **Create Invoice** again. Close the **New Customer Payment** window without paying.
15. Open **Parts Velocity** again and read **Demand**.
    - Already on staging: Demand reads **5** for this part today. From 20 January 2027, pick **Custom** and choose a range that includes **Oct 28, 2026** instead of Last 90 days.

**Actual:** Demand has gone up by **1 more** (the same work order is counted twice). On staging today: **5** for 3 work orders.

**Expected:** Demand stays where it was after step 12; a work order counts once however many times it is invoiced, reversed or re-invoiced. On staging today: **3**.

---

**Source:** Parts Velocity Report PRD (Confluence 620888066, version 12, 14 Sep 2026, Chris Ward), S5-R4, Demand for an inventory part:

> Count of distinct in-window transactions (work orders or parts sales) with at least one invoicing event that decremented stock. A transaction counts once however many times it is invoiced, reversed or re-invoiced.

Same PRD, change log of 20 Aug 2026: "Demand counts distinct transactions, not invoicing events. … Decisive factor: Demand is the default sort (S3-R2), so counting events pushed any reversed and re-invoiced part above parts that genuinely move."

## Screenshots

**1.** Parts Velocity at DVI Test, Last 90 days: ZZAUTOTEST-PV1-10282011 reads Demand 5 for 3 work orders; Units Sold 6.00 is right.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026 (Toronto time), Admin.
- Browser and test computer set to the location's time zone (America/Toronto).
- A reversed invoice that is not created again correctly keeps Demand 1 with Units Sold 0.00, and two different work orders correctly add 1 each (seen 28 Oct 2026).
- Not checked on Production or on a QA branch.

## For developers

Demand counts distinct invoices among the in-window invoicing stock movements. A reversal removes the invoice and the re-invoice creates a new invoice id, so one work order gives two distinct invoices. Count distinct work orders (or parts sales) instead. Test records (DVI Test): inventory part 5871f791-e4b0-4fdb-a6d1-26d3600b2844; work orders b1b353e7-90e9-4c31-ad96-d7bef9609ad7 (S1-38203), 19504c20-8617-48ef-ace7-5f68a58c9c5e (S1-38204), 25b08188-f428-41fc-be61-ee6e7f2753ae (S1-38206).
