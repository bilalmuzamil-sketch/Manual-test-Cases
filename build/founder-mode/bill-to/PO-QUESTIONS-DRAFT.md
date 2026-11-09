# Bill To — questions for Chris Ward (DRAFT, not sent)

Project: Bill To (Founder Mode). PRD "Bill To" v0.5 (Confluence 1003585538, pending approval from Mat and Amani). Drafted 9 Nov 2026 by the case worker; **nothing has been sent** (no Google write). The coordinator puts these in the suite's question sheet (colour-coded format, Rule 125/131) and lists them in `build/PO-QUESTIONS-OPEN.md` the moment they are sent (Rule 132).

Skill 07 §6 was applied to every row: each question decides the verdict of a held case, was checked against every saved source (PRD, the 20 tickets, the design captions), and everything a tester can run without the answer is already a runnable case.

## 1. Bill To, the locked Bill To field on a work order: a user who has only ONE of the two permissions the PRD names clicks a locked Bill To field. Does the error message show its button ("Go To Invoice" or "Open Deposits") or not?

**What the PRD says now:** S5-N1: "Without 'Invoicing & payments → View' and 'See Financial Data', the M4 toast shows with no button." S5-N2: "Without 'View and Manage AP/AR Data' and 'Customers → View', the M1 toast shows with no button." The sentences can be read as "missing both" or "missing either". (Elsewhere the PRD writes "or" when one missing permission is enough, S1-N2.) The cases for a user who has neither permission are written and runnable; only the one-of-two cases wait.

**Options:**

- (a) The button needs BOTH permissions: a user missing either one gets the message with no button
- (b) The button is hidden only when the user has NEITHER permission: one of the two is enough to see it
- (c) Something else (please say)

**Your answer:** _(blank)_

_QA only (not for the PO): Held: four cases (Go To Invoice and Open Deposits, each with only one of the two permissions). Cases: S5-16 (With Invoicing View but not See Financial Data the invoiced toast), S5-17 (With See Financial Data but not Invoicing View the invoiced toast), S5-18 (With Customers View but not AP/AR Data the deposit toast), S5-19 (With AP/AR Data but not Customers View the deposit toast)._

## 2. Bill To, the Credit Hold banner on an INVOICED work order billed to someone else: if the work order's own customer is on Credit Hold (and the payer is not), does the banner show today's "This customer is on Credit Hold!" for the customer, or nothing?

**What the PRD says now:** S7-N4: "Once invoiced, the banner reads as today." Today the banner describes the work order's customer. S7-N1: "The customer's own Credit Hold does not block when someone else is billed." S7-R11: "The work order's Credit Hold and Over Limit badges describe the Bill To." The PRD does not say whose Credit Hold the banner on an invoiced work order describes when the two customers differ.

**Options:**

- (a) It shows today's banner for the customer ("This customer is on Credit Hold!"), because an invoiced work order reads as today
- (b) It shows nothing, because the customer's Credit Hold does not matter when someone else is billed
- (c) Something else (please say)

**Your answer:** _(blank)_

_QA only (not for the PO): Held: one case (invoiced work order, customer on Credit Hold, payer not). Cases: S7-22 (Invoiced work order whose customer is on Credit Hold and payer is not)._

## 3. Bill To, the part sale page: when a part sale is billed to someone else, should its Credit Hold and Over Limit badges describe the payer, as the work order's badges do, or the part sale's own customer, as today?

**What the PRD says now:** S7-R11: "The work order's Credit Hold and Over Limit badges describe the Bill To." The PRD says this for work orders only and is silent about the same badges on a part sale (Story 7 puts the part sale's Credit Hold banner on its Finance tab, S7-R6). The banner and invoicing already follow the payer on part sales, so a badge that kept describing the customer would contradict the banner.

**Options:**

- (a) The payer, the same as on a work order
- (b) The part sale's own customer, as today
- (c) Something else (please say)

**Your answer:** _(blank)_

_QA only (not for the PO): Held: one case (part sale billed to a payer on Credit Hold, its customer on COD). Cases: S7-23 (A part sale's Credit Hold badge follows the payer)._

## Points checked and not asked (our own sources answer them)

- **S12-N1 "Without 'Customers → Create & Edit' and 'View and Manage AP/AR Data'" (one or both missing?)** — Key Decisions, Permissions: "Setting or removing a saved default Bill To needs 'Customers → Create & Edit' and 'View and Manage AP/AR Data'" — both are needed, so missing either hides the button. Cases written for each missing permission.
- **The epic SV-12289 lists "AccountingHub change (Hub team)" as a release dependency; PRD Story 18 and Key Decisions say "no AccountingHub change is needed"** — Latest wins (Rule 32): the PRD (last modified 7 Nov 2026, owning PM ruling of 6 Nov 2026) is newer than the epic text (updated 6 Nov 14:25 -0500). Cases follow the PRD; recorded in REPORT.md as a story-vs-PRD difference.
- **S9-R2 "its first contact A to Z by name" (first name or last name?)** — Not asked: the cases use contacts whose first and last names sort the same way, so the verdict does not depend on it.
- **S7-R5 "everything the Bill To owes" (does it include the invoice being created?)** — Not asked: the Over Credit cases use amounts where both readings give the same answer (already over the limit, or far under it).
- **S12-R5 "open work orders keep their Bill To"** — Not asked: S12-R7 and S12-R8 stop the Delete Customer window whenever the payer is the Bill To on any work order, so this half can never be reached through the window; the confirmation text that says it is checked word for word. Recorded in REPORT.md.
- **M1 "[N] customers" and S5-R6 "the customer holding the largest share"** — Not asked: deposits from two customers on one work order cannot be made through the screens (deposits lock the Bill To); the cases are kept held and listed in NO-MANUAL-PROPOSAL.md.
