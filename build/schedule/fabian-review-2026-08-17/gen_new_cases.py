#!/usr/bin/env python3
"""Author the 19 NEW Schedule cases for the Fabian design-review scope (SV-9231..SV-9244).
Build verification DEFERRED (Rule 69) -> marker = 'Not available on Build to test Yet'.
Provenance sentence 1 names documents only (epic + owning story + spec v30 + anchor), each with the
read-date 17 August 2026; sentence 2 (build) omitted. Emits cases-J-fabian-review-2026-08-17.json."""
import json, os

READ = "read on 17 August 2026"
MARKER = "AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026"

def prov(story, anchors):
    a = ",".join(anchors)
    return (f"This is the expected behaviour as per epic SV-8685, {READ}, "
            f"and story {story} and the Schedule specification version 30 ({a}), {READ}.")

def expected(items, story, anchors):
    body = "\n".join(items)
    return f"{body}\n\n---\n{prov(story, anchors)}\n\n{MARKER}\n"

def numbered(lines):
    return "\n".join(f"{i+1}. {l}" for i, l in enumerate(lines))

CASES = []
def C(cid, area, section_id, title, story, anchors, refs, pre, steps, exp, notes="",
      priority="High", ctype="Functional", perms="Schedule: View (spec §14.1); Schedule: Edit to create/change shifts.",
      api=False):
    assert len(title) <= 80, f"{cid} title {len(title)}"
    CASES.append({
        "id": cid, "area": area, "title": title, "priority": priority, "type": ctype,
        "permissions_required": perms,
        "preconditions": numbered(pre), "steps": numbered(steps),
        "expected": expected(exp, story, anchors),
        "design_ref": "Claude prototype (Branko Q0) build/schedule/design-2026-07-27/ — PARTIAL/undated; exact on-screen labels not pinned by spec/story text are marked VIU-confirm, never invented (Rule 9/12).",
        "spec_ref": f"requirements.md {','.join(anchors)} (spec v30); story {story}",
        "refs": refs, "viu_status": "VIU-Pending", "notes": notes, "api_related": api,
        "testrail_case_id": None, "section_id": section_id,
    })

# 1 · SV-9231 resolved working hours & app-level default -> SCH-START-09 (4262)
C("SCH-START-09","Shift Start Times and Unassigned Shifts",4262,
  "A day's hours resolve tech then shop then a 7am-7pm default used everywhere",
  "SV-9231",["§4.2","§8.1"],"SV-9231 (§4.2;§8.1)",
  ["You are signed in on a desktop browser and on the Schedule page.",
   "You can see technicians whose hours differ: one with custom working hours set, one whose department/shop has business hours set but no personal hours, and one with neither set.",
   "You have Schedule: Edit permission so you can drop a work order to size a shift."],
  ["For the technician WITH custom hours, note the window used when a shift is sized and drawn, and the business-hours shading on that row.",
   "For the technician with NO personal hours but a shop business-hours window, repeat.",
   "For the technician with NEITHER set, repeat, and note whether any out-of-hours conflict is raised.",
   "Compare the window used for shift sizing, the spread step, capacity, business-hours shading and day-view auto-scroll for each technician."],
  ["The technician's own configured hours are used when they are set.",
   "When personal hours are not set, the shop's business hours are used instead.",
   "When neither is set, a default window of 7:00 AM to 7:00 PM is used.",
   "Only the first level that is set is used - the levels are never merged.",
   "The same resolved window is used everywhere a day's length matters: sizing shifts on drop, the spread step, capacity, business-hours shading and day-view auto-scroll. No fixed daily hour count is used anywhere.",
   "For the technician on the 7am-7pm default only, a shift falling outside that window raises NO conflict (the default is only there so shifts can be sized and drawn, it is not a rule)."],
  notes="SV-9231 introduces the app-level default (7am-7pm) and the 'used everywhere' resolution model. Existing SCH-START-01/02/03 cover start-time fallback only; SCH-START-03 to be updated to name 7am-7pm.")

