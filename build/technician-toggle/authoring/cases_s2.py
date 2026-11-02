"""Story 2 — Turn Off Technician warning (SV-11880): every S2-R3 wording form, every counted kind and status, another location, name as
last saved, the three ways to turn Technician off and two at once, Cancel / X / Escape / outside, Save, loading state, Sales
Representative warning, no-warning cases. Counts are seeded exactly (Rule 116): each case says what staff member A holds."""
from tt_lib import C, HOLD
from common import *

S = "S2"
A_TECH = staff(where="enrolled at the test location and at location B", extra=", who holds nothing except the work named below")
A_TECH1 = staff(extra=", who holds nothing except the work named below")
B_LEAD = tech_b()
LOCB = "Use an organization with a second location, location B, so open work can sit at another location."
WT = "The warning window titled \"Turn Off Technician\" shows, with a Cancel button and a Save button."


def warn(key, title, pre, text, q, extra_res=None):
    res = TURN_OFF_RES + [[WT, f'Its text reads "{text}"'] + (extra_res or [])]
    C(key, S, title, [ADMIN] + pre + [LIST], TURN_OFF, res, q, note=NAME_NOTE)


def nowarn(key, title, pre, q, why):
    res = TURN_OFF_RES + [["No warning window shows and the save goes straight on.", "The window closes.",
                           'Staff member A\'s row shows "No" in the Technician column (the save ran).']]
    C(key, S, title, [ADMIN] + pre + [LIST], TURN_OFF, res, q, note=why)


T10 = f"{NAME} leads 1 open work order.{WARN_TAIL}"
T01 = f"{NAME} is on 1 labor line.{WARN_TAIL}"
T11 = f"{NAME} leads 1 open work order and is on 1 labor line.{WARN_TAIL_N}"
T05 = f"{NAME} is on 5 labor lines.{WARN_TAIL_N}"
T30 = f"{NAME} leads 3 open work orders.{WARN_TAIL_N}"
T23 = f"{NAME} leads 2 open work orders and is on 3 labor lines.{WARN_TAIL_N}"

# ---- the five S2-R3 forms and the plural/plural form ---------------------------------------------------------------------------
warn("S2-01", "Warning for 1 led work order in Estimate and no lines",
     [A_TECH1, wo(1, "Estimate", "staff member A", extra=", with no line that staff member A is on, so the warning has one led work order to count")], T10,
     ["S2-R3 1/0", "S2-R2", "S2-R1", "UFS-4", "T-OPEN", "KD-WARN"])
warn("S2-02", "Warning for no led work orders and 1 labor line",
     [A_TECH1, B_LEAD, wo(1, "Approved", "staff member B", extra=", with one line, line 1, holding a labor entry for staff member A added with Add Labor, so staff member A is on one line")],
     T01, ["S2-R3 0/1", "S2-R1", "S2-R2"])
warn("S2-03", "A line on a work order they lead counts as one work order and one line",
     [A_TECH1, wo(1, "In Progress", "staff member A", extra=", with one line, line 1, holding a labor entry for staff member A, so the same job holds a lead and a line")],
     T11, ["S2-R3 1/1", "S2-R1"])
warn("S2-04", "Warning counts 5 lines across labor, Add Technician, own line and shift",
     [A_TECH1, B_LEAD,
      wo(1, "Approved", "staff member B", extra=(", with five lines that are not declined, so each way of being on a line is counted once: line 1 and line 2 "
         "each hold a labor entry for staff member A; staff member A is added to line 3 with Add Technician (no labor); staff member A is "
         "line 4's own technician (no labor, not added with Add Technician); staff member A is added to line 5 through a shift on the Schedule (no labor)"))],
     T05, ["S2-R3 0/5", "S2-R1", "T-OPEN"])
warn("S2-05", "Warning for 3 led work orders in Estimate, Approved and Ready for Review",
     [A_TECH1, "Have three new service work orders for this test at the test location, work order 1 in Estimate, work order 2 in Approved and work order 3 in Ready for Review, each led by staff member A, with no line that staff member A is on, so there are three led work orders to count."],
     T30, ["S2-R3 3/0", "S2-R1"], extra_res=["The text has no labor line part."])
