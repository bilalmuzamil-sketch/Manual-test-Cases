# QA of the 14 "TESTING QA" tickets of epic SV-11839 on its QA branch — 4 Nov 2026

**Branch:** https://sv11839.qa.shopview.com (API https://sv11839api.qa.shopview.com) · **Build:** v26.45.0-aacb66c, read from the page's `app-version` (the brief said v26.43.5-c73a58b; the branch has moved on) · **Tester:** Claude, as the QA lead's own session (no quick-login, no switch-user) · **Go-ahead:** QA lead Bilal Muzamil, "Yes", 4 Nov 2026 · None of these 14 tickets had been QA-tested by us on sv11839 before.

**No Jira or TestRail write was made.** Comments to post are drafted in each ticket's `RESULT.md`. There are no FAILs, so there is no `FAIL-annotated.png`.

Every check ran with the location's zone matched in all four places: session change-location, browser time zone, process `TZ`, and the app's own `localStorage['timezone']`. All four are recorded in each evidence JSON, together with the header location at the start and end. See "Environment notes" for one caveat about the time-zone data.

| Ticket | Title | Verdict | One-line reason | Evidence |
|---|---|---|---|---|
| [SV-11691](https://shopview.atlassian.net/browse/SV-11691) | Invoices marked Paid with $0 payments | **PASS** | All 4 invoices now Unpaid at full amount and not payable; Balance = A/R Aging for Wellington ($2,182.34), Inland ($7,298.24), Oakland ($98.26). Work orders still say Paid, as Chris ruled (fixed one by one) | `SV-11691/` |
| [SV-11820](https://shopview.atlassian.net/browse/SV-11820) | Service Advisor Analysis excludes inactive advisor | **PASS** | Seeded invoice whose advisor was deleted stays in SAA as "Unknown (Inactive)"; This month: Sales 8.75 h / 250.00% = SAA 8.75 h / 250.00% = tile 250.00% | `SV-11820/` |
| [SV-11821](https://shopview.atlassian.net/browse/SV-11821) | "1 Invoices" / "Range: 1 days" | **PASS** | "Range: 1 day", one date shown; seeded one-invoice day reads "1 Invoice" | `SV-11821/` |
| [SV-11822](https://shopview.atlassian.net/browse/SV-11822) | Location dropdown empty after reload (DVI Test) | **PASS** (retest 5 Nov) | A "DVI Test" copied field for field from staging (Pacific/Fiji, #2276DA, US) was created on sv11839. After a reload on Dashboard, Reports and Work Orders, at 1536×936 and 1920×1080, the list opens on screen with all 4 locations, and switching away and back works. The Lethbridge control is the same | `SV-11822/` |
| [SV-11823](https://shopview.atlassian.net/browse/SV-11823) | Negative Parts % with credit memos | **PASS** | Parts −$306.79 → "4 Invoices"; Parts −$25.00 → "1 Invoice"; Parts exactly $0.00 → split still shown "Parts 0% · Labor 90% · Other 10%" | `SV-11823/` |
| [SV-11824](https://shopview.atlassian.net/browse/SV-11824) | First date click clears the range | **PASS** | One click selects the date ("Oct 9, 2026", "Range: 1 day"), also inside the current range and with a custom range set | `SV-11824/` |
| [SV-11825](https://shopview.atlassian.net/browse/SV-11825) | "Open Sales Report report" | **PASS** | All 5 links read "Open … Report" once | `SV-11825/` |
| [SV-11826](https://shopview.atlassian.net/browse/SV-11826) | Tech Utilization tile vs report 0.02–0.03 h | **PASS** (with caveat) | Same-moment reads match (15 of 16 identical, 1 off by 0.01 with the answers 0.4 s apart); past ranges always exact. On-screen gaps (≤ 0.04 WO / 0.08 h) come from opening the report seconds after the tile while clocks run | `SV-11826/` |
| [SV-11827](https://shopview.atlassian.net/browse/SV-11827) | Reports show dates instead of "Custom" | **PASS** | Technician Utilization and Sales By Customer open with "Date: Custom" (Oct 9 – Oct 20, 2026) | `SV-11827/` |
| [SV-11828](https://shopview.atlassian.net/browse/SV-11828) | ~1023 px: mixed layout | **PASS** | 1022, 1023 and true fractional 1023.33 px (browser zoom) all one column + "View Report"; 1024 px desktop | `SV-11828/` |
| [SV-11829](https://shopview.atlassian.net/browse/SV-11829) | Expanded chart/table don't show load failure | **PASS** | With the request forced to fail (HTTP 500 in the browser): tile, chart and table all "Couldn't load", no "No data", no old figures, both cases | `SV-11829/` |
| [SV-11885](https://shopview.atlassian.net/browse/SV-11885) | Downloads: text starting = + - @ | **PASS** (follow-up 5 Nov) | All 11 Export Reports downloads, their location columns and a leading tab/CR get exactly one apostrophe; numbers untouched; opens as text. Journal Entry "Description" cannot hold such text (system-written). QuickBooks skipped on the QA lead's instruction | `SV-11885/` |
| [SV-11931](https://shopview.atlassian.net/browse/SV-11931) | Tech Efficiency counts a declined line | **PASS** | Seeded WO S11839-17589: technician row 1.00 Clocked / 1.00 Invoiced / 100.00% (declined line left out) | `SV-11931/` |
| [SV-11934](https://shopview.atlassian.net/browse/SV-11934) | Labor Delta keeps old value after timesheet edit | **PASS** | Seeded WO S11839-17590: +0.50 → timesheet corrected → Stats 1.00/1.00 → Dashboard and report Labor Delta 0.00 | `SV-11934/` |

**Totals:** 14 PASS · 0 BLOCKED · 0 FAIL. (SV-11885 was completed on 5 Nov; SV-11822 was retested on 5 Nov on a DVI Test location copied from staging.)

## NOT VERIFIED, and why
- (Resolved on 5 Nov: SV-11822's DVI Test condition was tested on a location copied from staging; see `SV-11822/RESULT.md`.)
- **SV-11885, Journal Entry "Description" column: cannot occur, not a pass.** It is written by the system and always starts "Inventory Increase; " or "Inventory Decrease; " (product code `api/src/Reporting/Domain/JournalEntry/Services/DescriptionGenerator.php`).
- **SV-11885, QuickBooks: not checked**, on the QA lead's instruction (5 Nov 2026).
- (Resolved on 5 Nov: Vendor Credit Memo, Sales Representative Assignments, the Location columns, and a leading tab or carriage return are now verified; see `SV-11885/RESULT.md`.)
- **SV-11691, the census list.** The developer's read-only command is a server command and wasn't run by QA.

## Separate issues found (not filed — for the QA lead to decide)
1. **A credit memo issued today shows as "1-30 days past due" in A/R Aging.** Found while testing **SV-11691**.
   - I issued credit memo CM11839-4190 (−$25.00) at Lethbridge at 19:21 UTC on 4 Nov 2026.
   - A/R Aging Summary/Detail puts it in **1-30 Days**, while invoice S11839-17591 for the same customer, issued 29 seconds later, is in **Current**.
   - The server gives both the same kind of due date (the moment of issue): the credit `"dueDate": "2026-11-04 19:21:47"`, the invoice `"dueDate": "2026-11-04 19:22:16"`.
   - Evidence: `SV-11691/5-ar-aging-summary-wellington.png` (row "ZZAUTOTEST QA11839 Credit": Current $185.58, 1-30 Days $-25.00) and `SV-11691/evidence-ar-detail-lethbridge-extract.json`.
   - I haven't checked a source document for how credits should be aged, so this needs a source before it could become a ticket (Rule 57).
   - **No ticket yet** (related ticket: [SV-11691](https://shopview.atlassian.net/browse/SV-11691)). **My recommendation:** ask Chris Ward which column a same-day credit belongs in, before raising anything.
2. **An empty Export Reports download gives no feedback.** Found while testing **SV-11885**.
   - Choosing Vendor Credit Memo and clicking Export downloads nothing and shows no message; the server answers HTTP 200 with an empty report `{"data":[""]}`.
   - A user can't tell "no records" from "nothing happened".
   - Evidence: `SV-11885/vendor-credit-memo-export-this-month.png` and `SV-11885/vendor-credit-memo-export-network.json`.
   - No source checked for the intended behaviour.
   - **Re-checked 5 Nov 2026 with a vendor credit now in range** (Test Location, Asia/Karachi): Vendor Credit Memo for **Today** and **This Month** downloads a file, but for **Yesterday** (no credits) Export still gives **no file and no message**. Evidence: `SV-11885/evidence-test-location-rename.json` (the download log).
   - **No ticket yet** (related ticket: [SV-11885](https://shopview.atlassian.net/browse/SV-11885)). **My recommendation:** leave it unless the PRD or Chris says an empty export should show a message.

## Environment notes (test harness, not product findings)
- **Time-zone data mismatch.** This machine's time-zone database (version 2026e) puts **America/Edmonton at UTC−6** from 1 Nov 2026. The test browser (Chromium 153) still uses **UTC−7**.
  - The app's displayed times followed UTC−6 (a timesheet edit at 20:26 UTC is stamped "02:26 PM").
  - The browser-built date ranges ended at `…T06:59:59.999Z` (UTC−7).
  - No result here depends on the hour around midnight, but the two offsets are recorded. Added to `build/APP-ACTIONS-PLAYBOOK.md`.
- **Forcing a load failure with a blocked connection (`route.abort`) brings up the hosting service's "Environment Sleeping" page**, as recorded in `build/report-suite/rulings-2026-08-04/RULING-1-THE-15-CASES.md`. SV-11829 therefore used an HTTP 500 answer instead.
- **Other new working methods are written into `build/APP-ACTIONS-PLAYBOOK.md`** (section "QA-branch seeding & screen recipes proven on sv11839, 4 Nov 2026"). They cover:
  - clocking a technician without switch-user;
  - creating and deleting staff;
  - setting the service advisor;
  - vendor credits;
  - Export Reports;
  - real fractional browser widths;
  - the narrow-screen header.

## Test data created on sv11839 (all ZZAUTOTEST, disposable QA branch)
- **Customers:**
  - ZZAUTOTEST QA11839 TE Declined
  - ZZAUTOTEST QA11839 SBC Delta
  - ZZAUTOTEST QA11839 Credit (Lethbridge)
  - ZZAUTOTEST QA11839 Advisor Deleted
  - +ZZAUTOTEST QA11839 Plus
- **Work orders and invoices:** S11839-17589 (SV-11931), S11839-17590 (SV-11934), S11839-17591 (SV-11821/11823), S11839-17592 and S11839-17593 (unintended extra invoices from the SV-11820 seeding, advisor Admin ShopView), S11839-17594 (SV-11820), plus one work order for "+ZZAUTOTEST QA11839 Plus" (SV-11885).
- **Credit memos:** CM-4190 (−$25, Lethbridge) and CM-4191 (−$5).
- **Vendor:** "@ZZAUTOTEST QA11839 Vendor", with one vendor credit.
- **Staff:**
  - "ZZAUTOTEST Advisor QA11839" — created, then **deleted** (that was the test).
  - "-ZZAUTOTEST QA11839 Tech" — **still present**: deleting it is refused ("Staff is being used elsewhere.") because it has a timesheet.
- **Timesheet change:** the clock on S11839-17590 was moved from 11:51 AM to 11:21 AM, as the SV-11934 test requires.
- **5 Nov (SV-11885 follow-up, Test Location):**
  - customers "<TAB>ZZAUTOTEST QA11839 TAB customer" and "<CR>ZZAUTOTEST QA11839 CR customer", each with a contact;
  - customer "ZZAUTOTEST QA11839 TL Invoice" with one invoiced work order;
  - inventory part P550848 at Test Location (quantity 1 → 2, bin General Storage);
  - manual vendor credit "=ZZCM 1+1" for "@ZZAUTOTEST QA11839 Vendor";
  - sales rep "-ZZAUTOTEST QA11839 Tech" on customer "+ZZAUTOTEST QA11839 Plus".
- **Location rename:** "Test Location" was renamed to "=ZZAUTOTEST Test Location" for 79 s (03:37:33.730 → 03:38:52.968 UTC, 5 Nov) and restored. The read-back record is identical to the original.
- **5 Nov (SV-11822 retest):** location **"DVI Test"** created on sv11839 (id 93404b24-8d43-4459-b152-513e64e2ad81, Pacific/Fiji, a copy of staging's). **Left in place** as QA-branch data.
- Every seed call (90, with HTTP status) is in `seed-log.jsonl`; ids are in `seed-ids.json`.

## Questions for the QA lead
1. **[SV-11826](https://shopview.atlassian.net/browse/SV-11826).** When read at the same moment, the tile and the report match exactly; the gaps only appear when the report is opened seconds after the tile while technicians are clocked in. This disagrees with the 4 Nov reading in `rerun-sv11839-2026-11-04/SUMMARY-sv11839-2026-11-04.md`, row B, that it is the tile's own rounding. **My recommendation:** accept as passed / "cannot reproduce" (as the developer proposed in comment 79615), and correct row B of that summary.
2. **[SV-11822](https://shopview.atlassian.net/browse/SV-11822).** Retested on 5 Nov on a DVI Test copied from staging, at 1536×936 and 1920×1080: not reproducible; the list opens every time. Ayesha Khan's comment 80169 (4 Nov) says she checked "Staging and QA (sv11839)", but sv11839 had no DVI Test location until 5 Nov. **My recommendation:** move it to QA Complete as not reproducible, with the pass comment in `SV-11822/RESULT.md`.
3. **[SV-11885](https://shopview.atlassian.net/browse/SV-11885).** Completed on 5 Nov: every download that can carry such text passes. **My recommendation:** move it to QA Complete with the pass comment in `SV-11885/RESULT.md`.

## OUTSTANDING — what I need from you
- Decisions on the three questions above (SV-11826, SV-11822, SV-11885).
- Whether to take the two "Separate issues found" to Chris Ward. Neither is filed, and the Jira creation hold rules apply.
