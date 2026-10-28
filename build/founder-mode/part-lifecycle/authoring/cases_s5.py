"""Story 5 — Change tracking on an existing part (S5-R1 to S5-R13, S5-N1, S5-N2, S5-E1 to S5-E3, S5-E1a). Section 20472.
Phase A, 27 Oct 2026: every existing case rewritten top to bottom against PRD v33; S5-17 split (Rule 136). S5-N1 and S5-E1a are
NO MANUAL CASE; S5-N2 is covered by the permission cases in Story 8 (requirement_map.py). S5-01 is held on question Q2 (how a part
with no bin location is made) and S5-18 on question Q1 (how a core's own Part History page is opened).
28 Oct 2026 named set (PRD v35): S5-05, S5-16, S5-17, S5-17b rewritten to v35 (S5-E2 says Settings → Parts → Bin Locations; S5-E3
says a core's Part History page has no link on screen). S5-01 (answer 14: only a direct system request makes a part with no bin) and
S5-18 (answer 13: the core's Part History page has no on-screen link) are kept unchanged and listed in
../full-pass-2026-10-27/NO-MANUAL-PROPOSAL.json for the QA lead; S5-08 and S5-09 (a core seen in global search, which S9-R18a now
says never lists a core) are kept unchanged and listed there too."""
from pllib import C, PO_HOLD
from common import *

WRITTEN = True
START_A = "Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box."
PO5a = ("PO", "Chris Ward, 14 Oct 2026, answer 5", "Save an untracked part with bins and none marked default, then turn tracking on.")

C("S5-01", "S5", "Turning tracking on gives a part with no bin the default bin at zero",
  [ADMIN, "Create an untracked part, part A, for this test with no bin location: its only bin location was deleted in Bin Locations (under Settings) while part A held 0 there, so its window shows no bin row.",
   START_A],
  ["Click the part A row.", "Click the Track quantities and cost of goods switch.", "Click Save.", "Click the part A row again."],
  [["Edit Inventory Part opens with the switch off and no bin row in the Inventory section."],
   ["The switch turns on and the Min and Max fields appear.", "The Inventory section now holds one bin row: the location's default bin, Quantity 0, marked Default."],
   ["The window closes with no bin error.", "Part A's Total Qty cell shows 0 Available (a number, not \"Not Tracked\"), and Bin Location / Quantity shows the default bin with 0."],
   ["The saved part keeps that one bin, Quantity 0, marked Default."]],
  ["S5-R7"], marker=PO_HOLD("Q2", "how a part with no bin location is made"),
  design=dict(boards=["5.6"]))

C("S5-02", "S5", "Turning tracking off and back on keeps Min and Max",
  [ADMIN, "Create an active tracked part, part A, for this test with Min 2, Max 6 and 4 in its bin.", START_A],
  ["Click the part A row.", "Click the Track quantities and cost of goods switch.", "Click Save.", "Click the part A row again.",
   "Click the Track quantities and cost of goods switch.", "Click Save."],
  [["Edit Inventory Part opens with the switch on, Min 2 and Max 6."],
   ["The switch turns off, Min and Max are hidden, and nothing else is asked."],
   ["Part A's row reads \"Not Tracked\" in Total Qty, and its Min still reads 2 and its Max 6."],
   ["Edit Inventory Part opens with the switch off."],
   ["The switch turns on and Min shows 2 and Max shows 6 again: not blank and not 0."],
   ["Part A's row shows Total Qty 4 Available, Min 2 and Max 6."]],
  ["S5-R1", "S5-R3", "S5-R4", "S4-R8b", "FO-7"],
  design=dict(boards=["5.2", "5.6"], words=[note("Min and Max show again with the values they had")]))

C("S5-03", "S5", "Turning tracking off on a part with stock asks for no confirmation",
  [ADMIN, "Create an active tracked part, part A, for this test with 7 on hand: 4 in one bin and 3 in another.", START_A],
  ["Click the part A row.", "Click the Track quantities and cost of goods switch.", "Click Save."],
  [["Edit Inventory Part opens with the switch on."],
   ["The switch turns off at once: no confirmation, warning or message appears, even though the part holds 7."],
   ["The window closes straight away and no confirmation window of any kind opens.", "Part A's row reads \"Not Tracked\" in Total Qty."]],
  ["S5-R5", "S5-R1", "KD-7"],
  design=dict(boards=["5.2"], words=[note("Min and Max are hidden in the part dialog, and no bin quantity changes")]))

