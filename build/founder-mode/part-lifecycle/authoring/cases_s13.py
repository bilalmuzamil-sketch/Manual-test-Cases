"""Story 13 — The Part Dialog (SV-10826). Section 20480.
Phase C, 27 Oct 2026: every live case rewritten top to bottom against PRD v33 in the QA lead's pattern (Rule 117 fourteenth and
fifteenth amendments; Rules 134-137). Splits (Rule 136): S13-03b (the core takes the new number; held on Q1, S13-03 no longer held),
S13-04b / S13-12b (the singular message and the one-location part), S13-18b (received lines and accepted bills keep the old number),
S13-18c (a hand-typed line keeps its number), S13-22b (a hand-typed line is received under its own number). S13-13 no longer checks the
core (S5-18 does, held on Q1), so it is not held. New: S13-45 (v33 S13-N1a look-alike rename at another location, Chris Ward 23 Oct),
S13-46 ("This part could not be activated", feedback row 26), S13-47 (Story 13 context note: Inventory Value for a date before a rename
shows the old number). NO MANUAL CASE (pc_common.py): S13-R19d (public API), S13-N1b (core renamed on its own), S13-N8 (re-point).
The 14 Oct "not checked by hand" lines are gone (L-14)."""
from pllib import C, PO_HOLD, HOLD, DESIGN_HOLD
from common import *
from pc_common import *

WRITTEN = True
REPLACE_NEW = "Replace the Part Number with the new number."
NEWNUM_X = "Use a new part number that no part and no Part Library entry has yet, and that does not contain part A's number."
PO_LINE = "Click Purchase Orders in the left menu."
TOINV_B = "Click Inventory in the left menu."
INACT = "Click Inactive under Part Status."
ACT = "Click Active under Part Status."
DEACT_CONF = "Click Deactivate in the confirmation."
ACT_CONF = "Click Activate in the confirmation."
CANCEL_EDIT = "Click Cancel in Edit Inventory Part."
RECV = ["Click Receive.", "Type an invoice number in the invoice number field.", "Type 10.00 as the cost.", "Type 20.00 as the sell price."]
TECH_TRAP = ("TECH", "Phase 6 frontend changes, Delete trap", "It stays enabled and no-ops, so the S13-R27/R28 tooltip fires")
TECH_Q2 = ("TECH", "§1 Clarifications, Q2 S13-N1 rename refusal", "Exact (same characters and case), like create's link rule.")
JIRA_N1A = ("JIRA", "SV-10826, comment, Chris Ward, 23 Oct 2026",
            "Refuse when any location that stocks the entry already has a part matching the new number (ignoring case and punctuation).")
NOBOARD = "no board draws this flow; the expected results above come from the quotes above."
IMPORTED = "The file is ready to import."

C("S13-01", "S13", "The part window title row shows Active or Inactive beside the close X",
  [ADMIN, "Have an active part, part A, and an inactive part, part B, at the test location.", START],
  ["Click New Inventory Part.", "Click the X at the right end of the title row.", TYPE_A, ROW_A, "Click the X at the right end of the title row.",
   "Click the Inactive tab.", TYPE_B, ROW_B],
  [["The window is titled \"New Inventory Part\". A thin line runs under the title row, with the close X at its right end.", "No status pill shows in the title row."],
   ["The window closes."], ["Part A is listed."],
   ["The window is titled \"Edit Inventory Part\", with a thin line under the title row and a green pill reading \"Active\" beside the close X."],
   ["The window closes."], ["The Inactive tab is selected."], ["Part B is listed."],
   ["The title row shows a grey pill reading \"Inactive\" beside the close X."]],
  ["S13-R1", "S13-R2", "S13-R3", "S9-R14"],
  design=dict(boards=["1.1", "2.1", "3.6"], words=[note("Edit Inventory Part for FF5507"), note("The badge reads Inactive")]))

C("S13-02", "S13", "Editing shows Description and Part Number as plain text fields",
  [ADMIN, "Have a part, part A, at the test location.", START],
  [TYPE_A, ROW_A, "Click at the end of the Part Number text.", "Type X.", "Click at the end of the Description text.", "Type X.", CANCEL, ROW_A],
  [["Part A is listed."],
   ["The first two fields are Description, holding part A's description, and Part Number, holding part A's number.",
    "Both are plain text boxes, with no edit button and no Confirm or Cancel buttons beside them."],
   ["The cursor is at the end of the part number."], ["Part Number takes the X straight away: it reads part A's number followed by X."],
   ["The cursor is at the end of the description."], ["Description takes the X straight away."],
   ["The window closes without saving."], ["The fields read part A's description and number again, without the X."]],
  ["S13-R11"],
  design=dict(boards=["2.1"]))

C("S13-03", "S13", "Saving a new part number renames the part in place",
  [ADMIN_TWO, "Create a part, part A, for this test at the test location and at location B under the same part number, with 3 in its default bin at the test location.",
   "Set part A's Sell Price to a new value once before the test, so its Part History already has an entry.", NEWNUM_X, START],
  [TYPE_A, ROW_A, REPLACE_NEW, SAVE, "Type the new number in the Search box.", CLOCK_A, PARTS, TO_PL, "Type part A's old part number in the Search box.",
   "Replace the search text with the new number.", "Click the row for the new number.", TO_B, PARTS, TOINV_B, "Type the new number in the Search box."],
  [["Part A is listed."], ["Edit Inventory Part opens for part A."], ["Part Number shows the new number."],
   ["The window closes and the change is saved."],
   ["One row is listed: part A under the new number, with the same description and the same bin with 3."],
   ["Part History still shows the earlier Sell Price entry, plus a new entry \"Part number updated | Original number:\" with the old number, then "
    "\"| New number:\" with the new number: it is the same part, with its history kept."],
   ["The Parts left menu shows Part Library."], ["The Part Library page opens."],
   ["No entry has the old number any more."], ["Exactly one entry has the new number: no new entry was made."],
   ["The entry's Parts table lists both the test location and location B under Workplace."],
   ["The location selector shows location B."], ["The Parts left menu shows Inventory."], ["Location B's Inventory page opens."],
   ["At location B part A also reads the new number."]],
  ["S13-R18", "S10-R23", "FO-9", "KD-2"],
  design=dict(boards=["2.2", "2.3", "2.4", "2.5"], words=[note("The same part is renamed in place."), note("At Lethbridge the same part now reads")]))

C("S13-03b", "S13", "A renamed part's core takes the same part number",
  [ADMIN, "Create a part, part A, for this test with a Core Charge of $15.00, so it has a core.", NEWNUM_X, START_A],
  [ROW_A, REPLACE_NEW, SAVE, "Open the core's own Part History page."],
  [["Edit Inventory Part opens for part A."], ["Part Number shows the new number."], ["The window closes and part A's row shows the new number."],
   ["The core's own Part History page shows the new number as its part number.",
    "Its newest entry reads \"Part number updated | Original number:\" with the old number, then \"| New number:\" with the new number: the core took the same number."]],
  ["S13-R18", "S10-R26", "S5-E3"], part_of="S13-03",
  marker=PO_HOLD("Q1", "how a core's own Part History page is opened"),
  design=dict(note="no board draws a core; the expected results above come from the quotes above."))

C("S13-04", "S13", "Changing the part number warns how many other locations it changes",
  [ADMIN_THREE, "Have a part, part A, at the test location, at location B (active there) and at location C (inactive there), under the same part number.", START],
  [TYPE_A, ROW_A, "Click at the end of the Part Number.", "Type X.", "Press Backspace once.", "Click at the start of the Part Number.", "Type two spaces.", CANCEL],
  [["Part A is listed."], ["Edit Inventory Part opens with no message under Part Number."], ["The cursor is at the end of the part number."],
   ["Under Part Number the window shows \"This also changes the part number at 2 other locations.\" (location B, active, + location C, inactive = 2: a part inactive at another location still counts)."],
   ["The number reads as saved again and the message goes away."], ["The cursor is at the start of the part number."],
   ["No message shows: spaces before the number are not a change."], ["The window closes without saving."]],
  ["S13-R16", "S13-R17", "UFS-12"],
  design=dict(boards=["2.2"], words=[note("Description becomes")]))

