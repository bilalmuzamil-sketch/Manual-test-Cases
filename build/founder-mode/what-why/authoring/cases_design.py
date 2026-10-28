"""Section DESIGN, "Design — how it looks" (new section under What/Why 20437; the coordinator creates it and writes its id into
../section-map.json as "DESIGN"). Keys D-01 … D-17; every title starts "Design: " (Rule 117 twelfth amendment).

Phase D part 2, 27 Oct 2026, written from full-pass-2026-10-27/design/DESIGN-CASE-PLAN.md (the design drive of the same day:
DESIGN-DRIVE-PROOF.md). Boards by file stem: DialogBefore 1.1, Main 1.2, QuickBooks 1.3, EditBefore 1.4, EditAfter 1.5,
EdgeCases 2.1, Truncation 2.2. Expected looks come from PRD v15 where it has a sentence (S1-R1/R2/R3/R5/R7, KD-4, KD-7, OOS-1,
S2-R1/R2), otherwise from the named board picture (Rule 126 point 5); the tech plan and the developers' Jira notes inform.
- D-15 is the one held design-version case (Rule 130 item 5): DV-04, question DQ-01 (the coordinator numbers it Q12).
- D-16 and D-17 click Build Lines, so they carry AUTOMATION: READY - EXPECT FAIL (SV-11850) with Phase A's symptom note (Rule 61),
  and start at the ShopCoach Line Builder box on the Lines tab, as Phase A's Story 2 cases do.
Not asserted (no source; proposed questions): the grey italic look of an empty ShopCoach cell (DQ-02) and whether the modern invoice
still prints "Scope of work" when a line has no tech story (DQ-03)."""
from wwlib import C, DESIGN_HOLD, PO_HOLD, HOLD   # noqa: F401
from common import *   # noqa: F401,F403
from cases_s2 import SV11850, FAIL_NOTE, DESCRIBE, BUILD, ASSET, R_TYPED, R_BUILT

WRITTEN = True
SECTION = "DESIGN"

# ---------------------------------------------------------------- shared tester text
WO_OPEN = "Have an open work order, work order 1, that is not invoiced, so you can add a line to it."
WO_DESC = 'Have an open work order, work order 1, with a line, line 1, titled "Replace tie rod" with the description "excessive play".'
WO_NODESC = 'Have an open work order, work order 1, with a line, line 1, titled "Replace tie rod" with no description.'
FULL = "Use a desktop browser window at full screen, at 100% zoom, so the window can be compared with the attached board picture."
W1440 = "Use a desktop browser window exactly 1440 pixels wide, at 100% zoom."
W1536 = "Use a desktop browser window exactly 1536 pixels wide, at 100% zoom."
OPENED_NEW = "The New Line window opens over work order 1."
OPENED_EDIT = "The Edit Line window opens for line 1 of work order 1."

# ---------------------------------------------------------------- the design's own words (verbatim, checked by wwlib.check)
MAIN_NOTE = words("Main", "The only two things that change", "depending on state.")
MAIN_REST = words("Main", "Everything else on this dialog is untouched", "all three button labels.")
BEFORE_NOTE = words("DialogBefore", "What a writer sees today", "a shop's accounting records.")
CASE_NOTE = note("Staging renders the questions in Title Case.")
EDIT_NOTE = words("EditAfter", "Two labels, nothing else", "in sentence case.")
EDIT_REST = words("EditAfter", "Status, Technicians, the labor row", "a New Line problem only.")
EDIT_BEFORE = words("EditBefore", "The question is worst here", "in the shop's books.")
INVOICE_VIEWS = words("QuickBooks", "Why the narrative carries no label", "what a customer sees in either view.")
LEGACY = words("QuickBooks", "Legacy invoice", "Both outer ends worn, replaced and aligned")
MODERN = words("QuickBooks", "Modern invoice", "Both outer ends worn, replaced and aligned")
FOUR = words("EdgeCases", "The four flavours of tech story that reach the books", "reach the books")
IMPORTED = words("EdgeCases", "Imported from a previous system · may be empty", "Replace tie rod - excessive play")

