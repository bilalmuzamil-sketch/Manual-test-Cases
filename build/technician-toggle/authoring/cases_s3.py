"""Story 3 — Who appears on the technician lists (SV-11881): each of the seven lists, each S3-R1 condition, non-technician leads, pinned
columns, people already on a line, empty states, refresh timing (S1-E3), screens opened before the change (S3-N3)."""
from tt_lib import C, HOLD, A
from common import *

S = "S3"
A_OFF = staff(tech=False, role="the built-in Parts Manager role")
B = tech_b()
BOARD = "Start on Work Orders, Board View, at the test location."
NOT_A = "Staff member A is not offered."
WO1_B = wo(1, "Approved", "staff member B", extra=", with one approved line, line 1", why=", so the work order has a lead and a line")
LOCC = ("Have a new location for this test, location C, in the same organization, where no enrolled staff member is a technician "
        "(every staff member enrolled there has Technician off), so the board there has no technician.")
SW_C = "Switch to location C."

C("S3-01", S, "Board View gives a column only to technicians",
  [ADMIN, A_OFF, B, BOARD],
  ["Reload the Board View page."],
  [["Staff member B has a column.", "Staff member A has no column, although their Time Clock is on."]],
  ["S3-R2", "S3-N1", "S3-R1", "T-LISTS", "GOAL-1"])
C("S3-02", S, "Tech View gives a group only to technicians",
  [ADMIN, A_OFF, B, "Start on Work Orders at the test location."],
  ['In the display switcher, pick "Tech View".'],
  [["Tech View opens.", "Staff member B has a group.", "Staff member A has no group, although their Time Clock is on."]],
  ["S3-R2", "S3-N1", "T-TECHVIEW", "GOAL-1"])
C("S3-03", S, "The Technician filter offers only the people the board gives a column to",
  [ADMIN, A_OFF, B, BOARD],
  ["Open the Technician filter.", "Type staff member A's first name in the filter's search."],
  [["The filter offers staff member B.", "The filter offers exactly the people who have a column on the board."],
   ["Staff member A is not listed."]],
  ["S3-R3", "S3-N1"])
C("S3-04", S, "Assign lead technician offers only technicians and says when none match",
  [ADMIN, A_OFF, B, wo(1, "Approved", "nobody (no lead)", extra=", so its card is in Unassigned"), BOARD],
  ["Open work order 1's card more-actions menu.", "Click Assign lead technician.", "Type staff member A's first name in the window's search."],
  [["The more-actions menu opens."], ["The Assign lead technician window opens and offers staff member B."],
   ["The window shows the existing message No technicians match “[what you typed]”, with your typed text in place of the brackets.", NOT_A]],
  ["S3-R4", "S3-N1"])
C("S3-05", S, "Reassign lead technician does not offer a non-technician",
  [ADMIN, A_OFF, B.replace("so the list has a technician to compare with", "so work order 1 has a technician lead"), "Have a new staff member for this test, staff member C, on the built-in Technician role, with Time Clock on and Technician on, enrolled at the test location only.",
   WO1_B, BOARD],
  ["Open work order 1's card more-actions menu.", "Click Reassign lead technician.", "Type staff member A's first name in the window's search."],
  [["The more-actions menu opens."], ["The Reassign lead technician window opens and offers staff member C."],
   ["The window shows the existing message No technicians match “[what you typed]”.", NOT_A]],
  ["S3-R4"])
C("S3-06", S, 'A current lead who is not a technician shows as "Current · no longer assignable"',
  [ADMIN, B, staff(role="the built-in Parts Manager role"),
   wo(1, "Approved", "staff member A", extra=", with staff member A's Technician then switched off (and the warning saved), so the lead is no longer a technician"),
   BOARD],
  ["Open work order 1's card more-actions menu.", "Click Reassign lead technician.", "Click staff member A's entry.", "Type staff member A's first name in the window's search."],
  [["The more-actions menu opens."],
   ['The Reassign lead technician window opens.', 'Staff member A is listed last, labeled "Current · no longer assignable".', "Staff member B is offered above."],
   ["Nothing is picked: staff member A cannot be picked, and the window stays open."],
   ["The search finds staff member A's entry, still labeled \"Current · no longer assignable\"."]],
  ["S3-R4", "S3-R7"])
