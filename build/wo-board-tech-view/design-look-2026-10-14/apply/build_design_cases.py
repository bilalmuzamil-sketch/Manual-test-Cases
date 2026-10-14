#!/usr/bin/env python3
"""Builds proposals-design.json (22 new "Design — how it looks" cases, section 73780) and proposals-c581895.json (the SV-11336
addition to our case C581895) from design-case-proposals.json, in the WO pipeline schema (key, section_id, title,
preconditions, steps, results, source, divergence, quotes, marker, doc_part1, doc_part2, why, pictures, tickets).
Rewritten 14 Oct 2026 so that every case is runnable by a manual tester with the product and the attached design picture at
100% zoom (Rule 126 point 8, Rules 114/117): eye comparisons only, every result tied to a step, own ZZAUTOTEST data per case,
proven click paths (proposals-v52.json, currency-2026-10-14 proposals, APP-ACTIONS-PLAYBOOK.md); unproven facts are UNVERIFIED
in Part 2 only. Run from the repo root: python3 build/wo-board-tech-view/design-look-2026-10-14/apply/build_design_cases.py"""
import json, os
H = "build/wo-board-tech-view/design-look-2026-10-14/apply"
SEC = 73780
MARK = "AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build"
MARK_DARK = "AUTOMATION: HOLD - waiting for the product owner's answer on whether the Dark theme is in scope"
PRD = 'PRD "Work Orders — Board View & Tech View Display Options", Confluence 845185030, version 52 (14 Oct 2026, Chris Ward)'
DES = 'Claude Design project "Work Orders" (Branko Cicovic), export of 14 Oct 2026, board "Work Orders.dc.html"'
STORY = {1: "SV-10044 (Story 1, Switch between display options)", 2: "SV-10045 (Story 2, Tech View)", 3: "SV-10046 (Story 3, Board View)",
         4: "SV-10047 (Story 4, Reassign the lead technician)", 5: "SV-10048 (Story 5, Choose what is shown)", 6: "SV-10049 (Story 6, Density)",
         7: "SV-10050 (Story 7, Line technicians)", 9: "SV-10052 (Story 9, Drag to reorder)"}
TICKET_BY = {"SV-11336": "Ahtasham Amjad", "SV-11337": "Ahtasham Amjad", "SV-11338": "Ahtasham Amjad"}

def source(stories, codes, states, pics, tickets=()):
    s = "Epic SV-10043; " + ("story " if len(stories) == 1 else "stories ") + ", ".join(STORY[x] for x in stories)
    s += f"; {PRD}, {codes}, read 14 Oct 2026; {DES}, {states} (design pictures {', '.join(pics)}, rendered from that export at the width in the name), read 14 Oct 2026."
    if tickets:
        s += " Covers the design defects " + ", ".join(f"{t} (reported 14 Oct 2026 by {TICKET_BY.get(t, 'Chris Ward')})" for t in tickets) + "."
    s += " Where the PRD says nothing about the look, the design is the source. Source-verified 14 October 2026. Not yet checked against a build."
    return s

# ---------------------------------------------------------------- preconditions (manual tester) ----------------------
USER = ("You are signed in as {User-A} (for example Admin ShopView), an Owner or Admin user whose role has Work orders > View, "
        "Work orders > Create & Edit and See financial data, at {Location-A} (for example Staging Heavy Duty - 9919).")
W1440 = "Your browser window is 1440 px wide, with the browser zoom at 100%."
W1536 = "For the steps that name 1536 px, your screen lets you widen the window to 1536 px."
def PIC(*pics):
    if len(pics) == 1:
        return f"The design picture {pics[0]} is open beside the app at 100% zoom (actual size); it is attached to this case."
    return "The design pictures " + ", ".join(pics[:-1]) + f" and {pics[-1]} are open beside the app at 100% zoom (actual size); they are attached to this case."
IGNORE = ("In the design pictures the names, numbers, dates and amounts are sample data, and the rank numbers (1, 2, 3 …) beside rows and cards "
          "are left out of this release, so do not compare those.")
CLEAN = "On the Work Orders page nothing is chosen in any filter, Assigned to me is off, Search is empty and density is Regular (the default)."
def CUST(ex): return f'Customer {{Customer-A}} (for example "ZZAUTOTEST {ex}") is used by this case only.'
def TECH(ph, ex, photo=None, extra=""):
    look = " who has a profile photo" if photo is True else " who has no profile photo" if photo is False else ""
    return f"Technician {{{ph}}} (for example {ex}) is an active technician at {{Location-A}}{look}{extra}."

# ---------------------------------------------------------------- Part 1 recipes (manual tester, proven click paths) --
D_SIGNIN = ('Sign in as an Owner or Admin user. On a QA site click the Admin quick-login button on the sign-in page; you appear as "Admin ShopView". '
            "This is {User-A}. To check the permissions: your initials (top right) > Settings > Roles & Permissions > Admin > Work orders: View and "
            "Create & Edit are on (the Admin role has full access, See financial data included).")
D_LOC = ("Pick one location for the whole case; it is shown in the top bar next to the bell (to change it: your initials > Change Location). "
         "This is {Location-A} (for example Staging Heavy Duty - 9919). Create everything below at {Location-A}.")
D_WIN = ("Use a screen at least 1440 px wide (1536 px or wider if the case names 1536 px). Set the browser zoom to 100% (Ctrl+0, or Cmd+0 on a Mac). "
         "To give the window an exact width without developer tools, use a window-size browser extension (for example Window Resizer for Chrome) "
         "and choose 1440 × 900; it shows the size it set.")
def D_PIC(n): return ("Open this case in TestRail and download the design " + ("picture" if n == 1 else "pictures") +
                      " named in the Preconditions from the case's attachments. Open each in an image viewer at 100% (actual size) and place it beside the browser window.")
def D_TECH(ph, ex, photo=None):
    cond = ", and already have a profile photo" if photo is True else ", and have no profile photo (a newly added staff member has none)" if photo is False else ""
    s = (f"Your initials > Settings > Staff. Reuse a staff member only if they are active, have Time Clock on, {{Location-A}} in Location and a Role "
         f"other than Office User or Time Clock User{cond}. Otherwise click New Staff Member and enter First Name and Last Name (for example {ex}), an Email"
         f"{' you can open' if photo else ''} with ZZAUTOTEST in it, Role Technician, at least one Department (required), Location {{Location-A}}, "
         f"turn Time Clock on, then Save & Close. This is {{{ph}}}.")
    if photo:
        s += (f" To give {{{ph}}} a profile photo: accept the invitation email sent to {{{ph}}}'s email and set a password, sign in as {{{ph}}} in a "
              "private browser window, click your initials (top right) > Edit Profile > click \"Click to upload a profile photo\" and pick any photo "
              "(for example a photo of a face), then close that window.")
    return s
def D_CUST(ex, unit="TRK-118"):
    return (f'Top menu Customers > New Customer > Name (for example "ZZAUTOTEST {ex}") > Save. This is {{Customer-A}}; use it for this case only. '
            "On the customer page click Contacts > New Contact > First Name and Last Name (for example ZZAUTOTEST Contact) > Save. Then Assets > New Asset > "
            f"pick the contact, Year (for example 2022), Make (type \"Freight\" and pick Freightliner), Model (for example M2), Unit (for example {unit}) > Save. "
            "Contact and Make are required.")
def D_WO_APPROVED(n, lead=None, ex="S10043-17801", line="grease", linename="Service - Full grease service", lineph=None):
    s = ("Work Orders > Create Work Order > in the New Work Order window pick {Customer-A} and its asset > Save (if a Confirmation about the credit "
         f"limit appears, click Create). The work order opens on its Lines tab with the New Line form. In What Are You Doing? type \"{line}\" and pick the "
         f"ready-made line \"{linename}\", turn Line Approved on and click Save & Close. The status reads Approved. Write down the number shown at the top "
         f"left (for example {ex}). This is {{Work-order-{n}}}" + (f"; its line is {{{lineph}}}." if lineph else "."))
    if lead:
        s += f" On {{Work-order-{n}}}'s page pick {{{lead}}} in the Lead Technician dropdown; it saves at once (the dropdown shows once the work order is Approved)."
    return s
def D_WO_ESTIMATE(n, ex="S10043-17803"):
    return ("Work Orders > Create Work Order > in the New Work Order window pick {Customer-A} and its asset > Save (if a Confirmation about the credit "
            "limit appears, click Create). In What Are You Doing? type \"grease\" and pick the ready-made line \"Service - Full grease service\", leave "
            f"Line Approved off and click Save & Close. The status reads Estimate and it has no lead technician. Write down the number (for example {ex}). "
            f"This is {{Work-order-{n}}}; it sits in the Unassigned group.")
def D_LINE_TECH(n, lineph, tech):
    return f"On {{Work-order-{n}}}'s Lines tab click {{{lineph}}}'s name to open Edit Line, choose Technicians {{{tech}}} and save."
def D_INVOICE(n):
    return (f"Complete {{Work-order-{n}}}: on its Lines tab click the line's Complete button, type a Tech Story (fill any missing detail it asks for, "
            "for example Mileage) and click Complete Line. Then click Mark Reviewed, enter the VIN if asked and click Confirm Review; the status reads "
            "Complete. Then open the Finance tab and click Create Invoice; if a New Customer Payment window opens afterwards, close it. The status reads Invoiced.")
D_CLEAN = ("Work Orders > All: open each filter in the filter bar and clear any selection, turn Assigned to me off, empty Search, and set density "
           "to Regular with the density button (the icon button with lines and an up-and-down arrow, to the left of the display switcher).")
def CHECK(text): return "Check the setup worked: " + text

# ---------------------------------------------------------------- Part 2 helpers (Claude session) ---------------------
def P2(goal, pics, states, extra=()):
    return ([f"Goal: {goal}",
             f"Design pictures: {', '.join(pics)} (build/wo-board-tech-view/design-look-2026-10-14/compare/), rendered from the design export of 14 Oct 2026 "
             f"(states {states}). To re-render one, serve build/wo-board-tech-view/sources/design-2026-10-14-upload/ and use "
             "build/wo-board-tech-view/design-look-2026-10-14/build_design_look.py; never copy the design package under /tmp (the secret scanner reads "
             "/tmp/**/*token* and the design's tokens.js then blocks commits).",
             "Run in Playwright with viewport 1440 × 900 and deviceScaleFactor 1 (1536 × 900 or the named width where a step says so). After each step that has "
             "an expected result, take a screenshot of the same area as the design picture and keep both side by side in the evidence. Computed styles may be "
             "recorded as supporting evidence, but the verdict is the eye comparison the case describes."]
            + list(extra) +
            ["Evidence: the build marker before and after, a screenshot after each step that has an expected result, the matching design picture, and the real value of every brace name."])
UNV_DENSITY = ("UNVERIFIED: the density button's on-screen label or tooltip and its options; the PRD names the options Compact, Regular and Comfortable "
               "(S6-R1) and the design draws the button as Lucide row-height (Tech View) / card-height (Board View). Record what the build shows.")
UNV_PHOTO = ("UNVERIFIED: where a staff photo is uploaded on this build (own Edit Profile, as recorded for C96910-type cases, or the staff record). "
             "If Edit Profile is not available to a technician, pick an existing active technician at {Location-A} who already has a photo and record the name.")
UNV_ESTIMATE_LEAD = "Fact from the playbook (C96913 setup): an Estimate's Lead Technician is read-only on the work order page; it is given a lead only from Board View."
API_CLOCK = ("UNVERIFIED on screen: the clock-in path a technician uses. API recipe (APP-ACTIONS-PLAYBOOK.md, technician tasks): "
             "POST /api/technician-tasks/check-in with task_id, line_id, work_order_id and refresh_lines true → 201. Clock-out is NOT solved, so a clock you "
             "start stays running; say so in the evidence.")

cases = []
def case(**k):
    k.setdefault("section_id", SEC)
    k.setdefault("marker", MARK)
    cases.append(k)

# DC-01 -----------------------------------------------------------------------------------------------------------------
P = ["DC-01-toolbar-tech-view-light-1440.png", "DC-01-toolbar-board-view-light-1440.png"]
case(key="DC-01", tickets=["SV-11319"], pictures=P,
     title="Display switcher and toolbar icons in Tech View and Board View match the design",
     preconditions=[USER, W1440, PIC(*P), IGNORE, TECH("Technician-A", "ZZAUTOTEST DC01 Ana Icons"), CUST("DC01 Toolbar Icons"),
                    "Approved work order {Work-order-1} (for example S10043-17801) for {Customer-A} is led by {Technician-A}.", CLEAN],
     steps=["Open Work Orders from the top menu and click the All tab.",
            "Click List in the display switcher at the right of the toolbar.",
            "Look at the three buttons of the display switcher.",
            "Click Tech View in the display switcher.",
            "Look at the display switcher, the density button and the column chooser button, and compare them with the Tech View design picture.",
            "Click the density button.",
            "Look at the menu that opens.",
            "Press Escape.",
            "Click Board View in the display switcher.",
            "Look at the display switcher and the density button, and compare them with the Board View design picture.",
            "Click List in the display switcher.",
            "Look at the other icons in List's toolbar."],
     results=["Step 3: the switcher shows three outline icons side by side in a light-grey rounded track: a bulleted list (List), the head and shoulders of a person (Tech View) and a square board with three bars of different lengths (Board View), the same three drawings as in the design pictures and about the same size as in the pictures at 100% zoom (20 px in the PRD). They are thin-line outline icons of the same weight, not filled icons, emoji or text characters.",
              "Step 5: the Tech View button sits on a white raised segment and the other two look flat. The density button shows three lines with an up-and-down arrow at their right (the design's \"row-height\" icon) and the column chooser button shows a rectangle split into three columns (the design's \"columns-3\" icon), drawn in the same thin outline style, as in the Tech View picture.",
              "Step 7: the density menu offers Compact, Regular and Comfortable, with Regular marked as the one in use.",
              "Step 10: the Board View button is now the white raised segment, and the density button shows a different drawing from Tech View's: a card with an up-and-down arrow (the design's \"card-height\" icon), as in the Board View picture.",
              "Step 12: the other icons in List's toolbar look the same as in List in production today; only the display switcher is new."],
     source=source([1, 6], "S1-R9a, S1-R9, S6-R1 and Goals", "states states__work-orders__tech-density-menu__light__1440 and core__work-orders__board-detailed__light__1440", P, ["SV-11319"]),
     divergence=("The design names the three options Table, By Lead Tech and Board; this case follows the PRD's names List, Tech View and Board View "
                 "(question W-1 to the product owner, not yet answered). Whether the filter chips also take the design's icons is a separate open question "
                 "(PQ-V01), so this case does not judge the chip icons."),
     quotes=[["S1-R9a", "The switcher uses the design’s icons at 20px: List is Lucide `list`, Tech View is `user-round`, Board View is `square-kanban`. In Tech View and Board View every other icon is the design’s Lucide icon too: density (`row-height` in Tech View, `card-height` in Board View), collapse chevron (`chevron-down`), pin and unpin (`pin` / `pin-off`), Invoiced or Paid lock (`lock`), Unassigned avatar (`user-round`) and empty states (`clipboard-list`). List’s icons are unchanged."],
             ["S1-R9", "The switcher visually indicates the active display option."],
             ["S6-R1", "Offer Compact, Regular, and Comfortable density in Tech View and Board View."],
             ["Goals", "List remains the default and is unchanged from production; the only addition to the Work Orders page is the display switcher."],
             ["Design — _ds_bundle.js (design library), density button icon", "name: kanban ? 'card-height' : 'row-height',"],
             ["Design — _ds_bundle.js (design library), column chooser button icon", 'window.svIcon("columns-3", 20)'],
             ["Design — README.md (design library), icons", "Never emoji. Never a unicode glyph as an icon."]],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(2), D_TECH("Technician-A", "ZZAUTOTEST DC01 Ana Icons"), D_CUST("DC01 Toolbar Icons"),
                D_WO_APPROVED(1, "Technician-A"), D_CLEAN,
                CHECK("Work Orders > All > Tech View shows a group for {Technician-A} holding {Work-order-1}, and the display switcher shows List, Tech View and Board View.")],
     doc_part2=P2("compare the display switcher, the density button and the column chooser button in Tech View and Board View with the design pictures, and confirm List's toolbar is unchanged.",
                  P, "states__work-orders__tech-density-menu__light__1440, core__work-orders__board-detailed__light__1440",
                  [UNV_DENSITY, "UNVERIFIED: the column chooser button's label or tooltip (design: Lucide columns-3, aria \"Columns\"). Step 12 needs production List for comparison: app.shopview.com (playbook §K) or a List screenshot taken before this feature."]),
     why="SV-11319 (Lucide icons in the switcher and the views): the look of the switcher, density and column chooser icons, compared with the design.")

