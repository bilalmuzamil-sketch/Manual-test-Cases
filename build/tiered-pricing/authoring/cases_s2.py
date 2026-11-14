"""Story 2 — Tiers (SV-11694), PRD v37 lines 295-349, design page 2 (2.1-2.60), tech plan rows TPX-02, TPX-16, TPX-18.
Tiers are client-wide: every case makes its own tiers, names them only by "tier A" etc., and reads numbers relative to what the list shows
before (so other tests' tiers never break it). A case that renames Default renames it back in its last step (Rule 137)."""
from tp_lib import C, R, B, S, QP, QD, QT
from common import *

K = "S2"
CUST2 = ("Sign in as an Admin whose role has 'Settings — Parts', 'See Financial Data', 'Customers — View', 'Customers — Create & Edit', "
         "'Work Orders — Order Parts' and 'Work Order Lines — Create & Edit'.")
ONE_WO = "Have a new work order for this test, work order 1, for customer A."

# ---- the Tiers list --------------------------------------------------------------------------------------------------------------
C("S2-01", K, "Tiers list shows number, name, customers, matrices and status",
  [ADMIN, tier("A"), DESK],
  [TIERS],
  [R(S("S2-R1", "The Tiers list shows each tier's number, name, customers and status."),
     "Each row shows a number, a name, a Customers count and a status.")
   + R(S("S2-R25", "The Tiers list has a Matrices column"), "Each row also shows a Matrices value.")
   + R(S("S2-R15", "on the Tiers list it sits under the # header"), "The numbers sit under a # header, as plain text, with no pill or badge.")
   + R(S("S2-R1", "Default is tier 1."), "Default is number 1.")
   + R(S("S2-R14", "The Tiers list shows active tiers by number"), "Tier A is the last active row, with the highest number.")],
  pics=["2.2", "2.3"])

C("S2-02", K, "Active tiers come first by number, archived tiers after A to Z",
  [ADMIN, tier("A"), tier("B"), tier("C", ", archived, whose name starts with Y (for example Yellow Fleet)", False),
   tier("D", ", archived, whose name starts with B (for example Blue Fleet)", False), DESK],
  [TIERS],
  [R(S("S2-R14", "The Tiers list shows active tiers by number, then archived tiers A to Z by name."),
     "Default, then the other active tiers in number order (tier A before tier B), come first.",
     "After the last active tier come the archived tiers, tier D before tier C (B before Y).")
   + R(S("S2-R15", "Archived tiers have no number."), "Tier C and tier D show no number and the status Archived.")],
  pics=["2.2", "2.24"])

C("S2-03", K, "Customers count counts each customer once, with the channel split on hover",
  [CUST2, tier("A"), customer("A", ", on tier A for work orders and for Part Sales"), customer("B", ", on tier A for work orders and for Part Sales"),
   customer("C", ", on tier A for work orders only"), customer("D", ", on tier A for Part Sales only"), DESK],
  [TIERS, "Point at tier A's Customers count."],
  [R(S("S2-R1", "The Customers column counts the distinct customers on the tier for either channel"),
     "Tier A's Customers column reads 4 (customers A, B, C and D, each counted once: 2 + 1 + 1 = 4)."),
   R(S("S2-R1", "with the work order and Part Sales split on hover"),
     "The hover shows 3 for work orders (A, B, C) and 3 for Part Sales (A, B, D): 2 + 1 = 3 each.")],
  pics=["2.2"], flags=["numbers"])

C("S2-04", K, "Default badge moves to Default's new name only once it is renamed",
  [ADMIN, "Make sure Default has its original name, Default.", DESK],
  [TIERS, "Click Default's row.", "Click Default's name at the top of the page.", "Type Retail.", "Press Enter.", TIERS, MATRICES,
   "Click Retail's row on the Tiers list.", "Click Retail's name at the top of the page.", "Type Default.", "Press Enter."],
  [R(S("S2-R1", "Once Default is renamed, its new name carries the Default badge."), "Default's row shows the name Default and no Default badge."),
   R(S("S2-R28"), "Default's page opens."),
   R(S("S2-R5", "Any tier can be renamed, Default included."), "The name becomes editable in place."),
   R(S("S2-R5"), "The name field reads Retail."),
   R(S("S2-R28", "The tier's name is the page title, renamed in place and saved at once."), "The title reads Retail."),
   R(S("S2-R1", "Once Default is renamed, its new name carries the Default badge."), "Row 1 reads Retail with the Default badge beside it."),
   R(S("S2-R1", "The General Matrix and Uncategorized keep the Default badge they carry today; nothing else carries it."),
     "The General Matrix still carries the Default badge.", "No other matrix carries it."),
   R(S("S2-R28"), "Retail's page opens."), R(S("S2-R5"), "The name can be edited."), R(S("S2-R5"), "The name field reads Default."),
   R(S("S2-R5"), "The title reads Default again.")],
  pics=["2.2", "2.33", "2.37"])

C("S2-05", K, "Matrices column counts Active matrices where the tier has its own rules",
  [ADMIN, tier("A"), matrix("A", ", Active (it prices a new category made for this test)"), matrix("B", ", Inactive (no category)"),
   "Note how many matrices the Matrices tab lists as Active (for example 5).", DESK],
  [TIERS, open_tier("A"), "Check matrix A.", "Click Set Rule in the bulk bar after picking % Off with the value 10.", "Click Set Rule in the dialog.",
   TIERS, open_tier("A"), "Check matrix B.", "Click Set Rule in the bulk bar after picking % Off with the value 10.", "Click Set Rule in the dialog.", TIERS],
  [R(S("S2-R25", "otherwise \"4/5\" (Active matrices where it does, of all Active matrices)"), "Tier A's Matrices column reads 0/5 (0 own rules of 5 Active matrices = 0/5)."),
   R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "The bulk bar shows the count 1."), R(S("S2-R23"), "The Set Rule question opens."),
   R(S("S2-R24"), "Matrix A's row reads 10% off."),
   R(S("S2-R25", "otherwise \"4/5\" (Active matrices where it does, of all Active matrices)"), "Tier A's Matrices column reads 1/5 (1 of 5)."),
   R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "The bulk bar shows the count 1."), R(S("S2-R23"), "The Set Rule question opens."),
   R(S("S2-R24"), "Matrix B's row reads 10% off."),
   R(S("S2-R25", "Inactive matrices don't count."), "Tier A's Matrices column still reads 1/5: the Inactive matrix B adds nothing.")
   + R(S("S2-R25", "Default reads \"All\"."), "Default's Matrices column reads All.")],
  pics=["2.2", "2.3", "2.47"], flags=["numbers"])

C("S2-06", K, "Matrices column reads All once the tier has rules in every Active matrix",
  [ADMIN, tier("A"), DESK],
  [TIERS, open_tier("A"), "Click the select-all checkbox in the matrix list header.", "Type 10 in the bulk bar's value.", "Click Set Rule.",
   "Click Set Rule in the dialog.", TIERS],
  [R(S("S2-R25"), "Tier A's Matrices column reads 0 over the number of Active matrices (0 of 5 = 0/5)."),
   R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "Every matrix row is checked."), R(S("S2-R22"), "The value reads 10 with % Off picked."),
   R(S("S2-R23"), "The Set Rule question opens."), R(S("S2-R24"), "Every matrix row reads 10% off."),
   R(S("S2-R25", "\"All\" when the tier has its own rules in every Active matrix"), "Tier A's Matrices column reads All.")],
  pics=["2.48", "2.2"], flags=["numbers"])

C("S2-07", K, "A separate Part Sale side does not change the Matrices count",
  [ADMIN, tier("A"), matrix("A", ", Active, with Separate Part Sale pricing on"), "Note tier A's Matrices value on the Tiers list (for example 0/5).", DESK],
  [MATRICES, open_matrix("A"), "Click the Part Sale Matrix tab.", EDIT, "Pick % Off in tier A's column header picker.", "Type 10 in tier A's first range.", SAVE, TIERS],
  [R(S("S3-R18"), "Matrix A is listed."), R(S("S3-R18"), "Matrix A's page opens."), R(S("S3-R21"), "The Part Sale grid shows, with Edit."),
   R(S("S4-R4"), "Every cell can be edited."), R(S("S4-R5"), "Tier A's column shows % Off."), R(S("S4-R26"), "Tier A's ranges read 10."),
   R(S("S4-R12"), "The grid saves and returns to view."),
   R(S("S2-R25", "The count reads the Work Order Matrix side only; a separate Part Sale side doesn't change it."),
     "Tier A's Matrices value is the same as noted (0/5 = 0/5).")],
  pics=["3.19", "2.2"], flags=["numbers"])

C("S2-08", K, "Archiving a tier moves the later tiers up one number",
  [ADMIN, tier("A"), tier("B"), tier("C"), "Note tier A's number on the Tiers list (for example 5).", DESK],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Archive.", "Click Archive in the dialog."],
  [R(S("S2-R15", "Default is 1 and the others follow in the order they were created, with no gaps."),
     "Tier A, tier B and tier C have three numbers in a row (for example 5, 6 and 7)."),
   R(S("S2-R6", "A tier other than Default can be archived."), "The menu offers Archive."),
   R(S("S2-R30"), "The Archive question for tier A opens."),
   R(S("S2-R15", "When a tier is archived, the tiers after it move up one number; their order and names never change."),
     "Tier B now has tier A's old number and tier C the next one (6 − 1 = 5, 7 − 1 = 6).", "Tier B and tier C keep their names and order.")
   + R(S("S2-R15", "Archived tiers have no number."), "Tier A shows among the archived rows with no number.")],
  pics=["2.21", "2.23", "2.24"], flags=["numbers"])

