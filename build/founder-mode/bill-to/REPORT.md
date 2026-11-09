# Bill To — case library, rounds 1 and 2 (9 Nov 2026)

Project type (ii) V2 / upgrade (QA lead, 9 Nov 2026). PRD "Bill To" v0.5 (Confluence 1003585538, 6 Nov 2026, pending approval from Mat and Amani, last modified 7 Nov 2026, Chris Ward). Epic SV-12289, stories SV-12303 to SV-12321. No tech plan (QA lead: may come later; the cases are then checked against it, Rule 134). No QA build named. **Nothing was written to TestRail, Jira, Slack or Google; nothing was committed.** Round 2 (after the design drive, commit 1270669c) added the 70 design cases and the References from Design blocks (section 9).

## 1. Counts

- **345 cases**: 286 runnable once a build exists (marker "AUTOMATION: Not available on Build to test Yet - Last checked 11/9/2026", Rule 69), 59 held.
- Held: waiting on the PO 29 · blocked on the Internal Work Orders release (SV-11665) 6 · blocked on the customer portal app release 4 · production around the release 9 · a tester cannot set it up 11 (NO-MANUAL-PROPOSAL.md).
- Gates: `python3 authoring/build.py` → **0 PROBLEM lines**; `tester_readiness_check.py` → **0 hard problems**, 73 "does not / never" results, every one read and each has a control the tester can see (the 18 new design ones by picture comparison or a positive result); random samples read in full: round 1 seed 9 (6 cases: fixed a doubled comma, S12-07 given a search control), round 2 seed 31 (API-07, S3-18, D-46, S19-03, D-61: D-46's generated reason reworded).

| Section (proposed subsection of 132467) | Cases | Held |
|---|---|---|
| S1 — Saved default Bill To on the customer page | 19 | 3 |
| S2 — Bill Invoices To in New Customer and Edit Customer | 16 | 1 |
| S3 — Bill To on the work order and part sale Customer card | 32 | 3 |
| S4 — Authorizer list when someone else pays | 8 | 0 |
| S5 — Locked Bill To - invoiced and deposits | 25 | 7 |
| S6 — Change Customer with a Bill To | 10 | 0 |
| S7 — Invoicing to the Bill To | 25 | 5 |
| S8 — Service For band on invoices and estimates | 15 | 1 |
| S9 — Invoice email to the Bill To | 7 | 1 |
| S10 — Receivables follow the Bill To | 13 | 2 |
| S11 — Reverse and invoice again | 8 | 0 |
| S12 — Deleting a customer that pays for others | 14 | 1 |
| S13 — Work Order Log | 6 | 0 |
| S14 — Asset Work Orders tab - whole history and Customer filter | 13 | 1 |
| S15 — Internal and No Charge work orders | 6 | 6 |
| S16 — Customer portal | 8 | 4 |
| S17 — QuickBooks sync | 8 | 1 |
| S18 — AccountingHub | 5 | 4 |
| S19 — IBS and invoice export | 8 | 2 |
| API — API - Public API Bill To on work orders and invoices | 12 | 0 |
| DATA — Totals and balances follow the Bill To | 4 | 0 |
| REL — Release day | 5 | 4 |
| INV — What must not change | 8 | 0 |
| DESIGN — Design — how it looks | 70 | 13 |

## 2. Coverage of every PRD item (Rule 43: one verdict per item)

Requirement codes: **176/178** quoted by a case, the other 2 listed as not testable with the reason. Named items (Error Handling 9, User Feedback Summary rows and sentences 22, Key Decisions 22, Terminology 7, Core 8, Integrations 5, Release day 10, State by action 7, Out of Scope 14, Goals 4, form factor and dependencies 6): **109/114** covered, 5 not testable. Every User Feedback Summary message is used word for word (fixed words exact) in a step or result (build.py gate).

| Item | PRD text (start) | Cases |
|---|---|---|
| S1-R1 | When a default other than the customer itself is saved, the customer page left card shows "Bill Invoices To" w | S1-01, S2-06, D-07, D-15, D-51 |
| S1-R2 | Users who may set the default see "Change" beside the name; it opens the "Bill Invoices To" window. | S1-01, S1-02, D-07, D-09, D-15 |
| S1-R3 | The window shows the help line "New work orders and part sales for [customer] will be billed to this customer. | S1-02, D-09 |
| S1-R4 | The window has a searchable "Bill Invoices To" field and a "Save" button. | S1-02, S1-03, D-09, D-63, D-69 |
| S1-R5 | The field's first option is "[customer] (this customer)"; picking it and saving clears the default. | S1-03, S1-04, S1-14, D-05 |
| S1-R6 | Saving applies only to work orders and part sales created afterwards. | S1-05 |
| S1-R7 | When at least one customer has this customer as its default, the card shows a "Pays for" counter beside Contac | S1-06, D-10, D-51 |
| S1-R8 | The counter's tooltip reads "Customers billed to this customer by default". | S1-06, D-11 |
| S1-R9 | Clicking the counter opens a window titled "[customer] pays for", listing each customer A to Z as a link to it | S1-07, S1-08, S1-09, D-12 |
| S1-R10 | The window shows the line "These customers bill new work orders and part sales to [customer] by default." and  | S1-07, D-12 |
| S1-N1 | A customer that bills itself shows no "Bill Invoices To" line and no way to set one on the card; the default i | S1-04, S1-10, D-08 |
| S1-N2 | Without 'Customers → Create & Edit' or 'View and Manage AP/AR Data', "Change" is hidden; the line still shows. | S1-11, S1-12, D-14 |
| S1-N3 | On Counter Sale, "Change" is hidden. | S1-13 |
| S1-N4 | The "Pays for" counter is hidden when the count is 0. | S1-14, D-08, D-54 |
| S1-N5 | Counter Sale never appears in the field's options. | S1-15, S2-16, D-02, D-17, D-18 |
| S1-E1 | One hop only: if the payer has its own default, new work orders still bill the payer, not the payer's default. | S1-16 |
| S2-R1 | New Customer and Edit Customer show a searchable "Bill Invoices To" field, reading "This customer" until anoth | S2-01, S2-03, D-01, D-04 |
| S2-R2 | The field sits after Credit Terms / Credit Limit and before Sales Representative (context: field order shared  | S2-02, S2-03, D-01 |
| S2-R3 | Edit Customer shows the help line "New work orders and part sales bill to this customer. Existing ones don't c | S2-03, D-04 |
| S2-R4 | In New Customer, the first option reads "[name typed so far] (this customer)", or "New customer (this customer | S2-04, S2-05, D-02, D-03 |
| S2-R5 | The pick saves together with the window's Save; if any part fails, nothing is saved and no customer is created | S2-06, S2-07, S2-08, D-03 |
| S2-R6 | An empty Address 2 is hidden; a + button beside Address 1 (tooltip "Add Address 2") shows it. | S2-09, S2-11, D-01 |
| S2-R7 | A shown Address 2 has an x button (tooltip "Remove Address 2") that clears and hides it; nothing is saved unti | S2-10, S2-11, D-04 |
| S2-R8 | A customer whose Address 2 holds a value opens with Address 2 showing, even when Address 1 is empty. | S2-10, S2-12, D-04 |
| S2-N1 | Without 'View and Manage AP/AR Data', the field is hidden and the window closes up around it. | S2-13, S2-14, D-13, D-14 |
| S2-N2 | New Customer shows no help line under the field. | S2-01, D-01 |
| S2-N3 | On Counter Sale, Edit Customer shows no "Bill Invoices To" field. | S2-15, D-06 |
| S3-R1 | The card's expanded section shows a "Bill To" field under Authorizer. | S3-01, S3-02, S3-31, D-16, D-22, D-24 |
| S3-R2 | The field reads "This customer" when the customer pays for itself, otherwise the Bill To's name. | S3-01, S3-02, S3-03, S3-32, D-16, D-19, D-66 |
| S3-R3 | Typing searches every customer in the organization except Counter Sale, A to Z, showing the first 50 matches;  | S3-04, S3-05, S3-06, S3-20, D-02, D-03, D-05, D-17, D-18, D-34, D-61 |
| S3-R4 | With no match, the list shows only the "(this customer)" option. | S3-07, D-18 |
| S3-R5 | Picking a customer saves the Bill To immediately; picking "(this customer)" makes the customer pay for itself. | S3-08, S3-09, S3-31, D-19 |
| S3-R6 | A new work order or part sale starts billed to the customer's saved default, if any, else the customer itself. | S1-16, S3-10, S3-11, S3-12 |
| S3-R7 | Splitting a work order or part sale, or reopening a paid work order onto a new one, copies its Bill To to the  | S3-15, S3-16, S3-17 |
| S3-R8 | New Work Order and New Part Sale show no Bill To. | S3-13, S3-14, D-23 |
| S3-R9 | On a Counter Sale work order or part sale, any customer except Counter Sale can be picked as Bill To. | S3-18, S3-19 |
| S3-N1 | Users without the permission see the field only when someone else pays, read-only. | S3-22, S3-23, S3-26, D-30 |
| S3-N2 | In history mode the field is read-only, shown only when someone else pays, with no lock message. | S3-27, S3-28 |
| S3-N3 | Invoiced or holding deposits: see Story 5. | S5-01 |
| S4-R1 | The Authorizer list shows "No authorizer", then the customer's authorizer contacts, then the Bill To's. | S4-01, S4-08, D-20 |
| S4-R2 | Each contact shows its customer's name on a second line. | S4-01, S4-08, D-20 |
| S4-R3 | A contact of the current Bill To can be saved as Authorizer and prints as the authorizer on documents. | S4-02 |
| S4-R4 | Changing the Bill To clears an Authorizer who is a contact of the previous Bill To, with no message. | S4-03 |
| S4-R5 | Change Customer clears the Authorizer, as today, including a contact of a Bill To that stays. | S4-04 |
| S4-N1 | When the customer pays for itself, the list is exactly today's, with no second line. | S4-05, D-21 |
| S4-N2 | An Authorizer from the customer stays when the Bill To changes. | S4-06 |
| S4-N3 | A contact of any other customer is refused, as today. | S4-07 |
| S5-R1 | When Invoiced, the Bill To field is read-only with M4 as its tooltip. | S5-01, S5-04, S5-05, D-26, D-68 |
| S5-R2 | Clicking or tapping the Invoiced field shows M4 as an error toast with a "Go To Invoice" button. | S5-02, S5-04, D-27, D-62 |
| S5-R3 | "Go To Invoice" opens the work order's or part sale's Finance tab; it never reverses anything. | S5-03, S5-04, D-27 |
| S5-R4 | While deposits are held on an Open document, the field is read-only with M1 as its tooltip. | S5-06, S5-10, D-28 |
| S5-R5 | Clicking or tapping that field shows M1 as an error toast with an "Open Deposits" button. | S5-07, S5-25, D-29, D-31 |
| S5-R6 | "Open Deposits" opens the Deposits tab of the customer holding the largest share of the deposits. | S5-08, S5-11, D-29 |
| S5-R7 | M1 names the total not reversed and the customer it was taken from, or "[N] customers" when there are several. | S5-06, S5-09, S5-11, S5-12, D-28 |
| S5-R8 | After the invoice is reversed, or all deposits are reversed, the field unlocks. | S5-12, S5-13, S11-02 |
| S5-N1 | Without 'Invoicing & payments → View' and 'See Financial Data', the M4 toast shows with no button. | S5-14, S5-16, S5-17, D-62 |
| S5-N2 | Without 'View and Manage AP/AR Data' and 'Customers → View', the M1 toast shows with no button. | S5-15, S5-18, S5-19, D-30 |
| S5-N3 | Users who cannot change the Bill To get M1 or M4 as an error toast on click or tap, with no button. | S5-20, S5-21, D-30, D-31 |
| S5-E1 | If the document is invoiced while the page is open, a change is refused with M4 and the field refreshes to its | S5-22 |
| S5-E2 | If a deposit is taken while the page is open, a change is refused with M1 and its button, and the field refres | S5-23 |
| S5-E3 | When the document is both Invoiced and holds deposits, M4 shows. | S5-24 |
| S6-R1 | If the Bill To was the old customer or the old customer's saved default, it follows to the new customer's save | S6-01, S6-02, S6-03, S6-04 |
| S6-R2 | A Bill To picked on purpose stays after Change Customer. | S4-04, S6-05, S6-10 |
| S6-R3 | The existing deposit block on Change Customer applies only when the change would change the Bill To. | S6-07, S6-08, D-28 |
| S6-N1 | On an Invoiced document, the invoice keeps its Bill To. A self-billed document stays self-billed, so invoicing | S6-09, S6-10 |
| S6-E1 | If the picked Bill To is the new customer, the document becomes self-billed. | S6-06 |
| S7-R1 | The invoice's Bill To block prints the Bill To's name, address and phone, saved on the invoice when it is crea | S7-01, S7-02, S7-24, D-36, D-65 |
| S7-R2 | The Bill To's credit term, saved on the invoice, sets the due date. | S7-02, S7-03 |
| S7-R3 | Pricing, tax, discounts, fees and shop supplies are the customer's; changing the Bill To never changes the tot | S7-04, INV-02 |
| S7-R4 | The Bill To's "PO is required" applies to Customer PO. | S7-05, S7-06 |
| S7-R5 | The Over Credit warning measures the Bill To's limit against everything the Bill To owes; it never blocks. | S7-07, S7-08 |
| S7-R6 | If the Bill To is on Credit Hold, the Credit Hold banner reads M2 with a "Change Bill To" button (work orders: | S7-09, S7-10, S7-25, D-32, D-33, D-35, D-70 |
| S7-R7 | "Change Bill To" opens and focuses the Customer card's Bill To field; on a phone it first opens the work order | S7-11, S7-12, D-34, D-35 |
| S7-R8 | The Create Invoice action is disabled with M2 as its tooltip. | S7-13 |
| S7-R9 | If Create Invoice is reached anyway or the server refuses it, M2 shows as an error toast with a "Change Bill T | S7-14 |
| S7-R10 | The server refuses an invoice for a Bill To on Credit Hold with M2, however the Credit Hold term is capitalize | S7-15 |
| S7-R11 | The work order's Credit Hold and Over Limit badges describe the Bill To. | S7-16, S7-17, S7-23, D-32 |
| S7-N1 | The customer's own Credit Hold does not block when someone else is billed. | S7-18, S7-22 |
| S7-N2 | When the customer pays for itself, Credit Hold reads and blocks exactly as today ("This customer is on Credit  | S7-19, REL-05 |
| S7-N3 | Without permission to change the Bill To, M2 shows with no button. | S7-20 |
| S7-N4 | Once invoiced, the banner reads as today. | S7-21, S7-22 |
| S7-E1 | Later changes to the Bill To's name, address or terms never change an existing invoice. | S7-02 |
| S8-R1 | A full-width band prints directly under the address row, reading "SERVICE FOR", then the customer's name in bo | S8-01, S8-02, S8-03, S8-04, D-36, D-37 |
| S8-R2 | On a work order with an asset, the band adds "Unit [unit]" and "[year] [make] [model]", separated by " · ". | S8-01, S8-02, S8-03, S8-04, D-36, D-38 |
| S8-R3 | Missing unit, year, make or model parts drop out with their separator; a unit already starting with "Unit" is  | S8-06, S8-07, S8-08, S8-09, D-38, D-39 |
| S8-R4 | On a part sale with a vehicle attached, the band adds the unit as in S8-R2 and S8-R3; without a vehicle it pri | S8-10, S8-11, D-40, D-41, D-42, D-43 |
| S8-R5 | The band has a light grey fill and a thin grey border so it reads in black and white. | S8-05, D-36 |
| S8-R6 | The band prints on the modern and legacy layouts, invoice and estimate, part sale invoice and batch invoice. | S8-01, S8-02, S8-03, S8-04, S8-10, S8-11, S8-12, D-37, D-38, D-39, D-40, D-46 |
| S8-R7 | The band leaves the address row free for a future Ship To block. | S8-13, D-36 |
| S8-N1 | When the customer pays for itself, no band prints and the document is unchanged. | S8-12, S8-14, INV-08, D-44, D-45, D-46 |
| S8-N2 | Invoices created before this release never print the band. | S8-15, REL-02 |
| S9-R1 | The send window lists the Bill To's contacts. | S9-01, S9-02, D-50 |
| S9-R2 | It pre-ticks the Bill To's contact marked Billing, else its first contact A to Z by name. | S9-01, S9-02, D-50 |
| S9-R3 | Staff can tick other contacts and type addresses, as today. | S9-03 |
| S9-R4 | "For Customer" attachments behave as today: sent only when staff tick the box, which starts unticked. | S9-04, S9-05, D-50 |
| S9-R5 | While the Bill To's contacts load, the window shows a loading state, never the customer's contacts. | S9-06 |
| S9-N1 | When the customer pays for itself, the list and the pre-ticked contact are exactly today's. | S9-07 |
| S10-R1 | The invoice's receivable posts to the Bill To's account, on its Invoices tab, AR Aging and statements. | S10-01, S10-02, S10-03, DATA-01, DATA-02, D-47 |
| S10-R2 | A deposit is taken on the account of whoever is the Bill To when it is recorded. | S10-04, S16-07, DATA-03 |
| S10-R3 | A credit for returned parts on a part sale goes to the Bill To. | S10-05 |
| S10-R4 | A payment settles only invoices owed by the paying customer; one payment can cover several of its invoices acr | S10-06, DATA-02, D-49 |
| S10-R5 | The server refuses a payment applied to another customer's invoice with M3. | S10-07 |
| S10-R6 | The Bill To's Invoices tab shows a "Service For" column naming the customer the work was for. | S10-09, D-47 |
| S10-R7 | The column is blank on rows billed to this customer for its own work. | S10-09, S10-11 |
| S10-R8 | A credit issued from an invoice created after release reduces the revenue of that invoice's customer. | S10-12, REL-04 |
| S10-R9 | A payment can use only deposits and credits held by the paying customer; otherwise it is refused with M5. | S10-08, DATA-03 |
| S10-N1 | The "Service For" column is hidden when no row on the tab, before any search, is billed for someone else. | S10-10, S10-11, INV-08, D-48 |
| S10-N2 | The customer's own Invoices tab does not list invoices billed to someone else, so they cannot be paid from its | S10-01, D-48 |
| S10-N3 | Payments and credits applied before this release are not re-checked. | S10-13 |
| S11-R1 | Reverse works exactly as today: the invoice is removed and the work order goes back to Complete. | S11-01 |
| S11-R2 | After Reverse, the Bill To field unlocks and can be changed. | S11-02 |
| S11-R3 | Invoicing again bills the current Bill To with its current terms and PO rules. | S11-03 |
| S11-R4 | The re-issued invoice keeps the same invoice number. | S11-04 |
| S11-N1 | With anything applied, Reverse is refused as today; staff reverse payments or deposits first. | S11-05, S11-07, S11-08 |
| S11-E1 | A deposit taken under the wrong Bill To must be reversed and taken again under the new Bill To (M1 says so). | S11-06 |
| S12-R1 | Deleting a customer that is another customer's saved default is refused, opening a "Delete Customer" window. | S12-01, D-52 |
| S12-R2 | The window shows the refusal message and each dependent customer as a link to its page. | S12-01, S12-02, S12-03, D-52 |
| S12-R3 | The window has "Cancel" and "Remove As Default Bill To" buttons. | S12-01, S12-08, D-52 |
| S12-R4 | "Remove As Default Bill To" asks to confirm, in a window titled "Remove as default Bill To" with "Remove" and  | S12-04, S12-05, D-53, D-64 |
| S12-R5 | Confirming clears the saved default on every dependent customer; open work orders keep their Bill To. | S12-06, S12-07, D-54 |
| S12-R6 | The user then deletes the customer again. | S12-07, D-54 |
| S12-R7 | A customer that is the Bill To on any work order or part sale cannot be deleted, with today's message "Company | S12-09, S12-10, S12-11 |
| S12-R8 | Today's delete refusals come first; the "Delete Customer" window shows only when being another customer's defa | S12-11, D-52 |
| S12-N1 | Without 'Customers → Create & Edit' and 'View and Manage AP/AR Data', "Remove As Default Bill To" is hidden. | S12-12, S12-13 |
| S13-R1 | Each Bill To change adds a "Bill To changed" entry on the work order or part sale log. | S13-01, S13-03, D-25 |
| S13-R2 | The entry shows "Bill To" with the old and new customer, each as a link. | S13-01, S13-02, S13-03, D-25 |
| S13-R3 | A Change Customer that moves the Bill To other than simply with the customer adds the same entry. | S13-04 |
| S13-N1 | A plain Change Customer on a self-billed document adds only today's customer change entry. | S13-05 |
| S13-N2 | Without 'Customers → View', the names show without links. | S13-06 |
| S14-R1 | The tab lists every service work order on the asset at the current location, for every customer, in today's so | S14-01, S14-02, D-55, D-58 |
| S14-R2 | A "Customer" filter chip sits beside Status, defaulting to "All customers". | S14-03, D-55, D-56 |
| S14-R3 | Its options are every customer on the asset's work orders, as customer or Bill To, A to Z. | S14-04, D-56 |
| S14-R4 | The filter is multi-select; a work order matches when a picked customer is its customer or its Bill To. | S14-05, S14-06, D-57 |
| S14-R5 | With more than 8 options, the chip offers search ("Search customers"). | S14-07, S14-08, D-56 |
| S14-R6 | A "Bill To" column shows when at least one row bills someone else; it is blank on self-billed rows. | S14-09, S14-10, S14-13, D-59, D-60, D-67 |
| S14-R7 | The Customer filter resets when another asset is opened. | S14-11 |
| S14-N1 | When the Status filter includes Imported, the Customer filter is disabled and cleared. | S14-12 |
| S15-R1 | Internal and No Charge work orders have no Bill To; the field is hidden. | S15-01, S15-02 |
| S15-R2 | Converting to No Charge, or changing to an internal customer, resets the Bill To to the customer. | S15-02, S15-04 |
| S15-R3 | Converting back to billable starts from the customer's saved default, else the customer. | S15-02, S15-03 |
| S15-R4 | An internal customer is never offered or accepted as a Bill To. | S15-05 |
| S15-R5 | The customer alone decides whether a work order is internal; the Bill To never does. | S15-04, S15-06 |
| S15-N1 | Until SV-11665 ships, every work order is billable and these rules have nothing to act on. | NOT TESTABLE: Says that before Internal Work Orders (SV-11665) ships every work order is billable and the Story 15 rules have nothing to act on. There is nothing to look at: every other case runs on billable work orders. |
| S16-R1 | The Bill To's portal contacts see the invoice and can pay it. | S16-01 |
| S16-R2 | The customer's portal contacts see the invoice read-only, with "Billed to [Bill To]" where Pay would be. | S16-02 |
| S16-R3 | The "invoice created" email goes to the Bill To's portal contacts only. | S16-03 |
| S16-R4 | Paying several invoices at once includes only invoices the viewer's customer owes. | S16-04 |
| S16-R5 | The Bill To's contacts see only invoices that name their customer, not the customer's other jobs or assets. | S16-05 |
| S16-R6 | A deposit link remembers the Bill To the work order had when staff created it. | S16-06, S16-07 |
| S16-R7 | If the work order's Bill To has changed since, paying the link is refused with G3 before any card is charged;  | S16-06 |
| S16-N1 | When the customer pays for itself, the portal is unchanged. | S16-08 |
| S17-R1 | The invoice is sent to QuickBooks with the Bill To as its customer. | S17-01, S17-08 |
| S17-R2 | A customer already linked to a QuickBooks customer always syncs to that one, whatever either is named. | S17-02 |
| S17-R3 | A customer with no link is matched to the QuickBooks customer with exactly the same name, and linked to it. | S17-03 |
| S17-R4 | If that QuickBooks customer is already linked to another ShopView customer, the invoice is not sent and appear | S17-04 |
| S17-R5 | Reverse deletes the QuickBooks invoice, and the re-issued invoice is sent as new, as today. | S17-05 |
| S17-N1 | If QuickBooks is not connected, nothing is sent and invoicing works as without the integration. | S17-06 |
| S17-N2 | Invoices created before this release are not re-sent. | S17-07 |
| S18-R1 | The invoice reaches AccountingHub with the Bill To as its customer. | S18-01 |
| S18-R2 | What AccountingHub receives keeps its current format; no AccountingHub change is needed. | NOT TESTABLE: States that the message AccountingHub receives keeps its current format and that AccountingHub needs no change. A tester sees only AccountingHub's own screens, which the other Story 18 cases check; the message format itself has no screen. |
| S18-R3 | AccountingHub AR, aging and balances therefore group by the Bill To. | S18-02 |
| S18-R4 | Reverse keeps the reversal record in AccountingHub and the re-issued invoice arrives as a new event, as today. | S18-03 |
| S18-R5 | Payments, deposits and credits arrive under the Bill To's account. | S18-04 |
| S18-N1 | When the customer pays for itself, AccountingHub receives what it receives today. | S18-05 |
| S19-R1 | IBS uses the Bill To's IBS account: its remit-to, approval and batch. | S19-01, S19-02 |
| S19-R2 | The Bill To's IBS number is saved on the invoice when it is created, blank when the Bill To has none. | S19-01, S19-03 |
| S19-R3 | The remit-to, the "(IBS#: [number])" after the Bill To's name and the IBS batch read the saved number. | S19-01, S19-02, S19-04 |
| S19-R4 | If the Bill To has no IBS account, the invoice does not go through IBS, even if the customer has one. | S19-03 |
| S19-R5 | In the invoice CSV export, "Customer" is the Bill To and "Terms" is the term saved on the invoice. | S19-06 |
| S19-R6 | The export's last column, "Service Customer", names the customer the work was for when someone else is billed. | S19-07 |
| S19-R7 | The Public API adds the Bill To to work orders and invoices; existing customer fields keep naming the customer | API-01, API-02, API-03, API-06 |
| S19-R8 | The Public API work order and invoice lists accept an optional Bill To filter; a malformed id returns an error | API-04, API-05, API-06, API-07 |
| S19-R9 | The Public API changelog announces the addition. | API-08 |
| S19-R10 | Creating an invoice through the Public API for a Bill To on Credit Hold is refused. | API-09, API-10 |
| S19-N1 | "Service Customer" is blank when the invoice bills its own customer. | S19-07, S19-08 |
| S19-N2 | Invoices created before this release export exactly as before. | S19-08 |
| S19-N3 | The Public API cannot set a Bill To or read a saved default. | API-11, API-12 |
| S19-N4 | A later change to the Bill To's IBS account never changes an existing invoice; invoices created before this re | S19-04, S19-05 |
| CORE-1 (Feature Overview, Core Bill To) | Every work order, part sale and invoice has two customers: the customer (the work is for them) and the Bill To | S3-01, S3-02, S3-03 |
| CORE-2 (Feature Overview, Core Bill To) | The customer keeps the truck, the service history, pricing, tax, discounts, fees, shop supplies and the revenu | S7-04, DATA-04, INV-01 |
| CORE-3 (Feature Overview, Core Bill To) | The Bill To owns the receivable: payment terms and due date, credit limit, Credit Hold, Customer PO and "PO is | S7-01, S7-03, S7-05, S7-07, S9-01, S10-01, S10-04, S16-01, S17-01, S19-01, DATA-01 |
| CORE-4 (Feature Overview, Core Bill To) | A customer can have a saved default Bill To. New work orders and part sales for that customer start billed to  | S1-01, S3-10 |
| CORE-5 (Feature Overview, Core Bill To) | Staff pick or change the Bill To on the work order or part sale Customer card, until it is invoiced. | S3-04, S3-08 |
| CORE-6 (Feature Overview, Core Bill To) | Once invoiced, the Bill To is locked. The only correction is to reverse the invoice, change the Bill To and in | S5-01 |
| CORE-7 (Feature Overview, Core Bill To) | When the Bill To differs from the customer, printed invoices and estimates carry a "Service For" band naming t | S8-01 |
| CORE-8 (Feature Overview, Core Bill To) | The Bill To shows only where it differs from the customer. A customer that pays for itself sees nothing new on | S1-10, S8-14, INV-08 |
| DEP-S15 (Story 15, Dependency) | Dependency: applies when Internal Work Orders (SV-11665) ships; rules from its PRD (Confluence 942243841). | S15-06 |
| DEP-S16 (Story 16, Release dependency) | Release dependency: the customer portal app ships S16-R2 to S16-R4 and runs ShopView's deposit check before it | S16-06 |
| EH-S1-1 (Story 1, Error Handling) | If saving fails, the app's standard error toast shows and the window stays open. | S1-19, S2-08 |
| EH-S1-2 (Story 1, Error Handling) | Saving a default on Counter Sale is refused with "Counter Sale always bills itself." | S1-17 |
| EH-S1-3 (Story 1, Error Handling) | Picking Counter Sale as a default is refused with "Counter Sale can't be the Bill To for another customer." | S1-18 |
| EH-S10 (Story 10, Error Handling) | M3 and M5 show as an error toast and no payment is recorded. | S10-07, S10-08 |
| EH-S12 (Story 12, Error Handling) | If removing the defaults fails, the app's standard error toast shows and the confirmation stays open. | S12-14 |
| EH-S17 (Story 17, Error Handling) | A failed sync follows today's failure path (the Unexported report). | S17-04 |
| EH-S2 (Story 2, Error Handling) | Same refusals and messages as Story 1. | S2-16 |
| EH-S3-1 (Story 3, Error Handling) | Picking Counter Sale through any path is refused with "Counter Sale can't be the Bill To for another customer. | S3-21 |
| EH-S3-2 (Story 3, Error Handling) | If the save fails, the app's standard error toast shows and the field keeps its previous value. | S3-30 |
| FF-S3 (Story 3, Form factor) | Form factor: Mobile-optimized: the same Customer card on phones; the field is a standard searchable select wit | S3-31 |
| FF-S4 (Story 4, Form factor) | Form factor: Mobile-optimized: the same Customer card on phones. | S4-08 |
| FF-S5 (Story 5, Form factor) | Form factor: Mobile-optimized: tap does what click does; no hover-only message. | S5-25 |
| FF-S7 (Story 7, Form factor) | Form factor: Mobile-optimized: the banner and the Create Invoice action keep today's phone layout. | S7-12 |
| GOAL-1 (Goals) | A shop can invoice a customer other than the one the work is for, without changing the work order's customer. | S7-01, S10-01 |
| GOAL-2 (Goals) | The truck's history, pricing and revenue stay with the customer the work was for on every invoice billed to so | DATA-04, INV-01 |
| GOAL-3 (Goals) | A saved default bills every new work order and part sale for that customer to the payer, with no step per job. | S3-10, S3-11 |
| GOAL-4 (Goals) | A shop that never picks a different Bill To sees every total, balance, report and document unchanged. | S7-19, S17-08, S18-05, REL-01, REL-02, INV-08 |
| INT-1 (Feature Overview, Integrations) | QuickBooks Online: the invoice is sent under the Bill To. | S17-01 |
| INT-2 (Feature Overview, Integrations) | AccountingHub: the invoice is sent under the Bill To, as it is to QuickBooks; nothing changes in what Accounti | S18-01 |
| INT-3 (Feature Overview, Integrations) | IBS: the Bill To's IBS account applies; its number is saved on the invoice at creation. | S19-01 |
| INT-4 (Feature Overview, Integrations) | Customer portal: the Bill To's contacts see and pay the invoice; the customer's contacts see it read-only. | S16-01, S16-02 |
| INT-5 (Feature Overview, Integrations) | Public API: Bill To is added alongside existing fields; nothing existing changes meaning. Creating an invoice  | API-01, API-02 |
| KD-ADDR (Key Decisions) | Address 2 on demand ships with Bill To. An empty Address 2 hides behind a + in New Customer and Edit Customer. | S2-09 |
| KD-AH (Key Decisions) | AccountingHub receives the invoice under the Bill To, as QuickBooks does. The invoice, its payments, deposits  | S18-01, S18-02, S18-04 |
| KD-API (Key Decisions) | The Public API is additive, with one deliberate change: an invoice for a Bill To on Credit Hold is refused. | API-01, API-06, API-09 |
| KD-ASSET (Key Decisions) | The asset's Work Orders tab shows its whole history at the current location by default, with a Customer filter | S14-01, S14-02, S14-05 |
| KD-AUTH (Key Decisions) | The authorizer list adds the Bill To's contacts when the Bill To differs. | S4-01 |
| KD-BAND (Key Decisions) | "Service For" band on documents, only when the Bill To differs. | S8-01, S8-03, S8-14 |
| KD-CC (Key Decisions) | Change Customer never makes a self-billed document bill the old customer. On an invoiced document the invoice  | S6-02, S6-09 |
| KD-CH (Key Decisions) | The Bill To's Credit Hold blocks invoicing, checked on the server; its credit limit warns but never blocks. | S7-07, S7-09, S7-14, API-09, REL-05 |
| KD-CREDIT (Key Decisions) | A credit issued from an invoice reduces the revenue of that invoice's customer, not the Bill To's. Applies to  | S10-12, REL-04 |
| KD-CS (Key Decisions) | Counter Sale is never the Bill To for another customer, and always bills itself by default. | S1-13, S1-15, S1-17, S1-18, S2-15, S2-16, S3-20, S3-21 |
| KD-DEF (Key Decisions) | A saved default Bill To, one hop, applied at creation only. Set in New Customer and Edit Customer; applied sil | S1-05, S1-16, S2-06, S3-10, S3-11, INV-07 |
| KD-DEP (Key Decisions) | Deposits lock the Bill To. A deposit belongs to the Bill To it was taken under and never moves between custome | S5-06, S5-08, S6-07, S10-08, S11-06 |
| KD-LOCK (Key Decisions) | Invoiced means locked; Reverse and invoice again is the only correction, and Reverse works as today. The invoi | S5-01, S11-03, S11-04, S17-05, S18-03 |
| KD-PAY (Key Decisions) | A payment settles only invoices its own customer owes. Enforced for new payments only; existing applications a | S10-06, S10-07, S10-13, DATA-02 |
| KD-PERM-DEF (Key Decisions) | Setting or removing a saved default Bill To needs 'Customers → Create & Edit' and 'View and Manage AP/AR Data' | S1-11, S1-12, S2-13, S2-14, S12-12, S12-13 |
| KD-PERM-NONEW (Key Decisions) | No new permission. | S3-22 |
| KD-PERM-SEE (Key Decisions) | Anyone who can view the customer or work order sees the Bill To. | S1-11, S1-12, S2-14, S3-22 |
| KD-PERM-WO (Key Decisions) | Changing a work order's Bill To needs 'Work orders → Create & Edit'; a part sale's needs 'Part sales → Create  | S3-22, S3-24, S3-25, S3-26 |
| KD-REPORTS (Key Decisions) | ShopView's own reports still credit the work to the customer. | S10-12, DATA-04 |
| KD-SHOW (Key Decisions) | Bill To shows only where it differs from the customer. | S1-04, S1-10, S3-23, S14-10, INV-08 |
| KD-SPLIT (Key Decisions) | Two customers, split by job. The customer owns pricing, tax, discounts, fees, shop supplies, history and reven | S7-04, S7-06, DATA-04, INV-01 |
| KD-TAX (Key Decisions) | Known limitation: tax follows the customer. A tax-exempt Bill To is still charged tax on a taxable customer's  | INV-02 |
| OOS-01 (Out of Scope) | Ship To. Ships after Bill To as its own release. The Service For band leaves room for a Ship To block beside t | S8-13 |
| OOS-02 (Out of Scope) | A separate payer on each payment, split billing, parent and child accounts, tax by service location. Not in th | NOT TESTABLE: A separate payer on each payment, split billing, parent and child accounts and tax by service location do not exist; there is no screen to look at. |
| OOS-03 (Out of Scope) | Credit Terms (SV-11638) and Split Representatives (SV-10890). Their own PRDs own their fields and behavior. Th | S2-02 |
| OOS-04 (Out of Scope) | Bill To in New Work Order and New Part Sale. Neither window changes. A saved default applies on create and the | S3-13, S3-14, INV-07 |
| OOS-05 (Out of Scope) | A saved default Bill To in the Public API. Set in ShopView only. | API-12 |
| OOS-06 (Out of Scope) | Setting a Bill To through the Public API. Read and filter only. | API-11 |
| OOS-07 (Out of Scope) | Standalone credits (goodwill, overpayment, with no invoice). Unchanged: one customer, as today. | INV-04 |
| OOS-08 (Out of Scope) | Historical imports and AccountingHub manual invoices. No Bill To; unchanged. | INV-06 |
| OOS-09 (Out of Scope) | Work Orders list, Board View and Tech View. No Bill To on these screens. | INV-05 |
| OOS-10 (Out of Scope) | Report columns for Bill To (Bill To on sales, margin and technician reports; service customer on A/R Aging, st | DATA-04 |
| OOS-11 (Out of Scope) | A "Paid by" pointer on the service customer's side: follow-up. | NOT TESTABLE: A 'Paid by' pointer is a follow-up that does not exist yet; there is no screen to look at. |
| OOS-12 (Out of Scope) | Estimate emails and approval links: unchanged; they go to the customer's contacts, as today. | INV-03 |
| OOS-13 (Out of Scope) | A history of changes to a customer's saved default Bill To: not in this release. | NOT TESTABLE: A history of changes to a saved default is not in this release; there is no screen to look at. |
| OOS-14 (Out of Scope) | Changing how Reverse works: unchanged; Bill To uses it as the correction path. | S11-01 |
| REL-0a (Feature Overview, Release day) | Nothing is migrated. Every existing work order, part sale and invoice already has one customer in both roles,  | S19-08, REL-01, REL-02 |
| REL-0b (Feature Overview, Release day) | Credits on invoices created before release keep today's revenue attribution. | REL-04 |
| REL-0c (Feature Overview, Release day) | Bill To has no feature flag; it is on for every shop at release. | REL-03 |
| REL-1 (Feature Overview, Release day) | The asset page's Work Orders tab lists the asset's whole history at the current location (every customer and p | S14-01 |
| REL-2 (Feature Overview, Release day) | Users who can change a work order's customer see a "Bill To" field reading "This customer" on every work order | S3-01, S3-02, REL-01, REL-03 |
| REL-3 (Feature Overview, Release day) | Users with 'Customers → Create & Edit' and 'View and Manage AP/AR Data' see a "Bill Invoices To" field in New  | S2-01, S2-03 |
| REL-4 (Feature Overview, Release day) | In New Customer and Edit Customer, an empty Address 2 is hidden behind a + button beside Address 1. A customer | S2-09 |
| REL-5 (Feature Overview, Release day) | The invoice CSV export gains a last column, "Service Customer", blank on every invoice billed to its own custo | S19-07, S19-08 |
| REL-6 (Feature Overview, Release day) | Credit Hold blocking Create Invoice is now also checked on the server. The same customers are blocked, with th | REL-05 |
| REL-7 (Feature Overview, Release day) | Creating an invoice through the Public API for a customer on Credit Hold is now refused (Story 19). | API-09, API-10 |
| SBA-AGAIN (Feature Overview, State by action (Action | Open | Invoiced | Internal or No Charge)) | Invoice again after Reverse / Bill To unlocked; new invoice to the current Bill To, same invoice number / n/a  | S11-02, S11-03, S11-04 |
| SBA-CC (Feature Overview, State by action (Action | Open | Invoiced | Internal or No Charge)) | Change Customer / Allowed. A default Bill To follows, a picked one stays. Deposits block only if the Bill To w | S6-01, S6-03, S6-05, S6-07, S6-08, S6-09 |
| SBA-DEP (Feature Overview, State by action (Action | Open | Invoiced | Internal or No Charge)) | Take a deposit / Allowed; lands on the Bill To's account / As today / n/a | S10-04, DATA-03 |
| SBA-INV (Feature Overview, State by action (Action | Open | Invoiced | Internal or No Charge)) | Create the invoice / Allowed, unless the Bill To is on Credit Hold (M2) or requires a PO and Customer PO is em | S7-01, S7-05, S7-13, S15-01 |
| SBA-PAY (Feature Overview, State by action (Action | Open | Invoiced | Internal or No Charge)) | Take a payment / n/a / From the Bill To's account only (M3) / n/a | S10-06, S10-07 |
| SBA-PICK (Feature Overview, State by action (Action | Open | Invoiced | Internal or No Charge)) | Pick or change the Bill To / Allowed. Refused while deposits are held (M1). / Read-only (M4) / No Bill To | S3-08, S3-29, S5-01, S5-06, S11-06, S15-01 |
| SBA-REV (Feature Overview, State by action (Action | Open | Invoiced | Internal or No Charge)) | Reverse the invoice / n/a / As today: refused while any payment, deposit or credit is applied; reopens the wor | S11-01, S11-05, S11-07, S11-08 |
| T-BILL (Terminology) | Bill To → the customer who owes the invoice. Equals the customer unless someone else is picked. | S3-01, API-03 |
| T-CS (Terminology) | Counter Sale → the system customer walk-ins are invoiced to. A normal customer in this PRD, never a Bill To fo | S1-13, S1-15, S3-20 |
| T-CUST (Terminology) | Customer → the customer the work is for: owns the truck, history, pricing and revenue. Called the "service cus | S3-03, INV-01 |
| T-DEF (Terminology) | Saved default Bill To → a customer-level setting ("Bill Invoices To") that sets the Bill To of new work orders | S1-01, S1-05 |
| T-OPEN (Terminology) | Open / Invoiced → Open means Estimate, Approved, In Progress, Ready for Review, Complete or Declined. Invoiced | S3-29, S5-05 |
| T-REV (Terminology) | Reverse → ShopView's existing action that removes an invoice and puts the work order back to Complete. | S11-01 |
| T-VOCAB (Terminology) | Vocabulary. This PRD uses the frontend vocabulary, customer and location, which map to company and workplace i | NOT TESTABLE: A vocabulary note mapping the screen words customer and location to the back-end words company and workplace; no behaviour. |
| UFS-01 (User Feedback Summary) | M1 / Change the Bill To while one deposit is held / "This work order has a [$amount] deposit from [customer].  | S5-06, S5-07, S5-10 |
| UFS-02 (User Feedback Summary) | M1 / Same, several deposits / "This work order has [$total] in deposits from [customer]. Reverse them, change  | S5-09, S5-11 |
| UFS-03 (User Feedback Summary) | M1 / Deposits from more than one customer / [customer] reads "[N] customers" / Same as above | S5-11 |
| UFS-04 (User Feedback Summary) | M1 / On a part sale / "work order" reads "part sale" / Same as above | S5-10 |
| UFS-05 (User Feedback Summary) | M2 / Create Invoice when the Bill To is on Credit Hold / "Cannot invoice. The Bill To customer, [Bill To], is  | S7-09, S7-10, S7-13, S7-14 |
| UFS-06 (User Feedback Summary) | M3 / Payment applied to another customer's invoice / "This payment can only be applied to invoices billed to [ | S10-07 |
| UFS-07 (User Feedback Summary) | M5 / Payment uses a deposit or credit held by another customer / "This payment can only use deposits and credi | S10-08 |
| UFS-08 (User Feedback Summary) | M4 / Change the Bill To on an Invoiced document / "Invoiced. Reverse the invoice to change who's billed." / Fi | S5-01, S5-02 |
| UFS-09 (User Feedback Summary) | D3 / Counter Sale picked as a Bill To or default / "Counter Sale can't be the Bill To for another customer." / | S1-18, S3-21 |
| UFS-10 (User Feedback Summary) | D3 / A default saved on Counter Sale / "Counter Sale always bills itself." / Standard error toast | S1-17 |
| UFS-11 (User Feedback Summary) | D8 / Delete a customer that is someone's default / "This customer is the default Bill To for [names, comma sep | S12-01, S12-02 |
| UFS-12 (User Feedback Summary) | D8 / Confirm removal / "Remove [customer] as the default Bill To for [N] [customer / customers]? Open work ord | S12-04, S12-05 |
| UFS-13 (User Feedback Summary) | S12-R7 / Delete a customer that is a Bill To on any work order / "Company with a work order cannot be deleted. | S12-09 |
| UFS-14 (User Feedback Summary) | Help / "Bill Invoices To" window / "New work orders and part sales for [customer] will be billed to this custo | S1-02 |
| UFS-15 (User Feedback Summary) | Help / Edit Customer field / "New work orders and part sales bill to this customer. Existing ones don't change | S2-03 |
| UFS-16 (User Feedback Summary) | Pays for / Counter tooltip / window / "Customers billed to this customer by default" / "[customer] pays for" / | S1-06, S1-07 |
| UFS-17 (User Feedback Summary) | Portal / Customer's contact views an invoice billed to someone else / "Billed to [Bill To]" / In place of Pay | S16-02 |
| UFS-18 (User Feedback Summary) | Q1 / QuickBooks: same-name customer linked to another ShopView customer / "QuickBooks customer [name] is alrea | S17-04 |
| UFS-19 (User Feedback Summary) | G3 / Customer portal: a deposit link is paid after the work order's Bill To changed / "This work order is now  | S16-06 |
| UFS-H1 (User Feedback Summary) | Error toasts with a button fade after 10 seconds. | S5-02, S5-07 |
| UFS-H2 (User Feedback Summary) | Server refusals without a button show as the app's standard error toast, captioned "Please try to resolve this | S1-17, S10-07, S12-09 |
| UFS-H3 (User Feedback Summary) | Buttons and column headers are listed as they render (Title Case). | NOT TESTABLE: A note on how the PRD's own table writes buttons and column headers; the cases quote every label in Title Case as the table gives it. |

## 3. Held cases

| Key | Title | Why held |
|---|---|---|
| S1-17 | Saving a default on Counter Sale is refused | no screen offers a default on Counter Sale (the field is hidden there), so only a request sent from outside the screens reaches this refusal |
| S1-18 | Picking Counter Sale as another customer's default is refused | the Counter Sale customer is never offered in the field, so only a request sent from outside the screens reaches this refusal |
| S1-19 | If saving a default fails, an error toast shows and the window stays open | a save failure cannot be caused from the screens; it needs the save to be made to fail |
| S2-08 | If any part of saving a new customer fails, no customer is created | one part of the save cannot be made to fail from the screens |
| S3-21 | Picking Counter Sale as a Bill To is refused | the Counter Sale customer is never offered in the field, so only a request sent from outside the screens reaches this refusal |
| S3-30 | If the Bill To save fails, an error toast shows and the old value stays | a save failure cannot be caused from the screens; it needs the save to be made to fail |
| S3-32 | A long payer name reads in full on the Customer card | waiting on the PO (question 9) |
| S5-02 | Clicking an invoiced Bill To shows an error toast with Go To Invoice | waiting on the PO (question 5) |
| S5-07 | Clicking a deposit-locked Bill To shows an error toast with Open Deposits | waiting on the PO (question 5) |
| S5-11 | Deposits from two customers name the number of customers | deposits from two different customers on one work order cannot be made through the screens, because a held deposit locks the Bill To |
| S5-16 | With Invoicing View but not See Financial Data the invoiced toast | waiting on the PO (question 1) |
| S5-17 | With See Financial Data but not Invoicing View the invoiced toast | waiting on the PO (question 1) |
| S5-18 | With Customers View but not AP/AR Data the deposit toast | waiting on the PO (question 1) |
| S5-19 | With AP/AR Data but not Customers View the deposit toast | waiting on the PO (question 1) |
| S7-15 | Credit Hold is caught whatever the capitalization of its term | a credit term with different capitals cannot be made through the screens; it exists only in older stored data |
| S7-22 | Invoiced work order whose customer is on Credit Hold and payer is not | waiting on the PO (question 2) |
| S7-23 | A part sale's Credit Hold badge follows the payer | waiting on the PO (question 3) |
| S7-24 | The legacy invoice's Bill To block prints the payer's phone | waiting on the PO (question 8) |
| S7-25 | The payer's Credit Hold banner sits in the work order's page header | waiting on the PO (question 13) |
| S8-15 | Invoices created before the release never print the band | needs records made on production before the release reaches production; run on production after the release |
| S9-06 | While the payer's contacts load the window shows a loading state | the contacts load faster than a person can see the loading state |
| S10-08 | A payment that uses another customer's deposit or credit is refused | the payment window offers only the paying customer's own deposits and credits, so another customer's cannot be picked on screen |
| S10-13 | Payments applied before the release are not checked again | needs records made on production before the release reaches production; run on production after the release |
| S12-14 | If removing the defaults fails, an error toast shows and the confirmation stays | a removal failure cannot be caused from the screens; it needs the removal to be made to fail |
| S14-13 | The Bill To column shows when the payer's row is on a later page | waiting on the PO (question 14) |
| S15-01 | An internal work order has no Bill To field | waits on the release of Internal Work Orders (SV-11665) (BLOCKED ON RELEASE banner) |
| S15-02 | Converting to No Charge hides the Bill To and resets it to the customer | waits on the release of Internal Work Orders (SV-11665) (BLOCKED ON RELEASE banner) |
| S15-03 | Converting back to billable starts from the customer's saved default | waits on the release of Internal Work Orders (SV-11665) (BLOCKED ON RELEASE banner) |
| S15-04 | Changing to an internal customer removes the Bill To | waits on the release of Internal Work Orders (SV-11665) (BLOCKED ON RELEASE banner) |
| S15-05 | An internal customer is never offered as a Bill To | waits on the release of Internal Work Orders (SV-11665) (BLOCKED ON RELEASE banner) |
| S15-06 | Billing a payer does not make a billable work order internal | waits on the release of Internal Work Orders (SV-11665) (BLOCKED ON RELEASE banner) |
| S16-02 | The customer's portal contact sees the invoice read-only with Billed to | waits on the customer portal app release named in the PRD's release dependency (BLOCKED ON RELEASE banner) |
| S16-03 | The invoice created email goes only to the payer's portal contacts | waits on the customer portal app release named in the PRD's release dependency (BLOCKED ON RELEASE banner) |
| S16-04 | Paying several invoices at once includes only what the viewer's customer owes | waits on the customer portal app release named in the PRD's release dependency (BLOCKED ON RELEASE banner) |
| S16-06 | A deposit link paid after the Bill To changed is refused | waits on the customer portal app release named in the PRD's release dependency (BLOCKED ON RELEASE banner) |
| S17-07 | Invoices created before the release are not sent again | needs records made on production before the release reaches production; run on production after the release |
| S18-01 | The invoice reaches AccountingHub under the payer | waiting on the PO (question 15) |
| S18-02 | AccountingHub AR and aging group the invoice under the payer | waiting on the PO (question 15) |
| S18-03 | Reverse keeps the reversal in AccountingHub and the new invoice arrives as new | waiting on the PO (question 15) |
| S18-04 | Payments, deposits and credits reach AccountingHub under the payer | waiting on the PO (question 15) |
| S19-05 | Invoices made before the release read the payer's current IBS account | needs records made on production before the release reaches production; run on production after the release |
| S19-08 | Invoices created before the release export as before | needs records made on production before the release reaches production; run on production after the release |
| REL-01 | Existing work orders bill their own customer after the release | needs records made on production before the release reaches production; run on production after the release |
| REL-02 | Existing invoices and balances are unchanged after the release | needs records made on production before the release reaches production; run on production after the release |
| REL-03 | Bill To is on for every shop at release with no setting to switch | needs records made on production before the release reaches production; run on production after the release |
| REL-04 | A credit on an invoice from before the release keeps today's revenue split | needs records made on production before the release reaches production; run on production after the release |
| D-17 | Design: Bill To list opens with this customer first then customers A to Z | the design shows a place the PRD does not settle, waiting on the PO (question 12) |
| D-33 | Design: Credit Hold banner shows on the work order Finance tab | the design shows a place the PRD does not settle, waiting on the PO (question 13) |
| D-35 | Design: Credit Hold banner and Change Bill To work on a phone | the design shows a place the PRD does not settle, waiting on the PO (question 13) |
| D-61 | Design: Bill To list puts the current Bill To second, before A to Z | the design differs from the PRD, waiting on the PO (question 4) |
| D-62 | Design: Bill To lock toasts carry a Close button | the design differs from the PRD, waiting on the PO (question 5) |
| D-63 | Design: Bill Invoices To window has Cancel before Save | the design differs from the PRD, waiting on the PO (question 6) |
| D-64 | Design: Remove as default Bill To shows Cancel before Remove | the design differs from the PRD, waiting on the PO (question 7) |
| D-65 | Design: Legacy invoice Bill To block prints no phone | the design differs from the PRD, waiting on the PO (question 8) |
| D-66 | Design: Long Bill To name is cut at the card edge with no ellipsis | the design differs from the PRD, waiting on the PO (question 9) |
| D-67 | Design: Asset tab with a Bill To column scrolls sideways at 1440 | the design differs from the PRD, waiting on the PO (question 10) |
| D-68 | Design: Bill To lock tooltip shows at the window's left edge | the design differs from the PRD, waiting on the PO (question 11) |
| D-69 | Design: Bill To list opening upward runs over the app's top bar | the design differs from the PRD, waiting on the PO (question 12) |
| D-70 | Design: Work order Credit Hold banner sits under the tab bar | the design differs from the PRD, waiting on the PO (question 13) |

## 4. Story-vs-PRD differences (each story compared with its PRD story, `authoring/story_diff.py`)

- All 178 requirement, negative and edge codes in the 19 stories are word for word the PRD's; no PRD code is missing from a story. Every story's Error handling, Prerequisite, Form factor, Dependency, Trigger and Messages line is in the PRD word for word.
- Wording of a label only: Story SV-12318 writes "Dependency:" where the PRD writes "Release dependency:"; the sentence is the same.
- Every story says "Status: Pending approval from Mat and Amani. Do not start until approved.", matching the PRD's status.
- Epic SV-12289: "Release dependencies: AccountingHub change (Hub team) and the customer portal deposit check." — CONFLICT resolved by latest wins (Rule 32): the PRD (last modified 7 Nov 2026; owning PM ruling 6 Nov 2026) says no AccountingHub change is needed; the epic text (updated 6 Nov 2026 14:25 -0500) is older. Cases follow the PRD (Story 18).
- Epic SV-12289: "QuickBooks invoice under the Bill To, customers linked by ID; customer portal; IBS." — SAME meaning (S17-R2: a linked customer always syncs to its QuickBooks customer).
- Epic SV-12289: "Stories carry "Status: Pending approval from Mat and Amani. Do not start until approved."" — SAME (both pending approval).
- Round 2: the AccountingHub conflict is now PO question 15. The design's cover says the AccountingHub invoice event that carries the Bill To is not built yet, which sides with the epic against the PRD; with two sources against the newest one, latest-wins is not applied and the question is asked (S18-01 to S18-04 held; S18-05, self-billed, stays runnable).

## 5. What must not change (Rule 96, skill 17)

Code baseline: **NOT AVAILABLE** (no product repository access in this session); the invariant set rests on the PRD's own "as today" / "unchanged" sentences and its Out of Scope list. Every such sentence a tester can see is quoted by a case:

| PRD item | "as today" / "unchanged" sentence (start) | Cases |
|---|---|---|
| S11-N1 | With anything applied, Reverse is refused as today; staff reverse payments or deposits first. | S11-05, S11-07, S11-08 |
| S11-R1 | Reverse works exactly as today: the invoice is removed and the work order goes back to Complete. | S11-01 |
| S15-R1 | Internal and No Charge work orders have no Bill To; the field is hidden. | S15-01, S15-02 |
| S16-N1 | When the customer pays for itself, the portal is unchanged. | S16-08 |
| S17-N1 | If QuickBooks is not connected, nothing is sent and invoicing works as without the integration. | S17-06 |
| S17-R5 | Reverse deletes the QuickBooks invoice, and the re-issued invoice is sent as new, as today. | S17-05 |
| S18-R4 | Reverse keeps the reversal record in AccountingHub and the re-issued invoice arrives as a new event, as today. | S18-03 |
| S19-N2 | Invoices created before this release export exactly as before. | S19-08 |
| S3-R8 | New Work Order and New Part Sale show no Bill To. | S3-13, S3-14, D-23 |
| S4-N3 | A contact of any other customer is refused, as today. | S4-07 |
| S4-R5 | Change Customer clears the Authorizer, as today, including a contact of a Bill To that stays. | S4-04 |
| S6-N1 | On an Invoiced document, the invoice keeps its Bill To. A self-billed document stays self-billed, so invoicing | S6-09, S6-10 |
| S7-N2 | When the customer pays for itself, Credit Hold reads and blocks exactly as today ("This customer is on Credit  | S7-19, REL-05 |
| S7-N4 | Once invoiced, the banner reads as today. | S7-21, S7-22 |
| S8-N1 | When the customer pays for itself, no band prints and the document is unchanged. | S8-12, S8-14, INV-08, D-44, D-45, D-46 |
| S9-R3 | Staff can tick other contacts and type addresses, as today. | S9-03 |
| S9-R4 | "For Customer" attachments behave as today: sent only when staff tick the box, which starts unticked. | S9-04, S9-05, D-50 |
| FF-S7 | Form factor: Mobile-optimized: the banner and the Create Invoice action keep today's phone layout. | S7-12 |
| GOAL-4 | A shop that never picks a different Bill To sees every total, balance, report and document unchanged. | S7-19, S17-08, S18-05, REL-01, REL-02, INV-08 |
| KD-CC | Change Customer never makes a self-billed document bill the old customer. On an invoiced document the invoice  | S6-02, S6-09 |
| KD-CREDIT | A credit issued from an invoice reduces the revenue of that invoice's customer, not the Bill To's. Applies to  | S10-12, REL-04 |
| KD-LOCK | Invoiced means locked; Reverse and invoice again is the only correction, and Reverse works as today. The invoi | S5-01, S11-03, S11-04, S17-05, S18-03 |
| OOS-01 | Ship To. Ships after Bill To as its own release. The Service For band leaves room for a Ship To block beside t | S8-13 |
| OOS-02 | A separate payer on each payment, split billing, parent and child accounts, tax by service location. Not in th | NOT TESTABLE: A separate payer on each payment, split billing, parent and child accounts and tax by service location do not exist; there is no screen to look at. |
| OOS-03 | Credit Terms (SV-11638) and Split Representatives (SV-10890). Their own PRDs own their fields and behavior. Th | S2-02 |
| OOS-04 | Bill To in New Work Order and New Part Sale. Neither window changes. A saved default applies on create and the | S3-13, S3-14, INV-07 |
| OOS-05 | A saved default Bill To in the Public API. Set in ShopView only. | API-12 |
| OOS-06 | Setting a Bill To through the Public API. Read and filter only. | API-11 |
| OOS-07 | Standalone credits (goodwill, overpayment, with no invoice). Unchanged: one customer, as today. | INV-04 |
| OOS-08 | Historical imports and AccountingHub manual invoices. No Bill To; unchanged. | INV-06 |
| OOS-09 | Work Orders list, Board View and Tech View. No Bill To on these screens. | INV-05 |
| OOS-10 | Report columns for Bill To (Bill To on sales, margin and technician reports; service customer on A/R Aging, st | DATA-04 |
| OOS-11 | A "Paid by" pointer on the service customer's side: follow-up. | NOT TESTABLE: A 'Paid by' pointer is a follow-up that does not exist yet; there is no screen to look at. |
| OOS-12 | Estimate emails and approval links: unchanged; they go to the customer's contacts, as today. | INV-03 |
| OOS-13 | A history of changes to a customer's saved default Bill To: not in this release. | NOT TESTABLE: A history of changes to a saved default is not in this release; there is no screen to look at. |
| OOS-14 | Changing how Reverse works: unchanged; Bill To uses it as the correction path. | S11-01 |
| REL-0a | Nothing is migrated. Every existing work order, part sale and invoice already has one customer in both roles,  | S19-08, REL-01, REL-02 |
| REL-0b | Credits on invoices created before release keep today's revenue attribution. | REL-04 |
| SBA-CC | Change Customer / Allowed. A default Bill To follows, a picked one stays. Deposits block only if the Bill To w | S6-01, S6-03, S6-05, S6-07, S6-08, S6-09 |
| SBA-DEP | Take a deposit / Allowed; lands on the Bill To's account / As today / n/a | S10-04, DATA-03 |
| SBA-PICK | Pick or change the Bill To / Allowed. Refused while deposits are held (M1). / Read-only (M4) / No Bill To | S3-08, S3-29, S5-01, S5-06, S11-06, S15-01 |
| SBA-REV | Reverse the invoice / n/a / As today: refused while any payment, deposit or credit is applied; reopens the wor | S11-01, S11-05, S11-07, S11-08 |

Silences judged dangerous (V2 touches the same screen) and asked: part sale Credit Hold / Over Limit badges (question 3). Considered and not asked, with the reason: PO-QUESTIONS-DRAFT.md, last section. **Honest limit (skill 17 §7):** undocumented, untested, code-invisible behaviours cannot be fully enumerated; without the product code the baseline is the PRD's own statements, and what protects us is this written list plus the dated questions.

## 6. Surfaces (Rule 40) and numbers (Rule 116)

| Surface | Cases |
|---|---|
| Customer page (Bill Invoices To line, Change, Pays for) | S1-01, S1-02, S1-03, S1-04, S1-05, S1-06, S1-07, S1-08, S1-09, S1-10, S1-11, S1-12, S1-13, S1-14, S1-15, S1-16, S1-17, S1-18, S1-19 |
| New Customer / Edit Customer (field, help line, Address 2) | S2-01, S2-02, S2-03, S2-04, S2-05, S2-06, S2-07, S2-08, S2-09, S2-10, S2-11, S2-12, S2-13, S2-14, S2-15, S2-16 |
| Work order and part sale Customer card | S3-01, S3-02, S3-03, S3-04, S3-05, S3-06, S3-07, S3-08, S3-09, S3-10, S3-11, S3-12, S3-13, S3-14, S3-15, S3-16, S3-17, S3-18, S3-19, S3-20, S3-21, S3-22, S3-23, S3-24, S3-25, S3-26, S3-27, S3-28, S3-29, S3-30, S3-31, S3-32 |
| Authorizer list | S4-01, S4-02, S4-03, S4-04, S4-05, S4-06, S4-07, S4-08 |
| Locked field: invoiced, deposits, two tabs, phone | S5-01, S5-02, S5-03, S5-04, S5-05, S5-06, S5-07, S5-08, S5-09, S5-10, S5-11, S5-12, S5-13, S5-14, S5-15, S5-16, S5-17, S5-18, S5-19, S5-20, S5-21, S5-22, S5-23, S5-24, S5-25 |
| Change Customer | S6-01, S6-02, S6-03, S6-04, S6-05, S6-06, S6-07, S6-08, S6-09, S6-10 |
| Invoicing: Bill To block, terms, PO, Over Credit, Credit Hold banner and badges | S7-01, S7-02, S7-03, S7-04, S7-05, S7-06, S7-07, S7-08, S7-09, S7-10, S7-11, S7-12, S7-13, S7-14, S7-15, S7-16, S7-17, S7-18, S7-19, S7-20, S7-21, S7-22, S7-23, S7-24, S7-25 |
| Invoices and estimates, modern and legacy, part sale, batch (Service For band) | S8-01, S8-02, S8-03, S8-04, S8-05, S8-06, S8-07, S8-08, S8-09, S8-10, S8-11, S8-12, S8-13, S8-14, S8-15 |
| Invoice email | S9-01, S9-02, S9-03, S9-04, S9-05, S9-06, S9-07 |
| Receivables, deposits, payments, credits, Invoices tab Service For column | S10-01, S10-02, S10-03, S10-04, S10-05, S10-06, S10-07, S10-08, S10-09, S10-10, S10-11, S10-12, S10-13 |
| Reverse and invoice again | S11-01, S11-02, S11-03, S11-04, S11-05, S11-06, S11-07, S11-08 |
| Delete customer | S12-01, S12-02, S12-03, S12-04, S12-05, S12-06, S12-07, S12-08, S12-09, S12-10, S12-11, S12-12, S12-13, S12-14 |
| Work Order Log | S13-01, S13-02, S13-03, S13-04, S13-05, S13-06 |
| Asset Work Orders tab | S14-01, S14-02, S14-03, S14-04, S14-05, S14-06, S14-07, S14-08, S14-09, S14-10, S14-11, S14-12, S14-13 |
| Internal / No Charge | S15-01, S15-02, S15-03, S15-04, S15-05, S15-06 |
| Customer portal | S16-01, S16-02, S16-03, S16-04, S16-05, S16-06, S16-07, S16-08 |
| QuickBooks | S17-01, S17-02, S17-03, S17-04, S17-05, S17-06, S17-07, S17-08 |
| AccountingHub | S18-01, S18-02, S18-03, S18-04, S18-05 |
| IBS and invoice CSV export | S19-01, S19-02, S19-03, S19-04, S19-05, S19-06, S19-07, S19-08 |
| Public API | API-01, API-02, API-03, API-04, API-05, API-06, API-07, API-08, API-09, API-10, API-11, API-12 |
| Cross-surface money parity | DATA-01, DATA-02, DATA-03, DATA-04 |
| Release day | REL-01, REL-02, REL-03, REL-04, REL-05 |
| What must not change | INV-01, INV-02, INV-03, INV-04, INV-05, INV-06, INV-07, INV-08 |
| Design — how it looks | D-01, D-02, D-03, D-04, D-05, D-06, D-07, D-08, D-09, D-10, D-11, D-12, D-13, D-14, D-15, D-16, D-17, D-18, D-19, D-20, D-21, D-22, D-23, D-24, D-25, D-26, D-27, D-28, D-29, D-30, D-31, D-32, D-33, D-34, D-35, D-36, D-37, D-38, D-39, D-40, D-41, D-42, D-43, D-44, D-45, D-46, D-47, D-48, D-49, D-50, D-51, D-52, D-53, D-54, D-55, D-56, D-57, D-58, D-59, D-60, D-61, D-62, D-63, D-64, D-65, D-66, D-67, D-68, D-69, D-70 |

Exact money and counts (Rule 116): 49 cases assert an exact $ figure with its arithmetic, among them the payer's balance on its Invoices tab, A/R Aging and statement (DATA-01), a part payment on every surface (DATA-02), deposits applied (DATA-03), revenue staying with the service customer (DATA-04, S10-12), the Over Credit warning on both sides of the limit (S7-07, S7-08), deposit totals in the lock message (S5-09, S5-11, S5-12), one payment across customers (S10-06), the unchanged total (S7-04, INV-02, INV-08). Counts: Pays for 1, 2 and 20 (S1-06, S1-08, S1-09, S1-14), the 50-customer list (S3-05), asset tab rows and the 8/9-option search threshold (S14).

## 7. Observations for the coordinator

- S12-R5 "open work orders keep their Bill To" cannot be reached through the Delete Customer window: S12-R7/S12-R8 refuse the delete first whenever the payer is the Bill To on any work order. The confirmation's words are checked; the behaviour has no reachable case (listed under points not asked).
- Labels taken from the design captions only for the screen's own words (no expected result from the design): Change Customer (two arrows at the top right of the Customer card), Confirmation "Are you sure you want to delete this company?", New Customer Payment, "Include 'For Customer' Attachments in email", "Customer: All customers", history mode. Labels the sources do not give (the email send action, the deposit-link action, the CSV export page, the A/R Aging and statement menus, Public API endpoint names) are written plainly and must be checked on the first build (Rule 9).
- `build/testing-tools/ticket_sweep.py` was widened to accept a decimal PRD version ("0.5"): `--prd-version` and `prd_version_handled` are read as numbers with decimals; whole-number versions behave exactly as before (Technician Toggle 20, Credit terms 5). The only change to a shared tool in this pass.

## 8. Round 2: design cases and References from Design

- **70 design cases** in section DESIGN (Design — how it looks), keys D-01..D-70, generated by `authoring/make_cases_design.py` from the design worker's drafts (`design-2026-11-09/DESIGN-CASE-PLAN.md`): D-01..D-60 from DC-01..DC-60, D-61..D-70 from DV-01..DV-10. Every title starts with Design and a colon; every case carries its References from Design block (canvas, page and figure, the pictures to attach from `design-2026-11-09/images/`, the design's own words, each checked word for word against the design package by build.py).
- Changes to the drafts (everything else is the drafts' wording):
  - all READY markers -> Rule 69 marker (no build yet)
  - DV markers name merged questions 4-13
  - held on a design question as their results state the asked-about place: DC-17 (question 12), DC-33 (question 13), DC-35 (question 13)
  - <customer X> -> [customer X's name] plus the square-bracket note
  - picture-vs-note notes added (dropped question 13): DC-01, DC-14, DC-19, DC-54
  - Rule 137: 'Have a/an ...' records made 'new ... for this test'; a precondition record not named in the steps or results gets its reason (', so ...')
  - DC-16: ', in the same style as the other rows (no border, ' -> ', in the same grey label and value sizes as the ro'
  - DC-22: ', in the same style as on a work order.' -> ', with the same grey label above the value as on a'
  - DC-46: '2. Tick invoice 1 and invoice 2.\n3. Print the sele' -> '2. Tick invoice 1.\n3. Tick invoice 2.\n4. Print the'
  - DC-46: 'Step 2:\n- Both rows are ticked.\nStep 3:' -> "Step 2:\n- Invoice 1's row is ticked.\nStep 3:\n- Bot"
  - DC-53: '**Title:** Design: Remove as default Bill To confi' -> '**Title:** Design: Remove as default Bill To confi'
  - DC-58: '(for example S2-16)' -> '(for example two work orders whose numbers both be'
- Map: DC-01 → D-01, DC-02 → D-02, DC-03 → D-03, DC-04 → D-04, DC-05 → D-05, DC-06 → D-06, DC-07 → D-07, DC-08 → D-08, DC-09 → D-09, DC-10 → D-10, DC-11 → D-11, DC-12 → D-12, DC-13 → D-13, DC-14 → D-14, DC-15 → D-15, DC-16 → D-16, DC-17 → D-17, DC-18 → D-18, DC-19 → D-19, DC-20 → D-20, DC-21 → D-21, DC-22 → D-22, DC-23 → D-23, DC-24 → D-24, DC-25 → D-25, DC-26 → D-26, DC-27 → D-27, DC-28 → D-28, DC-29 → D-29, DC-30 → D-30, DC-31 → D-31, DC-32 → D-32, DC-33 → D-33, DC-34 → D-34, DC-35 → D-35, DC-36 → D-36, DC-37 → D-37, DC-38 → D-38, DC-39 → D-39, DC-40 → D-40, DC-41 → D-41, DC-42 → D-42, DC-43 → D-43, DC-44 → D-44, DC-45 → D-45, DC-46 → D-46, DC-47 → D-47, DC-48 → D-48, DC-49 → D-49, DC-50 → D-50, DC-51 → D-51, DC-52 → D-52, DC-53 → D-53, DC-54 → D-54, DC-55 → D-55, DC-56 → D-56, DC-57 → D-57, DC-58 → D-58, DC-59 → D-59, DC-60 → D-60, DV-01 → D-61, DV-02 → D-62, DV-03 → D-63, DV-04 → D-64, DV-05 → D-65, DV-06 → D-66, DV-07 → D-67, DV-08 → D-68, DV-09 → D-69, DV-10 → D-70.
- **135 PRD cases** now carry a References from Design block, built from `SPEC-TO-DESIGN-2026-11-09.json` (codes SHOWN or DIFFERENT) and `DESIGN-FIGURES-2026-11-09.json`; a case whose screen no board draws has no heading. Where a quoted code differs from the design, the block names the register row and its question (Rule 130 item 3): S1-02, S1-03, S3-01, S3-02, S3-03, S3-04, S3-05, S3-06, S3-20, S3-32, S5-02, S5-04, S5-07, S5-14, S5-15, S5-16, S5-17, S5-18, S5-19, S5-20, S5-21, S5-25, S7-01, S7-02, S7-09, S7-10, S7-24, S7-25, S12-04, S12-05, S14-09, S14-10, S14-13.
- PRD cases held or changed for the design questions: S5-02 and S5-07 held on question 5 (their 10-second fade step depends on the Close button); S7-01 now names the modern layout and the legacy phone is the new held S7-24 (question 8); S7-09 no longer states the banner's place and the new held S7-25 checks the page header (question 13); new held S3-32, a long payer name in full (question 9); new held S14-13, the Bill To column with the payer's row on a later page (question 14); S18-01..S18-04 held on question 15.
- `create.py` now attaches each case's pictures (the names under References from Design), idempotent and read back, as Technician Toggle's does.

## 9. Reading coverage (Rule 119)

| Source | Size | Read |
|---|---|---|
| PRD `sources/CONFLUENCE-1003585538-v0.5-2026-11-09.md` | 53,054 bytes, 1,049 lines | lines 1–1049, 100% |
| Tickets `sources/JIRA-SV-12289-tickets-2026-11-09.md` (epic + 19 stories) | 66,031 bytes, 814 lines | lines 1–814, 100%; plus every code compared by script |
| Jira sweep `sources/jira-sweep-2026-11-09.json` | 20 issues | read by script (keys, types, updated) for the ledger |
| Design captions `design-2026-11-09/files/project/*.dc.html` (8 boards) | 97,134 bytes | visible text of all 8 boards read, for the screen's own labels only; the design drive (every board, clickable and screenshot) is the design worker's |
| Design round outputs (read only): DESIGN-CASE-PLAN.md (153,620 bytes), NEW-QUESTIONS.py, DESIGN-DIVERGENCE-REGISTER.json, SPEC-TO-DESIGN and DESIGN-FIGURES json | — | all 70 drafts parsed by script and the generated cases read through gates and samples; the 13 questions and 13 differences printed and read in full; 197 spec rows and 126 figures read by script |
| Rules and skills | — | LESSONS-REGISTER (every row); Rules 4, 96, 113, 114, 116, 117 (all amendments), 122, 129, 130, 132, 134–138; IDEAL-TEST-CASE-STANDARD; skill 17 in full; skill 07 §0–§6 |

## OUTSTANDING — what I need from you

- TestRail: create the 24 proposed subsections under 132467 (`sections.json`), then `create.py --apply`, with the QA lead's go-ahead (Rule 6). The creation hold (Rule 62, H1) must be checked as lifted before any new case is created.
- Decide NO-MANUAL-PROPOSAL.md: the cases a tester cannot set up go to TestRail held, or stay in the library only.
- Send the 15 questions in PO-QUESTIONS-DRAFT.md to Chris Ward (question sheet, Rule 131) and add them to `build/PO-QUESTIONS-OPEN.md` (Rule 132).
- A QA branch for Bill To, to lift the Rule 69 marker; the tech plan when it exists; product code access for the skill 17 baseline.

**Waiting on the PO:** nothing sent yet. Once sent: Chris Ward questions 1–15 (Bill To); question 1 holds S5-16, S5-17, S5-18, S5-19; question 2 holds S7-22; question 3 holds S7-23; question 4 holds ; question 5 holds S5-02, S5-07; question 6 holds ; question 7 holds ; question 8 holds S7-24; question 9 holds S3-32; question 10 holds ; question 11 holds ; question 12 holds ; question 13 holds S7-25; question 14 holds S14-13; question 15 holds S18-01, S18-02, S18-03, S18-04.