C("S5-04", "S5", "Turning tracking off keeps every bin quantity",
  [ADMIN, "Create an active tracked part, part A, for this test with 4 in bin location A and 3 in bin location B.", START_A],
  ["Click the part A row.", "Click the Track quantities and cost of goods switch.", "Click Save.", "Click the part A row again."],
  [["Edit Inventory Part opens with both bins: bin location A with 4 and bin location B with 3."],
   ["The switch turns off and both bin rows are still shown with their quantities, 4 and 3."],
   ["Part A's Bin Location / Quantity cell still shows bin location A with 4 and bin location B with 3 (4 + 3 = 7 still on the shelf; nothing was set to zero)."],
   ["The window shows the switch off and the same two bins, 4 and 3."]],
  ["S5-R3", "S5-R3a"],
  design=dict(boards=["5.2"]))

C("S5-05", "S5", "Turning tracking on marks the first bin as default when none is",
  [ADMIN, "Have two bin locations at the test location, bin location A and bin location B.",
   "Create an untracked part, part A, for this test with 2 in bin location A (the first bin row) and 5 in bin location B, saved with neither bin marked Default.", START_A],
  ["Click the part A row.", "Click the Track quantities and cost of goods switch.", "Click Save."],
  [["The Inventory section lists bin location A with 2 as the first row and bin location B with 5 as the second; neither row is marked Default."],
   ["The first bin row, bin location A, is now marked Default and bin location B is not.", "The quantities are unchanged: 2 and 5."],
   ["The window closes with no bin error.", "Part A's Total Qty shows 7 Available (2 + 5 = 7), and Bin Location / Quantity shows bin location A with 2 and bin location B with 5."]],
  ["S5-R8", "S5-E2", PO5a],
  design=dict(boards=["5.6"]), prd=35)

C("S5-06", "S5", "The list shows Not Tracked right after Save, without a page reload",
  [ADMIN, "Create an active tracked part, part A, for this test with 5 in its bin.", START_A],
  ["Click the part A row.", "Click the Track quantities and cost of goods switch.", "Click Cancel.", "Click the part A row again.",
   "Click the Track quantities and cost of goods switch.", "Click Save.", "Wait 5 seconds without refreshing the page."],
  [["Edit Inventory Part opens with the switch on."],
   ["The switch turns off."],
   ["The window closes and part A's row still shows 5 Available: switching without saving changed nothing."],
   ["The switch is on."],
   ["The switch turns off."],
   ["The window closes."],
   ["Part A's Total Qty cell reads \"Not Tracked\".", "The page did not reload: the Search box still holds part A's part number and the list did not go blank or jump to the top."]],
  ["S5-R2", "S5-R10"],
  design=dict(boards=["5.2", "5.3"]))

C("S5-07", "S5", "Turning tracking back on shows the count as it stands now",
  [ADMIN, "Create a part, part A, for this test with 4 in bin location A and 3 in bin location B, turn its tracking off, then change bin location A's quantity to 1 while it is untracked.",
   START_A],
  ["Click the part A row.", "Click the Track quantities and cost of goods switch.", "Click Save."],
  [["Edit Inventory Part opens with the switch off, and the bins show bin location A with 1 and bin location B with 3."],
   ["The switch turns on and the bins still show the quantities as they stand now: 1 and 3, not the 4 and 3 held when tracking was turned off."],
   ["Part A's Total Qty reads 4 Available (1 + 3 = 4), not 7."]],
  ["S5-R6", "KD-7"],
  design=dict(boards=["5.6"]))