C("S2-09", K, "Deleting a tier moves the later tiers up one number",
  [ADMIN, tier("A", " that has priced nothing and has no customers"), tier("B"), "Note tier A's number (for example 5).", DESK],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Delete.", "Click Delete in the dialog."],
  [R(S("S2-R15"), "Tier B's number is tier A's number + 1 (5 + 1 = 6)."), R(S("S2-R26"), "The menu offers Delete."), R(S("S2-R30"), "The Delete question for tier A opens."),
   R(S("S2-R15", "Deleting a tier renumbers the later tiers the same way."), "Tier A is gone from the list.", "Tier B now has tier A's old number (6 − 1 = 5).")],
  pics=["2.28", "2.29", "2.30"], flags=["numbers"])

C("S2-10", K, "Status filter opens on Active and can show archived tiers",
  [ADMIN, tier("A"), tier("B", ", archived", False), DESK],
  [TIERS, "Open the Status filter.", "Pick Archived."],
  [R(S("S2-R14", "It has a Status filter (Active, Archived) that opens on Active"), "The list shows active tiers, Default and tier A among them.", "Tier B is hidden while the filter is on Active."),
   R(S("S2-R14", "It has a Status filter (Active, Archived)"), "The filter offers Active and Archived."),
   R(S("S2-R14"), "Tier B is listed.", "Default and tier A are hidden.")],
  pics=["2.2"])

C("S2-11", K, "Tiers list keeps the last filter when coming back",
  [ADMIN, tier("A", ", archived", False), DESK],
  [TIERS, "Pick Archived in the Status filter.", "Open Settings › Categories.", "Open Settings › Pricing again.", "Click the Tiers tab."],
  [R(S("S2-R14"), "The list opens on Active."), R(S("S2-R14"), "Tier A is listed."), R(S("S2-R14"), "The Categories page opens."),
   R(S("S2-R14"), "Settings › Pricing opens."),
   R(S("S2-R14", "keeps each user's last filters and page when they come back"), "The Status filter still shows Archived.", "Tier A is listed.")],
  pics=["2.2"])

C("S2-12", K, "Tiers list shows 50 tiers a page",
  [ADMIN, "Have at least 51 active tiers in the client (make new ones for this test if needed), so the list needs a second page.", DESK],
  [TIERS, "Go to the list's second page."],
  [R(S("S2-R14", "shows 50 tiers a page"), "The first page shows 50 tiers, Default first."),
   R(S("S2-R14", "shows 50 tiers a page"), "The second page shows the tiers after the 50th (51 − 50 = 1 or more).")
   + R(S("S2-R17", "There is no limit on active or archived tiers."), "Every tier made for this test is listed; none was refused.")],
  pics=["2.2"], flags=["numbers"])

C("S2-13", K, "Archived filter with no archived tier says so",
  [ADMIN, "Make sure the client has no archived tier (reactivate any archived tier first).", DESK],
  [TIERS, "Pick Archived in the Status filter.", "Pick Active in the Status filter."],
  [R(S("S2-R14"), "The list shows the active tiers."),
   R(S("S2-R14", "With the Status filter on Archived and no archived tier, the list says \"No archived tiers yet.\""), "The list reads \"No archived tiers yet.\""),
   R(S("S2-R14", "With Active, there is always at least Default."), "The list shows Default.")],
  pics=["2.2"])

# ---- New Tier ----------------------------------------------------------------------------------------------------------------------
C("S2-14", K, "New Tier opens a page, not a dialog, with the name ready to type",
  [ADMIN, "Note how many active tiers the Tiers list shows (for example 6).", DESK],
  [TIERS, "Click New Tier."],
  [R(S("S2-R14"), "The list shows the active tiers."),
   R(S("S2-R17", "New Tier opens a new tier's page, with no dialog: an empty name field with the cursor in it and the hint \"New tiers go last, as Tier <n>.\", Cancel and Create Tier."),
     "A page opens, not a dialog.", "The name field is empty with the cursor in it.", "The hint under it reads \"New tiers go last, as Tier 7.\" (6 active + 1 = 7).",
     "Cancel and Create Tier show.")
   + R(S("S2-R17", "Until the tier is created, its matrix list has no checkboxes and no Set Rule."), "The matrix list shows every matrix, with no checkboxes and no Set Rule.")],
  pics=["2.10", "2.11"], flags=["numbers"])

C("S2-15", K, "Create Tier creates the tier and stays on its page",
  [ADMIN, DESK],
  [TIERS, "Click New Tier.", "Type a name no other tier uses (for example Fleet Plus).", "Click Create Tier."],
  [R(S("S2-R14"), "The list shows the active tiers."), R(S("S2-R17"), "The new tier's page opens."), R(S("S2-R17"), "The name shows in the field."),
   R(S("S2-R17", "Create Tier creates the tier and stays on its page; it can take customers at once."), "The page stays open with the name as its title.",
     "The Customers tab can be opened at once and offers Manage Customers.")
   + R(S("S2-R29", "Creating a tier shows \"<tier> created\" with \"It prices the same as the tier before it until you set its rules.\""),
       "A message reads \"Fleet Plus created\" with \"It prices the same as the tier before it until you set its rules.\"")],
  pics=["2.16", "2.17"])

C("S2-16", K, "Enter in the New Tier name field creates the tier",
  [ADMIN, DESK],
  [TIERS, "Click New Tier.", "Type a name no other tier uses.", "Press Enter."],
  [R(S("S2-R14"), "The list shows the active tiers."), R(S("S2-R17"), "The new tier's page opens."), R(S("S2-R17"), "The name shows in the field."),
   R(S("S19-R6", "Enter in the New Tier name field saves the tier."), "The tier is created: its name becomes the page title and the created message shows.")],
  pics=["2.16", "2.17"])

C("S2-17", K, "A new tier appears in every matrix as Uses previous tier",
  [ADMIN, matrix("A", " with two ranges"), DESK],
  [TIERS, "Click New Tier.", "Type a name no other tier uses.", "Press Enter.", MATRICES, open_matrix("A"), "Point at a cell in the new tier's column."],
  [R(S("S2-R14"), "The list shows the active tiers."), R(S("S2-R17"), "The new tier's page opens."), R(S("S2-R17"), "The name shows in the field."), R(S("S19-R6", "Enter in the New Tier name field saves the tier."), "The tier is created."),
   R(S("S3-R18"), "Matrix A is listed."),
   R(S("S2-R18", "A new tier appears as a column in every matrix, priced Same as previous tier until a matrix gives it something else (Story 4)."),
     "Matrix A's grid has a column for the new tier, last, headed by its number and name.", "Both its cells read \"Uses previous tier\"."),
   R(S("S4-R3", "hovering one names the tier it follows, by number and name"), "The hover names the tier before it by number and name, for example \"Uses previous tier, 6 · Internal.\"")],
  pics=["2.17", "4.2"])

C("S2-18", K, "Cancel on New Tier creates nothing",
  [ADMIN, "Note how many active tiers the Tiers list shows (for example 6).", DESK],
  [TIERS, "Click New Tier.", "Type a name no other tier uses.", "Click Cancel."],
  [R(S("S2-R14"), "The list shows 6 active tiers."), R(S("S2-R17"), "The new tier's page opens."), R(S("S2-R17"), "The name shows in the field."),
   R(S("S2-R17", "Cancelling, or leaving with no name, creates nothing (S19-R14)."), "The Tiers list shows again.",
     "It still shows 6 active tiers (6 = 6) and the typed name is not listed.")],
  pics=["2.11"], flags=["numbers"])

C("S2-19", K, "Leaving New Tier with no name creates nothing",
  [ADMIN, "Note how many active tiers the Tiers list shows (for example 6).", DESK],
  [TIERS, "Click New Tier.", "Click Matrices in the tabs."],
  [R(S("S2-R14"), "The list shows 6 active tiers."), R(S("S2-R17"), "The new tier's page opens with an empty name."),
   R(S("S2-R17", "Cancelling, or leaving with no name, creates nothing (S19-R14)."), "The Matrices list opens.")
   + R(S("S2-R17", "Cancelling, or leaving with no name, creates nothing"), "Back on the Tiers tab the list still shows 6 active tiers (6 = 6).")],
  pics=["2.11"], flags=["numbers"])

C("S2-20", K, "Create Tier with no name shows a required-field error",
  [ADMIN, DESK],
  [TIERS, "Click New Tier.", "Click Create Tier."],
  [R(S("S2-R14"), "The list shows the active tiers."), R(S("S2-R17"), "The new tier's page opens with an empty name."),
   R(S("S2-R3", "A blank or taken name shows an inline error and nothing is saved"), "Under the name field an error reads \"Tier name is a required field\".", "The page stays on New Tier.")
   + R(QD("Tier name is a required field", "2.12", "S2-R3"), "The field is outlined in red.")],
  pics=["2.12"])