# 2 · SV-9232a sizing from remaining -> SCH-DND-10 (4260)
C("SCH-DND-10","Drag-and-Drop Scheduling",4260,
  "A shift is sized by remaining hours: estimate minus hours already clocked",
  "SV-9232",["§4.2","§12"],"SV-9232 (§4.2;§12)",
  ["You are signed in on a desktop browser and on the Schedule page with Schedule: Edit permission.",
   "In the sidebar you have a work order that has NOT been started (no clocked time) and a second work order that has some hours already clocked against its line(s)."],
  ["Drag the not-started work order onto a technician cell and note the length of the shift created.",
   "Drag the work order that already has clocked time onto a technician cell and note the length of the shift created.",
   "For a multi-line work order, open the scope picker, pick two lines and note the total length."],
  ["The not-started work order creates a shift the full length of its estimate (no clocked time means no remainder).",
   "The work order with clocked time creates a shift sized by its estimate MINUS the hours already clocked, measured at the moment the shift is created.",
   "For a chosen scope the remaining hours are worked out per line and added together.",
   "The same remaining-hours sizing applies to a direct drop, the scope picker and the spread step."],
  notes="New sizing model in SV-9232. Distinct from the older 'sized by estimate' assumption in SCH-DND-01/04.")

# 3 · SV-9232b min 0.25h / no later resize -> SCH-DND-11 (4260)
C("SCH-DND-11","Drag-and-Drop Scheduling",4260,
  "Below 0.25h left you are told nothing remains; shifts never resize later",
  "SV-9232",["§4.2","§12"],"SV-9232 (§4.2;§12)",
  ["You are signed in on a desktop browser with Schedule: Edit permission and are on the Schedule page.",
   "You have a work order with less than 0.25 hours (15 minutes) of estimate remaining after clocked time.",
   "You have a second work order already scheduled on two technicians, against which more time can be clocked afterwards."],
  ["Try to drop the work order that has under 0.25h remaining onto a technician cell.",
   "For the already-scheduled work order, have time clocked against it after the shifts were created, then re-open the two existing shifts and note their lengths.",
   "Schedule a THIRD technician on that same work order after the clocking and note the new shift's length."],
  ["When less than 0.25 hours remain, you are told there is nothing left to schedule rather than being given a zero-length shift (0.25h is the minimum schedulable remainder).",
   "The two shifts already on the board keep exactly the hours they were given - they are NOT resized when more hours are clocked later.",
   "The third technician scheduled afterwards is sized by what is left at that moment, not by the original estimate."],
  notes="SV-9232: minimum schedulable 0.25h; shifts frozen at creation-time state.")

# 4 · SV-9233 one hours source -> SCH-CONF-08 (4270)
C("SCH-CONF-08","Conflict Detection",4270,
  "One hours source per shift; neither set means no hours conflict; Adjust clamps",
  "SV-9233",["§4.2","§4.11"],"SV-9233 (§4.2;§4.11)",
  ["You are signed in on a desktop browser and on the Schedule page.",
   "You have three technicians: one with personal working hours set, one with only shop business hours, and one with neither set.",
   "Each has a shift that falls partly outside its hours."],
  ["For the technician with personal hours, place a shift outside those hours and count how many hours conflicts are raised.",
   "For the technician with only shop business hours, do the same.",
   "For the technician with neither set, place an out-of-hours shift and check whether any hours conflict is raised.",
   "Open a raised hours conflict and use its 'Adjust' action."],
  ["Exactly ONE hours source is checked per shift: the technician's hours when they are set, otherwise the shop's business hours - the two are never checked together.",
   "An out-of-hours shift therefore raises exactly one hours conflict, not two.",
   "When neither personal nor shop hours are set, no hours conflict is raised at all.",
   "'Adjust' clamps the shift to the same resolved window that raised the conflict.",
   "The conflict type list (Double-booked, Weekend shift, Before hours, After hours) is unchanged."],
  notes="SV-9233. Update SCH-CONF-02/03 to single-source evaluation.")

