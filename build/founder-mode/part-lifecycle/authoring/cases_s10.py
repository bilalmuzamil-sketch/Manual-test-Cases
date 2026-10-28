"""Story 10 — Confirming and Recording a Status Change (SV-10823). Section 20477.
Phase B, 27 Oct 2026: every live case rewritten top to bottom against PRD v33 (Rule 134) in the QA lead's pattern.
Changed code S10-R22a (v31: the Min/Max entry shows only the pair that changed, both joined by " | " when both changed; Chris Ward on
SV-10823, 23 Oct 2026): S10-25 (both changed, from the window), S10-25b (split, Rule 136: only Max changed, and no entry when neither),
S10-26 (only Min changed, through the import).
Held on Q1 (how a core's own Part History page is opened): S10-22, S10-29.
No manual case: S10-N3 (a note over 255 characters: the field stops at 255), S10-N4 (a change with no parts: the button is disabled),
S10-R25a (public API); feedback rows 29 (server error), 38, 39 (requirement_map.py).
28 Oct 2026 named set (PRD v35; Chris Ward's answers 13 and 19 of 27 Oct 2026): S10-01 re-quoted (the standard confirmation has the
close X), S10-19 re-quoted (S5-E3); new S10-36 (S10-R11a: Esc and clicking outside do not close the confirmation; the X itself is
checked by "Design: Status confirmation has a close X in its title row"). S10-22 and S10-29 (the core's own Part History page, which
has no link on screen, answer 13) are kept unchanged and listed in ../full-pass-2026-10-27/NO-MANUAL-PROPOSAL.json."""
from pllib import C, PO_HOLD, HOLD, DESIGN_HOLD
from common import *
from cases_s6 import TYPE_A, ROW_A, SAVE, DEACT_CONF, ACT_CONF, PH

WRITTEN = True


DEACT_BAR = "Click Deactivate on the dark bar."
ACT_BAR = "Click Activate on the dark bar."
PICK_IN = "Click Inactive under Part Status."
PICK_ACT = "Click Active under Part Status."
CANCEL_CONF = "Click Cancel in the confirmation."
R_MENU = ["The menu opens."]
R_MODE = ["Bulk mode turns on."]
D33 = dict(boards=["3.3"], words=[note("Save raises \"Deactivate part?\"")])
D37 = dict(boards=["3.7"], words=[note("Active picked, then Save")])
D44 = dict(boards=["4.4"], words=[note("\"Deactivate parts?\", \"2 parts selected.\"")])
D45 = dict(boards=["4.5"], words=[note("\"2 parts updated.\" (S10-R12)")])
D47 = dict(boards=["4.7"], words=[note("\"Activate parts?\", \"2 parts selected.\"")])
D38 = dict(boards=["3.8"], words=[note("Typing \"superseded\" in the Part History search")])
D55 = dict(boards=["5.5"], words=[note("Turning tracking off writes")])
LINE_ON = "These parts won't show up when adding parts to work orders, estimates, part sales or purchase orders."
LINE_ON1 = "This part won't show up when adding parts to work orders, estimates, part sales or purchase orders."
EXIST, EXIST1 = "Existing records that use them stay as they are.", "Existing records that use it stay as they are."
STOCK = "Stock, cost of goods and QuickBooks aren't affected."
TWO_LOC = "Sign in as an Admin who can switch between two locations, the test location and location B, so the change can be seen at both."
BOTH = "Create a part, part A, for this test at the test location and at location B under the same part number, so both share one Part Library entry."

