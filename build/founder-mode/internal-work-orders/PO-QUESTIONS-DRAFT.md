# Internal Work Orders — questions for Milos Vasic (draft, not sent)

Hello sir, a few points in the Internal Work Orders PRD (Final v1.0, 9 Nov 2026) where two of its own sentences, or the PRD and a developers' check-list, say different things, or where it does not say what a screen should show. Each one decides whether a test passes, so the matching test waits for your answer; everything else about the same screens is already written and ready. Pick (a), (b) or (c); (a) is my suggestion each time.

Skill 07 §6 was applied before each row was kept: every question decides a verdict (a case is held on it), every saved source was checked first (PRD v1.0 read in full, all 28 Jira tickets of the epic read in full), and the parts a tester can run without the answer are written as runnable cases. The colour-coded Google Sheet is built from this draft by the coordinator (no Google write by this worker).

## 1. Internal Work Orders, the window that opens the first time the setting is switched on ("Which customers are your own company?"): which explanation text should it show?

**Project:** Internal Work Orders · **Feature:** Internal Work Orders, the window that opens the first time the setting is switched on ("Which customers are your own company?")

**What the PRD says now:** The story text gives the window this text: "... Nothing is picked for you: your location is not always a customer, and the names can differ. Pick one or more, or do it later from the customer page." The message table at the end of the PRD (section 8) gives it without the middle part: "... Nothing is picked for you. Pick one or more, or do it later from the customer page." Everything else about the window is the same in both places and is tested now; only the check of this sentence waits.

**Options:**
- (a) The story's longer text, with "your location is not always a customer, and the names can differ" (suggested: it is the requirement itself, and the table looks shortened)
- (b) The table's shorter text
- (c) Something else (please say)

**Your answer:** 

## 2. Internal Work Orders, the Convert to No Charge confirmation on a customer's work order: should its text name the closing document "NO CHARGE document" (capitals) or "No Charge document"?

**Project:** Internal Work Orders · **Feature:** Internal Work Orders, the Convert to No Charge confirmation on a customer's work order

**What the PRD says now:** The story text reads: "It closes with a NO CHARGE document instead of an invoice." The message table at the end of the PRD (section 8) reads: "It closes with a No Charge document instead of an invoice." Our cases check on-screen words letter for letter, so one of the two would fail. The rest of the window (title, Category, buttons) is tested now.

**Options:**
- (a) "NO CHARGE document", as in the story text and as the stamp on the document reads (suggested)
- (b) "No Charge document", as in the message table
- (c) Something else (please say)

**Your answer:** 

## 3. Internal Work Orders, the estimate of a work order for the shop's OWN company (an internal work order, not a customer's no-charge one): which stamp does the estimate show, INTERNAL or NO CHARGE?

**Project:** Internal Work Orders · **Feature:** Internal Work Orders, the estimate of a work order for the shop's OWN company (an internal work order, not a customer's no-charge one)

**What the PRD says now:** The story about these work orders says: "The estimate and invoice documents for these work orders show the same and carry the NO CHARGE stamp and, on a no-charge work order, the line "Category: [Category]" under the stamp." The story about Close says the closed document carries "the INTERNAL or NO CHARGE stamp" with the document block "Internal Work Order [number]" or "No Charge Work Order [number]". So the closed internal document says INTERNAL, but the estimate sentence names only NO CHARGE for both kinds.

**Options:**
- (a) INTERNAL on an internal work order's estimate, NO CHARGE on a no-charge one, the same as the closed document (suggested)
- (b) NO CHARGE on both kinds of estimate, as that estimate sentence reads
- (c) Something else (please say)

**Your answer:** 

## 4. Internal Work Orders, the asset's Invoices tab: what should the Total balance cell of a closed internal or no-charge work order read, "No Charge" or "$0.00"?

**Project:** Internal Work Orders · **Feature:** Internal Work Orders, the asset's Invoices tab

**What the PRD says now:** The PRD says "No Charge" twice: "The asset Invoices tab lists the closed work order with status Closed, the badge, Total balance "No Charge" and Discount and Tax rate empty" (story about Close) and the same in the reports story. The developers' check-list for Close (Jira SV-11976, updated 10 Nov 2026) says: "The asset's Invoices tab lists the closed record at $0.00". The rest of the row (status, badge, empty columns, date) is the same in both and is in the same case, which waits only for this cell.