# DC-02 -----------------------------------------------------------------------------------------------------------------
P = ["DC-02-tech-view-header-row-1440.png"]
case(key="DC-02", tickets=["SV-11322"], pictures=P,
     title="Display switcher tooltips open above it and never cover the column headers",
     preconditions=[USER, W1440, W1536, PIC(*P),
                    "The design picture shows the column header row that must stay readable; the design has no tooltip of its own on the switcher, so where the tooltip opens comes from the PRD.",
                    TECH("Technician-A", "ZZAUTOTEST DC02 Ben Tooltip"), CUST("DC02 Switcher Tooltip"),
                    "Approved work order {Work-order-1} (for example S10043-17805) for {Customer-A} is led by {Technician-A}.", CLEAN],
     steps=["Open Work Orders, click the All tab and click Tech View in the display switcher.",
            "Hover the List button of the display switcher and wait until its tooltip shows.",
            "Hover the Tech View button and wait until its tooltip shows.",
            "Hover the Board View button and wait until its tooltip shows.",
            "Click Board View in the display switcher.",
            "Hover each of the three switcher buttons in turn, waiting for each tooltip.",
            "Widen the window to 1536 px.",
            "Click Tech View in the display switcher.",
            "Hover each of the three switcher buttons in turn, waiting for each tooltip."],
     results=["Steps 2 to 4: each tooltip opens above the switcher, between the switcher and the tabs above it, never below it. While it shows, the table's column header row (Status, Waiting On Parts, Number …) stays fully readable, as in the design picture: no part of the tooltip lies over it.",
              "Step 6: in Board View each tooltip also opens above the switcher and covers none of the column headers (technician names and counts).",
              "Step 9: at 1536 px each tooltip still opens above the switcher and leaves the column header row fully readable."],
     source=source([1], "S1-R9b and S1-R1", "state core__work-orders__tech-regular__light__1440", P, ["SV-11322"]),
     divergence="The design shows only the browser's own hover text on the switcher (Table, By Lead Tech, Board); this case follows the PRD's names List, Tech View and Board View (question W-1 to the product owner, not yet answered) and does not judge the tooltip words.",
     quotes=[["S1-R9b", "The switcher’s hover tooltip opens above the switcher, so it never covers the table’s column header row."],
             ["S1-R1", "The Work Orders toolbar offers List, Tech View, and Board View display options."],
             ["Design — _ds_bundle.js (design library), view switch label", "label: 'By Lead Tech',"]],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(1), D_TECH("Technician-A", "ZZAUTOTEST DC02 Ben Tooltip"), D_CUST("DC02 Switcher Tooltip"),
                D_WO_APPROVED(1, "Technician-A", "S10043-17805"), D_CLEAN,
                CHECK("Work Orders > All > Tech View shows {Technician-A}'s group with {Work-order-1}, and the column header row is visible under the toolbar.")],
     doc_part2=P2("hover each switcher button in Tech View and Board View at 1440 and 1536 px and prove the tooltip opens above the switcher and never overlaps the column header row.",
                  P, "core__work-orders__tech-regular__light__1440",
                  ["Measure with boundingBox(): tooltip bottom must be above the switcher top, and the tooltip box must not intersect the header row box. Record both boxes per hover.",
                   "UNVERIFIED: the tooltip text and whether the build uses a custom tooltip or the browser's title text (a title tooltip is drawn by the browser and cannot be screenshotted; record that if so)."]),
     why="SV-11322: the switcher tooltip opens above and never covers the header row (PRD S1-R9b).")

# DC-03 -----------------------------------------------------------------------------------------------------------------
P = ["DC-03-tech-view-regular-light-1440.png", "DC-03-tech-view-regular-light-1536.png"]
case(key="DC-03", tickets=["SV-11324"], pictures=P,
     title="Tech View table runs edge to edge on white with no side gutter",
     preconditions=[USER, W1440, W1536, PIC(*P), IGNORE, TECH("Technician-A", "ZZAUTOTEST DC03 Cara Edge"), CUST("DC03 Edge To Edge"),
                    "Approved work order {Work-order-1} (for example S10043-17807) for {Customer-A} is led by {Technician-A}.",
                    "Estimate {Work-order-2} (for example S10043-17808) for {Customer-A} has no lead technician, so it sits in the Unassigned group.", CLEAN],
     steps=["Open Work Orders, click the All tab and click Tech View in the display switcher.",
            "Look at the left and right edges of the table, from the column header row down to the last row on screen.",
            "Look at the line between the Unassigned group and the next group.",
            "Scroll the table down a few screens.",
            "Scroll the table sideways to its far right.",
            "Widen the window to 1536 px and look at the table edges again.",
            "Click List in the display switcher and look at the table edges."],
     results=["Step 2: the table is white and runs from the left edge of the page to the right edge: the column header row, every group header and every row start right at the page's left edge, with no grey strip, margin or gap on either side, and there is no card, panel, rounded corner or shadow around the table. Side by side with the 1440 px design picture, the white table meets the browser edge on the left in the same way.",
              "Step 3: the groups are separated by a double grey line above each group header, as in the picture.",
              "Step 4: the column header row stays at the top of the table while the rows move up under it.",
              "Step 5: the table scrolls sideways inside the page (a horizontal scroll bar shows) and each header label stays above its own column while you scroll.",
              "Step 6: at 1536 px the table still runs edge to edge on white, as in the 1536 px design picture.",
              "Step 7: List's table looks as it does in production today; List is unchanged by this release."],
     source=source([2], "S2-R22, S2-R1 and Goals", "states core__work-orders__tech-regular__light__1440 and core__work-orders__tech-regular__light__1536", P, ["SV-11324"]),
     divergence="With the design's default columns the table is about 1,790 px wide, so it scrolls sideways at 1440 and 1536 px in the design too; whether that is acceptable is open with the product owner (question PQ-V02, not yet answered), and this case follows the design.",
     quotes=[["S2-R22", "Tech View’s table runs edge to edge on white, with no side gutter and no card or panel around it, as in the design."],
             ["S2-R1", "Group work orders by lead technician with visible separators."],
             ["Goals", "List remains the default and is unchanged from production; the only addition to the Work Orders page is the display switcher."],
             ["Design — README.md (design library), list screens", "runs **edge to edge on white** (never inside a card on grey)"],
             ["Design — SKILL.md (design library), list screens", "A list screen is white and the table runs edge to edge."],
             ["Design — Work Orders.dc.html, Tech View column header row", "position: sticky; top: 0; z-index: 2; background: var(--sv-surface); border-bottom: 1px solid var(--sv-border-default);"],
             ["Design — Work Orders.dc.html, Tech View group header", "border-top: 3px double var(--sv-border-default);"],
             ["Design — Work Orders.dc.html, Tech View table", "min-width: {{ rowsMinWidth }}; flex: 1; padding-bottom: 20px; background: var(--sv-surface);"]],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(2), D_TECH("Technician-A", "ZZAUTOTEST DC03 Cara Edge"), D_CUST("DC03 Edge To Edge"),
                D_WO_APPROVED(1, "Technician-A", "S10043-17807"), D_WO_ESTIMATE(2, "S10043-17808"), D_CLEAN,
                CHECK("Work Orders > All > Tech View shows the Unassigned group (holding {Work-order-2}) and {Technician-A}'s group (holding {Work-order-1}). If the location has few work orders and the table is shorter than the window, add more work orders the same way so step 4 can scroll.")],
     doc_part2=P2("prove the Tech View table is white and edge to edge (no gutter, card or panel) at 1440 and 1536 px, with double-line group separators, a sticky header row and sideways scrolling.",
                  P, "core__work-orders__tech-regular__light__1440, core__work-orders__tech-regular__light__1536",
                  ["Supporting measurements: the header row's and first group header's left edge equals the viewport's left edge (x = 0, or the left nav's right edge if the app has one); no ancestor of the table between it and the page has a background other than white, a border-radius or a box-shadow.",
                   "Step 7 needs production List for comparison (app.shopview.com, playbook §K) or a List screenshot taken before this feature."]),
     why="SV-11324: Tech View edge to edge on white, no gutter (PRD S2-R22, design library list-screen rule).")

# DC-04 -----------------------------------------------------------------------------------------------------------------
P = ["DC-04-tech-view-header-row-1440.png", "DC-04-tech-view-all-columns-1440.png"]
case(key="DC-04", tickets=["SV-11317", "SV-11321"], pictures=P,
     title="Tech View opens on 13 default columns with small grey header labels",
     preconditions=["You are signed in as {User-B} (for example ZZAUTOTEST DC04 Fresh Columns), a user with the Admin role at {Location-A} (for example Staging Heavy Duty - 9919) who has never opened Tech View or changed its columns.",
                    W1440, W1536, PIC(*P),
                    "In the design pictures the header row starts with a collapse arrow and a position-number column, and two labels read \"Unit #\" and \"Assigned Tech\": the first two are left out of this release and the labels follow the PRD (Unit, Assigned Techs), so do not compare those.",
                    TECH("Technician-A", "ZZAUTOTEST DC04 Dan Columns"), CUST("DC04 Default Columns"),
                    "Approved work order {Work-order-1} (for example S10043-17810) for {Customer-A} is led by {Technician-A}.", CLEAN],
     steps=["Open Work Orders, click the All tab and click Tech View in the display switcher.",
            "Read the column header labels from left to right, scrolling the table sideways to see them all.",
            "Compare the size, weight and colour of the header labels with the row text under them and with the design picture.",
            "Look at the space between each pair of neighbouring header labels.",
            "Click the column chooser button.",
            "Turn on On Site, VIN/Serial # and Lead Technician, and every other column the chooser offers that is off.",
            "Press Escape.",
            "Scroll the table sideways from left to right and look at every header label.",
            "Click the density button and choose Compact, and look at the header labels.",
            "Click the density button and choose Comfortable, and look at the header labels.",
            "Widen the window to 1536 px and look at the header labels again."],
     results=["Step 2: there are 13 columns, in this order: Status, Waiting On Parts, Number, Customer, Unit, Asset, Progress, Service Advisor, Clocked In, Lines, Assigned Techs, Created on, Total price. On Site, VIN/Serial # and Lead Technician are not shown.",
              "Step 3: the header labels are small (12 px in the design, visibly smaller than the 14 px row text under them), medium weight (not bold) and grey (lighter than the dark row text), as in the design picture.",
              "Step 4: no header label touches or overlaps its neighbour; there is clear space between every pair.",
              "Step 6: On Site, VIN/Serial # and Lead Technician are offered and can be turned on.",
              "Step 8: with every column on, no header label touches, overlaps or is cut off by its neighbour, as in the all-columns design picture.",
              "Steps 9 and 10: the header labels keep the same size, weight and grey colour at Compact and at Comfortable.",
              "Step 11: at 1536 px no header label touches or overlaps its neighbour."],
     source=source([5, 7, 2], "S5-R4, S7-R7, S2-R21 and Out of Scope (rank numbers; Collapse all and Expand all)", "states core__work-orders__tech-regular__light__1440 and states__work-orders__tech-all-columns__light__1440", P, ["SV-11317", "SV-11321"]),
     divergence=("The design's header row reads \"Unit #\" and \"Assigned Tech\"; this case follows the PRD's \"Unit\" and \"Assigned Techs\" (question PQ-V03 to the product owner, not yet answered). "
                 "The design's Tech View column chooser does not offer On Site, VIN/Serial # or Lead Technician; this case follows the PRD (question W-2, not yet answered)."),
     quotes=[["S5-R4", "Until the user changes Tech View’s columns, Tech View shows these columns, in this order, as in the design: Status, Waiting On Parts, Number, Customer, Unit, Asset, Progress, Service Advisor, Clocked In, Lines, Assigned Techs, Created on, Total price (Total price subject to financial permission). On Site, VIN/Serial # and Lead Technician are off by default; each can be added with the column chooser (S2-R4). List’s columns are unchanged."],
             ["S7-R7", "In Tech View the Assigned Techs column sits immediately after Lines, matching the design. It is on by default (S5-R4) and can be removed through the column chooser (S2-R4)."],
             ["S2-R21", "Tech View’s column header labels are 12px, medium weight (500), in the secondary text color, as in the design. Labels never overlap a neighboring label."],
             ["Out of Scope", "Rank numbers (1, 2, 3, and so on) beside each Tech View row, as the design shows."],
             ["Out of Scope", "Collapse all and Expand all controls for the technician groups. Groups collapse one at a time (S2-R5, S2-R13)."],
             ["Design — Work Orders.dc.html, Tech View column header row", "font-size: 12px; font-weight: 500; color: var(--sv-text-secondary); white-space: nowrap;"]],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(2),
                "Your initials > Settings > Staff > New Staff Member: First Name and Last Name (for example ZZAUTOTEST DC04 Fresh Columns), an Email you can open with ZZAUTOTEST in it, Role Admin, at least one Department (required), Location {Location-A} > Save & Close. Accept the invitation from that email and set a password. This is {User-B}. Do not open Tech View or change any Work Orders columns as {User-B} before the test.",
                D_TECH("Technician-A", "ZZAUTOTEST DC04 Dan Columns"), D_CUST("DC04 Default Columns"), D_WO_APPROVED(1, "Technician-A", "S10043-17810"),
                "Sign out, then sign in as {User-B}.", D_CLEAN,
                CHECK("signed in as {User-B}, Work Orders > All shows List with the display switcher; Tech View has not been opened yet by {User-B}.")],
     doc_part2=P2("as a user who never opened Tech View, read the 13 default columns in order and judge the header labels' look and spacing at every density and at 1440 and 1536 px, with all optional columns on.",
                  P, "core__work-orders__tech-regular__light__1440, states__work-orders__tech-all-columns__light__1440",
                  ["Read the header labels with Playwright as exact strings and compare them in order with: Status, Waiting On Parts, Number, Customer, Unit, Asset, Progress, Service Advisor, Clocked In, Lines, Assigned Techs, Created on, Total price.",
                   "Supporting measurement for steps 4, 8 and 11: the gap between each pair of neighbouring header label boxes is at least 4 px and no box overlaps another.",
                   "Cleanup as {User-B}: turn the extra columns off again and set density to Regular. Fact: the 13-column default for a new user is also covered by C96979."]),
     why="SV-11317 (default 13 columns) and SV-11321 (header labels 12 px / 500 / grey, never overlapping), compared with the design.")