C("S10-01", "S10", "Saving a different Part Status asks to confirm first",
  [ADMIN, "Create an active part, part A, for this test.", "Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  [ROW_A, PICK_IN, SAVE, CANCEL_CONF, "Click Cancel."],
  [["Edit Inventory Part opens with a green \"Active\" pill."], ["Inactive is picked, and nothing is applied yet: the pill still reads a green \"Active\"."],
   ["Before anything changes, a confirmation titled \"Deactivate part?\" opens over the part window.",
    "It is the app's standard confirmation: a title with a close X at its right, message lines, a \"Note (Optional)\" field, Cancel and a red Deactivate button, and there is no word to type to confirm."],
   ["The confirmation closes."], ["The window closes and part A is still on the Active tab."]],
  ["S10-R1", "S10-R2", "S13-R21", "KD-11"], stories=[10, 13], design=D33, prd=35)

C("S10-02", "S10", "A bulk change that partly fails lists the failed part and its reason",
  [ADMIN, "Create two active parts for this test, part A and part B.", SHARED("parts A and B"), TWO_TABS, "Start in tab 1 on the Inventory page, on the Active tab."],
  [TYPE_SHARED, MENU, "Click Deactivate parts.", "Click the part A row.", "Click the part B row.", "Open a second browser tab on the same ShopView address.",
   "In tab 2, click Parts in the top bar.", "In tab 2, click Inventory in the left menu.", "In tab 2, type part B's part number in the Search box.",
   "In tab 2, click the part B row.", "In tab 2, click Inactive under Part Status.", "In tab 2, click Save.", "In tab 2, click Deactivate in the confirmation.",
   "Switch back to tab 1 without reloading it.", DEACT_BAR, DEACT_CONF, "Wait 10 seconds without closing the message."],
  [["Parts A and B are listed."], R_MENU, R_MODE, ["The part A row is ticked."], ["The bar reads 2 selected."], ["A second tab opens."],
   ["Tab 2 shows the Parts left menu."], ["Tab 2 shows the Inventory page."], ["Part B is listed in tab 2."], ["Edit Inventory Part opens for part B."],
   ["Inactive is picked."], ["The \"Deactivate part?\" confirmation opens."], ["Tab 2 shows \"Part deactivated.\": part B is now inactive."],
   ["Tab 1 still shows parts A and B ticked."], ["The \"Deactivate parts?\" confirmation reads \"2 parts selected.\""],
   ["A red message reads \"1 part updated, 1 could not be changed.\" and lists part B by its part number with the reason \"Part is already in that state.\"",
    "Part A leaves the Active tab; bulk mode stays on with only part B ticked (2 ticked = 1 changed + 1 failed)."],
   ["The red message is still on screen after 10 seconds: it stays until closed."]],
  ["S10-R12", "S10-R13", "S10-R13a", "UFS-30", "UFS-37", "S2-R15"], stories=[10, 2], design=D45)

C("S10-03", "S10", "A status change records who made it and when",
  [ADMIN, "Create an active part, part A, for this test.", "Write down the date and time on your computer clock just before step 1.",
   "Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  [ROW_A, PICK_IN, SAVE, DEACT_CONF, "Click the Inactive tab.", PH],
  [["Edit Inventory Part opens."], ["Inactive is picked."], ["The \"Deactivate part?\" confirmation opens; leave the note empty."],
   ["\"Part deactivated.\" shows and part A leaves the Active tab."], ["Part A is listed on the Inactive tab."],
   ["The newest Part History entry reads \"Deactivated\", with your name under Staff, today's date under Date, and under Time the time you wrote down or a minute or two later."]],
  ["S10-R14", "S10-R17"], design=D38)

C("S10-04", "S10", "Deactivating then reactivating keeps two Part History entries",
  [ADMIN, "Create an active part, part A, for this test.", "Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  [ROW_A, PICK_IN, SAVE, "Type Retired once in the Note (Optional) field.", DEACT_CONF, "Click the Inactive tab.", ROW_A, PICK_ACT, SAVE,
   "Type Back again in the Note (Optional) field.", ACT_CONF, "Click the Active tab.", PH],
  [["Edit Inventory Part opens."], ["Inactive is picked."], ["The \"Deactivate part?\" confirmation opens."], ["The note reads Retired once."],
   ["Part A leaves the Active tab."], ["Part A is listed on the Inactive tab."], ["Edit Inventory Part opens."], ["Active is picked."],
   ["The \"Activate part?\" confirmation opens."], ["The note reads Back again."], ["Part A leaves the Inactive tab."], ["Part A is listed on the Active tab."],
   ["Two separate entries show, newest first: \"Activated | Reason: Back again\" and \"Deactivated | Reason: Retired once\" (2 changes = 2 entries, each with its own note)."]],
  ["S10-R16", "S10-R17"], design=D38)

C("S10-05", "S10", "A Part History status entry reads with or without a note",
  [ADMIN, "Create two active parts for this test, part A and part B.", SHARED("parts A and B"), START],
  [TYPE_SHARED, ROW_A, PICK_IN, SAVE, "Type Worn out in the Note (Optional) field.", DEACT_CONF, "Click the part B row.", PICK_IN, SAVE, DEACT_CONF,
   "Click the Inactive tab.", PH, "Go back to the Inactive tab.", "Click the clock icon (Part History) at the left of the part B row."],
  [["Parts A and B are listed."], ["Edit Inventory Part opens for part A."], ["Inactive is picked."], ["The confirmation opens."], ["The note reads Worn out."],
   ["Part A leaves the Active tab."], ["Edit Inventory Part opens for part B."], ["Inactive is picked."], ["The confirmation opens; leave the note empty."],
   ["Part B leaves the Active tab."], ["Parts A and B are listed on the Inactive tab."],
   ["Part A's newest entry reads \"Deactivated | Reason: Worn out\"."], ["The Inactive tab shows again."],
   ["Part B's newest entry reads \"Deactivated\" with nothing after it (no \"| Reason:\")."]],
  ["S10-R17"], design=D38)

C("S10-06", "S10", "The bulk confirmation title and first line give the count",
  [ADMIN, "Create two active parts, part A and part B, and an inactive part, part C, for this test.", SHARED("parts A, B and C", 3), START],
  [TYPE_SHARED, MENU, "Click Deactivate parts.", "Click the part A row.", "Click the part B row.", DEACT_BAR, CANCEL_CONF, "Click the part B row.", DEACT_BAR,
   CANCEL_CONF, X, "Click the Inactive tab.", TYPE_SHARED_AGAIN, MENU2, "Click Activate parts.", "Click the part C row.", ACT_BAR, CANCEL_CONF],
  [["Parts A and B are listed."], R_MENU, R_MODE, ["The bar reads 1 selected."], ["The bar reads 2 selected."],
   ["Before anything changes, a confirmation titled \"Deactivate parts?\" opens, whose first line reads \"2 parts selected.\""],
   ["The confirmation closes and nothing changed."], ["Part B is unticked and the bar reads 1 selected."],
   ["The confirmation is titled \"Deactivate parts?\" and its first line reads \"1 part selected.\""], ["The confirmation closes."], ["Bulk mode ends."],
   ["The Inactive tab is selected."], ["Part C is listed."], R_MENU, R_MODE, ["The bar reads 1 selected."],
   ["The confirmation is titled \"Activate parts?\" and its first line reads \"1 part selected.\""],
   ["The confirmation closes and no part changed status."]],
  ["S10-R3", "S10-R4", "S10-R1"], design=dict(boards=["4.4", "4.7"]))

C("S10-07", "S10", "The bulk deactivation confirmation shows its three lines in order",
  [ADMIN, "Create two active parts for this test, part A and part B.", SHARED("parts A and B"), START],
  [TYPE_SHARED, MENU, "Click Deactivate parts.", "Click the part A row.", "Click the part B row.", DEACT_BAR, CANCEL_CONF, "Click the part B row.", DEACT_BAR, CANCEL_CONF],
  [["Parts A and B are listed."], R_MENU, R_MODE, ["The bar reads 1 selected."], ["The bar reads 2 selected."],
   [f"Under \"2 parts selected.\" the confirmation reads, in this order: \"{LINE_ON}\", \"{EXIST}\" and \"{STOCK}\""],
   ["The confirmation closes."], ["The bar reads 1 selected."],
   [f"With one part the lines read: \"{LINE_ON1}\", \"{EXIST1}\" and \"{STOCK}\""], ["The confirmation closes and nothing changed."]],
  ["S10-R5"], design=D44)

C("S10-08", "S10", "The reactivation confirmation from the part window has one line",
  [ADMIN, "Create an inactive part, part A, for this test.", START_INACTIVE],
  [TYPE_A, ROW_A, PICK_ACT, SAVE, CANCEL_CONF],
  [["Part A is listed on the Inactive tab."], ["Edit Inventory Part opens."], ["Active is picked."],
   ["The confirmation is titled \"Activate part?\": it shows part A's part number followed by its description, then \"This part can be added to new work again.\" and nothing more (no \"Existing records\" line and no \"Stock, cost of goods\" line), then the \"Note (Optional)\" field.",
    "The Activate button is blue."],
   ["The confirmation closes and part A stays on the Inactive tab."]],
  ["S10-R7", "S10-R4", "S10-R11"], design=D37)

C("S10-09", "S10", "The confirmation note field is labelled Note (Optional) and stops at 255",
  [ADMIN, "Create an active part, part A, for this test.", "Have a text of 300 characters ready to paste: 1234567890 written 30 times in a row (30 × 10 = 300).",
   "Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  [ROW_A, PICK_IN, SAVE, "Paste the 300 characters into the note field.", DEACT_CONF, "Click the Inactive tab.", PH],
  [["Edit Inventory Part opens."], ["Inactive is picked."], ["The confirmation opens; its note field is labelled \"Note (Optional)\"."],
   ["The field stops taking characters at 255: it ends with 25 full blocks of 1234567890 and then 12345 (25 × 10 + 5 = 255)."],
   ["Part A leaves the Active tab."], ["Part A is listed on the Inactive tab."],
   ["The newest entry reads \"Deactivated | Reason: \" followed by the 255 characters, ending 12345."]],
  ["S10-R10", "S10-R17"], design=D33)

C("S10-10", "S10", "Part History columns keep their width for a short entry",
  [ADMIN, "Have an inactive part, part A, whose newest Part History entry is a short \"Deactivated\".",
   "Have a part, part B, with a long \"Description updated\" entry in its Part History, so the two pages can be compared.",
   "Keep the browser window the same size for the whole test.", START_INACTIVE],
  [TYPE_A, PH, "Take a screenshot.", "Go back to the Inventory page.", "Click the Active tab.", "Type part B's part number in the Search box.",
   "Click the clock icon (Part History) at the left of the part B row.", "Take a second screenshot."],
  [["Part A is listed."], ["Part A's Part History shows the short \"Deactivated\" entry in the Event column."], ["The screenshot is saved."],
   ["The Inventory page shows."], ["The Active tab is selected."], ["Part B is listed."], ["Part B's Part History shows its long entry."],
   ["Side by side, the Staff, Date and Time columns have the same widths and positions on both pages: the short entry did not widen them."]],
  ["S10-R21"], design=dict(boards=["2.6"], words=[note("The entries are written at Lethbridge too")]))

C("S10-11", "S10", "The confirm button is red to deactivate and blue to activate",
  [ADMIN, "Create an active part, part A, and an inactive part, part B, for this test.", SHARED("parts A and B"), START],
  [TYPE_SHARED, ROW_A, PICK_IN, SAVE, CANCEL_CONF, "Click Cancel.", MENU, "Click Deactivate parts.", "Click the part A row.", DEACT_BAR, CANCEL_CONF, X,
   "Click the Inactive tab.", TYPE_SHARED_AGAIN, MENU2, "Click Activate parts.", "Click the part B row.", ACT_BAR, CANCEL_CONF],
  [["Part A is listed."], ["Edit Inventory Part opens."], ["Inactive is picked."], ["The confirmation shows a red Deactivate button with Cancel to its left."],
   ["The confirmation closes."], ["The window closes."], R_MENU, R_MODE, ["The bar reads 1 selected."],
   ["The confirmation shows a red Deactivate button with Cancel to its left."], ["The confirmation closes."], ["Bulk mode ends."], ["The Inactive tab is selected."],
   ["Part B is listed."], R_MENU, R_MODE, ["The bar reads 1 selected."], ["The confirmation shows a blue Activate button with Cancel to its left."],
   ["The confirmation closes and no part changed status."]],
  ["S10-R11"], design=dict(boards=["3.3", "4.7"]))

C("S10-12", "S10", "Cancelling the confirmation changes nothing",
  [ADMIN, "Create two active parts for this test, part A and part B.", SHARED("parts A and B"), START],
  [TYPE_SHARED, MENU, "Click Deactivate parts.", "Click the part A row.", "Click the part B row.", DEACT_BAR, CANCEL_CONF, X, ROW_A, PICK_IN, SAVE, CANCEL_CONF,
   "Click Cancel.", PH],
  [["Parts A and B are listed."], R_MENU, R_MODE, ["The bar reads 1 selected."], ["The bar reads 2 selected."], ["The \"Deactivate parts?\" confirmation opens."],
   ["The confirmation closes; parts A and B are still on the Active tab."], ["Bulk mode ends."], ["Edit Inventory Part opens for part A."], ["Inactive is picked."],
   ["The \"Deactivate part?\" confirmation opens."],
   ["The confirmation closes and the part window is back with Inactive still picked and the pill still a green \"Active\"."],
   ["The window closes and part A is still on the Active tab."], ["Part A's Part History has no \"Deactivated\" entry."]],
  ["S10-N1", "S13-R23"], stories=[10, 13], design=D33)

C("S10-13", "S10", "The part window's confirmation names the part as typed in the form",
  [ADMIN, "Create an active part, part A, for this test, with a description, description 1.", "Use a new description, description 2, that no part uses.",
   "Create an inactive part, part B, for this test, with a description, description 3.", SHARED("parts A and B"), START],
  [TYPE_SHARED, ROW_A, "Replace the Description with three spaces, description 2 and three spaces.", PICK_IN, SAVE, CANCEL_CONF, "Click Cancel.",
   "Click the Inactive tab.", TYPE_SHARED_AGAIN, "Click the part B row.", PICK_ACT, SAVE, CANCEL_CONF],
  [["Parts A and B are listed."], ["Edit Inventory Part opens for part A."], ["Description holds the spaces and description 2."], ["Inactive is picked."],
   ["The confirmation is titled \"Deactivate part?\" and its first line is part A's part number followed by description 2, without the spaces, not the saved description 1."],
   ["The confirmation closes."], ["The window closes without saving: part A keeps description 1 and stays active."], ["The Inactive tab is selected."],
   ["Part B is listed."], ["Edit Inventory Part opens for part B."], ["Active is picked."],
   ["The confirmation is titled \"Activate part?\" and its first line is part B's part number followed by description 3."],
   ["The confirmation closes."]],
  ["S10-R4", "S10-R3", "S10-N1"], design=D33)

C("S10-14", "S10", "The part window's deactivation confirmation shows its three lines in order",
  [ADMIN, "Create an active part, part A, for this test.", "Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  [ROW_A, PICK_IN, SAVE, CANCEL_CONF],
  [["Edit Inventory Part opens."], ["Inactive is picked."],
   [f"Under the part line the confirmation reads, in this order: \"{LINE_ON1}\", \"{EXIST1}\" and \"{STOCK}\""],
   ["The confirmation closes and part A stays active."]],
  ["S10-R6", "S10-N1"], design=D33)

C("S10-15", "S10", "The bulk reactivation confirmation shows its two lines",
  [ADMIN, "Create two inactive parts for this test, part A and part B.", SHARED("parts A and B"), START_INACTIVE],
  [TYPE_SHARED, MENU, "Click Activate parts.", "Click the part A row.", "Click the part B row.", ACT_BAR, CANCEL_CONF, "Click the part B row.", ACT_BAR, CANCEL_CONF],
  [["Parts A and B are listed."], R_MENU, R_MODE, ["The bar reads 1 selected."], ["The bar reads 2 selected."],
   [f"The confirmation reads \"Activate parts?\", \"2 parts selected.\", then \"These parts can be added to new work again.\" and \"{EXIST}\"",
    "There is no \"Stock, cost of goods\" line."],
   ["The confirmation closes."], ["The bar reads 1 selected."],
   [f"It reads \"1 part selected.\", then \"This part can be added to new work again.\" and \"{EXIST1}\""], ["The confirmation closes and nothing changed."]],
  ["S10-R8"], design=D47)

C("S10-16", "S10", "Confirmation lines use medium weight and grey as specified",
  [ADMIN, "Create an active part, part A, and an inactive part, part B, for this test.", SHARED("parts A and B"), LIGHT, START],
  [TYPE_SHARED, ROW_A, PICK_IN, SAVE, CANCEL_CONF, "Click Cancel.", "Click the Inactive tab.", TYPE_SHARED_AGAIN, MENU2, "Click Activate parts.",
   "Click the part B row.", ACT_BAR, CANCEL_CONF],
  [["Part A is listed."], ["Edit Inventory Part opens."], ["Inactive is picked."],
   [f"\"{EXIST1}\" is medium weight (a little bolder than the other lines).", f"\"{STOCK}\" is grey.",
    "The part line and the \"This part won't show up\" line are regular weight in the normal dark text colour."],
   ["The confirmation closes."], ["The window closes."], ["The Inactive tab is selected."], ["Part B is listed."], R_MENU, R_MODE, ["The bar reads 1 selected."],
   [f"\"{EXIST1}\" is medium weight; \"1 part selected.\" and \"This part can be added to new work again.\" are regular weight in the normal dark text colour."],
   ["The confirmation closes."]],
  ["S10-R9", "S10-R8"], design=dict(boards=["3.3", "4.7"]))

C("S10-17", "S10", "A bulk change that succeeds says how many parts were updated",
  [ADMIN, "Create three active parts for this test, part A, part B and part C.", SHARED("parts A, B and C", 3), START],
  [TYPE_SHARED, MENU, "Click Deactivate parts.", "Click the part A row.", "Click the part B row.", DEACT_BAR, DEACT_CONF, "Wait 10 seconds.",
   MENU2, "Click Deactivate parts.", "Click the part C row.", DEACT_BAR, DEACT_CONF],
  [["Parts A, B and C are listed."], R_MENU, R_MODE, ["The bar reads 1 selected."], ["The bar reads 2 selected."], ["The confirmation opens."],
   ["A green message reads \"2 parts updated.\" and parts A and B leave the Active tab."], ["The green message has gone on its own."],
   R_MENU, R_MODE, ["The bar reads 1 selected."], ["The confirmation opens."],
   ["A green message reads \"1 part updated.\" and part C leaves the Active tab."]],
  ["S10-R12", "UFS-28"], design=D45)

C("S10-18", "S10", "A bulk change lists a part deleted meanwhile as Part not found",
  [ADMIN, "Create two active parts for this test, part A and part B, that sit on no work order and no return.", SHARED("parts A and B"), TWO_TABS,
   "Start in tab 1 on the Inventory page, on the Active tab."],
  [TYPE_SHARED, MENU, "Click Deactivate parts.", "Click the part A row.", "Click the part B row.", "Open a second browser tab on the same ShopView address.",
   "In tab 2, click Parts in the top bar.", "In tab 2, click Inventory in the left menu.", "In tab 2, type part B's part number in the Search box.",
   "In tab 2, click the part B row.", "In tab 2, click Delete Part.", "Switch back to tab 1 without reloading it.", DEACT_BAR, DEACT_CONF],
  [["Parts A and B are listed."], R_MENU, R_MODE, ["The part A row is ticked."], ["The bar reads 2 selected."], ["A second tab opens."],
   ["Tab 2 shows the Parts left menu."], ["Tab 2 shows the Inventory page."], ["Part B is listed in tab 2."], ["Edit Inventory Part opens for part B."],
   ["Part B is deleted in tab 2."], ["Tab 1 still shows parts A and B ticked."], ["The confirmation opens."],
   ["A red message reads \"1 part updated, 1 could not be changed.\" and lists part B by its part number with the reason \"Part not found.\"",
    "Part A has left the Active tab."]],
  ["S10-R13", "S10-R13a", "UFS-36", "UFS-30"], design=D45)

C("S10-19", "S10", "A core has no row of its own to tick in Deactivate parts",
  [ADMIN, "Have an active part, part A, with a Core Charge above $0, so it has a core described Core for followed by part A's description.", START],
  [MENU, "Click Deactivate parts.", "Type Core for followed by part A's description in the Search box.", "Replace the search text with part A's part number.", X],
  [R_MENU, R_MODE, ["No row is listed for the core: it has no row of its own, so there is nothing to tick for it."],
   ["Exactly one row is listed, part A's own, with its core charge in the Core column."], ["Bulk mode ends and nothing has changed."]],
  ["S5-E3", "KD-8", "FO-10"], stories=[10, 5], design=dict(note="no board draws a core; the expected results above come from the quotes above."), prd=35)

C("S10-20", "S10", "A note of only spaces records no note",
  [ADMIN, "Create an active part, part A, for this test.", "Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  [ROW_A, PICK_IN, SAVE, "Type five spaces in the Note (Optional) field.", DEACT_CONF, "Click the Inactive tab.", PH],
  [["Edit Inventory Part opens."], ["Inactive is picked."], ["The confirmation opens."], ["The note field holds the spaces."],
   ["The change is accepted and part A leaves the Active tab."], ["Part A is listed on the Inactive tab."],
   ["The newest entry reads \"Deactivated\" and nothing more (no \"| Reason:\")."]],
  ["S10-R15", "S10-R17"], design=D38)

C("S10-21", "S10", "A bulk change of forty parts writes forty Part History entries",
  [ADMIN, "Create forty active parts for this test whose part numbers start with the same text, so one search lists all forty and no other part.", START],
  [TYPE_SHARED, "Scroll to the bottom of the list.", MENU, "Click Deactivate parts.", "Click the checkbox in the header row.", DEACT_BAR,
   "Type Bulk forty in the Note (Optional) field.", DEACT_CONF, "Click the Inactive tab.", TYPE_SHARED_AGAIN, "Scroll to the bottom of the list.",
   "Open the Part History of each of the forty parts in turn."],
  [["The first 30 parts are listed."], ["All 40 rows are loaded (30 + 10 = 40)."], R_MENU, R_MODE, ["The bar reads 40 selected."], ["The confirmation reads \"40 parts selected.\""],
   ["The note reads Bulk forty."], ["A green message reads \"40 parts updated.\""], ["The Inactive tab is selected."], ["The first 30 of the forty parts are listed."],
   ["All 40 rows are listed."],
   ["Each of the forty parts has exactly one new entry \"Deactivated | Reason: Bulk forty\": 40 parts × 1 entry = 40 entries, all with the same note."]],
  ["S10-R18", "UFS-28", "S2-R6"], design=D45)

# S10-22 (C425769) deleted 28 Oct 2026 with the QA lead's go-ahead ("Delete all 9"): a manual tester can no longer run it after
# Product answers 13/14 of 27 Oct (PRD v35 S5-E3, S9-R18a); see full-pass-2026-10-27/NO-MANUAL-PROPOSAL.json.

C("S10-23", "S10", "A status entry has Staff, Date and Time and can be searched",
  [ADMIN, "Create an active part, part A, for this test, so its Part History already holds its creation entries.",
   "Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  [ROW_A, PICK_IN, SAVE, DEACT_CONF, "Click the Inactive tab.", PH, "Type deactivated in the Part History search."],
  [["Edit Inventory Part opens."], ["Inactive is picked."], ["The confirmation opens."], ["Part A leaves the Active tab."], ["Part A is listed on the Inactive tab."],
   ["The \"Deactivated\" entry fills Staff, Date and Time like every other entry on the page."],
   ["The \"Deactivated\" entry is listed, and the creation entries are not."]],
  ["S10-R20", "S10-R27"], design=D38)

C("S10-24", "S10", "Turning tracking off and on writes two Part History entries",
  [ADMIN, "Create an active, tracked part, part A, for this test, with nothing on hand (quantity 0).",
   "Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  [ROW_A, "Click the Track quantities and cost of goods switch.", SAVE, ROW_A, "Click the Track quantities and cost of goods switch.", SAVE, PH],
  [["Edit Inventory Part opens with the switch on."], ["The switch turns off."], ["It saves with no confirmation and part A reads \"Not Tracked\"."],
   ["Edit Inventory Part opens with the switch off."], ["The switch turns on."], ["It saves and part A's Total Qty shows 0 again."],
   ["Two entries show, newest first: \"Tracking turned on\" and \"Tracking turned off\", written even with 0 on hand."]],
  ["S10-R22", "S5-R5"], design=D55)

C("S10-25", "S10", "Changing Min and Max in the part window writes one entry with both",
  [ADMIN, "Create a tracked part, part A, for this test, with Min 2 and Max 6.", "Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  [ROW_A, "Replace Min with 3.", "Replace Max with 8.", SAVE, PH],
  [["Edit Inventory Part opens."], ["Min reads 3."], ["Max reads 8."], ["The save goes through."],
   ["One new entry reads \"Min/Max updated | Min: 2 → 3 | Max: 6 → 8 | Source: Edit Part\": both pairs, Min first, joined by \" | \"."]],
  ["S10-R22a", ("JIRA", "SV-10823, Chris Ward, 23 Oct 2026",
                "Confirmed: A. Keep today's wording, showing only the pair that changed, e.g. \"Min/Max updated | Min: 2 → 4 | Source: Edit Part\". If both change, both pairs show. S10-R22a will be updated to match.")],
  design=D55)

C("S10-25b", "S10", "Changing only Max writes only the Max pair, and no change writes nothing",
  [ADMIN, "Create a tracked part, part A, for this test, with Min 2, Max 6 and Sell Price $20.00.",
   "Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  [ROW_A, "Replace Max with 9.", SAVE, ROW_A, "Replace the Sell Price with 21.00.", SAVE, PH],
  [["Edit Inventory Part opens."], ["Max reads 9."], ["The save goes through."], ["Edit Inventory Part opens."], ["Sell Price reads $21.00."], ["The save goes through."],
   ["One entry reads \"Min/Max updated | Max: 6 → 9 | Source: Edit Part\", with no Min pair.",
    "The Sell Price save added no second \"Min/Max updated\" entry: neither value changed."]],
  ["S10-R22a", ("JIRA", "SV-10823, Chris Ward, 23 Oct 2026",
                "Confirmed: A. Keep today's wording, showing only the pair that changed, e.g. \"Min/Max updated | Min: 2 → 4 | Source: Edit Part\". If both change, both pairs show. S10-R22a will be updated to match.")],
  part_of="S10-25", design=D55)

C("S10-26", "S10", "Changing only Min through the parts import writes an Import entry",
  [ADMIN, "Create a tracked part, part A, for this test, with Min 2 and Max 6.",
   "Have a parts import file with one row for part A with the same values except Min 4 (Max stays 6).",
   "Start on the Inventory data import page (Settings, then Data Import, then Inventory)."],
  ["Upload the file.", "Run the import.", "Click Parts in the top bar.", "Click Inventory in the left menu.", TYPE_A, PH],
  [["The file is ready to import."], ["The import finishes without errors."], ["The Parts left menu shows Inventory."], ["The Inventory page opens."], ["Part A is listed with Min 4."],
   ["An entry reads \"Min/Max updated | Min: 2 → 4 | Source: Import\", with no Max pair."]],
  ["S10-R22a", "S5-E1"], stories=[10, 5], design=dict(note="no board draws the parts import; the expected results above come from the quotes above."))

for key, field, title, quote, ufs in (
        ("S10-27", "part number", "Changing a part number is recorded at both locations with Changed at", "S10-R23", "UFS-12"),
        ("S10-28", "description", "Changing a description is recorded at both locations with Changed at", "S10-R24", "UFS-11")):
    entry = ("\"Part number updated | Original number:\" followed by part A's old number, \"| New number:\" and number 2" if field == "part number"
             else "\"Description updated | Original description:\" followed by description 1, \"| New description:\" and description 2")
    new = ("Use a new part number, number 2, that no part or Part Library entry uses." if field == "part number"
           else "Use a new description, description 2, that no part uses.")
    C(key, "S10", title,
      [TWO_LOC, BOTH.replace("under the same part number,", "under the same part number, with a description, description 1,") if field == "description" else BOTH,
       new, "Start at the test location on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
      [ROW_A, f"Replace the {'Part Number' if field == 'part number' else 'Description'} with {'number 2' if field == 'part number' else 'description 2'}.", SAVE,
       "Type the new value in the Search box.", "Click the clock icon (Part History) at the left of the part A row.",
       "Pick location B in the location selector at the top right.", "Click Parts in the top bar.", "Click Inventory in the left menu.",
       "Type the new value in the Search box.", "Click the clock icon (Part History) at the left of the part A row."],
      [["Edit Inventory Part opens."], [f"Under the field: \"This also changes the {field} at 1 other location.\""], ["The save goes through."],
       ["Part A is listed with the new value."], [f"The newest entry reads {entry}, with nothing after it."],
       ["The location selector shows location B."], ["The Parts left menu shows Inventory."], ["Location B's Inventory page opens."],
       ["Part A is listed at location B with the new value."],
       [f"The newest entry reads {entry}, followed by \"| Changed at:\" and the test location's name: it names the location where the change was made."]],
      [quote, "S10-R25", ufs], stories=[10, 13], design=dict(boards=["2.4", "2.6"], words=[note("The entries are written at Lethbridge too")]))

# S10-29 (C425777) deleted 28 Oct 2026 with the QA lead's go-ahead ("Delete all 9"): a manual tester can no longer run it after
# Product answers 13/14 of 27 Oct (PRD v35 S5-E3, S9-R18a); see full-pass-2026-10-27/NO-MANUAL-PROPOSAL.json.

C("S10-30", "S10", "Part History search finds entries by their text or staff name, in any case",
  [ADMIN, "Create a part, part A, for this test, then deactivate it with the note Superseded Kit, reactivate it with no note and turn its tracking off, so its Part History holds those three entries from you.",
   "Start on part A's Part History page (the clock icon at the left of its row)."],
  ["Type superseded kit in the Part History search.", "Replace the text with TRACKING TURNED.", "Replace the text with your first name in lower case.", "Clear the search."],
  [["Only \"Deactivated | Reason: Superseded Kit\" is listed."], ["Only \"Tracking turned off\" is listed."],
   ["Every entry you made on part A is listed: a Staff name match counts too."], ["All of part A's entries are back."]],
  ["S10-R27"], design=D38)

C("S10-31", "S10", "Part History search shows only the bin rows that match",
  [ADMIN, "Have a part, part A, whose Part History has one entry split into a bin location A row and a bin location B row.",
   "Start on part A's Part History page (the clock icon at the left of its row)."],
  ["Type bin location A's name in the Part History search.", "Replace the text with the Staff name shown on that entry."],
  [["Part A's entry shows only its bin location A row; the bin location B row is hidden."], ["Part A's entry shows both bin rows: a Staff name match shows every bin row."]],
  ["S10-R28"], design=dict(note="no board draws a split entry; the expected results above come from the quotes above."))

C("S10-32", "S10", "Prices in Part History can be searched only by users who see prices",
  [ADMIN, f"Create a custom role for this test, role B, with Part Library & Inventory — View and See Financial Data off, so user B cannot see prices.",
   "Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions.",
   "Use a second browser window (a private window) signed in as user B.",
   "Create a part, part A, for this test with Sell Price $20.00, then change its Sell Price to 23.45, so its Part History holds a price entry.",
   "Start window 1 on part A's Part History page (the clock icon at the left of its row)."],
  ["In window 1, type 23.45 in the Part History search.", "In the second window, open part A's Part History page.", "In the second window, type 23.45 in the Part History search.",
   "In the second window, clear the search."],
  [["The price entry is listed for the Admin."], ["Part A's Part History opens for user B."], ["No entry is found for user B by the price."],
   ["User B's list shows part A's entries again, the price entry among them: only the price search was refused."]],
  ["S10-R29"], design=dict(note="no board draws a price entry; the expected results above come from the quotes above."))

C("S10-33", "S10", "A bulk change where every part fails keeps the selection",
  [ADMIN, "Create two active parts for this test, part A and part B.", SHARED("parts A and B"), TWO_TABS, "Start in tab 1 on the Inventory page, on the Active tab."],
  [TYPE_SHARED, MENU, "Click Deactivate parts.", "Click the part A row.", "Click the part B row.", "Open a second browser tab on the same ShopView address.",
   "In tab 2, click Parts in the top bar.", "In tab 2, click Inventory in the left menu.", "In tab 2, type the shared start of the part numbers in the Search box.",
   "In tab 2, click the three-dot actions button (⋮).", "In tab 2, click Deactivate parts.", "In tab 2, click the part A row.", "In tab 2, click the part B row.",
   "In tab 2, click Deactivate on the dark bar.", "In tab 2, click Deactivate in the confirmation.", "Switch back to tab 1 without reloading it.", DEACT_BAR, DEACT_CONF,
   "Wait 10 seconds without closing the message."],
  [["Parts A and B are listed."], R_MENU, R_MODE, ["The part A row is ticked."], ["The bar reads 2 selected."], ["A second tab opens."],
   ["Tab 2 shows the Parts left menu."], ["Tab 2 shows the Inventory page."], ["Parts A and B are listed in tab 2."], ["The menu opens in tab 2."], ["Bulk mode turns on in tab 2."],
   ["The part A row is ticked in tab 2."], ["Tab 2's bar reads 2 selected."], ["The confirmation opens in tab 2."],
   ["Tab 2 shows \"2 parts updated.\": parts A and B are now inactive."], ["Tab 1 still shows parts A and B ticked."], ["The confirmation opens."],
   ["A red message reads \"No parts were changed.\" and lists parts A and B, each with \"Part is already in that state.\"",
    "The list stays on screen, bulk mode stays on and both parts are still ticked (the bar reads 2 selected), ready to retry."],
   ["The red message is still on screen after 10 seconds: it stays until closed."]],
  ["S10-N2", "UFS-31", "UFS-37"], design=D45)

C("S10-34", "S10", "With nothing ticked, the bulk button cannot open a confirmation",
  [ADMIN, "Create an active part, part A, for this test.", "Start on the Inventory page, on the Active tab, with part A's part number typed in the Search box."],
  [MENU, "Click Deactivate parts.", "Hover over Deactivate on the dark bar.", DEACT_BAR, "Click the part A row."],
  [R_MENU, ["Bulk mode turns on and the bar reads 0 selected."], ["The button is disabled and its hover text reads \"Tick the parts to deactivate\"."],
   ["No confirmation opens: a change with no parts cannot be sent from the screen."],
   ["The bar reads 1 selected and the Deactivate button is no longer disabled."]],
  ["S2-N1", "S2-R8", "UFS-32"], stories=[10, 2], design=dict(boards=["4.2"], words=[note("A checkbox column appears at the left")]))

C("S10-35", "S10", "The bulk change count does not count the cores that change with their parts",
  [ADMIN, "Create two active parts for this test, part A and part B, each with a Core Charge above $0, so each has a core.", SHARED("parts A and B"), START],
  [TYPE_SHARED, MENU, "Click Deactivate parts.", "Click the part A row.", "Click the part B row.", DEACT_BAR, DEACT_CONF],
  [["Parts A and B are listed, each with its core charge in the Core column and no separate core row."], R_MENU, R_MODE, ["The bar reads 1 selected."],
   ["The bar reads 2 selected."], ["The confirmation reads \"2 parts selected.\""],
   ["Parts A and B leave the Active tab without a page reload.",
    "A green message reads \"2 parts updated.\": the 2 ticked parts are counted and their 2 cores are not (2, not 2 + 2 = 4)."]],
  ["S10-R12", "S10-R12a", "UFS-28", ("JIRA", "SV-10823 acceptance criteria",
                                       "Given two parts that both have a core, when they are deactivated in bulk, then the message reads \"2 parts updated.\"")],
  design=D45)

C("S10-36", "S10", "Pressing Esc or clicking outside does not close a status confirmation",
  [ADMIN, "Create two active parts for this test, part A and part B.", SHARED("parts A and B"), NO_COUNT, START],
  [TYPE_SHARED, ROW_A, PICK_IN, SAVE, "Press Esc.", "Click the page area outside the confirmation, away from any button.", CANCEL_CONF, "Click Cancel.",
   MENU, "Click Deactivate parts.", "Click the part B row.", DEACT_BAR, "Press Esc.", "Click the page area outside the confirmation, away from any button.",
   CANCEL_CONF, X],
  [["Parts A and B are listed."], ["Edit Inventory Part opens for part A."], ["Inactive is picked."], ["The \"Deactivate part?\" confirmation opens."],
   ["The confirmation stays open: Esc does not close it."], ["The confirmation still stays open: clicking outside it does not close it."],
   ["The confirmation closes; Edit Inventory Part shows again with Inactive still picked and the green \"Active\" pill: nothing was saved."],
   ["The window closes and part A is still listed on the Active tab."],
   R_MENU, R_MODE, ["The bar reads 1 selected."], ["The \"Deactivate parts?\" confirmation opens, reading \"1 part selected.\""],
   ["The confirmation stays open: Esc does not close it."], ["The confirmation still stays open: clicking outside it does not close it."],
   ["The confirmation closes; part B is still ticked and still listed on the Active tab."], ["Bulk mode ends and part B is still listed on the Active tab."]],
  ["S10-R11a", "S13-R23", "S10-N1", "S10-R4", A19], stories=[10, 13],
  design=dict(boards=["3.3", "4.4"], words=[note("Save raises \"Deactivate part?\"")]), prd=35)
