# SV-12201 — Payroll Timesheet export counts overlapping timesheets twice

**Ticket:** https://shopview.atlassian.net/browse/SV-12201 (TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com · **Fix:** da8754eca, which is in the build tested.

## Verdict: PASS

## What the ticket expects (verbatim)
> Overlapping time should count once. A day can therefore never be more than 24 hours.

Source:
- The ticket (`tickets-2026-11-04/filed/SV-12201.html`).
- Chris Ward, "Dashboard and Reports – questions for Chris Ward (28 Oct 2026)", Section 3, question 39 (corrected) (a): *"Yes. Overlapping time counts once, so a person is never paid twice for the same minutes … A day can't go over 24 hours. Defect."*

## What I did (Staging Heavy Duty - 9919; the ticket's DVI Test example is staging-only)
1. **Set-up**, with the same request the Timesheet Activities "New" dialog sends for a finished entry: two timesheets for one person, **-ZZAUTOTEST QA11839 Tech**, on one work-order line (S11839-17597), today (Nov 4, location time):
   - **A** 8:00 PM – 9:00 PM (1.00 h)
   - **B** 8:30 PM – 9:30 PM (1.00 h)
   - They overlap from 8:30 to 9:00 PM; together they cover 8:00–9:30 PM = **1.50 h**.
   - The same person already had one 0.50 h timesheet earlier that day (seeded on 4 Nov for SV-11885).
2. **On screen:** Reports → **Export Reports** → Payroll Timesheet → **Today** → Export, then read the person's rows.

## What I saw
| Person, Nov 4 | Total Hours | WO Hours | If the overlap were counted twice |
|---|---|---|---|
| -ZZAUTOTEST QA11839 Tech, 2026-11-04 | **2.00** | **2.00** | 2.50 (0.50 + 1.00 + 1.00) |

2.00 = 0.50 (earlier timesheet) + 1.50 (A and B together). The 30 overlapping minutes are counted once.

The same file also lists a "2026-11-05 · 0.00" row for this person. The export was taken at 11:25 PM on 4 Nov (location time), and "Today" as sent by the test browser runs until 06:59 UTC, which on this machine's time-zone data is already 5 Nov 12:59 AM. It holds no hours, so it does not affect the result (see the time-zone note in the 4 Nov RESULTS.md).

**Not re-checked:** the ticket's existing example at Heavy Duty (Haley Brown, 6 Sep 2026). This branch has no data for that day: the export for Custom 09/06/2026–09/06/2026 returns an empty report (`{"data":[""]}`, no file).

## Build, time, location, zones
- Build **v26.45.0-277b249**.
- 5 Nov 2026, 05:23–05:26 UTC (4 Nov, 11:23–11:26 PM at Heavy Duty).
- Zones (Rule 99), recorded in `export-payroll-today.json`: change-location `workplace_timezone=America/Edmonton` (200) · browser `timezoneId` · process `TZ` · `localStorage['timezone']` "America/Edmonton" · header showing the location at the start and end.

## Evidence
`payroll-timesheet-today-extract.csv` (the person's rows from the file), `export-payroll-today.json`, `export-payroll-2026-09-06.json`, `export-dialog-payroll-today.png`, and `../seed-log.jsonl` (the two timesheets).

No Jira or TestRail write was made.

## Draft QA-pass comment (NOT POSTED)
QA check on the QA branch sv11839 (build v26.45.0-277b249), 4 Nov 2026 at 11:25 PM (Edmonton time), Staging Heavy Duty - 9919.

One person had two timesheets on the same work order that overlap: 8:00–9:00 PM and 8:30–9:30 PM. Together they cover 1.5 hours. The same person also had a 0.5-hour timesheet earlier that day.

In Reports → Export Reports → Payroll Timesheet (Today), that person's day now reads **2.00 hours** (0.5 + 1.5). The overlapping half hour is counted once; before the fix it would have read 2.50.

Picture: SV-12201/export-dialog-payroll-today.png
