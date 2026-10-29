<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
SUMMARY: Reports - QB Unexported: one credit memo is listed twice, each time with a different error
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-2871 (Create a report for unexported items to QuickBooks)
PICTURES: pictures/P2-D6-1-qb-unexported-credit-memo-listed-twice.png
BASIS: Chris Ward's answer to question 37(b) (28 Oct 2026): "(b) Yes, one row per document, showing its latest error. Both are defects."
RE-CHECKED: 29 Oct 2026, 12:42–12:43 AM UTC (= 29 Oct, 5:42–5:43 AM in Karachi; screen, re-taken with the app's time-zone setting); server 12:04 AM UTC, staging v26.43.2-f8698cb, Staging Heavy Duty - 9919; session, browser, app time-zone setting and test computer all on Asia/Karachi.
NOTE FOR THE QA LEAD: scoped to Credit Memo Create rows (60 credit memos listed twice at Heavy Duty). Credit Memo Apply and Deposit Application also show several rows for one record, but each of those rows names a different invoice or credit, so they may be one row per thing applied — left to the developer to confirm, not claimed here. Lethbridge has none.
-->

## What is wrong

On **QB Unexported → Customers**, the same credit memo can appear **twice**, as two **Credit Memo Create** rows, each with a different error. The list should have **one row per document**, showing its **latest** error.

**Example:** customer **TestVT1** made **one** credit memo on Oct 22, 2026: **CM2-4533** ($150.00, for invoice P2-2447). QB Unexported shows **two** Credit Memo Create rows for TestVT1 that day, one second apart:

- "The Class mapped in your Bookkeeping settings no longer exists in QuickBooks…" (the later one, 5:29:46 PM Karachi time)
- "Originating Invoice … has not yet synced to QuickBooks…" (the earlier one, 5:29:45 PM)

1 credit memo, 2 rows. Only the first error above (the latest) should be shown, in one row.

(Because the No. column is blank on credit memo rows — ticket P2-D5 — the two rows cannot be told apart on screen today.)

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **Staging Heavy Duty - 9919**.
3. Click **Reports**, then **QB Unexported** (under Accounting).
4. Stay on the **Customers** tab.
5. Scroll down to the rows dated **Oct 22, 2026** for customer **TestVT1**.
6. Find the two **Credit Memo Create** rows for TestVT1, next to each other, just above **Invoice Create P2-2447**.
7. Click **Customers**, open **TestVT1**, click the **Invoices** tab and switch **Open only** off.
8. Look at the rows dated Oct 22, 2026: there is only one credit, **CM2-4533** (−$150.00, P2-2447).

**Actual:** QB Unexported lists the one credit memo CM2-4533 **twice**, each row with a different error.

**Expected:** **one** row for CM2-4533, showing its latest error ("The Class mapped in your Bookkeeping settings no longer exists in QuickBooks…").

---

**Source:** Chris Ward, answer to question 37 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026). Question (b): "Should each document appear only once?"

> 37. (a) Yes, every row shows its number. (b) Yes, one row per document, showing its latest error. Both are defects.

(Part (a) is ticket P2-D5.)

## Screenshots

**1.** QB Unexported → Customers at Staging Heavy Duty - 9919: the two Credit Memo Create rows for TestVT1 on Oct 22, 2026.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 29 Oct 2026 (Karachi time), Admin.
- Browser, app time-zone setting and test computer set to the location's time zone (Asia/Karachi).
- Not checked on Production or on a QA branch.

## For developers

Each failed export attempt adds a new unexported-items row for the same credit memo instead of updating the existing one. At Heavy Duty, 60 credit memos have 2+ `credit_memo_create` rows with the same `referenceId` (here 87891177-…, CM2-4533). Keep one row per document and overwrite its error with the latest. Please also check credit_memo_apply (43 records) and deposit_application (8 records) with several rows: decide whether those are one row per applied item or true repeats.
