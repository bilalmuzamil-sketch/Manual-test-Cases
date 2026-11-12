"""Story 5 — QuickBooks Online account mapping (SV-11762): one ShopView Accounts row per category under Cost of Parts, the two headers,
the note, the picker, one mapping shared with the category window, the empty-row hint, rows while the setting is off, per location,
archive and restore, not connected, the permission, an inactive account, and the Error Handling line."""
from iwo_lib import C, NOMAN
from common import *

S = "S5"
QBPAGE = "Open Integrations > QuickBooks."
ACCTS = "Open ShopView Accounts."

C("S5-01", S, "ShopView Accounts lists one row per category under Cost of Parts",
  [ADMIN, ON, QB_ONLY],
  [QBPAGE, ACCTS],
  [["The QuickBooks page opens."],
   ["Directly under Cost of Parts and above Cost of Goods (tax), the header \"Internal work orders\" shows a row named General Internal.",
    'Under the header "No Charge work orders" rows show for Warranty, Goodwill and Comeback.', "Each category row carries the green QuickBooks mark.",
    'Under the rows a note reads "Shop supplies on internal and no-charge work orders are credited to the income account of your Shop supplies item in Products And Services; nothing to map here."']],
  ["S5-R1", "S10-R5", "T-CATACCT", "OV-ACCT", "KD-ACCT"])
C("S5-02", S, "The account picker lists the location's expense accounts with none preselected",
  [ADMIN, ON, QB_ONLY, "Have a new No Charge category for this test, category A."],
  [QBPAGE, ACCTS, "Open the account picker of category A's row."],
  [["The QuickBooks page opens."], ["Category A's row shows empty."],
   ["The picker lists the expense accounts of the location's QuickBooks company, the same picker the other rows use.", "No account is preselected."]],
  ["S5-R2", "S5-R1"])
C("S5-03", S, "A row mapped on the QuickBooks page shows in the category window",
  [ADMIN, ON, QB_ONLY, "Have a new No Charge category for this test, category A."],
  [QBPAGE, ACCTS, "Pick an expense account in category A's row.", SAVE, "Open Administration > Service > Internal Work Orders.", "Open the No Charge categories tab."],
  [["The QuickBooks page opens."], ["Category A's row shows."], ["The account shows in the row."], ["The mapping is saved for the location."],
   ["The categories page opens."], ["Category A's QuickBooks expense account column shows the same account."]],
  ["S5-R3", "S1-R14"])
C("S5-04", S, "An account picked in the category window shows on the QuickBooks page",
  [ADMIN, ON, QB_ONLY, "Have a new No Charge category for this test, category A."],
  ["Open Administration > Service > Internal Work Orders.", "Open the No Charge categories tab.", "Open the row menu of category A.", "Click Edit.",
   "Pick an expense account in the QuickBooks expense account picker.", SAVE, QBPAGE, ACCTS],
  [["The categories page opens."], ["Category A is listed."], ["The menu shows Edit."], ["The window opens."], ["The account shows."], ["The window closes."],
   ["The QuickBooks page opens."], ["Category A's row shows the same account."]],
  ["S5-R3", "S1-R14"])
C("S5-05", S, "An empty category row shows the ShopView Review hint",
  [ADMIN, ON, QB_ONLY, "Have a new No Charge category for this test, category A."],
  [QBPAGE, ACCTS],
  [["The QuickBooks page opens."],
   ['Category A\'s row shows the hint "Not set. Parts cost of [category A\'s name] work orders posts to the ShopView Review account until you pick one."',
    "The row is not filled from another category's row."]],
  ["S5-R4", "UFS-27", "S5-E2"], note=NAME_NOTE)
C("S5-06", S, "The rows show while the setting is off, with no hints",
  [ADMIN, OFF, QB_ONLY, "Have a new No Charge category for this test, category A, with no account."],
  [QBPAGE, ACCTS, "Pick an expense account in category A's row.", SAVE],
  [["The QuickBooks page opens."], ["The category rows show under Cost of Parts.", "Category A's empty row shows no hint."], ["The account shows."],
   ["The mapping is saved although the setting is off."]],
  ["S5-R5", "S5-R4", "KD-NOFLAG"])
