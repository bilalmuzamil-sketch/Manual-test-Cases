<!-- FILED 29 Oct 2026 as SV-11953 (https://shopview.atlassian.net/browse/SV-11953), parent SV-11936 (temporary parking epic), on the QA lead's go-ahead. Exact filed text: ../filed/html/P2-D2-SV-11953.html
SUMMARY: Reports - IBS Batches: a sent batch's Total is $290.06 more than the invoices in it
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-2144 (Create "Batch Transactions" in "IBS Management" (IBS-six))
PICTURES: pictures/P2-D2-1-ibs-sent-batch-total-not-sum.png
BASIS: Chris Ward's answer to question 34 (28 Oct 2026): "Yes, always. Defect."
RE-CHECKED: 29 Oct 2026, 12:40 AM UTC (= 28 Oct, 6:40 PM in Lethbridge; screen, re-taken with the app's time-zone setting); server 12:04–12:19 AM UTC, staging v26.43.2-f8698cb, Staging Lethbridge - 4310; session, browser, app time-zone setting and test computer all on America/Edmonton.
NOTE FOR THE QA LEAD: the cause is not known and was not re-created on new data ("Remove from batch" was tested on 28 Oct and keeps the total right). The ticket reports the batch as it is.
-->

## What is wrong

On **IBS Batches → Sent**, the batch of **Oct 2, 2026** at Staging Lethbridge - 4310 shows a **Total of $9,473.35**. When you open it, the 9 invoices inside add up to **$9,183.29**.

The batch Total is **$290.06 too high**. It must always equal the sum of the invoices (and credits) in the batch.

**Example (the arithmetic):** 45.94 + 123.11 + 659.76 + 356.48 + 503.39 + 733.51 + 1,231.39 + 1,298.23 + 4,231.48 = **$9,183.29**. The batch row says $9,473.35 (and the Balance also says $9,473.35). The batch has no credits.

The batch's own IBS file (the download for this batch) also says Invoices **$9,183.29**, so only the batch row on screen is wrong.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **Staging Lethbridge - 4310**.
3. Click **Reports**, then **IBS Batches** (under Accounting).
4. Click the **Sent** tab.
5. Find the batch dated **Oct 2, 2026**. Note its **Total**.
6. Click the arrow at the left of that row to open it.
7. Add up the **Total** of the 9 invoices listed under it (INV-S3-17282 … INV-S3-16914).

**Actual:** the batch row shows Total **$9,473.35** and Balance **$9,473.35**; the invoices in it add up to **$9,183.29**.

**Expected:** the batch row shows Total **$9,183.29** — always the sum of the invoices and credits in the batch (and its Balance the sum of their balances).

---

**Source:** Chris Ward, answer to question 34 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026). Question: "should a sent batch's Total always equal the sum of the invoices and credits in it?"

> Yes, always. Defect.

## Screenshots

**1.** IBS Batches → Sent, batch of Oct 2, 2026 opened: batch Total $9,473.35; its 9 invoices add up to $9,183.29.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026 (Lethbridge time), Admin.
- Browser, app time-zone setting and test computer set to the location's time zone (America/Edmonton).
- The other sent batch at Lethbridge (Sep 16, 2026, $7,859.73) and both at Staging Heavy Duty - 9919 add up correctly.
- Not checked on Production or on a QA branch.
