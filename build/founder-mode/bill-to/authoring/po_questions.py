"""Questions for Chris Ward (PO, Bill To) — points PRD v0.5 does not settle. DRAFT ONLY: nothing is sent (no Google write by this worker).
Each: (slug, the question in plain words, what the PRD says (basis), options, what it holds). Rendered into PO-QUESTIONS-DRAFT.md.
Skill 07 §6 was applied before a row was kept: each question decides a verdict (a case is held on it), it was checked against every
saved source, and the parts a tester can run without the answer are written as runnable cases. DROPPED lists the points our own
sources answer, with the source."""
QUESTIONS = [
 ("one-of-two-permissions",
  "Bill To, the locked Bill To field on a work order: a user who has only ONE of the two permissions the PRD names clicks a locked Bill "
  "To field. Does the error message show its button (\"Go To Invoice\" or \"Open Deposits\") or not?",
  'S5-N1: "Without \'Invoicing & payments → View\' and \'See Financial Data\', the M4 toast shows with no button." S5-N2: "Without '
  '\'View and Manage AP/AR Data\' and \'Customers → View\', the M1 toast shows with no button." The sentences can be read as "missing '
  'both" or "missing either". (Elsewhere the PRD writes "or" when one missing permission is enough, S1-N2.) The cases for a user who '
  "has neither permission are written and runnable; only the one-of-two cases wait.",
  ["(a) The button needs BOTH permissions: a user missing either one gets the message with no button",
   "(b) The button is hidden only when the user has NEITHER permission: one of the two is enough to see it",
   "(c) Something else (please say)"],
  "Held: four cases (Go To Invoice and Open Deposits, each with only one of the two permissions)."),
 ("invoiced-banner-customer-on-hold",
  "Bill To, the Credit Hold banner on an INVOICED work order billed to someone else: if the work order's own customer is on Credit Hold "
  "(and the payer is not), does the banner show today's \"This customer is on Credit Hold!\" for the customer, or nothing?",
  'S7-N4: "Once invoiced, the banner reads as today." Today the banner describes the work order\'s customer. S7-N1: "The customer\'s own '
  'Credit Hold does not block when someone else is billed." S7-R11: "The work order\'s Credit Hold and Over Limit badges describe the '
  'Bill To." The PRD does not say whose Credit Hold the banner on an invoiced work order describes when the two customers differ.',
  ["(a) It shows today's banner for the customer (\"This customer is on Credit Hold!\"), because an invoiced work order reads as today",
   "(b) It shows nothing, because the customer's Credit Hold does not matter when someone else is billed",
   "(c) Something else (please say)"],
  "Held: one case (invoiced work order, customer on Credit Hold, payer not)."),
 ("part-sale-badges",
  "Bill To, the part sale page: when a part sale is billed to someone else, should its Credit Hold and Over Limit badges describe the "
  "payer, as the work order's badges do, or the part sale's own customer, as today?",
  'S7-R11: "The work order\'s Credit Hold and Over Limit badges describe the Bill To." The PRD says this for work orders only and is '
  "silent about the same badges on a part sale (Story 7 puts the part sale's Credit Hold banner on its Finance tab, S7-R6). The banner and "
  "invoicing already follow the payer on part sales, so a badge that kept describing the customer would contradict the banner.",
  ["(a) The payer, the same as on a work order", "(b) The part sale's own customer, as today",
   "(c) Something else (please say)"],
  "Held: one case (part sale billed to a payer on Credit Hold, its customer on COD)."),
]
QN = {slug: i for i, (slug, *_r) in enumerate(QUESTIONS, 1)}

# Points considered and NOT asked, because a saved source answers them (skill 07 §6, step 3)
DROPPED = [
 ("S12-N1 \"Without 'Customers → Create & Edit' and 'View and Manage AP/AR Data'\" (one or both missing?)",
  "Key Decisions, Permissions: \"Setting or removing a saved default Bill To needs 'Customers → Create & Edit' and 'View and Manage AP/AR "
  "Data'\" — both are needed, so missing either hides the button. Cases written for each missing permission."),
 ("S9-R2 \"its first contact A to Z by name\" (first name or last name?)",
  "Not asked: the cases use contacts whose first and last names sort the same way, so the verdict does not depend on it."),
 ("S7-R5 \"everything the Bill To owes\" (does it include the invoice being created?)",
  "Not asked: the Over Credit cases use amounts where both readings give the same answer (already over the limit, or far under it)."),
 ("S12-R5 \"open work orders keep their Bill To\"",
  "Not asked: S12-R7 and S12-R8 stop the Delete Customer window whenever the payer is the Bill To on any work order, so this half can "
  "never be reached through the window; the confirmation text that says it is checked word for word. Recorded in REPORT.md."),
 ("M1 \"[N] customers\" and S5-R6 \"the customer holding the largest share\"",
  "Not asked: deposits from two customers on one work order cannot be made through the screens (deposits lock the Bill To); the cases "
  "are kept held and listed in NO-MANUAL-PROPOSAL.md."),
]

# ---- Round 2 (9 Nov 2026): the design worker's 13 questions (design-2026-11-09/NEW-QUESTIONS.py, rows 1-13), merged after ours as
# questions 4-15 (Rule 131: one sheet per suite). Row 13 (pictures that do not match their own notes) is DROPPED: every case it names
# follows the PRD and the note, so no verdict depends on it (DROPPED below; the four cases carry a note naming the mismatch).
import runpy as _rp, os as _os
_ROWS = _rp.run_path(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..", "design-2026-11-09", "NEW-QUESTIONS.py"))["ROWS"]
DESIGN_SLUGS = {1: "list-order-current-bill-to", 2: "close-button-on-lock-toasts", 3: "cancel-in-bill-invoices-to-window",
                4: "remove-confirmation-button-order", 5: "phone-on-legacy-invoice", 6: "long-bill-to-name-on-card",
                7: "asset-tab-width-with-bill-to-column", 8: "lock-tooltip-position", 9: "lists-opening-over-top-bar",
                10: "credit-hold-banner-place", 11: "asset-tab-loaded-rows", 12: "accountinghub-change"}
for _r in _ROWS:
    if _r[0] not in DESIGN_SLUGS: continue
    _lines = _r[2].split("\n")
    QUESTIONS.append((DESIGN_SLUGS[_r[0]], "Bill To, from the design: " + _lines[0], _r[3] + " Where: " + _r[4],
                      [x for x in _lines[1:] if x.startswith("(")], f"Design question {_r[0]} ({_r[1]})."))
QN = {slug: i for i, (slug, *_r) in enumerate(QUESTIONS, 1)}
DROPPED.append(("Design question 13: pictures that do not match their own notes (production New Customer toast, a 1600-wide picture, the cut "
                "name on S2-17579, \"Pays for\" 1 after Remove)",
                "Not asked: no verdict depends on it. The cases follow the PRD and the notes (S3-R2 full name, with the cut name asked in "
                "question 9; S1-N4 no counter after Remove); D-01, D-14, D-19 and D-54 each carry a note naming the mismatch so the tester "
                "compares the right part of the picture."))
