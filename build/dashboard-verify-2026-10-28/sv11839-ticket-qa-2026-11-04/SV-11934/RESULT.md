# SV-11934 — Reports - Sales By Customer keeps the old Labor Delta after a timesheet is corrected (Dashboard table too)

**Ticket:** https://shopview.atlassian.net/browse/SV-11934 (status TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com

## Verdict: PASS

## What the ticket expects (verbatim)
> **Expected:** Labor Delta reads **0.00**, the same as the work order's Stats tab today.

Source: SV-11934 description; Chris Ward's answer to question 27 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026): *"Use the figures as they are now, so the reports agree with the work order's Stats tab. Defect."*

## What I did
Seeded at Heavy Duty (DVI Test is staging-only): customer "ZZAUTOTEST QA11839 SBC Delta", work order **S11839-17590**, one labor line of 1.00 h tech time, technician **Jermaine Wilcox** clocked 11:51 AM – 12:21 PM (0.50 h), line Complete, invoiced. Then the ticket's steps 5–9: Dashboard → Sales by Customer → View details (Labor Delta before) → Reports → Timesheet Activities → pencil on that clock → Start 30 minutes earlier → Save → work order Stats tab → Dashboard again; also the Sales By Customer report. Range: **Nov 4, 2026** — under Last 12 Months the Dashboard table lists only the top 15 customers at Heavy Duty, so the test customer cannot appear there.

## What I saw
| Step | Seen |
|---|---|
| 5. Dashboard → Sales by Customer → View details, before | Labor Delta **+0.50** (1.00 invoiced − 0.50 worked) |
| 6–7. Timesheet Activities → Edit timesheet: Start 11:51 AM → **11:21 AM** → Save | saved (row now 11:21 AM – 12:21 PM, **1.00** h) |
| 8. Work order Stats tab | Tech hours **1.00**, Clocked hours **1.00** (before: 1.00 / 0.50) |
| 9. Dashboard → Sales by Customer → View details, after | Labor Delta **0.00** |
| Reports → Sales By Customer (Nov 4), after | Labor Delta **0.00** |

## Build, time, location, zones
- Build: v26.45.0-aacb66c (read from `<meta name="app-version">` on sv11839; the brief said v26.43.5-c73a58b — the branch has moved on)
- When: 4 Nov 2026, 20:23–20:40 UTC
- Location **Staging Heavy Duty - 9919**. Zones (Rule 99), all recorded in the evidence JSON: session `change-location` with `workplace_timezone=America/Edmonton` (HTTP 200) · browser `timezoneId=America/Edmonton` · process `TZ=America/Edmonton` · `localStorage['timezone']="America/Edmonton"` · header/location selector showed Staging Heavy Duty - 9919 at the start and end of the run. Note: on this machine the time-zone database (2026e) puts America/Edmonton at UTC−6, while the test browser (Chromium 153) still uses UTC−7 — see RESULTS.md, environment notes.

## Pictures (deviceScaleFactor 2)
- `SV-11934/6-dashboard-sbc-today-sbc-after.png`
- `SV-11934/1-dashboard-sbc-today-sbc-before.png`
- `SV-11934/4b-timesheet-row-after.png`
- `SV-11934/5-work-order-stats-sbc-after.png`
- `SV-11934/7-sales-by-customer-report-today-after.png`

## Evidence
SV-11934/evidence.json (phases sbc-before, sbc-edit, sbc-after), SV-11934/evidence-report.json

No Jira or TestRail write was made.

## Draft QA-pass comment (NOT POSTED)
QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. Test work order S11839-17590: 1.00 h invoiced, 0.50 h clocked, so Labor Delta read +0.50. I then moved the clock's start 30 minutes earlier in Timesheet Activities (clock now 1.00 h). The work order's Stats tab shows 1.00 / 1.00, and both the Dashboard (Sales by Customer → View details) and the Sales By Customer report now show Labor Delta 0.00. Picture: SV-11934/6-dashboard-sbc-today-sbc-after.png
