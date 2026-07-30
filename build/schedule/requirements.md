# Schedule — Requirements (COMPLETE spec, verbatim-structured) — **Confluence version 23**

> ## Spec-currency header (READ FIRST)
>
> | Field | Value |
> |---|---|
> | **Source page** | Confluence page id **713031682** — "Schedule", space **SHOPVIEW** (`/wiki/spaces/shopviewapp/pages/713031682/Schedule`) |
> | **Confluence version this doc reflects** | **23** |
> | **Upstream last updated** | **2026-07-30T10:40:32Z** by **Branko Cicovic** (PO) — no version comment |
> | **We ingested / promoted to v23 on** | **2026-07-31** |
> | **Previous baseline** | Confluence **version 18** (2026-07-22T09:18Z) — we were **5 versions behind** (19, 20, 21, 22, 23) |
> | **Live pull method** | `GET /wiki/rest/api/content/713031682?expand=body.storage,version,history.lastUpdated` (HTTP 200) — verbatim body in `spec-current-2026-07-31/Schedule-spec-current.md`; version-attributed delta in `spec-current-2026-07-31/SPEC-DIFF.md` |
>
> ### ⚠️ STALENESS GOTCHA — the page body's own "Version" field is a LIE
>
> The page-body header table below reads **`Version | 1.0`** and **`Last Updated | July
> 15, 2026`** — and it has read exactly that since Confluence version 1. **Branko never
> bumps those fields.** They are NOT staleness markers.
>
> **Only the Confluence version number (and `version.when` from the REST API) is a
> reliable currency marker for this page.** This is precisely why our baseline silently
> drifted 5 versions behind: we re-read the body header, saw "Version 1.0 / July 15",
> concluded "unchanged", and missed nine substantive requirement changes. **Before
> trusting this file, re-check the live Confluence version number against the "23" above
> (Rule 23).**
>
> ---
>
> **Project onboarding metadata (recorded 2026-07-21, refreshed 2026-07-31):**
> - **Project:** Schedule — ShopView App · Technician Scheduling Module.
> - **Canonical spec URL (Confluence):**
>   https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/713031682/Schedule
>   — **now readable LIVE via the Atlassian MCP / Confluence REST** (Rule 23); the
>   2026-07-31 promotion to v23 was pulled directly from it. The original 2026-07-21
>   ingest came from an exported `.doc` MHTML file the user provided (method below).
> - **Spec doc metadata (from the page-body header table):** Status = Complete · Author =
>   Product Team · Last Updated = July 15, 2026 · Version = 1.0 · Stakeholders =
>   Engineering, Design, Shop Operations. ⚠️ **These body fields are stale-by-design —
>   see the gotcha above.**
> - **PO:** **Branko** (confirmed 2026-07-21; full name **Branko Cicovic**, confirmed
>   2026-07-31 from the Confluence author field — same PO as Global Search and Filters).
>   Never mix PO attributions across projects: Schedule = Branko, Global Search = Branko,
>   Filters = Branko, Fees & Discounts = Chris Ward, Simple Flow = Milos.
> - **Epic / Jira key:** **SV-8685** — RESOLVED 2026-07-27 (15 stories SV-8686..SV-8700).
>   The spec page itself gained an `Epic` header row in Confluence v21 (2026-07-27).
> - **QA branch / environment + feature-flag status:** ⚠️ **STILL NOT AVAILABLE — ASK THE
>   USER when VIU begins.** Every case remains **VIU-Pending**: spec-pinned, design-pinned
>   and PO-pinned are all ≠ VIU-Verified (Rule 12).
> - **Design / Figma:** **UPDATED 2026-07-22 — a design NOW EXISTS.** spec_1
>   (`66b5d64f-Schedule_1.doc`) added a **Design link** to the doc header (the body is
>   otherwise unchanged vs spec_0 — a word-level diff found ZERO substantive
>   requirement changes). Per Branko (Q0) the linked **Claude prototype
>   `Schedule.dc.html` is the AUTHORITATIVE design** — captured in
>   `spec-v1-2026-07-22/design-notes-claude.md`. This project is therefore **no longer
>   spec-only**; the 2026-07-22 reconciliation folded ~48 previously-"VIU-confirm"
>   labels/visuals to the design's actual wording and resolved the VIN §4.13-vs-§9
>   inconsistency (design §6). **Rule 12:** design-pinned ≠ VIU-Verified — confirm LIVE
>   at the VIU pass once the QA branch + Epic key exist. The record of the pass lives
>   in `spec-v1-2026-07-22/` (spec-diff, design-notes-claude, requirements-v1).
>   Originally (2026-07-21) recorded as SPEC-ONLY with no design — superseded.
> - **Extraction method:** the `.doc` was a Confluence "Export to Word"
>   MHTML / quoted-printable file (`Content-Transfer-Encoding: quoted-printable`,
>   `Subject: Exported From Confluence`). Decoded with Python `email` (MIME walk to the
>   `text/html` part, `get_payload(decode=True)` handles the quoted-printable) +
>   BeautifulSoup, preserving all headings, lists, and tables. Same family as every
>   prior ShopView spec. **The 2026-07-31 v23 promotion instead used the live Confluence
>   REST body (storage format XHTML → markdown), which is now the preferred route.**
>
> ### What changed in this file when it was promoted v18 → v23 (2026-07-31)
>
> Nine substantive upstream changes were folded in. Each is marked inline below with a
> **`[v19]` … `[v23]`** tag naming the Confluence version that introduced it:
>
> | Where | Change | Version |
> |---|---|---|
> | Header table | `Design` row (2 designs) + `Epic` row added | v20, v21 |
> | §4.2 | **NEW** "Hours settings (tech and business hours)" block | v19 |
> | §4.4 | Shift colour: work-order-tied → **default blue + optional per-shift custom colour** | v22 |
> | §4.5 | Spread: weekends skipped **only when business hours are not set for them**; **shop closures and public holidays are NOT skipped in V1** | v22 |
> | §4.6 | Series banners: "breaks around skipped or booked days" removed | v22 |
> | §4.8 | Now-line label "on hover **over the grid**" | v22 |
> | §4.9 | Modal Actions: **"and Reassign to another technician" DELETED** | **v23** |
> | §4.10 / §7 | Cell menu: right-click {New Shift, New Event, View Day} → **left-click {Create event, New work order}** | v22 |
> | §4.11 | **NEW** "Events are not conflict-checked for now" paragraph | v19 |
> | §4.12 | Capacity **includes event time** ("shifts plus events") | v19 |
> | §11 | **NEW** "Dark theme" non-functional requirement | v19 |
>
> Nothing was silently dropped: every sentence the upstream edits removed is preserved
> verbatim in the **"Removed upstream (v19–v23)"** appendix at the end of this file.
> Branko's 2026-07-31 answers are folded in as **`[PO 2026-07-31]`** notes.