# DC-05 -----------------------------------------------------------------------------------------------------------------
P = ["DC-05-tech-view-rows-regular-light-1440.png"]
case(key="DC-05", tickets=["SV-11325", "SV-11319"], pictures=P,
     title="Tech View cells show a blue number, a thin progress bar and the advisor's avatar",
     preconditions=[USER, W1440, PIC(*P), IGNORE, TECH("Technician-A", "ZZAUTOTEST DC05 Eva Cells", True), TECH("Technician-B", "ZZAUTOTEST DC05 Finn Cells", False),
                    CUST("DC05 Cell Styles"),
                    "Approved work order {Work-order-1} (for example S10043-17812) for {Customer-A} is led by {Technician-A}, has a service advisor shown in List, and has one approved line, {Line-1} (for example \"Service - Full grease service\"), whose technician is {Technician-B}.",
                    "{Technician-B} is clocked in to {Line-1}, so List's Clocked In column shows a name for {Work-order-1}.",
                    "Work order {Work-order-2} (for example S10043-17813) for {Customer-A} is Invoiced and led by {Technician-A}.", CLEAN],
     steps=["Open Work Orders, click the All tab and click Tech View in the display switcher.",
            "Find {Work-order-1}'s row in {Technician-A}'s group.",
            "Look at the Number cell.",
            "Look at the Progress cell.",
            "Look at the Service Advisor cell.",
            "Look at the Assigned Techs cell.",
            "Look at the Waiting On Parts, Clocked In and Total price cells.",
            "Hover the first avatar in the Assigned Techs cell, then the second.",
            "Click {Work-order-1}'s number.",
            "Go back to the Work Orders page.",
            "Look at {Work-order-2}'s Number cell.",
            "Hover the small padlock next to {Work-order-2}'s number.",
            "Click List in the display switcher.",
            "Look at {Work-order-1}'s Clocked In cell."],
     results=["Step 3: the number shows in the blue used for links, the same blue as the numbers in the design picture, not in black.",
              "Step 4: a thin rounded bar with the percentage beside it in small grey text (for example 0%), as in the picture: in the design the bar is 64 × 6 px, about as long as the word \"Progress\" in the header and much thinner than the text. Any filled part of the bar is blue.",
              "Step 5: a small round avatar sits before the advisor's name: the advisor's photo, or the initials on a light-grey circle.",
              "Step 6: overlapping round avatars, {Technician-A} (the lead) first, then {Technician-B}.",
              "Step 7: Waiting On Parts shows a grey dash (-), not a blank, and Total price sits at the right of its column.",
              "Step 8: each avatar shows its technician's name when hovered.",
              "Step 9: the work order opens.",
              "Step 11: a small padlock outline icon sits right after {Work-order-2}'s number, as after the S1-359 and S1-360 numbers in the design picture.",
              "Step 12: a dark tooltip with light text opens above the padlock.",
              "Step 14: List's Clocked In cell shows the same thing in the same style as Tech View's Clocked In cell at step 7."],
     source=source([2, 1, 7], "S2-R20, S1-R9a, S2-R8, S7-R3 and S7-R6", "state core__work-orders__tech-regular__light__1440", P, ["SV-11325", "SV-11319"]),
     divergence="The design shows Clocked In as a time badge (for example 0:48); this case follows the PRD, which keeps List's display (question W-16 to the product owner, not yet answered). The design also locks Declined and Imported work orders; this case checks the padlock on an Invoiced one only.",
     quotes=[["S2-R20", "Tech View’s cells follow the design: the work order number shows as a link in the accent color; Progress shows as a thin bar with the percentage beside it; Service Advisor shows the advisor’s avatar before the name. Clocked In keeps List’s display (S5-R11)."],
             ["S1-R9a", "The switcher uses the design’s icons at 20px: List is Lucide `list`, Tech View is `user-round`, Board View is `square-kanban`. In Tech View and Board View every other icon is the design’s Lucide icon too: density (`row-height` in Tech View, `card-height` in Board View), collapse chevron (`chevron-down`), pin and unpin (`pin` / `pin-off`), Invoiced or Paid lock (`lock`), Unassigned avatar (`user-round`) and empty states (`clipboard-list`). List’s icons are unchanged."],
             ["S2-R8", "Clicking anywhere on a row, outside its own controls, opens the work order. A drag starts only after the pointer has moved a few pixels, so a click never turns into a drag."],
             ["S7-R3", "Place the lead technician first in the avatar group."],
             ["S7-R6", "Keep every involved technician discoverable by name."],
             ["Design — Work Orders.dc.html, Tech View Progress cell, bar size at Regular", 'barW: rowDensity === "small" ? "48px" : "64px"'],
             ["Design — Work Orders.dc.html, Tech View Progress cell, bar size at Regular", 'barH: rowDensity === "small" ? "4px" : "6px"'],
             ["Design — Work Orders.dc.html, Tech View Progress cell", "font-size: 12px; color: var(--sv-text-secondary); font-variant-numeric: tabular-nums;\">{{ wo.pctLabel }}"],
             ["Design — Work Orders.dc.html, Tech View Service Advisor cell", 'component-from-global-scope="SVAvatarFix" name="{{ wo.adv }}" size="{{ crewSize }}"'],
             ["Design — Work Orders.dc.html, empty cell", '<span style="color: var(--sv-text-muted);">-</span>'],
             ["Design — Work Orders.dc.html, Total price cell", "text-align: right; color: var(--sv-text-primary); font-variant-numeric: tabular-nums;\">{{ wo.total }}"],
             ["Design — Work Orders.dc.html, tooltip", "transform: translate(-50%, -100%); padding: 6px 10px; border-radius: var(--sv-radius-md); background: var(--sv-surface-inverse);"]],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(1), D_TECH("Technician-A", "ZZAUTOTEST DC05 Eva Cells", True), D_TECH("Technician-B", "ZZAUTOTEST DC05 Finn Cells", False),
                D_CUST("DC05 Cell Styles"), D_WO_APPROVED(1, "Technician-A", "S10043-17812", lineph="Line-1"), D_LINE_TECH(1, "Line-1", "Technician-B"),
                "Check in List that {Work-order-1}'s Service Advisor column shows a name. If it is empty, set the work order's service advisor on the work order page.",
                "Have {Technician-B} clock in to {Line-1} the way technicians clock in at your shop, and leave the clock running for the test. List's Clocked In column then shows {Technician-B}'s first name for {Work-order-1}.",
                D_WO_APPROVED(2, "Technician-A", "S10043-17813"), D_INVOICE(2), D_CLEAN,
                CHECK("Work Orders > All > List with {Customer-A}'s name in Search shows {Work-order-1} (Approved, a Service Advisor, Clocked In showing a name) and {Work-order-2} (Invoiced). Clear the search before you start.")],
     doc_part2=P2("one row with every styled cell filled (link number, progress, advisor avatar, two assigned technicians, a clocked-in technician) and an Invoiced row with the padlock; compare each cell with the design picture.",
                  P, "core__work-orders__tech-regular__light__1440",
                  [UNV_PHOTO, API_CLOCK,
                   "UNVERIFIED: how the service advisor is set (it may default to the creating user); record what List shows.",
                   "UNVERIFIED: how Progress is calculated (the design shows logged against estimated hours, for example 0.8 / 8.0 hrs). With a clock running the bar may show a filled part; at 0% only the empty track shows, which still satisfies step 4.",
                   "Create Invoice gotchas (playbook): an unclicked Review blocks it; a missing part number can block it; use the case's own clean customer."]),
     why="SV-11325 (number link, progress bar, advisor avatar) and SV-11319 (lock icon), compared with the design; Clocked In follows the PRD (List's display).")

# DC-06 -----------------------------------------------------------------------------------------------------------------
P = ["DC-06-tech-view-compact-light-1440.png", "DC-06-tech-view-regular-light-1440.png", "DC-06-tech-view-comfortable-light-1440.png"]
case(key="DC-06", tickets=["SV-11318"], pictures=P,
     title="Tech View status pill is List's pill and is taller only at Comfortable",
     preconditions=[USER, W1440, PIC(*P),
                    "The design pictures show the status pill without the red and blue numbers; the PRD keeps List's pill with its numbers, so compare only the pill's shape and height with the pictures.",
                    TECH("Technician-A", "ZZAUTOTEST DC06 Gia Pills"), CUST("DC06 Status Pill"),
                    "Approved work order {Work-order-1} (for example S10043-17815) for {Customer-A} is led by {Technician-A} and has one approved line, {Line-1} (for example \"Service - Full grease service\"), that is not complete and has a part {Part-A} (for example ZZAUTOTEST-PN-DC06) requested and not yet ordered, so List shows a red and a blue number on its status pill.",
                    CLEAN],
     steps=["Open Work Orders, click the All tab and click List in the display switcher.",
            "Look at {Work-order-1}'s status pill and the red and blue numbers on it.",
            "Hover the red number, then the blue number, and read each tooltip.",
            "Click Tech View in the display switcher.",
            "Look at {Work-order-1}'s status pill.",
            "Hover the red number, then the blue number, and read each tooltip.",
            "Click the density button and choose Compact.",
            "Look at the status pills and compare them with the Compact design picture.",
            "Click the density button and choose Regular.",
            "Look at the status pills and compare them with the Regular design picture.",
            "Click the density button and choose Comfortable.",
            "Look at the status pills and compare them with the Comfortable design picture.",
            "Click List in the display switcher and look at {Work-order-1}'s status pill."],
     results=["Step 5: the pill is the same pill as in List at step 2: the same colours, the same word, the same rounded shape, with the same red and blue numbers on it.",
              "Step 6: each number shows the same tooltip as in List at step 3.",
              "Steps 8 and 10: the pills are the same height at Compact and at Regular (18 px in the PRD).",
              "Step 12: at Comfortable the pills are visibly taller than at Regular (22 px in the PRD), as in the Comfortable picture.",
              "Step 13: List's pill looks exactly as at step 2; Tech View's density did not change it."],
     source=source([2, 6], "S2-R19, S6-R2a and S6-E1", "states core__work-orders__tech-compact__light__1440, core__work-orders__tech-regular__light__1440 and core__work-orders__tech-comfortable__light__1440", P, ["SV-11318"]),
     divergence="The design draws the small pill 16 px tall, while the PRD says 18 px and calls 18 and 22 px the design's two sizes; this case follows the PRD (question PQ-V04 to the product owner, not yet answered). The tester judges only \"same at Compact and Regular, taller at Comfortable\".",
     quotes=[["S2-R19", "Tech View’s Status column is the same status pill List shows in production, with the same red service-actions count and blue parts-actions count on it. Its size follows density (S6-R2a)."],
             ["S6-R2a", "In Tech View the status pill is 18px tall at Compact and Regular and 22px tall at Comfortable, the design’s two badge sizes. List’s status pill is unchanged."],
             ["S6-E1", "Density applies to Tech View rows and Board View cards on Work Orders. List keeps today’s row size, and other application tables are unchanged."],
             ["Design — Work Orders.dc.html, Tech View status badge size", 'badgeSize: rowDensity === "large" ? "md" : "sm"']],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(3), D_TECH("Technician-A", "ZZAUTOTEST DC06 Gia Pills"), D_CUST("DC06 Status Pill"),
                D_WO_APPROVED(1, "Technician-A", "S10043-17815", lineph="Line-1"),
                "On {Work-order-1}'s Lines tab open {Line-1}'s more menu (three dots) > Request part (the Add Part window): enter a Part Number (for example ZZAUTOTEST-PN-DC06), a Description (for example ZZAUTOTEST filter), Quantity 1 and a Sell Price (for example 25.00) > Save & Close. This is {Part-A}. Do not order, receive or pick it, and do not complete {Line-1}.",
                D_CLEAN,
                CHECK("Work Orders > All > List with {Customer-A}'s name in Search shows {Work-order-1} with a red number and a blue number on its status pill. If either number is missing, note what is shown and mark the case Blocked with that reason. Clear the search before you start.")],
     doc_part2=P2("the same status pill with its red and blue counts in List and Tech View, and its height at the three densities.",
                  P, "core__work-orders__tech-compact/regular/comfortable__light__1440",
                  [UNV_DENSITY,
                   "UNVERIFIED: exactly which open items the red (service actions) and blue (parts actions) numbers count on this build; the setup aims at one incomplete approved line and one requested, unordered part. Playbook: Add Part via the line's more menu > Request part is flaky (SV-5132, the window sometimes does not close); API fallback POST /api/work-orders/part/make-request with line, work_order, description, quantity, part_source_type 'vendor', part_number, sell_price, cost and part_category_id → 201 (part_category_id required, from GET /api/inventory/categories).",
                   "Supporting measurement: pill heights at Compact and Regular equal (PRD 18 px), at Comfortable larger (PRD 22 px); record the numbers."]),
     why="SV-11318: Tech View status pill = List's pill with its counts; 18/18/22 px by density (PRD), checked by eye against the design pictures.")

# DC-07 -----------------------------------------------------------------------------------------------------------------
P = ["DC-07-tech-view-row-hover-light-1440.png", "DC-07-tech-view-view-only-light-1440.png"]
case(key="DC-07", tickets=["SV-11320"], pictures=P,
     title="A six-dot grip shows on every Tech View row and group header",
     preconditions=[USER, W1440, PIC(*P), IGNORE,
                    "The view-only design picture also shows grips on the rows; the PRD shows grips only to users who can drag, so use that picture only to compare the grip's drawing.",
                    TECH("Technician-A", "ZZAUTOTEST DC07 Hana Grip"), CUST("DC07 Grip"),
                    "Approved work orders {Work-order-1} (for example S10043-17817) and {Work-order-2} (for example S10043-17818) for {Customer-A} are both led by {Technician-A}.",
                    "Estimate {Work-order-3} (for example S10043-17819) for {Customer-A} has no lead technician, so it sits in the Unassigned group.",
                    "User {User-B} (for example ZZAUTOTEST DC07 Viewer) has a role with Work orders > View but not Work orders > Create & Edit, at {Location-A}, and can sign in.",
                    CLEAN],
     steps=["Open Work Orders, click the All tab and click Tech View in the display switcher.",
            "Look at the left edge of every group header, the Unassigned header included.",
            "Look at the left edge of every work order row, {Work-order-3}'s row in Unassigned included.",
            "Hover {Work-order-1}'s row.",
            "Press on {Work-order-1}'s Customer cell, move the mouse down past {Work-order-2}'s row and release it there.",
            "Click {Work-order-1}'s Customer cell without moving the mouse.",
            "Sign out and sign in as {User-B}.",
            "Open Work Orders, click the All tab and click Tech View in the display switcher.",
            "Look at the left edge of the work order rows."],
     results=["Step 2: every group header, the Unassigned header too, shows a six-dot grip (two columns of three small grey dots) at its left edge, as in the design pictures.",
              "Step 3: every row shows the same six-dot grip at its left edge.",
              "Step 4: the row's background turns light grey and the grip stays visible, as in the row-hover picture.",
              "Step 5: the row moves although you grabbed it outside the grip, and {Work-order-1} now sits below {Work-order-2}.",
              "Step 6: the work order opens; the click did not start a drag.",
              "Step 9: no grip shows on the work order rows for {User-B}, who cannot drag."],
     source=source([9, 2, 4], "S9-R1a, S2-R8 and S4-N1", "states states__work-orders__tech-row-hover__light__1440 and states__work-orders__tech-view-only__light__1440", P, ["SV-11320"]),
     divergence="The design shows the row grips to a view-only user too; this case follows the PRD (grips only for users who can drag). Whether a view-only user, who may still reorder technician groups, sees the grip on group headers is open with the product owner (question PQ-V05, not yet answered), so step 9 checks the rows only.",
     quotes=[["S9-R1a", "In Tech View every work order row and every group header, Unassigned included, shows the design’s six-dot drag grip at its left edge, to users who can drag (S4-N1). The whole row still drags (S2-R8); the grip shows that it can."],
             ["S2-R8", "Clicking anywhere on a row, outside its own controls, opens the work order. A drag starts only after the pointer has moved a few pixels, so a click never turns into a drag."],
             ["S4-N1", "Require Work Orders create and edit permission to drag work orders or access Reassign lead technician."],
             ["Design — Work Orders.dc.html, Tech View group header grip", 'title="Drag to reorder technicians" style="width: 28px; flex: none; display: grid; place-items: center; color: var(--sv-text-muted);"'],
             ["Design — Work Orders.dc.html, Tech View row hover", 'style-hover="background: var(--sv-surface-hover);"']],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(2), D_TECH("Technician-A", "ZZAUTOTEST DC07 Hana Grip"), D_CUST("DC07 Grip"),
                D_WO_APPROVED(1, "Technician-A", "S10043-17817"), D_WO_APPROVED(2, "Technician-A", "S10043-17818"), D_WO_ESTIMATE(3, "S10043-17819"),
                'Your initials > Settings > Roles & Permissions > Create Custom Role (for example "ZZAUTOTEST DC07 View Role") > turn on Work Orders view, leave Work Orders create and edit off > Save.',
                "Your initials > Settings > Staff > New Staff Member with an email you can open (for example \"ZZAUTOTEST DC07 Viewer\"), Role = the new role, at least one Department, Location {Location-A} > Save & Close. Accept the invitation email and set a password. This is {User-B}.",
                D_CLEAN,
                CHECK("Work Orders > All > Tech View shows {Work-order-1} above {Work-order-2} in {Technician-A}'s group and {Work-order-3} in Unassigned. If {Work-order-1} is not above {Work-order-2}, drag it there before you start.")],
     doc_part2=P2("the six-dot grip on every row and group header for a user who can drag, a whole-row drag, a click that opens, and no row grips for a view-only user.",
                  P, "states__work-orders__tech-row-hover__light__1440, states__work-orders__tech-view-only__light__1440",
                  ["Step 5 with Playwright: mouse.down() on the Customer cell's centre, mouse.move() in 10 small steps to below {Work-order-2}'s row, mouse.up(); then reload and read the order to prove it saved.",
                   "Cleanup: drag {Work-order-1} back above {Work-order-2}."]),
     why="SV-11320: six-dot grip on every Tech View row and group header, Unassigned included (PRD S9-R1a).")