C("S3-07", S, "The Lead Technician dropdown offers only technicians",
  [ADMIN, A_OFF, B, wo(1, "Approved", "nobody (no lead)")],
  ["Open work order 1.", "Open the Lead Technician dropdown."],
  [["Work order 1 opens."], ["The dropdown offers staff member B.", NOT_A]],
  ["S3-R5", "S3-N1"])
C("S3-08", S, "Add Technician in the New Line window offers only technicians",
  [ADMIN, A_OFF, B, wo(1, "Approved", "staff member B")],
  ["Open work order 1.", "Click New Line.", "Open Add Technician."],
  [["Work order 1 opens."], ["The New Line window opens."], ["Add Technician offers staff member B.", NOT_A]],
  ["S3-R6", "S3-N1"])
C("S3-09", S, "Add Technician in the Edit Line window offers only technicians",
  [ADMIN, A_OFF, B, WO1_B],
  ["Open work order 1.", "Open Edit Line for line 1.", "Open Add Technician."],
  [["Work order 1 opens."], ["The Edit Line window opens."], ["Add Technician offers staff member B.", NOT_A]],
  ["S3-R6"])
C("S3-10", S, "The Edit Labor technician list offers only technicians",
  [ADMIN, A_OFF, B, WO1_B.replace("line 1", "line 1, holding no labor")],
  ["Open work order 1.", "Open Edit Labor for line 1."],
  [["Work order 1 opens."], ["The Edit Labor window opens.", "Its technician list offers staff member B.", "Staff member A is not listed."]],
  ["S3-R6"])

# ---- each S3-R1 condition (checked on Board View and the Lead Technician dropdown, with a technician as the control) --------------
def cond(key, title, a, q, extra_steps=(), extra_res=()):
    C(key, S, title, [ADMIN, a, B, wo(1, "Approved", "nobody (no lead)"), BOARD],
      ["Reload the Board View page.", "Open work order 1.", "Open the Lead Technician dropdown."] + list(extra_steps),
      [["Staff member B has a column.", "Staff member A has no column."], ["Work order 1 opens."], ["The dropdown offers staff member B.", NOT_A]] + list(extra_res),
      q)

cond("S3-11", "Someone with Time Clock off is not offered", staff(tc=False, tech=False), ["S3-R1", "S3-N1", "KD-TWO", "T-TECH"])
cond("S3-12", "A deactivated technician is not offered",
     staff(extra=", then deactivated with Deactivate Account"), ["S3-R1", "S1-E2"])
cond("S3-13", "A technician not enrolled at this location is not offered here",
     staff(where="enrolled at location B only (a second location of the organization)"),
     ["S3-R1"], extra_steps=["Switch to location B.", "Open Work Orders, Board View."],
     extra_res=[["You are working at location B."], ["Staff member A has a column at location B."]])
cond("S3-14", "Someone on the Office User role is never offered", staff(tech=False, role="the built-in Office User role"), ["S3-R1", "S3-N2"])
cond("S3-15", "Someone on the Time Clock User role is never offered", staff(tech=False, role="the built-in Time Clock User role"), ["S3-R1", "S3-N2"])
C("S3-16", S, "A technician on a custom role made from Office User is offered",
  [ADMIN, "Have a custom role made for this test from the Office User template, role A, so staff member A is on a role copied from Office User.",
   staff(role="role A"), wo(1, "Approved", "nobody (no lead)"), BOARD],
  ["Reload the Board View page.", "Open work order 1.", "Open the Lead Technician dropdown."],
  [["Staff member A has a column."], ["Work order 1 opens."], ["The dropdown offers staff member A."]],
  ["S3-R1", "S1-N1", "T-TECH"])

# ---- a lead who is not a technician (S3-R7, S3-E1, S3-R7a) -----------------------------------------------------------------------
LEAD_A = wo(1, "In Progress", "staff member A", extra=", with staff member A's Technician then switched off (and the warning saved), so the lead is no longer a technician")
A_WAS = staff(role="the built-in Parts Manager role")
C("S3-17", S, "A lead who is no longer a technician still shows as the lead everywhere",
  [ADMIN, A_WAS, B, LEAD_A, BOARD],
  ["Reload the Board View page.", 'In the display switcher, pick "Tech View".', "Open work order 1."],
  [["Staff member A still has a column, holding work order 1's card."], ["Staff member A still has a group, holding work order 1."],
   ["Work order 1 shows staff member A as its lead."]],
  ["S3-R7", "S3-E1", "S3-R2", "S2-R5"])
