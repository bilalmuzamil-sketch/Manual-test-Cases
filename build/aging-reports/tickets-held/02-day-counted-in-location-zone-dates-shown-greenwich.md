# FILED 12 Nov 2026 as SV-12663 (https://shopview.atlassian.net/browse/SV-12663) — final text in defects/08-past-due-counted-from-a-different-day/description.wiki

(earlier held draft below, kept for the record)

**Type** Story Defect · **Parent** SV-11531 (Story 1 — Reports open in QuickBooks name order; Merged to Staging, read 12 Nov 2026) · **relates to** SV-11441 (credit dated on the as-of day; Merged to Staging) · **Priority** Medium · **Label** AP-AR-FM

**Title:** Aging Reports – Past Due and Aging Column Are Counted From a Different Day Than the Due Date Shown

## Description
**What the PRD requires:** a document is Current when its due date is on or after the as-of date, and its Past Due is the number of days from the due date to the as-of date (S1-R5a). An untouched report shows exactly today's numbers (What changes for existing users).

**What happens instead:** the Due Date on screen and the day the report counts from are not the same day. The report counts each document's day in the **signed-in location's time zone**, but shows Date and Due Date as the **Greenwich (UTC) day**. Any document whose time of day falls on a different calendar day in those two zones is counted one day off from the Due Date it shows.

For example, on staging, signed in at a location on Pakistan time, as of Nov 12, 2026:
* an invoice shown with Due Date *Sep 12, 2026* sits under *31-60 days past due* with Past Due *60* — Sep 12 to Nov 12 is 61 days;
* an invoice shown with Due Date *Nov 11, 2026* sits under *Current* — it is a day past due;
* a bill shown with Due Date *Nov 1, 2026* reads Past Due *10* — it is 11.

The documents at a location in another time zone are counted on the **viewer's** location's day, not their own (an invoice made at 12:01 pm on Nov 11 at a Mountain-time location is counted as Nov 12).

Against the reports before the release (same data, same as-of date), 18 A/R documents moved one column younger and 1,255 A/P bills read a Past Due one day different. Amounts and documents are otherwise unchanged.

## Steps to Reproduce
# Sign in to staging at *Staging Heavy Duty - 9919* (time zone Asia/Karachi). Open *Reports* → *A/R Aging Detail*, *As of* today (11/12/2026).
# In *Customer:* tick only *Tucson Truck Center*; open *31-60 days past due*.
#* *Actual Result:* S3-17147 shows Due Date *Sep 12, 2026* under *31-60 days past due*.
#* *Expected Result:* Sep 12 is 61 days before Nov 12, so it is under *61-90 days past due* (where it was before the release).
# Open *A/R Aging Collection*, tick *Tucson Truck Center*, open the customer.
#* *Actual Result:* S3-17147: Due Date *Sep 12, 2026*, Past Due *60*.
#* *Expected Result:* Past Due *61*.
# Open *A/P Aging Detail*, tick vendor *ZZSOFTHIP Traders*, open *1-30 days past due*.
#* *Actual Result:* ZZSH-O_TYPO: Due Date *Nov 1, 2026*, Past Due *10*.
#* *Expected Result:* Past Due *11*.

## Screenshots
(attach composed old-vs-new, annotated: before-release screen with S3-17147 under 61-90 vs now under 31-60; A/P Detail ZZSH-O_TYPO; banner says what you are looking at)

## Environment

Staging https://app.staging.shopview.com (build v26.45.4-b8c04e2), location *Staging Heavy Duty - 9919* (Asia/Karachi). Records: https://app.staging.shopview.com/reports/ar-aging-detail · https://app.staging.shopview.com/reports/ar-aging-collection · https://app.staging.shopview.com/reports/ap-aging-detail

## Sources
* PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026), **S1-R5a**: "A document is Current when its due date is on or after the as-of date. Its Past Due, where the report shows one, is the number of days from the due date to the as-of date: negative while the document is not yet due (a bill due 9 days after the as-of date reads -9, as today) and 0 on its due date."
* Same PRD, **What changes for existing users**: "Which rows and amounts each user can see is unchanged: an untouched report shows exactly today's organization-wide numbers (apart from the Totals rows noted above), and the reports show money exactly as they do today."
* SV-11441 developer handoff (10 Nov 2026): "All Past Due values are calendar days at the location." / "The count is in calendar days at the location: a document due late in the evening counts on that evening's date."

## Test case
https://shopview.testrail.io/index.php?/cases/view/715471 · https://shopview.testrail.io/index.php?/cases/view/715472

---
## Rule 140 genuineness gate (internal — not part of the ticket)
| Check | Evidence | State |
|---|---|---|
| Latest source says it | PRD v11 read 10 Nov (S1-R5a + invariance quoted above). **Not re-read today** — re-read before filing (106/140). | OPEN until re-read |
| Not accepted as built | SV-11441 handoff says "calendar days at the location"; the build uses the VIEWER's location for every document and shows the Greenwich day — neither matches that. No comment accepting it. | closed |
| Not our setup / QA site | Display = Greenwich day proved on 3 locations (Karachi, Edmonton, Fiji) with browser proved Asia/Karachi; count = signed-in location's zone on 16,457/16,457 documents. Heavy Duty's Karachi zone was set by us (14 Oct, Rule 125) and decides WHICH documents show it; any zone other than Greenwich shows it for documents timed in the local evening/early morning. **Not yet observed on a North American location** (QA admin sign-in expired). | partly open |
| Caused by this work | Old report (copy taken this morning) counted and showed the same Greenwich day; 14,662/14,663 A/P Past Due values match its formula. | closed |
| Not a duplicate | JQL text search (aging / time zone / UTC / past due) 12 Nov: none. SV-11922 is the different, older not-yet-due fault. | closed |
| Not agreed tolerance | No tolerance on days in PRD/test. | closed |
