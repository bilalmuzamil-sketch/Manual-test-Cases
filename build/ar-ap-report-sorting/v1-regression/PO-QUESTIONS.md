# PO questions: A/R and A/P aging reports, before and after the upgrade (DRAFT, NOT SENT)

> For **Chris Ward** (PO, A/R and A/P Report Sorting, epic SV-11315). Drafted 11 Nov 2026 by the V1 vs V2
> capability check. **Not sent.** Per Rule 66 it goes out last, and only when the QA lead says so; he may
> fold these rows into the existing question sheet.
>
> Each row is a thing the reports can do in production today that the upgrade's code no longer does, and
> that the PRD (v11, 5 Nov 2026) does not mention. Production today = v26.45.3. The "after" side is read
> from the upgrade's code and has **not** been seen on a running build yet.

| # | Project / feature | What production does today | What the upgrade does (from its code) | Try it yourself | Question | Our recommendation (yours to decide) |
|---|---|---|---|---|---|---|
| PO-1 | A/R and A/P Report Sorting · all six aging reports, the date chip | You can pick a date **after today** (for example the last day of next month) and see how the aging will look then: what will have moved into 1-30, 31-60 and so on. A link carrying a future date also opens on that date. | Dates after today are greyed out, a future date in a link is ignored (the report opens on today), and the server caps the date at today. The decision comes from the tech plan (D20, "asOfDate clamped to today"); the PRD says nothing. | On production open A/R Aging Summary, click the date chip and pick the 31st of next month: the report recalculates. On the upgrade the same date cannot be picked. | Should users still be able to look at the aging on a future date, or is removing it intended? | Keep it, unless there is a reason the tech plan does not give: shops use it to plan collections and payments, and the change is not in "What changes for existing users". If removal is intended, add a line there. |
| PO-2 | A/R and A/P Report Sorting · A/R reports, invoices with no due date | An invoice with no due date stored is given one from the customer's credit term (Net 30 → 30 days after the invoice date) and aged from that. | The invoice is aged from its own date, as if it were due on the day it was made. The developer's note says no open production invoice lacks a due date today (checked 21 Oct 2026). | Not reproducible through the app (every new invoice gets a due date). Example: an invoice made 40 days ago for a Net 30 customer reads "1-30 days past due" today; on the upgrade it would read "31-60 days past due". | If such an invoice ever appears, should it be aged from the credit term (as today) or from its own date? | Low risk while none exist. Either answer is fine, but write it into the PRD so the next change does not flip it silently. |
| PO-3 | A/R and A/P Report Sorting · A/R Aging Detail PDF | The printed A/R Aging Detail shows all five buckets, including an empty one with "Total for 61-90 days past due $0.00". | The PDF prints only the buckets that hold a document; an empty bucket is left out. The screen still shows all five. | On production, pick a date where one bucket shows (0), print A/R Aging Detail: the empty bucket is on the paper with $0.00. On the upgrade's PDF it is missing. | Should the PDF keep printing empty buckets? | Keep printing them: a paper aging that skips a bucket can be read as incomplete. Small change. |

**Not asked, because the PRD already decides it** (quoted in `INVARIANT-REGISTER.md`): the PDF limit of
2,000 rows (S3-N1; production prints any size today), the credit dated on the as-of date moving to Current
(S1-R5a), the drill-down keeping the date (S5-R11), the Totals rows following the filters (§2), and the other
changes listed under "What changes for existing users".

## SENT 11 Nov 2026 (QA lead: "go for 1, 2 and 5")

Added as questions **19–22** (rows 28–32, light teal, colour guide I3) to Chris Ward's existing sheet
"A/R and A/P Report Sorting – Questions for Chris Ward" — https://docs.google.com/spreadsheets/d/11_3z_TpKkOL-MiAWqxrj1jlHP1rn9QXu_h3uCR0SjVA
(already shared with him as Editor). Written values read back identical.

| Sheet # | Topic | Our tests waiting on it |
|---|---|---|
| 19 | As-of date after today (picker and saved link) | V1R-07 C1078980, V1R-08 C1078981 |
| 20 | Empty buckets in the A/R Aging Detail PDF | V1R-35 C1079008 |
| 21 | "Subtotal" instead of "Total for ..." in the A/R PDFs | V1R-36 C1079009 |
| 22 | Invoice without a stored due date | V1R-25 C1078998 |

Not on the sheet: the PDF document-date format — a clear PRD requirement (S3-R7a), so it is a defect, not a
question (ticket text ready in `defect-pack-2026-11-11/TICKET-READY-PDF-DATE-FORMAT.md`). Sheet question 18
(added 10 Nov by another session) covers only the "As of" line's date form and does not overlap.
Chris is NOT notified by a sheet edit; the QA lead decides how to tell him.
