"""Design questions for Chris Ward (PO and design authority), Technician Toggle, from the full design drive of 2 Nov 2026. DRAFT, not
sent: the QA lead sends them. Row shape as the earlier sheets (A/R and A/P questions-2026-10-22/sheet_rows.py, Credit terms
design-2026-10-23/NEW-QUESTIONS.py): [number, topic, question with (a)/(b)/(c), what we know today, where we found it, cases affected].
No Technician Toggle question sheet exists yet (checked 2 Nov 2026: no build/technician-toggle/questions-* folder). The PRD case
worker's questions (build/technician-toggle/authoring/) and these go into ONE sheet for the suite (Rule 131); renumber on merge.

Skill 07 §6 applied first. DROPPED because PRD v17 (or another document we hold) already settles them; each is recorded in
build/technician-toggle/DESIGN-DIVERGENCE-REGISTER.json:
- TT-D03 "Add Labor uses the same list." vs the PRD's "Technician dropdown in the Edit Labor window": S3-R6 and Terminology name the
  window Edit Labor, and the tech plan's component map (line 168) shows the code's AddLabourDialog is "(Edit Labor)". The on-screen title
  comes from the build at verification (Rule 57).
- TT-D05 "Save & Close" vs "the window's existing Save": S1-R6 names the existing button without its label; production already labels it
  Save & Close (before pictures).
- TT-D07 "Lead Technician" (screen) vs "Lead technician" (S3-R7a): S3-R7a itself says "as it does today", and today's label has a capital T.
- TT-D08 demo data (Olivia Garrett leads S2-17528 before, has no lead after, "She was none of those"): S6-R1 (b) and S6-R5 decide release
  day; the boards say the demo data changed between shots.
- TT-D09, TT-D10, TT-D11, TT-D13, TT-D15 captions that summarise a rule more briefly than the PRD (Time Clock route for the column, the
  schedule shift, the five conditions of S3-R1, the 90 days, the time sheet roles): the PRD sentence is explicit and nothing drawn contradicts it.
- TT-D12 straight quotes in a caption: the screenshot shows the PRD's curly quotes.
- TT-D14 "copied from" vs "made from": same meaning.
- Every state the boards do not draw (19 rows TT-N01 … TT-N19: refusal messages, warning text forms, loading, former-lead entries, Edit
  Labor and Edit Line, empty states, pinned columns, Deactivated tab, list error, after the end date, Deactivate Account, API and release
  day): the PRD words are the source; asking for more pictures would not unblock any case.
- "No results" in the Technician filter, the tooltip opening below the toggle, the yellow warning header, the table scrolling sideways at
  1440 px, the TECHNICIAN HOURS section staying in Edit Staff Member: the PRD is silent and the pictures are the source of the look
  (Rule 126.5), or the screen is unchanged production (V2 invariant, Rule 96).
Timing note for the QA lead (not for the sheet): "latest wins" cannot be applied: the canvas version id 1793629882 reads as
2026-11-02 14:31 UTC if it is a time stamp; PRD v17 is dated 2 Nov 2026 with no time of day recorded."""
T = "Technician Toggle: "
DESIGN = "the design canvas \"Technician Toggle\" (https://claude.ai/artifact/1fuPz8Y4xTg7Syq1mfmJ9R)"
BATCH = {"colour": "first batch: choose a colour not used in the new sheet's colour guide",
         "heading": "Questions from reading the design (2 Nov 2026)", "first_row": "to be filled on merge"}
