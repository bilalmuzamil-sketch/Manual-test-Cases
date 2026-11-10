# Bill To — questions for Chris Ward

**Sheet built 10 Nov 2026** (QA lead: "Yes please"): https://docs.google.com/spreadsheets/d/1o55Q5O5kFNV1JWcBX2pFZy741A1enT8BomHWzJH_Vi8 — questions 1-15 in the colour-coded layout of the Technician Toggle sheet; the QA lead shares it with Chris Ward. Rows built by `questions-2026-11-10/sheet_rows.py`.

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

## 4. Bill To, from the design: When a work order already bills another customer and you open its Bill To list (for example with Change Bill To), where should the current Bill To appear?

**What the PRD says now:** The spec says "the first option is always "[customer] (this customer)"" and the list is A to Z. The design's page 3 pictures put the current Bill To second; its page 1 pictures (customer windows) keep the current pick in its A to Z place. Where: Spec: Story 3 (SV-12305), the Bill To search rule. the design "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), page "3 When the Bill To is blocked", pictures "Change Bill To" and "Phone, Change Bill To"; page 1, picture "Open" (Edit Customer).

**Options:**

- (a) As the spec: the "(this customer)" row first, then every customer A to Z, the current Bill To in its A to Z place (as the customer windows do).
- (b) As the design: the "(this customer)" row first, the current Bill To second, then the rest A to Z.
- (c) Something else (please say).

**Your answer:** _(blank)_

_QA only (not for the PO): Design question 1 (Bill To: order of the Bill To list on a work order). Cases: D-61 (Design: Bill To list puts the current Bill To second, before A to Z)._

## 5. Bill To, from the design: When someone clicks a Bill To that cannot be changed, the design shows a red message with "Go To Invoice" (or "Open Deposits") AND a "Close" button; people who may not open the Finance or Deposits tab get the red message with only "Close". Which is right?

**What the PRD says now:** The spec names one button ("Go To Invoice" / "Open Deposits") and says the others get the message "with no button"; its section 8 says messages without a button are the standard error message with "Please try to resolve this." that fades after 3 seconds, and messages with a button fade after 10 seconds. Where: Spec: Story 5 (SV-12307), the click rules and the 'no button' rules; section 8 (messages). the design "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), page 3, pictures "Click" (invoiced, deposit, mary.moore) and "Phone, tap".

**Options:**

- (a) As the design: red message, the action button when allowed, plus Close for everyone.
- (b) As the spec: only the action button; people without it get the app's standard error message with the line "Please try to resolve this.", which fades after 3 seconds.
- (c) Something else (please say).

**Your answer:** _(blank)_

_QA only (not for the PO): Design question 2 (Bill To: the Close button on the locked Bill To messages). Cases: S5-02 (Clicking an invoiced Bill To shows an error toast with Go To Invoice), S5-07 (Clicking a deposit-locked Bill To shows an error toast with Open Deposits), D-62 (Design: Bill To lock toasts carry a Close button)._

## 6. Bill To, from the design: The Bill Invoices To window (Change on the customer page) shows "Cancel" and "Save" (and an x). Should Cancel be there?

**What the PRD says now:** The spec says the window has the field and "a "Save" button"; section 8 says buttons are listed as they render. Where: Spec: Story 1 (SV-12303), the window's field and button. the design "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), page 1, picture "Change".

**Options:**

- (a) Yes, keep Cancel and Save as drawn.
- (b) Only Save (and the x), as the spec lists.
- (c) Something else (please say).

**Your answer:** _(blank)_

_QA only (not for the PO): Design question 3 (Bill To: Cancel button in the Bill Invoices To window). Cases: D-63 (Design: Bill Invoices To window has Cancel before Save)._

## 7. Bill To, from the design: In the "Remove as default Bill To" confirmation the design shows "Cancel" then "Remove"; the spec lists "Remove", "Cancel" and says buttons are listed as they render. Which order?

**What the PRD says now:** In the Delete Customer window the spec's order ("Cancel" and "Remove As Default Bill To") matches the picture; only this confirmation differs. Where: Spec: Story 12 (SV-12314), the confirmation rule; section 8, D8 Confirm removal. the design "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), page 6, picture "Remove as default Bill To".

**Options:**

- (a) Cancel, Remove (as drawn).
- (b) Remove, Cancel (as written).
- (c) The order does not matter for testing.

**Your answer:** _(blank)_

_QA only (not for the PO): Design question 4 (Bill To: button order in Remove as default Bill To). Cases: D-64 (Design: Remove as default Bill To shows Cancel before Remove)._