# 5 · SV-9234a unassigned drop -> SCH-UNAS-01 (4262)
C("SCH-UNAS-01","Shift Start Times and Unassigned Shifts",4262,
  "Dropping a work order on a department header row parks it as one shift",
  "SV-9234",["§3.2","§4.2","§4.4","§8.1"],"SV-9234 (§3.2;§4.2;§4.4;§8.1)",
  ["You are signed in on a desktop browser with Schedule: Edit permission and are on the Schedule page.",
   "The grid shows at least one department group header row.",
   "You have a multi-line work order in the sidebar."],
  ["Drag the whole work order onto a department group header row and drop it.",
   "Note the shift that is created and its scope.",
   "Check whether the spread step (multi-day) opens.",
   "Open the created shift and check the technician and labor roster."],
  ["The department group header row acts as that department's unassigned lane (one row, not a separate second row).",
   "Dropping the work order creates a single unassigned shift covering the whole scope.",
   "The spread step does NOT run - with no technician there are no working hours to spread across.",
   "The shift is sized by remaining hours on the same rules as any other shift.",
   "The date you dropped it on is recorded as the shift's target start date.",
   "No technician is set and no labor roster is touched."],
  notes="SV-9234. Update SCH-NAV-07 to state the dept header row is the unassigned lane.")

# 6 · SV-9234b unassigned chip + exclusion -> SCH-UNAS-02 (4262)
C("SCH-UNAS-02","Shift Start Times and Unassigned Shifts",4262,
  "An unassigned block is a fixed-width chip, excluded from capacity and conflicts",
  "SV-9234",["§3.2","§4.2","§4.4","§8.1"],"SV-9234 (§3.2;§4.2;§4.4;§8.1)",
  ["You are signed in on a desktop browser and on the Schedule page.",
   "At least one unassigned shift exists on a department header row.",
   "Enough unassigned shifts exist on one department/day to exceed three overlapping blocks."],
  ["Look at an unassigned block in Day, Week and Month views and note its width.",
   "Note the hours shown on the chip.",
   "Add unassigned blocks until more than three overlap on the same lane and note how they stack.",
   "Check the department's capacity bar and whether any double-booking or hours conflict is raised for the unassigned shifts."],
  ["The unassigned block renders as a fixed-width chip carrying its hours - it is NOT scaled to its duration - in Day, Week and Month views.",
   "Unassigned chips stack under the same 3-lane cap and '+N more' overflow as ordinary blocks.",
   "Unassigned shifts are excluded from capacity - they never fill the capacity bar.",
   "Unassigned shifts raise neither double-booking nor hours conflicts."],
  notes="SV-9234 chip rendering + capacity/conflict exclusion.")

# 7 · SV-9235 assign parked -> SCH-UNAS-03 (4262)
C("SCH-UNAS-03","Shift Start Times and Unassigned Shifts",4262,
  "Assigning a parked shift to a technician, spreading it if it will not fit",
  "SV-9235",["§4.2","§12"],"SV-9235 (§4.2;§12)",
  ["You are signed in on a desktop browser with Schedule: Edit permission and are on the Schedule page.",
   "One unassigned (parked) shift has remaining hours that FIT within a technician's resolved day.",
   "A second parked shift has remaining hours that do NOT fit within a technician's resolved day."],
  ["Drag the parked shift that fits onto a technician row and note what is created.",
   "Drag the parked shift that does not fit onto a technician row and note what opens.",
   "In the spread step that opens, check the start date.",
   "After assigning, open the scheduled line(s) and check the labor roster and the capacity bar; note how the chip now renders."],
  ["Dragging an unassigned shift onto a technician runs the same path as a fresh drop from the sidebar.",
   "When the remaining hours fit within that technician's resolved day, a single shift is created.",
   "When they do not fit, the spread step opens with its start date pre-filled from the shift's recorded target date.",
   "The technician is added to the labor roster of the scheduled lines.",
   "The shift begins counting toward capacity and the chip is replaced by normal shift rendering."],
  notes="SV-9235. Supersedes the thin SCH-START-07.")

