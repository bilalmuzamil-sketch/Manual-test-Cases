"""Story 8 — Permissions (SV-10821). Section 20475.
Phase B, 27 Oct 2026: every live case rewritten top to bottom against PRD v33 (Rule 134) in the QA lead's pattern. S8-03 split into
one case per default role (Rule 136): S8-03 Service Manager (keeps C154782), S8-03b Parts Manager, S8-03c Service Advisor.
The refusals of S8-N1 to S8-N3 are checked by hand the only way a manual tester can reach them: a screen opened while the user still
had the right, then the role cut down to View only (with See Financial Data and every Settings permission off, so no role setting
carries the right to delete behind the scenes, PRD context note S8-R14/S8-R15 and tech plan D14), then the action finished in the
open screen. S8-04 also compares the status change with Delete Part for the same user in the same state (S8-R15)."""
from pllib import C, PO_HOLD, HOLD, DESIGN_HOLD
from common import *
from cases_s6 import TYPE_A, ROW_A, SAVE, DEACT_CONF, ACT_CONF

WRITTEN = True

V, CE, DL = "Part Library & Inventory — View", "Part Library & Inventory — Create & Edit", "Part Library & Inventory — Delete"
ROLE_B = (f"Create a custom role for this test, role B, with {V}, {CE} and See Financial Data but without {DL}, "
          "so user B can create and edit parts but cannot delete them.")
USER_B = "Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions."
WIN_B = "Use two browser windows: window 1 signed in as the Admin, window 2 (a private window) signed in as user B, so both users' screens can be seen side by side."
START_B = "Start window 2 on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab."
ROLE_D = (f"Create a custom role for this test, role D, with {V}, {CE}, {DL} and See Financial Data, so user D starts with the right "
          "to delete parts.")
USER_D = "Create a staff member for this test, user D, at the test location with role D."
WIN_D = "Use two browser windows: window 1 signed in as the Admin, window 2 (a private window) signed in as user D."
START_D1 = "Start window 1 on role D's Edit Role page (Roles & Permissions), with nothing changed yet."
CUT = [f"In window 1, untick {CE}.", f"In window 1, untick {DL}.", "In window 1, untick See Financial Data.",
       "In window 1, untick every permission in the Settings group.", "In window 1, click Save."]
R_CUT = [["The Create & Edit box is unticked."], ["The Delete box is unticked."], ["The See Financial Data box is unticked."],
         ["Every Settings permission is unticked."],
         [f"Role D is saved with only {V} left in the Part Library and Inventory group: user D now cannot delete inventory parts."]]
W1_INV = ["In window 1, click Parts in the top bar.", "In window 1, click Inventory in the left menu."]
R_W1_INV = [["Window 1 shows the Parts left menu."], ["Window 1 shows the Inventory page on the Active tab."]]
NODES = dict(note="the PRD says Story 8 has no design (\"Design: Not applicable\"); no picture is attached.")
ACCESS = "An access error appears saying user D is not allowed to do this"

C("S8-01", "S8", "Without Delete, the actions menu has no Deactivate parts or Activate parts",
  [ADMIN, ROLE_B, USER_B, WIN_B, "Start both windows on the Inventory page (Parts in the top bar, then Inventory in the left menu), on the Active tab."],
  ["In window 1, click the three-dot actions button (⋮).", "In window 1, press Escape.", "In window 2, click the three-dot actions button (⋮).",
   "In window 2, click Cycle count.", "In window 2, click Cancel in the count toolbar.", "In window 2, click the Inactive tab.",
   "In window 2, click the three-dot actions button (⋮)."],
  [["The Admin's menu lists Cycle count, Deactivate parts and Export, in that order: the entry exists on this build."],
   ["The menu closes."],
   ["User B's menu lists Cycle count and Export only.", "There is no Deactivate parts entry."],
   ["Cycle count starts for user B (the count toolbar and Count boxes appear): Cycle count needs nothing more than Create & Edit."],
   ["The count ends and the toolbar is back to normal."],
   ["The Inactive tab is selected in window 2."],
   ["User B's menu lists Cycle count and Export only.", "There is no Activate parts entry."]],
  ["S8-R3", "S8-R4", "S8-R5"], design=dict(boards=["4.1"], words=[note("\"Deactivate parts\" sits between")]))

