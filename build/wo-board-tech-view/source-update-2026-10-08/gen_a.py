#!/usr/bin/env python3
"""Worker A — WO Board & Tech View full rewrite, Stories 1-3 (sections 13236/13237/13238), 8 Oct 2026.
Writes proposals-A-S1-S3.json. Quotes are copied programmatically from the PRD / tech-plan files (never retyped).
Read-only: no TestRail, no git, no build sign-in."""
import json, re, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "sources")
PRD_PATH = os.path.join(SRC, "CONFLUENCE-845185030-WO-BoardView-TechView-PRD-v33-edited-2026-10-07.md")
TP_PATH = os.path.join(SRC, "Tech-Plan-Kanban-Tech-View-Display-Options-2026-10-08-upload.md")
OUT = os.path.join(HERE, "proposals-A-S1-S3.json")
PRD = open(PRD_PATH, encoding="utf-8").read()
TP = open(TP_PATH, encoding="utf-8").read()
PRD_NB = PRD.replace("**", "")
TP_NB = TP.replace("**", "")
ws = lambda s: re.sub(r"\s+", " ", s).strip()

def A(anchor):
    """Verbatim PRD requirement text for an anchor (bold markers dropped, quote marks kept)."""
    for line in PRD.splitlines():
        m = re.match(r"^\s*(?:-\s*)?\*\*(" + re.escape(anchor) + r"):\*\*\s*(.*)$", line.strip())
        if m:
            return [anchor, ws(m.group(2).replace("**", ""))]
    raise SystemExit("anchor not found: " + anchor)

def span(text, start, end):
    i = text.index(start); j = text.index(end, i) + len(end)
    return ws(text[i:j])

def P(label, start, end):  # PRD sentence that is not a numbered anchor
    return [label, span(PRD_NB, start, end)]

def T(label, start, end):  # tech-plan sentence
    return ["Tech plan " + label, span(TP_NB, start, end)]

MARK = "AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build"
STORY = {1: "SV-10044 (Story 1, Switch between display options)",
         2: "SV-10045 (Story 2, Tech View — table grouped by lead technician)",
         3: "SV-10046 (Story 3, Board View — board by lead technician)"}

def SOURCE(story, anchors, extra=""):
    s = (f"Epic SV-10043; story {STORY[story]}; PRD Confluence 845185030, edited 7 Oct 2026 (status line \"PRD v33\"), "
         f"{', '.join(anchors)}, read 8 Oct 2026.")
    return s + (" " + extra if extra else "")

DESIGN = "Design: Claude Design export of 8 Oct 2026 (Work Orders.dc.html), {}; on-screen labels only."

# ---------------------------------------------------------------- shared precondition blocks
def base(edit=False):
    perm = "Work Orders view and Work Orders create and edit" if edit else "Work Orders view"
    return [
        f"Sign in to the build under test as a user whose role has {perm} (check in Settings > Roles & Permissions > open your role > Work Orders section). The Admin role has both.",
        "Use a desktop browser with the window at least 1024 pixels wide (full screen on an ordinary laptop or monitor). Below that width the page shows only List.",
        "In the top bar, choose the location you will test in (e.g. \"Heavy Duty\"). Create everything below in this location.",
    ]

def techs(names="\"Esther Howard\", \"Ralph Edwards\" and \"Jenny Wilson\""):
    return [
        f"Make sure the location has the technicians this case uses (e.g. {names}). A person only counts as a technician here when the staff record is Active, Clockable is on, the role is neither Office nor Time Clock User, and they are enrolled at this location. To add one:",
        "↳ Settings > Staff > add a staff member > enter the first and last name (e.g. Esther Howard), role Technician, Clockable on, Active, enrolled at this location > Save.",
    ]

def wos(example="e.g. S1-702 led by Esther Howard, S1-691 led by Ralph Edwards, S1-352 with no lead", cust=None):
    c = (f"the customer \"{cust}\" (add it with the Add button in the customer box if it does not exist; using it keeps this test's work orders apart from others at the location)"
         if cust else "a customer (e.g. \"Fibridge Commercial\")")
    return [
        f"Create the work orders this case uses and set their lead technician ({example}):",
        f"↳ Work Orders > New Work Order > choose {c} and an asset (e.g. unit TRK-118, 2022 Freightliner M2) > Create. Write down the number the build gives the work order (the numbers in this case are examples).",
        "↳ On the work order page set Lead Technician (e.g. Esther Howard) and save. Leave Lead Technician empty on the ones that should sit in Unassigned.",
    ]

VIEWONLY = [
    "Create a second user who can view but not change work orders:",
    "↳ Settings > Roles & Permissions > Create custom role (e.g. \"ZZAUTOTEST WO view only\") > turn on Work Orders view, leave Work Orders create and edit off > Save.",
    "↳ Settings > Staff > add a staff member with an email you can open (e.g. \"ZZAUTOTEST Viewer\"), role = the new role, enrolled at this location > Save, then accept the invitation and set a password.",
    "↳ Keep this user signed in in a second browser (or a private window) so you can switch between the two users.",
]

NOSHIFT = "Make sure the work orders you will drag have no shift on the Schedule for their lead technician (Schedule > check the technician's row). If a \"Clear … scheduled shifts?\" prompt appears anyway, click Keep shifts."

TECH_SW = "In the display switcher at the right of the toolbar, click Tech View (in the design its tooltip reads \"By Lead Tech\")."
BOARD_SW = "In the display switcher at the right of the toolbar, click Board View (in the design its tooltip reads \"Board\")."
LIST_SW = "In the display switcher, click List (in the design its tooltip reads \"Table\")."
ALL_TAB = "Click the All tab on the left of the toolbar."
def SEARCHZ(c): return f"Click Search and type {c} so only this test's work orders show."

updates, new, notes, retire = [], [], [], []

def SRC_FOR(story, quotes, extra_src):
    prd = [q[0] for q in quotes if not q[0].startswith("Tech plan")]
    tp = [q[0][len("Tech plan "):] for q in quotes if q[0].startswith("Tech plan")]
    ex = extra_src
    if tp:
        ex = (f"Tech plan revised 24 Sep 2026 (uploaded 8 Oct 2026), section {', '.join(tp)}. " + ex).strip()
    return SOURCE(story, prd, ex)

def U(cid, title, pre, steps, results, story, quotes, extra_src, summary):
    updates.append(dict(case_id=cid, title=title, preconds=pre, steps=steps, results=results,
                        source=SRC_FOR(story, quotes, extra_src),
                        quotes=quotes, marker=MARK, change_summary=summary))

def N(key, section, title, pre, steps, results, story, quotes, extra_src, why):
    new.append(dict(key=key, section_id=section, title=title, preconds=pre, steps=steps, results=results,
                    source=SRC_FOR(story, quotes, extra_src),
                    quotes=quotes, marker=MARK, why=why))

# ============================================================== STORY 1 — section 13236
U(96909, "Display switcher offers List, Tech View and Board View and marks the active one",
  base() + techs("\"Esther Howard\"") + wos("e.g. S1-702 led by Esther Howard, S1-352 with no lead"),
  ["Open Work Orders from the top navigation.", ALL_TAB,
   "Look at the display switcher at the right of the toolbar and hover each of its buttons.",
   "Write down the label or tooltip of each button and which one is highlighted.",
   TECH_SW, "Look at which switcher button is highlighted now.",
   BOARD_SW, "Look at which switcher button is highlighted now.", LIST_SW],
  ["The switcher offers exactly three display options: List, Tech View and Board View.",
   "Only the option you are viewing is highlighted: List at the start, Tech View after step 5, Board View after step 7, List again after step 9.",
   "Write down the words you see on each button or tooltip. The design's tooltips read \"Table\", \"By Lead Tech\" and \"Board\". A different label alone is not a fail (the wording is an open product question), but a missing option or no highlight is."],
  1, [A("S1-R1"), A("S1-R9")], DESIGN.format("toolbar view switch (aria-label \"View\")"),
  "Full rewrite: real click-path per option, active-state check after each switch, label difference called out.")

U(96910, "A user who never chose a display sees List",
  base() + techs("\"Esther Howard\"") + wos("e.g. S1-702 led by Esther Howard") + [
   "Create a brand-new user who has never opened Work Orders:",
   "↳ Settings > Staff > add a staff member with an email you can open (e.g. \"ZZAUTOTEST New Dispatcher\"), a role with Work Orders view (e.g. Service Advisor), enrolled at this location > Save. Accept the invitation and set a password."],
  ["Sign out.", "Sign in as the new user.", "Open Work Orders from the top navigation.",
   "Look at the work orders area and the display switcher.", "Refresh the page.", "Look at the display again."],
  ["The page opens in List: the ordinary work order table, not grouped by technician and not shown as columns of cards.",
   "In the display switcher the List option is the highlighted one.",
   "After the refresh the page is still in List."],
  1, [A("S1-R2"), P("Key Decisions", "Default display option remains List.", "until they choose otherwise.")], "",
  "Full rewrite: new-user creation steps added, refresh check added, Key Decisions quote added.")

U(96911, "Switching display keeps the same tab, search, filters and work orders",
  base() + techs() + wos("e.g. three work orders for the customer \"ZZAUTOTEST Fibridge\" led by Esther Howard, Ralph Edwards and nobody, plus one for \"ZZAUTOTEST Fisquare\""),
  ["Open Work Orders.", ALL_TAB,
   "Click Search and type ZZAUTOTEST Fibridge.",
   "Open the Status filter, tick the status your test work orders have (e.g. Estimate) and close the filter.",
   "In List, write down every work order number shown (e.g. S1-702, S1-691, S1-352: 3 rows).",
   TECH_SW, "Write down the work order numbers shown and each group header count.",
   BOARD_SW, "Write down the work order numbers on the cards and each column header count.", LIST_SW],
  ["The layout changes straight away on each click, without a page reload.",
   "After every switch the All tab is still selected, the search box still reads ZZAUTOTEST Fibridge and the Status filter still shows the status you ticked.",
   "The same work orders appear in all three displays. With the example data: List shows 3 rows, Tech View shows the same 3 (Unassigned 1 + Esther Howard 1 + Ralph Edwards 1 = 3) and Board View shows the same 3 cards. The ZZAUTOTEST Fisquare work order appears in none of them."],
  1, [A("S1-R3"), P("Feature Overview", "The existing filter views", "apply the same way in every display option.")], "",
  "Full rewrite: concrete search + status filter, counts written out per display.")

