"""Story 1 — Technician toggle on a staff member (SV-11879): layout, "New" pill, New Staff Member pre-fill from the role, Time Clock and
role rules, Edit Staff Member, save rules, Billable and Sales Representative, deactivation, permissions."""
from tt_lib import C, HOLD
from common import *

S = "S1"
TC_ON = "If Time Clock is off, switch it on."
TC_OFF = "If Time Clock is on, switch it off."
TC_ON_RES = "Time Clock is on."
PILL_DAY = ('Know the end date of the "New" pill for the build under test: 07:00 UTC on the seventh day after the release that ships '
            'Technician Toggle (until that release is scheduled, the build carries 31 Dec 2026, 07:00 UTC).')

C("S1-01", S, "New Staff Member shows Technician last in its own toggle row",
  [ADMIN, LIST],
  [NEWWIN],
  [["The New Staff Member window opens.",
    "Below the Billable field there is a row holding only three toggles, in this order: Time Clock, Sales Representative, Technician.",
    'The toggle labeled "Technician" is directly to the right of Sales Representative and is the last toggle in that row.',
    "The Technician toggle is the same kind of switch as Time Clock and Sales Representative (same size, shape and colours)."]],
  ["S1-R1", "KD-TOGGLE"])

C("S1-02", S, "Edit Staff Member shows the same toggle row as New Staff Member",
  [ADMIN, "Have any active staff member, staff member A.", LIST],
  [EDIT_A],
  [["The Edit Staff Member window opens.",
    "Below the Billable field there is a row holding only three toggles, in this order: Time Clock, Sales Representative, Technician.",
    "The row is in the same place and order as in the New Staff Member window.",
    'The "Technician" label carries a "New" pill at its top right.']],
  ["S1-R1", "S1-R2"])

C("S1-03", S, 'The "New" pill on Technician matches the Work Orders display switcher pill',
  [ADMIN, 'Make sure the date on your computer is before the end date of the "New" pill (07:00 UTC on the seventh day after the release that ships Technician Toggle).',
   'Have the Work Orders page open in a second browser tab, showing its display switcher with its "New" pill.', LIST],
  [NEWWIN, "Switch to the Work Orders browser tab."],
  [['A "New" pill sits at the top right of the "Technician" label, touching the end of the word.'],
   ['The "New" pill on the Work Orders display switcher has the same text, colour, shape and size as the pill on the Technician label.']],
  ["S1-R2"])

C("S1-04", S, 'The "New" pill disappears at its end date in a window that is already open',
  [ADMIN, PILL_DAY, "Set your computer's clock to two minutes before that end date.", LIST],
  [NEWWIN, "Wait until your computer's clock passes the end date.", "Close the New Staff Member window.", NEWWIN],
  [['The "Technician" label carries the "New" pill.'],
   ['The "New" pill disappears from the open window without a page reload.', 'The "Technician" label and toggle stay.'],
   ["The window closes."],
   ['The "Technician" label shows no "New" pill.']],
  ["S1-R2", "S4-N2", ("Jira SV-12008", "Today the build carries a placeholder: 31 Dec 2026, 07:00 UTC.")])

C("S1-05", S, 'On the release build the "New" pill ends on the seventh day after release',
  [ADMIN, "Use the release build of the release that ships Technician Toggle, and know its scheduled release date.",
   "Set your computer's clock to 06:58 UTC on the seventh day after that release date.", LIST],
  [NEWWIN, "Set your computer's clock to 07:01 UTC on the same day.", "Close the New Staff Member window.", NEWWIN],
  [['The "Technician" label carries the "New" pill.'],
   ['The "New" pill is gone from the open window.'],
   ["The window closes."],
   ['The "Technician" label shows no "New" pill (if it still shows, the build still carries the 31 Dec 2026 placeholder date).']],
  ["S1-R2", ("Jira SV-12008", "When the release that ships Technician Toggle is scheduled, set the end date of its \"New\" pills (on the Technician toggle in the New and Edit Staff Member windows, and on the staff list's Technician column header) and of the staff list notice to 07:00 UTC on the seventh day after the release date."),
   ("Jira SV-12008", "On the release build before that moment, the pills and the notice show; from that moment on they are gone, including in a page that is already open.")],
  marker=HOLD("the end date is set only when the release is scheduled; run on the release build before release day"))

