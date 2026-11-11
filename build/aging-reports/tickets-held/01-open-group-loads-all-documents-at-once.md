# HELD — not filed (Rule 62/113: ask the QA lead per ticket)

**Type** Story Defect · **Parent** SV-11531 (Story 1 — Reports open in QuickBooks name order, TESTING QA on 11 Nov 2026) · **relates to** SV-11534 · **Priority** Medium

**Title:** A/R Collection and A/P Unpaid Invoices: an Open Customer or Vendor Loads Every Document at Once Instead of 100 at a Time

## Description
An open customer on *A/R Aging Collection* (or vendor on *A/P Unpaid Invoices*) should show its first 100 documents, then load the next 100 as the user scrolls. It loads all of them at once.

For example,
* a customer with 105 overdue invoices: opening the group brings all 105 in the first answer from the server;
* scrolling past the 100th invoice loads nothing more — invoices 101 to 105 are already there, with no loading row.

The count in brackets, the "Total for" row and the Totals row are right (105, and the sums), and every document is listed once.

## Steps to Reproduce
# Make a customer with more than 100 overdue invoices (we used *ZZAUTOTEST OVER100 C*, 105 invoices dated Oct 1–20, 2026).
# Open *Reports* → *A/R Aging Collection*; in *Customer:* tick only that customer.
# Open the customer's group and scroll down to its 100th invoice, then on to the end.
#* *Actual Result:* all 105 invoices are there as soon as the group opens; nothing loads after the 100th.
#* *Expected Result:* the group shows its first 100 invoices; the next ones load under them as you scroll, up to 100 more each time.
# Repeat on *A/P Unpaid Invoices* with a vendor that has more than 100 unpaid bills (*ZZAUTOTEST OVER100 V*, 105 bills) — same result.

## Screenshots
(attach: C1062570-fail.png, C1062571-fail.png — banner says what you are looking at)

## Environment
QA site https://sv11315.qa.shopview.com (build v26.45.2-6a8b89c), location Staging Heavy Duty - 9919. Records: https://sv11315.qa.shopview.com/reports/ar-aging-collection and https://sv11315.qa.shopview.com/reports/ap-unpaid-invoices with the customer / vendor above ticked.

## Sources
* PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, version 11 (5 Nov 2026), **S1-R8**: "On A/R Collection and A/P Unpaid Invoices, an open customer or vendor shows its first 100 documents, then the next 100 as the user scrolls; its document count, its subtotals, the Totals row and the exports always cover all of its documents."
* SV-11534 (Story 4), "100 lines at a time": "A/R Collection / A/P Unpaid: a customer or vendor with more than 100 documents draws 100, then 100 more each time you scroll to its end."

## Test case
https://shopview.testrail.io/index.php?/cases/view/1062570 · https://shopview.testrail.io/index.php?/cases/view/1062571
