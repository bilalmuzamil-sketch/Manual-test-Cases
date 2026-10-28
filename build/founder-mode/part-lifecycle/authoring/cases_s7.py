"""Story 7 — Create a Part by Typing Its Number and Description (SV-10820). Section 20474.
Phase B, 27 Oct 2026: every live case rewritten top to bottom against PRD v33 (Rule 134) in the QA lead's pattern.
Splits (Rule 136): S7-09b (S7-R6c changed in v31: a linked entry with NO category now takes the dialog's category; Chris Ward on
SV-10820, 23 Oct 2026) and S7-21b (an import row whose number differs only in case and punctuation).
Held: S7-17 on Q12 (renaming to a look-alike of a part at this same location: S7-N3's message or S13-N1a's?), S7-25 on Q4(a)
(is a part the import adds tracked?). No manual case: S7-N6 (a blank number or description reaching the system by another route; requirement_map.py).
28 Oct 2026 named set (PRD v35, Chris Ward's answers 16 and 23 of 27 Oct 2026): S7-17 released (a look-alike at this same location gets
S7-N3's message; S13-N1a now says so) with a new split S7-17b (the inactive look-alike gets S7-N4's message); S7-25 released (the import
adds tracked parts, S7-N11; Bin Locations is under Settings → Parts); new S7-27 (S7-N11: an imported part is tracked, the template's
"name" column is its description, and the import never changes an existing part's tracking)."""
from pllib import C, PO_HOLD, HOLD, DESIGN_HOLD
from common import *
from cases_s6 import TYPE_A, ROW_A, SAVE

WRITTEN = True


NEWP = "Click New Inventory Part."
CAT = "Pick any category in the Category field."
COST = "Type 10.00 in the Cost field."
LIB = "Click Part Library in the left menu."
INV = "Click Inventory in the left menu."
TOPP = "Click Parts in the top bar."
IMP_START = "Start on the Inventory data import page (Settings, then Data Import, then Inventory)."
R_NEW = ["The New Inventory Part window opens."]
R_CAT = ["The category shows in the Category field."]
R_COST = ["Cost reads $10.00."]
R_LIB = ["The Part Library page opens."]
KEEP = "is not stocked at the test location"
TWO_LOC = "Sign in as an Admin who can switch between two locations, the test location and location B, so a part can be stocked at location B only."
D13 = dict(boards=["1.3"])
D14 = dict(boards=["1.3", "1.4"], words=[note("Exactly one Part Library entry has the number typed")])
D15 = dict(boards=["1.5"], words=[note("Typing f40010212 at a location")])
NOIMP = dict(note="no board draws the parts import; the expected results above come from the quotes above.")
CHRIS_S7 = ("JIRA", "SV-10820, Chris Ward, 23 Oct 2026",
            "Please switch to B. When the typed number links to a Part Library entry that has no category, the entry takes the category picked in the dialog, the same way a missing manufacturer is filled (S7-R6b). If the entry already has a category, it keeps its own (S7-R6c).")

C("S7-01", "S7", "New Inventory Part has Description then Part Number, with no library pick",
  [ADMIN, "Use a part number for a new part, part A, that no part or Part Library entry uses yet.", START],
  [NEWP, "Type a description for part A in the Description field.", "Press Tab.", "Type part A's part number.", CAT, COST, SAVE, TYPE_A],
  [["A window titled \"New Inventory Part\" opens.", "Its first field is Description and the next field is Part Number.",
    "There is no Part Library (or Catalog Part) field anywhere in the window, and no lookup list opens."],
   ["The Description field holds the text as typed."],
   ["The cursor moves to the Part Number field."],
   ["Part Number holds part A's part number as plain typed text, with no list to pick from."],
   R_CAT, R_COST,
   ["The window closes and the part is saved: no Part Library step was asked for."],
   ["One row is listed, with part A's description and part number."]],
  ["S7-R1", "S7-R2", "FO-8"],
  design=dict(boards=["1.1", "1.3"], words=[note("Description first, then Part Number")]))

