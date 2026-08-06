"""The rewritten body of every OPEN Schedule ticket, in the QA lead's five-part shape.

Same rules as content_filters.py. Named test data is folded into the steps; where the
specification is genuinely silent on part of the expectation, the Source section says so
in one sentence rather than claiming support it does not have (Standing Rules 25 and 57).
"""

BRANCH = ("QA branch sv8685 — https://sv8685.qa.shopview.com/schedule. Desktop browser, "
          "signed in as an Admin, with the location Staging Heavy Duty - 9919 selected.")
SPEC = "the Schedule specification (Confluence page 713031682), version 25"

TICKETS = {

    # ------------------------------------------------------------------ SV-8848
    "SV-8848": {
        "description": [
            "Every time on the Schedule is shown six hours later than the time the job "
            "was scheduled for. A job put on a technician's calendar for 7:00 in the "
            "morning appears as 1:00 in the afternoon — on the block, in the hover "
            "summary, in the shift window and in the Day view. The 'now' marker is "
            "wrong by the same six hours.",
            "This makes the Schedule unusable as a planning board: a morning job looks "
            "like an afternoon job, and a 7:00 AM to 7:00 PM day shift reads 1:00 PM to "
            "1:00 AM and spills onto the next day.",
        ],
        "env": BRANCH,
        "steps": [
            "Open Schedule from the top navigation and choose the Week view.",
            "In the left-hand panel, type S-15855 into 'Search work orders' to find the "
            "Vuchester Retail work order, unit 10123073, line 'Service - Mobile service "
            "call made by George Donald 403-369-7067'.",
            "Check technician Ayesha Khan's hours first, in Administration then Staff, "
            "then Edit Staff Member: Monday 7:00 AM to 9:00 PM and Tuesday to Friday "
            "7:00 AM to 7:00 PM. So a job placed on her should start at 7:00 in the "
            "morning.",
            "Drag that work order card onto Ayesha Khan's row, on the Tuesday column.",
            "Hover the new block and read the time range in the pop-up summary.",
            "Click the block and read the two time boxes in the shift window.",
            "Switch to the Day view for that date. Read where the block sits against "
            "the hour labels, and read the time printed on the 'now' marker.",
        ],
        "current": [
            ("p", "Every time reads six hours later than it should. The 7:00 AM job "
                  "reads 1:00 PM. A 9:00 AM job reads 3:00 PM. The 'now' marker read "
                  "4:11 PM while the clock at the shop read 10:11 AM."),
            ("p", "The date can roll over too: a 7:00 AM to 7:00 PM shift reads 1:00 PM "
                  "to 1:00 AM and is drawn partly on the following day."),
            ("p", "For a developer: the times are stored correctly and shown wrongly. "
                  "A shift saved as 16:01 UTC (10:01 in the shop's own time zone, "
                  "America/Edmonton, which is six hours behind) is displayed as 4:01 PM. "
                  "Forcing the browser's own time zone to America/Edmonton gives the "
                  "same wrong result, so this is not the viewer's machine."),
        ],
        "expected": [
            "The Schedule shows the time at the shop. A job scheduled to start at 7:00 "
            "in the morning reads 7:00 AM everywhere — on the block, in the hover "
            "summary, in the shift window and in the Day view — and the 'now' marker "
            "matches the clock on the shop wall.",
        ],
        "source": [
            f"Epic SV-8685, story SV-8686 (Schedule Grid Layout & Navigation), and "
            f"{SPEC}.",
            "Section 4.2: \"Every shift has a start time. It is derived from a "
            "hierarchy: The technician's configured working hours take precedence.\" The "
            "technician in the steps above has hours of 7:00 AM to 7:00 PM, so a shift "
            "placed on her must read 7:00 AM, not 1:00 PM.",
            "Section 4.8, on the Day view: \"Now line. A vertical indicator showing the "
            "current time, with a label on hover over the grid.\" The current time for a "
            "shop is the time on the shop's own clock.",
            "One honest note: the specification writes no rule about time zones "
            "anywhere, so it is silent on that point. What those two lines do settle is "
            "that a shift's start follows the technician's hours and that the marker "
            "shows the current time, and the six-hour shift breaks both.",
        ],
    },

    # ------------------------------------------------------------------ SV-8849
    "SV-8849": {
        "description": [
            "A job spread over several days cannot be opened from the Week view. "
            "Clicking the labelled block, or any of the small 'continues' markers on "
            "the following days, does nothing at all — no window, no menu. So from the "
            "Week view a planner cannot see the job's detail, recolour it, add a note "
            "or delete it. The same shift opens normally from the Day and Month views.",
        ],
        "env": BRANCH,
        "steps": [
            "Open Schedule and choose the Week view.",
            "In the left-hand panel, type S-14527 into 'Search work orders' to find the "
            "Qispring Rentals work order, which has 5 lines and a 40.3 hour estimate.",
            "Drag that card onto technician Brittany Anderson's row, on the Monday "
            "column.",
            "Choose 'Schedule whole work order', then 'Create 4 shifts'. That gives a "
            "job spread across Monday to Thursday.",
            "Back on the Week view, click the labelled Monday block, which reads "
            "'Qispring Rentals / 5 Lines / Part of a series'.",
            "Click each of the small 'continues' markers on Tuesday, Wednesday and "
            "Thursday.",
            "Switch to the Day view for that Monday and click the same block, then to "
            "the Month view and click it there.",
        ],
        "current": [
            ("p", "In the Week view neither the labelled block nor any 'continues' "
                  "marker responds to a click. No window opens. Right-clicking and "
                  "double-clicking do nothing either."),
            ("p", "The very same shift opens normally from the Day view and from the "
                  "Month view, where the window correctly shows 'Part of a series - "
                  "Shift 1 of 4'."),
            ("p", "For a developer: every block in the week was clicked in turn. The "
                  "four series blocks opened nothing, while the four ordinary shifts "
                  "and the event in the same week all opened their detail window "
                  "normally."),
        ],
        "expected": [
            "Clicking any part of a spread job in the Week view opens the shift window, "
            "exactly as clicking a single-day shift does, so the planner can read the "
            "detail, recolour it, add a note or delete it.",
        ],
        "source": [
            f"Epic SV-8685, story SV-8692 (Linked Series & Banners), and {SPEC}.",
            "Section 4.9: \"Clicking a shift block opens a detail panel showing:\" and "
            "then the list of what the panel holds, including the scope summary, the "
            "notes and the Delete action.",
            "The specification draws no distinction between a single-day shift and one "
            "that belongs to a series, and none between the Day, Week and Month views.",
        ],
    },

    # ------------------------------------------------------------------ SV-8850
    "SV-8850": {
        "description": [
            "When a technician has more than three overlapping jobs on one day, the "
            "extra ones are folded away behind a '+N more' link. Clicking that link "
            "opens a box that shows only the date and the capacity bar — the hidden "
            "jobs are never listed. There is no other way to reach them from that view, "
            "so work that is genuinely on the schedule is invisible.",
        ],
        "env": BRANCH,
        "steps": [
            "Open Schedule and choose the Week view for the week of 2 to 8 August 2026.",
            "Find technician Colleen Guerrero's row, Sunday 2 August. She has four "
            "overlapping jobs there — Ceview Builders unit 10, Pamill Paving unit 713, "
            "Xiriver Apparel unit 16604 and one more.",
            "Note that only three blocks are drawn, with a '+1 more' link underneath "
            "them.",
            "Click '+1 more'.",
            "Read what is inside the box that opens.",
        ],
        "current": [
            ("p", "The box opens with the heading 'August 2, 2026' and a close X, and "
                  "its body holds only the day cell and its capacity bar."),
            ("p", "No job is listed at all, so the fourth job cannot be seen or "
                  "reached from this view."),
            ("p", "For a developer: the pop-up's body contains the day cell and "
                  "capacity bar and zero shift blocks."),
        ],
        "expected": [
            "The box lists the hidden job or jobs, so the planner can see them and "
            "click through to them.",
        ],
        "source": [
            f"Epic SV-8685, story SV-8693 (Overlap & Lane Stacking), and {SPEC}.",
            "Section 4.7: \"Visible lanes are capped at 3. Additional overlapping "
            "shifts collapse into a '+N more' affordance that opens a popover listing "
            "the hidden shifts. This applies in day, week, and month views (week and "
            "month reach the overflow much sooner because cells are narrower).\" "
            "Listing the hidden shifts is the whole purpose the specification gives "
            "that control.",
        ],
    },

    # ------------------------------------------------------------------ SV-8851
    "SV-8851": {
        "description": [
            "The View Options menu offers a 'Tech Hours' switch, which is supposed to "
            "show each technician's working hours next to their name. Switching it on "
            "and off makes no difference anywhere on the page — not even for the "
            "technician in this shop who does have custom hours saved.",
        ],
        "env": BRANCH,
        "steps": [
            "Check the test data first: in Administration then Staff, open Edit Staff "
            "Member for technician Ayesha Khan. Her custom hours are Monday 7:00 AM to "
            "9:00 PM, Tuesday to Friday 7:00 AM to 7:00 PM, and Saturday and Sunday set "
            "to Not working.",
            "Open Schedule and choose the Week view.",
            "Click View Options in the toolbar — the sliders icon on the right.",
            "Note that 'Tech Hours' starts switched off, and switch it on.",
            "Close the menu and read the technician names down the left-hand side, "
            "including Ayesha Khan's row.",
            "Switch 'Tech Hours' back off and compare the two screens.",
        ],
        "current": [
            ("p", "Nothing changes. Each row shows only the initials, the name and the "
                  "job title, both before and after."),
            ("p", "Ayesha Khan's row reads exactly 'AK Ayesha Khan' with the switch "
                  "off, with it on, and after switching it off again."),
            ("p", "For a developer: the switch itself works and its setting is stored — "
                  "it is simply not used to draw anything."),
        ],
        "expected": [
            "With Tech Hours on, each technician's working hours appear beside their "
            "name — for example '7:00 AM - 7:00 PM' next to Ayesha Khan — and disappear "
            "again when it is switched off.",
        ],
        "source": [
            f"Epic SV-8685, story SV-8700 (View Options, Color System & Display "
            f"Customization), and {SPEC}.",
            "Section 9, the View Options table, gives Tech Hours a default of Off and "
            "this effect: \"Displays each technician's working hours next to their "
            "name.\"",
        ],
    },

    # ------------------------------------------------------------------ SV-8852
    "SV-8852": {
        "description": [
            "When a shift clashes, the shift window shows a warning banner naming the "
            "reason but offers no way to act on it. The banner is supposed to carry an "
            "'Adjust' action that takes the planner straight to fixing the shift. There "
            "is no such action anywhere in the window.",
        ],
        "env": BRANCH,
        "steps": [
            "Check the test data first: in Administration then Staff, open Edit Staff "
            "Member for technician Ayesha Khan. Saturday and Sunday are set to Not "
            "working, so a Sunday shift on her will clash.",
            "Open Schedule and choose the Week view.",
            "In the left-hand panel, type S-15855 into 'Search work orders' to find the "
            "Vuchester Retail work order, unit 10123073, line 'Service - Mobile service "
            "call made by George Donald 403-369-7067'.",
            "Drag that card onto Ayesha Khan's row, on a Sunday column. The new block "
            "gets an amber warning triangle.",
            "Click the block to open the shift window.",
            "Read the warning banner and look for an action next to it.",
        ],
        "current": [
            ("p", "The banner reads 'Scheduling conflict / Not a working day' and "
                  "offers nothing to click."),
            ("p", "The only controls in the whole window are the delete bin, the close "
                  "X, the colour selector, Add Note and Open Work Order. There is no "
                  "Adjust button or link under any name."),
        ],
        "expected": [
            "The banner names the clash reason and offers an 'Adjust' action that lets "
            "the planner correct the shift there and then.",
        ],
        "source": [
            f"Epic SV-8685, story SV-8697 (Conflict Detection), and {SPEC}.",
            "Section 4.9 lists among the things the shift detail panel shows: \"A "
            "conflict banner with an 'Adjust' action when the shift is conflicted.\" "
            "The banner and the action are named together, so a banner on its own does "
            "not meet it.",
        ],
    },

    # ------------------------------------------------------------------ SV-8853
    "SV-8853": {
        "description": [
            "Two of the Schedule's confirmation windows ignore the keyboard. The "
            "'Delete from this series?' window and the 'Reassign shift' window cannot "
            "be closed with Escape and cannot be confirmed with Enter, so they can only "
            "be used with a mouse. Every other pop-up on the page closes with Escape.",
        ],
        "env": BRANCH,
        "steps": [
            "Open Schedule and choose the Week view. Type S-14527 into 'Search work "
            "orders' to find the Qispring Rentals work order (5 lines, 40.3 hours), "
            "drag it onto technician Brittany Anderson's Monday column, and choose "
            "'Schedule whole work order' then 'Create 4 shifts'. That gives a job "
            "spread over four days.",
            "Switch to the Day view for the Tuesday, click the middle shift of that "
            "series to open the shift window, then click the delete bin.",
            "The 'Delete from this series?' window opens. Press Escape. Press it again. "
            "Click inside the window first and press Escape once more.",
            "Close the window with Cancel and go back to the Week view.",
            "Drag any shift block from one technician's row onto another technician's "
            "row.",
            "The 'Reassign shift' window opens, asking 'Move this shift to <name> on "
            "<date>?'. Press Enter, then press Escape.",
            "For a contrast, open the shift window on any ordinary shift and press "
            "Escape, then open the View Options menu and press Escape.",
        ],
        "current": [
            ("p", "Neither key does anything in either window. Escape does not close "
                  "them, whether or not the focus is inside the window, and only "
                  "Cancel or the close X will shut them."),
            ("p", "Enter on the 'Reassign shift' window does not confirm the move — "
                  "nothing is sent and no undo message appears."),
            ("p", "Escape does work on the shift window itself and on both toolbar "
                  "menus, so it is specifically these two confirmation windows that "
                  "ignore it."),
        ],
        "expected": [
            "Escape closes whichever pop-up is on top, and Enter confirms the window "
            "that is asking for confirmation, so both windows can be used entirely from "
            "the keyboard.",
        ],
        "source": [
            f"Epic SV-8685, story SV-8700 (View Options, Color System & Display "
            f"Customization), and {SPEC}.",
            "Section 7, under \"Keyboard support. Global shortcuts work anywhere on the "
            "schedule page\", writes both keys down separately.",
            "On Escape: \"Escape closes the topmost open modal or popover, following a "
            "defined stacking order (delete scope, reassign, spread, capacity, event "
            "modal, event view, line picker, shift detail, cell menu, calendar picker, "
            "customize, filters, search).\"",
            "On Enter: \"Enter confirms the active confirmable dialog (delete scope, "
            "reassign, spread, event create/edit). It does not fire inside textareas, "
            "so multiline note editing still works normally.\" The delete-scope and "
            "reassign windows are the first two named in both lists.",
        ],
    },

    # ------------------------------------------------------------------ SV-8854
    "SV-8854": {
        "description": [
            "A user who has been given the Schedule but deliberately not given Work "
            "Orders: View can still read the whole work order list down the left of the "
            "Schedule page — customer names, unit numbers, how many lines each job has, "
            "the hours estimate and the lead technician. That is exactly the "
            "information their permissions were set up to keep from them, and the "
            "restriction can be got round simply by opening the Schedule.",
        ],
        "env": ("QA branch sv8685 — https://sv8685.qa.shopview.com/schedule. Desktop "
                "browser, with the location Staging Heavy Duty - 9919 selected. Steps 1 "
                "to 3 are done signed in as an Admin; from step 4 you are signed in as "
                "the restricted user made in step 1."),
        "steps": [
            "Signed in as an Admin, go to Settings then Roles & Permissions and create "
            "a role with Schedule: View switched ON and Work Orders: View switched OFF, "
            "and nothing else switched on.",
            "Go to Settings then Staff, open any active staff member, set their Role to "
            "that new role and save.",
            "Sign out.",
            "Sign in as that staff member.",
            "Open Schedule from the top navigation.",
            "Read the left-hand panel.",
            "When you are finished, delete the role you made and put the staff member "
            "back on their original role.",
        ],
        "current": [
            ("p", "The full work order list is shown — 18 cards, each with the work "
                  "order number, the customer name, the unit number, 'N lines - Xh "
                  "Est.', the technician initials and the lead technician's name. "
                  "Nothing is hidden."),
            ("p", "For a developer: this is not only a screen problem — the request "
                  "that fetches the sidebar's work orders also succeeds for this user "
                  "and returns the full list. The permission tier itself is enforced "
                  "correctly, though: the same user is refused when trying to create, "
                  "change or delete a shift or an event."),
        ],
        "expected": [
            "The left-hand panel hides the work order list for this user. They can "
            "still see the calendar and everyone's shifts, but no customer names, unit "
            "numbers, line counts, hours or lead technicians.",
        ],
        "source": [
            f"Epic SV-8685, story SV-8687 (Work Order Sidebar & Mini Calendar), and "
            f"{SPEC}.",
            "Section 14.2 (Work order sidebar dependency): \"The left panel sidebar "
            "displays work order data (customer, unit, lines, lead tech) and requires "
            "Work Orders: View to populate. If a user has Schedule access but Work "
            "Orders: View is OFF, the sidebar hides the work order list and line "
            "drill-down (the mini calendar remains available). The user can still view "
            "and interact with shifts already on the grid, but cannot drag new ones "
            "from the sidebar since the WO list is not visible.\"",
        ],
    },

    # ------------------------------------------------------------------ SV-8855
    "SV-8855": {
        "description": [
            "The window that spreads a big job over several days has no start date "
            "field. The run of days always begins on whichever day the job was dropped "
            "on, and there is no way to change it. That removes the one way a planner "
            "had of making a second technician's run start after the first one finishes "
            "instead of alongside it.",
        ],
        "env": BRANCH,
        "steps": [
            "Open Schedule and choose the Week view.",
            "In the left-hand panel, type S-14527 into 'Search work orders' to find the "
            "Qispring Rentals work order, which has 5 lines and a 40.3 hour estimate.",
            "Drag that card onto technician Brittany Anderson's row, on the Monday "
            "column, and choose 'Schedule whole work order'.",
            "The spread window opens, reading 'Brittany Anderson - Whole order - 40h "
            "19m', with a Schedule choice of 'Full estimate (40h 19m)' and a preview "
            "reading '4 shifts - 40h 19m / Aug 10 to Aug 13 - 12h/day, Mon-Thu'.",
            "Look for a start date field anywhere in the window.",
            "Try each of the other four choices in turn — 1 week, 2 weeks, 'Until a "
            "date...' and 'Specific hours...' — and look again each time.",
        ],
        "current": [
            ("p", "There is no start date field in the window under any of the five "
                  "choices."),
            ("p", "'Until a date...' adds a 'Finish by' date and 'Specific hours...' "
                  "adds an 'Hours per day' number, but neither lets the planner say "
                  "where the run begins."),
            ("p", "The start is fixed by the cell the card was dropped on."),
        ],
        "expected": [
            "The spread window carries a start date that begins on the earliest working "
            "day and can be changed, so a planner can push a second technician's run to "
            "begin after the first one ends.",
        ],
        "source": [
            f"Epic SV-8685, story SV-8691 (Multi-Day Spread Scheduling), and {SPEC}.",
            "Section 4.5 (Multi-day spread scheduling): \"Start date. Defaults to the "
            "earliest working day. Adjusting it is how a second technician's series can "
            "be made sequential (starting after the first) rather than parallel.\" The "
            "second sentence names the exact thing that cannot be done today.",
        ],
    },

    # ------------------------------------------------------------------ SV-8856
    "SV-8856": {
        "description": [
            "In the Day view a job can be dragged left or right to change what time it "
            "starts. It is meant to move in quarter-hour steps, but the smallest move it "
            "will make is a whole hour, so a job cannot be set to start at a quarter "
            "past or half past by dragging.",
        ],
        "env": BRANCH,
        "steps": [
            "Open Schedule and choose the Day view for Tuesday 4 August 2026.",
            "Find the Xiriver Apparel block, unit 16604, on technician Brittany "
            "Anderson's row.",
            "Hover it and note the start time in the pop-up summary.",
            "Press and hold the middle of the block, drag it a short distance to the "
            "right — about half of one hour column, roughly 24 pixels — and release.",
            "Hover it again and read the new start time.",
            "Put the shift back where it was afterwards.",
        ],
        "current": [
            ("p", "The start time jumps a whole hour. A drag of about half an hour's "
                  "width moved the job a full hour, and no quarter-hour position can be "
                  "reached by dragging at all."),
            ("p", "For a developer: a 24 pixel drag, which is about 31 minutes at that "
                  "zoom level, saved the shift exactly 60 minutes later. This is a "
                  "different surface from SV-8833, which is about the start and end "
                  "pickers inside the shift window."),
        ],
        "expected": [
            "The start time moves in quarter-hour steps, so a small drag moves it 15 or "
            "30 minutes and a job can be set to start at 8:15 or 8:45.",
        ],
        "source": [
            f"Epic SV-8685, story SV-8694 (Day View Timeline Interactions), and {SPEC}.",
            "Section 4.8 (Day view: timeline interactions): \"Horizontal drag to move a "
            "shift's start time (snaps to 15-minute intervals).\"",
        ],
    },

    # ------------------------------------------------------------------ SV-8857
    "SV-8857": {
        "description": [
            "The work order filters on the left of the Schedule can be switched on one "
            "at a time but not switched off in one go — there is no 'Clear all'. There "
            "is also nothing on the Filters button to show that filters are on or how "
            "many, so a planner can be looking at a filtered list without realising it "
            "and then has to hunt through three groups of tick boxes to undo it.",
        ],
        "env": BRANCH,
        "steps": [
            "Open Schedule.",
            "Click 'Filters' in the left-hand panel.",
            "Tick 'Unassigned' under Assignment and 'Approved' under Status.",
            "Close the pop-up and note that the work order list is now narrowed.",
            "Look at the Filters button for any badge or count showing that filters are "
            "on.",
            "Open the pop-up again and look for a 'Clear all' control.",
        ],
        "current": [
            ("p", "There is no count or badge on the Filters button, so nothing on the "
                  "closed button says a filter is on."),
            ("p", "There is no 'Clear all' anywhere in the pop-up. Every tick box has "
                  "to be unticked one at a time."),
            ("p", "For a developer: the pop-up holds the heading 'FILTERS' and then "
                  "the Assignment, Status and Priority tick boxes with their counts, "
                  "and nothing else."),
            ("p", "Two screen recordings made by Ayesha Khan are attached to this "
                  "ticket — 'Reproduced on QA - 8857.mp4' shows the fault and "
                  "'Verified in QA.mp4' was recorded during her QA check."),
        ],
        "expected": [
            "The Filters button carries a small count of how many filters are on, and "
            "the pop-up has a 'Clear all' that resets every filter in one click.",
        ],
        "source": [
            f"Epic SV-8685, story SV-8687 (Work Order Sidebar & Mini Calendar), and "
            f"{SPEC}.",
            "Section 5.1 (Work order filters): \"Filters live behind a 'Filter' button "
            "(with an active-count badge); there are no assignment tabs. Applying a "
            "filter narrows the flat card list, and 'Clear all' resets in one click.\" "
            "Both missing things — the count on the button and the one-click reset — "
            "are in that one sentence.",
        ],
    },

    # ------------------------------------------------------------------ SV-8886
    "SV-8886": {
        "description": [
            "When a manager schedules only some of the jobs on a work order, the "
            "'Select multiple' tick-box mode is missing two of the controls it should "
            "have and a third reads differently from what was asked for. There is no "
            "'Select all' shortcut, and no 'Cancel' to step back to the quick "
            "single-tap list — the only way out is the X, which throws the whole window "
            "away.",
        ],
        "env": BRANCH,
        "steps": [
            "Open Schedule and choose the Week view.",
            "In the left-hand panel find work order S-12876, customer Pamill Paving, "
            "unit 713. It has 2 lines — 'Replace - Rear ramp handles' (estimate 1h) and "
            "'Quality control check over' (no estimate) — and its lead technician shows "
            "as Brittany Anderson. Any work order with two or more approved lines "
            "behaves the same way.",
            "Click the small calendar button on that work order's card, labelled "
            "'Schedule S-12876 by click'.",
            "Click an empty day cell on technician MQ Test Tech Qamar's row — for "
            "example Thursday 6 August. The picker opens, headed 'dropped on MQ Test "
            "Tech Qamar - Thu, Aug 6'.",
            "Click 'Select multiple'.",
            "Tick one line, for example 'Replace - Rear ramp handles'.",
            "Read the bottom bar of the picker, and look for a way back to the ordinary "
            "single-tap list.",
        ],
        "current": [
            ("p", "The tick boxes appear correctly, one per line."),
            ("p", "The bottom bar shows a tally, but it reads '1 selected - 1h' rather "
                  "than the 'Create shift - 2 lines - 6h' shape the specification "
                  "gives. The confirm button reads 'Schedule'."),
            ("p", "There is no 'Select all' button anywhere in the picker. The only "
                  "'All' control is the 'All 2' chip higher up, which is the filter "
                  "between all lines and unscheduled lines — it ticks nothing."),
            ("p", "There is no 'Cancel' button. The only way out is the X in the top "
                  "corner, which closes the whole picker instead of going back to the "
                  "single-tap list, so the work order has to be placed again from the "
                  "start."),
        ],
        "expected": [
            "In tick-box mode the bottom bar offers a running tally, a 'Select all' "
            "shortcut that is the same as choosing the whole work order, and a 'Cancel' "
            "that returns to the quick single-tap list.",
        ],
        "source": [
            f"Epic SV-8685, story SV-8689 (Scope Picker), and {SPEC}.",
            "Section 4.3: \"'Select multiple' is an opt-in control that switches the "
            "line rows into checkboxes and shows a confirm bar with a running tally "
            "('Create shift - 2 lines - 6h'), a 'Select all' shortcut (equivalent to "
            "whole order), and Cancel (returns to the fast single-tap list).\"",
        ],
    },

    # ------------------------------------------------------------------ SV-8924
    "SV-8924": {
        "description": [
            "Dragging a job out of the Unassigned row onto a technician moves it "
            "correctly, but silently changes its saved start time to six hours earlier. "
            "A job booked for 7:00 in the morning became 1:00 in the morning, which is "
            "outside the working hours of the technician it was given to. Nothing on "
            "screen warned about it.",
            "This is separate from SV-8848. There the times are stored correctly and "
            "shown wrongly; here the stored value itself is changed, so the record stays "
            "wrong even after the display is fixed.",
        ],
        "env": BRANCH,
        "steps": [
            "Open Schedule and go to the week containing Saturday 8 August 2026.",
            "Find a job sitting in the Unassigned row. The one used here was work order "
            "S-12876, customer Pamill Paving, unit 713, line 'Replace - Rear ramp "
            "handles', sitting unassigned on Saturday 8 August. The Unassigned row sits "
            "below every technician row, so you have to scroll down to reach it; if it "
            "is not drawn, put a job there first by dragging a work order onto it.",
            "Open the job and note its start time. This one read 7:00 AM.",
            "Check the receiving technician's hours: Kellie Ayers (Foreman) works 7:00 "
            "AM to 7:00 PM.",
            "Drag the block up onto Kellie Ayers' row for the same day.",
            "Confirm the 'Move this shift to Kellie Ayers on Sat, Aug 8?' window with "
            "Reassign.",
            "Open the job again and read its start time.",
        ],
        "current": [
            ("p", "The job does move to the chosen technician and does leave the "
                  "Unassigned row, and the technician is correctly added to the work "
                  "order line's technician list. That part is right."),
            ("p", "But the saved start time moves six hours earlier — from 7:00 in the "
                  "morning to 1:00 in the morning. 1:00 AM is outside the receiving "
                  "technician's own hours of 7:00 AM to 7:00 PM."),
            ("p", "It is not just what is drawn on screen: the time quoted above was "
                  "read back from the saved record after the move. It is not the "
                  "technician's hours being applied either — her start is 7:00 AM, and "
                  "7:00 is the number that ended up saved, but saved as 7:00 UTC "
                  "instead of 7:00 at the shop. The same block dragged between two "
                  "technician rows moves normally."),
        ],
        "expected": [
            "Assigning an unassigned job to a technician moves it to that technician and "
            "leaves its start time as it was — and in any case leaves it inside that "
            "technician's own working hours.",
        ],
        "source": [
            f"Epic SV-8685, story SV-8688 (Drag-and-Drop Scheduling & Shift Creation), "
            f"and {SPEC}.",
            "Section 3.2, on the unassigned row: \"Dragging a shift from this row down "
            "onto a technician assigns it.\"",
            "Section 4.2: \"When an unassigned shift is later dragged onto a technician "
            "row in the grid, that technician's hours apply.\"",
            "One honest note: the specification does not say the start time must be "
            "left exactly as it was, so the first half of the expected behaviour above "
            "is stricter than the written rule. The second half is not — 1:00 in the "
            "morning is neither the time the job had nor within the hours of the "
            "technician it was given to.",
        ],
    },

    # ------------------------------------------------------------------ SV-8933
    "SV-8933": {
        "description": [
            "A staff member's working hours cannot be opened at all if that person "
            "belongs to a different location from the one you are working in. The Staff "
            "list shows everyone, so you can find the person and open them, but "
            "switching on 'Set custom hours for this technician' fails with an error and "
            "flicks the switch back off.",
            "It affects a large part of the list rather than one record: of the 161 "
            "people, 63 cannot have their hours opened from the Heavy Duty location and "
            "98 can. The Schedule uses those hours for shift start times, conflict "
            "warnings and capacity bars.",
        ],
        "env": ("QA branch sv8685 — https://sv8685.qa.shopview.com. Desktop browser, "
                "signed in as an Admin, starting with the location Staging Heavy Duty - "
                "9919 selected."),
        "steps": [
            "Make sure the location at the top of the app is Staging Heavy Duty - 9919.",
            "Go to Administration and open the Staff list.",
            "Find Benjamin Peters. His record belongs to the other location, Staging "
            "Lethbridge - 4310, but he is listed here all the same.",
            "Open his record with the pencil icon on his row.",
            "Switch on 'Set custom hours for this technician'.",
            "Close and reopen the window, as the error message suggests, and switch it "
            "on again.",
            "Now change the location at the top of the app to Staging Lethbridge - "
            "4310, open the same person and switch the same thing on.",
            "For a direct contrast, go back to Staging Heavy Duty - 9919 and repeat "
            "steps 3 to 5 with Ayesha Khan, who belongs to that location.",
        ],
        "current": [
            ("p", "The switch flicks on and straight back off, and this error appears: "
                  "\"Couldn't load this technician's hours, so they can't be edited "
                  "right now. Close and reopen the dialog to try again.\""),
            ("p", "Closing and reopening makes no difference — it fails the same way "
                  "every time, and no editor is ever shown, so the hours cannot be set "
                  "at all from this location."),
            ("p", "From the person's own location it works immediately, and going back "
                  "to the other location brings the failure back. Ayesha Khan, who "
                  "belongs to the location being viewed, opens normally, so the editor "
                  "itself is working."),
            ("p", "For a developer: the window's request for that person's working "
                  "hours is answered with \"'Staff' was not found\", while another "
                  "request the same window makes moments earlier finds the same person "
                  "without difficulty and reports their location as Staging Lethbridge "
                  "- 4310. The result flips reliably with the session's current "
                  "location."),
        ],
        "expected": [
            "Switching the toggle on reveals the Monday to Sunday From/To editor and "
            "lets the hours be set, for any staff member the Staff list offers.",
            "If working hours really are meant to be held per location, then the screen "
            "should say so — by not offering the toggle, or by telling the user which "
            "location to switch to — rather than failing with an error that reads as a "
            "fault.",
        ],
        "source": [
            f"Epic SV-8685, story SV-8699 (Working Hours Settings), and {SPEC}.",
            "Section 4.2, under \"Hours settings (tech and business hours)\": \"Behind a "
            "toggle, off by default. Each section sits behind a toggle ('Set custom "
            "hours for this technician' / 'Set business hours for this shop'). The "
            "per-day editor appears only when the toggle is on.\" And of the editor "
            "itself: \"One row per day (Mon-Sun): day name, with From to To ranges on "
            "the right.\"",
            "One honest note: the specification puts no condition on which location the "
            "staff member is viewed from and never says whether working hours are held "
            "per location, so it is silent on that point. What it does settle is that "
            "turning the toggle on must reveal the editor. Whether a person from "
            "another location should be reachable at all is a product owner's decision.",
        ],
    },

    # ------------------------------------------------------------------ SV-8941
    "SV-8941": {
        "description": [
            "The Schedule can show a unit's VIN on the shift blocks. In Month view the "
            "blocks are small and the specification says the VIN is deliberately left "
            "off there. Month view shows it anyway, which crowds the block and pushes "
            "the job description out of sight.",
        ],
        "env": BRANCH,
        "steps": [
            "Open Schedule.",
            "Open the FILTER & DISPLAY dropdown in the toolbar and turn the VIN Number "
            "switch ON. It is off by default, so this step is needed.",
            "Choose Week view with the Day / Week / Month control and read the blocks. "
            "The VIN appears, which is correct.",
            "Switch to Month view and read the blocks. The week of 2 to 8 August 2026 "
            "on this shop already holds several units with a VIN recorded, so no extra "
            "test data is needed.",
            "Switch to Day view and read them again. The VIN appears there too, which "
            "is also correct.",
        ],
        "current": [
            ("p", "With the VIN Number switch on, Month view prints the VIN on the "
                  "blocks that have one — 11 of 67 blocks carried a full 17-character "
                  "VIN."),
            ("p", "Read straight off Month view blocks: 'Xiriver Apparel ~ 24069 ~ "
                  "3HSDZAPT9KN042164 ~ 19 Lines ~ Part of a series', 'Xiriver Apparel ~ "
                  "16604 ~ 2H9U7A228VA048027 ~ Service - Wheels off single or tandem "
                  "axle', and 'Pamill Paving ~ 713 ~ 3HAEUMMP1NL291283 ~ Replace - Rear "
                  "ramp handles'."),
            ("p", "Week view (29 of 55 blocks) and Day view (6 of 12) are both correct. "
                  "Not every block shows a VIN, because not every unit has one "
                  "recorded — the fault is that any VIN appears in Month view at all."),
            ("p", "With the switch off, no block in any view shows a VIN, so the switch "
                  "itself is working and this is specific to Month view."),
        ],
        "expected": [
            "Month view blocks show no VIN at all, even with the switch on.",
        ],
        "source": [
            f"Epic SV-8685, story SV-8690 (Shift Block Anatomy & Scope Labeling), and "
            f"{SPEC}.",
            "Section 4.4, of the VIN line: \"Line 3 (optional): VIN number, visible only "
            "when the VIN toggle is on in Filter and Display. Shown in day and week "
            "views only; month view omits it due to space constraints.\"",
        ],
    },

    # ------------------------------------------------------------------ SV-8942
    "SV-8942": {
        "description": [
            "On a narrow window the Schedule page slides sideways as a whole — the top "
            "navigation and the toolbar go with it — instead of only the grid scrolling, "
            "and the left-hand work order panel never folds away. A planner on a small "
            "window ends up scrolling the entire page left and right to see the end of "
            "the week while a third of the screen is still taken by the panel.",
        ],
        "env": BRANCH,
        "steps": [
            "Open Schedule in Week view for the week of 3 August 2026, which on this "
            "shop shows 22 technician rows and 55 shift blocks.",
            "Make the browser window 960 pixels wide — the narrowest width the Schedule "
            "is meant to support.",
            "Look at the left-hand work order panel, and try scrolling the page "
            "sideways.",
            "Narrow the window further, to 900 pixels and then to 700, and look again "
            "each time.",
            "Widen it to 1680 pixels and look once more.",
        ],
        "current": [
            ("p", "The left-hand panel keeps the same width all the way down — at 1000, "
                  "960, 900 and 700 pixels alike. It never folds away."),
            ("p", "The page itself is what scrolls sideways, not the grid. The page "
                  "stays 1030 pixels wide however narrow the window gets, so the "
                  "sideways scrollbar belongs to the whole page."),
            ("p", "There is no sideways scroller on the grid at all."),
            ("p", "At 1680 pixels there is no sideways scrolling, so this only appears "
                  "once the window is narrowed. It happens at exactly 960 pixels, which "
                  "is inside the supported range and not only an edge case. The page "
                  "reports no errors at any width."),
        ],
        "expected": [
            "The grid — not the whole page — is what scrolls sideways, and the "
            "left-hand panel collapses once the window is narrow.",
        ],
        "source": [
            f"Epic SV-8685, story SV-8686 (Schedule Grid Layout & Navigation), and "
            f"{SPEC}.",
            "Section 11 (Non-functional requirements), under Responsiveness: "
            "\"Minimum supported width is 960px (the grid scrolls horizontally below "
            "that), and the sidebar collapses on narrow viewports.\" Both halves are in "
            "that one sentence.",
        ],
    },

    # ------------------------------------------------------------------ SV-8957
    "SV-8957": {
        "description": [
            "The only way to put a job on the Schedule is now to drag it. There used to "
            "be a click alternative — you clicked a small control on the work order "
            "card, the card showed as armed, and you then clicked a technician's cell to "
            "place the job. That control has gone from the current build, so anyone who "
            "cannot drag has no way to schedule at all.",
        ],
        "env": BRANCH,
        "steps": [
            "Open Schedule in Week view for the week of 3 August 2026.",
            "Look at work order card S-12876, Pamill Paving, unit 713, 1 line, in the "
            "left-hand panel. Hover over it.",
            "Open that card's line list using the arrow on the right, and look inside "
            "it.",
            "Do the same with a multi-line card — S-13014, Fuline Enterprises, unit "
            "G30, 7 lines.",
            "Look for any button that arms a card for click placement.",
        ],
        "current": [
            ("p", "There is no such button anywhere — not on the card, not when "
                  "hovering it, and not inside the line list. The card carries no "
                  "button of any kind; its only interactive parts are the status chip "
                  "and the arrow that opens the line list."),
            ("p", "The line list holds only a back button, a search box, two scope "
                  "buttons and the line rows."),
            ("p", "It was there on an earlier build of this same branch "
                  "(v3.5-be42149), where the control read 'Schedule S-12876 by click' "
                  "and clicking it armed the card so a technician cell could be clicked "
                  "to place the job. So this is something that has been lost, not "
                  "something never built."),
            ("p", "For a developer: the whole page was searched for any control whose "
                  "name or label mentions arming or clicking to schedule, and there are "
                  "none. It was checked as an Admin with the full Schedule permission, "
                  "so it is not a permissions problem."),
        ],
        "expected": [
            "A click alternative to dragging is present, and clicking it then clicking a "
            "technician's cell places the job and opens the same scope window a drag "
            "opens.",
        ],
        "source": [
            f"Epic SV-8685, story SV-8688 (Drag-and-Drop Scheduling & Shift Creation), "
            f"and {SPEC}.",
            "Section 11 (Non-functional requirements), under Accessibility: "
            "\"drag-and-drop has a click-to-arm alternative\". Section 7 says it again: "
            "\"Drag-and-drop has a click-to-arm alternative for users who cannot drag.\"",
        ],
    },

    # ------------------------------------------------------------------ SV-8958
    "SV-8958": {
        "description": [
            "In Month view a job spread over several days is drawn as one bar, and the "
            "bar does not say whose it is. Month view has no technician rows to read the "
            "name off, unlike Day and Week, so a planner looking at the month cannot "
            "tell who a job is booked to without opening it.",
        ],
        "env": BRANCH,
        "steps": [
            "Open Schedule and switch to Month view for August 2026.",
            "Find a job that runs over several days — it will say 'Part of a series'. "
            "On this shop, Xiriver Apparel unit 24069 (19 lines) and Kastone Solutions "
            "unit HE2-001 (7 lines) are both there.",
            "Read the bar from left to right.",
            "For a contrast, switch to Week view and look at the same job.",
        ],
        "current": [
            ("p", "The bar reads, for example, 'Xiriver Apparel  24069  19 Lines  Part "
                  "of a series', and another reads 'Kastone Solutions  HE2-001  7 Lines "
                  " Part of a series'. No technician name or initials appear on it at "
                  "all."),
            ("p", "Six series bars were read in Month view and none carried a "
                  "technician. In Week view the technician is the row, so the name is "
                  "available there — this is specific to Month view."),
            ("p", "It is not a display setting: the VIN switch and the department "
                  "filters were not the cause; the technician is simply not part of the "
                  "bar's text."),
        ],
        "expected": [
            "The label at the start of the bar includes the technician the job is "
            "booked to.",
        ],
        "source": [
            f"Epic SV-8685, story SV-8692 (Linked Series & Banners), and {SPEC}.",
            "Section 4.6 (Linked series and banners): \"Month view: a continuous bar "
            "wrapping across week rows, labeled once at the start (with the "
            "technician), with a faded 'continues' label on later weeks, empty weekend "
            "columns (when business hours are not set for weekends).\" The words in "
            "brackets are the part that is missing.",
        ],
    },

    # ------------------------------------------------------------------ SV-8959
    "SV-8959": {
        "description": [
            "When you hover a shift that has a clash, the tooltip does warn you, but "
            "the warning sits at the very bottom, several rows below the customer name, "
            "and the customer name row carries no warning mark. The customer name is "
            "the first thing anyone reads, so a planner scanning quickly can miss that "
            "the shift clashes at all.",
        ],
        "env": BRANCH,
        "steps": [
            "Open Schedule in Week view for the week of 3 August 2026.",
            "Find a shift with an amber warning triangle on the block. The one used "
            "here was Brabay Maintenance, VIN C44ECN300699, Tuesday 4 August, 27 lines, "
            "technician Ayesha Khan — it has three clash reasons at once.",
            "Hover over the middle of that block and wait for the tooltip. Hover the "
            "block, not the warning triangle, which has a small tooltip of its own.",
            "Read the tooltip from the top down.",
        ],
        "current": [
            ("p", "The first row is just the customer name — 'Brabay Maintenance' — "
                  "with no warning mark beside it."),
            ("p", "The warning appears only in the last row, as 'Starts before working "
                  "hours - Extends past working hours - Double-booked' with a triangle "
                  "beside it. The warning text is amber, which is correct."),
            ("p", "The rest of the tooltip renders correctly — customer, VIN, date and "
                  "time, technician, line list and progress bar — so only the position "
                  "of the warning mark is wrong."),
        ],
        "expected": [
            "The warning mark sits next to the customer name on the first line of the "
            "tooltip. The reason line in amber at the bottom is correct and stays.",
        ],
        "source": [
            f"Epic SV-8685, story SV-8695 (Shift Detail Modal & Hover Tooltips), and "
            f"{SPEC}.",
            "Section 4.13 (Hover tooltips) sets out the order of the tooltip's "
            "contents: \"Shift tooltip: customer name (plus the conflict icon if "
            "conflicted); unit, vehicle, and VIN; date and time range; technician; "
            "scope summary ('N lines - Xh'); the individual line names as a short list "
            "capped at 3 with a '+N more lines' row (no line statuses); a time-logged "
            "progress bar ('X / Yh'); and the conflict reason in amber when "
            "conflicted.\" So the reason at the bottom is right; what is missing is the "
            "icon beside the customer name on the first line.",
        ],
    },
}
