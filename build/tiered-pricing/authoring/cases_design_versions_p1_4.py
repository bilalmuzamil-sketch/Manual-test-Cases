"""Held "design version" cases for PRD pages 1-4 (Rule 130 point 5, QA lead 19 Oct 2026: "Yes and permanent"). Each checks the design's own
version of something the PRD words or shapes differently, is held on its PO question candidate (po_questions.py Q1-Q10) and is not run
while held. The day the PO rules: if the design wins, release the case (marker) and rewrite the PRD-following case; if the PRD wins, delete
this case with the QA lead's go-ahead. Register rows: DESIGN-DIVERGENCE-REGISTER.json (TPD-..)."""
from tp_lib import C, R, S, QD, QL
from common import *

K = "DESIGN"
DV = ["design-version"]

C("D-50", K, "Design: breadcrumbs start at Pricing, as the design draws them",
  [ADMIN, tier("A"), matrix("A"), W1440],
  [TIERS, "Click tier A's row.", MATRICES, "Click matrix A's name."],
  [R(QL("2.32", "S2-R28"), "The Tiers list shows."),
   R(QD("Pricing", "2.32", "S2-R28"), "The breadcrumb reads Pricing › Tiers › and tier A's name, as in picture 2.32."),
   R(QL("3.2", "S3-R26"), "The Matrices list shows."),
   R(QD("Pricing", "3.2", "S3-R26"), "The breadcrumb reads Pricing › Matrices › and matrix A's name, as in picture 3.2.")],
  pics=["2.11", "2.32", "2.46", "3.2", "4.26"], held_on="Q1", flags=DV)

C("D-51", K, "Design: the Delete question adds This can't be undone",
  [ADMIN, tier("A", " with no customers that priced nothing"), W1440],
  [TIERS, "Open tier A's three-dot menu.", "Click Delete."],
  [R(QL("2.28", "S2-R30"), "The Tiers list shows."), R(QL("2.28", "S2-R30"), "The menu lists Audit Log, Archive and Delete."),
   R(QD("This can’t be undone.", "2.29", "S2-R30"), "The dialog reads \"This can't be undone.\" above \"Parts already on work orders keep their prices.\", as in picture 2.29.")],
  pics=["2.28", "2.29"], held_on="Q2", flags=DV)

C("D-52", K, "Design: the Set Rule question says in all n matrices",
  [ADMIN, tier("A"), W1440],
  [TIERS, "Click tier A's row.", "Click the select-all checkbox.", "Type 35 in the bar's value.", "Click Set Rule."],
  [R(QL("2.53", "S2-R23"), "The Tiers list shows."), R(QL("2.53", "S2-R23"), "Tier A's page opens."), R(QL("2.53", "S2-R22"), "Every matrix is checked."), R(QL("2.53", "S2-R22"), "The value reads 35."),
   R(QD("Tier 2 becomes 35% off in all 7 matrices (2 inactive), replacing what it had.", "2.53", "S2-R23"),
     "The question reads tier A's name \"becomes 35% off in all\", the number of matrices, \"matrices\" and the inactive count in brackets, as in picture 2.53.")],
  pics=["2.53"], held_on="Q3", flags=DV)

C("D-53", K, "Design: a tier's Pricing tab says Same as previous tier",
  [ADMIN, tier("A"), matrix("A", ", tier A on Same as previous tier"), W1440],
  [TIERS, "Click tier A's row."],
  [R(QL("2.32", "S2-R20"), "The Tiers list shows."), R(QD("Same as previous tier", "2.32", "S2-R20"), "Matrix A's Work Order Matrix value reads \"Same as previous tier\", as in pictures 2.17 and 2.32.")],
  pics=["2.11", "2.17", "2.32", "2.44"], held_on="Q4", flags=DV)

C("D-54", K, "Design: Default's page shows one column with rule counts",
  [ADMIN, matrix("A", ", Default Markup % with three different values"), W1440],
  [TIERS, "Click Default's row."],
  [R(QL("2.41", "S2-R20"), "The Tiers list shows."), R(QD("3 rules · markup", "2.42", "S2-R20"), "The list has one value column, Work Order Matrix, and no Part Sale Matrix column.",
     "Matrix A's value reads \"3 rules · markup\", as in picture 2.42.")],
  pics=["2.41", "2.42"], held_on="Q5", flags=DV)