---

# Schedule
ShopView · Technician Scheduling Module

| Field | Value |
| --- | --- |
| Status | Complete |
| Author | Product Team |
| Last Updated | July 15, 2026 |
| Version | 1.0 |
| Stakeholders | Engineering, Design, Shop Operations |
| Design | Schedule , Business and Tech hours settings | *(2 design links) `[v20]`* |
| Epic | SV-8685 *(Jira macro in the page)* | *`[v21]`* |

> ⚠️ **The `Last Updated` and `Version` rows above are the page author's own fields and
> are NEVER updated** (they have said "July 15, 2026 / 1.0" since Confluence v1). The real
> currency marker is the **Confluence version number = 23**, see the header at the top.

## 1. Overview
The Schedule module gives shop managers a visual calendar to assign technicians to
work order lines across days and weeks. It replaces manual whiteboards and
spreadsheets with a drag-and-drop interface that respects technician capacity,
surfaces conflicts, and keeps the work order system of record in sync.

### 1.1 Problem statement
Heavy-duty shops manage dozens of open work orders simultaneously, each with multiple
repair lines requiring different technicians and hours. Without a dedicated
scheduling tool, managers rely on memory, whiteboards, or ad-hoc spreadsheets, which
leads to double-bookings, overtime surprises, and unbalanced workloads across the
team.

### 1.2 Goals
- Reduce scheduling errors (double-bookings, weekend assignments, after-hours shifts)
  to near zero with automatic conflict detection.
- Give managers a single screen to see the full week's technician allocation at a
  glance.
- Support multi-day "spread" scheduling for large jobs (engine rebuilds, frame work)
  that span 40 to 160+ hours across days and weeks.
- Keep the work order roster in sync, so scheduling a technician on the schedule
  automatically adds them to the line's labor roster.

## 2. User personas

| Persona | Role | Key needs |
| --- | --- | --- |
| Service Manager | Owns the daily schedule for 5 to 15 techs | Drag-and-drop scheduling, capacity visibility, conflict alerts |
| Service Advisor | Creates work orders, communicates ETAs to customers | See when their work orders are scheduled, which techs are assigned |
| Shop Foreman | Oversees floor execution | Day view of who's doing what, department filtering |
| Technician | Performs the repair work on assigned lines | A clear view of their own assigned shifts and what to work on next, plus their hours |

## 3. Information architecture
The Schedule lives as a top-level nav item alongside Work Orders, Customers, Parts,
and Reports. The screen is split into two regions.

### 3.1 Left panel: work order sidebar
- **Mini calendar.** A month picker with week-highlight and a collapsible grid.
  Clicking a date navigates the main grid.
- **Work order list.** A flat, scrollable list of work order cards. Searchable and
  filterable (see §5). There are no Assigned/Unassigned tabs; assignment is a filter.
- **Line drill-down.** Clicking a work order replaces the list, in place, with that
  order's lines. Only approved work order lines are visible in the schedule sidebar;
  unapproved lines do not appear. Includes a back control, the WO id plus line count,
  a line search box, and "All / Unscheduled" filter chips with counts. Each line row
  is independently draggable (drag handle) and shows its title, estimated hours, and
  current technician roster (avatar stack plus count, with no cap). Lines with no
  technician assigned show a "Needs techs" badge so the manager can see at a glance
  which lines still require someone.
- **Work order card anatomy.** Each card shows, from top to bottom: WO number (in
  accent color, top left) and line count plus hours estimate (top right); customer
  name (bold); unit number; and a lead technician row (avatar plus name). A colored
  left border indicates the work order's status. All of these fields are visible on
  the card and are matched by the sidebar search.
- **Sidebar search ("Search work orders")** matches against: WO number, customer name,
  unit number, and technician name. It filters the card list in real time as the user
  types.
- **Line search ("Search lines")**, visible in the drill-down, matches against line
  title/name only (the list is already scoped to one work order, so
  customer/unit/WO fields would be redundant).

### 3.2 Main area: schedule grid
- **Day view.** A 24-hour timeline per technician row with time-positioned blocks.
- **Week view.** A 7-column grid Mon to Sun (Saturday and Sunday each toggleable) with
  stacked shift chips per cell.
- **Month view.** A compact calendar with per-day capacity bars and shift chips.
- **Grid grouping.** Rows are grouped by department under collapsible group headers
  (e.g. SERVICE/PARTS, ADMINISTRATION), with the department's technicians listed
  beneath each header. This is the only grid grouping; because the department view
  already lists technicians, there is no separate technician-only view or Tech/Dept
  toggle.
- **Unassigned placeholder.** An unassigned row sits within the grid (not a separate
  tray) and holds shifts that are not yet tied to a technician. Dragging a shift from
  this row down onto a technician assigns it. Unassigned shifts use the same
  three-line block anatomy as regular shifts (see §4.4); they simply have no
  technician yet (see §4.2).

## 4. Core features

### 4.1 Drag-and-drop scheduling
The primary interaction model. Users drag a work order card (or an individual line)
from the sidebar and drop it onto a technician × day/time cell in the grid.

