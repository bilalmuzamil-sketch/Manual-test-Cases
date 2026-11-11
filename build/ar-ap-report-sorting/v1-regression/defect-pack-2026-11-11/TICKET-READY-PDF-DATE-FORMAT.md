# Ready to file — NOT YET FILED (create was refused by the session's safety check, 11 Nov 2026 ~13:05Z)

| Field | Value |
|---|---|
| Project | SV |
| Issue type | Story Defect |
| Parent | SV-11533 (A/R and A/P Report Sorting - Story 3 - Export to PDF and CSV) |
| Priority | Medium |
| Link after creating | relates to SV-11533 |
| Images | `evidence/1 - …png`, `evidence/2 - …png`, `evidence/3 - …png` (attach and show inline in section 6) |

**Summary:** Reports - A/R Aging Detail PDF: dates print as "Apr 6, 2026" instead of the app-wide "Apr 06 2026"

## 1. Description
When you download the A/R Aging Detail report as a PDF, every date in the list prints like "Apr 6, 2026". The requirement says the aging PDFs use the same look as the other report PDFs (for example Sales By Customer), where dates print like "Nov 04 2026": the day always has two digits and there is no comma. On the same version of the app, the Sales By Customer PDF does print "Nov 10 2026", so the A/R aging PDF looks different from the other reports.

Why it matters: shops print these reports and compare them with QuickBooks and with the other ShopView reports; the requirement asks for one consistent PDF format across the reports.

## 2. Branch / Environment
- Site: https://sv11315.qa.shopview.com (QA branch of epic SV-11315); API https://sv11315api.qa.shopview.com
- Version marker: v26.45.2-6a8b89c (same at the start and the end of both checks)
- Organization: Staging Foothills Group Inc, current location Staging Heavy Duty - 9919; signed in as an Admin user
- Observed: 11 Nov 2026, 12:55 and 12:56 UTC (two separate downloads), and earlier the same day at about 11:50 UTC

## 3. Steps to reproduce
1. Sign in as an Admin user and stay at your current location (Staging Heavy Duty - 9919).
2. Open **Reports**, then click **A/R Aging Detail** in the left list.
3. Leave every filter as it opens: **As of: 11/11/2026** (today), **Customer: All customers**, **Past due: Any**, **Location: All locations**. No test data needs to be created: any open invoice or credit memo shows the problem.
4. Click the **⋯** (Export) menu at the top right and choose **Download (PDF)**.
5. Open the PDF and look at the Date and Due Date columns, for example the invoice **S3-14144** for **Apollo Beach Truck & Equipment Repair** at Staging Lethbridge - 4310.
6. For comparison: open **Sales By Customer**, choose **⋯** then **Download Expanded View (PDF)**, and look at its Date column.

## 4. Expected behaviour
From the A/R and A/P Report Sorting PRD (Confluence page 947650561, version 11, 5 Nov 2026), requirement S3-R7a, quoted:
> "The PDF uses the app-wide report PDF format, the same as Sales By Customer and Inventory Value: a negative amount prints in brackets with a minus sign, for example "(-$11,111.00)", and dates print as "Nov 04 2026". On screen a negative amount reads "$-11,111.00", as today."

So invoice S3-14144 should print its date as "Apr 06 2026" and its due date as "May 06 2026".

## 5. Current behaviour
- Every date in the A/R Aging Detail PDF prints with a comma and without the leading zero: "Apr 6, 2026", due "May 6, 2026" (all 591 dated lines in the PDF, in both downloads).
- The negative amounts in the same PDF are correct: "(-$1,880.00)".
- The Sales By Customer PDF on the same version prints dates as "Nov 10 2026", as required.

## 6. Images
Image 1: the A/R Aging Detail PDF (dates read "Apr 6, 2026"). Image 2: the Sales By Customer PDF on the same version (dates read "Nov 10 2026"). Image 3: the Export menu used.

## 7. Technical details for developers
- Requirement: PRD 947650561 v11, S3-R7a (added in v11 on 5 Nov 2026 per the PRD change log). Owning story SV-11533.
- Export used: data-test-id `btn_dropdown_ardet_export` then `action_ardet_export_pdf`. Reference export: `action_sbc_export_expanded_pdf`.
- Branch code: origin/SV-11315-ar-ap-aging-reports at 8e35ee0d02 (the deployed commit is not named by the version marker).
- PDF text (pdftotext -layout), first lines: "As of Nov 11, 2026" then "Apr 6, 2026 | Staging Lethbridge - 4310 | Invoice | S3-14144 | Apollo Beach Truck & Equipment Repair | May 6, 2026 | $1,491.58 | $1,491.58"; "Jun 5, 2025 | Staging Heavy Duty - 9919 | Credit Memo | CM11315-552 | … | (-$1,880.00) | (-$1,880.00)". 591 of 591 dated lines match "Mon D, YYYY".
- Sales By Customer expanded PDF on the same build: row dates "Nov 10 2026", "Nov 06 2026", "Nov 01 2026". Production's Sales By Customer PDF (v26.45.3, 10 Nov 2026) also prints rows as "Nov 02 2026".
- Only the A/R Aging Detail PDF was checked; the other aging PDFs that print dates (A/R Aging Collection, A/P Aging Detail, A/P Unpaid Invoices) were not checked for the date format.
