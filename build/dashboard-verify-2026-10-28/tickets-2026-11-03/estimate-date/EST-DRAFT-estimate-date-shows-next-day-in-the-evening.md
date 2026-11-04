<!-- WITHDRAWN 4 Nov 2026 — NOT A DEFECT. DO NOT FILE.
The server has DVI Test on Pacific/Fiji (UTC+12), not America/Toronto (GET /api/staff/my-workplaces, 4 Nov 2026 15:48 UTC; also stated in SV-12161 comment 80084, 3 Nov 2026).
At 10:45 AM Toronto on Nov 4 it is already Nov 5 in Fiji, so "Estimate date: Nov 5, 2026" is the location's own date — what the Invoice UI Refresh spec S10-R2 asks for.
Control, build v26.45.0-440aa25, each run in the location's own zone (Rule 99): Lethbridge S3-34984 + S3-17369 (Edmonton 9:46 AM Nov 4) show Nov 4; Heavy Duty S2-33740 (Karachi 8:44 PM Nov 4) shows Nov 4; DVI Test S1-38222, S1-37677, S1-37679 show Nov 5 = Fiji's date.
The earlier evening readings (Nov 4 shown at 7:16 PM / 11:04 PM Toronto on Nov 3) are also Fiji's date. My runs used Toronto for DVI Test, so the zones were unmatched (Rule 99): the finding was never valid.
Evidence: estimate-date/board-leth-2026-11-04/, board-dvi-2026-11-04/, S2-33740-2026-11-04/, daytime2-2026-11-04/ -->

<!-- DRAFT 4 Nov 2026 — NOT FILED. QA lead 4 Nov ("Yes" to: check it properly, then draft a new ticket for your approval).
No ticket yet. Related: SV-12161 (evening deposit saved a day early), SV-11970 (Finance tab deposit date; QA passed — leave it).
SUMMARY: Estimates - in the evening at a North American location the estimate shows tomorrow's date as its Estimate date
TYPE Bug · PARENT none · PRIORITY Medium · PRODUCT AREA Work Orders (to confirm)
DUPLICATE CHECK 4 Nov 2026: open SV tickets, text ~ "estimate date" OR summary ~ estimate + date/timezone/UTC/day: 2 results —
  SV-5346 (report for unconverted estimates) and SV-4467 ("Change issue date and due date for invoice and estimate", feature request). Neither covers this.
EXPECTED BASIS: "Invoice UI Refresh" spec (Confluence 755990532, last modified 7 Oct 2026), S10-R2 + G-R1; SV-5968 (open) general date rule.
STILL TO DO BEFORE FILING: daytime control (scheduled 4 Nov 15:15 UTC = 10:15 AM Toronto) must show Nov 4 = the same day; then the QA lead's go-ahead.
EVIDENCE: evening-2026-11-03-2304/ (meta.json: VALID, all zones America/Toronto, build v26.45.0-f417d48); also seen 3 Nov 7:16 PM Toronto (SF1/evening-2026-11-03/finance-evening.png).
-->

## What is wrong

On a work order that has no invoice yet, the **Finance** tab shows the **Estimate**. Its **Estimate date** should be today's date at the shop.

In the evening at a North American location, the Estimate date already shows **tomorrow**. At Toronto locations this happens after **7 PM**. The estimate the customer receives (download, email or print) then carries a date that has not arrived yet.

**Example:** work order **S1-38222** at **DVI Test** (Toronto time), at **11:04 PM on Nov 3, 2026**:

- Estimate date shown: **Nov 4, 2026**.
- Expected: **Nov 3, 2026** (the shop's date at that moment). One day ahead.

In the morning the same estimate shows the right date. (Daytime check: to be added.)

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **DVI Test** (Toronto time).
3. Wait until after **7 PM** Toronto time.
4. Open a work order that is not invoiced yet (for example **S1-38222**) and click the **Finance** tab.
5. Look at **Estimate date** under the estimate number at the top right of the estimate.

**Actual:** Estimate date shows **tomorrow's date**.

**Expected:** Estimate date shows **today's date** at the shop's location.

---

**Source:** "Invoice UI Refresh" (Confluence, last modified Oct 7, 2026), S10-R2:

> The {date} is the document's issued date … On an Estimate no invoice record exists yet, so it is the date the estimate is produced and it tracks the current date until an invoice is created

[SV-5968](https://shopview.atlassian.net/browse/SV-5968) (open), the general rule for dates:

> All the dates across the SV app should be rendered the same way. The correct rendering is based on the Current Location.

## Screenshots

**1.** S1-38222, Finance tab, DVI Test, 11:04 PM Toronto on Nov 3: "Estimate date: Nov 4, 2026". (file: evening-2026-11-03-2304/EST-1-estimate-date-nov-4-at-11pm-nov-3.png)

## Where it was seen

- Staging, build v26.45.0-f417d48, 3 Nov 2026 at 7:16 PM and 11:04 PM Toronto time, Admin, DVI Test.
- Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto).
- Not checked on Production, on a QA branch, or on the downloaded/emailed PDF.