## 8. Bill To, from the design: The spec says the invoice's Bill To block prints the Bill To's name, address and phone. The design's legacy invoices and estimates print the name and address only (no phone), as production's legacy layout does today; the modern layout prints the phone. Which is right for the legacy layout?

**What the PRD says now:** Modern pictures show the Bill To's phone (for example 963-871-9453); legacy pictures show none, before and after. Where: Spec: Story 7 (SV-12309), the Bill To block rule. the design "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), page 4, legacy invoice, estimate, part sale and batch pictures.

**Options:**

- (a) Legacy keeps no phone (as today and as drawn).
- (b) Legacy must add the Bill To's phone.
- (c) Something else (please say).

**Your answer:** _(blank)_

_QA only (not for the PO): Design question 5 (Bill To: phone number on the legacy invoice). Cases: S7-24 (The legacy invoice's Bill To block prints the payer's phone), D-65 (Design: Legacy invoice Bill To block prints no phone)._

## 9. Bill To, from the design: On a desktop work order the design shows a long Bill To name cut at the card's edge with no "..." and no way to see the rest ("Valders Diesel & Fleet Re"). Is that intended?

**What the PRD says now:** The spec says the field reads the Bill To's name. The design's caption on one picture says it reads "Valders Diesel & Fleet Repair" while the picture shows it cut; on the phone and on an invoiced work order the whole name fits. Where: Spec: Story 3 (SV-12305), what the field reads. the design "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), page 2, pictures "Picked" and "S2-17579"; page 3, "Banner".

**Options:**

- (a) Yes, cut it as drawn.
- (b) Show "..." and the full name on hover or tap.
- (c) Wrap the name onto a second line.

**Your answer:** _(blank)_

_QA only (not for the PO): Design question 6 (Bill To: long Bill To names on the work order card). Cases: S3-32 (A long payer name reads in full on the Customer card), D-66 (Design: Long Bill To name is cut at the card edge with no ellipsis)._

## 10. Bill To, from the design: On an asset whose work orders include one billed to someone else, the design adds a Bill To column and, at 1440 pixels, the last columns go past the right edge and the table scrolls sideways. Is that accepted?

**What the PRD says now:** The spec only says when the column shows. Our design checks look for no cut-off columns at 1440 and 1536 pixels. Where: Spec: Story 14 (SV-12316), the Bill To column rule. the design "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), page 7, picture "Work Orders tab, top".

**Options:**

- (a) Yes, sideways scrolling at 1440 is fine.
- (b) No, all columns must fit at 1440 (and 1536) pixels.
- (c) Something else (please say).

**Your answer:** _(blank)_

_QA only (not for the PO): Design question 7 (Bill To: asset Work Orders tab width with the Bill To column). Cases: D-67 (Design: Asset tab with a Bill To column scrolls sideways at 1440)._

## 11. Bill To, from the design: In the design, the tooltip of a locked Bill To appears under the customer card starting at the very left edge of the browser window (over the asset card), and the deposit tooltip is one long line at the bottom left. Is that the intended place?

**What the PRD says now:** The spec says only that the message is the field's tooltip. The "Pays for" tooltip also appears under the card. Where: Spec: Story 5 (SV-12307), the tooltip rules. the design "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), page 3, pictures "Hover" (invoiced and deposit); page 1, "Tooltip".

**Options:**

- (a) Yes, as drawn.
- (b) Next to the Bill To value, wrapped to a normal tooltip width.
- (c) Something else (please say).

**Your answer:** _(blank)_

