# SV-7192 — A/R & A/P report: add option to alphabetize customer names for print/PDF output to match QuickBooks
Status Blocked · updated 2026-11-10T04:37 · created 2026-05-05

## Description
(identical to the 26 Oct copy, JIRA-SV-11315-stories-2026-10-26.md; verified by script)

# SV-10798 — Enable sorting AP/AR report lists by clicking column headers
Status Blocked · updated 2026-11-10T04:37 · created 2026-10-02

## Description
(identical to the 26 Oct copy, JIRA-SV-11315-stories-2026-10-26.md; verified by script)

# SV-11315 — A/R and A/P report sorting
Status Ready for Development · updated 2026-11-10T05:39 · created 2026-10-14

## Description
### What

Make the six A/R and A/P aging reports (A/R Summary, Detail and Collection; A/P Summary, Detail and Unpaid Invoices) easy to read and match QuickBooks: they open in name order, A to Z, every column can be sorted by clicking its header, and printing or saving a PDF keeps the order on screen.

### Why

Shops reconcile these reports against QuickBooks, which lists customers alphabetically. Today the A/R report asks for A to Z but the order is not applied, there is no way to sort a column, and the printed copy comes out in the same unsorted order. Fast Truck and Trailer (SV-7192, SV-10798) and a large client via Cody are asking for this now.

### Scope

* The six aging reports in Reports > Finance only.
* Standalone project, separate from the app-wide Table sorting work (SV-11109).
* Includes PDF and CSV exports of all six reports, with size limits, and a Location filter. Background exports for very large reports come as a later phase of this epic (SV-11445).

### Tickets

* SV-10798: sort A/P and A/R by clicking column headers, default alphabetical.
* SV-7192: alphabetize customer names in the A/R and A/P print and PDF output to match QuickBooks.



