"""Section "What must not change" (Rule 96, skill 17): every "as today" / "exactly as today" / "unchanged" sentence of PRD v17 and every
Out of Scope item a tester can see. Each case uses a person who is NOT a technician (Technician off, Time Clock on), so the case proves the
non-technician lists and behaviours did not narrow, with a technician as the control where a list is checked."""
from tt_lib import C, HOLD, A
from common import *

S = "INV"
A_OFF = staff(tech=False, role="the built-in Parts Manager role")
A_TIME = staff(tech=False, role="the built-in Parts Manager role", extra=", with time recorded on an approved line of a work order in the last 7 days")
OFFICE = ("Have a new staff member for this test, staff member C, on the built-in Office User role, with Time Clock on, enrolled at the test location, "
          "so the list's existing Office User rule is checked too.")

C("INV-01", S, "Time sheets still list a non-technician with Time Clock on",
  [ADMIN, A_OFF, OFFICE, wo(1, "Approved", "nobody (no lead)")],
  ["Open work order 1.", "Open the Time Sheets tab.", "Open the technician filter on the Time Sheets tab."],
  [["Work order 1 opens."], ["The Time Sheets tab shows."], ["Staff member A is listed, as today.", "Staff member C is not listed, as today."]],
  ["S3-R9", "OOS-2", "KD-LISTS"])
C("INV-02", S, "The time sheet dialog still offers a non-technician",
  [ADMIN, A_OFF, wo(1, "Approved", "nobody (no lead)", extra=", with one approved line, line 1", why=", so the work order has a line to record time on")],
  ["Open work order 1.", "Open the Time Sheets tab.", "Open the dialog that adds a time entry.", "Open the dialog's technician list."],
  [["Work order 1 opens."], ["The Time Sheets tab shows."], ["The dialog opens."], ["Staff member A is offered, as today."]],
  ["S3-R9", "OOS-2"])
C("INV-03", S, "Punch Clock Activities still lists a non-technician",
  [ADMIN, A_TIME, OFFICE],
  ["Open Reports, Punch Clock Activities.", "Open the report's technician filter."],
  [["The report opens and shows staff member A's recorded time."], ["Staff member A is listed, as today.", "Staff member C is not listed, as today."]],
  ["S3-R9", "OOS-2"])
C("INV-04", S, "The Technician Efficiency report still lists a non-technician",
  [ADMIN, A_TIME],
  ["Open Reports, Technician Efficiency.", "Set the report's dates to cover the last 7 days."],
  [["The report opens."], ["Staff member A is listed with their recorded time, as today."]],
  ["S3-R9", "OOS-3"])
C("INV-05", S, "The Technician Utilization report still lists a non-technician",
  [ADMIN, A_TIME],
  ["Open Reports, Technician Utilization.", "Set the report's dates to cover the last 7 days."],
  [["The report opens."], ["Staff member A is listed with their recorded time, as today."]],
  ["S3-R9", "OOS-3", "OOS-1"])
C("INV-06", S, "Schedule lanes still follow departments, not the Technician toggle",
  [ADMIN, "Have a department for this test, department 1, at the test location.",
   staff(tech=False, role="the built-in Parts Manager role", extra=", in department 1")],
  ["Open the Schedule.", "Show department 1's lanes."],
  [["The Schedule opens."], ["Staff member A has a lane in department 1, as today, although their Technician toggle is off."]],
  ["S3-R9", "OOS-4"])
C("INV-07", S, "A non-technician can still press Start on an approved line and record time",
  [ADMIN, staff(tech=False, role="the built-in Parts Manager role", extra=", who can sign in"),
   wo(1, "Approved", "nobody (no lead)", extra=", with one approved line, line 1, that staff member A is not on")],
  ["Sign out.", "Sign in as staff member A.", "Open work order 1.", "Press Start on line 1.", "Press Stop on line 1."],
  [["You are signed out."], ["Staff member A is signed in."], ["Work order 1 opens."], ["The timer starts on line 1, as today."],
   ["The time is recorded.", "Staff member A is added to line 1's labor, as today."]],
  ["S3-E3", "OOS-2", "KD-OFFER"])
C("INV-08", S, "A non-technician can still be a sales representative",
  [ADMIN, staff(tech=False, role="the built-in Parts Manager role", extra=", with Sales Representative on"),
   "Have a new service work order for this test, work order 1, at the test location."],
  ["Open work order 1.", "Open the Sales Representative dropdown.", "Pick staff member A."],
  [["Work order 1 opens."], ["Staff member A is offered, as today."], ["Work order 1 shows staff member A as its Sales Representative."]],
  ["S1-R9", "OOS-1"])
C("INV-09", S, "A non-technician can still be billable",
  [ADMIN, A_OFF.replace(".", ", with Billable set to No."), LIST],
  [EDIT_A, "In Billable, pick Yes.", SAVE],
  [["Billable is not grayed out."], ["Billable shows Yes and Technician stays off."], ["The window closes.", 'Staff member A\'s row shows "Yes" in the Billable column and "No" in the Technician column.']],
  ["OOS-1", "S1-R9", "KD-BILL"])
