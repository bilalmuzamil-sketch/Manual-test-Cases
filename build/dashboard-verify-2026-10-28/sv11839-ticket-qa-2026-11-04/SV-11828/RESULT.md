# SV-11828 — Dashboard at ~1023px viewport shows small-screen "View Report" footers but keeps desktop 4-column tile layout

**Ticket:** https://shopview.atlassian.net/browse/SV-11828 (status TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com

## Verdict: PASS

## What the ticket expects (verbatim)
> **Expected**
> * Below 1024px the dashboard is in small-screen mode consistently: tiles stack in one column with "View Report" footers.

Source: SV-11828 description (related story SV-9584, S12-N1 / S6-E1, E2).

## What I did
Dashboard at a 1023 px wide viewport (as instructed), with 1022 px and 1024 px as controls. Because the original fault only appeared at a **fractional** width (the ticket: "innerWidth 1023 where actual width is fractional 1023.x"), a fourth run used a real fractional width: a 1535 px window with Chrome's own page zoom at 150 % = **1023.33 CSS px** — the browser-zoom situation the ticket describes.

## What I saw
| Width | `(max-width:1023px)` | `(max-width:1023.98px)` | Tile columns | Footers |
|---|---|---|---|---|
| 1022 px | true | true | **1** (stacked) | **View Report** ×5 |
| 1023 px | true | true | **1** (stacked) | **View Report** ×5 |
| **1023.33 px (zoom)** | **false** | **true** | **1** (stacked) | **View Report** ×5 |
| 1024 px (control) | false | false | 4 (desktop) | View details ×6 |

At 1023.33 px — the exact condition where the two checks disagree — the dashboard is now consistently small-screen.

Note: at 1024 px the header has no room to show the location name, so that control run's location was confirmed from the change-location call and the stored location only (its zone record says so).

## Build, time, location, zones
- Build: v26.45.0-aacb66c (read from `<meta name="app-version">` on sv11839; the brief said v26.43.5-c73a58b — the branch has moved on)
- When: 4 Nov 2026, 19:47–19:49 UTC
- Location **Staging Heavy Duty - 9919**. Zones (Rule 99), all recorded in the evidence JSON: session `change-location` with `workplace_timezone=America/Edmonton` (HTTP 200) · browser `timezoneId=America/Edmonton` · process `TZ=America/Edmonton` · `localStorage['timezone']="America/Edmonton"` · header/location selector showed Staging Heavy Duty - 9919 at the start and end of the run. Note: on this machine the time-zone database (2026e) puts America/Edmonton at UTC−6, while the test browser (Chromium 153) still uses UTC−7 — see RESULTS.md, environment notes.

## Pictures (deviceScaleFactor 2)
- `SV-11828/fractional-1023_33.png`
- `SV-11828/viewport-1023.png`
- `SV-11828/viewport-1024.png`

## Evidence
SV-11828/evidence.json

No Jira or TestRail write was made.

## Draft QA-pass comment (NOT POSTED)
QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty, Edmonton time. At 1023 px wide, and at 1023.33 px (browser zoom 150 % on a 1535 px window — the in-between width from the ticket), the dashboard tiles stack in one column with "View Report" footers. At 1024 px the desktop layout appears, as intended. Picture: SV-11828/fractional-1023_33.png
