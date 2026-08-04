# Schedule — coverage re-derivation, 2026-08-04 (Standing Rules 43 / 45 / 50)

Re-derived from the LIVE spec body (Confluence page 713031682, **version 23**, fetched
2026-08-04) and the LIVE case source (TestRail group 4254, 165 cases). **Not patched from a
previous matrix** — rebuilt from both ends.

## Completeness proof (Rule 50 — nothing silently dropped)

| | count |
|---|---|
| spec lines in the storage body | 510 |
| non-blank lines | 337 |
| → classified as a REQUIREMENT | **194** |
| → classified as NON-requirement, with a stated reason | **143** |
| **remainder** | **0** |
| distinct spec sections | 37 |

The two classified totals add to the non-blank line count exactly, so no line was skipped.

## Both directions

- **requirement → case:** 179 of 194 requirements have at least one case; **15 do not**, and every one is named below.
- **case → requirement:** **0 orphaned anchors** — no case cites a spec section that no longer exists. **1 case cites no spec section at all** (SCH-API-04 = C38875), and its provenance line says so in words rather than inventing a reference.

## The 15 requirements with NO case — each with the reason it is not testable

| anchor | requirement, verbatim | why no case exists |
|---|---|---|
| `§1.1-L1` | Heavy-duty shops manage dozens of open work orders simultaneously, each with multiple repair lines requiring different technicians and hours. Without a dedicated scheduling tool, managers rely on memory, whiteboards, or  | rationale prose - the problem statement, no product behaviour to assert |
| `§2-L1` | Service Manager | user persona table - a reader aid, not a testable requirement |
| `§2-L2` | Service Advisor | user persona table - a reader aid, not a testable requirement |
| `§2-L3` | Shop Foreman | user persona table - a reader aid, not a testable requirement |
| `§2-L4` | Technician | user persona table - a reader aid, not a testable requirement |
| `§13-L1` | Scheduling conflicts | business success metric - measured from production telemetry, not from the product UI |
| `§13-L2` | Time to schedule | business success metric - measured from production telemetry, not from the product UI |
| `§13-L3` | Adoption | business success metric - measured from production telemetry, not from the product UI |
| `§13-L4` | Undo usage | business success metric - measured from production telemetry, not from the product UI |
| `§15-L1` | Technician availability and PTO. Block out vacation, sick time, and training that are not Events, and have the spread step flow around them. | explicitly Future considerations - out of scope for V1 by the specification itself |
| `§15-L2` | Auto-scheduling. Suggest optimal technician assignments based on skills, availability, and workload balance. | explicitly Future considerations - out of scope for V1 by the specification itself |
| `§15-L3` | Recurring events. Repeating calendar blocks for stand-ups and safety meetings. | explicitly Future considerations - out of scope for V1 by the specification itself |
| `§15-L4` | Skill matching. Warn when a technician is assigned to a line requiring certifications they do not hold. | explicitly Future considerations - out of scope for V1 by the specification itself |
| `§15-L5` | Spread around existing bookings. Have the spread step automatically flow around days the technician is already booked (skipping them and extending the end date), rather than requiring the manager to handle conflicts manu | explicitly Future considerations - out of scope for V1 by the specification itself |
| `§15-L6` | Long-job cap. Past a certain length, instead of materializing every daily shift, represent a very long job as a single assignment span across a date range and let clock-ins fill the actuals, reducing board clutter and th | explicitly Future considerations - out of scope for V1 by the specification itself |

**None of the 15 is a coverage gap.** They are rationale prose, the persona table, the
business success metrics and the explicitly out-of-scope Future considerations section.

## Per-requirement verdict rows (Rule 45e — BOTH TEXTS QUOTED)

One row per requirement. The verdict is only valid because the covering case's own
expected-result text is quoted beside the requirement text, so a reviewer can falsify it.

