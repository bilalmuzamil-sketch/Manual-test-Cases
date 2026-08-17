# Schedule — SPEC RE-INGEST v25 → v30 (Standing Rules 31/43) — 2026-08-17

**Source:** Confluence page **713031682** "Schedule", space `SHOPVIEW`.
**Live version at ingest:** **30** (`version.number`), last edited **2026-08-13T22:48:26.711Z** by
Branko Cicovic, comment *"Restore Business hours labelling"*. **Read live 2026-08-17** (cookie session
`/tmp/atlassian/cookies.txt`; HTTP 200 on `/wiki/api/v2/pages/713031682?body-format=storage` and on
each historical `?status=historical&version=<n>`).

**Our baseline before this pass:** `requirements.md` reflected **Confluence v25**; the cases had been
re-stamped to reference **v27** (source-accuracy pass 2026-08-10). Live is **v30** — a five-version
drift. This doc is the exhaustive, version-attributed delta; `requirements.md` is promoted to the v30
baseline in the same pass (header + a `v25 → v30` delta subsection + the reworded body sections).

**Method (Rule 31 trap (a)/(c)):** the page-body "Version" field reads "1.0" and is a known lie; the
**Confluence version number** is authoritative. Each version's storage body was pulled and rendered to
plain text; consecutive versions were diffed. **Requirements are dated by their own text across
versions, never by the page date.** Raw texts: `/tmp/schedv30/v{25..30}.txt` (not committed — large,
non-secret working files).

---

## 1 · THE VERSION LADDER v25 → v30 (what each bump did)

