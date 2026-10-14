# Confluence 788430850 "Dashboard" — all comments, read 14 Oct 2026

Page: https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/788430850/Dashboard
(version 44, last modified 13 Oct 2026 18:37, Chris Ward).

**How read:** `getConfluencePageFooterComments` (status current, replies included, 25 per comment, limit 100 → 1 root +
4 replies; status archived → 0) and `getConfluencePageInlineComments` for resolution status open (5 threads, 5 replies),
resolved (0), reopened (0), dangling (0), replies included. Author ids: `712020:aa00b8d6…` = **Chris Ward** (page
owner / PO — the same id is the page author); `557058:ead5f72a…` = **Milan Zivanovic** (developer; id resolved in the DVI
V2 check of the same day, `build/digital-inspections-v2/currency-2026-10-14/confluence-comments-2026-10-14.md`).

**Totals:** 1 footer thread (1 root + 4 replies) + 5 inline threads (5 roots + 5 replies) = **15 comments**.
**Newest comment on the page: 2026-09-24T16:48:02Z. No comment of any kind was made after 7 Oct 2026 (our last full
update), nor after 24 Sep, so no decision was made in a comment after 7 Oct.** Every decision in these threads is already
written into the page body (v35–v37 edits named in the replies; all present in v42 and v44).

Bodies below are verbatim as returned (markdown), unedited.

---

## Footer thread 859275271
Link: https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/788430850/Dashboard?focusedCommentId=859275271

### 859275271 — Milan Zivanovic — 2026-09-15T19:25:50Z (root)

Hi Chris, thanks for a very precise spec. Writing the technical plan turned up five points that need a Product call, plus an FYI. Each has our recommendation, so "go with the recommendation" is a complete answer. Please reply by number.

**1. Voided invoices and the Sales report (S3-E2, S3-R1, S5-E3), blocking**

S3-E2 says the reports already exclude voided invoices through one shared rule. The Sales report doesn't: its invoice total includes voided invoices. The shared rule exists and newer reports (e.g. Sales by Customer) use it, but the Sales report predates it. The Sales report also leaves out invoices with no company, which S5-E3 counts as a "no company" customer.

If the Revenue tile matches the Sales report as it is today, Revenue would include voids and leave out no-company sales. That breaks S3-E2.

➜ Recommendation: fix the Sales report in this project so it excludes voided invoices through the shared rule and includes no-company invoices. The Revenue tile then matches it. **This** **changes the Sales report's existing totals** for any range with voided or no-company invoices. We're measuring how much in production and will post the numbers here. OK to proceed?

**2. Sales by Customer sparkline window (S5-R5 vs S7-R4 / S7-E1)**

S5-R5 fixes this sparkline to the trailing twelve months. S7-R4 and S7-E1, which S7-R1 applies to this tile, say the sparkline redraws for the tile's selected range, so the headline and sparkline describe the same window.

➜ Recommendation: follow Story 7. The sparkline covers the selected range, bucketed per S4-R11. Each point is the count of distinct customers with sales in that bucket.

**3. At Risk sparkline: what is one point? (S5-R13), blocking**

"The at-risk count over the trailing twelve months" leaves open:

(a) Granularity: one point per month (12 points)?

(b) Meaning: customers at risk as of the last day of that month, using the selected inactivity window?

(c) History: recomputed from today's data (a later void changes past points), or recorded as it was at the time (past points never change)?

➜ Recommendation: (a) monthly; (b) as of each month's last day in the workplace's timezone, using the selected window; (c) recomputed from current data. The current month's point equal the headline, so the sparkline can never contradict the headline or the table.

This is the most expensive calculation on the dashboard, so the answer shapes the design.

**4. Default date range per tile (Story 7, S6-R16)**

The spec doesn't give each tile's default range. Date ranges aren't in S6-R16's remembered list, so every visit resets to the default. The current dashboard does remember them.

➜ Recommendation: use the design's defaults. The four KPI tiles open on **This Month** and Sales by Customer on **Last 12 Months**. Ranges are not remembered between visits.

**5. At Risk Customers table size and order (S6-R8)**

No limit or sort order is defined. At a 30-day window a large shop can have hundreds of at-risk customers. The current dashboard silently cuts the list at 200 rows, so the table can disagree with the headline.

### 859308044 — Chris Ward — 2026-09-15T20:46:57Z (reply)

Hi Milan, thanks, this is exactly the right set of questions. Answers by number.

**1. Voided invoices and the Sales report.** Go with the recommendation, with three conditions. Fix the Sales report to exclude voided invoices through the shared rule and to include no-company invoices, and point Revenue at it. A voided invoice is not revenue and never was, so the Sales report is wrong today and the dashboard should not inherit that. The conditions: post the production impact numbers here before the change merges, because shops may have used those totals for commissions or tax filings; it ships with a release note that says plainly that Sales report totals will move for ranges containing voided or no-company invoices; and tell me if anything other than the report reads that same total, because that would widen the blast radius. I am also correcting the spec: S3-E2's context note claims all reports already share the void rule, and that is not true today.

