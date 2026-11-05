# SV-11885 — Report downloads: text that starts with =, +, - or @ opens as a formula in a spreadsheet

**Ticket:** https://shopview.atlassian.net/browse/SV-11885 (status TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com

## Verdict: PASS
- Every download that can carry such a value was checked, and every value got exactly one apostrophe. That covers all 11 downloads in Reports → Export Reports, their location columns, and a leading tab and carriage return.
- One column cannot carry such a value at all: Journal Entry "Description" (see the table).
- QuickBooks was not checked; the QA lead asked to skip it (5 Nov 2026).

## What the ticket expects (verbatim)
> **Expected**
> Every text cell in every report download that starts with =, +, -, @, a tab or a carriage return gets one apostrophe in front of it, so a spreadsheet opens it as text. This is the same guard the newer report downloads already use. Numbers, dates and money columns are not changed. Nothing sent to QuickBooks ever carries the apostrophe.
>
> **How to check** 1. Create a customer named "=1+1" and a vendor named "-Test". 2. Download each report listed above for a range that includes them. 3. Open each file in a plain text editor. Their names start with one apostrophe. 4. Open each file in a spreadsheet. The names show as typed, not as 2 or an error.

Source: SV-11885 description. The downloads in scope come from Nemanja Djuric's comment on SV-11869 (28 Oct 2026, comment 79656): "the 10 older report downloads (customer contacts, payments, credit memos, vendor bills, journal entries, payroll timesheets, …)". That list is not complete in writing (it ends in "…"). I took it to mean the ten older entries in Reports → Export Reports, which on this build lists exactly 11 downloads: Customer Invoice plus ten.

## Per-download result
"Checked" means the raw file bytes were read (step 3) and the file was imported into LibreOffice with formulas switched on (step 4).

| Download | Text values checked (as written in the raw file) | Result |
|---|---|---|
| Customer Contact | `'=1+1`, `'+ZZAUTOTEST QA11839 Plus`, `'@Contact Test`, `'@ZZAUTOTEST -Contact`; **TAB:** `'<TAB>ZZAUTOTEST TAB Contact`, `'<TAB>ZZAUTOTEST QA11839 TAB customer`; **CR:** `'<CR>ZZAUTOTEST CR Contact`, `'<CR>ZZAUTOTEST QA11839 CR customer` | **Verified**: one apostrophe each, including before the tab and the carriage return |
| Customer Invoice | Customer `'=1+1`, `'+ZZAUTOTEST QA11839 Plus`; **Location** `'=ZZAUTOTEST Test Location` (location renamed for 79 s, see below) | **Verified** |
| Customer Payment | Customer `'=1+1` | **Verified** |
| Customer Credit Memo | Customer `'=1+1`, `'+ZZAUTOTEST QA11839 Plus` | **Verified** |
| Vendor Contact | `'-Test Vendor`, `'@ZZAUTOTEST QA11839 Vendor` | **Verified** |
| Vendor Bill | Supplier `'-Test Vendor` | **Verified** |
| Vendor Bill Payment | Vendor `'-Test Vendor` (2 rows) | **Verified** |
| Vendor Credit Memo | Ref No `'=ZZCM 1+1` · Vendor `'@ZZAUTOTEST QA11839 Vendor` · Memo `'-ZZAUTOTEST return note` · Expense Description `'+ZZPN-885 - @ZZAUTOTEST part desc` · Expense Class (location) `'=ZZAUTOTEST Test Location` | **Verified** (Today and This Month) |
| Payroll Timesheet | Employee Name `'-ZZAUTOTEST QA11839 Tech` | **Verified** |
| Journal Entry | Location and Class `'=ZZAUTOTEST Test Location` (4 rows) | **Verified** |
| Journal Entry, "Description" column | — | **Cannot occur.** The description is written by the system and always starts with "Inventory Increase; " or "Inventory Decrease; " (product code `api/src/Reporting/Domain/JournalEntry/Services/DescriptionGenerator.php`). This is not counted as a pass. |
| Sales Representative Assignments | Customer Name `'+ZZAUTOTEST QA11839 Plus` · Sales Representative `'-ZZAUTOTEST QA11839 Tech` | **Verified** |
| QuickBooks (nothing sent there carries the apostrophe) | — | **Not checked**: the QA lead asked to skip it (5 Nov 2026) |

Across every file:
- **No unguarded cell** starting with = + - @ tab or CR.
- **No double apostrophe.**
- **No apostrophe on any number, amount or date.** Negative amounts in Journal Entry and Vendor Bill Payment stay plain numbers.
- The Journal Entry and Vendor Credit Memo files exported during the rename differ from the ones exported just before it **only in the location cells**; every number is byte-identical.
- In LibreOffice with formulas on, **every guarded cell opened as text and there were zero formula cells**. LibreOffice shows the apostrophe in the cell; SV-11869 notes that some spreadsheet apps show it and some hide it.

