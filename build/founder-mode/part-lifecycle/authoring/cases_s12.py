"""Story 12 — Call the Shared Parts List the Part Library (SV-10825). Section 20479.
Phase C, 27 Oct 2026: every live case rewritten top to bottom against PRD v33 in the QA lead's pattern (Rule 117 fourteenth and
fifteenth amendments; Rules 134-137). Changed code S12-R14b (v30, 19 Oct: the result also uses the most recent delivery's cost) is in
S12-14. S12-06 stays held on question Q3 (does an open Edit Library Part window update its Delete button without a reload). The
"Part Library entry not found for ID / for part number", "Part Library entry missing category." and Vendor-source refusals of S12-R11
have no screen route named by any source: NO MANUAL in pc_common.py, question Q-C1. "Not received" and "other location" cases now carry
a control the tester can see (a received number that IS offered with its vendor), lesson L-15."""
from pllib import C, PO_HOLD, HOLD, DESIGN_HOLD
from common import *
from pc_common import *

WRITTEN = True
START_RP = "Start on Roles & Permissions (Settings, then Roles & Permissions)."
START_WO1 = "Start on work order 1 (Work Orders in the top bar, then open work order 1)."
ADD_PART = "In the Parts row of the line, click + Add Part."
CLOSE_NPR = "Click the X at the top right of the New Part Request window."
ENTRY_NO_PART = ("Create a Part Library entry with no part behind it for this test, entry A: create a part at the test location, then delete it, so "
                 "the entry stays with \"Total parts\" 0.")
TECH_Q9 = ("TECH", "§1 Clarifications, Q9 S12-R11 copy", "Delete refusal \"This Part Library entry is in use and cannot be deleted.\"")
TECH_PS = ("TECH", "Phase 7 frontend changes, PartSelect.vue", "so the special-order lookup reads \"Part Library · {vendor}\" (S12-R10, S12-R14)")

C("S12-01", "S12", "The Parts menu, page title and browser tab read Part Library",
  [ADMIN, "Have a part, part A, at the test location, so the Part Library lists an entry to open.", "Start on the Work Orders page (Work Orders in the top bar)."],
  [PARTS, TO_PL, TYPE_A, ROW_A],
  [["Under PARTS the left menu reads \"Inventory\" and \"Part Library\"; there is no \"Catalog\" entry."],
   ["The page title reads \"Part Library\".", "The browser tab's title reads \"Part Library\"."],
   ["Part A's entry is listed."],
   ["On the entry's detail page the browser tab's title reads \"Library Part\"."]],
  ["S12-R1", "S12-R2", "S12-R12", "CN-S12-1"],
  design=dict(boards=["7.1"], words=[note("Called Part Library in the side menu")]))

C("S12-02", "S12", "Deleting an unused Part Library entry asks and confirms in Part Library words",
  [ADMIN, ENTRY_NO_PART, START_PL],
  ["Type entry A's part number in the Search box.", "Click the entry A row.", PENCIL, "Click Delete at the bottom left of the window.",
   "Confirm the deletion.", PARTS, TO_PL, "Type entry A's part number in the Search box."],
  [["Entry A is listed."], ["Its detail page opens and shows \"Total parts\" 0."],
   ["The \"Edit Library Part\" window opens.", "A Delete button sits at the bottom left of the window and is enabled, because no part uses the entry."],
   ["A confirmation asks \"Are you sure you want to delete this library part?\""],
   ["The entry is deleted and a green message reads \"Library part deleted successfully.\""],
   ["The Parts left menu shows Part Library."], ["The Part Library page opens."],
   ["No entry is listed for entry A's number: the deletion shown in the green message took effect."]],
  ["S12-R13", "S12-R5", "S11-R3", PO12, QA4],
  design=dict(boards=["7.2"]))

C("S12-03", "S12", "Roles & Permissions shows the Part Library and Inventory permission group",
  [ADMIN, "Create a custom role for this test, role A, so no shared role is opened.", START_RP],
  ["Click the edit (pencil) button of role A.", CANCEL],
  [["The Edit Role page opens for role A.",
    "The Parts Department card description reads \"Manage parts inventory, part library, sales, and vendor operations.\"",
    "The permission group under it is titled \"Part Library and Inventory\".",
    "The group's description reads \"Manage the parts library and inventory levels.\"",
    "Its three permission labels read \"Part Library & Inventory — View\", \"Part Library & Inventory — Create & Edit\" and \"Part Library & Inventory — Delete\".",
    "The word \"Catalog\" appears nowhere in the card or the group, which show the words above instead."],
   ["The page closes without saving and role A is unchanged."]],
  ["S12-R6", "S12-R7", "S12-R8", "S12-R9"],
  design=dict(note="no board draws Roles & Permissions; the expected results above come from the quotes above."))