# ---- New Staff Member pre-fill (S1-R3, S1-R5, S1-N1) ---------------------------------------------------------------------------
def prefill_on(key, role, first_tc):
    if first_tc:
        steps = [NEWWIN, TC_ON, f'In Role, pick "{role}".']
        res = [["The New Staff Member window opens."], [TC_ON_RES],
               [f"Role shows {role}.", "Technician switches on by itself, without being switched by hand.", "Technician is not grayed out."]]
    else:
        steps = [NEWWIN, f'In Role, pick "{role}".', TC_ON]
        res = [["The New Staff Member window opens."], [f"Role shows {role}."],
               [TC_ON_RES, "Technician switches on by itself, without being switched by hand.", "Technician is not grayed out."]]
    C(key, S, f"New Staff Member pre-fills Technician on for the {role} role",
      [ADMIN, LIST], steps, res, ["S1-R3", "KD-NEW", "GOAL-3"])

prefill_on("S1-06", "Technician", True)
prefill_on("S1-07", "Foreman", False)


def prefill_off(key, role, label, pre=None, q=("S1-R3",)):
    C(key, S, f"New Staff Member pre-fills Technician off for {label}",
      [ADMIN] + (pre or []) + [LIST],
      [NEWWIN, TC_ON, f'In Role, pick "{role}".', 'In Role, pick "Technician".'],
      [["The New Staff Member window opens."], [TC_ON_RES],
       [f"Role shows {role}.", "Technician is off.", "Technician is not grayed out (it can still be switched by hand)."],
       ["Technician switches on by itself, which shows the pre-fill is running in this window."]],
      list(q))

prefill_off("S1-08", "Parts Technician", "the Parts Technician role", q=("S1-R3", "KD-NEW", "S1-N1"))
prefill_off("S1-09", "Parts Manager", "the Parts Manager role", q=("S1-R3", "KD-NEW", "GOAL-3"))
C("S1-10", S, "New Staff Member pre-fills off for a custom role made from Technician",
  [ADMIN, "Have a custom role made for this test from the Technician template, role A (Settings, Roles & Permissions, Create custom role).", LIST],
  [NEWWIN, TC_ON, "In Role, pick role A.", 'In Role, pick "Technician".'],
  [["The New Staff Member window opens."], [TC_ON_RES],
   ["Role shows role A.", "Technician is off.", "Technician is not grayed out (it can still be switched by hand)."],
   ["Technician switches on by itself, which shows the pre-fill is running in this window."]],
  ["S1-R3", "S1-N1"])
C("S1-11", S, "New Staff Member pre-fills off for a custom role made from Foreman",
  [ADMIN, "Have a custom role made for this test from the Foreman template, role A (Settings, Roles & Permissions, Create custom role).", LIST],
  [NEWWIN, TC_ON, "In Role, pick role A.", 'In Role, pick "Foreman".'],
  [["The New Staff Member window opens."], [TC_ON_RES],
   ["Role shows role A.", "Technician is off.", "Technician is not grayed out (it can still be switched by hand)."],
   ["Technician switches on by itself, which shows the pre-fill is running in this window."]],
  ["S1-R3"])


def role_gray(key, role):
    C(key, S, f"The {role} role grays out Technician with the role tooltip",
      [ADMIN, LIST],
      [NEWWIN, TC_ON, f'In Role, pick "{role}".', "Hover the Technician toggle."],
      [["The New Staff Member window opens."], [TC_ON_RES],
       [f"Role shows {role}.", "Technician is off and grayed out.", "Clicking the Technician toggle does not switch it on."],
       [f'A tooltip shows "{TIP_ROLE}"']],
      ["S1-N1", "UFS-3", "S3-N2"])

role_gray("S1-12", "Office User")
role_gray("S1-13", "Time Clock User")

