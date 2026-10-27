"""Story 4 — Create an untracked part (S4-R1 to S4-R9, S4-N1, S4-N2). Section 20471.
Phase A, 27 Oct 2026: every existing case rewritten top to bottom against PRD v33. S4-N1 and S4-N2 are NO MANUAL CASE: the window
never lets a tracked part lose its last or default bin (Story 4 context note); the two 14 Oct "not checked by hand" lines are gone."""
from pllib import C
from common import *

WRITTEN = True

C("S4-01", "S4", "New Inventory Part opens with tracking on in its own Inventory Tracking section",
  [ADMIN, START],
  ["Click New Inventory Part.", "Click Cancel."],
  [["The \"New Inventory Part\" window opens.", "The switch labelled \"Track quantities and cost of goods\" is on (blue).",
    "Directly below the Cost, Sell Price and Core Charge fields is a heading \"Inventory Tracking\" with an info icon.",
    "Under the heading come the switch, then the Min and Max fields, and only then the Tags field."],
   ["The window closes and no part is created."]],
  ["S4-R1", "S4-R2", "S4-R4", "S13-R1"],
  design=dict(boards=["1.1"], words=[note("Description first, then Part Number.")]))

C("S4-02", "S4", "Switching tracking off hides Min and Max but keeps the bin section",
  [ADMIN, START],
  ["Click New Inventory Part.", "Click the Track quantities and cost of goods switch.", "Click the switch again.", "Click Cancel."],
  [["The window opens with the switch on, Min and Max under it, and an Inventory section at the bottom holding one bin row (the location's default bin, Quantity 0, marked Default) and \"Add Bin Location\"."],
   ["The switch turns off (grey) and no confirmation or message appears.", "The Min and Max fields are gone; Tags now follows the switch directly.",
    "The Inventory section is still shown, with its bin row and \"Add Bin Location\"."],
   ["The switch is on again and the Min and Max fields are back."],
   ["The window closes and no part is created."]],
  ["S4-R5", "S4-R6", "CN-S4-1"],
  design=dict(boards=["1.6"], words=[note("With the switch off, Min and Max are hidden")]))

C("S4-03", "S4", "An untracked part shows Not Tracked with its bins, Min and Max in the list",
  [ADMIN, "Have an active untracked part, part A, with 4 in bin location A, 3 in bin location B, and a saved Min of 2 and Max of 6.",
   "Make sure the Bin Location / Quantity, Total Qty, Min and Max columns are switched on in the columns button.", START],
  ["Type part A's part number in the Search box."],
  [["Part A's Total Qty cell reads \"Not Tracked\" in grey, with no quantity badge.",
    "Its Bin Location / Quantity cell still shows both bins with their quantities: bin location A with 4 and bin location B with 3.",
    "Its Min cell reads 2 and its Max cell reads 6."]],
  ["S4-R8", "S4-R8a", "S4-R8b", "FO-7"],
  design=dict(boards=["5.3"], words=[note("Total Qty reads \"Not Tracked\"")]))

C("S4-04", "S4", "A tracked new part always keeps a default bin in the window",
  [ADMIN, "Make sure the test location has at least two bin locations, so a second bin can be added.", START],
  ["Click New Inventory Part.", "Try to remove the only bin row.", "Click Add Bin Location.", "Pick a second bin location in the new row.",
   "Click Default on the second row.", "Try to remove the row marked Default.", "Click Cancel."],
  [["The window opens with the switch on and one bin row already filled in: the location's default bin, Quantity 0, marked Default."],
   ["The only bin row stays: it cannot be removed."],
   ["A second, empty bin row appears."],
   ["The second row shows the bin location you picked."],
   ["One of the two rows is marked Default, never neither of them."],
   ["The row marked Default stays: both rows are still there."],
   ["The window closes and no part is created."]],
  ["S4-R7", "CN-S4-1"],
  design=dict(boards=["1.1"]))

C("S4-05", "S4", "The Inventory Tracking info icon shows the tracking help text",
  [ADMIN, START],
  ["Click New Inventory Part.", "Hover over the info icon beside the Inventory Tracking heading.", "Click Cancel."],
  [["The \"New Inventory Part\" window opens."],
   ["A hover text appears beside the icon and reads, word for word: \"Tracked parts keep a stock count, with Min and Max. Turn this off for items you don't count. Untracked parts are left out of the Inventory Value report.\"",
    "All three sentences are there, the last one about the Inventory Value report included."],
   ["The window closes and no part is created."]],
  ["S4-R3"],
  design=dict(boards=["5.1"], words=[note("Hovering the info icon shows")]))

C("S4-06", "S4", "An untracked part saves with its bin and quantity as a shelf reference",
  [ADMIN, "Use a part number that no part at the test location has, so the new part can be saved.", START],
  ["Click New Inventory Part.", "Type a description in Description.", "Type the part number in Part Number.", "Pick any category in Category.",
   "Type 4.00 in Cost.", "Click the Track quantities and cost of goods switch.", "Type 12 in the Quantity of the bin row.", "Click Save.",
   "Type the part number in the Search box.", "Click the new part's row."],
  [["The \"New Inventory Part\" window opens."], ["Description shows what you typed."], ["Part Number shows what you typed."],
   ["Category shows the category you picked."], ["Cost shows 4.00."],
   ["The switch is off, Min and Max are hidden, and the bin row is still shown."],
   ["The bin row's Quantity shows 12."],
   ["The window closes and the part is saved; no bin error appears."],
   ["One row is listed for the new part: its Bin Location / Quantity cell shows the bin with 12 and its Total Qty cell reads \"Not Tracked\"."],
   ["Edit Inventory Part opens with the switch off, and the Inventory section still holds the bin with Quantity 12."]],
  ["S4-R6", "S4-R6a", "S4-R8"],
  design=dict(boards=["1.6"], words=[note("Every empty required field shows its own error")]))

C("S4-07", "S4", "The Inventory Value report leaves out an untracked part",
  [ADMIN, "Create two parts for this test: part A, active and tracked, with 4 in its bin at a cost of $10.00, and part B, active and untracked, with 3 in its bin at a cost of $20.00.",
   SHARED("parts A and B"), "Start on the Inventory Value report (Reports in the top bar, then Inventory Value), with the as-of date on today."],
  ["Pick the test location only in the Location filter.", "Type the shared start of the part numbers in the report's Search box."],
  [["The report shows the test location only."],
   ["Exactly one row is listed: part A, with Qty 4.00, Unit Cost $10.00 and Total Cost $40.00 (4 × $10.00 = $40.00).", "There is no row for part B.",
    "The Totals row reads Qty 4.00 and Total Cost $40.00: part B's 3 × $20.00 = $60.00 is not added, so the total is $40.00, not $100.00."]],
  ["S4-R9", "ACC-2"],
  design=dict(boards=["5.3"]))
