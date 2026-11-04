# SV-11821 — Dashboard Revenue tile shows "1 Invoices" (plural) and date picker shows "Range: 1 days"

**Ticket:** https://shopview.atlassian.net/browse/SV-11821 (status TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com

## Verdict: PASS

## What the ticket expects (verbatim)
> **Expected**
> * Supporting line: "1 Invoice"
> * Date picker: "Range: 1 day"
> * Single-day range label shows one date

Source: SV-11821 description (related story SV-9576).

## What I did
1. As written (Heavy Duty): Dashboard → Revenue tile → date range → Oct 10, 2026 – Oct 10, 2026 → Apply. On sv11839 that day has **no invoices** (the branch's data ends ~31 Aug), so the supporting line can only read "0 Invoices".
2. Closest faithful equivalent for the "1 Invoice" line: the tile shows the invoice count only when the Parts/Labor/Other split is hidden (credits or negative revenue — the ticket's own example was "-$71.35, 1 Invoices"). No such single-invoice day existed, so one was **seeded** at Lethbridge today (4 Nov): one invoice S11839-17591 ($185.58) and a $25.00 credit memo CM-4190, customer "ZZAUTOTEST QA11839 Credit". Then Dashboard → Revenue tile → Nov 4, 2026 – Nov 4, 2026 → Apply.

## What I saw
| Check | Seen | Expected |
|---|---|---|
| Date picker footer, single day (Oct 10, Jun 20, Nov 4) | **"Range: 1 day"** | "Range: 1 day" |
| Picker header and tile date label, single day | **"Oct 10, 2026"** / **"Nov 4, 2026"** (one date) | one date |
| Revenue tile supporting line, Lethbridge Nov 4 ($151.74, 1 invoice, split hidden) | **"1 Invoice"** | "1 Invoice" |
| (for reference) Heavy Duty Oct 10 — no invoices | "$0.00", "0 Invoices" | — |

## Build, time, location, zones
- Build: v26.45.0-aacb66c (read from `<meta name="app-version">` on sv11839; the brief said v26.43.5-c73a58b — the branch has moved on)
- When: 4 Nov 2026, 19:40 UTC (Heavy Duty) and 20:31–20:33 UTC (Lethbridge)
- Location **Staging Heavy Duty - 9919 and Staging Lethbridge - 4310**. Zones (Rule 99), all recorded in the evidence JSON: session `change-location` with `workplace_timezone=America/Edmonton` (HTTP 200) · browser `timezoneId=America/Edmonton` · process `TZ=America/Edmonton` · `localStorage['timezone']="America/Edmonton"` · header/location selector showed Staging Heavy Duty - 9919 and Staging Lethbridge - 4310 at the start and end of the run. Note: on this machine the time-zone database (2026e) puts America/Edmonton at UTC−6, while the test browser (Chromium 153) still uses UTC−7 — see RESULTS.md, environment notes.

## Pictures (deviceScaleFactor 2)
- `SV-11821/revenue-tile-lethbridge-2026-11-04.png`
- `SV-11821/as_written_oct10-picker-before-apply.png`
- `SV-11821/as_written_oct10-tile-after-apply.png`

## Evidence
SV-11821/evidence.json (Heavy Duty) and SV-11821/lethbridge/evidence.json

No Jira or TestRail write was made.

## Draft QA-pass comment (NOT POSTED)
QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Edmonton time. With a one-day range the date picker now reads "Range: 1 day" and the label shows a single date ("Nov 4, 2026"). On a day with exactly one invoice and a credit (Lethbridge, Nov 4: one test invoice and one $25 test credit), the Revenue tile reads "$151.74" and "1 Invoice". Picture: SV-11821/revenue-tile-lethbridge-2026-11-04.png