C("S2-21", K, "A tier name another tier uses is refused, ignoring capitals",
  [ADMIN, tier("A", ", named for example Fleet Gold"), DESK],
  [TIERS, "Click New Tier.", "Type tier A's name in lower case (for example fleet gold).", "Click Create Tier."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R17"), "The new tier's page opens."), R(S("S2-R17"), "The typed name shows."),
   R(S("S2-R3", "unique among the client's active and archived tiers, ignoring case"), "An inline error shows under the name and nothing is created.")
   + R(QD("A tier called Tier 3 already exists.", "2.13", "S2-R3"), "The error reads \"A tier called Fleet Gold already exists.\", naming tier A as it is saved.")],
  pics=["2.13"])

C("S2-22", K, "An archived tier's name asks to rename the archived tier first",
  [ADMIN, tier("A", ", archived, named for example Fleet Old", False), DESK],
  [TIERS, "Click New Tier.", "Type tier A's name.", "Click Create Tier."],
  [R(S("S2-R14"), "The list shows the active tiers."), R(S("S2-R17"), "The new tier's page opens."), R(S("S2-R17"), "The typed name shows."),
   R(S("S2-R3", "a name an archived tier uses shows \"An archived tier is called <name>. Rename it first.\""),
     "The error reads \"An archived tier is called Fleet Old. Rename it first.\"", "No tier is created.")],
  pics=["2.14"])

C("S2-23", K, "The four report names are refused in any capitals",
  [ADMIN, DESK],
  [TIERS, "Click New Tier.", "Type MANUAL.", "Click Create Tier.", "Replace the name with fixed PRICE.", "Click Create Tier.",
   "Replace the name with Fixed Line Total.", "Click Create Tier.", "Replace the name with before tiers.", "Click Create Tier."],
  [R(S("S2-R14"), "The list shows the active tiers."), R(S("S2-R17"), "The new tier's page opens."), R(S("S2-R17"), "MANUAL shows."),
   R(S("S2-R3", "naming the reserved name as written whatever case was typed"), "The error reads \"Manual is used by the reports. Choose another name.\""),
   R(S("S2-R17"), "fixed PRICE shows."),
   R(S("S2-R3", "(\"Fixed price is used by the reports. Choose another name.\")"), "The error reads \"Fixed price is used by the reports. Choose another name.\""),
   R(S("S2-R17"), "Fixed Line Total shows."),
   R(S("S2-R3", "The names \"Manual\", \"Fixed price\", \"Fixed line total\" and \"Before tiers\", in any letter case, are reserved for the reports"),
     "The error reads \"Fixed line total is used by the reports. Choose another name.\""),
   R(S("S2-R17"), "before tiers shows."),
   R(S("S2-R3", "show \"<name> is used by the reports. Choose another name.\""), "The error reads \"Before tiers is used by the reports. Choose another name.\"", "The page is still on New Tier with no tier created.")],
  pics=["2.15"])

C("S2-24", K, "Tier name stops at 50 characters and is trimmed",
  [ADMIN, DESK],
  [TIERS, "Click New Tier.", "Type a name of 60 characters with no spaces.", "Replace the name with three spaces, a new name no other tier uses and three spaces.", "Click Create Tier."],
  [R(S("S2-R14"), "The list shows the active tiers."), R(S("S2-R17"), "The new tier's page opens."),
   R(S("S2-R3", "The field stops accepting characters at 50."), "The field holds the first 50 characters and takes no more (60 − 50 = 10 characters left out)."),
   R(S("S2-R17"), "The name shows with its spaces."),
   R(S("S2-R3", "A tier name is required, trimmed, up to 50 characters"), "The tier is created and its title shows the name without the spaces before and after it.")],
  pics=["2.16"])

# ---- rename ----------------------------------------------------------------------------------------------------------------------
C("S2-25", K, "A tier is renamed in place on its page and saved at once",
  [ADMIN, tier("A"), matrix("A"), DESK],
  [TIERS, open_tier("A"), "Click tier A's name at the top of the page.", "Type a new name no other tier uses.", "Press Enter.", TIERS, MATRICES, open_matrix("A")],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."),
   R(S("S2-R28", "The tier's name is the page title, renamed in place and saved at once."), "The title turns into a name field holding tier A's name."),
   R(S("S2-R28"), "The field shows the new name."), R(S("S2-R28", "renamed in place and saved at once"), "The title shows the new name with no Save button needed."),
   R(S("S2-R5", "Any tier can be renamed"), "The Tiers list shows the new name in tier A's row, same number."),
   R(S("S3-R18"), "Matrix A is listed."), R(S("S4-R1", "Each tier header shows its number and name"), "Tier A's column header shows its number and the new name.")],
  pics=["2.33", "2.34", "2.35", "2.37"])

C("S2-26", K, "Renaming a tier to a taken name keeps the old name",
  [ADMIN, tier("A"), tier("B"), DESK],
  [TIERS, open_tier("A"), "Click tier A's name at the top of the page.", "Type tier B's name.", "Press Enter.", "Click outside the name field.", RELOAD],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R28"), "The name can be edited."), R(S("S2-R28"), "The field shows tier B's name."),
   R(S("S2-R3", "A blank or taken name shows an inline error and nothing is saved"), "An inline error shows under the name.")
   + R(QD("A tier called Tier 3 already exists. Click away to keep Tier 2.", "2.36", "S2-R3"), "It reads \"A tier called\" followed by tier B's name, \"already exists. Click away to keep\" and tier A's name."),
   R(QD("A tier called Tier 3 already exists. Click away to keep Tier 2.", "2.36", "S2-R3"), "The title shows tier A's own name again."),
   R(S("S2-R3", "nothing is saved"), "After the reload the title is tier A's own name.")],
  pics=["2.36"])

# ---- archive, delete, reactivate ----------------------------------------------------------------------------------------------------
C("S2-27", K, "Archiving a tier with customers is blocked and lists them",
  [CUST2, tier("A"), customer("A", ", on tier A for work orders and Part Sales"), customer("B", ", on tier A for work orders only"), DESK],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Archive."],
  [R(S("S2-R14"), "Tier A is listed with Customers 2."), R(S("S2-R26"), "The menu offers Archive."),
   R(S("S2-R7", "A tier with customers on it, for either channel, can't be archived or deleted."), "A dialog opens instead of archiving.")
   + R(S("S2-R7", "open a dialog that says so and lists those customers with their channel(s), with the Remove Customers link (S2-R12)"),
       "It lists customer A with work orders and Part Sales and customer B with work orders only.", "It has a Remove Customers link.")
   + R(S("S2-R12", "In that dialog, Close is a secondary button, as in every dialog that only informs."), "Its only button is Close, styled as a secondary button.")
   + R(S("S2-R7", "There is no move step in the dialog and no \"move all to another tier\" action."), "The dialog offers no move step and no \"move all to another tier\" action, while Close and Remove Customers show.")
   + R(QD("Tier 2 Can't Be Archived Yet", "2.19", "S2-R7"), "The title reads tier A's name followed by \"Can't Be Archived Yet\".")],
  pics=["2.18", "2.19"])

C("S2-28", K, "Remove Customers opens Manage Customers on the Remove tab",
  [CUST2, tier("A"), customer("A", ", on tier A for work orders"), DESK],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Archive.", "Click Remove Customers in the dialog."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R26"), "The menu offers Archive."), R(S("S2-R7"), "The blocked dialog lists customer A."),
   R(S("S2-R12", "A \"Remove Customers\" link opens that tier's Manage Customers on the Remove tab"), "Manage Customers for tier A opens on the Remove tab, listing customer A.")],
  pics=["2.19", "2.20"])

C("S2-29", K, "Remove Customers link is hidden without Customers — Create & Edit",
  [CUST2.replace(" and 'Customers — Create & Edit'", "").replace("'Customers — Create & Edit', ", ""),
   "Make sure the signed-in user's role has 'Customers — View' but not 'Customers — Create & Edit'.", tier("A"), customer("A", ", on tier A for work orders"), DESK],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Archive."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R26"), "The menu offers Archive."),
   R(S("S2-R12", "The link shows only to users with 'Customers — Create & Edit'."), "The blocked dialog lists customer A and has Close.", "No Remove Customers link shows.")],
  pics=["2.19"])

C("S2-30", K, "Delete on a tier with customers that priced nothing is blocked too",
  [CUST2, tier("A"), customer("A", ", on tier A for Part Sales only"), DESK],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Delete."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R13", "Otherwise, Archive and Delete on a tier with customers open the dialog in S2-R7."), "Delete can be clicked (not grayed)."),
   R(S("S2-R7", "Archive, and Delete unless it is grayed (S2-R13), open a dialog that says so and lists those customers with their channel(s)"),
     "The blocked dialog opens, listing customer A with Part Sales only.", "Tier A is not deleted.")],
  pics=["2.19"])

