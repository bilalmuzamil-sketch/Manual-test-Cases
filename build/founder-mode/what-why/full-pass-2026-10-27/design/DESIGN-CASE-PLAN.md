# What/Why — "Design — how it looks" case plan, 27 Oct 2026 (Phase D part 1, DRAFT)

Design: https://claude.ai/artifact/Pz1Q6BfvreYFpQwVQZPTE6 (re-read 27 Oct 2026; 8 files; only change since 13 Oct: "Title *" → "Title" on New Line - after). Expected looks come from PRD 845348896 v15 (14 Oct 2026) where it has a sentence, otherwise from the named board (Rule 126 point 5); the tech plan (23 Sep 2026) informs. Every backing quote below is checked verbatim by `build_design_outputs.py`. Part 2 writes these in `authoring/cases_design.py` in the QA lead's pattern (Rule 117 fourteenth and fifteenth amendments): plain bullets, one action per step, "Step N:" results, quotes with From: lines, References from Design (board picture attached, board words quoted), AUTOMATION line last. Section: new "Design — how it looks" under What/Why 20437.

**17 cases planned** (1 held design-version case). Boards with a case: 1.2 (D-01, D-02, D-03, D-07, D-08), 1.5 (D-04, D-05, D-06, D-09, D-10), 1.3 (D-11 to D-14), 2.1 (D-15, held). Boards without a look case and why: 1.1 and 1.4 are Before boards (today's screens: used as the control in D-01, D-02, D-04); 2.1's other cards and 2.2 draw line text, not a screen, and every example on them is checked letter for letter by a behaviour case (C549081, C154718, C154713, C154716, C549082, C154717, C549083, C549084), which Phase A must give the board's own example values and cite under References from Design. Every board picture is attached to at least one case: 1.1 → D-01/D-02, 1.4 → D-04, 2.2 → C154717 (Phase A).

## Summary

| Key | Title | Board | Backing | Existing cases that already check part of it |
|---|---|---|---|---|
| D-01 | Design: New Line opens with the Title box ready and its grey prompt | 1.2 | S1-R1, S1-R3, S1-R5 | C154707, C154708 |
| D-02 | Design: New Line shows Description above its grey prompt | 1.2 | S1-R2, S1-R3 | C154707 |
| D-03 | Design: New Line keeps its header, other fields and buttons as drawn | 1.2 | S1-R7 | C154710 |
| D-04 | Design: Edit Line shows Title above the saved title | 1.5 | S1-R1, S1-R3 | C549077 |
| D-05 | Design: Edit Line shows Description above the grey prompt when empty | 1.5 | S1-R2, S1-R3 | C549077 |
| D-06 | Design: Edit Line keeps Status, labor row, link and buttons as drawn | 1.5 | S1-R7 | C154710 |
| D-07 | Design: New Line shows every label and button whole at 1440 pixels | 1.2 | S1-R3, S1-R7 | none |
| D-08 | Design: New Line shows every label and button whole at 1536 pixels | 1.2 | S1-R3, S1-R7 | none |
| D-09 | Design: Edit Line shows every label and button whole at 1440 pixels | 1.5 | S1-R3, S1-R7 | none |
| D-10 | Design: Edit Line shows every label and button whole at 1536 pixels | 1.5 | S1-R3, S1-R7 | none |
| D-11 | Design: Legacy invoice prints title, description and tech story with no labels | 1.3 | §3 narrative label, §2 Out of scope | none |
| D-12 | Design: Modern invoice prints the tech story under Scope of work | 1.3 | §3 narrative label, §2 Out of scope | none |
| D-13 | Design: Legacy invoice leaves out "Tech story missing." | 1.3 | §3 narrative label, §3 placeholder, S3-R6 | none |
| D-14 | Design: Modern invoice leaves out "Tech story missing." | 1.3 | §3 narrative label, §3 placeholder, S3-R6 | none |
| D-15 | Design: An imported invoice line reads title - description in the report | 2.1 | S3-R12 | C549085 · HELD |
| D-16 | Design: An emptied ShopCoach editor shows its label above the prompt | (none: no ShopCoach board) | S2-R1, S2-R2, S1-R3, tech plan D5, tech plan FR-006 | C154711, C549079 |
| D-17 | Design: ShopCoach table rows keep their size when a cell shows its prompt | (none: no ShopCoach board) | S2-R2, tech plan FR-006, tech plan Phase 3 walk 5 | C549079 |

## D-01 · Design: New Line opens with the Title box ready and its grey prompt

- **Board:** 1.2
- **Preconditions (sketch):** Sign in as an Admin. Have an open, not invoiced work order. Use a desktop browser at full screen.
- **Steps (sketch):** 1. Open the work order and go to its Lines tab. 2. Click New Line.
- **What the tester checks:**
  - The first box fills the dialog width, has a light-grey background and a dark-red line along its bottom edge (board 1.2).
  - A small dark-red label "Title" sits at the top left inside the box, with no star after it.
  - Under the label, grey text reads "What are you doing?": only the W is a capital (not "What Are You Doing?").
  - A grey down-arrow sits at the right end of the box.
  - The cursor is already in this box: you can type without clicking it (control: typing a letter replaces the grey prompt).
- **Backing (PRD 845348896 v15, verbatim):**
  - S1-R1: "The first field is labeled exactly "Title", with no asterisk."
  - S1-R3: "The Title box carries the placeholder "What are you doing?" and the Description box carries "Why are you doing it?". Placeholder text shows while the box is empty and disappears as soon as there is a value. The labels Title and Description always sit at the top of their boxes, empty or filled, with the placeholder underneath; in production the label sat inside the empty box. This is the one layout change in the dialog."
  - S1-R5: "The canned-line picker at the top of the dialog is labeled "Title" and carries the placeholder "What are you doing?" in its typeahead box, the same as the free-text Title field. The dialog focuses this field on open, so the placeholder is visible the moment the dialog appears and clears as soon as the user types or picks a canned line."
- **Design's own words (References from Design):**
  - board 1.2: "The field is now named Title and the question moves inside it as the prompt, in sentence case: “What are you doing?”. Same for Description. The name stays put whether the picker is empty or filled, which replaces a label that swapped between the question and “Title” depending on state."
  - board note-case: "Staging renders the questions in Title Case. The spec and the branch both say sentence case, so the after boards read "What are you doing?". That normalisation is not called out in the spec."
- **Existing cases that already check part of it:** C154707, C154708
- **Note:** The red line and grey fill are the focused field as drawn; board 1.1 shows the same box today with the question as its label, which is the control for 'the label is no longer the question'.

## D-02 · Design: New Line shows Description above its grey prompt

- **Board:** 1.2
- **Preconditions (sketch):** Sign in as an Admin. Have an open, not invoiced work order. Use a desktop browser at full screen.
- **Steps (sketch):** 1. Open the work order and go to its Lines tab. 2. Click New Line.
- **What the tester checks:**
  - Directly under the Title box is a white box with a thin light-grey border and rounded corners, as wide as the Title box.
  - A small grey label "Description" sits at the top left inside the box.
  - Under the label, lighter grey text reads "Why are you doing it?" (only the W a capital).
  - The label stays above the prompt; it is not the only text inside the empty box (board 1.1 shows today's box with the question alone inside it).
- **Backing (PRD 845348896 v15, verbatim):**
  - S1-R2: "The second field is labeled exactly "Description"."
  - S1-R3: "The Title box carries the placeholder "What are you doing?" and the Description box carries "Why are you doing it?". Placeholder text shows while the box is empty and disappears as soon as there is a value. The labels Title and Description always sit at the top of their boxes, empty or filled, with the placeholder underneath; in production the label sat inside the empty box. This is the one layout change in the dialog."
- **Design's own words (References from Design):**
  - board 1.2: "The field is now named Title and the question moves inside it as the prompt, in sentence case: “What are you doing?”. Same for Description. The name stays put whether the picker is empty or filled, which replaces a label that swapped between the question and “Title” depending on state."
- **Existing cases that already check part of it:** C154707

## D-03 · Design: New Line keeps its header, other fields and buttons as drawn

- **Board:** 1.2
- **Preconditions (sketch):** Sign in as an Admin. Have an open, not invoiced work order. Use a desktop browser at full screen.
- **Steps (sketch):** 1. Open the work order and go to its Lines tab. 2. Click New Line.
- **What the tester checks:**
  - Header, left to right: "New Line" in bold, a small purple "AI" tag, blue capitals "SHOPCOACH LINE BUILDER"; a grey X at the far right.
  - Below Description: the word "Technicians" above a box reading "Add Technician" with a down-arrow.
  - One row of three boxes: "Labor Rate" (widest, with a down-arrow), "Estimated Time", "Tech Time", each label small and grey at the top.
  - Bottom right, in this order: "Save & Add Part" and "Save & Add Line" (white with a blue border and blue text), then "Save & Close" (solid blue with white text).
  - Nothing else is added between these parts (compare with board 1.2 at 100% zoom).
- **Backing (PRD 845348896 v15, verbatim):**
  - S1-R7: "Nothing else about the dialog changes, other than the label position in S1-R3: same fields in the same order, same validation, same values saved."
- **Design's own words (References from Design):**
  - board 1.2: "Everything else on this dialog is untouched: the field set, the technician and labor rows, and all three button labels."
- **Existing cases that already check part of it:** C154710

## D-04 · Design: Edit Line shows Title above the saved title

- **Board:** 1.5
- **Preconditions (sketch):** Sign in as an Admin. Have an open, not invoiced work order with a line that has a title and a description.
- **Steps (sketch):** 1. Open the work order and go to its Lines tab. 2. Click the line's title.
- **What the tester checks:**
  - The first box is white with a thin light-grey border (no grey fill, no red line: Edit Line has no canned-line picker).
  - A small grey label "Title" sits at the top left inside the box, with no star.
  - Under it, the saved title in dark text, exactly as saved.
- **Backing (PRD 845348896 v15, verbatim):**
  - S1-R1: "The first field is labeled exactly "Title", with no asterisk."
  - S1-R3: "The Title box carries the placeholder "What are you doing?" and the Description box carries "Why are you doing it?". Placeholder text shows while the box is empty and disappears as soon as there is a value. The labels Title and Description always sit at the top of their boxes, empty or filled, with the placeholder underneath; in production the label sat inside the empty box. This is the one layout change in the dialog."
- **Design's own words (References from Design):**
  - board 1.5: "The floating labels now read Title and Description, so a filled field is named rather than interrogated. The empty Description still prompts with “Why are you doing it?” in sentence case."
- **Existing cases that already check part of it:** C549077

## D-05 · Design: Edit Line shows Description above the grey prompt when empty

- **Board:** 1.5
- **Preconditions (sketch):** Sign in as an Admin. Have an open, not invoiced work order with a line that has a title and no description.
- **Steps (sketch):** 1. Open the work order and go to its Lines tab. 2. Click the line's title.
- **What the tester checks:**
  - The second box shows a small grey label "Description" at the top left.
  - Under it, lighter grey text reads "Why are you doing it?" (only the W a capital).
  - Control: the Title box above shows the saved title in dark text, so the grey prompt shows only in the empty box.
- **Backing (PRD 845348896 v15, verbatim):**
  - S1-R2: "The second field is labeled exactly "Description"."
  - S1-R3: "The Title box carries the placeholder "What are you doing?" and the Description box carries "Why are you doing it?". Placeholder text shows while the box is empty and disappears as soon as there is a value. The labels Title and Description always sit at the top of their boxes, empty or filled, with the placeholder underneath; in production the label sat inside the empty box. This is the one layout change in the dialog."
- **Design's own words (References from Design):**
  - board 1.5: "The floating labels now read Title and Description, so a filled field is named rather than interrogated. The empty Description still prompts with “Why are you doing it?” in sentence case."
- **Existing cases that already check part of it:** C549077

## D-06 · Design: Edit Line keeps Status, labor row, link and buttons as drawn

- **Board:** 1.5
- **Preconditions (sketch):** Sign in as an Admin. Have an open, not invoiced work order with a line that has a title and a description.
- **Steps (sketch):** 1. Open the work order and go to its Lines tab. 2. Click the line's title.
- **What the tester checks:**
  - Header: "Edit Line" in bold at the left and a blue X at the far right; no AI tag or ShopCoach link in the header.
  - Below Description, in order: a "Status" box with the line's status and a down-arrow; "Technicians" above an "Add Technician" box; one row with "Labor Rate", "Estimated Time" and "Tech Time".
  - Under the labor row: a purple "AI" tag and blue capitals "SHOPCOACH LABOR GUIDE".
  - Bottom right: a red "Delete" button, then a solid blue "Save & Close" button.
- **Backing (PRD 845348896 v15, verbatim):**
  - S1-R7: "Nothing else about the dialog changes, other than the label position in S1-R3: same fields in the same order, same validation, same values saved."
- **Design's own words (References from Design):**
  - board 1.5: "Status, Technicians, the labor row, the ShopCoach link, Delete and Save & Close are all untouched. Edit mode has no canned-line picker, so the state-dependent label S1-R4 removes was a New Line problem only."
- **Existing cases that already check part of it:** C154710

## D-07 · Design: New Line shows every label and button whole at 1440 pixels

- **Board:** 1.2 · width 1440 px
- **Preconditions (sketch):** Sign in as an Admin. Have an open, not invoiced work order. Use a desktop browser window exactly 1440 pixels wide, zoom 100%.
- **Steps (sketch):** 1. Open the work order and go to its Lines tab. 2. Click New Line.
- **What the tester checks:**
  - "Title", "What are you doing?", "Description" and "Why are you doing it?" each show in full, none cut off or covered.
  - "SHOPCOACH LINE BUILDER" shows in full on the header line, and the X stays at the far right.
  - The three buttons sit on one row, each label in full; no two texts overlap.
- **Backing (PRD 845348896 v15, verbatim):**
  - S1-R3: "The Title box carries the placeholder "What are you doing?" and the Description box carries "Why are you doing it?". Placeholder text shows while the box is empty and disappears as soon as there is a value. The labels Title and Description always sit at the top of their boxes, empty or filled, with the placeholder underneath; in production the label sat inside the empty box. This is the one layout change in the dialog."
  - S1-R7: "Nothing else about the dialog changes, other than the label position in S1-R3: same fields in the same order, same validation, same values saved."
- **Design's own words (References from Design):**
  - board 1.2: "The field is now named Title and the question moves inside it as the prompt, in sentence case: “What are you doing?”. Same for Description. The name stays put whether the picker is empty or filled, which replaces a label that swapped between the question and “Title” depending on state."
- **Existing cases that already check part of it:** none

## D-08 · Design: New Line shows every label and button whole at 1536 pixels

- **Board:** 1.2 · width 1536 px
- **Preconditions (sketch):** Sign in as an Admin. Have an open, not invoiced work order. Use a desktop browser window exactly 1536 pixels wide, zoom 100%.
- **Steps (sketch):** 1. Open the work order and go to its Lines tab. 2. Click New Line.
- **What the tester checks:**
  - Same checks as at 1440 pixels: both labels and both prompts in full, header in full with X at the far right, three buttons on one row, no overlap.
- **Backing (PRD 845348896 v15, verbatim):**
  - S1-R3: "The Title box carries the placeholder "What are you doing?" and the Description box carries "Why are you doing it?". Placeholder text shows while the box is empty and disappears as soon as there is a value. The labels Title and Description always sit at the top of their boxes, empty or filled, with the placeholder underneath; in production the label sat inside the empty box. This is the one layout change in the dialog."
  - S1-R7: "Nothing else about the dialog changes, other than the label position in S1-R3: same fields in the same order, same validation, same values saved."
- **Design's own words (References from Design):**
  - board 1.2: "The field is now named Title and the question moves inside it as the prompt, in sentence case: “What are you doing?”. Same for Description. The name stays put whether the picker is empty or filled, which replaces a label that swapped between the question and “Title” depending on state."
- **Existing cases that already check part of it:** none

## D-09 · Design: Edit Line shows every label and button whole at 1440 pixels

- **Board:** 1.5 · width 1440 px
- **Preconditions (sketch):** Sign in as an Admin. Have an open, not invoiced work order with a line that has a title and no description. Use a desktop browser window exactly 1440 pixels wide, zoom 100%.
- **Steps (sketch):** 1. Open the work order and go to its Lines tab. 2. Click the line's title.
- **What the tester checks:**
  - "Title" with the saved title, and "Description" with "Why are you doing it?", each show in full.
  - "SHOPCOACH LABOR GUIDE" shows in full; "Delete" and "Save & Close" sit on one row; no two texts overlap.
- **Backing (PRD 845348896 v15, verbatim):**
  - S1-R3: "The Title box carries the placeholder "What are you doing?" and the Description box carries "Why are you doing it?". Placeholder text shows while the box is empty and disappears as soon as there is a value. The labels Title and Description always sit at the top of their boxes, empty or filled, with the placeholder underneath; in production the label sat inside the empty box. This is the one layout change in the dialog."
  - S1-R7: "Nothing else about the dialog changes, other than the label position in S1-R3: same fields in the same order, same validation, same values saved."
- **Design's own words (References from Design):**
  - board 1.5: "The floating labels now read Title and Description, so a filled field is named rather than interrogated. The empty Description still prompts with “Why are you doing it?” in sentence case."
- **Existing cases that already check part of it:** none

## D-10 · Design: Edit Line shows every label and button whole at 1536 pixels

- **Board:** 1.5 · width 1536 px
- **Preconditions (sketch):** Sign in as an Admin. Have an open, not invoiced work order with a line that has a title and no description. Use a desktop browser window exactly 1536 pixels wide, zoom 100%.
- **Steps (sketch):** 1. Open the work order and go to its Lines tab. 2. Click the line's title.
- **What the tester checks:**
  - Same checks as at 1440 pixels.
- **Backing (PRD 845348896 v15, verbatim):**
  - S1-R3: "The Title box carries the placeholder "What are you doing?" and the Description box carries "Why are you doing it?". Placeholder text shows while the box is empty and disappears as soon as there is a value. The labels Title and Description always sit at the top of their boxes, empty or filled, with the placeholder underneath; in production the label sat inside the empty box. This is the one layout change in the dialog."
  - S1-R7: "Nothing else about the dialog changes, other than the label position in S1-R3: same fields in the same order, same validation, same values saved."
- **Design's own words (References from Design):**
  - board 1.5: "The floating labels now read Title and Description, so a filled field is named rather than interrogated. The empty Description still prompts with “Why are you doing it?” in sentence case."
- **Existing cases that already check part of it:** none

## D-11 · Design: Legacy invoice prints title, description and tech story with no labels

- **Board:** 1.3
- **Preconditions (sketch):** Sign in as an Admin. Make sure Settings, Invoice, "Legacy invoice layout" is on (screen label to confirm). Have a new work order with one labor line with a title, a description and a tech story (for example Replace tie rod / excessive play / Both outer ends worn, replaced and aligned), invoiced after the switch was set.
- **Steps (sketch):** 1. Open the work order and go to its Finance tab. 2. Show the Invoice view.
- **What the tester checks:**
  - The line prints its title in bold, the description on the next line, and the tech story on the line after it, as on board 1.3 "Legacy invoice".
  - No label prints in front of any of the three (no "Title", "Description", "Tech Story" or "Scope of work").
  - No "What are you doing?" or "Why are you doing it?" appears anywhere on the invoice.
- **Backing (PRD 845348896 v15, verbatim):**
  - §3 narrative label: "The legacy view prints the narrative as a plain paragraph under the description with no label. The modern view prints it under a "Scope of work" heading. Both print the title and the description unlabeled, both put the narrative last, and both drop it entirely when it is absent."
  - §2 Out of scope: "The customer-facing estimate, invoice and credit documents. They have never printed either question and are untouched."
- **Design's own words (References from Design):**
  - board 1.3: "Because the two invoice views disagree about the label and agree about everything else. Legacy prints the narrative as a plain paragraph under the description with no label at all. Modern prints it under a “Scope of work” heading. Both print the title and the description with no labels, both put the narrative last, and both drop it entirely when it is empty or reads “Tech story missing.” Printing no label is the only choice that matches what a customer sees in either view."
- **Existing cases that already check part of it:** none
- **Note:** Invariant (Rule 96): the invoice documents are out of scope and untouched; the design draws both views.

## D-12 · Design: Modern invoice prints the tech story under Scope of work

- **Board:** 1.3
- **Preconditions (sketch):** Sign in as an Admin. Make sure Settings, Invoice, "Legacy invoice layout" is off (screen label to confirm). Have a new work order with one labor line with a title, a description and a tech story, invoiced after the switch was set.
- **Steps (sketch):** 1. Open the work order and go to its Finance tab. 2. Show the Invoice view.
- **What the tester checks:**
  - The line prints its title in bold, then the description, then a small grey capitals heading "SCOPE OF WORK", then the tech story, as on board 1.3 "Modern invoice".
  - No label prints in front of the title or the description.
- **Backing (PRD 845348896 v15, verbatim):**
  - §3 narrative label: "The legacy view prints the narrative as a plain paragraph under the description with no label. The modern view prints it under a "Scope of work" heading. Both print the title and the description unlabeled, both put the narrative last, and both drop it entirely when it is absent."
  - §2 Out of scope: "The customer-facing estimate, invoice and credit documents. They have never printed either question and are untouched."
- **Design's own words (References from Design):**
  - board 1.3: "Because the two invoice views disagree about the label and agree about everything else. Legacy prints the narrative as a plain paragraph under the description with no label at all. Modern prints it under a “Scope of work” heading. Both print the title and the description with no labels, both put the narrative last, and both drop it entirely when it is empty or reads “Tech story missing.” Printing no label is the only choice that matches what a customer sees in either view."
- **Existing cases that already check part of it:** none

## D-13 · Design: Legacy invoice leaves out "Tech story missing."

- **Board:** 1.3
- **Preconditions (sketch):** Sign in as an Admin. Make sure Settings, Invoice, "Legacy invoice layout" is on (screen label to confirm). Have a new work order with one labor line with a title and a description and no tech story. Open that line with Edit Line and click Save & Close, so the line holds "Tech story missing."; then invoice the work order.
- **Steps (sketch):** 1. Open the work order and go to its Finance tab. 2. Show the Invoice view.
- **What the tester checks:**
  - The line prints its title and description (control: the line is there).
  - The words "Tech story missing." do not print anywhere on the invoice.
- **Backing (PRD 845348896 v15, verbatim):**
  - §3 narrative label: "The legacy view prints the narrative as a plain paragraph under the description with no label. The modern view prints it under a "Scope of work" heading. Both print the title and the description unlabeled, both put the narrative last, and both drop it entirely when it is absent."
  - §3 placeholder: "The line dialog writes that literal sentence when nothing was typed. Both invoice views already refuse to show it to a customer, and the accounting records should not be the one place it appears."
  - S3-R6: "A narrative is absent when the value is empty, is made only of spaces, or is the literal placeholder "Tech story missing."; the three are treated identically, and none reaches QuickBooks. The Edit Line window writes the placeholder when an existing line with no tech story is saved from it; a line saved from New Line keeps an empty tech story."
- **Design's own words (References from Design):**
  - board 1.3: "Because the two invoice views disagree about the label and agree about everything else. Legacy prints the narrative as a plain paragraph under the description with no label at all. Modern prints it under a “Scope of work” heading. Both print the title and the description with no labels, both put the narrative last, and both drop it entirely when it is empty or reads “Tech story missing.” Printing no label is the only choice that matches what a customer sees in either view."
- **Existing cases that already check part of it:** none

## D-14 · Design: Modern invoice leaves out "Tech story missing."

- **Board:** 1.3
- **Preconditions (sketch):** Sign in as an Admin. Make sure Settings, Invoice, "Legacy invoice layout" is off (screen label to confirm). Have a new work order with one labor line with a title and a description and no tech story. Open that line with Edit Line and click Save & Close, so the line holds "Tech story missing."; then invoice the work order.
- **Steps (sketch):** 1. Open the work order and go to its Finance tab. 2. Show the Invoice view.
- **What the tester checks:**
  - The line prints its title and description (control: the line is there).
  - The words "Tech story missing." do not print anywhere on the invoice.
- **Backing (PRD 845348896 v15, verbatim):**
  - §3 narrative label: "The legacy view prints the narrative as a plain paragraph under the description with no label. The modern view prints it under a "Scope of work" heading. Both print the title and the description unlabeled, both put the narrative last, and both drop it entirely when it is absent."
  - §3 placeholder: "The line dialog writes that literal sentence when nothing was typed. Both invoice views already refuse to show it to a customer, and the accounting records should not be the one place it appears."
  - S3-R6: "A narrative is absent when the value is empty, is made only of spaces, or is the literal placeholder "Tech story missing."; the three are treated identically, and none reaches QuickBooks. The Edit Line window writes the placeholder when an existing line with no tech story is saved from it; a line saved from New Line keeps an empty tech story."
- **Design's own words (References from Design):**
  - board 1.3: "Because the two invoice views disagree about the label and agree about everything else. Legacy prints the narrative as a plain paragraph under the description with no label at all. Modern prints it under a “Scope of work” heading. Both print the title and the description with no labels, both put the narrative last, and both drop it entirely when it is empty or reads “Tech story missing.” Printing no label is the only choice that matches what a customer sees in either view."
- **Existing cases that already check part of it:** none
- **Note:** Whether the "Scope of work" heading still prints with no tech story is not asserted (no source says); proposed DQ-03.

## D-15 · Design: An imported invoice line reads title - description in the report

- **Board:** 2.1
- **Preconditions (sketch):** Sign in as an Admin with Invoicing & payments - View. Have an Invoices import file made from the downloaded template with one Labor row: *Line Title (for example Replace tie rod), Line Description (for example excessive play), Tech Story empty, imported through Settings, Data Import, Invoices.
- **Steps (sketch):** 1. Open Export Reports. 2. Choose the Customer Invoice report for the imported invoice's date. 3. Download the report. 4. Open the file and find the imported invoice's labor row.
- **What the tester checks:**
  - Its ItemDescription reads "Replace tie rod - excessive play": title, space, hyphen, space, description, nothing after.
- **Backing (PRD 845348896 v15, verbatim):**
  - S3-R12: "An imported historical invoice never reaches the live QuickBooks sync, so its line text is unaffected whatever the import wrote into it."
- **Design's own words (References from Design):**
  - board 2.1: "The four flavours of tech story that reach the books"
  - board 2.1: "Imported from a previous system · may be empty"
- **Existing cases that already check part of it:** C549085
- **Note:** HELD design-version case (Rule 130 item 5): board 2.1 lists an imported line among "the four flavours of tech story that reach the books" reading "Replace tie rod - excessive play"; the PRD says only that an imported invoice never reaches the live sync and its text is unaffected whatever the import wrote. Marker: AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO. Question DQ-01. Not added to the run while held.
- **Marker:** `AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO` (not added to the run while held)

## D-16 · Design: An emptied ShopCoach editor shows its label above the prompt

- **Board:** (none: no ShopCoach board)
- **Preconditions (sketch):** Sign in as an Admin. Have an open, not invoiced work order whose asset has a year, make and model. Have the ShopCoach line builder show at least one suggested line (Build Lines).
- **Steps (sketch):** 1. Click the title cell of the first suggested line. 2. Delete all the text in the editor.
- **What the tester checks:**
  - The editor shows the label "Title" at its top and the grey prompt "What are you doing?" underneath, the same arrangement as the line window's Title box.
  - Control: before deleting, the label sat above the suggested title.
- **Backing (PRD 845348896 v15, verbatim):**
  - S2-R1: "The line builder's two text fields are labeled "Title" and "Description"."
  - S2-R2: "Both carry the same placeholders as S1-R3."
  - S1-R3: "The Title box carries the placeholder "What are you doing?" and the Description box carries "Why are you doing it?". Placeholder text shows while the box is empty and disappears as soon as there is a value. The labels Title and Description always sit at the top of their boxes, empty or filled, with the placeholder underneath; in production the label sat inside the empty box. This is the one layout change in the dialog."
  - Tech plan 23 Sep 2026, D5: "Quasar makes the placeholder transparent on a labeled, non-floated field (`app/node_modules/quasar/src/components/field/QField.sass:399-403`); without `stack-label` FR-003 silently fails."
  - Tech plan 23 Sep 2026, FR-006: "The builder's two editors are labelled "Title" / "Description" with the FR-003 placeholders; the empty-cell fallback text reads "What are you doing?" / "Why are you doing it?" in sentence case (S2-R1, S2-R2)."
- **Existing cases that already check part of it:** C154711, C549079
- **Note:** No design board exists for Story 2 (tech plan: text-only, verified by browser-walk). Build Lines goes through SV-11850 on staging: if the tester meets that symptom (Build Lines shows nothing), the case takes EXPECT FAIL (SV-11850) per Phase A's decision.

## D-17 · Design: ShopCoach table rows keep their size when a cell shows its prompt

- **Board:** (none: no ShopCoach board)
- **Preconditions (sketch):** Sign in as an Admin. Have an open, not invoiced work order whose asset has a year, make and model. Have the ShopCoach line builder show at least two suggested lines (Build Lines).
- **Steps (sketch):** 1. Take a screenshot of the suggestions table. 2. Click the description cell of the first suggested line. 3. Delete all the text in the editor. 4. Click outside the table. 5. Take a second screenshot of the table.
- **What the tester checks:**
  - The emptied cell reads "Why are you doing it?" in sentence case.
  - Side by side, the two screenshots show the same row heights and column widths: no cell grew, shrank or moved.
- **Backing (PRD 845348896 v15, verbatim):**
  - S2-R2: "Both carry the same placeholders as S1-R3."
  - Tech plan 23 Sep 2026, FR-006: "The builder's two editors are labelled "Title" / "Description" with the FR-003 placeholders; the empty-cell fallback text reads "What are you doing?" / "Why are you doing it?" in sentence case (S2-R1, S2-R2)."
  - Tech plan 23 Sep 2026, Phase 3 walk 5: "5. ShopCoach builder: both editors labelled, placeholders visible, empty cells read in sentence case; **screenshot the table** — cells must not grow/shift (risk R2)."
- **Existing cases that already check part of it:** C549079
- **Note:** Source is the tech plan only (risk R2; also SV-10391's checklist); the PRD and the design are silent on the table. SV-11850 applies as for D-16. Grey italic (developer note on SV-10131) is not asserted: no source (proposed DQ-02).