ROWS = [
 [1, T + "turning Time Clock back on in the New Staff Member window",
  "In the New Staff Member window, pick the Technician role and switch Time Clock on: Technician switches on by itself. Now switch Time "
  "Clock off (Technician turns off and grays out) and then on again. What should Technician do?\n"
  "(a) As the spec: it switches on again by itself from the role, unless the user had already switched Technician by hand.\n"
  "(b) As the design's page 3 note: it stays off and the user turns it on.\n"
  "(c) Something else (please say).",
  "The spec says the first (in Edit Staff Member it stays off; in New Staff Member it is set again from the role). The design's page 2 note "
  "agrees with the spec (\"Changing the role or Time Clock sets it again from the role\"), but its page 3 note, under a New Staff Member "
  "picture, says \"Turning Time Clock back on leaves Technician off; the user turns it on.\" and \"Edit behaves the same.\"",
  "Spec: Story 1 (SV-11879), the rules about Time Clock being switched back on and about the role setting Technician for new staff. "
  + DESIGN + ", page \"3 When Technician can't be turned on\", picture \"Time Clock off\"; page \"2 Turn Technician on for a staff member\", "
  "picture \"Technician role picked\".",
  "The spec case for switching Time Clock back on in New Staff Member; held design case DV-01."],
 [2, T + "how a person who is no longer a technician shows on a line in Edit Line",
  "A person was added to a labor line with Add Technician, and later their Technician toggle is turned off. When someone opens that line "
  "in the Edit Line window, how should that person's chip look in Add Technician?\n"
  "(a) As the spec: an ordinary chip, not grayed out, that can be removed with its X (with the lock if they have logged time).\n"
  "(b) As the design's note on the Add Technician picture: grayed out, the same as a deactivated technician today.\n"
  "(c) Something else (please say).",
  "The spec and the story's acceptance criteria say (a) for Edit Line, and grayed out only in the Edit Labor technician list. The design "
  "does not draw the chip; its note under the Add Technician picture says \"Anyone already on a line who is not a technician any more "
  "stays on it and shows grayed out, the same as a deactivated technician today.\"",
  "Spec: Story 3 (SV-11881), the rule about people already on a line. " + DESIGN + ", page \"6 Technician dropdowns on a work order\", "
  "picture \"Add Technician on a line\".",
  "The spec case for the Edit Line chip (DC-27); held design case DV-02."],
 [3, T + "the words of the \"No technicians yet\" empty state on Board View and Tech View",
  "When a location has no technicians, Board View and Tech View show an empty state titled \"No technicians yet\". The spec gives it two "
  "sentences; the ShopView design system the canvas uses says every empty state has at most one sentence. Which should it show?\n"
  "(a) As the spec, both sentences: \"Turn Technician on for your technicians in Staff to assign work orders. Until then, every work "
  "order stays in Unassigned.\"\n"
  "(b) One sentence only (please give the words).\n"
  "(c) The design system's rule does not apply here; keep (a).",
  "The design draws no empty state for this feature. The design system's empty-state rule reads: \"One rule for every empty state in the "
  "product: ONE icon from the set, a title, at most one sentence, and the action that fills it.\" and names \"no technicians yet\" as an "
  "example of a panel empty state. The second empty state in the spec (\"Nothing here yet\") already has one sentence.",
  "Spec: Story 3 (SV-11881), the empty-state rule for Board View and Tech View. Design system \"Shopview Design System\" installed on "
  + DESIGN + " (file ds/shopview/components.css, section EMPTY STATE).",
  "The design case for the \"No technicians yet\" empty state (DC-29) and the spec case for the same state."],
 [4, T + "Save & Add Next in the New Staff Member window",
  "The New Staff Member window has two save buttons, Save & Add Next and Save & Close. After Save & Add Next the window stays open, empty, "
  "for the next person. In that next, empty form, how is Technician set?\n"
  "(a) As if the window had just opened: set from the role again (off with no role), and any earlier switch by hand is forgotten.\n"
  "(b) It keeps the previous person's hand choice until the user changes it.\n"
  "(c) Something else (please say).",
  "The spec says Technician is set from the role \"when the window opens and again each time the role or Time Clock is changed, until the "
  "user switches Technician by hand\", and that \"The toggle as shown is what is saved.\" It names only \"the window's existing Save\" "
  "and does not mention Save & Add Next. The design shows both buttons in every New Staff Member picture. The tickets and the tech plan "
  "do not mention Save & Add Next.",
  "Spec: Story 1 (SV-11879), the rule about how Technician is set for new staff. " + DESIGN + ", page \"2 Turn Technician on for a staff "
  "member\", pictures \"New Staff Member\" and \"Technician role picked\".",
  "The spec cases for saving a new staff member with Save & Add Next (none written yet: to be added once answered)."],
]