C("D-55", K, "Design: Duplicate opens an unsaved copy to name and create",
  [ADMIN, matrix("A"), "Note how many matrices the Matrices tab label shows (for example 7).", W1440],
  [MATRICES, "Open matrix A's three-dot menu.", "Click Duplicate.", "Click Cancel."],
  [R(QL("3.26", "S3-R8"), "The Matrices list shows."), R(QL("3.26", "S3-R8"), "The menu lists Duplicate and Delete."),
   R(QD("Stop 40 (copy)", "3.27", "S3-R8"), "A page opens in edit with the name field holding matrix A's name and \" (copy)\", Cancel and Create Matrix at the top right, as in picture 3.27."),
   R(QL("3.27", "S3-R8"), "The Matrices list shows again with 7 matrices: no copy was made.")],
  pics=["3.26", "3.27"], held_on="Q7", flags=DV)

C("D-56", K, "Design: picking % Off fills every range with 0",
  [ADMIN, tier("A"), matrix("A", ", three ranges, tier A on Markup %"), W1440],
  [MATRICES, "Click matrix A's name.", EDIT, "Pick % Off in tier A's header picker."],
  [R(QL("4.11", "S4-R7"), "The Matrices list shows."), R(QL("4.11", "S4-R7"), "Matrix A's page opens."), R(QL("4.11", "S4-R7"), "The grid is in edit."),
   R(QD("% Off starts at 0% in every range.", "4.11", "S4-R7"), "Tier A's three ranges each show 0 with \"% off\", as in picture 4.11.")],
  pics=["4.11"], held_on="Q13", flags=DV)

C("D-57", K, "Design: one rule type change counts as three changes",
  [ADMIN, tier("A"), matrix("A", ", three ranges, tier A on Markup %"), W1440],
  [MATRICES, "Click matrix A's name.", EDIT, "Pick % Off in tier A's header picker."],
  [R(QL("4.11", "S4-R4"), "The Matrices list shows."), R(QL("4.11", "S4-R4"), "Matrix A's page opens."), R(QD("No changes yet", "4.10", "S4-R4"), "The bar reads \"No changes yet\"."),
   R(QD("3 changes", "4.11", "S4-R4"), "The bar reads \"3 changes\", as in picture 4.11.")],
  pics=["4.10", "4.11"], held_on="Q14", flags=DV)

C("D-58", K, "Design: Add Range adds a new last range",
  [ADMIN, matrix("A", ", three ranges"), W1440],
  [MATRICES, "Click matrix A's name.", EDIT, "Click Add Range."],
  [R(QL("4.20", "S3-R16"), "The Matrices list shows."), R(QL("4.20", "S3-R16"), "Matrix A's page opens."), R(QL("4.20", "S3-R16"), "The grid is in edit."),
   R(QD("A new last range; counts as one change.", "4.20", "S3-R16"), "A new row appears at the bottom as the new \"and up\" range, highlighted, and the row above gets an end, as in picture 4.20.")],
  pics=["4.20"], held_on="Q8", flags=DV)

C("D-59", K, "Design: the saved message names the range of the change",
  [ADMIN, tier("A"), matrix("A", ", pricing one new category made for this test, tier A Margin % 25"), W1440],
  [MATRICES, "Click matrix A's name.", EDIT, "Type 22 in tier A's first range.", SAVE],
  [R(QL("3.12", "S4-R12"), "The Matrices list shows."), R(QL("3.12", "S4-R12"), "Matrix A's page opens."), R(QL("3.12", "S4-R12"), "The grid is in edit."), R(QL("3.12", "S4-R12"), "The bar reads 1 change."),
   R(QD("1 change: Tier 2 $0.00–$100.00: 22% margin. Parts already on work orders keep their prices.", "3.12", "S4-R12"),
     "The message reads \"1 change:\" tier A's name, the range (for example $0.00–$100.00), \": 22% margin.\" and \"Parts already on work orders keep their prices.\", as in picture 3.12.")],
  pics=["3.11", "3.12"], held_on="Q15", flags=DV)