# DC-08 -----------------------------------------------------------------------------------------------------------------
P = ["DC-08-tech-view-group-headers-light-1440.png", "DC-08-tech-view-collapsed-light-1440.png"]
case(key="DC-08", tickets=["SV-11338", "SV-11319"], pictures=P,
     title="Tech View group header shows grip, arrow, grey initials avatar, name and count",
     preconditions=[USER, W1440, PIC(*P), IGNORE,
                    "The design's group header has no pin icon; whether Tech View keeps pinning is with the product owner, so do not judge a pin icon in this case.",
                    TECH("Technician-A", "ZZAUTOTEST DC08 Ines Header", True), TECH("Technician-B", "ZZAUTOTEST DC08 Jon Header", False), CUST("DC08 Group Header"),
                    "Approved work order {Work-order-1} (for example S10043-17821) for {Customer-A} is led by {Technician-A}.",
                    "Approved work order {Work-order-2} (for example S10043-17822) for {Customer-A} is led by {Technician-B}.",
                    "Estimate {Work-order-3} (for example S10043-17823) for {Customer-A} has no lead technician, so it sits in the Unassigned group.", CLEAN],
     steps=["Open Work Orders, click the All tab and click Tech View in the display switcher.",
            "Look at the Unassigned group header from left to right.",
            "Look at {Technician-B}'s group header from left to right.",
            "Look at {Technician-A}'s group header avatar.",
            "Hover the number at the right of {Technician-A}'s group header.",
            "Hover {Technician-B}'s avatar in the group header.",
            "Click the arrow in {Technician-A}'s group header.",
            "Click the same arrow again.",
            "Click the density button and choose Compact, and look at the group headers.",
            "Click the density button and choose Comfortable, and look at the group headers."],
     results=["Step 2: from left to right: the six-dot grip, a thin down-pointing arrow, a round light-grey avatar holding a grey outline person icon, the word Unassigned in dark semibold text, a short grey upright divider, a clipboard outline icon and the number of work orders, as in the design picture.",
              "Step 3: {Technician-B}'s avatar is a light-grey circle with the initials in dark grey (for example \"ZJ\"), like \"BM\" in the design picture, not a solid blue circle with white initials. The name is dark and semibold, about the size of the row text (14 px in the design).",
              "Step 4: {Technician-A}'s avatar is the technician's round photo.",
              "Step 5: a dark tooltip opens above the number and does not cover any column header label.",
              "Step 6: {Technician-B}'s name shows.",
              "Step 7: the group closes and its arrow turns to point right, as in the collapsed design picture.",
              "Step 8: the group opens again and the arrow points down.",
              "Steps 9 and 10: the header is shorter and its avatar smaller at Compact, taller and larger at Comfortable; the name keeps the same size."],
     source=source([2, 1], "S2-R12, S2-R10, S2-R5 and S1-R9a", "states core__work-orders__tech-regular__light__1440 and states__work-orders__tech-collapsed-one__light__1440", P, ["SV-11338", "SV-11319"]),
     divergence="SV-11338 estimates the design's header name at about 16 px; the ticket's estimated design sizes differ from the design file, which draws the name at 14 px semibold; this case follows the design file. Pinning in Tech View: Ahtasham Amjad asked Chris Ward on 14 Oct 2026 whether to keep the pin the PRD keeps (S2-R11) although the design shows none; no pin look is judged here.",
     quotes=[["S2-R12", "Each group header shows the technician’s name, avatar, and a count of the work orders currently shown in that group, after the filter view and filters are applied, so the count always matches the rows listed."],
             ["S2-R10", "Hovering a technician header or avatar reveals the technician’s name."],
             ["S2-R5", "Allow each technician group to be collapsed or expanded."],
             ["S1-R9a", "The switcher uses the design’s icons at 20px: List is Lucide `list`, Tech View is `user-round`, Board View is `square-kanban`. In Tech View and Board View every other icon is the design’s Lucide icon too: density (`row-height` in Tech View, `card-height` in Board View), collapse chevron (`chevron-down`), pin and unpin (`pin` / `pin-off`), Invoiced or Paid lock (`lock`), Unassigned avatar (`user-round`) and empty states (`clipboard-list`). List’s icons are unchanged."],
             ["Design — _ds_bundle.js (design library), staff avatar", "Photo when we have one, initials otherwise."],
             ["Design — _ds_bundle.js (design library), staff avatar without a photo", "background: color || 'var(--sv-surface-sunken)', color: color ? 'var(--sv-accent-on-solid)' : 'var(--sv-text-secondary)',"],
             ["Design — Work Orders.dc.html, Tech View group header name", "font-size: 14px; font-weight: 600; color: var(--sv-text-primary); margin-right: -12px;"],
             ["Design — Work Orders.dc.html, Tech View group header height by density", 'groupH: rowDensity === "large" ? "56px" : rowDensity === "small" ? "36px" : "44px"']],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(2), D_TECH("Technician-A", "ZZAUTOTEST DC08 Ines Header", True), D_TECH("Technician-B", "ZZAUTOTEST DC08 Jon Header", False),
                D_CUST("DC08 Group Header"), D_WO_APPROVED(1, "Technician-A", "S10043-17821"), D_WO_APPROVED(2, "Technician-B", "S10043-17822"), D_WO_ESTIMATE(3, "S10043-17823"),
                D_CLEAN, CHECK("Work Orders > All > Tech View shows the Unassigned group, {Technician-A}'s group with a photo avatar and {Technician-B}'s group with an initials avatar, each expanded.")],
     doc_part2=P2("the three kinds of group header (Unassigned, technician with photo, technician without photo), the count tooltip, collapse and expand, and header size by density.",
                  P, "core__work-orders__tech-regular__light__1440, states__work-orders__tech-collapsed-one__light__1440",
                  [UNV_PHOTO, UNV_DENSITY,
                   "Supporting measurement: the initials avatar's background is a light grey (design token --sv-surface-sunken) and its text a dark grey (--sv-text-secondary), not the accent blue rgb(56,116,255) with white text that SV-11338 reports on staging.",
                   "Cleanup: leave every group expanded."]),
     why="SV-11338 (initials avatar look) and SV-11319 (chevron, Unassigned person icon, clipboard icon) on the Tech View group header.")

# DC-09 -----------------------------------------------------------------------------------------------------------------
P = ["DC-09-board-view-detailed-light-1440.png", "DC-09-board-view-detailed-light-1536.png"]
case(key="DC-09", tickets=["SV-11323"], pictures=P,
     title="Board View runs full width with no grey rounded panel around the columns",
     preconditions=[USER, W1440, W1536, PIC(*P), IGNORE,
                    "The small map at the bottom right of the Board View pictures is an open question with the product owner, so do not judge it.",
                    TECH("Technician-A", "ZZAUTOTEST DC09 Kai Board"), CUST("DC09 Board Frame"),
                    "Approved work order {Work-order-1} (for example S10043-17825) for {Customer-A} is led by {Technician-A}.",
                    "{Location-A} has enough technicians that Board View is wider than the window (at least five columns).", CLEAN],
     steps=["Open Work Orders, click the All tab and click Board View in the display switcher.",
            "Look at the background behind the columns and at its left and right edges.",
            "Look at the outline of {Technician-A}'s column.",
            "Scroll the board sideways to its far right.",
            "Widen the window to 1536 px and look at the board again."],
     results=["Step 2: the columns sit directly on the page's light-grey background, which runs from the left edge of the page to the right edge under the toolbar; there is no extra grey rounded box, inset panel or margin around the set of columns, as in the design picture.",
              "Step 3: each column is its own white card with rounded corners and a soft shadow, with the same gap between neighbouring columns.",
              "Step 4: the Unassigned column stays at the left while the technician columns slide past it.",
              "Step 5: at 1536 px the board looks the same way, as in the 1536 px design picture."],
     source=source([3], "S3-R23 and S3-R2", "states core__work-orders__board-detailed__light__1440 and core__work-orders__board-detailed__light__1536", P, ["SV-11323"]),
     divergence="The design's small map at the bottom right of Board View is not in the PRD; it is open with the product owner (question W-5, not yet answered) and is not judged here.",
     quotes=[["S3-R23", "Board View runs full width, with no grey rounded panel around the columns, as in the design."],
             ["S3-R2", "The Unassigned column is the first column and is **fixed**: it stays in place while the user scrolls the technician columns horizontally."],
             ["Design — Work Orders.dc.html, Board View column strip", "gap: 16px; width: max-content; min-width: 100%; box-sizing: border-box; padding: 20px 16px; background: var(--sv-surface-sunken);"],
             ["Design — Work Orders.dc.html, Board View column", "border-radius: 12px; background: var(--sv-elev-1-bg); box-shadow: var(--sv-elev-1-shadow);"]],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(2), D_TECH("Technician-A", "ZZAUTOTEST DC09 Kai Board"), D_CUST("DC09 Board Frame"),
                D_WO_APPROVED(1, "Technician-A", "S10043-17825"), D_CLEAN,
                CHECK("Work Orders > All > Board View shows Unassigned first and at least five columns, with {Work-order-1} in {Technician-A}'s column, and a horizontal scroll bar under the board. If the board fits the window, add technicians with the staff step above until it does not.")],
     doc_part2=P2("Board View's frame: no wrapper panel, white rounded column cards on the light-grey page, the fixed Unassigned column, at 1440 and 1536 px.",
                  P, "core__work-orders__board-detailed__light__1440, core__work-orders__board-detailed__light__1536",
                  ["Supporting measurement: no ancestor of the column strip (between it and the page) has a border-radius, its own grey background box or an inset margin; the strip spans the full viewport width."]),
     why="SV-11323: Board View full width, no grey rounded panel (PRD S3-R23).")

# DC-10 -----------------------------------------------------------------------------------------------------------------
P = ["DC-10-board-column-headers-light-1440.png", "DC-10-board-pinned-light-1440.png"]
case(key="DC-10", tickets=["SV-11319", "SV-11338"], pictures=P,
     title="Board View column header shows grip, avatar, name, pin and count as designed",
     preconditions=[USER, W1440, PIC(*P), IGNORE,
                    TECH("Technician-A", "ZZAUTOTEST DC10 Lea Pin", True), TECH("Technician-B", "ZZAUTOTEST DC10 Max Pin", False),
                    TECH("Technician-C", "ZZAUTOTEST DC10 Nia Pin"), TECH("Technician-D", "ZZAUTOTEST DC10 Oli Pin"), CUST("DC10 Column Header"),
                    "Approved work order {Work-order-1} (for example S10043-17827) for {Customer-A} is led by {Technician-A}.",
                    "Approved work order {Work-order-2} (for example S10043-17828) for {Customer-A} is led by {Technician-B}.",
                    "Estimate {Work-order-3} (for example S10043-17829) for {Customer-A} has no lead technician, so it sits in the Unassigned column.",
                    "No technician is pinned in your Board View.", CLEAN],
     steps=["Open Work Orders, click the All tab and click Board View in the display switcher.",
            "Look at the Unassigned column header from left to right.",
            "Look at {Technician-B}'s column header from left to right.",
            "Look at the avatar in {Technician-A}'s column header.",
            "Click the pin icon in {Technician-B}'s column header.",
            "Look at the pin icon in {Technician-B}'s column header.",
            "Click the pin icon in {Technician-A}'s column header.",
            "Click the pin icon in {Technician-C}'s column header.",
            "Hover the pin icon in {Technician-D}'s column header.",
            "Click the pin icons of {Technician-B}, {Technician-A} and {Technician-C} to unpin them."],
     results=["Step 2: a round light-grey avatar with a grey outline person icon, the word Unassigned in dark semibold text, a short grey divider, a clipboard outline icon and the number of work orders. The Unassigned header has no grip and no pin, as in the design picture.",
              "Step 3: the six-dot grip, a light-grey circle with the initials in dark grey (not a solid blue circle with white initials), the name in dark semibold text, a grey outline pin icon, a short divider, the clipboard icon and the number, as in the design picture.",
              "Step 4: {Technician-A}'s avatar is the round photo.",
              "Step 6: the icon is now a pin with a slash through it, in blue, as on the pinned columns in the pinned design picture.",
              "Step 9: the pin icons on the columns that are not pinned look faded and the hover text reads \"You can pin up to 3 technicians.\"",
              "Step 10: every technician column header shows the grey outline pin again."],
     source=source([3, 1], "S3-R12, S3-R7, S3-R8 and S1-R9a", "states core__work-orders__board-detailed__light__1440 and states__work-orders__board-pinned-two__light__1440", P, ["SV-11319", "SV-11338"]),
     divergence="SV-11338 estimates the design's header name at about 16 px; the ticket's estimated design sizes differ from the design file, which draws the name at 14 px semibold; this case follows the design file. The design allows five pins; this case follows the PRD's limit of three.",
     quotes=[["S3-R12", "Each column header shows the technician’s name, avatar, and a count of the work orders currently shown in that column, after the filter view and filters are applied, so the count always matches the cards listed."],
             ["S3-R7", "Allow users to pin a technician from the column header."],
             ["S3-R8", "At three pinned technicians, disable other pin controls with: “You can pin up to 3 technicians.”"],
             ["S1-R9a", "The switcher uses the design’s icons at 20px: List is Lucide `list`, Tech View is `user-round`, Board View is `square-kanban`. In Tech View and Board View every other icon is the design’s Lucide icon too: density (`row-height` in Tech View, `card-height` in Board View), collapse chevron (`chevron-down`), pin and unpin (`pin` / `pin-off`), Invoiced or Paid lock (`lock`), Unassigned avatar (`user-round`) and empty states (`clipboard-list`). List’s icons are unchanged."],
             ["Design — Work Orders.dc.html, Board View Unassigned avatar", "width: 28px; height: 28px; flex: none; border-radius: 50%; display: grid; place-items: center; background: var(--sv-surface-sunken); color: var(--sv-text-secondary);"],
             ["Design — Work Orders.dc.html, Board View column header name", "font-size: 14px; font-weight: 600; color: var(--sv-text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: -8px;"],
             ["Design — _ds_bundle.js (design library), staff avatar without a photo", "background: color || 'var(--sv-surface-sunken)', color: color ? 'var(--sv-accent-on-solid)' : 'var(--sv-text-secondary)',"]],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(2), D_TECH("Technician-A", "ZZAUTOTEST DC10 Lea Pin", True), D_TECH("Technician-B", "ZZAUTOTEST DC10 Max Pin", False),
                D_TECH("Technician-C", "ZZAUTOTEST DC10 Nia Pin"), D_TECH("Technician-D", "ZZAUTOTEST DC10 Oli Pin"), D_CUST("DC10 Column Header"),
                D_WO_APPROVED(1, "Technician-A", "S10043-17827"), D_WO_APPROVED(2, "Technician-B", "S10043-17828"), D_WO_ESTIMATE(3, "S10043-17829"),
                "Work Orders > All > Board View: if any column header shows a filled or slashed pin, click it to unpin that technician and write down who, so you can pin them back after the case.",
                D_CLEAN, CHECK("Board View shows Unassigned first, then columns for {Technician-A}, {Technician-B}, {Technician-C} and {Technician-D} (scroll sideways if needed), none pinned.")],
     doc_part2=P2("the Unassigned and technician column headers (photo and initials avatars), the pin and unpin icons, and the faded pins with the limit message at three pins.",
                  P, "core__work-orders__board-detailed__light__1440, states__work-orders__board-pinned-two__light__1440",
                  [UNV_PHOTO, "Fact (C368131 / T-02 setup): pins are per user; the pin button's tooltip reads \"Pin column\" on the QA build of 14 Oct.",
                   "Cleanup: unpin the three technicians and pin back anyone unpinned in Part 1."]),
     why="SV-11319 (pin, pin-off, Unassigned person, clipboard icons) and SV-11338 (initials avatar look) on the Board View column header.")

