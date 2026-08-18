# FINAL CURRENT CASE INDEX — master list for the manual QA testers (2026-08-17 / 18)

Single index of the two case sets a tester needs after the 2026-08-17 Fabian design-review authoring passes **and** the 2026-08-17/18 whole-case currency passes: the cases **created** in this effort, and the cases **updated / changed** (a tester should re-open these to see what moved). Every case in all three suites is now current to its latest spec.

**Titles and internal IDs are sourced live from each project's `testrail-id-map.csv` (the authoritative current title); C-ids from the CASES-CREATED / CASES-TOUCHED deliverables. No C-id is invented.** "Changed" = the Fabian authoring updates ∪ the currency-pass touches, deduplicated by C-id (the two sets do not overlap on any project). Build verification is deferred on every case (documents-verified; the app was not opened) — see the consolidated report.

## Grand totals

| Project | Created | Changed (re-open to review) | Suite total |
|---|---:|---:|---:|
| Schedule | 19 | 176 | 195 |
| Report Suite | 27 | 480 | 507 |
| Filters | 9 | 115 | 124 |
| **OVERALL** | **55** | **771** | **826** |

- **Created: 55** (Schedule 19 / Report Suite 27 / Filters 9) — reconciles to the expected 55.
- **Changed: 771** (Schedule 176 / Report Suite 480 / Filters 115).
- Created + Changed per project equals the suite total (Schedule 19+176=195; Report Suite 27+480=507; Filters 9+115=124), so **every case in every suite is accounted for**.

---

# 1 · SCHEDULE (TestRail group 4254)

**Our cases: 195.** Every case current to **Confluence version 30**, epic **SV-8685 (39 children)**. Live census: **ours 195 / live 195 / foreign 0** (sets equal both ways). **Created 19 · Changed 176.**

## 1a · CREATED in this effort (19)

| Internal ID | Title | C-id | TestRail link |
|---|---|---|---|
| SCH-START-09 | A day's hours resolve tech then shop then a 7am-7pm default used everywhere | C43795 | https://shopview.testrail.io/index.php?/cases/view/43795 |
| SCH-DND-10 | A shift is sized by remaining hours: estimate minus hours already clocked | C43796 | https://shopview.testrail.io/index.php?/cases/view/43796 |
| SCH-DND-11 | Below 0.25h left you are told nothing remains; shifts never resize later | C43797 | https://shopview.testrail.io/index.php?/cases/view/43797 |
| SCH-CONF-08 | One hours source per shift; neither set means no hours conflict; Adjust clamps | C43798 | https://shopview.testrail.io/index.php?/cases/view/43798 |
| SCH-UNAS-01 | Dropping a work order on a department header row parks it as one shift | C43799 | https://shopview.testrail.io/index.php?/cases/view/43799 |
| SCH-UNAS-02 | An unassigned block is a fixed-width chip, excluded from capacity and conflicts | C43800 | https://shopview.testrail.io/index.php?/cases/view/43800 |
| SCH-UNAS-03 | Assigning a parked shift to a technician, spreading it if it will not fit | C43801 | https://shopview.testrail.io/index.php?/cases/view/43801 |
| SCH-SPREAD-12 | Spread selector: six options with resolved hours, and a new Today only | C43802 | https://shopview.testrail.io/index.php?/cases/view/43802 |
| SCH-SPREAD-13 | When the scope fits one day the spread hides the selector for an Hours field | C43803 | https://shopview.testrail.io/index.php?/cases/view/43803 |
| SCH-SPREAD-14 | Spread: Until a date and Specific hours derive each other; summary label | C43804 | https://shopview.testrail.io/index.php?/cases/view/43804 |
| SCH-SPREAD-15 | Spread skips weekends only; Undo removes the whole generated series | C43805 | https://shopview.testrail.io/index.php?/cases/view/43805 |
| SCH-WOL-07 | Work order card shows the vehicle and clocked hours; vehicle joins the search | C43806 | https://shopview.testrail.io/index.php?/cases/view/43806 |
| SCH-WOL-08 | Hovering a work order card opens a read-only peek panel of its lines | C43807 | https://shopview.testrail.io/index.php?/cases/view/43807 |
| SCH-MODAL-09 | Shift modal shows Time Logged (actual vs estimate) per line, not only rolled up | C43808 | https://shopview.testrail.io/index.php?/cases/view/43808 |
| SCH-MODAL-10 | Shift modal: start, end and hours typed to the minute resolve each other | C43809 | https://shopview.testrail.io/index.php?/cases/view/43809 |
| SCH-CAP-05 | Clicking a capacity bar opens a per-technician detail modal; tooltip truncates | C43810 | https://shopview.testrail.io/index.php?/cases/view/43810 |
| SCH-REAS-08 | The empty-cell menu's first item Assign work order schedules an existing order | C43811 | https://shopview.testrail.io/index.php?/cases/view/43811 |
| SCH-DAY-08 | Day view has a zoom control (pixels per hour); blocks and now line rescale | C43812 | https://shopview.testrail.io/index.php?/cases/view/43812 |
| SCH-DAY-09 | A block clipped by the visible day-view edge shows a continuation chevron | C43813 | https://shopview.testrail.io/index.php?/cases/view/43813 |

## 1b · UPDATED / CHANGED in this effort (176) — re-open to see what changed

Deduplicated by C-id: Fabian authoring updates (28) + currency-pass touches (148); no overlap. Sorted by C-id.

