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
| `s3-iv-pdf-retry.js`, `s3-iv-small-location.js` | 3 (Inventory Value) | Before the upgrade, Inventory Value's PDF for Staging Heavy Duty - 9919 **failed** (server 500 after about 1 minute; "This report is too large to export. Narrow the date range or filters, then try again."). Re-run both: the same failure is "not changed". Compare the PDF and CSV with **only DVI Test** ticked, which both downloaded before |
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

## Records created AFTER the snapshot (exclude from the comparison)

Created on staging by the A/R and A/P regression kit (`v1-regression/live-run-2026-11-11/tools/seed.py staging` and `staging-seed-2026-11-12/staging_prep.py`), all **after** the "before" capture finished. Every name starts with **ZZAUTOTEST**. An after-check that finds any of these in a report, a total, a count, a menu or the location switcher must subtract it before calling anything a regression. Seed anchor: `2026-11-12T07:15:30Z` (location A 2026-11-12, B 2026-11-12). Source of every row: `v1-regression/live-run-2026-11-11/tools/seeded-staging.json` (ids, numbers, `created_utc`).

**Totals move.** These records add open A/R and A/P lines at locations A and B (and one $87.00 invoice at location C), so every "All customers" / "All vendors" total, bucket count and line count that includes them changes. Compare per party, and leave out every party whose name starts with "ZZAUTOTEST AR " or "ZZAUTOTEST AP ".

### Not documents: locations, roles

| What | Name | Id | Created (UTC) |
|---|---|---|---|
| Custom role (no user holds it outside the run) | ZZAUTOTEST V1R-32 Reports on Customers View off | `fd976fe4-a167-487c-affc-9b89e55f26b7` | 2026-11-12T06:59:17Z |
| Custom role (no user holds it outside the run) | ZZAUTOTEST V1R-53 Reports page access only | `9da670d3-6845-4986-b7a2-1314d45136b5` | 2026-11-12T06:59:18Z |
| Location (QA lead auto-enrolled; appears in his location switcher) | ZZAUTOTEST V1R-87 Location C | `613d5730-af58-47c5-ad64-52bb5a8cf58d` | 2026-11-12T07:32:25Z |

### Customers and vendors