C("S13-04b", "S13", "The part number warning says 1 other location, or nothing for one location",
  [ADMIN_TWO, "Have a part, part B, at the test location and at location B under the same part number.", "Have a part, part C, at the test location only.", START],
  [TYPE_B, ROW_B, "Click at the end of the Part Number.", "Type X.", CANCEL, "Type part C's part number in the Search box.", "Click the part C row.",
   "Click at the end of the Part Number.", "Type X.", CANCEL],
  [["Part B is listed."], ["Edit Inventory Part opens for part B."], ["The cursor is at the end of the part number."],
   ["Under Part Number: \"This also changes the part number at 1 other location.\" (location B)."],
   ["The window closes without saving."], ["Part C is listed."], ["Edit Inventory Part opens for part C."], ["The cursor is at the end of the part number."],
   ["No message shows under Part Number, because part C is stocked at no other location (part B's window showed one for the same change)."],
   ["The window closes without saving."]],
  ["S13-R16", "UFS-12"], part_of="S13-04",
  design=dict(boards=["2.2"]))

C("S13-05", "S13", "A number that another Part Library entry has exactly is refused",
  [ADMIN_TWO, "Create a part, part A, for this test at the test location.",
   "Create a part, part B, for this test at location B only, so its separate Part Library entry is one the test location does not stock.", START],
  [TYPE_A, ROW_A, "Replace the Part Number with part B's number, typed exactly.", SAVE, WAIT5, CANCEL, TO_PL, TYPE_A, "Replace the search text with part B's part number."],
  [["Part A is listed."], ["Edit Inventory Part opens for part A."], ["Part Number shows part B's number."],
   ["Nothing is saved and the window stays open.",
    "A red message reads \"Part number\" followed by part B's number and \"already belongs to another part in the Part Library.\", with a second, smaller line \"Please try to resolve this.\""],
   ["The red message has gone on its own after about 3 seconds, and the window is still open."],
   ["The window closes."], ["The Part Library page opens."], ["Part A's entry is listed with its own number, unchanged."],
   ["Part B's entry (stocked at location B) is listed, unchanged: there are still two entries."]],
  ["S13-N1", "KD-6", "CN-S13-3", "UFS-13", TECH_Q2],
  design=dict(boards=["2.2"]))

C("S13-06", "S13", "Edit Inventory Part lists its fields in the set order",
  [ADMIN, "Have an active tracked part, part A, at the test location.", START],
  [TYPE_A, ROW_A, "Scroll the window from top to bottom."],
  [["Part A is listed."], ["Edit Inventory Part opens for part A."],
   ["The fields appear in this order: Description, Part Number, Part Status (Active / Inactive), Vendor, Category, Manufacturer, Average Cost, Sell Price, "
    "Core Charge, Inventory Tracking (the switch \"Track quantities and cost of goods\", then Min and Max), Tags, and Inventory (the bin rows, then \"Add Bin Location\").",
    "\"Add Bin Location\" has a plus icon before its label."]],
  ["S13-R4", "S13-R5"],
  design=dict(boards=["2.1", "3.1"], words=[note("Part Status, Active or Inactive, sits under Part Number.")]))

C("S13-07", "S13", "New Inventory Part lists its fields in the set order",
  [ADMIN, START],
  ["Click New Inventory Part.", "Scroll the window from top to bottom.", CANCEL],
  [["The \"New Inventory Part\" window opens."],
   ["The fields appear in this order: Description, Part Number, Vendor, Category, Manufacturer, Cost, Sell Price, Core Charge, Inventory Tracking "
    "(the switch, then Min and Max), Tags, and Inventory (the bin row, then \"Add Bin Location\").",
    "There is no Part Status, and the cost field reads \"Cost\", not \"Average Cost\"."],
   ["The window closes and no part is created."]],
  ["S13-R4"],
  design=dict(boards=["1.1"], words=[note("Description first, then Part Number.")]))

C("S13-08", "S13", "Cost and price fields show only to a user who can see financial data",
  [ADMIN, "Use a second browser, or a private window, signed in at the test location as user B, whose role has 'Part Library & Inventory → View', "
   "'Part Library & Inventory → Create & Edit' and 'Part Library & Inventory → Delete' but not See Financial Data.",
   "Have a tracked part, part A, at the test location.", "Start in both browsers on the Inventory page, on the Active tab."],
  ["In browser 1, type part A's part number in the Search box.", "In browser 1, click the part A row.", "In browser 1, click Cancel.",
   "In browser 2, as user B, type part A's part number in the Search box.", "In browser 2, click the part A row.",
   "In browser 2, click the Track quantities and cost of goods switch.", "In browser 2, click the switch again.", "In browser 2, click Cancel.",
   "In browser 2, click New Inventory Part."],
  [["Part A is listed in browser 1."], ["The Admin sees Average Cost, Sell Price and Core Charge in Edit Inventory Part."], ["The window closes."],
   ["Part A is listed in browser 2."],
   ["User B sees no Average Cost, Sell Price or Core Charge field; Description, Part Number, Vendor and Category show as for the Admin."],
   ["Min and Max disappear."], ["Min and Max show again."], ["The window closes without saving."],
   ["User B sees no Cost, Sell Price or Core Charge field in New Inventory Part; Description, Part Number, Vendor and Category show."]],
  ["S13-R4a"],
  design=dict(boards=["1.1", "1.6"]))

C("S13-09", "S13", "The part window footer shows Delete Part, Cancel and Save",
  [ADMIN, "Have a part, part A, at the test location.", START],
  [TYPE_A, ROW_A, "Scroll to the bottom of the window.", CANCEL],
  [["Part A is listed."], ["Edit Inventory Part opens for part A."],
   ["A thin line runs above the footer.", "\"Delete Part\" sits at the left: a red button with a white trash icon and a white label.",
    "At the right sit Cancel, a white button with a grey outline and a dark label, and then Save, a blue button with a white label."],
   ["The window closes without saving."]],
  ["S13-R6", "S13-R7", "S13-R8", "S13-R9"],
  design=dict(boards=["2.1", "3.1"]))

C("S13-10", "S13", "Cancel closes the part window without saving",
  [ADMIN, "Create a part, part A, for this test with description 1 and a Sell Price of $20.00.", "Use a different description, description 2.", START],
  [TYPE_A, ROW_A, "Replace the Description with description 2.", "Replace the Sell Price with 99.00.", CANCEL, ROW_A],
  [["Part A is listed with description 1."], ["Edit Inventory Part opens for part A."], ["Description shows description 2."], ["Sell Price shows 99.00."],
   ["The window closes and the part A row still shows description 1."],
   ["The fields read description 1 and Sell Price 20.00: nothing was saved."]],
  ["S13-R8"],
  design=dict(boards=["2.1"]))

C("S13-11", "S13", "Delete Part shows only on an existing part, to a user with Delete",
  [ADMIN, NO_DELETE_B, "Have a part, part A, at the test location.", "Start in both browsers on the Inventory page, on the Active tab."],
  ["In browser 1, click New Inventory Part.", "In browser 1, click Cancel.", "In browser 1, type part A's part number in the Search box.",
   "In browser 1, click the part A row.", "In browser 1, click Cancel.", "In browser 2, as user B, type part A's part number in the Search box.",
   "In browser 2, click the part A row."],
  [["The New Inventory Part footer shows only Cancel and Save: there is no Delete Part."], ["The window closes."], ["Part A is listed."],
   ["The Edit Inventory Part footer shows Delete Part at the left, with Cancel and Save at the right."], ["The window closes."],
   ["Part A is listed in browser 2."], ["User B sees Cancel and Save in the footer and no Delete Part button."]],
  ["S13-R10", "S8-R12"],
  design=dict(boards=["1.1", "2.1"]))

