# SV-11829 — Dashboard expanded chart/table don't show load failure

**Ticket:** https://shopview.atlassian.net/browse/SV-11829 (status TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com

## Verdict: PASS

## What the ticket expects (verbatim)
> **Expected**
> * Tile shows it couldn't load, and the expanded chart and table also show a load error (not data, not "no data").

Source: SV-11829 description (related story SV-9578, S6-R15).

## What I did
Dashboard → Billing Efficiency → View details (This Month loaded normally: chart + 3 table rows). Then the Billing Efficiency dashboard request was **made to fail in the browser on purpose** (Playwright `page.route`; every `/api/dashboard/reports` request carrying `billingEfficiencyKpi` answered with an HTTP 500 error). Case A: change the tile to Last Month. Case B: change it back to This Month (loaded earlier).
Why HTTP 500 and not a blocked connection: on this sandbox a blocked connection makes the page fall onto the hosting service's "Environment Sleeping" screen (seen once this run, and recorded before in `build/report-suite/rulings-2026-08-04/RULING-1-THE-15-CASES.md`), which is not the app at all.

## What I saw
| | Tile | Expanded chart | Expanded table | Other tiles |
|---|---|---|---|---|
| Before (This Month, loaded) | 383.33% | chart drawn | 3 rows | fine |
| **Case A** — Last Month, request fails | **Couldn't load** | **Couldn't load** (no chart, no "No data…") | **Couldn't load** (0 rows) | unaffected |
| **Case B** — back to This Month, request fails | **Couldn't load** | **Couldn't load** — no old data | **Couldn't load** (0 rows) | unaffected |

Observation (not part of this ticket's Expected): with an HTTP 500 the app also shows its general red message "Ooooops! An error occurred" in the corner. The original report used a blocked connection and saw no message; a server error and a blocked connection are not the same failure.

## Build, time, location, zones
- Build: v26.45.0-aacb66c (read from `<meta name="app-version">` on sv11839; the brief said v26.43.5-c73a58b — the branch has moved on)
- When: 4 Nov 2026, 20:07–20:09 UTC
- Location **Staging Heavy Duty - 9919**. Zones (Rule 99), all recorded in the evidence JSON: session `change-location` with `workplace_timezone=America/Edmonton` (HTTP 200) · browser `timezoneId=America/Edmonton` · process `TZ=America/Edmonton` · `localStorage['timezone']="America/Edmonton"` · header/location selector showed Staging Heavy Duty - 9919 at the start and end of the run. Note: on this machine the time-zone database (2026e) puts America/Edmonton at UTC−6, while the test browser (Chromium 153) still uses UTC−7 — see RESULTS.md, environment notes.

## Pictures (deviceScaleFactor 2)
- `SV-11829/B-this-month-request-blocked.png`
- `SV-11829/A-last-month-request-blocked.png`
- `SV-11829/0-expanded-this-month-loaded.png`

## Evidence
SV-11829/evidence.json

No Jira or TestRail write was made.

## Draft QA-pass comment (NOT POSTED)
QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. I made the Billing Efficiency data fail to load on purpose (the browser answered that request with a server error) while the tile was expanded. For a range never loaded before (Last Month) and for one loaded earlier (This Month), the tile, the expanded chart and the Advisor Analysis table all say "Couldn't load" — no "No data" message and no old figures. Picture: SV-11829/B-this-month-request-blocked.png
