"""Design — how it looks, PRD pages 1-4 (design boards 1.1-4.27 and today's Pricing page), phase 1, 14 Nov 2026.
Design "Tiered Pricing Design" 1794631438-539a (identical files in 1794638838-cd70). Every case names the board picture(s) to compare with at
100% zoom; every attribute is an eye check (no pixel ruler, no devtools; Rule 126 point 8). Gray italic "Uses previous tier" is checked as
"gray, italic", never by letter shape (the package has no Inter italic font: the live canvas slants the upright font; our PNGs show true
italic). Wording comes from the PRD where it has the sentence and from the board where the PRD is silent (QA lead's precedence, 14 Nov
2026). Held "design version" cases (Rule 130) carry the design's own version of a screen the PRD words differently; each is held on its
PO question candidate (po_questions.py) and is not run while held."""
from tp_lib import C, R, B, S, QP, QD, QT, QL
from common import *

K = "DESIGN"
CMP = "compared with the design picture at 100% zoom"


def look(board, row, *texts):
    return R(QL(board, row), *texts)


# ---- page 1: release day -------------------------------------------------------------------------------------------------------
C("D-01", K, "Design: release-day Tiers list with one Default row",
  [ADMIN, STAGING, "Use a staging client on which nobody has set up tiers since the release (its Tiers list shows only Default).", W1440],
  ["Open Settings › Pricing."],
  [R(S("S1-R10", "the client has one tier, Default"), "The page opens on the Tiers tab, with the tabs Tiers, Matrices and Fixed Rules, each with its count.")
   + R(QD("1 active tier", "1.1", "S1-R10"), "Above the list it reads \"1 active tier\", with New Tier at the right.")
   + look("1.1", "S2-R1", "The columns read #, Tier, Customers, Matrices and Status, in that order, as in picture 1.1.",
          "The one row reads 1, Default, the customer count, All and a green Active badge, with a pencil and a three-dot button at the right.")],
  pics=["1.1", "today:2.1"])

C("D-02", K, "Design: release-day matrix page shows only the Default column",
  [ADMIN, STAGING, "Use a staging client on which nobody has set up tiers since the release.", W1440],
  [MATRICES, "Click a category matrix's name."],
  [R(S("S1-R9"), "The Matrices tab lists the matrices that existed before the release, the General Matrix first with its Default badge.")
   + look("1.2", "S1-R9", "Each row shows the matrix name, a status badge, its categories, a Work Order Matrix summary, Part Sale Matrix \"Same as work orders\" and Tiers \"All\", as in picture 1.2."),
   R(S("S1-R10", "No matrix has a tier column other than Default"), "The grid shows Cost Range and one Default column headed \"1 Default\".")
   + look("1.4", "S1-R9", "Under the grid the Price Part Simulator shows a Part Cost box and one Default price with its profit, as in picture 1.4.")],
  pics=["1.2", "1.3", "1.4", "today:2.1"])

# ---- page 2: the Tiers list ------------------------------------------------------------------------------------------------------
C("D-03", K, "Design: Tiers list columns, numbers, badges and row buttons",
  [ADMIN, tier("A", ", so the list shows a new active row"), tier("B", ", archived, so the list shows an archived row", False), W1440],
  [TIERS],
  [look("2.2", "S2-R1", "The label above the list reads the number of active tiers followed by \"active tiers\".",
        "The columns read #, Tier, Customers, Matrices and Status, in that order.",
        "Numbers are plain text centred under the # (no pill), and the archived row shows a dash instead of a number.",
        "Active rows show a green Active badge; the archived row shows a gray Archived badge.",
        "Each row ends with a pencil and a three-dot button; New Tier is a blue button at the right with a three-dot button left of it.",
        f"Fonts, spacing and alignment match picture 2.2 {CMP}.")
   + R(S("S2-R1", "The General Matrix and Uncategorized keep the Default badge they carry today; nothing else carries it."), "Default's row has no Default badge (its name says it).")],
  pics=["2.2"])

C("D-04", K, "Design: the # and Matrices info tooltips on the Tiers list",
  [ADMIN, W1440],
  [TIERS, "Point at the info icon beside the # header."],
  [look("2.3", "S2-R15", "An info icon shows beside # and beside Matrices in the header."),
   R(QD("The tier's place in the order. New tiers go last; archiving one moves later tiers up.", "2.3", "S2-R15"),
     "A dark gray tooltip just below the icon reads \"The tier's place in the order. New tiers go last; archiving one moves later tiers up.\"")
   + look("2.3", "S2-R15", f"The tooltip's position and colours match picture 2.3 {CMP}.")],
  pics=["2.3"])

C("D-05", K, "Design: the Tiers list menu and the Audit Log dialog",
  [ADMIN, W1440],
  [TIERS, "Click the three-dot button beside New Tier.", "Click Audit Log."],
  [look("2.4", "S19-R19", "The Tiers list shows."),
   look("2.4", "S19-R19", "A small menu opens just below the button, aligned to its right, with one row: Audit Log."),
   R(S("S19-R19", "titled \"Audit Log: <matrix>\", \"Audit Log: <tier>\" or \"Audit Log: <category>\" for one, and \"Audit Log: Matrices\", \"Audit Log: Tiers\" or \"Audit Log: Categories\" for a list"),
     "A dialog titled \"Audit Log: Tiers\" opens.")
   + look("2.6", "S19-R19", "Its columns read Event, User, Details, Date and Time, newest first, with Close at the bottom right and an X at the top right, as in picture 2.6.")],
  pics=["2.4", "2.5", "2.6"])

