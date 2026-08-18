# Schedule — CASES TOUCHED in the v27→v30 currency pass (2026-08-17)

Total touched: **148** (content-updated 5 + version-pin 142 + PO-hold restamp 1). Already-current (v30, untouched): 47. Suite total: 195.

## Content-updated (expectation aligned to spec v30) — 5
| Internal ID | C-id | Title | TestRail link |
|---|---|---|---|
| SCH-DEL-01 | C30057 | Deleting a middle shift of a series offers all three scope options | https://shopview.testrail.io/index.php?/cases/view/30057 |
| SCH-DEL-02 | C30058 | 'This shift only' removes that day and the series keeps the gap | https://shopview.testrail.io/index.php?/cases/view/30058 |
| SCH-MODAL-06 | C30013 | Notes can be added, edited, and deleted per shift from the modal | https://shopview.testrail.io/index.php?/cases/view/30013 |
| SCH-START-05 | C29973 | Dropping onto a department's unassigned lane creates a shift with no technician | https://shopview.testrail.io/index.php?/cases/view/29973 |
| SCH-START-06 | C29974 | Unassigned shift start time uses business hours or the app-level default | https://shopview.testrail.io/index.php?/cases/view/29974 |

## PO-question HOLD — minimal v30 re-stamp, HOLD kept — 1
| Internal ID | C-id | Title | TestRail link |
|---|---|---|---|
| SCH-DND-09 | C43555 | Month view: dragging a work order onto a day creates a shift for that day | https://shopview.testrail.io/index.php?/cases/view/43555 |

