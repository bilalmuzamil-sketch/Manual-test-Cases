"""Held "design version" cases for PRD pages 1-4 (Rule 130 point 5, QA lead 19 Oct 2026: "Yes and permanent"). Each checks the design's own
version of something the PRD words or shapes differently, is held on its PO question candidate (po_questions.py Q1-Q10) and is not run
while held. The day the PO rules: if the design wins, release the case (marker) and rewrite the PRD-following case; if the PRD wins, delete
this case with the QA lead's go-ahead. Register rows: DESIGN-DIVERGENCE-REGISTER.json (TPD-..).
16 Nov 2026 (Matt Barge's answers, PRD v38; QA lead: "Named set, write it (Recommended)"): D-50 released (answer 1: the design's breadcrumbs);
D-63 and D-64 rewritten to S19-R24 (answer 31: columns keep their place) and released; the other 13 cases of this file (D-51 to D-62, D-65)
were deleted (the PO ruled the design's version out); their source is kept in po-answers-2026-11-16/v38/deleted-library-cases.py."""
from tp_lib import C, R, S, QD, QL, QA
from common import *

K = "DESIGN"
DV = ["design-version"]

C("D-50", K, "Design: breadcrumbs start at Pricing, as the design draws them",
  [ADMIN, tier("A"), matrix("A"), W1440],
  [TIERS, "Click tier A's row.", MATRICES, "Click matrix A's name."],
  [R(QL("2.32", "S2-R28"), "The Tiers list shows."),
   R([QD("Pricing", "2.32", "S2-R28"), S("S2-R28", "with the breadcrumb Pricing › Tiers › <tier>")], "The breadcrumb reads Pricing › Tiers › and tier A's name, as in picture 2.32."),
   R(QL("3.2", "S3-R26"), "The Matrices list shows."),
   R([QD("Pricing", "3.2", "S3-R26"), S("S3-R26", "Pricing › Matrices › <matrix>"), S("S3-R26", "Breadcrumbs start at the Settings page the user is on, never at Settings")],
     "The breadcrumb reads Pricing › Matrices › and matrix A's name, as in picture 3.2, with no Settings crumb before Pricing.")],
  pics=["2.11", "2.32", "2.46", "3.2", "4.26"])

C("D-63", K, "Design: the simulator columns keep their place between view and edit",
  [ADMIN, tier("A", ", so the simulator has a tier column"), matrix("A"), W1440],
  [MATRICES, "Click matrix A's name.", "Take a screenshot of the Price Part Simulator.", EDIT],
  [R(QL("3.5", "S4-R27"), "The Matrices list shows."), R(QL("3.5", "S4-R27"), "Matrix A's page opens in view."), R(QL("3.5", "S4-R27"), "The screenshot is saved."),
   R(S("S4-R4"), "The grid is in edit, with Cancel and Save.")
   + R([S("S19-R24", "Columns and fields keep their place and width when a screen changes state"), S("S19-R24", "a page switching between view and edit"), S("S19-R24", "Nothing moves sideways or down.")],
       "Compared with the screenshot, the simulator's Part Cost column and each price column keep their place and width: nothing moves sideways or down.")],
  pics=["3.5", "3.25", "3.10", "4.7"], flags=["movement"])

C("D-64", K, "Design: opening the New Matrix category list keeps the tabs and grid in place",
  [ADMIN, W1440],
  [MATRICES, "Click New Matrix.", "Take a screenshot of the page.", "Click the Categories picker."],
  [R(QL("3.22", "S3-R13"), "The Matrices list shows."), R(QL("3.22", "S3-R13"), "The New Matrix page opens."), R(QL("3.22", "S3-R13"), "The screenshot is saved."),
   R(S("S3-R13", "with a multi-select category picker with search and Select all"), "The category list opens with a search box and Select all.")
   + R([S("S19-R24", "Nothing moves sideways or down."), QA("Columns and boxes keep their place: nothing moves sideways or down", 31, "S19-R24")],
       "Compared with the screenshot, the Work Order Matrix and Part Sale Matrix tabs and the grid keep their place: nothing moves sideways or down.")],
  pics=["3.22", "3.23"], flags=["movement"])