C("S12-04", "S12", "An old bookmark to the Catalog page opens the Part Library",
  [ADMIN, "Have a bookmark, saved before this release, to the Catalog page (your ShopView address followed by /parts/parts-catalogue).",
   "Start on any page of the app in the same browser."],
  ["Open the bookmark."],
  [["The page opens without an error or a \"page not found\" message.",
    "Its title reads \"Part Library\".",
    "The browser's address bar still shows the bookmarked address: the page's address has not changed."]],
  ["S12-N2", "S12-R2",
   ("JIRA", "SV-10825, acceptance criteria", "Given a bookmark to the old Catalog page, when it is opened, then the Part Library opens."),
   ("TECH", "Phase 9 frontend changes", "The route paths stay the same (S12-N2)")],
  design=dict(boards=["7.1"]))

C("S12-05", "S12", "The edit window for a Part Library entry is titled Edit Library Part",
  [ADMIN, "Have a part, part A, at the test location, so its Part Library entry can be opened.", START_PL],
  [TYPE_A, ROW_A, PENCIL, CANCEL],
  [["Part A's entry is listed."], ["The entry's detail page opens."],
   ["The window the pencil opens is titled \"Edit Library Part\", not \"Edit Catalog Part\"."],
   ["The window closes without changes."]],
  ["S12-R3", "S11-R3"],
  design=dict(boards=["7.2"], words=[note("Clicking a row opens the entry")]))

C("S12-06", "S12", "Deleting a Part Library entry that a part now uses is refused",
  [ADMIN, ENTRY_NO_PART, TWO_TABS, "Start in browser tab 1 on the Part Library page (Parts in the top bar, then Part Library in the left menu)."],
  ["In tab 1, type entry A's part number in the Search box.", "In tab 1, click the entry A row.",
   "In tab 1, click the pencil icon beside the entry's name in the Part details panel.", "Open a second browser tab on the same ShopView address.",
   "In tab 2, click Parts in the top bar.", "In tab 2, click Inventory in the left menu.", "In tab 2, click New Inventory Part.",
   "In tab 2, type entry A's description in Description.", "In tab 2, type entry A's part number in Part Number, exactly as the entry has it.",
   "In tab 2, pick any category in Category.", "In tab 2, type 10.00 in Cost.", "In tab 2, click Save.", "Switch back to tab 1 without reloading it.",
   "In tab 1, click Delete.", "In tab 1, confirm the deletion.", WAIT5, "In tab 1, click Parts in the top bar.", "In tab 1, click Part Library in the left menu.",
   "In tab 1, type entry A's part number in the Search box.", "In tab 1, click the entry A row."],
  [["Entry A is listed."], ["Its detail page opens and shows \"Total parts\" 0."],
   ["The \"Edit Library Part\" window opens and its Delete button, bottom left, is enabled, because no part uses the entry yet."],
   ["A second tab opens."], ["Tab 2 shows the Parts left menu."], ["Tab 2 shows the Inventory page."], ["The \"New Inventory Part\" window opens in tab 2."],
   ["Description shows entry A's description."], ["Part Number shows entry A's number."], ["Category shows the category you picked."], ["Cost shows 10.00."],
   ["The window closes in tab 2 and the part is saved."],
   ["Tab 1 still shows the Edit Library Part window: it was not reloaded."],
   ["The confirmation asks \"Are you sure you want to delete this library part?\""],
   ["The delete is refused: a red message reads \"This Part Library entry is in use and cannot be deleted.\", with a smaller second line \"Please try to resolve this.\""],
   ["The red message has closed on its own after about 3 seconds."],
   ["Tab 1 shows the Parts left menu."], ["The Part Library page opens."], ["Entry A is still listed."],
   ["Its detail page shows \"Total parts\" 1: the part saved in tab 2 uses it."]],
  ["S12-R11", "S12-R13", "UFS-46", "CN-S13-3", "S11-R3c", TECH_Q9],
  marker=PO_HOLD("Q3", "whether an open Edit Library Part window updates its Delete button without a reload"),
  design=dict(boards=["7.2"]))