C("S3-18", S, "A former technician lead is grayed out last and leaves once replaced",
  [ADMIN, A_WAS, B, LEAD_A],
  ["Open work order 1.", "Open the Lead Technician dropdown.", "Click staff member A's entry.", "Pick staff member B.", "Open the Lead Technician dropdown."],
  [["Work order 1 shows staff member A as its lead."], ["Staff member A is listed last, grayed out, with the check mark.", "Staff member B is offered."],
   ["Nothing changes: staff member A cannot be picked."], ["The lead changes to staff member B at once, with no separate save."],
   ["Staff member A is no longer listed."]],
  ["S3-R7"])
C("S3-19", S, "A non-technician lead's board column goes once the work order is reassigned",
  [ADMIN, A_WAS, B, LEAD_A.replace(", so the lead", ", and leading nothing else, so the lead")],
  ["Open work order 1.", "In the Lead Technician dropdown, pick staff member B.", "Open Work Orders, Board View, at the test location."],
  [["Work order 1 shows staff member A as its lead."], ["The lead changes to staff member B."],
   ["Staff member A has no column any more.", "Work order 1's card is in staff member B's column."]],
  ["S3-E1"])
C("S3-20", S, "A non-technician lead's board column goes once the work order is completed",
  [ADMIN, A_WAS, B, LEAD_A.replace(", so the lead", ", ready to be completed, and staff member A leading nothing else, so the lead")],
  ["Open work order 1.", "Complete work order 1.", "Open Work Orders, Board View, at the test location."],
  [["Work order 1 shows staff member A as its lead."], ["Work order 1 is complete."], ["Staff member A has no column any more."]],
  ["S3-E1"])
C("S3-21", S, "With no technicians and no lead, Lead technician shows as read-only Unassigned",
  [ADMIN, LOCC, wo(1, "Approved", "nobody (no lead)", loc="at location C")],
  ["Open work order 1."],
  [['The Lead Technician field shows as read-only text: the label "Lead technician" with "Unassigned" under it, with no dropdown, as it does today whenever that list is empty.']],
  ["S3-R7a"])
C("S3-22", S, "A non-technician lead keeps the dropdown even where no one is a technician",
  [ADMIN, LOCC, staff(role="the built-in Parts Manager role", where="enrolled at location C only"),
   wo(1, "Approved", "staff member A", loc="at location C", extra=", with staff member A's Technician then switched off (and the warning saved)")],
  ["Open work order 1.", "Open the Lead Technician dropdown."],
  [["Work order 1 shows staff member A as its lead."], ['The dropdown shows and lists "Unassigned" and staff member A.', "Staff member A is grayed out."]],
  ["S3-R7a", "S3-R7"])

# ---- someone already on a line (S3-R8) ----------------------------------------------------------------------------------------
ON_LINE = ("Have staff member A, a technician for this test (Parts Manager role, Time Clock on, Technician on, enrolled at the test location only), "
           "on line 1 of work order 1 {how}, and then switch staff member A's Technician off (and save the warning), so they are on the line but no longer a technician.")
def on_line(how): return ON_LINE.replace("{how}", how)
NAMES = ("Have two new technicians for this test, staff member B and staff member C, enrolled at the test location, one with a name that sorts before "
         "staff member A's and one after, so the list has names to order around staff member A.")
C("S3-23", S, "In Edit Labor, a former technician on the line is grayed out in name order",
  [ADMIN, NAMES, wo(1, "Approved", "staff member B", extra=", with one approved line, line 1", why=", so the line belongs to someone else's work order"), on_line("with a labor entry, added with Add Labor")],
  ["Open work order 1.", "Open Edit Labor for line 1.", "Click staff member A's tick."],
  [["Work order 1 opens and line 1 still lists staff member A."],
   ["Staff member A is listed grayed out, the same as a deactivated technician today.", "The list is in name order, so staff member A sits between staff member B and staff member C."],
   ["Staff member A stays ticked: they cannot be unticked there."]],
  ["S3-R8"])
