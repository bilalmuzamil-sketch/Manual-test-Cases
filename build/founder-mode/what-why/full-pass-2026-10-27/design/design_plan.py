"""What/Why design-case plan, 27 Oct 2026 (Phase D part 1). DATA ONLY: no case is written here; Phase D part 2 writes
authoring/cases_design.py from this plan. Every backing quote is copied verbatim from PRD 845348896 version 15 (14 Oct 2026),
checked by build_design_outputs.py against the working copy of section 5 and the full page text read on 27 Oct 2026.
Boards: 1.1 New Line - before · 1.2 New Line - after · 1.3 What reaches QuickBooks · 1.4 Edit Line - before ·
1.5 Edit Line - after · 2.1 Awkward inputs · 2.2 The long end (canvas https://claude.ai/artifact/Pz1Q6BfvreYFpQwVQZPTE6)."""

DESIGN_LINK = "https://claude.ai/artifact/Pz1Q6BfvreYFpQwVQZPTE6"

# Verbatim PRD v15 sentences used as backing (code -> sentence). Section 2/3 sentences carry their section as the code.
Q = {
    "S1-R1": 'The first field is labeled exactly "Title", with no asterisk.',
    "S1-R2": 'The second field is labeled exactly "Description".',
    "S1-R3": 'The Title box carries the placeholder "What are you doing?" and the Description box carries "Why are you doing it?". '
             'Placeholder text shows while the box is empty and disappears as soon as there is a value. The labels Title and '
             'Description always sit at the top of their boxes, empty or filled, with the placeholder underneath; in production the '
             'label sat inside the empty box. This is the one layout change in the dialog.',
    "S1-R5": 'The canned-line picker at the top of the dialog is labeled "Title" and carries the placeholder "What are you doing?" in '
             'its typeahead box, the same as the free-text Title field. The dialog focuses this field on open, so the placeholder is '
             'visible the moment the dialog appears and clears as soon as the user types or picks a canned line.',
    "S1-R7": 'Nothing else about the dialog changes, other than the label position in S1-R3: same fields in the same order, same '
             'validation, same values saved.',
    "S2-R1": 'The line builder\'s two text fields are labeled "Title" and "Description".',
    "S2-R2": 'Both carry the same placeholders as S1-R3.',
    "S3-R6": 'A narrative is absent when the value is empty, is made only of spaces, or is the literal placeholder "Tech story '
             'missing."; the three are treated identically, and none reaches QuickBooks. The Edit Line window writes the placeholder '
             'when an existing line with no tech story is saved from it; a line saved from New Line keeps an empty tech story.',
    "S3-R12": 'An imported historical invoice never reaches the live QuickBooks sync, so its line text is unaffected whatever the '
              'import wrote into it.',
    "§2 Out of scope": 'The customer-facing estimate, invoice and credit documents. They have never printed either question and are '
                       'untouched.',
    "§3 narrative label": 'The legacy view prints the narrative as a plain paragraph under the description with no label. The modern '
                          'view prints it under a "Scope of work" heading. Both print the title and the description unlabeled, both '
                          'put the narrative last, and both drop it entirely when it is absent.',
    "§3 placeholder": 'The line dialog writes that literal sentence when nothing was typed. Both invoice views already refuse to show '
                      'it to a customer, and the accounting records should not be the one place it appears.',
    "Form Factor": 'This spec changes two labels and two placeholders inside it and nothing else: the mobile variant shows the same '
                   'words, in the same fields, with no separate design work owed.',
}
# Tech plan "Title and Description — Technical Implementation Plan", 23 Sep 2026 (re-shared 27 Oct, byte-identical). Informs only.
TP = {
    "D5": 'Quasar makes the placeholder transparent on a labeled, non-floated field '
          '(`app/node_modules/quasar/src/components/field/QField.sass:399-403`); without `stack-label` FR-003 silently fails.',
    "FR-006": 'The builder\'s two editors are labelled "Title" / "Description" with the FR-003 placeholders; the '
              'empty-cell fallback text reads "What are you doing?" / "Why are you doing it?" in sentence case (S2-R1, S2-R2).',
    "Phase 3 walk 5": '5. ShopCoach builder: both editors labelled, placeholders visible, empty cells read in sentence case; '
                      '**screenshot the table** — cells must not grow/shift (risk R2).',
}

