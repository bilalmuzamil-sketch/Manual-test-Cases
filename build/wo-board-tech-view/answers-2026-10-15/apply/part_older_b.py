"""Older-layout cases rewritten in full to the Rule 117 layout (15 Oct 2026), second set: the six keyboard cases (Story 11
rewritten from design questions into requirements in PRD version 54, answer 28), three ordering cases and three cases whose
quoted wording changed only."""
from common import *
from docparts import *
from part_older_a import PRE_ADMIN, PRE_WIDTH, PRE_CLEAR, CLEAR_DOC, pre_tech, src, mk

STORY11 = "story SV-10054 (Story 11, Keyboard access and focus)"
USER_STORY = ["Story 11 user story", "As a keyboard user, I want to navigate work orders and their actions so that these controls are usable without a mouse."]
OOS_KBD = ["Out of Scope", "Reordering work orders or technicians by keyboard. Reordering is by mouse or touch drag in this release (S11-R9)."]
KBD_DIV = ("Until 15 Oct 2026 Story 11 only listed keyboard behaviour the design still had to define, so this case asked the tester to "
           "try keys and write down what each did. Chris Ward answered on 15 Oct 2026 (answer 28): Tab reaches every control, Enter "
           "opens, Escape closes, focus returns to the control that opened a menu or dialog, reassigning by keyboard goes through the "
           "⋯ menu, and there is no keyboard drag. PRD version 54 rewrites Story 11 into these requirements, and this case now checks "
           "them.")


def kbd_data(prefix_example):
    pre = [PRE_ADMIN, PRE_WIDTH, pre_tech("Technician-A", "ZZAUTOTEST Ana Alpha"), pre_tech("Technician-B", "ZZAUTOTEST Ben Bravo"),
           f"Customer {{Customer-A}} (for example \"{prefix_example}\") has four Approved work orders: {{Work-order-1}} (for example "
           "S10043-17701) and {Work-order-2} (for example S10043-17702) led by {Technician-A}, {Work-order-3} (for example "
           "S10043-17703) led by {Technician-B}, and {Work-order-4} (for example S10043-17704) with no lead technician.",
           "No technician has a shift on the Schedule for these work orders.",
           PRE_CLEAR]
    doc = [SIGNIN, LOCATION, WIDTH, tech("Technician-A", "ZZAUTOTEST Ana Alpha"), tech("Technician-B", "ZZAUTOTEST Ben Bravo"),
           customer("Customer-A", prefix_example),
           wo("Work-order-1", "Customer-A", "S10043-17701", lead="Technician-A"),
           wo("Work-order-2", "Customer-A", "S10043-17702", lead="Technician-A"),
           wo("Work-order-3", "Customer-A", "S10043-17703", lead="Technician-B"),
           wo("Work-order-4", "Customer-A", "S10043-17704"),
           no_shifts("{Technician-A} and {Technician-B}"),
           CLEAR_DOC]
    check = ("Check the setup worked: Work Orders > All > List > Search the name of {Customer-A} shows exactly four Approved work "
             "orders: {Work-order-1} and {Work-order-2} led by {Technician-A}, {Work-order-3} led by {Technician-B} and "
             "{Work-order-4} with no lead. Then empty Search.")
    return pre, doc, check


OPEN3 = ["Open Work Orders from the top menu and click the All tab.",
         "Type the name of {Customer-A} in Search.",
         "Click Board View in the display switcher."]
KBD_PART2 = ["Drive the keyboard with Playwright's keyboard.press only (no mouse) from the step named in the case; after each "
             "press record document.activeElement (its role, label and the work order number it belongs to) and whether a focus "
             "ring is drawn (outline or box-shadow)."]