C("S5-08", "S5", "A part's core turns untracked and tracked together with the part",
  [ADMIN, "Create an active tracked part, part A, for this test with 2 in its bin and a Core Charge of $25.00, so it has a core.", GLOBAL, START_A],
  ["Click the part A row.", "Click the Track quantities and cost of goods switch.", "Click Save.", "Click the Search box in the top bar.",
   "Type Core for followed by part A's description.", "Press Escape.", "Click the part A row.", "Click the Track quantities and cost of goods switch.",
   "Click Save.", "Click the Search box in the top bar.", "Type Core for followed by part A's description again."],
  [["Edit Inventory Part opens with the switch on."],
   ["The switch turns off."],
   ["Part A reads \"Not Tracked\" in Total Qty, and its Core column still reads $25.00."],
   ["The global search opens."],
   ["The result for part A's core shows \"Not Tracked\" in place of its available badge: it changed with the same save as part A, and you did not edit the core."],
   ["The global search closes."],
   ["Edit Inventory Part opens with the switch off."],
   ["The switch turns on."],
   ["Part A shows a quantity again in Total Qty."],
   ["The global search opens."],
   ["The result for part A's core shows an available badge again (a number, not \"Not Tracked\"), changed by the same save that turned part A back on."]],
  ["S5-R9", "S9-R20", "FO-10", "KD-8"],
  design=dict(note="no board draws a core; the expected results above come from the quotes above."))

C("S5-09", "S5", "A core charge added to an untracked part gives it an untracked core",
  [ADMIN, "Create an untracked part, part A, for this test with 2 in its bin and no Core Charge, so it has no core yet.", GLOBAL, START_A],
  ["Click the part A row.", "Type 30.00 in Core Charge.", "Click Save.", "Click the Search box in the top bar.", "Type Core for followed by part A's description."],
  [["Edit Inventory Part opens with the switch off and Core Charge empty or 0."],
   ["Core Charge shows 30.00."],
   ["The window closes.", "Part A's Core column reads $30.00, and its Total Qty still reads \"Not Tracked\"."],
   ["The global search opens."],
   ["The result for part A's new core shows \"Not Tracked\" in place of an available badge: the new core took part A's untracked state."]],
  ["S5-R9", "S9-R20"],
  design=dict(note="no board draws a core; the expected results above come from the quotes above."))

C("S5-10", "S5", "Cycle count shows Not Tracked for an untracked part and never counts it",
  [ADMIN, "Create two parts for this test: part A, active and tracked, with 5 in its bin, and part B, active and untracked, with 3 in its bin.",
   SHARED("parts A and B"), NO_COUNT, "Start on the Inventory page, on the Active tab, with the shared start of the part numbers typed in the Search box."],
  [MENU, "Click Cycle count.", "Type 6 in part A's Count box.", "Click Save in the count toolbar."],
  [["The menu opens."],
   ["Part B's Total Qty and Count cells both read \"Not Tracked\" in grey, and there is no Count box on its row.",
    "Part A shows 5 Available and an empty Count box."],
   ["Part A's Count box shows 6."],
   ["Part A now shows 6 Available (the count of 6 replaces 5, an adjustment of +1).",
    "Part B still shows \"Not Tracked\" with 3 in its bin: it was not counted and its bin did not change."]],
  ["S5-R12", "UFS-41"],
  design=dict(boards=["5.7"], words=[note("In Cycle count the untracked part shows")]))

C("S5-11", "S5", "The printed count sheet leaves out an untracked part",
  [ADMIN, "Have two active tracked parts, part A with 2 in its bin and part B with 4, and an active untracked part, part C, with 6 in its bin.",
   SHARED("parts A, B and C", 3), NO_COUNT, "Start on the Inventory page, on the Active tab, with the shared start of the part numbers typed in the Search box."],
  [MENU, "Click Cycle count.", "Click the printer icon in the count toolbar.", "Close the print preview without printing.", "Click Cancel in the count toolbar."],
  [["The menu opens."],
   ["The count starts; part C shows \"Not Tracked\" in its Count column."],
   ["The count sheet lists parts A and B (2 parts).", "Part C is not on the count sheet."],
   ["The print preview closes."],
   ["Cycle count ends and the three-dot actions button is back in the toolbar."]],
  ["S5-R13"],
  design=dict(boards=["5.7"]))