C("S7-02", "S7", "A number that exactly matches one Part Library entry links to it",
  [TWO_LOC,
   "Create a part for this test at location B only, part A, with a description, description 1, so its Part Library entry exists and part A " + KEEP + ".",
   "Use a description, description 2, that differs from description 1 by more than upper and lower case.", START],
  [NEWP, "Type description 2 in the Description field.", "Type part A's part number in the Part Number field, with the same upper and lower case.",
   CAT, COST, SAVE, TYPE_A, LIB, TYPE_A, ROW_A],
  [R_NEW, ["Description reads description 2."], ["Part Number reads part A's part number."], R_CAT, R_COST,
   ["The window closes.",
    "A green message reads: Part created. Linked to (part A's part number) in the Part Library. Its description \"(description 1)\" was kept.",
    "The message goes away on its own."],
   ["One row is listed for part A, with description 1 (the Part Library entry's description), not description 2."],
   R_LIB,
   ["Exactly one entry is listed for part A's number, still with description 1: no second entry was made."],
   ["The entry's detail page lists part A at both the test location and location B."]],
  ["S7-R4", "S7-R5", "S7-R6", "S7-R9", "UFS-10", "KD-4"], design=D14)

C("S7-03", "S7", "A number held by two Part Library entries gets a new entry of its own",
  [ADMIN,
   "Use two Part Library entries from before this release that have exactly the same part number, with the same upper and lower case, and different descriptions (such pairs come only from data saved before this release); call that part number number 1.",
   "Make sure no part at the test location has a part number that matches number 1, ignoring upper and lower case, hyphens, asterisks, periods and spaces.",
   "Use a description for the new part, description 3, that neither entry has.", START],
  [NEWP, "Type description 3 in the Description field.", "Type number 1 in the Part Number field.", CAT, COST, SAVE, LIB,
   "Type number 1 in the Part Library search."],
  [R_NEW, ["Description reads description 3."], ["Part Number reads number 1."], R_CAT, R_COST,
   ["The window closes and the part is saved.", "No message about the Part Library appears (no \"Linked to\" message)."],
   R_LIB,
   ["Three entries now have number 1: the two old entries with their own descriptions, unchanged, and a new one with description 3 (2 + 1 = 3)."]],
  ["S7-R8", "S7-R10", "CN-S7-1"], design=D13)

C("S7-04", "S7", "Description and Part Number must be filled before a new part saves",
  [ADMIN, "Use a part number for a new part, part A, that no part or Part Library entry uses yet.", START],
  [NEWP, SAVE, "Type three spaces in the Description field.", "Type three spaces in the Part Number field.", SAVE,
   "Replace the spaces in the Description field with a description for part A.", SAVE,
   "Replace the spaces in the Part Number field with part A's part number.", CAT, COST, SAVE, TYPE_A],
  [R_NEW,
   ["Description is outlined in red with \"Description is a required field\" under it.",
    "Part Number is outlined in red with \"Part number is a required field\" under it, at the same time.",
    "The window stays open and nothing is saved (Category and Cost may show their own required messages, as they do today)."],
   ["Description holds the three spaces."], ["Part Number holds the three spaces."],
   ["Both messages still show: a field that holds only spaces counts as empty.", "Nothing is saved."],
   ["Description holds part A's description."],
   ["The Description message has gone.", "\"Part number is a required field\" still shows under Part Number, and nothing is saved."],
   ["Part Number holds part A's part number and its message has gone."], R_CAT, R_COST,
   ["The window closes and the part is saved."],
   ["One row is listed for part A, with its description."]],
  ["S7-N1", "S7-N2", "UFS-04", "UFS-05", "KD-3"],
  design=dict(boards=["1.2"], words=[note("Every empty required field shows its own error")]))

C("S7-05", "S7", "Spaces before and after the number and description are removed on save",
  [ADMIN, "Use a part number for a new part, part A, that no part or Part Library entry uses yet.", START],
  [NEWP, "Type three spaces, then part A's description, then three spaces, in the Description field.",
   "Type three spaces, then part A's part number, then three spaces, in the Part Number field.", CAT, COST, SAVE, TYPE_A, ROW_A,
   "Click at the very end of the Part Number text.", "Press Backspace.", "Click Cancel.", LIB, TYPE_A],
  [R_NEW, ["Description holds the spaces and the text."], ["Part Number holds the spaces and the number."], R_CAT, R_COST,
   ["The window closes and the part is saved."],
   ["One row shows part A's description and part number with no spaces before or after them."],
   ["Edit Inventory Part opens with Description and Part Number holding the text with no spaces before or after it."],
   ["The cursor sits right after the last character of the part number."],
   ["Backspace removes the last character of the part number, which shows no space was kept at the end."],
   ["The window closes without saving."], R_LIB,
   ["The entry for part A shows its part number and description with no spaces around them."]],
  ["S7-R3", "S11-R6a"], design=D13)

