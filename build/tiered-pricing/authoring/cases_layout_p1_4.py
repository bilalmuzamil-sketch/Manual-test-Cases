"""Checklist lines 9 and 10 (skill 21 §6d, QA lead 13 Nov 2026; lesson L-21) for PRD pages 1-4.
Line 9 — stress names wherever a typed name shows: a long name with spaces, a long name with no spaces and a name with & " ' < >. Tier names
stop at 50 characters (S2-R3). Results say the name stays inside its own row, cell, title or dialog, never covers the next element, every
control stays visible and the page does not scroll sideways, and a special-character name shows exactly as saved; whether it wraps or is
cut with "…" is said only where a source says (the grid header: PRD S4-R27). The design draws no long names; the drive's harness found
that a long name with no spaces pushed the tier page's three-dot button off the right edge and cut matrix names with no "…" (proof §6c,
TP01/MC10): these cases will show whether the build does the same.
Line 10 — before-and-after checks with a screenshot: the bulk bar and its error push the matrix list down but keep its columns in place
(design 2.32 vs 2.47/2.51: every heading +68 / +102 px down, 0 px sideways); a grid's view returns exactly after Edit and Cancel."""
from tp_lib import C, R, S, QD, QL
from common import *

K = "DESIGN"
T50SP = "a long name with spaces of exactly 50 characters (for example Northern Alberta Heavy Equipment Fleet Pricing Tier)"
T50NO = "a long name with no spaces of exactly 50 characters (for example NorthernAlbertaHeavyEquipmentFleetPricingTierPlanX)"
TSPEC = "a name with the characters & \" ' < > in it (for example A&B \"Fleet\" O'Neil <Tier>)"
KEEP = ("The name stays inside its own row: it never covers the next row or column.")
VIS = "Every column and every button of the row stays visible, and the page does not scroll sideways."


def stress_tiers():
    return [ADMIN, f"Have a new tier for this test, tier A, with {T50SP}.", f"Have a new tier for this test, tier B, with {T50NO}.",
            f"Have a new tier for this test, tier C, with {TSPEC}.", W1440]


C("D-70", K, "Design: long and special tier names on the Tiers list",
  stress_tiers(),
  [TIERS, "Open tier B's three-dot menu."],
  [R(S("S2-R1", "The Tiers list shows each tier's number, name, customers and status."), "Tier A's, tier B's and tier C's names can each be read in full or in part on their own row.", KEEP, VIS)
   + R(S("S2-R3", "A tier name is required, trimmed, up to 50 characters"), "Tier C's name shows character for character as typed, & \" ' < > included.")
   + R(QL("2.2", "S2-R1"), "The Customers, Matrices and Status columns keep their places, as in picture 2.2."),
   R(QL("2.7", "S2-R26"), "The menu opens beside tier B's row, fully visible, with Audit Log, Archive and Delete.")],
  pics=["2.2", "2.7"], flags=["stress"])

C("D-71", K, "Design: a long tier name as a tier page title",
  stress_tiers(),
  [TIERS, "Click tier A's row.", "Click the Tiers tab.", "Click tier B's row.", "Click the Tiers tab.", "Click tier C's row."],
  [R(S("S2-R14"), "The Tiers list shows."),
   R(S("S2-R28", "The tier's name is the page title"), "Tier A's page title shows its name, wrapped or on one line, without covering the tabs or the three-dot button."),
   R(S("S2-R14"), "The Tiers list shows."),
   R(S("S2-R28", "The tier's name is the page title"), "Tier B's page title shows its name without covering the tabs.",
     "The three-dot button stays visible at the top right and the page does not scroll sideways.")
   + R(QL("2.32", "S2-R28"), "The Pricing and Customers tabs and the matrix list keep their places, as in picture 2.32."),
   R(S("S2-R14"), "The Tiers list shows."),
   R(S("S2-R3"), "Tier C's title shows character for character as typed, & \" ' < > included.")],
  pics=["2.32"], flags=["stress"])

