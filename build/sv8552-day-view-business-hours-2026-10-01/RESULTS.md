# SV-8552 — raw measurements (branch)

All readings at viewport **1700 x 1050**, location **Staging Heavy Duty - 9919**,
saved hours **Mon/Tue/Thu/Fri 9:00–5:00, Wed 8:30–4:30, Sat/Sun closed**.
Window read by `ev/measure.js`: it finds the timeline scroll container, derives
pixels-per-hour from the median gap between hour labels, and converts
`scrollLeft` and `clientWidth` into a start and end hour.

## A — the window on a normal day
| Check | Expected | Measured |
|---|---|---|
| Friday 2 Oct, no jobs outside hours | 8 AM – 6 PM, fills the screen | **8 AM → 6 PM**, 10.05 h at 117 px/h |
| Scroll fully left | reaches 12 AM | **12 AM** |
| Scroll fully right | reaches 11 PM | ends at **12 AM** (11 PM visible) |
| Wednesday 7 Oct (8:30 – 4:30) | 7 AM – 6 PM | **7 AM → 6 PM**, 11.09 h at 106 px/h |

## B — jobs outside business hours (Thursday 1 Oct)
Board data for the day, read from the API:
`ZZAUTOTEST SV8552 early` 7:30–9:30 AM · `ZZAUTOTEST SV8552 late` 4:00–8:45 PM ·
`ZZAUTOTEST SV8552 allday real` 12:00 AM – 11:59 PM (a true all-day event).

| Check | Expected | Measured |
|---|---|---|
| Two events outside hours | 6 AM – 8 PM, then 10 PM once the late one ends 8:45 PM | **6 AM → 10 PM**, 16.11 h at 73 px/h (7:30 − 1 h → 6 AM; 8:45 PM + 1 h → 10 PM) |
| Hide the department holding them, refresh | window unchanged | both events moved into **Service** first, then hidden: lanes **15 → 1**, events rendered **2 → 0**, window **byte-identical** (6 AM → 11 PM, 69 px/h, scrollLeft 415) |
| Add an all-day event | window does not change | unchanged — the all-day event does not widen it |
| A day whose event runs past midnight | window starts 12 AM | **Tue 6 Oct → 12 AM → 8 PM** (the "Jarod off" event runs Mon 6:00 AM → Tue 7:00 PM) |

## C — Today
Local time at the reading was **2:16 AM**; today's window was 6 AM – 11 PM.
Opened on **6 AM** — the window start, not the current time. After 60 s the view was
byte-identical (scrollLeft 415, 69 px/h): no jump.

## D — moving between days
| Day | Window |
|---|---|
| Fri 2 Oct (9–5, no jobs) | 8 AM → 6 PM (117 px/h) |
| Sat 3 Oct (closed) | 52 px/h, full 24 h grid — the old layout |
| Sun 4 Oct (closed) | 52 px/h, full 24 h grid |
| Mon 5 Oct | 5 AM → 12 AM (61 px/h) — "Jarod off" starts 6:00 AM and runs past midnight |
| Tue 6 Oct | 12 AM → 8 PM (58 px/h) — the same event ends 7:00 PM |
| Day → Week → Day | returns to 6 AM → 10 PM, unchanged |

Reached by the arrows **and** by a fresh page load: identical windows both ways.
**No double jump** — sampling the scroll container every 100 ms through a day change
recorded exactly two states: the starting one, and the final one at 338 ms.

## E — resizing
| Check | Measured |
|---|---|
| 1700 → 1300 → 1700 | same window 8 AM – 6 PM throughout; 117 → 77 → 117 px/h; left edge returns to 8 AM |
| Divider dragged +220, −320, +100 px | window stays 6 AM – 10 PM; 73 → 59 → 79 → 73 px/h; right edge never cut off |
| Fresh load at 700 px wide, on today | 52 px/h old layout, opens **1:11 AM** with the now-line at **1:41 AM** — 30 minutes before the current time |
| Widen back to 1700 without changing the day | re-fits to the window: 6 AM – 10 PM at 73 px/h |

## F — the view stays put
| Check | Measured |
|---|---|
| Scroll to the middle, collapse then expand a department | scrollLeft **576 → 576 → 576**, px/h unchanged |
| Drag a job 6:00 PM → 8:45 PM | screen unchanged (73 px/h, scrollLeft 439 before and after) |
| …then refresh | window **followed**: 6 AM – 10 PM became **6 AM – 11 PM** (9:17 PM + 1 h, rounded up) |
| Delete a job | no jump or resize; window unchanged after refresh |

## G — other places that use the Day view
| Check | Measured |
|---|---|
| Create from an empty cell near the right end | pointer 21:34 → **21:30**, 20:36 → **20:30**, 18:41 → **18:30**, 16:22 → **16:15** — a 15-minute floor snap, over a 380 px span |
| Drag a work order onto a **technician** lane | dropped at pointer 18:00 → shift created **6:00 PM – 6:32 PM** |
| Drag a work order onto a **department** lane | dropped at pointer 15:06, live preview box at 15:00 → shift created **3:00 PM – 4:49 PM**, no technician |
| Conflict panel, jump to the job | scrollLeft **0 → 576**; the 6:00 PM job is inside the new view |
| Event preview while creating | cell menu at pointer 19:17 read "Julie Olson · Thu, Oct 1 · **19:15**"; the Create Event dialog opened at **7:15 PM – 8:15 PM** |

## H — no saved hours
Done on **Staging Lethbridge - 4310**, which genuinely has no hours saved (`ranges: null`).

| Step | Measured |
|---|---|
| No saved hours | **52 px/h**, full 24 h grid, no business-hours window — the old layout |
| Save 7:00 AM – 3:00 PM, reload | Friday opens **6 AM → 4 PM** at 117 px/h — exactly −1 h / +1 h |
| Restore to no hours | read back identical to the original; view returns to 52 px/h |

## Week and Month (quick check)
Both render with no horizontal hour timeline at all — the measuring helper finds no scroll
container — so the Day-view fit cannot apply to them. Week shows its seven day columns and
Month its grid, unchanged. Switching back to Day returns to the window.
