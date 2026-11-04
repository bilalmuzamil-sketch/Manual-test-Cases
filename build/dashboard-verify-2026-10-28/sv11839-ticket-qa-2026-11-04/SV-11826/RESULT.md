# SV-11826 — Dashboard Technician Utilization tile hours differ from Technician Utilization report by 0.02–0.03 hrs

**Ticket:** https://shopview.atlassian.net/browse/SV-11826 (status TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com

## Verdict: PASS (no difference when the tile and the report are read at the same moment) — see the caveat

## What the ticket expects (verbatim)
> **Expected**
> * Tile hours equal report Summary hours (S3-R1).

Source: SV-11826 description (related story SV-9575, S3-R1). Comments: Mudassir Qamar (27 Oct, comment 79567) could not reproduce when both were read at the same moment; the developer (comment 79615) proposes closing as Not a Bug.

## What I did
By the ticket's steps on screen (Dashboard → Technician Utilization tile → range → the tile's report link → report Summary row), at Heavy Duty, for **Last 12 Months** (the ticket's range), **Custom 32 days** and **Custom 366 days** ending today (where the coordinator's API read showed a 0.02–0.04 h gap), and for three ranges that end in the past (Last Year; Sep 1 – Oct 2, 2026; Oct 31, 2025 – Oct 31, 2026). Then, to separate "read at different moments" from a real difference, the tile request and the report request were fired at the same instant, 4 rounds × 4 ranges (`simultaneous-reads.json`).

## What I saw
**On screen, ranges that include today** (the report is read ≈ 15–25 s after the tile, and technicians' clocks were still running — the hours rose 0.06 WO / 0.12 clocked between 19:28 and 19:31 UTC):

| Range | Tile (WO / Clocked) | Report Summary (WO / Total) | Gap |
|---|---|---|---|
| Last 12 Months, 19:28 | 17,820.02 / 23,550.32 | 17,820.02 / 23,550.32 | none |
| Last 12 Months, 19:31 | 17,820.08 / 23,550.44 | 17,820.12 / 23,550.52 | 0.04 / 0.08 |
| Custom 32 days | 1,517.06 / 3,032.10 | 1,517.06 / 3,032.10 | none |
| Custom 366 days | 19,238.96 / 25,284.99 | 19,238.98 / 25,285.02 | 0.02 / 0.03 |

**On screen, ranges that end in the past** (nothing can change): Last Year 20,435.47 / 25,009.99 · Sep 1 – Oct 2 1,536.00 / 3,072.00 · Oct 31 2025 – Oct 31 2026 19,199.07 / 25,113.91 — **tile and report identical in all three**, and the report's seconds ÷ 3,600 equal the tile.

**Tile and report requested at the same instant** (16 pairs): **15 identical**, 1 differed by 0.01 h with the tile higher, the two answers 0.4 s apart while clocks were running.

So the hours match whenever both are read at the same moment; the gaps seen on screen come only from the report being read seconds after the tile while clocks are running. This contradicts the earlier reading in `rerun-sv11839-2026-11-04/SUMMARY-sv11839-2026-11-04.md` (row B) that the gap is the tile's own rounding.

**Caveat for the QA lead:** the ticket's Expected does not say how running clocks should be treated. A person following the steps while technicians are clocked in will see a few hundredths' difference, because the report is opened after the tile. The decision is yours (recommendation in RESULTS.md).

## Build, time, location, zones
- Build: v26.45.0-aacb66c (read from `<meta name="app-version">` on sv11839; the brief said v26.43.5-c73a58b — the branch has moved on)
- When: 4 Nov 2026, 19:28–19:39 UTC (≈ 1:28–1:39 PM Edmonton)
- Location **Staging Heavy Duty - 9919**. Zones (Rule 99), all recorded in the evidence JSON: session `change-location` with `workplace_timezone=America/Edmonton` (HTTP 200) · browser `timezoneId=America/Edmonton` · process `TZ=America/Edmonton` · `localStorage['timezone']="America/Edmonton"` · header/location selector showed Staging Heavy Duty - 9919 at the start and end of the run. Note: on this machine the time-zone database (2026e) puts America/Edmonton at UTC−6, while the test browser (Chromium 153) still uses UTC−7 — see RESULTS.md, environment notes.

## Pictures (deviceScaleFactor 2)
- `SV-11826/past-last-year-1-tile.png`
- `SV-11826/past-last-year-2-report-summary.png`
- `SV-11826/last-12-months-1-tile.png`
- `SV-11826/last-12-months-2-report-summary.png`

## Evidence
SV-11826/evidence.json (ranges ending today), SV-11826/past/evidence.json (past ranges), SV-11826/simultaneous-reads.json

No Jira or TestRail write was made.

## Draft QA-pass comment (NOT POSTED)
QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. For ranges that end in the past the tile and the report Summary show exactly the same hours (Last Year: 20,435.47 WO / 25,009.99 clocked on both). When the tile and the report are read at the same moment they also match for Last 12 Months, 32 days and 366 days (15 of 16 reads identical, one 0.01 apart). The small gaps seen earlier come from opening the report a few seconds after the tile while technicians are still clocked in. Picture: SV-11826/past-last-year-2-report-summary.png