C("D-60", K, "Design: grid errors show in a Save is blocked banner",
  [ADMIN, tier("A"), matrix("A", ", tier A on % Off"), W1440],
  [MATRICES, "Click matrix A's name.", EDIT, "Type 120 in tier A's first range.", SAVE],
  [R(QL("3.15", "S3-R6"), "The Matrices list shows."), R(QL("3.15", "S3-R6"), "Matrix A's page opens."), R(QL("3.15", "S3-R6"), "The grid is in edit."), R(QL("3.15", "S3-R6"), "The cell reads 120."),
   R(QD("Tier 5: enter a % from 0 to 99.99 in every range.", "3.15", "S3-R6"), "A pink banner under the simulator reads \"Save is blocked\" and tier A's name followed by \": enter a % from 0 to 99.99 in every range.\", as in picture 3.15.")],
  pics=["3.15", "4.18"], held_on="Q11", flags=DV)

C("D-61", K, "Design: the last range reads with a plus sign in view",
  [ADMIN, matrix("A", ", three ranges, the last starting at $10,000.01"), W1440],
  [MATRICES, "Click matrix A's name."],
  [R(QL("1.4", "S3-R16"), "The Matrices list shows."),
   R(QD("$10,000.01 +", "3.2", "S3-R16"), "The last range reads \"$10,000.01 +\" in view, as in pictures 1.4 and 3.2.")],
  pics=["1.4", "3.2", "4.1"], held_on="Q9", flags=DV)

C("D-62", K, "Design: a taken New Matrix name shows in the banner",
  [ADMIN, matrix("A"), W1440],
  [MATRICES, "Click New Matrix.", "Type matrix A's name.", "Click Create Matrix."],
  [R(QL("3.25", "S3-R6"), "The Matrices list shows."), R(QL("3.25", "S3-R6"), "The New Matrix page opens."), R(QL("3.25", "S3-R6"), "The name shows."),
   R(QD("A matrix called Stop 40 already exists.", "3.25", "S3-R6"), "The banner reads \"Save is blocked\" and \"A matrix called\" matrix A's name \"already exists.\", with no error under the name field, as in picture 3.25.")],
  pics=["3.25"], held_on="Q12", flags=DV)

C("D-63", K, "Design: the simulator columns realign between view and edit",
  [ADMIN, tier("A", ", so the simulator has a tier column"), matrix("A"), W1440],
  [MATRICES, "Click matrix A's name.", "Take a screenshot of the Price Part Simulator.", EDIT],
  [R(QL("3.5", "S4-R27"), "The Matrices list shows."), R(QL("3.5", "S4-R27"), "Matrix A's page opens in view."), R(QL("3.5", "S4-R27"), "The screenshot is saved."),
   R(QL("3.25", "S4-R27"), "Compared with the screenshot, the simulator's Part Cost column is wider and each price column moves right to stay under its grid column, as pictures 3.5 and 3.25 differ.")],
  pics=["3.5", "3.25", "3.10", "4.7"], held_on="Q31", flags=DV + ["movement"])

C("D-64", K, "Design: the New Matrix category list pushes the grid down",
  [ADMIN, W1440],
  [MATRICES, "Click New Matrix.", "Take a screenshot of the page.", "Click the Categories picker."],
  [R(QL("3.22", "S3-R13"), "The Matrices list shows."), R(QL("3.22", "S3-R13"), "The New Matrix page opens."), R(QL("3.22", "S3-R13"), "The screenshot is saved."),
   R(QL("3.23", "S3-R13"), "The category list opens in the page and the tabs and grid move down below it, compared with the screenshot, as pictures 3.22 and 3.23 differ.")],
  pics=["3.22", "3.23"], held_on="Q31", flags=DV + ["movement"])

C("D-65", K, "Design: every range but the first has a delete button",
  [ADMIN, matrix("A", ", three ranges"), W1440],
  [MATRICES, "Click matrix A's name.", EDIT],
  [R(QL("4.6", "S3-R32"), "The Matrices list shows."), R(QL("4.6", "S3-R32"), "Matrix A's page opens."),
   R(QL("4.6", "S3-R32"), "A trash icon shows at the left of the second and third rows, the last \"and up\" row included.", "The first row ($0.00) has none, as in pictures 4.6 and 4.21.")],
  pics=["4.6", "4.21", "3.11"], held_on="Q10", flags=DV)
