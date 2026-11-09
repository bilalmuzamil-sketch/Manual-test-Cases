"""Design questions for Chris Ward (PO and design owner), Bill To, from the full design drive of 9 Nov 2026. DRAFT, NOT SENT: the QA
lead sends them. Row shape as the earlier sheets (technician-toggle/design-2026-11-02/NEW-QUESTIONS.py, credit-terms/design-2026-10-23/
NEW-QUESTIONS.py): [number, topic, question with (a)/(b)/(c), what we know today, where we found it, cases affected].
No Bill To question sheet exists yet (checked 9 Nov 2026: no build/founder-mode/bill-to/questions-* folder). The PRD case worker's questions
(build/founder-mode/bill-to/authoring/) and these go into ONE sheet for the suite (Rule 131); renumber on merge.

Skill 07 §6 applied first. DROPPED because PRD v0.5 already settles them (each recorded in build/founder-mode/bill-to/DESIGN-DIVERGENCE-REGISTER.json):
- BT-S01 the delete flow passing through today's "Confirmation" before the "Delete Customer" window, and returning to it after Remove:
  S12-R8 ("Today's delete refusals come first") and S12-R6 ("The user then deletes the customer again.").
- BT-S02 Change Customer staying enabled while a deposit is held: S6-R3.
- BT-S03 the SERVICE FOR band on the Finance tab's on-screen estimate: S8-R6 (estimate).
- BT-S04 phone pictures for desktop-only stories (pages 1 and 6): "Desktop only by rule" sets no phone behaviour; the pictures are a look check only.
- BT-S05 "Pays for" 1 still showing after Remove in the picture: S1-N4 and the caption ("Fixed after these shots"); the picture itself is in question 13.
- BT-S06 no "no results" message in the Bill To list: S3-R4.
- BT-S07 the Customer chip's own words ("All customers are included. Pick one or more to narrow.", "1 selected"): PRD silent, no conflict;
  the design is the source of the look (Rule 126.5).
- Every state the boards do not draw (20 rows BT-N01 … BT-N20: Counter Sale refusals, Address 2 tooltips, M1 variants, Create Invoice
  tooltip and M2 toast, payment refusals, part sale invoice, portal, integrations ...): the PRD words are the source; asking for more
  pictures would not unblock any case (Rule 130.5: DESIGN-SILENT).
Timing note for the QA lead (not for the sheet): the design (created 6 Nov 2026 18:55 UTC) and PRD v0.5 (status 6 Nov, last modified 7 Nov)
are a day apart; PRD v0.5 is pending approval (Mat and Amani), so "latest wins" is not applied: every difference is asked."""
T = "Bill To: "
DESIGN = "the design \"Bill To design\" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd)"
BATCH = {"colour": "first batch: choose a colour not used in the new sheet's colour guide",
         "heading": "Questions from reading the design (9 Nov 2026)", "first_row": "to be filled on merge"}