C("D-06", K, "Design: a tier row's menu, with Delete red or grayed",
  [ADMIN, tier("A", " that has priced nothing"), tier("B", " that open work orders keep (a customer on it has an open work order)"), W1440],
  [TIERS, "Open tier A's three-dot menu.", "Press Esc.", "Open tier B's three-dot menu.", "Point at Delete."],
  [look("2.7", "S2-R26", "The Tiers list shows."),
   look("2.7", "S2-R26", "The menu lists Audit Log, Archive and Delete, with Delete in red, as in picture 2.7."),
   look("2.7", "S2-R26", "The menu closes; the list shows."),
   look("2.8", "S2-R13", "The menu lists Audit Log, Archive and a grayed Delete, as in picture 2.8."),
   R(S("S2-R13", "Hovering or focusing it shows the reason in the standard tooltip"), "A dark gray tooltip shows below Delete with the reason, as in picture 2.8.")],
  pics=["2.7", "2.8"])

C("D-07", K, "Design: the last row's menu opens upward and stays in view",
  [ADMIN, tier("A", ", archived, the last row of the Tiers list", False), W1440],
  [TIERS, "Open tier A's three-dot menu."],
  [look("2.9", "S2-R26", "The Tiers list shows tier A last."),
   R(QD("Fleet Old is the last row, so its menu opens upward and stays in view.", "2.9", "S2-R26"), "The menu opens upward, above the button, fully in view.")
   + R(S("S2-R26", "An archived tier's row menu has Reactivate and Delete."), "It lists Audit Log, Reactivate and Delete (red), as in picture 2.9.")],
  pics=["2.9", "2.25"])

C("D-08", K, "Design: the New Tier page",
  [ADMIN, W1440],
  [TIERS, "Click New Tier."],
  [look("2.10", "S2-R17", "The Tiers list shows with New Tier at the top right."),
   R(QD("New tiers go last, as Tier 7.", "2.11", "S2-R17"), "The page shows the next tier number beside a large empty name field with the placeholder \"Tier name\" and the hint \"New tiers go last, as Tier\" and the number under it.")
   + look("2.11", "S2-R17", "Cancel and Create Tier (blue) sit at the top right.", "Tabs Pricing and Customers (0) sit under the name.",
          "The matrix list has columns Matrix, Work Order Matrix and Part Sale Matrix and no checkboxes, as in picture 2.11.")],
  pics=["2.10", "2.11"])

C("D-09", K, "Design: New Tier name errors show in red under the field",
  [ADMIN, tier("A", ", archived, named for example Fleet Old", False), W1440],
  [TIERS, "Click New Tier.", "Click Create Tier.", "Type tier A's name.", "Click Create Tier.", "Replace the name with Manual.", "Click Create Tier."],
  [look("2.11", "S2-R17", "The Tiers list shows."), look("2.11", "S2-R17", "The New Tier page opens."),
   R(QD("Tier name is a required field", "2.12", "S2-R3"), "The field is outlined in red and red text under it reads \"Tier name is a required field\", as in picture 2.12."),
   look("2.14", "S2-R3", "The name shows in the field."),
   R(QD("An archived tier is called Fleet Old. Rename it first.", "2.14", "S2-R3"), "Red text under the outlined field reads \"An archived tier is called\" tier A's name \". Rename it first.\", as in picture 2.14."),
   look("2.15", "S2-R3", "Manual shows in the field."),
   R(QD("Manual is used by the reports. Choose another name.", "2.15", "S2-R3"), "Red text reads \"Manual is used by the reports. Choose another name.\", as in picture 2.15.")],
  pics=["2.11", "2.12", "2.13", "2.14", "2.15"])

C("D-10", K, "Design: a created tier's page and its message",
  [ADMIN, W1440],
  [TIERS, "Click New Tier.", "Type a name no other tier uses.", "Click Create Tier."],
  [look("2.16", "S2-R17", "The Tiers list shows."), look("2.16", "S2-R17", "The New Tier page opens."), look("2.16", "S2-R17", "The name shows in the large field."),
   look("2.17", "S2-R29", "The page now shows the number and the name as the title, with a three-dot button at the top right.",
        "The matrix list now has a checkbox column and an info icon beside Work Order Matrix.",
        "A white message with a green check icon shows at the bottom right, as in picture 2.17.")],
  pics=["2.16", "2.17"])

C("D-11", K, "Design: the dialog when a tier with customers is archived",
  [CUST2 if False else ADMIN_CUST, tier("A"), customer("A", ", on tier A for work orders and Part Sales"), customer("B", ", on tier A for work orders only"), W1440],
  [TIERS, "Open tier A's three-dot menu.", "Click Archive."],
  [look("2.18", "S2-R7", "The Tiers list shows."), look("2.18", "S2-R7", "The menu lists Audit Log, Archive and Delete."),
   R(QD("Take them off or move them to another tier first, then archive it. Parts already on their work orders keep their prices.", "2.19", "S2-R7"),
     "A dialog titled tier A's name and \"Can't Be Archived Yet\" opens.", "A bold line reads \"2 customers are on\" and tier A's name.",
     "Then it reads \"Take them off or move them to another tier first, then archive it. Parts already on their work orders keep their prices.\"")
   + look("2.19", "S2-R7", "A table with columns Customer and \"On\" tier A's name \"for\" lists each customer with \"Work orders and Part Sales\" or \"Work orders only\".",
          "A blue Remove Customers link sits at the bottom left and a Close button at the bottom right, with an X at the top right, as in picture 2.19.")],
  pics=["2.18", "2.19", "2.20"])

