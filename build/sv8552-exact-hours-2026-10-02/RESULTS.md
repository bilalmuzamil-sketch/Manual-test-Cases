# SV-8552 revision 2 — raw measurements

Branch `sv8552.qa.shopview.com`, build **`v26.40.2-b57d7c7`**, 2 Oct 2026, viewport 1700 × 1050
unless stated. Timeline width 1176 px. Shop hours Mon/Tue/Thu/Fri 9:00–17:00, Wed 8:30–16:30,
Sat/Sun closed.

Window read by a least-squares fit of hour-label x against hour value (residual ±0.4 px on every
reading), then `scrollLeft` and the container edges converted back to times.

**The rule that held on every day measured:**
`scrollLeft = round(openHour × pxPerHour) − 4` and `pxPerHour = floor((1176 − 4) ÷ windowHours)`

## Day-by-day, as found

| Day | Shop hours | Jobs that count | Expected window | Measured | px/h | scrollLeft | predicted |
|---|---|---|---|---|---|---|---|
| Wed 30 Sep | 8:30–16:30 | none | 8:30 – 4:30 | 8:27 AM → 4:30 PM | 146 | 1238 | 1237 |
| Thu 1 Oct | 9–17 | event 8:15–10:15, event 16:00–20:45, shifts 15:00–16:49 and 20:45–21:17 | 8:15 AM – 9:17 PM | 8:09 AM → 9:22 PM | 89 | 731 | 730 |
| Fri 2 Oct (today) | 9–17 | shift 11:00–19:00 | 9 AM – 7 PM | 8:55 AM → 6:58 PM | 117 | 1049 | 1049 |
| Sat 3 / Sun 4 Oct | closed | — | old 24-hour layout | 1:17 AM → 11:54 PM | 52.01 | 72 | — |
| Mon 5 Oct | 9–17 | shift 09:00–12:25; *Jarod off* multi-day | 9 AM – 5 PM | 8:56 AM → 4:59 PM | 146 | 1310 | 1310 |
| Tue 6 Oct | 9–17 | *Jarod off* runs in from Monday | 9 AM – 5 PM | 8:56 AM → 4:59 PM | 146 | 1310 | 1310 |
| Wed 7 Oct | 8:30–16:30 | none | 8:30 – 4:30 | 8:27 AM → 4:30 PM | 146 | 1238 | 1237 |
| Thu 8 Oct | 9–17 | none (before seeding) | 9 AM – 5 PM | 8:56 AM → 4:59 PM | 146 | 1310 | 1310 |
| Fri 9 Oct | 9–17 | none | 9 AM – 5 PM | 8:56 AM → 4:59 PM | 146 | 1310 | 1310 |

## Section B, seeded on Thu 8 Oct

| Step | Expected | Measured | px/h | scrollLeft | predicted |
|---|---|---|---|---|---|
| events 7:30–9:30 AM and 4:00–7:00 PM | exactly 7:30 AM – 7:00 PM | 7:25 AM → 7:03 PM | 101 | 754 | 754 |
| plus an event 5:00–6:00 AM | starts 5 AM | 4:53 AM → 7:03 PM | 83 | 411 | 411 |
| the 5 AM block's own edges | left border and corner fully visible | block 527…610, timeline starts 523 → **4 px inside**; width 83 = one hour; radius 8 px | | | |
| department hidden, then refreshed | window unchanged | 4:53 AM → 7:03 PM, byte-identical; lanes 13 → 0, events 3 → 0 | 83 | 411 | 411 |

## Section C

| Case | Expected | Measured | px/h | scrollLeft |
|---|---|---|---|---|
| all-day event, Fri 9 Oct | unchanged 9 AM – 5 PM | 8:56 AM → 4:59 PM | 146 | 1310 |
| overnight 11:00 PM Mon 12 → 3:15 AM Tue 13 — start day | unchanged | 8:56 AM → 4:59 PM | 146 | 1310 |
| …end day | unchanged, must not start at 12 AM | 8:56 AM → 4:59 PM | 146 | 1310 |
| event 9:00 PM – 12:00 AM, Thu 15 Oct | widens to midnight | 8:51 AM → 11:56 PM | 78 | 696 |
| multi-day **work-order shift** Tue 20 Oct 2 PM → Wed 21 Oct 8 PM — Tue | unchanged | 8:56 AM → 4:59 PM | 146 | 1310 |
| …Wed | unchanged (8:30 day) | 8:27 AM → 4:30 PM | 146 | 1238 |

