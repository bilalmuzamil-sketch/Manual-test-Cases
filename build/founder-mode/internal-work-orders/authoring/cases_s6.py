"""Story 6 — AccountingHub account mapping (SV-11763): one row per category on Accounting > Account Mappings, the starting mappings on
an AccountingHub organization, remapping (6400 included), new and archived categories, the shop supplies row, not enabled, the
permission, and the Error Handling line. The rollout command on existing organizations is in the release-day section; held events are
in Story 8."""
from iwo_lib import C, NOMAN
from common import *

S = "S6"
MAP = "Open Accounting > Account Mappings."

C("S6-01", S, "Account Mappings lists one row per category under Parts cost of goods sold",
  [ADMIN, ON, AH],
  [MAP],
  [['Under "Parts cost of goods sold" rows show named "Internal: General Internal", "No Charge: Warranty", "No Charge: Goodwill" and "No Charge: Comeback".',
    "Each row is a picker over the organization's chart of accounts, like the other rows.",
    'The existing "Shop supplies expense" row is still there and no new shop supplies row was added.']],
  ["S6-R1", "S10-R5"])
C("S6-02", S, "The starting categories are mapped to the AccountingHub accounts",
  [ADMIN, ON, AH, "Make sure no one has changed the starting category rows on Account Mappings."],
  [MAP],
  [['"Internal: General Internal" shows 6500 Vehicle Expenses.', '"No Charge: Warranty" and "No Charge: Goodwill" both show 6430 Warranty & Goodwill Expense.',
    '"No Charge: Comeback" shows 6440 Comeback Expense.', "6400 Shop Equipment Maintenance is not a category row."]],
  ["S6-R2", "OV-ACCT"])
C("S6-03", S, "A category row can be remapped to any account, including 6400",
  [ADMIN, ON, AH],
  [MAP, 'Pick 6400 Shop Equipment Maintenance in the "Internal: General Internal" row.', SAVE, "Reload the page."],
  [["The rows show."], ["6400 Shop Equipment Maintenance shows in the row."], ["The mapping is saved."], ['"Internal: General Internal" still shows 6400 Shop Equipment Maintenance.']],
  ["S6-R3"])
C("S6-04", S, "A category added by the shop gets an empty row",
  [ADMIN, ON, AH],
  ["Open Administration > Service > Internal Work Orders.", 'Click "New No Charge Category".', "Type a new name in Name.", SAVE, MAP],
  [["The categories page opens."], ["The window opens."], ["The name shows."], ["The category is listed."],
   ['A new row "No Charge: [new name]" shows, empty; it is not filled from another row.']],
  ["S6-R1", "S6-R2"], note=NAME_NOTE)
C("S6-05", S, "An archived category keeps its row and can be remapped",
  [ADMIN, ON, AH, "Have a new No Charge category for this test, category A, mapped to an expense account, then archived."],
  [MAP, "Pick a different expense account in category A's row.", SAVE],
  [["Category A's row still shows with its account."], ["The new account shows."], ["The mapping is saved."]],
  ["S6-R1"])
C("S6-06", S, "Without AccountingHub nothing changes for the organization",
  [ADMIN, ON, QB_ONLY, "Make sure AccountingHub is not enabled for the organization."],
  ["Open the main menu."],
  [["The Accounting area is not offered, as today, so there are no category rows to map."]],
  ["S6-N1", "S8-N1"])
C("S6-07", S, "Without Accounting — Settings the Account Mappings page is not available",
  [ON, AH, role("has every setting except 'Accounting — Settings'")],
  [MAP],
  [["Account Mappings is not available to this user, as today."]],
  ["S6-N2", "PM-13"])
C("S6-08", S, "A failed mapping save follows today's Account Mappings error handling",
  [ADMIN, ON, AH],
  [MAP, 'Pick an account in the "No Charge: Goodwill" row.', SAVE],
  [["The rows show."], ["The account shows."], ["When the save fails, the existing Account Mappings error handling shows, unchanged."]],
  ["EH-S6"], marker=NOMAN("the save has to fail, which only a developer can make happen"))
