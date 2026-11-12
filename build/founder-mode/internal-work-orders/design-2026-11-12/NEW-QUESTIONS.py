"""Design questions for Milos Vasic (PO), Internal Work Orders, from the full design drive of 12 Nov 2026. DRAFT, NOT SENT: the QA lead
sends them. Row shape as the earlier sheets (bill-to/design-2026-11-09/NEW-QUESTIONS.py): [number, topic, question with (a)/(b)/(c) and the
suggested option, what we know today, where we found it, cases affected].

ONE SHEET (Rule 131): the PRD case worker's draft ../PO-QUESTIONS-DRAFT.md already holds questions 1-7 for this feature. These rows go at the
BOTTOM of the same sheet, numbered on from 8, in a colour not used there before (added to the colour guide with the date 12 Nov 2026);
earlier rows and answers are not touched.

Skill 07 §6 applied first. Not asked here:
- IWO-D19 (the stamp and category line on an OPEN internal work order's estimate): already question 3 of the sheet draft. The design draws
  INTERNAL with "Category: General Internal", which is option (a) there. The design's held case DV-02 rides on that answer.
- The design's DC-50 (asset Invoices tab row) waits on question 4 of the sheet draft ("No Charge" or "$0.00"); the design draws "No Charge".
- DROPPED because PRD Final v1.0 settles them (its header: "Where a frame and this text disagree, the text wins"; each row is in
  ../DESIGN-DIVERGENCE-REGISTER.json with the PRD sentence that settles it, and the design case follows the PRD):
  IWO-D01 toggle description (S1-R1) · D02 first hint wording (S1-R3) · D03 no-flagged-customer hint not drawn (S1-R4) · D04 turned-off
  board still named "No-Charge Work Orders" (S1-R1) · D05 turn-on window body and Save enabled with nothing picked (S1-R2) · D06 Edit
  Customer helper and Default internal category select missing on boards 05/08 (S1-R7) · D07 categories page greyed while the setting is
  off (S1-R13: lists stay editable) · D08 column "Internal customers" (S1-R13) · D10 account helper "Not set at any location" (S1-R14) ·
  D11 QuickBooks headers and empty-row hint (S5-R1, S5-R4) · D12 No Charge tooltip hidden on the boards (S2-R2) · D13 asset list covering
  the badge (S2-R1) · D14 orange header drawn only on the phone (S2-R3) · D15 No Charge badge in the Internal style (S2-R3) · D16 internal
  work orders shown with a No Charge badge (TERM, S2-R3) · D17 Rate/Total and a Value column on internal lines (S2-R4) · D18 Close Work
  Order as the header button while lines are open (S3-N2) · D20 "Closed · No Charge" on an internal close (S3-R2) · D21 no-integration
  sentence and posting date (S3-E4, S3-R2) · D22 "No account set for internal work orders" (S3-N4) · D23 old No Charge checkbox behind the
  no-charge close (S2-R5, S2-R3) · D24 no "Original technician:" line (S2-R2, S12-R2) · D25 "to no charge?" letter case (S2-R5) · D26
  "customer's current pricing" (S2-R6, S2-R18, S12-R5, S12-R6) · D27 Reopen button in the header (S4-R1, S2-R9) · D28 alert and toast
  without X (S3 Error Handling) · D30 Reopen body (S4-R2) · D32 "Labor" for Labor hours and the original work order as plain text (S3-R5)
  · D33 note quotes, links and the original line (S12-R6, S2-R18) · D34 vendor-bill window account names (S2-R8) · D35 badge in the
  Customer column (S2-R10) · D36 "List · No Charge" board showing Internal (S2-R14) · D37 Shared screens' old defaults (KD, TERM) · D38
  empty icon slots (S12-R1; a library icon, no verdict) · D39 "Invoice" board drawing the estimate (S12-R7) · D40 states not drawn
  (S12-R5, S12-N3, S2-N4, S2-R9) · D41 Technician Efficiency chip "No-charge work orders" (S9-R3) · D42 "Not in ShopView / no technician"
  for Unassigned (S9-R2, S2-R17) · D43 summary card adding shop supplies into parts cost (S9-R2) · D46 type "Journal Entry" (S7-N3) · D47
  hub held reason (S8-N2) · D48 hub card cut by the frame (S8-R7) · D49 stale Flow 2 description and Flow 6 page name (S12, OOS) · D51
  canvas notes that disagree with their boards (each settled with its board row) · D52 seeding at turn-on (S1-R13, S13-R1) · found in the full
  read of the design library: D53 the library dialog closes on Esc and a backdrop click (S1-R2, S4-R2: do nothing) · D54 the library has no
  loading state (S1-EH to S4-EH: spinner) · D55 the list column reads "Total price" (the PRD names it, does not rename it; Rule 9).
- Every state the boards do not draw (40 not-shown rows in the register: error toasts, the Pick a category message, tooltips, the
  100-category limit, the archived-name refusal, the Mark line as billable confirmation ...): the PRD gives the words; asking for pictures
  would not unblock a case (Rule 130.5: DESIGN-SILENT)."""
