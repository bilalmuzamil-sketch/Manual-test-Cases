"""Story 1, The Work Order Line Dialog (SV-10130), section 20461. Phase A, 27 Oct 2026, PRD v15.
Live cases rewritten top to bottom (Rule 134): S1-01 C154707 · S1-02 C154708 · S1-03 C154709 · S1-04 C154710 · S1-05 C549075 ·
S1-06 C549076 · S1-07 C549077 · S1-08 C549078. Splits (Rule 136, new cases): S1-03b (leaving Title empty shows the message, v14 S1-R6),
S1-04b (Edit Line keeps its fields; split from the New Line field-order case)."""
from wwlib import C, EXPECT_FAIL
from common import *

WRITTEN = True
MAIN = dict(boards=["Main"], words=[words("Main", "The only two things that change", "depending on state.")])
MAIN_ALL = dict(boards=["Main"], words=[words("Main", "Everything else on this dialog is untouched", "all three button labels.")])
EDIT = dict(boards=["EditAfter"], words=[words("EditAfter", "Two labels, nothing else", "in sentence case.")])
EDIT_ALL = dict(boards=["EditAfter"], words=[words("EditAfter", "Status, Technicians, the labor row", "a New Line problem only.")])
WO_OPEN = "Have an open work order, work order 1, that is not invoiced, so you can add a line to it."
WO_LINE_HAVE = ("Have an open work order, work order 1, with a line, line 1, that has a title and a description.")
CANNED = "Have a canned line, canned line A, at the test location (Settings, then Canned Lines)."
NO_STAR = "The first field is labeled exactly \"Title\", with no asterisk, and the label sits at the top of the box."
TITLE_PROMPT = "The grey prompt \"What are you doing?\" shows inside the Title box, under the label."
DESC_LABEL = "The second field is labeled exactly \"Description\", with the label at the top of the box."
DESC_PROMPT = "The grey prompt \"Why are you doing it?\" shows inside the Description box, under the label."
MSG = "\"Title is a required field\" shows under the Title box (not \"Line Name is a required field\")."
DEV_LEAVE = ("JIRA", "SV-10130, Nemanja Djuric, 19 Oct 2026 (QA update, PRD v14)",
             "New Line: tab away from the empty Title. \"Title is a required field\" shows under Title; the label still reads \"Title\" and the prompt stays inside the box.")

C("S1-01", "S1", "New Line shows the fields Title and Description with grey question prompts",
  [ADMIN, WO_OPEN, START_LINES],
  [NEW_LINE, "Click the Description box.", 'Type "excessive play".', "Click the Title box.", 'Type "Replace tie rod".'],
  [["The New Line window opens over work order 1, with the cursor already in the first field.", NO_STAR, TITLE_PROMPT,
    DESC_LABEL, DESC_PROMPT],
   ["The Description label stays at the top of the box.", "The grey prompt \"Why are you doing it?\" still shows, because the box is empty."],
   ["The prompt \"Why are you doing it?\" is gone and only \"excessive play\" shows in the box.", "The label still reads \"Description\", at the top of the box."],
   ["The Title label stays at the top of the box.", "The grey prompt \"What are you doing?\" still shows, because the box is empty."],
   ["The prompt \"What are you doing?\" is gone and only \"Replace tie rod\" shows in the box.", "The label still reads \"Title\", at the top of the box."]],
  ["S1-R1", "S1-R2", "S1-R3", "S1-R5", "PRE-S1-1"], design=MAIN,
  claude=["Any open, uninvoiced work order at the test location will do; nothing is saved."])