C("S3-24", S, "In Edit Line, a former technician is a removable chip and stays when saved",
  [ADMIN, B, wo(1, "Approved", "staff member B", extra=", with one approved line, line 1", why=", so the line belongs to someone else's work order"), on_line("added with Add Technician, with no time logged on the line"),
   "Choose a new description for line 1."],
  ["Open work order 1.", "Open Edit Line for line 1.", "Replace the line description with the new description.", "Save the Edit Line window.", "Open Edit Line for line 1."],
  [["Work order 1 opens."], ["Staff member A shows as an ordinary chip with an X, not grayed out and with no lock."], ["The description field shows the new description."],
   ["The window closes and the new description shows."], ["Staff member A's chip is still there: saving kept them on the line."]],
  ["S3-R8", A(6)])
C("S3-25", S, "In Edit Line, a former technician with logged time shows the lock",
  [ADMIN, B, wo(1, "In Progress", "staff member B", extra=", with one approved line, line 1", why=", so the line belongs to someone else's work order"),
   on_line("with time logged on line 1 (they pressed Start on it and later stopped)")],
  ["Open work order 1.", "Open Edit Line for line 1.", "Hover staff member A's chip."],
  [["Work order 1 opens."], ["Staff member A's chip shows the existing lock and no X."],
   ['The text "This technician has logged time on the line and cannot be removed." shows, as today.']],
  ["S3-R8", A(6)])
C("S3-26", S, "Removing a former technician's chip in Edit Line takes them off the line",
  [ADMIN, B, wo(1, "Approved", "staff member B", extra=", with one approved line, line 1", why=", so the line belongs to someone else's work order"), on_line("added with Add Technician, with no time logged on the line")],
  ["Open work order 1.", "Open Edit Line for line 1.", "Click the X on staff member A's chip.", "Save the Edit Line window.", "Open Edit Line for line 1."],
  [["Work order 1 opens."], ["Staff member A shows as a chip with an X."], ["Staff member A's chip is gone."], ["The window closes."],
   ["Staff member A is no longer on line 1."]],
  ["S3-R8", A(6)])
C("S3-27", S, "Saving Edit Line drops a labor-only person outside the Time Clock list, as today",
  [ADMIN, B, wo(1, "Approved", "staff member B", extra=", with two approved lines, line 1 and line 2", why=", so the work order has a second line for a labor entry"),
   "Have a new staff member for this test, staff member C, who has a labor entry on line 2 of work order 1, is also on line 1 with no time logged on line 1, and then has Time Clock switched off, so they are outside the location's Time Clock list.",
   "Have a new staff member for this test, staff member D, who is on line 1 only through Add Technician, with no labor entry on work order 1, and then has Time Clock switched off.",
   "Choose a new description for line 1."],
  ["Open work order 1.", "Open Edit Line for line 1.", "Replace the line description with the new description.", "Save the Edit Line window.", "Open Edit Line for line 1."],
  [["Work order 1 opens."], ["Staff member C and staff member D both show on line 1."], ["The description field shows the new description."], ["The window closes."],
   ["Staff member C is no longer on line 1, as today.", "Staff member D is still on line 1."]],
  ["S3-R8"])

# ---- pinned column (S3-E2) ------------------------------------------------------------------------------------------------------
C("S3-28", S, "A pinned column of a non-technician stays and refuses dropped work orders",
  [ADMIN, "Use an organization with a second location, location B.", staff(role="the built-in Parts Manager role"), B,
   "On Board View at the test location, pin staff member A's column, then switch staff member A's Technician off (staff member A leads no work), so the column is a pinned non-technician column.",
   wo(1, "Approved", "staff member B"), BOARD],
  ["Reload the Board View page.", "Drag work order 1's card onto staff member A's column.", "Open work order 1.",
   "Open Work Orders, Board View, at location B.", "Open Work Orders, Board View, at the test location.", "Unpin staff member A's column.", "Reload the Board View page."],
  [["Staff member A's pinned column still shows."], ['The drop is refused with "This technician can\'t be assigned work orders."', "The card goes back to staff member B's column."],
   ["Work order 1's lead is still staff member B."], ["At location B, where staff member A is not enrolled, there is no column for staff member A."],
   ["Staff member A's pinned column shows again at the test location."], ["The column is unpinned."], ["Staff member A has no column any more."]],
  ["S3-E2", "S3-R2"])

