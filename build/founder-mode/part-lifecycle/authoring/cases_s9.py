"""Story 9 — Inactive Parts Cannot Be Added to New Work (SV-10822). Section 20476.
Phase B, 27 Oct 2026: every live case rewritten top to bottom against PRD v33 (Rule 134) in the QA lead's pattern.
Changed code S9-N3a (v31: access to Parts → Returns stays as today's Vendor Order Management settings give; Vendor Order Management →
Create & Edit includes Part Library & Inventory → View; Chris Ward on SV-10822, 23 Oct 2026): S9-28 now checks that such a role can
search parts on a return; S9-41 and S9-42 compare the build with production (today's app) for the same role, since the PRD names no
access beyond "today's" (question Q11 asks the PO to state it).
New cases: S9-43 to S9-46 (S9-R21, "Not Tracked" in place of "Inventory Qty" in the part lookups) and S9-47, S9-48 (S9-R22, an
untracked part keeps its "In Stock" badge). No manual case: S9-E9 (the public API create refusal; requirement_map.py)."""
from pllib import C, PO_HOLD, HOLD, DESIGN_HOLD
from common import *
from cases_s6 import TYPE_A, ROW_A, SAVE, DEACT_CONF, GS_OPEN

WRITTEN = True


MSG = "is inactive. Activate it from the Inactive tab to use it."
INAMSG = f"The lookup shows part A's part number, written as it was saved (capitals and hyphens), followed by \"{MSG}\""
INAB = ["Have an inactive part, part A, with 4 on hand and a hyphen in its part number.",
        "Have an active part, part B, with 4 on hand, so the lookup has a part it must still offer.",
        "Give parts A and B part numbers that start with the same text, and descriptions that start with the same text, so one search finds both."]
WO1 = "Create an open work order, work order 1, for this test, with an approved line, line 1, that holds no parts."
ST_WO1 = "Start on work order 1, on its Lines tab."
ADDP = "Click Add Part under line 1."
R_NPR = ["The New Part Request window opens for line 1 of work order 1, with the Part Number field."]
HALF = "Type the shared start of the part numbers in the Part Number field."
DESC = "Replace the text with the shared start of the descriptions."
FULL = "Replace the text with part A's part number in lower case."
XCLOSE = "Click the X at the top right of the window."
R_HALF = ["Part B is offered.", "No row for part A is offered: neither an inventory row with \"Inventory Qty\" nor a \"Part Library\" row."]
R_DESC = ["Part B is offered.", "Again no row for part A is offered."]
R_FULL = [INAMSG + ".", "No offer to add the number as a special order appears."]
JAC_LOOK = ("JIRA", "SV-10822 acceptance criteria",
            "Given GREASETUBE is inactive, when the user searches \"GREASE\" on a work order, estimate, part sale, purchase order or technician charge-out, then it is not offered, neither as an inventory part nor as a Part Library entry.")
JAC_FULL = ("JIRA", "SV-10822 acceptance criteria",
            "Given GREASETUBE is inactive, when the user types \"greasetube\" in full in a part lookup, then no special order is offered and the lookup shows \"GREASETUBE is inactive. Activate it from the Inactive tab to use it.\"")
D61 = dict(boards=["6.1", "6.2"], words=[note("The same search returns \"No results\"")])
D63 = dict(boards=["6.3"], words=[note("Typing greasetube in full")])
D65 = dict(boards=["6.4", "6.5"], words=[note("The line is added without GREASETUBE")])
TECH_A = "Sign in as a staff member with the default Technician role, technician A, who is a technician on line 1."
TABS = ["Open a second browser tab on the same ShopView address.", "In tab 2, click Parts in the top bar.", "In tab 2, click Inventory in the left menu.",
        "In tab 2, type part A's part number in the Search box.", "In tab 2, click the part A row.", "In tab 2, click Inactive under Part Status.",
        "In tab 2, click Save.", "In tab 2, click Deactivate in the confirmation.", "Switch back to tab 1 without reloading it."]
R_TABS = [["A second tab opens."], ["Tab 2 shows the Parts left menu."], ["Tab 2 shows the Inventory page."], ["Part A is listed in tab 2."],
          ["Edit Inventory Part opens for part A in tab 2."], ["Inactive is picked."], ["The \"Deactivate part?\" confirmation opens."],
          ["Tab 2 shows \"Part deactivated.\" and part A leaves the Active tab: part A is now inactive."], ["Tab 1 still shows the unsaved part A."]]
R_REFUSED = [f"The save is refused with a red message: part A's part number followed by \"{MSG}\"",
             "A second, smaller line reads \"Please try to resolve this.\"", "Part A is not added."]
R_FADE = ["The red message has gone on its own (it fades after about 3 seconds)."]
REFUSE_Q = ["S9-R17", "UFS-45", "CN-S13-3", "FO-6"]
CANNED = "Click New Line."
CJ_T = "Type the start of canned job A's title in the Title field."
CJ_P = "Click the canned job A suggestion."
CJ_S = "Click Save & Close."
CREDIT = ["Click the Finance tab.", "Click the three-dot button on the invoice.", "Click Issue Credit.", "Tick Parts are being returned."]
V, CE = "Part Library & Inventory — View", "Part Library & Inventory — Create & Edit"
PROD = ("Have a ShopView account on production (app.shopview.com, which does not have this release yet) where you can create a role and a "
        "staff member, so today's access can be seen beside the build's.")