C("S2-31", K, "Archiving a tier nothing follows asks one plain question",
  [ADMIN, tier("A", " with no customers; no tier uses Same as previous tier after it (make tier A the last tier)"), DESK],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Archive.", "Click Cancel.", "Open tier A's three-dot menu again.", "Click Archive.", "Click Archive in the dialog."],
  [R(S("S2-R14"), "Tier A is the last active tier."), R(S("S2-R26"), "The menu offers Archive."),
   R(S("S2-R30", "If no tier follows it, the question is just \"Archive <tier>?\" (or \"Delete <tier>?\") with the same last line."),
     "A dialog titled \"Archive\" followed by tier A's name and \"?\" opens.", "Its only text reads \"Parts already on work orders keep their prices.\"", "Its buttons are Cancel and Archive."),
   R(S("S2-R30", "Buttons: Cancel and Archive (or Delete)."), "The dialog closes and tier A is still active with its number."),
   R(S("S2-R26"), "The menu offers Archive."), R(S("S2-R30"), "The same question opens."),
   R(S("S2-R6", "A tier other than Default can be archived."), "Tier A moves to the archived rows, with status Archived.")
   + R(QD("It stays in reports. The tiers after it move up one number.", "2.24", "S2-R6"), "A message reads tier A's name and \"archived\" with \"It stays in reports. The tiers after it move up one number.\"")],
  pics=["2.21", "2.23", "2.24"])

C("S2-32", K, "Archiving a tier lists every tier that follows it",
  [ADMIN, tier("A"), tier("B", ", the next tier after tier A, on Same as previous tier in every matrix"),
   tier("C", ", the next tier after tier B, on Same as previous tier in every matrix"), matrix("A", ", in which tier A has its own rule 10% off"),
   "Note the name of the tier just before tier A (tier P).", DESK],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Archive."],
  [R(S("S2-R14"), "Tier A, tier B and tier C are listed in that order."), R(S("S2-R26"), "The menu offers Archive."),
   R(S("S2-R30", "names, one per line, each tier whose prices change because it follows this one through Same as previous tier: \"These tiers price the same as <tier> and will follow <tier before it> instead:\""),
     "The text reads \"These tiers price the same as\" tier A, \"and will follow\" tier P, \"instead:\".", "Tier B and tier C are listed one per line.")
   + R(S("S2-R30", "The list names tiers only, never matrices: every tier that follows this one in any matrix or side, directly or through another tier that follows it."),
       "Tier C is listed although it follows tier A only through tier B.", "No matrix name is listed, only tiers.")
   + R(S("S2-R30", "After the list: \"Parts already on work orders keep their prices.\""), "After the list the dialog reads \"Parts already on work orders keep their prices.\"")],
  pics=["2.22"])

C("S2-33", K, "After archiving, a following tier follows the tier before it",
  [ADMIN, tier("A"), tier("B", ", the next tier after tier A, on Same as previous tier in matrix A"), matrix("A", ", in which tier A has its own rule 10% off"),
   "Note the name and number of the tier just before tier A (tier P).", DESK],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Archive.", "Click Archive in the dialog.", MATRICES, open_matrix("A"), "Point at a cell in tier B's column."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R26"), "The menu offers Archive."), R(S("S2-R30"), "The question lists tier B."),
   R(S("S2-R6"), "Tier A is archived."), R(S("S3-R18"), "Matrix A is listed."),
   R(S("S2-R6", "it has no column in any active grid"), "Matrix A's grid has no column for tier A.", "Tier B's cells read \"Uses previous tier\"."),
   R(S("S2-E2", "When a tier is archived or deleted, a tier after it priced Same as previous tier now follows the tier before it."),
     "The hover names tier P with its number, not tier A.")],
  pics=["2.22", "2.24", "4.2"])

C("S2-34", K, "Default cannot be archived or deleted",
  [ADMIN, DESK],
  [TIERS, "Open Default's three-dot menu on the Tiers list."],
  [R(S("S2-R14"), "Default is row 1."),
   R(S("S2-R8", "The Default tier can't be archived or deleted."), "The menu opens and offers Audit Log.", "Archive and Delete cannot be used on Default (they are missing or grayed).")],
  pics=["2.41", "2.4"])

C("S2-35", K, "Deleting a tier that priced nothing removes it and its columns",
  [ADMIN, tier("A", " with no customers that has priced no line"), matrix("A"), DESK],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Delete.", "Click Delete in the dialog.", MATRICES, open_matrix("A")],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R26"), "Delete can be clicked (not grayed)."),
   R(S("S2-R30", "Archive and Delete ask first."), "A dialog titled \"Delete\" followed by tier A's name and \"?\" opens.", "It reads \"Parts already on work orders keep their prices.\"", "Its buttons are Cancel and Delete."),
   R(S("S2-R8", "A tier can be deleted only when no customers are on it"), "Tier A is no longer listed, active or archived.")
   + R(QD("Tier 5 deleted", "2.30", "S2-R8"), "A message reads tier A's name followed by \"deleted\"."),
   R(S("S3-R18"), "Matrix A is listed."), R(S("S2-R8", "Deleting a tier removes its column from every matrix."), "Matrix A's grid has no column for tier A; the other tier columns show.")],
  pics=["2.28", "2.29", "2.30"])

C("S2-36", K, "Delete is grayed with the saved-lines reason when a tier priced lines",
  [CUST2, tier("A"), customer("A", ", on tier A for work orders"),
   "Have a new work order for this test, work order 1, for customer A, with 3 part lines priced by tier A, then invoiced.",
   "Have customer A put back on Default after the invoice, so tier A has no customers.", DESK],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Point at Delete.", "Click Archive."],
  [R(S("S2-R14"), "Tier A is listed with Customers 0."),
   R(S("S2-R13", "Delete is grayed, in the Tiers list menu and on the tier's page, only when the tier priced saved lines or open work orders, estimates or Part Sales still keep it (S2-R8), whether or not it has customers."),
     "Delete is grayed.", "Audit Log and Archive can be clicked."),
   R(S("S2-R13", "\"<tier> priced parts on <n> saved lines, so it can't be deleted. Archive it instead.\" when it priced saved lines"),
     "A tooltip shows beside Delete.", "It reads tier A's name followed by \"priced parts on 3 saved lines, so it can't be deleted. Archive it instead.\" (3 lines on work order 1 = 3)."),
   R(S("S2-R13", "Archive is never grayed; it keeps the data for records and reports."), "The Archive question for tier A opens.")],
  pics=["2.8", "2.38"], flags=["numbers"])

C("S2-37", K, "Delete is grayed with the open-work-orders reason, counting each once",
  [CUST2, tier("A"), customer("A", ", on tier A for work orders"),
   "Have two new open work orders for this test, work order 1 and work order 2, for customer A, with no part lines; work order 1 also has an estimate.",
   "Have customer A put back on Default after making them.", DESK],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Point at Delete."],
  [R(S("S2-R14"), "Tier A is listed with Customers 0."), R(S("S2-R13"), "Delete is grayed."),
   R(S("S2-R13", "\"Can't delete <tier>. <n> open work orders, estimates or Part Sales use it.\" when open ones keep it"),
     "The tooltip reads \"Can't delete\" tier A's name, \"2 open work orders, estimates or Part Sales use it.\"")
   + R(S("S2-R13", "An estimate counts as the work order it belongs to, so it is never counted twice."), "The count is 2, not 3: work order 1 and its estimate count once (1 + 1 = 2).")],
  pics=["2.8"], flags=["numbers"])

C("S2-38", K, "When both reasons apply the saved-lines reason shows",
  [CUST2, tier("A"), customer("A", ", on tier A for work orders"), "Have a new open work order for this test, work order 1, for customer A, with 2 part lines priced by tier A.", DESK],
  [TIERS, open_tier("A"), "Open the page's three-dot menu.", "Point at Delete."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."),
   R(S("S2-R13", "Delete is grayed, in the Tiers list menu and on the tier's page"), "The page's menu shows Audit Log, Archive and a grayed Delete."),
   R(S("S2-R13", "When both are true, the saved-lines reason shows."), "The tooltip reads tier A's name followed by \"priced parts on 2 saved lines, so it can't be deleted. Archive it instead.\"",
     "The open-work-orders text is not shown, though work order 1 is open.", "The count 2 = the 2 part lines on work order 1.")],
  pics=["2.38"], flags=["numbers"])

C("S2-39", K, "A customer taken off before any pricing does not block delete",
  [CUST2, tier("A"), customer("A", ", put on tier A and then back on Default before any part was priced for them"), DESK],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Delete."],
  [R(S("S2-R14"), "Tier A is listed with Customers 0."), R(S("S2-R26"), "The menu offers Delete, not grayed."),
   R(S("S2-R8", "a customer who was on the tier and was taken off before any part was priced"), "The Delete question opens (Delete was not grayed and no blocked dialog showed).")],
  pics=["2.28", "2.29"])

C("S2-40", K, "Lines a tier priced that were later deleted do not block delete",
  [CUST2, tier("A"), customer("A", ", on tier A for work orders"), "Have a new open work order for this test, work order 1, for customer A, with 1 part line priced by tier A.",
   "Have that part line deleted and customer A put back on Default.", DESK],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Delete."],
  [R(S("S2-R14"), "Tier A is listed with Customers 0."), R(S("S2-R26"), "The menu offers Delete, not grayed."),
   R(S("S2-R8", "lines it priced that were later deleted"), "The Delete question opens; Delete was not grayed.")],
  pics=["2.29"], note="")