# ---- empty states (S3-R10) ------------------------------------------------------------------------------------------------------
NT_TITLE = "No technicians yet"
NT_TEXT = "Turn Technician on for your technicians in Staff to assign work orders. Until then, every work order stays in Unassigned."
NH_TEXT = "Turn Technician on for your technicians and create your first work order to track work by tech."
WO_C = wo(1, "Approved", "nobody (no lead)", loc="at location C", extra=", so the open tab has a work order")
C("S3-29", S, 'Board View with no technicians shows "No technicians yet" with the new text',
  [ADMIN, LOCC, WO_C, "Make sure neither Assigned to me nor a Technician filter is on."],
  ["Open Work Orders, Board View."],
  [[f'The board shows the title "{NT_TITLE}" with the text "{NT_TEXT}"', "No technician column shows."]],
  ["S3-R10", A(7)])
C("S3-30", S, 'Tech View with no technicians shows "No technicians yet" with the new text',
  [ADMIN, LOCC, WO_C, "Make sure neither Assigned to me nor a Technician filter is on."],
  ["Open Work Orders, Tech View."],
  [[f'Tech View shows the title "{NT_TITLE}" with the text "{NT_TEXT}"', "No technician group shows."]],
  ["S3-R10", A(7)])
C("S3-31", S, 'With no technicians and no work orders, "Nothing here yet" has the new text',
  [ADMIN, "Have a new location for this test, location C, in the same organization, with no work order on the open tab, where no enrolled staff member is a technician (every staff member enrolled there has Technician off), so the board there has no technician and no work.",
   "Make sure neither Assigned to me nor a Technician filter is on."],
  ["Open Work Orders, Board View."],
  [['The "Nothing here yet" state shows with its title unchanged.', f'Its text reads "{NH_TEXT}"']],
  ["S3-R10"])
C("S3-32", S, '"Set Up Technicians" on the empty board opens the staff list',
  [ADMIN, LOCC, "Make sure neither Assigned to me nor a Technician filter is on."],
  ["Open Work Orders, Board View.", 'Click "Set Up Technicians".'],
  [['A button reads "Set Up Technicians" where the empty board offered Add Technician before this feature.'], ["The staff list (Settings, Staff) opens."]],
  ["S3-R10"])
C("S3-33", S, '"No technicians yet" does not show while a non-technician lead keeps a column',
  [ADMIN, LOCC, staff(role="the built-in Parts Manager role", where="enrolled at location C only"),
   wo(1, "In Progress", "staff member A", loc="at location C", extra=", with staff member A's Technician then switched off (and the warning saved)"),
   "Make sure neither Assigned to me nor a Technician filter is on."],
  ["Open Work Orders, Board View.", "Open Work Orders, Tech View."],
  [["Staff member A has a column holding work order 1.", f'"{NT_TITLE}" does not show.'], ["Staff member A has a group holding work order 1.", f'"{NT_TITLE}" does not show.']],
  ["S3-R10", "S3-E1"])
C("S3-34", S, '"No technicians yet" does not show while a pinned column is kept',
  [ADMIN, LOCC, staff(role="the built-in Parts Manager role", where="enrolled at location C only"),
   "On Board View at location C, pin staff member A's column, then switch staff member A's Technician off (staff member A leads no work).",
   "Make sure neither Assigned to me nor a Technician filter is on."],
  ["Open Work Orders, Board View."],
  [["Staff member A's pinned column shows.", f'"{NT_TITLE}" does not show.']],
  ["S3-R10", "S3-E2"])
C("S3-35", S, '"No technicians yet" does not show with Assigned to me on',
  [ADMIN, LOCC, WO_C, "Start on Work Orders, Board View, at location C, showing \"No technicians yet\"."],
  ["Switch Assigned to me on."],
  [["Assigned to me is on.", f'"{NT_TITLE}" no longer shows.']],
  ["S3-R10"])