## What I did
1. **4 Nov, Heavy Duty (America/Edmonton):** used existing test records ("=1+1", "@Contact Test", "-Test Vendor") and seeded customer "+ZZAUTOTEST QA11839 Plus" (contact "@ZZAUTOTEST -Contact", invoice, credit memo), technician "-ZZAUTOTEST QA11839 Tech" (clocked on that work order) and vendor "@ZZAUTOTEST QA11839 Vendor". Then exported all 11 downloads (This Month) and scanned them (`scan-before.json`, `scan-after.json`).
2. **5 Nov, Test Location (Asia/Karachi), on screen:**
   - Parts → Create Credit, posted a vendor credit: vendor "@ZZAUTOTEST QA11839 Vendor", credit memo number "=ZZCM 1+1", part number "+ZZPN-885", description "@ZZAUTOTEST part desc", note "-ZZAUTOTEST return note", credit date 11/05/2026. The screen said "Manual return credited successfully".
   - My manual vendor credit from 4 Nov (`POST /api/parts-catalogue/vendor/credit/create`) is a different kind of record and does not appear in this download.
3. **5 Nov, Test Location, set-up through the same requests the screen uses:**
   - customers and contacts whose names start with a **tab** and with a **carriage return** (the screen cannot type a leading tab);
   - one invoiced work order;
   - one inventory part whose quantity was changed by hand (1 → 2), which creates Journal Entry rows.
   - The sales rep of "+ZZAUTOTEST QA11839 Plus" was set to "-ZZAUTOTEST QA11839 Tech" by request, because the customer dialog's Sales Representative picker does not offer that staff member ("No results").
4. **Location name test:**
   - Settings → Locations, renamed "Test Location" to "=ZZAUTOTEST Test Location" on screen.
   - Exported Journal Entry, Customer Invoice and Vendor Credit Memo (Today).
   - Renamed it back on screen at once.
   - **Window 03:37:33.730 → 03:38:52.968 UTC (79 s).** The rename save answered 201 at 03:37:45.993 UTC. Read-back after restore: "Test Location", and the whole location record is identical to the one saved before the rename (`test-location-original-record.json`).

## Build, time, location, zones
- Build: v26.45.0-aacb66c (`app-version` on sv11839).
- When: 4 Nov 2026 20:55–21:13 UTC (Heavy Duty) and 5 Nov 2026 03:20–03:45 UTC (Test Location). sv11839 was asleep on 5 Nov and was woken with the recorded `toggleQaEnv` call.
- Zones (Rule 99), all recorded in the evidence JSON, for every run:
  - session `change-location` with the location's zone (HTTP 200);
  - browser `timezoneId`;
  - process `TZ`;
  - `localStorage['timezone']`;
  - header / location selector showing the location at the start and end.
- Values: Heavy Duty = America/Edmonton; Test Location = Asia/Karachi.

## Pictures (deviceScaleFactor 2)
- `SV-11885/vc-2-create-credit-filled.png`: the vendor credit as entered on screen.
- `SV-11885/vc-3-after-post-credit.png`: "Manual return credited successfully".
- `SV-11885/loc-1-settings-locations-renamed.png`: Settings → Locations with the temporary name.
- `SV-11885/0-export-dialog-after.png`: Reports → Export Reports.

## Evidence
- `scan-before.json`, `scan-after.json` (4 Nov) and `scan-test-location-2026-11-05.json` (5 Nov): per file, the counts of unguarded, guarded and double apostrophes, and of apostrophes on numbers.
- `raw-file-lines-test-records-after.txt` and `raw-bytes-test-records-2026-11-05.txt`: the exact raw bytes of the test rows, with tab and CR shown.
- `evidence-test-location-rename.json`: every download made on 5 Nov, the rename and restore responses, and the zone record.
- `evidence-vendor-credit-post.json`, `evidence-sales-rep.json`, `downloads-*.json`, `vendor-credit-memo-export-network.json`.
- The downloaded files themselves stay out of git because they hold business data.

No Jira or TestRail write was made.

## Draft QA-pass comment (NOT POSTED)
QA check on the QA branch sv11839 (build v26.45.0-aacb66c), 4–5 Nov 2026, at Staging Heavy Duty - 9919 (Edmonton time) and Test Location (Karachi time).

I downloaded every report in Reports → Export Reports (all 11) with test names that start with =, +, - and @, and with a tab or a line break at the start. For example:
- customer "=1+1" and "+ZZAUTOTEST QA11839 Plus";
- vendor "-Test Vendor";
- a vendor credit numbered "=ZZCM 1+1";
- sales rep "-ZZAUTOTEST QA11839 Tech";
- for a minute, a location named "=ZZAUTOTEST Test Location".

Opened in a text editor, every one of those names starts with exactly one apostrophe, and numbers and amounts are unchanged. Opened in a spreadsheet, they all show as text, not as a formula or an error.

The Journal Entry description can never start with these characters, because the system writes it ("Inventory Increase; …"). QuickBooks was not checked, as agreed. The location name was put back straight away.

Picture: SV-11885/vc-2-create-credit-filled.png
