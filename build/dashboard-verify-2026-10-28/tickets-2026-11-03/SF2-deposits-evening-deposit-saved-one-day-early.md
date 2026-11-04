<!-- FILED 4 Nov 2026 00:25 UTC as SV-12161 (https://shopview.atlassian.net/browse/SV-12161) after the evening re-check reproduced it on v26.45.0-f417d48. Filed text: filed/SV-12161.html -->
<!-- DRAFT 3 Nov 2026. QA lead's go-ahead (3 Nov 2026): "This ticket [SV-11970] has already been worked on, can we create a new ticket for the issue you are referrring to?"
FILE ONLY AFTER the fresh re-check on the CURRENT staging build (v26.43.5-d10ef51 or later) reproduces it, after 7 PM Toronto (00:00 UTC or later).
The example, figures and pictures below are then replaced with that run's. If it does not reproduce, DO NOT FILE; report to the QA lead.
SUMMARY: Deposits - a deposit taken in the evening at a North American location is saved one day early (customer's Deposits tab shows the day before)
TYPE Bug · PARENT none (QA lead moves it) · PRIORITY Medium · PRODUCT AREA Customers (as SV-11573)
LINKS: relates to SV-11573 (Deposit date saved one day early; Done, fixed v26.43.1 — this is its North American evening case) · relates to SV-11970 (Finance tab date; Code Review)
DUPLICATE CHECK 3 Nov 2026: project SV, created since 22 Oct, summary ~ deposit OR text ~ "deposit date": 20 results; none open covers this. SV-11573 is Done.
EXPECTED BASIS:
 - "Deposits for Work Orders" PRD (Confluence page 263094273, last modified Apr 16, 2026): Deposit Date "Default value: Today"; Customer → Payments "Date: the date the deposit was made".
 - SV-11573 (Done): its QA case C872466 "Deposit dated today in a US evening saves today's date".
EVIDENCE (29 Oct 2026, build v26.43.3-8ad4001): build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f3/SF1/evening-2026-10-29/RESULT.md
-->

## What is wrong

When a deposit is recorded in the evening at a North American location, it is **saved on the day before** the date that was picked. At Toronto locations this happens after **7 PM** (after 8 PM before 1 November).

The customer's **Deposits** tab then shows the deposit a day early: a deposit dated today reads **"Yesterday"**. The work order's **Finance** tab shows the date that was picked, so the two screens disagree.

[SV-11573](https://shopview.atlassian.net/browse/SV-11573) fixed this for locations ahead of UTC (such as Karachi). This is the North American evening case. Its own test case, [C872466](https://shopview.testrail.io/index.php?/cases/view/872466) "Deposit dated today in a US evening saves today's date", is the one that fails.

**Example:** deposit **DEP-4821** on work order **S1-38222** (DVI Test, customer ZZAUTOTEST P2C DEP). Deposit Date left on today, **Oct 29, 2026**, recorded at **8:27 PM** Toronto time.

- Work order → **Finance** tab: "(Deposit) **Oct 29, 2026** - Cash". Right.
- Customer → **Deposits** tab: **"Yesterday"** (Oct 28). Wrong by one day.

A past date is shifted the same way: DEP-4822, dated **Oct 28** and recorded at 8:42 PM, reads **"2 days ago"** (Oct 27) on the Deposits tab.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **DVI Test** (Toronto time).
3. Wait until after **7 PM** Toronto time.
4. Open a work order that is not invoiced yet (for example **S1-38222**, customer **ZZAUTOTEST P2C DEP**) and click the **Finance** tab.
5. Click **Add Deposit**. Leave **Deposit Date** on today. Pick **Payment Method: Cash**, type **Deposit Amount: 5.00**, and click **Record Deposit**.
6. Open **Customers**, open the same customer, and click the **Deposits** tab. Switch **Open only** off. Look at the new deposit's **Date**.

**Actual:** the Deposits tab reads **"Yesterday"** for a deposit dated today.

**Expected:** the Deposits tab reads **"Today"**, the date that was picked, the same as the Finance tab.

---

**Source:** "Deposits for Work Orders" (Confluence, product space, last modified Apr 16, 2026):

> **Deposit Date** … Default value: Today (based on user's current datetime from device) … The date can be in the past

> The Customer → Payments page will display all deposit payments … Date: the date the deposit was made

[SV-11573](https://shopview.atlassian.net/browse/SV-11573) (Done), QA case added for the fix:

> C872466 Deposit dated today in a US evening saves today's date

## Screenshots

(to be taken in the fresh re-check: 1. the Finance tab line; 2. the customer's Deposits tab with the same deposit)

## Where it was seen

- Staging, build v26.43.3-8ad4001, 29 Oct 2026, 8:27–8:55 PM Toronto time, Admin, DVI Test. (Re-check on the current build: to be added.)
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto).
- Deposits saved earlier in the day are not affected (DEP-4819, recorded at 7:20 AM, reads "Today" on its day).
- Not checked on Production, on a QA branch, in QuickBooks or in AccountingHub.