C("S13-12", "S13", "Changing the description warns how many other locations it changes",
  [ADMIN_THREE, "Have a part, part A, at the test location, at location B (active there) and at location C (inactive there), under the same part number.", START],
  [TYPE_A, ROW_A, "Click at the end of the Description.", "Type X.", "Press Backspace once.", "Type two spaces.", CANCEL],
  [["Part A is listed."], ["Edit Inventory Part opens with no message under Description."], ["The cursor is at the end of the description."],
   ["Under Description the window shows \"This also changes the description at 2 other locations.\" (location B, active, + location C, inactive = 2: a part inactive at another location still counts)."],
   ["The description reads as saved again and the message goes away."], ["No message shows: spaces after the text are not a change."],
   ["The window closes without saving."]],
  ["S13-R12", "S13-R13", "UFS-11", ("PO", "Chris Ward, 9 Oct 2026, answer 5", "A) Yes, count inactive parts too, same as part numbers. Added to S13-R13.")],
  design=dict(boards=["2.2"], words=[note("Description becomes")]))

C("S13-12b", "S13", "The description warning says 1 other location, or nothing for one location",
  [ADMIN_TWO, "Have a part, part B, at the test location and at location B under the same part number.", "Have a part, part C, at the test location only.", START],
  [TYPE_B, ROW_B, "Click at the end of the Description.", "Type X.", CANCEL, "Type part C's part number in the Search box.", "Click the part C row.",
   "Click at the end of the Description.", "Type X.", CANCEL],
  [["Part B is listed."], ["Edit Inventory Part opens for part B."], ["The cursor is at the end of the description."],
   ["Under Description: \"This also changes the description at 1 other location.\" (location B)."],
   ["The window closes without saving."], ["Part C is listed."], ["Edit Inventory Part opens for part C."], ["The cursor is at the end of the description."],
   ["No message shows under Description, because part C is stocked at no other location (part B's window showed one for the same change)."],
   ["The window closes without saving."]],
  ["S13-R12", "UFS-11"], part_of="S13-12",
  design=dict(boards=["2.2"]))

C("S13-13", "S13", "Saving a new description changes it at every location",
  [ADMIN_TWO, "Create a part, part A, for this test at the test location and at location B under the same part number, with description 1.",
   "Use a new description, description 2.", START],
  [TYPE_A, ROW_A, "Replace the Description with description 2.", SAVE, TO_PL, TYPE_A, TO_B, PARTS, TOINV_B, TYPE_A],
  [["Part A is listed with description 1."], ["Edit Inventory Part opens for part A."], ["Description shows description 2."],
   ["The window closes and the test location's part A row shows description 2."],
   ["The Part Library page opens."], ["Part A's one entry shows description 2."],
   ["The location selector shows location B."], ["The Parts left menu shows Inventory."], ["Location B's Inventory page opens."],
   ["At location B part A also shows description 2."]],
  ["S13-R14", "FO-9", "OOS-5"],
  design=dict(boards=["2.3", "2.5"], words=[note("At Lethbridge the same part now reads")]))

C("S13-14", "S13", "A number that differs from another entry only in letter case is accepted",
  [ADMIN_TWO, "Create a part, part A, for this test at the test location only.",
   "Create a part, part B, for this test at location B only, with its part number in capital letters, so it is a separate entry the test location does not stock.", START],
  [TYPE_A, ROW_A, "Replace the Part Number with part B's number in small letters.", SAVE, TO_PL, TYPE_B],
  [["Part A is listed."], ["Edit Inventory Part opens for part A."], ["Part Number shows part B's number in small letters."],
   ["The change is saved and the window closes, and part A's row shows the small-letter number."],
   ["The Part Library page opens."],
   ["Two entries are listed: part B's (stocked at location B), unchanged in capital letters, and the small-letter one, which is renamed part A."]],
  ["S13-N1", "KD-6", TECH_Q2,
   ("TECH", "Phase 6 unit tests, PartLibraryNumberCollisionCheckerTest", "\"brake01\" vs \"BRAKE-01\" allowed; \"BRAKE-01\" refused; own core excluded")],
  design=dict(boards=["2.2"]))

C("S13-15", "S13", "Description and Part Number cannot be left empty when editing",
  [ADMIN, "Create a part, part A, for this test.", START],
  [TYPE_A, ROW_A, "Clear the Description completely.", "Clear the Part Number completely.", SAVE, CANCEL, ROW_A],
  [["Part A is listed."], ["Edit Inventory Part opens for part A."], ["Description is empty."], ["Part Number is empty."],
   ["\"Description is a required field\" shows under Description and \"Part number is a required field\" under Part Number.",
    "The part is not saved: the window stays open."],
   ["The window closes."], ["The fields still read part A's description and number."]],
  ["S13-N2", "KD-3"],
  design=dict(boards=["1.2"], words=[note("Every empty required field shows its own error")]))

C("S13-16", "S13", "Saving with the part number unchanged leaves the number and open work alone",
  [ADMIN, "Create a part, part A, for this test.", "Create an open purchase order for this test, purchase order 1, from any vendor, with a line for part A picked from the lookup, 2 ordered and none received.", START],
  [TYPE_A, ROW_A, "Replace the Sell Price with 22.00.", SAVE, CLOCK_A, PARTS, TO_PL, TYPE_A, PO_LINE, "Open purchase order 1."],
  [["Part A is listed."], ["Edit Inventory Part opens for part A."], ["Sell Price shows 22.00."], ["The change is saved and the window closes."],
   ["Part History's newest entry is the Sell Price change, and it has no \"Part number updated\" entry."],
   ["The Parts left menu shows Part Library."], ["The Part Library page opens."], ["Exactly one entry is listed, with part A's number."],
   ["The Purchase Orders list opens."], ["Purchase order 1's line still reads part A's number."]],
  ["S13-N3", "S7-N5b"],
  design=dict(boards=["2.1"]))

C("S13-17", "S13", "Adding spaces around the part number is not a change",
  [ADMIN, "Create a part, part A, for this test.", START],
  [TYPE_A, ROW_A, "Click at the start of the Part Number.", "Type two spaces.", "Click at the end of the Part Number.", "Type two spaces.", SAVE, CLOCK_A,
   PARTS, TOINV_B, TYPE_A, ROW_A],
  [["Part A is listed."], ["Edit Inventory Part opens for part A."], ["The cursor is at the start of the part number."], ["Two spaces sit before the number."],
   ["The cursor is at the end of the part number."], ["Two spaces sit after the number."],
   ["The save goes through and the window closes."],
   ["Part History opens for part A, and it lists no \"Part number updated\" entry."],
   ["The Parts left menu shows Inventory."], ["The Inventory page opens."], ["Part A is listed under its number, with no spaces."],
   ["Part Number reads part A's number exactly as it was saved, with no spaces."]],
  ["S13-N3a"],
  design=dict(boards=["2.1"]))