C("S3-36", S, 'The Technician filter\'s Unassigned choice keeps "No technicians yet" away',
  [ADMIN, LOCC, WO_C, "Make sure neither Assigned to me nor a Technician filter is on.", SW_C],
  ["Open Work Orders, Board View.", "Open the Technician filter.", 'Pick "Unassigned" in the Technician filter.'],
  [[f'The board shows "{NT_TITLE}".'], ['The filter offers "Unassigned" and "Deleted technician", and no person.'],
   ["The Technician filter is on, set to Unassigned.", f'"{NT_TITLE}" no longer shows.']],
  ["S3-R10", A(3)])
C("S3-49", S, 'The filter\'s Deleted technician choice keeps "No technicians yet" away',
  [ADMIN, LOCC, WO_C, "Make sure neither Assigned to me nor a Technician filter is on.", SW_C],
  ["Open Work Orders, Board View.", "Open the Technician filter.", 'Pick "Deleted technician" in the Technician filter.'],
  [[f'The board shows "{NT_TITLE}".'], ['The filter offers "Deleted technician".'],
   ["The Technician filter is on, set to Deleted technician.", f'"{NT_TITLE}" no longer shows.']],
  ["S3-R10", A(3)])
C("S3-50", S, "People picked in the filter at another location are dropped on switching",
  [ADMIN, LOCC, B, WO_C,
   "Make sure neither Assigned to me nor a Technician filter is on.", BOARD],
  ["Open the Technician filter.", "Pick staff member B in the Technician filter.", "Switch to location C."],
  [["The filter offers staff member B."], ["The Technician filter is on, set to staff member B."],
   ["The board loads for location C.", "Staff member B is no longer picked in the Technician filter: no Technician filter is on.",
    f'The board shows "{NT_TITLE}" with the text "{NT_TEXT}"']],
  ["S3-R10", "S3-N1", A(3)])

# ---- refresh timing (S1-E3) ------------------------------------------------------------------------------------------------------
TAB2 = "Have Settings, Staff open in a second browser tab."
A_ON = staff(role="the built-in Parts Manager role", extra=", leading no work, so switching Technician off shows no warning")
OFF_ELSEWHERE = ["Switch to the Settings, Staff tab.", EDIT_A, "Switch Technician off.", SAVE]
OFF_ELSEWHERE_RES = [["The staff list shows."], ["The window shows Technician on."], ["Technician is off."], ["The window closes and staff member A's row shows \"No\"."]]

def refresh(key, title, trigger, trigger_res, extra_pre=(), q=("S1-E3",)):
    C(key, S, title, [ADMIN, A_ON, B] + list(extra_pre) + [TAB2, BOARD],
      ["Reload the Board View page."] + OFF_ELSEWHERE + ["Switch to the Board View tab."] + trigger,
      [["Staff member A has a column."]] + OFF_ELSEWHERE_RES + [["Nothing was pushed to the open board: staff member A still has a column."]] + trigger_res,
      list(q))

refresh("S3-37", "An open board picks up a Technician change when opened from the menu",
        ["Click Work Orders in the menu."], [["Board View loads again.", "Staff member A has no column.", "Staff member B has a column."]], q=("S1-E3", "S1-R6"))
refresh("S3-38", "An open board picks up a Technician change on reload",
        ["Reload the Board View page."], [["Staff member A has no column.", "Staff member B has a column."]])
refresh("S3-39", "An open board picks up a Technician change from the display switcher",
        ['In the display switcher, pick "Tech View".'], [["Tech View loads.", "Staff member A has no group.", "Staff member B has a group."]])
refresh("S3-40", "An open board picks up a Technician change when a filter changes",
        ["Open the Technician filter.", "Pick staff member B in the Technician filter.", "Clear the Technician filter."],
        [["The filter still offers staff member A (the open board has not loaded again)."], ["The board loads again, showing staff member B's column only."],
         ["The board loads again with every column.", "Staff member A has no column.", "Staff member B has a column."]])
refresh("S3-41", "An open board picks up a Technician change when the location changes",
        ["Switch to location B.", "Switch to the test location."],
        [["The board loads for location B."], ["The board loads for the test location.", "Staff member A has no column.", "Staff member B has a column."]],
        extra_pre=["Use an organization with a second location, location B, so you can switch away and back."])