C("S2-41", K, "A tier kept only by an invoiced work order can be deleted",
  [CUST2, tier("A"), customer("A", ", on tier A for work orders"), "Have a new work order for this test, work order 1, for customer A, with one labor line and no parts, invoiced.",
   "Have customer A put back on Default.", "Have a part ready to add with a cost of $100.00 in a category whose Default prices it at a known price (for example $135.00)."],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Delete.", "Click Delete in the dialog.", "Open work order 1's invoice.", "Reverse the invoice.", "Add the part to work order 1."],
  [R(S("S2-R14"), "Tier A is listed."),
   R(S("S2-R8"), "Delete can be clicked (not grayed).")
   + R(QT("a tier kept only by an invoiced work order deletes", "TPX-02"), "No open work order keeps tier A, so nothing blocks it."),
   R(S("S2-R30"), "The Delete question opens."), R(S("S2-R8"), "Tier A is deleted."), R(S("S2-R8"), "The invoice opens."),
   R(QT("reversing that invoice returns the work order to Complete", "TPX-02"), "Work order 1 is back in status Complete."),
   R(QT("a part added then prices at Default", "TPX-02"), "The part is priced at the Default price, $135.00 = Default's $135.00, and its price details name Default.")],
  pics=["2.29"], flags=["numbers"])

C("S2-42", K, "Reactivate brings a tier back last with no confirmation",
  [ADMIN, tier("A", ", archived", False), "Note how many active tiers the Tiers list shows (for example 5).", DESK],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Reactivate."],
  [R(S("S2-R14"), "Tier A shows among the archived rows."),
   R(S("S2-R26", "An archived tier's row menu has Reactivate and Delete."), "The menu offers Reactivate and Delete."),
   R(S("S2-R26", "Reactivate applies at once, with no confirmation, and shows \"<tier> is reactivated. It's now the last tier, Tier <n>.\""),
     "No question is asked.", "A message reads tier A's name followed by \"is reactivated. It's now the last tier, Tier 6.\" (5 active + 1 = 6).")
   + R(S("S2-R6", "Reactivated, it goes last, with the next number"), "Tier A is the last active row, number 6.")],
  pics=["2.25", "2.26", "2.27"], flags=["numbers"])

C("S2-43", K, "A reactivated tier's columns come back with their rules",
  [ADMIN, tier("A"), matrix("A", ", in which tier A has its own rule 15% off"), DESK],
  [TIERS, "Archive tier A from its three-dot menu.", "Click Archive in the dialog.", "Click Reactivate in tier A's three-dot menu.", MATRICES, open_matrix("A")],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R30"), "The Archive question opens."), R(S("S2-R6"), "Tier A is archived."),
   R(S("S2-R26"), "Tier A is active again, last."), R(S("S3-R18"), "Matrix A is listed."),
   R(S("S2-R6", "its columns come back as they were"), "Matrix A's grid has tier A's column again.", "It reads 15% off in every range.")],
  pics=["2.27"])

C("S2-44", K, "A follower keeps its new tier after the archived tier is reactivated",
  [ADMIN, tier("A"), tier("B", ", the next tier after tier A, on Same as previous tier in matrix A"), matrix("A", ", in which tier A has its own rule 10% off"),
   "Note the name of the tier just before tier A (tier P).", DESK],
  [TIERS, "Archive tier A from its three-dot menu.", "Click Archive in the dialog.", "Click Reactivate in tier A's three-dot menu.", MATRICES, open_matrix("A"), "Point at a cell in tier B's column."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R30"), "The Archive question opens."), R(S("S2-R6"), "Tier A is archived."), R(S("S2-R26"), "Tier A is active again, last, after tier B."),
   R(S("S3-R18"), "Matrix A is listed."),
   R(S("S2-R6", "A tier after it on Same as previous tier keeps following the tier it follows now."), "Tier B's cells read \"Uses previous tier\"."),
   R(S("S2-R6", "keeps following the tier it follows now"), "The hover names tier P, not tier A.")],
  pics=["2.27", "4.2"])

C("S2-45", K, "Deleting an archived tier that priced nothing asks first",
  [ADMIN, tier("A", ", archived, that never priced a line", False), DESK],
  [TIERS, "Open tier A's three-dot menu on the Tiers list.", "Click Delete.", "Click Delete in the dialog."],
  [R(S("S2-R14"), "Tier A shows among the archived rows."),
   R(S("S2-R26", "an archived tier has no customers (S2-R7), so its Delete is either grayed (S2-R13) or asks first (S2-R30)"), "Delete can be clicked."),
   R(S("S2-R26", "Delete follows S2-R8 and S2-R13, the same in the Tiers list menu and on the tier's page"), "The Delete question for tier A opens with Cancel and Delete."),
   R(S("S2-R8"), "Tier A is gone from the archived rows.", "The other archived tiers are still listed.")],
  pics=["2.25", "2.29"])

C("S2-46", K, "An archived tier cannot take customers",
  [CUST2, tier("A", ", archived", False), DESK],
  [TIERS, open_tier("A"), "Click the Customers tab."],
  [R(S("S2-R14"), "Tier A shows among the archived rows."), R(S("S2-R28", "Clicking an active or archived tier's row on the Tiers list opens its page on the Pricing tab"), "Tier A's page opens on the Pricing tab."),
   R(S("S2-R6", "can't be assigned customers (its Customers tab has no Manage Customers; a tier must be reactivated before customers are added)"),
     "The Customers tab has no Manage Customers button.")
   + R(QT("an archived tier's Customers tab has Reactivate Tier, applied at once with no confirmation", "TPX-18"), "It offers Reactivate Tier instead.")],
  pics=["2.43", "9.21"])

C("S2-47", K, "Reactivate Tier on an archived tier's Customers tab applies at once",
  [CUST2, tier("A", ", archived", False), DESK],
  [TIERS, open_tier("A"), "Click the Customers tab.", "Click Reactivate Tier."],
  [R(S("S2-R14"), "Tier A shows among the archived rows."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R6"), "The tab offers Reactivate Tier."),
   R(QT("an archived tier's Customers tab has Reactivate Tier, applied at once with no confirmation", "TPX-18"), "No question is asked.", "The tab now offers Manage Customers.")
   + R(S("S2-R26", "Reactivate applies at once, with no confirmation"), "The reactivated message shows.")],
  pics=["9.21", "9.22", "9.23"])

C("S2-48", K, "An archived tier has no column in grids or on the Categories page",
  [ADMIN, tier("A", ", archived", False), matrix("A", ", pricing a new category made for this test, category A"), DESK],
  [MATRICES, open_matrix("A"), CATEGORIES],
  [R(S("S3-R18"), "Matrix A is listed."),
   R(S("S2-R6", "it has no column in any active grid"), "Matrix A's grid shows Default and the active tiers.", "No column is headed by tier A."),
   R(S("S2-R6", "or on the Categories page"), "The Categories page shows a column per active tier.", "No column is headed by tier A.")],
  pics=["2.24", "3.2", "7.3"])

C("S2-49", K, "An archived tier can be renamed and given a rule from its page",
  [ADMIN, tier("A", ", archived", False), matrix("A"), DESK],
  [TIERS, open_tier("A"), "Click tier A's name at the top of the page.", "Type a new name no other tier uses.", "Press Enter.", "Check matrix A.",
   "Type 12 in the bulk bar's value.", "Click Set Rule.", "Click Set Rule in the dialog."],
  [R(S("S2-R14"), "Tier A shows among the archived rows."), R(S("S2-R28"), "Tier A's page opens, with Archived beside the name."),
   R(S("S2-R6", "It can be renamed and its pricing changed from its page"), "The name can be edited."), R(S("S2-R6"), "The field shows the new name."),
   R(S("S2-R6", "It can be renamed"), "The title shows the new name."),
   R(S("S2-R22"), "The bulk bar shows the count 1."), R(S("S2-R22"), "% Off is picked with the value 12."), R(S("S2-R23"), "The Set Rule question opens."),
   R(S("S2-R6", "its pricing changed from its page (Set Rule"), "Matrix A's row reads 12% off.")],
  pics=["2.43", "2.44"])

C("S2-50", K, "An archived tier still prices parts on an open work order that keeps it",
  [CUST2, tier("A"), matrix("A", ", pricing a new category made for this test, category A, Default 50% markup, tier A 10% off"),
   customer("A", ", on tier A for work orders"), ONE_WO + " Make it while customer A is on tier A.", "Have customer A put back on Default after making work order 1."],
  [TIERS, "Archive tier A from its three-dot menu.", "Click Archive in the dialog.", "Open work order 1.", "Add a part with a cost of $100.00 in category A."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R30"), "The Archive question opens."), R(S("S2-R6"), "Tier A is archived."), R(S("S2-E2"), "Work order 1 opens."),
   R(S("S2-E2", "An archived tier still prices parts added to the open work orders and Part Sales that keep it (S10-R14)."),
     "The part is priced by tier A: Default $100.00 × 1.50 = $150.00, then 10% off = $135.00.")],
  pics=["2.24", "10.8"], flags=["numbers"])

C("S2-51", K, "Lines keep their prices when a tier they follow is archived",
  [CUST2, tier("A"), tier("B", ", the next tier after tier A, on Same as previous tier in matrix A"),
   matrix("A", ", pricing category A, Default 50% markup, tier A 10% off"), customer("A", ", on tier B for work orders"),
   ONE_WO + " It has a part with a cost of $100.00 in category A, priced $135.00 by tier B through tier A."],
  [TIERS, "Archive tier A from its three-dot menu.", "Click Archive in the dialog.", "Open work order 1."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R30"), "The Archive question lists tier B."), R(S("S2-R6"), "Tier A is archived."),
   R(S("S2-E2", "Lines already saved keep their prices (S11-R6)."), "The part line still reads $135.00 = $100.00 × 1.50 × 0.90.")],
  pics=["2.22", "2.24"], flags=["numbers"])

C("S2-52", K, "Changing a tier's rule prices new parts only",
  [CUST2, tier("A"), matrix("A", ", pricing category A, Default 50% markup, tier A 10% off"), customer("A", ", on tier A for work orders"),
   ONE_WO + " It has a part with a cost of $100.00 in category A, priced $135.00."],
  [TIERS, open_tier("A"), "Check matrix A.", "Type 20 in the bulk bar's value.", "Click Set Rule.", "Click Set Rule in the dialog.", "Open work order 1.", "Add a part with a cost of $100.00 in category A."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "The bulk bar shows the count 1."), R(S("S2-R22"), "% Off is picked with the value 20."),
   R(S("S2-R23"), "The question reads tier A's name, \"becomes 20% off in 1 matrices\" or \"in 1 matrix\", and \"Parts already on work orders keep their prices.\""),
   R(S("S2-R24"), "Matrix A's row reads 20% off."),
   R(S("S2-R5", "Lines keep the name and price they recorded (S12-R5)."), "The first part line still reads $135.00."),
   R(S("S2-R5", "Edits to its columns price parts from then on."), "The new part is priced $150.00 × 0.80 = $120.00.")],
  pics=["2.55", "2.56"], flags=["numbers"])