warn("S2-06", "Warning for 2 led work orders and 3 lines across two locations",
     [LOCB, A_TECH, B_LEAD,
      wo(1, "In Progress", "staff member A", extra=", with no line that staff member A is on, so the warning has a led work order to count"),
      wo(2, "Approved", "staff member A", extra=", with no line that staff member A is on, so the warning has a led work order to count", loc="at location B"),
      wo(3, "Approved", "staff member B", extra=", with three lines that are not declined, each holding a labor entry for staff member A, so the lines add up to 3")],
     T23, ["S2-R2", "S2-R1", "UFS-4"])

# ---- each counted kind and status on its own (one led work order or one line each) ------------------------------------------------
for k, st in (("S2-07", "Approved"), ("S2-08", "In Progress"), ("S2-09", "Ready for Review")):
    warn(k, f"A led service work order in {st} is counted as open work",
         [A_TECH1, wo(1, st, "staff member A", extra=", with no line that staff member A is on, so the warning has a led work order to count")], T10, ["S2-R1", "T-OPEN"])
warn("S2-10", "Being added to a line with Add Technician is counted as one line",
     [A_TECH1, B_LEAD, wo(1, "Approved", "staff member B", extra=", with one line, line 1, to which staff member A is added with Add Technician and has no labor, so the only link is Add Technician")],
     T01, ["S2-R1", "T-OPEN"])
warn("S2-11", "Being a line's own technician is counted as one line",
     [A_TECH1, B_LEAD, wo(1, "Approved", "staff member B", extra=", with one line, line 1, whose own technician is staff member A (no labor, not added with Add Technician), so that is the only link")],
     T01, ["S2-R1", "T-OPEN"])
warn("S2-12", "Being added to a line through a schedule shift is counted as one line",
     [A_TECH1, B_LEAD, wo(1, "Approved", "staff member B", extra=", with one line, line 1, to which staff member A is added only through a shift on the Schedule, so the shift is the only link")],
     T01, ["S2-R1", "T-OPEN"])
warn("S2-13", "One line held three ways at once is counted once",
     [A_TECH1, B_LEAD, wo(1, "Approved", "staff member B", extra=(", with one line, line 1, that holds a labor entry for staff member A, has staff member A "
                                                                  "added with Add Technician and has staff member A as its own technician, so one line is linked three ways"))],
     T01, ["S2-R1"])
warn("S2-14", "A led work order at another location is counted",
     [LOCB, A_TECH, wo(1, "In Progress", "staff member A", extra=", with no line that staff member A is on, so the warning has a led work order to count", loc="at location B")],
     T10, ["S2-R1"], extra_res=["The count includes work order 1, although it is at location B and you are working at the test location."])

# ---- never counted ---------------------------------------------------------------------------------------------------------------
NOCOUNT_WHY = "The work order or line named in the preconditions is the only thing staff member A holds, and it must not be counted."
for k, st in (("S2-15", "Declined"), ("S2-16", "Complete"), ("S2-17", "Invoiced"), ("S2-18", "Paid")):
    nowarn(k, f"A led work order that is {st} is not counted",
           [A_TECH1, wo(1, st, "staff member A", extra=", with a line holding a labor entry for staff member A, so the person holds only work that is closed")],
           ["S2-E1", "S2-N1"], NOCOUNT_WHY + " Work order 1 stays as it is.")
nowarn("S2-19", "Time on a part sale is not counted",
       [A_TECH1, "Have a new part sale for this test at the test location on which staff member A has recorded time, so the person holds only a part sale."],
       ["S2-E1", "S2-N1"], NOCOUNT_WHY + " The part sale stays as it is.")
nowarn("S2-20", "A declined line on an open work order is not counted",
       [A_TECH1, B_LEAD, wo(1, "In Progress", "staff member B", extra=", with one declined line holding a labor entry for staff member A, so the only link is a declined line")],
       ["S2-E1", "S2-N1"], NOCOUNT_WHY + " Work order 1 stays as it is.")
