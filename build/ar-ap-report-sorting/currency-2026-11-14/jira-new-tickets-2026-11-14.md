# SV-12538 [Open] Reports - A/P aging: edited bills show an old Amount and Due Date, so Open Balance is above Amount
A bill edited after receiving keeps its old Amount and Due Date on the A/P aging reports, while Open Balance shows the new total.  
So Open Balance is above Amount, and Past Due is off by days.
**Steps**
1. QA sv11315 → Reports → A/P Unpaid Invoices. As of 11/11/2026, all locations.
2. Expand Stillwater Diesel Repair.
3. Compare bills 069-855902 (Staging Heavy Duty - 9919) and 055-541861 (Staging Lethbridge - 4310) with their bill pages.
**Expected**
* Amount = the bill's total.
* Due Date = the bill's due date; Past Due counted from it.
* Open Balance is never above Amount on a bill row.
**Actual**
| Bill | Report: Amount / Open Balance / Due Date / Past Due | Bill page: Total / Due Date |
| --- | --- | --- |
| 069-855902 | $4.29 / $4.31 / Jun 27 / 137 | $4.31 / Jun 28 (Past Due should be 136) |
| 055-541861 | $643.36 / $643.38 / Sep 8 / 64 | $643.38 / Sep 11 (Past Due should be 61) |
* These 2 rows are the whole +2 cents between Amount and Open Balance on the 91+ and 61-90 buckets (A/P Detail, Summary, Unpaid).
* Both bills were edited after receiving. Open Balance matches the bill; Amount and Due Date look stale.
* Same on staging.
Related: SV-12136.
[image]


# SV-12539 [TESTING STAGE] Reports - A/P aging: PDF export fails with "We couldn't export this report" at about 1,100 rows, below the 2,000-row limit
A/P Unpaid Invoices and A/P Detail fail to export a PDF for a vendor with 1,133 rows, which is below the 2,000-row PDF limit.  
The server returns a 500 after 30 to 52 seconds; the same export works for small vendors.
**Steps**
1. QA sv11315 → Reports → A/P Unpaid Invoices. As of 11/11/2026, all locations.
2. Vendor filter: Stillwater Diesel Repair (1,133 rows).
3. ⋯ → Download (PDF).
**Expected**
* The PDF downloads: the report is below the 2,000-row PDF limit (S3).
**Actual**
* After about 30 seconds the report shows "We couldn't export this report. Please try again." No file.
* A/P Detail with the same vendor fails the same way (500 after about 52 seconds).
* Small vendor (Adams Diesel Repair, 8 rows) exports fine.
* Request IDs: c6cf351e-4ae4-47d6-96b9-c0d2e05dfe6e (A/P Detail), b0e834ea-e3b8-40b7-9e25-5ea71dc822ab (A/P Unpaid).
Staging still runs the old reports, so it can't be compared there.
[image]


# SV-12540 [OBSOLETE] Aging Reports – Open Customer or Vendor Loads Every Document at Once
## Description
**What the PRD requires:**
> On A/R Collection and A/P Unpaid Invoices, an open customer or vendor shows its first 100 documents, then the next 100 as the user scrolls; its document count, its subtotals, the Totals row and the exports always cover all of its documents.
**What happens instead:**  
When a customer or vendor with **more than 100 documents** is opened, **every one of its documents appears at once**. Scrolling past the 100th document loads nothing more, because the rest are already there.
For example,
* a customer with 105 overdue invoices: all 105 are listed as soon as the group opens;
* a vendor with 105 unpaid bills: the same.
The count in brackets, the **Total for  ** row and the **Totals** row are correct, and every document is listed once. Only the **100 at a time** loading is missing.
## Steps to Reproduce
### Example 1 - A/R Aging Collection
1. Sign in to the QA site and make sure one customer has **more than 100 overdue invoices** (we used **ZZAUTOTEST OVER100 C**, 105 invoices dated Oct 1-20, 2026).
2. Open **Reports** → **A/R Aging Collection**.
3. In the **Customer** filter, tick only that customer.
4. Open the customer's group with its arrow.
    * The group row reads **ZZAUTOTEST OVER100 C (105)**.
5. Scroll down to the 100th invoice (`S11315-17714`) and on to the end.
    * Invoices 101 to 105 are already there under it; no loading row appears and nothing more loads.
[image]
### Example 2 - A/P Unpaid Invoices
1. Make sure one vendor has **more than 100 unpaid bills** (we used **ZZAUTOTEST OVER100 V**, 105 bills).
2. Open **Reports** → **A/P Unpaid Invoices**; in the **Vendor** filter, tick only that vendor.
3. Open the vendor's group and scroll to the 100th bill (`ZZO100-099`) and on to the end.
    * Bills 101 to 105 are already there; nothing more loads.
