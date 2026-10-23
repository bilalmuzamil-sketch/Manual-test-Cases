"""Design questions for Chris Ward (PO and design authority), Credit terms, from the full design drive of 23 Oct 2026. DRAFT, not sent:
the QA lead sends them. Row shape as the A/R and A/P sheet (questions-2026-10-22/sheet_rows.py ROWS):
[number, topic, question with (a)/(b)/(c), what we know today, where we found it, cases affected].
No Credit terms question sheet exists yet (checked 23 Oct 2026). The authoring worker's PRD questions (build/credit-terms/authoring/
po_questions.py, 8 questions, none about the design) and these go into ONE sheet for the suite (Rule 131); renumber on merge.

Skill 07 §6 applied first. DROPPED because PRD v3 already settles them (recorded in build/credit-terms/DESIGN-DIVERGENCE-REGISTER.json):
- CT-D06 Over Credit confirmation drawn with a white Cancel (today's is blue): PRD S9-R1 "the existing confirmation shows unchanged" and
  S9-R3 "Wording and buttons are unchanged"; the board's own caption says "The dialog itself does not change." Cases compare with the
  production picture.
- CT-D07 "Over Limit" (today's badge, capital L) vs the PRD's "Over limit": S9-R3 and the S9 Form factor say the existing badge is kept
  and only changes when it appears; cases name the badge as the screen shows it.
- CT-D08 the log-error caption says "Differs from the PRD"; PRD v3 (S12 Error Handling) now says exactly what the picture shows.
- CT-D09 demo-data mismatches (card $0.00 vs Edit $5,000.00; "still warns" card $0.00): the boards say the names and counts are demo
  data; S9-N1 / S9-R1 decide the behaviour.
- CT-D10 the customer dropdown drawing is cut off before "Net 10 (Inactive)": the caption, S5-R7 and the vendor picture agree.
- "Set Limits to $0 and Move" vs the drawn "Set Limits To $0 And Move": S4-R14 itself gives the displayed form.
- Move To dropdown shows no "Default" tag: the PRD asks for the tag only in the customer Credit Terms dropdown (S5-R3); no conflict.
- Tabs drawn with count pills, menus as wide as their items, grey tooltips, all different from the design library's own spec cards:
  the boards state the choice and its reason (production's Inspection Templates tabs; the build); the PRD is silent; the boards are the
  source of the look (Rule 126). Kept only where the boards contradict each other (question 5).
- Every state with no board (toasts, error alerts, list load error, no-match search, phone width, printed long names, unknown-text
  terms): PRD §2 "Design coverage" says they follow the exact text in the PRD.
Timing note for the QA lead (not for the sheet): "latest wins" cannot be applied: PRD v3 is 2026-10-22 17:25 UTC; the canvas version id
1792722751 reads as 2026-10-23 02:32 UTC if it is a time stamp, which is not certain."""
T = "Credit terms: "
DESIGN = "the design canvas \"Default Credit Terms\" (https://claude.ai/artifact/2erYxWz2ffDNcoXzEfu6wf)"
BATCH = {"colour": "first batch: choose a colour not used in the new sheet's colour guide",
         "heading": "Questions from reading the design (23 Oct 2026)", "first_row": "to be filled on merge"}
