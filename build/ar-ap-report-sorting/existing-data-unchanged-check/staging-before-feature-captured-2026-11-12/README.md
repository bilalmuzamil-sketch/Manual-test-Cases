# A-R A-P staging before the feature 2026-11-12

What **staging** looked like **before** the A/R and A/P upgrade (epic SV-11315) was migrated there. These are the same
8 sections as the production snapshot of 10 Nov 2026 (`../production-before-release-captured-2026-11-10/`), adapted to
staging's own data. The 13 tests in TestRail section 133628 compare against this folder once the upgrade lands on
staging (Rule 122). **Compare staging with staging only**, never with the production folder.

## What was used

| What | Value |
|---|---|
| Captured on | **12 Nov 2026, 06:31 to 06:54 UTC** (final takes: section 1 06:46–06:51, section 2 06:54, section 3 06:44–06:52, sections 4–8 06:43–06:45) |
| Staging version | **v26.45.3-6197d19**, read at **06:24:46 UTC** (before) and again at **06:54:39 UTC** (after): unchanged |
| Proof the upgrade had NOT landed | Both times: the new `GET /api/reporting/reports/ap-aging-summary` answered **404**; the old `/api/reporting/account-payable/aging-summary-report` answered **400** (it exists). Every section was taken before the upgrade |
| Where | `https://app.staging.shopview.com` |
| Signed in as | The QA lead's own staging browser session (**Admin**, "Admin Shopview"; the template is "administrator"), **not signed in again**. Browser state was rebuilt from `/api/iam/view-profile/`, `/api/staff/my-workplaces` and `/api/auth/me/fe-permissions`; logout, login and change-location were blocked in every test browser. Desktop window **1440 px**, browser time zone Asia/Karachi (the location's own) |
| As-of date | **12 Nov 2026** (the reports' default that day). Section 2 also uses **14 Nov 2026** (CM2-4540's own date). The reports sent `asOfDate=2026-11-12T23:59:59.999Z` |
| Locations | **Staging Heavy Duty - 9919** (current location; the one ticked in section 3; location A in section 7), **Staging Lethbridge - 4310** (location B, unticked in section 7), QB Location, DVI Test (ticked alone for the extra Inventory Value baseline) |
| Customer (section 2, seeded) | **ZZAUTOTEST SV11315 Staging CM**, credit memos **CM2-4540** ($5.00, dated 14 Nov 2026) and **CM2-4541** ($3.00, dated 12 Nov 2026), both unused |
| Vendor (section 2, seeded) | **ZZAUTOTEST SV11315 Staging VC**, vendor credit **C-13911** ($7.00, dated 12 Nov 2026), unused |
| Customer (section 6) | **Mobile Truck & Trailer Repair Island Lake** (the first A/R Summary row with an overdue amount) |
| Vendor (section 6) | **123 Cannabis Forestlawn** (the first A/P Summary row with an overdue amount) |
| Customer search typed (section 8) | **ZZAUTO** |

🔴 **Do not use or delete CM2-4540, CM2-4541 or C-13911.** The after-check needs them exactly as they are. The record
ids are in `seed-state.json` and `SEED-MANIFEST.md`.

## Staging values for the 13 tests

The tests are written generally ("customer A", "location B", "date A"). On staging, use these. The "before" pictures,
files and notes are in this folder:
<https://github.com/bilalmuzamil-sketch/Manual-test-Cases/tree/claude/global-search-v1-baseline-6ax9ul/build/ar-ap-report-sorting/existing-data-unchanged-check/staging-before-feature-captured-2026-11-12>.
The production snapshot of 10 Nov 2026 (`../production-before-release-captured-2026-11-10/`) is kept for the short
check on production after the release.

