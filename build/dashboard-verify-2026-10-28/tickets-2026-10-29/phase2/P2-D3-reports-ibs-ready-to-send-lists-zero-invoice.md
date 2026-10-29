<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
SUMMARY: Reports - IBS Batches: a $0.00 invoice is listed in Ready To Send
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-2144 (Create "Batch Transactions" in "IBS Management" (IBS-six))
PICTURES: pictures/P2-D3-1-ibs-ready-to-send-zero-invoice.png
BASIS: Chris Ward's answer to question 35 (28 Oct 2026): "No, leave $0.00 invoices out of Ready to Send. Defect."
RE-CHECKED: 29 Oct 2026, 12:40 AM UTC (= 29 Oct, 5:40 AM in Karachi; screen, re-taken with the app's time-zone setting); server 12:04–12:19 AM UTC, staging v26.43.2-f8698cb, Staging Heavy Duty - 9919; session, browser, app time-zone setting and test computer all on Asia/Karachi.
-->

## What is wrong

**IBS Batches → Ready To Send** lists an invoice for **$0.00**: **INV-S2-16924** (Fort Mohave Diesel Repair, Jul 31, 2026), Total **$0.00**, Balance **$0.00**, status Unpaid.

Ready To Send is the list of invoices waiting to be sent to IBS for payment. A $0.00 invoice has nothing to collect, so it should not be listed, and it should not be put into a batch.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **Staging Heavy Duty - 9919**.
3. Click **Reports**, then **IBS Batches** (under Accounting).
4. Stay on the **Ready To Send** tab.
5. Find **INV-S2-16924** (Fort Mohave Diesel Repair).

**Actual:** INV-S2-16924 is listed with Total **$0.00** and Balance **$0.00**.

**Expected:** INV-S2-16924 is **not listed**. $0.00 invoices are left out of Ready To Send.

---

**Source:** Chris Ward, answer to question 35 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> No, leave $0.00 invoices out of Ready to Send. Defect.

## Screenshots

**1.** IBS Batches → Ready To Send at Staging Heavy Duty - 9919: INV-S2-16924 listed at $0.00 / $0.00.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 29 Oct 2026 (Karachi time), Admin.
- Browser, app time-zone setting and test computer set to the location's time zone (Asia/Karachi).
- It is the only $0.00 invoice in Ready To Send at Heavy Duty; Staging Lethbridge - 4310 has none waiting.
- Not checked on Production or on a QA branch.

## For developers

The invoice record S2-16924 has total 0.00, status pending, paid 0. The Ready To Send list includes it because it is unpaid. Leave out invoices whose total is $0.00 (the two $0.00-balance credits on the list are credits, not invoices, and are not part of this ticket).
