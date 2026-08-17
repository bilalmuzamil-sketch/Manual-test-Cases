# -*- coding: utf-8 -*-
"""v30-alignment UPDATE plan for existing Schedule cases (Fabian-review pass, 2026-08-17).

Each entry: cid, iid, and the intended NEW values. A value of None means "keep the live
value" (the driver pulls it from the pre-write snapshot and re-sends it verbatim, satisfying
core §2.1 — all three text fields on every update_case).

`body` is the numbered EXPECTED body only (no separator/provenance/marker); the driver
appends:  body + "\n\n---\n" + prov + "\n\n" + MARKER + "\n"
When body is None the driver reuses the live body (everything before the first "\n\n---").

Rule 69 marker on every touched case (build verification deferred this pass).
Provenance: sentence 1 only (documents), read-dated 17 August 2026; NO sentence 2 (build).
"""

MARKER = "AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026"


def prov(stories, anchors):
    return (
        "This is the expected behaviour as per epic SV-8685, read on 17 August 2026, "
        f"and {stories} and the Schedule specification version 30 ({anchors}), "
        "read on 17 August 2026."
    )


PLAN = {}

# ---- §4.1/§4.2 remaining-hours sizing (SV-9232) --------------------------------------
PLAN["SCH-DND-01"] = dict(cid=29955,
    title=None,
    pre="1. You are signed in on a desktop browser with Schedule: Edit.\n"
        "2. A ZZAUTOTEST work order exists with exactly ONE approved line, not yet started (no hours clocked), whose remaining hours therefore equal its full estimate and fit within one working day of the target technician.\n"
        "3. You are on the Schedule page in week view.",
    steps=None,
    body="1. A shift is created immediately in that cell - no scope picker and no spread step appears.\n"
         "2. The shift is sized by the line's remaining hours (its estimate minus any hours already clocked); for a work order that has not been started this equals the full estimate, which fits within one working day.\n"
         "3. The shift block shows the customer name, unit number, and the line's name.\n"
         "4. The technician is added to that line's labor roster on the work order.\n"
         "5. A toast with an Undo option appears.",
    refs="SV-8688; SV-9232 (§4.1 single-line work order; §4.2 shift sized by remaining hours; §1.2 roster sync; §7 toast)",
    prov=prov("stories SV-8688 and SV-9232 (shift sized by remaining hours)", "§4.1, §4.2, §1.2, §7"))

PLAN["SCH-DND-04"] = dict(cid=29958,
    title=None,
    pre="1. You are signed in on a desktop browser with Schedule: Edit.\n"
        "2. A ZZAUTOTEST work order exists whose chosen scope's REMAINING hours (estimate minus any hours already clocked) EXCEED one working day of the target technician (for example a 40h line for a tech with 8h days).\n"
        "3. You are on the Schedule page in week view.",
    steps=None,
    body="1. The spread step opens (step 2 of the same modal) because the scope's remaining hours exceed one of the technician's working days.\n"
         "2. Its header shows the work order and the technician's name and a 'Change scope' back-link.\n"
         "3. No shifts exist yet until the spread is confirmed.",
    refs="SV-8688; SV-9232 (§4.1 large job; §4.2 remaining hours; §4.5 spread)",
    prov=prov("stories SV-8688 and SV-9232 (spread opens when remaining hours exceed a working day)", "§4.1, §4.2, §4.5"))

# ---- §4.2 app-level default (SV-9231) ------------------------------------------------
PLAN["SCH-START-03"] = dict(cid=29971,
    title=None, pre=None, steps=None,
    body="1. The shift starts at 7:00 AM - the app-level default working day of 7:00 AM to 7:00 PM applies because neither the technician's hours nor the shop's business hours are set.\n"
         "2. This default only sizes and draws the shift; it is not a rule, so a shift placed outside 7:00 AM to 7:00 PM while nothing is configured raises no conflict.",
    refs="SV-8688; SV-9231 (§4.2 resolved working hours; app-level default 7:00 AM to 7:00 PM is not a rule)",
    prov=prov("stories SV-8688 and SV-9231 (app-level default 7:00 AM to 7:00 PM, not a rule)", "§4.2"))