**2. Sales by Customer sparkline window.** Go with the recommendation. Story 7 wins, the sparkline follows the tile's selected range, bucketed per S4-R11, each point the count of distinct customers with sales in that bucket. S5-R5 is wrong and I am fixing it to match.

**3. At Risk sparkline.** Go with the recommendation, with one correction. Monthly granularity, computed as of each month's last day in the workplace timezone using the selected inactivity window, recomputed from current data. The correction is on the last point: for the current month, compute it as of now, not as of the month's last day, which has not happened yet. That is what makes the final point equal the headline. Recomputing from current data is right and consistent with S3-E2, which says a void is excluded even when deciding a customer's most recent invoice, so a recorded history would drift away from the truth the rest of the dashboard tells. On cost: At Risk has no matching report, so the parity rule in S3-R1 does not bind it. If you need to cache the eleven historical points to make this affordable, that is fine, provided the current point is always live so the sparkline can never contradict the headline or the table.

**4. Default date range per tile.** Go with the recommendation. Four KPI tiles open on This Month, Sales by Customer on Last 12 Months, and ranges are not remembered between visits. Flagging it explicitly since it is a change from today: the current dashboard does remember them, and S6-R16 leaves date ranges out on purpose, so a user will notice the reset. I am adding the defaults to Story 7 so they are written down.

**5. At Risk table size and order.** No recommendation came through on this one, so here is my call. Sort the table by twelve-month revenue, highest first, so the biggest money at risk is at the top, with customer name as the tiebreaker. Never silently truncate: a table that stops at 200 rows while the headline says 342 is a defect, because the two disagree. Either show every row with virtualised scrolling, or cap the rows and say so on screen, for example "Showing 200 of 342 at-risk customers", with the full count still in the headline. My preference is the first if it performs.

One more thing: your comment looks truncated. Item 5 arrives with no recommendation, and the FYI you mention in the opening line is not there. Repost whatever got cut and I will answer it the same way.

### 861274126 — Milan Zivanovic — 2026-09-16T09:00:50Z (reply)

**Reposting the part that got cut, plus answers to your conditions**

You're right, the comment was truncated partway through item 5. Here's the missing recommendation and the FYI section.

**5. At Risk Customers table — the recommendation that got cut**

➜ Ten rows per page, like the Sales by Customer table in the design, sorted by twelve-month revenue, highest first, with the true total shown next to the pages ("1–10 of 342"). The headline always counts every at-risk customer.

Against your call: the sort matches, and we'll add customer name as the tiebreaker. On truncation we agree — the table must never stop silently. We'd rather not load every row for virtualised scrolling: at a 30-day window this is a landing-page query that can return thousands of rows, and this tile is among the first things a user sees. Paging shows the true total on screen, so the table and the headline never disagree, and the page stays fast. If you'd still prefer virtualised scrolling, we'll measure it on the largest shop first and come back with the number. Which do you want?

**6. FYI (no answer needed)**

* The design shows the desktop layout only. For windows narrower than 1024 px we'll follow the written rules: tiles in one column (S12-N1), no in-place expansion, a "View Report" footer link instead of "View details" (S6-E1, S6-E2), and no footer link on At Risk (S6-E3). The design also doesn't show loading, a tile that failed to load, "n/a", or the zero states; we'll build those from S6-R14, S6-R15, S3-E3 and S5-E1/E2, following existing app patterns.
* The design's Inline view, "Expand all" and change indicators are out. We're following the spec (S6-N1, S6-N2, S4-N1).
* Performance: to hold S3-R1 exactly, every figure is computed live, with no cache, and the queries are engineered for home-page traffic. For context, today's dashboard takes about 1 s at the median and 19 s for the slowest 5% of loads in production, mostly from notification, reminder and AR queries that v1 drops. v1 aims to load no slower than the Work Orders list it replaces, which serves 95% of requests within 0.31 s. Dashboard reads also move to the database read replica, and the matching reports move with them, so a tile and its report always read the same copy.

**Your conditions on item 1**

* Production impact numbers: yes, posted here before the change merges. They're being measured now.
* Release note: yes, in plain language, saying Sales report totals move for ranges containing voided or no-company invoices.
* Blast radius: answered in the next comment.

**On item 3:** agreed. The final point is computed as of now rather than month-end, and we'll cache the eleven historical points while keeping the current point live.

### 862060545 — Milan Zivanovic — 2026-09-16T09:01:07Z (reply)