C("S9-01", "S9", "Work order part lookup no longer offers a part once it is inactive",
  [ADMIN] + INAB + [WO1, ST_WO1],
  [ADDP, HALF, DESC, XCLOSE],
  [R_NPR, R_HALF, R_DESC, ["The window closes and line 1 still holds no parts."]],
  ["S9-R1", "S9-E10", "CN-S9-1", JAC_LOOK], design=D61)

C("S9-02", "S9", "An inactive part's window shows a grey Inactive pill in the title row",
  [ADMIN, "Have an inactive part, part A.", "Have an active part, part B, so the pill can be compared.", START_INACTIVE],
  [TYPE_A, ROW_A, "Click the X at the top right of the window.", "Click the Active tab.", "Type part B's part number in the Search box.", "Click the part B row."],
  [["Part A is listed on the Inactive tab."],
   ["The window is titled \"Edit Inventory Part\" and shows a grey \"Inactive\" pill beside the close X.", "Part Status has Inactive picked."],
   ["The window closes with nothing changed."], ["The Active tab is selected."], ["Part B is listed."],
   ["Part B's window shows a green \"Active\" pill in the same place."]],
  ["S9-R14", "S13-R3"], stories=[9, 13], design=dict(boards=["3.6"], words=[note("The badge reads Inactive and Part Status is on Inactive")]))

C("S9-03", "S9", "A user with only the View permission can open the Inactive tab",
  [ADMIN, f"Create a custom role for this test, role B, with only {V} in the Parts department, so user B can only look at the list.",
   "Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions.",
   "Use a second browser window (a private window) signed in as user B.", "Have an inactive part, part A."],
  ["In the second window, click Parts in the top bar.", "Click Inventory in the left menu.", "Click the Inactive tab.", TYPE_A],
  [["The Parts left menu shows Inventory for user B."], ["The Inventory page opens on the Active tab, with the Inactive tab beside it."],
   ["The Inactive tab opens for user B."], ["Part A is listed: seeing inactive parts needs no extra permission."]],
  ["S9-N1", "S1-R2"], stories=[9, 1], design=dict(boards=["3.5"]))

C("S9-04", "S9", "A work order line keeps its inactive part and can still be edited",
  [ADMIN, "Create an active part, part A, for this test, with Sell Price $20.00 and 4 on hand.",
   "Create an open work order, work order 1, for this test, whose approved line, line 1, holds 2 of part A at $20.00.",
   "Set part A inactive after it is on line 1.", ST_WO1],
  ["Click the part A row on line 1.", "Replace the quantity with 3.", SAVE, "Click the part A row on line 1.", "Replace the Sell Price with 22.00.", SAVE,
   "Click the part A row on line 1.", "Type Still on the line in the note field.", SAVE],
  [["The part A row opens for editing: it is still on line 1 of work order 1 with quantity 2 at $20.00 ($40.00)."],
   ["The quantity reads 3."], ["The change saves and the row total reads $60.00 (3 × $20.00)."],
   ["The part A row opens for editing."], ["Sell Price reads $22.00."],
   ["The change saves and the row total reads $66.00 (3 × $22.00), and the line total includes it."],
   ["The part A row opens for editing."], ["The note field holds the text."], ["The note saves and the row still holds part A."]],
  ["S9-E1", "S9-E2", "FO-5"], design=dict(note="no board draws an existing line that holds an inactive part; the expected results above come from the quotes above."))

C("S9-05", "S9", "An invoiced work order with an inactive part can be viewed, printed and reported",
  [ADMIN, "Create an active part, part A, for this test, with Sell Price $20.00.",
   "Create a work order, work order 1, for this test, that sold 1 of part A today on its line, line 1, and is invoiced.",
   "Set part A inactive after the invoice was made.", ST_WO1],
  ["Click the Finance tab.", "Click the print icon on the Finance tab.", "Close the print preview.", "Click Reports in the top bar.",
   "Click Parts Velocity.", "Set the date range to today.", TYPE_A],
  [["Work order 1's invoice shows part A, 1 × $20.00, and line 1 still shows part A on the Lines tab."],
   ["The print preview opens and lists part A."], ["The preview closes."], ["The Reports page opens."], ["The Parts Velocity report opens."],
   ["The report covers today."], ["Part A is listed with a sold quantity of 1."]],
  ["S9-E4", "S9-E11"], design=dict(note="no board draws an invoiced work order; the expected results above come from the quotes above."))

C("S9-06", "S9", "Estimate part lookup no longer offers a part once it is inactive",
  [ADMIN] + INAB + ["Create a work order for this test, work order 1, that is still an estimate (it shows the Estimate pill), with a line, line 1, that reads Needs Approval and holds no parts.", ST_WO1],
  [ADDP, HALF, DESC, XCLOSE],
  [R_NPR, R_HALF, R_DESC, ["The window closes; line 1 still holds no parts and work order 1 still shows the Estimate pill."]],
  ["S9-R2", JAC_LOOK], design=D61)

C("S9-07", "S9", "Technician charge-out does not offer or accept an inactive part",
  [TECH_A] + INAB + [WO1, "Use a desktop browser.", ST_WO1],
  [ADDP, "Type the shared start of the part numbers in the part field.", FULL.replace("text", "text in the part field"), "Press Enter."],
  [["A new part row opens under line 1 of work order 1, with a part field."],
   ["Part B is offered.", "No row for part A is offered."],
   [f"The field shows, as its error, part A's part number (capitals and hyphens) followed by \"{MSG}\"", "No offer to add it as a special order or a new part appears."],
   ["The row is not saved: line 1 gets no new part, and the error stays under the field."]],
  ["S9-R3", "S9-R16", "UFS-44", JAC_FULL], design=D63)