# 8 · SV-9236 spread options + Today only -> SCH-SPREAD-12 (4263)
C("SCH-SPREAD-12","Multi-Day Spread Scheduling",4263,
  "Spread selector: six options with resolved hours, and a new Today only",
  "SV-9236",["§4.5"],"SV-9236 (§4.5)",
  ["You are signed in on a desktop browser with Schedule: Edit permission and are on the Schedule page.",
   "You know a technician's resolved daily hours (for example an eight-hour day).",
   "You have a 12-hour scope and a 160-hour scope to spread on that technician."],
  ["Open the spread step for the 12-hour scope on the eight-hour-day technician and read the option list.",
   "Read the hours shown in each fixed option's label.",
   "Note which options are offered for the 12-hour scope.",
   "Repeat for the 160-hour scope and note which options are offered."],
  ["The selector offers six options: Full estimate, Today only, 1 week, 2 weeks, Until a date..., Specific hours... ('Today only' is new).",
   "Each fixed option shows its resolved hours in the label; 'Full estimate' is the default and resolves to the scope's remaining hours (its label text stays 'Full estimate').",
   "Today only, 1 week and 2 weeks are offered ONLY when that span's capacity is less than the scope's hours - a span that would schedule the whole scope anyway is hidden.",
   "On an eight-hour day the 12-hour scope offers 'Today only' but neither week span; the 160-hour scope offers all three.",
   "'Until a date...' and 'Specific hours...' are always available."],
  notes="SV-9236. Update SCH-SPREAD-03 for the new option set + Full-estimate default.")

# 9 · SV-9237a single-day scope Hours field -> SCH-SPREAD-13 (4263)
C("SCH-SPREAD-13","Multi-Day Spread Scheduling",4263,
  "When the scope fits one day the spread hides the selector for an Hours field",
  "SV-9237",["§4.5"],"SV-9237 (§4.5)",
  ["You are signed in on a desktop browser with Schedule: Edit permission and are on the Schedule page.",
   "You have a scope whose remaining hours fit within one of the technician's resolved days."],
  ["Open the spread step for the single-day scope on that technician.",
   "Note whether the how-much selector is shown.",
   "Note the Hours field and its starting value, and step it up and down.",
   "Reduce the Hours field below the remaining hours and read the message; confirm and note what is created.",
   "If a selection inside the modal drops the scope to one day or less, note whether a series or a single shift is created."],
  ["When the scope fits one resolved day, the how-much selector is NOT shown at all.",
   "The only control is an editable Hours field, pre-filled with the remaining hours, stepping in 0.25-hour increments.",
   "Reducing it schedules part of the scope and shows '{N}h left to schedule'.",
   "Confirming creates a single shift of that length.",
   "If a selection made inside the modal drops the scope to one day or less, the modal creates an ordinary shift rather than a series."],
  notes="SV-9237 single-day path.")

# 10 · SV-9237b derived fields + summary -> SCH-SPREAD-14 (4263)
C("SCH-SPREAD-14","Multi-Day Spread Scheduling",4263,
  "Spread: Until a date and Specific hours derive each other; summary label",
  "SV-9237",["§4.5"],"SV-9237 (§4.5)",
  ["You are signed in on a desktop browser with Schedule: Edit permission and are on the Schedule page.",
   "You have a multi-day scope open in the spread step on a technician with known resolved daily hours."],
  ["Choose 'Until a date...', set a finish-by date, and note the hours value.",
   "Switch to 'Specific hours...' and note whether the value carried across; step the hours and watch the date.",
   "Read the header of the spread modal.",
   "Read the two-line summary block, then expand it.",
   "Read the confirm button label for a spread that makes several shifts."],
  ["'Until a date...' and 'Specific hours...' are two expressions of the same spread: setting a date derives the hours and setting the hours derives the date, carrying the value across when switching.",
   "'Specific hours...' steps by the technician's resolved daily hours.",
   "The header shows the work order and the technician's name only.",
   "The summary block is two lines - '{N} shifts / {total}h' over '{start} to {end} / Mon-Fri, per tech hours' - collapsed by default, expanding to a week-by-week breakdown with each day's hours.",
   "The confirm button reads 'Create {N} shifts'."],
  notes="SV-9237 derived fields + summary/confirm. Update SCH-SPREAD-04/05/08.")

