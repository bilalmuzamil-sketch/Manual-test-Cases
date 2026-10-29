<!-- FILED 29 Oct 2026 as SV-11949 (https://shopview.atlassian.net/browse/SV-11949), parent SV-11936 (temporary parking epic), on the QA lead's go-ahead. Exact filed text: ../filed/html/P2-C2-SV-11949.html
EDITED 29 Oct 2026 after the filter recheck: Custom one-day range replaced by the default This month; GST figures re-checked ($987.05 should be $979.55); pictures 1 and 2 replaced by one This-month picture.
SUMMARY: Reports - Sales Tax Collected leaves out credit memos, so their tax is not taken off the totals
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-4573 (BE/FE Sales Tax report view)
PICTURES: ../filter-recheck/evidence/f3/SV-11949/F3-SV11949-1-all-tax-rates-this-month.png · P2-C2-3-customer-credit-memo.png
BASIS: Chris Ward's answer to question 30 (28 Oct 2026): "Yes. Show credit memos as negative rows on their date, and take their tax off the totals. Defect."
RE-CHECKED: 29 Oct 2026, 12:41 AM–12:43 AM UTC (5:41–5:43 AM on 29 Oct in Karachi), staging v26.43.2-f8698cb, Staging Heavy Duty - 9919 (the location has GST 5 %; DVI Test has only a 0 % rate, so it cannot show this). Session, browser, test computer and the app's own time-zone setting all on Asia/Karachi.
EXAMPLE DATA: existing credit memo CM2-4520 (customer Testing Company Milos, made by another tester for "QA SV-10488 staging taxable credit"). Nothing was created for this ticket.
NOTE FOR THE QA LEAD: SV-11517 (Open story, "Sales Tax: Accrual and Cash basis") plans to change how the report dates its rows. It does not cover credit memos being left out, so this is not a duplicate.
-->

## What is wrong

**Sales Tax Collected** tells the shop how much sales tax it collected in the chosen dates, so it knows what to pay to the government.

When the shop gives a customer a **credit memo** (for example, for a returned part), the tax on that credit goes back to the customer. Sales Tax Collected does not show credit memos at all, and its tax totals do not go down. So the report says the shop collected more tax than it kept.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **Staging Heavy Duty - 9919**.
3. Open **Customers** and find **Testing Company Milos**. Click the **Invoices** tab.
4. Find credit memo **CM2-4520**, dated **Oct 20, 2026**. Its Total is **-$131.25**: -$125.00 for the returned part and **-$6.25** GST (5 %).
5. Open **Reports → Sales Tax Collected**.
6. Leave **Date Range** on **This month** (from 1 November pick **Last month**, so the range is October 2026). Do not pick an **Invoice Status**.
7. Click **Search** and type **CM2-4520**. The table says "No record matches the search "CM2-4520"."
8. Clear the search and click **See All Tax Rates**. The date range stays This month.

**Actual:**
- CM2-4520 is not listed on the Invoices tab of the report.
- **See All Tax Rates** shows **GST 5 % $987.05** on its first row. No credit-memo tax is taken off.

**Expected:**
- CM2-4520 is listed on Oct 20, 2026 as a **negative row**: Subtotal **-$125.00**, Taxes GST **-$6.25**, Total **-$131.25**.
- Its tax is taken off the totals, and so is the other October credit-memo tax: $6.25 on CM2-4520 + $1.25 on Oct 21 = $7.50, so GST = $987.05 − $7.50 = **$979.55**.

The same happens for every credit memo with tax in any date range. For example, for Oct 20, 2026 alone (Custom date range) GST shows $57.44 and should be $57.44 − $6.25 = $51.19.

---

**Source:** Chris Ward, answer to question 30 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> Yes. Show credit memos as negative rows on their date, and take their tax off the totals. Defect.

## Screenshots

**1.** Sales Tax Collected, Staging Heavy Duty - 9919, See All Tax Rates, This month, no Invoice Status picked: GST 5 % $987.05 (should be $987.05 − $7.50 = $979.55).

**2.** Customer Testing Company Milos, Invoices tab: credit memo CM2-4520, Oct 20, 2026, -$131.25.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 29 Oct 2026 (Karachi time), Admin.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (Asia/Karachi).
- Not checked on Production or on a QA branch.
