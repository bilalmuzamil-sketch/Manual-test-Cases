"""Story 6 — Release day (SV-11884). Credit terms precedent (build/credit-terms/authoring/cases_s11.py; QA lead 26 Oct 2026: "This you
can take from production environment if you need the BEFORE screenshots"): each case's "before" state is set up and written down on
production shortly before the release reaches it, and the case is run there after the release. One case per S6 condition."""
from tt_lib import C, PRE_REL
from common import *

S = "S6"
PROD = "Sign in to production (the live app, app.shopview.com) as an Admin of the production test account, at its test location, Trucks Hill 2."
def before(state):
    return (f"Shortly before the release reached production, have a new staff member for this test on production, staff member A, {state} "
            "(written down with a screenshot of the staff record).")
BASE = "active, on the built-in Parts Manager role, with Time Clock on, Billable set to No, enrolled at Trucks Hill 2"
B_TECH = ("Shortly before the release reached production, have a new technician for this test on production, staff member B (Technician role, "
          "Time Clock on, enrolled at Trucks Hill 2), so a lead and a line can belong to someone else.")


def rel(key, title, state, on, q, extra_pre=(), board=True):
    yn = "Yes" if on else "No"
    st = ["Open Settings, Staff.", EDIT_A]
    rs = [[f'Staff member A\'s row shows "{yn}" in the Technician column.'],
          [f"Technician is {'on' if on else 'off'}."]]
    if board:
        st += ["Open Work Orders, Board View, at Trucks Hill 2."]
        rs += [["Staff member A has a column." if on else "Staff member A has no column."]]
    C(key, S, title, [PROD, before(state)] + list(extra_pre), st, rs, q, marker=PRE_REL)


# ---- (a) time entries ---------------------------------------------------------------------------------------------------------
rel("S6-01", "Time on a work order in the last 90 days turns Technician on",
    BASE + ", whose only work is one time entry on a work order that started 30 days before the release", True,
    ["S6-R1", "S6-R1 a", "KD-REL", "GOAL-2", "GOAL-3"])
rel("S6-02", "Time on a work order older than 90 days does not turn Technician on",
    BASE + ", whose only work is one time entry on a work order that started 120 days before the release, on a work order now Complete", False,
    ["S6-R1 a", "S6-R2"])
rel("S6-03", "Time on a part sale in the last 90 days turns Technician on",
    BASE + ", whose only work is one time entry on a part sale that started 30 days before the release", True, ["S6-R1 a"])
rel("S6-04", "A manual time entry made by someone else turns Technician on",
    BASE + ", whose only work is one time entry on a work order, dated 30 days before the release, that another user entered for them by hand on the time sheet", True,
    ["S6-R1 a"])
rel("S6-05", "Time on a department only does not turn Technician on",
    BASE + ", whose only time in the last 90 days is time clocked on a department (not on a work order or part sale)", False, ["S6-R1 a", "S6-R2"])
rel("S6-06", "A time entry dated after the release moment also counts",
    BASE + ", whose only work is one manual time entry on a work order dated one day after the release date", True, ["S6-R1 a"])
# ---- (b) open work --------------------------------------------------------------------------------------------------------------
for k, st in (("S6-07", "Approved"), ("S6-08", "In Progress"), ("S6-09", "Ready for Review")):
    rel(k, f"Leading a service work order in {st} turns Technician on",
        BASE + f", whose only work is leading one service work order in {st}, with no time recorded on it", True, ["S6-R1 b"])
rel("S6-10", "Labor on an open line of someone else's work order turns Technician on",
    BASE + ", whose only work is a labor entry, with no time recorded, on a line that is not declined of an Approved service work order led by staff member B", True,
    ["S6-R1 b"], extra_pre=[B_TECH])
rel("S6-11", "Being added with Add Technician to an open line turns Technician on",
    BASE + ", whose only work is being added with Add Technician to a line that is not declined of an Approved service work order led by staff member B", True,
    ["S6-R1 b"], extra_pre=[B_TECH])
rel("S6-12", "Being a line's own technician on an open line turns Technician on",
    BASE + ", whose only work is being the own technician of a line that is not declined of an Approved service work order led by staff member B", True,
    ["S6-R1 b"], extra_pre=[B_TECH])
rel("S6-13", "Being on an open line through a schedule shift turns Technician on",
    BASE + ", whose only work is being added through a shift on the Schedule to a line that is not declined of an Approved service work order led by staff member B", True,
    ["S6-R1 b", "S6-R1"], extra_pre=[B_TECH])
rel("S6-14", "Leading only an Estimate does not turn Technician on",
    BASE + ", whose only work is leading one service work order in Estimate, with no time recorded on it", False, ["S6-E2", "S6-R1 b", "T-OPEN"])
rel("S6-15", "Leading only a declined work order does not turn Technician on",
    BASE + ", whose only work is leading one declined service work order, with no time recorded on it", False, ["S6-E2"])
rel("S6-16", "Being only on a declined line does not turn Technician on",
    BASE + ", whose only work is being added with Add Technician to a declined line of an Approved service work order led by staff member B", False,
    ["S6-E2"], extra_pre=[B_TECH])
rel("S6-17", "Being only on a part sale does not turn Technician on",
    BASE + ", whose only work is an open part sale they created, with no time recorded on it", False, ["S6-E2"])
rel("S6-18", "Leading only a Complete work order does not turn Technician on",
    BASE + ", whose only work is leading one Complete service work order, with no time recorded on it in the last 90 days", False, ["S6-R1 b", "S6-R2"])
# ---- (c) Billable, and the people who are never turned on -----------------------------------------------------------------------
rel("S6-19", "Billable on turns Technician on even with no work",
    "active, on the built-in Parts Manager role, with Time Clock on, Billable set to Yes, enrolled at Trucks Hill 2, with no work at all", True,
    ["S6-R1 c", "KD-BILL"])