C("S1-02", "S1", "The Title label stays Title when a canned line is picked or cleared",
  [ADMIN, WO_OPEN, CANNED, START_LINES],
  [NEW_LINE, "Type the first three letters of canned line A's name.", "Click canned line A in the list.",
   "Click the clear button (x) at the right end of the Title field."],
  [["The New Line window opens over work order 1, with the cursor in the field labeled \"Title\".", TITLE_PROMPT],
   ["The prompt is gone and only the three letters show.", "The label still reads \"Title\".", "Canned line A is offered in the list."],
   ["The field shows canned line A's name.", "The label still reads \"Title\", not a question such as \"What are you doing?\".",
    "No grey prompt sits beside the picked name."],
   ["The Title field is empty again.", "The label still reads \"Title\" and the grey prompt \"What are you doing?\" shows again."]],
  ["S1-R4", "S1-R5", "S1-R3"],
  design=MAIN, claude=["Canned line example: \"Replace - Brake pot\" (the one the QA used on sv10130, SV-10130 comment of 20 Oct)."])

C("S1-03", "S1", "New Line will not save without a Title and says \"Title is a required field\"",
  [ADMIN, "Create an open work order for this test, work order 1, so that a wrongly saved line would not touch other work.", START_LINES],
  [NEW_LINE, "Click the Description box.", 'Type "no title".', SAVE_CLOSE],
  [["The New Line window opens over work order 1, with an empty Title field."],
   ["You have left the empty Title field: " + MSG],
   ["\"no title\" shows in the Description box."],
   ["The window stays open and the line is not saved.", MSG, "The Description box still holds \"no title\"."]],
  ["S1-R6", "S1-R7"], design=MAIN,
  claude=["Product asked (answer 7, 14 Oct) for a bug if the message shows only after a blocked save. The developer's 19 Oct note says "
          "the build now shows it on leaving the field. 28 Oct: the QA lead approved filing it; it is filed only after two reproductions on "
          "the QA build (Rule 94), and then this case gets the EXPECT FAIL marker."])

C("S1-03b", "S1", "Leaving the Title empty shows \"Title is a required field\" under it",
  [ADMIN, WO_OPEN, START_LINES],
  [NEW_LINE, "Press Tab.", "Click the Title box.", 'Type "Replace tie rod".'],
  [["The New Line window opens over work order 1, with the cursor in the empty Title field."],
   ["The cursor leaves the Title field.", MSG, "The label still reads \"Title\", at the top of the box, and the grey prompt \"What are you doing?\" stays inside the box."],
   ["The cursor is back in the Title field and the message is still shown, because Title is still empty."],
   ["\"Replace tie rod\" shows in the Title box.", "The message \"Title is a required field\" is gone, because Title is no longer empty."]],
  ["S1-R6", "S1-R3", DEV_LEAVE], design=MAIN, part_of="S1-03",
  claude=["Split from S1-03 (C154709) for the v14 S1-R6 sentence (SV-10916). Answer 7 of 14 Oct asked for a bug if the build shows "
          "the message only after a blocked save; 28 Oct the QA lead approved filing it after two reproductions (Rule 94). The case "
          "keeps the PRD's expectation."])

C("S1-04", "S1", "New Line keeps its other fields, their order and its three buttons",
  [ADMIN, "Create an open work order for this test, work order 1, so a saved line can be added to it.", CANNED, START_LINES],
  [NEW_LINE, "Type the first three letters of canned line A's name.", "Click canned line A in the list.", SAVE_CLOSE],
  [["The New Line window opens over work order 1.",
    "From top to bottom it shows: the AI SHOPCOACH LINE BUILDER link, Title, Description, Technicians with Add Technician, Labor Rate, Estimated Time and Tech Time.",
    "The buttons at the bottom are Save & Add Part, Save & Add Line and Save & Close.",
    "Only the first two field names (Title and Description) and their grey prompts are new; nothing is added, removed or moved."],
   ["Canned line A is offered in the list."],
   ["The window fills in canned line A's title and description."],
   ["The window closes and work order 1's Lines tab lists a new line with canned line A's title and description, exactly as the canned line holds them."]],
  ["S1-R7", "S1-R3", "FO-6"], design=MAIN_ALL)