| Internal ID | Title | C-id | TestRail link |
|---|---|---|---|
| SCH-NAV-01 | Schedule opens from the top-level navigation into a sidebar + grid layout | C29925 | https://shopview.testrail.io/index.php?/cases/view/29925 |
| SCH-NAV-03 | Day / Week / Month segmented control switches the grid between the three views | C29927 | https://shopview.testrail.io/index.php?/cases/view/29927 |
| SCH-NAV-04 | Grid rows are grouped by department under group headers | C29928 | https://shopview.testrail.io/index.php?/cases/view/29928 |
| SCH-NAV-05 | Collapsing a department header hides its technician rows | C29929 | https://shopview.testrail.io/index.php?/cases/view/29929 |
| SCH-NAV-06 | No Tech/Dept toggle - department grouping is the only grid grouping | C29930 | https://shopview.testrail.io/index.php?/cases/view/29930 |
| SCH-NAV-07 | The department header row doubles as that department's unassigned lane | C29931 | https://shopview.testrail.io/index.php?/cases/view/29931 |
| SCH-MCAL-01 | Clicking a date in the mini calendar navigates the main grid to that date | C29932 | https://shopview.testrail.io/index.php?/cases/view/29932 |
| SCH-MCAL-02 | Mini calendar month/year picker has month buttons and year arrows | C29933 | https://shopview.testrail.io/index.php?/cases/view/29933 |
| SCH-MCAL-03 | A chevron toggle collapses and expands the mini calendar grid | C29934 | https://shopview.testrail.io/index.php?/cases/view/29934 |
| SCH-MCAL-04 | Mini calendar highlights the selected date, today, and the hovered week | C29935 | https://shopview.testrail.io/index.php?/cases/view/29935 |
| SCH-WOL-01 | The sidebar is a flat list of work order cards with no tabs | C29936 | https://shopview.testrail.io/index.php?/cases/view/29936 |
| SCH-WOL-02 | Work order card shows number, hours, customer, unit, vehicle, and lead tech | C29937 | https://shopview.testrail.io/index.php?/cases/view/29937 |
| SCH-WOL-04 | 'Search work orders' matches number, customer, unit, vehicle, and technician | C29939 | https://shopview.testrail.io/index.php?/cases/view/29939 |
| SCH-WOL-05 | Sidebar search filters the card list in real time as you type | C29940 | https://shopview.testrail.io/index.php?/cases/view/29940 |
| SCH-WOL-06 | Sidebar search with no matching work orders shows an empty list | C29941 | https://shopview.testrail.io/index.php?/cases/view/29941 |
| SCH-FILT-01 | The 'Filters' button opens Assignment / Status / Priority filter groups | C29942 | https://shopview.testrail.io/index.php?/cases/view/29942 |
| SCH-FILT-02 | Assignment filter narrows the list to Assigned or Unassigned work orders | C29943 | https://shopview.testrail.io/index.php?/cases/view/29943 |
| SCH-FILT-03 | Status filter narrows the list to work orders in the chosen status(es) | C29944 | https://shopview.testrail.io/index.php?/cases/view/29944 |
| SCH-FILT-04 | Priority filter offers High, Medium, Low and narrows the list accordingly | C29945 | https://shopview.testrail.io/index.php?/cases/view/29945 |
| SCH-FILT-05 | 'Clear all' resets every applied sidebar filter in one click | C29946 | https://shopview.testrail.io/index.php?/cases/view/29946 |
| SCH-FILT-06 | Search and filter work together - both can be active at the same time | C29947 | https://shopview.testrail.io/index.php?/cases/view/29947 |
| SCH-LINE-01 | Work order card opens the line drill-down in place, with header and back control | C29948 | https://shopview.testrail.io/index.php?/cases/view/29948 |
| SCH-LINE-03 | Only approved work order lines appear in the drill-down | C29950 | https://shopview.testrail.io/index.php?/cases/view/29950 |
| SCH-LINE-04 | Line row shows title, hours, the technician roster and a drag handle | C29951 | https://shopview.testrail.io/index.php?/cases/view/29951 |
| SCH-LINE-05 | Lines with no technician assigned show a 'Needs techs' badge | C29952 | https://shopview.testrail.io/index.php?/cases/view/29952 |
| SCH-LINE-06 | 'Search lines' matches the line title/name only | C29953 | https://shopview.testrail.io/index.php?/cases/view/29953 |
| SCH-LINE-07 | 'All / Unscheduled' filter chips show counts and filter the line list | C29954 | https://shopview.testrail.io/index.php?/cases/view/29954 |
| SCH-DND-01 | Dropping a single-line work order creates a shift with no scope picker | C29955 | https://shopview.testrail.io/index.php?/cases/view/29955 |
| SCH-DND-02 | Dropping a multi-line work order on a technician cell opens the scope picker | C29956 | https://shopview.testrail.io/index.php?/cases/view/29956 |
| SCH-DND-03 | Dragging a line from the drill-down creates a single-line shift | C29957 | https://shopview.testrail.io/index.php?/cases/view/29957 |
| SCH-DND-04 | A job over the technician's daily hours opens the spread step | C29958 | https://shopview.testrail.io/index.php?/cases/view/29958 |
| SCH-DND-05 | A scope that fits one working day skips the spread step | C29959 | https://shopview.testrail.io/index.php?/cases/view/29959 |
| SCH-DND-06 | While dragging, target cells highlight and a ghost block follows | C29960 | https://shopview.testrail.io/index.php?/cases/view/29960 |
| SCH-DND-07 | Scheduling a technician onto a line adds them to its labor roster | C29961 | https://shopview.testrail.io/index.php?/cases/view/29961 |
| SCH-DND-08 | A click-to-arm alternative exists for scheduling without dragging | C29962 | https://shopview.testrail.io/index.php?/cases/view/29962 |
| SCH-SCOPE-01 | Scope picker contents: the pinned whole-order row and the line rows | C29963 | https://shopview.testrail.io/index.php?/cases/view/29963 |
| SCH-SCOPE-02 | 'Schedule whole work order' assigns all lines and creates one shift | C29964 | https://shopview.testrail.io/index.php?/cases/view/29964 |
| SCH-SCOPE-03 | Tapping a line row creates a single-line shift with no confirm step | C29965 | https://shopview.testrail.io/index.php?/cases/view/29965 |
| SCH-SCOPE-05 | 'Select multiple' checkbox mode: running tally, Select all, and Cancel | C29967 | https://shopview.testrail.io/index.php?/cases/view/29967 |
| SCH-START-01 | A shift's start time uses the technician's own working hours when set | C29969 | https://shopview.testrail.io/index.php?/cases/view/29969 |
| SCH-START-02 | With no technician hours set, start time falls back to business hours | C29970 | https://shopview.testrail.io/index.php?/cases/view/29970 |
| SCH-START-03 | With neither technician hours nor business hours set, a 7:00 AM default applies | C29971 | https://shopview.testrail.io/index.php?/cases/view/29971 |
| SCH-START-04 | In day view the start time comes from the drop position | C29972 | https://shopview.testrail.io/index.php?/cases/view/29972 |
| SCH-START-05 | Dropping onto a department's unassigned lane creates a shift with no technician | C29973 | https://shopview.testrail.io/index.php?/cases/view/29973 |
| SCH-START-06 | Unassigned shift start time uses business hours or the app-level default | C29974 | https://shopview.testrail.io/index.php?/cases/view/29974 |
| SCH-START-07 | Dragging an unassigned shift onto a technician assigns and re-sizes it | C29975 | https://shopview.testrail.io/index.php?/cases/view/29975 |
| SCH-SPREAD-02 | Spread step header shows the scope; 'Change scope' returns to the picker | C29978 | https://shopview.testrail.io/index.php?/cases/view/29978 |
| SCH-SPREAD-03 | How-much selector defaults to Full estimate; preset amounts apply at once | C29979 | https://shopview.testrail.io/index.php?/cases/view/29979 |
| SCH-SPREAD-04 | 'Until a date…' reveals a single finish-by date field | C29980 | https://shopview.testrail.io/index.php?/cases/view/29980 |
| SCH-SPREAD-05 | 'Specific hours…' reveals an hours stepper | C29981 | https://shopview.testrail.io/index.php?/cases/view/29981 |
| SCH-SPREAD-06 | Start date defaults to the earliest working day and can be changed | C29982 | https://shopview.testrail.io/index.php?/cases/view/29982 |
| SCH-SPREAD-07 | Spread sizes shifts to the tech's hours and skips weekends only | C29983 | https://shopview.testrail.io/index.php?/cases/view/29983 |
| SCH-SPREAD-08 | Spread preview: '{N} shifts / {total}h' summary, expandable week-by-week | C29984 | https://shopview.testrail.io/index.php?/cases/view/29984 |
| SCH-SPREAD-09 | Confirming the spread creates a linked series of daily shifts | C29985 | https://shopview.testrail.io/index.php?/cases/view/29985 |
| SCH-SPREAD-10 | The same work order on a second technician spreads the full estimate again | C29986 | https://shopview.testrail.io/index.php?/cases/view/29986 |
| SCH-SER-01 | Month view: series banner wraps across weeks, labeled once, then 'continues' | C29987 | https://shopview.testrail.io/index.php?/cases/view/29987 |
| SCH-SER-02 | Week view: series banner spans the week, with chevrons and 'week N of M' | C29988 | https://shopview.testrail.io/index.php?/cases/view/29988 |
| SCH-SER-03 | Day view shows the series day as one block with a multi-week cue | C29989 | https://shopview.testrail.io/index.php?/cases/view/29989 |
| SCH-SER-04 | A series is just a grouping - capacity and conflicts use the daily shifts | C29990 | https://shopview.testrail.io/index.php?/cases/view/29990 |
| SCH-BLOCK-01 | A single-line shift block shows customer, unit number and line name | C29991 | https://shopview.testrail.io/index.php?/cases/view/29991 |
| SCH-BLOCK-02 | Whole-order and multi-line shifts both read 'N Lines' on the block | C29992 | https://shopview.testrail.io/index.php?/cases/view/29992 |
| SCH-BLOCK-05 | The conflict icon is the only icon on a shift block | C29995 | https://shopview.testrail.io/index.php?/cases/view/29995 |
| SCH-LANE-01 | Non-overlapping same-day shifts share one lane, even from different orders | C29996 | https://shopview.testrail.io/index.php?/cases/view/29996 |
| SCH-LANE-02 | Shifts whose times intersect split into stacked lanes and the row grows to fit | C29997 | https://shopview.testrail.io/index.php?/cases/view/29997 |
| SCH-LANE-03 | Visible lanes cap at 3; extra overlapping shifts collapse into '+N more' | C29998 | https://shopview.testrail.io/index.php?/cases/view/29998 |
| SCH-LANE-04 | Lane stacking and the '+N more' overflow apply in day, week, and month views | C29999 | https://shopview.testrail.io/index.php?/cases/view/29999 |
| SCH-DAY-01 | Day view auto-scrolls to the working-day start; manual scrolling stands | C30001 | https://shopview.testrail.io/index.php?/cases/view/30001 |
| SCH-DAY-03 | Date and time headers stick to the top during vertical scroll | C30003 | https://shopview.testrail.io/index.php?/cases/view/30003 |
| SCH-DAY-04 | Dragging a shift sideways moves its start in 15-min steps with a live time chip | C30004 | https://shopview.testrail.io/index.php?/cases/view/30004 |
| SCH-DAY-05 | Dragging a shift's edge resizes it in 15-min steps with a live time chip | C30005 | https://shopview.testrail.io/index.php?/cases/view/30005 |
| SCH-DAY-06 | A now line marks the current time on today's day view, with a label on hover | C30006 | https://shopview.testrail.io/index.php?/cases/view/30006 |
| SCH-MODAL-01 | Clicking a shift opens its detail modal, with VIN always visible | C30008 | https://shopview.testrail.io/index.php?/cases/view/30008 |
| SCH-MODAL-02 | Scheduled date, start, end and hours can be typed to the minute; 15-min dropdown is a shortcut | C30009 | https://shopview.testrail.io/index.php?/cases/view/30009 |
| SCH-MODAL-03 | The modal shows the technician and time logged vs estimate, per line and for the shift | C30010 | https://shopview.testrail.io/index.php?/cases/view/30010 |
| SCH-MODAL-04 | The modal lists the scheduled line(s) with no money fields | C30011 | https://shopview.testrail.io/index.php?/cases/view/30011 |
| SCH-MODAL-05 | Estimated hours can be edited inline in the modal | C30012 | https://shopview.testrail.io/index.php?/cases/view/30012 |
| SCH-MODAL-06 | Notes can be added, edited, and deleted per shift from the modal | C30013 | https://shopview.testrail.io/index.php?/cases/view/30013 |
| SCH-MODAL-07 | A conflicted shift's modal shows a conflict banner with an 'Adjust' action | C30014 | https://shopview.testrail.io/index.php?/cases/view/30014 |
| SCH-MODAL-08 | Shift modal offers Delete only - there is no Reassign action | C30015 | https://shopview.testrail.io/index.php?/cases/view/30015 |
| SCH-EVT-01 | Create an event via left-click 'Create Event' on empty grid space | C30016 | https://shopview.testrail.io/index.php?/cases/view/30016 |
| SCH-EVT-02 | Day view event creation shows a live preview block you can drag to resize | C30017 | https://shopview.testrail.io/index.php?/cases/view/30017 |
| SCH-EVT-03 | Event modal fields all save; the all-day toggle creates an all-day event | C30018 | https://shopview.testrail.io/index.php?/cases/view/30018 |
| SCH-EVT-05 | Events can be dragged to another technician or another day | C30020 | https://shopview.testrail.io/index.php?/cases/view/30020 |
| SCH-EVT-06 | Event cards look structurally distinct from shift cards | C30021 | https://shopview.testrail.io/index.php?/cases/view/30021 |
| SCH-EVT-07 | Events default to grey; choosing a color tints the card and chip | C30022 | https://shopview.testrail.io/index.php?/cases/view/30022 |
| SCH-CONF-01 | Double-booked: two overlapping work orders on one technician are flagged | C30023 | https://shopview.testrail.io/index.php?/cases/view/30023 |
| SCH-CONF-02 | Working-day conflict: a shift outside the tech's working days is flagged | C30024 | https://shopview.testrail.io/index.php?/cases/view/30024 |
| SCH-CONF-03 | Before-hours and after-hours shifts are flagged against the tech's hours | C30025 | https://shopview.testrail.io/index.php?/cases/view/30025 |
| SCH-CONF-05 | The toolbar conflict pill shows the count and opens a list | C30027 | https://shopview.testrail.io/index.php?/cases/view/30027 |
| SCH-CONF-06 | Clicking a conflict in the dropdown navigates to the relevant technician and day | C30028 | https://shopview.testrail.io/index.php?/cases/view/30028 |
| SCH-CONF-07 | Red styling is only for conflicts and errors, never for overtime | C30029 | https://shopview.testrail.io/index.php?/cases/view/30029 |
| SCH-CAP-01 | Capacity bar fill = booked (shifts + events) vs available, clamped, equal tracks | C30030 | https://shopview.testrail.io/index.php?/cases/view/30030 |
| SCH-CAP-02 | Over capacity, an amber spill extends past the track's right edge | C30031 | https://shopview.testrail.io/index.php?/cases/view/30031 |
| SCH-CAP-03 | 'OT' text tag appears when one technician exceeds their own daily hours | C30032 | https://shopview.testrail.io/index.php?/cases/view/30032 |
| SCH-CAP-04 | Hovering a capacity bar shows a truncated breakdown with 'click to view all' | C30033 | https://shopview.testrail.io/index.php?/cases/view/30033 |
| SCH-TIP-01 | Shift hover tooltip shows the full shift summary incl. up to 3 line names | C30034 | https://shopview.testrail.io/index.php?/cases/view/30034 |
| SCH-TIP-02 | A conflicted shift's tooltip shows the icon and reason in amber | C30035 | https://shopview.testrail.io/index.php?/cases/view/30035 |
| SCH-TIP-03 | Event hover tooltip shows name, grey category dot, time range and tech | C30036 | https://shopview.testrail.io/index.php?/cases/view/30036 |
| SCH-TIP-04 | Tooltips open after a hover delay, dismiss on mouse-leave, are read-only | C30037 | https://shopview.testrail.io/index.php?/cases/view/30037 |
| SCH-TIP-05 | The tooltip flips or shifts to stay within the viewport - never clipped | C30038 | https://shopview.testrail.io/index.php?/cases/view/30038 |
| SCH-TOOL-01 | 'Today' button jumps the grid to the current date | C30039 | https://shopview.testrail.io/index.php?/cases/view/30039 |
| SCH-TOOL-02 | Left/right arrows step by day, week, or month to match the active range | C30040 | https://shopview.testrail.io/index.php?/cases/view/30040 |
| SCH-TOOL-03 | Toolbar search matches customer, work order, unit, technician and line names | C30041 | https://shopview.testrail.io/index.php?/cases/view/30041 |
| SCH-VIEW-01 | 'Filter & display' dropdown: department toggles, 'My Shifts' and 'VIN Number' | C30042 | https://shopview.testrail.io/index.php?/cases/view/30042 |
| SCH-VIEW-02 | Department toggles show or hide individual department groups in the grid | C30043 | https://shopview.testrail.io/index.php?/cases/view/30043 |
| SCH-VIEW-03 | 'My Shifts' filters the grid to only the current user's shifts | C30044 | https://shopview.testrail.io/index.php?/cases/view/30044 |
| SCH-VIEW-04 | 'VIN Number' toggle gates the block VIN only - tooltip and modal always show it | C30045 | https://shopview.testrail.io/index.php?/cases/view/30045 |
| SCH-VIEW-05 | 'View options': six toggles with defaults; Capacity Planning and Events flip | C30046 | https://shopview.testrail.io/index.php?/cases/view/30046 |
| SCH-VIEW-06 | Business Hours toggle shades non-working hours in day view | C30047 | https://shopview.testrail.io/index.php?/cases/view/30047 |
| SCH-VIEW-09 | Tech Hours toggle displays each technician's working hours next to their name | C30050 | https://shopview.testrail.io/index.php?/cases/view/30050 |
| SCH-VIEW-10 | 'Show Saturday' and 'Show Sunday' include or exclude the weekend columns | C30051 | https://shopview.testrail.io/index.php?/cases/view/30051 |
| SCH-REAS-01 | Dragging a shift to another technician row reassigns it, with a confirm modal | C30052 | https://shopview.testrail.io/index.php?/cases/view/30052 |
| SCH-REAS-03 | Left-click empty grid space opens a menu with 'Assign work order' first | C30054 | https://shopview.testrail.io/index.php?/cases/view/30054 |
| SCH-DEL-01 | Deleting a middle shift of a series offers all three scope options | C30057 | https://shopview.testrail.io/index.php?/cases/view/30057 |
| SCH-DEL-02 | 'This shift only' removes that day and the series keeps the gap | C30058 | https://shopview.testrail.io/index.php?/cases/view/30058 |
| SCH-DEL-03 | 'This and everything after' removes from the clicked shift onward | C30059 | https://shopview.testrail.io/index.php?/cases/view/30059 |
| SCH-DEL-04 | 'The whole series' removes all of the series' shifts for that technician | C30060 | https://shopview.testrail.io/index.php?/cases/view/30060 |
| SCH-DEL-05 | Scope options adapt: the first and last shift each show only two | C30061 | https://shopview.testrail.io/index.php?/cases/view/30061 |
| SCH-DEL-06 | Deleting a standalone (non-series) shift does not ask for a series scope | C30062 | https://shopview.testrail.io/index.php?/cases/view/30062 |
| SCH-DEL-08 | Toast stays 4 to 7 seconds, stays while hovered, goes when the cursor leaves | C30064 | https://shopview.testrail.io/index.php?/cases/view/30064 |
| SCH-DEL-09 | Every create/delete/move/reassign toasts with Undo, and Undo restores | C30065 | https://shopview.testrail.io/index.php?/cases/view/30065 |
| SCH-KEY-01 | Escape closes the topmost open modal or popover, following the stacking order | C30066 | https://shopview.testrail.io/index.php?/cases/view/30066 |
| SCH-KEY-03 | Enter confirms the active dialog, but not inside a note textarea | C30068 | https://shopview.testrail.io/index.php?/cases/view/30068 |
| SCH-KEY-05 | Modals trap focus and all interactive elements are keyboard-reachable | C30070 | https://shopview.testrail.io/index.php?/cases/view/30070 |
| SCH-COLOR-01 | Blue is the default color for all shifts, including long and multi-week jobs | C30071 | https://shopview.testrail.io/index.php?/cases/view/30071 |
| SCH-COLOR-02 | Shift modal color picker recolors that shift only, in matching tones | C30072 | https://shopview.testrail.io/index.php?/cases/view/30072 |
| SCH-COLOR-03 | Color labels are editable per shop | C30073 | https://shopview.testrail.io/index.php?/cases/view/30073 |
| SCH-PERM-01 | Schedule: View grants the full read-only experience across the whole page | C30074 | https://shopview.testrail.io/index.php?/cases/view/30074 |
| SCH-PERM-02 | View-only: every editing affordance is hidden or disabled | C30075 | https://shopview.testrail.io/index.php?/cases/view/30075 |
| SCH-PERM-03 | With Schedule: View OFF, the Schedule top-level nav item is hidden entirely | C30076 | https://shopview.testrail.io/index.php?/cases/view/30076 |
| SCH-PERM-04 | Schedule: Edit unlocks all creation and modification interactions | C30077 | https://shopview.testrail.io/index.php?/cases/view/30077 |
| SCH-PERM-05 | Edit without Delete: the user can create and modify but not remove | C30078 | https://shopview.testrail.io/index.php?/cases/view/30078 |
| SCH-PERM-06 | Schedule: Delete unlocks deleting shifts and events | C30079 | https://shopview.testrail.io/index.php?/cases/view/30079 |
| SCH-PERM-07 | Permission tiers nest: Delete requires Edit, Edit requires View | C30080 | https://shopview.testrail.io/index.php?/cases/view/30080 |
| SCH-PERM-08 | Schedule without Work Orders: View - the sidebar hides the work order list | C30081 | https://shopview.testrail.io/index.php?/cases/view/30081 |
| SCH-PERM-09 | No own-only restriction: a View user sees ALL technicians' shifts | C30082 | https://shopview.testrail.io/index.php?/cases/view/30082 |
| SCH-PERM-10 | Grid rows are department-based, not role-based | C30083 | https://shopview.testrail.io/index.php?/cases/view/30083 |
| SCH-PERM-11 | Clocking into line tasks is gated by the staff 'Time Clock' setting | C30084 | https://shopview.testrail.io/index.php?/cases/view/30084 |
| SCH-EDGE-02 | Below 960px the grid scrolls sideways and the sidebar collapses | C30086 | https://shopview.testrail.io/index.php?/cases/view/30086 |
| SCH-EDGE-03 | The sidebar work order list and line drill-down stay smooth with 50+ items | C30087 | https://shopview.testrail.io/index.php?/cases/view/30087 |
| SCH-EDGE-04 | The grid renders smoothly at full load - 15 technicians over 7 days | C30088 | https://shopview.testrail.io/index.php?/cases/view/30088 |
| SCH-EDGE-05 | Shop closures do NOT block the spread - shifts can land on closure days | C30089 | https://shopview.testrail.io/index.php?/cases/view/30089 |
| SCH-EDGE-06 | Scheduled, estimated and actual clocked hours are three separate numbers | C30090 | https://shopview.testrail.io/index.php?/cases/view/30090 |
| SCH-PERM-12 | With Work Orders: View OFF, work order details on shifts are hidden | C30614 | https://shopview.testrail.io/index.php?/cases/view/30614 |
| SCH-EVT-08 | An event's hours count toward the capacity bar but raise no conflict | C30615 | https://shopview.testrail.io/index.php?/cases/view/30615 |
| SCH-HRS-02 | Business-hours toggle reveals a per-day (Mon-Sun) From-To editor | C38847 | https://shopview.testrail.io/index.php?/cases/view/38847 |
| SCH-HRS-03 | Edit Staff has a 'Set working hours for this technician' toggle, off by default | C38848 | https://shopview.testrail.io/index.php?/cases/view/38848 |
| SCH-HRS-04 | A technician with no custom hours inherits the shop business hours | C38849 | https://shopview.testrail.io/index.php?/cases/view/38849 |
| SCH-HRS-05 | 'Add Hours' appends a removable second range for split shifts, starting empty | C38850 | https://shopview.testrail.io/index.php?/cases/view/38850 |
| SCH-HRS-06 | Overlapping hour ranges block Save; incomplete rows are ignored | C38851 | https://shopview.testrail.io/index.php?/cases/view/38851 |
| SCH-REAS-06 | 'New Work Order' in the cell menu points the user to the Work Orders tab | C38855 | https://shopview.testrail.io/index.php?/cases/view/38855 |
| SCH-SPREAD-11 | Spread past 8 weeks asks to confirm; a series can never exceed 120 shifts | C38863 | https://shopview.testrail.io/index.php?/cases/view/38863 |
| SCH-DEL-10 | Schedule actions save immediately - Undo reverses them, closing does not cancel | C38864 | https://shopview.testrail.io/index.php?/cases/view/38864 |
| SCH-EDGE-07 | A multi-week series keeps the same local start time across the clock change | C38865 | https://shopview.testrail.io/index.php?/cases/view/38865 |
| SCH-EDGE-08 | Schedule and all its dialogs display correctly in dark mode | C38866 | https://shopview.testrail.io/index.php?/cases/view/38866 |
| SCH-REG-01 | Shifts and events created before the Schedule rewrite still appear after it | C38867 | https://shopview.testrail.io/index.php?/cases/view/38867 |
| SCH-REG-02 | Dashboard shows one schedule row per work order even with many shifts | C38868 | https://shopview.testrail.io/index.php?/cases/view/38868 |
| SCH-REG-03 | A work order created with an appointment shows up on the Schedule board | C38869 | https://shopview.testrail.io/index.php?/cases/view/38869 |
| SCH-REG-04 | A multi-location technician's shift appears only on the work order's location | C38870 | https://shopview.testrail.io/index.php?/cases/view/38870 |
| SCH-REG-05 | Work order form offers a Priority (High/Medium/Low) that drives the sidebar | C38871 | https://shopview.testrail.io/index.php?/cases/view/38871 |
| SCH-API-01 | API - Schedule reads need View; writes need Edit; deletes need Delete (403) | C38872 | https://shopview.testrail.io/index.php?/cases/view/38872 |
| SCH-API-02 | API - Series past 8 weeks returns 409 until acknowledged; over 120 shifts 422 | C38873 | https://shopview.testrail.io/index.php?/cases/view/38873 |
| SCH-API-03 | API - No pricing fields in Schedule responses; WO details need Work Orders View | C38874 | https://shopview.testrail.io/index.php?/cases/view/38874 |
| SCH-API-04 | API - A shift from another location returns 404, not another shop's data | C38875 | https://shopview.testrail.io/index.php?/cases/view/38875 |
| SCH-PERM-13 | Default roles start at the Schedule level the spec names (view-only vs edit) | C38926 | https://shopview.testrail.io/index.php?/cases/view/38926 |
| SCH-NAV-08 | Schedule opens on Day view the first time you open it from the navigation | C43554 | https://shopview.testrail.io/index.php?/cases/view/43554 |
| SCH-DND-09 | Month view: dragging a work order onto a day creates a shift for that day | C43555 | https://shopview.testrail.io/index.php?/cases/view/43555 |
| SCH-REAS-07 | Week view: a shift that is part of a repeating series can be reassigned | C43556 | https://shopview.testrail.io/index.php?/cases/view/43556 |
| SCH-PANEL-01 | Panel button sits left of Today and its tooltip names what it will do | C43582 | https://shopview.testrail.io/index.php?/cases/view/43582 |
| SCH-PANEL-02 | Panel button hides the left panel and the grid widens into the space | C43583 | https://shopview.testrail.io/index.php?/cases/view/43583 |
| SCH-PANEL-03 | What you had set up in the left panel survives hiding and showing it | C43584 | https://shopview.testrail.io/index.php?/cases/view/43584 |
| SCH-PANEL-04 | On a narrow window the panel button still works and your choice holds | C43585 | https://shopview.testrail.io/index.php?/cases/view/43585 |
| SCH-PANEL-05 | Menus and pop-up windows reposition when the left panel is hidden | C43586 | https://shopview.testrail.io/index.php?/cases/view/43586 |
| SCH-PANEL-06 | Hiding the panel lasts for the rest of your sign-in but is not saved | C43587 | https://shopview.testrail.io/index.php?/cases/view/43587 |
| SCH-EDGE-09 | Dark mode is chosen from the user menu and is remembered for you | C43588 | https://shopview.testrail.io/index.php?/cases/view/43588 |
| SCH-EDGE-10 | In dark mode pop-up windows still look raised above the page | C43589 | https://shopview.testrail.io/index.php?/cases/view/43589 |

---

# 2 · REPORT SUITE (TestRail group 4281)

**Our cases: 507.** Every case current to **SBC v20 / SBR v22 / Parts Velocity v10 / Technician Utilization v9 / WIP v21 / Inventory Value v10**, epic **SV-8582 (114 children)**. Live census: **ours 507 / live 519 / foreign 12 (Vladimir Tomovic)** (sets equal both ways). **Created 27 · Changed 480.**

