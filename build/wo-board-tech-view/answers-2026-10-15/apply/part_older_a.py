"""Older-layout cases rewritten in full to the Rule 117 layout (15 Oct 2026), first set: display switcher, Back, Tech View
sorting and sticky headers, Reassign dialog, density text size, Board View fields. Each gets its own new setup Doc."""
from common import *
from docparts import *

PRD_NAME = "PRD \"Work Orders — Board View & Tech View Display Options\", Confluence 845185030, version 54 (15 Oct 2026, Chris Ward)"
PRE_ADMIN = ("You are signed in as an Owner or Admin user whose role has Work orders > View and Work orders > Create & Edit, at "
             "{Location-A} (for example Staging Heavy Duty - 9919).")
PRE_WIDTH = ("Your browser window is at least 1024 px wide, so the display switcher (List, Tech View, Board View) shows at the right "
             "of the Work Orders toolbar.")
PRE_CLEAR = ("On the Work Orders page nothing is ticked in Status, Asset on Site shows no choice (if its chip shows Yes or No, click "
             "the x on the chip), Assigned to me is off and Search is empty.")
CLEAR_DOC = ("Work Orders > All: clear any Status selection, click the x on the Asset on Site chip if it shows Yes or No, turn "
             "Assigned to me off and empty Search.")


def pre_tech(ph, ex):
    return (f"Technician {{{ph}}} (for example {ex}) is an active staff member at {{Location-A}} with Time Clock on and a Role other "
            "than Office User or Time Clock User.")


def src(stories, codes, answers=(), extra="", checked="", changed=True):
    s = f"Epic SV-10043; {stories}; {PRD_NAME}, {codes}, read 15 Oct 2026."
    if extra: s += " " + extra
    if answers: s += " " + answers_ref(answers)
    s += " Source-verified 15 October 2026."
    if checked:
        s += " " + (checked.rstrip(".") + ", before the expected results changed on 15 Oct 2026; the changed results have not yet "
                    "been checked against a build." if changed else checked)
    return s


def mk(cid, title, pre, steps, results, source, quotes, marker, part1, part2, summary, divergence=None):
    p = {"case_id": cid, "title": title, "preconditions": pre, "steps": steps, "results": results, "source": source,
         "quotes": quotes, "marker": marker, "doc_part1": part1, "doc_part2": part2 + [PART2_EVIDENCE], "change_summary": summary}
    if divergence: p["divergence"] = divergence
    return p


