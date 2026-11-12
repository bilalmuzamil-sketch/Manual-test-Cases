"""Questions for Milos Vasic (PO, Internal Work Orders) — points PRD v1.0 does not settle. DRAFT ONLY: nothing is sent (no Google write
by this worker). Each: (slug, the question in plain words, what the sources say (basis), options with the suggested one first, what it
holds). Rendered into PO-QUESTIONS-DRAFT.md. Skill 07 §6 was applied before a row was kept: each question decides a verdict (a case is
held on it), it was checked against every saved source (PRD v1.0 in full, the 28 Jira tickets in full), and the parts a tester can run
without the answer are written as runnable cases. DROPPED lists the points our own sources answer, with the source."""
QUESTIONS = [
 ("modal-text",
  "Internal Work Orders, the window that opens the first time the setting is switched on (\"Which customers are your own company?\"): "
  "which explanation text should it show?",
  'The story text gives the window this text: "... Nothing is picked for you: your location is not always a customer, and the '
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
  'The story text reads: "It closes with a NO CHARGE document instead of an invoice." The message table at the end of the PRD '
  '(section 8) reads: "It closes with a No Charge document instead of an invoice." Our cases check on-screen words letter for letter, so '
  "one of the two would fail. The rest of the window (title, Category, buttons) is tested now.",
  ["(a) \"NO CHARGE document\", as in the story text and as the stamp on the document reads (suggested)",
   "(b) \"No Charge document\", as in the message table",
   "(c) Something else (please say)"],
  "Held: one case (the confirmation's text)."),
 ("internal-estimate-stamp",
  "Internal Work Orders, the estimate of a work order for the shop's OWN company (an internal work order, not a customer's no-charge "
  "one): which stamp does the estimate show, INTERNAL or NO CHARGE?",
  'The story about these work orders says: "The estimate and invoice documents for these work orders show the same and carry the NO CHARGE stamp and, on a no-charge work '
  'order, the line \"Category: [Category]\" under the stamp." The story about Close says the closed document carries "the INTERNAL or NO CHARGE stamp" with the '
  'document block "Internal Work Order [number]" or "No Charge Work Order [number]". So the closed internal document says INTERNAL, but '
  "the estimate sentence names only NO CHARGE for both kinds.",
  ["(a) INTERNAL on an internal work order's estimate, NO CHARGE on a no-charge one, the same as the closed document (suggested)",
   "(b) NO CHARGE on both kinds of estimate, as that estimate sentence reads",
   "(c) Something else (please say)"],
  "Held: one case (the internal work order's estimate)."),
 ("asset-tab-total",
  "Internal Work Orders, the asset's Invoices tab: what should the Total balance cell of a closed internal or no-charge work order "
  "read, \"No Charge\" or \"$0.00\"?",
  'The PRD says "No Charge" twice: "The asset Invoices tab lists the closed work order with status Closed, the badge, Total balance '
  '\"No Charge\" and Discount and Tax rate empty" (story about Close) and the same in the reports story. The developers\' check-list for Close (Jira SV-11976, updated 10 Nov '
  '2026) says: "The asset\'s Invoices tab lists the closed record at $0.00". The rest of the row (status, badge, empty columns, date) is '
  "the same in both and is in the same case, which waits only for this cell.",
  ["(a) \"No Charge\", as the PRD says, the same word the work orders list uses (suggested)",
   "(b) \"$0.00\", as the developers' check-list says",
   "(c) Something else (please say)"],
  "Held: one case (the asset Invoices tab row)."),
 ("work-order-updated",
  "Internal Work Orders, the Open API webhooks: when a work order is converted (to No Charge or back to billable), its category changes, "
  "a line is marked No Charge or billable, or the shop supplies amount changes, is the event work_order.updated sent?",
  'The Open API story says: "Proposed for the API owner to confirm: Convert to No Charge, Convert to Billable and Change category on a work order, Mark '
  'as No Charge, Change category and Mark as Billable on a line, and a change of the shop supplies amount send work_order.updated (defined in '
  'the catalogue today, never emitted) with the work order and its lines in the body; no new event type and no line-level webhook." It is '
  "written as a proposal, so the test cannot pass or fail on it until it is confirmed.",
  ["(a) Yes, as proposed: work_order.updated is sent for each of these changes with the work order and its lines (suggested, so integrations hear about the change)",
   "(b) No: no webhook is sent for these changes in this version",
   "(c) Something else (please say)"],
  "Held: one case (work_order.updated after Convert to No Charge)."),
 ("rate-totals",
  "Internal Work Orders report, the By technician tab: how is the Comeback rate on the TOTALS row worked out?",
  'The reports story defines the rate per technician ("Comeback rate (comeback lines / completed lines)") and says "the totals row counts every line '
  'once", but does not say how the totals row\'s rate is calculated. Example: technician A has 1 comeback in 4 completed lines (25%), '
  "technician B 1 in 1 (100%). Pooled, the shop's rate is 2 ÷ 5 = 40%; an average of the two rates would be 62.5%.",
  ["(a) Pooled: all comeback lines ÷ all completed lines, each line counted once (40% in the example) (suggested: it is the true shop rate and matches \"counts every line once\")",
   "(b) The average of the technicians' rates (62.5% in the example)",
   "(c) The totals row shows no rate"],
  "Held: one case (the totals row's rate)."),
 ("rate-zero",
  "Internal Work Orders report, the By technician tab: what does the Comeback rate show for a technician with comeback lines but NO "
  "completed lines in the date range (so the rate would divide by zero)?",
  'The reports story defines "Comeback rate (comeback lines / completed lines)" and says nothing about zero completed lines. This happens when a '
  "comeback is filed in a month in which the original technician completed nothing (or left the shop).",
  ["(a) A dash or empty cell, not a number (suggested: 0% or 100% would both be misleading)",
   "(b) 0%",
   "(c) Something else (please say)"],
  "Held: one case (the rate with no completed lines)."),
]
QN = {slug: i for i, (slug, *_r) in enumerate(QUESTIONS, 1)}
DROPPED = []