C("D-72", K, "Design: long tier names in grid headers are cut with an ellipsis",
  stress_tiers() + [matrix("A")],
  [MATRICES, "Click matrix A's name.", "Point at tier B's column header.", "Point at tier C's column header."],
  [R(S("S4-R27"), "The Matrices list shows."),
   R(S("S4-R27", "a longer tier name is cut short with \"…\" and shows in full on hover"), "Tier A's and tier B's headers show the start of their names cut short with \"…\".",
     "Every column keeps its width and the grid does not grow wider.")
   + R(QL("3.2", "S4-R27"), "The columns keep the layout of picture 3.2."),
   R(S("S4-R27", "shows in full on hover"), "Tier B's full name shows on hover."),
   R(S("S2-R3"), "Tier C's full name shows on hover character for character as typed, & \" ' < > included.")],
  pics=["3.2", "4.6"], flags=["stress"])

C("D-73", K, "Design: long tier names in the archive and Set Rule dialogs",
  stress_tiers() + [matrix("A")],
  [TIERS, "Open tier A's three-dot menu.", "Click Archive.", "Click Cancel.", "Open tier B's three-dot menu.", "Click Archive.", "Click Cancel.", "Click tier C's row.", "Check matrix A.", "Type 10 in the bar's value.", "Click Set Rule."],
  [R(S("S2-R14"), "The Tiers list shows."), R(S("S2-R26"), "The menu opens."),
   R(S("S2-R30", "Archive and Delete ask first. \"Archive <tier>?\""), "The dialog title shows \"Archive\" with tier A's name and \"?\" inside the dialog, wrapped if needed.", "Cancel and Archive stay visible."),
   R(S("S2-R30"), "The dialog closes."), R(S("S2-R26"), "The menu opens."),
   R(S("S2-R30", "Archive and Delete ask first. \"Archive <tier>?\""), "The dialog title shows \"Archive\" with tier B's name and \"?\", inside the dialog.",
     "The text and the Cancel and Archive buttons stay visible inside the dialog; nothing runs past its edges."),
   R(S("S2-R30"), "The dialog closes."), R(S("S2-R28"), "Tier C's page opens."),
   R(S("S2-R22", "\"Set <tier> to\""), "The bar reads \"Set\" tier C's name character for character as typed and \"to\", with the picker, value and Set Rule still visible."),
   R(S("S2-R22"), "The value reads 10."),
   R(S("S2-R23", "\"Set <tier>'s Rule?\""), "The dialog title and sentence show tier C's name character for character as typed, & \" ' < > included, with Cancel and Set Rule visible.")],
  pics=["2.22", "2.47", "2.53"], flags=["stress"])

M_SP = "a long name with spaces of at least 60 characters (for example Northern Alberta Heavy Equipment Fleet Services Preferred Pricing)"
M_NO = "a long name with no spaces of at least 60 characters (for example NorthernAlbertaHeavyEquipmentFleetServicesPreferredPricingPlan)"
C("D-74", K, "Design: long and special matrix names on a tier page and matrix page",
  [ADMIN, tier("A"), f"Have a new matrix for this test, matrix A, with {M_SP}.", f"Have a new matrix for this test, matrix B, with {M_NO}.",
   f"Have a new matrix for this test, matrix C, with {TSPEC}.", W1440],
  [TIERS, "Click tier A's row.", MATRICES, "Click matrix B's name."],
  [R(S("S2-R14"), "The Tiers list shows."),
   R(S("S2-R20", "Pricing lists every matrix with its categories and two columns"), "Matrix A's, matrix B's and matrix C's names stay inside the Matrix column of their own rows.",
     "The Work Order Matrix and Part Sale Matrix values stay visible beside them and the page does not scroll sideways.", "Matrix C's name shows character for character as typed, & \" ' < > included."),
   R(S("S3-R18"), "The Matrices list shows."),
   R(S("S3-R18", "Its title is the matrix name"), "Matrix B's title shows its name without covering the Categories line or the three-dot button.", "The page does not scroll sideways.")
   + R(QL("3.2", "S3-R18"), "The Categories line, tabs and grid keep the places of picture 3.2.")],
  pics=["2.32", "3.2"], flags=["stress"])

