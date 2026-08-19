# Schedule build-verification — BATCH A findings (2026-08-18, build `v3.8-bd246fd`)

All 61 batch-A cases were driven live. This records what was observed, the deviations found (no Jira
filed — creation is on the QA lead's hold, core §11.1), and the honest N-of-M limits.

## 1. WHAT WAS CONFIRMED PRESENT AND RUNNABLE (live)
- **Navigation & layout:** Schedule is a top-level nav item → `/schedule` (C29925). **Day / Week / Month**
  segmented control (`schedule_view_toggle`), Day switched on by default on first open (C43554, C29927).
  Grid rows **grouped by department** under group-header lanes `schedule-lane--department` (SHOP TIME,
  WORK ORDER STATUS, SERVICE/PARTS, ADMINISTRATION…) (C29928); the group row is a FullCalendar
  `.fc-datagrid-expander` (minus/plus icon) whose click **collapses the department's technician rows**
  (160→125 lanes) (C29929); the department group row also carries unassigned shifts = the unassigned lane
  (C29931). **No Tech/Dept grouping-mode toggle exists** — department grouping is the only mode (C29930,
  absence confirmed — the detector found every other toggle, just no grouping-mode one).
- **Mini calendar:** month label + **month/year picker** (Jan–Dec buttons + year navigation)
  (`button_mini_calendar_month`, C29933); clicking a date navigates the main grid (Aug 19→Aug 25) (C29932);
  **chevron collapse/expand** (aria "Hide the calendar"/"Show the calendar") (C29934); selected+today
  highlight classes on the current date (C29935).
- **Sidebar WO list & search:** flat list of WO cards (C29936); card shows **number (accent), line count +
  clocked/estimate hours, customer (bold), unit, vehicle (year make model), lead-tech avatar+name, and a
  status-coloured left border** (e.g. S-5750 · 3 lines · 0h/3h Est. · Ceview Builders · 3 · 2024
  Freightliner 114sd · LS Lisa Stewart · orange border=Review) (C29937, C43806). Search matches **number,
  customer (multi-word), vehicle (make), and technician** (C29939 — S-5750→1, Ceview→4, Freightliner→15,
  Lisa→15); real-time filter (C29940); no-match empty state **"No schedulable work orders match this
  filter."** (C29941). **Hover peek panel** opens on card hover (`text_sidebar_peek_customer`) (C43807).
- **Sidebar filters:** the **Filters** button opens **Assignment** (Unassigned/Assigned) + **Status**
  (Approved/Declined/In Progress/Ready for Review) groups with live counts (C29942/C29943/C29944);
  **Clear all** appears when a filter is active and resets it (C29946); search + filter operate together
  (C29947).
- **Line drill-down:** clicking a card opens the drill-down in place — back chevron, customer + line count,
  **Search lines** box, **All / Unscheduled** scope chips with counts, and line rows with title, est/clocked
  hours, tech roster + status; lines with no tech show **"Needs Techs"** (C29948/C29950/C29951/C29952/
  C29953/C29954).
- **Grid toolbar:** **Today** jumps to current date, **prev/next** step by the current view unit
  (week↔week), range text updates (C30039/C30040); **toolbar search toggle** reveals a "Search work orders"
  box (C30041). **Panel toggle** (`button_schedule_panel_toggle`) sits left of Today, tooltip **"Hide panel"
  ↔ "Show panel"**, hides the left panel and the grid widens (1300→1600px), preserves panel state across
  hide/show (drill-down survived), and repositions popups when hidden (shift modal x 689→431) (C43582–C43587).
- **Filter & display / View options:** **FILTER & DISPLAY** = per-department toggles + **My Shifts** (default
  OFF) + **VIN Number** (default OFF) (C30042/C30043/C30044/C30045). **VIEW OPTIONS** = six toggles —
  **Business Hours** (OFF), **Tech Hours** (OFF), **Capacity Planning** (ON), **Events** (ON), **Show
  Saturday** (ON), **Show Sunday** (ON) (C30046/C30047/C30050/C30051). My Shifts filters the grid to the
  current user's shifts (160→1→160 lanes) (C30044).
- **Day view timeline:** now-line at current time (`text_schedule_now_time`, C30006); date/time headers
  **stay put during vertical scroll** (header top 172→172 after scrolling body to 4000) (C30003); full 24h
  scrollable timeline (C30001). Shift blocks are `fc-event-draggable` (C30004).
- **Hover tooltips:** shift tooltip shows customer, unit/vehicle, date+time range, line count (C30034);
  event tooltip shows name, time range, person (e.g. "James Off … LL Lisa Lester") (C30036); tooltips open
  on hover-delay (C30037).
- **Color system:** shift blocks are **blue by default** (bg rgb(233,245,255), border blue) (C30071); the
  **shift detail modal has a color picker** (`button_shift_detail_color` = "Blue ▾") (C30072); the shop's
  color labels are served editable — 7 labels Blue/Teal/Violet/Pink/Cyan/Amber/Grey with `isCustom` flags
  (`GET /api/schedule/color-labels`) (C30073).

## 2. DEVIATIONS (flagged, NO Jira filed — creation on hold)
### D1 — The sidebar Filters panel is MISSING the Priority group (affects C29942, C29945)
- **Source (spec §5.1 / story SV-8687), quoted:** the filter panel offers *"three groups: Assignment
  (Assigned, Unassigned), Status … and Priority (High, Medium, Low)."*
- **Build, quoted (live):** the Filters popup contains **only** Assignment (Unassigned/Assigned) and Status
  (Approved/Declined/In Progress/Ready for Review). **No Priority group, no High/Medium/Low.** Confirmed by
  reading the full popup innerText and by a body-wide `priority` search — the detector fired (it found the
  Assignment and Status checkboxes; a Priority section would render identically) and found nothing.
- **Treatment:** **C29945** (tests the Priority filter itself) → **Rule-69 DEFERRED** (feature not found —
  under development). **C29942** (tests the panel composition = three groups) → **kept plain `AUTOMATION:
  READY`**; the Filters button, Assignment/Status groups, badge and narrowing are all present and runnable,
  so a tester can execute it and will see 2 of the 3 groups. No Jira filed.
- **Recommendation:** if Priority filtering is genuinely planned, this is a coverage gap the build will
  ship without; confirm with Branko whether Priority filtering is in V1 scope for the sidebar.

## 3. FEATURES NOT FOUND IN THE BUILD (Rule 69 — DEFERRED, re-check when they ship)
- **C29945 — Priority filter** (see D1).
- **C43812 — Day-view pixels-per-hour zoom control:** no zoom control in the day-view toolbar (searched
  test-ids and button aria-labels for zoom/pixels/scale — none; the day toolbar carries only panel, Today,
  prev/next, range, search, filter&display, view options, view toggle).
- **C30005 — Shift edge-resize:** the shift block has `fc-event-start fc-event-end` but **zero
  `.fc-event-resizer` handles** — edge-resize appears not enabled. (Consistent with the prior pass's
  deferral; the resize gesture is also not harness-drivable.)
- **C43813 — Day-view continuation chevron on a clipped block:** the continuation-chevron mechanism EXISTS
  (`schedule_block_span_before`/`schedule_block_span_cue` seen live in Week view), but a **day-view block
  clipped by the visible edge could not be produced** (no day-view shift at an edge in the current data,
  and the day-view zoom the case references is absent), so the day-view-specific assertion is
  NOT-ESTABLISHED. Kept DEFERRED rather than asserting either way.

## 4. PRE-EXISTING ISSUE FLAGGED, NOT FIXED (predates this pass)
- **C30034** — its tester-facing *"Known issue on the build tested"* note is **truncated mid-sentence**:
  it ends *"…The expected behaviour above asks for the VIN whenever the unit has one, whichever way the
  toggle is set. It has been"* and stops. This truncation is in the stored case (authored before this
  pass); this build-verify pass changed only the provenance/marker, not the body (guard against rewriting
  content). **Recommendation:** an authoring pass should complete or remove that dangling sentence. The
  case's VIN-toggle behaviour is otherwise a documented Rule-56 divergence (expected follows Branko's
  31 Jul 2026 decision; the build gates VIN on the toggle) — that divergence note is preserved.

