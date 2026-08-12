#!/usr/bin/env python3
"""Build the per-project handover data — one payload per project.

LIVE HALF (derived read-only from TestRail in this pass, never typed in):
  tools/census.json   — every case, its AUTOMATION marker and its hold reason
  tools/holds.json    — the held cases
  tools/results.json  — the latest GRADED result per case in each project's run

TRANSCRIBED HALF (from this repository's committed pass folders, each row naming
its own source folder): the defects on tab 2 and the ticket claims on tab 3.
Those were observed by earlier passes today; this pass did not re-observe them
and says so on every row.

BUILD MARKERS were re-read live from each QA branch's index.html in this pass.

NO TestRail write. NO Jira call. NO application call beyond reading index.html.
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
T = os.path.join(HERE, 'tools')

CENSUS = json.load(open(os.path.join(T, 'census.json')))
HOLDS = json.load(open(os.path.join(T, 'holds.json')))
RESULTS = json.load(open(os.path.join(T, 'results.json')))['results']
READ_AT = open(os.path.join(T, 'readtime.txt')).read().strip()

PROJECTS = ('Filters', 'Schedule', 'Report Suite')

# ---------------------------------------------------------------- build markers
# Read live from each branch's index.html at 2026-08-12T12:38Z in this pass.
BUILD = {
    'Filters': {
        'branch': 'https://sv8785.qa.shopview.com',
        'now': 'v3.7-20e801b',
        'now_modified': 'Wed, 12 Aug 2026 12:09:14 GMT',
        'observed_on': 'v3.6-3e9dd6d',
        'moved': True,
    },
    'Schedule': {
        'branch': 'https://sv8685.qa.shopview.com',
        'now': 'v3.5-85ee495',
        'now_modified': 'Wed, 12 Aug 2026 12:11:04 GMT',
        'observed_on': 'v3.5-65d6500',
        'moved': True,
    },
    'Report Suite': {
        'branch': 'https://sv8582.qa.shopview.com',
        'now': 'v3.7-4626299',
        'now_modified': 'Wed, 12 Aug 2026 05:06:49 GMT',
        'observed_on': 'v3.7-4626299',
        'moved': False,
    },
}

ENV = {p: (f"Build {BUILD[p]['observed_on']} on {BUILD[p]['branch']}. "
           "Desktop browser, signed in as an administrator (admin@shopview.com), "
           'location "Staging Heavy Duty - 9919".')
       for p in PROJECTS}

# ------------------------------------------------------- plain blocker grouping
# Each held case is placed in exactly one group. Verified below to cover 100%.
def group_of(reason):
    r = (reason or '').lower()
    if 'second sign-in' in r or 'no staff record of their own' in r \
            or 'each of the two staff members' in r or 'holder of each permission level' in r \
            or 'user with no schedule permission' in r or 'user without work orders view' in r:
        return 'Waiting on a second sign-in as a different user'
    if "qa lead's ruling" in r:
        return "Waiting on the QA lead's ruling"
    if 'product owner' in r or "branko" in r or 'write-up' in r or 'no source states' in r \
            or 'product source states' in r or 'two different tab-placement rules' in r:
        return 'Waiting on an answer from the product owner'
    if 'no ticket number yet' in r or 'a ticket cannot be raised yet' in r \
            or 'needs the qa lead' in r or 'before a ticket exists' in r:
        return 'A problem was found but no ticket exists for it yet'
    if 'does not exist in the build' in r or 'not in the build' in r or 'not built yet' in r \
            or 'no appointment in the build' in r or 'does not exist in this build' in r \
            or 'rollout' in r or 'reached only some' in r or 'part-way through' in r \
            or 'no page search box yet' in r:
        return 'The feature or control is not in the build yet'
    if 'nightly capture' in r or 'background process' in r or 'server-side job' in r \
            or 'retention pruning' in r:
        return 'Depends on a nightly/background job the product never shows you'
    return 'The set-up this test needs cannot be produced on this environment'


GROUP_ORDER = [
    'A problem was found but no ticket exists for it yet',
    'The feature or control is not in the build yet',
    'Waiting on a second sign-in as a different user',
    'Waiting on an answer from the product owner',
    "Waiting on the QA lead's ruling",
    'Depends on a nightly/background job the product never shows you',
    'The set-up this test needs cannot be produced on this environment',
]

# spec anchors are spelled out for a first-time reader (the model sheet's convention)
DEJARGON = [
    ('S10-R4 says each', 'the written description says each'),
    ('(S10-R4)', '(the written description)'),
    ('DEFECTS-FOR-PERMISSION.md', "the team's own notes"),
    ('see SV-8954', 'see the ticket named on tab 3'),
]


def plain(text):
    for a, b in DEJARGON:
        text = text.replace(a, b)
    return text


def holds_for(project):
    rows = []
    res = RESULTS[project]
    for h in HOLDS['rows'][project]:
        r = res.get(str(h['id']), {})
        status = r.get('status')
        rows.append({
            'id': h['id'],
            'title': h['title'],
            'reason': plain(h['reason'] or 'no reason recorded on the case'),
            'group': group_of(h['reason']),
            'result': None if status in (None, 'Untested') else status,
            'result_raw': status,
            'by': r.get('by'),
        })
    rows.sort(key=lambda x: (GROUP_ORDER.index(x['group']), x['id']))
    return rows


# =============================================================== SCHEDULE
SCHEDULE_DEFECTS = [
    {
        'name': 'There is no button to hide the left panel',
        'seen': (
            'There is no button anywhere to hide or show the left work-order panel.\n\n'
            'The leftmost control in the row above the grid is the "Today" button, and there is '
            'nothing at all to the left of it.\n\n'
            'The only thing on the page that hides anything is a small arrow inside the panel, '
            'above the month calendar. Its tooltip reads "Hide the calendar", and pressing it folds '
            'away the month calendar only — the panel itself stays exactly where it was. That is a '
            'different control and it is easy to mistake for this one.'),
        'expected': (
            'An icon button that collapses and expands the whole left panel.\n\n'
            'It should be the first item in the row of controls above the grid, immediately to the '
            'left of "Today".\n\n'
            'Its tooltip should read "Hide panel" when the panel is open and "Show panel" when it is '
            'collapsed.\n\n'
            'Pressing it should slide the panel closed and let the grid widen into the space, and '
            'whatever you had set up in the panel should still be there when you open it again.'),
        'source': (
            'The Schedule product description on Confluence, version 27, read on 11 August 2026, '
            'section 5.3 "Panel collapse". Quoted word for word:\n\n'
            '"An icon button collapses and expands the left panel. It is the first item in the grid '
            'toolbar, left of Today, sitting in the same left gutter as the grid\'s row labels and '
            'avatars so it reads as belonging to the panel it controls, and grouping with the date '
            'controls."\n\n'
            '"A borderless panel-left icon in secondary text color. The icon does not change between '
            'states; the tooltip carries the meaning — \'Hide panel\' when open, \'Show panel\' when '
            'collapsed."\n\n'
            'The same section also lists this control by name among the controls in the row above '
            'the grid, calling it the "Panel toggle".'),
        'steps': (
            '1. Sign in as an administrator and open Schedule.\n'
            '2. Look at the row of controls immediately above the grid. Find the "Today" button. '
            'Look to the left of it — there is nothing there.\n'
            '3. Now look inside the left panel, just above the month calendar, and find the small '
            'arrow. Rest the mouse on it: the tooltip reads "Hide the calendar".\n'
            '4. Press it. Only the month calendar folds away. The panel is still there and the grid '
            'does not widen.'),
        'cases': [43582, 43583, 43584, 43585, 43586, 43587],
        'owed': (
            'SCREENSHOTS: pictures were taken and are saved with the day\'s work, but they are NOT '
            'marked up. Before filing, annotate one — a picture of the row above the grid with a box '
            'drawn round the empty space to the left of "Today" is the one that makes the point.\n\n'
            'DUPLICATE SEARCH: not run for this one. One nearby ticket was checked and ruled out — '
            'SV-8942 is about the page scrolling sideways on a narrow window, which is a different '
            'thing. Please search Jira before you file, and record what you searched for on the '
            'ticket.'),
        'against': (
            'This wording was only added to the product description on 7 August. So it is possible '
            'the feature has simply not been built yet rather than being broken. It is still worth '
            'raising either way — but say "not built yet" rather than "broken", because that is what '
            'the evidence actually supports.'),
        'record': 'build/schedule/panel-collapse-2026-08-11/',
    },
    {
        'name': 'No confirmation message and no Undo after three actions',
        'seen': (
            'Nothing appears on screen after any of these three actions:\n\n'
            '- creating a run of shifts across several days,\n'
            '- dragging a shift sideways to a new start time,\n'
            '- dragging an event to a different day.\n\n'
            'The change happens, and it happens silently. No message, and nowhere to press Undo. If '
            'you drag the wrong thing, you have to put it back by hand.\n\n'
            'This was not judged by eye. The screen was watched for 11 seconds after each action, '
            'and separately every single thing the page added to itself was recorded: 37 things '
            'appeared, none of them a message and none of them containing the word "Undo".'),
        'expected': (
            'Every create, delete, move and reassign should put a short message on screen with an '
            'Undo option on it.\n\n'
            'The message should stay for 4 to 7 seconds, should stay put for as long as your mouse '
            'is over it, and should disappear when you move the mouse away.'),
        'source': (
            'The Schedule product description on Confluence, version 27, read on 11 August 2026. It '
            'says this in two separate places.\n\n'
            'Section 7, quoted word for word: "Toast notifications. Every create, delete, move, and '
            'reassign action produces a toast with an Undo option. The toast persists for 4 to 7 '
            'seconds, stays while the cursor is over it, and dismisses on mouse-leave."\n\n'
            'Section 11, quoted word for word: "Undo. Every destructive action (delete, move, '
            'reassign) is undoable for 4 to 7 seconds via a toast that persists while hovered."'),
        'steps': (
            'Creating a run of shifts:\n'
            '1. In the left panel find work order S8685-14158, customer "Brabay Maintenance" '
            '(27 lines, 67h 44m). Drag it onto technician Alicia Campbell on Thursday 13 August.\n'
            '2. Choose "Schedule whole work order", then press the button reading "Create 8 shifts".\n'
            '3. Watch the screen for ten seconds. Nothing appears.\n\n'
            'Moving a shift:\n'
            '4. Switch to Day view. Find the shift for customer "Pamill Paving", unit 713, '
            '"Replace - Rear ramp handles". Drag it sideways. It moves (in our run, from 02:30 to '
            '05:15) and keeps its length.\n'
            '5. Watch the screen. Nothing appears.\n\n'
            'Moving an event:\n'
            '6. Switch to Week view and find the event named "Test" on 9 August. Drag it to '
            '10 August. It moves.\n'
            '7. Watch the screen. Nothing appears.'),
        'cases': [29985, 30004, 30020],
        'owed': (
            'SCREENSHOTS: pictures were taken and are saved with the day\'s work, but they are NOT '
            'marked up. An absence is hard to photograph — the most useful picture is the whole '
            'window immediately after the action, with a caption saying what should have been there '
            'and where.\n\n'
            'DUPLICATE SEARCH: this one HAS been done. Every ticket in the SV project whose title '
            'mentions "undo" or "toast" was checked; three came back and all three are about other '
            'parts of the product (work-order lines, timesheets, imports). Please put that search on '
            'the ticket so nobody has to repeat it.'),
        'against': (
            'We could not find one. The description says it plainly, and says it twice, in two '
            'different sections.'),
        'record': 'build/schedule/drag-retry-2026-08-12/',
    },
    {
        'name': 'A note added to a shift is kept against that one shift only',
        'seen': (
            'A note added from a shift\'s detail window is kept against that ONE shift only. Every '
            'other shift on the same work order still shows no note.\n\n'
            'Measured on work order S-13014, which has 18 shifts on the board: after adding a note '
            'to one of them, exactly 1 of the 18 carried it and the other 17 were empty.\n\n'
            'Adding, editing and deleting a note all work correctly in themselves. It is only where '
            'the note is kept that is wrong.'),
        'expected': (
            'Notes on the shift detail window should be added, edited and deleted PER WORK ORDER — '
            'so a note added from any one shift should be visible from every shift of the same work '
            'order.'),
        'source': (
            'The Schedule product description on Confluence, version 27, read on 11 August 2026, '
            'section 4.9 "Shift detail modal", in the list of what that window shows. Quoted word '
            'for word: "Notes: add, edit, and delete per work order."'),
        'steps': (
            '1. Open Schedule and find a shift for work order S-13014, customer "Fuline '
            'Enterprises", unit G30 (the card reads "Fuline Enterprises G30 6 Lines"). This work '
            'order has 18 shifts on the board, which is why it is the one to use.\n'
            '2. Click the shift to open its detail window.\n'
            '3. Press the add-note control, type any text, and confirm it. NOTE: the confirm control '
            'is a small icon, not a button labelled Save — if you go looking for a Save button you '
            'will think there is no way to save the note.\n'
            '4. Close the window and open ANY OTHER shift of the same work order S-13014.\n'
            '5. The note is not there.'),
        'cases': [30013],
        'owed': (
            'SCREENSHOTS: pictures were taken and are saved with the day\'s work, but they are NOT '
            'marked up. Before filing, annotate two side by side — the shift with the note and '
            'another shift of the same work order without it.\n\n'
            'DUPLICATE SEARCH: not run for this one. Please search Jira before you file, and record '
            'what you searched for.'),
        'against': (
            'This is a real one. The phrase "per work order" sits in a list of things the shift '
            'window offers, so somebody could argue it only means "notes about the work order, '
            'written from here" rather than "shared across all that work order\'s shifts". That is '
            'the argument a developer would make. It may be worth asking the product owner which was '
            'meant before raising a ticket.'),
        'record': 'build/schedule/drag-retry-2026-08-12/',
    },
    {
        'name': 'Clicking a department heading does not collapse it',
        'seen': (
            'Clicking a department heading in the grid does nothing at all. The technician rows '
            'under it stay exactly where they were.\n\n'
            'The heading is not even clickable: the mouse pointer does not change over it, there is '
            'no arrow or chevron on it, and nothing about it tells a screen reader it can be opened '
            'or closed.\n\n'
            'This was checked hard before it was written down: in BOTH Week and Day view, on ALL '
            'THREE headings on the page ("WORK ORDER STATUS", "SERVICE/PARTS" and "SERVICE"), with '
            'two different kinds of click — a scripted one and a real mouse click at the heading\'s '
            'own position on screen. The number of rows in the grid was counted before and after '
            'every single attempt: 30 rows before, 30 rows after, every time. Nothing popped up '
            'either.'),
        'expected': (
            'Clicking a department heading should collapse that department, hiding its technician '
            'rows while the heading itself stays visible. Clicking again should bring them back.'),
        'source': (
            'The Schedule product description on Confluence, version 27, read on 11 August 2026, '
            'section 3.2 "Grid grouping". Quoted word for word:\n\n'
            '"Rows are grouped by department under collapsible group headers (e.g. SERVICE/PARTS, '
            'ADMINISTRATION), with the department\'s technicians listed beneath each header."\n\n'
            'The word that matters is "collapsible".'),
        'steps': (
            '1. Open Schedule in Week view. Count the rows in the grid — there were 30 in our run.\n'
            '2. Click the department heading "WORK ORDER STATUS". Count the rows again. Still 30, '
            'and nothing on screen has changed.\n'
            '3. Repeat on the headings "SERVICE/PARTS" and "SERVICE". Nothing happens on either.\n'
            '4. Switch to Day view and repeat all three. Nothing happens there either.\n'
            '5. Rest the mouse on any heading: the pointer stays an ordinary arrow, and there is no '
            'chevron or triangle to click.'),
        'cases': [29929],
        'owed': (
            'SCREENSHOTS: NONE EXIST for this one. What was recorded is a written measurement — the '
            'row counts before and after each click. Before filing you will need to take and annotate '
            'a picture yourself: the grid with a box round a department heading, captioned "clicking '
            'here does nothing".\n\n'
            'DUPLICATE SEARCH: not run. Please search Jira first and record what you searched for.'),
        'against': (
            'A developer could fairly say the FUNCTION of hiding a department already exists, just '
            'somewhere else: the "Filter & display" menu has Service / Work order status / '
            'Service/Parts switches, and turning "Service" off did take the grid from 30 rows down '
            'to 9. So the ability is there. The argument back is that the description says the '
            'HEADINGS are collapsible, and no one reading "click a department group header" would '
            'recognise a menu in the toolbar as the same thing. Worth mentioning both in the ticket '
            'so nobody thinks it was missed.'),
        'record': 'build/schedule/finish2-2026-08-12/DIVERGENCES.md, section A1',
    },
    {
        'name': 'The Tech Hours switch turns on but shows nothing',
        'seen': (
            'Turning on "Tech Hours" in the View options menu changes nothing on screen. No working '
            'hours appear beside any technician\'s name. The technician rows are identical before '
            'and after, letter for letter.\n\n'
            'The switch itself works — it moves when you click it. It is what it is supposed to '
            'display that never arrives.'),
        'expected': (
            'With Tech Hours turned on, each technician\'s working hours should be displayed next to '
            'their name in the row heading, and the hours shown should match the hours set up '
            'against that technician.'),
        'source': (
            'The Schedule product description on Confluence, version 27, read on 11 August 2026, '
            'section 9, in the table of View options. Quoted word for word:\n\n'
            '"Tech Hours | Off | Displays each technician\'s working hours next to their name."'),
        'steps': (
            '1. First check the set-up is right, or the empty result would be correct. Go to '
            'Settings then Staff, and open a few technicians. In our run six were opened — Admin '
            'ShopView, Alicia Campbell, Anthony Mejia, Ayesha Khan, Benjamin Peters and Bilal '
            'Muzamil — and ALL SIX had "Set working hours for this technician" switched on, with '
            '7:00 AM to 7:00 PM Monday to Friday.\n'
            '2. Open Schedule. Note what the technician row headings say.\n'
            '3. Open the "View options" menu and turn "Tech Hours" on.\n'
            '4. Look at the technician row headings again. They are unchanged. No hours appear '
            'anywhere near any name.'),
        'cases': [30050],
        'owed': (
            'SCREENSHOTS: NONE EXIST for this one. What was recorded is a written before-and-after '
            'comparison of the row headings. Before filing, take a picture of the View options menu '
            'with Tech Hours ON and the technician rows visible in the same shot, and annotate it.\n\n'
            'DUPLICATE SEARCH: not run. Please search Jira first and record what you searched for.'),
        'against': (
            'The obvious one — "no technician has any hours set up, so there is nothing to show" — '
            'was checked and ruled out; step 1 is that check, and it is worth repeating yourself so '
            'you can say so on the ticket. The other obvious one — "the click never landed" — was '
            'also ruled out: the very same menu, driven the very same way, moved three other '
            'switches on the same visit ("Show Saturday" took the columns from 7 to 6, "VIN Number" '
            'made VINs appear on 27 blocks, and the "Service" switch took the grid from 30 rows to '
            '9). Three switches worked; this one did not.'),
        'record': 'build/schedule/finish2-2026-08-12/DIVERGENCES.md, section A2',
    },
    {
        'name': 'The filter panel has no Priority section',
        'seen': (
            'The filter panel in the left work-order panel has no Priority section, and no High, '
            'Medium or Low to choose. It also has no headings at all — the choices are one flat '
            'list.\n\n'
            'The whole text of the panel reads: "FILTERS · Clear all · Unassigned 22 · Assigned 71 · '
            'Approved 92 · Declined 0 · In Progress 0 · Ready for Review 1". That is all of it. It '
            'was read on three separate visits, so it is not something scrolled out of sight.'),
        'expected': (
            'The filter panel should offer three named groups: Assignment (Assigned, Unassigned), '
            'Status (the work order statuses), and Priority (High, Medium, Low).'),
        'source': (
            'The Schedule product description on Confluence, version 27, read on 11 August 2026, '
            'section 5.1, in the table of filter groups. Quoted word for word:\n\n'
            '"Filter group / Options — Assignment: Assigned, Unassigned. Status: All work order '
            'statuses currently supported in the app. Priority: High, Medium, Low."'),
        'steps': (
            '1. Open Schedule.\n'
            '2. In the left work-order panel, open the filter control.\n'
            '3. Read everything in the panel. There is no "Priority" anywhere, and no High, Medium '
            'or Low to choose. There are no group headings either — Assignment and Status choices '
            'are mixed into one flat list.'),
        'cases': [29942, 29945],
        'owed': (
            'SCREENSHOTS: one picture exists (saved with the day\'s work as "c-29942.png") but it is '
            'NOT marked up. Before filing, annotate it — a box round the whole panel with the '
            'caption "no Priority group, no headings" is enough.\n\n'
            'DUPLICATE SEARCH: not run. Please search Jira first and record what you searched for.'),
        'against': (
            'A developer could say Priority does not exist anywhere in the product yet, so a filter '
            'for it could not have been built — and that is probably true: a separate test '
            '(C38871) records that the work order form has no Priority field either. If you raise '
            'this, "the Priority feature is not built" is the more accurate way to put it, and it '
            'covers the missing group headings too, which is a genuinely separate and smaller point.'),
        'record': 'build/schedule/finish-2026-08-12/DIVERGENCES.md, section E1',
    },
    {
        'name': 'There is no Unassigned row in the grid',
        'seen': (
            'The grid has no Unassigned row. It shows 30 rows: three department headings ("WORK '
            'ORDER STATUS", "SERVICE/PARTS", "SERVICE") and 27 technician rows. None of them is '
            'named Unassigned, and the word "unassigned" does not appear anywhere on the page.\n\n'
            'So there is nowhere to drop a work order to create a shift with no technician, and '
            'nothing to drag one out of.'),
        'expected': (
            'An Unassigned row should sit inside the grid itself — not in a separate tray at the '
            'side — holding shifts that are not yet tied to a technician. Dragging a shift from that '
            'row down onto a technician should assign it.'),
        'source': (
            'The Schedule product description on Confluence, version 27, read on 11 August 2026. It '
            'says this in two places.\n\n'
            'Section 3.2, quoted word for word: "Unassigned placeholder. An unassigned row sits '
            'within the grid (not a separate tray) and holds shifts that are not yet tied to a '
            'technician. Dragging a shift from this row down onto a technician assigns it."\n\n'
            'Section 4.2, quoted word for word: "Unassigned shifts are created by dropping a work '
            'order (or line) onto the grid\'s Unassigned placeholder row (an in-grid lane, not a '
            'separate tray)."'),
        'steps': (
            '1. Open Schedule in Week view, on a week that contains shifts with no technician. In '
            'our run the grid showed "Aug 10 - 16, 2026" and there were shifts with no technician '
            'inside it — against work orders S-13014 and S-12876, on 10, 11 and 13 August.\n'
            '2. Read every row name down the left-hand side. There are 30. Three are department '
            'headings; the other 27 are technicians. None is called Unassigned.\n'
            '3. Search the page for the word "unassigned". It does not appear.'),
        'cases': [29931, 29973, 29974, 29975],
        'owed': (
            'SCREENSHOTS: a full-page picture exists (saved with the day\'s work as '
            '"unassigned.png") but it is NOT marked up. Before filing, annotate it — the row names '
            'down the left with a caption saying which row should have been there.\n\n'
            'DUPLICATE SEARCH: not run. Please search Jira first and record what you searched for.'),
        'against': (
            'The three obvious ones were checked and ruled out already, and saying so on the ticket '
            'is what will stop it being closed: (1) "the row is empty so it is hidden" — no, there '
            'were shifts with no technician on the board at the time, 13 of them; (2) "a switch in '
            'the toolbar is hiding it" — no, both toolbar menus were opened and read in full and '
            'neither mentions unassigned; (3) "it is below the fold" — no, the row names were read '
            'from the whole page, not just the visible part, and a full-page picture was taken.'),
        'record': 'build/schedule/finish3-2026-08-12/DIVERGENCES.md, section 1',
    },
    {
        'name': 'The hover summary hides the VIN unless a display switch is on',
        'seen': (
            'Rest the mouse on a shift and a small summary appears. Its second line shows the unit '
            'number only — for example "G30".\n\n'
            'Turn the "VIN Number" switch on in the View options menu and rest the mouse on the same '
            'shift again: now it reads "G30 - VIN 12-06696".\n\n'
            'So the VIN in the hover summary is tied to that display switch.'),
        'expected': (
            'The hover summary should show the VIN whenever the unit has one, whichever way the "VIN '
            'Number" switch is set. That switch is meant to control the shift blocks in the grid, '
            'not the hover summary.'),
        'source': (
            'The product owner (Branko) answered this directly on 31 July 2026, question 6, choosing '
            'option A. Quoted word for word:\n\n'
            '"A. Vin is always visible on hover regardless of the toggle"\n\n'
            'The Schedule product description, version 27, section 4.13, agrees with him — it lists '
            'what the hover summary shows with no condition attached: "Shift tooltip: customer name '
            '(plus the conflict icon if conflicted); unit, vehicle, and VIN; date and time range".'),
        'steps': (
            '1. Open Schedule and make sure the "VIN Number" switch in the View options menu is '
            'OFF.\n'
            '2. Rest the mouse on a shift whose unit has a VIN. In our run this was unit G30, VIN '
            '12-06696.\n'
            '3. Read the second line of the summary that appears: it says "G30" and no VIN.\n'
            '4. Now turn the "VIN Number" switch ON.\n'
            '5. Rest the mouse on the same shift again. The second line now reads "G30 - VIN '
            '12-06696".'),
        'cases': [30034],
        'owed': (
            'PLEASE DO NOT FILE THIS ONE WITHOUT ASKING FIRST — see the column to the left. It is '
            'the one item on this sheet where a ticket would land in the middle of a disagreement '
            'that has not been settled.\n\n'
            'SCREENSHOTS: none marked up. Two would be needed, the same shift with the switch off '
            'and on.\n\n'
            'DUPLICATE SEARCH: partly done — SV-8835 is known and is named opposite.'),
        'against': (
            'This is the strongest counter-argument on the whole sheet, and it is why this row says '
            'ask before filing.\n\n'
            'First, the product description contradicts itself. Section 4.13 lists the VIN in the '
            'hover summary with no condition, but the View options table in section 9 says the '
            'switch "Shows the VIN number as an additional line on shift blocks (day and week views) '
            'and in hover tooltips" — which puts the hover summary UNDER the switch, exactly as the '
            'build behaves.\n\n'
            'Second, and more awkward: a ticket already exists saying the OPPOSITE of this — SV-8835 '
            'argues the hover summary SHOULD hide the VIN when the switch is off. So filing this '
            'would put two tickets on the same screen asking for opposite things.\n\n'
            'What actually needs to happen is that the product owner fixes the section 9 wording so '
            'it matches his own answer. That is a question, not a defect ticket.'),
        'record': 'build/schedule/verify-final-2026-08-12/FINDINGS.md, section 1 · '
                  'build/schedule/provenance-2026-08-04/PO-RULING-DEFENCE.md, A-ii',
    },
]

SCHEDULE_TICKETS = [
    {
        'key': 'SV-9090',
        'says': ('Raised on 10 August: when you spread a job across several days, it always starts '
                 'on the day you dropped it on, and there is no way to choose a different start '
                 'day.\n\nThe ticket is CLOSED, marked obsolete.'),
        'actual': ('It still happens. There is no start-date control anywhere in the spread '
                   'window.\n\nBefore saying that, all five choices in the "How much to schedule" '
                   'list were opened in turn — including the two that reveal an extra control — '
                   'because a field that only shows under one option would otherwise look missing. '
                   '"Until a date..." reveals a field called "Finish by" and "Specific hours..." '
                   'reveals an hours stepper. Both of those set the END, not the start.'),
        'cases': [29982],
        'suggest': ('Reopen it — or reopen SV-8855 instead, but not both: they are the same fault '
                    'reported twice. A person needs to decide which one survives. We have not '
                    'touched either.'),
    },
    {
        'key': 'SV-8855',
        'says': ('Raised on 4 August, by us: the same fault as SV-9090 above — the spread always '
                 'begins on the day you dropped on.\n\nThe ticket is CLOSED, marked obsolete.'),
        'actual': ('It still happens — same evidence as the row above. Both tickets describe one '
                   'fault, and both are closed while the fault is live.'),
        'cases': [29982],
        'suggest': ('The same decision as the row above. Our suggestion is to reopen ONE of SV-9090 '
                    'and SV-8855 and to link the other to it as a duplicate.'),
    },
    {
        'key': 'SV-8957',
        'says': ('The alternative to dragging — a control on the work-order card that arms it so '
                 'you can place it with a click instead of a drag — was removed.\n\nThe ticket is '
                 'CLOSED, marked obsolete.'),
        'actual': ('It is still gone. Looked for in three ways — when the page loads, when the '
                   'mouse rests on the card, and inside the card\'s expanded line list — in a state '
                   'where it must appear (21 work orders on screen, approved lines, editing rights '
                   'held). It is not there in any of them.\n\nThis matters more than it sounds: it '
                   'is the only way to place a job for anyone who cannot drag with a mouse.'),
        'cases': [29962],
        'suggest': ('Reopen it. The test itself is already honest — it tells the tester exactly what '
                    'they will see and that the ticket was closed without a fix — so nothing is '
                    'blocked either way. This is a tidiness and truthfulness call.'),
    },
    {
        'key': 'SV-9005',
        'says': ('The "Finish by" control in the spread window may not respond at all — pressing '
                 'its arrows does nothing to the date or the preview.\n\nThe ticket is OPEN.'),
        'actual': ('It is fixed. This is the opposite case to the three above, and worth knowing '
                   'before somebody spends time on it.\n\nThe control responds fully in both '
                   'directions and the preview follows it: from "Tue, Aug 11 / 1 shift", five '
                   'presses forward gave "Sun, Aug 16 / 4 shifts", five more gave "Fri, Aug 21 / '
                   '9 shifts", and three presses back gave "Tue, Aug 18".'),
        'cases': [29980],
        'suggest': ('Close it. The test has already been corrected so it no longer tells a tester to '
                    'expect a dead control — if the ticket stays open, somebody will eventually put '
                    'that expectation back and the test will start failing a working build.'),
    },
]

# =============================================================== FILTERS
FILTERS_DEFECTS = [
    {
        'name': 'When nothing matches, there is no way to clear just the search',
        'seen': (
            'Put a filter on AND type something in the page search box so that nothing matches. The '
            'table is replaced by the message "No work orders match your filters".\n\n'
            'Two things are wrong with that screen.\n\n'
            'First, the message blames the filters only. It never mentions the search — not even '
            'when the search is the ONLY thing narrowing the list.\n\n'
            'Second, the only thing it offers you is a "Clear Filters" link. There is no offer to '
            'clear just the search.'),
        'expected': (
            'The message should mention BOTH the filters and the search, not the filters alone.\n\n'
            'And because a search is active, the screen should offer a way to clear the filters AND '
            'a separate way to clear the search, so that each can be undone on its own — clearing '
            'the filters should leave your typed word in place, and clearing the search should leave '
            'the filters in place.'),
        'source': (
            'The Filters product description on Confluence, version 19, read on 11 August 2026. Two '
            'requirements.\n\n'
            'Quoted word for word: "The empty state includes a prompt or link to clear filters."\n\n'
            'And, quoted word for word: "Where both a query and filters are active, each is cleared '
            'independently from the empty state. Clearing filters does not clear the query and '
            'clearing the query does not clear the filters."'),
        'steps': (
            '1. Open Work Orders on the All tab.\n'
            '2. Turn on any Status filter — Approved is fine.\n'
            '3. Type a word into the page Search box that matches nothing. We used '
            '"zzzznomatchqqq".\n'
            '4. The table empties and the message reads "No work orders match your filters". Read '
            'it: it does not mention the search at all.\n'
            '5. Look at what the message offers you. There is one link, "Clear Filters". There is '
            'nothing offering to clear the search.\n'
            '6. Now take the filter off and leave only the search. The message is word for word the '
            'same — still blaming the filters.'),
        'cases': [38897],
        'owed': (
            'SCREENSHOTS: two pictures exist and are saved with the day\'s work '
            '("empty-state-filter-plus-search.png" and "empty-state-search-only.png"), but they are '
            'NOT marked up. Before filing, annotate one — a box round the message and the single '
            '"Clear Filters" link, captioned "no way to clear the search".\n\n'
            'DUPLICATE SEARCH: not run. Please search Jira first and record what you searched for.\n\n'
            'RE-CHECK IT FIRST: this was seen on build v3.6-3e9dd6d, and the Filters branch was '
            'rebuilt at 12:09 today. It takes two minutes to confirm on the build you are on.'),
        'against': (
            'This one has a real counter-argument and you should get in front of it. The search box '
            'itself has its own little clear (x) control, and that control IS present on this '
            'screen — it was recorded as present. So a developer can say "the search can be cleared, '
            'just not from the message." The answer back is that the requirement says each is '
            'cleared independently FROM THE EMPTY STATE, and the message is the empty state. Say '
            'both things in the ticket; it will not survive if you only say the first.'),
        'record': 'build/filters/finish-2026-08-12/DIVERGENCES.md, section 2',
    },
]

FILTERS_TICKETS = [
    {
        'key': 'SV-8875',
        'says': ('On a phone, tapping a choice inside a single filter\'s own sheet applies it '
                 'straight away instead of waiting for you to press "Apply Filters".\n\nThe ticket '
                 'is OPEN, and two of our tests point at it and tell the tester to expect a '
                 'failure.'),
        'actual': ('Part of it may already be fixed, and the evidence is your own colleague\'s test '
                   'run from today.\n\nOne of the two tests, C29625, was marked PASSED in the test '
                   'run this morning by Ahtasham Amjad — while the test itself still says "expect '
                   'this to fail". The other one, C29624, was marked Failed on the same run, which '
                   'is what the ticket predicts.\n\nWe did NOT re-check this ourselves and we made '
                   'no Jira call, so this is a signal, not a verdict.'),
        'cases': [29624, 29625],
        'suggest': ('Somebody should check C29625 on a phone once. If it really passes now, the '
                    'ticket has been part-fixed and the note on that test needs taking off, or the '
                    'next person to run it will report a working screen as broken. This is exactly '
                    'the case the test itself asks you to report: "if it PASSES, the fix has '
                    'shipped, tell the QA lead."'),
    },
]

# =============================================================== REPORT SUITE
REPORT_DEFECTS = [
    {
        'name': 'The Location column cannot be turned on, on five of the six reports',
        'seen': (
            'On five of the six reports the Location column only appears if you have ALL locations '
            'chosen. Pick a single location and it vanishes. And it is never in the column list, so '
            'you cannot turn it on or off yourself.\n\n'
            'Measured today on all six reports, with one location chosen and then with all of them:\n\n'
            '- Work In Progress: absent with one, present with all, NEVER in the column list\n'
            '- Sales By Customer: the same\n'
            '- Technician Utilization: the same\n'
            '- Sales By Representative: the same\n'
            '- Parts Velocity: the same\n'
            '- Inventory Value: present either way, and IS in the column list — this is the only one '
            'that behaves correctly\n\n'
            'On Work In Progress the column list has 15 entries and Location is not one of them, '
            'both before and after switching to all locations.'),
        'expected': (
            'The Location column should be offered in the column list to anybody who can REACH more '
            'than one location — whatever they currently have chosen. For that person it should be '
            'shown by default and they should be able to switch it on and off. Somebody who can '
            'reach only one location should never see it.\n\n'
            'The test is what the person can reach, not what they have picked.'),
        'source': (
            'The Work In Progress product description on Confluence, and the same rule in the Sales '
            'By Customer and Technician Utilization descriptions, all amended on 5 to 6 August '
            '2026 and read on 12 August 2026. Quoted word for word:\n\n'
            '"The Location column is offered in the column selector to any user with access to more '
            'than one location; for that user it is shown by default and can be toggled on or off. '
            'A user with access to only one location never sees it."'),
        'steps': (
            '1. Sign in as a user who can reach more than one location. The account used could reach '
            'five: "QB Location", "3rd", "L\'Espace Tralala Yoga", "Staging Heavy Duty - 9919" and '
            '"Staging Lethbridge - 4310".\n'
            '2. Open Work In Progress. The location filter reads a single location — "Staging Heavy '
            'Duty - 9919". Read the column headings: WO #, Status, Customer, Asset, Advisor, Days '
            'Open, Earned, Remaining, Total. There is no Location column.\n'
            '3. Open the column list. It has 15 entries and Location is not one of them, so there is '
            'nothing to switch on.\n'
            '4. Change the location filter to "All locations". A Location column now appears in the '
            'table, between Asset and Advisor.\n'
            '5. Open the column list again. Location is STILL not in it — the column appeared '
            'without you being able to control it.\n'
            '6. Repeat on Sales By Customer, Technician Utilization, Sales By Representative and '
            'Parts Velocity — all four behave the same way.\n'
            '7. Repeat on Inventory Value. This one is correct: the column is there either way, and '
            'it IS in the column list.'),
        'cases': [38912, 38913, 43551, 30467],
        'owed': (
            'READ THIS FIRST: a ticket already exists for part of this — SV-8954 — but it describes '
            'Technician Utilization ONLY, and it was closed as obsolete on 9 August. So this is not '
            'a clean new report. The tidiest thing is probably to REOPEN SV-8954 and widen it to all '
            'five reports rather than raise a second ticket beside it; see tab 3.\n\n'
            'SCREENSHOTS: pictures of all six reports exist and are saved with the day\'s work, but '
            'they are NOT marked up. Before filing, annotate two side by side — the column list with '
            'no Location in it, and the table showing a Location column anyway.\n\n'
            'DUPLICATE SEARCH: only SV-8954 was found and it is named above. Please run a proper '
            'search before filing and record what you searched for.'),
        'against': (
            'The weakest point is not the finding, it is the paperwork: a developer can reasonably '
            'say "this is already reported and it was closed", so a brand-new ticket will look like '
            'a duplicate. That is why reopening and widening the existing one is the better route. '
            'On the substance itself there is no good argument the other way — the wording is plain, '
            'it was changed deliberately on 5 to 6 August, and one of the six reports already does '
            'exactly what it asks for, which shows it is buildable.'),
        'record': 'build/report-suite/verify-final-2026-08-12/DIVERGENCES.md, section 2',
    },
]

REPORT_TICKETS = [
    {
        'key': '57 tickets at once',
        'link': None,
        'says': ('This row is not about one ticket. On 9 August, between 22:40:38 and 22:42:46 — a '
                 'window of two minutes and eight seconds, with tickets closing about two seconds '
                 'apart — 57 defect tickets were all set to closed/obsolete.\n\nThat is a bulk '
                 'close, not one-by-one checking.'),
        'actual': ('It matters to you because 75 of the Report Suite tests carry a note saying "this '
                   'test is expected to fail today, here is the ticket that explains why" — and for '
                   'those 75 tests the ticket now reads Done. Open one tomorrow morning and you '
                   'would reasonably conclude the test should now pass.\n\nTwo of the 57 were '
                   'actually checked on the build:\n\n'
                   '- SV-8954, the Location column: STILL BROKEN, and on five reports rather than '
                   'the one the ticket names. See tab 2.\n'
                   '- SV-8907, Work In Progress downloads: GENUINELY FIXED. Eight downloads out of '
                   'eight worked.\n\n'
                   'So one closed ticket is fixed and another is not. The status tells you '
                   'nothing.'),
        'cases': [],
        'suggest': ('This is a question for the QA lead, not something to act on: were those 57 '
                    'closed because the work was done, or because the list was being tidied before '
                    'release? The answer changes what you should do with 75 tests. Nobody has '
                    'changed any of those 75 notes — changing them because a ticket says Done would '
                    'be exactly the mistake this row is warning about.\n\nIn the meantime: run each '
                    'test as written. The test tells you what to expect and what to do if you see '
                    'something different.'),
    },
    {
        'key': 'SV-8954',
        'says': ('The Technician Utilization Location column disappears when a single location is '
                 'chosen.\n\nThe ticket is CLOSED, marked obsolete — one of the 57 above.'),
        'actual': ('It still happens, and it is worse than the ticket says. The ticket names '
                   'Technician Utilization only; it is actually on FIVE of the six reports. Only '
                   'Inventory Value behaves correctly. Re-proved today on all six — the full detail '
                   'is on tab 2.'),
        'cases': [38912, 38913, 43551, 30467],
        'suggest': ('Reopen it and widen it from one report to five, rather than raising a new '
                    'ticket beside it. A person has to decide that; we have not touched it.'),
    },
    {
        'key': 'SV-8907',
        'says': ('Work In Progress downloads fail with a server error on any tab that has rows in '
                 'it.'),
        'actual': ('It is FIXED. Proven by 8 downloads out of 8: all four Work In Progress tabs '
                   '(with 15, 3, 4 and 15 rows in them — every one a tab WITH rows, which is exactly '
                   'the state the ticket says must fail), each in both formats. Every one produced a '
                   'real file, all eight files were different sizes, and the product showed '
                   '"Success - Data exported successfully."\n\n'
                   'HONEST NOTE ON ITS STATUS: our own two records from today disagree about whether '
                   'this ticket is still open or was closed on 9 August. We made no Jira call at '
                   'all, so we cannot settle it — please just open the ticket and look. Either way '
                   'the build behaviour above is what was measured.'),
        'cases': [30510, 30511, 30512, 30513, 30514, 30515, 30518],
        'suggest': ('If it is still open, close it. The seven tests listed here have already been '
                    'corrected so they no longer tell a tester to expect a failure — if the ticket '
                    'stays open, somebody will eventually re-add that expectation and the tests will '
                    'start failing a working build.'),
    },
]

# ------------------------------------------------- cases marked runnable but are not
# Live-derived this pass: these carry AUTOMATION: READY but our own committed records
# say they cannot be run. The correcting write was prepared and never executed.
REPORT_MISMARKED = [
    {'id': 30107, 'title': 'Product Type multi-select: both toggles on by default',
     'why': ('The steps send you to a "Product Type" filter with two toggles, "Parts" and '
             '"Services", and rows reading "All products" and "Clear all". The build still has the '
             'older single-choice filter with "Parts & Service", "Parts only" and "Service only". '
             'There is nothing to toggle. The change was accepted on 10 August (SV-9074) and has '
             'not been built yet.')},
    {'id': 43591, 'title': 'Clear all leaves neither Product Type toggle on',
     'why': ('Same reason as the row above — it asks you to read two action rows at the top of the '
             'Product Type list, and there are no action rows.')},
    {'id': 38913, 'title': 'Location column: shown to any multi-location user; toggleable',
     'why': ('It asserts a Location column you can switch on and off, which five of the six reports '
             'do not offer — see tab 2. Its two sister tests (C38912 and C43551) are already marked '
             'as "cannot be run yet"; this one was left marked runnable by mistake.')},
]


def build():
    out = {}
    for p in PROJECTS:
        c = CENSUS[p]
        h = holds_for(p)
        res = RESULTS[p]
        graded = {k: v for k, v in res.items() if v['status'] != 'Untested'}
        out[p] = {
            'project': p,
            'read_at': READ_AT,
            'build': BUILD[p],
            'env': ENV[p],
            'run': c['run'],
            'ours': c['ours'],
            'foreign': c['foreign'],
            'ready': c['ready'],
            'expect_fail': c['expect_fail'],
            'hold': c['hold'],
            'holds': h,
            'n_hold': len(h),
            'n_passed_on_hold': sum(1 for x in h if x['result'] == 'Passed'),
            'n_graded_run': len(graded),
            'run_passed': sum(1 for v in graded.values() if v['status'] == 'Passed'),
            'run_failed': sum(1 for v in graded.values() if v['status'] == 'Failed'),
            'defects': {'Schedule': SCHEDULE_DEFECTS, 'Filters': FILTERS_DEFECTS,
                        'Report Suite': REPORT_DEFECTS}[p],
            'tickets': {'Schedule': SCHEDULE_TICKETS, 'Filters': FILTERS_TICKETS,
                        'Report Suite': REPORT_TICKETS}[p],
            'mismarked': REPORT_MISMARKED if p == 'Report Suite' else [],
        }
        # gate must close both ways or the payload is not shipped
        assert c['ready'] + c['expect_fail'] == c['ours'] - c['hold'], p
        assert len(h) == c['hold'], p
    return out


if __name__ == '__main__':
    d = build()
    json.dump(d, open(os.path.join(HERE, 'data.json'), 'w'), indent=1)
    for p in PROJECTS:
        x = d[p]
        groups = {}
        for r in x['holds']:
            groups[r['group']] = groups.get(r['group'], 0) + 1
        print(f"{p:14} ours={x['ours']:4} foreign={x['foreign']:3} runnable={x['ready']+x['expect_fail']:4} "
              f"hold={x['n_hold']:3} passed-on-hold={x['n_passed_on_hold']:2} "
              f"defects={len(x['defects'])} tickets={len(x['tickets'])}")
        for g, n in sorted(groups.items(), key=lambda kv: GROUP_ORDER.index(kv[0])):
            print(f"{'':16}{n:3}  {g}")
