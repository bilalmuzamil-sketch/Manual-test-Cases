<!-- FILED 4 Nov 2026 19:31 UTC as SV-12202 (https://shopview.atlassian.net/browse/SV-12202), parent SV-11839, on the QA lead's go-ahead (4 Nov: "If its a genuine bug and reporting it will not bite me, then report it and attach it to the correct epic"). The "Correcting comment for SV-11945" below was NOT posted: on the QA lead's instruction SV-11945's DESCRIPTION was re-drafted instead (tickets-2026-11-04/filed/SV-11945-redraft.html). Filed text: tickets-2026-11-04/filed/SV-12202.html -->
<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
RESULT: REPRODUCED — staging v26.45.0-440aa25 (app meta "app-version"), Staging Heavy Duty - 9919, Asia/Karachi. A part sold on 4 Nov 2026 at 10:13 PM Karachi time (invoice for work order S2-38354, made on screen at 17:13 UTC) reads Last Sale "0 days" on 5 Nov 2026 at 12:07 AM and 12:09 AM Karachi time (19:07 and 19:09 UTC): the calendar day has changed, but only about 2 hours have passed. Server read at 12:05 AM Karachi: last_sale 0. Counted in calendar days it should read 1 day (5 Nov − 4 Nov = 1).
NEW DRAFT 4 Nov 2026, written after Chris Ward's answer to question 40.
SUMMARY: Reports - Parts Velocity Last Sale counts 24-hour periods instead of calendar days
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: relates to SV-8645 (Velocity - Story 5 - Metric Calculations) · relates to SV-11945 (its expected Last Sale wording is corrected by this answer; see the comment below) · relates to SV-11516 (Parts Velocity: store each part's last sale date — Open; the stored date should follow the same rule)
PICTURES: pictures/P2-B8-1-parts-velocity-last-sale-0-days-2026-11-05.png · pictures/P2-B8-2-invoice-s2-38354-4-nov-2026-11-05.png
BASIS: Chris Ward, "Dashboard and Reports – questions for Chris Ward (28 Oct 2026)", Section 3, question 40: "Calendar days in the location's time zone ... S5-R4 gets updated. Defect."
PRD: Parts Velocity Report PRD (Confluence 620888066) still last modified 14 Sep 2026 (version 12) when checked on 4 Nov 2026, so S5-R4 has not been updated yet; the answer above is the newer source and prevails.
TEST DATA (ZZAUTOTEST, staging, made 4 Nov 2026 for this check): customer "ZZAUTOTEST S3 Heavy Duty", part ZZAUTOTEST-PV8-11041710 (ZZAUTOTEST Last Sale part, HD-Fasteners, 5 in stock at $20 cost / $30 sell), work order S2-38354 with one labor line and 1 x the part, invoiced 4 Nov 2026 10:13 PM Karachi time. Ids: rerun-2026-11-04/results/seeded-2026-11-04.json.
NOTE: the file name reuses the letter-number B8, which the Inventory Value draft P2-B8-reports-inventory-value-margin-total-sell-shown-on-first-visit.md (filed as SV-11947) already uses. Named as instructed; rename if a unique number is wanted.
ZONES (Rule 99): zone read live from GET /api/staff/my-workplaces (Heavy Duty = Asia/Karachi); session change-location workplace_timezone, browser timezoneId, process TZ and the app's localStorage 'timezone' = Asia/Karachi, localStorage 'location' = Heavy Duty's id; header showed "Staging Heavy Duty - 9919" at the start and end of the run. Evidence: rerun-2026-11-04/results/sec3/screen-pv.json, seed-read-after-invoice.json (Last Sale 0 at 10:13 PM on 4 Nov, the same day), seed-read-after-karachi-midnight.json (0 at 12:05 AM on 5 Nov).
DUPLICATE CHECK (4 Nov 2026, read-only JQL): project = SV AND (summary ~ "Last Sale" OR text ~ "\"Last Sale\"") ORDER BY created DESC → 19 issues. None is about how the days are counted. Related, not the same: SV-11943 (Open, Last Sale ignores a billed sale that moved no stock), SV-11945 (Open, "Receive later" special-order part shown as never sold), SV-11516 (Open, store each part's last sale date), SV-8596 (Done, the Parts Velocity report + last sold date), SV-8935 (OBSOLETE, spreadsheet prints Last Sale as words).
-->

## What is wrong

On **Parts Velocity**, **Last Sale** ("how many days since this part was last sold") counts full **24-hour periods** since the sale, not **calendar days**. A part sold late yesterday still reads **0 days** this morning.

Last Sale should count calendar days in the location's time zone: a part sold yesterday reads 1 day today, whatever the hour.

For example, part **ZZAUTOTEST-PV8-11041710** was sold on work order **S2-38354**, invoiced on **4 Nov 2026 at 10:13 PM** (Karachi time):

- Actual: Last Sale reads **0 days** on **5 Nov 2026 at 12:07 AM**, because only about 2 hours have passed.
- Expected: Last Sale reads **1 day** (5 Nov − 4 Nov = 1).

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **Staging Heavy Duty - 9919**.
3. Late in the evening (location time), sell a stocked part: create a work order for a **ZZAUTOTEST** customer, add one stocked part, complete the line, and on the **Finance** tab click **Create Invoice**.
4. Wait until just after midnight (location time).
5. Click **Reports**, then in the left menu under **Parts**, click **Parts Velocity**.
6. Click the **Date** filter and choose **Last 12 months**. Click the **Location** filter and click **Select all**, so it reads **Location: All locations**.
7. Click **Search** and type the part number. This only brings the part on screen; it does not change its figures.
8. Read **Last Sale** on that row (scroll the table to the right if needed).

**Actual:** Last Sale reads **0 days** although the part was sold yesterday (for example, sold 4 Nov at 10:13 PM, read 5 Nov at 12:07 AM).

**Expected:** Last Sale reads **1 day**: today's date minus the sale date, in the location's time zone. It goes up by 1 each time the date changes at midnight.

---

**Source:** Chris Ward, "Dashboard and Reports – questions for Chris Ward (28 Oct 2026)", Section 3, question 40. Question: "should Last Sale count calendar days in the location's time zone (a part sold yesterday reads 1 day this morning), or full 24-hour periods since the sale (it reads 0 days until 24 hours have passed, as today)?"

> 40. Calendar days in the location's time zone, the same as Days Open on Work In Progress (question 4). A part sold yesterday reads 1 day this morning. S5-R4 gets updated. Defect.

Parts Velocity Report PRD (version 12), S5-R4: Last Sale is "Whole days from today to the part's most recent sale at the selected location(s), over all-time history — not limited to the window." (The answer above settles what a "day" means; S5-R4 is to be updated.)

## Screenshots

**1.** Parts Velocity, Last 12 months, All locations, ZZAUTOTEST-PV8-11041710, on 5 Nov 2026 at 12:09 AM Karachi time: Last Sale 0 days.

**2.** Work order S2-38354, Finance tab: Invoice date Nov 4, 2026, with the part billed.

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.45.0-440aa25, 5 Nov 2026, 12:05–12:09 AM Karachi time (4 Nov, 19:05–19:09 UTC), Admin, location Staging Heavy Duty - 9919.
- Session, browser, the app's own time-zone setting and the test computer all set to the location's time zone (Asia/Karachi).
- First seen at DVI Test on 29 Oct 2026 (ZZAUTOTEST-PV1-10282011, sold 28 Oct 4:34 PM Toronto time, read 0 days at 7:38 AM on 29 Oct).
- Not checked on Production or on a QA branch.

---

## Correcting comment for SV-11945 (NOT POSTED)

> Correction to the expected Last Sale in this ticket: we wrote "0 days within the first 24 hours after the sale, then one more each day". Chris Ward has since answered (question 40, 4 Nov 2026) that Last Sale counts **calendar days in the location's time zone**: a part sold on 28 Oct reads 1 day on 29 Oct, whatever the hour. Please read the expected Last Sale here that way; the 24-hour counting itself is reported separately.