# ---------------------------------------------------------------- non-PRD sources (verbatim, checked)
D5 = ("TECH", "D5 (stack-label on all five fields)", "Quasar makes the placeholder transparent on a labeled, non-floated field "
      "(app/node_modules/quasar/src/components/field/QField.sass:399-403); without stack-label FR-003 silently fails.")
FR006 = ("TECH", "FR-006 (SV-10131)", "The builder's two editors are labelled \"Title\" / \"Description\" with the FR-003 placeholders; "
         "the empty-cell fallback text reads \"What are you doing?\" / \"Why are you doing it?\" in sentence case (S2-R1, S2-R2).")
WALK5 = ("TECH", "Phase 3, browser-walk step 5", "5. ShopCoach builder: both editors labelled, placeholders visible, empty cells read "
         "in sentence case; screenshot the table — cells must not grow/shift (risk R2).")
VERIFY = ("JIRA", "SV-10391, Milan Zivanovic, 23 Sep 2026 (Checklist)", "Screenshot the table: cells must not grow or shift.")
DEV_TITLE = ("JIRA", "SV-10131, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing)",
             "Click a suggested line's title cell: the editor is labelled \"Title\"; empty it and \"What are you doing?\" shows.")
PATH = ("JIRA", "SV-10131, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing)", "Test plan (Work order → Lines → ShopCoach Line Builder → Build Lines)")
LABOVE = ("JIRA", "SV-10391, Milan Zivanovic, 23 Sep 2026 (Checklist)",
          "The only visible layout change is that labels now always sit above their fields.")
NOBOARD = ("no board draws the ShopCoach line builder (the tech plan: \"No boards for Story 2 / Story 4 — accepted as text-only, "
           "verified by browser-walk.\"), so no design picture is attached; the expected results above come from the quotes above")
SHOPCOACH = dict(boards=[], note=NOBOARD + ", and the comparison is with the line window's own Title box.")
SHOPCOACH_TABLE = dict(boards=[], note=NOBOARD + ", and the comparison is between the tester's two screenshots of the table.")

# ================================================================ New Line, board 1.2 (control: board 1.1)
C("D-01", "DESIGN", "Design: New Line opens with the Title box ready and its grey prompt",
  [ADMIN, WO_OPEN, FULL, START_LINES],
  [NEW_LINE, 'Type "R".'],
  [[OPENED_NEW,
    "The first box spans the window's width, has a light grey background and a dark red line along its bottom edge, as on the attached picture of board 1.2.",
    "A small dark red label reads exactly \"Title\", with no star after it, at the top left inside the box.",
    "Under the label, grey text reads \"What are you doing?\", with only the first W a capital (not \"What Are You Doing?\" as on board 1.1).",
    "A grey down-arrow sits at the right end of the box."],
   ["\"R\" appears in the Title box without clicking it first, because the cursor was already there when the window opened.",
    "The grey prompt \"What are you doing?\" is gone and only \"R\" shows under the label \"Title\"."]],
  ["S1-R1", "S1-R3", "S1-R5"],
  design=dict(boards=["Main", "DialogBefore"], words=[MAIN_NOTE, CASE_NOTE, BEFORE_NOTE],
              note="Board 1.1 \"New Line - before\" is today's window and is attached only as the control: there the question itself sits "
                   "inside the box as its label."),
  claude=["The grey fill and the dark red bottom line are the focused picker as both New Line boards draw it (#d9d9d9 background, "
          "2 px #8b0f1d line; label #8b0f1d 10 px; prompt #8b95a3 14 px). Nothing is saved; close the window afterwards."])