# ---- §3.2/§4.2 assign a parked shift (SV-9234/9235) ----------------------------------
PLAN["SCH-START-07"] = dict(cid=29975,
    title="Dragging an unassigned shift onto a technician assigns and re-sizes it",
    pre="1. You are signed in on a desktop browser with Schedule: Edit.\n"
        "2. An unassigned shift exists in a department's unassigned lane (the department header row) - for example by dropping a work order onto that header row.\n"
        "3. The target technician has configured working hours.\n"
        "4. You are on the Schedule page in week view.",
    steps="1. Drag the unassigned chip from the department header row down onto a technician in that department.\n"
          "2. Check the shift, the technician's roster, and whether it stayed one shift or became a series.",
    body="1. The shift is assigned to that technician - it leaves the department's unassigned lane and now sits in the technician's row, rendered as a normal shift block rather than a fixed-width chip.\n"
         "2. Its remaining hours are re-evaluated against the target technician's resolved working day: if they fit, a single shift is created; if they do not, the spread step opens with its start date pre-filled from the date the chip was originally dropped on.\n"
         "3. The technician is added to the labor roster of the scheduled lines.\n"
         "4. The shift now counts toward that technician's capacity.",
    refs="SV-9234; SV-9235 (§3.2 unassigned lane; §4.2 assigning a parked shift re-evaluates remaining hours)",
    prov=prov("stories SV-9234 and SV-9235 (assigning a parked unassigned shift)", "§3.2, §4.2"))

# ---- §4.5 spread: six options (SV-9236) ----------------------------------------------
PLAN["SCH-SPREAD-03"] = dict(cid=29979,
    title=None,
    pre=None,
    steps="1. Read the 'how much to schedule' selector's default value.\n"
          "2. Open the selector and read its options and the hours shown on each.\n"
          "3. Pick 'Today only', then '1 week', then '2 weeks', then back to 'Full estimate', watching for extra fields.",
    body="1. The selector defaults to 'Full estimate', which resolves to the scope's remaining hours.\n"
         "2. The options are: 'Full estimate', 'Today only', '1 week', '2 weeks', 'Until a date…', and 'Specific hours…'. Each fixed option shows its resolved hours in its label.\n"
         "3. 'Today only', '1 week', and '2 weeks' are offered ONLY when that span's capacity is less than the scope's hours (a span that would schedule the whole scope anyway is hidden); 'Until a date…' and 'Specific hours…' are always available.\n"
         "4. 'Full estimate', 'Today only', '1 week', and '2 weeks' apply on selection with no extra fields - the modal stays to one line for these.\n"
         "5. The preview summary updates to match each selection.",
    refs="SV-8691; SV-9236 (§4.5 six-option selector incl. Today only; fixed spans shown only when they constrain the scope)",
    prov=prov("stories SV-8691 and SV-9236 (six-option spread selector including Today only)", "§4.5"))

# ---- §4.5 derive fields (SV-9237) ----------------------------------------------------
PLAN["SCH-SPREAD-04"] = dict(cid=29980,
    title=None, pre=None, steps=None,
    body="1. Choosing 'Until a date…' reveals a single 'Finish by' date field (this is the only custom control shown).\n"
         "2. Picking a date updates the preview so the series ends by that date.\n"
         "3. 'Until a date…' and 'Specific hours…' derive each other: setting a finish-by date derives the hours to schedule, and setting the hours (in the other option) derives the matching finish-by date, so the value carries across if you switch between them.",
    refs="SV-8691; SV-9237 (§4.5 Until a date and Specific hours derive each other)",
    prov=prov("stories SV-8691 and SV-9237 (Until a date and Specific hours derive each other)", "§4.5"))

PLAN["SCH-SPREAD-05"] = dict(cid=29981,
    title=None, pre=None, steps=None,
    body="1. Choosing 'Specific hours…' reveals an hours stepper control that steps by the technician's resolved daily hours.\n"
         "2. The preview updates to spread exactly the entered hours across working days.\n"
         "3. 'Specific hours…' and 'Until a date…' derive each other: setting the hours derives the matching finish-by date, and the value carries across if you switch between the two options.",
    refs="SV-8691; SV-9237 (§4.5 Specific hours steps by resolved daily hours; derives Until a date)",
    prov=prov("stories SV-8691 and SV-9237 (Specific hours stepper by resolved daily hours)", "§4.5"))

