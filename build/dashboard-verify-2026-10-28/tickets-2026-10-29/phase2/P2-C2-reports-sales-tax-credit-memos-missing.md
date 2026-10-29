<!-- FILED 29 Oct 2026 as SV-11949 (https://shopview.atlassian.net/browse/SV-11949), parent SV-11936 (temporary parking epic), on the QA lead's go-ahead. Exact filed text: ../filed/html/P2-C2-SV-11949.html
SUMMARY: Reports - Sales Tax Collected leaves out credit memos, so their tax is not taken off the totals
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-4573 (BE/FE Sales Tax report view)
PICTURES: pictures/P2-C2-1-sales-tax-oct20.png · pictures/P2-C2-2-all-tax-rates-oct20.png · pictures/P2-C2-3-customer-credit-memo.png
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
6. Click **Date Range**, pick **Custom**, and set both **From** and **To** to **Oct 20, 2026**.
7. Look at the list: only four invoices are shown, and CM2-4520 is not there.
8. Click **See All Tax Rates**. The date range stays Oct 20, 2026.

**Actual:**
- CM2-4520 is not listed on the Invoices tab of the report.
- **See All Tax Rates** shows **GST 5 % $57.44**, the tax on the four invoices only.

**Expected:**
- CM2-4520 is listed on Oct 20, 2026 as a **negative row**: Subtotal **-$125.00**, Taxes GST **-$6.25**, Total **-$131.25**.
- Its tax is taken off the totals: GST = $57.44 − $6.25 = **$51.19**.

The same happens for every credit memo with tax in any date range. For example, at the same location in **This month** (October) the GST totals leave out $7.50 of credit-memo tax.

---

**Source:** Chris Ward, answer to question 30 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> Yes. Show credit memos as negative rows on their date, and take their tax off the totals. Defect.

## Screenshots

**1.** Sales Tax Collected, Staging Heavy Duty - 9919, Custom Oct 20, 2026: four invoices listed, no row for credit memo CM2-4520.

**2.** See All Tax Rates for the same day: GST 5 % $57.44 (should be $51.19).

**3.** Customer Testing Company Milos, Invoices tab: credit memo CM2-4520, Oct 20, 2026, -$131.25.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 29 Oct 2026 (Karachi time), Admin.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (Asia/Karachi).
- Not checked on Production or on a QA branch.