**Blast radius for item 1, as promised**

**Your specific worry doesn't apply.** ShopView has no commission feature, no payout calculation and no tax-filing feature. The only "commission" in the product is a pay-type label on a staff record with no calculation behind it. Shops cannot be running commission or tax numbers off this total from inside ShopView.

**The Sales report has no export, no PDF and no scheduled email.** Its total appears on exactly one screen, which limits how far this change travels.

**The same number is reproduced in four other places, all carrying the same flaw:**

1. **The dashboard's Revenue tile, revenue chart, average-repair-order figure and their drill-downs.** These were built to match the Sales report penny for penny. v1 rebuilds the Revenue tile on the fixed calculation, and the other figures aren't among the six tiles, so they leave the dashboard with this release. No action needed from you.
2. **Service Advisor Analysis.** This is the one that needs your call. It is a direct copy of the Sales report's invoice query with both flaws. The dashboard's Billing Efficiency tile and its ELR must equal that report (S3-R1) and must exclude voided invoices (S3-E2). Both can only be true if we fix that report in the same pass. **This moves a second shipped report's numbers: advisor revenue and ELR will drop for periods containing voided invoices, and advisor figures will gain walk-in sales.** The same three conditions you set on item 1 apply. May we include it?
3. **The Sales Follow-Up report** ("total spend" per customer) and **4. the Customers Spending widget** have the void flaw on a slightly different basis. Neither feeds a dashboard tile. We suggest separate tickets rather than widening this project. Agreed?

**What will not move:** Sales by Customer and Sales by Representative already exclude voided invoices and already include walk-in sales, so a shop paying reps off Sales by Representative sees no change. Everything sent to the accounting service and to QuickBooks uses a different figure and already excludes voids. The Sales Tax Report doesn't use this number and won't move either.

**One thing we found while looking, unrelated to this change:** the Sales Tax Report has its own gap — it doesn't exclude voided invoices. It isn't affected by our work, but given it's the tax surface you may want it looked at separately. Shall we file it?

**Net effect on the Sales report total:** voided invoices come out, so the total drops for shops that void. Walk-in sales with no customer record go in, so it rises for shops that invoice that way. For most shops one or both is zero. We'll have the production numbers for you shortly and can tell an affected shop which of the two moved their figure.

### 861339665 — Milan Zivanovic — 2026-09-16T09:37:37Z (reply)

**Production impact numbers for item 1**

Measured on production, last 12 months, 213,012 invoices across 650 shops:

* **Voided invoices: 13, totalling $15,883.98, across 10 shops.** Those ten will see the Sales report total drop by that amount for ranges containing them. The other 640 see no change.
* **Invoices with no customer record: none.** That half of the fix moves no number today; it closes a gap rather than changing history. Worth knowing for S5-E3: the "no company" customer has no data behind it yet.
* **Invoices with no work order: none.**

So the change is real but small: ten shops, under $16,000 across a year. The same 13 invoices are all that would move in Service Advisor Analysis too, if you approve fixing it (previous comment).

**Two things these measurements settle:**

* **At Risk table:** you preferred showing every row with virtualised scrolling "if it performs". It performs. The busiest shop in production has 8,875 invoices but only 14 distinct customers, so at-risk lists run to tens of rows, not thousands. We'll show every row, with a safety cap at 500 and an on-screen "Showing 500 of N" if a shop ever passes it. Your call stands and we're withdrawing our paging suggestion.
* **At Risk history:** you allowed us to cache the eleven historical points. We won't need to. Computing all twelve live takes about 56 ms on the busiest shop, so every point stays live and can never drift from the headline.

### 862650369 — Chris Ward — 2026-09-16T13:09:31Z (reply)

Hi Milan, this is excellent work, and I want to say so before the answers. The blast radius write-up is the part that made the decision easy: you went and found every other place the number is reproduced, told me which ones move and which do not, and came back with production figures rather than an estimate. That is exactly what I needed and it is more than I asked for. Answers by number.

**1. Service Advisor Analysis: yes, fix it in this pass.** These figures need to match each other and they need to be right, and today they are neither. A report built as a copy of a query with two known flaws is going to keep producing wrong advisor revenue and wrong ELR whether or not the dashboard exists, so fixing it is worth doing on its own merits and not only to satisfy the parity rule. The same three conditions apply: production impact numbers posted here before it merges, which from your figures is the same 13 invoices and so is already answered unless the walk-in half moves something; a release note that says plainly that advisor revenue and ELR move for periods containing voided invoices and that advisor figures now include walk-in sales; and tell me if anything reads Service Advisor Analysis numbers that we have not already accounted for.

**2. Sales Follow-Up and the Customers Spending widget: agreed, separate tickets.** Neither feeds a tile, so neither belongs in this project. File them with enough detail that whoever picks them up does not have to rediscover the cause, and link them back to this page so the connection survives.