C("S7-06", "S7", "A linked Part Library entry keeps its tags and gains the new one",
  [TWO_LOC, "Create a part for this test at location B only, part A, with exactly two tags, tag 1 and tag 2, so part A " + KEEP + ".",
   "Use a third tag, tag 3, that part A does not have.", START],
  [NEWP, "Type a description in the Description field.", "Type part A's part number in the Part Number field.",
   "Type tag 3 in the Tags field.", "Press Enter.", CAT, COST, SAVE, LIB, TYPE_A],
  [R_NEW, ["Description holds the text."], ["Part Number reads part A's part number."], ["The Tags field holds the text."],
   ["Tag 3 shows as a tag in the field."], R_CAT, R_COST, ["The window closes and the part is saved."], R_LIB,
   ["Part A's entry shows three tags: tag 1, tag 2 and tag 3 (2 kept + 1 added = 3).", "No tag was removed."]],
  ["S7-R6a"], design=D13)

C("S7-07", "S7", "A linked entry with no manufacturer takes the one picked",
  [TWO_LOC, "Create a part for this test at location B only, part A, with the Manufacturer field left empty, so part A " + KEEP + ".", START],
  [NEWP, "Type a description in the Description field.", "Type part A's part number in the Part Number field.",
   "Pick any manufacturer in the Manufacturer field.", CAT, COST, SAVE, LIB, TYPE_A],
  [R_NEW, ["Description holds the text."], ["Part Number reads part A's part number."], ["The manufacturer shows in the Manufacturer field."],
   R_CAT, R_COST, ["The window closes and the part is saved."], R_LIB,
   ["Part A's entry now shows the manufacturer you picked."]],
  ["S7-R6b", "S7-R6d"], design=D13)

C("S7-08", "S7", "A linked entry keeps the manufacturer it already has",
  [TWO_LOC, "Create a part for this test at location B only, part A, with a manufacturer, manufacturer 1, so part A " + KEEP + ".",
   "Use a different manufacturer, manufacturer 2, from the Manufacturer list.", START],
  [NEWP, "Type a description in the Description field.", "Type part A's part number in the Part Number field.",
   "Pick manufacturer 2 in the Manufacturer field.", CAT, COST, SAVE, LIB, TYPE_A],
  [R_NEW, ["Description holds the text."], ["Part Number reads part A's part number."], ["Manufacturer reads manufacturer 2."],
   R_CAT, R_COST, ["The window closes and the part is saved."], R_LIB,
   ["Part A's entry still shows manufacturer 1, not manufacturer 2."]],
  ["S7-R6b", "S7-R6d"], design=D13)

C("S7-09", "S7", "A linked entry that has a category keeps its own category",
  [TWO_LOC, "Create a part for this test at location B only, part A, with a category, category A, so part A " + KEEP + ".",
   "Use a different category, category B, from the Category list.", START],
  [NEWP, "Type a description in the Description field.", "Type part A's part number in the Part Number field.",
   "Pick category B in the Category field.", COST, SAVE, LIB, TYPE_A],
  [R_NEW, ["Description holds the text."], ["Part Number reads part A's part number."], ["Category reads category B."], R_COST,
   ["The window closes and the part is saved."], R_LIB,
   ["Part A's entry still shows category A, not category B."]],
  ["S7-R6c", CHRIS_S7], design=D13)

C("S7-09b", "S7", "A linked entry with no category takes the category picked",
  [ADMIN,
   "Use a Part Library entry that has no category and that no part at the test location uses (such entries come from data saved before this release); call its part number number 1.",
   "Use any category, category A, from the Category list.", START],
  [NEWP, "Type a description in the Description field.", "Type number 1 in the Part Number field, with the same upper and lower case.",
   "Pick category A in the Category field.", COST, SAVE, LIB, "Type number 1 in the Part Library search."],
  [R_NEW, ["Description holds the text."], ["Part Number reads number 1."], ["Category reads category A."], R_COST,
   ["The window closes and the part is saved."], R_LIB,
   ["Exactly one entry has number 1, and it now shows category A: an entry with no category takes the one picked."]],
  ["S7-R6c", "S7-R6b", CHRIS_S7], part_of="S7-09", design=D13)