# 11 · SV-9238 weekends only + series undo -> SCH-SPREAD-15 (4263)
C("SCH-SPREAD-15","Multi-Day Spread Scheduling",4263,
  "Spread skips weekends only; Undo removes the whole generated series",
  "SV-9238",["§4.5","§7","§12"],"SV-9238 (§4.5;§7;§12)",
  ["You are signed in on a desktop browser with Schedule: Edit permission and are on the Schedule page.",
   "You have a multi-day scope that spans weekends, a shop closure day, and a day the technician is already booked.",
   "You know the shop's closure/holiday configuration."],
  ["Run the spread and read the preview: note which days receive a shift and which are skipped.",
   "Confirm the spread and read the toast; hover it and then move the mouse away.",
   "Use the toast's Undo and check what is removed.",
   "Recreate the series; after the toast expires, delete the series using the normal delete flow."],
  ["The generator places day-sized blocks on consecutive days, skipping weekends unconditionally.",
   "Nothing else is skipped - shop closures, public holidays, and days the technician is already booked all receive shifts.",
   "Weekends are the only skip reason shown in the preview.",
   "Confirming produces a toast with an Undo that removes the ENTIRE generated series, not just the last shift.",
   "The toast lasts 4 to 7 seconds, persists while hovered, and dismisses on mouse-leave.",
   "After it expires, removing the series uses the existing series-aware delete flow."],
  notes="SV-9238. Reconcile with SCH-SPREAD-07 (weekends-only) and SCH-EDGE-05 (closures not skipped).")

# 12 · SV-9239a card vehicle + clocked -> SCH-WOL-07 (4257)
C("SCH-WOL-07","Sidebar - Work Order List and Search",4257,
  "Work order card shows the vehicle and clocked hours; vehicle joins the search",
  "SV-9239",["§3.1","§6","§8.1"],"SV-9239 (§3.1;§6;§8.1)",
  ["You are signed in on a desktop browser and on the Schedule page.",
   "The sidebar lists work orders, at least one of which has a vehicle and some clocked time.",
   "You can also see the grid toolbar search box."],
  ["Read a sidebar work order card: note the vehicle, customer, unit number, estimate and clocked hours.",
   "Open the card's line drill-down and read a line row's hours.",
   "Type part of a vehicle (year, make or model) into the sidebar search and note the results.",
   "Type the same vehicle text into the grid toolbar search and note the results."],
  ["The card shows the vehicle as year, make and model (for example '2021 Freightliner Cascadia') in addition to customer and unit number.",
   "The card shows clocked hours rolled up for the order alongside the existing estimate.",
   "Line rows in the drill-down show estimated and clocked hours.",
   "The rest of the card anatomy is unchanged.",
   "Vehicle text matches in the sidebar search fields and in the grid toolbar search fields."],
  notes="SV-9239. Update SCH-WOL-02 (card anatomy) and SCH-WOL-04 (search fields).")

# 13 · SV-9239b peek popover -> SCH-WOL-08 (4257)
C("SCH-WOL-08","Sidebar - Work Order List and Search",4257,
  "Hovering a work order card opens a read-only peek panel of its lines",
  "SV-9239",["§3.1","§6","§8.1"],"SV-9239 (§3.1;§6;§8.1)",
  ["You are signed in on a desktop browser and on the Schedule page.",
   "The sidebar has a work order with several lines, at least one with clocked time, and a lead technician.",
   "That work order has more lines than the peek panel will show at once."],
  ["Hover the work order card and wait for the peek panel to open.",
   "Read the panel: line statuses, each line's estimated and clocked hours, the lead technician, and the overflow row.",
   "Move the mouse away and confirm the panel dismisses.",
   "Click the card (do not just hover) and confirm the line drill-down opens.",
   "Start dragging the card onto the grid and confirm the peek does not get in the way."],
  ["Hovering the card opens a read-only peek panel showing the order's lines with their status, each line's estimated and clocked hours, and the lead technician.",
   "A long list is truncated with a '+N more' row.",
   "The panel opens after the same hover delay as the grid tooltips and dismisses on mouse-leave.",
   "Clicking the card still opens the line drill-down.",
   "The peek does not interfere with dragging the card onto the grid."],
  notes="SV-9239 peek popover (new).")