**3. Sales Tax Report: worth filing.** Thank you for flagging it rather than walking past it. It is the tax surface, so I want it visible in the backlog even though nothing about our work touches it. Same treatment, its own ticket, linked here.

**On the numbers.** Ten shops and under $15,900 across a full year is small enough that I am comfortable, and it does not change the principle: a voided invoice was never revenue and the report should never have counted it. The zero result for invoices with no customer record is useful in a different way. It means that half of the fix changes no history at all and only closes a gap going forward, and it tells me the "no company" customer in S5-E3 has no data behind it yet. I have noted that on the page so nobody later reads that requirement and assumes it is exercising a real path.

**At Risk table.** Agreed, and thank you for measuring rather than arguing the point. Every row, safety cap at 500, and the on-screen "Showing 500 of N" if a shop ever passes it. I have replaced my illustrative "Showing 200 of 342" in S6-R8 with exactly that.

**At Risk sparkline.** Good. All twelve points live is better than what I was willing to settle for, and 56 ms on the busiest shop is a comfortable margin. The requirement already says every point is recomputed from current data, so nothing changes on the page, but it is now affordable as written rather than as a concession.

**Your FYI items.** No objection to any of them. The narrow-viewport rules, the design elements you are dropping, and the performance plan all match what the PRD says. Holding v1 to no slower than the Work Orders list it replaces is the right bar.

**Three edits are now on the page (v35):** S6-R8 carries the real cap and message, S3-E2 gains a context note with your production numbers and the blast radius findings so they live on the artifact and not only in this thread, and S5-E3 gains a note that no such invoice exists in production today.

---

## Inline threads (all 5 open; none resolved, reopened or dangling)

### 887914514 — Chris Ward — 2026-09-24T14:53:26Z — on "Demo Branch"
UI design (re-label)

- **888537092 — Chris Ward — 2026-09-24T16:47:55Z:** Done in v36. The header rows are now Epic / Owner / UI design, and UI design links to https://sv8311.qa.shopview.com. The separate QA Environment row was removed because it repeated the same link.

*(Note, ours: v44 reads "Demo Branch → https://sv8311.qa.shopview.com" and a separate "Design → https://claude.ai/artifact/Wae9DFQ8PJQBy8mbLsL5ge" row; the page body was changed again after this reply.)*

### 887390356 — Chris Ward — 2026-09-24T14:53:47Z — on "Design:"
Drop this, not faithfully accurate

- **888537097 — Chris Ward — 2026-09-24T16:47:59Z:** Done in v36. The header Design line and its link to the design directions canvas are removed.

### 888209411 — Chris Ward — 2026-09-24T15:08:16Z — on "Story 9: Chart Behavior"
Review chart min/max 

- **888340494 — Chris Ward — 2026-09-24T16:48:00Z:** Done in v37. New S9-R8: every chart's vertical axis starts at 0, on percentage and dollar charts alike. The only exception is a value below 0 in the range, where the axis extends below 0 to show it. The build now matches, and the shop-average line that S9-R7 rules out has been removed from the Technician Efficiency, Technician Utilization and Billing Efficiency charts.

### 888471553 — Chris Ward — 2026-09-24T15:09:07Z — on "Design:"
Replace design document with QA 8311 everywhere

- **887193606 — Chris Ward — 2026-09-24T16:48:01Z:** Done in v36. Story 12's design line and the ten other stories' design lines now link to https://sv8311.qa.shopview.com.

### 887422990 — Chris Ward — 2026-09-24T15:12:59Z — on "S1-R6: The "Dashboard" entry is shown to any user who has the"
Drop the feature flag altogether, fix this requirement. Hide behind “reports” permission only

- **888012812 — Chris Ward — 2026-09-24T16:48:02Z:** Done in v36. S1-R6: the Reports permission (reportsPageAccess) is the only gate, with no organization feature. S1-R7 and S1-R8 were updated to match, and S1-N3 and S1-N4 are marked Withdrawn. The build now checks only the permission, and QA 8311 is deployed with it.

---

## Decisions after 7 Oct 2026 in comments
**None.** Newest comment 24 Sep 2026. All rulings above (void exclusion + Sales/Service Advisor Analysis fix, Sales by
Customer sparkline follows the tile range, At Risk sparkline monthly/as-of-now, default ranges not remembered, At Risk
table every row + 500 cap, axis starts at 0, feature flag dropped, design links) are already in the page body and
already in v42.

*Observation:* the 24 Sep reply says "S1-N3 and S1-N4 are marked Withdrawn"; v44 simply omits them (S1-N1, S1-N2, then
S1-N5…). Same in v42 — no change.