**Options:**
- (a) "No Charge", as the PRD says, the same word the work orders list uses (suggested)
- (b) "$0.00", as the developers' check-list says
- (c) Something else (please say)

**Your answer:** 

## 5. Internal Work Orders, the Open API webhooks: when a work order is converted (to No Charge or back to billable), its category changes, a line is marked No Charge or billable, or the shop supplies amount changes, is the event work_order.updated sent?

**Project:** Internal Work Orders · **Feature:** Internal Work Orders, the Open API webhooks

**What the PRD says now:** The Open API story says: "Proposed for the API owner to confirm: Convert to No Charge, Convert to Billable and Change category on a work order, Mark as No Charge, Change category and Mark as Billable on a line, and a change of the shop supplies amount send work_order.updated (defined in the catalogue today, never emitted) with the work order and its lines in the body; no new event type and no line-level webhook." It is written as a proposal, so the test cannot pass or fail on it until it is confirmed.

**Options:**
- (a) Yes, as proposed: work_order.updated is sent for each of these changes with the work order and its lines (suggested, so integrations hear about the change)
- (b) No: no webhook is sent for these changes in this version
- (c) Something else (please say)

**Your answer:** 

## 6. Internal Work Orders report, the By technician tab: how is the Comeback rate on the TOTALS row worked out?

**Project:** Internal Work Orders · **Feature:** Internal Work Orders report, the By technician tab

**What the PRD says now:** The reports story defines the rate per technician ("Comeback rate (comeback lines / completed lines)") and says "the totals row counts every line once", but does not say how the totals row's rate is calculated. Example: technician A has 1 comeback in 4 completed lines (25%), technician B 1 in 1 (100%). Pooled, the shop's rate is 2 ÷ 5 = 40%; an average of the two rates would be 62.5%.

**Options:**
- (a) Pooled: all comeback lines ÷ all completed lines, each line counted once (40% in the example) (suggested: it is the true shop rate and matches "counts every line once")
- (b) The average of the technicians' rates (62.5% in the example)
- (c) The totals row shows no rate

**Your answer:** 

## 7. Internal Work Orders report, the By technician tab: what does the Comeback rate show for a technician with comeback lines but NO completed lines in the date range (so the rate would divide by zero)?

**Project:** Internal Work Orders · **Feature:** Internal Work Orders report, the By technician tab

**What the PRD says now:** The reports story defines "Comeback rate (comeback lines / completed lines)" and says nothing about zero completed lines. This happens when a comeback is filed in a month in which the original technician completed nothing (or left the shop).

**Options:**
- (a) A dash or empty cell, not a number (suggested: 0% or 100% would both be misleading)
- (b) 0%
- (c) Something else (please say)

**Your answer:** 

## QA-only tab: question → held cases (not shown to the PO)

| # | Slug | Held cases | Folder |
|---|---|---|---|
| 1 | modal-text | S1-02b | WAIT-PO |
| 2 | no-charge-document-case | S2-32b | WAIT-PO |
| 3 | internal-estimate-stamp | S2-28 | WAIT-PO |
| 4 | asset-tab-total | S3-34 | WAIT-PO |
| 5 | work-order-updated | API-23 | BLK |
| 6 | rate-totals | DATA-08 | WAIT-PO |
| 7 | rate-zero | DATA-09 | WAIT-PO |

## QA-only: points considered and not asked (a saved source answers them; not shown to the PO)

- **The Jira stories still use the old names ("No-Charge Work Orders" setting and report, "Reason", two fixed QuickBooks rows, two hub keys)** — PRD v1.0 is the latest source and records each rename itself (Terminology: Reason → Category; Category expense account replaces the two fixed rows of v0.17); every Jira story says "Requirements ... live in the spec". Cases follow PRD v1.0; listed in REPORT.md.
- **§8 Close confirmation row writes "This completes the work order, posts ..."** — An abbreviation of S3-R2's full sentence, which the cases quote; no difference in meaning.
- **S12-N3 ("the line menu offers neither ... the tooltip reads") vs SV-12421 ("disabled with 'Reverse the invoice first.'")** — Same words and same outcome: S12-26 checks that neither action can be used and that the tooltip reads "Reverse the invoice first."
- **SV-12295 "Comeback Expense at the number the hub owner confirms"** — PRD v1.0 S6-R2: 6440 Comeback Expense, confirmed 2026-11-09.