refresh("S3-42", "An open board picks up a Technician change when opened from a link",
        ["Open the Board View address in a new browser tab."], [["Board View loads in the new tab.", "Staff member A has no column.", "Staff member B has a column."]])
C("S3-43", S, "Coming back with Back within 30 seconds shows the board as it was",
  [ADMIN, A_ON, B, TAB2, BOARD],
  ["Reload the Board View page."] + OFF_ELSEWHERE + ["Switch to the Board View tab.", "Open any work order from the board.",
   "Within 30 seconds, click the browser's Back button.", "Reload the Board View page."],
  [["Staff member A has a column."]] + OFF_ELSEWHERE_RES + [["Staff member A still has a column."], ["The work order opens."],
   ["The board shows as it was, with staff member A's column still there."], ["Staff member A has no column."]],
  ["S1-E3"])
C("S3-44", S, "The Reassign lead technician window shows a Technician change each time it opens",
  [ADMIN, A_ON, B, wo(1, "Approved", "staff member B"), TAB2, BOARD],
  ["Open work order 1's card more-actions menu.", "Click Reassign lead technician.", "Close the window without picking anyone."] + OFF_ELSEWHERE +
  ["Switch to the Board View tab.", "Open work order 1's card more-actions menu.", "Click Reassign lead technician."],
  [["The more-actions menu opens."], ["The window offers staff member A."], ["The window closes and the lead is unchanged."]] + OFF_ELSEWHERE_RES +
  [["Board View shows, not reloaded."], ["The more-actions menu opens."], ["The window no longer offers staff member A."]],
  ["S1-E3", "S3-R4"])
C("S3-45", S, "An open work order keeps its dropdown list until it is opened again",
  [ADMIN, A_ON, B, wo(1, "Approved", "staff member B"), TAB2, "Start on work order 1."],
  ["Open the Lead Technician dropdown.", "Press the Escape key."] + OFF_ELSEWHERE +
  ["Switch to the work order 1 tab.", "Open the Lead Technician dropdown.", "Press the Escape key.", "Reload the page.", "Open the Lead Technician dropdown."],
  [["The dropdown offers staff member A."], ["The dropdown closes."]] + OFF_ELSEWHERE_RES +
  [["Work order 1 shows, not reloaded."], ["The dropdown still offers staff member A: reopening a dropdown on the same page does not pick up the change."],
   ["The dropdown closes."], ["Work order 1 loads again."], [NOT_A]],
  ["S1-E3", "S3-R5"])
C("S3-46", S, "A screen opened before the change still accepts the non-technician",
  [ADMIN, A_ON, B, wo(1, "Approved", "staff member B"), TAB2, "Start on work order 1."],
  ["Open the Lead Technician dropdown.", "Press the Escape key."] + OFF_ELSEWHERE +
  ["Switch to the work order 1 tab.", "In the Lead Technician dropdown, pick staff member A.", "Reload the page."],
  [["The dropdown offers staff member A."], ["The dropdown closes."]] + OFF_ELSEWHERE_RES +
  [["Work order 1 shows, not reloaded."], ["The lead changes to staff member A and is accepted, as today, with no error."],
   ["Work order 1 shows staff member A as its lead."]],
  ["S3-N3", "KD-OFFER"])
C("S3-47", S, "If only the technician list fails, the work order still loads",
  [ADMIN, B, wo(1, "Approved", "staff member B", extra=", with one approved line, line 1, holding a labor entry for staff member B")],
  ["Open work order 1.", "Open the Lead Technician dropdown."],
  [["The list of technicians fails to come back.", "The app's existing request error shows, with no new message.",
    "The rest of work order 1 loads.", "Staff member B shows grayed out as the lead and on line 1."],
   ["The dropdown offers nobody (it is empty on a first load)."]],
  ["EH-S3"], marker=HOLD("a manual tester cannot make only the list of technicians fail while the rest of the work order loads"))
# ---- v20 (3 Nov 2026) S3-N1: a picked person whose Technician is turned off (round 4, rewritten top to bottom and new cases) -------
A_PM = staff(role="the built-in Parts Manager role", extra=", leading no work order")
WO1_LINE_A = wo(1, "Approved", "staff member B", extra=", with one approved line, line 1, holding a labor entry for staff member A",
                why=", so staff member A has work that must not move and the board gives them no column once turned off")