# DC-11 -----------------------------------------------------------------------------------------------------------------
P = ["DC-11-board-card-detailed-light-1440.png", "DC-11-board-card-compact-light-1440.png"]
case(key="DC-11", tickets=["SV-11337"], pictures=P,
     title="Board View card layout and text sizes match the design at each density",
     preconditions=[USER, W1440, PIC(*P), IGNORE,
                    "The design cards also show the estimated hours and the created date, which are not default fields, and the Compact picture hides the hours, the progress bar and the money; the PRD says density never changes what is shown, so compare only the layout and the text sizes.",
                    TECH("Technician-A", "ZZAUTOTEST DC11 Pia Card"), TECH("Technician-B", "ZZAUTOTEST DC11 Quinn Card"), CUST("DC11 Board Card"),
                    "Approved work order {Work-order-1} (for example S10043-17831) for {Customer-A}, on an asset with a unit number (for example TRK-118, 2022 Freightliner M2), is led by {Technician-A} and has one approved line, {Line-1} (for example \"Service - Full grease service\"), whose technician is {Technician-B}.",
                    "Work order {Work-order-2} (for example S10043-17832) for {Customer-A} is Invoiced and led by {Technician-A}.",
                    "In Board View, Fields to display shows the default fields with Line technicians also turned on.", CLEAN],
     steps=["Open Work Orders, click the All tab and click Board View in the display switcher.",
            "Look at {Work-order-1}'s card from top to bottom.",
            "Compare the size and weight of the number, the customer name, the unit and asset line and the total price with each other and with the design picture.",
            "Look at {Work-order-2}'s card next to its number.",
            "Click the density button and choose Compact, and look at {Work-order-1}'s card.",
            "Click the density button and choose Comfortable, and look at {Work-order-1}'s card."],
     results=["Step 2: the top line shows the number in blue at the left and the status pill at the right. Below it the customer name in dark text, then a smaller grey line with the unit and the asset separated by a dot (for example TRK-118 · 2022 Freightliner M2). Then a thin blue progress bar across the card, a thin divider, and the line technicians as overlapping round avatars at the left with the total price at the right. The card is white with rounded corners and a thin grey border, as in the Detailed design picture.",
              "Step 3: the number, the customer name and the total price are the same size as each other (14 px in the design) and the same medium weight; none is bolder or larger than the others. The unit and asset line is clearly smaller (12 px in the design) and grey. Side by side with the design picture, the customer name is not bolder or larger than the number.",
              "Step 4: a small padlock outline icon sits right after {Work-order-2}'s number.",
              "Step 5: the card has less space around its content but shows the same fields and values, and every text keeps the same size as at step 3.",
              "Step 6: the card has more space around its content, shows the same fields and values, and every text keeps the same size as at step 3."],
     source=source([3, 5, 6, 7], "S5-R13, S5-R3, S3-R5, S6-R2, S6-R6 and S7-R1", "states core__work-orders__board-detailed__light__1440 and core__work-orders__board-compact__light__1440", P, ["SV-11337"]),
     divergence=("SV-11337 estimates the design's card text at about 15 px for the number, 15 to 16 px semibold for the customer, 13 px for the unit and asset line and 16 px semibold for the total; "
                 "the ticket's estimated design sizes differ from the design file, which draws 14, 14, 12 and 14 px at medium weight on every card size; this case follows the design file. "
                 "The design's Compact card hides the hours, the progress bar and the money; this case follows the PRD (density never changes what is shown). "
                 "Whether the card's status pill is the design's pill or List's pill is open with the product owner (question PQ-V13, not yet answered), so only its place is judged."),
     quotes=[["S5-R13", "Board View’s default selection is lead technician name, work order number, customer, unit number, asset, progress, total price, and mandatory status, subject to financial permission."],
             ["S5-R3", "Work order number, unit number when present, and status are mandatory and cannot be deselected."],
             ["S3-R5", "Keep each card’s status badge in a fixed position."],
             ["S6-R2", "Density adjusts spacing and the size of rows, cards, and their elements."],
             ["S6-R6", "Changing density never changes which fields, columns, or values are displayed."],
             ["S7-R1", "Board View cards (when the line technicians field is on) and a new optional Assigned Techs column in Tech View show a compact avatar group: the lead technician plus the distinct technicians assigned to work order lines. List does not get this column."],
             ["Design — Work Orders.dc.html, Board View card number", "min-width: 0; font-size: 14px; font-weight: 500; color: {{ wo.idColor }};"],
             ["Design — Work Orders.dc.html, Board View card customer", "font-size: 14px; font-weight: 500; color: {{ wo.titleColor }};"],
             ["Design — Work Orders.dc.html, Board View card unit and asset line", "font-size: 12px; font-weight: 500; color: var(--sv-text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;\">{{ wo.assetLine }}"],
             ["Design — Work Orders.dc.html, Board View card total price", "font-size: 14px; font-weight: 500; color: var(--sv-text-primary); font-variant-numeric: tabular-nums;\">{{ wo.total }}"]],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(2), D_TECH("Technician-A", "ZZAUTOTEST DC11 Pia Card"), D_TECH("Technician-B", "ZZAUTOTEST DC11 Quinn Card"),
                D_CUST("DC11 Board Card"), D_WO_APPROVED(1, "Technician-A", "S10043-17831", lineph="Line-1"), D_LINE_TECH(1, "Line-1", "Technician-B"),
                D_WO_APPROVED(2, "Technician-A", "S10043-17832"), D_INVOICE(2),
                "Work Orders > All > Board View > Fields to display: keep the default fields on and turn Line technicians on.", D_CLEAN,
                CHECK("Board View shows {Work-order-1}'s card in {Technician-A}'s column with the unit and asset line, a progress bar, two avatars and a total, and {Work-order-2}'s card (Invoiced) in the same column.")],
     doc_part2=P2("the Board View card's layout and text sizes against the design at Regular, Compact and Comfortable.",
                  P, "core__work-orders__board-detailed__light__1440, core__work-orders__board-compact__light__1440",
                  [UNV_DENSITY,
                   "Supporting measurement: computed font-size and font-weight of the number, customer, unit · asset line and total (design 14/500, 14/500, 12/500, 14/500) at each density. Fact: the staging build measured 14/14/12/14 px at weight 500 on 14 Oct (SV-11337); SV-11337 compared with a design estimate that differs from the design file. Ahtasham Amjad is to be asked by the QA lead what he measured against."]),
     why="SV-11337: Board card typography and density; follows the design file (14/14/12/14 px, weight 500), not the ticket's estimate.")

# DC-12 -----------------------------------------------------------------------------------------------------------------
P = ["DC-12-board-card-hover-button-light-1440.png", "DC-12-board-card-menu-light-1440.png", "DC-12-tech-row-menu-locked-light-1440.png"]
case(key="DC-12", tickets=[], pictures=P,
     title="More actions button and menu on cards and rows look as in the design",
     preconditions=[USER, W1440, PIC(*P), IGNORE,
                    "The design's menu words read \"Reassign Lead Tech\" and \"Unassign\", and its locked note reads \"Invoiced · can't be reassigned\"; the case follows the PRD's words, so compare only the look and the place of the button and the menu.",
                    TECH("Technician-A", "ZZAUTOTEST DC12 Rae Menu"), CUST("DC12 More Actions"),
                    "Approved work order {Work-order-1} (for example S10043-17834) for {Customer-A} is led by {Technician-A}.",
                    "Work order {Work-order-2} (for example S10043-17835) for {Customer-A} is Invoiced and led by {Technician-A}.", CLEAN],
     steps=["Open Work Orders, click the All tab and click Board View in the display switcher.",
            "Look at {Work-order-1}'s card without hovering it.",
            "Hover {Work-order-1}'s card.",
            "Click the three-dot button that appears.",
            "Press Escape.",
            "Click Tech View in the display switcher.",
            "Hover {Work-order-1}'s row.",
            "Click the three-dot button at the right end of the row.",
            "Press Escape.",
            "Hover {Work-order-2}'s row and click its three-dot button.",
            "Hover the greyed-out Reassign lead technician item."],
     results=["Step 2: no three-dot button shows on the card.",
              "Step 3: the card's border darkens and a soft shadow appears, and a small white square button with three dots appears at the card's top right, over the right end of the status pill, as in the hover design picture.",
              "Step 4: a white menu opens below the button, lined up with the button's right edge, with Reassign lead technician as its first item and an outline icon before each item, as in the menu design picture.",
              "Step 7: the row turns light grey and a three-dot button appears at the right end of the row.",
              "Step 8: the same kind of white menu opens below the button, lined up with its right edge.",
              "Step 10: the menu's Reassign lead technician item is greyed out and cannot be chosen, as in the locked-menu design picture.",
              "Step 11: the tooltip reads \"The lead technician can’t be changed once a work order is Invoiced or Paid.\""],
     source=source([3, 4], "S3-R13, S3-R14, S4-R4 and S4-N6", "states states__work-orders__board-card-menu-button-over-badge__light__1440, states__work-orders__board-card-menu__light__1440 and states__work-orders__tech-row-menu-locked__light__1440", P),
     divergence="Ahtasham Amjad asked Chris Ward on 14 Oct 2026 whether More actions may cover part of the status pill (the design does not show the keyboard-focus state); until he answers, no result is set for how much of the pill the button covers. The design's menu words differ from the PRD's; this case follows the PRD.",
     quotes=[["S3-R13", "Reveal the card’s more-actions overlay on hover or keyboard focus."],
             ["S3-R14", "Include Reassign lead technician in the card’s more-actions menu."],
             ["S4-R4", "The card or row more-actions menu opens the Reassign lead technician dialog."],
             ["S4-N6", "The disabled Reassign lead technician action on an Invoiced or Paid work order shows this tooltip: “The lead technician can’t be changed once a work order is Invoiced or Paid.”"],
             ["Design — Work Orders.dc.html, more-actions menu", "transform: translateX(-100%); width: 216px; padding: 4px; border-radius: var(--sv-radius-md); background: var(--sv-surface);"]],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(3), D_TECH("Technician-A", "ZZAUTOTEST DC12 Rae Menu"), D_CUST("DC12 More Actions"),
                D_WO_APPROVED(1, "Technician-A", "S10043-17834"), D_WO_APPROVED(2, "Technician-A", "S10043-17835"), D_INVOICE(2), D_CLEAN,
                CHECK("Board View shows {Work-order-1} and {Work-order-2} (Invoiced) in {Technician-A}'s column.")],
     doc_part2=P2("the More actions button and menu on a Board card and a Tech View row, and the locked menu on an Invoiced work order.",
                  P, "states__work-orders__board-card-menu-button-over-badge__light__1440, states__work-orders__board-card-menu__light__1440, states__work-orders__tech-row-menu-locked__light__1440",
                  ["Supporting measurement: the menu's top is at or below the button's bottom and its right edge within 4 px of the button's right edge.",
                   "UNVERIFIED: whether the disabled item's reason shows as a tooltip on hover or as a note inside the menu (the design shows a note); record what the build shows; the words are judged against the PRD either way."]),
     why="Visual inventory: More actions hover button and menu on cards and rows (no PO ticket); PRD S3-R13, S3-R14, S4-R4, S4-N6.")