# ---- §4.5/§12 weekends-only skip (SV-9238) - contradiction resolved by v30 -----------
PLAN["SCH-SPREAD-07"] = dict(cid=29983,
    title="Spread sizes shifts to the tech's hours and skips weekends only",
    pre="1. You are signed in on a desktop browser with Schedule: Edit.\n"
        "2. The technician has known daily working hours (for example 8h/day, Monday to Friday).\n"
        "3. A shop closure day and a public holiday fall inside the planned spread window (set them up if the environment allows).\n"
        "4. A scope of known size exists (for example 40h).",
    steps="1. Spread the 40h scope for that technician with 'Full estimate' starting on a Monday.\n"
          "2. Confirm and inspect the created shifts on the grid.",
    body="1. Daily shifts are sized to the technician's own resolved working hours (8h each in the example).\n"
         "2. Weekends are skipped - Saturday and Sunday receive no shifts.\n"
         "3. Shop closures, public holidays, and days the technician is already booked are NOT skipped - they all receive shifts. Weekends are the only skip reason.\n"
         "4. The end date is the result of the daily distribution (for 40h at 8h/day starting Monday, the series ends on the fifth working day).",
    refs="SV-8691; SV-9238 (§4.5 and §12 spread skips weekends only; closures/holidays/booked days receive shifts)",
    prov=prov("stories SV-8691 and SV-9238 (spread skips weekends only; nothing else skipped)", "§4.5, §12"))

# ---- §4.5 preview summary (SV-9237) --------------------------------------------------
PLAN["SCH-SPREAD-08"] = dict(cid=29984,
    title="Spread preview: '{N} shifts / {total}h' summary, expandable week-by-week",
    pre=None, steps=None,
    body="1. Collapsed: a two-line summary reading '{N} shifts · {total}h' over '{start} to {end} · Mon-Fri, per tech hours'.\n"
         "2. Expanded: a week-by-week breakdown of the planned shifts, showing each day's hours.\n"
         "3. Weekend days are shown struck through in the breakdown (weekends are the only skip reason); shop closures and public holidays are not skipped and appear as ordinary scheduled days.\n"
         "4. Confirming creates the series, and the confirm button carries the count, for example 'Create 13 shifts'.",
    refs="SV-8691; SV-9237 (§4.5 preview summary '{N} shifts / {total}h'; confirm 'Create {N} shifts')",
    prov=prov("stories SV-8691 and SV-9237 (spread preview summary and confirm label)", "§4.5"))

# ---- §3.1 card anatomy + search: vehicle + clocked (SV-9239) -------------------------
PLAN["SCH-WOL-02"] = dict(cid=29937,
    title="Work order card shows number, hours, customer, unit, vehicle, and lead tech",
    pre="1. You are signed in on a desktop browser.\n"
        "2. A work order exists with a customer, a unit, a vehicle (year/make/model), at least one approved line with estimated hours and some hours clocked, and a lead technician assigned.\n"
        "3. You are on the Schedule page with the work order list visible.",
    steps="1. Find that work order's card in the sidebar list.\n2. Read the card from top to bottom.",
    body="1. Top left: the work order number, shown in an accent color.\n"
         "2. Top right: the line count plus the hours - both the estimate and the hours clocked so far, rolled up for the whole order.\n"
         "3. Below: the customer name in bold, then the unit number.\n"
         "4. The vehicle shown as year, make and model (for example '2021 Freightliner Cascadia').\n"
         "5. A lead technician row with the technician's avatar and name.\n"
         "6. A colored left border whose color reflects the work order's status.",
    refs="SV-8687; SV-9239 (§3.1 card anatomy adds the vehicle and the clocked hours rollup)",
    prov=prov("stories SV-8687 and SV-9239 (card anatomy: vehicle and clocked hours)", "§3.1"))

