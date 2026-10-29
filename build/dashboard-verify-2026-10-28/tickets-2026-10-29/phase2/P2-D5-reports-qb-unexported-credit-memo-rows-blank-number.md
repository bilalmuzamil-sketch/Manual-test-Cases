<!-- FILED 29 Oct 2026 as SV-11956 (https://shopview.atlassian.net/browse/SV-11956), parent SV-11936 (temporary parking epic), on the QA lead's go-ahead. Exact filed text: ../filed/html/P2-D5-SV-11956.html
SUMMARY: Reports - QB Unexported: credit memo rows (and other credit and deposit rows) have a blank No.
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-2871 (Create a report for unexported items to QuickBooks) · relates to SV-4929 (Unexported Listing - missing data; Done)
PICTURES: pictures/P2-D5-1-qb-unexported-credit-memo-blank-no.png
BASIS: Chris Ward's answer to question 37(a) (28 Oct 2026): "(a) Yes, every row shows its number. … Both are defects."
RE-CHECKED: 29 Oct 2026, 12:42 AM UTC (= 29 Oct, 5:42 AM in Karachi; screen, re-taken with the app's time-zone setting); server 12:04 AM UTC at both locations (28 Oct, 6:04 PM in Lethbridge), staging v26.43.2-f8698cb, Staging Heavy Duty - 9919 (screen + server) and Staging Lethbridge - 4310 (server); session, browser, app time-zone setting and test computer on each location's own zone.
NOTE FOR THE QA LEAD: payment rows are blank too, but a payment has no number of its own yet (SV-10588, "Give every received payment its own payment number", Board Backlog); a payment row shows the reference number only when one was typed. The ticket asks for the number on every row that has one, and names payments in the developer note.
-->

## What is wrong

On **QB Unexported → Customers**, every **Credit Memo Create** row has an empty **No.** column, so you cannot tell which credit memo failed to reach QuickBooks without opening the customer's account.

Invoice rows show their number (for example **S2-38098**), and deposit rows show theirs (for example **DEP-4813**). Credit memos have a number too (for example **CM2-4533**), but it is not shown.

The same blank No. is on **Credit Memo Apply** and **Credit Memo Refund** rows, and on most **Deposit Application** rows.

**Example:** at Staging Heavy Duty - 9919 the row "Credit Memo Create · DashFresh Alpha MQ · Oct 27, 2026" shows nothing under No. It should show the credit memo's number (CM2-…).

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **Staging Heavy Duty - 9919**.
3. Click **Reports**, then **QB Unexported** (under Accounting).
4. Stay on the **Customers** tab.
5. Find any row whose Type is **Credit Memo Create** — for example **DashFresh Alpha MQ**, dated Oct 27, 2026 (shown as "2 days ago" on 29 Oct).
6. Look at the **No.** column of that row.
7. Optional: switch to **Staging Lethbridge - 4310** and repeat; every Credit Memo Create row there is blank too.

**Actual:** the No. column is blank on every Credit Memo Create row (and on Credit Memo Apply, Credit Memo Refund and most Deposit Application rows).

**Expected:** every row shows its document's number in No. — the credit memo number (for example **CM2-4533**) on credit memo rows, the deposit number on deposit rows, as invoice rows already do.

---

**Source:** Chris Ward, answer to question 37 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026). Question (a): "Should every credit memo row show its number, for example CM2-4476?"

> 37. (a) Yes, every row shows its number. (b) Yes, one row per document, showing its latest error. Both are defects.

(Part (b) is a separate ticket: P2-D6.)

## Screenshots

**1.** QB Unexported → Customers at Staging Heavy Duty - 9919: a Credit Memo Create row with a blank No., next to an invoice row that shows S2-38098.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 29 Oct 2026 (Karachi time), Admin.
- Browser, app time-zone setting and test computer set to the location's time zone (Asia/Karachi). Lethbridge was read with the session on America/Edmonton.
- Not checked on Production or on a QA branch.