nowarn("S2-21", "No open work at all means no warning",
       [A_TECH1.replace(", who holds nothing except the work named below", ", who leads no work order and is on no line")],
       ["S2-N1"], "Staff member A holds no work at all.")

# ---- name as last saved ----------------------------------------------------------------------------------------------------------
C("S2-22", S, "The warning names the staff member as last saved, not a new name typed",
  [ADMIN, A_TECH1, wo(1, "In Progress", "staff member A", why=", so the warning has a led work order to count"), LIST],
  [EDIT_A, "Replace the first name with a new first name.", "Switch Technician off.", SAVE, "Click Save in the warning."],
  [["The Edit Staff Member window opens with Technician on."], ["The first name field shows the new first name."], ["Technician is off."],
   [WT, f'Its text reads "{T10}", with the first name as it was before this edit, not the new one typed.'],
   ["The warning and the window close.", "Staff member A's row shows the new first name and \"No\" in the Technician column."]],
  ["S2-R2", "S2-R3 1/0"], note=NAME_NOTE)

# ---- the other ways to turn Technician off, and two at once ----------------------------------------------------------------------
def way(key, title, steps, res, q):
    C(key, S, title, [ADMIN, A_TECH1, wo(1, "In Progress", "staff member A", extra=", with no line that staff member A is on, so the warning has a led work order to count"), LIST],
      [EDIT_A] + steps + [SAVE, "Click Save in the warning."],
      [["The Edit Staff Member window opens with Technician on."]] + res +
      [[WT, f'Its text reads "{T10}"'], ["The warning closes without a second warning showing.", "The window closes.",
                                         'Staff member A\'s row shows "No" in the Technician column.']],
      q, note=NAME_NOTE)

way("S2-23", "Switching Time Clock off shows the same warning", ["Switch Time Clock off."], [["Time Clock is off.", "Technician switches off and is grayed out."]],
    ["S2-R1", "S1-R4"])
way("S2-24", "Picking the Office User role shows the same warning", ['In Role, pick "Office User".'],
    [["Technician switches off and is grayed out."]], ["S1-N1", "S2-R1"])
way("S2-25", "Picking the Time Clock User role shows the same warning", ['In Role, pick "Time Clock User".'],
    [["Technician switches off and is grayed out."]], ["S1-N1", "S2-R1"])
way("S2-26", "Technician and Time Clock both switched off shows the warning once",
    ["Switch Technician off.", "Switch Time Clock off."], [["Technician is off."], ["Time Clock is off and Technician stays off and grayed out."]], ["S2-E2"])
way("S2-27", "Time Clock off and the Office User role shows the warning once",
    ["Switch Time Clock off.", 'In Role, pick "Office User".'], [["Technician switches off and is grayed out."], ["Technician stays off and grayed out."]],
    ["S2-E2"])

# ---- Cancel, X, Escape, outside -------------------------------------------------------------------------------------------------
def dismiss(key, how, how_res):
    C(key, S, f"{how[0]} in the warning leaves the staff member unsaved",
      [ADMIN, A_TECH1, wo(1, "In Progress", "staff member A", extra=", with no line that staff member A is on, so the warning has a led work order to count"), LIST],
      TURN_OFF + [how[1], "Close the Edit Staff Member window with its X.", EDIT_A],
      TURN_OFF_RES + [[WT], how_res + ["The Edit Staff Member window is still open.", "Technician is still off, as you left it."],
                      ["The window closes.", 'Staff member A\'s row still shows "Yes" in the Technician column.'],
                      ["Technician is on: nothing was saved."]],
      ["S2-R4"])