C("D-02", "DESIGN", "Design: New Line shows Description above its grey prompt",
  [ADMIN, WO_OPEN, FULL, START_LINES],
  [NEW_LINE],
  [[OPENED_NEW,
    "Directly under the Title box is a white box with a thin light grey border and rounded corners, as wide as the Title box.",
    "A small grey label reads exactly \"Description\" at the top left inside the box.",
    "Under the label, lighter grey text reads \"Why are you doing it?\", with only the first W a capital.",
    "The box shows two lines of text, the label above the prompt, where board 1.1 shows the question alone in the box."]],
  ["S1-R2", "S1-R3"],
  design=dict(boards=["Main", "DialogBefore"], words=[MAIN_NOTE, CASE_NOTE],
              note="Board 1.1 \"New Line - before\" is attached as the control (today's box holds only \"Why Are You Doing It?\")."),
  claude=["Description box as drawn: 1 px #c6ccd4 border, 4 px corners, label #7b8595 10 px, prompt #8b95a3 14 px."])

C("D-03", "DESIGN", "Design: New Line keeps its header, other fields and buttons as drawn",
  [ADMIN, WO_OPEN, FULL, START_LINES],
  [NEW_LINE],
  [[OPENED_NEW,
    "The header shows, from left to right: \"New Line\" in bold, a small purple \"AI\" tag with white letters, and \"SHOPCOACH LINE BUILDER\" in blue capitals; a grey X sits at the far right.",
    "Under the Description box: the word \"Technicians\", then a box reading \"Add Technician\" with a grey down-arrow at its right.",
    "Next, one row of three boxes from left to right: \"Labor Rate\" (the widest, with a down-arrow), \"Estimated Time\" and \"Tech Time\", each with its small grey label at the top.",
    "At the bottom right, in this order: \"Save & Add Part\" and \"Save & Add Line\" (white with a blue border and blue letters), then \"Save & Close\" (solid blue with white letters).",
    "Side by side with the attached picture of board 1.2 at 100% zoom, the window shows these parts in the same order with nothing between them."]],
  ["S1-R7", "S1-R5"],
  design=dict(boards=["Main"], words=[MAIN_REST]),
  claude=["Header: title 17 px bold #1d2129; AI tag #9C27B0; link #2276DA 11 px 600; X #5b6472. Buttons: outlined #2276DA; Save & Close filled #2276DA."])

# ================================================================ Edit Line, board 1.5 (control: board 1.4)
C("D-04", "DESIGN", "Design: Edit Line shows Title above the saved title",
  [ADMIN, WO_DESC, FULL, START_LINES],
  [CLICK_LINE1],
  [[OPENED_EDIT,
    "The first box is white with a thin light grey border, with no grey background and no red line under it.",
    "A small grey label reads exactly \"Title\", with no star after it, at the top left inside the box.",
    "Under the label, \"Replace tie rod\" shows in dark text, exactly as saved.",
    "The label reads \"Title\", where board 1.4 shows the question \"What Are You Doing?\" above the saved title."]],
  ["S1-R1", "S1-R3"],
  design=dict(boards=["EditAfter", "EditBefore"], words=[EDIT_NOTE, EDIT_BEFORE],
              note="Board 1.4 \"Edit Line - before\" is today's window and is attached only as the control."),
  claude=["Any line works; nothing is saved. Edit Line has no canned-line picker, so its Title box is a plain outlined box."])

C("D-05", "DESIGN", "Design: Edit Line shows Description above the grey prompt when empty",
  [ADMIN, WO_NODESC, FULL, START_LINES],
  [CLICK_LINE1],
  [[OPENED_EDIT,
    "The Title box shows \"Replace tie rod\" in dark text under its label.",
    "The second box shows a small grey label reading exactly \"Description\" at its top left.",
    "Under that label, lighter grey text reads \"Why are you doing it?\", with only the first W a capital, because line 1 has no description."]],
  ["S1-R2", "S1-R3"],
  design=dict(boards=["EditAfter"], words=[EDIT_NOTE]),
  claude=["Line 1 is made with a title and no description, as board 1.5 draws it."])