| Version | When (UTC) | Comment | Substance |
|---|---|---|---|
| **26** | 2026-08-07 11:02 | *(none)* | **Label only.** §4.12 hover tooltip: *"a per-technician breakdown"* → *"a per-assigned technician breakdown"*. |
| **27** | 2026-08-07 15:01 | *"Add §5.3 Panel collapse; toolbar row and cross-references"* | **NEW §5.3 Left-panel collapse toggle** + the §6 toolbar Panel-toggle row + cross-references. (Already covered by our SCH-PANEL-01…06 — story now **SV-9243**.) |
| **28** | 2026-08-13 11:57 | *(none)* | **Label only.** §4.9 shift-modal Notes: *"add, edit, and delete per work order"* → *"…per shift"*. |
| **29** | 2026-08-13 22:36 | *"Schedule V2: remaining-hours scheduling, resolved working hours, unass[igned]…"* | **THE BIG ONE — the "Schedule V2" rewrite.** Remaining-hours sizing, resolved working hours + app-level default, the unassigned-lane-on-the-department-header model, Today-only spread option, derive-fields, work-order peek + vehicle + clocked hours, per-line time logged + typed time entry, capacity detail modal + truncated tooltip, single-source hours conflicts, Assign-work-order modal, day-view zoom + continuation chevrons, Light/Dark/**System** theme. This is the **14 new Fabian-review stories SV-9231…SV-9244**. |
| **30** | 2026-08-13 22:48 | *"Restore Business hours labelling"* | **Label restore.** v29 had renamed the shading/toggle/settings from "Business hours" to "Working-hours"; v30 restores **"Business hours"** for the shading overlay, the Filter-&-Display toggle, and the settings entity. The concept "resolved working window / resolved working hours" (per-technician) is unchanged; only the shop-level/overlay/toggle **label** is "Business hours". |

**Header table (page metadata):** v29 changed the page's own `Last Updated | July 15, 2026 | 1.0`
placeholder to `August 7, 2026 | 1.1` — still author-managed placeholders, still not a currency marker
(Rule 31 trap (a)).

---

## 2 · PER-REQUIREMENT DELTA (v25 → v30), with the verbatim v30 wording and the affected cases

Each row is a coverage-verdict row (Rule 43). "Affected case" = an existing case whose expectation the
change touches; "NEW case" = authored this pass by the prior worker (C43795–C43813). **Both directions
run** (requirement→case and case→requirement).

### §3.1 Work order sidebar — card anatomy, peek, search
- **Card anatomy gains the vehicle and clocked hours (v29).** v30: *"Each card shows … WO number …;
  line count plus hours (top right, estimate and hours clocked, rolled up for the order); customer name
  (bold); unit number; the vehicle as year, make, and model (e.g. "2021 Freightliner Cascadia"); and a
  lead technician row."* Old v25 card had **no vehicle and no clocked-hours** rollup. → **UPDATE
  SCH-WOL-02 (C29937)**; **NEW SCH-WOL-07 (C43809)**. Story **SV-9239**.
- **Work order peek (v29, NEW).** *"Hovering a card opens a read-only peek panel listing the order's
  lines with their status and hours, both estimated and clocked, plus the lead technician. Long lists
  truncate with a "+N more" row. … opens after the same hover delay as the grid tooltips … dismisses on
  mouse-leave. Clicking the card still opens the line drill-down."* → **NEW SCH-WOL-08 (C43810)**.
- **Sidebar search adds the vehicle (v29).** v30: *"Search work orders … matches against: WO number,
  customer name, unit number, vehicle, and technician name."* v25 omitted **vehicle**. → **UPDATE
  SCH-WOL-04 (C29939)**. Story **SV-9239**.
- **Line drill-down rows now show estimated AND clocked hours (v29).** *"Each line row … shows its
  title, estimated and clocked hours, and current technician roster."* v25 showed only estimated. →
  covered by the SCH-WOL updates + NEW SCH-MODAL-09.

### §3.2 Grid grouping and the unassigned lane
- **The department header row IS the unassigned lane (v29).** v30: *"The department header row doubles
  as that department's unassigned lane. It holds shifts that belong to the department but are not yet
  tied to a technician. Dropping a work order or line onto it creates an unassigned shift (§4.2), and
  dragging a shift from the lane down onto a technician assigns it. Unassigned shifts render as
  fixed-width chips carrying their hours rather than blocks scaled to duration."* v25 had a **separate
  in-grid "Unassigned placeholder" row** using the **same three-line block anatomy**. → **UPDATE
  SCH-NAV-07 (C29931)** *(done by prior worker)*; **UPDATE SCH-START-07 (C29975)**; **NEW
  SCH-UNAS-01/02/03 (C43800/01/02)**. Stories **SV-9234, SV-9235**.

### §4.1 Drag-and-drop scheduling
- **Line drop skips the scope picker (wording tightened, v29).** *"Dragging a line from the drill-down
  skips the scope picker and schedules that line alone."* (v25: *"creates a single-line shift
  directly"*.) Equivalent behaviour. → SCH-DND cases unchanged in substance.
- **Drop on the unassigned lane creates ONE unassigned shift, spread does NOT run (v29).** *"Creates a
  single unassigned shift covering the whole scope; the spread step does not run (§4.2)."* → NEW
  SCH-UNAS-01.
- **Spread is conditional on REMAINING hours fitting a working day (v29).** *"a scope whose remaining
  hours fit within one of the technician's working days skips it and creates a single shift."* (v25:
  *"a scope that fits within one of the technician's working days"* — no "remaining".) → **UPDATE
  SCH-DND-01 (C29955), SCH-DND-04 (C29958)**. Story **SV-9232**.

### §4.2 Working hours, shift length, and unassigned shifts — **RENAMED and heavily rewritten (v29)**
Old §4.2 title was *"Shift start times and unassigned shifts"*. New §4.2 is *"Working hours, shift
length, and unassigned shifts"* and adds three whole requirement clusters:
- **Resolved working hours + app-level default (v29, NEW).** *"One window governs each technician's
  day, resolved in order: [technician's configured hours → shop's business hours →] If neither is set,
  an app-level default of 7:00 AM to 7:00 PM applies. The first level that is set wins; the levels are
  not merged. The resolved window is used everywhere a day's length matters: sizing shifts on drop, the
  spread step, capacity (§4.12), business-hours shading, and day-view auto-scroll (§4.8). No fixed daily
  hour count is used anywhere. The first two levels are rules, and a shift falling outside them is a
  conflict (§4.11). The app-level default is not a rule … a shift outside it raises no conflict."* →
  **NEW SCH-START-09 (C43795)**; **UPDATE SCH-START-03 (C29971)** (name the 7:00 AM–7:00 PM default and
  the "no conflict outside the app default" clause). Story **SV-9231**.
- **Shift length = REMAINING hours (v29, NEW).** *"A shift is sized by the scope's estimate minus the
  hours already clocked against it. A work order that has not been started … the full estimate is used.
  Remaining is evaluated at the moment the shift is created and is floored at 0.25 hours; a scope with
  less than that left cannot be scheduled. Shifts already on the board are never resized when hours are
  clocked later."* → **NEW SCH-DND-10/11 (C43797/98)**; **UPDATE SCH-DND-01/04**. Story **SV-9232**.
- **Unassigned shifts sized by remaining, excluded from capacity, render as chips; assigning re-runs
  the drop path (v29, NEW).** *"Dragging an unassigned shift onto a technician row assigns it and runs
  the same path as a fresh drop … if the remaining hours fit … a single shift is created; if not, the
  spread step opens with its start date pre-filled from the recorded target date."* → **NEW
  SCH-UNAS-01/02/03**; **UPDATE SCH-START-07**. Stories **SV-9234, SV-9235**.

### §4.5 Multi-day spread — six options, single-day path, derive fields, weekends-only, preview
- **Selector now offers SIX options incl. "Today only" (v29).** v30: *"a single selector that defaults
  to Full estimate, which resolves to the scope's remaining hours. … Full estimate, Today only, 1 week,
  and 2 weeks apply immediately … Each carries its resolved hours in the label. Until a date… reveals a
  "finish by" date field. Specific hours… reveals an hours stepper, stepping by the technician's
  resolved daily hours."* v25 had only **Full estimate / 1 week / 2 weeks / Until a date… / Specific
  hours…** (no **Today only**, no resolved-hours-in-label, stepper not "by resolved daily hours"). →
  **NEW SCH-SPREAD-12 (C43804)**; **UPDATE SCH-SPREAD-03 (C29979)**. Story **SV-9236**.
- **Fixed spans offered only when they constrain the scope (v29, NEW).** *"Today only, 1 week, and 2
  weeks appear only when the span's capacity is less than the scope's hours."* → NEW SCH-SPREAD-12.
- **Single-day scope shows NO selector, only an editable Hours field (v29, NEW).** *"A scope that fits
  within one day shows no selector at all. Its only control is an editable Hours field, pre-filled with
  the remaining hours and stepping by 0.25 hours. Reducing it … shows how much is left to schedule;
  confirming creates a single shift."* → **NEW SCH-SPREAD-13 (C43805)**.
- **Until a date… and Specific hours… DERIVE each other (v29, NEW).** *"setting a finish-by date
  derives the hours, and setting the hours derives the finish-by date."* → **UPDATE SCH-SPREAD-04
  (C29980), SCH-SPREAD-05 (C29981)**; **NEW SCH-SPREAD-14 (C43806)**. Story **SV-9237**.
- **Summary + confirm labels (v29).** v30: *"summary reading "{N} shifts · {total}h" over "{start} to
  {end} · Mon–Fri, per tech hours", expandable to a week-by-week breakdown … The confirm button carries
  the count ("Create 13 shifts")."* v25 example was *"20 shifts · Jun 15 to Jul 13 · skips weekends + 2
  days"*. → **UPDATE SCH-SPREAD-08 (C29984)**; NEW SCH-SPREAD-14. Story **SV-9237**.
- **🔴 WEEKENDS-ONLY SKIP — THE OLD SPEC CONTRADICTION IS NOW RESOLVED (v29).** v30 §4.5: *"The
  generator places day-sized blocks on consecutive days, skipping weekends. Nothing else is skipped:
  shop closures, public holidays, and days the technician is already booked all receive shifts."* and
  §12: *"The spread step skips weekends only. Shop closures, public holidays, and days the technician is
  already booked all receive shifts."* **BOTH sentences now agree.** v25 carried the two-way
  contradiction (§4.5 *"weekends skipped only when business hours are not set"* + *"shop closures … NOT
  skipped in V1"* vs §12 *"Shop closures … block the spread step"*). → **UPDATE SCH-SPREAD-07 (C29983)**
  and **SCH-EDGE-05 (C30089)**; **NEW SCH-SPREAD-15 (C43807)**. Story **SV-9238**. **See §3 below —
  this clears register items S1 / X1 / NQ-1 / P9 and the shop-closures half of C4, and it produces a
  reportable tech-design contradiction.**

### §4.8 Day view — zoom, auto-scroll, snapping, continuation chevrons
- **Pixels-per-hour zoom (v29, NEW).** *"A pixels-per-hour control scales the timeline, clamped between
  the resolved working window and the full 24-hour axis. Blocks, lane stacking, and the now line rescale
  … the zoom level holds while navigating between days."* → **NEW SCH-DAY-08 (C43812)**.
- **Auto-scroll gains a third trigger + now-line-if-today (v29).** v30: *"On day-view load, on
  navigating to a new day, and on changing the grid range, the timeline auto-scrolls so the earliest
  technician's resolved start sits at the left edge … with a small 30 to 60 minute buffer … When the
  viewed date is today, it scrolls to the now line instead."* v25 fired only on **load / day-nav** and
  had no now-line clause. → **UPDATE SCH-DAY-01 (C30001)**. Story **SV-9244**.
- **Move AND resize snap to 15 min with a LIVE time chip (v29).** *"Move and resize both snap to
  15-minute intervals, and a live time chip follows the gesture showing the snapped time. The chip
  disappears on release."* v25 mentioned 15-min snap but **no live time chip**. → **UPDATE SCH-DAY-04
  (C30004), SCH-DAY-05 (C30005)**. Story **SV-9244**.
- **Continuation chevrons are not series-specific (v29, NEW).** *"any block clipped by the edge of the
  visible range shows a chevron on the clipped edge."* → **NEW SCH-DAY-09 (C43813)**.

### §4.9 Shift detail modal — typed time entry, per-line time logged
- **Start/end/hours typed to the minute; 15-min dropdown a shortcut (v29).** v30: *"Scheduled date, and
  start time, end time, and hours. Each can be typed directly, to the minute; a 15-minute dropdown is
  available as a shortcut and stays in sync with typed values. Editing any two of start, end, and hours
  resolves the third, and an unparseable entry reverts to the previous value."* v25 had **15-minute
  pickers only**. → **UPDATE SCH-MODAL-02 (C30009)**; **NEW SCH-MODAL-10 (C43808)**. Story **SV-9240**.
- **Time logged PER LINE and for the shift (v29).** v30: *"Time logged against estimate, per line and
  for the shift as a whole."* v25 showed only the rolled-up progress. → **UPDATE SCH-MODAL-03
  (C30010)**; **NEW SCH-MODAL-09 (C43811 — §4268)**. Story **SV-9240**.
- **Notes are "per shift" not "per work order" (v28).** §4.9 Notes: *"add, edit, and delete per
  shift."* → no dedicated existing case asserts the per-work-order form; noted for coverage.

### §4.11 Conflict detection — single hours source
- **Hours conflicts evaluated against ONE source (v29, NEW).** v30: *"Hours conflicts are evaluated
  against a single source. When the technician has configured hours, only those are checked; when they
  do not, the shop's business hours are checked instead. The two are never checked together. When
  neither is set there is no hours conflict at all, because the app-level default is a framework for
  sizing shifts rather than a rule."* Also: *"Unassigned shifts have no technician, so they raise
  neither double-booking nor hours conflicts."* And "Adjust" *"clamps the shift to the resolved working
  window that raised it."* v25 implied both could be checked. → **UPDATE SCH-CONF-02 (C30024),
  SCH-CONF-03 (C30025)**; **NEW SCH-CONF-08 (C43799)**. Story **SV-9233**.

### §4.12 Capacity — detail modal, truncated tooltip, unassigned excluded
- **Truncated tooltip + click-to-open capacity detail modal (v29, NEW).** v30: *"Hover tooltip: a
  per-technician breakdown … truncated to a short list with a "+N more · click to view all" row.
  Capacity detail modal: clicking a day's capacity bar opens a modal listing every technician for that
  day with assigned hours against their capacity, overtime highlighted."* v25 tooltip showed the **full**
  per-technician breakdown and had **no modal**. → **UPDATE SCH-CAP-04 (C30033)**; **NEW SCH-CAP-05
  (C43803)**. Story **SV-9241**.
- **Denominators use each tech's RESOLVED hours; unassigned excluded (v29).** *"the sum of each
  technician's resolved working hours for that day … Unassigned shifts are excluded from both sides …
  they never fill the bar and never raise the OT tag."* → NEW SCH-CAP-05.

### §5.3 Left-panel collapse toggle — NEW in v27, its own story in v29
- v27 added §5.3; v29 promoted it to a dedicated story **SV-9243** (was under SV-8686). → **RE-ANCHOR
  SCH-PANEL-01…06 (C43582–C43587)** refs **SV-8686 → SV-9243** (keep §5.3/§6/§3.1 anchors).

### §6 Grid toolbar
- **"Day zoom" control row (v29, NEW).** *"In day view, scales the timeline between the resolved working
  window and the full 24-hour axis (§4.8)."* → covered by NEW SCH-DAY-08.
- **Filter grid search adds the vehicle (v29).** *"Filters grid blocks by matching against customer
  name, WO number, unit number, vehicle, technician name, and line name."* v25 omitted vehicle. →
  covered by the SCH-WOL-04 update wording (search fields).
- **Toggle label "Business hours" (v30).** The Filter-&-Display toggle reads **"Business hours"** (v30
  restore), not "Working hours". → relevant to any View-Options case naming the toggle.

### §7 Interactions — Assign work order, cell menu, toasts, delete-scope wording
- **Cell menu gains "Assign work order" FIRST (v29).** v30: *"Left-click on empty grid space opens a
  menu with: Assign work order, Create event, New work order. Assign work order opens a modal for
  scheduling without dragging."* v25 menu = **Create event, New work order** only. → **UPDATE
  SCH-REAS-03 (C30054)** *(done by prior worker; body has 3 items; title still stale — fixed this
  pass)*; **NEW SCH-REAS-08 (C43813 — §4275)**. Story **SV-9242** (*"Supersedes SV-8916"*).
- **Delete-scope options state "how many scheduled hours it removes" (v29).** v30: *"Each option states
  how many scheduled hours it removes."* v25: *"Each option states its consequence in hours returned
  ("returns 8h" / "returns 56h")"* and *"the hours return to the estimate's remaining"*. Reason: v30's
  remaining-hours model does not "return hours to the estimate". → touches SCH-DEL cases; no case in the
  deferred list, noted for coverage (follow-up).
- **Escape/Enter stacking order gains Assign work order (v29).** minor; no dedicated case.

### §8.1 Data model
- **Shift gains `targetDate`; `rowKey` empty when unassigned (v29).** *"sid, woId, rowKey (tech, empty
  when unassigned), date, targetDate, startHour, blockDuration, lines[], seriesId, color"*. WorkOrder
  gains `vehicle (year, make, model)`, `vin`, `actual`. Staff `hours (per weekday, one or more From/To
  ranges)`. New **Location** entity `businessHours (per weekday …)`. → data-model context for the
  unassigned-lane and vehicle cases; no standalone case change.

### §11 Non-functional — theme, undo
- **Theme is Light / Dark / SYSTEM (v29).** v30: *"a user-selectable Light, Dark, or System theme …
  System follows the operating system's appearance."* v25 was **Light / Dark** only. → **story
  SV-9245 is OBSOLETE** (per epic read), so **NO case authored** — recorded, not tested.

### §14 Roles and permissions
- **Edit tier + sidebar wording refreshed for the new interactions (v29).** *"Schedule: Edit … the
  Assign work order modal, assignment of unassigned shifts …"*; sidebar dependency now also hides *"the
  peek popover"*. → context for SCH-PERM cases; no deferred-list case; the permission cases are
  unchanged in substance (the tiers are the same). Noted for coverage.

---

## 3 · 🔴 THE SHOP-CLOSURES CONTRADICTION IS RESOLVED BY v30 — and it produces a tech-design report

**The oldest outstanding Schedule item is answered by the spec itself.** Register rows **S1, X1, NQ-1,
P9** and the **shop-closures half of C4** all rested on a two-way contradiction that was live from v22
through v25:
- §4.5 (v22): *"Shop closures and public holidays are NOT skipped in V1."*
- §12 (older): *"Shop closures … block the spread step from placing shifts on those days."*

**v30 removes the contradiction: BOTH §4.5 and §12 now say closures are NOT skipped and DO receive
shifts.** So the expectation is settled by the newest authoritative product source (Rule 32): **the
spread skips weekends only; shop closures, public holidays and already-booked days all receive
shifts.** No PO answer is needed; the PO question (never sent) is moot.

**⚠️ TECH-DESIGN CONTRADICTION TO REPORT (per the QA lead's 2026-08-12 ruling — core §11.2).** The
2026-07-29 engineering tech plan **agreed with the old §12** (closures block the spread). v30 spec now
says the opposite (closures receive shifts). Per the ruling, **the spec/story wins** (it is one of the
five authoritative sources and it is newer), and the cases follow v30 — **but the contradiction with
the tech design is REPORTED to the QA lead**, not resolved silently. Logged in the register and the
completion report.

**Consequence for cases:** SCH-SPREAD-07 (C29983) and SCH-EDGE-05 (C30089) lose their "waiting on PO"
`HOLD`; their expectation is now the v30 rule. (This pass sets the Rule-69 marker on them, not `READY`,
because build verification is deferred — the later sync confirms them.)

---

## 4 · ANCHOR VALIDITY (case → requirement, Rule 43 reverse direction)

Every §-anchor our 176 cases cite **still exists in v30** — verified by locating each section heading in
the v30 body. **0 orphaned anchors.** Two things moved rather than disappeared:
- **§4.2 was RENAMED** *"Shift start times and unassigned shifts"* → *"Working hours, shift length, and
  unassigned shifts"*. Cases citing §4.2 are still valid (same section number); their **expectation**
  may have changed (handled per §2 above).
- **The VIN-toggle cross-reference moved** from *"(§6)"* to *"(§9)"* inside §4.4 (Filter and Display is
  §9 in v30's numbering of View options). Cases citing the VIN toggle should read §9; **no deferred-list
  case is affected** (SCH-VIEW cases carry their own §9 anchor already). Noted for a follow-up sweep.

**No requirement our cases assert was REMOVED in v25→v30.** The v29 rewrite reworded and expanded; the
only true removals were the OLD unassigned-placeholder-row model and the OLD spread option list, both of
which are superseded by new wording our updates adopt (not orphaned).

---

## 5 · WHAT THIS DOC DOES AND DOES NOT CLAIM (honesty)

- **It IS** the exhaustive, version-attributed v25→v30 delta, both directions, every change verdicted.
- **It is NOT** build-verified — build verification is deferred this pass (Rule 69). Every case updated
  to v30 here carries the `AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026`
  marker; the later sync confirms whether the build matches v30.
- **`requirements.md` is promoted to the v30 baseline in the same pass**: header → v30, a `v25 → v30`
  delta subsection added, and the reworded body sections (§3.1, §3.2, §4.1, §4.2, §4.5, §4.8, §4.9,
  §4.11, §4.12, §5.3, §6, §7, §11) annotated with `[v29]`/`[v30]` delta tags pointing here, with §4.2's
  title corrected. The full verbatim v30 body is the live Confluence page; this doc + the tags make
  `requirements.md` reflect v30's substance.
