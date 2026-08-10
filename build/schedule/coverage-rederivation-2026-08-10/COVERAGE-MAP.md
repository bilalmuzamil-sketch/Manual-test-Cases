# Schedule — REQUIREMENT → CASE MAP, rebuilt from scratch — 2026-08-10

> **Schedule has never had a requirement→case map. This is the first one.** It is re-derived
> from the LIVE spec body and the LIVE TestRail case bodies (Rule 43: matrices are re-derived,
> never patched), in BOTH directions, at **assertion** granularity rather than line
> granularity (Rule 45(e)).

> **What changed against the 2026-08-06 pass, and why it matters.** That pass verdicted **224
> requirement LINES** and reported 0 uncovered. A line routinely carries several promises, so a
> line-level *covered* can be true of one and silently false of the rest — the failure mode the
> 2026-08-10 Report Suite sweep named as cases that *"tested half the promise"*. Splitting the
> same 234 lines into **397 assertions** is what surfaces the four PARTIALs below, none of which
> is visible at line level.

---

## Totals — Direction 1 (requirement → case)

| Verdict | Count |
|---|---|
| **COVERED** | **281** |
| **PARTIAL** | **4** |
| **UNCOVERED** | **20** |
| **BLOCKED** | **1** |
| **NOT-INDEPENDENTLY-TESTABLE** | **91** |
| **TOTAL ASSERTIONS** | **397** |

281 + 4 + 20 + 1 + 91 = **397**. The arithmetic is stated because a coverage table whose parts do not sum is not a coverage table.

Derived from **234 requirement lines** across **33 sections** of Confluence **version 27**, themselves extracted from **345 content lines** with **0 unaccounted** (`evidence/extract-v27.json`).

**Rows without a verdict: 0.** An un-verdicted row is a visible hole, which is the whole point of the per-requirement table (Rule 43).

### Per section

| § | Section | Assertions | Covered | Partial | Uncovered | Blocked | Not indep. testable |
|---|---|---|---|---|---|---|---|
| §1.2 | Goals | 4 | 0 | 0 | 0 | 0 | 4 |
| §3 | Information architecture | 2 | 2 | 0 | 0 | 0 | 0 |
| §3.1 | Left panel: work order sidebar ⚠️ | 20 | 18 | 0 | 1 | 0 | 1 |
| §3.2 | Main area: schedule grid | 10 | 10 | 0 | 0 | 0 | 0 |
| §4.1 | Drag-and-drop scheduling | 11 | 6 | 0 | 0 | 0 | 5 |
| §4.2 | Shift start times and unassigned shifts | 24 | 22 | 0 | 0 | 0 | 2 |
| §4.3 | Scope picker | 10 | 9 | 0 | 0 | 0 | 1 |
| §4.4 | Shift block anatomy and scope labeling | 11 | 10 | 0 | 0 | 0 | 1 |
| §4.5 | Multi-day spread scheduling | 19 | 19 | 0 | 0 | 0 | 0 |
| §4.6 | Linked series and banners | 9 | 7 | 0 | 0 | 0 | 2 |
| §4.7 | Overlap and lane stacking | 7 | 6 | 0 | 0 | 0 | 1 |
| §4.8 | Day view: timeline interactions | 15 | 14 | 0 | 0 | 0 | 1 |
| §4.9 | Shift detail modal | 11 | 10 | 0 | 0 | 0 | 1 |
| §4.10 | Events | 12 | 11 | 0 | 0 | 0 | 1 |
| §4.11 | Conflict detection | 14 | 9 | 0 | 0 | 0 | 5 |
| §4.12 | Capacity visualization ⚠️ | 10 | 9 | 1 | 0 | 0 | 0 |
| §4.13 | Hover tooltips (read-only) | 10 | 9 | 0 | 0 | 0 | 1 |
| §5.1 | Work order filters | 13 | 7 | 0 | 0 | 0 | 6 |
| §5.2 | Mini calendar | 4 | 4 | 0 | 0 | 0 | 0 |
| §5.3 | Panel collapse ⚠️ | 18 | 0 | 0 | 18 | 0 | 0 |
| §6 | Grid toolbar ⚠️ | 20 | 10 | 0 | 1 | 0 | 9 |
| §7 | Interactions and micro-interactions | 24 | 24 | 0 | 0 | 0 | 0 |
| §8.1 | Key entities | 24 | 3 | 0 | 0 | 0 | 21 |
| §8.2 | Series | 5 | 5 | 0 | 0 | 0 | 0 |
| §9 | View options and customization | 33 | 12 | 0 | 0 | 0 | 21 |
| §10 | Color system | 6 | 6 | 0 | 0 | 0 | 0 |
| §11 | Non-functional requirements ⚠️ | 15 | 10 | 3 | 0 | 0 | 2 |
| §12 | Edge cases and constraints ⚠️ | 10 | 3 | 0 | 0 | 1 | 6 |
| §14 | Roles and permissions | 3 | 3 | 0 | 0 | 0 | 0 |
| §14.1 | Permission tiers | 13 | 13 | 0 | 0 | 0 | 0 |
| §14.2 | Work order sidebar dependency | 4 | 4 | 0 | 0 | 0 | 0 |
| §14.3 | No permission-level "own only" restriction | 3 | 3 | 0 | 0 | 0 | 0 |
| §14.4 | Technician grid rows are department-based | 3 | 3 | 0 | 0 | 0 | 0 |

### How to read `NOT-INDEPENDENTLY-TESTABLE` — this is not 91 requirements waved away

| Reason | Count | What it means |
|---|---|---|
| LABEL-CELL | 41 | This spec states many requirements as a two-cell table row — a label cell (*"Double-booked"*, *"Today button"*, *"Off"*) and a description cell (*"Two different work orders overlap on the same technician at the same time."*). The requirement is the ROW. The label cell is verdicted here; **the assertion is verdicted on the description cell, which appears in the COVERED count.** No assertion is lost. |
| DATA-MODEL | 21 | §8.1 entity names, field lists and relationships. Not behaviour. Their observable consequences ARE covered — the uncapped labor roster by C29951, the placeholder `rowKey` of an unassigned shift by C29973 and C29975. |
| FRAMING | 15 | Lead-in sentences that introduce a list or table and assert nothing on their own (*"It is derived from a hierarchy:"*). Every item they introduce is verdicted separately. |
| CROSS-REFERENCE | 10 | The assertion lives in another section and is verdicted there (*"Lane stacking… per §4.7"*). |
| GOAL | 4 | §1.2 goal statements. One of them is asserted anyway and the row says so. |

---

## The rows that are NOT plain COVERED — read these first

### `§3.1-L44.A1` — **UNCOVERED**

> **Spec v27, verbatim:** *"The panel can be collapsed and expanded from the grid toolbar (§5.3), handing its width to the grid without losing panel state."*

