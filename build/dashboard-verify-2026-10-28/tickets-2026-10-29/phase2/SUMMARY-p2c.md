# Phase 2 · Worker C (p2c) · 29 Oct 2026

Saved by the coordinator from Worker C's hand-back; the harness refused the file to the worker.

Nothing was filed, nothing was written to TestRail, and nothing was committed. The build was v26.43.2-f8698cb throughout (unchanged).

## Verdicts

| ID | Verdict | Draft | Owning story |
|---|---|---|---|
| C1 (Q27) | DRAFTED. S1-38217: after the timesheet was corrected on screen, the Stats tab reads 1.00/1.00 but Sales By Representative still shows Labor Delta +0.50. | P2-C1-…md | SV-8626 |
| C2 (Q30) | DRAFTED. Heavy Duty, 20 Oct: credit memo CM2-4520 (−$125.00, GST −$6.25) is not listed. GST shows $57.44; it should be $51.19. | P2-C2-…md | SV-4573 |
| C3 (Q31a) | DRAFTED. S1-38218, a $0.00 invoice made on screen, is listed as Paid with a paid date. | P2-C3-…md | SV-4573 |
| C4 + C5 (Q31b + TAX1) | MERGED. S1-38221 has a $30 deposit dated Oct 26 and still owes $105. It shows "Paid", and its paid date is the day the invoice was made. | P2-C4-…md | SV-4573 |
| C6 (SBR-ORDER) | DRAFTED as a new ticket (SV-8974 was closed OBSOLETE). Invoices on the same day are listed newest first instead of by invoice number. | P2-C6-…md | SV-8624 |

## Re-check times (29 Oct, UTC)

| ID | Time | Location |
|---|---|---|
| C1 | 00:08–00:40 | Toronto |
| C2 | 00:41–00:43 | Karachi |
| C3 | 00:19–00:42 | Toronto |
| C4 | 00:45–00:48 | Toronto |
| C6 | 00:40 | Toronto |

- For every check, the session, browser, process and the app's time-zone setting were all on the location's zone.
- The first captures were taken without the app's setting. All of them were re-taken with it on.
- Zones per picture are in `pictures/P2-C-meta.json`. There are 12 pictures; each was looked at, and the C6 box was fixed.

## Test data (DVI Test)

- Customers ZZAUTOTEST P2C REP, ZZAUTOTEST P2C ZERO and ZZAUTOTEST P2C DEP.
- **S1-38217**: sales rep Viktoria. Esther's clock start was edited on screen from 7:28 to 6:58 PM. Invoiced.
- **S1-38218**: a $0.00 invoice, now Paid.
- **S1-38219**: a $30 deposit entered before the time-zone fix; $105 owing.
- **S1-38221**: a $30 deposit entered with the setting on; $105 owing.
- CM2-4520 already existed and was only read.

## JQL run (read-only)

1. `project = SV AND created >= -365d AND (summary ~ "sales tax" OR text ~ "\"Sales Tax Collected\"")`
   - 50 results on the first page; more pages exist.
2. Same window with `summary ~ "Sales By Representative" OR summary ~ "SBR" OR text ~ "\"Sales By Representative\" \"Labor Delta\""`
   - 90 results.
3. A targeted text query on credit memo, deposit, paid date, $0, timesheet and invoice number.
   - 87 results.
   - Open hits: SV-11923, SV-11517, SV-11511, SV-11327, SV-11251, SV-11116, SV-11009, SV-9439, SV-5487. None covers C1–C6.
   - SV-11517 (Accrual/Cash basis) is related but not a duplicate.

## Found along the way (not drafted)

- **Deposit date prints a day late.** On the Finance tab, a deposit taken after 8 PM Toronto prints one day late: S1-38221's deposit is dated 10/26 but prints "Oct 27, 2026". Seen once, with the zones matched. It needs its own duplicate check before any ticket.
- **Credit memo PDF date.** The CM2-4520 PDF may print the 19th instead of Oct 20. NOT VERIFIED.