C("S1-04b", "S1", "Edit Line keeps its other fields, their order and its buttons",
  [ADMIN, WO_LINE_HAVE, START_LINES],
  [CLICK_LINE1],
  [["The Edit Line window opens for line 1 of work order 1, with no canned-line picker.",
    "From top to bottom it shows: Title, Description, Status, Technicians with Add Technician, Labor Rate, Estimated Time, Tech Time and the SHOPCOACH LABOR GUIDE link.",
    "The buttons at the bottom are Delete and Save & Close.",
    "Title and Description show line 1's saved title and description, and their labels sit at the top of the boxes."]],
  ["S1-R7", "S1-R1", "S1-R2", "S1-R3"], design=EDIT_ALL, part_of="S1-04")

C("S1-05", "S1", "Edit Line will not save an emptied Title and says it is required",
  [ADMIN, wo_line(), START_LINES],
  [CLICK_LINE1, "Delete all the text in the Title box.", "Press Tab.", SAVE_CLOSE, "Close the Edit Line window without saving."],
  [["The Edit Line window opens; Title shows \"Replace tie rod\" and Description shows \"excessive play\"."],
   ["The Title box is empty; the label \"Title\" stays at the top of the box and the grey prompt \"What are you doing?\" shows."],
   [MSG],
   ["The window stays open and the change is not saved.", "\"Title is a required field\" still shows under the Title box."],
   ["The window closes.", "Work order 1's Lines tab still lists line 1 as \"Replace tie rod\" with \"excessive play\": nothing was changed."]],
  ["S1-R6", "S1-R7", "S1-R3", ("JIRA", "SV-10130, Nemanja Djuric, 19 Oct 2026 (QA update, PRD v14)",
                               "Edit Line: clear the Title and tab away. The same message shows. Close without saving: the line is unchanged.")],
  design=EDIT)

C("S1-06", "S1", "A line saved before this change opens with the same title and description",
  [ADMIN, "Have a work order made before this release, work order 1, with a line, line 1, that has a title and a description.", START_LINES],
  [CLICK_LINE1],
  [["The Edit Line window opens for line 1.",
    "The Title box shows exactly the title line 1 shows on work order 1's Lines tab, character for character, under the label \"Title\".",
    "The Description box shows exactly line 1's description, under the label \"Description\".",
    "Neither value has \"What are you doing?\", \"Why are you doing it?\" or any other words added in front of it."]],
  ["S1-N1", "S1-R7", "FO-6"], design=EDIT,
  claude=["Any work order created before the What/Why build reached the environment (on staging, any work order older than 23 Oct 2026, "
          "when SV-10130 was merged to staging; the QA used S2-17358 line 1 on sv10130)."])

C("S1-07", "S1", "Edit Line names its fields Title and Description and prompts when emptied",
  [ADMIN, wo_line(), START_LINES],
  [CLICK_LINE1, "Delete all the text in the Description box.", "Delete all the text in the Title box."],
  [["The Edit Line window opens for line 1 of work order 1.", "The first field is labeled exactly \"Title\", with no asterisk, at the top of the box, and shows \"Replace tie rod\".",
    "The second field is labeled exactly \"Description\", at the top of the box, and shows \"excessive play\"."],
   ["The label still reads \"Description\", at the top of the box.", DESC_PROMPT],
   ["The label still reads \"Title\", at the top of the box.", TITLE_PROMPT]],
  ["S1-R1", "S1-R2", "S1-R3", "S1-R4"], design=EDIT)