| Test | On staging use | Before the feature (folder) |
|---|---|---|
| C715471 · C715472 (untouched A/R and A/P reports) | As-of date **12 Nov 2026**. Expected moves: credit memo **CM2-4541** (A/R) and vendor credit **C-13911** (A/P), both dated 12 Nov, were in "1-30 days past due" and should now be in Current | `1-six-reports` |
| C715475 (Inventory Value) | Only **DVI Test** ticked, as of **12 Nov 2026**; open the saved link `…/reports/inventory-value?locationIds=39522bc6-abca-4f67-bd12-2840043c2d68`. ⚠️ With only Staging Heavy Duty - 9919 ticked the PDF already failed before the feature ("This report is too large to export…") | `3-files-and-links` |
| C715617 (Sales By Customer) | Only **Staging Heavy Duty - 9919** ticked, date range **November 2026** ("This month" on 12 Nov) | `3-files-and-links` |
| C715618 (Work In Progress) | Only **Staging Heavy Duty - 9919** ticked, as of **12 Nov 2026** | `3-files-and-links` |
| C715476 (export error message) | Sales By Customer, "Download Summary (CSV)" with the network off; before: "Network Error" and "This report is too large to export. Narrow the date range or filters, then try again." | `4-export-failure` |
| C715480 (location switcher) | Current location **Staging Heavy Duty - 9919**; location B **Staging Lethbridge - 4310** | `5-location-switcher` |
| C715582 (drill-down links) | Customer A **Mobile Truck & Trailer Repair Island Lake**; vendor A **123 Cannabis Forestlawn** (the two saved addresses are in NOTES.txt) | `6-drill-down-links` |
| C715583 · C715619 · C715620 (filter memory) | Location A **Staging Heavy Duty - 9919**; location B (untick) **Staging Lethbridge - 4310**. Before: forgotten on all three | `7-location-filter-memory` |
| C715584 (Sales By Customer menus) | Type **ZZA**, then **UTO** | `8-sbc-filter-menus` |
| C1062590 (credit on the as-of date) | Customer **ZZAUTOTEST SV11315 Staging CM**. **Before 14 Nov 2026:** credit memo **CM2-4541** ($3.00), date A = **12 Nov 2026**. **From 14 Nov 2026:** also **CM2-4540** ($5.00), date A = **14 Nov 2026** (the date picker offers no day after today). Both were in "1-30 days past due" before the feature | `2-credit-memo` |

## What is in each folder

| Folder | Section | What was found |
|---|---|---|
| `1-six-reports` | 1. The six reports, untouched | All six opened at 12 Nov 2026 with no other filter touched; screenshots, `rows.txt`, and the three A/R prints saved as PDF. 🔴 **The screen shows only part of each report**: A/R Summary, A/R Collection, A/P Summary and A/P Unpaid fetch **30 rows a page**, and the Detail tables draw only the lines in view. So `all rows from the data calls/` holds **every row**, from the same data call each screen makes, with each file checked against the report's own totals: **A/R Summary 269 customers**, total **$723,844.69**; **A/R Detail 1,564 documents** (Current 107 · 1-30 403 · 31-60 582 · 61-90 417 · 91+ 55); **A/R Collection 256 customers, 1,457 documents**; **A/P Summary 474 vendors**, total **$4,842,635.66**; **A/P Detail 14,663 documents** (Current 468 · 1-30 496 · 31-60 1,028 · 61-90 733 · 91+ 11,938); **A/P Unpaid 474 vendors, 14,663 documents**. Documents per location are in that folder's `NOTES.txt` (A/R: Heavy Duty 1,050, Lethbridge 481, DVI Test 23, QB Location 10) |
| `2-credit-memo` | 2. Credit memo | **CM2-4540** sits in **"1-30 days past due"** on A/R Aging Detail as of 14 Nov 2026 (its own date), the same as production's CM1-4411. Extras: **CM2-4541** in "1-30 days past due" as of 12 Nov 2026, and the vendor credit **C-13911** in "1-30 days past due", Past Due **1**, on A/P Aging Detail as of 12 Nov 2026. ⚠️ No customer filter on A/R Aging Detail before the upgrade (as on production); buckets were opened one at a time |
| `3-files-and-links` | 3. Files and a link | Each report with only **Staging Heavy Duty - 9919** ticked: screenshot, the ⋯ menu, every download, the page address. 🔴 **Inventory Value's PDF fails before the upgrade** for that location: after about 1 minute the server answered **500** and the screen said "This report is too large to export. Narrow the date range or filters, then try again." (retried once, 5-minute wait; its CSV downloads, 973 KB). So Inventory Value was also captured with **only DVI Test** ticked (PDF and CSV both download). Sales By Customer: date range "This month", four downloads; Work In Progress: PDF and CSV |
| `4-export-failure` | 4. Export failure | With the network off, **two** messages appeared, as on production: "Network Error" and "This report is too large to export. Narrow the date range or filters, then try again." |
| `5-location-switcher` | 5. Location switcher | The top-right button reads "Staging Heavy Duty - 9919". Under "Change Location:" it lists **four** locations: QB Location, Staging Heavy Duty - 9919, Staging Lethbridge - 4310, DVI Test (production offered only one). Nothing was switched |
| `6-drill-down-links` | 6. Drill-down links | Mobile Truck & Trailer Repair Island Lake opens `…/reports/ar-aging-collection?customerName=…&customerId=023402eb-206e-4a9b-8260-b42cdb330a9a`; 123 Cannabis Forestlawn opens `…/reports/ap-unpaid-invoices?vendorName=…&vendorId=68c72fe7-8fbe-4795-85aa-7e91fbb54c7e` (full addresses in NOTES.txt) |
| `7-location-filter-memory` | 7. Does the filter remember? | **No**, on all three reports, as on production: after unticking Staging Lethbridge - 4310 ("Location: 3 locations") and coming back through the Reports menu, the filter said "Location: All locations" again |
| `8-sbc-filter-menus` | 8. Sales By Customer's menus | Clear selection then Select all → "Location: All locations", address `…/reports/sales-by-customer` (nothing added). Typing kept going into the Customer search box ("ZZAUTO"). Screenshots at 900 px |
| `scripts` | — | The exact scripts that made these captures and the seeds, for the after-check (see `RE-CHECK-AFTER-FEATURE-ON-STAGING.md`) |