C("S13-18", "S13", "A rename carries over to open purchase order lines at every location",
  [ADMIN_TWO, "Create a part, part A, for this test at the test location, with 4 on hand, and at location B under the same part number.", "Create an open purchase order for this test at the test location, purchase order 1, from any vendor, with a line for part A picked from the lookup, 2 ordered and none received.",
   "Create an open purchase order for this test at location B, purchase order 2, from any vendor, with a line for part A picked from the lookup, 4 ordered and none received.",
   NEWNUM_X, START],
  [TYPE_A, ROW_A, REPLACE_NEW, SAVE, PO_LINE, "Open purchase order 1.", TO_B, PARTS, PO_LINE, "Open purchase order 2.", TO_HOME, PARTS, PO_LINE,
   "Open purchase order 1."] + RECV + ["Type 2 as the received quantity.", "Click Receive on the Receive screen.", TOINV_B, "Type the new number in the Search box."],
  [["Part A is listed with 4 on hand."], ["Edit Inventory Part opens for part A."], ["Part Number shows the new number."], ["The rename is saved and the window closes."],
   ["The Purchase Orders list opens."], ["Purchase order 1's open line now reads the new number."],
   ["The location selector shows location B."], ["The Parts left menu shows Purchase Orders."], ["Location B's Purchase Orders list opens."],
   ["Purchase order 2's open line at location B reads the new number: the rename reaches every location."],
   ["The location selector shows the test location."], ["The Parts left menu shows Purchase Orders."], ["The Purchase Orders list opens."],
   ["Purchase order 1 opens with its line under the new number."],
   ["The Receive screen opens, with the line under the new number."], ["The invoice number shows what you typed."], ["The cost shows 10.00."],
   ["The sell price shows 20.00."], ["The received quantity shows 2."],
   ["Receiving finds the renamed part and the delivery is accepted."], ["The Inventory page opens."],
   ["Part A is listed under the new number with 6 Available (4 + 2 = 6)."]],
  ["S13-R19", "KD-16", "TERM-6"],
  design=dict(boards=["2.3"]))

C("S13-18b", "S13", "Received purchase order lines and accepted vendor bills keep the old number",
  [ADMIN, "Create a part, part A, for this test.", "Create a purchase order for this test, purchase order 1, from any vendor, with a line for part A picked from the lookup, 1 ordered and fully received on a vendor invoice.",
   NEWNUM_X, START],
  [TYPE_A, ROW_A, REPLACE_NEW, SAVE, PO_LINE, "Open purchase order 1.", "Click Vendor Invoices in the left menu.", "Open the vendor invoice of purchase order 1's receipt."],
  [["Part A is listed."], ["Edit Inventory Part opens for part A."], ["Part Number shows the new number."],
   ["The rename is saved, the window closes and part A's row shows the new number."],
   ["The Purchase Orders list opens."], ["Purchase order 1's fully received line still reads the old number: completed records keep their number."],
   ["The Vendor Invoices list opens."], ["The accepted vendor invoice still reads the old number."]],
  ["S13-R19b", "CN-S13-2", "KD-16"], part_of="S13-18",
  design=dict(note=NOBOARD))

C("S13-18c", "S13", "A purchase order line typed by hand with the old number keeps its number",
  [ADMIN, "Create a part, part A, for this test.", "Create an open purchase order for this test, purchase order 1, from any vendor, with two lines, neither received: one for part A picked from the lookup, "
   "and one where part A's number was typed by hand and added as typed, with no link to the part.", NEWNUM_X, START],
  [TYPE_A, ROW_A, REPLACE_NEW, SAVE, PO_LINE, "Open purchase order 1."],
  [["Part A is listed."], ["Edit Inventory Part opens for part A."], ["Part Number shows the new number."],
   ["The rename is saved, the window closes and part A's row shows the new number."], ["The Purchase Orders list opens."],
   ["The line picked from the lookup reads the new number.",
    "The line typed by hand still reads the old number: it only shares the number and has no link to part A."]],
  ["S13-R19a", "S13-R19"], part_of="S13-18",
  design=dict(note=NOBOARD))

C("S13-19", "S13", "A rename carries over to open part requests",
  [ADMIN, "Create a part, part A, for this test with 5 on hand.",
   "Create a work order for this test, work order 1, with a line holding two part requests for part A: one requested from the Part Library result and not yet received, "
   "and one picked from stock, so it is received.", NEWNUM_X, START],
  [TYPE_A, ROW_A, REPLACE_NEW, SAVE, "Click Work Orders in the top bar.", "Open work order 1.", "Click the Parts tab.", "Click Order on the open part request's row.",
   PARTS, PO_LINE, "Open the newest purchase order."],
  [["Part A is listed."], ["Edit Inventory Part opens for part A."], ["Part Number shows the new number."], ["The rename is saved and the window closes."],
   ["The Work Orders list opens."], ["Work order 1 opens."],
   ["The open part request reads the new number, and the one picked from stock, already received, still reads the old number."],
   ["Ordering finds the renamed part and goes through."], ["The Parts left menu shows Purchase Orders."], ["The Purchase Orders list opens."],
   ["The new purchase order's line reads the new number."]],
  ["S13-R19", "TERM-6", "CN-S13-2"],
  design=dict(note=NOBOARD))

C("S13-20", "S13", "A rename carries over to canned jobs that hold the part",
  [ADMIN, "Create a part, part A, for this test with 5 on hand.", "Create a work order for this test, work order 1, with a line holding part A picked from stock.",
   "Create a canned job for this test, canned job A, saved from that line, so it holds part A.", NEWNUM_X, START],
  [TYPE_A, ROW_A, REPLACE_NEW, SAVE, "Click Work Orders in the top bar.", "Open work order 1.", "Click New Line.", "Type canned job A's name in Title.",
   "Pick canned job A in the list.", "Click Save & Close."],
  [["Part A is listed."], ["Edit Inventory Part opens for part A."], ["Part Number shows the new number."], ["The rename is saved and the window closes."],
   ["The Work Orders list opens."], ["Work order 1 opens."],
   ["The New Line window opens."], ["Canned job A is offered."], ["Canned job A is picked."],
   ["The canned job is added with its part under the new number, and no warning about parts left out appears."]],
  ["S13-R19", "CN-S13-2", "KD-16"],
  design=dict(boards=["6.4"]))

C("S13-21", "S13", "A rename carries over to vendor returns that are not completed",
  [ADMIN, "Create a part, part A, for this test with 5 on hand.", "Create a vendor return for this test, return A, for part A to any vendor, saved and not completed.",
   "Create a vendor return for this test, return B, for part A to any vendor, completed (accepted by the vendor).", NEWNUM_X, START],
  [TYPE_A, ROW_A, REPLACE_NEW, SAVE, "Click Returns in the left menu.", "Open return A.", "Click Returns in the left menu.", "Open return B."],
  [["Part A is listed."], ["Edit Inventory Part opens for part A."], ["Part Number shows the new number."], ["The rename is saved and the window closes."],
   ["The Returns list opens."], ["Return A, not completed, reads the new number."], ["The Returns list opens."],
   ["Return B, completed, still reads the old number."]],
  ["S13-R19", "TERM-6", "CN-S13-2"],
  design=dict(boards=["6.6"]))

C("S13-22", "S13", "A delivery opened before a rename is received under the new number",
  [ADMIN, "Create a part, part A, for this test with 3 on hand.", "Create an open purchase order for this test, purchase order 1, from any vendor, with a line for part A picked from the lookup, 2 ordered and none received.",
   NEWNUM_X, TWO_TABS, "Start in browser tab 1 on purchase order 1 (Parts, then Purchase Orders, then open purchase order 1)."],
  ["In tab 1, click Receive.", "Open a second browser tab on the same ShopView address.", "In tab 2, click Parts in the top bar.",
   "In tab 2, click Inventory in the left menu.", "In tab 2, type part A's part number in the Search box.", "In tab 2, click the part A row.",
   "In tab 2, replace the Part Number with the new number.", "In tab 2, click Save.", "Switch back to tab 1 without reloading it.",
   "In tab 1, type an invoice number in the invoice number field.", "In tab 1, type 10.00 as the cost.", "In tab 1, type 2 as the received quantity.",
   "In tab 1, click Receive on the Receive screen.", "In tab 2, type the new number in the Search box.", "In tab 2, click Part Library in the left menu.",
   "In tab 2, type part A's old part number in the Search box.", "In tab 2, click Vendor Invoices in the left menu.", "In tab 2, open the vendor invoice you just received."],
  [["The Receive screen opens in tab 1 for purchase order 1, with the line under part A's old number."], ["A second tab opens."], ["Tab 2 shows the Parts left menu."],
   ["Tab 2 shows the Inventory page."], ["Part A is listed in tab 2."], ["Edit Inventory Part opens for part A."], ["Part Number shows the new number."],
   ["The rename is saved in tab 2."], ["Tab 1 still shows the Receive screen opened before the rename."], ["The invoice number shows what you typed."],
   ["The cost shows 10.00."], ["The received quantity shows 2."], ["The delivery is accepted."],
   ["Part A is listed under the new number with 5 Available (3 + 2 = 5)."], ["The Part Library page opens."],
   ["No entry is listed for the old number: the receipt made no Part Library entry for it."],
   ["The Vendor Invoices list opens."],
   ["The vendor invoice's line reads the new number, although the Receive screen was opened before the rename."]],
  ["S13-R19c", ("TECH", "§3 Technical Decisions, D30", "S13-R19c: ReceiveADelivery.php:88,108 take the number posted by the Receive screen; for a line linked to an order item with a part_id, the handler resolves the number from that part's current entry instead, so a rename between opening and accepting is honored and no entry is created for the old number.")],
  design=dict(note=NOBOARD))