def c97021():
    pre, doc, check = kbd_data("ZZAUTOTEST F3 Keyboard Reach")
    steps = OPEN3 + [
        "Click once in the Search box, then put the mouse aside: from here on use only the keyboard.",
        "Press Tab repeatedly until a card has focus, looking at the screen after each press.",
        "Keep pressing Tab and write down, in order, every card and column header that gets focus.",
        "Press Shift+Tab a few times and write down where focus goes.",
        "Click Tech View in the display switcher, click once in the Search box and put the mouse aside again.",
        "Press Tab repeatedly until a row has focus.",
        "Keep pressing Tab and write down, in order, every row and group header that gets focus."]
    res = ["Step 5: Tab reaches the cards, and the focused card shows a visible focus ring.",
           "Step 6: Tab moves through the column headers and cards in on-screen order: column by column from left to right, and top "
           "to bottom within each column. Every card and every column header is reached. Tab also stops on controls inside a header "
           "or card (such as the pin or More actions button) on the way.",
           "Step 7: Shift+Tab moves back through the same order.",
           "Step 9: the focused row shows a visible focus ring.",
           "Step 10: Tab moves through the group headers and rows from top to bottom. Every row and every group header is reached."]
    return mk(97021, "Tab reaches every card, row and header in on-screen order with a focus ring", pre, steps, res,
              src(STORY11, "S11-R1, S11-R3 and the Story 11 user story", answers=(28,),
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026."),
              [q("S11-R1"), q("S11-R3"), USER_STORY], MARKER_HOLD, doc + [check],
              ["Goal: four work orders in three columns; tab through Board View and Tech View and record the focus order."] + KBD_PART2,
              "Rewritten in full to the Rule 117 layout (own setup Doc). Answer 28 / PRD v54 S11-R1, S11-R3: a visible focus ring, "
              "and Tab and Shift+Tab move in on-screen order (was: keys not designed, write down what works). One customer with four "
              "work orders replaces four customers.", divergence=KBD_DIV)


def c97022():
    pre, doc, check = kbd_data("ZZAUTOTEST F3 Keyboard Focus Kept")
    pre.insert(5, "Tech View and Board View offer the Technician filter after Assigned to me.")
    steps = OPEN3 + [
        "Click once in the Search box, then put the mouse aside: from here on use only the keyboard, except where a step says to click.",
        "Press Tab until the first card in {Technician-A}'s column has focus, and write down which work order it is.",
        "Press Tab until that card's More actions (…) button has focus, and press Enter.",
        "Press Escape and look at what has focus.",
        "Press Enter, move to Reassign lead technician with the arrow keys or Tab, and press Enter.",
        "Press Escape and look at what has focus.",
        "Click the Technician filter, tick {Technician-A} and press Escape.",
        "Click once in the Search box, then press Tab until the first card in {Technician-A}'s column has focus.",
        "Press Tab until its More actions (…) button has focus, press Enter, move to Reassign lead technician and press Enter.",
        "Type the first letters of {Technician-B}'s first name, move to {Technician-B}'s row with the arrow keys or Tab and press Enter.",
        "Look at what has focus.",
        "Do steps 12 and 13 again for the card that now has focus, picking {Technician-B} again.",
        "Look at what has focus."]
    res = ["Step 7: the menu closes and focus is back on the card's More actions (…) button, the control that opened it.",
           "Step 9: the dialog closes without changing anything, and focus is back on the card's More actions (…) button, the "
           "control from which the menu and the dialog were opened.",
           "Step 14: the reassigned work order leaves the board, because {Technician-B} is not chosen in the Technician filter, and "
           "focus moves to the other card in {Technician-A}'s column.",
           "Step 16: with no card left in {Technician-A}'s column, focus moves to {Technician-A}'s column header.",
           "Steps 7 to 16: focus is always visible and you can carry on with the keyboard alone."]
    return mk(97022, "Focus returns to the opener and moves on when a focused card leaves", pre, steps, res,
              src(STORY11, "S11-R5, S11-R6, S11-E1, S11-E2 and S1-R15", answers=(28,),
                  extra="The QA lead's decision of 12 Oct 2026 (focus at the top of the page after a page refresh is accepted while the "
                        "focus design is pending) no longer applies, because the focus rules are now written. Focus after a "
                        "technician becomes inactive while you work (S11-E2) cannot be set up by hand: the board shows that change "
                        "only after a page reload, which starts focus at the top of the page, so it is not checked in this case.",
                  checked="Last checked against build v26.40.8-7a95011 on 10/12/2026."),
              [q("S11-R5"), q("S11-R6"), q("S11-E1"), q("S11-E2"), q("S1-R15"), USER_STORY], MARKER_HOLD, doc + [check],
              ["Goal: open and close a menu and the Reassign dialog by keyboard, then reassign the focused cards away while the "
               "Technician filter shows only {Technician-A}."] + KBD_PART2,
              "Rewritten in full to the Rule 117 layout (own setup Doc). Answer 28 / PRD v54 S11-R6, S11-E1: focus returns to the "
              "control that opened a menu or dialog, and moves to the next card or the column header when the focused work order "
              "leaves the result (now caused in place, through the Technician filter, instead of a second browser and a refresh). "
              "S11-E2 is named as not checkable by hand.", divergence=KBD_DIV)


def c368150():
    pre, doc, check = kbd_data("ZZAUTOTEST F3 Keyboard Enter Opens")
    steps = OPEN3 + [
        "Click once in the Search box, then put the mouse aside: from here on use only the keyboard.",
        "Press Tab until {Work-order-1}'s card has focus.",
        "Press Enter.",
        "Press Alt+Left to go back.",
        "Press Tab until {Work-order-1}'s card has focus again.",
        "Press Space, then each arrow key, then Shift with each arrow key, and watch the card.",
        "Click Tech View in the display switcher, click once in the Search box and put the mouse aside again.",
        "Press Tab until {Work-order-1}'s row has focus and press Enter.",
        "Press Alt+Left to go back.",
        "With the mouse, click {Work-order-1}'s row without moving the mouse while the button is down."]
    res = ["Step 6: Enter opens {Work-order-1}'s work order page, the same as a click.",
           "Step 9: none of these keys moves the card: {Work-order-1} stays in its place in {Technician-A}'s column and no "
           "\"Lead technician updated\" message appears. There is no keyboard drag.",
           "Step 11: Enter opens {Work-order-1} from its Tech View row.",
           "Step 13: the click opens the work order, as it does today."]
    return mk(368150, "Enter opens the focused card or row, and no key drags it", pre, steps, res,
              src(STORY11, "S11-R4, S11-R9, S11-R10 and Out of Scope (keyboard reordering)", answers=(28,),
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026."),
              [q("S11-R4"), q("S11-R10"), q("S11-R9"), OOS_KBD], MARKER_HOLD, doc + [check],
              ["Goal: open a work order with Enter from a card and a row, and prove no key moves a card."] + KBD_PART2,
              "Rewritten in full to the Rule 117 layout (own setup Doc). Answer 28 / PRD v54 S11-R4, S11-R9, S11-R10: Enter opens "
              "the work order and there is no keyboard drag (was: keys not designed). Retitled.", divergence=KBD_DIV)


def c368151():
    pre, doc, check = kbd_data("ZZAUTOTEST F3 Keyboard Controls")
    pre.insert(5, "{Technician-A} is not pinned for you at the start.")
    pre.insert(6, "Tech View shows the Assigned Techs column (it is on by default).")
    steps = OPEN3 + [
        "Click once in the Search box, then put the mouse aside: from here on use only the keyboard, except where a step says to click.",
        "Press Tab until {Work-order-1}'s card has focus, and look at the card.",
        "Press Tab until the card's More actions (…) button has focus, and press Enter.",
        "Press Escape.",
        "Press Space.",
        "Press Escape.",
        "Press Tab until the pin button in {Technician-A}'s column header has focus, and press Enter.",
        "Press Space.",
        "Click Tech View in the display switcher, click once in the Search box and put the mouse aside again.",
        "Press Tab until the arrow in {Technician-A}'s group header has focus, and press Enter.",
        "Press Space.",
        "Press Tab until an avatar in {Work-order-1}'s Assigned Techs cell has focus.",
        "Press Shift+Tab until the Column Selection button has focus, press Enter, press Tab once, then press Escape.",
        "Click Status, tick Approved and press Escape, then press Tab until the x on the Status filter has focus and press Enter.",
        "Press Shift+Tab until the Board View button of the display switcher has focus, and press Enter."]
    res = ["Step 5: the focused card shows a focus ring and its More actions (…) button appears without hovering.",
           "Step 6: Enter opens the card's menu.",
           "Step 7: Escape closes the menu without changing anything, and focus is back on the More actions (…) button.",
           "Steps 8 and 9: Space opens the menu as well, and Escape closes it again.",
           "Step 10: Enter pins {Technician-A}: the pin button shows the pinned state.",
           "Step 11: Space unpins {Technician-A}.",
           "Step 13: Enter collapses {Technician-A}'s group.",
           "Step 14: Space expands it again.",
           "Step 15: the technician's name shows for the focused avatar, the same as on hover.",
           "Step 16: Enter opens the Column Selection options, Tab moves inside them, and Escape closes them with focus back on the "
           "Column Selection button.",
           "Step 17: Enter on the x clears the Status filter.",
           "Step 18: Enter switches to Board View."]
    tp1 = "Every control is a real button with an `aria-label`; the more-actions overlay reveals on `:focus-within`; pin and collapse are keyboard-reachable (S11-R2, S11-R7, S11-R8)"
    return mk(368151, "Every control in Tech View and Board View works from the keyboard", pre, steps, res,
              src(STORY11 + "; SV-10046 (Story 3, Board View)", "S11-R2, S11-R5, S11-R6, S11-R7, S11-R8 and S3-R13", answers=(28,),
                  extra="Tech plan (revised 24 Sep 2026) Phase 11.",
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026."),
              [q("S11-R2"), q("S11-R5"), q("S11-R6"), q("S11-R7"), q("S11-R8"), q("S3-R13"), ["Tech plan Phase 11 controls", tp1]],
              MARKER_HOLD, doc + ["Work Orders > All > Board View: if {Technician-A}'s column header shows the pinned state, click "
                                  "the pin to unpin.", check],
              ["Goal: reach and use with the keyboard the More actions button, pin, collapse arrow, an avatar, Column Selection, a "
               "filter chip's x and the display switcher."] + KBD_PART2,
              "Rewritten in full to the Rule 117 layout (own setup Doc). Answer 28 / PRD v54 S11-R2, S11-R5 to S11-R8: every control "
              "reachable with Tab and working with Enter or Space, Escape closes, focus returns (was: keys not designed). Added the "
              "avatar name on focus, Column Selection, a filter chip's x and the display switcher, which S11-R2 now names.",
              divergence=KBD_DIV)


def c368152():
    pre, doc, check = kbd_data("ZZAUTOTEST F3 Keyboard Reassign")
    steps = OPEN3 + [
        "Click once in the Search box, then put the mouse aside: from here on use only the keyboard.",
        "Press Tab until {Work-order-1}'s card has focus, then Tab to its More actions (…) button and press Enter.",
        "Move to Reassign lead technician with the arrow keys or Tab and press Enter.",
        "Type the first letters of {Technician-B}'s first name in the dialog's search box.",
        "Move to {Technician-B}'s row with the arrow keys or Tab and press Enter (if a \"Clear … scheduled shifts?\" question opens, move to Keep shifts and press Enter).",
        "Press Tab until {Work-order-3}'s card has focus, then Tab to its More actions (…) button and press Enter.",
        "Read the menu items.",
        "Move to Unassign and press Enter (if a \"Clear … scheduled shifts?\" question opens, move to Keep shifts and press Enter).",
        "Press Tab until {Work-order-2}'s card has focus, then press Space, the arrow keys and Shift with the arrow keys."]
    res = ["Step 8: {Work-order-1} moves to {Technician-B}'s column and \"Lead technician updated\" shows.",
           "Step 10: the menu offers Reassign lead technician and Unassign.",
           "Step 11: {Work-order-3} moves to the Unassigned column and \"Lead technician removed\" shows.",
           "Step 12: no key moves {Work-order-2}; it stays in its place. Reordering is by mouse or touch only."]
    tp = "The dialog is the keyboard path for moving work between technicians; it runs the same permission and status checks as the pointer path (S11-N1)"
    return mk(368152, "Reassign and Unassign work from the keyboard through the More actions menu", pre, steps, res,
              src(STORY11 + "; SV-10047 (Story 4, Reassign or unassign the lead technician)", "S11-R9, S4-R5 and Out of Scope "
                  "(keyboard reordering)", answers=(28,), extra="Tech plan (revised 24 Sep 2026) Phase 11.",
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026."),
              [q("S11-R9"), q("S4-R5"), OOS_KBD, ["Tech plan Phase 11 dialog", tp]], MARKER_HOLD, doc + [check],
              ["Goal: reassign one work order and unassign another with the keyboard only, and prove no key reorders a card."] + KBD_PART2,
              "Rewritten in full to the Rule 117 layout (own setup Doc). Answer 28 / PRD v54 S11-R9: reassigning by keyboard goes "
              "through the More actions menu, Unassign is a menu item (new steps 9-11), and there is no keyboard reorder (was: "
              "write down whether reordering works). Retitled.", divergence=KBD_DIV)


def c97020():
    pre = [PRE_ADMIN, PRE_WIDTH, pre_tech("Technician-A", "ZZAUTOTEST Ana Alpha"), pre_tech("Technician-B", "ZZAUTOTEST Ben Bravo"),
           "User {User-B} (for example ZZAUTOTEST Viewer) has a role (for example \"ZZAUTOTEST WO View Only\") with only View ticked "
           "under Work orders, at {Location-A}, and can sign in in a second browser or a private window.",
           "Customer {Customer-A} (for example \"ZZAUTOTEST F3 Keyboard Limits\") has two work orders led by {Technician-A}: "
           "{Work-order-1} (for example S10043-17711), Approved, and {Work-order-2} (for example S10043-17712), Invoiced.",
           "No technician has a shift on the Schedule for these work orders.",
           PRE_CLEAR]
    steps = ["In the second browser, sign in as {User-B}, open Work Orders, click the All tab, type the name of {Customer-A} in "
             "Search and click Board View.",
             "Click once in the Search box, then use only the keyboard: press Tab until {Work-order-1}'s card has focus.",
             "Press Tab to reach anything on the card that opens a menu, press Enter on it, and look for Reassign lead technician.",
             "Press Space, the arrow keys and Shift with the arrow keys on {Work-order-1}'s card.",
             "As yourself (the Owner or Admin user), open Work Orders, click the All tab, type the name of {Customer-A} in Search "
             "and click Board View.",
             "Click once in the Search box, then use only the keyboard: press Tab until {Work-order-2}'s card has focus.",
             "Press Tab until its More actions (…) button has focus and press Enter.",
             "Move to Reassign lead technician and press Enter.",
             "Press Escape, then press Space, the arrow keys and Shift with the arrow keys on {Work-order-2}'s card.",
             "Refresh the page, open {Work-order-2} and read Lead Technician."]
    res = ["Step 3: {User-B} cannot reach Reassign lead technician by keyboard: it is not offered, or it is disabled and Enter does "
           "nothing.",
           "Step 4: no key moves {Work-order-1}; it keeps its place and its lead, {Technician-A}.",
           "Steps 7 and 8: the menu opens, but Reassign lead technician is disabled for the Invoiced work order and Enter does "
           "nothing. Its note reads \"The lead technician can’t be changed once a work order is Invoiced or Paid.\"",
           "Step 9: no key moves {Work-order-2} to another technician.",
           "Step 10: {Work-order-2}'s Lead Technician is still {Technician-A}."]
    tp = "a keyboard-initiated reassign is refused for a locked status and without permission (S11-N1)."
    return mk(97020, "The keyboard cannot get around permission or status limits", pre, steps, res,
              src(STORY11 + "; SV-10047 (Story 4, Reassign or unassign the lead technician)", "S11-N1, S11-R9, S4-N1 and S4-N6",
                  answers=(28,), extra="Tech plan (revised 24 Sep 2026) Phase 11.",
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026."),
              [q("S11-N1"), q("S11-R9"), q("S4-N1"), q("S4-N6"), ["Tech plan Phase 11 tests", tp]], MARKER_HOLD,
              [SIGNIN, LOCATION, WIDTH, tech("Technician-A", "ZZAUTOTEST Ana Alpha"), tech("Technician-B", "ZZAUTOTEST Ben Bravo"),
               view_only_user("User-B", "ZZAUTOTEST Viewer", "ZZAUTOTEST WO View Only"),
               customer("Customer-A", "ZZAUTOTEST F3 Keyboard Limits"),
               wo("Work-order-1", "Customer-A", "S10043-17711", lead="Technician-A"),
               wo("Work-order-2", "Customer-A", "S10043-17712", lead="Technician-A") + " Then click the line's Complete button, "
               "type a Tech Story and click Complete Line; click the Finance tab and click Mark Reviewed (in the Mark as reviewed "
               "window fill Mileage or Engine Hours if asked and click Confirm review); then on the Finance tab click Create "
               "Invoice. The status reads Invoiced.",
               no_shifts("{Technician-A} and {Technician-B}"),
               CLEAR_DOC,
               "Check the setup worked: Work Orders > All > List > Search the name of {Customer-A} shows {Work-order-1} Approved and "
               "{Work-order-2} Invoiced, both led by {Technician-A}; {User-B} can sign in. Then empty Search."],
              ["Goal: a view-only user and an Invoiced work order; prove no keyboard route changes a lead the mouse may not."] + KBD_PART2,
              "Rewritten in full to the Rule 117 layout (own setup Doc). Answer 28 / PRD v54 Story 11: the keys are now defined and "
              "there is no keyboard drag, so the 'keys still being designed' note is gone and the steps name the keys. One customer "
              "with two work orders replaces two customers.", divergence=KBD_DIV)


# ---- ordering cases (Automated): the S2-R6 quote changed wording; the expected results are unchanged ----

def _bottom_names():
    return ["Aardvark Co", "Abbey Co", "Bravo Co", "Delta Co", "Echo Co"]


def c97007():
    n = _bottom_names()
    pre = [PRE_ADMIN, PRE_WIDTH,
           "User {User-B} (for example ZZAUTOTEST Dispatcher Two) has Work orders > View and Create & Edit at {Location-A} and is "
           "signed in in a second browser.",
           "Technicians {Technician-A} (for example ZZAUTOTEST Ana Alpha), {Technician-B} (for example ZZAUTOTEST Ben Bravo) and "
           "{Technician-C} (for example ZZAUTOTEST Cal Charlie) are active staff members at {Location-A} with Time Clock on and a "
           "Role other than Office User or Time Clock User.",
           "Customers {Customer-A} to {Customer-E} are used by this case only, their names start with the same words (for example "
           "\"ZZAUTOTEST F3 Reassign Bottom\") and end, in name order, with " + ", ".join(n[:-1]) + " and " + n[-1] + ".",
           "Approved work orders: {Work-order-3} (for {Customer-C}) and {Work-order-4} (for {Customer-D}) are led by "
           "{Technician-B}; {Work-order-1} (for {Customer-A}), {Work-order-2} (for {Customer-B}) and {Work-order-5} (for "
           "{Customer-E}) are led by {Technician-C} (for example S10043-17721 to S10043-17725).",
           "Nobody has reordered {Technician-B}'s work at {Location-A}, so {Technician-B}'s column starts in customer-name order: {Work-order-3}, "
           "{Work-order-4}.",
           "No technician has a shift on the Schedule for these work orders.",
           PRE_CLEAR]
    steps = ["Open Work Orders from the top menu and click the All tab.",
             "Type the shared start of the customer names (for example ZZAUTOTEST F3 Reassign Bottom) in Search.",
             "Click Board View in the display switcher.",
             "Hover {Work-order-1}'s card in {Technician-C}'s column and click its More actions (…) button.",
             "Click Reassign lead technician.",
             "Pick {Technician-B}, and click the dialog's confirm button if it shows one.",
             "Read the order of {Technician-B}'s column.",
             "Open {Work-order-2}, pick {Technician-B} in Lead Technician on the work order page, then go back to Work Orders > All > Board View with the same search.",
             "Read the order of {Technician-B}'s column.",
             "Drag {Work-order-5}'s card from {Technician-C}'s column and drop it between {Work-order-3} and {Work-order-4} in {Technician-B}'s column.",
             "Click Tech View in the display switcher and read {Technician-B}'s group.",
             "In the second browser, as {User-B}, open Work Orders > All, type the same search, and read {Technician-B}'s work in Tech View and in Board View."]
    res = ["Step 7: {Technician-B}'s column reads {Work-order-3}, {Work-order-4}, {Work-order-1}. {Work-order-1} goes to the "
           "bottom, even though by customer name it would come first.",
           "Step 9: {Technician-B}'s column reads {Work-order-3}, {Work-order-4}, {Work-order-1}, {Work-order-2}. A lead set on the "
           "work order page also goes to the bottom.",
           "Step 10: {Work-order-5} lands where it was dropped. {Technician-B}'s column reads {Work-order-3}, {Work-order-5}, "
           "{Work-order-4}, {Work-order-1}, {Work-order-2}.",
           "Steps 11 and 12: Tech View shows the same order in {Technician-B}'s group, and {User-B} sees the same order in both views."]
    return mk(97007, "A work order given a new lead from Reassign or its page goes to the bottom", pre, steps, res,
              src("story SV-10052 (Story 9, Drag to reorder work and technician groups/columns); SV-10045 (Story 2, Tech View)",
                  "S9-R14 and S2-R6",
                  extra="In version 53 (15 Oct 2026) S2-R6 was reworded to spell out the List's tie-break and to point to S9-R14; the "
                        "expected results are unchanged. Starting order (customer name A to Z): Review Decisions page 853901313, "
                        "DR-45 (29 Sep 2026).",
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026.", changed=False),
              [q("S9-R14"), q("S2-R6")], "AUTOMATION: READY",
              [SIGNIN, LOCATION, WIDTH,
               tech("Technician-A", "ZZAUTOTEST Ana Alpha"), tech("Technician-B", "ZZAUTOTEST Ben Bravo"),
               tech("Technician-C", "ZZAUTOTEST Cal Charlie"),
               "Your initials > Settings > Staff > New Staff Member (for example ZZAUTOTEST Dispatcher Two; skip if one exists) with a "
               "role that has Work orders > View and Create & Edit at {Location-A}. This is {User-B}; sign {User-B} in in a second browser."] +
              [customer(f"Customer-{x}", f"ZZAUTOTEST F3 Reassign Bottom {nm}") for x, nm in zip("ABCDE", n)] +
              [wo("Work-order-3", "Customer-C", "S10043-17723", lead="Technician-B"),
               wo("Work-order-4", "Customer-D", "S10043-17724", lead="Technician-B"),
               wo("Work-order-1", "Customer-A", "S10043-17721", lead="Technician-C"),
               wo("Work-order-2", "Customer-B", "S10043-17722", lead="Technician-C"),
               wo("Work-order-5", "Customer-E", "S10043-17725", lead="Technician-C"),
               no_shifts("{Technician-B} and {Technician-C}"),
               CLEAR_DOC,
               "Check the setup worked: Work Orders > All > List > Search the shared start of the customer names shows exactly five "
               "Approved work orders: {Work-order-3} and {Work-order-4} led by {Technician-B}; {Work-order-1}, {Work-order-2} and "
               "{Work-order-5} led by {Technician-C}. Board View shows {Technician-B}'s column as {Work-order-3}, {Work-order-4}. "
               "Then empty Search."],
              ["Goal: give two work orders a new lead (dialog, then work order page) and drag a third; read the order everywhere."],
              "Rewritten in full to the Rule 117 layout (own setup Doc); expectation unchanged. S2-R6 re-quoted from v54 (wording "
              "changed in v53). Customers and work orders became {Customer-A..E}/{Work-order-1..5}. Automated case: tell Vladimir.")


def c368144():
    n = ["Alpha Co", "Bravo Co", "Charlie Co", "Delta Co"]
    pre = [PRE_ADMIN, PRE_WIDTH, pre_tech("Technician-A", "ZZAUTOTEST Ana Alpha"),
           "Customers {Customer-A} to {Customer-D} are used by this case only, their names start with the same words (for example "
           "\"ZZAUTOTEST F3 Unassigned Place\") and end, in name order, with Alpha Co, Bravo Co, Charlie Co and Delta Co.",
           "Approved work orders (for example S10043-17731 to S10043-17734): {Work-order-1} (for {Customer-A}) and {Work-order-3} "
           "(for {Customer-C}) are led by {Technician-A}; {Work-order-2} (for {Customer-B}) and {Work-order-4} (for {Customer-D}) "
           "have no lead technician.",
           "Nobody has reordered work in Unassigned at {Location-A}.",
           "No technician has a shift on the Schedule for these work orders.",
           PRE_CLEAR]
    steps = ["Open Work Orders from the top menu and click the All tab.",
             "Type the shared start of the customer names (for example ZZAUTOTEST F3 Unassigned Place) in Search.",
             "Click Board View in the display switcher.",
             "Read the order of the Unassigned column.",
             "Hover {Work-order-3}'s card in {Technician-A}'s column, click its More actions (…) button and click Reassign lead technician.",
             "Pick Unassigned, and click the dialog's confirm button if it shows one.",
             "Read the order of the Unassigned column.",
             "Open {Work-order-1}, clear its Lead Technician on the work order page, then go back to Work Orders > All > Board View with the same search.",
             "Read the order of the Unassigned column.",
             "Click Tech View in the display switcher and read the Unassigned group."]
    res = ["Step 4: Unassigned reads {Work-order-2}, {Work-order-4}.",
           "Step 6: the message \"Lead technician removed\" shows.",
           "Step 7: Unassigned reads {Work-order-2}, {Work-order-3}, {Work-order-4}. {Work-order-3} takes its normal customer-name "
           "place, not the bottom.",
           "Step 9: Unassigned reads {Work-order-1}, {Work-order-2}, {Work-order-3}, {Work-order-4}. {Work-order-1} is first by "
           "customer name, not at the bottom.",
           "Step 10: Tech View's Unassigned group shows the same order."]
    return mk(368144, "Removing the lead puts the work order in its normal place in Unassigned", pre, steps, res,
              src("story SV-10052 (Story 9, Drag to reorder work and technician groups/columns); SV-10047 (Story 4, Reassign or "
                  "unassign the lead technician)", "S9-R14, S2-R6 and S4-R5",
                  extra="In version 53 (15 Oct 2026) S2-R6 was reworded to spell out the List's tie-break; the expected results are "
                        "unchanged. Starting order (customer name A to Z): Review Decisions page 853901313, DR-45 (29 Sep 2026). The "
                        "PRD of 7 Oct changed the removal rule (DR-47 had put a removed work order at the bottom of Unassigned); this "
                        "case follows the PRD.",
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026.", changed=False),
              [q("S9-R14"), q("S2-R6"), q("S4-R5")], "AUTOMATION: READY",
              [SIGNIN, LOCATION, WIDTH, tech("Technician-A", "ZZAUTOTEST Ana Alpha")] +
              [customer(f"Customer-{x}", f"ZZAUTOTEST F3 Unassigned Place {nm}") for x, nm in zip("ABCD", n)] +
              [wo("Work-order-1", "Customer-A", "S10043-17731", lead="Technician-A"),
               wo("Work-order-2", "Customer-B", "S10043-17732"),
               wo("Work-order-3", "Customer-C", "S10043-17733", lead="Technician-A"),
               wo("Work-order-4", "Customer-D", "S10043-17734"),
               no_shifts("{Technician-A}"),
               CLEAR_DOC,
               "Check the setup worked: Work Orders > All > List > Search the shared start of the customer names shows exactly four "
               "Approved work orders: {Work-order-1} and {Work-order-3} led by {Technician-A}, {Work-order-2} and {Work-order-4} with "
               "no lead; Board View's Unassigned column reads {Work-order-2}, {Work-order-4}. If someone has reordered Unassigned at "
               "this location, use another location. Then empty Search."],
              ["Goal: remove the lead from two work orders (dialog, then work order page) and read where each lands in Unassigned."],
              "Rewritten in full to the Rule 117 layout (own setup Doc); expectation unchanged. S2-R6 re-quoted from v54 (wording "
              "changed in v53). Automated case: tell Vladimir.")


def c368145():
    pre = [PRE_ADMIN, PRE_WIDTH, pre_tech("Technician-A", "ZZAUTOTEST Ben Bravo"),
           "Customers {Customer-A}, {Customer-B} and {Customer-C} are used by this case only, their names start with the same words "
           "(for example \"ZZAUTOTEST F3 Created With Lead\") and end, in name order, with Bravo Co, Charlie Co and Delta Co.",
           "Approved work orders {Work-order-1} (for {Customer-A}) and {Work-order-2} (for {Customer-C}) (for example S10043-17741 "
           "and S10043-17742) are led by {Technician-A}. {Customer-B} has no work order yet; the one created in step 5 is "
           "{Work-order-3}.",
           "Nobody has reordered {Technician-A}'s work at {Location-A}.",
           PRE_CLEAR]
    steps = ["Open Work Orders from the top menu and click the All tab.",
             "Type the shared start of the customer names (for example ZZAUTOTEST F3 Created With Lead) in Search.",
             "Click Board View in the display switcher.",
             "Read {Technician-A}'s column.",
             "Click Create Work Order, pick {Customer-B} and its asset, choose {Technician-A} as Lead Technician in that window and create it. If the New Work Order window has no Lead Technician field, split a line of {Work-order-1} off into a new work order instead (it keeps {Technician-A} as lead) and write down which way you used. The new work order is {Work-order-3}.",
             "Go back to Work Orders > All > Board View with the same search and read {Technician-A}'s column."]
    res = ["Step 4: {Technician-A}'s column reads {Work-order-1}, {Work-order-2}.",
           "Step 6: {Work-order-3} sits in its customer-name place: {Technician-A}'s column reads {Work-order-1}, {Work-order-3}, "
           "{Work-order-2}, and {Work-order-3} is not at the bottom. If you used Split, the split-off work order also takes its "
           "customer-name place, not the bottom."]
    return mk(368145, "A work order created with a lead keeps its normal place, not the bottom", pre, steps, res,
              src("story SV-10052 (Story 9, Drag to reorder work and technician groups/columns)", "S9-R14, S9-R3 and S2-R6",
                  extra="In version 53 (15 Oct 2026) S2-R6 was reworded to spell out the List's tie-break; the expected results are "
                        "unchanged. Engineering question and plan: PRD footer comment by Slavcho Mitrov, 29 Sep 2026, answered in "
                        "the 7 Oct PRD.",
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026.", changed=False),
              [q("S9-R14"), q("S9-R3"), q("S2-R6")], "AUTOMATION: READY",
              [SIGNIN, LOCATION, WIDTH, tech("Technician-A", "ZZAUTOTEST Ben Bravo"),
               customer("Customer-A", "ZZAUTOTEST F3 Created With Lead Bravo Co"),
               customer("Customer-B", "ZZAUTOTEST F3 Created With Lead Charlie Co") + " Do not create a work order for {Customer-B}.",
               customer("Customer-C", "ZZAUTOTEST F3 Created With Lead Delta Co"),
               wo("Work-order-1", "Customer-A", "S10043-17741", lead="Technician-A"),
               wo("Work-order-2", "Customer-C", "S10043-17742", lead="Technician-A"),
               CLEAR_DOC,
               "Check the setup worked: Work Orders > All > List > Search the shared start of the customer names shows exactly "
               "{Work-order-1} and {Work-order-2}, both Approved and led by {Technician-A}, and no work order for {Customer-B}. Then "
               "empty Search."],
              ["Goal: create a work order with a lead for a customer whose name sorts in the middle, and read where it lands."],
              "Rewritten in full to the Rule 117 layout (own setup Doc); expectation unchanged. S2-R6 re-quoted from v54 (wording "
              "changed in v53). Automated case: tell Vladimir.")


def c368214():
    pre = [PRE_ADMIN, PRE_WIDTH,
           "Customer {Customer-A} (for example \"ZZAUTOTEST Back Forward\") is used by this case only and has one Approved work order, "
           "{Work-order-1} (for example S10043-17751).",
           "The Work Orders page shows List (List is highlighted in the display switcher).",
           PRE_CLEAR]
    steps = ["Open Work Orders and click the Work Orders tab.",
             "Click Status and tick Approved only. If the Work Orders tab shows no Status filter, write \"no Status filter on this tab\" in the result comment and go on.",
             "Click Search and type the name of {Customer-A}.",
             "Click {Work-order-1}'s row to open it.",
             "Press the browser Back button and read the tab, Status, Search and rows.",
             "Press the browser Forward button and read the page.",
             "Press the browser Back button again and read the List."]
    res = ["Step 5: the Work Orders tab, Status Approved and the same rows show, as they do in production today. Write down whether "
           "the search text is kept.",
           "Step 6: {Work-order-1} opens again.",
           "Step 7: the List shows the same tab, filters and rows as at step 5."]
    hs = "The rebuilt Work Orders List. Check saved preferences against URL links, Back and Forward, location switch, stale rows after an edit, and sorting and paging."
    bc = "List remains the default and stays exactly as it is in production today; the only addition to the Work Orders page is the switcher that offers the two new displays."
    return mk(368214, "After Back and Forward the List keeps its tab, search and filters", pre, steps, res,
              "Regression for epic SV-10043 (PR #3548); developer's regression list, received 8 Oct 2026; QA handoff test plan "
              "(generated 2026-10-08), hotspot 3; " + PRD_NAME_B + ", S1-R8 and section 1 Business Case where quoted, read 15 Oct "
              "2026. In version 54 S1-R8 gained two sentences about Tech View and Board View; its List sentence is unchanged, so the "
              "expected results are unchanged. Source-verified 15 October 2026. Last checked against build v26.40.8-7a95011 on 10/8/2026.",
              [["QA handoff hotspot 3", hs], ["PRD S1-R8", A["S1-R8"]], ["PRD section 1 Business Case", bc]], "AUTOMATION: READY",
              [SIGNIN, LOCATION, WIDTH, customer("Customer-A", "ZZAUTOTEST Back Forward"),
               wo("Work-order-1", "Customer-A", "S10043-17751"),
               "Work Orders: click List in the display switcher if another option is highlighted. " + CLEAR_DOC,
               "Check the setup worked: Work Orders > Work Orders tab > Search the name of {Customer-A} lists {Work-order-1}. Then "
               "empty Search."],
              ["Goal: one work order; open it from a filtered, searched List and go Back, Forward and Back.",
               "Record the address after each Back and Forward, and the Status, Search and row list."],
              "Rewritten in full to the Rule 117 layout (own setup Doc); expectation unchanged. S1-R8 re-quoted from v54 (two Tech "
              "View and Board View sentences added; the List sentence is unchanged). Automated case: tell Vladimir.")


PRD_NAME_B = "PRD \"Work Orders — Board View & Tech View Display Options\", Confluence 845185030, version 54 (15 Oct 2026, Chris Ward)"


def c97011():
    pre = [PRE_ADMIN, PRE_WIDTH, pre_tech("Technician-A", "ZZAUTOTEST Ana Alpha"), pre_tech("Technician-B", "ZZAUTOTEST Ben Bravo"),
           "Customer {Customer-A} (for example \"ZZAUTOTEST F3 Cancelled Drag\") has three Approved work orders: {Work-order-1} and "
           "{Work-order-2} (for example S10043-17761 and S10043-17762) led by {Technician-A}, and {Work-order-3} (for example "
           "S10043-17763) led by {Technician-B}.",
           "{Technician-A}'s column reads {Work-order-1}, {Work-order-2}, and the column counts are {Technician-A} 2 and "
           "{Technician-B} 1.",
           "No technician has a shift on the Schedule for these work orders.",
           PRE_CLEAR]
    steps = ["Open Work Orders from the top menu and click the All tab.",
             "Type the name of {Customer-A} in Search.",
             "Click Board View in the display switcher.",
             "Write down {Technician-A}'s column order and both column counts.",
             "Press on {Work-order-2}'s card, drag it over {Technician-B}'s column and, still holding the mouse button, press Escape. Then release the mouse button.",
             "Press on {Work-order-2}'s card, drag it above {Work-order-1} and press Escape before releasing.",
             "Press on {Work-order-2}'s card, drag it onto the toolbar (outside every column) and release it there.",
             "Click Tech View in the display switcher.",
             "Press on {Work-order-2}'s row, drag it over {Technician-B}'s group and, still holding the mouse button, press Escape. Then release the mouse button.",
             "Refresh the page, open {Work-order-2} and read Lead Technician."]
    res = ["Steps 5 to 9: each drag is cancelled. {Work-order-2} returns to its place, {Technician-A}'s column (or group) still reads "
           "{Work-order-1}, {Work-order-2}, the counts stay {Technician-A} 2 and {Technician-B} 1, and no message appears.",
           "Step 10: after the refresh nothing has changed and {Work-order-2}'s Lead Technician is still {Technician-A}.",
           "Steps 5, 6 and 9: Escape cancelling a drag comes from the engineering plan only. If Escape does not cancel, write that "
           "down and judge the drop-outside cancel (step 7) on its own."]
    tp = "S11-R5's Escape-cancels-drag is built in Phase 9 and only verified here"
    return mk(97011, "A cancelled drag leaves the order and the lead unchanged", pre, steps, res,
              src("story SV-10052 (Story 9, Drag to reorder work and technician groups/columns)", "S9-N3",
                  extra="Tech plan (revised 24 Sep 2026) Phase 11. Until version 54 the PRD's S11-R5 asked the design to define how "
                        "Escape cancels an interaction; version 54 rewrote it to \"Escape closes an open menu, dialog or tooltip\", so "
                        "Escape cancelling a drag now rests on the tech plan alone and is no longer quoted from the PRD. The "
                        "expected results are unchanged.",
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026.", changed=False),
              [q("S9-N3"), ["Tech plan Phase 11 Escape", tp]], "AUTOMATION: READY",
              [SIGNIN, LOCATION, WIDTH, tech("Technician-A", "ZZAUTOTEST Ana Alpha"), tech("Technician-B", "ZZAUTOTEST Ben Bravo"),
               customer("Customer-A", "ZZAUTOTEST F3 Cancelled Drag"),
               wo("Work-order-1", "Customer-A", "S10043-17761", lead="Technician-A"),
               wo("Work-order-2", "Customer-A", "S10043-17762", lead="Technician-A"),
               wo("Work-order-3", "Customer-A", "S10043-17763", lead="Technician-B"),
               no_shifts("{Technician-A} and {Technician-B}"),
               CLEAR_DOC,
               "Check the setup worked: Work Orders > All > Board View > Search the name of {Customer-A}: {Technician-A}'s column "
               "reads {Work-order-1}, {Work-order-2} (if not, drag them into that order) and {Technician-B}'s holds {Work-order-3}. "
               "Then empty Search."],
              ["Goal: start three drags and cancel each (Escape twice, a drop outside every column once), then repeat one in Tech View.",
               "Use Playwright mouse.down / mouse.move / keyboard.press('Escape') / mouse.up; record column contents and counts after each."],
              "Rewritten in full to the Rule 117 layout (own setup Doc); expectation unchanged. S11-R5 is no longer quoted: in PRD "
              "v54 it covers menus, dialogs and tooltips only, so Escape-cancels-drag rests on the tech plan (already the case's own "
              "fallback). The Tech View repeat is written out. One customer replaces three. Automated case: tell Vladimir.")


def c97024():
    pre = [PRE_ADMIN, PRE_WIDTH,
           "You can open Google Analytics for the property the QA build reports to, at Admin > DebugView, and your device shows "
           "there within a few seconds of opening any ShopView page. If you cannot open DebugView, the event checks cannot be done "
           "by hand: write \"not checked by hand\" in the result comment and pass or fail on what you can see on the Work Orders page.",
           "The event names to look for in DebugView are work_orders_display_view, work_orders_field_load, work_orders_density_load, "
           "work_orders_field_toggle and work_orders_density_change.",
           "Your role has See financial data.",
           "In Board View's Fields to display, VIN/Serial is on as a saved choice and every other optional field is at its default.",
           "You start in a fresh browser session: every browser window was closed, a new private window opened and you signed in."]
    steps = ["Open Work Orders and click Board View in the display switcher.",
             "In DebugView, count the work_orders_field_load events and read each one's field name, on or off value and source.",
             "Click Tech View in the display switcher.",
             "In DebugView, count the new work_orders_field_load events.",
             "Click Board View in the display switcher.",
             "Click List in the display switcher.",
             "Click Board View in the display switcher.",
             "In DebugView, count the new work_orders_field_load and work_orders_density_load events since step 4."]
    res = ["Step 2: 13 events, one per optional Board View field (lead technician name, customer, asset, VIN/serial, progress, "
           "service advisor, clocked in, line count, line technicians, estimated hours, total price, on-site indicator, created "
           "date). Fields you never changed show source default, and VIN/Serial shows on with source saved. There is also one "
           "work_orders_density_load event for Board View.",
           "Step 4: 15 events for Tech View's optional columns, plus one work_orders_density_load event.",
           "Step 8: no new field events and no new density events. Reopening a display in the same session records nothing again. "
           "The session's field-load events total 13 + 15 = 28."]
    s12 = A["S12-R2"]
    fl = "*Optional fields:* lead technician name, customer, asset (year/make/model), VIN/serial, progress, service advisor, clocked in (the names of the technicians currently clocked in to the work order, shown the way List’s Clocked In column shows them today: the first technician’s full name, then +N, with every name on hover), line count, line technicians, estimated hours, total price, on-site indicator, and created date."
    return mk(97024, "Fields on and off are recorded once per display per session", pre, steps, res,
              src("story SV-10593 (Story 12, Google Analytics for display and field usage); SV-10048 (Story 5, Fields to display and "
                  "columns)", "S12-R2 and S5-R11", answers=(31,),
                  extra="Event names and timing: SV-10593 comments by Slavcho Mitrov and Milos Vasic, 6 Oct 2026 (the agreed GA4 event "
                        "table). Field counts (Board View 13, Tech View 15) from Slavcho Mitrov's SV-10593 comment, 6 Oct 2026. In "
                        "version 54 the clocked-in wording of S5-R11's field list changed (full name, answer 31); the list of fields "
                        "is unchanged, so the expected results are unchanged.",
                  checked="Last checked against build v26.40.8-7a95011 on 10/8/2026.", changed=False),
              [["S12-R2", s12], ["S5-R11 optional fields", fl]], "AUTOMATION: HOLD - not manually testable (developer/automated check only)",
              [SIGNIN, LOCATION, WIDTH,
               "Check your role has See financial data: your initials > Settings > Roles & Permissions > your role.",
               "Work Orders > Board View > Fields to display: turn VIN/Serial on, so one optional field is a saved choice; leave every "
               "other field at its default.",
               "Close every browser window, open a new private window and sign in, so a fresh analytics session starts.",
               "Check the setup worked: Google Analytics > Admin > DebugView opens and shows your device within a few seconds of "
               "opening any ShopView page. If it does not, carry on and write \"not checked by hand\" for the event checks."],
              ["Goal: count the field-load events per display in one analytics session.",
               "Read the GA4 events from the page's dataLayer (window.dataLayer) after each step instead of DebugView, and record "
               "each work_orders_field_load event's field, value and source."],
              "Rewritten in full to the Rule 117 layout (own setup Doc); expectation unchanged. S5-R11's field list re-quoted from v54 "
              "(clocked in: full name, answer 31). Marker unchanged.")


OLDER_B = [c97021, c97022, c368150, c368151, c368152, c97020, c97007, c368144, c368145, c368214, c97011, c97024]