C("S7-10", "S7", "No Part Library message when the typed description differs only in case",
  [TWO_LOC, "Create a part for this test at location B only, part A, with a description, description 1, in capital letters, so part A " + KEEP + ".", START],
  [NEWP, "Type two spaces, then description 1 in lower case, then two spaces, in the Description field.",
   "Type part A's part number in the Part Number field.", CAT, COST, SAVE, LIB, TYPE_A],
  [R_NEW, ["Description holds the lower-case text with the spaces."], ["Part Number reads part A's part number."], R_CAT, R_COST,
   ["The window closes and the part is saved.", "No message about the Part Library appears (no \"Part created. Linked to\" message)."],
   R_LIB, ["One entry is listed for part A, still with description 1 in capital letters."]],
  ["S7-R9", "S7-R10"], design=D14)

C("S7-11", "S7", "A new number creates its own Part Library entry, with no message",
  [ADMIN, "Use a part number for a new part, part A, that no part or Part Library entry uses in any upper and lower case or punctuation.", START],
  [NEWP, "Type a description for part A in the Description field.", "Type part A's part number in the Part Number field.", CAT, COST, SAVE,
   LIB, TYPE_A, ROW_A],
  [R_NEW, ["Description holds the text."], ["Part Number reads part A's part number."], R_CAT, R_COST,
   ["The window closes and the part is saved.", "No message about the Part Library appears."],
   R_LIB, ["Exactly one entry is listed, with part A's part number and description."],
   ["The entry's detail page lists part A at the test location only."]],
  ["S7-R7", "S7-R10", "S11-R6"], design=D13)

C("S7-12", "S7", "A number that differs only in upper or lower case is not linked",
  [TWO_LOC, "Create a part for this test at location B only, part A, whose part number is in capital letters, with a description, description 1, so part A " + KEEP + ".",
   "Use a description for the new part, description 2, that differs from description 1.", START],
  [NEWP, "Type description 2 in the Description field.", "Type part A's part number in lower case in the Part Number field.", CAT, COST, SAVE,
   LIB, TYPE_A],
  [R_NEW, ["Description reads description 2."], ["Part Number holds the lower-case number."], R_CAT, R_COST,
   ["The window closes and the part is saved.", "No \"Linked to\" message appears."],
   R_LIB,
   ["Two separate entries are listed: part A's number in capitals with description 1, and the lower-case number, saved exactly as typed, with description 2 (1 + 1 = 2)."]],
  ["S7-R4", "S7-R7", "KD-4"], design=D13)

C("S7-13", "S7", "A part number already stocked here and active is refused",
  [ADMIN, "Create an active part, part A, for this test at the test location, with a part number that has a hyphen in it.", START],
  [NEWP, "Type a description in the Description field.", "Type part A's part number in lower case in the Part Number field.", CAT, COST, SAVE,
   "Replace the part number with part A's part number in lower case, with the hyphen replaced by a space and a period.", SAVE,
   "Click Cancel.", TYPE_A],
  [R_NEW, ["Description holds the text."], ["Part Number holds the lower-case number."], R_CAT, R_COST,
   ["The part is not saved.",
    "A red message reads part A's part number, in part A's own upper and lower case, followed by \"already exists at this location.\"",
    "A second, smaller line under it reads \"Please try to resolve this.\"",
    "The message goes away after about 3 seconds, and the window stays open with the typed values."],
   ["Part Number holds the new text."],
   ["The same red message appears: hyphens, periods and spaces make no difference."],
   ["The window closes."], ["Exactly one row is listed: part A."]],
  ["S7-N3", "S7-N5", "UFS-08", "CN-S13-3", "KD-5"], design=D15)

C("S7-14", "S7", "A part number already stocked here but inactive is refused",
  [ADMIN, "Create a part, part A, for this test at the test location, with a hyphen in its part number, and set it inactive.", START],
  [NEWP, "Type a description in the Description field.", "Type part A's part number with each hyphen replaced by a period in the Part Number field.",
   CAT, COST, SAVE, "Click Cancel.", TYPE_A, "Click the Inactive tab."],
  [R_NEW, ["Description holds the text."], ["Part Number holds the typed number."], R_CAT, R_COST,
   ["The part is not saved.",
    "A red message reads part A's part number followed by \"already exists at this location and is inactive. Activate it from the Inactive tab.\"",
    "A second, smaller line reads \"Please try to resolve this.\"",
    "The message goes away after about 3 seconds, and the window stays open."],
   ["The window closes."], ["No row is listed on the Active tab."], ["The Inactive tab lists one row: part A."]],
  ["S7-N4", "S7-N5", "UFS-09", "CN-S13-3"], design=D15)