| Kind | Name | Id | Created (UTC) |
|---|---|---|---|
| Customer | ZZAUTOTEST AR R03 Location B | `9656f09a-0684-4b50-9d22-802d7e877877` | 2026-11-12T07:15:36Z |
| Customer | ZZAUTOTEST AR R07 Future Date | `e83305a9-f2cf-4c7d-a0c2-60b704d4309c` | 2026-11-12T07:15:52Z |
| Customer | ZZAUTOTEST AR R11 Date Edge | `e86d8477-5da8-4d8f-99a7-df5f3ce3ac15` | 2026-11-12T07:16:07Z |
| Customer | ZZAUTOTEST AR R13 Payment After | `84970854-285a-4976-954c-f1a620aeec2e` | 2026-11-12T07:16:26Z |
| Customer | ZZAUTOTEST AR R14 Paid In Full | `f896fc6f-1f6d-40c3-a30b-799a2da3a9f9` | 2026-11-12T07:16:41Z |
| Customer | ZZAUTOTEST AR R15 Payment Reversed | `3641e815-a475-4994-9d1d-2cf0c561bee3` | 2026-11-12T07:16:57Z |
| Customer | ZZAUTOTEST AR R16 Memo Voided | `c6184ec5-6ee6-4e59-84cb-5742a191cb2f` | 2026-11-12T07:17:14Z |
| Customer | ZZAUTOTEST AR R17 Memo Applied | `4beb8cd1-3b53-4a42-aab5-98f0097d0fce` | 2026-11-12T07:17:23Z |
| Customer | ZZAUTOTEST AR R18 Deposits | `cbe38957-411e-4dcd-9fcc-c74438300a3a` | 2026-11-12T07:17:44Z |
| Customer | ZZAUTOTEST AR R19 Deposit Reversed | `8e5ecb6b-1083-4153-a562-c7939186d4e8` | 2026-11-12T07:18:06Z |
| Customer | ZZAUTOTEST AR R22 Bucket Edges | `9d68bc90-8754-45ca-a0d0-915b5bba63fe` | 2026-11-12T07:18:25Z |
| Customer | ZZAUTOTEST AR R23 Memo Aging | `df4da315-7133-4679-8c9a-f8d404aa0863` | 2026-11-12T07:18:37Z |
| Customer | ZZAUTOTEST AR R28 Credit Only | `17b84e23-19f5-4efb-a709-109407b6916d` | 2026-11-12T07:18:47Z |
| Customer | ZZAUTOTEST AR R29 One Bucket | `b5ac6199-8ba8-4b2b-90e9-bfef32ee6b41` | 2026-11-12T07:18:56Z |
| Customer | ZZAUTOTEST AR R30 Netting | `3a4379fa-eb83-49cb-9175-9b40bf20789b` | 2026-11-12T07:19:17Z |
| Customer | ZZAUTOTEST AR R31 Thousands | `7a3a4f41-7d32-4284-904f-1181e7bcbec9` | 2026-11-12T07:19:42Z |
| Customer | ZZAUTOTEST AR R31 Negative Total | `bb216caa-3b89-4721-8dcb-76e82520b99a` | 2026-11-12T07:19:55Z |
| Customer | ZZAUTOTEST AR R36 Collect X | `0da1475b-2a28-4940-a499-a0f74a6e2f17` | 2026-11-12T07:20:04Z |
| Customer | ZZAUTOTEST AR R36 Collect Z | `437a8aad-3499-4b28-beb9-d4bf0ff1cb66` | 2026-11-12T07:20:17Z |
| Customer | ZZAUTOTEST AR R41 Partly Paid | `1d309fd5-852b-4e64-b38f-1b99e62d0024` | 2026-11-12T07:20:29Z |
| Customer | ZZAUTOTEST AR R42 Memo Line | `62335618-4306-47bc-9d58-5dc1b2b95446` | 2026-11-12T07:20:44Z |
| Customer | ZZAUTOTEST AR R44 Two Past Due | `a490ac35-2e86-49a2-831f-ab9851ea4866` | 2026-11-12T07:20:51Z |
| Customer | ZZAUTOTEST AR R45 Collection Mix | `522eaa76-31a6-47ee-b06c-004041250cbd` | 2026-11-12T07:21:12Z |
| Customer | ZZAUTOTEST AR R46 Collection Credit | `10d64603-c517-4584-9fe6-d36620bd8444` | 2026-11-12T07:21:46Z |
| Customer | ZZAUTOTEST AR R47 Oldest First | `2b0fe347-76d2-4991-b866-e4908599ebfc` | 2026-11-12T07:21:53Z |
| Customer | ZZAUTOTEST AR R48 Days Past Due | `9fc95707-7f9b-4569-9898-739290c1230d` | 2026-11-12T07:22:20Z |
| Customer | ZZAUTOTEST AR R51 Nothing Open | `6a6e0671-135d-4834-9468-b8af7f121b79` | 2026-11-12T07:22:36Z |
| Customer | ZZAUTOTEST AR R71 Location B Orders | `652ee52f-489e-40fe-8cc6-cdf33e3587a2` | 2026-11-12T07:15:45Z |
| Customer | ZZAUTOTEST AR R74 Credit Today | `55d49e6f-8e72-4f63-8c28-0bc306d1e704` | 2026-11-12T07:22:39Z |
| Customer | ZZAUTOTEST AR R76 Overpaid | `68ac7963-ffeb-48ca-a129-a58a8dba2557` | 2026-11-12T07:22:57Z |
| Customer | ZZAUTOTEST AR R90 Many Lines | `44fa3820-8f00-4159-a95e-c54b47263d85` | 2026-11-12T07:23:11Z |
| Customer | ZZAUTOTEST AR V1R-87 Location C | `5e9135de-30f5-412d-a1cc-b996d92a526a` | 2026-11-12T07:32:30Z |
| Vendor | ZZAUTOTEST AP P12 Bill Dates | `31948138-5a1d-400a-b6f2-3e6c71c09da3` | 2026-11-12T07:28:49Z |
| Vendor | ZZAUTOTEST AP P20 Payment After | `271ef607-3154-498f-838f-706af392526c` | 2026-11-12T07:28:50Z |
| Vendor | ZZAUTOTEST AP P21 Credit Used | `c53f18d9-bf68-4b07-b304-d544b8b8f2ad` | 2026-11-12T07:28:50Z |
| Vendor | ZZAUTOTEST AP P24 Credit Aging | `370cc47b-694d-413e-b035-5702d2f8241c` | 2026-11-12T07:28:51Z |
| Vendor | ZZAUTOTEST AP P26 No Terms | `c019cd63-d559-45fe-b5f5-37fdb98f382a` | 2026-11-12T07:28:52Z |
| Vendor | ZZAUTOTEST AP P27 Overpaid | `e150a2c3-1b16-40c5-8d8f-d88550c020a5` | 2026-11-12T07:28:52Z |
| Vendor | ZZAUTOTEST AP P52 Netting | `209a33d2-6310-43e6-a0da-7a79b72e4a66` | 2026-11-12T07:28:52Z |
| Vendor | ZZAUTOTEST AP P56 Location B | `0dcbcde5-4f63-430f-91c6-abd24c3a60b9` | 2026-11-12T07:15:47Z |
| Vendor | ZZAUTOTEST AP P57 Not Yet Due | `eb157bff-0d6f-4a24-83f4-8f126748aec5` | 2026-11-12T07:28:53Z |
| Vendor | ZZAUTOTEST AP P58 Credit Line | `c1265445-bcae-4941-bbd6-db59d0a73662` | 2026-11-12T07:28:54Z |
| Vendor | ZZAUTOTEST AP P60 Alpha | `da01490d-f5d5-4f52-8b88-1d79b763519b` | 2026-11-12T07:28:54Z |
| Vendor | ZZAUTOTEST AP P60 Bravo | `998a4a7e-0aa6-409e-b2c0-f55dd9791e3d` | 2026-11-12T07:28:54Z |
| Vendor | ZZAUTOTEST AP P61 Mix | `7e129ef2-8304-4a49-b4fd-7236fc4e382a` | 2026-11-12T07:28:55Z |
| Vendor | ZZAUTOTEST AP P62 Oldest First | `acd67958-a9f8-4ba1-938a-bd575af4e302` | 2026-11-12T07:28:56Z |
| Vendor | ZZAUTOTEST AP P75 Credit Today | `d5ac606c-7fa6-4b5f-98a8-379e6a275b8b` | 2026-11-12T07:28:56Z |
| Vendor | ZZAUTOTEST AP P93 Credit Links | `43483845-ca87-4107-a502-1c9878638d68` | 2026-11-12T07:28:57Z |

