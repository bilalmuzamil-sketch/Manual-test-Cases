## APPENDIX A — the full 243-statement matrix (every statement, every verdict)

Verdicts: **COVERED** · **COVERED-FLAGGED** (covered, but the spec text conflicts with a
higher-precedence ruling — see §6) · **GAP** · **NOT-TESTABLE** (with the reason).

### §1 — 2 statements (NOT-TESTABLE 2)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-1-01 | PROSE | The Schedule module gives shop managers a visual calendar to assign technicians to work order lines across days and weeks. | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |
| R-1-02 | PROSE | It replaces manual whiteboards and spreadsheets with a drag-and-drop interface that respects technician capacity, surfaces conflicts, and keeps the work order system of record in sync. | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |

- **R-1-01** — States intent or a post-launch metric, not a behaviour a manual tester can observe.
- **R-1-02** — States intent or a post-launch metric, not a behaviour a manual tester can observe.

### §1.1 — 2 statements (NOT-TESTABLE 2)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-1.1-01 | PROSE | Heavy-duty shops manage dozens of open work orders simultaneously, each with multiple repair lines requiring different technicians and hours. | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |
| R-1.1-02 | PROSE | Without a dedicated scheduling tool, managers rely on memory, whiteboards, or ad-hoc spreadsheets, which leads to double-bookings, overtime surprises, and unbalanced workloads across the team. | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |

- **R-1.1-01** — States intent or a post-launch metric, not a behaviour a manual tester can observe.
- **R-1.1-02** — States intent or a post-launch metric, not a behaviour a manual tester can observe.

### §1.2 — 4 statements (COVERED 1, NOT-TESTABLE 3)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-1.2-01 | BULLET | Reduce scheduling errors (double-bookings, weekend assignments, after-hours shifts) to near zero with automatic conflict detection. | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |
| R-1.2-02 | BULLET | Give managers a single screen to see the full week's technician allocation at a glance. | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |
| R-1.2-03 | BULLET | Support multi-day "spread" scheduling for large jobs (engine rebuilds, frame work) that span 40 to 160+ hours across days and weeks. | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |
| R-1.2-04 | BULLET | Keep the work order roster in sync, so scheduling a technician on the schedule automatically adds them to the line's labor roster. | COVERED | SCH-DND-07 |

- **R-1.2-01** — States intent or a post-launch metric, not a behaviour a manual tester can observe.
- **R-1.2-02** — States intent or a post-launch metric, not a behaviour a manual tester can observe.
- **R-1.2-03** — States intent or a post-launch metric, not a behaviour a manual tester can observe.

### §2 — 4 statements (NOT-TESTABLE 4)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-2-01 | TABLEROW | Service Manager — Owns the daily schedule for 5 to 15 techs — Drag-and-drop scheduling, capacity visibility, conflict alerts | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |
| R-2-02 | TABLEROW | Service Advisor — Creates work orders, communicates ETAs to customers — See when their work orders are scheduled, which techs are assigned | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |
| R-2-03 | TABLEROW | Shop Foreman — Oversees floor execution — Day view of who's doing what, department filtering | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |
| R-2-04 | TABLEROW | Technician — Performs the repair work on assigned lines — A clear view of their own assigned shifts and what to work on next, plus their hours | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |

- **R-2-01** — States intent or a post-launch metric, not a behaviour a manual tester can observe.
- **R-2-02** — States intent or a post-launch metric, not a behaviour a manual tester can observe.
- **R-2-03** — States intent or a post-launch metric, not a behaviour a manual tester can observe.
- **R-2-04** — States intent or a post-launch metric, not a behaviour a manual tester can observe.

### §3 — 2 statements (COVERED 2)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-3-01 | PROSE | The Schedule lives as a top-level nav item alongside Work Orders, Customers, Parts, and Reports. | COVERED | SCH-NAV-01 |
| R-3-02 | PROSE | The screen is split into two regions. | COVERED | SCH-NAV-01 |

### §3.1 — 10 statements (COVERED 10)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-3.1-01 | BULLET | Mini calendar. A month picker with week-highlight and a collapsible grid. Clicking a date navigates the main grid. | COVERED | SCH-MCAL-01 |
| R-3.1-02 | BULLET | Work order list. A flat, scrollable list of work order cards. Searchable and filterable (see §5). There are no Assigned/Unassigned tabs; assignment is a filter. | COVERED | SCH-WOL-01, SCH-FILT-02 |
| R-3.1-03 | BULLET | Line drill-down. Clicking a work order replaces the list, in place, with that order's lines. Only approved work order lines are visible in the schedule sidebar; unapproved lines do not appear. Includes a back control, the WO id plus line count, a line search box, and "All / Unscheduled" filter ch… | COVERED | SCH-LINE-01, SCH-LINE-03, SCH-LINE-04, SCH-LINE-05, SCH-LINE-06, SCH-LINE-07 |
| R-3.1-04 | PROSE | Work order card anatomy. | COVERED | SCH-LINE-01, SCH-WOL-01, SCH-WOL-02, SCH-WOL-04, SCH-WOL-05, SCH-FILT-02, SCH-LINE-03, SCH-LINE-04 |
| R-3.1-05 | PROSE | Each card shows, from top to bottom: WO number (in accent color, top left) and line count plus hours estimate (top right); customer name (bold); unit number; and a lead technician row (avatar plus name). | COVERED | SCH-WOL-02, SCH-WOL-04, SCH-LINE-04 |
| R-3.1-06 | PROSE | A colored left border indicates the work order's status. | COVERED | SCH-WOL-02, SCH-NAV-01 |
| R-3.1-07 | PROSE | All of these fields are visible on the card and are matched by the sidebar search. | COVERED | SCH-WOL-04, SCH-LINE-01, SCH-LINE-06, SCH-MCAL-01, SCH-WOL-01, SCH-WOL-02, SCH-WOL-05, SCH-WOL-06 |
| R-3.1-08 | PROSE | Sidebar search ("Search work orders") matches against: WO number, customer name, unit number, and technician name. | COVERED | SCH-WOL-04, SCH-WOL-02, SCH-LINE-06, SCH-WOL-06, SCH-FILT-02, SCH-LINE-01, SCH-LINE-03, SCH-NAV-01 |
| R-3.1-09 | PROSE | It filters the card list in real time as the user types. | COVERED | SCH-WOL-05 |
| R-3.1-10 | PROSE | Line search ("Search lines"), visible in the drill-down, matches against line title/name only (the list is already scoped to one work order, so customer/unit/WO fields would be redundant). | COVERED | SCH-LINE-06, SCH-WOL-04, SCH-WOL-02, SCH-LINE-07, SCH-LINE-01, SCH-LINE-03, SCH-LINE-04 |