C("S7-15", "S7", "With active and inactive matches, the active part's number is named",
  [ADMIN,
   "Have at the test location an active part, part A, and an inactive part, part B, on two different Part Library entries, whose part numbers differ only in hyphens or periods (such a pair comes from data saved before this release, or from the parts import, which can add one when the number matches a Part Library entry stocked only at another location).",
   "Use a number to type, number 1: part A's number in lower case with spaces in place of its hyphens, so it matches both parts.", START],
  [NEWP, "Type a description in the Description field.", "Type number 1 in the Part Number field.", CAT, COST, SAVE, "Click Cancel."],
  [R_NEW, ["Description holds the text."], ["Part Number reads number 1."], R_CAT, R_COST,
   ["The part is not saved.",
    "The red message names the active part: part A's part number followed by \"already exists at this location.\", with \"Please try to resolve this.\" under it.",
    "It is not the inactive-part message, and it does not name part B."],
   ["The window closes."]],
  ["S7-N5a", "S7-N3", "S7-N5", "UFS-08", "CN-S7-3"], design=D15)

C("S7-16", "S7", "Saving a part with its number unchanged is never refused as a duplicate",
  [ADMIN,
   "Have at the test location two active parts, part A and part B, on two different Part Library entries, whose part numbers differ only in hyphens or periods (such a pair comes from data saved before this release, or from the parts import).",
   "Keep parts A and B as they are: this test changes only their Sell Price.", START],
  ["Type part B's part number in the Search box.", "Click the part B row.", "Replace the Sell Price with 25.00.", SAVE, TYPE_A, ROW_A,
   "Replace the Sell Price with 26.00.", SAVE],
  [["Part B is listed."], ["Edit Inventory Part opens for part B."], ["Sell Price reads $25.00."],
   ["The save goes through with no \"already exists at this location\" message.", "The window closes and part B's row shows Sell Price $25.00."],
   ["Part A is listed."], ["Edit Inventory Part opens for part A."], ["Sell Price reads $26.00."],
   ["The save goes through with no \"already exists at this location\" message.", "Part A's row shows Sell Price $26.00, and parts A and B keep their own part numbers."]],
  ["S7-N5b", "KD-5", "CN-S7-3"],
  design=dict(note="no board draws a save with the number unchanged; the expected results above come from the quotes above."))

C("S7-17", "S7", "Changing a part's number to a look-alike of one stocked here is refused",
  [ADMIN, "Create two active parts for this test at the test location, part A and part B, with a hyphen in part A's part number.",
   "Use a number to type, number 1: part A's number in lower case with spaces in place of its hyphens, which no Part Library entry has exactly.",
   "Start on the Inventory page, on the Active tab, with part B's part number typed in the Search box."],
  [ROW_A.replace("part A", "part B"), "Replace the Part Number with number 1.", SAVE, "Click Cancel.", "Type part B's part number in the Search box again."],
  [["Edit Inventory Part opens for part B."], ["Part Number reads number 1."],
   ["The change is not saved.",
    "A red message reads part A's part number, written as it was saved (capitals and hyphens), followed by \"already exists at this location.\", with \"Please try to resolve this.\" under it.",
    "The message says \"this location\" and does not give the location's name.",
    "It goes away after about 3 seconds, and the window stays open."],
   ["The window closes."], ["Part B is still listed under its own part number: it kept its number."]],
  ["S7-N5b", "S7-N3", "S7-N5", "UFS-08", "S13-N1a", "CN-S13-3", A23], design=D15, prd=35)