C("S1-14", S, "With Time Clock off, Technician is grayed out with the Time Clock tooltip",
  [ADMIN, LIST],
  [NEWWIN, 'In Role, pick "Technician".', TC_OFF, "Hover the Technician toggle."],
  [["The New Staff Member window opens."], ["Role shows Technician."],
   ["Time Clock is off.", "Technician is off and grayed out.", "Clicking the Technician toggle does not switch it on."],
   [f'A tooltip shows "{TIP_TC}"']],
  ["S1-R4", "UFS-2", "KD-TWO", "EH-S1"])   # round 2: the Time-Clock-back-on step moved out (it depends on PO question 5; S1-16 holds it)

C("S1-15", S, "New Staff Member sets Technician again each time the role changes",
  [ADMIN, LIST],
  [NEWWIN, TC_ON, 'In Role, pick "Technician".', 'In Role, pick "Parts Manager".', 'In Role, pick "Foreman".', 'In Role, pick "Service Advisor".'],
  [["The New Staff Member window opens."], [TC_ON_RES], ["Technician switches on by itself."], ["Technician switches off by itself."],
   ["Technician switches on by itself."], ["Technician switches off by itself."]],
  ["S1-R3"])

C("S1-16", S, "New Staff Member sets Technician again when Time Clock changes",
  [ADMIN, LIST],
  [NEWWIN, 'In Role, pick "Technician".', TC_ON, "Switch Time Clock off.", "Switch Time Clock on."],
  [["The New Staff Member window opens."], ["Role shows Technician."], [TC_ON_RES, "Technician is on."],
   ["Technician switches off and is grayed out."], ["Technician switches on again by itself."]],
  ["S1-R3", "S1-R4", "S1-R5"], marker="PO:tt-d01")   # round 2: the design's page 3 note says it stays off (TT-D01)

C("S1-17", S, "After a hand switch off, role and Time Clock no longer turn Technician on",
  [ADMIN, LIST],
  [NEWWIN, TC_ON, 'In Role, pick "Technician".', "Switch Technician off.", 'In Role, pick "Foreman".', "Switch Time Clock off.", "Switch Time Clock on."],
  [["The New Staff Member window opens."], [TC_ON_RES], ["Technician switches on by itself."], ["Technician is off."],
   ["Role shows Foreman.", "Technician stays off."], ["Technician is off and grayed out."], ["Time Clock is on.", "Technician stays off and can be switched on by hand."]],
  ["S1-R3", "S1-R5"])

C("S1-18", S, "After Technician is switched on by hand, a role change keeps it on",
  [ADMIN, LIST],
  [NEWWIN, TC_ON, 'In Role, pick "Parts Manager".', "Switch Technician on.", 'In Role, pick "Parts Technician".', 'In Role, pick "Service Advisor".'],
  [["The New Staff Member window opens."], [TC_ON_RES], ["Technician is off."], ["Technician is on."],
   ["Role shows Parts Technician.", "Technician stays on."], ["Role shows Service Advisor.", "Technician stays on."]],
  ["S1-R3"])

C("S1-19", S, "After a hand switch, Time Clock off still turns Technician off for good",
  [ADMIN, LIST],
  [NEWWIN, TC_ON, 'In Role, pick "Parts Manager".', "Switch Technician on.", "Switch Time Clock off.", "Switch Time Clock on."],
  [["The New Staff Member window opens."], [TC_ON_RES], ["Technician is off."], ["Technician is on."],
   ["Technician switches off and is grayed out."], ["Time Clock is on.", "Technician stays off.", "Technician is not grayed out and can be switched on by hand."]],
  ["S1-R3", "S1-R4"])

C("S1-20", S, "After a hand switch, picking Office User still turns Technician off for good",
  [ADMIN, LIST],
  [NEWWIN, TC_ON, 'In Role, pick "Parts Manager".', "Switch Technician on.", 'In Role, pick "Office User".', 'In Role, pick "Parts Manager".'],
  [["The New Staff Member window opens."], [TC_ON_RES], ["Technician is off."], ["Technician is on."],
   ["Technician switches off and is grayed out."], ["Role shows Parts Manager.", "Technician stays off.", "Technician is not grayed out and can be switched on by hand."]],
  ["S1-R3", "S1-N1"])