C("INV-10", S, "Part sales show no technician dropdown",
  [ADMIN, "Have a new part sale for this test, part sale 1, at the test location."],
  ["Open part sale 1."],
  [["Part sale 1 opens.", "It shows no technician dropdown, as today."]],
  ["S3-R6a"])
C("INV-11", S, "A Technician-only change does not log the staff member out",
  [ADMIN, staff(role="the built-in Parts Manager role", extra=", leading no work, who can sign in"),
   "Have staff member A signed in in a second browser, on any page.", LIST],
  [EDIT_A, "Switch Technician off.", SAVE, "In the second browser, click Work Orders in the menu."],
  [["The window shows Technician on."], ["Technician is off."], ["The window closes."], ["Work Orders opens: staff member A is still signed in."]],
  ["S1-R8", "KD-LOGOUT", "GOAL-4"])
C("INV-12", S, "A save that also changes Time Clock still logs the staff member out",
  [ADMIN, staff(role="the built-in Parts Manager role", extra=", leading no work, who can sign in"),
   "Have staff member A signed in in a second browser, on any page.", LIST],
  [EDIT_A, "Switch Time Clock off.", SAVE, "In the second browser, click Work Orders in the menu."],
  [["The window shows Time Clock on and Technician on."], ["Technician switches off too."], ["The window closes."],
   ["Staff member A is signed out, as a Time Clock change does today."]],
  ["S1-R8"])
C("INV-13", S, "A save that changes Technician and the role logs out as a role change does",
  [ADMIN, staff(role="the built-in Parts Manager role", extra=", leading no work, who can sign in"),
   "Have staff member A signed in in a second browser, on any page.", LIST],
  [EDIT_A, "Switch Technician off.", 'In Role, pick "Service Advisor".', SAVE, "In the second browser, click Work Orders in the menu."],
  [["The window shows Technician on."], ["Technician is off."], ["Role shows Service Advisor and Technician stays off."], ["The window closes."],
   ["Staff member A is signed out, as a role change does today."]],
  ["S1-R8", "KD-LOGOUT", A(2)])   # round 3: released, Chris answered question 2 (a); PRD v18 S1-R8 names the role
C("INV-14", S, 'The role setting "View mode: Tech view" still works as before',
  [ADMIN, "Have a custom role made for this test, role A, with \"View mode: Tech view\" set in Roles & Permissions, so staff member A gets the simplified interface.",
   staff(tech=False, role="role A", extra=", who can sign in")],
  ["Sign out.", "Sign in as staff member A."],
  [["You are signed out."], ["Staff member A sees the simplified Tech view interface, as before, although their Technician toggle is off."]],
  ["T-TECHVIEW"])
C("INV-15", S, "Roles & Permissions has no new Technician permission",
  [ADMIN, "Start on Settings, Roles & Permissions."],
  ["Open the Edit page of the built-in Parts Manager role."],
  [["The page lists the same permissions as before, including 'Settings → App Settings'.", "There is no Technician permission, setting or card on the role."]],
  ["PERM-NONEW", "KD-TOGGLE", "PERM-GOV"])
C("INV-16", S, "Turning Technician on grants no access",
  [ADMIN, "Have a custom role made for this test, role A, with no access to Work Orders, so staff member A has no Work Orders access before or after.",
   staff(role="role A", extra=", who can sign in")],
  ["Sign out.", "Sign in as staff member A.", "Type the Work Orders address in the browser's address bar."],
  [["You are signed out."], ["Staff member A is signed in.", "The menu offers no Work Orders, as before."],
   ["Work Orders does not open for staff member A, as before: Technician gave no access."]],
  ["PERM-NOACCESS", "OOS-5"])
C("INV-17", S, "The staff list has no bulk edit or filter by Technician",
  [ADMIN, LIST],
  ["Open the staff list's filters.", "Tick two staff rows, if the list has row ticks."],
  [["No filter for Technician is offered.", "The filters are the same as before."],
   ["No action offers to change Technician for the ticked rows (if the list has no row ticks, there is no bulk action at all)."]],
  ["OOS-6"])
C("INV-18", S, "The Sales Representative removal warning still shows when switched off",
  [ADMIN, staff(tech=False, role="the built-in Parts Manager role", extra=", with Sales Representative on"), LIST],
  [EDIT_A, "Switch Sales Representative off."],
  [["The window shows Sales Representative on."], ["The existing Sales Representative removal warning shows at once, as today."]],
  ["S2-E3", "OOS-1"])
C("INV-19", S, "Reports list the same people whatever the Technician toggle",
  [ADMIN, staff(role="the built-in Parts Manager role", extra=", with time recorded on an approved line of a work order in the last 7 days, leading no work")],
  ["Open Reports, Technician Utilization.", "Set the report's dates to cover the last 7 days.", "Open Settings, Staff in a second tab.", EDIT_A,
   "Switch Technician off.", SAVE, "Switch to the report tab.", "Reload the report."],
  [["The report opens."], ["Staff member A is listed with their time."], ["The staff list shows."], ["The window shows Technician on."], ["Technician is off."],
   ["The window closes."], ["The report shows."], ["Staff member A is still listed with the same time."]],
  ["OOS-3", "S3-R9"])