ROWS = [
 [1, T + "the words in the Due on Receipt info tooltip",
  "On the Credit Terms page, Due on Receipt has an info (i) icon. Hovering it shows a sentence. The design and the spec use different "
  "words for the second half of that sentence. Which words should the tooltip show?\n"
  "(a) As the spec: \"Payment is due on the invoice date. You can charge the invoice to the customer's account instead of taking payment.\"\n"
  "(b) As the design: \"Payment is due on the invoice date, but you can create the invoice without taking payment.\"\n"
  "(c) Something else (please give the exact words).",
  "The spec gives the first wording for this tooltip (and in its summary table). The design draws the tooltip open with the second "
  "wording, and uses the same words on every page of the design. The COD and Credit Hold tooltips match the spec word for word.",
  "Spec: Story 1 (SV-11670), the info-icon tooltip texts; summary table row \"Hover the info icon on Due on Receipt\". " + DESIGN +
  ", page 1 \"List and row menus\", picture \"Info tooltip: Due on Receipt\".",
  "to be filled"],
 [2, T + "the Inactive tab when it is empty",
  "When a shop has no deactivated terms, the Inactive tab shows the line \"No inactive terms\" and its count reads 0. The design keeps the "
  "table's column headings (Name, Due, Customers, Vendors) and shows the line as one row inside the table. The spec says the line shows "
  "\"in place of the table\". Which is right?\n"
  "(a) As the design: the column headings stay and the line sits under them, inside the table.\n"
  "(b) As the spec: no table at all, only the line \"No inactive terms\".\n"
  "(c) Something else (please say).",
  "The words agree. Only whether the column headings stay is different. The design notes say this picture was \"drawn from the rule, "
  "not checked against the build\".",
  "Spec: Story 1 (SV-11670), the empty Inactive tab; summary table row \"Inactive tab is empty\" (\"Inline line in place of the table\"). "
  + DESIGN + ", page 4 \"Everything deactivated and an empty tab\", picture \"A new shop: Inactive tab empty\".",
  "to be filled"],
 [3, T + "the blue explanation line in the New Credit Term window when the name is wrong",
  "In the New Credit Term window, a blue line under the options explains the term while the number is valid (for example \"Net 14 Days "
  "means payment is due 14 days after the invoice date. An invoice dated Oct 21 is due Nov 4.\"). Suppose the user types a valid number "
  "but a name that is not allowed, for example \"net 30\" (already a standard term). Should the blue line show?\n"
  "(a) Yes, as the spec: the line depends only on the number; the name error shows under the Name at the same time.\n"
  "(b) No, as the design note says: \"No sentence shows while a field is invalid.\"\n"
  "(c) Something else (please say).",
  "The spec says the line shows while the chosen box holds a valid number and disappears while the number is invalid. The design's note "
  "says no sentence shows while any field is invalid. The design's picture cannot decide it, because both the name and the number are "
  "wrong in it.",
  "Spec: Story 3 (SV-11672), the blue information line. " + DESIGN + ", page 3 \"New credit term and Inactive tab\", picture \"Validation "
  "errors\" and its note.",
  "to be filled"],
 [4, T + "when the \"Enter a name.\" error first shows in the New Credit Term window",
  "The user opens New Credit Term, clicks into the Name box, types nothing, and clicks somewhere else in the window. Should the error "
  "\"Enter a name.\" show?\n"
  "(a) No, as the spec: the name is checked only once the user has typed in it (then each time they leave it) or presses Create.\n"
  "(b) Yes, as the design note can be read: \"Errors show only after a field is touched or Create is pressed\" (clicking in and out "
  "counts as touching).\n"
  "(c) Something else (please say).",
  "The spec says opening the window, or clicking an option or a box before typing a name, never shows a Name error. The design note "
  "says errors show after a field is \"touched\", which could include clicking in and out without typing. Both agree the window opens "
  "with no error.",
  "Spec: Story 3 (SV-11672), when the Name is checked. " + DESIGN + ", page 3, picture \"Validation errors\" and its note.",
  "to be filled"],
 [5, T + "which pictures to follow for the look of the new screens",
  "The design has two kinds of pictures of the same new screens: pictures drawn for the design (marked \"This design\") and pictures taken "
  "from the build (marked \"Build (local …)\"). They look different in a few places: the font; the table headings (small grey in the "
  "drawn pictures, bold black in the build); the Cancel button (white with a grey border, or grey filled); the close × (grey or blue); "
  "the Move To box (outlined with a small arrow, or filled with a solid arrow); ticked boxes in Move Customers (light blue with a blue "
  "tick, or solid blue with a white tick). Testers compare the screen with the pictures, so which should they follow?\n"
  "(a) The drawn \"This design\" pictures, for all of these.\n"
  "(b) The build pictures, for all of these.\n"
  "(c) It differs per item (please say which for each).",
  "Every design note says \"layout, wording and states match the build\". The design system the drawings use says ticked boxes use a light "
  "tint, not solid blue. Nothing about what the screens do is different, only the look.",
  DESIGN + ", page 1 pictures \"Active tab: one table\" and \"Row menu: a standard term\"; page 2 pictures \"Move Customers from COD\" and "
  "\"Move To COD: the $0 line\"; page 1 \"Make Net 30 the default\" and \"Delete Credit Term confirmation\".",
  "to be filled"],
]
if __name__ == "__main__":
    for r in ROWS: print(r[0], r[1])
