"""Story 2, The ShopCoach Line Builder (SV-10131), section 20462. Phase A, 27 Oct 2026, PRD v15.
Live cases rewritten top to bottom (Rule 134): S2-01 C154711 · S2-02 C154712 · S2-03 C549079 · S2-04 C549080.
SV-11850 (open bug, filed 27 Oct 2026 by the epic's QA): on staging, Build Lines returns nothing for every input and the screen shows
nothing. Every case whose STEPS click Build Lines (S2-01, S2-02, S2-03) carries AUTOMATION: READY - EXPECT FAIL (SV-11850) with the
symptom and the three outcomes (Rule 61). S2-04 only needs a ShopCoach line in its preconditions; it carries a plain note instead."""
from wwlib import C, EXPECT_FAIL
from common import *

WRITTEN = True
SV11850 = EXPECT_FAIL("SV-11850")
FAIL_NOTE = ("What you should see today: after you click Build Lines, nothing appears: no suggested lines, no error message, and the "
             "builder never shows that it has finished. This is a known problem and it is already reported — see "
             "https://shopview.atlassian.net/browse/SV-11850 (found on staging on 27 Oct 2026).\n"
             "· If you see exactly that, mark this test FAILED and do not raise anything new.\n"
             "· If it fails in a DIFFERENT way from what is described above, that is a NEW problem — please report it.\n"
             "· If it PASSES, the fix has shipped: report it so the ticket can be closed and this note removed.")
BUG = ("JIRA", "SV-11850, Mudassir Qamar, 27 Oct 2026 (Actual)", "The UI shows nothing: no lines, no error, no loading end state. Same result for every input tried.")
ASSET = ("Have an open work order, work order 1, that is not invoiced, for an asset with its year, make and model filled in, so "
         "ShopCoach can suggest lines for it.")
OPEN_BUILDER = "Click AI SHOPCOACH LINE BUILDER."
DESCRIBE = 'Type "brakes grinding" in the ShopCoach Line Builder box.'
BUILD = "Click Build Lines."
R_NEW = "The New Line window opens over work order 1."
R_BUILDER = "The ShopCoach Line Builder opens, with a box to describe the work and a Build Lines button."
R_TYPED = "\"brakes grinding\" shows in the box."
R_BUILT = "Suggested lines appear in a table, each with a title and a description."
SHOPCOACH = dict(boards=[], note="no board draws the ShopCoach line builder (the tech plan: \"No boards for Story 2 / Story 4 — accepted as "
                 "text-only, verified by browser-walk.\"), so no design picture is attached; the expected results above come from the quotes above.")
DEV_PLAN = ("JIRA", "SV-10131, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing)",
            "Click a suggested line's title cell: the editor is labelled \"Title\"; empty it and \"What are you doing?\" shows.")
DEV_PLAN2 = ("JIRA", "SV-10131, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing)",
             "Click the description cell: the editor is labelled \"Description\"; empty it and \"Why are you doing it?\" shows.")
DEV_CELLS = ("JIRA", "SV-10131, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing)",
             "Empty cells read the prompts in sentence case, grey italic; table cells don't grow or shift.")

C("S2-01", "S2", "ShopCoach line builder labels its editors Title and Description",
  [ADMIN, ASSET, START_LINES],
  [NEW_LINE, OPEN_BUILDER, DESCRIBE, BUILD, "Click the title cell of the first suggested line.", "Click the description cell of the same line."],
  [[R_NEW], [R_BUILDER], [R_TYPED], [R_BUILT],
   ["An editor opens on the title, labeled exactly \"Title\"."],
   ["An editor opens on the description, labeled exactly \"Description\"."]],
  ["S2-R1", DEV_PLAN, DEV_PLAN2, BUG], note=FAIL_NOTE, marker=SV11850, design=SHOPCOACH,
  claude=["Asset example: any asset with year, make and model (e.g. 2018 Freightliner Cascadia). The QA passed this on qb1/sv10130 on "
          "23 Oct (WO S2-17477); on staging SV-11850 blocks it (27 Oct)."])

