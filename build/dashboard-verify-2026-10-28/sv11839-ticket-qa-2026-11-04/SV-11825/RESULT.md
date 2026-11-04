# SV-11825 — Dashboard tile report links have duplicated accessible label ("Open Sales Report report")

**Ticket:** https://shopview.atlassian.net/browse/SV-11825 (status TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com

## Verdict: PASS

## What the ticket expects (verbatim)
> **Expected**
> * Accessible label reads e.g. "Open Sales Report"

Source: SV-11825 description (related story SV-9582).

## What I did
Dashboard → read the accessible label (`aria-label`) of the report link icon next to each of the five tile labels, and hover each for its tooltip.

## What I saw
| Tile | Accessible label now | Hover tooltip |
|---|---|---|
| Revenue | **Open Sales Report** | Sales Report |
| Billing Efficiency | **Open Advisor Analysis Report** | Advisor Analysis Report |
| Technician Efficiency | **Open Technician Efficiency Report** | Technician Efficiency Report |
| Technician Utilization | **Open Technician Utilization Report** | Technician Utilization Report |
| Sales by Customer | **Open Sales By Customer Report** | Sales By Customer Report |

No label repeats "report".

## Build, time, location, zones
- Build: v26.45.0-aacb66c (read from `<meta name="app-version">` on sv11839; the brief said v26.43.5-c73a58b — the branch has moved on)
- When: 4 Nov 2026, 19:40 UTC
- Location **Staging Heavy Duty - 9919**. Zones (Rule 99), all recorded in the evidence JSON: session `change-location` with `workplace_timezone=America/Edmonton` (HTTP 200) · browser `timezoneId=America/Edmonton` · process `TZ=America/Edmonton` · `localStorage['timezone']="America/Edmonton"` · header/location selector showed Staging Heavy Duty - 9919 at the start and end of the run. Note: on this machine the time-zone database (2026e) puts America/Edmonton at UTC−6, while the test browser (Chromium 153) still uses UTC−7 — see RESULTS.md, environment notes.

## Pictures (deviceScaleFactor 2)
- `SV-11825/revenue-link-hover-tooltip.png`

## Evidence
SV-11825/evidence.json

No Jira or TestRail write was made.

## Draft QA-pass comment (NOT POSTED)
QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. The five tile report links are now read out once each: "Open Sales Report", "Open Advisor Analysis Report", "Open Technician Efficiency Report", "Open Technician Utilization Report", "Open Sales By Customer Report". Picture: SV-11825/revenue-link-hover-tooltip.png
