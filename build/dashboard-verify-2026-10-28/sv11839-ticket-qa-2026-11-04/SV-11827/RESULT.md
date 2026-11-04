# SV-11827 — Technician Utilization and Sales By Customer reports show dates instead of "Custom" when opened from a dashboard tile with a custom range

**Ticket:** https://shopview.atlassian.net/browse/SV-11827 (status TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com

## Verdict: PASS

## What the ticket expects (verbatim)
> **Expected**
> * Report opens with the same dates and its date control shows "Custom" (as Sales, Service Advisor Analysis and Technician Efficiency do).

Source: SV-11827 description (related story SV-9582, S10-E1 / S7-R2a).

## What I did
Dashboard → each tile → custom range Oct 9 – Oct 20, 2026 → Apply → the tile's report link → read the report's date control. Done for Technician Utilization and Sales by Customer (the ticket's two) and, as controls, Revenue, Billing Efficiency and Technician Efficiency.

## What I saw
| Tile | Report opened | Date control |
|---|---|---|
| Technician Utilization | /reports/technician-utilization?dateRange=custom&dateRange=2026-10-09&dateRange=2026-10-20 | **Date: Custom** |
| Sales by Customer | /reports/sales-by-customer?dateRange=custom&dateRange=2026-10-09&dateRange=2026-10-20 | **Date: Custom** |
| Revenue (control) | /reports/sales?range=custom&range=2026-10-09&range=2026-10-20 | Date: Custom |
| Billing Efficiency (control) | /reports/service-advisor-analysis?… | Date: Custom |
| Technician Efficiency (control) | /reports/technician-efficiency?… | Date: Custom |

## Build, time, location, zones
- Build: v26.45.0-aacb66c (read from `<meta name="app-version">` on sv11839; the brief said v26.43.5-c73a58b — the branch has moved on)
- When: 4 Nov 2026, 19:40–19:43 UTC
- Location **Staging Heavy Duty - 9919**. Zones (Rule 99), all recorded in the evidence JSON: session `change-location` with `workplace_timezone=America/Edmonton` (HTTP 200) · browser `timezoneId=America/Edmonton` · process `TZ=America/Edmonton` · `localStorage['timezone']="America/Edmonton"` · header/location selector showed Staging Heavy Duty - 9919 at the start and end of the run. Note: on this machine the time-zone database (2026e) puts America/Edmonton at UTC−6, while the test browser (Chromium 153) still uses UTC−7 — see RESULTS.md, environment notes.

## Pictures (deviceScaleFactor 2)
- `SV-11827/techUtilizationKpi-report-date-control.png`
- `SV-11827/salesByCustomer-report-date-control.png`

## Evidence
SV-11827/evidence.json

No Jira or TestRail write was made.

## Draft QA-pass comment (NOT POSTED)
QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. With a custom range Oct 9 – Oct 20, 2026 on the tile, the Technician Utilization and Sales By Customer reports now open on those dates with the date control showing "Date: Custom", like the other three reports. Picture: SV-11827/techUtilizationKpi-report-date-control.png