C("S5-12", "S5", "Part History records Tracking turned off and Tracking turned on",
  [ADMIN, "Create an active tracked part, part A, for this test with nothing on hand: its only bin holds 0.", START_A],
  ["Click the part A row.", "Click the Track quantities and cost of goods switch.", "Click Save.", "Click the clock icon (Part History) at the left of the part A row.",
   "Click Inventory in the left menu.", "Type part A's part number in the Search box.", "Click the part A row.", "Click the Track quantities and cost of goods switch.",
   "Click Save.", "Click the clock icon (Part History) at the left of the part A row."],
  [["Edit Inventory Part opens with the switch on."], ["The switch turns off."], ["The window closes and part A reads \"Not Tracked\"."],
   ["Part History opens. Its newest entry reads \"Tracking turned off\", with your name under Staff and today's date and time, even though the part holds nothing."],
   ["The Inventory page opens."], ["Part A is listed."], ["Edit Inventory Part opens with the switch off."], ["The switch turns on."],
   ["The window closes and part A shows a quantity again."],
   ["The newest entry reads \"Tracking turned on\" and the one below it \"Tracking turned off\", each with your name, today's date and its own time."]],
  ["S5-R11", "S10-R22"],
  design=dict(boards=["5.5"], words=[note("Turning tracking off writes \"Tracking turned off\"")]))

C("S5-13", "S5", "Importing Min, Max and a bin quantity for an untracked part saves them",
  [ADMIN, "Create an untracked part, part A, for this test with Min 2 and Max 6 (saved while it was tracked) and 4 in bin location A.",
   "Have a parts import file with one row for part A that sets bin location A's quantity to 9, Min to 3 and Max to 8.",
   "Start on the Inventory data import page (Settings, then Data Import, then Inventory)."],
  ["Upload the file.", "Run the import.", "Click Parts in the top bar.", "Click Inventory in the left menu.", "Type part A's part number in the Search box.",
   "Click the clock icon (Part History) at the left of the part A row."],
  [["The file is ready to import."],
   ["The import finishes with no error for part A's row: the row's number matches a part already stocked here, so the import updates part A and does not refuse it as a duplicate."],
   ["The Parts left menu shows Inventory."],
   ["The Inventory page opens."],
   ["Part A still reads \"Not Tracked\".", "Its Bin Location / Quantity shows bin location A with 9, and Min reads 3 and Max 8: the imported values were saved just as on a tracked part."],
   ["Part History has the entry \"Min/Max updated | Min: 2 → 3 | Max: 6 → 8 | Source: Import\"."]],
  ["S5-E1", "S7-N7", "S10-R22a"],
  design=dict(note="no board draws the import; the expected results above come from the quotes above."))

C("S5-14", "S5", "Inventory Value for an earlier date still counts a part untracked today",
  [ADMIN, "Create an active tracked part, part A, for this test on an earlier day, with 4 in its bin at a cost of $10.00, so the Inventory Value report saved a figure for it on that earlier date (date A).",
   START_A],
  ["Click the part A row.", "Click the Track quantities and cost of goods switch.", "Click Save.", "Click Reports in the top bar.", "Click Inventory Value.",
   "Pick the test location only in the Location filter.", "Set the as-of date to date A.", "Type part A's part number in the report's Search box.",
   "Set the as-of date to today."],
  [["Edit Inventory Part opens with the switch on."], ["The switch turns off."], ["Part A reads \"Not Tracked\"."], ["The Reports page opens."],
   ["The Inventory Value report opens."], ["The report shows the test location only."], ["The report shows date A."],
   ["Part A is still listed for date A with Qty 4.00, Unit Cost $10.00 and Total Cost $40.00 (4 × $10.00).",
    "The Totals row reads Qty 4.00 and Total Cost $40.00: turning tracking off today did not change date A's figures."],
   ["For today part A is not listed."]],
  ["S4-R9", "ACC-3"],
  design=dict(note="no board draws the Inventory Value report; the expected results above come from the quotes above."))

C("S5-15", "S5", "Inventory Value before the release counts every part as tracked",
  [ADMIN, "Use an active tracked part, part A, that was at the test location before this release was installed and that no other test needs.",
   "Use a date before the release, date A, on which the Inventory Value report lists part A.",
   "Write down part A's Qty and Total Cost on the Inventory Value report for date A.", START_A],
  ["Click the part A row.", "Click the Track quantities and cost of goods switch.", "Click Save.", "Click Reports in the top bar.", "Click Inventory Value.",
   "Pick the test location only in the Location filter.", "Set the as-of date to date A.", "Type part A's part number in the report's Search box.",
   "Set the as-of date to today."],
  [["Edit Inventory Part opens with the switch on."], ["The switch turns off."], ["Part A reads \"Not Tracked\"."], ["The Reports page opens."],
   ["The Inventory Value report opens."], ["The report shows the test location only."], ["The report shows date A."],
   ["Part A is listed for date A with the same Qty and Total Cost you wrote down: a date before the release counts it as tracked."],
   ["For today part A is not listed, because it is untracked today."]],
  ["ACC-5", "ACC-4", "S4-R9"],
  design=dict(note="no board draws the Inventory Value report; the expected results above come from the quotes above."))