U(96912, "The chosen display follows the user to new sign-ins, devices and locations",
  base() + techs("\"Esther Howard\"") + wos("e.g. S1-702 led by Esther Howard") + [
   "Make sure your user is enrolled at a second location (Settings > Staff > open your staff record > add the second location, e.g. \"Trucks Hill 2\" > Save).",
   "Have a second browser (or another computer) available.",
   "Have a second user with Work Orders view who has never changed the display (e.g. a Service Advisor). Add one in Settings > Staff if needed."],
  ["Open Work Orders.", BOARD_SW, "Sign out, then sign in again as the same user.", "Open Work Orders and note the display.",
   "In the second browser, sign in as the same user and open Work Orders. Note the display.",
   "In the top bar switch to the second location (e.g. Trucks Hill 2) and open Work Orders. Note the display.",
   "Sign out and sign in as the second user. Open Work Orders and note the display."],
  ["After signing in again, Work Orders opens in Board View.",
   "In the second browser, Work Orders opens in Board View.",
   "At the second location, Work Orders opens in Board View.",
   "The second user still sees List: the choice was saved for your user only."],
  1, [A("S1-R4")], "Review Decisions Confluence 853901313, DR-6 (display option persists across locations).",
  "Full rewrite: sign-out, second device, second location and second user each a separate step.")

U(96913, "The four tabs All, Work Orders, Estimates, Completed work in every display",
  base(edit=True) + techs("\"Esther Howard\"") + wos("e.g. S1-352 led by Esther Howard") + [
   "Put three of your work orders in different statuses (open each one and change its status with the status control on the work order page):",
   "↳ one left in Estimate (e.g. S1-352), one moved to Approved (e.g. S1-702), one moved to Complete (e.g. S1-689). All three led by Esther Howard."],
  ["Open Work Orders and stay in List.", "Click each tab in turn: All, Work Orders, Estimates, Completed. For each tab write down which of your three work orders appear.",
   TECH_SW, "Click each tab in turn again and write down which of your three work orders appear under Esther Howard.",
   BOARD_SW, "Click each tab in turn again and write down which of your three work orders appear in Esther Howard's column."],
  ["All four tabs (All, Work Orders, Estimates, Completed) are shown in every display.",
   "Each tab shows the same work orders in List, Tech View and Board View. With the example data: All shows 3 (S1-352, S1-702, S1-689), Work Orders shows S1-702, Estimates shows S1-352, Completed shows S1-689.",
   "This case does not check which tab opens first: the default tab was taken out of scope and stays as production has it today."],
  1, [P("Feature Overview", "The existing filter views", "apply the same way in every display option."),
      P("Key Decisions", "Permissions. Work Orders view permits viewing all four filter tabs", "reordering technician groups/columns.")],
  "PO decision Chris Ward, PRD footer comment 25 Sep 2026 (\"The default-tab change is out too\"). Review Decisions 853901313 DR-33.",
  "Full rewrite: three seeded statuses compared tab by tab across all displays; default-tab claim dropped (out of scope since 25 Sep).")

U(96914, "Search, filters and saved filters give the same results in all three displays",
  base() + techs() + wos("e.g. S1-702 for unit TRK-118 led by Esther Howard, S1-691 for unit TRL-904 led by Ralph Edwards, S1-352 for unit TRL-903 with no lead"),
  ["Open Work Orders.", ALL_TAB, "In List, click Search and type a unit number (e.g. TRK-118).",
   "Write down the work orders shown (e.g. S1-702 only).", TECH_SW, "Write down the work orders shown.",
   BOARD_SW, "Write down the work orders shown.",
   "Clear the search, then turn on Asset on site = Yes (or another filter your work orders differ on) and repeat steps 4 to 7.",
   "Leave the filter on, open Schedule from the top navigation, then click Work Orders in the top navigation.",
   "Note whether the filter is still applied, then do the same round trip once more while in List."],
  ["The same work orders appear in List, Tech View and Board View for the same search (example: S1-702 only, 1 result in each).",
   "The same work orders appear in all three displays for the same filter.",
   "Coming back from Schedule, the filter is kept or cleared in Tech View and Board View exactly as it is in List."],
  1, [A("S1-R11")], "Tech plan section 3 (\"One filter implementation\": List and board share one criteria object).",
  "Full rewrite: real search/filter values, three-display comparison, filter persistence round trip compared with List.")

U(96915, "Going back to List uses the List sort you chose, never the dragged order",
  base(edit=True) + techs("\"Esther Howard\"") + wos("e.g. S1-702, S1-698 and S1-644 all led by Esther Howard, created on different days") + [NOSHIFT],
  ["Open Work Orders.", ALL_TAB, "In List, click the Created on column header to sort by created date (click again if needed so the newest is first).",
   "Write down the order of your three work orders in List (e.g. S1-702, S1-698, S1-644).", TECH_SW,
   "Under Esther Howard, drag the last of your three work orders to the top of the group and let go.",
   BOARD_SW, "Look at Esther Howard's column.", LIST_SW, "Read the List order and the sort indicator on the Created on column."],
  ["In Tech View and Board View, Esther Howard's work orders show your dragged order (the moved work order first).",
   "Back in List the table is still sorted by Created on, in the same direction you chose (e.g. S1-702, S1-698, S1-644), and the sort indicator is still on Created on.",
   "The dragged order does not appear in List."],
  1, [A("S1-R7")], "",
  "Full rewrite: real sort click, drag in Tech View, return to List with expected order written out.")

U(96916, "Browser Back restores the scroll position in Tech View and Board View",
  base() + techs("at least 8 technicians, e.g. \"Esther Howard\", \"Ralph Edwards\", \"Jenny Wilson\", \"Theresa Webb\", \"Kristin Watson\", \"Brenda Martinez\", \"Cameron Williamson\", \"Floyd Miles\"") +
  wos("about 20 work orders led by Esther Howard and a few for each other technician, so the board is wider than the window and Esther's column and the Tech View table are taller than the window"),
  ["Open Work Orders.", ALL_TAB, BOARD_SW,
   "Scroll the board to the right until a technician near the end (e.g. Floyd Miles) is at the left edge after Unassigned.",
   "Scroll down inside one long column (e.g. Esther Howard's) until a card well below the first screen is at the top. Write down the technicians and cards in view.",
   "Click a card that is in view to open the work order.", "Press the browser Back button.", "Compare what is in view with your notes.",
   TECH_SW, "Scroll down the table until a row well below the first screen is at the top, and scroll right if the table is wider than the window. Write down the rows and columns in view.",
   "Click a row to open the work order.", "Press the browser Back button.", "Compare what is in view with your notes."],
  ["Board View comes back with the same technicians in view (horizontal position) and the same cards at the top of the long column (vertical position) as before you opened the work order.",
   "Tech View comes back with the same rows at the top and the same columns in view as before you opened the work order.",
   "List is not checked here: it keeps today's behaviour."],
  1, [A("S1-R8")], "Review Decisions 853901313 FF-3 / DR-6.",
  "Full rewrite: data volume to force both scroll directions, separate Board View and Tech View passes.")

U(96917, "Opening a tab or coming from another page starts at the top-left",
  base() + techs("at least 8 technicians (as in the scroll test)") + wos("about 20 work orders led by one technician (e.g. Esther Howard) so the board and table scroll both ways"),
  ["Open Work Orders.", ALL_TAB, BOARD_SW, "Scroll the board right and scroll down inside a long column.",
   "Click the Estimates tab, then click the All tab.", "Note where the board is scrolled to.",
   "Scroll right and down again.", "Click Schedule in the top navigation, then click Work Orders in the top navigation.", "Note where the board is scrolled to.",
   "Scroll right and down again.", "While still on Board View, click Work Orders in the top navigation.", "Note where the board is scrolled to.",
   TECH_SW, "Repeat steps 4 to 12 in Tech View (scroll down and right in the table)."],
  ["After clicking a tab the board starts at the top and all the way to the left: Unassigned and the first technicians are in view and every column starts at its first card.",
   "Coming back from Schedule through the Work Orders link it also starts at the top-left.",
   "Clicking Work Orders in the top navigation while already on Board View does not leave the page, so the board keeps exactly the scroll position you had.",
   "Tech View behaves the same way: top-left after a tab click or coming from another page, unchanged after clicking Work Orders while already on Tech View."],
  1, [A("S1-R12")], "PO decision Chris Ward, PRD footer comment 6 Oct 2026, item 6 (header click keeps the place).",
  "Rewritten for the changed requirement: header-link click on the same page now keeps the scroll position; tab click and arrival from another page start top-left.")

U(96918, "No-match search shows 'No work orders match your filters' in every display",
  base() + techs() + wos(),
  ["Open Work Orders.", ALL_TAB, "In List, click Search and type text no work order contains (e.g. ZZNOMATCH123).",
   "Read the message and buttons in the work orders area.", TECH_SW, "Read the message and buttons.",
   BOARD_SW, "Read the message and buttons.", "Click Clear filters."],
  ["List, Tech View and Board View each show the message \"No work orders match your filters\" with a Clear filters action.",
   "Tech View and Board View show that one message for the whole page, not a list of empty technician groups or columns.",
   "Clicking Clear filters removes the search and the work orders come back.",
   "The design shows \"No work orders match these filters\" and \"Clear all filters\": that wording is a fail against the specification, write down what you see."],
  1, [A("S1-N1"), T("6 Phase 8", "a filter matching nothing shows the shared empty state rather than a screen of empty groups", "(S1-N1)")],
  "PRD section 9 User Feedback Summary.",
  "Full rewrite: exact empty text asserted per display, Clear filters action exercised, design wording difference flagged.")

U(96919, "If the saved display cannot be read, the page opens in List",
  base() + techs("\"Esther Howard\"") + wos("e.g. S1-702 led by Esther Howard"),
  ["Open Work Orders.", BOARD_SW, "Refresh the page.", "Note the display.",
   "This case's main check needs the saved display setting to be unreadable, which a manual tester cannot cause. Do steps 1 to 4 only."],
  ["Control check: after the refresh the page opens in Board View, because the choice was saved.",
   "When the saved setting cannot be read, the page opens in List. This part cannot be checked by hand: write \"not checked by hand\" in the result comment and pass or fail on the control check."],
  1, [A("S1-N2")], "Review Decisions 853901313 DR-23.",
  "Full rewrite: removed the 'force the preference read to fail' step a tester cannot do, kept a control check, marked the untestable part plainly.")