C("S8-02", "S8", "Without Delete, the tracking switch shows but cannot be changed",
  [ADMIN, ROLE_B, USER_B, WIN_B, "Have a tracked part, part A, with 2 on hand.", "Have an untracked part, part B.", START_B],
  ["In window 2, type part A's part number in the Search box.", "In window 2, click the part A row.",
   "In window 2, click the Track quantities and cost of goods switch.", "In window 2, click Cancel.",
   "In window 2, type part B's part number in the Search box.", "In window 2, click the part B row.",
   "In window 2, click the Track quantities and cost of goods switch.", "In window 2, click Cancel."],
  [["Part A is listed for user B."],
   ["Edit Inventory Part opens: the Track quantities and cost of goods switch is shown, on, and greyed out (disabled)."],
   ["Nothing changes: the switch stays on and Min and Max stay visible."],
   ["The window closes without saving."],
   ["Part B is listed, reading \"Not Tracked\"."],
   ["The switch is shown, off and greyed out, so user B can read that part B is untracked."],
   ["The switch stays off and Min and Max stay hidden."],
   ["The window closes, and part B still reads \"Not Tracked\"."]],
  ["S8-R8", "S8-R9", "S5-N2"], stories=[8, 5], design=NODES)

_role_steps = [MENU, "Press Escape.", TYPE_A, ROW_A, "Click Cancel."]
for key, part_of, role, title in (("S8-03", None, "Service Manager", "The Service Manager role sees the status, tracking and delete controls"),
                                  ("S8-03b", "S8-03", "Parts Manager", "The Parts Manager role sees the status, tracking and delete controls")):
    C(key, "S8", title,
      [f"Make sure the {role} role is at its default permissions: reset it to its template, so earlier edits do not change the result.",
       f"Sign in as a staff member with the default {role} role at the test location.",
       "Have an active, tracked part, part A, with 2 on hand.", START],
      _role_steps,
      [["The menu lists Cycle count, Deactivate parts and Export."], ["The menu closes."], ["Part A is listed."],
       ["Edit Inventory Part opens for part A.", "The red Delete Part button shows at the left of the footer.",
        "Part Status (Active, Inactive) can be picked, and the Track quantities and cost of goods switch can be clicked: the status and tracking controls show exactly where Delete Part shows."],
       ["The window closes without saving."]],
      ["S8-R14", "KD-14", "CN-S8-2"], part_of=part_of, design=NODES)

C("S8-03c", "S8", "The Service Advisor role has no status, tracking or delete controls",
  ["Make sure the Service Advisor role is at its default permissions: reset it to its template, so earlier edits do not change the result.",
   "Sign in as a staff member with the default Service Advisor role at the test location.",
   "Have an active, tracked part, part A, with 2 on hand.", START],
  _role_steps,
  [["The menu lists Cycle count and Export, with no Deactivate parts entry."], ["The menu closes."], ["Part A is listed."],
   ["Edit Inventory Part opens for part A.", "No Delete Part button shows in the footer (only Cancel and Save).",
    "Part Status and the Track quantities and cost of goods switch are greyed out: the controls are missing or disabled exactly where Delete Part is missing."],
   ["The window closes without saving."]],
  ["S8-R14", "KD-14", "S8-R12"], part_of="S8-03", design=NODES)