T = "Internal Work Orders, "
DESIGN = "the design \"Internal Work Orders · All flows v6\" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo, version 1794484794-2031)"
PRD = "PRD Final v1.0 (9 Nov 2026)"
BATCH = {"colour": "a colour not yet in the sheet's colour guide (add it with the date 12 Nov 2026)",
         "heading": "Questions from reading the design (12 Nov 2026)", "first_row": 8}
ROWS = [
 [8, T + "category helper text on the Internal Work Orders page",
  "Sir, on Administration > Service > Internal Work Orders the design's category texts say the category shows on, and can be changed on, the work order: the New No Charge Category window says \"It shows on the work order, the NO CHARGE document and the Internal Work Orders report.\", the Internal categories tab says \"a work order can change it\", and Edit Customer says the default internal category is \"Preselected on every new work order for this customer; a work order can change it.\" The PRD says the category is not shown on the work order and an internal work order's category is changed on the asset or the customer, never on the work order. Which text should these places show?\n"
  "(a) Text that matches the PRD, for example \"It shows on the NO CHARGE document and the Internal Work Orders report.\" and no \"a work order can change it\" (suggested: the behaviour is settled by the PRD, only the wording is missing)\n"
  "(b) The design's text as drawn\n(c) No helper text in these places",
  "The PRD gives no wording for these helper lines, so it cannot settle them; it does settle the behaviour: \"It is not shown on the work order detail or in lists; the badge is the only mark there.\" (S2-R16) and \"it can be changed on the asset or the customer, never on the work order.\" (S2-R1). On a no-charge work order Change category does change it, until Close.",
  PRD + ", S2-R16, S2-R1. " + DESIGN + ", page \"Flow 0 · Turn it on\", boards \"2a\", \"2c New No Charge Category\", \"11 Edit Customer\"; Happy flow 04, 06; Review 2.1, 2.3.",
  "Design cases DC-06, DC-08, DC-13 (the rest of each screen is tested now) and held case DV-01."],
 [9, T + "the locked note on a closed internal or no-charge work order",
  "Sir, on a closed internal work order the design shows, besides the header line \"Closed on Oct 22, 2026. To change it, reopen it from the Finance tab.\", a second note: \"Closed on Oct 22, 2026 by Admin ShopView\", \"This work order is locked. Reopen it to change lines, hours or parts.\" and \"Reopening returns it from Closed · Internal to Complete.\" Should the build show that note?\n"
  "(a) No: only the header line the PRD gives (suggested: it already says how to change it, and the PRD names nothing else)\n(b) Yes, the header line and the locked note as drawn\n(c) Only the locked note, in place of the header line",
  "The PRD gives one line: \"the header card carries the line \\\"Closed on [posting date]. To change it, reopen it from the Finance tab.\\\"\" (S2-R9). The design's own note for the board says \"then the locked note shows as on any closed work order\", so it may be today's locked note of an invoiced work order.",
  PRD + ", S2-R9. " + DESIGN + ", page \"Flow 3 · Reopen\", boards \"01 Work order · Closed\", \"02 Reopen dialog\"; Happy flow 36, 37.",
  "Design case DC-49 (header line, tested now) and held case DV-03."],
 [10, T + "a message after Reopen Work Order",
  "Sir, after Reopen Work Order the design shows a green message \"Work order S2-34918 reopened\". The PRD gives the Reopen window, the failure message and the result (the work order back to Complete) but no success message. Should one show?\n"
  "(a) Yes, \"Work order [number] reopened\" as drawn (suggested: the app confirms other finished actions the same way)\n(b) No message: the work order simply shows Complete again\n(c) Other wording (please say)",
  "S4-R3: \"sets the work order to Complete with its classification unchanged\"; S4 Error Handling gives only the failure toast \"Could not reopen the work order. Try again.\"",
  PRD + ", S4-R3, S4 Error Handling. " + DESIGN + ", page \"Flow 3 · Reopen\", board \"03 Work order · Complete again\".",
  "Design case DC-48 (tested now) and held case DV-04."],
 [11, T + "empty cells in the Internal Work Orders report",
  "Sir, in the Internal Work Orders report the design leaves the Original work order and Original technician cells blank on a whole internal work order's row (an internal job has no original). The ShopView design library says an empty table cell always shows a dash, \"never an empty cell\", and the asset Invoices tab in the same design uses the dash. Which should the report show?\n"
  "(a) A dash \"—\" in every cell with no value, as the library says (suggested: same as the rest of ShopView's tables)\n(b) A blank cell as drawn\n(c) Something else (please say)",
  "S9-R2 lists the columns but does not say what an empty cell shows; Unassigned is named only for a no-charge job with no original technician.",
  PRD + ", S9-R2. " + DESIGN + ", page \"Flow 4 · Find internal and no-charge work orders\", board \"05 Internal Work Orders report\"; Happy flow 39; Review 7.2. Design library work-orders.jsx (the dash cell).",
  "Design case DC-74 (the rest of the report is tested now) and held case DV-05."],
 [12, T + "work order numbers wrapping in the Internal Work Orders report",
  "Sir, in the Internal Work Orders report the design's table breaks work order numbers over two lines (\"S2-\" above \"34918\") and wraps the dates, at 1280 pixels and still at 1440 and 1536 pixels. Is that accepted, or should numbers and dates stay on one line?\n"
  "(a) Numbers and dates stay on one line at 1440 and 1536 pixels (suggested: a split number is hard to read and to search for)\n(b) Wrapping as drawn is fine\n(c) Something else (please say)",
  "The PRD lists the columns (\"Work order (link)\" first) and says nothing about widths. Our design checks look for nothing cut or broken at 1440 and 1536 pixels.",
  PRD + ", S9-R2. " + DESIGN + ", page \"Flow 4 · Find internal and no-charge work orders\", boards \"05\" and \"06 Internal Work Orders report\"; Happy flow 39, 39b; Review 7.2, 7.5.",
  "Design cases DC-74, DC-75 (1536 step) and held case DV-06."],
 [13, T + "two reviewer remarks left in the design",
  "Sir, the first board of the \"Review · What changed after the CEO review\" page carries two remarks below its visible area: \"Move this tooltip text. It's fine to be just this tag here, which is fine, but let's bring back the explanation a little, just one sentence.\" and \"Badge here, we agree, is not no-charge warranty. It's no charge, just that the badge itself\". Are they decisions the build should follow, or leftovers?\n"
  "(a) Leftovers: the PRD wording stands (suggested: PRD Final v1.0 is newer than the design and its toggle description and badges already read as the PRD says)\n(b) They are decisions (please say what changes)\n(c) Something else (please say)",
  "PRD S1-R1 gives the toggle description in full and S2-R3 says the badge reads \"No Charge\" in a different style from Internal. The remarks are not visible on the canvas; they were found in the board's own file.",
  PRD + ", S1-R1, S2-R3. " + DESIGN + ", page \"Review · What changed after the CEO review\", board \"1.1 · 01 Turn on Internal Work Orders\".",
  "No case depends on it until the answer says something changes (DC-01, DC-25 and DC-55 follow the PRD)."],
]