def c96909():
    pre = [PRE_ADMIN, PRE_WIDTH, pre_tech("Technician-A", "Esther Howard"),
           "Customer {Customer-A} (for example \"ZZAUTOTEST F1 Display Switcher\") has two Approved work orders: {Work-order-1} "
           "(for example S10043-17581), led by {Technician-A}, and {Work-order-2} (for example S10043-17582), with no lead technician.",
           "The Work Orders page shows List at the start: List is the highlighted button in the display switcher.",
           "Developer note kept from the automation engineer (nothing for the tester to do): Dev-layer test — fe-unit. Existing "
           "coverage: app/src/components/ts/work-orders/**/DisplayOptionSwitcher.spec.ts:42,65,77"]
    steps = ["Open Work Orders from the top menu and click the All tab.",
             "Look at the display switcher at the right of the toolbar and write down which button is highlighted.",
             "Hover the first button of the display switcher and read its tooltip.",
             "Hover the second button and read its tooltip.",
             "Hover the third button and read its tooltip.",
             "Click Tech View in the display switcher.",
             "Look at which switcher button is highlighted.",
             "Click Board View in the display switcher.",
             "Look at which switcher button is highlighted.",
             "Click List in the display switcher.",
             "Look at which switcher button is highlighted."]
    res = ["Step 2: the switcher offers exactly three display options, and List is the highlighted one.",
           "Steps 3 to 5: the tooltips read List, Tech View and Board View, in that order.",
           "Step 7: only Tech View is highlighted.",
           "Step 9: only Board View is highlighted.",
           "Step 11: only List is highlighted."]
    return mk(96909, "Display switcher offers List, Tech View and Board View and marks the active one", pre, steps, res,
              src("story SV-10044 (Story 1, Switch between display options)", "S1-R1, S1-R9 and S1-R9b", answers=(24,),
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026."),
              [q("S1-R1"), q("S1-R9"), q("S1-R9b")], MARKER_HOLD,
              [SIGNIN, LOCATION, WIDTH, tech("Technician-A", "Esther Howard"),
               customer("Customer-A", "ZZAUTOTEST F1 Display Switcher"),
               wo("Work-order-1", "Customer-A", "S10043-17581", lead="Technician-A"),
               wo("Work-order-2", "Customer-A", "S10043-17582"),
               "Work Orders > All: if the display switcher does not highlight List, click List.",
               "Check the setup worked: Work Orders > All > Search the name of {Customer-A} shows exactly {Work-order-1} (lead "
               "{Technician-A}) and {Work-order-2} (no lead). Then empty Search."],
              ["Goal: a page with work orders to show in every display, starting in List; then hover and click the three switcher buttons.",
               "Read each tooltip's text after hovering about one second; record the highlighted button after each click.",
               "Developer coverage (from the automation engineer's note): DisplayOptionSwitcher.spec.ts lines 42, 65 and 77."],
              "Rewritten in full to the Rule 117 layout (own setup Doc). Answer 24 / PRD v54 S1-R9b: the tooltips must read "
              "List, Tech View and Board View (was: any label accepted). Steps one action per line; [Tech-A]/[WO-1..2] became "
              "{Technician-A}/{Work-order-1..2}; the developer note is kept as the last precondition.",
              divergence="The design's tooltips read Table, By Lead Tech and Board, and this case used to accept any label. Chris Ward "
                         "answered on 15 Oct 2026 (answer 24) that the tooltips read List, Tech View and Board View; PRD version 54 says "
                         "so, and a different word is now a fail.")


def c96916():
    techs = ", ".join(f"{{Technician-{x}}}" for x in "ABCDEFG")
    pre = [PRE_ADMIN, PRE_WIDTH,
           f"Eight technicians, {techs} and {{Technician-H}} (for example Esther Howard, Ralph Edwards, Jenny Wilson, Theresa Webb, "
           "Kristin Watson, Brenda Martinez, Cameron Williamson and Floyd Miles), are active staff members at {Location-A} with Time "
           "Clock on and a Role other than Office User or Time Clock User.",
           "Customer {Customer-A} (for example \"ZZAUTOTEST F1 Scroll Back\") has about 20 Approved work orders led by {Technician-H} "
           "and 2 Approved work orders led by each of the other seven technicians.",
           "With a search on {Customer-A}, Board View is wider than the window (you must scroll right to reach {Technician-H}'s "
           "column) and {Technician-H}'s column and the Tech View table are taller than the window.",
           PRE_CLEAR]
    steps = ["Open Work Orders and click the All tab.",
             "Type the name of {Customer-A} in Search.",
             "Click Board View in the display switcher.",
             "Scroll the board to the right until {Technician-H}'s column is fully in view.",
             "Scroll down inside {Technician-H}'s column until a card well below the first screen is at the top of the column.",
             "Write down the technician columns in view and the card at the top of {Technician-H}'s column.",
             "Click a card that is in view to open its work order.",
             "Press the browser Back button.",
             "Compare what is in view with what you wrote down at step 6.",
             "Click Tech View in the display switcher.",
             "Scroll down the table until a row well below the first screen is at the top, and scroll right if the table is wider than the window.",
             "Write down the row at the top and the columns in view.",
             "Click a row to open its work order.",
             "Press the browser Back button.",
             "Compare what is in view with what you wrote down at step 12."]
    res = ["Step 9: the same technician columns are in view, at exactly the same sideways position as before. In {Technician-H}'s "
           "column the card that was at the top comes back at the top and is fully shown; it may sit up to one card away from the "
           "exact position you left.",
           "Step 15: the same columns are in view, at exactly the same sideways position as before. The row that was at the top "
           "comes back at the top and is fully shown; it may sit up to one row away from the exact position you left.",
           "Steps 9 and 15: List is not checked here; it keeps today's behaviour."]
    return mk(96916, "Browser Back restores the scroll position in Tech View and Board View", pre, steps, res,
              src("story SV-10044 (Story 1, Switch between display options)", "S1-R8", answers=(30,),
                  extra="Review Decisions 853901313 FF-3 / DR-6.",
                  checked="Last checked against build v26.40.17-a5c4210 (staging) on 10/15/2026."),
              [q("S1-R8")], MARKER_HOLD,
              [SIGNIN, LOCATION, WIDTH] +
              [tech(f"Technician-{x}", ex) for x, ex in zip("ABCDEFGH", ["Esther Howard", "Ralph Edwards", "Jenny Wilson",
                                                                        "Theresa Webb", "Kristin Watson", "Brenda Martinez",
                                                                        "Cameron Williamson", "Floyd Miles"])] +
              [customer("Customer-A", "ZZAUTOTEST F1 Scroll Back"),
               "Create about 20 work orders for {Customer-A} led by {Technician-H}, each like this: " +
               wo("Work-order-1", "Customer-A", "S10043-17601", lead="Technician-H").replace("This is {Work-order-1}.", "").replace("On {Work-order-1}'s page", "On its page"),
               "Create 2 more work orders for {Customer-A} for each of {Technician-A} to {Technician-G} the same way, picking that "
               "technician as Lead Technician.",
               CLEAR_DOC,
               "Check the setup worked: Work Orders > All > Search the name of {Customer-A} > Board View: you must scroll right to "
               "reach {Technician-H}'s column, and {Technician-H}'s column is taller than the window. If not, add work orders before "
               "starting. Then empty Search."],
              ["Goal: a board wider and taller than the window; scroll both ways, open a work order, press Back and compare.",
               "Record scrollLeft and scrollTop of the board and of the column (or the table) before opening and after Back; the "
               "horizontal value must match exactly, the vertical one within one card or row height."],
              "Rewritten in full to the Rule 117 layout (own setup Doc). Answer 30 / PRD v54 S1-R8: sideways position comes back "
              "exactly; vertically the top card or row comes back at the top, fully shown, within one card or row. The long column "
              "is now the last technician's ({Technician-H}), so it can be scrolled after scrolling right; steps one action per line.",
              divergence="On staging the up-and-down position came back about one row off. Chris Ward answered on 15 Oct 2026 (answer "
                         "30) that sideways comes back exactly and vertically the row or card that was at the top comes back at the "
                         "top, fully shown, within one row or card; PRD version 54 says so, and this case follows it.")


def c96929():
    pre = [PRE_ADMIN, PRE_WIDTH,
           "User {User-B} (for example ZZAUTOTEST Sort Viewer) is a new staff member with the Admin role at {Location-A}, can sign "
           "in, and has never changed or saved a sort in List.",
           pre_tech("Technician-A", "Kristin Watson") + " {Technician-A} leads no other work order.",
           "Customers {Customer-A} (for example \"ZZAUTOTEST F2 Sort Alpha Freight\"), {Customer-B} (for example \"ZZAUTOTEST F2 "
           "Sort Mid Trucking\") and {Customer-C} (for example \"ZZAUTOTEST F2 Sort Zeta Hauling\") start with the same words (for "
           "example ZZAUTOTEST F2 Sort) and are used by this case only.",
           "Four Approved work orders, all led by {Technician-A}, were created in this order: {Work-order-1} (for example "
           "S10043-17621) for {Customer-C}, {Work-order-2} (for example S10043-17622) for {Customer-A}, {Work-order-3} (for "
           "example S10043-17623) for {Customer-B} and {Work-order-4} (for example S10043-17624) for {Customer-B}.",
           "Nobody has reordered {Technician-A}'s work orders at {Location-A}.",
           PRE_CLEAR]
    steps = ["Sign in as {User-B}.",
             "Open Work Orders, click the All tab and click List in the display switcher.",
             "Type the shared start of the three customer names (for example ZZAUTOTEST F2 Sort) in Search.",
             "Write down the order of the four work orders in List.",
             "Click Tech View in the display switcher.",
             "Write down the order of the rows in {Technician-A}'s group.",
             "Click Board View in the display switcher.",
             "Write down the order of the cards in {Technician-A}'s column."]
    res = ["Step 4: List shows the four work orders in its usual default order: by customer name from A to Z (with the example "
           "names: {Customer-A}, then {Customer-B}'s two work orders, then {Customer-C}).",
           "Step 6: Tech View's rows are in exactly the same order as List at step 4, including the order of {Customer-B}'s two "
           "work orders, {Work-order-3} and {Work-order-4}.",
           "Step 8: Board View's cards are in the same order as Tech View's rows."]
    return mk(96929, "Before anyone reorders them, a group's work orders follow List's default sort", pre, steps, res,
              src("story SV-10045 (Story 2, Tech View — table grouped by lead technician)", "S2-R6",
                  extra="Review Decisions 853901313 DR-45 (desktop List default sort is customer name A to Z; its description of "
                        "the tie-break was corrected by Chris Ward on 15 Oct 2026 in PRD version 53: same customer, start date, "
                        "newest first, exactly as the List sorts today).",
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026."),
              [q("S2-R6")], MARKER_HOLD,
              [SIGNIN, LOCATION, WIDTH, tech("Technician-A", "Kristin Watson", "Use a new technician if your choice already leads other work orders."),
               "Your initials > Settings > Staff > New Staff Member: First Name and Last Name (for example ZZAUTOTEST Sort Viewer), an "
               "email you can open, Role Admin, at least one Department, Location {Location-A}, Time Clock off > Save & Close. Accept "
               "the invitation from that email and set a password. This is {User-B}; do not change any List sort as {User-B} before the test.",
               customer("Customer-A", "ZZAUTOTEST F2 Sort Alpha Freight"),
               customer("Customer-B", "ZZAUTOTEST F2 Sort Mid Trucking"),
               customer("Customer-C", "ZZAUTOTEST F2 Sort Zeta Hauling"),
               "Create the four work orders in this order, each led by {Technician-A}. " +
               wo("Work-order-1", "Customer-C", "S10043-17621", lead="Technician-A"),
               wo("Work-order-2", "Customer-A", "S10043-17622", lead="Technician-A"),
               wo("Work-order-3", "Customer-B", "S10043-17623", lead="Technician-A"),
               wo("Work-order-4", "Customer-B", "S10043-17624", lead="Technician-A"),
               CLEAR_DOC,
               "Check the setup worked: Work Orders > All > Tech View > Search the shared start of the customer names: "
               "{Technician-A}'s group holds exactly {Work-order-1} to {Work-order-4}. If it holds more, use a new technician. "
               "Then empty Search."],
              ["Goal: four work orders of one technician, two of them for the same customer, read as a user with no saved List sort.",
               "Compare the order of work order numbers in List, in the Tech View group and in the Board View column; they must be identical."],
              "Rewritten in full to the Rule 117 layout (own setup Doc). PRD v53/v54 S2-R6: ties follow the List exactly (same "
              "customer: start date, newest first); a fourth work order for the same customer was added so the tie is checked "
              "against List. The design-sample note was removed (not needed to run the case). Automated case: tell Vladimir.")


def c96935():
    pre = [PRE_ADMIN, PRE_WIDTH, pre_tech("Technician-A", "Esther Howard"), pre_tech("Technician-B", "Ralph Edwards"),
           "Customer {Customer-A} (for example \"ZZAUTOTEST F2 Sticky Header\") has about 25 Approved work orders led by "
           "{Technician-A}, more rows than fit on the screen, and 3 Approved work orders led by {Technician-B}.",
           "In Tech View {Technician-B}'s group comes after {Technician-A}'s group (no pins, no reordering).",
           PRE_CLEAR]
    steps = ["Open Work Orders and click the All tab.",
             "Type the name of {Customer-A} in Search.",
             "Click Tech View in the display switcher.",
             "Scroll down slowly through {Technician-A}'s rows until the group's last row.",
             "Look at the top of the table.",
             "Keep scrolling slowly into {Technician-B}'s group.",
             "Look at the top of the table."]
    res = ["Step 5: while you scroll through {Technician-A}'s rows, {Technician-A}'s group header (name and count) stays on screen just under "
           "the column header row.",
           "Step 7: {Technician-B}'s header pushes {Technician-A}'s header up and off and takes its place just under the column "
           "header row. Only one group header is held there at a time."]
    return mk(96935, "A tall group's header stays on screen while you scroll its rows", pre, steps, res,
              src("story SV-10045 (Story 2, Tech View — table grouped by lead technician)", "S2-E1", answers=(20,),
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026."),
              [q("S2-E1")], MARKER_HOLD,
              [SIGNIN, LOCATION, WIDTH, tech("Technician-A", "Esther Howard"), tech("Technician-B", "Ralph Edwards"),
               customer("Customer-A", "ZZAUTOTEST F2 Sticky Header"),
               "Create about 25 work orders for {Customer-A} led by {Technician-A}, each like this: " +
               wo("Work-order-1", "Customer-A", "S10043-17631", lead="Technician-A").replace("This is {Work-order-1}.", "").replace("On {Work-order-1}'s page", "On its page"),
               "Create 3 more work orders for {Customer-A} the same way, led by {Technician-B}.",
               CLEAR_DOC,
               "Check the setup worked: Work Orders > All > Search the name of {Customer-A} > Tech View: {Technician-A}'s group does "
               "not fit on the screen and {Technician-B}'s group follows it. If {Technician-B}'s group is above, unpin it or drag it "
               "below {Technician-A}'s. Then empty Search."],
              ["Goal: one group taller than the screen followed by another group; scroll through both and watch the held header.",
               "Record which group header sits directly under the column header row at three points: inside the first group, as the "
               "second header arrives, and inside the second group."],
              "Rewritten in full to the Rule 117 layout (own setup Doc). Answer 20 / PRD v54 S2-E1: the header stays just under the "
              "column headings, only one is held at a time, the next pushes it off (step 7 made exact). Names became placeholders.",
              divergence="The PRD (version 52) only said the header stays visible. Chris Ward answered on 15 Oct 2026 (answer 20) that "
                         "it stays just under the column headings, only one header is held at a time and the next group's header "
                         "pushes it off; PRD version 54 says so, and this case follows it.")


def c368127():
    pre = [PRE_ADMIN, PRE_WIDTH,
           "On the All tab at {Location-A} several hundred work orders have no lead technician (long-running test locations usually "
           "do), so the Unassigned group holds more work orders than fit on the screen. The view loads every row at once when about "
           "300 or fewer match, so loading in batches shows only above that.",
           pre_tech("Technician-A", "Esther Howard"),
           "You have not collapsed the Unassigned group in Tech View.",
           PRE_CLEAR]
    steps = ["Open Work Orders and click the All tab.",
             "Click Tech View in the display switcher.",
             "Look at the Unassigned group.",
             "Scroll down through the Unassigned rows for a while.",
             "Look at the top of the table while you scroll.",
             "Keep scrolling towards the end of Unassigned and watch what happens when you reach the last loaded rows.",
             "While you are deep inside the group, click the arrow on the Unassigned header."]
    res = ["Step 3: Unassigned opens expanded, and its header count matches the number of work orders with no lead technician that "
           "List shows on the All tab.",
           "Step 5: the Unassigned header stays on screen just under the column header row while its rows scroll past.",
           "Step 6: more rows appear in batches as you scroll (a short loading pause, or more rows appearing at the end), not all at "
           "once when the view opens. If no loading pause is visible, write \"loading in batches not seen by hand\" in the result "
           "comment and pass or fail on the rest.",
           "Step 7: Unassigned collapses without scrolling back up."]
    tp = "One request returns every group with counts; it also returns all cards when the filtered total ≤ ~300 (configurable; true for the Work Orders view at every location). Above that, cards come for the pinned + on-screen groups, then batches of ≤ 6 groups horizontally and 25 cards per group vertically."
    return mk(368127, "Unassigned opens expanded, keeps its header in view and loads as you scroll", pre, steps, res,
              src("story SV-10045 (Story 2, Tech View — table grouped by lead technician)", "S2-R18 and S2-E1", answers=(20,),
                  extra="Tech plan revised 24 Sep 2026 (uploaded 8 Oct 2026), section 3.1.",
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026."),
              [q("S2-R18"), q("S2-E1"), ["Tech plan 3.1", tp]], MARKER_HOLD,
              [SIGNIN, LOCATION, WIDTH,
               "Work Orders > All > List: check that several hundred work orders have an empty Lead Technician. If not, change to a "
               "location that has them (your initials > Change Location); that location is {Location-A}.",
               tech("Technician-A", "Esther Howard"),
               CLEAR_DOC,
               "Check the setup worked: Work Orders > All > Tech View: the Unassigned group is expanded. If it is collapsed, click its "
               "arrow once."],
              ["Goal: a location with hundreds of unassigned work orders; scroll Unassigned in Tech View, watch its header and the batches.",
               "Watch the network log for a second page of Unassigned rows while scrolling, and record the Unassigned header's top "
               "offset against the column header row's bottom while scrolling."],
              "Rewritten in full to the Rule 117 layout (own setup Doc). Answer 20 / PRD v54 S2-R18 and S2-E1: the Unassigned header "
              "stays just under the column headings (step 5 made exact). Re-quoted S2-R18, added S2-E1. One action per step.")


def c96956():
    pre = [PRE_ADMIN, PRE_WIDTH,
           "Technicians {Technician-A} (for example Esther Howard), {Technician-B} (for example Ralph Edwards) and {Technician-C} "
           "(for example Dana Ortiz) are active staff members at {Location-A} with Time Clock on and a Role other than Office User or "
           "Time Clock User.",
           "Staff member {User-B} (for example Owen Office) is active at {Location-A} with the Office User role.",
           "Technician {Technician-D} (for example Ivan Inactive) has a Technician role at {Location-A} and is deactivated.",
           "Technician {Technician-E} (for example Lena Otherloc) is active with Time Clock on but works only at another location, "
           "{Location-B} (for example Staging Light Duty - 9920).",
           "Customer {Customer-A} (for example \"ZZAUTOTEST F1 Reassign List\") has one Approved work order, {Work-order-1} (for "
           "example S10043-17641), led by {Technician-A}.",
           "No technician has a shift on the Schedule for {Work-order-1}.",
           PRE_CLEAR,
           "Developer note kept from the automation engineer (nothing for the tester to do): Dev-layer test — fe-unit + "
           "be-functional. Existing coverage: ReassignLeadTechnicianDialog.spec.ts:279,463; BE ListLeadTechnicianCandidatesTest.php:59,65"]
    steps = ["Open Work Orders, click the All tab and click Board View in the display switcher.",
             "Type the name of {Customer-A} in Search.",
             "Hover {Work-order-1}'s card in {Technician-A}'s column and click its More actions (…) button.",
             "Click Reassign lead technician.",
             "Read every row in the dialog, from the top.",
             "Click {Technician-B}'s row, and click the dialog's confirm button if it shows one.",
             "If a \"Clear … scheduled shifts?\" question opens, click Keep shifts.",
             "Hover the card, now in {Technician-B}'s column, click its More actions (…) button and click Reassign lead technician.",
             "Click Unassigned, and click the dialog's confirm button if it shows one.",
             "If a \"Clear … scheduled shifts?\" question opens, click Keep shifts.",
             "Hover the card, now in the Unassigned column, click its More actions (…) button and click Reassign lead technician.",
             "Type the first letters of {Technician-C}'s name in the dialog's search box, then click Cancel.",
             "Click the card to open the work order and read Lead Technician.",
             "Press the browser Back button and click Tech View in the display switcher.",
             "Hover {Work-order-1}'s row in the Unassigned group, click its More actions (…) button and click Reassign lead technician.",
             "Read every row in the dialog, from the top.",
             "Click {Technician-A}'s row, and click the dialog's confirm button if it shows one.",
             "If a \"Clear … scheduled shifts?\" question opens, click Keep shifts."]
    res = ["Step 4: the Reassign lead technician dialog opens.",
           "Step 5: the dialog has a Search technicians box. Its first row is Unassigned. Under it, in one list with no grouping, "
           "come the eligible technicians of {Location-A}, {Technician-A}, {Technician-B} and {Technician-C}, each with an avatar "
           "and an \"N open\" count. {User-B}, {Technician-D} and {Technician-E} are not listed.",
           "Step 6: the card moves to {Technician-B}'s column and \"Lead technician updated\" shows.",
           "Step 9: the card moves to the Unassigned column and \"Lead technician removed\" shows.",
           "Step 12: the dialog closes and nothing changes: the card stays in the Unassigned column.",
           "Step 13: the work order page shows no lead technician.",
           "Step 16: the Tech View dialog shows the same rows as at step 5, Unassigned first.",
           "Step 17: the row moves to {Technician-A}'s group and \"Lead technician updated\" shows."]
    return mk(96956, "Reassign lead technician lists eligible technicians with Unassigned first", pre, steps, res,
              src("story SV-10047 (Story 4, Reassign or unassign the lead technician)", "S4-R4, S4-R12, S4-R13, S4-R14 and S4-R5",
                  answers=(19,), extra="Eligibility from PRD section 5 Terminology (Technician) and S2-R7.",
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026."),
              [q("S4-R4"), q("S4-R12"), q("S4-R13"), q("S4-R14"), q("S4-R5")], MARKER_HOLD,
              [SIGNIN, LOCATION, WIDTH,
               tech("Technician-A", "Esther Howard"), tech("Technician-B", "Ralph Edwards"), tech("Technician-C", "Dana Ortiz"),
               "Your initials > Settings > Staff > New Staff Member: First Name and Last Name (for example Owen Office), an Email, Role "
               "Office User, at least one Department, Location {Location-A} > Save & Close. This is {User-B}.",
               tech("Technician-D", "Ivan Inactive", "Then open the staff member's edit icon > Edit Staff Member and deactivate the account."),
               "Pick a second location you can reach (your initials > Change Location lists them). This is {Location-B} (for example "
               "Staging Light Duty - 9920). " + tech("Technician-E", "Lena Otherloc").replace("Location {Location-A}", "Location {Location-B} only").replace("{Location-A} in Location", "{Location-B} in Location"),
               customer("Customer-A", "ZZAUTOTEST F1 Reassign List"),
               wo("Work-order-1", "Customer-A", "S10043-17641", lead="Technician-A"),
               no_shifts("{Technician-A}, {Technician-B} and {Technician-C}"),
               CLEAR_DOC,
               "Check the setup worked: Work Orders > All > Search the name of {Customer-A} shows {Work-order-1} led by "
               "{Technician-A}; Settings > Staff shows {User-B} with the Office User role, {Technician-D} as deactivated and "
               "{Technician-E} at {Location-B} only. Then empty Search."],
              ["Goal: one work order and six staff members, three eligible and three not; read the dialog, reassign, unassign and cancel.",
               "Read the dialog rows top to bottom (role=dialog); record whether a confirm button exists or a row click applies at once.",
               "Developer coverage (from the automation engineer's note): ReassignLeadTechnicianDialog.spec.ts:279,463; "
               "ListLeadTechnicianCandidatesTest.php:59,65."],
              "Rewritten in full to the Rule 117 layout (own setup Doc). Answer 19 / PRD v54 S4-R12: the dialog follows the design "
              "(search, avatars, N open, no grouping) with Unassigned as its first row (steps 5 and 16). Cancel no longer follows a "
              "pick (a row click may apply at once); Tech View steps written out; developer note kept.",
              divergence="The PRD (version 52) said only that the dialog offers the technicians and Unassigned. Chris Ward answered on 15 "
                         "Oct 2026 (answer 19) that the dialog is final as drawn (search, avatars, N open per technician, no grouping) "
                         "with Unassigned as its first row; PRD version 54 says so, and this case follows it.")


def c96990():
    pre = [PRE_ADMIN, PRE_WIDTH, pre_tech("Technician-A", "Esther Howard"),
           "Customer {Customer-A} (for example \"ZZAUTOTEST F1 Compact Text\") has one Approved work order, {Work-order-1} (for "
           "example S10043-17651), led by {Technician-A}.",
           "Tech View shows the Progress column (it is on by default).",
           PRE_CLEAR]
    steps = ["Open Work Orders, click the All tab and type the name of {Customer-A} in Search.",
             "Click Tech View in the display switcher.",
             "Click the density button and choose Regular.",
             "Look at the size of the text in {Work-order-1}'s row, of the column header labels and of the percentage beside the progress bar.",
             "Click the density button and choose Compact.",
             "Compare the same texts with what you saw at step 4.",
             "Click the density button and choose Comfortable.",
             "Compare the same texts with what you saw at step 4.",
             "Click Board View in the display switcher.",
             "Click the density button and choose Regular, and look at the text on {Work-order-1}'s card.",
             "Click the density button and choose Compact, and compare the card text with step 10."]
    res = ["Step 6: at Compact the row text is the same size as at Regular (14 px), not smaller. The column header labels and the "
           "percentage keep their own smaller size (12 px), the same as at Regular.",
           "Step 8: at Comfortable every text is the same size as at Regular.",
           "Step 11: the card text is the same size at Compact as at Regular (14 px)."]
    return mk(96990, "Row and card text stays the same size at every density", pre, steps, res,
              src("story SV-10049 (Story 6, Density in Tech View and Board View)", "S6-R4", answers=(27,),
                  extra="PRD section 5 Terminology (Density).", checked="Last checked against build v26.40.8-7a95011 on 10/8/2026."),
              [q("S6-R4")], MARKER_HOLD,
              [SIGNIN, LOCATION, WIDTH, tech("Technician-A", "Esther Howard"),
               customer("Customer-A", "ZZAUTOTEST F1 Compact Text"),
               wo("Work-order-1", "Customer-A", "S10043-17651", lead="Technician-A"),
               CLEAR_DOC,
               "Check the setup worked: Work Orders > All > Search the name of {Customer-A} shows {Work-order-1} led by "
               "{Technician-A}. Then empty Search."],
              ["Goal: one work order; compare text sizes across the three densities in Tech View and two in Board View.",
               "Read the computed font-size of a row cell, a column header label and the progress percentage at each density "
               "(row and card text 14px at every density, labels and percentage 12px)."],
              "Rewritten in full to the Rule 117 layout (own setup Doc). Answer 27 / PRD v54 S6-R4: row and card text is 14 px at "
              "every density and 12 px text stays 12 px (was: not below the minimum body size, judged by eye). Retitled; Regular and "
              "Comfortable added.",
              divergence="The PRD (version 52) said only that Compact must not go below the minimum body text size, while the design's "
                         "Compact rows use 13 px. Chris Ward answered on 15 Oct 2026 (answer 27) that row and card text is 14 px at "
                         "every density and text the design sets at 12 px stays 12 px; PRD version 54 says so, and this case follows it.")


def c96978():
    pre = [PRE_ADMIN, PRE_WIDTH,
           "Technicians {Technician-A} (for example Esther Howard) and {Technician-B} (for example Ralph Edwards) are active staff "
           "members at {Location-A} with Time Clock on, a Role other than Office User or Time Clock User, and can sign in.",
           "Staff member {Advisor-A} (for example James Smith) can be picked as a Service Advisor.",
           "Customer {Customer-A} (for example \"ZZAUTOTEST F2 Card Field Values\") has an asset with a VIN (for example "
           "1FUJGLDR5CSBM1234).",
           "Approved work order {Work-order-1} (for example S10043-17661) for {Customer-A} is led by {Technician-A}, has Service "
           "Advisor {Advisor-A}, Asset on site turned on and three approved lines with labor hours, {Line-1}, {Line-2} and {Line-3} "
           "(for example 2.0, 3.0 and 3.0 hours, 8.0 in all).",
           "{Line-2}'s technician is {Technician-B}, set through Edit Line.",
           "{Technician-A} is clocked in on {Line-1}'s Labor row and {Technician-B} on {Line-2}'s, so two people are clocked in.",
           "List's Column Selection shows Lead Technician, Asset, VIN/Serial #, Progress, Service Advisor, Clocked In, Lines, Total "
           "price, On Site and Created on.",
           PRE_CLEAR]
    steps = ["Open Work Orders, click the All tab and click List in the display switcher.",
             "Type the name of {Customer-A} in Search.",
             "Write down {Work-order-1}'s values: Lead Technician, Customer, Asset, VIN/Serial #, Progress, Service Advisor, Clocked In, Lines, Total price, On Site and Created on.",
             "Hover the Clocked In value and read the names.",
             "Click Board View in the display switcher and click Fields to display.",
             "Count the optional fields offered.",
             "Turn every optional field on and close the menu.",
             "Compare each field on {Work-order-1}'s card with the values you wrote down at step 3.",
             "Read the clocked-in field on the card and hover it."]
    res = ["Step 4: List's Clocked In shows the first technician's full name, then +1 (for example \"Esther Howard +1\"), and "
           "hovering shows both names, {Technician-A} and {Technician-B}.",
           "Step 6: Fields to display offers 13 optional fields: lead technician name, customer, asset (year/make/model), "
           "VIN/serial, progress, service advisor, clocked in, line count, line technicians, estimated hours, total price, on-site "
           "indicator and created date.",
           "Step 8: each field on the card shows the same value as List for {Work-order-1} (for example 3 lines and the same total "
           "price), and the estimated hours show 8.0, the same as the work order page's Total Hours.",
           "Step 9: the card's clocked-in field reads the same as List's Clocked In at step 4: the first technician's full name, "
           "then +1, and hovering shows both names."]
    return mk(96978, "Fields to display offers the 13 optional fields with their usual values", pre, steps, res,
              src("story SV-10048 (Story 5, Fields to display (Board View) and columns (Tech View))",
                  "S5-R11, its list of optional fields and S5-R11a", answers=(31,),
                  extra="PO answer Chris Ward 25 Sep 2026 (\"The clocked in field shows technician names, as List does\").",
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026."),
              [q("S5-R11"), ["S5-R11 field list", "*Optional fields:* lead technician name, customer, asset (year/make/model), VIN/serial, progress, service advisor, clocked in (the names of the technicians currently clocked in to the work order, shown the way List’s Clocked In column shows them today: the first technician’s full name, then +N, with every name on hover), line count, line technicians, estimated hours, total price, on-site indicator, and created date."],
               q("S5-R11a")], MARKER_HOLD,
              [SIGNIN, LOCATION, WIDTH,
               tech("Technician-A", "Esther Howard", "Give an email you can open, accept the invitation and set a password."),
               tech("Technician-B", "Ralph Edwards", "Give an email you can open, accept the invitation and set a password."),
               "Your initials > Settings > Staff: pick a staff member who can be chosen as Service Advisor on a work order (for "
               "example James Smith). This is {Advisor-A}.",
               customer("Customer-A", "ZZAUTOTEST F2 Card Field Values").replace("Unit (for example TRK-118) > Save", "Unit (for example TRK-118) and VIN/Serial # (for example 1FUJGLDR5CSBM1234) > Save"),
               wo("Work-order-1", "Customer-A", "S10043-17661", lead="Technician-A"),
               "On {Work-order-1}'s Lines tab the first line is {Line-1}. Click New Line twice more and add two more ready-made "
               "lines with Line Approved on: {Line-2} and {Line-3}. Give the three lines labor hours (for example 2.0, 3.0 and 3.0, "
               "8.0 in all).",
               "On {Line-2} click Edit Line, pick {Technician-B} as its technician and save.",
               "On the work order page pick {Advisor-A} as Service Advisor and turn Asset on site on.",
               "In a second browser sign in as {Technician-A} and click Start on {Line-1}'s Labor row. Sign out, sign in as "
               "{Technician-B} and click Start on {Line-2}'s Labor row. Leave both clocked in until the test is over.",
               "Work Orders > All > List > Column Selection: turn on Lead Technician, Asset, VIN/Serial #, Progress, Service "
               "Advisor, Clocked In, Lines, Total price, On Site and Created on.",
               CLEAR_DOC,
               "Check the setup worked: Work Orders > All > List > Search the name of {Customer-A}: {Work-order-1} shows Lead "
               "Technician {Technician-A}, 3 lines and a Clocked In value with two people. Then empty Search."],
              ["Goal: one work order with every optional field filled and two people clocked in; compare the card with List.",
               "Clocking in: POST the time-clock start for each technician from that technician's session (playbook section on "
               "the time clock); record both clock-ins and stop them after the test."],
              "Rewritten in full to the Rule 117 layout (own setup Doc). Answer 31 / PRD v54 S5-R11: Clocked In shows the first "
              "technician's full name, then +N, as List does (was: first name). The List columns no longer list Assigned Tech (List "
              "does not have it); estimated hours now follow the work order page (S5-R11a). Automated case: tell Vladimir.",
              divergence="The PRD (version 52) said first name, then +N, while the List today shows the first person's full name. "
                         "Chris Ward answered on 15 Oct 2026 (answer 31) that the card shows what the List shows: the first "
                         "technician's full name, then +N, with every name on hover; PRD version 54 says so, and this case follows it.")


def c368163():
    pre = [PRE_ADMIN, PRE_WIDTH,
           "Technicians {Technician-A} (for example Esther Howard), {Technician-B} (for example Ralph Edwards) and {Technician-C} "
           "(for example Dana Ortiz) are active staff members at {Location-A} with Time Clock on and a Role other than Office User or "
           "Time Clock User.",
           "No other eligible technician at {Location-A} has the first three letters of {Technician-B}'s first name (for example "
           "\"ral\") anywhere in its name, in any letter case, and none matches \"zzqx\".",
           "Staff member {User-B} (for example Owen Office) is active at {Location-A} with the Office User role.",
           "Customer {Customer-A} (for example \"ZZAUTOTEST F1 Dialog Search\") has one Approved work order, {Work-order-1} (for "
           "example S10043-17671), led by {Technician-A}.",
           PRE_CLEAR,
           "Developer note kept from the automation engineer (nothing for the tester to do): Dev-layer test — fe-unit. Existing "
           "coverage: ReassignLeadTechnicianDialog.spec.ts:348,361,564; leadTechnicianOptions.spec.ts:134"]
    steps = ["Open Work Orders, click the All tab and click Board View in the display switcher.",
             "Type the name of {Customer-A} in Search.",
             "Hover {Work-order-1}'s card in {Technician-A}'s column and click its More actions (…) button.",
             "Click Reassign lead technician.",
             "Read the top of the dialog and the list of choices.",
             "Click the dialog's search box (it reads Search technicians) and type the first three letters of {Technician-B}'s first name with a capital first letter (for example Ral).",
             "Clear the search box and type the same three letters in lower case (for example ral).",
             "Clear the search box and type the first name of {User-B} (for example Owen).",
             "Clear the search box and type zzqx.",
             "Clear the search box.",
             "Click Cancel.",
             "Open the same card's More actions (…) menu again and click Reassign lead technician.",
             "Read the search box.",
             "Click Cancel.",
             "Click Tech View in the display switcher.",
             "Hover {Work-order-1}'s row, click its More actions (…) button and click Reassign lead technician.",
             "Type the same three letters as at step 6 in the search box, read the list, then click Cancel."]
    res = ["Step 5: the dialog names the work order it changes, by number and customer (for example \"S10043-17671 · ZZAUTOTEST F1 "
           "Dialog Search\"), and marks {Technician-A} as the current lead. Its first row is Unassigned, followed by the eligible "
           "technicians of {Location-A}, {Technician-A}, {Technician-B} and {Technician-C}, with no grouping.",
           "Step 6: only technicians whose name contains the typed letters stay in the list: {Technician-B}. {Technician-A} and "
           "{Technician-C} disappear from it.",
           "Step 7: lower-case letters give the same list, {Technician-B} only. Upper or lower case does not matter.",
           "Step 8: no technician is listed for {User-B}'s name. {User-B} has the Office User role and is never offered, not even "
           "by searching.",
           "Steps 8 and 9: when nothing matches, the dialog says so and repeats what you typed (in the design: No technicians "
           "match “zzqx”). Write down the words you see; a different wording alone is not a fail.",
           "Step 10: clearing the search box brings back the whole list from step 5.",
           "Step 11: nothing changes. The card stays in {Technician-A}'s column and no message appears.",
           "Step 13: the search box is empty when the dialog opens again.",
           "Step 17: Tech View's dialog narrows the list the same way, to {Technician-B}, and after Cancel the row stays in "
           "{Technician-A}'s group."]
    return mk(368163, "Searching in the Reassign lead technician dialog narrows the technician list", pre, steps, res,
              src("story SV-10047 (Story 4, Reassign or unassign the lead technician)", "S4-R12 and S4-R14", answers=(19,),
                  extra="Eligibility from PRD section 5 Terminology (Technician). Design export of 8 Oct 2026 (Branko Cicovic, "
                        "Claude Design project 787fef1a, Work Orders.dc.html): subtitle \"work order number · customer\", search box "
                        "\"Search technicians\" keeping the technicians whose name contains the typed text in any letter case, current "
                        "lead highlighted with a check mark, no-match text \"No technicians match “the typed text”\", search emptied "
                        "each time the dialog opens; these design-only details are cited to the design, and the PRD fixes the list "
                        "content (S4-R12).",
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026."),
              [q("S4-R12"), q("S4-R14")], MARKER_HOLD,
              [SIGNIN, LOCATION, WIDTH,
               tech("Technician-A", "Esther Howard"), tech("Technician-B", "Ralph Edwards"), tech("Technician-C", "Dana Ortiz"),
               "Your initials > Settings > Staff > New Staff Member: First Name and Last Name (for example Owen Office), an Email, Role "
               "Office User, at least one Department, Location {Location-A} > Save & Close. This is {User-B}.",
               customer("Customer-A", "ZZAUTOTEST F1 Dialog Search"),
               wo("Work-order-1", "Customer-A", "S10043-17671", lead="Technician-A"),
               "Settings > Staff: check that no other active technician at {Location-A} has the first three letters of "
               "{Technician-B}'s first name in its name (for example \"Fitzgerald\" contains \"ral\"). If one does, turn Time Clock off "
               "on that staff record for this case and turn it back on afterwards.",
               CLEAR_DOC,
               "Check the setup worked: Work Orders > All > Search the name of {Customer-A} shows {Work-order-1} led by "
               "{Technician-A}. Then empty Search."],
              ["Goal: three eligible technicians and one office user; search the dialog by part of a name, in both letter cases.",
               "Read the dialog's rows after each keystroke settles; record the no-match text exactly.",
               "Developer coverage (from the automation engineer's note): ReassignLeadTechnicianDialog.spec.ts:348,361,564; "
               "leadTechnicianOptions.spec.ts:134."],
              "Rewritten in full to the Rule 117 layout (own setup Doc). Answer 19 / PRD v54 S4-R12: Unassigned is the first row and "
              "there is no grouping (step 5). The removed PRD line \"Design updates required … Reassign dialog\" is no longer quoted. "
              "Typed letters now come from {Technician-B}'s name; Tech View steps written out; developer note kept.",
              divergence="The PRD (version 52) listed the dialog's content, search, grouping, avatars and N open count as design work still "
                         "owed. Chris Ward answered on 15 Oct 2026 (answer 19) that the dialog is final as drawn, with Unassigned as its "
                         "first row; PRD version 54 removes that line and says so in S4-R12.")


OLDER_A = [c96909, c96916, c96929, c96935, c368127, c96956, c96990, c96978, c368163]