# DC-13 -----------------------------------------------------------------------------------------------------------------
P = ["DC-18-tech-technician-chosen-light-1440.png", "DC-13-tech-search-empty-light-1440.png"]
case(key="DC-13", tickets=["SV-11319"], pictures=P,
     title="Empty groups, empty columns and no-results pages look as designed",
     preconditions=[USER, W1440, PIC(*P),
                    "The first picture shows an empty group at its bottom (Cameron Williamson, 0); the second shows the search-only empty page. The design's words differ from the PRD's (\"No work orders assigned\", \"No results for …\"); the case follows the PRD's words, so compare the look and the place only.",
                    TECH("Technician-A", "ZZAUTOTEST DC13 Sam Idle", extra=" who leads no work orders and is used by this case only"), CLEAN],
     steps=["Open Work Orders, click the All tab and click Tech View in the display switcher.",
            "Look at {Technician-A}'s group.",
            "Click Board View in the display switcher.",
            "Look at {Technician-A}'s column.",
            "Click the Status filter and tick Paid.",
            "Type zzzz in Search.",
            "Look at the page.",
            "Click List in the display switcher and look at the page.",
            "Click Tech View in the display switcher and look at the page.",
            "Click Clear all filters.",
            "Type zzzz in Search.",
            "Look at the page.",
            "Click List in the display switcher and look at the page."],
     results=["Step 2: under {Technician-A}'s header the group shows the words \"No work orders\" in grey, centred, with the clipboard outline icon before them, and no rows, as in the empty group at the bottom of the first design picture.",
              "Step 4: the empty column shows a dashed rounded box holding a small light-grey circle with the clipboard outline icon and the text \"Drag a work order here to assign it\".",
              "Step 7: the board is replaced by an empty state centred on the page: a round grey icon, the title \"No work orders match these filters\", the hint \"Try removing a filter to widen your results.\" and a Clear all filters button.",
              "Step 8: List shows the same empty state, with the same icon, words and button.",
              "Step 9: Tech View shows the same empty state as List.",
              "Step 12: Tech View shows \"No work orders match the search \"zzzz\".\" with no button, centred like the search-only design picture.",
              "Step 13: List shows the same message as Tech View at step 12."],
     source=source([2, 3, 1], "S2-R15, S3-R20, S1-R9a, S1-N1, S1-N1a and S1-N1b", "states states__work-orders__tech-technician-chosen__light__1440 (empty group) and states__work-orders__tech-search-empty__light__1440, and the empty-column block of Work Orders.dc.html", P, ["SV-11319"]),
     divergence=("The design's empty texts read \"No work orders assigned\" and \"No results for …\"; this case follows the PRD's words (question W-13 to the product owner, not yet answered). "
                 "The design's no-results page uses List's magnifier icon while S1-R9a gives empty states the clipboard icon (question PQ-V06, not yet answered), so steps 7 to 13 compare with List and do not judge which icon."),
     quotes=[["S2-R15", "A technician group with no work orders under the current filters, and an empty Unassigned group, show the text “No work orders”."],
             ["S3-R20", "A technician column with no work orders under the current filters, and an empty Unassigned column, show “Drag a work order here to assign it” to a user who can reassign work orders (S4-N1), and “No work orders” to everyone else."],
             ["S1-R9a", "The switcher uses the design’s icons at 20px: List is Lucide `list`, Tech View is `user-round`, Board View is `square-kanban`. In Tech View and Board View every other icon is the design’s Lucide icon too: density (`row-height` in Tech View, `card-height` in Board View), collapse chevron (`chevron-down`), pin and unpin (`pin` / `pin-off`), Invoiced or Paid lock (`lock`), Unassigned avatar (`user-round`) and empty states (`clipboard-list`). List’s icons are unchanged."],
             ["S1-N1", "When the active filters or a search return no work orders, Tech View and Board View show the same empty state as the List, with the same messages and action."],
             ["S1-N1a", "With filters active, with or without a search, the empty state reads “No work orders match these filters”, then “Try removing a filter to widen your results.”, with a Clear all filters button."],
             ["S1-N1b", "With only a search active, the empty state reads “No work orders match the search \"{search}\".” and shows no button."],
             ["Design — Work Orders.dc.html, Board View empty column", "border-radius: 8px; border: 1px dashed var(--sv-border-strong); background: var(--sv-surface);"],
             ["Design — Work Orders.dc.html, Board View empty column", "font-size: 12px; font-weight: 500; color: var(--sv-text-secondary);\">Drag a work order here to assign it"],
             ["Design — SKILL.md (design library), empty states", "Empty-state illustrations are a deliberate omission — Shopview empty states are text only."]],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(2), D_TECH("Technician-A", "ZZAUTOTEST DC13 Sam Idle") + " Do not make {Technician-A} the lead of any work order.",
                D_CLEAN,
                CHECK("Work Orders > All > Tech View shows a group for {Technician-A} with no work order rows. If the location holds no Paid work orders at all, step 7 still applies because zzzz matches nothing.")],
     doc_part2=P2("the empty group, the empty column, the filtered empty state and the search-only empty state in Tech View and Board View, compared with List.",
                  P, "states__work-orders__tech-technician-chosen__light__1440, states__work-orders__tech-search-empty__light__1440",
                  ["The design state states__work-orders__board-technician-chosen__light__1440 renders the same as board-detailed (no empty column on screen), so no Board empty-column picture is attached; the empty column's look comes from Work Orders.dc.html lines 229 to 234 (dashed box, 32 px light-grey circle with the clipboard-list icon, the two texts).",
                   "Fact (playbook): a filter list may close the moment one option is ticked (SV-8824); reopen it before the next tick.",
                   "Cleanup: Clear all filters and empty Search."]),
     why="SV-11319 (clipboard-list empty-state icon) and the visual inventory's empty states; the no-technicians state is not included because the PRD lists it under design work still required from Branko.")

# DC-14 -----------------------------------------------------------------------------------------------------------------
P = ["DC-14-board-drag-allowed-light-1440.png", "DC-14-board-drag-refused-light-1440.png", "DC-14-tech-drag-reorder-light-1440.png"]
case(key="DC-14", tickets=[], pictures=P,
     title="Dragging shows a blue drop line, and a refused drop shows a dark message",
     preconditions=[USER, W1440, PIC(*P), IGNORE,
                    "The design's refusal message reads \"Invoiced · can't be reassigned\"; the PRD sets no words for it, so compare only its look and place.",
                    TECH("Technician-A", "ZZAUTOTEST DC14 Tia Drag"), TECH("Technician-B", "ZZAUTOTEST DC14 Uma Drag"), CUST("DC14 Drag Looks"),
                    "Approved work orders {Work-order-1} (for example S10043-17839) and {Work-order-2} (for example S10043-17840) for {Customer-A} are both led by {Technician-A}.",
                    "Estimate {Work-order-3} (for example S10043-17841) for {Customer-A} has no lead technician and no approved line, so it sits in Unassigned.",
                    "Work order {Work-order-4} (for example S10043-17842) for {Customer-A} is Invoiced and led by {Technician-B}.", CLEAN],
     steps=["Open Work Orders, click the All tab and click Board View in the display switcher.",
            "Press on {Work-order-3}'s card in Unassigned and drag it over {Technician-A}'s column, keeping the mouse button down.",
            "Release the mouse button.",
            "Press on {Work-order-4}'s card and drag it over {Technician-A}'s column, keeping the mouse button down.",
            "Release the mouse button.",
            "Click Tech View in the display switcher.",
            "Press on {Work-order-1}'s row and drag it to just below {Work-order-2}'s row, keeping the mouse button down.",
            "Release the mouse button.",
            "Press on the grip of {Technician-A}'s group header and drag it below {Technician-B}'s group, keeping the mouse button down.",
            "Release the mouse button."],
     results=["Step 2: the dragged card looks faded and a thin blue line shows where it will land in {Technician-A}'s column, as in the allowed-drop design picture.",
              "Step 3: the card lands in {Technician-A}'s column where the blue line was.",
              "Step 4: no blue line shows over {Technician-A}'s column; instead a small dark message with a no-entry icon (a circle with a slash) appears at the top of the column, as in the refused-drop design picture.",
              "Step 5: {Work-order-4} stays in {Technician-B}'s column.",
              "Step 7: a thin blue line shows between the rows where the row will land, as in the reorder design picture.",
              "Step 8: {Work-order-1} now sits below {Work-order-2}.",
              "Step 9: a thin blue line shows between the groups where {Technician-A}'s group will land.",
              "Step 10: {Technician-A}'s group now sits below {Technician-B}'s group."],
     source=source([9, 4], "S9-R1, S9-R2, S4-N2 and S4-N7", "states states__work-orders__board-drag-allowed__light__1440, states__work-orders__board-drag-refused-locked__light__1440 and states__work-orders__tech-drag-reorder__light__1440", P),
     divergence="The design's refusal words differ from the PRD, which sets none for this message; only the message's look is judged.",
     quotes=[["S9-R1", "Allow dragging work orders within or between technician groups/columns in Tech View and Board View."],
             ["S9-R2", "Users with Work Orders view permission can reorder technician groups and columns. The order is saved per user."],
             ["S4-N2", "Do not allow the lead technician to change in Invoiced or Paid status. An Invoiced or Paid work order can still be dragged to reorder it within its current technician (or within Unassigned), but it cannot be moved to another technician, to Unassigned, or out of Unassigned. Declined and Complete work orders can be moved freely, as today."],
             ["S4-N7", "Visually indicate that an Invoiced or Paid work order can only be reordered within its current technician, not moved to another one."],
             ["Design — Work Orders.dc.html, drop line", "border-radius: 2px; background: var(--sv-accent); pointer-events: none; z-index: 350;"],
             ["Design — Work Orders.dc.html, refused drop message", "border-radius: 6px; background: var(--sv-surface-inverse); color: var(--sv-text-inverse); font-size: 12px; font-weight: 500;"],
             ["Design — Work Orders.dc.html, dragged card", 'style.opacity = "0.4";']],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(3), D_TECH("Technician-A", "ZZAUTOTEST DC14 Tia Drag"), D_TECH("Technician-B", "ZZAUTOTEST DC14 Uma Drag"),
                D_CUST("DC14 Drag Looks"), D_WO_APPROVED(1, "Technician-A", "S10043-17839"), D_WO_APPROVED(2, "Technician-A", "S10043-17840"),
                D_WO_ESTIMATE(3, "S10043-17841"), D_WO_APPROVED(4, "Technician-B", "S10043-17842"), D_INVOICE(4), D_CLEAN,
                CHECK("Board View shows {Work-order-3} in Unassigned, {Work-order-1} above {Work-order-2} in {Technician-A}'s column and {Work-order-4} (Invoiced) in {Technician-B}'s column; in Tech View {Technician-A}'s group sits above {Technician-B}'s.")],
     doc_part2=P2("the drag looks: faded card and blue drop line on an allowed drop, the dark refusal message on a refused drop, and the blue line for row and group reorder.",
                  P, "states__work-orders__board-drag-allowed__light__1440, states__work-orders__board-drag-refused-locked__light__1440, states__work-orders__tech-drag-reorder__light__1440",
                  ["Use Playwright mouse.down() / mouse.move() in small steps and take the screenshot BEFORE mouse.up(); HTML5 drag-and-drop may need page.dragAndDrop or dispatching dragstart/dragover events if plain mouse moves do not start a drag (record which worked).",
                   UNV_ESTIMATE_LEAD,
                   "Cleanup: move {Work-order-3} back to Unassigned (More actions > Reassign lead technician > Unassigned), drag {Work-order-1} back above {Work-order-2}, and drag {Technician-A}'s group back above {Technician-B}'s."]),
     why="Visual inventory: drag affordances (drop line, faded card, refusal message) in Board View and Tech View (no PO ticket).")

# DC-15 -----------------------------------------------------------------------------------------------------------------
P = ["DC-15-tech-row-hover-light-1440.png", "DC-15-board-card-hover-light-1440.png", "DC-15-avatar-hover-light-1440.png"]
case(key="DC-15", tickets=[], pictures=P,
     title="Hover turns a row light grey, darkens a card border and shows dark name bubbles",
     preconditions=[USER, W1440, PIC(*P), IGNORE, TECH("Technician-A", "ZZAUTOTEST DC15 Vic Hover"), TECH("Technician-B", "ZZAUTOTEST DC15 Wes Hover"), CUST("DC15 Hover Looks"),
                    "Approved work order {Work-order-1} (for example S10043-17844) for {Customer-A} is led by {Technician-A} and has one approved line, {Line-1} (for example \"Service - Full grease service\"), whose technician is {Technician-B}.",
                    "In Board View, Fields to display has Line technicians turned on.", CLEAN],
     steps=["Open Work Orders, click the All tab and click Tech View in the display switcher.",
            "Hover {Work-order-1}'s row.",
            "Hover the first avatar in the row's Assigned Techs cell.",
            "Click Board View in the display switcher.",
            "Hover {Work-order-1}'s card.",
            "Hover the first avatar at the bottom left of the card."],
     results=["Step 2: the row's background turns light grey; nothing in the row moves or grows, as in the row-hover design picture.",
              "Step 3: a small dark bubble with light text shows {Technician-A}'s name above the avatar, as in the avatar-hover design picture.",
              "Step 5: the card's border darkens and a soft shadow appears; the card does not grow or move, as in the card-hover design picture.",
              "Step 6: the same small dark bubble shows {Technician-A}'s name above the avatar."],
     source=source([2, 3, 7], "S2-R10, S7-R2 and S3-R13", "states states__work-orders__tech-row-hover__light__1440, states__work-orders__board-card-hover__light__1440 and states__work-orders__tech-avatar-stack-hover__light__1440", P),
     quotes=[["S2-R10", "Hovering a technician header or avatar reveals the technician’s name."],
             ["S7-R2", "Use each visible avatar’s own visible area as its hover target."],
             ["S3-R13", "Reveal the card’s more-actions overlay on hover or keyboard focus."],
             ["Design — README.md (design library), hover", "Hover is a colour shift plus a lift (elev-1 → elev-2), never a scale."],
             ["Design — _ds_bundle.js (design library), avatar group", "Overlapping avatars, last one a +n counter. Hovering a circle names the tech; hovering +n lists the rest."],
             ["Design — _ds_bundle.js (design library), avatar group name bubble", "bottom: 'calc(100% + 6px)',"],
             ["Design — Work Orders.dc.html, Tech View row hover", 'style-hover="background: var(--sv-surface-hover);"']],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(3), D_TECH("Technician-A", "ZZAUTOTEST DC15 Vic Hover"), D_TECH("Technician-B", "ZZAUTOTEST DC15 Wes Hover"),
                D_CUST("DC15 Hover Looks"), D_WO_APPROVED(1, "Technician-A", "S10043-17844", lineph="Line-1"), D_LINE_TECH(1, "Line-1", "Technician-B"),
                "Work Orders > All > Board View > Fields to display: turn Line technicians on.", D_CLEAN,
                CHECK("Tech View shows {Work-order-1} in {Technician-A}'s group with two avatars in Assigned Techs; Board View shows its card with two avatars at the bottom left.")],
     doc_part2=P2("the hover looks of a Tech View row, a Board View card and the avatar name bubbles.",
                  P, "states__work-orders__tech-row-hover__light__1440, states__work-orders__board-card-hover__light__1440, states__work-orders__tech-avatar-stack-hover__light__1440",
                  ["Supporting measurement: the hovered row's and card's bounding boxes are identical before and during hover (no scale, no shift)."]),
     why="Visual inventory: hover states (row, card, avatar bubble) and the design library's hover rule (no PO ticket).")

# DC-16 -----------------------------------------------------------------------------------------------------------------
P = ["DC-16-tech-view-dark-1440.png", "DC-16-board-view-dark-1440.png"]
case(key="DC-16", tickets=[], pictures=P, marker=MARK_DARK,
     title="Tech View and Board View in the Dark theme (on hold until scope is decided)",
     preconditions=[USER, W1440, PIC(*P), TECH("Technician-A", "ZZAUTOTEST DC16 Xia Dark"), CUST("DC16 Dark Theme"),
                    "Approved work order {Work-order-1} (for example S10043-17846) for {Customer-A} is led by {Technician-A}.", CLEAN],
     steps=["Open Work Orders, click the All tab and click Tech View in the display switcher.",
            "Click your initials (top right) and look for a theme or Dark mode option.",
            "If a Dark option exists, turn it on and look at Tech View, then click Board View and look at it."],
     results=["Step 2: no expected result is set yet. The PRD does not say whether Tech View and Board View must support the Dark theme the design offers; this is with the product owner. Write down whether the app offers a Dark theme.",
              "Step 3: no expected result is set yet. If a Dark theme exists, keep screenshots of Tech View and Board View beside the attached dark design pictures for the product owner; do not mark the case passed or failed."],
     source=source([2, 3], "(no sentence about themes)", "states core__work-orders__tech-regular__dark__1440 and core__work-orders__board-detailed__dark__1440", P),
     divergence="The design offers a Dark theme and its library asks for every screen to be checked in both themes; the PRD is silent, so this case is held until the product owner answers question W-15 (not yet answered).",
     quotes=[["Design — SKILL.md (design library), checklist", "Rendered and checked in **both** themes (`ShopviewTheme.set('dark')`)."]],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(2), D_TECH("Technician-A", "ZZAUTOTEST DC16 Xia Dark"), D_CUST("DC16 Dark Theme"),
                D_WO_APPROVED(1, "Technician-A", "S10043-17846"), D_CLEAN,
                CHECK("Work Orders > All > Tech View shows {Technician-A}'s group with {Work-order-1}.")],
     doc_part2=P2("held: record whether the build offers a Dark theme and capture Tech View and Board View in it for the product owner; no verdict until question W-15 is answered.",
                  P, "core__work-orders__tech-regular__dark__1440, core__work-orders__board-detailed__dark__1440",
                  ["UNVERIFIED: whether the app has any theme switch; the design's switch is ShopviewTheme.set('dark') (theme-toggle.js in the design library). Playwright emulateMedia with colorScheme 'dark' may also be tried; record the effect."]),
     why="Visual inventory: the design's Dark theme renders; held because the PRD is silent on theme scope (W-15).")