C("S12-07", "S12", "Saving a Part Library entry deleted in another tab is refused",
  [ADMIN, ENTRY_NO_PART, "Use a new description for entry A, description 1.", TWO_TABS,
   "Start in browser tab 1 on the Part Library page (Parts in the top bar, then Part Library in the left menu)."],
  ["In tab 1, type entry A's part number in the Search box.", "In tab 1, click the entry A row.",
   "In tab 1, click the pencil icon beside the entry's name in the Part details panel.", "In tab 1, replace the Description with description 1.",
   "Open a second browser tab on the same ShopView address.", "In tab 2, click Parts in the top bar.", "In tab 2, click Part Library in the left menu.",
   "In tab 2, type entry A's part number in the Search box.", "In tab 2, click the entry A row.", "In tab 2, click the pencil icon beside the entry's name.",
   "In tab 2, click Delete.", "In tab 2, confirm the deletion.", "Switch back to tab 1 without reloading it.", "In tab 1, click Save.",
   "In tab 1, click Parts in the top bar.", "In tab 1, click Part Library in the left menu.", "In tab 1, type entry A's part number in the Search box."],
  [["Entry A is listed."], ["Its detail page opens."], ["The \"Edit Library Part\" window opens."], ["The Description field shows description 1."],
   ["A second tab opens."], ["Tab 2 shows the Parts left menu."], ["Tab 2 shows the Part Library page."], ["Entry A is listed in tab 2."],
   ["Its detail page opens in tab 2."], ["The \"Edit Library Part\" window opens in tab 2."],
   ["The confirmation asks \"Are you sure you want to delete this library part?\""],
   ["Tab 2 shows \"Library part deleted successfully.\""],
   ["Tab 1 still shows the Edit Library Part window with description 1 typed."],
   ["The save is refused with a red message that reads only \"Part Library entry not found.\", with the smaller second line \"Please try to resolve this.\"",
    "\"Failed to save library part.\" does not appear beside it, and no message uses the word \"catalog\" or \"catalogue\"."],
   ["Tab 1 shows the Parts left menu."], ["The Part Library page opens."],
   ["No entry is listed for entry A's number: the refused save did not make it again."]],
  ["S11-E4", "S12-R4", "S12-R5", "S12-R11", "CN-S13-3",
   ("PO", "Chris Ward, 9 Oct 2026, answer 8", "B) \"Part Library entry not found.\" New S11-E4."),
   ("PO", "Chris Ward, 14 Oct 2026, answer 1", "Only \"Part Library entry not found.\" (S11-E4). \"Failed to save library part.\" shows only when a save fails for a reason the page doesn't name (S12-R4).")],
  design=dict(boards=["7.2"]))

C("S12-08", "S12", "A part lookup result from the shared list shows Part Library as its source",
  [ADMIN, "Have a part, part A, at the test location with 5 on hand, so the lookup offers it both from stock and from the Part Library.",
   "Create a work order for this test, work order 1, with a line.", START_WO1],
  [ADD_PART, "Type part A's part number in Part Number.", CLOSE_NPR],
  [["The \"New Part Request\" window opens."],
   ["Two results are offered for part A: one reads \"Inventory Qty: 5\" with its unit, and the other shows \"Part Library\" as its source.",
    "No result says \"Catalog\"."],
   ["The window closes, and work order 1's line shows no new part request."]],
  ["S12-R10"],
  design=dict(boards=["6.1"], words=[note("New Part Request on work order S2-9647.")]))

C("S12-09", "S12", "A special-order lookup result shows Part Library and its vendor",
  [ADMIN, "Have a vendor, vendor A.",
   "Have a special-order number that the test location received from vendor A on a special-order line of a work order within the last 12 months, and that is not an inventory part here.",
   "Create a work order for this test, work order 1, with a line.", START_WO1],
  [ADD_PART, "Type the special-order number in Part Number.", CLOSE_NPR],
  [["The \"New Part Request\" window opens."],
   ["The special-order number is offered as a result, and its source reads \"Part Library · \" followed by vendor A's name: the words Part Library, a middle dot, then the vendor.",
    "No result says \"Catalog\"."],
   ["The window closes, and work order 1's line shows no new part request."]],
  ["S12-R14", "S12-R14a", PO14_2, TECH_PS],
  design=dict(boards=["6.1"]))

C("S12-10", "S12", "Release day leaves every role's permissions as they were",
  [ADMIN, "Have a custom role from before this release, role A, with View and Create & Edit ticked and Delete unticked in the parts inventory group.",
   "Have a screenshot of role A's permissions taken before this release, so they can be compared.",
   "Use a second browser, or a private window, signed in as user B, who has had role A since before this release.", START_RP],
  ["Click the edit (pencil) button of role A.", CANCEL, "In browser 2, as user B, click Parts in the top bar.", "In browser 2, click Inventory in the left menu.",
   "In browser 2, click any part row."],
  [["Exactly the same permissions are ticked as in the screenshot: under the renamed group \"Part Library and Inventory\", View and Create & Edit are ticked and Delete is not.",
    "No permission was added, removed or moved."],
   ["The page closes without saving."], ["User B's Parts left menu shows Inventory."],
   ["User B can open the Inventory list, as on the day before the release."],
   ["The part window opens for user B without a Delete Part button, because role A still has no Delete."]],
  ["S12-N1", "S12-R6", "S8-R12"],
  design=dict(note="no board draws Roles & Permissions; the expected results above come from the quotes above."))

