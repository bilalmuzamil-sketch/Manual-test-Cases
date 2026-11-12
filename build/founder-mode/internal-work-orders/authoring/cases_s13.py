"""Story 13 — Starting categories and accounts a tester can see on the build (SV-12295): a new organization gets the starting categories,
the QuickBooks rows of a newly connected location, the AccountingHub accounts and mappings, the setting stays off, nobody is flagged.
The checks of EXISTING organizations around the release (the migration, the operator command, rule zero) are in the release-day
section (REL), run on production after the release."""
from iwo_lib import C, NOMAN
from common import *

S = "S13"
NEWORG = "Use a new organization created on the build."

C("S13-01", S, "A new organization has the four starting categories",
  [ADMIN, NEWORG],
  ["Open Administration > Service > Internal Work Orders.", "Open the No Charge categories tab."],
  [['The Internal categories tab lists General Internal with the "Default" badge.'],
   ['The No Charge tab lists Warranty and Comeback with "Required" and Goodwill with "Not asked".']],
  ["S13-R1", "S13-E2", "S1-R13"])
C("S13-02", S, "A new organization has the setting off and no internal customer",
  [ADMIN, NEWORG],
  ["Open Settings > Work Orders.", "Open the Customers list."],
  [['The "Internal Work Orders" toggle is off.'], ['No customer shows an "Internal" badge, and no customer was created by the release.']],
  ["S13-R1", "S13-R6", "KD-NOFLAG"])
C("S13-03", S, "A location connected to QuickBooks gets one empty row per category",
  [ADMIN, NEWORG, "Connect the organization's location to a QuickBooks Online company."],
  ["Open Integrations > QuickBooks.", "Open ShopView Accounts."],
  [["The QuickBooks page opens."], ["Four category rows show, General Internal, Warranty, Goodwill and Comeback, each empty and with no hint while the setting is off."]],
  ["S13-R2", "S5-R5"])
C("S13-04", S, "A new AccountingHub organization has the starting accounts and mappings",
  [ADMIN, NEWORG, "Enable AccountingHub for the new organization."],
  ["Open Accounting > Account Mappings.", "Open Accounting's chart of accounts."],
  [['"Internal: General Internal" maps to 6500 Vehicle Expenses, "No Charge: Warranty" and "No Charge: Goodwill" to 6430 Warranty & Goodwill Expense, "No Charge: Comeback" to 6440 Comeback Expense.'],
   ["The chart holds 6500 Vehicle Expenses, 6430 Warranty & Goodwill Expense and 6440 Comeback Expense; 6400 Shop Equipment Maintenance is still there."]],
  ["S6-R2", "S13-R3"])
C("S13-05", S, "A new organization's first job posts without any mapping set up",
  [ADMIN, NEWORG, "Enable AccountingHub for the new organization.", ON, REVIEW_OFF, icust("A"), iwo(1, "A", "Complete", f", with {STOCK_PART}")],
  [OPEN_WO, CLOSE_BTN, CONFIRM_CLOSE, "Open Accounting > Accounting Events."],
  [["Work order 1 opens."], ['The Stock parts note names 6500 Vehicle Expenses, with no "No account set" warning.'], ["The work order is Closed."],
   ["The Close is posted, not Held."]],
  ["S6-R2", "S13-R4"])
C("S13-06", S, "The migration and its reruns create no duplicates",
  [ADMIN, "Use any organization after the release ran."],
  ["Open Administration > Service > Internal Work Orders."],
  [["Each starting category is listed once, even after the migration ran again."]],
  ["S13-R4", "S13-N1"], marker=NOMAN("the migration and the operator command are run by engineering, not from the screens"))