dismiss("S2-28", ("Cancel", "Click Cancel in the warning."), ["The warning closes."])
dismiss("S2-29", ("The X", "Click the X of the warning."), ["The warning closes."])
dismiss("S2-30", ("Escape", "Press the Escape key."), ["The warning closes."])
C("S2-31", S, "Clicking outside the warning does nothing",
  [ADMIN, A_TECH1, wo(1, "In Progress", "staff member A", extra=", with no line that staff member A is on, so the warning has a led work order to count"), LIST],
  TURN_OFF + ["Click on the page outside the warning window.", "Click Cancel in the warning."],
  TURN_OFF_RES + [[WT], ["The warning stays open, with its text unchanged."], ["The warning closes and the Edit Staff Member window is still open."]],
  ["S2-R4"])

# ---- Save in the warning --------------------------------------------------------------------------------------------------------
C("S2-32", S, "Save in the warning saves the staff member and unassigns nothing",
  [ADMIN, A_TECH1, B_LEAD, wo(1, "In Progress", "staff member A", extra=", with no line that staff member A is on, so the warning has a led work order to count"),
   wo(2, "Approved", "staff member B", extra=", with one line, line 1, holding a labor entry for staff member A, so staff member A is on one line"), LIST],
  TURN_OFF + ["Click Save in the warning.", "Open work order 1.", "Open work order 2."],
  TURN_OFF_RES + [[WT, f'Its text reads "{T11}"'],
                  ["The warning and the window close.", 'Staff member A\'s row shows "No" in the Technician column.'],
                  ["Staff member A is still the lead of work order 1."],
                  ["Line 1 still shows staff member A's labor entry, unchanged."]],
  ["S2-R4", "S2-R5", "S1-R6", "KD-WARN", "S2-R3 1/1"], note=NAME_NOTE)
C("S2-33", S, "Save in the warning saves everything the window showed",
  [ADMIN, A_TECH1, wo(1, "In Progress", "staff member A", extra=", with no line that staff member A is on, so the warning has a led work order to count"),
   "Choose a new phone number for staff member A.", LIST],
  [EDIT_A, "Replace the phone number with the new phone number.", "Switch Technician off.", SAVE, "Click Save in the warning.", EDIT_A],
  [["The Edit Staff Member window opens with Technician on."], ["The phone field shows the new phone number."], ["Technician is off."], [WT],
   ["The warning and the window close."], ["The phone field shows the new phone number.", "Technician is off."]],
  ["S2-R4"])

# ---- loading state (held: the counts load too fast to act on) ---------------------------------------------------------------------
LOAD_HOLD = HOLD("the counts usually load faster than a person can see or click the loading Save button")
C("S2-34", S, "Save & Close shows its loading state while the counts load",
  [ADMIN, A_TECH1, wo(1, "In Progress", "staff member A", why=", so the warning has a led work order to count"), LIST],
  TURN_OFF + ["Click Save & Close again while it shows its loading state."],
  TURN_OFF_RES + [["The Save & Close button shows its loading state until the warning shows."],
                  ["Nothing happens: the second click is not accepted.", "The warning shows once."]],
  ["S2-R4"], marker=LOAD_HOLD)
C("S2-35", S, "Closing the staff window while the counts load cancels the save",
  [ADMIN, A_TECH1, wo(1, "In Progress", "staff member A", why=", so the warning has a led work order to count"), LIST],
  TURN_OFF + ["Close the Edit Staff Member window with its X while Save & Close shows its loading state.", EDIT_A],
  TURN_OFF_RES + [["The Save & Close button shows its loading state."], ["The window closes and no warning shows."],
                  ["Technician is on: nothing was saved."]],
  ["S2-R4"], marker=LOAD_HOLD)
C("S2-36", S, "When the counts fail, the save goes ahead without the warning",
  [ADMIN, A_TECH1, wo(1, "In Progress", "staff member A", why=", so the warning has a led work order to count"), LIST],
  TURN_OFF,
  TURN_OFF_RES + [["The open-work counts fail to come back.", "No warning window shows.", "The save goes ahead and the window closes.",
                   "Any error message is the app's existing request error, with no new message.", 'Staff member A\'s row shows "No" in the Technician column.']],
  ["EH-S2"], marker=HOLD("a manual tester cannot make only the open-work count request fail while the save still works"))