# ---- the tier's page ---------------------------------------------------------------------------------------------------------------
C("S2-53", K, "A tier's row opens its page on the Pricing tab with a breadcrumb",
  [ADMIN, tier("A"), DESK],
  [TIERS, open_tier("A")],
  [R(S("S2-R14"), "Tier A is listed."),
   R(S("S2-R28", "Clicking an active or archived tier's row on the Tiers list opens its page on the Pricing tab, never a dialog, with the breadcrumb Settings › Pricing › Tiers › <tier>"),
     "A page opens, not a dialog, on the Pricing tab.", "The breadcrumb reads Settings › Pricing › Tiers › and tier A's name.")
   + R(S("S2-R20", "A tier's page has Pricing and Customers tabs."), "The page has a Pricing tab and a Customers tab.")
   + R(S("S2-R15", "The number shows as plain text beside the tier's name"), "Tier A's number shows as plain text beside its name.")],
  pics=["2.31", "2.32"])

C("S2-54", K, "A tier's page opened from a bookmark shows the same breadcrumb",
  [ADMIN, tier("A"), "Have tier A's page address bookmarked (or copied).", DESK],
  ["Open the bookmark in a new browser tab."],
  [R(S("S2-R28", "with the breadcrumb Settings › Pricing › Tiers › <tier>, also when opened from a link or bookmark"),
     "Tier A's page opens on the Pricing tab.", "The breadcrumb reads Settings › Pricing › Tiers › and tier A's name.")],
  pics=["2.32"])

C("S2-55", K, "Coming back from a tier's page keeps the list's filter and page",
  [ADMIN, tier("A", ", archived", False), DESK],
  [TIERS, "Pick Archived in the Status filter.", open_tier("A"), "Click Tiers in the breadcrumb."],
  [R(S("S2-R14"), "The list opens on Active."), R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."),
   R(S("S2-R28", "Coming back keeps the list's filter and page (S2-R14)."), "The Tiers list shows with the Status filter still on Archived and tier A listed.")],
  pics=["2.32"])

C("S2-56", K, "A tier's Pricing tab shows how each matrix prices it, in the grid's words",
  [ADMIN, tier("A"), matrix("A", ", whose name starts with A, with Separate Part Sale pricing off, tier A 10% off in every range"),
   matrix("B", ", whose name starts with B, with tier A on Same as previous tier"),
   matrix("C", ", whose name starts with C, with Separate Part Sale pricing on, tier A 35% markup on the Part Sale side"),
   matrix("D", ", whose name starts with D, tier A on Margin % with 30 in one range and 25 in the other"), DESK],
  [TIERS, open_tier("A")],
  [R(S("S2-R14"), "Tier A is listed."),
   R(S("S2-R20", "Pricing lists every matrix with its categories and two columns, Work Order Matrix and Part Sale Matrix"),
     "Each matrix row shows its name with its categories under it, a Work Order Matrix value and a Part Sale Matrix value.")
   + R(S("S2-R20", "The matrix list shows the General Matrix first, then matrices A to Z by name"), "The General Matrix is first, then matrix A, matrix B, matrix C and matrix D in A to Z order.")
   + R(S("S2-R20", "in the grid's words (\"Uses previous tier\", \"10% off\", \"% markup\", \"Mixed rules\"; S4-R31)"),
       "Matrix A's Work Order Matrix value reads 10% off.", "Matrix B's reads Uses previous tier.", "Matrix D's reads % margin (two different values).")
   + R(S("S2-R20", "(\"Same as work orders\" when the matrix has no separate Part Sale side)"), "Matrix A's and matrix B's Part Sale Matrix values read Same as work orders.")
   + R(S("S2-R20", "Part Sale Matrix, showing how each side prices the tier"), "Matrix C's Part Sale Matrix value reads 35% markup.")],
  pics=["2.32"])

C("S2-57", K, "Default's page lists Default rules with no checkboxes and no Set Rule",
  [ADMIN, matrix("A", ", whose Default is 40% markup in every range"), DESK],
  [TIERS, "Click Default's row."],
  [R(S("S2-R14"), "Default is row 1."),
   R(S("S2-R20", "the Default tier's Pricing tab lists every matrix with its Default rules"), "Default's Pricing tab lists every matrix, matrix A among them, with its Default rule: matrix A reads 40% markup.")
   + R(S("S2-N8", "The Default tier's page has no checkboxes and no Set Rule; Default is priced by each matrix's Default column."), "The list has no checkboxes and no Set Rule bar, while every matrix is listed.")],
  pics=["2.41", "2.42"])

C("S2-58", K, "Edit on a tier's matrix row opens the grid in edit at that tier",
  [ADMIN, tier("A"), matrix("A"), DESK],
  [TIERS, open_tier("A"), "Click Edit on matrix A's row."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."),
   R(S("S2-R20", "Edit on a matrix's row opens that matrix's page already in edit, with the tier's column in view (S3-R26)."),
     "Matrix A's page opens with its grid already in edit (Cancel and Save show).", "Tier A's column is in view.")
   + R(S("S3-R26", "Settings › Pricing › Tiers › <tier> › <matrix> from a tier"), "The breadcrumb reads Settings › Pricing › Tiers › tier A's name › matrix A's name.")],
  pics=["2.45", "2.46"])

C("S2-59", K, "A tier's matrix list loads more matrices while scrolling",
  [ADMIN, tier("A"), "Have at least 60 matrices in the client (duplicate matrices for this test if needed).", DESK],
  [TIERS, open_tier("A"), "Scroll to the bottom of the matrix list."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens with the first matrices listed, General Matrix first."),
   R(S("S2-R20", "loads as the work order list does: the same number at a time, with more loading as the user scrolls"), "More matrices load at the bottom, still in A to Z order.")],
  pics=["2.32"])

# ---- Set Rule ----------------------------------------------------------------------------------------------------------------------
C("S2-60", K, "Checking two matrices shows the bulk bar with its controls",
  [ADMIN, tier("A"), matrix("A"), matrix("B"), DESK],
  [TIERS, open_tier("A"), "Check matrix A.", "Check matrix B."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens with no bar above the list."),
   R(S("S2-R22", "Checking a row doesn't open the matrix."), "Matrix A's row is checked and tier A's page stays open.")
   + R(S("S2-R22", "While any matrix is checked, the design system's bulk action bar shows at the top of the matrix list"), "A dark bar shows at the top of the matrix list."),
   R(S("S2-R22", "It shows the count (\"2 matrices\"), \"Set <tier> to\", one rule picker grouped as in the grid (Off default price: % Off, $ Off; From cost: + $, Markup %, Margin %) that starts on % Off, its value, Set Rule and a clear button that unchecks every matrix."),
     "The bar shows the count 2 with \"matrices\", \"Set\" tier A's name \"to\", a rule picker on % Off, an empty value, Set Rule and a clear (X) button.")],
  pics=["2.47", "2.49"])