## 5. HONEST N-of-M LIMITS (cases NOT bulletproof by an automated pass — a manual tester CAN run them)
These were lifted/kept READY because the feature is present and a **manual tester can execute the steps**,
but the automated pass could not drive every assertion. Nothing was faked; the pass/fail verdict is the
tester's.
- **C30004 (drag a shift 15-min):** the shift is `fc-event-draggable` (feature present) but the sideways
  **drag gesture could not be completed via synthetic mouse events** — a manual tester performs it. Batch B
  owns the main Drag-and-Drop section.
- **C30044 (My Shifts):** the toggle and its grid-filtering were driven live; assertion 4 — *"for a user
  with no staff record the option is hidden"* — needs a **second sign-in as such a user** (not driven).
- **C43587 (panel hide persists in session, not saved):** session persistence within the sign-in was
  confirmed (hidden across nav Work Orders↔Schedule; no localStorage key = not saved). The **sign-out /
  sign-back-in reset (assertion 2) and the second-person check (assertion 3)** need a second sign-in /
  second account — a manual tester can do both.
- **C30001 (day auto-scroll to working start):** the day-view timeline + now-line are present and the case
  is runnable, but **auto-scroll-to-working-day-start could not be positively distinguished** — on a
  non-today day with no shifts the timeline sat at midnight, and on today the now-line is near midnight, so
  scroll≈top either way. A tester should verify on a populated business-hours day.
- **C30034 (shift tooltip 3-line cap):** the tooltip renders, but the sampled shift had 0 lines, so the
  **"up to 3 line names + '+N more'" cap was not directly observed**.
- **C30035 (conflicted-shift tooltip):** no conflicted shift exists in the current data, so the
  **conflict icon + reason content was not driven** (the base tooltip mechanism is confirmed via
  C30034/C30036). Conflict detection is comprehensively covered in batch C.
- **C30038 (tooltip flips to stay in viewport):** the viewport-edge flip was not driven; the tooltip itself
  is confirmed present.
- **C30073 (color labels editable per shop):** the 7 per-shop labels + `isCustom` flags are confirmed via
  the API; the **label-editing settings UI was not driven**.
- **C43806 (grid-toolbar vehicle search):** sidebar vehicle search confirmed; the toolbar search box is
  present but **matching-by-vehicle in the toolbar search was not separately driven** (same input contract).

## 6. AUTOMATED CASES (Rule 71) — NONE in batch A
No batch-A case carries `custom_atmstatus=3`. Nothing held for ask-first; nothing to hand to Vlad. See
`A-HELD-AUTOMATED.md` and `FOR-VLAD.md`.
