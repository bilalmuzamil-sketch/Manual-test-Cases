"""Questions for Milos Vasic (PO, Internal Work Orders) — points PRD v1.0 does not settle. DRAFT ONLY: nothing is sent (no Google write
by this worker). Each: (slug, the question in plain words, what the sources say (basis), options with the suggested one first, what it
holds). Rendered into PO-QUESTIONS-DRAFT.md. Skill 07 §6 was applied before a row was kept: each question decides a verdict (a case is
held on it), it was checked against every saved source (PRD v1.0 in full, the 28 Jira tickets in full), and the parts a tester can run
without the answer are written as runnable cases. DROPPED lists the points our own sources answer, with the source."""
QUESTIONS = [
 ("modal-text",
  "Internal Work Orders, the window that opens the first time the setting is switched on (\"Which customers are your own company?\"): "
  "which explanation text should it show?",
  'The story text (S1-R2) gives the window this text: "... Nothing is picked for you: your location is not always a customer, and the '
  'names can differ. Pick one or more, or do it later from the customer page." The message table at the end of the PRD (section 8) gives '
  'it without the middle part: "... Nothing is picked for you. Pick one or more, or do it later from the customer page." Everything else '
  "about the window is the same in both places and is tested now; only the check of this sentence waits.",
  ["(a) The story's longer text, with \"your location is not always a customer, and the names can differ\" (suggested: it is the requirement itself, and the table looks shortened)",
   "(b) The table's shorter text",
   "(c) Something else (please say)"],
  "Held: one case (the window's explanation text)."),
 ("no-charge-document-case",
  "Internal Work Orders, the Convert to No Charge confirmation on a customer's work order: should its text name the closing document "
  "\"NO CHARGE document\" (capitals) or \"No Charge document\"?",
  'The story text (S2-R5) reads: "It closes with a NO CHARGE document instead of an invoice." The message table at the end of the PRD '
  '(section 8) reads: "It closes with a No Charge document instead of an invoice." Our cases check on-screen words letter for letter, so '
  "one of the two would fail. The rest of the window (title, Category, buttons) is tested now.",
  ["(a) \"NO CHARGE document\", as in the story text and as the stamp on the document reads (suggested)",
   "(b) \"No Charge document\", as in the message table",
   "(c) Something else (please say)"],
  "Held: one case (the confirmation's text)."),
 ("internal-estimate-stamp",
  "Internal Work Orders, the estimate of a work order for the shop's OWN company (an internal work order, not a customer's no-charge "
  "one): which stamp does the estimate show, INTERNAL or NO CHARGE?",
  'S2-R4: "The estimate and invoice documents for these work orders show the same and carry the NO CHARGE stamp and, on a no-charge work '
  'order, the line \"Category: [Category]\" under the stamp." S3-R5 (the closed document): "the INTERNAL or NO CHARGE stamp" with the '
  'document block "Internal Work Order [number]" or "No Charge Work Order [number]". So the closed internal document says INTERNAL, but '
  "the estimate sentence names only NO CHARGE for both kinds.",
  ["(a) INTERNAL on an internal work order's estimate, NO CHARGE on a no-charge one, the same as the closed document (suggested)",
   "(b) NO CHARGE on both kinds of estimate, as S2-R4 reads",
   "(c) Something else (please say)"],
  "Held: one case (the internal work order's estimate)."),
 ("asset-tab-total",
  "Internal Work Orders, the asset's Invoices tab: what should the Total balance cell of a closed internal or no-charge work order "
  "read, \"No Charge\" or \"$0.00\"?",
  'The PRD says "No Charge" twice: S3-R6 "The asset Invoices tab lists the closed work order with status Closed, the badge, Total balance '
  '\"No Charge\" and Discount and Tax rate empty" and S9-R10 the same. The developers\' check-list for Close (Jira SV-11976, updated 10 Nov '
  '2026) says: "The asset\'s Invoices tab lists the closed record at $0.00". The rest of the row (status, badge, empty columns, date) is '
  "the same in both and is in the same case, which waits only for this cell.",
  ["(a) \"No Charge\", as the PRD says, the same word the work orders list uses (suggested)",
   "(b) \"$0.00\", as the developers' check-list says",
   "(c) Something else (please say)"],
  "Held: one case (the asset Invoices tab row)."),
]
QN = {slug: i for i, (slug, *_r) in enumerate(QUESTIONS, 1)}
DROPPED = []
