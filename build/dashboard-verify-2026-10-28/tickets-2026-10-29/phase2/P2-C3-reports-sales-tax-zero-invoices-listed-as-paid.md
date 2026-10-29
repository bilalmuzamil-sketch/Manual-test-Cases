<!-- FILED 29 Oct 2026 as SV-11950 (https://shopview.atlassian.net/browse/SV-11950), parent SV-11936 (temporary parking epic), on the QA lead's go-ahead. Exact filed text: ../filed/html/P2-C3-SV-11950.html
EDITED 29 Oct 2026 after the filter recheck: Date Range: Today replaced by the default This month; picture 1 replaced; "Where it was seen" updated to the follow-up runs.
SUMMARY: Reports - Sales Tax Collected lists $0.00 invoices as Paid, with a paid date
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-4573 (BE/FE Sales Tax report view)
PICTURES: ../filter-recheck/evidence/f3/SV-11950_51/F3-SV11950-1-zero-invoice-this-month.png · P2-C3-2-zero-invoice-finance.png
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
8. Leave **Date Range** on **This month** (from 1 November pick **Last month**, so the range is October 2026) and do not pick an **Invoice Status**.
9. Find your invoice.

**Actual:** the $0.00 invoice is listed with Invoice Status **Paid**, an Invoice Paid Date on the day it was made, and $0.00 in every money column.

**Expected:** the $0.00 invoice is **not listed**, because no money and no tax was collected.

Our example is work order **S1-38218** (customer ZZAUTOTEST P2C ZERO, Total $0.00, no payment). It is listed, as Paid with a paid date, on Sales Tax Collected for This month at DVI Test.

---

**Source:** Chris Ward, answer to question 31 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> (a) No, leave $0.00 invoices off this report, since no money or tax was collected.

## Screenshots

**1.** Sales Tax Collected, DVI Test, This month, no Invoice Status picked: S1-38218 for $0.00 listed as Paid with a paid date.

**2.** Work order S1-38218, Finance tab: Total $0.00, no payments.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.3-8ad4001 (the picture is from v26.43.2-9272076, same result), 29 Oct 2026 (5:42–6:20 AM Toronto time), Admin, DVI Test.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto).
- Also seen on older $0.00 invoices at Staging Heavy Duty - 9919 (for example S2-38213, S2-38102, S2-36365, This month).
- Not checked on Production or on a QA branch.