C("S5-16", "S5", "After its default bin is deleted, turning tracking on marks the remaining bin",
  [ADMIN, "Create two bin locations for this test, bin location A and bin location B, at the test location.",
   "Create an untracked part, part A, for this test with 0 in bin location A, marked Default, and 5 in bin location B.",
   f"Delete bin location A in {BINS} while part A holds 0 there.", START_A],
  ["Click the part A row.", "Click the Track quantities and cost of goods switch.", "Click Save."],
  [["The Inventory section lists only bin location B, with 5, and it is not marked Default; bin location A is gone."],
   ["Bin location B, the first bin row, is now marked Default; its quantity is still 5."],
   ["The window closes with no bin error.", "Part A's Total Qty shows 5 Available, and Bin Location / Quantity shows bin location B with 5."]],
  ["S5-E2", "S5-R8", A17],
  design=dict(boards=["5.6"]), prd=35)

C("S5-17", "S5", "A part's core has no row of its own on the Inventory list or in Export",
  [ADMIN, "Create an active tracked part, part A, for this test with 2 in its bin and a Core Charge of $25.00, so it has a core.", FILEAPP, START_A],
  ["Replace the search text with Core for followed by part A's description.", "Replace the search text with part A's part number.", MENU, "Click Export.",
   "Open the downloaded file.", MENU2, "Click Deactivate parts.", "Click the checkbox in the header row.", X],
  [["No row is listed for the core: the list shows its usual empty result."],
   ["Exactly one row is listed, part A, with $25.00 in its Core column; there is no second row for its core."],
   ["The menu opens."],
   ["A file downloads."],
   ["The file holds one part row, part A; there is no row for its core."],
   ["The menu opens."],
   ["Bulk mode turns on."],
   ["The bar reads 1 selected: the header checkbox ticked part A only, because its core has no row that could be ticked."],
   ["Bulk mode ends and nothing was deactivated."]],
  ["S5-E3", "S1-R9b", "S2-R6"],
  design=dict(note="no board draws a core; the expected results above come from the quotes above."), prd=35)

C("S5-17b", "S5", "A part's core has no row of its own on the Part Library list",
  [ADMIN, "Create a part, part A, for this test with a Core Charge of $25.00, so it has a core.",
   "Start on the Part Library page (Parts in the top bar, then Part Library in the left menu)."],
  ["Type part A's part number in the Search box.", "Replace the search text with Core for followed by part A's description."],
  [["One entry is listed, with part A's description."],
   ["No entry is listed for the core."]],
  ["S5-E3"], part_of="S5-17",
  design=dict(boards=["7.1"]), prd=35)

C("S5-18", "S5", "A core's own Part History page shows its name and its own history",
  [ADMIN, "Create an active part, part A, for this test with a Core Charge of $25.00, so it has a core, then change part A's description once in its Edit Inventory Part window, from description 1 to description 2.",
   "Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  ["Open the core's own Part History page.", "Click Inventory in the left menu.", "Type part A's part number in the Search box.",
   "Click the clock icon (Part History) at the left of the part A row."],
  [["A Part History page opens for the core, not for part A.", "Its Part details panel names the core \"Core for\" followed by description 2: the core was renamed with its part.",
    "Its newest entry reads \"Description updated | Original description: Core for\" description 1 \"| New description: Core for\" description 2, with your name under Staff and today's date and time."],
   ["The Inventory page opens."],
   ["Part A is listed."],
   ["Part A's own newest entry reads \"Description updated | Original description:\" description 1 \"| New description:\" description 2: the core keeps a history of its own."]],
  ["S5-E3", "S13-R15", "S10-R24", "S10-R26"], marker=PO_HOLD("Q1", "how a core's own Part History page is opened"),
  design=dict(note="no board draws a core; the expected results above come from the quotes above."))