C("D-06", "DESIGN", "Design: Edit Line keeps Status, labor row, link and buttons as drawn",
  [ADMIN, WO_DESC, FULL, START_LINES],
  [CLICK_LINE1],
  [[OPENED_EDIT,
    "The header shows \"Edit Line\" in bold at the left and a blue X at the far right; the header has no AI tag and no ShopCoach link.",
    "Under the Description box, in this order: a \"Status\" box showing line 1's status with a down-arrow, the word \"Technicians\" above an \"Add Technician\" box, and one row with \"Labor Rate\", \"Estimated Time\" and \"Tech Time\".",
    "Under the labor row: a small purple \"AI\" tag and \"SHOPCOACH LABOR GUIDE\" in blue capitals.",
    "At the bottom right: a solid red \"Delete\" button, then a solid blue \"Save & Close\" button."]],
  ["S1-R7"],
  design=dict(boards=["EditAfter"], words=[EDIT_REST]),
  claude=["X #2276DA; Delete #C10015; Save & Close #2276DA; labor guide link #2276DA 11 px 600 beside the #9C27B0 AI tag."])

# ================================================================ widths 1440 / 1536 (Rule 126 point 2; the design draws no overlap)
def width_new(key, w, pre_w):
    C(key, "DESIGN", f"Design: New Line shows every label and button whole at {w} pixels",
      [ADMIN, WO_OPEN, pre_w, START_LINES],
      [NEW_LINE],
      [[OPENED_NEW,
        "\"Title\", \"What are you doing?\", \"Description\" and \"Why are you doing it?\" each show in full, with every letter visible and no text over another.",
        "\"SHOPCOACH LINE BUILDER\" shows in full on the header line, with the X at the far right of the same line.",
        "\"Save & Add Part\", \"Save & Add Line\" and \"Save & Close\" sit on one row at the bottom right, each label in full."]],
      ["S1-R3", "S1-R7"], design=dict(boards=["Main"], words=[MAIN_REST]),
      claude=[f"Window width {w} px (browser window, not the screen). The board draws the window 455 px wide; no overlap or clipping "
              "was found in the board at 1440 or 1536 px (design/inventory/VISUAL-INVENTORY-2026-10-27.md)."])
width_new("D-07", 1440, W1440)
width_new("D-08", 1536, W1536)

def width_edit(key, w, pre_w):
    C(key, "DESIGN", f"Design: Edit Line shows every label and button whole at {w} pixels",
      [ADMIN, WO_NODESC, pre_w, START_LINES],
      [CLICK_LINE1],
      [[OPENED_EDIT,
        "\"Title\" with \"Replace tie rod\" under it, and \"Description\" with \"Why are you doing it?\" under it, each show in full, with no text over another.",
        "\"SHOPCOACH LABOR GUIDE\" shows in full beside its purple \"AI\" tag.",
        "\"Delete\" and \"Save & Close\" sit on one row at the bottom right, each label in full."]],
      ["S1-R3", "S1-R7"], design=dict(boards=["EditAfter"], words=[EDIT_REST]),
      claude=[f"Window width {w} px. Line 1 has no description so the grey prompt is on screen."])
width_edit("D-09", 1440, W1440)
width_edit("D-10", 1536, W1536)

# ================================================================ the printed invoice, board 1.3 (PRD: the documents are untouched)
LEG_ON = "Make sure Legacy invoice layout is on (Settings, then Invoice), so work order 1's invoice prints in the legacy layout."
LEG_OFF = "Make sure Legacy invoice layout is off (Settings, then Invoice), so work order 1's invoice prints in the modern layout."
TS_OFF = "Make sure Require Tech Story is off (Settings, then the Work Orders tab), so line 1 can be completed without a tech story."
WO_STORY = ('Create a work order for this test, work order 1, with one labor line, line 1, titled "Replace tie rod" with the '
            'description "excessive play".')
MISSING = ("Have line 1 opened in Edit Line and saved once with Save & Close, without typing a tech story, so it holds "
           "\"Tech story missing.\".")
START_WO = "Start on work order 1."
FIN = ["Click the Finance tab.", "Set the Estimate / Invoice toggle to Invoice."]
R_FIN = ["Work order 1's Finance tab opens."]
INV_Q = ["KD-4", "OOS-1"]
INV_NOTE = ("The \"Legacy invoice\" and \"Modern invoice\" panels of board 1.3 draw the printed invoice itself, a screen of ours: compare "
            "work order 1's invoice on the Finance tab with them.")