C("S13-22b", "S13", "A hand-typed purchase order line is received under its own number",
  [ADMIN, "Create a part, part A, for this test.", "Create an open purchase order for this test, purchase order 1, from any vendor, with one line where part A's number was typed by hand and added as typed, 1 ordered and none received.",
   NEWNUM_X, START],
  [TYPE_A, ROW_A, REPLACE_NEW, SAVE, PO_LINE, "Open purchase order 1.", "Click Receive.", "Type an invoice number in the invoice number field.",
   "Type 10.00 as the cost.", "Type 1 as the received quantity.", "Click Receive on the Receive screen.", "Click Vendor Invoices in the left menu.",
   "Open the vendor invoice you just received."],
  [["Part A is listed."], ["Edit Inventory Part opens for part A."], ["Part Number shows the new number."],
   ["The rename is saved, the window closes and part A's row shows the new number."], ["The Purchase Orders list opens."],
   ["Purchase order 1's hand-typed line still reads the old number."], ["The Receive screen opens with the line under the old number."],
   ["The invoice number shows what you typed."], ["The cost shows 10.00."], ["The received quantity shows 1."], ["The line is received."],
   ["The Vendor Invoices list opens."], ["The vendor invoice's line reads the old number: a hand-typed line is received under its own number."]],
  ["S13-R19c", "S13-R19a"], part_of="S13-22",
  design=dict(note=NOBOARD))

C("S13-23", "S13", "Part Status offers Active and Inactive, set to the saved status",
  [ADMIN, "Have an active part, part A, and an inactive part, part B, at the test location.", START],
  [TYPE_A, ROW_A, CANCEL, "Click the Inactive tab.", TYPE_B, ROW_B],
  [["Part A is listed."], ["Under Part Number a \"Part Status\" choice offers two options, Active and Inactive, with Active selected."], ["The window closes."],
   ["The Inactive tab is selected."], ["Part B is listed."], ["Part Status has Inactive selected."]],
  ["S13-R20"],
  design=dict(boards=["3.1", "3.6"], words=[note("Part Status, Active or Inactive, sits under Part Number.")]))

C("S13-24", "S13", "Part Status is disabled for a user without Delete",
  [ADMIN, NO_DELETE_B, "Have an active part, part A, at the test location.", "Start in both browsers on the Inventory page, on the Active tab."],
  ["In browser 2, as user B, type part A's part number in the Search box.", "In browser 2, click the part A row.", "In browser 2, click Inactive under Part Status.",
   "In browser 2, click Cancel.", "In browser 1, type part A's part number in the Search box.", "In browser 1, click the part A row.",
   "In browser 1, click Inactive under Part Status.", "In browser 1, click Cancel."],
  [["Part A is listed in browser 2."], ["Part Status shows Active selected, but the choice is greyed out (disabled)."], ["Nothing changes: Active stays selected."],
   ["The window closes."], ["Part A is listed in browser 1."], ["Part Status shows Active selected, and the choice is enabled."],
   ["For the Admin, Inactive becomes selected."], ["The window closes without saving, and part A stays on the Active tab."]],
  ["S13-R20", "S8-R6"],
  design=dict(boards=["3.1"]))

C("S13-25", "S13", "Picking a different status changes nothing until Save",
  [ADMIN, "Create an active part, part A, for this test.", START_A],
  [ROW_A, INACT, CANCEL, ROW_A],
  [["Edit Inventory Part opens with Active selected under Part Status."],
   ["Inactive is selected and nothing else happens: no confirmation window opens and the title row pill still reads \"Active\"."],
   ["The window closes without asking anything, and part A is still listed on the Active tab."],
   ["Part Status shows Active: the pick was not saved."]],
  ["S13-R21", "KD-10"],
  design=dict(boards=["3.2"], words=[note("Picking a status applies nothing yet.")]))

C("S13-26", "S13", "The status pill keeps the saved status while another is picked",
  [ADMIN, "Have an active part, part A, and an inactive part, part B, at the test location.", START],
  [TYPE_A, ROW_A, INACT, CANCEL, "Click the Inactive tab.", TYPE_B, ROW_B, ACT, CANCEL],
  [["Part A is listed."], ["Edit Inventory Part opens with a green \"Active\" pill in the title row."],
   ["Inactive is selected, and the title row pill still reads \"Active\" in green."], ["The window closes without saving."],
   ["The Inactive tab is selected."], ["Part B is listed."], ["Edit Inventory Part opens with a grey \"Inactive\" pill."],
   ["Active is selected, and the title row pill still reads \"Inactive\" in grey."], ["The window closes without saving."]],
  ["S13-R25"],
  design=dict(boards=["3.2", "3.7"], words=[note("Picking a status applies nothing yet.")]))

C("S13-27", "S13", "Save with a different status asks for confirmation first",
  [ADMIN, "Create an active part, part A, for this test.", START_A],
  [ROW_A, INACT, SAVE, "Click Cancel in the confirmation.", CANCEL_EDIT],
  [["Edit Inventory Part opens for part A."], ["Inactive is selected."],
   ["Before anything is saved, a confirmation titled \"Deactivate part?\" opens over the part window."],
   ["The confirmation closes and the part window is still open."],
   ["The part window closes, and part A is still listed on the Active tab."]],
  ["S13-R21", "S10-R1", "KD-10"],
  design=dict(boards=["3.3"], words=[note("Save raises \"Deactivate part?\"")]))

C("S13-28", "S13", "Confirming Deactivate saves the edits and shows Part deactivated.",
  [ADMIN, "Create an active part, part A, for this test with a Sell Price of $20.00.", START_A],
  [ROW_A, "Replace the Sell Price with 25.00.", INACT, SAVE, DEACT_CONF, "Click the Inactive tab.", ROW_A],
  [["Edit Inventory Part opens for part A."], ["Sell Price shows 25.00."], ["Inactive is selected."], ["The \"Deactivate part?\" confirmation opens."],
   ["Both windows close, and a green message \"Part deactivated.\" appears and goes away on its own.", "Part A leaves the Active tab."],
   ["The Inactive tab lists part A."],
   ["Sell Price reads 25.00, so the edit was saved, and the title row pill reads \"Inactive\"."]],
  ["S13-R22", "UFS-24"],
  design=dict(boards=["3.3", "3.4", "3.5"], words=[note("Every change in the dialog is saved")]))

C("S13-29", "S13", "Confirming Activate saves the edits and shows Part activated.",
  [ADMIN, "Create a part, part A, for this test with a Sell Price of $20.00, and set it inactive.", START_INACTIVE],
  [TYPE_A, ROW_A, "Replace the Sell Price with 27.00.", ACT, SAVE, ACT_CONF, "Click the Active tab.", ROW_A],
  [["Part A is listed on the Inactive tab."], ["Edit Inventory Part opens for part A."], ["Sell Price shows 27.00."], ["Active is selected."],
   ["A confirmation titled \"Activate part?\" opens."],
   ["Both windows close, and a green message \"Part activated.\" appears and goes away on its own.", "Part A leaves the Inactive tab."],
   ["The Active tab lists part A."],
   ["Sell Price reads 27.00 and the title row pill reads \"Active\"."]],
  ["S13-R22", "UFS-25"],
  design=dict(boards=["3.7"], words=[note("Active picked, then Save")]))