C("S9-08", "S9", "Technician charge-out on a phone refuses an inactive part number",
  [TECH_A] + INAB + [WO1, "Use a phone with a web browser, signed in as technician A.", "Start on work order 1 on the phone."],
  ["Tap Add Part under line 1.", "Type the shared start of the part numbers in the part field.", "Replace the text in the part field with part A's part number in lower case.",
   "Tap Save on the part row."],
  [["A new part row opens under line 1 of work order 1."], ["Part B is offered.", "No row for part A is offered."],
   [f"The field shows the error part A's part number followed by \"{MSG}\" under it."],
   ["The row is not saved and line 1 gets no new part."]],
  ["S9-R3", "FF-2", "S9-R16", "UFS-44"], design=D63)

C("S9-09", "S9", "Purchase order line lookup does not offer an inactive part",
  [ADMIN] + INAB + ["Create an open purchase order for this test, purchase order A, with one line for another part, not yet received.",
                    "Start on purchase order A (Parts in the top bar, Purchase Orders in the left menu, then purchase order A)."],
  ["Click the button that adds a line to the purchase order.", HALF, FULL, "Close the new line without saving it."],
  [["A new line opens with a Part Number lookup."], R_HALF, [INAMSG + ", in place of the offer to add the typed number."],
   ["Purchase order A still holds only its first line."]],
  ["S9-R5", "S9-R16", "UFS-44"], design=D63)

C("S9-10", "S9", "Changing the part a received vendor bill line points to skips inactive parts",
  [ADMIN] + INAB + ["Have a received vendor bill, bill A, with one line for a vendor part.",
                    "Start on bill A (Parts in the top bar, Vendor Invoices in the left menu, then bill A)."],
  ["Click the control on the line that changes which part it points to.", "Type the shared start of the part numbers in its part lookup.", "Close the lookup without picking anything."],
  [["A part lookup opens for the line."], ["Part B is offered and part A is not."], ["The line still points to its vendor part."]],
  ["S9-R6"], design=dict(note="no board draws a vendor bill; the expected results above come from the quotes above."))

C("S9-11", "S9", "Part sale line lookup does not offer an inactive part",
  [ADMIN] + INAB + ["Create an open part sale for this test, part sale A, with no parts.",
                    "Start on part sale A's Parts tab (Parts in the top bar, Part Sales in the left menu, then part sale A)."],
  ["Click Add Part.", HALF, FULL, "Close the part row without saving it."],
  [["A part row opens with a Part Number lookup."], R_HALF, R_FULL, ["Part sale A still has no parts."]],
  ["S9-R8", "S9-R16", JAC_LOOK], design=D61)

C("S9-12", "S9", "A canned job is added without its inactive parts and one warning names them",
  [ADMIN, "Create three active parts for this test, part A, part B and part C, with part A's number coming before part B's from A to Z.",
   "Create a canned job for this test, canned job A, holding parts A, B and C, one of each.",
   "Set parts A and B inactive after canned job A is saved.", "Create an open work order, work order 1, for this test, with no lines.", ST_WO1],
  [CANNED, CJ_T, CJ_P, CJ_S, "Wait 10 seconds without closing the warning.", "Click Close on the warning."],
  [["The New Line window opens."], ["Canned job A is suggested, with Total Parts: 3."], ["The canned job A line is filled in."],
   ["Work order 1 gets a new line, canned job A, holding one part, part C; parts A and B are not on it.",
    "One warning shows at the bottom right for the whole canned job: \"These parts are inactive and were not added:\" followed by part A's and part B's part numbers, in A to Z order, each as it shows on the Inactive tab, separated by a comma and a space."],
   ["The warning is still on screen after 10 seconds: it stays until closed."], ["The warning closes."]],
  ["S9-R9", "S9-R10", "S9-R10b", "S9-R10c", "UFS-43"], design=D65)

C("S9-13", "S9", "The canned job warning names a typed vendor part by the inactive part's number",
  [ADMIN, "Create an active part, part A, for this test, with a hyphen in its part number, and an active part, part C.",
   "Create a canned job for this test, canned job A, holding part C and a vendor part typed in by hand whose number is part A's number in lower case with periods in place of its hyphens.",
   "Set part A inactive after canned job A is saved.", "Create an open work order, work order 1, for this test, with no lines.", ST_WO1],
  [CANNED, CJ_T, CJ_P, CJ_S],
  [["The New Line window opens."], ["Canned job A is suggested."], ["The canned job A line is filled in."],
   ["Work order 1's new line holds part C only: the typed vendor part is not on it.",
    "One warning shows: \"These parts are inactive and were not added:\" followed by part A's own part number, with capitals and hyphens, not the number as typed in the canned job."]],
  ["S9-R9a", "CN-S9-2", "S9-R10", "S9-R10b", ("JIRA", "SV-10822 acceptance criteria",
   "Given a canned job with a vendor part typed by hand as FF5507, and FF-5507 is inactive at this location, when the job is applied, then the part is left out and the warning names it as FF-5507.")],
  design=D65)