## Version-pin re-stamp (content already valid under v30) — 142
| Internal ID | C-id | Title | TestRail link |
|---|---|---|---|
| SCH-API-01 | C38872 | API - Schedule reads need View; writes need Edit; deletes need Delete (403) | https://shopview.testrail.io/index.php?/cases/view/38872 |
| SCH-API-02 | C38873 | API - Series past 8 weeks returns 409 until acknowledged; over 120 shifts 422 | https://shopview.testrail.io/index.php?/cases/view/38873 |
| SCH-API-03 | C38874 | API - No pricing fields in Schedule responses; WO details need Work Orders View | https://shopview.testrail.io/index.php?/cases/view/38874 |
| SCH-API-04 | C38875 | API - A shift from another location returns 404, not another shop's data | https://shopview.testrail.io/index.php?/cases/view/38875 |
| SCH-BLOCK-01 | C29991 | A single-line shift block shows customer, unit number and line name | https://shopview.testrail.io/index.php?/cases/view/29991 |
| SCH-BLOCK-02 | C29992 | Whole-order and multi-line shifts both read 'N Lines' on the block | https://shopview.testrail.io/index.php?/cases/view/29992 |
| SCH-BLOCK-05 | C29995 | The conflict icon is the only icon on a shift block | https://shopview.testrail.io/index.php?/cases/view/29995 |
| SCH-CAP-01 | C30030 | Capacity bar fill = booked (shifts + events) vs available, clamped, equal tracks | https://shopview.testrail.io/index.php?/cases/view/30030 |
| SCH-CAP-02 | C30031 | Over capacity, an amber spill extends past the track's right edge | https://shopview.testrail.io/index.php?/cases/view/30031 |
| SCH-CAP-03 | C30032 | 'OT' text tag appears when one technician exceeds their own daily hours | https://shopview.testrail.io/index.php?/cases/view/30032 |
| SCH-COLOR-01 | C30071 | Blue is the default color for all shifts, including long and multi-week jobs | https://shopview.testrail.io/index.php?/cases/view/30071 |
| SCH-COLOR-02 | C30072 | Shift modal color picker recolors that shift only, in matching tones | https://shopview.testrail.io/index.php?/cases/view/30072 |
| SCH-COLOR-03 | C30073 | Color labels are editable per shop | https://shopview.testrail.io/index.php?/cases/view/30073 |
| SCH-CONF-01 | C30023 | Double-booked: two overlapping work orders on one technician are flagged | https://shopview.testrail.io/index.php?/cases/view/30023 |
| SCH-CONF-05 | C30027 | The toolbar conflict pill shows the count and opens a list | https://shopview.testrail.io/index.php?/cases/view/30027 |
| SCH-CONF-06 | C30028 | Clicking a conflict in the dropdown navigates to the relevant technician and day | https://shopview.testrail.io/index.php?/cases/view/30028 |
| SCH-CONF-07 | C30029 | Red styling is only for conflicts and errors, never for overtime | https://shopview.testrail.io/index.php?/cases/view/30029 |
| SCH-DAY-03 | C30003 | Date and time headers stick to the top during vertical scroll | https://shopview.testrail.io/index.php?/cases/view/30003 |
| SCH-DAY-06 | C30006 | A now line marks the current time on today's day view, with a label on hover | https://shopview.testrail.io/index.php?/cases/view/30006 |
| SCH-DEL-03 | C30059 | 'This and everything after' removes from the clicked shift onward | https://shopview.testrail.io/index.php?/cases/view/30059 |
| SCH-DEL-04 | C30060 | 'The whole series' removes all of the series' shifts for that technician | https://shopview.testrail.io/index.php?/cases/view/30060 |
| SCH-DEL-05 | C30061 | Scope options adapt: the first and last shift each show only two | https://shopview.testrail.io/index.php?/cases/view/30061 |
| SCH-DEL-06 | C30062 | Deleting a standalone (non-series) shift does not ask for a series scope | https://shopview.testrail.io/index.php?/cases/view/30062 |
| SCH-DEL-08 | C30064 | Toast stays 4 to 7 seconds, stays while hovered, goes when the cursor leaves | https://shopview.testrail.io/index.php?/cases/view/30064 |
| SCH-DEL-09 | C30065 | Every create/delete/move/reassign toasts with Undo, and Undo restores | https://shopview.testrail.io/index.php?/cases/view/30065 |
| SCH-DEL-10 | C38864 | Schedule actions save immediately - Undo reverses them, closing does not cancel | https://shopview.testrail.io/index.php?/cases/view/38864 |
| SCH-DND-02 | C29956 | Dropping a multi-line work order on a technician cell opens the scope picker | https://shopview.testrail.io/index.php?/cases/view/29956 |
| SCH-DND-03 | C29957 | Dragging a line from the drill-down creates a single-line shift | https://shopview.testrail.io/index.php?/cases/view/29957 |
| SCH-DND-05 | C29959 | A scope that fits one working day skips the spread step | https://shopview.testrail.io/index.php?/cases/view/29959 |
| SCH-DND-06 | C29960 | While dragging, target cells highlight and a ghost block follows | https://shopview.testrail.io/index.php?/cases/view/29960 |
| SCH-DND-07 | C29961 | Scheduling a technician onto a line adds them to its labor roster | https://shopview.testrail.io/index.php?/cases/view/29961 |
| SCH-DND-08 | C29962 | A click-to-arm alternative exists for scheduling without dragging | https://shopview.testrail.io/index.php?/cases/view/29962 |
| SCH-EDGE-02 | C30086 | Below 960px the grid scrolls sideways and the sidebar collapses | https://shopview.testrail.io/index.php?/cases/view/30086 |
| SCH-EDGE-03 | C30087 | The sidebar work order list and line drill-down stay smooth with 50+ items | https://shopview.testrail.io/index.php?/cases/view/30087 |
| SCH-EDGE-04 | C30088 | The grid renders smoothly at full load - 15 technicians over 7 days | https://shopview.testrail.io/index.php?/cases/view/30088 |
| SCH-EDGE-06 | C30090 | Scheduled, estimated and actual clocked hours are three separate numbers | https://shopview.testrail.io/index.php?/cases/view/30090 |
| SCH-EDGE-07 | C38865 | A multi-week series keeps the same local start time across the clock change | https://shopview.testrail.io/index.php?/cases/view/38865 |
| SCH-EDGE-08 | C38866 | Schedule and all its dialogs display correctly in dark mode | https://shopview.testrail.io/index.php?/cases/view/38866 |
| SCH-EDGE-09 | C43588 | Dark mode is chosen from the user menu and is remembered for you | https://shopview.testrail.io/index.php?/cases/view/43588 |
| SCH-EDGE-10 | C43589 | In dark mode pop-up windows still look raised above the page | https://shopview.testrail.io/index.php?/cases/view/43589 |
| SCH-EVT-01 | C30016 | Create an event via left-click 'Create Event' on empty grid space | https://shopview.testrail.io/index.php?/cases/view/30016 |
| SCH-EVT-02 | C30017 | Day view event creation shows a live preview block you can drag to resize | https://shopview.testrail.io/index.php?/cases/view/30017 |
| SCH-EVT-03 | C30018 | Event modal fields all save; the all-day toggle creates an all-day event | https://shopview.testrail.io/index.php?/cases/view/30018 |
| SCH-EVT-05 | C30020 | Events can be dragged to another technician or another day | https://shopview.testrail.io/index.php?/cases/view/30020 |
| SCH-EVT-06 | C30021 | Event cards look structurally distinct from shift cards | https://shopview.testrail.io/index.php?/cases/view/30021 |
| SCH-EVT-07 | C30022 | Events default to grey; choosing a color tints the card and chip | https://shopview.testrail.io/index.php?/cases/view/30022 |
| SCH-EVT-08 | C30615 | An event's hours count toward the capacity bar but raise no conflict | https://shopview.testrail.io/index.php?/cases/view/30615 |
| SCH-FILT-01 | C29942 | The 'Filters' button opens Assignment / Status / Priority filter groups | https://shopview.testrail.io/index.php?/cases/view/29942 |
| SCH-FILT-02 | C29943 | Assignment filter narrows the list to Assigned or Unassigned work orders | https://shopview.testrail.io/index.php?/cases/view/29943 |
| SCH-FILT-03 | C29944 | Status filter narrows the list to work orders in the chosen status(es) | https://shopview.testrail.io/index.php?/cases/view/29944 |
| SCH-FILT-04 | C29945 | Priority filter offers High, Medium, Low and narrows the list accordingly | https://shopview.testrail.io/index.php?/cases/view/29945 |
| SCH-FILT-05 | C29946 | 'Clear all' resets every applied sidebar filter in one click | https://shopview.testrail.io/index.php?/cases/view/29946 |
| SCH-FILT-06 | C29947 | Search and filter work together - both can be active at the same time | https://shopview.testrail.io/index.php?/cases/view/29947 |
| SCH-HRS-02 | C38847 | Business-hours toggle reveals a per-day (Mon-Sun) From-To editor | https://shopview.testrail.io/index.php?/cases/view/38847 |
| SCH-HRS-03 | C38848 | Edit Staff has a 'Set working hours for this technician' toggle, off by default | https://shopview.testrail.io/index.php?/cases/view/38848 |
| SCH-HRS-04 | C38849 | A technician with no custom hours inherits the shop business hours | https://shopview.testrail.io/index.php?/cases/view/38849 |
| SCH-HRS-05 | C38850 | 'Add Hours' appends a removable second range for split shifts, starting empty | https://shopview.testrail.io/index.php?/cases/view/38850 |
| SCH-HRS-06 | C38851 | Overlapping hour ranges block Save; incomplete rows are ignored | https://shopview.testrail.io/index.php?/cases/view/38851 |
| SCH-KEY-01 | C30066 | Escape closes the topmost open modal or popover, following the stacking order | https://shopview.testrail.io/index.php?/cases/view/30066 |
| SCH-KEY-03 | C30068 | Enter confirms the active dialog, but not inside a note textarea | https://shopview.testrail.io/index.php?/cases/view/30068 |
| SCH-KEY-05 | C30070 | Modals trap focus and all interactive elements are keyboard-reachable | https://shopview.testrail.io/index.php?/cases/view/30070 |
| SCH-LANE-01 | C29996 | Non-overlapping same-day shifts share one lane, even from different orders | https://shopview.testrail.io/index.php?/cases/view/29996 |
| SCH-LANE-02 | C29997 | Shifts whose times intersect split into stacked lanes and the row grows to fit | https://shopview.testrail.io/index.php?/cases/view/29997 |
| SCH-LANE-03 | C29998 | Visible lanes cap at 3; extra overlapping shifts collapse into '+N more' | https://shopview.testrail.io/index.php?/cases/view/29998 |
| SCH-LANE-04 | C29999 | Lane stacking and the '+N more' overflow apply in day, week, and month views | https://shopview.testrail.io/index.php?/cases/view/29999 |
| SCH-LINE-01 | C29948 | Work order card opens the line drill-down in place, with header and back control | https://shopview.testrail.io/index.php?/cases/view/29948 |
| SCH-LINE-03 | C29950 | Only approved work order lines appear in the drill-down | https://shopview.testrail.io/index.php?/cases/view/29950 |
| SCH-LINE-04 | C29951 | Line row shows title, hours, the technician roster and a drag handle | https://shopview.testrail.io/index.php?/cases/view/29951 |
| SCH-LINE-05 | C29952 | Lines with no technician assigned show a 'Needs techs' badge | https://shopview.testrail.io/index.php?/cases/view/29952 |
| SCH-LINE-06 | C29953 | 'Search lines' matches the line title/name only | https://shopview.testrail.io/index.php?/cases/view/29953 |
| SCH-LINE-07 | C29954 | 'All / Unscheduled' filter chips show counts and filter the line list | https://shopview.testrail.io/index.php?/cases/view/29954 |
| SCH-MCAL-01 | C29932 | Clicking a date in the mini calendar navigates the main grid to that date | https://shopview.testrail.io/index.php?/cases/view/29932 |
| SCH-MCAL-02 | C29933 | Mini calendar month/year picker has month buttons and year arrows | https://shopview.testrail.io/index.php?/cases/view/29933 |
| SCH-MCAL-03 | C29934 | A chevron toggle collapses and expands the mini calendar grid | https://shopview.testrail.io/index.php?/cases/view/29934 |
| SCH-MCAL-04 | C29935 | Mini calendar highlights the selected date, today, and the hovered week | https://shopview.testrail.io/index.php?/cases/view/29935 |
| SCH-MODAL-01 | C30008 | Clicking a shift opens its detail modal, with VIN always visible | https://shopview.testrail.io/index.php?/cases/view/30008 |
| SCH-MODAL-04 | C30011 | The modal lists the scheduled line(s) with no money fields | https://shopview.testrail.io/index.php?/cases/view/30011 |
| SCH-MODAL-05 | C30012 | Estimated hours can be edited inline in the modal | https://shopview.testrail.io/index.php?/cases/view/30012 |
| SCH-MODAL-07 | C30014 | A conflicted shift's modal shows a conflict banner with an 'Adjust' action | https://shopview.testrail.io/index.php?/cases/view/30014 |
| SCH-MODAL-08 | C30015 | Shift modal offers Delete only - there is no Reassign action | https://shopview.testrail.io/index.php?/cases/view/30015 |
| SCH-NAV-01 | C29925 | Schedule opens from the top-level navigation into a sidebar + grid layout | https://shopview.testrail.io/index.php?/cases/view/29925 |
| SCH-NAV-03 | C29927 | Day / Week / Month segmented control switches the grid between the three views | https://shopview.testrail.io/index.php?/cases/view/29927 |
| SCH-NAV-04 | C29928 | Grid rows are grouped by department under group headers | https://shopview.testrail.io/index.php?/cases/view/29928 |
| SCH-NAV-05 | C29929 | Collapsing a department header hides its technician rows | https://shopview.testrail.io/index.php?/cases/view/29929 |
| SCH-NAV-06 | C29930 | No Tech/Dept toggle - department grouping is the only grid grouping | https://shopview.testrail.io/index.php?/cases/view/29930 |
| SCH-NAV-08 | C43554 | Schedule opens on Day view the first time you open it from the navigation | https://shopview.testrail.io/index.php?/cases/view/43554 |
| SCH-PERM-01 | C30074 | Schedule: View grants the full read-only experience across the whole page | https://shopview.testrail.io/index.php?/cases/view/30074 |
| SCH-PERM-02 | C30075 | View-only: every editing affordance is hidden or disabled | https://shopview.testrail.io/index.php?/cases/view/30075 |
| SCH-PERM-03 | C30076 | With Schedule: View OFF, the Schedule top-level nav item is hidden entirely | https://shopview.testrail.io/index.php?/cases/view/30076 |
| SCH-PERM-04 | C30077 | Schedule: Edit unlocks all creation and modification interactions | https://shopview.testrail.io/index.php?/cases/view/30077 |
| SCH-PERM-05 | C30078 | Edit without Delete: the user can create and modify but not remove | https://shopview.testrail.io/index.php?/cases/view/30078 |
| SCH-PERM-06 | C30079 | Schedule: Delete unlocks deleting shifts and events | https://shopview.testrail.io/index.php?/cases/view/30079 |
| SCH-PERM-07 | C30080 | Permission tiers nest: Delete requires Edit, Edit requires View | https://shopview.testrail.io/index.php?/cases/view/30080 |
| SCH-PERM-08 | C30081 | Schedule without Work Orders: View - the sidebar hides the work order list | https://shopview.testrail.io/index.php?/cases/view/30081 |
| SCH-PERM-09 | C30082 | No own-only restriction: a View user sees ALL technicians' shifts | https://shopview.testrail.io/index.php?/cases/view/30082 |
| SCH-PERM-10 | C30083 | Grid rows are department-based, not role-based | https://shopview.testrail.io/index.php?/cases/view/30083 |
| SCH-PERM-11 | C30084 | Clocking into line tasks is gated by the staff 'Time Clock' setting | https://shopview.testrail.io/index.php?/cases/view/30084 |
| SCH-PERM-12 | C30614 | With Work Orders: View OFF, work order details on shifts are hidden | https://shopview.testrail.io/index.php?/cases/view/30614 |
| SCH-PERM-13 | C38926 | Default roles start at the Schedule level the spec names (view-only vs edit) | https://shopview.testrail.io/index.php?/cases/view/38926 |
| SCH-REAS-01 | C30052 | Dragging a shift to another technician row reassigns it, with a confirm modal | https://shopview.testrail.io/index.php?/cases/view/30052 |
| SCH-REAS-06 | C38855 | 'New Work Order' in the cell menu points the user to the Work Orders tab | https://shopview.testrail.io/index.php?/cases/view/38855 |
| SCH-REAS-07 | C43556 | Week view: a shift that is part of a repeating series can be reassigned | https://shopview.testrail.io/index.php?/cases/view/43556 |
| SCH-REG-01 | C38867 | Shifts and events created before the Schedule rewrite still appear after it | https://shopview.testrail.io/index.php?/cases/view/38867 |
| SCH-REG-02 | C38868 | Dashboard shows one schedule row per work order even with many shifts | https://shopview.testrail.io/index.php?/cases/view/38868 |
| SCH-REG-03 | C38869 | A work order created with an appointment shows up on the Schedule board | https://shopview.testrail.io/index.php?/cases/view/38869 |
| SCH-REG-04 | C38870 | A multi-location technician's shift appears only on the work order's location | https://shopview.testrail.io/index.php?/cases/view/38870 |
| SCH-REG-05 | C38871 | Work order form offers a Priority (High/Medium/Low) that drives the sidebar | https://shopview.testrail.io/index.php?/cases/view/38871 |
| SCH-SCOPE-01 | C29963 | Scope picker contents: the pinned whole-order row and the line rows | https://shopview.testrail.io/index.php?/cases/view/29963 |
| SCH-SCOPE-02 | C29964 | 'Schedule whole work order' assigns all lines and creates one shift | https://shopview.testrail.io/index.php?/cases/view/29964 |
| SCH-SCOPE-03 | C29965 | Tapping a line row creates a single-line shift with no confirm step | https://shopview.testrail.io/index.php?/cases/view/29965 |
| SCH-SCOPE-05 | C29967 | 'Select multiple' checkbox mode: running tally, Select all, and Cancel | https://shopview.testrail.io/index.php?/cases/view/29967 |
| SCH-SER-01 | C29987 | Month view: series banner wraps across weeks, labeled once, then 'continues' | https://shopview.testrail.io/index.php?/cases/view/29987 |
| SCH-SER-02 | C29988 | Week view: series banner spans the week, with chevrons and 'week N of M' | https://shopview.testrail.io/index.php?/cases/view/29988 |
| SCH-SER-03 | C29989 | Day view shows the series day as one block with a multi-week cue | https://shopview.testrail.io/index.php?/cases/view/29989 |
| SCH-SER-04 | C29990 | A series is just a grouping - capacity and conflicts use the daily shifts | https://shopview.testrail.io/index.php?/cases/view/29990 |
| SCH-SPREAD-02 | C29978 | Spread step header shows the scope; 'Change scope' returns to the picker | https://shopview.testrail.io/index.php?/cases/view/29978 |
| SCH-SPREAD-06 | C29982 | Start date defaults to the earliest working day and can be changed | https://shopview.testrail.io/index.php?/cases/view/29982 |
| SCH-SPREAD-09 | C29985 | Confirming the spread creates a linked series of daily shifts | https://shopview.testrail.io/index.php?/cases/view/29985 |
| SCH-SPREAD-10 | C29986 | The same work order on a second technician spreads the full estimate again | https://shopview.testrail.io/index.php?/cases/view/29986 |
| SCH-SPREAD-11 | C38863 | Spread past 8 weeks asks to confirm; a series can never exceed 120 shifts | https://shopview.testrail.io/index.php?/cases/view/38863 |
| SCH-START-01 | C29969 | A shift's start time uses the technician's own working hours when set | https://shopview.testrail.io/index.php?/cases/view/29969 |
| SCH-START-02 | C29970 | With no technician hours set, start time falls back to business hours | https://shopview.testrail.io/index.php?/cases/view/29970 |
| SCH-START-04 | C29972 | In day view the start time comes from the drop position | https://shopview.testrail.io/index.php?/cases/view/29972 |
| SCH-TIP-01 | C30034 | Shift hover tooltip shows the full shift summary incl. up to 3 line names | https://shopview.testrail.io/index.php?/cases/view/30034 |
| SCH-TIP-02 | C30035 | A conflicted shift's tooltip shows the icon and reason in amber | https://shopview.testrail.io/index.php?/cases/view/30035 |
| SCH-TIP-03 | C30036 | Event hover tooltip shows name, grey category dot, time range and tech | https://shopview.testrail.io/index.php?/cases/view/30036 |
| SCH-TIP-04 | C30037 | Tooltips open after a hover delay, dismiss on mouse-leave, are read-only | https://shopview.testrail.io/index.php?/cases/view/30037 |
| SCH-TIP-05 | C30038 | The tooltip flips or shifts to stay within the viewport - never clipped | https://shopview.testrail.io/index.php?/cases/view/30038 |
| SCH-TOOL-01 | C30039 | 'Today' button jumps the grid to the current date | https://shopview.testrail.io/index.php?/cases/view/30039 |
| SCH-TOOL-02 | C30040 | Left/right arrows step by day, week, or month to match the active range | https://shopview.testrail.io/index.php?/cases/view/30040 |
| SCH-TOOL-03 | C30041 | Toolbar search matches customer, work order, unit, technician and line names | https://shopview.testrail.io/index.php?/cases/view/30041 |
| SCH-VIEW-01 | C30042 | 'Filter & display' dropdown: department toggles, 'My Shifts' and 'VIN Number' | https://shopview.testrail.io/index.php?/cases/view/30042 |
| SCH-VIEW-02 | C30043 | Department toggles show or hide individual department groups in the grid | https://shopview.testrail.io/index.php?/cases/view/30043 |
| SCH-VIEW-03 | C30044 | 'My Shifts' filters the grid to only the current user's shifts | https://shopview.testrail.io/index.php?/cases/view/30044 |
| SCH-VIEW-04 | C30045 | 'VIN Number' toggle gates the block VIN only - tooltip and modal always show it | https://shopview.testrail.io/index.php?/cases/view/30045 |
| SCH-VIEW-05 | C30046 | 'View options': six toggles with defaults; Capacity Planning and Events flip | https://shopview.testrail.io/index.php?/cases/view/30046 |
| SCH-VIEW-06 | C30047 | Business Hours toggle shades non-working hours in day view | https://shopview.testrail.io/index.php?/cases/view/30047 |
| SCH-VIEW-09 | C30050 | Tech Hours toggle displays each technician's working hours next to their name | https://shopview.testrail.io/index.php?/cases/view/30050 |
| SCH-VIEW-10 | C30051 | 'Show Saturday' and 'Show Sunday' include or exclude the weekend columns | https://shopview.testrail.io/index.php?/cases/view/30051 |
| SCH-WOL-01 | C29936 | The sidebar is a flat list of work order cards with no tabs | https://shopview.testrail.io/index.php?/cases/view/29936 |
| SCH-WOL-05 | C29940 | Sidebar search filters the card list in real time as you type | https://shopview.testrail.io/index.php?/cases/view/29940 |
| SCH-WOL-06 | C29941 | Sidebar search with no matching work orders shows an empty list | https://shopview.testrail.io/index.php?/cases/view/29941 |