# 14 · SV-9240a per-line Time Logged -> SCH-MODAL-09 (4268)
C("SCH-MODAL-09","Shift Detail Modal",4268,
  "Shift modal shows Time Logged (actual vs estimate) per line, not only rolled up",
  "SV-9240",["§4.9"],"SV-9240 (§4.9)",
  ["You are signed in on a desktop browser and on the Schedule page.",
   "A scheduled shift covers more than one line: at least one line has clocked time and at least one has none."],
  ["Open the shift's detail modal.",
   "For each scheduled line read the Time Logged pair.",
   "Note the line that has nothing clocked."],
  ["Each scheduled line shows a Time Logged pair - actual against estimate - per line, not only rolled up for the shift.",
   "A line with nothing clocked shows zero actual against its estimate rather than hiding the pair."],
  notes="SV-9240. Update SCH-MODAL-03 (per-line, not only rolled-up).")

# 15 · SV-9240b typed entry -> SCH-MODAL-10 (4268)
C("SCH-MODAL-10","Shift Detail Modal",4268,
  "Shift modal: start, end and hours typed to the minute resolve each other",
  "SV-9240",["§4.9"],"SV-9240 (§4.9)",
  ["You are signed in on a desktop browser with Schedule: Edit permission and are on the Schedule page.",
   "A scheduled shift is open in its detail modal."],
  ["Type a start time to the minute (for example 9:07) into the start field and press Tab / click away.",
   "Type an end time and note the hours field.",
   "Type an hours value and note the end time.",
   "Use the 15-minute dropdown and check the typed fields stay in sync.",
   "Type an unparseable value into a field and click away."],
  ["Start time, end time and hours can each be typed directly, to the minute.",
   "The 15-minute dropdown remains available as a shortcut and stays in sync with typed values.",
   "Typed values are parsed and normalized on blur (when you leave the field).",
   "Editing any two of start, end and hours resolves the third.",
   "An unparseable entry reverts to the previous value."],
  notes="SV-9240 typed time entry. Update SCH-MODAL-02 (pickers + typed).")

# 16 · SV-9241 capacity detail modal -> SCH-CAP-05 (4271)
C("SCH-CAP-05","Capacity Bars",4271,
  "Clicking a capacity bar opens a per-technician detail modal; tooltip truncates",
  "SV-9241",["§4.12"],"SV-9241 (§4.12)",
  ["You are signed in on a desktop browser and on the Schedule page.",
   "A day has several technicians scheduled, at least one over capacity (overtime).",
   "That day also has at least one unassigned shift."],
  ["Hover the day's capacity bar and read the tooltip, noting the overflow row.",
   "Use the tooltip's 'click to view all' row, or click the capacity bar.",
   "Read the modal: each technician's assigned hours against their capacity, and the overtime highlight.",
   "Check whether the unassigned shift affects the bar fill or the overtime tag, and what denominator each technician's capacity uses."],
  ["Clicking a day's capacity bar opens a modal listing every technician for that day with assigned hours against their capacity, overtime highlighted.",
   "The hover tooltip is truncated to a short list with a '+N more / click to view all' row that opens the same modal.",
   "Capacity denominators use each technician's resolved working hours for that day.",
   "Unassigned shifts are excluded from both sides of the calculation - they never fill the bar and never raise the overtime tag."],
  notes="SV-9241. Update SCH-CAP-04 (tooltip truncation + click).")