C("S9-14", "S9", "A canned job leaves out the fee that belongs to an inactive part",
  [ADMIN, "Create two active parts for this test, part A and part C.",
   "Create a canned job for this test, canned job A, holding part A with a part fee, fee 1, and part C with a part fee, fee 2.",
   "Set part A inactive after canned job A is saved.", "Create an open work order, work order 1, for this test, with no lines.", ST_WO1],
  [CANNED, CJ_T, CJ_P, CJ_S],
  [["The New Line window opens."], ["Canned job A is suggested."], ["The canned job A line is filled in."],
   ["Work order 1's new line holds part C with fee 2; neither part A nor fee 1 is on it.",
    "One warning shows: \"These parts are inactive and were not added:\" followed by part A's part number, then \"The\", fee 1's name, \"fee for\", part A's part number and \"was not added.\"",
    "The warning stays until closed."]],
  ["S9-R10a", "S9-R10", "UFS-43", ("JIRA", "SV-10822 acceptance criteria",
   "Given one of those parts carries a fee, when the job is applied, then the fee is left out and the same warning adds \"The {fee} fee for {part number} was not added.\"")],
  design=D65)

C("S9-15", "S9", "Vendor return lookup offers an inactive part with a grey Inactive tag",
  [ADMIN, "Have a vendor, vendor A.", "Create a part, part A, for this test, with vendor A and 4 on hand, and set it inactive.", "Create an active part, part B, for this test, with vendor A.",
   SHARED("parts A and B"),
   "Start on the Create Return page (Parts in the top bar, Returns in the left menu, then the button that starts a new return)."],
  ["Pick vendor A in the Vendor field.", "Type the shared start of the part numbers in the Part Number field.", "Click the part A row.",
   "Type 1 in Qty To Return.", "Type 10.00 in Price Per Unit.", "Click Save Return."],
  [["Vendor A is shown."], ["Parts A and B are offered.", "Part A carries a grey \"Inactive\" tag beside its description; part B has no tag."],
   ["Part A fills the line with its description and its Qty In Stock, 4."], ["Qty To Return reads 1."], ["Price Per Unit reads $10.00."],
   ["The return saves with part A on it."]],
  ["S9-R11", "S9-R12", "KD-12"], design=dict(boards=["6.6"], words=[note("The vendor return lookup includes inactive parts")]))

C("S9-16", "S9", "Vendor credit lookup offers an inactive part with a grey Inactive tag",
  [ADMIN, "Have a vendor, vendor A.", "Have an inactive part, part A, with vendor A.", "Have an active part, part B, with vendor A.", SHARED("parts A and B"),
   "Start on vendor A's page (Parts in the top bar, Vendors in the left menu, then the vendor A row)."],
  ["Click the button that starts a new vendor credit.", "Type the shared start of the part numbers in the credit's Part Number field.", "Click the part A row."],
  [["A new vendor credit for vendor A opens."],
   ["Parts A and B are offered.", "Part A carries a grey \"Inactive\" tag beside its description; part B has no tag."],
   ["Part A fills the credit line."]],
  ["S9-R11", "S9-R12"], design=dict(note="no board draws a vendor credit; the vendor return board 6.6 shows the same tag. The expected results above come from the quotes above."))

for key, kind, st in (("S9-17", "part sale", "Start on part sale A (Parts in the top bar, Part Sales in the left menu, then part sale A)."),
                      ("S9-18", "work order", "Start on work order 1.")):
    rec = "part sale A" if kind == "part sale" else "work order 1"
    C(key, "S9", f"A credit on a {kind} invoice lists an inactive part with its tag",
      [ADMIN, "Create two active parts for this test, part A with Sell Price $20.00 and part B with Sell Price $15.00.",
       f"Create a {kind}, {rec}, for this test, that sold one part A and one part B and is invoiced.",
       "Set part A inactive after the invoice was made.", st],
      CREDIT + ["Click Cancel."],
      [[f"The invoice of {rec} shows."], ["The invoice's menu opens."], ["The Issue Credit window opens."],
       ["The Parts to return list shows part A at $20.00 and part B at $15.00.",
        "Part A carries a grey \"Inactive\" tag right after its part number; part B has none."],
       ["The window closes and no credit is issued."]],
      ["S9-R13", "KD-12"], design=dict(boards=["6.7"], words=[note("Issue Credit on part sale P2-89")]))

C("S9-19", "S9", "A library entry stocked elsewhere is hidden when it matches an inactive part",
  ["Sign in as an Admin who can switch between two locations, the test location and location B, so a part can be stocked at location B only.", "Have an inactive part, part A, at the test location, with a hyphen in its part number.",
   "Create a part for this test at location B only whose number is part A's number with periods in place of its hyphens, number 1, so its Part Library entry matches part A.",
   "Create a part for this test at location B only whose number matches nothing at the test location, number 2, so the Part Library has a row the search must still offer.",
   "Give part A and the two location B parts descriptions that start with the same text, so one search finds all three.", WO1, ST_WO1],
  [ADDP, "Type the shared start of the descriptions in the Part Number field.", XCLOSE],
  [R_NPR,
   ["A \"Part Library\" row for number 2 is offered, which shows the search reached the Part Library.",
    "Neither part A nor a \"Part Library\" row for number 1 is offered."],
   ["The window closes and line 1 holds no parts."]],
  ["S9-R15", "CN-S9-2", "S12-R10"], stories=[9, 12], design=D61)

C("S9-20", "S9", "Typing an inactive part number in full shows the inactive message",
  [ADMIN] + INAB + [WO1, ST_WO1],
  [ADDP, "Type part A's part number in lower case in the Part Number field.", "Replace the text with part A's part number with spaces in place of its hyphens.", XCLOSE],
  [R_NPR, R_FULL, ["The same message shows, naming part A as it was saved.", "No special order is offered."],
   ["The window closes and line 1 holds no parts."]],
  ["S9-R16", "UFS-44", "CN-S9-2", "KD-13", JAC_FULL], design=D63)

