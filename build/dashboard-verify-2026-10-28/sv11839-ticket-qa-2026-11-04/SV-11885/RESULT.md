# SV-11885 — Report downloads: text that starts with =, +, - or @ opens as a formula in a spreadsheet

**Ticket:** https://shopview.atlassian.net/browse/SV-11885 (status TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com

## Verdict: PASS for the 8 downloads that could be checked — 3 downloads (and the QuickBooks and tab/carriage-return parts) NOT VERIFIED

## What the ticket expects (verbatim)
> **Expected**
> Every text cell in every report download that starts with =, +, -, @, a tab or a carriage return gets one apostrophe in front of it, so a spreadsheet opens it as text. This is the same guard the newer report downloads already use. Numbers, dates and money columns are not changed. Nothing sent to QuickBooks ever carries the apostrophe.
>
> **How to check** 1. Create a customer named "=1+1" and a vendor named "-Test". 2. Download each report listed above for a range that includes them. 3. Open each file in a plain text editor. Their names start with one apostrophe. 4. Open each file in a spreadsheet. The names show as typed, not as 2 or an error.

Source: SV-11885 description. The list of downloads comes from Nemanja Djuric's comment on SV-11869 (28 Oct 2026, comment 79656): "the 10 older report downloads (customer contacts, payments, credit memos, vendor bills, journal entries, payroll timesheets, …)". **The full list of ten is not written down (it ends in "…")**; I took it to be the ten older entries in Reports → Export Reports, which on this build lists exactly 11 downloads (Customer Invoice + 10).

## What I did
Records used: existing test records on sv11839 — customer **"=1+1"**, contact **"@Contact Test"**, vendor **"-Test Vendor"** (made by another session on 3 Nov) — plus ZZAUTOTEST seeds made today at Heavy Duty: customer **"+ZZAUTOTEST QA11839 Plus"** with contact **"@ZZAUTOTEST -Contact"**, an invoice and a credit memo for it, staff **"-ZZAUTOTEST QA11839 Tech"** clocked on its work order, vendor **"@ZZAUTOTEST QA11839 Vendor"** with a vendor credit "=ZZAUTOTEST credit 1+1". Then Reports → Export Reports → each of the 11 reports → This Month → Export (downloaded before and after seeding); each file read as raw text (step 3) and imported into LibreOffice with formulas switched on (step 4).

## What I saw
| Download | Text checked (as in the raw file) | Result |
|---|---|---|
| Customer Contact | `'=1+1`, `'+ZZAUTOTEST QA11839 Plus`, `'@Contact Test`, `'@ZZAUTOTEST -Contact` | **one apostrophe each** |
| Customer Invoice (Customer column) | `'=1+1` (3 rows), `'+ZZAUTOTEST QA11839 Plus` | **one apostrophe each** |
| Customer Payment | `'=1+1` | **one apostrophe** |
| Customer Credit Memo | `'=1+1`, `'+ZZAUTOTEST QA11839 Plus` | **one apostrophe each** |
| Vendor Contact | `'-Test Vendor`, `'@ZZAUTOTEST QA11839 Vendor` | **one apostrophe each** |
| Vendor Bill | `'-Test Vendor` | **one apostrophe** |
| Vendor Bill Payment | `'-Test Vendor` (2 rows) | **one apostrophe each** |
| Payroll Timesheet | `'-ZZAUTOTEST QA11839 Tech` | **one apostrophe** |
| Vendor Credit Memo | — | **NOT VERIFIED**: the download gives no file (server answers an empty report). A vendor credit was created, but I could not confirm it is the kind of record this report lists |
| Journal Entry | — | **NOT VERIFIED**: its text is written by the system ("Inventory Increase; …") and always starts with a word, so no row can start with = + - @ |
| Sales Representative Assignments | — | **NOT VERIFIED**: none of its 1,859 rows has such a name; giving the test customer a sales rep failed (HTTP 500 on my request) |

Across all files: **no unguarded cell, no double apostrophe, and no apostrophe on a number or amount** (e.g. negative amounts in Journal Entry and Vendor Bill Payment stay plain). In LibreOffice (formulas on), every guarded cell opened as **text**, not a formula; LibreOffice shows the apostrophe in the cell (SV-11869's note says some spreadsheet apps show it and some hide it).

Also NOT VERIFIED: the **Location** column of Customer Invoice (no location name starts with these characters, and renaming a shared location was not done); a **tab or carriage return** at the start of a value (not seeded); **QuickBooks** (no QuickBooks connection was checked on sv11839).

## Build, time, location, zones
- Build: v26.45.0-aacb66c (read from `<meta name="app-version">` on sv11839; the brief said v26.43.5-c73a58b — the branch has moved on)
- When: 4 Nov 2026, 20:55–21:13 UTC
- Location **Staging Heavy Duty - 9919**. Zones (Rule 99), all recorded in the evidence JSON: session `change-location` with `workplace_timezone=America/Edmonton` (HTTP 200) · browser `timezoneId=America/Edmonton` · process `TZ=America/Edmonton` · `localStorage['timezone']="America/Edmonton"` · header/location selector showed Staging Heavy Duty - 9919 at the start and end of the run. Note: on this machine the time-zone database (2026e) puts America/Edmonton at UTC−6, while the test browser (Chromium 153) still uses UTC−7 — see RESULTS.md, environment notes.

## Pictures (deviceScaleFactor 2)
- `SV-11885/0-export-dialog-after.png`
- `SV-11885/vendor-credit-memo-export-this-month.png`

## Evidence
SV-11885/scan-before.json, scan-after.json (per file: unguarded / guarded / double / number counts), raw-file-lines-test-records-after.txt (the exact raw lines of the test records), downloads-*.json, vendor-credit-memo-export-network.json. The downloaded files themselves are kept out of git (they hold business data).

No Jira or TestRail write was made.

## Draft QA-pass comment (NOT POSTED)
QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. I downloaded the 11 reports in Reports → Export Reports (This Month) with test names starting with =, +, - and @ (for example customer "=1+1", vendor "-Test Vendor", technician "-ZZAUTOTEST QA11839 Tech"). In 8 downloads (Customer Contact, Customer Invoice, Customer Payment, Customer Credit Memo, Vendor Contact, Vendor Bill, Vendor Bill Payment, Payroll Timesheet) every such name starts with exactly one apostrophe, numbers are unchanged, and a spreadsheet opens them as text. Not checked yet: Vendor Credit Memo (no file was produced), Journal Entry (its text can never start with these characters), Sales Representative Assignments (no such name in it), and QuickBooks. Picture: SV-11885/0-export-dialog-after.png