C("S1-08", "S1", "At phone width the line window shows the same Title and Description words",
  [ADMIN, WO_LINE_HAVE, "Use a phone, or a desktop browser window narrowed to 600 pixels wide or less.", START_LINES],
  [NEW_LINE, "Close the New Line window without saving.", CLICK_LINE1],
  [["The New Line window opens over work order 1.", "The first field reads \"Title\" with the grey prompt \"What are you doing?\" in the box.",
    "The second field reads \"Description\" with the grey prompt \"Why are you doing it?\" in the box."],
   ["The New Line window closes and work order 1's Lines tab shows again."],
   ["The Edit Line window opens for line 1.", "Its fields read \"Title\" and \"Description\" and show line 1's saved title and description."]],
  ["FF-1", "S1-R1", "S1-R2", "S1-R3", ("JIRA", "SV-10130, Nemanja Djuric, 8 Oct 2026 (Ready for QA testing)",
                                         "Phone width (≤ 600px): the same labels, prompts and message.")],
  design=MAIN)

# ---------------------------------------------------------------- 28 Oct 2026 named set (PRD v16, Product answer 9): the Title length message
LONG255 = "0123456789 written 25 times in a row, then 01234 (255 characters; paste it in)"
MSG_LONG = "\"Title cannot be longer than 255 characters\" shows under the Title box (not \"Line name cannot be longer than 255 characters long\")."
DEV_LONG = ("JIRA", "SV-10130, Nemanja Djuric, 19 Oct 2026 (QA update, PRD v14)",
            "New Line and Edit Line: type 256 characters into Title. \"Title cannot be longer than 255 characters\" shows and Save & Close is blocked; delete one character and it clears.")
PO_LONG = PO_ANS[9]

C("S1-09", "S1", "New Line says \"Title cannot be longer than 255 characters\" at 256",
  [ADMIN, "Create an open work order for this test, work order 1, so a saved line can be added to it.", START_LINES],
  [NEW_LINE, "Paste a 255-character title into the Title box: " + LONG255 + ".", 'Type "5" at the end of the title.',
   SAVE_CLOSE, "Press Backspace.", SAVE_CLOSE],
  [["The New Line window opens over work order 1, with an empty Title field."],
   ["The Title box holds the 255 characters, ending in \"01234\".", "No message shows under the Title box."],
   ["The title now has 256 characters, ending in \"012345\".", MSG_LONG],
   ["The window stays open and the line is not saved.", "\"Title cannot be longer than 255 characters\" still shows under the Title box."],
   ["The last \"5\" is removed, so the title has 255 characters again.", "The message under the Title box is gone."],
   ["The window closes.", "Work order 1's Lines tab lists the new line, whose title ends in \"01234\": 255 characters can be saved."]],
  ["S1-R6", DEV_LONG, PO_LONG], design=MAIN,
  claude=["New 28 Oct 2026 (PRD v16 S1-R6, Product answer 9 of 27 Oct). 255-character text: \"0123456789\" * 25 + \"01234\"."])

C("S1-10", "S1", "Edit Line says \"Title cannot be longer than 255 characters\" at 256",
  [ADMIN, wo_line(), START_LINES],
  [CLICK_LINE1, "Delete all the text in the Title box.",
   "Paste a 256-character title into the Title box: 0123456789 written 25 times in a row, then 012345 (256 characters; paste it in).",
   SAVE_CLOSE, "Press Backspace.", "Close the Edit Line window without saving."],
  [["The Edit Line window opens; Title shows \"Replace tie rod\" and Description shows \"excessive play\"."],
   ["The Title box is empty."],
   ["The Title box holds the 256 characters, ending in \"012345\".", MSG_LONG],
   ["The window stays open and the change is not saved.", "\"Title cannot be longer than 255 characters\" still shows under the Title box."],
   ["The last \"5\" is removed, so the title has 255 characters.", "The message \"Title cannot be longer than 255 characters\" is gone."],
   ["The window closes.", "Work order 1's Lines tab still lists line 1 as \"Replace tie rod\" with \"excessive play\": nothing was changed."]],
  ["S1-R6", "S1-R7", DEV_LONG, PO_LONG], design=EDIT,
  claude=["New 28 Oct 2026 (PRD v16 S1-R6, Product answer 9 of 27 Oct)."])
