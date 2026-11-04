# SV-11823 — Dashboard Revenue tile shows negative Parts % and Labor over 100% when credit memos are in range

**Ticket:** https://shopview.atlassian.net/browse/SV-11823 (status TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com

## Verdict: PASS

## What the ticket expects (verbatim)
> **Expected**
> * Supporting line shows a sensible split (no negative share, no share above 100%), or the tile falls back to "{count} Invoices" like it does when revenue is negative.

Source: SV-11823 description. Product decision (Chris Ward, 28 Oct 2026, "Dashboard and Reports – questions for Chris Ward", question 3, as posted by Bilal Muzamil on SV-11823, comment 79712): *"Hide the split line whenever any share is negative. Only show it when all three are 0% or more. Defect."* and *"Please keep showing the split line whenever all three shares are 0 % or more, including when one of them is exactly 0 %."*

## What I did
The ticket's day (Oct 9, 2026 at Heavy Duty) has no data on sv11839. Equivalent single days at **Lethbridge** (Dashboard → Revenue tile → one-day custom range → Apply, then the tile's report link → Sales report for that day):
- **Jul 22, 2026** — existing data with a credit memo (CM11839-3821, −$484.45).
- **Nov 4, 2026** — seeded: invoice S11839-17591 + credit memo CM-4190 (−$25.00).
- **Apr 7, 2026** — existing data where Parts is exactly $0.00 (the "exactly 0 %" case).

## What I saw
| Day (Lethbridge) | Sales report: Parts Invoiced | Revenue | Tile supporting line | Expected |
|---|---|---|---|---|
| Jul 22, 2026 | **−$306.79** (credit −$484.45) | $1,079.42 | **"4 Invoices"** (split hidden) | split hidden → "{count} Invoices" |
| Nov 4, 2026 | **−$25.00** | $151.74 | **"1 Invoice"** (split hidden) | split hidden → "{count} Invoices" |
| Apr 7, 2026 | **$0.00** | $298.29 | **"Parts 0% · Labor 90% · Other 10%"** | split shown (all ≥ 0 %, one exactly 0 %) |

## Build, time, location, zones
- Build: v26.45.0-aacb66c (read from `<meta name="app-version">` on sv11839; the brief said v26.43.5-c73a58b — the branch has moved on)
- When: 4 Nov 2026, 20:31–20:33 UTC
- Location **Staging Lethbridge - 4310**. Zones (Rule 99), all recorded in the evidence JSON: session `change-location` with `workplace_timezone=America/Edmonton` (HTTP 200) · browser `timezoneId=America/Edmonton` · process `TZ=America/Edmonton` · `localStorage['timezone']="America/Edmonton"` · header/location selector showed Staging Lethbridge - 4310 at the start and end of the run. Note: on this machine the time-zone database (2026e) puts America/Edmonton at UTC−6, while the test browser (Chromium 153) still uses UTC−7 — see RESULTS.md, environment notes.

## Pictures (deviceScaleFactor 2)
- `SV-11823/revenue-tile-lethbridge-2026-07-22.png`
- `SV-11823/revenue-tile-lethbridge-2026-04-07.png`
- `SV-11823/sales-report-lethbridge-2026-07-22.png`

## Evidence
SV-11823/evidence.json

No Jira or TestRail write was made.

## Draft QA-pass comment (NOT POSTED)
QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Lethbridge, Edmonton time. On a day where credits make Parts negative (Jul 22: Parts −$306.79) the Revenue tile no longer shows the split and reads "4 Invoices"; same on Nov 4 (Parts −$25.00 → "1 Invoice"). On a day where Parts is exactly $0.00 (Apr 7) the split is still shown: "Parts 0% · Labor 90% · Other 10%". Picture: SV-11823/revenue-tile-lethbridge-2026-07-22.png
