<!-- FILED 29 Oct 2026 as SV-11935 (https://shopview.atlassian.net/browse/SV-11935) on the QA lead's go-ahead ("File a new ticket with complete reference"). Text below = what was filed.
SUMMARY: Reports - A/R Aging shows an invoiced part sale at full amount; its deposit is not taken off
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-5026 (FE A/R aging detail report) · relates to SV-11690 (A/R Aging counts held deposits as negative receivables — aging ≠ customer Invoices-tab Balance; Ready for Production)
PICTURES: pictures/P2-D1-1-customer-invoices-tab-p2-2352.png · pictures/P2-D1-2-ar-aging-detail-p2-2352.png
BASIS: Chris Ward's answer to question 33 (28 Oct 2026): "Yes. Once the part sale is invoiced, its deposit lowers the A/R balance to match the Invoices tab. That's the same rule as SV-11690. Defect."
RE-CHECKED: 29 Oct 2026, 12:37 AM UTC (= 29 Oct, 5:37 AM in Karachi; screen, re-taken with the app's time-zone setting; A/R request asOfDate 2026-10-29T18:59:59.999Z = end of 29 Oct in Karachi); server 12:04 AM UTC, staging v26.43.2-f8698cb, Staging Heavy Duty - 9919; session, browser, app time-zone setting and test computer all on Asia/Karachi.
DUPLICATE CHECK: no open ticket covers part-sale deposits on A/R Aging (JQL in SUMMARY-p2d.md). SV-11690 is the rule this breaks, not this case; the QA lead may prefer a comment on SV-11690 instead (draft in SUMMARY-p2d.md).
-->

## What is wrong

When a customer pays a deposit on a part sale and the part sale is then invoiced, the customer's **Invoices** tab takes the deposit off the invoice balance, but **A/R Aging Detail** still shows the invoice at its full amount.

So the customer looks as if they owe more on A/R Aging than they really do.

**Example:** part sale **P2-2352** for customer **TestVT1** is $543.43, and the customer paid a $100.00 deposit on it (**DEP-4763**).

- Invoices tab: $543.43 − $100.00 = **$443.43** owed.
- A/R Aging Detail: **$543.43** owed. The $100.00 deposit is not taken off, and it is not listed anywhere else on the report either.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **Staging Heavy Duty - 9919**.
3. Click **Customers** and open **TestVT1**.
4. Click the **Invoices** tab.
5. Find **P2-2352** (dated Oct 15, 2026). It shows Total **$543.43** and Balance **$443.43**, Partially Paid.
6. Optional: click the **Deposits** tab. Deposit **DEP-4763**, $100.00, "Deposit for Part Sale P2-2352", is listed as **Held**.
7. Click **Reports**, then **A/R Aging Detail** (under Accounts Receivable). Leave **Date** on today.
8. Find the row for **P2-2352** (Invoice, TestVT1, Oct 15, 2026).

**Actual:** A/R Aging Detail shows P2-2352 with Amount and Open Balance **$543.43**.

**Expected:** A/R Aging Detail shows P2-2352 with Open Balance **$443.43**, the same as the customer's Invoices tab, because the deposit was taken on this part sale and the part sale is invoiced ($543.43 − $100.00 = $443.43).

A second example: **P2-2439** for **Bravo Mechanical Services** — $21.00 on A/R Aging, $16.00 on the Invoices tab ($5.00 deposit DEP-4801 held).

---

**Source:** Chris Ward, answer to question 33 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> Yes. Once the part sale is invoiced, its deposit lowers the A/R balance to match the Invoices tab. That's the same rule as SV-11690. Defect.

**Related ticket, the rule this breaks:** SV-11690, "A/R Aging counts held deposits as negative receivables — aging ≠ customer Invoices-tab Balance" (Ready for Production, https://shopview.atlassian.net/browse/SV-11690). Its expected result:

> one rule for deposits in A/R (aging = Invoices tab / statement, see SV-10799)

SV-11690 fixes held **work-order** deposits. On 29 Oct those were no longer counted on A/R Aging, as intended. **Part-sale** deposits still break the same rule, which is what this ticket reports.

A/R aging detail report story: SV-5026, "FE A/R aging detail report" (https://shopview.atlassian.net/browse/SV-5026).

## Screenshots

**1.** TestVT1 → Invoices tab: P2-2352, Total $543.43, Balance $443.43.

**2.** Reports → A/R Aging Detail, Date 2026-10-29: P2-2352, Open Balance $543.43.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 29 Oct 2026 (Karachi time), Admin.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (Asia/Karachi).
- The A/R reports cover every location in the organisation, so this shows from any location.
- Not checked on Production or on a QA branch. The two part sales above are existing staging records.