C("D-12", K, "Design: the Archive question, with and without followers",
  [ADMIN, tier("A"), tier("B", ", the next tier after tier A, on Same as previous tier in a matrix where tier A has its own rule"), tier("C", " with no tier after it"), W1440],
  [TIERS, "Open tier A's three-dot menu.", "Click Archive.", "Click Cancel.", "Open tier C's three-dot menu.", "Click Archive."],
  [look("2.21", "S2-R30", "The Tiers list shows."), look("2.21", "S2-R30", "The menu lists Audit Log, Archive and Delete."),
   look("2.22", "S2-R30", "A dialog titled \"Archive\" tier A's name \"?\" shows the follower text, tier B as a bullet below it, then \"Parts already on work orders keep their prices.\"",
        "Cancel (white) and Archive (blue) sit at the bottom right, as in picture 2.22."),
   look("2.22", "S2-R30", "The dialog closes."), look("2.23", "S2-R30", "The menu opens."),
   look("2.23", "S2-R30", "The dialog shows only the line \"Parts already on work orders keep their prices.\" with Cancel and Archive, as in picture 2.23.")],
  pics=["2.21", "2.22", "2.23"])

C("D-13", K, "Design: archived and reactivated tiers and their messages",
  [ADMIN, tier("A", " with no customers"), W1440],
  [TIERS, "Open tier A's three-dot menu.", "Click Archive.", "Click Archive in the dialog.", "Open tier A's three-dot menu.", "Click Reactivate."],
  [look("2.21", "S2-R6", "The Tiers list shows."), look("2.21", "S2-R6", "The menu opens."), look("2.23", "S2-R30", "The question opens."),
   R(QD("It stays in reports. The tiers after it move up one number.", "2.24", "S2-R6"),
     "Tier A moves to the archived rows with a dash and a gray Archived badge.", "A message at the bottom right reads tier A's name \"archived\" with \"It stays in reports. The tiers after it move up one number.\", as in picture 2.24."),
   look("2.25", "S2-R26", "The menu lists Audit Log, Reactivate and Delete."),
   R(S("S2-R26", "Reactivate applies at once, with no confirmation, and shows \"<tier> is reactivated. It's now the last tier, Tier <n>.\""),
     "Tier A is back last with a number and a green Active badge.", "A message reads tier A's name \"is reactivated. It's now the last tier, Tier\" and its number, as in picture 2.27.")],
  pics=["2.21", "2.23", "2.24", "2.25", "2.26", "2.27"])

C("D-14", K, "Design: the Delete question and the deleted message",
  [ADMIN, tier("A", " with no customers that priced nothing"), W1440],
  [TIERS, "Open tier A's three-dot menu.", "Click Delete.", "Click Delete in the dialog."],
  [look("2.28", "S2-R30", "The Tiers list shows."), look("2.28", "S2-R30", "The menu lists Audit Log, Archive and a red Delete."),
   look("2.29", "S2-R30", "A dialog titled \"Delete\" tier A's name \"?\" reads \"Parts already on work orders keep their prices.\" with Cancel (white) and Delete (red).") ,
   R(QD("Tier 5 deleted", "2.30", "S2-R8"), "A message at the bottom right reads tier A's name \"deleted\", as in picture 2.30.", "Tier A is gone from the list.")],
  pics=["2.28", "2.29", "2.30"])

C("D-15", K, "Design: a tier's page, its tabs and its matrix list",
  [ADMIN, tier("A"), W1440],
  [TIERS, "Click tier A's row."],
  [look("2.31", "S2-R28", "The Tiers list shows with tier A's row."),
   look("2.32", "S2-R20", "The tier's number shows in small plain text before its name, the page title.",
        "A three-dot button sits at the top right; tabs Pricing and Customers with the customer count sit under the title.",
        "The matrix list has a checkbox column, Matrix, Work Order Matrix (with an info icon) and Part Sale Matrix.",
        "Each matrix name is bold with its categories in muted text under it; a list longer than two categories ends with a blue \"+1 more\" link.",
        "The General Matrix carries the blue Default badge; Part Sale values read \"Same as work orders\" in muted text, as in picture 2.32.")],
  pics=["2.31", "2.32"])

C("D-16", K, "Design: a tier's name is renamed in place, Esc cancels",
  [ADMIN, tier("A"), W1440],
  [TIERS, "Click tier A's row.", "Point at tier A's name.", "Click the pencil.", "Type a new name no other tier uses.", "Press Esc."],
  [look("2.32", "S2-R28", "The Tiers list shows."), look("2.32", "S2-R28", "Tier A's page opens."),
   R(QD("Point at the name. The rename pencil shows while the pointer is over the name (always on touch screens).", "2.33", "S2-R28"), "A pencil shows beside the name while the pointer is over it, as in picture 2.33."),
   R(QD("Press Enter or click away to save. Esc cancels.", "2.35", "S2-R28"), "The name becomes an outlined field with the hint \"Press Enter or click away to save. Esc cancels.\" under it, as in picture 2.35."),
   look("2.35", "S2-R28", "The field shows the new name."),
   R(QD("Esc cancels", "2.35", "S2-R28"), "The field closes and the title shows tier A's old name.")],
  pics=["2.32", "2.33", "2.34", "2.35"])