NEW_FIELDS = ["Type a first name in the first name field.", "Type a last name in the last name field.",
              "Type an email address that no other staff member uses in the email field.",
              "Fill in any other field the window marks as required."]
NEW_FIELDS_RES = [["The first name shows."], ["The last name shows."], ["The email address shows."], ["No required field is left empty."]]
C("S1-21", S, "A new staff member switched off by hand is saved with Technician off",
  [ADMIN, "Choose a name and an email address for a new staff member made by this test.", LIST],
  [NEWWIN] + NEW_FIELDS + [TC_ON, 'In Role, pick "Technician".', "Switch Technician off.", SAVE],
  [["The New Staff Member window opens."]] + NEW_FIELDS_RES +
  [[TC_ON_RES], ["Technician switches on by itself."], ["Technician is off."],
   ["The window closes and the new staff member is listed.", 'Their row shows "No" in the Technician column.']],
  ["S1-R3", "S1-R7", "S4-R1"])

C("S1-22", S, "A new staff member switched on by hand is saved with Technician on",
  [ADMIN, "Choose a name and an email address for a new staff member made by this test.", LIST],
  [NEWWIN] + NEW_FIELDS + [TC_ON, 'In Role, pick "Parts Manager".', "Switch Technician on.", SAVE],
  [["The New Staff Member window opens."]] + NEW_FIELDS_RES +
  [[TC_ON_RES], ["Technician is off."], ["Technician is on."],
   ["No warning shows.", "The window closes and the new staff member is listed.", 'Their row shows "Yes" in the Technician column.']],
  ["S1-R3", "S1-R7", "S4-R1"])

# ---- Edit Staff Member --------------------------------------------------------------------------------------------------------
C("S1-23", S, "Edit Staff Member never turns Technician on from the role",
  [ADMIN, staff(tech=False, role="the built-in Parts Manager role"), LIST],
  [EDIT_A, 'In Role, pick "Technician".', 'In Role, pick "Foreman".'],
  [["The window shows Time Clock on and Technician off."], ["Role shows Technician.", "Technician stays off."],
   ["Role shows Foreman.", "Technician stays off.", "Technician is not grayed out."]],
  ["S1-E1", "S1-R3"])

C("S1-24", S, "Edit Staff Member keeps Technician on when the role changes",
  [ADMIN, staff(role="the built-in Parts Manager role"), LIST],
  [EDIT_A, 'In Role, pick "Service Advisor".', SAVE, EDIT_A],
  [[WIN_TECH], ["Role shows Service Advisor.", "Technician stays on."], ["The window closes.", 'Staff member A\'s row shows "Yes" in the Technician column.'],
   ["Role shows Service Advisor and Technician is on."]],
  ["S1-E1"])

C("S1-25", S, "In Edit Staff Member, Time Clock off turns Technician off and on leaves it off",
  [ADMIN, staff(), LIST],
  [EDIT_A, "Switch Time Clock off.", "Hover the Technician toggle.", "Switch Time Clock on.", "Switch Technician on."],
  [[WIN_TECH], ["Technician switches off and is grayed out."], [f'A tooltip shows "{TIP_TC}"'],
   ["Time Clock is on.", "Technician stays off.", "Technician is not grayed out."], ["Technician is on."]],
  ["S1-R4", "S1-R5", "UFS-2"])

C("S1-26", S, "In Edit Staff Member, picking Office User turns Technician off and grays it",
  [ADMIN, staff(role="the built-in Parts Manager role"), LIST],
  [EDIT_A, 'In Role, pick "Office User".', "Hover the Technician toggle.", 'In Role, pick "Parts Manager".'],
  [[WIN_TECH], ["Technician switches off and is grayed out."], [f'A tooltip shows "{TIP_ROLE}"'],
   ["Role shows Parts Manager.", "Technician stays off.", "Technician is not grayed out."]],
  ["S1-N1", "S1-E1", "UFS-3"])