C("D-75", K, "Design: long category names in the picker, line and Change Prices",
  [ADMIN, f"Have a new category for this test, category A, with {M_SP}.", f"Have a new category for this test, category B, with {M_NO}.",
   f"Have a new category for this test, category C, with {TSPEC}.", matrix("A", ", pricing a new category made for this test, category A, category B and category C"), W1440],
  [MATRICES, "Click matrix A's name.", EDIT, "Open the Categories picker.", "Press Esc.", "Type a new value in Default's first range.", SAVE],
  [R(S("S3-R13"), "The Matrices list shows."),
   R(S("S3-R18", "Under the title, a Categories line shows the categories it prices"), "The Categories line stays on its line under the title without covering the tabs.", "Category C shows character for character as typed, & \" ' < > included."),
   R(S("S4-R4"), "The grid is in edit."),
   R(S("S3-R13", "a multi-select category picker with search and Select all"), "Each category name stays inside its own row of the list; none runs past the list's edge or over the next row.")
   + R(QL("3.23", "S3-R13"), "Checkboxes and \"Now:\" labels stay visible, as in picture 3.23."),
   R(S("S3-R13"), "The list closes."), R(S("S4-R4"), "The bar counts 1 change."),
   R(S("S4-R16", "every category on its own line"), "The Change Prices dialog lists each category on its own line inside the dialog, with Cancel and Change All visible.")],
  pics=["3.23", "3.13"], flags=["stress"])

# ---- line 10: before and after -------------------------------------------------------------------------------------------------
C("D-76", K, "Design: the bulk bar pushes the matrix list down but not sideways",
  [ADMIN, tier("A"), matrix("A"), W1440],
  [TIERS, "Click tier A's row.", "Take a screenshot of the matrix list.", "Check matrix A.", "Click Set Rule with the value empty."],
  [R(S("S2-R14"), "The Tiers list shows."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R20"), "The screenshot is saved."),
   R(S("S2-R22", "the design system's bulk action bar shows at the top of the matrix list"), "The bar appears at the top of the list and the list moves down below it.")
   + R(QL("2.47", "S2-R22"), "Compared with the screenshot, every column heading keeps its same left-right place and order; only the rows moved down, as pictures 2.32 and 2.47 show."),
   R(S("S2-N7"), "The error line appears under the bar.")
   + R(QL("2.51", "S2-N7"), "The headings move further down but keep their same left-right place, as in picture 2.51.")],
  pics=["2.32", "2.47", "2.51"], flags=["movement"])

C("D-77", K, "Design: clearing the bulk bar puts the list back in place",
  [ADMIN, tier("A"), matrix("A"), W1440],
  [TIERS, "Click tier A's row.", "Take a screenshot of the matrix list.", "Check matrix A.", "Click the bar's clear (X) button."],
  [R(S("S2-R14"), "The Tiers list shows."), R(S("S2-R28"), "Tier A's page opens."), R(S("S2-R20"), "The screenshot is saved."), R(S("S2-R22"), "The bar shows."),
   R(S("S2-R22", "a clear button that unchecks every matrix"), "The bar is gone.", "The list is back in the same place as in the screenshot: headings and rows match it.")],
  pics=["2.32", "2.47"], flags=["movement"])

C("D-78", K, "Design: Edit then Cancel returns the grid to the same view",
  [ADMIN, tier("A", ", so the grid has a tier column"), matrix("A", ", three ranges"), W1440],
  [MATRICES, "Click matrix A's name.", "Take a screenshot of the grid.", EDIT, "Click Cancel."],
  [R(S("S3-R25"), "The Matrices list shows."), R(S("S3-R25"), "Matrix A's page opens in view."), R(S("S3-R25"), "The screenshot is saved."), R(S("S4-R4"), "The grid is in edit."),
   R(S("S3-R25", "Cancel discards every change and returns it to view"), "The grid is back in view and matches the screenshot: every column keeps its same place and width, every value the same.")],
  pics=["3.2", "4.6"], flags=["movement"])

C("D-79", K, "Design: archiving a tier keeps the Tiers list columns in place",
  [ADMIN, tier("A", " with no customers"), W1440],
  [TIERS, "Take a screenshot of the Tiers list.", "Open tier A's three-dot menu.", "Click Archive.", "Click Archive in the dialog."],
  [R(S("S2-R14"), "The Tiers list shows."), R(S("S2-R14"), "The screenshot is saved."), R(S("S2-R26"), "The menu opens."), R(S("S2-R30"), "The question opens."),
   R(S("S2-R14", "The Tiers list shows active tiers by number, then archived tiers A to Z by name."), "Tier A moves to the archived rows.")
   + R(QL("2.24", "S2-R14"), "Compared with the screenshot, the headings #, Tier, Customers, Matrices and Status keep their same places, as pictures 2.21 and 2.24 show.")],
  pics=["2.21", "2.24"], flags=["movement"])