C("D-17", K, "Design: renaming to a taken name and the renamed message",
  [ADMIN, tier("A"), tier("B"), W1440],
  [TIERS, "Click tier A's row.", "Click tier A's name.", "Type tier B's name.", "Press Enter.", "Type a new name no other tier uses.", "Press Enter."],
  [look("2.36", "S2-R3", "The Tiers list shows."), look("2.36", "S2-R3", "Tier A's page opens."), look("2.35", "S2-R28", "The name field opens."), look("2.36", "S2-R3", "Tier B's name shows."),
   R(QD("A tier called Tier 3 already exists. Click away to keep Tier 2.", "2.36", "S2-R3"), "The field turns red with red text \"A tier called\" tier B's name \"already exists. Click away to keep\" tier A's name, as in picture 2.36."),
   look("2.36", "S2-R3", "The new name shows."),
   R(QD("Tier renamed to Fleet", "2.37", "S2-R5"), "The title shows the new name and a message at the bottom right reads \"Tier renamed to\" and the new name, as in picture 2.37.")],
  pics=["2.35", "2.36", "2.37"])

C("D-18", K, "Design: a tier page's menu and its Audit Log",
  [ADMIN, tier("A"), W1440],
  [TIERS, "Click tier A's row.", "Open the page's three-dot menu.", "Click Audit Log."],
  [look("2.38", "S19-R19", "The Tiers list shows."), look("2.38", "S19-R19", "Tier A's page opens."),
   look("2.38", "S2-R13", "A menu opens below the button with Audit Log, Archive and Delete, as in picture 2.38."),
   R(S("S19-R19", "titled \"Audit Log: <matrix>\", \"Audit Log: <tier>\" or \"Audit Log: <category>\" for one"), "A dialog titled \"Audit Log:\" and tier A's name opens.")
   + look("2.40", "S19-R19", "It shows Event, User, Details, Date and Time, with \"Tier Created\" and \"Name: — → \" and tier A's name in its first entry, and Close, as in picture 2.40.")],
  pics=["2.38", "2.39", "2.40"])

C("D-19", K, "Design: an archived tier's page shows Archived as plain text",
  [ADMIN, tier("A", ", archived", False), W1440],
  [TIERS, "Click tier A's row."],
  [look("2.43", "S2-R6", "The Tiers list shows tier A among the archived rows."),
   R(QD("Archived", "2.44", "S2-R6"), "The title shows tier A's name with no number and \"Archived\" in plain gray text beside it, as in picture 2.44.")
   + look("2.44", "S2-R6", "The tabs read Pricing and Customers (0); the matrix list keeps its checkboxes.")],
  pics=["2.43", "2.44"])

C("D-20", K, "Design: the bulk action bar on a tier's matrix list",
  [ADMIN, tier("A"), matrix("A"), matrix("B"), W1440],
  [TIERS, "Click tier A's row.", "Check matrix A.", "Click the select-all checkbox.", "Uncheck matrix B."],
  [look("2.47", "S2-R22", "The Tiers list shows."), look("2.47", "S2-R22", "Tier A's page opens."),
   look("2.47", "S2-R22", "A dark bar appears at the top of the list with a count chip \"1\" and \"matrix\", \"Set\" tier A's name \"to\", a picker on \"% Off\", a value box ending \"% off\", a blue Set Rule button and an X at the right.",
        "The checked row is tinted light blue, as in picture 2.47."),
   look("2.48", "S2-R22", "Every row is checked and tinted; the count reads the number of matrices and \"matrices\", as in picture 2.48."),
   look("2.49", "S2-R22", "The header checkbox shows a dash (partly checked), as in picture 2.49.")],
  pics=["2.47", "2.48", "2.49", "2.50"])

C("D-21", K, "Design: Set Rule errors show in red under the bar",
  [ADMIN, tier("A"), matrix("A"), W1440],
  [TIERS, "Click tier A's row.", "Check matrix A.", "Click Set Rule.", "Pick Margin % in the bar's picker.", "Type 120 in the bar's value.", "Click Set Rule."],
  [look("2.51", "S2-N7", "The Tiers list shows."), look("2.51", "S2-N7", "Tier A's page opens."), look("2.51", "S2-N7", "The bar shows."),
   R(QD("Enter a % from 0 to 99.99", "2.51", "S2-N7"), "Red text under the bar reads \"Enter a % from 0 to 99.99\" and the value box is outlined in red, as in picture 2.51."),
   look("2.52", "S2-N7", "Margin % is picked and the value box ends with %."), look("2.52", "S2-N7", "The value reads 120."),
   R(QD("Enter a margin from 0 to 99.99", "2.52", "S2-N7"), "Red text under the bar reads \"Enter a margin from 0 to 99.99\", as in picture 2.52.")],
  pics=["2.51", "2.52"])