rel("S6-20", "Someone on the Office User role is never turned on, even if billable",
    "active, on the built-in Office User role, with Time Clock on, Billable set to Yes, enrolled at Trucks Hill 2, with one time entry on a work order 30 days before the release",
    False, ["S6-R1"])
C("S6-21", S, "A staff member with no role is never turned on",
  ["Sign in to a Public API sandbox organization on production as its Admin.",
   "Shortly before the release reached production, have a staff member in that sandbox, staff member A, with no role, active, with Time Clock on and Billable set to Yes (written down with a screenshot)."],
  ["Open Settings, Staff.", EDIT_A],
  [['Staff member A\'s row shows "No" in the Technician column.'], ["Technician is off."]],
  ["S6-N2"], marker=PRE_REL)
C("S6-22", S, "Someone deactivated on release day stays off after reactivation",
  [PROD, before("on the built-in Technician role, with Time Clock on, Billable set to Yes, enrolled at Trucks Hill 2, and deactivated with Deactivate Account")],
  ["Open Settings, Staff.", 'Click the "Deactivated" tab.', "Click Reactivate for staff member A.", EDIT_A, "Open Work Orders, Board View, at Trucks Hill 2."],
  [["The staff list shows."], ['Staff member A\'s row shows "No" in the Technician column.'], ['Staff member A is on the Active tab and their row shows "No".'],
   ["Technician is off."], ["Staff member A has no column: they are not offered until Technician is turned on for them."]],
  ["S6-E3", "S6-R1"], marker=PRE_REL)
C("S6-23", S, "Time Clock off on release day stays off when Time Clock is turned on later",
  [PROD, before("active, on the built-in Technician role, with Time Clock off, Billable set to Yes, enrolled at Trucks Hill 2")],
  ["Open Settings, Staff.", EDIT_A, "Switch Time Clock on.", SAVE],
  [['Staff member A\'s row shows "No" in the Technician column.'], ["Time Clock is off and Technician is off."], ["Time Clock is on and Technician stays off."],
   ["The window closes.", 'Staff member A\'s row still shows "No" in the Technician column.']],
  ["S6-E3", "S1-R5"], marker=PRE_REL)
C("S6-24", S, "A Parts Manager with no evidence starts off and leaves the board",
  [PROD, before(BASE + ", with no work at all, and with a column on Board View at Trucks Hill 2 before the release (screenshot)")],
  ["Open Settings, Staff.", EDIT_A, "Open Work Orders, Board View, at Trucks Hill 2.", "Open the Technician filter."],
  [['Staff member A\'s row shows "No" in the Technician column.'], ["Technician is off.", "Time Clock is still on."],
   ["Staff member A no longer has a column.", "The technicians who had a column before the release still have one."], ["Staff member A is not offered."]],
  ["S6-N1", "S6-R2", "GOAL-1"], marker=PRE_REL)
C("S6-25", S, "Nothing else on a staff record changes at release",
  [PROD, before("active, on the built-in Parts Manager role, with Time Clock on, Billable set to Yes and Sales Representative on, enrolled at Trucks Hill 2"),
   "Shortly before the release reached production, have a second new staff member for this test on production, staff member B, on the built-in Service Advisor role, with Time Clock on, Billable set to No and Sales Representative off, with no work (written down with a screenshot), so one record left off is compared too."],
  [EDIT_A, "Close the Edit Staff Member window.", "Open staff member B's Edit Staff Member window."],
  [["Technician is on.", "Time Clock, Billable (Yes), Sales Representative (on) and the role (Parts Manager) are exactly as written down."],
   ["The window closes."],
   ["Technician is off.", "Time Clock, Billable (No), Sales Representative (off) and the role (Service Advisor) are exactly as written down."]],
  ["S6-R3", "S6-R1 c", "S1-R9"], marker=PRE_REL)
C("S6-26", S, "Nobody is logged out by the release and no message shows",
  [PROD, before("active, on the built-in Technician role, with Time Clock on, Billable set to Yes, enrolled at Trucks Hill 2, who can sign in"),
   "Have staff member A signed in on production in a second browser while the release reaches production, with any page open."],
  ["In the second browser, click Work Orders in the menu."],
  [["Work Orders opens: staff member A is still signed in.", "No message about the release step shows."]],
  ["S6-R4", "GOAL-4", "EH-S6"], marker=PRE_REL)
C("S6-27", S, "Open work is untouched for someone who starts off",
  [PROD, B_TECH,
   before(BASE + ", leading one service work order in Estimate, work order 1, and added with Add Technician to line 1 of an Estimate service work order led by staff member B, work order 2, with no time recorded")],
  [EDIT_A, "Close the Edit Staff Member window.", "Open work order 1.", "Open the Lead Technician dropdown.", "Open work order 2."],
  [["Technician is off."], ["The window closes."], ["Work order 1 still shows staff member A as its lead."],
   ["Staff member A is listed last, grayed out, with the check mark."], ["Staff member A is still on line 1."]],
  ["S6-R5", "S6-E1", "S3-R7", "S3-R8"], marker=PRE_REL)
C("S6-28", S, "The release step runs once: a later choice to turn off sticks",
  [PROD, before("active, on the built-in Parts Manager role, with Time Clock on, Billable set to Yes, enrolled at Trucks Hill 2"),
   "After the release, have staff member A's Technician switched off and saved, and a later production release deployed since."],
  ["Open Settings, Staff.", EDIT_A],
  [['Staff member A\'s row still shows "No" in the Technician column.'], ["Technician is still off."]],
  ["S6-E4"], marker=PRE_REL)