# Design's own words (board text, verbatim from the board files), quoted under "References from Design".
DW = {
    "1.2 note": 'The field is now named Title and the question moves inside it as the prompt, in sentence case: “What are you doing?”. '
                'Same for Description. The name stays put whether the picker is empty or filled, which replaces a label that swapped '
                'between the question and “Title” depending on state.',
    "1.2 note 2": 'Everything else on this dialog is untouched: the field set, the technician and labor rows, and all three button labels.',
    "1.5 note": 'The floating labels now read Title and Description, so a filled field is named rather than interrogated. The empty '
                'Description still prompts with “Why are you doing it?” in sentence case.',
    "1.5 note 2": 'Status, Technicians, the labor row, the ShopCoach link, Delete and Save & Close are all untouched. Edit mode has no '
                  'canned-line picker, so the state-dependent label S1-R4 removes was a New Line problem only.',
    "1.3 why": 'Because the two invoice views disagree about the label and agree about everything else. Legacy prints the narrative as '
               'a plain paragraph under the description with no label at all. Modern prints it under a “Scope of work” heading. Both '
               'print the title and the description with no labels, both put the narrative last, and both drop it entirely when it is '
               'empty or reads “Tech story missing.” Printing no label is the only choice that matches what a customer sees in either view.',
    "2.1 heading": 'The four flavours of tech story that reach the books',
    "2.1 flavours": 'Imported from a previous system · may be empty',
    "note-case": 'Staging renders the questions in Title Case. The spec and the branch both say sentence case, so the after boards '
                 'read "What are you doing?". That normalisation is not called out in the spec.',
}