| Scenario | Behavior |
| --- | --- |
| Single-line work order | Creates a shift immediately, skipping the scope picker. |
| Multi-line work order | Opens the scope picker to choose whole order, a single line, or several lines. |
| Specific line drag | Dragging a line from the drill-down creates a single-line shift directly. |
| Large job (exceeds the tech's daily hours) | After scope is chosen, opens the spread step to distribute hours across consecutive working days. |

The spread step is conditional: a scope that fits within one of the technician's
working days skips it and creates a single shift.

### 4.2 Shift start times and unassigned shifts
Every shift has a start time. It is derived from a hierarchy:
1. The technician's configured working hours take precedence.
2. If those are not set, the shop's business hours are used.
3. If neither is set, a general default of 7:00 AM to 7:00 PM applies.

> **`[PO 2026-07-31]`** Branko confirmed the general default is **7:00 AM to 7:00 PM**
> (answer B to the 2026-07-27 sheet Q5, restating this hierarchy verbatim). The design
> prototype's hard-coded 8 AM–5 PM is the outlier and is **not** the requirement.
> *Source: `branko-answers-2026-07-31/answers-ingested.md` Q5, 2026-07-31.*

In day view, the start time instead comes from where the shift is dropped on the
timeline.

Unassigned shifts are created by dropping a work order (or line) onto the grid's
Unassigned placeholder row (an in-grid lane, not a separate tray). They follow the
same start-time rules except technician hours (there is no technician yet), so they
fall back to business hours or the default. When an unassigned shift is later dragged
onto a technician row in the grid, that technician's hours apply.

**Hours settings (tech and business hours).** *`[v19 — NEW]`* Working hours are defined
in two places: a technician's custom schedule in Edit Staff Member, and the shop's
business hours in Edit Location. Both use the same pattern:
- **Behind a toggle, off by default.** Each section sits behind a toggle ("Set custom
  hours for this technician" / "Set business hours for this shop"). The per-day editor
  appears only when the toggle is on. A technician with no custom hours inherits the
  shop's business hours (per the hierarchy above).
- **Per-day editor.** One row per day (Mon–Sun): day name, with From → To ranges on the
  right. Each day starts with a single range; "Add hours" appends more to support split
  shifts, each removable. Added ranges start empty so the user explicitly sets the times.
- **Overlap validation.** If a day's ranges overlap, the offending range is flagged in
  red with an inline message ("These hours overlap. Adjust the times so they don't
  conflict.") and Save is disabled until it is resolved. Incomplete rows (empty From/To)
  are ignored by the check.

> **QA note — two live conflicts with the engineering tech plan, both still open with
> Branko** (the spec text above is the newer artefact and currently wins, Rule 15
> last-update-wins):
> - **Where the hours live.** This spec says **Edit Staff Member** + **Edit Location**.
>   The engineering tech plan builds a separate **"Schedule Settings"** page in
>   Administration. Our cases follow the spec. *(open question — see the PO sheet)*
> - **Split shifts.** This spec explicitly says "'Add hours' appends more to **support
>   split shifts**". The tech plan's data model stores **one range per weekday**. Our
>   cases follow the spec. *(open question — see the PO sheet)*
>
> This block is the source text behind story **SV-8699**, from which SCH-HRS-01..07 were
> authored 2026-07-27 — i.e. we already had this requirement from Jira before we caught it
> in the spec.

### 4.3 Scope picker
When a multi-line work order is dropped, a popover anchored to the drop cell lets the
manager choose what to schedule:
- **"Schedule whole work order"** is pinned at the top, visually distinct, and labeled
  with the line count and total hours. It assigns the technician to all lines and
  creates one whole-order shift.
- **Individual line rows.** Tapping a row is the fast path: it immediately creates a
  single-line shift with no confirmation step. Each row shows the line title,
  estimated hours, and current technician roster (avatar stack plus count).
- **"Select multiple"** is an opt-in control that switches the line rows into
  checkboxes and shows a confirm bar with a running tally ("Create shift · 2 lines ·
  6h"), a "Select all" shortcut (equivalent to whole order), and Cancel (returns to
  the fast single-tap list).

There is no technician cap and no swap flow. Scheduling a technician onto a line
simply adds them to that line's roster.

### 4.4 Shift block anatomy and scope labeling
Every shift block on the grid shows three lines of text (four when VIN is toggled on),
with a default blue color (users can optionally assign a custom color per shift via the
color picker in the detail modal, see §10): *`[v22 — changed]`*
- Line 1: customer name, plus the conflict icon if the shift is conflicted.
- Line 2: unit number.
- Line 3 (optional): VIN number, visible only when the VIN toggle is on in Filter and
  Display (§6). Shown in day and week views only; month view omits it due to space
  constraints.
- Last line: the line name for a single-line shift, or "N Lines" when the shift covers
  more than one line.

There is no work order number and no scope icons on the block; the conflict icon is
the only icon. Whole-order and multi-line-subset shifts both read as "N Lines" on the
block, and the detail modal spells out the exact scope.

### 4.5 Multi-day spread scheduling
For jobs exceeding a technician's daily capacity, the spread step distributes the work
across consecutive working days. It appears as step 2 of the same modal, with a header
showing the chosen scope and a "Change scope" back-link.
- **How much to schedule** is set by a single selector that defaults to Full estimate
  (the most common choice). Most options apply on selection with no extra fields; only
  the custom ones reveal a control. This progressive disclosure (Google Calendar
  style) keeps the modal to one line in the common case and expands only for the
  custom options.
  - **Full estimate**, **1 week**, and **2 weeks** apply immediately with nothing to
    fill in.
  - **Until a date…** reveals a single "finish by" date field.
  - **Specific hours…** reveals an hours stepper.
- **Start date.** Defaults to the earliest working day. Adjusting it is how a second
  technician's series can be made sequential (starting after the first) rather than
  parallel.
- **Uses the technician's own working hours.** Automatically skips weekends when
  business hours are not set for them. Shop closures and public holidays are not skipped
  in V1.. *`[v22 — changed]`* *(the doubled full stop is the spec's own typo — reproduced
  verbatim, do NOT "fix" it in case wording)*

  > ⚠️ **SPEC-INTERNAL CONTRADICTION (flagged, not resolved — Rule 15).** §4.5 above says
  > shop closures are **NOT skipped in V1**, but **§12 Edge cases** still says closures
  > "**block the spread step from placing shifts on those days**". Both sentences are live
  > in Confluence v23. We do NOT pick a side: our cases follow §4.5 ("not skipped"), and
  > this contradiction is an open confirmation question for Branko. The engineering tech
  > plan takes the §12 side (it builds real closure-skipping), which is the second half of
  > the same open question.
- **Preview**, collapsed by default: a one-line summary ("20 shifts · Jun 15 to Jul 13
  · skips weekends + 2 days"), expandable to a week-by-week breakdown with skipped days
  struck through and their reasons.
- **Confirming** creates a linked series of daily shifts.

Each drop spreads the full estimate for that technician, independently. Dropping the
same work order on a second technician spreads the full estimate again for them. There
is no shared "remaining" counter across technicians and no splitting of a shift.
Because progress is driven by clocked-in time, scheduled hours, the estimate, and
actual hours are three separate quantities and are not forced to reconcile.

### 4.6 Linked series and banners
A series is a group of shifts created by the spread step; all shifts in a series share
a series id. The series is a render-time grouping, not a special record. Underneath it
is N individual daily shifts, each keeping its own day and hours, so capacity,
overtime, and conflict logic all operate on the individual shifts unchanged.

Shifts sharing a technician plus series id render as one connected banner:
- **Month view:** a continuous bar wrapping across week rows, labeled once at the start
  (with the technician), with a faded "continues" label on later weeks, empty weekend
  columns (when business hours are not set for weekends). *`[v22 — changed]`*
- **Week view:** one banner spanning the working days of that week in the technician's
  row, with chevrons at the edges indicating continuation beyond the visible week, a
  "week N of M" cue. *`[v22 — changed]`*
- **Day view:** that day's single time-positioned block with a "part of an M-week job"
  cue (only one day is visible, so there is no spanning bar).

### 4.7 Overlap and lane stacking
Overlapping shifts for the same technician never visually collide:
- Shifts whose time ranges do not intersect share a single lane, so sequential or
  back-to-back work keeps the row at normal height.
- Shifts whose time ranges do intersect split into stacked lanes, and the row grows to
  fit.
- Visible lanes are capped at 3. Additional overlapping shifts collapse into a "+N
  more" affordance that opens a popover listing the hidden shifts. This applies in day,
  week, and month views (week and month reach the overflow much sooner because cells
  are narrower).
- Overlap on the same technician is a conflict (see §4.11) and is flagged, so stacking
  reads as "resolve me," not "two normal jobs."

### 4.8 Day view: timeline interactions
- **Auto-scroll to business hours.** On initial day-view load and when navigating to a
  new day, the timeline auto-scrolls so the working-day start sits at the left edge of
  the visible area (with a small 30 to 60 minute buffer before it). The start time
  comes from the same hierarchy shifts use: the earliest technician's configured start
  if tech hours are set, otherwise business hours, otherwise 7:00 AM. If technicians
  have different start times, the earliest one is used so no shifts are off-screen. The
  auto-scroll fires only on load or day navigation; if the user scrolls manually, their
  position is not overridden. The full 24-hour timeline remains intact and scrollable.
- **Sticky header bar.** Date and time headers stick to the top of the viewport during
  vertical scroll, so the user always knows which time column they are looking at. This
  applies in both day and week views.
- **Horizontal drag** to move a shift's start time (snaps to 15-minute intervals).
- **Edge resize.** Drag the left or right edge to adjust duration.
- **Lane stacking.** Overlapping shifts split into parallel lanes per §4.7.
- **Lane height with VIN.** When the VIN toggle is on (§9), lane heights in day view
  grow to accommodate the additional VIN line so block text is not clipped.
- **Now line.** A vertical indicator showing the current time, with a label on hover over
  the grid. *`[v22 — changed]`*
- **Business-hours shading.** An optional grey overlay outside working hours.

### 4.9 Shift detail modal
Clicking a shift block opens a detail panel showing:
- Customer name, unit number, VIN (always visible, below unit and asset), and work
  order id.
- Scheduled date and start/end time pickers (15-minute increments).
- Technician.
- Time logged vs estimate (progress).
- Scope summary and the scheduled line(s) with labor/total figures.
- Estimated hours with inline edit.
- Color picker (see §10).
- Notes: add, edit, and delete per work order.
- A conflict banner with an "Adjust" action when the shift is conflicted.
- Actions: Delete (series-aware, §7) *`[v23 — "and Reassign to another technician" DELETED]`*

> **`[PO 2026-07-31]`** Branko confirmed **no 'Reassign' button in the shift pop-up** —
> moving a shift to another technician is done **only by dragging it** (answer B, verbatim
> "B - No button"). Confluence **v23 (2026-07-30)** deleted the Reassign action from this
> list, so spec + design prototype + engineering tech plan + PO now all agree. **Jira story
> SV-8695 still lists a modal Reassign action and is now the stale artefact** — worth
> telling Branko/dev.
> *Source: `branko-answers-2026-07-31/answers-ingested.md` Q2 + `spec-current-2026-07-31/SPEC-DIFF.md` R1, 2026-07-31.*

### 4.10 Events
Non-work-order time blocks (meetings, training, stand-ups) that occupy technician
time:
- Create via left-click on empty grid space, which opens a menu with 'Create event' and
  'New work order'.. *`[v22 — changed]`* *(the doubled full stop is the spec's own typo —
  reproduced verbatim)*

  > **`[PO 2026-07-31]`** Branko confirmed (answer C, correcting our question's premise):
  > "**there is no right click, only left click.** when clicked it opens dropdown menu with
  > two options (**Create event, New work order**) as mentioned in prd." So the shortcut IS
  > in V1 and those are the exact two menu items.
  > *Source: `branko-answers-2026-07-31/answers-ingested.md` Q4, 2026-07-31.*
- Event modal: name, date, start/end time, all-day toggle, color category.
- Drag-and-drop to reassign between technicians or move between days.
- Day view shows a live preview block while creating, with drag-to-resize.
- **Event card anatomy.** Event cards are styled to be structurally distinct from
  shift cards, so the two types are separable at a glance (not by color alone): a
  white/neutral card with a thin even border on all four sides and no colored left rail
  (the left rail is the shift's cue), a small grey-filled rounded chip on the left
  containing a calendar icon, and two lines of text beside it (event name, then the
  time range in secondary text). Shifts read as tinted color-filled blocks with a
  colored left rail; events read as quieter, white outlined cards.
- **Event color.** The default event color is neutral/grey. Events use the same custom
  color palette as shifts (the shared color picker with editable labels, see §10);
  choosing a color from the event modal tints the card and icon chip in the matching
  tones, the same way a colored shift is tinted.

### 4.11 Conflict detection
The system continuously scans for scheduling issues and surfaces them in a toolbar
pill:

| Conflict type | Description |
| --- | --- |
| Double-booked | Two different work orders overlap on the same technician at the same time. |
| Weekend shift | Shift scheduled on Saturday or Sunday (outside working days). |
| Before hours | Shift starts before the working-day start. |
| After hours | Shift extends past the working-day end. |

Conflicts appear as a warning icon on the affected block and are listed in a dropdown
from the toolbar. Clicking a conflict navigates to the relevant technician and day.
Red and other alarming styling is reserved for conflicts and genuine errors, never for
overtime.

Events are not conflict-checked for now: an event overlapping a shift (or another event)
does not raise a conflict. Their time still counts toward capacity (see §4.12).
*`[v19 — NEW]`*

> **QA note — open with Branko:** the table above lists **Double-booked** as a conflict
> type (so it should count in the toolbar pill and list). The engineering tech plan treats
> double-booking as a **milder front-end warning only**, excluded from the conflict count.
> The spec text above is what our cases follow; the discrepancy is an open question.

### 4.12 Capacity visualization
When enabled in View Options, each day column header shows a capacity bar. Fill
represents aggregate utilization; overtime is a separate per-technician signal, and
the two are independent. Event time is included in the utilization total alongside
shifts, so meetings and training consume capacity even though they are not
conflict-checked (see §4.11). *`[v19 — NEW sentence]`*

> **`[PO 2026-07-31]`** Branko confirmed **event hours DO consume capacity** (answer A,
> quoting this section: "A 2-hour meeting consumes 2 hours of capacity. Note the split in
> §4.11: events count toward capacity but are not conflict-checked."). This **reverses** his
> earlier "currently No, will check" — newest-wins. Spec + design + engineering plan + PO
> now all agree. *Source: `branko-answers-2026-07-31/answers-ingested.md` Q1, 2026-07-31.*
>
> **Still spec-silent (open questions, do NOT assert either way in cases):**
> 1. Do event hours also feed the **"OT" overtime tag** and the **per-technician hover
>    breakdown**, or only the aggregate bar? §4.12 calls overtime "a separate
>    per-technician signal, and the two are independent" and never says.
> 2. Does an event placed on a **whole department** consume each of those technicians'
>    capacity? Not in the spec at all.
> 3. Does an **all-day** event (no start/end time) consume a full working day, or is it
>    visual-only? Not in the spec at all.
> 4. When the **Events** view option is switched OFF, do those hours come back out of the
>    capacity bar, or are the events merely hidden while the bar keeps counting them? Not in
>    the spec.

- **Blue fill:** aggregate technician-hours booked (shifts plus events) divided by total
  available (the sum of all techs' working hours). Clamped at 100%. The track width equals
  capacity and is identical across all days, so bars stay comparable at a glance (no
  per-day rescaling). *`[v19 — changed]`*
- **Amber spill:** when aggregate hours exceed capacity, an amber segment extends past
  the right edge of the track, with a tick at the 100% line.
- **"OT" tag:** appears whenever any individual technician exceeds their own daily
  hours, even when the day's aggregate is under capacity. It is a text tag, not a
  color-only signal.
- **Hover tooltip:** a per-technician breakdown (assigned vs that tech's capacity),
  with overtime technicians highlighted in amber.

### 4.13 Hover tooltips (read-only)
Hovering a block shows a quick peek without opening the modal.
- **Shift tooltip:** customer name (plus the conflict icon if conflicted); unit,
  vehicle, and VIN; date and time range; technician; scope summary ("N lines · Xh");
  the individual line names as a short list capped at 3 with a "+N more lines" row (no
  line statuses); a time-logged progress bar ("X / Yh"); and the conflict reason in
  amber when conflicted.
- **Event tooltip:** event name (plus its grey category dot); date and time range;
  technician.
- **Behavior:** open after a roughly 300 to 500ms hover delay; dismiss on mouse-leave;
  read-only, so clicking the block still opens the full modal. Because the shift
  tooltip's height varies with the line list, it flips to open above the block when
  there is not room below and shifts horizontally to stay within the viewport, rather
  than being clipped.

## 5. Sidebar features

### 5.1 Work order filters
Filters live behind a "Filter" button (with an active-count badge); there are no
assignment tabs. Applying a filter narrows the flat card list, and "Clear all" resets
in one click.

| Filter group | Options |
| --- | --- |
| Assignment | Assigned, Unassigned |
| Status | All work order statuses currently supported in the app |
| Priority | High, Medium, Low |

Search and filter work together: the search field (see §3.1) narrows by text match,
and the filter button narrows by structured attributes. Both can be active at the same
time.

The line drill-down has its own filters: All and Unscheduled (lines with no shifts
yet), plus a line-name search (see §3.1).

### 5.2 Mini calendar
- Month/year picker (grid of month buttons, year nav arrows).
- Collapsible: a chevron toggle hides the calendar grid to maximize work order list
  space.
- Selected date highlighted; today indicated; week row highlighted on hover.

## 6. Grid toolbar

| Control | Function |
| --- | --- |
| Today button | Jumps the grid to the current date. |
| Left/right arrows | Navigate by day, week, or month depending on the active range. |
| Date label | Shows the current range (e.g. "Jul 14 to 20, 2026"). |
| Conflict pill | Shows the issue count; click opens the conflict detail dropdown. |
| Search | Filters grid blocks by matching against customer name, WO number, unit number, technician name, and line name. Non-matching blocks fade; matching blocks highlight. |
| Filter and Display | Dropdown (checkbox style) combining department visibility toggles, My Shifts, and VIN. Replaces the former "Departments" control. |
| View Options | Toggles: Business hours, Capacity bars, Events, Tech hours, Saturday, Sunday. |
| Day / Week / Month | Segmented control to switch the grid range. |

## 7. Interactions and micro-interactions
- **Drag feedback.** Drop-target cells highlight, and a ghost block shows the line name
  and hours.
- **Shift reassignment.** Dragging a shift block from one technician row to another
  reassigns it: the target technician is added to the affected line's roster and the
  source technician is removed. A confirmation modal handles cross-tech moves.
- **Left-click on empty grid space** opens a menu with: Create event, New work order.
  *`[v22 — changed; was "Right-click context menu on any grid cell: New Shift, New Event,
  View Day"]`* — confirmed by Branko 2026-07-31 (see §4.10).
- **Toast notifications.** Every create, delete, move, and reassign action produces a
  toast with an Undo option. The toast persists for 4 to 7 seconds, stays while the
  cursor is over it, and dismisses on mouse-leave.
- **Keyboard support.** Global shortcuts work anywhere on the schedule page:
  - **Escape** closes the topmost open modal or popover, following a defined stacking
    order (delete scope, reassign, spread, capacity, event modal, event view, line
    picker, shift detail, cell menu, calendar picker, customize, filters, search).
    Within the shift modal, Escape first dismisses any open sub-picker (color picker,
    time picker, note edit) before closing the modal itself.
  - **Enter** confirms the active confirmable dialog (delete scope, reassign, spread,
    event create/edit). It does not fire inside textareas, so multiline note editing
    still works normally.
  - Drag-and-drop has a **click-to-arm** alternative for users who cannot drag.
- **Series-aware deletion.** Deleting a shift that belongs to a series asks for scope.
  This is routine, lightweight editing (undo toast, not the alarming destructive
  styling):
  - **This shift only:** removes that day. The series keeps the gap (it is not
    auto-closed), and the hours return to the estimate's remaining.
  - **This and everything after:** removes from the clicked shift onward, keeping
    earlier shifts.
  - **The whole series:** removes all of the series' shifts for that technician.
  - The options adapt to position: on the first shift, "this and after" equals "whole
    series" (show two options); on the last shift, "this and after" equals "this only"
    (two options); only middle shifts show all three. Each option states its
    consequence in hours returned ("returns 8h" / "returns 56h").

## 8. Data model

### 8.1 Key entities

| Entity | Key fields | Relationships |
| --- | --- | --- |
| Shift | `sid`, `woId`, `rowKey` (tech), `date`, `startHour`, `blockDuration`, `lines[]`, `seriesId` | Belongs to Work Order; assigned to Technician; optionally part of a Series |
| Event | `eid`, `name`, `rowKey` (tech), `date`, `startHour`, `endHour`, `allDay`, `color` | Assigned to Technician |
| Work Order | `id`, `customer`, `unit`, `asset`, `status`, `priority`, `hrs`, `color` | Has many Lines |
| Line | `num`, `title`, `status`, `est`, `actual`, `total`, `labor[]` | Belongs to Work Order; has many Technicians via the labor roster (no cap) |
| Technician | `key`, `name`, `role`, `dept`, `hours` (working start/end plus working weekdays) | Belongs to Department; has many Shifts and Events |
| Department | `key`, `name` | Has many Technicians |

The Line's `labor[]` roster has no maximum; any number of technicians may be on a
line. An unassigned shift has an empty or placeholder `rowKey` until it is moved onto a
technician.

### 8.2 Series
A series groups shifts created by the spread step; all shifts in a series share a
`seriesId`. The series supports scoped deletion (this / this-and-after / whole) and
renders as a connected banner in month, week, and day views. It is a grouping over
ordinary daily shifts, not a distinct persisted entity beyond the shared id, and each
daily shift carries its own hours for capacity math.

## 9. View options and customization
Display settings are split across two toolbar controls:

**Filter and Display dropdown** (checkbox style, §6):

| Option | Default | Effect |
| --- | --- | --- |
| Department toggles | All on | Show or hide individual department groups in the grid. |
| My Shifts | Off | Filters the grid to show only shifts assigned to the current user. All other technician rows and their shifts are hidden. This is a personal convenience filter, not a permission boundary. |
| VIN | Off | Shows the VIN number as an additional line on shift blocks (day and week views) and in hover tooltips. The VIN is always visible in the shift detail modal regardless of this toggle. |

> **`[PO 2026-07-31]`** ⚠️ **The "and in hover tooltips" wording above is loose and Branko has
> overruled it.** He confirmed (answer A): "**Vin is always visible on hover regardless of the
> toggle.**" So the **VIN toggle gates the shift BLOCK only**; the hover tooltip always shows
> VIN (matching §4.13). This resolves the long-standing §4.13-vs-§9 inconsistency in favour of
> §4.13 and **closes OQ-6(a)**. The §9 prose is still loosely worded upstream in v23 — a
> spec-text tidy-up to raise with Branko, not a case change.
> *Source: `branko-answers-2026-07-31/answers-ingested.md` Q6, 2026-07-31.*

**View Options popover:**

| Option | Default | Effect |
| --- | --- | --- |
| Business Hours | Off | Shades non-working hours in day view. |
| Capacity Bars | On | Shows per-day capacity utilization bars in column headers. |
| Events | On | Shows non-WO event blocks on the grid. |
| Tech Hours | Off | Displays each technician's working hours next to their name. |
| Saturday | On | Includes the Saturday column. |
| Sunday | On | Includes the Sunday column. |

## 10. Color system
- Blue is the default color for all shifts, including long or multi-week jobs.
- Grey is the default color for events.
- All other colors are optional and chosen by the user from the color picker in the
  shift or event detail modal, to distinguish shifts however the shop likes.
- Color labels are editable per shop.

Each color provides three tones: background fill, text color, and accent (left
border). There are no fixed semantic meanings tied to specific colors beyond the two
defaults above.

## 11. Non-functional requirements
- **Performance.** The grid must render smoothly with up to 15 technicians × 7 days ×
  several shifts per cell. The sidebar work order list virtualizes at 50+ items, as
  does the line drill-down for orders with many lines.
- **Responsiveness.** Minimum supported width is 960px (the grid scrolls horizontally
  below that), and the sidebar collapses on narrow viewports.
- **Accessibility.** All interactive elements are keyboard-reachable; focus rings
  follow the design system; modals trap focus and close on Escape; drag-and-drop has a
  click-to-arm alternative. Overtime and conflict signals are not color-only (OT uses a
  text tag; the overflow uses shape).
- **Undo.** Every destructive action (delete, move, reassign) is undoable for 4 to 7
  seconds via a toast that persists while hovered.
- **Dark theme.** *`[v19 — NEW]`* The Schedule supports a user-selectable Light / Dark
  theme, chosen from the user menu and persisted per user. It is built on the design-system
  color tokens, so surfaces, borders, text, and accents remap automatically;
  elevation/shadow tokens also swap so depth reads correctly on dark surfaces.

  > **QA note:** this confirms SCH-EDGE-08 (C38866) is **spec-backed**, not merely
  > tech-plan-pinned — it was authored 2026-07-30 from the engineering plan before we saw
  > this spec text.

## 12. Edge cases and constraints
- A technician can have multiple shifts on the same day (different work orders);
  overlapping times render in parallel lanes with a 3-lane cap and "+N more" overflow
  (§4.7).
- Every shift has a start time, resolved from the hierarchy in §4.2 or from the drop
  position in day view; unassigned shifts use the same rules minus technician hours
  until they are assigned.
- Shop closures (holidays, inventory days) are defined at the shop level and block the
  spread step from placing shifts on those days. ⚠️ **CONTRADICTS §4.5** ("Shop closures
  and public holidays are not skipped in V1"). Both sentences are live in Confluence v23 —
  unchanged here since our v18 baseline, i.e. Branko updated §4.5 in v22 and did not update
  this bullet. **Flagged, not resolved** (Rule 15): our cases follow §4.5, and this is an
  open confirmation question for Branko.
- Dropping the same work order on multiple technicians creates independent series, each
  spreading the full estimate, so planned hours across technicians may exceed the
  estimate. This is expected, since clocked-in time drives progress.
- Whole-order and multi-line-subset shifts both render as "N Lines" on the block; the
  detail modal and hover tooltip provide the specifics.
- Dragging a shift between technicians reassigns it, adding the target technician to the
  affected line's roster and removing the source technician.

## 13. Success metrics

| Metric | Target | Measurement |
| --- | --- | --- |
| Scheduling conflicts | Under 5% of shifts | Flagged shifts divided by total shifts per week |
| Time to schedule | Under 30s per shift | Median time from drag start to shift creation |
| Adoption | 80% of active shops | Shops with at least 1 shift created per week, 90 days post-launch |
| Undo usage | Under 10% of actions | Undo clicks divided by total scheduling actions |

## 14. Roles and permissions
The Schedule is a CRUD area in ShopView's custom roles and permissions system. Access
is controlled by three independent permission levels (View, Edit, Delete), where Delete
requires Edit and Edit requires View. The schedule also depends on permissions from
other areas, particularly Work Orders.

### 14.1 Permission tiers
- **Schedule: View.** The user can see the schedule page, navigate between
  day/week/month views, use the mini calendar, search, filter, view all technicians'
  shifts and events, hover for tooltips, and open shift/event detail modals in
  read-only mode. All editing affordances (drag handles, drop targets, right-click
  context menu, resize handles, creation entry points, edit fields in modals, reassign
  and delete actions) are hidden or disabled. This is the experience for roles like
  Technician, Parts Manager, Parts Tech, Office, and Time Clock. When Schedule: View is
  OFF, the Schedule top-level nav item is hidden entirely.
- **Schedule: Edit (requires View).** Unlocks all creation and modification
  interactions: drag-and-drop from the sidebar, the scope picker, the spread modal,
  shift and event creation (including via right-click context menu and day-view
  click-to-create), shift reassignment between technicians, edge-resize and horizontal
  drag in day view, and editing fields in the shift/event detail modals. This is the
  level for Service Manager, Senior Service Advisor, Service Advisor, and Foreman
  roles.
- **Schedule: Delete (requires Edit).** Unlocks deleting shifts and events, including
  series-aware deletion with its three scopes (this shift / this and after / whole
  series). Without Delete, a user with Edit can create and modify but cannot remove
  shifts or events. The delete action and the trash icon are hidden.

### 14.2 Work order sidebar dependency
The left panel sidebar displays work order data (customer, unit, lines, lead tech) and
requires **Work Orders: View** to populate. If a user has Schedule access but Work
Orders: View is OFF, the sidebar hides the work order list and line drill-down (the
mini calendar remains available). The user can still view and interact with shifts
already on the grid, but cannot drag new ones from the sidebar since the WO list is not
visible.

### 14.3 No permission-level "own only" restriction
The schedule always shows all technicians' shifts and events for every user who has
Schedule: View. There is no role-based restriction to "own shifts only." This is
intentional: the schedule is a shared coordination resource that service advisors and
managers use to orchestrate work across the team. The "My Shifts" toggle in the Filter
and Display dropdown (§9) provides this as an optional personal convenience filter, not
a security boundary.

> **QA note — the spec is SILENT on WRITE scoping (re-verified against the live v23 body
> 2026-07-31).** §14.3 above rules out an "own only" restriction on **viewing**. It says
> nothing about whether a technician-type user may **change** another technician's shifts.
> The engineering tech plan builds own-data write scoping (a cross-technician edit is
> refused). This is a genuinely open question — and Branko has said it is **not his**
> ("I'm not sure if this question is for me Bilal." on the related backend-scope question),
> so it is **re-routed to engineering / the QA lead**, not re-asked of the PO.
> *Source: `tech-plan-2026-07-29/Questions-for-Branko-dev.md` NQ-5 + `branko-answers-2026-07-31/answers-ingested.md` Q7, 2026-07-31.*

### 14.4 Technician grid rows are department-based
Whether a user appears as a row in the schedule grid is controlled by their department
assignment on their staff record, not by their role permission. Any staff member
assigned to a department that is visible on the schedule appears as a technician row,
regardless of their role. Similarly, the ability to clock into work order line tasks is
controlled by the "Time Clock" setting on the staff record, not by the permission
model.

## 15. Future considerations

*(The spec's own heading is just "15. Future considerations"; our earlier copy appended
"(OUT OF SCOPE for this spec / V1)" as a QA annotation. Everything in this list is out of
V1 scope.)*

> **`[PO 2026-07-31]`** A **printable / exportable week view** is **NOT** in V1 — and not
> even in this future-considerations list. Branko: "**No. There is nothing about this in the
> PRD, not in the future requirements.**" Independently corroborated by a full-text scan of
> Confluence v23: no export/print item in §6 Grid toolbar, §9 View options, or §15.
> Consequence: **SCH-EXP-01 (C38853) was RETIRED + DELETED 2026-07-31, user-authorized** —
> `delete_case`/38853 → HTTP 200, re-GET → HTTP 400 = verified gone; run 357 165 → 164 tests,
> 429 result records intact; section 5406 "Week Export and Printing" now empty but NOT deleted.
> Active tally 165 → **164**. Audit: `week-export-retire-2026-07-31/`.
> *Sources: `branko-answers-2026-07-31/answers-ingested.md` Q3 + `week-export-retire-2026-07-31/testrail-execution-log-2026-07-31.md`, 2026-07-31.*

- **Technician availability and PTO.** Block out vacation, sick time, and training that
  are not Events, and have the spread step flow around them.
- **Auto-scheduling.** Suggest optimal technician assignments based on skills,
  availability, and workload balance.
- **Recurring events.** Repeating calendar blocks for stand-ups and safety meetings.
- **Skill matching.** Warn when a technician is assigned to a line requiring
  certifications they do not hold.
- **Spread around existing bookings.** Have the spread step automatically flow around
  days the technician is already booked (skipping them and extending the end date),
  rather than requiring the manager to handle conflicts manually.
- **Long-job cap.** Past a certain length, instead of materializing every daily shift,
  represent a very long job as a single assignment span across a date range and let
  clock-ins fill the actuals, reducing board clutter and the number of shift records to
  manage.

---

## OPEN QUESTIONS / ITEMS TO CONFIRM (refreshed 2026-07-31 against Confluence v23)

- **OQ-1 — PO name. RESOLVED** = **Branko Cicovic** (2026-07-21 as "Branko"; full name
  confirmed 2026-07-31 from the Confluence author field). Same PO as Global Search and
  Filters. The spec's own author field still only says "Product Team".
- **OQ-2 — Epic / Jira key. RESOLVED 2026-07-27 = SV-8685** (15 stories
  SV-8686..SV-8700). Confluence v21 added an `Epic` row to the page header. Rule-20 refs
  are backfilled on every case.
- **OQ-3 — QA branch / environment + feature-flag / settings status. STILL OPEN — NOT
  available.** **ASK THE USER when VIU begins** (is Schedule behind a feature flag, a
  settings toggle, or a QA branch/deployment? Unknown). Consequence: **no case has been
  live-verified**; the whole suite is VIU-Pending (Rule 12).
- **OQ-4 — Designs. RESOLVED / SUPERSEDED.** A design now exists: per Branko (Q0) the
  Claude prototype `Schedule.dc.html` is authoritative (captured in
  `spec-v1-2026-07-22/design-notes-claude.md`); Confluence v20 added a **second** design
  link, "Business and Tech hours settings". ~48 previously-"VIU-confirm" labels were folded
  to the design's wording on 2026-07-22, ~18 still need a LIVE confirm. **Rule 12:
  design-pinned ≠ VIU-Verified.**
- **OQ-5 — Spec-internal ambiguities to resolve at authoring/VIU** (all from the spec text
  itself):
  - The exact on-screen wording of many labels is stated in the PRD but MUST be confirmed
    against the real build during VIU (Standing Rule 9) — e.g. "Needs techs" badge,
    "Schedule whole work order", "Select multiple", "Select all", "Change scope", the spread
    options ("Full estimate", "1 week", "2 weeks", "Until a date…", "Specific hours…"), "+N
    more", the conflict-pill copy, toast/undo copy, the left-click cell-menu items ("Create
    event", "New work order" — **updated: the old "New Shift / New Event / View Day"
    right-click menu was removed in v22**), and the "Filter and Display" / "View Options"
    control names.
  - Department group header examples ("SERVICE/PARTS", "ADMINISTRATION") are illustrative —
    actual department names come from the tenant's data.
  - "Work order statuses currently supported in the app" (§5.1 Status filter) — the concrete
    status list is not enumerated in this spec; source it from the app during VIU.
  - No API endpoints, HTTP methods, or status codes appear anywhere in this spec (§8 Data
    model is entity-level only). **The engineering tech plan (ingested 2026-07-29) IS the
    backend description** — 17 endpoints + an error contract — and 4 lean API cases exist
    (SCH-API-01..04 = C38872–C38875). Whether backend coverage is formally in V1 QA scope is
    a question Branko declined ("I'm not sure if this question is for me Bilal.") →
    **re-routed to engineering / the QA lead.**
  - No dev plan / phasing / rollout section is present in this spec. The separate
    engineering tech plan supplies phasing.
- **OQ-6 — Hover-tooltip VIN. RESOLVED 2026-07-31** — Branko: VIN is **always** visible on
  hover regardless of the toggle (answer A). §9's "and in hover tooltips" wording is loose
  upstream and should be tidied by Branko; §4.13 is authoritative.

### Spec-internal contradictions live in Confluence v23 (flagged, NOT resolved — Rule 15)

| # | Contradiction | Our position | Status |
|---|---|---|---|
| X1 | **Shop closures on spread.** §4.5 "**not skipped in V1**" vs §12 Edge cases "**block the spread step from placing shifts on those days**" | cases follow §4.5 (not skipped) | Confirmation question to Branko; the engineering plan takes the §12 side |
| X2 | **VIN in tooltips.** §9 implies the VIN toggle gates the tooltip; §4.13 says the tooltip always shows VIN | cases follow §4.13 | **RESOLVED by Branko 2026-07-31** (always visible); §9 text needs an upstream tidy |

### Questions the spec does not answer at all (spec-silent → asked, never assumed)

| # | Question | Why it matters |
|---|---|---|
| S1 | Do **event** hours also count toward the **"OT" overtime tag** and the **per-technician hover breakdown**, or only the aggregate capacity bar? | §4.12 now includes events in the aggregate but calls overtime "a separate per-technician signal, and the two are independent" |
| S2 | Can an event be created for a **whole department** rather than one technician — and if so does it consume every one of those technicians' capacity? | Not in the spec at all; the engineering plan's default is "no" (an engineering default, not a product ruling) |
| S3 | Can an event cover a **whole day** (no start/end time), and does it then consume a full working day? | Not in the spec; the engineering plan's default is "visual only" |
| S4 | If a user switches the **Events** view option OFF, do those hours come **out of** the capacity bars, or are the events merely hidden while the bars keep counting them? | Only became a question once events started consuming capacity (v19) |
| S5 | May a technician-type user **change** another technician's shifts? | §14.3 rules out own-only **viewing** but is silent on **writing**; the engineering plan builds own-data write scoping. **Re-routed to engineering/dev** — Branko says it is not his question |
| S6 | Does **double-booking** count in the conflicts pill/list, or is it only a milder on-block warning? | §4.11 lists "Double-booked" as a conflict type; the engineering plan treats it as a soft front-end warning only |

---

## APPENDIX — Removed upstream (v19–v23)

Every sentence/clause that Branko **deleted or replaced** between Confluence v18 (our old
baseline) and v23, kept verbatim so the history is not lost. **None of this is a current
requirement** — do not write cases to it.

| # | Section | Removed / replaced text (verbatim from v18) | Replaced by | Version |
|---|---|---|---|---|
| R1 | §4.9 Shift detail modal | "Actions: Delete (series-aware, §7) **and Reassign to another technician**." | "Actions: Delete (series-aware, §7)" — the Reassign action is gone; drag-only reassignment | **v23** |
| R2 | §4.4 Shift block anatomy | "…with **color tied to the work order (so blocks from the same order share a color)**:" | "…with a **default blue color** (users can optionally assign a custom color per shift via the color picker in the detail modal, see §10):" | v22 |
| R3 | §4.5 Multi-day spread | "Uses the technician's own working hours. **Automatically skips weekends and shop closures, so the end date is emergent.**" | "Uses the technician's own working hours. Automatically skips weekends **when business hours are not set for them**. **Shop closures and public holidays are not skipped in V1..**" | v22 |
| R4 | §4.6 Linked series — month view | "…a faded 'continues' label on later weeks, empty weekend columns, **and visible breaks around skipped or booked days**." | "…a faded 'continues' label on later weeks, empty weekend columns **(when business hours are not set for weekends)**." | v22 |
| R5 | §4.6 Linked series — week view | "…a 'week N of M' cue, **and a break around any day the technician is otherwise booked**." | "…a 'week N of M' cue." | v22 |
| R6 | §4.8 Day view | "**Now line.** A vertical indicator showing the current time, with a label on hover." | "…with a label on hover **over the grid**." | v22 |
| R7 | §4.10 Events | "Create via a **right-click context menu on any cell, or by clicking empty grid space in day view**." | "Create via **left-click on empty grid space, which opens a menu with 'Create event' and 'New work order'..**" | v22 |
| R8 | §7 Interactions | "**Right-click context menu** on any grid cell: **New Shift, New Event, View Day**." | "**Left-click on empty grid space** opens a menu with: **Create event, New work order**." | v22 |

**Additive-only upstream changes** (nothing removed, listed here for completeness): §4.2
Hours settings block *(v19)*; §4.11 "Events are not conflict-checked for now" *(v19)*; §4.12
"Event time is included in the utilization total…" + "(shifts plus events)" *(v19)*; §11 Dark
theme *(v19)*; header `Design` second link *(v20)*; header `Epic` row *(v21)*.

**Two source typos are reproduced verbatim on purpose** — "not skipped in V1.." (§4.5, double
full stop) and "'New work order'.." (§4.10). Do NOT silently "fix" them in case wording; they
are the spec's own text.

---

## APPENDIX — Branko's answers folded into this doc (2026-07-31)

All six are marked inline as **`[PO 2026-07-31]`** notes. Verbatim source of record:
`build/schedule/branko-answers-2026-07-31/answers-ingested.md`.

| Topic | Branko's ruling | Where folded in | Effect on our cases |
|---|---|---|---|
| Events consume capacity | **Yes** — "A 2-hour meeting consumes 2 hours of capacity"; counts toward capacity but **not** conflict-checked | §4.12 | **Reverses** his earlier "No" — newest-wins; capacity cases updated |
| Shift-modal 'Reassign' button | **No button** — dragging only | §4.9 | Confirms our cases; **Jira SV-8695 is now stale** |
| Printable / exportable week view | **Not in V1, not even in future considerations** | §15 | SCH-EXP-01 (C38853) **RETIRED + DELETED 2026-07-31**, user-authorized; active tally 165 → **164** |
| Cell menu | **Left-click only** (no right-click); menu = **Create event**, **New work order** | §4.10, §7 | Confirms our cases |
| Default working day | **7:00 AM – 7:00 PM** | §4.2 | Confirms our cases; design prototype's 8–5 is the outlier |
| VIN on hover | **Always visible, regardless of the toggle** | §9, §4.13 | Confirms our cases; closes OQ-6 |

**Not answered / re-routed:** backend-coverage scope and own-data write scoping — Branko: "I'm
not sure if this question is for me Bilal." Both go to **engineering / the QA lead**, not back
to the PO.