C("S13-30", "S13", "Cancelling the confirmation saves nothing and keeps the picked status",
  [ADMIN, "Create an active part, part A, for this test with a Sell Price of $20.00.", START_A],
  [ROW_A, "Replace the Sell Price with 25.00.", INACT, SAVE, "Click Cancel in the confirmation.", CANCEL_EDIT, ROW_A],
  [["Edit Inventory Part opens for part A."], ["Sell Price shows 25.00."], ["Inactive is selected."], ["The \"Deactivate part?\" confirmation opens."],
   ["The confirmation closes and the part window is back, with Inactive still selected and Sell Price still 25.00."],
   ["The part window closes and part A is still on the Active tab."],
   ["Sell Price reads 20.00 and Part Status shows Active: nothing was saved."]],
  ["S13-R23", "S10-N1"],
  design=dict(boards=["3.3"]))

C("S13-31", "S13", "Saving with the saved status picked asks no confirmation",
  [ADMIN, "Create an active part, part A, for this test.", START_A],
  [ROW_A, "Replace the Sell Price with 23.00.", SAVE, ROW_A, INACT, ACT, "Replace the Sell Price with 24.00.", SAVE, ROW_A],
  [["Edit Inventory Part opens for part A."], ["Sell Price shows 23.00."], ["The part saves and the window closes, with no confirmation window."],
   ["Edit Inventory Part opens again, with Sell Price 23.00."], ["Inactive is selected."], ["Active is selected again, the saved status."],
   ["Sell Price shows 24.00."], ["Again no confirmation window opens: the window closes and part A stays on the Active tab."],
   ["Edit Inventory Part shows Sell Price 24.00 and Part Status Active."]],
  ["S13-R24"],
  design=dict(boards=["3.1"]))

C("S13-32", "S13", "A deactivation refused after the save keeps the confirmation open",
  [ADMIN, "Create an active part, part A, for this test with a Sell Price of $20.00.", TWO_TABS,
   "Start in browser tab 1 on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  ["In tab 1, click the part A row.", "In tab 1, replace the Sell Price with 25.00.", "In tab 1, click Inactive under Part Status.",
   "Open a second browser tab on the same ShopView address.", "In tab 2, click Parts in the top bar.", "In tab 2, click Inventory in the left menu.",
   "In tab 2, type part A's part number in the Search box.", "In tab 2, click the part A row.", "In tab 2, click Inactive under Part Status.",
   "In tab 2, click Save.", "In tab 2, click Deactivate in the confirmation.", "Switch back to tab 1 without reloading it.", "In tab 1, click Save.",
   "In tab 1, click Deactivate in the confirmation.", "Wait 10 seconds.", "Click Close on the red message.", "In tab 1, click Cancel in the confirmation.",
   "In tab 1, click Cancel in Edit Inventory Part.", "In tab 1, click the Inactive tab.", "In tab 1, click the part A row."],
  [["Edit Inventory Part opens for part A in tab 1."], ["Sell Price shows 25.00."], ["Inactive is selected."], ["A second tab opens."],
   ["Tab 2 shows the Parts left menu."], ["Tab 2 shows the Inventory page."], ["Part A is listed in tab 2."], ["Edit Inventory Part opens in tab 2."],
   ["Inactive is selected in tab 2."], ["The \"Deactivate part?\" confirmation opens in tab 2."],
   ["Tab 2 shows \"Part deactivated.\": part A is now inactive."], ["Tab 1 still shows the part window with Inactive picked."],
   ["The \"Deactivate part?\" confirmation opens in tab 1."],
   ["The confirmation stays open, and a red message reads \"This part could not be deactivated\" with the reason \"Part is already in that state.\""],
   ["The red message is still showing after 10 seconds: it stays until it is closed."], ["The red message closes."],
   ["The confirmation closes."], ["The part window closes."], ["The Inactive tab lists part A."],
   ["The title row pill reads \"Inactive\" and Sell Price reads 25.00: the form was saved before the status change was refused."]],
  ["S13-N4", "S13-R22", "S10-R13a", "UFS-26"],
  design=dict(boards=["3.3"]))

C("S13-33", "S13", "A refused save closes the confirmation and saves nothing",
  [ADMIN_TWO, "Create an active part, part A, for this test at the test location with a Sell Price of $20.00.",
   "Create a part, part B, for this test at location B only, so its separate entry's number is one the test location does not stock.", START_A],
  [ROW_A, "Replace the Part Number with part B's number, typed exactly.", "Replace the Sell Price with 25.00.", INACT, SAVE, DEACT_CONF, CANCEL_EDIT,
   TYPE_A, ROW_A],
  [["Edit Inventory Part opens for part A."], ["Part Number shows part B's number."], ["Sell Price shows 25.00."], ["Inactive is selected."],
   ["The \"Deactivate part?\" confirmation opens."],
   ["The confirmation closes, and the part window shows the refusal \"Part number\" followed by part B's number and \"already belongs to another part in the Part Library.\" (part B is stocked at location B)."],
   ["The part window closes."], ["Part A is still listed on the Active tab under its own number."],
   ["Sell Price reads 20.00 and Part Status reads Active: nothing was saved."]],
  ["S13-N5", "S13-N1"],
  design=dict(boards=["3.3"]))

C("S13-34", "S13", "Delete Part deletes the part at once with no confirmation",
  [ADMIN, "Create a part, part A, for this test, on no work order and with no return or credit.", START_A],
  [ROW_A, "Click Delete Part.", "Click the Inactive tab.", TYPE_A],
  [["Edit Inventory Part opens for part A."],
   ["The window closes straight away, with no confirmation, and part A leaves the Active list."],
   ["The Inactive tab is selected."], ["Part A is not listed on the Inactive tab either: it was deleted, not set inactive."]],
  ["S13-R26"],
  design=dict(boards=["2.1"]))

C("S13-35", "S13", "Delete Part on a part on a work order shows why and does nothing",
  [ADMIN, "Create a part, part A, for this test.", "Create a work order for this test, work order 1, with a line holding part A picked from stock.", START_A],
  [ROW_A, "Hover over Delete Part.", "Click Delete Part.", CANCEL],
  [["Edit Inventory Part opens for part A, with Delete Part shown."], ["A tooltip reads \"Please delete related work order parts first.\" (part A is on work order 1)."],
   ["Nothing happens: the window stays open with part A's values."], ["The window closes and part A is still listed."]],
  ["S13-R27", "UFS-22", TECH_TRAP],
  design=dict(boards=["2.1"]))

C("S13-36", "S13", "Delete Part on a part with an open return shows why and does nothing",
  [ADMIN, "Create a part, part A, for this test with 3 on hand.", "Have a vendor, vendor A.",
   "Create a vendor return for this test, return A, for part A and vendor A, saved and not completed.", START_A],
  [ROW_A, "Hover over Delete Part.", "Click Delete Part.", CANCEL],
  [["Edit Inventory Part opens for part A, with Delete Part shown."],
   ["A tooltip reads \"Please complete or cancel the related return or credit first.\" (return A to vendor A is still open)."],
   ["Nothing happens: the window stays open with part A's values."], ["The window closes and part A is still listed."]],
  ["S13-R28", "UFS-23", TECH_TRAP],
  design=dict(boards=["6.6"]))