C("S7-17b", "S7", "Changing a number to a look-alike of an inactive part here is refused",
  [ADMIN, "Create two parts for this test at the test location: part A, set inactive, with a hyphen in its part number, and part B, active.",
   "Use a number to type, number 1: part A's number in lower case with spaces in place of its hyphens, which no Part Library entry has exactly.",
   "Start on the Inventory page, on the Active tab, with part B's part number typed in the Search box."],
  [ROW_A.replace("part A", "part B"), "Replace the Part Number with number 1.", SAVE, "Click Cancel.", "Type part B's part number in the Search box again."],
  [["Edit Inventory Part opens for part B."], ["Part Number reads number 1."],
   ["The change is not saved.",
    "A red message reads part A's part number, written as it was saved, followed by \"already exists at this location and is inactive. Activate it from the Inactive tab.\", with \"Please try to resolve this.\" under it.",
    "It goes away after about 3 seconds, and the window stays open."],
   ["The window closes."], ["Part B is still listed under its own part number on the Active tab: it kept its number."]],
  ["S7-N4", "S7-N5b", "S7-N5", "UFS-09", "S13-N1a", "CN-S13-3", A23], part_of="S7-17", design=D15, prd=35)

C("S7-18", "S7", "A description or part number of only spaces is refused on its own",
  [ADMIN, "Use a part number for a new part, part A, that no part or Part Library entry uses yet.", START],
  [NEWP, "Type three spaces in the Description field.", "Type part A's part number in the Part Number field.", CAT, COST, SAVE,
   "Replace the spaces in the Description field with a description.", "Replace the Part Number with three spaces.", SAVE, "Click Cancel.", TYPE_A],
  [R_NEW, ["Description holds the three spaces."], ["Part Number reads part A's part number."], R_CAT, R_COST,
   ["\"Description is a required field\" shows under Description, with no message under Part Number.", "The window stays open and nothing is saved."],
   ["Description holds the text."], ["Part Number holds the three spaces."],
   ["\"Part number is a required field\" shows under Part Number, and the Description message has gone.", "Nothing is saved."],
   ["The window closes."], ["No row is listed for part A: nothing was saved."]],
  ["S7-N1", "S7-N2", "UFS-04", "UFS-05"],
  design=dict(boards=["1.2"], words=[note("Every empty required field shows its own error")]))

C("S7-19", "S7", "A part from before the release keeps its Part Library entry",
  [ADMIN, "Use a part, part A, that was stocked at the test location before this release was installed and whose number and description nobody has changed since.",
   "Start on the Part Library page (Parts in the top bar, then Part Library in the left menu)."],
  [TYPE_A, ROW_A, TOPP, INV, TYPE_A, ROW_A],
  [["One entry is listed with part A's part number and description."],
   ["The entry's detail page lists part A at the test location: the part still points to the entry it had before the release."],
   ["The Parts left menu shows Inventory."], ["The Inventory page opens."], ["Part A is listed."],
   ["Edit Inventory Part shows the same description and part number as the Part Library entry."]],
  ["S7-R11"], design=dict(boards=["7.2"]))

C("S7-20", "S7", "Changing only the case or punctuation of a part's own number saves",
  [ADMIN, "Create an active part, part A, for this test at the test location only, with capital letters and a hyphen in its part number.",
   "Make sure no other part at the test location has a number that matches part A's, ignoring upper and lower case, hyphens, asterisks, periods and spaces.",
   "Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  [ROW_A, "Replace the Part Number with part A's part number in lower case.", SAVE, "Type part A's part number in lower case in the Search box.", ROW_A,
   "Replace the Part Number with part A's part number in capitals, without its hyphen.", SAVE, "Type that number in the Search box."],
  [["Edit Inventory Part opens for part A."], ["Part Number holds the lower-case number."],
   ["The save goes through: no \"already exists at this location.\" message appears, and the window closes."],
   ["One row is listed: part A, renamed to the lower-case number, with its description unchanged."],
   ["Edit Inventory Part opens for part A."], ["Part Number holds the number without the hyphen."],
   ["The save goes through with no \"already exists at this location\" message."],
   ["One row is listed: part A under its number without the hyphen."]],
  ["S7-N5c", "S7-N5b", "KD-5"],
  design=dict(note="no board draws a change of a part's own number; the expected results above come from the quotes above."))

C("S7-21", "S7", "An import row with the number of a part stocked here updates that part",
  [ADMIN, "Create a part, part A, for this test at the test location, with Min 1 and Max 5.",
   "Have a parts import file with one row for part A, with part A's exact part number, its description, Min 2 and Max 6.", IMP_START],
  ["Upload the file.", "Run the import.", TOPP, INV, TYPE_A],
  [["The file is ready to import."],
   ["The import finishes without refusing the row: no \"already exists at this location\" message appears."],
   ["The Parts left menu shows Inventory."], ["The Inventory page opens."],
   ["One row is listed for part A, now with Min 2 and Max 6 (it had 1 and 5): the row updated the part already stocked here."]],
  ["S7-N7", "S13-N9a"], stories=[7, 13], design=NOIMP)