C("D-22", K, "Design: the Set Rule question and its messages",
  [ADMIN, tier("A"), matrix("A"), matrix("B"), W1440],
  [TIERS, "Click tier A's row.", "Check matrix A.", "Check matrix B.", "Type 35 in the bar's value.", "Click Set Rule.", "Click Set Rule in the dialog.", "Click Undo."],
  [look("2.54", "S2-R23", "The Tiers list shows."), look("2.54", "S2-R23", "Tier A's page opens."), look("2.54", "S2-R22", "The bar shows a count of 1."), look("2.54", "S2-R22", "The count is 2."),
   look("2.54", "S2-R22", "The value reads 35."),
   look("2.54", "S2-R23", "A narrow dialog titled \"Set\" tier A's name \"'s Rule?\" shows its sentence with Cancel and a blue Set Rule, as in picture 2.54."),
   look("2.56", "S2-R27", "The checks clear.", "A message at the bottom right shows a green check, tier A's name \"set to 35% off\", \"2 matrices changed.\", a blue Undo link, an X and a green timer line along its bottom, as in picture 2.56."),
   R(QD("Tier 2’s rules are back.", "2.58", "S2-R27"), "A message reads \"Undone\" with tier A's name and \"'s rules are back.\", as in picture 2.58.")],
  pics=["2.54", "2.55", "2.56", "2.57", "2.58"])

C("D-23", K, "Design: setting a rule a tier already has shows a message only",
  [ADMIN, tier("A"), matrix("A", ", tier A already 35% markup in every range"), W1440],
  [TIERS, "Click tier A's row.", "Check matrix A.", "Pick Markup % in the bar's picker.", "Type 35 in the bar's value.", "Click Set Rule."],
  [look("2.59", "S2-R23", "The Tiers list shows."), look("2.59", "S2-R23", "Tier A's page opens."), look("2.59", "S2-R23", "The bar shows."), look("2.59", "S2-R23", "Markup % is picked."),
   look("2.59", "S2-R23", "The value reads 35."),
   R(QD("Tier 2 already uses 35% markup in that matrix", "2.60", "S2-R23"), "A message at the bottom right reads tier A's name \"already uses 35% markup in that matrix\", as in picture 2.60.")
   + look("2.60", "S2-R23", "The bar closes and no dialog opens.")],
  pics=["2.59", "2.60"])

# ---- page 3: a matrix ---------------------------------------------------------------------------------------------------------
C("D-24", K, "Design: a matrix page in view",
  [ADMIN, tier("A", ", so the grid has a tier column"), matrix("A", ", pricing a new category made for this test, three ranges"), W1440],
  [MATRICES, "Click matrix A's name."],
  [look("3.1", "S3-R18", "The Matrices list shows."),
   look("3.2", "S3-R18", "The title is matrix A's name with a three-dot button at the top right.",
        "Under it, \"Categories\" with an info icon and the category names.", "Tabs Work Order Matrix and Part Sale Matrix sit under the Categories line.",
        "The grid card has an Edit button with a pencil at its top right; headers show each tier's number in small text before its name.",
        "\"Uses previous tier\" cells are gray and italic.", "The last range reads its start followed by \" +\" in view.",
        "Under the grid, \"Price Part Simulator\" with an info icon, a Part Cost box with $ and 100, and each column's price in bold with its profit in muted text below, as in picture 3.2.")],
  pics=["3.1", "3.2"])

C("D-25", K, "Design: a matrix's name is renamed in place with a hint",
  [ADMIN, matrix("A"), W1440],
  [MATRICES, "Click matrix A's name.", "Point at the title.", "Click the pencil."],
  [look("3.1", "S3-R18", "The Matrices list shows."), look("3.2", "S3-R18", "Matrix A's page opens."),
   look("3.3", "S3-R18", "A pencil shows beside the title while the pointer is over it, as in picture 3.3."),
   R(QD("Press Enter or click away to save. Esc cancels.", "3.5", "S3-R18"), "The title becomes an outlined field with \"Press Enter or click away to save. Esc cancels.\" under it, as in picture 3.5.")],
  pics=["3.1", "3.2", "3.3", "3.4", "3.5"])

C("D-26", K, "Design: a matrix's menu and its Audit Log",
  [ADMIN, matrix("A"), W1440],
  [MATRICES, "Click matrix A's name.", "Open the page's three-dot menu.", "Click Audit Log."],
  [look("3.6", "S19-R19", "The Matrices list shows."), look("3.6", "S19-R19", "Matrix A's page opens."),
   look("3.6", "S3-R18", "A menu with one row, Audit Log, opens below the button, as in picture 3.6."),
   R(S("S19-R19", "titled \"Audit Log: <matrix>\""), "A dialog titled \"Audit Log:\" and matrix A's name opens.")
   + look("3.8", "S19-R19", "It lists \"Matrix Created\" with \"Name: — →\" and the name, newest first, with Close, as in picture 3.8.")],
  pics=["3.6", "3.7", "3.8"])

C("D-27", K, "Design: an Inactive matrix page and badge",
  [ADMIN, matrix("A", ", with no category"), W1440],
  [MATRICES, "Click matrix A's name."],
  [look("3.9", "S3-R28", "Matrix A's row shows a gray Inactive badge and a dash for Categories, as in picture 3.9."),
   R(QD("Inactive: No categories use this matrix", "3.10", "S3-R28"), "Beside the title, small gray text reads \"Inactive: No categories use this matrix\"; no badge shows on the page.")
   + look("3.10", "S3-R28", "The Categories line reads None, as in picture 3.10.")],
  pics=["3.9", "3.10"])