C("S2-61", K, "Select-all checks every matrix, inactive ones included",
  [ADMIN, tier("A"), matrix("A", ", Inactive (no category)"), "Note how many matrices the Matrices tab label shows (for example 7).", DESK],
  [TIERS, open_tier("A"), "Click the select-all checkbox in the matrix list header.", "Uncheck matrix A."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."),
   R(S("S2-R22", "a select-all checkbox in the header, which checks every matrix, Active and Inactive, loaded or not"), "Every row is checked, matrix A included.", "The bar's count is 7, the same as the Matrices tab (7 = 7)."),
   R(S("S2-R22", "shows partly checked when only some are"), "The header checkbox shows partly checked.", "The count drops to 6 (7 − 1).")],
  pics=["2.48", "2.49"], flags=["numbers"])

C("S2-62", K, "The bulk bar's clear button unchecks every matrix",
  [ADMIN, tier("A"), matrix("A"), matrix("B"), DESK],
  [TIERS, open_tier("A"), "Check matrix A.", "Check matrix B.", "Click the bar's clear (X) button."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "The bar shows the count 1."), R(S("S2-R22"), "The bar shows the count 2."),
   R(S("S2-R22", "a clear button that unchecks every matrix"), "Matrix A and matrix B are unchecked.", "The bar is gone and the list shows again at its usual place.")
   + R(S("S2-N7", "Cancel in the confirmation, or clearing the checks, changes nothing."), "Matrix A and matrix B keep their values for tier A.")],
  pics=["2.47", "2.32"])

C("S2-63", K, "The Set Rule picker lists five rules in two groups",
  [ADMIN, tier("A"), matrix("A"), DESK],
  [TIERS, open_tier("A"), "Check matrix A.", "Open the bar's rule picker."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "The bar shows the picker on % Off."),
   R(S("S2-R22", "one rule picker grouped as in the grid (Off default price: % Off, $ Off; From cost: + $, Markup %, Margin %)"),
     "The picker lists a group Off default price with % Off and $ Off, then a group From cost with + $, Markup % and Margin %.")
   + R(S("S2-R22", "The picker has no Previous tier option"), "It has no Previous tier option, only those five.")
   + R(S("S2-R22", "There is no Set Rule For Entire Tier button."), "The bar has a Set Rule button and no Set Rule For Entire Tier button.")],
  pics=["2.50"])

C("S2-64", K, "Set Rule asks first and counts only matrices that would change",
  [ADMIN, tier("A"), matrix("A", ", Active, tier A on Same as previous tier"), matrix("B", ", Active, tier A already 10% off in every range"),
   matrix("C", ", Inactive (no category), tier A on Same as previous tier"), DESK],
  [TIERS, open_tier("A"), "Check matrix A.", "Check matrix B.", "Check matrix C.", "Type 10 in the bar's value.", "Click Set Rule."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "The count is 1."), R(S("S2-R22"), "The count is 2."), R(S("S2-R22"), "The count is 3."),
   R(S("S2-R22", "that starts on % Off"), "The value reads 10 with % Off."),
   R(S("S2-R23", "Set Rule asks first: \"Set <tier>'s Rule?\" with \"<tier> becomes <rule> in <n> matrices (<m> inactive), replacing what it had. Parts already on work orders keep their prices.\" and Cancel / Set Rule."),
     "A dialog titled \"Set\" tier A's name \"'s Rule?\" opens with Cancel and Set Rule.")
   + R(S("S2-R23", "The count is the checked matrices whose rules for the tier would change; \"(<m> inactive)\" shows only when some are Inactive."),
       "It reads tier A's name, \"becomes 10% off in 2 matrices (1 inactive), replacing what it had. Parts already on work orders keep their prices.\" (3 checked − matrix B already 10% off = 2, of which matrix C is inactive).")],
  pics=["2.53", "2.54"], flags=["numbers"])

C("S2-65", K, "Set Rule question leaves out inactive when none are inactive",
  [ADMIN, tier("A"), matrix("A", ", Active"), matrix("B", ", Active"), DESK],
  [TIERS, open_tier("A"), "Check matrix A.", "Check matrix B.", "Type 35 in the bar's value.", "Click Set Rule."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "The count is 1."), R(S("S2-R22"), "The count is 2."),
   R(S("S2-R22"), "The value reads 35 with % Off."),
   R(S("S2-R23", "\"(<m> inactive)\" shows only when some are Inactive"), "The question reads tier A's name, \"becomes 35% off in 2 matrices, replacing what it had. Parts already on work orders keep their prices.\"",
     "It shows no \"inactive\" count, while the count 2 shows (2 checked − 0 unchanged = 2).")],
  pics=["2.54", "2.55"], flags=["numbers"])

C("S2-66", K, "Set Rule that changes nothing asks nothing and says so",
  [ADMIN, tier("A"), matrix("A", ", tier A already 35% markup in every range"), matrix("B", ", tier A already 35% markup in every range"), DESK],
  [TIERS, open_tier("A"), "Check matrix A.", "Pick Markup % in the bar's rule picker.", "Type 35 in the bar's value.", "Click Set Rule.", "Check matrix B.", "Click Set Rule."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "The count is 1."), R(S("S2-R22"), "Markup % is picked."), R(S("S2-R22"), "The value reads 35."),
   R(S("S2-R23", "When no checked matrix would change, nothing is asked and \"<tier> already uses <rule> in those matrices\" shows (\"in that matrix\" for one)."),
     "No question is asked.", "A message reads tier A's name followed by \"already uses 35% markup in that matrix\"."),
   R(S("S2-R22"), "The count is 2 (matrix A and matrix B checked)."),
   R(S("S2-R23", "\"<tier> already uses <rule> in those matrices\""), "No question is asked.", "A message reads tier A's name followed by \"already uses 35% markup in those matrices\".")],
  pics=["2.59", "2.60"])

C("S2-67", K, "Set Rule sets every range of every checked side and leaves the rest",
  [ADMIN, tier("A"), matrix("A", ", used by two new categories made for this test, three ranges, tier A on Same as previous tier"),
   matrix("B", ", Inactive, with Separate Part Sale pricing on, tier A on its own rule 5% off on both sides"), matrix("C", ", tier A on 7% off"), DESK],
  [TIERS, open_tier("A"), "Check matrix A.", "Check matrix B.", "Type 20 in the bar's value.", "Click Set Rule.", "Click Set Rule in the dialog.", MATRICES, open_matrix("A"),
   "Open matrix B's page from the Matrices list.", "Click the Part Sale Matrix tab."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "The count is 1."), R(S("S2-R22"), "The count is 2."), R(S("S2-R22"), "The value reads 20 with % Off."),
   R(S("S2-R23"), "The question says 2 matrices (1 inactive)."),
   R(S("S2-R24", "It never asks Change All (S3-R12 covers grid saves only)."), "No Change Prices question appears, though matrix A prices two categories.")
   + R(S("S2-R24", "Unchecked matrices don't change, and the checks clear."), "The checks clear.", "Matrix C's row still reads 7% off."),
   R(S("S3-R18"), "Matrix A is listed."),
   R(S("S2-R24", "On confirm, the tier gets that rule in every range of every checked matrix, Active and Inactive, on the Work Order Matrix side"),
     "Tier A's column in matrix A reads 20% off in all three ranges."),
   R(S("S2-R24", "every checked matrix, Active and Inactive"), "Inactive matrix B's Work Order Matrix shows tier A at 20% off."),
   R(S("S2-R24", "and on each Part Sale side that is on, replacing what it had there"), "Matrix B's Part Sale grid also shows tier A at 20% off, replacing 5% off.")],
  pics=["2.54", "2.55", "2.56"])

C("S2-68", K, "A matrix made after Set Rule starts the tier on Same as previous tier",
  [ADMIN, tier("A"), DESK],
  [TIERS, open_tier("A"), "Click the select-all checkbox in the matrix list header.", "Type 10 in the bar's value.", "Click Set Rule.", "Click Set Rule in the dialog.",
   MATRICES, "Click New Matrix."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "Every matrix is checked."), R(S("S2-R22"), "The value reads 10."),
   R(S("S2-R23"), "The question opens."), R(S("S2-R24"), "Every row reads 10% off."), R(S("S3-R18"), "The Matrices list shows."),
   R(S("S2-R24", "A matrix created afterwards starts the tier as Same as previous tier (S3-R30)"), "The new matrix's grid shows tier A's picker on Previous tier, not 10% off.")],
  pics=["3.22"])

C("S2-69", K, "A Part Sale side turned on after Set Rule copies the tier's rule",
  [ADMIN, tier("A"), matrix("A", ", with Separate Part Sale pricing off"), DESK],
  [TIERS, open_tier("A"), "Check matrix A.", "Type 10 in the bar's value.", "Click Set Rule.", "Click Set Rule in the dialog.", MATRICES, open_matrix("A"), "Click the Part Sale Matrix tab.",
   "Switch Separate Part Sale pricing on."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "The count is 1."), R(S("S2-R22"), "The value reads 10."),
   R(S("S2-R23"), "The question opens."), R(S("S2-R24"), "Matrix A's row reads 10% off."), R(S("S3-R18"), "Matrix A is listed."), R(S("S3-R18"), "Matrix A's page opens on the Work Order Matrix tab."), R(S("S3-R21"), "The tab shows the switch, off."),
   R(S("S2-R24", "a Part Sale side turned on afterwards copies the tier's rule from the work order side (S3-R31)"), "The Part Sale grid shows tier A at 10% off in every range.")],
  pics=["3.17", "3.18"])