C("S9-21", "S9", "Saving a Part Request is refused once the part was retired meanwhile",
  [ADMIN, "Create an active part, part A, for this test, with 4 on hand.", WO1, TWO_TABS, "Start in tab 1 on work order 1, on its Lines tab."],
  [ADDP, "Type part A's part number in the Part Number field.", "Click the part A row in the list."] + TABS + ["In tab 1, click Save Part.", "Wait 5 seconds without clicking anything."],
  [R_NPR, ["Part A is offered."], ["Part A fills the window. Do not save yet."]] + R_TABS + [R_REFUSED, R_FADE],
  REFUSE_Q, design=D63)

C("S9-22", "S9", "Saving a part sale line is refused once the part was retired meanwhile",
  [ADMIN, "Create an active part, part A, for this test, with 4 on hand.", "Create an open part sale for this test, part sale A, with no parts.", TWO_TABS,
   "Start in tab 1 on part sale A's Parts tab."],
  ["Click Add Part.", "Type part A's part number in the Part Number field.", "Click the part A row in the list."] + TABS + ["In tab 1, click Save & Close.", "Wait 5 seconds without clicking anything."],
  [["A part row opens."], ["Part A is offered."], ["Part A fills the row. Do not save yet."]] + R_TABS + [R_REFUSED + ["Part sale A still has no parts."], R_FADE],
  REFUSE_Q, design=D63)

C("S9-23", "S9", "Saving a purchase order line is refused once the part was retired meanwhile",
  [ADMIN, "Create an active part, part A, for this test, with 4 on hand.",
   "Create an open purchase order for this test, purchase order A, with one line for another part, line 1, not yet received.", TWO_TABS,
   "Start in tab 1 on purchase order A."],
  ["Click the button that adds a line to the purchase order.", "Type part A's part number in the new line's Part Number field.", "Click the part A row in the list."] + TABS +
  ["In tab 1, save the new line.", "Wait 5 seconds without clicking anything.", "In tab 1, replace line 1's part number with part A's part number.", "In tab 1, save line 1."],
  [["A new line opens on purchase order A."], ["Part A is offered."], ["Part A fills the new line. Do not save yet."]] + R_TABS +
  [R_REFUSED, R_FADE, ["Line 1's part number field holds part A's number."],
   [f"The change is refused with the same message, part A's part number followed by \"{MSG}\", and line 1 keeps its own part."]],
  REFUSE_Q, design=D63)

C("S9-24", "S9", "Global search lists an inactive part with a grey Inactive tag",
  [ADMIN, "Have an inactive part, part A.", "Have an active part, part B, so the tag can be compared.", SHARED("parts A and B"), GLOBAL],
  [GS_OPEN, "Type the shared start of the part numbers."],
  [["The global search opens."], ["Parts A and B are both listed.", "Part A carries a grey \"Inactive\" tag; part B has no tag."]],
  ["S9-R18"], design=dict(note="no board draws the global search; the expected results above come from the quotes above."))

C("S9-25", "S9", "Selecting an inactive part in global search opens the Inactive tab",
  [ADMIN, "Have an inactive part, part A.", GLOBAL, "Start on any page other than Inventory, such as Work Orders."],
  [GS_OPEN, "Type part A's part number.", "Click the part A result."],
  [["The global search opens."], ["Part A is listed with its grey \"Inactive\" tag."],
   ["The Inventory page opens on the Inactive tab (selected), with part A's part number in the Search box and the part A row listed."]],
  ["S9-R18", "S9-R19"], design=dict(note="no board draws the global search; the expected results above come from the quotes above."))

C("S9-26", "S9", "Global search shows Not Tracked for an untracked part",
  [ADMIN, "Have an untracked part, part A, with 4 on its shelf.", "Have a tracked part, part B, with 4 on hand, so the badge can be compared.",
   SHARED("parts A and B"), GLOBAL],
  [GS_OPEN, "Type the shared start of the part numbers."],
  [["The global search opens."],
   ["Part B's result shows its stock badge, \"4 available\".", "Part A's result shows \"Not Tracked\" where that badge would be, with no \"available\" figure."]],
  ["S9-R20", "UFS-42"], design=dict(note="no board draws the global search; the expected results above come from the quotes above."))

C("S9-27", "S9", "A user who cannot view the Inventory list sees neither tab",
  [ADMIN, "Create a custom role for this test, role B, with the Parts department on with Part Sales open to it and every Part Library & Inventory box unticked, so user B cannot view the Inventory list.",
   "Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions.", "Use a second browser window (a private window) signed in as user B."],
  ["In the second window, click Parts in the top bar.", "Type the address of the Inventory page (it ends /parts/inventory) in the address bar.", "Press Enter."],
  [["The Parts left menu opens for user B with Part Sales in it, and it does not offer Inventory."], ["The address is typed."],
   ["The Inventory list does not open for user B: neither the Active nor the Inactive tab is shown."]],
  ["S9-N2"], design=dict(note="no board draws this; the expected results above come from the quotes above."))

