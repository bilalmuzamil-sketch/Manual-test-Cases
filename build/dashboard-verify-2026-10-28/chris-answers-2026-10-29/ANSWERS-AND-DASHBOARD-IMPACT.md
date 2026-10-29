# Chris Ward's answers (28 Oct 2026): what each one means, and whether it touches the Dashboard

Source: the Google Doc "Dashboard and Reports – questions for Chris Ward", all 39 answers, verbatim copy in
`CHRIS-WARD-ANSWERS-verbatim.md`. Read through the Docs API on 28 Oct 2026, about 23:50 UTC. Q39 was added
after the first read and was picked up on the second read.

**How "touches the Dashboard" was decided.** The Dashboard PRD v53 §5 says *"Every KPI and count figure comes
from a report or a report's calculation."* The tile → report pairs are in the PRD's Story 10 context note:

| Tile | Report |
|---|---|
| Revenue | Sales |
| Billing Efficiency | Service Advisor Analysis |
| Technician Efficiency | Technician Efficiency |
| Technician Utilization | Technician Utilization |
| Sales by Customer | Sales By Customer |

A tile's expanded table (Story 6) is part of the Dashboard too. So:

- A report finding touches the Dashboard **only when it changes a figure or a row that one of those five
  reports feeds into a tile or its table.**
- Every "touches the Dashboard" verdict below was **checked live on staging with the location's own time zone**
  (Rule 99), not inferred.

## Phase 1: tickets that change Dashboard figures (draft now)

| Q | Chris's answer, short | Where it shows on the Dashboard | Live check (29 Oct UTC) | Draft |
|---|---|---|---|---|
| 1 | "Only billed lines count … Defect." | **Technician Efficiency** tile headline, supporting line and table | DVI Test, 25–28 Oct, browser America/Toronto. Fabian Bonjean shows 2.00 Invoiced Tech Hrs, 1.50 Clocked, 133.33 % (S1-38198: line 2 declined). The tile reads 196.08 %, 6.00 / 3.06. | `P1-1` |
| 28 | "Split on the real time clocked and round only for display … Defect." | **Technician Efficiency** tile headline and table | Lethbridge, 25 Aug, browser America/Edmonton. The tile reads 114.10 %, 33.50 / 29.36, and Joseph Nelson 9.75. The 30-minute line 4 of S3-17383 (30 s clocked) is dropped. | `P1-2` |
| 10 | "Leave them off the report. Under 0.01 hours counts as no time." | **Technician Utilization** tile table: an extra row with 0.00 and "n/a" | Heavy Duty, This Month, browser Asia/Karachi. QA Technician is listed 0.00 / 0.00 / 0.00 / n/a. Their only clock, on S2-38042, is a few seconds long. The headline does not change. | `P1-3` |
| 27 | "Use the figures as they are now … Defect." | **Sales by Customer** tile table, Labor Delta column | DVI Test, This Week, browser America/Toronto. S1-38215 was seeded. Its clock was made 30 minutes longer on **Reports → Timesheet Activities → Edit timesheet**. The Stats tab went from 0.50 to 1.00 clocked, but the Dashboard still shows **+0.50**. The Technician Efficiency and Billing Efficiency tiles did take the new time. | `P1-4` |
| 3 | "Hide the split line whenever any share is negative … Defect." | **Revenue** tile supporting line | Already reported as **SV-11823** (Mudassir Qamar, Ready to Fix). The developer's comment says the fix is built on branch SV-11839 and falls back to "{count} Invoices". | **No new ticket.** A comment draft for SV-11823 records Chris's ruling: `P1-5-COMMENT-SV-11823`. |

## Checked: answers that do NOT touch the Dashboard