## 2a · CREATED in this effort (27)

| Internal ID | Title | C-id | TestRail link |
|---|---|---|---|
| WIP-ADJ-01 | Adjustments column appears in the fixed column order and in the first-visit set | C43814 | https://shopview.testrail.io/index.php?/cases/view/43814 |
| WIP-ADJ-02 | Adjustments is the signed net of work-order-level fees and discounts | C43815 | https://shopview.testrail.io/index.php?/cases/view/43815 |
| WIP-ADJ-03 | A work-order fee or discount moves only Adjustments and Total | C43816 | https://shopview.testrail.io/index.php?/cases/view/43816 |
| WIP-ADJ-04 | A row's Total is Earned plus Remaining plus Adjustments | C43817 | https://shopview.testrail.io/index.php?/cases/view/43817 |
| WIP-ADJ-05 | The summary strip shows seven figures and no Adjustments figure | C43818 | https://shopview.testrail.io/index.php?/cases/view/43818 |
| WIP-ADJ-06 | The Totals row sums the Adjustments column across the tab's visible jobs | C43819 | https://shopview.testrail.io/index.php?/cases/view/43819 |
| WIP-ADJ-07 | Earlier as-of days show no Adjustments value because history is not backfilled | C43820 | https://shopview.testrail.io/index.php?/cases/view/43820 |
| WIP-ADJ-08 | Completed tab: Earned equals Total minus Adjustments, Remaining $0.00 | C43821 | https://shopview.testrail.io/index.php?/cases/view/43821 |
| SBC-ADJ-01 | Adjustments column appears between Shop Supplies and Margin | C43822 | https://shopview.testrail.io/index.php?/cases/view/43822 |
| SBC-ADJ-02 | Adjustments is the signed net of invoice-level fees and discounts | C43823 | https://shopview.testrail.io/index.php?/cases/view/43823 |
| SBC-ADJ-03 | Every row ties out once Adjustments is included | C43824 | https://shopview.testrail.io/index.php?/cases/view/43824 |
| SBC-ADJ-04 | The column selector lists ten toggleable columns including Adjustments | C43825 | https://shopview.testrail.io/index.php?/cases/view/43825 |
| SBC-ADJ-05 | Both CSV exports include the Adjustments column in the specified position | C43826 | https://shopview.testrail.io/index.php?/cases/view/43826 |
| SBC-ADJ-06 | Each invoice detail row shows a per-invoice Adjustments value | C43827 | https://shopview.testrail.io/index.php?/cases/view/43827 |
| SBR-ADJ-01 | Adjustments column appears between Parts Margin and Margin | C43828 | https://shopview.testrail.io/index.php?/cases/view/43828 |
| SBR-ADJ-02 | Adjustments is the signed net of invoice-level fees and discounts | C43829 | https://shopview.testrail.io/index.php?/cases/view/43829 |
| SBR-ADJ-03 | Every row ties out once Adjustments is included | C43830 | https://shopview.testrail.io/index.php?/cases/view/43830 |
| SBR-ADJ-04 | The eight toggleable metric columns include Adjustments | C43831 | https://shopview.testrail.io/index.php?/cases/view/43831 |
| SBC-EXP-18 | CSV export repeats the PDF header's Product Type and Locations filter lines | C43832 | https://shopview.testrail.io/index.php?/cases/view/43832 |
| SBR-EXP-17 | CSV export repeats the PDF header's Product Type, status and Locations lines | C43833 | https://shopview.testrail.io/index.php?/cases/view/43833 |
| PV-EXP-13 | CSV export repeats the PDF header's date range and Locations filter lines | C43834 | https://shopview.testrail.io/index.php?/cases/view/43834 |
| TU-EXP-11 | CSV export repeats the PDF header's technician and Locations filter lines | C43835 | https://shopview.testrail.io/index.php?/cases/view/43835 |
| WIP-EXP-11 | CSV export repeats the PDF header's as-of date and Locations lines | C43836 | https://shopview.testrail.io/index.php?/cases/view/43836 |
| IV-EXP-11 | CSV export shows the PDF header's as-of date and Locations filter lines | C43837 | https://shopview.testrail.io/index.php?/cases/view/43837 |
| WIP-VIS-08 | Active view tab shows the selected-tab highlight (amber glow) when clicked | C43838 | https://shopview.testrail.io/index.php?/cases/view/43838 |
| SBR-VIS-06 | Long column header labels wrap to two lines instead of being truncated | C43839 | https://shopview.testrail.io/index.php?/cases/view/43839 |
| SBC-VIS-04 | A group/summary row presents its rolled-up totals as an inline math strip | C43840 | https://shopview.testrail.io/index.php?/cases/view/43840 |

## 2b · UPDATED / CHANGED in this effort (480) — re-open to see what changed

Deduplicated by C-id: Fabian authoring updates (54) + currency-pass touches (426); no overlap. Sorted by C-id.