C("S9-28", "S9", "With Vendor Order Management Create & Edit, a return's part search works",
  [ADMIN, "Create a custom role for this test, role B, with Vendor Order Management — View and Vendor Order Management — Create & Edit ticked and every Part Library & Inventory box unticked, so user B reaches parts only through Vendor Order Management.",
   "Create a staff member for this test, user B, at the test location with role B, so the steps run with role B's permissions.", "Use a second browser window (a private window) signed in as user B.",
   "Have a vendor, vendor A, and an inactive part, part A, with vendor A."],
  ["In the second window, click Parts in the top bar.", "Click Returns in the left menu.", "Click the button that starts a new return.", "Pick vendor A in the Vendor field.",
   "Type the first half of part A's part number in the Part Number field."],
  [["The Parts left menu opens for user B."], ["The Returns list opens."], ["The Create Return page opens."], ["Vendor A is shown."],
   ["Part A is offered, with its grey \"Inactive\" tag, and no access error appears: Create & Edit on Vendor Order Management includes viewing parts."]],
  ["S9-N3a", "S9-N3", "S12-N1", ("JIRA", "SV-10822, Chris Ward, 23 Oct 2026",
   "Confirmed: A. Leave the role bundles as they are. This epic adds, removes and re-keys no permissions (S12-N1). S9-N3a will be reworded to describe today's bundles, and any split of View vs Create & Edit for returns would be its own ticket.")],
  stories=[9, 12], design=dict(boards=["6.6"]))

C("S9-29", "S9", "A completed part sale with an inactive part keeps its totals",
  [ADMIN, "Create two active parts for this test, part A with Sell Price $20.00 and part B with Sell Price $15.00.",
   "Create a part sale for this test, part sale A, that sold 2 of part A and 1 of part B and is invoiced.",
   "Set part A inactive after the invoice was made.", "Start on part sale A's Parts tab."],
  ["Click the Finance tab."],
  [["Part sale A's invoice Summary still reads Parts $55.00 (2 × $20.00 for part A + 1 × $15.00 for part B), and part A is still listed on it at $40.00: retiring it changed nothing on the sale."]],
  ["S9-E1"], design=dict(note="no board draws a completed part sale; the expected results above come from the quotes above."))

C("S9-30", "S9", "Changing a line to another inactive part is refused",
  [ADMIN, "Create an active part, part A, for this test, and add it to the approved line, line 1, of an open work order, work order 1, made for this test.",
   "Create two more parts for this test: part B, set inactive, and part C, left active.", "Set part A inactive after it is on line 1.", ST_WO1],
  ["Click the part A row on line 1.", "Replace the part number with part B's part number.", SAVE, "Click the part A row on line 1.",
   "Replace the part number with part C's part number.", SAVE],
  [["The part A row on line 1 of work order 1 opens for editing."], ["The field holds part B's number."],
   [f"The change is refused with part B's part number followed by \"{MSG}\", and the row still holds part A."],
   ["The part A row opens for editing."], ["The field holds part C's number."], ["The change saves and the row now holds part C."]],
  ["S9-E2a", "S9-R17", "S9-E2"], design=dict(note="no board draws this; the expected results above come from the quotes above."))

C("S9-31", "S9", "A work order holding an inactive part can still be invoiced",
  [ADMIN, "Create an active part, part A, for this test, with Sell Price $20.00.",
   "Create a work order, work order 1, for this test, with part A picked on its line, line 1, and complete it, ready to invoice.",
   "Set part A inactive after work order 1 is complete.", "Start on work order 1's Finance tab."],
  ["Click Create Invoice."],
  [["The invoice is made and work order 1 reads Invoiced.", "The invoice lists part A from line 1, 1 × $20.00 = $20.00."]],
  ["S9-E3"], design=dict(note="no board draws this; the expected results above come from the quotes above."))

C("S9-32", "S9", "Reopening a completed work order leaves its inactive part inactive",
  [ADMIN, "Create an active part, part A, for this test.", "Create a work order, work order 1, for this test, with part A on its line, line 1, and complete it, not invoiced.",
   "Set part A inactive after work order 1 is complete.", "Start on work order 1."],
  ["Click the three-dot button in work order 1's header.", "Click Uncomplete.", "Click Parts in the top bar.", "Click Inventory in the left menu.",
   "Click the Inactive tab.", TYPE_A, "Click the Active tab."],
  [["The work order menu opens."], ["Work order 1 is no longer complete and line 1 still shows part A."], ["The Parts left menu shows Inventory."],
   ["The Inventory page opens."], ["The Inactive tab is selected."], ["Part A is still listed on the Inactive tab."],
   ["Part A is not listed on the Active tab."]],
  ["S9-E5"], design=dict(note="no board draws this; the expected results above come from the quotes above."))

C("S9-33", "S9", "A part retired while on order can still be ordered, received and picked",
  [ADMIN, "Have a vendor, vendor A.", "Create an active part, part A, for this test, with vendor A and 0 on hand.",
   "Create an open work order, work order 1, for this test, whose approved line, line 1, has two Part Requests for part A from vendor A: Part Request 1 ordered on purchase order A, and Part Request 2 not yet ordered.",
   "Set part A inactive after that.", "Start on work order 1's Parts tab."],
  ["Click Order on Part Request 2.", "Open purchase order A.", "Click Receive.", "Type an invoice number.", "Type 1 as the delivered quantity.", "Type 10.00 as the cost.", "Click Receive to accept the delivery.",
   "Open work order 1's Parts tab.", "Click Pick on the received part A."],
  [["Part Request 2 for part A from vendor A is ordered (it shows on a purchase order), and no inactive-part refusal appears."], ["Purchase order A opens."],
   ["The Receive screen opens."], ["The invoice number is typed."], ["The quantity reads 1."], ["The cost reads $10.00."], ["The delivery is received with part A."],
   ["The Parts tab shows part A as received."], ["Part A is picked onto line 1 of work order 1 (status Picked)."]],
  ["S9-E6"], design=dict(note="no board draws this; the expected results above come from the quotes above."))