PLAN["SCH-WOL-04"] = dict(cid=29939,
    title="'Search work orders' matches number, customer, unit, vehicle, and technician",
    pre="1. You are signed in on a desktop browser.\n"
        "2. Work orders exist with different work order numbers and with distinct customer names, unit numbers, vehicles, and lead technicians.\n"
        "3. You are on the Schedule page with the work order list visible.",
    steps="1. Click the 'Search work orders' field and type the number of one specific work order; note the results, then clear.\n"
          "2. Type part of a customer name; note the results, then clear.\n"
          "3. Type a unit number; note the results, then clear.\n"
          "4. Type part of the vehicle (for example the make, 'Freightliner'); note the results, then clear.\n"
          "5. Type a technician's name; note the results.",
    body="1. Work-order-number search narrows the list to the card(s) whose work order number matches what you typed, and cards that do not match disappear.\n"
         "2. Customer-name search shows only cards for that customer, and it works with the full multi-word name (for example 'Vuchester Retail').\n"
         "3. Unit-number search shows only cards with that unit.\n"
         "4. Vehicle search shows only cards whose vehicle (year, make, or model) matches what you typed.\n"
         "5. Technician-name search shows only cards where that technician is on the work order - and it must work when you type the name the way the card shows it, first name and last name together (for example 'Andrew Wade').\n"
         "6. Searching the work order number as the card shows it, or the bare number, both match.",
    refs="SV-8687; SV-9239 (§3.1 sidebar search adds the vehicle to the matched fields)",
    prov=prov("stories SV-8687 and SV-9239 (sidebar search matches the vehicle)", "§3.1"))

# ---- §4.9 typed time entry + per-line time logged (SV-9240) --------------------------
PLAN["SCH-MODAL-02"] = dict(cid=30009,
    title="Scheduled date, start, end and hours can be typed to the minute; 15-min dropdown is a shortcut",
    pre=None,
    steps="1. Open the start-time control and type a time to the minute (for example 8:07).\n"
          "2. Type an end time, then a number of hours.\n"
          "3. Use the 15-minute dropdown as a shortcut and check it stays in sync.\n"
          "4. Change the scheduled date.\n"
          "5. Check the block on the grid.",
    body="1. Start time, end time and hours can each be typed directly, to the minute (for example 8:07, not only clean quarter-hours).\n"
         "2. A 15-minute dropdown is available as a shortcut and stays in sync with typed values.\n"
         "3. Editing any two of start, end and hours resolves the third automatically.\n"
         "4. An unparseable entry reverts to the previous value.\n"
         "5. Changing the date moves the shift to the chosen day, and the grid block reflects the new date and times.",
    refs="SV-8695; SV-9240 (§4.9 start/end/hours typed to the minute; 15-min dropdown a shortcut)",
    prov=prov("stories SV-8695 and SV-9240 (typed time entry; 15-minute dropdown as a shortcut)", "§4.9"))

PLAN["SCH-MODAL-03"] = dict(cid=30010,
    title="The modal shows the technician and time logged vs estimate, per line and for the shift",
    pre=None, steps=None,
    body="1. The assigned technician is shown.\n"
         "2. Time logged against the estimate is shown BOTH per line (for each scheduled line) AND rolled up for the shift as a whole.\n"
         "3. A line with nothing clocked shows zero logged against its estimate, rather than being hidden.\n"
         "4. The numbers are consistent with the lines' actual logged time and estimates.",
    refs="SV-8695; SV-9240 (§4.9 time logged against estimate; per line and for the shift)",
    prov=prov("stories SV-8695 and SV-9240 (time logged per line and for the shift)", "§4.9"))

# ---- §4.12 truncated tooltip + capacity detail modal (SV-9241) -----------------------
PLAN["SCH-CAP-04"] = dict(cid=30033,
    title="Hovering a capacity bar shows a truncated breakdown with 'click to view all'",
    pre=None, steps=None,
    body="1. A tooltip shows a per-technician breakdown (assigned hours vs that technician's capacity), truncated to a short list.\n"
         "2. When there are more technicians than the short list, the tooltip ends with a '+N more · click to view all' row.\n"
         "3. Clicking the capacity bar (or that row) opens a capacity detail modal listing every technician for that day with assigned hours against their capacity.\n"
         "4. Overtime technicians are highlighted (amber in the tooltip; highlighted in the modal).\n"
         "5. Unassigned shifts are excluded from the figures - they never fill the bar and never raise overtime.\n"
         "6. The numbers agree with the shifts actually on the grid.",
    refs="SV-8698; SV-9241 (§4.12 truncated tooltip with '+N more click to view all'; capacity detail modal; unassigned excluded)",
    prov=prov("stories SV-8698 and SV-9241 (truncated tooltip and the capacity detail modal)", "§4.12"))