# DC-17 -----------------------------------------------------------------------------------------------------------------
P = ["DC-17-tech-view-1024-light.png", "DC-17-board-view-1280-light.png"]
case(key="DC-17", tickets=["SV-11321"], pictures=P,
     title="No labels overlap in the toolbar and headers from 1024 to 1920 px wide",
     preconditions=[USER, "Your screen is at least 1920 px wide, or you can set the browser window to 1024, 1280, 1366, 1440, 1536 and 1920 px wide, with the browser zoom at 100%.",
                    PIC(*P), IGNORE,
                    TECH("Technician-A", "ZZAUTOTEST DC17 Maximiliana Abernathy-Kowalczyk", extra=" with a long name"), CUST("DC17 Widths"),
                    "Approved work order {Work-order-1} (for example S10043-17848) for {Customer-A} is led by {Technician-A}.", CLEAN],
     steps=["Open Work Orders, click the All tab and click Tech View in the display switcher.",
            "Set the window to 1024 px wide and look at the toolbar and the column header row.",
            "Set the window to 1280 px wide and look again.",
            "Set the window to 1366 px wide and look again.",
            "Set the window to 1440 px wide and look again.",
            "Set the window to 1536 px wide and look again.",
            "Set the window to 1920 px wide and look again.",
            "Click Board View in the display switcher and look at the toolbar and the column headers.",
            "Set the window to 1536 px wide and look again.",
            "Set the window to 1440 px wide and look again.",
            "Set the window to 1280 px wide and look again.",
            "Set the window to 1024 px wide and look again."],
     results=["Steps 2 to 7: at every width no label in the toolbar or in the column header row touches or overlaps another. Where the toolbar runs out of room, its buttons move onto a second line, as in the 1024 px design picture, instead of running into the filters. Where the table is wider than the window it scrolls sideways.",
              "Steps 8 to 12: at every width no label in the toolbar or in the column headers touches or overlaps another; {Technician-A}'s long name ends with \"…\" before the pin icon instead of running into it or the count, and the board scrolls sideways, as in the 1280 px design picture."],
     source=source([2, 1, 3], "S2-R21 and S1-R14", "states widths__work-orders__tech-regular__light__1024 and widths__work-orders__board-detailed__light__1280", P, ["SV-11321"]),
     quotes=[["S2-R21", "Tech View’s column header labels are 12px, medium weight (500), in the secondary text color, as in the design. Labels never overlap a neighboring label."],
             ["S1-R14", "The display options follow the same screen-width switch the List uses in production today. On a screen narrower than 1024px, the Work Orders page shows List exactly as it does today (the phone card layout), with no display switcher. At 1024px and wider, Tech View and Board View are offered, whatever the device: a tablet held sideways at 1024px or wider gets them too. The switch is by screen width only; the app never detects the device type."],
             ["Design — Work Orders.dc.html, Board View column header name", "font-size: 14px; font-weight: 600; color: var(--sv-text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: -8px;"],
             ["Design — Work Orders.dc.html, 1024 px toolbar on two rows (element as the design names it)", "WorkOrdersScreen toolbar: the filter chips on the first row and the density, column chooser, display switcher and New Work Order buttons on a second row at 1024 px"]],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN + " For this case set each width named in the steps in turn.", D_PIC(2),
                D_TECH("Technician-A", "ZZAUTOTEST DC17 Maximiliana Abernathy-Kowalczyk"), D_CUST("DC17 Widths"),
                D_WO_APPROVED(1, "Technician-A", "S10043-17848"), D_CLEAN,
                CHECK("Work Orders > All > Board View shows {Technician-A}'s column with the long name.")],
     doc_part2=P2("no overlapping or clipped labels in the toolbar, the Tech View header row and the Board View column headers at 1024, 1280, 1366, 1440, 1536 and 1920 px.",
                  P, "widths__work-orders__tech-regular__light__1024, widths__work-orders__board-detailed__light__1280",
                  ["Supporting measurement per width: collect the bounding boxes of every toolbar control and every header label; no two intersect, and each text's scrollWidth ≤ clientWidth unless it ends with an ellipsis."]),
     why="SV-11321 (labels never overlap) at the design's widths, toolbar wrap and name truncation.")

# DC-18 -----------------------------------------------------------------------------------------------------------------
P = ["DC-18-tech-technician-chip-open-light-1440.png"]
case(key="DC-18", tickets=["SV-11326"], pictures=P,
     title="Technician filter sits after Assigned to me in Tech View and Board View",
     preconditions=[USER, W1440, PIC(*P), IGNORE,
                    "The design picture also shows a Department filter, which is left out of this release; do not compare it.",
                    TECH("Technician-A", "ZZAUTOTEST DC18 Yan Filter"), CUST("DC18 Technician Filter"),
                    "Approved work order {Work-order-1} (for example S10043-17850) for {Customer-A} is led by {Technician-A}.", CLEAN],
     steps=["Open Work Orders, click the All tab and click Tech View in the display switcher.",
            "Look at the filter bar from left to right.",
            "Click the Technician filter.",
            "Look at the list that opens.",
            "Tick {Technician-A}.",
            "Press Escape.",
            "Click Board View in the display switcher and look at the filter bar.",
            "Click List in the display switcher and look at the filter bar."],
     results=["Step 2: the Technician filter sits directly after Assigned to me, showing the word Technician and a down arrow, in the same style as the filters beside it, as in the design picture. There is no Department filter.",
              "Step 4: a list opens directly below the filter, starting with Unassigned, then the location's technicians by first name then last name, each with a tick box, as in the design picture (the picture has no Unassigned entry; the PRD adds it).",
              "Step 7: Board View shows the same Technician filter in the same place, still with {Technician-A} chosen.",
              "Step 8: List's filter bar has no Technician filter."],
     source=source([1], "S1-R15, S1-R15b and Out of Scope (Department filter)", "states states__work-orders__tech-technician-chip__light__1440", P, ["SV-11326"]),
     divergence="The design's Technician list has no Unassigned entry and filters by any assigned technician; this case follows the PRD (S1-R15, version 52). The design gives the filter a wrench icon; whether the filters take the design's icons is open with the product owner (question PQ-V01, not yet answered), so the icon is not judged.",
     quotes=[["S1-R15", "In Tech View and Board View the filter bar also offers a **Technician** filter, after Assigned to me. It is a multi-select listing Unassigned first, then the location’s technicians (the same people who get a group or column, S9-R4), by first name then last name. Choosing one or more shows only those technicians’ groups or columns; every other group or column, pinned ones included, is hidden. It filters by lead technician only."],
             ["S1-R15b", "List does not offer the Technician filter and stays as in production. Switching to List while technicians are chosen shows List as if none were chosen; switching back to Tech View or Board View brings the choice back. The choice is remembered the same way as the other filters."],
             ["Out of Scope", "A Department filter. The design shows one, but a work order’s department is not shown or editable on any work order screen today, so users could not see why a work order matches. Revisit once the work order shows its department."],
             ["Design — _ds_bundle.js (design library), Technician filter icon", 'ICON_WRENCH: lazyGlyph("wrench"),']],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(1), D_TECH("Technician-A", "ZZAUTOTEST DC18 Yan Filter"), D_CUST("DC18 Technician Filter"),
                D_WO_APPROVED(1, "Technician-A", "S10043-17850"), D_CLEAN,
                CHECK("Work Orders > All > Tech View shows {Technician-A}'s group with {Work-order-1} and nothing chosen in any filter.")],
     doc_part2=P2("the Technician filter's place and look in Tech View and Board View, its list, and its absence in List.",
                  P, "states__work-orders__tech-technician-chip__light__1440",
                  ["Fact (playbook): a filter list may close the moment one option is ticked (SV-8824).",
                   "Cleanup: clear the Technician filter. The filter's behaviour (sorting, hiding groups, combining) is covered by the behaviour cases of 14 Oct (T-01, T-02)."]),
     why="SV-11326: Technician filter in Tech View and Board View, after Assigned to me, absent from List.")

# DC-19 -----------------------------------------------------------------------------------------------------------------
P = ["DC-06-tech-view-compact-light-1440.png", "DC-06-tech-view-regular-light-1440.png", "DC-06-tech-view-comfortable-light-1440.png"]
case(key="DC-19", tickets=["SV-11318"], pictures=P,
     title="Density changes Tech View row, avatar and progress bar sizes as designed",
     preconditions=[USER, W1440, PIC(*P), IGNORE,
                    "The Comfortable design picture adds the hours under each progress bar (for example 0.8 / 8.0 hrs); the PRD says density never changes the values shown, so do not expect the hours there.",
                    TECH("Technician-A", "ZZAUTOTEST DC19 Zoe Density"), TECH("Technician-B", "ZZAUTOTEST DC19 Abe Density"), CUST("DC19 Density Sizes"),
                    "Approved work order {Work-order-1} (for example S10043-17852) for {Customer-A} is led by {Technician-A} and has one approved line, {Line-1} (for example \"Service - Full grease service\"), whose technician is {Technician-B}.", CLEAN],
     steps=["Open Work Orders, click the All tab and click Tech View in the display switcher.",
            "Click the density button and choose Compact.",
            "Look at the rows, the group headers, the avatars and the progress bars, and compare them with the Compact design picture.",
            "Click the density button and choose Regular.",
            "Look at them again and compare them with the Regular design picture.",
            "Click the density button and choose Comfortable.",
            "Look at them again and compare them with the Comfortable design picture.",
            "Click Board View in the display switcher and click the density button."],
     results=["Step 3: the rows are at their lowest (36 px in the design), the avatars are smaller and the progress bars shorter and thinner (48 × 4 px in the design), as in the Compact picture. The row text is the same size as at Regular or a little smaller (13 px in the design); write down which.",
              "Step 5: the rows are taller (48 px in the design) and the progress bars 64 × 6 px, as in the Regular picture.",
              "Step 7: the rows are the tallest (64 px in the design) and the avatars larger, as in the Comfortable picture.",
              "Steps 3, 5 and 7: the same columns and the same values show at every density.",
              "Step 8: Comfortable is the density in use in Board View too."],
     source=source([6], "S6-R1, S6-R2, S6-R3, S6-R4 and S6-R6", "states core__work-orders__tech-compact__light__1440, core__work-orders__tech-regular__light__1440 and core__work-orders__tech-comfortable__light__1440", P, ["SV-11318"]),
     divergence=("The design's Compact row text is 13 px; whether that meets the app's minimum body text size is open with the product owner (question W-11, not yet answered), so step 3 records the size without failing on it. "
                 "The design adds the hours under the bar only at Comfortable; this case follows the PRD, which says density never changes what is shown (question PQ-V07, not yet answered)."),
     quotes=[["S6-R1", "Offer Compact, Regular, and Comfortable density in Tech View and Board View."],
             ["S6-R2", "Density adjusts spacing and the size of rows, cards, and their elements."],
             ["S6-R3", "Share one density selection between Tech View and Board View."],
             ["S6-R4", "Compact density must not reduce text below the application’s minimum body text size."],
             ["S6-R6", "Changing density never changes which fields, columns, or values are displayed."],
             ["Design — Work Orders.dc.html, Tech View row height by density", 'rowH: rowDensity === "large" ? "64px" : rowDensity === "small" ? "36px" : "48px"'],
             ["Design — Work Orders.dc.html, Tech View text size by density", 'cellFs: rowDensity === "small" ? "13px" : "14px"'],
             ["Design — Work Orders.dc.html, Tech View avatar size by density", 'crewSize: rowDensity === "large" ? 32 : rowDensity === "small" ? 20 : 24'],
             ["Design — Work Orders.dc.html, Tech View progress bar by density", 'barW: rowDensity === "small" ? "48px" : "64px"']],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(3), D_TECH("Technician-A", "ZZAUTOTEST DC19 Zoe Density"), D_TECH("Technician-B", "ZZAUTOTEST DC19 Abe Density"),
                D_CUST("DC19 Density Sizes"), D_WO_APPROVED(1, "Technician-A", "S10043-17852", lineph="Line-1"), D_LINE_TECH(1, "Line-1", "Technician-B"), D_CLEAN,
                CHECK("Work Orders > All > Tech View shows {Work-order-1} in {Technician-A}'s group with two avatars in Assigned Techs, at density Regular.")],
     doc_part2=P2("row height, text size, avatar size and progress bar size at each density in Tech View, and the shared density in Board View.",
                  P, "core__work-orders__tech-compact/regular/comfortable__light__1440",
                  [UNV_DENSITY, "Supporting measurement per density: row height, cell font-size, avatar size and progress bar width × height (design 36/48/64 px, 13/14/14 px, 20/24/32 px, 48×4 / 64×6 / 64×6).",
                   "Cleanup: set density back to Regular."]),
     why="SV-11318 and the visual inventory's density sizes: Tech View sizes per density against the design pictures; the PRD wins on what is shown.")

# DC-20 -----------------------------------------------------------------------------------------------------------------
P = ["DC-20-reassign-dialog-light-1440.png"]
case(key="DC-20", tickets=[], pictures=P,
     title="Reassign lead technician dialog looks as in the design",
     preconditions=[USER, W1440, PIC(*P), IGNORE,
                    "The design's dialog title reads \"Reassign Lead Tech\" and it has no Unassigned row; the PRD names the action Reassign lead technician and offers Unassigned, so compare the layout and look only.",
                    TECH("Technician-A", "ZZAUTOTEST DC20 Bea Dialog", True), TECH("Technician-B", "ZZAUTOTEST DC20 Cal Dialog", False), CUST("DC20 Reassign Dialog"),
                    "Approved work order {Work-order-1} (for example S10043-17854) for {Customer-A} is led by {Technician-A}.", CLEAN],
     steps=["Open Work Orders, click the All tab and click Tech View in the display switcher.",
            "Hover {Work-order-1}'s row.",
            "Click the three-dot button at the right end of the row.",
            "Click Reassign lead technician.",
            "Look at the dialog from top to bottom.",
            "Type the first three letters of {Technician-B}'s first name in the dialog's search box.",
            "Click Cancel."],
     results=["Step 5: a white dialog with rounded corners sits over a dimmed page: a title, and under it the work order number and the customer in grey; an X at the top right; a search box with a magnifier icon; a list where each row has a round avatar, the name and a grey \"N open\" line under it ({Technician-A}'s row shows the photo, {Technician-B}'s a light-grey circle with initials); {Technician-A}'s row, the current lead, is tinted light blue with a blue check mark; Unassigned is offered too; a Cancel button at the bottom right. The layout matches the design picture.",
              "Step 6: the list narrows to the technicians whose names match.",
              "Step 7: the dialog closes and {Work-order-1} still has {Technician-A} as its lead."],
     source=source([4], "S4-R12, S4-R15 and S4-R4", "state states__work-orders__tech-reassign-dialog__light__1440", P),
     divergence="The PRD still lists the Reassign dialog's content, search, grouping, avatars and N open count under design updates required; whether the 14 Oct dialog is final is open with the product owner (question PQ-V08, not yet answered). The design has no Unassigned row; this case follows the PRD.",
     quotes=[["S4-R12", "The dialog offers eligible active technicians in the current location and Unassigned."],
             ["S4-R15", "The dialog’s N open count includes Approved, In Progress, Ready for Review, and Complete work orders."],
             ["S4-R4", "The card or row more-actions menu opens the Reassign lead technician dialog."],
             ["Design — Work Orders.dc.html, Reassign dialog", "width: 480px; max-width: 100%; max-height: 78vh; display: flex; flex-direction: column; border-radius: 12px; background: var(--sv-surface);"],
             ["Design — Work Orders.dc.html, Reassign dialog backdrop", "background: rgba(15, 17, 26, 0.5);"],
             ["Design — Work Orders.dc.html, Reassign dialog search", 'placeholder="Search technicians"']],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(1), D_TECH("Technician-A", "ZZAUTOTEST DC20 Bea Dialog", True), D_TECH("Technician-B", "ZZAUTOTEST DC20 Cal Dialog", False),
                D_CUST("DC20 Reassign Dialog"), D_WO_APPROVED(1, "Technician-A", "S10043-17854"), D_CLEAN,
                CHECK("Tech View shows {Work-order-1} in {Technician-A}'s group.")],
     doc_part2=P2("the Reassign lead technician dialog's layout and look, compared with the design picture.",
                  P, "states__work-orders__tech-reassign-dialog__light__1440",
                  [UNV_PHOTO, "UNVERIFIED: the dialog's title text and where Unassigned sits in its list; record them."]),
     why="Visual inventory: the Reassign dialog's look (no PO ticket); PRD S4-R12, S4-R15.")