# One entry per planned "Design — how it looks" case. existing = live cases that already check part of it (their C-ids).
CASES = [
 dict(key="D-01", board="1.2", title="Design: New Line opens with the Title box ready and its grey prompt",
      pre=["Sign in as an Admin.", "Have an open, not invoiced work order.", "Use a desktop browser at full screen."],
      steps=["Open the work order and go to its Lines tab.", "Click New Line."],
      checks=["The first box fills the dialog width, has a light-grey background and a dark-red line along its bottom edge (board 1.2).",
              "A small dark-red label \"Title\" sits at the top left inside the box, with no star after it.",
              "Under the label, grey text reads \"What are you doing?\": only the W is a capital (not \"What Are You Doing?\").",
              "A grey down-arrow sits at the right end of the box.",
              "The cursor is already in this box: you can type without clicking it (control: typing a letter replaces the grey prompt)."],
      backing=["S1-R1", "S1-R3", "S1-R5"], design=["1.2 note", "note-case"], existing=["C154707", "C154708"],
      note="The red line and grey fill are the focused field as drawn; board 1.1 shows the same box today with the question as its "
           "label, which is the control for 'the label is no longer the question'."),
 dict(key="D-02", board="1.2", title="Design: New Line shows Description above its grey prompt",
      pre=["Sign in as an Admin.", "Have an open, not invoiced work order.", "Use a desktop browser at full screen."],
      steps=["Open the work order and go to its Lines tab.", "Click New Line."],
      checks=["Directly under the Title box is a white box with a thin light-grey border and rounded corners, as wide as the Title box.",
              "A small grey label \"Description\" sits at the top left inside the box.",
              "Under the label, lighter grey text reads \"Why are you doing it?\" (only the W a capital).",
              "The label stays above the prompt; it is not the only text inside the empty box (board 1.1 shows today's box with the "
              "question alone inside it)."],
      backing=["S1-R2", "S1-R3"], design=["1.2 note"], existing=["C154707"]),
 dict(key="D-03", board="1.2", title="Design: New Line keeps its header, other fields and buttons as drawn",
      pre=["Sign in as an Admin.", "Have an open, not invoiced work order.", "Use a desktop browser at full screen."],
      steps=["Open the work order and go to its Lines tab.", "Click New Line."],
      checks=["Header, left to right: \"New Line\" in bold, a small purple \"AI\" tag, blue capitals \"SHOPCOACH LINE BUILDER\"; a grey X at the far right.",
              "Below Description: the word \"Technicians\" above a box reading \"Add Technician\" with a down-arrow.",
              "One row of three boxes: \"Labor Rate\" (widest, with a down-arrow), \"Estimated Time\", \"Tech Time\", each label small and grey at the top.",
              "Bottom right, in this order: \"Save & Add Part\" and \"Save & Add Line\" (white with a blue border and blue text), then "
              "\"Save & Close\" (solid blue with white text).",
              "Nothing else is added between these parts (compare with board 1.2 at 100% zoom)."],
      backing=["S1-R7"], design=["1.2 note 2"], existing=["C154710"]),
 dict(key="D-04", board="1.5", title="Design: Edit Line shows Title above the saved title",
      pre=["Sign in as an Admin.", "Have an open, not invoiced work order with a line that has a title and a description."],
      steps=["Open the work order and go to its Lines tab.", "Click the line's title."],
      checks=["The first box is white with a thin light-grey border (no grey fill, no red line: Edit Line has no canned-line picker).",
              "A small grey label \"Title\" sits at the top left inside the box, with no star.",
              "Under it, the saved title in dark text, exactly as saved."],
      backing=["S1-R1", "S1-R3"], design=["1.5 note"], existing=["C549077"]),
 dict(key="D-05", board="1.5", title="Design: Edit Line shows Description above the grey prompt when empty",
      pre=["Sign in as an Admin.", "Have an open, not invoiced work order with a line that has a title and no description."],
      steps=["Open the work order and go to its Lines tab.", "Click the line's title."],
      checks=["The second box shows a small grey label \"Description\" at the top left.",
              "Under it, lighter grey text reads \"Why are you doing it?\" (only the W a capital).",
              "Control: the Title box above shows the saved title in dark text, so the grey prompt shows only in the empty box."],
      backing=["S1-R2", "S1-R3"], design=["1.5 note"], existing=["C549077"]),
 dict(key="D-06", board="1.5", title="Design: Edit Line keeps Status, labor row, link and buttons as drawn",
      pre=["Sign in as an Admin.", "Have an open, not invoiced work order with a line that has a title and a description."],
      steps=["Open the work order and go to its Lines tab.", "Click the line's title."],
      checks=["Header: \"Edit Line\" in bold at the left and a blue X at the far right; no AI tag or ShopCoach link in the header.",
              "Below Description, in order: a \"Status\" box with the line's status and a down-arrow; \"Technicians\" above an \"Add "
              "Technician\" box; one row with \"Labor Rate\", \"Estimated Time\" and \"Tech Time\".",
              "Under the labor row: a purple \"AI\" tag and blue capitals \"SHOPCOACH LABOR GUIDE\".",
              "Bottom right: a red \"Delete\" button, then a solid blue \"Save & Close\" button."],
      backing=["S1-R7"], design=["1.5 note 2"], existing=["C154710"]),
 dict(key="D-07", board="1.2", title="Design: New Line shows every label and button whole at 1440 pixels",
      pre=["Sign in as an Admin.", "Have an open, not invoiced work order.", "Use a desktop browser window exactly 1440 pixels wide, zoom 100%."],
      steps=["Open the work order and go to its Lines tab.", "Click New Line."],
      checks=["\"Title\", \"What are you doing?\", \"Description\" and \"Why are you doing it?\" each show in full, none cut off or covered.",
              "\"SHOPCOACH LINE BUILDER\" shows in full on the header line, and the X stays at the far right.",
              "The three buttons sit on one row, each label in full; no two texts overlap."],
      backing=["S1-R3", "S1-R7"], design=["1.2 note"], existing=[], width=1440),
 dict(key="D-08", board="1.2", title="Design: New Line shows every label and button whole at 1536 pixels",
      pre=["Sign in as an Admin.", "Have an open, not invoiced work order.", "Use a desktop browser window exactly 1536 pixels wide, zoom 100%."],
      steps=["Open the work order and go to its Lines tab.", "Click New Line."],
      checks=["Same checks as at 1440 pixels: both labels and both prompts in full, header in full with X at the far right, three "
              "buttons on one row, no overlap."],
      backing=["S1-R3", "S1-R7"], design=["1.2 note"], existing=[], width=1536),
 dict(key="D-09", board="1.5", title="Design: Edit Line shows every label and button whole at 1440 pixels",
      pre=["Sign in as an Admin.", "Have an open, not invoiced work order with a line that has a title and no description.",
           "Use a desktop browser window exactly 1440 pixels wide, zoom 100%."],
      steps=["Open the work order and go to its Lines tab.", "Click the line's title."],
      checks=["\"Title\" with the saved title, and \"Description\" with \"Why are you doing it?\", each show in full.",
              "\"SHOPCOACH LABOR GUIDE\" shows in full; \"Delete\" and \"Save & Close\" sit on one row; no two texts overlap."],
      backing=["S1-R3", "S1-R7"], design=["1.5 note"], existing=[], width=1440),
 dict(key="D-10", board="1.5", title="Design: Edit Line shows every label and button whole at 1536 pixels",
      pre=["Sign in as an Admin.", "Have an open, not invoiced work order with a line that has a title and no description.",
           "Use a desktop browser window exactly 1536 pixels wide, zoom 100%."],
      steps=["Open the work order and go to its Lines tab.", "Click the line's title."],
      checks=["Same checks as at 1440 pixels."],
      backing=["S1-R3", "S1-R7"], design=["1.5 note"], existing=[], width=1536),
 dict(key="D-11", board="1.3", title="Design: Legacy invoice prints title, description and tech story with no labels",
      pre=["Sign in as an Admin.", "Make sure Settings, Invoice, \"Legacy invoice layout\" is on (screen label to confirm).",
           "Have a new work order with one labor line with a title, a description and a tech story (for example Replace tie rod / "
           "excessive play / Both outer ends worn, replaced and aligned), invoiced after the switch was set."],
      steps=["Open the work order and go to its Finance tab.", "Show the Invoice view."],
      checks=["The line prints its title in bold, the description on the next line, and the tech story on the line after it, as on "
              "board 1.3 \"Legacy invoice\".",
              "No label prints in front of any of the three (no \"Title\", \"Description\", \"Tech Story\" or \"Scope of work\").",
              "No \"What are you doing?\" or \"Why are you doing it?\" appears anywhere on the invoice."],
      backing=["§3 narrative label", "§2 Out of scope"], design=["1.3 why"], existing=[],
      note="Invariant (Rule 96): the invoice documents are out of scope and untouched; the design draws both views."),
 dict(key="D-12", board="1.3", title="Design: Modern invoice prints the tech story under Scope of work",
      pre=["Sign in as an Admin.", "Make sure Settings, Invoice, \"Legacy invoice layout\" is off (screen label to confirm).",
           "Have a new work order with one labor line with a title, a description and a tech story, invoiced after the switch was set."],
      steps=["Open the work order and go to its Finance tab.", "Show the Invoice view."],
      checks=["The line prints its title in bold, then the description, then a small grey capitals heading \"SCOPE OF WORK\", then "
              "the tech story, as on board 1.3 \"Modern invoice\".",
              "No label prints in front of the title or the description."],
      backing=["§3 narrative label", "§2 Out of scope"], design=["1.3 why"], existing=[]),
 dict(key="D-13", board="1.3", title="Design: Legacy invoice leaves out \"Tech story missing.\"",
      pre=["Sign in as an Admin.", "Make sure Settings, Invoice, \"Legacy invoice layout\" is on (screen label to confirm).",
           "Have a new work order with one labor line with a title and a description and no tech story.",
           "Open that line with Edit Line and click Save & Close, so the line holds \"Tech story missing.\"; then invoice the work order."],
      steps=["Open the work order and go to its Finance tab.", "Show the Invoice view."],
      checks=["The line prints its title and description (control: the line is there).",
              "The words \"Tech story missing.\" do not print anywhere on the invoice."],
      backing=["§3 narrative label", "§3 placeholder", "S3-R6"], design=["1.3 why"], existing=[]),
 dict(key="D-14", board="1.3", title="Design: Modern invoice leaves out \"Tech story missing.\"",
      pre=["Sign in as an Admin.", "Make sure Settings, Invoice, \"Legacy invoice layout\" is off (screen label to confirm).",
           "Have a new work order with one labor line with a title and a description and no tech story.",
           "Open that line with Edit Line and click Save & Close, so the line holds \"Tech story missing.\"; then invoice the work order."],
      steps=["Open the work order and go to its Finance tab.", "Show the Invoice view."],
      checks=["The line prints its title and description (control: the line is there).",
              "The words \"Tech story missing.\" do not print anywhere on the invoice."],
      backing=["§3 narrative label", "§3 placeholder", "S3-R6"], design=["1.3 why"], existing=[],
      note="Whether the \"Scope of work\" heading still prints with no tech story is not asserted (no source says); proposed DQ-03."),
 dict(key="D-15", board="2.1", title="Design: An imported invoice line reads title - description in the report",
      pre=["Sign in as an Admin with Invoicing & payments - View.",
           "Have an Invoices import file made from the downloaded template with one Labor row: *Line Title (for example Replace "
           "tie rod), Line Description (for example excessive play), Tech Story empty, imported through Settings, Data Import, Invoices."],
      steps=["Open Export Reports.", "Choose the Customer Invoice report for the imported invoice's date.", "Download the report.",
             "Open the file and find the imported invoice's labor row."],
      checks=["Its ItemDescription reads \"Replace tie rod - excessive play\": title, space, hyphen, space, description, nothing after."],
      backing=["S3-R12"], design=["2.1 heading", "2.1 flavours"], existing=["C549085"], held=True,
      note="HELD design-version case (Rule 130 item 5): board 2.1 lists an imported line among \"the four flavours of tech story "
           "that reach the books\" reading \"Replace tie rod - excessive play\"; the PRD says only that an imported invoice never "
           "reaches the live sync and its text is unaffected whatever the import wrote. Marker: AUTOMATION: HOLD - the design "
           "differs from the PRD, waiting on the PO. Question DQ-01. Not added to the run while held."),
 dict(key="D-16", board="(none: no ShopCoach board)", title="Design: An emptied ShopCoach editor shows its label above the prompt",
      pre=["Sign in as an Admin.", "Have an open, not invoiced work order whose asset has a year, make and model.",
           "Have the ShopCoach line builder show at least one suggested line (Build Lines)."],
      steps=["Click the title cell of the first suggested line.", "Delete all the text in the editor."],
      checks=["The editor shows the label \"Title\" at its top and the grey prompt \"What are you doing?\" underneath, the same "
              "arrangement as the line window's Title box.",
              "Control: before deleting, the label sat above the suggested title."],
      backing=["S2-R1", "S2-R2", "S1-R3"], tp=["D5", "FR-006"], design=[], existing=["C154711", "C549079"],
      note="No design board exists for Story 2 (tech plan: text-only, verified by browser-walk). Build Lines goes through SV-11850 "
           "on staging: if the tester meets that symptom (Build Lines shows nothing), the case takes EXPECT FAIL (SV-11850) per "
           "Phase A's decision."),
 dict(key="D-17", board="(none: no ShopCoach board)", title="Design: ShopCoach table rows keep their size when a cell shows its prompt",
      pre=["Sign in as an Admin.", "Have an open, not invoiced work order whose asset has a year, make and model.",
           "Have the ShopCoach line builder show at least two suggested lines (Build Lines)."],
      steps=["Take a screenshot of the suggestions table.", "Click the description cell of the first suggested line.",
             "Delete all the text in the editor.", "Click outside the table.", "Take a second screenshot of the table."],
      checks=["The emptied cell reads \"Why are you doing it?\" in sentence case.",
              "Side by side, the two screenshots show the same row heights and column widths: no cell grew, shrank or moved."],
      backing=["S2-R2"], tp=["FR-006", "Phase 3 walk 5"], design=[], existing=["C549079"],
      note="Source is the tech plan only (risk R2; also SV-10391's checklist); the PRD and the design are silent on the table. "
           "SV-11850 applies as for D-16. Grey italic (developer note on SV-10131) is not asserted: no source (proposed DQ-02)."),
]
