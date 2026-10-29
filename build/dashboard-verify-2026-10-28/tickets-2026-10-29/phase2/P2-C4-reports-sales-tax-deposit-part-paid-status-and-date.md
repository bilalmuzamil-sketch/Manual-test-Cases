<!-- FILED 29 Oct 2026 as SV-11951 (https://shopview.atlassian.net/browse/SV-11951), parent SV-11936 (temporary parking epic), on the QA lead's go-ahead. Exact filed text: ../filed/html/P2-C4-SV-11951.html
EDITED 29 Oct 2026 after the filter recheck: Date Range: Today replaced by the default This month (Partially Paid kept, it is part of the test); pictures 2 and 3 replaced.
SUMMARY: Reports - Sales Tax Collected shows an invoice part paid by a deposit as Paid, with the invoice date as its paid date
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-4573 (BE/FE Sales Tax report view)
PICTURES: P2-C4-1-add-deposit-oct26.png · ../filter-recheck/evidence/f3/SV-11950_51/F3-SV11951-1-deposit-invoice-this-month.png · ../filter-recheck/evidence/f3/SV-11950_51/F3-SV11951-2-partially-paid-this-month.png
BASIS: Chris Ward's answer to question 31(b) (28 Oct 2026): "Yes, use the latest payment date, deposits included, per SV-4573. Both are defects." · SV-4573: "Invoice Status (, Partially Paid, Paid)" and "for partially paid invoices, show the date of the latest payment".
REPRODUCED: 29 Oct 2026, 12:45 AM–12:48 AM UTC (28 Oct, 8:45–8:48 PM in Toronto), staging v26.43.2-f8698cb, DVI Test. The deposit and the invoice were both made through the screen. Session, browser, test computer and the app's own time-zone setting all on America/Toronto.
MERGE NOTE: this ticket joins two findings with one cause: the report does not count a deposit as a payment. (1) the earlier finding TAX1 (draft TICKET-W2-6, 28 Oct: status "Paid" instead of "Partially Paid") and (2) Chris's question 31(b) (paid date). Both show on the same invoice row, so they are one ticket.
-->

## What is wrong

When a customer pays a **deposit** before the work is invoiced, and the deposit covers only part of the invoice, the invoice is **partly paid**. The work order's Finance tab and Sales By Representative both say **Partially Paid**.

Sales Tax Collected gets this invoice wrong in two ways:

- **Invoice Status** reads **Paid**, so the invoice is missing when you filter on **Partially Paid**.
- **Invoice Paid Date** is the day the invoice was made, not the day the money came in (the deposit's date).

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **DVI Test**.
3. Make a work order for any customer with one labor line of **$135.00** (for example the canned line **3x inspection**). Leave the line **approved**, not yet Complete.
4. Open the **Finance** tab and click **Add Deposit**.
5. Set **Deposit Date** to **two days ago** (we used **10/26/2026**), **Payment Method: Cash**, **Deposit Amount: 30.00**. Click **Record Deposit**.
6. Mark the line **Complete**.
7. On the **Finance** tab, click **Create Invoice**. Close the **New Customer Payment** window without paying. **Balance** reads **$105.00**.
8. Open **Reports → Sales Tax Collected**.
9. Leave **Date Range** on **This month** and do not pick an Invoice Status yet. Find your invoice.
10. Click **Invoice Status** and pick **Partially Paid**.

**Actual:**
- At step 9 the invoice reads **Paid**, and Invoice Paid Date is the day the invoice was made (Oct 28, 2026 in our example).
- At step 10 the table says **"No record matches these filters"**.

**Expected:**
- At step 9 the invoice reads **Partially Paid**, because $135.00 − $30.00 = **$105.00** is still owed.
- Invoice Paid Date is **Oct 26, 2026**, the date of the deposit (the latest and only payment).
- At step 10 the invoice is listed.

Our example is work order **S1-38221** (customer ZZAUTOTEST P2C DEP): $30.00 deposit dated Oct 26, 2026, invoice made Oct 28, 2026, $105.00 still owed. An earlier test invoice, S1-38219 (same customer), shows the same thing.

---

**Source:** Chris Ward, answer to question 31 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> (b) Yes, use the latest payment date, deposits included, per SV-4573. Both are defects.

SV-4573 (BE/FE Sales Tax report view), the report's columns:

> Invoice Status (, Partially Paid, Paid)

and

> for partially paid invoices, show the date of the latest payment

## Screenshots

**1.** Work order S1-38221, Finance tab, Add Deposit: Deposit Date 10/26/2026, Cash, 30.00.

**2.** Sales Tax Collected, DVI Test, This month, no Invoice Status picked: S1-38221 reads Paid, with the day it was invoiced as its Invoice Paid Date (should be Partially Paid, paid Oct 26, 2026).

**3.** The same report, This month, with Invoice Status: Partially Paid: "No record matches these filters".

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026 (Toronto time), Admin.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto).
- Older invoices with the same problem (28 Oct data check): P2-2441, P2-2442, P2-2445, P2-2416, P2-2417, P2-2315, S2-37799, S2-32138 (Staging Heavy Duty - 9919) and S3-16408 (Staging Lethbridge - 4310).
- When part of the money is an ordinary payment (not a deposit), the report correctly shows Partially Paid.
- Not checked on Production or on a QA branch.