C("S13-37", "S13", "Deleting a part that reached a work order meanwhile is refused",
  [ADMIN, "Create a part, part A, for this test with 3 on hand, on no work order.", "Create a work order for this test, work order 1, with a line that has no part on it.",
   TWO_TABS, "Start in browser tab 1 on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  ["In tab 1, click the part A row.", "Open a second browser tab on the same ShopView address.", "In tab 2, click Work Orders in the top bar.",
   "In tab 2, open work order 1.", "In tab 2, click + Add Part in the Parts row of the line.", "In tab 2, type part A's part number in Part Number.",
   "In tab 2, pick the part A result that shows an Inventory Qty.", "In tab 2, click Save Part.", "Switch back to tab 1 without reloading it.",
   "In tab 1, click Delete Part.", WAIT5, "In tab 1, click Cancel."],
  [["Edit Inventory Part opens for part A in tab 1."], ["A second tab opens."], ["Tab 2 shows the Work Orders list."], ["Work order 1 opens in tab 2."],
   ["The \"New Part Request\" window opens."], ["Part A is offered."], ["Part A is picked from stock."], ["Part A is saved onto work order 1's line."],
   ["Tab 1 still shows part A's window, opened before part A reached the work order."],
   ["The delete is refused with a red message \"Inventory part that has a work order part cannot be deleted.\", with the second, smaller line \"Please try to resolve this.\"",
    "No other error message appears beside it."],
   ["The red message has gone on its own after about 3 seconds."], ["The window closes and part A is still listed."]],
  ["S13-N6", "UFS-20", "CN-S13-3"],
  design=dict(note=NOBOARD))

C("S13-38", "S13", "Deleting a part that got an open return meanwhile is refused",
  [ADMIN, "Create a part, part A, for this test with 3 on hand, on no return.", "Have a vendor, vendor A.", TWO_TABS,
   "Start in browser tab 1 on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  ["In tab 1, click the part A row.", "Open a second browser tab on the same ShopView address.", "In tab 2, click Parts in the top bar.",
   "In tab 2, click Returns in the left menu.", "In tab 2, click Create Return.", "In tab 2, pick vendor A as the Vendor.", "In tab 2, pick part A in Part Number.",
   "In tab 2, set Qty To Return to 1.", "In tab 2, click Save Return.", "Switch back to tab 1 without reloading it.", "In tab 1, click Delete Part.", WAIT5,
   "In tab 1, click Cancel."],
  [["Edit Inventory Part opens for part A in tab 1."], ["A second tab opens."], ["Tab 2 shows the Parts left menu."], ["Tab 2 shows the Returns list."],
   ["A new return opens in tab 2."], ["Vendor A is picked."], ["Part A is picked."], ["Qty To Return shows 1."], ["The return is saved and not completed."],
   ["Tab 1 still shows part A's window, opened before the return existed."],
   ["The delete is refused with a red message \"Inventory part with an open return or a pending credit cannot be deleted.\", with the second, smaller line \"Please try to resolve this.\"",
    "No other error message appears beside it."],
   ["The red message has gone on its own after about 3 seconds."], ["The window closes and part A is still listed."]],
  ["S13-N6", "UFS-21", "CN-S13-3"],
  design=dict(boards=["6.6"]))

C("S13-39", "S13", "A number over 50 characters is refused while on an open part request",
  [ADMIN, "Create a part, part A, for this test.",
   "Create a work order for this test, work order 1, with a line holding an open part request for part A, requested and not received.",
   "Create a part, part B, for this test, on no part request.",
   "Use two new part numbers that no part uses, one exactly 51 characters long and one exactly 60 characters long.", START],
  [TYPE_A, ROW_A, "Replace the Part Number with the 51-character number.", SAVE, WAIT5, CANCEL, TYPE_B, ROW_B, "Replace the Part Number with the 60-character number.",
   SAVE, "Type the 60-character number in the Search box."],
  [["Part A is listed."], ["Edit Inventory Part opens for part A."], ["Part Number shows the 51-character number."],
   ["Nothing is saved and the window stays open.",
    "A red message reads \"Part number can't be longer than 50 characters while it's on an open part request.\", with the second, smaller line \"Please try to resolve this.\" (part A is on work order 1's part request)."],
   ["The red message has gone on its own after about 3 seconds."], ["The window closes and part A keeps its number."], ["Part B is listed."],
   ["Edit Inventory Part opens for part B."], ["Part Number shows the 60-character number."],
   ["The window closes: part B saves with the 60-character number, because it is on no open part request."],
   ["Part B is listed under the 60-character number."]],
  ["S13-N7", "UFS-16", "CN-S13-3", ("TECH", "Phase 6 functional tests", "S13-N7 refusal with the exact copy; no open part request → a 60-character rename saves")],
  design=dict(note=NOBOARD),
  claude=["51 characters: ZZAUTOTEST-PL-S13-39-A-XXXXXXXXXXXXXXXXXXXXXXXXXXXX; 60 characters: ZZAUTOTEST-PL-S13-39-B- plus 37 Y (count both)."])

C("S13-40", "S13", "The part window offers no way to move a part to another library entry",
  [ADMIN, "Have a part, part A, at the test location.", START],
  [TYPE_A, ROW_A, "Scroll the window from top to bottom.", CANCEL],
  [["Part A is listed."], ["Edit Inventory Part opens for part A."],
   ["There is no Part Library or Catalog Part field and no way to pick a different library entry: Part Number is a plain text field."],
   ["The window closes without saving."]],
  ["S13-E1", "KD-15", "S7-R2"],
  design=dict(boards=["2.1"]))

C("S13-41", "S13", "The parts import never changes an entry's part number",
  [ADMIN, "Create a part, part A, for this test with its part number in capital letters, Min 1, Max 5 and 3 in bin location A.",
   "Have a parts import file with one row whose part number is part A's number in small letters, with a new description, description 2, Min 2, Max 8, quantity 3 and bin location A, so the row matches part A.",
   START_IMPORT],
  ["Upload the file.", "Run the import.", PARTS, TOINV_B, TYPE_A, TO_PL, TYPE_A],
  [[IMPORTED], ["The import finishes and does not refuse the row."], ["The Parts left menu shows Inventory."], ["The Inventory page opens."],
   ["Still one row for part A: its Part Number still reads part A's number in capital letters, not the small-letter number from the file.",
    "It now shows Min 2, Max 8 and description 2: the row updated this part, with 3 in bin location A."],
   ["The Part Library page opens."], ["One entry is listed, with part A's number unchanged in capital letters."]],
  ["S13-N9", "S7-N7", "OOS-8",
   ("PO", "Chris Ward, 14 Oct 2026, answer 3 b", "b) No. The duplicate check doesn't apply to the import. A matching number updates the part already stocked at the location and is never refused (S7-N7).")],
  design=dict(note="no board draws the import; the expected results above come from the quotes above."))

C("S13-42", "S13", "Re-importing the old number of a case-only rename updates that part",
  [ADMIN, "Create a part, part A, for this test with its part number in capital letters, Min 1, Max 5 and 3 in bin location A, then rename it to the same "
   "number in small letters, so its old number differs from the new one only in letter case.",
   "Have a parts import file with one row whose part number is part A's old number in capital letters, with Min 3, Max 9, quantity 3 and bin location A.",
   START_IMPORT],
  ["Upload the file.", "Run the import.", PARTS, TOINV_B, "Type part A's new number in the Search box.", "Click the Inactive tab.", TO_PL,
   "Type part A's new number in the Search box."],
  [[IMPORTED], ["The import finishes and does not refuse the row."], ["The Parts left menu shows Inventory."], ["The Inventory page opens."],
   ["Still exactly one row, reading part A's small-letter number, now with Min 3 and Max 9 and 3 in bin location A: no second part was added."],
   ["The Inactive tab lists no row for it: the one part A stays on the Active tab."],
   ["The Part Library page opens."], ["One entry is listed, with part A's small-letter number."]],
  ["S13-N9a", "S7-N7"],
  design=dict(note="no board draws the import; the expected results above come from the quotes above."))