C("D-28", K, "Design: a matrix grid in edit",
  [ADMIN, tier("A", ", so the grid has a tier column"), matrix("A", ", three ranges"), W1440],
  [MATRICES, "Click matrix A's name.", EDIT, "Type a new value in Default's first range."],
  [look("4.5", "S4-R4", "The Matrices list shows."), look("4.5", "S4-R4", "Matrix A's page opens in view."),
   look("4.6", "S4-R4", "The Categories line becomes a picker with the label \"Categories (1)\" and a chevron.",
        "The edit bar at the top right of the grid reads \"No changes yet\" beside Cancel and a blue Save.",
        "Each header shows a rule picker under the name; range rows read \"$0.00 to\" with a $ end box, and the last row reads \"and up\".",
        "A blue Add Range link sits under the grid, as in picture 4.6."),
   look("3.11", "S4-R4", "The edited cell's column is tinted yellow and the bar reads \"1 change\", as in picture 3.11.")],
  pics=["4.5", "4.6", "3.11"])

C("D-29", K, "Design: the Change Prices and Save the General Matrix dialogs",
  [ADMIN, matrix("A", ", pricing two new categories made for this test"), "Note the General Matrix's Default value in its first range, to put it back.", W1440],
  [MATRICES, "Click matrix A's name.", EDIT, "Type a new value in Default's first range.", SAVE, "Click Cancel in the dialog.", "Open the General Matrix from the Matrices list.", EDIT,
   "Type a new value in Default's first range.", SAVE, "Click Cancel in the dialog."],
  [look("3.13", "S4-R16", "The Matrices list shows."), look("3.13", "S4-R16", "Matrix A's page opens."), look("3.13", "S4-R4", "The grid is in edit."), look("3.13", "S4-R4", "The bar reads 1 change."),
   look("3.13", "S4-R16", "A dialog titled \"Change Prices in 2 Categories?\" lists the categories as bullets with Cancel (white) and Change All (blue), as in picture 3.13."),
   look("3.13", "S4-R16", "The dialog closes; the grid stays in edit."), look("3.14", "S4-R18", "The General Matrix page opens."), look("3.14", "S4-R4", "The grid is in edit."),
   look("3.14", "S4-R4", "The bar reads 1 change."),
   R(S("S4-R18", "\"Save the General Matrix?\""), "A dialog titled \"Save the General Matrix?\" opens.")
   + look("3.14", "S4-R18", "It lists the first category names and ends with a blue \"+\" count for the rest, with Cancel and Save, as in picture 3.14."),
   look("3.14", "S4-R18", "The dialog closes and the grid is still in edit.", "Nothing is saved (leave with Cancel and Discard Changes).")],
  pics=["3.13", "3.14"])

C("D-30", K, "Design: the Discard These Changes? dialog",
  [ADMIN, matrix("A"), W1440],
  [MATRICES, "Click matrix A's name.", EDIT, "Type a new value in Default's first range.", "Click Cancel in the edit bar."],
  [look("4.23", "S19-R3", "The Matrices list shows."), look("4.23", "S19-R3", "Matrix A's page opens."), look("4.23", "S4-R4", "The grid is in edit."), look("4.23", "S4-R4", "The bar reads 1 change."),
   R(S("S19-R9", "Every column title, modal header, page title, tab and button uses Title Case."), "A narrow dialog titled \"Discard These Changes?\" opens.")
   + R(QD("Your changes haven't been saved.", "4.23", "S19-R3"), "Its text reads \"Your changes haven't been saved.\"")
   + look("4.23", "S19-R3", "Keep Editing is a white button and Discard Changes a red one, as in picture 4.23.")],
  pics=["3.16", "4.23"])

C("D-31", K, "Design: the Part Sale tab when separate pricing is off",
  [ADMIN, matrix("A", ", with Separate Part Sale pricing off"), W1440],
  [MATRICES, "Click matrix A's name.", "Click the Part Sale Matrix tab."],
  [look("3.17", "S3-R21", "The Matrices list shows."), look("3.17", "S3-R21", "Matrix A's page opens."),
   R(QD("Turn on Separate Part Sale pricing to give Part Sales their own prices.", "3.17", "S3-R21"),
     "The tab shows a switch, off, with \"Separate Part Sale pricing\", \"Off\" and an info icon.",
     "Below, an empty state with a small stacked-layers icon reads \"Part Sales use the work order prices\" and \"Turn on Separate Part Sale pricing to give Part Sales their own prices.\", as in picture 3.17.")],
  pics=["3.17"])

C("D-32", K, "Design: turning Part Sale pricing on and off",
  [ADMIN, matrix("A", ", with Separate Part Sale pricing off"), W1440],
  [MATRICES, "Click matrix A's name.", "Click the Part Sale Matrix tab.", "Switch Separate Part Sale pricing on.", "Switch Separate Part Sale pricing off."],
  [look("3.18", "S3-R31", "The Matrices list shows."), look("3.18", "S3-R31", "Matrix A's page opens."), look("3.17", "S3-R21", "The switch is off."),
   R(QD("Separate Part Sale pricing on", "3.18", "S3-R31"), "The switch turns blue and reads On; a grid with Edit and the simulator appear.",
     "A message at the bottom right reads \"Separate Part Sale pricing on\" with \"It starts as a copy of the work order prices. Click Edit to change them.\", as in picture 3.18."),
   R(S("S3-R27", "\"Turn Off Part Sale Pricing?\""), "A dialog titled \"Turn Off Part Sale Pricing?\" opens.")
   + look("3.20", "S3-R27", "Cancel is white and Turn Off red, as in picture 3.20.")],
  pics=["3.17", "3.18", "3.19", "3.20"])