### §3.2 — 10 statements (COVERED 10)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-3.2-01 | BULLET | Day view. A 24-hour timeline per technician row with time-positioned blocks. | COVERED | SCH-NAV-03, SCH-NAV-04, SCH-START-05, SCH-START-07 |
| R-3.2-02 | BULLET | Week view. A 7-column grid Mon to Sun (Saturday and Sunday each toggleable) with stacked shift chips per cell. | COVERED | SCH-NAV-03, SCH-VIEW-10, SCH-START-05 |
| R-3.2-03 | BULLET | Month view. A compact calendar with per-day capacity bars and shift chips. | COVERED | SCH-NAV-03 |
| R-3.2-04 | PROSE | Grid grouping. | COVERED | SCH-NAV-06, SCH-NAV-01, SCH-NAV-03, SCH-NAV-04, SCH-NAV-07, SCH-START-05 |
| R-3.2-05 | PROSE | Rows are grouped by department under collapsible group headers (e.g. SERVICE/PARTS, ADMINISTRATION), with the department's technicians listed beneath each header. | COVERED | SCH-NAV-04, SCH-NAV-05 |
| R-3.2-06 | PROSE | This is the only grid grouping; because the department view already lists technicians, there is no separate technician-only view or Tech/Dept toggle. | COVERED | SCH-NAV-06 |
| R-3.2-07 | PROSE | Unassigned placeholder. | COVERED | SCH-NAV-07, SCH-START-05, SCH-START-07 |
| R-3.2-08 | PROSE | An unassigned row sits within the grid (not a separate tray) and holds shifts that are not yet tied to a technician. | COVERED | SCH-NAV-07, SCH-START-05, SCH-START-07 |
| R-3.2-09 | PROSE | Dragging a shift from this row down onto a technician assigns it. | COVERED | SCH-START-07, SCH-NAV-03, SCH-NAV-07, SCH-START-05, SCH-NAV-01, SCH-NAV-04, SCH-NAV-05 |
| R-3.2-10 | PROSE | Unassigned shifts use the same three-line block anatomy as regular shifts (see §4.4); they simply have no technician yet (see §4.2). | COVERED | SCH-START-05, SCH-NAV-07 |

