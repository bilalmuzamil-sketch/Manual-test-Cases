# SV-11820 — Service Advisor Analysis excludes invoices with an inactive service advisor; Dashboard Billing Efficiency understated

**Ticket:** https://shopview.atlassian.net/browse/SV-11820 (status TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com

## Verdict: PASS

## What the ticket expects (verbatim)
> **Expected**
> * Invoices with an inactive service advisor are still included in Service Advisor Analysis (grouped under that advisor).
> * Billing Efficiency numerator includes them, same as the worked-hours denominator.

Source: SV-11820 description (related story SV-9575, "Billing Efficiency must match Service Advisor Analysis").

## What I did
sv11839 had no invoice whose advisor had been deleted (checked by reading Sales and Service Advisor Analysis for the last 12 months at Heavy Duty and Lethbridge: the only invoices missing from Service Advisor Analysis were work orders with no advisor at all — 4 at Heavy Duty (10.18 h), 14 at Lethbridge (65.99 h)). So the ticket's case was **seeded** (ZZAUTOTEST, Heavy Duty, 4 Nov): a throwaway staff member "ZZAUTOTEST Advisor QA11839" was made the service advisor of work order **S11839-17594** (one 1.00 h line, 0.50 h clocked), the work order was invoiced, then the staff member was **deleted** — the work order then shows the advisor as unknown/inactive. Then the ticket's own steps were followed with range **This month**: Reports → Sales; Reports → Service Advisor Analysis; Dashboard → Billing Efficiency tile (+ View details).

## What I saw
| Screen (This month, Heavy Duty) | Invoiced hrs | Worked/Clocked hrs | Billing Efficiency |
|---|---|---|---|
| Reports → Sales (Totals) | **8.75** | — | **250.00%** |
| Reports → Service Advisor Analysis (Totals) | **8.75** | 3.50 | **250.00%** |
| Dashboard → Billing Efficiency tile | **8.75 Invoiced** | 3.50 Clocked | **250.00%** |

Service Advisor Analysis lists **S11839-17594** with advisor **"Unknown (Inac…"** (the column cuts off "Unknown (Inactive)"), 1.00 h invoiced. The Dashboard's expanded table has an **"Unknown (Inactive)"** row (0.50 / 1.00 / 200.00%). The server agrees for the seed day: Sales 5.00 h, Service Advisor Analysis 5.00 h, tile 5.00 / 3.50 = 142.86% before and after the deletion.

Not covered by this ticket's Expected (noted, not judged): invoices whose work order has **no advisor at all** are still left out of Service Advisor Analysis (the developer's comment says this is by design).

## Build, time, location, zones
- Build: v26.45.0-aacb66c (read from `<meta name="app-version">` on sv11839; the brief said v26.43.5-c73a58b — the branch has moved on)
- When: 4 Nov 2026, 20:38–20:39 UTC (≈ 1:38 PM Edmonton)
- Location **Staging Heavy Duty - 9919**. Zones (Rule 99), all recorded in the evidence JSON: session `change-location` with `workplace_timezone=America/Edmonton` (HTTP 200) · browser `timezoneId=America/Edmonton` · process `TZ=America/Edmonton` · `localStorage['timezone']="America/Edmonton"` · header/location selector showed Staging Heavy Duty - 9919 at the start and end of the run. Note: on this machine the time-zone database (2026e) puts America/Edmonton at UTC−6, while the test browser (Chromium 153) still uses UTC−7 — see RESULTS.md, environment notes.

## Pictures (deviceScaleFactor 2)
- `SV-11820/2-service-advisor-analysis-this-month.png`
- `SV-11820/1-sales-report-this-month.png`
- `SV-11820/3-dashboard-billing-efficiency-this-month.png`

## Evidence
SV-11820/evidence.json; seed ids in ../seed-ids.json (ADV3) and every seed call in ../seed-log.jsonl

No Jira or TestRail write was made.

## Draft QA-pass comment (NOT POSTED)
QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. I made a test work order (S11839-17594), gave it a test service advisor, invoiced it, then deleted that advisor. Service Advisor Analysis still lists the invoice, under "Unknown (Inactive)". For This month the three screens agree: Sales 8.75 invoiced hours / 250.00%, Service Advisor Analysis 8.75 / 250.00%, Dashboard Billing Efficiency 250.00% (8.75 Invoiced / 3.50 Clocked). Picture: SV-11820/2-service-advisor-analysis-this-month.png