_QA only (not for the PO): Design question 8 (Bill To: where the locked Bill To tooltips appear). Cases: D-68 (Design: Bill To lock tooltip shows at the window's left edge)._

## 12. Bill To, from the design: When there is no room below, the Bill To and Bill Invoices To lists open upward and run over the app's top bar (and on the work order the list is wider than the card). Is that intended?

**What the PRD says now:** The spec does not say where the list opens; the design's caption says it opens above when there is no room below. Where: Spec: Story 1 (SV-12303) and Story 3 (SV-12305). the design "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), page 1, picture "Change, open"; page 2, "Open"; page 3, "Change Bill To".

**Options:**

- (a) Yes, as drawn.
- (b) The list should stay below the top bar (shorter, scrolling).
- (c) Something else (please say).

**Your answer:** _(blank)_

_QA only (not for the PO): Design question 9 (Bill To: lists that open upward over the top bar). Cases: D-17 (Design: Bill To list opens with this customer first then customers A to Z), D-69 (Design: Bill To list opening upward runs over the app's top bar)._

## 13. Bill To, from the design: The spec says the Bill To's Credit Hold banner is in the work order's page header. The design shows it under the tab bar, above the lines on the Lines tab and above the document on the Finance tab (and above the lines on a phone). Which is right?

**What the PRD says now:** No part sale Credit Hold picture exists (the spec says part sales show it on the Finance tab). Where: Spec: Story 7 (SV-12309), the banner rule. the design "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), page 3, pictures "Banner", "Finance", "Phone".

**Options:**

- (a) As drawn (under the tab bar, on Lines and Finance).
- (b) In the page header above the tabs.
- (c) Something else (please say).

**Your answer:** _(blank)_

_QA only (not for the PO): Design question 10 (Bill To: where the Credit Hold banner sits on a work order). Cases: S7-25 (The payer's Credit Hold banner sits in the work order's page header), D-33 (Design: Credit Hold banner shows on the work order Finance tab), D-35 (Design: Credit Hold banner and Change Bill To work on a phone), D-70 (Design: Work order Credit Hold banner sits under the tab bar)._

## 14. Bill To, from the design: The spec says the asset's Work Orders tab shows a Bill To column when at least one row bills someone else. The design's caption says "because a loaded row bills someone else" and "When no loaded row bills someone else the column is not shown at all". If the tab shows work orders a page at a time, which rows count?

**What the PRD says now:** All rows of the pictured asset are loaded, so the pictures cannot show the difference. Where: Spec: Story 14 (SV-12316). the design "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), page 7, pictures "Work Orders tab, top" and "scrolled".

**Options:**

- (a) Any of the asset's work orders (all pages).
- (b) Only the rows loaded on screen now.
- (c) Something else (please say).

**Your answer:** _(blank)_

_QA only (not for the PO): Design question 11 (Bill To: when the asset tab shows the Bill To column). Cases: S14-13 (The Bill To column shows when the payer's row is on a later page)._

## 15. Bill To, from the design: The spec says what AccountingHub receives keeps its current format and no AccountingHub change is needed. The design's cover says "the version 4 invoice event that carries the Bill To to AccountingHub is not built yet (it needs the AccountingHub owner)". Which is right for this release?

**What the PRD says now:** This decides what the Story 18 cases expect. Where: Spec: Story 18 (SV-12320) and Key Decisions. the design "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), Cover, "What is not shown".

**Options:**

- (a) No AccountingHub change: the invoice arrives under the Bill To in today's format (as the spec).
- (b) A new version 4 invoice event is needed and ships with Bill To.
- (c) Bill To ships first; the AccountingHub part comes later.

**Your answer:** _(blank)_

_QA only (not for the PO): Design question 12 (Bill To: AccountingHub change). Cases: S18-01 (The invoice reaches AccountingHub under the payer), S18-02 (AccountingHub AR and aging group the invoice under the payer), S18-03 (Reverse keeps the reversal in AccountingHub and the new invoice arrives as new), S18-04 (Payments, deposits and credits reach AccountingHub under the payer)._

## Points checked and not asked (our own sources answer them)

- **S12-N1 "Without 'Customers → Create & Edit' and 'View and Manage AP/AR Data'" (one or both missing?)** — Key Decisions, Permissions: "Setting or removing a saved default Bill To needs 'Customers → Create & Edit' and 'View and Manage AP/AR Data'" — both are needed, so missing either hides the button. Cases written for each missing permission.
- **S9-R2 "its first contact A to Z by name" (first name or last name?)** — Not asked: the cases use contacts whose first and last names sort the same way, so the verdict does not depend on it.
- **S7-R5 "everything the Bill To owes" (does it include the invoice being created?)** — Not asked: the Over Credit cases use amounts where both readings give the same answer (already over the limit, or far under it).
- **S12-R5 "open work orders keep their Bill To"** — Not asked: S12-R7 and S12-R8 stop the Delete Customer window whenever the payer is the Bill To on any work order, so this half can never be reached through the window; the confirmation text that says it is checked word for word. Recorded in REPORT.md.
- **M1 "[N] customers" and S5-R6 "the customer holding the largest share"** — Not asked: deposits from two customers on one work order cannot be made through the screens (deposits lock the Bill To); the cases are kept held and listed in NO-MANUAL-PROPOSAL.md.
- **Design question 13: pictures that do not match their own notes (production New Customer toast, a 1600-wide picture, the cut name on S2-17579, "Pays for" 1 after Remove)** — Not asked: no verdict depends on it. The cases follow the PRD and the notes (S3-R2 full name, with the cut name asked in question 9; S1-N4 no counter after Remove); D-01, D-14, D-19 and D-54 each carry a note naming the mismatch so the tester compares the right part of the picture.
