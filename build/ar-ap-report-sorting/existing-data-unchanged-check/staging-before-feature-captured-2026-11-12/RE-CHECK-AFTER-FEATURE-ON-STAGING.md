# Re-checking staging after the A/R and A/P upgrade lands

This folder is staging **before** the A/R and A/P upgrade (epic SV-11315). After the upgrade is migrated to staging,
repeat every capture **on staging, with the same data**, and say for each section whether the upgrade changed it.
Compare staging with staging only, never with the production folder: the data is different (Rule 122).

## Before starting

1. **Prove the upgrade has landed.** Read the version:
   `curl -s https://app.staging.shopview.com/ | grep -o 'app-version" content="[^"]*'`. Before the upgrade it was
   **`v26.45.3-6197d19`**. Then, with the cookies, `GET https://api.staging.shopview.com/api/reporting/reports/ap-aging-summary`
   must answer something other than **404** (it was 404 before), and the old
   `/api/reporting/account-payable/aging-summary-report` should now answer 404 (it was 400). If the version is unchanged
   and the new address is still 404, the upgrade is not on staging yet: stop and say so.
2. **Sign-in state.** Use the QA lead's own staging browser cookies in `/tmp/staging/` (`cookies.json`,
   `cookie-header.txt`; domain `.staging.shopview.com`). Never call login, quick-login, logout or change-location: a
   quick-login rotates his sign-in and logs him out. Rebuild the browser state with
   `python3 scripts/hydrate.py` (it reads `/api/iam/view-profile/`, `/api/staff/my-workplaces` and
   `/api/auth/me/fe-permissions` and writes `login-resp.json` and `fe-perms.json` into `/tmp/staging/`, `chmod 600`).
   `scripts/stg.js` blocks logout, login and change-location inside every test browser.
3. **Check the seeded records are still there and unused** (`seed-state.json` has the ids). Read the customer's unpaid
   list: `python3 -c "from api import req; print(req('GET','/api/customer-account/list-unpaid-transaction?accountId=92c57b6d-6878-4a33-9fd6-af4e497f4e6d&pagination[page]=1&pagination[rowsPerPage]=100'))"`
   (run inside `scripts/`). It must list **CM2-4540** ($-5, dated 14 Nov 2026) and **CM2-4541** ($-3, dated 12 Nov 2026),
   both "unapplied". For the vendor: vendor account `c871c708-7309-405f-852c-e6c22588d17d` must list **C-13911** ($-7, dated
   12 Nov 2026), "unapplied". If one was used or deleted, its comparison cannot be made: say so, do not reseed it (a new
   record has no "before").

## Run the same steps

Run each script from this folder: `OUT=<after folder> NODE_PATH=$(npm root -g) node scripts/<script>`. Put the results in
a sibling folder named **`staging-after-feature-captured-<date>/`** with the same sub-folders.