# DC-21 -----------------------------------------------------------------------------------------------------------------
P = ["DC-21-toast-light-1440.png"]
case(key="DC-21", tickets=[], pictures=P,
     title="Lead technician updated message looks as in the design",
     preconditions=[USER, W1440, PIC(*P), IGNORE,
                    "The design picture's message has other words and an Undo button; the PRD sets the words \"Lead technician updated\", so compare only the message's place and look.",
                    TECH("Technician-A", "ZZAUTOTEST DC21 Dee Toast"), CUST("DC21 Toast"),
                    "Estimate {Work-order-1} (for example S10043-17856) for {Customer-A} has no lead technician and no approved line, so it sits in Unassigned.", CLEAN],
     steps=["Open Work Orders, click the All tab and click Board View in the display switcher.",
            "Drag {Work-order-1}'s card from Unassigned into {Technician-A}'s column and release it.",
            "Look at the message that appears.",
            "Wait ten seconds without moving the mouse over the message."],
     results=["Step 3: a white message box with rounded corners appears at the bottom right of the page, with a green check-in-a-circle icon, the words \"Lead technician updated\" and an X to close it, as in the design picture.",
              "Step 4: the message disappears by itself."],
     source=source([4], "S4-R5 and S4-R16", "state states__work-orders__tech-toast-after-reassign__light__1440", P),
     quotes=[["S4-R5", "After successful reassignment, show “Lead technician updated”; after unassigning, show “Lead technician removed”."],
             ["S4-R16", "Success toasts dismiss automatically."],
             ["Design — Work Orders.dc.html, message box", "position: fixed; right: 24px; bottom: 24px; z-index: 300;"]],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(1), D_TECH("Technician-A", "ZZAUTOTEST DC21 Dee Toast"), D_CUST("DC21 Toast"),
                D_WO_ESTIMATE(1, "S10043-17856"), D_CLEAN, CHECK("Board View shows {Work-order-1} in Unassigned and a column for {Technician-A}.")],
     doc_part2=P2("the success message after a lead change: place, look and auto-dismiss.",
                  P, "states__work-orders__tech-toast-after-reassign__light__1440",
                  ["Take the screenshot within 1 second of the drop; then poll the message's visibility for 15 s and record when it disappears.",
                   UNV_ESTIMATE_LEAD, "Cleanup: move {Work-order-1} back to Unassigned (More actions > Reassign lead technician > Unassigned)."]),
     why="Visual inventory: the success message's look (no PO ticket); PRD S4-R5, S4-R16.")

# DC-22 -----------------------------------------------------------------------------------------------------------------
P = ["DC-22-tech-scrolled-light-1440.png"]
case(key="DC-22", tickets=[], pictures=P,
     title="Tech View keeps the column headers and group header in view while scrolling",
     preconditions=[USER, W1440, PIC(*P), IGNORE,
                    "In the design picture only the column header row stays at the top and the group header scrolls away; the PRD keeps the group header on screen, so the case follows the PRD.",
                    CUST("DC22 Sticky Headers"),
                    "Estimate {Work-order-1} (for example S10043-17858) for {Customer-A} has no lead technician, so it sits in the Unassigned group.",
                    "On the All tab the Unassigned group holds more work orders than fit on the screen (on a QA site it usually holds hundreds).", CLEAN],
     steps=["Open Work Orders, click the All tab and click Tech View in the display switcher.",
            "Scroll down slowly through the Unassigned group until well past its first screen of rows.",
            "Look at the top of the table."],
     results=["Step 3: the column header row is still at the top of the table, and the Unassigned group header (with its arrow and count) stays visible just under it while the group's rows scroll past, so the group can be collapsed from there."],
     source=source([2], "S2-R18 and S2-E1", "state states__work-orders__tech-scrolled-down__light__1440", P),
     divergence="The design lets the group header scroll away; this case follows the PRD (question PQ-V09 to the designer, not yet answered). The behaviour is also covered by C96935 and C368127.",
     quotes=[["S2-R18", "Unassigned opens expanded unless the user collapsed it (S2-R13), and its header stays on screen while scrolling so it can be collapsed from anywhere. When it holds more work orders than fit on screen, which on the All tab can be thousands, it loads them in pages as the user scrolls, as List does, never all at once."],
             ["S2-E1", "Keep the technician group header visible while scrolling within a tall group."],
             ["Design — Work Orders.dc.html, Tech View column header row", "position: sticky; top: 0; z-index: 2; background: var(--sv-surface); border-bottom: 1px solid var(--sv-border-default);"]],
     doc_part1=[D_SIGNIN, D_LOC, D_WIN, D_PIC(1), D_CUST("DC22 Sticky Headers"), D_WO_ESTIMATE(1, "S10043-17858"), D_CLEAN,
                CHECK("Tech View's Unassigned group is expanded and taller than the window. If it is not, create more estimates for {Customer-A} the same way until it is.")],
     doc_part2=P2("the sticky column header row and the Unassigned group header while scrolling a tall group.",
                  P, "states__work-orders__tech-scrolled-down__light__1440",
                  ["Supporting measurement: after scrolling, the header row's top equals the scroll container's top and the Unassigned header's top equals the header row's bottom (±2 px)."]),
     why="Visual inventory: sticky headers while scrolling (no PO ticket); PRD S2-R18 and S2-E1 win over the design.")

# ------------------------------------------------------------------------ C581895: SV-11336 addition (our case, update) --
c581895 = {
 "case_id": 581895,
 "title": "Cards and headers show the technician's staff record name, as the List does",
 "preconditions": [
  "You are signed in as an Owner or Admin user whose role has Work orders > View and Work orders > Create & Edit, at {Location-A} (for example Staging Heavy Duty - 9919).",
  "Your browser window is at least 1024 px wide, so the display switcher (List, Tech View, Board View) shows at the right of the Work Orders toolbar.",
  "Technician {Technician-A} (for example ZZAUTOTEST Staffname Ana) is an active technician at {Location-A} with a sign-in account, and the staff record was renamed after the account was made, so the name in Settings > Staff differs from the account name (for example ZZAUTOTEST Account Ana).",
  "Technician {Technician-B} (for example ZZAUTOTEST Staffname Ben) is an active technician at {Location-A} with a sign-in account, and the staff record was renamed after the account was made, so the name in Settings > Staff differs from the account name (for example ZZAUTOTEST Account Ben).",
  "Customer {Customer-A} (for example \"ZZAUTOTEST S5R11b Staff Names\") is used by this case only.",
  "Approved work order {Work-order-1} (for example S10043-17671) for {Customer-A} is led by {Technician-A} and has two approved lines, {Line-1} (for example \"Service - Full grease service\") and {Line-2} (for example \"Service - Adjust clutch\").",
  "{Line-2} has {Technician-B} as its technician, set through Edit Line.",
  "In Board View, Fields to display has Lead technician and Line technicians turned on.",
  "In Tech View the Assigned Techs column is shown (it is on by default).",
  "The List shows the Lead Technician column.",
  "On the Work Orders page nothing is ticked in Status, Asset on Site shows no choice (if its chip shows Yes or No, click the x on the chip), Assigned to me is off and Search is empty."],
 "steps": [
  "Click your initials (top right) and open Settings > Staff.",
  "Write down the names shown for {Technician-A} and {Technician-B}.",
  "Open Work Orders, click the All tab and click List in the display switcher.",
  "Type the name of {Customer-A} in Search.",
  "Read the Lead Technician of {Work-order-1}.",
  "Click Board View in the display switcher.",
  "Read the lead technician name on {Work-order-1}'s card.",
  "Hover each avatar in the card's line technicians and read each name.",
  "Read the header of the column that holds {Work-order-1}.",
  "Click Tech View in the display switcher.",
  "Read the header of the group that holds {Work-order-1}.",
  "Hover each avatar in {Work-order-1}'s Assigned Techs cell and read each name."],
 "results": [
  "Step 5: the List's Lead Technician shows {Technician-A}'s staff record name written down in step 2 (for example ZZAUTOTEST Staffname Ana).",
  "Step 7: the card names its lead technician with the same staff record name, not any other name (for example not ZZAUTOTEST Account Ana).",
  "Step 8: hovering the avatars shows the staff record names of {Technician-A} and {Technician-B} written down in step 2.",
  "Step 9: the Board View column header shows {Technician-A}'s staff record name.",
  "Step 11: the Tech View group header shows {Technician-A}'s staff record name.",
  "Step 12: hovering each avatar shows a name for each technician, {Technician-A} and {Technician-B}. Write down which name shows (the staff record name from step 2 or the account name)."],
 "source": "Epic SV-10043; story SV-10048 (Story 5, Choose what is shown); PRD \"Work Orders — Board View & Tech View Display Options\", Confluence 845185030, version 52 (14 Oct 2026, Chris Ward), S5-R11b (added in version 49 from Chris Ward's answer 4 of 14 Oct 2026 to our question sheet), S7-R6, S3-R12 and S2-R12, read 14 Oct 2026. Before version 49 the PRD did not say which name is shown. Covers the design defect SV-11336 (reported 14 Oct 2026 by Ahtasham Amjad). Source-verified 14 October 2026.",
 "divergence": "S5-R11b names cards, group headers and column headers but not the avatars in a Tech View row, which SV-11336 also reports; until the product owner says which name a row's avatars show, step 12 checks only that every technician can be found by name (S7-R6) and records which name shows.",
 "checked": "Last checked against build v26.40.17-ddb9ba1 (staging) on 10/14/2026. Step 12 was added on 14 Oct 2026 and has not yet been checked against a build.",
 "quotes": [
  ["S5-R11b", "Wherever a technician is named on a card, a group header or a column header, the name is the technician's staff record name, the same name the List's Lead Technician column shows."],
  ["S7-R6", "Keep every involved technician discoverable by name."],
  ["S3-R12", "Each column header shows the technician’s name, avatar, and a count of the work orders currently shown in that column, after the filter view and filters are applied, so the count always matches the cards listed."],
  ["S2-R12", "Each group header shows the technician’s name, avatar, and a count of the work orders currently shown in that group, after the filter view and filters are applied, so the count always matches the rows listed."]],
 "marker": "AUTOMATION: READY",
 "doc_part1": [
  "Sign in as an Owner or Admin user. On a QA site click the Admin quick-login button on the sign-in page; you appear as \"Admin ShopView\". To check the permissions: your initials (top right) > Settings > Roles & Permissions > Admin > Work orders: View and Create & Edit are on.",
  "Pick one location for the whole case; it is shown in the top bar next to the bell (to change it: your initials > Change Location). This is {Location-A} (for example Staging Heavy Duty - 9919). Create everything below at {Location-A}.",
  "Use a desktop browser window at least 1024 px wide (narrower windows show only the List, with no display switcher).",
  "Your initials > Settings > Staff > New Staff Member: First Name and Last Name (for example ZZAUTOTEST Account Ana), an Email you can open, Role Technician, a Department, Location {Location-A}, Time Clock on > Save & Close. Accept the invitation email and set a password, so the person has a sign-in account. Then open the staff record again (edit icon) and change First Name and Last Name to a different name (for example ZZAUTOTEST Staffname Ana) > Save. This is {Technician-A}.",
  "Do the same for a second person (for example created as ZZAUTOTEST Account Ben, renamed ZZAUTOTEST Staffname Ben). This is {Technician-B}.",
  "Top menu Customers > New Customer > Name (for example \"ZZAUTOTEST S5R11b Staff Names\") > Save. This is {Customer-A}; use it for this case only. On the customer page click Contacts > New Contact > First Name and Last Name (for example ZZAUTOTEST Contact) > Save. Then Assets > New Asset > pick the contact, Year (for example 2022), Make (type \"Freight\" and pick Freightliner), Model (for example M2), Unit (for example TRK-118) > Save. Contact and Make are required.",
  "Work Orders > Create Work Order > in the New Work Order window pick {Customer-A} and its asset > Save (if a Confirmation about the credit limit appears, click Create). The work order opens on its Lines tab with the New Line form. In What Are You Doing? type \"grease\" and pick the ready-made line \"Service - Full grease service\", turn Line Approved on and click Save & Add Line. In the next New Line form type \"clutch\" and pick the ready-made line \"Service - Adjust clutch\", turn Line Approved on and click Save & Close. Write down the number shown at the top left (for example S10043-17671). This is {Work-order-1}, with {Line-1} and {Line-2}.",
  "Click {Line-2}'s name to open Edit Line, choose Technicians {Technician-B} and save.",
  "On the work order page pick the technician in the Lead Technician dropdown; it saves at once. Choose {Technician-A}.",
  "Work Orders > All > Board View > Fields to display: turn on Lead technician and Line technicians. Then click Tech View and, if the Assigned Techs column is not shown, turn it on in Tech View's column chooser. Then click List and, if the Lead Technician column is not shown, turn it on in the List's column chooser.",
  "Check the setup worked: Settings > Staff shows {Technician-A} and {Technician-B} under their new names. Work Orders > All > List with {Customer-A}'s name in Search shows {Work-order-1} with a Lead Technician, and Tech View shows two avatars in its Assigned Techs cell. If a person could not be renamed, the case cannot start: mark it Blocked and write why. Clear the search before you start."],
 "doc_part2": [
  "Goal: a work order whose lead and line technician each have a staff record name that differs from the name of their sign-in account, so a screen that shows the account name is easy to spot.",
  "UNVERIFIED on the Work Orders QA site: whether renaming a staff record also renames the sign-in account. Read both back after the rename (GET /api/staff for the staff record; the person's own account name as shown after signing in as them) and record them. If the rename changes both, pick instead an existing technician whose two names already differ: the developer noted on 12 Oct 2026 (Slack, #fs-board-tech-view) that on the QA data the two names differ for most technicians.",
  "Create {Customer-A}, its contact and asset, and {Work-order-1} on screen as in Part 1. Record {Work-order-1 id}, {Line-1 id} and {Line-2 id}.",
  "Steps 5 to 12: read every name on screen exactly; for steps 8 and 12 hover each avatar with Playwright and read the tooltip text.",
  "Step 12 (added 14 Oct 2026 for SV-11336, design-case pass): the PRD (S5-R11b) names cards, group headers and column headers, not a Tech View row's avatars; record which name each row avatar shows. Pass if every technician is named; report the name source to the QA lead.",
  "Context: SV-11336 (Ahtasham Amjad, 14 Oct 2026) reports that the staging build shows the account name in the Tech View group header and row and the Board column header and card. That is not evidence about the build you test; judge only what you see.",
  "Evidence: a screenshot after each step that has an expected result, the build marker, and the real value of every brace name."],
 "change_summary": "SV-11336 addition: precondition (Assigned Techs shown in Tech View), step 12 and its result added; Rule 41 full re-check: quotes re-verified verbatim against PRD v52, Source re-stamped to version 52 and the contradicting 'Not yet checked against a build.' removed (the case was build-checked on 14 Oct); build sentence kept and says step 12 is not yet checked; new setup doc v2 (Assigned Techs on; step 12 notes)."}

for c in cases:
    c.setdefault("why", "")
out = {"new": cases, "updates": [], "retire": [], "anchors_covered": {},
       "notes": "22 design cases for section 73780 'Design — how it looks' (Rule 126), built 14 Oct 2026 from design-case-proposals.json."}
json.dump(out, open(f"{H}/proposals-design.json", "w"), indent=1, ensure_ascii=False)
json.dump({"new": [], "updates": [c581895], "retire": [], "anchors_covered": {}}, open(f"{H}/proposals-c581895.json", "w"), indent=1, ensure_ascii=False)
print(len(cases), "new cases; 1 update")