C("S2-02", "S2", "A line added from ShopCoach keeps the title and description the builder showed",
  [ADMIN, "Create an open work order for this test, work order 1, for an asset with its year, make and model filled in, so "
          "ShopCoach can suggest lines for it.", START_LINES],
  [NEW_LINE, OPEN_BUILDER, DESCRIBE, BUILD, "Click the add button of the first suggested line.", "Click the added line's title on work order 1's Lines tab."],
  [[R_NEW], [R_BUILDER], [R_TYPED],
   [R_BUILT, "Keep the first suggested line's title and description in view or in mind; step 6 compares them."],
   ["The first suggested line is added to work order 1 and is listed on its Lines tab with the same title and description as in the table."],
   ["The Edit Line window opens.", "Title and Description read exactly the title and description the builder showed in step 4: nothing added, cut or reworded.",
    "Neither value contains \"What are you doing?\" or \"Why are you doing it?\"."]],
  ["S2-R3", "S2-R1", BUG], note=FAIL_NOTE, marker=SV11850, design=SHOPCOACH)

C("S2-03", "S2", "Empty ShopCoach title and description show the question prompts",
  [ADMIN, ASSET, START_LINES],
  [NEW_LINE, OPEN_BUILDER, DESCRIBE, BUILD, "Click the title cell of the first suggested line.", "Delete all the text in the Title editor.",
   "Click the description cell of the same line.", "Delete all the text in the Description editor.", "Click outside the table."],
  [[R_NEW], [R_BUILDER], [R_TYPED], [R_BUILT],
   ["An editor labeled \"Title\" opens on the title."],
   ["The empty Title editor shows the grey prompt \"What are you doing?\"."],
   ["An editor labeled \"Description\" opens on the description.",
    "The emptied title cell reads \"What are you doing?\", in grey italic, with only the first letter a capital (not \"What Are You Doing?\")."],
   ["The empty Description editor shows the grey prompt \"Why are you doing it?\"."],
   ["The emptied cells read \"What are you doing?\" and \"Why are you doing it?\" in grey italic, with only the first letter a capital.",
    "The two cells are the same height and width as the other cells of the table: nothing grows or shifts."]],
  ["S2-R2", "S1-R3", "S2-R1", DEV_CELLS, BUG], note=FAIL_NOTE, marker=SV11850,
  design=dict(boards=[], words=[note("Staging renders the questions in Title Case.")],
              note="no board draws the ShopCoach line builder; the canvas note below gives the sentence case the after boards use."))

C("S2-04", "S2", "A ShopCoach line reads Title - Description in the Customer Invoice report",
  [ADMIN, TECH_OFF,
   "Create a work order for this test, work order 1, with one labor line, line 1, added from the ShopCoach line builder, with no tech story.",
   "Write down line 1's title and description exactly as work order 1's Lines tab shows them.",
   "Have line 1 completed with no tech story, and work order 1 completed and invoiced today as invoice A.",
   SHEETS, START_EXPORT],
  REPORT + [OPEN_SHEET],
  [[R_PICK], [R_TODAY], [R_DOWNLOAD],
   ["In line 1's row (work order 1's invoice A) the ItemDescription cell reads line 1's title, a space, a hyphen, a space, then line 1's "
    "description, exactly as written down, and nothing after the description.",
    "The cell has no \"What are you doing?\", no \"Why are you doing it?\", no \"Tech Story:\" and no semicolon added by the app."]],
  ["S2-R3", "S3-R1", "S3-R3", "S3-R6"],
  note=("If the ShopCoach line builder shows nothing after Build Lines, line 1 cannot be made: that is the known problem "
        "https://shopview.atlassian.net/browse/SV-11850 (staging, 27 Oct 2026)."),
  design=dict(boards=["QuickBooks"], words=[words("QuickBooks", "Require Tech Story OFF, none written", "Replace tie rod - excessive play")]),
  claude=["The QA's 23 Oct pass: ShopCoach line \"DOT Inspection\" (title only) read \"DOT Inspection\" in QuickBooks and in the export."])