U(96920, "A display change that cannot be saved keeps the old choice and allows a retry",
  base() + techs("\"Esther Howard\"") + wos("e.g. S1-702 led by Esther Howard") + [
   "Be able to turn your computer's network connection off and on (e.g. Wi-Fi off)."],
  ["Open Work Orders.", BOARD_SW, "Refresh the page and check it opens in Board View.",
   "Turn your network connection off.", TECH_SW, "Note whether the display switched.", LIST_SW,
   "Turn the network connection back on and refresh the page.", "Note the display.",
   TECH_SW, "Refresh the page and note the display."],
  ["With the network off, the switcher still changes the display when clicked (the work orders themselves may fail to load while offline, that is not part of this check).",
   "After reconnecting and refreshing, the page opens in Board View: the changes made while offline were not saved, so the earlier choice was kept.",
   "Switching again while online works and is saved: after the last refresh the page opens in Tech View."],
  1, [A("S1-N3"), A("S1-N4")], "Review Decisions 853901313 DR-23.",
  "Full rewrite: replaced 'force the save to fail' with a manual network-off method a tester can do.")

U(96921, "With the same user in two tabs, the last display change wins",
  base() + techs("\"Esther Howard\"") + wos("e.g. S1-702 led by Esther Howard"),
  ["Open Work Orders in browser tab A.", "Open Work Orders in browser tab B (same user).",
   "In tab A, " + TECH_SW[0].lower() + TECH_SW[1:], "A few seconds later, in tab B, " + BOARD_SW[0].lower() + BOARD_SW[1:],
   "Refresh tab A.", "Refresh tab B.", "Open Work Orders in a new tab C."],
  ["After refreshing, tab A, tab B and the new tab C all open in Board View, the last choice made.",
   "No warning or conflict message appears in either tab."],
  1, [A("S1-N5")], "Review Decisions 853901313 DR-23.",
  "Full rewrite: three-tab check with the expected display written out.")

U(96923, "Changing location resets the Work Orders page as it does today",
  base() + techs("\"Esther Howard\" (and the same at the second location)") + wos("e.g. S1-702 led by Esther Howard") + [
   "Make sure your user is enrolled at a second location (Settings > Staff > open your staff record > add the location, e.g. \"Trucks Hill 2\" > Save) and that it has at least one work order.",
   "Before testing, note what List does today when you change location: in List, turn on Assigned to me, change location in the top bar, and write down which page and tab you land on and whether Assigned to me is still on. Change back."],
  ["Open Work Orders.", BOARD_SW, "Turn on Assigned to me.", "In the top bar, change to the second location (e.g. Trucks Hill 2).",
   "Note which page and tab open, the display, and whether Assigned to me is on.", TECH_SW, "Turn on Assigned to me.",
   "Change back to the first location and note the same three things."],
  ["Changing location opens the same page and tab that List opens today when you change location (your note from the preconditions).",
   "Assigned to me is turned off after each location change, as it is in List today.",
   "The display you chose is kept: Board View after the first change, Tech View after the second."],
  1, [A("S1-E2"), A("S1-E3")], "Review Decisions 853901313 FF-3 / DR-6.",
  "Full rewrite: production baseline captured first, both directions of location change, display persistence observed.")

U(154884, "Assigned to me shows the same matching work orders in every display",
  base() + techs("\"Esther Howard\", \"Ralph Edwards\" and yourself") + wos("e.g. S1-702 and S1-644 led by you, S1-691 led by Ralph Edwards, S1-352 with no lead") + [
   "To make yourself a lead technician: Settings > Staff > open your own staff record > Clockable on, Active, enrolled at this location > Save."],
  ["Open Work Orders.", ALL_TAB, "In List, turn on Assigned to me.", "Write down every work order shown (e.g. S1-702 and S1-644: 2 rows).",
   TECH_SW, "Write down every work order shown and the groups they are in.", BOARD_SW, "Write down every card shown and the columns they are in."],
  ["Tech View and Board View show exactly the work orders List shows with Assigned to me on (example: S1-702 and S1-644, 2 in each display) and no others.",
   "S1-691 (Ralph Edwards) and S1-352 (no lead) do not appear in any display."],
  1, [A("S1-R13")], "",
  "Full rewrite: user made a lead, List used as the baseline, counts compared across displays.")

U(154885, "Tech View and Board View are offered only at 1024 pixels wide or more",
  base() + techs("\"Esther Howard\"") + wos("e.g. S1-702 led by Esther Howard") + [
   "Know your screen width (e.g. a 1280 x 800 laptop: a full-screen window is 1280 pixels wide, a window snapped to half the screen is 640). A tablet that can be held sideways is optional."],
  ["Open Work Orders full screen.", BOARD_SW, "Make the window clearly narrower than 1024 pixels (e.g. snap it to half the screen).",
   "Look at the work orders area and the toolbar.", "Make the window full screen again.", "Note the display.",
   "Optional: open Work Orders on a tablet held sideways (1024 pixels or wider) and look at the toolbar."],
  ["In the narrow window the page shows List exactly as it does today (the phone card layout) and there is no display switcher.",
   "Back at full width the switcher is offered again and the page is in Board View: the narrow window did not change your saved choice.",
   "On a sideways tablet of 1024 pixels or wider, Tech View and Board View are offered, the same as on a desktop.",
   "The exact 1024-pixel edge cannot be measured by hand: check clearly below and clearly above it and write \"edge not checked by hand\" in the result comment."],
  1, [A("S1-R14"), T("3.18", "below the desktop breakpoint the mobile List renders", "nothing overwrites the user's desktop choice.")],
  "Review Decisions 853901313 DR-34.",
  "Full rewrite: practical width method, saved choice survives a narrow window (tech plan), tablet optional, edge check marked.")

# ============================================================== STORY 2 — section 13237
U(96924, "Tech View groups work orders under each lead with name, avatar and count",
  base() + techs() + wos("e.g. 3 led by Esther Howard (S1-702 Approved, S1-644 Approved, S1-455 Estimate), 2 led by Ralph Edwards, 1 with no lead", cust="ZZAUTOTEST Grouping"),
  ["Open Work Orders.", ALL_TAB, SEARCHZ("ZZAUTOTEST Grouping"), TECH_SW, "Look at how the table is divided.", "Read the header of Esther Howard's group: name, picture or initials, and number.",
   "Count the rows under Esther Howard.", "Open the Status filter, tick Approved only and close it.", "Read Esther Howard's header number and count her rows again."],
  ["The table is split into groups, one per lead technician, with a visible separator line between groups.",
   "Each group header shows the technician's name, their avatar (photo or initials) and a number.",
   "The number equals the rows listed under it. Example: Esther Howard shows 3 with 3 rows (S1-702, S1-644, S1-455), Ralph Edwards shows 2 with 2 rows.",
   "After filtering to Approved, Esther Howard's number becomes 2 and 2 rows are listed (S1-702, S1-644): 3 - 1 Estimate = 2."],
  2, [A("S2-R1"), A("S2-R12")], DESIGN.format("By Lead Tech group header (count tooltip \"N work orders\")"),
  "Full rewrite: count arithmetic before and after a filter, header parts listed.")

U(96925, "Unassigned is always the first group in Tech View",
  base() + techs() + wos("e.g. S1-352 and S1-355 with no lead, others led by Esther Howard and Ralph Edwards", cust="ZZAUTOTEST Unassigned First"),
  ["Open Work Orders.", ALL_TAB, SEARCHZ("ZZAUTOTEST Unassigned First"), TECH_SW, "Look at which group is at the top of the table and what it contains.",
   "Drag the Esther Howard group by its header handle (tooltip \"Drag to reorder technicians\") above the Unassigned group and let go.",
   "Look at which group is at the top again."],
  ["The first group is Unassigned, before every technician group, and it holds exactly your work orders with no lead (e.g. S1-352 and S1-355).",
   "After the drag, Unassigned is still first: Esther Howard's group lands after it, never above it."],
  2, [A("S2-R2")], DESIGN.format("By Lead Tech, Unassigned group and drag handle"),
  "Full rewrite: contents of Unassigned checked, attempt to move a group above it added.")

U(96926, "Technician groups start in first-name, last-name order",
  base() + [
   "Use a user who has never reordered the technician groups (the order is saved per user). A newly created user is safest (Settings > Staff > add a staff member with an email you can open, role with Work Orders view).",
   "Add these technicians in this order (Settings > Staff > add staff member, role Technician, Clockable on, Active, enrolled at this location > Save):",
   "↳ \"Aaron Zed\", then \"Aaron Baker\", then \"Brenda Martinez\", then \"Chris Lee\" (first), then a second \"Chris Lee\" (second, different email).",
   "Create one work order led by each technician so you can tell the two Chris Lees apart (e.g. S1-801 led by the first Chris Lee, S1-802 led by the second). Do not pin anyone."],
  ["Sign in as the user from the first precondition.", "Open Work Orders.", ALL_TAB, TECH_SW, "Read the group headers from top to bottom.",
   "For the two Chris Lee groups, note which work order each contains.", BOARD_SW, "Read the column headers from left to right."],
  ["Unassigned is first. Your five technicians then appear in this relative order: Aaron Baker, Aaron Zed, Brenda Martinez, Chris Lee, Chris Lee (first name A-Z, then last name A-Z). Other technicians at the location fit in alphabetically between them.",
   "The first Chris Lee group is the one created first (holding S1-801) and the second holds S1-802: oldest account first, newest last.",
   "Board View columns follow the same order.",
   "The design's sample shows Brenda Martinez first: that is a sample only, the order above is what passes."],
  2, [A("S2-R3")], "PRD footer comment Chris Ward 25 Sep 2026 (tie-break uses the user account creation date). Review Decisions 853901313 DR-5.",
  "Full rewrite: named technicians created in a known order, duplicate names told apart by their work orders.")