C("S7-21b", "S7", "An import row whose number differs only in case and punctuation updates the part",
  [ADMIN, "Create a part, part A, for this test at the test location, with a hyphen in its part number and Min 1 and Max 5.",
   "Make sure no other Part Library entry has a number that matches part A's, ignoring upper and lower case, hyphens, asterisks, periods and spaces.",
   "Have a parts import file with one row whose part number is part A's number in lower case with periods in place of its hyphens, with part A's description, Min 3 and Max 7.",
   IMP_START],
  ["Upload the file.", "Run the import.", TOPP, INV, TYPE_A, "Click the Inactive tab."],
  [["The file is ready to import."],
   ["The import finishes and does not refuse the row, although its number differs from part A's in case and punctuation."],
   ["The Parts left menu shows Inventory."], ["The Inventory page opens."],
   ["Still exactly one row: part A, under its own part number, unchanged, now with Min 3 and Max 7.", "No second part was added."],
   ["No row for part A's number is listed on the Inactive tab either."]],
  ["S7-N7", "S13-N9a", "OOS-8"], stories=[7, 13], part_of="S7-21", design=NOIMP)

C("S7-22", "S7", "A parts import row with no part number is skipped with no message",
  [ADMIN, "Use a part number for a new part, part A, that no part or Part Library entry uses yet.",
   "Use a description, description 1, that no part or Part Library entry has.",
   "Have a parts import file with two rows: the first with an empty part number and description 1, the second with part A's part number and a description of its own, each with quantity 1.",
   IMP_START],
  ["Upload the file.", "Run the import.", TOPP, INV, "Type description 1 in the Search box.", "Click the Inactive tab.", LIB, "Type description 1 in the Part Library search.",
   TOPP, INV, TYPE_A],
  [["The file is ready to import."], ["The import finishes, and no error or warning about the row with no part number appears."],
   ["The Parts left menu shows Inventory."], ["The Inventory page opens."],
   ["No row is listed: the row with no part number was skipped."], ["No row is listed on the Inactive tab either."], R_LIB,
   ["No entry has description 1."], ["The Parts left menu shows Inventory."], ["The Inventory page opens."],
   ["Part A is listed, with its own description: the other row of the same file was imported."]],
  ["S7-N8"], design=NOIMP,
  claude=["The description is the import template's name column (open question Q4(b)); the part number is the part_number column."])

C("S7-23", "S7", "An import row with no description keeps the part's description",
  [ADMIN, "Create a part, part A, for this test at the test location, with a description, description 1, and Min 1 and Max 5.",
   "Have a parts import file with one row for part A: part A's part number, an empty description, Min 2 and Max 6.", IMP_START],
  ["Upload the file.", "Run the import.", TOPP, INV, TYPE_A, LIB, TYPE_A],
  [["The file is ready to import."], ["The import finishes and does not refuse the row."],
   ["The Parts left menu shows Inventory."], ["The Inventory page opens."],
   ["Part A is listed with description 1, not empty, and now shows Min 2 and Max 6 (it had 1 and 5): the row was applied without emptying the description."],
   R_LIB, ["Part A's entry still shows description 1."]],
  ["S7-N9", "CN-S7-4"], design=NOIMP)

C("S7-24", "S7", "A new part imported with no description takes its part number",
  [ADMIN, "Use a part number for a new part, part A, that no part or Part Library entry uses in any upper and lower case or punctuation.",
   "Have a parts import file with one row: part A's part number, an empty description and quantity 2.", IMP_START],
  ["Upload the file.", "Run the import.", TOPP, INV, TYPE_A, LIB, TYPE_A],
  [["The file is ready to import."], ["The import finishes and adds the part."],
   ["The Parts left menu shows Inventory."], ["The Inventory page opens."],
   ["One row is listed for part A, and its description reads part A's own part number, not empty."],
   R_LIB, ["One entry is listed for part A, with its part number as its description."]],
  ["S7-N9", "CN-S7-4"], design=NOIMP)