C("S1-27", S, "With Office User and Time Clock off, the role message shows on hover",
  [ADMIN, LIST],
  [NEWWIN, 'In Role, pick "Office User".', TC_OFF, "Hover the Technician toggle."],
  [["The New Staff Member window opens."], ["Technician is off and grayed out."], ["Time Clock is off.", "Technician is still off and grayed out."],
   [f'A tooltip shows "{TIP_ROLE}"', f'The tooltip does not show "{TIP_TC}"']],
  ["EH-S1", "S1-N1", "S1-R4"])

C("S1-28", S, "A custom role made from Office User never grays out Technician",
  [ADMIN, "Have a custom role made for this test from the Office User template, role A (Settings, Roles & Permissions, Create custom role).", LIST],
  [NEWWIN, TC_ON, "In Role, pick role A.", "Switch Technician on."],
  [["The New Staff Member window opens."], [TC_ON_RES], ["Role shows role A.", "Technician is off and not grayed out."], ["Technician is on."]],
  ["S1-N1", "S1-R3"])

C("S1-29", S, "A custom role made from Time Clock User never grays out Technician",
  [ADMIN, "Have a custom role made for this test from the Time Clock User template, role A (Settings, Roles & Permissions, Create custom role).", LIST],
  [NEWWIN, TC_ON, "In Role, pick role A.", "Switch Technician on."],
  [["The New Staff Member window opens."], [TC_ON_RES], ["Role shows role A.", "Technician is off and not grayed out."], ["Technician is on."]],
  ["S1-N1"])

# ---- save rules ---------------------------------------------------------------------------------------------------------------
C("S1-30", S, "Switching Technician changes no list until Save & Close",
  [ADMIN, staff(tech=False, role="the built-in Parts Manager role"),
   "Have Work Orders open on Board View for the test location in a second browser tab.", LIST],
  [EDIT_A, "Switch Technician on.", "Switch to the Board View tab.", "Reload the Board View page.", "Switch to the Settings, Staff tab.", SAVE,
   "Switch to the Board View tab.", "Reload the Board View page."],
  [["The window shows Technician off."], ["Technician is on (not saved yet)."], ["Board View shows no column for staff member A."],
   ["After the reload Board View still shows no column for staff member A."], ["The Edit Staff Member window is still open with Technician on."],
   ["The window closes.", 'Staff member A\'s row shows "Yes" in the Technician column.'], ["The board has not changed yet."],
   ["After the reload Board View shows a column for staff member A."]],
  ["S1-R6", "S1-E3", "S3-R2"])

C("S1-31", S, "Saving Technician on never shows a warning, even with open work",
  [ADMIN, staff(tech=False, role="the built-in Parts Manager role"),
   wo(1, "In Progress", "staff member A", extra=", so staff member A holds open work"), LIST],
  [EDIT_A, "Switch Technician on.", SAVE],
  [["The window shows Technician off."], ["Technician is on."],
   ["No warning window shows.", "The window closes.", 'Staff member A\'s row shows "Yes" in the Technician column.']],
  ["S1-R7"])

C("S1-32", S, "Billable and Sales Representative stay as they are when Technician changes",
  [ADMIN, staff(extra=", with Billable set to No and Sales Representative off"), LIST],
  [EDIT_A, "Switch Technician off.", "In Billable, pick Yes.", "Switch Sales Representative on.", "Switch Technician on."],
  [[WIN_TECH, "Billable shows No and Sales Representative is off."],
   ["Billable still shows No and is not grayed out.", "Sales Representative is still off and not grayed out."],
   ["Billable shows Yes.", "Technician is still off."], ["Sales Representative is on.", "Technician is still off."],
   ["Technician is on.", "Billable still shows Yes and Sales Representative is still on."]],
  ["S1-R9", "OOS-1", "KD-BILL", "T-THREE"])