PICK_OFF = ["Open the Technician filter.", "Pick staff member A in the Technician filter.", "Switch to the Settings, Staff tab.", EDIT_A, "Switch Technician off.", SAVE,
   "Click Save in the warning.", "Switch to the Board View tab."]
PICK_OFF_RES = [["The filter offers staff member A."], ["The Technician filter is on, set to staff member A."], ["The staff list shows."],
   ["The window shows Technician on."], ["Technician is off."], ['The "Turn Off Technician" warning shows, because staff member A is on line 1.'],
   ["The warning and the window close.", 'Staff member A\'s row shows "No" in the Technician column.'], ["Board View shows, not reloaded."]]
C("S3-48", S, "A turned-off person picked in the filter drops out when the page is reloaded",
  [ADMIN, A_PM, B, WO1_LINE_A, TAB2, BOARD],
  PICK_OFF + ["Open the Technician filter.", "Reload the Board View page.", "Open the Technician filter.", "Open work order 1."],
  PICK_OFF_RES + [["Staff member A is still picked in the Technician filter: the open page has not loaded again."],
   ["Board View loads again."],
   ["Staff member A is no longer picked, as if never picked, and is no longer offered in the filter."],
   ["Staff member B is still the lead and line 1 still shows staff member A's labor entry: the work did not move."]],
  ["S3-N1", "S3-R3", "S2-R5", A(4)])
C("S3-51", S, 'A turned-off person stays picked while Work Orders stays open',
  [ADMIN, A_PM, B, WO1_LINE_A, TAB2, BOARD],
  PICK_OFF + ['In the display switcher, pick "Tech View".', "Open the Technician filter.", "Untick staff member A in the Technician filter."],
  PICK_OFF_RES + [["Tech View shows.", 'Staff member A is the only person picked and has no group, so the board shows "No work orders match these filters".'],
   ["Staff member A is still picked and offered in the filter."],
   ["The Technician filter is off.", "Staff member B's group shows with work order 1."]],
  ["S3-N1", "S3-R3"])
C("S3-52", S, "A picked person who still leads shown work stays picked after turning off",
  [ADMIN, A_PM.replace(", leading no work order", ""), B,
   wo(1, "In Progress", "staff member A", why=", so staff member A keeps a column for that work after Technician is turned off"), TAB2, BOARD],
  ["Open the Technician filter.", "Pick staff member A in the Technician filter.", "Switch to the Settings, Staff tab.", EDIT_A, "Switch Technician off.", SAVE,
   "Click Save in the warning.", "Switch to the Board View tab.", "Reload the Board View page.", "Open the Technician filter."],
  [["The filter offers staff member A."], ["The Technician filter is on, set to staff member A."], ["The staff list shows."],
   ["The window shows Technician on."], ["Technician is off."], ['The "Turn Off Technician" warning shows, because staff member A leads work order 1.'],
   ["The warning and the window close."], ["Board View shows."],
   ["Staff member A still has a column, holding work order 1's card."],
   ["Staff member A is still offered and still picked in the filter."]],
  ["S3-N1", "S3-E1", "S3-R3"])
C("S3-53", S, "A turned-off person picked in the filter drops out when Work Orders is reopened",
  [ADMIN, A_PM, B, WO1_LINE_A, TAB2, BOARD],
  PICK_OFF + ["Click Work Orders in the menu.", "Open the Technician filter."],
  PICK_OFF_RES + [["Work Orders opens again on Board View."],
   ["Staff member A is no longer picked, as if never picked, and is no longer offered in the filter.", "Work order 1's card is still in staff member B's column."]],
  ["S3-N1", "S3-R3"])

# Location C cases: the switch to location C is the last precondition, after every record is set up there.
import tt_lib as _L
for _c in _L.CASES:
    if _c["sec"] == "S3" and _c["key"] != "S3-36" and any(_p.startswith("Have a new location for this test, location C") for _p in _c["pre"]) \
            and not any(_p.startswith("Start on") for _p in _c["pre"]) and SW_C not in _c["pre"]:
        _c["pre"].append(SW_C)
