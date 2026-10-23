# Dashboard tests related to SV-11691, SV-11690, SV-11711, SV-11688 — 23 Oct 2026 (FULL READ)

QA lead: "Read the full test case not just the title". Every one of the 126 cases in TestRail section 12166 "Dashboard (Sep 2026)" and
its 14 sub-sections was read in full (preconditions, steps, expected) — `cases-full.json`. Tickets read live 23 Oct 2026 (all four
Ready to Fix, filed 22 Oct 2026 by Mudassir Qamar). Run statuses read live from run 525 "Dashboards".

## SV-11688 — Technician Utilization counts open (never clocked-out) timesheets as 24 h/day; idle days 33.33 % instead of "-"
Directly checks what the ticket breaks:
| Case | What it checks | Where | Run 525 |
|---|---|---|---|
| C88647 | step 9: on a day with no clocked time the Technician Utilization line leaves a gap (no point, no drop to zero) | Staging Heavy Duty - 9919 (example) — the location with the 4 open timesheets since 31 Aug | Passed 10 Oct |
| C88641 | TU exact % by hand (2.00 / 3.00 = 66.67 %), "2.00 WO Hrs / 3.00 Clocked", equals report | fresh location | Passed 12 Oct |
| C88602 | TU 100.00 % then 87.50 % with known records | Dash Shop | Passed 12 Oct |
| C88605 | TU headline 87.50 %, "3.50 WO Hrs / 4.00 Clocked" | Dash Shop | Passed 9 Oct |
| C88646 | no hours → grey "-"; 1 h internal only → 0.00 % | fresh location | Passed 12 Oct |
| C88603, C351706, C581906 | no clocked time → grey "-" (S3-E3) | empty location | Passed 12 / 12 / 15 Oct |
| C351707 | hours on one day only → empty chart outline, TU 100.00 % | Dash Shop | Passed 12 Oct |
| C581900 | TU 100 % every day → flat line along the bottom | flat-shop location | Untested |
| C88650 | TU table: WO + Internal = Total; Total sum = Clocked | busy location this month | Passed 12 Oct |
| C88652 | step 8: TU straight after a clock-out | fresh location | Passed 12 Oct |
| C581905 | expanded TU chart with no clocked time → "No data for selected date range" | empty location | Untested |
Compare tile with report only (the ticket says tile and report are wrong TOGETHER, so these cannot catch it): C88601, C88648, C88649.
Why none caught it: every TU case either builds a clean location where everyone clocks out, or compares tile to report. No case has a
technician who clocked in and never clocked out. C88647 is the one that would now show it at Staging Heavy Duty - 9919, and it passed on
10 Oct, before the ticket (22 Oct). The ticket's "cap at shift end / 24 h or exclude on past days" is the reporter's proposal; the PRD
rules it cites are S3-R2, S3-E3, S4-R11 — check the PRD has a sentence for open entries before writing a new case (Rule 114/64).

## SV-11690 — A/R Aging counts held deposits — no related Dashboard test
No case mentions deposits, A/R, aging or a customer balance; the Dashboard has no receivables tile.

## SV-11691 — Invoices marked Paid with $0 payments — no related Dashboard test
Dashboard figures count invoices (subtotals, customers, last invoice date) whatever their payment status; every case creates invoices
"not sent, not paid" on purpose. Reversal and void (C88635, C88642, C351705, C88632, C88643, C88645) are a different thing.

## SV-11711 — "Over Limit" uses a stale balance — set-up only
C88594, C88607, C88608, C88617, C88623, C88624 tell the tester, while making data, "if a Confirmation says the customer is over their
credit limit, click Create" — they step past the false warning; none tests it.