| Script | Sections | Change needed after the upgrade |
|---|---|---|
| `s1.js` | 1 | 🔴 Run with **`AS_OF=2026-11-12`**: after the upgrade the default as-of is the day you run it. The old A/R **Print** button is gone (the developers' notes: "The old A/R Print button is gone; every report uses the ⋯ Export menu"), so the script records "no print button"; save the ⋯ Export PDF instead and compare its rows and amounts, not its layout |
| `data_calls.py` | 1 (every row) | 🔴 Its addresses are the OLD ones and will answer 404. The new ones are in the upgrade's own front-end code, `app/src/api/reporting/index.ts` lines 381–482 on branch `SV-11315-ar-ap-aging-reports`: `reporting/reports/ar-aging-summary`, `ap-aging-summary`, `ar-aging-collection`, `ap-unpaid-invoices`, and for the Detail reports `reporting/reports/ar-aging-detail/buckets/<bucket>/rows` and `ap-aging-detail/buckets/<bucket>/rows`. Read the parameter names from that file (Rule 115: never guess), send `asOfDate=2026-11-12`, and write the same TSV columns so the files can be compared line by line |
| `s2.js` | 2 | CM2-4541 and C-13911 are looked for **as of 12 Nov 2026**: run any day. 🔴 CM2-4540 is looked for **as of 14 Nov 2026**, and after the upgrade "the date picker does not offer days after today" (developers' notes), so run that part **on or after 14 Nov 2026**. The upgrade adds a Customer filter: also tick "ZZAUTOTEST SV11315 Staging CM" (that is what C1062590 asks for). Bucket toggles may be renamed; find the new names in the code |
| `s3.js` | 3 | 🔴 Set Inventory Value and Work In Progress to **as of 12 Nov 2026** and Sales By Customer to **November 2026** first, so the files cover the same period. Location stays **Staging Heavy Duty - 9919** (`b3c8c820-…`). Also open each saved page address from `3-files-and-links/* - page address.txt` as it is (C715475, C715617, C715618 step 1) |
| `s4to8.js` | 4 to 8 | Unchanged. Click the same names in section 6: **Mobile Truck & Trailer Repair Island Lake** and **123 Cannabis Forestlawn** (if the script picks other rows, open the two saved addresses in `6-drill-down-links/NOTES.txt` directly — that is what C715582 does). Section 7 unticks **Staging Lethbridge - 4310** (location B) |

The scripts find things by the screens' element names (for example `filter_chip_asOfDate`). The upgrade renames some on
the six aging reports; when a script cannot find an element, find the new name in the app's code (Rule 115) and record
it. On Sales By Customer, Inventory Value and Work In Progress a renamed or moved control is itself a "changed".

## Staging is shared — tell other people's changes from a regression

Every NOTES.txt carries UTC times, and section 1 carries counts per report (rows, documents, groups, documents per
location) and the report's own totals. Before calling a section "changed":

1. Compare the **counts** first. If documents were added or paid since 12 Nov 2026 06:35 UTC, the differences will be
   whole documents with dates after the capture, or payments: find them by number in the TSVs and name them as
   "someone else's data change", with the document number and date.
2. A difference on a document that existed at capture time and was not paid is the kind that matters.
3. Re-run the same read twice, minutes apart, and record the build marker each time (Rule 110).

## Differences the upgrade is MEANT to make (do not report these)

From PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, **version 11** (5 Nov 2026), as
the 13 cases quote it, and the developers' shared notes on SV-11315 (comment 80616, "KNOWN MISMATCHES AND KNOWN GAPS
(not bugs — do not file)"). Re-read the PRD's current version before relying on this list (Rule 121.5).

| Difference you will see | Why it is intended |
|---|---|
| A credit memo, deposit or vendor credit dated exactly on the as-of date moves from "1-30" to **Current**, Past Due 0. Here: CM2-4541 and C-13911 as of 12 Nov, CM2-4540 as of 14 Nov, and any other credit dated on the as-of date | PRD v11 "What changes for existing users": "A credit memo, deposit or vendor credit dated exactly on the as-of date now shows in Current with Past Due 0, as in QuickBooks; today it shows in 1-30 (S1-R5a)." (SV-11441) |
| The order of rows | PRD section 2; the reports open in QuickBooks name order (S1-R7), A/R Collection and A/P Unpaid by Date oldest first |
| Dates read "Nov 4, 2026" where the screen said "Today", "Yesterday" or "2 days ago" | PRD section 2 (S2-R1a), quoted in C715471 / C715472 |
| Transaction Type reads "Credit Memo", "Deposit" or "Vendor Credit" where it said "Credit" | PRD section 2 (S2-R1b), quoted in C715471 / C715472 |
| The A/R Summary **Totals** row differs for customers with an overpaid invoice, although no row changes | Developers' notes: "A/R Summary Totals add up exactly the rows shown … for those customers the Totals row will read differently after the release, although no row changes (PRD §2)" |
| A bill not yet due shows a negative Past Due on A/P Detail and A/P Unpaid | Developers' notes, "Decided by Product (Chris, 2026-11-04 / 2026-11-05)" |
| A "Location: All locations" chip and a Location column on the six reports; the old A/R Print button gone; ⋯ Export menu | The upgrade's own stories (SV-11533, SV-11535, SV-11536) |
| The six reports no longer page 30 rows at a time | The upgrade's own design (S1-R8: 100 documents at a time inside an open group) |

**Check before reporting — possibly intended.** Before the upgrade the reports sent the as-of date as the end of the day
**in UTC** (`asOfDate=2026-11-12T23:59:59.999Z`, read from the network on 12 Nov 2026). After it, "Past Due = the as-of day
minus the due date's day, in calendar days at the location's time zone. Time of day never matters" (S1-R5a, developers'
notes). A document whose due date sits on a bucket boundary may therefore change bucket. Check each such document against
S1-R5a before calling it a regression, and ask the QA lead when unsure (Rule 121.6).

## Differences that are NOT intended (report these, after Rules 110, 120 and 121)

- Any customer, vendor or document that disappears, appears, or changes amount or open balance, other than the
  intended items above and other people's data changes.
- Anything different on **Sales By Customer, Inventory Value and Work In Progress** (sections 3, 4, 7, 8): the files, the
  page addresses, the export menu, the export error message, whether the Location filter is remembered, the Customer
  search box, the 900 px filter row. Before the upgrade the Sales By Customer offline export showed **two** messages
  ("Network Error" and "This report is too large to export…"); C715476 expects the same message after.
- The location switcher (section 5) listing or looking different (PRD v11 S7-E1: "The location switcher in the top right
  of ShopView is not changed.").
- A drill-down address saved before the upgrade (section 6) not opening on its customer or vendor (C715582).

## Compare and report

For each section: **changed** or **not changed**, before and after side by side, and for every change whether the
upgrade was meant to make it. Compare `rows.txt` files and the TSVs line by line (sort both first: the order is meant to
change), the CSVs line by line, and the PDFs by rows and amounts. Record the build marker and UTC time of the after run.