C("S7-25", "S7", "An imported part with no bin location goes to an Unassigned bin",
  ["Sign in as an Admin at a location that has no bin location named Unassigned.",
   "Use part numbers for two new parts, part A and part B, that no part or Part Library entry uses yet.",
   "Have a parts import file with two rows that add part A and part B, each with quantity 0 and an empty bin location cell.",
   "Start on that location's Inventory data import page (Settings, then Data Import, then Inventory)."],
  ["Upload the file.", "Run the import.", "Click Bin Locations under Parts in the Settings menu.", TOPP, INV, TYPE_A, ROW_A, "Click Cancel.",
   "Type part B's part number in the Search box.", ROW_A.replace("part A", "part B")],
  [["The file is ready to import."], ["The import finishes and adds both parts."],
   ["The Bin Locations list holds exactly one bin location named \"Unassigned\" (0 before + 1 made by the import = 1)."],
   ["The Parts left menu shows Inventory."], ["The Inventory page opens."],
   ["Part A is listed, and its Bin Location / Quantity cell shows Unassigned with 0.",
    "Its Total Qty shows 0 Available, a quantity and not \"Not Tracked\": the import added part A as a tracked part."],
   ["The window shows the Track quantities and cost of goods switch on.",
    "The Inventory section of the window shows one bin row: Bin Location \"Unassigned\", Quantity 0, marked Default."],
   ["The window closes."], ["Part B is listed, with 0 Available in Total Qty."],
   ["Part B also shows the switch on and one bin row: Bin Location \"Unassigned\", Quantity 0, marked Default."]],
  ["S7-N10", "S7-N11", ("PO", "Chris Ward's answer 3 a) of 14 Oct 2026",
              "The part goes into a bin named \"Unassigned\", which the import creates if it's missing. On a new part that bin is the default (S7-N10)."), A16, A17],
  design=NOIMP, prd=35)

C("S7-27", "S7", "An imported part is tracked and takes its description from the name column",
  [ADMIN, "Use a part number for a new part, part A, that no part or Part Library entry uses yet.",
   "Use a description, description 1, that no part or Part Library entry has.",
   "Create an untracked part, part B, for this test at the test location, with 4 in one bin location, bin location A.",
   "Have a parts import file made from the Inventory import template with two rows: one that adds part A, with description 1 in the name column, quantity 2 and bin location A, and one for part B with quantity 6 in bin location A.",
   IMP_START],
  ["Upload the file.", "Run the import.", TOPP, INV, TYPE_A, "Type part B's part number in the Search box."],
  [["The file is ready to import."], ["The import finishes without refusing either row."],
   ["The Parts left menu shows Inventory."], ["The Inventory page opens."],
   ["Part A is listed with description 1 in its Description column: the name column became its description.",
    "Part A's Total Qty shows 2 Available, a quantity and not \"Not Tracked\": the import added it as a tracked part."],
   ["Part B still reads \"Not Tracked\" in Total Qty, and its Bin Location / Quantity shows bin location A with 6: the import changed its quantity but not its tracking."]],
  ["S7-N11", "S5-E1", A16], stories=[7, 5], design=NOIMP, prd=35,
  claude=["Template columns: the description is the name column (answer 16(b), 27 Oct 2026); the part number is the part_number column."])

C("S7-26", "S7", "A linked entry whose manufacturer no longer exists takes the one picked",
  [ADMIN,
   "Use a Part Library entry from data saved before this release that still points to a manufacturer that no longer exists in this organization (its Manufacturer shows empty), and that no part at the test location uses; call its part number number 1.",
   "Make sure no other Part Library entry has exactly number 1, with the same upper and lower case.", START],
  [NEWP, "Type a description in the Description field.", "Type number 1 in the Part Number field, with the same upper and lower case.",
   "Pick any manufacturer in the Manufacturer field.", CAT, COST, SAVE, LIB, "Type number 1 in the Part Library search."],
  [R_NEW, ["Description holds the text."], ["Part Number reads number 1."], ["The manufacturer shows in the Manufacturer field."], R_CAT, R_COST,
   ["The window closes and the part is saved."], R_LIB,
   ["Exactly one entry has number 1, and it now shows the manufacturer you picked: an entry pointing to a manufacturer that no longer exists counts as having none."]],
  ["S7-R6d", "S7-R6b", "CN-S7-2", ("PO", "Chris Ward's answer 11 of 14 Oct 2026",
                                     "Old data only. Manufacturers can't be deleted in ShopView (context note under S7-R6d). Test it on existing data that has such an entry.")],
  design=D13)