### Documents and money movements

| Ledger key | Type | Number on screen | Amount | Dated (location day) | Location | Created (UTC) |
|---|---|---|---|---|---|---|
| doc:P12:billD | bill | ZZT-P12-BILLD | 51 | 2026-10-21 | Staging Heavy Duty - 9919 | 2026-11-12T07:30:02Z |
| doc:P12:billD1 | bill | ZZT-P12-BILLD1 | 52 | 2026-10-22 | Staging Heavy Duty - 9919 | 2026-11-12T07:30:07Z |
| doc:P20:bill | bill | ZZT-P20-BILL | 200 | 2026-10-13 | Staging Heavy Duty - 9919 | 2026-11-12T07:30:12Z |
| doc:P20:pay | vpayment |  | 80 | 2026-10-17 | Staging Heavy Duty - 9919 | 2026-11-12T07:30:13Z |
| doc:P21:bill | bill | ZZT-P21-BILL | 35 | 2026-10-18 | Staging Heavy Duty - 9919 | 2026-11-12T07:30:17Z |
| doc:P21:use | vapply_credit |  | 35 | 2026-10-31 | Staging Heavy Duty - 9919 | 2026-11-12T07:30:21Z |
| doc:P21:vc | vendor_credit | ZZT-VC-P21-VC | 35 | 2026-10-23 | Staging Heavy Duty - 9919 | 2026-11-12T07:30:19Z |
| doc:P24:vc | vendor_credit | ZZT-VC-P24-VC | 12 | 2026-09-03 | Staging Heavy Duty - 9919 | 2026-11-12T07:30:22Z |
| doc:P26:bill | bill | ZZT-P26-BILL | 26 | 2026-11-07 | Staging Heavy Duty - 9919 | 2026-11-12T07:30:28Z |
| doc:P27:bill | bill | ZZT-P27-BILL | 100 | 2026-10-28 | Staging Heavy Duty - 9919 | 2026-11-12T07:30:32Z |
| doc:P52:bill_cur | bill | ZZT-P52-BILL_CUR | 90 | 2026-11-07 | Staging Heavy Duty - 9919 | 2026-11-12T07:30:41Z |
| doc:P52:bill_late | bill | ZZT-P52-BILL_LATE | 300 | 2026-09-03 | Staging Heavy Duty - 9919 | 2026-11-12T07:30:37Z |
| doc:P52:vc | vendor_credit | ZZT-VC-P52-VC | 20 | 2026-10-08 | Staging Heavy Duty - 9919 | 2026-11-12T07:30:42Z |
| doc:P56:bill | bill | ZZT-P56-BILL | 56 | 2026-11-06 | Staging Lethbridge - 4310 | 2026-11-12T07:29:56Z |
| doc:P57:bill | bill | ZZT-P57-BILL | 57 | 2026-10-22 | Staging Heavy Duty - 9919 | 2026-11-12T07:30:47Z |
| doc:P58:vc | vendor_credit | ZZT-VC-P58-VC | 25 | 2026-11-02 | Staging Heavy Duty - 9919 | 2026-11-12T07:30:49Z |
| doc:P60A:bill | bill | ZZT-P60A-BILL | 61 | 2026-11-04 | Staging Heavy Duty - 9919 | 2026-11-12T07:30:53Z |
| doc:P60B:bill | bill | ZZT-P60B-BILL | 62 | 2026-11-03 | Staging Heavy Duty - 9919 | 2026-11-12T07:30:58Z |
| doc:P61:bill_cur | bill | ZZT-P61-BILL_CUR | 63 | 2026-11-09 | Staging Heavy Duty - 9919 | 2026-11-12T07:31:03Z |
| doc:P61:bill_late | bill | ZZT-P61-BILL_LATE | 64 | 2026-10-03 | Staging Heavy Duty - 9919 | 2026-11-12T07:31:06Z |
| doc:P61:vc | vendor_credit | ZZT-VC-P61-VC | 8 | 2026-11-08 | Staging Heavy Duty - 9919 | 2026-11-12T07:31:08Z |
| doc:P62:b_mid | bill | ZZT-P62-B_MID | 72 | 2026-11-02 | Staging Heavy Duty - 9919 | 2026-11-12T07:31:13Z |
| doc:P62:b_new | bill | ZZT-P62-B_NEW | 71 | 2026-11-07 | Staging Heavy Duty - 9919 | 2026-11-12T07:31:16Z |
| doc:P62:b_old | bill | ZZT-P62-B_OLD | 73 | 2026-10-28 | Staging Heavy Duty - 9919 | 2026-11-12T07:31:19Z |
| doc:P75:vc_today2 | vendor_credit | ZZT-VC-P75-VC_TODAY2 | 9 | 2026-11-12 | Staging Heavy Duty - 9919 | 2026-11-12T07:31:21Z |
| doc:P75:vc_yday | vendor_credit | ZZT-VC-P75-VC_YDAY | 4 | 2026-11-11 | Staging Heavy Duty - 9919 | 2026-11-12T07:31:22Z |
| doc:P93:bill | bill | ZZT-P93-BILL | 93 | 2026-11-08 | Staging Heavy Duty - 9919 | 2026-11-12T07:31:28Z |
| doc:P93:vc_direct | vendor_credit_direct | ZZT-DIRECT-P93 | 7 |  | Staging Heavy Duty - 9919 | 2026-11-12T07:31:23Z |
| doc:P93:vc_return | vendor_credit | ZZT-VC-P93-VC_RETURN | 13 | 2026-11-09 | Staging Heavy Duty - 9919 | 2026-11-12T07:31:23Z |
| doc:R03:inv | invoice | S3-40035 | 33 | 2026-11-07 | Staging Lethbridge - 4310 | 2026-11-12T07:15:42Z |
| doc:R07:inv | invoice | S2-40037 | 65 | 2026-11-02 | Staging Heavy Duty - 9919 | 2026-11-12T07:16:04Z |
| doc:R11:cm | credit_memo | CM2-4542 | 15 | 2026-10-22 | Staging Heavy Duty - 9919 | 2026-11-12T07:16:20Z |
| doc:R11:inv | invoice | S2-40046 | 60 | 2026-10-21 | Staging Heavy Duty - 9919 | 2026-11-12T07:16:17Z |
| doc:R13:inv | invoice | S2-40052 | 100 | 2026-10-11 | Staging Heavy Duty - 9919 | 2026-11-12T07:16:35Z |
| doc:R13:pay | payment |  | 40 | 2026-10-16 | Staging Heavy Duty - 9919 | 2026-11-12T07:16:38Z |
| doc:R14:inv | invoice | S2-40055 | 80 | 2026-10-03 | Staging Heavy Duty - 9919 | 2026-11-12T07:16:50Z |
| doc:R14:pay | payment |  | 80 | 2026-10-13 | Staging Heavy Duty - 9919 | 2026-11-12T07:16:53Z |
| doc:R15:inv | invoice | S2-40056 | 100 | 2026-10-02 | Staging Heavy Duty - 9919 | 2026-11-12T07:17:07Z |
| doc:R15:pay | payment |  | 100 | 2026-10-07 | Staging Heavy Duty - 9919 | 2026-11-12T07:17:10Z |
| doc:R16:cm | credit_memo | CM2-4543 | 25 | 2026-10-23 | Staging Heavy Duty - 9919 | 2026-11-12T07:17:18Z |
| doc:R17:apply | apply_credit |  | 30 | 2026-10-28 | Staging Heavy Duty - 9919 | 2026-11-12T07:17:40Z |
| doc:R17:cm | credit_memo | CM2-4544 | 30 | 2026-10-18 | Staging Heavy Duty - 9919 | 2026-11-12T07:17:36Z |
| doc:R17:inv | invoice | S2-40060 | 30 | 2026-10-17 | Staging Heavy Duty - 9919 | 2026-11-12T07:17:32Z |
| doc:R18:dep_free | overpay_deposit | DEP2-4834 | 50 | 2026-11-03 | Staging Heavy Duty - 9919 | 2026-11-12T07:17:59Z |
| doc:R18:dep_wo | wo_deposit | DEP2-4835 | 70 | 2026-11-04 | Staging Heavy Duty - 9919 | 2026-11-12T07:18:02Z |
| doc:R18:inv_dep | invoice | S2-40062 | 10 | 2026-11-02 | Staging Heavy Duty - 9919 | 2026-11-12T07:17:53Z |
| doc:R19:dep_free | overpay_deposit | DEP2-4836 | 20 | 2026-10-31 | Staging Heavy Duty - 9919 | 2026-11-12T07:18:21Z |
| doc:R19:inv_dep | invoice | S2-40066 | 5 | 2026-10-30 | Staging Heavy Duty - 9919 | 2026-11-12T07:18:15Z |
| doc:R22:inv | invoice | S2-40067 | 10 | 2026-08-02 | Staging Heavy Duty - 9919 | 2026-11-12T07:18:34Z |
| doc:R23:cm | credit_memo | CM2-4546 | 15 | 2026-09-16 | Staging Heavy Duty - 9919 | 2026-11-12T07:18:41Z |
| doc:R28:cm | credit_memo | CM2-4547 | 40 | 2026-11-06 | Staging Heavy Duty - 9919 | 2026-11-12T07:18:51Z |
| doc:R29:inv1 | invoice | S2-40070 | 45 | 2026-10-29 | Staging Heavy Duty - 9919 | 2026-11-12T07:19:06Z |
| doc:R29:inv2 | invoice | S2-40072 | 55 | 2026-10-23 | Staging Heavy Duty - 9919 | 2026-11-12T07:19:14Z |
| doc:R30:cm | credit_memo | CM2-4548 | 30 | 2026-11-07 | Staging Heavy Duty - 9919 | 2026-11-12T07:19:39Z |
| doc:R30:inv_cur | invoice | S2-40076 | 50 | 2026-11-06 | Staging Heavy Duty - 9919 | 2026-11-12T07:19:36Z |
| doc:R30:inv_late | invoice | S2-40075 | 100 | 2026-10-03 | Staging Heavy Duty - 9919 | 2026-11-12T07:19:28Z |
| doc:R31K:inv | invoice | S2-40077 | 1234.56 | 2026-11-10 | Staging Heavy Duty - 9919 | 2026-11-12T07:19:51Z |
| doc:R31N:cm | credit_memo | CM2-4549 | 12 | 2026-11-09 | Staging Heavy Duty - 9919 | 2026-11-12T07:19:59Z |
| doc:R36X:inv | invoice | S2-40078 | 110 | 2026-10-28 | Staging Heavy Duty - 9919 | 2026-11-12T07:20:13Z |
| doc:R36Z:inv | invoice | S2-40079 | 120 | 2026-10-25 | Staging Heavy Duty - 9919 | 2026-11-12T07:20:26Z |
| doc:R41:inv | invoice | S2-40081 | 250 | 2026-11-04 | Staging Heavy Duty - 9919 | 2026-11-12T07:20:39Z |
| doc:R41:pay | payment |  | 100 | 2026-11-08 | Staging Heavy Duty - 9919 | 2026-11-12T07:20:41Z |
| doc:R42:cm | credit_memo | CM2-4550 | 5 | 2026-10-27 | Staging Heavy Duty - 9919 | 2026-11-12T07:20:49Z |
| doc:R44:inv1 | invoice | S2-40082 | 40 | 2026-11-02 | Staging Heavy Duty - 9919 | 2026-11-12T07:21:00Z |
| doc:R44:inv2 | invoice | S2-40083 | 41 | 2026-10-23 | Staging Heavy Duty - 9919 | 2026-11-12T07:21:08Z |
| doc:R45:cm | credit_memo | CM2-4551 | 9 | 2026-11-05 | Staging Heavy Duty - 9919 | 2026-11-12T07:21:43Z |
| doc:R45:invA | invoice | S2-40084 | 71 | 2026-10-08 | Staging Heavy Duty - 9919 | 2026-11-12T07:21:23Z |
| doc:R45:invB | invoice | S2-40087 | 72 | 2026-10-13 | Staging Heavy Duty - 9919 | 2026-11-12T07:21:32Z |
| doc:R45:invC | invoice | S2-40088 | 73 | 2026-10-20 | Staging Heavy Duty - 9919 | 2026-11-12T07:21:40Z |
| doc:R46:cm | credit_memo | CM2-4552 | 11 | 2026-11-05 | Staging Heavy Duty - 9919 | 2026-11-12T07:21:50Z |
| doc:R47:inv_mid | invoice | S2-40089 | 22 | 2026-10-24 | Staging Heavy Duty - 9919 | 2026-11-12T07:22:02Z |
| doc:R47:inv_new | invoice | S2-40090 | 21 | 2026-11-03 | Staging Heavy Duty - 9919 | 2026-11-12T07:22:10Z |
| doc:R47:inv_old | invoice | S2-40091 | 23 | 2026-10-14 | Staging Heavy Duty - 9919 | 2026-11-12T07:22:17Z |
| doc:R48:cm | credit_memo | CM2-4553 | 3 | 2026-11-09 | Staging Heavy Duty - 9919 | 2026-11-12T07:22:32Z |
| doc:R48:inv | invoice | S2-40092 | 48 | 2026-10-31 | Staging Heavy Duty - 9919 | 2026-11-12T07:22:29Z |
| doc:R71:ps | part_sale |  |  |  | Staging Lethbridge - 4310 | 2026-11-12T07:15:47Z |
| doc:R71:wo | open_wo | S-40036 |  |  | Staging Lethbridge - 4310 | 2026-11-12T07:15:46Z |
| doc:R74:cm_today | credit_memo | CM2-4554 | 8 | 2026-11-12 | Staging Heavy Duty - 9919 | 2026-11-12T07:22:43Z |
| doc:R74:cm_yday | credit_memo | CM2-4555 | 6 | 2026-11-11 | Staging Heavy Duty - 9919 | 2026-11-12T07:22:46Z |
| doc:R74:inv | invoice | S2-40093 | 86 | 2026-11-02 | Staging Heavy Duty - 9919 | 2026-11-12T07:22:54Z |
| doc:R76:inv | invoice | S2-40094 | 100 | 2026-10-23 | Staging Heavy Duty - 9919 | 2026-11-12T07:23:07Z |
| doc:R90:cms | credit_memo_many |  | 1 | 2026-11-07 | Staging Heavy Duty - 9919 | 2026-11-12T07:28:49Z |
| inv:V1R87C | invoice | S2-40099 | 87.00 | 2026-11-02 | ZZAUTOTEST V1R-87 Location C | 2026-11-12T07:32:30Z |
| many:R90:cms#1 | credit memo | CM2-4556 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#2 | credit memo | CM2-4557 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#3 | credit memo | CM2-4558 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#4 | credit memo | CM2-4559 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#5 | credit memo | CM2-4560 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#6 | credit memo | CM2-4561 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#7 | credit memo | CM2-4562 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#8 | credit memo | CM2-4563 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#9 | credit memo | CM2-4564 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#10 | credit memo | CM2-4565 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#11 | credit memo | CM2-4566 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#12 | credit memo | CM2-4567 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#13 | credit memo | CM2-4568 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#14 | credit memo | CM2-4569 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#15 | credit memo | CM2-4570 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#16 | credit memo | CM2-4571 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#17 | credit memo | CM2-4572 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#18 | credit memo | CM2-4573 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#19 | credit memo | CM2-4574 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#20 | credit memo | CM2-4575 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#21 | credit memo | CM2-4576 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#22 | credit memo | CM2-4577 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#23 | credit memo | CM2-4578 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#24 | credit memo | CM2-4579 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#25 | credit memo | CM2-4580 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#26 | credit memo | CM2-4581 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#27 | credit memo | CM2-4582 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#28 | credit memo | CM2-4583 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#29 | credit memo | CM2-4584 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#30 | credit memo | CM2-4585 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#31 | credit memo | CM2-4586 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#32 | credit memo | CM2-4587 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#33 | credit memo | CM2-4588 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#34 | credit memo | CM2-4589 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#35 | credit memo | CM2-4590 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#36 | credit memo | CM2-4591 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#37 | credit memo | CM2-4592 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#38 | credit memo | CM2-4593 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#39 | credit memo | CM2-4594 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#40 | credit memo | CM2-4595 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#41 | credit memo | CM2-4596 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#42 | credit memo | CM2-4597 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#43 | credit memo | CM2-4598 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#44 | credit memo | CM2-4599 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#45 | credit memo | CM2-4600 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#46 | credit memo | CM2-4601 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#47 | credit memo | CM2-4602 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#48 | credit memo | CM2-4603 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#49 | credit memo | CM2-4604 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#50 | credit memo | CM2-4605 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#51 | credit memo | CM2-4606 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#52 | credit memo | CM2-4607 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#53 | credit memo | CM2-4608 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#54 | credit memo | CM2-4609 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#55 | credit memo | CM2-4610 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#56 | credit memo | CM2-4611 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#57 | credit memo | CM2-4612 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#58 | credit memo | CM2-4613 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#59 | credit memo | CM2-4614 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#60 | credit memo | CM2-4615 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#61 | credit memo | CM2-4616 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#62 | credit memo | CM2-4617 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#63 | credit memo | CM2-4618 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#64 | credit memo | CM2-4619 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#65 | credit memo | CM2-4620 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#66 | credit memo | CM2-4621 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#67 | credit memo | CM2-4622 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#68 | credit memo | CM2-4623 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#69 | credit memo | CM2-4624 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#70 | credit memo | CM2-4625 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#71 | credit memo | CM2-4626 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#72 | credit memo | CM2-4627 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#73 | credit memo | CM2-4628 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#74 | credit memo | CM2-4629 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#75 | credit memo | CM2-4630 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#76 | credit memo | CM2-4631 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#77 | credit memo | CM2-4632 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#78 | credit memo | CM2-4633 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#79 | credit memo | CM2-4634 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#80 | credit memo | CM2-4635 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#81 | credit memo | CM2-4636 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#82 | credit memo | CM2-4637 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#83 | credit memo | CM2-4638 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#84 | credit memo | CM2-4639 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#85 | credit memo | CM2-4640 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#86 | credit memo | CM2-4641 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#87 | credit memo | CM2-4642 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#88 | credit memo | CM2-4643 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#89 | credit memo | CM2-4644 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#90 | credit memo | CM2-4645 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#91 | credit memo | CM2-4646 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#92 | credit memo | CM2-4647 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#93 | credit memo | CM2-4648 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#94 | credit memo | CM2-4649 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#95 | credit memo | CM2-4650 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#96 | credit memo | CM2-4651 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#97 | credit memo | CM2-4652 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#98 | credit memo | CM2-4653 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#99 | credit memo | CM2-4654 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#100 | credit memo | CM2-4655 | | | Staging Heavy Duty - 9919 |  |
| many:R90:cms#101 | credit memo | CM2-4656 | | | Staging Heavy Duty - 9919 |  |

184 document rows. Reversed/voided ones are noted in the ledger (`reversed_now`, `voided_now`).
