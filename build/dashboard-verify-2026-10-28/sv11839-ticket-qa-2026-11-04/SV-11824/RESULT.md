# SV-11824 — Dashboard date picker: first date click clears the existing range instead of selecting the date

**Ticket:** https://shopview.atlassian.net/browse/SV-11824 (status TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com

## Verdict: PASS

## What the ticket expects (verbatim)
> **Expected**
> * Oct 9 is selected as the start of a new range (header shows "Oct 9, 2026", Range: 1 days).

Source: SV-11824 description (related story SV-9579). (The wording "1 days" was itself corrected to "1 day" by SV-11821.)

## What I did
Dashboard → Revenue tile → click the date chip (shows This Month) → click one date once. Done three ways: (a) as written — go to October, click Oct 9 once; (b) a date inside the current This Month range (Nov 2) — the cause named by the developer; (c) with a custom range already set (Oct 9 – Oct 15), reopen and click Oct 12 once.

## What I saw
| Case | Header after ONE click | Footer |
|---|---|---|
| (a) Oct 9, as written | **"Oct 9, 2026"** | **"Range: 1 day"** |
| (b) Nov 2, inside This Month (Nov 1–4) | **"Nov 2, 2026"** | **"Range: 1 day"** |
| (c) Oct 12, inside the set range Oct 9–15 | **"Oct 12, 2026"** | **"Range: 1 day"** |

A second click closed the range as before (Oct 9 → Oct 15 gave "Oct 9, 2026 — Oct 15, 2026", "Range: 7 days").

## Build, time, location, zones
- Build: v26.45.0-aacb66c (read from `<meta name="app-version">` on sv11839; the brief said v26.43.5-c73a58b — the branch has moved on)
- When: 4 Nov 2026, 19:40–19:41 UTC
- Location **Staging Heavy Duty - 9919**. Zones (Rule 99), all recorded in the evidence JSON: session `change-location` with `workplace_timezone=America/Edmonton` (HTTP 200) · browser `timezoneId=America/Edmonton` · process `TZ=America/Edmonton` · `localStorage['timezone']="America/Edmonton"` · header/location selector showed Staging Heavy Duty - 9919 at the start and end of the run. Note: on this machine the time-zone database (2026e) puts America/Edmonton at UTC−6, while the test browser (Chromium 153) still uses UTC−7 — see RESULTS.md, environment notes.

## Pictures (deviceScaleFactor 2)
- `SV-11824/as-written-first-click-oct9.png`
- `SV-11824/this-month-first-click-nov2.png`
- `SV-11824/custom-range-set-first-click-oct12.png`

## Evidence
SV-11824/evidence.json

No Jira or TestRail write was made.

## Draft QA-pass comment (NOT POSTED)
QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. In the Revenue tile's date picker, one click on a date now selects it straight away: Oct 9 → "Oct 9, 2026", "Range: 1 day". The same happens for a date inside the current range (Nov 2) and when a custom range is already set (Oct 12). Picture: SV-11824/as-written-first-click-oct9.png
