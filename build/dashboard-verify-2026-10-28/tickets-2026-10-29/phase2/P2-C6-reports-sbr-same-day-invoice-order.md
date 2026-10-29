<!-- FILED 29 Oct 2026 as SV-11952 (https://shopview.atlassian.net/browse/SV-11952), parent SV-11936 (temporary parking epic), on the QA lead's go-ahead. Exact filed text: ../filed/html/P2-C6-SV-11952.html
SUMMARY: Reports - Sales By Representative lists invoices on the same day newest first instead of by invoice number
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-8624 (SBR - Story 6 - Expand a rep to view their invoices)
PICTURES: pictures/P2-C6-1-sbr-same-day-order.png
BASIS: Sales By Representative report specification (Confluence, version 30, 21 Oct 2026), requirement S6-R9 (quoted below).
RE-CHECKED: 29 Oct 2026, 12:40 AM UTC (28 Oct, 8:40 PM in Toronto), staging v26.43.2-f8698cb, DVI Test; session, browser, test computer and the app's own time-zone setting all on America/Toronto. Earlier sightings: 28 Oct 2026 at 20:28, 21:07 and 23:05 UTC.
HISTORY: first reported as SV-8974 (created 6 Aug 2026, closed OBSOLETE on 9 Aug 2026 in a bulk sweep, never fixed). This is a fresh ticket in the new format, as the QA lead asked ("re-created SV-8974").
-->

## What is wrong

On **Sales By Representative**, when you open a representative (or the **Unassigned** row), invoices made on the **same day** are listed **newest first, by the minute they were made**. The written rule is that invoices on the same day are listed by **invoice number, lowest first**.

Across different days the order is right (newest day first). Every figure is correct; only the order within a day is wrong. On a busy day this makes it hard to find one invoice by its number.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **DVI Test**.
3. Open **Reports → Sales By Representative**.
4. Leave **Date: This month** (from 1 November pick **Last month**, so the range is October 2026).
5. Click **Show Unassigned**.
6. Click the arrow at the left of the **Unassigned** row to open it.
7. Read the invoice numbers on the rows dated **Oct 28 2026**.
8. Read the two rows dated **Oct 13 2026**.

**Actual:**
- Oct 28 2026: S1-38218, S1-38219, S1-38216, S1-38215, S1-38214, S1-38212, S1-38211, S1-38206, S1-38204, S1-38203, S1-38200, S1-38199, S1-38198, S1-38196, S1-38195 (newest invoice first; S1-38218 sits above S1-38219 because it was made a few minutes later).
- Oct 13 2026: S1-35010 is listed above S1-35003.

**Expected:**
- Oct 28 2026: S1-38195, S1-38196, S1-38198, S1-38199, S1-38200, S1-38203, S1-38204, S1-38206, S1-38211, S1-38212, S1-38214, S1-38215, S1-38216, S1-38218, S1-38219 (lowest number first).
- Oct 13 2026: S1-35003 above S1-35010.
- Days stay newest first.

The invoices above are test data at DVI Test and stay in place. Invoices made at DVI Test later on 28 Oct (for example S1-38221) also appear at the top of that day. Any day with more than one invoice shows the same thing, at every location and under every representative.

---

**Source:** Sales By Representative report specification, Confluence, version 30 (21 Oct 2026), requirement S6-R9:

> Within an expanded rep (and within the Unassigned row), invoice detail rows are ordered by invoice date descending (newest first), tie-broken by invoice number ascending by the numeric portion after the P/S prefix (numeric, not lexical — so S999 precedes S1000); if both the date and the numeric portion tie (e.g., P100 and S100 on the same day), P (Parts) sorts before S (Service).

## Screenshots

**1.** Sales By Representative, DVI Test, This month, Show Unassigned, Unassigned opened: the Oct 28 2026 invoices run newest first (S1-38218, S1-38219, S1-38216 … S1-38196).

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026 (Toronto time), Admin.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto).
- Not checked on Production or on a QA branch.