C("S8-04", "S8", "A status change is refused once the user can no longer delete parts",
  [ADMIN, ROLE_D, USER_D, WIN_D, "Create two active parts for this test, part A and part B, that sit on no work order and no return.",
   SHARED("parts A and B"), START_D1,
   "Start window 2 on the Inventory page, on the Active tab, with the shared start of the part numbers typed in the Search box."],
  ["In window 2, click the three-dot actions button (⋮).", "In window 2, click Deactivate parts.", "In window 2, click the part A row.",
   "In window 2, click Deactivate on the dark bar."] + CUT +
  ["In window 2, click Deactivate in the confirmation.", "In window 2, click the X at the right end of the dark bar.",
   "In window 2, click the part B row.", "In window 2, click Delete Part."] + W1_INV + ["In window 1, type the shared start of the part numbers in the Search box."],
  [["The menu opens for user D."], ["Bulk mode turns on."], ["The bar reads 1 selected."], ["The \"Deactivate parts?\" confirmation opens. Leave it open."]] + R_CUT +
  [[f"{ACCESS} (access denied).", "No \"1 part updated.\" message appears."],
   ["Bulk mode ends in window 2."],
   ["Edit Inventory Part opens for part B, still showing Delete Part (the page was loaded before the role changed)."],
   [f"{ACCESS} in the same way as for the status change, and the window stays open: the status change and the delete were refused alike for the same user."]] + R_W1_INV +
  [["Part A and part B are both still listed on the Active tab: part A's status did not change and part B was not deleted."]],
  ["S8-N3", "S8-R15", "CN-S8-1", "CN-S8-2"], design=NODES)

C("S8-05", "S8", "A user with only View sees no Inventory actions menu",
  [ADMIN, f"Create a custom role for this test, role C, with only {V} (no Create & Edit, no Delete, no See Financial Data and no Settings permission), so user C can only look at the list.",
   "Create a staff member for this test, user C, at the test location with role C, so the steps run with role C's permissions.",
   "Use a second browser window (a private window) signed in as user C.", "Have an active part, part A, so the list has a part to show."],
  ["In the second window, click Parts in the top bar.", "Click Inventory in the left menu.", TYPE_A, "Click the Inactive tab."],
  [["The Parts left menu shows Inventory for user C."],
   ["The Inventory page opens on the Active tab and lists parts: viewing the list still works with View only.",
    "There is no three-dot actions button (⋮) in the toolbar, so no Cycle count, Export, Deactivate parts or Activate parts can be reached."],
   ["Part A is listed."],
   ["The Inactive tab opens, again with no three-dot actions button."]],
  ["S8-R5", "S8-R13", ("JIRA", "SV-10821 acceptance criteria",
                       "Given a user with only View, when they open the Inventory list, then no actions menu is shown.")], design=NODES)

C("S8-06", "S8", "A custom role can change part status only once Delete is granted",
  [ADMIN, ROLE_B, USER_B, WIN_B, "Create an active, tracked part, part A, for this test.",
   "Start window 1 on role B's Edit Role page (Roles & Permissions), with nothing changed yet.",
   "Start window 2 on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  ["In window 2, click the part A row.", "In window 2, click Cancel.", f"In window 1, tick {DL}.", "In window 1, click Save.",
   "In window 2, reload the page.", "In window 2, click the three-dot actions button (⋮).", "In window 2, press Escape.",
   "In window 2, click the part A row.", "In window 2, click Inactive under Part Status.", "In window 2, click Save.",
   "In window 2, click Deactivate in the confirmation.", "In window 2, click the Inactive tab.", "In window 2, click the part A row.",
   "In window 2, click Active under Part Status.", "In window 2, click Save.", "In window 2, click Activate in the confirmation."],
  [["Edit Inventory Part opens for part A: Part Status shows Active and Inactive, both greyed out, so user B cannot pick them."],
   ["The window closes."], ["The Delete box is ticked."], ["Role B is saved."],
   ["The Inventory page reloads for user B."],
   ["The menu now lists Cycle count, Deactivate parts and Export: the role has exactly what was granted."],
   ["The menu closes."], ["Edit Inventory Part opens for part A, with Part Status no longer greyed out."],
   ["Inactive is picked."], ["The \"Deactivate part?\" confirmation opens."],
   ["A green message reads \"Part deactivated.\" and part A leaves the Active tab."],
   ["The Inactive tab is selected."], ["Edit Inventory Part opens for part A."], ["Active is picked."],
   ["The \"Activate part?\" confirmation opens."],
   ["A green message reads \"Part activated.\" and part A leaves the Inactive tab."]],
  ["S8-R1", "S8-R2", "S8-R16", "S8-R6", "UFS-24", "UFS-25"], stories=[8, 13], design=dict(boards=["3.2", "3.4"]))

