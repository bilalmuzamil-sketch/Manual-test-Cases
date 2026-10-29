<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
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
6. Optional: click the **Deposits** tab. Deposit **DEP-4763**, $100.00, "Deposit for Part Sale P2-2352", is **Held** (re-checked in the account data on 29 Oct; this tab was not opened in the re-check).
7. Click **Reports**, then **A/R Aging Detail** (under Accounts Receivable). Leave **Date** on today.
8. Find **P2-2352** in the **Current** section (open the section if it is closed).

**Actual:** A/R Aging Detail shows P2-2352 with Open Balance **$543.43**.

**Expected:** A/R Aging Detail shows P2-2352 with Open Balance **$443.43**, the same as the customer's Invoices tab, because the deposit was taken on this part sale and the part sale is invoiced.

A second example: **P2-2439** for **Bravo Mechanical Services** — $21.00 on A/R Aging, $16.00 on the Invoices tab ($5.00 deposit DEP-4801 held).

---

**Source:** Chris Ward, answer to question 33 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> Yes. Once the part sale is invoiced, its deposit lowers the A/R balance to match the Invoices tab. That's the same rule as SV-11690. Defect.

SV-11690 (Expected): *"one rule for deposits in A/R (aging = Invoices tab / statement, see SV-10799)"*.

## Screenshots

**1.** TestVT1 → Invoices tab: P2-2352, Total $543.43, Balance $443.43.

**2.** Reports → A/R Aging Detail, Date 2026-10-29: P2-2352, Open Balance $543.43.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 29 Oct 2026 (Karachi time), Admin.
- Browser, app time-zone setting and test computer set to the location's time zone (Asia/Karachi).
- The A/R reports cover every location in the organisation, so this shows from any location.
- Not checked on Production or on a QA branch. Not re-created on new test data; the two part sales above are existing staging records.

## For developers

After the SV-11690 change, A/R Aging leaves held deposits out. On a part sale the deposit stays "Held" after invoicing (applied amount 0, not linked to the invoice), but the customer account already lowers the invoice balance by it. So A/R shows the invoice at full and no credit. Once a part sale is invoiced, its deposit should reduce that invoice's open balance on A/R Aging (Summary, Detail and Collection), as the Invoices tab does.