U(96927, "Tech View offers List's columns plus Assigned Techs in its own Columns menu",
  base() + techs("\"Esther Howard\"") + wos("e.g. S1-702 led by Esther Howard"),
  ["Open Work Orders.", "In List, click the Columns button (tooltip \"Columns\") and write down every column name in the menu.",
   "Close the menu.", TECH_SW, "Click the Columns button and write down every column name.",
   "Turn on Assigned Techs if it is off and close the menu."],
  ["Tech View has its own Columns button that opens a column menu.",
   "Every column offered in List's menu is also offered in Tech View's menu, and Tech View's menu also offers Assigned Techs.",
   "List's menu does not offer Assigned Techs.",
   "After turning it on, an Assigned Techs column shows in the Tech View table.",
   "The design's Tech View menu offers 10 columns and leaves out some List columns (e.g. VIN/Serial #, On Site, Lead Technician): if the build matches the design rather than List, it is a fail, write down the missing columns."],
  2, [A("S2-R4")], DESIGN.format("Columns menu in Table and By Lead Tech"),
  "Full rewrite: column-by-column comparison of the two menus, design difference spelled out.")

U(96928, "Collapsed technician groups stay collapsed after refresh, new tab and sign-in",
  base() + techs() + wos("e.g. at least one work order for each of Esther Howard, Ralph Edwards and Jenny Wilson"),
  ["Open Work Orders.", ALL_TAB, TECH_SW, "Click the collapse arrow (tooltip \"Collapse\") on Ralph Edwards' group header.",
   "Check Esther Howard's and Jenny Wilson's groups are expanded.", "Refresh the page.", "Open Work Orders in a new browser tab.",
   "Close all Work Orders tabs, then open Work Orders again.", "Sign out, sign in again and open Work Orders in Tech View.",
   "Click the expand arrow (tooltip \"Expand\") on Ralph Edwards' group."],
  ["Clicking the arrow collapses Ralph Edwards' group to its header only (rows hidden, header and count still shown).",
   "After the refresh, in the new tab, after reopening and after signing in again, Ralph Edwards' group is still collapsed and the other groups are still expanded.",
   "Clicking the arrow again expands the group and shows its rows."],
  2, [A("S2-R5"), A("S2-R13")], "Review Decisions 853901313 SQ-9 / DR-27.",
  "Full rewrite: each persistence path is its own step.")

U(96929, "Before anyone reorders them, a group's work orders follow List's default sort",
  base() + techs("a technician nobody at this location has reordered work for, e.g. a new \"Kristin Watson\"") +
  wos("three led by Kristin Watson for customers \"Zeta Hauling\", \"Alpha Freight\" and \"Mid Trucking\", created in that order") + [
   "Use a user who has never saved a sort in List (e.g. a newly created user), so List shows its default sort."],
  ["Open Work Orders.", ALL_TAB, "In List, note the order of the three Kristin Watson work orders.", TECH_SW,
   "Read the order of the rows in Kristin Watson's group.", BOARD_SW, "Read the order of the cards in Kristin Watson's column."],
  ["In Tech View the rows are in List's default order: Alpha Freight, Mid Trucking, Zeta Hauling (customer name A-Z), the same order List shows.",
   "Board View shows the same order.",
   "The design's sample puts In progress first, then newest created: that is a sample only, the List order is what passes."],
  2, [A("S2-R6")], "Review Decisions 853901313 DR-45 (desktop List default sort is customer name A-Z, ties by work order number).",
  "Full rewrite: three customers named so the expected order can be written out.")

U(96930, "Only staff who can lead work orders get a technician group",
  base() + [
   "Create these staff at this location (Settings > Staff > add staff member > Save), none of them leading any work order:",
   "↳ \"Esther Howard\": role Technician, Clockable on, Active, enrolled here (should show).",
   "↳ \"Billy Nobill\": like Esther but Billable off (should show).",
   "↳ \"Ina Active\": like Esther, then set the staff record inactive (should not show).",
   "↳ \"Nick Noclock\": like Esther but Clockable off (should not show).",
   "↳ \"Olive Office\": like Esther but role Office (should not show).",
   "↳ \"Tim Clockuser\": like Esther but role Time Clock User (should not show).",
   "↳ \"Ella Elsewhere\": like Esther but enrolled only at another location (should not show)."],
  ["Open Work Orders.", ALL_TAB, TECH_SW, "Read every technician group header.", BOARD_SW, "Read every column header."],
  ["Esther Howard and Billy Nobill each have a group in Tech View and a column in Board View, even with no work orders.",
   "Ina Active, Nick Noclock, Olive Office, Tim Clockuser and Ella Elsewhere have no group and no column."],
  2, [A("S2-R7"), P("Terminology", "A staff member who meets all four criteria", "Billable is not a criterion.")], "Review Decisions 853901313 FF-1 / DR-4.",
  "Full rewrite: one seeded staff member per eligibility rule, Billable-off case added.")

U(96931, "Empty technician groups and an empty Unassigned show 'No work orders'",
  base() + techs() + wos("e.g. S1-702 led by Esther Howard, S1-691 led by Ralph Edwards, S1-352 with no lead, nothing led by Jenny Wilson"),
  ["Open Work Orders.", ALL_TAB, TECH_SW, "Find Jenny Wilson's group and read what it shows.",
   "Click Search and type the number of the work order led by Esther Howard (e.g. S1-702).", "Read what Ralph Edwards' group, Jenny Wilson's group and Unassigned show."],
  ["Jenny Wilson has a group even though she leads no work orders, and it shows the text \"No work orders\".",
   "With the search on, Esther Howard's group lists S1-702, and Ralph Edwards' group, Jenny Wilson's group and Unassigned each show \"No work orders\".",
   "The design shows \"No work orders assigned\": that wording is a fail against the specification, write down what you see."],
  2, [A("S2-R14"), A("S2-R15")], "Review Decisions 853901313 DR-40. PRD inline comment Chris Ward 25 Sep 2026 (empty groups read \"No work orders\").",
  "Full rewrite: empty technician and empty Unassigned produced by a search, exact text asserted.")

U(96932, "Clicking a Tech View row opens the work order, a tiny mouse slip does not drag",
  base(edit=True) + techs("\"Esther Howard\"") + wos("e.g. S1-702 led by Esther Howard"),
  ["Open Work Orders.", TECH_SW, "Click on the customer name in the S1-702 row.", "Press the browser Back button.",
   "Click on an empty part of the same row (e.g. between the Lines and Created on cells).", "Press the browser Back button.",
   "Press the mouse button on the row, move the pointer by one or two pixels, and release.", "Press the browser Back button.",
   "Hover the row and click its more-actions button (three dots) if it shows one.", "Press Escape.",
   "Press the mouse button on the row and move the pointer well away (a few centimetres) before releasing it back in place."],
  ["Clicking anywhere on the row (customer name or empty space) opens work order S1-702.",
   "A press with a tiny movement still opens the work order and does not start a drag.",
   "Clicking the row's own more-actions button opens its menu and does not open the work order.",
   "Only a clear movement of the pointer starts a drag (the row lifts and follows the pointer)."],
  2, [A("S2-R8")], "Review Decisions 853901313 SQ-10 / DR-39.",
  "Full rewrite: several click targets, tiny-move versus real-drag check, own-control exception.")

U(96933, "An empty Unassigned group stays in Tech View and accepts a dropped work order",
  base(edit=True) + techs("\"Esther Howard\"") + wos("e.g. S1-702 and S1-644 led by Esther Howard and no work order without a lead (give any unassigned one a lead first)", cust="ZZAUTOTEST Empty Unassigned") + [NOSHIFT],
  ["Open Work Orders.", ALL_TAB, SEARCHZ("ZZAUTOTEST Empty Unassigned"), "Make sure Assigned to me is off.", TECH_SW, "Read the Unassigned group.",
   "Drag S1-644 from Esther Howard's group onto the Unassigned group and let go.", "Read the Unassigned group and Esther Howard's count."],
  ["With no unassigned work, the Unassigned group is still on screen, first, showing \"No work orders\".",
   "S1-644 can be dropped on it: it now sits in Unassigned (Unassigned 1) and Esther Howard's count drops from 2 to 1.",
   "When Assigned to me is on, or when nothing matches the filters, Unassigned follows those rules instead (checked in other cases)."],
  2, [A("S2-N1")], "",
  "Full rewrite: Unassigned emptied by seeding, drop exercised with counts.")

U(96934, "Work led by a deactivated technician stays visible under an inactive header",
  base(edit=True) + techs() + wos("e.g. S1-691 and S1-578 led by Ralph Edwards"),
  ["Deactivate Ralph Edwards: Settings > Staff > open Ralph Edwards > set the staff record inactive > Save.",
   "Open Work Orders.", ALL_TAB, TECH_SW, "Find Ralph Edwards' group and read its header and rows."],
  ["Ralph Edwards' group is still shown with his work orders (S1-691 and S1-578, count 2).",
   "His group header is marked as inactive (an inactive label or indicator). Write down how it is shown.",
   "Afterwards, set Ralph Edwards active again to restore the data."],
  2, [A("S2-N2"), A("S2-N3"), P("Key Decisions", "Deactivating a technician does not change work orders they already lead.", "they simply receive no new assignments")], "",
  "Full rewrite: deactivation click-path, header indicator and kept work orders checked, restore step added.")

U(96935, "A tall group's header stays on screen while you scroll its rows",
  base() + techs("\"Esther Howard\" and \"Ralph Edwards\"") + wos("about 25 led by Esther Howard (more rows than fit on the screen) and a few led by Ralph Edwards"),
  ["Open Work Orders.", ALL_TAB, TECH_SW, "Scroll down slowly through Esther Howard's rows until her last row.", "Keep scrolling into Ralph Edwards' group."],
  ["While scrolling through Esther Howard's rows, her group header (name and count) stays visible at the top.",
   "Once you reach Ralph Edwards' group, his header takes its place at the top."],
  2, [A("S2-E1")], "",
  "Full rewrite: data volume stated, hand-over between groups observed.")

U(96936, "A lead changed elsewhere moves the work order to its new group on refresh",
  base(edit=True) + techs("\"Esther Howard\" and \"Ralph Edwards\"") + wos("e.g. S1-702, S1-644, S1-455 led by Esther Howard (3) and S1-691, S1-578 led by Ralph Edwards (2)", cust="ZZAUTOTEST Refresh"),
  ["Open Work Orders in browser tab A.", "In tab A, click the All tab.", "In tab A, c" + SEARCHZ("ZZAUTOTEST Refresh")[1:], "In tab A, " + TECH_SW[0].lower() + TECH_SW[1:],
   "In browser tab B, open work order S1-702 and change its Lead Technician to Ralph Edwards on the work order page. Save.",
   "Go back to tab A without refreshing and look at S1-702.", "Refresh tab A.", "Look at S1-702 and the two group counts."],
  ["Before the refresh, tab A may still show S1-702 under Esther Howard.",
   "After the refresh, S1-702 is under Ralph Edwards. Esther Howard shows 2 (3 - 1) and Ralph Edwards shows 3 (2 + 1)."],
  2, [A("S2-E2")], "",
  "Full rewrite: two-tab method, count arithmetic after refresh.")