## Sticky names

Day view, Fri 9 Oct, all-day bar, `position: sticky`:

| scrollLeft | bar | name | inside the timeline |
|---|---|---|---|
| on open | −787…2717 | 531…733 | yes |
| 0 | 523…4027 | 532…734 | yes |
| 700 | −177…3327 | 531…733 | yes |
| 1500 | −977…2527 | 531…733 | yes |
| 2328 | −1805…1699 | 531…733 | yes |

Week view at 700 px, multi-day bar *Jarod off*, timeline starts at 223:

| scrollLeft | bar | visible bar | name | readable |
|---|---|---|---|---|
| 0 | 229…425 | 196 px | 238…336 | yes |
| 60 | 169…365 | 142 px | 231…329 | yes (pinned at 223+8) |
| 120 | 109…305 | 82 px | 198…296 | yes — "Jarod off" reads in full |
| 180 | 49…245 | 22 px | 138…236 | no — only "PM" of the time line shows |

## Cards

| Case | Name ends | Card opens | Timeline |
|---|---|---|---|
| hover, cut-off all-day bar | 733 | tooltip at x 531, y 291 | 523…1699 |
| hover, scrolled to 12 AM | 734 | tooltip at x 532 | 523…1699 |
| click, cut-off all-day bar | 734 | event card at **746**, width 340 | 523…1699 |
| click, cut-off multi-day WO shift | 771 | shift card at **783**, width 460 | 523…1699 |
| ordinary visible block (527…610) | — | tooltip centred at 422; card at 622 | 523…1699 |

## Resizing

| Width | Timeline | px/h | scrollLeft | Window |
|---|---|---|---|---|
| 1700 | 1176 | 83 | 411 | 4:53 AM → 7:03 PM |
| 1400 | 876 | 62.01 | 306 | 4:51 AM → 6:59 PM |
| 1200 | 676 | 52.01 | 256 | 4:49 AM → 5:49 PM (minimum hour width; window no longer fits) |
| 1700 | 1176 | 83 | 411 | back to 4:53 AM → 7:03 PM |
| 700 (fresh load, today) | 476 | 52.01 | 290 | **5:28 AM** with the clock at 6:04 AM |

Divider drags (Thu 8 Oct): timeline 1176 → 1026 → 1176 → 1326 → 1176 px, giving 83 → 73 → 83 → 94 →
83 px/h, window start held throughout, right edge never cut.

## Day changes

| Transition | Scroll states recorded |
|---|---|
| Wed 7 Oct → Thu 8 Oct | 1238 at 0 ms, 754 at 417 ms — two states |
| Fri 2 Oct → Sat 3 Oct (closed) | 1049 at 0 ms, 72 at 460 ms — two states |

## Click-to-create and drag-to-schedule

| Action | Pointer | Result |
|---|---|---|
| click near the right end | 18:31 | menu reads 18:30 |
| click | 17:22 | 17:15 |
| click | 15:37 | 15:30 |
| click | 13:17 | 13:15 |
| drag a work order to a technician lane | 12:06 | `POST /api/schedule/shifts` 201, `startTime 12:00`, staff set |
| drag a work order to a department lane | 13:28 | `POST /api/schedule/shifts` 201, `startTime 13:15`, department set, no staff |

## Locations

| Location | Hours source | Day view |
|---|---|---|
| Staging Heavy Duty - 9919 | `business` | the window, as above |
| Staging Lethbridge - 4310 | `default` (nothing saved) | full 24-hour grid, 52 px/h, scrollLeft 72 — the old layout |
| Heavy Duty, Friday changed to 7:00–3:00 | `business` | 7 AM → 3 PM, 146 px/h, scrollLeft 1018 = 7×146−4 |
| Heavy Duty, Friday restored to 9:00–5:00 | `business` | back to 9 AM → 5 PM, scrollLeft 1310 |