**Nearest case:** **SCH-NAV-01 = [C29925](https://shopview.testrail.io/index.php?/cases/view/29925)**

> **Its own text, verbatim:** *"The main area is the schedule grid showing technician rows, with a toolbar above it."*

The §3.1 sentence pointing at the panel toggle is also new in v27. Same gap as §5.3, reached from the sidebar section instead of the toolbar section.

### `§4.12-L165.A1` — **PARTIAL**

> **Spec v27, verbatim:** *"Hover tooltip: a per-assigned technician breakdown (assigned vs that tech's capacity), with overtime technicians highlighted in amber."*

**Nearest case:** **SCH-CAP-04 = [C30033](https://shopview.testrail.io/index.php?/cases/view/30033)**

> **Its own text, verbatim:** *"A tooltip shows a per-technician breakdown: assigned hours vs that technician's capacity."*

The capacity tooltip is covered, but the word that changed is not. Confluence v26 (2026-08-07T11:02Z) replaced 'a per-technician breakdown' - wording unchanged since v1 - with 'a per-ASSIGNED technician breakdown'. C30033 still says 'per-technician' in its title and in expected result 1. On a shop with 15 technicians of whom 3 are booked, the two readings produce visibly different tooltips. UNCOVERED PART: that only technicians who have an assignment that day appear in the breakdown.

### `§5.3-L189.A1` — **UNCOVERED**

> **Spec v27, verbatim:** *"An icon button collapses and expands the left panel."*

§5.3 Panel collapse is new in Confluence v27 (2026-08-07). No case in the suite covers the panel toggle. The five cases that mention collapsing are about other controls: C29929 department header, C29934 mini-calendar chevron, C29984 spread preview, C29998 lane overflow, C30086 responsive auto-collapse.

### `§5.3-L189.A2` — **UNCOVERED**

> **Spec v27, verbatim:** *"It is the first item in the grid toolbar, left of Today, sitting in the same left gutter as the grid's row labels and avatars so it reads as belonging to the panel it controls"*

§5.3 Panel collapse is new in Confluence v27 (2026-08-07). No case in the suite covers the panel toggle. The five cases that mention collapsing are about other controls: C29929 department header, C29934 mini-calendar chevron, C29984 spread preview, C29998 lane overflow, C30086 responsive auto-collapse.

### `§5.3-L189.A3` — **UNCOVERED**

> **Spec v27, verbatim:** *"grouping with the date controls."*

§5.3 Panel collapse is new in Confluence v27 (2026-08-07). No case in the suite covers the panel toggle. The five cases that mention collapsing are about other controls: C29929 department header, C29934 mini-calendar chevron, C29984 spread preview, C29998 lane overflow, C30086 responsive auto-collapse.

### `§5.3-L190.A1` — **UNCOVERED**

> **Spec v27, verbatim:** *"Control. A borderless panel-left icon in secondary text color."*

§5.3 Panel collapse is new in Confluence v27 (2026-08-07). No case in the suite covers the panel toggle. The five cases that mention collapsing are about other controls: C29929 department header, C29934 mini-calendar chevron, C29984 spread preview, C29998 lane overflow, C30086 responsive auto-collapse.

### `§5.3-L190.A2` — **UNCOVERED**

> **Spec v27, verbatim:** *"The icon does not change between states"*

§5.3 Panel collapse is new in Confluence v27 (2026-08-07). No case in the suite covers the panel toggle. The five cases that mention collapsing are about other controls: C29929 department header, C29934 mini-calendar chevron, C29984 spread preview, C29998 lane overflow, C30086 responsive auto-collapse.

### `§5.3-L190.A3` — **UNCOVERED**

> **Spec v27, verbatim:** *"the tooltip carries the meaning — "Hide panel" when open, "Show panel" when collapsed."*

§5.3 Panel collapse is new in Confluence v27 (2026-08-07). No case in the suite covers the panel toggle. The five cases that mention collapsing are about other controls: C29929 department header, C29934 mini-calendar chevron, C29984 spread preview, C29998 lane overflow, C30086 responsive auto-collapse.

### `§5.3-L191.A1` — **UNCOVERED**

> **Spec v27, verbatim:** *"Behavior. The panel animates closed over a short width transition, its divider disappears so no seam remains"*

§5.3 Panel collapse is new in Confluence v27 (2026-08-07). No case in the suite covers the panel toggle. The five cases that mention collapsing are about other controls: C29929 department header, C29934 mini-calendar chevron, C29984 spread preview, C29998 lane overflow, C30086 responsive auto-collapse.

### `§5.3-L191.A2` — **UNCOVERED**

> **Spec v27, verbatim:** *"the grid reflows into the reclaimed space."*

§5.3 Panel collapse is new in Confluence v27 (2026-08-07). No case in the suite covers the panel toggle. The five cases that mention collapsing are about other controls: C29929 department header, C29934 mini-calendar chevron, C29984 spread preview, C29998 lane overflow, C30086 responsive auto-collapse.

### `§5.3-L192.A1` — **UNCOVERED**

> **Spec v27, verbatim:** *"State preservation. Contents are hidden rather than discarded."*

§5.3 Panel collapse is new in Confluence v27 (2026-08-07). No case in the suite covers the panel toggle. The five cases that mention collapsing are about other controls: C29929 department header, C29934 mini-calendar chevron, C29984 spread preview, C29998 lane overflow, C30086 responsive auto-collapse.

### `§5.3-L192.A2` — **UNCOVERED**

> **Spec v27, verbatim:** *"Calendar date, work-order scroll position, panel search text, drill-down state"*

§5.3 Panel collapse is new in Confluence v27 (2026-08-07). No case in the suite covers the panel toggle. The five cases that mention collapsing are about other controls: C29929 department header, C29934 mini-calendar chevron, C29984 spread preview, C29998 lane overflow, C30086 responsive auto-collapse.

### `§5.3-L192.A3` — **UNCOVERED**

> **Spec v27, verbatim:** *"the selected work order all survive a collapse/expand cycle"*

§5.3 Panel collapse is new in Confluence v27 (2026-08-07). No case in the suite covers the panel toggle. The five cases that mention collapsing are about other controls: C29929 department header, C29934 mini-calendar chevron, C29984 spread preview, C29998 lane overflow, C30086 responsive auto-collapse.

### `§5.3-L192.A4` — **UNCOVERED**

> **Spec v27, verbatim:** *"reopening returns to whichever panel mode was active."*

§5.3 Panel collapse is new in Confluence v27 (2026-08-07). No case in the suite covers the panel toggle. The five cases that mention collapsing are about other controls: C29929 department header, C29934 mini-calendar chevron, C29984 spread preview, C29998 lane overflow, C30086 responsive auto-collapse.

### `§5.3-L193.A1` — **UNCOVERED**

> **Spec v27, verbatim:** *"Narrow viewports. Below the 960px minimum supported width (§11) the panel auto-collapses."*

§5.3 Panel collapse is new in Confluence v27 (2026-08-07). No case in the suite covers the panel toggle. The five cases that mention collapsing are about other controls: C29929 department header, C29934 mini-calendar chevron, C29984 spread preview, C29998 lane overflow, C30086 responsive auto-collapse.

### `§5.3-L193.A2` — **UNCOVERED**

> **Spec v27, verbatim:** *"The toggle still works, so the user can expand it manually at any width"*

§5.3 Panel collapse is new in Confluence v27 (2026-08-07). No case in the suite covers the panel toggle. The five cases that mention collapsing are about other controls: C29929 department header, C29934 mini-calendar chevron, C29984 spread preview, C29998 lane overflow, C30086 responsive auto-collapse.

### `§5.3-L193.A3` — **UNCOVERED**

> **Spec v27, verbatim:** *"that manual choice holds until the next resize across the breakpoint."*

§5.3 Panel collapse is new in Confluence v27 (2026-08-07). No case in the suite covers the panel toggle. The five cases that mention collapsing are about other controls: C29929 department header, C29934 mini-calendar chevron, C29984 spread preview, C29998 lane overflow, C30086 responsive auto-collapse.

### `§5.3-L194.A1` — **UNCOVERED**

> **Spec v27, verbatim:** *"Popovers and modals. Anything that positions itself clear of the panel falls back to a normal viewport margin while the panel is collapsed."*

§5.3 Panel collapse is new in Confluence v27 (2026-08-07). No case in the suite covers the panel toggle. The five cases that mention collapsing are about other controls: C29929 department header, C29934 mini-calendar chevron, C29984 spread preview, C29998 lane overflow, C30086 responsive auto-collapse.

### `§5.3-L195.A1` — **UNCOVERED**

> **Spec v27, verbatim:** *"Persistence. Not persisted in the prototype."*

§5.3 Panel collapse is new in Confluence v27 (2026-08-07). No case in the suite covers the panel toggle. The five cases that mention collapsing are about other controls: C29929 department header, C29934 mini-calendar chevron, C29984 spread preview, C29998 lane overflow, C30086 responsive auto-collapse.

### `§5.3-L195.A2` — **UNCOVERED**

> **Spec v27, verbatim:** *"Session-scoped per user for build — this is a working-mode preference, not a saved view."*

§5.3 Panel collapse is new in Confluence v27 (2026-08-07). No case in the suite covers the panel toggle. The five cases that mention collapsing are about other controls: C29929 department header, C29934 mini-calendar chevron, C29984 spread preview, C29998 lane overflow, C30086 responsive auto-collapse.

### `§6-L200.A1` — **UNCOVERED**

> **Spec v27, verbatim:** *"Collapses and expands the left work order panel (§5.3)."*

**Nearest case:** **SCH-TOOL-03 = [C30041](https://shopview.testrail.io/index.php?/cases/view/30041)**

> **Its own text, verbatim:** *"Clear, then search a work order number, a unit number, a technician name, and a line name in turn."*

The toolbar's new 'Panel toggle' row, new in v27. C30039/C30040/C30041/C30042/C30046 cover the other toolbar controls one by one; none covers this one.

### `§11-L301.A6` — **PARTIAL**

> **Spec v27, verbatim:** *"the overflow uses shape)."*

UNCOVERED PART: that the '+N more' overflow is conveyed by SHAPE rather than colour alone. C29998 asserts the affordance exists and opens a popover; C38866 asserts conflict and overtime cues are not colour-only. Neither asserts it of the overflow.

### `§11-L303.A1` — **PARTIAL**

> **Spec v27, verbatim:** *"Dark theme. The Schedule supports a user-selectable Light / Dark theme, chosen from the user menu and persisted per user."*

**Nearest case:** **SCH-EDGE-08 = [C38866](https://shopview.testrail.io/index.php?/cases/view/38866)**

> **Its own text, verbatim:** *"Every dialog and popover opened from the Schedule follows the dark theme too."*

C38866 covers the dark theme rendering and switching back to light. UNCOVERED PART: that the theme is chosen FROM THE USER MENU, and that it is PERSISTED PER USER. The case's own refs claim the persistence ('persisted per user') but its steps never sign out and back in, so the case asserts less than its own reference says it does.

### `§11-L303.A4` — **PARTIAL**

> **Spec v27, verbatim:** *"elevation/shadow tokens also swap so depth reads correctly on dark surfaces."*

**Nearest case:** **SCH-EDGE-08 = [C38866](https://shopview.testrail.io/index.php?/cases/view/38866)**

> **Its own text, verbatim:** *"Schedule and all its dialogs display correctly in dark mode"*

UNCOVERED PART: that elevation/shadow tokens swap so depth still reads correctly on dark surfaces. C38866 asserts readability (no white-on-white) but says nothing about depth. Low value, and it is named rather than absorbed into the readability assertion.

### `§12-L307.A1` — **BLOCKED**

> **Spec v27, verbatim:** *"Shop closures (holidays, inventory days) are defined at the shop level and block the spread step from placing shifts on those days."*

**Nearest case:** **SCH-EDGE-05 = [C30089](https://shopview.testrail.io/index.php?/cases/view/30089)**

> **Its own text, verbatim:** *"Shop closures do NOT block spread in V1 - shifts can land on closure days"*

THE SPECIFICATION CONTRADICTS ITSELF AND THE QUESTION HAS NEVER BEEN SENT. §12 says closures 'block the spread step from placing shifts on those days'; §4.5 says 'Shop closures and public holidays are not skipped in V1'. Our two cases follow §4.5 and carry a Rule-56 divergence sentence plus AUTOMATION: HOLD - C30089 says in its own marker 'waiting on the product owner's answer, and the shop-closure setting does not exist in the build', C29983 says 'the question has not been sent yet'. Owner: Branko. The blocker is us, not him.

---

## DIRECTION 1 — the full table, all 397 assertions

Every COVERED row shows the requirement text and the covering case's own text side by side (Rule 45(e)).


### §1.2 Goals

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§1.2-L21.A1` | *"Reduce scheduling errors (double-bookings, weekend assignments, after-hours shifts) to near zero with automatic conflict detection."* | NOT-INDEPENDENTLY-TESTABLE | — | A goal statement ('reduce scheduling errors to near zero'), not a behaviour a test can assert. The conflict detection behind it is covered by C30023/C |
| `§1.2-L22.A1` | *"Give managers a single screen to see the full week's technician allocation at a glance."* | NOT-INDEPENDENTLY-TESTABLE | — | A goal statement. The week view behind it is covered by C29927. |
| `§1.2-L23.A1` | *"Support multi-day "spread" scheduling for large jobs (engine rebuilds, frame work) that span 40 to 160+ hours across days and weeks."* | NOT-INDEPENDENTLY-TESTABLE | — | A goal statement. The spread behind it is covered by the SCH-SPREAD family, C29977-C29986. |
| `§1.2-L24.A1` | *"Keep the work order roster in sync, so scheduling a technician on the schedule automatically adds them to the line's labor roster."* | NOT-INDEPENDENTLY-TESTABLE | — | A goal statement - but note it IS asserted: C29961 says 'The technician now appears on that line's labor roster - the schedule and the work order stay |

### §3 Information architecture

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§3-L42.A1` | *"The Schedule lives as a top-level nav item alongside Work Orders, Customers, Parts, and Reports."* | COVERED | **SCH-NAV-01 = [C29925](https://shopview.testrail.io/index.php?/cases/view/29925)** | *"Schedule is listed as a top-level navigation item alongside Work Orders, Customers, Parts, and Reports."* |
| `§3-L42.A2` | *"The screen is split into two regions."* | COVERED | **SCH-NAV-01 = [C29925](https://shopview.testrail.io/index.php?/cases/view/29925)** | *"Look at the two regions of the Schedule screen."* |

### §3.1 Left panel: work order sidebar

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§3.1-L44.A1` | *"The panel can be collapsed and expanded from the grid toolbar (§5.3), handing its width to the grid without losing panel state."* | UNCOVERED | — | **no case asserts this** |
| `§3.1-L45.A1` | *"Mini calendar. A month picker with week-highlight and a collapsible grid."* | COVERED | **SCH-MCAL-01 = [C29932](https://shopview.testrail.io/index.php?/cases/view/29932)** | *"In the mini calendar, click a date in a different week from the one currently shown in the grid."* |
| `§3.1-L45.A2` | *"Clicking a date navigates the main grid."* | COVERED | **SCH-MCAL-01 = [C29932](https://shopview.testrail.io/index.php?/cases/view/29932)** | *"Clicking a date in the mini calendar navigates the main grid to that date"* |
| `§3.1-L46.A1` | *"Work order list. A flat, scrollable list of work order cards."* | COVERED | **SCH-WOL-01 = [C29936](https://shopview.testrail.io/index.php?/cases/view/29936)** | *"The sidebar is a flat list of work order cards with no tabs"* |
| `§3.1-L46.A2` | *"Searchable and filterable (see §5)."* | NOT-INDEPENDENTLY-TESTABLE | — | 'Searchable and filterable (see §5).' - a pointer to §5, whose own requirements are covered by C29942/C29946/C29947/C29939/C29953. |
| `§3.1-L46.A3` | *"There are no Assigned/Unassigned tabs; assignment is a filter."* | COVERED | **SCH-WOL-01 = [C29936](https://shopview.testrail.io/index.php?/cases/view/29936)** | *"There are no Assigned/Unassigned tabs - assignment is available only as a filter behind the 'Filter' button."* |
| `§3.1-L47.A1` | *"Line drill-down. Clicking a work order replaces the list, in place, with that order's lines."* | COVERED | **SCH-LINE-01 = [C29948](https://shopview.testrail.io/index.php?/cases/view/29948)** | *"Work order card opens the line drill-down in place, with header and back control"* |
| `§3.1-L47.A2` | *"Only approved work order lines are visible in the schedule sidebar"* | COVERED | **SCH-LINE-06 = [C29953](https://shopview.testrail.io/index.php?/cases/view/29953)** | *"A work order exists with several approved lines with distinct titles."* |
| `§3.1-L47.A3` | *"unapproved lines do not appear."* | COVERED | **SCH-LINE-05 = [C29952](https://shopview.testrail.io/index.php?/cases/view/29952)** | *"Lines with no technician assigned show a 'Needs techs' badge"* |
| `§3.1-L47.A4` | *"Includes a back control, the WO id plus line count, a line search box, and "All / Unscheduled" filter chips with counts."* | COVERED | **SCH-LINE-07 = [C29954](https://shopview.testrail.io/index.php?/cases/view/29954)** | *"'All / Unscheduled' filter chips show counts and filter the line list"* |
| `§3.1-L47.A5` | *"Each line row is independently draggable (drag handle) and shows its title, estimated hours"* | COVERED | **SCH-LINE-04 = [C29951](https://shopview.testrail.io/index.php?/cases/view/29951)** | *"Line row shows title, hours, the technician roster and a drag handle"* |
| `§3.1-L47.A6` | *"current technician roster (avatar stack plus count, with no cap)."* | COVERED | **SCH-LINE-04 = [C29951](https://shopview.testrail.io/index.php?/cases/view/29951)** | *"The current technician roster is shown as an avatar stack plus a count; there is no cap on how many technicians a line can have."* |
| `§3.1-L47.A7` | *"Lines with no technician assigned show a "Needs techs" badge so the manager can see at a glance which lines still require someone."* | COVERED | **SCH-LINE-05 = [C29952](https://shopview.testrail.io/index.php?/cases/view/29952)** | *"Lines with no technician assigned show a 'Needs techs' badge"* |
| `§3.1-L48.A1` | *"Work order card anatomy. Each card shows, from top to bottom: WO number (in accent color, top left) and line count plus hours estimate (top right); customer name (bold); unit number"* | COVERED | **SCH-WOL-02 = [C29937](https://shopview.testrail.io/index.php?/cases/view/29937)** | *"Top left: the work order number, shown in an accent color."* |
| `§3.1-L48.A2` | *"and a lead technician row (avatar plus name)."* | COVERED | **SCH-WOL-02 = [C29937](https://shopview.testrail.io/index.php?/cases/view/29937)** | *"A lead technician row with the technician's avatar and name."* |
| `§3.1-L48.A3` | *"A colored left border indicates the work order's status."* | COVERED | **SCH-WOL-02 = [C29937](https://shopview.testrail.io/index.php?/cases/view/29937)** | *"Work order card anatomy, incl. the status-colored left border"* |
| `§3.1-L48.A4` | *"All of these fields are visible on the card and are matched by the sidebar search."* | COVERED | **SCH-WOL-05 = [C29940](https://shopview.testrail.io/index.php?/cases/view/29940)** | *"Sidebar search filters the card list in real time as you type"* |
| `§3.1-L49.A1` | *"Sidebar search ("Search work orders") matches against: WO number, customer name, unit number, and technician name."* | COVERED | **SCH-WOL-04 = [C29939](https://shopview.testrail.io/index.php?/cases/view/29939)** | *"'Search work orders' matches work order number, customer, unit, and technician"* |
| `§3.1-L49.A2` | *"It filters the card list in real time as the user types."* | COVERED | **SCH-WOL-05 = [C29940](https://shopview.testrail.io/index.php?/cases/view/29940)** | *"Sidebar search filters the card list in real time as you type"* |
| `§3.1-L50.A1` | *"Line search ("Search lines"), visible in the drill-down, matches against line title/name only (the list is already scoped to one work order, so customer/unit/WO fields would be redundant)."* | COVERED | **SCH-LINE-06 = [C29953](https://shopview.testrail.io/index.php?/cases/view/29953)** | *"Typing the customer name returns no results - the line search matches line titles only (the list is already scoped to one work order, so customer/unit/WO fields are not searched)."* |

### §3.2 Main area: schedule grid

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§3.2-L52.A1` | *"Day view. A 24-hour timeline per technician row with time-positioned blocks."* | COVERED | **SCH-NAV-03 = [C29927](https://shopview.testrail.io/index.php?/cases/view/29927)** | *"Day: the grid shows a 24-hour timeline per technician row, with shifts positioned at their times."* |
| `§3.2-L53.A1` | *"Week view. A 7-column grid Mon to Sun (Saturday and Sunday each toggleable) with stacked shift chips per cell."* | COVERED | **SCH-NAV-03 = [C29927](https://shopview.testrail.io/index.php?/cases/view/29927)** | *"Week: the grid shows a 7-column Monday-to-Sunday layout with stacked shift chips per cell."* |
| `§3.2-L54.A1` | *"Month view. A compact calendar with per-day capacity bars and shift chips."* | COVERED | **SCH-NAV-03 = [C29927](https://shopview.testrail.io/index.php?/cases/view/29927)** | *"Month: the grid shows a compact calendar with per-day capacity bars and shift chips."* |
| `§3.2-L55.A1` | *"Grid grouping. Rows are grouped by department under collapsible group headers (e.g. SERVICE/PARTS, ADMINISTRATION), with the department's technicians listed beneath each header."* | COVERED | **SCH-NAV-04 = [C29928](https://shopview.testrail.io/index.php?/cases/view/29928)** | *"Grid rows are grouped by department under group headers"* |
| `§3.2-L55.A2` | *"This is the only grid grouping"* | COVERED | **SCH-NAV-06 = [C29930](https://shopview.testrail.io/index.php?/cases/view/29930)** | *"No Tech/Dept toggle - department grouping is the only grid grouping"* |
| `§3.2-L55.A3` | *"because the department view already lists technicians, there is no separate technician-only view or Tech/Dept toggle."* | COVERED | **SCH-NAV-06 = [C29930](https://shopview.testrail.io/index.php?/cases/view/29930)** | *"No Tech/Dept toggle - department grouping is the only grid grouping"* |
| `§3.2-L56.A1` | *"Unassigned placeholder. An unassigned row sits within the grid (not a separate tray) and holds shifts that are not yet tied to a technician."* | COVERED | **SCH-NAV-07 = [C29931](https://shopview.testrail.io/index.php?/cases/view/29931)** | *"An Unassigned row sits inside the grid, not in a separate tray"* |
| `§3.2-L56.A2` | *"Dragging a shift from this row down onto a technician assigns it."* | COVERED | **SCH-START-07 = [C29975](https://shopview.testrail.io/index.php?/cases/view/29975)** | *"Dragging an unassigned shift onto a technician row assigns it"* |
| `§3.2-L56.A3` | *"Unassigned shifts use the same three-line block anatomy as regular shifts (see §4.4)"* | COVERED | **SCH-NAV-07 = [C29931](https://shopview.testrail.io/index.php?/cases/view/29931)** | *"The unassigned shift uses the same block layout as regular shifts (customer, unit, line name / line count) - it simply has no technician."* |
| `§3.2-L56.A4` | *"they simply have no technician yet (see §4.2)."* | COVERED | **SCH-NAV-07 = [C29931](https://shopview.testrail.io/index.php?/cases/view/29931)** | *"The unassigned shift uses the same block layout as regular shifts (customer, unit, line name / line count) - it simply has no technician."* |

### §4.1 Drag-and-drop scheduling

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§4.1-L59.A1` | *"The primary interaction model."* | NOT-INDEPENDENTLY-TESTABLE | — | 'The primary interaction model.' - a framing sentence introducing the drag-and-drop table. |
| `§4.1-L59.A2` | *"Users drag a work order card (or an individual line) from the sidebar and drop it onto a technician x day/time cell in the grid."* | COVERED | **SCH-DND-04 = [C29958](https://shopview.testrail.io/index.php?/cases/view/29958)** | *"Drag the work order (or the large line) onto a technician's cell."* |
| `§4.1-L62.A1` | *"Single-line work order"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§4.1-L63.A1` | *"Creates a shift immediately, skipping the scope picker."* | COVERED | **SCH-DND-01 = [C29955](https://shopview.testrail.io/index.php?/cases/view/29955)** | *"Dropping a single-line work order creates a shift with no scope picker"* |
| `§4.1-L64.A1` | *"Multi-line work order"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§4.1-L65.A1` | *"Opens the scope picker to choose whole order, a single line, or several lines."* | COVERED | **SCH-DND-09 = [C43555](https://shopview.testrail.io/index.php?/cases/view/43555)** | *"Releasing on the day box books the work order onto that day, exactly as dropping it does in Week view: because this work order has more than one line, the scope picker opens so you can choose the whole order, one line, or several lines."* |
| `§4.1-L66.A1` | *"Specific line drag"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§4.1-L67.A1` | *"Dragging a line from the drill-down creates a single-line shift directly."* | COVERED | **SCH-DND-03 = [C29957](https://shopview.testrail.io/index.php?/cases/view/29957)** | *"Dragging a line from the drill-down creates a single-line shift"* |
| `§4.1-L68.A1` | *"Large job (exceeds the tech's daily hours)"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§4.1-L69.A1` | *"After scope is chosen, opens the spread step to distribute hours across consecutive working days."* | COVERED | **SCH-DND-04 = [C29958](https://shopview.testrail.io/index.php?/cases/view/29958)** | *"The spread step opens (step 2 of the same modal) to distribute the hours across consecutive working days."* |
| `§4.1-L70.A1` | *"The spread step is conditional: a scope that fits within one of the technician's working days skips it and creates a single shift."* | COVERED | **SCH-DND-05 = [C29959](https://shopview.testrail.io/index.php?/cases/view/29959)** | *"A scope that fits one working day skips the spread step"* |

### §4.2 Shift start times and unassigned shifts

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§4.2-L72.A1` | *"Every shift has a start time."* | COVERED | **SCH-HRS-04 = [C38849](https://shopview.testrail.io/index.php?/cases/view/38849)** | *"Schedule a shift for that technician and check start-time defaults / before-after-hours conflicts against the shop business hours."* |
| `§4.2-L72.A2` | *"It is derived from a hierarchy:"* | NOT-INDEPENDENTLY-TESTABLE | — | 'It is derived from a hierarchy:' - introduces the three numbered hierarchy rules, each verdicted on its own row. |
| `§4.2-L73.A1` | *"The technician's configured working hours take precedence."* | COVERED | **SCH-CONF-03 = [C30025](https://shopview.testrail.io/index.php?/cases/view/30025)** | *"The shift is flagged as a before-hours conflict, with a reason sentence in the spirit of 'Starts before working hours', measured against that technician's own configured working-day START time (not a fixed hour)."* |
| `§4.2-L74.A1` | *"If those are not set, the shop's business hours are used."* | COVERED | **SCH-HRS-04 = [C38849](https://shopview.testrail.io/index.php?/cases/view/38849)** | *"The shop has business hours set for the shop."* |
| `§4.2-L75.A1` | *"If neither is set, a general default of 7:00 AM to 7:00 PM applies."* | COVERED | **SCH-START-03 = [C29971](https://shopview.testrail.io/index.php?/cases/view/29971)** | *"With neither technician hours nor business hours set, a 7:00 AM default applies"* |
| `§4.2-L76.A1` | *"In day view, the start time instead comes from where the shift is dropped on the timeline."* | COVERED | **SCH-DND-09 = [C43555](https://shopview.testrail.io/index.php?/cases/view/43555)** | *"After you confirm a scope, a shift appears in that day box, and its start time comes from the usual order of preference - the technician's own working hours first, otherwise the shop's business hours, otherwise 7:00 AM."* |
| `§4.2-L77.A1` | *"Unassigned shifts are created by dropping a work order (or line) onto the grid's Unassigned placeholder row (an in-grid lane, not a separate tray)."* | COVERED | **SCH-NAV-07 = [C29931](https://shopview.testrail.io/index.php?/cases/view/29931)** | *"An unassigned row/lane appears within the grid itself - it is not a separate tray or panel outside the grid."* |
| `§4.2-L77.A2` | *"They follow the same start-time rules except technician hours (there is no technician yet), so they fall back to business hours or the default."* | COVERED | **SCH-CONF-03 = [C30025](https://shopview.testrail.io/index.php?/cases/view/30025)** | *"Both the start and the end follow the hierarchy technician hours, then shop business hours, then the general default working day of 7:00 AM to 7:00 PM."* |
| `§4.2-L77.A3` | *"When an unassigned shift is later dragged onto a technician row in the grid, that technician's hours apply."* | COVERED | **SCH-START-05 = [C29973](https://shopview.testrail.io/index.php?/cases/view/29973)** | *"Dropping onto the Unassigned row creates a shift with no technician"* |
| `§4.2-L78.A1` | *"Hours settings (tech and business hours)."* | COVERED | **SCH-START-01 = [C29969](https://shopview.testrail.io/index.php?/cases/view/29969)** | *"A technician has configured working hours that DIFFER from the shop's business hours (for example tech 6:00 AM start vs shop 8:00 AM) - set this up first and restore after."* |
| `§4.2-L78.A2` | *"Working hours are defined in two places: a technician's custom schedule in Edit Staff Member"* | COVERED | **SCH-HRS-03 = [C38848](https://shopview.testrail.io/index.php?/cases/view/38848)** | *"Edit Staff Member shows a toggle labelled 'Set custom hours for this technician'."* |
| `§4.2-L78.A3` | *"the shop's business hours in Edit Location."* | COVERED | **SCH-HRS-02 = [C38847](https://shopview.testrail.io/index.php?/cases/view/38847)** | *"Edit Location shows a toggle labelled 'Set business hours for this shop', and it is OFF by default (no business hours set)."* |
| `§4.2-L78.A4` | *"Both use the same pattern:"* | NOT-INDEPENDENTLY-TESTABLE | — | 'Both use the same pattern:' - introduces the three bullets below it, each verdicted on its own row. |
| `§4.2-L79.A1` | *"Behind a toggle, off by default."* | COVERED | **SCH-HRS-03 = [C38848](https://shopview.testrail.io/index.php?/cases/view/38848)** | *"Edit Staff has a 'Set custom hours for this technician' toggle, off by default"* |
| `§4.2-L79.A2` | *"Each section sits behind a toggle ("Set custom hours for this technician" / "Set business hours for this shop")."* | COVERED | **SCH-HRS-03 = [C38848](https://shopview.testrail.io/index.php?/cases/view/38848)** | *"Edit Staff has a 'Set custom hours for this technician' toggle, off by default"* |
| `§4.2-L79.A3` | *"The per-day editor appears only when the toggle is on."* | COVERED | **SCH-HRS-02 = [C38847](https://shopview.testrail.io/index.php?/cases/view/38847)** | *"Business-hours toggle reveals a per-day (Mon-Sun) From-To editor"* |
| `§4.2-L79.A4` | *"A technician with no custom hours inherits the shop's business hours (per the hierarchy above)."* | COVERED | **SCH-HRS-04 = [C38849](https://shopview.testrail.io/index.php?/cases/view/38849)** | *"A technician with no custom hours inherits the shop business hours"* |
| `§4.2-L80.A1` | *"Per-day editor. One row per day (Mon–Sun): day name, with From → To ranges on the right."* | COVERED | **SCH-HRS-06 = [C38851](https://shopview.testrail.io/index.php?/cases/view/38851)** | *"You are in the per-day working-hours editor with at least two ranges on one day."* |
| `§4.2-L80.A2` | *"Each day starts with a single range"* | COVERED | **SCH-HRS-05 = [C38850](https://shopview.testrail.io/index.php?/cases/view/38850)** | *"You are in the per-day working-hours editor (location or technician) with a day's first range set."* |
| `§4.2-L80.A3` | *""Add hours" appends more to support split shifts, each removable."* | COVERED | **SCH-HRS-05 = [C38850](https://shopview.testrail.io/index.php?/cases/view/38850)** | *"'Add hours' appends a removable second range for split shifts, starting empty"* |
| `§4.2-L80.A4` | *"Added ranges start empty so the user explicitly sets the times."* | COVERED | **SCH-HRS-05 = [C38850](https://shopview.testrail.io/index.php?/cases/view/38850)** | *"The added range starts empty (no From/To pre-filled)."* |
| `§4.2-L81.A1` | *"Overlap validation. If a day's ranges overlap, the offending range is flagged in red with an inline message ("These hours overlap."* | COVERED | **SCH-HRS-06 = [C38851](https://shopview.testrail.io/index.php?/cases/view/38851)** | *"The offending (overlapping) range is flagged in red."* |
| `§4.2-L81.A2` | *"Adjust the times so they don't conflict.") and Save is disabled until it is resolved."* | COVERED | **SCH-HRS-06 = [C38851](https://shopview.testrail.io/index.php?/cases/view/38851)** | *"An inline message reads 'These hours overlap. Adjust the times so they don't conflict.'"* |
| `§4.2-L81.A3` | *"Incomplete rows (empty From/To) are ignored by the check."* | COVERED | **SCH-HRS-06 = [C38851](https://shopview.testrail.io/index.php?/cases/view/38851)** | *"The incomplete row (empty From/To) is ignored by the overlap check - it does not raise the overlap error."* |

### §4.3 Scope picker

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§4.3-L83.A1` | *"When a multi-line work order is dropped, a popover anchored to the drop cell lets the manager choose what to schedule:"* | NOT-INDEPENDENTLY-TESTABLE | — | Introduces the scope picker's three options, each verdicted on its own row. |
| `§4.3-L84.A1` | *""Schedule whole work order" is pinned at the top, visually distinct"* | COVERED | **SCH-SCOPE-01 = [C29963](https://shopview.testrail.io/index.php?/cases/view/29963)** | *"The 'Schedule whole work order' option sits pinned at the top of the picker and looks visually distinct from the line rows."* |
| `§4.3-L84.A2` | *"labeled with the line count and total hours."* | COVERED | **SCH-SCOPE-01 = [C29963](https://shopview.testrail.io/index.php?/cases/view/29963)** | *"It is labeled with the order's line count and total hours (matching the sum of the approved lines)."* |
| `§4.3-L84.A3` | *"It assigns the technician to all lines and creates one whole-order shift."* | COVERED | **SCH-SCOPE-02 = [C29964](https://shopview.testrail.io/index.php?/cases/view/29964)** | *"'Schedule whole work order' assigns all lines and creates one shift"* |
| `§4.3-L85.A1` | *"Individual line rows. Tapping a row is the fast path: it immediately creates a single-line shift with no confirmation step."* | COVERED | **SCH-SCOPE-03 = [C29965](https://shopview.testrail.io/index.php?/cases/view/29965)** | *"Tapping a line row creates a single-line shift with no confirm step"* |
| `§4.3-L85.A2` | *"Each row shows the line title, estimated hours"* | COVERED | **SCH-SCOPE-01 = [C29963](https://shopview.testrail.io/index.php?/cases/view/29963)** | *"Each line row shows the line title and its estimated hours."* |
| `§4.3-L85.A3` | *"current technician roster (avatar stack plus count)."* | COVERED | **SCH-SCOPE-01 = [C29963](https://shopview.testrail.io/index.php?/cases/view/29963)** | *"Rows for lines that already have technicians show the current roster as an avatar stack plus count."* |
| `§4.3-L86.A1` | *""Select multiple" is an opt-in control that switches the line rows into checkboxes and shows a confirm bar with a running tally ("Create shift · 2 lines · 6h"), a "Select all" shortcut (equivalent to whole order), and Cancel (returns to the fast single-tap list)."* | COVERED | **SCH-DND-02 = [C29956](https://shopview.testrail.io/index.php?/cases/view/29956)** | *"It offers 'Schedule whole work order' at the top, the individual line rows beneath, and a 'Select multiple' control."* |
| `§4.3-L87.A1` | *"There is no technician cap and no swap flow."* | COVERED | **SCH-DND-07 = [C29961](https://shopview.testrail.io/index.php?/cases/view/29961)** | *"Nothing asks you to swap or replace the technician who was already there, and no limit is reached on how many technicians a line can have."* |
| `§4.3-L87.A2` | *"Scheduling a technician onto a line simply adds them to that line's roster."* | COVERED | **SCH-DND-07 = [C29961](https://shopview.testrail.io/index.php?/cases/view/29961)** | *"Scheduling a technician onto a line adds them to its labor roster"* |

### §4.4 Shift block anatomy and scope labeling

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§4.4-L89.A1` | *"Every shift block on the grid shows three lines of text (four when VIN is toggled on), with a default blue color (users can optionally assign a custom color per shift via the color picker in the detail modal, see §10):"* | NOT-INDEPENDENTLY-TESTABLE | — | Introduces the block's line-by-line anatomy; the three lines, the VIN line and the default blue are each verdicted on their own rows (C29991, C30045,  |
| `§4.4-L90.A1` | *"Line 1: customer name, plus the conflict icon if the shift is conflicted."* | COVERED | **SCH-BLOCK-01 = [C29991](https://shopview.testrail.io/index.php?/cases/view/29991)** | *"A single-line shift block shows customer, unit number and line name"* |
| `§4.4-L91.A1` | *"Line 2: unit number."* | COVERED | **SCH-BLOCK-01 = [C29991](https://shopview.testrail.io/index.php?/cases/view/29991)** | *"A single-line shift block shows customer, unit number and line name"* |
| `§4.4-L92.A1` | *"Line 3 (optional): VIN number, visible only when the VIN toggle is on in Filter and Display (§6)."* | COVERED | **SCH-VIEW-04 = [C30045](https://shopview.testrail.io/index.php?/cases/view/30045)** | *"Turn 'VIN Number' ON in 'Filter and Display'."* |
| `§4.4-L92.A2` | *"Shown in day and week views only"* | COVERED | **SCH-VIEW-04 = [C30045](https://shopview.testrail.io/index.php?/cases/view/30045)** | *"'VIN Number' on: the VIN appears as an additional line on blocks in day and week views."* |
| `§4.4-L92.A3` | *"month view omits it due to space constraints."* | COVERED | **SCH-VIEW-04 = [C30045](https://shopview.testrail.io/index.php?/cases/view/30045)** | *"Month view blocks never show the VIN, even with the toggle on (space constraints)."* |
| `§4.4-L93.A1` | *"Last line: the line name for a single-line shift, or "N Lines" when the shift covers more than one line."* | COVERED | **SCH-BLOCK-01 = [C29991](https://shopview.testrail.io/index.php?/cases/view/29991)** | *"A single-line shift block shows customer, unit number and line name"* |
| `§4.4-L94.A1` | *"There is no work order number and no scope icons on the block"* | COVERED | **SCH-BLOCK-05 = [C29995](https://shopview.testrail.io/index.php?/cases/view/29995)** | *"Inspect the unconflicted block for icons and a work order number."* |
| `§4.4-L94.A2` | *"the conflict icon is the only icon."* | COVERED | **SCH-BLOCK-05 = [C29995](https://shopview.testrail.io/index.php?/cases/view/29995)** | *"The conflict icon is the only icon on a shift block"* |
| `§4.4-L94.A3` | *"Whole-order and multi-line-subset shifts both read as "N Lines" on the block"* | COVERED | **SCH-BLOCK-02 = [C29992](https://shopview.testrail.io/index.php?/cases/view/29992)** | *"Whole-order and multi-line shifts both read 'N Lines' on the block"* |
| `§4.4-L94.A4` | *"the detail modal spells out the exact scope."* | COVERED | **SCH-BLOCK-02 = [C29992](https://shopview.testrail.io/index.php?/cases/view/29992)** | *"Open each shift's detail modal."* |

### §4.5 Multi-day spread scheduling

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§4.5-L96.A1` | *"For jobs exceeding a technician's daily capacity, the spread step distributes the work across consecutive working days."* | COVERED | **SCH-DND-04 = [C29958](https://shopview.testrail.io/index.php?/cases/view/29958)** | *"The spread step opens (step 2 of the same modal) to distribute the hours across consecutive working days."* |
| `§4.5-L96.A2` | *"It appears as step 2 of the same modal, with a header showing the chosen scope and a "Change scope" back-link."* | COVERED | **SCH-DND-04 = [C29958](https://shopview.testrail.io/index.php?/cases/view/29958)** | *"Its header shows the chosen scope and a 'Change scope' back-link."* |
| `§4.5-L97.A1` | *"How much to schedule is set by a single selector that defaults to Full estimate (the most common choice)."* | COVERED | **SCH-SPREAD-03 = [C29979](https://shopview.testrail.io/index.php?/cases/view/29979)** | *"How-much selector defaults to Full estimate; preset amounts apply at once"* |
| `§4.5-L97.A2` | *"Most options apply on selection with no extra fields"* | COVERED | **SCH-SPREAD-03 = [C29979](https://shopview.testrail.io/index.php?/cases/view/29979)** | *"'Full estimate', '1 week', and '2 weeks' apply on selection with no extra fields - the modal stays to one line for these."* |
| `§4.5-L97.A3` | *"only the custom ones reveal a control:Full estimate, 1 week, and 2 weeks apply immediately with nothing to fill in."* | COVERED | **SCH-SPREAD-03 = [C29979](https://shopview.testrail.io/index.php?/cases/view/29979)** | *"'Full estimate', '1 week', and '2 weeks' apply on selection with no extra fields - the modal stays to one line for these."* |
| `§4.5-L98.A1` | *"Until a date… reveals a single "finish by" date field."* | COVERED | **SCH-SPREAD-04 = [C29980](https://shopview.testrail.io/index.php?/cases/view/29980)** | *"'Until a date…' reveals a single finish-by date field"* |
| `§4.5-L99.A1` | *"Specific hours… reveals an hours stepper.This progressive disclosure (Google Calendar style) keeps the modal to one line in the common case and expands only for the custom options."* | COVERED | **SCH-SPREAD-05 = [C29981](https://shopview.testrail.io/index.php?/cases/view/29981)** | *"'Specific hours…' reveals an hours stepper"* |
| `§4.5-L100.A1` | *"Start date. Defaults to the earliest working day."* | COVERED | **SCH-SPREAD-06 = [C29982](https://shopview.testrail.io/index.php?/cases/view/29982)** | *"Start date defaults to the earliest working day and can be changed"* |
| `§4.5-L100.A2` | *"Adjusting it is how a second technician's series can be made sequential (starting after the first) rather than parallel."* | COVERED | **SCH-SPREAD-06 = [C29982](https://shopview.testrail.io/index.php?/cases/view/29982)** | *"It can be changed; technician B's series then starts after A's series ends (sequential, not parallel)."* |
| `§4.5-L101.A1` | *"Uses the technician's own working hours."* | COVERED | **SCH-DND-04 = [C29958](https://shopview.testrail.io/index.php?/cases/view/29958)** | *"A ZZAUTOTEST work order exists whose chosen scope's estimated hours EXCEED one working day of the target technician (for example a 40h line for a tech with 8h days)."* |
| `§4.5-L101.A2` | *"Automatically skips weekends when business hours are not set for them."* | COVERED | **SCH-SPREAD-07 = [C29983](https://shopview.testrail.io/index.php?/cases/view/29983)** | *"Weekends are skipped ONLY when the technician has no business hours set for them; if the tech has hours on a weekend day (e.g. Saturday hours) that day is NOT skipped."* |
| `§4.5-L101.A3` | *"Shop closures and public holidays are not skipped in V1.."* | COVERED | **SCH-SPREAD-07 = [C29983](https://shopview.testrail.io/index.php?/cases/view/29983)** | *"Shop closures and public holidays are NOT skipped in V1 - shifts can be placed on those days."* |
| `§4.5-L102.A1` | *"Preview, collapsed by default: a one-line summary ("20 shifts · Jun 15 to Jul 13 · skips weekends + 2 days"), expandable to a week-by-week breakdown with skipped days struck through and their reasons."* | COVERED | **SCH-SPREAD-08 = [C29984](https://shopview.testrail.io/index.php?/cases/view/29984)** | *"Collapsed: a one-line summary in the spirit of the spec's example '20 shifts · Jun 15 to Jul 13 · skips weekends + 2 days'."* |
| `§4.5-L103.A1` | *"Confirming creates a linked series of daily shifts."* | COVERED | **SCH-SPREAD-09 = [C29985](https://shopview.testrail.io/index.php?/cases/view/29985)** | *"Confirming the spread creates a linked series of daily shifts"* |
| `§4.5-L104.A1` | *"Each drop spreads the full estimate for that technician, independently."* | COVERED | **SCH-SPREAD-10 = [C29986](https://shopview.testrail.io/index.php?/cases/view/29986)** | *"The same work order on a second technician spreads the full estimate again"* |
| `§4.5-L104.A2` | *"Dropping the same work order on a second technician spreads the full estimate again for them."* | COVERED | **SCH-SPREAD-10 = [C29986](https://shopview.testrail.io/index.php?/cases/view/29986)** | *"The same work order on a second technician spreads the full estimate again"* |
| `§4.5-L104.A3` | *"There is no shared "remaining" counter across technicians and no splitting of a shift."* | COVERED | **SCH-SPREAD-10 = [C29986](https://shopview.testrail.io/index.php?/cases/view/29986)** | *"There is no shared 'remaining hours' counter across technicians and no splitting of a shift."* |
| `§4.5-L104.A4` | *"Because progress is driven by clocked-in time, scheduled hours, the estimate"* | COVERED | **SCH-SPREAD-10 = [C29986](https://shopview.testrail.io/index.php?/cases/view/29986)** | *"Planned hours across technicians may now exceed the estimate - this is expected and produces no error (progress is driven by clocked-in time)."* |
| `§4.5-L104.A5` | *"actual hours are three separate quantities and are not forced to reconcile."* | COVERED | **SCH-EDGE-06 = [C30090](https://shopview.testrail.io/index.php?/cases/view/30090)** | *"Scheduled, estimated and actual clocked hours are three separate numbers"* |

### §4.6 Linked series and banners

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§4.6-L106.A1` | *"A series is a group of shifts created by the spread step"* | COVERED | **SCH-SPREAD-09 = [C29985](https://shopview.testrail.io/index.php?/cases/view/29985)** | *"Confirming the spread creates a linked series of daily shifts"* |
| `§4.6-L106.A2` | *"all shifts in a series share a series id."* | COVERED | **SCH-SPREAD-09 = [C29985](https://shopview.testrail.io/index.php?/cases/view/29985)** | *"Confirming the spread creates a linked series of daily shifts"* |
| `§4.6-L106.A3` | *"The series is a render-time grouping, not a special record."* | NOT-INDEPENDENTLY-TESTABLE | — | Cross-reference to §8.2's render-time-grouping definition; the observable half is covered by C29990. |
| `§4.6-L106.A4` | *"Underneath it is N individual daily shifts, each keeping its own day and hours, so capacity, overtime"* | COVERED | **SCH-SER-04 = [C29990](https://shopview.testrail.io/index.php?/cases/view/29990)** | *"Each series day contributes its own daily hours to that day's capacity bar (the series is not counted as one lump)."* |
| `§4.6-L106.A5` | *"conflict logic all operate on the individual shifts unchanged."* | COVERED | **SCH-SER-04 = [C29990](https://shopview.testrail.io/index.php?/cases/view/29990)** | *"The overlapping day is flagged as a Double-booked conflict, exactly as it would be for standalone shifts."* |
| `§4.6-L107.A1` | *"Shifts sharing a technician plus series id render as one connected banner:"* | NOT-INDEPENDENTLY-TESTABLE | — | Introduces the three per-view banner bullets, each verdicted on its own row. |
| `§4.6-L108.A1` | *"Month view: a continuous bar wrapping across week rows, labeled once at the start (with the technician), with a faded "continues" label on later weeks, empty weekend columns (when business hours are not set for weekends)."* | COVERED | **SCH-SER-01 = [C29987](https://shopview.testrail.io/index.php?/cases/view/29987)** | *"It is labeled once at the start (including the technician); later weeks show a faded 'continues'-style label instead of repeating the full label."* |
| `§4.6-L109.A1` | *"Week view: one banner spanning the working days of that week in the technician's row, with chevrons at the edges indicating continuation beyond the visible week, a "week N of M" cue."* | COVERED | **SCH-SER-02 = [C29988](https://shopview.testrail.io/index.php?/cases/view/29988)** | *"One banner spans the working days of that week in the technician's row."* |
| `§4.6-L110.A1` | *"Day view: that day's single time-positioned block with a "part of an M-week job" cue (only one day is visible, so there is no spanning bar)."* | COVERED | **SCH-SER-03 = [C29989](https://shopview.testrail.io/index.php?/cases/view/29989)** | *"The day shows a single time-positioned block (no spanning bar - only one day is visible)."* |

### §4.7 Overlap and lane stacking

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§4.7-L112.A1` | *"Overlapping shifts for the same technician never visually collide:"* | NOT-INDEPENDENTLY-TESTABLE | — | 'Overlapping shifts for the same technician never visually collide:' - introduces the four lane bullets. |
| `§4.7-L113.A1` | *"Shifts whose time ranges do not intersect share a single lane, so sequential or back-to-back work keeps the row at normal height."* | COVERED | **SCH-LANE-02 = [C29997](https://shopview.testrail.io/index.php?/cases/view/29997)** | *"One technician has two shifts on the same day whose time ranges DO intersect (for example 9:00-12:00 and 10:00-13:00)."* |
| `§4.7-L114.A1` | *"Shifts whose time ranges do intersect split into stacked lanes, and the row grows to fit."* | COVERED | **SCH-LANE-02 = [C29997](https://shopview.testrail.io/index.php?/cases/view/29997)** | *"Shifts whose times intersect split into stacked lanes and the row grows to fit"* |
| `§4.7-L115.A1` | *"Visible lanes are capped at 3. Additional overlapping shifts collapse into a "+N more" affordance that opens a popover listing the hidden shifts."* | COVERED | **SCH-LANE-03 = [C29998](https://shopview.testrail.io/index.php?/cases/view/29998)** | *"Visible lanes cap at 3; extra overlapping shifts collapse into '+N more'"* |
| `§4.7-L115.A2` | *"This applies in day, week"* | COVERED | **SCH-LANE-04 = [C29999](https://shopview.testrail.io/index.php?/cases/view/29999)** | *"Week and month views reach the '+N more' overflow sooner than day view (their cells are narrower), but the same cap-and-overflow model applies."* |
| `§4.7-L115.A3` | *"month views (week and month reach the overflow much sooner because cells are narrower)."* | COVERED | **SCH-LANE-04 = [C29999](https://shopview.testrail.io/index.php?/cases/view/29999)** | *"Week and month views reach the '+N more' overflow sooner than day view (their cells are narrower), but the same cap-and-overflow model applies."* |
| `§4.7-L116.A1` | *"Overlap on the same technician is a conflict (see §4.11) and is flagged, so stacking reads as "resolve me," not "two normal jobs.""* | COVERED | **SCH-LANE-02 = [C29997](https://shopview.testrail.io/index.php?/cases/view/29997)** | *"The overlap is also flagged as a Double-booked conflict (stacking reads as 'resolve me')."* |

### §4.8 Day view: timeline interactions

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§4.8-L118.A1` | *"Auto-scroll to business hours."* | COVERED | **SCH-DAY-01 = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001)** | *"Technicians have configured start times; note the EARLIEST one (or the business-hours start / 7:00 AM if none)."* |
| `§4.8-L118.A2` | *"On initial day-view load and when navigating to a new day, the timeline auto-scrolls so the working-day start sits at the left edge of the visible area (with a small 30 to 60 minute buffer before it)."* | COVERED | **SCH-DAY-01 = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001)** | *"On load and on each day navigation, the timeline is auto-scrolled so the working-day start sits at the left edge of the visible area, with a small buffer (roughly 30 to 60 minutes) before it."* |
| `§4.8-L118.A3` | *"The start time comes from the same hierarchy shifts use: the earliest technician's configured start if tech hours are set, otherwise business hours, otherwise 7:00 AM."* | COVERED | **SCH-DAY-01 = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001)** | *"The start used is the earliest technician's configured start; if no tech hours are set, business hours; otherwise 7:00 AM - so no shifts sit off-screen to the left."* |
| `§4.8-L118.A4` | *"If technicians have different start times, the earliest one is used so no shifts are off-screen."* | COVERED | **SCH-DAY-01 = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001)** | *"Technicians have configured start times; note the EARLIEST one (or the business-hours start / 7:00 AM if none)."* |
| `§4.8-L118.A5` | *"The auto-scroll fires only on load or day navigation"* | COVERED | **SCH-DAY-01 = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001)** | *"On load and on each day navigation, the timeline is auto-scrolled so the working-day start sits at the left edge of the visible area, with a small buffer (roughly 30 to 60 minutes) before it."* |
| `§4.8-L118.A6` | *"if the user scrolls manually, their position is not overridden."* | COVERED | **SCH-DAY-01 = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001)** | *"Day view auto-scrolls to the working-day start; manual scrolling stands"* |
| `§4.8-L118.A7` | *"The full 24-hour timeline remains intact and scrollable."* | COVERED | **SCH-DAY-01 = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001)** | *"The timeline is not stuck at the start - it remains a full 24-hour scrollable timeline (midnight to midnight)."* |
| `§4.8-L119.A1` | *"Sticky header bar. Date and time headers stick to the top of the viewport during vertical scroll, so the user always knows which time column they are looking at."* | COVERED | **SCH-DAY-03 = [C30003](https://shopview.testrail.io/index.php?/cases/view/30003)** | *"In day view, the date/time header bar stays stuck to the top while the rows scroll beneath it - you always know which time column you are looking at."* |
| `§4.8-L119.A2` | *"This applies in both day and week views."* | COVERED | **SCH-VIEW-04 = [C30045](https://shopview.testrail.io/index.php?/cases/view/30045)** | *"'VIN Number' on: the VIN appears as an additional line on blocks in day and week views."* |
| `§4.8-L120.A1` | *"Horizontal drag to move a shift's start time (snaps to 15-minute intervals)."* | COVERED | **SCH-DAY-04 = [C30004](https://shopview.testrail.io/index.php?/cases/view/30004)** | *"Dragging a shift sideways moves its start time in 15-minute steps"* |
| `§4.8-L121.A1` | *"Edge resize. Drag the left or right edge to adjust duration."* | COVERED | **SCH-DAY-05 = [C30005](https://shopview.testrail.io/index.php?/cases/view/30005)** | *"Dragging a shift's left or right edge resizes its duration"* |
| `§4.8-L122.A1` | *"Lane stacking. Overlapping shifts split into parallel lanes per §4.7."* | NOT-INDEPENDENTLY-TESTABLE | — | 'Lane stacking. Overlapping shifts split into parallel lanes per §4.7.' - a cross-reference; §4.7's own rows are covered by C29996/C29997/C29998/C2999 |
| `§4.8-L123.A1` | *"Lane height with VIN. When the VIN toggle is on (§9), lane heights in day view grow to accommodate the additional VIN line so block text is not clipped."* | COVERED | **SCH-VIEW-04 = [C30045](https://shopview.testrail.io/index.php?/cases/view/30045)** | *"In day view with the VIN on, the lane height grows to fit the extra VIN line and no block text is clipped or cut off."* |
| `§4.8-L124.A1` | *"Now line. A vertical indicator showing the current time, with a label on hover over the grid."* | COVERED | **SCH-DAY-06 = [C30006](https://shopview.testrail.io/index.php?/cases/view/30006)** | *"A now line marks the current time on today's day view, with a label on hover"* |
| `§4.8-L125.A1` | *"Business-hours shading. An optional grey overlay outside working hours."* | COVERED | **SCH-VIEW-06 = [C30047](https://shopview.testrail.io/index.php?/cases/view/30047)** | *"With the toggle on, the hours OUTSIDE the working day are shaded with a grey overlay."* |

### §4.9 Shift detail modal

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§4.9-L127.A1` | *"Clicking a shift block opens a detail panel showing:"* | NOT-INDEPENDENTLY-TESTABLE | — | 'Clicking a shift block opens a detail panel showing:' - introduces the modal's field list; the click itself is covered by C30008. |
| `§4.9-L128.A1` | *"Customer name, unit number, VIN (always visible, below unit and asset), and work order id."* | COVERED | **SCH-MODAL-01 = [C30008](https://shopview.testrail.io/index.php?/cases/view/30008)** | *"It shows the customer name, unit number, the VIN (below unit and asset), and the work order id."* |
| `§4.9-L129.A1` | *"Scheduled date and start/end time pickers (15-minute increments)."* | COVERED | **SCH-MODAL-02 = [C30009](https://shopview.testrail.io/index.php?/cases/view/30009)** | *"Scheduled date and start/end time pickers work in 15-minute increments"* |
| `§4.9-L130.A1` | *"Technician."* | COVERED | **SCH-REG-02 = [C38868](https://shopview.testrail.io/index.php?/cases/view/38868)** | *"One work order has been spread across MANY days for a technician (e.g. a 2-week series - 10+ daily shifts)."* |
| `§4.9-L131.A1` | *"Time logged vs estimate (progress)."* | COVERED | **SCH-MODAL-03 = [C30010](https://shopview.testrail.io/index.php?/cases/view/30010)** | *"The modal shows the technician and time logged vs estimate progress"* |
| `§4.9-L132.A1` | *"Scope summary and the scheduled line(s) with labor/status figures."* | COVERED | **SCH-MODAL-04 = [C30011](https://shopview.testrail.io/index.php?/cases/view/30011)** | *"The 'Work Order Lines' section shows the line count and a scope summary of what the shift covers."* |
| `§4.9-L133.A1` | *"Estimated hours with inline edit."* | COVERED | **SCH-MODAL-05 = [C30012](https://shopview.testrail.io/index.php?/cases/view/30012)** | *"Edit the estimated hours inline (change the value)."* |
| `§4.9-L134.A1` | *"Color picker (see §10)."* | COVERED | **SCH-COLOR-02 = [C30072](https://shopview.testrail.io/index.php?/cases/view/30072)** | *"Shift modal color picker recolors that shift only, in matching tones"* |
| `§4.9-L135.A1` | *"Notes: add, edit, and delete per work order."* | COVERED | **SCH-MODAL-06 = [C30013](https://shopview.testrail.io/index.php?/cases/view/30013)** | *"Notes can be added, edited, and deleted per work order from the modal"* |
| `§4.9-L136.A1` | *"A conflict banner with an "Adjust" action when the shift is conflicted."* | COVERED | **SCH-MODAL-07 = [C30014](https://shopview.testrail.io/index.php?/cases/view/30014)** | *"A conflicted shift's modal shows a conflict banner with an 'Adjust' action"* |
| `§4.9-L137.A1` | *"Actions: Delete (series-aware, §7)"* | COVERED | **SCH-MODAL-08 = [C30015](https://shopview.testrail.io/index.php?/cases/view/30015)** | *"Click Delete on a series shift and read what it asks (cancel without deleting)."* |

### §4.10 Events

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§4.10-L139.A1` | *"Non-work-order time blocks (meetings, training, stand-ups) that occupy technician time:"* | NOT-INDEPENDENTLY-TESTABLE | — | Introduces the events bullet list. |
| `§4.10-L140.A1` | *"Create via left-click on empty grid space, which opens a menu with 'Create event' and 'New work order'.."* | COVERED | **SCH-EVT-01 = [C30016](https://shopview.testrail.io/index.php?/cases/view/30016)** | *"Create an event via left-click 'Create Event' on empty grid space"* |
| `§4.10-L141.A1` | *"Event modal: name, date, start/end time, all-day toggle, color category."* | COVERED | **SCH-EVT-03 = [C30018](https://shopview.testrail.io/index.php?/cases/view/30018)** | *"The modal contains: name, date, start/end time, an all-day toggle, and a color category."* |
| `§4.10-L142.A1` | *"Drag-and-drop to reassign between technicians or move between days."* | COVERED | **SCH-EVT-02 = [C30017](https://shopview.testrail.io/index.php?/cases/view/30017)** | *"Day view event creation shows a live preview block you can drag to resize"* |
| `§4.10-L143.A1` | *"Day view shows a live preview block while creating, with drag-to-resize."* | COVERED | **SCH-EVT-02 = [C30017](https://shopview.testrail.io/index.php?/cases/view/30017)** | *"Day view event creation shows a live preview block you can drag to resize"* |
| `§4.10-L144.A1` | *"Event card anatomy. Event cards are styled to be structurally distinct from shift cards, so the two types are separable at a glance (not by color alone): a white/neutral card with a thin even border on all four sides and no colored left rail (the left rail is the shift's cue), a small grey-filled rounded chip on the left containing a calendar icon"* | COVERED | **SCH-EVT-06 = [C30021](https://shopview.testrail.io/index.php?/cases/view/30021)** | *"The event card is a white/neutral card with a thin, even border on all four sides and NO colored left rail (the left rail is the shift's cue)."* |
| `§4.10-L144.A2` | *"two lines of text beside it (event name, then the time range in secondary text)."* | COVERED | **SCH-EVT-06 = [C30021](https://shopview.testrail.io/index.php?/cases/view/30021)** | *"It has a small grey-filled rounded chip on the left containing a calendar icon, and two lines of text beside it: the event name, then the time range in secondary text."* |
| `§4.10-L144.A3` | *"Shifts read as tinted color-filled blocks with a colored left rail"* | COVERED | **SCH-EVT-06 = [C30021](https://shopview.testrail.io/index.php?/cases/view/30021)** | *"The shift reads as a tinted color-filled block with a colored left rail - the two types are separable at a glance, not by color alone."* |
| `§4.10-L144.A4` | *"events read as quieter, white outlined cards."* | COVERED | **SCH-EVT-03 = [C30018](https://shopview.testrail.io/index.php?/cases/view/30018)** | *"Read the fields the modal offers."* |
| `§4.10-L145.A1` | *"Event color. The default event color is neutral/grey."* | COVERED | **SCH-EVT-07 = [C30022](https://shopview.testrail.io/index.php?/cases/view/30022)** | *"The default event color is neutral/grey."* |
| `§4.10-L145.A2` | *"Events use the same custom color palette as shifts (the shared color picker with editable labels, see §10)"* | COVERED | **SCH-EVT-07 = [C30022](https://shopview.testrail.io/index.php?/cases/view/30022)** | *"The color picker offers the same custom color palette as shifts (shared picker with editable labels)."* |
| `§4.10-L145.A3` | *"choosing a color from the event modal tints the card and icon chip in the matching tones, the same way a colored shift is tinted."* | COVERED | **SCH-EVT-07 = [C30022](https://shopview.testrail.io/index.php?/cases/view/30022)** | *"Choosing a color tints the card and the icon chip in matching tones, the same way a colored shift is tinted."* |

### §4.11 Conflict detection

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§4.11-L147.A1` | *"The system continuously scans for scheduling issues and surfaces them in a toolbar pill:"* | NOT-INDEPENDENTLY-TESTABLE | — | Introduces the conflict-type table; the toolbar pill itself is covered by C30027. |
| `§4.11-L150.A1` | *"Double-booked"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§4.11-L151.A1` | *"Two different work orders overlap on the same technician at the same time."* | COVERED | **SCH-CONF-01 = [C30023](https://shopview.testrail.io/index.php?/cases/view/30023)** | *"Double-booked: two overlapping work orders on one technician are flagged"* |
| `§4.11-L152.A1` | *"Weekend shift"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§4.11-L153.A1` | *"Shift scheduled on Saturday or Sunday (outside working days)."* | COVERED | **SCH-CONF-02 = [C30024](https://shopview.testrail.io/index.php?/cases/view/30024)** | *"The shift is created but flagged as a conflict because the day is outside the technician's configured working days (the reason sentence reads in the spirit of 'Scheduled on a weekend (outside working days)' - it names the technician's own working days, not a fixed Monday-to-Friday window)."* |
| `§4.11-L154.A1` | *"Before hours"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§4.11-L155.A1` | *"Shift starts before the working-day start."* | COVERED | **SCH-CONF-03 = [C30025](https://shopview.testrail.io/index.php?/cases/view/30025)** | *"In day view, drag the shift so it starts BEFORE the technician's working-day start (for example 6:00 AM)."* |
| `§4.11-L156.A1` | *"After hours"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§4.11-L157.A1` | *"Shift extends past the working-day end."* | COVERED | **SCH-CONF-03 = [C30025](https://shopview.testrail.io/index.php?/cases/view/30025)** | *"Now drag the shift's right edge so it extends PAST the working-day end (for example to 7:00 PM)."* |
| `§4.11-L158.A1` | *"Conflicts appear as a warning icon on the affected block and are listed in a dropdown from the toolbar."* | COVERED | **SCH-CONF-02 = [C30024](https://shopview.testrail.io/index.php?/cases/view/30024)** | *"The warning icon appears on the block and the conflict is listed in the toolbar dropdown."* |
| `§4.11-L158.A2` | *"Clicking a conflict navigates to the relevant technician and day."* | COVERED | **SCH-CONF-06 = [C30028](https://shopview.testrail.io/index.php?/cases/view/30028)** | *"Clicking a conflict in the dropdown navigates to the relevant technician and day"* |
| `§4.11-L158.A3` | *"Red and other alarming styling is reserved for conflicts and genuine errors, never for overtime."* | COVERED | **SCH-CONF-07 = [C30029](https://shopview.testrail.io/index.php?/cases/view/30029)** | *"Red styling is only for conflicts and errors, never for overtime"* |
| `§4.11-L159.A1` | *"Events are not conflict-checked for now: an event overlapping a shift (or another event) does not raise a conflict."* | COVERED | **SCH-EVT-08 = [C30615](https://shopview.testrail.io/index.php?/cases/view/30615)** | *"An event's hours count toward the capacity bar but raise no conflict"* |
| `§4.11-L159.A2` | *"Their time still counts toward capacity (see §4.12)."* | COVERED | **SCH-EVT-08 = [C30615](https://shopview.testrail.io/index.php?/cases/view/30615)** | *"An event's hours count toward the capacity bar but raise no conflict"* |

### §4.12 Capacity visualization

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§4.12-L161.A1` | *"When enabled in View Options, each day column header shows a capacity bar."* | COVERED | **SCH-CAP-01 = [C30030](https://shopview.testrail.io/index.php?/cases/view/30030)** | *"Look at each day column's header bar."* |
| `§4.12-L161.A2` | *"Fill represents aggregate utilization"* | COVERED | **SCH-CAP-01 = [C30030](https://shopview.testrail.io/index.php?/cases/view/30030)** | *"Each day header shows a capacity bar; the blue fill represents total technician-hours booked - shift hours PLUS event hours - divided by total available (sum of all techs' working hours)."* |
| `§4.12-L161.A3` | *"overtime is a separate per-technician signal, and the two are independent."* | COVERED | **SCH-CAP-03 = [C30032](https://shopview.testrail.io/index.php?/cases/view/30032)** | *"Overtime (per-technician) and capacity (aggregate) are independent signals."* |
| `§4.12-L161.A4` | *"Event time is included in the utilization total alongside shifts, so meetings and training consume capacity even though they are not conflict-checked (see §4.11)."* | COVERED | **SCH-EVT-08 = [C30615](https://shopview.testrail.io/index.php?/cases/view/30615)** | *"Adding the event DOES increase that day's capacity bar fill - the event's hours are counted alongside shift hours (a 2-hour meeting uses up 2 hours of the technician's available time)."* |
| `§4.12-L162.A1` | *"Blue fill: aggregate technician-hours booked (shifts plus events) divided by total available (the sum of all techs' working hours)."* | COVERED | **SCH-CAP-01 = [C30030](https://shopview.testrail.io/index.php?/cases/view/30030)** | *"Each day header shows a capacity bar; the blue fill represents total technician-hours booked - shift hours PLUS event hours - divided by total available (sum of all techs' working hours)."* |
| `§4.12-L162.A2` | *"Clamped at 100%. The track width equals capacity and is identical across all days, so bars stay comparable at a glance (no per-day rescaling)."* | COVERED | **SCH-CAP-01 = [C30030](https://shopview.testrail.io/index.php?/cases/view/30030)** | *"The track width is identical across all days (capacity is not rescaled per day), so bars are comparable at a glance."* |
| `§4.12-L163.A1` | *"Amber spill: when aggregate hours exceed capacity, an amber segment extends past the right edge of the track, with a tick at the 100% line."* | COVERED | **SCH-CAP-02 = [C30031](https://shopview.testrail.io/index.php?/cases/view/30031)** | *"Over capacity, an amber spill extends past the track's right edge"* |
| `§4.12-L164.A1` | *""OT" tag: appears whenever any individual technician exceeds their own daily hours, even when the day's aggregate is under capacity."* | COVERED | **SCH-CAP-03 = [C30032](https://shopview.testrail.io/index.php?/cases/view/30032)** | *"On one day, a single technician is booked beyond THEIR daily hours while the team's aggregate for that day remains UNDER total capacity (other techs lightly booked)."* |
| `§4.12-L164.A2` | *"It is a text tag, not a color-only signal."* | COVERED | **SCH-CAP-03 = [C30032](https://shopview.testrail.io/index.php?/cases/view/30032)** | *"The tag is text, not a color-only signal."* |
| `§4.12-L165.A1` | *"Hover tooltip: a per-assigned technician breakdown (assigned vs that tech's capacity), with overtime technicians highlighted in amber."* | PARTIAL | **SCH-CAP-04 = [C30033](https://shopview.testrail.io/index.php?/cases/view/30033)** | *"A tooltip shows a per-technician breakdown: assigned hours vs that technician's capacity."* |

### §4.13 Hover tooltips (read-only)

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§4.13-L167.A1` | *"Hovering a block shows a quick peek without opening the modal."* | NOT-INDEPENDENTLY-TESTABLE | — | 'Hovering a block shows a quick peek without opening the modal.' - introduces the tooltip bullets; the read-only half is covered by C30037. |
| `§4.13-L168.A1` | *"Shift tooltip: customer name (plus the conflict icon if conflicted); unit, vehicle, and VIN; date and time range; technician"* | COVERED | **SCH-TIP-01 = [C30034](https://shopview.testrail.io/index.php?/cases/view/30034)** | *"The tooltip shows: the customer name; unit, vehicle, and VIN (the tooltip shows the VIN whenever the unit has one, regardless of the 'VIN Number' toggle); the date and time range; the technician; and a scope summary ('N lines · Xh' style)."* |
| `§4.13-L168.A2` | *"scope summary ("N lines · Xh")"* | COVERED | **SCH-TIP-01 = [C30034](https://shopview.testrail.io/index.php?/cases/view/30034)** | *"The tooltip shows: the customer name; unit, vehicle, and VIN (the tooltip shows the VIN whenever the unit has one, regardless of the 'VIN Number' toggle); the date and time range; the technician; and a scope summary ('N lines · Xh' style)."* |
| `§4.13-L168.A3` | *"the individual line names as a short list capped at 3 with a "+N more lines" row (no line statuses)"* | COVERED | **SCH-TIP-01 = [C30034](https://shopview.testrail.io/index.php?/cases/view/30034)** | *"The individual line names appear as a short list capped at 3, with a '+N more lines' row for the rest (here '+2 more lines'); line statuses are NOT shown."* |
| `§4.13-L168.A4` | *"a time-logged progress bar ("X / Yh")"* | COVERED | **SCH-TIP-01 = [C30034](https://shopview.testrail.io/index.php?/cases/view/30034)** | *"A time-logged progress bar shows logged vs estimated hours ('X / Yh' style)."* |
| `§4.13-L168.A5` | *"and the conflict reason in amber when conflicted."* | COVERED | **SCH-TIP-02 = [C30035](https://shopview.testrail.io/index.php?/cases/view/30035)** | *"A conflicted shift's tooltip shows the icon and reason in amber"* |
| `§4.13-L169.A1` | *"Event tooltip: event name (plus its grey category dot); date and time range; technician."* | COVERED | **SCH-TIP-03 = [C30036](https://shopview.testrail.io/index.php?/cases/view/30036)** | *"What you should see today: The event's hover tooltip has no grey dot next to the event name. It shows the name, the date and time range and the technician, and no dot at all. This is a known problem and it is already reported - see https://shopview.atlassian.net/browse/SV-8893"* |
| `§4.13-L170.A1` | *"Behavior: open after a roughly 300 to 500ms hover delay; dismiss on mouse-leave"* | COVERED | **SCH-TIP-04 = [C30037](https://shopview.testrail.io/index.php?/cases/view/30037)** | *"Tooltips open after a hover delay, dismiss on mouse-leave, are read-only"* |
| `§4.13-L170.A2` | *"read-only, so clicking the block still opens the full modal."* | COVERED | **SCH-TIP-04 = [C30037](https://shopview.testrail.io/index.php?/cases/view/30037)** | *"Clicking the block opens the full detail modal as normal."* |
| `§4.13-L170.A3` | *"Because the shift tooltip's height varies with the line list, it flips to open above the block when there is not room below and shifts horizontally to stay within the viewport, rather than being clipped."* | COVERED | **SCH-TIP-05 = [C30038](https://shopview.testrail.io/index.php?/cases/view/30038)** | *"The tooltip flips or shifts to stay within the viewport - never clipped"* |

### §5.1 Work order filters

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§5.1-L173.A1` | *"Filters live behind a "Filter" button (with an active-count badge)"* | COVERED | **SCH-FILT-05 = [C29946](https://shopview.testrail.io/index.php?/cases/view/29946)** | *"The active-count badge on the 'Filter' button disappears (or shows zero)."* |
| `§5.1-L173.A2` | *"there are no assignment tabs."* | COVERED | **SCH-WOL-01 = [C29936](https://shopview.testrail.io/index.php?/cases/view/29936)** | *"There are no Assigned/Unassigned tabs - assignment is available only as a filter behind the 'Filter' button."* |
| `§5.1-L173.A3` | *"Applying a filter narrows the flat card list, and "Clear all" resets in one click."* | COVERED | **SCH-FILT-01 = [C29942](https://shopview.testrail.io/index.php?/cases/view/29942)** | *"Applying a filter narrows the flat card list."* |
| `§5.1-L176.A1` | *"Assignment"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§5.1-L177.A1` | *"Assigned, Unassigned"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§5.1-L178.A1` | *"Status"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§5.1-L179.A1` | *"All work order statuses currently supported in the app"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§5.1-L180.A1` | *"Priority"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§5.1-L181.A1` | *"High, Medium, Low"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§5.1-L182.A1` | *"Search and filter work together: the search field (see §3.1) narrows by text match"* | COVERED | **SCH-FILT-06 = [C29947](https://shopview.testrail.io/index.php?/cases/view/29947)** | *"The list shows only work orders that match BOTH the text search and the structured filter."* |
| `§5.1-L182.A2` | *"the filter button narrows by structured attributes."* | COVERED | **SCH-WOL-01 = [C29936](https://shopview.testrail.io/index.php?/cases/view/29936)** | *"There are no Assigned/Unassigned tabs - assignment is available only as a filter behind the 'Filter' button."* |
| `§5.1-L182.A3` | *"Both can be active at the same time."* | COVERED | **SCH-FILT-06 = [C29947](https://shopview.testrail.io/index.php?/cases/view/29947)** | *"Search and filter work together - both can be active at the same time"* |
| `§5.1-L183.A1` | *"The line drill-down has its own filters: All and Unscheduled (lines with no shifts yet), plus a line-name search (see §3.1)."* | COVERED | **SCH-LINE-07 = [C29954](https://shopview.testrail.io/index.php?/cases/view/29954)** | *"Unscheduled lists only the lines that have no shifts yet, and its count matches."* |

### §5.2 Mini calendar

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§5.2-L185.A1` | *"Month/year picker (grid of month buttons, year nav arrows)."* | COVERED | **SCH-MCAL-02 = [C29933](https://shopview.testrail.io/index.php?/cases/view/29933)** | *"A picker opens showing a grid of month buttons plus arrows to step the year back and forward."* |
| `§5.2-L186.A1` | *"Collapsible: a chevron toggle hides the calendar grid to maximize work order list space."* | COVERED | **SCH-MCAL-03 = [C29934](https://shopview.testrail.io/index.php?/cases/view/29934)** | *"<li>The calendar grid collapses (hides), leaving more room for the work order list below.</li>"* |
| `§5.2-L187.A1` | *"Selected date highlighted; today indicated"* | COVERED | **SCH-MCAL-01 = [C29932](https://shopview.testrail.io/index.php?/cases/view/29932)** | *"The clicked date is highlighted as the selected date in the mini calendar."* |
| `§5.2-L187.A2` | *"week row highlighted on hover."* | COVERED | **SCH-MCAL-04 = [C29935](https://shopview.testrail.io/index.php?/cases/view/29935)** | *"<li>Hovering a week row highlights that whole week row.</li>"* |

### §5.3 Panel collapse

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§5.3-L189.A1` | *"An icon button collapses and expands the left panel."* | UNCOVERED | — | **no case asserts this** |
| `§5.3-L189.A2` | *"It is the first item in the grid toolbar, left of Today, sitting in the same left gutter as the grid's row labels and avatars so it reads as belonging to the panel it controls"* | UNCOVERED | — | **no case asserts this** |
| `§5.3-L189.A3` | *"grouping with the date controls."* | UNCOVERED | — | **no case asserts this** |
| `§5.3-L190.A1` | *"Control. A borderless panel-left icon in secondary text color."* | UNCOVERED | — | **no case asserts this** |
| `§5.3-L190.A2` | *"The icon does not change between states"* | UNCOVERED | — | **no case asserts this** |
| `§5.3-L190.A3` | *"the tooltip carries the meaning — "Hide panel" when open, "Show panel" when collapsed."* | UNCOVERED | — | **no case asserts this** |
| `§5.3-L191.A1` | *"Behavior. The panel animates closed over a short width transition, its divider disappears so no seam remains"* | UNCOVERED | — | **no case asserts this** |
| `§5.3-L191.A2` | *"the grid reflows into the reclaimed space."* | UNCOVERED | — | **no case asserts this** |
| `§5.3-L192.A1` | *"State preservation. Contents are hidden rather than discarded."* | UNCOVERED | — | **no case asserts this** |
| `§5.3-L192.A2` | *"Calendar date, work-order scroll position, panel search text, drill-down state"* | UNCOVERED | — | **no case asserts this** |
| `§5.3-L192.A3` | *"the selected work order all survive a collapse/expand cycle"* | UNCOVERED | — | **no case asserts this** |
| `§5.3-L192.A4` | *"reopening returns to whichever panel mode was active."* | UNCOVERED | — | **no case asserts this** |
| `§5.3-L193.A1` | *"Narrow viewports. Below the 960px minimum supported width (§11) the panel auto-collapses."* | UNCOVERED | — | **no case asserts this** |
| `§5.3-L193.A2` | *"The toggle still works, so the user can expand it manually at any width"* | UNCOVERED | — | **no case asserts this** |
| `§5.3-L193.A3` | *"that manual choice holds until the next resize across the breakpoint."* | UNCOVERED | — | **no case asserts this** |
| `§5.3-L194.A1` | *"Popovers and modals. Anything that positions itself clear of the panel falls back to a normal viewport margin while the panel is collapsed."* | UNCOVERED | — | **no case asserts this** |
| `§5.3-L195.A1` | *"Persistence. Not persisted in the prototype."* | UNCOVERED | — | **no case asserts this** |
| `§5.3-L195.A2` | *"Session-scoped per user for build — this is a working-mode preference, not a saved view."* | UNCOVERED | — | **no case asserts this** |

### §6 Grid toolbar

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§6-L199.A1` | *"Panel toggle"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§6-L200.A1` | *"Collapses and expands the left work order panel (§5.3)."* | UNCOVERED | — | **no case asserts this** |
| `§6-L201.A1` | *"Today button"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§6-L202.A1` | *"Jumps the grid to the current date."* | COVERED | **SCH-TOOL-01 = [C30039](https://shopview.testrail.io/index.php?/cases/view/30039)** | *"'Today' button jumps the grid to the current date"* |
| `§6-L203.A1` | *"Left/right arrows"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§6-L204.A1` | *"Navigate by day, week, or month depending on the active range."* | COVERED | **SCH-TOOL-01 = [C30039](https://shopview.testrail.io/index.php?/cases/view/30039)** | *"The grid jumps to the range containing the current date (today's day, this week, or this month depending on the active view)."* |
| `§6-L205.A1` | *"Date label"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§6-L206.A1` | *"Shows the current range (e.g. "Jul 14 to 20, 2026")."* | COVERED | **SCH-TOOL-02 = [C30040](https://shopview.testrail.io/index.php?/cases/view/30040)** | *"Week view: each arrow click moves one whole week; the label shows the week range (spec's example format: 'Jul 14 to 20, 2026')."* |
| `§6-L207.A1` | *"Conflict pill"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§6-L208.A1` | *"Shows the issue count"* | COVERED | **SCH-CONF-05 = [C30027](https://shopview.testrail.io/index.php?/cases/view/30027)** | *"The toolbar conflict pill shows the count and opens a list"* |
| `§6-L208.A2` | *"click opens the conflict detail dropdown."* | COVERED | **SCH-CONF-05 = [C30027](https://shopview.testrail.io/index.php?/cases/view/30027)** | *"Clicking opens a dropdown listing each conflict."* |
| `§6-L209.A1` | *"Search"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§6-L210.A1` | *"Filters grid blocks by matching against customer name, WO number, unit number, technician name, and line name."* | COVERED | **SCH-TOOL-03 = [C30041](https://shopview.testrail.io/index.php?/cases/view/30041)** | *"All five fields match: customer name, work order number, unit number, technician name, and line name."* |
| `§6-L211.A1` | *"Filter and Display"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§6-L212.A1` | *"Dropdown (checkbox style) combining department visibility toggles, My Shifts, and VIN."* | COVERED | **SCH-VIEW-01 = [C30042](https://shopview.testrail.io/index.php?/cases/view/30042)** | *"The dropdown is checkbox style and contains: a toggle per department, 'My Shifts', and 'VIN'."* |
| `§6-L212.A2` | *"Replaces the former "Departments" control."* | COVERED | **SCH-VIEW-01 = [C30042](https://shopview.testrail.io/index.php?/cases/view/30042)** | *"There is no separate departments-only control - this dropdown replaces it."* |
| `§6-L213.A1` | *"View Options"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§6-L214.A1` | *"Toggles: Business hours, Capacity bars, Events, Tech hours, Saturday, Sunday."* | COVERED | **SCH-VIEW-05 = [C30046](https://shopview.testrail.io/index.php?/cases/view/30046)** | *"Six toggles are offered: Business Hours, Capacity Bars, Events, Tech Hours, Saturday, Sunday."* |
| `§6-L215.A1` | *"Day / Week / Month"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§6-L216.A1` | *"Segmented control to switch the grid range."* | COVERED | **SCH-NAV-03 = [C29927](https://shopview.testrail.io/index.php?/cases/view/29927)** | *"Day / Week / Month segmented control switches the grid between the three views"* |

### §7 Interactions and micro-interactions

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§7-L218.A1` | *"Drag feedback. Drop-target cells highlight"* | COVERED | **SCH-DND-06 = [C29960](https://shopview.testrail.io/index.php?/cases/view/29960)** | *"While dragging, target cells highlight and a ghost block follows"* |
| `§7-L218.A2` | *"a ghost block shows the line name and hours."* | COVERED | **SCH-DND-06 = [C29960](https://shopview.testrail.io/index.php?/cases/view/29960)** | *"A ghost block follows the drag showing the line name and its hours."* |
| `§7-L219.A1` | *"Shift reassignment. Dragging a shift block from one technician row to another reassigns it: the target technician is added to the affected line's roster and the source technician is removed."* | COVERED | **SCH-REAS-07 = [C43556](https://shopview.testrail.io/index.php?/cases/view/43556)** | *"After you confirm, the block sits in the new technician's row, that technician is added to the work order line's technician list, and the previous one is taken off it."* |
| `§7-L219.A2` | *"A confirmation modal handles cross-tech moves."* | COVERED | **SCH-REAS-01 = [C30052](https://shopview.testrail.io/index.php?/cases/view/30052)** | *"A confirmation modal appears for the cross-technician move."* |
| `§7-L220.A1` | *"Left-click on empty grid space opens a menu with: Create event, New work order."* | COVERED | **SCH-REAS-03 = [C30054](https://shopview.testrail.io/index.php?/cases/view/30054)** | *"Left-click empty grid space opens a menu: Create Event and New Work Order"* |
| `§7-L221.A1` | *"Toast notifications. Every create, delete, move"* | COVERED | **SCH-DEL-09 = [C30065](https://shopview.testrail.io/index.php?/cases/view/30065)** | *"Each of the four actions (create, delete, move, reassign) produces a toast notification, and every toast offers an Undo option."* |
| `§7-L221.A2` | *"reassign action produces a toast with an Undo option."* | COVERED | **SCH-DEL-09 = [C30065](https://shopview.testrail.io/index.php?/cases/view/30065)** | *"Each of the four actions (create, delete, move, reassign) produces a toast notification, and every toast offers an Undo option."* |
| `§7-L221.A3` | *"The toast persists for 4 to 7 seconds, stays while the cursor is over it"* | COVERED | **SCH-DEL-08 = [C30064](https://shopview.testrail.io/index.php?/cases/view/30064)** | *"Untouched, a toast that has an Undo action persists about 7 seconds; a toast without Undo persists about 4 seconds, before dismissing."* |
| `§7-L221.A4` | *"dismisses on mouse-leave."* | COVERED | **SCH-REAS-07 = [C43556](https://shopview.testrail.io/index.php?/cases/view/43556)** | *"Press and hold the mouse on that block."* |
| `§7-L222.A1` | *"Keyboard support. Global shortcuts work anywhere on the schedule page:Escape closes the topmost open modal or popover, following a defined stacking order (delete scope, reassign, spread, capacity, event modal, event view, line picker, shift detail, cell menu, calendar picker, customize, filters, search)."* | COVERED | **SCH-KEY-01 = [C30066](https://shopview.testrail.io/index.php?/cases/view/30066)** | *"Escape works anywhere on the schedule page as a global shortcut, following the defined stacking order (delete scope, reassign, spread, capacity, event modal, event view, line picker, shift detail, cell menu, calendar picker, customize, filters, search)."* |
| `§7-L222.A2` | *"Within the shift modal, Escape first dismisses any open sub-picker (color picker, time picker, note edit) before closing the modal itself."* | COVERED | **SCH-KEY-01 = [C30066](https://shopview.testrail.io/index.php?/cases/view/30066)** | *"Same for the time picker and the note edit - each sub-picker closes first and the modal stays open."* |
| `§7-L223.A1` | *"Enter confirms the active confirmable dialog (delete scope, reassign, spread, event create/edit)."* | COVERED | **SCH-KEY-01 = [C30066](https://shopview.testrail.io/index.php?/cases/view/30066)** | *"Escape works anywhere on the schedule page as a global shortcut, following the defined stacking order (delete scope, reassign, spread, capacity, event modal, event view, line picker, shift detail, cell menu, calendar picker, customize, filters, search)."* |
| `§7-L223.A2` | *"It does not fire inside textareas, so multiline note editing still works normally."* | COVERED | **SCH-KEY-01 = [C30066](https://shopview.testrail.io/index.php?/cases/view/30066)** | *"Open the time picker inside the modal and press Escape; then start editing a note and press Escape."* |
| `§7-L224.A1` | *"Drag-and-drop has a click-to-arm alternative for users who cannot drag."* | COVERED | **SCH-DND-08 = [C29962](https://shopview.testrail.io/index.php?/cases/view/29962)** | *"A click-to-arm alternative exists for scheduling without dragging"* |
| `§7-L225.A1` | *"Series-aware deletion. Deleting a shift that belongs to a series asks for scope."* | COVERED | **SCH-DEL-01 = [C30057](https://shopview.testrail.io/index.php?/cases/view/30057)** | *"Deleting a middle shift of a series offers all three scope options"* |
| `§7-L225.A2` | *"This is routine, lightweight editing (undo toast, not the alarming destructive styling):This shift only: removes that day."* | COVERED | **SCH-DEL-01 = [C30057](https://shopview.testrail.io/index.php?/cases/view/30057)** | *"The prompt uses routine, lightweight styling - not alarming destructive styling."* |
| `§7-L225.A3` | *"The series keeps the gap (it is not auto-closed)"* | COVERED | **SCH-DEL-02 = [C30058](https://shopview.testrail.io/index.php?/cases/view/30058)** | *"'This shift only' removes that day and the series keeps the gap"* |
| `§7-L225.A4` | *"the hours return to the estimate's remaining."* | COVERED | **SCH-DEL-02 = [C30058](https://shopview.testrail.io/index.php?/cases/view/30058)** | *"The removed day's hours return to the estimate's remaining (scheduled hours drop by that day's hours)."* |
| `§7-L226.A1` | *"This and everything after: removes from the clicked shift onward, keeping earlier shifts."* | COVERED | **SCH-DEL-03 = [C30059](https://shopview.testrail.io/index.php?/cases/view/30059)** | *"'This and everything after' removes from the clicked shift onward"* |
| `§7-L227.A1` | *"The whole series: removes all of the series' shifts for that technician."* | COVERED | **SCH-DEL-04 = [C30060](https://shopview.testrail.io/index.php?/cases/view/30060)** | *"'The whole series' removes all of the series' shifts for that technician"* |
| `§7-L228.A1` | *"The options adapt to position: on the first shift, "this and after" equals "whole series" (show two options)"* | COVERED | **SCH-DEL-05 = [C30061](https://shopview.testrail.io/index.php?/cases/view/30061)** | *"First shift: two options ('this and after' would equal 'whole series', so only two are shown)."* |
| `§7-L228.A2` | *"on the last shift, "this and after" equals "this only" (two options)"* | COVERED | **SCH-DEL-05 = [C30061](https://shopview.testrail.io/index.php?/cases/view/30061)** | *"Last shift: two options ('this and after' would equal 'this only')."* |
| `§7-L228.A3` | *"only middle shifts show all three."* | COVERED | **SCH-DEL-01 = [C30057](https://shopview.testrail.io/index.php?/cases/view/30057)** | *"Deleting a middle shift of a series offers all three scope options"* |
| `§7-L228.A4` | *"Each option states its consequence in hours returned ("returns 8h" / "returns 56h")."* | COVERED | **SCH-DEL-01 = [C30057](https://shopview.testrail.io/index.php?/cases/view/30057)** | *"Each option states its consequence in hours returned (spec's example format: 'returns 8h' / 'returns 56h')."* |

### §8.1 Key entities

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§8.1-L234.A1` | *"Shift"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L235.A1` | *"sid, woId, rowKey (tech), date, startHour, blockDuration, lines[], seriesId"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L236.A1` | *"Belongs to Work Order; assigned to Technician"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L236.A2` | *"optionally part of a Series"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L237.A1` | *"Event"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L238.A1` | *"eid, name, rowKey (tech), date, startHour, endHour, allDay, color"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L239.A1` | *"Assigned to Technician"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L240.A1` | *"Work Order"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L241.A1` | *"id, customer, unit, asset, status, priority, hrs, color"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L242.A1` | *"Has many Lines"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L243.A1` | *"Line"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L244.A1` | *"num, title, status, est, actual, total, labor[]"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L245.A1` | *"Belongs to Work Order"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L245.A2` | *"has many Technicians via the labor roster (no cap)"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L246.A1` | *"Technician"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L247.A1` | *"key, name, role, dept, hours (working start/end plus working weekdays)"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L248.A1` | *"Belongs to Department"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L248.A2` | *"has many Shifts and Events"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L249.A1` | *"Department"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L250.A1` | *"key, name"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L251.A1` | *"Has many Technicians"* | NOT-INDEPENDENTLY-TESTABLE | — | A data-model definition (entity name, field list or relationship), not a behaviour. The observable consequences are covered: the uncapped labor roster |
| `§8.1-L252.A1` | *"The Line's labor[] roster has no maximum"* | COVERED | **SCH-LINE-04 = [C29951](https://shopview.testrail.io/index.php?/cases/view/29951)** | *"Line row shows title, hours, the technician roster and a drag handle"* |
| `§8.1-L252.A2` | *"any number of technicians may be on a line."* | COVERED | **SCH-LINE-04 = [C29951](https://shopview.testrail.io/index.php?/cases/view/29951)** | *"A work order exists whose approved lines have estimated hours; at least one line has several technicians on its roster."* |
| `§8.1-L252.A3` | *"An unassigned shift has an empty or placeholder rowKey until it is moved onto a technician."* | COVERED | **SCH-EVT-03 = [C30018](https://shopview.testrail.io/index.php?/cases/view/30018)** | *"You are on the Schedule page with the event modal open (left-click empty grid space, then 'Create Event')."* |

### §8.2 Series

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§8.2-L254.A1` | *"A series groups shifts created by the spread step"* | COVERED | **SCH-SPREAD-09 = [C29985](https://shopview.testrail.io/index.php?/cases/view/29985)** | *"Confirming the spread creates a linked series of daily shifts"* |
| `§8.2-L254.A2` | *"all shifts in a series share a seriesId."* | COVERED | **SCH-SPREAD-09 = [C29985](https://shopview.testrail.io/index.php?/cases/view/29985)** | *"Confirming the spread creates a linked series of daily shifts"* |
| `§8.2-L254.A3` | *"The series supports scoped deletion (this / this-and-after / whole) and renders as a connected banner in month, week, and day views."* | COVERED | **SCH-SPREAD-09 = [C29985](https://shopview.testrail.io/index.php?/cases/view/29985)** | *"The shifts render as one connected banner (see the series-banner cases)."* |
| `§8.2-L254.A4` | *"It is a grouping over ordinary daily shifts, not a distinct persisted entity beyond the shared id"* | COVERED | **SCH-SER-04 = [C29990](https://shopview.testrail.io/index.php?/cases/view/29990)** | *"A series is just a grouping - capacity and conflicts use the daily shifts"* |
| `§8.2-L254.A5` | *"each daily shift carries its own hours for capacity math."* | COVERED | **SCH-SPREAD-09 = [C29985](https://shopview.testrail.io/index.php?/cases/view/29985)** | *"Each daily shift keeps its own day and hours."* |

### §9 View options and customization

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§9-L256.A1` | *"Display settings are split across two toolbar controls:"* | NOT-INDEPENDENTLY-TESTABLE | — | 'Display settings are split across two toolbar controls:' - introduces the two tables. |
| `§9-L257.A1` | *"Filter and Display dropdown (checkbox style, §6):"* | NOT-INDEPENDENTLY-TESTABLE | — | Table caption for the Filter and Display dropdown. |
| `§9-L261.A1` | *"Department toggles"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§9-L262.A1` | *"All on"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§9-L263.A1` | *"Show or hide individual department groups in the grid."* | COVERED | **SCH-VIEW-02 = [C30043](https://shopview.testrail.io/index.php?/cases/view/30043)** | *"Department toggles show or hide individual department groups in the grid"* |
| `§9-L264.A1` | *"My Shifts"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§9-L265.A1` | *"Off"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§9-L266.A1` | *"Filters the grid to show only shifts assigned to the current user."* | COVERED | **SCH-VIEW-03 = [C30044](https://shopview.testrail.io/index.php?/cases/view/30044)** | *"'My Shifts' filters the grid to only the current user's shifts"* |
| `§9-L266.A2` | *"All other technician rows and their shifts are hidden."* | COVERED | **SCH-VIEW-03 = [C30044](https://shopview.testrail.io/index.php?/cases/view/30044)** | *"Only shifts assigned to you remain visible; all other technician rows and their shifts are hidden."* |
| `§9-L266.A3` | *"This is a personal convenience filter, not a permission boundary."* | COVERED | **SCH-VIEW-03 = [C30044](https://shopview.testrail.io/index.php?/cases/view/30044)** | *"This is a personal convenience filter only - it does not change what you are permitted to see (default is OFF, everyone's shifts visible)."* |
| `§9-L267.A1` | *"VIN"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§9-L268.A1` | *"Off"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§9-L269.A1` | *"Shows the VIN number as an additional line on shift blocks (day and week views) and in hover tooltips."* | COVERED | **SCH-VIEW-04 = [C30045](https://shopview.testrail.io/index.php?/cases/view/30045)** | *"'VIN Number' on: the VIN appears as an additional line on blocks in day and week views."* |
| `§9-L269.A2` | *"The VIN is always visible in the shift detail modal regardless of this toggle."* | COVERED | **SCH-MODAL-01 = [C30008](https://shopview.testrail.io/index.php?/cases/view/30008)** | *"Clicking a shift opens its detail modal, with VIN always visible"* |
| `§9-L270.A1` | *"View Options popover:"* | NOT-INDEPENDENTLY-TESTABLE | — | Table caption for the View Options popover. |
| `§9-L274.A1` | *"Business Hours"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§9-L275.A1` | *"Off"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§9-L276.A1` | *"Shades non-working hours in day view."* | COVERED | **SCH-VIEW-06 = [C30047](https://shopview.testrail.io/index.php?/cases/view/30047)** | *"Business Hours toggle shades non-working hours in day view"* |
| `§9-L277.A1` | *"Capacity Bars"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§9-L278.A1` | *"On"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§9-L279.A1` | *"Shows per-day capacity utilization bars in column headers."* | COVERED | **SCH-VIEW-05 = [C30046](https://shopview.testrail.io/index.php?/cases/view/30046)** | *"Turn OFF Capacity Bars, look at the day column headers, then turn it back ON."* |
| `§9-L280.A1` | *"Events"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§9-L281.A1` | *"On"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§9-L282.A1` | *"Shows non-WO event blocks on the grid."* | COVERED | **SCH-VIEW-05 = [C30046](https://shopview.testrail.io/index.php?/cases/view/30046)** | *"Events OFF: event blocks disappear from the grid while shifts remain; ON: the events reappear unchanged."* |
| `§9-L283.A1` | *"Tech Hours"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§9-L284.A1` | *"Off"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§9-L285.A1` | *"Displays each technician's working hours next to their name."* | COVERED | **SCH-VIEW-09 = [C30050](https://shopview.testrail.io/index.php?/cases/view/30050)** | *"Tech Hours toggle displays each technician's working hours next to their name"* |
| `§9-L286.A1` | *"Saturday"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§9-L287.A1` | *"On"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§9-L288.A1` | *"Includes the Saturday column."* | COVERED | **SCH-VIEW-10 = [C30051](https://shopview.testrail.io/index.php?/cases/view/30051)** | *"Saturday off: the Saturday column is removed (6 columns remain)."* |
| `§9-L289.A1` | *"Sunday"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§9-L290.A1` | *"On"* | NOT-INDEPENDENTLY-TESTABLE | — | A table label or default-value cell. The requirement is the whole row; its assertion is verdicted on the description cell beside it. |
| `§9-L291.A1` | *"Includes the Sunday column."* | COVERED | **SCH-VIEW-10 = [C30051](https://shopview.testrail.io/index.php?/cases/view/30051)** | *"Both back on: the full Monday-to-Sunday 7-column week returns."* |

### §10 Color system

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§10-L293.A1` | *"Blue is the default color for all shifts, including long or multi-week jobs."* | COVERED | **SCH-COLOR-01 = [C30071](https://shopview.testrail.io/index.php?/cases/view/30071)** | *"Blue is the default color for all shifts, including long and multi-week jobs"* |
| `§10-L294.A1` | *"Grey is the default color for events."* | COVERED | **SCH-EVT-07 = [C30022](https://shopview.testrail.io/index.php?/cases/view/30022)** | *"Events default to grey; choosing a color tints the card and chip"* |
| `§10-L295.A1` | *"All other colors are optional and chosen by the user from the color picker in the shift or event detail modal, to distinguish shifts however the shop likes."* | COVERED | **SCH-COLOR-02 = [C30072](https://shopview.testrail.io/index.php?/cases/view/30072)** | *"Shift modal color picker recolors that shift only, in matching tones"* |
| `§10-L296.A1` | *"Color labels are editable per shop."* | COVERED | **SCH-COLOR-03 = [C30073](https://shopview.testrail.io/index.php?/cases/view/30073)** | *"Color labels are editable per shop"* |
| `§10-L297.A1` | *"Each color provides three tones: background fill, text color, and accent (left border)."* | COVERED | **SCH-COLOR-02 = [C30072](https://shopview.testrail.io/index.php?/cases/view/30072)** | *"The color provides three consistent tones: background fill, text color, and accent (left border)."* |
| `§10-L297.A2` | *"There are no fixed semantic meanings tied to specific colors beyond the two defaults above."* | COVERED | **SCH-COLOR-02 = [C30072](https://shopview.testrail.io/index.php?/cases/view/30072)** | *"Colors carry no fixed meaning - they are free choice beyond the two defaults (blue shift / grey event)."* |

### §11 Non-functional requirements

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§11-L299.A1` | *"Performance. The grid must render smoothly with up to 15 technicians x 7 days x several shifts per cell."* | COVERED | **SCH-EDGE-04 = [C30088](https://shopview.testrail.io/index.php?/cases/view/30088)** | *"The grid renders smoothly at full load - 15 technicians over 7 days"* |
| `§11-L299.A2` | *"The sidebar work order list virtualizes at 50+ items, as does the line drill-down for orders with many lines."* | COVERED | **SCH-EDGE-03 = [C30087](https://shopview.testrail.io/index.php?/cases/view/30087)** | *"The sidebar work order list and line drill-down stay smooth with 50+ items"* |
| `§11-L300.A1` | *"Responsiveness. Minimum supported width is 960px (the grid scrolls horizontally below that)"* | COVERED | **SCH-EDGE-02 = [C30086](https://shopview.testrail.io/index.php?/cases/view/30086)** | *"Below the 960px minimum supported width, the grid scrolls horizontally rather than breaking."* |
| `§11-L300.A2` | *"the sidebar collapses on narrow viewports (§5.3)."* | COVERED | **SCH-EDGE-02 = [C30086](https://shopview.testrail.io/index.php?/cases/view/30086)** | *"On narrow viewports the sidebar collapses."* |
| `§11-L301.A1` | *"Accessibility. All interactive elements are keyboard-reachable"* | COVERED | **SCH-KEY-05 = [C30070](https://shopview.testrail.io/index.php?/cases/view/30070)** | *"Modals trap focus and all interactive elements are keyboard-reachable"* |
| `§11-L301.A2` | *"focus rings follow the design system"* | COVERED | **SCH-KEY-05 = [C30070](https://shopview.testrail.io/index.php?/cases/view/30070)** | *"Focus moves through the modal's interactive elements with visible focus rings."* |
| `§11-L301.A3` | *"modals trap focus and close on Escape"* | COVERED | **SCH-KEY-05 = [C30070](https://shopview.testrail.io/index.php?/cases/view/30070)** | *"Modals trap focus and all interactive elements are keyboard-reachable"* |
| `§11-L301.A4` | *"drag-and-drop has a click-to-arm alternative."* | COVERED | **SCH-DND-08 = [C29962](https://shopview.testrail.io/index.php?/cases/view/29962)** | *"A click-to-arm alternative exists for scheduling without dragging"* |
| `§11-L301.A5` | *"Overtime and conflict signals are not color-only (OT uses a text tag"* | COVERED | **SCH-CAP-03 = [C30032](https://shopview.testrail.io/index.php?/cases/view/30032)** | *"The tag is text, not a color-only signal."* |
| `§11-L301.A6` | *"the overflow uses shape)."* | PARTIAL | — | UNCOVERED PART: that the '+N more' overflow is conveyed by SHAPE rather than colour alone. C29998 asserts the affordance exists and opens a popover; C |
| `§11-L302.A1` | *"Undo. Every destructive action (delete, move, reassign) is undoable for 4 to 7 seconds via a toast that persists while hovered."* | COVERED | **SCH-DEL-09 = [C30065](https://shopview.testrail.io/index.php?/cases/view/30065)** | *"Each of the four actions (create, delete, move, reassign) produces a toast notification, and every toast offers an Undo option."* |
| `§11-L303.A1` | *"Dark theme. The Schedule supports a user-selectable Light / Dark theme, chosen from the user menu and persisted per user."* | PARTIAL | **SCH-EDGE-08 = [C38866](https://shopview.testrail.io/index.php?/cases/view/38866)** | *"Every dialog and popover opened from the Schedule follows the dark theme too."* |
| `§11-L303.A2` | *"It is built on the design-system color tokens, so surfaces, borders, text"* | NOT-INDEPENDENTLY-TESTABLE | — | Design-system colour tokens remapping is implementation, not observable behaviour. Its observable consequence - everything stays readable in dark mode |
| `§11-L303.A3` | *"accents remap automatically"* | NOT-INDEPENDENTLY-TESTABLE | — | 'accents remap automatically' - same as above; implementation, observable consequence covered by C38866. |
| `§11-L303.A4` | *"elevation/shadow tokens also swap so depth reads correctly on dark surfaces."* | PARTIAL | **SCH-EDGE-08 = [C38866](https://shopview.testrail.io/index.php?/cases/view/38866)** | *"Schedule and all its dialogs display correctly in dark mode"* |

### §12 Edge cases and constraints

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§12-L305.A1` | *"A technician can have multiple shifts on the same day (different work orders)"* | COVERED | **SCH-LANE-01 = [C29996](https://shopview.testrail.io/index.php?/cases/view/29996)** | *"Both shifts are created and shown on the same day for the same technician - multiple same-day shifts from different work orders are allowed."* |
| `§12-L305.A2` | *"overlapping times render in parallel lanes with a 3-lane cap and "+N more" overflow (§4.7)."* | NOT-INDEPENDENTLY-TESTABLE | — | Cross-reference to §4.7's 3-lane cap and '+N more'; covered there by C29998 and C29999. |
| `§12-L306.A1` | *"Every shift has a start time, resolved from the hierarchy in §4.2 or from the drop position in day view"* | NOT-INDEPENDENTLY-TESTABLE | — | Cross-reference to §4.2's start-time hierarchy; covered there by C29969/C29970/C29971/C29972. |
| `§12-L306.A2` | *"unassigned shifts use the same rules minus technician hours until they are assigned."* | NOT-INDEPENDENTLY-TESTABLE | — | Cross-reference to §4.2's unassigned rule; covered there by C29973/C29974/C29975. |
| `§12-L307.A1` | *"Shop closures (holidays, inventory days) are defined at the shop level and block the spread step from placing shifts on those days."* | BLOCKED | **SCH-EDGE-05 = [C30089](https://shopview.testrail.io/index.php?/cases/view/30089)** | held — see the row above |
| `§12-L308.A1` | *"Dropping the same work order on multiple technicians creates independent series, each spreading the full estimate, so planned hours across technicians may exceed the estimate."* | NOT-INDEPENDENTLY-TESTABLE | — | Cross-reference to §4.5's independent-series rule; covered there by C29986. |
| `§12-L308.A2` | *"This is expected, since clocked-in time drives progress."* | COVERED | **SCH-SPREAD-10 = [C29986](https://shopview.testrail.io/index.php?/cases/view/29986)** | *"Planned hours across technicians may now exceed the estimate - this is expected and produces no error (progress is driven by clocked-in time)."* |
| `§12-L309.A1` | *"Whole-order and multi-line-subset shifts both render as "N Lines" on the block"* | COVERED | **SCH-BLOCK-02 = [C29992](https://shopview.testrail.io/index.php?/cases/view/29992)** | *"Whole-order and multi-line shifts both read 'N Lines' on the block"* |
| `§12-L309.A2` | *"the detail modal and hover tooltip provide the specifics."* | NOT-INDEPENDENTLY-TESTABLE | — | Cross-reference: the modal and tooltip specifics are covered by C30011 and C30034. |
| `§12-L310.A1` | *"Dragging a shift between technicians reassigns it, adding the target technician to the affected line's roster and removing the source technician."* | NOT-INDEPENDENTLY-TESTABLE | — | Cross-reference to §7's reassignment rule; covered there by C30052 and C43556. |

### §14 Roles and permissions

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§14-L328.A1` | *"The Schedule is a CRUD area in ShopView's custom roles and permissions system."* | COVERED | **SCH-PERM-01 = [C30074](https://shopview.testrail.io/index.php?/cases/view/30074)** | *"A test user's role has Schedule: View but NOT Edit (assign a suitable system role or a purpose-made custom role; restore after)."* |
| `§14-L328.A2` | *"Access is controlled by three independent permission levels (View, Edit, Delete), where Delete requires Edit and Edit requires View."* | COVERED | **SCH-PERM-07 = [C30080](https://shopview.testrail.io/index.php?/cases/view/30080)** | *"Permission tiers nest: Delete requires Edit, Edit requires View"* |
| `§14-L328.A3` | *"The schedule also depends on permissions from other areas, particularly Work Orders."* | COVERED | **SCH-PERM-08 = [C30081](https://shopview.testrail.io/index.php?/cases/view/30081)** | *"Schedule without Work Orders: View - the sidebar hides the work order list"* |

### §14.1 Permission tiers

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§14.1-L330.A1` | *"Schedule: View. The user can see the schedule page, navigate between day/week/month views, use the mini calendar, search, filter, view all technicians' shifts and events, hover for tooltips"* | COVERED | **SCH-REAS-03 = [C30054](https://shopview.testrail.io/index.php?/cases/view/30054)** | *"You are on the Schedule page in week view (the same menu is offered in month view)."* |
| `§14.1-L330.A2` | *"open shift/event detail modals in read-only mode."* | COVERED | **SCH-PERM-01 = [C30074](https://shopview.testrail.io/index.php?/cases/view/30074)** | *"Tooltips show on hover, and the shift/event detail modals open in read-only mode."* |
| `§14.1-L330.A3` | *"All editing affordances (drag handles, drop targets, right-click context menu, resize handles, creation entry points, edit fields in modals, reassign and delete actions) are hidden or disabled."* | COVERED | **SCH-PERM-02 = [C30075](https://shopview.testrail.io/index.php?/cases/view/30075)** | *"In the modal, edit fields are hidden or disabled, and the reassign and delete actions are absent."* |
| `§14.1-L330.A4` | *"This is the experience for roles like Technician, Parts Manager, Parts Tech, Office, and Time Clock."* | COVERED | **SCH-PERM-13 = [C38926](https://shopview.testrail.io/index.php?/cases/view/38926)** | *"Take these roles one at a time - Technician, Parts Manager, Parts Tech, Office, Time Clock - use 'Reset To Template' so the role is back at its default, then read its Schedule permissions (View, Edit, Delete)."* |
| `§14.1-L330.A5` | *"When Schedule: View is OFF, the Schedule top-level nav item is hidden entirely."* | COVERED | **SCH-PERM-03 = [C30076](https://shopview.testrail.io/index.php?/cases/view/30076)** | *"With Schedule: View OFF, the Schedule top-level nav item is hidden entirely"* |
| `§14.1-L331.A1` | *"Schedule: Edit (requires View)."* | COVERED | **SCH-PERM-07 = [C30080](https://shopview.testrail.io/index.php?/cases/view/30080)** | *"Permission tiers nest: Delete requires Edit, Edit requires View"* |
| `§14.1-L331.A2` | *"Unlocks all creation and modification interactions: drag-and-drop from the sidebar, the scope picker, the spread modal, shift and event creation (including via right-click context menu and day-view click-to-create), shift reassignment between technicians, edge-resize and horizontal drag in day view"* | COVERED | **SCH-PERM-04 = [C30077](https://shopview.testrail.io/index.php?/cases/view/30077)** | *"Shift and event creation works, including via the menu opened by left-clicking empty grid space in both week and day view."* |
| `§14.1-L331.A3` | *"editing fields in the shift/event detail modals."* | COVERED | **SCH-PERM-04 = [C30077](https://shopview.testrail.io/index.php?/cases/view/30077)** | *"Edit fields in the shift and event detail modals."* |
| `§14.1-L331.A4` | *"This is the level for Service Manager, Senior Service Advisor, Service Advisor, and Foreman roles."* | COVERED | **SCH-PERM-13 = [C38926](https://shopview.testrail.io/index.php?/cases/view/38926)** | *"Do the same for these roles - Service Manager, Senior Service Advisor, Service Advisor, Foreman - and read their Schedule permissions."* |
| `§14.1-L332.A1` | *"Schedule: Delete (requires Edit)."* | COVERED | **SCH-PERM-07 = [C30080](https://shopview.testrail.io/index.php?/cases/view/30080)** | *"Permission tiers nest: Delete requires Edit, Edit requires View"* |
| `§14.1-L332.A2` | *"Unlocks deleting shifts and events, including series-aware deletion with its three scopes (this shift / this and after / whole series)."* | COVERED | **SCH-PERM-06 = [C30079](https://shopview.testrail.io/index.php?/cases/view/30079)** | *"Series deletion offers its scopes (this shift / this and after / whole series)."* |
| `§14.1-L332.A3` | *"Without Delete, a user with Edit can create and modify but cannot remove shifts or events."* | COVERED | **SCH-PERM-05 = [C30078](https://shopview.testrail.io/index.php?/cases/view/30078)** | *"Edit without Delete: the user can create and modify but not remove"* |
| `§14.1-L332.A4` | *"The delete action and the trash icon are hidden."* | COVERED | **SCH-PERM-05 = [C30078](https://shopview.testrail.io/index.php?/cases/view/30078)** | *"The delete action and the trash icon are hidden in the shift modal."* |

### §14.2 Work order sidebar dependency

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§14.2-L334.A1` | *"The left panel sidebar displays work order data (customer, unit, lines, lead tech) and requires Work Orders: View to populate."* | COVERED | **SCH-API-03 = [C38874](https://shopview.testrail.io/index.php?/cases/view/38874)** | *"As the user WITHOUT Work Orders: View, call GET /api/schedule/board and GET /api/schedule/shifts/{id} and read the work-order-derived fields (customer, unit, VIN, lines)."* |
| `§14.2-L334.A2` | *"If a user has Schedule access but Work Orders: View is OFF, the sidebar hides the work order list and line drill-down (the mini calendar remains available)."* | COVERED | **SCH-PERM-08 = [C30081](https://shopview.testrail.io/index.php?/cases/view/30081)** | *"The sidebar hides the work order list and the line drill-down; the mini calendar remains available."* |
| `§14.2-L334.A3` | *"The user can still view and interact with shifts already on the grid"* | COVERED | **SCH-PERM-08 = [C30081](https://shopview.testrail.io/index.php?/cases/view/30081)** | *"Interact with the shifts already on the grid (hover, open modal, and - if the role has Edit - move one)."* |
| `§14.2-L334.A4` | *"cannot drag new ones from the sidebar since the WO list is not visible."* | COVERED | **SCH-PERM-08 = [C30081](https://shopview.testrail.io/index.php?/cases/view/30081)** | *"New work orders cannot be dragged on - the WO list is simply not visible."* |

### §14.3 No permission-level "own only" restriction

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§14.3-L336.A1` | *"The schedule always shows all technicians' shifts and events for every user who has Schedule: View."* | COVERED | **SCH-API-03 = [C38874](https://shopview.testrail.io/index.php?/cases/view/38874)** | *"As the user WITHOUT Work Orders: View, call GET /api/schedule/board and GET /api/schedule/shifts/{id} and read the work-order-derived fields (customer, unit, VIN, lines)."* |
| `§14.3-L336.A2` | *"There is no role-based restriction to "own shifts only." This is intentional: the schedule is a shared coordination resource that service advisors and managers use to orchestrate work across the team."* | COVERED | **SCH-PERM-09 = [C30082](https://shopview.testrail.io/index.php?/cases/view/30082)** | *"The user sees ALL technicians' shifts and events, not only their own - there is no role-based 'own shifts only' restriction."* |
| `§14.3-L336.A3` | *"The "My Shifts" toggle in the Filter and Display dropdown (§9) provides this as an optional personal convenience filter, not a security boundary."* | COVERED | **SCH-PERM-09 = [C30082](https://shopview.testrail.io/index.php?/cases/view/30082)** | *"'My Shifts' exists only as an optional personal convenience filter (off by default), not a security boundary."* |

### §14.4 Technician grid rows are department-based

| Assertion | Requirement, verbatim | Verdict | Case | The case's own text, verbatim |
|---|---|---|---|---|
| `§14.4-L338.A1` | *"Whether a user appears as a row in the schedule grid is controlled by their department assignment on their staff record, not by their role permission."* | COVERED | **SCH-PERM-10 = [C30083](https://shopview.testrail.io/index.php?/cases/view/30083)** | *"The department-assigned staff member appears as a technician row - row presence is controlled by the department on the staff record, NOT by role permission."* |
| `§14.4-L338.A2` | *"Any staff member assigned to a department that is visible on the schedule appears as a technician row, regardless of their role."* | COVERED | **SCH-PERM-10 = [C30083](https://shopview.testrail.io/index.php?/cases/view/30083)** | *"A staff member with a NON-technician role (for example Office) is assigned to a department that is visible on the schedule (set up; restore after)."* |
| `§14.4-L338.A3` | *"Similarly, the ability to clock into work order line tasks is controlled by the "Time Clock" setting on the staff record, not by the permission model."* | COVERED | **SCH-PERM-11 = [C30084](https://shopview.testrail.io/index.php?/cases/view/30084)** | *"The Time-Clock-OFF staff member cannot - the ability is controlled by the staff-record setting, not by the Schedule permission tier."* |

---

## DIRECTION 2 — case → requirement: finds STALE and ORPHANED anchors

| | Count |
|---|---|
| Cases examined — every one of ours, read live | **168** |
| Foreign cases in the group (Rule 38) | **0** — all 168 are `created_by = 3` |
| **With a STALE § anchor** (cites a section that no longer exists in v27) | **0** |
| With no § anchor at all | **2** — both deliberate, both named below |
| **With a STALE SPEC VERSION in the provenance line** | **168** — every case says *"specification version 23"*; live is **27** |

**The stale-anchor count is 0 and the stale-version count is 168.** Those two numbers together are the honest state of the suite: no case points at a section that has vanished, and no case points at the version that is actually live. **Rule 54 requires the provenance line to be re-stamped whenever we re-check against the spec, and a stale stamp is itself a finding** — so this is reported, and the re-stamp is staged in `PROPOSED-CHANGES.md` rather than executed.

### The 2 cases with no § anchor — both anchored to a named non-spec source

| Case | Its `refs`, verbatim | Why this is correct |
|---|---|---|
| **SCH-API-04 = [C38875](https://shopview.testrail.io/index.php?/cases/view/38875)** *"API - A shift from another location returns 404, not another shop's data"* | `SV-8685 [epic - cross-cutting,no single-story owner] (tech-plan NFR-001 location scoping)` | Anchors to the **engineering tech plan**, a standard project input under Rule 30. The spec does not state location scoping; the tech plan does. |
| **SCH-NAV-08 = [C43554](https://shopview.testrail.io/index.php?/cases/view/43554)** *"Schedule opens on Day view the first time you open it from the navigation"* | `SV-8863 (SV-8686 acceptance criterion - grid displays with day view as default)` | Anchors to a **story acceptance criterion** because the specification is silent on the default view. Established 2026-08-05, which deliberately refused to invent a § anchor (Rule 12). |

**Spec sections bearing requirements: 33. With at least one case anchored to them: 32. With NO case: 1 — §5.3.**

§5.3 is the real one and it is the gap this map exists to surface. It is new in v27.

### Every case, with its anchors

| Case | Title | `refs` anchors | Stale? |
|---|---|---|---|
| **SCH-API-01 = [C38872](https://shopview.testrail.io/index.php?/cases/view/38872)** | API - Schedule reads need View; writes need Edit; deletes need Delete (403) | §14, §4 | no |
| **SCH-API-02 = [C38873](https://shopview.testrail.io/index.php?/cases/view/38873)** | API - Series past 8 weeks returns 409 until acknowledged; over 120 shifts 422 | §4.5 | no |
| **SCH-API-03 = [C38874](https://shopview.testrail.io/index.php?/cases/view/38874)** | API - No pricing fields in Schedule responses; WO details need Work Orders View | §14 | no |
| **SCH-API-04 = [C38875](https://shopview.testrail.io/index.php?/cases/view/38875)** | API - A shift from another location returns 404, not another shop's data | (none - see above) | no |
| **SCH-BLOCK-01 = [C29991](https://shopview.testrail.io/index.php?/cases/view/29991)** | A single-line shift block shows customer, unit number and line name | §4.4 | no |
| **SCH-BLOCK-02 = [C29992](https://shopview.testrail.io/index.php?/cases/view/29992)** | Whole-order and multi-line shifts both read 'N Lines' on the block | §12, §4.4 | no |
| **SCH-BLOCK-05 = [C29995](https://shopview.testrail.io/index.php?/cases/view/29995)** | The conflict icon is the only icon on a shift block | §4.4 | no |
| **SCH-CAP-01 = [C30030](https://shopview.testrail.io/index.php?/cases/view/30030)** | Capacity bar fill = booked (shifts + events) vs available, clamped, equal tracks | §4.12 | no |
| **SCH-CAP-02 = [C30031](https://shopview.testrail.io/index.php?/cases/view/30031)** | Over capacity, an amber spill extends past the track's right edge | §4.12 | no |
| **SCH-CAP-03 = [C30032](https://shopview.testrail.io/index.php?/cases/view/30032)** | 'OT' text tag appears when one technician exceeds their own daily hours | §11, §4.12 | no |
| **SCH-CAP-04 = [C30033](https://shopview.testrail.io/index.php?/cases/view/30033)** | Hovering a capacity bar shows a per-technician breakdown | §4.12 | no |
| **SCH-COLOR-01 = [C30071](https://shopview.testrail.io/index.php?/cases/view/30071)** | Blue is the default color for all shifts, including long and multi-week jobs | §10 | no |
| **SCH-COLOR-02 = [C30072](https://shopview.testrail.io/index.php?/cases/view/30072)** | Shift modal color picker recolors that shift only, in matching tones | §10, §4.4, §4.9 | no |
| **SCH-COLOR-03 = [C30073](https://shopview.testrail.io/index.php?/cases/view/30073)** | Color labels are editable per shop | §10, §4.10 | no |
| **SCH-CONF-01 = [C30023](https://shopview.testrail.io/index.php?/cases/view/30023)** | Double-booked: two overlapping work orders on one technician are flagged | §4.11 | no |
| **SCH-CONF-02 = [C30024](https://shopview.testrail.io/index.php?/cases/view/30024)** | Working-day conflict: a shift outside the tech's working days is flagged | §4.11 | no |
| **SCH-CONF-03 = [C30025](https://shopview.testrail.io/index.php?/cases/view/30025)** | Before-hours and after-hours shifts are flagged against the tech's hours | §4.11, §4.2 | no |
| **SCH-CONF-05 = [C30027](https://shopview.testrail.io/index.php?/cases/view/30027)** | The toolbar conflict pill shows the count and opens a list | §4.11, §6 | no |
| **SCH-CONF-06 = [C30028](https://shopview.testrail.io/index.php?/cases/view/30028)** | Clicking a conflict in the dropdown navigates to the relevant technician and day | §4.11 | no |
| **SCH-CONF-07 = [C30029](https://shopview.testrail.io/index.php?/cases/view/30029)** | Red styling is only for conflicts and errors, never for overtime | §4.11, §4.12 | no |
| **SCH-DAY-01 = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001)** | Day view auto-scrolls to the working-day start; manual scrolling stands | §4.8 | no |
| **SCH-DAY-03 = [C30003](https://shopview.testrail.io/index.php?/cases/view/30003)** | Date and time headers stick to the top during vertical scroll | §4.8 | no |
| **SCH-DAY-04 = [C30004](https://shopview.testrail.io/index.php?/cases/view/30004)** | Dragging a shift sideways moves its start time in 15-minute steps | §4.8, §7 | no |
| **SCH-DAY-05 = [C30005](https://shopview.testrail.io/index.php?/cases/view/30005)** | Dragging a shift's left or right edge resizes its duration | §4.8 | no |
| **SCH-DAY-06 = [C30006](https://shopview.testrail.io/index.php?/cases/view/30006)** | A now line marks the current time on today's day view, with a label on hover | §4.8 | no |
| **SCH-DEL-01 = [C30057](https://shopview.testrail.io/index.php?/cases/view/30057)** | Deleting a middle shift of a series offers all three scope options | §7 | no |
| **SCH-DEL-02 = [C30058](https://shopview.testrail.io/index.php?/cases/view/30058)** | 'This shift only' removes that day and the series keeps the gap | §7 | no |
| **SCH-DEL-03 = [C30059](https://shopview.testrail.io/index.php?/cases/view/30059)** | 'This and everything after' removes from the clicked shift onward | §7 | no |
| **SCH-DEL-04 = [C30060](https://shopview.testrail.io/index.php?/cases/view/30060)** | 'The whole series' removes all of the series' shifts for that technician | §7 | no |
| **SCH-DEL-05 = [C30061](https://shopview.testrail.io/index.php?/cases/view/30061)** | Scope options adapt: the first and last shift each show only two | §7 | no |
| **SCH-DEL-06 = [C30062](https://shopview.testrail.io/index.php?/cases/view/30062)** | Deleting a standalone (non-series) shift does not ask for a series scope | §7 | no |
| **SCH-DEL-08 = [C30064](https://shopview.testrail.io/index.php?/cases/view/30064)** | Toast lasts ~7s with Undo (about 4s without); stays on hover, goes on leave | §11, §7 | no |
| **SCH-DEL-09 = [C30065](https://shopview.testrail.io/index.php?/cases/view/30065)** | Every create/delete/move/reassign toasts with Undo, and Undo restores | §11, §7 | no |
| **SCH-DEL-10 = [C38864](https://shopview.testrail.io/index.php?/cases/view/38864)** | Schedule actions save immediately - Undo reverses them, closing does not cancel | §7 | no |
| **SCH-DND-01 = [C29955](https://shopview.testrail.io/index.php?/cases/view/29955)** | Dropping a single-line work order creates a shift with no scope picker | §1.2, §4.1, §7 | no |
| **SCH-DND-02 = [C29956](https://shopview.testrail.io/index.php?/cases/view/29956)** | Dropping a multi-line work order on a technician cell opens the scope picker | §4.1, §4.3 | no |
| **SCH-DND-03 = [C29957](https://shopview.testrail.io/index.php?/cases/view/29957)** | Dragging a line from the drill-down creates a single-line shift | §4.1 | no |
| **SCH-DND-04 = [C29958](https://shopview.testrail.io/index.php?/cases/view/29958)** | A job over the technician's daily hours opens the spread step | §4.1, §4.5 | no |
| **SCH-DND-05 = [C29959](https://shopview.testrail.io/index.php?/cases/view/29959)** | A scope that fits one working day skips the spread step | §4.1 | no |
| **SCH-DND-06 = [C29960](https://shopview.testrail.io/index.php?/cases/view/29960)** | While dragging, target cells highlight and a ghost block follows | §7 | no |
| **SCH-DND-07 = [C29961](https://shopview.testrail.io/index.php?/cases/view/29961)** | Scheduling a technician onto a line adds them to its labor roster | §1.2, §4.3, §7 | no |
| **SCH-DND-08 = [C29962](https://shopview.testrail.io/index.php?/cases/view/29962)** | A click-to-arm alternative exists for scheduling without dragging | §11, §7 | no |
| **SCH-DND-09 = [C43555](https://shopview.testrail.io/index.php?/cases/view/43555)** | Month view: dragging a work order onto a day creates a shift for that day | §4.1, §4.2 | no |
| **SCH-EDGE-02 = [C30086](https://shopview.testrail.io/index.php?/cases/view/30086)** | Below 960px the grid scrolls sideways and the sidebar collapses | §11 | no |
| **SCH-EDGE-03 = [C30087](https://shopview.testrail.io/index.php?/cases/view/30087)** | The sidebar work order list and line drill-down stay smooth with 50+ items | §11 | no |
| **SCH-EDGE-04 = [C30088](https://shopview.testrail.io/index.php?/cases/view/30088)** | The grid renders smoothly at full load - 15 technicians over 7 days | §11 | no |
| **SCH-EDGE-05 = [C30089](https://shopview.testrail.io/index.php?/cases/view/30089)** | Shop closures do NOT block spread in V1 - shifts can land on closure days | §12, §4.5 | no |
| **SCH-EDGE-06 = [C30090](https://shopview.testrail.io/index.php?/cases/view/30090)** | Scheduled, estimated and actual clocked hours are three separate numbers | §12, §4.5 | no |
| **SCH-EDGE-07 = [C38865](https://shopview.testrail.io/index.php?/cases/view/38865)** | A multi-week series keeps the same local start time across the clock change | §4.5 | no |
| **SCH-EDGE-08 = [C38866](https://shopview.testrail.io/index.php?/cases/view/38866)** | Schedule and all its dialogs display correctly in dark mode | §11 | no |
| **SCH-EVT-01 = [C30016](https://shopview.testrail.io/index.php?/cases/view/30016)** | Create an event via left-click 'Create Event' on empty grid space | §4.10, §7 | no |
| **SCH-EVT-02 = [C30017](https://shopview.testrail.io/index.php?/cases/view/30017)** | Day view event creation shows a live preview block you can drag to resize | §4.10 | no |
| **SCH-EVT-03 = [C30018](https://shopview.testrail.io/index.php?/cases/view/30018)** | Event modal fields all save; the all-day toggle creates an all-day event | §4.10, §8.1 | no |
| **SCH-EVT-05 = [C30020](https://shopview.testrail.io/index.php?/cases/view/30020)** | Events can be dragged to another technician or another day | §4.10, §7 | no |
| **SCH-EVT-06 = [C30021](https://shopview.testrail.io/index.php?/cases/view/30021)** | Event cards look structurally distinct from shift cards | §4.10 | no |
| **SCH-EVT-07 = [C30022](https://shopview.testrail.io/index.php?/cases/view/30022)** | Events default to grey; choosing a color tints the card and chip | §10, §4.10 | no |
| **SCH-EVT-08 = [C30615](https://shopview.testrail.io/index.php?/cases/view/30615)** | An event's hours count toward the capacity bar but raise no conflict | §4.10, §4.11, §4.12 | no |
| **SCH-FILT-01 = [C29942](https://shopview.testrail.io/index.php?/cases/view/29942)** | The 'Filters' button opens Assignment / Status / Priority filter groups | §5.1 | no |
| **SCH-FILT-02 = [C29943](https://shopview.testrail.io/index.php?/cases/view/29943)** | Assignment filter narrows the list to Assigned or Unassigned work orders | §3.1, §5.1 | no |
| **SCH-FILT-03 = [C29944](https://shopview.testrail.io/index.php?/cases/view/29944)** | Status filter narrows the list to work orders in the chosen status(es) | §5.1 | no |
| **SCH-FILT-04 = [C29945](https://shopview.testrail.io/index.php?/cases/view/29945)** | Priority filter offers High, Medium, Low and narrows the list accordingly | §5.1 | no |
| **SCH-FILT-05 = [C29946](https://shopview.testrail.io/index.php?/cases/view/29946)** | 'Clear all' resets every applied sidebar filter in one click | §5.1 | no |
| **SCH-FILT-06 = [C29947](https://shopview.testrail.io/index.php?/cases/view/29947)** | Search and filter work together - both can be active at the same time | §5.1 | no |
| **SCH-HRS-02 = [C38847](https://shopview.testrail.io/index.php?/cases/view/38847)** | Business-hours toggle reveals a per-day (Mon-Sun) From-To editor | §4.2 | no |
| **SCH-HRS-03 = [C38848](https://shopview.testrail.io/index.php?/cases/view/38848)** | Edit Staff has a 'Set custom hours for this technician' toggle, off by default | §4.2 | no |
| **SCH-HRS-04 = [C38849](https://shopview.testrail.io/index.php?/cases/view/38849)** | A technician with no custom hours inherits the shop business hours | §4.2 | no |
| **SCH-HRS-05 = [C38850](https://shopview.testrail.io/index.php?/cases/view/38850)** | 'Add hours' appends a removable second range for split shifts, starting empty | §4.2 | no |
| **SCH-HRS-06 = [C38851](https://shopview.testrail.io/index.php?/cases/view/38851)** | Overlapping hour ranges block Save; incomplete rows are ignored | §4.2 | no |
| **SCH-KEY-01 = [C30066](https://shopview.testrail.io/index.php?/cases/view/30066)** | Escape closes the topmost open modal or popover, following the stacking order | §7 | no |
| **SCH-KEY-03 = [C30068](https://shopview.testrail.io/index.php?/cases/view/30068)** | Enter confirms the active dialog, but not inside a note textarea | §7 | no |
| **SCH-KEY-05 = [C30070](https://shopview.testrail.io/index.php?/cases/view/30070)** | Modals trap focus and all interactive elements are keyboard-reachable | §11 | no |
| **SCH-LANE-01 = [C29996](https://shopview.testrail.io/index.php?/cases/view/29996)** | Non-overlapping same-day shifts share one lane, even from different orders | §12, §4.7 | no |
| **SCH-LANE-02 = [C29997](https://shopview.testrail.io/index.php?/cases/view/29997)** | Shifts whose times intersect split into stacked lanes and the row grows to fit | §4.11, §4.7 | no |
| **SCH-LANE-03 = [C29998](https://shopview.testrail.io/index.php?/cases/view/29998)** | Visible lanes cap at 3; extra overlapping shifts collapse into '+N more' | §4.7 | no |
| **SCH-LANE-04 = [C29999](https://shopview.testrail.io/index.php?/cases/view/29999)** | Lane stacking and the '+N more' overflow apply in day, week, and month views | §4.7 | no |
| **SCH-LINE-01 = [C29948](https://shopview.testrail.io/index.php?/cases/view/29948)** | Work order card opens the line drill-down in place, with header and back control | §3.1 | no |
| **SCH-LINE-03 = [C29950](https://shopview.testrail.io/index.php?/cases/view/29950)** | Only approved work order lines appear in the drill-down | §3.1 | no |
| **SCH-LINE-04 = [C29951](https://shopview.testrail.io/index.php?/cases/view/29951)** | Line row shows title, hours, the technician roster and a drag handle | §3.1, §8.1 | no |
| **SCH-LINE-05 = [C29952](https://shopview.testrail.io/index.php?/cases/view/29952)** | Lines with no technician assigned show a 'Needs techs' badge | §3.1 | no |
| **SCH-LINE-06 = [C29953](https://shopview.testrail.io/index.php?/cases/view/29953)** | 'Search lines' matches the line title/name only | §3.1 | no |
| **SCH-LINE-07 = [C29954](https://shopview.testrail.io/index.php?/cases/view/29954)** | 'All / Unscheduled' filter chips show counts and filter the line list | §3.1, §5.1 | no |
| **SCH-MCAL-01 = [C29932](https://shopview.testrail.io/index.php?/cases/view/29932)** | Clicking a date in the mini calendar navigates the main grid to that date | §3.1, §5.2 | no |
| **SCH-MCAL-02 = [C29933](https://shopview.testrail.io/index.php?/cases/view/29933)** | Mini calendar month/year picker has month buttons and year arrows | §5.2 | no |
| **SCH-MCAL-03 = [C29934](https://shopview.testrail.io/index.php?/cases/view/29934)** | A chevron toggle collapses and expands the mini calendar grid | §3.1, §5.2 | no |
| **SCH-MCAL-04 = [C29935](https://shopview.testrail.io/index.php?/cases/view/29935)** | Mini calendar highlights the selected date, today, and the hovered week | §5.2 | no |
| **SCH-MODAL-01 = [C30008](https://shopview.testrail.io/index.php?/cases/view/30008)** | Clicking a shift opens its detail modal, with VIN always visible | §4.9, §9 | no |
| **SCH-MODAL-02 = [C30009](https://shopview.testrail.io/index.php?/cases/view/30009)** | Scheduled date and start/end time pickers work in 15-minute increments | §4.9 | no |
| **SCH-MODAL-03 = [C30010](https://shopview.testrail.io/index.php?/cases/view/30010)** | The modal shows the technician and time logged vs estimate progress | §4.9 | no |
| **SCH-MODAL-04 = [C30011](https://shopview.testrail.io/index.php?/cases/view/30011)** | The modal lists the scheduled line(s) with no money fields | §4.4, §4.9 | no |
| **SCH-MODAL-05 = [C30012](https://shopview.testrail.io/index.php?/cases/view/30012)** | Estimated hours can be edited inline in the modal | §4.9 | no |
| **SCH-MODAL-06 = [C30013](https://shopview.testrail.io/index.php?/cases/view/30013)** | Notes can be added, edited, and deleted per work order from the modal | §4.9 | no |
| **SCH-MODAL-07 = [C30014](https://shopview.testrail.io/index.php?/cases/view/30014)** | A conflicted shift's modal shows a conflict banner with an 'Adjust' action | §4.9 | no |
| **SCH-MODAL-08 = [C30015](https://shopview.testrail.io/index.php?/cases/view/30015)** | Shift modal offers Delete only - there is no Reassign action | §4.9, §7 | no |
| **SCH-NAV-01 = [C29925](https://shopview.testrail.io/index.php?/cases/view/29925)** | Schedule opens from the top-level navigation into a sidebar + grid layout | §3, §3.1, §3.2 | no |
| **SCH-NAV-03 = [C29927](https://shopview.testrail.io/index.php?/cases/view/29927)** | Day / Week / Month segmented control switches the grid between the three views | §3.2, §6 | no |
| **SCH-NAV-04 = [C29928](https://shopview.testrail.io/index.php?/cases/view/29928)** | Grid rows are grouped by department under group headers | §14.4, §3.2 | no |
| **SCH-NAV-05 = [C29929](https://shopview.testrail.io/index.php?/cases/view/29929)** | Collapsing a department header hides its technician rows | §3.2 | no |
| **SCH-NAV-06 = [C29930](https://shopview.testrail.io/index.php?/cases/view/29930)** | No Tech/Dept toggle - department grouping is the only grid grouping | §3.2 | no |
| **SCH-NAV-07 = [C29931](https://shopview.testrail.io/index.php?/cases/view/29931)** | An Unassigned row sits inside the grid, not in a separate tray | §3.2, §4.2 | no |
| **SCH-NAV-08 = [C43554](https://shopview.testrail.io/index.php?/cases/view/43554)** | Schedule opens on Day view the first time you open it from the navigation | (none - see above) | no |
| **SCH-PERM-01 = [C30074](https://shopview.testrail.io/index.php?/cases/view/30074)** | Schedule: View grants the full read-only experience across the whole page | §14.1, §14.3 | no |
| **SCH-PERM-02 = [C30075](https://shopview.testrail.io/index.php?/cases/view/30075)** | View-only: every editing affordance is hidden or disabled | §14.1 | no |
| **SCH-PERM-03 = [C30076](https://shopview.testrail.io/index.php?/cases/view/30076)** | With Schedule: View OFF, the Schedule top-level nav item is hidden entirely | §14.1 | no |
| **SCH-PERM-04 = [C30077](https://shopview.testrail.io/index.php?/cases/view/30077)** | Schedule: Edit unlocks all creation and modification interactions | §14.1 | no |
| **SCH-PERM-05 = [C30078](https://shopview.testrail.io/index.php?/cases/view/30078)** | Edit without Delete: the user can create and modify but not remove | §14.1 | no |
| **SCH-PERM-06 = [C30079](https://shopview.testrail.io/index.php?/cases/view/30079)** | Schedule: Delete unlocks deleting shifts and events | §14.1 | no |
| **SCH-PERM-07 = [C30080](https://shopview.testrail.io/index.php?/cases/view/30080)** | Permission tiers nest: Delete requires Edit, Edit requires View | §14 | no |
| **SCH-PERM-08 = [C30081](https://shopview.testrail.io/index.php?/cases/view/30081)** | Schedule without Work Orders: View - the sidebar hides the work order list | §14.2 | no |
| **SCH-PERM-09 = [C30082](https://shopview.testrail.io/index.php?/cases/view/30082)** | No own-only restriction: a View user sees ALL technicians' shifts | §14.3 | no |
| **SCH-PERM-10 = [C30083](https://shopview.testrail.io/index.php?/cases/view/30083)** | Grid rows are department-based, not role-based | §14.4 | no |
| **SCH-PERM-11 = [C30084](https://shopview.testrail.io/index.php?/cases/view/30084)** | Clocking into line tasks is gated by the staff 'Time Clock' setting | §14.4 | no |
| **SCH-PERM-12 = [C30614](https://shopview.testrail.io/index.php?/cases/view/30614)** | With Work Orders: View OFF, work order details on shifts are hidden | §14.2 | no |
| **SCH-PERM-13 = [C38926](https://shopview.testrail.io/index.php?/cases/view/38926)** | Default roles start at the Schedule level the spec names (view-only vs edit) | §14.1 | no |
| **SCH-REAS-01 = [C30052](https://shopview.testrail.io/index.php?/cases/view/30052)** | Dragging a shift to another technician row reassigns it, with a confirm modal | §12, §7 | no |
| **SCH-REAS-03 = [C30054](https://shopview.testrail.io/index.php?/cases/view/30054)** | Left-click empty grid space opens a menu: Create Event and New Work Order | §14.1, §7 | no |
| **SCH-REAS-06 = [C38855](https://shopview.testrail.io/index.php?/cases/view/38855)** | 'New Work Order' in the cell menu points the user to the Work Orders tab | §4.10, §7 | no |
| **SCH-REAS-07 = [C43556](https://shopview.testrail.io/index.php?/cases/view/43556)** | Week view: a shift that is part of a repeating series can be reassigned | §12, §7 | no |
| **SCH-REG-01 = [C38867](https://shopview.testrail.io/index.php?/cases/view/38867)** | Shifts and events created before the Schedule rewrite still appear after it | §3 | no |
| **SCH-REG-02 = [C38868](https://shopview.testrail.io/index.php?/cases/view/38868)** | Dashboard shows one schedule row per work order even with many shifts | §4 | no |
| **SCH-REG-03 = [C38869](https://shopview.testrail.io/index.php?/cases/view/38869)** | A work order created with an appointment shows up on the Schedule board | §4 | no |
| **SCH-REG-04 = [C38870](https://shopview.testrail.io/index.php?/cases/view/38870)** | A multi-location technician's shift appears only on the work order's location | §3 | no |
| **SCH-REG-05 = [C38871](https://shopview.testrail.io/index.php?/cases/view/38871)** | Work order form offers a Priority (High/Medium/Low) that drives the sidebar | §5.1 | no |
| **SCH-SCOPE-01 = [C29963](https://shopview.testrail.io/index.php?/cases/view/29963)** | Scope picker contents: the pinned whole-order row and the line rows | §4.3 | no |
| **SCH-SCOPE-02 = [C29964](https://shopview.testrail.io/index.php?/cases/view/29964)** | 'Schedule whole work order' assigns all lines and creates one shift | §4.3, §4.4 | no |
| **SCH-SCOPE-03 = [C29965](https://shopview.testrail.io/index.php?/cases/view/29965)** | Tapping a line row creates a single-line shift with no confirm step | §4.3 | no |
| **SCH-SCOPE-05 = [C29967](https://shopview.testrail.io/index.php?/cases/view/29967)** | 'Select multiple' checkbox mode: running tally, Select all, and Cancel | §4.3 | no |
| **SCH-SER-01 = [C29987](https://shopview.testrail.io/index.php?/cases/view/29987)** | Month view: series banner wraps across weeks, labeled once, then 'continues' | §4.6 | no |
| **SCH-SER-02 = [C29988](https://shopview.testrail.io/index.php?/cases/view/29988)** | Week view: series banner spans the week, with chevrons and 'week N of M' | §4.6 | no |
| **SCH-SER-03 = [C29989](https://shopview.testrail.io/index.php?/cases/view/29989)** | Day view shows the series day as one block with a multi-week cue | §4.6 | no |
| **SCH-SER-04 = [C29990](https://shopview.testrail.io/index.php?/cases/view/29990)** | A series is just a grouping - capacity and conflicts use the daily shifts | §4.6, §8.2 | no |
| **SCH-SPREAD-02 = [C29978](https://shopview.testrail.io/index.php?/cases/view/29978)** | Spread step header shows the scope; 'Change scope' returns to the picker | §4.5 | no |
| **SCH-SPREAD-03 = [C29979](https://shopview.testrail.io/index.php?/cases/view/29979)** | How-much selector defaults to Full estimate; preset amounts apply at once | §4.5 | no |
| **SCH-SPREAD-04 = [C29980](https://shopview.testrail.io/index.php?/cases/view/29980)** | 'Until a date…' reveals a single finish-by date field | §4.5 | no |
| **SCH-SPREAD-05 = [C29981](https://shopview.testrail.io/index.php?/cases/view/29981)** | 'Specific hours…' reveals an hours stepper | §4.5 | no |
| **SCH-SPREAD-06 = [C29982](https://shopview.testrail.io/index.php?/cases/view/29982)** | Start date defaults to the earliest working day and can be changed | §4.5 | no |
| **SCH-SPREAD-07 = [C29983](https://shopview.testrail.io/index.php?/cases/view/29983)** | Spread uses the tech's working hours; skips weekends only when hours not set | §12, §4.5 | no |
| **SCH-SPREAD-08 = [C29984](https://shopview.testrail.io/index.php?/cases/view/29984)** | Spread preview: one-line summary, expandable to a week-by-week breakdown | §4.5 | no |
| **SCH-SPREAD-09 = [C29985](https://shopview.testrail.io/index.php?/cases/view/29985)** | Confirming the spread creates a linked series of daily shifts | §4.5, §4.6, §8.2 | no |
| **SCH-SPREAD-10 = [C29986](https://shopview.testrail.io/index.php?/cases/view/29986)** | The same work order on a second technician spreads the full estimate again | §12, §4.5 | no |
| **SCH-SPREAD-11 = [C38863](https://shopview.testrail.io/index.php?/cases/view/38863)** | Spread past 8 weeks asks to confirm; a series can never exceed 120 shifts | §4.5 | no |
| **SCH-START-01 = [C29969](https://shopview.testrail.io/index.php?/cases/view/29969)** | A shift's start time uses the technician's own working hours when set | §4.2 | no |
| **SCH-START-02 = [C29970](https://shopview.testrail.io/index.php?/cases/view/29970)** | With no technician hours set, start time falls back to business hours | §4.2 | no |
| **SCH-START-03 = [C29971](https://shopview.testrail.io/index.php?/cases/view/29971)** | With neither technician hours nor business hours set, a 7:00 AM default applies | §4.2 | no |
| **SCH-START-04 = [C29972](https://shopview.testrail.io/index.php?/cases/view/29972)** | In day view the start time comes from the drop position | §4.2 | no |
| **SCH-START-05 = [C29973](https://shopview.testrail.io/index.php?/cases/view/29973)** | Dropping onto the Unassigned row creates a shift with no technician | §3.2, §4.2 | no |
| **SCH-START-06 = [C29974](https://shopview.testrail.io/index.php?/cases/view/29974)** | Unassigned shift start time uses business hours or the default | §4.2 | no |
| **SCH-START-07 = [C29975](https://shopview.testrail.io/index.php?/cases/view/29975)** | Dragging an unassigned shift onto a technician row assigns it | §3.2, §4.2 | no |
| **SCH-TIP-01 = [C30034](https://shopview.testrail.io/index.php?/cases/view/30034)** | Shift hover tooltip shows the full shift summary incl. up to 3 line names | §4.13 | no |
| **SCH-TIP-02 = [C30035](https://shopview.testrail.io/index.php?/cases/view/30035)** | A conflicted shift's tooltip shows the icon and reason in amber | §4.13 | no |
| **SCH-TIP-03 = [C30036](https://shopview.testrail.io/index.php?/cases/view/30036)** | Event hover tooltip shows name, grey category dot, time range and tech | §4.13 | no |
| **SCH-TIP-04 = [C30037](https://shopview.testrail.io/index.php?/cases/view/30037)** | Tooltips open after a hover delay, dismiss on mouse-leave, are read-only | §4.13 | no |
| **SCH-TIP-05 = [C30038](https://shopview.testrail.io/index.php?/cases/view/30038)** | The tooltip flips or shifts to stay within the viewport - never clipped | §4.13 | no |
| **SCH-TOOL-01 = [C30039](https://shopview.testrail.io/index.php?/cases/view/30039)** | 'Today' button jumps the grid to the current date | §6 | no |
| **SCH-TOOL-02 = [C30040](https://shopview.testrail.io/index.php?/cases/view/30040)** | Left/right arrows step by day, week, or month to match the active range | §6 | no |
| **SCH-TOOL-03 = [C30041](https://shopview.testrail.io/index.php?/cases/view/30041)** | Toolbar search highlights matching blocks and fades non-matching ones | §6 | no |
| **SCH-VIEW-01 = [C30042](https://shopview.testrail.io/index.php?/cases/view/30042)** | 'Filter & Display' dropdown combines department toggles, My Shifts, and VIN | §6, §9 | no |
| **SCH-VIEW-02 = [C30043](https://shopview.testrail.io/index.php?/cases/view/30043)** | Department toggles show or hide individual department groups in the grid | §9 | no |
| **SCH-VIEW-03 = [C30044](https://shopview.testrail.io/index.php?/cases/view/30044)** | 'My Shifts' filters the grid to only the current user's shifts | §14.3, §9 | no |
| **SCH-VIEW-04 = [C30045](https://shopview.testrail.io/index.php?/cases/view/30045)** | 'VIN Number' toggle gates the block VIN only - tooltip and modal always show it | §4.4, §4.8, §9 | no |
| **SCH-VIEW-05 = [C30046](https://shopview.testrail.io/index.php?/cases/view/30046)** | 'View Options': six toggles with defaults; Capacity Bars and Events flip | §4.12, §6, §9 | no |
| **SCH-VIEW-06 = [C30047](https://shopview.testrail.io/index.php?/cases/view/30047)** | Business Hours toggle shades non-working hours in day view | §4.8, §9 | no |
| **SCH-VIEW-09 = [C30050](https://shopview.testrail.io/index.php?/cases/view/30050)** | Tech Hours toggle displays each technician's working hours next to their name | §9 | no |
| **SCH-VIEW-10 = [C30051](https://shopview.testrail.io/index.php?/cases/view/30051)** | Saturday and Sunday toggles include or exclude the weekend columns | §3.2, §9 | no |
| **SCH-WOL-01 = [C29936](https://shopview.testrail.io/index.php?/cases/view/29936)** | The sidebar is a flat list of work order cards with no tabs | §3.1, §5.1 | no |
| **SCH-WOL-02 = [C29937](https://shopview.testrail.io/index.php?/cases/view/29937)** | Work order card anatomy, incl. the status-colored left border | §3.1 | no |
| **SCH-WOL-04 = [C29939](https://shopview.testrail.io/index.php?/cases/view/29939)** | 'Search work orders' matches work order number, customer, unit, and technician | §3.1 | no |
| **SCH-WOL-05 = [C29940](https://shopview.testrail.io/index.php?/cases/view/29940)** | Sidebar search filters the card list in real time as you type | §3.1 | no |
| **SCH-WOL-06 = [C29941](https://shopview.testrail.io/index.php?/cases/view/29941)** | Sidebar search with no matching work orders shows an empty list | §3.1 | no |

---

## Both totals, reconciled

| | |
|---|---|
| Direction 1 — assertions verdicted | **397 of 397** |
| Direction 2 — cases examined | **168 of 168** |
| Cases named as covering something in Direction 1 | **see below** |
| — distinct cases named | **141** |
| — cases NOT named by any assertion | **27** |

**The cases no assertion named.** This is NOT a list of useless cases — the matcher names one best case per assertion, so a case that is a strong second everywhere is never named. Each is listed so the reader can check rather than take it on trust:

| Case | Title | Anchors |
|---|---|---|
| **SCH-API-01 = [C38872](https://shopview.testrail.io/index.php?/cases/view/38872)** | API - Schedule reads need View; writes need Edit; deletes need Delete (403) | §14, §4 |
| **SCH-API-02 = [C38873](https://shopview.testrail.io/index.php?/cases/view/38873)** | API - Series past 8 weeks returns 409 until acknowledged; over 120 shifts 422 | §4.5 |
| **SCH-API-04 = [C38875](https://shopview.testrail.io/index.php?/cases/view/38875)** | API - A shift from another location returns 404, not another shop's data | (none) |
| **SCH-DEL-06 = [C30062](https://shopview.testrail.io/index.php?/cases/view/30062)** | Deleting a standalone (non-series) shift does not ask for a series scope | §7 |
| **SCH-DEL-10 = [C38864](https://shopview.testrail.io/index.php?/cases/view/38864)** | Schedule actions save immediately - Undo reverses them, closing does not cancel | §7 |
| **SCH-EDGE-07 = [C38865](https://shopview.testrail.io/index.php?/cases/view/38865)** | A multi-week series keeps the same local start time across the clock change | §4.5 |
| **SCH-EVT-05 = [C30020](https://shopview.testrail.io/index.php?/cases/view/30020)** | Events can be dragged to another technician or another day | §4.10, §7 |
| **SCH-FILT-02 = [C29943](https://shopview.testrail.io/index.php?/cases/view/29943)** | Assignment filter narrows the list to Assigned or Unassigned work orders | §3.1, §5.1 |
| **SCH-FILT-03 = [C29944](https://shopview.testrail.io/index.php?/cases/view/29944)** | Status filter narrows the list to work orders in the chosen status(es) | §5.1 |
| **SCH-FILT-04 = [C29945](https://shopview.testrail.io/index.php?/cases/view/29945)** | Priority filter offers High, Medium, Low and narrows the list accordingly | §5.1 |
| **SCH-KEY-03 = [C30068](https://shopview.testrail.io/index.php?/cases/view/30068)** | Enter confirms the active dialog, but not inside a note textarea | §7 |
| **SCH-LINE-03 = [C29950](https://shopview.testrail.io/index.php?/cases/view/29950)** | Only approved work order lines appear in the drill-down | §3.1 |
| **SCH-NAV-05 = [C29929](https://shopview.testrail.io/index.php?/cases/view/29929)** | Collapsing a department header hides its technician rows | §3.2 |
| **SCH-NAV-08 = [C43554](https://shopview.testrail.io/index.php?/cases/view/43554)** | Schedule opens on Day view the first time you open it from the navigation | (none) |
| **SCH-PERM-12 = [C30614](https://shopview.testrail.io/index.php?/cases/view/30614)** | With Work Orders: View OFF, work order details on shifts are hidden | §14.2 |
| **SCH-REAS-06 = [C38855](https://shopview.testrail.io/index.php?/cases/view/38855)** | 'New Work Order' in the cell menu points the user to the Work Orders tab | §4.10, §7 |
| **SCH-REG-01 = [C38867](https://shopview.testrail.io/index.php?/cases/view/38867)** | Shifts and events created before the Schedule rewrite still appear after it | §3 |
| **SCH-REG-03 = [C38869](https://shopview.testrail.io/index.php?/cases/view/38869)** | A work order created with an appointment shows up on the Schedule board | §4 |
| **SCH-REG-04 = [C38870](https://shopview.testrail.io/index.php?/cases/view/38870)** | A multi-location technician's shift appears only on the work order's location | §3 |
| **SCH-REG-05 = [C38871](https://shopview.testrail.io/index.php?/cases/view/38871)** | Work order form offers a Priority (High/Medium/Low) that drives the sidebar | §5.1 |
| **SCH-SCOPE-05 = [C29967](https://shopview.testrail.io/index.php?/cases/view/29967)** | 'Select multiple' checkbox mode: running tally, Select all, and Cancel | §4.3 |
| **SCH-SPREAD-02 = [C29978](https://shopview.testrail.io/index.php?/cases/view/29978)** | Spread step header shows the scope; 'Change scope' returns to the picker | §4.5 |
| **SCH-SPREAD-11 = [C38863](https://shopview.testrail.io/index.php?/cases/view/38863)** | Spread past 8 weeks asks to confirm; a series can never exceed 120 shifts | §4.5 |
| **SCH-START-02 = [C29970](https://shopview.testrail.io/index.php?/cases/view/29970)** | With no technician hours set, start time falls back to business hours | §4.2 |
| **SCH-START-04 = [C29972](https://shopview.testrail.io/index.php?/cases/view/29972)** | In day view the start time comes from the drop position | §4.2 |
| **SCH-START-06 = [C29974](https://shopview.testrail.io/index.php?/cases/view/29974)** | Unassigned shift start time uses business hours or the default | §4.2 |
| **SCH-WOL-06 = [C29941](https://shopview.testrail.io/index.php?/cases/view/29941)** | Sidebar search with no matching work orders shows an empty list | §3.1 |