# 17 · SV-9242 assign work order modal -> SCH-REAS-08 (4275)
C("SCH-REAS-08","Reassignment and Context Menu",4275,
  "The empty-cell menu's first item Assign work order schedules an existing order",
  "SV-9242",["§7","§4.10","§14.1"],"SV-9242 (§7;§4.10;§14.1)",
  ["You are signed in on a desktop browser with Schedule: Edit permission and are on the Schedule page.",
   "You have an existing work order in the sidebar that is not yet scheduled."],
  ["Left-click an empty grid cell for a technician on a given day and read the menu.",
   "Choose 'Assign work order' (the first item).",
   "In the modal, note the pre-filled technician and day, then pick the work order and the lines to schedule.",
   "Confirm and note what is created; try a scope that exceeds the technician's day."],
  ["The left-click menu on empty grid space has a third item, 'Assign work order', listed FIRST above 'Create event' and 'New work order'.",
   "Selecting it opens a modal with the technician and day pre-filled from the clicked cell.",
   "You pick the work order and the lines to schedule, following the same rules as the scope picker.",
   "Confirming creates the same shift or series a drag would have created, sized by remaining hours.",
   "When the scope exceeds the technician's day the spread step opens.",
   "This is the same capability as the old 'Add Existing Work Order' button (SV-8916), re-specified as a menu item."],
  notes="SV-9242. Supersedes SV-8916. Update SCH-REAS-03 (three menu items, Assign work order first).")

# 18 · SV-9244a day-view zoom -> SCH-DAY-08 (4267)
C("SCH-DAY-08","Day View Timeline",4267,
  "Day view has a zoom control (pixels per hour); blocks and now line rescale",
  "SV-9244",["§3.2","§4.6","§4.8","§6"],"SV-9244 (§3.2;§4.6;§4.8;§6)",
  ["You are signed in on a desktop browser and on the Schedule page in Day view.",
   "The day has several shifts, some overlapping (lane stacking), and it is today so the now line shows."],
  ["Find the zoom control in the grid toolbar and increase the pixels-per-hour zoom.",
   "Watch the blocks, the lane stacking and the now line as you zoom in and out.",
   "Zoom to the extremes and note the limits.",
   "Navigate to another day and back and note the zoom level.",
   "Confirm the day view is a horizontal timeline (there is no vertical column layout)."],
  ["Day view supports a pixels-per-hour zoom control in the grid toolbar.",
   "It is clamped between the resolved working window and the full 24-hour axis.",
   "Blocks, lane stacking and the now line rescale with the zoom.",
   "The zoom level holds while navigating between days.",
   "Day view is a horizontal timeline only - there is no vertical column layout."],
  notes="SV-9244 zoom (new).")

# 19 · SV-9244b continuation chevrons -> SCH-DAY-09 (4267)
C("SCH-DAY-09","Day View Timeline",4267,
  "A block clipped by the visible day-view edge shows a continuation chevron",
  "SV-9244",["§3.2","§4.6","§4.8","§6"],"SV-9244 (§3.2;§4.6;§4.8;§6)",
  ["You are signed in on a desktop browser and on the Schedule page in Day view.",
   "A shift extends past the left edge, a shift extends past the right edge, and a shift extends past both, of the currently visible time range."],
  ["Scroll or zoom so that a block is clipped by the left edge of the visible range and look at that edge.",
   "Do the same for a block clipped by the right edge.",
   "Do the same for a block clipped by both edges.",
   "Confirm this is not limited to week-view series banners."],
  ["Any block clipped by the edge of the visible range shows a continuation chevron on the clipped edge.",
   "The chevron appears on the leading edge, the trailing edge, or both, according to which edge clips the block.",
   "This applies to ordinary day-view blocks, not only week-view series banners."],
  notes="SV-9244 continuation chevrons (new).")

if __name__ == "__main__":
    out = os.path.join(os.path.dirname(__file__), "..", "cases", "cases-J-fabian-review-2026-08-17.json")
    out = os.path.normpath(out)
    json.dump(CASES, open(out, "w"), indent=1, ensure_ascii=False)
    print("wrote", len(CASES), "cases ->", out)
    # sanity: unique ids, titles <=80, marker present, one provenance line
    ids=set()
    for c in CASES:
        assert c["id"] not in ids, c["id"]; ids.add(c["id"])
        assert len(c["title"])<=80
        assert c["expected"].count("This is the expected behaviour")==1
        assert c["expected"].rstrip().endswith("Last checked 8/17/2026")
        assert "AUTOMATION: READY" not in c["expected"]
    print("sanity OK:", len(ids), "unique ids, all titles<=80, one prov line each, no READY marker")