### §4.1 — 7 statements (COVERED 6, NOT-TESTABLE 1)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-4.1-01 | PROSE | The primary interaction model. | NOT-TESTABLE — (b) lead-in fragment | — |
| R-4.1-02 | PROSE | Users drag a work order card (or an individual line) from the sidebar and drop it onto a technician x day/time cell in the grid. | COVERED | SCH-DND-01, SCH-DND-02, SCH-DND-03, SCH-DND-04, SCH-DND-05 |
| R-4.1-03 | TABLEROW | Single-line work order — Creates a shift immediately, skipping the scope picker. | COVERED | SCH-DND-01, SCH-DND-03, SCH-DND-02, SCH-DND-05, SCH-DND-04 |
| R-4.1-04 | TABLEROW | Multi-line work order — Opens the scope picker to choose whole order, a single line, or several lines. | COVERED | SCH-DND-02, SCH-DND-04, SCH-DND-03, SCH-DND-05, SCH-DND-01 |
| R-4.1-05 | TABLEROW | Specific line drag — Dragging a line from the drill-down creates a single-line shift directly. | COVERED | SCH-DND-03, SCH-DND-01, SCH-DND-02, SCH-DND-05 |
| R-4.1-06 | TABLEROW | Large job (exceeds the tech's daily hours) — After scope is chosen, opens the spread step to distribute hours across consecutive working days. | COVERED | SCH-DND-04, SCH-DND-01, SCH-DND-05 |
| R-4.1-07 | PROSE | The spread step is conditional: a scope that fits within one of the technician's working days skips it and creates a single shift. | COVERED | SCH-DND-05, SCH-DND-01, SCH-DND-04, SCH-DND-03 |

- **R-4.1-01** — section lead-in ("The primary interaction model."), no assertion of its own

### §4.2 — 15 statements (COVERED 14, NOT-TESTABLE 1)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-4.2-01 | PROSE | Every shift has a start time. | COVERED | SCH-START-01, SCH-START-02, SCH-START-03, SCH-START-04, SCH-START-06, SCH-CONF-03, SCH-START-05, SCH-START-07 |
| R-4.2-02 | PROSE | It is derived from a hierarchy: | COVERED | SCH-START-01, SCH-START-02, SCH-START-03 |
| R-4.2-03 | BULLET | The technician's configured working hours take precedence. | COVERED | SCH-CONF-03, SCH-START-01, SCH-START-02, SCH-START-03, SCH-START-07, SCH-HRS-03, SCH-HRS-04, SCH-HRS-05 |
| R-4.2-04 | BULLET | If those are not set, the shop's business hours are used. | COVERED | SCH-HRS-02, SCH-HRS-04, SCH-START-01, SCH-START-02, SCH-START-03, SCH-START-06, SCH-CONF-03, SCH-START-07 |
| R-4.2-05 | BULLET | If neither is set, a general default of 7:00 AM to 7:00 PM applies. | COVERED | SCH-START-03, SCH-CONF-03, SCH-HRS-02, SCH-HRS-03, SCH-START-06 |
| R-4.2-06 | PROSE | In day view, the start time instead comes from where the shift is dropped on the timeline. | COVERED | SCH-START-04 |
| R-4.2-07 | PROSE | Unassigned shifts are created by dropping a work order (or line) onto the grid's Unassigned placeholder row (an in-grid lane, not a separate tray). | COVERED | SCH-NAV-07, SCH-START-05, SCH-START-01, SCH-START-02, SCH-START-03, SCH-START-04, SCH-START-06 |
| R-4.2-08 | PROSE | They follow the same start-time rules except technician hours (there is no technician yet), so they fall back to business hours or the default. | COVERED | SCH-HRS-04, SCH-CONF-03, SCH-START-02, SCH-HRS-02, SCH-START-01, SCH-START-03, SCH-START-06, SCH-START-07 |
| R-4.2-09 | PROSE | When an unassigned shift is later dragged onto a technician row in the grid, that technician's hours apply. | COVERED | SCH-NAV-07, SCH-START-05, SCH-START-07, SCH-START-01, SCH-START-02, SCH-START-03, SCH-START-06, SCH-CONF-03 |
| R-4.2-10 | PROSE | Hours settings (tech and business hours). | COVERED | SCH-HRS-04, SCH-CONF-03, SCH-HRS-02, SCH-START-01, SCH-START-03, SCH-HRS-03, SCH-HRS-05, SCH-HRS-06 |
| R-4.2-11 | PROSE | Working hours are defined in two places: a technician's custom schedule in Edit Staff Member, and the shop's business hours in Edit Location. | COVERED | SCH-HRS-02, SCH-CONF-03, SCH-HRS-03, SCH-HRS-04, SCH-START-01, SCH-START-02, SCH-START-03, SCH-START-07 |
| R-4.2-12 | PROSE | Both use the same pattern: | NOT-TESTABLE — (b) lead-in fragment | — |
| R-4.2-13 | BULLET | Behind a toggle, off by default. Each section sits behind a toggle ("Set custom hours for this technician" / "Set business hours for this shop"). The per-day editor appears only when the toggle is on. A technician with no custom hours inherits the shop's business hours (per the hierarchy above). | COVERED | SCH-HRS-02, SCH-HRS-03, SCH-HRS-04, SCH-CONF-03 |
| R-4.2-14 | BULLET | Per-day editor. One row per day (Mon–Sun): day name, with From → To ranges on the right. Each day starts with a single range; "Add hours" appends more to support split shifts, each removable. Added ranges start empty so the user explicitly sets the times. | COVERED | SCH-HRS-05, SCH-HRS-06 |
| R-4.2-15 | BULLET | Overlap validation. If a day's ranges overlap, the offending range is flagged in red with an inline message ("These hours overlap. Adjust the times so they don't conflict.") and Save is disabled until it is resolved. Incomplete rows (empty From/To) are ignored by the check. | COVERED | SCH-HRS-06 |

- **R-4.2-12** — lead-in ("Both use the same pattern:"), the pattern bullets follow

### §4.3 — 6 statements (COVERED 5, GAP 1)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-4.3-01 | PROSE | When a multi-line work order is dropped, a popover anchored to the drop cell lets the manager choose what to schedule: | COVERED | SCH-DND-02, SCH-SCOPE-01, SCH-DND-07, SCH-SCOPE-02, SCH-SCOPE-03 |
| R-4.3-02 | BULLET | "Schedule whole work order" is pinned at the top, visually distinct, and labeled with the line count and total hours. It assigns the technician to all lines and creates one whole-order shift. | COVERED | SCH-SCOPE-01, SCH-SCOPE-05, SCH-SCOPE-02, SCH-DND-02, SCH-DND-07, SCH-SCOPE-03 |
| R-4.3-03 | BULLET | Individual line rows. Tapping a row is the fast path: it immediately creates a single-line shift with no confirmation step. Each row shows the line title, estimated hours, and current technician roster (avatar stack plus count). | COVERED | SCH-SCOPE-01, SCH-SCOPE-03 |
| R-4.3-04 | BULLET | "Select multiple" is an opt-in control that switches the line rows into checkboxes and shows a confirm bar with a running tally ("Create shift · 2 lines · 6h"), a "Select all" shortcut (equivalent to whole order), and Cancel (returns to the fast single-tap list). | COVERED | SCH-SCOPE-05 |
| R-4.3-05 | PROSE | There is no technician cap and no swap flow. | GAP — (a) genuine gap - PARTIAL | — |
| R-4.3-06 | PROSE | Scheduling a technician onto a line simply adds them to that line's roster. | COVERED | SCH-DND-07, SCH-DND-02, SCH-SCOPE-01, SCH-SCOPE-02, SCH-SCOPE-03, SCH-SCOPE-05 |

- **R-4.3-05** — "no technician cap" IS covered (SCH-LINE-04, SCH-SCOPE-01 avatar-stack "no cap"), but "no swap flow" is asserted NOWHERE: no case observes that scheduling a SECOND technician onto a line that already has one ADDS them alongside rather than replacing/prompting to swap. A build that replaced the incumbent would pass every existing case. || CLOSURE: EXTEND SCH-DND-07

### §4.4 — 7 statements (COVERED 7)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-4.4-01 | PROSE | Every shift block on the grid shows three lines of text (four when VIN is toggled on), with a default blue color (users can optionally assign a custom color per shift via the color picker in the detail modal, see §10): | COVERED | SCH-COLOR-02, SCH-VIEW-04, SCH-BLOCK-01, SCH-BLOCK-02, SCH-MODAL-04 |
| R-4.4-02 | BULLET | Line 1: customer name, plus the conflict icon if the shift is conflicted. | COVERED | SCH-BLOCK-01, SCH-BLOCK-05 |
| R-4.4-03 | BULLET | Line 2: unit number. | COVERED | SCH-BLOCK-01, SCH-BLOCK-05, SCH-VIEW-04, SCH-BLOCK-02, SCH-MODAL-04, SCH-SCOPE-02 |
| R-4.4-04 | BULLET | Line 3 (optional): VIN number, visible only when the VIN toggle is on in Filter and Display (§6). Shown in day and week views only; month view omits it due to space constraints. | COVERED | SCH-VIEW-04 |
| R-4.4-05 | BULLET | Last line: the line name for a single-line shift, or "N Lines" when the shift covers more than one line. | COVERED | SCH-BLOCK-01, SCH-BLOCK-02, SCH-SCOPE-02, SCH-MODAL-04, SCH-VIEW-04 |
| R-4.4-06 | PROSE | There is no work order number and no scope icons on the block; the conflict icon is the only icon. | COVERED | SCH-BLOCK-05, SCH-MODAL-04, SCH-BLOCK-01, SCH-SCOPE-02, SCH-BLOCK-02, SCH-COLOR-02 |
| R-4.4-07 | PROSE | Whole-order and multi-line-subset shifts both read as "N Lines" on the block, and the detail modal spells out the exact scope. | COVERED | SCH-BLOCK-02, SCH-MODAL-04, SCH-VIEW-04, SCH-COLOR-02 |

### §4.5 — 11 statements (COVERED 11)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-4.5-01 | PROSE | For jobs exceeding a technician's daily capacity, the spread step distributes the work across consecutive working days. | COVERED | SCH-DND-04, SCH-SPREAD-02, SCH-SPREAD-06, SCH-SPREAD-07, SCH-EDGE-05, SCH-SPREAD-05, SCH-SPREAD-09, SCH-SPREAD-11 |
| R-4.5-02 | PROSE | It appears as step 2 of the same modal, with a header showing the chosen scope and a "Change scope" back-link. | COVERED | SCH-DND-04, SCH-SPREAD-02, SCH-SPREAD-03, SCH-SPREAD-08, SCH-SPREAD-09 |
| R-4.5-03 | BULLET | How much to schedule is set by a single selector that defaults to Full estimate (the most common choice). Most options apply on selection with no extra fields; only the custom ones reveal a control: Full estimate , 1 week , and 2 weeks apply immediately with nothing to fill in. Until a date… reve… | COVERED | SCH-SPREAD-03, SCH-SPREAD-04, SCH-SPREAD-05 |
| R-4.5-04 | BULLET | Start date. Defaults to the earliest working day. Adjusting it is how a second technician's series can be made sequential (starting after the first) rather than parallel. | COVERED | SCH-SPREAD-06 |
| R-4.5-05 | BULLET | Uses the technician's own working hours. Automatically skips weekends when business hours are not set for them. Shop closures and public holidays are not skipped in V1.. | COVERED | SCH-SPREAD-07, SCH-EDGE-05, SCH-SPREAD-08 |
| R-4.5-06 | BULLET | Preview , collapsed by default: a one-line summary ("20 shifts · Jun 15 to Jul 13 · skips weekends + 2 days"), expandable to a week-by-week breakdown with skipped days struck through and their reasons. | COVERED | SCH-SPREAD-08, SCH-EDGE-05 |
| R-4.5-07 | BULLET | Confirming creates a linked series of daily shifts. | COVERED | SCH-SPREAD-09, SCH-EDGE-05, SCH-SPREAD-07, SCH-SPREAD-11 |
| R-4.5-08 | PROSE | Each drop spreads the full estimate for that technician, independently. | COVERED | SCH-SPREAD-10, SCH-SPREAD-07, SCH-API-02, SCH-EDGE-06, SCH-SPREAD-02, SCH-SPREAD-03, SCH-SPREAD-11 |
| R-4.5-09 | PROSE | Dropping the same work order on a second technician spreads the full estimate again for them. | COVERED | SCH-SPREAD-10, SCH-API-02, SCH-SPREAD-11, SCH-DND-04, SCH-SPREAD-02, SCH-SPREAD-06, SCH-SPREAD-07 |
| R-4.5-10 | PROSE | There is no shared "remaining" counter across technicians and no splitting of a shift. | COVERED | SCH-SPREAD-10 |
| R-4.5-11 | PROSE | Because progress is driven by clocked-in time, scheduled hours, the estimate, and actual hours are three separate quantities and are not forced to reconcile. | COVERED | SCH-EDGE-06, SCH-SPREAD-10 |

### §4.6 — 7 statements (COVERED 7)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-4.6-01 | PROSE | A series is a group of shifts created by the spread step; all shifts in a series share a series id. | COVERED | SCH-SPREAD-09, SCH-SER-01 |
| R-4.6-02 | PROSE | The series is a render-time grouping, not a special record. | COVERED | SCH-SER-04 |
| R-4.6-03 | PROSE | Underneath it is N individual daily shifts, each keeping its own day and hours, so capacity, overtime, and conflict logic all operate on the individual shifts unchanged. | COVERED | SCH-SER-04 |
| R-4.6-04 | PROSE | Shifts sharing a technician plus series id render as one connected banner: | COVERED | SCH-SPREAD-09, SCH-SER-01, SCH-SER-02, SCH-SER-04 |
| R-4.6-05 | BULLET | Month view: a continuous bar wrapping across week rows, labeled once at the start (with the technician), with a faded "continues" label on later weeks, empty weekend columns (when business hours are not set for weekends). | COVERED | SCH-SER-01 |
| R-4.6-06 | BULLET | Week view: one banner spanning the working days of that week in the technician's row, with chevrons at the edges indicating continuation beyond the visible week, a "week N of M" cue. | COVERED | SCH-SER-02, SCH-SER-01, SCH-SER-03 |
| R-4.6-07 | BULLET | Day view: that day's single time-positioned block with a "part of an M-week job" cue (only one day is visible, so there is no spanning bar). | COVERED | SCH-SER-03, SCH-SER-01, SCH-SER-02, SCH-SER-04 |

### §4.7 — 5 statements (COVERED 5)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-4.7-01 | PROSE | Overlapping shifts for the same technician never visually collide: | COVERED | SCH-LANE-02, SCH-LANE-04, SCH-LANE-03, SCH-LANE-01 |
| R-4.7-02 | BULLET | Shifts whose time ranges do not intersect share a single lane, so sequential or back-to-back work keeps the row at normal height. | COVERED | SCH-LANE-01, SCH-LANE-02 |
| R-4.7-03 | BULLET | Shifts whose time ranges do intersect split into stacked lanes, and the row grows to fit. | COVERED | SCH-LANE-02, SCH-LANE-01, SCH-LANE-03 |
| R-4.7-04 | BULLET | Visible lanes are capped at 3. Additional overlapping shifts collapse into a "+N more" affordance that opens a popover listing the hidden shifts. This applies in day, week, and month views (week and month reach the overflow much sooner because cells are narrower). | COVERED | SCH-LANE-04, SCH-LANE-03 |
| R-4.7-05 | BULLET | Overlap on the same technician is a conflict (see §4.11) and is flagged, so stacking reads as "resolve me," not "two normal jobs." | COVERED | SCH-LANE-02, SCH-LANE-01 |

### §4.8 — 8 statements (COVERED 8)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-4.8-01 | BULLET | Auto-scroll to business hours. On initial day-view load and when navigating to a new day, the timeline auto-scrolls so the working-day start sits at the left edge of the visible area (with a small 30 to 60 minute buffer before it). The start time comes from the same hierarchy shifts use: the earl… | COVERED | SCH-DAY-01 |
| R-4.8-02 | BULLET | Sticky header bar. Date and time headers stick to the top of the viewport during vertical scroll, so the user always knows which time column they are looking at. This applies in both day and week views. | COVERED | SCH-DAY-03 |
| R-4.8-03 | BULLET | Horizontal drag to move a shift's start time (snaps to 15-minute intervals). | COVERED | SCH-DAY-04, SCH-DAY-05 |
| R-4.8-04 | BULLET | Edge resize. Drag the left or right edge to adjust duration. | COVERED | SCH-DAY-05 |
| R-4.8-05 | BULLET | Lane stacking. Overlapping shifts split into parallel lanes per §4.7. | COVERED | SCH-LANE-02, SCH-LANE-04 |
| R-4.8-06 | BULLET | Lane height with VIN. When the VIN toggle is on (§9), lane heights in day view grow to accommodate the additional VIN line so block text is not clipped. | COVERED | SCH-VIEW-04 |
| R-4.8-07 | BULLET | Now line. A vertical indicator showing the current time, with a label on hover over the grid. | COVERED | SCH-DAY-06 |
| R-4.8-08 | BULLET | Business-hours shading. An optional grey overlay outside working hours. | COVERED | SCH-VIEW-06 |

### §4.9 — 11 statements (COVERED 10, COVERED-FLAGGED 1)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-4.9-01 | PROSE | Clicking a shift block opens a detail panel showing: | COVERED | SCH-MODAL-01, SCH-MODAL-04, SCH-COLOR-02, SCH-MODAL-02, SCH-MODAL-07 |
| R-4.9-02 | BULLET | Customer name, unit number, VIN (always visible, below unit and asset), and work order id. | COVERED | SCH-MODAL-01 |
| R-4.9-03 | BULLET | Scheduled date and start/end time pickers (15-minute increments). | COVERED | SCH-MODAL-02 |
| R-4.9-04 | BULLET | Technician. | COVERED | SCH-MODAL-08 |
| R-4.9-05 | BULLET | Time logged vs estimate (progress). | COVERED | SCH-MODAL-03, SCH-MODAL-05 |
| R-4.9-06 | BULLET | Scope summary and the scheduled line(s) with labor/total figures. | COVERED-FLAGGED — F2 | SCH-MODAL-04 |
| R-4.9-07 | BULLET | Estimated hours with inline edit. | COVERED | SCH-MODAL-05, SCH-MODAL-03 |
| R-4.9-08 | BULLET | Color picker (see §10). | COVERED | SCH-COLOR-02 |
| R-4.9-09 | BULLET | Notes: add, edit, and delete per work order. | COVERED | SCH-MODAL-06, SCH-COLOR-02, SCH-MODAL-05, SCH-MODAL-08 |
| R-4.9-10 | BULLET | A conflict banner with an "Adjust" action when the shift is conflicted. | COVERED | SCH-MODAL-07, SCH-MODAL-08 |
| R-4.9-11 | BULLET | Actions: Delete (series-aware, §7) | COVERED | SCH-MODAL-08, SCH-MODAL-06 |

- **R-4.9-06** — Spec §4.9 says the modal shows "the scheduled line(s) with labor/total figures"; SCH-MODAL-04 asserts NO money fields anywhere. Resolved by Rule 33 precedence: Branko's 2026-07-22 Q3 ruling + the Claude design §4c + tech-plan D6/NFR-002 ("no pricing in Schedule responses", also asserted by SCH-API-03) all say no money. The §4.9 clause is stale prose Branko has not tidied. NO case change; upstream tidy flagged.

### §4.10 — 11 statements (COVERED 11)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-4.10-01 | PROSE | Non-work-order time blocks (meetings, training, stand-ups) that occupy technician time: | COVERED | SCH-EVT-08 |
| R-4.10-02 | BULLET | Create via left-click on empty grid space, which opens a menu with 'Create event' and 'New work order'.. | COVERED | SCH-EVT-01, SCH-EVT-02, SCH-EVT-03, SCH-REAS-06 |
| R-4.10-03 | BULLET | Event modal: name, date, start/end time, all-day toggle, color category. | COVERED | SCH-EVT-03, SCH-EVT-08, SCH-EVT-01, SCH-EVT-06 |
| R-4.10-04 | BULLET | Drag-and-drop to reassign between technicians or move between days. | COVERED | SCH-EVT-05 |
| R-4.10-05 | BULLET | Day view shows a live preview block while creating, with drag-to-resize. | COVERED | SCH-EVT-02, SCH-EVT-03, SCH-EVT-08, SCH-EVT-01 |
| R-4.10-06 | PROSE | Event card anatomy. | COVERED | SCH-EVT-06, SCH-EVT-07, SCH-COLOR-03, SCH-EVT-01, SCH-EVT-02, SCH-EVT-03, SCH-EVT-05, SCH-EVT-08 |
| R-4.10-07 | PROSE | Event cards are styled to be structurally distinct from shift cards, so the two types are separable at a glance (not by color alone): a white/neutral card with a thin even border on all four sides and no colored left rail (the left rail is the shift's cue), a small grey-filled rounded chip on the… | COVERED | SCH-EVT-06 |
| R-4.10-08 | PROSE | Shifts read as tinted color-filled blocks with a colored left rail; events read as quieter, white outlined cards. | COVERED | SCH-EVT-06 |
| R-4.10-09 | PROSE | Event color. | COVERED | SCH-EVT-07, SCH-COLOR-03, SCH-EVT-01, SCH-EVT-02, SCH-EVT-03, SCH-EVT-05, SCH-EVT-06, SCH-EVT-08 |
| R-4.10-10 | PROSE | The default event color is neutral/grey. | COVERED | SCH-EVT-07, SCH-EVT-06, SCH-COLOR-03, SCH-EVT-03 |
| R-4.10-11 | PROSE | Events use the same custom color palette as shifts (the shared color picker with editable labels, see §10); choosing a color from the event modal tints the card and icon chip in the matching tones, the same way a colored shift is tinted. | COVERED | SCH-EVT-07, SCH-COLOR-03, SCH-EVT-06 |

### §4.11 — 10 statements (COVERED 10)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-4.11-01 | PROSE | The system continuously scans for scheduling issues and surfaces them in a toolbar pill: | COVERED | SCH-CONF-05 |
| R-4.11-02 | TABLEROW | Double-booked — Two different work orders overlap on the same technician at the same time. | COVERED | SCH-CONF-01, SCH-CONF-05, SCH-EVT-08, SCH-LANE-02 |
| R-4.11-03 | TABLEROW | Weekend shift — Shift scheduled on Saturday or Sunday (outside working days). | COVERED | SCH-CONF-02 |
| R-4.11-04 | TABLEROW | Before hours — Shift starts before the working-day start. | COVERED | SCH-CONF-03, SCH-CONF-02, SCH-CONF-07, SCH-EVT-08 |
| R-4.11-05 | TABLEROW | After hours — Shift extends past the working-day end. | COVERED | SCH-CONF-03, SCH-CONF-07, SCH-CONF-02, SCH-EVT-08 |
| R-4.11-06 | PROSE | Conflicts appear as a warning icon on the affected block and are listed in a dropdown from the toolbar. | COVERED | SCH-CONF-01, SCH-CONF-02, SCH-CONF-03, SCH-CONF-05 |
| R-4.11-07 | PROSE | Clicking a conflict navigates to the relevant technician and day. | COVERED | SCH-CONF-06, SCH-EVT-08, SCH-LANE-02, SCH-CONF-01, SCH-CONF-02, SCH-CONF-03, SCH-CONF-05, SCH-CONF-07 |
| R-4.11-08 | PROSE | Red and other alarming styling is reserved for conflicts and genuine errors, never for overtime. | COVERED | SCH-CONF-07 |
| R-4.11-09 | PROSE | Events are not conflict-checked for now: an event overlapping a shift (or another event) does not raise a conflict. | COVERED | SCH-CONF-01, SCH-EVT-08, SCH-CONF-05 |
| R-4.11-10 | PROSE | Their time still counts toward capacity (see §4.12). | COVERED | SCH-EVT-08, SCH-CONF-01 |

### §4.12 — 7 statements (COVERED 7)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-4.12-01 | PROSE | When enabled in View Options, each day column header shows a capacity bar. | COVERED | SCH-CAP-01, SCH-VIEW-05, SCH-CAP-04, SCH-CAP-02, SCH-EVT-08 |
| R-4.12-02 | PROSE | Fill represents aggregate utilization; overtime is a separate per-technician signal, and the two are independent. | COVERED | SCH-CAP-03, SCH-CAP-01, SCH-CAP-04, SCH-EVT-08 |
| R-4.12-03 | PROSE | Event time is included in the utilization total alongside shifts, so meetings and training consume capacity even though they are not conflict-checked (see §4.11). | COVERED | SCH-EVT-08, SCH-CAP-03, SCH-CAP-02 |
| R-4.12-04 | BULLET | Blue fill: aggregate technician-hours booked (shifts plus events) divided by total available (the sum of all techs' working hours). Clamped at 100%. The track width equals capacity and is identical across all days, so bars stay comparable at a glance (no per-day rescaling). | COVERED | SCH-CAP-01, SCH-EVT-08, SCH-CAP-02, SCH-CAP-03 |
| R-4.12-05 | BULLET | Amber spill: when aggregate hours exceed capacity, an amber segment extends past the right edge of the track, with a tick at the 100% line. | COVERED | SCH-CAP-02, SCH-CAP-01 |
| R-4.12-06 | BULLET | "OT" tag: appears whenever any individual technician exceeds their own daily hours, even when the day's aggregate is under capacity. It is a text tag, not a color-only signal. | COVERED | SCH-CAP-03, SCH-CONF-07, SCH-CAP-04, SCH-EVT-08 |
| R-4.12-07 | BULLET | Hover tooltip: a per-technician breakdown (assigned vs that tech's capacity), with overtime technicians highlighted in amber. | COVERED | SCH-CAP-04 |

### §4.13 — 5 statements (COVERED 5)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-4.13-01 | PROSE | Hovering a block shows a quick peek without opening the modal. | COVERED | SCH-TIP-04 |
| R-4.13-02 | PROSE | Shift tooltip: customer name (plus the conflict icon if conflicted); unit, vehicle, and VIN; date and time range; technician; scope summary ("N lines · Xh"); the individual line names as a short list capped at 3 with a "+N more lines" row (no line statuses); a time-logged progress bar ("X / Yh");… | COVERED | SCH-TIP-01, SCH-TIP-02 |
| R-4.13-03 | PROSE | Event tooltip: event name (plus its grey category dot); date and time range; technician. | COVERED | SCH-TIP-03, SCH-TIP-01 |
| R-4.13-04 | PROSE | Behavior: open after a roughly 300 to 500ms hover delay; dismiss on mouse-leave; read-only, so clicking the block still opens the full modal. | COVERED | SCH-TIP-04 |
| R-4.13-05 | PROSE | Because the shift tooltip's height varies with the line list, it flips to open above the block when there is not room below and shifts horizontally to stay within the viewport, rather than being clipped. | COVERED | SCH-TIP-05 |

### §5.1 — 8 statements (COVERED 8)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-5.1-01 | PROSE | Filters live behind a "Filter" button (with an active-count badge); there are no assignment tabs. | COVERED | SCH-FILT-01, SCH-FILT-05, SCH-FILT-02, SCH-REG-05, SCH-WOL-01 |
| R-5.1-02 | PROSE | Applying a filter narrows the flat card list, and "Clear all" resets in one click. | COVERED | SCH-FILT-01, SCH-FILT-03, SCH-FILT-05, SCH-WOL-01, SCH-FILT-02, SCH-FILT-04 |
| R-5.1-03 | TABLEROW | Assignment — Assigned, Unassigned | COVERED | SCH-FILT-01, SCH-FILT-02, SCH-WOL-01, SCH-FILT-05 |
| R-5.1-04 | TABLEROW | Status — All work order statuses currently supported in the app | COVERED | SCH-FILT-01, SCH-FILT-03 |
| R-5.1-05 | TABLEROW | Priority — High, Medium, Low | COVERED | SCH-FILT-01, SCH-FILT-04, SCH-REG-05 |
| R-5.1-06 | PROSE | Search and filter work together: the search field (see §3.1) narrows by text match, and the filter button narrows by structured attributes. | COVERED | SCH-FILT-06, SCH-FILT-01 |
| R-5.1-07 | PROSE | Both can be active at the same time. | COVERED | SCH-FILT-01, SCH-FILT-06 |
| R-5.1-08 | PROSE | The line drill-down has its own filters: All and Unscheduled (lines with no shifts yet), plus a line-name search (see §3.1). | COVERED | SCH-LINE-07 |

### §5.2 — 3 statements (COVERED 3)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-5.2-01 | BULLET | Month/year picker (grid of month buttons, year nav arrows). | COVERED | SCH-MCAL-02 |
| R-5.2-02 | BULLET | Collapsible: a chevron toggle hides the calendar grid to maximize work order list space. | COVERED | SCH-MCAL-03 |
| R-5.2-03 | BULLET | Selected date highlighted; today indicated; week row highlighted on hover. | COVERED | SCH-MCAL-04, SCH-MCAL-01 |

### §6 — 8 statements (COVERED 8)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-6-01 | TABLEROW | Today button — Jumps the grid to the current date. | COVERED | SCH-TOOL-01, SCH-CONF-05, SCH-NAV-03 |
| R-6-02 | TABLEROW | Left/right arrows — Navigate by day, week, or month depending on the active range. | COVERED | SCH-TOOL-02, SCH-TOOL-01, SCH-NAV-03 |
| R-6-03 | TABLEROW | Date label — Shows the current range (e.g. "Jul 14 to 20, 2026"). | COVERED | SCH-TOOL-02, SCH-TOOL-01 |
| R-6-04 | TABLEROW | Conflict pill — Shows the issue count; click opens the conflict detail dropdown. | COVERED | SCH-CONF-05 |
| R-6-05 | TABLEROW | Search — Filters grid blocks by matching against customer name, WO number, unit number, technician name, and line name. Non-matching blocks fade; matching blocks highlight. | COVERED | SCH-TOOL-03 |
| R-6-06 | TABLEROW | Filter and Display — Dropdown (checkbox style) combining department visibility toggles, My Shifts, and VIN. Replaces the former "Departments" control. | COVERED | SCH-VIEW-01 |
| R-6-07 | TABLEROW | View Options — Toggles: Business hours, Capacity bars, Events, Tech hours, Saturday, Sunday. | COVERED | SCH-VIEW-05, SCH-EDGE-08 |
| R-6-08 | TABLEROW | Day / Week / Month — Segmented control to switch the grid range. | COVERED | SCH-NAV-03, SCH-TOOL-02, SCH-TOOL-01, SCH-VIEW-05 |

### §7 — 6 statements (COVERED 6)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-7-01 | BULLET | Drag feedback. Drop-target cells highlight, and a ghost block shows the line name and hours. | COVERED | SCH-DND-06, SCH-DND-01 |
| R-7-02 | BULLET | Shift reassignment. Dragging a shift block from one technician row to another reassigns it: the target technician is added to the affected line's roster and the source technician is removed. A confirmation modal handles cross-tech moves. | COVERED | SCH-REAS-01, SCH-DND-01, SCH-DEL-09, SCH-MODAL-08 |
| R-7-03 | BULLET | Left-click on empty grid space opens a menu with: Create event, New work order. | COVERED | SCH-EVT-01, SCH-REAS-03, SCH-REAS-06 |
| R-7-04 | BULLET | Toast notifications. Every create, delete, move, and reassign action produces a toast with an Undo option. The toast persists for 4 to 7 seconds, stays while the cursor is over it, and dismisses on mouse-leave. | COVERED | SCH-DEL-09, SCH-DEL-08, SCH-REAS-01, SCH-DEL-10 |
| R-7-05 | BULLET | Keyboard support. Global shortcuts work anywhere on the schedule page: Escape closes the topmost open modal or popover, following a defined stacking order (delete scope, reassign, spread, capacity, event modal, event view, line picker, shift detail, cell menu, calendar picker, customize, filters,… | COVERED | SCH-KEY-01, SCH-KEY-03 |
| R-7-06 | BULLET | Series-aware deletion. Deleting a shift that belongs to a series asks for scope. This is routine, lightweight editing (undo toast, not the alarming destructive styling): This shift only: removes that day. The series keeps the gap (it is not auto-closed), and the hours return to the estimate's rem… | COVERED | SCH-DEL-01, SCH-DEL-02, SCH-DEL-03, SCH-DEL-04, SCH-DEL-05, SCH-DEL-06 |

### §8.1 — 8 statements (COVERED 3, NOT-TESTABLE 5)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-8.1-01 | TABLEROW | Shift — sid , woId , rowKey (tech), date , startHour , blockDuration , lines[] , seriesId — Belongs to Work Order; assigned to Technician; optionally part of a Series | NOT-TESTABLE — (b) implementation detail (data model) | — |
| R-8.1-02 | TABLEROW | Event — eid , name , rowKey (tech), date , startHour , endHour , allDay , color — Assigned to Technician | NOT-TESTABLE — (b) implementation detail (data model) | — |
| R-8.1-03 | TABLEROW | Work Order — id , customer , unit , asset , status , priority , hrs , color — Has many Lines | COVERED | SCH-WOL-02, SCH-REG-05 |
| R-8.1-04 | TABLEROW | Line — num , title , status , est , actual , total , labor[] — Belongs to Work Order; has many Technicians via the labor roster (no cap) | COVERED | SCH-LINE-04, SCH-MODAL-04 |
| R-8.1-05 | TABLEROW | Technician — key , name , role , dept , hours (working start/end plus working weekdays) — Belongs to Department; has many Shifts and Events | NOT-TESTABLE — (b) implementation detail (data model) | — |
| R-8.1-06 | TABLEROW | Department — key , name — Has many Technicians | NOT-TESTABLE — (b) implementation detail (data model) | — |
| R-8.1-07 | PROSE | The Line's labor[] roster has no maximum; any number of technicians may be on a line. | COVERED | SCH-LINE-04 |
| R-8.1-08 | PROSE | An unassigned shift has an empty or placeholder rowKey until it is moved onto a technician. | NOT-TESTABLE — (b) implementation detail (data model) | — |

- **R-8.1-01** — shift internals (sid/rowKey/blockDuration/seriesId); observable behaviour in SCH-DND-01, SCH-SER-04
- **R-8.1-02** — event internals (eid/rowKey/startHour); observable fields in SCH-EVT-03
- **R-8.1-05** — technician internals (key/dept/hours); observable in SCH-NAV-04, SCH-VIEW-09, SCH-CONF-02
- **R-8.1-06** — department internals (key/name); observable in SCH-NAV-04
- **R-8.1-08** — empty/placeholder rowKey is internal; observable behaviour in SCH-START-05/07

### §8.2 — 3 statements (COVERED 1, NOT-TESTABLE 2)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-8.2-01 | PROSE | A series groups shifts created by the spread step; all shifts in a series share a seriesId . | NOT-TESTABLE — (b) implementation detail (data model) | — |
| R-8.2-02 | PROSE | The series supports scoped deletion (this / this-and-after / whole) and renders as a connected banner in month, week, and day views. | COVERED | SCH-DEL-01, SCH-DEL-05, SCH-SER-01, SCH-SER-02, SCH-SER-03 |
| R-8.2-03 | PROSE | It is a grouping over ordinary daily shifts, not a distinct persisted entity beyond the shared id, and each daily shift carries its own hours for capacity math. | NOT-TESTABLE — (b) implementation detail (data model) | — |

- **R-8.2-01** — shared seriesId is internal; observable behaviour in SCH-SPREAD-09, SCH-SER-04
- **R-8.2-03** — "not a distinct persisted entity" is internal; observable behaviour in SCH-SER-04

### §9 — 12 statements (COVERED 12)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-9-01 | PROSE | Display settings are split across two toolbar controls: | COVERED | SCH-VIEW-01, SCH-VIEW-05 |
| R-9-02 | PROSE | Filter and Display dropdown (checkbox style, §6): | COVERED | SCH-VIEW-01, SCH-MODAL-01, SCH-VIEW-02, SCH-VIEW-03, SCH-VIEW-04, SCH-VIEW-05, SCH-VIEW-06, SCH-VIEW-09 |
| R-9-03 | TABLEROW | Department toggles — All on — Show or hide individual department groups in the grid. | COVERED | SCH-VIEW-02 |
| R-9-04 | TABLEROW | My Shifts — Off — Filters the grid to show only shifts assigned to the current user. All other technician rows and their shifts are hidden. This is a personal convenience filter, not a permission boundary. | COVERED | SCH-VIEW-03, SCH-VIEW-02 |
| R-9-05 | TABLEROW | VIN — Off — Shows the VIN number as an additional line on shift blocks (day and week views) and in hover tooltips. The VIN is always visible in the shift detail modal regardless of this toggle. | COVERED | SCH-VIEW-04, SCH-MODAL-01 |
| R-9-06 | PROSE | View Options popover: | COVERED | SCH-VIEW-05, SCH-VIEW-01, SCH-VIEW-02, SCH-VIEW-03, SCH-VIEW-04, SCH-VIEW-06, SCH-VIEW-09, SCH-VIEW-10 |
| R-9-07 | TABLEROW | Business Hours — Off — Shades non-working hours in day view. | COVERED | SCH-VIEW-06, SCH-VIEW-05, SCH-VIEW-04 |
| R-9-08 | TABLEROW | Capacity Bars — On — Shows per-day capacity utilization bars in column headers. | COVERED | SCH-VIEW-05 |
| R-9-09 | TABLEROW | Events — On — Shows non-WO event blocks on the grid. | COVERED | SCH-VIEW-05, SCH-VIEW-04 |
| R-9-10 | TABLEROW | Tech Hours — Off — Displays each technician's working hours next to their name. | COVERED | SCH-VIEW-09, SCH-VIEW-05, SCH-VIEW-06 |
| R-9-11 | TABLEROW | Saturday — On — Includes the Saturday column. | COVERED | SCH-VIEW-05, SCH-VIEW-10 |
| R-9-12 | TABLEROW | Sunday — On — Includes the Sunday column. | COVERED | SCH-VIEW-05, SCH-VIEW-10 |

### §10 — 6 statements (COVERED 6)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-10-01 | BULLET | Blue is the default color for all shifts, including long or multi-week jobs. | COVERED | SCH-COLOR-01, SCH-COLOR-02, SCH-EVT-07 |
| R-10-02 | BULLET | Grey is the default color for events. | COVERED | SCH-COLOR-02, SCH-EVT-07, SCH-COLOR-01 |
| R-10-03 | BULLET | All other colors are optional and chosen by the user from the color picker in the shift or event detail modal, to distinguish shifts however the shop likes. | COVERED | SCH-COLOR-02, SCH-COLOR-03, SCH-EVT-07 |
| R-10-04 | BULLET | Color labels are editable per shop. | COVERED | SCH-COLOR-03, SCH-EVT-07 |
| R-10-05 | PROSE | Each color provides three tones: background fill, text color, and accent (left border). | COVERED | SCH-COLOR-02 |
| R-10-06 | PROSE | There are no fixed semantic meanings tied to specific colors beyond the two defaults above. | COVERED | SCH-COLOR-02 |

### §11 — 5 statements (COVERED 5)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-11-01 | BULLET | Performance. The grid must render smoothly with up to 15 technicians x 7 days x several shifts per cell. The sidebar work order list virtualizes at 50+ items, as does the line drill-down for orders with many lines. | COVERED | SCH-EDGE-03, SCH-EDGE-04 |
| R-11-02 | BULLET | Responsiveness. Minimum supported width is 960px (the grid scrolls horizontally below that), and the sidebar collapses on narrow viewports. | COVERED | SCH-EDGE-02 |
| R-11-03 | BULLET | Accessibility. All interactive elements are keyboard-reachable; focus rings follow the design system; modals trap focus and close on Escape; drag-and-drop has a click-to-arm alternative. Overtime and conflict signals are not color-only (OT uses a text tag; the overflow uses shape). | COVERED | SCH-KEY-05, SCH-DND-08, SCH-CAP-03, SCH-LANE-03, SCH-KEY-01 |
| R-11-04 | BULLET | Undo. Every destructive action (delete, move, reassign) is undoable for 4 to 7 seconds via a toast that persists while hovered. | COVERED | SCH-DEL-09, SCH-DEL-08 |
| R-11-05 | BULLET | Dark theme. The Schedule supports a user-selectable Light / Dark theme, chosen from the user menu and persisted per user. It is built on the design-system color tokens, so surfaces, borders, text, and accents remap automatically; elevation/shadow tokens also swap so depth reads correctly on dark … | COVERED | SCH-EDGE-08 |

### §12 — 6 statements (COVERED 5, COVERED-FLAGGED 1)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-12-01 | BULLET | A technician can have multiple shifts on the same day (different work orders); overlapping times render in parallel lanes with a 3-lane cap and "+N more" overflow (§4.7). | COVERED | SCH-LANE-01, SCH-LANE-03, SCH-LANE-04 |
| R-12-02 | BULLET | Every shift has a start time, resolved from the hierarchy in §4.2 or from the drop position in day view; unassigned shifts use the same rules minus technician hours until they are assigned. | COVERED | SCH-START-01, SCH-START-02, SCH-START-03, SCH-START-04, SCH-START-05, SCH-START-06, SCH-START-07 |
| R-12-03 | BULLET | Shop closures (holidays, inventory days) are defined at the shop level and block the spread step from placing shifts on those days. | COVERED-FLAGGED — F1 | SCH-EDGE-05, SCH-SPREAD-07 |
| R-12-04 | BULLET | Dropping the same work order on multiple technicians creates independent series, each spreading the full estimate, so planned hours across technicians may exceed the estimate. This is expected, since clocked-in time drives progress. | COVERED | SCH-SPREAD-10 |
| R-12-05 | BULLET | Whole-order and multi-line-subset shifts both render as "N Lines" on the block; the detail modal and hover tooltip provide the specifics. | COVERED | SCH-BLOCK-02 |
| R-12-06 | BULLET | Dragging a shift between technicians reassigns it, adding the target technician to the affected line's roster and removing the source technician. | COVERED | SCH-REAS-01 |

- **R-12-03** — Spec-internal contradiction X1: §12 says shop closures "block the spread step from placing shifts on those days", §4.5 says "Shop closures and public holidays are not skipped in V1..". Rule 32 latest-wins: the §4.5 sentence is the Confluence v22 edit (2026-07-27), the §12 sentence is untouched v18-era residue -> the V1 behaviour is NOT-skipped, which is what SCH-EDGE-05 asserts. No new case authored for either side (per instruction); §12 flagged to Branko for tidy (his open question NQ-1).

### §13 — 4 statements (NOT-TESTABLE 4)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-13-01 | TABLEROW | Scheduling conflicts — Under 5% of shifts — Flagged shifts divided by total shifts per week | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |
| R-13-02 | TABLEROW | Time to schedule — Under 30s per shift — Median time from drag start to shift creation | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |
| R-13-03 | TABLEROW | Adoption — 80% of active shops — Shops with at least 1 shift created per week, 90 days post-launch | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |
| R-13-04 | TABLEROW | Undo usage — Under 10% of actions — Undo clicks divided by total scheduling actions | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |

- **R-13-01** — States intent or a post-launch metric, not a behaviour a manual tester can observe.
- **R-13-02** — States intent or a post-launch metric, not a behaviour a manual tester can observe.
- **R-13-03** — States intent or a post-launch metric, not a behaviour a manual tester can observe.
- **R-13-04** — States intent or a post-launch metric, not a behaviour a manual tester can observe.

### §14 — 3 statements (COVERED 3)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-14-01 | PROSE | The Schedule is a CRUD area in ShopView's custom roles and permissions system. | COVERED | SCH-PERM-07 |
| R-14-02 | PROSE | Access is controlled by three independent permission levels (View, Edit, Delete), where Delete requires Edit and Edit requires View. | COVERED | SCH-PERM-07, SCH-API-01 |
| R-14-03 | PROSE | The schedule also depends on permissions from other areas, particularly Work Orders. | COVERED | SCH-API-03 |

### §14.1 — 12 statements (COVERED 8, COVERED-FLAGGED 2, GAP 2)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-14.1-01 | PROSE | Schedule: View. | COVERED | SCH-PERM-02, SCH-PERM-04, SCH-PERM-01, SCH-PERM-03, SCH-PERM-05, SCH-PERM-06, SCH-REAS-03 |
| R-14.1-02 | PROSE | The user can see the schedule page, navigate between day/week/month views, use the mini calendar, search, filter, view all technicians' shifts and events, hover for tooltips, and open shift/event detail modals in read-only mode. | COVERED | SCH-PERM-01, SCH-PERM-02, SCH-PERM-04, SCH-REAS-03, SCH-PERM-05 |
| R-14.1-03 | PROSE | All editing affordances (drag handles, drop targets, right-click context menu, resize handles, creation entry points, edit fields in modals, reassign and delete actions) are hidden or disabled. | COVERED-FLAGGED — F3 | SCH-PERM-02 |
| R-14.1-04 | PROSE | This is the experience for roles like Technician, Parts Manager, Parts Tech, Office, and Time Clock. | GAP — (a) genuine gap | SCH-PERM-01, SCH-PERM-02 |
| R-14.1-05 | PROSE | When Schedule: View is OFF, the Schedule top-level nav item is hidden entirely. | COVERED | SCH-PERM-03, SCH-PERM-02, SCH-REAS-03 |
| R-14.1-06 | PROSE | Schedule: Edit (requires View). | COVERED | SCH-PERM-01, SCH-PERM-02, SCH-PERM-04, SCH-PERM-03, SCH-PERM-05, SCH-REAS-03 |
| R-14.1-07 | PROSE | Unlocks all creation and modification interactions: drag-and-drop from the sidebar, the scope picker, the spread modal, shift and event creation (including via right-click context menu and day-view click-to-create), shift reassignment between technicians, edge-resize and horizontal drag in day vi… | COVERED-FLAGGED — F3 | SCH-PERM-04 |
| R-14.1-08 | PROSE | This is the level for Service Manager, Senior Service Advisor, Service Advisor, and Foreman roles. | GAP — (a) genuine gap | SCH-PERM-04 |
| R-14.1-09 | PROSE | Schedule: Delete (requires Edit). | COVERED | SCH-PERM-02, SCH-PERM-05, SCH-PERM-01, SCH-PERM-04, SCH-PERM-06 |
| R-14.1-10 | PROSE | Unlocks deleting shifts and events, including series-aware deletion with its three scopes (this shift / this and after / whole series). | COVERED | SCH-PERM-06, SCH-DEL-01, SCH-DEL-05 |
| R-14.1-11 | PROSE | Without Delete, a user with Edit can create and modify but cannot remove shifts or events. | COVERED | SCH-PERM-05, SCH-PERM-02, SCH-PERM-01, SCH-PERM-04, SCH-PERM-06 |
| R-14.1-12 | PROSE | The delete action and the trash icon are hidden. | COVERED | SCH-PERM-05, SCH-PERM-06 |

- **R-14.1-03** — §14.1 still lists a "right-click context menu" among the editing affordances; Branko ruled 2026-07-31 "there is no right click, only left click" and §4.10/§7 were rewritten to left-click in v22. Our cases follow left-click. NO case change; §14.1 wording flagged for upstream tidy.
- **R-14.1-04** — No case asserts WHICH default roles sit at which Schedule tier. The role names Technician / Parts Manager / Parts Tech / Office / Time Clock appear nowhere in the 164-case corpus. SCH-PERM-01..06 test the tiers abstractly ("a user whose role has View"). || CLOSURE: NEW case SCH-PERM-13
- **R-14.1-07** — Same residue: §14.1 Edit tier says creation "including via right-click context menu". Cases follow the left-click ruling.
- **R-14.1-08** — Same gap, Edit side: Service Manager / Senior Service Advisor / Service Advisor / Foreman appear nowhere in the corpus. || CLOSURE: NEW case SCH-PERM-13 (same case)

### §14.2 — 3 statements (COVERED 3)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-14.2-01 | PROSE | The left panel sidebar displays work order data (customer, unit, lines, lead tech) and requires Work Orders: View to populate. | COVERED | SCH-PERM-12, SCH-PERM-08 |
| R-14.2-02 | PROSE | If a user has Schedule access but Work Orders: View is OFF, the sidebar hides the work order list and line drill-down (the mini calendar remains available). | COVERED | SCH-PERM-08, SCH-PERM-12 |
| R-14.2-03 | PROSE | The user can still view and interact with shifts already on the grid, but cannot drag new ones from the sidebar since the WO list is not visible. | COVERED | SCH-PERM-08, SCH-PERM-12 |

### §14.3 — 3 statements (COVERED 3)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-14.3-01 | PROSE | The schedule always shows all technicians' shifts and events for every user who has Schedule: View. | COVERED | SCH-PERM-01, SCH-PERM-09, SCH-VIEW-03 |
| R-14.3-02 | PROSE | There is no role-based restriction to "own shifts only." This is intentional: the schedule is a shared coordination resource that service advisors and managers use to orchestrate work across the team. | COVERED | SCH-PERM-09 |
| R-14.3-03 | PROSE | The "My Shifts" toggle in the Filter and Display dropdown (§9) provides this as an optional personal convenience filter, not a security boundary. | COVERED | SCH-PERM-09, SCH-VIEW-03 |

### §14.4 — 3 statements (COVERED 3)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-14.4-01 | PROSE | Whether a user appears as a row in the schedule grid is controlled by their department assignment on their staff record , not by their role permission. | COVERED | SCH-PERM-10, SCH-NAV-04, SCH-PERM-11 |
| R-14.4-02 | PROSE | Any staff member assigned to a department that is visible on the schedule appears as a technician row, regardless of their role. | COVERED | SCH-NAV-04, SCH-PERM-10 |
| R-14.4-03 | PROSE | Similarly, the ability to clock into work order line tasks is controlled by the "Time Clock" setting on the staff record, not by the permission model. | COVERED | SCH-PERM-11 |

### §15 — 6 statements (NOT-TESTABLE 6)

| # | Kind | Statement (verbatim) | Verdict | Case(s) |
|---|---|---|---|---|
| R-15-01 | BULLET | Technician availability and PTO. Block out vacation, sick time, and training that are not Events, and have the spread step flow around them. | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |
| R-15-02 | BULLET | Auto-scheduling. Suggest optimal technician assignments based on skills, availability, and workload balance. | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |
| R-15-03 | BULLET | Recurring events. Repeating calendar blocks for stand-ups and safety meetings. | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |
| R-15-04 | BULLET | Skill matching. Warn when a technician is assigned to a line requiring certifications they do not hold. | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |
| R-15-05 | BULLET | Spread around existing bookings. Have the spread step automatically flow around days the technician is already booked (skipping them and extending the end date), rather than requiring the manager to handle conflicts manually. | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |
| R-15-06 | BULLET | Long-job cap. Past a certain length, instead of materializing every daily shift, represent a very long job as a single assignment span across a date range and let clock-ins fill the actuals, reducing board clutter and the number of shift records to manage. | NOT-TESTABLE — (b) goal / persona / success-metric / future consideration | — |

- **R-15-01** — States intent or a post-launch metric, not a behaviour a manual tester can observe.
- **R-15-02** — States intent or a post-launch metric, not a behaviour a manual tester can observe.
- **R-15-03** — States intent or a post-launch metric, not a behaviour a manual tester can observe.
- **R-15-04** — States intent or a post-launch metric, not a behaviour a manual tester can observe.
- **R-15-05** — States intent or a post-launch metric, not a behaviour a manual tester can observe.
- **R-15-06** — States intent or a post-launch metric, not a behaviour a manual tester can observe.
