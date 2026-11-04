"""Story 4 — Technician column and notice on the staff list (SV-11882): column place, Yes/No colours, deactivated always No,
location-independent, sorting, pill, notice text and place (including the load-error line), cannot be closed, end date, not editable."""
from tt_lib import C, HOLD
from common import *

S = "S4"
NOTICE = ("New: Decide who appears on Board View, Tech View and the technician dropdowns. Turn Technician on or off for each person in their "
          "staff settings, next to Sales Representative. To start, it is on for everyone who worked on a work order in the last 90 days, is on "
          "open work, or is billable.")
BEFORE_END = 'Make sure the date on your computer is before the end date of the "New" pill (07:00 UTC on the seventh day after the release that ships Technician Toggle).'
PILL_DAY = ('Know the end date of the "New" pill for the build under test: 07:00 UTC on the seventh day after the release that ships '
            'Technician Toggle (until that release is scheduled, the build carries 31 Dec 2026, 07:00 UTC).')
THREE = ("Have three new staff members for this test, enrolled at the test location: staff member A with Time Clock on and Technician on, "
         "staff member B with Time Clock on and Technician off, and staff member C with Time Clock off, each with Billable set to Yes.")

C("S4-01", S, 'The staff list has a read-only "Technician" column directly left of Billable',
  [ADMIN, THREE, LIST],
  ["Find staff member A, staff member B and staff member C in the Active tab."],
  [['A column headed "Technician" sits directly left of the Billable column.',
    'Staff member A\'s row shows "Yes" in green.', 'Staff member B\'s row shows "No" in red.', 'Staff member C\'s row shows "No" in red.',
    'The Technician values use the same coloured Yes/No look as the Billable column next to it (Billable shows "Yes" for all three).']],
  ["S4-R1", "T-TECH"])
C("S4-02", S, 'A deactivated person always shows "No" on the Deactivated tab',
  [ADMIN, staff(extra=", then deactivated with Deactivate Account"),
   "Have a new staff member for this test, staff member B, with Time Clock on and Technician on, so the Active tab has a technician to compare with.", LIST],
  ['Click the "Deactivated" tab.', 'Click the "Active" tab.'],
  [['The Deactivated tab also has the "Technician" column directly left of Billable.', 'Staff member A\'s row shows "No" in red, although their Technician toggle is on.'],
   ['Staff member B\'s row shows "Yes" in green.']],
  ["S4-R1", "S1-E2"])
C("S4-03", S, "The Technician column does not depend on the location being viewed",
  [ADMIN, "Use an organization with a second location, location B.", staff(where="enrolled at location B only"), LIST],
  ["Find staff member A in the Active tab."],
  [['Staff member A\'s row shows "Yes", although you are working at the test location and staff member A is enrolled only at location B.']],
  ["S4-R1a"])
C("S4-04", S, "The Technician column sorts like the other columns",
  [ADMIN, THREE.replace(", each with Billable set to Yes.", ", so the list has Yes and No values to sort."), LIST],
  ['Click the "Billable" column header.', 'Click the "Technician" column header.', 'Click the "Technician" column header again.'],
  [["The list sorts by Billable and the header shows the list's usual sort arrow."],
   ["The list sorts by Technician, with all \"No\" rows together and all \"Yes\" rows together, and the header shows the same sort arrow."],
   ["The order of the Technician groups is reversed and the arrow points the other way."]],
  ["S4-R2", "OOS-6"])
C("S4-05", S, 'A "New" pill sits on the Technician column header',
  [ADMIN, BEFORE_END, LIST],
  ["Find the Technician column header in the Active tab."],
  [['A "New" pill sits at the top right of the word "Technician" in the header, touching the end of the word.',
    "The pill is inside the Technician column and does not overlap the Billable header."]],
  ["S4-R3"])
C("S4-06", S, "The notice shows above the tabs with its exact text and cannot be closed",
  [ADMIN, BEFORE_END, "Start on the Settings page."],
  ['Click "Staff".'],
  [["The staff list opens.", "A notice sits below the page toolbar and above the Active and Deactivated tabs.", f'The notice reads "{NOTICE}"',
    "The notice has no close button or other control to close it."]],
  ["S4-R4", "S4-R5", "UFS-1", "PERM-GOV"])
C("S4-07", S, "When the staff list fails to load, the notice still shows below the error",
  [ADMIN, BEFORE_END, "Start on the Settings page."],
  ['Click "Staff".'],
  [["The staff list fails to come back.",
    'The existing line "Something went wrong loading the staff list. Please try again." sits between the page toolbar and the notice.',
    f'The notice still shows above the Active and Deactivated tabs with the text "{NOTICE}"']],
  ["S4-R4"], marker=HOLD("a manual tester cannot make the staff list fail while the page itself still loads"))
C("S4-08", S, "The notice and the column pill disappear together at the end date",
  [ADMIN, PILL_DAY, "Set your computer's clock to two minutes before that end date.", LIST],
  ["Wait until your computer's clock passes the end date."],
  [["The notice and the \"New\" pill on the Technician column header disappear at the same moment, without a page reload.",
    "The Technician column itself stays."]],
  ["S4-R5", "S4-R3", "S1-R2"])
C("S4-09", S, "After the end date no notice and no pill show anywhere",
  [ADMIN, PILL_DAY, "Set your computer's clock to one day after that end date.", "Have any active staff member, staff member A.", LIST],
  ["Find the Technician column header in the Active tab.", EDIT_A, "Close the Edit Staff Member window.", NEWWIN],
  [["No notice shows above the tabs.", 'The Technician column shows with no "New" pill.'],
   ['The Edit Staff Member window shows the Technician toggle with no "New" pill.'], ["The window closes."],
   ['The New Staff Member window shows the Technician toggle with no "New" pill.']],
  ["S4-N2", "S4-R5"])
C("S4-10", S, "The staff list notice and column pill disappear at 07:00 UTC on 26 Nov 2026",
  [ADMIN, "Use the build that ships Technician Toggle in the 19 Nov 2026 release, so the notice and the pill end at 07:00 UTC on 26 Nov 2026.",
   "Set your computer's clock to 06:58 UTC on 26 Nov 2026.", LIST],
  ["Set your computer's clock to 07:01 UTC on 26 Nov 2026.", "Reload the page."],
  [["The notice and the \"New\" pill on the Technician column header are gone."],
   ["Neither the notice nor the pill shows (if they still show, the build still carries the 31 Dec 2026 placeholder date)."]],
  ["S4-R5", "S4-R3", ("Jira SV-12008", "When the release that ships Technician Toggle is scheduled, set the end date of its \"New\" pills (on the Technician toggle in the New and Edit Staff Member windows, and on the staff list's Technician column header) and of the staff list notice to 07:00 UTC on the seventh day after the release date."),
   ("Jira SV-11879", "The \"New\" pill disappears at 26 Nov 2026 07:00 UTC (one week after the 19 Nov release, SV-12008) on every environment — test it before then.")])
C("S4-11", S, "The Technician value cannot be edited on the list and follows the staff window",
  [ADMIN, staff(role="the built-in Parts Manager role", extra=", leading no work"), LIST],
  ["Click the \"Yes\" in staff member A's Technician cell.", "Close the Edit Staff Member window if it opened.", EDIT_A, "Switch Time Clock off.", SAVE],
  [["No switch, dropdown or text box appears in the cell: the value cannot be changed on the list."], ["The staff list shows."],
   ["The window shows Technician on."], ["Technician switches off."], ["The window closes.", 'Staff member A\'s row now shows "No" in the Technician column.']],
  ["S4-E1", "S4-R1"])
