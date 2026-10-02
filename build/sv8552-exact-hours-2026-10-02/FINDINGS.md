# SV-8552 — the four changes Chris asked for in comment 77735

**Verdict: PASS.** All 27 checks in the revision-2 QA handoff pass, and all 24 checks from our
earlier QA pass that are still supposed to hold still hold. No defect found, nothing filed.

- **Ticket:** [SV-8552](https://shopview.atlassian.net/browse/SV-8552) — *Schedule scrolls to
  midnight on load/refresh instead of 6:00 AM shop start (regression)*. Bug, Medium, status
  **Code Review**, reporter Chris Ward, assignee Dipesh Changawala.
- **What this pass is for:** Chris's comment **77735** (1 Oct, after testing with Fabian) asked for
  four changes to the version we had already passed in comment **77703**. Dipesh delivered them
  (comment **77769**) and re-generated the QA handoff as **revision 2**, which is the checklist
  followed below.
- **QA branch:** `https://sv8552.qa.shopview.com` — build **`v26.40.2-b57d7c7`**,
  last-modified **Fri, 02 Oct 2026 07:49:51 GMT**, etag `69a4a9ecfb83cd23d6fe39475f164032`.
  **Read at the start and again at the end of the pass — `index.html` byte-identical
  (sha256 `a3d0e1cb23c0778462…`), so nothing redeployed underneath this run.**
- **Date:** 2 October 2026. **Viewport:** 1700 × 1050 (plus 1400, 1200 and 700 for the resize
  checks). Account: the shop administrator on **Staging Heavy Duty - 9919**.
- **Shop hours used** (already saved on the branch, exactly as the handoff's setup asks):
  Mon/Tue/Thu/Fri **9:00 AM – 5:00 PM**, Wed **8:30 AM – 4:30 PM**, Sat/Sun closed. Second
  location **Staging Lethbridge - 4310** has **no hours saved**.

---

## 1. Which handoff this is, and why it matters

The uploaded handoff is **revision 2**. Its own header says so — *"Generated: 2026-10-02
(revision 2: PM changes from Jira comment 77735)"* — and it names QA site build
`v26.40.2-b57d7c7`, the same build Dipesh names in comment 77770. Our earlier pass ran against
`v26.39.2-ad6deec`. So this handoff covers Chris's new requirements, not the old ones.

**This matters because the expected behaviour deliberately changed.** Four checks we recorded as
PASSED on 1 October must now give a *different* answer, by design. They are listed in §4 so that
nobody later reads them as regressions.

---

## 2. How the window was measured

The window is not readable from a label alone, so every reading is derived from the rendered grid:
the hour labels' x-positions are fitted against their hour values by least squares (fit residual
**±0.4 px** on every reading), giving an exact pixels-per-hour; the scroll container's left and
right edges are then converted back into times.

That produced an exact, falsifiable rule which held on **every** day measured:

> `scrollLeft` = round(opening-hour × pixels-per-hour) − **4**, and
> pixels-per-hour = floor((timeline width − 4) ÷ window length in hours)

The 4 px is the handoff's own documented gap ("a few pixels of space are kept before 9 AM"). Where
the arithmetic leaves a remainder it shows as a few minutes past closing at the right edge — the
handoff's documented "up to 8 px" item; the largest seen was **7.3 px**.

---

## 3. The checks (27/27 from the revision-2 handoff)

### A — the window on a normal day

| # | Check | Result |
|---|---|---|
| A1 | Thursday with no jobs outside hours opens **9 AM – 5 PM**, filling the screen, no extra hour | **PASS** — Thu 8 Oct, 9:00 → 5:00, 8.055 h on screen at 146 px/h, scrollLeft 1310 = 9×146−4 |
| A2 | Scrolling still reaches 12 AM on the left and 11 PM on the right | **PASS** — full left shows 12 AM, 1 AM, 2 AM; full right shows 9 PM, 10 PM, 11 PM |
| A3 | Wednesday (8:30 – 4:30) starts **exactly 8:30**, no rounding | **PASS** — Wed 7 Oct, scrollLeft 1238 = 8.5×146−4; right edge lands on 4:30 PM |

### B — jobs outside business hours

| # | Check | Result |
|---|---|---|
| B1 | Events 7:30–9:30 AM and 4:00–7:00 PM → window exactly **7:30 AM – 7:00 PM** | **PASS** — 101 px/h, scrollLeft 754 = 7.5×101−4 |
| B2 | A 5:00–6:00 AM event → view starts 5 AM, the event's left border and rounded corner fully visible | **PASS** — scrollLeft 411 = 5×83−4; the block starts **4 px inside** the timeline edge (527 vs 523), 83 px wide = one full hour, border-radius 8 px |
| B3 | Hide the department holding those events and refresh → window unchanged | **PASS** — 13 lanes → 0, all 3 events gone, window **byte-identical** (4:53 AM → 7:03 PM, 83 px/h, scrollLeft 411) before and after a refresh |

### C — jobs that must NOT change the window

| # | Check | Result |
|---|---|---|
| C1 | An all-day event on a 9–5 day → window stays **9 AM – 5 PM** | **PASS** — Fri 9 Oct identical to a clean day (146 px/h, scrollLeft 1310) |
| C2 | An event running 11:00 PM → 3:15 AM → neither day changes, neither starts at 12 AM | **PASS** — Mon 12 and Tue 13 Oct both 9 AM – 5 PM |
| C3 | An event ending exactly at midnight (9:00 PM – 12:00 AM) → window **does** widen to midnight | **PASS** — Thu 15 Oct, 9 AM → 12 AM, 78 px/h |

C2 was additionally proven two more ways on data that was already on the branch: the pre-existing
*Jarod off* event (Mon 5 Oct 6:00 AM → Tue 6 Oct 7:00 PM) leaves **both** days at 9 AM – 5 PM, and
a **multi-day work-order shift** created for this pass (Tue 20 Oct 2:00 PM → Wed 21 Oct 8:00 PM)
leaves Tue at 9 AM – 5 PM and Wed at 8:30 AM – 4:30 PM. So the rule holds for shifts, not just
events.

### D — task names on cut-off bars

| # | Check | Result |
|---|---|---|
| D1 | On a 9–5 day with an all-day event, the name is visible at the left edge when the view opens | **PASS** — name at x 531, timeline starts 523 |
| D2 | Scroll left and right along the bar — the name stays at the left edge | **PASS** — bar spans −1805…1699 at the far right; name stays at **531 at every scroll position** (0, 700, 1500, 2328). `position: sticky` |
| D3 | Week view at ~700 px, a multi-day bar cut on the left — the name stays at the edge | **PASS** — name pinned at timeline + 8 px while the bar is cut (see §5 for the honest boundary) |
| D4 | Ordinary and recurring blocks look exactly as before; conflict icon still at the right edge | **PASS** — ordinary blocks carry no pinned-text class; the conflict icon sits **8 px from the block's right edge** |

### E — cards on cut-off bars

| # | Check | Result |
|---|---|---|
| E1 | Hover a cut-off all-day bar → card under the name, inside the timeline | **PASS** — card at x 531 (the name's own left edge), y 291 (under the bar); not over the sidebar, not at the far right |
| E2 | Scroll left to 12 AM and hover again → still under the name | **PASS** — card at x 532 |
| E3 | Click a cut-off all-day / multi-day bar → card opens to the right of the name, inside the timeline | **PASS** — name ends at 734, card opens at **746**, ends 1086, timeline ends 1699 |
| E4 | Click a cut-off multi-day work-order shift → shift card next to it; edit a cut-off event → the form opens next to the name | **PASS** — name ends 771, shift card opens at **783**; the Edit Event form opens beside the name, inside the timeline |
| E5 | Hover and click an ordinary, fully visible block → cards open where they did before | **PASS** — tooltip centred on the block, card just to its right |

### F — today, moving and resizing

| # | Check | Result |
|---|---|---|
| F1 | **Today** opens on the shop's window, not the current time | **PASS** — branch clock 5:29 AM, today (window 9 AM – 7 PM) opened at **9 AM**; the Today button gives the same |
| F2 | Next / previous through the week — each day on its own window in one smooth step; closed days open the old way | **PASS** — each day correct; Sat/Sun on the old 52 px/h 24-hour layout; a day change records **exactly two scroll states** (1238 → 754 at 417 ms; 1049 → 72 at 460 ms), so no double jump |
| F3 | Narrower / wider, and dragging the divider — hours re-fit and the view returns to the window start | **PASS** — 1700/1400/1200/1700 gave 83/62/52/83 px/h, always back to the window start; four divider drags gave 83 → 73 → 83 → 94 → 83 px/h with the right edge never cut |
| F4 | Day view at ~700 px — the window does not fit, so it works as before; widening re-fits | **PASS** — loaded fresh at 700 px, today opened **5:28 AM with the clock at 6:04 AM** (about 36 minutes before now, the documented fallback); widening restores 83 px/h at the window start |
| F5 | Drag, create and delete a job — no jump or resize; after a refresh the window follows the new times | **PASS** — see below |

**F5 in detail.** Dragging the 5 AM event five hours later (`PATCH /api/schedule/events/…` → 200)
left the view **byte-identical** (83 px/h, scrollLeft 411). After a refresh the window correctly
became **7:30 AM – 7:00 PM** (101 px/h, scrollLeft 754 — the predicted value), because the earliest
out-of-hours job was now the 7:30 AM one. Creating and deleting a job changed neither the hour width
nor the scroll (146 px/h and scrollLeft 1753 across both), and a refresh returned the view to the
window start (1310).

### G — other places that use the Day view

| # | Check | Result |
|---|---|---|
| G1 | Create an event from an empty spot near the right end — the time matches where you clicked | **PASS** — four spots: 18:31→18:30, 17:22→17:15, 15:37→15:30, 13:17→13:15, each snapped to the quarter hour below the pointer |
| G2 | Drag a work order onto a technician lane and onto a department lane — it lands at the pointer time | **PASS** — technician: pointer 12:06 → `startTime 12:00` on that technician; department: pointer 13:28 → `startTime 13:15` with `departmentId` set and no staff |

### H — no saved hours

| # | Check | Result |
|---|---|---|
| H1 | A location with no business hours saved looks and works as before | **PASS** — Staging Lethbridge - 4310 (hours source reads `default`, not `business`) shows the full 24-hour grid at **52 px/h**, scrollLeft 72 — the old layout |
| H2 | Change the saved hours and reload — the window follows | **PASS** — Friday set to 7:00 AM – 3:00 PM gave **7 AM – 3 PM** (scrollLeft 1018 = 7×146−4); restored to 9:00–5:00 and the window returned to 9 AM – 5 PM |

---

## 4. The four checks that now answer differently — on purpose

These were **PASSED** in our 1 October comment and are **expected to differ now**. They are not
regressions; they are Chris's changes.

| Earlier check (comment 77703) | Then | Now | Why |
|---|---|---|---|
| A1 — Friday with no jobs outside hours | 8 AM – 6 PM | **9 AM – 5 PM** | no buffer |
| A3 — Wednesday 8:30 – 4:30 | 7 AM – 6 PM | **8:30 AM – 4:30 PM** | no buffer, no rounding |
| B1 — jobs at 7:30 AM and to 8:45 PM | 6 AM – 10 PM | the jobs' **exact** times | the edge moves to the job's own time |
| B4 — a day whose event runs past midnight | started at 12 AM | **unchanged, 9 AM – 5 PM** | multi-day and overnight jobs no longer widen the day |

Everything else from that pass was re-checked and still holds: scrolling to 12 AM / 11 PM, hiding
the department, the all-day rule, Today, no jump after a minute (identical after 60 s), next and
previous through the week, closed days, Day → Week → Day, resizing, the divider, 700 px, collapsing
and expanding a department (scrollLeft 754 → 754 → 754 with lanes 13 → 0 → 13), dragging, creating
and deleting, creating from a cell, dragging onto both lane types, both locations, changing the
hours, and Week and Month unchanged.

---

## 5. Three things I looked at hard and did not treat as faults

**The Week-view name disappears once the bar is a sliver.** In Week view at 700 px the name is
pinned at the timeline edge + 8 px and stays readable while the bar is cut on the left — measured
at scroll 0 and 60, and still readable at 120 where only **82 px** of the bar remains. At scroll 180
only a **22 px** sliver of the bar is left and the 98 px name no longer shows. That is the physical
limit of a sticky label: it cannot leave its own bar. The requirement Chris wrote — *"you have to
scroll left to read it"* — is met; before the fix the name was gone as soon as the bar's own left
edge went off screen. Worth a sentence to Chris only if he wants the name to survive past the point
where the bar itself has effectively gone.

**Opening the Create Event dialog scrolls the timeline.** Clicking an empty cell does not move the
view (scrollLeft 1310 → 1310), but opening the dialog scrolls it to bring the clicked slot into view
(1310 → 1753). The hour width never changes (146 px/h throughout), nothing resizes, and a refresh
returns the view to the window start. This is the dialog bringing its own slot into view, not the
window being recomputed, so it is not the "jump or resize" F5 is about.

**The handoff says the "8 AM" label is half cut off on Wednesday; it is fully hidden.** Measured:
the 8 AM label occupies x 459–489 and the timeline starts at 523, so the label text is entirely off
screen and the first visible label is 9 AM. The *column* for 8 AM is half shown, because the day
starts at 8:30. The requirement — start exactly at 8:30 — is met; only the handoff's description of
where the label lands is slightly off. Cosmetic, nothing to fix.

---

## 6. What I could not check

**Nothing on the handoff was left unchecked.** Two notes, neither of them a gap in the checklist:

- The old pass listed a *"conflict panel jump-to"* check. In this build the scheduling conflict is
  surfaced on the block itself — a conflict icon with a tooltip, and a **"Scheduling conflict ·
  Extends past working hours"** section in the shift card. There is **no jump-to control in that
  card** to exercise. The scroll behaviour that check was protecting is covered by E4, G1 and G2.
- F1 asks for Today "ideally after 5 PM". The branch clock was **5:29 AM**, so I could not test the
  after-closing case specifically. It is still decisive: the view opened at 9 AM, not at 5:29 AM, so
  the current time is not driving the opening position either side of the window.

---

## 7. Environment

Per-ticket QA branches need no cleanup, so the seeded data is left in place and is what makes the
findings reproducible. Everything created is tagged **ZZAUTOTEST**: four events on Thu 8 Oct and
Fri 9 Oct, one on Mon 12 Oct, one on Thu 15 Oct, a multi-day work-order shift on Tue 20 Oct, and two
work-order shifts dropped on Wed 14 Oct. The temporary event used for the create/delete check was
deleted.

Two settings were changed and **put back**: the department filter (hidden, then re-shown) and
Friday's business hours (7:00–3:00 for the test, then back to 9:00 AM – 5:00 PM — confirmed by the
window returning to 9 AM – 5 PM). The location was switched to Lethbridge and **switched back to
Staging Heavy Duty - 9919**.

---

## 8. Outstanding

Nothing outstanding on this ticket.
