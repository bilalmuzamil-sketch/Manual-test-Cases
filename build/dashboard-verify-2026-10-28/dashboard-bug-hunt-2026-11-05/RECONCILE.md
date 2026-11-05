# Reconcile: every confirmed Dashboard defect against Jira, 5 Nov 2026

**Done:** 5 Nov 2026, 17:25–17:45 UTC. This is a paper check: no screen was needed and none was used.
**Jira read:** `parent in (SV-11839, SV-11936)` returned 51 issues, with no further pages. A key lookup covered SV-11688, SV-12146, SV-11955, SV-10702, SV-11970 and SV-12161.
**PRD:** Dashboard, Confluence 788430850. It is still **v53** (22 Oct 2026, "S4-R11c unfinished ranges, S9-R12 shading"), re-read at 17:27 UTC (Rule 59).

**Sources gone through:**
- Chris Ward's 28 Oct answers: `../chris-answers-2026-10-29/ANSWERS-AND-DASHBOARD-IMPACT.md`, plus the verbatim copy.
- Chris's Section 3 answers: `../chris-answers-2026-11-04-section3-verbatim.md`.
- `../defect-pack-2026-10-28/NOT-FILED.md`.
- `../tickets-2026-10-29/README.md`.
- `../tickets-2026-11-03/DECISIONS-2026-11-04.md`.
- `../rerun-sv11839-2026-11-04/SUMMARY-sv11839-2026-11-04.md`.
- `../sv11839-ticket-qa-2026-11-04/RESULTS.md` and `../sv11839-ticket-qa-2026-11-05/RESULTS.md`.

**A finding "touches the Dashboard"** when it changes a figure or a row on a tile or in its expanded table, or the tile's link and range. The test is PRD §5 (*"Every KPI and count figure comes from a report"*), with the tile-to-report pairs in the Story 10 context note.

## Result: no confirmed Dashboard defect is missing a ticket

| # | Defect (who confirmed it) | Where it shows on the Dashboard | Ticket | Status today |
|---|---|---|---|---|
| 1 | Technician Efficiency counts a declined line (Chris Q1, "Defect") | Technician Efficiency headline, line and table | [SV-11931](https://shopview.atlassian.net/browse/SV-11931) | QA Complete |
| 2 | A clock under 36 s drops the line's tech time (Chris Q28, "Defect") | Technician Efficiency headline and table | [SV-11932](https://shopview.atlassian.net/browse/SV-11932) | QA Complete |
| 3 | A technician with only seconds of clock is listed (Chris Q10) | Technician Utilization table | [SV-11933](https://shopview.atlassian.net/browse/SV-11933) | QA Complete |
| 4 | Labor Delta keeps the old figure after a timesheet edit (Chris Q27, "Defect") | Sales by Customer table | [SV-11934](https://shopview.atlassian.net/browse/SV-11934) | QA Complete |
| 5 | Negative split shares on the Revenue line (Chris Q3, "Defect") | Revenue supporting line | [SV-11823](https://shopview.atlassian.net/browse/SV-11823) (+ comment 79712) | QA Complete |
| 6 | Never-clocked-out timesheets counted as 24 h a day (defect pack F1) | Technician Utilization headline and table | [SV-11688](https://shopview.atlassian.net/browse/SV-11688) | **Blocked**; not a child of SV-11839 or SV-11936 (its own parent was not read) |
| 7 | "1 Invoices" and "Range: 1 days" (defect pack O7) | Revenue line and date picker | [SV-11821](https://shopview.atlassian.net/browse/SV-11821) | QA Complete |
| 8 | Change Location opens empty after a reload on "DVI Test" | Location switch (S1-R4) | [SV-11822](https://shopview.atlassian.net/browse/SV-11822) | **REJECTED FROM TESTING** (still open, in the epic) |
| 9 | SV-11820, SV-11824, SV-11825, SV-11826, SV-11827, SV-11828, SV-11829, SV-11691 (the earlier epic tickets) | various | as named | QA Complete |
| 10 | SV-11885: report downloads open text as a formula | Reports only | [SV-11885](https://shopview.atlassian.net/browse/SV-11885) | Blocked |

## Items that are NOT Dashboard defects (checked; no ticket needed for the Dashboard)

| Item | Why it needs no Dashboard ticket |
|---|---|
| Chris Q2 (revenue after discount) | Chris: keep as today, the PRD gets updated. Draft F4 was withdrawn. |
| Chris Q9 (two decimals on Technician Utilization) | Keep as today. |
| Chris Q11, Q12 | Timesheet Activities and Shop Efficiency feed no tile. Q12 is filed as SV-11939. |
| Chris Q38, Q39(a), Q40 | Report or export defects, filed as **SV-12199**, **SV-12201** and **SV-12202** (all QA Complete). |
| Chris Q39(b): time split at midnight (Payroll Timesheet export) | The QA lead's decision 4 (4 Nov, *"Lets see this after everything else"*) leaves the SV-10702 comment for later. **Dashboard angle:** whether the Technician Utilization tile counts a timesheet that runs past midnight on the day each part was worked has **not been checked**. The PRD is silent; Chris's answer was given for the export. Queued in `RESULTS.md`, area 2 (check 2.6). |
| Defect pack F3 and F5 (lines added to Paid or Invoiced work orders) | The screen cannot do it, so Rule 24 applies (PASS). |
| Defect pack O1 to O6, O8 | Observations: rounding, not reachable on screen, latent, or a documented definition. See `NOT-FILED.md`. |
| 4 Nov O1 (no comma at ≥ 1,000 %) and O2 (remembered technician filter) | QA lead, 4 Nov, decision 6: *"Leave it"*. |
| Side issues from ticket QA | Remittance slip date → **SV-12207**. A/R credit memo in 1–30 days → **SV-12208** (OBSOLETE). Empty Export Reports → **SV-12209**. None of the three is a Dashboard figure. |
| 4 Nov worker side notes (not verified by the coordinator) | 1. A Timesheet Activities link with a Custom range shows "No record matches these filters". 2. The S2-38354 invoice shows another location as Remit To. Neither is a Dashboard report or tile: Story 10's links go only to Sales, Service Advisor Analysis, Technician Efficiency, Technician Utilization and Sales By Customer. **Not reconciled here and not re-checked.** |
| Phase 2 report-only defects | Filed as SV-11937 to SV-11957 under SV-11936. They do not touch the Dashboard. |

## Things to note (no action taken)
- **SV-11688 is not under SV-11839 or SV-11936.** It changes the Technician Utilization tile (F1). Under the 5 Nov epic rule ("Dashboard → SV-11839"), the QA lead may want it parented to SV-11839. That is his call, so nothing was changed.
- **SV-11822 is REJECTED FROM TESTING.** It is still an open Dashboard-area defect, tracked in the epic.
