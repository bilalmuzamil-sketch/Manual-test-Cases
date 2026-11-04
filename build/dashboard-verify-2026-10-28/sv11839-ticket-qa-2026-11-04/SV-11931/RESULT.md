# SV-11931 — Dashboard - Technician Efficiency counts a line the customer declined

**Ticket:** https://shopview.atlassian.net/browse/SV-11931 (status TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com

## Verdict: PASS

## What the ticket expects (verbatim)
> **Expected:** Fabian Bonjean shows **1.00** Invoiced Tech Hrs, **1.00** Clocked, **100.00 %**. Only line 1 was billed: 1.00 ÷ 1.00 = 100 %.

Source: SV-11931 description; Chris Ward's answer to question 1 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026): *"(b) Only billed lines count. A declined line wasn't invoiced, so its tech time shouldn't count either. Defect."*; confirmed by Chris Ward on SV-11931 (29 Oct 2026, comment 79842): *"neither its tech time nor its clocked time … in the Invoiced view, on each invoiced work order, count only the lines that are not declined … 1.00 Invoiced Tech Hrs / 1.00 Clocked = 100.00%."*

## What I did
DVI Test, Fabian Bonjean and S1-38198 are staging-only, so the ticket's setup was **seeded** the same way at Heavy Duty (ZZAUTOTEST, 4 Nov): work order **S11839-17589** (customer "ZZAUTOTEST QA11839 TE Declined") with line 1 **Complete** (1.00 h tech time, 1.00 h clocked) and line 2 **Declined** (1.00 h tech time, 0.50 h clocked), both clocked by technician **Michael Stephenson**, then invoiced (the invoice bills line 1 only: Labor $164.95). Then Dashboard → Technician Efficiency tile → range → View details → his row; and Reports → Technician Efficiency → Invoiced. Range: **Nov 4, 2026** (the seed day) — under Last 12 Months his row also holds months of older work, so the ticket's expected figures can only be read on the seed day.

## What I saw
| Where | Michael Stephenson | Expected |
|---|---|---|
| Dashboard → Technician Efficiency → View details (Nov 4) | **1.00 Clocked · 1.00 Invoiced Tech Hrs · 100.00%** | 1.00 / 1.00 / 100.00% |
| Reports → Technician Efficiency → Invoiced (Nov 4) | chart point **100%** | 100% |

Work order Lines tab: line 1 "1.00 / 1.00 Complete", line 2 "0.50 / 1.00 Declined". Finance tab: invoice INV-S11839-17589 lists only line 1. If the declined line were still counted, the row would read 2.00 / 1.50 = 133.33%.

## Build, time, location, zones
- Build: v26.45.0-aacb66c (read from `<meta name="app-version">` on sv11839; the brief said v26.43.5-c73a58b — the branch has moved on)
- When: 4 Nov 2026, 20:10–20:15 UTC
- Location **Staging Heavy Duty - 9919**. Zones (Rule 99), all recorded in the evidence JSON: session `change-location` with `workplace_timezone=America/Edmonton` (HTTP 200) · browser `timezoneId=America/Edmonton` · process `TZ=America/Edmonton` · `localStorage['timezone']="America/Edmonton"` · header/location selector showed Staging Heavy Duty - 9919 at the start and end of the run. Note: on this machine the time-zone database (2026e) puts America/Edmonton at UTC−6, while the test browser (Chromium 153) still uses UTC−7 — see RESULTS.md, environment notes.

## Pictures (deviceScaleFactor 2)
- `SV-11931/1-dashboard-te-today-stephen-grimes.png`
- `SV-11931/3-work-order-lines.png`
- `SV-11931/4-work-order-finance.png`
- `SV-11931/5-report-technician-efficiency-today.png`

## Evidence
SV-11931/evidence.json (picture names say "stephen-grimes" because the staff list showed that name for the technician id used; the work order and Dashboard show the technician as Michael Stephenson)

No Jira or TestRail write was made.

## Draft QA-pass comment (NOT POSTED)
QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. I made a test work order (S11839-17589) with one completed line (1.00 h clocked) and one declined line (0.50 h clocked), both 1.00 h of tech time, and invoiced it. On the Dashboard, Technician Efficiency → View details, the technician now shows 1.00 Clocked, 1.00 Invoiced Tech Hrs and 100.00% — the declined line is left out, as Chris asked. Picture: SV-11931/1-dashboard-te-today-stephen-grimes.png