C("S1-33", S, "Technician off keeps Billable Yes and Sales Representative on after saving",
  [ADMIN, staff(extra=", with Billable set to Yes and Sales Representative on, and no open work"), LIST],
  [EDIT_A, "Switch Technician off.", SAVE, EDIT_A],
  [[WIN_TECH], ["Billable still shows Yes and Sales Representative is still on."],
   ["The window closes.", 'Staff member A\'s row shows "No" in the Technician column and "Yes" in the Billable column.'],
   ["Technician is off, Billable shows Yes and Sales Representative is on."]],
  ["S1-R9", "KD-BILL", "OOS-1"])

# ---- permissions ---------------------------------------------------------------------------------------------------------------
C("S1-34", S, "A user without App Settings cannot reach the staff list or staff window",
  [ADMIN, "Have a custom role made for this test, role A, with 'Settings → App Settings' off, so a person on it has no Staff access.",
   "Have a new staff member for this test, staff member A, on role A, who can sign in.",
   "Note the address of the staff list (Settings, Staff) as an Admin sees it, so you can type it later."],
  ["Sign out.", "Sign in as staff member A.", "Open the Settings menu.", "Type the staff list address in the browser's address bar."],
  [["You are signed out."], ["Staff member A is signed in."], ["The Settings menu, where it shows, does not offer Staff."],
   ["The staff list does not open, as today.", "No Technician column, notice or staff window shows."]],
  ["S1-N2", "S4-N1", "PERM-GOV"])

# ---- deactivation ---------------------------------------------------------------------------------------------------------------
C("S1-35", S, "A deactivated technician keeps the toggle and gets it back on reactivation",
  [ADMIN, staff(), tech_b(), "Have Work Orders open on Board View for the test location in a second browser tab.", LIST],
  ["Click Deactivate Account for staff member A.", "Switch to the Board View tab.", "Reload the Board View page.", "Switch to the Settings, Staff tab.",
   "Click Reactivate for staff member A on the Deactivated tab.", EDIT_A, "Switch to the Board View tab.", "Reload the Board View page."],
  [["Staff member A moves to the Deactivated tab.", 'Their row there shows "No" in the Technician column.'],
   ["The board tab shows Board View."], ["Board View shows no column for staff member A.", "Board View shows a column for staff member B."],
   ["The staff list shows."], ["Staff member A moves back to the Active tab.", 'Their row shows "Yes" in the Technician column.'],
   ["Time Clock is on and Technician is on, as before the deactivation."], ["The board tab shows Board View."],
   ["After the reload Board View shows a column for staff member A again."]],
  ["S1-E2", "S4-R1", "S3-R1"])

C("S1-36", S, "Deactivate Account shows no Turn Off Technician warning and keeps work",
  [ADMIN, staff(), tech_b(), wo(1, "In Progress", "staff member A"), LIST],
  ["Click Deactivate Account for staff member A.", "Open work order 1.", "Open the Lead Technician dropdown."],
  [['No "Turn Off Technician" warning shows.', "Staff member A moves to the Deactivated tab."],
   ["Work order 1 still shows staff member A as its lead."],
   ["Staff member A is listed last, grayed out, with the check mark, and cannot be picked.", "Staff member B is offered and can be picked."]],
  ["S1-E4", "S1-E2", "S3-R7"])

# round 2 (2 Nov 2026): Save & Add Next (design shows it; the PRD names only "the window's existing Save"; register TT-D06, PO question 8)
C("S1-37", S, "After Save & Add Next, the empty form sets Technician from the role again",
  [ADMIN, "Choose names and email addresses for two new staff members made by this test.", LIST],
  [NEWWIN] + NEW_FIELDS + [TC_ON, 'In Role, pick "Parts Manager".', "Switch Technician on.", "Click Save & Add Next.", TC_ON, 'In Role, pick "Service Advisor".'],
  [["The New Staff Member window opens."]] + NEW_FIELDS_RES +
  [[TC_ON_RES], ["Technician is off."], ["Technician is on."],
   ["The first staff member is saved and the window stays open with an empty form for the next person."],
   [TC_ON_RES], ["Role shows Service Advisor.", "Technician is off, set from the role: the first person's switch by hand is not carried over."]],
  ["S1-R3"], marker="PO:tt-d06")