ROWS = [
 [1, T + "order of the Bill To list on a work order",
  "When a work order already bills another customer and you open its Bill To list (for example with Change Bill To), where should the current Bill To appear?\n"
  "(a) As the spec: the \"(this customer)\" row first, then every customer A to Z, the current Bill To in its A to Z place (as the customer windows do).\n"
  "(b) As the design: the \"(this customer)\" row first, the current Bill To second, then the rest A to Z.\n(c) Something else (please say).",
  "The spec says \"the first option is always \"[customer] (this customer)\"\" and the list is A to Z. The design's page 3 pictures put the current Bill To second; its page 1 pictures (customer windows) keep the current pick in its A to Z place.",
  "Spec: Story 3 (SV-12305), the Bill To search rule. " + DESIGN + ", page \"3 When the Bill To is blocked\", pictures \"Change Bill To\" and \"Phone, Change Bill To\"; page 1, picture \"Open\" (Edit Customer).",
  "Design cases DC-17, DC-34, DV-01 and the case worker's Story 3 list cases."],
 [2, T + "the Close button on the locked Bill To messages",
  "When someone clicks a Bill To that cannot be changed, the design shows a red message with \"Go To Invoice\" (or \"Open Deposits\") AND a \"Close\" button; people who may not open the Finance or Deposits tab get the red message with only \"Close\". Which is right?\n"
  "(a) As the design: red message, the action button when allowed, plus Close for everyone.\n"
  "(b) As the spec: only the action button; people without it get the app's standard error message with the line \"Please try to resolve this.\", which fades after 3 seconds.\n(c) Something else (please say).",
  "The spec names one button (\"Go To Invoice\" / \"Open Deposits\") and says the others get the message \"with no button\"; its section 8 says messages without a button are the standard error message with \"Please try to resolve this.\" that fades after 3 seconds, and messages with a button fade after 10 seconds.",
  "Spec: Story 5 (SV-12307), the click rules and the 'no button' rules; section 8 (messages). " + DESIGN + ", page 3, pictures \"Click\" (invoiced, deposit, mary.moore) and \"Phone, tap\".",
  "DC-27, DC-29, DC-30, DC-31, DV-02 and the case worker's Story 5 cases."],
 [3, T + "Cancel button in the Bill Invoices To window",
  "The Bill Invoices To window (Change on the customer page) shows \"Cancel\" and \"Save\" (and an x). Should Cancel be there?\n(a) Yes, keep Cancel and Save as drawn.\n(b) Only Save (and the x), as the spec lists.\n(c) Something else (please say).",
  "The spec says the window has the field and \"a \"Save\" button\"; section 8 says buttons are listed as they render.",
  "Spec: Story 1 (SV-12303), the window's field and button. " + DESIGN + ", page 1, picture \"Change\".", "DC-09, DV-03."],
 [4, T + "button order in Remove as default Bill To",
  "In the \"Remove as default Bill To\" confirmation the design shows \"Cancel\" then \"Remove\"; the spec lists \"Remove\", \"Cancel\" and says buttons are listed as they render. Which order?\n(a) Cancel, Remove (as drawn).\n(b) Remove, Cancel (as written).\n(c) The order does not matter for testing.",
  "In the Delete Customer window the spec's order (\"Cancel\" and \"Remove As Default Bill To\") matches the picture; only this confirmation differs.",
  "Spec: Story 12 (SV-12314), the confirmation rule; section 8, D8 Confirm removal. " + DESIGN + ", page 6, picture \"Remove as default Bill To\".", "DC-53, DV-04."],
 [5, T + "phone number on the legacy invoice",
  "The spec says the invoice's Bill To block prints the Bill To's name, address and phone. The design's legacy invoices and estimates print the name and address only (no phone), as production's legacy layout does today; the modern layout prints the phone. Which is right for the legacy layout?\n"
  "(a) Legacy keeps no phone (as today and as drawn).\n(b) Legacy must add the Bill To's phone.\n(c) Something else (please say).",
  "Modern pictures show the Bill To's phone (for example 963-871-9453); legacy pictures show none, before and after.",
  "Spec: Story 7 (SV-12309), the Bill To block rule. " + DESIGN + ", page 4, legacy invoice, estimate, part sale and batch pictures.", "DC-36, DC-37, DV-05 and the case worker's Story 7 document cases."],
 [6, T + "long Bill To names on the work order card",
  "On a desktop work order the design shows a long Bill To name cut at the card's edge with no \"...\" and no way to see the rest (\"Valders Diesel & Fleet Re\"). Is that intended?\n(a) Yes, cut it as drawn.\n(b) Show \"...\" and the full name on hover or tap.\n(c) Wrap the name onto a second line.",
  "The spec says the field reads the Bill To's name. The design's caption on one picture says it reads \"Valders Diesel & Fleet Repair\" while the picture shows it cut; on the phone and on an invoiced work order the whole name fits.",
  "Spec: Story 3 (SV-12305), what the field reads. " + DESIGN + ", page 2, pictures \"Picked\" and \"S2-17579\"; page 3, \"Banner\".", "DC-19, DV-06."],
 [7, T + "asset Work Orders tab width with the Bill To column",
  "On an asset whose work orders include one billed to someone else, the design adds a Bill To column and, at 1440 pixels, the last columns go past the right edge and the table scrolls sideways. Is that accepted?\n(a) Yes, sideways scrolling at 1440 is fine.\n(b) No, all columns must fit at 1440 (and 1536) pixels.\n(c) Something else (please say).",
  "The spec only says when the column shows. Our design checks look for no cut-off columns at 1440 and 1536 pixels.",
  "Spec: Story 14 (SV-12316), the Bill To column rule. " + DESIGN + ", page 7, picture \"Work Orders tab, top\".", "DC-59, DV-07."],
 [8, T + "where the locked Bill To tooltips appear",
  "In the design, the tooltip of a locked Bill To appears under the customer card starting at the very left edge of the browser window (over the asset card), and the deposit tooltip is one long line at the bottom left. Is that the intended place?\n(a) Yes, as drawn.\n(b) Next to the Bill To value, wrapped to a normal tooltip width.\n(c) Something else (please say).",
  "The spec says only that the message is the field's tooltip. The \"Pays for\" tooltip also appears under the card.",
  "Spec: Story 5 (SV-12307), the tooltip rules. " + DESIGN + ", page 3, pictures \"Hover\" (invoiced and deposit); page 1, \"Tooltip\".", "DC-26, DC-28, DC-11, DV-08."],
 [9, T + "lists that open upward over the top bar",
  "When there is no room below, the Bill To and Bill Invoices To lists open upward and run over the app's top bar (and on the work order the list is wider than the card). Is that intended?\n(a) Yes, as drawn.\n(b) The list should stay below the top bar (shorter, scrolling).\n(c) Something else (please say).",
  "The spec does not say where the list opens; the design's caption says it opens above when there is no room below.",
  "Spec: Story 1 (SV-12303) and Story 3 (SV-12305). " + DESIGN + ", page 1, picture \"Change, open\"; page 2, \"Open\"; page 3, \"Change Bill To\".", "DC-17, DV-09."],
 [10, T + "where the Credit Hold banner sits on a work order",
  "The spec says the Bill To's Credit Hold banner is in the work order's page header. The design shows it under the tab bar, above the lines on the Lines tab and above the document on the Finance tab (and above the lines on a phone). Which is right?\n(a) As drawn (under the tab bar, on Lines and Finance).\n(b) In the page header above the tabs.\n(c) Something else (please say).",
  "No part sale Credit Hold picture exists (the spec says part sales show it on the Finance tab).",
  "Spec: Story 7 (SV-12309), the banner rule. " + DESIGN + ", page 3, pictures \"Banner\", \"Finance\", \"Phone\".", "DC-32, DC-33, DC-35, DV-10."],
 [11, T + "when the asset tab shows the Bill To column",
  "The spec says the asset's Work Orders tab shows a Bill To column when at least one row bills someone else. The design's caption says \"because a loaded row bills someone else\" and \"When no loaded row bills someone else the column is not shown at all\". If the tab shows work orders a page at a time, which rows count?\n(a) Any of the asset's work orders (all pages).\n(b) Only the rows loaded on screen now.\n(c) Something else (please say).",
  "All rows of the pictured asset are loaded, so the pictures cannot show the difference.",
  "Spec: Story 14 (SV-12316). " + DESIGN + ", page 7, pictures \"Work Orders tab, top\" and \"scrolled\".", "DC-59 and the case worker's Story 14 cases."],
 [12, T + "AccountingHub change",
  "The spec says what AccountingHub receives keeps its current format and no AccountingHub change is needed. The design's cover says \"the version 4 invoice event that carries the Bill To to AccountingHub is not built yet (it needs the AccountingHub owner)\". Which is right for this release?\n(a) No AccountingHub change: the invoice arrives under the Bill To in today's format (as the spec).\n(b) A new version 4 invoice event is needed and ships with Bill To.\n(c) Bill To ships first; the AccountingHub part comes later.",
  "This decides what the Story 18 cases expect.", "Spec: Story 18 (SV-12320) and Key Decisions. " + DESIGN + ", Cover, \"What is not shown\".", "The case worker's Story 18 cases (no design case)."],
 [13, T + "pictures that do not match their notes",
  "A few design pictures do not match their own notes. Please confirm the notes are what you mean (we test the notes and the spec, not the old picture):\n"
  "1. Page 1 \"New Customer\" (production): the note mentions a red \"Oooops! An error occurred\" message and an empty list; the picture shows neither.\n"
  "2. Page 1 \"Edit Customer\" (production, mary.moore): the note says 1440 x 1300; the picture is 1600 x 900 (three mary.moore production pictures are 1600 wide; the cover says only one list board is).\n"
  "3. Page 2 \"S2-17579\": the note says the Bill To reads \"Valders Diesel & Fleet Repair\"; the picture shows \"Valders Diesel & Fleet Re\" (see question 6).\n"
  "4. Page 6 \"After Remove\": the picture still shows \"Pays for\" 1; the note says this was fixed.\n(a) The notes are right.\n(b) A picture is right (say which).\n(c) We will re-shoot.",
  "None of these changes what the spec says; they only affect which picture a tester compares against.",
  DESIGN + ", pages 1, 2 and 6, and the Cover.", "DC-01, DC-14, DC-19, DC-54."],
]
