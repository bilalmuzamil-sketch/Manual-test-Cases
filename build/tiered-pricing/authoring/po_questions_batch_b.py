"""Batch B PO question candidates (Tiered Pricing, owner Matt Barge). NOTHING IS SENT (skill 07, Rules 66, 131). Each candidate passed the eight
checks of skill 07 §6.0 for batch B on 14 Nov 2026 (record in BATCH-B-REPORT.md); the coordinator runs check h on the merged sheet.
Q1 and Q4 are the intake drafts (po_questions.py); batch B holds cases on them but does not redefine them."""
QUESTIONS = {
 "Q40": ("Sales by Tier and Sales by Category: the reports PRD writes active tier rows as number and name (\"2 · Fleet\"), an archived tier's row as its "
         "name with \"(archived)\", and the downloads with tier numbers and \"(archived)\" as on screen (S1-R11, S3-R3, S4-R3). Design 20.2-20.4, 20.9, "
         "20.12-20.13, 20.18 show rows \"Tier 2\", \"Tier 3\" with no number; the Priced By filter (20.5) lists \"Fleet Old\" with no \"(archived)\"; "
         "the CSV (20.20) writes \"Tier 2\". Which is right?"),
 "Q41": ("Sales by Tier and Sales by Category: the Category filter lists \"Uncategorized first, then A to Z\" (reports PRD S3-R9); design 20.7 lists "
         "Uncategorized among the others in A-to-Z order (between \"Tires, Retread\" and \"Wipers\"). Which order?"),
 "Q42": ("Layout moves the design shows with no source settling them (checklist line 10): on Sales by Tier the number columns move right by 58-94 px "
         "when a row or a customer is opened (20.2 → 20.3, 20.4) and left by 20-36 px on the empty states (20.11, 20.21-20.23); on Sales by "
         "Category they move 5-10 px when a category is opened (20.16 → 20.17); the filter chips shift left as a picked chip widens (20.2 → 20.9); "
         "the work order lines table's columns move 19-71 px while the Quick Add row is open (10.5 → 10.6, 10.7, 10.9) and 1-9 px after a part is "
         "added or received (10.8, 11.7). Are these moves intended, or should the columns keep their place?"),
 "Q44": ("Receiving a part: the PRD says \"The receive window says nothing about tiers. Its 6-second notice reads \"Updating the cost also updates the "
         "sell price.\"\" (S11-R15). Design 11.7 shows, after Receive, a toast \"Part received\" / \"$80.00 each, Tier 2.\" (naming the tier) and "
         "no \"Updating the cost also updates the sell price.\" notice. Which does the user see after receiving at a new cost?"),
}
ANSWERED = {}
CANDIDATE = set(QUESTIONS)