C("S8-07", "S8", "Without Delete, New Inventory Part creates only tracked parts",
  [ADMIN, ROLE_B, USER_B, WIN_B, "Use a part number for a new part, part A, that no part or Part Library entry uses yet.", START_B],
  ["In window 2, click New Inventory Part.", "Click the Track quantities and cost of goods switch.", "Type a description in the Description field.",
   "Type part A's part number in the Part Number field.", "Pick any category in the Category field.", "Type 5.00 in the Cost field.",
   "Type 3 in the Quantity field of the bin row.", SAVE, TYPE_A],
  [["New Inventory Part opens for user B, with the Track quantities and cost of goods switch on and greyed out."],
   ["The switch stays on: user B cannot make the new part untracked."],
   ["Description holds the text."], ["Part Number reads part A's part number."], ["The category is picked."], ["Cost reads $5.00."],
   ["The bin row's Quantity reads 3."],
   ["The window closes and the part is saved with no access error: creating a tracked part needs only Create & Edit."],
   ["Part A's Total Qty shows 3 Available (a tracked part), not \"Not Tracked\"."]],
  ["S8-R7", "S8-R10"], design=NODES)

C("S8-08", "S8", "Without Delete, Part Status in the part window is greyed out",
  [ADMIN, ROLE_B, USER_B, WIN_B, "Have an active part, part A.", "Have an inactive part, part B.", START_B],
  ["In window 2, type part A's part number in the Search box.", "Click the part A row.", "Click Inactive under Part Status.", "Click Cancel.",
   "Click the Inactive tab.", "Type part B's part number in the Search box.", "Click the part B row.", "Click Active under Part Status.", "Click Cancel."],
  [["Part A is listed for user B."],
   ["Edit Inventory Part opens: Part Status shows Active picked and both options greyed out, and the title row shows the green \"Active\" pill."],
   ["Inactive cannot be picked; Active stays picked."], ["The window closes."], ["The Inactive tab is selected."], ["Part B is listed."],
   ["Part Status shows Inactive picked and both options greyed out; the title row shows the grey \"Inactive\" pill."],
   ["Active cannot be picked; Inactive stays picked."], ["The window closes and part B is still on the Inactive tab."]],
  ["S8-R6", "S13-R20", "S13-R3"], stories=[8, 13], design=dict(boards=["3.1", "3.6"]))