C("S9-34", "S9", "Splitting a work order moves a line that holds an inactive part",
  [ADMIN, "Create an active part, part A, for this test.",
   "Create an open work order, work order 1, for this test, with two approved lines: line 1 with no parts and line 2 holding part A.",
   "Set part A inactive after it is on line 2.", ST_WO1],
  ["Tick the checkbox of line 2.", "Click Split work order in the bulk menu.", "Click the button that confirms the split.", "Open the new work order the split made."],
  [["Line 2 is ticked."], ["The split confirmation opens."], ["The split completes with no inactive-part refusal."],
   ["The new work order holds line 2 with part A, and work order 1 keeps line 1 only."]],
  ["S9-E7"], design=dict(note="no board draws this; the expected results above come from the quotes above."))

C("S9-35", "S9", "The parts import updates an inactive part in place and keeps it inactive",
  [ADMIN, "Create a part, part A, for this test, with Min 1 and Max 5, and set it inactive.",
   "Have a parts import file with one row for part A with the same number, description, category, bin location and quantity, and Min 3.",
   "Start on the Inventory data import page (Settings, then Data Import, then Inventory)."],
  ["Upload the file.", "Run the import.", "Click Parts in the top bar.", "Click Inventory in the left menu.", TYPE_A, "Click the Inactive tab.", ROW_A],
  [["The file is ready to import."], ["The import finishes without errors."], ["The Parts left menu shows Inventory."], ["The Inventory page opens."],
   ["Part A is not listed on the Active tab."], ["Part A is listed once on the Inactive tab (one row, no second copy)."],
   ["Min reads 3 and the title row pill reads \"Inactive\": the import updated part A and did not make it active."]],
  ["S9-E8"], design=dict(note="no board draws the parts import; the expected results above come from the quotes above."))

C("S9-36", "S9", "A parts import row with a blank Manufacturer keeps the part's manufacturer",
  [ADMIN, "Create a part, part A, for this test, with a manufacturer, manufacturer 1, and Min 1.",
   "Have a parts import file with one row for part A with the Manufacturer cell blank and Min 2.",
   "Start on the Inventory data import page (Settings, then Data Import, then Inventory)."],
  ["Upload the file.", "Run the import.", "Click Parts in the top bar.", "Click Inventory in the left menu.", TYPE_A, ROW_A],
  [["The file is ready to import."], ["The import finishes without errors."], ["The Parts left menu shows Inventory."], ["The Inventory page opens."],
   ["Part A is listed."], ["Manufacturer still reads manufacturer 1, and Min reads 2, which shows the import did run."]],
  ["S9-E8a"], design=dict(note="no board draws the parts import; the expected results above come from the quotes above."))

C("S9-37", "S9", "The Inventory Value report still lists a part after it is set inactive",
  [ADMIN, "Create a tracked part, part A, for this test, with 4 on hand at a Cost of $12.50, so its stock is worth $50.00 (4 × $12.50).",
   "Set part A inactive.", "Start on the Inventory Value report (Reports in the top bar, then Inventory Value), for today at the test location."],
  [TYPE_A],
  [["Part A is listed with Qty 4, Unit Cost $12.50 and Total Cost $50.00 (4 × $12.50): an inactive part's stock still has value."]],
  ["S9-E11", "ACC-7"], design=dict(note="no board draws the Inventory Value report; the expected results above come from the quotes above."))

C("S9-38", "S9", "The Parts Velocity report still lists an inactive part's sales",
  [ADMIN, "Create an active part, part A, for this test.", "Create a part sale for this test that sold 2 of part A today and is invoiced, so part A has sales to report.",
   "Set part A inactive after the sale.", "Start on the Parts Velocity report (Reports in the top bar, then Parts Velocity)."],
  ["Set the date range to today.", TYPE_A],
  [["The report covers today."], ["Part A is listed with the 2 sold: its history still counts."]],
  ["S9-E11"], design=dict(note="no board draws the Parts Velocity report; the expected results above come from the quotes above."))

C("S9-39", "S9", "No invoice line or scan lookup exists that could offer an inactive part",
  [ADMIN, "Have an inactive part, part A.", "Create an invoiced work order, work order 1, for this test, whose line, line 1, sold an active part, part B.", ST_WO1],
  ["Click the Finance tab.", "Click the Lines tab.", ADDP, XCLOSE],
  [["Work order 1's invoice shows part B on its line, and it offers no part lookup of its own on its lines: ShopView has no invoice-line part lookup."],
   ["The Lines tab shows line 1."],
   ["The New Part Request window opens with its Part Number lookup, and there is no barcode or scan button beside it: ShopView has no scan lookup."],
   ["The window closes and line 1 is unchanged."]],
  ["S9-R4", "S9-R7", "CN-S9-3"], design=dict(boards=["6.3"]),
  note="If this build does have an invoice-line part lookup or a scan button, type part A's part number in it: part A must not be offered.")