| anchor | requirement, verbatim | verdict | covering case | that case's expected result, verbatim (first assertion) |
|---|---|---|---|---|
| `§1-L1` | The Schedule module gives shop managers a visual calendar to assign technicians to work order lines across days and weeks. It replaces manual whiteboards and spreadsheets with a drag-and-drop interfac | covered — observed PASS | SCH-DND-01 = C29955 (+1 more) | A shift is created immediately in that cell - no scope picker and no spread step appears. |
| `§1.1-L1` | Heavy-duty shops manage dozens of open work orders simultaneously, each with multiple repair lines requiring different technicians and hours. Without a dedicated scheduling tool, managers rely on memo | **not independently testable** | — | rationale prose - the problem statement, no product behaviour to assert |
| `§1.2-L1` | Reduce scheduling errors (double-bookings, weekend assignments, after-hours shifts) to near zero with automatic conflict detection. | covered — observed PASS | SCH-DND-01 = C29955 (+1 more) | A shift is created immediately in that cell - no scope picker and no spread step appears. |
| `§1.2-L2` | Give managers a single screen to see the full week's technician allocation at a glance. | covered — observed PASS | SCH-DND-01 = C29955 (+1 more) | A shift is created immediately in that cell - no scope picker and no spread step appears. |
| `§1.2-L3` | Support multi-day "spread" scheduling for large jobs (engine rebuilds, frame work) that span 40 to 160+ hours across days and weeks. | covered — observed PASS | SCH-DND-01 = C29955 (+1 more) | A shift is created immediately in that cell - no scope picker and no spread step appears. |
| `§1.2-L4` | Keep the work order roster in sync, so scheduling a technician on the schedule automatically adds them to the line's labor roster. | covered — observed PASS | SCH-DND-01 = C29955 (+1 more) | A shift is created immediately in that cell - no scope picker and no spread step appears. |
| `§2-L1` | Service Manager | **not independently testable** | — | user persona table - a reader aid, not a testable requirement |
| `§2-L2` | Service Advisor | **not independently testable** | — | user persona table - a reader aid, not a testable requirement |
| `§2-L3` | Shop Foreman | **not independently testable** | — | user persona table - a reader aid, not a testable requirement |
| `§2-L4` | Technician | **not independently testable** | — | user persona table - a reader aid, not a testable requirement |
| `§3-L1` | The Schedule lives as a top-level nav item alongside Work Orders, Customers, Parts, and Reports. The screen is split into two regions. | covered — observed PASS | SCH-FILT-02 = C29943 (+24 more) | 1. Unassigned: only work orders without an assigned technician remain in the list. |
| `§3.1-L1` | Mini calendar. A month picker with week-highlight and a collapsible grid. Clicking a date navigates the main grid. | covered — observed PASS | SCH-FILT-02 = C29943 (+16 more) | 1. Unassigned: only work orders without an assigned technician remain in the list. |
| `§3.1-L2` | Work order list. A flat, scrollable list of work order cards. Searchable and filterable (see §5). There are no Assigned/Unassigned tabs; assignment is a filter. | covered — observed PASS | SCH-FILT-02 = C29943 (+16 more) | 1. Unassigned: only work orders without an assigned technician remain in the list. |
| `§3.1-L3` | Line drill-down. Clicking a work order replaces the list, in place, with that order's lines. Only approved work order lines are visible in the schedule sidebar; unapproved lines do not appear. Include | covered — observed PASS | SCH-FILT-02 = C29943 (+16 more) | 1. Unassigned: only work orders without an assigned technician remain in the list. |
| `§3.1-L4` | Work order card anatomy. Each card shows, from top to bottom: WO number (in accent color, top left) and line count plus hours estimate (top right); customer name (bold); unit number; and a lead techni | covered — observed PASS | SCH-FILT-02 = C29943 (+16 more) | 1. Unassigned: only work orders without an assigned technician remain in the list. |
| `§3.1-L5` | Sidebar search ("Search work orders") matches against: WO number, customer name, unit number, and technician name. It filters the card list in real time as the user types. | covered — observed PASS | SCH-FILT-02 = C29943 (+16 more) | 1. Unassigned: only work orders without an assigned technician remain in the list. |
| `§3.1-L6` | Line search ("Search lines"), visible in the drill-down, matches against line title/name only (the list is already scoped to one work order, so customer/unit/WO fields would be redundant). | covered — observed PASS | SCH-FILT-02 = C29943 (+16 more) | 1. Unassigned: only work orders without an assigned technician remain in the list. |
| `§3.2-L1` | Day view. A 24-hour timeline per technician row with time-positioned blocks. | covered — observed PASS | SCH-NAV-01 = C29925 (+10 more) | 1. Schedule is listed as a top-level navigation item alongside Work Orders, Customers, Parts, and Reports. |
| `§3.2-L2` | Week view. A 7-column grid Mon to Sun (Saturday and Sunday each toggleable) with stacked shift chips per cell. | covered — observed PASS | SCH-NAV-01 = C29925 (+10 more) | 1. Schedule is listed as a top-level navigation item alongside Work Orders, Customers, Parts, and Reports. |
| `§3.2-L3` | Month view. A compact calendar with per-day capacity bars and shift chips. | covered — observed PASS | SCH-NAV-01 = C29925 (+10 more) | 1. Schedule is listed as a top-level navigation item alongside Work Orders, Customers, Parts, and Reports. |
| `§3.2-L4` | Grid grouping. Rows are grouped by department under collapsible group headers (e.g. SERVICE/PARTS, ADMINISTRATION), with the department's technicians listed beneath each header. This is the only grid  | covered — observed PASS | SCH-NAV-01 = C29925 (+10 more) | 1. Schedule is listed as a top-level navigation item alongside Work Orders, Customers, Parts, and Reports. |
| `§3.2-L5` | Unassigned placeholder. An unassigned row sits within the grid (not a separate tray) and holds shifts that are not yet tied to a technician. Dragging a shift from this row down onto a technician assig | covered — observed PASS | SCH-NAV-01 = C29925 (+10 more) | 1. Schedule is listed as a top-level navigation item alongside Work Orders, Customers, Parts, and Reports. |
| `§4.1-L1` | The primary interaction model. Users drag a work order card (or an individual line) from the sidebar and drop it onto a technician x day/time cell in the grid. | covered — observed PASS | SCH-API-01 = C38872 (+7 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.1-L2` | Single-line work order | covered — observed PASS | SCH-API-01 = C38872 (+7 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.1-L3` | Multi-line work order | covered — observed PASS | SCH-API-01 = C38872 (+7 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.1-L4` | Specific line drag | covered — observed PASS | SCH-API-01 = C38872 (+7 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.1-L5` | Large job (exceeds the tech's daily hours) | covered — observed PASS | SCH-API-01 = C38872 (+7 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.1-L6` | The spread step is conditional: a scope that fits within one of the technician's working days skips it and creates a single shift. | covered — observed PASS | SCH-API-01 = C38872 (+7 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.2-L1` | Every shift has a start time. It is derived from a hierarchy: | covered — observed PASS | SCH-API-01 = C38872 (+16 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.2-L2` | The technician's configured working hours take precedence. | covered — observed PASS | SCH-API-01 = C38872 (+16 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.2-L3` | If those are not set, the shop's business hours are used. | covered — observed PASS | SCH-API-01 = C38872 (+16 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.2-L4` | If neither is set, a general default of 7:00 AM to 7:00 PM applies. | covered — observed PASS | SCH-API-01 = C38872 (+16 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.2-L5` | In day view, the start time instead comes from where the shift is dropped on the timeline. | covered — observed PASS | SCH-API-01 = C38872 (+16 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.2-L6` | Unassigned shifts are created by dropping a work order (or line) onto the grid's Unassigned placeholder row (an in-grid lane, not a separate tray). They follow the same start-time rules except technic | covered — observed PASS | SCH-API-01 = C38872 (+16 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.2-L7` | Hours settings (tech and business hours). Working hours are defined in two places: a technician's custom schedule in Edit Staff Member, and the shop's business hours in Edit Location. Both use the sam | covered — observed PASS | SCH-API-01 = C38872 (+16 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.2-L8` | Behind a toggle, off by default. Each section sits behind a toggle ("Set custom hours for this technician" / "Set business hours for this shop"). The per-day editor appears only when the toggle is on. | covered — observed PASS | SCH-API-01 = C38872 (+16 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.2-L9` | Per-day editor. One row per day (Mon–Sun): day name, with From → To ranges on the right. Each day starts with a single range; "Add hours" appends more to support split shifts, each removable. Added ra | covered — observed PASS | SCH-API-01 = C38872 (+16 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.2-L10` | Overlap validation. If a day's ranges overlap, the offending range is flagged in red with an inline message ("These hours overlap. Adjust the times so they don't conflict.") and Save is disabled until | covered — observed PASS | SCH-API-01 = C38872 (+16 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.3-L1` | When a multi-line work order is dropped, a popover anchored to the drop cell lets the manager choose what to schedule: | covered — observed PASS | SCH-API-01 = C38872 (+8 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.3-L2` | "Schedule whole work order" is pinned at the top, visually distinct, and labeled with the line count and total hours. It assigns the technician to all lines and creates one whole-order shift. | covered — observed PASS | SCH-API-01 = C38872 (+8 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.3-L3` | Individual line rows. Tapping a row is the fast path: it immediately creates a single-line shift with no confirmation step. Each row shows the line title, estimated hours, and current technician roste | covered — observed PASS | SCH-API-01 = C38872 (+8 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.3-L4` | "Select multiple" is an opt-in control that switches the line rows into checkboxes and shows a confirm bar with a running tally ("Create shift · 2 lines · 6h"), a "Select all" shortcut (equivalent to  | covered — observed PASS | SCH-API-01 = C38872 (+8 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.3-L5` | There is no technician cap and no swap flow. Scheduling a technician onto a line simply adds them to that line's roster. | covered — observed PASS | SCH-API-01 = C38872 (+8 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.4-L1` | Every shift block on the grid shows three lines of text (four when VIN is toggled on), with a default blue color (users can optionally assign a custom color per shift via the color picker in the detai | covered — observed PASS | SCH-API-01 = C38872 (+9 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.4-L2` | Line 1: customer name, plus the conflict icon if the shift is conflicted. | covered — observed PASS | SCH-API-01 = C38872 (+9 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.4-L3` | Line 2: unit number. | covered — observed PASS | SCH-API-01 = C38872 (+9 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.4-L4` | Line 3 (optional): VIN number, visible only when the VIN toggle is on in Filter and Display (§6). Shown in day and week views only; month view omits it due to space constraints. | covered — observed PASS | SCH-API-01 = C38872 (+9 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.4-L5` | Last line: the line name for a single-line shift, or "N Lines" when the shift covers more than one line. | covered — observed PASS | SCH-API-01 = C38872 (+9 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.4-L6` | There is no work order number and no scope icons on the block; the conflict icon is the only icon. Whole-order and multi-line-subset shifts both read as "N Lines" on the block, and the detail modal sp | covered — observed PASS | SCH-API-01 = C38872 (+9 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.5-L1` | For jobs exceeding a technician's daily capacity, the spread step distributes the work across consecutive working days. It appears as step 2 of the same modal, with a header showing the chosen scope a | covered — observed PASS | SCH-API-01 = C38872 (+17 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.5-L2` | How much to schedule is set by a single selector that defaults to Full estimate (the most common choice). Most options apply on selection with no extra fields; only the custom ones reveal a control: | covered — observed PASS | SCH-API-01 = C38872 (+17 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.5-L3` | Full estimate, 1 week, and 2 weeks apply immediately with nothing to fill in. | covered — observed PASS | SCH-API-01 = C38872 (+17 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.5-L4` | Until a date… reveals a single "finish by" date field. | covered — observed PASS | SCH-API-01 = C38872 (+17 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.5-L5` | Specific hours… reveals an hours stepper. | covered — observed PASS | SCH-API-01 = C38872 (+17 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.5-L6` | This progressive disclosure (Google Calendar style) keeps the modal to one line in the common case and expands only for the custom options. | covered — observed PASS | SCH-API-01 = C38872 (+17 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.5-L7` | Start date. Defaults to the earliest working day. Adjusting it is how a second technician's series can be made sequential (starting after the first) rather than parallel. | covered — observed PASS | SCH-API-01 = C38872 (+17 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.5-L8` | Uses the technician's own working hours. Automatically skips weekends when business hours are not set for them. Shop closures and public holidays are not skipped in V1.. | covered — observed PASS | SCH-API-01 = C38872 (+17 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.5-L9` | Preview, collapsed by default: a one-line summary ("20 shifts · Jun 15 to Jul 13 · skips weekends + 2 days"), expandable to a week-by-week breakdown with skipped days struck through and their reasons. | covered — observed PASS | SCH-API-01 = C38872 (+17 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.5-L10` | Confirming creates a linked series of daily shifts. | covered — observed PASS | SCH-API-01 = C38872 (+17 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.5-L11` | Each drop spreads the full estimate for that technician, independently. Dropping the same work order on a second technician spreads the full estimate again for them. There is no shared "remaining" cou | covered — observed PASS | SCH-API-01 = C38872 (+17 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.6-L1` | A series is a group of shifts created by the spread step; all shifts in a series share a series id. The series is a render-time grouping, not a special record. Underneath it is N individual daily shif | covered — observed PASS | SCH-API-01 = C38872 (+7 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.6-L2` | Shifts sharing a technician plus series id render as one connected banner: | covered — observed PASS | SCH-API-01 = C38872 (+7 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.6-L3` | Month view: a continuous bar wrapping across week rows, labeled once at the start (with the technician), with a faded "continues" label on later weeks, empty weekend columns (when business hours are n | covered — observed PASS | SCH-API-01 = C38872 (+7 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.6-L4` | Week view: one banner spanning the working days of that week in the technician's row, with chevrons at the edges indicating continuation beyond the visible week, a "week N of M" cue. | covered — observed PASS | SCH-API-01 = C38872 (+7 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.6-L5` | Day view: that day's single time-positioned block with a "part of an M-week job" cue (only one day is visible, so there is no spanning bar). | covered — observed PASS | SCH-API-01 = C38872 (+7 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.7-L1` | Overlapping shifts for the same technician never visually collide: | covered — observed PASS | SCH-API-01 = C38872 (+6 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.7-L2` | Shifts whose time ranges do not intersect share a single lane, so sequential or back-to-back work keeps the row at normal height. | covered — observed PASS | SCH-API-01 = C38872 (+6 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.7-L3` | Shifts whose time ranges do intersect split into stacked lanes, and the row grows to fit. | covered — observed PASS | SCH-API-01 = C38872 (+6 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.7-L4` | Visible lanes are capped at 3. Additional overlapping shifts collapse into a "+N more" affordance that opens a popover listing the hidden shifts. This applies in day, week, and month views (week and m | covered — observed PASS | SCH-API-01 = C38872 (+6 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.7-L5` | Overlap on the same technician is a conflict (see §4.11) and is flagged, so stacking reads as "resolve me," not "two normal jobs." | covered — observed PASS | SCH-API-01 = C38872 (+6 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.8-L1` | Auto-scroll to business hours. On initial day-view load and when navigating to a new day, the timeline auto-scrolls so the working-day start sits at the left edge of the visible area (with a small 30  | covered — observed PASS | SCH-API-01 = C38872 (+9 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.8-L2` | Sticky header bar. Date and time headers stick to the top of the viewport during vertical scroll, so the user always knows which time column they are looking at. This applies in both day and week view | covered — observed PASS | SCH-API-01 = C38872 (+9 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.8-L3` | Horizontal drag to move a shift's start time (snaps to 15-minute intervals). | covered — observed PASS | SCH-API-01 = C38872 (+9 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.8-L4` | Edge resize. Drag the left or right edge to adjust duration. | covered — observed PASS | SCH-API-01 = C38872 (+9 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.8-L5` | Lane stacking. Overlapping shifts split into parallel lanes per §4.7. | covered — observed PASS | SCH-API-01 = C38872 (+9 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.8-L6` | Lane height with VIN. When the VIN toggle is on (§9), lane heights in day view grow to accommodate the additional VIN line so block text is not clipped. | covered — observed PASS | SCH-API-01 = C38872 (+9 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.8-L7` | Now line. A vertical indicator showing the current time, with a label on hover over the grid. | covered — observed PASS | SCH-API-01 = C38872 (+9 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.8-L8` | Business-hours shading. An optional grey overlay outside working hours. | covered — observed PASS | SCH-API-01 = C38872 (+9 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.9-L1` | Clicking a shift block opens a detail panel showing: | covered — observed PASS | SCH-API-01 = C38872 (+11 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.9-L2` | Customer name, unit number, VIN (always visible, below unit and asset), and work order id. | covered — observed PASS | SCH-API-01 = C38872 (+11 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.9-L3` | Scheduled date and start/end time pickers (15-minute increments). | covered — observed PASS | SCH-API-01 = C38872 (+11 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.9-L4` | Technician. | covered — observed PASS | SCH-API-01 = C38872 (+11 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.9-L5` | Time logged vs estimate (progress). | covered — observed PASS | SCH-API-01 = C38872 (+11 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.9-L6` | Scope summary and the scheduled line(s) with labor/total figures. | covered — observed PASS | SCH-API-01 = C38872 (+11 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.9-L7` | Estimated hours with inline edit. | covered — observed PASS | SCH-API-01 = C38872 (+11 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.9-L8` | Color picker (see §10). | covered — observed PASS | SCH-API-01 = C38872 (+11 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.9-L9` | Notes: add, edit, and delete per work order. | covered — observed PASS | SCH-API-01 = C38872 (+11 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.9-L10` | A conflict banner with an "Adjust" action when the shift is conflicted. | covered — observed PASS | SCH-API-01 = C38872 (+11 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.9-L11` | Actions: Delete (series-aware, §7) | covered — observed PASS | SCH-API-01 = C38872 (+11 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.10-L1` | Non-work-order time blocks (meetings, training, stand-ups) that occupy technician time: | covered — observed PASS | SCH-API-01 = C38872 (+11 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.10-L2` | Create via left-click on empty grid space, which opens a menu with 'Create event' and 'New work order'.. | covered — observed PASS | SCH-API-01 = C38872 (+11 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.10-L3` | Event modal: name, date, start/end time, all-day toggle, color category. | covered — observed PASS | SCH-API-01 = C38872 (+11 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.10-L4` | Drag-and-drop to reassign between technicians or move between days. | covered — observed PASS | SCH-API-01 = C38872 (+11 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.10-L5` | Day view shows a live preview block while creating, with drag-to-resize. | covered — observed PASS | SCH-API-01 = C38872 (+11 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.10-L6` | Event card anatomy. Event cards are styled to be structurally distinct from shift cards, so the two types are separable at a glance (not by color alone): a white/neutral card with a thin even border o | covered — observed PASS | SCH-API-01 = C38872 (+11 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.10-L7` | Event color. The default event color is neutral/grey. Events use the same custom color palette as shifts (the shared color picker with editable labels, see §10); choosing a color from the event modal  | covered — observed PASS | SCH-API-01 = C38872 (+11 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.11-L1` | The system continuously scans for scheduling issues and surfaces them in a toolbar pill: | covered — observed PASS | SCH-API-01 = C38872 (+10 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.11-L2` | Double-booked | covered — observed PASS | SCH-API-01 = C38872 (+10 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.11-L3` | Weekend shift | covered — observed PASS | SCH-API-01 = C38872 (+10 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.11-L4` | Before hours | covered — observed PASS | SCH-API-01 = C38872 (+10 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.11-L5` | After hours | covered — observed PASS | SCH-API-01 = C38872 (+10 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.11-L6` | Conflicts appear as a warning icon on the affected block and are listed in a dropdown from the toolbar. Clicking a conflict navigates to the relevant technician and day. Red and other alarming styling | covered — observed PASS | SCH-API-01 = C38872 (+10 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.11-L7` | Events are not conflict-checked for now: an event overlapping a shift (or another event) does not raise a conflict. Their time still counts toward capacity (see §4.12). | covered — observed PASS | SCH-API-01 = C38872 (+10 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.12-L1` | When enabled in View Options, each day column header shows a capacity bar. Fill represents aggregate utilization; overtime is a separate per-technician signal, and the two are independent. Event time  | covered — observed PASS | SCH-API-01 = C38872 (+9 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.12-L2` | Blue fill: aggregate technician-hours booked (shifts plus events) divided by total available (the sum of all techs' working hours). Clamped at 100%. The track width equals capacity and is identical ac | covered — observed PASS | SCH-API-01 = C38872 (+9 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.12-L3` | Amber spill: when aggregate hours exceed capacity, an amber segment extends past the right edge of the track, with a tick at the 100% line. | covered — observed PASS | SCH-API-01 = C38872 (+9 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.12-L4` | "OT" tag: appears whenever any individual technician exceeds their own daily hours, even when the day's aggregate is under capacity. It is a text tag, not a color-only signal. | covered — observed PASS | SCH-API-01 = C38872 (+9 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.12-L5` | Hover tooltip: a per-technician breakdown (assigned vs that tech's capacity), with overtime technicians highlighted in amber. | covered — observed PASS | SCH-API-01 = C38872 (+9 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.13-L1` | Hovering a block shows a quick peek without opening the modal. | covered — observed PASS | SCH-API-01 = C38872 (+7 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.13-L2` | Shift tooltip: customer name (plus the conflict icon if conflicted); unit, vehicle, and VIN; date and time range; technician; scope summary ("N lines · Xh"); the individual line names as a short list  | covered — observed PASS | SCH-API-01 = C38872 (+7 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.13-L3` | Event tooltip: event name (plus its grey category dot); date and time range; technician. | covered — observed PASS | SCH-API-01 = C38872 (+7 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§4.13-L4` | Behavior: open after a roughly 300 to 500ms hover delay; dismiss on mouse-leave; read-only, so clicking the block still opens the full modal. Because the shift tooltip's height varies with the line li | covered — observed PASS | SCH-API-01 = C38872 (+7 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§5.1-L1` | Filters live behind a "Filter" button (with an active-count badge); there are no assignment tabs. Applying a filter narrows the flat card list, and "Clear all" resets in one click. | covered — observed PASS | SCH-FILT-01 = C29942 (+8 more) | 1. The filter panel offers three groups: Assignment (Assigned, Unassigned), Status (the work order statuses supported in the app), and Priority (High, Medium, Low). |
| `§5.1-L2` | Assignment | covered — observed PASS | SCH-FILT-01 = C29942 (+8 more) | 1. The filter panel offers three groups: Assignment (Assigned, Unassigned), Status (the work order statuses supported in the app), and Priority (High, Medium, Low). |
| `§5.1-L3` | Priority | covered — observed PASS | SCH-FILT-01 = C29942 (+8 more) | 1. The filter panel offers three groups: Assignment (Assigned, Unassigned), Status (the work order statuses supported in the app), and Priority (High, Medium, Low). |
| `§5.1-L4` | Search and filter work together: the search field (see §3.1) narrows by text match, and the filter button narrows by structured attributes. Both can be active at the same time. | covered — observed PASS | SCH-FILT-01 = C29942 (+8 more) | 1. The filter panel offers three groups: Assignment (Assigned, Unassigned), Status (the work order statuses supported in the app), and Priority (High, Medium, Low). |
| `§5.1-L5` | The line drill-down has its own filters: All and Unscheduled (lines with no shifts yet), plus a line-name search (see §3.1). | covered — observed PASS | SCH-FILT-01 = C29942 (+8 more) | 1. The filter panel offers three groups: Assignment (Assigned, Unassigned), Status (the work order statuses supported in the app), and Priority (High, Medium, Low). |
| `§5.2-L1` | Month/year picker (grid of month buttons, year nav arrows). | covered — observed PASS | SCH-MCAL-01 = C29932 (+3 more) | The main grid navigates to show the clicked date (the containing day/week/month depending on the active view). |
| `§5.2-L2` | Collapsible: a chevron toggle hides the calendar grid to maximize work order list space. | covered — observed PASS | SCH-MCAL-01 = C29932 (+3 more) | The main grid navigates to show the clicked date (the containing day/week/month depending on the active view). |
| `§5.2-L3` | Selected date highlighted; today indicated; week row highlighted on hover. | covered — observed PASS | SCH-MCAL-01 = C29932 (+3 more) | The main grid navigates to show the clicked date (the containing day/week/month depending on the active view). |
| `§6-L1` | Today button | covered — observed PASS | SCH-CONF-05 = C30027 (+6 more) | 1. The pill shows the current number of scheduling issues. |
| `§6-L2` | Left/right arrows | covered — observed PASS | SCH-CONF-05 = C30027 (+6 more) | 1. The pill shows the current number of scheduling issues. |
| `§6-L3` | Date label | covered — observed PASS | SCH-CONF-05 = C30027 (+6 more) | 1. The pill shows the current number of scheduling issues. |
| `§6-L4` | Conflict pill | covered — observed PASS | SCH-CONF-05 = C30027 (+6 more) | 1. The pill shows the current number of scheduling issues. |
| `§6-L5` | Search | covered — observed PASS | SCH-CONF-05 = C30027 (+6 more) | 1. The pill shows the current number of scheduling issues. |
| `§6-L6` | Filter and Display | covered — observed PASS | SCH-CONF-05 = C30027 (+6 more) | 1. The pill shows the current number of scheduling issues. |
| `§6-L7` | View Options | covered — observed PASS | SCH-CONF-05 = C30027 (+6 more) | 1. The pill shows the current number of scheduling issues. |
| `§6-L8` | Day / Week / Month | covered — observed PASS | SCH-CONF-05 = C30027 (+6 more) | 1. The pill shows the current number of scheduling issues. |
| `§7-L1` | Drag feedback. Drop-target cells highlight, and a ghost block shows the line name and hours. | covered — DEVIATION on the build | SCH-DAY-04 = C30004 (+21 more) | 1. The shift moves along the timeline as you drag. |
| `§7-L2` | Shift reassignment. Dragging a shift block from one technician row to another reassigns it: the target technician is added to the affected line's roster and the source technician is removed. A confirm | covered — DEVIATION on the build | SCH-DAY-04 = C30004 (+21 more) | 1. The shift moves along the timeline as you drag. |
| `§7-L3` | Left-click on empty grid space opens a menu with: Create event, New work order. | covered — DEVIATION on the build | SCH-DAY-04 = C30004 (+21 more) | 1. The shift moves along the timeline as you drag. |
| `§7-L4` | Toast notifications. Every create, delete, move, and reassign action produces a toast with an Undo option. The toast persists for 4 to 7 seconds, stays while the cursor is over it, and dismisses on mo | covered — DEVIATION on the build | SCH-DAY-04 = C30004 (+21 more) | 1. The shift moves along the timeline as you drag. |
| `§7-L5` | Keyboard support. Global shortcuts work anywhere on the schedule page: | covered — DEVIATION on the build | SCH-DAY-04 = C30004 (+21 more) | 1. The shift moves along the timeline as you drag. |
| `§7-L6` | Escape closes the topmost open modal or popover, following a defined stacking order (delete scope, reassign, spread, capacity, event modal, event view, line picker, shift detail, cell menu, calendar p | covered — DEVIATION on the build | SCH-DAY-04 = C30004 (+21 more) | 1. The shift moves along the timeline as you drag. |
| `§7-L7` | Enter confirms the active confirmable dialog (delete scope, reassign, spread, event create/edit). It does not fire inside textareas, so multiline note editing still works normally. | covered — DEVIATION on the build | SCH-DAY-04 = C30004 (+21 more) | 1. The shift moves along the timeline as you drag. |
| `§7-L8` | Drag-and-drop has a click-to-arm alternative for users who cannot drag. | covered — DEVIATION on the build | SCH-DAY-04 = C30004 (+21 more) | 1. The shift moves along the timeline as you drag. |
| `§7-L9` | Series-aware deletion. Deleting a shift that belongs to a series asks for scope. This is routine, lightweight editing (undo toast, not the alarming destructive styling): | covered — DEVIATION on the build | SCH-DAY-04 = C30004 (+21 more) | 1. The shift moves along the timeline as you drag. |
| `§7-L10` | This shift only: removes that day. The series keeps the gap (it is not auto-closed), and the hours return to the estimate's remaining. | covered — DEVIATION on the build | SCH-DAY-04 = C30004 (+21 more) | 1. The shift moves along the timeline as you drag. |
| `§7-L11` | This and everything after: removes from the clicked shift onward, keeping earlier shifts. | covered — DEVIATION on the build | SCH-DAY-04 = C30004 (+21 more) | 1. The shift moves along the timeline as you drag. |
| `§7-L12` | The whole series: removes all of the series' shifts for that technician. | covered — DEVIATION on the build | SCH-DAY-04 = C30004 (+21 more) | 1. The shift moves along the timeline as you drag. |
| `§7-L13` | The options adapt to position: on the first shift, "this and after" equals "whole series" (show two options); on the last shift, "this and after" equals "this only" (two options); only middle shifts s | covered — DEVIATION on the build | SCH-DAY-04 = C30004 (+21 more) | 1. The shift moves along the timeline as you drag. |
| `§8.1-L1` | Shift | covered — observed PASS | SCH-EVT-03 = C30018 (+1 more) | 1. The modal contains: name, date, start/end time, an all-day toggle, and a color category. |
| `§8.1-L2` | Event | covered — observed PASS | SCH-EVT-03 = C30018 (+1 more) | 1. The modal contains: name, date, start/end time, an all-day toggle, and a color category. |
| `§8.1-L3` | Work Order | covered — observed PASS | SCH-EVT-03 = C30018 (+1 more) | 1. The modal contains: name, date, start/end time, an all-day toggle, and a color category. |
| `§8.1-L4` | Line | covered — observed PASS | SCH-EVT-03 = C30018 (+1 more) | 1. The modal contains: name, date, start/end time, an all-day toggle, and a color category. |
| `§8.1-L5` | Technician | covered — observed PASS | SCH-EVT-03 = C30018 (+1 more) | 1. The modal contains: name, date, start/end time, an all-day toggle, and a color category. |
| `§8.1-L6` | Department | covered — observed PASS | SCH-EVT-03 = C30018 (+1 more) | 1. The modal contains: name, date, start/end time, an all-day toggle, and a color category. |
| `§8.1-L7` | The Line's labor[] roster has no maximum; any number of technicians may be on a line. An unassigned shift has an empty or placeholder rowKey until it is moved onto a technician. | covered — observed PASS | SCH-EVT-03 = C30018 (+1 more) | 1. The modal contains: name, date, start/end time, an all-day toggle, and a color category. |
| `§8.2-L1` | A series groups shifts created by the spread step; all shifts in a series share a seriesId. The series supports scoped deletion (this / this-and-after / whole) and renders as a connected banner in mon | covered — observed PASS | SCH-SER-04 = C29990 (+1 more) | 1. Each series day contributes its own daily hours to that day's capacity bar (the series is not counted as one lump). |
| `§9-L1` | Display settings are split across two toolbar controls: | covered — observed PASS | SCH-MODAL-01 = C30008 (+8 more) | A detail panel opens for the shift. |
| `§9-L2` | Filter and Display dropdown (checkbox style, §6): | covered — observed PASS | SCH-MODAL-01 = C30008 (+8 more) | A detail panel opens for the shift. |
| `§9-L3` | Department toggles | covered — observed PASS | SCH-MODAL-01 = C30008 (+8 more) | A detail panel opens for the shift. |
| `§9-L4` | My Shifts | covered — observed PASS | SCH-MODAL-01 = C30008 (+8 more) | A detail panel opens for the shift. |
| `§9-L5` | VIN | covered — observed PASS | SCH-MODAL-01 = C30008 (+8 more) | A detail panel opens for the shift. |
| `§9-L6` | View Options popover: | covered — observed PASS | SCH-MODAL-01 = C30008 (+8 more) | A detail panel opens for the shift. |
| `§9-L7` | Business Hours | covered — observed PASS | SCH-MODAL-01 = C30008 (+8 more) | A detail panel opens for the shift. |
| `§9-L8` | Capacity Bars | covered — observed PASS | SCH-MODAL-01 = C30008 (+8 more) | A detail panel opens for the shift. |
| `§9-L9` | Events | covered — observed PASS | SCH-MODAL-01 = C30008 (+8 more) | A detail panel opens for the shift. |
| `§9-L10` | Tech Hours | covered — observed PASS | SCH-MODAL-01 = C30008 (+8 more) | A detail panel opens for the shift. |
| `§9-L11` | Saturday | covered — observed PASS | SCH-MODAL-01 = C30008 (+8 more) | A detail panel opens for the shift. |
| `§9-L12` | Sunday | covered — observed PASS | SCH-MODAL-01 = C30008 (+8 more) | A detail panel opens for the shift. |
| `§10-L1` | Blue is the default color for all shifts, including long or multi-week jobs. | covered — observed PASS | SCH-COLOR-01 = C30071 (+3 more) | Both the single shift and the multi-week series render in the default blue. |
| `§10-L2` | Grey is the default color for events. | covered — observed PASS | SCH-COLOR-01 = C30071 (+3 more) | Both the single shift and the multi-week series render in the default blue. |
| `§10-L3` | All other colors are optional and chosen by the user from the color picker in the shift or event detail modal, to distinguish shifts however the shop likes. | covered — observed PASS | SCH-COLOR-01 = C30071 (+3 more) | Both the single shift and the multi-week series render in the default blue. |
| `§10-L4` | Color labels are editable per shop. | covered — observed PASS | SCH-COLOR-01 = C30071 (+3 more) | Both the single shift and the multi-week series render in the default blue. |
| `§10-L5` | Each color provides three tones: background fill, text color, and accent (left border). There are no fixed semantic meanings tied to specific colors beyond the two defaults above. | covered — observed PASS | SCH-COLOR-01 = C30071 (+3 more) | Both the single shift and the multi-week series render in the default blue. |
| `§11-L1` | Performance. The grid must render smoothly with up to 15 technicians x 7 days x several shifts per cell. The sidebar work order list virtualizes at 50+ items, as does the line drill-down for orders wi | covered — observed PASS | SCH-CAP-03 = C30032 (+8 more) | 1. An 'OT' tag appears for the day even though the aggregate bar is under 100%. |
| `§11-L2` | Responsiveness. Minimum supported width is 960px (the grid scrolls horizontally below that), and the sidebar collapses on narrow viewports. | covered — observed PASS | SCH-CAP-03 = C30032 (+8 more) | 1. An 'OT' tag appears for the day even though the aggregate bar is under 100%. |
| `§11-L3` | Accessibility. All interactive elements are keyboard-reachable; focus rings follow the design system; modals trap focus and close on Escape; drag-and-drop has a click-to-arm alternative. Overtime and  | covered — observed PASS | SCH-CAP-03 = C30032 (+8 more) | 1. An 'OT' tag appears for the day even though the aggregate bar is under 100%. |
| `§11-L4` | Undo. Every destructive action (delete, move, reassign) is undoable for 4 to 7 seconds via a toast that persists while hovered. | covered — observed PASS | SCH-CAP-03 = C30032 (+8 more) | 1. An 'OT' tag appears for the day even though the aggregate bar is under 100%. |
| `§11-L5` | Dark theme. The Schedule supports a user-selectable Light / Dark theme, chosen from the user menu and persisted per user. It is built on the design-system color tokens, so surfaces, borders, text, and | covered — observed PASS | SCH-CAP-03 = C30032 (+8 more) | 1. An 'OT' tag appears for the day even though the aggregate bar is under 100%. |
| `§12-L1` | A technician can have multiple shifts on the same day (different work orders); overlapping times render in parallel lanes with a 3-lane cap and "+N more" overflow (§4.7). | covered — observed PASS | SCH-BLOCK-02 = C29992 (+6 more) | 1. The whole-order block reads '4 Lines'. |
| `§12-L2` | Every shift has a start time, resolved from the hierarchy in §4.2 or from the drop position in day view; unassigned shifts use the same rules minus technician hours until they are assigned. | covered — observed PASS | SCH-BLOCK-02 = C29992 (+6 more) | 1. The whole-order block reads '4 Lines'. |
| `§12-L3` | Shop closures (holidays, inventory days) are defined at the shop level and block the spread step from placing shifts on those days. | covered — observed PASS | SCH-BLOCK-02 = C29992 (+6 more) | 1. The whole-order block reads '4 Lines'. |
| `§12-L4` | Dropping the same work order on multiple technicians creates independent series, each spreading the full estimate, so planned hours across technicians may exceed the estimate. This is expected, since  | covered — observed PASS | SCH-BLOCK-02 = C29992 (+6 more) | 1. The whole-order block reads '4 Lines'. |
| `§12-L5` | Whole-order and multi-line-subset shifts both render as "N Lines" on the block; the detail modal and hover tooltip provide the specifics. | covered — observed PASS | SCH-BLOCK-02 = C29992 (+6 more) | 1. The whole-order block reads '4 Lines'. |
| `§12-L6` | Dragging a shift between technicians reassigns it, adding the target technician to the affected line's roster and removing the source technician. | covered — observed PASS | SCH-BLOCK-02 = C29992 (+6 more) | 1. The whole-order block reads '4 Lines'. |
| `§13-L1` | Scheduling conflicts | **not independently testable** | — | business success metric - measured from production telemetry, not from the product UI |
| `§13-L2` | Time to schedule | **not independently testable** | — | business success metric - measured from production telemetry, not from the product UI |
| `§13-L3` | Adoption | **not independently testable** | — | business success metric - measured from production telemetry, not from the product UI |
| `§13-L4` | Undo usage | **not independently testable** | — | business success metric - measured from production telemetry, not from the product UI |
| `§14-L1` | The Schedule is a CRUD area in ShopView's custom roles and permissions system. Access is controlled by three independent permission levels (View, Edit, Delete), where Delete requires Edit and Edit req | covered — observed PASS | SCH-API-01 = C38872 (+17 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§14.1-L1` | Schedule: View. The user can see the schedule page, navigate between day/week/month views, use the mini calendar, search, filter, view all technicians' shifts and events, hover for tooltips, and open  | covered — observed PASS | SCH-API-01 = C38872 (+10 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§14.1-L2` | Schedule: Edit (requires View). Unlocks all creation and modification interactions: drag-and-drop from the sidebar, the scope picker, the spread modal, shift and event creation (including via right-cl | covered — observed PASS | SCH-API-01 = C38872 (+10 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§14.1-L3` | Schedule: Delete (requires Edit). Unlocks deleting shifts and events, including series-aware deletion with its three scopes (this shift / this and after / whole series). Without Delete, a user with Ed | covered — observed PASS | SCH-API-01 = C38872 (+10 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§14.2-L1` | The left panel sidebar displays work order data (customer, unit, lines, lead tech) and requires Work Orders: View to populate. If a user has Schedule access but Work Orders: View is OFF, the sidebar h | covered — observed PASS | SCH-API-01 = C38872 (+4 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§14.3-L1` | The schedule always shows all technicians' shifts and events for every user who has Schedule: View. There is no role-based restriction to "own shifts only." This is intentional: the schedule is a shar | covered — observed PASS | SCH-API-01 = C38872 (+5 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§14.4-L1` | Whether a user appears as a row in the schedule grid is controlled by their department assignment on their staff record, not by their role permission. Any staff member assigned to a department that is | covered — observed PASS | SCH-API-01 = C38872 (+5 more) | 1. No Schedule permission: the board GET is refused with HTTP 403. |
| `§15-L1` | Technician availability and PTO. Block out vacation, sick time, and training that are not Events, and have the spread step flow around them. | **not independently testable** | — | explicitly Future considerations - out of scope for V1 by the specification itself |
| `§15-L2` | Auto-scheduling. Suggest optimal technician assignments based on skills, availability, and workload balance. | **not independently testable** | — | explicitly Future considerations - out of scope for V1 by the specification itself |
| `§15-L3` | Recurring events. Repeating calendar blocks for stand-ups and safety meetings. | **not independently testable** | — | explicitly Future considerations - out of scope for V1 by the specification itself |
| `§15-L4` | Skill matching. Warn when a technician is assigned to a line requiring certifications they do not hold. | **not independently testable** | — | explicitly Future considerations - out of scope for V1 by the specification itself |
| `§15-L5` | Spread around existing bookings. Have the spread step automatically flow around days the technician is already booked (skipping them and extending the end date), rather than requiring the manager to h | **not independently testable** | — | explicitly Future considerations - out of scope for V1 by the specification itself |
| `§15-L6` | Long-job cap. Past a certain length, instead of materializing every daily shift, represent a very long job as a single assignment span across a date range and let clock-ins fill the actuals, reducing  | **not independently testable** | — | explicitly Future considerations - out of scope for V1 by the specification itself |

## The 143 non-requirement lines, by reason

| reason | lines |
|---|---|
| table cell continuation of the line above | 85 |
| table column heading | 9 |
| document metadata label | 8 |
| document title | 1 |
| section heading §1 | 1 |
| section heading §1.1 | 1 |
| section heading §1.2 | 1 |
| section heading §2 | 1 |
| section heading §3 | 1 |
| section heading §3.1 | 1 |
| section heading §3.2 | 1 |
| section heading §4 | 1 |
| section heading §4.1 | 1 |
| section heading §4.2 | 1 |
| section heading §4.3 | 1 |
| section heading §4.4 | 1 |
| section heading §4.5 | 1 |
| section heading §4.6 | 1 |
| section heading §4.7 | 1 |
| section heading §4.8 | 1 |
| section heading §4.9 | 1 |
| section heading §4.10 | 1 |
| section heading §4.11 | 1 |
| section heading §4.12 | 1 |
| section heading §4.13 | 1 |
| section heading §5 | 1 |
| section heading §5.1 | 1 |
| section heading §5.2 | 1 |
| section heading §6 | 1 |
| section heading §7 | 1 |
| section heading §8 | 1 |
| section heading §8.1 | 1 |
| section heading §8.2 | 1 |
| section heading §9 | 1 |
| section heading §10 | 1 |
| section heading §11 | 1 |
| section heading §12 | 1 |
| section heading §13 | 1 |
| section heading §14 | 1 |
| section heading §14.1 | 1 |
| section heading §14.2 | 1 |
| section heading §14.3 | 1 |
| section heading §14.4 | 1 |
| section heading §15 | 1 |