| Internal ID | Title | C-id | TestRail link |
|---|---|---|---|
| SBC-NAV-01 | Sales By Customer listed under Performance, below existing links; titles correct | C30096 | https://shopview.testrail.io/index.php?/cases/view/30096 |
| SBC-PERM-01 | Ordinary reports access opens Sales By Customer — no separate permission | C30098 | https://shopview.testrail.io/index.php?/cases/view/30098 |
| SBC-PERM-02 | Without reports access, Sales By Customer is not listed and cannot open | C30099 | https://shopview.testrail.io/index.php?/cases/view/30099 |
| SBC-PERM-03 | Opening an invoice you lack permission for shows access-denied; back works | C30100 | https://shopview.testrail.io/index.php?/cases/view/30100 |
| SBC-PERM-04 | Location access enforced: no data from a location the user cannot access | C30101 | https://shopview.testrail.io/index.php?/cases/view/30101 |
| SBC-DATE-01 | Date range picker offers nine periods in the specified order, no All Time | C30102 | https://shopview.testrail.io/index.php?/cases/view/30102 |
| SBC-DATE-03 | Building a custom range on the calendar cannot exceed a 366-day span | C30104 | https://shopview.testrail.io/index.php?/cases/view/30104 |
| SBC-DATE-04 | Changing the date range writes it into the page link for sharing | C30105 | https://shopview.testrail.io/index.php?/cases/view/30105 |
| SBC-TYPE-02 | Product Type multi-select: both toggles on by default; S/P prefix filtering | C30107 | https://shopview.testrail.io/index.php?/cases/view/30107 |
| SBC-LOC-01 | Location filter: rightmost, lists accessible locations, All locations on top | C30109 | https://shopview.testrail.io/index.php?/cases/view/30109 |
| SBC-LOC-03 | Selecting locations scopes the data; All locations covers every accessible one | C30111 | https://shopview.testrail.io/index.php?/cases/view/30111 |
| SBC-CUST-01 | Customer filter sits between Product Type and Location, carries a search icon | C30112 | https://shopview.testrail.io/index.php?/cases/view/30112 |
| SBC-CUST-02 | Typing in the Customer filter lists matching customers by contains match | C30113 | https://shopview.testrail.io/index.php?/cases/view/30113 |
| SBC-CUST-03 | Pinned control toggles All customers and Clear all; clearing shows empty state | C30114 | https://shopview.testrail.io/index.php?/cases/view/30114 |
| SBC-CUST-04 | First load starts in the all-customers state and the report shows every customer | C30115 | https://shopview.testrail.io/index.php?/cases/view/30115 |
| SBC-CUST-05 | Collapsed label reads None, the customer's name, or N selected | C30116 | https://shopview.testrail.io/index.php?/cases/view/30116 |
| SBC-CUST-06 | Changing the customer selection narrows the table and refreshes the totals | C30117 | https://shopview.testrail.io/index.php?/cases/view/30117 |
| SBC-CUST-09 | A subset customer selection reconciles on a filter change; kept if present | C30120 | https://shopview.testrail.io/index.php?/cases/view/30120 |
| SBC-TREE-01 | Each customer gets one summary row with its invoice count in parentheses | C30121 | https://shopview.testrail.io/index.php?/cases/view/30121 |
| SBC-TREE-02 | A customer with no matching invoices in the current view is not shown | C30122 | https://shopview.testrail.io/index.php?/cases/view/30122 |
| SBC-TREE-03 | Expanding a customer reveals asset rows; chevrons toggle and are independent | C30123 | https://shopview.testrail.io/index.php?/cases/view/30123 |
| SBC-TREE-04 | Expanding an asset reveals its invoice rows with number link and date | C30124 | https://shopview.testrail.io/index.php?/cases/view/30124 |
| SBC-TREE-05 | Invoices group into one asset row per vehicle record | C30125 | https://shopview.testrail.io/index.php?/cases/view/30125 |
| SBC-TREE-06 | Asset rows order A to Z with the Parts Sales bucket always last | C30126 | https://shopview.testrail.io/index.php?/cases/view/30126 |
| SBC-TREE-08 | Header-row chevron expands or collapses every customer on the current page | C30128 | https://shopview.testrail.io/index.php?/cases/view/30128 |
| SBC-TREE-09 | Reload-causing changes collapse expansion; Customer filter typing does not | C30129 | https://shopview.testrail.io/index.php?/cases/view/30129 |
| SBC-TREE-10 | Edge: a single-invoice asset can still be expanded | C30130 | https://shopview.testrail.io/index.php?/cases/view/30130 |
| SBC-TREE-11 | A service (S) invoice with no vehicle also lands in the Parts Sales bucket | C30131 | https://shopview.testrail.io/index.php?/cases/view/30131 |
| SBC-TREE-12 | Reversed and voided invoices are excluded from every row; count and total | C30132 | https://shopview.testrail.io/index.php?/cases/view/30132 |
| SBC-TREE-13 | Every row type renders the same columns in the same order | C30133 | https://shopview.testrail.io/index.php?/cases/view/30133 |
| SBC-LBL-01 | Asset identified by VIN, falling back to Unit #, then plate | C30134 | https://shopview.testrail.io/index.php?/cases/view/30134 |
| SBC-LBL-04 | Duplicate asset labels get stable (#1)/(#2) suffixes that survive reloads | C30137 | https://shopview.testrail.io/index.php?/cases/view/30137 |
| SBC-LINK-01 | The invoice number opens the invoice in the same browser tab | C30138 | https://shopview.testrail.io/index.php?/cases/view/30138 |
| SBC-LINK-02 | Browser back from an invoice restores filters; sort and columns; rows shut | C30139 | https://shopview.testrail.io/index.php?/cases/view/30139 |
| SBC-LINK-03 | Customer name is plain text; the invoice link never turns visited-purple | C30140 | https://shopview.testrail.io/index.php?/cases/view/30140 |
| SBC-LINK-04 | An invoice deleted after load shows the not-found state and back returns | C30141 | https://shopview.testrail.io/index.php?/cases/view/30141 |
| SBC-SORT-01 | All columns sortable except chevron; text alphabetical, numbers by value | C30142 | https://shopview.testrail.io/index.php?/cases/view/30142 |
| SBC-SORT-02 | Default sort is Customer name ascending case-insensitive | C30143 | https://shopview.testrail.io/index.php?/cases/view/30143 |
| SBC-SORT-03 | Missing values sort to the bottom ascending and to the top descending | C30144 | https://shopview.testrail.io/index.php?/cases/view/30144 |
| SBC-SORT-04 | Sorting by Date orders customers by their most recent invoice date | C30145 | https://shopview.testrail.io/index.php?/cases/view/30145 |
| SBC-CALC-01 | Financial columns run in the specified order with Subtotal and Margin rules | C30149 | https://shopview.testrail.io/index.php?/cases/view/30149 |
| SBC-CALC-02 | Margin % is Margin over Subtotal to one decimal; em dash when Subtotal <= 0 | C30150 | https://shopview.testrail.io/index.php?/cases/view/30150 |
| SBC-CALC-03 | Labor Delta heading is verbatim; value shows +green / -red / 0.0 on every row | C30151 | https://shopview.testrail.io/index.php?/cases/view/30151 |
| SBC-CALC-04 | Labor Delta is never blank: no-labor rows and near-zero values both show 0.0 | C30152 | https://shopview.testrail.io/index.php?/cases/view/30152 |
| SBC-CALC-05 | Invoice subtotals sum to their asset row and asset subtotals to the customer | C30153 | https://shopview.testrail.io/index.php?/cases/view/30153 |
| SBC-CALC-06 | Subtotal is the rightmost column; pinned on scroll and bold everywhere | C30154 | https://shopview.testrail.io/index.php?/cases/view/30154 |
| SBC-CALC-07 | The totals row covers the whole filtered set; not just the current page | C30155 | https://shopview.testrail.io/index.php?/cases/view/30155 |
| SBC-COL-01 | Column selector is its own toolbar button with ten toggles all on | C30156 | https://shopview.testrail.io/index.php?/cases/view/30156 |
| SBC-COL-02 | Column toggles hide header+cells; Customer, Subtotal and chevron never in list | C30157 | https://shopview.testrail.io/index.php?/cases/view/30157 |
| SBC-EXP-01 | The overflow menu holds exactly the four download items - no Print | C30159 | https://shopview.testrail.io/index.php?/cases/view/30159 |
| SBC-EXP-02 | Download file names carry the version and the active date range | C30160 | https://shopview.testrail.io/index.php?/cases/view/30160 |
| SBC-EXP-03 | Expanded View CSV: column order, blank-cell rules, and the Locations line | C30161 | https://shopview.testrail.io/index.php?/cases/view/30161 |
| SBC-EXP-04 | CSV formats: Margin % plain; dates mm-dd-yyyy; currency plain; no color | C30162 | https://shopview.testrail.io/index.php?/cases/view/30162 |
| SBC-EXP-05 | CSV and PDF hold exactly the customers matching the active filters and sort | C30163 | https://shopview.testrail.io/index.php?/cases/view/30163 |
| SBC-EXP-06 | Each download item shows a loading state and its own export-failed toast | C30164 | https://shopview.testrail.io/index.php?/cases/view/30164 |
| SBC-EXP-08 | PDF page: A4 landscape, uniform margins, ShopView footer and page numbers | C30166 | https://shopview.testrail.io/index.php?/cases/view/30166 |
| SBC-EXP-09 | PDF header: title, organization, date range, Product Type and Locations lines | C30167 | https://shopview.testrail.io/index.php?/cases/view/30167 |
| SBC-EXP-10 | PDF logo is embedded, scales without distortion | C30168 | https://shopview.testrail.io/index.php?/cases/view/30168 |
| SBC-EXP-11 | Expanded CSV body: column set and order, Customer/Asset/Invoice tree, blanks | C30169 | https://shopview.testrail.io/index.php?/cases/view/30169 |
| SBC-EXP-14 | An export over 10,000 data rows is refused with the too-large toast | C30172 | https://shopview.testrail.io/index.php?/cases/view/30172 |
| SBC-EXP-15 | A no-match export still downloads headers and a zero totals row | C30173 | https://shopview.testrail.io/index.php?/cases/view/30173 |
| SBC-PERS-01 | Filters; sort and visible columns are restored on the next visit | C30174 | https://shopview.testrail.io/index.php?/cases/view/30174 |
| SBC-PERS-02 | Type-ahead search text, expansion state and scroll position are not saved | C30175 | https://shopview.testrail.io/index.php?/cases/view/30175 |
| SBC-PERS-03 | A saved value that is no longer valid is dropped and falls back to default | C30176 | https://shopview.testrail.io/index.php?/cases/view/30176 |
| SBC-PERS-04 | The saved view is specific to this report and does not affect any other report | C30177 | https://shopview.testrail.io/index.php?/cases/view/30177 |
| SBC-PERS-05 | With no saved view every setting uses its own default | C30178 | https://shopview.testrail.io/index.php?/cases/view/30178 |
| SBC-PERS-06 | When a saved view and a page-link range clash the saved view wins | C30179 | https://shopview.testrail.io/index.php?/cases/view/30179 |
| SBC-PERS-07 | Customer filter restore: all-customers stays all; an id set is intersected | C30180 | https://shopview.testrail.io/index.php?/cases/view/30180 |
| SBC-EMPTY-01 | Empty state shows in the table body; toolbar interactive; kept selection returns | C30181 | https://shopview.testrail.io/index.php?/cases/view/30181 |
| SBC-EMPTY-04 | A failed data fetch shows the error toast which fades after 5 seconds | C30184 | https://shopview.testrail.io/index.php?/cases/view/30184 |
| SBC-VIS-01 | Page and toolbar match the suite theme in padding; surface and alignment | C30185 | https://shopview.testrail.io/index.php?/cases/view/30185 |
| SBC-VIS-02 | Row surfaces alternate by tree level; header and totals rows stay white | C30186 | https://shopview.testrail.io/index.php?/cases/view/30186 |
| SBC-VIS-03 | Dark mode darkens every surface while the PDF always renders light | C30187 | https://shopview.testrail.io/index.php?/cases/view/30187 |
| SBC-MOB-01 | On a phone every toolbar control works on touch; the toolbar splits in two | C30188 | https://shopview.testrail.io/index.php?/cases/view/30188 |
| SBC-MOB-02 | On touch the table scrolls sideways with Subtotal pinned and chevrons work | C30189 | https://shopview.testrail.io/index.php?/cases/view/30189 |
| SBC-API-01 | Asset and invoice rows are fetched on first expand; one call per customer | C30190 | https://shopview.testrail.io/index.php?/cases/view/30190 |
| SBC-API-02 | Sorting is applied on the server and re-fetches the first page | C30191 | https://shopview.testrail.io/index.php?/cases/view/30191 |
| SBC-API-03 | The Customer type-ahead queries the server instead of loading every name | C30192 | https://shopview.testrail.io/index.php?/cases/view/30192 |
| SBC-API-04 | Customer rows are server-paginated; the totals row is server-computed | C30193 | https://shopview.testrail.io/index.php?/cases/view/30193 |
| SBC-API-05 | Exports are server-generated and the 10,000-row cap is counted first | C30194 | https://shopview.testrail.io/index.php?/cases/view/30194 |
| SBR-NAV-01 | Sales By Representative under Performance, below existing links; titles correct | C30195 | https://shopview.testrail.io/index.php?/cases/view/30195 |
| SBR-NAV-03 | The nav entry fits the full Sales By Representative label; no truncation | C30197 | https://shopview.testrail.io/index.php?/cases/view/30197 |
| SBR-PERM-01 | Sales By Representative is visible to anyone who sees another Performance report | C30198 | https://shopview.testrail.io/index.php?/cases/view/30198 |
| SBR-PERM-02 | Without Reports access: no navigation, no export menu, no Export dialog | C30199 | https://shopview.testrail.io/index.php?/cases/view/30199 |
| SBR-PERM-03 | Without staff-administration access the deactivation flow is unreachable | C30200 | https://shopview.testrail.io/index.php?/cases/view/30200 |
| SBR-DATE-01 | Date range picker is in the toolbar and offers the standard presets plus Custom | C30201 | https://shopview.testrail.io/index.php?/cases/view/30201 |
| SBR-DATE-02 | A Custom range uses the date-picker and holds a 366-day maximum span | C30202 | https://shopview.testrail.io/index.php?/cases/view/30202 |
| SBR-DATE-04 | An invoice sits in the range by its own invoice date; endpoints included | C30204 | https://shopview.testrail.io/index.php?/cases/view/30204 |
| SBR-TYPE-02 | Product Type: three options, Parts & Service default, each option filters right | C30206 | https://shopview.testrail.io/index.php?/cases/view/30206 |
| SBR-STAT-01 | Invoice Status offers exactly four options; All Statuses is the default | C30208 | https://shopview.testrail.io/index.php?/cases/view/30208 |
| SBR-STAT-02 | Status filtering matches on the mapped display value | C30209 | https://shopview.testrail.io/index.php?/cases/view/30209 |
| SBR-STAT-04 | Filters compose: a rep appears only with an invoice matching ALL active filters | C30211 | https://shopview.testrail.io/index.php?/cases/view/30211 |
| SBR-STAT-05 | Money columns always show invoiced amounts, never the outstanding balance | C30212 | https://shopview.testrail.io/index.php?/cases/view/30212 |
| SBR-LOC-01 | Location filter is the rightmost control with an All Locations option | C30213 | https://shopview.testrail.io/index.php?/cases/view/30213 |
| SBR-LOC-03 | Location selection cascades; an inaccessible location's data is never included | C30215 | https://shopview.testrail.io/index.php?/cases/view/30215 |
| SBR-LOC-04 | Sales By Representative: Location filter hidden for a one-location user | C30216 | https://shopview.testrail.io/index.php?/cases/view/30216 |
| SBR-ROW-01 | A rep row appears only when the rep has a matching non-reversed invoice | C30217 | https://shopview.testrail.io/index.php?/cases/view/30217 |
| SBR-ROW-02 | Row layout: 13 columns in order, blanks in position, bold summary rows | C30218 | https://shopview.testrail.io/index.php?/cases/view/30218 |
| SBR-ROW-03 | A toggled-off or deleted contributor still appears; tagged (Inactive) | C30219 | https://shopview.testrail.io/index.php?/cases/view/30219 |
| SBR-TREE-05 | Expanding a rep loads its invoices on demand with a row-level spinner | C30221 | https://shopview.testrail.io/index.php?/cases/view/30221 |
| SBR-TREE-06 | The header chevron expands every visible rep and its glyph tracks state | C30222 | https://shopview.testrail.io/index.php?/cases/view/30222 |
| SBR-TREE-07 | Each invoice appears under exactly one rep or the Unassigned row | C30223 | https://shopview.testrail.io/index.php?/cases/view/30223 |
| SBR-TREE-08 | Expansion survives filter and sort changes within the session, resets on reload | C30224 | https://shopview.testrail.io/index.php?/cases/view/30224 |
| SBR-TREE-09 | Detail rows run newest first with a numeric invoice-number tie-break | C30225 | https://shopview.testrail.io/index.php?/cases/view/30225 |
| SBR-BADGE-01 | Status badge between Customer and Labor Delta; every detail row shows mapped text | C30226 | https://shopview.testrail.io/index.php?/cases/view/30226 |
| SBR-BADGE-02 | Badge colors use the canonical payment-status tokens in light and dark | C30227 | https://shopview.testrail.io/index.php?/cases/view/30227 |
| SBR-CALC-01 | Labor Delta is hours invoiced minus hours worked; half-up to one decimal | C30229 | https://shopview.testrail.io/index.php?/cases/view/30229 |
| SBR-CALC-02 | Labor Delta: +green, -red, 0.0 default on every row; rollups from unrounded deltas | C30230 | https://shopview.testrail.io/index.php?/cases/view/30230 |
| SBR-CALC-03 | No-labor-no-time invoices show 0.0; clocked-unbilled work shows negative | C30231 | https://shopview.testrail.io/index.php?/cases/view/30231 |
| SBR-CALC-05 | Margin % to one decimal; em dash when Subtotal <= 0; recomputed on rollups | C30233 | https://shopview.testrail.io/index.php?/cases/view/30233 |
| SBR-CALC-06 | Money columns use the standardized labels and definitions | C30234 | https://shopview.testrail.io/index.php?/cases/view/30234 |
| SBR-CALC-07 | Negative dollar values render in accounting parentheses; money columns only | C30235 | https://shopview.testrail.io/index.php?/cases/view/30235 |
| SBR-CALC-08 | Half-up rounding at each precision; totals may differ by one last-decimal unit | C30236 | https://shopview.testrail.io/index.php?/cases/view/30236 |
| SBR-TOT-01 | Subtotal: rightmost, pinned right, bold everywhere; header row sticky on scroll | C30237 | https://shopview.testrail.io/index.php?/cases/view/30237 |
| SBR-TOT-02 | Desktop Totals row merges the identifier columns and sticks to the bottom | C30238 | https://shopview.testrail.io/index.php?/cases/view/30238 |
| SBR-TOT-03 | Mobile shows a simplified totals bar below the table; Subtotal at right | C30239 | https://shopview.testrail.io/index.php?/cases/view/30239 |
| SBR-SORT-01 | All nine financial columns are sortable | C30241 | https://shopview.testrail.io/index.php?/cases/view/30241 |
| SBR-SORT-02 | Default order is plain A to Z by display name, case-insensitive | C30242 | https://shopview.testrail.io/index.php?/cases/view/30242 |
| SBR-SORT-03 | First header click sorts ascending; second descending; no third state | C30243 | https://shopview.testrail.io/index.php?/cases/view/30243 |
| SBR-SORT-04 | Sorting reorders rep rows only; Unassigned stays pinned on top | C30244 | https://shopview.testrail.io/index.php?/cases/view/30244 |
| SBR-SORT-05 | Ties keep the A to Z order and an em-dash Margin % sorts as zero | C30245 | https://shopview.testrail.io/index.php?/cases/view/30245 |
| SBR-LINK-01 | Detail-row invoice number and customer name links navigate in the current tab | C30247 | https://shopview.testrail.io/index.php?/cases/view/30247 |
| SBR-LINK-03 | Browser back from a drilldown restores expansion and scroll; no reload | C30249 | https://shopview.testrail.io/index.php?/cases/view/30249 |
| SBR-LINK-04 | Invoice links use theme-primary; customer links use the body color | C30250 | https://shopview.testrail.io/index.php?/cases/view/30250 |
| SBR-LINK-05 | An unavailable link destination shows the standard not-found state | C30251 | https://shopview.testrail.io/index.php?/cases/view/30251 |
| SBR-DEACT-02 | Deactivate dialog: counted pluralized headline, reassurance, focus trap | C30253 | https://shopview.testrail.io/index.php?/cases/view/30253 |
| SBR-DEACT-03 | Type-YES gate: auto-focus; case-insensitive match; Enter submits | C30254 | https://shopview.testrail.io/index.php?/cases/view/30254 |
| SBR-DEACT-04 | Cancel and X dismiss the Deactivate dialog; Escape and clicking outside do not | C30255 | https://shopview.testrail.io/index.php?/cases/view/30255 |
| SBR-DEACT-05 | Valid submit locks the dialog, then deactivates keeping assignments | C30256 | https://shopview.testrail.io/index.php?/cases/view/30256 |
| SBR-DEACT-06 | After deactivation: toggle unchanged, CSV shows No, report credit intact | C30257 | https://shopview.testrail.io/index.php?/cases/view/30257 |
| SBR-DEACT-07 | No dialog: toggle off, no assignments, already inactive, or reactivation | C30258 | https://shopview.testrail.io/index.php?/cases/view/30258 |
| SBR-DEACT-08 | A deactivation failure shows the error toast and leaves the status alone | C30259 | https://shopview.testrail.io/index.php?/cases/view/30259 |
| SBR-DEACT-09 | If the assignment pre-check fails, the warning dialog still opens | C30260 | https://shopview.testrail.io/index.php?/cases/view/30260 |
| SBR-UNAS-01 | Show Unassigned sits between the column selector and the date picker, off | C30261 | https://shopview.testrail.io/index.php?/cases/view/30261 |
| SBR-UNAS-02 | Show Unassigned adds one top-pinned Unassigned row that acts like a rep row | C30262 | https://shopview.testrail.io/index.php?/cases/view/30262 |
| SBR-UNAS-04 | No empty Unassigned row is ever rendered | C30264 | https://shopview.testrail.io/index.php?/cases/view/30264 |
| SBR-COL-01 | Column selector: eight metric toggles; five always-on columns cannot be hidden | C30265 | https://shopview.testrail.io/index.php?/cases/view/30265 |
| SBR-COL-03 | Toggling a column applies at once to summary; detail and Totals rows | C30267 | https://shopview.testrail.io/index.php?/cases/view/30267 |
| SBR-COL-04 | Column visibility never affects the exports | C30268 | https://shopview.testrail.io/index.php?/cases/view/30268 |
| SBR-COL-05 | Hiding the active sort column keeps the sort | C30269 | https://shopview.testrail.io/index.php?/cases/view/30269 |
| SBR-PERS-01 | All filter and view settings are restored before the first data fetch | C30271 | https://shopview.testrail.io/index.php?/cases/view/30271 |
| SBR-PERS-02 | Expansion state and scroll position are not remembered and reset on reload | C30272 | https://shopview.testrail.io/index.php?/cases/view/30272 |
| SBR-PERS-03 | A stale saved value falls back to its default and never errors | C30273 | https://shopview.testrail.io/index.php?/cases/view/30273 |
| SBR-PERS-04 | First visit or cleared storage yields all defaults; no server-side profile | C30274 | https://shopview.testrail.io/index.php?/cases/view/30274 |
| SBR-PERS-05 | The A to Z default is its own saved value | C30275 | https://shopview.testrail.io/index.php?/cases/view/30275 |
| SBR-EXP-01 | The ⋯ overflow menu lists exactly four download actions | C30276 | https://shopview.testrail.io/index.php?/cases/view/30276 |
| SBR-EXP-02 | All four downloads respect filters, full result set, and active order | C30277 | https://shopview.testrail.io/index.php?/cases/view/30277 |
| SBR-EXP-03 | Summary PDF: one rolled-up row per rep with a recomputed grand totals row | C30278 | https://shopview.testrail.io/index.php?/cases/view/30278 |
| SBR-EXP-04 | Expanded View PDF: one page-block per rep with its own totals; no grand | C30279 | https://shopview.testrail.io/index.php?/cases/view/30279 |
| SBR-EXP-05 | Expanded View PDF truncates invoice numbers longer than 18 characters | C30280 | https://shopview.testrail.io/index.php?/cases/view/30280 |
| SBR-EXP-06 | PDF footer on every page, default-logo fallback, and deterministic PDF filenames | C30281 | https://shopview.testrail.io/index.php?/cases/view/30281 |
| SBR-EXP-07 | PDFs render negative dollars in accounting parentheses, keep the (Inactive) tag | C30282 | https://shopview.testrail.io/index.php?/cases/view/30282 |
| SBR-EXP-08 | PDF body font steps down as the longest dollar value grows; no overflow | C30283 | https://shopview.testrail.io/index.php?/cases/view/30283 |
| SBR-EXP-10 | Summary CSV: file name, UTF-8 BOM, verbatim headers, one row per rep | C30285 | https://shopview.testrail.io/index.php?/cases/view/30285 |
| SBR-EXP-11 | Expanded CSV: file name, verbatim headers, one row per invoice | C30286 | https://shopview.testrail.io/index.php?/cases/view/30286 |
| SBR-EXP-12 | CSV cells: plain numbers, signed Labor Delta, empty Margin %, (Inactive) | C30287 | https://shopview.testrail.io/index.php?/cases/view/30287 |
| SBR-EXP-13 | The Unassigned row appears in both CSV downloads only when the toggle is on | C30288 | https://shopview.testrail.io/index.php?/cases/view/30288 |
| SBR-EXP-14 | A failed download shows the canonical error toast | C30289 | https://shopview.testrail.io/index.php?/cases/view/30289 |
| SBR-EXP-15 | Over-cap Expanded View PDF is refused with the too-large message | C30290 | https://shopview.testrail.io/index.php?/cases/view/30290 |
| SBR-EXP-16 | An empty-data export still generates with zeroed Summary PDF totals | C30291 | https://shopview.testrail.io/index.php?/cases/view/30291 |
| SBR-ASGN-01 | Report Name dropdown lists Sales Representative Assignments at the bottom | C30292 | https://shopview.testrail.io/index.php?/cases/view/30292 |
| SBR-ASGN-02 | Sales Representative Assignments CSV: file name, headers, success toast | C30293 | https://shopview.testrail.io/index.php?/cases/view/30293 |
| SBR-ASGN-03 | Assignments CSV: one row per assigned customer, sorted customer then rep | C30294 | https://shopview.testrail.io/index.php?/cases/view/30294 |
| SBR-ASGN-04 | "Rep is active?" tracks the staff-active status, not the toggle | C30295 | https://shopview.testrail.io/index.php?/cases/view/30295 |
| SBR-ASGN-05 | A deleted rep record still exports one row from the stored name, marked No | C30296 | https://shopview.testrail.io/index.php?/cases/view/30296 |
| SBR-ASGN-06 | Assignments export failure and nothing-to-export use the dialog's messages | C30297 | https://shopview.testrail.io/index.php?/cases/view/30297 |
| SBR-STATE-01 | Empty state: verbatim message, no grand Totals, toolbar stays interactive | C30298 | https://shopview.testrail.io/index.php?/cases/view/30298 |
| SBR-STATE-03 | Loading shows a centered spinner over the data area and hides the Totals | C30300 | https://shopview.testrail.io/index.php?/cases/view/30300 |
| SBR-STATE-04 | A load failure shows the inline could-not-load message with a Retry | C30301 | https://shopview.testrail.io/index.php?/cases/view/30301 |
| SBR-MOB-01 | On a phone every toolbar control works on touch | C30302 | https://shopview.testrail.io/index.php?/cases/view/30302 |
| SBR-MOB-02 | On a phone the table scrolls sideways with Subtotal pinned outside it | C30303 | https://shopview.testrail.io/index.php?/cases/view/30303 |
| SBR-MOB-03 | Touch targets are at least 44×44 px and touch users get no hover-only tooltips | C30304 | https://shopview.testrail.io/index.php?/cases/view/30304 |
| SBR-VIS-01 | Layout: white toolbar; blue-grey page; separator; edge-to-edge white table | C30305 | https://shopview.testrail.io/index.php?/cases/view/30305 |
| SBR-VIS-02 | Dark mode: page, toolbar, table; Totals switch to dark equivalents | C30306 | https://shopview.testrail.io/index.php?/cases/view/30306 |
| SBR-VIS-03 | Every icon-only control carries its specified accessible name | C30307 | https://shopview.testrail.io/index.php?/cases/view/30307 |
| SBR-VIS-04 | Chevrons and sortable headers are keyboard-operable and expose their state | C30308 | https://shopview.testrail.io/index.php?/cases/view/30308 |
| SBR-VIS-05 | The subdued grey of the (N) count and (Inactive) tag meets WCAG AA contrast | C30309 | https://shopview.testrail.io/index.php?/cases/view/30309 |
| SBR-WO-01 | Sales Representative selector shows on WO and Part Sale, not on imported | C30310 | https://shopview.testrail.io/index.php?/cases/view/30310 |
| SBR-WO-02 | Selector offers only reps whose sales-representative toggle is on | C30311 | https://shopview.testrail.io/index.php?/cases/view/30311 |
| SBR-WO-03 | A new WO opens with Sales Representative unassigned; a change saves at once | C30312 | https://shopview.testrail.io/index.php?/cases/view/30312 |
| SBR-WO-04 | The Sales Representative selector is read-only when Invoiced or Paid | C30313 | https://shopview.testrail.io/index.php?/cases/view/30313 |
| SBR-WO-05 | Invoice credit snapshot: WO rep, else customer rep, else unassigned | C30314 | https://shopview.testrail.io/index.php?/cases/view/30314 |
| SBR-WO-06 | Customer record shows a "Sales Representative" row; "Unassigned" when none | C30315 | https://shopview.testrail.io/index.php?/cases/view/30315 |
| SBR-API-01 | A rep's invoice detail rows are fetched from the server only on the first expand | C30316 | https://shopview.testrail.io/index.php?/cases/view/30316 |
| SBR-API-02 | Sorting is performed server-side and returns the first page | C30317 | https://shopview.testrail.io/index.php?/cases/view/30317 |
| SBR-API-03 | Grand totals are server-computed over the full filtered set | C30318 | https://shopview.testrail.io/index.php?/cases/view/30318 |
| SBR-API-04 | All four exports are generated server-side against the active filters and sort | C30319 | https://shopview.testrail.io/index.php?/cases/view/30319 |
| SBR-API-05 | The Expanded View PDF's 10,000-row cap is enforced server-side BEFORE generation | C30320 | https://shopview.testrail.io/index.php?/cases/view/30320 |
| SBR-API-06 | Deactivating a rep first runs a server pre-check returning the count | C30321 | https://shopview.testrail.io/index.php?/cases/view/30321 |
| PV-NAV-01 | Parts Velocity appears under a new Parts section in the Reports navigation | C30322 | https://shopview.testrail.io/index.php?/cases/view/30322 |
| PV-NAV-02 | First visit: date range defaults to This Year and data is fetched automatically | C30323 | https://shopview.testrail.io/index.php?/cases/view/30323 |
| PV-NAV-03 | A loading indicator shows and old rows are replaced only when data returns | C30324 | https://shopview.testrail.io/index.php?/cases/view/30324 |
| PV-PERM-01 | A user with ordinary reports access can load the report and export it | C30325 | https://shopview.testrail.io/index.php?/cases/view/30325 |
| PV-PERM-02 | Without the Manager or Office User role the report entry is not shown | C30326 | https://shopview.testrail.io/index.php?/cases/view/30326 |
| PV-PERM-03 | Ordinary reports access alone opens Parts Velocity and its export | C30327 | https://shopview.testrail.io/index.php?/cases/view/30327 |
| PV-FILT-01 | Type filter: single-select, first in row, three options, default Both; reloads | C30328 | https://shopview.testrail.io/index.php?/cases/view/30328 |
| PV-FILT-03 | Date range selector offers exactly the eleven bounded options and no All Time | C30330 | https://shopview.testrail.io/index.php?/cases/view/30330 |
| PV-FILT-04 | A Custom date range needs valid dates and rejects a span over 366 days | C30331 | https://shopview.testrail.io/index.php?/cases/view/30331 |
| PV-FILT-05 | Category and Vendor multi-select filters limit the table to matching parts | C30332 | https://shopview.testrail.io/index.php?/cases/view/30332 |
| PV-FILT-06 | Toolbar search matches part number or description, case-insensitively | C30333 | https://shopview.testrail.io/index.php?/cases/view/30333 |
| PV-FILT-07 | All active filters combine with AND logic | C30334 | https://shopview.testrail.io/index.php?/cases/view/30334 |
| PV-FILT-08 | The Bin multi-select limits the table to parts stocked in those bins | C30335 | https://shopview.testrail.io/index.php?/cases/view/30335 |
| PV-FILT-09 | Bin filter excludes special-order rows; Bin plus that Type is empty by design | C30336 | https://shopview.testrail.io/index.php?/cases/view/30336 |
| PV-FILT-10 | Location filter is rightmost, defaults to the active location, accessible-only | C30337 | https://shopview.testrail.io/index.php?/cases/view/30337 |
| PV-FILT-11 | Empty state shows the standard no-data message when no parts match the filters | C30338 | https://shopview.testrail.io/index.php?/cases/view/30338 |
| PV-FILT-12 | Parts with no category; vendor or bin are excluded when that filter is on | C30339 | https://shopview.testrail.io/index.php?/cases/view/30339 |
| PV-FILT-13 | Parts Velocity: the Location filter is hidden for a one-location user | C30340 | https://shopview.testrail.io/index.php?/cases/view/30340 |
| PV-ROW-01 | A part stocked at two selected locations shows as two per-location rows | C30341 | https://shopview.testrail.io/index.php?/cases/view/30341 |
| PV-ROW-02 | A Special Order part is one merged row summed across selected locations | C30342 | https://shopview.testrail.io/index.php?/cases/view/30342 |
| PV-ROW-03 | Rows load ranked by Demand descending, indicator on the Demand header | C30343 | https://shopview.testrail.io/index.php?/cases/view/30343 |
| PV-ROW-04 | A header click sorts ascending first, toggles, and places nulls by direction | C30344 | https://shopview.testrail.io/index.php?/cases/view/30344 |
| PV-ROW-05 | Sticky header, all-left alignment on screen, and plain-text Type values | C30345 | https://shopview.testrail.io/index.php?/cases/view/30345 |
| PV-ROW-06 | Info icons sit on Units Sold, Demand and Turns/Yr with descriptions | C30346 | https://shopview.testrail.io/index.php?/cases/view/30346 |
| PV-ROW-07 | Description; Category and Vendor truncate on hover; Part # never does | C30347 | https://shopview.testrail.io/index.php?/cases/view/30347 |
| PV-ROW-08 | Em-dash only in nullable fields; counts and Revenue/Margin are never null | C30348 | https://shopview.testrail.io/index.php?/cases/view/30348 |
| PV-ROW-09 | An inventory part drops out only with no movement, no stock and no revenue | C30349 | https://shopview.testrail.io/index.php?/cases/view/30349 |
| PV-COL-01 | Column picker lists all 20 columns and never offers the internal cost | C30351 | https://shopview.testrail.io/index.php?/cases/view/30351 |
| PV-COL-02 | First visit shows exactly the 14 default columns in the specified order | C30352 | https://shopview.testrail.io/index.php?/cases/view/30352 |
| PV-COL-03 | A re-enabled column returns to its canonical slot, with no reload | C30353 | https://shopview.testrail.io/index.php?/cases/view/30353 |
| PV-COL-04 | Filters; columns and sort are remembered per browser before the first fetch | C30354 | https://shopview.testrail.io/index.php?/cases/view/30354 |
| PV-COL-05 | A saved value that is no longer valid falls back to that setting's default | C30355 | https://shopview.testrail.io/index.php?/cases/view/30355 |
| PV-COL-06 | A different user signing in on the same browser inherits the saved view | C30356 | https://shopview.testrail.io/index.php?/cases/view/30356 |
| PV-COL-08 | All 20 columns can be hidden; the empty selection is never restored | C30358 | https://shopview.testrail.io/index.php?/cases/view/30358 |
| PV-CALC-01 | Units Sold for an inventory part is net stock movement | C30359 | https://shopview.testrail.io/index.php?/cases/view/30359 |
| PV-CALC-02 | Special Order Units Sold = in-window request quantity, net of reversals | C30360 | https://shopview.testrail.io/index.php?/cases/view/30360 |
| PV-CALC-03 | Units Returned counts initiated part returns and parts-sale credits | C30361 | https://shopview.testrail.io/index.php?/cases/view/30361 |
| PV-CALC-04 | Units Returned is windowed by initiation date, ignores invoice status | C30362 | https://shopview.testrail.io/index.php?/cases/view/30362 |
| PV-CALC-05 | Sold (WO) counts Service work orders, Sold (Parts Sale) counts Parts | C30363 | https://shopview.testrail.io/index.php?/cases/view/30363 |
| PV-CALC-06 | Demand counts each transaction once; a reversal neither adds nor subtracts | C30364 | https://shopview.testrail.io/index.php?/cases/view/30364 |
| PV-CALC-07 | Last Sale is whole days since the most recent sale over all-time history | C30365 | https://shopview.testrail.io/index.php?/cases/view/30365 |
| PV-CALC-08 | On Hand shows the row's own location stock | C30366 | https://shopview.testrail.io/index.php?/cases/view/30366 |
| PV-CALC-09 | Turns / Yr annualizes the sales rate, is 0.00 at zero stock, can be negative | C30367 | https://shopview.testrail.io/index.php?/cases/view/30367 |
| PV-CALC-10 | Revenue, Margin, Avg Cost, Avg Sell and Margin % use the billed formulas | C30368 | https://shopview.testrail.io/index.php?/cases/view/30368 |
| PV-CALC-11 | A reversed or voided sale is excluded from every billed-line column | C30369 | https://shopview.testrail.io/index.php?/cases/view/30369 |
| PV-CALC-12 | Avg Cost / Avg Sell and Margin % use independent null triggers | C30370 | https://shopview.testrail.io/index.php?/cases/view/30370 |
| PV-CALC-13 | Number formats match the spec per column; rounding is half away from zero | C30371 | https://shopview.testrail.io/index.php?/cases/view/30371 |
| PV-CALC-14 | Core parts are excluded from both the inventory and special-order result sets | C30372 | https://shopview.testrail.io/index.php?/cases/view/30372 |
| PV-CALC-15 | Movement and billed bases may differ; Sold (WO) + Sold (Parts Sale) = billed | C30373 | https://shopview.testrail.io/index.php?/cases/view/30373 |
| PV-CALC-16 | Window anchors: movement uses the event date, billed uses the WO date | C30374 | https://shopview.testrail.io/index.php?/cases/view/30374 |
| PV-EXP-01 | The overflow button opens Download (PDF) then Download (CSV) in that order | C30375 | https://shopview.testrail.io/index.php?/cases/view/30375 |
| PV-EXP-02 | Both exports reflect the filters and search active at the time of export | C30376 | https://shopview.testrail.io/index.php?/cases/view/30376 |
| PV-EXP-03 | Exports include only the enabled columns, in the canonical on-screen order | C30377 | https://shopview.testrail.io/index.php?/cases/view/30377 |
| PV-EXP-04 | Exports reflect the active sort, including Min/Max and null placement | C30378 | https://shopview.testrail.io/index.php?/cases/view/30378 |
| PV-EXP-05 | PDF: filename, A3 landscape, title, text truncation, and the shop logo | C30379 | https://shopview.testrail.io/index.php?/cases/view/30379 |
| PV-EXP-06 | CSV is named velocity-report.csv and holds full untruncated text values | C30380 | https://shopview.testrail.io/index.php?/cases/view/30380 |
| PV-EXP-07 | Em-dash in both exports; Last Sale reads "N days" in the PDF | C30381 | https://shopview.testrail.io/index.php?/cases/view/30381 |
| PV-EXP-08 | PDF export alignment: Type centered, text left, numeric and money right | C30382 | https://shopview.testrail.io/index.php?/cases/view/30382 |
| PV-EXP-10 | Export toasts: exact success texts; server or fallback error text on failure | C30384 | https://shopview.testrail.io/index.php?/cases/view/30384 |
| PV-VIS-01 | The report uses the standard two-tone layout | C30385 | https://shopview.testrail.io/index.php?/cases/view/30385 |
| PV-VIS-02 | Toolbar and table detail styling matches the suite paddings and borders | C30386 | https://shopview.testrail.io/index.php?/cases/view/30386 |
| PV-VIS-03 | Dark mode is supported and the grey info icon keeps 3:1 contrast in both | C30387 | https://shopview.testrail.io/index.php?/cases/view/30387 |
| PV-API-01 | The report is server-paginated - the backend returns one page of rows at a time | C30388 | https://shopview.testrail.io/index.php?/cases/view/30388 |
| PV-API-02 | Each filter or search change re-queries the server and returns page one | C30389 | https://shopview.testrail.io/index.php?/cases/view/30389 |
| PV-API-03 | Header-click sorting re-queries the server; nulls first asc and last desc | C30390 | https://shopview.testrail.io/index.php?/cases/view/30390 |
| PV-API-04 | The back end serves report data and export on ordinary reports access | C30391 | https://shopview.testrail.io/index.php?/cases/view/30391 |
| TU-NAV-01 | Technician Utilization sits under Performance, below existing report links | C30392 | https://shopview.testrail.io/index.php?/cases/view/30392 |
| TU-NAV-02 | One row per technician who clocked time in the range at those locations | C30393 | https://shopview.testrail.io/index.php?/cases/view/30393 |
| TU-NAV-03 | First visit defaults to the This Month preset and the user's active location | C30394 | https://shopview.testrail.io/index.php?/cases/view/30394 |
| TU-NAV-04 | Changing the date range reloads the rows; a Custom range is capped at 366 days | C30395 | https://shopview.testrail.io/index.php?/cases/view/30395 |
| TU-NAV-05 | The loading indicator shows on load and reload; rows swap only on data | C30396 | https://shopview.testrail.io/index.php?/cases/view/30396 |
| TU-NAV-06 | All clock records are day-grouped and windowed in one report-level time zone | C30397 | https://shopview.testrail.io/index.php?/cases/view/30397 |
| TU-NAV-07 | Without reports access Technician Utilization is hidden | C30398 | https://shopview.testrail.io/index.php?/cases/view/30398 |
| TU-NAV-08 | Standard no-data message when no time in scope or all technicians cleared | C30399 | https://shopview.testrail.io/index.php?/cases/view/30399 |
| TU-HRS-02 | Headers in fixed order; Total, WO and Internal Hours show clocked hours (2 dp) | C30401 | https://shopview.testrail.io/index.php?/cases/view/30401 |
| TU-HRS-03 | Utilization % is WO hours over total hours from unrounded values | C30402 | https://shopview.testrail.io/index.php?/cases/view/30402 |
| TU-HRS-04 | A technician with only internal hours shows 0.0% utilization | C30403 | https://shopview.testrail.io/index.php?/cases/view/30403 |
| TU-ELL-01 | Est. Lost Labor values internal hours at each location's default rate | C30404 | https://shopview.testrail.io/index.php?/cases/view/30404 |
| TU-ELL-02 | Est. Lost Labor, when shown, is pinned right and bold with the info icon | C30405 | https://shopview.testrail.io/index.php?/cases/view/30405 |
| TU-ELL-03 | Zero internal hours - or a configured $0.00 rate - shows $0.00, never an em-dash | C30406 | https://shopview.testrail.io/index.php?/cases/view/30406 |
| TU-ELL-04 | Internal hours with no default labor rate anywhere show an em-dash | C30407 | https://shopview.testrail.io/index.php?/cases/view/30407 |
| TU-ELL-05 | Internal hours split across rated and unrated locations show a part value | C30408 | https://shopview.testrail.io/index.php?/cases/view/30408 |
| TU-SORT-01 | On load rows sort by Technician A to Z with the ascending indicator | C30409 | https://shopview.testrail.io/index.php?/cases/view/30409 |
| TU-SORT-02 | All six columns sort on screen: ascending first, toggling with no third state | C30410 | https://shopview.testrail.io/index.php?/cases/view/30410 |
| TU-SORT-03 | A data reload resets the sort to Technician A to Z | C30411 | https://shopview.testrail.io/index.php?/cases/view/30411 |
| TU-SORT-04 | Sorting reorders only the technician rows | C30412 | https://shopview.testrail.io/index.php?/cases/view/30412 |
| TU-SORT-05 | Sorting Est. Lost Labor keeps em-dash rows last both ways; $0.00 sorts as 0 | C30413 | https://shopview.testrail.io/index.php?/cases/view/30413 |
| TU-SUM-01 | A pinned Summary row labeled Summary sits at the bottom, stays visible on scroll | C30414 | https://shopview.testrail.io/index.php?/cases/view/30414 |
| TU-SUM-02 | Summary totals visible technicians from unrounded hours; 0.01 drift expected | C30415 | https://shopview.testrail.io/index.php?/cases/view/30415 |
| TU-SUM-03 | Summary Utilization % is the weighted rate; not an average of the rows | C30416 | https://shopview.testrail.io/index.php?/cases/view/30416 |
| TU-SUM-04 | Summary Est. Lost Labor sums rated contributions; em-dash only if all are | C30417 | https://shopview.testrail.io/index.php?/cases/view/30417 |
| TU-DAY-01 | Each technician row has an accessible expand/collapse control | C30418 | https://shopview.testrail.io/index.php?/cases/view/30418 |
| TU-DAY-02 | Expanding shows one row per clocked day in date order, loaded on demand | C30419 | https://shopview.testrail.io/index.php?/cases/view/30419 |
| TU-DAY-03 | Day rows use the same columns and formats as the technician rows | C30420 | https://shopview.testrail.io/index.php?/cases/view/30420 |
| TU-DAY-04 | One control in the table header expands or collapses all technician rows | C30421 | https://shopview.testrail.io/index.php?/cases/view/30421 |
| TU-DAY-05 | Expansion state is view-only: it resets on any reload and fresh visit | C30422 | https://shopview.testrail.io/index.php?/cases/view/30422 |
| TU-TECH-01 | Filter by Technician starts with every technician selected on a first visit | C30423 | https://shopview.testrail.io/index.php?/cases/view/30423 |
| TU-TECH-02 | Deselecting a technician hides the row and recalculates the Summary | C30424 | https://shopview.testrail.io/index.php?/cases/view/30424 |
| TU-TECH-03 | All technicians and Clear all controls set every technician on or off | C30425 | https://shopview.testrail.io/index.php?/cases/view/30425 |
| TU-TECH-04 | Previously deselected technicians stay deselected on the next visit | C30426 | https://shopview.testrail.io/index.php?/cases/view/30426 |
| TU-LINK-01 | Total Hours is a real link with a non-color affordance and keyboard access | C30428 | https://shopview.testrail.io/index.php?/cases/view/30428 |
| TU-LINK-02 | The Total Hours link opens Timesheet Activities in the same tab | C30429 | https://shopview.testrail.io/index.php?/cases/view/30429 |
| TU-LINK-03 | Same range, single location, closed records: Total Hours matches Timesheet | C30430 | https://shopview.testrail.io/index.php?/cases/view/30430 |
| TU-LINK-04 | Reconcile exception (a): an open clock is snapshotted at each load instant | C30431 | https://shopview.testrail.io/index.php?/cases/view/30431 |
| TU-LINK-05 | Reconciliation exception (b): the link passes no location | C30432 | https://shopview.testrail.io/index.php?/cases/view/30432 |
| TU-LINK-06 | A day row's Total Hours links to that technician's single-day timesheet | C30433 | https://shopview.testrail.io/index.php?/cases/view/30433 |
| TU-EXP-01 | Three-dot menu is leftmost, then Column Selection; four download options | C30434 | https://shopview.testrail.io/index.php?/cases/view/30434 |
| TU-EXP-02 | The Summary PDF holds the technician rows plus the Summary | C30435 | https://shopview.testrail.io/index.php?/cases/view/30435 |
| TU-EXP-03 | The CSV is always summary-level, quotes comma-containing values | C30436 | https://shopview.testrail.io/index.php?/cases/view/30436 |
| TU-EXP-04 | Downloads cover only selected technicians, locations, and date range | C30437 | https://shopview.testrail.io/index.php?/cases/view/30437 |
| TU-EXP-05 | Downloads always order rows Technician A to Z; the on-screen sort is ignored | C30438 | https://shopview.testrail.io/index.php?/cases/view/30438 |
| TU-EXP-06 | PDF logo follows the uploaded logo; the spreadsheet never carries one | C30439 | https://shopview.testrail.io/index.php?/cases/view/30439 |
| TU-EXP-07 | Choosing a download with no technician selected is a silent no-op | C30440 | https://shopview.testrail.io/index.php?/cases/view/30440 |
| TU-EXP-08 | A starting download notifies; a failed one shows the failure message | C30441 | https://shopview.testrail.io/index.php?/cases/view/30441 |
| TU-LOC-01 | The Location filter is the rightmost multi-select; All Locations = select-all | C30442 | https://shopview.testrail.io/index.php?/cases/view/30442 |
| TU-LOC-02 | Location changes reload with hours pooled into one row per technician | C30443 | https://shopview.testrail.io/index.php?/cases/view/30443 |
| TU-LOC-03 | The saved location selection restores defensively; bad ones are dropped | C30444 | https://shopview.testrail.io/index.php?/cases/view/30444 |
| TU-LOC-05 | Technician Utilization: Location filter hidden for a one-location user | C30446 | https://shopview.testrail.io/index.php?/cases/view/30446 |
| TU-VIS-01 | All-white table with no row shading; toolbar controls in the fixed order | C30447 | https://shopview.testrail.io/index.php?/cases/view/30447 |
| TU-VIS-02 | Dark mode keeps every report element legible | C30448 | https://shopview.testrail.io/index.php?/cases/view/30448 |
| TU-API-01 | The per-day breakdown is fetched only when a technician row is expanded | C30449 | https://shopview.testrail.io/index.php?/cases/view/30449 |
| TU-API-02 | Date-range and location changes trigger a fresh server load | C30450 | https://shopview.testrail.io/index.php?/cases/view/30450 |
| WIP-TAB-01 | Work In Progress appears in the reports navigation under the Performance group | C30451 | https://shopview.testrail.io/index.php?/cases/view/30451 |
| WIP-TAB-02 | Four tabs in a fixed order with the partially-completed tab selected | C30452 | https://shopview.testrail.io/index.php?/cases/view/30452 |
| WIP-TAB-05 | There is no Trend / over-time tab or chart | C30455 | https://shopview.testrail.io/index.php?/cases/view/30455 |
| WIP-SCOPE-01 | Every open service WO at a selected location appears in the report | C30456 | https://shopview.testrail.io/index.php?/cases/view/30456 |
| WIP-SCOPE-02 | Invoiced; Paid and part-sale work orders never appear | C30457 | https://shopview.testrail.io/index.php?/cases/view/30457 |
| WIP-SCOPE-03 | Each qualifying work order appears exactly once in exactly one tab | C30458 | https://shopview.testrail.io/index.php?/cases/view/30458 |
| WIP-SCOPE-04 | While loading the standard indicator shows and old rows stay until data | C30459 | https://shopview.testrail.io/index.php?/cases/view/30459 |
| WIP-SCOPE-05 | No qualifying work orders: every tab shows the no-data message and no Totals | C30460 | https://shopview.testrail.io/index.php?/cases/view/30460 |
| WIP-PLACE-01 | Status-to-tab mapping: Estimate, Complete, In Progress and Review work orders | C30462 | https://shopview.testrail.io/index.php?/cases/view/30462 |
| WIP-PLACE-03 | Approved started-boundary: time or part received vs neither decides the tab | C30464 | https://shopview.testrail.io/index.php?/cases/view/30464 |
| WIP-COL-01 | With all toggleable columns on, the fixed column order and alignment hold | C30466 | https://shopview.testrail.io/index.php?/cases/view/30466 |
| WIP-COL-02 | First visit shows the default columns; the rest are in the column selector | C30467 | https://shopview.testrail.io/index.php?/cases/view/30467 |
| WIP-COL-03 | The WO # is a link that opens the WO in the same browser tab | C30468 | https://shopview.testrail.io/index.php?/cases/view/30468 |
| WIP-COL-04 | Status shows as a color-coded badge whose label text is always present | C30469 | https://shopview.testrail.io/index.php?/cases/view/30469 |
| WIP-COL-05 | The Asset cell shows the Unit # in bold with the VIN underneath, VIN alone when no unit | C30470 | https://shopview.testrail.io/index.php?/cases/view/30470 |
| WIP-COL-06 | Customer shows the customer's company name | C30471 | https://shopview.testrail.io/index.php?/cases/view/30471 |
| WIP-COL-07 | Days Open shows whole days since creation and reads 0 days / 1 days | C30472 | https://shopview.testrail.io/index.php?/cases/view/30472 |
| WIP-COL-08 | Last Activity shows Today; Xd ago; or an em-dash when there is none | C30473 | https://shopview.testrail.io/index.php?/cases/view/30473 |
| WIP-CALC-01 | Money columns show US dollars to two decimals with thousands separators | C30474 | https://shopview.testrail.io/index.php?/cases/view/30474 |
| WIP-CALC-02 | Labor Earned is the clocked share of each approved line's quoted value | C30475 | https://shopview.testrail.io/index.php?/cases/view/30475 |
| WIP-CALC-03 | Labor Remaining is the approved labor's quoted value minus Labor Earned | C30476 | https://shopview.testrail.io/index.php?/cases/view/30476 |
| WIP-CALC-04 | Parts Earned is the sell value of approved-line parts already received | C30477 | https://shopview.testrail.io/index.php?/cases/view/30477 |
| WIP-CALC-05 | Parts Remaining values the not-yet-received quantity at its sell price | C30478 | https://shopview.testrail.io/index.php?/cases/view/30478 |
| WIP-CALC-06 | Earned + Remaining make Total; not the WO's grand total | C30479 | https://shopview.testrail.io/index.php?/cases/view/30479 |
| WIP-CALC-07 | Lines that are not yet approved contribute nothing to any money figure | C30480 | https://shopview.testrail.io/index.php?/cases/view/30480 |
| WIP-CALC-08 | Labor Delta shows quoted minus worked hours; signed to one decimal | C30481 | https://shopview.testrail.io/index.php?/cases/view/30481 |
| WIP-CALC-09 | An open estimate with no approved work shows $0.00 in every money column | C30482 | https://shopview.testrail.io/index.php?/cases/view/30482 |
| WIP-SORT-01 | The initial sort is Days Open with the longest-open work order first | C30483 | https://shopview.testrail.io/index.php?/cases/view/30483 |
| WIP-SORT-02 | Clicking a header sorts ascending, clicking again toggles descending | C30484 | https://shopview.testrail.io/index.php?/cases/view/30484 |
| WIP-SORT-03 | Columns sort by their underlying values; Asset sorts by the Unit # | C30485 | https://shopview.testrail.io/index.php?/cases/view/30485 |
| WIP-SORT-04 | Sorting reorders only the active tab's rows; Totals stays at the bottom | C30486 | https://shopview.testrail.io/index.php?/cases/view/30486 |
| WIP-SUM-01 | The summary strip shows seven figures in a fixed order as US dollars | C30487 | https://shopview.testrail.io/index.php?/cases/view/30487 |
| WIP-SUM-02 | Total Earned is the hero figure and equals the started-stage figures summed | C30488 | https://shopview.testrail.io/index.php?/cases/view/30488 |
| WIP-SUM-03 | Total Remaining equals Not Started plus Started — Remaining | C30489 | https://shopview.testrail.io/index.php?/cases/view/30489 |
| WIP-SUM-04 | Each per-stage figure equals the matching tab's money total | C30490 | https://shopview.testrail.io/index.php?/cases/view/30490 |
| WIP-SUM-05 | The Estimates figure is the Estimates tab's total quoted value, shown muted | C30491 | https://shopview.testrail.io/index.php?/cases/view/30491 |
| WIP-SUM-07 | Each summary figure's information icon reveals its plain explanation | C30493 | https://shopview.testrail.io/index.php?/cases/view/30493 |
| WIP-TOT-01 | Each tab has a Totals row pinned to the bottom, labeled "Totals" | C30494 | https://shopview.testrail.io/index.php?/cases/view/30494 |
| WIP-TOT-02 | The Totals row sums each visible money column and the Labor Delta column | C30495 | https://shopview.testrail.io/index.php?/cases/view/30495 |
| WIP-FLT-01 | The Advisor filter lists the advisors in the loaded jobs; screen only | C30498 | https://shopview.testrail.io/index.php?/cases/view/30498 |
| WIP-FLT-02 | Customer filter is a type-ahead multi-select reading "All customers" | C30499 | https://shopview.testrail.io/index.php?/cases/view/30499 |
| WIP-FLT-03 | Asset filter shows Unit # and VIN and matches text against either one | C30500 | https://shopview.testrail.io/index.php?/cases/view/30500 |
| WIP-FLT-04 | The "as of" date is a single day: defaults to today, capped at today, no range | C30501 | https://shopview.testrail.io/index.php?/cases/view/30501 |
| WIP-FLT-05 | The "as of" date shows the end-of-day position and reloads when changed | C30502 | https://shopview.testrail.io/index.php?/cases/view/30502 |
| WIP-FLT-06 | Location filter: rightmost multi-select with All locations, reloads on change | C30503 | https://shopview.testrail.io/index.php?/cases/view/30503 |
| WIP-FLT-07 | The location scope never includes an inaccessible location | C30504 | https://shopview.testrail.io/index.php?/cases/view/30504 |
| WIP-FLT-08 | Advisor, customer and asset filters AND together and recompute strip and Totals | C30505 | https://shopview.testrail.io/index.php?/cases/view/30505 |
| WIP-PERS-01 | Column Selection toggles columns; Total is not offered at all | C30506 | https://shopview.testrail.io/index.php?/cases/view/30506 |
| WIP-PERS-02 | Toggling columns never reorders them (Total always last) | C30507 | https://shopview.testrail.io/index.php?/cases/view/30507 |
| WIP-PERS-03 | Remembers the "as of" date, filter selections, location, columns | C30508 | https://shopview.testrail.io/index.php?/cases/view/30508 |
| WIP-PERS-04 | A saved setting that is no longer valid falls back to its default | C30509 | https://shopview.testrail.io/index.php?/cases/view/30509 |
| WIP-EXP-01 | Work In Progress: a three-dot menu holds Download (PDF) and Download (CSV) | C30510 | https://shopview.testrail.io/index.php?/cases/view/30510 |
| WIP-EXP-02 | Downloads keep shown columns, honor filters, include the tab's Totals row | C30511 | https://shopview.testrail.io/index.php?/cases/view/30511 |
| WIP-EXP-03 | Downloaded money and Labor Delta values keep the on-screen formats | C30512 | https://shopview.testrail.io/index.php?/cases/view/30512 |
| WIP-EXP-04 | Labor Delta green/red coloring appears on screen and in the PDF; not the CSV | C30513 | https://shopview.testrail.io/index.php?/cases/view/30513 |
| WIP-EXP-05 | Days Open in a download is frozen at the moment the file is generated | C30514 | https://shopview.testrail.io/index.php?/cases/view/30514 |
| WIP-EXP-06 | The downloaded files are named "wip-2-report.pdf" and "wip-2-report.csv" | C30515 | https://shopview.testrail.io/index.php?/cases/view/30515 |
| WIP-EXP-07 | Export headers read "Unit" and "Branch" — documented limitation, do not file | C30516 | https://shopview.testrail.io/index.php?/cases/view/30516 |
| WIP-EXP-08 | The PDF shows the shop logo at the top when one is set | C30517 | https://shopview.testrail.io/index.php?/cases/view/30517 |
| WIP-EXP-09 | Export notifications: success caption, "Empty export" warning | C30518 | https://shopview.testrail.io/index.php?/cases/view/30518 |
| WIP-VIS-01 | Each tab uses an all-white table with no alternating row shading | C30519 | https://shopview.testrail.io/index.php?/cases/view/30519 |
| WIP-VIS-02 | The summary strip is a bold band ruled top and bottom above the tabs | C30520 | https://shopview.testrail.io/index.php?/cases/view/30520 |
| WIP-VIS-03 | The Total column is bold and stays pinned right on sideways scroll | C30521 | https://shopview.testrail.io/index.php?/cases/view/30521 |
| WIP-VIS-04 | The Totals row stays visible while only the active tab's body scrolls | C30522 | https://shopview.testrail.io/index.php?/cases/view/30522 |
| WIP-VIS-05 | The WO # link is keyboard-focusable and opens the work order | C30523 | https://shopview.testrail.io/index.php?/cases/view/30523 |
| WIP-VIS-06 | Each summary figure's info icon is keyboard-reachable and screen-read | C30524 | https://shopview.testrail.io/index.php?/cases/view/30524 |
| WIP-VIS-07 | In dark mode every table; strip; link and coloring stays legible | C30525 | https://shopview.testrail.io/index.php?/cases/view/30525 |
| WIP-PERM-01 | Ordinary reports access covers opening and downloading Work In Progress | C30526 | https://shopview.testrail.io/index.php?/cases/view/30526 |
| WIP-PERM-02 | Without reports access Work In Progress is absent from the navigation | C30527 | https://shopview.testrail.io/index.php?/cases/view/30527 |
| WIP-API-01 | Nightly snapshot records one row per then-open job per calendar date | C30528 | https://shopview.testrail.io/index.php?/cases/view/30528 |
| WIP-API-03 | Captured Earned and Remaining use the same maths as the on-screen report | C30530 | https://shopview.testrail.io/index.php?/cases/view/30530 |
| WIP-API-04 | Nightly snapshot spans every location with no user location filter | C30531 | https://shopview.testrail.io/index.php?/cases/view/30531 |
| WIP-API-06 | Nightly snapshot: a job with nothing approved is captured at $0.00; not skipped | C30533 | https://shopview.testrail.io/index.php?/cases/view/30533 |
| IV-NAV-01 | Inventory Value appears in the reports navigation under the Parts group | C30534 | https://shopview.testrail.io/index.php?/cases/view/30534 |
| IV-NAV-02 | One row per in-stock part at the selected locations valued at the resolved date | C30535 | https://shopview.testrail.io/index.php?/cases/view/30535 |
| IV-NAV-03 | First visit defaults to today and the active location | C30536 | https://shopview.testrail.io/index.php?/cases/view/30536 |
| IV-NAV-05 | The report is server-paginated: one page of rows at a time | C30538 | https://shopview.testrail.io/index.php?/cases/view/30538 |
| IV-NAV-06 | No qualifying parts, day or location: the no-data message shows and no totals | C30539 | https://shopview.testrail.io/index.php?/cases/view/30539 |
| IV-SCOPE-01 | A part appears only if not a core charge and on-hand quantity is above zero | C30540 | https://shopview.testrail.io/index.php?/cases/view/30540 |
| IV-SCOPE-02 | A part stocked at two selected locations shows as two rows; never merged | C30541 | https://shopview.testrail.io/index.php?/cases/view/30541 |
| IV-CALC-01 | Unit Sell uses the part's fixed sell price when one is set | C30545 | https://shopview.testrail.io/index.php?/cases/view/30545 |
| IV-CALC-02 | With no fixed sell price Unit Sell is the category's pricing-matrix markup | C30546 | https://shopview.testrail.io/index.php?/cases/view/30546 |
| IV-CALC-03 | With no fixed sell price and no category, Unit Sell equals Unit Cost | C30547 | https://shopview.testrail.io/index.php?/cases/view/30547 |
| IV-CALC-04 | Total Sell is quantity × Unit Sell and Total Cost is quantity × Unit Cost | C30548 | https://shopview.testrail.io/index.php?/cases/view/30548 |
| IV-CALC-05 | Margin is Total Sell minus Total Cost for the whole on-hand quantity | C30549 | https://shopview.testrail.io/index.php?/cases/view/30549 |
| IV-CALC-06 | Margin % is Margin over Total Sell to one decimal; em-dash when Sell <= 0 | C30550 | https://shopview.testrail.io/index.php?/cases/view/30550 |
| IV-COL-01 | With every column on they appear in the fixed order with the set alignment | C30551 | https://shopview.testrail.io/index.php?/cases/view/30551 |
| IV-COL-02 | Value formats: Qty to two decimals; money as US-dollar currency | C30552 | https://shopview.testrail.io/index.php?/cases/view/30552 |
| IV-COL-03 | Total Cost is bold and pinned far right; it stays put on sideways scroll | C30553 | https://shopview.testrail.io/index.php?/cases/view/30553 |
| IV-COL-04 | On a first visit the default columns show and the rest stay available | C30554 | https://shopview.testrail.io/index.php?/cases/view/30554 |
| IV-COL-05 | Category and Vendor show their names; an em dash ("—") when the part has none | C30555 | https://shopview.testrail.io/index.php?/cases/view/30555 |
| IV-TOT-01 | Totals row: Total label, blank identity/per-unit cells, pinned bold Total Cost | C30556 | https://shopview.testrail.io/index.php?/cases/view/30556 |
| IV-TOT-02 | Totals row sums the FULL filtered set on the server, not just the visible page | C30557 | https://shopview.testrail.io/index.php?/cases/view/30557 |
| IV-TOT-03 | Totals-row Margin % is recomputed from the totals; not an average of rows | C30558 | https://shopview.testrail.io/index.php?/cases/view/30558 |
| IV-DATE-01 | "As of" date control: a single day, defaults to today, capped at today | C30561 | https://shopview.testrail.io/index.php?/cases/view/30561 |
| IV-DATE-02 | The report values inventory as of the END of the selected range | C30562 | https://shopview.testrail.io/index.php?/cases/view/30562 |
| IV-DATE-03 | The "as of" date today, with today not yet recorded, values live stock | C30563 | https://shopview.testrail.io/index.php?/cases/view/30563 |
| IV-DATE-04 | For a past date the report replays the closest recorded day on or before it | C30564 | https://shopview.testrail.io/index.php?/cases/view/30564 |
| IV-DATE-05 | The date control names the resolved day; no separate "As of" indicator | C30565 | https://shopview.testrail.io/index.php?/cases/view/30565 |
| IV-DATE-06 | The "as of" date values stock as of that day; capped at today | C30566 | https://shopview.testrail.io/index.php?/cases/view/30566 |
| IV-DATE-08 | History accrues forward only; a pre-first-recording date is not shown | C30568 | https://shopview.testrail.io/index.php?/cases/view/30568 |
| IV-FLT-01 | Category and Vendor multi-selects reload the report to matching parts only | C30569 | https://shopview.testrail.io/index.php?/cases/view/30569 |
| IV-FLT-02 | Category, Vendor and part search are server-side; each change returns page 1 | C30570 | https://shopview.testrail.io/index.php?/cases/view/30570 |
| IV-FLT-03 | With no category or vendor selected all parts show | C30571 | https://shopview.testrail.io/index.php?/cases/view/30571 |
| IV-FLT-04 | Part search matches part number or description on the server; case-insensitive | C30572 | https://shopview.testrail.io/index.php?/cases/view/30572 |
| IV-FLT-05 | "As of" date, Location, Category, Vendor and part search combine with AND | C30573 | https://shopview.testrail.io/index.php?/cases/view/30573 |
| IV-LOC-01 | The Location filter is a rightmost multi-select with an All locations toggle | C30574 | https://shopview.testrail.io/index.php?/cases/view/30574 |
| IV-LOC-02 | Selecting one, several, or all locations reloads the report scoped to that set | C30575 | https://shopview.testrail.io/index.php?/cases/view/30575 |
| IV-LOC-03 | Scoping never includes an inaccessible location | C30576 | https://shopview.testrail.io/index.php?/cases/view/30576 |
| IV-LOC-04 | Inventory Value: the Location filter is hidden for a one-location user | C30577 | https://shopview.testrail.io/index.php?/cases/view/30577 |
| IV-PERS-01 | Column Selection toggles columns; Total Cost cannot be turned off | C30579 | https://shopview.testrail.io/index.php?/cases/view/30579 |
| IV-PERS-02 | Toggling columns never reorders them | C30580 | https://shopview.testrail.io/index.php?/cases/view/30580 |
| IV-PERS-03 | The report remembers all filters; columns and sort per browser | C30581 | https://shopview.testrail.io/index.php?/cases/view/30581 |
| IV-PERS-04 | Defensive restore: a stale saved category or vendor is dropped on load | C30582 | https://shopview.testrail.io/index.php?/cases/view/30582 |
| IV-SORT-01 | Rows are sorted by Total Cost highest first on load and after any reload | C30583 | https://shopview.testrail.io/index.php?/cases/view/30583 |
| IV-SORT-02 | Header clicks sort ascending then descending; no third state; page 1 returns | C30584 | https://shopview.testrail.io/index.php?/cases/view/30584 |
| IV-SORT-03 | Money and numeric columns sort by value; text columns sort as text | C30585 | https://shopview.testrail.io/index.php?/cases/view/30585 |
| IV-EXP-01 | Inventory Value: a three-dot menu holds Download (PDF) and Download (CSV) | C30587 | https://shopview.testrail.io/index.php?/cases/view/30587 |
| IV-EXP-02 | Downloads keep shown columns and order, honor filters, and include Totals | C30588 | https://shopview.testrail.io/index.php?/cases/view/30588 |
| IV-EXP-03 | Export number formats: money to 2 decimals; Margin % to 1 with em-dash | C30589 | https://shopview.testrail.io/index.php?/cases/view/30589 |
| IV-EXP-04 | PDF header shows report name; org; period and an as-of line; logo if set | C30590 | https://shopview.testrail.io/index.php?/cases/view/30590 |
| IV-EXP-05 | Downloaded files are named inventory-value-report.pdf and .csv | C30591 | https://shopview.testrail.io/index.php?/cases/view/30591 |
| IV-EXP-06 | Exports are generated server-side over the full filtered set | C30592 | https://shopview.testrail.io/index.php?/cases/view/30592 |
| IV-EXP-07 | An over-cap set produces no file and shows the too-large-to-export message | C30593 | https://shopview.testrail.io/index.php?/cases/view/30593 |
| IV-EXP-09 | Download notifications: verbatim success and failure texts per format | C30595 | https://shopview.testrail.io/index.php?/cases/view/30595 |
| IV-VIS-01 | All-white table with no row shading on the standard report backdrop | C30596 | https://shopview.testrail.io/index.php?/cases/view/30596 |
| IV-VIS-02 | Toolbar layout: menu leftmost then Column Selection; then the 5 filters | C30597 | https://shopview.testrail.io/index.php?/cases/view/30597 |
| IV-VIS-04 | Long Description; Category and Vendor truncate on hover; Part # never does | C30599 | https://shopview.testrail.io/index.php?/cases/view/30599 |
| IV-VIS-05 | In dark mode the page background, toolbar, cells; the "—" glyph remain legible | C30600 | https://shopview.testrail.io/index.php?/cases/view/30600 |
| IV-VIS-06 | Each sortable header exposes its sort state and shows the direction | C30601 | https://shopview.testrail.io/index.php?/cases/view/30601 |
| IV-VIS-07 | The icon-only download and Column Selection buttons carry accessible names | C30602 | https://shopview.testrail.io/index.php?/cases/view/30602 |
| IV-PERM-01 | A user with ordinary reports access can open Inventory Value | C30603 | https://shopview.testrail.io/index.php?/cases/view/30603 |
| IV-PERM-02 | Without reports access Inventory Value is absent from the navigation | C30604 | https://shopview.testrail.io/index.php?/cases/view/30604 |
| IV-API-01 | Nightly snapshot records one row per in-stock non-core part per location | C30605 | https://shopview.testrail.io/index.php?/cases/view/30605 |
| IV-API-02 | A recorded snapshot day equals what the live report showed that day | C30606 | https://shopview.testrail.io/index.php?/cases/view/30606 |
| IV-API-03 | Nightly snapshot: re-running the capture for a date replaces that date's rows | C30607 | https://shopview.testrail.io/index.php?/cases/view/30607 |
| IV-API-05 | Snapshot retention: daily captures are kept for 0–13 months | C30609 | https://shopview.testrail.io/index.php?/cases/view/30609 |
| IV-API-06 | Thinned history still served by the closest-recorded-day rule | C30610 | https://shopview.testrail.io/index.php?/cases/view/30610 |
| SBC-EXP-16 | Summary and Expanded View downloads exist for both PDF and CSV | C38856 | https://shopview.testrail.io/index.php?/cases/view/38856 |
| TU-COL-01 | Column Selection: Technician always on, the other five toggleable, remembered | C38859 | https://shopview.testrail.io/index.php?/cases/view/38859 |
| PV-EXP-11 | An over-cap Parts Velocity export is refused with the too-large message | C38885 | https://shopview.testrail.io/index.php?/cases/view/38885 |
| TU-EXP-09 | An over-cap Technician Utilization export is refused with the too-large message | C38887 | https://shopview.testrail.io/index.php?/cases/view/38887 |
| WIP-CALC-10 | A technician still clocked in counts toward Labor Earned, capped at the quote | C38890 | https://shopview.testrail.io/index.php?/cases/view/38890 |
| IV-DATE-09 | A recorded day keeps its category and vendor names after a rename or delete | C38892 | https://shopview.testrail.io/index.php?/cases/view/38892 |
| SBR-CALC-09 | A clock-record edit after invoicing updates Labor Delta; billed money stays put | C38894 | https://shopview.testrail.io/index.php?/cases/view/38894 |
| SBC-LOC-04 | Location column: shown to any multi-location user, Multiple on aggregating rows | C38912 | https://shopview.testrail.io/index.php?/cases/view/38912 |
| SBR-LOC-05 | Location column: shown to any multi-location user; toggleable; rep rows Multiple | C38913 | https://shopview.testrail.io/index.php?/cases/view/38913 |
| PV-FILT-14 | Location column: leftmost before Type; own location per row; Multiple on merged | C38914 | https://shopview.testrail.io/index.php?/cases/view/38914 |
| TU-LOC-06 | Location column: leftmost for a multi-location user; Summary row blank | C38915 | https://shopview.testrail.io/index.php?/cases/view/38915 |
| WIP-FLT-09 | Location column names each work order's location and never reads Multiple | C38916 | https://shopview.testrail.io/index.php?/cases/view/38916 |
| IV-LOC-06 | Location column: shown to any multi-location user; toggleable; never Multiple | C38917 | https://shopview.testrail.io/index.php?/cases/view/38917 |
| WIP-EXP-10 | An over-cap Work In Progress download is refused with the too-large message | C38918 | https://shopview.testrail.io/index.php?/cases/view/38918 |
| PV-PREC-01 | Units Sold keeps an exact part-of-a-unit quantity and is never rounded off | C38924 | https://shopview.testrail.io/index.php?/cases/view/38924 |
| PV-PREC-02 | QuickBooks amount for a part-of-a-unit sale is exact and never inflated | C38925 | https://shopview.testrail.io/index.php?/cases/view/38925 |
| SBC-PERM-05 | No Sales By Customer permission is offered in the role permission editor | C39447 | https://shopview.testrail.io/index.php?/cases/view/39447 |
| SBC-API-06 | The back end serves SBC report data and export on ordinary reports access | C43546 | https://shopview.testrail.io/index.php?/cases/view/43546 |
| PV-EXP-12 | A large PDF download fails outright while the CSV of the same view works | C43547 | https://shopview.testrail.io/index.php?/cases/view/43547 |
| IV-EXP-10 | A large Inventory Value PDF fails instead of being refused politely | C43548 | https://shopview.testrail.io/index.php?/cases/view/43548 |
| SBC-COL-04 | A one-location user never sees Location in the column-selection list | C43550 | https://shopview.testrail.io/index.php?/cases/view/43550 |
| WIP-PERS-05 | A hand-made Location column choice is remembered like any other column | C43551 | https://shopview.testrail.io/index.php?/cases/view/43551 |
| TU-EXP-10 | Both spreadsheet downloads hold the summary rows and no per-day rows | C43552 | https://shopview.testrail.io/index.php?/cases/view/43552 |
| SBC-EXP-17 | A logo that is set but will not load falls back to the ShopView logo | C43553 | https://shopview.testrail.io/index.php?/cases/view/43553 |
| WIP-COL-09 | The WO # is plain text, not a link, without Work Order permission | C43557 | https://shopview.testrail.io/index.php?/cases/view/43557 |
| SBC-LINK-05 | You cannot reach an invoice you have no permission to open | C43558 | https://shopview.testrail.io/index.php?/cases/view/43558 |
| SBR-LINK-06 | Invoice # and customer name when you cannot open what they point at | C43559 | https://shopview.testrail.io/index.php?/cases/view/43559 |
| SBC-TYPE-04 | Clear all leaves neither Product Type toggle on and shows the empty state | C43591 | https://shopview.testrail.io/index.php?/cases/view/43591 |
| WIP-CALC-11 | A fixed-price line is valued at its fixed amount, not at picked parts or hours | C43592 | https://shopview.testrail.io/index.php?/cases/view/43592 |
| WIP-CALC-12 | A fixed-price line with no invoiced hours earns all at once when it is completed | C43593 | https://shopview.testrail.io/index.php?/cases/view/43593 |
| WIP-CALC-13 | Core charges count in parts value and a core decision never moves the figures | C43594 | https://shopview.testrail.io/index.php?/cases/view/43594 |

---

# 3 · FILTERS (TestRail group 4110)

**Our cases: 124.** Every case current to **Confluence version 21**, epic **SV-8785 (33 children)**. Live census: **ours 124 / live 129 / foreign 5 (Ahtasham Amjad)** (sets equal both ways). **Created 9 · Changed 115.**

## 3a · CREATED in this effort (9)

| Internal ID | Title | C-id | TestRail link |
|---|---|---|---|
| FLT-ASSIGN-01 | Assigned to me is a toggle chip with no arrow that turns on and off | C43841 | https://shopview.testrail.io/index.php?/cases/view/43841 |
| FLT-ASSIGN-02 | Turning Assigned to me on highlights the chip with no value and no clear X | C43842 | https://shopview.testrail.io/index.php?/cases/view/43842 |
| FLT-ASSIGN-03 | Assigned to me narrows to my work orders on top of the tab and filters | C43843 | https://shopview.testrail.io/index.php?/cases/view/43843 |
| FLT-BANNER-01 | A shared-link banner appears above the tabs when you open a filtered link | C43844 | https://shopview.testrail.io/index.php?/cases/view/43844 |
| FLT-TAB-WO-01 | The Work Orders tab pre-filters to Estimate, Approved and In Progress | C43845 | https://shopview.testrail.io/index.php?/cases/view/43845 |
| FLT-LAYOUT-01 | Filter chips sit in the toolbar row; on pages with no tabs, the title row | C43846 | https://shopview.testrail.io/index.php?/cases/view/43846 |
| FLT-LAYOUT-02 | Toolbar order is search, filter chips, icon actions, then the main button | C43847 | https://shopview.testrail.io/index.php?/cases/view/43847 |
| FLT-CHIP-07 | A selected chip shows an X to clear on hover and shortens a long value | C43848 | https://shopview.testrail.io/index.php?/cases/view/43848 |
| FLT-PANEL-01 | A filter panel opens under its chip and stays applied when you click away | C43849 | https://shopview.testrail.io/index.php?/cases/view/43849 |

## 3b · UPDATED / CHANGED in this effort (115) — re-open to see what changed

Deduplicated by C-id: Fabian authoring updates (60) + currency-pass touches (55); no overlap. Sorted by C-id.

| Internal ID | Title | C-id | TestRail link |
|---|---|---|---|
| FLT-BAR-01 | Filter chips sit in the Work Orders toolbar row, not a separate filter bar | C29557 | https://shopview.testrail.io/index.php?/cases/view/29557 |
| FLT-BAR-02 | Work Orders shows three filter chips: Status, Assigned to me, Asset on Site | C29558 | https://shopview.testrail.io/index.php?/cases/view/29558 |
| FLT-BAR-03 | On the Estimates tab the Assigned to me and Asset on Site chips still show | C29559 | https://shopview.testrail.io/index.php?/cases/view/29559 |
| FLT-STAT-01 | Status chip opens a checkbox list of all nine statuses plus Clear selection | C29560 | https://shopview.testrail.io/index.php?/cases/view/29560 |
| FLT-STAT-02 | Ticking one status filters the table immediately, with no apply button | C29561 | https://shopview.testrail.io/index.php?/cases/view/29561 |
| FLT-STAT-03 | Ticking several statuses shows work orders matching any of them | C29562 | https://shopview.testrail.io/index.php?/cases/view/29562 |
| FLT-STAT-04 | Clear Selection in the Status dropdown unticks every status | C29563 | https://shopview.testrail.io/index.php?/cases/view/29563 |
| FLT-STAT-05 | Clicking outside the Status dropdown closes it and keeps the selections applied | C29564 | https://shopview.testrail.io/index.php?/cases/view/29564 |
| FLT-STAT-06 | Selecting statuses that no work order has shows the empty state | C29565 | https://shopview.testrail.io/index.php?/cases/view/29565 |
| FLT-CUST-01 | An entity filter opens a searchable panel with a list and Clear selection | C29566 | https://shopview.testrail.io/index.php?/cases/view/29566 |
| FLT-CUST-02 | Typing in an entity filter search narrows the list to matching values | C29567 | https://shopview.testrail.io/index.php?/cases/view/29567 |
| FLT-CUST-03 | Selected entity values show as removable pills and as ticks in the list | C29568 | https://shopview.testrail.io/index.php?/cases/view/29568 |
| FLT-CUST-04 | Clicking the X on an entity value pill removes just that one value | C29569 | https://shopview.testrail.io/index.php?/cases/view/29569 |
| FLT-CUST-05 | An entity filter narrows the table to records matching any selected value | C29570 | https://shopview.testrail.io/index.php?/cases/view/29570 |
| FLT-CUST-06 | Clear selection in an entity filter panel removes all its selected values | C29571 | https://shopview.testrail.io/index.php?/cases/view/29571 |
| FLT-CUST-07 | Clicking outside an entity filter panel closes it and keeps the selection | C29572 | https://shopview.testrail.io/index.php?/cases/view/29572 |
| FLT-CUST-08 | An entity filter search that matches nothing shows No matches | C29573 | https://shopview.testrail.io/index.php?/cases/view/29573 |
| FLT-CUST-09 | Selecting an entity value that has no records shows the empty state | C29574 | https://shopview.testrail.io/index.php?/cases/view/29574 |
| FLT-TECH-01 | Lead Technician is removed from Work Orders; its panel survives elsewhere | C29575 | https://shopview.testrail.io/index.php?/cases/view/29575 |
| FLT-TECH-02 | Typing in a technician filter search narrows the list to matching names | C29576 | https://shopview.testrail.io/index.php?/cases/view/29576 |
| FLT-TECH-03 | A technician filter shows only records where they are the lead technician | C29577 | https://shopview.testrail.io/index.php?/cases/view/29577 |
| FLT-TECH-04 | Clear selection in the technician filter panel removes all technicians | C29578 | https://shopview.testrail.io/index.php?/cases/view/29578 |
| FLT-TECH-05 | Clicking outside the technician filter panel closes it and keeps the selection | C29579 | https://shopview.testrail.io/index.php?/cases/view/29579 |
| FLT-TECH-06 | Selecting a technician who leads no records shows the empty state | C29580 | https://shopview.testrail.io/index.php?/cases/view/29580 |
| FLT-TECH-07 | A deactivated technician does not appear in the technician filter list | C29581 | https://shopview.testrail.io/index.php?/cases/view/29581 |
| FLT-ADV-01 | Service Advisor is removed from Work Orders; its panel survives elsewhere | C29582 | https://shopview.testrail.io/index.php?/cases/view/29582 |
| FLT-ADV-02 | Typing in an advisor filter search narrows the list to matching names | C29583 | https://shopview.testrail.io/index.php?/cases/view/29583 |
| FLT-ADV-03 | An advisor filter shows only records assigned to the selected advisors | C29584 | https://shopview.testrail.io/index.php?/cases/view/29584 |
| FLT-ADV-04 | Clear selection in the advisor filter panel removes all advisors | C29585 | https://shopview.testrail.io/index.php?/cases/view/29585 |
| FLT-ADV-05 | Clicking outside the advisor filter panel closes it and keeps the selection | C29586 | https://shopview.testrail.io/index.php?/cases/view/29586 |
| FLT-ADV-06 | Selecting an advisor with no assigned records shows the empty state | C29587 | https://shopview.testrail.io/index.php?/cases/view/29587 |
| FLT-ADV-07 | A deactivated advisor does not appear in the advisor filter list | C29588 | https://shopview.testrail.io/index.php?/cases/view/29588 |
| FLT-ASSET-01 | Asset on Site opens a single-select list with a checkmark on the chosen row | C29589 | https://shopview.testrail.io/index.php?/cases/view/29589 |
| FLT-ASSET-02 | Choosing Yes shows only work orders whose asset is on site | C29590 | https://shopview.testrail.io/index.php?/cases/view/29590 |
| FLT-ASSET-03 | Asset on Site is single-select: choosing the other option replaces the first | C29591 | https://shopview.testrail.io/index.php?/cases/view/29591 |
| FLT-ASSET-04 | Clear Selection in the Asset on Site dropdown removes the filter | C29592 | https://shopview.testrail.io/index.php?/cases/view/29592 |
| FLT-ASSET-05 | Clicking outside the Asset on Site dropdown closes it | C29593 | https://shopview.testrail.io/index.php?/cases/view/29593 |
| FLT-ASSET-06 | An Asset on Site choice that matches no work orders shows the empty state | C29594 | https://shopview.testrail.io/index.php?/cases/view/29594 |
| FLT-CHIP-01 | A chip with a selected value turns blue and shows the value | C29595 | https://shopview.testrail.io/index.php?/cases/view/29595 |
| FLT-CHIP-02 | A chip with several values shows the first ones and shortens the rest | C29596 | https://shopview.testrail.io/index.php?/cases/view/29596 |
| FLT-CHIP-03 | There is no global Clear filters button; each filter is cleared on its own | C29597 | https://shopview.testrail.io/index.php?/cases/view/29597 |
| FLT-CHIP-04 | Clearing a filter does not clear a typed search, and vice versa | C29598 | https://shopview.testrail.io/index.php?/cases/view/29598 |
| FLT-CHIP-05 | Clear selection in one panel clears only that filter, leaving others | C29599 | https://shopview.testrail.io/index.php?/cases/view/29599 |
| FLT-CHIP-06 | Status and Asset on Site together show only work orders matching both | C29600 | https://shopview.testrail.io/index.php?/cases/view/29600 |
| FLT-COLL-01 | There is no control to collapse or hide the filter chips on any page | C29601 | https://shopview.testrail.io/index.php?/cases/view/29601 |
| FLT-COLL-02 | There is no remembered collapsed or expanded state, because there is no toggle | C29602 | https://shopview.testrail.io/index.php?/cases/view/29602 |
| FLT-COLL-03 | There is no collapsed-state indicator, because the chips are always shown | C29603 | https://shopview.testrail.io/index.php?/cases/view/29603 |
| FLT-COLL-04 | Active filters always keep filtering the table; there is no bar to collapse | C29604 | https://shopview.testrail.io/index.php?/cases/view/29604 |
| FLT-COLL-05 | Every page shows its filter chips with no toggle, whatever the filter count | C29605 | https://shopview.testrail.io/index.php?/cases/view/29605 |
| FLT-EMPTY-01 | A filter combination with no matches shows a no-results empty state | C29606 | https://shopview.testrail.io/index.php?/cases/view/29606 |
| FLT-EMPTY-02 | The filtered empty state names the active filters and search and clears each | C29607 | https://shopview.testrail.io/index.php?/cases/view/29607 |
| FLT-TAB-01 | The All tab shows the three Work Orders filter chips, all working | C29608 | https://shopview.testrail.io/index.php?/cases/view/29608 |
| FLT-TAB-02 | Estimates tab: Assigned to me and Asset on Site chips work; Status pre-set | C29609 | https://shopview.testrail.io/index.php?/cases/view/29609 |
| FLT-TAB-03 | Completed tab: Assigned to me and Asset on Site chips work; Status pre-set | C29610 | https://shopview.testrail.io/index.php?/cases/view/29610 |
| FLT-TAB-04 | The My Work Orders tab is gone; the Assigned to me chip does its job | C29611 | https://shopview.testrail.io/index.php?/cases/view/29611 |
| FLT-TAB-05 | A Status choice is kept while you switch tabs and returns on the All tab | C29612 | https://shopview.testrail.io/index.php?/cases/view/29612 |
| FLT-PERS-01 | Leaving the page and returning restores your filter selections | C29613 | https://shopview.testrail.io/index.php?/cases/view/29613 |
| FLT-PERS-02 | Filters are remembered permanently, even after closing the browser | C29614 | https://shopview.testrail.io/index.php?/cases/view/29614 |
| FLT-PERS-03 | Saved filters are per user: one user's filters do not appear for another user | C29615 | https://shopview.testrail.io/index.php?/cases/view/29615 |
| FLT-PERS-04 | A remembered filter value that was deleted is silently ignored | C29616 | https://shopview.testrail.io/index.php?/cases/view/29616 |
| FLT-URL-01 | Applying filters updates the page URL to reflect the active filter state | C29617 | https://shopview.testrail.io/index.php?/cases/view/29617 |
| FLT-URL-02 | Opening a shared URL or bookmark loads the page with those filters on | C29618 | https://shopview.testrail.io/index.php?/cases/view/29618 |
| FLT-URL-03 | A URL with a deleted filter value loads and ignores that value | C29619 | https://shopview.testrail.io/index.php?/cases/view/29619 |
| FLT-URL-04 | A broken filter URL loads the page with no filters and no error | C29620 | https://shopview.testrail.io/index.php?/cases/view/29620 |
| FLT-MOB-01 | On a phone the toolbar splits into a tabs row, an action row and a chips row | C29621 | https://shopview.testrail.io/index.php?/cases/view/29621 |
| FLT-MOB-02 | On a phone each filter chip opens its own bottom sheet, not one combined drawer | C29622 | https://shopview.testrail.io/index.php?/cases/view/29622 |
| FLT-MOB-03 | On a phone, choices in a filter sheet apply only when you tap Apply filters | C29623 | https://shopview.testrail.io/index.php?/cases/view/29623 |
| FLT-MOB-04 | On a phone the same deferred-apply rule applies to every single filter sheet | C29624 | https://shopview.testrail.io/index.php?/cases/view/29624 |
| FLT-MOB-05 | On a phone, Assigned to me toggles on and off in the chips row with no sheet | C29625 | https://shopview.testrail.io/index.php?/cases/view/29625 |
| FLT-MOB-06 | On a phone a filter sheet appears over a dimmed page and closes on X or scrim | C29626 | https://shopview.testrail.io/index.php?/cases/view/29626 |
| FLT-MOB-07 | On a phone the Asset on Site sheet is a single-select list with a checkmark | C29627 | https://shopview.testrail.io/index.php?/cases/view/29627 |
| FLT-MOB-08 | On a phone active chips clear one at a time; there is no Clear filters button | C29628 | https://shopview.testrail.io/index.php?/cases/view/29628 |
| FLT-MOB-09 | Mobile has no collapse toggle: the filter chip row is always visible | C29629 | https://shopview.testrail.io/index.php?/cases/view/29629 |
| FLT-MOB-10 | Filters matching no work orders on mobile show the same empty state as desktop | C29630 | https://shopview.testrail.io/index.php?/cases/view/29630 |
| FLT-API-01 | The work order list request carries the active filter selections | C29631 | https://shopview.testrail.io/index.php?/cases/view/29631 |
| FLT-API-02 | A combined multi-filter request returns only work orders matching all filters | C29632 | https://shopview.testrail.io/index.php?/cases/view/29632 |
| FLT-API-03 | A request with a deleted or unknown filter value gives no server error | C29633 | https://shopview.testrail.io/index.php?/cases/view/29633 |
| FLT-API-04 | A list request with malformed filter parameters does not produce a server error | C29634 | https://shopview.testrail.io/index.php?/cases/view/29634 |
| FLT-API-05 | A filter combination matching nothing returns an empty list, not an error | C29635 | https://shopview.testrail.io/index.php?/cases/view/29635 |
| FLT-TAB-06 | First visit opens the Estimates tab; your last-used tab is remembered | C38876 | https://shopview.testrail.io/index.php?/cases/view/38876 |
| FLT-STAT-07 | Imported works alone: picking it greys out the other filters | C38877 | https://shopview.testrail.io/index.php?/cases/view/38877 |
| FLT-ASSET-07 | Choosing No shows only work orders whose asset is not on site | C38878 | https://shopview.testrail.io/index.php?/cases/view/38878 |
| FLT-URL-05 | Opening a shared link does not change your own saved filters | C38879 | https://shopview.testrail.io/index.php?/cases/view/38879 |
| FLT-PERS-05 | Each page and tab remembers its own filters separately | C38880 | https://shopview.testrail.io/index.php?/cases/view/38880 |
| FLT-PERS-06 | Filters saved before the redesign carry over after the update | C38881 | https://shopview.testrail.io/index.php?/cases/view/38881 |
| FLT-RPTS-23 | The date-range panel offers set periods and a custom start and end range | C38882 | https://shopview.testrail.io/index.php?/cases/view/38882 |
| FLT-PSRCH-01 | Page toolbar Search expands in place and narrows the list as you type | C38883 | https://shopview.testrail.io/index.php?/cases/view/38883 |
| FLT-PSRCH-02 | Page search combines with filters and is cleared separately | C38884 | https://shopview.testrail.io/index.php?/cases/view/38884 |
| FLT-PSRCH-03 | Your typed search stays in this browser tab only and is never saved | C38886 | https://shopview.testrail.io/index.php?/cases/view/38886 |
| FLT-PSRCH-04 | The search term is part of the shareable page link | C38888 | https://shopview.testrail.io/index.php?/cases/view/38888 |
| FLT-PSRCH-05 | On mobile the search expands in the toolbar and buttons make room | C38889 | https://shopview.testrail.io/index.php?/cases/view/38889 |
| FLT-PSRCH-06 | Every list page keeps its own search box (Parts, Reports, detail tabs) | C38891 | https://shopview.testrail.io/index.php?/cases/view/38891 |
| FLT-PSRCH-07 | The top navigation search no longer filters page lists | C38893 | https://shopview.testrail.io/index.php?/cases/view/38893 |
| FLT-API-06 | Saved-filters service round-trip: save, reload, and per-user isolation | C38895 | https://shopview.testrail.io/index.php?/cases/view/38895 |
| FLT-URL-06 | 'Back to my view' is not shown when you are on your own view | C38896 | https://shopview.testrail.io/index.php?/cases/view/38896 |
| FLT-EMPTY-03 | When filters and a search find nothing, each can be cleared on its own | C38897 | https://shopview.testrail.io/index.php?/cases/view/38897 |
| FLT-PSRCH-08 | The Search box changes look as you hover over it, open it and type | C38898 | https://shopview.testrail.io/index.php?/cases/view/38898 |
| FLT-PSRCH-09 | The list narrows shortly after you stop typing, with no button to press | C38899 | https://shopview.testrail.io/index.php?/cases/view/38899 |
| FLT-PSRCH-10 | One search box serves all Work Orders tabs and searches the tab you are on | C38900 | https://shopview.testrail.io/index.php?/cases/view/38900 |
| FLT-PSRCH-11 | Each Report tab and each Parts view keeps its own separate search | C38901 | https://shopview.testrail.io/index.php?/cases/view/38901 |
| FLT-PSRCH-12 | An old link carrying a top-search word no longer narrows the page list | C38902 | https://shopview.testrail.io/index.php?/cases/view/38902 |
| FLT-PSRCH-13 | Your typed search keeps working as you sort, page and leave and return | C38903 | https://shopview.testrail.io/index.php?/cases/view/38903 |
| FLT-PARTS-01 | Every Parts list page shows its designed filter buttons | C38904 | https://shopview.testrail.io/index.php?/cases/view/38904 |
| FLT-PARTS-09 | Part Type filter opens a Core / Non Core list with Clear Selection | C38905 | https://shopview.testrail.io/index.php?/cases/view/38905 |
| FLT-PARTS-11 | Choosing a Parts filter narrows the list on that page | C38906 | https://shopview.testrail.io/index.php?/cases/view/38906 |
| FLT-PARTS-12 | Parts filters allow several choices and are cleared one filter at a time | C38907 | https://shopview.testrail.io/index.php?/cases/view/38907 |
| FLT-PARTS-13 | Every filter a page had before is still available in the new filter bar | C38908 | https://shopview.testrail.io/index.php?/cases/view/38908 |
| FLT-RPTS-01 | Report filter bars appear on the reports this change covers | C38909 | https://shopview.testrail.io/index.php?/cases/view/38909 |
| FLT-RPTS-21 | Choosing a Reports filter narrows the report results | C38910 | https://shopview.testrail.io/index.php?/cases/view/38910 |
| FLT-RPTS-22 | New Reports filter types behave correctly (Location, Transaction Type, etc.) | C38911 | https://shopview.testrail.io/index.php?/cases/view/38911 |
| FLT-PERS-07 | When two devices set different filters, the last one saved wins | C43560 | https://shopview.testrail.io/index.php?/cases/view/43560 |
| FLT-PSRCH-14 | On a phone, pages with two or more icon buttons collapse them into one menu | C43561 | https://shopview.testrail.io/index.php?/cases/view/43561 |
| FLT-PARTS-14 | Parts and Reports filter chips share by link and work on a phone, no collapse | C43562 | https://shopview.testrail.io/index.php?/cases/view/43562 |
| FLT-MOB-11 | On a phone, picking Imported works alone and disables the other filters | C43563 | https://shopview.testrail.io/index.php?/cases/view/43563 |
| FLT-COLL-06 | No collapse control exists even on a page that has only one filter | C43590 | https://shopview.testrail.io/index.php?/cases/view/43590 |

---

## Provenance / gap check

**0 gaps** — every created and changed C-id resolved to an internal ID + current title in its project id-map. No C-id is marked "verify".