C("S8-09", "S8", "Without Delete, the part window shows no Delete Part button",
  [ADMIN, ROLE_B, USER_B, WIN_B, "Have an active part, part A, that sits on no work order.",
   "Start both windows on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  ["In window 1, click the part A row.", "In window 1, click Cancel.", "In window 2, click the part A row.", "In window 2, click Cancel."],
  [["The Admin's Edit Inventory Part shows the red Delete Part button at the left of the footer."], ["The window closes."],
   ["User B's Edit Inventory Part shows no Delete Part button: the footer holds only Cancel and Save."], ["The window closes."]],
  ["S8-R12", "S13-R10"], stories=[8, 13], design=dict(boards=["3.1"]))

C("S8-10", "S8", "Without Delete, a user can still rename a part stocked at two locations",
  [ADMIN, ROLE_B, USER_B, WIN_B,
   "Create a part, part A, for this test at the test location and at location B under the same part number, so both share one Part Library entry.",
   "Use a new description, description 2, that no part uses.",
   "Start window 2 on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  ["In window 2, click the part A row.", "In window 2, replace the Description with description 2.", "In window 2, click Save.",
   "In window 1, pick location B in the location selector at the top right.", "In window 1, click Parts in the top bar.",
   "In window 1, click Inventory in the left menu.", "In window 1, type part A's part number in the Search box."],
  [["Edit Inventory Part opens for part A."],
   ["Under the Description field: \"This also changes the description at 1 other location.\""],
   ["The window closes and the change is saved with no access error, although user B cannot delete and the change reaches location B."],
   ["The location selector shows location B."], ["Window 1 shows the Parts left menu."], ["Location B's Inventory page opens."],
   ["Part A now reads description 2 at location B."]],
  ["S8-R11", "S13-R12", "KD-2"], stories=[8, 13], design=dict(boards=["2.2", "2.5"], words=[note("At Lethbridge the same part now reads")]))

C("S8-11", "S8", "Without Delete, a user can still edit pricing and bin quantities",
  [ADMIN, ROLE_B, USER_B, WIN_B, "Create a tracked part, part A, for this test, with Sell Price $15.00 and 4 in one bin location, bin location A.",
   "Start window 2 on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  ["In window 2, click the part A row.", "Replace the Sell Price with 18.00.", "Replace bin location A's Quantity with 6.", SAVE],
  [["Edit Inventory Part opens for part A for user B."], ["Sell Price reads $18.00."], ["Bin location A's Quantity reads 6."],
   ["The window closes and saves with no access error for user B: these edits do not need Delete.",
    "Part A's row shows Sell Price $18.00 and Total Qty 6 Available (4 + 2 = 6)."]],
  ["S8-R13"], design=NODES)

C("S8-12", "S8", "Without Delete, an untracked part's price, bins and description can be edited",
  [ADMIN, ROLE_B, USER_B, WIN_B, "Create an untracked part, part A, for this test, with Sell Price $15.00 and 4 in one bin location, bin location A.",
   "Use a new description, description 2, that no part uses.",
   "Start window 2 on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  ["In window 2, click the part A row.", "Replace the Sell Price with 18.00.", "Replace bin location A's Quantity with 6.",
   "Replace the Description with description 2.", SAVE],
  [["Edit Inventory Part opens for part A for user B, with the tracking switch off."], ["Sell Price reads $18.00."], ["Bin location A's Quantity reads 6."],
   ["Description reads description 2."],
   ["The window closes and saves with no access error: editing other fields of an untracked part needs the same access as on a tracked part.",
    "Part A's row shows description 2, Sell Price $18.00, bin location A with 6, and still \"Not Tracked\"."]],
  ["S8-N1a"], design=dict(boards=["1.6"], words=[note("With the switch off, Min and Max are hidden")]))

C("S8-13", "S8", "A tracking change is refused once the user can no longer delete parts",
  [ADMIN, ROLE_D, USER_D, WIN_D, "Create an active, tracked part, part A, for this test, with 2 on hand.", START_D1,
   "Start window 2 on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  ["In window 2, click the part A row.", "In window 2, click the Track quantities and cost of goods switch."] + CUT +
  ["In window 2, click Save."] + W1_INV + ["In window 1, type part A's part number in the Search box."],
  [["Edit Inventory Part opens for part A, with the switch on."], ["The switch turns off. Do not save yet."]] + R_CUT +
  [[f"{ACCESS} (access denied), and the change is not saved."]] + R_W1_INV +
  [["Part A still shows 2 Available in Total Qty, not \"Not Tracked\": its tracking did not change."]],
  ["S8-N2", "S8-R15", "CN-S8-1"], design=NODES)

C("S8-14", "S8", "Creating an untracked part is refused once the user can no longer delete",
  [ADMIN, ROLE_D, USER_D, WIN_D, "Use a part number for a new part, part A, that no part or Part Library entry uses yet.", START_D1,
   "Start window 2 on the Inventory page, on the Active tab."],
  ["In window 2, click New Inventory Part.", "In window 2, type a description in the Description field.",
   "In window 2, type part A's part number in the Part Number field.", "In window 2, pick any category in the Category field.",
   "In window 2, type 5.00 in the Cost field.", "In window 2, click the Track quantities and cost of goods switch."] + CUT +
  ["In window 2, click Save."] + W1_INV + ["In window 1, type part A's part number in the Search box.", "In window 1, click the Inactive tab."],
  [["New Inventory Part opens for user D."], ["Description holds the text."], ["Part Number reads part A's part number."], ["The category is picked."],
   ["Cost reads $5.00."], ["The switch turns off and Min and Max are hidden. Do not save yet."]] + R_CUT +
  [[f"{ACCESS} (access denied), and the part is not saved."]] + R_W1_INV +
  [["No part A is listed on the Active tab."], ["No part A is listed on the Inactive tab either: no untracked part was created."]],
  ["S8-N1", "S8-R15", "CN-S8-1"], design=NODES)