## Comment Nemanja Djuric 2026-11-10T05:39 (updated 2026-11-10T05:39)
# QA Handoff — SV-11315 A/R and A/P aging reports rebuild (shared notes)

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`, self-review approved)
**Per-ticket handoffs:** a comment on each story (SV-11531–SV-11539), bug (SV-11441, SV-12135–SV-12141) and verification task (SV-11595–SV-11599). They describe the current build only and link back here.

---

## What changed (plain English)

* All six aging reports are rebuilt: A/R Aging Summary, A/R Aging Detail, A/R Aging Collection, A/P Aging Summary, A/P Aging Detail, A/P Unpaid Invoices.
* They open in QuickBooks name order, every column sorts, they have As of / Customer or Vendor / Past due / Location filters, a Location column, PDF and CSV exports, info icons, Collapse all / Expand all and pinned group rows, and document links that open only where the user can open them.
* The old aging code and its seven API addresses are removed. The old A/R Print button is gone; every report uses the ⋯ Export menu.

## How to reach the six reports

* Main menu → **Reports**. In the left list:

    * under "Accounts Receivable": "A/R Aging Summary", "A/R Aging Detail", "A/R Aging Collection";
    * under "Accounts Payable": "A/P Aging Summary", "A/P Aging Detail", "A/P Unpaid Invoices".
    
* Addresses: `/reports/ar-aging-summary`, `/reports/ar-aging-detail`, `/reports/ar-aging-collection`, `/reports/ap-aging-summary`, `/reports/ap-aging-detail`, `/reports/ap-unpaid-invoices`.
* Do not confuse them with Accounting → Reports (`/accounting/reports/ar-aging-summary` and similar). Those are the AccountingHub screens. This change does not touch them.

## Roles and permissions you need

| Who | Why |
| --- | --- |
| Admin enrolled at 2+ locations | Most steps; the "Switch location?" prompt; the Location filter and column |
| A user without Reports → Page Access (e.g. the Time Clock role) | Cannot open any of the six reports |
| A **custom role** with Reports → Page Access but **without** "View and Manage AP/AR Data" | No Credit term anywhere on A/R Collection. No default role separates these two, so make one |
| A custom role with Reports → Page Access but without Customers → View | A/R Summary customer names are plain text |
| A role without Invoicing & Payments → View, Work Orders → View, Part Sales → View and Vendor Order Management (view/edit) | Document numbers are plain text |

The reports are organization-wide for everyone who can open them. The Location filter only narrows; it never restricts by enrollment.

## Test data hints (QA environment)

* 2+ locations with open A/R and A/P documents. One location with a long name (wrap checks).
* Customers named "#1 Diesel", "-1 Diesel", "10 Trucking", "2 Trucking", "@Home Towing", "A-1 Towing", "a1 towing", "Emile's Towing", "Émile's", "Émile's Towing", "Øster", "Ozone" (one open invoice each). Same names as vendors with one bill each.
* One customer with several invoices on the same date, some created in the evening (after about 6 pm at the location).
* A credit memo and a deposit dated **today**, and a credit memo dated **yesterday**. A vendor credit dated today and one dated yesterday.
* A vendor credit that came from a vendor return, and one that did not.
* A bill due in 10 days (it shows Past Due "-10").
* A customer with a phone and a credit term; one with neither.
* An invoice at another location the admin is enrolled in, and one at a location the admin is not enrolled in.
* A vendor with more than 100 open bills (100-document windows). The QA organization already has large A/P data (about 13,500 A/P Detail lines), which also triggers the PDF limit.
* A document number longer than 20 characters.

## Behaviour every story shares

### Opening state

* As of = today at the location; Customer / Vendor = All; Past due = Any; Location = All locations.
* Opening sort: the name column on the Summaries and the Detail reports; Date (oldest first) on A/R Collection and A/P Unpaid. The sorted header shows the arrow. \[S1-R7\]
* Leaving and coming back resets the sort and collapses every group (nothing is remembered). \[S2-R8, S4-R9\]
* Every filter choice is kept in the page address. Reload, Back and a copied link restore it. \[S5-R10\]

### As of date

* The report sends the **picked day** (for example `asOfDate=2026-11-02`), not a time. The server ends that day in the location's time zone. \[S3-R4\]
* So the PDF and CSV always print the day you picked ("As of Nov 2, 2026" / "As of: Nov 2, 2026"), even in a browser with out-of-date time zone data.
* The date picker does not offer days after today. A link with a later `asOfDate` opens on today. If the API gets a later day anyway, it reads and prints it as today.

### Past Due and the buckets

* Past Due = the as-of day minus the due date's day, in **calendar days at the location's time zone**. Time of day never matters. \[S1-R5a\]
* A document is Current when its due date is on or after the as-of date. 1-30, 31-60, 61-90 and 91+ use the same calendar-day count.
* Bills not yet due show **negative** calendar days: a bill due Oct 25 reads "-10" as of Oct 15. Product decided this (Chris, 2026-11-05).
* A credit memo, deposit or vendor credit dated exactly on the as-of date is in **Current with Past Due 0** (SV-11441). An older credit is aged by its own date.
* The Past due filter ranges and A/R Collection's "overdue only" rule use the same count.

### What the cells show

* Dates are plain: "Nov 4, 2026", never "Today" or "2 days ago". PDF prints "Nov 04 2026", CSV "2026-11-04". \[S2-R1a\]
* Transaction Type: "Invoice", "Credit Memo", "Deposit" (A/R); "Invoice", "Vendor Credit" (A/P). Never "Credit". \[S2-R1b\]
* Money on screen: "$1,234.50", "$-12.00". In PDFs a negative reads "(-$12.00)" (app-wide PDF format, kept by Product).
* A missing Due Date or Past Due shows "—" (for example a vendor credit on A/P Unpaid). It sorts to the bottom of its group both ways. \[S2-R6\]
* Past Due is left-aligned (header and values). Its first click still sorts largest first.
* Headings are Title Case on screen, in the PDF and in the CSV. \[S2-R4a\]

### Group rows on the four grouped reports (A/R Detail, A/P Detail, A/R Collection, A/P Unpaid)

* **Closed group:** chevron first, then the bold name (bucket, customer or vendor) and its bold count "(N)", a bold "Total" in the column before Amount, and bold Amount and Open Balance.
* **Open group:** the group row shows only the chevron and the name with its count. After the group's last line comes a **"Total for <name>"** row with bold Amount and Open Balance (for example "Total for 91 or more days past due", "Total for Acme Towing").

    * On a customer or vendor with more than 100 documents, the "Total for" row appears once its last document is shown.
    
* The header chevron (Expand all / Collapse all) sits in the Date heading, before the word "Date". Hovering it or clicking it never lights Date's sort arrow. \[S4-R1, S4-R3\]
* Group rows are white (no grey band). Document lines are not indented.
* The pinned group row repeats the name and count (plus Phone and Credit term on A/R Collection), with no money. \[S4-R6\]
* Scrolling sideways (narrower than about 1440 px): a closed group's bold name and count stay visible at the left, on the row's own background, in light and dark mode. Phone and Credit term scroll under the name. \[S4-R7\]

### Loading, empty and errors

* While the report reads (including the first read of the Location list) the table shows its loading bar. It never flashes "No record matches these filters" first. Totals appear only once data has arrived. \[S8-R5\]
* No rows: "No record matches these filters" / "Try changing filters to widen your results." with "Clear all filters" (keeps As of). \[S8-R5\]
* Report fails: "Something went wrong loading this report. Please try again." in place of the rows. \[S8-R6\]
* A Detail bucket fails on its first lines: "Something went wrong loading this bucket. Collapse and expand it to try again." Later lines fail: the shown lines stay, ending with "Not every line loaded. Collapse and expand this bucket to try again." \[Story 4 Error Handling\]
* Exports: "Data exported successfully."; nothing to export: "Empty export" / "Export didn't yield any results"; PDF over 2,000 lines: "This report is too large for PDF. Export it as CSV, or narrow the filters, then try again." (exactly one message); any other failure: "We couldn't export this report. Please try again." \[S3-N1, S3-R10\]

### How to force a load error (Chrome)

DevTools → ⋮ → More tools → **Network request blocking**. Add a pattern, then do the action:

* whole report: `*/api/reporting/reports/ar-aging-detail?*` (or the report's own address), then reload;
* one Detail bucket: `*/buckets/*/rows*`, then expand a bucket;
* export: `*/export*`, then download.  
  Remove the pattern to recover.

## KNOWN MISMATCHES AND KNOWN GAPS (not bugs — do not file)

Each line names what you will see and what is correct today.

**Decided by Product (Chris, 2026-11-04 / 2026-11-05)**

* Bills not yet due show negative Past Due on A/P Detail and A/P Unpaid ("-10" for a bill due in 10 days). Only credits dated on the as-of date read 0.
* PDFs print negatives as "(-$11,111.00)"; the screen shows "$-11,111.00". Same as every other report PDF.
* Three date formats: screen "Nov 4, 2026", PDF "Nov 04 2026", CSV "2026-11-04".
* PRD wording is behind the build (Chris is editing it, expected PRD v11):

    * S8-R3 says Location wraps only on A/P Detail. It also wraps on A/P Unpaid (agreed).
    * S5-E3 does not mention "No locations". A user who chose "No locations" keeps it after changing As of (agreed).
    * S2-R7a mentions only narrowing the filter. The Location sort falls back whenever the Location column hides (agreed).
    * S1-R5a's first sentence reads as if every Current document shows 0. Only credits dated on the as-of date do (agreed).
    
* A/R Summary Totals add up exactly the rows shown. In production 16 overpaid invoices across 13 customer accounts were counted before; for those customers the Totals row will read differently after the release, although no row changes (PRD §2).
* A/R Collection and A/P Unpaid draw 100 documents at a time inside an open customer or vendor \[S1-R8\]. The browser's Find (Ctrl+F) only finds documents already drawn, and the scrollbar grows while you scroll.
* Long document numbers end in "…" at about 15–16 characters; the full number shows on hover and the link works.
* An empty Detail bucket is listed as "(0)" with a greyed chevron. The Detail PDF prints only buckets that hold a document.

**Kept by the developer**

* At 375 px, a closed group's Amount covers the end of a long name. No money value is ever cut.
* A location whose record has no organization set shows no name in the aging reports. The old reports showed it. This is stricter on purpose (same as the other Reporting reports).
* A/R Detail's columns shift about 34 px sideways when you click Expand all (the table sizes its columns to the content).
* At 1400 px (narrower than 1440) A/P Detail and A/P Unpaid are 2–4 px too wide: a tiny sideways scrollbar, Amount a few pixels under the pinned Open Balance. Open Balance stays visible. The PRD guarantees the fit at 1440 only.

**Follow-ups (known, ticket to be filed — do not file again)**

* **SR-2:** on a sideways scroll the group's chevron scrolls away; only the name and count stay. Scroll back to the left to use it, or use the header chevron.
* **"Today at the location" comes from the browser's time zone data.** For 00:00–01:00 Edmonton time (06:00–07:00 UTC), a browser with out-of-date data opens the reports on **yesterday**, and the date picker does not offer today in that hour. A picked date is always honoured. Follow-up ticket to be filed.
* **Sales Tax report, Sales Tax invoices and the Accounting list date filters** still use the old "end of day in the browser" helper, so in such a browser their range can end an hour late. Not changed here; same follow-up ticket.
* A failing Detail bucket (server error) also raises the app-wide red "Ooooops! An error occurred" toast next to the bucket message.

**Names and wording outside this change**

* Report titles differ from the PRD names and are unchanged: "A/R Aging Collection" (PRD "A/R Collection"); the page title "A/P Unpaid Invoices Report" (menu "A/P Unpaid Invoices", PRD "A/P Unpaid Invoices").
* The aging prompt's button reads "Switch location". The work order and part sale pages' own prompt (seen after a Ctrl-click into a new tab) still reads "Switch Location" (app-wide button style, not changed here).
* Dark mode: report links use the app-wide blue; contrast is a little under 4.5:1 on dark rows (app-wide colour).
* Seen while testing, not caused by this change: switching location (top right) while on another location's work order finance page shows a 400 "Invoice not found".
* Sales By Customer's Customer chip still reads "All customers" when every search result is ticked (Product: no ticket; Report Modernization).
* Jira SV-11539's acceptance criteria say "Credit term" for the CSV column; the PRD and the build say "Credit Term".

## What is NOT impacted

* \[ \] The Accounting module's own aging screens (`/accounting/reports/...`).
* \[ \] Other reports' data and exports. Shared pieces changed opt-in (filter chips, address filters, export runner, sortable headers); see SV-11597 for the regression list.
* \[ \] Customer card "Over limit", the schedule sidebar, the payments backfill: only comments and test oracles changed.
* \[ \] Work order, part sale, delivery and vendor return pages (only opened from the reports).
* \[ \] Permissions and roles (no change). Data: two new indexes only (`company`, `part_vendor`).

## Walkthrough videos

Attach these with the matching ticket. They were recorded on local data; on QA the names and amounts differ.

| Video | Tickets |
| --- | --- |
| `sv-11531-opening-order-v2.mp4` | SV-11531, SV-11441, SV-12140, SV-12138 |
| `sv-11532-sorting.mp4` | SV-11532, SV-12135, SV-12138 |
| `sv-11533-exports-v2.mp4` | SV-11533, SV-12141 |
| `sv-11534-grouped-reports-v2.mp4` | SV-11534, SV-12137, SV-11596, SV-11598 |
| `sv-11535-filters.mp4` | SV-11535 |
| `sv-11536-location-column.mp4` | SV-11536 |
| `sv-11537-links.mp4` | SV-11537, SV-12139 |
| `sv-11538-layout.mp4` | SV-11538, SV-12137 |
| `sv-11539-call-list.mp4` | SV-11539 |
| `sv-11599-legacy-retired.mp4` | SV-11599 |

Only `sv-11533-exports-v2.mp4` and `sv-11531-opening-order-v2.mp4` were recorded after the 2026-11-10 as-of / Past Due fix. In the others a not-yet-due bill can read one day less (for example "-9" where the build now shows "-10"). `sv-11532-sorting.mp4` also predates the fix that keeps the sorted column's arrow at full strength on hover. Everything else they show is current. Ignore `sv-11534-grouped-reports.mp4` (pre-fix).

## Dev verification (whole branch)

* \[x\] PR #4262 self-review: 3 rounds (2 full, 1 delta), approved at `8e35ee0d02` by Codex + Claude on every area; fixes SR-1–SR-4, SR-7–SR-10, SR-12–SR-14 (incl. a tenant hardening of the A/R credit/deposit balance replay, SR-14).
* \[x\] Before the PR: 5 phases plus fix rounds, each dual-reviewed (Codex + Claude) and approved: phase 1 (3 rounds), 2 (2), 3 (2), 4 (4), 5 (2), bucket errors (3), SV-12137 loading (2), design fixes (2), S4-R7 sticky name (1), sort caret (2), as-of day + calendar-day Past Due (2, asof-r2 approved by all six reviewers).
* \[x\] Final gates after the as-of fix (2026-11-10): FE eslint 0, vitest 1,393 pass, vue-tsc 0; BE cs-fix clean, PHPStan 0, aging unit 580 + functional 344 pass; e2e typecheck 0; smoke 0 × 500 (44 endpoints).
* \[x\] After the 2026-11-09 develop merge: BE unit suite 29,182 pass (11 known repo-root-only tests), full PHPStan 0, FE reporting vitest 1,389, aging E2E 11/11.
* \[x\] Browser walks (local, admin, 1440 px): p5walk 13/13, SV-12135/SV-12137 step check 16/16, design re-check, Expand all 0.63–0.77 s on the largest local groups; 0 console errors, 0 × 5xx.
* \[x\] As-of probe in a browser with out-of-date time zone data: sends `2026-11-02`, CSV "As of: Nov 2, 2026" on A/R and A/P.
* \[x\] Aging E2E after the fix: 7/7 after 07:00 UTC. Three specs failed only in the 06:00–07:00 UTC window, from the browser's "today" (the follow-up above).
* \[x\] Local-data note: a local test customer (TestVT1) has a credit memo and a deposit with the same id, which logs a duplicate-key warning in the browser console. Real ids are unique; QA data will not show it.
* \[ \] Staging (dev): `staging-gates.sql` EXPLAIN and parity gates. Parity gate (b) predates S1-R5a and still puts a credit dated on the as-of date in 1-30; the app puts it in Current.
* \[ \] E2E: updated @C27260–@C27264, @C26560, @C26564, @C29451 (C29451 needs a staging run, SSO only). Deleted specs: `ar-ap-report-gating` (@C26553–@C26559), `ar-aging-as-of-date` (@C26623–@C26626). 4 new workflows handed to QA automation (see SV-11599). The PR carries the E2E override line.



# SV-11441 — A/R and A/P aging: credit dated on the as-of day lands in 1-30 instead of Current
Status QA Complete · updated 2026-11-10T08:50 · created 2026-10-16

## Description
A credit memo, deposit or vendor credit dated exactly on the as-of date is aged into 1-30 rather than Current (A/R and A/P code). Fixing it changes bucket numbers, so first check how QuickBooks buckets the same credit in a sandbox company, then decide. Found in the SV-11315 research (more wins research 2026-10-15, item 8).

## Comment Bilal Muzamil 2026-10-29T02:26 (updated 2026-10-29T02:35)
<custom data-type="mention" data-id="id-0">@Chris Ward</custom>  Per discussion on Question #32

**What we saw** on staging build v26.43.2-f8698cb on 28 Oct 2026, on A/R Aging Collection:

* Staging Heavy Duty - 9919, date **30 Sep 2026**: credits **CM2-4462** and **CM2-4463** (E2E Credits Customer), both made on 30 Sep 2026, are listed with **Past Due 1**.
* Staging Lethbridge - 4310, date **28 Oct 2026**: credit **CM1-4535**, made on 28 Oct 2026, is listed with **Past Due 1**.

**The two written sources disagree:**

* The A/R aging PRD (Confluence 82083852, version 25) says: "If the calculated days are ≤ 0, the transaction is not past due and it's not shown on the report".
* SV-5606 (Done, Jan 2026) says: "Today's Credits are displayed with 1 as a Past Due".
* Today's screen matches SV-5606.

These figures were read on 28 Oct with the session set to each location's own time zone (America/Edmonton). 

## Comment Chris Ward 2026-10-29T17:59 (updated 2026-10-29T17:59)
<custom data-type="mention" data-id="id-0">@Bilal Muzamil</custom> thanks for digging into this. A credit made on the as-of day is 0 days old, so on the A/R and A/P aging reports it should sit in Current, the same as an invoice made that day. Before anyone builds it, please check how QuickBooks and AccountingHub age a credit dated today, and post what each shows here, so our reports line up with both. The Collections report stays as it is: SV-5606 shows today's credits there on purpose so collectors can see them next to the invoices they offset. Keeping this ticket for the aging change.

## Comment Bilal Muzamil 2026-10-29T21:18 (updated 2026-10-29T21:18)
<custom data-type="mention" data-id="id-0">@Chris Ward</custom> Thanks.  
Assigning it to <custom data-type="mention" data-id="id-1">@Mudassir Qamar</custom> for Digging it on QB.

## Comment Mudassir Qamar 2026-10-30T02:26 (updated 2026-10-30T02:26)
Chris Ward, results (30 Oct 2026):

**QuickBooks Online** (sandbox, QA US), as of 10/30/2026:

* Credit memo 1039 (−$100), unapplied payment (−$50) and vendor credit (−$75), all dated 10/30 → **Current** on A/R and A/P aging, summary and detail.
* QBO ages a credit from its own date: credits dated 10/29 (CM-4189, CM-4190, CM-4194) are already in **1–30** as of 10/30, and the 10/30 vendor credit moves to 1–30 as of 10/31.

**AccountingHub** (staging, Foothills Group Inc), as of 10/30/2026:

* A new credit memo dated 10/30 ($10, DashFresh Alpha MQ) → **Current**.
* AccountingHub doesn't age credits at all: no due date, no days overdue. All 90 open customer credits (oldest 04/28/2025) and all 1,306 open vendor credits (oldest 01/07/2025) sit in Current, on both summary and detail.

**Summary:** a credit dated on the as-of day is Current in both, so the SV-11441 change lines up with both. Older credits differ: QBO moves them to 1–30, 31–60 and so on by date, while AccountingHub keeps them in Current. Which should ShopView follow for those?

Screenshots attached.  

![](blob:https://media.staging.atl-paas.net/?type=file&localId=34141f7503e0&id=d260a5fa-5b28-4195-b2ea-22fca4d18f4a&&collection=&height=584&occurrenceKey=null&width=1019&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
![](blob:https://media.staging.atl-paas.net/?type=file&localId=a10799921a62&id=9e7bc1af-715b-4ddc-8c65-ff5491a718de&&collection=&height=834&occurrenceKey=null&width=1456&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
![](blob:https://media.staging.atl-paas.net/?type=file&localId=2b87e750b747&id=1f5ae12f-d1fd-4bf3-967e-f5e2a3230fa9&&collection=&height=834&occurrenceKey=null&width=1456&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
![](blob:https://media.staging.atl-paas.net/?type=file&localId=76f16315ccba&id=d01c0e8b-9e2a-426e-9b8a-58a54a520993&&collection=&height=584&occurrenceKey=null&width=1019&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
![](blob:https://media.staging.atl-paas.net/?type=file&localId=fe51a59d3c82&id=1494051b-5984-4241-987e-7948e0ff1252&&collection=&height=584&occurrenceKey=null&width=1019&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
![](blob:https://media.staging.atl-paas.net/?type=file&localId=83b16ded5d5b&id=b3b03b6b-fee1-4b51-8db8-65534f43a4f6&&collection=&height=584&occurrenceKey=null&width=1019&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)


## Comment Nemanja Djuric 2026-11-10T05:41 (updated 2026-11-10T05:53)
# QA Handoff — SV-11441 — a credit dated on the as-of date is Current with Past Due 0

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** `/reports/ar-aging-detail`, `/reports/ar-aging-collection`, `/reports/ar-aging-summary`, `/reports/ap-aging-detail`, `/reports/ap-aging-summary`, `/reports/ap-unpaid-invoices`
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Video:** `sv-11531-opening-order-v2.mp4`

---

## What changed

Product decided (Chris, 2026-11-04; PRD v10 S1-R5a): a credit memo, deposit or vendor credit dated exactly on the as-of date is **Current with Past Due 0**, as QuickBooks ages it. The old reports put it in "1-30 days past due" with Past Due 1. Older credits, invoices and bills follow the normal rule. All Past Due values are calendar days at the location.

## QA Checklist (do these)

### Setup

* \[ \] One customer with a credit memo and a deposit dated **today**, and a credit memo dated **yesterday**. One vendor with a vendor credit dated today and one dated yesterday. Leave As of on today.

### Today's credits \[S1-R5a\]

* \[ \] A/R Detail: today's credit memo and deposit are in "Current" (Transaction Type "Credit Memo" / "Deposit"); yesterday's credit memo is in "1-30 days past due". (A/R Detail has no Past Due column.)
* \[ \] A/R Collection: today's credits show their own date as Due Date and **Past Due 0**; yesterday's shows Past Due 1.
* \[ \] A/P Detail: today's vendor credit is in "Current" with **Past Due 0**; yesterday's is in "1-30 days past due" with Past Due 1.
* \[ \] A/P Unpaid: vendor credits show "—" for Due Date and Past Due (they have none) \[S2-R6\].
* \[ \] A/R Summary / A/P Summary: today's credits count in **Current**, not in 1-30 Days; the row's Total is the same either way.

### An earlier As of

- [ ] Pick the date of an older credit as As of → the credit dated exactly on that day is Current, Past Due 0; one dated the day before is 1-30, Past Due 1.

### Summary = Detail \[S5-R18a\]

- [ ] Past due Any, same As of, customer / vendor and locations: A/R Summary Totals = A/R Detail Open Balance Totals bucket by bucket, Current included. A/P Summary = A/P Detail likewise.

### Filters and exports

- [ ] Tick a Past due range (e.g. 31-60): every credit is still listed \[S5-R16\]; today's credit sits in "Current" on the Detail reports.
- [ ] Detail CSV: the credit's "Aging Bucket" reads "Current". A/R Collection and A/P Detail PDF / CSV: its Past Due is 0.

### Invoices and bills — the normal rule (regression)

- [ ] A bill due today: Current, Past Due 0. Due yesterday: 1-30, Past Due 1. Due in 10 days: Current, Past Due "-10".
- [ ] The count is in calendar days at the location: a document due late in the evening counts on that evening's date.

## Known mismatches (not bugs)

* Bills not yet due keep a **negative** Past Due on A/P Detail and A/P Unpaid ("-10" for a bill due in 10 days). Only credits dated on the as-of date read 0. Product decided this (Chris, 2026-11-05); PRD S1-R5a's first sentence will be narrowed.
* A credit's own date is its due date on A/R Collection and A/P Detail; on A/P Unpaid it has none ("—").

## What is NOT impacted

- [ ] Credits dated before the as-of date: aged by their own date, as before.
- [ ] Work order, part sale, delivery and vendor return pages.

## Dev verification

* \[x\] Tests: `AgingBucketTest::testSv11441ACreditDatedOnTheAsOfDateIsCurrent`, `AgingSqlTest::testSv11441ACreditDatedOnTheAsOfDateIsCurrentInTheSql`, `AgingSqlTest::testTheSqlBucketsMatchTheDomainAtEveryBoundary`, `DbalArAgingDetailTest::testACreditDatedOnTheAsOfDateIsCurrentWithPastDueZero`, `DbalApAgingDetailTest::testAVendorCreditDatedOnTheAsOfDateIsCurrentWithPastDueZero`, `AgingSummaryDetailParityTest`. MySQL 8.0.42 proof (`api/tools/sql/aging-name-order-check.sql`) = its expected file.
* \[x\] Review rounds: phase5-r1/r2 and asof-r1/r2 (calendar days), all approved.
* \[x\] Walks: p5walk 13/13.
* \[ \] SV-11441 closes with this release (Product answer 1).

![](blob:https://media.staging.atl-paas.net/?type=file&localId=465f80204ef7&id=57313506-9ffe-4856-937a-24c78ca86a75&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)


## Comment Bilal Muzamil 2026-11-10T06:54 (updated 2026-11-10T06:54)
**OVERALL QA STATUS: PASSED**

Tested on [sv11315.qa.shopview.com](https://sv11315.qa.shopview.com) (build v26.45.2-6a8b89c) on 10 Nov 2026, as Admin, desktop Chrome 1600 × 900, against the QA handoff above. Compared with production (app.shopview.com, build v26.45.3-fc08f23).

A credit memo, deposit or vendor credit dated on the As of day is now in Current with Past Due 0 on all six aging reports, as the PRD says (S1-R5a, Confluence version 11): _"one dated exactly on the as-of date is in Current with Past Due 0, not in "1-30 days past due"."_ On production a credit made today still shows Past Due 1. Older credits, invoices and bills follow the normal rule.

### Before and after

![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=310744b4-033f-46de-9d13-28803a6a7d28&&collection=&height=null&occurrenceKey=null&width=null&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)Before (production): credit memo CM2-4410, made today, shows Past Due 1. After (sv11315): credit memo CM11315-4190, made today, shows Past Due 0; CM11315-4191, dated yesterday, shows Past Due 1.
![](blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=90d2e25a-7f1d-4c14-821e-1b516daf788d&&collection=&height=null&occurrenceKey=null&width=null&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)sv11315: on A/R Aging Detail today's credit memo and today's unused deposit are in Current (with Past due 31-60 ticked); on A/P Aging Detail today's vendor credits are in Current with Past Due 0. On production a vendor credit made today (C-18194) is in 1-30 days past due with Past Due 1.
### What I checked

| # | Check | Status |
| --- | --- | --- |
| 1 | Set-up: credit memos CM11315-4190 (today, $12.34) and CM11315-4191 (yesterday, $4.56) for Andrews' Truck & Trailer Repair LLC, made with Issue Credit; deposit DEP11315-4705 ($825.96, today), the unused part of a deposit on an invoiced work order; vendor credits C-13665 and C-13666 (today) for Abadi's Diesel Repair. As of left on today. | DONE |
| 2 | A/R Detail: today's credit memo and deposit are in "Current" ("Credit Memo" / "Deposit"); yesterday's credit memo is in "1-30 days past due" | PASSED |
| 3 | A/R Collection: today's credit memo and deposit show their own date as Due Date and Past Due 0; yesterday's shows Past Due 1 (picture 1) | PASSED |
| 4 | A/P Detail: today's vendor credits are in "Current" with Past Due 0 (picture 2). New Credit on the vendor page has no date, so the day-before case was checked with an older vendor credit: C-13662 (31 Aug) is Current, Past Due 0 as of 08/31 and 1-30, Past Due 1 as of 09/01 | PASSED |
| 5 | A/P Unpaid: both vendor credits show "—" for Due Date and Past Due | PASSED |
| 6 | A/R Summary and A/P Summary: today's credits count in Current (Andrews Current $-12.34, 1-30 Days $-4.56; Abadi Current $-11.10) | PASSED |
| 7 | Earlier As of: CM11315-3841 (Doi Truck Center, 23 Jul) is Current, Past Due 0 as of 07/23 and 1-30, Past Due 1 as of 07/24 | PASSED |
| 8 | Summary = Detail, Past due Any, As of today: A/R and A/P Summary Totals equal the Detail Open Balance Totals in all five buckets, Current included | PASSED |
| 9 | Past due 31-60 ticked: every credit is still listed and today's credits stay in "Current" on A/R Detail (picture 2) | PASSED |
| 10 | Downloads: A/R Detail CSV "Aging Bucket" reads "Current" for today's credits; A/R Collection CSV and PDF and A/P Detail CSV and PDF show Past Due 0 for them | PASSED |
| 11 | Bills: 5956 (Abadi) due 5 May is Current, Past Due 0 as of 05/05 and 1-30, Past Due 1 as of 05/06; IN00267805 (Alameda Mechanical Services) due 14 Mar 2025 is Current, Past Due -10 as of 03/04/2025 | PASSED |
| 12 | Calendar days at the location: on A/R Collection (145 rows) and A/P Unpaid (423 rows with a due date), every Past Due equals the As of day minus the due date's local date, including 33 bills due in the evening | PASSED |
| 13 | Opening a work order from A/R Collection (S2-16654) still opens its Finance page | PASSED |

QuickBooks will be checked next and posted in a separate comment.

### How to see it

1. Open [Reports > A/R Aging Collection](https://sv11315.qa.shopview.com/reports/ar-aging-collection) (As of stays on today).
2. Click the small arrow at the left of **Andrews' Truck & Trailer Repair LLC (3)**.
3. The row **CM11315-4190** (Nov 10, 2026) shows **0** under Past Due; **CM11315-4191** (Nov 9, 2026) shows **1**.



## Comment Bilal Muzamil 2026-11-10T08:49 (updated 2026-11-10T08:50)
## QuickBooks verification

**PASSED** — credit aging buckets match the expected behavior. Checked QuickBooks Online sandbox, QA 1 US, on <custom data-type="date" data-id="id-0">11/10/2026</custom>, using existing records only.

### A/R credit memos

Six credit memos dated <custom data-type="date" data-id="id-1">10/30/2026</custom> (CM-4189, CM-4191, CM-4192, CM-4193, CM-4194 and CM-4203) are Current as of that day and move to 1–30 the next day. Their Due Date is their own credit date. **PASSED**.

[QB A/R Aging Detail](https://sandbox.qbo.intuit.com/app/report/builder?rptId=sbg%3A73f15f2c-2671-4831-9f24-1faef280cfa2&type=system&token=AR_AGING_DET&previousRoute=standardreports&previousRouteText=Back+to+standard+reports&payloadId=ce4f759a-a120-4bda-8675-71e10b4d743b) — as of <custom data-type="date" data-id="id-2">10/30/2026</custom>: Current.

![](blob:https://media.staging.atl-paas.net/?type=file&localId=48b9fe392385&id=ac222d5c-0d38-4710-9cea-7b34594c5900&&collection=&height=899&occurrenceKey=null&width=1180&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
[QB A/R Aging Detail](https://sandbox.qbo.intuit.com/app/report/builder?rptId=sbg%3A73f15f2c-2671-4831-9f24-1faef280cfa2&type=system&token=AR_AGING_DET&previousRoute=standardreports&previousRouteText=Back+to+standard+reports&payloadId=ce4f759a-a120-4bda-8675-71e10b4d743b) — as of <custom data-type="date" data-id="id-3">10/31/2026</custom>: 1–30.

![](blob:https://media.staging.atl-paas.net/?type=file&localId=37876f3799c2&id=bcda877e-ef48-4dc4-821f-5c4af96cfffb&&collection=&height=899&occurrenceKey=null&width=1180&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
### A/P vendor credits

Vendor credits dated <custom data-type="date" data-id="id-4">11/9/2026</custom>, including D1109-A2R-C-12206, are Current as of that day and move to 1–30 the next day. **PASSED**.

[QB A/P Aging Detail](https://sandbox.qbo.intuit.com/app/report/builder?rptId=sbg%3A7577fb3e-5a98-4dd1-a94e-a0039ce978af&type=system&token=AP_AGING_DET&previousRoute=standardreports&previousRouteText=Back+to+standard+reports&payloadId=9bcfbd15-556b-4a91-abed-0f92d809351b) — as of <custom data-type="date" data-id="id-5">11/9/2026</custom>: Current.

![](blob:https://media.staging.atl-paas.net/?type=file&localId=c98c24c4c015&id=86ae3567-4e6a-4368-825f-43a59c26d7b4&&collection=&height=899&occurrenceKey=null&width=1180&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
[QB A/P Aging Detail](https://sandbox.qbo.intuit.com/app/report/builder?rptId=sbg%3A7577fb3e-5a98-4dd1-a94e-a0039ce978af&type=system&token=AP_AGING_DET&previousRoute=standardreports&previousRouteText=Back+to+standard+reports&payloadId=9bcfbd15-556b-4a91-abed-0f92d809351b) — as of <custom data-type="date" data-id="id-6">11/10/2026</custom>: 1–30.

![](blob:https://media.staging.atl-paas.net/?type=file&localId=20c025690320&id=885c0623-d231-4746-9b60-b51cfafb25e9&&collection=&height=899&occurrenceKey=null&width=1180&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
QB A/P Detail leaves vendor-credit Due Date and Past Due blank. ShopView’s PRD explicitly requires the credit’s date and 0 on A/P Detail, so this comparison confirms bucket aging, not identical field display. These are independent QB fixtures, not a same-record sync check. Report links may reopen with different filters; the annotated screenshots record the tested dates.

The rest of the QA results are in the [previous results comment](https://shopview.atlassian.net/browse/SV-11441?focusedCommentId=80649).

# SV-11595 — A/R & A/P aging — verify Phase 2: A/R Summary and A/P Summary
Status Done · updated 2026-11-10T06:16 · created 2026-10-21

## Description
Verifies Phase 2 of the tech plan for SV-11315 (PRD: [A/R and A/P Report Sorting, Export and Location Filter](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/947650561/A+R+and+A+P+Report+Sorting+Export+and+Location+Filter)).

**Covers:** S1-R1–R4, S1-R7, S1-R8, S1-N1, S1-E1, S2 (Summaries), S3 (Summary exports), S4-N2, S5-R1–R10, S5-R10a, S5-R12–R15, S5-R17–R19, S5-N1–N3, S5-E1, S5-E2, S6, S7 Summary-name links, S8; NFR-001, NFR-004, NFR-006, NFR-007.

**Check (as admin, at 1440 px, light and dark):**

* Both Summaries open A→Z, and the name column is marked sorted. Every header sorts: the first click on a money column is largest first, the second reverses, the third repeats the first.
* Scrolling page after page never repeats or skips a customer or vendor.
* Filter row order: As of, Customer/Vendor, Past due, Location. The Location menu lists every location with open documents, even for a user enrolled at one location. Choosing locations narrows rows and Totals. The Location column and "Multiple" follow the PRD. "No locations" shows the empty state and exports nothing.
* Past due: ticking 31-60 lists only accounts with an amount in that range, at their full balance. The chip reads "Past due: Any", one range, or "N ranges".
* Export: PDF and CSV match the screen's order and filters, and carry the As of / Locations / Past due / Customer(s) lines. PDF over 2,000 rows and CSV over 50,000 are refused with exactly one message. Empty → "Empty export".
* The customer name links only for users with Customers → View (check with a custom role); the vendor name links for everyone. Clicking a row no longer opens anything.
* Before merge: the staging-copy checks (query plan for the largest A/P shops; old vs new results for the 20 largest shops) and the G-DATA data check are recorded on the PR.

All verification tickets Done → the feature is ready for QA.

## Comment Nemanja Djuric 2026-11-10T05:42 (updated 2026-11-10T06:08)
# QA Handoff — SV-11595 Task — verify Phase 2: A/R Aging Summary and A/P Aging Summary

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** `/reports/ar-aging-summary`, `/reports/ap-aging-summary`
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Videos:** the Summary parts of `sv-11531-opening-order-v2.mp4`, `sv-11532-sorting.mp4`, `sv-11533-exports-v2.mp4`, `sv-11535-filters.mp4`

---

## QA Checklist (do these)

### Run the Summary parts of the story files

- [ ] SV-11531 (name order, 30 at a time), SV-11532 (headers), SV-11533 (exports), SV-11535 (filters), SV-11536 (Location column, "Multiple"), SV-11537 (name links), SV-11538 (layout), SV-12140, SV-12141, SV-12136 (A/P Summary totals).

### Summary-specific checks

- [ ] Headings: Customer / Vendor, Location (when shown), Current, 1-30 Days, 31-60 Days, 61-90 Days, 91 And Over, Total. "Total" pinned right and bold.
- [ ] A bucket that nets to exactly $0.00 shows blank; Total and the Totals row always show an amount, including $0.00 (Product answer 8).
- [ ] A/R: a credit memo or deposit dated on the as-of date counts in Current (SV-11441).
- [ ] Customer name (with Customers → View) → A/R Collection with the same As of, Past due and locations; vendor name → A/P Unpaid likewise.
- [ ] Past due Any: Summary Totals = the matching Detail report's Open Balance Totals, bucket by bucket \[S5-R18a\].
- [ ] At 1440 px and 1280 px, light and dark.

## Known mismatches (not bugs)

* A/R Summary Totals add up exactly the rows. Production's 16 overpaid invoices (13 customer accounts) were counted before, so those Totals read differently after the release (PRD §2).
* Other items: the shared notes (https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616).

## What is NOT impacted

- [ ] Other reports.

## Dev verification

* \[x\] Tests: `AgingSummaryEndpointTest`, `AgingSummaryQueryHandlerTest`, `AgingSummaryExportQueryHandlerTest`, `AgingSummaryExportTableBuilderTest`, `DbalArAgingQueryRepositoryTest`, `DbalApAgingQueryRepositoryTest`, `ArAgingAsOfReplayTest`, `AgingReportAuthorizationTest` (every route), `AgingTenantBoundaryTest`, `AgingSummaryReport.spec.ts`, `ApAgingSummaryReport.spec.ts`.
* \[x\] Review rounds: phase2-r1/r2, then phase 5 and the later fix rounds, approved.
* \[ \] Staging-clone gates (dev): `staging-gates.sql` EXPLAIN for the 5 largest A/P organizations (≤ 1.5 s) and parity on the 20 largest (today and last month-end). Parity gate (b) predates S1-R5a: a credit dated on the as-of date is expected in Current in the app.  

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=8f80fd171627&id=cb1b41d5-ad2a-4ffe-ab4d-0890cafac32f&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=239087c876e5&id=7ac40467-0ef2-4639-8af9-6f9b9923aa0b&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=c8eb5b64e221&id=711b722d-c7d0-4f72-be45-570517408c0e&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=a75df19c075e&id=c909ca5c-916a-4089-ab0b-9f8ccc87f494&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)



# SV-11596 — A/R & A/P aging — verify Phase 3: A/R Collection and A/P Unpaid Invoices
Status Done · updated 2026-11-10T06:16 · created 2026-10-21

## Description
Verifies Phase 3 of the tech plan for SV-11315 (PRD: [A/R and A/P Report Sorting, Export and Location Filter](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/947650561/A+R+and+A+P+Report+Sorting+Export+and+Location+Filter)).

**Covers:** S1-R6–R8, S2 (incl. S2-N1, S2-R5, S2-R6, S2-R9), S3 incl. S3-R8a, S4-R1–R3, S4-R5–R9, S4-N1, S5 incl. S5-R11 and S5-R16, S6, S7, S8, S9.

**Check:**

* Groups stay in name order while header clicks re-sort rows inside them. Re-sorting never collapses a group. Changing a filter collapses everything. Collapse all / Expand all sits in the top-left header cell, with its tooltip above.
* Expand all, then scroll: later groups also arrive expanded. The pinned group row pushes up as the next group arrives. The label stays visible when scrolling sideways.
* The Totals row follows the customer/vendor filter (today's bug is fixed).
* Links: an invoice at your current location opens its finance page. An invoice at another enrolled location asks to switch: Cancel leaves the address, filters, sort, expanded groups and scroll untouched; "Switch location" opens it. Non-enrolled or not-permitted → plain text. A bill at another location → plain text. A vendor credit from a return → links to the return. Opening in a new tab works.
* Call list: phone shown when present; credit term ("COD" when unset) only for users with 'View and Manage AP/AR Data', on screen, in the PDF and as a CSV column. Use a custom role to see it hidden.
* The Summary drill-down now carries the as-of date, Past due and locations.

All verification tickets Done → the feature is ready for QA.

## Comment Nemanja Djuric 2026-11-10T05:42 (updated 2026-11-10T06:09)
# QA Handoff — SV-11596 Task — verify Phase 3: A/R Aging Collection and A/P Unpaid Invoices

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** `/reports/ar-aging-collection`, `/reports/ap-unpaid-invoices`
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Videos:** `sv-11534-grouped-reports-v2.mp4`, `sv-11539-call-list.mp4`, `sv-11537-links.mp4`

---

## QA Checklist (do these)

### Run the Collection / Unpaid parts of the story files

- [ ] SV-11531 (groups in name order, documents oldest first, 30 groups then 30 more, 100 documents per open group), SV-11532, SV-11533, SV-11534, SV-11535 (drill-down from the Summaries), SV-11536, SV-11537 (prompt and Cancel), SV-11538, SV-11539 (call list), SV-12138, SV-12139.

### Collection / Unpaid-specific checks

- [ ] Group rows: closed → bold name and count, bold "Total", bold Amount and Open Balance; open → "Total for <customer or vendor>" row after the last document.
- [ ] A/R Collection lists only overdue invoices (Past Due 1+ in calendar days) plus every unused credit memo and deposit.
- [ ] A/P Unpaid lists every unpaid bill; bills not yet due show negative Past Due; vendor credits show "—" for Due Date and Past Due and stay at the bottom of their group.
- [ ] Totals follow the Customer / Vendor filter (today's old reports ignore it).
- [ ] Custom role with Reports → Page Access but without View and Manage AP/AR Data: no Credit term anywhere.
- [ ] A/P Unpaid on the QA organization (largest A/P): page load time; Expand all smooth; PDF refused over 2,000 documents with one message; CSV works.

## Known mismatches (not bugs)

* Inside an open group over 100 documents, Find only finds documents already drawn (PRD S1-R8). Other items: the shared notes (https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616).

## What is NOT impacted

- [ ] Other reports.

## Dev verification

* \[x\] Tests: `AgingGroupedEndpointTest`, `AgingGroupedQueryHandlerTest`, `AgingGroupedExportQueryHandlerTest`, `AgingGroupedSqlTest`, `DbalArAgingCollectionTest`, `DbalApUnpaidInvoicesTest`, `AgingCollectionReport.spec.ts`, `ApUnpaidInvoicesReport.spec.ts`, `useAgingGroupRowWindows.spec.ts`.
* \[x\] Review rounds: phase3-r1/r2, phase4 r1–r4 (the 1440 fit, pinned row and 100-document fixes), design-r1/r2, s4r7-r1, approved.
* \[x\] Perf (local): A/P Unpaid Expand all 0.77 s on a vendor with 2,252 bills (was 5.4 s).
* \[ \] Staging (dev): A/P Unpaid page 1 size on the largest organizations (`staging-gates.sql` §5; 1.5 MB locally).  

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=98f38644574f&id=5e88ab92-4a68-4a81-98da-d4934f53a7cb&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=8326f542620f&id=1f991c99-3eea-4b21-b00a-a1f436ed941f&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=e6ff0ec55ddf&id=5cc08a26-92b1-4214-98d7-d74abc9b1aec&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)



# SV-11597 — A/R & A/P aging — verify Phase 1: shared report kit
Status Done · updated 2026-11-10T06:16 · created 2026-10-21

## Description
Verifies Phase 1 of the tech plan for SV-11315 (PRD: [A/R and A/P Report Sorting, Export and Location Filter](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/947650561/A+R+and+A+P+Report+Sorting+Export+and+Location+Filter)). Phase 1 changes shared pieces the other reports also use; there is no visible change to the aging reports yet.

**Covers:** S2-R4, S2-R6, S3-N1, S3-N2, S3-N3, S5-R10, S5-R15, S7-R5, S7-R7 (enabling pieces); NFR-002, NFR-003, NFR-004, NFR-005, NFR-008.

**Check:**

* Inventory Value, Sales By Customer and Work In Progress: filters, links shared from the address bar, and CSV/PDF exports behave exactly as before.
* A work order opened from a link at another location still asks to switch, and Cancel still returns to Work Orders with its message.
* The name-order check run against MySQL is attached to the PR and matches every PRD example (10 Trucking before 2 Trucking; Émile's with the E names; Øster before Ozone).
* The two new name indexes exist, and the schema check reports no differences.

All verification tickets Done → the feature is ready for QA.

## Comment Nemanja Djuric 2026-11-10T05:42 (updated 2026-11-10T05:42)
# QA Handoff — SV-11597 Task — verify Phase 1: shared report kit (regression on other reports)

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** other reports that share the pieces: Inventory Value, Sales By Customer, Work In Progress, Parts Velocity, Technician Utilization, Sales By Representative; work order and part sale deep links
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Video:** none (no visible change on these screens)

---

## What changed

The six aging reports are built on shared pieces: filter chips, filters in the page address, the export runner, sortable headers, the pinned group row, document links and the "Switch location?" prompt. The changes to the shared pieces are **opt-in**, so every other report should behave exactly as before. Two database indexes were added (`company`, `part_vendor`).

## QA Checklist (do these)

### Other reports still behave as before

- [ ] Inventory Value: every chip opens and closes; pick a vendor and a location, reload → the address and chips restore; Download (CSV) and Download (PDF) → "Data exported successfully."
- [ ] Sales By Customer: Date, Product Type, Customer (search two customers, tick both), Location chips; reload restores; export CSV and PDF.
- [ ] Work In Progress: As of, Advisor, Customer, Asset, Location chips; reload restores; export.
- [ ] Parts Velocity, Technician Utilization, Sales By Representative: open, change one filter, export once.
- [ ] Sort arrows on Technician Utilization, Sales By Customer and Sales By Representative: the sorted column's arrow stays at full strength when you hover or focus it; other headers show a faint hint on hover. Also in Safari or an older Firefox if available.
- [ ] Work In Progress info icon: opens on hover, closes on Escape.

### Work order and part sale links

* \[ \] Open a work order link for another enrolled location (`/workorders/<id>?locationId=<other>`): the "Switch location?" prompt shows; **Cancel** still returns to Work Orders with its message; switching opens it.
* \[ \] Same for a part sale link.
* \[ \] Dashboard tiles that deep-link with `?locationId` still open the right list.

## Known mismatches (not bugs)

* The work order / part sale pages' own prompt button reads "Switch Location" (app-wide button style; unchanged here). The aging prompt reads "Switch location" (SV-12139).
* Sales By Customer's Customer chip reads "All customers" when every search result is ticked (Product: no ticket; Report Modernization).

## What is NOT impacted

- [ ] Work orders, invoicing, payments, inventory, vendor orders (no code touched).
- [ ] Permissions and roles.

## Dev verification

* \[x\] Tests: `FilterChip.spec.ts`, `FilterOptionListPanel.spec.ts`, `FilterSearchListPanel.spec.ts`, `useFilterUrlSync.spec.ts`, `useReportFilters.spec.ts`, `useReportGroupExpansion.spec.ts`, `useWorkOrderLocationResolver.spec.ts`, `ReportSortableHeaderRow.spec.ts`, `ReportInfoIcon.spec.ts`, `axios-silent-fail.spec.ts`, `ReportPaginatorOrderByTest` (existing reports' SQL unchanged), `ExportRowCapGuardTest` (default cap 10,000 unchanged).
* \[x\] Migration `Version20261103153115`: two online indexes, rollback-safe; no data change.
* \[x\] Review rounds: phase1-r1–r3, caret-r1/r2 (the shared arrow hint; Codex and Claude flagged the Safari 14 / Firefox 78 case, fixed in f6f64ba507), approved. Caret checked in Chromium, Firefox and WebKit.
* \[x\] Walks: Inventory Value / Sales By Customer / Work In Progress chips + reload + Inventory Value CSV; 0 console errors, 0 × 5xx.



# SV-11598 — A/R & A/P aging — verify Phase 4: A/R Detail and A/P Detail
Status Done · updated 2026-11-10T06:16 · created 2026-10-21

## Description
Verifies Phase 4 of the tech plan for SV-11315 (PRD: [A/R and A/P Report Sorting, Export and Location Filter](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/947650561/A+R+and+A+P+Report+Sorting+Export+and+Location+Filter)).

**Covers:** S1-R5, S1-R7, S1-R8, S2 (Detail), S3 (Detail exports), S4 incl. S4-R4, S5, S6, S7, S8 (Detail).

**Check:**

* Buckets always read 91+, 61-90, 31-60, 1-30, Current, whatever the sort. Rows inside open by name, then number-aware document number (S1-99 before S1-100).
* Expanding a bucket shows 100 lines, then more on scroll, on both reports (new on A/R Detail).
* On the QA organization (13,540 open A/P lines): first paint is quick, an A/P Detail PDF is refused with one message, and the CSV downloads.
* At 1440 px every column is visible; Location wraps only on A/P Detail.

All verification tickets Done → the feature is ready for QA.

## Comment Nemanja Djuric 2026-11-10T05:42 (updated 2026-11-10T06:09)
# QA Handoff — SV-11598 Task — verify Phase 4: A/R Aging Detail and A/P Aging Detail

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** `/reports/ar-aging-detail`, `/reports/ap-aging-detail`
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Video:** `sv-11534-grouped-reports-v2.mp4`

---

## QA Checklist (do these)

### Run the Detail parts of the story files

- [ ] SV-11531 (buckets in fixed order, name order inside, 100 lines then more), SV-11532, SV-11533 (CSV "Aging Bucket", PDF by bucket), SV-11534 (Expand all, pinned bucket row, bucket errors), SV-11535, SV-11536, SV-11537, SV-11538, SV-11441, SV-12136, SV-12138, SV-12140, SV-12141.

### Detail-specific checks

- [ ] Buckets: "91 or more days past due", "61-90 days past due", "31-60 days past due", "1-30 days past due", "Current", each with "(N)". Closed: bold "Total" and bold Amount / Open Balance. Open: "Total for <bucket>" row after its last line.
- [ ] A bucket's lines and its count agree: scroll to the end and count unique numbers = "(N)".
- [ ] A/R Detail headings: Date, Location, Transaction Type, ID, Customer Full Name, Due Date, Amount, Open Balance (no Past Due). A/P Detail: Date, Location, Transaction Type, No., Vendor Name, Due Date, Past Due, Amount, Open Balance.
- [ ] A/P Detail vendor credit: Due Date = its own date; Past Due counted from it (0 when dated on the as-of date).
- [ ] A/P Detail on the QA organization (about 13,500 lines): Expand all, scroll deep into "91 or more days past due"; PDF refused with one message; CSV downloads.
- [ ] A role without the document permissions: numbers are plain text.

## Known mismatches (not bugs)

* Empty bucket listed as "(0)" with a greyed chevron; the PDF prints only buckets that hold a document.
* A/R Detail's columns shift about 34 px on Expand all; a failing bucket also raises the "Ooooops! An error occurred" toast. Other items: the shared notes (https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616).

## What is NOT impacted

- [ ] A/R Summary and A/P Summary behaviour.

## Dev verification

* \[x\] Tests: `AgingDetailEndpointTest`, `AgingDetailGroupsQueryHandlerTest`, `AgingDetailBucketRowsQueryHandlerTest`, `AgingDetailExportQueryHandlerTest`, `AgingDetailSqlTest`, `DbalArAgingDetailTest`, `DbalApAgingDetailTest`, `AgingSummaryDetailParityTest`, `AgingDetailReport.spec.ts`, `ApAgingDetailReport.spec.ts`, `useAgingBucketPages.spec.ts`.
* \[x\] Review rounds: phase4-r1–r4, bucketfix-r1–r3, design-r1/r2, approved.
* \[x\] Perf (local, 1440 px): A/R Detail Expand all 0.61 s, A/P Detail 0.62 s, no long scroll pauses.
* \[x\] E2E: @C27261 (A/R Detail finance link) and @C27264 (A/P Detail delivery link) updated and passing locally.
* \[ \] Staging (dev): A/P Detail deepest bucket pages on the largest organizations (`staging-gates.sql` §5).  

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=6260a5d5340f&id=f1412b36-d693-4004-a5ad-90a5fb33434e&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)



# SV-11599 — A/R & A/P aging — verify Phase 5: legacy aging code retired
Status Done · updated 2026-11-10T06:17 · created 2026-10-21

## Description
Verifies Phase 5 of the tech plan for SV-11315 (PRD: [A/R and A/P Report Sorting, Export and Location Filter](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/947650561/A+R+and+A+P+Report+Sorting+Export+and+Location+Filter)).

**Covers:** retiring the old aging endpoints and their print path (A/R Print replaced by the Export menu), orphan filter components and the legacy Cypress aging specs.

**Check:**

* The E2E helpers and specs that used the old aging endpoints were moved before this merged (`/e2e-after-change`), and the nightly E2E run is green.
* The old aging routes no longer exist; the endpoint smoke test has no 500s.
* All six reports work end to end once more as admin.

All verification tickets Done → the feature is ready for QA.

## Comment Nemanja Djuric 2026-11-10T05:47 (updated 2026-11-10T06:11)
# QA Handoff — SV-11599 Task — verify Phase 5: the old aging code is retired

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** all six aging reports; the old aging API addresses
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Video:** `sv-11599-legacy-retired.mp4`

---

## What changed

The seven old A/R and A/P aging API addresses, the old A/R Print PDF and their tests are deleted. No screen has used them since the rebuild; the six reports read only `/api/reporting/reports/…`. Removed in this release with no month-end wait (Milan, 2026-11-04).

## QA Checklist (do these)

### Old addresses are gone

* \[ \] Signed in as admin, each answers **404** (open it in the browser, or `fetch` it from the DevTools console):
* \[ \] ↳ `/api/reporting/account-receivable/aging-summary-report`
* \[ \] ↳ `/api/reporting/account-receivable/aging-detail-report`
* \[ \] ↳ `/api/reporting/account-receivable/collections-report`
* \[ \] ↳ `/api/reporting/account-receivable/pdf`
* \[ \] ↳ `/api/reporting/account-payable/aging-summary-report`
* \[ \] ↳ `/api/reporting/account-payable/aging-detail-report`
* \[ \] ↳ `/api/reporting/account-payable/unpaid-invoices-report`
* \[ \] No aging report has a Print button; ⋯ (Export report) is the only way to a PDF or CSV.

### The six reports still work

* \[ \] Each report: open it from Reports, scroll until more load, sort two columns, Expand all (grouped reports), open one document link, Download (PDF) and Download (CSV). No error message, nothing blank.
* \[ \] A user with only Reports → Page Access opens all six; a user without it (e.g. the Time Clock role) is refused.
* \[ \] The as-of request carries the day itself (`asOfDate=YYYY-MM-DD`). Sending a full time instead (e.g. `asOfDate=2026-11-02T06:59:59Z`) answers 400.

### Nightly E2E

* \[ \] Green on the updated specs: @C27260–@C27264 (aging name and document links), @C26560 and @C26564 (`fe-permissions-shape`), @C29451 (`time-clock-role-authorization`; needs a staging run, SSO only).
* \[ \] The deleted specs no longer run: `ar-ap-report-gating` (@C26553–@C26559) and `ar-aging-as-of-date` (@C26623–@C26626). Backend tests cover those checks.
* \[ \] QA automation:
* \[ \] ↳ mark the 11 deleted cases Deprecated in TestRail;
* \[ \] ↳ retitle C26560 — it now proves only that a Reports user can open both Summaries;
* \[ \] ↳ pick up the 4 handed-over workflows: A/R Detail invoice at another location → "Switch location?" → finance page; A/R Summary with filters → A/R Collection keeps them → Back; A/R Detail CSV + PDF export; A/P Summary vendor → A/P Unpaid with the scope kept.

## Known mismatches (not bugs)

* See the shared notes (https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616) (Product decisions, kept items, follow-ups).

## What is NOT impacted

* \[ \] Other reports.
* \[ \] Customer card "Over limit", the schedule sidebar, the payments backfill: only comments and test oracles changed.
* \[ \] The Accounting module's own aging screens (`/accounting/reports/...`).

## Dev verification

* \[x\] `debug:router` lists no old aging route; every deleted PHP class has 0 references left; full PHPStan 0.
* \[x\] Three tests that used the old code as their reference now check the new report against values captured from it before deletion (`DbalCustomerAmountOwedReaderTest`, `ArAgingAsOfReplayTest`, `AgingTodayAgedAtEndOfDayTest`).
* \[x\] Smoke: 0 × 500 (44 endpoints; the curated list probes the new Summaries).
* \[x\] Review rounds: phase5-r1/r2 approved (scope items accepted by the developer).
* \[x\] E2E: the 5 aging link specs 11/11 locally; `fe-permissions-shape` C26560 / C26564 pass; C29451's probe checked by hand (no-Reports user 403, admin 200, old route 404). The PR carries the E2E override line for the 4 handed-over workflows.
* \[ \] Staging (dev): `staging-gates.sql` parity gate (b) predates S1-R5a; a credit dated on the as-of date is Current in the app.
* \[ \] After release: close SV-7192 and SV-10798 (Product answer 2).  

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=cdfdb85bbd46&id=51392de1-c66c-44b6-8166-fe115f626a5f&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)



# SV-11600 — A/R & A/P aging — verify Phase 1: shared report kit
Status OBSOLETE · updated 2026-11-04T09:52 · created 2026-10-21

## Description
Verifies Phase 1 of the tech plan for SV-11315 (PRD: [A/R and A/P Report Sorting, Export and Location Filter](https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/947650561/A+R+and+A+P+Report+Sorting+Export+and+Location+Filter)). Phase 1 changes shared pieces the other reports also use; there is no visible change to the aging reports yet.

**Covers:** S2-R4, S2-R6, S3-N1, S3-N2, S3-N3, S5-R10, S5-R15, S7-R5, S7-R7 (enabling pieces); NFR-002, NFR-003, NFR-004, NFR-005, NFR-008.

**Check:**

* Inventory Value, Sales By Customer and Work In Progress: filters, links shared from the address bar, and CSV/PDF exports behave exactly as before.
* A work order opened from a link at another location still asks to switch, and Cancel still returns to Work Orders with its message.
* The name-order check run against MySQL is attached to the PR and matches every PRD example (10 Trucking before 2 Trucking; Émile's with the E names; Øster before Ozone).
* The two new name indexes exist, and the schema check reports no differences.

All verification tickets Done → the feature is ready for QA.

## Comment Nemanja Djuric 2026-11-04T09:52 (updated 2026-11-04T09:52)
<custom data-type="mention" data-id="id-0">@Chris Ward</custom> closing as a duplicate of [SV-11597](https://shopview.atlassian.net/browse/SV-11597).

Both tickets were created on 2026-10-21 with the same title and the same description (verify Phase 1: shared report kit). SV-11600 was created 9 minutes after SV-11597, most likely a double submit while the verification tickets were being filed. SV-11597 is the one the tech plan and the work track, and it is In Progress. This ticket has no comments, links or work of its own, so nothing is lost by closing it.

# SV-12135 — Reports - A/R and A/P aging reports: columns cannot be sorted and row order is inconsistent
Status TESTING QA · updated 2026-11-10T06:16 · created 2026-11-03

## Description
**Environment:** app.staging.shopview.com (Staging Heavy Duty - 9919), Admin. Also seen on sv10647.qa.shopview.com.

**Reports:** A/R Aging Summary, A/R Aging Detail, A/R Aging Collection, A/P Aging Summary, A/P Aging Detail, A/P Unpaid Invoices.

**Steps**

1. Open Reports and pick any of the 6 reports above. Date = today.
2. On the Detail, Collection or Unpaid reports, expand one group.
3. Click each column header (Customer/Vendor, Date, Due Date, Amount, Open Balance, etc.).

**Expected**
Clicking a header sorts the rows by that column (asc/desc), like the other reports with sort arrows (e.g. Timesheet Activities). Default order is the same on matching reports.

**Actual**

* No column header sorts on any of the 6 reports; the order doesn't change and there is no sort arrow.
* The default order differs between reports:

    * A/R Aging Summary lists customers in no clear order (e.g. ZZAUTOTEST F1…, Mobile Truck & Trailer Repair Island Lake, ZZAUTOTEST WO Page…, Inland Heavy Duty…).
    * A/P Aging Summary lists vendors A to Z.
    * Inside an A/R Aging Detail bucket, rows are not in date or due-date order (91+ group: Jul 24 2025, Jul 24 2025, Jul 19 2025, May 13 2026, May 28 2026, Jun 1 2026, Jun 30 2026, Apr 28 2025…).
    

**Evidence:** 

![](blob:https://media.staging.atl-paas.net/?type=file&localId=dbd31b3192ca&id=3240c25d-2910-4fb3-ae41-8cf4b0335e31&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)


## Comment Nemanja Djuric 2026-11-10T05:42 (updated 2026-11-10T05:54)
# QA Handoff — SV-12135 Bug — A/R and A/P aging: columns cannot be sorted and row order is inconsistent

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** all six aging reports
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Video:** `sv-11532-sorting.mp4`
**Filed:** 2026-11-03 by QA on staging/QA, which still run the old reports. Fixed by the rebuilt reports (Stories 1 and 2: SV-11531, SV-11532).

---

## What changed

* Every column header sorts. First click gives the useful order (names and text A to Z, money largest first, dates oldest first, Past Due largest first, ID / No. smallest first); the second click reverses it. The sorted header shows an arrow.
* Every report has a fixed opening order: both Summaries and both Detail reports in customer / vendor name order (QuickBooks order); A/R Collection and A/P Unpaid by date, oldest first, inside name-ordered groups.
* Ties always fall to the document number, smallest first, in both directions.

## QA Checklist (do these)

### Original repro, now fixed

- [ ] On each of the six reports, click every header once and again: the order changes each time and the arrow follows. No click leaves the order unchanged (unless every value is equal).
- [ ] A/R Aging Summary and A/P Aging Summary open A to Z by name, the same order on every reload.
- [ ] A/R Aging Detail: expand "91 or more days past due" → lines in customer name order, not by random dates; one customer's documents in number order.
- [ ] A/R Aging Collection / A/P Unpaid Invoices: groups by name; documents inside by date, oldest first; same-day documents in number order.
- [ ] Sort, then change a filter or scroll to load more → the sort stays \[S2-R7\]. Reload → the same order again.

### Current details to expect

- [ ] Transaction Type reads Invoice / Credit Memo / Deposit (A/R) and Invoice / Vendor Credit (A/P), and sorts A to Z by those names.
- [ ] Past Due is left-aligned; first click largest first; bills not yet due are negative and sort below 0.
- [ ] Sorted by Location, then the Location column hides (one location) → the sort returns to the opening order.
- [ ] Hovering or clicking the Expand all chevron in the Date heading never lights Date's arrow.

## Known mismatches (not bugs)

* See the shared notes (https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616): negative Past Due for bills not yet due; three date formats.

## What is NOT impacted

- [ ] Other reports' sorting (only the shared arrow hint style changed; see SV-11532).

## Dev verification

- [x] Step-by-step browser check (local, admin, 1440 px): every header both ways on all six reports, Summaries A→Z, Detail lines follow the sort — all pass (16/16 with SV-12137).
- [x] Tests and review rounds: see SV-11531 and SV-11532.  


![](blob:https://media.staging.atl-paas.net/?type=file&localId=a27380cdfc3d&id=d1c4c7fe-2b0b-47f9-958e-f9f68d8cd9fa&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)


# SV-12136 — Reports - A/P Aging: Open Balance is higher than Amount by a few cents
Status TESTING QA · updated 2026-11-10T06:16 · created 2026-11-03

## Description
**Environment:** app.staging.shopview.com (Staging Heavy Duty - 9919), Admin. Also seen on sv10647.qa.shopview.com.

**Steps**

1. Open Reports > A/P Aging Detail. Date = 2026-11-03.
2. Compare the Amount and Open Balance on each bucket total.
3. Open A/P Unpaid Invoices and compare the grand totals.

**Expected**
Open Balance is never higher than Amount (open = amount minus payments/credits).

**Actual**

* A/P Aging Detail, 91 or more days past due: Amount $3,967,303.05, Open Balance $3,967,303.07.
* A/P Aging Detail, 31-60 days past due: Amount $316,332.37, Open Balance $316,332.39.
* QA env, A/P Unpaid Invoices totals: Amount $4,734,817.09, Open Balance $4,734,817.13.
* A/P Aging Summary uses the higher Open Balance figures (91+ $3,967,303.07; 31-60 $316,332.39).
* Looks like rounding on a few bills (open balance summed unrounded or rounded differently from amount).

**Evidence:** 

![](blob:https://media.staging.atl-paas.net/?type=file&localId=48e3a040ec1f&id=f841224b-3f0b-43b5-bd59-2b4eeaa5f8f5&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)


## Comment Nemanja Djuric 2026-11-10T05:42 (updated 2026-11-10T05:42)
# QA Handoff — SV-12136 Bug — A/P Open Balance a few cents above Amount (expected behaviour)

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** `/reports/ap-aging-detail`, `/reports/ap-aging-summary` (and `/reports/ap-unpaid-invoices`)
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Video:** none (no screen change of its own)

---

## Finding

* No rounding is involved: every amount behind these reports is stored in whole cents.
* The gap comes from **partly used vendor credits**. On a bucket's totals, Amount adds each credit's original amount (e.g. "$-10.00") while Open Balance adds what is still unused (e.g. "$-7.98"). So a bucket's Open Balance total can come out above its Amount total although no single row is wrong.
* Product decided (Chris, 2026-11-04, answer 10): "Open Balance never above Amount" is meant **per row**. That holds. The ticket can be closed as expected behaviour — QA, as the reporter, please close it after the check below.
* The rebuild also rounds each row's Amount and Open Balance once, the same way, and the totals add up the rows exactly.

## QA Checklist (do these)

* \[ \] A/P Detail, Expand all: on every **bill** row, Open Balance is never above Amount.
* \[ \] Find a partly used vendor credit: Amount = the original credit (e.g. "$-10.00"), Open Balance = what is unused (e.g. "$-7.98"). Its bucket's Open Balance total may be above its Amount total — expected.
* \[ \] Each bucket's "Total for" row and the Totals row add up the rows to the cent. In the CSV, sum the Amount and Open Balance columns and compare with the Totals row. The PDF shows the same figures.
* \[ \] A/P Aging Summary Totals = the sum of its rows to the cent; with Past due Any, they equal A/P Detail's Open Balance Totals bucket by bucket \[S5-R18a\].

## Known mismatches (not bugs)

* A bucket's Open Balance total above its Amount total, caused by partly used vendor credits (above).

## What is NOT impacted

- [ ] Stored amounts and payments (read only).

## Dev verification

* \[x\] Tests: `DbalApAgingQueryRepositoryTest` (sub-cent balance rounded once; totals = sum of row cents), `AgingSummaryDetailParityTest`.
* \[ \] Data check (dev) on QA / staging: per-shop counts in `staging-gates.sql` §4.
* \[x\] Review rounds: phases 2 and 4, approved.



# SV-12137 — Reports - A/P Aging Detail and A/P Unpaid Invoices: Amount/Open Balance cut off, no loading state, no Print
Status TESTING QA · updated 2026-11-10T06:16 · created 2026-11-03

## Description
**Environment:** app.staging.shopview.com (Staging Heavy Duty - 9919), Admin, window 1400 px wide. Also seen on sv10647.qa.shopview.com.

**Steps**

1. Open Reports > A/P Aging Detail. Date = today. Watch the page while it loads.
2. Expand a bucket.
3. Open A/P Unpaid Invoices and expand a vendor.
4. Look for a Print button on A/P Aging Summary, A/P Aging Detail and A/P Unpaid Invoices.

**Expected**

* All columns fit, or Amount/Open Balance stay visible, like on the A/R reports.
* A spinner shows while the report loads.
* A Print button like on the 3 A/R reports.

**Actual**

* Once a group is expanded, the Amount and Open Balance columns are pushed off the right edge; you have to scroll sideways to see them.
* The reports take about 15-20 s to load (A/P Detail: \~13,600 rows). Until then the page shows empty totals "$0.00 / $0.00" with no spinner, so it looks like there is no data.
* The 3 A/P reports have no Print button; the 3 A/R reports do.

**Evidence:**

![](blob:https://media.staging.atl-paas.net/?type=file&localId=b4d93b6d14de&id=67fe99c2-5726-4bb8-a9b8-2abd75c8f644&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)


## Comment Nemanja Djuric 2026-11-10T05:47 (updated 2026-11-10T06:12)
# QA Handoff — SV-12137 Bug — A/P Aging Detail and A/P Unpaid Invoices: Amount / Open Balance cut off, no loading state, no Print

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** `/reports/ap-aging-detail`, `/reports/ap-unpaid-invoices` (and the other four aging reports)
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Videos:** `sv-11534-grouped-reports-v2.mp4`, `sv-11538-layout.mp4`
**Filed:** 2026-11-03 by QA on staging/QA (old reports). Fixed by the rebuilt reports (S8-R3, S8-R5, S8-R6, S3-R1).

---

## What changed

* **Columns:** Open Balance is pinned to the right and bold on every row. At 1440 px every column of all six reports is visible without a sideways scroll. Long document numbers end in "…" (full on hover); Location wraps on A/P Detail and A/P Unpaid.
* **Group rows:** a closed vendor or bucket shows "Total" and its bold Amount and Open Balance; an open one ends with a "Total for <name>" row.
* **Loading:** the table's loading bar shows while the report reads, including the first read of the Location list. Totals appear only once data has arrived (no "$0.00" first), and "No record matches these filters" never flashes while loading.
* **Print:** every report, A/P included, has the ⋯ Export menu with Download (PDF) and Download (CSV). It replaces the old A/R Print button.

## QA Checklist (do these)

### Original repro, now fixed

- [ ] Window 1440 px: A/P Aging Detail and A/P Unpaid Invoices, all locations, Expand all → Date, Location, Transaction Type, No., Vendor Name, Due Date, Past Due, Amount, Open Balance all visible; Open Balance pinned right and bold.
- [ ] Reload A/P Aging Detail on the QA organization (large A/P data): the loading bar shows; no "$0.00" Totals and no "No record matches these filters" before the data arrives.
- [ ] A/P Aging Summary, A/P Aging Detail, A/P Unpaid Invoices: ⋯ → Download (PDF) and Download (CSV).
- [ ] ↳ Over 2,000 lines the PDF is refused with exactly one message: "This report is too large for PDF. Export it as CSV, or narrow the filters, then try again." CSV works. Narrow to one vendor → the PDF downloads.

### Current details to expect

- [ ] Past Due is left-aligned; a vendor credit on A/P Unpaid shows "—" for Due Date and Past Due.
- [ ] Group rows: closed → bold "Total" with bold Amount and Open Balance; open → "Total for <vendor or bucket>" row after the lines.
- [ ] Narrower than 1440 → the table scrolls sideways under the pinned Open Balance; a closed group's name stays visible at the left.

## Known mismatches (not bugs)

* **At 1400 px** (narrower than 1440) A/P Detail and A/P Unpaid are 2–4 px wider than the window: a tiny sideways scrollbar, Amount a few pixels under the pinned Open Balance. Open Balance always stays visible. The PRD guarantees the fit at 1440 and allows a sideways scroll below it.
* The unfiltered A/P Detail PDF on large organizations (QA has about 13,500 lines) is refused by design; use CSV or narrow the filters.
* SR-2: on a sideways scroll the group chevron scrolls away (follow-up).

## What is NOT impacted

- [ ] Other reports' loading and export behaviour.

## Dev verification

* \[x\] Tests: the six report specs (`reconciling` loading guard, warm-cache guards), `agingColumns.spec.ts`, `useReportExport.spec.ts`.
* \[x\] Review rounds: sv12137-r1 → sv12137-r2 approved; design fixes (design-r2), S4-R7 (s4r7-r1), all approved.
* \[x\] Step check (local, admin): columns fit at 1440 on all six, Export menus work, loading bar instead of the empty state during the first reads — all pass. A/P Unpaid Expand all 0.77 s on a vendor with 2,252 bills.  

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=9b2db9c5ab12&id=ce858077-3579-4300-a6fd-b23e024b0b70&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=939ce5f3463e&id=3d956b18-e955-421e-ba41-ebb557a1c109&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)



# SV-12138 — Reports - A/R Aging Collection and A/P Unpaid Invoices: same-day invoices are listed by time of day instead of invoice number
Status TESTING QA · updated 2026-11-10T06:16 · created 2026-11-03

## Description
**What happens:** Inside a customer or vendor, invoices with the same date come out in the order they were made that day, not in invoice number order.

**Steps**

* Open Reports > A/R Aging Collection (or A/P Unpaid Invoices).
* Expand a customer or vendor that has several invoices on the same date.

**Expected:** Same-day invoices are in invoice number order (for example S3-14690, S3-14691, S3-14692, S3-14693, S3-15660), in both sort directions.

**Actual:** They are ordered by the time of day they were made.

**Rule:** S1-R6 and S2-R4 (ties break by document number) in the [A/R and A/P Report Sorting PRD](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/947650561). Confirmed by Chris in Bilal's QA sheet (22 Oct 2026).

**TestRail cases that fail until this is fixed:** C715282, C715283

## Comment Nemanja Djuric 2026-11-10T05:42 (updated 2026-11-10T05:57)
# QA Handoff — SV-12138 Bug — same-day invoices listed by time of day

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** `/reports/ar-aging-collection`, `/reports/ap-unpaid-invoices`, `/reports/ar-aging-detail`, `/reports/ap-aging-detail`
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Videos:** `sv-11531-opening-order-v2.mp4`, `sv-11532-sorting.mp4`

---

## What changed

A date compares the day only, as the location sees it. Documents on the same day go in document-number order (S3-14690 < S3-14691 < … < S3-15660), in both sort directions, whatever time they were created \[S1-R6, S2-R4\].

## QA Checklist (do these)

### Original repro, now fixed (A/R Collection, A/P Unpaid)

* \[ \] Expand a customer with several invoices on one date (e.g. S3-14690, S3-14691, S3-14692, S3-14693, S3-15660) → they are in invoice-number order.
* \[ \] Click Date → oldest day first, same-day rows smallest number first. Click again → newest day first, same-day rows **still** smallest number first.
* \[ \] Same on A/P Unpaid with bills.

### Detail reports

- [ ] A/R Detail: open a bucket with several invoices on one date → sort by Date → same-day rows in number order, both directions.
- [ ] Opening order: one customer's documents in number order, whatever time they were created.
- [ ] A/P Detail: the same for Date and Due Date.

### The location's day

- [ ] An invoice created late in the evening (after about 6 pm at the location) shows that evening's date and sorts with that day, not the next.

## Known mismatches (not bugs)

* None for this ticket.

## What is NOT impacted

- [ ] Other reports' date sorting.

## Dev verification

* \[x\] Tests: `AgingSqlTest` (day key, number key, runs over 20 digits), `AgingLocalDaySqlTest` (location day, DST-safe), `AgingGroupedSqlTest`, `AgingDetailSqlTest`, `DbalArAgingCollectionTest`, `DbalApUnpaidInvoicesTest`.
* \[x\] Review rounds: phases 1, 3, 4 and asof-r2, approved.
* \[x\] Design re-check (local): 38 pairs of same-date documents, 0 out of order.  

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=114c35900219&id=026d47cb-5fea-4864-b229-2312a0fc1638&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=9a342756ed2f&id=9527f9e1-8dae-4b4a-948e-f0afa03e383d&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)



# SV-12139 — Reports - A/R and A/P aging: the location prompt's button reads "Switch Location" instead of "Switch location"
Status TESTING QA · updated 2026-11-10T06:16 · created 2026-11-03

## Description
**What happens:** The "Switch location?" prompt that opens when a user clicks a document from another location shows its button with a capital L.

**Steps**

* Open any A/R or A/P aging report with two locations ticked.
* Click an invoice or bill from a location other than the one you are signed into.

**Expected:** The buttons read "Cancel" (left) and "Switch location" (right, small l), with a close X at the top right that works like Cancel.

**Actual:** The button reads "Switch Location".

**Rule:** S7-R3 (the existing location-switch prompt wording) in the [A/R and A/P Report Sorting PRD](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/947650561). Confirmed by Chris in Bilal's QA sheet (22 Oct 2026).

**TestRail cases that fail until this is fixed:** C715416, C715417, C715519, C715520, C715546

## Comment Nemanja Djuric 2026-11-10T05:42 (updated 2026-11-10T05:58)
# QA Handoff — SV-12139 Bug — location prompt button reads "Switch Location"

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** `/reports/ar-aging-detail`, `/reports/ar-aging-collection`
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Video:** `sv-11537-links.mp4`

---

## What changed

The prompt on the aging reports reads "Switch location?" with buttons "Cancel" (left) and "Switch location" (right, small l), and a close × \[S7-R3\]. Cancel and × keep you exactly where you were \[S7-R5\]. The app's global button style capitalises every word; the aging prompt now overrides it.

## QA Checklist (do these)

### Original repro, now fixed

* \[ \] Admin enrolled at 2+ locations. A/R Collection (or A/R Detail, bucket open), all locations ticked. Click an invoice number from another location you are enrolled in → title "Switch location?", message "This work order is in {location}. Switch your active location to view it?" (part sale: "This part sale is in {location}. …").
* \[ \] Buttons: "Cancel" on the left, "Switch location" on the right, with a **small l**. × at the top right.
* \[ \] × and Cancel → the prompt closes; same address, filters, sort, open groups and scroll position.
* \[ \] "Switch location" → the active location changes and the document opens.
* \[ \] A/P reports never show this prompt (a bill at another location is plain text).

## Known mismatches (not bugs)

* The work order and part sale pages' **own** prompt (e.g. after a Ctrl-click into a new tab, or a deep link with another `locationId`) still reads "Switch Location" with a capital L. That comes from the app-wide button style and was not changed here. Only the aging prompt is fixed.

## What is NOT impacted

- [ ] The work order / part sale prompt's behaviour: Cancel still returns to Work Orders with its message (SV-11597).

## Dev verification

* \[x\] Fixed in the design pass (68c886966f): a dialog-scoped override of the global button capitalisation. The unit tests don't load the app stylesheet, so the casing is checked in the browser (review design-r1 SR-1 removed two class-only checks).
* \[x\] Tests: `useWorkOrderLocationResolver.spec.ts` (stay mode: Cancel and × keep the page), `useAgingDocumentSwitch.spec.ts`.
* \[x\] Review rounds: phases 1, 3, 4, design-r1/r2, approved.
* \[x\] Walks: the prompt reads "Switch location"; Cancel keeps the address and open groups; video 15/15 checks.  

![](blob:https://media.staging.atl-paas.net/?type=file&localId=bdbf5331b5e6&id=0088cdbd-94ed-4294-81ae-4125df1e8163&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)


# SV-12140 — Reports - A/R and A/P aging: customer and vendor names that start with a punctuation mark are sorted before the digits
Status TESTING QA · updated 2026-11-10T06:16 · created 2026-11-03

## Description
**What happens:** Names starting with a punctuation mark are put before every name starting with a digit, instead of plain character order.

**Steps**

* Have four customers: "#1 Diesel", "-1 Diesel", "10 Trucking" and "@Home Towing".
* Open A/R Aging Summary (opens A to Z).

**Expected:** Plain character order, the way QuickBooks sorts: "#1 Diesel", "-1 Diesel", "10 Trucking", "@Home Towing".

**Actual:** "-1 Diesel" first, then the other punctuation names, then "10 Trucking".

**Rule:** S1-R2 (plain character order) in the [A/R and A/P Report Sorting PRD](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/947650561). Confirmed by Chris in Bilal's QA sheet (22 Oct 2026).

**TestRail cases that fail until this is fixed:** C715573

## Comment Nemanja Djuric 2026-11-10T05:42 (updated 2026-11-10T05:58)
# QA Handoff — SV-12140 Bug — names starting with punctuation sorted before digits

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** all six aging reports (the name order)
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Video:** `sv-11531-opening-order-v2.mp4`

---

## What changed

Names compare in plain character order, ignoring capitals, with accents folded to their base letter \[S1-R2, S1-R3, S1-R4\].

## QA Checklist (do these)

### Original repro, now fixed

- [ ] Customers "#1 Diesel", "-1 Diesel", "10 Trucking", "@Home Towing" (one open invoice each) → A/R Aging Summary lists them in exactly that order.
- [ ] Same vendors → the same order on A/P Aging Summary.
- [ ] Same order inside a bucket on A/R Detail and A/P Detail, and between groups on A/R Collection and A/P Unpaid.
- [ ] Same order in the PDF and the CSV.

### Neighbours

- [ ] "10 Trucking" before "2 Trucking"; "A-1 Towing" before "a1 towing".
- [ ] "Emile's Towing" before "Émile's Towing"; "Émile's" among the E names; "Øster" among the O names.

## Known mismatches (not bugs)

* Letters outside the PRD's accent table (e.g. Polish ł, Turkish ı, non-Latin scripts) sort after z (Product OK'd, answer 4).

## What is NOT impacted

- [ ] Name order on other reports.

## Dev verification

* \[x\] Tests: `ReportNameOrderSqlTest`, `AgingSqlTest`; MySQL 8.0.42 proof `api/tools/sql/aging-name-order-check.sql` = `aging-name-order-check.expected.txt`.
* \[x\] Review rounds: phases 1, 2, 4, approved.  

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=a8285eb5c79d&id=b46198c7-149a-409a-ba32-fb25f0b22049&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)



# SV-12141 — Reports - A/R and A/P aging exports: the "Locations:" line lists locations in the order ticked instead of A to Z
Status TESTING QA · updated 2026-11-10T06:16 · created 2026-11-03

## Description
**What happens:** On the PDF and CSV, the "Locations:" line follows the order the user ticked the locations.

**Steps**

* Open any A/R or A/P aging report.
* Tick Lethbridge, then Calgary (not every location).
* Download (PDF) and Download (CSV).

**Expected:** "Locations: Calgary, Lethbridge": Location menu order (A to Z by name), separated by a comma and a space. With every location ticked: "Locations: All locations".

**Actual:** "Locations: Lethbridge, Calgary".

**Rule:** S3-R5 in the [A/R and A/P Report Sorting PRD](https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/947650561). Confirmed by Chris in Bilal's QA sheet (22 Oct 2026).

**TestRail cases that fail until this is fixed:** C715343

## Comment Nemanja Djuric 2026-11-10T05:42 (updated 2026-11-10T05:59)
# QA Handoff — SV-12141 Bug — "Locations:" export line in tick order

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** the ⋯ Export menu on all six aging reports
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Video:** `sv-11533-exports-v2.mp4`

---

## What changed

The export's "Locations:" line lists the ticked locations A to Z (the Location menu's order), whatever order you ticked them in. Customers and vendors stay in tick order \[S3-R5\].

## QA Checklist (do these)

### Original repro, now fixed

- [ ] A/R Aging Summary: tick Lethbridge, then Calgary (not all) → Download (CSV) and Download (PDF) → "Locations: Calgary, Lethbridge".
- [ ] All locations ticked → "Locations: All locations".
- [ ] Repeat on A/P Aging Summary, A/R Detail, A/P Detail, A/R Collection and A/P Unpaid.

### Customers and vendors keep tick order

- [ ] Tick customer B, then A → the line reads "Customers: B, A" (vendors likewise).

## Known mismatches (not bugs)

* None for this ticket. (Use your own location names on QA; Calgary / Lethbridge are examples.)

## What is NOT impacted

- [ ] Other reports' export header lines.

## Dev verification

* \[x\] Tests: `DbalOrganizationLocationsScopeResolverTest`, `AgingExportHeaderResolverTest`, `AgingSummaryEndpointTest`, `AgingGroupedEndpointTest`, `AgingDetailEndpointTest`.
* \[x\] Review rounds: phases 1, 2, 4, approved.  

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=b23d938110cd&id=09d5d8b5-64d4-4a9f-ae68-1aff9bef8852&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)



# SV-11531 — A/R and A/P Report Sorting - Story 1 - Reports open in QuickBooks name order
Status TESTING QA · updated 2026-11-10T06:17 · created 

## Description
(identical to the 26 Oct copy, JIRA-SV-11315-stories-2026-10-26.md, normalised text diff = 0 lines; still the PRD v9 wording)

## Comment Nemanja Djuric 2026-11-10T05:40 (updated 2026-11-10T05:47)
# QA Handoff — SV-11531 Story 1 — reports open in QuickBooks name order

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** all six — `/reports/ar-aging-summary`, `/reports/ar-aging-detail`, `/reports/ar-aging-collection`, `/reports/ap-aging-summary`, `/reports/ap-aging-detail`, `/reports/ap-unpaid-invoices`
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Video:** `sv-11531-opening-order-v2.mp4` (also covers SV-11441 and SV-12140)

---

## What changed

Every report has a fixed opening order. Names sort the way QuickBooks sorts them. Buckets, groups and documents come out in the same order on screen, in the PDF and in the CSV. The bucket a document lands in and its Past Due are counted in calendar days at the location.

## QA Checklist (do these)

### Name order — Summaries \[S1-R1–S1-R4\]

- [ ] Customers "10 Trucking", "2 Trucking", "A-1 Towing", "a1 towing", "Émile's", "Emile's Towing", "Émile's Towing", "Øster", "Ozone" with one open invoice each. Open A/R Aging Summary with only these ticked in the Customer filter → order is: 10 Trucking, 2 Trucking, A-1 Towing, a1 towing, Emile's Towing, Émile's, Émile's Towing, Øster, Ozone.
- [ ] "Emile's Towing" comes before "Émile's Towing". Accented names sit among the plain E and O names.
- [ ] Names starting with punctuation: "#1 Diesel", "-1 Diesel", "10 Trucking", "@Home Towing" in exactly that order (see SV-12140).
- [ ] The Customer header shows the sort arrow on open \[S1-R7\].
- [ ] Same on A/P Aging Summary with vendors (Vendor header marked).

### Detail reports — buckets \[S1-R5, S1-R5a\]

* \[ \] A/R Detail and A/P Detail list five buckets in this order under any sort: "91 or more days past due", "61-90 days past due", "31-60 days past due", "1-30 days past due", "Current". Each shows its count "(N)". All start closed.
* \[ \] Open a bucket → lines in customer (A/R) or vendor (A/P) name order; one customer's documents in document-number order (S3-99, S3-100, S3-101). "Customer Full Name" / "Vendor Name" header marked.
* \[ \] A document lands in a bucket by calendar days at the location: due on or after the as-of date → "Current"; due 1–30 days before → "1-30 days past due"; and so on.
* \[ \] A credit memo, deposit or vendor credit dated **on** the as-of date is in "Current"; one dated the day before is in "1-30 days past due" (full steps in SV-11441).
* \[ \] A/R invoices not yet due are in "Current". Where Past Due shows (A/P Detail), a bill due in 10 days reads "-10".

### Collection and Unpaid — groups \[S1-R6, S1-R7\]

- [ ] A/R Collection groups by customer, A/P Unpaid by vendor, groups in name order. Inside a group, documents oldest date first. The Date header is marked.
- [ ] Several documents on the same date go in document-number order (S3-14690, S3-14691, …), whatever time they were created (see SV-12138).
- [ ] A/R Collection lists only overdue invoices (Past Due 1 or more in calendar days) plus every unused credit memo and deposit. An invoice due today is not listed; one due yesterday is, with Past Due 1.

### Paging \[S1-R8\]

- [ ] Summaries, A/R Collection, A/P Unpaid: 30 customers or vendors show; scroll to the bottom → the next 30 load. No page buttons. Compare names around rows 30/31: nothing repeats or is skipped. Repeat after sorting by Total and with a Past due range ticked.
- [ ] Detail: an open bucket shows its first 100 lines; scroll to its end → the next 100, until the count is reached. Unique numbers = "(N)". (New on A/R Detail.)
- [ ] A/R Collection / A/P Unpaid: an open customer or vendor with more than 100 documents shows 100, then 100 more each time you scroll to its end. Its "(N)", its "Total for <name>" row, the Totals row and both exports cover every document.

### Access and empty \[S1-N1, S1-E1\]

- [ ] A user without Reports → Page Access does not see the reports.
- [ ] A customer or vendor with nothing open on the as-of date is not listed.

## Known mismatches (not bugs)

* Bills not yet due show negative Past Due ("-10" for a bill due in 10 days). Product decision, see the shared notes (https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616).
* Inside a group over 100 documents, the browser's Find only finds documents already drawn \[S1-R8\].

## What is NOT impacted

- [ ] Other reports (Sales By Customer, Inventory Value, Work In Progress, …).
- [ ] Work order, part sale, delivery and vendor return pages (only opened from the reports).

## Dev verification

* \[x\] Tests: `ReportNameOrderSqlTest`, `AgingSqlTest` (name key, number key, calendar-day buckets at every boundary, `testDaysBeforeTheAsOfDayAreCalendarDays`), `AgingLocalDaySqlTest`, `AgingTodayAgedAtEndOfDayTest`, `DbalArAgingQueryRepositoryTest`, `DbalArAgingDetailTest`, `DbalApAgingDetailTest`, `DbalArAgingCollectionTest`, `DbalApUnpaidInvoicesTest`, `useAgingGroupRowWindows.spec.ts`, `useAgingBucketPages.spec.ts`. MySQL 8.0.42 proof `api/tools/sql/aging-name-order-check.sql` = its expected file.
* \[x\] Test ids: `header_<code>_<column>` (sort arrow), `aging_detail_report_row_<bucket>_cell_bucket`, `row_ardet_load_more_<bucket>`, `row_arcol_load_more_<customerId>`, `row_apunp_load_more_<vendorId>`.
* \[x\] Review rounds: phases 1–5 and the as-of / Past Due fix (asof-r2), all approved.
* \[x\] Walks: p5walk 13/13; Expand all on the largest local groups 0.63–0.77 s; the video above is being re-recorded on the current build.  

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=81002e0f9b42&id=1782ad3f-0817-403f-ae30-3058c40e9dbc&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)



# SV-11532 — A/R and A/P Report Sorting - Story 2 - Sort by clicking any column header
Status TESTING QA · updated 2026-11-10T06:17 · created 

## Description
(identical to the 26 Oct copy, JIRA-SV-11315-stories-2026-10-26.md, normalised text diff = 0 lines; still the PRD v9 wording)

## Comment Nemanja Djuric 2026-11-10T05:40 (updated 2026-11-10T05:48)
# QA Handoff — SV-11532 Story 2 — sort by clicking any column header

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** all six aging reports
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Video:** `sv-11532-sorting.mp4` (also covers SV-12135). Recorded before two small fixes: Past Due in calendar days and the sorted column's arrow strength on hover (see the shared notes (https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616)).

---

## What changed

Every header sorts. The first click gives the useful order for that kind of data, the second reverses it. Ties always keep the smallest document number first. Dates are plain dates, credits are named, and a Location sort falls back when the Location column hides.

## QA Checklist (do these)

### Headers and first click \[S2-R1, S2-R2, S2-R3, S2-R4a\]

- [ ] Headings (Title Case, screen, PDF and CSV):
- [ ] ↳ Summaries: Customer / Vendor, Location (when shown), Current, 1-30 Days, 31-60 Days, 61-90 Days, 91 And Over, Total.
- [ ] ↳ A/R Detail: Date, Location, Transaction Type, ID, Customer Full Name, Due Date, Amount, Open Balance (no Past Due).
- [ ] ↳ A/R Collection: Date, Location, Transaction Type, ID, Due Date, Past Due, Amount, Open Balance.
- [ ] ↳ A/P Detail and A/P Unpaid: Date, Location, Transaction Type, No., Vendor Name, Due Date, Past Due, Amount, Open Balance.
- [ ] First click: text (names, Location, Transaction Type) A to Z; money largest first; dates oldest first; Past Due largest first; ID / No. smallest number first. Second click reverses; third repeats. No unsorted state.
- [ ] The column the report opened on reverses on its first click \[S2-R3\].
- [ ] A/P Unpaid: the Vendor Name header is not clickable (it is the group). On A/P Detail it is.
- [ ] The sorted header shows its arrow at full strength, also while you hover or focus it. Hovering another header shows a faint arrow hint.
- [ ] On the four grouped reports, hovering or clicking the Expand all chevron (in the Date heading) never lights Date's arrow and never sorts \[S4-R3\].

### Inside groups and buckets \[S2-R9, S4-R8\]

* \[ \] A/R Collection / A/P Unpaid: a sort reorders documents **inside** each customer or vendor; the groups never move; open groups stay open.
* \[ \] Detail: a sort reorders lines inside each bucket; buckets never move; open buckets stay open and start again at their first 100 lines.

### Ties and dates \[S2-R4, S1-R6\]

- [ ] Rows with the same value keep the smallest document number first, in both directions.
- [ ] Date compares the day only: same-day rows stay in document-number order both ways (SV-12138).
- [ ] Date and Due Date read like "Nov 5, 2026" on every row, including today, yesterday and 2 days ago — never "Today", "Yesterday" or "2 days ago" \[S2-R1a\]. The date is the location's day: a document created late in the evening shows that evening's date.

### Past Due and blanks \[S2-R6\]

- [ ] Past Due is left-aligned. First click: largest first. Values are calendar days at the location; bills not yet due are negative ("-10" for a bill due in 10 days) and sort below 0.
- [ ] A/P Unpaid vendor credit: Due Date and Past Due read "—" and stay at the bottom of their group in both directions.
- [ ] A/P Detail vendor credit: Due Date = its own date (not "—"), so it sorts among the bills.

### Credit names \[S2-R1b\]

- [ ] Transaction Type reads "Invoice", "Credit Memo" or "Deposit" on A/R, "Invoice" or "Vendor Credit" on A/P. Never "Credit".
- [ ] Click Transaction Type → A to Z by these names: A/R Credit Memo → Deposit → Invoice; A/P Invoice → Vendor Credit. Second click reverses; same-type rows keep the smallest number first.

### Sort kept, not remembered \[S2-R7, S2-R8\]

- [ ] Sort by Open Balance (or Total), then change As of, Customer / Vendor, Past due and Location → the sort stays. Scroll to load more → still sorted.
- [ ] Leave the report and open it again from the Reports menu → back to the opening order.
- [ ] Switch location (top right) while on a report → filters and rows stay, the sort returns to the opening order, groups collapse.

### Location sort falls back when the column hides \[S2-R7a\]

- [ ] With 2+ locations, sort by Location (A to Z), then tick a single location → the Location column hides and the sort returns to the opening order, with that header marked (the name column on the Summaries and Detail; Date, oldest first, on A/R Collection and A/P Unpaid). Rows, page address and exports follow.
- [ ] Tick a second location again → the column returns; the sort stays on the opening order.
- [ ] A new As of that leaves only one location in the list → the same fallback.
- [ ] Sorted by any other column, narrowing to one location keeps that sort.
- [ ] Every customer at one location: sorting by Location shows no visible change \[S2-E1\].

## Known mismatches (not bugs)

* Three date formats: screen "Nov 4, 2026", PDF "Nov 04 2026", CSV "2026-11-04" (Product decision).
* PRD S2-R7a mentions only narrowing the filter; the fallback happens whenever the Location column hides (Product agreed, wording fix pending).
* Bills not yet due show negative Past Due (Product decision).

## What is NOT impacted

- [ ] Other reports' sorting. The only shared change is the header arrow hint style, also used by Technician Utilization, Sales By Customer and Sales By Representative: there the sorted arrow keeps full strength on hover and the faint hint still shows on other headers.
- [ ] Work order, part sale, delivery and vendor return pages.

## Dev verification

* \[x\] Tests: `ReportSortableHeaderRow.spec.ts`, `ReportSortKeyTest`, `ReportPaginatorOrderByTest`, `AgingDetailSqlTest`, `AgingGroupedSqlTest`, `DbalArAgingCollectionTest` / `DbalApAgingDetailTest::testTransactionTypeSortsByItsNamesWithTiesByNumberBothWays`, `agingCellFormat.spec.ts` (plain dates, location time zone), `useAgingLocationSortFallback.spec.ts` and the six report specs.
* \[x\] Test ids: `header_<code>_<column>`, `button_<code>_toggle_all`, `tooltip_<code>_toggle_all`.
* \[x\] Review rounds: phases 1–5, design fixes (design-r2), sort caret (caret-r2), as-of / Past Due (asof-r2), all approved. Caret checked in Chromium, Firefox and WebKit.

    * \[x\] Walks: SV-12135 step check — every header both ways on all six reports — all pass; video 18/18 checks.  
    
        ![](blob:https://media.staging.atl-paas.net/?type=file&localId=225269d728c6&id=63f5662d-0b4b-4051-a1c8-8c91691932ad&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)
    



# SV-11533 — A/R and A/P Report Sorting - Story 3 - Export to PDF and CSV
Status TESTING QA · updated 2026-11-10T06:17 · created 

## Description
(identical to the 26 Oct copy, JIRA-SV-11315-stories-2026-10-26.md, normalised text diff = 0 lines; still the PRD v9 wording)

## Comment Nemanja Djuric 2026-11-10T05:40 (updated 2026-11-10T05:48)
# QA Handoff — SV-11533 Story 3 — export to PDF and CSV

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** the ⋯ Export menu on all six aging reports
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Video:** `sv-11533-exports-v2.mp4` (also covers SV-12141)

---

## What changed

Every report exports what is on screen — same rows, same order, same filters — as PDF and CSV. The A/R Print button is gone; A/P gets a PDF. Each file names the as-of date you picked.

## QA Checklist (do these)

### Menu \[S3-R1, S3-R2\]

- [ ] Each of the six reports has ⋯ ("Export report") at the right of the title with "Download (PDF)" and "Download (CSV)". No report has a Print button. A/P reports now have a PDF.

### Content follows the screen \[S3-R3, S3-R6\]

- [ ] Sort by a money column, tick a Past due range, two locations and two customers (B, then A) → export both → rows and order equal the screen.
- [ ] Re-sort and export again without reloading → the new order.
- [ ] Detail: export with every bucket collapsed → every line is in the file.
- [ ] One location ticked → no Location column in either file.
- [ ] Sorted by Location, then one location ticked → the files use the opening order and have no Location column \[S2-R7a, S6-N1\].

### Header lines and the as-of date \[S3-R4, S3-R5\]

* \[ \] CSV starts with the filter lines, one per row: "As of: Nov 2, 2026", "Locations: …", then "Past due: …" and "Customers: …" / "Vendors: …" only when set, then the headings.
* \[ \] PDF top: "As of Nov 2, 2026" (no colon) and the same lines.
* \[ \] "Locations:" lists the ticked locations A to Z, whatever order you ticked them; all ticked → "Locations: All locations" (SV-12141). Customers / Vendors stay in tick order.
* \[ \] Pick a past As of (e.g. Nov 2) → both files print **that** day, never the next. Check in any browser; the page now sends the day itself (`asOfDate=2026-11-02` in DevTools → Network).
* \[ \] Edit the page address to an As of after today (e.g. `asOfDate=2027-01-01`) → the report opens on today, and the files print today's date.

### CSV layout \[S3-R8, S3-R8a, S3-R8b\]

* \[ \] Headings = the screen's headings, letter for letter ("Customer Full Name" on A/R Detail, "Customer" on A/R Collection, "Vendor Name" on A/P).
* \[ \] One row per customer (Summaries) or per document (the other four); no group or subtotal rows; one Totals row.
* \[ \] Detail: "Aging Bucket" is the first column, with the screen's bucket names; the Totals row is labelled in it.
* \[ \] A/R Collection: Customer after ID, then Phone, then **"Credit Term"** (capital T) only for users with View and Manage AP/AR Data.
* \[ \] Money: plain number, two decimals. Dates: YYYY-MM-DD. An empty Summary bucket is blank.
* \[ \] Transaction Type: Invoice / Credit Memo / Deposit (A/R), Invoice / Vendor Credit (A/P). Never "Credit".
* \[ \] Past Due in the files equals the screen: calendar days, a credit dated on the as-of date 0, a bill due in 10 days -10.

### PDF layout

- [ ] A4 landscape, Title Case headings; "91 And Over" on one line (Summaries).
- [ ] A/R Collection / A/P Unpaid: grouped by customer or vendor with a "Subtotal" per group; each A/R customer line reads "Phone: …" and (with the permission) "Credit term: …" (small t).
- [ ] Detail: grouped by bucket in the fixed order, each bucket's lines then its subtotal, one Totals row. Only buckets that hold a document are printed.

### Messages \[S3-R10, S3-N1, S3-N3\]

* \[ \] Success: "Success" / "Data exported successfully."
* \[ \] Location: No locations (Clear selection) → "Empty export" / "Export didn't yield any results"; nothing downloads.
* \[ \] A/P Detail or A/P Unpaid over 2,000 lines (the QA organization is) → PDF refused with exactly one message: "This report is too large for PDF. Export it as CSV, or narrow the filters, then try again." CSV still downloads. Narrow (one vendor) → the PDF downloads.
* \[ \] Block `*/export*` in DevTools (see the shared notes (https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616)) → exactly one "We couldn't export this report. Please try again."
* \[ \] CSV over 50,000 lines \[S3-N2\]: covered by tests; not practical by hand.

### Legacy gone (SV-11599)

* \[ \] The old A/R PDF address `/api/reporting/account-receivable/pdf` answers 404.

## Known mismatches (not bugs)

* PDF negatives read "(-$11,111.00)"; the screen shows "$-11,111.00" (Product decision).
* Three date formats: screen "Nov 4, 2026", PDF "Nov 04 2026", CSV "2026-11-04" (Product decision).
* The CSV column is "Credit Term"; the PDF line keeps "Credit term:" (it is a label, not a heading — S9-R2).
* Bills not yet due show negative Past Due in the files too (Product decision).

## What is NOT impacted

- [ ] Other reports' exports (Sales By Customer, Inventory Value, Work In Progress, …). Only the six aging export addresses were added to the app's "show one message" list.

## Dev verification

* \[x\] Tests: `ExportRowCapGuardTest`, `ReportPaginatorIterateAllWithinCapTest`, `ReportExportFormatterTest`, `AgingSummaryEndpointTest`, `AgingGroupedEndpointTest` (incl. `testEachKindOfCreditIsNamedOnTheScreenInTheCsvAndInThePdf`, "Credit Term" only with the permission), `AgingDetailEndpointTest`, `AgingGroupedExportTableBuilderTest`, `AgingExportHeaderResolverTest`, `AgingAsOfResolverTest` (`testAPastDayIsNamedAndCutOffAsThatDayNeverTheNext`, `testALaterDayIsReadAndAgedAsToday`), `AgingRequestParserTest` (a time instead of a day is refused with 400), `useReportExport.spec.ts`, `agingExport.spec.ts`, `axios-silent-fail.spec.ts`, `PricingPdfGuardTest`.
* \[x\] Review rounds: phases 1–5 and asof-r1 → asof-r2 (SR-1: a later day printed the far date; fixed in e960b53679), all approved.
* \[x\] Probe in a browser with out-of-date time zone data: sends `2026-11-02`; A/R and A/P CSV read "As of: Nov 2, 2026" (before the fix they read Nov 3).
* \[x\] Walks: PDF cap shows exactly one message; A/R Detail PDF 14 pages A4 landscape; p5walk 13/13. The video above is being re-recorded on the current build.  

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=f7b447ceee0a&id=9eaec3c4-2fed-428f-8a3d-eb0a2b499d33&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)



# SV-11534 — A/R and A/P Report Sorting - Story 4 - Collapse all, Expand all and pinned group rows
Status TESTING QA · updated 2026-11-10T06:17 · created 

## Description
(identical to the 26 Oct copy, JIRA-SV-11315-stories-2026-10-26.md, normalised text diff = 0 lines; still the PRD v9 wording)

## Comment Nemanja Djuric 2026-11-10T05:40 (updated 2026-11-10T05:49)
# QA Handoff — SV-11534 Story 4 — Collapse all, Expand all and pinned group rows

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** the four grouped reports — `/reports/ar-aging-detail`, `/reports/ap-aging-detail`, `/reports/ar-aging-collection`, `/reports/ap-unpaid-invoices`
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Video:** `sv-11534-grouped-reports-v2.mp4` (also covers SV-12137)

---

## What changed

One chevron opens or closes every group. The group you scroll through stays pinned under the headings. Group rows follow the design: a closed group shows its totals on its own row; an open group ends with a "Total for <name>" row. Detail buckets load 100 lines at a time, and so do very large customers or vendors on A/R Collection and A/P Unpaid.

## QA Checklist (do these)

### Group rows (design)

* \[ \] Closed group: chevron (pointing right) in the first cell, then the bold name and bold count, e.g. "**91 or more days past due (12)**" or "**Acme Towing (5)**"; a bold "Total" in the column before Amount; bold Amount and Open Balance.
* \[ \] Open group: the group row shows only the chevron (pointing down) and the name with its count. After the last line: "Total for 91 or more days past due" (or "Total for Acme Towing") with bold Amount and Open Balance.
* \[ \] The "Total for" amounts equal the closed row's amounts.
* \[ \] Group rows are white (no grey band); document lines are not indented.

### Expand all / Collapse all \[S4-R1, S4-R2, S4-R3, S4-R5\]

- [ ] The header chevron sits in the Date heading, before "Date". With every group closed it points right and its tooltip (above) reads "Expand all"; with any group open it points down and reads "Collapse all".
- [ ] Clicking it never sorts the Date column, and never lights Date's sort arrow (hover or focus).
- [ ] Expand all on A/R Collection, then scroll until the next 30 customers load → they arrive open.
- [ ] Each group's own chevron toggles that group only.
- [ ] Detail: Expand all opens every bucket that has lines. An empty bucket reads "(0)" and its chevron is greyed.

### 100 lines at a time \[S4-R4, S1-R8\]

- [ ] Detail: an open bucket shows its first 100 lines; scroll to its end → a small spinner row, then the next 100, until "(N)" is reached. No line repeats or is skipped. The "Total for" row appears after the last line.
- [ ] A/R Collection / A/P Unpaid: a customer or vendor with more than 100 documents draws 100, then 100 more each time you scroll to its end. Its "(N)" and amounts, the Totals row and both exports cover every document; its "Total for" row shows once the last document is drawn.
- [ ] Re-sort, or close and reopen → the group starts again at its first 100.
- [ ] Expand all on the largest vendor (A/P Unpaid) opens in about a second; scrolling stays smooth.

### Pinned group row \[S4-R6\]

- [ ] Scroll through a long open group → its row (name and count; on A/R Collection also Phone and Credit term) stays pinned under the headings. The next group's row pushes it up and takes its place. Scrolling back reverses it.
- [ ] The pinned row stays while the next 100 load.

### Sideways scroll \[S4-R7\]

* \[ \] Make the window narrower than about 1440 px (or zoom in) and scroll the table sideways: a **closed** group's bold name and count stay visible at the left, on the row's own colour (light, dark, hover).
* \[ \] On A/R Collection, Phone and Credit term slide under the name; the name stays readable.
* \[ \] Check 1024 px and 375 px on all four reports.

### Kept and reset \[S4-R8, S4-R9, S4-N1\]

- [ ] Re-sorting or scrolling keeps every group open or closed as it was.
- [ ] Changing As of, Customer / Vendor, Past due or Location collapses every group.
- [ ] Leave and come back → all closed.

### Bucket errors (Detail) \[Story 4 Error Handling\]

* \[ \] DevTools → Network request blocking `*/buckets/*/rows*`, expand a bucket → in place of its lines: "Something went wrong loading this bucket. Collapse and expand it to try again." Other buckets are unaffected.
* \[ \] Remove the block, collapse and expand that bucket → its lines load. While it reads again you see the loading row, not the old error.
* \[ \] Open a bucket with more than 100 lines, then block the pattern and scroll to its end → the lines already shown stay, and the bucket ends with "Not every line loaded. Collapse and expand this bucket to try again."
* \[ \] Same on A/P Detail.

## Known mismatches (not bugs)

* **SR-2 (follow-up):** on a sideways scroll the group's chevron scrolls away with the table; only the name and count stay. Scroll back left to use it.
* At 375 px a closed group's Amount covers the end of a long name (kept; no money value is cut).
* A/R Detail's columns shift about 34 px sideways when you click Expand all.
* A failing bucket (server error) also raises the app-wide "Ooooops! An error occurred" toast next to the bucket message.
* Inside a group over 100 documents, the browser's Find only finds documents already drawn, and the scrollbar grows as you scroll (PRD S1-R8).

## What is NOT impacted

- [ ] A/R Summary and A/P Summary (no groups).
- [ ] Other reports' group rows (the pinned-row and expansion pieces are opt-in).

## Dev verification

* \[x\] Tests: `useReportGroupExpansion.spec.ts`, `ReportPinnedGroupRow.spec.ts`, `useReportPinnedGroup.spec.ts`, `AgingDocumentRows.spec.ts`, `useAgingGroupRowWindows.spec.ts`, `useAgingBucketPages.spec.ts` (later page fails → lines kept + hint; failed first page → message; re-read shows loading), `agingColumns.spec.ts` (group row layout), the four report specs (bucket error text exact).
* \[x\] Test ids: `button_<code>_toggle_all`, `tooltip_<code>_toggle_all`, `row_<code>_pinned_group`, `button_<code>_pinned_group_toggle`, `<prefix>_row_<key>_total_label`, `<prefix>_row_<key>_subtotal`, `<prefix>_row_<key>_subtotal_label`, `<prefix>_row_<key>_subtotal_cell_<col>`, `text_aging_detail_report_error_<bucket>`, `text_ap_aging_detail_report_error_<bucket>`, `text_ardet_stopped_<bucket>`, `text_apdet_stopped_<bucket>`.
* \[x\] Review rounds: phases 3–4 (phase4 r1–r4), bucket errors (bucketfix r1–r3), design fixes (design-r1/r2), S4-R7 (s4r7-r1, Codex + Claude approve), caret (caret-r1/r2). Open follow-ups from those rounds: SR-2 chevron not sticky; bucketfix SR-3 (a reopened bucket cut back to its first 100 can show cached lines for up to 30 s) and SR-5 (retry while offline).
* \[x\] S4-R7 checked in Chromium, Firefox and WebKit at 1440, 1366, 1024, 800 and 375 px, light and dark.
* \[x\] Perf (local, 1440 px): Expand all 0.63–0.77 s on the largest groups (A/P Unpaid vendor with 2,252 bills; was 5.4 s before the 100-document windows).
* \[x\] Local data only: test customer TestVT1 has a credit memo and a deposit sharing one id, so the browser logs a duplicate-key warning when its rows draw. QA data will not show it.
* \[x\] Video: 20/20 checks.  

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=78d1d25ded6b&id=477971b1-0f6e-44e9-824b-c9a9db4ef593&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)



# SV-11535 — A/R and A/P Report Sorting - Story 5 - Filters: customer or vendor, past due and location
Status TESTING QA · updated 2026-11-10T06:17 · created 

## Description
(identical to the 26 Oct copy, JIRA-SV-11315-stories-2026-10-26.md, normalised text diff = 0 lines; still the PRD v9 wording)

## Comment Nemanja Djuric 2026-11-10T05:41 (updated 2026-11-10T05:50)
# QA Handoff — SV-11535 Story 5 — filters: As of, customer or vendor, Past due and Location

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** the filter row on all six aging reports
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Video:** `sv-11535-filters.mp4` (recorded before the as-of day fix; the As of steps below are current)

---

## What changed

Every report has the same four chips: As of, Customer (A/R) or Vendor (A/P), Past due and Location. The Totals row always adds up exactly the rows left. Choices live in the page address, and a Summary name carries them into A/R Collection or A/P Unpaid.

## QA Checklist (do these)

### Filter row \[S5-R1, S5-R13, S5-R15\]

- [ ] Order: As of, Customer (person icon) / Vendor (truck icon), Past due (hourglass), Location. "Customer: All customers" and "Past due: Any" are grey at rest; a choice turns them blue.
- [ ] Customer / Vendor menu: search box, "All customers" / "All vendors", "All customers are included. Pick one or more to narrow." The vendor search box shows only with more than 8 vendors. Two ticked → "Customer: 2 customers".
- [ ] Past due menu: "Any", helper line, "1-30 days", "31-60 days", "61-90 days", "91+ days". Two ticked → "Past due: 2 ranges"; all four → "Past due: 4 ranges".

### As of \[S3-R4\]

* \[ \] Opens on today at the location. The picker does not offer days after today.
* \[ \] Pick a past date → rows, totals and the Location list are as of the end of that day at the location. In DevTools → Network the requests carry `asOfDate=YYYY-MM-DD` (the picked day).
* \[ \] Edit the address to a later `asOfDate` (e.g. 2027-01-01) → the report opens on today.

### Location \[S5-R2–S5-R10, S5-R6a, S5-N1, S5-E1\]

- [ ] The Location menu lists every location with open documents in this report on the as-of date, whatever location you are signed into, named as in the top-right switcher. "Select all", "N selected", "Clear selection". All ticked → "Location: All locations".
- [ ] Untick one → rows, counts, totals, buckets and exports narrow to documents at the ticked locations. The chip names one location, or reads "N locations".
- [ ] A/P: a bill counts at its delivery's location; a vendor credit from a return at the return's; any other vendor credit at the vendor's.
- [ ] Clear selection → "Location: No locations" (grey): "No record matches these filters" with "Clear all filters", no Totals, no Location column; export → "Empty export".
- [ ] A/R Collection's list leaves out a location whose only open invoices are not yet due (Product confirmed).
- [ ] An organization with one location: no Location chip.

### As of change and ticked locations \[S5-E3\]

- [ ] Setup: 3 locations with open documents today, and an earlier date on which one of them (C) had nothing open.
- [ ] All ticked → change As of to that date → still "Location: All locations".
- [ ] Tick A and C → change As of → only A stays ticked.
- [ ] Tick only C → change As of → back to "Location: All locations".
- [ ] "No locations" → change As of → stays "No locations".
- [ ] If one location is left ticked, the Location column hides and a Location sort falls back to the opening order (SV-11532).

### Past due ranges \[S5-R16, S5-R17, S5-R18\]

* \[ \] Tick 31-60 → only invoices / bills in that range stay, plus **every** credit memo, deposit and vendor credit. The other Detail buckets keep only their credits or read "(0)".
* \[ \] Ranges use calendar days at the location: a document due exactly 31 days before the as-of date is in 31-60.
* \[ \] Summaries with ranges ticked: only customers / vendors with an amount in those ranges remain, at full balances.
* \[ \] The Totals row = the sum of the rows left, on every page and in both exports.

### Summary = Detail \[S5-R18a, S5-R18b\]

- [ ] Past due Any, same As of, customer and locations: A/R Summary Totals = A/R Detail Open Balance Totals, bucket by bucket (Current included). A/P Summary = A/P Detail likewise. Do not compare the Amount column.
- [ ] Record a payment, reload → the new figures show.

### Address and drill-down \[S5-R10, S5-R10a, S5-R11, S5-R14, S5-R19, S5-N2, S5-N3\]

* \[ \] Tick filters, then reload, press Back, or paste the link in a new tab → the same chips come back.
* \[ \] A link with `locationIds=a,b` works; an unknown location id or `pastDue=5` is ignored (All / Any). A deleted customer id next to a valid one → opens with the valid one, no error toast.
* \[ \] A/R Summary: set As of, Past due 31-60 and two locations → click a customer name → A/R Collection opens for that customer (named on the chip) with the same As of, Past due and locations. A/P Summary → A/P Unpaid likewise.
* \[ \] An old bookmark with `?customerId=` / `?vendorId=` still opens filtered to that customer / vendor.
* \[ \] Open A/R Collection from A/R Summary for a customer that is NOT among the first 50 names in the Customer list (e.g. one starting with a late letter) → the Customer chip shows the customer's name, never "Customer: 1 unavailable" (fixed in review round 2, SV-11315 SR-13).
* \[ \] Opening a report from the menu → today, All, Any, All locations.
* \[ \] A location chosen, then a customer with nothing there → empty, Location chip still visible.
* \[ \] Switch location top right while on a report → same filters and rows; sort back to the opening order; groups collapse; back to the top.

### Loading \[S8-R5\]

- [ ] Reload a report on a large organization → the loading bar shows while the filters are read; it never flashes "No record matches these filters" first.

## Known mismatches (not bugs)

* PRD S5-E3 does not mention "No locations"; the build keeps it (Product agreed, wording fix pending).
* **Follow-up:** "today" comes from the browser's time zone data. Between 00:00 and 01:00 Edmonton time, a browser with out-of-date data opens on yesterday and does not offer today in the picker. A picked date is always honoured.
* A location whose record has no organization set shows no name (kept; stricter than the old reports).

## What is NOT impacted

- [ ] Filters on other reports (Sales By Customer, Inventory Value, Work In Progress): the shared chips changed opt-in; see SV-11597.

## Dev verification

* \[x\] Tests: `useAgingReportFilters.spec.ts` (sends the picked day; a later day in a link is ignored; S5-E3), `useFilterUrlSync.spec.ts`, `useReportFilters.spec.ts`, `FilterChip.spec.ts`, `FilterOptionListPanel.spec.ts`, `FilterSearchListPanel.spec.ts`, `ValidOrganizationScopeValidatorTest` (foreign or unknown ids → 400), `DbalAgingLocationOptionsQueryRepositoryTest`, `AgingSummaryDetailParityTest` (S5-R18a), `AgingSqlTest` (calendar-day ranges).
* \[x\] Review rounds: phases 1–5 and asof-r2, all approved.
* \[x\] Walks: drill-down keeps As of, Past due and locations; p5walk 13/13; SV-12137 loading check passes; video 17/17 checks.  

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=10d8efcde884&id=2db70d76-d127-4147-a70f-2dfa1c41e837&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)



# SV-11536 — A/R and A/P Report Sorting - Story 6 - Location column
Status TESTING QA · updated 2026-11-10T06:17 · created 

## Description
(identical to the 26 Oct copy, JIRA-SV-11315-stories-2026-10-26.md, normalised text diff = 0 lines; still the PRD v9 wording)

## Comment Nemanja Djuric 2026-11-10T05:41 (updated 2026-11-10T05:51)
# QA Handoff — SV-11536 Story 6 — Location column

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** all six aging reports
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Video:** `sv-11536-location-column.mp4`

---

## What changed

Every report shows a "Location" column when more than one location is in view, on screen and in both exports. It hides with one location, and a Location sort then falls back to the opening order.

## QA Checklist (do these)

### When it shows \[S6-R1, S6-R2, S6-N1\]

- [ ] All locations ticked (organization with 2+ locations with open documents) → a "Location" column. It hides when one location is ticked — on screen, in the PDF and in the CSV.
- [ ] Position: right after the name on the Summaries; right after Date on the other four.
- [ ] Heading reads "Location" (it was "Location full name" on A/R Detail and "Location Name" on A/P Detail).

### What it shows \[S6-R3, S6-R4\]

- [ ] Summaries: the location's name when all of that customer's or vendor's open documents at the ticked locations are at one location, otherwise "Multiple".
- [ ] Other reports: each row shows its own document's location. A/P: a bill → its delivery's location; a vendor credit from a return → the return's; any other vendor credit → the vendor's.

### Sort \[S6-R5, S2-R7a\]

- [ ] First click A to Z ("Multiple" sorts as text); inside each group or bucket on the grouped reports.
- [ ] Sort by Location, then tick one location → the column hides and the sort returns to the opening order with its header marked (name column on the Summaries and Detail; Date on A/R Collection and A/P Unpaid). Exports follow. Tick a second location → the column returns; the sort stays on the opening order.
- [ ] Check on all six reports.

### Wrapping at 1440 px \[S8-R3\]

- [ ] A long location name wraps onto a second line on A/P Detail and A/P Unpaid. All nine columns stay visible without a sideways scroll.
- [ ] On A/R Summary, A/P Summary, A/R Detail and A/R Collection, Location stays on one line.

## Known mismatches (not bugs)

* PRD S8-R3 still says Location wraps only on A/P Detail; it also wraps on A/P Unpaid (Product agreed, wording fix pending).
* PRD S2-R7a mentions only narrowing the filter; the fallback happens whenever the column hides (Product agreed).
* A location whose record has no organization set shows no name in these reports (the old reports showed it). Kept on purpose: stricter, same as the other Reporting reports.

## What is NOT impacted

- [ ] Which documents each user can see (organization-wide, as before).
- [ ] The top-right location switcher.

## Dev verification

* \[x\] Tests: `agingColumns.spec.ts` (when the column shows; which reports wrap), `DbalOrganizationLocationsScopeResolverTest`, `useAgingLocationSortFallback.spec.ts`, the Summary / Detail / Unpaid report specs (header, request and export), `AgingTenantBoundaryTest` (a location outside the organization never lends its name).
* \[x\] Review rounds: phases 1–5, approved; the develop merge (2026-11-09) kept the stricter location-name rule.
* \[x\] Walks: A/P Unpaid fits at 1440 with Location wrapping; A/R Summary Location sort falls back when narrowed; video 44/44 checks.  

![](blob:https://media.staging.atl-paas.net/?type=file&localId=fb423551cf9f&id=571efe39-3573-4ef2-a68f-1a989839c7f6&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)


# SV-11537 — A/R and A/P Report Sorting - Story 7 - Document links open where they can
Status TESTING QA · updated 2026-11-10T06:17 · created 

## Description
(identical to the 26 Oct copy, JIRA-SV-11315-stories-2026-10-26.md, normalised text diff = 0 lines; still the PRD v9 wording)

## Comment Nemanja Djuric 2026-11-10T05:41 (updated 2026-11-10T05:52)
# QA Handoff — SV-11537 Story 7 — document links open where they can (fixes SV-5706)

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** all six aging reports (names on the Summaries; document numbers on the other four)
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Video:** `sv-11537-links.mp4` (also covers SV-12139)

---

## What changed

A number is a link only when the user can open it. An invoice at another enrolled location asks to switch location on the report, and Cancel leaves everything as it was. Clicking anywhere else on a row opens nothing.

## QA Checklist (do these)

### Summary name links \[S7-R1, S5-R11\]

- [ ] A/R Summary, user with Customers → View: the customer name is a link (blue, semi-bold, no underline) → A/R Collection for that customer with the same As of, Past due and locations.
- [ ] Custom role with Reports → Page Access but without Customers → View: the name is plain text.
- [ ] A/P Summary: the vendor name links for everyone → A/P Unpaid for that vendor.
- [ ] Clicking anywhere else on a row does nothing.

### A/R documents (Detail and Collection) \[S7-R2–S7-R5, S7-R10\]

- [ ] Invoice or part sale at your current location → the number is a link → a plain click opens its finance page.
- [ ] Ctrl/Cmd-click, Shift-click or middle-click → a new tab; the report stays as it was; the document page asks to switch location itself when needed.
- [ ] Invoice at another location you are enrolled in → a prompt on the report: "Switch location?" / "This work order is in {location}. Switch your active location to view it?" (part sale: "This part sale is in {location}. …"). "Cancel" on the left, "Switch location" on the right (small l), × top right.
- [ ] "Switch location" → the active location changes and the document opens.
- [ ] "Cancel" or × → nothing changes: same address, filters, sort, open groups and scroll position.
- [ ] Credit memos and deposits → plain text.

### A/P documents (Detail and Unpaid) \[S7-R6–S7-R9\]

- [ ] Bill at the current location → opens its delivery. At another location → plain text (A/P never shows the prompt).
- [ ] Vendor credit that came from a vendor return → links to that return, same rules. Any other vendor credit → plain text.

### Plain text when the user can't open it \[S7-N1, S7-N2, S7-E1\]

- [ ] Location you are not enrolled in → plain text.
- [ ] Missing permission → plain text: invoices and part sales need Invoicing & Payments → View plus Work Orders → View / Part Sales → View; bills and returns need Vendor Order Management (view or edit).
- [ ] The top-right location switcher is unchanged.

### Link look

- [ ] Links use the Work In Progress report blue, semi-bold, no underline, in light and dark mode. A long number ends in "…" and shows in full on hover; the link still works.

## Known mismatches (not bugs)

* The work order and part sale pages' **own** prompt (after a Ctrl-click into a new tab) reads "Switch Location" with a capital L. That is the app-wide button style, not changed here. The prompt on the aging reports reads "Switch location".
* Dark mode: link contrast is slightly under 4.5:1 on dark rows (the app-wide link blue).
* Seen while testing, not caused by this change: switching location (top right) while on another location's work order finance page shows a 400 "Invoice not found".

## What is NOT impacted

* \[ \] Work order, part sale, delivery and vendor return pages themselves.
* \[ \] The work order / part sale location prompt elsewhere: Cancel still returns to Work Orders with its message; dashboard tiles with `?locationId` still open the right list (SV-11597).

## Dev verification

* \[x\] Tests: `agingDocumentLinks.spec.ts`, `AgingDocumentLink.spec.ts`, `useAgingDocumentSwitch.spec.ts`, `useWorkOrderLocationResolver.spec.ts`, `AgingDocumentLinkKindTest`, `AgingCollectionReport.spec.ts` (Switch location remount; it now records the location header the page sends), `AgingDetailReport.spec.ts`.
* \[x\] Test ids: `link_arsum_party_<customerId>`, `link_apsum_party_<vendorId>`, `text_arsum_party_<customerId>`, `<prefix>_row_<documentId>_cell_id`, `text_<code>_doc_<documentId>` (plain text).
* \[x\] E2E updated: @C27260–@C27264 (aging name and document links), 11/11 locally. Switch location → finance page is one of the 4 workflows handed to QA automation.
* \[x\] Review rounds: phases 2–5, design fixes (the "Switch location" button casing), all approved.
* \[x\] Walks: local vendor credits from returns link to their return, a manually entered vendor credit is plain text; video 15/15 checks (+1 by tests).  

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=67cea636630a&id=7241b069-c519-41a5-bfef-ed2b032f593d&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)



# SV-11538 — A/R and A/P Report Sorting - Story 8 - Report descriptions and layout
Status TESTING QA · updated 2026-11-10T06:17 · created 

## Description
(identical to the 26 Oct copy, JIRA-SV-11315-stories-2026-10-26.md, normalised text diff = 0 lines; still the PRD v9 wording)

## Comment Nemanja Djuric 2026-11-10T05:47 (updated 2026-11-10T06:11)
# QA Handoff — SV-11538 Story 8 — descriptions and layout

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** all six aging reports, at 1440 px and narrower, light and dark
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Video:** `sv-11538-layout.mp4` (also covers SV-12137)

---

## What changed

Each report has an info icon with its description. At 1440 px every column fits, with the headline column pinned and bold. Loading, empty and error states use the native report look. The grouped reports' rows follow the design.

## QA Checklist (do these)

### Title row and descriptions \[S8-R1, S8-R2, S8-N1\]

* \[ \] Title, info icon (right of the title) and ⋯ Export on one line at 1440 px; the filter row below.
* \[ \] Hover, keyboard focus or a tap on the icon shows the description; moving away or **Escape** closes it — also when it was opened by hovering.
* \[ \] Descriptions, word for word:
* \[ \] ↳ A/R Summary: "Each customer’s unpaid balance as of the selected date, after unused credit memos and deposits, with a breakdown of overdue amounts."
* \[ \] ↳ A/R Detail: "Each customer’s unpaid invoices, unused credit memos and deposits as of the selected date, grouped by how overdue they are."
* \[ \] ↳ A/R Collection: "Overdue invoices, unused credit memos and deposits for each customer to help you follow up on payments. Excludes invoices that aren’t due yet."
* \[ \] ↳ A/P Summary: "Your unpaid balance with each vendor as of the selected date, after unused vendor credits, with a breakdown of overdue amounts."
* \[ \] ↳ A/P Detail: "Unpaid bills and unused vendor credits as of the selected date, grouped by how overdue they are."
* \[ \] ↳ A/P Unpaid: "Unpaid bills and unused vendor credits grouped by vendor, showing each bill’s due date and days overdue."
* \[ \] The descriptions are not in the PDF or CSV.

### Fit at 1440 px \[S8-R3\]

- [ ] Each report at 1440 px, all locations, Expand all: every column visible without a sideways scroll. Open Balance (Total on the Summaries) is pinned to the right and bold on the header, group rows, document rows, "Total for" rows and the Totals row.
- [ ] Headings, money, dates and numbers never wrap. Customer / vendor names and Transaction Type ("Vendor Credit") wrap when long. Location wraps on A/P Detail and A/P Unpaid only.
- [ ] A document number over about 15–16 characters ends in "…" and shows in full on hover. It never pushes Amount (or Vendor Name, Due Date, Past Due) under the pinned column.
- [ ] Past Due is left-aligned. A missing Due Date or Past Due reads "—".
- [ ] Narrower than 1440 px → the table scrolls sideways under the pinned column; a closed group's name and count stay visible at the left (SV-11534).

### Group rows (four grouped reports)

- [ ] Closed group: bold name and count, bold "Total", bold Amount and Open Balance. Open group: name and count only, then a "Total for <name>" row after its lines. Group rows white, lines not indented (details in SV-11534).

### Totals, loading, empty, error \[S8-R4, S8-R5, S8-R6\]

- [ ] The Totals row uses the native totals style (as on Sales By Customer).
- [ ] While loading, including the first read of the Location list: the table's loading bar, no "No record matches these filters", no "$0.00" Totals (SV-12137).
- [ ] No rows: "No record matches these filters" / "Try changing filters to widen your results." with "Clear all filters" when a customer / vendor, Past due or Location is chosen. The button keeps As of.
- [ ] Block the report request in DevTools (see the shared notes (https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616)) → "Something went wrong loading this report. Please try again." in place of the rows. A Detail bucket has its own message (SV-11534).

### Dark mode and phone width

- [ ] Dark mode: links, the pinned column, group rows, the pinned group row and the Totals row are readable.
- [ ] 375 px: the page does not break; the table scrolls sideways.

## Known mismatches (not bugs)

* PRD S8-R3 still says Location wraps only on A/P Detail; it also wraps on A/P Unpaid (Product agreed, wording fix pending).
* At 1400 px A/P Detail and A/P Unpaid are 2–4 px too wide: a tiny sideways scrollbar, Amount a few pixels under the pinned Open Balance. The PRD guarantees the fit at 1440 only.
* At 375 px a closed group's Amount covers the end of a long name (kept; no money value is cut).
* A/R Detail's columns shift about 34 px sideways when you click Expand all.
* The four grouped reports use slightly tighter cell padding at 1440 px (8 px instead of 12 px) to fit nine columns.
* Titles are unchanged and differ from the PRD names: "A/R Aging Collection" (PRD "A/R Collection"), page title "A/P Unpaid Invoices Report" (menu "A/P Unpaid Invoices").
* Dark mode link contrast is slightly under 4.5:1 (app-wide link blue).

## What is NOT impacted

- [ ] Other reports' layout. The shared info icon gained the Escape-after-hover close; check it once on Work In Progress.

## Dev verification

* \[x\] Tests: `ReportInfoIcon.spec.ts` (Escape after hover), `agingColumns.spec.ts` (alignment, wrap, group row layout), `agingCellFormat.spec.ts` ("—"), the six report specs (loading / empty / error states, warm-cache loading guards).
* \[x\] Test ids: `icon_arsum_info`, `icon_ardet_info`, `icon_arcol_info`, `icon_apsum_info`, `icon_apdet_info`, `icon_apunp_info`, `page_<code>_report`, `row_<code>_totals`, `text_<prefix>_error`.
* \[x\] Review rounds: phases 2–5, SV-12137 (sv12137-r1/r2), design fixes (design-r1/r2), S4-R7 (s4r7-r1), all approved.
* \[x\] Walks: table width = container width at 1440 on all four grouped reports; group rows checked at 1440, 1366, 1024, 800 and 375 px, light and dark (the sideways-scroll name also in Firefox and WebKit); video 90/90 checks.  

    ![](blob:https://media.staging.atl-paas.net/?type=file&localId=dac5c37c6d54&id=1c0a28df-7d78-476a-bc08-11afe55131bf&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)



# SV-11539 — A/R and A/P Report Sorting - Story 9 - A/R Collection call list
Status TESTING QA · updated 2026-11-10T06:17 · created 

## Description
(identical to the 26 Oct copy, JIRA-SV-11315-stories-2026-10-26.md, normalised text diff = 0 lines; still the PRD v9 wording)

## Comment Nemanja Djuric 2026-11-10T05:41 (updated 2026-11-10T05:52)
# QA Handoff — SV-11539 Story 9 — A/R Collection works as a call list

**QA env:** https://sv11315.qa.shopview.com · **PR:** https://github.com/ShopView/shopview/pull/4262 (branch `SV-11315-ar-ap-aging-reports`, head `8e35ee0d02`)
**Screens:** `/reports/ar-aging-collection`
**Shared notes** (roles, test data, known mismatches): https://shopview.atlassian.net/browse/SV-11315?focusedCommentId=80616
**Video:** `sv-11539-call-list.mp4`

---

## What changed

Each customer row on A/R Collection shows the phone and, for users who manage A/R and A/P data, the credit term. Both are in the exports.

## QA Checklist (do these)

### Screen \[S9-R1, S9-R2, S9-N1\]

- [ ] Each customer group row reads "Phone: …" after the bold name and count. The pinned row repeats it.
- [ ] With View and Manage AP/AR Data: "Credit term: …" (small t) too; "COD" when the customer has no term.
- [ ] A customer without a phone shows no "Phone:" label.
- [ ] Scroll the table sideways (narrower than 1440 px): the customer name and count stay at the left; Phone and Credit term slide under them.

### Permission \[S9-N2\]

- [ ] Custom role with Reports → Page Access only (no View and Manage AP/AR Data): no Credit term on screen, in the pinned row, in the PDF or in the CSV (no column at all).

### Exports \[S3-R8a, S9-R3\]

* \[ \] Download (CSV): headings "Date, …, ID, Customer, Phone, **Credit Term**, Due Date, …" — "Credit Term" with a capital T, only with the permission. Each row carries its customer's phone and term (COD when none).
* \[ \] Download (PDF): each customer line reads "Phone: … Credit term: …" (small t; it is a label, not a heading).

### The rest of the list

- [ ] Only overdue invoices (Past Due 1 or more, in calendar days at the location) plus unused credit memos and deposits. An invoice due today is not listed.
- [ ] Totals follow the Customer filter: tick one customer → the Totals row equals that customer's "Total" \[S5-R18\].

## Known mismatches (not bugs)

* Jira SV-11539's acceptance criteria say "Credit term" for the CSV column. The PRD (v10) and the build say "Credit Term". The screen and PDF keep "Credit term:".

## What is NOT impacted

- [ ] The rest of A/R Collection (groups, sort, links, 100-document windows) — see SV-11531 to SV-11537.
- [ ] Customer records themselves (phone and term are read only).

## Dev verification

* \[x\] Tests: `AgingGroupedEndpointTest` (CSV "Credit Term" only with the permission; PDF "Credit term: Net 30" / "Credit term: COD"; none without it), `AgingGroupedExportQueryHandlerTest`, `AgingCollectionReport.spec.ts`.
* \[x\] Test ids: `text_arcol_phone_<customerId>`, `text_arcol_credit_term_<customerId>`, `text_arcol_pinned_group_phone`, `text_arcol_pinned_group_credit_term`.
* \[x\] Review rounds: phases 3–5, S4-R7 (s4r7-r1), all approved.
* \[x\] Walks: A/R Collection CSV heading "Credit Term"; video 8/8 checks.  

![](blob:https://media.staging.atl-paas.net/?type=file&localId=a0508ff2f49a&id=d5f81a01-77ec-42ae-90b7-14cd09b90dda&&collection=&height=900&occurrenceKey=null&width=1440&__contextId=null&__displayType=null&__external=false&__fileMimeType=null&__fileName=null&__fileSize=null&__mediaTraceId=null&url=null)