| Q | Answer | Why it does not touch the Dashboard (checked) |
|---|---|---|
| 2 | Revenue after the discount is right; the PRD gets updated | **Not a defect.** Draft F4 is withdrawn. Note for Chris's PRD edit: S5-R15 (At Risk "revenue … before any discount") carries the same words. |
| 9 | Two decimals on Technician Utilization | Not a defect. The tile already shows two decimals (S4-R8). |
| 11 | Deleted work order time still counts; Timesheet Activities should say "Deleted work order" | Timesheet Activities is not a Dashboard report, and the hours keep counting, so no figure changes. Phase 2. |
| 12 | Shop Efficiency should count a running shift under 24 h | Shop Efficiency is not paired with any tile; Billing Efficiency reads Service Advisor Analysis. Phase 2. |
| 39 | Overlapping time counts once on the Payroll Timesheet export | **Correction (29 Oct):** the 40.70 h and 32.34 h for Admin Shopview in our question came from unmatched zones. Worker A re-checked with the zones matched and found 7.70 h on 10 Sep and 12.10 h on 17 Sep. The defect is real: Haley Brown has 28.50 h on 6 Sep, and a fresh case was made on screen. The Dashboard's Technician Utilization table also shows Admin Shopview at 7.70 h on 10 Sep, so the Dashboard is not affected. Phase 2 (A5). |
| 4–8, 13–26, 29–38 | (see the verbatim file) | WIP, Parts Velocity, Inventory Value, Sales By Representative, Sales Tax, A/R, IBS, Notes, QB, Export: none of them feeds a tile. Sales By Customer Q22–Q26 were all answered "keep as today". Phase 2 wherever Chris said "Defect". |

## Phase 2: report-only defects (Chris said "Defect"; drafted after Phase 1)

| Q | Report | Defect in one line |
|---|---|---|
| 4 | Work In Progress | "1 days" should read "1 day" |
| 6 | Work In Progress | A part marked "received later" belongs in Parts Earned, not Parts Remaining |
| 11 | Timesheet Activities | Time on a deleted work order shows a blank Work Order; it should read "Deleted work order" |
| 12 | Shop Efficiency | A running shift under 24 h is left out of Total Clocked Hours |
| 13 | Parts Velocity | "Last 90 days" covers 91 days |
| 15 | Parts Velocity | A return to the vendor counts in Units Returned |
| 16 | Parts Velocity | The Location column is hidden when one location is picked |
| 18 | Parts Velocity | Last Sale ignores a billed sale that moved no stock |
| 20(b) | Inventory Value | The column heading should be "On Hand" (screen and download) |
| 27 | Sales By Representative | Same as P1-4 on the representative report (not a Dashboard report) |
| 30 | Sales Tax Collected | Credit memos are missing; they should be negative rows that lower the tax totals |
| 31(a) | Sales Tax Collected | $0.00 invoices with no payment are listed as Paid |
| 31(b) | Sales Tax Collected | A deposit's date is not used as Invoice Paid Date |
| 33 | A/R Aging | A part sale's deposit does not lower its A/R balance once invoiced |
| 34 | IBS Batches | A sent batch's Total is not the sum of its invoices |
| 35 | IBS Batches | A $0.00 invoice is listed in Ready to Send |
| 36 | Notes Report | Stops at 100 notes, with no paging |
| 37(a) | QB Unexported | Credit memo rows have a blank No. |
| 37(b) | QB Unexported | A document appears more than once |
| 38 | Export Reports | Customer Invoice export Terms is not the invoice's own term |
| 39 | Export Reports | Payroll Timesheet counts overlapping time twice (a day over 24 h) |

Also carried into Phase 2 from earlier in this run, not covered by Chris's answers:

| Item | Report | Status |
|---|---|---|
| PV-D1, PV-D2 | Parts Velocity | Ready earlier; their screen pictures must be redone in America/Toronto (Rule 99) |
| TAX1 | Sales Tax Collected | Deposit invoice shows "Paid" |
| SBR-ORDER (SV-8974 re-created) | Sales By Representative | Draft ready |
| IV-COLUMNS (SV-8927 re-created) | Inventory Value | Draft ready |
| SV-11922 | A/P | Filed; Obsolete by the QA lead |

Not a defect, so no ticket: answers 2, 5, 7, 8, 9, 14, 17, 19, 20(a), 21, 22, 23, 24, 25, 26, 29, 32. Each of
these is "keep the screen; the PRD gets updated".

Q32 asks us to **link our A/R finding to SV-11441**. That is a Jira link write, so it waits for the QA lead's
go-ahead.

On Q23, Chris says Margin % on Inventory Value and Parts Velocity "move from one to two in a follow-up ticket".
That ticket is his to raise. We have not drafted it.