C("D-11", "DESIGN", "Design: Legacy invoice prints title, description and tech story with no labels",
  [ADMIN, LEG_ON, WO_STORY, invoiced(N1), START_WO],
  FIN,
  [R_FIN,
   ["Invoice A shows in the legacy layout.",
    "Line 1 prints \"Replace tie rod\" in bold, \"excessive play\" on the next line and \"Both outer ends worn, replaced and aligned\" on the line after it, as in the \"Legacy invoice\" panel of the attached picture of board 1.3.",
    "No word such as \"Title\", \"Description\", \"Tech Story\" or \"Scope of work\" prints in front of any of the three lines.",
    "\"What are you doing?\" and \"Why are you doing it?\" appear nowhere on the invoice, while the three lines above do."]],
  INV_Q, stories=[3], design=dict(boards=["QuickBooks"], words=[INVOICE_VIEWS, LEGACY], note=INV_NOTE),
  claude=["Legacy invoice layout: Settings → Invoice toggle (off = modern, on = legacy), a fact from the Invoice UI refresh suite; an "
          "invoice keeps the layout it was created with, so set the toggle before invoicing. Screen label to confirm on the build."])

C("D-12", "DESIGN", "Design: Modern invoice prints the tech story under Scope of work",
  [ADMIN, LEG_OFF, WO_STORY, invoiced(N1), START_WO],
  FIN,
  [R_FIN,
   ["Invoice A shows in the modern layout.",
    "Line 1 prints \"Replace tie rod\" in bold, then \"excessive play\", then a small grey heading in capitals reading \"SCOPE OF WORK\", then \"Both outer ends worn, replaced and aligned\", as in the \"Modern invoice\" panel of the attached picture of board 1.3.",
    "No word such as \"Title\" or \"Description\" prints in front of \"Replace tie rod\" or \"excessive play\"."]],
  INV_Q, stories=[3], design=dict(boards=["QuickBooks"], words=[INVOICE_VIEWS, MODERN], note=INV_NOTE),
  claude=["Modern layout = Legacy invoice layout off. The heading is drawn as 11 px bold capitals #8b95a3 (board 1.3)."])

C("D-13", "DESIGN", "Design: Legacy invoice leaves out \"Tech story missing.\"",
  [ADMIN, LEG_ON, TS_OFF, WO_STORY, MISSING,
   "Have line 1 completed without typing a tech story, and work order 1 completed and invoiced today as invoice A.", START_WO],
  FIN,
  [R_FIN,
   ["Invoice A shows in the legacy layout, with line 1 printing \"Replace tie rod\" in bold and \"excessive play\" on the next line.",
    "The words \"Tech story missing.\" appear nowhere on the invoice, while line 1's title and description do."]],
  ["KD-4", "KD-7", "S3-R6", "OOS-1"], design=dict(boards=["QuickBooks"], words=[INVOICE_VIEWS], note=INV_NOTE),
  claude=["Line 1 holds the placeholder because it was saved once from Edit Line with no tech story (PRD S3-R6, answer 6 of 14 Oct)."])

C("D-14", "DESIGN", "Design: Modern invoice leaves out \"Tech story missing.\"",
  [ADMIN, LEG_OFF, TS_OFF, WO_STORY, MISSING,
   "Have line 1 completed without typing a tech story, and work order 1 completed and invoiced today as invoice A.", START_WO],
  FIN,
  [R_FIN,
   ["Invoice A shows in the modern layout, with line 1 printing \"Replace tie rod\" in bold and then \"excessive play\".",
    "The words \"Tech story missing.\" appear nowhere on the invoice, while line 1's title and description do."]],
  ["KD-4", "KD-7", "S3-R6", "OOS-1"], design=dict(boards=["QuickBooks"], words=[INVOICE_VIEWS], note=INV_NOTE),
  claude=["Not asserted: whether the \"Scope of work\" heading still prints with no tech story (no source; proposed question DQ-03)."])