Every folder has a `NOTES.txt` with the exact words seen on screen and the UTC time.

## Staging is shared: what changed during the capture

The full data was read twice: at 06:35 UTC (before CM2-4541 was seeded) and at 06:46 UTC (after). The only differences
were **CM2-4541 itself**: one more customer row, one more document in A/R Detail and A/R Collection, and 1-30 Days lower
by $3.00. A/P was identical. Nobody else changed A/R or A/P data in those 11 minutes. The after-check must still expect
other people's changes over the days between; see the re-check guide.

## Differences from the production capture

Recorded, not worked around:

1. **The as-of date is 12 Nov 2026** (staging's default that day). Production used 10 Nov.
2. **Staging has far more data**, and the screens show only part of it (30 rows a page, or only the lines in view). So the
   screenshots and `rows.txt` cover page 1 only, as on production, and **every row is also saved** from the reports' own
   data calls (a staging addition).
3. **Two extra seeded credits.** CM2-4540 is dated **14 Nov**, two days after the capture, like production's CM1-4411. But
   after the upgrade "the date picker does not offer days after today" (developers' notes on SV-11315), so CM2-4540 can only
   be checked from 14 Nov. **CM2-4541 (dated 12 Nov)** lets C1062590 run the day the upgrade lands. **C-13911** gives the
   A/P side of the same intended change (C715472).
4. **Inventory Value's PDF fails** for the main location before the upgrade (500, "too large"). Production's did not. The
   extra DVI Test baseline gives C715475 a PDF to compare.
5. **The location switcher lists four locations**, where production listed one. C715480 can switch to location B on
   staging.
6. **A/R Aging Detail and A/P Aging Detail were opened one bucket at a time** (A/P Detail has 11,938 documents in "91 or
   more days past due"). The `all buckets expanded - rows.txt` files hold only the lines that were in the page.
7. **Drill-down records differ** (section 6): staging's own first overdue customer and vendor were used.

### Two more tests moved into the staging folder (12 Nov 2026)
| Test | What staging must hold | Staging value |
|---|---|---|
| C715477 A work order link from another location still asks to switch | An unpaid invoice made from a work order at location B; Admin enrolled at A and B | Location B = Staging Lethbridge - 4310; any open S3- invoice from a work order there (e.g. the regression seed's S3- invoices, see STAGING-RUN-CARD.md) |
| C715479 The research ideas left out of this release do not appear | A customer with an overdue invoice, so the A/R reports have rows | Any overdue A/R invoice (the snapshot lists 1,458) |