C("S5-07", S, "A category added by the shop appears as a new empty row",
  [ADMIN, ON, QB_ONLY],
  ["Open Administration > Service > Internal Work Orders.", 'Click "New Internal Category".', "Type a new name in Name.", SAVE, QBPAGE, ACCTS],
  [["The categories page opens."], ["The window opens."], ["The name shows."], ["The new category is listed."], ["The QuickBooks page opens."],
   ['A new empty row with that name shows under "Internal work orders".']],
  ["S5-R1"])
C("S5-08", S, "Each location keeps its own mapping for a category",
  [ADMIN, ON, "Use an organization with two locations, location A and location B, each connected to its own QuickBooks Online company.",
   "Have a new No Charge category for this test, category A, with no account at either location."],
  ["Work at location A.", QBPAGE, ACCTS, "Pick an expense account in category A's row.", SAVE, "Switch to location B.", QBPAGE],
  [["Location A is current."], ["The QuickBooks page opens."], ["Category A's row shows empty."], ["The account shows."], ["The mapping is saved."],
   ["Location B is current."], ["Category A's row is still empty at location B."]],
  ["S5-R6", "S5-R3"])
C("S5-09", S, "An archived category keeps its greyed row and its mapping",
  [ADMIN, ON, QB_ONLY, "Have a new No Charge category for this test, category A, mapped to an expense account at the test location."],
  ["Archive category A on the categories page.", QBPAGE, ACCTS, "Pick a different expense account in category A's row.", SAVE],
  [["Category A is archived."], ["The QuickBooks page opens."], ["Category A's row still shows, greyed, with its account."], ["The new account shows."],
   ["The row is remapped and saved."]],
  ["S5-R1", "S5-R6"])
C("S5-10", S, "Restoring a category brings its mapping back untouched",
  [ADMIN, ON, QB_ONLY, "Have a new No Charge category for this test, category A, mapped to an expense account and then archived."],
  ["Open Administration > Service > Internal Work Orders.", 'Click the "Show archived" link.', "Click Restore on category A.", QBPAGE, ACCTS],
  [["The categories page opens."], ["Category A is listed with Restore."], ["Category A is active again."], ["The QuickBooks page opens."],
   ["Category A's row is no longer greyed and shows the same account: nothing had to be mapped again."]],
  ["S5-R6"])
C("S5-11", S, "Without a QuickBooks connection the rows are not shown",
  [ADMIN, ON, "Use a location that is not connected to QuickBooks Online."],
  [QBPAGE],
  [["The page offers to connect QuickBooks and shows no ShopView Accounts rows, so no category rows show."]],
  ["S5-N1"])
C("S5-12", S, "Without Settings — Integrations the QuickBooks page is not available",
  [ON, QB_ONLY, role("has every setting except 'Settings — Integrations'")],
  ["Open Integrations."],
  [["Integrations > QuickBooks is not available to this user, as today."]],
  ["S5-N2", "PM-12"])
C("S5-13", S, "A mapped account made inactive in QuickBooks shows the inactive state",
  [ADMIN, ON, QB_ONLY, "Have a new No Charge category for this test, category A, mapped to an expense account, account A, at the test location.",
   "Make account A inactive in QuickBooks Online."],
  [QBPAGE, ACCTS],
  [["The QuickBooks page opens."], ["Category A's row shows account A in the inactive or deleted state the other rows use."]],
  ["S5-E1"])
C("S5-14", S, "A failed save follows today's QuickBooks settings error handling",
  [ADMIN, ON, QB_ONLY],
  [QBPAGE, ACCTS, "Pick an expense account in General Internal's row.", SAVE],
  [["The QuickBooks page opens."], ["The rows show."], ["The account shows."], ["When the save fails, the existing QuickBooks settings error handling shows, unchanged."]],
  ["EH-S5"], marker=NOMAN("the save has to fail, which only a developer can make happen"))