C("S13-43", "S13", "Re-importing a fully different old number creates a separate part",
  [ADMIN, "Create a part, part A, for this test with Min 1, Max 5 and 3 in bin location A, then rename it to a fully different number, so its old number "
   "matches no part any more.",
   "Have a parts import file with one row whose part number is part A's old number, with Min 4, Max 10, quantity 2 and bin location A.", START_IMPORT],
  ["Upload the file.", "Run the import.", PARTS, TOINV_B, "Type part A's old number in the Search box.", "Replace the search text with part A's new number.",
   TO_PL, "Type part A's old number in the Search box.", "Replace the search text with part A's new number."],
  [[IMPORTED], ["The import finishes."], ["The Parts left menu shows Inventory."], ["The Inventory page opens."],
   ["A new part is listed under the old number, with Min 4 and Max 10 and 2 in bin location A."],
   ["Renamed part A is untouched under its new number, still with Min 1 and Max 5."],
   ["The Part Library page opens."], ["One entry is listed for the old number."],
   ["One entry is listed for the new number: two entries in all (1 + 1 = 2)."]],
  ["S13-E1", ("TECH", "Phase 6 functional tests, ImportTest", "after a rename, re-importing a row under the old number creates a **separate** part under the old number; the renamed part is untouched")],
  design=dict(note="no board draws the import; the expected results above come from the quotes above."))

C("S13-44", "S13", "Vendor always shows in the part window, for every user",
  [ADMIN, "Use a second browser, or a private window, signed in at the test location as user B, whose role has 'Part Library & Inventory → View' and "
   "'Part Library & Inventory → Create & Edit' but neither 'Part Library & Inventory → Delete' nor See Financial Data.",
   "Have a vendor, vendor A.", "Have a part, part A, at the test location with vendor A as its Vendor.", "Start in both browsers on the Inventory page, on the Active tab."],
  ["In browser 1, click New Inventory Part.", "In browser 1, click Cancel.", "In browser 1, type part A's part number in the Search box.",
   "In browser 1, click the part A row.", "In browser 1, click Cancel.", "In browser 2, as user B, click New Inventory Part.", "In browser 2, click Cancel.",
   "In browser 2, type part A's part number in the Search box.", "In browser 2, click the part A row."],
  [["The New Inventory Part window shows a Vendor field, after Part Number."], ["The window closes."], ["Part A is listed."],
   ["Edit Inventory Part shows the Vendor field, holding vendor A."], ["The window closes."],
   ["User B also sees the Vendor field in New Inventory Part, after Part Number."], ["The window closes."], ["Part A is listed in browser 2."],
   ["User B sees the Vendor field holding vendor A."]],
  ["S13-R4a", "S13-R4", ("JIRA", "SV-10826, acceptance criteria", "Given any screen that opens the part dialog, when it opens, then the Vendor field shows."),
   ("PO", "Chris Ward, 9 Oct 2026, answer 6", "B) None. Vendor always shows. Only the Inventory list opens this window, and it never hides Vendor. S13-R4a updated.")],
  design=dict(boards=["1.1", "2.1"]))

C("S13-45", "S13", "A new number that looks like a part at another location is refused",
  [ADMIN_TWO, "Create a part, part A, for this test at the test location and at location B under the same part number, so a rename reaches location B too.",
   "Create a part, part B, for this test at location B only, so location B stocks a part the new number will look like.",
   "Use a new number for part A that differs from part B's number only by a hyphen or a period, so the two numbers match once punctuation is ignored, but no entry has it exactly.",
   START],
  [TYPE_A, ROW_A, "Replace the Part Number with the look-alike number.", SAVE, WAIT5, CANCEL, TO_B, PARTS, TOINV_B, TYPE_B],
  [["Part A is listed."], ["Edit Inventory Part opens for part A."], ["Part Number shows the look-alike number."],
   ["The save is refused and the window stays open.",
    "A red message reads part B's number followed by \"already exists at\" and location B's name, then a full stop, with a smaller second line \"Please try to resolve this.\"",
    "The message is not \"already belongs to another part in the Part Library.\": no entry has exactly the typed number."],
   ["The red message has gone on its own after about 3 seconds, and the window is still open."],
   ["The window closes and part A is still listed under its old number."],
   ["The location selector shows location B."], ["The Parts left menu shows Inventory."], ["Location B's Inventory page opens."],
   ["Part B is listed at location B with its own number, unchanged."]],
  ["S13-N1a", "UFS-14", "CN-S13-3", JIRA_N1A],
  design=dict(note="no board draws this refusal (it was added on 23 Oct 2026, after the 13 Oct design); the expected results above come from the quotes above."),
  claude=["Example (the SV-10939 shape from the Jira comment): part A ZZPL-S13-45-1, part B ZZPLS13451 at location B, look-alike number ZZPL.S13.45.1."])

C("S13-46", "S13", "An activation refused after the save keeps the confirmation open",
  [ADMIN, "Create a part, part A, for this test with a Sell Price of $20.00, and set it inactive.", TWO_TABS,
   "Start in browser tab 1 on the Inventory page, on the Inactive tab, with part A's part number typed in the Search box."],
  ["In tab 1, click the part A row.", "In tab 1, replace the Sell Price with 27.00.", "In tab 1, click Active under Part Status.",
   "Open a second browser tab on the same ShopView address.", "In tab 2, click Parts in the top bar.", "In tab 2, click Inventory in the left menu.",
   "In tab 2, click the Inactive tab.", "In tab 2, type part A's part number in the Search box.", "In tab 2, click the part A row.",
   "In tab 2, click Active under Part Status.", "In tab 2, click Save.", "In tab 2, click Activate in the confirmation.", "Switch back to tab 1 without reloading it.",
   "In tab 1, click Save.", "In tab 1, click Activate in the confirmation.", "Wait 10 seconds.", "Click Close on the red message."],
  [["Edit Inventory Part opens for part A in tab 1."], ["Sell Price shows 27.00."], ["Active is selected."], ["A second tab opens."],
   ["Tab 2 shows the Parts left menu."], ["Tab 2 shows the Inventory page."], ["The Inactive tab is selected in tab 2."], ["Part A is listed in tab 2."],
   ["Edit Inventory Part opens in tab 2."], ["Active is selected in tab 2."], ["The \"Activate part?\" confirmation opens in tab 2."],
   ["Tab 2 shows \"Part activated.\": part A is now active."], ["Tab 1 still shows the part window with Active picked."],
   ["The \"Activate part?\" confirmation opens in tab 1."],
   ["The confirmation stays open, and a red message reads \"This part could not be activated\" with the reason \"Part is already in that state.\""],
   ["The red message is still showing after 10 seconds: it stays until it is closed."], ["The red message closes and the confirmation is still open."]],
  ["S13-N4", "S10-R13a", "UFS-26"],
  design=dict(boards=["3.7"]))

C("S13-47", "S13", "Inventory Value for a date before a rename shows the old part number",
  [ADMIN, "Create a tracked part, part A, for this test on an earlier day, date A, with 4 in its bin at a cost of $10.00, so the Inventory Value report saved a figure for it on date A.",
   NEWNUM_X, START_A],
  [ROW_A, REPLACE_NEW, SAVE, "Click Reports in the top bar.", "Click Inventory Value.", "Pick the test location only in the Location filter.",
   "Set the as-of date to date A.", "Type part A's old part number in the report's Search box.", "Set the as-of date to today.", "Replace the search text with the new number."],
  [["Edit Inventory Part opens for part A."], ["Part Number shows the new number."], ["The window closes and part A's row shows the new number."],
   ["The Reports page opens."], ["The Inventory Value report opens."], ["The report shows the test location only."], ["The report shows date A."],
   ["Part A is listed for date A under its old number, with Qty 4.00, Unit Cost $10.00 and Total Cost $40.00 (4 × $10.00)."],
   ["For today no row is listed under the old number, because today's report shows the new number."],
   ["For today part A is listed under the new number, with Qty 4.00 and Total Cost $40.00."]],
  ["CN-S13-2", "S13-R18", "ACC-3"],
  design=dict(note="no board draws the Inventory Value report; the expected results above come from the quotes above."))