C("D-33", K, "Design: the New Matrix page and its category picker",
  [ADMIN, W1440],
  [MATRICES, "Click New Matrix.", "Click the Categories picker."],
  [look("3.21", "S3-R30", "The Matrices list shows with a blue New Matrix button."),
   R(QD("Inactive: No categories use this matrix", "3.22", "S3-R30"), "A large name field with the placeholder \"Matrix name\" shows, with \"Inactive: No categories use this matrix\" in gray beside it.")
   + look("3.22", "S3-R30", "Cancel and a blue Create Matrix sit at the top right.", "A picker labelled \"Categories (0)\" reads \"Choose categories\".",
          "The grid has one range \"$0.00 and up\"; Default's picker reads Markup % and each tier's Previous tier; the empty cells are outlined in red, as in picture 3.22."),
   R(QD("0 selected", "3.23", "S3-R13"), "A list opens with \"Search categories\", \"0 selected\" and a checkbox per category.")
   + R(QD("Now: Stop 40", "3.23", "S3-R13"), "Categories on another matrix show \"Now:\" and the matrix name in gray at the right, as in picture 3.23.")],
  pics=["3.21", "3.22", "3.23"])

C("D-34", K, "Design: New Matrix errors in a Save is blocked banner",
  [ADMIN, W1440],
  [MATRICES, "Click New Matrix.", "Click Create Matrix."],
  [look("3.24", "S3-R6", "The Matrices list shows."), look("3.24", "S3-R30", "The New Matrix page opens."),
   R(QD("Matrix name is a required field", "3.24", "S3-R6"), "The name field turns red with \"Matrix name is a required field\" under it.")
   + look("3.24", "S3-R6", "A pink banner with a red X icon under the simulator reads \"Save is blocked\" and lists the problems, as in picture 3.24.")],
  pics=["3.24"])

C("D-35", K, "Design: a matrix row's menu and the Delete matrix question",
  [ADMIN, matrix("A", ", pricing a new category made for this test, category A"), W1440],
  [MATRICES, "Open matrix A's three-dot menu.", "Click Delete."],
  [look("3.28", "S3-R9", "The Matrices list shows."),
   look("3.26", "S3-R8", "A menu opens with Duplicate and a red Delete, as in picture 3.26."),
   R(QD("Once it’s deleted, it uses the General Matrix.", "3.29", "S3-R9"), "A dialog titled \"Delete\" matrix A's name \"?\" reads matrix A's name \"prices\" category A's name \". Once it's deleted, it uses the General Matrix.\"")
   + look("3.29", "S3-R9", "It ends with \"Parts already on work orders keep their prices.\" and Cancel (white) and Delete (red), as in picture 3.29.")],
  pics=["3.26", "3.28", "3.29"])

# ---- page 4: the grid ------------------------------------------------------------------------------------------------------------
C("D-36", K, "Design: the Cost Range info tooltip",
  [ADMIN, matrix("A"), W1440],
  [MATRICES, "Click matrix A's name.", "Point at the info icon beside Cost Range."],
  [look("4.1", "S4-R1", "The Matrices list shows."), look("4.1", "S4-R1", "Matrix A's page opens."),
   R(QT("A part's cost picks its row. The first range starts at $0.00; the last has no upper limit.", "TPX-12"),
     "A dark gray tooltip below the icon reads \"A part's cost picks its row. The first range starts at $0.00; the last has no upper limit.\"")
   + R(S("S19-R15", "Explanations (cost ranges, how a price is found, the Part Sale switch) sit in short info-icon tooltips beside the item they explain"), "No help text or banner is printed on the page instead.")
   + look("4.1", "S4-R1", "Its position and colours match picture 4.1.")],
  pics=["4.1"])

C("D-37", K, "Design: a Uses previous tier hover tooltip",
  [ADMIN, tier("A", ", the first tier after Default, on Same as previous tier in matrix A"), matrix("A"), W1440],
  [MATRICES, "Click matrix A's name.", "Point at a cell in tier A's column."],
  [look("4.2", "S4-R3", "The Matrices list shows."), look("4.2", "S4-R3", "Matrix A's page opens; tier A's cells read Uses previous tier in gray italics."),
   R(QD("Uses previous tier, 1 · Default.", "4.2", "S4-R3"), "The cell is outlined and a dark gray tooltip just below it reads \"Uses previous tier, 1 · Default.\", as in picture 4.2.")],
  pics=["4.2"])

C("D-38", K, "Design: a Mixed rules column in view and in edit",
  [ADMIN, matrix("A", ", two ranges, Default Cost + $45 then 15% margin"), W1440],
  [MATRICES, "Click matrix A's name.", EDIT],
  [look("4.3", "S4-R28", "The Matrices list shows."),
   look("4.4", "S4-R28", "Default's cells read \"Cost + $45\" and \"15% margin\", as in picture 4.4."),
   look("4.15", "S4-R28", "Default's header picker reads \"Mixed rules\"; the first cell shows $ before 45 and the second shows \"% margin\" with a small chevron, as in picture 4.15.")],
  pics=["4.3", "4.4", "4.14", "4.15"])