U(96937, "Assigned to me shows only the groups that hold my work orders",
  base(edit=True) + techs("\"Esther Howard\", \"Ralph Edwards\", \"Jenny Wilson\" and yourself (make yourself a technician: Settings > Staff > your record > Clockable on, enrolled here)") +
  wos("e.g. S1-702 led by you, S1-691 led by Ralph Edwards, S1-352 with no lead, nothing for Esther Howard or Jenny Wilson") + [
   "On S1-352 (no lead) set the Service Advisor to yourself, so an unassigned work order is \"assigned to me\". If List with Assigned to me on does not show S1-352, instead assign yourself as the technician on one of its lines.",
   "In Tech View, pin Jenny Wilson (pin control on her group header) before you start."],
  ["Open Work Orders.", ALL_TAB, "In List, turn on Assigned to me and write down the work orders shown (e.g. S1-702 and S1-352).",
   TECH_SW, "Read every group shown and its rows.", "Turn Assigned to me off."],
  ["With Assigned to me on, Tech View shows only Unassigned (holding S1-352) and your own group (holding S1-702).",
   "Ralph Edwards, Esther Howard and the pinned Jenny Wilson are hidden, because none of their work orders match.",
   "Turning Assigned to me off brings every group back, with Jenny Wilson still pinned."],
  2, [A("S2-R9")], "Review Decisions 853901313 DR-42. PRD footer comment Branko Cicovic 28 Sep 2026 (no muted look).",
  "Full rewrite: Unassigned made to hold a match, pinned non-matching technician added, groups listed.")

U(96938, "Hovering a technician's header or avatar shows the technician's name",
  base() + techs("\"Esther Howard\" and a technician with a long name, e.g. \"Maximiliana Fitzgerald-Montgomery\"") + wos("one led by each"),
  ["Open Work Orders.", ALL_TAB, TECH_SW, "Hover the avatar (photo or initials) in Esther Howard's group header.",
   "Hover the name in the long-named technician's group header.", "Hover that technician's avatar."],
  ["Hovering the avatar shows the technician's full name (e.g. Esther Howard).",
   "Hovering the long-named header or its avatar shows the full name \"Maximiliana Fitzgerald-Montgomery\", even if the header text is shortened."],
  2, [A("S2-R10")], "",
  "Full rewrite: long name added so the hover adds information.")

U(96939, "Up to three technician groups can be pinned in Tech View",
  base() + techs("five technicians, e.g. \"Esther Howard\", \"Ralph Edwards\", \"Jenny Wilson\", \"Theresa Webb\", \"Kristin Watson\"") + wos("one led by each") + [
   "Start with no pins (unpin anyone pinned)."],
  ["Open Work Orders.", ALL_TAB, TECH_SW, "Click the pin control on Ralph Edwards' group header.", "Pin Theresa Webb.", "Pin Kristin Watson.",
   "Hover the pin control on Esther Howard's group header and try to click it."],
  ["Each technician group header has a pin control.",
   "Ralph Edwards, Theresa Webb and Kristin Watson can all be pinned (3 pins).",
   "A fourth pin is not possible: Esther Howard's pin control is disabled.",
   "The design shows pin controls only on Board View columns: if Tech View has no pin control at all, it is a fail."],
  2, [A("S2-R11")], DESIGN.format("Board pin control \"Pin column\""),
  "Full rewrite: five technicians, three pins, fourth refused.")

# ---- new Story 2 cases
N("NEW-A-01", 13237, "A collapsed group stays collapsed when a search finds work inside it",
  base() + techs("\"Esther Howard\" and \"Ralph Edwards\"") + wos("e.g. S1-702 for customer \"Fibridge Commercial\" and S1-644 for \"Fisquare Farms\", both led by Esther Howard"),
  ["Open Work Orders.", ALL_TAB, TECH_SW, "Collapse Esther Howard's group (arrow on her header).",
   "Click Search and type Fibridge.", "Read Esther Howard's group header and whether any of her rows show.",
   "Expand Esther Howard's group."],
  ["During the search Esther Howard's group stays collapsed: it does not open by itself.",
   "Its header count shows how many of her work orders match: 1 (S1-702 only).",
   "Expanding it shows the 1 matching row, S1-702.",
   "The design opens every group that has a match while searching: if the build does that, it is a fail."],
  2, [A("S2-R16")], "PRD footer comment Slavcho Mitrov 2 Oct 2026 item 1, folded into the 7 Oct PRD. " + DESIGN.format("By Lead Tech search behaviour"),
  "S2-R16 (new requirement)")

N("NEW-A-02", 13237, "Pinned groups sit after Unassigned in Tech View, newest pin last",
  base() + techs("four technicians, e.g. \"Esther Howard\", \"Jenny Wilson\", \"Kristin Watson\", \"Ralph Edwards\"") + wos("one led by each, and one with no lead", cust="ZZAUTOTEST Pin Order") + [
   "Start with no pins and no saved technician order (use a new user if unsure)."],
  ["Open Work Orders.", ALL_TAB, SEARCHZ("ZZAUTOTEST Pin Order"), TECH_SW, "Write down the group order.", "Pin Kristin Watson.", "Write down the group order.",
   "Pin Esther Howard.", "Write down the group order.", BOARD_SW, "Read the column order."],
  ["Read the order of your four test technicians only (others at the location may sit between them). At the start: Unassigned, Esther Howard, Jenny Wilson, Kristin Watson, Ralph Edwards.",
   "After pinning Kristin Watson she is right after Unassigned, before every unpinned technician: Unassigned, Kristin Watson, Esther Howard, Jenny Wilson, Ralph Edwards.",
   "After pinning Esther Howard: Unassigned, Kristin Watson, Esther Howard, Jenny Wilson, Ralph Edwards (the new pin goes after the existing pin, not by name).",
   "Board View shows the same order."],
  2, [A("S2-R17"), A("S3-R15"), A("S3-R16")], "PRD footer comment Slavcho Mitrov 2 Oct 2026 item 2, folded into the 7 Oct PRD.",
  "S2-R17 (new requirement)")

N("NEW-A-03", 13237, "Unassigned opens expanded, keeps its header in view and loads as you scroll",
  base() + techs("\"Esther Howard\"") + [
   "Use a location whose All tab holds several hundred work orders with no lead technician (long-running test locations usually do: check in List with the All tab). The board loads every row at once when about 300 or fewer match, so paging only shows above that.",
   "Make sure Unassigned has not been collapsed by this user (if it was, expand it once)."],
  ["Open Work Orders.", ALL_TAB, TECH_SW, "Look at the Unassigned group.",
   "Scroll down through the Unassigned rows for a while.", "Look at the top of the screen while scrolling.",
   "Keep scrolling to the end of Unassigned, watching what happens when you reach the last loaded rows.",
   "Collapse Unassigned using the arrow on its header while you are deep inside the group."],
  ["Unassigned opens expanded.",
   "Its header stays on screen while you scroll through its rows, so you can collapse it from anywhere: the collapse works without scrolling back up.",
   "Rows arrive in batches as you scroll (a short loading pause or more rows appearing at the end), not all at once on opening. The Unassigned count in the header matches the number of unassigned work orders List shows for the All tab.",
   "That rows are fetched in pages behind the scenes cannot be proven by hand: if no loading pause is visible, write \"paging not seen by hand\" in the result comment and pass or fail on the rest."],
  2, [A("S2-R18"), T("3.1", "One request returns every group with counts;", "25 cards per group vertically.")],
  "PRD footer comment Slavcho Mitrov 2 Oct 2026 item 6, folded into the 7 Oct PRD.",
  "S2-R18 (new requirement)")

N("NEW-A-04", 13237, "Tech View offers no pin control while Assigned to me is on",
  base() + techs("\"Esther Howard\", \"Ralph Edwards\" and yourself (Clockable on, enrolled here)") + wos("e.g. S1-702 led by you, S1-691 led by Ralph Edwards"),
  ["Open Work Orders.", ALL_TAB, TECH_SW, "Check the pin control shows on the group headers.", "Turn on Assigned to me.",
   "Look at the headers of every group still shown.", BOARD_SW, "Look at the column headers.", "Turn Assigned to me off."],
  ["With Assigned to me off, group headers show a pin control.",
   "With Assigned to me on, no group header in Tech View offers a pin control, the same as Board View.",
   "Turning Assigned to me off brings the pin controls back."],
  2, [A("S2-N4"), A("S3-N3")], "PRD footer comment Slavcho Mitrov 2 Oct 2026 item 3, folded into the 7 Oct PRD.",
  "S2-N4 (new requirement)")

N("NEW-A-05", 13237, "Tech View has no total price row at the bottom",
  base() + techs("\"Esther Howard\"") + wos("e.g. S1-702 ($8,412.30) and S1-644 ($7,240.55) led by Esther Howard, priced by adding a line"),
  ["Open Work Orders.", ALL_TAB, "In List, scroll to the bottom of the table and read the last row.", TECH_SW,
   "Make sure the Total price column is on (Columns menu).", "Scroll to the bottom of the table and look below the last group.",
   "Look below Esther Howard's group."],
  ["List still ends with its row totalling the price of the work orders shown, as it does today.",
   "Tech View has no total row: nothing after the last group or after any group adds up the prices."],
  2, [A("S2-N5")], "PRD footer comment Slavcho Mitrov 2 Oct 2026 item 4, folded into the 7 Oct PRD.",
  "S2-N5 (new requirement)")

