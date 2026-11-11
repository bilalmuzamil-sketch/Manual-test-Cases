# SV-12540 — is Nemanja right (comment 80909)? "Open customer/vendor loads every document at once"

Asked by the QA lead 11 Nov 2026. Read-only check, nothing posted to Jira, nothing changed on the branch.

## Sources
- PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, **version 11** (read live 11 Nov, unchanged since the ticket), **S1-R8**: "On A/R Collection and A/P Unpaid Invoices, an open customer or vendor shows its first 100 documents, then the next 100 as the user scrolls; its document count, its subtotals, the Totals row and the exports always cover all of its documents." Saved as `prd-v11.md`.
- Nemanja 80909: the first 100 are drawn; when the end of those 100 scrolls into view the next 100 are added; no loading row because the data is already on the page; with 105 the last 5 appear just before you reach them.

## Build
sv11315.qa.shopview.com, `v26.45.2-6a8b89c`, last-modified Tue 10 Nov 2026 10:27:26 GMT (same build the ticket was filed on). Admin, Staging Heavy Duty - 9919, Chrome headless 1600×900.

## Method
Filter the report to one customer/vendor with the chip, open its group with its arrow, then count the document rows that exist in the page (not only the ones visible) before scrolling, and again each time the last document row is brought into view. Scripts: `scripts/expand.mjs`, `scripts/steps.mjs`.

## Results
| Report | Group (count on its row) | Rows in the page after opening | After 1st scroll to the end of the rows | After 2nd | Server requests while scrolling |
|---|---|---|---|---|---|
| A/R Collection | ZZAUTOTEST OVER100 C (113 — grown from 105 since the ticket) | **100** (last S11315-17653) | 113 (last S11315-17715) | 113 | 0 |
| A/P Unpaid Invoices | ZZAUTOTEST OVER100 V (105) | **100** (last ZZO100-099) | 105 (last ZZO100-100) | 105 | 0 |
| A/P Unpaid Invoices | Apex Truck & Trailer Repair (244) | **100** | **200** | **244** | 0 |

Group count on the row (113 / 105 / 244) and the Total row cover every document from the start.

## Verdict
**Nemanja is right.** The open group shows its first 100 documents and adds the next 100 when the user reaches the end of the ones shown — exactly S1-R8. The ticket's statement "every one of its documents appears at once … nothing more loads" is wrong: with 105 documents the last 5 were added when the 100th row came into view, which looked like they were already there. Nothing loads from the server while scrolling (the data comes with the group), but S1-R8 asks what the user is *shown*, not how it is fetched.

Recommendation: SV-12540 can be closed (QA lead's call — not touched). TestRail C1062570 / C1062571 not touched; their expected result should be checked for "count the rows before scrolling" wording when next touched.

## Evidence
`ev/ar-aging-collection-expand.json`, `ev/ap-unpaid-expand.json`, `ev/apex-steps.json`, screenshots `ev/*-open.png`, `ev/*-end.png`, `ev/apex-0-opened.png` … `ev/apex-3-scroll.png`.

## Learning
A missing "loading" row is not proof everything loaded. To test "show N then the next N as the user scrolls", count the rows in the page right after opening (before any scroll), then after each scroll to the end, on a group with at least 2×N+ documents.