C("S12-11", "S12", "Release day keeps saved names that contain the word Catalog",
  [ADMIN, "Have a custom role from before this release, role A, whose name contains the word Catalog.",
   "Have a part from before this release, part A, whose description contains the word Catalog.", START_RP],
  ["Click the edit (pencil) button of role A.", CANCEL, PARTS, TO_INV, TYPE_A, TO_PL, TYPE_A],
  [["Role A's name reads exactly as it was saved before this release, including the word Catalog."],
   ["The page closes without saving."], ["The Parts left menu shows Inventory."], ["The Inventory page opens."],
   ["Part A's description still reads as typed before this release, including the word Catalog."],
   ["The Part Library page opens."],
   ["Part A's Part Library entry shows the same description: saved data was not renamed, only the screen's own words changed."]],
  ["S12-N3", "CN-S12-1"],
  design=dict(note="no board draws saved names; the expected results above come from the quotes above."))

C("S12-12", "S12", "A special order not yet received is not offered with its vendor",
  [ADMIN, "Have a vendor, vendor A.",
   "Have a special-order number that the test location received from vendor A within the last 12 months, the received number, so the lookup has a result it must show with vendor A.",
   "Create a special order for this test from vendor A on a work order line, with a new part number, the ordered number, and order it, but receive it nowhere.",
   "Create a work order for this test, work order 1, with a line.", START_WO1],
  [ADD_PART, "Type the received number in Part Number.", "Replace the Part Number text with the ordered number.", CLOSE_NPR],
  [["The \"New Part Request\" window opens."],
   ["The received number is offered with the source \"Part Library · \" followed by vendor A's name."],
   ["No result for the ordered number shows the source \"Part Library · \" with vendor A's name: a number ordered but not yet received is not a special-order result."],
   ["The window closes, and work order 1's line shows no new part request."]],
  ["S12-R14a", "S12-R14", PO14_2],
  design=dict(boards=["6.1"]))

C("S12-13", "S12", "A special order received only at another location is not offered with its vendor",
  [ADMIN_TWO, "Have a vendor, vendor A.",
   "Have a special-order number that location B received from vendor A on a special-order line within the last 12 months; the test location never received it and does not stock it.",
   "Create a work order for this test at the test location, work order 1, with a line.",
   "Create a work order for this test at location B, work order 2, with a line.", START_WO1],
  [ADD_PART, "Type the special-order number in Part Number.", CLOSE_NPR, TO_B, "Click Work Orders in the top bar.", "Open work order 2.", ADD_PART,
   "Type the special-order number in Part Number.", CLOSE_NPR],
  [["The \"New Part Request\" window opens on work order 1 at the test location."],
   ["No result shows \"Part Library · \" with vendor A's name, because the test location did not receive the number.",
    "The number is offered from the shared list with the source \"Part Library\" alone."],
   ["The window closes."], ["The location selector shows location B."], ["Location B's Work Orders list opens."], ["Work order 2 opens."],
   ["The \"New Part Request\" window opens at location B."],
   ["At location B the number is offered with the source \"Part Library · \" followed by vendor A's name."],
   ["The window closes, and work order 2's line shows no new part request, nor does work order 1's."]],
  ["S12-R14a", "S12-R14", "S12-R10", "S11-R6"],
  design=dict(boards=["6.1"]))

C("S12-14", "S12", "The special-order result uses the vendor and cost of the latest delivery",
  [ADMIN, "Have two vendors, vendor A and vendor B.",
   "Create a special-order part number for this test that the test location ordered from vendor A first and from vendor B second, but received from "
   "vendor B first at a cost of $12.00 and from vendor A last at a cost of $15.00, all within the last 12 months, so vendor A made the most recent delivery.",
   "Create a work order for this test, work order 1, with a line.", START_WO1],
  [ADD_PART, "Type the special-order number in Part Number.", "Click the special-order result for the number.", CLOSE_NPR],
  [["The \"New Part Request\" window opens."],
   ["The special-order result shows its source as \"Part Library · \" followed by vendor A's name, the vendor of the most recent delivery.",
    "It does not name vendor B, although vendor B was ordered from last."],
   ["The result is picked and the Cost field shows 15.00, the cost of vendor A's delivery, not 12.00."],
   ["The window closes, and work order 1's line shows no new part request."]],
  ["S12-R14b", "S12-R14a", "S12-R14", PO14_2],
  design=dict(boards=["6.1"]),
  claude=["Where the cost shows is our reading of S12-R14b (\"uses that delivery's cost\"): the picked result fills Cost. Question Q-C2 asks Product to confirm."])
