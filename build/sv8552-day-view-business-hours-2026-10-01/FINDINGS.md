# SV-8552 — Schedule Day view opens on the shop's business hours window

**Ticket:** [SV-8552](https://shopview.atlassian.net/browse/SV-8552) · branch `SV-8552-day-view-business-hours`, PR #3351
**QA branch:** https://sv8552.qa.shopview.com — build **`v26.39.2-ad6deec`**, last-modified Thu, 01 Oct 2026 06:33:58 GMT, etag `W/"8e105b535998a74a7df91420a0171400"`
**Production (the BEFORE half, Standing Rule 86):** https://app.shopview.com — build **`v26.39.2-1aeb22d`**, last-modified Tue, 29 Sep 2026 09:36:08 GMT
**Handoff followed:** the QA handoff generated from the diff, sections **A to H**, every box
**Date:** 2026-10-01

---

## 1. Verdict

**PASS** — every check in all eight sections passes, plus the Week/Month quick check.

The regression the ticket describes is gone: Day view no longer opens on midnight. With
9:00 AM – 5:00 PM saved it opens on **8 AM – 6 PM** and the hours stretch to fill the screen.

---

## 2. What was checked

| Section | Check | Result |
|---|---|---|
| A | Friday with no jobs outside hours → 8 AM – 6 PM, filling the screen | **PASS** — 8 AM → 6 PM at 117 px/h |
| A | Scroll reaches 12 AM on the left and 11 PM on the right | **PASS** |
| A | Wednesday (8:30 – 4:30) → 7 AM – 6 PM | **PASS** — 7 AM → 6 PM at 106 px/h |
| B | Jobs at 7:30 AM and to 8:45 PM widen it to 6 AM – 10 PM | **PASS** |
| B | Hide the department holding them, refresh → unchanged | **PASS** — 15 lanes → 1, both jobs off screen, window byte-identical |
| B | An all-day event does not widen it | **PASS** |
| B | A day whose event runs past midnight starts at 12 AM | **PASS** — Tue 6 Oct opens 12 AM |
| C | Today opens on the window, not the current time | **PASS** — opened 6 AM with the clock at 2:16 AM |
| C | Left open for a minute, the view does not jump | **PASS** — identical after 60 s |
| D | Next/previous through the week, including the closed weekend | **PASS** — each day on its own window |
| D | One smooth step, no double jump | **PASS** — exactly two states recorded, 338 ms apart |
| D | Closed days open the old way | **PASS** — 52 px/h, the old layout |
| D | Day → Week → Day returns to the window | **PASS** |
| E | Narrower and wider — hours re-fit, view returns to the window start | **PASS** — 117 → 77 → 117 px/h, left edge 8 AM throughout |
| E | Drag the divider — hours re-fit, right edge never cut off | **PASS** — three drags, window held at 6 AM – 10 PM |
| E | About 700 px wide → works as before, today opens ~30 min before now | **PASS** — opened 1:11 AM with the now-line at 1:41 AM |
| E | Widen again without changing the day | **PASS** — re-fits to the window |
| F | Collapse and expand a department — the view stays put | **PASS** — scrollLeft 576 → 576 → 576 |
| F | Drag a job, create one, delete one — no jump or resize | **PASS** — px/h and scroll identical across all three |
| F | After a refresh the window follows the new times | **PASS** — 6 AM – 10 PM became 6 AM – 11 PM after a job moved to 8:45 PM |
| G | Create from an empty spot near the right end opens the time clicked | **PASS** — four spots, all matched to the quarter hour |
| G | Drag a work order onto a technician lane and a department lane | **PASS** — both landed at the pointer time |
| G | Conflict panel, jump to the job | **PASS** — scrolled from the far left to bring it into view |
| G | The preview box sits at the right time | **PASS** — pointer 7:17 PM opened 7:15 PM |
| H | A location with no saved hours is unchanged | **PASS** — the old 52 px/h 24-hour layout |
| H | Change the saved hours and the window follows | **PASS** — 7:00 – 3:00 gave 6 AM – 4 PM |
| — | Week and Month unchanged (quick check) | **PASS** — neither has an hour timeline to fit |

Every number behind these rows is in `RESULTS.md`.

---

## 3. The before and after

Production is on the pre-fix build, so it is where the BEFORE was taken. To make it a fair
comparison the **same business hours were saved on production first** — otherwise the
difference would partly be configuration rather than the fix (Standing Rule 75).

| Same Friday, same 1700 px screen, same saved 9:00 – 5:00 | Opens on | Hour column |
|---|---|---|
| Production `v26.39.2-1aeb22d` | 12 AM, all 24 hours | 52 px |
| QA branch `v26.39.2-ad6deec` | 8 AM – 6 PM | 117 px |

Wednesday (8:30 – 4:30) behaved the same way: unchanged on production, 7 AM – 6 PM on the branch.

**Production was restored.** Its business hours were `ranges: null` before and are `ranges: null`
again, read back and compared. Nothing else on production was touched.

---

## 4. Points worth stating plainly

1. **"All 24 hours fit" on closed days and no-hours locations is approximate, and it is not new.**
   The handoff says those cases show all 24 hours on a wide screen. At 1700 px the timeline is
   1176 px, and 24 hours at the documented 52 px minimum needs 1248 px, so about 72 px of scroll
   remains. **Production behaves identically** — same 52 px per hour, same residual scroll — so
   this is the pre-existing layout, not something this change introduced.

2. **The window is capped at midnight at both ends, as the handoff states.** Monday 5 Oct opens
   5 AM – 12 AM and Tuesday 6 Oct opens 12 AM – 8 PM. Both are driven by one multi-day event
   ("Jarod off", Monday 6:00 AM to Tuesday 7:00 PM) and both are correct; they differ from each
   other only because the event covers a different part of each day.

3. **Three things that looked wrong were my own test artefacts, not the build**, and are recorded
   so nobody repeats them: a 700 px reading taken while the view was still on a different day
   (the 30-minutes-before-now rule only applies to today); a drag whose target was off-screen at
   x=1773 on a 1700 px window; and a first attempt at the hidden-department check where the jobs
   were sitting in **Unassigned** rather than the department being hidden — that check was redone
   with both jobs moved into Service, which is the result reported above.

4. **The scrollbar note was not checked.** The handoff accepts that up to ~17 px at the right end
   can sit under an always-visible scrollbar on Windows or a Mac configured that way. This was run
   on headless Linux with overlay scrollbars, so that case did not arise.

---

## 5. How it was tested

Viewport fixed at **1700 x 1050** for every reading. Business hours on *Staging Heavy Duty - 9919*
set as the handoff asks: **Mon, Tue, Thu, Fri 9:00 – 5:00, Wednesday 8:30 – 4:30, Saturday and
Sunday closed**. The second location, *Staging Lethbridge - 4310*, genuinely has no hours saved.

The window was read by `ev/measure.js`, which finds the timeline's scroll container, derives
pixels-per-hour from the median gap between the hour labels, and converts `scrollLeft` and the
visible width into a start and end hour. Every figure quoted is that measurement, not an estimate
from a screenshot.

Honest split of what was clicked and what was called: the **things under test** — the day arrows,
Today, the Day/Week/Month switch, the department filter, the divider, the browser size, the lane
clicks, the sidebar drags, the conflict panel and the create-event dialog — were all driven **on
the screen**. The **set-up** (reading the board, restoring two event times, saving business hours)
went through the API.

---

## 6. Test data left in place

Per-ticket QA branches need no cleanup, so the case is left standing and reproducible on
*Staging Heavy Duty - 9919*, Thursday 1 October: events `ZZAUTOTEST SV8552 early` (7:30 – 9:30 AM),
`ZZAUTOTEST SV8552 late` (4:00 – 8:45 PM) and `ZZAUTOTEST SV8552 allday real`, all three on David
Haynes in the Service department, plus two shifts created during section F and G — one on Brandi
Smith at 8:45 PM and one unassigned Service shift at 3:00 PM.

*Staging Lethbridge - 4310* was returned to **no saved hours** and read back to confirm it.
**Production was restored** (section 3).

## 7. Evidence

- `ev/01-before-after.png` — production vs branch, same Friday, same saved hours
- `ev/02-follows-the-saved-hours.png` — Friday 9–5 and Wednesday 8:30–4:30 side by side
- `ev/03-jobs-widen-the-window.png` — jobs widen it, and hiding them does not shrink it back
- `ev/04-no-saved-hours.png` — a location with no hours, before and after hours are saved
- `ev/05-create-from-cell.png` — clicking near the right end opens the time clicked
- `ev/measure.js` — the measuring helper · `ev/build_ex.py` — the exhibit builder
- `RESULTS.md` — every raw measurement
- Probe scripts and run output: `/tmp/qa8552/` (branch) and `/tmp/qa8552p/` (production), not committed

## 8. Pre-post gate (Standing Rule 72)

Recorded in `GATE.md` when the comment is posted.