[image]
**Actual Result:**
* The open group shows **all of its documents at once** (105 of 105).
* Scrolling past the 100th document loads nothing, because nothing is left to load.
**Expected Result:**
* The open group shows its **first 100 documents**.
* The next documents load under them **as the user scrolls**, up to 100 more each time.
* The count, the **Total for  ** row, the **Totals** row and the exports still cover all of the group's documents.
## Environment
* QA site: [https://sv11315.qa.shopview.com](https://sv11315.qa.shopview.com) (build **v26.45.2-6a8b89c**), location **Staging Heavy Duty - 9919**, Admin role, observed 10-11 Nov 2026.
* Reports: [A/R Aging Collection](https://sv11315.qa.shopview.com/reports/ar-aging-collection) with **ZZAUTOTEST OVER100 C** ticked · [A/P Unpaid Invoices](https://sv11315.qa.shopview.com/reports/ap-unpaid-invoices) with **ZZAUTOTEST OVER100 V** ticked.
## Sources
* PRD **"A/R and A/P Report Sorting, Export and Location Filter"**, [Confluence page 947650561](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=947650561), **version 11** (5 Nov 2026, Chris Ward), read 10 Nov 2026, **S1-R8**:
    On A/R Collection and A/P Unpaid Invoices, an open customer or vendor shows its first 100 documents, then the next 100 as the user scrolls; its document count, its subtotals, the Totals row and the exports always cover all of its documents.
* The same PRD's change log, 2026-11-04 (Chris Ward): "S1-R8: documents inside an open customer or vendor load 100 at a time."
## Test case
* [C1062570 A/R Collection: a customer with over 100 documents loads 100 at a time](https://shopview.testrail.io/index.php?/cases/view/1062570)
* [C1062571 A/P Unpaid Invoices: a vendor with over 100 bills loads 100 at a time](https://shopview.testrail.io/index.php?/cases/view/1062571)


# SV-12544 [Done] Aging Reports – A/R Aging Detail PDF Prints Dates as "Apr 6, 2026" Instead of "Apr 06 2026"
## Description
**What the PRD requires:**
> The PDF uses the app-wide report PDF format, the same as Sales By Customer and Inventory Value: a negative amount prints in brackets with a minus sign, for example "(-$11,111.00)", and dates print as "Nov 04 2026". On screen a negative amount reads "$-11,111.00", as today.
**What happens instead:**
On the QA branch, the A/R aging PDFs print every date with a comma and without the leading zero, for example **"Apr 6, 2026"** instead of **"Apr 06 2026"**. The negative amounts are already right, for example **"(-$5.00)"**. Only the dates are wrong.
For example,
* **A/R Aging Detail** PDF: invoice **S3-14144** reads **"Apr 6, 2026"**, due **"May 6, 2026"**; credit memo **CM11315-4209** reads **"Oct 26, 2026"**.
* **A/R Aging Collection** PDF: invoice **S11315-17846** reads **"Oct 27, 2026"**.
* On the same site, the **Sales By Customer** PDF already prints **"Nov 10 2026"**, the form the PRD asks for.
## QA branch vs production
| What you check | QA branch (new version, v26.45.2-6a8b89c) | Production today (v26.45.3-f5ba431) |
| --- | --- | --- |
| Dates in the **A/R Aging Detail** PDF / print | ❌ "Apr 6, 2026", "Oct 26, 2026" | "Dec 8, 2025" — the older form (production has not had this change yet) |
| Dates in the **A/R Aging Collection** PDF / print | ❌ "Oct 27, 2026" | "Dec 8, 2025" — the older form |
| Negative amounts in the A/R PDFs | ✅ "(-$5.00)", as the PRD asks | "$-12,011.08" — the older form |
| Dates in the **Sales By Customer** PDF | ✅ "Nov 10 2026" | ✅ "Nov 02 2026" |
What this shows: the PRD moves the aging PDFs to the date form that production's other report PDFs (Sales By Customer) already use. The QA branch changed the negative amounts but not the dates.
Production pictures (the QA branch pictures are under the steps below):
[image]Production — A/R Aging Detail print: dates read "Dec 8, 2025" (captured 10 Nov 2026)
[image]Production — Sales By Customer PDF (Expanded View): dates already read "Nov 02 2026" (captured 10 Nov 2026)
## Steps to Reproduce
### Example 1 - A/R Aging Detail
1. Sign in to the QA site as an Admin user at **Staging Heavy Duty - 9919**.
2. Open **Reports** → **A/R Aging Detail**. Leave every filter as it opens: **As of: 11/11/2026**, **Customer: All customers**, **Past due: Any**, **Location: All locations**. No test data needs to be created; any open document shows it.
3. Click **⋯** at the top right → **Download (PDF)**.
4. Open the PDF and read the **Date** and **Due Date** columns.
    * Invoice **S3-14144** (Apollo Beach Truck & Equipment Repair) reads **"Apr 6, 2026"**, due **"May 6, 2026"**.
    * Credit memo **CM11315-4209** (ZZAUTOTEST AR R42 Memo Line, page 16) reads **"Oct 26, 2026"**; its amount reads **"(-$5.00)"**, which is right.
[image]QA branch — A/R Aging Detail PDF, page 16: dates print "Oct 26, 2026"; the amount "(-$5.00)" is right
### Example 2 - A/R Aging Collection
1. Open **Reports** → **A/R Aging Collection**; in the **Customer** filter tick only **ZZAUTOTEST AR R36 Collect X**.
2. Click **⋯** → **Download (PDF)** and open the PDF.
    * Invoice **S11315-17846** reads **"Oct 27, 2026"**, due **"Oct 27, 2026"**.
### For comparison - Sales By Customer on the same QA site
1. Open **Sales By Customer** → **⋯** → **Download Expanded View (PDF)**.
    * Its dates read **"Nov 10 2026"**, **"Nov 06 2026"**.
[image]QA branch — Sales By Customer PDF: dates already print "Nov 10 2026"
**Actual Result:**
* Dates in the A/R aging PDFs read like "Apr 6, 2026": a comma, and no leading zero on the day.
* All 591 dated lines of the A/R Aging Detail PDF read this way (seen in two separate downloads).
**Expected Result:**
* Dates print like "Nov 04 2026", as the PRD says: invoice S3-14144 reads **"Apr 06 2026"**, due **"May 06 2026"**.
* The same form as the Sales By Customer PDF.
## Environment
* QA site: [https://sv11315.qa.shopview.com](https://sv11315.qa.shopview.com) (build **v26.45.2-6a8b89c**), location **Staging Heavy Duty - 9919**, Admin role. First seen on 11 Nov 2026 at 12:10 UTC; seen again at 12:55 and 12:56 UTC.
* Production: [https://app.shopview.com](https://app.shopview.com), production test account, Admin role. A/R Aging Collection print seen on 11 Nov 2026 at 12:30 UTC (build v26.45.3-f5ba431). The A/R Aging Detail print and the Sales By Customer PDF pictures were taken on 10 Nov 2026 (build v26.45.3-fc08f23); the redeploy to f5ba431 on 11 Nov did not change these reports.
* Checked: the A/R Aging Detail and A/R Aging Collection PDFs. Not checked: the A/P Aging Detail and A/P Unpaid Invoices PDFs.
## Sources
| Document | What it says | Intended by the PRD? |
| --- | --- | --- |
| PRD "A/R and A/P Report Sorting, Export and Location Filter", [Confluence page 947650561](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=947650561), version 11 (5 Nov 2026, Chris Ward), S3-R7a | "The PDF uses the app-wide report PDF format, the same as Sales By Customer and Inventory Value: a negative amount prints in brackets with a minus sign, for example "(-$11,111.00)", and dates print as "Nov 04 2026". On screen a negative amount reads "$-11,111.00", as today." | **Yes** — the PRD asks for dates like "Nov 04 2026" |
| The same PRD's change log, 5 Nov 2026 | "S3-R7a added (PDF negative amounts and dates, app-wide format)." | — |
| Developers' QA handoff (SV-11533, corrected again 11 Nov 2026) | Agrees with the PRD: "PRD v11 (S3-R7a) wants PDF dates as "Nov 04 2026" … Until SV-12544 is fixed, the PDF prints "Nov 4, 2026"." | Yes |
| Production v26.45.3 (the version before this release) | The A/R aging prints use the older form ("Dec 8, 2025"); the Sales By Customer PDF already prints "Nov 02 2026". | — |
**The QA branch does not do what the PRD asks.** The PRD (version 11, S3-R7a) asks the aging PDFs to print dates like "Nov 04 2026", the same as Sales By Customer. Production's own Sales By Customer PDF already prints that form ("Nov 02 2026"); the QA branch's A/R aging PDFs still print "Apr 6, 2026".
## Test case
* [C1095436 Planned change: PDF negatives in brackets, dates as Nov 04 2026](https://shopview.testrail.io/index.php?/cases/view/1095436)
[image]
[image]
[image]


# SV-12545 [Merged to Staging] Aging Reports – An As-of Date After Today Can No Longer Be Picked or Opened From a Saved Link
## Description
**What the PRD requires:**
The PRD **does not ask for this change**. No requirement in the PRD limits the as-of date to today. The limit appears only in the developers' technical plan (21 Oct 2026, decision D20).
**What happens instead:**
On the QA branch, a date **after today** can no longer be used on the aging reports. Production allows it today.
For example,
* On **A/R Aging Summary**, every day after today is greyed out in the date menu and the next-month arrow does nothing, so **31 Dec 2026** cannot be picked. The chip stays on **As of: 11/11/2026**.
* A saved link to **A/P Aging Summary** that ends with `?asOfDate=2026-12-31` opens on **today**, and the date disappears from the address.
## QA branch vs production
| What you check | QA branch (new version, v26.45.2-6a8b89c) | Production today (v26.45.3-f5ba431) |
| --- | --- | --- |
| Pick 31 Dec 2026 in the date menu of **A/R Aging Summary** | ❌ Not possible. Every day after 11/11/2026 is greyed out; the next-month arrow does nothing. The chip stays **As of: 11/11/2026**. | ✅ Possible. The chip reads **Date: 2026-12-31** and the figures are worked out for that day (customer **aqeel transport 56**: $1,229.93 under Current today, nothing under Current on 31 Dec). |
| Open the saved link `.../reports/ap-aging-summary?asOfDate=2026-12-31` | ❌ Opens on today, **As of: 11/11/2026**; the date is dropped from the address. | ✅ Opens on **Date: 2026-12-31**, with figures different from today's. |
| Name of the date chip | "As of" (renamed on purpose by the PRD) | "Date" |
Production pictures (the QA branch pictures are under the steps below):
[image]Production — A/R Aging Summary with 31 Dec 2026 picked (11 Nov 2026, 12:10 UTC)
[image]Production — A/P Aging Summary opened from the link with ?asOfDate=2026-12-31 (11 Nov 2026, 12:10 UTC)
## Steps to Reproduce
### Example 1 - A/R Aging Summary (picking a later date)
1. Sign in to the QA site as an Admin user at **Staging Heavy Duty - 9919**.
2. Open **Reports** → **A/R Aging Summary**.
3. Click the **As of** chip, try to move to next month and pick **31 Dec 2026**.
    * Every day after today is greyed out and the next-month arrow does nothing.
    * The chip stays **As of: 11/11/2026**.
[image]QA branch — the date menu on 11 Nov 2026: days after today are greyed out
### Example 2 - A/P Aging Summary (a saved link)
1. Open [https://sv11315.qa.shopview.com/reports/ap-aging-summary?asOfDate=2026-12-31](https://sv11315.qa.shopview.com/reports/ap-aging-summary?asOfDate=2026-12-31).
    * The chip shows **As of: 11/11/2026** (today).
    * The address no longer has the date.
[image]QA branch — the saved link opens on today, not on 31 Dec 2026
**Actual Result:**
* No date after today can be picked.
* A saved link with a later date opens on today.
**Expected Result:**
* As on production today: a date after today can be picked on all six aging reports, and the report is worked out for that date.
* A saved link with a later date opens on that date.
## Environment
* QA site: [https://sv11315.qa.shopview.com](https://sv11315.qa.shopview.com) (build **v26.45.2-6a8b89c**), location **Staging Heavy Duty - 9919**, Admin role. Seen on 11 Nov 2026 at 11:29 UTC and again at 13:04 and 13:05 UTC.
* Production: [https://app.shopview.com](https://app.shopview.com) (build **v26.45.3-f5ba431**), production test account, location **Truck Hill 1**, Admin role. Seen on 11 Nov 2026 at 12:10 UTC.
## Sources
| Document | What it says | Intended by the PRD? |
| --- | --- | --- |
| PRD "A/R and A/P Report Sorting, Export and Location Filter", [Confluence page 947650561](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=947650561), version 11 (5 Nov 2026) | Says nothing about limiting the as-of date to today. | **No** |
| Technical plan (21 Oct 2026), decision D20 | Limits the as-of date to today. A technical plan does not change what the PRD asks for. | — |
| Production v26.45.3 (the version before this release) | A date after today can be picked, and a saved link with a later date opens on it. | — |
**No — the PRD does not ask for this change.** Since what the QA branch does is not intended by the PRD, it should work exactly as it works on production today.
Note: Asked Chris Ward the question (question 19 on the A/R and A/P question sheet, 11 Nov 2026) - who is on vacation these days.
## Test case
* [C1078980 A future as-of date can be picked to see coming aging](https://shopview.testrail.io/index.php?/cases/view/1078980)
* [C1078981 A saved link with a future as-of date opens on that date](https://shopview.testrail.io/index.php?/cases/view/1078981)
* Production v26.45.3 (commit fc08f23): the date filter sets no latest date (AgingSummaryReport.vue:191-201); the A/P fetchers handle a later date on purpose (DbalApAgingSummaryFetcher.php:37-43).
* New version (branch SV-11315-ar-ap-aging-reports at 8e35ee0d02): the picker stops at today (useAgingReportFilters.ts:554); a later date in a link is ignored (useAgingReportFilters.ts:145-146); the server caps the date at now (AgingAsOfDto.php:14-15).
[image]
[image]
[image]
[image]


# SV-12546 [OBSOLETE] Aging Reports – A/R Aging Detail PDF Leaves Out Empty Buckets and Their $0.00 Total Lines
## Description
**What the PRD requires:**
The PRD **does not ask for this change**. It does not say that an empty bucket should be left out of the A/R Aging Detail PDF.
**What happens instead:**
On the QA branch, the **A/R Aging Detail** PDF prints only the buckets that hold a document. An empty bucket, its heading and its total line are left out, although the screen still shows that bucket with **(0)**. Production prints every bucket.
For example,
* With only **ZZAUTOTEST AR R13 Payment After** ticked, the screen shows all five buckets, including **61-90 days past due (0)**.
* The PDF prints only **31-60 days past due**. 91 or more, 61-90, 1-30 days past due and Current are missing.
## QA branch vs production
| What you check | QA branch (new version, v26.45.2-6a8b89c) | Production today (v26.45.3-f5ba431) |
| --- | --- | --- |
| Empty bucket on the screen | ✅ Shown, for example **61-90 days past due (0)**, Total $0.00 $0.00 | ✅ Shown, for example **91 or more days past due (0)** |
| Empty bucket in the PDF / print | ❌ Left out, with its total line | ✅ Printed with its heading and **"Total for ... days past due $0.00"** |
| Buckets on paper | ❌ Only the buckets that hold a document (here: 31-60 days past due) | ✅ All five, in fixed order: 91 or more, 61-90, 31-60, 1-30 days past due, Current |
Production picture (the QA branch pictures are under the steps below):
[image]Production — A/R Aging Detail print on Date 2025-07-01, a day when every bucket is empty: all five buckets are printed with $0.00 (11 Nov 2026, 12:14 UTC)
## Steps to Reproduce
### Example 1 - A/R Aging Detail
1. Sign in to the QA site as an Admin user at **Staging Heavy Duty - 9919**.
2. Open **Reports** → **A/R Aging Detail**, **As of: 11/11/2026**.
3. In the **Customer** filter, tick only **ZZAUTOTEST AR R13 Payment After** (one invoice, **S11315-17834**, dated Oct 10, 2026, $100.00 with $60.00 open).
    * The screen shows all five buckets; **61-90 days past due (0)** is one of the empty ones.
[image]QA branch — the screen shows the empty bucket "61-90 days past due (0)"
4. Click **⋯** → **Download (PDF)** and open the PDF.
    * Only **31-60 days past due** is printed, then the Totals row.
    * 91 or more, 61-90, 1-30 days past due and Current are not in the PDF at all.
[image]QA branch — the PDF prints only the bucket that holds a document
**Actual Result:**
* The A/R Aging Detail PDF leaves out every empty bucket and its $0.00 total line.
**Expected Result:**
* As on production today: the PDF prints all five buckets in their fixed order.
* An empty bucket prints its heading and its total line with $0.00.
## Environment
* QA site: [https://sv11315.qa.shopview.com](https://sv11315.qa.shopview.com) (build **v26.45.2-6a8b89c**), location **Staging Heavy Duty - 9919**, Admin role. Seen on 11 Nov 2026 at 12:14 UTC and again at 13:04 and 13:05 UTC.
* Production: [https://app.shopview.com](https://app.shopview.com) (build **v26.45.3-f5ba431**), production test account, Admin role. Seen on 11 Nov 2026 at 12:14 UTC.
## Sources
| Document | What it says | Intended by the PRD? |
| --- | --- | --- |
| PRD "A/R and A/P Report Sorting, Export and Location Filter", [Confluence page 947650561](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=947650561), version 11 (5 Nov 2026), Story 3 (Export) | Says nothing about leaving empty buckets out of the PDF. | **No** |
| Production v26.45.3 (the version before this release) | The print shows all five buckets; an empty one prints "Total for ... days past due $0.00". | — |
**No — the PRD does not ask for this change.** Since what the QA branch does is not intended by the PRD, it should work exactly as it works on production today.
Note: the Product Owner has been asked to confirm (question 20 on the A/R and A/P question sheet, 11 Nov 2026, not answered yet).
## Test case
* [C1079008 A/R Detail PDF prints an empty bucket with its $0.00 total](https://shopview.testrail.io/index.php?/cases/view/1079008)
* Production v26.45.3 (commit fc08f23): the PDF builds all five buckets, empty ones with $0.00 (AgingDetailPdfQueryHandler.php:81-110).
* New version (branch SV-11315-ar-ap-aging-reports at 8e35ee0d02): the export prints only buckets that hold a document (AgingDetailExportQueryHandler.php:7).
[image]
[image]
[image]


# SV-12547 [Done] Aging Reports – A/R PDFs Print "Subtotal" Instead of "Total for <Customer or Bucket>"
## Description
**What the PRD requires:**
The PRD **does not ask for this change**. It says the PDF uses the app-wide report PDF format (S3-R7a), but it says nothing about the customer or bucket total lines.
**What happens instead:**
On the QA branch, the A/R PDFs close each customer or bucket with a line that reads only **"Subtotal"**. Production, and the QA branch's own screen, read **"Total for  "**. The amounts on the line are right; only the name is lost.
For example,
* **A/R Aging Collection** PDF: **"Subtotal $110.00 $110.00"** instead of "Total for ZZAUTOTEST AR R36 Collect X".
* **A/R Aging Detail** PDF: **"Subtotal $100.00 $60.00"** instead of "Total for 31-60 days past due".
## QA branch vs production
| What you check | QA branch (new version, v26.45.2-6a8b89c) | Production today (v26.45.3-f5ba431) |
| --- | --- | --- |
| Line closing a customer in the **A/R Aging Collection** PDF / print | ❌ "Subtotal $110.00 $110.00" | ✅ "Total for aqeel transport 56 $-12,011.08 $-15,012.08" |
| Line closing a bucket in the **A/R Aging Detail** PDF / print | ❌ "Subtotal $100.00 $60.00" | ✅ "Total for 31-60 days past due $0.00 $0.00" |
| The same lines on the QA branch's screen | ✅ "Total for ..." (for example "Total for 1-30 days past due") | ✅ "Total for ..." |
Production pictures (the QA branch pictures are under the steps below):
[image]Production — A/R Aging Collection print for aqeel transport 56: the block ends with "Total for aqeel transport 56" (11 Nov 2026, 12:30 UTC)
[image]Production — A/R Aging Detail print: each bucket ends with "Total for  " (11 Nov 2026, 12:14 UTC)
## Steps to Reproduce
### Example 1 - A/R Aging Collection
1. Sign in to the QA site as an Admin user at **Staging Heavy Duty - 9919**.
2. Open **Reports** → **A/R Aging Collection**, **As of: 11/11/2026**.
3. In the **Customer** filter, tick only **ZZAUTOTEST AR R36 Collect X** (one invoice, **S11315-17846**, $110.00).
4. Click **⋯** → **Download (PDF)** and open the PDF.
    * Under the customer's invoice the line reads **"Subtotal $110.00 $110.00"**.
    * There is no "Total for ZZAUTOTEST AR R36 Collect X" line.
[image]QA branch — A/R Aging Collection PDF: the customer's line reads "Subtotal"
### Example 2 - A/R Aging Detail
1. Open **Reports** → **A/R Aging Detail**, **As of: 11/11/2026**; in the **Customer** filter tick only **ZZAUTOTEST AR R13 Payment After**.
2. Click **⋯** → **Download (PDF)** and open the PDF.
    * Under the **31-60 days past due** bucket the line reads **"Subtotal $100.00 $60.00"**.
    * There is no "Total for 31-60 days past due" line.
[image]QA branch — A/R Aging Detail PDF: the bucket's line reads "Subtotal"
**Actual Result:**
* The customer and bucket total lines in the A/R PDFs read "Subtotal".
**Expected Result:**
* As on production today and as on the QA branch's own screen: "Total for  " on A/R Aging Collection.
* "Total for  " on A/R Aging Detail.
## Environment
* QA site: [https://sv11315.qa.shopview.com](https://sv11315.qa.shopview.com) (build **v26.45.2-6a8b89c**), location **Staging Heavy Duty - 9919**, Admin role. Seen on 11 Nov 2026 at 12:14 UTC and again at 13:04 and 13:05 UTC.
* Production: [https://app.shopview.com](https://app.shopview.com) (build **v26.45.3-f5ba431**), production test account, Admin role. Seen on 11 Nov 2026 at 12:14 and 12:30 UTC.
## Sources
| Document | What it says | Intended by the PRD? |
| --- | --- | --- |
| PRD "A/R and A/P Report Sorting, Export and Location Filter", [Confluence page 947650561](https://shopview.atlassian.net/wiki/pages/viewpage.action?pageId=947650561), version 11 (5 Nov 2026), S3-R7a | "The PDF uses the app-wide report PDF format, the same as Sales By Customer and Inventory Value: ..." — it says nothing about the customer or bucket total lines. | **No** |
| Developers' QA handoff (SV-11533, edited 11 Nov 2026) | Calls the new PDF wording intended. The PRD does not say so — a Product decision is needed. | — |
| Production v26.45.3 (the version before this release) | The prints close each customer and bucket with "Total for  ". | — |
**No — the PRD does not ask for this change.** Since what the QA branch does is not intended by the PRD, it should work exactly as it works on production today.
Note: Asked Chris Ward the question (question 21 on the A/R and A/P question sheet, 11 Nov 2026) - who is on vacation these days.
## Test case
* [C1079009 A/R Collection PDF prints only the customer you picked](https://shopview.testrail.io/index.php?/cases/view/1079009)
[image]
[image]


# SV-12554 [OBSOLETE] Aging Reports – Back button leaves the report instead of undoing the last filter change
Filter changes on the aging reports replace the page address instead of adding a history entry.  
Back skips every filter state and returns to the previous page.
**Env:** sv11315 (QA), 11 Nov 2026. Seen on A/R Aging Collection and A/R Aging Summary.
**Steps**
1. Open A/P Unpaid Invoices, then open A/R Aging Collection.
2. Location menu: untick Staging Lethbridge - 4310 and ZZAUTOTEST V1R-87 Location C. Chip shows "Location: Staging Heavy D...", the address has locationIds=.
3. In the Location menu, click "Select all". Chip shows "Location: All locations".
4. Click the browser's Back button.
**Expected**
The report shows only Staging Heavy Duty ticked again (TMS C715393, S5).  
Same on A/R Aging Summary for customers and Past due: after ticking "91+ days" and then unticking it, Back brings "91+ days" back (TMS C715397).
**Actual**
Back leaves A/R Aging Collection and opens A/P Unpaid Invoices (the page before). No earlier filter state can be reached with Back.  
Same on A/R Aging Summary: after ticking "91+ days", Back goes to the previous page.
Reload and a shared link keep the filters correctly; only Back is affected.

# SV-12563 [OBSOLETE] A/R Collection CSV – credit term column header reads "Credit Term" instead of "Credit term"
The A/R Collection CSV labels the credit term column "Credit Term".  
PRD S3-R8a and the on-screen label use "Credit term".
**Env:** sv11315, Admin, 11 Nov 2026 · TMS R7 C715447
**Steps**
1. Reports > A/R Aging Collection
2. Tick customer Andrews' Truck & Trailer Repair LLC
3. ⋯ > Download (CSV)
4. Read the heading row
**Expected**
`...,Customer,Phone,"Credit term",...`
PRD S3-R8a: every CSV row carries the customer's "Phone" and "Credit term" in columns right after "Customer".
**Actual**
`...,Customer,Phone,"Credit Term",...`
Values are correct (343-203-3967, Net 30). The PDF line and the on-screen group row are correct ("Credit term: Net 30").

# SV-12663 [Ready for Production] Aging Reports – Past Due Counted From a Different Day Than the Due Date Shown
## Description
**What the PRD requires:**
> A document is Current when its due date is on or after the as-of date. Its Past Due, where the report shows one, is the number of days from the due date to the as-of date: negative while the document is not yet due (a bill due 9 days after the as-of date reads -9, as today) and 0 on its due date.
**What happens instead:**  
The aging column and the **Past Due** of a document are counted from a **different day** than the **Due Date** the report shows. The reports count the days in the time zone of the location the user is signed in at, but show **Date** and **Due Date** as the day in Greenwich time (UTC). So any document whose time of day falls on a different calendar day in those two zones is counted one day off from its own Due Date on screen.
For example, signed in at a location on Pakistan time, as of Nov 12, 2026:
* an invoice showing Due Date **Sep 12, 2026** (61 days earlier) sits under **31-60 days past due**;
* an invoice showing Due Date **Nov 11, 2026** sits under **Current**, although it is a day past due;
* a bill showing Due Date **Nov 1, 2026** reads Past Due **10**, although it is 11 days late.
The same documents were in the column that matches their Due Date before this release. Compared with the reports saved on staging the same morning (before the release, same as-of date), 18 A/R documents moved one column younger and 1,255 A/P bills show a Past Due one day different. All amounts and all other rows are unchanged.
## Steps to Reproduce
1. Sign in to staging at **Staging Heavy Duty - 9919** (Time zone: Asia/Karachi). Open **Reports** → **A/R Aging Detail**, **As of** today.
2. In **Customer:** tick only **Tucson Truck Center** and open **31-60 days past due**.
    * **Actual Result:** invoice **S3-17147** shows Due Date **Sep 12, 2026** under **31-60 days past due**.
    * **Expected Result:** Sep 12 is 61 days before Nov 12, so S3-17147 is under **61-90 days past due**.
3. Open **A/R Aging Collection**, tick only **Tucson Truck Center** and open the customer.
    * **Actual Result:** S3-17147 shows Due Date **Sep 12, 2026** and Past Due **60**.
    * **Expected Result:** Past Due **61**.
4. Open **A/P Aging Detail**, tick only vendor **ZZSOFTHIP Traders** and open **1-30 days past due**.
    * **Actual Result:** bill **ZZSH-O_TYPO** shows Due Date **Nov 1, 2026** and Past Due **10**.
    * **Expected Result:** Past Due **11**.
## Screenshots
[image]
[image]
## Environment
Staging [https://app.staging.shopview.com](https://app.staging.shopview.com) (build v26.45.4-b8c04e2), signed in at **Staging Heavy Duty - 9919** (Asia/Karachi), as of Nov 12, 2026.  
Records: [A/R Aging Detail](https://app.staging.shopview.com/reports/ar-aging-detail) · [A/R Aging Collection](https://app.staging.shopview.com/reports/ar-aging-collection) · [A/P Aging Detail](https://app.staging.shopview.com/reports/ap-aging-detail)
## Sources
* **PRD "A/R and A/P Report Sorting, Export and Location Filter"** (Confluence page 947650561, version 12, 12 Nov 2026), [link](https://shopview.atlassian.net/wiki/spaces/~/pages/947650561), **S1-R5a**:
    A document is Current when its due date is on or after the as-of date. Its Past Due, where the report shows one, is the number of days from the due date to the as-of date: negative while the document is not yet due (a bill due 9 days after the as-of date reads -9, as today) and 0 on its due date. A credit memo, deposit or vendor credit counts its own date as its due date, so one dated exactly on the as-of date is in Current with Past Due 0, not in "1-30 days past due". This is how QuickBooks ages them (https://shopview.atlassian.net/browse/SV-11441#icft=SV-11441).
* Same PRD, **What changes for existing users**:
    Which rows and amounts each user can see is unchanged: an untouched report shows exactly today's organization-wide numbers (apart from the Totals rows noted above), and the reports show money exactly as they do today.
## Test case
[https://shopview.testrail.io/index.php?/cases/view/715471](https://shopview.testrail.io/index.php?/cases/view/715471) · [https://shopview.testrail.io/index.php?/cases/view/715472](https://shopview.testrail.io/index.php?/cases/view/715472)

# SV-12723 [Ready for Production] Reports - A/R Aging Summary: empty bucket cells sort as $0 instead of going to the bottom
On A/R Aging Summary (staging v26.45.4-ba2d645, Admin, Staging Heavy Duty), sorting a money column treats an empty cell as $0, so empty rows land between negatives and positives.  
PRD S2-R6: blanks go to the bottom in both directions (S3-R8: an empty bucket is a blank cell). Prod can't sort these columns, so this is new.
**Steps**
1. Reports → A/R Aging Summary, As of 11/13/2026, Location: All locations.
2. Click the "1-30 Days" header (largest first).
3. Scroll to the bottom of the list.
4. Click "1-30 Days" again (smallest first) and scroll from the top.
**Expected**
Customers with an empty 1-30 Days cell are listed last in both directions.
**Actual**
* Largest first: positives, then the empty-cell customers, then the 8 negatives at the very bottom ($-3.00 … ZZAUTOTEST AR R18 $-50.00, A & J Truck & Trailer Repair $-67.48, ZZAUTOTEST AR R90 $-101.00).
* Smallest first: negatives ($-101.00 first), then the empty-cell customers (10 Trucking, 2 Trucking, A-1 Towing, a1 towing…), then positives.
* Same on Current and 31-60 Days.
**Evidence**
F2_ar_summary_empty_bucket_sorts_as_zero.mp4 (attached)