C("D-39", K, "Design: the tier and Default rule pickers",
  [ADMIN, tier("A"), matrix("A"), W1440],
  [MATRICES, "Click matrix A's name.", EDIT, "Open tier A's header rule picker.", "Press Esc.", "Open Default's header rule picker."],
  [look("4.9", "S4-R5", "The Matrices list shows."), look("4.9", "S4-R5", "Matrix A's page opens."), look("4.9", "S4-R5", "The grid is in edit."),
   look("4.9", "S4-R5", "The list shows Previous tier, then the gray group heading \"Off default price\" with % Off and $ Off, then \"From cost\" with + $, Markup % and Margin %, as in picture 4.9."),
   look("4.9", "S4-R5", "The list closes."),
   look("4.10", "S4-N1", "The list shows + $, Markup % and Margin % only, as in picture 4.10.")],
  pics=["4.9", "4.10"])

C("D-40", K, "Design: auto-filled values are gray",
  [ADMIN, matrix("A", ", three ranges, Default empty in every range (new for this test)"), W1440],
  [MATRICES, "Click matrix A's name.", EDIT, "Type 40 in Default's first range."],
  [look("4.7", "S4-R26", "The Matrices list shows."), look("4.7", "S4-R26", "Matrix A's page opens."), look("4.7", "S4-R26", "The grid is in edit."),
   look("4.7", "S4-R26", "The typed 40 is in normal dark text; the ranges below show 40 in lighter gray text, as in picture 4.7.")],
  pics=["4.7", "4.8"])

C("D-41", K, "Design: Previous tier values show muted in edit",
  [ADMIN, tier("A", ", the first tier after Default"), matrix("A", ", tier A with its own rule"), W1440],
  [MATRICES, "Click matrix A's name.", EDIT, "Pick Previous tier in tier A's header picker."],
  [look("4.12", "S4-R10", "The Matrices list shows."), look("4.12", "S4-R10", "Matrix A's page opens."), look("4.12", "S4-R10", "The grid is in edit."),
   look("4.12", "S4-R10", "Tier A's cells show Default's values in muted text and its header picker reads Previous tier, as in picture 4.12.")],
  pics=["4.12", "4.16", "4.17"])

C("D-42", K, "Design: a From cost cell's symbol picker has a chevron",
  [ADMIN, matrix("A", ", Default on Markup %"), W1440],
  [MATRICES, "Click matrix A's name.", EDIT],
  [look("4.13", "S4-R28", "The Matrices list shows."), look("4.13", "S4-R28", "Matrix A's page opens."),
   look("4.13", "S4-R28", "Each of Default's cells ends with \"%\" and a small chevron at the far right of the cell, as in picture 4.13.")],
  pics=["4.13"])

C("D-43", K, "Design: changing a range end and removing a range",
  [ADMIN, matrix("A", ", three ranges"), W1440],
  [MATRICES, "Click matrix A's name.", EDIT, "Type 150 as the first range's end.", "Click the second range's trash icon."],
  [look("4.19", "S3-R16", "The Matrices list shows."), look("4.19", "S3-R16", "Matrix A's page opens."), look("4.19", "S3-R16", "The grid is in edit."),
   look("4.19", "S3-R16", "The first range's row is tinted yellow and the next range reads \"$150.01\", as in picture 4.19."),
   look("4.21", "S3-R32", "The first range's end shows the removed range's end, as in picture 4.21.", "The second range is gone.")],
  pics=["4.19", "4.21"])

C("D-44", K, "Design: edited cells are highlighted and counted",
  [ADMIN, tier("A"), matrix("A"), W1440],
  [MATRICES, "Click matrix A's name.", EDIT, "Type a new value in Default's first range.", "Type a new value in tier A's first range."],
  [look("4.22", "S4-R4", "The Matrices list shows."), look("4.22", "S4-R4", "Matrix A's page opens."), look("4.22", "S4-R4", "The grid is in edit."), look("4.22", "S4-R4", "The bar reads 1 change."),
   look("4.22", "S4-R4", "Both edited cells are outlined and tinted, and the bar reads \"2 changes\", as in picture 4.22.")],
  pics=["4.22"])

C("D-45", K, "Design: Change Prices with tiers that price from Default",
  [ADMIN, matrix("A", ", pricing three new categories made for this test"), tier("A", ", on % Off in matrix A"), W1440],
  [MATRICES, "Click matrix A's name.", EDIT, "Type a new value in Default's first range.", SAVE],
  [look("4.24", "S4-R30", "The Matrices list shows."), look("4.24", "S4-R30", "Matrix A's page opens."), look("4.24", "S4-R4", "The grid is in edit."), look("4.24", "S4-R4", "The bar reads 1 change."),
   look("4.24", "S4-R30", "One dialog lists the three categories as bullets, then the Default sentence and the tiers as bullets, with Cancel and a blue Change All, as in picture 4.24.")],
  pics=["4.24"])

C("D-46", K, "Design: the archived grid view",
  [ADMIN, tier("A", ", archived", True), matrix("A"), W1440],
  [TIERS, "Click tier A's row.", "Click Edit on matrix A's row.", "Point at a Default cell."],
  [look("4.25", "S4-R19", "The Tiers list shows."), look("4.25", "S4-R19", "Tier A's page opens."),
   look("4.26", "S4-R19", "A light blue notice with an info icon sits at the top of the page above the title.",
        "The grid shows Cost Range, \"1 Default\" and tier A's name with no number; only tier A's column has a picker and boxes, as in picture 4.26."),
   R(QD("Default prices live parts, so it can’t be changed in the archived view.", "4.27", "S4-R32"), "The Default cell is outlined and a dark gray tooltip below it reads \"Default prices live parts, so it can't be changed in the archived view.\", as in picture 4.27.")],
  pics=["4.25", "4.26", "4.27"])