# ================================================================ held design-version case, board 2.1 (DV-04, DQ-01)
# D-15 (C839525, held design version of DV-04) deleted 28 Oct 2026 with the QA lead's go-ahead: Product answer 12 (27 Oct) says an
# imported invoice never appears in the report and the board's example is illustrative; S3-24 now covers S3-R12's new sentence.

# ================================================================ ShopCoach (no board; Build Lines meets SV-11850 on staging)
C("D-16", "DESIGN", "Design: An emptied ShopCoach editor shows its label above the prompt",
  [ADMIN, ASSET, START_LINES],
  [DESCRIBE, BUILD, "Click the title cell of the first suggested line.", "Delete all the text in the Title editor."],
  [[R_TYPED], [R_BUILT],
   ["An editor opens on the title, with the label \"Title\" at its top and the suggested title under the label."],
   ["The label \"Title\" stays at the top of the editor.",
    "The grey prompt \"What are you doing?\" shows under the label, the same arrangement as the Title box of the New Line window."]],
  ["S2-R1", "S2-R2", "S1-R3", D5, FR006, DEV_TITLE, LABOVE, PATH],
  note=FAIL_NOTE, marker=SV11850, design=SHOPCOACH,
  claude=["Tech plan D5: stack-label on all five fields (picker, Title, Description, and the two ShopCoach editors)."])

C("D-17", "DESIGN", "Design: ShopCoach table rows keep their size when a cell shows its prompt",
  [ADMIN, ASSET, START_LINES],
  [DESCRIBE, BUILD, "Take a screenshot of the suggested lines table.", "Click the description cell of the first suggested line.",
   "Delete all the text in the Description editor.", "Click outside the table.", "Take a second screenshot of the table."],
  [[R_TYPED], [R_BUILT, "The table shows at least two suggested lines."],
   ["The first screenshot is saved, with every row of the table in it."],
   ["An editor labeled \"Description\" opens on the description."],
   ["The grey prompt \"Why are you doing it?\" shows in the empty editor."],
   ["The emptied cell reads \"Why are you doing it?\", with only the first W a capital."],
   ["Side by side, the two screenshots show the same row heights and the same column widths: the emptied cell's row is no taller or "
    "shorter than before, and the other cells sit where they were."]],
  ["S2-R2", FR006, WALK5, VERIFY, PATH],
  note=FAIL_NOTE, marker=SV11850, design=SHOPCOACH_TABLE,
  claude=["Source: tech plan Phase 3 browser-walk step 5 (risk R2) and SV-10391's checklist; the PRD and the design are silent on "
          "the table. The grey italic look (developer note on SV-10131) is not asserted here (proposed question DQ-02)."])

# ================================================================ 28 Oct 2026 named set (Product answer 14): no heading without a tech story
C("D-18", "DESIGN", "Design: Modern invoice prints no Scope of work heading without a tech story",
  [ADMIN, LEG_OFF, TS_OFF,
   'Create a work order for this test, work order 1, with two labor lines: line 1 titled "Replace tie rod" with the description '
   '"excessive play", and line 2 titled "Align front axle" with the description "pulls left".',
   'Have line 1 completed with no tech story and line 2 completed with the tech story "Aligned to spec", and work order 1 completed '
   'and invoiced today as invoice A.', START_WO],
  FIN,
  [R_FIN,
   ["Invoice A shows in the modern layout.",
    "Line 1 prints \"Replace tie rod\" in bold, then \"excessive play\", and nothing under it: no \"SCOPE OF WORK\" heading.",
    "Line 2 prints \"Align front axle\" in bold, then \"pulls left\", then the small grey heading \"SCOPE OF WORK\" and \"Aligned to spec\": "
    "the heading shows only for the line that has a tech story."]],
  INV_Q + [PO_ANS[14]], stories=[3], design=dict(boards=["QuickBooks"], words=[INVOICE_VIEWS, MODERN], note=INV_NOTE),
  claude=["New 28 Oct 2026 (Product answer 14). Product: a tech story of only spaces prints the heading over a blank block, an existing "
          "invoice bug to be ticketed on its own and kept out of these cases."])
