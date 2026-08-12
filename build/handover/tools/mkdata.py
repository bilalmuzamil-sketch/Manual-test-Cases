#!/usr/bin/env python3
"""Assemble data.json for the tester handover sheet.

Holds come from the LIVE census (census.json + holds.json). Defects and tickets are
transcribed from today's committed pass folders — nothing invented, nothing padded.
"""
import json, os

HOLDS = json.load(open('/tmp/hand12/holds.json'))
OUT = '/home/user/Manual-test-Cases/build/handover/data.json'

SCHED_ENV = ("Build v3.5-65d6500 on https://sv8685.qa.shopview.com. The build was read at the "
             "start, the middle and the end of 12 August and was identical every time. "
             "Desktop browser, signed in as an administrator (admin@shopview.com), "
             "location \"Staging Heavy Duty - 9919\".")

defects = [
    {
        'where': 'Schedule — the button that hides the left panel',
        'cases': [43582, 43583, 43584, 43585, 43586, 43587],
        'seen': (
            "There is no button anywhere to hide or show the left work-order panel.\n\n"
            "The leftmost control in the row above the grid is the \"Today\" button, and there is "
            "nothing at all to the left of it.\n\n"
            "The only thing on the page that hides anything is a small arrow inside the panel, "
            "above the month calendar. Its tooltip reads \"Hide the calendar\", and pressing it "
            "folds away the month calendar only. The panel itself stays exactly where it was. "
            "That is a different control and it is easy to mistake for this one."
        ),
        'expected': (
            "An icon button that collapses and expands the whole left panel.\n\n"
            "It should be the first item in the row of controls above the grid, immediately to "
            "the left of \"Today\".\n\n"
            "Its tooltip should read \"Hide panel\" when the panel is open, and \"Show panel\" "
            "when it is collapsed.\n\n"
            "Pressing it should slide the panel closed and let the grid widen into the space, and "
            "whatever you had set up in the panel should still be there when you open it again."
        ),
        'source': (
            "The Schedule product description on Confluence, version 27, read on 11 August 2026, "
            "section 5.3 \"Panel collapse\". Quoted word for word:\n\n"
            "\"An icon button collapses and expands the left panel. It is the first item in the "
            "grid toolbar, left of Today, sitting in the same left gutter as the grid's row "
            "labels and avatars so it reads as belonging to the panel it controls, and grouping "
            "with the date controls.\"\n\n"
            "\"A borderless panel-left icon in secondary text color. The icon does not change "
            "between states; the tooltip carries the meaning — 'Hide panel' when open, "
            "'Show panel' when collapsed.\"\n\n"
            "The same section of the description also lists this control by name among the "
            "controls in the row above the grid, calling it the \"Panel toggle\"."
        ),
        'steps': (
            "1. Sign in as an administrator and open Schedule.\n"
            "2. Look at the row of controls immediately above the grid. Find the \"Today\" "
            "button. Look to the left of it — there is nothing there.\n"
            "3. Now look inside the left panel, just above the month calendar, and find the small "
            "arrow. Rest the mouse on it: the tooltip reads \"Hide the calendar\".\n"
            "4. Press it. Only the month calendar folds away. The panel is still there and the "
            "grid does not widen."
        ),
        'env': SCHED_ENV,
        'owed': (
            "SCREENSHOTS: pictures were taken and are saved with the day's work, but they are "
            "NOT marked up. Before filing, annotate one — a picture of the row above the grid "
            "with a box drawn round the empty space to the left of \"Today\" is the one that "
            "makes the point.\n\n"
            "DUPLICATE SEARCH: not run for this one. One nearby ticket was checked and ruled "
            "out — SV-8942 is about the page scrolling sideways on a narrow window, which is a "
            "different thing. Please search Jira before you file, and record what you searched "
            "for on the ticket.\n\n"
            "THE STRONGEST ARGUMENT AGAINST IT BEING A FAULT, so you can answer it first: this "
            "wording was only added to the product description on 7 August. So it is possible "
            "the feature has simply not been built yet rather than being broken. It is still "
            "worth raising either way — but say \"not built yet\" rather than \"broken\", "
            "because that is what the evidence actually supports."
        ),
    },
    {
        'where': 'Schedule — no confirmation message and no Undo',
        'cases': [29985, 30004, 30020],
        'seen': (
            "Nothing appears on screen after any of these three actions:\n\n"
            "- creating a run of shifts across several days,\n"
            "- dragging a shift sideways to a new start time,\n"
            "- dragging an event to a different day.\n\n"
            "The change happens, and it happens silently. No message, and nowhere to press "
            "Undo. If you drag the wrong thing, you have to put it back by hand.\n\n"
            "This was not judged by eye. The screen was watched for 11 seconds after each "
            "action, and separately every single thing the page added to itself was recorded: "
            "37 things appeared, none of them a message and none of them containing the word "
            "\"Undo\"."
        ),
        'expected': (
            "Every create, delete, move and reassign should put a short message on screen with "
            "an Undo option on it.\n\n"
            "The message should stay for 4 to 7 seconds, should stay put for as long as your "
            "mouse is over it, and should disappear when you move the mouse away."
        ),
        'source': (
            "The Schedule product description on Confluence, version 27, read on 11 August 2026. "
            "It says this in two separate places.\n\n"
            "Section 7, quoted word for word: \"Toast notifications. Every create, delete, move, "
            "and reassign action produces a toast with an Undo option. The toast persists for 4 "
            "to 7 seconds, stays while the cursor is over it, and dismisses on mouse-leave.\"\n\n"
            "Section 11, quoted word for word: \"Undo. Every destructive action (delete, move, "
            "reassign) is undoable for 4 to 7 seconds via a toast that persists while hovered.\""
        ),
        'steps': (
            "Creating a run of shifts:\n"
            "1. In the left panel find work order S8685-14158, customer \"Brabay Maintenance\" "
            "(27 lines, 67h 44m). Drag it onto technician Alicia Campbell on Thursday 13 August.\n"
            "2. Choose \"Schedule whole work order\", then press the button reading "
            "\"Create 8 shifts\".\n"
            "3. Watch the screen for ten seconds. Nothing appears.\n\n"
            "Moving a shift:\n"
            "4. Switch to Day view. Find the shift for customer \"Pamill Paving\", unit 713, "
            "\"Replace - Rear ramp handles\". Drag it sideways. It moves (in our run, from 02:30 "
            "to 05:15) and keeps its length.\n"
            "5. Watch the screen. Nothing appears.\n\n"
            "Moving an event:\n"
            "6. Switch to Week view and find the event named \"Test\" on 9 August. Drag it to "
            "10 August. It moves.\n"
            "7. Watch the screen. Nothing appears."
        ),
        'env': SCHED_ENV,
        'owed': (
            "SCREENSHOTS: pictures were taken and are saved with the day's work, but they are "
            "NOT marked up. An absence is hard to photograph — the most useful picture is the "
            "whole window immediately after the action, with a caption saying what should have "
            "been there and where.\n\n"
            "DUPLICATE SEARCH: this one HAS been done. Every ticket in the SV project whose "
            "title mentions \"undo\" or \"toast\" was checked; three came back and all three are "
            "about other parts of the product (work-order lines, timesheets, imports). Please "
            "put that search on the ticket so nobody has to repeat it.\n\n"
            "THE STRONGEST ARGUMENT AGAINST IT BEING A FAULT: we could not find one. The "
            "description says it plainly, and says it twice, in two different sections."
        ),
    },
    {
        'where': 'Schedule — notes on a shift',
        'cases': [30013],
        'seen': (
            "A note added from a shift's detail window is kept against that ONE shift only. "
            "Every other shift on the same work order still shows no note.\n\n"
            "Measured on work order S-13014, which has 18 shifts on the board: after adding a "
            "note to one of them, exactly 1 of the 18 carried it and the other 17 were empty.\n\n"
            "Adding, editing and deleting a note all work correctly in themselves. It is only "
            "where the note is kept that is wrong."
        ),
        'expected': (
            "Notes on the shift detail window should be added, edited and deleted PER WORK "
            "ORDER — so a note added from any one shift should be visible from every shift of "
            "the same work order."
        ),
        'source': (
            "The Schedule product description on Confluence, version 27, read on 11 August 2026, "
            "section 4.9 \"Shift detail modal\", in the list of what that window shows. Quoted "
            "word for word: \"Notes: add, edit, and delete per work order.\""
        ),
        'steps': (
            "1. Open Schedule and find a shift for work order S-13014, customer \"Fuline "
            "Enterprises\", unit G30 (the card reads \"Fuline Enterprises G30 6 Lines\"). This "
            "work order has 18 shifts on the board, which is why it is the one to use.\n"
            "2. Click the shift to open its detail window.\n"
            "3. Press the add-note control, type any text, and confirm it. NOTE: the confirm "
            "control is a small icon, not a button labelled Save — if you go looking for a Save "
            "button you will think there is no way to save the note.\n"
            "4. Close the window and open ANY OTHER shift of the same work order S-13014.\n"
            "5. The note is not there."
        ),
        'env': SCHED_ENV,
        'owed': (
            "SCREENSHOTS: pictures were taken and are saved with the day's work, but they are "
            "NOT marked up. Before filing, annotate two side by side — the shift with the note "
            "and another shift of the same work order without it.\n\n"
            "DUPLICATE SEARCH: not run for this one. Please search Jira before you file, and "
            "record what you searched for.\n\n"
            "THE STRONGEST ARGUMENT AGAINST IT BEING A FAULT, and it is a real one: the phrase "
            "\"per work order\" sits in a list of things the shift window offers, so somebody "
            "could argue it only means \"notes about the work order, written from here\" rather "
            "than \"shared across all that work order's shifts\". That is the argument a "
            "developer would make. It may be worth asking the product owner which was meant "
            "before raising a ticket."
        ),
    },
]