C("S9-40", "S9", "The canned job warning lists inactive parts A to Z, separated by commas",
  [ADMIN, "Create four active parts for this test, part A, part B, part C and part D, whose part numbers run A to Z in that order.",
   "Create a canned job for this test, canned job A, holding, in this order, part C, part B, part A and part D, one of each.",
   "Set parts A, B and C inactive after canned job A is saved.", "Create an open work order, work order 1, for this test, with no lines.", ST_WO1],
  [CANNED, CJ_T, CJ_P, CJ_S],
  [["The New Line window opens."], ["Canned job A is suggested, with Total Parts: 4."], ["The canned job A line is filled in."],
   ["Work order 1 gets a new line holding one part, part D; parts A, B and C are not on it.",
    "One warning shows: \"These parts are inactive and were not added:\" followed by part A's, part B's and part C's part numbers in that A to Z order, not in the order the canned job holds them, each separated from the next by a comma and a space."]],
  ["S9-R10c", "S9-R10", "S9-R10b", "S9-R9", "UFS-43",
   ("PO", "Chris Ward's answer 9 of 14 Oct 2026", "A to Z by part number, separated by \", \" (S9-R10c). Example: \"These parts are inactive and were not added: AB-100, FF-5507.\"")],
  design=D65)

for key, title, role_text, steps, res in (
        ("S9-41", "Without Vendor Order Management, Returns access is the same as today",
         "with Part Library & Inventory — View and no Vendor Order Management permission",
         ["In window 1, click Parts in the top bar.", "In window 2, click Parts in the top bar."],
         [["The Parts left menu opens on the build for user B; note whether it offers Returns."],
          ["Production's Parts left menu offers Returns for user B exactly when the build's does: both offer it or both leave it out."]]),
        ("S9-42", "With Vendor Order Management View only, starting a return is as today",
         "with Vendor Order Management — View, without Vendor Order Management — Create & Edit, and with Part Library & Inventory — View",
         ["In window 1, click Parts in the top bar.", "In window 1, click Returns in the left menu.", "In window 2, click Parts in the top bar.",
          "In window 2, click Returns in the left menu."],
         [["The Parts left menu opens on the build for user B."],
          ["The Returns list opens on the build; note whether the button that starts a new return is shown and usable, shown greyed out, or missing."],
          ["Production's Parts left menu opens for user B."],
          ["Production's Returns list opens, and its button that starts a new return is in the same state as on the build."]])):
    C(key, "S9", title,
      [ADMIN, PROD, f"Create the same custom role for this test on the build and on production, role B, {role_text}, so the two can be compared.",
       "Create a staff member, user B, with role B on the build and on production, so the steps run with role B's permissions on both.",
       "Use window 1 signed in as user B on the build and window 2 signed in as user B on production."],
      steps, res,
      ["S9-N3a", "S12-N1", "KD-14"], stories=[9, 12],
      design=dict(note="no board draws the Returns access; the expected results above come from the quotes above."))

for key, where, start, add, pick in (
        ("S9-43", "work order", WO1, ADDP, "Type the shared start of the part numbers in the Part Number field."),
        ("S9-44", "estimate", "Create a work order for this test, work order 1, that is still an estimate, with a line, line 1, that holds no parts.", ADDP,
         "Type the shared start of the part numbers in the Part Number field."),
        ("S9-45", "part sale", "Create an open part sale for this test, part sale A, with no parts.", "Click Add Part on part sale A's Parts tab.",
         "Type the shared start of the part numbers in the Part Number field."),
        ("S9-46", "purchase order", "Create an open purchase order for this test, purchase order A.", "Click the button that adds a line to purchase order A.",
         "Type the shared start of the part numbers in the new line's Part Number field.")):
    st = {"work order": ST_WO1, "estimate": ST_WO1, "part sale": "Start on part sale A's Parts tab.", "purchase order": "Start on purchase order A."}[where]
    C(key, "S9", f"The {where} part lookup shows Not Tracked for an untracked part",
      [ADMIN, "Have an untracked part, part A, with 3 in one bin location, bin location A.", "Have a tracked part, part B, with 4 on hand, so the lookup rows can be compared.",
       SHARED("parts A and B"), start, st],
      [add, pick],
      [[f"The part lookup opens for {dict(zip(('work order', 'estimate', 'part sale', 'purchase order'), ('line 1 of work order 1', 'line 1 of work order 1', 'part sale A', 'purchase order A')))[where]}."],
       ["Part B's row shows \"Inventory Qty: 4\".",
        "Part A's row shows \"Not Tracked\" in place of \"Inventory Qty\", and its bin chip for bin location A with 3 still shows, as a shelf reference."]],
      ["S9-R21", "FO-7"], design=dict(boards=["6.6"], note="board \"6.6 Vendor return: still offered, tagged\" shows a lookup row with \"Inventory Qty\" and bin chips; no board draws an untracked part in a lookup."))

for key, where, rec, start, add in (
        ("S9-47", "work order", "work order 1", WO1, ADDP),
        ("S9-48", "part sale", "part sale A", "Create an open part sale for this test, part sale A, with no parts.", "Click Add Part on part sale A's Parts tab.")):
    st = ST_WO1 if where == "work order" else "Start on part sale A's Parts tab."
    C(key, "S9", f"On a {where}, an untracked part with nothing on hand shows In Stock",
      [ADMIN, "Create an untracked part, part A, for this test, with 0 on its shelf.", start, st],
      [add, "Type part A's part number in the Part Number field.", "Click the part A row in the list.", "Type 2 in the quantity field.", "Click the save button of the part row."],
      [["The part lookup opens."], ["Part A is offered, reading \"Not Tracked\"."], ["Part A fills the row."], ["The quantity reads 2."],
       [f"Part A is added to {rec} with quantity 2 and carries its \"In Stock\" badge, although it has 0 on its shelf (0 − 2 = −2 below zero)."]],
      ["S9-R22", "FO-7"], design=dict(note="no board draws an untracked part on a work order or part sale; the expected results above come from the quotes above."))