# ---- no warning when Technician is not turned off ------------------------------------------------------------------------------
C("S2-37", S, "Saving a staff member whose Technician was already off shows no warning",
  [ADMIN, staff(tech=False, role="the built-in Parts Manager role"), wo(1, "In Progress", "staff member A", extra=", so staff member A holds open work"),
   "Choose a new phone number for staff member A.", LIST],
  [EDIT_A, "Replace the phone number with the new phone number.", SAVE],
  [["The window shows Technician off."], ["The phone field shows the new phone number."],
   ["No warning window shows.", "The window closes and the new phone number is saved."]],
  ["S2-N2"])
C("S2-38", S, "Saving a technician who stays on shows no warning",
  [ADMIN, A_TECH1, wo(1, "In Progress", "staff member A", extra=", so staff member A holds open work"), "Choose a new phone number for staff member A.", LIST],
  [EDIT_A, "Replace the phone number with the new phone number.", SAVE],
  [["The Edit Staff Member window opens with Technician on."], ["The phone field shows the new phone number."],
   ["No warning window shows.", "The window closes.", 'Staff member A\'s row still shows "Yes" in the Technician column.']],
  ["S2-N2", "S1-R7"])

# ---- Sales Representative removal warning together with the Turn Off Technician warning -------------------------------------------
SR_A = staff(extra=", with Sales Representative on, who holds nothing except the work named below")
C("S2-39", S, "Sales Representative warns at the switch and Technician warns on Save",
  [ADMIN, SR_A, wo(1, "In Progress", "staff member A", extra=", with no line that staff member A is on, so the warning has a led work order to count"), LIST],
  [EDIT_A, "Switch Sales Representative off.", "Confirm the Sales Representative removal warning.", "Switch Technician off.", SAVE],
  [["The Edit Staff Member window opens with Sales Representative on and Technician on."],
   ["The existing Sales Representative removal warning shows at once, as today.", 'No "Turn Off Technician" warning shows yet.'],
   ["The removal warning closes and Sales Representative is off."], ["Technician is off and no warning shows yet."],
   [WT, f'Its text reads "{T10}"']],
  ["S2-E3", "S2-R2"], note=NAME_NOTE)
C("S2-40", S, "Cancelling Turn Off Technician also cancels a confirmed Sales Rep removal",
  [ADMIN, SR_A, wo(1, "In Progress", "staff member A", extra=", with no line that staff member A is on, so the warning has a led work order to count"), LIST],
  [EDIT_A, "Switch Sales Representative off.", "Confirm the Sales Representative removal warning.", "Switch Technician off.", SAVE,
   "Click Cancel in the warning.", "Close the Edit Staff Member window with its X.", EDIT_A],
  [["The Edit Staff Member window opens with Sales Representative on and Technician on."], ["The Sales Representative removal warning shows."],
   ["Sales Representative is off."], ["Technician is off."], [WT],
   ["The warning closes.", "The Edit Staff Member window is still open with Sales Representative off and Technician off, as you left them."],
   ["The window closes."], ["Sales Representative is on and Technician is on: nothing was saved, including the Sales Representative removal."]],
  ["S2-E3", "S2-R4"])
C("S2-41", S, "Keeping Sales Rep and confirming Turn Off Technician saves only Technician off",
  [ADMIN, SR_A, wo(1, "In Progress", "staff member A", extra=", with no line that staff member A is on, so the warning has a led work order to count"), LIST],
  [EDIT_A, "Switch Sales Representative off.", "Cancel the Sales Representative removal warning.", "Switch Technician off.", SAVE,
   "Click Save in the warning.", EDIT_A],
  [["The Edit Staff Member window opens with Sales Representative on and Technician on."], ["The Sales Representative removal warning shows."],
   ["The removal warning closes and Sales Representative is on again."], ["Technician is off."], [WT],
   ["The warning and the window close."], ["Sales Representative is on and Technician is off."]],
  ["S2-E3"])