N("NEW-A-07", 13237, "A location with no technicians shows only Unassigned in Tech View and Board View",
  base() + [
   "Create a location with no technicians: Settings > Locations > add a location (e.g. \"ZZAUTOTEST Empty Shop\") > Save, and enrol only your own user there (Settings > Staff > your record > add the location; make sure your own record is not Clockable, or use a role that is Office).",
   "In the top bar switch to the new location and create two work orders there (Work Orders > New Work Order), e.g. S1-901 and S1-902. They have no lead technician."],
  ["Open Work Orders.", ALL_TAB, TECH_SW, "Read what the page shows.", BOARD_SW, "Read what the page shows."],
  ["Tech View shows the Unassigned group holding S1-901 and S1-902 and no technician groups.",
   "Board View shows the Unassigned column holding S1-901 and S1-902 and no technician columns.",
   "Both displays explain that there are no technicians. The specification does not fix the wording: write down what you see (the design reads \"No technicians yet\" and \"Add technicians to assign work orders. Until then, every work order stays in Unassigned.\"). A different wording alone is not a fail."],
  2, [P("Design updates", "Filtered-empty results with Clear filters, and an organization with no technicians", "in both new views."), A("S2-R2"), A("S3-R1")],
  DESIGN.format("By Lead Tech empty state \"No technicians yet\"") + " PRD footer comment Slavcho Mitrov 1 Oct 2026 item 3 (panel explains work stays in Unassigned, no Add Technician button).",
  "Design coverage (Rule 115): the no-technicians state the PRD lists as a design item, with the design's state as reference")

# ============================================================== STORY 3 — section 13238
U(96940, "Board View has a column per technician plus Unassigned, counts match cards",
  base() + techs() + wos("e.g. 3 led by Esther Howard (2 Approved, 1 Estimate), 2 led by Ralph Edwards, none for Jenny Wilson, 2 with no lead", cust="ZZAUTOTEST Columns"),
  ["Open Work Orders.", ALL_TAB, SEARCHZ("ZZAUTOTEST Columns"), BOARD_SW, "Read every column header: name, avatar and number.", "Count the cards in each column.",
   "Open the Status filter, tick Approved only and close it.", "Read Esther Howard's number and count her cards again."],
  ["There is one column for each eligible technician (Esther Howard, Ralph Edwards, Jenny Wilson) plus an Unassigned column.",
   "Each header shows the name, the avatar (photo or initials) and a number equal to its cards: Unassigned 2, Esther Howard 3, Ralph Edwards 2, Jenny Wilson 0.",
   "After filtering to Approved, Esther Howard's header shows 2 and 2 cards are listed (3 - 1 Estimate = 2)."],
  3, [A("S3-R1"), A("S3-R12")], DESIGN.format("Board column header (count tooltip \"N work orders\")"),
  "Full rewrite: count arithmetic per column before and after a filter.")

U(96941, "The Unassigned column is first and stays put when scrolling sideways",
  base() + techs("at least 8 technicians so the board is wider than the window") + wos("a few with no lead and one for each technician"),
  ["Open Work Orders.", ALL_TAB, BOARD_SW, "Note the first column.", "Scroll the board all the way to the right (scroll bar, trackpad, or the column overview at the bottom right if shown).",
   "Look at the left edge of the board.", "Scroll back to the left."],
  ["Unassigned is the first column.",
   "While scrolling right, Unassigned stays fixed at the left edge and the technician columns slide past behind it, so Unassigned is always visible."],
  3, [A("S3-R2")], DESIGN.format("Board, sticky Unassigned column and \"Drag to scroll\" overview"),
  "Full rewrite: wide board seeded, sideways scroll observed.")

U(96942, "Column headers stay at the top while scrolling down a long column",
  base() + techs("\"Esther Howard\" and \"Ralph Edwards\"") + wos("about 20 led by Esther Howard (more cards than fit on the screen)"),
  ["Open Work Orders.", ALL_TAB, BOARD_SW, "Scroll down inside Esther Howard's column to her last card.", "Look at the top of her column and the other headers."],
  ["Esther Howard's header (name and count) stays at the top of her column the whole time.",
   "The other column headers also stay in view: you can always see whose column you are in."],
  3, [A("S3-R3")], "",
  "Full rewrite: long column seeded.")

U(96943, "Board View cards always show number, unit and status",
  base() + techs("\"Esther Howard\"") + wos("e.g. S1-702 with unit TRK-118 and S1-472 with an asset that has no unit number, both led by Esther Howard"),
  ["Open Work Orders.", ALL_TAB, BOARD_SW, "Open the Fields to display picker (same toolbar place as the Columns button in List and Tech View).",
   "Try to turn off work order number, unit number and status.", "Turn off every other field and close the picker.", "Read the S1-702 and S1-472 cards."],
  ["Work order number, unit number and status cannot be turned off in the picker.",
   "With every other field off, the S1-702 card still shows S1-702, TRK-118 and its status.",
   "The S1-472 card shows S1-472 and its status, and no unit number because it has none.",
   "The design has no Fields to display picker on Board View: if the build has none, it is a fail."],
  3, [A("S3-R4"), A("S5-R3")], DESIGN.format("Board toolbar (no Fields to display picker in the design)"),
  "Full rewrite: picker used to try to remove mandatory fields, missing-unit card added.")

U(96944, "A card's status badge always sits in the same spot",
  base(edit=True) + techs("\"Esther Howard\"") + wos("e.g. S1-702 (Approved, long customer name \"Fibridge Commercial Transport Services\"), S1-455 (Estimate, short name), S1-472 (no unit), all led by Esther Howard"),
  ["Open Work Orders.", ALL_TAB, BOARD_SW, "Look at where the status badge sits on each of the three cards.",
   "Change the density (Density control) to each available option and look again.", "Hover each card."],
  ["On every card the status badge is in the same place (in the design: top-right of the card, next to the number), whatever the customer name length or missing unit.",
   "It stays in that place at every density and while the card is hovered (the more-actions button appears as an overlay, it does not push the badge aside)."],
  3, [A("S3-R5"), P("Key Decisions", "More-actions appears as a hover overlay", "instead of floating.")], DESIGN.format("Board card header"),
  "Full rewrite: cards that differ in length and content, density and hover passes.")

U(96945, "A card's more-actions menu appears on hover or focus and offers Reassign",
  base(edit=True) + techs("\"Esther Howard\"") + wos("e.g. S1-702 led by Esther Howard"),
  ["Open Work Orders.", ALL_TAB, BOARD_SW, "Hover the S1-702 card.", "Click the more-actions button (three dots) that appears.",
   "Read the menu items.", "Press Escape and move the mouse off the card.", "Press Tab repeatedly until the S1-702 card (or a control inside it) has keyboard focus."],
  ["Hovering the card shows the more-actions button over the card.",
   "The menu includes the Reassign lead technician action. The design labels it \"Reassign Lead Tech\" (\"Assign Tech\" on a card with no lead): write down the label you see, a different label alone is not a fail.",
   "When the card gets keyboard focus, the more-actions button shows without hovering."],
  3, [A("S3-R13"), A("S3-R14")], DESIGN.format("Board card more-actions menu"),
  "Full rewrite: hover and keyboard paths separate, design label recorded.")

U(96946, "Clicking a card opens the work order except on its more-actions button",
  base(edit=True) + techs("\"Esther Howard\"") + wos("e.g. S1-702 led by Esther Howard"),
  ["Open Work Orders.", BOARD_SW, "Click the customer name on the S1-702 card.", "Press the browser Back button.",
   "Click an empty part of the card.", "Press the browser Back button.", "Hover the card and click its more-actions button."],
  ["Clicking the customer name or empty space on the card opens work order S1-702.",
   "Clicking the more-actions button opens its menu and does not open the work order."],
  3, [A("S3-R6")], "Review Decisions 853901313 DR-39.",
  "Full rewrite: two click targets plus the exception.")

U(96947, "Pinned columns sit after Unassigned in the order they were pinned",
  base() + techs("four technicians, e.g. \"Esther Howard\", \"Jenny Wilson\", \"Kristin Watson\", \"Ralph Edwards\"") + wos("one led by each and one with no lead", cust="ZZAUTOTEST Pin Order") + [
   "Start with no pins and no saved technician order."],
  ["Open Work Orders.", ALL_TAB, SEARCHZ("ZZAUTOTEST Pin Order"), BOARD_SW, "Write down the column order.", "Click the pin control (tooltip \"Pin column\") on Ralph Edwards' header.",
   "Write down the column order.", "Pin Esther Howard.", "Write down the column order."],
  ["Each technician column header has a pin control.",
   "After pinning Ralph Edwards his column is right after Unassigned, before every unpinned technician (read your four test technicians only, others may sit between the unpinned ones): Unassigned, Ralph Edwards, Esther Howard, Jenny Wilson, Kristin Watson.",
   "After pinning Esther Howard: Unassigned, Ralph Edwards, Esther Howard, Jenny Wilson, Kristin Watson (the newest pin goes after the existing pin).",
   "The design also shows a short message such as \"Ralph Edwards pinned\": optional, not part of the check."],
  3, [A("S3-R7"), A("S3-R15"), A("S3-R16")], DESIGN.format("Board \"Pin column\" control"),
  "Full rewrite: expected column order written out after each pin.")

U(96948, "Pins are shared with Tech View and follow the user to another device",
  base() + techs("\"Esther Howard\", \"Ralph Edwards\" and \"Jenny Wilson\"") + wos("one led by each") + [
   "Have a second browser (or computer) available and a second user with Work Orders view."],
  ["Open Work Orders.", BOARD_SW, "Pin Ralph Edwards and Jenny Wilson.", TECH_SW, "Look at the group order and pin controls.",
   "Sign out, sign in again and open Work Orders in Board View.", "In the second browser sign in as the same user and open Board View.",
   "Sign in as the second user and open Board View."],
  ["Tech View shows Ralph Edwards and Jenny Wilson pinned, right after Unassigned, without pinning them again.",
   "After signing in again, and in the second browser, the same two technicians are pinned.",
   "The second user sees none of your pins."],
  3, [A("S3-R17"), A("S3-R18")], "",
  "Full rewrite: cross-display, re-sign-in, second device and second user checks.")

U(96949, "A fourth pin is refused with 'You can pin up to 3 technicians.'",
  base() + techs("five technicians, e.g. \"Esther Howard\", \"Ralph Edwards\", \"Jenny Wilson\", \"Theresa Webb\", \"Kristin Watson\"") + wos("one led by each"),
  ["Open Work Orders.", BOARD_SW, "Pin Ralph Edwards, Jenny Wilson and Theresa Webb.", "Hover the pin control on Esther Howard's header and read any text shown.",
   "Try to click it.", "Unpin Jenny Wilson.", "Pin Esther Howard.", TECH_SW, "Look at the pinned groups and Kristin Watson's pin control."],
  ["With three pinned, every other pin control is disabled and explains: \"You can pin up to 3 technicians.\"",
   "Clicking the disabled control pins nobody.",
   "After unpinning Jenny Wilson, Esther Howard can be pinned.",
   "Tech View shows the same three pins (Ralph Edwards, Theresa Webb, Esther Howard) and Kristin Watson's pin control is disabled there too.",
   "The design allows 5 pins and says \"Up to 5 pinned columns, unpin one first\": a limit other than 3 or other wording is a fail."],
  3, [A("S3-R8"), A("S3-R19")], "PRD section 9 User Feedback Summary. " + DESIGN.format("Board pin limit"),
  "Full rewrite: exact message asserted, unpin frees a slot in both displays, design limit difference flagged.")