C("S2-70", K, "Set Rule message offers Undo and stays 20 seconds",
  [ADMIN, tier("A"), matrix("A"), matrix("B"), "Have a clock or timer that shows seconds.", DESK],
  [TIERS, open_tier("A"), "Check matrix A.", "Check matrix B.", "Type 35 in the bar's value.", "Click Set Rule.", "Click Set Rule in the dialog.", "Wait 15 seconds without pointing at the message.", "Wait 6 more seconds."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "The count is 1."), R(S("S2-R22"), "The count is 2."), R(S("S2-R22"), "The value reads 35."),
   R(S("S2-R23"), "The question opens."),
   R(S("S2-R27", "The success message reads \"<tier> set to <rule>\" with \"<n> matrices changed.\", with Undo and a close button."),
     "A message reads tier A's name, \"set to 35% off\" and \"2 matrices changed.\", with Undo and a close (X) button."),
   R(S("S2-R27", "It stays 20 seconds"), "The message is still showing after 15 seconds."),
   R(S("S2-R27", "It stays 20 seconds"), "The message has gone after 21 seconds (15 + 6 = 21 > 20).")],
  pics=["2.56", "2.57"], flags=["numbers"])

C("S2-71", K, "The Set Rule message pauses while pointed at",
  [ADMIN, tier("A"), matrix("A"), "Have a clock or timer that shows seconds.", DESK],
  [TIERS, open_tier("A"), "Check matrix A.", "Type 35 in the bar's value.", "Click Set Rule.", "Click Set Rule in the dialog.", "Point at the message and keep the pointer there for 30 seconds.", "Move the pointer off the message.", "Wait 21 seconds."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "The count is 1."), R(S("S2-R22"), "The value reads 35."), R(S("S2-R23"), "The question opens."),
   R(S("S2-R27"), "The message shows tier A's name \"set to 35% off\" with \"1 matrix changed.\" or \"1 matrices changed.\""),
   R(S("S2-R27", "pauses while the pointer or keyboard focus is on it"), "After 30 seconds under the pointer the message is still showing (30 seconds > 20 = 30 − 20 = 10 seconds past its time)."),
   R(S("S2-R27"), "The message is still showing just after the pointer leaves."),
   R(S("S2-R27", "It stays 20 seconds"), "The message goes within the 21 seconds after the pointer leaves (21 > 20).")],
  pics=["2.56", "2.57"], flags=["numbers"])

C("S2-72", K, "The Set Rule message stays while moving to another page",
  [ADMIN, tier("A"), matrix("A"), DESK],
  [TIERS, open_tier("A"), "Check matrix A.", "Type 35 in the bar's value.", "Click Set Rule.", "Click Set Rule in the dialog.", "Click Fixed Rules in the Settings › Pricing tabs."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "The count is 1."), R(S("S2-R22"), "The value reads 35."), R(S("S2-R23"), "The question opens."),
   R(S("S2-R27"), "The message with Undo shows."),
   R(QT("the Undo toast is hosted app-wide so it keeps its 20 s across navigation", "TPX-16"), "The Fixed Rules tab opens and the message with Undo is still showing.")],
  pics=["2.56"])

C("S2-73", K, "Undo puts back exactly what the tier had",
  [ADMIN, tier("A"), matrix("A", ", tier A on its own rule 25% margin"), matrix("B", ", tier A on Same as previous tier"), DESK],
  [TIERS, open_tier("A"), "Check matrix A.", "Check matrix B.", "Type 35 in the bar's value.", "Click Set Rule.", "Click Set Rule in the dialog.", "Click Undo in the message."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens: matrix A reads 25% margin, matrix B Uses previous tier."), R(S("S2-R22"), "The count is 1."), R(S("S2-R22"), "The count is 2."),
   R(S("S2-R22"), "The value reads 35."), R(S("S2-R23"), "The question opens."), R(S("S2-R24"), "Matrix A and matrix B read 35% off."),
   R(S("S2-R27", "Undo puts back exactly what the tier had in every matrix it changed and shows \"Undone\" with \"<tier>'s rules are back.\""),
     "A message reads \"Undone\" with tier A's name and \"'s rules are back.\"", "Matrix A reads 25% margin again.", "Matrix B reads Uses previous tier again.")],
  pics=["2.57", "2.58"])

C("S2-74", K, "Undo is refused once a changed matrix was saved again",
  [ADMIN, tier("A"), matrix("A", ", tier A on Same as previous tier"), "Open matrix A's page in a second browser tab and click Edit there.", DESK],
  [TIERS, open_tier("A"), "Check matrix A.", "Type 35 in the bar's value.", "Click Set Rule.", "Click Set Rule in the dialog.", "Change a Default value in the second tab.", "Click Save in the second tab.",
   "Click Undo in the message in the first tab."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "The count is 1."), R(S("S2-R22"), "The value reads 35."), R(S("S2-R23"), "The question opens."),
   R(S("S2-R27"), "The message with Undo shows; matrix A reads 35% off."), R(S("S4-R4"), "The second tab's edit bar counts 1 change."),
   R(S("S4-R12"), "The second tab saves matrix A."),
   R(S("S2-E5", "Undo is refused once any matrix it would change was saved again after the rule was set. The message names the matrix: \"Can't undo: <matrix> was saved after this rule was set.\" Nothing changes."),
     "An error reads \"Can't undo:\" matrix A's name \"was saved after this rule was set.\"", "Matrix A still reads 35% off for tier A.")],
  pics=["2.57"])

C("S2-75", K, "Set Rule with no value is blocked with a message",
  [ADMIN, tier("A"), matrix("A"), DESK],
  [TIERS, open_tier("A"), "Check matrix A.", "Click Set Rule with the value empty."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "The bar shows % Off with an empty value."),
   R(S("S2-N7", "Set Rule is blocked while its value is empty or invalid, with the message by the bar: \"Enter a % from 0 to 99.99\" (% Off)"),
     "No question opens.", "By the bar a message reads \"Enter a % from 0 to 99.99\".")],
  pics=["2.51"])

C("S2-76", K, "Set Rule refuses out-of-range % Off, margin and markup values",
  [ADMIN, tier("A"), matrix("A"), DESK],
  [TIERS, open_tier("A"), "Check matrix A.", "Type 100 in the bar's value.", "Click Set Rule.", "Pick Margin % in the bar's rule picker.", "Type 120 in the bar's value.", "Click Set Rule.",
   "Pick Markup % in the bar's rule picker.", "Type -5 in the bar's value.", "Click Set Rule."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "The count is 1."), R(S("S2-R22"), "The value reads 100."),
   R(S("S2-N7", "\"Enter a % from 0 to 99.99\" (% Off)"), "No question opens; the message reads \"Enter a % from 0 to 99.99\"."),
   R(S("S2-R22"), "Margin % is picked."), R(S("S2-R22"), "The value reads 120."),
   R(S("S2-N7", "\"Enter a margin from 0 to 99.99\" (Margin %)"), "No question opens; the message reads \"Enter a margin from 0 to 99.99\"."),
   R(S("S2-R22"), "Markup % is picked."), R(S("S2-R22"), "The value field shows -5, or refuses the minus sign."),
   R(S("S2-N7", "\"Enter a value of 0 or more\" (+ $, Markup %)"), "No question opens; the message reads \"Enter a value of 0 or more\", unless the field refused the minus sign, in which case Set Rule asks with a value of 5.")],
  pics=["2.51", "2.52"])

C("S2-77", K, "Set Rule refuses a negative $ Off or + $ value",
  [ADMIN, tier("A"), matrix("A"), DESK],
  [TIERS, open_tier("A"), "Check matrix A.", "Pick $ Off in the bar's rule picker.", "Type -1 in the bar's value.", "Click Set Rule.", "Pick + $ in the bar's rule picker.", "Type -1 in the bar's value.", "Click Set Rule."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "The count is 1."), R(S("S2-R22"), "$ Off is picked."), R(S("S2-R22"), "The value shows -1, or the field refuses the minus sign."),
   R(S("S2-N7", "\"Enter an amount of $0.00 or more\" ($ Off)"), "No question opens; the message reads \"Enter an amount of $0.00 or more\" (or the minus sign was refused)."),
   R(S("S2-R22"), "+ $ is picked."), R(S("S2-R22"), "The value shows -1, or the field refuses the minus sign."),
   R(S("S2-N7", "\"Enter a value of 0 or more\" (+ $, Markup %)"), "No question opens; the message reads \"Enter a value of 0 or more\" (or the minus sign was refused).")],
  pics=["2.51"])

C("S2-78", K, "Cancel in the Set Rule question changes nothing",
  [ADMIN, tier("A"), matrix("A", ", tier A on Same as previous tier"), DESK],
  [TIERS, open_tier("A"), "Check matrix A.", "Type 35 in the bar's value.", "Click Set Rule.", "Click Cancel in the dialog."],
  [R(S("S2-R14"), "Tier A is listed."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R22"), "The count is 1."), R(S("S2-R22"), "The value reads 35."), R(S("S2-R23"), "The question opens."),
   R(S("S2-N7", "Cancel in the confirmation, or clearing the checks, changes nothing."), "The dialog closes.", "Matrix A still reads Uses previous tier for tier A.")],
  pics=["2.53"])
