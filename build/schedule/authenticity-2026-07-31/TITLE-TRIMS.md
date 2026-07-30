# Schedule — TITLE TRIMS (closing authenticity pass, 2026-07-31)

> Standing instruction: **TestRail case titles must display fully on the case page — keep to
> ≤ 80 characters**; the full detail belongs in Steps / Expected / Preconditions, never in a
> long title.

## Headline

| | Before | After |
|---|---|---|
| Active cases | 164 | 164 |
| Titles over 80 characters | **73** | **0** |
| Longest title | **139** chars (SCH-REAS-01) | **80** chars |
| Duplicate titles | 0 | **0** |
| Distinguishing detail lost | — | **0** (every dropped specific verified still present in Preconditions/Steps/Expected) |

*(The earlier "75 pending" figure was the count before the 2026-07-31 consolidation and
answers passes retired/reworded cases; re-derived live over the current 164, the backlog was
**73**.)*

## Method — no detail may be lost

For every trim, the significant words dropped from the title were diffed against that case's
own Preconditions + Steps + Expected. Anything not still covered there was reviewed by hand.
**Result: nothing needed to be moved** — in every case the detail was already asserted in the
body, which is exactly why the titles were over-long (they were duplicating the expected
results). One genuine finding fell out of the check:

- **SCH-SER-04 (C29990)** — the OLD title claimed "capacity, **overtime**, and conflicts
  operate on the individual shifts", but the case's Expected only asserts capacity, conflicts
  and the modal — **never overtime**. The trimmed title ("capacity and conflicts use the
  daily shifts") *fixes* a pre-existing TITLE-vs-EXPECTED over-claim rather than losing
  detail. Carried into the Phase-3 contradiction sweep.

## The 73 trims

| Case | TestRail | Before (chars) | After (chars) |
|---|---|---|---|
| SCH-REAS-01 | C30052 | Dragging a shift to another technician row reassigns it - target tech added to the line's roster, source removed, with a confirmation modal **(139)** | Dragging a shift to another technician row reassigns it, with a confirm modal **(77)** |
| SCH-CAP-03 | C30032 | The 'OT' text tag appears whenever any single technician exceeds their own daily hours - even when the day's aggregate is under capacity **(136)** | 'OT' text tag appears when one technician exceeds their own daily hours **(71)** |
| SCH-SPREAD-08 | C29984 | Preview is collapsed to a one-line summary, expandable to a week-by-week breakdown with skipped days struck through and their reasons **(133)** | Spread preview: one-line summary, expandable to a week-by-week breakdown **(72)** |
| SCH-PERM-08 | C30081 | Schedule access without Work Orders: View - sidebar hides the WO list and drill-down; mini calendar stays; grid shifts remain usable **(132)** | Schedule without Work Orders: View - the sidebar hides the work order list **(74)** |
| SCH-PERM-01 | C30074 | Schedule: View grants the full read experience - page, all three views, mini calendar, search, filter, tooltips, read-only modals **(129)** | Schedule: View grants the full read-only experience across the whole page **(73)** |
| SCH-TIP-01 | C30034 | Shift hover tooltip shows customer, unit/vehicle/VIN, date and time, technician, scope, up to 3 line names, and a progress bar **(126)** | Shift hover tooltip shows the full shift summary incl. up to 3 line names **(73)** |
| SCH-TOOL-02 | C30040 | Left/right arrows navigate by day, week, or month depending on the active range, and the date label shows the current range **(123)** | Left/right arrows step by day, week, or month to match the active range **(71)** |
| SCH-WOL-02 | C29937 | Work order card shows WO number, line count plus hours, customer, unit, lead technician, and a status-colored left border **(121)** | Work order card anatomy, incl. the status-colored left border **(61)** |
| SCH-EVT-06 | C30021 | Event cards are structurally distinct from shift cards - white outlined card with a grey icon chip, no colored left rail **(120)** | Event cards look structurally distinct from shift cards **(55)** |
| SCH-TOOL-03 | C30041 | Toolbar search fades non-matching blocks and highlights matching ones (customer, WO number, unit, technician, line name) **(120)** | Toolbar search highlights matching blocks and fades non-matching ones **(69)** |
| SCH-EDGE-06 | C30090 | Scheduled hours, the estimate, and actual (clocked) hours are three separate quantities that are not forced to reconcile **(120)** | Scheduled, estimated and actual clocked hours are three separate numbers **(72)** |
| SCH-BLOCK-02 | C29992 | Whole-order and multi-line-subset shifts both read 'N Lines' on the block - the detail modal spells out the exact scope **(119)** | Whole-order and multi-line shifts both read 'N Lines' on the block **(66)** |
| SCH-LINE-04 | C29951 | Each line row shows its title, estimated hours, technician roster (avatar stack plus count, no cap), and a drag handle **(118)** | Line row shows title, hours, the technician roster and a drag handle **(68)** |
| SCH-SPREAD-03 | C29979 | How-much selector defaults to Full estimate; Full estimate, 1 week, and 2 weeks apply immediately with no extra fields **(118)** | How-much selector defaults to Full estimate; preset amounts apply at once **(73)** |
| SCH-CAP-02 | C30031 | When aggregate hours exceed capacity, an amber spill extends past the track's right edge with a tick at the 100% line **(117)** | Over capacity, an amber spill extends past the track's right edge **(65)** |
| SCH-PERM-12 | C30614 | With Work Orders: View OFF, work-order-derived details on shifts (customer, lines, money fields) are hidden or masked **(117)** | With Work Orders: View OFF, work order details on shifts are hidden **(67)** |
| SCH-SER-04 | C29990 | A series is a grouping of ordinary daily shifts - capacity, overtime, and conflicts operate on the individual shifts **(116)** | A series is just a grouping - capacity and conflicts use the daily shifts **(73)** |
| SCH-TIP-04 | C30037 | Tooltips open after a short hover delay, dismiss on mouse-leave, and are read-only - clicking still opens the modal **(115)** | Tooltips open after a hover delay, dismiss on mouse-leave, are read-only **(72)** |
| SCH-PERM-11 | C30084 | Clocking into work order line tasks is gated by the staff record's 'Time Clock' setting, not the permission model **(113)** | Clocking into line tasks is gated by the staff 'Time Clock' setting **(67)** |
| SCH-LANE-03 | C29998 | Visible lanes cap at 3 - additional overlapping shifts collapse into a '+N more' affordance that opens a popover **(112)** | Visible lanes cap at 3; extra overlapping shifts collapse into '+N more' **(72)** |
| SCH-DEL-02 | C30058 | 'This shift only' removes that day, the series keeps the gap, and the hours return to the estimate's remaining **(110)** | 'This shift only' removes that day and the series keeps the gap **(63)** |
| SCH-NAV-06 | C29930 | There is no separate technician-only view or Tech/Dept toggle - department grouping is the only grid grouping **(109)** | No Tech/Dept toggle - department grouping is the only grid grouping **(67)** |
| SCH-DND-01 | C29955 | Dropping a single-line work order on a technician cell creates a shift immediately, skipping the scope picker **(109)** | Dropping a single-line work order creates a shift with no scope picker **(70)** |
| SCH-PERM-10 | C30083 | Grid rows are department-based: any staff member in a visible department appears as a row, regardless of role **(109)** | Grid rows are department-based, not role-based **(46)** |
| SCH-MODAL-01 | C30008 | Clicking a shift opens its detail modal showing customer, unit, VIN (always visible), and the work order id **(107)** | Clicking a shift opens its detail modal, with VIN always visible **(64)** |
| SCH-PERM-05 | C30078 | Edit without Delete: the user can create and modify but cannot remove - delete action and trash icon hidden **(107)** | Edit without Delete: the user can create and modify but not remove **(66)** |
| SCH-NAV-07 | C29931 | An Unassigned row sits within the grid (not a separate tray) and holds shifts not yet tied to a technician **(106)** | An Unassigned row sits inside the grid, not in a separate tray **(62)** |
| SCH-SCOPE-02 | C29964 | Choosing 'Schedule whole work order' assigns the technician to all lines and creates one whole-order shift **(106)** | 'Schedule whole work order' assigns all lines and creates one shift **(67)** |
| SCH-SPREAD-06 | C29982 | Start date defaults to the earliest working day and can be adjusted to make a second technician sequential **(106)** | Start date defaults to the earliest working day and can be changed **(66)** |
| SCH-TIP-05 | C30038 | The tooltip flips above the block or shifts horizontally to stay within the viewport - it is never clipped **(106)** | The tooltip flips or shifts to stay within the viewport - never clipped **(71)** |
| SCH-DEL-01 | C30057 | Deleting a middle shift of a series asks for scope with all three options, each stating the hours returned **(106)** | Deleting a middle shift of a series offers all three scope options **(66)** |
| SCH-NAV-04 | C29928 | Grid rows are grouped by department under group headers, with the department's technicians listed beneath **(105)** | Grid rows are grouped by department under group headers **(55)** |
| SCH-CAP-04 | C30033 | Hovering a capacity bar shows a per-technician breakdown, with overtime technicians highlighted in amber **(104)** | Hovering a capacity bar shows a per-technician breakdown **(56)** |
| SCH-TIP-03 | C30036 | Event hover tooltip shows the event name with its grey category dot, date and time range, and technician **(104)** | Event hover tooltip shows name, grey category dot, time range and tech **(70)** |
| SCH-START-07 | C29975 | Dragging an unassigned shift onto a technician row assigns it, and that technician's hours then apply **(101)** | Dragging an unassigned shift onto a technician row assigns it **(61)** |
| SCH-START-05 | C29973 | Dropping a work order or line onto the Unassigned row creates an unassigned shift with no technician **(100)** | Dropping onto the Unassigned row creates a shift with no technician **(67)** |
| SCH-MODAL-04 | C30011 | The modal shows a scope summary and the scheduled line(s) with number, title, hours, and status only **(100)** | The modal lists the scheduled line(s) with no money fields **(58)** |
| SCH-START-06 | C29974 | Unassigned shift start time skips the technician-hours rule and uses business hours or the default **(98)** | Unassigned shift start time uses business hours or the default **(62)** |
| SCH-SPREAD-10 | C29986 | Dropping the same work order on a second technician spreads the full estimate again, independently **(98)** | The same work order on a second technician spreads the full estimate again **(74)** |
| SCH-SER-03 | C29989 | Day view shows the series day as a single time-positioned block with a 'part of an M-week job' cue **(98)** | Day view shows the series day as one block with a multi-week cue **(64)** |
| SCH-DAY-03 | C30003 | Date and time headers stick to the top of the viewport during vertical scroll (day and week views) **(98)** | Date and time headers stick to the top during vertical scroll **(61)** |
| SCH-CONF-02 | C30024 | Working-day conflict: a shift on a day outside the technician's configured working days is flagged **(98)** | Working-day conflict: a shift outside the tech's working days is flagged **(72)** |
| SCH-MCAL-04 | C29935 | Mini calendar highlights the selected date, indicates today, and highlights the week row on hover **(97)** | Mini calendar highlights the selected date, today, and the hovered week **(71)** |
| SCH-SCOPE-03 | C29965 | Tapping an individual line row immediately creates a single-line shift with no confirmation step **(96)** | Tapping a line row creates a single-line shift with no confirm step **(67)** |
| SCH-VIEW-03 | C30044 | 'My Shifts' filters the grid to only the current user's shifts, hiding all other technician rows **(96)** | 'My Shifts' filters the grid to only the current user's shifts **(62)** |
| SCH-BLOCK-01 | C29991 | A single-line shift block shows three text lines: customer name, unit number, and the line name **(95)** | A single-line shift block shows customer, unit number and line name **(67)** |
| SCH-WOL-01 | C29936 | The sidebar shows a flat, scrollable list of work order cards with no Assigned/Unassigned tabs **(94)** | The sidebar is a flat list of work order cards with no tabs **(59)** |
| SCH-LINE-07 | C29954 | 'All / Unscheduled' filter chips with counts - Unscheduled shows only lines with no shifts yet **(94)** | 'All / Unscheduled' filter chips show counts and filter the line list **(69)** |
| SCH-CONF-01 | C30023 | Double-booked: two work orders overlapping on the same technician at the same time are flagged **(94)** | Double-booked: two overlapping work orders on one technician are flagged **(72)** |
| SCH-BLOCK-05 | C29995 | The conflict icon is the only icon on a shift block - no work order number and no scope icons **(93)** | The conflict icon is the only icon on a shift block **(51)** |
| SCH-DEL-05 | C30061 | Scope options adapt to position: first and last shifts of a series each show only two options **(93)** | Scope options adapt: the first and last shift each show only two **(64)** |
| SCH-EDGE-04 | C30088 | The grid renders smoothly at full load - 15 technicians × 7 days with several shifts per cell **(93)** | The grid renders smoothly at full load - 15 technicians over 7 days **(67)** |
| SCH-DND-04 | C29958 | A job exceeding the technician's daily hours opens the spread step after the scope is chosen **(92)** | A job over the technician's daily hours opens the spread step **(61)** |
| SCH-PERM-06 | C30079 | Schedule: Delete unlocks deleting shifts and events, including the three series-aware scopes **(92)** | Schedule: Delete unlocks deleting shifts and events **(51)** |
| SCH-DND-06 | C29960 | While dragging, drop-target cells highlight and a ghost block shows the line name and hours **(91)** | While dragging, target cells highlight and a ghost block follows **(64)** |
| SCH-DND-07 | C29961 | Scheduling a technician onto a line adds them to that line's labor roster on the work order **(91)** | Scheduling a technician onto a line adds them to its labor roster **(65)** |
| SCH-CONF-07 | C30029 | Red/alarming styling is reserved for conflicts and genuine errors - never used for overtime **(91)** | Red styling is only for conflicts and errors, never for overtime **(64)** |
| SCH-START-02 | C29970 | With no technician hours set, the shift start time falls back to the shop's business hours **(90)** | With no technician hours set, start time falls back to business hours **(69)** |
| SCH-CONF-05 | C30027 | The toolbar conflict pill shows the issue count and opens a dropdown listing the conflicts **(90)** | The toolbar conflict pill shows the count and opens a list **(58)** |
| SCH-PERM-09 | C30082 | No own-only restriction: every Schedule: View user sees ALL technicians' shifts and events **(90)** | No own-only restriction: a View user sees ALL technicians' shifts **(65)** |
| SCH-MCAL-02 | C29933 | Mini calendar month/year picker offers a grid of month buttons and year navigation arrows **(89)** | Mini calendar month/year picker has month buttons and year arrows **(65)** |
| SCH-DND-05 | C29959 | A scope that fits within one working day skips the spread step and creates a single shift **(89)** | A scope that fits one working day skips the spread step **(55)** |
| SCH-DEL-03 | C30059 | 'This and everything after' removes from the clicked shift onward, keeping earlier shifts **(89)** | 'This and everything after' removes from the clicked shift onward **(65)** |
| SCH-LINE-03 | C29950 | Only approved work order lines appear in the drill-down - unapproved lines are not shown **(88)** | Only approved work order lines appear in the drill-down **(55)** |
| SCH-EDGE-02 | C30086 | Below 960px the grid scrolls horizontally, and the sidebar collapses on narrow viewports **(88)** | Below 960px the grid scrolls sideways and the sidebar collapses **(63)** |
| SCH-NAV-05 | C29929 | Collapsing a department group header hides its technician rows; expanding restores them **(87)** | Collapsing a department header hides its technician rows **(56)** |
| SCH-PERM-07 | C30080 | The permission tiers depend on each other: Delete requires Edit, and Edit requires View **(87)** | Permission tiers nest: Delete requires Edit, Edit requires View **(63)** |
| SCH-START-01 | C29969 | A shift's start time uses the technician's configured working hours when they are set **(85)** | A shift's start time uses the technician's own working hours when set **(69)** |
| SCH-TIP-02 | C30035 | A conflicted shift's tooltip shows the conflict icon and the conflict reason in amber **(85)** | A conflicted shift's tooltip shows the icon and reason in amber **(63)** |
| SCH-DND-03 | C29957 | Dragging an individual line from the drill-down creates a single-line shift directly **(84)** | Dragging a line from the drill-down creates a single-line shift **(63)** |
| SCH-DAY-04 | C30004 | Dragging a shift horizontally moves its start time, snapping to 15-minute intervals **(83)** | Dragging a shift sideways moves its start time in 15-minute steps **(65)** |
| SCH-START-04 | C29972 | In day view, the start time comes from where the shift is dropped on the timeline **(81)** | In day view the start time comes from the drop position **(55)** |
| SCH-EVT-07 | C30022 | Events default to neutral/grey; choosing a color tints the card and its icon chip **(81)** | Events default to grey; choosing a color tints the card and chip **(64)** |

**73 trims. All ≤ 80. Longest remaining title = 80 characters.**