U(96950, "An empty column says 'Drag a work order here' only to users who can reassign",
  base(edit=True) + techs("\"Esther Howard\" and \"Jenny Wilson\"") + wos("e.g. S1-702 led by Esther Howard, nothing led by Jenny Wilson, no work order without a lead", cust="ZZAUTOTEST Empty Columns") + VIEWONLY,
  ["As your user (create and edit), open Work Orders.", ALL_TAB, SEARCHZ("ZZAUTOTEST Empty Columns"), BOARD_SW, "Read Jenny Wilson's empty column and the empty Unassigned column.",
   "In the second browser, as the view-only user, open Work Orders.", "Click the All tab.", SEARCHZ("ZZAUTOTEST Empty Columns"), BOARD_SW, "Read the same two columns."],
  ["For your user, Jenny Wilson's column and the Unassigned column each show \"Drag a work order here to assign it\".",
   "For the view-only user, the same two columns each show \"No work orders\".",
   "The design shows \"No work orders assigned\" above \"Drag a work order here to assign it\" for everyone: extra or different wording is a fail, write down what you see."],
  3, [A("S3-R20")], "PO decision Chris Ward, PRD footer comment 6 Oct 2026 item 5. " + DESIGN.format("Board empty column"),
  "Rewritten for the changed requirement: two users, empty technician and empty Unassigned columns, permission-dependent text.")

U(96951, "Assigned to me shows only columns with my work orders and hides pinning",
  base(edit=True) + techs("\"Esther Howard\", \"Ralph Edwards\", \"Jenny Wilson\" and yourself (Clockable on, enrolled here)") +
  wos("e.g. S1-702 led by you, S1-691 led by Ralph Edwards, S1-352 with no lead, nothing for Jenny Wilson") + [
   "On S1-352 set the Service Advisor to yourself so an unassigned work order is \"assigned to me\" (if List with Assigned to me on does not show it, assign yourself as technician on one of its lines instead).",
   "Pin Jenny Wilson in Board View before you start."],
  ["Open Work Orders.", ALL_TAB, BOARD_SW, "Turn on Assigned to me.", "Read every column shown.", "Look at the column headers for a pin control.", "Turn Assigned to me off."],
  ["With Assigned to me on, Board View shows only the Unassigned column (holding S1-352) and your own column (holding S1-702).",
   "Ralph Edwards, Esther Howard and the pinned Jenny Wilson are hidden.",
   "No column header offers a pin control while Assigned to me is on.",
   "Turning Assigned to me off brings back every column and the pin controls, with Jenny Wilson still pinned."],
  3, [A("S3-N1"), A("S3-N3")], "Review Decisions 853901313 DR-42.",
  "Full rewrite: Unassigned made to hold a match, pinned non-matching column, pin control check.")

U(96952, "A deactivated technician's column keeps its work and pin and can be unpinned",
  base(edit=True) + techs("\"Ralph Edwards\" and \"Esther Howard\"") + wos("e.g. S1-691 and S1-578 led by Ralph Edwards") + [
   "Pin Ralph Edwards: Work Orders > Board View > pin control on his column header."],
  ["Deactivate Ralph Edwards: Settings > Staff > open Ralph Edwards > set the staff record inactive > Save.",
   "Open Work Orders.", ALL_TAB, BOARD_SW, "Read Ralph Edwards' column.", "Click the pin control on his column to unpin him.", "Read the column order."],
  ["Ralph Edwards' column is still shown, still pinned right after Unassigned, with S1-691 and S1-578 (count 2).",
   "The column shows an inactive indicator. Write down how it is shown.",
   "He can be unpinned: after unpinning, his column leaves the pinned area.",
   "Afterwards, set Ralph Edwards active again to restore the data."],
  3, [A("S3-N2"), A("S3-N4"), A("S3-E3"), A("S3-E5")], "Tech plan section 3.13 (a pinned technician at this location always gets a column).",
  "Full rewrite: deactivation click-path, pin kept, inactive indicator, manual unpin, restore step.")

U(96953, "Each Board column scrolls on its own and technicians are never hidden",
  base() + techs("at least 8 technicians") + wos("about 25 with no lead, about 20 led by Esther Howard, a few for each other technician"),
  ["Open Work Orders.", ALL_TAB, BOARD_SW, "Scroll down inside the Unassigned column.", "Watch the neighbouring columns and the headers.",
   "Try to scroll the whole page down with the mouse over the empty area below a short column.", "Scroll down inside Esther Howard's column.",
   "Scroll the board sideways to the far right and back.", "Count the technician columns you passed."],
  ["Scrolling inside Unassigned moves only its cards: the next columns and every header stay where they are.",
   "The page itself does not scroll down: only the content inside a column scrolls.",
   "Esther Howard's column scrolls on its own the same way.",
   "Sideways scrolling reaches every technician: the number of technician columns equals the number of eligible technicians (e.g. 8). None is hidden automatically."],
  3, [A("S3-E1"), A("S3-E2")], "Review Decisions 853901313 UX-11 / DR-40. PRD inline comment Branko Cicovic 28 Sep 2026 (only content inside the columns scrolls).",
  "Full rewrite: page-scroll attempt added, technician count check for sideways scroll.")

U(96954, "Every card field stays reachable by scrolling at any card size or density",
  base() + techs("\"Esther Howard\"") + wos("about 15 led by Esther Howard, some with long customer names and several line technicians"),
  ["Open Work Orders.", ALL_TAB, BOARD_SW, "Open Fields to display and turn on every field. Close the picker.",
   "Set the density to Comfortable (the largest option).", "Scroll down inside Esther Howard's column to the last card.",
   "Read every field on the last card.", "Repeat steps 5 to 7 at Regular and Compact."],
  ["At every density you can scroll to the very last card in the column.",
   "Every field you turned on is fully visible on the last card: nothing is cut off at the bottom of the column."],
  3, [A("S3-E4")], "",
  "Full rewrite: all fields on, every density, last card checked.")

U(96955, "Board View has the same Density setting as Tech View",
  base() + techs("\"Esther Howard\"") + wos("e.g. S1-702 led by Esther Howard"),
  ["Open Work Orders.", BOARD_SW, "Open the Density control in the toolbar and write down its options and which is selected.",
   "Choose Compact.", TECH_SW, "Open the Density control.", "Choose Comfortable.", BOARD_SW, "Open the Density control."],
  ["Board View has a Density control offering Compact, Regular and Comfortable.",
   "After choosing Compact in Board View, Tech View's Density control shows Compact selected.",
   "After choosing Comfortable in Tech View, Board View shows Comfortable selected: one setting shared by both displays.",
   "The design offers \"Card size: Compact / Detailed\" on Board View and \"Row height: Small / Medium / Large\" on Tech View: those options are a fail against the specification, write down what you see."],
  3, [A("S3-R11"), A("S6-R1"), A("S6-R3")], "Review Decisions 853901313 SQ-4. " + DESIGN.format("Board \"Card size\" and By Lead Tech \"Row height\" menus"),
  "Full rewrite: options listed, shared selection checked both directions, design labels flagged.")

U(154886, "An empty Unassigned column stays on the Board and accepts a dropped card",
  base(edit=True) + techs("\"Esther Howard\"") + wos("e.g. S1-702 and S1-644 led by Esther Howard and none without a lead", cust="ZZAUTOTEST Board Unassigned") + [NOSHIFT],
  ["Open Work Orders.", ALL_TAB, SEARCHZ("ZZAUTOTEST Board Unassigned"), "Make sure Assigned to me is off.", BOARD_SW, "Read the Unassigned column.",
   "Drag the S1-644 card from Esther Howard's column onto the Unassigned column and let go.", "Read both column counts."],
  ["The Unassigned column is still on screen, first, showing its empty state (\"Drag a work order here to assign it\" for a user who can reassign).",
   "S1-644 can be dropped on it: Unassigned now shows 1 card and Esther Howard's count drops from 2 to 1.",
   "The design hides Unassigned when it is empty: if the column is missing, it is a fail."],
  3, [A("S3-R22")], "PRD footer comments Chris Ward 25 Sep and 29 Sep 2026 (Unassigned stays as a drop target).",
  "Full rewrite: Unassigned emptied by seeding, drop exercised with counts, design difference flagged.")

N("NEW-A-06", 13238, "A pinned technician who can no longer take work shows 'No work orders'",
  base(edit=True) + techs("\"Jenny Wilson\" and \"Theresa Webb\" (neither leading any work order) and \"Esther Howard\"") + wos("e.g. S1-702 led by Esther Howard") + VIEWONLY + [
   "As your user, and again as the view-only user, open Work Orders > Board View and pin Jenny Wilson and Theresa Webb (pins are per user)."],
  ["Deactivate Jenny Wilson: Settings > Staff > open Jenny Wilson > set the staff record inactive > Save.",
   "Remove Theresa Webb from this location: Settings > Staff > open Theresa Webb > remove this location from her enrolment > Save.",
   "Open Work Orders.", ALL_TAB, BOARD_SW, "Read the pinned Jenny Wilson and Theresa Webb columns.",
   "Try to drag the S1-702 card onto Jenny Wilson's column.", "In the second browser, as the view-only user, open Work Orders in Board View.", "Read the pinned Jenny Wilson and Theresa Webb columns."],
  ["Both pinned columns are still shown (the pins are kept) and are empty.",
   "For your user (who can reassign), each shows \"No work orders\", not \"Drag a work order here to assign it\".",
   "The card cannot be dropped on Jenny Wilson's column.",
   "For the view-only user, both columns also show \"No work orders\".",
   "Afterwards, set Jenny Wilson active again and re-enrol Theresa Webb to restore the data."],
  3, [A("S3-R20a"), A("S4-N5")], "PRD footer comment Sasha Grosman 24 Sep 2026 (active but no longer eligible technicians are treated like inactive). Tech plan 3.13.",
  "S3-R20a (new requirement)")

