<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
SUMMARY: Reports - Sales Tax Collected lists $0.00 invoices as Paid, with a paid date
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-4573 (BE/FE Sales Tax report view)
PICTURES: pictures/P2-C3-1-sales-tax-zero-invoice.png · pictures/P2-C3-2-zero-invoice-finance.png
BASIS: Chris Ward's answer to question 31(a) (28 Oct 2026): "No, leave $0.00 invoices off this report, since no money or tax was collected."
REPRODUCED: 29 Oct 2026, 12:19 AM–12:42 AM UTC (28 Oct, 8:19–8:42 PM in Toronto), staging v26.43.2-f8698cb, DVI Test. The $0.00 invoice was made for the test, through the screen (New Line, Create Invoice). Session, browser, test computer and the app's own time-zone setting all on America/Toronto.
-->

## What is wrong

**Sales Tax Collected** lists invoices that have been paid, so the shop can see the tax it collected.

An invoice for **$0.00** has no money and no tax on it, and nobody paid anything. Sales Tax Collected still lists it, marks it **Paid**, and gives it an **Invoice Paid Date** (the moment the invoice was made). On a busy location this adds many empty rows that look like paid sales.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **DVI Test**.
3. Make a work order for any customer.
4. In the **New Line** window, type a **Title** (for example "No-charge check"), pick **Labor Rate: General Labor**, leave **Estimated Time** and **Tech Time** empty, tick **Line Approved**, and click **Save & Close**.
5. Mark the line **Complete**.
6. On the **Finance** tab, click **Create Invoice**. Close the **New Customer Payment** window without paying. The invoice shows **Total $0.00** and no payments.
7. Open **Reports → Sales Tax Collected**.
8. Click **Date Range** and pick **Today**.
9. Find your invoice.

**Actual:** the $0.00 invoice is listed with Invoice Status **Paid**, Invoice Paid Date **Today**, and $0.00 in every money column.

**Expected:** the $0.00 invoice is **not listed**, because no money and no tax was collected.

Our example is work order **S1-38218** (customer ZZAUTOTEST P2C ZERO, Total $0.00, no payment). It is the first row on Sales Tax Collected for Today at DVI Test on 28 Oct 2026.

---

**Source:** Chris Ward, answer to question 31 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> (a) No, leave $0.00 invoices off this report, since no money or tax was collected.

## Screenshots

**1.** Sales Tax Collected, DVI Test, Today: S1-38218 for $0.00 listed as Paid with a paid date.

**2.** Work order S1-38218, Finance tab: Total $0.00, no payments.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026 (Toronto time), Admin.
- Browser and test computer set to the location's time zone (America/Toronto).
- Also seen on older $0.00 invoices at Staging Heavy Duty - 9919 (for example S2-38213, S2-38102, S2-36365, This month).
- Not checked on Production or on a QA branch.