# ---- §4.8 day view auto-scroll + snap + time chip (SV-9244) --------------------------
PLAN["SCH-DAY-01"] = dict(cid=30001,
    title=None,
    pre=None,
    steps="1. Switch to day view and look at where the timeline is scrolled to.\n"
          "2. Manually scroll the timeline to a late-night hour (for example 11:00 PM).\n"
          "3. Wait a few seconds and interact with the page without changing the day (hover blocks, open/close a tooltip).\n"
          "4. Navigate to the next day with the toolbar arrow, then change the grid range, and look again.\n"
          "5. Navigate so the viewed date is today and look at where it scrolls.",
    body="1. On day-view load, on navigating to a new day, and on changing the grid range, the timeline auto-scrolls so the earliest technician's resolved start sits at the left edge of the visible area, with a small buffer (roughly 30 to 60 minutes) before it.\n"
         "2. When the viewed date is today, it scrolls to the 'now' line instead of the day start.\n"
         "3. The start used is the earliest technician's resolved start (technician hours, else business hours, else the 7:00 AM app-level default) so no shifts sit off-screen to the left.\n"
         "4. Your manual scroll position stays put - nothing jumps you back while you remain on the same day.\n"
         "5. The timeline remains a full 24-hour scrollable timeline (midnight to midnight); only load, day navigation, or a grid-range change re-triggers the auto-scroll.",
    refs="SV-8694; SV-9244 (§4.8 auto-scroll triggers incl. grid-range change; scrolls to the now line when today)",
    prov=prov("stories SV-8694 and SV-9244 (auto-scroll triggers and the now-line-when-today rule)", "§4.8"))

PLAN["SCH-DAY-04"] = dict(cid=30004,
    title="Dragging a shift sideways moves its start in 15-min steps with a live time chip",
    pre=None,
    steps="1. Drag the shift block horizontally along the timeline and release at a position between clean quarter-hours, watching for a time chip.\n"
          "2. Open the shift and read its new start time.\n"
          "3. Undo via the toast if needed and restore the original time.",
    body="1. The shift moves along the timeline as you drag, and a live time chip follows the gesture showing the snapped time.\n"
         "2. The released start time snaps to a 15-minute interval (for example 9:15, 9:30 - never 9:22).\n"
         "3. The time chip disappears when you release.\n"
         "4. The duration is unchanged by a horizontal move.\n"
         "5. A toast with Undo appears for the move.",
    refs="SV-8694; SV-9244 (§4.8 horizontal drag snaps to 15 min with a live time chip; §7 toast)",
    prov=prov("stories SV-8694 and SV-9244 (15-minute snap with a live time chip)", "§4.8, §7"))

PLAN["SCH-DAY-05"] = dict(cid=30005,
    title="Dragging a shift's edge resizes it in 15-min steps with a live time chip",
    pre=None,
    steps="1. Drag the shift's RIGHT edge further right and release, watching for a time chip.\n"
          "2. Drag the shift's LEFT edge and release.\n"
          "3. Open the shift and read its times.",
    body="1. Dragging the right edge extends or shortens the end time (start unchanged); dragging the left edge adjusts the start time (end unchanged).\n"
         "2. A live time chip follows the gesture showing the snapped time, and disappears on release.\n"
         "3. The resulting times land on 15-minute increments.\n"
         "4. The shift's duration on the grid matches the modal's start and end.",
    refs="SV-8694; SV-9244 (§4.8 edge resize snaps to 15 min with a live time chip)",
    prov=prov("stories SV-8694 and SV-9244 (edge resize snaps to 15 min with a live time chip)", "§4.8"))