N("NEW-A-08", 13238, "Empty technician columns stay on the board with no way to hide them",
  base(edit=True) + techs("\"Esther Howard\" and \"Jenny Wilson\"") + wos("e.g. S1-702 and S1-644 led by Esther Howard, nothing led by Jenny Wilson", cust="ZZAUTOTEST Empty Tech") + [NOSHIFT],
  ["Open Work Orders.", ALL_TAB, SEARCHZ("ZZAUTOTEST Empty Tech"), "Make sure Assigned to me is off.", BOARD_SW, "Find Jenny Wilson's column.",
   "Look through the toolbar, the column header and any menus for a control to hide empty columns.",
   "Drag the S1-644 card onto Jenny Wilson's column and let go.", "Read both column counts."],
  ["Jenny Wilson's column is on the board even though she leads no work orders.",
   "There is no control anywhere to hide empty technician columns.",
   "The card can be dropped on her column: Jenny Wilson now shows 1 and Esther Howard drops from 2 to 1.",
   "While Assigned to me is on or when nothing matches the filters, other rules apply (checked in other cases)."],
  3, [A("S3-R9"), A("S3-R21")], "Review Decisions 853901313 SQ-7 / DR-26.",
  "S3-R9 and S3-R21, split out of C96950 so C96950 checks only the changed empty-column wording")

# ---------------------------------------------------------------- notes
notes += [
 "Design-vs-spec (switcher): design tooltips read \"Table\", \"By Lead Tech\", \"Board\" (aria-label group \"View\"); PRD names the options List, Tech View, Board View. C96909/C96945 tell the tester to record the label; not a fail on label alone. PO question: are the tooltip words final?",
 "Design-vs-spec (density): design shows \"Row height: Small/Medium/Large\" on Table and By Lead Tech and \"Card size: Compact/Detailed\" on Board (Detailed vs Compact also hides hours and money on cards). PRD S6-R1/S6-R6 require Compact/Regular/Comfortable shared by Tech View and Board View, never hiding fields; List keeps no density control (DR-33) but the design gives List a Row height menu. C96955 asserts the PRD.",
 "Design-vs-spec (Fields to display): Board View in the design has no Fields to display picker (no Columns button on Board). PRD S5-R2. C96943/C96954 assert the PRD.",
 "Design-vs-spec (empty texts): design empty group/column reads \"No work orders assigned\" (Tech View) and \"No work orders assigned\" + \"Drag a work order here to assign it\" (Board, shown to everyone); PRD S2-R15 \"No work orders\", S3-R20 permission-dependent, S3-R20a \"No work orders\" for unassignable pinned technicians. Design filtered-empty reads \"No work orders match these filters\" / \"No results for “…”\" with \"Clear all filters\"; PRD S1-N1 \"No work orders match your filters\" + Clear filters. PRD fixes these words, so cases assert them exactly.",
 "Design-vs-spec (pins): design PIN_LIMIT = 5 with toast \"Up to 5 pinned columns — unpin one first\"; PRD S3-R8 three pins and \"You can pin up to 3 technicians.\" Design has pin controls only on Board View columns; PRD S2-R11/S2-R17/S2-N4 give Tech View pins too. Design shows a toast \"<Name> pinned / unpinned\" not in the PRD (kept as optional observation in C96947).",
 "Design-vs-spec (search and collapse): design opens every collapsed group that has a search/filter hit; PRD S2-R16 keeps it collapsed. NEW-A-01 asserts the PRD.",
 "Design-vs-spec (empty groups while filtering): design hides empty technician groups/columns whenever a filter, search or non-All tab is active, and hides Unassigned when it is empty; PRD S2-R14/S3-R9 keep every eligible technician and S2-N1/S3-R22 keep Unassigned (engineering 1 Oct: built to the PRD). Cases assert the PRD.",
 "Design-vs-spec (initial order): design technician order starts with Brenda Martinez and is not alphabetical, and in-group order is In progress first then newest created; PRD S2-R3 (first name, last name, account age) and S2-R6 (List default sort, customer A-Z per DR-45). C96926/C96929 assert the PRD.",
 "Design-vs-spec (Tech View columns): design Tech View column menu offers 10 columns (\"10 of 10 shown\": no Lead Technician, VIN/Serial #, On Site, Auth, Invoiced Date, Days open, Returns); PRD S2-R4 = same columns as List plus Assigned Techs. C96927 asserts the PRD. PO question: is Lead Technician meant to be dropped in Tech View since rows are grouped by it?",
 "Design-vs-spec (Declined): design locks Declined (\"Declined · can’t be reassigned\") and shows Imported as \"Imported · review before assigning\"; PRD S4-N2 lets Declined move freely (Story 4 share, recorded here because it shows on Story 2/3 screens).",
 "Design-only items out of scope per PO (Chris Ward 29 Sep, Sasha Grosman 24 Sep): Technician and Department filter chips, Details view (4th switcher option), Undo on the reassignment toast, Waiting on N parts on cards, hiding empty Unassigned. Not tested as features. Position numbers on cards and the column overview minimap: engineering (1 Oct) builds the minimap, leaves position numbers out; PRD silent. PO question: should either be in the PRD?",
 "Design-only state added (Rule 115): the no-technicians organisation (\"No technicians yet\" / Add Technician) — NEW-A-07, wording not asserted because the PRD does not fix it; engineering (1 Oct) leaves the Add Technician button out.",
 "Design 'Assigned to me' rule = signed-in user is on the crew or is the service advisor; PRD says the existing List rules. C154884/C96937/C96951 use List as the baseline rather than the design rule.",
 "Story text out of date vs PRD (no case change, PRD wins): SV-10045 S2-R9 and SV-10046 S3-N1 still describe the withdrawn 'muted groups' rule (DR-36, replaced by DR-42); SV-10044 S1-R14 still says 'desktop only' rather than the 1024px width rule; SV-10046 S3-R20 still says only \"No work orders\"; SV-10045 S2-N1 says Unassigned stays 'including while Assigned to me is enabled' (PRD: except). PO/Jira housekeeping question.",
 "Imported in board displays (tech plan 3.26, Sasha Grosman 24 Sep): Tech View/Board View disabled while Imported is selected and Imported disabled in their Status filter. Not in the 7 Oct PRD text; already covered by C154648 (tech-plan folder 20449), so no duplicate case here. PO question: add it to the PRD?",
 "Default filter tab: tech plan 3.20 / Sasha 24 Sep say first visit lands on Work Orders; Chris Ward 25 Sep took the default-tab change out of scope (List unchanged). C96913 no longer asserts a landing tab. Engineering's current build intent should be confirmed with the PO.",
 "S1-N2 (preference cannot load) cannot be produced by a manual tester; C96919 keeps a control check and marks the main check 'not checked by hand'. S1-N3/S1-N4 use a network-off method instead of forcing a failure.",
 "Status changes in preconditions (C96913) use 'the status control on the work order page' — exact control names were not available from any source in this pass; the build verification session should confirm the click path.",
 "S1-R14 exact 1024px edge cannot be measured by hand without developer tools; C154885 checks clearly below and clearly above and asks the tester to record that the edge was not checked by hand.",
 "S2-R18 paging only shows when more than about 300 work orders match (tech plan 3.1); NEW-A-03 needs a location with several hundred unassigned work orders on the All tab and marks the behind-the-scenes paging as not provable by hand.",
 "C96950 split: S3-R20 (changed, permission-dependent text) stays on C96950; S3-R9 and S3-R21 move to NEW-A-08. Anchors stay covered.",
]

# ---------------------------------------------------------------- coverage + reading coverage
cov = {}
for c in updates:
    for q in c["quotes"]:
        cov.setdefault(q[0], []).append(f"C{c['case_id']}")
for c in new:
    for q in c["quotes"]:
        cov.setdefault(q[0], []).append(c["key"])

reading = ("PRD CONFLUENCE-845185030 capture (59,254 bytes) lines 1-640, 100% read · Review Decisions CONFLUENCE-853901313 capture (91,532 bytes) lines 1-273, 100% read · "
 "PRD footer comments (6 threads, 15 replies) and inline comments (28 threads with replies) fetched live 8 Oct via Atlassian MCP, 100% read · "
 "Epic stories SV-10043-stories-2026-10-08.md (113,391 bytes) lines 1-773, 100% read · Tech plan 2026-10-08 upload (115,972 bytes) lines 1-971, 100% read · "
 "Design Work Orders.dc.html (105,853 bytes) lines 1-1411, 100% read; 'Work Orders -no page-fix-.dc.html' diffed against it by script (139 differing lines: older data/style variant, PIN_LIMIT 5 and texts identical); "
 "design system bundle _ds_bundle.js: Work Orders layer lines 9900-12085 read (style-only lines filtered by script) plus SVEmptyState 3884-4015; the rest of the 408 KB generic component library, fonts, lucide icon data and support.js (Claude Design runtime) scanned by grep for tester-visible text only, NOT read line by line — needs the QA lead's authorization under Rule 119 or a follow-up read; "
 "design uploads: 10 screenshots viewed (4 avatar photos not viewed: staff photos only); design screenshots: 20 of 21 viewed (wo-details before-light/after-light are crops of the side-by-side images viewed); wo-details/Add Part.html (Lines tab, Story 7/8) not read — outside Stories 1-3, flag for the Story 7 worker; "
 "design-drive sweep Work Orders-pages.txt (4 KB) 100% read, summary.json read, interactions.jsonl (3.5 MB) and discovery.json (135 KB) searched by script for labels (not read whole); "
 "design-crawl list/tech/board states.jsonl (9/27/36 states) and actions.jsonl (469/439/397 actions) 100% summarised by script and the summary (1,435 lines) read in full; crawl DONE flag present · "
 "Our 49 case snapshots (snapshots-before/C*.json) 100% read (plain-text dump, quote blocks re-derived from the PRD) · PROJECT-STATE.md, V33-RECHECK-2026-09-30.md, RULE117-REFORMAT-AND-TECHPLAN-2026-09-30.md 100% read · "
 "Rules 113-123 (RULES-61-96.md lines 2391-2837) and IDEAL-TEST-CASE-STANDARD.md + C154586 example 100% read.")

out = {"updates": updates, "new": new, "retire": retire, "notes": notes, "anchors_covered": cov, "reading_coverage": reading}
json.dump(out, open(OUT, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print("updates", len(updates), "new", len(new), "retire", len(retire))
