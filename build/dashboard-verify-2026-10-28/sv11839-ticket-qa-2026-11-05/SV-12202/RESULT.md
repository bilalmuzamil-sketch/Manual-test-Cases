# SV-12202 — Parts Velocity: Last Sale counts 24-hour periods instead of calendar days

**Ticket:** https://shopview.atlassian.net/browse/SV-12202 (TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com · **Fix:** 277b24901, which is in the build tested.

## Verdict: PASS

## What the ticket expects (verbatim)
> Expected: Last Sale reads 1 day : today's date minus the sale date, in the location's time zone. It goes up by 1 each time the date changes at midnight.

Source:
- The ticket (`tickets-2026-11-04/filed/SV-12202.html`).
- Chris Ward, "Dashboard and Reports – questions for Chris Ward (28 Oct 2026)", Section 3, question 40: *"Calendar days in the location's time zone, the same as Days Open on Work In Progress (question 4). A part sold yesterday reads 1 day this morning. S5-R4 gets updated. Defect."*

## What I did (Staging Heavy Duty - 9919, America/Edmonton, the ticket's own location)
1. **Late in the evening (location time):**
   - Made a stocked part **ZZAUTOTEST-PV12202-11050521** (set-up).
   - On work order **S11839-17598**, added the part and **picked** it on screen.
   - Completed the line and created the invoice at **05:23:16 UTC on 5 Nov**, which is **4 Nov, 11:23 PM** at Heavy Duty.
2. **Same evening (control):** Reports → **Parts Velocity** → Date **Last 12 months** → Location **All locations** → searched the part number → read **Last Sale**.
3. **Just after midnight (location time):** the same read again, once, at **07:06 UTC** — **5 Nov, 1:06 AM** at Heavy Duty. That is 1 h 43 min after the sale, so less than 24 hours.

## What I saw
| Read | Location time | Hours since the sale | Last Sale | Expected |
|---|---|---|---|---|
| Control, same day | 4 Nov, 11:33 PM | 0.2 h | **0 days** | 0 days |
| **After midnight** | **5 Nov, 1:06 AM** | **1.7 h** | **1 day** | **1 day** (5 Nov − 4 Nov) |

**Time-zone note:**
- This machine's time-zone data puts Edmonton at UTC−6, so the sale was at 11:23 PM and the read at 1:06 AM.
- The test browser uses UTC−7, so the sale was at 10:23 PM and the read at 12:05 AM.
- Under both, the sale is on 4 Nov and the read on 5 Nov, so the result does not depend on which is right.

## Build, time, location, zones
- Build **v26.45.0-277b249**: recorded at the sale (05:22 UTC) and at both reads, and re-read at 07:06 UTC.
- Zones (Rule 99), recorded in `pv-*.json` and `setup-sale.json`: change-location `workplace_timezone=America/Edmonton` (200) · browser `timezoneId` America/Edmonton · process `TZ` America/Edmonton · `localStorage['timezone']` "America/Edmonton" · header showing the location at the start and end of every run.

## Pictures
`SV-12202/pv-last-sale-after-midnight.png` (1 day), `SV-12202/pv-last-sale-control-same-day.png` (0 days), `SV-12202/setup-1-part-picked.png`.

## Evidence
`pv-control-same-day.json`, `pv-after-midnight.json` (filters, headings, the row, the read time), `setup-sale.json`, and `../seed-log.jsonl`.

No Jira or TestRail write was made.

## Draft QA-pass comment (NOT POSTED)
QA check on the QA branch sv11839 (build v26.45.0-277b249), Staging Heavy Duty - 9919, Edmonton time.

I sold a test part (ZZAUTOTEST-PV12202-11050521, work order S11839-17598) on **4 Nov at 11:23 PM**. In Reports → Parts Velocity (Last 12 months, All locations):
- At 11:33 PM the same evening, Last Sale read **0 days**.
- Just after midnight, at **1:06 AM on 5 Nov**, it read **1 day**, although less than 2 hours had passed.

So Last Sale now counts calendar days in the location's time zone.

Picture: SV-12202/pv-last-sale-after-midnight.png