# ---- §4.11 single hours source (SV-9233) ---------------------------------------------
PLAN["SCH-CONF-02"] = dict(cid=30024,
    title=None, pre=None, steps=None,
    body="1. The shift is created but flagged as a conflict because the day is outside the technician's configured working days (the reason names the technician's own working days, not a fixed Monday-to-Friday window).\n"
         "2. If the technician's working days DO include that day (for example Saturday hours are configured), a shift on that day is NOT flagged.\n"
         "3. Hours conflicts are evaluated against a single source: the technician's configured hours when set, otherwise the shop's business hours - never both together. When neither is set there is no hours conflict at all (the 7:00 AM to 7:00 PM app-level default is not a rule).\n"
         "4. The warning icon appears on the block and the conflict is listed in the toolbar dropdown.",
    refs="SV-8697; SV-9233 (§4.11 weekend shift; §4.2 hours conflict uses a single source)",
    prov=prov("stories SV-8697 and SV-9233 (hours conflicts evaluated against a single source)", "§4.11, §4.2"))

PLAN["SCH-CONF-03"] = dict(cid=30025,
    title=None, pre=None, steps=None,
    body="1. The shift is flagged as a before-hours conflict, with a reason in the spirit of 'Starts before business hours', measured against that technician's own resolved working-day START.\n"
         "2. The shift is flagged as an after-hours conflict, measured against that technician's own resolved working-day END.\n"
         "3. Both are evaluated against a SINGLE hours source: the technician's configured hours when set, otherwise the shop's business hours, never both together; when neither is set there is no hours conflict (the 7:00 AM to 7:00 PM app-level default only sizes and draws shifts).\n"
         "4. Choosing 'Adjust' on the conflict banner clamps the shift to the resolved working window that raised the conflict.\n"
         "5. Warning icon on the block in each case; the conflict appears in the toolbar dropdown.",
    refs="SV-8697; SV-9233 (§4.11 before/after hours; §4.2 single hours source; Adjust clamps to the resolved window)",
    prov=prov("stories SV-8697 and SV-9233 (single hours source; Adjust clamps to the resolved window)", "§4.11, §4.2"))

# ---- §12 shop closures NOT skipped - v30 resolves the contradiction (SV-9238) --------
PLAN["SCH-EDGE-05"] = dict(cid=30089,
    title="Shop closures do NOT block the spread - shifts can land on closure days",
    pre=None, steps=None,
    body="1. The closure day is NOT struck through or skipped by the spread.\n"
         "2. A shift CAN be placed on the shop closure day - only weekend days are skipped by the spread.\n"
         "3. The end date follows the normal daily distribution - no extra day is added for the closure.",
    refs="SV-8691; SV-9238 (§12 and §4.5 closures are not skipped; only weekends are skipped)",
    prov=prov("stories SV-8691 and SV-9238 (shop closures are not skipped by the spread; weekends only)", "§12, §4.5"))