tickets = [
    {
        'key': 'SV-9090', 'where': 'Schedule',
        'cases': [29982],
        'says': ("Raised on 10 August: when you spread a job across several days, it always "
                 "starts on the day you dropped it on, and there is no way to choose a "
                 "different start day.\n\nThe ticket is CLOSED, marked obsolete."),
        'actual': ("It still happens. There is no start-date control anywhere in the spread "
                   "window.\n\nBefore saying that, all five choices in the \"How much to "
                   "schedule\" list were opened in turn — including the two that reveal an "
                   "extra control — because a field that only shows under one option would "
                   "otherwise look missing. \"Until a date…\" reveals a field called "
                   "\"Finish by\" and \"Specific hours…\" reveals an hours stepper. Both of "
                   "those set the END, not the start."),
        'suggest': ("Reopen it — or reopen SV-8855 instead, but not both: they are the same "
                    "fault reported twice. A person needs to decide which one survives. We "
                    "have not touched either."),
    },
    {
        'key': 'SV-8855', 'where': 'Schedule',
        'cases': [29982],
        'says': ("Raised on 4 August, by us: the same fault as SV-9090 above — the spread "
                 "always begins on the day you dropped on.\n\nThe ticket is CLOSED, marked "
                 "obsolete."),
        'actual': ("It still happens — same evidence as the row above. Both tickets describe "
                   "one fault, and both are closed while the fault is live."),
        'suggest': ("The same decision as the row above. Our suggestion is to reopen ONE of "
                    "SV-9090 and SV-8855 and to link the other to it as a duplicate."),
    },
    {
        'key': 'SV-8957', 'where': 'Schedule',
        'cases': [29962],
        'says': ("The alternative to dragging — a control on the work-order card that arms it "
                 "so you can place it with a click instead of a drag — was removed.\n\nThe "
                 "ticket is CLOSED, marked obsolete."),
        'actual': ("It is still gone. Looked for in three ways — when the page loads, when the "
                   "mouse rests on the card, and inside the card's expanded line list — in a "
                   "state where it must appear (21 work orders on screen, approved lines, "
                   "editing rights held). It is not there in any of them.\n\nThis matters more "
                   "than it sounds: it is the only way to place a job for anyone who cannot "
                   "drag with a mouse."),
        'suggest': ("Reopen it. The test itself is already honest — it tells the tester exactly "
                    "what they will see and that the ticket was closed without a fix — so "
                    "nothing is blocked either way. This is a tidiness and truthfulness call."),
    },
    {
        'key': 'SV-8907', 'where': 'Report Suite',
        'cases': [30510, 30511, 30512, 30513, 30514, 30515, 30518],
        'says': ("Work In Progress downloads fail with a server error on any tab that has rows "
                 "in it.\n\nThe ticket is still OPEN."),
        'actual': ("It is fixed. This is the opposite case to the three above, and worth "
                   "knowing before someone spends the morning on it.\n\nProven by 8 downloads "
                   "out of 8: all four Work In Progress tabs (with 15, 3, 4 and 15 rows — every "
                   "one of them a tab WITH rows, which is exactly the state the ticket says "
                   "must fail), each in both formats. Every one produced a real file, all eight "
                   "files were different sizes, and the product showed \"Success — Data "
                   "exported successfully.\""),
        'suggest': ("Close it. The seven tests listed here have already been corrected so they "
                    "no longer tell a tester to expect a failure — if the ticket stays open, "
                    "somebody will eventually re-add that expectation and the tests will start "
                    "failing a working build."),
    },
]

import re

# The hold reason is quoted from the case itself, so a tester reading the case sees the
# same words. The ONLY change made is to spell out document reference codes, which mean
# nothing to a first-time reader (Standing Rule 7).
DOCREF = re.compile(r'\bS\d+-[A-Z]+\d+\b')


def plain(reason):
    return DOCREF.sub('the written description', reason)


holds = []
for proj in ('Filters', 'Schedule', 'Report Suite'):
    for r in HOLDS['rows'][proj]:
        holds.append({
            'project': proj, 'id': r['id'], 'title': r['title'],
            'reason': plain((r['reason'] or '').strip()),
            'result': r['status'],
            'result_by': r['graded_by'],
        })

json.dump({'defects': defects, 'tickets': tickets, 'holds': holds},
          open(OUT, 'w'), indent=1)
print('holds:', len(holds), '| passed:', sum(1 for h in holds if h['result'] == 'Passed'))
print('defects:', len(defects), '| tickets:', len(tickets))
print('written', OUT)
