# SV-12199 — Customer Invoice export shows the customer's current Terms instead of the invoice's own Terms

**Ticket:** https://shopview.atlassian.net/browse/SV-12199 (TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com · **Fix:** c93ba940d, which is in the build tested.

## Verdict: PASS

## What the ticket expects (verbatim)
> Expected: the file shows Terms: COD, the invoice's own term, as on the invoice.

Source:
- The ticket (`tickets-2026-11-04/filed/SV-12199.html`).
- Chris Ward, "Dashboard and Reports – questions for Chris Ward (28 Oct 2026)", Section 3, question 38 (corrected): *"The invoice's own term: COD for S1-38216. An invoice keeps the term it was made with, and changing the customer's term later never changes it (SV-11676). Defect."*

## What I did (Staging Heavy Duty - 9919; the ticket's DVI Test and S1-38216 are staging-only)
1. **Set-up (by request):** customer **"ZZAUTOTEST QA11839 Terms test"** with Credit Terms **COD**, plus a contact and an asset. Work order **S11839-17599** with one labor line, the line Complete, then the invoice created.
2. **On screen:** Work order → **Finance**. The invoice says **Terms COD**, invoice date Nov 4, 2026, due date Nov 4, 2026.
3. **On screen:** Customers → the customer → edit (`edit_note`) → Credit Terms **Net 30** → **Save** (`POST /api/customers/change`, `credit_term: "Net 30"` → 200; read back: Net 30).
4. **On screen:** Reports → **Export Reports** → Customer Invoice → **Today** → Export, then found S11839-17599 in the file.

## What I saw
| Where | Terms | Invoice date | Due date |
|---|---|---|---|
| Work order Finance, before the customer change | **COD** | Nov 4, 2026 | Nov 4, 2026 |
| Work order Finance, after the change to Net 30 | **COD** | Nov 4, 2026 | Nov 4, 2026 |
| **Customer Invoice export**, after the change | **COD** (both rows of S11839-17599) | 11-04-2026 | 11-04-2026 |

The file keeps the invoice's own term (COD), not the customer's new term (Net 30).
Not re-checked: the ticket's older Heavy Duty examples (September 2026, e.g. S2-31597). This branch's data stops at about 31 Aug 2026.

## Build, time, location, zones
- Build **v26.45.0-277b249** (read at 05:23 UTC and recorded in every run).
- 5 Nov 2026, 05:27–05:31 UTC (4 Nov, late evening at Heavy Duty).
- Zones (Rule 99), recorded in `screen-steps.json` and `export-custinv-today.json`: change-location `workplace_timezone=America/Edmonton` (200) · browser `timezoneId` · process `TZ` · `localStorage['timezone']` "America/Edmonton" · header showing the location at the start and end.

## Pictures
`SV-12199/1-work-order-finance-before.png`, `2-customer-credit-terms-net30.png`, `3-work-order-finance-after.png`, `export-dialog-custinv-today.png`.

## Evidence
`screen-steps.json`, `export-custinv-today.json`, `customer-invoice-today-extract.csv` (the invoice's rows from the file), and `../seed-log.jsonl`.

No Jira or TestRail write was made.

## Draft QA-pass comment (NOT POSTED)
QA check on the QA branch sv11839 (build v26.45.0-277b249), 4 Nov 2026 late evening (Edmonton time), Staging Heavy Duty - 9919.

I made a customer on COD and invoiced a work order for it (S11839-17599). The invoice says Terms COD. I then changed the customer to Net 30 and downloaded the Customer Invoice report (Reports → Export Reports, Today). The file now shows **Terms COD** for S11839-17599, the invoice's own term, and the invoice itself still says COD.

Picture: SV-12199/3-work-order-finance-after.png