# ---- §5.3 panel collapse - RE-ANCHOR SV-8686 -> SV-9243 (body unchanged) -------------
_PANEL_ANCHORS = {
 43582: ("SV-9243 (§5.3 Panel collapse control - position; borderless icon; tooltip wording; §6 toolbar Panel row)",
         "§5.3 Panel collapse and §6 Grid toolbar"),
 43583: ("SV-9243 (§5.3 Panel collapse behavior; §3.1 the grid widens into the freed space)",
         "§5.3 Panel collapse and §3.1 Left panel"),
 43584: ("SV-9243 (§5.3 Panel collapse state preservation; §3.1 the panel's state survives)",
         "§5.3 Panel collapse and §3.1 Left panel"),
 43585: ("SV-9243 (§5.3 Panel collapse narrow viewports; toggle works at any width; the choice holds until the next resize)",
         "§5.3 Panel collapse, Narrow viewports"),
 43586: ("SV-9243 (§5.3 Panel collapse popovers and modals reposition when the panel is hidden)",
         "§5.3 Panel collapse, Popovers and modals"),
 43587: ("SV-9243 (§5.3 Panel collapse persistence; session-scoped per user)",
         "§5.3 Panel collapse, Persistence"),
}
# Clean numbered bodies (the pre-v30 build-observation paragraph is dropped this pass -
# build verification is deferred; the later sync re-establishes any observed failure).
_PANEL_BODY = {
43582: "1. There is a button at the far-left end of that row, to the left of the Today button.\n2. It sits above the grid's left-hand column - the one headed Department that carries the technician names and their small round profile pictures - so it reads as belonging to the panel it controls.\n3. It sits together with the date controls: the Today button and the left and right arrows.\n4. The button shows a small picture only, with no border or box drawn around it, in the same muted grey as the other icon buttons in that row.\n5. While the left panel is showing, the tooltip reads: Hide panel\n6. After you click it and the panel is hidden, the tooltip reads: Show panel\n7. The picture on the button is exactly the same in both states - only the tooltip changes.\n8. Clicking the button at step 4 hides the left panel, and clicking it again at step 7 shows it.",
43583: "1. The left panel closes with a short, smooth sliding movement as its width shrinks - it does not disappear in one jump.\n2. The dividing line between the panel and the grid goes away with it, leaving no leftover line, seam or empty strip where the panel used to be.\n3. The grid grows into the space the panel gave up and lays itself out again in the wider area, so you can see more of the grid than you could before.\n4. Clicking the button a second time brings the panel back to its normal width, and the grid goes back to the size it was at step 1.",
43584: "1. The panel comes back showing the same things you left in it. Nothing has been reset, cleared or reloaded from scratch - while it was hidden its contents were only out of sight, not thrown away.\n2. The date you picked in the small month calendar is still the selected date.\n3. The text you typed is still in the Search work orders box, and the list is still narrowed by it.\n4. The list is still scrolled to roughly the position you left it at.\n5. The panel comes back showing that work order's lines, not the full list of work orders - it returns to whichever of the two views was open when you hid it.\n6. The work order you had opened is still the selected one.",
43585: "1. The panel button still works on a narrow window: it is not hidden, greyed out or unresponsive below 960 pixels, and clicking it shows the left panel by hand even at that width.\n2. The panel stays as you set it while you keep working at that width - moving around the page does not undo your choice.\n3. Your choice only stops applying when the window is resized back across the 960 pixel mark; at that point the page goes back to deciding for itself whether the panel is shown.",
43586: "1. With the panel hidden, the pop-up no longer keeps clear of the space the panel used to take up. It sits against the edge of the browser window with a normal margin instead.\n2. The whole pop-up is on screen: nothing is cut off at an edge, pushed outside the window, or left floating with a large empty gap beside it.\n3. The pop-up behaves normally otherwise - you can read it, use its buttons, and close it.",
43587: "1. At step 3, still in the same sign-in, the left panel is still hidden. The choice is remembered while you stay signed in.\n2. At step 6, after signing out and back in, the left panel is showing again. The choice is not carried over into a new sign-in: it is a working-mode preference for the session you are in, not a saved view setting.\n3. At step 7, the second person's left panel is showing as normal. Your choice applied only to you and did not change what anybody else sees.",
}
for _iid, _cid in [("SCH-PANEL-01",43582),("SCH-PANEL-02",43583),("SCH-PANEL-03",43584),
                   ("SCH-PANEL-04",43585),("SCH-PANEL-05",43586),("SCH-PANEL-06",43587)]:
    _refs,_anch = _PANEL_ANCHORS[_cid]
    PLAN[_iid] = dict(cid=_cid, title=None, pre=None, steps=None, body=_PANEL_BODY[_cid],
        refs=_refs,
        prov=prov("its story SV-9243 (left-panel collapse toggle)", _anch))

# ---- TITLE fixes on the two cases the prior worker already content-updated -----------
# (body/pre/steps kept verbatim from live; refs kept from live; provenance already v30
#  and correct — driver keeps them by leaving prov=None.)
PLAN["SCH-NAV-07"] = dict(cid=29931,
    title="The department header row doubles as that department's unassigned lane",
    pre=None, steps=None, body=None, refs=None, prov=None)
PLAN["SCH-REAS-03"] = dict(cid=30054,
    title="Left-click empty grid space opens a menu with 'Assign work order' first",
    pre=None, steps=None, body=None, refs=None, prov=None)
